import { LibraryData } from '@/types/reading';

export const SEED_LIBRARY_DATA: LibraryData = {
  version: 2,
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
      current_page: 165,
      total_pages: 240,
      core_thesis: null,
      created_at: '2026-11-02T08:30:00.000Z',
      updated_at: '2026-11-15T21:40:00.000Z',
    },
    {
      id: 'book-hamming-science-engineering',
      title: 'The Art of Doing Science and Engineering: Learning to Learn',
      author: 'Richard W. Hamming',
      cover_url: null,
      status: 'completed',
      current_page: 364,
      total_pages: 364,
      core_thesis:
        'Greatness in technical and creative work is largely a matter of taste, courage, and deliberate style: working on the most important problems in your field, tolerating ambiguity long enough to see the whole structure, and continuously upgrading your own mental tools as conditions change.',
      created_at: '2026-09-18T10:00:00.000Z',
      updated_at: '2026-10-08T19:20:00.000Z',
    },
    {
      id: 'book-antifragile-taleb',
      title: 'Antifragile: Things That Gain from Disorder',
      author: 'Nassim Nicholas Taleb',
      cover_url: null,
      status: 'reading',
      current_page: 218,
      total_pages: 519,
      core_thesis: null,
      created_at: '2026-11-05T07:45:00.000Z',
      updated_at: '2026-11-14T22:10:00.000Z',
    },
    {
      id: 'book-timeless-way-alexander',
      title: 'The Timeless Way of Building',
      author: 'Christopher Alexander',
      cover_url: null,
      status: 'paused',
      current_page: 185,
      total_pages: 552,
      core_thesis: null,
      created_at: '2026-09-01T08:00:00.000Z',
      updated_at: '2026-09-25T18:30:00.000Z',
    },
  ],
  concepts: [
    {
      id: 'concept-learning-mastery',
      name: 'Learning & Mastery',
      description:
        'How deep expertise develops across kind vs. wicked domains, deliberate practice, and cultivating personal taste.',
    },
    {
      id: 'concept-decision-making',
      name: 'Decision Making',
      description:
        'Frameworks for judgment under uncertainty, asymmetric payoffs, and delayed or noisy feedback.',
    },
    {
      id: 'concept-systems-thinking',
      name: 'Systems Thinking',
      description:
        'Stocks, flows, leverage points, non-linearities, and emergent behavior in complex adaptive systems.',
    },
    {
      id: 'concept-mental-models',
      name: 'Mental Models',
      description:
        'Transferable cognitive tools, distant analogies, and first-principles abstractions.',
    },
    {
      id: 'concept-feedback-loops',
      name: 'Feedback Loops',
      description:
        'Balancing and reinforcing dynamics, information delays, and oscillation over time.',
    },
    {
      id: 'concept-antifragility',
      name: 'Antifragility & Optionality',
      description:
        'Designing structures and careers that benefit from volatility, stressors, and convex payoffs.',
    },
    {
      id: 'concept-craft-taste',
      name: 'First Principles & Craft',
      description:
        'Choosing important problems, developing intellectual courage, and building enduring artifacts.',
    },
    {
      id: 'concept-emergence',
      name: 'Emergence & Architecture',
      description:
        'How living structure arises from local generative rules rather than rigid top-down blueprints.',
    },
  ],
  sessions: [
    {
      id: 'session-hamming-1',
      book_id: 'book-hamming-science-engineering',
      session_number: 1,
      chapter_or_pages: 'Ch. 1–2: Orientation & Style (pp. 1–44)',
      raw_brain_dump:
        'Hamming argues that you cannot teach "greatness" as a formula, only cultivate your own style. Most people spend their careers working on safe, small problems because they fear looking foolish. You have to ask: what are the most important problems in my field, and why am I not working on them?',
      key_resonance_or_friction:
        'How do you balance working on "important problems" when your daily job rewards incremental tickets?',
      synthesis_tier_used: 'curated_quotes',
      concept_ids: ['concept-craft-taste', 'concept-learning-mastery'],
      ai_synthesis: {
        tier: 'curated_quotes',
        headline: 'Developing Intellectual Style and Problem Selection',
        markdown:
          'Hamming opens his Bell Labs lectures not with mathematics, but with character and ambition. Here are the anchoring passages from the opening chapters that frame his philosophy of serious work.',
        quotes: [
          {
            quote:
              'If you do not work on an important problem, it is unlikely you will do important work.',
            commentary:
              'A blunt antidote to busywork: excellence in execution cannot rescue a trivial problem choice.',
          },
          {
            quote:
              'The style of doing things is what separates the great from the merely competent.',
            commentary:
              'Style here is not aesthetic ornament; it is the repeatable habit of framing problems from first principles.',
          },
        ],
        suggested_concepts: ['First Principles & Craft', 'Learning & Mastery'],
        open_question:
          'What is the single highest-leverage problem in your current work that you have been postponing?',
      },
      created_at: '2026-09-19T20:30:00.000Z',
    },
    {
      id: 'session-hamming-2',
      book_id: 'book-hamming-science-engineering',
      session_number: 2,
      chapter_or_pages: 'Ch. 29–30: Systems Engineering & You and Your Research (pp. 315–364)',
      raw_brain_dump:
        'If you optimize a component without understanding the total system, you usually degrade the whole. Also, keep your door open: people with closed doors get fewer interruptions and less noise, but ten years later they have lost touch with what problems actually matter. Tolerate ambiguity.',
      key_resonance_or_friction:
        'The "open door" principle directly challenges modern deep-work orthodoxy.',
      synthesis_tier_used: 'concept_link',
      concept_ids: [
        'concept-systems-thinking',
        'concept-craft-taste',
        'concept-decision-making',
      ],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'Open Doors, Total Systems, and Productive Ambiguity',
        markdown:
          'Hamming\'s closing chapters bridge individual craft with systems architecture. His warning against local sub-optimization ("optimizing a component degrades the whole") anticipates Meadows\'s core thesis in *Thinking in Systems*—namely, that a system\'s behavior is governed by its interconnections, not isolated parts.\n\nEqually striking is your friction point on the "open door." While deep-work orthodoxy treats interruption as pure cost, Hamming treats selective exposure to messy reality as the sensor that keeps your problem selection calibrated. Without external friction, solitary focus risks perfecting solutions to obsolete questions.',
        connections: [
          'Anticipates Meadows\'s warning against optimizing isolated elements at the expense of system purpose.',
          'Counterbalances pure deep-work isolation with real-world problem discovery.',
        ],
        suggested_concepts: ['Systems Thinking', 'First Principles & Craft'],
        open_question:
          'Where are you over-optimizing a local workflow while ignoring the broader system it serves?',
      },
      created_at: '2026-10-08T19:20:00.000Z',
    },
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
          'Epstein opens by dismantling the universal applicability of the Tiger Woods archetype. Here are the anchoring passages from Chapter 1 that frame the book\'s central tension.',
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
    {
      id: 'session-systems-3',
      book_id: 'book-thinking-in-systems',
      session_number: 3,
      chapter_or_pages: 'Ch. 6: Leverage Points — Places to Intervene in a System (pp. 145–165)',
      raw_brain_dump:
        'Meadows ranks 12 leverage points from least effective (tweaking numbers/parameters) to most effective (changing the goals of the system, the mindset/paradigm out of which the system arises, and the power to transcend paradigms). People spend 99% of their energy on parameters.',
      key_resonance_or_friction:
        'Changing the goal or paradigm is terrifying because it threatens existing identity.',
      synthesis_tier_used: 'curated_quotes',
      concept_ids: ['concept-systems-thinking', 'concept-craft-taste'],
      ai_synthesis: {
        tier: 'curated_quotes',
        headline: 'The Hierarchy of Leverage: From Parameters to Paradigms',
        markdown:
          'Chapter 6 is the philosophical peak of Meadows\'s primer. These passages capture why parameter-tweaking feels productive while paradigm shifts actually transform outcomes.',
        quotes: [
          {
            quote:
              'People who have managed to intervene in systems at the level of a paradigm have hit a leverage point that totally transforms systems.',
            commentary:
              'Explains why Hamming\'s insistence on questioning the framing of a problem matters more than optimizing local metrics.',
          },
          {
            quote:
              'The higher the leverage point, the more the system will resist changing it.',
            commentary:
              'Validates your friction note: paradigm shifts threaten institutional and personal identity, which is why they trigger the fiercest pushback.',
          },
        ],
        suggested_concepts: ['Systems Thinking', 'First Principles & Craft'],
        open_question:
          'Where are you tweaking a parameter (number) when you actually need to change an information flow or goal?',
      },
      created_at: '2026-11-15T21:40:00.000Z',
    },
    {
      id: 'session-antifragile-1',
      book_id: 'book-antifragile-taleb',
      session_number: 1,
      chapter_or_pages: 'Book I: The Antifragile — Introduction (pp. 3–64)',
      raw_brain_dump:
        'Three categories: Fragile (breaks under volatility/stress), Robust (indifferent to stress), Antifragile (actually gains and improves from randomness, stressors, and disorder — like muscles, evolution, or startups). Modern institutions try to eliminate all volatility, which ironically makes systems hyper-fragile (turkey problem).',
      key_resonance_or_friction:
        'Eliminating small stressors starves a system of information and makes the eventual crash catastrophic.',
      synthesis_tier_used: 'concept_link',
      concept_ids: [
        'concept-antifragility',
        'concept-systems-thinking',
        'concept-feedback-loops',
      ],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'Volatility as Information: Antifragility Meets Systems Resilience',
        markdown:
          'Taleb\'s triad (Fragile / Robust / Antifragile) snaps cleanly into place next to Donella Meadows\'s warning about "shifting the burden to the intervenor" (*Thinking in Systems*, Session 2). When an institution suppresses every small fluctuation—forest fires, minor market corrections, or routine career setbacks—it removes the balancing feedback that keeps the system calibrated.\n\nBoth Taleb and Meadows arrive at the same counter-intuitive prescription: small, frequent stressors are not bugs to be smoothed away; they are the primary mechanism by which complex systems learn, adapt, and avoid catastrophic overshoot.',
        connections: [
          'Connects Taleb\'s suppression of volatility to Meadows\'s "shifting the burden" trap (*Thinking in Systems*, Session 2).',
          'Reinforces *Range*\'s argument that early friction and wandering build long-term adaptability.',
        ],
        suggested_concepts: [
          'Antifragility & Optionality',
          'Systems Thinking',
          'Feedback Loops',
        ],
        open_question:
          'What small, regular stressor are you currently shielding yourself from that might actually be keeping your skills sharp?',
      },
      created_at: '2026-11-10T21:00:00.000Z',
    },
    {
      id: 'session-antifragile-2',
      book_id: 'book-antifragile-taleb',
      session_number: 2,
      chapter_or_pages: 'Book III–IV: Barbell Strategy & Optionality (pp. 155–218)',
      raw_brain_dump:
        'Barbell strategy: avoid the fragile "medium risk" middle. Put 85-90% in hyper-safe, boring foundations and 10-15% in high-upside, capped-downside experiments (options). Optionality beats intelligence when the future is opaque — you don\'t need to predict, just have asymmetric exposure.',
      key_resonance_or_friction:
        'This reframes career "sampling" in Range as an explicit barbell of optionality.',
      synthesis_tier_used: 'concept_link',
      concept_ids: [
        'concept-antifragility',
        'concept-decision-making',
        'concept-mental-models',
      ],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'The Barbell of Match Quality: Optionality Under Uncertainty',
        markdown:
          'Your connection to *Range* is spot-on. Epstein\'s "sampling period" is essentially a barbell strategy applied to a career: keep your downside capped (low-cost exploration, transferable fundamentals) while exposing yourself to asymmetric upside (unexpected match quality and cross-domain breakthroughs).\n\nIn wicked environments where predicting the winner 10 years out is impossible, Taleb and Epstein converge on the same rule: **optionality outperforms forecasting.** You do not need to know the destination in advance if your structure lets you keep what works and discard what doesn\'t.',
        connections: [
          'Unifies Taleb\'s "optionality over forecasting" with Epstein\'s "sampling period" (*Range*, Session 1 & 3).',
          'Contrasts with Hamming\'s focused problem selection by showing how to survive until you find the right problem.',
        ],
        suggested_concepts: [
          'Antifragility & Optionality',
          'Decision Making',
          'Mental Models',
        ],
        open_question:
          'How can you structure your next 90 days as a barbell—90% rock-solid execution, 10% wild asymmetric experiments?',
      },
      created_at: '2026-11-14T22:10:00.000Z',
    },
    {
      id: 'session-alexander-1',
      book_id: 'book-timeless-way-alexander',
      session_number: 1,
      chapter_or_pages: 'Ch. 1–5: The Quality Without a Name (pp. 1–105)',
      raw_brain_dump:
        'Alexander searches for why certain rooms, courtyards, and towns feel unmistakably alive while modern planned buildings feel dead. He calls it "the quality without a name" — alive, whole, comfortable, free, exact, egoless, eternal. It cannot be imposed from an abstract blueprint; it emerges from patterns that resolve competing forces.',
      key_resonance_or_friction:
        'Applies directly to software architecture: why some codebases feel alive and humane while over-engineered ones feel brittle.',
      synthesis_tier_used: 'concept_link',
      concept_ids: [
        'concept-emergence',
        'concept-craft-taste',
        'concept-systems-thinking',
      ],
      ai_synthesis: {
        tier: 'concept_link',
        headline: 'Living Structure: Resolving Forces Instead of Imposing Blueprints',
        markdown:
          'Alexander\'s "quality without a name" is a structural cousin of Meadows\'s self-organizing systems. A building—or a codebase—feels alive when every pattern resolves a real tension between human needs and physical constraints, rather than forcing an abstract aesthetic from the top down.\n\nThis echoes Hamming\'s emphasis on *taste* (*The Art of Doing Science and Engineering*, Session 1): great craft is not sterile perfection, it is the honest resolution of real forces.',
        connections: [
          'Links Alexander\'s force-resolving patterns to Meadows\'s self-organization.',
          'Connects "egoless, exact" craft to Hamming\'s definition of technical taste.',
        ],
        suggested_concepts: [
          'Emergence & Architecture',
          'First Principles & Craft',
          'Systems Thinking',
        ],
        open_question:
          'In your own work, where are you imposing a rigid blueprint instead of listening to the actual forces at play?',
      },
      created_at: '2026-09-25T18:30:00.000Z',
    },
  ],
};
