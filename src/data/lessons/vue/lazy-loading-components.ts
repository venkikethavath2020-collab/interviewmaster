import type { ConceptLesson } from '../../../types/lesson'

const lazyLoadingComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'lazy-loading-components',
  name: 'Lazy Loading Components',
  category: 'performance',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Lazy loading is usually the single highest-leverage performance win: it shrinks the initial JavaScript bundle so the app paints and becomes interactive faster.',
    'Most users never visit every route or open every modal — shipping all that code up front wastes their bandwidth and the browser\'s parse time.',
    'It is the everyday application of code splitting, and interviewers expect you to know defineAsyncComponent, dynamic import(), and route-level lazy loading cold.',
    'Done well it improves Core Web Vitals (LCP, TTI); done badly it causes loading flashes, request waterfalls, and layout shift — so the nuances matter.',
    'It pairs with Suspense, loading/error states, retries, and prefetching, which are real production concerns you will be asked about.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Lazy loading is like a restaurant menu where the kitchen only starts cooking a dish when someone actually orders it, instead of cooking the whole menu before anyone arrives.',
    story: [
      'Imagine a restaurant that, before opening, cooked every single dish on the menu just in case. Most of it goes cold and wasted, and opening takes forever.',
      'A smarter restaurant opens quickly with just the basics ready, and cooks each dish only when a customer orders it.',
      'The customer waits a tiny moment for their specific dish, but the restaurant opened way faster and wasted nothing.',
      'Lazy loading is the same: the app starts fast with only what is needed now, and fetches extra pieces (a settings page, a big chart) only when you actually go there.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a web app loads, the browser has to download all its JavaScript before it can run — the more code, the longer the wait.',
    'But you do not need every page\'s code at the start; you only need the page you are looking at right now.',
    'Lazy loading splits the app into pieces and downloads a piece only when it is actually needed, like when you click to a new page.',
    'This makes the app start much faster, at the small cost of a brief load when you first open a deferred part — which you can hide with a loading spinner.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Lazy loading a component means deferring the download and evaluation of its code until it is actually needed, instead of including it in the initial bundle. In Vue you use a dynamic import() — via the router for routes, or defineAsyncComponent for components.',
    how: 'Replace a static import with a function returning import(): the bundler emits a separate chunk that is fetched on demand. For non-route components, wrap that function in defineAsyncComponent, optionally with loading/error components and a delay/timeout.',
    why: 'It reduces the initial bundle so first paint and time-to-interactive improve. Code the user may never reach (admin pages, rarely opened modals, heavy charts) is no longer paid for up front.',
    code: {
      label: 'Route lazy load and defineAsyncComponent',
      lang: 'js',
      code: '// Route-level (most common)\nconst routes = [\n  { path: \'/admin\', component: () => import(\'@/views/Admin.vue\') },\n]\n\n// Component-level\nimport { defineAsyncComponent } from \'vue\'\nconst HeavyChart = defineAsyncComponent(() =>\n  import(\'@/components/HeavyChart.vue\'))\n// use <HeavyChart /> normally; its code loads when first rendered',
      explanation: [
        'A function returning import() tells the bundler to split that code into its own chunk.',
        'The router lazy-loads route components automatically when given that function.',
        'defineAsyncComponent wraps the loader so a component can be lazy outside routing.',
        'HeavyChart\'s code downloads only when it is first rendered.',
        'Everything else about using the component stays the same.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Lazy loading components is the application of code splitting at the component boundary: a dynamic import() returns a Promise for a separately bundled chunk, which is fetched and evaluated only when the component is needed. Vue Router accepts a loader function for route components; defineAsyncComponent wraps a loader into a component definition that resolves asynchronously, with optional loadingComponent, errorComponent, delay, timeout, suspensible, and onError (retry) options. Combined with <Suspense> it integrates async setup and fallbacks. The result is a smaller initial bundle and improved load-time metrics at the cost of an on-demand fetch.',

  // 7. Internal Working
  internalWorking: [
    'At build time, the bundler (Vite/Rollup/webpack) sees a dynamic import() and splits the imported module and its unique dependencies into a separate chunk file.',
    'At runtime, when the async component is about to render (route entered or component first used), Vue calls the loader, which triggers the browser to fetch the chunk over the network.',
    'defineAsyncComponent returns a wrapper component that renders the loadingComponent (after an optional delay) while the Promise is pending, the resolved component when it settles, or the errorComponent on failure/timeout.',
    'If the loader is used inside <Suspense>, the async resolution is coordinated with Suspense\'s fallback slot instead of per-component loading states.',
    'onError gives a retry callback so transient network failures can be re-attempted before falling back to the error component.',
    'Once a chunk is fetched it is cached by the browser/module system, so subsequent renders of the same component are synchronous.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  INITIAL LOAD (small)                ON DEMAND (when needed)\n  ┌──────────────────────┐            ┌───────────────────────────┐\n  │ app shell + home      │  navigate  │ fetch admin.[hash].js chunk│\n  │ (main bundle)         │ ─────────► │ → resolve → render Admin   │\n  └──────────────────────┘            └───────────────────────────┘\n             │\n             │ () => import(\'Admin.vue\')   ← splits a separate chunk\n             ▼\n  defineAsyncComponent({\n    loader, loadingComponent, errorComponent, delay, timeout, onError(retry)\n  })\n       pending → <Loading/>      resolved → <Comp/>      failed → <Error/>',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — lazy route components',
      lang: 'js',
      code: 'import { createRouter, createWebHistory } from \'vue-router\'\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: \'/\', component: () => import(\'@/views/Home.vue\') },\n    { path: \'/dashboard\', component: () => import(\'@/views/Dashboard.vue\') },\n    { path: \'/admin\', component: () => import(\'@/views/Admin.vue\') },\n  ],\n})',
      explanation: [
        'Each route component is a loader function, so each becomes its own chunk.',
        'The initial bundle ships only the shell and whatever the first route needs.',
        'Admin code never downloads for users who never visit /admin.',
        'This is the most common and highest-impact use of lazy loading.',
      ],
    },
    intermediate: {
      label: 'Intermediate — defineAsyncComponent with loading/error states',
      lang: 'js',
      code: 'import { defineAsyncComponent } from \'vue\'\nimport Spinner from \'@/components/Spinner.vue\'\nimport LoadError from \'@/components/LoadError.vue\'\n\nconst HeavyChart = defineAsyncComponent({\n  loader: () => import(\'@/components/HeavyChart.vue\'),\n  loadingComponent: Spinner,\n  errorComponent: LoadError,\n  delay: 200,        // wait 200ms before showing spinner (avoid flash)\n  timeout: 8000,     // show error if it takes too long\n})',
      explanation: [
        'The object form lets you specify UX for the pending and failed states.',
        'delay avoids a spinner flash for fast loads (only shows after 200ms).',
        'timeout surfaces an error if the chunk never arrives.',
        'loadingComponent/errorComponent are eagerly imported (they are small).',
        'This is production-grade async component handling.',
      ],
    },
    advanced: {
      label: 'Advanced — retry on failure and Suspense coordination',
      lang: 'vue',
      code: '<script setup>\nimport { defineAsyncComponent } from \'vue\'\nconst Profile = defineAsyncComponent({\n  loader: () => import(\'@/views/Profile.vue\'),\n  onError(error, retry, fail, attempts) {\n    if (attempts <= 3) retry()    // retry transient network failures\n    else fail()\n  },\n})\n</script>\n<template>\n  <Suspense>\n    <template #default><Profile /></template>\n    <template #fallback><p>Loading profile…</p></template>\n  </Suspense>\n</template>',
      explanation: [
        'onError retries up to 3 times before giving up — resilient to flaky networks.',
        '<Suspense> coordinates the async load with a single fallback slot.',
        'Inside Suspense the component is suspensible, deferring to Suspense\'s fallback.',
        'This pattern handles real-world network flakiness gracefully.',
        'Use Suspense when you want one fallback for a group of async dependencies.',
      ],
    },
    realProject: {
      label: 'Real project — lazy modal + prefetch on hover',
      lang: 'vue',
      code: '<script setup>\nimport { ref, defineAsyncComponent } from \'vue\'\nconst show = ref(false)\nconst SettingsModal = defineAsyncComponent(() =>\n  import(\'@/components/SettingsModal.vue\'))\n\n// prefetch the chunk when the user hovers the button (Vite supports /* webpackPrefetch */-style hints too)\nfunction prefetch() { import(\'@/components/SettingsModal.vue\') }\n</script>\n<template>\n  <button @mouseenter="prefetch" @click="show = true">Settings</button>\n  <SettingsModal v-if="show" @close="show = false" />\n</template>',
      explanation: [
        'The modal\'s code is excluded from the initial bundle and loads on first open.',
        'Prefetching on hover warms the chunk so the click feels instant.',
        'v-if defers even creating the component until needed.',
        'This balances small initial bundle with snappy perceived performance.',
        'A common real pattern for heavy, optional UI like editors and modals.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you lazy-load a route component in Vue?',
      answer: 'Give the route a loader function that returns a dynamic import: component: () => import(\'@/views/Page.vue\'). The bundler splits it into a separate chunk fetched when the route is visited.',
      explanation: 'The loader-function-returning-import() pattern is the core answer.',
    },
    {
      level: 'beginner',
      question: 'Why does lazy loading make an app faster?',
      answer: 'It reduces the initial bundle the browser must download and parse, so first paint and time-to-interactive improve; deferred code only loads when actually needed.',
      explanation: 'Initial-bundle reduction is the mechanism.',
    },
    {
      level: 'intermediate',
      question: 'What does defineAsyncComponent add over a bare dynamic import in the router?',
      answer: 'It wraps a loader into a component usable anywhere (not just routes) and provides UX options: loadingComponent, errorComponent, delay (avoid spinner flash), timeout, and onError for retries. The router already handles route loaders, so defineAsyncComponent is for non-route components.',
      explanation: 'Naming the option set and the route-vs-component distinction shows real usage.',
    },
    {
      level: 'intermediate',
      question: 'How do you avoid a loading-spinner flash on fast loads?',
      answer: 'Use the delay option in defineAsyncComponent so the loadingComponent only appears after a threshold (e.g. 200ms); fast loads resolve before the spinner ever shows.',
      explanation: 'The delay option is the specific, expected answer.',
    },
    {
      level: 'advanced',
      question: 'What is a request waterfall and how can over-splitting cause it?',
      answer: 'A waterfall is sequential dependent fetches where each must finish before the next starts. Over-fragmenting code into many tiny chunks, or nesting lazy components so one must load before discovering the next, serializes downloads and can be slower than a single larger chunk. Mitigate with sensible chunk granularity and prefetching.',
      explanation: 'Recognizing the over-splitting trade-off and prefetch mitigation is senior-leaning.',
    },
    {
      level: 'senior',
      question: 'How do lazy loading and Suspense work together, and when would you prefer each loading approach?',
      answer: 'A suspensible async component defers its pending state to an enclosing <Suspense> fallback, letting you show one fallback for a group of async dependencies (e.g. a route\'s async setup plus lazy children). Per-component loadingComponent suits isolated components, while Suspense suits coordinating multiple async pieces under one boundary. Combine with onError retries and error boundaries for resilience.',
      explanation: 'Coordinating group fallbacks via Suspense vs isolated loadingComponent is the senior nuance.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between code splitting and lazy loading?',
    'How does prefetching/preloading complement lazy loading?',
    'What are the downsides of over-splitting into too many chunks?',
    'How do you handle a failed chunk load (e.g. after a deploy)?',
    'How does <Suspense> change async component behavior?',
    'Does lazy loading help runtime performance or only load-time?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Lazy-loading tiny or always-needed components.',
      why: 'It adds an extra network request and loading state for negligible bundle savings, often hurting UX.',
      fix: 'Lazy-load large or rarely-used code (routes, heavy charts, optional modals); keep small/always-used code in the main bundle.',
    },
    {
      mistake: 'Showing a spinner immediately for fast loads.',
      why: 'A flash of a spinner for a 50ms load looks janky.',
      fix: 'Use the delay option so the loading component only appears after a threshold.',
    },
    {
      mistake: 'No error/timeout handling for async components.',
      why: 'A failed or slow chunk leaves a blank area with no feedback or recovery.',
      fix: 'Provide errorComponent, timeout, and onError retry logic.',
    },
    {
      mistake: 'Over-splitting into many tiny chunks.',
      why: 'It creates request waterfalls and overhead that can be slower than fewer larger chunks.',
      fix: 'Choose sensible chunk boundaries (per route/feature) and use prefetch for likely-next code.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Route-level lazy loading via () => import() is standard; defineAsyncComponent handles heavy non-route components like charts and editors.' },
    { area: 'Vite', detail: 'Automatically splits dynamic imports into chunks and supports modulepreload/prefetch hints for warming likely-next code.' },
    { area: 'Component library', detail: 'Heavy optional widgets (rich text editors, date pickers, maps) are exposed as async components so apps only pay for what they use.' },
    { area: 'SSR', detail: 'Async components integrate with Suspense and hydration; care is needed so server and client resolve the same chunks to avoid mismatches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Smaller initial bundle → faster first paint and time-to-interactive.',
      'Users never download code for features/routes they do not use.',
    ],
    bad: [
      'On-demand fetch adds latency when a deferred component is first needed.',
      'Over-splitting causes request waterfalls and loading flashes.',
    ],
    optimizations: [
      'Lazy-load at route/feature boundaries; keep small always-used code eager.',
      'Prefetch/preload chunks the user is likely to need next (e.g. on hover).',
      'Use delay to avoid spinner flashes and timeout/onError for resilience.',
      'Group related code into sensible chunks to avoid waterfalls.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-performance-overview', 'async-components', 'dynamic-components', 'components-basics'],
    nextConcepts: ['bundle-optimization', 'suspense', 'route-meta-lazy-loading', 'v-once-v-memo'],
    dependencyNote:
      'Lazy loading applies async-components and code splitting to performance. It builds on the performance overview, leans on async-components and Suspense, and complements bundle-optimization and route-meta-lazy-loading.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a big "initial bundle" box, then split a route off it with () => import().',
      'Show the split chunk fetched only when the user navigates to that route.',
      'Draw defineAsyncComponent with its states: pending → loading, resolved → component, failed → error.',
      'Annotate delay (avoid spinner flash), timeout, and onError(retry).',
      'Say: "I split at route/feature boundaries to shrink the initial bundle, add loading/error UX, and prefetch likely-next chunks — but I avoid over-splitting tiny components."',
    ],
    diagram: '  initial bundle ──() => import(\'Admin\')──► admin chunk (on demand)\n\n  defineAsyncComponent({ loader, loadingComponent, errorComponent,\n                         delay, timeout, onError(retry) })\n     pending → Spinner (after delay)\n     resolved → Component\n     failed/timeout → Error (retry up to N)',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Lazy loading defers a component\'s code until it is needed, shrinking the initial bundle for faster first paint. In Vue you use a loader function returning import() — the router does this for routes, and defineAsyncComponent does it for any component, with loadingComponent, errorComponent, delay (to avoid spinner flash), timeout, and onError retries. Pair with <Suspense> for grouped fallbacks and prefetch likely-next chunks. Lazy-load large or rarely-used code; do not over-split tiny components or you create request waterfalls.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Lazy loading is the practical application of code splitting at the component level, and it is usually the highest-leverage load-time optimization. The idea is to defer downloading and evaluating a component\'s code until the moment it is actually needed, instead of bundling everything into the initial download. In Vue the mechanism is a dynamic import wrapped in a loader function. For routes, you give the route a component that is () => import(\'@/views/Page.vue\'), and Vue Router fetches that chunk only when the route is visited — so a user who never opens the admin area never downloads admin code. For non-route components, you use defineAsyncComponent, passing a loader and optionally a loadingComponent, an errorComponent, a delay so a spinner does not flash for fast loads, a timeout, and an onError callback that gives you a retry function to handle transient network failures gracefully. Under the hood the bundler splits each dynamic import into a separate chunk at build time, and at runtime the browser fetches that chunk on demand and caches it, so subsequent renders are synchronous. You can also coordinate with <Suspense>, where a suspensible async component defers its pending state to a single shared fallback — useful when a route has several async dependencies you want to show one loader for. The trade-off is that the first use of a deferred component incurs a network fetch, which you can hide with prefetching — for example warming the chunk on button hover so the click feels instant. The main pitfalls are lazy-loading tiny or always-used components, which just adds requests and loading states for no real savings, and over-splitting into too many tiny chunks, which creates request waterfalls that can be slower than fewer larger chunks. So I split at sensible route and feature boundaries, add proper loading and error UX, and prefetch likely-next code.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Smaller initial bundle vs on-demand fetch latency — good chunk boundaries balance the two.',
      'Per-component loadingComponent (isolated UX) vs Suspense (grouped fallback) — choose by how many async pieces share a boundary.',
      'Prefetching improves perceived speed but consumes bandwidth speculatively.',
    ],
    edgeCases: [
      'Stale chunk after a deploy: hashed chunk filenames change, so a cached page requesting an old chunk 404s — handle with onError retry/reload and cache strategy.',
      'Over-splitting produces request waterfalls, especially when one lazy component must load before another is discovered.',
      'SSR/hydration must resolve the same chunks on server and client to avoid mismatches.',
    ],
    runtimeBehavior: [
      'A loader is called when the async component is about to render; the resolved chunk is cached for subsequent renders.',
      'delay suppresses the loading component for a threshold to avoid flashes; timeout escalates to the error component.',
      'Suspensible async components hand their pending state to the nearest <Suspense>.',
    ],
    scalability: [
      'Split at route and feature boundaries so chunk count grows with features, not with every component.',
      'Use prefetch/preload heuristics (hover, idle, route prediction) to warm likely-next chunks.',
      'Monitor chunk sizes and counts in CI to prevent both bloat and over-fragmentation.',
    ],
    productionConcerns: [
      'Handle failed chunk loads after deploys (retry then full reload) to avoid breaking long-lived sessions.',
      'Avoid layout shift by reserving space for lazy content while it loads.',
      'Track LCP/INP to confirm splitting actually improves field metrics, not just lab numbers.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Lazy load = defer a component\'s code until needed → smaller initial bundle.',
    'Route: component: () => import(\'@/views/Page.vue\').',
    'Component: defineAsyncComponent(() => import(...)).',
    'Object form options: loadingComponent, errorComponent, delay, timeout, onError(retry).',
    'delay avoids spinner flash; timeout + errorComponent handle failures.',
    'onError gives retry/fail/attempts for flaky networks.',
    'Pair with <Suspense> for grouped fallbacks.',
    'Prefetch likely-next chunks (e.g. on hover) for instant feel.',
    'Lazy-load LARGE/RARE code; keep small/always-used code eager.',
    'Avoid over-splitting → request waterfalls.',
    'Handle stale chunks after deploys (retry/reload).',
    'It helps LOAD-time, not runtime render cost.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Lazy-load a Reports route component.',
      hint: 'Use a loader function in the route definition.',
      solution: {
        lang: 'js',
        code: '{ path: \'/reports\', component: () => import(\'@/views/Reports.vue\') }',
        explanation: [
          'The loader function makes Reports its own chunk.',
          'It downloads only when /reports is visited.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Define an async HeavyEditor component with a spinner shown only after 250ms and an error component on failure.',
      hint: 'Use the object form of defineAsyncComponent.',
      solution: {
        lang: 'js',
        code: 'import { defineAsyncComponent } from \'vue\'\nimport Spinner from \'@/components/Spinner.vue\'\nimport ErrorBox from \'@/components/ErrorBox.vue\'\nconst HeavyEditor = defineAsyncComponent({\n  loader: () => import(\'@/components/HeavyEditor.vue\'),\n  loadingComponent: Spinner,\n  errorComponent: ErrorBox,\n  delay: 250,\n})',
        explanation: [
          'delay: 250 prevents a spinner flash for fast loads.',
          'errorComponent gives feedback if the chunk fails.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add retry-up-to-3-times logic to an async Profile component for flaky networks.',
      hint: 'Use the onError option.',
      solution: {
        lang: 'js',
        code: 'import { defineAsyncComponent } from \'vue\'\nconst Profile = defineAsyncComponent({\n  loader: () => import(\'@/views/Profile.vue\'),\n  onError(error, retry, fail, attempts) {\n    if (attempts <= 3) retry()\n    else fail()\n  },\n})',
        explanation: [
          'onError exposes retry/fail and the attempt count.',
          'Retrying transient failures improves resilience before showing an error.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A heavy settings modal bloats the initial bundle but feels laggy when opened lazily. Keep the bundle small AND make opening feel instant.',
      hint: 'Combine lazy load with prefetch.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, defineAsyncComponent } from \'vue\'\nconst show = ref(false)\nconst SettingsModal = defineAsyncComponent(() => import(\'@/components/SettingsModal.vue\'))\nfunction warm() { import(\'@/components/SettingsModal.vue\') }   // prefetch\n</script>\n<template>\n  <button @mouseenter="warm" @click="show = true">Settings</button>\n  <SettingsModal v-if="show" @close="show = false" />\n</template>',
        explanation: [
          'Lazy loading keeps the modal out of the initial bundle.',
          'Prefetching on hover warms the chunk so the click feels instant.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Lazy loading is the most common, highest-impact performance technique and a near-guaranteed interview topic. Knowing the router pattern, defineAsyncComponent options, Suspense coordination, and the over-splitting trade-off shows you can ship fast apps, not just working ones.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do you lazy-load a route". Product companies (Zoho, Flipkart, Razorpay) ask about defineAsyncComponent options, loading/error UX, and prefetching. FAANG-level interviews probe chunk waterfalls, Suspense coordination, stale-chunk handling after deploys, and field-metric impact.',
    whatInterviewersExpect:
      'They expect the () => import() route pattern, defineAsyncComponent with loading/error/delay/timeout/onError, when to combine with Suspense, prefetching for perceived speed, and awareness of over-splitting and stale-chunk pitfalls.',
  },
}

export default lazyLoadingComponents
