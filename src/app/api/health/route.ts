import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'folio-reading-companion',
    timestamp: new Date().toISOString(),
  });
}
