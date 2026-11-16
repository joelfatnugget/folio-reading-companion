import { SEED_LIBRARY_DATA } from '@/lib/seed-data';
import {
  Book,
  BookStatus,
  Concept,
  LLMConfig,
  LibraryData,
  ReadingSession,
} from '@/types/reading';

const STORAGE_KEY = 'folio_library_v1';
const LLM_CONFIG_KEY = 'folio_llm_config_v1';
const DB_NAME = 'folio_reading_db';
const STORE_NAME = 'library_store';
const DB_RECORD_KEY = 'singleton';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('indexedDB' in window)) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readFromIDB(): Promise<LibraryData | null> {
  try {
    const db = await openIndexedDB();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(DB_RECORD_KEY);
      req.onsuccess = () => resolve((req.result as LibraryData) ?? null);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

async function writeToIDB(data: LibraryData): Promise<void> {
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(data, DB_RECORD_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Fallback handled by localStorage
  }
}

export async function loadLibrary(): Promise<LibraryData> {
  if (typeof window === 'undefined') {
    return SEED_LIBRARY_DATA;
  }

  const upgradeIfNeeded = async (data: LibraryData): Promise<LibraryData> => {
    if ((data.version ?? 1) >= SEED_LIBRARY_DATA.version) {
      return data;
    }
    const existingBookIds = new Set(data.books.map((b) => b.id));
    const existingSessionIds = new Set(data.sessions.map((s) => s.id));
    const existingConceptIds = new Set(data.concepts.map((c) => c.id));

    const merged: LibraryData = {
      version: SEED_LIBRARY_DATA.version,
      books: [
        ...data.books,
        ...SEED_LIBRARY_DATA.books.filter((b) => !existingBookIds.has(b.id)),
      ],
      sessions: [
        ...data.sessions,
        ...SEED_LIBRARY_DATA.sessions.filter(
          (s) => !existingSessionIds.has(s.id)
        ),
      ],
      concepts: [
        ...data.concepts,
        ...SEED_LIBRARY_DATA.concepts.filter(
          (c) => !existingConceptIds.has(c.id)
        ),
      ],
    };
    await saveLibrary(merged);
    return merged;
  };

  const idbData = await readFromIDB();
  if (idbData && Array.isArray(idbData.books)) {
    return upgradeIfNeeded(idbData);
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LibraryData;
      if (Array.isArray(parsed.books)) {
        const upgraded = await upgradeIfNeeded(parsed);
        await writeToIDB(upgraded);
        return upgraded;
      }
    }
  } catch {
    // Ignore parse errors and re-seed
  }

  await saveLibrary(SEED_LIBRARY_DATA);
  return SEED_LIBRARY_DATA;
}

export async function saveLibrary(data: LibraryData): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore quota errors
  }
  await writeToIDB(data);
}

export async function resetToSeedLibrary(): Promise<LibraryData> {
  const fresh = structuredClone(SEED_LIBRARY_DATA);
  await saveLibrary(fresh);
  return fresh;
}

export function loadLLMConfig(): LLMConfig {
  if (typeof window === 'undefined') {
    return { provider: 'openai' };
  }
  try {
    const raw = window.localStorage.getItem(LLM_CONFIG_KEY);
    if (raw) return JSON.parse(raw) as LLMConfig;
  } catch {
    // Ignore
  }
  return { provider: 'openai' };
}

export function saveLLMConfig(config: LLMConfig): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LLM_CONFIG_KEY, JSON.stringify(config));
}

export function upsertConceptsByName(
  existing: Concept[],
  names: string[]
): { concepts: Concept[]; ids: string[] } {
  const next = [...existing];
  const ids: string[] = [];

  for (const rawName of names) {
    const clean = rawName.trim();
    if (!clean) continue;
    const found = next.find(
      (c) => c.name.toLowerCase() === clean.toLowerCase()
    );
    if (found) {
      ids.push(found.id);
    } else {
      const created: Concept = {
        id: `concept-${clean.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36).slice(-4)}`,
        name: clean,
      };
      next.push(created);
      ids.push(created.id);
    }
  }

  return { concepts: next, ids: Array.from(new Set(ids)) };
}

export function createBookRecord(input: {
  title: string;
  author: string;
  total_pages: number;
  current_page?: number;
  status?: BookStatus;
  cover_url?: string | null;
}): Book {
  const now = new Date().toISOString();
  return {
    id: `book-${crypto.randomUUID().slice(0, 8)}`,
    title: input.title.trim(),
    author: input.author.trim(),
    cover_url: input.cover_url?.trim() || null,
    status: input.status || 'reading',
    current_page: Math.max(0, input.current_page ?? 0),
    total_pages: Math.max(1, input.total_pages),
    core_thesis: null,
    created_at: now,
    updated_at: now,
  };
}

export function exportLibraryJSON(data: LibraryData): string {
  return JSON.stringify(
    {
      ...data,
      exported_at: new Date().toISOString(),
    },
    null,
    2
  );
}

export function getDailyRecallSession(
  data: LibraryData,
  offset = 0
): { session: ReadingSession; book: Book } | null {
  const completedBookIds = new Set(
    data.books.filter((b) => b.status === 'completed').map((b) => b.id)
  );
  const completedSessions = data.sessions.filter((s) =>
    completedBookIds.has(s.book_id)
  );
  const pool = completedSessions.length > 0 ? completedSessions : data.sessions;
  if (pool.length === 0) return null;

  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const idx = (dayIndex + offset) % pool.length;
  const session = pool[idx];
  const book = data.books.find((b) => b.id === session.book_id);
  if (!book) return null;

  return { session, book };
}
