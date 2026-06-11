import type { ConceptLesson } from '../../../types/lesson'

const topLevelAwait: ConceptLesson = {
  // 1. Concept Summary
  slug: 'top-level-await',
  name: 'Top-Level await',
  category: 'modules',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Top-level await (TLA) lets you use `await` directly at the top of an ES module — no wrapping IIFE async function — so module initialization can depend on async work.',
    'It cleanly handles cases like loading config, connecting to a database, or fetching a dynamic dependency before a module is considered "ready".',
    'It changes module evaluation semantics: a module using TLA becomes asynchronous, and every importer waits for it — which can introduce surprising load delays.',
    'It only works in ES Modules, not CommonJS, making it another concrete reason to understand the ESM/CJS divide.',
    'Interviewers use it to test whether you understand the module evaluation phase and how awaiting at the top blocks dependents.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Top-level await is a shop that won\'t open its doors until the delivery truck arrives.',
    story: [
      'Imagine a bakery that needs flour delivered before it can sell anything.',
      'Normally the bakery would open and just tell customers "sorry, no bread yet, come back later".',
      'With top-level await, the bakery keeps its doors closed and the "OPEN" sign off until the flour truck actually arrives — then it opens fully stocked.',
      'A module with top-level await is like that bakery: it waits for its delivery (an async task like fetching data) to finish before it lets anyone in, so everything that needs it gets a fully-ready shop.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some setup work takes time, like asking a server for information — that is "asynchronous" work, and normally you handle it with `await` inside an async function.',
    'Top-level await means you are allowed to write `await` at the very top of a module file, not inside any function.',
    'When you do this, the module pauses its own startup until that awaited work finishes.',
    'Any other file that imports this module also waits, so by the time they use it, the async setup is already done.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Top-level await is the ability to use the `await` keyword at the top level of an ES module, outside any async function, so the module\'s evaluation can pause on a promise.',
    how: 'When the engine evaluates a module containing top-level await, it treats that module as asynchronous: evaluation suspends at the `await` until the promise settles, and importers do not finish loading until the module completes. Internally the module becomes a promise that the loader waits on.',
    why: 'It removes the awkward `(async () => { ... })()` wrapper and lets a module export values that depend on async initialization (config, connections, lazily chosen implementations) in a clean, sequential style.',
    code: {
      label: 'Awaiting config at module top level',
      lang: 'js',
      code: `// config.js (an ES module)\nconst res = await fetch('/api/config')   // top-level await\nexport const config = await res.json()\n\n// app.js\nimport { config } from './config.js'\n// app.js only runs AFTER config.js finished its awaits\nconsole.log(config.featureFlags)`,
      explanation: [
        '`await fetch(...)` sits at the module top level — no surrounding async function needed.',
        'config.js\'s evaluation pauses until both awaits settle.',
        'app.js imports config.js, so its execution is delayed until config.js is fully ready.',
        'By the time `config.featureFlags` is read, the async fetch has already completed.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Top-level await is an ECMAScript feature allowing the `await` operator at the top level of an ES module body. A module that uses it becomes an asynchronous module: its evaluation returns a promise, and the module graph evaluation treats it as a node that must settle before dependents finish evaluating. The host evaluates dependencies depth-first; when it reaches an async module it suspends, schedules continuation as microtasks, and only resolves the dependent modules\' evaluation once the awaited promises settle. TLA is unavailable in CommonJS (whose evaluation is synchronous) and propagates asynchrony transitively — any module importing an async module also defers completion until that import resolves.',

  // 7. Internal Working
  internalWorking: [
    'PARSE: the engine marks a module as "async" if its top-level body contains an `await` (or `for await`), changing how it is evaluated.',
    'GRAPH EVALUATION: modules still link before evaluation; during the evaluation phase the host walks the graph depth-first, evaluating dependencies before dependents.',
    'SUSPEND: when an async module hits a top-level `await`, its execution suspends, the awaited promise is registered, and control returns to the event loop; the continuation is scheduled as a microtask when the promise settles.',
    'PROPAGATION: a module that imports an async module cannot finish its own evaluation until that dependency\'s evaluation promise resolves, so asynchrony flows up the graph transitively.',
    'COMPLETION: once all awaited promises settle, the module\'s evaluation promise fulfills (or rejects), and dependents resume/complete; a rejection becomes the module\'s evaluation error.',
    'CACHING: like any module, an async module evaluates once; later imports await the same already-settled evaluation promise and get the cached namespace.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  module graph evaluation (depth-first)
       app.js
         │ import { config } from './config.js'
         ▼
   ┌──────────── config.js (ASYNC module) ──────────┐
   │ const res = await fetch('/api/config')         │
   │            ──suspend──► event loop ──settle──┐  │
   │ export const config = await res.json() ◄─────┘  │
   └──── evaluation promise fulfills ────────────────┘
         │ ONLY NOW does app.js complete
         ▼
   app.js runs with config fully ready
   (CommonJS cannot do this — sync evaluation only)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — replace the async IIFE wrapper',
      lang: 'js',
      code: `// Before (no TLA): wrap everything in an async IIFE\n(async () => {\n  const data = await fetch('/data.json').then(r => r.json())\n  start(data)\n})()\n\n// After (TLA in a module): flat and sequential\nconst data = await fetch('/data.json').then(r => r.json())\nstart(data)`,
      explanation: [
        'Before TLA, async setup at module scope needed an immediately-invoked async function.',
        'With TLA you await directly at the top level — flatter, more readable.',
        'Errors propagate as the module\'s evaluation error instead of an unhandled rejection inside the IIFE.',
        'Only valid in ES modules, never in CommonJS.',
      ],
    },
    intermediate: {
      label: 'Intermediate — choose an implementation at load time',
      lang: 'js',
      code: `// db.js — pick a driver based on environment, async\nconst driver = process.env.DB === 'postgres'\n  ? await import('./pg-driver.js')\n  : await import('./sqlite-driver.js')\n\nexport const db = await driver.connect()\n\n// repo.js\nimport { db } from './db.js'\nexport async function getUser(id) {\n  return db.query('SELECT * FROM users WHERE id=?', [id])\n}`,
      explanation: [
        'Top-level await combines with dynamic `import()` to select and load a driver at startup.',
        '`db` is exported only after the async connection resolves, so importers get a ready connection.',
        'repo.js waits for db.js to finish before its own evaluation completes.',
        'This is a clean alternative to lazy-initialization guards scattered through the code.',
      ],
    },
    advanced: {
      label: 'Advanced — the blocking pitfall and a non-blocking alternative',
      lang: 'js',
      code: `// slow.js — TLA here delays EVERY importer\nawait new Promise(r => setTimeout(r, 3000)) // 3s wait\nexport const ready = true\n\n// Better when blocking is undesirable: export the promise, don't await it\n// config.js\nexport const configPromise = fetch('/api/config').then(r => r.json())\n// consumer.js — await only where actually needed\nimport { configPromise } from './config.js'\nconst config = await configPromise`,
      explanation: [
        'Top-level await blocks the evaluation of the whole subtree of importers — a 3s await stalls the app.',
        'If you do not need every importer to wait, export the promise instead and let consumers await it at the point of use.',
        'This keeps module loading fast while still allowing async data where needed.',
        'Senior teams weigh "must be ready before anything runs" (TLA) vs "ready on demand" (exported promise).',
      ],
    },
    realProject: {
      label: 'Real project — Node ESM server bootstrap',
      lang: 'js',
      code: `// server.js (\"type\": \"module\")\nimport express from 'express'\nimport { migrate } from './migrate.js'\n\nawait migrate()                 // run DB migrations before serving\nconst secrets = await loadSecrets()\n\nconst app = express()\napp.get('/health', (_, res) => res.send('ok'))\napp.listen(3000, () => console.log('listening with secrets loaded'))`,
      explanation: [
        'In a Node ESM entrypoint, TLA runs migrations and loads secrets before the server starts accepting traffic.',
        'No async IIFE wrapper — the bootstrap reads top to bottom.',
        'If `migrate()` rejects, the module evaluation fails and the process exits with the error — a clean fail-fast.',
        'This pattern requires ESM (`"type": "module"`); a CommonJS entry would need an async IIFE instead.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is top-level await and where can you use it?',
      answer: 'It is the ability to use `await` at the top level of an ES module, outside any async function. It works only in ES modules, not in CommonJS.',
      explanation: 'A good answer mentions it removes the need for an async IIFE wrapper.',
    },
    {
      level: 'beginner',
      question: 'Why can\'t you use top-level await in CommonJS?',
      answer: 'CommonJS module evaluation is synchronous — `require()` returns immediately with the exports — so there is no mechanism to suspend evaluation on a promise. ESM evaluation can be asynchronous, which TLA requires.',
      explanation: 'This connects TLA directly to the ESM-vs-CJS evaluation model.',
    },
    {
      level: 'intermediate',
      question: 'How does a top-level await affect modules that import it?',
      answer: 'The importing modules wait — their evaluation does not complete until the async module\'s evaluation promise settles. Asynchrony propagates transitively up the graph.',
      explanation: 'Highlighting the transitive blocking shows you understand the practical cost.',
    },
    {
      level: 'intermediate',
      question: 'What is the main risk of top-level await?',
      answer: 'It can block/delay the loading of every dependent module. A slow await at module scope stalls the whole subtree that imports it, hurting startup performance.',
      explanation: 'Mention the alternative of exporting a promise to avoid forcing all importers to wait.',
    },
    {
      level: 'advanced',
      question: 'When would you prefer exporting a promise over using top-level await?',
      answer: 'When not every consumer needs the value before doing anything else. Exporting a promise keeps module loading fast and lets only the consumers that need the value await it at the point of use, avoiding blocking the whole import subtree.',
      explanation: 'This shows judgment about startup latency versus convenience.',
    },
    {
      level: 'senior',
      question: 'Explain how top-level await fits into the module evaluation phase and microtask scheduling.',
      answer: 'Modules link before evaluation. During depth-first evaluation, an async module suspends at its top-level await, registers the promise, and yields to the event loop; its continuation runs as a microtask when the promise settles. Its evaluation promise resolves only afterward, gating dependents. A rejection becomes the module\'s evaluation error and propagates to importers.',
      explanation: 'Senior signal: tying TLA to the link/evaluate phases, microtask queue, and error propagation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does top-level await interact with circular dependencies?',
    'What happens to importers if a top-level await rejects?',
    'How is TLA different from wrapping code in an async IIFE?',
    'Does using TLA in one module make the whole app load slower?',
    'How do bundlers handle modules that use top-level await?',
    'Can you combine top-level await with dynamic import to pick implementations at startup?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using top-level await in a CommonJS file.',
      why: 'CJS evaluates synchronously and has no await-at-top support, causing a syntax/runtime error.',
      fix: 'Use an ES module (`.mjs` or `"type": "module"`), or wrap in an async IIFE for CJS.',
    },
    {
      mistake: 'Putting a slow top-level await in a widely-imported module.',
      why: 'Every importer\'s evaluation blocks until it settles, stalling app startup.',
      fix: 'Move async work behind a function, export a promise consumers await on demand, or scope TLA to the entrypoint only.',
    },
    {
      mistake: 'Ignoring rejection of a top-level await.',
      why: 'A rejected top-level await becomes the module\'s evaluation error and breaks all importers.',
      fix: 'Wrap risky awaits in try/catch and provide a fallback or fail fast intentionally at the entrypoint.',
    },
    {
      mistake: 'Assuming TLA makes a value synchronously available to non-importers.',
      why: 'Only modules that import the async module wait; code that does not import it is unaffected and may run earlier.',
      fix: 'Express the dependency explicitly via imports so the ordering guarantee actually applies.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'ESM server entrypoints run migrations, load secrets, or connect to a DB with TLA before `listen()`, replacing async IIFE bootstrap wrappers.' },
    { area: 'Vue', detail: 'Vite supports TLA in modules; apps use it sparingly to load runtime config or feature flags before mounting, though most prefer awaiting in `main.js` setup.' },
    { area: 'React', detail: 'Build setups (Vite/webpack 5) allow TLA for fetching runtime config; teams keep it at the entry to avoid delaying component chunks.' },
    { area: 'Backend', detail: 'Service modules pick a driver/implementation via `await import()` at load time, exporting a ready client so request handlers never see an uninitialized connection.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lets initialization-critical async work complete before any dependent code runs, preventing "not ready yet" bugs.',
      'Removes async IIFE overhead/closures and keeps bootstrap code linear and readable.',
    ],
    bad: [
      'Blocks evaluation of the entire dependent subtree — a slow await delays app startup.',
      'Asynchrony propagates transitively, so one TLA can serialize loading of many modules.',
    ],
    optimizations: [
      'Keep TLA at the entrypoint or in modules everyone genuinely must wait for.',
      'Prefer exporting a promise (await on demand) when not all importers need the value immediately.',
      'Parallelize independent awaits with `Promise.all` rather than sequential top-level awaits.',
      'Avoid TLA on hot import paths used by lazy chunks where startup latency matters.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'promises', 'async-await'],
    nextConcepts: ['dynamic-imports', 'esm-vs-cjs', 'circular-dependencies', 'bundlers-module-resolution'],
    dependencyNote:
      'Top-level await builds directly on es-modules (it only works there) plus promises and async-await. It pairs with dynamic-imports for load-time implementation selection, contrasts with CommonJS (esm-vs-cjs), and interacts subtly with circular-dependencies and how bundlers resolve graphs.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write config.js with `const c = await fetch(...)` at the top level.',
      'Mark config.js as an "async module".',
      'Draw app.js importing config.js with an arrow.',
      'Annotate: "app.js evaluation WAITS for config.js evaluation promise to settle".',
      'Say: "TLA suspends at the await, yields to the event loop, resumes via microtask".',
      'Warn: "this blocks the whole dependent subtree — and it is ESM-only".',
    ],
    diagram: `  config.js (ASYNC)        app.js
  ┌──────────────────┐     ┌─────────────────┐
  │ await fetch(...)  │◄────│ import { c }    │
  │ export const c    │     │ (WAITS for      │
  └──────────────────┘     │  config.js)     │
   suspend→loop→microtask  └─────────────────┘
   ESM only (CJS = sync, can't suspend)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Top-level await lets you use `await` at the top of an ES module without an async wrapper. The module becomes asynchronous: its evaluation suspends at the await and importers wait for its evaluation promise to settle, with asynchrony propagating up the graph. It is ESM-only (CommonJS is synchronous). It is great for must-be-ready-first setup like config or DB connections, but a slow top-level await blocks the whole dependent subtree — so prefer exporting a promise when not everyone needs to wait.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Top-level await is the ability to use the `await` keyword at the top level of an ES module, outside any async function. Before it, async initialization at module scope required wrapping everything in an immediately-invoked async function; now you can write the await directly, which is flatter and lets errors surface as the module\'s evaluation error. The important semantic change is that a module using top-level await becomes an asynchronous module: its evaluation returns a promise, and any module that imports it cannot finish its own evaluation until that promise settles. Internally, modules still link before evaluation; during the depth-first evaluation phase, when the engine hits a top-level await it suspends the module, registers the awaited promise, yields to the event loop, and resumes as a microtask when the promise settles. This asynchrony propagates transitively up the import graph. That gives you a clean way to guarantee initialization-critical async work — loading config, running migrations, connecting to a database, or picking an implementation via dynamic import — finishes before dependent code runs. The big caveat is performance: a slow top-level await blocks the evaluation of the entire dependent subtree, so it can delay startup. When not every consumer needs the value upfront, the better pattern is to export a promise and let consumers await it on demand. And it only works in ES Modules — CommonJS evaluation is synchronous and cannot suspend.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Convenience and correctness (guaranteed-ready exports) vs startup latency (blocking the dependent subtree).',
      'Top-level await vs exporting a promise: the former enforces ordering for all importers, the latter keeps loading fast but pushes awaiting to consumers.',
    ],
    edgeCases: [
      'Circular dependencies plus TLA can deadlock-like stall or surface uninitialized bindings if a cycle awaits a not-yet-evaluated peer.',
      'A rejected top-level await becomes the module evaluation error and fails every importer — no partial loading.',
      'Multiple sequential top-level awaits serialize; use Promise.all to parallelize independent work.',
      'Mixing TLA modules into a CJS-consuming context fails, since CJS cannot require an async ESM graph.',
    ],
    runtimeBehavior: [
      'Suspension yields to the event loop; the continuation runs as a microtask once the promise settles.',
      'The module\'s evaluation promise gates all dependents; cached imports await the same settled promise.',
      'Bundlers must preserve async-module semantics, emitting runtime that awaits the module before using its exports.',
    ],
    scalability: [
      'Used at the entrypoint, TLA scales fine; spread across many shared modules it serializes loading and hurts cold start.',
      'In serverless/edge environments, a slow top-level await increases cold-start time on every new instance.',
    ],
    productionConcerns: [
      'Audit which modules use TLA so a slow dependency does not silently inflate startup latency.',
      'Add timeouts/fallbacks around network awaits at module scope to avoid indefinite startup hangs.',
      'Document that TLA modules are ESM-only to prevent CJS consumers from hitting require() errors.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'TLA = `await` at the top level of an ES module.',
    'ESM only — CommonJS evaluation is synchronous.',
    'Makes the module asynchronous: evaluation returns a promise.',
    'Importers WAIT for that evaluation promise to settle.',
    'Asynchrony propagates transitively up the import graph.',
    'Suspends at the await, yields to event loop, resumes via microtask.',
    'Great for must-be-ready setup: config, migrations, DB connect.',
    'Slow TLA blocks the whole dependent subtree (startup delay).',
    'Prefer exporting a promise when not all importers must wait.',
    'A rejected TLA = module evaluation error → breaks importers.',
    'Replaces the async IIFE bootstrap wrapper.',
    'Combine with dynamic import() to choose impl at load time.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this async IIFE module bootstrap using top-level await: `(async () => { const c = await getConfig(); start(c) })()`.',
      hint: 'Drop the wrapper and await directly (ESM only).',
      solution: {
        lang: 'js',
        code: `// bootstrap.mjs\nconst c = await getConfig()\nstart(c)`,
        explanation: [
          'The async IIFE wrapper is removed; the await sits at the top level.',
          'This only works because the file is an ES module.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a `config.js` module that fetches and exports config with top-level await, and a consumer that uses it. Note what waits for what.',
      hint: 'Export after awaiting; the consumer import implies waiting.',
      solution: {
        lang: 'js',
        code: `// config.js\nconst res = await fetch('/api/config')\nexport const config = await res.json()\n\n// consumer.js\nimport { config } from './config.js'\nconsole.log(config) // runs only after config.js fully evaluated`,
        explanation: [
          'config.js suspends at each await; its evaluation promise settles after both.',
          'consumer.js cannot complete evaluation until config.js does, so `config` is ready when logged.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A module does three independent slow awaits at the top level, serializing startup. Refactor to load them in parallel.',
      hint: 'Use Promise.all with one top-level await.',
      solution: {
        lang: 'js',
        code: `// Before: serial (sum of all delays)\n// const a = await fetchA(); const b = await fetchB(); const c = await fetchC()\n\n// After: parallel (max delay)\nconst [a, b, c] = await Promise.all([fetchA(), fetchB(), fetchC()])\nexport { a, b, c }`,
        explanation: [
          'Starting all three promises first, then awaiting Promise.all, overlaps the waits.',
          'Total startup time becomes the slowest single request instead of the sum.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why you might export a promise instead of using top-level await, given startup performance concerns.',
      hint: 'TLA blocks all importers; an exported promise defers awaiting to where needed.',
      solution: {
        lang: 'js',
        code: `// data.js — NON-blocking: export the promise\nexport const usersPromise = fetch('/users').then(r => r.json())\n\n// list.js — only this consumer waits, at point of use\nimport { usersPromise } from './data.js'\nexport async function renderList() {\n  const users = await usersPromise\n  return users.map(u => u.name)\n}\n// other modules importing data.js are NOT blocked by the fetch`,
        explanation: [
          'With top-level await, every importer of data.js would block on the fetch.',
          'Exporting the promise keeps module loading fast and confines the await to renderList.',
          'This is the standard tradeoff: enforced ordering (TLA) vs fast startup (exported promise).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Top-level await is a smaller topic, but explaining it well demonstrates deep understanding of the module evaluation phase, async semantics, and the ESM/CJS divide — exactly the kind of nuance that separates strong candidates.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go beyond "what is it and where can you use it". Product companies (Zoho, Flipkart, Razorpay) ask about its blocking effect on importers and when to export a promise instead. FAANG-level interviews probe the evaluation phase, microtask scheduling, and circular-dependency/error-propagation edge cases.',
    whatInterviewersExpect:
      'Define TLA as await at ES-module top level, explain that the module becomes async and importers wait, note it is ESM-only because CJS is synchronous, and show judgment about the startup-latency tradeoff (TLA vs exporting a promise).',
  },
}

export default topLevelAwait
