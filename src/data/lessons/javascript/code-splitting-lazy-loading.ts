import type { ConceptLesson } from '../../../types/lesson'

const codeSplittingLazyLoading: ConceptLesson = {
  // 1. Concept Summary
  slug: 'code-splitting-lazy-loading',
  name: 'Code Splitting & Lazy Loading',
  category: 'performance',
  difficulty: 'senior',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Shipping one giant JS bundle forces users to download, parse, and execute code for pages they may never visit — code splitting sends only what is needed now, slashing time-to-interactive.',
    'Lazy loading is the single biggest lever on initial load for large SPAs; it directly improves Core Web Vitals (LCP, TBT) and bounce rates.',
    'Without it, a small change anywhere busts the cache for everything, every route loads every feature, and mobile users on slow networks suffer multi-second blank screens.',
    'Interviewers ask it to see whether you understand the module graph, dynamic import(), bundler chunking, and the tradeoffs of granularity — senior frontend territory.',
    'It is everywhere in real apps: route-based splitting, lazy modals/charts, and on-demand vendor libs are how production SPAs stay fast as they grow.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Code splitting is like ordering food course by course instead of carrying the whole buffet to your table at once.',
    story: [
      'Imagine you are hungry and a waiter offers to bring you the ENTIRE restaurant menu cooked and stacked on your table before you eat anything.',
      'You would wait forever, and most of the food would go cold and untouched because you only wanted soup right now.',
      'Instead, the waiter brings just the soup first. When you want dessert later, he goes and gets only the dessert at that moment.',
      'Code splitting works the same way: the website brings you only the code for the page you are looking at right now, and quietly fetches more code only when you actually click to go somewhere new.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A website is made of lots of JavaScript files that a tool bundles together so the browser can download them.',
    'If you glue ALL of it into one big file, the browser must download and run the whole thing before the page works — even parts you never use.',
    'Code splitting breaks that big file into smaller pieces (chunks), so the browser only grabs the piece it needs right now.',
    'Lazy loading means a chunk is fetched on demand — for example, only when you click a button or visit a new page — instead of up front.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Code splitting is breaking your bundle into multiple smaller chunks; lazy loading is deferring the download/execution of a chunk until it is actually needed, usually via the dynamic import() expression.',
    how: 'You replace a static `import X from "x"` with a dynamic `import("x")` that returns a Promise. The bundler (Vite/webpack/Rollup) sees that call and emits a separate chunk; at runtime the browser fetches that chunk only when the import() runs (e.g. on a route change or button click).',
    why: 'It shrinks the initial download so the first paint and time-to-interactive are faster, and it isolates rarely-used or heavy features (charts, editors, admin panels) so most users never pay for them.',
    code: {
      label: 'Static vs dynamic import',
      lang: 'js',
      code: `// Eager: bundled into the main chunk, loaded on first page load\nimport { heavyChart } from './chart'\nheavyChart()\n\n// Lazy: separate chunk, fetched only when the user clicks\nbutton.addEventListener('click', async () => {\n  const { heavyChart } = await import('./chart') // own chunk\n  heavyChart()\n})`,
      explanation: [
        'The static import always ships in the main bundle, even if heavyChart is never called.',
        'import() is an expression that returns a Promise resolving to the module namespace.',
        'The bundler splits ./chart into its own chunk because of the dynamic import.',
        'The network request for that chunk happens at click time, not on initial load.',
        'await unwraps the module so you can destructure its exports.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Code splitting is the process by which a bundler partitions the module dependency graph into multiple output chunks rather than a single bundle, typically at dynamic import() boundaries and shared-vendor seams. Lazy loading defers a chunk\'s network fetch and evaluation until runtime when the dynamic import() expression executes, returning a Promise of the module namespace object. The technique reduces initial parse/compile/execute cost and improves cacheability by isolating volatile application code from stable vendor code, at the cost of additional network round-trips and the need to handle loading/error/suspense states.',

  // 7. Internal Working
  internalWorking: [
    'At build time the bundler walks the static import graph from each entry point and treats every dynamic import() call as a split point, emitting the imported module and its private dependencies as a separate chunk file.',
    'Shared dependencies are deduplicated into common/vendor chunks so they are not duplicated across feature chunks (webpack splitChunks / Rollup manualChunks).',
    'The bundler injects a small runtime that maps chunk ids to URLs and knows how to fetch and register chunks on demand.',
    'At runtime, calling import() returns a Promise; the runtime inserts a <script> (or uses fetch + module evaluation) to download the chunk, then resolves the Promise with the module namespace once evaluated.',
    'The browser caches each chunk by its content-hashed filename, so unchanged chunks stay cached across deploys while only changed chunks are refetched.',
    'Optionally, preloading hints (<link rel="modulepreload">/prefetch) or framework prefetch-on-hover warm chunks before they are needed to hide the network latency.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  WITHOUT SPLITTING                 WITH SPLITTING (lazy routes)
  ┌──────────────────────┐          ┌────────────┐  loaded now
  │  main.js (2.5 MB)     │          │ main.js    │  (router + shell)
  │  - home               │          │  ~180 KB   │
  │  - dashboard (charts) │          └─────┬──────┘
  │  - admin              │                │ on navigate
  │  - settings           │                ▼
  │  ALL downloaded up    │          ┌────────────┐ ┌────────────┐
  │  front, even unused   │          │ home.js    │ │ admin.js   │ ...
  └──────────────────────┘          │ (fetched   │ │ (fetched   │
        ⬇ slow first paint           │  on visit) │ │  on visit) │
                                     └────────────┘ └────────────┘
                                       only what the user actually uses`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — lazy route in Vue Router',
      lang: 'js',
      code: `import { createRouter, createWebHistory } from 'vue-router'\n\nconst routes = [\n  { path: '/', component: () => import('./pages/Home.vue') },        // own chunk\n  { path: '/admin', component: () => import('./pages/Admin.vue') },  // own chunk\n]\n\nexport const router = createRouter({ history: createWebHistory(), routes })`,
      explanation: [
        'Returning () => import(...) instead of an imported component makes the route component lazy.',
        'Vue Router only calls the loader when the route is first visited.',
        'Each page becomes its own chunk, so /admin code never loads for users who stay on /.',
        'This route-based splitting is the highest-leverage, lowest-effort win.',
      ],
    },
    intermediate: {
      label: 'Intermediate — lazy component with loading & error states',
      lang: 'js',
      code: `import { defineAsyncComponent } from 'vue'\n\nconst HeavyChart = defineAsyncComponent({\n  loader: () => import('./HeavyChart.vue'),\n  loadingComponent: Spinner,\n  errorComponent: LoadFailed,\n  delay: 200,      // show spinner only if load takes > 200ms\n  timeout: 10000,  // give up after 10s\n})`,
      explanation: [
        'defineAsyncComponent wraps a dynamic import with UX states.',
        'loadingComponent shows while the chunk downloads; delay avoids flashing it for fast loads.',
        'errorComponent renders if the chunk fails (offline, deploy mismatch) — never leave the user with a blank box.',
        'In React the equivalent is React.lazy + <Suspense> + an error boundary.',
      ],
    },
    advanced: {
      label: 'Advanced — prefetch on intent + retry on failure',
      lang: 'js',
      code: `function lazyWithRetry(importer, retries = 2) {\n  return async () => {\n    for (let attempt = 0; ; attempt++) {\n      try {\n        return await importer()\n      } catch (err) {\n        if (attempt >= retries) throw err\n        await new Promise((r) => setTimeout(r, 300 * (attempt + 1)))\n      }\n    }\n  }\n}\n\n// Warm the chunk when the user hovers the link (hide latency)\nlink.addEventListener('mouseenter', () => { import('./pages/Admin.vue') }, { once: true })`,
      explanation: [
        'Chunk fetches can fail transiently (flaky network) or permanently (stale hash after a deploy) — retry the transient case.',
        'The retry wraps the importer and backs off between attempts.',
        'Prefetching on hover/mouseenter downloads the chunk before the click, so navigation feels instant.',
        'A stale-hash failure usually means reload the app; detect it and prompt a refresh.',
      ],
    },
    realProject: {
      label: 'Real project — Vite manualChunks vendor splitting + lazy modal',
      lang: 'js',
      code: `// vite.config.js — isolate stable vendor code for long-term caching\nexport default {\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: ['vue', 'vue-router', 'pinia'],\n          charts: ['echarts'],   // heavy, only on dashboard\n        },\n      },\n    },\n  },\n}\n\n// component: load the editor only when the modal opens\nconst openEditor = async () => {\n  const { mountEditor } = await import('./RichTextEditor')\n  mountEditor(el)\n}`,
      explanation: [
        'manualChunks groups stable libraries into a vendor chunk that rarely changes, so it stays cached across deploys.',
        'Heavy single-purpose libs (echarts) get their own chunk loaded only on the route that needs them.',
        'The rich text editor is fetched only when a user opens the modal — most users never download it.',
        'This combination (route split + vendor split + on-demand features) is the standard production setup in Vite/webpack apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between code splitting and lazy loading?',
      answer: 'Code splitting is the build-time act of breaking the bundle into multiple chunks. Lazy loading is the runtime behavior of fetching a chunk only when it is needed, typically via dynamic import(). Splitting creates the chunks; lazy loading defers loading them.',
      explanation: 'A clean answer separates the build-time concept from the runtime behavior — many candidates conflate them.',
    },
    {
      level: 'beginner',
      question: 'How does dynamic import() differ from a static import?',
      answer: 'A static import is resolved at parse time, is hoisted, and is always included in the bundle. A dynamic import() is an expression that runs at call time, returns a Promise of the module namespace, and signals the bundler to create a separate chunk.',
      explanation: 'Tests understanding that import() is asynchronous and is the actual split point the bundler keys on.',
    },
    {
      level: 'intermediate',
      question: 'What is route-based code splitting and why is it the most common strategy?',
      answer: 'Each route loads its page component as a separate chunk via a dynamic import, so visiting one page does not download the others. It is common because routes are natural, coarse boundaries that align with what users actually navigate to, giving big wins with minimal code change.',
      explanation: 'Route splitting is the 80/20 of code splitting; mentioning the natural-boundary reasoning shows judgment.',
    },
    {
      level: 'intermediate',
      question: 'Why separate vendor code into its own chunk?',
      answer: 'Vendor libraries change far less often than app code. Putting them in a separate, content-hashed chunk means a normal deploy only invalidates the app chunk, leaving the large vendor chunk cached in users\' browsers, so they re-download less.',
      explanation: 'Connects splitting to HTTP caching — a key reason granularity matters beyond just initial size.',
    },
    {
      level: 'advanced',
      question: 'What are the downsides of splitting too finely?',
      answer: 'Many tiny chunks mean many network round-trips (each with latency and request overhead), worse compression ratios, and a waterfall where chunk A must load before it requests chunk B. The win from smaller initial size can be erased by request overhead, especially on high-latency networks.',
      explanation: 'Senior signal: granularity is a tradeoff, and over-splitting (request waterfalls) can be worse than under-splitting.',
    },
    {
      level: 'senior',
      question: 'How do you hide the latency of lazy loading so navigation still feels instant?',
      answer: 'Prefetch chunks on intent — hover, viewport intersection, or idle time — using modulepreload/prefetch hints or framework prefetch. Combine with route-level loading states, error boundaries with retry, and Suspense so the UI degrades gracefully. The goal is to start the fetch before the user commits to the action.',
      explanation: 'Shows the full production picture: prefetching, hints, and graceful loading/error UX, not just splitting the bundle.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does tree-shaking relate to code splitting? (different optimizations, complementary)',
    'What happens to a lazy chunk that fails to load after a deploy changed its hash?',
    'How do modulepreload, preload, and prefetch hints differ?',
    'How does React.lazy + Suspense work, and what is the SSR caveat?',
    'How would you decide the right chunk granularity for an app?',
    'How does HTTP/2 multiplexing change the cost of many small chunks?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Lazy loading components that are needed on first paint.',
      why: 'It adds a network round-trip and a loading flash for content the user sees immediately, hurting LCP instead of helping.',
      fix: 'Eager-load above-the-fold/critical components; lazy-load only below-the-fold, route-secondary, or interaction-triggered code.',
    },
    {
      mistake: 'No loading or error state for lazy chunks.',
      why: 'On slow networks the UI looks frozen, and if the chunk 404s (stale deploy) the user gets a blank area with no feedback.',
      fix: 'Always provide a loading indicator (with a small delay) and an error/retry path; in React wrap in Suspense + an error boundary.',
    },
    {
      mistake: 'Over-splitting into dozens of tiny chunks.',
      why: 'Request overhead and load waterfalls can outweigh the smaller initial size, especially on high-latency mobile networks.',
      fix: 'Split at meaningful boundaries (routes, heavy features, vendor) and measure real-world load, not just bundle-size graphs.',
    },
    {
      mistake: 'Putting a dynamic import() inside a condition that the bundler cannot analyze, with a fully dynamic path.',
      why: 'A non-statically-analyzable import("./" + name) can produce a huge catch-all chunk or fail to split as intended.',
      fix: 'Keep import specifiers static enough for the bundler (use a known prefix or an explicit map of importers).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Route components via () => import(...) in Vue Router, defineAsyncComponent for heavy widgets, and Vite manualChunks for vendor splitting are the standard setup.' },
    { area: 'React', detail: 'React.lazy + <Suspense> for components, route-based splitting with the router, and Next.js automatic per-page splitting plus dynamic() with ssr:false for client-only heavy libs.' },
    { area: 'Node.js', detail: 'Dynamic import() defers loading heavy or optional dependencies until a code path needs them, reducing cold-start time in serverless functions.' },
    { area: 'Backend', detail: 'Build pipelines emit content-hashed chunks served with long cache headers behind a CDN; the server sends preload/modulepreload Link headers to warm critical chunks.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Smaller initial bundle → faster parse/compile/execute and better LCP and Time-to-Interactive.',
      'Vendor/feature isolation → better cache hit rates, so deploys re-download less code.',
    ],
    bad: [
      'Too many chunks create request waterfalls and overhead that can exceed the savings.',
      'Lazy loading critical content adds a round-trip and visible loading state, hurting perceived performance.',
    ],
    optimizations: [
      'Split at routes and heavy features; group stable vendors into a long-cached chunk.',
      'Prefetch on hover/idle/intersection and use modulepreload to hide chunk latency.',
      'Use a build analyzer (rollup-plugin-visualizer / webpack-bundle-analyzer) to target the biggest chunks.',
      'Pair with tree-shaking and compression (gzip/brotli) so each chunk is minimal.',
    ],
  },

  // 16. Related Concepts
  related: {
    prerequisites: ['es-modules', 'dynamic-imports', 'bundlers-module-resolution', 'promises'],
    nextConcepts: ['tree-shaking', 'core-web-vitals', 'script-loading', 'list-virtualization'],
    dependencyNote:
      'Code splitting builds directly on ES modules and dynamic import(), and relies on the bundler/module-resolution model. It complements tree-shaking (dead-code removal) and is one of the main tools for improving Core Web Vitals; understanding promises is needed because import() is async.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw one big box "main.js (everything)" and an arrow "slow first load".',
      'Beside it draw a small box "main.js (shell + router)" that loads now.',
      'Draw separate boxes home.js, admin.js, charts.js fanning out from it.',
      'Label each "fetched on demand via import()".',
      'Draw a dashed "prefetch on hover" arrow warming admin.js early.',
      'Say: "We split at routes/heavy features so users download only what they use, and prefetch to hide the latency."',
    ],
    diagram: `        ┌─ main.js (shell + router) ─┐  ← loaded now
        └───────────┬────────────────┘
              import() on demand
        ┌──────────┼───────────┬───────────┐
        ▼          ▼           ▼           ▼
     home.js    admin.js    charts.js   editor.js
   (on visit)  (on visit)  (dashboard) (on modal open)
        ▲ dashed = prefetch on hover/idle`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Code splitting breaks the bundle into chunks at build time; lazy loading defers fetching a chunk until runtime via dynamic import(), which returns a Promise and tells the bundler to emit a separate chunk. The standard wins are route-based splitting, isolating heavy features (charts/editors), and separating stable vendor code for better caching. The cost is extra round-trips, so do not over-split and do not lazy-load critical first-paint content. Hide latency by prefetching on hover/idle and always provide loading and error states.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Code splitting and lazy loading exist because shipping one giant bundle forces every user to download, parse, and execute code for features and pages they may never touch, which kills time-to-interactive. Code splitting is the build-time act of partitioning the module graph into multiple chunks; the bundler treats every dynamic import() as a split point and emits that module and its private dependencies as a separate file. Lazy loading is the runtime behavior: import() returns a Promise, and the chunk is only fetched when that expression actually runs — for example on a route change or a button click. The highest-leverage strategy is route-based splitting, because routes are natural boundaries that match what users navigate to, so visiting one page does not pull in the others. I also separate stable vendor libraries into their own content-hashed chunk so a normal deploy only invalidates the app chunk and users keep the cached vendor code. The main tradeoff is granularity: too many tiny chunks create request waterfalls and overhead that can outweigh the smaller initial size, and lazy-loading critical first-paint content just adds a round-trip and a loading flash. So I keep above-the-fold code eager, lazy-load heavy or secondary features, prefetch chunks on hover or idle to hide latency, and always provide loading and error states — in Vue with defineAsyncComponent, in React with lazy plus Suspense and an error boundary.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Initial size vs round-trips: finer splitting shrinks the first download but adds requests and can create dependency waterfalls — net effect depends on network latency and HTTP version.',
      'Cache granularity vs duplication: separate vendor chunks improve cache hits but shared code must be deduped carefully or it bloats multiple chunks.',
      'UX simplicity vs control: automatic per-route splitting is easy; manual chunking gives control but adds maintenance and risk of misgrouping.',
    ],
    edgeCases: [
      'Stale-hash 404s after a deploy: a user on an old tab requests a chunk that no longer exists — detect, retry, then prompt a reload.',
      'Dynamic import with a computed specifier the bundler cannot analyze → giant catch-all chunk or no split.',
      'SSR + React.lazy historically needed a streaming/loadable solution because lazy was client-only; frameworks now handle this but it is a known gotcha.',
      'Circular dependencies across chunk boundaries can cause undefined exports at evaluation time.',
    ],
    runtimeBehavior: [
      'import() inserts a script/modulepreload and resolves once the chunk is evaluated; concurrent imports of the same chunk dedupe to one fetch.',
      'modulepreload fetches AND compiles the module graph ahead of time; prefetch only fetches at low priority for future navigations.',
      'HTTP/2/3 multiplexing reduces per-request cost, making moderately fine splitting cheaper than it was under HTTP/1.1.',
    ],
    scalability: [
      'As an app grows, route + vendor + heavy-feature splitting keeps initial size flat while total app size grows — the key to large SPAs staying fast.',
      'Bundle budgets in CI (size-limit) prevent regressions where a stray static import drags a heavy lib into the main chunk.',
    ],
    productionConcerns: [
      'Serve chunks from a CDN with long immutable cache headers keyed on content hash.',
      'Monitor chunk load failure rates and add retry + reload-prompt for stale deploys.',
      'Use a bundle analyzer in CI and prefetch strategically; measure real Core Web Vitals, not just synthetic bundle graphs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Code splitting = build-time chunking; lazy loading = runtime on-demand fetch.',
    'Split point = dynamic import() — returns a Promise of the module namespace.',
    'Route-based splitting is the 80/20 win.',
    'Separate stable vendor chunk → better cache across deploys.',
    'Do NOT lazy-load critical first-paint content (hurts LCP).',
    'Over-splitting → request waterfalls; pick meaningful boundaries.',
    'Prefetch on hover/idle/intersection to hide latency.',
    'Always add loading + error/retry states (Suspense + error boundary in React).',
    'Stale-hash 404 after deploy → retry then prompt reload.',
    'Pair with tree-shaking + brotli for minimal chunks.',
    'Vue: () => import() routes, defineAsyncComponent; React: lazy + Suspense.',
    'Measure real CWV and use a bundle analyzer, not just size graphs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert this eager import into a click-triggered lazy load: import { renderReport } from "./report"; on button click, render the report.',
      hint: 'Use await import() inside the click handler.',
      solution: {
        lang: 'js',
        code: `button.addEventListener('click', async () => {\n  const { renderReport } = await import('./report')\n  renderReport()\n})`,
        explanation: [
          'Removing the static import keeps ./report out of the main bundle.',
          'import() fetches the report chunk only on click.',
          'await unwraps the module namespace so we can call renderReport.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a defineAsyncComponent config for a heavy <DataTable> with a spinner, an error component, a 200ms delay, and a 8s timeout.',
      hint: 'defineAsyncComponent accepts an options object.',
      solution: {
        lang: 'js',
        code: `import { defineAsyncComponent } from 'vue'\nconst DataTable = defineAsyncComponent({\n  loader: () => import('./DataTable.vue'),\n  loadingComponent: Spinner,\n  errorComponent: TableLoadError,\n  delay: 200,\n  timeout: 8000,\n})`,
        explanation: [
          'loader is the dynamic import that becomes its own chunk.',
          'delay prevents a spinner flash on fast loads; loadingComponent shows after it.',
          'errorComponent renders on failure/timeout so the user is never stuck on a blank box.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a prefetch-on-hover helper that warms a chunk once when the user hovers a link, and is safe to attach to many links.',
      hint: 'Cache the import Promise so repeated hovers do not refetch.',
      solution: {
        lang: 'js',
        code: `function prefetchOnHover(el, importer) {\n  let started = false\n  el.addEventListener('mouseenter', () => {\n    if (started) return\n    started = true\n    importer().catch(() => {})   // warm cache; ignore errors\n  }, { passive: true })\n}\nprefetchOnHover(adminLink, () => import('./pages/Admin.vue'))`,
        explanation: [
          'The started flag ensures the chunk is fetched at most once per element.',
          'Calling the importer warms the browser/module cache so the later navigation resolves instantly.',
          'Errors are swallowed because this is a best-effort optimization, not a user action.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write lazyWithRetry(importer, retries) that retries a failed dynamic import with backoff, and explain when retrying is and is not appropriate.',
      hint: 'Loop with try/catch and an exponential-ish delay; rethrow after the last attempt.',
      solution: {
        lang: 'js',
        code: `function lazyWithRetry(importer, retries = 2) {\n  return async () => {\n    let lastErr\n    for (let attempt = 0; attempt <= retries; attempt++) {\n      try {\n        return await importer()\n      } catch (err) {\n        lastErr = err\n        if (attempt < retries) {\n          await new Promise((r) => setTimeout(r, 300 * (attempt + 1)))\n        }\n      }\n    }\n    throw lastErr\n  }\n}`,
        explanation: [
          'Transient failures (flaky network) often succeed on retry, so a couple of backed-off attempts improve reliability.',
          'Permanent failures (the chunk hash no longer exists after a deploy) will keep failing — retrying wastes time; the right move there is to detect it and prompt a full reload.',
          'After exhausting retries we rethrow so the caller (error boundary / async component) can show a failure state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Code splitting is the most direct way to make a real SPA load fast, and discussing it well shows you understand modules, bundlers, caching, and the network — the core of senior frontend performance work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) usually ask the definition and dynamic import() syntax. Product companies (Zoho, Flipkart, Razorpay) ask about route vs vendor splitting, loading/error states, and bundle analysis. FAANG-level interviews probe granularity tradeoffs, prefetch strategies, stale-hash failures, and how splitting affects Core Web Vitals and caching.',
    whatInterviewersExpect:
      'They expect you to distinguish build-time splitting from runtime lazy loading, show dynamic import(), name route/vendor/feature strategies, discuss the round-trip tradeoff, and cover prefetching plus loading/error UX — ideally tying it back to LCP/TTI.',
  },
}

export default codeSplittingLazyLoading
