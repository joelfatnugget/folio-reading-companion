'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  HelpCircle,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { TierBadge } from '@/components/TierBadge';
import { Book, ReadingSession } from '@/types/reading';

interface SessionFlowModalProps {
  book: Book | null;
  onClose: () => void;
  onSessionCreated?: (session: ReadingSession) => void;
}

export function SessionFlowModal({
  book,
  onClose,
  onSessionCreated,
}: SessionFlowModalProps) {
  const { library, submitReadingSession } = useLibrary();

  const lastSession = useMemo(() => {
    if (!book) return null;
    const bookSessions = library.sessions
      .filter((s) => s.book_id === book.id)
      .sort((a, b) => b.session_number - a.session_number);
    return bookSessions[0] ?? null;
  }, [book, library.sessions]);

  const [step, setStep] = useState<'prime' | 'dump'>('prime');
  const [chapterOrPages, setChapterOrPages] = useState('');
  const [newCurrentPage, setNewCurrentPage] = useState(
    book ? String(book.current_page) : ''
  );
  const [rawBrainDump, setRawBrainDump] = useState('');
  const [friction, setFriction] = useState('');
  const [manualTags, setManualTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!book) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawBrainDump.trim()) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await submitReadingSession({
        bookId: book.id,
        chapterOrPages: chapterOrPages.trim() || `Sitting ${(lastSession?.session_number ?? 0) + 1}`,
        newCurrentPage: newCurrentPage ? Number(newCurrentPage) : undefined,
        rawBrainDump,
        keyResonanceOrFriction: friction.trim() || undefined,
        manualConcepts: manualTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      setChapterOrPages('');
      setRawBrainDump('');
      setFriction('');
      setManualTags('');
      setStep('prime');
      onSessionCreated?.(created);
      onClose();
    } catch {
      setError('Could not synthesize session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className="w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-8"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-hairline)',
        }}
      >
        {/* Top bar */}
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'var(--border-hairline)' }}
        >
          <div>
            <span
              className="font-mono-meta text-[11px] uppercase tracking-widest"
              style={{ color: 'var(--text-muted)' }}
            >
              {step === 'prime'
                ? 'Step 1 · Pre-Session Prime'
                : 'Step 2 · Closed-Book Brain Dump'}
            </span>
            <h2 className="font-serif-editorial text-xl font-medium mt-0.5">
              {book.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-75"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'prime' ? (
          <div className="p-6 sm:p-8 space-y-6">
            {lastSession ? (
              <div
                className="rounded-xl border p-5 space-y-4"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className="font-mono-meta text-xs uppercase tracking-wider font-medium"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    Previously on Session {lastSession.session_number} ·{' '}
                    {lastSession.chapter_or_pages}
                  </span>
                  <TierBadge tier={lastSession.synthesis_tier_used} />
                </div>

                <div>
                  <h3 className="font-serif-editorial text-lg font-medium">
                    {lastSession.ai_synthesis.headline}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mt-2 whitespace-pre-line"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {lastSession.ai_synthesis.markdown}
                  </p>
                </div>

                {(lastSession.key_resonance_or_friction ||
                  lastSession.ai_synthesis.open_question) && (
                  <div
                    className="pt-3 border-t flex items-start gap-2.5"
                    style={{ borderColor: 'var(--border-hairline)' }}
                  >
                    <HelpCircle
                      className="w-4 h-4 mt-0.5 shrink-0"
                      style={{ color: 'var(--accent-secondary)' }}
                    />
                    <div className="text-xs leading-relaxed space-y-1">
                      {lastSession.key_resonance_or_friction && (
                        <p>
                          <span className="font-semibold">Your open friction: </span>
                          {lastSession.key_resonance_or_friction}
                        </p>
                      )}
                      {lastSession.ai_synthesis.open_question && (
                        <p style={{ color: 'var(--text-muted)' }}>
                          <span className="font-semibold">Prompt to hold: </span>
                          {lastSession.ai_synthesis.open_question}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className="rounded-xl border p-6 text-center space-y-2"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-hairline)',
                }}
              >
                <BookOpenCheck
                  className="w-6 h-6 mx-auto"
                  style={{ color: 'var(--accent-secondary)' }}
                />
                <h3 className="font-serif-editorial text-lg font-medium">
                  First Sitting with {book.title}
                </h3>
                <p
                  className="text-sm max-w-md mx-auto"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Read with your pen down. When you finish your sitting, close
                  the book and capture what stuck from memory.
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-sm hover:opacity-80"
                style={{ borderColor: 'var(--border-hairline)' }}
              >
                Not yet
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewCurrentPage(String(book.current_page));
                  setStep('dump');
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                Ready to Log Today&apos;s Sitting
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Chapter or Page Range
                </label>
                <input
                  required
                  value={chapterOrPages}
                  onChange={(e) => setChapterOrPages(e.target.value)}
                  placeholder="e.g. Ch. 6: Leverage Points (pp. 145–165)"
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: 'var(--border-hairline)' }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Page Reached (/{book.total_pages})
                </label>
                <input
                  type="number"
                  min={0}
                  max={book.total_pages}
                  value={newCurrentPage}
                  onChange={(e) => setNewCurrentPage(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent font-mono-meta"
                  style={{ borderColor: 'var(--border-hairline)' }}
                />
              </div>
            </div>

            <div>
              <label
                className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                Closed-Book Brain Dump
              </label>
              <textarea
                required
                rows={6}
                autoFocus
                value={rawBrainDump}
                onChange={(e) => setRawBrainDump(e.target.value)}
                placeholder="Close the book. What arguments, mental models, or surprises do you recall? Messy bullet points or stream-of-consciousness notes are encouraged..."
                className="w-full rounded-xl border px-4 py-3 text-sm leading-relaxed bg-transparent resize-y focus:outline-none"
                style={{ borderColor: 'var(--border-hairline)' }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Resonance or Friction (optional)
                </label>
                <input
                  value={friction}
                  onChange={(e) => setFriction(e.target.value)}
                  placeholder="Any open question or pushback?"
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: 'var(--border-hairline)' }}
                />
              </div>
              <div>
                <label
                  className="block text-xs font-medium uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Concepts / Tags (optional)
                </label>
                <input
                  value={manualTags}
                  onChange={(e) => setManualTags(e.target.value)}
                  placeholder="Systems Thinking, Decision Making"
                  className="w-full rounded-lg border px-3 py-2 text-sm bg-transparent"
                  style={{ borderColor: 'var(--border-hairline)' }}
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep('prime')}
                className="text-xs underline underline-offset-4 opacity-70 hover:opacity-100"
              >
                Back to Prime
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !rawBrainDump.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'var(--accent-primary)' }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Synthesizing Sitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit &amp; Synthesize
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
