import type { ConceptLesson } from '../../../types/lesson'

const asyncComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'async-components',
  name: 'Async Components',
  category: 'components',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Async components are how you code-split a Vue app: heavy components ship in their own chunk and only download when actually needed, shrinking the initial bundle and speeding first paint.',
    'They give you built-in loading and error UI plus timeouts and retries, so lazy-loaded views handle slow networks and failures gracefully instead of showing a blank screen.',
    'Combined with the router and <Suspense>, they are the foundation of fast, scalable Vue apps — interviewers use them to test whether you understand performance at the architecture level.',
    'Misusing them (loading async inside a hot loop, or no error fallback) causes layout shift, waterfalls, and white screens in production.',
    'They pair naturally with dynamic components and modals/dialogs that most users never open — you defer the cost until the moment of need.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An async component is like ordering a pizza only when a guest arrives, instead of cooking every possible meal in advance.',
    story: [
      'Imagine you are hosting a party but you do not know who will come or what they want to eat.',
      'You could cook every dish in the world ahead of time — but that wastes hours and most food goes cold and untouched.',
      'Instead, you wait. When a guest finally arrives and asks for pizza, only then do you make pizza. While it cooks, you show them a little "cooking..." sign so they know it is coming.',
      'A Vue app does the same. Some parts of the page are rarely used. Instead of downloading them up front, Vue waits until they are actually needed, fetches them just then, and shows a small loading sign while it waits.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal component is bundled into your app and downloaded the moment the page loads, even if the user never sees it.',
    'An async component is defined with a function that returns a promise — usually a dynamic import() — so its code lives in a separate file (chunk) on the server.',
    'Vue only downloads that chunk the first time the component is about to render, then shows it. While it downloads, Vue can show a loading component; if it fails, an error component.',
    'It is the difference between packing your entire wardrobe for a one-day trip versus packing clothes only when you actually need them.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An async component is a component defined by defineAsyncComponent() given a loader function (typically () => import(...)) that resolves to a component definition, so the component\'s code is fetched on demand rather than in the initial bundle.',
    how: 'When Vue first needs to render the async component, it calls the loader, awaits the returned promise, and renders the resolved component. You can supply loadingComponent, errorComponent, delay, and timeout to control the in-between UI.',
    why: 'It enables code-splitting and lazy loading: the initial JavaScript bundle stays small, so the app loads and becomes interactive faster, and rarely used features cost nothing until used.',
    code: {
      label: 'A lazily loaded heavy component',
      lang: 'js',
      code: 'import { defineAsyncComponent } from \'vue\'\n\n// HeavyChart ships in its own chunk, fetched only when rendered\nconst HeavyChart = defineAsyncComponent(() =>\n  import(\'./HeavyChart.vue\')\n)\n\n// With loading + error UI and a timeout\nconst Dashboard = defineAsyncComponent({\n  loader: () => import(\'./Dashboard.vue\'),\n  loadingComponent: LoadingSpinner,\n  errorComponent: LoadError,\n  delay: 200,    // wait 200ms before showing the spinner\n  timeout: 8000, // fail after 8s\n})',
      explanation: [
        'defineAsyncComponent wraps a loader that returns a promise (here a dynamic import()).',
        'The bundler (Vite/webpack) splits the imported file into its own chunk automatically.',
        'The object form adds loading/error UI, a delay to avoid spinner flicker, and a timeout.',
        'delay: 200 means quick loads never flash a spinner; only slow ones show it.',
        'You use HeavyChart and Dashboard like any normal component in a template.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An async component is a wrapper created by defineAsyncComponent that defers loading its inner component definition until first render. It accepts either a loader function returning a Promise<Component> or an options object (loader, loadingComponent, errorComponent, delay, timeout, suspensible, onError). On first render Vue invokes the loader, renders a placeholder/loading state, and once the promise resolves swaps in the real component and re-renders; on rejection it shows the error component or surfaces the error to a parent <Suspense>. Bundlers transform the dynamic import() into a separately fetched chunk, achieving code-splitting.',

  // 7. Internal Working
  internalWorking: [
    'defineAsyncComponent returns a wrapper component whose setup tracks a loaded ref and an error ref, and stores the resolved inner component once available.',
    'On the wrapper\'s first render, if the inner component is not yet loaded, Vue calls the loader function exactly once (subsequent renders reuse the cached promise/result).',
    'While the promise is pending, the wrapper renders nothing (or the loadingComponent after the configured delay); a timeout, if set, races the loader and triggers the error path if exceeded.',
    'When the promise resolves, the resolved component is cached, the loaded ref flips true, and the wrapper re-renders to mount the real component with the original props/slots forwarded.',
    'If the promise rejects (or times out), the errorComponent is rendered with the error as a prop, or — when suspensible and under <Suspense> — the rejection bubbles to the nearest Suspense boundary.',
    'The dynamic import() is statically detected by the bundler at build time, which emits a separate chunk and a runtime fetch; the browser downloads it on demand and caches it for future renders.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  First render of <AsyncComp/>
        │
        ▼
   loader() called  ──►  fetch chunk over network
        │                      │  (pending)
        │  delay elapsed?      ▼
        ├───► show loadingComponent
        │
        ├── resolve ──► cache inner comp ──► re-render real component
        │
        └── reject / timeout ──► errorComponent  (or bubble to <Suspense>)

  Subsequent renders: chunk cached ⇒ render instantly, loader NOT re-called.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'BUNDLE: the async component\'s code lives in a separate chunk file, NOT in the initial bundle — so the entry JS the browser parses on load is smaller.',
    'NETWORK CACHE: once fetched, the chunk is cached by the browser; future renders resolve the loader promise from memory, so no second download occurs.',
    'RUNTIME: the wrapper holds a small amount of state (loaded/error refs + the cached resolved component). The heavy component instance only exists in memory after it has actually rendered.',
    'A failed load leaves the wrapper in an error state; retrying (via onError\'s retry callback) re-invokes the loader and can succeed without reloading the whole app.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — lazy import in a route',
      lang: 'js',
      code: '// router/index.js\nimport { createRouter, createWebHistory } from \'vue-router\'\n\nconst routes = [\n  { path: \'/\', component: () => import(\'../views/Home.vue\') },\n  // The component is fetched only when this route is visited\n  { path: \'/reports\', component: () => import(\'../views/Reports.vue\') },\n]\n\nexport default createRouter({ history: createWebHistory(), routes })',
      explanation: [
        'Vue Router accepts a loader function directly — no defineAsyncComponent needed for routes.',
        'Each view becomes its own chunk, downloaded only when the route is navigated to.',
        'This is the single highest-impact code-splitting win in most apps.',
        'The Reports chunk never loads for users who never visit /reports.',
      ],
    },
    intermediate: {
      label: 'Intermediate — defineAsyncComponent with loading/error UI',
      lang: 'vue',
      code: '<script setup>\nimport { defineAsyncComponent } from \'vue\'\nimport Spinner from \'./Spinner.vue\'\nimport FailedToLoad from \'./FailedToLoad.vue\'\n\nconst Editor = defineAsyncComponent({\n  loader: () => import(\'./RichTextEditor.vue\'),\n  loadingComponent: Spinner,\n  errorComponent: FailedToLoad,\n  delay: 200,\n  timeout: 10000,\n})\n</script>\n\n<template>\n  <!-- A heavy WYSIWYG editor, loaded only when the user edits -->\n  <Editor v-if="editing" />\n</template>',
      explanation: [
        'The rich text editor is large, so it is split out and loaded only when editing starts.',
        'Spinner shows during the fetch, but only after 200ms so fast loads do not flash.',
        'FailedToLoad renders if the chunk fails or the 10s timeout is hit.',
        'v-if gates the very first render, which is when the loader fires.',
        'Props and slots passed to <Editor> are forwarded to the real component once loaded.',
      ],
    },
    advanced: {
      label: 'Advanced — retry on failure with onError',
      lang: 'js',
      code: 'import { defineAsyncComponent } from \'vue\'\n\nconst Resilient = defineAsyncComponent({\n  loader: () => import(\'./FlakyWidget.vue\'),\n  timeout: 7000,\n  onError(error, retry, fail, attempts) {\n    // Retry up to 3 times on chunk-load errors (e.g. transient network)\n    if (attempts <= 3 && /Loading chunk/.test(error.message)) {\n      retry()\n    } else {\n      fail()\n    }\n  },\n})',
      explanation: [
        'onError receives the error, a retry() callback, a fail() callback, and the attempt count.',
        'Transient chunk-load failures (common after a redeploy) are retried automatically up to 3 times.',
        'Non-retryable errors call fail(), which surfaces the errorComponent or bubbles to Suspense.',
        'This pattern is essential for production resilience when CDNs hiccup or deploys invalidate old chunks.',
        'Without it, a single network blip would permanently break that feature until reload.',
      ],
    },
    realProject: {
      label: 'Real project — modal dialog loaded on demand under Suspense',
      lang: 'vue',
      code: '<script setup>\nimport { ref, defineAsyncComponent } from \'vue\'\n\nconst SettingsDialog = defineAsyncComponent(() =>\n  import(\'./SettingsDialog.vue\')\n)\nconst open = ref(false)\n</script>\n\n<template>\n  <button @click="open = true">Settings</button>\n\n  <Suspense v-if="open">\n    <template #default>\n      <SettingsDialog @close="open = false" />\n    </template>\n    <template #fallback>\n      <div class="dialog-skeleton">Loading settings…</div>\n    </template>\n  </Suspense>\n</template>',
      explanation: [
        'Most users never open Settings, so its (potentially heavy) code stays out of the initial bundle.',
        'The loader fires only when open becomes true and the dialog first renders.',
        '<Suspense> shows a skeleton fallback while the chunk and any async setup resolve.',
        'When ready, Suspense swaps in the real dialog with no manual loading flags.',
        'This is the canonical "defer rarely used UI" pattern in real Vue apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is an async component and why use one?',
      answer: 'A component whose definition is loaded on demand via defineAsyncComponent with a loader (usually () => import(...)). It enables code-splitting so the component ships in a separate chunk and only downloads when first rendered, shrinking the initial bundle.',
      explanation: 'The core idea is deferring download cost. Mentioning the bundler emitting a separate chunk shows you understand the mechanism.',
    },
    {
      level: 'beginner',
      question: 'How do you lazy-load a route component in Vue Router?',
      answer: 'Give the route a component function returning a dynamic import: component: () => import("../views/Page.vue"). The router treats it as async and the bundler splits it into its own chunk.',
      explanation: 'Route-level splitting is the most common and highest-impact use; you do not even need defineAsyncComponent for it.',
    },
    {
      level: 'intermediate',
      question: 'What do delay and timeout do in defineAsyncComponent?',
      answer: 'delay is how long to wait before showing the loadingComponent (default 200ms) so fast loads do not flash a spinner. timeout is the max time before the load is treated as failed and the errorComponent shows.',
      explanation: 'Shows awareness of UX details — avoiding spinner flicker and handling slow networks gracefully.',
    },
    {
      level: 'intermediate',
      question: 'How do you handle load failures, and how can you retry?',
      answer: 'Provide an errorComponent for the UI, and an onError(error, retry, fail, attempts) callback. onError lets you call retry() for transient chunk-load errors (e.g. after a redeploy) or fail() to give up.',
      explanation: 'Retrying chunk-load errors is a real production concern after deployments invalidate old chunk hashes.',
    },
    {
      level: 'advanced',
      question: 'How do async components interact with <Suspense>?',
      answer: 'If an async component (or a component with an async setup) is suspensible, its pending state bubbles to the nearest <Suspense>, which renders its #fallback slot until all async dependencies in the subtree resolve, then swaps in #default. This centralizes loading UI instead of per-component spinners.',
      explanation: 'Senior signal: understanding that Suspense coordinates multiple async dependencies and that suspensible: false opts a component out.',
    },
    {
      level: 'senior',
      question: 'What problems can lazy loading introduce and how do you mitigate them?',
      answer: 'Request waterfalls (chunks depending on chunks), layout shift while loading, white screens on failure, and stale-chunk errors after deploys. Mitigations: prefetch likely-next chunks, reserve space with skeletons, always supply error UI + retry, and ensure the server serves the right chunk versions or prompts a reload.',
      explanation: 'Demonstrates architecture-level thinking: performance gains come with new failure and UX modes that must be handled.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does the bundler decide what goes into a separate chunk?',
    'What is the difference between route-level and component-level code splitting?',
    'When would you set suspensible: false on an async component?',
    'How do you prefetch an async chunk before the user needs it?',
    'Why might a spinner flash, and how does delay prevent it?',
    'How do you recover from "Loading chunk failed" errors after a deployment?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Wrapping the loader in defineAsyncComponent inside setup/render so it is recreated every time.',
      why: 'Recreating the async wrapper on every render loses caching and can re-trigger loads.',
      fix: 'Define the async component once at module scope (top level), not inside a render or setup that re-runs.',
    },
    {
      mistake: 'No errorComponent or onError, so a failed chunk load shows a permanent blank.',
      why: 'Networks and CDNs fail; without an error path the feature silently breaks.',
      fix: 'Always provide an errorComponent and an onError that retries transient chunk-load failures.',
    },
    {
      mistake: 'Lazy-loading tiny components, adding chunk overhead with no benefit.',
      why: 'Each chunk has request and overhead cost; splitting trivial components can be slower overall.',
      fix: 'Reserve async loading for heavy, rarely used, or route-level components; keep small shared ones in the main bundle.',
    },
    {
      mistake: 'No reserved space, so content jumps when the async component appears.',
      why: 'The placeholder has zero or different height, causing cumulative layout shift.',
      fix: 'Use a loadingComponent/skeleton with the same dimensions to keep layout stable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'defineAsyncComponent lazy-loads heavy widgets (rich editors, charts, maps) and rarely opened dialogs, keeping the initial bundle small.' },
    { area: 'Vue Router', detail: 'Route components use () => import(...) for per-route code splitting — the most common and impactful lazy-loading pattern.' },
    { area: 'Nuxt', detail: 'Nuxt auto-imports and lazy variants (the Lazy prefix on components, plus its own chunking) build on the same async-component mechanism, with prefetch/preload hints.' },
    { area: 'SSR', detail: 'Under SSR/Suspense, async components are awaited on the server so the markup is complete before hydration, and Suspense coordinates fallbacks to avoid hydration mismatches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Shrinks the initial bundle so the app parses and becomes interactive faster (better TTI/LCP).',
      'Rarely used features cost zero download until actually used.',
    ],
    bad: [
      'Naive splitting creates request waterfalls and many tiny chunks, hurting performance.',
      'Loading on first interaction adds latency at the worst moment unless prefetched.',
    ],
    optimizations: [
      'Prefetch likely-next chunks during idle time (link rel=prefetch or router prefetch hints) so they are warm when needed.',
      'Use delay to avoid spinner flicker and skeletons sized to the content to avoid layout shift.',
      'Split at route boundaries first (biggest win), then large feature components — avoid splitting trivially small ones.',
      'Add onError retry for transient chunk-load failures and ensure correct chunk versioning across deploys.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'dynamic-components', 'lazy-loading-components'],
    nextConcepts: ['suspense', 'route-meta-lazy-loading', 'bundle-optimization', 'vue-performance-overview'],
    dependencyNote:
      'Async components build on component basics and are the concrete mechanism behind lazy-loading-components and route-level splitting. They lead directly into <Suspense> (coordinating async UI) and bundle-optimization (the architecture-level performance picture).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the initial bundle as a small box and a separate chunk file sitting on a server.',
      'Show the app rendering; when <AsyncComp> first appears, draw an arrow from it to the loader().',
      'Draw the loader fetching the chunk over the network; meanwhile draw a small spinner (after delay).',
      'On success, draw the resolved component replacing the spinner; note the chunk is now cached.',
      'On failure/timeout, draw the errorComponent (or an arrow up to a <Suspense> boundary), and mention retry().',
    ],
    diagram: `   initial bundle [small]        server: chunk.js (heavy)
          │ render                         ▲
          ▼                                │ fetch on first render
    <AsyncComp/> ── loader() ──────────────┘
          │ pending: spinner (after delay)
          ├── resolve ─► real component (chunk cached)
          └── reject/timeout ─► errorComponent / bubble to <Suspense>`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Async components use defineAsyncComponent with a loader — usually () => import(...) — so the component ships in its own chunk and downloads only on first render. That code-splits the app: smaller initial bundle, faster load, and rarely used features cost nothing up front. The options form adds loadingComponent, errorComponent, delay (avoid spinner flash), timeout, and onError (retry transient failures). They pair with Vue Router (() => import for routes) and with <Suspense>, which coordinates fallback UI for multiple async dependencies. Define them at module scope and always handle the error path.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'An async component is a component whose code is loaded on demand instead of being part of the initial bundle. You create one with defineAsyncComponent, passing a loader function that returns a promise — almost always a dynamic import like () => import("./Heavy.vue"). The bundler sees that import and splits Heavy into its own chunk, so the browser only downloads it the first time the component actually renders. That is code-splitting, and it is the main lever for keeping initial load fast: rarely used features like a settings dialog or a rich editor cost nothing until someone opens them. The object form of defineAsyncComponent gives you loading and error UI: loadingComponent shown while fetching, with a delay so quick loads do not flash a spinner; errorComponent and a timeout for failures; and an onError callback that receives a retry function, which is crucial in production because after a deploy old chunk hashes can fail to load and you want to retry transient errors. For routes you do not even need defineAsyncComponent — Vue Router accepts () => import directly, and route-level splitting is usually the biggest win. Async components also integrate with <Suspense>: if a component is suspensible, its pending state bubbles to the nearest Suspense boundary, which renders a single fallback until everything resolves, instead of scattering spinners everywhere. The pitfalls are request waterfalls, layout shift, and white screens, so you prefetch likely chunks, size skeletons to the content, and always provide an error path. And define the async wrapper at module scope so it is not recreated on every render.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Smaller initial bundle vs added latency and request count when the chunk loads on interaction — prefetching shifts that cost to idle time.',
      'Per-component loading UI gives fine control but scatters spinners; <Suspense> centralizes it but couples sibling async dependencies into one fallback.',
    ],
    edgeCases: [
      'Recreating the async wrapper inside a render loses caching and can re-fire the loader; it must live at module scope.',
      'Stale-chunk errors after a redeploy: old clients request hashed chunks that no longer exist — handle via onError retry and a reload prompt.',
      'suspensible: true (default under Suspense) means errors bubble to Suspense rather than the local errorComponent; set suspensible: false to keep local error handling.',
      'SSR must await async components before serializing; an unawaited async dependency causes hydration mismatches.',
    ],
    runtimeBehavior: [
      'The loader is invoked once and its result cached; later renders are synchronous from cache.',
      'delay races a timer before showing loading UI; timeout races the loader before failing.',
      'Under Suspense, multiple async children are awaited together and the fallback shows until all resolve, which can delay first content if one is slow.',
    ],
    scalability: [
      'Route-level splitting scales naturally as the app grows; layer component-level splitting for heavy features only.',
      'Prefetch on hover/idle and group related code into the same chunk to avoid an explosion of tiny requests and waterfalls.',
    ],
    productionConcerns: [
      'Chunk versioning across deploys is the top operational issue — implement retry and a "new version available, reload" flow.',
      'Monitor for layout shift from unsized placeholders; reserve space with skeletons.',
      'Ensure error and timeout paths are tested; a missing errorComponent turns a network blip into a permanent blank feature.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'defineAsyncComponent(() => import("./X.vue")) — lazy load X in its own chunk.',
    'Object form: { loader, loadingComponent, errorComponent, delay, timeout, onError, suspensible }.',
    'delay (default 200ms) prevents spinner flash on fast loads.',
    'timeout fails the load and shows errorComponent.',
    'onError(err, retry, fail, attempts) — retry transient chunk-load errors.',
    'Vue Router: component: () => import(...) for route-level splitting (biggest win).',
    'Define async wrappers at MODULE scope, never inside render/setup.',
    'Under <Suspense>, pending state bubbles to the fallback; suspensible: false opts out.',
    'Prefetch likely-next chunks during idle time.',
    'Size skeletons to content to avoid layout shift.',
    'SSR awaits async components before serializing markup.',
    'Do not split trivially small components — chunk overhead outweighs benefit.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Lazy-load a Reports view in a Vue Router route.',
      hint: 'The component field can be a function returning import().',
      solution: {
        lang: 'js',
        code: 'const routes = [\n  { path: \'/reports\', component: () => import(\'../views/Reports.vue\') },\n]',
        explanation: [
          'The dynamic import makes Reports its own chunk.',
          'It downloads only when /reports is navigated to.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Define an async component with a spinner shown after 300ms and a 5s timeout.',
      hint: 'Use the object form with delay and timeout.',
      solution: {
        lang: 'js',
        code: 'import { defineAsyncComponent } from \'vue\'\nimport Spinner from \'./Spinner.vue\'\nimport ErrorView from \'./ErrorView.vue\'\n\nconst Chart = defineAsyncComponent({\n  loader: () => import(\'./Chart.vue\'),\n  loadingComponent: Spinner,\n  errorComponent: ErrorView,\n  delay: 300,\n  timeout: 5000,\n})',
        explanation: [
          'delay: 300 avoids flashing the spinner on fast loads.',
          'timeout: 5000 shows ErrorView if the chunk takes too long.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add automatic retry (up to 2 attempts) for transient chunk-load failures.',
      hint: 'Use onError(error, retry, fail, attempts).',
      solution: {
        lang: 'js',
        code: 'const Widget = defineAsyncComponent({\n  loader: () => import(\'./Widget.vue\'),\n  onError(error, retry, fail, attempts) {\n    if (attempts <= 2 && /chunk/i.test(error.message)) retry()\n    else fail()\n  },\n})',
        explanation: [
          'onError inspects the error and attempt count.',
          'Chunk-load errors retry; everything else fails to the error path.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Defer a heavy modal until the user opens it, with a skeleton fallback, using Suspense.',
      hint: 'Gate rendering with v-if and wrap in <Suspense> with a #fallback.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, defineAsyncComponent } from \'vue\'\nconst Modal = defineAsyncComponent(() => import(\'./BigModal.vue\'))\nconst open = ref(false)\n</script>\n\n<template>\n  <button @click="open = true">Open</button>\n  <Suspense v-if="open">\n    <template #default><Modal @close="open = false" /></template>\n    <template #fallback><div class="skeleton">Loading…</div></template>\n  </Suspense>\n</template>',
        explanation: [
          'The loader fires only when open flips true and Modal first renders.',
          'Suspense shows the skeleton until the chunk and any async setup resolve.',
          'Most users never trigger the download, keeping the bundle small.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Async components are how you make a Vue app fast at scale. Understanding code-splitting, loading/error states, and Suspense shows you think about performance and resilience at the architecture level, not just feature code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do you lazy-load a route" and "what is defineAsyncComponent." Product companies (Zoho, Flipkart, Razorpay) ask you to add loading/error UI and handle slow networks. FAANG-level interviews probe waterfalls, prefetching, stale-chunk recovery after deploys, and how Suspense coordinates multiple async dependencies during SSR and hydration.',
    whatInterviewersExpect:
      'Define an async component and explain the chunk-splitting mechanism, use the object form with delay/timeout/error UI, handle failures with onError retry, do route-level splitting in the router, and connect it all to Suspense and real performance/resilience trade-offs.',
  },
}

export default asyncComponents
