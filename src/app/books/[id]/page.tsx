'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Compass,
  Lightbulb,
  Loader2,
  Plus,
  Quote as QuoteIcon,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { BookCover } from '@/components/BookCover';
import { SessionFlowModal } from '@/components/SessionFlowModal';
import { SessionSynthesisCard } from '@/components/SessionSynthesisCard';
import { BookStatus } from '@/types/reading';

export default function BookDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    library,
    isLoaded,
    updateBook,
    deleteBook,
    generateMasterThesis,
  } = useLibrary();

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [isSynthesizingThesis, setIsSynthesizingThesis] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'digest'>('timeline');

  const book = useMemo(
    () => library.books.find((b) => b.id === params.id) ?? null,
    [library.books, params.id]
  );

  const sessions = useMemo(
    () =>
      library.sessions
        .filter((s) => s.book_id === params.id)
        .sort((a, b) => b.session_number - a.session_number),
    [library.sessions, params.id]
  );

  const bookDigest = useMemo(() => {
    const quotes = sessions.flatMap((s) =>
      (s.ai_synthesis.quotes || []).map((q) => ({
        ...q,
        sessionNumber: s.session_number,
        chapter: s.chapter_or_pages,
      }))
    );
    const takeaways = sessions.flatMap((s) =>
      (s.ai_synthesis.takeaways || []).map((t) => ({
        text: t,
        sessionNumber: s.session_number,
      }))
    );
    const actionables = sessions.flatMap((s) =>
      (s.ai_synthesis.actionables || []).map((a) => ({
        text: a,
        sessionNumber: s.session_number,
      }))
    );
    const connections = sessions.flatMap((s) =>
      (s.ai_synthesis.connections || []).map((c) => ({
        text: c,
        sessionNumber: s.session_number,
      }))
    );
    const conceptIds = new Set(sessions.flatMap((s) => s.concept_ids));
    const concepts = library.concepts.filter((c) => conceptIds.has(c.id));

    return { quotes, takeaways, actionables, connections, concepts };
  }, [sessions, library.concepts]);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-sm opacity-60">Loading book...</div>
    );
  }

  if (!book) {
    return (
      <div className="py-20 text-center space-y-3">
        <p className="font-serif-editorial text-xl">Book not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm underline underline-offset-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Library
        </Link>
      </div>
    );
  }

  const pct = Math.min(
    100,
    Math.round((book.current_page / book.total_pages) * 100)
  );

  const handleStatusChange = async (status: BookStatus) => {
    await updateBook(book.id, {
      status,
      current_page:
        status === 'completed' ? book.total_pages : book.current_page,
    });
  };

  const handleGenerateThesis = async () => {
    setIsSynthesizingThesis(true);
    try {
      await generateMasterThesis(book.id);
    } finally {
      setIsSynthesizingThesis(false);
    }
  };

  const handleDelete = async () => {
    await deleteBook(book.id);
    router.push('/');
  };

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium opacity-70 hover:opacity-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Library
        </Link>
      </div>

      {/* Book Dossier Header */}
      <header
        className="rounded-2xl border p-6 sm:p-8 space-y-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="self-start">
            <BookCover
              title={book.title}
              author={book.author}
              coverUrl={book.cover_url}
              size="lg"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-mono-meta text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {book.status}
                  </span>
                  <span
                    className="font-mono-meta text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {sessions.length} sitting{sessions.length === 1 ? '' : 's'}{' '}
                    · {bookDigest.concepts.length} mental model
                    {bookDigest.concepts.length === 1 ? '' : 's'}
                  </span>
                </div>
                <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium tracking-tight">
                  {book.title}
                </h1>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  by {book.author}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <select
                  value={book.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as BookStatus)
                  }
                  className="rounded-lg border px-3 py-2 text-xs font-medium bg-transparent"
                  style={{ borderColor: 'var(--border-hairline)' }}
                  aria-label="Book status"
                >
                  <option value="reading">Reading</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>

                <button
                  onClick={() => setSessionModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white hover:opacity-90"
                  style={{ backgroundColor: 'var(--accent-primary)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  Log Sitting
                </button>

                <button
                  onClick={handleDelete}
                  className="p-2 rounded-lg border opacity-60 hover:opacity-100 hover:text-red-600"
                  style={{ borderColor: 'var(--border-hairline)' }}
                  title="Delete book"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono-meta">
                <span style={{ color: 'var(--text-muted)' }}>
                  Page {book.current_page} of {book.total_pages}
                </span>
                <span>{pct}% complete</span>
              </div>
              <div
                className="h-2 w-full rounded-full overflow-hidden"
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

            {/* Master Book Synthesis (Core Thesis) */}
            <div
              className="rounded-xl border p-5 space-y-3"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <span
                  className="font-mono-meta text-xs uppercase tracking-wider font-medium flex items-center gap-1.5"
                  style={{ color: 'var(--accent-secondary)' }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Master Book Synthesis (Core Thesis)
                </span>

                <button
                  onClick={handleGenerateThesis}
                  disabled={isSynthesizingThesis || sessions.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium disabled:opacity-40 hover:opacity-80"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  {isSynthesizingThesis ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      {book.core_thesis
                        ? 'Regenerate Core Thesis'
                        : 'Synthesize Core Thesis'}
                    </>
                  )}
                </button>
              </div>

              {book.core_thesis ? (
                <p className="font-serif-editorial text-base sm:text-lg leading-relaxed">
                  {book.core_thesis}
                </p>
              ) : (
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text-muted)' }}
                >
                  When you finish the book (or after several sittings), generate
                  a cohesive Core Thesis distilled from your own active recall
                  notes.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* View Switcher: Sittings Timeline vs. Book Knowledge Digest */}
      <section className="space-y-6">
        <div
          className="flex items-center justify-between gap-4 border-b pb-3 flex-wrap"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'bg-black/5 dark:bg-white/10'
                  : 'opacity-65 hover:opacity-100'
              }`}
            >
              Reading Sittings ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('digest')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'digest'
                  ? 'bg-black/5 dark:bg-white/10'
                  : 'opacity-65 hover:opacity-100'
              }`}
            >
              Knowledge Digest ({bookDigest.quotes.length + bookDigest.takeaways.length + bookDigest.connections.length})
            </button>
          </div>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {activeTab === 'timeline'
              ? 'Newest sitting first'
              : 'All extracted quotes, takeaways & cross-links'}
          </span>
        </div>

        {sessions.length === 0 ? (
          <div
            className="rounded-xl border border-dashed p-10 text-center space-y-3"
            style={{ borderColor: 'var(--border-hairline)' }}
          >
            <BookOpen className="w-6 h-6 mx-auto opacity-40" />
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              No reading sittings logged yet.
            </p>
            <button
              onClick={() => setSessionModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ backgroundColor: 'var(--accent-primary)' }}
            >
              Log First Sitting
            </button>
          </div>
        ) : activeTab === 'timeline' ? (
          <div
            className="relative pl-6 sm:pl-8 space-y-8 border-l"
            style={{ borderColor: 'var(--border-hairline)' }}
          >
            {sessions.map((session) => {
              const sessionConcepts = library.concepts.filter((c) =>
                session.concept_ids.includes(c.id)
              );

              return (
                <article
                  key={session.id}
                  className="relative rounded-2xl border overflow-hidden"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  <span
                    className="absolute -left-[31px] sm:-left-[39px] top-6 w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      borderColor: 'var(--accent-primary)',
                    }}
                  />

                  <div
                    className="p-5 sm:p-6 border-b space-y-3"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-hairline)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-mono-meta text-xs font-semibold uppercase tracking-wider"
                          style={{ color: 'var(--accent-primary)' }}
                        >
                          Sitting {session.session_number}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          · {session.chapter_or_pages}
                        </span>
                      </div>
                      <span
                        className="font-mono-meta text-[11px]"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {new Date(session.created_at).toLocaleDateString(
                          undefined,
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>

                    <div>
                      <p
                        className="font-mono-meta text-[10px] uppercase tracking-widest mb-1"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Your Closed-Book Recall
                      </p>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {session.raw_brain_dump}
                      </p>
                    </div>

                    {session.key_resonance_or_friction && (
                      <p
                        className="text-xs italic pt-1"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        Friction / Resonance: &ldquo;
                        {session.key_resonance_or_friction}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="p-5 sm:p-6">
                    <SessionSynthesisCard
                      synthesis={session.ai_synthesis}
                      concepts={sessionConcepts}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Concepts Linked */}
            <div
              className="md:col-span-2 rounded-xl border p-5 space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <h3 className="font-serif-editorial text-lg font-medium">
                Mental Models Touched
              </h3>
              <div className="flex flex-wrap gap-2">
                {bookDigest.concepts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/themes?concept=${encodeURIComponent(c.id)}`}
                    className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-hairline)',
                    }}
                  >
                    #{c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* All Curated Quotes */}
            <div
              className="rounded-xl border p-5 space-y-4"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <h3 className="font-serif-editorial text-lg font-medium flex items-center gap-2">
                <QuoteIcon
                  className="w-4 h-4"
                  style={{ color: 'var(--accent-primary)' }}
                />
                Curated Passages ({bookDigest.quotes.length})
              </h3>
              {bookDigest.quotes.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No verbatim quotes surfaced for this book yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {bookDigest.quotes.map((q, idx) => (
                    <blockquote
                      key={idx}
                      className="pl-3.5 border-l-2 space-y-1"
                      style={{ borderLeftColor: 'var(--accent-primary)' }}
                    >
                      <p className="font-serif-editorial italic text-sm leading-relaxed">
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        Sitting {q.sessionNumber} · {q.commentary}
                      </p>
                    </blockquote>
                  ))}
                </div>
              )}
            </div>

            {/* Takeaways & Actionables */}
            <div
              className="rounded-xl border p-5 space-y-4"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <h3 className="font-serif-editorial text-lg font-medium flex items-center gap-2">
                <Lightbulb
                  className="w-4 h-4"
                  style={{ color: 'var(--accent-secondary)' }}
                />
                Takeaways &amp; Actionables
              </h3>
              {bookDigest.takeaways.length === 0 &&
              bookDigest.actionables.length === 0 &&
              bookDigest.connections.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  No distilled takeaways or cross-links yet.
                </p>
              ) : (
                <div className="space-y-3 text-xs leading-relaxed">
                  {bookDigest.takeaways.map((t, i) => (
                    <p key={`t-${i}`} className="flex items-start gap-2">
                      <span className="opacity-50">•</span>
                      <span>{t.text}</span>
                    </p>
                  ))}
                  {bookDigest.actionables.map((a, i) => (
                    <p
                      key={`a-${i}`}
                      className="flex items-start gap-2"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <Compass className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <span>{a.text}</span>
                    </p>
                  ))}
                  {bookDigest.connections.map((c, i) => (
                    <p
                      key={`c-${i}`}
                      className="flex items-start gap-2"
                      style={{ color: 'var(--accent-secondary)' }}
                    >
                      <span>↗</span>
                      <span>{c.text}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      <SessionFlowModal
        book={sessionModalOpen ? book : null}
        onClose={() => setSessionModalOpen(false)}
      />
    </div>
  );
}
