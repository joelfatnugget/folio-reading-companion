# Folio — Conscientious Reading & Active Recall Companion

A distraction-free editorial web application designed to help non-fiction readers retain and synthesize books across multiple reading sittings using **closed-book active recall** and a **strict 3-tier AI synthesis pipeline**.

## Core Features

- **Pre-Session Prime ("Previously on...")**: Surfaces your last sitting's AI synthesis and any open questions/friction points before you begin a new sitting.
- **Post-Session Brain Dump**: Minimal-friction closed-book recall editor for capturing messy bullet points, stream-of-consciousness notes, and resonance/friction points.
- **3-Tier AI Synthesis Pipeline** (`/api/synthesize`):
  1. **Tier 1 (`concept_link`)**: Cross-concept and cross-book editorial synthesis connecting what you just read to earlier chapters and other books in your library.
  2. **Tier 2 (`curated_quotes`)**: Verbatim high-impact quotes with editorial commentary (with a strict anti-hallucination rule).
  3. **Tier 3 (`actionable_summary`)**: Crisp Key Takeaways and Concrete Actionables distilled strictly from your brain dump.
- **Master Book Synthesis (`core_thesis`)**: Distill a completed book's sessions into a lasting Core Thesis.
- **Themes & Connections (`/themes`)**: Commonplace knowledge graph grouping insights by shared concepts across books.
- **Daily Spaced Recall**: Dashboard widget surfacing a past insight or quote each day.
- **Local-First + Portable**: Persists in IndexedDB/localStorage with one-click JSON export/import, plus a full PostgreSQL/Supabase schema in `src/db/schema.sql`.

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS v4, Lucide Icons
- **AI Layer**: Modular client (`src/lib/ai/llm-client.ts`) supporting OpenAI-compatible endpoints, Google Gemini API, and local Ollama (plus a deterministic local fallback when no API key is configured)
- **Database Schema**: `src/db/schema.sql` (PostgreSQL / Supabase) + local-first IndexedDB store (`src/lib/storage/local-store.ts`)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. You can also configure your OpenAI, Gemini, or Ollama credentials directly in the **Settings** modal inside the app.
