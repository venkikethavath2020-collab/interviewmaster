import type { ConceptLesson } from '../../../types/lesson'

const bundleOptimization: ConceptLesson = {
  // 1. Concept Summary
  slug: 'bundle-optimization',
  name: 'Bundle Optimization',
  category: 'performance',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Bundle size is the first thing your users feel: a smaller JS payload means faster load, faster Time-to-Interactive, and better Core Web Vitals.',
    'Code splitting, lazy loading, and tree shaking are the everyday levers that keep a growing Vue app from shipping a multi-megabyte download.',
    'It demonstrates you think beyond features — about what actually ships to the browser and how build tools (Vite/Rollup) shape it.',
    'Bundle bloat is a real production problem: an accidental import of a huge library, or a vendor chunk that never splits, can double load time.',
    'Interviewers use it to gauge whether you understand modern tooling: ES modules, dynamic import, async components, and analyzing what is in your bundle.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A bundle is like packing for a trip: bring only what you need for today, leave the rest at home to grab later, and don\'t pack things you\'ll never use.',
    story: [
      'Imagine packing one giant suitcase with EVERYTHING you own for a weekend trip — your winter coat, all your games, every book. It is so heavy you can barely carry it to the door.',
      'A smart traveler packs only what they need for the weekend. If they suddenly need their swimsuit, they can have it shipped just when they reach the beach. That is lazy loading.',
      'And they don\'t pack things they never use at all — those get left behind. That is tree shaking: the build tool throws away code you never call.',
      'A web app\'s "suitcase" is the JavaScript it sends to your browser. Packing smart means the page loads fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you build a Vue app, the tool (Vite, which uses Rollup) combines your code and libraries into JavaScript files called bundles that the browser downloads.',
    'A huge single bundle is slow to download and parse, so we split it into smaller pieces and only load each piece when it is actually needed (code splitting and lazy loading).',
    'Tree shaking automatically removes code you import but never use, so unused functions don\'t get shipped.',
    'You also reduce size by lazy-loading routes/components, importing only the parts of a library you need, and analyzing the bundle to find anything unexpectedly large.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Bundle optimization is the set of build-time techniques that reduce the amount and timing of JavaScript shipped to the browser: code splitting, lazy/async loading, tree shaking, minification, and dependency trimming.',
    how: 'Vite/Rollup statically analyze ES module imports to tree-shake dead code and create chunks. A dynamic import() creates a separate chunk loaded on demand; defineAsyncComponent and lazy route imports leverage this. You then analyze and tune chunking.',
    why: 'Smaller initial payloads load and become interactive faster, improving UX and Core Web Vitals, especially on slow networks and mobile.',
    code: {
      label: 'Lazy-loaded route = its own chunk',
      lang: 'ts',
      code: 'import { createRouter, createWebHistory } from \'vue-router\'\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    // eagerly bundled (in main chunk)\n    { path: \'/\', component: () => import(\'./views/Home.vue\') },\n    // dynamic import → separate chunk loaded only when visited\n    { path: \'/admin\', component: () => import(\'./views/Admin.vue\') },\n  ],\n})\nexport default router',
      explanation: [
        'Using () => import(...) makes Vite emit each view as a separate JS chunk.',
        'The Admin chunk only downloads when the user navigates to /admin.',
        'The initial bundle stays small because heavy/rare views are deferred.',
        'This is the single highest-impact, lowest-effort bundle optimization in a Vue app.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Bundle optimization is the practice of minimizing the size and improving the load timing of the JavaScript a Vue app ships, using the bundler\'s static module analysis. Tree shaking relies on ES module static imports to eliminate unreferenced exports. Code splitting uses dynamic import() to produce separately-loaded chunks, typically per route or per heavy component (async components). Additional levers include minification/compression (esbuild/terser, gzip/brotli), vendor/manual chunking to leverage caching, importing only needed library entry points, deferring non-critical code, and analyzing the output (rollup-plugin-visualizer) to find regressions. The goal is a small critical-path bundle with the rest loaded on demand.',

  // 7. Internal Working
  internalWorking: [
    'Vite uses ES modules in dev (native, no bundling) and Rollup for production builds; Rollup constructs a module graph from static import statements.',
    'Tree shaking marks exports as used or unused by walking that graph; side-effect-free unused exports are dropped (aided by "sideEffects": false in package.json).',
    'Each dynamic import() expression becomes a split point: Rollup emits a separate chunk and the runtime fetches it on demand via a network request, returning a Promise that resolves to the module.',
    'Vue\'s defineAsyncComponent and router lazy imports wrap these dynamic imports so the component/view loads only when rendered/navigated.',
    'Rollup deduplicates shared dependencies into common chunks; manualChunks (or default vendor splitting) groups stable third-party code so it can be cached across deploys.',
    'Finally the output is minified (esbuild by default) and served with gzip/brotli compression; the build can be inspected with a visualizer to confirm chunk sizes.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   src + deps ──► Rollup module graph
                      │
       tree shaking ──┤ drop unused exports
                      │
       split points ──┤ each import() ─► its own chunk
                      ▼
   ┌──────────────────────────────────────────────┐
   │ index.js  (critical path, small)               │
   │ vendor.js (cached libs)                         │
   │ admin.[hash].js   ← loaded on /admin            │
   │ chart.[hash].js   ← loaded when chart renders   │
   └──────────────────────────────────────────────┘
        minify + gzip/brotli ──► smaller over the wire`,

  // 9. Memory Visualization
  memoryVisualization: [
    'On disk/CDN the build is a set of hashed chunk files; only the critical chunks are fetched on first load, the rest stay remote until needed.',
    'In the browser, lazily-loaded chunks are parsed and instantiated only when imported, so memory and parse cost are deferred.',
    'Shared vendor chunks are cached by the browser across page loads and deploys (as long as their hash is unchanged), avoiding re-download.',
    'Tree-shaken code never enters the bundle at all, so it consumes neither bandwidth nor parse/heap memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — async component with defineAsyncComponent',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { defineAsyncComponent } from \'vue\'\n\n// loaded only when <HeavyChart> is actually rendered\nconst HeavyChart = defineAsyncComponent(() => import(\'./HeavyChart.vue\'))\n</script>\n\n<template>\n  <HeavyChart v-if="showChart" />\n</template>',
      explanation: [
        'The import() makes HeavyChart its own chunk.',
        'It downloads only when showChart becomes true and the component renders.',
        'The initial bundle excludes the chart and its (often large) charting library.',
        'Great for modals, charts, editors, and below-the-fold widgets.',
      ],
    },
    intermediate: {
      label: 'Intermediate — import only what you need (tree shaking)',
      lang: 'ts',
      code: '// BAD: pulls in (potentially) the whole library\nimport _ from \'lodash\'\nconst r = _.debounce(fn, 200)\n\n// GOOD: tree-shakable per-function import\nimport debounce from \'lodash-es/debounce\'\nconst r2 = debounce(fn, 200)\n\n// BEST for small needs: write it yourself / use a tiny dep\nfunction myDebounce(f: () => void, ms: number) {\n  let t: ReturnType<typeof setTimeout>\n  return () => { clearTimeout(t); t = setTimeout(f, ms) }\n}',
      explanation: [
        'Importing the default lodash bundle can ship far more than you use.',
        'lodash-es with a named/path import is ES-module friendly so Rollup tree-shakes the rest.',
        'For one or two helpers, a tiny hand-written util avoids the dependency entirely.',
        'Always prefer ESM, tree-shakable builds of libraries.',
      ],
    },
    advanced: {
      label: 'Advanced — manual vendor chunking in Vite',
      lang: 'ts',
      code: 'import { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig({\n  plugins: [vue()],\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks(id) {\n          if (id.includes(\'node_modules\')) {\n            if (id.includes(\'echarts\')) return \'charts\'\n            return \'vendor\'\n          }\n        },\n      },\n    },\n  },\n})',
      explanation: [
        'Heavy, rarely-changing libraries are isolated into their own cacheable chunks.',
        'Separating echarts means an app update does not invalidate the charts chunk in the browser cache.',
        'A generic vendor chunk groups the rest of node_modules for long-term caching.',
        'Over-splitting hurts (many tiny requests), so chunk deliberately around large/stable deps.',
      ],
    },
    realProject: {
      label: 'Real project — analyzing and trimming a Nuxt/Vite dashboard bundle',
      lang: 'ts',
      code: 'import { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\nimport { visualizer } from \'rollup-plugin-visualizer\'\n\nexport default defineConfig({\n  plugins: [\n    vue(),\n    // generates stats.html showing what is in each chunk\n    visualizer({ filename: \'stats.html\', gzipSize: true }),\n  ],\n  build: {\n    target: \'es2020\',\n    sourcemap: false,\n    chunkSizeWarningLimit: 600,\n  },\n})',
      explanation: [
        'The visualizer reveals the real culprits — often a moment.js, a full icon set, or a duplicated dep.',
        'After analysis you lazy-load heavy routes, swap moment for a smaller date lib, and dedupe versions.',
        'chunkSizeWarningLimit surfaces chunks that grew unexpectedly in CI.',
        'This analyze-then-trim loop is the realistic day-to-day of keeping a dashboard fast.',
        'A modern target (es2020) avoids shipping unnecessary legacy transpilation/polyfills.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is code splitting and how do you do it in a Vue app?',
      answer: 'Code splitting breaks the bundle into smaller chunks loaded on demand instead of one big file. In Vue you do it with dynamic import() — lazy route components (() => import(...)) and defineAsyncComponent for heavy components.',
      explanation: 'The expected concrete answer is dynamic import for routes and async components.',
    },
    {
      level: 'beginner',
      question: 'What is tree shaking?',
      answer: 'Tree shaking is the bundler removing code that is imported but never used. It relies on ES modules\' static imports/exports so the tool can prove an export is unreferenced and drop it.',
      explanation: 'Tie it to ESM static analysis; CommonJS is harder to tree-shake.',
    },
    {
      level: 'intermediate',
      question: 'You imported a utility from lodash and your bundle grew a lot. Why, and how do you fix it?',
      answer: 'A default import of the full lodash package can pull in much more than the one function. Fix it by importing the specific function from the ES-module build (lodash-es/debounce) so it tree-shakes, using a per-method package, or writing a tiny helper.',
      explanation: 'Tests awareness that import style and library packaging affect tree shaking.',
    },
    {
      level: 'intermediate',
      question: 'How would you find what is making a bundle large?',
      answer: 'Use a bundle analyzer (rollup-plugin-visualizer / vite-bundle-visualizer) to see chunk composition with gzip sizes, then look for oversized or duplicated dependencies, un-split heavy routes, and large vendor code.',
      explanation: 'Measuring before optimizing is the senior-correct instinct.',
    },
    {
      level: 'advanced',
      question: 'What are the trade-offs of aggressive code splitting?',
      answer: 'Too many tiny chunks cause many HTTP requests and waterfall latency, can hurt caching, and add runtime overhead fetching modules. Good splitting balances small initial payload against request count — split around routes and genuinely heavy/stable dependencies, and use prefetch/preload for likely-next chunks.',
      explanation: 'Senior signal: recognizing over-splitting and using prefetch to hide load latency.',
    },
    {
      level: 'senior',
      question: 'How do hashing and vendor chunking improve caching, and what can break it?',
      answer: 'Output files get content hashes; a chunk is re-fetched only when its content changes. Isolating stable vendor code in its own chunk lets browsers cache it across deploys. Caching breaks when shared modules cause unstable hashes (a small app change rehashing vendor), so you separate volatile app code from stable deps and keep manualChunks deterministic.',
      explanation: 'Senior signal: connecting content hashing, long-term caching, and chunk stability.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is defineAsyncComponent different from a lazy route import?',
    'What does "sideEffects": false in package.json do for tree shaking?',
    'How do prefetch and preload hints reduce lazy-load latency?',
    'Why is ESM more tree-shakable than CommonJS?',
    'How does Vite differ in dev (no bundling) vs production (Rollup)?',
    'When does over-splitting hurt performance?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Eagerly importing every route and heavy component into the main bundle.',
      why: 'It bloats the initial download and delays Time-to-Interactive even for pages the user never visits.',
      fix: 'Lazy-load routes with () => import(...) and heavy components with defineAsyncComponent.',
    },
    {
      mistake: 'Default-importing large libraries (full lodash, moment, whole icon sets).',
      why: 'It defeats tree shaking and can ship hundreds of KB you never use.',
      fix: 'Use ESM/per-function imports, smaller alternatives (date-fns/dayjs), or import only the icons you need.',
    },
    {
      mistake: 'Optimizing without measuring.',
      why: 'You may spend effort on the wrong thing while the real bloat hides in one dependency.',
      fix: 'Run a bundle analyzer first, fix the biggest contributors, and re-measure.',
    },
    {
      mistake: 'Over-splitting into dozens of tiny chunks.',
      why: 'Many small requests create network waterfalls and overhead that can be slower than a few right-sized chunks.',
      fix: 'Split around routes and large/stable deps; combine trivial chunks and use prefetch for likely-next routes.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vite', detail: 'Native ESM dev server plus Rollup production builds with automatic per-dynamic-import code splitting, esbuild minification, and configurable manualChunks.' },
    { area: 'Vue', detail: 'defineAsyncComponent and Vue Router lazy imports are the framework-level hooks that turn components/routes into separate chunks.' },
    { area: 'Nuxt', detail: 'Auto code-splitting per page/component, payload extraction, and built-in analyze tooling; islands/lazy hydration reduce shipped JS further.' },
    { area: 'Component library', detail: 'Libraries publish ESM, tree-shakable, side-effect-free builds (and per-component entry points) so consumers only bundle what they import.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Smaller initial bundle → faster load, parse, and Time-to-Interactive.',
      'Lazy chunks defer cost for rarely-visited routes and below-the-fold widgets.',
    ],
    bad: [
      'Over-splitting causes request waterfalls and overhead that can outweigh the savings.',
      'Unstable chunk hashes break long-term caching, forcing needless re-downloads.',
    ],
    optimizations: [
      'Lazy-load routes and heavy components via dynamic import.',
      'Use ESM, tree-shakable libraries and import only what you need.',
      'Isolate large, stable deps into cacheable vendor chunks; analyze with a visualizer.',
      'Add prefetch/preload hints and enable gzip/brotli compression.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vite-vue', 'async-components', 'lazy-loading-components'],
    nextConcepts: ['route-meta-lazy-loading', 'vue-performance-overview', 'project-structure', 'nuxt-overview'],
    dependencyNote:
      'Bundle optimization builds on understanding the Vite build (vite-vue) and async/lazy components, which are the mechanism behind code splitting. It connects to route-level lazy loading and overall performance strategy, and informs project structure and Nuxt deployment.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw src + node_modules feeding into the Rollup module graph.',
      'Show tree shaking dropping unused exports from the graph.',
      'Mark each dynamic import() as a split point producing a separate chunk.',
      'Draw the output: a small index chunk, a cached vendor chunk, and on-demand route/feature chunks.',
      'Conclude: "small critical path, defer the rest, drop the unused, cache the stable — measured with an analyzer."',
    ],
    diagram: `  src + deps ─► [ module graph ]
                  │ tree-shake (drop unused)
                  │ import() = split point
                  ▼
  index.js  | vendor.js(cached) | admin.[hash].js (on /admin)
                  │
            minify + gzip/brotli ─► small over the wire`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Bundle optimization keeps the JavaScript you ship small and well-timed. Lazy-load routes and heavy components with dynamic import() so they become separate chunks loaded on demand. Rely on ES modules so the bundler tree-shakes unused code, and import only the parts of libraries you actually use. Isolate large, stable dependencies into cacheable vendor chunks, minify and compress, and always analyze the bundle to find the real culprits. Avoid over-splitting into tiny chunks, which creates request waterfalls.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Bundle optimization is about shipping the least JavaScript necessary and at the right time, using the bundler\'s static analysis. In a Vue app the build is done by Vite, which uses native ES modules in dev and Rollup for production. There are a few core levers. First, code splitting: any dynamic import() becomes its own chunk that loads on demand. In practice that means lazy-loading routes with arrow-function imports in the router, and wrapping heavy components — charts, editors, modals — in defineAsyncComponent. This is the highest-impact, lowest-effort win because the initial bundle no longer carries pages and widgets the user may never reach. Second, tree shaking: because ES modules have static imports and exports, Rollup can prove which exports are never used and drop them, especially when libraries declare themselves side-effect-free. The flip side is that default-importing a big library like the full lodash or moment defeats this, so you import per-function from the ESM build, or pick a smaller alternative. Third, caching: output files are content-hashed, so a chunk is only re-fetched when it changes. Isolating large, stable dependencies into their own vendor chunk lets the browser cache them across deploys. Fourth, minification and gzip/brotli compression shrink what goes over the wire. The crucial discipline is to measure first: run a bundle analyzer like rollup-plugin-visualizer to see what is actually large — it is often one unexpected dependency or a duplicated version — then fix the biggest contributors and re-measure. And don\'t over-split: dozens of tiny chunks create request waterfalls, so you split around routes and genuinely heavy or stable dependencies, and use prefetch hints to hide the load latency of the likely-next route.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Smaller initial payload vs more network requests: aggressive splitting can introduce waterfalls.',
      'Caching stability vs convenience: hand-tuned manualChunks improve long-term caching but add config to maintain.',
      'Tiny hand-written utils avoid deps but add code to own; weigh against a tree-shaken library.',
    ],
    edgeCases: [
      'A shared module imported by many chunks can cause an unexpected common chunk and unstable hashes.',
      'CommonJS-only deps resist tree shaking and may need a pre-bundling/interop step.',
      'Dynamic import with a non-literal path can prevent static analysis and create overly broad chunks.',
      'Polyfills and a too-low build target can silently inflate the bundle.',
    ],
    runtimeBehavior: [
      'Lazy chunks are fetched at first use and cached; failed fetches need an error/loading state (async components support this).',
      'Prefetch/preload hints warm chunks before navigation to mask latency.',
      'Vite dev does not bundle, so dev behavior can differ from the production Rollup output — always test the build.',
    ],
    scalability: [
      'As an app grows, per-route splitting keeps each page\'s payload bounded regardless of total app size.',
      'A stable vendor/runtime chunk strategy keeps cache hit rates high across frequent deploys.',
    ],
    productionConcerns: [
      'Add bundle-size budgets/CI checks (chunkSizeWarningLimit, size-limit) to catch regressions.',
      'Watch for duplicate dependency versions inflating vendor chunks; dedupe in the lockfile.',
      'Handle async component load failures gracefully (retry, fallback) for flaky networks.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Code splitting = dynamic import() → separate on-demand chunk.',
    'Lazy routes: component: () => import(\'./View.vue\').',
    'Heavy components: defineAsyncComponent(() => import(...)).',
    'Tree shaking needs ESM static imports; avoid full-library default imports.',
    'Prefer date-fns/dayjs over moment; lodash-es per-function.',
    'Content hashing → chunk re-fetched only when changed.',
    'Isolate large stable deps into cacheable vendor chunks.',
    'Don\'t over-split: many tiny chunks = request waterfalls.',
    'Use prefetch/preload to mask lazy-load latency.',
    'Minify (esbuild) + gzip/brotli.',
    'Always analyze first (rollup-plugin-visualizer).',
    'Add CI size budgets to prevent regressions.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert an eagerly-imported route component into a lazy-loaded one.',
      hint: 'Replace the static import with an arrow-function dynamic import.',
      solution: {
        lang: 'ts',
        code: '// before: import Admin from \'./views/Admin.vue\'\nconst routes = [\n  { path: \'/admin\', component: () => import(\'./views/Admin.vue\') },\n]',
        explanation: [
          'The dynamic import makes Admin its own chunk.',
          'It loads only when the user visits /admin.',
          'The main bundle shrinks by the size of Admin and its deps.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Lazy-load a heavy chart component so it only downloads when shown.',
      hint: 'defineAsyncComponent + v-if.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, defineAsyncComponent } from \'vue\'\nconst Chart = defineAsyncComponent(() => import(\'./Chart.vue\'))\nconst show = ref(false)\n</script>\n\n<template>\n  <button @click="show = true">Show chart</button>\n  <Chart v-if="show" />\n</template>',
        explanation: [
          'Chart and its charting library are split into a separate chunk.',
          'The chunk downloads only when show becomes true.',
          'Initial load is faster for users who never open the chart.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A util import made the bundle jump. Rewrite a full-lodash import to be tree-shakable.',
      hint: 'Use the ESM build and import the single function.',
      solution: {
        lang: 'ts',
        code: '// before:\n// import _ from \'lodash\'\n// const d = _.cloneDeep(obj)\n\n// after (tree-shakable):\nimport cloneDeep from \'lodash-es/cloneDeep\'\nconst d = cloneDeep(obj)',
        explanation: [
          'lodash-es is ESM, so Rollup includes only cloneDeep and its deps.',
          'The default lodash import can pull in far more than one function.',
          'Re-running the analyzer confirms the chunk shrank.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Configure Vite to put echarts in its own cacheable chunk and report gzip sizes during build.',
      hint: 'manualChunks for echarts + a visualizer plugin.',
      solution: {
        lang: 'ts',
        code: 'import { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\nimport { visualizer } from \'rollup-plugin-visualizer\'\n\nexport default defineConfig({\n  plugins: [vue(), visualizer({ gzipSize: true })],\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks(id) {\n          if (id.includes(\'echarts\')) return \'charts\'\n          if (id.includes(\'node_modules\')) return \'vendor\'\n        },\n      },\n    },\n  },\n})',
        explanation: [
          'echarts gets its own long-term cacheable chunk separate from app code.',
          'Other node_modules go to a generic vendor chunk.',
          'The visualizer reports gzip sizes so you can verify the result.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Bundle optimization is where front-end performance meets tooling. Knowing it shows you care about real user-perceived speed and understand how modern build pipelines (Vite/Rollup, ESM) actually ship your app.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what code splitting and tree shaking are. Product companies (Zoho, Flipkart, Razorpay) ask how you would shrink a large bundle and lazy-load routes. FAANG-level interviews probe chunking/caching strategy, ESM tree-shaking internals, and analyzing/budgeting bundles in CI.',
    whatInterviewersExpect:
      'Explain dynamic-import code splitting (routes + async components), ESM tree shaking and how import style affects it, vendor chunking for caching, and the discipline of measuring with an analyzer before optimizing — plus the over-splitting trade-off.',
  },
}

export default bundleOptimization
