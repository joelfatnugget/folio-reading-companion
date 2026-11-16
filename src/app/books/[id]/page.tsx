'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
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
      current_page: status === 'completed' ? book.total_pages : book.current_page,
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

      {/* Book Header */}
      <header
        className="rounded-2xl border p-6 sm:p-8 space-y-6"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
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
                {sessions.length} sitting{sessions.length === 1 ? '' : 's'}
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
              onChange={(e) => handleStatusChange(e.target.value as BookStatus)}
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
              Log Reading Sitting
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
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              When you finish the book (or after several sittings), generate a
              cohesive Core Thesis distilled from your own active recall notes.
            </p>
          )}
        </div>
      </header>

      {/* Reading Sittings Vertical Timeline */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif-editorial text-2xl font-medium">
            Reading Sittings Timeline
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Newest sitting first
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
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 border-l" style={{ borderColor: 'var(--border-hairline)' }}>
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
                  {/* Timeline dot */}
                  <span
                    className="absolute -left-[31px] sm:-left-[39px] top-6 w-3 h-3 rounded-full border-2"
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      borderColor: 'var(--accent-primary)',
                    }}
                  />

                  {/* User's Closed-Book Recall */}
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

                  {/* AI Editorial Synthesis */}
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
        )}
      </section>

      <SessionFlowModal
        book={sessionModalOpen ? book : null}
        onClose={() => setSessionModalOpen(false)}
      />
    </div>
  );
}
