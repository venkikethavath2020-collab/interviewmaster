import type { ConceptLesson } from '../../../types/lesson'

const dynamicRoutes: ConceptLesson = {
  // 1. Concept Summary
  slug: 'dynamic-routes',
  name: 'Dynamic Route Matching',
  category: 'routing',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Real apps have thousands of detail pages — /users/1, /users/2, /products/42 — and you cannot define a route for each; dynamic segments let one route handle them all.',
    'Reading route.params is how you know WHICH entity to fetch, so it is the bridge between the URL and your data layer.',
    'The single most common dynamic-routes bug — the component not refetching when only the id changes — appears constantly in production and in interviews.',
    'It unlocks REST-shaped URLs (/posts/:id/comments/:commentId), optional segments, and repeatable params, which are expected in any serious routing answer.',
    'Combined with props: true it lets you decouple components from the router entirely, improving testability and reuse.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A dynamic route is a fill-in-the-blank mailbox: "/users/____" where the blank is whoever you are looking for.',
    story: [
      'Imagine an apartment building with one hallway sign that reads "Apartment number ___". The sign works for every apartment — you just read the number in the blank.',
      'Instead of printing a separate sign for apartment 1, apartment 2, apartment 3, and so on forever, you have ONE smart sign that fits any number.',
      'Vue Router does the same thing. You write a route like /users/:id, and the :id is the blank. When someone visits /users/7, the router fills the blank with 7 and tells your page "show me user number 7".',
      'The page reads that number and goes to fetch the right person — all with a single rule instead of a million.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Instead of writing a separate route for every item, you write a pattern with a placeholder, like /users/:id. The :id part is called a route parameter.',
    'When the URL is /users/42, the router captures 42 and stores it in route.params.id, which your component reads to decide what to show.',
    'One route definition now serves an unlimited number of pages, because the parameter changes while the rule stays the same.',
    'A subtle catch: if you go from /users/1 to /users/2, the same component is reused (not recreated), so you must watch the parameter to load the new data.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Dynamic route matching uses parameter segments (prefixed with a colon) in a path so one route record matches many URLs. The captured values appear on route.params and identify which resource to render.',
    how: "You define { path: '/users/:id', component: User }. The router compiles the path to a regex, extracts the :id segment, and exposes it as route.params.id. You read it with useRoute() (or pass it as a prop with props: true) and fetch accordingly.",
    why: 'It collapses an unbounded set of pages into a single declarative rule, keeping the route table small and tying the URL directly to your data identity.',
    code: {
      label: 'A single route for every user',
      lang: 'js',
      code: "import { createRouter, createWebHistory } from 'vue-router'\nimport User from './views/User.vue'\n\nexport default createRouter({\n  history: createWebHistory(),\n  routes: [\n    // :id is a dynamic segment — matches /users/1, /users/abc, etc.\n    { path: '/users/:id', name: 'user', component: User },\n  ],\n})",
      explanation: [
        'The :id segment turns this one record into a matcher for any /users/<something> URL.',
        'When matched, route.params.id holds the captured value (always a string).',
        'name: "user" lets you navigate with router.push({ name: "user", params: { id: 7 } }).',
        'No separate route is needed per user — the pattern handles them all.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Dynamic route matching is the mechanism by which Vue Router maps a parameterized path pattern to many concrete URLs. Path segments prefixed with a colon (e.g. :id) become named parameters; the router compiles the path into a ranked regular expression that extracts those segments into a reactive route.params object (values are strings). Patterns support custom regex constraints (:id(\\d+)), optional segments (:id?), repeatable params (:chapters+ / :chapters*), and a catch-all (/:pathMatch(.*)*). Because navigating between two URLs that match the same record reuses the component instance, params must be observed reactively (watch or a :key) to trigger re-fetching.',

  // 7. Internal Working
  internalWorking: [
    'At router creation, each path string is parsed into tokens; static text becomes literal regex and :param tokens become capture groups, optionally constrained by an inline regex like :id(\\d+).',
    'Routes are ranked by a scoring algorithm so more specific paths (static, constrained) win over looser ones (params, catch-all), independent of array order.',
    'On navigation the incoming URL is tested against the ranked matchers; the first match yields a route record plus a params object built from the named capture groups.',
    'The matched location is normalized and committed to the reactive currentRoute; route.params is reactive, so anything reading it can re-render.',
    'Crucially, when the new and old locations resolve to the SAME route record, Vue Router reuses the existing component instance (it does not unmount/remount), only updating route.params.',
    'Therefore data loading tied to a param must use watch(() => route.params.id, ...) or a :key on <router-view>/the component, or beforeRouteUpdate, to react to the param change.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Route pattern:  /users/:id
                          │
        ┌─────────────────┴─────────────────┐
        ▼                 ▼                  ▼
   /users/1          /users/42          /users/abc
        │                 │                  │
        └──── all match the SAME record ─────┘
                          │
                params = { id: '1' | '42' | 'abc' }   (strings!)
                          │
        1 -> 2 navigation: SAME component instance reused
                          │
              ⇒ watch(() => route.params.id) to refetch`,

  // 9. Memory Visualization (omitted — not memory-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — read a single param',
      lang: 'vue',
      code: "<script setup>\nimport { useRoute } from 'vue-router'\nconst route = useRoute()\n// URL /users/42  =>  route.params.id === '42'\n</script>\n\n<template>\n  <h1>User #{{ route.params.id }}</h1>\n</template>",
      explanation: [
        'route.params.id holds the captured segment as a string (note: not a number).',
        'useRoute() is reactive, so the heading updates if the id changes.',
        'This component is rendered by the /users/:id route record.',
        'Convert to a number explicitly if you need one: Number(route.params.id).',
      ],
    },
    intermediate: {
      label: 'Intermediate — refetch when only the param changes',
      lang: 'vue',
      code: "<script setup>\nimport { ref, watch } from 'vue'\nimport { useRoute } from 'vue-router'\n\nconst route = useRoute()\nconst user = ref(null)\n\nasync function load(id) {\n  user.value = await fetch('/api/users/' + id).then(r => r.json())\n}\n\n// immediate: run once on mount, then on every id change\nwatch(() => route.params.id, (id) => load(id), { immediate: true })\n</script>\n\n<template>\n  <p v-if=\"user\">{{ user.name }}</p>\n</template>",
      explanation: [
        'Going from /users/1 to /users/2 reuses this component, so onMounted alone would NOT refetch.',
        'watch on route.params.id fires whenever the id changes, loading the new user.',
        'immediate: true also runs the loader on the initial mount, replacing onMounted.',
        'This watch pattern is the canonical fix for the "stale detail page" bug.',
      ],
    },
    advanced: {
      label: 'Advanced — multiple, constrained, and optional params',
      lang: 'js',
      code: "const routes = [\n  // nested resource ids\n  { path: '/posts/:postId/comments/:commentId', name: 'comment', component: () => import('./Comment.vue') },\n  // numeric-only constraint via inline regex\n  { path: '/orders/:id(\\\\d+)', name: 'order', component: () => import('./Order.vue') },\n  // optional segment\n  { path: '/docs/:section?', name: 'docs', component: () => import('./Docs.vue') },\n  // repeatable params (zero or more)\n  { path: '/files/:path(.*)*', name: 'file', component: () => import('./File.vue') },\n]",
      explanation: [
        'route.params.postId and route.params.commentId capture both nested ids.',
        ":id(\\d+) only matches digits, so /orders/abc falls through to other routes (or 404).",
        ":section? makes the segment optional — /docs and /docs/intro both match.",
        'The repeatable/catch-all form captures slash-separated segments into an array-like param.',
      ],
    },
    realProject: {
      label: 'Real project — decoupled detail page via props: true',
      lang: 'js',
      code: "// router\nconst routes = [\n  {\n    path: '/products/:id(\\\\d+)',\n    name: 'product',\n    component: () => import('@/views/Product.vue'),\n    props: true, // route.params -> component props\n  },\n]",
      explanation: [
        'props: true passes route.params.id as the id prop, so Product.vue declares defineProps<{ id: string }>().',
        'The component no longer imports useRoute, making it trivially testable in isolation.',
        "The (\\d+) constraint guards against non-numeric ids reaching your data layer.",
        'Watching the id prop (or a :key) still handles param-only navigation between products.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you define a route that matches any user id?',
      answer: "Use a dynamic segment: { path: '/users/:id', component: User }. The :id placeholder matches any value in that position, and the captured value is available as route.params.id.",
      explanation: 'A good answer names the colon-prefixed param and where the value lands (route.params), noting it is always a string.',
    },
    {
      level: 'beginner',
      question: 'Are route params strings or their original types?',
      answer: 'Always strings. /users/42 gives route.params.id === "42", not the number 42. Convert explicitly with Number() if you need a numeric value.',
      explanation: 'This trips up beginners who compare params to numeric ids; mentioning explicit coercion shows attention to detail.',
    },
    {
      level: 'intermediate',
      question: 'Why does the detail page not reload data when navigating from /users/1 to /users/2?',
      answer: 'Both URLs match the same route record, so Vue Router reuses the existing component instance instead of unmounting and remounting it. onMounted runs only once, so data is never refetched. You fix it by watching route.params.id, using beforeRouteUpdate, or putting a :key on the component/<router-view> to force a remount.',
      explanation: 'This is THE signature dynamic-routes question — naming all three fixes (watch, guard, :key) and explaining reuse signals real experience.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between params and query?',
      answer: 'Params are part of the path pattern (/users/:id) and identify a resource; changing one usually means a different page. Query (?sort=asc) is appended after ? and typically holds filters/state that do not define the route. Params must match the route definition; query is free-form and optional.',
      explanation: 'Strong candidates note that omitting a required param breaks the match, while query is always optional.',
    },
    {
      level: 'advanced',
      question: 'How do you restrict a param to digits or make it optional?',
      answer: "Add an inline regex for constraints — :id(\\d+) matches only digits — and a ? suffix for optional — :section?. Repeatable params use + (one or more) or * (zero or more), e.g. :path(.*)* for a catch-all.",
      explanation: 'Knowing the inline-regex and modifier syntax distinguishes someone who has built REST-shaped routing from someone who only knows :id.',
    },
    {
      level: 'senior',
      question: 'How does Vue Router decide which route wins when multiple patterns could match the same URL?',
      answer: 'It compiles each path to a regex and assigns a rank/score based on segment specificity — static segments outrank params, constrained params outrank loose ones, and the catch-all ranks lowest. The highest-ranked match wins regardless of array order, though equal-rank ties fall back to definition order.',
      explanation: 'Mentioning that ordering is by specificity (not array position) and where the catch-all sits is a senior-level detail many miss.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you force a full remount on param change? (:key on <router-view> or the component)',
    'What is beforeRouteUpdate and when do you use it over a watch?',
    'How do you pass params to a named route programmatically?',
    'What happens if a required param is missing during router.push by name?',
    'How do repeatable params (+ and *) serialize into route.params?',
    'How do you validate/sanitize params before fetching?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying on onMounted to load data on a dynamic detail page.',
      why: 'Navigating between two URLs of the same route reuses the instance, so onMounted runs only once and the page goes stale.',
      fix: 'watch(() => route.params.id, load, { immediate: true }), or use beforeRouteUpdate, or a :key to force remount.',
    },
    {
      mistake: 'Comparing route.params.id (a string) to a numeric id.',
      why: 'route.params values are always strings, so "42" === 42 is false and lookups silently miss.',
      fix: 'Coerce explicitly: Number(route.params.id), or constrain the route with :id(\\d+) and parse once.',
    },
    {
      mistake: 'Passing query data through params or vice versa.',
      why: 'Params must be declared in the path pattern; undeclared params are dropped, and filters belong in query.',
      fix: 'Use params for identity segments declared in the path, query for optional filters/state.',
    },
    {
      mistake: 'Assuming array order decides which dynamic route matches.',
      why: 'Vue Router ranks by specificity, so a static or constrained route can win even if listed after a loose one.',
      fix: 'Trust the ranking, but add inline regex constraints to make intent explicit and avoid accidental overlaps.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every entity detail page (/users/:id, /products/:id, /orders/:id) is a dynamic route; props: true plus a watch on the id is the standard fetch pattern.' },
    { area: 'Nuxt', detail: 'File-based routing maps pages/users/[id].vue to /users/:id automatically; you read params via useRoute() and fetch with useAsyncData keyed to the id.' },
    { area: 'Pinia', detail: 'Detail pages commonly call a store action with route.params.id to load and cache an entity, watching the param to switch records.' },
    { area: 'Component library', detail: 'Breadcrumb and tab components read multiple params (/:postId/comments/:commentId) to render hierarchical navigation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'One parameterized record matches unlimited URLs, keeping the route table tiny and matching fast.',
      'Reusing the same component instance across param changes avoids remount cost when you only need to swap data.',
    ],
    bad: [
      'Forcing a :key remount on every param change throws away the instance and re-runs setup, which is wasteful for cheap data swaps.',
      'Unbounded catch-all/regex params can match more than intended, causing surprise renders or extra fetches.',
    ],
    optimizations: [
      'Prefer watch over :key when only data changes, reserving :key for cases that truly need a fresh instance.',
      'Cache fetched entities in a store keyed by id so revisiting a param is instant.',
      'Constrain params (:id(\\d+)) so invalid URLs 404 early instead of triggering doomed fetches.',
      'Debounce or cancel in-flight requests when params change rapidly (e.g. fast back/forward).',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Route params are user-controlled strings interpolated into API calls and queries; trusting them blindly invites injection or IDOR (accessing another user’s resource).',
      'Rendering an unsanitized param into the DOM (e.g. via v-html) is an XSS vector.',
    ],
    bestPractices: [
      'Validate/whitelist params (constrain with regex, parse and bound-check ids) before using them in requests.',
      'Enforce authorization on the server for the requested id — never rely on the client route to gate access.',
      'Never feed a raw param into v-html; interpolate with {{ }} which escapes by default.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'route-params-query'],
    nextConcepts: ['nested-routes', 'navigation-guards', 'programmatic-navigation', 'route-meta-lazy-loading'],
    dependencyNote:
      'Dynamic route matching builds directly on Vue Router Basics and the params/query distinction. Once you can match many URLs with one record, nested routes compose detail layouts, guards protect them, and programmatic navigation pushes to them by name with params.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      "Write a single route /users/:id and three example URLs (/users/1, /users/2, /users/abc) under it.",
      'Draw arrows from all three URLs to the same route record to show one rule serves many pages.',
      'Write params = { id: "1" } and circle the quotes to stress params are strings.',
      'Draw the 1 -> 2 navigation and label "SAME instance reused".',
      'Say: "Because the instance is reused, I watch route.params.id with immediate:true to refetch — that is the classic gotcha."',
    ],
    diagram: `  /users/:id
   ┌───┬───┬─────┐
   1   2   abc        all → same record
        │
   params = { id: '2' }  (string)
        │
   1→2 reuse instance ⇒ watch(()=>route.params.id) to refetch`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Dynamic route matching uses colon-prefixed segments like /users/:id so one route record matches many URLs. The captured value lands on route.params (always a string). You can constrain with inline regex (:id(\\d+)), make segments optional (:id?), repeat them (+/*), or pass them as props with props: true. The classic gotcha: navigating between two URLs of the same route reuses the component instance, so you must watch route.params.id (or use beforeRouteUpdate or :key) to refetch data.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Dynamic route matching lets one route definition serve an unbounded set of URLs. Instead of a route per user, you write /users/:id, where :id is a named parameter. Vue Router compiles that path into a regular expression, and when a URL like /users/42 comes in, it captures 42 and exposes it as route.params.id — always a string, so I coerce with Number when I need a number. I read params with useRoute, or I add props: true so the param is passed as a prop and the component stays decoupled and testable. The syntax is rich: I can constrain a param to digits with :id(\\d+), make it optional with :id?, repeat it with + or *, and define a catch-all with /:pathMatch(.*)* for 404s. The most important behavior to know is component reuse: when I navigate from /users/1 to /users/2, both URLs match the same route record, so Vue Router reuses the existing component instance rather than remounting it. That means onMounted runs only once and the page would show stale data. The fix is to watch route.params.id with immediate:true and refetch, or use the beforeRouteUpdate guard, or put a :key on the component to force a remount when I genuinely need a fresh instance. One more nuance for senior level: when multiple patterns could match, Vue Router ranks them by specificity — static and constrained segments outrank loose params and the catch-all — so the winner is not just about array order. And because params are user-controlled, I always validate them and enforce authorization on the server.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'watch on params (reuse, cheap, preserves scroll/state) vs :key remount (clean slate, simpler, but discards instance state and re-runs setup).',
      'Loose params (flexible) vs constrained regex params (safer, self-documenting, earlier 404s but more verbose).',
      'props: true decoupling (testable, no router import) vs reading useRoute directly (less boilerplate but couples the component to routing).',
    ],
    edgeCases: [
      'Same-record navigation reuses the instance — the root cause of stale detail pages.',
      'Missing a required param in router.push by name throws/aborts navigation.',
      'Repeatable params (* / +) produce array-shaped params that need different handling than single segments.',
      'Encoded characters in params (slashes, spaces) require decodeURIComponent awareness and can break naive matching.',
    ],
    runtimeBehavior: [
      'route.params is reactive, so computed/watch/templates that read it update on navigation without manual wiring.',
      'Matching is regex-based and ranked by specificity at creation time, so matching itself is O(routes) per navigation but cheap.',
      'beforeRouteUpdate fires on same-component param changes — distinct from beforeRouteEnter which only runs on entry.',
    ],
    scalability: [
      'Cache entities by id in a Pinia store so repeated visits to a param avoid refetching.',
      'Cancel in-flight requests on rapid param changes (AbortController) to prevent race conditions where an older response overwrites a newer one.',
      'Constrain params to reduce wasted fetches and to keep the matcher unambiguous as route count grows.',
    ],
    productionConcerns: [
      'IDOR: a malicious user can edit the id in the URL — authorization must be enforced server-side, not by hiding routes.',
      'Out-of-order async responses when params change quickly can show the wrong entity; track the requested id and ignore stale responses.',
      'Deep-linking to a dynamic URL must still resolve and fetch correctly on cold load (no prior navigation), so the loader must run on mount too (immediate: true).',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    "Dynamic segment: { path: '/users/:id' } → route.params.id.",
    'route.params values are ALWAYS strings — coerce with Number() if needed.',
    'Constrain: :id(\\d+); optional: :id?; repeat: :id+ / :id*.',
    'Catch-all 404: /:pathMatch(.*)*.',
    'props: true passes params as component props (decoupled, testable).',
    'Same-record navigation REUSES the component instance.',
    'Refetch on param change: watch(()=>route.params.id, load, { immediate: true }).',
    'Alternatives to watch: beforeRouteUpdate guard, or :key to force remount.',
    'Matching is ranked by specificity, not array order.',
    'params = identity (in path); query = optional filters (after ?).',
    'Navigate: router.push({ name: "user", params: { id } }).',
    'Validate params + authorize server-side (avoid IDOR/injection).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Define a route /articles/:slug and render the slug in the matched component.',
      hint: 'route.params.slug via useRoute().',
      solution: {
        lang: 'vue',
        code: "<!-- router -->\n// { path: '/articles/:slug', name: 'article', component: Article }\n\n<!-- Article.vue -->\n<script setup>\nimport { useRoute } from 'vue-router'\nconst route = useRoute()\n</script>\n<template>\n  <h1>{{ route.params.slug }}</h1>\n</template>",
        explanation: [
          ':slug captures the segment after /articles/.',
          'route.params.slug exposes it as a string.',
          'useRoute() keeps the template reactive to navigation.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make a product page refetch its data whenever the :id changes, including on first mount.',
      hint: 'watch with { immediate: true }.',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { ref, watch } from 'vue'\nimport { useRoute } from 'vue-router'\n\nconst route = useRoute()\nconst product = ref(null)\n\nwatch(\n  () => route.params.id,\n  async (id) => {\n    product.value = await fetch('/api/products/' + id).then(r => r.json())\n  },\n  { immediate: true }\n)\n</script>\n<template>\n  <h1 v-if=\"product\">{{ product.title }}</h1>\n</template>",
        explanation: [
          'The watcher source returns route.params.id, firing on every change.',
          'immediate: true runs it once on mount, covering cold deep-links.',
          'This avoids the stale-page bug caused by component reuse.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Define routes for /orders/:id that only matches digits, and a catch-all 404, then guard against stale async responses.',
      hint: 'Inline regex :id(\\d+) + track the requested id.',
      solution: {
        lang: 'vue',
        code: "<!-- router -->\n// { path: '/orders/:id(\\\\d+)', name: 'order', component: Order }\n// { path: '/:pathMatch(.*)*', name: 'nf', component: NotFound }\n\n<!-- Order.vue -->\n<script setup>\nimport { ref, watch } from 'vue'\nimport { useRoute } from 'vue-router'\nconst route = useRoute()\nconst order = ref(null)\nlet current = ''\nwatch(() => route.params.id, async (id) => {\n  current = id\n  const data = await fetch('/api/orders/' + id).then(r => r.json())\n  if (current === id) order.value = data // ignore stale response\n}, { immediate: true })\n</script>\n<template><pre v-if=\"order\">{{ order }}</pre></template>",
        explanation: [
          ':id(\\d+) rejects non-numeric ids, falling through to the 404 catch-all.',
          'Tracking current and comparing after await discards out-of-order responses.',
          'This prevents an older fetch from overwriting the latest order on fast navigation.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Decouple a detail component from the router using props, and force a fresh instance on every id change.',
      hint: 'props: true in the route + :key on <router-view>.',
      solution: {
        lang: 'vue',
        code: "<!-- router -->\n// { path: '/users/:id', name: 'user', component: User, props: true }\n\n<!-- App.vue: remount per id -->\n<template>\n  <router-view v-slot=\"{ Component, route }\">\n    <component :is=\"Component\" :key=\"route.params.id\" />\n  </router-view>\n</template>\n\n<!-- User.vue: no router import needed -->\n<script setup>\nconst props = defineProps({ id: { type: String, required: true } })\n// fetch in onMounted is now safe — :key forces a fresh instance per id\n</script>\n<template><h1>User {{ props.id }}</h1></template>",
        explanation: [
          'props: true passes route.params.id as a typed prop, so the component never imports useRoute.',
          'The :key bound to route.params.id forces <router-view> to remount on id change.',
          'With a fresh instance per id, onMounted-based loading becomes correct again.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Dynamic routes are where routing meets data — every list-to-detail flow depends on them. Knowing the component-reuse gotcha and the params/query split shows you have shipped real CRUD UIs, which is exactly what interviewers want to verify.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask how to define /users/:id and read the param. Product companies (Zoho, Flipkart, Razorpay) ask you to fix the stale detail-page bug live and explain params vs query. FAANG-level interviews probe match ranking, race conditions on rapid navigation, IDOR, and the trade-off between watch and :key.',
    whatInterviewersExpect:
      'They expect you to declare a dynamic route, read params reactively, refetch correctly on param change (watch with immediate, or :key, or beforeRouteUpdate), distinguish params from query, and use constraints/props for robustness.',
  },
}

export default dynamicRoutes
