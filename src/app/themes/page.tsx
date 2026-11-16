'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Network } from 'lucide-react';
import { useLibrary } from '@/components/LibraryProvider';
import { SessionSynthesisCard } from '@/components/SessionSynthesisCard';

function ThemesContent() {
  const searchParams = useSearchParams();
  const initialConcept = searchParams.get('concept');
  const { library, isLoaded } = useLibrary();
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(
    initialConcept
  );

  const groupedByConcept = useMemo(() => {
    return library.concepts
      .map((concept) => {
        const entries = library.sessions
          .filter((s) => s.concept_ids.includes(concept.id))
          .map((session) => ({
            session,
            book: library.books.find((b) => b.id === session.book_id),
          }))
          .filter((e) => Boolean(e.book))
          .sort(
            (a, b) =>
              new Date(b.session.created_at).getTime() -
              new Date(a.session.created_at).getTime()
          );

        const distinctBooks = new Set(entries.map((e) => e.book!.id)).size;

        return {
          concept,
          entries,
          distinctBooks,
        };
      })
      .filter((g) => g.entries.length > 0)
      .sort((a, b) => b.distinctBooks - a.distinctBooks || b.entries.length - a.entries.length);
  }, [library.concepts, library.sessions, library.books]);

  const visibleGroups = useMemo(() => {
    if (!selectedConceptId) return groupedByConcept;
    return groupedByConcept.filter((g) => g.concept.id === selectedConceptId);
  }, [groupedByConcept, selectedConceptId]);

  if (!isLoaded) {
    return (
      <div className="py-20 text-center text-sm opacity-60">
        Loading commonplace themes...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <Network
            className="w-4 h-4"
            style={{ color: 'var(--accent-secondary)' }}
          />
          <span
            className="font-mono-meta text-xs uppercase tracking-widest"
            style={{ color: 'var(--accent-secondary)' }}
          >
            Commonplace Knowledge Graph
          </span>
        </div>
        <h1 className="font-serif-editorial text-3xl sm:text-4xl font-medium">
          Themes &amp; Connections
        </h1>
        <p
          className="text-sm max-w-2xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          Ideas organized by mental model rather than book spine—see how
          multiple authors reinforce, nuance, or contradict each other.
        </p>
      </header>

      {/* Concept Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedConceptId(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            selectedConceptId === null ? 'text-white' : 'hover:opacity-80'
          }`}
          style={
            selectedConceptId === null
              ? {
                  backgroundColor: 'var(--accent-primary)',
                  borderColor: 'var(--accent-primary)',
                }
              : { borderColor: 'var(--border-hairline)' }
          }
        >
          All Themes ({groupedByConcept.length})
        </button>

        {groupedByConcept.map(({ concept, entries, distinctBooks }) => {
          const active = selectedConceptId === concept.id;
          return (
            <button
              key={concept.id}
              onClick={() =>
                setSelectedConceptId(active ? null : concept.id)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active ? 'text-white' : 'hover:opacity-80'
              }`}
              style={
                active
                  ? {
                      backgroundColor: 'var(--accent-secondary)',
                      borderColor: 'var(--accent-secondary)',
                    }
                  : { borderColor: 'var(--border-hairline)' }
              }
            >
              {concept.name}{' '}
              <span className="opacity-70 font-mono-meta">
                ({distinctBooks}b · {entries.length})
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped Insights */}
      <div className="space-y-10">
        {visibleGroups.map(({ concept, entries, distinctBooks }) => (
          <section key={concept.id} className="space-y-4">
            <div
              className="pb-2 border-b flex items-baseline justify-between gap-4 flex-wrap"
              style={{ borderColor: 'var(--border-hairline)' }}
            >
              <div>
                <h2 className="font-serif-editorial text-2xl font-medium">
                  {concept.name}
                </h2>
                {concept.description && (
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {concept.description}
                  </p>
                )}
              </div>
              <span
                className="font-mono-meta text-xs"
                style={{ color: 'var(--text-muted)' }}
              >
                Across {distinctBooks} book{distinctBooks === 1 ? '' : 's'} ·{' '}
                {entries.length} sitting{entries.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {entries.map(({ session, book }) => (
                <article
                  key={`${concept.id}-${session.id}`}
                  className="rounded-xl border p-5 sm:p-6 space-y-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-hairline)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Link
                      href={`/books/${book!.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline underline-offset-4"
                      style={{ color: 'var(--accent-primary)' }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {book!.title}
                      <span
                        className="font-mono-meta opacity-75"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        · Sitting {session.session_number} (
                        {session.chapter_or_pages})
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  <SessionSynthesisCard synthesis={session.ai_synthesis} />
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export default function ThemesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm opacity-60">
          Loading themes...
        </div>
      }
    >
      <ThemesContent />
    </Suspense>
  );
}
