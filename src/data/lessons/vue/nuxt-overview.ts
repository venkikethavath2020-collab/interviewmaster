import type { ConceptLesson } from '../../../types/lesson'

const nuxtOverview: ConceptLesson = {
  // 1. Concept Summary
  slug: 'nuxt-overview',
  name: 'Nuxt Overview',
  category: 'ecosystem',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Nuxt is the de-facto meta-framework for Vue — it adds SSR, file-based routing, auto-imports, data fetching, and a server engine so you can build full production apps, not just SPAs.',
    'Most Vue jobs that need SEO, fast first paint, or a backend layer use Nuxt; understanding it is often the difference between building a demo and shipping a real product.',
    'It standardises the decisions you would otherwise make yourself: project structure, routing, rendering mode (SSR/SSG/SPA), and the data-fetching story.',
    'Interviewers ask it to test whether you understand server-side rendering, hydration, and the trade-offs between rendering strategies — core senior topics.',
    'Knowing Nuxt\'s conventions (pages/, server/, useFetch, useState) lets you reason about hydration mismatches, SEO, and performance that plain Vue SPAs cannot easily solve.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Nuxt is like a fully-built LEGO castle kit, while plain Vue is a box of loose bricks — both make castles, but the kit comes with instructions and ready-made parts.',
    story: [
      'Imagine you want to build a LEGO castle. With a box of loose bricks you can build anything, but you have to figure out every wall and tower yourself.',
      'Now imagine a special kit that already includes the gates, towers, and a step-by-step guide, so the hard parts are done for you and you just add your own touches.',
      'The kit also makes the castle look great from the very first second you open the box, instead of slowly building up in front of your friends.',
      'Nuxt is that kit for Vue websites: it gives you ready-made pieces and rules so your site is fast and complete from the first moment someone visits.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Nuxt is a framework built on top of Vue that adds the extra parts a real website needs, so you do not have to wire them yourself.',
    'The biggest one is server-side rendering: the page is built on the server first and sent as ready HTML, so it appears fast and search engines can read it.',
    'It also gives you automatic routing (just add a file to the pages folder and it becomes a URL), automatic imports, and easy data fetching.',
    'So plain Vue builds the moving parts of the page, while Nuxt arranges those parts into a complete, fast, SEO-friendly app with sensible rules.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Nuxt is a meta-framework for Vue that provides server-side rendering (SSR), static-site generation (SSG), file-based routing, auto-imports, data-fetching composables, layouts, and a server/API layer (Nitro) — turning Vue from a client library into a full-stack app framework.',
    how: 'You scaffold with npx nuxi init, put pages in pages/ (file = route), components in components/ (auto-imported), and use composables like useFetch/useAsyncData for SSR-safe data and useState for cross-request-safe shared state. Nitro powers server routes in server/api/. You choose a rendering mode per route.',
    why: 'It solves the hard problems plain Vue SPAs struggle with — SEO, fast first paint via SSR/SSG, and a backend layer — with conventions that remove boilerplate and prevent common mistakes like hydration mismatches and leaked server state.',
    code: {
      label: 'A Nuxt page with SSR data fetching',
      lang: 'js',
      code: '// pages/users/[id].vue → route /users/:id (file-based)\n// <script setup>\nconst route = useRoute()\n// useFetch runs on server during SSR, then hydrates on client\nconst { data: user, pending, error } = await useFetch(\n  () => `/api/users/${route.params.id}`\n)\n// </script>\n// <template>\n//   <p v-if="pending">Loading...</p>\n//   <p v-else-if="error">Failed</p>\n//   <h1 v-else>{{ user.name }}</h1>\n// </template>',
      explanation: [
        'The file pages/users/[id].vue automatically becomes the route /users/:id.',
        'useFetch runs on the server during SSR so the HTML arrives populated (great for SEO).',
        'The fetched data is serialised and reused on the client to avoid a second request.',
        'useRoute and useFetch are auto-imported — no explicit import lines needed.',
        'pending/error give a built-in loading/error state for the request.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Nuxt is a higher-level framework built on Vue 3, Vite, and the Nitro server engine that provides universal (server-side) rendering, static generation, and client rendering modes selectable per route. It adds file-based routing (pages/ compiled into a vue-router config), auto-imports of components and composables, SSR-safe data fetching (useFetch/useAsyncData with payload transfer to avoid double fetching), cross-request-safe shared state (useState), layouts, middleware, plugins, modules, and a unified server/API layer (server/) deployable to many platforms. It manages the SSR render-then-hydrate lifecycle and serialises server-computed state into the HTML payload for the client to reuse.',

  // 7. Internal Working
  internalWorking: [
    'On a request (universal mode), Nitro (Nuxt\'s Nitro server) runs the Vue app on the server, executing setup() and SSR-aware composables like useFetch to produce fully-rendered HTML.',
    'Server-computed data is serialised into the HTML payload (window.__NUXT__) so the client can hydrate without refetching — useFetch/useAsyncData key results to transfer them across the server/client boundary.',
    'The browser receives ready HTML (fast first paint, SEO-readable), then downloads the JS bundle and hydrates: Vue attaches event listeners and reactivity to the existing DOM rather than re-rendering it.',
    'File-based routing compiles the pages/ directory into a vue-router configuration at build time, with [param] and [...slug] filenames mapping to dynamic and catch-all routes.',
    'Auto-imports are powered by build-time scanning (unplugin) so components/ and composables/ are available without import statements, generating types for them.',
    'useState stores shared state in a per-request container on the server (preventing cross-request leakage between users) and hydrates it on the client, unlike a module-level ref which would be shared across all SSR requests.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  REQUEST → Nitro server\n    run Vue app + useFetch (server) → HTML (filled) + __NUXT__ payload\n           │\n           ▼  ship ready HTML  (fast paint, SEO)\n        browser\n           │  download JS bundle\n           ▼  HYDRATE (attach listeners, reuse DOM, reuse payload)\n        interactive SPA\n\n  routing:  pages/index.vue → /        pages/users/[id].vue → /users/:id\n  modes:    SSR (per request) | SSG (build time) | SPA (client only)\n  server/api/* → backend routes (Nitro)',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — file-based routing + layout',
      lang: 'text',
      code: 'pages/\n  index.vue          → /\n  about.vue          → /about\n  users/\n    index.vue        → /users\n    [id].vue         → /users/:id\nlayouts/\n  default.vue        → wraps pages with <slot/>\ncomponents/\n  UserCard.vue       → auto-imported, no import needed',
      explanation: [
        'Each file in pages/ becomes a route automatically — no manual router config.',
        '[id].vue creates a dynamic segment accessible via route.params.id.',
        'layouts/default.vue wraps pages and renders them through <slot/>.',
        'Components in components/ are auto-imported wherever used.',
        'This convention removes most routing and import boilerplate.',
      ],
    },
    intermediate: {
      label: 'Intermediate — server API route + useFetch',
      lang: 'js',
      code: '// server/api/users.get.ts (Nitro backend route)\nexport default defineEventHandler(async () => {\n  return [{ id: 1, name: \'Ada\' }, { id: 2, name: \'Linus\' }]\n})\n\n// pages/users/index.vue\n// <script setup>\nconst { data: users } = await useFetch(\'/api/users\')\n// </script>\n// <template><li v-for="u in users" :key="u.id">{{ u.name }}</li></template>',
      explanation: [
        'server/api/users.get.ts defines a real backend endpoint via Nitro.',
        'defineEventHandler is the Nitro request handler signature.',
        'useFetch(\'/api/users\') runs on the server during SSR and transfers the result to the client.',
        'No separate Express server is needed — the backend lives in the same project.',
        'This is the full-stack story plain Vue SPAs lack.',
      ],
    },
    advanced: {
      label: 'Advanced — SSR-safe shared state with useState',
      lang: 'js',
      code: '// composables/useCounter.ts\nexport function useCounter() {\n  // useState is per-request on the server (no cross-user leakage)\n  const count = useState(\'counter\', () => 0)\n  const inc = () => count.value++\n  return { count, inc }\n}\n\n// ❌ WRONG for SSR: a module-level ref is shared across ALL requests\n// const count = ref(0) // would leak one user\'s state to another',
      explanation: [
        'useState creates state scoped to each server request, then hydrates on the client.',
        'A module-level ref would be a singleton shared across all SSR requests — a serious data-leak bug.',
        'The string key lets the same state be reused across components on a page.',
        'The initializer runs once per request, giving each user a fresh value.',
        'This is the #1 SSR state pitfall and a common interview trap.',
      ],
    },
    realProject: {
      label: 'Real project — SEO meta + rendering mode per route',
      lang: 'js',
      code: '// pages/blog/[slug].vue\n// <script setup>\nconst route = useRoute()\nconst { data: post } = await useFetch(`/api/posts/${route.params.slug}`)\nuseSeoMeta({\n  title: () => post.value?.title,\n  description: () => post.value?.excerpt,\n  ogImage: () => post.value?.cover,\n})\n// </script>\n\n// nuxt.config.ts — pre-render blog at build time (SSG), SSR the rest\n// routeRules: {\n//   \'/blog/**\': { prerender: true },\n//   \'/dashboard/**\': { ssr: false }, // SPA for the app area\n// }',
      explanation: [
        'useSeoMeta sets per-page title/description/OG tags rendered into the server HTML for SEO.',
        'routeRules let you choose rendering mode per route: prerender (SSG), SSR, or SPA.',
        'Blog pages are statically generated for speed and CDN caching; the dashboard is client-only.',
        'This hybrid rendering is a key Nuxt 3 capability for real apps.',
        'The same project serves marketing pages and an app with different strategies.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Nuxt and how does it relate to Vue?',
      answer: 'Nuxt is a meta-framework built on top of Vue 3 that adds server-side rendering, file-based routing, auto-imports, data-fetching composables, layouts, and a server/API layer — turning Vue into a full-stack, SEO-friendly app framework.',
      explanation: 'A good answer positions Nuxt as a layer above Vue and lists a few of its headline features.',
    },
    {
      level: 'beginner',
      question: 'How does routing work in Nuxt?',
      answer: 'It is file-based: files in the pages/ directory automatically become routes. pages/about.vue is /about, and pages/users/[id].vue is /users/:id. Nuxt compiles this into a vue-router config.',
      explanation: 'Tests knowledge of the convention-over-configuration routing.',
    },
    {
      level: 'intermediate',
      question: 'Why use useFetch/useAsyncData instead of a plain fetch in onMounted?',
      answer: 'They run on the server during SSR so the HTML arrives populated (better SEO and first paint), and they serialise the result into the payload so the client does not refetch. A fetch in onMounted only runs on the client, after hydration, missing SSR benefits.',
      explanation: 'A senior signal is mentioning both SSR execution and payload transfer to avoid double fetching.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between SSR, SSG, and SPA modes, and why does Nuxt support all three?',
      answer: 'SSR renders per request on the server (dynamic, SEO, fresh data). SSG pre-renders at build time (fastest, CDN-cacheable, for mostly-static content). SPA renders only on the client (no SEO, simplest). Nuxt allows per-route choice via routeRules so one app can mix them.',
      explanation: 'Shows understanding of rendering trade-offs and Nuxt\'s hybrid rendering.',
    },
    {
      level: 'advanced',
      question: 'Why must you use useState instead of a module-level ref for shared state in Nuxt SSR?',
      answer: 'On the server the module is loaded once and shared across all requests, so a module-level ref would leak one user\'s state into another\'s request. useState scopes state per request and hydrates it on the client, keeping users isolated.',
      explanation: 'Senior signal: understanding the SSR singleton/state-leakage problem and the per-request fix.',
    },
    {
      level: 'senior',
      question: 'What causes hydration mismatches in Nuxt and how do you avoid them?',
      answer: 'They happen when the server-rendered HTML differs from the client\'s first render — e.g. using Date.now(), Math.random(), or browser-only APIs (window) during render. Avoid them by keeping render deterministic, deferring client-only logic to onMounted or <ClientOnly>, and ensuring server/client data match via the transferred payload.',
      explanation: 'Demonstrates deep SSR knowledge: deterministic rendering, ClientOnly, and payload consistency.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is Nitro and what does it do?',
    'How do Nuxt layouts and middleware work?',
    'When would you choose SSG over SSR?',
    'How do auto-imports work and what are their downsides?',
    'How do Nuxt modules extend the framework?',
    'How does Nuxt handle SEO meta tags (useSeoMeta/useHead)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a module-level ref for shared state in an SSR app.',
      why: 'The module is a singleton on the server, so state leaks across different users\' requests.',
      fix: 'Use useState (per-request) for shared/global state in Nuxt.',
    },
    {
      mistake: 'Accessing window/document during render.',
      why: 'There is no browser during SSR, so it throws or causes a hydration mismatch.',
      fix: 'Move browser-only code into onMounted, wrap in <ClientOnly>, or guard with import.meta.client.',
    },
    {
      mistake: 'Fetching data in onMounted instead of useFetch/useAsyncData.',
      why: 'It runs only on the client after hydration, losing SSR/SEO benefits and causing loading flashes.',
      fix: 'Use useFetch/useAsyncData so data is fetched on the server and transferred to the client.',
    },
    {
      mistake: 'Assuming Nuxt is always SSR.',
      why: 'Nuxt supports SSR, SSG, and SPA; treating it as one mode leads to wrong performance/SEO decisions.',
      fix: 'Pick the rendering mode per route with routeRules based on the content\'s needs.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Nuxt', detail: 'Universal rendering for SEO-critical marketing/content sites, with hybrid per-route rules mixing SSG, SSR, and SPA in one app.' },
    { area: 'SSR', detail: 'useFetch/useAsyncData fetch on the server and transfer payloads to the client, while useState keeps shared state per-request to avoid cross-user leaks.' },
    { area: 'Vue', detail: 'Nuxt is the standard upgrade path when a Vue SPA needs SEO, faster first paint, or a backend layer without standing up a separate server.' },
    { area: 'Pinia', detail: 'Pinia integrates with Nuxt via a module and is SSR-aware, hydrating store state from the server payload on the client.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'SSR/SSG deliver fast first contentful paint and SEO-ready HTML out of the box.',
      'Per-route prerendering (SSG) enables CDN caching and near-instant loads for static content.',
    ],
    bad: [
      'Universal SSR adds server CPU cost per request and a hydration step on the client.',
      'Over-fetching in useAsyncData or large payloads inflate the transferred __NUXT__ state.',
    ],
    optimizations: [
      'Use routeRules to prerender static routes and reserve SSR for dynamic ones.',
      'Trim and pick only needed fields to keep the hydration payload small.',
      'Lazy-load components and use islands/ClientOnly to reduce shipped/hydrated JS.',
      'Cache server responses (Nitro caching/route cache) to cut SSR cost.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue', 'vue-router-basics', 'ssr-hydration', 'data-fetching-patterns'],
    nextConcepts: ['ssr-hydration', 'state-management-overview', 'project-structure', 'vite-vue'],
    dependencyNote:
      'Nuxt builds on core Vue, vue-router, and especially SSR/hydration and data-fetching concepts. Understand SSR/hydration and routing first; Nuxt then packages them with conventions plus a server engine. It connects to state management and project structure as you scale.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the request hitting the Nitro server, running the Vue app + useFetch to produce filled HTML.',
      'Show the HTML plus the __NUXT__ payload shipped to the browser for fast paint and SEO.',
      'Draw the hydration step: JS loads, Vue attaches to existing DOM, reuses the payload.',
      'Add file-based routing (pages/[id].vue → /:id) and the three modes SSR/SSG/SPA via routeRules.',
      'Conclude: "Use useFetch for SSR data and useState (not a module ref) for shared state to avoid cross-request leaks; keep render deterministic to avoid hydration mismatches."',
    ],
    diagram: '  request → Nitro: run app + useFetch → HTML + __NUXT__ payload\n                 │ ship ready HTML (SEO, fast paint)\n                 ▼\n             browser → load JS → HYDRATE (reuse DOM + payload)\n\n  pages/users/[id].vue → /users/:id   server/api/* → backend\n  routeRules: SSG (prerender) | SSR | SPA (ssr:false)\n  useState = per-request state (no leaks)  |  module ref = LEAKS',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Nuxt is the Vue meta-framework: SSR/SSG/SPA rendering, file-based routing (pages/), auto-imports, data fetching (useFetch/useAsyncData), per-request shared state (useState), layouts/middleware, and a Nitro server/API layer. SSR renders HTML on the server for SEO and fast paint, then hydrates on the client, transferring the payload so it does not refetch. Use useState not a module-level ref to avoid cross-request state leaks, keep render deterministic to avoid hydration mismatches, and pick rendering mode per route with routeRules.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Nuxt is the leading meta-framework for Vue — it sits on top of Vue 3, Vite, and a server engine called Nitro, and it turns Vue from a client-side library into a full-stack application framework. The headline feature is rendering flexibility: Nuxt can do server-side rendering, where each request is rendered to HTML on the server, static site generation, where pages are prerendered at build time, and plain client-side SPA rendering, and crucially you can choose the mode per route using routeRules. SSR gives you SEO and a fast first paint because the browser receives fully-formed HTML; then the JavaScript loads and hydrates, attaching event listeners and reactivity to the existing DOM rather than re-rendering it. Around that, Nuxt removes a lot of boilerplate with conventions: file-based routing, where a file in the pages directory automatically becomes a route and bracketed filenames like [id] become dynamic segments; auto-imports, so components and composables are available without import lines; layouts and middleware; and a server directory where you write real backend API routes powered by Nitro, so you do not need a separate Express server. For data, you use useFetch or useAsyncData instead of fetching in onMounted, because they run on the server during SSR and then serialise the result into the page payload so the client reuses it instead of refetching. Two things trip people up. First, for shared or global state you must use useState, not a module-level ref, because on the server the module is a singleton shared across all requests, so a module ref would leak one user\'s state into another\'s. Second, hydration mismatches happen when the server HTML differs from the client\'s first render — using Date.now, Math.random, or window during render — so you keep rendering deterministic and defer browser-only code to onMounted or ClientOnly. In short, Nuxt is what you reach for when a Vue app needs SEO, performance, and a backend.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'SSR vs SSG vs SPA: SSR is dynamic and SEO-friendly but costs server CPU per request; SSG is fastest and cacheable but stale until rebuild; SPA is simplest but no SEO/slow first paint.',
      'Convention vs flexibility: Nuxt\'s conventions remove decisions and boilerplate but can feel magical and constrain unusual setups.',
      'Auto-imports improve DX but obscure where symbols come from and can complicate tooling and explicit dependency tracking.',
    ],
    edgeCases: [
      'Module-level state leaks across requests on the server — always useState for shared state.',
      'Hydration mismatches from non-deterministic render (random/time/locale) or browser-only APIs.',
      'Large transferred payloads bloat HTML; keys must match between server and client useFetch calls.',
      'Third-party libraries that touch window at import time break SSR and need client-only loading.',
    ],
    runtimeBehavior: [
      'Nitro renders the app per request (SSR) and serialises state into __NUXT__ for client hydration.',
      'useFetch/useAsyncData dedupe via keys and transfer results to avoid double fetching.',
      'Hydration reuses server DOM; mismatches force a costly client re-render and warnings.',
    ],
    scalability: [
      'Hybrid rendering (routeRules) lets you prerender/cache static routes and reserve SSR compute for dynamic ones.',
      'Nitro caching and edge/serverless deployment targets scale SSR cost-effectively.',
    ],
    productionConcerns: [
      'Watch payload size and server response times; cache aggressively where data permits.',
      'Audit SSR-unsafe state (module refs) and browser-only code to prevent leaks and crashes.',
      'Plan SSG rebuild/ISR strategy so static content does not go stale.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Nuxt = Vue meta-framework on Vite + Nitro server.',
    'Rendering modes: SSR, SSG, SPA — choose per route via routeRules.',
    'File-based routing: pages/[id].vue → /:id.',
    'Auto-imports for components/ and composables/.',
    'Data: useFetch/useAsyncData run on server, transfer payload (no double fetch).',
    'Shared state: useState (per-request) — NOT a module-level ref (leaks!).',
    'Backend: server/api/*.ts via Nitro (defineEventHandler).',
    'SEO: useSeoMeta / useHead inject meta into server HTML.',
    'Hydration mismatch = server HTML ≠ client render; keep render deterministic.',
    'Browser-only code → onMounted / <ClientOnly> / import.meta.client.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show the pages/ files that produce the routes / , /about , and /users/:id.',
      hint: 'File names map directly to routes; brackets mean dynamic.',
      solution: {
        lang: 'text',
        code: 'pages/index.vue        → /\npages/about.vue        → /about\npages/users/[id].vue   → /users/:id',
        explanation: [
          'index.vue maps to the parent path.',
          '[id].vue creates a dynamic segment read via route.params.id.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Fetch a list of products on the server during SSR and render them.',
      hint: 'Use useFetch with await in <script setup>.',
      solution: {
        lang: 'js',
        code: '// pages/products.vue\n// <script setup>\nconst { data: products, pending } = await useFetch(\'/api/products\')\n// </script>\n// <template>\n//   <p v-if="pending">Loading...</p>\n//   <li v-else v-for="p in products" :key="p.id">{{ p.name }}</li>\n// </template>',
        explanation: [
          'useFetch runs on the server during SSR so the HTML ships populated.',
          'The result is transferred to the client, avoiding a second request after hydration.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a shared, SSR-safe counter composable and explain why a module ref is wrong.',
      hint: 'Use useState with a key.',
      solution: {
        lang: 'js',
        code: '// composables/useCounter.ts\nexport function useCounter() {\n  const count = useState(\'counter\', () => 0)\n  return { count, inc: () => count.value++ }\n}\n// ❌ const count = ref(0) at module scope would be shared across ALL\n//    SSR requests, leaking one user\'s value to another.',
        explanation: [
          'useState scopes the value per request on the server and hydrates it on the client.',
          'A module-level ref is a server singleton, so different users would see each other\'s state.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Configure a Nuxt app to prerender the marketing site (SSG) but render the dashboard as a client-only SPA, and explain why.',
      hint: 'Use routeRules in nuxt.config.',
      solution: {
        lang: 'js',
        code: '// nuxt.config.ts\nexport default defineNuxtConfig({\n  routeRules: {\n    \'/\': { prerender: true },\n    \'/blog/**\': { prerender: true },   // SSG: cacheable, SEO\n    \'/app/**\': { ssr: false },         // SPA: behind auth, no SEO need\n  },\n})',
        explanation: [
          'Marketing/blog pages are prerendered (SSG) for speed, caching, and SEO.',
          'The authenticated dashboard is SPA-only because it needs no SEO and avoids per-request SSR cost.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Nuxt is how Vue apps go to production with SEO and performance, so understanding it signals you can ship real products, not just SPAs. Explaining SSR, hydration, and rendering trade-offs cleanly is a strong senior indicator that comes up frequently.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what Nuxt is and how file-based routing works. Product companies (Zoho, Flipkart, Razorpay) ask about SSR vs SSG vs SPA, useFetch vs onMounted, and SEO meta. FAANG-level rounds probe hydration mismatches, the useState SSR-leak problem, Nitro, and hybrid rendering strategy.',
    whatInterviewersExpect:
      'They expect you to position Nuxt as a Vue meta-framework, explain SSR/SSG/SPA and per-route selection, know that useFetch/useAsyncData run on the server and transfer payloads, use useState (not a module ref) for shared state, and identify hydration-mismatch causes and fixes.',
  },
}

export default nuxtOverview
