import type { ConceptLesson } from '../../../types/lesson'

const viteVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vite-vue',
  name: 'Vite for Vue',
  category: 'ecosystem',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Vite is the official, recommended build tool for Vue 3 — create-vue scaffolds it, so it is the environment you will actually develop in every day.',
    'It makes dev startup near-instant and hot updates feel immediate by serving native ES modules instead of bundling everything up front like Webpack did.',
    'Understanding Vite explains why the dev server is fast, how SFCs get compiled, how aliases and env vars work, and how the production build is optimised.',
    'Interviewers ask it to check you understand modern tooling — the difference between dev (esbuild + native ESM) and prod (Rollup bundling) is a frequent question.',
    'Misconfiguring Vite (env var prefixes, aliases, proxy) causes real day-one bugs, so knowing the config saves hours.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vite is like a restaurant that cooks each dish only when you order it, instead of cooking the whole menu before opening.',
    story: [
      'Imagine an old restaurant that, before serving anyone, cooks every single dish on the menu. Opening takes hours.',
      'A new restaurant opens instantly. When you order a specific dish, the chef cooks just that one, fast, and brings it out.',
      'If you change your mind about one item, only that one dish is re-cooked — not the whole kitchen.',
      'Vite works like the fast restaurant for your code: it starts instantly and only prepares the files your browser actually asks for. When you edit one file, only that piece is updated on screen.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vite is a tool that runs your Vue project while you build it and packages it up when you are done.',
    'During development it does not bundle your whole app first; modern browsers understand ES module imports, so Vite just serves files on demand, which makes starting up almost instant.',
    'When you edit a file, Vite swaps only that piece into the running page (hot module replacement) so you see changes immediately without a full reload.',
    'For production it uses Rollup to bundle, minify, and split your code so the final site loads fast for real users.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vite is a front-end build tool with two modes: a lightning-fast dev server that serves native ES modules (transpiling on demand with esbuild) and a production build powered by Rollup that bundles, tree-shakes, splits, and minifies your code.',
    how: 'In dev, Vite serves your index.html, and as the browser requests modules, Vite transforms them on the fly (compiling .vue SFCs, TS, JSX) using esbuild. HMR pushes individual module updates over a WebSocket. For prod, vite build runs Rollup to produce optimised, hashed, code-split assets.',
    why: 'Native-ESM dev means startup time does not grow with app size and updates are near-instant, dramatically improving developer experience versus bundle-everything-first tools. Rollup gives a highly optimised production bundle.',
    code: {
      label: 'Scaffolding and a minimal vite.config',
      lang: 'js',
      code: '// Create a Vue + Vite project:\n//   npm create vue@latest\n//   npm install && npm run dev\n\n// vite.config.ts\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig({\n  plugins: [vue()],          // enables .vue SFC compilation\n  server: { port: 5173 },     // dev server\n})',
      explanation: [
        'npm create vue@latest scaffolds a Vite-based Vue 3 project with sensible defaults.',
        '@vitejs/plugin-vue teaches Vite how to compile single-file components.',
        'npm run dev starts the fast dev server; npm run build produces the Rollup bundle.',
        'defineConfig gives type hints for the config object.',
        'Most apps need very little config — Vite ships great defaults.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vite is a build tool that decouples development and production concerns. In development it exploits native browser ES modules: it serves source files unbundled, transforming each requested module on demand with esbuild (which is written in Go and 10-100x faster than JS-based transpilers), and pushes granular updates via Hot Module Replacement over WebSocket. Dependencies are pre-bundled once with esbuild to CommonJS-to-ESM and to reduce request waterfalls. For production it bundles with Rollup, applying tree-shaking, code-splitting, asset hashing, and minification. The @vitejs/plugin-vue plugin integrates the Vue SFC compiler so .vue files are compiled to render functions.',

  // 7. Internal Working
  internalWorking: [
    'On vite dev start, Vite scans entry points and pre-bundles bare-module dependencies (node_modules) with esbuild into optimised ESM, caching them in node_modules/.vite to avoid many small requests.',
    'It starts a dev server serving index.html; the browser then requests modules via native <script type="module"> import chains.',
    'For each requested module, Vite transforms it on demand: .vue files go through the Vue SFC compiler (split into template/script/style), .ts is transpiled by esbuild — only the files actually imported are processed.',
    'HMR works by tracking the module graph; when a file changes, Vite computes the minimal affected boundary and sends an update over WebSocket so only that module (and its accepting parents) re-execute, preserving app state where possible.',
    'For vite build, Rollup statically analyses the import graph to tree-shake dead code, split shared/dynamic-import chunks, hash filenames for caching, and minify — producing the deployable dist/.',
    'Environment variables are loaded from .env files; only those prefixed with VITE_ are exposed to client code via import.meta.env to avoid leaking secrets.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  DEV (native ESM, esbuild)            BUILD (Rollup)\n  browser ──import App.vue──► Vite      source graph\n           ◄── compiled module ──        │ tree-shake\n           ──import Comp.vue──►           │ code-split\n           ◄── compiled on demand         │ hash + minify\n                                          ▼\n  edit file → HMR over WS               dist/ (optimised bundle)\n  → only that module updates            assets-[hash].js\n\n  KEY: dev = no bundle, on-demand + fast HMR\n       build = full Rollup bundle for users',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — env variables',
      lang: 'js',
      code: '// .env\n// VITE_API_URL=https://api.example.com\n// SECRET_KEY=do-not-expose   (NOT exposed: no VITE_ prefix)\n\n// usage in code\nconst base = import.meta.env.VITE_API_URL\nconst isDev = import.meta.env.DEV   // built-in boolean\nconsole.log(base, isDev)',
      explanation: [
        'Only variables prefixed VITE_ are exposed to client code via import.meta.env.',
        'This prevents accidentally shipping server secrets to the browser.',
        'import.meta.env.DEV / PROD are built-in mode booleans.',
        'Different .env files (.env.production) load per build mode.',
      ],
    },
    intermediate: {
      label: 'Intermediate — alias + dev proxy',
      lang: 'js',
      code: '// vite.config.ts\nimport { fileURLToPath, URL } from \'node:url\'\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig({\n  plugins: [vue()],\n  resolve: {\n    alias: { \'@\': fileURLToPath(new URL(\'./src\', import.meta.url)) },\n  },\n  server: {\n    proxy: { \'/api\': \'http://localhost:3000\' }, // avoid CORS in dev\n  },\n})',
      explanation: [
        'The @ alias lets you import @/components/Button.vue instead of long relative paths.',
        'The proxy forwards /api requests to a backend, sidestepping CORS during development.',
        'Aliases must be mirrored in tsconfig paths for TypeScript to resolve them.',
        'Proxy config only affects dev; production uses real URLs or a server.',
        'These two settings cover the most common day-one configuration needs.',
      ],
    },
    advanced: {
      label: 'Advanced — manual chunking and dynamic import',
      lang: 'js',
      code: '// Lazy-load a heavy view → its own chunk automatically\nconst Editor = () => import(\'@/views/EditorView.vue\')\n\n// vite.config.ts — split vendor libs for better caching\nexport default {\n  build: {\n    rollupOptions: {\n      output: {\n        manualChunks: {\n          vendor: [\'vue\', \'vue-router\', \'pinia\'],\n        },\n      },\n    },\n  },\n}',
      explanation: [
        'Dynamic import() makes Rollup emit a separate chunk loaded only when needed.',
        'manualChunks groups stable vendor libraries so they cache across deploys.',
        'Smaller, well-split chunks improve first-paint and long-term browser caching.',
        'Rollup tree-shakes unused exports from each chunk automatically.',
        'Analyse with rollup-plugin-visualizer to find oversized chunks.',
      ],
    },
    realProject: {
      label: 'Real project — full create-vue style config',
      lang: 'js',
      code: '// vite.config.ts in a production app\nimport { fileURLToPath, URL } from \'node:url\'\nimport { defineConfig, loadEnv } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig(({ mode }) => {\n  const env = loadEnv(mode, process.cwd(), \'\')\n  return {\n    plugins: [vue()],\n    resolve: { alias: { \'@\': fileURLToPath(new URL(\'./src\', import.meta.url)) } },\n    server: { port: 5173, proxy: { \'/api\': env.API_TARGET } },\n    build: { sourcemap: mode !== \'production\', target: \'es2018\' },\n  }\n})',
      explanation: [
        'The functional config form gives access to mode to vary settings per environment.',
        'loadEnv reads .env files so config (like the proxy target) can be environment-driven.',
        'sourcemaps are enabled outside production for debugging, off in prod to slim assets.',
        'build.target sets the JS syntax level for the output bundle.',
        'This is close to what a real team ships: env-aware, aliased, proxied, and tuned.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Vite and why is it used with Vue?',
      answer: 'Vite is the official build tool for Vue 3. It provides a fast dev server based on native ES modules and a Rollup-powered production build. create-vue scaffolds Vite projects by default.',
      explanation: 'A good answer names both the dev server and the production build, and mentions it is the recommended/official tool.',
    },
    {
      level: 'beginner',
      question: 'Why is the Vite dev server so fast to start?',
      answer: 'It does not bundle the whole app first. It serves source as native ES modules and transforms each file on demand with esbuild (a fast Go-based tool), so startup time does not grow with app size.',
      explanation: 'Tests understanding of native ESM and on-demand transformation versus bundle-first tools.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between how Vite handles dev and production?',
      answer: 'In dev it serves unbundled native ESM with esbuild transforms and HMR. In production it bundles with Rollup, applying tree-shaking, code-splitting, hashing, and minification — because shipping hundreds of unbundled modules to real users would be slow.',
      explanation: 'A senior signal is knowing the two different engines (esbuild for dev/deps, Rollup for the prod bundle) and why each is chosen.',
    },
    {
      level: 'intermediate',
      question: 'How do environment variables work in Vite, and what is the security implication?',
      answer: 'Variables in .env files are loaded by mode; only those prefixed VITE_ are exposed to client code via import.meta.env. The prefix rule prevents leaking server secrets into the browser bundle.',
      explanation: 'Demonstrates awareness of the VITE_ prefix and that anything exposed ends up in client JS.',
    },
    {
      level: 'advanced',
      question: 'What is dependency pre-bundling and why does Vite do it?',
      answer: 'Vite uses esbuild to pre-bundle bare-module dependencies from node_modules into optimised ESM once, cached in node_modules/.vite. This converts CommonJS to ESM and collapses packages with many internal modules into few requests, avoiding a request waterfall in the browser.',
      explanation: 'Shows deep understanding of why Vite stays fast despite native ESM having a per-request cost.',
    },
    {
      level: 'senior',
      question: 'How would you optimise a Vite production build for a large Vue app?',
      answer: 'Lazy-load routes/heavy components via dynamic import for automatic code-splitting, use manualChunks to isolate stable vendor libs for caching, analyse bundles with a visualizer, set an appropriate build.target, enable compression, and prune large dependencies. Rely on Rollup tree-shaking by avoiding side-effectful barrels.',
      explanation: 'Senior answers cover code-splitting, chunking strategy, measurement, and tree-shaking pitfalls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does Vite differ from Webpack and Vue CLI?',
    'What does @vitejs/plugin-vue actually do?',
    'How does HMR preserve component state during edits?',
    'When would you write a custom Vite plugin?',
    'How do you set up a dev proxy to avoid CORS?',
    'How do import.meta.env.DEV/PROD/MODE differ?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting non-VITE_ env variables to be available in client code.',
      why: 'Only VITE_-prefixed variables are exposed via import.meta.env; others are undefined in the browser.',
      fix: 'Prefix client-needed variables with VITE_, and keep secrets server-side only.',
    },
    {
      mistake: 'Setting an alias in vite.config but not tsconfig.',
      why: 'The build resolves it but TypeScript and the editor do not, breaking types and autocomplete.',
      fix: 'Mirror the alias in tsconfig paths as well.',
    },
    {
      mistake: 'Assuming dev behaviour equals production behaviour.',
      why: 'Dev serves unbundled ESM; prod is a Rollup bundle, so tree-shaking and chunking issues only appear after vite build.',
      fix: 'Test with vite build && vite preview before deploying.',
    },
    {
      mistake: 'Importing huge libraries eagerly and never code-splitting.',
      why: 'Everything lands in the initial chunk, bloating first load.',
      fix: 'Use dynamic import() for routes/heavy components and manualChunks for vendors.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'create-vue scaffolds Vite + @vitejs/plugin-vue as the default; vite dev and vite build are the standard scripts.' },
    { area: 'Nuxt', detail: 'Nuxt 3 uses Vite as its default bundler under the hood, layering its own conventions and server engine (Nitro) on top.' },
    { area: 'Component library', detail: 'Libraries use Vite\'s library mode (build.lib) to output ESM/UMD bundles with externalised peer deps like vue.' },
    { area: 'SSR', detail: 'Vite provides an SSR build mode and middleware mode used by frameworks to render Vue on the server and hydrate on the client.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Native-ESM dev start is near-instant and independent of app size.',
      'esbuild transforms and dependency pre-bundling keep HMR updates fast.',
    ],
    bad: [
      'Eager imports of large libraries inflate the initial production chunk.',
      'Many small unbundled modules can cause request waterfalls in dev for non-pre-bundled local code.',
    ],
    optimizations: [
      'Lazy-load routes and heavy components with dynamic import() for automatic chunking.',
      'Use manualChunks to isolate stable vendor code for better long-term caching.',
      'Profile the bundle with rollup-plugin-visualizer and trim large dependencies.',
      'Avoid side-effectful barrel files so Rollup tree-shaking stays effective.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['single-file-components', 'what-is-vue', 'template-compilation'],
    nextConcepts: ['project-structure', 'bundle-optimization', 'lazy-loading-components', 'typescript-with-vue'],
    dependencyNote:
      'Vite is the tooling layer beneath SFCs and template compilation. Knowing it underpins project structure, bundle optimisation, and lazy loading. Understand SFCs first, then how Vite compiles and bundles them.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Split the board into DEV and BUILD columns.',
      'DEV: browser requests modules → Vite transforms on demand with esbuild → HMR over WebSocket.',
      'Note dependency pre-bundling with esbuild caches node_modules into .vite.',
      'BUILD: Rollup tree-shakes, code-splits, hashes, minifies into dist/.',
      'Conclude: "Fast dev from native ESM, optimised prod from Rollup; only VITE_ env vars reach the client."',
    ],
    diagram: '  DEV                              BUILD\n  browser ⇄ Vite (esbuild)         Rollup\n   import .vue/.ts on demand        ├ tree-shake\n   HMR over WS (granular)           ├ code-split\n   deps pre-bundled → .vite         ├ hash + minify\n                                    ▼\n                                  dist/\n  fast start, instant updates      optimised for users',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vite is Vue 3\'s official build tool with two modes. In dev it serves native ES modules and transforms each file on demand with esbuild, with granular HMR — so startup is near-instant regardless of app size. It pre-bundles node_modules with esbuild to avoid request waterfalls. For production it switches to Rollup, which tree-shakes, code-splits, hashes, and minifies into dist/. Only VITE_-prefixed env vars reach client code via import.meta.env. Optimise prod with dynamic import() chunking and manualChunks for vendors.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vite is the official build tool for Vue 3, and create-vue scaffolds it by default. Its big idea is to treat development and production completely differently. In development, instead of bundling your whole app before the server even starts — which is what older tools like Webpack did and which got slower as your app grew — Vite leans on the fact that modern browsers natively understand ES module imports. So it serves your source files unbundled, and as the browser requests each module, Vite transforms it on demand using esbuild, a Go-based tool that is many times faster than JavaScript transpilers. The result is a dev server that starts almost instantly no matter how big the app is, with hot module replacement that updates only the changed module over a WebSocket, often preserving state. To stop native ESM from causing a flood of tiny requests for library code, Vite pre-bundles your node_modules dependencies once with esbuild and caches them. For production, native unbundled modules would be too slow for real users, so Vite switches engines and bundles with Rollup, which tree-shakes dead code, splits code into chunks, hashes filenames for caching, and minifies everything into a dist folder. A couple of practical things to know: only environment variables prefixed with VITE_ are exposed to client code through import.meta.env, which protects you from leaking secrets, and aliases like @ pointing to src must be configured in both vite.config and tsconfig. The Vue integration comes from the @vitejs/plugin-vue plugin, which runs the SFC compiler so your .vue files become render functions. When optimising a large app, I lazy-load routes with dynamic import for automatic code-splitting and use manualChunks to isolate stable vendor libraries for better caching.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'esbuild for dev/deps is blazing fast but less configurable than Rollup; Vite uses Rollup for prod where flexibility and tree-shaking matter.',
      'Native ESM dev avoids bundling cost but needs dependency pre-bundling to avoid request waterfalls.',
      'Two different pipelines (esbuild dev vs Rollup build) means dev behaviour can differ subtly from prod.',
    ],
    edgeCases: [
      'CommonJS-only dependencies must be pre-bundled or interop-shimmed to work as ESM.',
      'Dynamic import paths must be statically analysable for Rollup to chunk them.',
      'Env var leakage: anything VITE_-prefixed ends up in the client bundle, including in source maps.',
      'SSR builds use a separate entry and externalise dependencies differently.',
    ],
    runtimeBehavior: [
      'HMR tracks the module graph and propagates updates to the nearest accepting boundary, preserving state where possible.',
      'Pre-bundled deps are cached in node_modules/.vite and invalidated on lockfile/config change.',
      'Rollup statically resolves imports at build time to tree-shake and split chunks.',
    ],
    scalability: [
      'Dev performance stays flat as apps grow because transformation is on demand.',
      'Production scaling depends on chunking strategy: good manualChunks and route splitting keep initial load proportional to usage.',
    ],
    productionConcerns: [
      'Always test with vite build + vite preview, since tree-shaking and chunk issues surface only in the prod bundle.',
      'Monitor chunk sizes; a stray eager import can bloat the entry chunk.',
      'Keep secrets out of VITE_ vars and source maps to avoid leaking them to clients.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Vite = official Vue 3 build tool (npm create vue@latest).',
    'Dev: native ESM + esbuild transforms + granular HMR → instant start.',
    'Deps pre-bundled with esbuild, cached in node_modules/.vite.',
    'Build: Rollup tree-shakes, code-splits, hashes, minifies → dist/.',
    '@vitejs/plugin-vue runs the SFC compiler.',
    'Only VITE_-prefixed env vars reach client via import.meta.env.',
    'import.meta.env.DEV / PROD / MODE are built in.',
    'Mirror @ alias in vite.config AND tsconfig.',
    'server.proxy avoids CORS in dev.',
    'Optimise with dynamic import() chunks + manualChunks for vendors.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show how to read an API base URL from an env var in a Vite + Vue app, and name the env file rule.',
      hint: 'Use the VITE_ prefix and import.meta.env.',
      solution: {
        lang: 'js',
        code: '// .env\n// VITE_API_URL=https://api.example.com\n\nconst baseURL = import.meta.env.VITE_API_URL',
        explanation: [
          'Only VITE_-prefixed variables are exposed to client code.',
          'Non-prefixed variables stay server-only and are undefined in the browser.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Configure a dev proxy so calls to /api hit a backend on localhost:3000 without CORS errors.',
      hint: 'Use server.proxy in vite.config.',
      solution: {
        lang: 'js',
        code: '// vite.config.ts\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig({\n  plugins: [vue()],\n  server: { proxy: { \'/api\': \'http://localhost:3000\' } },\n})',
        explanation: [
          'The dev server forwards /api requests to the backend, so the browser sees same-origin.',
          'This only applies in dev; production must use a real URL or server config.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Split Vue/router/pinia into a cached vendor chunk and lazy-load a heavy view.',
      hint: 'Combine dynamic import() with rollupOptions.manualChunks.',
      solution: {
        lang: 'js',
        code: '// route\nconst Reports = () => import(\'@/views/ReportsView.vue\')\n\n// vite.config.ts\nexport default {\n  build: {\n    rollupOptions: {\n      output: { manualChunks: { vendor: [\'vue\', \'vue-router\', \'pinia\'] } },\n    },\n  },\n}',
        explanation: [
          'The dynamic import emits ReportsView as its own chunk, loaded on demand.',
          'manualChunks isolates stable vendor libs so they cache across deploys.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with a config snippet, how you would vary settings between dev and production builds.',
      hint: 'Use the functional defineConfig form with mode and loadEnv.',
      solution: {
        lang: 'js',
        code: 'import { defineConfig, loadEnv } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig(({ mode }) => {\n  const env = loadEnv(mode, process.cwd(), \'\')\n  return {\n    plugins: [vue()],\n    build: { sourcemap: mode !== \'production\' },\n    server: { proxy: { \'/api\': env.API_TARGET } },\n  }\n})',
        explanation: [
          'The functional form exposes mode so config differs per environment.',
          'loadEnv reads .env files so values like the proxy target are environment-driven, and sourcemaps are disabled in production.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Vite is the environment you live in every day as a Vue developer, so understanding it signals practical, current knowledge rather than outdated Webpack-era thinking. Explaining the dev-vs-build split cleanly is an easy way to sound senior on tooling.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what Vite is and how to run/build a project. Product companies (Zoho, Flipkart, Razorpay) ask about dev-vs-prod pipelines, env vars, proxies, and code-splitting. FAANG-level rounds probe dependency pre-bundling, HMR internals, and bundle optimisation strategy.',
    whatInterviewersExpect:
      'They expect you to identify Vite as Vue\'s official tool, explain native-ESM dev with esbuild and HMR versus Rollup production bundling, know the VITE_ env-var rule, and describe code-splitting and chunking for performance.',
  },
}

export default viteVue
