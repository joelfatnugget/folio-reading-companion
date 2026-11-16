-- Conscientious Reading & Active Recall Companion
-- PostgreSQL / Supabase Relational Schema

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE book_status AS ENUM ('reading', 'completed', 'paused');
CREATE TYPE synthesis_tier AS ENUM ('concept_link', 'curated_quotes', 'actionable_summary');

CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status book_status NOT NULL DEFAULT 'reading',
  current_page INTEGER NOT NULL DEFAULT 0 CHECK (current_page >= 0),
  total_pages INTEGER NOT NULL DEFAULT 1 CHECK (total_pages > 0),
  core_thesis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  session_number INTEGER NOT NULL CHECK (session_number > 0),
  chapter_or_pages TEXT NOT NULL,
  raw_brain_dump TEXT NOT NULL,
  key_resonance_or_friction TEXT,
  ai_synthesis JSONB NOT NULL,
  synthesis_tier_used synthesis_tier NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (book_id, session_number)
);

CREATE TABLE IF NOT EXISTS concepts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS session_concepts (
  session_id UUID NOT NULL REFERENCES reading_sessions(id) ON DELETE CASCADE,
  concept_id UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  PRIMARY KEY (session_id, concept_id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_book_id ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_sessions_created_at ON reading_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_session_concepts_concept_id ON session_concepts(concept_id);

-- Auto-update updated_at on books
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_books_updated_at ON books;
CREATE TRIGGER trg_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
