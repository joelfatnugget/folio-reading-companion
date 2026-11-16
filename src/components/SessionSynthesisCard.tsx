import {
  ArrowUpRight,
  Compass,
  HelpCircle,
  Lightbulb,
  Quote as QuoteIcon,
} from 'lucide-react';
import { AISynthesis, Concept } from '@/types/reading';
import { TierBadge } from '@/components/TierBadge';

interface SessionSynthesisCardProps {
  synthesis: AISynthesis;
  concepts?: Concept[];
}

export function SessionSynthesisCard({
  synthesis,
  concepts = [],
}: SessionSynthesisCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <h4 className="font-serif-editorial text-lg sm:text-xl font-medium leading-snug">
          {synthesis.headline}
        </h4>
        <TierBadge tier={synthesis.tier} />
      </div>

      <div
        className="text-sm leading-relaxed space-y-3 whitespace-pre-line"
        style={{ color: 'var(--text-secondary)' }}
      >
        {synthesis.markdown}
      </div>

      {/* Tier 1: Cross-Concept Connections */}
      {synthesis.connections && synthesis.connections.length > 0 && (
        <div
          className="rounded-lg border p-3.5 space-y-2"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-hairline)',
          }}
        >
          <p
            className="font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: 'var(--accent-secondary)' }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            Cross-Library Links
          </p>
          <ul className="space-y-1.5 text-xs leading-relaxed">
            {synthesis.connections.map((conn, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span style={{ color: 'var(--accent-secondary)' }}>•</span>
                <span>{conn}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tier 2: Curated Quotes */}
      {synthesis.quotes && synthesis.quotes.length > 0 && (
        <div className="space-y-3 pt-1">
          {synthesis.quotes.map((item, idx) => (
            <blockquote
              key={idx}
              className="rounded-lg border-l-2 pl-4 pr-3 py-2.5 space-y-1.5"
              style={{
                borderLeftColor: 'var(--accent-primary)',
                backgroundColor: 'var(--bg-subtle)',
              }}
            >
              <p className="font-serif-editorial italic text-sm sm:text-base leading-relaxed flex items-start gap-2">
                <QuoteIcon
                  className="w-3.5 h-3.5 mt-1 shrink-0 opacity-60"
                  style={{ color: 'var(--accent-primary)' }}
                />
                <span>&ldquo;{item.quote}&rdquo;</span>
              </p>
              <p
                className="text-xs leading-relaxed pl-5"
                style={{ color: 'var(--text-muted)' }}
              >
                {item.commentary}
              </p>
            </blockquote>
          ))}
        </div>
      )}

      {/* Tier 3: Takeaways & Actionables */}
      {((synthesis.takeaways && synthesis.takeaways.length > 0) ||
        (synthesis.actionables && synthesis.actionables.length > 0)) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {synthesis.takeaways && synthesis.takeaways.length > 0 && (
            <div
              className="rounded-lg border p-3.5 space-y-2"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <p
                className="font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Key Takeaways
              </p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                {synthesis.takeaways.map((t, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="opacity-50">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {synthesis.actionables && synthesis.actionables.length > 0 && (
            <div
              className="rounded-lg border p-3.5 space-y-2"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-hairline)',
              }}
            >
              <p
                className="font-mono-meta text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: 'var(--accent-primary)' }}
              >
                <Compass className="w-3.5 h-3.5" />
                Concrete Actionables
              </p>
              <ul className="space-y-1.5 text-xs leading-relaxed">
                {synthesis.actionables.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent-primary)' }}>→</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {synthesis.open_question && (
        <div
          className="pt-2 flex items-start gap-2 text-xs"
          style={{ color: 'var(--text-muted)' }}
        >
          <HelpCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>
            <strong className="font-medium">Next-sitting prompt:</strong>{' '}
            {synthesis.open_question}
          </span>
        </div>
      )}

      {concepts.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {concepts.map((c) => (
            <span
              key={c.id}
              className="px-2.5 py-0.5 rounded-md text-[11px] border"
              style={{
                borderColor: 'var(--border-hairline)',
                color: 'var(--text-secondary)',
              }}
            >
              #{c.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
