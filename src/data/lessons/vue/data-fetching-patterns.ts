import type { ConceptLesson } from '../../../types/lesson'

const dataFetchingPatterns: ConceptLesson = {
  // 1. Concept Summary
  slug: 'data-fetching-patterns',
  name: 'Data Fetching Patterns',
  category: 'forms-async',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Nearly every app loads data from an API, so doing it correctly — with loading, error, and empty states — is a baseline production skill.',
    'Naive fetching causes the most common UX bugs: flashing spinners, race conditions where stale responses overwrite fresh ones, and unhandled errors.',
    'The pattern you choose (in-component, composable, store, or a data library like TanStack Query/SWR) shapes caching, deduplication, and refetching across the whole app.',
    'Interviewers probe this to see if you understand async + reactivity together: watchers, cleanup, AbortController, and the request lifecycle.',
    'Good fetching architecture (caching, request cancellation, retries) is a strong senior signal versus copy-pasted fetch calls.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Fetching data is like ordering food: you place the order, wait while it cooks (loading), and either the meal arrives (data) or the kitchen says they\'re out (error) — and if you change your mind, you cancel the old order.',
    story: [
      'Imagine you order pizza. While it cooks, a little sign says "cooking..." so you know to wait. That is the loading state.',
      'When it arrives, you eat it — that is the data. But sometimes the kitchen calls and says "sorry, we\'re out of cheese" — that is an error, and you need a plan for it.',
      'Now imagine you change your order halfway through. You must cancel the first pizza, or two pizzas show up and you get confused about which is the real one. That is canceling stale requests.',
      'Fetching data in an app is exactly this: show a wait sign, handle the food OR the bad news, and cancel old orders when you ask for something new.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Apps usually get their information from a server over the network, which takes time, so the code is asynchronous (it does not finish instantly).',
    'A good fetch tracks three states: loading (waiting), success (we have the data), and error (something went wrong) — and shows the right UI for each.',
    'When the thing you depend on changes (like a route id), you refetch; and you should cancel the old request so a late, stale answer does not overwrite the new one.',
    'Many apps reuse this logic with a composable (a function like useFetch) or a data library that also caches and dedupes requests.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Data fetching patterns are the structured ways to load async data in Vue: tracking loading/error/data state, fetching on mount or when dependencies change, cancelling stale requests, and reusing the logic via composables or libraries.',
    how: 'You store data/loading/error as refs, fetch in onMounted or a watcher, use try/catch/finally to manage state, and use AbortController to cancel superseded requests. Composables (useFetch) package this; libraries add caching and dedup.',
    why: 'It gives users correct feedback (spinners, errors, empty states), prevents race conditions, and keeps fetch logic reusable instead of duplicated in every component.',
    code: {
      label: 'Basic fetch-on-mount with three states',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onMounted } from \'vue\'\ninterface User { id: number; name: string }\nconst data = ref<User[] | null>(null)\nconst loading = ref(false)\nconst error = ref<string | null>(null)\n\nasync function load() {\n  loading.value = true\n  error.value = null\n  try {\n    const res = await fetch(\'/api/users\')\n    if (!res.ok) throw new Error(`HTTP ${res.status}`)\n    data.value = await res.json()\n  } catch (e) {\n    error.value = (e as Error).message\n  } finally {\n    loading.value = false\n  }\n}\nonMounted(load)\n</script>\n\n<template>\n  <p v-if="loading">Loading...</p>\n  <p v-else-if="error">{{ error }}</p>\n  <ul v-else><li v-for="u in data" :key="u.id">{{ u.name }}</li></ul>\n</template>',
      explanation: [
        'Three refs model the request lifecycle: data, loading, error.',
        'try/catch/finally guarantees loading is cleared and errors are captured.',
        'onMounted triggers the fetch when the component appears.',
        'The template renders exactly one of loading / error / data states.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Data fetching patterns describe how to integrate asynchronous I/O with Vue\'s reactivity. The core is modelling the request as reactive state (data, loading, error) and updating it through the request lifecycle with try/catch/finally. Triggering can be on mount (onMounted), on dependency change (watch/watchEffect on a route param or query ref), or lazily. Correctness requires cancelling superseded requests with AbortController and ignoring stale responses to avoid race conditions. Reuse is achieved via composables (useFetch-style functions returning reactive state) or dedicated data libraries (TanStack Query, SWRV, vue-query) that add caching, deduplication, background revalidation, and retries. In SSR/Nuxt, fetching is coordinated so data is resolved on the server and hydrated on the client without a double fetch.',

  // 7. Internal Working
  internalWorking: [
    'A fetch starts by setting loading=true and clearing error; the async call returns a Promise that Vue does not block on — the component renders the loading state immediately.',
    'When the Promise resolves, the handler assigns data (a reactive write), which triggers dependent effects and re-renders the success branch; rejection assigns error instead.',
    'When fetching depends on reactive input, a watch on that input re-runs the fetch; the watcher\'s cleanup callback (onCleanup) aborts the previous request via AbortController.signal.',
    'AbortController.abort() causes the in-flight fetch to reject with an AbortError, which you ignore, so a late stale response cannot overwrite newer data — this is how race conditions are prevented.',
    'A composable wraps refs + the fetch function + lifecycle wiring and returns the reactive state, so multiple components reuse identical, correct logic.',
    'Data libraries add a cache keyed by request key: identical concurrent requests are deduped, results are cached and shared, and stale entries are revalidated in the background.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   trigger (mount / dep change)
        │  loading=true, error=null
        ▼
   fetch(signal) ───────────────► Promise
        │                            │
   dep changes again?                │ resolve        reject
        │ onCleanup → abort()        ▼                  ▼
        └──────────────► (AbortError ignored)      data set     error set
                                                      │              │
                                              render success   render error
   states: [ loading ] → [ data ] | [ error ] | [ empty ]`,

  // 9. Memory Visualization
  memoryVisualization: [
    'data/loading/error refs live on the heap for the component scope and drive which branch renders.',
    'An AbortController per request holds the signal; aborting frees the in-flight network work and lets the fetch reject quickly.',
    'A watcher retains its cleanup closure (capturing the current controller) until it re-runs or the component unmounts.',
    'With a data library, a shared cache object holds results keyed by request key, kept alive across components until garbage-collected by the library\'s cache policy.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reusable useFetch composable',
      lang: 'ts',
      code: 'import { ref } from \'vue\'\n\nexport function useFetch<T>(url: string) {\n  const data = ref<T | null>(null)\n  const error = ref<Error | null>(null)\n  const loading = ref(false)\n\n  async function execute() {\n    loading.value = true\n    error.value = null\n    try {\n      const res = await fetch(url)\n      if (!res.ok) throw new Error(`HTTP ${res.status}`)\n      data.value = await res.json()\n    } catch (e) {\n      error.value = e as Error\n    } finally {\n      loading.value = false\n    }\n  }\n  execute()\n  return { data, error, loading, refetch: execute }\n}',
      explanation: [
        'The composable returns reactive state plus a refetch function.',
        'Any component can call useFetch and render loading/error/data.',
        'Logic is written once and reused everywhere — no duplication.',
        'execute() runs immediately so data starts loading on use.',
      ],
    },
    intermediate: {
      label: 'Intermediate — refetch on route param change with cancellation',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, watch } from \'vue\'\nimport { useRoute } from \'vue-router\'\nconst route = useRoute()\nconst post = ref<unknown>(null)\nconst loading = ref(false)\n\nwatch(\n  () => route.params.id,\n  async (id, _old, onCleanup) => {\n    const controller = new AbortController()\n    onCleanup(() => controller.abort()) // cancel stale request\n    loading.value = true\n    try {\n      const res = await fetch(`/api/posts/${id}`, { signal: controller.signal })\n      post.value = await res.json()\n    } catch (e) {\n      if ((e as Error).name !== \'AbortError\') throw e\n    } finally {\n      loading.value = false\n    }\n  },\n  { immediate: true },\n)\n</script>',
      explanation: [
        'The watch refetches whenever the route id changes.',
        'onCleanup aborts the previous request before starting the new one.',
        'AbortError is ignored so a stale response cannot overwrite fresh data.',
        'immediate: true fetches on first load as well as on changes.',
      ],
    },
    advanced: {
      label: 'Advanced — preventing race conditions with a request token',
      lang: 'ts',
      code: 'import { ref } from \'vue\'\n\nexport function useSearch() {\n  const results = ref<string[]>([])\n  let latest = 0 // monotonically increasing request id\n\n  async function search(q: string) {\n    const id = ++latest\n    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)\n    const json = await res.json()\n    // ignore if a newer request has started since this one\n    if (id === latest) results.value = json\n  }\n  return { results, search }\n}',
      explanation: [
        'Each call gets an incrementing id; only the most recent commits its result.',
        'This guards against out-of-order responses even without AbortController.',
        'A late response from an older query is dropped, preventing flicker/stale data.',
        'Useful when the API/transport cannot be aborted cleanly.',
      ],
    },
    realProject: {
      label: 'Real project — cached, deduped fetching with a data library',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { useQuery } from \'@tanstack/vue-query\'\nimport { toRef } from \'vue\'\n\nconst props = defineProps<{ userId: string }>()\n\nconst { data, isLoading, isError, refetch } = useQuery({\n  queryKey: [\'user\', toRef(props, \'userId\')],\n  queryFn: ({ signal }) =>\n    fetch(`/api/users/${props.userId}`, { signal }).then(r => r.json()),\n  staleTime: 30_000,\n})\n</script>\n\n<template>\n  <p v-if="isLoading">Loading...</p>\n  <p v-else-if="isError">Failed <button @click="refetch()">Retry</button></p>\n  <pre v-else>{{ data }}</pre>\n</template>',
      explanation: [
        'vue-query caches by queryKey, dedupes concurrent identical requests, and revalidates stale data.',
        'A reactive key (toRef on userId) refetches automatically when the prop changes.',
        'staleTime avoids refetching fresh data; built-in retry/error/loading flags replace manual refs.',
        'This is the production-grade pattern for non-trivial apps: less boilerplate, automatic caching and cancellation.',
        'The signal enables request cancellation under the hood.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What states should you track when fetching data, and why?',
      answer: 'At least loading, data (success), and error — often also an empty state. Tracking all of them lets you render correct UI: a spinner while waiting, the data when it arrives, an error message on failure, and an "no results" message when the data is empty.',
      explanation: 'Naming the three (or four) states and mapping them to UI is the expected baseline.',
    },
    {
      level: 'beginner',
      question: 'Where should you trigger a fetch in a Vue 3 component?',
      answer: 'Commonly in onMounted for a one-time load, or in a watch/watchEffect when the fetch depends on reactive input like a route param. You generally avoid fetching in setup synchronously without state, because you need to manage loading/error.',
      explanation: 'Distinguishing onMounted vs dependency-driven watch shows lifecycle understanding.',
    },
    {
      level: 'intermediate',
      question: 'What is a race condition in data fetching and how do you prevent it?',
      answer: 'When a slower earlier request resolves after a newer one, overwriting fresh data with stale data. Prevent it by aborting the previous request with AbortController on each new fetch, or by tagging requests with an incrementing id and committing only the latest response.',
      explanation: 'This is the headline async-correctness question; both fixes (abort, request token) are good answers.',
    },
    {
      level: 'intermediate',
      question: 'Why and how would you cancel a request when a dependency changes?',
      answer: 'To stop a stale, in-flight request from completing and overwriting newer data, and to save bandwidth. Use a watch with onCleanup that calls controller.abort(), passing controller.signal to fetch; ignore the resulting AbortError.',
      explanation: 'Tests knowledge of the watcher cleanup hook combined with AbortController.',
    },
    {
      level: 'advanced',
      question: 'When would you reach for a data library like TanStack Query instead of a hand-rolled composable?',
      answer: 'When you need caching, request deduplication, background revalidation, pagination/infinite queries, retries, and cross-component data sharing. A hand-rolled composable is fine for simple, isolated fetches, but reimplementing caching/dedup/staleness correctly is error-prone, so a library pays off as the app grows.',
      explanation: 'Senior signal: knowing what a library buys you and when the complexity is justified.',
    },
    {
      level: 'senior',
      question: 'How does data fetching differ in an SSR/Nuxt context?',
      answer: 'Data must be fetched on the server during render and serialized into the page, then reused on the client during hydration to avoid a second fetch and a flash. Nuxt provides useAsyncData/useFetch that handle this transfer, keying results so client and server agree. You also must avoid leaking per-request state across requests on the server.',
      explanation: 'Senior signal: understanding server-resolved data, hydration de-duplication, and request isolation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you implement retry with backoff on a failed request?',
    'How do you cache and dedupe identical concurrent requests?',
    'What is stale-while-revalidate and how does it improve UX?',
    'How do you paginate or implement infinite scroll fetching?',
    'How does Suspense relate to async setup and data fetching in Vue?',
    'How do you avoid memory leaks from fetches when a component unmounts mid-request?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Not handling loading and error states.',
      why: 'Users see a blank or frozen UI, and failures fail silently with no feedback.',
      fix: 'Always track loading/error/data and render a branch for each, plus an empty state.',
    },
    {
      mistake: 'Ignoring race conditions on rapidly changing dependencies (search, route).',
      why: 'A slow earlier response can resolve last and overwrite the correct newer data.',
      fix: 'Abort superseded requests with AbortController or commit only the latest via a request id.',
    },
    {
      mistake: 'Treating any resolved fetch as success.',
      why: 'fetch only rejects on network failure, not on HTTP 4xx/5xx, so error responses slip through.',
      fix: 'Check res.ok (or status) and throw, so errors are caught and shown.',
    },
    {
      mistake: 'Duplicating fetch logic in every component.',
      why: 'Inconsistent loading/error handling and repeated bugs across the app.',
      fix: 'Extract a useFetch composable or adopt a data library for shared, correct logic.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables (useFetch-style) returning reactive data/loading/error are the idiomatic in-app pattern, wired with onMounted/watch and AbortController.' },
    { area: 'Component library', detail: 'TanStack Query (vue-query), SWRV, and VueUse\'s useFetch provide caching, dedup, retries, and revalidation out of the box.' },
    { area: 'Nuxt', detail: 'useAsyncData/useFetch resolve data on the server and hydrate on the client, preventing double fetches and flashes; keys ensure cache consistency.' },
    { area: 'Pinia', detail: 'Stores often own fetched domain data and the actions that load it, sharing results across components and centralizing cache/refresh logic.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Caching/deduplication avoids redundant network requests for the same data.',
      'Cancellation frees in-flight work and prevents wasted renders from stale responses.',
    ],
    bad: [
      'Fetching the same data separately in many components multiplies network and parse cost.',
      'No debounce on input-driven fetches floods the server (one request per keystroke).',
    ],
    optimizations: [
      'Use a shared cache (library or store) keyed by request key with dedup.',
      'Debounce input-driven fetches and abort superseded ones.',
      'Use stale-while-revalidate to show cached data instantly while refreshing in the background.',
      'Prefetch likely-next data and paginate large datasets instead of loading everything.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['watch', 'lifecycle-hooks-composition', 'composables', 'error-handling-vue'],
    nextConcepts: ['suspense', 'ssr-hydration', 'pinia-basics', 'state-sharing-composables'],
    dependencyNote:
      'Data fetching combines async I/O with watch/lifecycle hooks and is almost always packaged as a composable. It depends on solid error handling, and leads into Suspense, SSR hydration, and store-based or composable-based state sharing for caching.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three refs: data, loading, error, and the template branching on them.',
      'Show the trigger (onMounted or watch on a dep) setting loading=true and calling fetch.',
      'On resolve → set data; on reject → set error; finally → loading=false.',
      'Add a dependency change: draw onCleanup → abort() the previous request, ignoring AbortError.',
      'Conclude: "model the lifecycle as state, refetch on deps, cancel stale requests, and reuse via a composable or library that also caches."',
    ],
    diagram: `  [loading|data|error] refs ──► template branches
  trigger → loading=true → fetch(signal)
     resolve → data ;  reject → error ;  finally → loading=false
  dep change → onCleanup → abort() (ignore AbortError)
  reuse → useFetch composable  |  cache+dedup → data library`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Model data fetching as reactive state — data, loading, error (and empty) — updated through try/catch/finally. Trigger on mount for one-shot loads or with a watch when it depends on reactive input like a route id. Always check res.ok because fetch does not reject on HTTP errors. Prevent race conditions by aborting superseded requests with AbortController in the watcher cleanup, or by committing only the latest request id. Reuse the logic via a useFetch composable, and for real apps adopt a data library (TanStack Query) for caching, dedup, and revalidation.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Data fetching in Vue is about marrying async I/O with reactivity correctly. The foundation is modelling the request as reactive state: a data ref, a loading ref, and an error ref — and often an empty state too. You update them through the lifecycle with try/catch/finally: set loading true and clear error at the start, set data on success, set error on failure, and always clear loading in finally. The template then renders exactly one branch per state. A key gotcha is that fetch only rejects on a network error, not on HTTP 4xx or 5xx, so you must check res.ok and throw, or error responses slip through as success. Where you trigger matters: onMounted for a one-time load, or a watch when the fetch depends on reactive input like a route param or a search query. The classic correctness problem is race conditions — if a dependency changes quickly, a slow earlier request can resolve after a newer one and overwrite the fresh data with stale data. You fix this by aborting superseded requests: in the watch you create an AbortController, register onCleanup to call abort, pass the signal to fetch, and ignore the resulting AbortError. An alternative when you can\'t abort is tagging each request with an incrementing id and committing only the latest response. To avoid duplicating all this, you extract it into a composable like useFetch that returns the reactive state and a refetch function. And once an app is non-trivial, I reach for a data library like TanStack Query, which adds caching keyed by a query key, request deduplication, background revalidation, retries, and pagination — reimplementing those correctly by hand is genuinely hard. Finally, in SSR or Nuxt, the data is fetched on the server and serialized so the client reuses it during hydration instead of double-fetching, which Nuxt\'s useAsyncData handles.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Hand-rolled composable: minimal deps and full control, but you own caching/dedup/race handling.',
      'Data library: powerful caching/revalidation but adds bundle size and a mental model to learn.',
      'Store-owned data centralizes and shares state but can become a god-store if every fetch lives there.',
    ],
    edgeCases: [
      'fetch resolves on HTTP errors — must check res.ok explicitly.',
      'Out-of-order responses cause stale overwrites without abort or request-id guarding.',
      'A component unmounting mid-request can set state on a dead instance unless guarded/aborted.',
      'SSR must isolate per-request state to avoid cross-request data leaks.',
    ],
    runtimeBehavior: [
      'The component renders the loading branch immediately while the Promise is pending.',
      'Watcher onCleanup runs before each re-run and on unmount, the right place to abort.',
      'AbortController.abort rejects the fetch with AbortError, which you deliberately ignore.',
    ],
    scalability: [
      'Shared cache + dedup keeps network cost bounded as more components need the same data.',
      'Pagination/infinite queries and prefetching keep large datasets responsive.',
    ],
    productionConcerns: [
      'Implement retries with backoff and surface actionable error UI with a retry button.',
      'Use stale-while-revalidate for instant perceived loads on revisits.',
      'Centralize auth headers, base URLs, and error normalization in one fetch wrapper or interceptor.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Track data + loading + error (+ empty) as reactive state.',
    'try/catch/finally; clear loading in finally.',
    'fetch does NOT reject on 4xx/5xx — check res.ok.',
    'Trigger: onMounted (once) or watch (dependency-driven).',
    'Race condition = stale slow response overwrites fresh data.',
    'Fix: AbortController + watch onCleanup, ignore AbortError.',
    'Alt fix: incrementing request id, commit only the latest.',
    'Reuse logic via a useFetch composable.',
    'Data libraries add cache, dedup, revalidate, retry (TanStack Query).',
    'Debounce input-driven fetches.',
    'SSR/Nuxt: fetch on server, hydrate on client (useAsyncData).',
    'Centralize auth/base URL/error handling in a wrapper.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Fetch /api/items on mount and render loading, error, and list states.',
      hint: 'Three refs + onMounted + try/catch/finally.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onMounted } from \'vue\'\nconst items = ref<string[] | null>(null)\nconst loading = ref(false)\nconst error = ref<string | null>(null)\nonMounted(async () => {\n  loading.value = true\n  try {\n    const r = await fetch(\'/api/items\')\n    if (!r.ok) throw new Error(\'HTTP \' + r.status)\n    items.value = await r.json()\n  } catch (e) { error.value = (e as Error).message }\n  finally { loading.value = false }\n})\n</script>\n\n<template>\n  <p v-if="loading">Loading</p>\n  <p v-else-if="error">{{ error }}</p>\n  <ul v-else><li v-for="(i, k) in items" :key="k">{{ i }}</li></ul>\n</template>',
        explanation: [
          'Three refs model the lifecycle.',
          'res.ok is checked so HTTP errors are caught.',
          'The template renders one branch per state.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Extract the above into a generic useFetch<T>(url) composable returning { data, loading, error, refetch }.',
      hint: 'Move the refs and the async function into a function.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\nexport function useFetch<T>(url: string) {\n  const data = ref<T | null>(null)\n  const loading = ref(false)\n  const error = ref<Error | null>(null)\n  async function refetch() {\n    loading.value = true; error.value = null\n    try {\n      const r = await fetch(url)\n      if (!r.ok) throw new Error(\'HTTP \' + r.status)\n      data.value = await r.json()\n    } catch (e) { error.value = e as Error }\n    finally { loading.value = false }\n  }\n  refetch()\n  return { data, loading, error, refetch }\n}',
        explanation: [
          'The composable is generic over the response type.',
          'It returns reactive state plus refetch.',
          'Components reuse identical, correct fetch logic.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Refetch a post when route.params.id changes and cancel the previous request to avoid race conditions.',
      hint: 'watch with onCleanup + AbortController.',
      solution: {
        lang: 'ts',
        code: 'import { ref, watch } from \'vue\'\nimport { useRoute } from \'vue-router\'\nconst route = useRoute()\nconst post = ref<unknown>(null)\nwatch(() => route.params.id, async (id, _o, onCleanup) => {\n  const c = new AbortController()\n  onCleanup(() => c.abort())\n  try {\n    const r = await fetch(`/api/posts/${id}`, { signal: c.signal })\n    post.value = await r.json()\n  } catch (e) {\n    if ((e as Error).name !== \'AbortError\') throw e\n  }\n}, { immediate: true })',
        explanation: [
          'Each id change aborts the prior request via onCleanup.',
          'AbortError is ignored so stale data never overwrites fresh.',
          'immediate fetches on first load too.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a search that ignores out-of-order responses without using AbortController.',
      hint: 'Use a monotonically increasing request id.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\nconst results = ref<string[]>([])\nlet latest = 0\nasync function search(q: string) {\n  const id = ++latest\n  const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`)\n  const json = await r.json()\n  if (id === latest) results.value = json // only newest commits\n}',
        explanation: [
          'Each call increments latest and captures its id.',
          'Only the most recent request commits its result.',
          'Older responses arriving late are discarded.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Loading data correctly — with proper states, cancellation, and caching — is what separates a polished app from a buggy one. It is one of the most practical, frequently exercised skills in front-end work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask how to show loading/error and where to fetch. Product companies (Zoho, Flipkart, Razorpay) ask about race conditions, cancellation, and reusable composables. FAANG-level interviews probe caching/dedup, stale-while-revalidate, SSR hydration, and pagination at scale.',
    whatInterviewersExpect:
      'Model the request as loading/data/error state, check res.ok, trigger via onMounted or watch, prevent race conditions with AbortController or request ids, reuse via a composable, and know when a data library or SSR fetching is the right call.',
  },
}

export default dataFetchingPatterns
