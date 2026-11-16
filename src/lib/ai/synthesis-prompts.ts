import {
  AISynthesis,
  Book,
  Concept,
  ReadingSession,
  SynthesisTier,
} from '@/types/reading';

export const THREE_TIER_SYSTEM_PROMPT = `You are an editorial reading companion for a conscientious non-fiction reader practicing closed-book active recall.
Your job is to respond to the user's raw post-sitting brain dump with a sharp, cohesive, literary editorial synthesis—never generic AI filler, never sycophantic praise.

You MUST follow this STRICT 3-Tier Priority Hierarchy and choose EXACTLY ONE tier:

1. TIER 1 ("concept_link") — Cross-Concept & Cross-Book Linking (PRIMARY GOAL)
   - Condition: The user's notes contain clear ideas/frameworks AND there are existing concepts, mental models, or previous books/sessions in their library to meaningfully connect them to.
   - Output: Write a sharp, insightful short essay (2–3 paragraphs) connecting what the user just read to concepts from earlier chapters, other books in their library, or real-world systems/decision-making frameworks. Highlight where ideas reinforce or contradict each other.

2. TIER 2 ("curated_quotes") — Curated High-Impact Quotes & Context (FALLBACK 1)
   - Condition: The user's session notes are brief, isolated, or lack enough conceptual overlap with existing library entries to form meaningful cross-links.
   - Output: Based on the book title, author, and the specific chapter/topic read, surface 2–3 of the most impactful, verbatim quotes from that section of the book, accompanied by a brief, insightful commentary on why each quote matters.
   - STRICT ANTI-HALLUCINATION RULE: NEVER fabricate or paraphrase a quote as verbatim. If you are not 100% certain of the exact wording of quotes from this specific book/chapter (e.g., niche or obscure book), DO NOT use Tier 2—automatically fall back to Tier 3.

3. TIER 3 ("actionable_summary") — Structured Actionable Distillation (FALLBACK 2)
   - Condition: The book is niche/obscure (reliable verbatim quotes cannot be verified with high confidence) AND there are insufficient cross-links available.
   - Output: Take the user's raw, messy brain-dump as the SOLE source of truth and rewrite/organize it into a crisp, well-written set of Key Takeaways and Concrete Actionables (what to think differently about or apply immediately).

Return ONLY valid JSON matching this exact schema (no markdown code fences around the JSON):
{
  "tier": "concept_link" | "curated_quotes" | "actionable_summary",
  "headline": "A concise editorial title (5-10 words)",
  "markdown": "The main editorial prose (for concept_link: 2-3 cohesive paragraphs; for curated_quotes/actionable_summary: a 1-2 sentence framing intro)",
  "connections": ["Optional array of 2-3 specific cross-book or cross-chapter link bullets when tier is concept_link"],
  "quotes": [{"quote": "Exact verbatim quote", "commentary": "Why it matters"}],
  "takeaways": ["Crisp takeaway bullet (when tier is actionable_summary)"],
  "actionables": ["Concrete actionable bullet (when tier is actionable_summary)"],
  "suggested_concepts": ["1 to 3 concise concept/theme tags in Title Case, e.g. Systems Thinking, Decision Making"],
  "open_question": "One sharp reflective question for the reader's next sitting"
}`;

export const MASTER_THESIS_SYSTEM_PROMPT = `You are an editorial reading companion helping a reader distill a completed non-fiction book into a lasting Master Book Synthesis (core_thesis).
Synthesize the user's own session brain dumps, friction points, and concepts into a crisp, memorable 2–4 sentence Core Thesis that captures the book's enduring mental model and how it connects to their broader reading.
Be concise, literary, and grounded strictly in what the reader engaged with. Return plain prose (no markdown headers or bullet lists).`;

export interface SynthesisContext {
  book: Book;
  chapterOrPages: string;
  rawBrainDump: string;
  keyResonanceOrFriction?: string | null;
  priorSessionsInBook: ReadingSession[];
  otherBooksWithSessions: Array<{
    book: Book;
    sessions: ReadingSession[];
  }>;
  existingConcepts: Concept[];
}

