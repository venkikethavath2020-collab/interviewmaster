import type { ConceptLesson } from '../../../types/lesson'

const composables: ConceptLesson = {
  // 1. Concept Summary
  slug: 'composables',
  name: 'Composables',
  category: 'composition-api',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Composables are THE idiomatic way to share stateful logic in Vue 3 — they replaced mixins and most render-prop/HOC patterns.',
    'They let you extract reactive state, computed values, watchers, and lifecycle hooks into a reusable `useXxx()` function with zero naming collisions.',
    'Almost every serious Vue codebase is built on composables: useFetch, useMouse, useLocalStorage, useAuth — and the entire VueUse library is composables.',
    'Interviewers use composables to test whether you truly understand the Composition API, reactivity, and how `ref`/`reactive` survive across function calls.',
    'Getting them wrong (returning plain values instead of refs, or creating shared module-level state by accident) causes subtle bugs that separate juniors from seniors.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A composable is a recipe card you can reuse in any kitchen.',
    story: [
      'Imagine you have a recipe card for making lemonade. It lists the steps: squeeze lemons, add sugar, add water.',
      'You can take that one card into any kitchen — your home, your friend\'s house, grandma\'s house — and make lemonade the exact same way every time.',
      'You do not rewrite the recipe each time. You just bring the card and follow it. And each kitchen gets its OWN jug of lemonade.',
      'A composable is like that recipe card for a Vue component. It bundles up a piece of logic — like "track the mouse position" — so any component can use it just by calling it, and each component gets its own fresh result.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue 3 you can pull a chunk of logic out of a component and put it into a normal JavaScript function whose name starts with "use", like useCounter().',
    'Inside that function you create reactive things with ref() or reactive(), and you can also add computed values, watchers, and lifecycle hooks.',
    'The function returns those reactive things, and any component that calls it gets to use them in its template — fully reactive.',
    'This is reuse without copy-paste: write the logic once, call it from ten components, and each call gets its own independent state.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A composable is a function (conventionally named useSomething) that uses Vue\'s Composition API (ref, reactive, computed, watch, lifecycle hooks) to encapsulate and reuse stateful logic across components.',
    how: 'You define a plain function, create reactive state inside it with ref/reactive, optionally register watchers and lifecycle hooks, and return the reactive state plus any methods. Components call it inside <script setup> and destructure the result.',
    why: 'It gives you logic reuse with full reactivity and no naming collisions — unlike mixins, every source of state is explicit because you see exactly what you destructure.',
    code: {
      label: 'A simple useCounter composable',
      lang: 'js',
      code: '// composables/useCounter.js\nimport { ref } from \'vue\'\n\nexport function useCounter(start = 0) {\n  const count = ref(start)        // private reactive state\n  function increment() { count.value++ }\n  function reset() { count.value = start }\n  return { count, increment, reset }\n}\n\n// Component:\n// <script setup>\n// import { useCounter } from \'@/composables/useCounter\'\n// const { count, increment } = useCounter(10)\n// </script>\n// <template><button @click="increment">{{ count }}</button></template>',
      explanation: [
        'useCounter() creates a fresh `count` ref every time it is called — each component gets its own counter.',
        'increment and reset are closures over that same `count` ref, so they always mutate the right state.',
        'The component destructures `{ count, increment }` and uses them exactly like local state.',
        'Because `count` is a ref, Vue tracks it and re-renders the template when it changes.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A composable is a function that leverages Vue\'s Composition API to encapsulate and reuse stateful, reactive logic. By convention it is named with a "use" prefix and is called synchronously inside setup() / <script setup>, where it may create reactive state (ref/reactive), derived state (computed), side effects (watch/watchEffect), and register lifecycle hooks (onMounted, etc.). It returns refs/reactive objects and functions, and because each invocation runs fresh, every consuming component instance receives its own isolated state unless the composable deliberately defines state at module scope.',

  // 7. Internal Working
  internalWorking: [
    'A composable is just a normal function — there is no special runtime registration; the "magic" is that it runs during a component\'s setup() phase while Vue\'s currentInstance is active.',
    'When it calls ref()/reactive(), Vue creates reactive containers (RefImpl / Proxy) that are tracked by the active effect (the component\'s render effect) when read in the template.',
    'When it calls onMounted/onUnmounted, Vue reads the internal currentInstance pointer set during setup and attaches the hook to THAT component instance — which is why composables must be called synchronously inside setup, not in an async callback.',
    'Returned refs are bound by reference into the calling component\'s setup scope; the render function dereferences them via .value (or auto-unwrapped in the template), establishing dependency tracking.',
    'Each call creates a new closure with its own refs, so two components calling the same composable get fully independent reactive state — unless state is declared outside the function (module scope), which is then shared by all callers.',
    'Cleanup (watchers, listeners) is tied to the instance lifecycle: onUnmounted hooks registered inside the composable fire when the host component unmounts, automatically tearing down side effects.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ComponentA setup()            ComponentB setup()
        │                              │
        │ calls useMouse()             │ calls useMouse()
        ▼                              ▼
  ┌──────────────────┐          ┌──────────────────┐
  │ x = ref(0)       │          │ x = ref(0)       │   ← INDEPENDENT
  │ y = ref(0)       │          │ y = ref(0)       │     state per call
  │ onMounted(...)   │          │ onMounted(...)   │
  │ return { x, y }  │          │ return { x, y }  │
  └────────┬─────────┘          └────────┬─────────┘
           │ refs bound into            │ refs bound into
           ▼ A's render effect          ▼ B's render effect
     template re-renders          template re-renders
     when A.x/A.y change          when B.x/B.y change

  (module-scope state, if any, would be SHARED across A and B)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each call to a composable creates a new closure on the heap holding its refs (count, x, y…). These live as long as the consuming component instance references them.',
    'Returned refs are reachable from the component\'s setup scope; when the component unmounts and is GC\'d, those refs become unreachable and are collected.',
    'Module-scope state declared OUTSIDE the function body is allocated once and shared — it persists for the app lifetime and is the source of "why do all my components share the same value?" bugs.',
    'Watchers and event listeners registered inside the composable capture the refs; if not cleaned up via onUnmounted/onScopeDispose they keep the closure alive (a leak).',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — useToggle',
      lang: 'js',
      code: 'import { ref } from \'vue\'\n\nexport function useToggle(initial = false) {\n  const state = ref(initial)\n  const toggle = () => { state.value = !state.value }\n  return { state, toggle }\n}\n\n// <script setup>\n// const { state: isOpen, toggle } = useToggle()\n// </script>',
      explanation: [
        '`state` is a ref so the template stays reactive.',
        '`toggle` closes over `state` and flips it.',
        'Destructuring lets you rename: `state: isOpen` reads naturally in the component.',
        'Each component calling useToggle() gets its own independent boolean.',
      ],
    },
    intermediate: {
      label: 'Intermediate — useMouse with lifecycle cleanup',
      lang: 'js',
      code: 'import { ref, onMounted, onUnmounted } from \'vue\'\n\nexport function useMouse() {\n  const x = ref(0)\n  const y = ref(0)\n  function update(e) { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', update))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update))\n  return { x, y }\n}',
      explanation: [
        'The composable registers a lifecycle hook on the CALLING component — onMounted attaches the listener when that component mounts.',
        'onUnmounted removes the listener, so the side effect is automatically cleaned up — no leaks.',
        'Lifecycle hooks work because the composable runs synchronously during setup while currentInstance is active.',
        'Two components using useMouse each get their own x/y and their own listener pair.',
      ],
    },
    advanced: {
      label: 'Advanced — useFetch returning loading/error/data + composing watchers',
      lang: 'js',
      code: 'import { ref, watchEffect, toValue } from \'vue\'\n\nexport function useFetch(url) {\n  const data = ref(null)\n  const error = ref(null)\n  const loading = ref(false)\n\n  watchEffect(async (onCleanup) => {\n    const u = toValue(url)            // accept ref, getter, or plain value\n    loading.value = true\n    error.value = null\n    const controller = new AbortController()\n    onCleanup(() => controller.abort())\n    try {\n      const res = await fetch(u, { signal: controller.signal })\n      data.value = await res.json()\n    } catch (e) {\n      if (e.name !== \'AbortError\') error.value = e\n    } finally {\n      loading.value = false\n    }\n  })\n\n  return { data, error, loading }\n}',
      explanation: [
        '`toValue(url)` normalizes input so callers may pass a ref, a getter, or a plain string — a key composable design pattern for accepting reactive arguments.',
        'watchEffect re-runs the fetch whenever the reactive `url` changes, making the composable reactive end-to-end.',
        'onCleanup aborts the in-flight request before a new one starts, preventing race conditions where a stale response overwrites fresh data.',
        'Returning { data, error, loading } as refs gives the consuming component a complete async UI state out of the box.',
        'No module-scope state, so every caller fetches independently.',
      ],
    },
    realProject: {
      label: 'Real project — useAuth shared across the app',
      lang: 'js',
      code: '// composables/useAuth.js\nimport { ref, computed, readonly } from \'vue\'\n\n// MODULE scope → shared singleton state across the whole app\nconst user = ref(null)\nconst token = ref(localStorage.getItem(\'token\'))\n\nexport function useAuth() {\n  const isLoggedIn = computed(() => !!user.value)\n  async function login(creds) {\n    const res = await fetch(\'/api/login\', { method: \'POST\', body: JSON.stringify(creds) })\n    const json = await res.json()\n    user.value = json.user\n    token.value = json.token\n    localStorage.setItem(\'token\', json.token)\n  }\n  function logout() {\n    user.value = null; token.value = null\n    localStorage.removeItem(\'token\')\n  }\n  return { user: readonly(user), isLoggedIn, login, logout }\n}',
      explanation: [
        'Here state is INTENTIONALLY at module scope, so every component shares the same user/token — a lightweight global store via composable.',
        'This is a deliberate design choice: shared auth state should be a singleton, unlike useMouse which should be per-component.',
        '`readonly(user)` exposes user without letting components mutate it directly — they must go through login/logout.',
        'This pattern (module-scope refs + a use() accessor) is how many teams build small stores before reaching for Pinia.',
        'Knowing WHEN to share vs isolate state is the senior-level distinction in composable design.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a composable in Vue 3?',
      answer: 'A composable is a reusable function, conventionally prefixed with "use", that uses the Composition API (ref, reactive, computed, watch, lifecycle hooks) to encapsulate stateful logic so multiple components can reuse it. It returns reactive state and functions.',
      explanation: 'A good answer names the "use" convention, mentions reactivity, and stresses logic REUSE — not just "a function in Vue".',
    },
    {
      level: 'beginner',
      question: 'Why must a composable return refs instead of plain values?',
      answer: 'Returning a ref preserves reactivity. If you return ref.value (a plain number/string), the component receives a one-time snapshot that never updates. Returning the ref itself keeps the live connection so the template re-renders on change.',
      explanation: 'This tests understanding that reactivity travels with the ref object, not the unwrapped value.',
    },
    {
      level: 'intermediate',
      question: 'Why must composables be called synchronously inside setup, not in an async callback?',
      answer: 'Lifecycle hooks like onMounted rely on Vue\'s internal currentInstance pointer, which is only set during synchronous execution of setup. Calling them after an await or in a setTimeout means currentInstance is null, so the hook registers nowhere or throws.',
      explanation: 'Senior signal — connects the rule to the actual currentInstance mechanism rather than treating it as arbitrary.',
    },
    {
      level: 'intermediate',
      question: 'How do composables avoid the naming-collision problem that plagued mixins?',
      answer: 'With composables you explicitly destructure what you need (`const { x, y } = useMouse()`), so the source of every variable is visible and you can rename on the spot. Mixins merged properties implicitly into `this`, making collisions silent and origins opaque.',
      explanation: 'Demonstrates understanding of WHY composables replaced mixins, a very common comparison question.',
    },
    {
      level: 'advanced',
      question: 'How do you accept a reactive argument (like a ref) into a composable?',
      answer: 'Accept it and normalize with toValue() / unref(), and read it inside a watch/watchEffect/computed so the composable re-runs when the argument changes. Use toValue() to support refs, getters, and plain values uniformly.',
      explanation: 'Shows mastery of building reactive composables that respond to changing inputs — the basis of useFetch-style utilities.',
    },
    {
      level: 'senior',
      question: 'When should composable state be module-scope (shared) vs created inside the function (per-instance)?',
      answer: 'Create state inside the function for per-component logic (useMouse, useCounter) so each consumer is isolated. Put state at module scope when you want a shared singleton (useAuth, useTheme) — but be aware module-scope state in SSR can leak across requests, so use provide/inject or a per-request store instead.',
      explanation: 'The SSR caveat plus the deliberate isolate-vs-share decision is exactly what distinguishes a senior answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does a composable differ from a Pinia store?',
    'What is toValue() and why is it preferred over unref() in modern composables?',
    'How do you clean up side effects in a composable that is used outside a component? (effectScope / onScopeDispose)',
    'Can a composable call another composable? (yes — composition is the whole point)',
    'Why can module-scope composable state be dangerous in SSR?',
    'How would you test a composable in isolation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Returning `count.value` (the unwrapped value) instead of the `count` ref.',
      why: 'The component then holds a static snapshot with no reactive link, so the UI never updates.',
      fix: 'Return the ref itself; let the template unwrap it. Only unwrap when you genuinely need a one-time value.',
    },
    {
      mistake: 'Calling a composable inside a watcher, async callback, or after an await.',
      why: 'Lifecycle hooks need the active currentInstance which only exists during synchronous setup; otherwise onMounted etc. fail silently or warn.',
      fix: 'Call composables at the top level of setup/<script setup>, synchronously.',
    },
    {
      mistake: 'Accidentally putting state at module scope and sharing it across all components.',
      why: 'All instances mutate the same refs, causing surprising cross-component interference (and SSR cross-request leaks).',
      fix: 'Declare reactive state INSIDE the function body unless you explicitly want a shared singleton.',
    },
    {
      mistake: 'Not cleaning up listeners/timers registered in the composable.',
      why: 'They keep the closure (and captured refs) alive after the component unmounts — a memory leak.',
      fix: 'Pair every onMounted side effect with onUnmounted cleanup, or use VueUse helpers that auto-clean.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'VueUse', detail: 'The entire VueUse library is composables — useMouse, useLocalStorage, useIntersectionObserver, useDebounceFn — and it is the de-facto standard for reusable Vue logic in production apps.' },
    { area: 'Vue', detail: 'Feature teams extract domain logic (useCart, useCheckout, useFeatureFlags) into composables so the same logic powers desktop and mobile components without duplication.' },
    { area: 'Nuxt', detail: 'Nuxt ships built-in composables (useFetch, useAsyncData, useState, useRoute) and auto-imports anything in the composables/ directory, making them the primary unit of reuse in Nuxt apps.' },
    { area: 'Pinia', detail: 'Pinia\'s setup-store syntax is literally a composable (defineStore(\'x\', () => { ... })), so understanding composables is a prerequisite for modern store authoring.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Composables add essentially zero runtime overhead — they are plain function calls that run once during setup.',
      'They enable lazy, fine-grained reactivity (computed caching, scoped watchers) instead of re-deriving values in every render.',
    ],
    bad: [
      'A composable that registers a global listener per instance can multiply listeners if many components mount it.',
      'Heavy synchronous work inside a composable runs during setup and can delay first render.',
    ],
    optimizations: [
      'Share expensive resources (a single WebSocket, an IntersectionObserver) via module-scope or refcounting rather than per-instance.',
      'Use computed for derived values so they are cached and only recompute on dependency change.',
      'Clean up with onUnmounted / onScopeDispose to release listeners and avoid accumulating work.',
      'Use toValue + watch so the composable only re-runs when inputs actually change.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['script-setup', 'ref', 'reactive', 'computed', 'watch'],
    nextConcepts: ['composition-reuse-patterns', 'composition-vs-mixins', 'pinia-basics', 'state-sharing-composables'],
    dependencyNote:
      'Composables sit on top of the reactivity primitives (ref/reactive/computed/watch) and <script setup>; once you understand them you can grasp composition-reuse-patterns, why they beat mixins, and how Pinia setup-stores are built.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a plain function `useCounter()` and stress the "use" naming convention.',
      'Inside it create `const count = ref(0)` and an `increment` function — point out this is private closure state.',
      'Return `{ count, increment }` and note you return the REF, not count.value.',
      'Draw two components both calling useCounter() and show each gets its own count box (per-instance isolation).',
      'Add `onMounted`/`onUnmounted` and explain hooks attach to the calling component because setup runs synchronously with currentInstance set.',
    ],
    diagram: `  useCounter() ──► { count: ref, increment }
       │
   called in A          called in B
       ▼                    ▼
   countA = 0           countB = 0     (independent)
       │                    │
   A re-renders         B re-renders
   on countA change     on countB change`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A composable is a "use"-prefixed function that bundles reactive logic — refs, computed, watchers, lifecycle hooks — so components can reuse it. Each call returns its own state (return the ref, not .value), and lifecycle hooks attach to the calling component because composables run synchronously in setup. They replaced mixins by making every source of state explicit through destructuring. Put state inside the function for per-component logic, at module scope only for a deliberate shared singleton.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A composable is the Vue 3 way to reuse stateful logic. It is just a function — conventionally named useSomething — that uses the Composition API inside: it creates reactive state with ref or reactive, derived values with computed, side effects with watch or watchEffect, and it can register lifecycle hooks like onMounted. It returns the reactive state and any methods, and a component calls it in script setup and destructures the result. The key mental model is that each call runs fresh, so two components calling useMouse each get their own independent x and y — unless you deliberately declare the state at module scope to make a shared singleton, like a useAuth store. Two important rules: you must return the ref itself, not ref.value, because reactivity travels with the ref object; and you must call composables synchronously inside setup, because lifecycle hooks rely on Vue\'s internal currentInstance pointer that only exists during synchronous setup execution. Composables replaced mixins precisely because they are explicit — you see exactly what you destructure, so there are no silent naming collisions or mystery properties on `this`. To accept reactive arguments you use toValue and read them inside a watch so the composable re-runs when inputs change, which is how useFetch-style utilities work. And you always clean up listeners and timers with onUnmounted to avoid leaks. The whole VueUse library and Pinia\'s setup stores are built on this pattern.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Composable vs Pinia store: composables are lighter and need no plugin, but lack devtools time-travel, structured actions, and SSR-safe state hydration that Pinia provides.',
      'Per-instance vs module-scope state: isolation is safe by default but module-scope sharing avoids prop-drilling at the cost of SSR cross-request contamination risk.',
      'Granularity: many tiny composables maximize reuse but increase indirection; large composables are simpler to read but harder to reuse.',
    ],
    edgeCases: [
      'Using a composable outside a component (e.g. in a Pinia store or another composable) means no host instance — lifecycle hooks may not fire; use effectScope() for manual cleanup.',
      'Async work after which you call onMounted will fail because currentInstance is lost across the await.',
      'Destructuring a reactive() returned from a composable breaks reactivity — return refs or use toRefs.',
      'Module-scope state in SSR is shared across all requests on the server, leaking one user\'s data to another.',
    ],
    runtimeBehavior: [
      'Refs returned from composables are tracked by whichever effect reads them; the same ref read in two components creates two dependency edges.',
      'watchEffect inside a composable is bound to the component\'s effect scope and disposed automatically on unmount.',
      'effectScope() lets you group multiple reactive effects so they can be stopped together, which is how libraries build detachable composables.',
    ],
    scalability: [
      'Compose composables: build useUserDashboard from useUser, useNotifications, usePreferences to keep each unit testable.',
      'Share singleton resources (sockets, observers) with refcounting so N components do not open N connections.',
      'For SSR, prefer provide/inject or a per-request store over module-scope refs to keep state request-isolated.',
    ],
    productionConcerns: [
      'Leaks from un-cleaned listeners are the top composable bug; standardize on VueUse or onScopeDispose.',
      'Test composables by mounting them in a throwaway test component or via @vue/test-utils withSetup helpers.',
      'Document whether a composable is per-instance or singleton — ambiguity causes shared-state bugs across the team.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Composable = "use"-prefixed function using the Composition API to reuse stateful logic.',
    'Return the REF, not ref.value — reactivity travels with the ref object.',
    'Call synchronously in setup; lifecycle hooks need the active currentInstance.',
    'Each call = fresh independent state (closure per call).',
    'Module-scope state = shared singleton (intentional only).',
    'Accept reactive args via toValue() and read inside watch/computed.',
    'Clean up listeners/timers with onUnmounted / onScopeDispose.',
    'Composables can call other composables — composition is the point.',
    'They replaced mixins: explicit destructuring, no silent collisions.',
    'VueUse, Nuxt built-ins, and Pinia setup-stores are all composables.',
    'Use computed for cached derived state inside a composable.',
    'Watch out: module-scope state leaks across requests in SSR.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a useToggle(initial = false) composable returning { state, toggle }.',
      hint: 'Use a ref and a function that flips it.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const state = ref(initial)\n  const toggle = () => { state.value = !state.value }\n  return { state, toggle }\n}',
        explanation: ['state is a ref so the UI stays reactive.', 'toggle closes over state and flips it.', 'Returning the ref preserves the live reactive link.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write useLocalStorage(key, initial) that reads from localStorage and writes back whenever the value changes.',
      hint: 'Use a ref seeded from localStorage and a watch to persist.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nexport function useLocalStorage(key, initial) {\n  const stored = localStorage.getItem(key)\n  const value = ref(stored ? JSON.parse(stored) : initial)\n  watch(value, (v) => {\n    localStorage.setItem(key, JSON.stringify(v))\n  }, { deep: true })\n  return value\n}',
        explanation: [
          'The ref is seeded from localStorage on first call.',
          'watch persists every change back to localStorage.',
          'deep: true catches nested mutations for object values.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write useFetch(url) that accepts a ref OR plain url and re-fetches when the url changes, returning { data, error, loading }.',
      hint: 'Use toValue() and watchEffect, with AbortController cleanup.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect, toValue } from \'vue\'\nexport function useFetch(url) {\n  const data = ref(null), error = ref(null), loading = ref(false)\n  watchEffect(async (onCleanup) => {\n    loading.value = true; error.value = null\n    const controller = new AbortController()\n    onCleanup(() => controller.abort())\n    try {\n      const res = await fetch(toValue(url), { signal: controller.signal })\n      data.value = await res.json()\n    } catch (e) { if (e.name !== \'AbortError\') error.value = e }\n    finally { loading.value = false }\n  })\n  return { data, error, loading }\n}',
        explanation: [
          'toValue(url) supports refs, getters, and plain strings.',
          'watchEffect re-runs whenever the reactive url changes.',
          'onCleanup aborts the previous request, preventing stale-response races.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a useEventListener(target, event, handler) that auto-removes the listener on unmount and works even if target is a ref.',
      hint: 'Register in onMounted (or watch the target) and remove in onUnmounted; unref the target.',
      solution: {
        lang: 'js',
        code: 'import { onMounted, onUnmounted, watch, unref } from \'vue\'\nexport function useEventListener(target, event, handler) {\n  let cleanup = () => {}\n  const attach = () => {\n    const el = unref(target)\n    if (!el) return\n    el.addEventListener(event, handler)\n    cleanup = () => el.removeEventListener(event, handler)\n  }\n  onMounted(attach)\n  watch(() => unref(target), () => { cleanup(); attach() })\n  onUnmounted(() => cleanup())\n}',
        explanation: [
          'unref(target) supports both raw elements and refs (e.g. template refs).',
          'onMounted attaches; onUnmounted guarantees removal — no leak.',
          'watching the target re-attaches if the element changes, mirroring VueUse\'s implementation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Composables are the backbone of every modern Vue 3 codebase. Mastering them proves you understand the Composition API, reactivity, lifecycle, and clean architecture — the exact skills senior Vue roles screen for.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and a useCounter example. Product companies (Zoho, Flipkart, Razorpay) ask you to build useFetch or useDebounce live and explain reactivity. FAANG-level interviews probe currentInstance, effectScope, SSR module-scope leaks, and composable composition.',
    whatInterviewersExpect:
      'They expect you to write a clean useXxx, return refs (not .value), justify the synchronous-setup rule via currentInstance, contrast composables with mixins and Pinia, and reason about per-instance vs shared state including the SSR caveat.',
  },
}

export default composables
