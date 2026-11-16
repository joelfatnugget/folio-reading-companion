import { NextRequest, NextResponse } from 'next/server';
import { SEED_LIBRARY_DATA } from '@/lib/seed-data';
import { Book } from '@/types/reading';

// In-memory server store for self-hosted / API consumers (client uses local-first IndexedDB)
let serverBooks: Book[] = [...SEED_LIBRARY_DATA.books];

export async function GET() {
  return NextResponse.json({ books: serverBooks });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Book>;
    if (!body.title?.trim() || !body.author?.trim()) {
      return NextResponse.json(
        { error: 'title and author are required.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const book: Book = {
      id: body.id || `book-${crypto.randomUUID().slice(0, 8)}`,
      title: body.title.trim(),
      author: body.author.trim(),
      cover_url: body.cover_url ?? null,
      status: body.status ?? 'reading',
      current_page: body.current_page ?? 0,
      total_pages: Math.max(1, body.total_pages ?? 250),
      core_thesis: body.core_thesis ?? null,
      created_at: now,
      updated_at: now,
    };

    serverBooks = [book, ...serverBooks];
    return NextResponse.json({ book }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Book> & { id?: string };
    if (!body.id) {
      return NextResponse.json({ error: 'id is required.' }, { status: 400 });
    }
    const index = serverBooks.findIndex((b) => b.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Book not found.' }, { status: 404 });
    }
    serverBooks[index] = {
      ...serverBooks[index],
      ...body,
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json({ book: serverBooks[index] });
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
