# Tech-Stack Knowledge Hub + Lessons — Expansion Playbook

This is the exact, repeatable process we used to build the **JavaScript** knowledge hub and its 126
full lesson pages. Use it to add the same depth for any other technology (Vue.js, React, Node.js,
Express, PostgreSQL, SQL, AWS, Testing, Security, System Design, Architecture, Design Patterns).

Do **one technology at a time**. Each pass produces: (1) a knowledge map of concepts, and (2) a full
24-section "mentor" lesson page per concept, wired into routes, search, bookmarks, and tests.

The JavaScript implementation is the gold standard — reference these files when in doubt:
- Knowledge architecture doc: `docs/javascript-knowledge-architecture.md`
- Concept-map types: `src/types/knowledge.ts`
- Concept data (split files): `src/data/knowledge/js-concepts-*.ts`
- Concept-map registry: `src/data/knowledge/index.ts`
- Knowledge Map UI: `src/components/tech/KnowledgeSection.vue`
- Lesson type (24 sections): `src/types/lesson.ts`
- **Gold-standard lesson**: `src/data/lessons/javascript/closure.ts`
- Lesson registry: `src/data/lessons/index.ts`
- Lesson page renderer: `src/views/LessonView.vue`
- Lesson route + guards: `src/router/index.ts`
- Tests: `src/data/knowledge/conceptMap.test.ts`, `src/data/lessons/lessons.test.ts`

---

## THE PROMPT (paste this, fill in `<TECH>`)

