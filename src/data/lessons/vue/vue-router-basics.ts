import type { ConceptLesson } from '../../../types/lesson'

const vueRouterBasics: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue-router-basics',
  name: 'Vue Router Basics',
  category: 'routing',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Almost every real Vue app is a Single Page Application (SPA), and Vue Router is the official, near-universal way to map URLs to components — without it you only have one screen.',
    'It turns the browser URL into application state: the address bar becomes shareable, bookmarkable, and back/forward-aware, which users expect from any website.',
    'It is the entry point to the entire routing topic interviewers love — dynamic params, nested layouts, guards, and lazy loading all build on these basics.',
    'Getting the mental model right (route table -> matched component rendered in <router-view>) prevents the most common beginner confusion about why "nothing renders" or why navigation does a full page reload.',
    'It is a hard prerequisite for code-splitting and performance: lazy route components are how you keep the initial bundle small.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vue Router is the TV remote that swaps what is on the screen without ever turning the TV off.',
    story: [
      'Imagine you have one big television in your living room. Old websites were like having a different television for every channel — to change the channel you had to drag in a whole new TV (the page reloaded completely).',
      'Vue Router is a magic remote. You press a button labelled "About" or "Profile" and the picture on the SAME television instantly changes to that channel.',
      'The little label on the remote (the URL in the address bar) always shows which channel you are on, so a friend can copy that label and jump straight to the same channel.',
      'The television never flickers off and on — only the picture inside the frame changes. That frame is a special spot called <router-view>, and the remote is your set of links.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal website downloads a brand-new HTML page from the server every time you click a link. A Single Page Application loads once, then JavaScript swaps the visible content as you navigate, which feels much faster.',
    'Vue Router is a library that watches the URL. You give it a table that says "this path shows this component", and it keeps the page in sync with the address bar.',
    'You place a <router-view> in your layout — that is the empty frame where the matched component appears. You use <router-link> instead of <a> so clicks change the view without a full reload.',
    'Because the URL still updates, the browser back button, forward button, and bookmarks all keep working exactly as users expect.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue Router is the official client-side router for Vue. You define an array of routes (path -> component), create a router instance, install it on the app, and it renders the matched component into <router-view> based on the current URL.',
    how: 'You call createRouter() with a history mode (createWebHistory for clean URLs) and a routes array, then app.use(router). Inside templates you navigate with <router-link to="..."> and display the active component with <router-view />.',
    why: 'It gives you declarative, URL-driven views in an SPA so navigation is instant, shareable, and history-aware, without writing manual show/hide logic for each screen.',
    code: {
      label: 'Minimal router setup',
      lang: 'js',
      code: "import { createRouter, createWebHistory } from 'vue-router'\nimport { createApp } from 'vue'\nimport App from './App.vue'\nimport Home from './views/Home.vue'\nimport About from './views/About.vue'\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: '/', name: 'home', component: Home },\n    { path: '/about', name: 'about', component: About },\n  ],\n})\n\ncreateApp(App).use(router).mount('#app')",
      explanation: [
        'createWebHistory() uses the HTML5 History API so URLs look normal (/about) with no # hash.',
        'The routes array is the lookup table: when the URL is /about, Vue Router matches and renders the About component.',
        'app.use(router) installs it globally, registering <router-link> and <router-view> and providing $route / $router.',
        'In App.vue you would add <router-view /> where the matched component should appear.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue Router is the official routing library for Vue that maps the browser location to a component tree using a configurable route table. A router instance is created with createRouter(), given a history implementation (HTML5 history, hash, or memory) and a routes array; it reactively tracks the current location, resolves it against the matcher into a route record (with params, query, and meta), and renders the matched component into <router-view>. It integrates with Vue reactivity so the current route is a reactive object, exposes useRoute()/useRouter() composables, and supports declarative navigation via <router-link> and programmatic navigation via router.push().',

  // 7. Internal Working
  internalWorking: [
    'createRouter() builds a matcher from your routes array — it compiles each path string into a regular expression (via path-ranking) so it can match incoming URLs and extract params in priority order.',
    'The chosen history implementation (createWebHistory) wraps the browser History API and subscribes to popstate events, so back/forward and URL changes are observed.',
    'When the location changes (link click, push, or popstate), the router resolves the new URL against the matcher to produce a normalized route location object containing matched records, params, query, hash, and meta.',
    'The router runs the navigation pipeline: leave guards, global beforeEach, route-level beforeEnter, component guards, and finally beforeResolve, allowing redirects/cancellation before committing.',
    'On confirmation it updates the internal reactive currentRoute ref; because <router-view> reads this reactive value, Vue re-renders and swaps in the matched component, and afterEach hooks fire.',
    'useRoute() returns this reactive currentRoute (read-only) and useRouter() returns the router instance, so components react to navigation just like any other reactive dependency.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Browser URL: /about
        │
        ▼
   ┌──────────────────────────────────────┐
   │  Vue Router matcher (route table)      │
   │   '/'      -> Home                     │
   │   '/about' -> About   ◄── matched      │
   │   '/users/:id' -> User                 │
   └──────────────────────────────────────┘
        │ resolves to route record { name:'about', params, meta }
        ▼
   ┌──────────────────────────────────────┐
   │  App.vue layout                        │
   │   <nav> <router-link to="/about"/> </nav>
   │   <router-view/>  ◄── About renders here
   └──────────────────────────────────────┘
        ▲
        └── currentRoute is REACTIVE → swap is automatic`,

  // 9. Memory Visualization (omitted — not memory/reactivity-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — links and the view outlet',
      lang: 'vue',
      code: "<!-- App.vue -->\n<script setup>\n// nothing needed here for basic navigation\n</script>\n\n<template>\n  <nav>\n    <router-link to=\"/\">Home</router-link> |\n    <router-link to=\"/about\">About</router-link>\n  </nav>\n  <router-view />\n</template>",
      explanation: [
        '<router-link> renders an <a> but intercepts the click to navigate without a full reload.',
        'It automatically adds router-link-active / router-link-exact-active classes for styling the current link.',
        '<router-view /> is the single outlet where the matched component is injected.',
        'No imports of the page components are needed here — the router config decides what renders.',
      ],
    },
    intermediate: {
      label: 'Intermediate — named routes and reading the current route',
      lang: 'vue',
      code: "<script setup>\nimport { useRoute, useRouter } from 'vue-router'\n\nconst route = useRoute()   // reactive current route\nconst router = useRouter() // navigation methods\n\nfunction goAbout() {\n  router.push({ name: 'about' }) // navigate by NAME, not path\n}\n</script>\n\n<template>\n  <p>Current path: {{ route.path }}</p>\n  <router-link :to=\"{ name: 'about' }\">About</router-link>\n  <button @click=\"goAbout\">Go About</button>\n</template>",
      explanation: [
        'useRoute() returns the reactive route object — route.path, route.params, route.query all update on navigation.',
        'useRouter() returns the router instance used for programmatic navigation.',
        'Navigating by name ({ name: \"about\" }) is more robust than hardcoding paths — if you change the URL string later, named links keep working.',
        'Because route is reactive, the template re-renders automatically when the path changes.',
      ],
    },
    advanced: {
      label: 'Advanced — lazy-loaded route components for code splitting',
      lang: 'js',
      code: "import { createRouter, createWebHistory } from 'vue-router'\n\nconst routes = [\n  { path: '/', name: 'home', component: () => import('./views/Home.vue') },\n  {\n    path: '/dashboard',\n    name: 'dashboard',\n    // dynamic import => its own chunk, fetched only when visited\n    component: () => import('./views/Dashboard.vue'),\n    meta: { requiresAuth: true },\n  },\n]\n\nexport default createRouter({ history: createWebHistory(), routes })",
      explanation: [
        'A component defined as () => import(...) is an async component; the bundler splits it into a separate chunk.',
        'That chunk is only downloaded when the user first navigates to the route, shrinking the initial bundle.',
        'meta is arbitrary per-route data (here requiresAuth) read later by navigation guards.',
        'This is the single most impactful Vue Router performance technique and is expected knowledge in interviews.',
      ],
    },
    realProject: {
      label: 'Real project — a small app shell with a 404 catch-all',
      lang: 'js',
      code: "// router/index.js in a typical Vite + Vue app\nimport { createRouter, createWebHistory } from 'vue-router'\n\nconst router = createRouter({\n  history: createWebHistory(import.meta.env.BASE_URL),\n  routes: [\n    { path: '/', name: 'home', component: () => import('@/views/Home.vue') },\n    { path: '/products', name: 'products', component: () => import('@/views/Products.vue') },\n    { path: '/products/:id', name: 'product', component: () => import('@/views/Product.vue'), props: true },\n    // catch-all 404 — must use the param+regex syntax in Vue Router 4\n    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFound.vue') },\n  ],\n  scrollBehavior() {\n    return { top: 0 } // scroll to top on every navigation\n  },\n})\n\nexport default router",
      explanation: [
        'This mirrors the scaffold Vite/create-vue generates: a dedicated router/index.js exporting the instance.',
        "The '/:pathMatch(.*)*' catch-all is how Vue Router 4 handles 404s — the old '*' wildcard was removed.",
        'props: true passes route params as component props, decoupling the page from the router.',
        'scrollBehavior resets scroll position on navigation, matching multi-page-site expectations.',
        'BASE_URL keeps the app working when deployed under a sub-path.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Vue Router and why do SPAs need it?',
      answer: 'Vue Router is the official client-side router for Vue. In a Single Page Application the page loads once, so we need something to map the URL to which component is shown and update the view without a full reload. Vue Router does that, keeping the URL, back/forward, and bookmarks in sync with the rendered component.',
      explanation: 'A strong answer connects routing to the SPA model (one page, JS-swapped views) and names the two core pieces: a route table and <router-view>.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between <router-link> and a normal <a> tag?',
      answer: '<router-link> renders an anchor but intercepts the click to perform client-side navigation — no full page reload — and updates the URL via the History API. A plain <a> triggers a full document request to the server, discarding SPA state.',
      explanation: 'Mentioning the active-class styling and that you should still use real <a> for external links shows practical depth.',
    },
    {
      level: 'intermediate',
      question: 'What are the history modes and how do they differ?',
      answer: 'createWebHistory() uses the HTML5 History API for clean URLs (/about) but requires the server to fall back to index.html for unknown paths. createWebHashHistory() puts everything after a # (/#/about) so it works without server config. createMemoryHistory() keeps no browser URL and is used for SSR/testing.',
      explanation: 'The key senior nuance is the server rewrite requirement for HTML5 mode — a real deployment gotcha that causes 404s on refresh.',
    },
    {
      level: 'intermediate',
      question: 'How do you access the current route and the router inside <script setup>?',
      answer: 'Use the useRoute() composable for the reactive current route (params, query, path, meta) and useRouter() for the router instance to call push/replace/back. In the Options API these are this.$route and this.$router.',
      explanation: 'Emphasize that useRoute() is reactive and read-only — you must not mutate it; navigation must go through the router.',
    },
    {
      level: 'advanced',
      question: 'How does lazy loading routes improve performance, and how do you do it?',
      answer: 'Define a route component as a dynamic import: component: () => import("./Page.vue"). The bundler splits it into a separate chunk fetched only when that route is first visited, so the initial bundle stays small and time-to-interactive improves.',
      explanation: 'Bonus points for mentioning route-level chunks combined with <Suspense> or a loading guard, and webpackChunkName-style naming for analysis.',
    },
    {
      level: 'senior',
      question: 'Why does refreshing /products/42 return a 404 in production, and how do you fix it?',
      answer: 'With HTML5 history mode the browser requests /products/42 from the server, which has no such file. You must configure the server (or static host) to rewrite all unknown routes to index.html so the SPA boots and Vue Router takes over. Alternatively use hash history, which never sends the path to the server.',
      explanation: 'This is a classic real-world deployment question — naming the SPA fallback / rewrite rule (nginx try_files, Netlify _redirects) signals production experience.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between router.push and router.replace?',
    'How do you create a 404 catch-all route in Vue Router 4? (/:pathMatch(.*)*)',
    'How do route params differ from query parameters?',
    'How do you pass route params into a component as props? (props: true)',
    'How would you scroll to the top on every navigation? (scrollBehavior)',
    'What changed between Vue Router 3 (Vue 2) and Vue Router 4 (Vue 3)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using <a href="/about"> instead of <router-link to="/about"> for internal links.',
      why: 'A plain anchor triggers a full page reload, throwing away SPA state and re-downloading the bundle.',
      fix: 'Use <router-link> (or router.push) for in-app navigation; reserve <a> for external/absolute links.',
    },
    {
      mistake: 'Forgetting to place <router-view /> in the layout.',
      why: 'The router resolves the route correctly but there is no outlet to render the matched component, so the screen looks empty.',
      fix: 'Add <router-view /> to App.vue (and a nested one for child routes).',
    },
    {
      mistake: "Using the Vue Router 3 wildcard '*' for a 404 route.",
      why: 'Vue Router 4 removed the bare wildcard; it will not match and you get an unmatched-route warning.',
      fix: "Use the param-with-regex catch-all: { path: '/:pathMatch(.*)*', component: NotFound }.",
    },
    {
      mistake: 'Deploying HTML5 history mode without a server fallback to index.html.',
      why: 'Direct hits or refreshes on deep URLs 404 because the server has no matching file.',
      fix: 'Configure SPA fallback (nginx try_files, Netlify/Vercel rewrites) or switch to hash history.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Router is the de facto routing layer in virtually every non-trivial Vue SPA; create-vue scaffolds a router/index.js and a views/ folder by default.' },
    { area: 'Nuxt', detail: 'Nuxt builds on Vue Router with file-based routing — files in the pages/ directory auto-generate the routes array, and you still use useRoute()/useRouter() and navigateTo().' },
    { area: 'Component library', detail: 'Design systems expose link components that wrap <router-link> (with an "as" prop) so buttons and cards can navigate consistently while staying framework-agnostic.' },
    { area: 'SSR', detail: 'Server-rendered Vue apps use createMemoryHistory on the server to resolve the route for a request and createWebHistory on the client for hydration.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'SPA navigation avoids full page reloads, so switching views is near-instant after the first load.',
      'Lazy route components split the bundle so users only download code for routes they actually visit.',
    ],
    bad: [
      'Eagerly importing every view (static imports) bloats the initial bundle and slows time-to-interactive.',
      'Heavy synchronous work in components rendered by <router-view> can make navigation feel janky even though no network request occurs.',
    ],
    optimizations: [
      'Use dynamic import() for route components to enable route-level code splitting.',
      'Prefetch likely-next chunks (e.g. on link hover) to hide the lazy-load latency.',
      'Combine lazy routes with <Suspense> and skeletons so navigation never shows a blank frame.',
      'Use scrollBehavior and keep-alive selectively to avoid re-rendering expensive lists on back navigation.',
    ],
  },

  // 16. Security Considerations (omitted — no strong security angle at the basics level)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'single-file-components', 'declarative-rendering'],
    nextConcepts: ['dynamic-routes', 'nested-routes', 'navigation-guards', 'programmatic-navigation', 'route-params-query'],
    dependencyNote:
      'Vue Router Basics is the gateway to the entire routing spine. You need components and SFCs first; once you grasp the route table and <router-view>, you can layer on dynamic params, nested layouts, programmatic navigation, and guards.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the browser address bar with a URL like /about.',
      'Draw a box labelled "route table" mapping paths to components, and circle the /about -> About match.',
      'Draw the App layout containing a <nav> with <router-link>s and a single <router-view/> frame.',
      'Draw an arrow from the matched component (About) into the <router-view/> frame.',
      'Say: "The current route is reactive, so when the URL changes the router swaps which component fills <router-view> — no reload, URL stays shareable."',
    ],
    diagram: `  URL /about
     │ match
     ▼
  [ routes: '/'->Home, '/about'->About ]
     │
     ▼
  ┌ App ─────────────────────┐
  │ <router-link>…</router-link>
  │ <router-view/>  ← About  │
  └──────────────────────────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue Router is the official client-side router for Vue. You create a router with a history mode and a routes array mapping paths to components, install it with app.use(router), then navigate using <router-link> and render the matched component in <router-view>. The current route is reactive, accessed via useRoute(), and you navigate programmatically with useRouter().push(). It keeps the URL, back/forward, and bookmarks in sync without full page reloads. Use dynamic imports for lazy route components to keep the bundle small.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue Router is the official routing library for Vue and the backbone of almost every Vue single-page app. In an SPA the document loads once, so instead of the server returning a new page per URL, the router maps the URL to a component and swaps the view client-side. You set it up by calling createRouter with a history mode and a routes array — each route says "this path renders this component". createWebHistory gives clean URLs but needs the server to fall back to index.html, while createWebHashHistory uses a hash so it works without server config. You install it with app.use(router). In your layout you put a single <router-view> as the outlet where the matched component renders, and you navigate using <router-link to="..."> which intercepts the click for client-side navigation instead of a full reload. In script setup you read the reactive current route with useRoute and navigate imperatively with useRouter().push, optionally using named routes for robustness. Because the current route is reactive, the view updates automatically when the URL changes, and the back button, forward button, and bookmarks all keep working. The most important performance practice is lazy-loading route components with dynamic import so each route becomes its own chunk loaded on demand, keeping the initial bundle small. A common production gotcha is that refreshing a deep URL 404s under HTML5 history unless you configure an SPA fallback on the server.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'HTML5 history (clean URLs, needs server rewrite) vs hash history (works on any static host but uglier URLs and worse SEO) — choose based on deployment control.',
      'Centralized routes array (easy to audit, can grow huge) vs file-based routing (Nuxt/unplugin-vue-router — less boilerplate but more "magic").',
      'Eager vs lazy route components: lazy shrinks initial load but adds a per-navigation fetch you must mask with prefetch/Suspense.',
    ],
    edgeCases: [
      'Refreshing or deep-linking to a nested route under HTML5 mode 404s without an index.html fallback.',
      'The Vue Router 4 catch-all must use /:pathMatch(.*)* — the old * wildcard silently fails to match.',
      'Navigating to the same route with only param changes reuses the component instance (no unmount), so you must watch route.params or use a :key.',
      'router.push returns a promise that can reject on redirect/abort — unhandled rejection warnings surface in guard-heavy apps.',
    ],
    runtimeBehavior: [
      'currentRoute is a reactive ref; <router-view> and useRoute() subscribe to it, so navigation triggers normal Vue re-rendering.',
      'The matcher ranks routes by specificity, not array order alone, so a static path can win over a dynamic one regardless of position.',
      'Navigation is asynchronous and runs through a guard pipeline; it can be cancelled or redirected before the view ever changes.',
    ],
    scalability: [
      'Large apps split routes into per-feature modules and merge them, often combined with route-level lazy loading.',
      'Per-route meta + a single global guard centralizes auth/title/analytics logic instead of repeating it per component.',
      'Prefetching next-likely chunks on hover/idle keeps perceived navigation instant as the route count grows.',
    ],
    productionConcerns: [
      'Server SPA-fallback configuration (nginx try_files, Netlify/Vercel rewrites) is mandatory for HTML5 mode.',
      'Stale chunk errors after a deploy: hashed lazy chunks 404 for users on an old index — handle with a reload-on-chunk-error strategy.',
      'SEO/crawlability of client-rendered routes may require SSR/prerendering (Nuxt) for marketing pages.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'createRouter({ history, routes }) then app.use(router).',
    'createWebHistory = clean URLs (needs server fallback); createWebHashHistory = # URLs (no server config).',
    'Route record: { path, name?, component, props?, meta?, children? }.',
    '<router-view /> = outlet; <router-link to> = SPA link (not <a>).',
    'useRoute() = reactive current route; useRouter() = navigation methods.',
    'Navigate by name when possible: router.push({ name: "user", params: { id } }).',
    'Lazy load: component: () => import("./Page.vue").',
    '404 catch-all (v4): { path: "/:pathMatch(.*)*", component: NotFound }.',
    'props: true passes params as component props.',
    'scrollBehavior() controls scroll on navigation.',
    'Options API uses this.$route / this.$router.',
    'Refresh-404 on deep links = missing index.html fallback.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a router with two routes: / -> Home and /contact -> Contact, using clean (HTML5) URLs, and install it on the app.',
      hint: 'Use createWebHistory() and app.use(router).',
      solution: {
        lang: 'js',
        code: "import { createApp } from 'vue'\nimport { createRouter, createWebHistory } from 'vue-router'\nimport App from './App.vue'\nimport Home from './views/Home.vue'\nimport Contact from './views/Contact.vue'\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: '/', name: 'home', component: Home },\n    { path: '/contact', name: 'contact', component: Contact },\n  ],\n})\n\ncreateApp(App).use(router).mount('#app')",
        explanation: [
          'createWebHistory() gives clean URLs without a hash.',
          'Each route maps a path to a component; names make later navigation robust.',
          'app.use(router) registers <router-link>, <router-view>, and the composables.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'In a layout SFC, add navigation links to Home and Contact and the outlet that renders the matched page.',
      hint: 'Use <router-link> for the links and a single <router-view />.',
      solution: {
        lang: 'vue',
        code: "<template>\n  <header>\n    <nav>\n      <router-link to=\"/\">Home</router-link>\n      <router-link to=\"/contact\">Contact</router-link>\n    </nav>\n  </header>\n  <main>\n    <router-view />\n  </main>\n</template>",
        explanation: [
          '<router-link> performs client-side navigation and auto-adds active classes.',
          '<router-view /> is the single outlet where the matched page renders.',
          'No component imports are needed in the layout — the router config decides what shows.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Convert all route components to be lazy-loaded and add a 404 page using the Vue Router 4 catch-all syntax.',
      hint: 'Dynamic import() per component and /:pathMatch(.*)* for the wildcard.',
      solution: {
        lang: 'js',
        code: "import { createRouter, createWebHistory } from 'vue-router'\n\nexport default createRouter({\n  history: createWebHistory(),\n  routes: [\n    { path: '/', name: 'home', component: () => import('./views/Home.vue') },\n    { path: '/contact', name: 'contact', component: () => import('./views/Contact.vue') },\n    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('./views/NotFound.vue') },\n  ],\n})",
        explanation: [
          'Each () => import(...) becomes its own bundle chunk loaded on demand.',
          'The /:pathMatch(.*)* catch-all matches any unmatched URL for a 404 page.',
          'This is the standard production setup for code-split routing in Vue Router 4.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'In <script setup>, write a function that navigates to a named "profile" route by id, and display the current path reactively in the template.',
      hint: 'useRouter().push({ name, params }) and useRoute().path.',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { useRoute, useRouter } from 'vue-router'\n\nconst route = useRoute()\nconst router = useRouter()\n\nfunction openProfile(id) {\n  router.push({ name: 'profile', params: { id } })\n}\n</script>\n\n<template>\n  <p>You are at: {{ route.path }}</p>\n  <button @click=\"openProfile(42)\">Open profile 42</button>\n</template>",
        explanation: [
          'useRouter() gives the imperative push method; navigating by name avoids hardcoding URLs.',
          'params supplies the dynamic segment for the named route.',
          'useRoute() is reactive, so {{ route.path }} updates automatically after navigation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Routing is one of the first things you build in any real Vue app, so interviewers treat Vue Router basics as table stakes. Demonstrating a clear mental model — route table to <router-view>, reactive current route, lazy loading — signals you can structure an actual application, not just toy components.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition, <router-link> vs <a>, and history modes. Product companies (Zoho, Flipkart, Razorpay) ask you to set up routes live, explain lazy loading, and debug the refresh-404 issue. FAANG-level interviews probe the navigation pipeline, matcher ranking, SSR memory history, and chunk-stale strategies.',
    whatInterviewersExpect:
      'They expect you to scaffold a router from memory, explain why SPAs need it, distinguish the history modes and their deployment implications, read/navigate the route reactively with the composables, and lazy-load components for performance.',
  },
}

export default vueRouterBasics
