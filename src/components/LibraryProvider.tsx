'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createBookRecord,
  exportLibraryJSON,
  loadLLMConfig,
  loadLibrary,
  resetToSeedLibrary,
  saveLLMConfig,
  saveLibrary,
  upsertConceptsByName,
} from '@/lib/storage/local-store';
import { SEED_LIBRARY_DATA } from '@/lib/seed-data';
import {
  AISynthesis,
  Book,
  BookStatus,
  Concept,
  LLMConfig,
  LibraryData,
  ReadingSession,
} from '@/types/reading';

interface LibraryContextValue {
  library: LibraryData;
  isLoaded: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  llmConfig: LLMConfig;
  updateLLMConfig: (config: LLMConfig) => void;
  addBook: (input: {
    title: string;
    author: string;
    total_pages: number;
    current_page?: number;
    status?: BookStatus;
  }) => Promise<Book>;
  updateBook: (
    bookId: string,
    patch: Partial<Omit<Book, 'id' | 'created_at'>>
  ) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  submitReadingSession: (input: {
    bookId: string;
    chapterOrPages: string;
    newCurrentPage?: number;
    rawBrainDump: string;
    keyResonanceOrFriction?: string;
    manualConcepts?: string[];
  }) => Promise<ReadingSession>;
  generateMasterThesis: (bookId: string) => Promise<string>;
  exportJSON: () => void;
  importJSON: (raw: string) => Promise<void>;
  resetLibrary: () => Promise<void>;
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<LibraryData>(SEED_LIBRARY_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({ provider: 'openai' });
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const storedTheme = window.localStorage.getItem('folio_theme');
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const initialTheme =
      storedTheme === 'dark' || (!storedTheme && prefersDark)
        ? 'dark'
        : 'light';
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');

    loadLibrary().then((data) => {
      if (active) {
        setLibrary(data);
        setLlmConfig(loadLLMConfig());
        setTheme(initialTheme);
        setIsLoaded(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.classList.toggle('dark', next === 'dark');
      window.localStorage.setItem('folio_theme', next);
      return next;
    });
  }, []);

  const updateLLMConfig = useCallback((config: LLMConfig) => {
    setLlmConfig(config);
    saveLLMConfig(config);
  }, []);

  const persist = useCallback(async (next: LibraryData) => {
    setLibrary(next);
    await saveLibrary(next);
  }, []);

  const addBook = useCallback(
    async (input: {
      title: string;
      author: string;
      total_pages: number;
      current_page?: number;
      status?: BookStatus;
    }) => {
      const book = createBookRecord(input);
      const next: LibraryData = {
        ...library,
        books: [book, ...library.books],
      };
      await persist(next);
      return book;
    },
    [library, persist]
  );

  const updateBook = useCallback(
    async (
      bookId: string,
      patch: Partial<Omit<Book, 'id' | 'created_at'>>
    ) => {
      const next: LibraryData = {
        ...library,
        books: library.books.map((b) =>
          b.id === bookId
            ? { ...b, ...patch, updated_at: new Date().toISOString() }
            : b
        ),
      };
      await persist(next);
    },
    [library, persist]
  );

  const deleteBook = useCallback(
    async (bookId: string) => {
      const next: LibraryData = {
        ...library,
        books: library.books.filter((b) => b.id !== bookId),
        sessions: library.sessions.filter((s) => s.book_id !== bookId),
      };
      await persist(next);
    },
    [library, persist]
  );

  const submitReadingSession = useCallback(
    async (input: {
      bookId: string;
      chapterOrPages: string;
      newCurrentPage?: number;
      rawBrainDump: string;
      keyResonanceOrFriction?: string;
      manualConcepts?: string[];
    }) => {
      const book = library.books.find((b) => b.id === input.bookId);
      if (!book) throw new Error('Book not found');

      const priorSessionsInBook = library.sessions
        .filter((s) => s.book_id === book.id)
        .sort((a, b) => a.session_number - b.session_number);

      const otherBooksWithSessions = library.books
        .filter((b) => b.id !== book.id)
        .map((other) => ({
          book: other,
          sessions: library.sessions.filter((s) => s.book_id === other.id),
        }))
        .filter((entry) => entry.sessions.length > 0);

      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'session',
          context: {
            book,
            chapterOrPages: input.chapterOrPages,
            rawBrainDump: input.rawBrainDump,
            keyResonanceOrFriction: input.keyResonanceOrFriction || null,
            priorSessionsInBook,
            otherBooksWithSessions,
            existingConcepts: library.concepts,
          },
          llmConfig,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate AI synthesis');
      }

      const data = (await res.json()) as { synthesis: AISynthesis };
      const synthesis = data.synthesis;

      const combinedConceptNames = Array.from(
        new Set([
          ...(synthesis.suggested_concepts || []),
          ...(input.manualConcepts || []),
        ])
      );

      const { concepts: updatedConcepts, ids: conceptIds } =
        upsertConceptsByName(library.concepts, combinedConceptNames);

      const nextSessionNumber =
        priorSessionsInBook.length > 0
          ? priorSessionsInBook[priorSessionsInBook.length - 1]
              .session_number + 1
          : 1;

      const newSession: ReadingSession = {
        id: `session-${crypto.randomUUID().slice(0, 8)}`,
        book_id: book.id,
        session_number: nextSessionNumber,
        chapter_or_pages: input.chapterOrPages.trim() || `Sitting ${nextSessionNumber}`,
        raw_brain_dump: input.rawBrainDump.trim(),
        key_resonance_or_friction:
          input.keyResonanceOrFriction?.trim() || null,
        ai_synthesis: synthesis,
        synthesis_tier_used: synthesis.tier,
        concept_ids: conceptIds,
        created_at: new Date().toISOString(),
      };

      const nextCurrentPage =
        typeof input.newCurrentPage === 'number' && !Number.isNaN(input.newCurrentPage)
          ? Math.min(book.total_pages, Math.max(0, input.newCurrentPage))
          : book.current_page;

      const nextStatus: BookStatus =
        nextCurrentPage >= book.total_pages ? 'completed' : book.status;

      const nextLibrary: LibraryData = {
        ...library,
        concepts: updatedConcepts,
        sessions: [...library.sessions, newSession],
        books: library.books.map((b) =>
          b.id === book.id
            ? {
                ...b,
                current_page: nextCurrentPage,
                status: nextStatus,
                updated_at: new Date().toISOString(),
              }
            : b
        ),
      };

      await persist(nextLibrary);
      return newSession;
    },
    [library, llmConfig, persist]
  );

