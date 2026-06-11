# InterviewMaster

A complete interview-preparation platform for experienced frontend & backend developers — built with **Vue 3, TypeScript, Vite, Pinia, Vue Router and Tailwind CSS v4**.

Not a question dump: every technology is a structured knowledge base — internals, mental models, cheat sheets, layered revision (30-second → 2-minute → deep-dive), real production scenarios and company-specific question banks — designed so you can **revise an entire technology in 15 minutes** before an interview.

## Features

- **16 technologies**: HTML, CSS, JavaScript, TypeScript, Vue, React, Node.js, Express, PostgreSQL, SQL, AWS, Testing, Security, System Design, Architecture, Design Patterns
- **Per technology**: Overview · Internal Working (with flow diagrams) · ⭐-rated Interview Keywords · Cheat Sheets · Leveled Q&A · Coding Questions (with complexity + alternatives) · Production Scenarios · Mental Models · 15-Minute Revision checklist
- **Revision Mode** — 5/15/30/60-minute passes that adapt depth and concept count to your time budget
- **Flashcards** — recall drills generated from keywords, revision items and questions
- **Mock Interview** — role + difficulty based drills with self-scoring and expected follow-ups
- **Last 30 Minutes** — interview-day screen: 5-star concepts, your weak areas, confidence notes
- **Company Bank** — TCS, Infosys, Accenture, Amazon, Zoho, Flipkart, FAANG & startups, round by round
- **Roadmaps** — beginner → expert paths for 7 tracks
- **Bookmarks** with Weak/Revise/Mastered status + a personal knowledge base (notes, mistakes, frequently-forgotten)
- **Progress tracking** — completion %, revision passes, mock accuracy (all in localStorage, no account)
- **Global search (⌘K)** across every keyword, question, cheat sheet and mental model
- Dark/light mode, responsive, lazy-loaded route & content chunks

## Commands

```sh
npm install
npm run dev        # start dev server
npm run build      # typecheck + production build
npm run test       # vitest unit tests
npm run lint       # eslint --fix
npm run format     # prettier
```

## Architecture

- `src/types/content.ts` — the single content contract (`Technology`); every feature (search, flashcards, revision, last-30) derives from it
- `src/data/technologies/*.ts` — one lazy-loaded module per technology (own build chunk each)
- `src/stores` — Pinia stores: theme + user data (bookmarks/progress/notes), persisted via `useStorage`
- `src/composables/useSearch.ts` — runtime-built weighted search index
- `src/views` + `src/components/tech` — documentation-style section renderers
