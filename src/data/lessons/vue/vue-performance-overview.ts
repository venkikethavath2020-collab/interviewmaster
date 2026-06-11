import type { ConceptLesson } from '../../../types/lesson'

const vuePerformanceOverview: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue-performance-overview',
  name: 'Vue Performance Overview',
  category: 'performance',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Performance is where senior engineers prove their worth — anyone can build a feature, but keeping it fast under real data and traffic is the differentiator.',
    'Vue gives you a layered toolbox (compile-time hoisting, reactivity granularity, code splitting, v-memo, virtual scrolling) and knowing WHICH lever fits WHICH bottleneck is the whole skill.',
    'The biggest wins are usually load-time (bundle size, lazy loading) and runtime (avoiding unnecessary re-renders), and they need completely different fixes.',
    'Misdiagnosing performance — optimizing render when the real cost is bundle size, or vice versa — wastes effort and is a classic interview trap.',
    'Real apps slow down at scale: long lists, large reactive objects, and over-broad stores; an overview lets you reason about the whole pipeline before reaching for a specific tool.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Making a Vue app fast is like running a fast restaurant: it depends on how quickly food arrives at the door AND how quickly the kitchen cooks each order.',
    story: [
      'Imagine a restaurant. First, the ingredients have to be delivered to the kitchen — if the truck is huge and slow, nothing can start. That is like your app\'s download (the bundle).',
      'Then, every time someone orders, the kitchen has to cook. If the chefs redo the whole menu for one small order, dinner is slow. That is like re-rendering more of the screen than needed.',
      'A good restaurant delivers only the ingredients it needs right now, and cooks only the dish that changed — not the entire menu.',
      'Making Vue fast is the same: send a small download, load extra parts only when needed, and update only the bits of the page that actually changed.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A web app can be slow for two main reasons: it takes too long to download and start, or it does too much work while you use it.',
    'Download/startup speed is about how big the JavaScript bundle is — splitting it so the browser only loads what a page needs makes it start faster.',
    'Runtime speed is about how much the app re-draws when data changes — if it re-draws huge lists or whole pages unnecessarily, it feels laggy.',
    'Vue helps with both: it compiles templates to skip unchanged parts, only updates the data that actually changed, and lets you load components on demand.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue performance work falls into two buckets: load-time (bundle size, code splitting, lazy loading, SSR/hydration) and runtime (minimizing re-renders, reactivity overhead, list rendering, expensive computeds). The skill is profiling to find which bucket the bottleneck is in, then applying the matching technique.',
    how: 'You measure with Vue Devtools, the browser Performance panel, and bundle analyzers. Then you apply targeted fixes: lazy-load routes/components, memoize/cache derived values, key lists correctly, virtualize long lists, use shallow reactivity for big data, and split stores.',
    why: 'Optimizing the wrong bucket wastes effort. A data-driven, layered approach gives the biggest wins (load-time for first paint, runtime for interaction smoothness) without premature micro-optimization.',
    code: {
      label: 'Two buckets, two fixes',
      lang: 'js',
      code: '// LOAD-TIME: split a heavy route so it loads on demand\nconst Dashboard = () => import(\'@/views/Dashboard.vue\')\n\n// RUNTIME: cache an expensive derivation instead of recomputing in template\nimport { computed } from \'vue\'\nconst sortedRows = computed(() =>\n  [...rows.value].sort((a, b) => a.score - b.score))\n// template uses sortedRows (cached) — not an inline sort that runs every render',
      explanation: [
        'Dynamic import() lets the bundler split Dashboard into its own chunk, shrinking the initial download.',
        'computed caches the sort and only recomputes when rows changes.',
        'An inline sort in the template would re-run on every render — a runtime cost.',
        'Different bottlenecks, different tools: load-time vs runtime.',
        'Profile first to know which one you actually have.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue performance spans the load-time pipeline (bundle size, code splitting / lazy loading, tree-shaking, SSR and hydration cost) and the runtime pipeline (reactivity tracking overhead, render/patch work, and unnecessary component updates). Vue 3\'s compiler reduces runtime cost via static hoisting, patch flags, and tree-flattening so the virtual DOM diff skips static content; the Proxy reactivity system tracks dependencies per-property so only effects whose dependencies changed re-run. Optimization is the practice of profiling to localize the bottleneck, then applying the matching lever — code splitting and SSR for load-time, and memoization, correct keys, shallow reactivity, v-memo/v-once, and virtualization for runtime.',

  // 7. Internal Working
  internalWorking: [
    'At build time, the Vue compiler analyzes templates and hoists static nodes out of the render function so they are created once, and attaches patch flags marking which dynamic bindings can change.',
    'On update, the virtual DOM patcher uses those patch flags and block tree-flattening to skip static subtrees and diff only the flagged dynamic parts, cutting diff work dramatically.',
    'The reactivity system tracks dependencies at property granularity: a component\'s render effect subscribes only to the reactive properties it actually reads, so unrelated state changes do not re-render it.',
    'When tracked state changes, trigger() schedules the dependent render effects onto an async, deduped queue, so multiple mutations in a tick coalesce into one render (and one patch).',
    'Code splitting via dynamic import() instructs the bundler to emit separate chunks, loaded on demand, reducing the initial JS the browser must parse and execute.',
    'Under SSR, the server renders HTML and the client hydrates by attaching listeners to existing DOM; hydration cost scales with component count, which lazy hydration / islands strategies aim to reduce.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '              VUE PERFORMANCE = LOAD-TIME  +  RUNTIME\n\n  LOAD-TIME (first paint / TTI)        RUNTIME (interaction smoothness)\n  ┌───────────────────────────┐       ┌─────────────────────────────────┐\n  │ bundle size               │       │ reactivity tracking (per-prop)    │\n  │ code splitting / lazy load │       │ re-render scope (which components)│\n  │ tree-shaking              │       │ render/patch (patch flags, hoist) │\n  │ SSR + hydration cost      │       │ list rendering / virtualization   │\n  └─────────────┬─────────────┘       └─────────────────┬─────────────────┘\n        fix: import(), routes,                 fix: computed cache, keys,\n        analyzer, SSR/islands                  v-memo/v-once, shallowRef,\n                                                split stores, virtual scroll\n\n        PROFILE FIRST → localize bottleneck → apply the MATCHING lever',

  // 9. Memory Visualization
  memoryVisualization: [
    'Deeply reactive large objects allocate a Proxy per nested object, increasing memory and access overhead; shallowRef/shallowReactive avoid deep wrapping.',
    'Long lists hold a vnode and DOM node per item; virtualization keeps only visible items in memory, bounding it regardless of dataset size.',
    'Code-split chunks are loaded into memory only when their route/component is used, keeping the initial heap smaller.',
    'Un-cleaned listeners/timers in components retain closures and captured data, leaking memory across navigations.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — lazy-load a route',
      lang: 'js',
      code: 'const routes = [\n  { path: \'/\', component: () => import(\'@/views/Home.vue\') },\n  { path: \'/reports\', component: () => import(\'@/views/Reports.vue\') },\n]\n// Reports.vue (and its deps) download only when /reports is visited',
      explanation: [
        'Each route component is a dynamic import, so the bundler emits a separate chunk.',
        'The initial bundle excludes Reports until the user navigates there.',
        'This is the highest-leverage load-time win in most apps.',
        'Combine with prefetch hints for routes likely to be visited next.',
      ],
    },
    intermediate: {
      label: 'Intermediate — narrow the re-render scope',
      lang: 'vue',
      code: '<script setup>\nimport { computed } from \'vue\'\nimport { storeToRefs } from \'pinia\'\nimport { useDashboard } from \'@/stores/dashboard\'\n// bind ONLY the fields this component uses, not the whole store\nconst { revenue } = storeToRefs(useDashboard())\nconst formatted = computed(() => revenue.value.toLocaleString())\n</script>\n<template><span>{{ formatted }}</span></template>',
      explanation: [
        'Reactivity is per-property: reading only revenue means changes to other store fields do not re-render this component.',
        'computed caches the formatting so it runs only when revenue changes.',
        'Spreading the whole store or doing inline work would widen the re-render footprint.',
        'Granular subscriptions are the core runtime optimization.',
        'storeToRefs keeps the binding reactive without pulling unrelated fields.',
      ],
    },
    advanced: {
      label: 'Advanced — v-memo and shallowRef for heavy data',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef } from \'vue\'\nconst grid = shallowRef(bigMatrix)   // skip deep reactivity on a large structure\n</script>\n<template>\n  <!-- skip re-rendering a row unless its id or selected flag changed -->\n  <Row\n    v-for="row in grid"\n    :key="row.id"\n    v-memo="[row.id, row.selected]"\n    :row="row"\n  />\n</template>',
      explanation: [
        'shallowRef makes only the .value reference reactive, avoiding deep Proxy cost on a large matrix.',
        'v-memo skips re-rendering a row unless the listed dependencies change.',
        'Together they cut both reactivity overhead and render work for large grids.',
        'Replace grid wholesale (grid.value = next) to trigger updates with shallowRef.',
        'Use v-memo only for measured hotspots — it adds complexity.',
      ],
    },
    realProject: {
      label: 'Real project — diagnosing a slow data table page',
      lang: 'js',
      code: '// Symptom: /table page is slow to load AND janky when filtering.\n// Step 1 (profile): bundle analyzer shows a 400KB chart lib on initial load.\n//   Fix (load-time): lazy import the chart only when the chart tab opens.\nconst Chart = () => import(\'@/components/HeavyChart.vue\')\n// Step 2 (profile): Performance panel shows full re-sort every keystroke.\n//   Fix (runtime): debounce filter + computed for sorted rows + virtual list.\n// Step 3: deep reactive 10k-row array → switch to shallowRef + replace wholesale.',
      explanation: [
        'Two distinct problems: load-time (heavy chunk) and runtime (re-sort + huge reactive list).',
        'Each is profiled and fixed with the matching tool.',
        'Lazy import removes the chart from the initial bundle.',
        'Debounce + computed + virtualization fix the interaction jank.',
        'shallowRef tames the reactivity cost of a 10k-row dataset.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the two main categories of web app performance?',
      answer: 'Load-time performance (how fast it downloads and becomes interactive — bundle size, code splitting, SSR) and runtime performance (how smooth it is during use — re-renders, reactivity cost, list rendering).',
      explanation: 'Splitting the problem into load-time vs runtime frames every other answer.',
    },
    {
      level: 'beginner',
      question: 'How does lazy loading improve performance?',
      answer: 'It splits the bundle so the browser downloads and parses only the code a page needs initially, deferring the rest until it is actually used, which speeds up first paint and time-to-interactive.',
      explanation: 'The initial-bundle reduction is the core idea.',
    },
    {
      level: 'intermediate',
      question: 'Why does Vue not re-render every component when one piece of state changes?',
      answer: 'Vue\'s reactivity tracks dependencies at property granularity: a component\'s render effect subscribes only to the reactive properties it reads, so only components depending on the changed property re-render.',
      explanation: 'Per-property tracking is the runtime efficiency foundation.',
    },
    {
      level: 'intermediate',
      question: 'What compile-time optimizations does Vue 3 do?',
      answer: 'Static hoisting (create static nodes once), patch flags (mark which bindings are dynamic), and block tree-flattening so the diff skips static subtrees and only patches dynamic parts.',
      explanation: 'Naming hoisting and patch flags shows compiler-level understanding.',
    },
    {
      level: 'advanced',
      question: 'How would you approach a page that feels janky during interaction?',
      answer: 'Profile with the Performance panel and Vue Devtools to find the hot path, then narrow it: cache derived data with computed, narrow re-render scope (granular store bindings), correct list keys, virtualize long lists, use shallowRef for big data, and v-memo measured hotspots. Avoid micro-optimizing before profiling.',
      explanation: 'Profile-first plus the right runtime levers is the senior approach.',
    },
    {
      level: 'senior',
      question: 'When is SSR a performance help versus a cost?',
      answer: 'SSR improves perceived first paint and SEO by sending rendered HTML, but adds server cost and hydration work proportional to component count, which can delay interactivity. Techniques like lazy/partial hydration and islands reduce that hydration cost, so SSR is a trade-off tuned to the app\'s needs.',
      explanation: 'Recognizing SSR\'s hydration trade-off and mitigations is senior-level.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you measure Vue performance? (Devtools, Performance panel, bundle analyzer, web vitals)',
    'What is the difference between optimizing first paint and optimizing interaction?',
    'What are patch flags and static hoisting?',
    'When does shallowRef/shallowReactive help?',
    'How do v-once and v-memo differ?',
    'How does an over-broad Pinia store hurt performance?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Optimizing without profiling first.',
      why: 'You may fix the wrong bucket (e.g. micro-optimize renders when the real cost is a huge bundle).',
      fix: 'Measure with Devtools/Performance panel/analyzer, localize the bottleneck, then act.',
    },
    {
      mistake: 'Doing expensive work (sort/filter/format) inline in the template.',
      why: 'It re-runs on every render instead of being cached.',
      fix: 'Move it into a computed so it caches and recomputes only on dependency change.',
    },
    {
      mistake: 'Rendering thousands of list items directly.',
      why: 'Vue creates a vnode and DOM node per item, overwhelming render and memory.',
      fix: 'Virtualize the list so only visible items are rendered.',
    },
    {
      mistake: 'Making large data deeply reactive unnecessarily.',
      why: 'Deep Proxy wrapping adds memory and per-access overhead for data that changes wholesale.',
      fix: 'Use shallowRef/shallowReactive and replace the value wholesale.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Route-level code splitting, computed caching, correct list keys, and v-memo on measured hotspots are standard runtime/load-time practices.' },
    { area: 'Vite', detail: 'Build tooling enables tree-shaking, chunk splitting, and bundle analysis to keep initial JS small.' },
    { area: 'SSR', detail: 'Server rendering improves first paint and SEO; hydration cost is reduced with lazy/partial hydration and islands.' },
    { area: 'Pinia', detail: 'Splitting large stores into focused ones narrows re-render scope and avoids global update fan-out.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Compile-time hoisting and patch flags make Vue 3 diffs skip static content automatically.',
      'Per-property reactivity localizes re-renders to components that truly depend on changed state.',
    ],
    bad: [
      'Large initial bundles delay first paint and time-to-interactive.',
      'Over-broad reactive state and inline template computation cause unnecessary re-renders.',
    ],
    optimizations: [
      'Code-split routes/components with dynamic import() to shrink the initial bundle.',
      'Cache derived data in computed; narrow store subscriptions with storeToRefs.',
      'Virtualize long lists and use correct stable keys.',
      'Use shallowRef/shallowReactive for large wholesale-changed data; v-memo/v-once for measured hotspots.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'virtual-dom', 'computed', 'template-compilation'],
    nextConcepts: ['lazy-loading-components', 'v-once-v-memo', 'list-rendering-performance', 'reactivity-performance', 'bundle-optimization', 'computed-caching'],
    dependencyNote:
      'This overview frames the whole performance pipeline and points to the specific levers — lazy-loading-components and bundle-optimization for load-time, and v-once-v-memo, computed-caching, list-rendering-performance, and reactivity-performance for runtime.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two big buckets: LOAD-TIME and RUNTIME.',
      'Fill load-time with bundle size, code splitting, SSR/hydration; fill runtime with reactivity, re-render scope, render/patch, lists.',
      'Write "PROFILE FIRST" above both buckets with an arrow into them.',
      'Under each bucket list the matching levers (import()/SSR vs computed/keys/v-memo/shallowRef/virtualize).',
      'Say: "I localize the bottleneck to one bucket, then apply the matching lever — never micro-optimize blindly."',
    ],
    diagram: '            PROFILE FIRST\n               │\n      ┌────────┴────────┐\n   LOAD-TIME          RUNTIME\n   bundle/split       reactivity/renders\n   SSR/hydration      lists/patch\n      │                  │\n   import(), SSR      computed, keys,\n   analyzer           v-memo, shallowRef,\n                      virtualize, split stores',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue performance splits into load-time (bundle size, code splitting, lazy loading, SSR/hydration) and runtime (re-render scope, reactivity overhead, list rendering, expensive computeds). Vue 3 helps automatically via compile-time static hoisting and patch flags plus per-property reactivity that localizes re-renders. The method is: profile to find which bucket the bottleneck is in, then apply the matching lever — dynamic import() and SSR for load-time; computed caching, correct keys, v-memo/v-once, shallowRef, and virtualization for runtime. Never micro-optimize before measuring.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'I think about Vue performance in two buckets, because they have completely different fixes. The first is load-time: how fast the app downloads, parses, and becomes interactive. That is dominated by bundle size, so the biggest win is code splitting — using dynamic import() for routes and heavy components so the browser only downloads what a page needs, plus tree-shaking and, where appropriate, SSR for faster first paint. The second is runtime: how smooth the app feels during interaction, which is about doing the least work when state changes. Vue 3 already helps a lot here automatically: the compiler does static hoisting and attaches patch flags so the virtual DOM diff skips static content and only patches the dynamic bindings, and the reactivity system tracks dependencies at property granularity, so a component only re-renders if a property it actually reads changes. On top of that I apply targeted levers: cache expensive derivations in computed instead of computing inline in templates, keep store subscriptions narrow with storeToRefs so unrelated state does not trigger renders, give lists stable correct keys, virtualize long lists so only visible rows render, use shallowRef or shallowReactive for large data that changes wholesale to skip deep Proxy overhead, and use v-memo or v-once on measured hotspots. The most important principle is to profile first — with Vue Devtools, the browser Performance panel, and a bundle analyzer — to localize the bottleneck to one bucket before touching anything, because optimizing renders when the real problem is a 400KB chunk, or vice versa, just wastes effort. SSR is itself a trade-off: it improves perceived first paint and SEO but adds hydration cost proportional to component count, which lazy or partial hydration and islands help mitigate.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'SSR improves first paint and SEO but adds server cost and hydration work that can delay interactivity.',
      'Aggressive code splitting reduces initial load but can cause waterfalls and loading flashes if over-fragmented.',
      'v-memo and manual optimizations add complexity and bug surface, so they should be reserved for profiled hotspots.',
    ],
    edgeCases: [
      'shallowRef skips deep reactivity, so nested mutations are not tracked — you must replace the value wholesale.',
      'Incorrect/index keys on dynamic lists cause wrong DOM reuse and subtle render bugs while also hurting diff efficiency.',
      'Over-split chunks can create request waterfalls that are slower than a single slightly larger chunk.',
    ],
    runtimeBehavior: [
      'Multiple mutations in a tick batch into a single render via the async deduped queue.',
      'Patch flags and block flattening mean static-heavy templates diff in near-constant time relative to dynamic node count.',
      'Component-level re-render scope is determined by which reactive properties its render reads.',
    ],
    scalability: [
      'Long lists must be virtualized; rendering thousands of vnodes does not scale regardless of other tuning.',
      'Split large stores so subscription/re-render fan-out stays narrow as the app grows.',
      'Move heavy server-cache data into a query layer to keep client reactivity graphs lean.',
    ],
    productionConcerns: [
      'Track real-user metrics (LCP, INP, TTFB) — lab profiling can miss field conditions.',
      'Watch for memory leaks from un-cleaned listeners/timers across route changes.',
      'Budget bundle size in CI to prevent regressions from creeping dependencies.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Two buckets: LOAD-TIME and RUNTIME — different fixes.',
    'Profile FIRST (Devtools, Performance panel, bundle analyzer).',
    'Load-time: code splitting via import(), tree-shaking, SSR.',
    'Runtime: minimize re-renders and reactivity/render work.',
    'Vue 3 auto-optimizes: static hoisting + patch flags + per-property reactivity.',
    'Cache derivations in computed, not inline in templates.',
    'Narrow store subscriptions with storeToRefs; split big stores.',
    'Stable, correct list keys; virtualize long lists.',
    'shallowRef/shallowReactive for large wholesale-changed data.',
    'v-memo / v-once for measured hotspots only.',
    'SSR helps first paint/SEO but adds hydration cost.',
    'Track field metrics (LCP/INP) and budget bundle size in CI.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert an eagerly-imported Settings route into a lazily-loaded one.',
      hint: 'Use a dynamic import for the component.',
      solution: {
        lang: 'js',
        code: '// before: import Settings from \'@/views/Settings.vue\'\n// after:\n{ path: \'/settings\', component: () => import(\'@/views/Settings.vue\') }',
        explanation: [
          'The dynamic import splits Settings into its own chunk.',
          'It downloads only when the user visits /settings.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'A template does {{ rows.filter(r => r.active).length }}. Explain the cost and refactor it.',
      hint: 'Inline filtering runs every render.',
      solution: {
        lang: 'js',
        code: 'import { computed } from \'vue\'\nconst activeCount = computed(() => rows.value.filter((r) => r.active).length)\n// template: {{ activeCount }}',
        explanation: [
          'The inline filter re-runs on every render of the component.',
          'computed caches it and recomputes only when rows changes.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'You have a 50,000-row reactive array causing slow updates. Reduce reactivity overhead while keeping the UI updating on full reloads.',
      hint: 'Deep reactivity is the cost; replace wholesale.',
      solution: {
        lang: 'js',
        code: 'import { shallowRef, triggerRef } from \'vue\'\nconst rows = shallowRef(initialRows)\nfunction reload(next) {\n  rows.value = next        // wholesale replace triggers update\n}\n// for in-place mutation you would call triggerRef(rows)',
        explanation: [
          'shallowRef avoids deep-proxying 50k rows, cutting memory and access overhead.',
          'Replacing rows.value wholesale triggers the render; deep edits would need triggerRef.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A page is slow to LOAD and janky on FILTER. Outline how you would diagnose and fix each problem separately.',
      hint: 'Two buckets, two tools.',
      solution: {
        lang: 'js',
        code: '// LOAD: run bundle analyzer → find heavy chunk → lazy import it\nconst Heavy = () => import(\'@/components/Heavy.vue\')\n// FILTER jank: Performance panel → see re-sort/re-render every keystroke\n//   fix: debounce input + computed for derived list + virtualize rows\n// If list is huge & deeply reactive: switch to shallowRef + wholesale replace',
        explanation: [
          'Load and runtime are separate buckets diagnosed with separate tools.',
          'Each gets its matching fix: code splitting for load, caching/virtualization/shallowRef for runtime.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Performance is the clearest senior signal. Being able to split a vague "it\'s slow" into load-time vs runtime, profile to localize the bottleneck, and reach for the right lever — rather than guessing — is exactly what distinguishes engineers who can scale an app from those who only build features.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do you improve Vue app performance" expecting lazy loading and computed. Product companies (Zoho, Flipkart, Razorpay) ask you to diagnose a slow page and choose specific levers. FAANG-level interviews probe compiler optimizations, hydration cost, reactivity granularity, and field-metric-driven tuning.',
    whatInterviewersExpect:
      'They expect you to frame load-time vs runtime, insist on profiling first, name Vue 3\'s automatic optimizations (hoisting, patch flags, per-property reactivity), and pair concrete bottlenecks with concrete fixes.',
  },
}

export default vuePerformanceOverview
