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
  Sparkles,
} from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { AddBookModal } from '@/components/AddBookModal';
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

  const dailyRecall = useMemo(
    () => getDailyRecallSession(library, recallOffset),
    [library, recallOffset]
  );

  const readingBooks = useMemo(
    () => library.books.filter((b) => b.status === 'reading'),
    [library.books]
  );

  const archiveBooks = useMemo(
    () => library.books.filter((b) => b.status !== 'reading'),
    [library.books]
  );

  const recentSessions = useMemo(
    () =>
      [...library.sessions]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 4),
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
      .sort((a, b) => b.sessionCount - a.sessionCount);
  }, [library.concepts, library.sessions]);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-sm opacity-60">
        Loading your reading commonplace...
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Spaced Recall Review (Daily Recall Widget) */}
      {dailyRecall && (
        <section
          className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
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
                · from {dailyRecall.book.title.split(':')[0]}
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

          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium tracking-tight leading-snug">
            {dailyRecall.session.ai_synthesis.headline}
          </h2>

          {dailyRecall.session.ai_synthesis.quotes?.[0] ? (
            <blockquote
              className="mt-4 pl-4 border-l-2 space-y-1"
              style={{ borderLeftColor: 'var(--accent-primary)' }}
            >
              <p className="font-serif-editorial italic text-base sm:text-lg leading-relaxed">
                &ldquo;{dailyRecall.session.ai_synthesis.quotes[0].quote}&rdquo;
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {dailyRecall.session.ai_synthesis.quotes[0].commentary}
              </p>
            </blockquote>
          ) : (
            <p
              className="mt-3 text-sm sm:text-base leading-relaxed max-w-3xl"
              style={{ color: 'var(--text-secondary)' }}
            >
              {dailyRecall.session.ai_synthesis.markdown.split('\n\n')[0]}
            </p>
          )}

          <div className="mt-5 flex items-center justify-between text-xs">
            <span style={{ color: 'var(--text-muted)' }}>
              Session {dailyRecall.session.session_number} ·{' '}
              {dailyRecall.session.chapter_or_pages}
            </span>
            <Link
              href={`/books/${dailyRecall.book.id}`}
              className="inline-flex items-center gap-1 font-medium hover:underline underline-offset-4"
              style={{ color: 'var(--accent-primary)' }}
            >
              Open Book Timeline
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Currently Reading Shelf */}
      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-serif-editorial text-2xl sm:text-3xl font-medium">
              Currently Reading
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Close the book after each sitting and capture what stuck from
              memory.
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
              const sessionCount = library.sessions.filter(
                (s) => s.book_id === book.id
              ).length;

              return (
                <div
                  key={book.id}
                  className="rounded-xl border p-5 flex flex-col justify-between gap-5 transition-shadow hover:shadow-sm"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/books/${book.id}`}
                        className="group block space-y-1"
                      >
                        <h3 className="font-serif-editorial text-xl font-medium leading-snug group-hover:underline underline-offset-4">
                          {book.title}
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {book.author}
                        </p>
                      </Link>
                      <span
                        className="font-mono-meta text-xs px-2 py-0.5 rounded-md shrink-0"
                        style={{
                          backgroundColor: 'var(--bg-subtle)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {sessionCount} sitting{sessionCount === 1 ? '' : 's'}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono-meta">
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
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-hairline)' }}>
                    <Link
                      href={`/books/${book.id}`}
                      className="text-xs font-medium opacity-75 hover:opacity-100"
                    >
                      View Timeline
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

      {/* Concept Clusters & Completed Archive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="font-serif-editorial text-xl font-medium">
            Recent Sittings
          </h2>
          <div className="space-y-3">
            {recentSessions.map((session) => {
              const book = library.books.find((b) => b.id === session.book_id);
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

        {/* Concept Clusters & Completed Shelf */}
        <aside className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-serif-editorial text-xl font-medium">
                Concept Clusters
              </h2>
              <Link
                href="/themes"
                className="text-xs hover:underline underline-offset-4"
                style={{ color: 'var(--accent-primary)' }}
              >
                Explore all
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
                  className="flex items-center justify-between px-4 py-3 text-sm hover:opacity-80 transition-opacity"
                  style={{ borderColor: 'var(--border-hairline)' }}
                >
                  <span className="flex items-center gap-2 font-medium">
                    <Network
                      className="w-3.5 h-3.5"
                      style={{ color: 'var(--accent-secondary)' }}
                    />
                    {concept.name}
                  </span>
                  <span
                    className="font-mono-meta text-[11px]"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {bookCount}b · {sessionCount}s
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {archiveBooks.length > 0 && (
            <section className="space-y-3">
              <h2 className="font-serif-editorial text-xl font-medium">
                Completed &amp; Paused
              </h2>
              <div className="space-y-2.5">
                {archiveBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/books/${book.id}`}
                    className="flex items-start gap-3 rounded-xl border p-3.5 hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-hairline)',
                    }}
                  >
                    <BookCheck
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: 'var(--accent-secondary)' }}
                    />
                    <div className="min-w-0">
                      <p className="font-serif-editorial text-base font-medium truncate">
                        {book.title}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {book.author} · {book.status}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

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