export function buildSynthesisUserPrompt(ctx: SynthesisContext): string {
  const priorBookContext =
    ctx.priorSessionsInBook.length > 0
      ? ctx.priorSessionsInBook
          .slice(-3)
          .map(
            (s) =>
              `- Session ${s.session_number} (${s.chapter_or_pages}): ${s.raw_brain_dump.slice(0, 320)}`
          )
          .join('\n')
      : 'None (this is the first sitting for this book).';

  const libraryContext =
    ctx.otherBooksWithSessions.length > 0
      ? ctx.otherBooksWithSessions
          .map(({ book, sessions }) => {
            const highlights = sessions
              .slice(-2)
              .map(
                (s) =>
                  `  * [${s.chapter_or_pages}] ${s.ai_synthesis.headline}: ${s.raw_brain_dump.slice(0, 220)}`
              )
              .join('\n');
            return `- "${book.title}" by ${book.author}${book.core_thesis ? ` (Thesis: ${book.core_thesis})` : ''}\n${highlights}`;
          })
          .join('\n')
      : 'None (no other books with sessions in the library yet).';

  const conceptList =
    ctx.existingConcepts.length > 0
      ? ctx.existingConcepts.map((c) => c.name).join(', ')
      : 'None yet';

  return `CURRENT BOOK: "${ctx.book.title}" by ${ctx.book.author}
SECTION READ: ${ctx.chapterOrPages}

USER'S CLOSED-BOOK BRAIN DUMP:
${ctx.rawBrainDump}

USER'S RESONANCE / FRICTION POINT:
${ctx.keyResonanceOrFriction?.trim() || 'None logged'}

PRIOR SITTINGS IN THIS BOOK:
${priorBookContext}

OTHER BOOKS & SESSIONS IN USER'S LIBRARY:
${libraryContext}

EXISTING CONCEPTS IN LIBRARY:
${conceptList}

Evaluate Tier 1 -> Tier 2 -> Tier 3 in strict order and return the JSON response.`;
}

export function buildMasterThesisUserPrompt(
  book: Book,
  sessions: ReadingSession[],
  concepts: Concept[]
): string {
  const sessionSummaries = sessions
    .map(
      (s) =>
        `Session ${s.session_number} (${s.chapter_or_pages}):\nRecall: ${s.raw_brain_dump}\nSynthesis: ${s.ai_synthesis.headline} — ${s.ai_synthesis.markdown}`
    )
    .join('\n\n');

  const conceptNames = concepts.map((c) => c.name).join(', ') || 'None';

  return `BOOK: "${book.title}" by ${book.author}
CONCEPTS EXPLORED: ${conceptNames}

READER'S SESSION TIMELINE:
${sessionSummaries}

Write the cohesive 2-4 sentence Master Book Synthesis (Core Thesis).`;
}

export function parseSynthesisResponse(
  rawText: string,
  fallbackCtx: SynthesisContext
): AISynthesis {
  const cleaned = rawText
    .trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Partial<AISynthesis>;
    const validTiers: SynthesisTier[] = [
      'concept_link',
      'curated_quotes',
      'actionable_summary',
    ];
    const tier: SynthesisTier = validTiers.includes(parsed.tier as SynthesisTier)
      ? (parsed.tier as SynthesisTier)
      : 'actionable_summary';

    return {
      tier,
      headline:
        typeof parsed.headline === 'string' && parsed.headline.trim()
          ? parsed.headline.trim()
          : `Synthesis: ${fallbackCtx.chapterOrPages}`,
      markdown:
        typeof parsed.markdown === 'string' && parsed.markdown.trim()
          ? parsed.markdown.trim()
          : fallbackCtx.rawBrainDump,
      connections: Array.isArray(parsed.connections)
        ? parsed.connections.filter((x): x is string => typeof x === 'string')
        : undefined,
      quotes: Array.isArray(parsed.quotes)
        ? parsed.quotes.filter(
            (q) =>
              q &&
              typeof q.quote === 'string' &&
              typeof q.commentary === 'string'
          )
        : undefined,
      takeaways: Array.isArray(parsed.takeaways)
        ? parsed.takeaways.filter((x): x is string => typeof x === 'string')
        : undefined,
      actionables: Array.isArray(parsed.actionables)
        ? parsed.actionables.filter((x): x is string => typeof x === 'string')
        : undefined,
      suggested_concepts:
        Array.isArray(parsed.suggested_concepts) &&
        parsed.suggested_concepts.length > 0
          ? parsed.suggested_concepts
              .filter((x): x is string => typeof x === 'string')
              .slice(0, 3)
          : ['Reading Notes'],
      open_question:
        typeof parsed.open_question === 'string'
          ? parsed.open_question.trim()
          : undefined,
    };
  } catch {
    return buildDeterministicFallbackSynthesis(fallbackCtx);
  }
}

