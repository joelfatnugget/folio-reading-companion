import { GitBranch, ListChecks, Quote } from 'lucide-react';
import { SynthesisTier } from '@/types/reading';

const TIER_META: Record<
  SynthesisTier,
  { label: string; icon: typeof GitBranch; className: string }
> = {
  concept_link: {
    label: 'Concept Link',
    icon: GitBranch,
    className:
      'bg-[#2f5d50]/10 text-[#2f5d50] border-[#2f5d50]/20 dark:bg-[#5ba892]/15 dark:text-[#7ec9b3] dark:border-[#5ba892]/25',
  },
  curated_quotes: {
    label: 'Curated Quotes',
    icon: Quote,
    className:
      'bg-[#8c3b2b]/10 text-[#8c3b2b] border-[#8c3b2b]/20 dark:bg-[#d97757]/15 dark:text-[#eba086] dark:border-[#d97757]/25',
  },
  actionable_summary: {
    label: 'Actionable Summary',
    icon: ListChecks,
    className:
      'bg-stone-500/10 text-stone-700 border-stone-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25',
  },
};

export function TierBadge({ tier }: { tier: SynthesisTier }) {
  const meta = TIER_META[tier];
  const Icon = meta.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-tight ${meta.className}`}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}
