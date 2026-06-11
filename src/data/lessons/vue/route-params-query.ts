import type { ConceptLesson } from '../../../types/lesson'

const routeParamsQuery: ConceptLesson = {
  // 1. Concept Summary
  slug: 'route-params-query',
  name: 'Route Params & Query',
  category: 'routing',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Params and query are how a URL carries state — which product, which page of results, which active tab — so pages are shareable, bookmarkable, and survive a refresh.',
    'Almost every detail page (/products/42), search page (?q=shoes&page=2), and filterable list reads from params or query.',
    'Getting the reactivity right (watching param changes when the SAME component is reused) is a classic source of "the page didn\'t update" bugs.',
    'Interviewers use this to test whether you understand the difference between path params and query strings and how Vue Router exposes them reactively.',
    'Encoding, type coercion (everything arrives as a string), and optional/repeatable params are real gotchas that separate juniors from mids.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Params are the house number on a street; query is the note you pin on the door with extra instructions.',
    story: [
      'Imagine streets of houses. To find one specific house you need its number — that number is part of the address itself. That is a route param: /houses/42 points to house 42.',
      'Now say you visit the house and pin a note on the door: "ring twice, I\'m in the garden, sort the mail oldest-first". Those are extra, optional instructions that do not change which house it is.',
      'In a web address the note comes after a ? — like /houses/42?ring=twice&sort=old. Those are the query.',
      'So the param tells you WHICH thing, and the query tells you HOW you want to look at it. Both live right in the address, so you can copy the whole thing to a friend and they see exactly the same view.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A route param is a named placeholder inside the path pattern, like `/users/:id`; visiting /users/7 makes `route.params.id` equal "7".',
    'A query is the part after the ? — `/search?q=shoes&page=2` — accessed as `route.query.q` and `route.query.page`.',
    'Both are read from the reactive `route` object (via `useRoute()` in script setup), so the template updates when they change.',
    'A key rule: everything in params and query arrives as a STRING (or array of strings), so "7" is not the number 7 until you convert it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Route params are dynamic segments declared in the path pattern (`/users/:id`) that identify a resource; query parameters are the optional key/value pairs after the `?` used for filtering, sorting, and pagination. Both are exposed reactively on the route object.',
    how: 'Declare params with `:name` in the route path; read them via `useRoute().params`. Pass query via the `query` field of a navigation target; read via `useRoute().query`. To react to changes when the same component is reused, watch the specific param.',
    why: 'They encode page state in the URL so views are shareable, bookmarkable, and restorable on refresh — without a separate store for "which item is open".',
    code: {
      label: 'Reading params and query',
      lang: 'vue',
      code: '<script setup>\nimport { useRoute } from \'vue-router\'\nimport { computed, watch } from \'vue\'\n\nconst route = useRoute()\n\n// params: /products/:id\nconst productId = computed(() => Number(route.params.id))\n\n// query: ?tab=reviews\nconst activeTab = computed(() => route.query.tab ?? \'overview\')\n\n// react when navigating /products/1 -> /products/2 (same component reused)\nwatch(() => route.params.id, (id) => loadProduct(id), { immediate: true })\n</script>\n\n<template>\n  <h1>Product #{{ productId }}</h1>\n  <p>Tab: {{ activeTab }}</p>\n</template>',
      explanation: [
        '`route.params.id` is the dynamic path segment, always a string — coerced with Number().',
        '`route.query.tab` reads the optional ?tab= value, defaulting when absent.',
        'Both `computed`s re-evaluate automatically because `route` is reactive.',
        'The `watch` reloads data when only the param changes, since Vue reuses the component instead of remounting it.',
        '`{ immediate: true }` runs the loader once on first render too.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Route params are named dynamic segments matched from the path (declared with `:name`, optionally with modifiers like `?`, `+`, `*` and regex constraints) and exposed on the reactive `route.params`. Query parameters are the parsed key/value pairs of the URL search string exposed on `route.query`, where repeated keys become string arrays. Both are read-only reactive properties of the current route object; navigating to the same matched component with different params reuses the component instance, so param-dependent data fetching must be driven by a watcher (or `beforeRouteUpdate`) rather than a mounted hook.',

  // 7. Internal Working
  internalWorking: [
    'When you define a path like `/users/:id`, the router compiles it into a path-ranking matcher (regex + token list) that extracts named groups from the URL.',
    'On navigation, the matcher parses the path, fills `params` from the named segments, and parses the search string into `query` (decoding percent-encoding and grouping repeated keys into arrays).',
    'These are assembled into a normalized route location object which becomes the new reactive `currentRoute`; components read it via `useRoute()`.',
    'If the destination matches the SAME route record (only params/query differ), Vue Router reuses the existing component instance instead of unmounting/remounting it — only the reactive route updates.',
    'Because the component is reused, lifecycle hooks like onMounted do NOT re-run; to react you watch the param or implement `beforeRouteUpdate`.',
    'When you navigate with a `params`/`query` object, the router stringifies and encodes them back into the URL, keeping the address and the reactive state in sync.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   URL:  /products/42?tab=reviews&color=red&color=blue
            │   pattern /products/:id    │ search string
            ▼                            ▼
   ┌──────────────────┐        ┌──────────────────────────┐
   │ params            │        │ query                     │
   │  id: "42" (string)│        │  tab: "reviews"           │
   └──────────────────┘        │  color: ["red","blue"]    │
            │                   └──────────────────────────┘
            ▼                            │
   route.params (reactive)  ◄────────────┘ route.query (reactive)
            │
   /products/42 → /products/43 : SAME component reused
            └─► onMounted does NOT re-run → watch(() => route.params.id)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — detail page param',
      lang: 'vue',
      code: '<!-- route: { path: \'/users/:id\', component: User } -->\n<script setup>\nimport { useRoute } from \'vue-router\'\nconst route = useRoute()\n</script>\n\n<template>\n  <h1>User {{ route.params.id }}</h1>\n</template>',
      explanation: [
        'The `:id` segment becomes `route.params.id`.',
        'Visiting /users/7 renders "User 7".',
        '`route` is reactive, so the template tracks it.',
        'No props wiring needed for a quick read.',
      ],
    },
    intermediate: {
      label: 'Intermediate — query-driven search & pagination',
      lang: 'vue',
      code: '<script setup>\nimport { useRoute, useRouter } from \'vue-router\'\nimport { computed, watch } from \'vue\'\n\nconst route = useRoute()\nconst router = useRouter()\n\nconst q = computed(() => route.query.q ?? \'\')\nconst page = computed(() => Number(route.query.page ?? 1))\n\nfunction goToPage(n) {\n  // merge with existing query so we don\'t lose q\n  router.push({ query: { ...route.query, page: n } })\n}\n\nwatch([q, page], () => fetchResults(q.value, page.value), { immediate: true })\n</script>\n\n<template>\n  <p>Results for \"{{ q }}\" — page {{ page }}</p>\n  <button @click=\"goToPage(page + 1)\">Next</button>\n</template>',
      explanation: [
        'Search term and page live in the URL query, so results are shareable and survive refresh.',
        '`page` is coerced from string to number with a default of 1.',
        '`goToPage` spreads the existing query so changing the page keeps the search term.',
        'Watching both computed values refetches whenever either changes.',
      ],
    },
    advanced: {
      label: 'Advanced — props: true and beforeRouteUpdate',
      lang: 'vue',
      code: '// route: { path: \'/products/:id\', component: Product, props: true }\n<script setup>\nimport { onBeforeRouteUpdate } from \'vue-router\'\nimport { ref } from \'vue\'\n\n// params become props when props:true — cleaner & decoupled from router\nconst props = defineProps({ id: String })\nconst product = ref(null)\n\nasync function load(id) {\n  product.value = await api.getProduct(id)\n}\nload(props.id)\n\n// runs when the SAME route updates with a new :id\nonBeforeRouteUpdate((to) => {\n  load(to.params.id)\n})\n</script>',
      explanation: [
        '`props: true` maps `route.params` to component props, decoupling the component from the router.',
        'The component receives `id` like any prop and is unit-testable without a router.',
        '`onBeforeRouteUpdate` fires when navigating /products/1 → /products/2 (same component reused).',
        'It reloads data for the new id, solving the "page didn\'t update" reuse bug.',
      ],
    },
    realProject: {
      label: 'Real project — filters synced to query in a catalog',
      lang: 'vue',
      code: '<script setup>\nimport { useRoute, useRouter } from \'vue-router\'\nimport { reactive, watch } from \'vue\'\n\nconst route = useRoute()\nconst router = useRouter()\n\n// hydrate filters FROM the url (string -> typed)\nconst filters = reactive({\n  category: route.query.category ?? \'all\',\n  inStock: route.query.inStock === \'true\',\n  sort: route.query.sort ?? \'popular\',\n})\n\n// push filters back INTO the url (debounced in real code)\nwatch(filters, () => {\n  router.replace({\n    query: {\n      category: filters.category,\n      inStock: String(filters.inStock),\n      sort: filters.sort,\n    },\n  })\n})\n\n// refetch when the url query changes (back/forward, shared link)\nwatch(() => route.query, () => fetchCatalog(route.query), { immediate: true, deep: true })\n</script>',
      explanation: [
        'Filters are hydrated from the URL on load, so a shared link reproduces the exact filtered view.',
        '`router.replace` (not push) updates the URL without adding a history entry per keystroke.',
        'Booleans/numbers are stringified going out and coerced coming in — the URL is always strings.',
        'Watching `route.query` refetches on browser back/forward too, keeping data and URL consistent.',
        'This bidirectional sync is the standard pattern for filterable lists, dashboards, and tables.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a route param and a query parameter?',
      answer: 'A param is a named dynamic segment of the path that identifies a resource (`/users/:id` → /users/7), while a query is an optional key/value pair after the ? used for filtering/sorting/pagination (`?page=2`). Params are part of the path; query is supplementary and unordered.',
      explanation: 'The core distinction is "which resource" (param, in the path) vs "how to view it" (query, optional).',
    },
    {
      level: 'beginner',
      question: 'How do you read params and query in a component?',
      answer: 'Call `useRoute()` in `<script setup>` and read `route.params.x` and `route.query.y`. Because the route object is reactive, computeds and the template update when they change.',
      explanation: 'They want useRoute() and awareness that the route is reactive.',
    },
    {
      level: 'intermediate',
      question: 'You navigate from /users/1 to /users/2 but the data does not refresh. Why?',
      answer: 'Because both URLs match the same route record, Vue Router reuses the component instance instead of remounting it, so onMounted does not re-run. Fix it by watching `() => route.params.id` (or using `beforeRouteUpdate`) to reload on param change.',
      explanation: 'This component-reuse gotcha is the single most common params interview question.',
    },
    {
      level: 'intermediate',
      question: 'How do you update one query param without losing the others?',
      answer: 'Spread the existing query: `router.push({ query: { ...route.query, page: 2 } })`. Replacing the whole query object would drop unrelated keys like the search term.',
      explanation: 'Mentioning merge-with-spread and push vs replace shows real navigation experience.',
    },
    {
      level: 'advanced',
      question: 'Params and query arrive as strings. What problems does that cause and how do you handle types?',
      answer: 'Numbers, booleans, and dates are all strings, so comparisons and math break if you forget to coerce (Number(route.params.id), route.query.x === "true"). Centralize coercion in computeds or use props with a validator; repeated query keys become arrays, so handle that shape too.',
      explanation: 'Type coercion and the array-shape of repeated keys are the depth signals here.',
    },
    {
      level: 'senior',
      question: 'How would you keep complex filter state in the URL robustly?',
      answer: 'Bidirectionally sync a reactive filter object to query: hydrate from route.query on load, push to the URL with router.replace (to avoid history spam, debounced), and watch route.query to refetch on back/forward and shared links. Encode/serialize non-trivial values, validate inputs, and decide push vs replace per interaction.',
      explanation: 'The replace-vs-push history strategy, debouncing, and round-trip serialization are senior concerns.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When is the same component reused vs remounted on navigation?',
    'How do you make params optional or repeatable (`:id?`, `:ids+`)?',
    'What is `props: true` and why is it cleaner than reading route directly?',
    'When should you use `router.push` vs `router.replace`?',
    'How do repeated query keys (?tag=a&tag=b) appear in route.query?',
    'How do you preserve query across navigations or restore it after login?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Fetching data in onMounted and expecting it to re-run on param change.',
      why: 'The same route record reuses the component instance, so onMounted fires only once.',
      fix: 'Watch `() => route.params.id` (or use beforeRouteUpdate) to reload when the param changes.',
    },
    {
      mistake: 'Treating params/query as their real types.',
      why: 'Everything arrives as a string (or string[]); `route.query.page > 1` or `=== true` silently misbehaves.',
      fix: 'Coerce explicitly: Number(route.params.id), route.query.flag === "true".',
    },
    {
      mistake: 'Replacing the entire query object to change one key.',
      why: 'It drops every other query param (search term, sort, etc.).',
      fix: 'Spread first: `{ query: { ...route.query, page } }`.',
    },
    {
      mistake: 'Using push for every filter keystroke.',
      why: 'It floods the browser history so Back becomes useless.',
      fix: 'Use router.replace for live filter syncing and debounce the updates.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Detail pages read `:id` params; list/search pages keep q/page/filters in query so views are shareable and refresh-safe; props:true is used to decouple components from the router for testability.' },
    { area: 'Nuxt', detail: 'File-based routes expose params via `useRoute()`/`route.params`; query-driven SSR pages read the query during server render so the first paint already reflects the URL state.' },
    { area: 'Pinia', detail: 'Some apps mirror URL query into a Pinia store so multiple components share the active filters while the URL stays the source of truth on load.' },
    { area: 'Component library', detail: 'Data tables/grids serialize sort, page, and filter state into the query string so a copied URL reproduces the exact table view.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Component reuse on param change avoids a full remount, so navigation between siblings is cheap.',
      'Storing view state in the URL avoids extra global state and makes caching by URL straightforward.',
    ],
    bad: [
      'Pushing a history entry per keystroke when syncing filters bloats history and hurts UX.',
      'Re-fetching on every tiny query change (no debounce) creates request storms.',
    ],
    optimizations: [
      'Use router.replace + debounce for live filter/search syncing.',
      'Watch only the specific param/query keys you depend on, not the whole route, to limit re-runs.',
      'Coerce/parse once in a computed rather than repeatedly inline in the template.',
      'Cache fetched results keyed by the param/query so back/forward is instant.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'dynamic-routes'],
    nextConcepts: ['programmatic-navigation', 'navigation-guards', 'nested-routes', 'data-fetching-patterns'],
    dependencyNote:
      'Params build directly on dynamic-routes and vue-router-basics; once you can read and react to them you move on to programmatic-navigation and data-fetching-patterns that depend on the current params/query.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a URL: /products/42?tab=reviews and split it at the ?.',
      'Label the left side "path → params (which resource)" and circle 42 as `:id`.',
      'Label the right side "query → optional view state (how)" and box tab=reviews.',
      'Draw both flowing into a reactive `route` object read by useRoute().',
      'Then draw /products/42 → /products/43 with a note "same component reused → watch the param, onMounted won\'t re-run".',
    ],
    diagram: `  /products/42 ? tab=reviews
   └── path ──┘ └─ query ─┘
        │             │
   params.id="42"  query.tab="reviews"
        \\           /
         reactive route (useRoute)
              │
  /42 → /43  same component reused
        └─► watch(() => route.params.id)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Params are named path segments (`/users/:id`) identifying a resource; query is the optional ?key=value part for filtering, sorting, and pagination. Read both reactively via useRoute(): route.params and route.query. Everything arrives as a string, so coerce types. The classic trap: navigating between /users/1 and /users/2 reuses the same component, so onMounted does NOT re-run — watch the param (or use beforeRouteUpdate) to refetch. Use props:true to decouple, and router.replace + debounce when syncing filters to the URL.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Route params and query are how a URL carries state in Vue Router. A param is a named dynamic segment declared in the path, like /users/:id, used to identify a resource — visiting /users/7 gives you route.params.id equal to "7". A query is the optional part after the question mark, like ?q=shoes&page=2, exposed as route.query, and it is meant for supplementary view state: search terms, sorting, pagination, filters. You read both reactively by calling useRoute() in script setup; because the route object is reactive, computeds and the template update automatically. A key detail is that everything arrives as a string, or an array of strings for repeated query keys, so you must coerce — Number(route.params.id), or route.query.flag === "true". The most important gotcha, and the one interviewers love, is component reuse: navigating from /users/1 to /users/2 matches the same route record, so Vue Router reuses the component instance instead of remounting it. That means onMounted does not run again, so any data you fetched there goes stale. The fix is to watch the param — watch(() => route.params.id, loadUser, { immediate: true }) — or implement beforeRouteUpdate. For cleaner components I set props: true on the route so params arrive as props, decoupling the component from the router and making it testable. And for filter-heavy pages I sync a reactive filter object bidirectionally with route.query, hydrating from the URL on load and pushing back with router.replace, debounced, so the view is shareable and survives refresh and back/forward without flooding history.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'URL-as-state vs store-as-state: the URL makes views shareable and refresh-safe but limits you to serializable, string-shaped data; complex objects need encoding or a store.',
      'props:true decouples and aids testing, but reading route directly is quicker for one-off reads and gives access to query too.',
    ],
    edgeCases: [
      'Component reuse means onMounted/onUnmounted skip on param-only changes — watch or beforeRouteUpdate required.',
      'Repeated query keys (?tag=a&tag=b) become arrays; single occurrence is a string — handle both shapes.',
      'Percent-encoding: special characters in params/query are encoded; reading gives decoded values, but you must encode when building manual URLs.',
      'Optional/repeatable params (`:id?`, `:ids+`) and regex constraints affect matching priority and can collide with sibling routes.',
    ],
    runtimeBehavior: [
      'Param/query changes update the reactive route in place; only dependents that read changed keys re-run.',
      'push adds a history entry; replace swaps the current one — choose per interaction to keep Back meaningful.',
      'beforeRouteUpdate runs with the resolved new route before the component re-renders, ideal for guarded reloads.',
    ],
    scalability: [
      'For many filters, centralize serialization/deserialization in a composable so every page handles the URL identically.',
      'Cache by full URL (params+query) to make navigation and back/forward instant in data-heavy apps.',
    ],
    productionConcerns: [
      'Validate and clamp incoming params/query (page numbers, ids) — users edit URLs and bots crawl malformed ones.',
      'Debounce URL writes for live inputs to avoid history pollution and request storms.',
      'On SSR, read params/query during server render so the first paint matches the URL, avoiding hydration flicker.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'param = path segment (`/users/:id`) → route.params.id (which resource).',
    'query = after ? (?page=2) → route.query.page (how to view).',
    'Read reactively: const route = useRoute().',
    'Everything is a STRING (or string[]) — coerce types.',
    'Same route record on nav → component REUSED → onMounted won\'t re-run.',
    'Fix reuse: watch(() => route.params.id) or onBeforeRouteUpdate.',
    'Update one query key: { query: { ...route.query, page } }.',
    'props: true maps params → props (decoupled, testable).',
    'push = new history entry; replace = swap current.',
    'Filters: replace + debounce; hydrate from URL on load.',
    'Repeated query keys → arrays; encode special chars in manual URLs.',
    'Validate/clamp params — users edit the URL directly.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given route `/posts/:slug`, display the slug and a numeric `route.query.page` (default 1) in the template.',
      hint: 'Use useRoute() and coerce page with Number.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { useRoute } from \'vue-router\'\nimport { computed } from \'vue\'\nconst route = useRoute()\nconst page = computed(() => Number(route.query.page ?? 1))\n</script>\n\n<template>\n  <h1>{{ route.params.slug }}</h1>\n  <p>Page {{ page }}</p>\n</template>',
        explanation: [
          'route.params.slug is the dynamic segment.',
          'page is coerced from a string to a number with a default of 1.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a function that increments the `page` query param while preserving any other existing query keys.',
      hint: 'Spread route.query and override page.',
      solution: {
        lang: 'js',
        code: 'import { useRoute, useRouter } from \'vue-router\'\nconst route = useRoute()\nconst router = useRouter()\n\nfunction nextPage() {\n  const current = Number(route.query.page ?? 1)\n  router.push({ query: { ...route.query, page: current + 1 } })\n}',
        explanation: [
          'Spreading route.query keeps unrelated params like a search term.',
          'Only the page key is overridden with the incremented value.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A User component does not refresh when navigating /users/1 → /users/2. Fix the data loading so it reacts to the param change.',
      hint: 'The component is reused; watch the param.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { useRoute } from \'vue-router\'\nimport { ref, watch } from \'vue\'\nconst route = useRoute()\nconst user = ref(null)\n\nwatch(\n  () => route.params.id,\n  async (id) => { user.value = await api.getUser(id) },\n  { immediate: true }\n)\n</script>',
        explanation: [
          'Same route record → component reused → onMounted will not re-run.',
          'Watching route.params.id with immediate:true loads on first render AND on every id change.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a composable useUrlFilters that hydrates a reactive filters object from route.query and syncs changes back to the URL with replace (no history spam).',
      hint: 'reactive() for filters, watch filters → router.replace, watch route.query → rehydrate.',
      solution: {
        lang: 'js',
        code: 'import { reactive, watch } from \'vue\'\nimport { useRoute, useRouter } from \'vue-router\'\n\nexport function useUrlFilters() {\n  const route = useRoute()\n  const router = useRouter()\n\n  const filters = reactive({\n    category: route.query.category ?? \'all\',\n    inStock: route.query.inStock === \'true\',\n  })\n\n  // filters -> url\n  watch(filters, () => {\n    router.replace({\n      query: { category: filters.category, inStock: String(filters.inStock) },\n    })\n  })\n\n  // url -> filters (back/forward, shared link)\n  watch(\n    () => route.query,\n    (q) => {\n      filters.category = q.category ?? \'all\'\n      filters.inStock = q.inStock === \'true\'\n    },\n    { deep: true }\n  )\n\n  return { filters }\n}',
        explanation: [
          'Filters hydrate from the URL on creation, so shared links reproduce the view.',
          'router.replace updates the URL without piling history entries.',
          'Watching route.query rehydrates on browser back/forward, keeping both directions in sync.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Params and query are everywhere in real apps — every detail page, search, and filterable list relies on them. Demonstrating the component-reuse gotcha and URL-as-state thinking shows you build shareable, refresh-safe UIs, which is exactly what teams need.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the param-vs-query difference and how to read them. Product companies (Zoho, Flipkart, Razorpay) give the /users/1→/users/2 reuse bug and ask you to fix it, or to sync filters to the URL. FAANG-level interviews probe history strategy, serialization, and SSR consistency.',
    whatInterviewersExpect:
      'They expect the path-vs-supplementary distinction, useRoute() with reactive reads, awareness that everything is a string, and the watch/beforeRouteUpdate fix for component reuse — plus push-vs-replace judgment for URL syncing.',
  },
}

export default routeParamsQuery