  const generateMasterThesis = useCallback(
    async (bookId: string) => {
      const book = library.books.find((b) => b.id === bookId);
      if (!book) throw new Error('Book not found');

      const sessions = library.sessions
        .filter((s) => s.book_id === bookId)
        .sort((a, b) => a.session_number - b.session_number);

      const conceptIds = new Set(sessions.flatMap((s) => s.concept_ids));
      const concepts: Concept[] = library.concepts.filter((c) =>
        conceptIds.has(c.id)
      );

      const res = await fetch('/api/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'master_thesis',
          book,
          sessions,
          concepts,
          llmConfig,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate master thesis');
      }

      const data = (await res.json()) as { core_thesis: string };
      await updateBook(bookId, {
        core_thesis: data.core_thesis,
        status: 'completed',
        current_page: book.total_pages,
      });
      return data.core_thesis;
    },
    [library, llmConfig, updateBook]
  );

  const exportJSON = useCallback(() => {
    const json = exportLibraryJSON(library);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `folio-library-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [library]);

  const importJSON = useCallback(
    async (raw: string) => {
      const parsed = JSON.parse(raw) as LibraryData;
      if (
        !Array.isArray(parsed.books) ||
        !Array.isArray(parsed.sessions) ||
        !Array.isArray(parsed.concepts)
      ) {
        throw new Error('Invalid Folio library JSON structure.');
      }
      await persist({
        version: parsed.version || 1,
        books: parsed.books,
        sessions: parsed.sessions,
        concepts: parsed.concepts,
      });
    },
    [persist]
  );

  const resetLibrary = useCallback(async () => {
    const fresh = await resetToSeedLibrary();
    setLibrary(fresh);
  }, []);

  return (
    <LibraryContext.Provider
      value={{
        library,
        isLoaded,
        theme,
        toggleTheme,
        llmConfig,
        updateLLMConfig,
        addBook,
        updateBook,
        deleteBook,
        submitReadingSession,
        generateMasterThesis,
        exportJSON,
        importJSON,
        resetLibrary,
        settingsOpen,
        setSettingsOpen,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return ctx;
}
