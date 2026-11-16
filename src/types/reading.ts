export type BookStatus = 'reading' | 'completed' | 'paused';

export type SynthesisTier =
  | 'concept_link'
  | 'curated_quotes'
  | 'actionable_summary';

export type LLMProvider = 'openai' | 'gemini' | 'ollama';

export interface CuratedQuote {
  quote: string;
  commentary: string;
}

export interface AISynthesis {
  tier: SynthesisTier;
  headline: string;
  markdown: string;
  connections?: string[];
  quotes?: CuratedQuote[];
  takeaways?: string[];
  actionables?: string[];
  suggested_concepts: string[];
  open_question?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string | null;
  status: BookStatus;
  current_page: number;
  total_pages: number;
  core_thesis: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReadingSession {
  id: string;
  book_id: string;
  session_number: number;
  chapter_or_pages: string;
  raw_brain_dump: string;
  key_resonance_or_friction: string | null;
  ai_synthesis: AISynthesis;
  synthesis_tier_used: SynthesisTier;
  concept_ids: string[];
  created_at: string;
}

export interface Concept {
  id: string;
  name: string;
  description?: string;
}

export interface LibraryData {
  books: Book[];
  sessions: ReadingSession[];
  concepts: Concept[];
  version: number;
  exported_at?: string;
}

export interface LLMConfig {
  provider: LLMProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}
