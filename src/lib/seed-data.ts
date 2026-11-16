import { LibraryData } from '@/types/reading';

export const SEED_LIBRARY_DATA: LibraryData = {
  version: 1,
  books: [
    {
      id: 'book-range-epstein',
      title: 'Range: Why Generalists Triumph in a Specialized World',
      author: 'David Epstein',
      cover_url: null,
      status: 'completed',
      current_page: 352,
      total_pages: 352,
      core_thesis:
        'In "wicked" learning environments where rules are unclear and feedback is delayed, breadth of experience, delayed specialization, and analogical thinking outperform narrow, early repetition. Generalists succeed not despite their wandering paths, but because diverse sampling builds high match quality and cross-domain pattern recognition.',
      created_at: '2026-10-12T09:00:00.000Z',
      updated_at: '2026-10-28T20:15:00.000Z',
    },
    {
      id: 'book-thinking-in-systems',
      title: 'Thinking in Systems: A Primer',
      author: 'Donella H. Meadows',
      cover_url: null,
      status: 'reading',
      current_page: 142,
      total_pages: 240,
      core_thesis: null,
      created_at: '2026-11-02T08:30:00.000Z',
      updated_at: '2026-11-14T21:40:00.000Z',
    },
  ],
  concepts: [
    {
      id: 'concept-learning-mastery',
      name: 'Learning & Mastery',
      description: 'How expertise develops across kind vs. wicked domains.',
    },
    {
      id: 'concept-decision-making',
      name: 'Decision Making',
      description: 'Frameworks for judgment under uncertainty and delayed feedback.',
    },
    {
      id: 'concept-systems-thinking',
      name: 'Systems Thinking',
      description: 'Stocks, flows, feedback loops, and emergent system behavior.',
    },
    {
      id: 'concept-mental-models',
      name: 'Mental Models',
      description: 'Transferable cognitive tools and cross-domain analogies.',
    },
    {
      id: 'concept-feedback-loops',
      name: 'Feedback Loops',
      description: 'Balancing and reinforcing dynamics that govern change over time.',
    },
  ],
  sessions: [
    {
      id: 'session-range-1',
      book_id: 'book-range-epstein',
      session_number: 1,
      chapter_or_pages: 'Introduction & Ch. 1 (pp. 1–34)',
      raw_brain_dump:
        'Contrasts Tiger Woods (early hyper-specialization, 10,000 hours, rigid rules) with Roger Federer (played many sports late into teens before focusing on tennis). Introduces the idea of a "sampling period" before locking into a single domain.',
      key_resonance_or_friction:
        'If early sampling is so effective, why do elite institutions still optimize for early selection?',
      synthesis_tier_used: 'curated_quotes',
      concept_ids: ['concept-learning-mastery'],
      ai_synthesis: {
        tier: 'curated_quotes',
        headline: 'The Cult of the Head Start vs. The Sampling Period',
        markdown:
          'Epstein opens by dismantling the universal applicability of the Tiger Woods archetype. Because your library has no prior sessions yet to cross-link against, here are the anchoring passages from Chapter 1 that frame the book\'s central tension.',
        quotes: [
          {
            quote:
              'Approaching a problem with a narrow set of tools is a recipe for fragility when the rules change.',
            commentary:
              'Captures why early specialization thrives only in static, predictable environments—and breaks down as soon as the surrounding context shifts.',
          },
          {
            quote:
              'Successful late specializers have a "sampling period" in which they gain breadth before focusing.',
            commentary:
              'Reframes wandering not as wasted time, but as deliberate exploration that builds physical, cognitive, and motivational capital.',
          },
        ],
        suggested_concepts: ['Learning & Mastery'],
        open_question:
          'Where in your own career or study are you mistaking early speed for long-term match quality?',
      },
      created_at: '2026-10-12T21:10:00.000Z',
    },
    {
      id: 'session-range-2',
      book_id: 'book-range-epstein',
      session_number: 2,
      chapter_or_pages: 'Ch. 2–3: Kind vs. Wicked Worlds (pp. 35–78)',
      raw_brain_dump:
        'Kind learning environments (chess, golf) have clear rules, immediate feedback, and repeating patterns. Wicked learning environments (investing, medicine, strategy) have noisy, delayed, or misleading feedback. Experience alone in a wicked world can actually make judgment worse by reinforcing bad habits.',
      key_resonance_or_friction:
        'How do you design personal feedback loops when the real world is wicked and slow to correct you?',
      synthesis_tier_used: 'actionable_summary',
      concept_ids: ['concept-learning-mastery', 'concept-decision-making'],
      ai_synthesis: {
        tier: 'actionable_summary',
        headline: 'Distilling Kind vs. Wicked Environments into Practice',
        markdown:
          'Your recall captures the core epistemological distinction of the book. Distilled directly from your notes, here are the key takeaways and concrete adjustments to make when operating in noisy domains.',
        takeaways: [
          'Pattern recognition from repetitive practice only transfers reliably in "kind" environments with tight, accurate feedback.',
          'In "wicked" environments, raw years of experience can inflate confidence without improving accuracy because feedback is delayed or distorted.',
        ],
        actionables: [
          'Keep a written decision journal (hypothesis + expected outcome) to artificially tighten feedback loops in wicked domains.',
          'Before trusting intuition, ask: "Are the rules of this situation stable and repetitive, or am I pattern-matching on noise?"',
        ],
        suggested_concepts: ['Learning & Mastery', 'Decision Making'],
        open_question:
          'Which of your daily decisions sit in a wicked environment where you rely too heavily on gut feel?',
      },
      created_at: '2026-10-15T20:45:00.000Z',
    },
    {
      id: 'session-range-3',
      book_id: 'book-range-epstein',
      session_number: 3,
      chapter_or_pages: 'Ch. 5–6: Thinking Outside Experience & Match Quality (pp. 99–148)',
      raw_brain_dump:
        'Analogical thinking lets people solve novel problems by pulling structural similarities from distant domains (Kepler using light/optics analogies for planetary motion). Also "match quality" — switching paths isn\'t quitting, it\'s optimizing fit between your traits and the work.',
      key_resonance_or_friction: null,
      synthesis_tier_used: 'concept_link',
      concept_ids: ['concept-mental-models', 'concept-decision-making'],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'Analogical Transfer as a Bridge Across Wicked Environments',
        markdown:
          'This sitting directly resolves the tension you surfaced in Session 2. In a wicked environment where local feedback is noisy or delayed, narrow pattern-matching fails—yet Epstein shows that *distant analogies* act as a compensatory compass. By mapping structural relationships from an unrelated domain (like optics to astronomy), you bypass surface-level noise and reason from first principles.\n\nCombined with the idea of "match quality" from Chapter 6, your earlier question about institutions optimizing for early selection comes into sharper focus: institutions reward early certainty because it is legible, whereas individuals thrive by preserving optionality until they find structural fit.',
        connections: [
          'Links Ch. 5 analogical reasoning to your Session 2 note on wicked-world decision making.',
          'Reframes Session 1\'s "sampling period" as an active search for high match quality rather than indecision.',
        ],
        suggested_concepts: ['Mental Models', 'Decision Making'],
        open_question:
          'What is one problem you are currently stuck on that resembles a solved problem in an unrelated field?',
      },
      created_at: '2026-10-20T21:00:00.000Z',
    },
    {
      id: 'session-systems-1',
      book_id: 'book-thinking-in-systems',
      session_number: 1,
      chapter_or_pages: 'Ch. 1: The Basics — Stocks, Flows & Feedback (pp. 11–42)',
      raw_brain_dump:
        'A system is elements, interconnections, and a function/purpose. Changing elements rarely changes the system; changing interconnections or purpose transforms it. Stocks are the memory of a system (bathtub water level); flows are inflows/outflows. Delays in feedback loops cause oscillation and overshoot.',
      key_resonance_or_friction:
        'Notice how "delayed feedback" here mirrors the wicked learning environments in Range.',
      synthesis_tier_used: 'concept_link',
      concept_ids: [
        'concept-systems-thinking',
        'concept-feedback-loops',
        'concept-decision-making',
      ],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'Why Wicked Worlds Oscillate: Feedback Delays Across Systems & Learning',
        markdown:
          'Your observation linking Meadows\'s feedback delays to David Epstein\'s *Range* hits a deep structural truth. In *Range* (Session 2), you noted that delayed or noisy feedback in wicked environments causes people to over-trust flawed intuition. Meadows gives us the mechanical diagram for why: when there is a lag between an action (inflow/outflow) and its observable effect on a stock, actors routinely over-correct, creating oscillation and overshoot.\n\nThis also reframes Epstein\'s concept of "match quality" in systems terms: changing your job title or tools (elements) barely alters your trajectory if the underlying incentives and feedback loops (interconnections and purpose) remain misaligned.',
        connections: [
          'Connects Meadows\'s feedback-loop delays directly to Epstein\'s wicked learning environments (*Range*, Session 2).',
          'Maps "changing elements vs. interconnections" onto *Range*\'s distinction between narrow skill drills and structural match quality.',
        ],
        suggested_concepts: [
          'Systems Thinking',
          'Feedback Loops',
          'Decision Making',
        ],
        open_question:
          'Where in your current projects are you adjusting "elements" when the real bottleneck is an interconnection or a feedback delay?',
      },
      created_at: '2026-11-04T21:15:00.000Z',
    },
    {
      id: 'session-systems-2',
      book_id: 'book-thinking-in-systems',
      session_number: 2,
      chapter_or_pages: 'Ch. 4–5: Why Systems Surprise Us & System Traps (pp. 86–142)',
      raw_brain_dump:
        'Policy resistance: everyone pulls a shared stock in different directions, so pushing harder just makes everyone else push harder back. Tragedy of the commons. Shifting the burden to the intervenor (addiction to quick fixes that erode the system\'s own capacity to self-regulate).',
      key_resonance_or_friction:
        'Shifting the burden to the intervenor feels painfully relevant to over-relying on AI or external crutches.',
      synthesis_tier_used: 'actionable_summary',
      concept_ids: ['concept-systems-thinking', 'concept-mental-models'],
      ai_synthesis: {
        tier: 'actionable_summary',
        headline: 'Avoiding Quick-Fix Dependency and Policy Resistance',
        markdown:
          'Your brain dump zeroes in on two of Meadows\'s sharpest behavioral traps. Distilled from your recall, here is how to spot when a "solution" is quietly weakening the underlying system.',
        takeaways: [
          'Policy resistance happens when multiple actors have conflicting goals for the same stock; unilateral force triggers counter-force rather than progress.',
          '"Shifting the burden to the intervenor" occurs when a symptomatic fix feels good immediately while atrophying the system\'s native resilience.',
        ],
        actionables: [
          'Before applying a quick fix, ask: "Does this strengthen the system\'s own capacity to recover, or make it more dependent on the fix next month?"',
          'When stuck in policy resistance, stop pushing harder and instead align the conflicting goals of the actors pulling the stock.',
        ],
        suggested_concepts: ['Systems Thinking', 'Mental Models'],
        open_question:
          'Which convenience or tool in your workflow is quietly eroding your own underlying capability?',
      },
      created_at: '2026-11-14T21:40:00.000Z',
    },
  ],
};
