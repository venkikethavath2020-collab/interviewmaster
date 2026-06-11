import type { ConceptLesson } from '../../../types/lesson'

const routeMetaLazyLoading: ConceptLesson = {
  // 1. Concept Summary
  slug: 'route-meta-lazy-loading',
  name: 'Route Meta & Lazy Loading',
  category: 'routing',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Route meta fields are the standard way to attach per-route data (auth requirements, page titles, layouts, roles) that guards and layouts read — without polluting components.',
    'Lazy loading routes is the single highest-impact bundle optimization in a Vue SPA: it splits each route into its own chunk so the browser only downloads code for the page the user actually visits.',
    'Together they power real apps: "this route needs login" lives in meta; the heavy admin dashboard loads only when an admin opens it.',
    'Interviewers use these to check whether you understand code-splitting, dynamic import(), and how Vue Router and the bundler cooperate.',
    'Misusing them causes either huge initial bundles (no lazy loading) or scattered, untestable auth logic (no meta).',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Meta is a sticky note on each door; lazy loading is only unpacking the box for the room you walk into.',
    story: [
      'Imagine a big house where every room is a different page of an app.',
      'On every door you stick a little note: "needs a key", "this is the kitchen", "grown-ups only". Those notes are the route meta — extra facts about the room that the guard at the door can read.',
      'Now imagine all the furniture for every room arrived in heavy boxes. Instead of unpacking ALL of them the moment you enter the house, you only open the box for the room you actually walk into. That is lazy loading.',
      'So the house opens fast because you carry just one box at a time, and the guard always knows the rules for each door by reading its note.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue Router, every route can carry a `meta` object — a free-form bag of data you decide, like { requiresAuth: true, title: "Dashboard" }.',
    'Code that runs before navigation (navigation guards) and your layout can read that meta to make decisions, instead of hard-coding rules inside components.',
    'Lazy loading means you point a route at a function that imports the component only when needed: `component: () => import("./Page.vue")`.',
    'The bundler (Vite/Webpack) sees that dynamic import and automatically splits that component into a separate file that downloads on demand.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Route meta is a custom data object attached to each route record; lazy loading is defining a route component as a dynamic `import()` so it becomes its own bundle chunk loaded on demand.',
    how: 'You add a `meta: {}` field to a route and read `to.meta` inside guards or `route.meta` in components. For lazy loading you replace a static component import with an arrow function returning `import()`, which the bundler code-splits.',
    why: 'Meta keeps cross-cutting concerns (auth, titles, layouts) declarative and centralized; lazy loading shrinks the initial JavaScript the user downloads so the app boots faster.',
    code: {
      label: 'Meta + lazy-loaded route',
      lang: 'js',
      code: 'import { createRouter, createWebHistory } from \'vue-router\'\n\nconst routes = [\n  {\n    path: \'/dashboard\',\n    name: \'dashboard\',\n    // lazy: this chunk loads only when /dashboard is visited\n    component: () => import(\'../views/Dashboard.vue\'),\n    meta: { requiresAuth: true, title: \'Dashboard\' },\n  },\n]\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes,\n})\n\nrouter.beforeEach((to) => {\n  document.title = to.meta.title ?? \'My App\'\n  if (to.meta.requiresAuth && !isLoggedIn()) return \'/login\'\n})',
      explanation: [
        'The `component` is a function returning `import()`, so Vite splits Dashboard.vue into its own chunk.',
        'The chunk downloads the first time someone navigates to /dashboard, not at app start.',
        '`meta.requiresAuth` and `meta.title` are arbitrary keys you invented.',
        'A single global `beforeEach` guard reads meta to set the title and enforce auth for every matching route.',
        'Returning a path string from the guard redirects; returning nothing allows navigation.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Route meta is an arbitrary object (`RouteMeta`) stored on each route record and exposed on the resolved route as `route.meta`; matched nested routes have their meta merged so a guard can inspect requirements from any level via `to.matched`. Lazy loading uses an async component factory — a function returning a dynamic `import()` — as the route\'s `component`. The bundler statically detects the `import()` call and emits a separate chunk; Vue Router awaits the returned promise during navigation and renders the resolved component, enabling route-level code-splitting.',

  // 7. Internal Working
  internalWorking: [
    'At router creation, each route record stores its `meta` object as-is and its `component` (which may be a sync component or an async loader function).',
    'When navigation starts, the router matches the URL against route records and builds `to.matched` — the array of matched records from parent to child; each contributes its own meta.',
    'The resolved `route.meta` is a merge of all matched records\' meta (child keys win), so a nested route inherits a parent\'s `requiresAuth` unless overridden.',
    'Guards (`beforeEach`, `beforeResolve`, per-route `beforeEnter`) run with `to`/`from` route objects, reading `to.meta` to decide allow/redirect/abort.',
    'For a lazy route, when its component is needed the router calls the loader function, which triggers the bundler-generated dynamic `import()` returning a Promise for the chunk.',
    'The router awaits that Promise (showing nothing or a Suspense/loading state meanwhile), then renders the resolved component; the chunk is cached so subsequent visits are instant.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  URL change → /admin/users
        │
        ▼
  ┌────────────────────────────┐
  │ matched: [Admin, Users]     │  parent + child records
  │  Admin.meta {requiresAuth}  │──┐ merged
  │  Users.meta {role:'admin'}  │──┘ → route.meta
  └────────────┬───────────────┘
               ▼
     beforeEach(to) reads to.meta ── deny? → redirect /login
               │ allow
               ▼
   component: () => import('Users.vue')
               │ first visit
               ▼
   [network] fetch users.chunk.js ──► render
               (cached on later visits)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — page title via meta',
      lang: 'js',
      code: 'const routes = [\n  { path: \'/\', component: Home, meta: { title: \'Home\' } },\n  { path: \'/about\', component: About, meta: { title: \'About Us\' } },\n]\n\nrouter.afterEach((to) => {\n  document.title = to.meta.title ?? \'My App\'\n})',
      explanation: [
        'Each route declares a `title` in its meta.',
        '`afterEach` runs after every successful navigation.',
        'It reads `to.meta.title` and updates the document title centrally.',
        'No component needs to know or set its own title.',
      ],
    },
    intermediate: {
      label: 'Intermediate — auth guard reading meta',
      lang: 'js',
      code: 'const routes = [\n  { path: \'/login\', component: () => import(\'./Login.vue\') },\n  {\n    path: \'/dashboard\',\n    component: () => import(\'./Dashboard.vue\'),\n    meta: { requiresAuth: true },\n  },\n]\n\nrouter.beforeEach((to) => {\n  const auth = useAuthStore()\n  // any matched record requiring auth triggers the check\n  if (to.matched.some((r) => r.meta.requiresAuth) && !auth.isLoggedIn) {\n    return { path: \'/login\', query: { redirect: to.fullPath } }\n  }\n})',
      explanation: [
        '`to.matched.some(...)` checks the whole matched chain, so nested routes inherit the requirement.',
        'Returning a location object redirects to /login and preserves the intended destination in `query.redirect`.',
        'Both routes are lazy-loaded, so neither chunk loads until visited.',
        'Auth logic lives in ONE guard, not scattered across components.',
      ],
    },
    advanced: {
      label: 'Advanced — typed meta + role-based access',
      lang: 'ts',
      code: '// router types augmentation\ndeclare module \'vue-router\' {\n  interface RouteMeta {\n    requiresAuth?: boolean\n    roles?: string[]\n    layout?: \'default\' | \'admin\'\n  }\n}\n\nconst routes = [\n  {\n    path: \'/admin\',\n    component: () => import(\'./AdminLayout.vue\'),\n    meta: { requiresAuth: true, roles: [\'admin\'], layout: \'admin\' },\n    children: [\n      { path: \'users\', component: () => import(\'./admin/Users.vue\') },\n    ],\n  },\n]\n\nrouter.beforeEach((to) => {\n  const auth = useAuthStore()\n  const required = to.meta.roles\n  if (required && !required.some((r) => auth.roles.includes(r))) {\n    return { path: \'/403\' }\n  }\n})',
      explanation: [
        'Augmenting the `RouteMeta` interface gives full TypeScript autocomplete and type-checking on `to.meta`.',
        'The child `users` route inherits `requiresAuth` and `roles` from the matched parent /admin record.',
        'The guard reads `to.meta.roles` and compares against the user\'s roles.',
        'Each child is its own lazy chunk, so the admin section never weighs down the public bundle.',
      ],
    },
    realProject: {
      label: 'Real project — layout switching + grouped chunk names',
      lang: 'js',
      code: '// routes/index.js — a SaaS app with public + app + admin areas\nconst routes = [\n  {\n    path: \'/\',\n    component: () => import(/* webpackChunkName: "public" */ \'../layouts/Public.vue\'),\n    children: [\n      { path: \'\', component: () => import(\'../views/Landing.vue\') },\n      { path: \'pricing\', component: () => import(\'../views/Pricing.vue\') },\n    ],\n    meta: { layout: \'public\' },\n  },\n  {\n    path: \'/app\',\n    component: () => import(\'../layouts/App.vue\'),\n    meta: { requiresAuth: true, layout: \'app\' },\n    children: [\n      { path: \'\', component: () => import(\'../views/Inbox.vue\') },\n      { path: \'settings\', component: () => import(\'../views/Settings.vue\') },\n    ],\n  },\n]\n\nrouter.beforeEach((to) => {\n  const auth = useAuthStore()\n  if (to.meta.requiresAuth && !auth.isLoggedIn)\n    return { name: \'login\', query: { redirect: to.fullPath } }\n})',
      explanation: [
        'Each area uses a layout component plus lazy child views, so the app loads in small slices.',
        '`meta.layout` tells the app shell which chrome to render (public nav vs app sidebar).',
        'The `/* webpackChunkName */` comment names chunks for readable network panels (Vite supports a similar magic comment).',
        'Auth is enforced once on the /app subtree; every child inherits it through merged meta.',
        'This is the canonical structure for production multi-area Vue SPAs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is route meta and what is it used for?',
      answer: 'Meta is a custom object attached to a route record, accessed via `route.meta`, used to store per-route information like requiresAuth, page title, required roles, or which layout to use, so guards and layouts can read it without touching components.',
      explanation: 'A good answer stresses that meta is arbitrary data YOU define and that it centralizes cross-cutting concerns.',
    },
    {
      level: 'beginner',
      question: 'How do you lazy-load a route component in Vue Router?',
      answer: 'Set the route\'s `component` to a function that returns a dynamic import: `component: () => import("./Page.vue")`. The bundler then splits that component into its own chunk loaded only when the route is visited.',
      explanation: 'They want to see the dynamic-import-as-component-factory pattern and the words "code splitting".',
    },
    {
      level: 'intermediate',
      question: 'How does meta behave with nested routes?',
      answer: 'Each matched record has its own meta; the resolved `route.meta` is a merge of all matched records. In a guard you usually check `to.matched.some(r => r.meta.requiresAuth)` so a requirement on a parent applies to all children.',
      explanation: 'The matched-chain merge is the key insight that separates people who read the docs from those who only saw a snippet.',
    },
    {
      level: 'intermediate',
      question: 'Why does lazy loading improve performance and what is the trade-off?',
      answer: 'It reduces the initial bundle so the app boots faster (less JS to parse/execute). The trade-off is a small per-route network request the first time each chunk is needed; you mitigate it with prefetching or grouping small related views into one chunk.',
      explanation: 'Senior-leaning candidates mention prefetch/preload and the cost of over-splitting tiny routes.',
    },
    {
      level: 'advanced',
      question: 'How do you make route.meta type-safe in TypeScript?',
      answer: 'Augment the `RouteMeta` interface inside `declare module "vue-router"` with your keys (requiresAuth, roles, layout). Then `to.meta` is fully typed with autocomplete and the compiler catches typos.',
      explanation: 'Module augmentation of vue-router is the expected, idiomatic answer.',
    },
    {
      level: 'senior',
      question: 'A lazy route flashes a blank screen while its chunk loads. How do you handle loading and errors?',
      answer: 'Show a global loading bar driven by beforeEach/afterEach, or wrap the <router-view> in <Suspense> with a fallback. For load failures (network/chunk errors after a deploy), catch the rejected import and either retry or do a full reload; route-level error handling plus a service-worker cache strategy keeps it robust.',
      explanation: 'Mentioning chunk-load failures after deploys (stale hashes) is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is `meta` merged across nested matched routes?',
    'What is the difference between `beforeEach`, `beforeEnter`, and `beforeResolve`?',
    'How would you prefetch a lazy route on link hover?',
    'How do you name and group chunks to avoid too many tiny requests?',
    'How do you handle a chunk-load error after a new deploy invalidates old hashes?',
    'How does lazy loading interact with SSR/Nuxt?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Importing the component statically AND lazily, or calling the import eagerly.',
      why: 'Writing `component: import(\'./X.vue\')` (no arrow) runs the import immediately, defeating lazy loading.',
      fix: 'Always use a factory: `component: () => import(\'./X.vue\')` so the import runs on demand.',
    },
    {
      mistake: 'Checking only `to.meta.requiresAuth` instead of the matched chain.',
      why: 'A requirement declared on a parent route may not appear directly on `to.meta` depending on overrides; you can miss protecting children.',
      fix: 'Use `to.matched.some(r => r.meta.requiresAuth)` to respect inherited meta.',
    },
    {
      mistake: 'Over-splitting every tiny component into its own chunk.',
      why: 'Dozens of micro-requests add latency and HTTP overhead that can be slower than one slightly larger bundle.',
      fix: 'Group small, related views with shared chunk names; lazy-load at meaningful boundaries (areas/heavy pages).',
    },
    {
      mistake: 'Putting auth logic inside each component instead of meta + a guard.',
      why: 'It scatters and duplicates rules, making them hard to audit and easy to forget on a new page.',
      fix: 'Declare requirements in meta and enforce them in one global navigation guard.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Standard SPA setup: every non-critical view is `() => import()` and routes carry meta for auth, titles, breadcrumbs, and layout selection read by a global guard.' },
    { area: 'Nuxt', detail: 'Nuxt auto-splits pages by file-based routing and exposes `definePageMeta({ middleware, layout })`, which is the framework-level equivalent of route meta + lazy loading.' },
    { area: 'Pinia', detail: 'Navigation guards read meta and consult a Pinia auth store (`useAuthStore`) to decide access, keeping the source of truth for user/session in one place.' },
    { area: 'Component library', detail: 'Documentation sites lazy-load each demo/page route so the docs shell stays tiny and example-heavy pages load only when opened.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy loading cuts the initial JS bundle, improving Time-to-Interactive and Largest Contentful Paint.',
      'Meta-driven guards keep navigation logic in one cheap place rather than re-running per component.',
    ],
    bad: [
      'Too many tiny chunks create request waterfalls and HTTP overhead.',
      'A lazy chunk that fails to load (stale hash after deploy) can break navigation if unhandled.',
    ],
    optimizations: [
      'Prefetch likely-next chunks on link hover or via `<link rel="prefetch">` / Vite\'s automatic prefetch.',
      'Group small related routes under one named chunk to balance count vs size.',
      'Wrap router-view in <Suspense> for smooth async transitions and a loading fallback.',
      'Handle chunk-load errors with a retry or full reload to recover from stale deploys.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'navigation-guards', 'nested-routes'],
    nextConcepts: ['lazy-loading-components', 'bundle-optimization', 'programmatic-navigation', 'vite-vue'],
    dependencyNote:
      'You need vue-router-basics and an understanding of navigation-guards and nested-routes to use meta well; mastering route-level lazy loading is the gateway to the broader lazy-loading-components and bundle-optimization topics.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a route record box with two fields: `component` and `meta`.',
      'For `component`, write `() => import("Page.vue")` and draw an arrow to a separate "chunk" box that the bundler emits.',
      'For `meta`, write `{ requiresAuth: true, title }` as a sticky note on the route.',
      'Draw `beforeEach(to)` reading the sticky note and either allowing or redirecting to /login.',
      'Say: "Meta declares per-route requirements; the lazy import means we only fetch that chunk when the route is visited."',
    ],
    diagram: `  route {
    path: '/dashboard'
    component: () => import('Dashboard.vue') ─► [chunk] (on demand)
    meta: { requiresAuth, title } ─────► sticky note
  }
        │
   beforeEach(to) reads meta ──► deny → /login
                              └─ allow → render chunk`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Route meta is an arbitrary object on each route (requiresAuth, title, roles, layout) that guards and layouts read, keeping cross-cutting logic centralized. Meta merges across the matched chain so children inherit parent requirements. Lazy loading sets a route\'s component to `() => import("Page.vue")`, which the bundler splits into a separate chunk loaded only when visited — shrinking the initial bundle for faster boot. Together they give clean auth/title handling and route-level code splitting.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Route meta and lazy loading are two complementary Vue Router features. Meta is a custom object you attach to each route record — keys you invent like requiresAuth, title, roles, or layout. You read it through route.meta, and crucially the resolved meta is merged across all matched records, so a child route inherits requirements declared on its parent. That lets you write one global beforeEach guard that checks to.matched.some(r => r.meta.requiresAuth) and redirects to login if needed, instead of scattering auth checks inside components. In TypeScript you augment the RouteMeta interface so to.meta is fully typed. Lazy loading is route-level code splitting: instead of importing the component statically, you set component to a function returning a dynamic import — `() => import("./Dashboard.vue")`. The bundler detects that import call and emits a separate chunk, and Vue Router awaits the returned promise during navigation, fetching the chunk only the first time the route is visited and caching it afterwards. This dramatically reduces the initial JavaScript a user downloads, improving boot time. The trade-offs are a small first-visit request per chunk — which you can soften with prefetching on hover or grouping small related views into one named chunk — and handling chunk-load failures after a deploy, where I catch the rejected import and trigger a reload. In production these combine: lazy child views under a layout, with meta enforcing auth on the whole subtree.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Granularity of splitting: per-route chunks reduce initial load but add requests; coarse grouping reduces requests but ships unused code — tune to real route popularity.',
      'Meta in route config vs middleware/store: meta is declarative and discoverable, but complex policy logic may belong in a dedicated permission service the guard calls.',
    ],
    edgeCases: [
      'Stale chunk hashes after a deploy: an open SPA tries to fetch an old chunk URL that no longer exists and the import rejects — needs reload/retry handling.',
      'Meta merge collisions: a child redefining a parent key silently overrides it; document the precedence to avoid surprise.',
      'Guards that read async state (auth still loading) can race; ensure the store is hydrated before the first guard decision.',
      'Lazy components that themselves import large dependencies still bloat their chunk — analyze the chunk, not just the route count.',
    ],
    runtimeBehavior: [
      'The async component factory is invoked once per session per route; the resolved module is cached so repeat visits are synchronous.',
      'Navigation is paused while the import promise resolves; without Suspense/loading UI the user sees a blank router-view briefly.',
      'Guards run on every navigation including the initial one, so meta-based redirects fire on direct URL entry too.',
    ],
    scalability: [
      'For large apps, organize routes by feature module each with its own grouped chunk so teams own clear bundle boundaries.',
      'Prefetch strategies (hover, viewport, route-aware) matter more as route count grows to hide chunk latency.',
    ],
    productionConcerns: [
      'Always implement chunk-load-error recovery; it is a top real-world SPA incident after deploys.',
      'Add a global loading indicator so async route transitions feel intentional, not broken.',
      'Audit chunk sizes in CI (bundle analyzer) to catch a route accidentally pulling a huge dependency into its chunk.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'meta = arbitrary per-route data object → read via route.meta / to.meta.',
    'Resolved meta is MERGED across to.matched (child wins).',
    'Guard pattern: to.matched.some(r => r.meta.requiresAuth).',
    'Lazy route: component: () => import("./X.vue").',
    'Dynamic import() → bundler emits a separate chunk (code splitting).',
    'No arrow = eager import = NOT lazy.',
    'Type meta: augment RouteMeta in `declare module "vue-router"`.',
    'Use meta for: auth, roles, title, layout, breadcrumbs.',
    'Prefetch on hover / group small chunks to cut request waterfalls.',
    'Handle chunk-load errors (stale hashes) with reload/retry.',
    'Wrap router-view in <Suspense> for async fallbacks.',
    'Nuxt equivalent: definePageMeta + file-based auto code splitting.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add a route for /profile that lazy-loads Profile.vue and sets a meta title of "Profile".',
      hint: 'Use a function returning import() and a meta object.',
      solution: {
        lang: 'js',
        code: '{\n  path: \'/profile\',\n  name: \'profile\',\n  component: () => import(\'./views/Profile.vue\'),\n  meta: { title: \'Profile\' },\n}',
        explanation: [
          'The arrow-function import makes Profile.vue its own chunk.',
          'meta.title can be read by an afterEach guard to set document.title.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a global beforeEach that redirects unauthenticated users to /login for any route whose matched chain requires auth, preserving the intended destination.',
      hint: 'Use to.matched.some and a redirect query.',
      solution: {
        lang: 'js',
        code: 'router.beforeEach((to) => {\n  const auth = useAuthStore()\n  const needsAuth = to.matched.some((r) => r.meta.requiresAuth)\n  if (needsAuth && !auth.isLoggedIn) {\n    return { path: \'/login\', query: { redirect: to.fullPath } }\n  }\n})',
        explanation: [
          'to.matched covers parent and child records, respecting inherited meta.',
          'Returning a location object performs the redirect; query.redirect lets login send the user back.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add TypeScript types so that to.meta has typed `requiresAuth?: boolean` and `roles?: string[]`.',
      hint: 'Augment the vue-router RouteMeta interface.',
      solution: {
        lang: 'ts',
        code: 'import \'vue-router\'\n\ndeclare module \'vue-router\' {\n  interface RouteMeta {\n    requiresAuth?: boolean\n    roles?: string[]\n  }\n}',
        explanation: [
          'Module augmentation extends vue-router\'s built-in RouteMeta interface.',
          'Now to.meta.roles autocompletes and is type-checked across the app.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement chunk-load-error recovery: if a lazy route import fails (e.g. stale hash after deploy), reload the page once instead of leaving a blank view.',
      hint: 'Wrap the import in a helper that catches rejection and reloads, guarding against an infinite loop.',
      solution: {
        lang: 'js',
        code: 'function lazyWithRetry(loader) {\n  return () =>\n    loader().catch((err) => {\n      const KEY = \'chunk-reload\'\n      if (!sessionStorage.getItem(KEY)) {\n        sessionStorage.setItem(KEY, \'1\')\n        window.location.reload()\n        return new Promise(() => {}) // halt while reloading\n      }\n      throw err // already retried once → surface the error\n    })\n}\n\n// usage\n{ path: \'/reports\', component: lazyWithRetry(() => import(\'./Reports.vue\')) }',
        explanation: [
          'A failed dynamic import after a deploy usually means the chunk URL changed; a reload fetches the new manifest.',
          'A sessionStorage flag prevents an infinite reload loop if the failure is genuine.',
          'On a clean load the flag is reset (clear it in an app-ready hook in real code).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Route meta and lazy loading are bread-and-butter for any real Vue SPA — they show you can structure auth/permissions declaratively and that you understand bundle performance. Nailing them signals you can build apps that scale and boot fast.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition of meta and how to lazy-load a route. Product companies (Zoho, Flipkart, Razorpay) ask you to wire up role-based guards and discuss bundle splitting trade-offs. FAANG-level interviews probe chunk-load failures, prefetch strategies, and how splitting interacts with SSR.',
    whatInterviewersExpect:
      'They expect the dynamic-import component factory, the meta-merge-across-matched-routes insight, a centralized guard reading meta, and awareness of the prefetch/over-splitting/stale-chunk trade-offs.',
  },
}

export default routeMetaLazyLoading