/**
 * Deterministic 3-tier fallback when no external LLM API key is configured.
 * Ensures the app works out-of-the-box and demonstrates the 3-tier logic cleanly.
 */
export function buildDeterministicFallbackSynthesis(
  ctx: SynthesisContext
): AISynthesis {
  const dump = ctx.rawBrainDump.trim();
  const sentences = dump
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim().replace(/^[-*•]\s*/, ''))
    .filter((s) => s.length > 10);

  const hasLibraryOverlap =
    ctx.priorSessionsInBook.length > 0 ||
    ctx.otherBooksWithSessions.length > 0;

  const matchedConcepts = ctx.existingConcepts
    .filter((c) => {
      const words = c.name.toLowerCase().split(/\s+/);
      const text = `${dump} ${ctx.keyResonanceOrFriction || ''}`.toLowerCase();
      return words.some((w) => w.length > 3 && text.includes(w));
    })
    .map((c) => c.name);

  // Tier 1 if we have substantial notes (>120 chars) AND library context to link against
  if (dump.length >= 120 && hasLibraryOverlap) {
    const targetBook =
      ctx.otherBooksWithSessions[0]?.book || ctx.book;
    const priorHeadline =
      ctx.priorSessionsInBook[ctx.priorSessionsInBook.length - 1]?.ai_synthesis
        .headline ||
      ctx.otherBooksWithSessions[0]?.sessions[0]?.ai_synthesis.headline ||
      'earlier library notes';

    const concepts =
      matchedConcepts.length > 0
        ? matchedConcepts.slice(0, 3)
        : ctx.existingConcepts.slice(0, 2).map((c) => c.name);

    return {
      tier: 'concept_link',
      headline: `Connecting ${ctx.chapterOrPages} to ${targetBook.title.split(':')[0]}`,
      markdown: `In this sitting on ${ctx.book.title}, your recall highlights a core mechanism: ${sentences[0] || dump.slice(0, 180)}. Viewed alongside "${priorHeadline}" in ${targetBook.title.split(':')[0]}, the same structural pattern emerges—outcomes are shaped less by isolated effort and more by the surrounding environment and feedback structure.\n\n${ctx.keyResonanceOrFriction ? `Your friction point ("${ctx.keyResonanceOrFriction}") sharpens this connection: it tests whether the author's framework holds up when applied directly to your own context.` : 'Hold this tension as you move into the next chapter: notice where this mental model reinforces or challenges what you have already logged.'}`,
      connections: [
        `Bridges ${ctx.chapterOrPages} with "${priorHeadline}" from ${targetBook.title.split(':')[0]}.`,
        `Surfaces shared patterns around ${(concepts[0] || 'Mental Models').toLowerCase()}.`,
      ],
      suggested_concepts:
        concepts.length > 0 ? concepts : ['Mental Models', 'Systems Thinking'],
      open_question:
        'Where does this chapter reinforce—or quietly contradict—the last book you finished?',
    };
  }

  // Tier 3 (strictly avoiding fabricated Tier 2 quotes when running offline/without LLM)
  const takeaways =
    sentences.length > 0
      ? sentences.slice(0, 3)
      : [dump.slice(0, 200)];

  return {
    tier: 'actionable_summary',
    headline: `Distilled Takeaways: ${ctx.chapterOrPages}`,
    markdown:
      'Running in local synthesis mode (add an OpenAI, Gemini, or Ollama key in Settings for live LLM cross-linking and verified quote curation). Here is your raw recall structured into clear takeaways and next steps.',
    takeaways,
    actionables: [
      ctx.keyResonanceOrFriction
        ? `Revisit your open question next sitting: "${ctx.keyResonanceOrFriction}"`
        : 'Identify one concrete decision this week where you can test the main idea from this section.',
      'Before your next sitting, spend 60 seconds recalling these takeaways without looking back.',
    ],
    suggested_concepts:
      matchedConcepts.length > 0 ? matchedConcepts : ['Reading Notes'],
    open_question:
      'What single idea from this sitting would change how you act tomorrow?',
  };
}
