import type { ConceptLesson } from '../../../types/lesson'

const dynamicImports: ConceptLesson = {
  // 1. Concept Summary
  slug: 'dynamic-imports',
  name: 'Dynamic import()',
  category: 'modules',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Dynamic `import()` lets you load a module at runtime, on demand, instead of up front — the foundation of code splitting and lazy loading.',
    'It is the only way to load a module conditionally, with a computed path, or after a user action, because static `import` must be top-level and unconditional.',
    'Every fast SPA uses it: route-based splitting, lazy components, deferred heavy libraries (charts, editors) — it directly shrinks the initial bundle and improves load time.',
    'It is also the bridge that lets CommonJS files load ESM-only packages, since `require()` cannot.',
    'Interviewers use it to test whether you understand the difference between static (build-time, hoisted) and dynamic (runtime, promise-based) module loading.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Dynamic import is ordering a tool only when you actually need it, not carrying every tool from the start.',
    story: [
      'Imagine you go hiking and you could either stuff your backpack with every possible tool — a tent, a fishing rod, a snorkel — and carry all that weight the whole way.',
      'Or you could carry just the essentials and, when you suddenly reach a lake and want to fish, radio for the fishing rod to be delivered right then.',
      'Carrying everything makes you slow at the start. Ordering things only when needed keeps you light and fast.',
      'Dynamic import is the radio call: the program starts light, and only fetches a chunk of code at the exact moment a feature is used — like opening a chart or a photo editor.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally you list all the files your program needs at the very top, and they all load before anything runs.',
    'But sometimes you only need a piece of code if the user clicks a certain button or visits a certain page.',
    'Dynamic import lets you say "load this file now, while running" using `import(\'./file.js\')`, which hands you back a promise.',
    'When the file finishes loading, the promise resolves with the module so you can use it — keeping the program small and quick to start.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Dynamic `import()` is a function-like expression that loads an ES module at runtime and returns a promise resolving to the module\'s namespace object.',
    how: 'You call `import(specifier)` anywhere in code (even inside an `if` or an event handler). It triggers fetching/evaluating the module asynchronously and resolves with an object whose properties are the module\'s exports (including `default`). You typically `await` it or chain `.then()`.',
    why: 'Unlike static `import` (resolved before execution and always loaded), dynamic import is lazy and conditional — letting you split your bundle and only download code when it is actually needed.',
    code: {
      label: 'Lazy-load a module on demand',
      lang: 'js',
      code: `button.addEventListener('click', async () => {\n  // module is fetched only when the button is clicked\n  const { renderChart } = await import('./chart.js')\n  renderChart(data)\n})`,
      explanation: [
        '`import(\'./chart.js\')` returns a promise; the chart code is NOT in the initial bundle.',
        'Bundlers see this and split `chart.js` into a separate chunk loaded on demand.',
        '`await` gives the resolved namespace object; we destructure the named export `renderChart`.',
        'Until the user clicks, none of the chart code is downloaded — faster initial load.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Dynamic `import()` is a syntactic form (an ImportCall expression, not a true function) that performs runtime, asynchronous module loading and returns a promise for the requested module\'s namespace object. Unlike static imports, its specifier may be any runtime expression, it can appear in any scope or conditional, and it does not hoist. The host resolves, fetches, instantiates, and evaluates the target module (and its subgraph) once, caching the result; subsequent calls with the same resolved specifier return the same module from cache. The resolved namespace exposes all named exports plus `default`. Bundlers treat each `import()` call site as a code-split point, emitting a separate chunk loaded lazily.',

  // 7. Internal Working
  internalWorking: [
    'PARSE: `import()` is recognized as an ImportCall expression; because the specifier can be dynamic, the engine does not include the target in the static pre-resolved graph.',
    'INVOCATION: when execution reaches `import(spec)`, the host resolves `spec` to a module record (using the active resolver/import map) and returns a pending promise immediately.',
    'CACHE CHECK: if that module is already in the module registry/cache, the existing instance is reused and the promise resolves with its namespace without re-evaluating the body.',
    'LOAD + LINK + EVALUATE: otherwise the host fetches and parses the module and its dependencies, links bindings, and evaluates bodies once in dependency order — all asynchronously.',
    'RESOLUTION: the promise fulfills with a Module Namespace Object exposing live bindings for each export (and `default`); on failure (network/syntax error) it rejects.',
    'BUNDLER SIDE: at build time, each static `import()` literal specifier becomes a separate chunk; the runtime injects the fetch (e.g. via `<script>`/`fetch`) and wires the promise to chunk load completion.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  INITIAL BUNDLE (small, loads fast)
  ┌───────────────────────────────┐
  │ app.js  router.js  ui.js      │
  └───────────────────────────────┘
         │ user clicks "Charts"
         ▼
   import('./chart.js')  ──returns──► Promise(pending)
         │ host: resolve → fetch chunk → link → evaluate
         ▼
   ┌──────────────────────────┐
   │ chart.chunk.js (lazy)    │  ← downloaded NOW, cached
   └──────────────────────────┘
         │ resolves with
         ▼
   { default, renderChart, ... }  (Module Namespace Object)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — await a dynamic import',
      lang: 'js',
      code: `async function loadMath() {\n  const math = await import('./math.js')\n  console.log(math.add(2, 3)) // 5\n  console.log(math.default)   // the default export, if any\n}\nloadMath()`,
      explanation: [
        '`import(\'./math.js\')` returns a promise resolving to the namespace object.',
        'Named exports are properties on that object (`math.add`).',
        'The default export is available as `math.default`.',
        'The module is evaluated only when this code runs, not at startup.',
      ],
    },
    intermediate: {
      label: 'Intermediate — conditional + computed specifier',
      lang: 'js',
      code: `async function loadLocale(lang) {\n  // computed specifier — impossible with static import\n  const messages = await import(\`./locales/\${lang}.js\`)\n  return messages.default\n}\n\nif (user.prefersDarkMode) {\n  await import('./theme-dark.js') // conditional load\n}`,
      explanation: [
        'The specifier is built at runtime from `lang` — static import cannot do this.',
        'Bundlers handle template-literal specifiers by emitting a chunk per matching file in `./locales/`.',
        'The second call loads theme code only for users who need it.',
        'Both are inside normal control flow, which static top-level imports forbid.',
      ],
    },
    advanced: {
      label: 'Advanced — robust lazy loader with error + retry',
      lang: 'js',
      code: `async function importWithRetry(loader, retries = 2) {\n  try {\n    return await loader()\n  } catch (err) {\n    if (retries > 0) {\n      await new Promise(r => setTimeout(r, 300))\n      return importWithRetry(loader, retries - 1)\n    }\n    throw err\n  }\n}\n\nconst mod = await importWithRetry(() => import('./editor.js'))\nmod.mount('#app')`,
      explanation: [
        'Wrapping the call in a loader thunk lets a bundler still statically see `import(\'./editor.js\')` and split it.',
        'Dynamic import can REJECT (chunk fetch failure on flaky networks), so production code should handle errors.',
        'Retrying transient chunk-load failures is a common real-world pattern (e.g. after a deploy invalidates old chunks).',
        'The module is cached after first success, so a later `import(\'./editor.js\')` resolves instantly.',
      ],
    },
    realProject: {
      label: 'Real project — route-level code splitting in Vue & React',
      lang: 'js',
      code: `// Vue Router — lazy route\nconst routes = [\n  { path: '/dashboard', component: () => import('./views/Dashboard.vue') }\n]\n\n// React — lazy component\nimport { lazy, Suspense } from 'react'\nconst Settings = lazy(() => import('./Settings.jsx'))\nfunction App() {\n  return <Suspense fallback={<Spinner/>}><Settings/></Suspense>\n}`,
      explanation: [
        'Vue Router accepts a function returning `import(...)`, so each route becomes its own chunk loaded on navigation.',
        'React\'s `lazy()` takes a function returning a dynamic import; `Suspense` shows a fallback while the chunk loads.',
        'This means visiting `/` does not download the Dashboard or Settings code — only the active route\'s chunk.',
        'This pattern is the single biggest lever for improving initial load time in large SPAs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does dynamic `import()` return?',
      answer: 'A promise that resolves to the module\'s namespace object, whose properties are the named exports plus `default`.',
      explanation: 'A good answer notes you typically `await` it or use `.then()`, and access `default` for default exports.',
    },
    {
      level: 'beginner',
      question: 'When would you use dynamic import instead of a static import?',
      answer: 'When you need to load code conditionally, with a computed path, or lazily after an event/route change — e.g. code splitting heavy or rarely used modules.',
      explanation: 'Interviewers want the connection to performance and the limits of static import.',
    },
    {
      level: 'intermediate',
      question: 'Why can dynamic import use a computed specifier but static import cannot?',
      answer: 'Static imports are resolved before execution (build-time/parse-time) so the specifier must be a literal. Dynamic `import()` runs at runtime, so its specifier can be any expression evaluated then.',
      explanation: 'This ties back to ESM being static and analyzable while dynamic import is deferred.',
    },
    {
      level: 'intermediate',
      question: 'How does dynamic import relate to code splitting?',
      answer: 'Bundlers treat each `import()` call site as a split point and emit a separate chunk that is fetched only when the call executes, shrinking the initial bundle.',
      explanation: 'Mention that the literal specifier matters — bundlers split on it, so passing a fully computed path can change splitting behavior.',
    },
    {
      level: 'advanced',
      question: 'What happens if a dynamically imported chunk fails to load?',
      answer: 'The returned promise rejects (e.g. ChunkLoadError on network failure or stale chunk after a deploy). Production code should catch it and show a fallback or retry/reload.',
      explanation: 'Senior signal: knowing dynamic import can fail at runtime, unlike static imports which fail at build/load time.',
    },
    {
      level: 'senior',
      question: 'How can you keep dynamic import\'s benefits while avoiding waterfalls and UI jank?',
      answer: 'Prefetch/preload likely-next chunks on idle or hover, parallelize independent imports with `Promise.all`, keep split boundaries coarse enough to avoid request storms, and show suspense/skeleton states during load. Cache resolves so repeat use is instant.',
      explanation: 'This tests holistic understanding: splitting too finely creates many requests; not prefetching causes visible delays.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does a bundler decide what goes into a dynamically imported chunk?',
    'What is the difference between `import()` and `require()` for loading ESM from CJS?',
    'How do you prefetch a lazy chunk before the user needs it?',
    'Why might passing a fully dynamic specifier hurt tree shaking or bundling?',
    'How do React.lazy / Vue async components build on dynamic import?',
    'What is a ChunkLoadError and how do you recover from it after a deploy?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting that `import()` returns a promise and using the module synchronously.',
      why: 'The module is not available until the promise resolves; reading exports immediately gives a pending promise, not the module.',
      fix: 'Always `await import(...)` or chain `.then()`, and access `default` for the default export.',
    },
    {
      mistake: 'Building a fully computed specifier with no static prefix (`import(userInput)`).',
      why: 'Bundlers cannot determine which files to include, breaking splitting (and creating a security risk).',
      fix: 'Use a partially static specifier (e.g. `import(\`./locales/${lang}.js\`)`) and validate the variable against an allowlist.',
    },
    {
      mistake: 'Not handling rejection from a dynamic import.',
      why: 'Chunk loads fail on flaky networks or after deploys invalidate old chunk URLs, throwing unhandled rejections.',
      fix: 'Wrap in try/catch (or `.catch`), show a fallback, and retry or prompt a reload on ChunkLoadError.',
    },
    {
      mistake: 'Over-splitting — wrapping tiny modules in dynamic imports.',
      why: 'Each import becomes a network request; too many creates waterfalls that are slower than one bundle.',
      fix: 'Split at meaningful boundaries (routes, heavy libs) and prefetch likely-next chunks.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Router lazy routes (`component: () => import(...)`) and async components split each view into its own chunk; Vite handles the chunk emission and preloading automatically.' },
    { area: 'React', detail: '`React.lazy(() => import(...))` with `<Suspense>` splits components; libraries like loadable-components add prefetch/SSR support on top of dynamic import.' },
    { area: 'Node.js', detail: 'CJS files use `await import(...)` to load ESM-only packages, and servers lazy-load optional/heavy modules (parsers, image libs) only when a request needs them.' },
    { area: 'Backend', detail: 'Plugin systems and feature flags load handler modules dynamically by name from a validated registry, keeping the base process lightweight.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Shrinks the initial bundle so the app becomes interactive faster (better LCP/TTI).',
      'Defers heavy dependencies (charts, editors, PDF libs) until actually used, saving bandwidth for most users.',
    ],
    bad: [
      'Each split point is a separate network request; over-splitting causes waterfalls and slower perceived performance.',
      'A lazy chunk fetched at the moment of interaction adds latency/jank if not prefetched.',
    ],
    optimizations: [
      'Prefetch likely-next chunks on idle or on hover (link rel=prefetch / bundler magic comments).',
      'Split at coarse boundaries (routes, large libraries) rather than every small module.',
      'Parallelize independent dynamic imports with `Promise.all` to avoid serial waterfalls.',
      'Show skeleton/suspense fallbacks and cache resolved modules so repeat use is instant.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A specifier built from unsanitized user input can load unintended local files or remote code.',
      'Loading chunks from a CDN over an unverified channel risks tampering (supply chain).',
    ],
    bestPractices: [
      'Never pass raw user input as the import specifier; validate against an allowlist and keep a static path prefix.',
      'Serve chunks over HTTPS with Subresource Integrity and a strict CSP that limits script origins.',
      'Pin and audit any dynamically loaded packages just like static dependencies.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'promises', 'async-await'],
    nextConcepts: ['code-splitting-lazy-loading', 'tree-shaking', 'bundlers-module-resolution', 'top-level-await', 'esm-vs-cjs'],
    dependencyNote:
      'Dynamic import builds on es-modules plus promises/async-await (since it is promise-based). It is the mechanism behind code-splitting-lazy-loading and works alongside bundlers-module-resolution; understanding it also clarifies how CJS bridges to ESM (esm-vs-cjs).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a small initial bundle box: app + router.',
      'Draw a user clicking "Charts"; from there draw `import(\'./chart.js\')`.',
      'Label the arrow "returns a Promise" and show it resolving to a chunk box `chart.chunk.js`.',
      'Note the resolved value is `{ default, ...namedExports }`.',
      'Say: "static import is build-time and always loaded; dynamic import is runtime, lazy, conditional".',
      'Add a note: "bundler splits each import() call site into a chunk; prefetch to avoid jank".',
    ],
    diagram: `  [ app + router ]   (initial, small)
        │ click
        ▼
   import('./chart.js')  ──► Promise
        │ fetch + eval (async, cached)
        ▼
   [ chart.chunk.js ] ──► { default, renderChart }
   static = build-time, eager | dynamic = runtime, lazy`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Dynamic `import()` loads a module at runtime and returns a promise resolving to its namespace object (named exports + `default`). Unlike static import it can be conditional, use a computed specifier, and live anywhere — so it powers code splitting and lazy loading. Bundlers turn each call site into a separate chunk fetched on demand and cached. It can reject (chunk-load failure), so handle errors and prefetch likely chunks to avoid jank. It also lets CJS load ESM-only packages.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Dynamic `import()` is a runtime, asynchronous way to load an ES module. Syntactically it looks like a function call but it is a special expression: you give it a specifier and it returns a promise that resolves to the module\'s namespace object, where the named exports are properties and the default export is `default`. The key difference from a static `import` statement is that static imports are resolved before execution — they must be at the top level with a literal path and they always load. Dynamic import runs whenever execution reaches it, so the specifier can be computed at runtime and the call can sit inside an `if` block or an event handler. That makes it the foundation of code splitting and lazy loading: bundlers treat each `import()` call site as a split point and emit a separate chunk that is only fetched when that line runs, then cached so later calls resolve instantly. In practice this is how Vue Router lazy routes and React.lazy work, deferring heavy or rarely used code to shrink the initial bundle and improve load time. Because it loads over the network at runtime, it can reject — a ChunkLoadError after a deploy, for instance — so production code should catch failures, show fallbacks, and sometimes retry. To keep it smooth you prefetch likely-next chunks and avoid over-splitting into too many requests. It is also the only way a CommonJS file can load an ESM-only package, since `require()` cannot.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Smaller initial bundle vs more runtime requests — fine-grained splitting can hurt more than help via waterfalls.',
      'Lazy loading improves first paint but adds interaction latency unless you prefetch, trading bandwidth for responsiveness.',
    ],
    edgeCases: [
      'Fully computed specifiers defeat static analysis, so bundlers may include everything or nothing — keep a static path prefix.',
      'Stale chunk URLs after a deploy cause ChunkLoadError for users on the old shell; handle with retry-then-reload.',
      'Dynamic import is cached, so changing a module after first load in a long-lived session has no effect without invalidation.',
      'Importing the same module statically and dynamically still yields one instance, but the chunking can duplicate code if boundaries overlap.',
    ],
    runtimeBehavior: [
      'Returns immediately with a pending promise; the actual fetch/link/evaluate happens asynchronously off the call stack.',
      'Resolves with a live Module Namespace Object — bindings track the exporter\'s current values.',
      'Repeated calls hit the module registry cache and skip re-evaluation.',
    ],
    scalability: [
      'Route-level splitting scales well; component-level splitting needs prefetch strategy to avoid request storms on big pages.',
      'On the server, dynamic import of optional modules keeps the base footprint small but adds first-hit latency — warm critical modules at startup.',
    ],
    productionConcerns: [
      'Ship a global handler for ChunkLoadError to reload the app shell after deploys invalidate chunk hashes.',
      'Coordinate split boundaries with caching (content-hashed chunk names) so unchanged chunks stay cached across deploys.',
      'Monitor chunk-load failure rates as a real reliability metric, especially on poor networks.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Dynamic `import()` = runtime, async module loading; returns a Promise.',
    'Resolves to the module namespace: named exports + `default`.',
    'Can be conditional, computed-specifier, and placed anywhere.',
    'Static import = build-time, literal path, top-level, eager.',
    'Each call site = a bundler split point → lazy chunk.',
    'Modules are cached; repeat imports resolve instantly.',
    'Can REJECT (ChunkLoadError) — always handle errors.',
    'Keep a static path prefix so bundlers can split correctly.',
    'Prefetch likely-next chunks to avoid interaction jank.',
    'Powers Vue lazy routes, React.lazy + Suspense.',
    'Bridges CJS → ESM (since require() cannot load ESM).',
    'Don\'t over-split: too many requests cause waterfalls.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Dynamically import `./greeting.js` (which has `export default "hello"`) and log its default export.',
      hint: 'Await import() and read .default.',
      solution: {
        lang: 'js',
        code: `async function run() {\n  const mod = await import('./greeting.js')\n  console.log(mod.default) // "hello"\n}\nrun()`,
        explanation: [
          '`import()` returns a promise; awaiting it yields the namespace object.',
          'The default export is accessed as `mod.default`.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write `loadLocale(lang)` that dynamically imports `./locales/<lang>.js` and returns its default export, with a fallback to `en` on failure.',
      hint: 'Use a template-literal specifier and try/catch.',
      solution: {
        lang: 'js',
        code: `async function loadLocale(lang) {\n  try {\n    const m = await import(\`./locales/\${lang}.js\`)\n    return m.default\n  } catch {\n    const en = await import('./locales/en.js')\n    return en.default\n  }\n}`,
        explanation: [
          'The template-literal specifier keeps a static `./locales/` prefix so bundlers can split per locale file.',
          'A rejected import (missing locale) falls back to English.',
          'Validating `lang` against an allowlist first would harden it further.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement `importOnce(loader)` so repeated calls return the same in-flight/resolved promise (deduped) instead of loading twice.',
      hint: 'Cache the promise from the first call.',
      solution: {
        lang: 'js',
        code: `function importOnce(loader) {\n  let promise = null\n  return () => {\n    if (!promise) promise = loader()\n    return promise\n  }\n}\nconst getEditor = importOnce(() => import('./editor.js'))\ngetEditor(); getEditor() // second call reuses the same promise`,
        explanation: [
          'The first call stores the promise; later calls return the cached one.',
          'This dedupes concurrent loads (no double fetch) and short-circuits after resolution.',
          'Native module caching already dedupes by specifier, but this guards a custom loader thunk.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a Vue Router config with a lazy route and add a global handler that reloads the app on a chunk-load failure after a deploy.',
      hint: 'Use () => import(...) and listen for the router error / window error.',
      solution: {
        lang: 'js',
        code: `const routes = [\n  { path: '/reports', component: () => import('./views/Reports.vue') }\n]\nconst router = createRouter({ history: createWebHistory(), routes })\n\nrouter.onError((err) => {\n  // stale chunk after a new deploy → reload to fetch fresh shell\n  if (/Loading chunk|dynamically imported module/i.test(err.message)) {\n    window.location.reload()\n  }\n})`,
        explanation: [
          'The lazy route function returns a dynamic import, so Reports.vue is its own chunk.',
          'After a deploy, old chunk URLs 404 and the import rejects with a chunk-load error.',
          'The router error handler detects that message and reloads to pull the new app shell.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Dynamic import is the practical mechanism behind fast-loading modern apps. Demonstrating that you understand the static-vs-dynamic split, the promise return, and the chunking/prefetch tradeoffs shows you can actually optimize real bundles, not just write features.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what `import()` returns and when to use it. Product companies (Zoho, Flipkart, Razorpay) probe code splitting, prefetching, and handling chunk-load failures. FAANG-level interviews dig into waterfall avoidance, caching/instance identity, and deploy-time chunk invalidation.',
    whatInterviewersExpect:
      'State that it returns a promise to the namespace object, contrast it with static import (runtime/lazy/conditional vs build-time/eager), connect it to code splitting and lazy routes, and discuss error handling and prefetch tradeoffs.',
  },
}

export default dynamicImports