> Implement the full Knowledge Hub + 24-section mentor lessons for **`<TECH>`** (e.g. Vue.js / React /
> Node.js), following the exact same pattern we already built for JavaScript. Reuse the existing types,
> renderer, routing, search, bookmark, and test infrastructure — do NOT rebuild them. Work in these phases,
> verifying after each:
>
> **Phase A — Knowledge Architecture (design first, like the JS doc).**
> Acting as a Staff Engineer + Interviewer + Curriculum Designer for `<TECH>`, design a complete concept map
> from beginner to senior/expert. Produce `docs/<tech>-knowledge-architecture.md` mirroring
> `docs/javascript-knowledge-architecture.md`: hierarchical tree by category, dependency graph (prerequisite
> "spines"), a per-concept catalog (slug, name, level, importance/interviewFrequency/realWorldUsage ratings,
> definition, prerequisites, leadsTo, common questions), the Top-N for senior devs, the Top-20 most-asked,
> and the overlooked-concepts list. Slugs are kebab-case and route-ready (`/<tech>/<slug>`).
>
> **Phase B — Concept data (the map layer).**
> Create category metadata + `ConceptNode[]` data following `src/types/knowledge.ts`. Split into a few files
> under `src/data/knowledge/<tech>-concepts-*.ts` (like `js-concepts-foundations.ts` etc.), fan out via
> parallel agents by category group. Add the tech to the registry in `src/data/knowledge/index.ts`
> (new `<tech>:` loader + its `<tech>Categories`). Add the chunk rule in `vite.config.ts`
> (`/src/data/knowledge/<tech>-concepts-` → `knowledge-<tech>`). Every prerequisite/leadsTo slug must resolve
> to a real concept in the same map. The Knowledge Map tab appears automatically because `hasConceptMap()`
> already drives `TechView.vue` and `KnowledgeSection.vue` is generic.
>
> **Phase C — Full lessons (the mentor layer).**
> For EVERY concept, author one `ConceptLesson` file at `src/data/lessons/<tech>/<slug>.ts` following
> `src/types/lesson.ts` and matching the depth/tone/structure of `src/data/lessons/javascript/closure.ts`
> across all 24 sections. Fan out via ~16 parallel agents in batches of ~8 concepts. Use a shared brief
> (see "Agent brief template" below) and give each agent a batch JSON file with exact slug/name/category/
> level/ratings copied from the Phase-B data (agents must NOT invent ratings). Then auto-generate the lesson
> registry entries in `src/data/lessons/index.ts` (one `'<tech>/<slug>': () => import('./<tech>/<slug>')`
> line per concept, sorted).
>
> **Phase D — Wire-up (mostly already generic — verify, don't rebuild).**
> The lesson route `/:tech(<pattern>)/:slug` in `src/router/index.ts` is driven by `techMetas`, so it already
> matches any real tech id. The `LessonView.vue` renderer, the "📖 Lesson ↗" badge + "Open full lesson"
> link in `KnowledgeSection.vue`, the bare standalone layout in `App.vue`, the ⌘K search indexing
> (`useSearch.ts` indexes every concept map via `hasConceptMap`/`loadConceptMap`), and concept bookmarking
> all work generically. Only confirm they light up for `<TECH>`.
>
> **Phase E — Verify (gate before declaring done).**
> Extend the tests to cover `<TECH>` the same way JS is covered: knowledge-map integrity (no duplicate slugs,
> all category refs valid, all prerequisite/leadsTo links resolve, ratings 1–5) and lesson integrity (every
> concept has a lesson; every lesson is structurally complete — all required sections populated, ≥4 interview
> questions, ≥4 exercises, all four code examples, related links resolve). Then run, from the project root
> `/Users/apple/Desktop/Temp/PHOTOSHARE/interviewmaster`:
> `npx vue-tsc --noEmit -p tsconfig.app.json` (must be clean), `npm run test` (all pass), `npm run build`
> (must succeed), and smoke-test a sample of `/<tech>/<slug>` routes returning 200 plus the route guards
> (`/companies`, `/tech/<tech>/knowledge`) not shadowed. Fix everything before reporting done.

---

## Agent brief template (for Phase C lesson authoring)

Write this to a temp file and point each batch agent at it (this is what we used for JS — adapt `<TECH>`):

```
You are authoring deep, mentor-style <TECH> interview-prep LESSON pages for a Vue 3 + TypeScript app.
Each lesson teaches ONE concept progressively from child-level to senior mastery.

READ FIRST (mandatory):
1. src/types/lesson.ts — the ConceptLesson interface. Follow it EXACTLY (every field, exact shapes).
2. src/data/lessons/javascript/closure.ts — the GOLD-STANDARD exemplar. Match its depth/tone/completeness
   for EVERY lesson. No thinner.

YOUR BATCH: concepts (slug,name,category,level,importance,interviewFrequency,realWorldUsage) are in: <BATCH_JSON>
Use those EXACT values. difficulty = the level string.

OUTPUT: for each concept write src/data/lessons/<tech>/<slug>.ts as:
  import type { ConceptLesson } from '../../../types/lesson'
  const <camelCaseName>: ConceptLesson = { ... }
  export default <camelCaseName>
(convert slug to a valid identifier: 'var-let-const' -> varLetConst).

CONTENT RULES — every section substantive (teaching product, not docs):
- Section-1 summary fields: copy from batch JSON.
- whyCare: 3-5 bullets. childExplanation: vivid one-line analogy + 3-5 sentence story, NO jargon.
- schoolExplanation: 3-4 sentences. beginnerExplanation: {what,how,why} + a correct runnable LessonCode example.
- technicalDefinition: one precise interview-ready paragraph. internalWorking: 4-6 ordered, technically accurate steps.
- mentalModelDiagram: a real multi-line ASCII diagram. memoryVisualization: include only when memory-relevant, else OMIT.
- examples: basic/intermediate/advanced/realProject, each correct LessonCode + 3-5 explanation bullets;
  realProject references the relevant framework/runtime where natural.
- interviewQuestions: 5-6 spanning beginner->intermediate->advanced->senior, each {level,question,answer,explanation}.
- followUps: 5-6. commonMistakes: 3-4 {mistake,why,fix}. productionUsage: 3-4 {area,detail}.
- performance: {good[],bad[],optimizations[]} 2-4 each. security: include only when there's a real security angle, else OMIT.
- related: {prerequisites[],nextConcepts[],dependencyNote} using ONLY real slugs from the master list (provided below).
- whiteboard: {script[] 4-6 steps, diagram ASCII}. thirtySecond: one paragraph. twoMinute: full spoken answer (150-220 words).
- seniorDeepDive: {tradeoffs[],edgeCases[],runtimeBehavior[],scalability[],productionConcerns[]} 2-4 each, genuinely senior.
- cheatSheet: 8-12 terse bullets. exercises: exactly 4 with difficulties 'easy','medium','hard','interview',
  each {difficulty,prompt,hint?,solution:LessonCode}. confidenceBooster: {whyImportant, howCompaniesAsk
  (TCS/Infosys vs Zoho/Flipkart/Razorpay vs FAANG), whatInterviewersExpect}.

MASTER SLUG LIST (only these for prerequisites/nextConcepts): <PASTE ALL <TECH> SLUGS>

TYPESCRIPT/SAFETY: escape backticks/${ } if using template literals for `code`, or use single-quoted strings
with \n. Never produce a syntax error. Don't edit files outside your batch, the registry, or closure.ts.
When done: npx tsc --noEmit -p tsconfig.app.json 2>&1 | grep 'data/lessons/<tech>' ; fix only YOUR files.
Final reply: count of files written + tsc-clean status.
```

---

## Mechanics that worked (and gotchas to repeat/avoid)

- **Parallelize hard:** ~16 background agents, contiguous batches of ~8 so related concepts cluster. The map
  data (Phase B) can also be split across ~4 agents by category group.
- **Feed exact metadata, not guesses:** generate per-batch JSON from the Phase-B concept data so agents copy
  ratings/categories verbatim. We did this with a small Node script that parsed the `-concepts-*.ts` files.
- **Auto-generate the registry** with a Node script (don't hand-write 100+ import lines). Sort slugs.
- **Each lesson stays its own lazy chunk** — do NOT add a manualChunks rule merging them; per-page load is
  the goal (a lesson tab pulls only its own ~9KB gzipped).
- **Verify with a fresh typecheck at the very end.** Mid-run typechecks can read files while an agent is still
  writing them and report phantom TS1005 errors at EOF (looks like a missing brace / desynced parser). Re-run
  after all agents report done before believing any error. `node --check` on a transformed copy helps confirm
  a file is actually valid.
- **Watch the temp filesystem.** 16 agent transcripts can fill the small temp mount (ENOSPC), which can corrupt
  an in-flight write and kill background pollers. If it happens, free space / set `CLAUDE_CODE_TMPDIR`, then
  just re-verify — the agents' own final typecheck usually fixed their files already.
- **Lessons open in a NEW TAB, standalone:** the lesson route uses `meta.layout: 'bare'` so `App.vue` renders
  it without sidebar/topbar; the Knowledge Map links use `<a target="_blank">` (not RouterLink) so the map tab
  stays open. Mobile gets the sticky "Jump to section" `<select>`; desktop gets the sticky side-nav. This is
  already generic — no per-tech work.
- **Definition of done:** clean `vue-tsc`, all tests green (incl. the new per-tech integrity tests), successful
  `npm run build`, and a sample of `/<tech>/<slug>` routes returning 200 with guards intact.

## Suggested order

Do Vue.js first (flagship), then React, Node.js, Express, then the data/cloud/quality/design techs. Within a
tech, you can ship Phase A+B (the map) first for immediate value, then Phase C lessons (optionally
highest-frequency concepts first, then the long tail).
```
