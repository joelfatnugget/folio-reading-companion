'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BookCheck,
  BookOpen,
  Network,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { AddBookModal } from '@/components/AddBookModal';
import { BookCover } from '@/components/BookCover';
import { SessionFlowModal } from '@/components/SessionFlowModal';
import { TierBadge } from '@/components/TierBadge';
import { getDailyRecallSession } from '@/lib/storage/local-store';
import { Book } from '@/types/reading';

export default function DashboardPage() {
  const { library, isLoaded } = useLibrary();
  const [addBookOpen, setAddBookOpen] = useState(false);
  const [activeBookForSession, setActiveBookForSession] = useState<Book | null>(
    null
  );
  const [recallOffset, setRecallOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const dailyRecall = useMemo(
    () => getDailyRecallSession(library, recallOffset),
    [library, recallOffset]
  );

  const telemetry = useMemo(() => {
    const totalPagesRead = library.books.reduce(
      (sum, b) => sum + b.current_page,
      0
    );
    const conceptLinkCount = library.sessions.filter(
      (s) => s.synthesis_tier_used === 'concept_link'
    ).length;
    return {
      books: library.books.length,
      sittings: library.sessions.length,
      pagesRead: totalPagesRead,
      concepts: library.concepts.length,
      crossLinks: conceptLinkCount,
    };
  }, [library]);

  const readingBooks = useMemo(
    () => library.books.filter((b) => b.status === 'reading'),
    [library.books]
  );

  const archiveBooks = useMemo(
    () => library.books.filter((b) => b.status !== 'reading'),
    [library.books]
  );

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    return library.sessions
      .filter((s) => {
        const book = library.books.find((b) => b.id === s.book_id);
        const conceptNames = library.concepts
          .filter((c) => s.concept_ids.includes(c.id))
          .map((c) => c.name)
          .join(' ');
        const quotesText = (s.ai_synthesis.quotes || [])
          .map((qt) => `${qt.quote} ${qt.commentary}`)
          .join(' ');
        const haystack = [
          book?.title,
          book?.author,
          s.chapter_or_pages,
          s.raw_brain_dump,
          s.ai_synthesis.headline,
          s.ai_synthesis.markdown,
          quotesText,
          conceptNames,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      })
      .map((session) => ({
        session,
        book: library.books.find((b) => b.id === session.book_id)!,
      }))
      .filter((item) => Boolean(item.book));
  }, [searchQuery, library]);

  const recentSessions = useMemo(
    () =>
      [...library.sessions]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5),
    [library.sessions]
  );

  const conceptStats = useMemo(() => {
    return library.concepts
      .map((concept) => {
        const matchingSessions = library.sessions.filter((s) =>
          s.concept_ids.includes(concept.id)
        );
        const bookIds = new Set(matchingSessions.map((s) => s.book_id));
        return {
          concept,
          sessionCount: matchingSessions.length,
          bookCount: bookIds.size,
        };
      })
      .filter((item) => item.sessionCount > 0)
      .sort(
        (a, b) => b.bookCount - a.bookCount || b.sessionCount - a.sessionCount
      );
  }, [library.concepts, library.sessions]);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-sm opacity-60">
        Loading your reading commonplace...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Editorial Masthead & Telemetry */}
      <section
        className="pb-6 border-b flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        style={{ borderColor: 'var(--border-hairline)' }}
      >
        <div className="space-y-2 max-w-2xl">
          <p
            className="font-mono-meta text-[11px] uppercase tracking-widest"
            style={{ color: 'var(--accent-primary)' }}
          >
            Personal Commonplace &amp; Active Recall Library
          </p>
          <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-tight">
            Read deeply. Recall without looking. Connect across spines.
          </h1>
        </div>

        <div className="grid grid-cols-4 gap-4 sm:gap-6 shrink-0">
          <div>
            <p className="font-serif-editorial text-2xl font-medium">
              {telemetry.books}
            </p>
            <p
              className="font-mono-meta text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Volumes
            </p>
          </div>
          <div>
            <p className="font-serif-editorial text-2xl font-medium">
              {telemetry.sittings}
            </p>
            <p
              className="font-mono-meta text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Sittings
            </p>
          </div>
          <div>
            <p className="font-serif-editorial text-2xl font-medium">
              {telemetry.pagesRead.toLocaleString()}
            </p>
            <p
              className="font-mono-meta text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Pages Read
            </p>
          </div>
          <div>
            <p className="font-serif-editorial text-2xl font-medium">
              {telemetry.concepts}
            </p>
            <p
              className="font-mono-meta text-[10px] uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}
            >
              Models
            </p>
          </div>
        </div>
      </section>

      {/* Commonplace Search Bar */}
      <div className="relative">
        <Search
          className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search across all books, sitting recalls, verbatim quotes, and mental models..."
          className="w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm transition-colors focus:outline-none"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-70"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Live Search Results */}
      {searchResults !== null ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-editorial text-xl font-medium">
              Search Results ({searchResults.length})
            </h2>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
            >
              Clear filter
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div
              className="rounded-xl border p-8 text-center text-sm"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
                color: 'var(--text-muted)',
              }}
            >
              No sittings, quotes, or mental models matched &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {searchResults.map(({ session, book }) => (
                <Link
                  key={session.id}
                  href={`/books/${book.id}`}
                  className="rounded-xl border p-4 sm:p-5 flex items-start gap-4 hover:opacity-95"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  <BookCover
                    title={book.title}
                    author={book.author}
                    coverUrl={book.cover_url}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span
                        className="font-mono-meta text-[11px]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {book.title.split(':')[0]} · Sitting{' '}
                        {session.session_number} ({session.chapter_or_pages})
                      </span>
                      <TierBadge tier={session.synthesis_tier_used} />
                    </div>
                    <h3 className="font-serif-editorial text-lg font-medium">
                      {session.ai_synthesis.headline}
                    </h3>
                    <p
                      className="text-xs line-clamp-2 leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {session.ai_synthesis.markdown}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Spaced Recall Review (Daily Recall Widget) */}
          {dailyRecall && (
            <section
              className="rounded-2xl border p-6 sm:p-8"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: 'var(--accent-primary)' }}
                  />
                  <span
                    className="font-mono-meta text-xs uppercase tracking-widest font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Daily Spaced Recall
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    · {dailyRecall.book.title.split(':')[0]} by{' '}
                    {dailyRecall.book.author}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <TierBadge tier={dailyRecall.session.synthesis_tier_used} />
                  <button
                    onClick={() => setRecallOffset((n) => n + 1)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs hover:opacity-80"
                    style={{ borderColor: 'var(--border-hairline)' }}
                    title="Surface another past insight"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Shuffle
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="hidden sm:block">
                  <BookCover
                    title={dailyRecall.book.title}
                    author={dailyRecall.book.author}
                    coverUrl={dailyRecall.book.cover_url}
                    size="md"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-tight leading-snug">
                    {dailyRecall.session.ai_synthesis.headline}
                  </h2>

                  {dailyRecall.session.ai_synthesis.quotes?.[0] ? (
                    <blockquote
                      className="pl-4 border-l-2 space-y-1"
                      style={{ borderLeftColor: 'var(--accent-primary)' }}
                    >
                      <p className="font-serif-editorial italic text-base sm:text-lg leading-relaxed">
                        &ldquo;{dailyRecall.session.ai_synthesis.quotes[0].quote}
                        &rdquo;
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {dailyRecall.session.ai_synthesis.quotes[0].commentary}
                      </p>
                    </blockquote>
                  ) : (
                    <p
                      className="text-sm sm:text-base leading-relaxed max-w-3xl"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {dailyRecall.session.ai_synthesis.markdown.split('\n\n')[0]}
                    </p>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs flex-wrap gap-2">
                    <span style={{ color: 'var(--text-muted)' }}>
                      Sitting {dailyRecall.session.session_number} ·{' '}
                      {dailyRecall.session.chapter_or_pages}
                    </span>
                    <Link
                      href={`/books/${dailyRecall.book.id}`}
                      className="inline-flex items-center gap-1 font-medium hover:underline underline-offset-4"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      Open Book Dossier
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Currently Reading Shelf */}
          <section className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium">
                  Reading Desk
                </h2>
                <p
                  className="text-sm mt-1"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Active volumes. Close the book after each sitting and record
                  what you recall from memory.
                </p>
              </div>
              <button
                onClick={() => setAddBookOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-xs font-medium hover:opacity-80 transition-opacity shrink-0"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Book
              </button>
            </div>

            {readingBooks.length === 0 ? (
              <div
                className="rounded-xl border border-dashed p-8 text-center space-y-3"
                style={{ borderColor: 'var(--border-hairline)' }}
              >
                <BookOpen className="w-6 h-6 mx-auto opacity-40" />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No active books on your desk right now.
                </p>
                <button
                  onClick={() => setAddBookOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-white"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  Start a Book
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {readingBooks.map((book) => {
                  const pct = Math.min(
                    100,
                    Math.round((book.current_page / book.total_pages) * 100)
                  );
                  const bookSessions = library.sessions
                    .filter((s) => s.book_id === book.id)
                    .sort((a, b) => b.session_number - a.session_number);
                  const latest = bookSessions[0];

                  return (
                    <div
                      key={book.id}
                      className="rounded-xl border p-5 flex flex-col justify-between gap-5 transition-shadow hover:shadow-sm"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        borderColor: 'var(--border-hairline)',
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <Link href={`/books/${book.id}`}>
                          <BookCover
                            title={book.title}
                            author={book.author}
                            coverUrl={book.cover_url}
                            size="md"
                          />
                        </Link>
                        <div className="min-w-0 flex-1 space-y-2.5">
                          <div>
                            <Link
                              href={`/books/${book.id}`}
                              className="group block"
                            >
                              <h3 className="font-serif-editorial text-xl font-medium leading-snug group-hover:underline underline-offset-4">
                                {book.title}
                              </h3>
                            </Link>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {book.author} · {bookSessions.length} sitting
                              {bookSessions.length === 1 ? '' : 's'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] font-mono-meta">
                              <span style={{ color: 'var(--text-muted)' }}>
                                p. {book.current_page} / {book.total_pages}
                              </span>
                              <span>{pct}%</span>
                            </div>
                            <div
                              className="h-1.5 w-full rounded-full overflow-hidden"
                              style={{ backgroundColor: 'var(--bg-subtle)' }}
                            >
                              <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                  width: `${pct}%`,
                                  backgroundColor: 'var(--accent-secondary)',
                                }}
                              />
                            </div>
                          </div>

                          {latest && (
                            <p
                              className="text-xs line-clamp-2 leading-relaxed"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <span className="font-medium">Last sitting: </span>
                              {latest.ai_synthesis.headline}
                            </p>
                          )}
                        </div>
                      </div>

                      <div
                        className="flex items-center justify-between pt-3 border-t"
                        style={{ borderColor: 'var(--border-hairline)' }}
                      >
                        <Link
                          href={`/books/${book.id}`}
                          className="text-xs font-medium opacity-75 hover:opacity-100"
                        >
                          Open Book Dossier →
                        </Link>
                        <button
                          onClick={() => setActiveBookForSession(book)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white hover:opacity-90 transition-opacity"
                          style={{ backgroundColor: 'var(--accent-primary)' }}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Log Session
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Completed & Paused Library + Mental Models */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {archiveBooks.length > 0 && (
                <section className="space-y-4">
                  <h2 className="font-serif-editorial text-2xl font-medium">
                    Completed &amp; Reference Library
                  </h2>
                  <div className="space-y-3">
                    {archiveBooks.map((book) => {
                      const sessionCount = library.sessions.filter(
                        (s) => s.book_id === book.id
                      ).length;
                      return (
                        <Link
                          key={book.id}
                          href={`/books/${book.id}`}
                          className="rounded-xl border p-4 sm:p-5 flex items-start gap-4 hover:opacity-95 transition-opacity"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            borderColor: 'var(--border-hairline)',
                          }}
                        >
                          <BookCover
                            title={book.title}
                            author={book.author}
                            coverUrl={book.cover_url}
                            size="sm"
                          />
                          <div className="min-w-0 flex-1 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h3 className="font-serif-editorial text-lg font-medium leading-snug">
                                {book.title}
                              </h3>
                              <span
                                className="font-mono-meta text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                                style={{
                                  backgroundColor: 'var(--bg-subtle)',
                                  color: 'var(--accent-secondary)',
                                }}
                              >
                                <BookCheck className="w-3 h-3" />
                                {book.status} · {sessionCount} sittings
                              </span>
                            </div>
                            <p
                              className="text-xs"
                              style={{ color: 'var(--text-muted)' }}
                            >
                              {book.author} · {book.total_pages} pages
                            </p>
                            {book.core_thesis && (
                              <p
                                className="text-xs leading-relaxed line-clamp-2 pt-0.5"
                                style={{ color: 'var(--text-secondary)' }}
                              >
                                <span className="font-medium">Core Thesis: </span>
                                {book.core_thesis}
                              </p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              <section className="space-y-4">
                <h2 className="font-serif-editorial text-2xl font-medium">
                  Recent Sittings
                </h2>
                <div className="space-y-3">
                  {recentSessions.map((session) => {
                    const book = library.books.find(
                      (b) => b.id === session.book_id
                    );
                    if (!book) return null;
                    return (
                      <Link
                        key={session.id}
                        href={`/books/${book.id}`}
                        className="block rounded-xl border p-4 hover:opacity-95 transition-opacity"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          borderColor: 'var(--border-hairline)',
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
                          <span
                            className="font-mono-meta text-[11px]"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {book.title.split(':')[0]} · Sitting{' '}
                            {session.session_number} ({session.chapter_or_pages})
                          </span>
                          <TierBadge tier={session.synthesis_tier_used} />
                        </div>
                        <p className="font-serif-editorial text-base font-medium">
                          {session.ai_synthesis.headline}
                        </p>
                        <p
                          className="text-xs mt-1 line-clamp-2"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {session.raw_brain_dump}
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Mental Models Directory */}
            <aside className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif-editorial text-2xl font-medium">
                  Mental Models
                </h2>
                <Link
                  href="/themes"
                  className="text-xs hover:underline underline-offset-4"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  Open Atlas →
                </Link>
              </div>
              <div
                className="rounded-xl border divide-y"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                {conceptStats.map(({ concept, sessionCount, bookCount }) => (
                  <Link
                    key={concept.id}
                    href={`/themes?concept=${encodeURIComponent(concept.id)}`}
                    className="block px-4 py-3.5 hover:opacity-80 transition-opacity space-y-1"
                    style={{ borderColor: 'var(--border-hairline)' }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <Network
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: 'var(--accent-secondary)' }}
                        />
                        {concept.name}
                      </span>
                      <span
                        className="font-mono-meta text-[11px] shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {bookCount}b · {sessionCount}s
                      </span>
                    </div>
                    {concept.description && (
                      <p
                        className="text-xs line-clamp-2 pl-5.5"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {concept.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}

      <AddBookModal
        open={addBookOpen}
        onClose={() => setAddBookOpen(false)}
      />
      <SessionFlowModal
        book={activeBookForSession}
        onClose={() => setActiveBookForSession(null)}
      />
    </div>
  );
}
