import type { ConceptLesson } from '../../../types/lesson'

const bundlersModuleResolution: ConceptLesson = {
  // 1. Concept Summary
  slug: 'bundlers-module-resolution',
  name: 'Bundlers & Resolution',
  category: 'modules',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Bundlers (Vite, webpack, Rollup, esbuild) turn your many modules into optimized assets the browser can actually load efficiently — they are the backbone of every modern frontend build.',
    'Module resolution is the algorithm that turns an import specifier like `lodash` or `@/utils` into a real file on disk — and getting it wrong causes "Cannot find module" and "works on my machine" bugs.',
    'Understanding resolution explains aliases, the package.json `exports`/`main`/`module` fields, conditional exports, and why a dependency resolves to CJS in one tool and ESM in another.',
    'Bundlers are where tree shaking, code splitting, minification, and transforms (TS/JSX) actually happen — so this concept ties the whole modules track together.',
    'Interviewers use it to gauge whether you understand the build pipeline, not just application code — a strong senior signal.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A bundler is a chef who gathers ingredients from many cupboards and cooks one ready-to-serve meal.',
    story: [
      'Imagine you want to cook a big dinner, but the ingredients are scattered across many cupboards, the fridge, and the garden.',
      'A chef goes around, finds every ingredient by following your recipe, figures out exactly where each one lives, and gathers them all.',
      'Then the chef trims off the bits nobody will eat, cooks everything, and plates a neat meal ready to serve.',
      'A bundler does this with code: it follows your imports, finds where each file really lives (that\'s "resolution"), removes unused parts, and packages everything into a few tidy files the browser can load fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Your app is made of many small code files that import each other and use outside libraries.',
    'Browsers can technically load modules one by one, but doing that for thousands of files would be slow.',
    'A bundler reads your imports, figures out which exact file each import points to (called module resolution), and combines and optimizes them into a few files.',
    'It also does helpful jobs like removing unused code, splitting big apps into loadable pieces, and converting newer syntax so older browsers understand it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A bundler is a build tool that constructs the module graph from your entry points, resolves every import specifier to a file, applies transforms and optimizations, and emits optimized output. Module resolution is the specific step of mapping a specifier (relative path, bare package name, or alias) to an actual module.',
    how: 'When the bundler sees `import x from "lib"`, the resolver checks if it is relative (`./`), an alias (`@/`), or a bare specifier (a package). For packages it looks in `node_modules`, reads the package.json `exports`/`module`/`main` fields and conditions (`import`/`require`/`browser`), and tries extensions. Once the whole graph is resolved, the bundler tree-shakes, splits, transforms, and minifies.',
    why: 'Without bundling, you ship a slow waterfall of raw modules and unprocessed syntax; with it you get small, fast, browser-ready assets — and understanding resolution stops the most common "module not found" failures.',
    code: {
      label: 'Resolving different specifier kinds',
      lang: 'js',
      code: `import './styles.css'           // relative → ./styles.css\nimport Button from '@/ui/Button' // alias → src/ui/Button.(vue|ts|js)\nimport { debounce } from 'lodash-es' // bare → node_modules/lodash-es (exports field)\n\n// vite.config.js maps the alias\n// resolve: { alias: { '@': '/src' } }`,
      explanation: [
        'A relative specifier (`./styles.css`) resolves directly against the importing file\'s folder.',
        'An alias (`@/ui/Button`) is rewritten by config to a real path, then extensions are tried.',
        'A bare specifier (`lodash-es`) is looked up in node_modules using package.json fields.',
        'The bundler config (here Vite) defines aliases and resolution behavior.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A bundler ingests entry modules, recursively resolves every import specifier into concrete modules to build a dependency graph, applies loaders/transforms (TypeScript, JSX, CSS), then performs optimizations — tree shaking, scope hoisting, code splitting, and minification — and emits bundled, often content-hashed assets. Module resolution is the algorithm that maps a specifier to a file: relative/absolute paths resolve against the filesystem with extension and index trials; bare specifiers resolve through node_modules directory walking using the package.json `exports` map (with conditions like `import`, `require`, `browser`, `node`, `default`), falling back to `module`/`main`; and aliases/path mappings (tsconfig `paths`, bundler `alias`) rewrite specifiers first. Resolution conditions and field priority determine whether a dependency loads as ESM or CJS, which in turn affects tree shaking.',

  // 7. Internal Working
  internalWorking: [
    'ENTRY + GRAPH: the bundler starts from configured entry points and parses each module to extract its import/require specifiers.',
    'RESOLUTION: for each specifier the resolver classifies it — relative/absolute (filesystem walk with extension + index trials), alias/path-mapping (rewrite via config/tsconfig paths), or bare package (walk up node_modules).',
    'PACKAGE FIELDS: for packages it reads package.json and applies the `exports` map with active conditions (e.g. `import` vs `require`, `browser` vs `node`, `development` vs `production`), falling back to `module` then `main` if no `exports`.',
    'TRANSFORM: resolved modules pass through loaders/plugins (TS→JS, JSX, CSS modules, asset imports), producing standard JS the graph can link.',
    'OPTIMIZE: with the full graph known, the bundler tree-shakes unused exports, hoists scopes, splits dynamic-import boundaries into chunks, and deduplicates shared modules.',
    'EMIT: it minifies and writes content-hashed chunks plus a manifest/runtime that wires chunk loading; dev servers (Vite) skip bundling and serve native ESM with on-demand transforms instead.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  entry.js
    │ import 'lib'  import '@/x'  import './y'
    ▼  RESOLVER classifies each specifier
  ┌──────────────── resolution ─────────────────┐
  │ './y'   → filesystem (try .ts/.js/index)     │
  │ '@/x'   → alias rewrite → /src/x → file       │
  │ 'lib'   → node_modules → package.json:         │
  │            exports[import|require|browser]     │
  │            else module → else main             │
  └────────────────────────────────────────────────┘
    │ build full graph
    ▼ transform (TS/JSX/CSS) → tree-shake → split → minify
  [ chunk-a.[hash].js ] [ chunk-b.[hash].js ] + manifest`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — package.json fields the resolver reads',
      lang: 'js',
      code: `// a dependency's package.json\n{\n  "name": "lib",\n  "main": "./dist/index.cjs",   // legacy CJS fallback\n  "module": "./dist/index.mjs",  // bundler-preferred ESM (tree-shakeable)\n  "exports": {\n    ".": {\n      "import": "./dist/index.mjs",\n      "require": "./dist/index.cjs"\n    }\n  }\n}`,
      explanation: [
        '`exports` is the modern, authoritative entry map and takes priority when present.',
        'Conditions (`import`/`require`) route ESM vs CJS consumers to the right file.',
        '`module` is a bundler convention pointing at the ESM build for tree shaking.',
        '`main` is the legacy fallback used when `exports`/`module` are absent.',
      ],
    },
    intermediate: {
      label: 'Intermediate — aliases and tsconfig paths',
      lang: 'js',
      code: `// tsconfig.json\n{ "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["src/*"] } } }\n\n// vite.config.ts (bundler must mirror the alias)\nexport default { resolve: { alias: { '@': '/src' } } }\n\n// usage\nimport { api } from '@/services/api' // → src/services/api.ts`,
      explanation: [
        '`tsconfig paths` makes TypeScript understand the alias for type checking.',
        'The bundler needs its OWN alias config — TS paths alone do not affect runtime resolution.',
        'A mismatch between the two is a classic "types pass but build fails" bug.',
        'The alias is rewritten before normal filesystem resolution runs.',
      ],
    },
    advanced: {
      label: 'Advanced — conditional exports and the dual-package gotcha',
      lang: 'js',
      code: `{\n  "name": "lib",\n  "exports": {\n    ".": {\n      "browser": "./dist/browser.mjs",\n      "node": "./dist/node.mjs",\n      "import": "./dist/index.mjs",\n      "require": "./dist/index.cjs",\n      "default": "./dist/index.mjs"\n    },\n    "./feature": "./dist/feature.mjs"  // subpath export\n  }\n}`,
      explanation: [
        'Conditions are matched in order; `browser`/`node` let one package ship different code per environment.',
        '`default` is the fallback when no other condition matches.',
        'Subpath exports (`./feature`) expose specific entry points while hiding internal files.',
        'If both `import` and `require` builds get loaded in one app you hit the dual-package hazard (duplicated module state).',
      ],
    },
    realProject: {
      label: 'Real project — Vite dev vs build, and code splitting',
      lang: 'js',
      code: `// Vite DEV: no bundling — serves native ESM, transforms on demand (fast HMR)\n// Vite BUILD: uses Rollup to bundle, tree-shake, and split\n\n// route-level split → separate chunk via dynamic import\nconst routes = [\n  { path: '/admin', component: () => import('@/views/Admin.vue') }\n]\n// build output: assets/Admin.[hash].js loaded only when visiting /admin`,
      explanation: [
        'In development Vite skips bundling and serves modules natively for instant startup and HMR.',
        'For production it bundles with Rollup, resolving the full graph and optimizing it.',
        'Dynamic imports define split points, so the resolver/bundler emits separate hashed chunks.',
        'Content hashes in filenames enable long-term caching; only changed chunks invalidate.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does a bundler do?',
      answer: 'It builds a dependency graph from entry points, resolves and combines all modules, applies transforms (TS/JSX/CSS), optimizes (tree shaking, splitting, minification), and emits browser-ready assets.',
      explanation: 'A good answer separates the graph/resolution step from the optimization/emit step.',
    },
    {
      level: 'beginner',
      question: 'What is module resolution?',
      answer: 'The process of mapping an import specifier (relative path, alias, or bare package name) to an actual file on disk, using filesystem rules and package.json fields.',
      explanation: 'Mentioning the three specifier kinds shows concrete understanding.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between the `main`, `module`, and `exports` fields in package.json?',
      answer: '`main` is the legacy default entry (usually CJS). `module` is a bundler convention pointing at the ESM build for tree shaking. `exports` is the modern, authoritative map that can define conditions and subpaths and, when present, takes priority and can restrict which files are importable.',
      explanation: 'This tests real packaging knowledge and field priority.',
    },
    {
      level: 'intermediate',
      question: 'Why do you need to set an alias in BOTH tsconfig and the bundler config?',
      answer: 'tsconfig `paths` only tells TypeScript how to resolve types for checking; it does not affect runtime resolution. The bundler needs its own alias so the actual build resolves the same path — otherwise type checks pass but the build fails.',
      explanation: 'A frequent real-world gotcha that signals hands-on experience.',
    },
    {
      level: 'advanced',
      question: 'How do conditional exports decide whether a package loads as ESM or CJS?',
      answer: 'The resolver evaluates the `exports` conditions in order against the active environment (`import` vs `require`, `browser` vs `node`, `development` vs `production`), picking the first match and falling back to `default`. This choice determines the file loaded and thus the module format.',
      explanation: 'Senior signal: connecting conditions to format selection and downstream tree shaking.',
    },
    {
      level: 'senior',
      question: 'Why does Vite not bundle in development but does in production?',
      answer: 'In dev it serves native ES modules with on-demand transforms, giving near-instant startup and fast HMR without rebuilding the whole graph. For production it bundles (via Rollup) to avoid request waterfalls and to apply tree shaking, splitting, and minification for optimal load performance.',
      explanation: 'Shows understanding of the dev/prod tradeoff and why both strategies exist.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do esbuild, Rollup, and webpack differ in speed and capability?',
    'What happens during resolution when a bare specifier has no `exports` field?',
    'How does the resolver try file extensions and index files?',
    'What is scope hoisting and how does it help bundle size/perf?',
    'How do content hashes in filenames enable caching across deploys?',
    'How does resolution differ between Node\'s runtime resolver and a bundler\'s?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Setting a path alias in tsconfig but not in the bundler config.',
      why: 'TS `paths` only affects type checking, not runtime resolution, so the build cannot find the module.',
      fix: 'Mirror the alias in the bundler (Vite `resolve.alias`, webpack `resolve.alias`) or use a plugin that reads tsconfig paths.',
    },
    {
      mistake: 'Assuming a package will load as ESM when its `exports` routes `require` to CJS.',
      why: 'The active condition (import/require) picks the file; getting CJS silently disables tree shaking.',
      fix: 'Check the package\'s `exports` conditions and ensure the bundler resolves the `import`/`module` ESM entry.',
    },
    {
      mistake: 'Relying on automatic extension resolution for browser-native ESM.',
      why: 'Native browsers require explicit extensions; only bundlers/Node add them, so behavior diverges.',
      fix: 'Include extensions for browser-native code, or always go through a bundler that normalizes resolution.',
    },
    {
      mistake: 'Over-configuring or fighting the resolver instead of following conventions.',
      why: 'Custom resolution hacks break upgrades and confuse other tools (IDE, test runner).',
      fix: 'Prefer standard `exports`/aliases and keep tsconfig, bundler, and test configs consistent.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vite (Rollup under the hood) resolves SFCs, aliases (`@`), and ESM deps; dev serves native modules with HMR while build tree-shakes and splits routes into hashed chunks.' },
    { area: 'React', detail: 'webpack/Vite resolve JSX/TS, node_modules packages, and aliases; code splitting via dynamic import and content hashing power caching and fast loads.' },
    { area: 'Node.js', detail: 'Node\'s own resolver honors `exports`/conditions; bundlers (esbuild/Rollup) bundle server code for serverless to cut cold-start size and resolve deps deterministically.' },
    { area: 'Backend', detail: 'Monorepos rely on consistent `exports` maps and workspace resolution so internal packages resolve the same way across services and tools.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Bundling avoids request waterfalls and enables tree shaking, splitting, and minification for fast loads.',
      'Content-hashed chunks enable aggressive long-term caching, so unchanged code is not re-downloaded.',
    ],
    bad: [
      'Poor split boundaries or huge vendor chunks slow initial load.',
      'Misconfigured resolution can pull CJS builds that defeat tree shaking and bloat output.',
    ],
    optimizations: [
      'Split at route/feature boundaries and dedupe shared vendor code into stable chunks.',
      'Ensure the resolver prefers ESM (`exports.import`/`module`) so tree shaking works.',
      'Use a fast transformer (esbuild) for dev and Rollup-grade optimization for prod (as Vite does).',
      'Keep filenames content-hashed and configure caching headers for immutable chunks.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Resolution can pull transitive dependencies whose code runs at build and/or runtime — a supply-chain risk.',
      'Misconfigured aliases or loose resolution can accidentally include sensitive or unintended files in a bundle.',
    ],
    bestPractices: [
      'Use lockfiles, integrity hashes, and audits since the resolver pulls in (and bundles) third-party code.',
      'Restrict what packages expose via `exports` subpaths to avoid leaking internal modules.',
      'Avoid bundling secrets/env files; scope env exposure (e.g. Vite\'s `VITE_` prefix) and review the output.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'esm-vs-cjs', 'commonjs'],
    nextConcepts: ['tree-shaking', 'code-splitting-lazy-loading', 'dynamic-imports', 'circular-dependencies'],
    dependencyNote:
      'Bundlers and resolution sit on top of es-modules and esm-vs-cjs (and commonjs), since resolution picks the module format. They are the machinery behind tree-shaking, code-splitting-lazy-loading, and dynamic-imports, and they surface circular-dependencies during graph construction.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an entry file with three imports: a relative path, an alias, a bare package.',
      'Draw the RESOLVER box and show each specifier taking a different path.',
      'For the package, draw package.json with `exports`/`module`/`main` and pick by condition.',
      'After the graph, draw the pipeline: transform → tree-shake → split → minify → hashed chunks.',
      'Say: "resolution maps specifiers to files; the bundler then optimizes the graph".',
      'Add: "dev (Vite) serves native ESM; prod bundles with Rollup".',
    ],
    diagram: `  entry → [ RESOLVER ]
   './y'  → fs walk (.ts/.js/index)
   '@/x'  → alias → /src/x
   'lib'  → node_modules → exports[cond] / module / main
        │ build graph
        ▼ transform → tree-shake → split → minify
   chunk-a.[hash].js  chunk-b.[hash].js  + manifest`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A bundler builds the module graph from entry points, resolves every import to a real file, transforms (TS/JSX/CSS), then tree-shakes, splits, and minifies into optimized hashed assets. Module resolution maps a specifier — relative path, alias, or bare package — to a file, using filesystem trials and the package.json `exports`/`module`/`main` fields with conditions (import/require/browser/node). That condition choice decides ESM vs CJS, which affects tree shaking. Vite serves native ESM in dev and bundles with Rollup for production.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A bundler is the build tool that turns your many small modules into a few optimized assets the browser can load efficiently. It starts from your entry points, parses each module to find its imports, and resolves every specifier into a concrete file to build the full dependency graph. Module resolution is that mapping step, and it handles three kinds of specifiers: relative paths resolve against the filesystem with extension and index trials; aliases or tsconfig path mappings get rewritten first; and bare package names are looked up in node_modules, where the resolver reads the package.json `exports` map and its conditions — like `import` versus `require`, or `browser` versus `node` — falling back to the `module` and then `main` fields. That condition choice is important because it decides whether a dependency loads as ESM or CommonJS, which in turn determines whether it can be tree-shaken. Once the graph is resolved, the bundler runs transforms — TypeScript, JSX, CSS — and then optimizations: tree shaking to drop dead code, scope hoisting, code splitting at dynamic-import boundaries, and minification, finally emitting content-hashed chunks with a runtime manifest. A practical detail is that modern tools like Vite split strategies by environment: in development they serve native ES modules with on-demand transforms for instant startup and fast HMR, while for production they bundle with Rollup to avoid request waterfalls and apply full optimization. Common pitfalls include setting an alias in tsconfig but not the bundler, and accidentally resolving a CJS build that silently disables tree shaking.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Dev speed (unbundled native ESM, esbuild transforms) vs prod optimization (full Rollup bundling) — different tools for different goals.',
      'Aggressive code splitting (smaller initial load) vs more requests/waterfalls — split boundaries are a tuning decision.',
    ],
    edgeCases: [
      'A package without `exports` falls back to `module`/`main`, sometimes pulling CJS and disabling tree shaking.',
      'tsconfig `paths` not mirrored in the bundler: type check passes but build/runtime resolution fails.',
      'Conditional `exports` can serve different code to Node vs browser, causing environment-specific bugs.',
      'Duplicate package versions resolve to multiple copies in node_modules, bloating bundles and breaking instanceof/singletons.',
    ],
    runtimeBehavior: [
      'Resolution is largely build-time; the emitted runtime only loads chunks by hashed name via a manifest.',
      'Scope hoisting merges modules into fewer closures, reducing overhead and improving minification.',
      'Native dev ESM means the browser, not the bundler, drives loading during development.',
    ],
    scalability: [
      'Large graphs benefit from persistent caches and incremental resolution; cold builds dominate CI time.',
      'Monorepos need consistent resolution (workspaces + `exports`) or services diverge in how deps resolve.',
    ],
    productionConcerns: [
      'Pin and dedupe dependency versions to avoid multiple resolved copies inflating bundles.',
      'Coordinate content hashing with caching headers so deploys invalidate only changed chunks.',
      'Keep tsconfig, bundler, and test-runner resolution in sync to prevent "works in one tool" failures.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Bundler: graph → resolve → transform → optimize → emit.',
    'Resolution maps a specifier to a real file.',
    'Specifier kinds: relative (./), alias (@/), bare (package).',
    'Packages: read `exports` (conditions) → else `module` → else `main`.',
    'Conditions: import/require, browser/node, dev/prod, default.',
    'Subpath exports expose specific entries, hide internals.',
    'Resolving CJS instead of ESM disables tree shaking.',
    'tsconfig paths ≠ bundler alias — set BOTH.',
    'Native browser ESM needs explicit extensions; bundlers add them.',
    'Dynamic import boundaries → code-split chunks.',
    'Content-hashed filenames → long-term caching.',
    'Vite: native ESM in dev, Rollup bundling in prod.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add a Vite alias so `@/utils` resolves to `src/utils`, and import a function from it.',
      hint: 'Use resolve.alias in vite.config.',
      solution: {
        lang: 'js',
        code: `// vite.config.ts\nexport default { resolve: { alias: { '@': '/src' } } }\n// usage\nimport { formatDate } from '@/utils/date'`,
        explanation: [
          'The alias rewrites `@` to `/src` before filesystem resolution.',
          'Extensions (.ts/.js) are then tried automatically by the bundler.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a package.json `exports` map exposing the root as ESM/CJS and a subpath `./icons` as ESM only.',
      hint: 'Use conditional root export plus a subpath key.',
      solution: {
        lang: 'js',
        code: `{\n  "name": "kit",\n  "exports": {\n    ".": {\n      "import": "./dist/index.mjs",\n      "require": "./dist/index.cjs"\n    },\n    "./icons": "./dist/icons.mjs"\n  }\n}`,
        explanation: [
          'The `.` key routes ESM and CJS consumers to the right root build.',
          'The `./icons` subpath exposes a specific entry while hiding all other internal files.',
          'Anything not listed in `exports` is not importable from outside.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why types pass but the production build fails with "Cannot find module \'@/api\'", and fix it.',
      hint: 'Where is the alias declared, and where is it missing?',
      solution: {
        lang: 'js',
        code: `// tsconfig has it:\n// "paths": { "@/*": ["src/*"] }\n// but the bundler does NOT → runtime/build can't resolve @/api\n\n// FIX: mirror in the bundler\n// vite.config.ts\nexport default { resolve: { alias: { '@': '/src' } } }`,
        explanation: [
          'tsconfig `paths` only informs the TypeScript type checker, not the build.',
          'The bundler resolves modules independently and has no `@` mapping.',
          'Adding the matching alias to the bundler makes build-time resolution succeed.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Configure route-level code splitting and explain what the bundler emits and why it helps caching.',
      hint: 'Dynamic import per route → separate hashed chunk.',
      solution: {
        lang: 'js',
        code: `const routes = [\n  { path: '/', component: () => import('@/views/Home.vue') },\n  { path: '/reports', component: () => import('@/views/Reports.vue') }\n]\n// build emits: Home.[hash].js, Reports.[hash].js, vendor.[hash].js`,
        explanation: [
          'Each dynamic import is a split point, so the bundler emits a separate chunk per route.',
          'Visiting `/` downloads only Home + shared vendor code, not Reports.',
          'Content hashes let browsers cache unchanged chunks across deploys, re-downloading only what changed.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Bundlers and resolution are where application code meets the platform. Explaining how specifiers resolve, why ESM vs CJS gets picked, and how splitting and hashing work shows you understand the whole delivery pipeline — a strong senior signal that goes beyond writing features.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what a bundler does and what module resolution means. Product companies (Zoho, Flipkart, Razorpay) probe `exports`/`module`/`main` priority, aliases, and code splitting. FAANG-level interviews dig into conditional exports, dev-vs-prod strategies, duplicate-version pitfalls, and how resolution affects tree shaking.',
    whatInterviewersExpect:
      'Separate graph/resolution from optimization/emit, explain the three specifier kinds and package.json fields, connect condition selection to ESM/CJS and tree shaking, and discuss aliases, code splitting, and content-hash caching with real config examples.',
  },
}

export default bundlersModuleResolution
