import type { ConceptLesson } from '../../../types/lesson'

const projectStructure: ConceptLesson = {
  // 1. Concept Summary
  slug: 'project-structure',
  name: 'Project Structure',
  category: 'patterns',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'A clear project structure is the difference between a codebase a new teammate can navigate in an hour and one that takes weeks — it directly affects onboarding, velocity, and bug rate.',
    'Vue gives you freedom (no enforced layout), which means structure is YOUR responsibility — interviewers test whether you can impose sensible order.',
    'Good structure enables code-splitting, lazy loading, and clean dependency boundaries, which improve both performance and maintainability.',
    'Most real Vue jobs involve extending an existing app, so reasoning about where things belong (components vs composables vs stores vs views) is a daily skill.',
    'Poor structure causes circular imports, duplicated logic, giant components, and stores that become god-objects — all common production pain points.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Project structure is like organising your bedroom: clothes in the wardrobe, toys in the toy box, books on the shelf — so you can find anything fast.',
    story: [
      'Imagine your room where everything is dumped in one giant pile on the floor. Finding one specific sock takes forever.',
      'Now imagine you give everything a home: socks in a drawer, books on a shelf, games in a box. When you need something, you know exactly where to look.',
      'A friend visiting could also find your things, because the rooms follow rules anyone can guess.',
      'A Vue project is the same. We put each kind of thing — screens, reusable pieces, helpers, saved data — in its own folder so everyone on the team can find and add things quickly without making a mess.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue app is made of many files, so we group them into folders by what they do: components (reusable UI pieces), views or pages (whole screens), composables (shared logic), stores (shared data), and assets (images, styles).',
    'A common approach for small apps is to group by type (all components together); for bigger apps we group by feature, so everything about "checkout" lives in one folder.',
    'The router file maps URLs to view components, and a main entry file boots the app.',
    'Following a consistent layout means you (and your teammates) always know where to put a new file and where to find an existing one.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Project structure is the agreed-upon folder and file organisation of a Vue app — where components, views, composables, stores, router, assets, and utilities live, and how they depend on each other.',
    how: 'A typical Vite + Vue 3 app uses src/ with subfolders: components/ (reusable UI), views/ or pages/ (route-level screens), composables/ (reusable logic), stores/ (Pinia), router/ (routes), assets/ and a main.ts entry. As apps grow you switch from grouping by type to grouping by feature.',
    why: 'Consistency lets any developer find and place code instantly, enables lazy loading per route/feature, prevents circular dependencies, and keeps components focused — all of which speed up a team and reduce bugs.',
    code: {
      label: 'A conventional Vite + Vue 3 layout',
      lang: 'text',
      code: 'src/\n  assets/          # images, global css\n  components/       # reusable, presentational UI\n  composables/      # useXxx() shared logic\n  layouts/          # page shells (Default, Auth)\n  views/            # route-level screens\n  router/           # index.ts route table\n  stores/           # Pinia stores\n  services/ (api/)  # HTTP clients, API calls\n  utils/            # pure helpers\n  types/            # shared TS types\n  App.vue\n  main.ts',
      explanation: [
        'src/ holds all app source; the entry main.ts mounts App.vue and installs router/Pinia.',
        'components/ is for reusable pieces; views/ is for full screens mapped by the router.',
        'composables/ centralises shared reactive logic (useAuth, useFetch).',
        'stores/ holds Pinia stores; services/ isolates network calls from UI.',
        'This type-based layout works well until the app grows, then you move to feature folders.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Project structure is the organisational architecture of a Vue application: the directory layout, module boundaries, and dependency conventions that determine where each kind of artifact lives (components, route views, composables, Pinia stores, services, utils, types) and how layers may depend on one another. The two dominant strategies are organisation by type (folders per kind) for small apps and organisation by feature/domain (self-contained feature modules) for large ones, often combined with path aliases, lazy-loaded route chunks, and a clear one-directional dependency flow (views -> composables/stores -> services).',

  // 7. Internal Working
  internalWorking: [
    'Vite resolves the entry main.ts, which creates the app with createApp(App), installs plugins (router, Pinia), and mounts to #app — this is the root of the module dependency graph.',
    'The router file imports view components, ideally as dynamic import() functions so each route becomes a separate lazy-loaded chunk that Vite/Rollup code-splits at build time.',
    'Path aliases (e.g. @ -> /src) configured in vite.config and tsconfig let modules import by stable absolute-ish paths, avoiding brittle ../../.. chains and easing refactors.',
    'Components import composables and stores; composables encapsulate reactive logic; stores hold cross-component state; services own network/IO. A one-way dependency flow prevents cycles.',
    'Feature-based layout colocates a feature\'s components, store, composables, and routes in one folder, so Rollup can tree-shake and chunk per feature and teams can own folders.',
    'Build tooling reads this graph to produce optimised, code-split bundles; a clean structure directly enables better chunking, caching, and tree-shaking.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  BY TYPE (small app)            BY FEATURE (large app)\n  src/                            src/\n   ├─ components/                  ├─ features/\n   ├─ views/                       │   ├─ auth/\n   ├─ composables/                 │   │   ├─ components/\n   ├─ stores/                      │   │   ├─ store.ts\n   ├─ services/                    │   │   ├─ routes.ts\n   ├─ router/                      │   │   └─ useAuth.ts\n   └─ utils/                       │   └─ checkout/ ...\n                                   ├─ shared/ (ui, utils)\n                                   └─ app/ (router, main)\n\n  dependency flow (both):  views → composables/stores → services\n  NEVER the reverse (services must not import views)',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — lazy-loaded route views',
      lang: 'js',
      code: '// router/index.ts\nimport { createRouter, createWebHistory } from \'vue-router\'\n\nconst routes = [\n  { path: \'/\', component: () => import(\'@/views/HomeView.vue\') },\n  { path: \'/about\', component: () => import(\'@/views/AboutView.vue\') },\n]\n\nexport default createRouter({\n  history: createWebHistory(),\n  routes,\n})',
      explanation: [
        'Each view is imported with a dynamic import() so it becomes its own chunk.',
        'The @ alias points to src/, keeping imports stable across moves.',
        'Routes only load when visited, shrinking the initial bundle.',
        'Views live in views/ and are distinct from reusable components/.',
      ],
    },
    intermediate: {
      label: 'Intermediate — path aliases in Vite + TS',
      lang: 'js',
      code: '// vite.config.ts\nimport { fileURLToPath, URL } from \'node:url\'\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\n\nexport default defineConfig({\n  plugins: [vue()],\n  resolve: {\n    alias: { \'@\': fileURLToPath(new URL(\'./src\', import.meta.url)) },\n  },\n})\n\n// tsconfig.app.json (paths must mirror Vite)\n// { "compilerOptions": { "paths": { "@/*": ["./src/*"] } } }',
      explanation: [
        'The @ alias must be declared in BOTH Vite (runtime) and tsconfig (types).',
        'It replaces fragile ../../.. imports with @/components/Button.vue.',
        'Refactors that move files no longer break relative paths.',
        'Editors resolve the alias for autocomplete and go-to-definition.',
        'Mismatched alias config between Vite and TS is a common setup bug.',
      ],
    },
    advanced: {
      label: 'Advanced — feature-module folder',
      lang: 'text',
      code: 'src/features/checkout/\n  components/\n    CartSummary.vue\n    PaymentForm.vue\n  composables/\n    useCart.ts\n    useCheckout.ts\n  store/\n    checkout.store.ts   # Pinia store scoped to checkout\n  api/\n    checkout.api.ts     # HTTP calls for checkout\n  routes.ts             # this feature\'s routes\n  index.ts              # public surface (re-exports)',
      explanation: [
        'Everything about checkout lives together, so the feature is easy to find, own, and delete.',
        'index.ts defines the public API of the feature; other features import only from it.',
        'routes.ts is merged into the central router, keeping route ownership local.',
        'This colocate-by-feature layout scales to large teams with clear boundaries.',
        'Cross-feature imports go through shared/, never deep into another feature\'s internals.',
      ],
    },
    realProject: {
      label: 'Real project — barrel exports and a service layer',
      lang: 'js',
      code: '// services/http.ts — single configured axios/fetch client\nexport const http = {\n  get: (url) => fetch(url).then((r) => r.json()),\n}\n\n// features/users/api/users.api.ts\nimport { http } from \'@/services/http\'\nexport const fetchUsers = () => http.get(\'/api/users\')\n\n// features/users/composables/useUsers.ts\nimport { ref } from \'vue\'\nimport { fetchUsers } from \'../api/users.api\'\nexport function useUsers() {\n  const users = ref([])\n  const load = async () => { users.value = await fetchUsers() }\n  return { users, load }\n}',
      explanation: [
        'A single http service centralises base URL, headers, and error handling.',
        'Feature api files call the shared client, isolating endpoints from UI.',
        'Composables consume api functions and expose reactive state to components.',
        'Components never call fetch directly — the dependency flows one way down the layers.',
        'This separation makes mocking trivial in tests and swaps (axios -> fetch) painless.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What folders would you expect in a typical Vue 3 project?',
      answer: 'src/ with components/, views (or pages), composables/, stores/, router/, services or api/, assets/, utils/, types/, plus App.vue and main.ts as the entry.',
      explanation: 'A good answer distinguishes reusable components from route-level views and mentions composables and stores.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between a component and a view?',
      answer: 'A view (or page) is a route-level component mapped by the router to a URL; a component is a reusable UI piece used inside views or other components. Views compose components.',
      explanation: 'Tests whether the candidate understands routing-level vs reusable organisation.',
    },
    {
      level: 'intermediate',
      question: 'When would you switch from organising by type to organising by feature?',
      answer: 'As the app grows and folders like components/ accumulate dozens of unrelated files. Feature-based grouping colocates a domain\'s components, store, composables, and routes so it is easy to find, own, and delete — better for large teams.',
      explanation: 'Shows judgement about scaling the structure rather than dogma about one layout.',
    },
    {
      level: 'intermediate',
      question: 'Why use path aliases, and what is a common pitfall?',
      answer: 'Aliases (@ -> src) replace brittle ../../.. imports, survive file moves, and improve readability. The common pitfall is configuring the alias in Vite but not tsconfig (or vice versa), which breaks either the build or type-checking/autocomplete.',
      explanation: 'Demonstrates practical tooling knowledge and a real configuration gotcha.',
    },
    {
      level: 'advanced',
      question: 'How does project structure relate to performance?',
      answer: 'Route-level dynamic imports create per-route chunks, and feature folders enable per-feature code-splitting and tree-shaking. A clean one-directional dependency graph avoids cycles that defeat tree-shaking and prevents loading unneeded code on first paint.',
      explanation: 'Connects organisation to bundle optimisation, lazy loading, and tree-shaking.',
    },
    {
      level: 'senior',
      question: 'How do you prevent a project structure from rotting as it scales?',
      answer: 'Enforce one-directional dependency rules (views -> composables/stores -> services, never reverse), expose features via index.ts barrels so internals stay private, use lint rules (eslint import/no-restricted-paths) to forbid cross-boundary imports, keep components small, and review folder ownership. Document the conventions.',
      explanation: 'Senior answers mention enforcement mechanisms (lint, barrels, boundaries) not just an initial layout.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Where do you put global styles vs component-scoped styles?',
    'How do you organise Pinia stores — one big store or many small ones?',
    'How do you decide if logic belongs in a composable, a store, or a util?',
    'How do barrel (index.ts) files help and how can they hurt?',
    'How would you structure a monorepo with multiple Vue apps?',
    'How do you keep router config maintainable as routes grow?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Dumping everything into one giant components/ folder.',
      why: 'It becomes impossible to find files, hides feature boundaries, and encourages duplication.',
      fix: 'Group by feature once the app grows; keep truly shared UI in a shared/ui folder.',
    },
    {
      mistake: 'Calling fetch/axios directly inside components.',
      why: 'It couples UI to network details, blocks reuse, and makes testing and swapping clients hard.',
      fix: 'Put network calls in a services/api layer and consume them via composables or stores.',
    },
    {
      mistake: 'Configuring path aliases in only Vite or only tsconfig.',
      why: 'The runtime build or the type-checker disagrees, causing failures or broken autocomplete.',
      fix: 'Mirror the alias in both vite.config and tsconfig paths.',
    },
    {
      mistake: 'Letting low-level layers import high-level ones (services importing views).',
      why: 'It creates circular dependencies, defeats tree-shaking, and tangles the architecture.',
      fix: 'Keep a strict one-way flow: views -> composables/stores -> services -> utils.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'The official create-vue scaffold ships the type-based src/ layout (components, views, router, stores, assets) as a sensible default for small-to-medium apps.' },
    { area: 'Nuxt', detail: 'Nuxt enforces a convention-based structure (pages/, components/, composables/, server/, layouts/) with file-based routing and auto-imports, removing most structure decisions.' },
    { area: 'Pinia', detail: 'Large apps split state into many small domain stores (useUserStore, useCartStore) colocated with their feature rather than one monolithic store.' },
    { area: 'Component library', detail: 'Design systems use a packages/ or src/components structure with per-component folders (Component.vue, index.ts, stories, tests) for clear, publishable boundaries.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Route-level dynamic imports produce per-route chunks, shrinking the initial bundle.',
      'Feature folders enable per-feature code-splitting and effective tree-shaking.',
    ],
    bad: [
      'Circular dependencies (caused by tangled structure) defeat tree-shaking and can crash at runtime.',
      'Over-eager barrel files can pull entire folders into a bundle, hurting tree-shaking.',
    ],
    optimizations: [
      'Lazy-load route views and heavy feature modules with dynamic import().',
      'Keep a one-directional dependency flow to preserve tree-shaking.',
      'Use granular imports instead of giant barrels that re-export everything.',
      'Colocate by feature so unused features can be fully code-split or removed.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['single-file-components', 'components-basics', 'vite-vue', 'vue-router-basics'],
    nextConcepts: ['component-design-patterns', 'pinia-basics', 'lazy-loading-components', 'smart-dumb-components'],
    dependencyNote:
      'Project structure builds on SFCs, components, the router, and Vite tooling. It underpins component design patterns, state management organisation, and lazy loading. Learn SFCs and routing first, then how to organise them at scale.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw src/ and the two strategies side by side: by type vs by feature.',
      'List the type folders: components, views, composables, stores, services, router, utils.',
      'Draw the dependency arrows: views -> composables/stores -> services -> utils, one direction only.',
      'Mark route views as dynamic import() chunks for lazy loading.',
      'Conclude: "Start by type, migrate to features as it grows; enforce boundaries with barrels and lint rules."',
    ],
    diagram: '  src/\n   ├─ components/   (reusable UI)\n   ├─ views/        (route screens) → lazy import()\n   ├─ composables/  (useXxx logic)\n   ├─ stores/       (Pinia state)\n   ├─ services/     (HTTP/IO)\n   └─ utils/        (pure helpers)\n\n  flow:  views ──► composables/stores ──► services ──► utils\n         (never the other way → no cycles, tree-shakeable)',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue does not enforce a layout, so structure is on you. A typical Vite app uses src/ with components, views, composables, stores, router, services, and utils. Start by type for small apps and migrate to feature folders as it grows, colocating each domain\'s components, store, and routes. Use path aliases (mirror them in Vite AND tsconfig), lazy-load route views with dynamic import(), and keep a strict one-way dependency flow (views -> composables/stores -> services) so you avoid cycles and stay tree-shakeable. Enforce boundaries with barrels and lint rules.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue is unopinionated about structure, so it is the developer\'s job to impose order. A standard Vite plus Vue 3 app puts everything under src/ with folders by responsibility: components for reusable UI, views or pages for route-level screens, composables for shared reactive logic, stores for Pinia state, a services or api layer for network calls, router for the route table, plus assets, utils, and types. The entry point main.ts creates the app, installs the router and Pinia, and mounts App.vue. For small apps this type-based grouping is great, but as the app grows the components folder fills with dozens of unrelated files, so I migrate to a feature-based layout where everything about a domain — its components, composables, store, api, and routes — lives in one folder with an index.ts that defines its public surface. That makes features easy to find, own, and even delete, and it scales to large teams. A few practices keep the structure healthy. I use path aliases like @ pointing at src, but I make sure to declare them in both vite.config and tsconfig, because configuring only one is a classic bug that breaks either the build or type-checking. I lazy-load route views with dynamic import so each route is its own chunk, which shrinks the initial bundle. And I enforce a strict one-directional dependency flow — views depend on composables and stores, which depend on services, which depend on utils, never the reverse — to avoid circular dependencies that crash at runtime and defeat tree-shaking. To stop the structure rotting over time, I expose features through barrels, keep components small, and add lint rules that forbid reaching into another feature\'s internals. Nuxt, by contrast, removes most of these decisions with its convention-based directories and file-based routing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'By-type vs by-feature: type is simpler for small apps; feature scales better and improves ownership but adds nesting and some duplication.',
      'Barrels (index.ts) improve import ergonomics and encapsulation but can hurt tree-shaking and create accidental cycles if overused.',
      'Convention (Nuxt) vs configuration (plain Vite): conventions remove decisions and onboarding cost but reduce flexibility.',
    ],
    edgeCases: [
      'Circular imports between a store and a composable that import each other can throw at module init.',
      'Cross-feature shared logic must go to a shared layer, or features become coupled.',
      'A global barrel that re-exports everything can pull an entire app into one chunk.',
      'Aliases that drift between Vite and tsconfig cause subtle build-vs-type mismatches.',
    ],
    runtimeBehavior: [
      'Dynamic import() route views become separate chunks loaded on navigation, affecting first-paint and caching.',
      'Module init order follows the import graph; cycles surface as undefined exports at runtime.',
      'Auto-import tooling (unplugin-auto-import, Nuxt) changes how dependencies appear in the graph.',
    ],
    scalability: [
      'Feature modules with a defined public surface let many teams work without stepping on each other.',
      'Per-feature code-splitting keeps bundle growth proportional to usage, not total app size.',
    ],
    productionConcerns: [
      'Enforce dependency boundaries with eslint import rules so structure does not erode under deadline pressure.',
      'Document conventions (where things go) so onboarding is fast and consistent.',
      'Monitor bundle/chunk sizes; a structural change can silently bloat the initial load.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Vue enforces NO structure — it is your responsibility.',
    'Standard src/: components, views, composables, stores, router, services, utils, types.',
    'components = reusable; views/pages = route-level screens.',
    'Start by-type (small), migrate to by-feature (large).',
    'Feature folder = its components + store + composables + routes + index.ts.',
    'Path alias @ -> src; declare in BOTH vite.config AND tsconfig.',
    'Lazy-load route views with dynamic import() for code-splitting.',
    'One-way deps: views → composables/stores → services → utils.',
    'No fetch in components — use a services/api layer.',
    'Enforce boundaries with barrels + eslint import rules; Nuxt enforces structure for you.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'List a sensible folder layout for a small Vue 3 + Vite app and say what each folder holds.',
      hint: 'Group by type under src/.',
      solution: {
        lang: 'text',
        code: 'src/\n  components/   # reusable UI\n  views/        # route screens\n  composables/  # useXxx logic\n  stores/       # Pinia state\n  router/       # routes\n  services/     # API calls\n  utils/        # helpers\n  main.ts       # entry',
        explanation: [
          'Type-based grouping is ideal for small apps.',
          'components vs views separates reusable pieces from full screens.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Configure an @ -> src alias correctly so both Vite and TypeScript resolve it.',
      hint: 'Set resolve.alias in vite.config and paths in tsconfig.',
      solution: {
        lang: 'js',
        code: '// vite.config.ts\nimport { fileURLToPath, URL } from \'node:url\'\nresolve: { alias: { \'@\': fileURLToPath(new URL(\'./src\', import.meta.url)) } }\n\n// tsconfig.app.json\n// "compilerOptions": { "baseUrl": ".", "paths": { "@/*": ["./src/*"] } }',
        explanation: [
          'Vite handles the runtime resolution; tsconfig handles type-checking and editor support.',
          'Both must agree or you get build-vs-type mismatches.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Reorganise a type-based app into a feature module for "auth" with a clean public surface.',
      hint: 'Colocate components/store/composables/routes and expose via index.ts.',
      solution: {
        lang: 'text',
        code: 'src/features/auth/\n  components/LoginForm.vue\n  composables/useAuth.ts\n  store/auth.store.ts\n  api/auth.api.ts\n  routes.ts\n  index.ts   // export { useAuth } from \'./composables/useAuth\'\n             // export { default as authRoutes } from \'./routes\'',
        explanation: [
          'Everything auth-related lives together and is owned by one team.',
          'index.ts is the only entry point other features import from, keeping internals private.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and sketch how you would enforce that the services layer never imports from views.',
      hint: 'Combine architectural rules with an eslint import boundary rule.',
      solution: {
        lang: 'js',
        code: '// .eslintrc (import/no-restricted-paths)\n// rules: {\n//   \'import/no-restricted-paths\': [\'error\', { zones: [\n//     { target: \'./src/services\', from: \'./src/views\' },\n//   ]}]\n// }\n// flow:  views → composables/stores → services → utils  (one way)',
        explanation: [
          'The lint rule fails the build if a services file imports anything from views.',
          'Codifying the one-way dependency flow prevents cycles and structure rot under deadline pressure.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Project structure shows you can think about architecture and team scale, not just write a component. It is a daily-decision skill: every file you add forces a "where does this go?" choice. Strong answers prove you can keep a codebase maintainable as it grows.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the standard folder layout and component-vs-view difference. Product companies (Zoho, Flipkart, Razorpay) ask how you scale structure, organise stores, and separate API layers. FAANG-level rounds probe dependency boundaries, code-splitting, monorepos, and how you prevent architectural rot.',
    whatInterviewersExpect:
      'They expect a sensible default layout, the by-type vs by-feature trade-off, correct alias setup, lazy-loaded routes, a one-way dependency flow, and enforcement mechanisms like barrels and lint rules for large apps.',
  },
}

export default projectStructure
