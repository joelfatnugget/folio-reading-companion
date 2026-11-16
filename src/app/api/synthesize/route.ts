import { NextRequest, NextResponse } from 'next/server';
import { generateLLMCompletion } from '@/lib/ai/llm-client';
import {
  MASTER_THESIS_SYSTEM_PROMPT,
  SynthesisContext,
  THREE_TIER_SYSTEM_PROMPT,
  buildDeterministicFallbackSynthesis,
  buildMasterThesisUserPrompt,
  buildSynthesisUserPrompt,
  parseSynthesisResponse,
} from '@/lib/ai/synthesis-prompts';
import { Book, Concept, LLMConfig, ReadingSession } from '@/types/reading';

interface SessionSynthesisBody {
  mode?: 'session';
  context: SynthesisContext;
  llmConfig?: Partial<LLMConfig>;
}

interface MasterThesisBody {
  mode: 'master_thesis';
  book: Book;
  sessions: ReadingSession[];
  concepts: Concept[];
  llmConfig?: Partial<LLMConfig>;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SessionSynthesisBody | MasterThesisBody;

    if (body.mode === 'master_thesis') {
      const { book, sessions, concepts, llmConfig } = body;
      const userPrompt = buildMasterThesisUserPrompt(book, sessions, concepts);

      try {
        const raw = await generateLLMCompletion({
          systemPrompt: MASTER_THESIS_SYSTEM_PROMPT,
          userPrompt,
          config: llmConfig,
        });

        if (raw && raw.trim()) {
          return NextResponse.json({
            core_thesis: raw.trim(),
            source: 'llm',
          });
        }
      } catch (err) {
        console.warn('LLM master thesis fallback triggered:', err);
      }

      const headlines = sessions
        .map((s) => s.ai_synthesis.headline)
        .slice(0, 3)
        .join('; ');
      const fallbackThesis =
        sessions.length > 0
          ? `Across ${sessions.length} reading sitting${sessions.length > 1 ? 's' : ''}, "${book.title}" centers on ${headlines.toLowerCase()}. Together, these ideas form a practical mental model around ${concepts.map((c) => c.name).slice(0, 3).join(', ') || 'deliberate judgment'}.`
          : `"${book.title}" by ${book.author} — completed without logged sitting notes yet.`;

      return NextResponse.json({
        core_thesis: fallbackThesis,
        source: 'fallback',
      });
    }

    const { context, llmConfig } = body as SessionSynthesisBody;
    if (!context?.book || !context?.rawBrainDump?.trim()) {
      return NextResponse.json(
        { error: 'Book and rawBrainDump are required.' },
        { status: 400 }
      );
    }

    const userPrompt = buildSynthesisUserPrompt(context);

    try {
      const raw = await generateLLMCompletion({
        systemPrompt: THREE_TIER_SYSTEM_PROMPT,
        userPrompt,
        config: llmConfig,
      });

      if (raw && raw.trim()) {
        const synthesis = parseSynthesisResponse(raw, context);
        return NextResponse.json({ synthesis, source: 'llm' });
      }
    } catch (err) {
      console.warn('LLM session synthesis fallback triggered:', err);
    }

    const synthesis = buildDeterministicFallbackSynthesis(context);
    return NextResponse.json({ synthesis, source: 'fallback' });
  } catch (error) {
    console.error('Synthesis API error:', error);
    return NextResponse.json(
      { error: 'Failed to process synthesis request.' },
      { status: 500 }
    );
  }
}
