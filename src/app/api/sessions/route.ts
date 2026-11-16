import { NextRequest, NextResponse } from 'next/server';
import { SEED_LIBRARY_DATA } from '@/lib/seed-data';
import { ReadingSession } from '@/types/reading';

let serverSessions: ReadingSession[] = [...SEED_LIBRARY_DATA.sessions];

export async function GET(req: NextRequest) {
  const bookId = req.nextUrl.searchParams.get('bookId');
  const sessions = bookId
    ? serverSessions.filter((s) => s.book_id === bookId)
    : serverSessions;
  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ReadingSession>;
    if (!body.book_id || !body.raw_brain_dump?.trim() || !body.ai_synthesis) {
      return NextResponse.json(
        { error: 'book_id, raw_brain_dump, and ai_synthesis are required.' },
        { status: 400 }
      );
    }

    const session: ReadingSession = {
      id: body.id || `session-${crypto.randomUUID().slice(0, 8)}`,
      book_id: body.book_id,
      session_number: body.session_number ?? 1,
      chapter_or_pages: body.chapter_or_pages || 'Reading Sitting',
      raw_brain_dump: body.raw_brain_dump.trim(),
      key_resonance_or_friction: body.key_resonance_or_friction ?? null,
      ai_synthesis: body.ai_synthesis,
      synthesis_tier_used: body.synthesis_tier_used || body.ai_synthesis.tier,
      concept_ids: body.concept_ids ?? [],
      created_at: new Date().toISOString(),
    };

    serverSessions = [...serverSessions, session];
    return NextResponse.json({ session }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
