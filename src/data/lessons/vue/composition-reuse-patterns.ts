import type { ConceptLesson } from '../../../types/lesson'

const compositionReusePatterns: ConceptLesson = {
  // 1. Concept Summary
  slug: 'composition-reuse-patterns',
  name: 'Composition Reuse Patterns',
  category: 'composition-api',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Reuse patterns are how you avoid copy-pasting the same fetch/loading/error or event-listener logic into every component.',
    'They are the Composition-API answer to mixins and HOCs — explicit, conflict-free, and tree-shakeable.',
    'Composables (useXxx functions) are the primary reuse unit; knowing how to design their inputs, returns, and cleanup is a senior skill.',
    'Good patterns (return refs, accept refs/getters, register cleanup) make logic reactive, flexible, and leak-free across many call sites.',
    'Interviewers use this topic to see whether you can architect reusable, testable logic rather than just wire up a single component.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Composition reuse is like a recipe card — write the recipe once, and anyone can cook it in their own kitchen.',
    story: [
      'Imagine you invent a great recipe for cookies and write it on a card.',
      'Now your friends, your cousins, and your neighbours can all make the same cookies in their own kitchens, with their own ovens.',
      'You did not have to go to each house and bake for them — they just follow the card.',
      'A composable is a recipe card for behaviour: you write "how to do this" once, and any component can use it in its own setup.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When many components need the same logic — like tracking the mouse position or fetching data — you do not want to copy that code into each one.',
    'In Vue 3 you write that logic once in a plain function whose name starts with "use", called a composable.',
    'The composable creates reactive state and returns it; any component calls the composable in its setup and uses what it returns.',
    'Because each call creates fresh state, two components using the same composable do not interfere with each other.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Composition reuse patterns are the techniques for extracting and sharing stateful logic using the Composition API — primarily composables (use* functions), plus supporting patterns like accepting refs/getters as inputs, returning refs, and registering lifecycle cleanup.',
    how: 'A composable is a function that calls Composition APIs (ref, computed, watch, lifecycle hooks) and returns reactive state and methods. Components invoke it inside setup(); each invocation gets its own isolated reactive state. Inputs can be plain values, refs, or getters; toValue/toRef normalize them.',
    why: 'It replaces mixins/HOCs with explicit, named, conflict-free, type-safe logic units that are easy to test and tree-shake, and that compose together cleanly.',
    code: {
      label: 'A reusable mouse-tracker composable',
      lang: 'ts',
      code: '// useMouse.ts\nimport { ref, onMounted, onUnmounted } from \'vue\'\nexport function useMouse() {\n  const x = ref(0)\n  const y = ref(0)\n  function update(e: MouseEvent) { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', update))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update)) // cleanup!\n  return { x, y }\n}\n\n// any component\n// const { x, y } = useMouse()',
      explanation: [
        'Logic lives once in useMouse; any component reuses it.',
        'It returns refs so consumers stay reactive after destructuring.',
        'onMounted/onUnmounted register and clean up the listener per instance.',
        'Each call to useMouse() gets independent x/y — no shared-state collisions.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Composition reuse patterns center on composables: functions invoked inside setup() that encapsulate stateful logic by calling Composition APIs and returning reactive state plus methods. Each invocation creates an isolated reactive scope bound to the calling instance, so lifecycle hooks and watchers registered inside the composable attach to that component and are cleaned up with it. Idiomatic patterns include: returning refs (so destructuring preserves reactivity), accepting flexible inputs (value | Ref | getter, normalized via toValue/toRef), registering side-effect cleanup (onUnmounted, watch onCleanup), and using effectScope for grouped disposal. These patterns supersede mixins (no implicit merging/name clashes) and HOCs (no wrapper nesting).',

  // 7. Internal Working
  internalWorking: [
    'A composable is just a function; when called inside setup(), the currentInstance is active, so onMounted/onUnmounted/watch registered inside it bind to the calling component.',
    'Reactive primitives created in the composable (ref/reactive/computed) set up their own dependency tracking; the consumer reading them becomes a dependency and re-renders on change.',
    'Because each call executes the function fresh, it allocates new reactive state per instance — isolation is automatic, unlike mixins which merge into one instance.',
    'Lifecycle hooks registered inside the composable are tied to the component\'s lifecycle, so cleanup (removeEventListener, clearInterval) runs on the consumer\'s unmount.',
    'effectScope can wrap a composable\'s effects so they can be disposed together (e.g. for composables used outside components or that manage many watchers).',
    'Inputs passed as refs/getters keep the composable reactive to changing arguments; toValue() reads the current value uniformly whether the input is a value, ref, or getter.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   useFeature(input)                 returns { state, actions }
   ┌─────────────────────────────┐
   │ const state = ref(...)       │  fresh per call → isolation
   │ watch(input, ...)            │  reacts to ref/getter inputs
   │ onMounted(() => subscribe)   │  bound to CALLER instance
   │ onUnmounted(() => cleanup)   │  disposed with caller
   │ return { state, actions }    │  refs → destructurable
   └──────────────┬──────────────┘
                  │
   ComponentA ────┤  each gets its OWN state
   ComponentB ────┘  (no shared collisions, unlike mixins)`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — extract a counter into a composable',
      lang: 'ts',
      code: '// useCounter.ts\nimport { ref } from \'vue\'\nexport function useCounter(initial = 0) {\n  const count = ref(initial)\n  const inc = () => count.value++\n  const dec = () => count.value--\n  return { count, inc, dec }\n}\n\n// component setup\n// const { count, inc } = useCounter(10)',
      explanation: [
        'Reusable logic is a plain function returning refs + methods.',
        'An argument (initial) configures each call.',
        'Returning refs keeps count reactive after destructuring.',
        'Two components calling useCounter get independent counters.',
      ],
    },
    intermediate: {
      label: 'Intermediate — accept a ref/getter input',
      lang: 'ts',
      code: '// useDocumentTitle.ts\nimport { watch, toValue, type MaybeRefOrGetter } from \'vue\'\nexport function useDocumentTitle(title: MaybeRefOrGetter<string>) {\n  watch(\n    () => toValue(title),       // works for value | ref | getter\n    (t) => { document.title = t },\n    { immediate: true },\n  )\n}\n\n// usages\n// useDocumentTitle(\'Static\')\n// useDocumentTitle(pageTitleRef)\n// useDocumentTitle(() => `Inbox (${unread.value})`)',
      explanation: [
        'MaybeRefOrGetter lets callers pass a value, a ref, or a getter.',
        'toValue() normalizes the input each time it is read.',
        'watch reacts when a ref/getter input changes.',
        'This flexible-input pattern makes composables ergonomic and reactive.',
      ],
    },
    advanced: {
      label: 'Advanced — async data composable with cleanup',
      lang: 'ts',
      code: '// useFetch.ts\nimport { ref, watch, toValue, type MaybeRefOrGetter } from \'vue\'\nexport function useFetch<T>(url: MaybeRefOrGetter<string>) {\n  const data = ref<T | null>(null)\n  const error = ref<Error | null>(null)\n  const loading = ref(false)\n\n  watch(\n    () => toValue(url),\n    async (u, _old, onCleanup) => {\n      const ac = new AbortController()\n      onCleanup(() => ac.abort())     // cancel stale request\n      loading.value = true; error.value = null\n      try {\n        const res = await fetch(u, { signal: ac.signal })\n        data.value = (await res.json()) as T\n      } catch (e) {\n        if ((e as Error).name !== \'AbortError\') error.value = e as Error\n      } finally {\n        loading.value = false\n      }\n    },\n    { immediate: true },\n  )\n  return { data, error, loading }\n}',
      explanation: [
        'Reactive url re-fetches automatically when it changes.',
        'watch\'s onCleanup aborts the previous request, preventing race conditions.',
        'Returns data/error/loading refs — the standard async tri-state.',
        'No mixin merging; the logic is self-contained and testable.',
      ],
    },
    realProject: {
      label: 'Real project — composing composables together',
      lang: 'ts',
      code: '// useProductSearch.ts — composes useDebounce + useFetch\nimport { ref, computed } from \'vue\'\nimport { useFetch } from \'./useFetch\'\nimport { useDebounce } from \'./useDebounce\'\n\nexport function useProductSearch() {\n  const query = ref(\'\')\n  const debounced = useDebounce(query, 300)         // debounced ref\n  const url = computed(() => `/api/products?q=${encodeURIComponent(debounced.value)}`)\n  const { data, loading, error } = useFetch<Product[]>(url)  // reactive url drives fetch\n  return { query, products: data, loading, error }\n}\ninterface Product { id: number; name: string }',
      explanation: [
        'Small composables compose into a higher-level one — the key Composition strength.',
        'A debounced ref feeds a computed URL that drives useFetch reactively.',
        'The component just calls useProductSearch() and binds query/products.',
        'This layering is how real search-as-you-type features are structured.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a composable and what naming convention does it follow?',
      answer: 'A composable is a function that uses Composition APIs to encapsulate reusable stateful logic and returns reactive state/methods; by convention its name starts with "use".',
      explanation: 'A good answer ties "use" naming to reactive logic reuse, not just any helper function.',
    },
    {
      level: 'beginner',
      question: 'Why do composables return refs rather than plain values?',
      answer: 'So consumers can destructure them while keeping reactivity — plain values would lose the reactive link.',
      explanation: 'Tests the destructuring/reactivity pitfall that drives the "return refs" convention.',
    },
    {
      level: 'intermediate',
      question: 'How do two components using the same composable avoid sharing state?',
      answer: 'Each call to the composable executes fresh and allocates its own reactive state, so instances are isolated — unlike a module-level singleton.',
      explanation: 'Distinguishes per-call state from intentionally shared (module-scope) state.',
    },
    {
      level: 'intermediate',
      question: 'How do you make a composable react to changing arguments?',
      answer: 'Accept the argument as a ref or getter (MaybeRefOrGetter), read it with toValue(), and watch it so the composable updates when the input changes.',
      explanation: 'Shows the flexible-input pattern central to ergonomic composables.',
    },
    {
      level: 'advanced',
      question: 'How do composables handle side-effect cleanup, and why does it matter?',
      answer: 'They register cleanup with onUnmounted (e.g. removeEventListener/clearInterval) and use watch\'s onCleanup to cancel stale async work; effectScope can dispose grouped effects. This prevents memory leaks and race conditions.',
      explanation: 'Senior signal: leak/race awareness and the cleanup hooks that solve them.',
    },
    {
      level: 'senior',
      question: 'Why are composables preferred over mixins and HOCs for reuse?',
      answer: 'Composables make sources explicit (you see where each value comes from), avoid name collisions and implicit merging (mixins), avoid wrapper/prop-namespace nesting (HOCs), are fully type-inferable, and compose by simple function calls. They are also tree-shakeable.',
      explanation: 'A strong answer contrasts all three on clarity, conflicts, typing, and composition.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When should a composable hold module-level shared state vs per-call state?',
    'What is effectScope and when do you need it?',
    'How do you make a composable usable outside of a component setup?',
    'How do you test a composable in isolation?',
    'What is the difference between a composable and a regular utility function?',
    'How do toValue/toRef/toRefs help in composables?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Returning reactive() and then destructuring it in the consumer.',
      why: 'Destructuring a reactive object yields plain non-reactive values.',
      fix: 'Return refs (or toRefs(state)) so destructuring preserves reactivity.',
    },
    {
      mistake: 'Registering listeners/intervals without cleanup.',
      why: 'They keep running after the component unmounts, leaking memory and firing on dead components.',
      fix: 'Clean up in onUnmounted, and use watch onCleanup / AbortController for async.',
    },
    {
      mistake: 'Accidentally sharing state via module-level refs when isolation was intended.',
      why: 'State declared outside the composable function is shared by all callers.',
      fix: 'Declare state INSIDE the composable for per-call isolation; only hoist it when sharing is the goal.',
    },
    {
      mistake: 'Reading a ref/getter argument once instead of reactively.',
      why: 'A snapshot read ignores later changes to the input.',
      fix: 'Use toValue() inside a computed/watch so the composable tracks the input.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'useFetch/useAsync, useLocalStorage, useEventListener, useIntersectionObserver — reusable building blocks across an app.' },
    { area: 'Component library', detail: 'VueUse is an entire library of composables; libraries ship headless composables for behaviour (useFloating, useFocusTrap).' },
    { area: 'Pinia', detail: 'Setup stores are essentially composables with shared scope; the same return-refs/actions design applies.' },
    { area: 'Nuxt', detail: 'useState, useFetch, useAsyncData are SSR-aware composables; custom composables wrap them for feature logic.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Logic is created once per instance with no per-render overhead, and unused composables are tree-shaken out.',
      'Composing small composables avoids duplicating watchers/effects across components.',
    ],
    bad: [
      'Forgetting cleanup leaks listeners/timers and can fire effects on unmounted components.',
      'Over-wrapping (many tiny composables each adding watchers) can multiply effect count.',
    ],
    optimizations: [
      'Use effectScope to group and dispose related effects efficiently.',
      'Prefer computed for derivations so work is cached and only recomputes on dependency change.',
      'Use shallowRef for large external data to avoid deep tracking overhead.',
      'Abort stale async work via watch onCleanup/AbortController to avoid wasted requests.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['composables', 'script-setup', 'watch'],
    nextConcepts: ['composition-vs-mixins', 'pinia-basics', 'headless-components'],
    dependencyNote:
      'These patterns build directly on composables and the Composition API (ref/computed/watch, script-setup). They are the modern alternative compared in composition-vs-mixins, and scale up into Pinia setup stores and headless components.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a useXxx(input) function returning { state, actions }.',
      'Inside, draw ref/computed/watch and onMounted/onUnmounted, labelling cleanup.',
      'Show two components calling it, each getting its own state box (isolation).',
      'Add a second composable and show one composable calling another (composition).',
      'Say: "Explicit sources, per-call isolation, cleanup on unmount — why this beats mixins/HOCs."',
    ],
    diagram: `  useA(input) ──┐ returns refs
                ├─► used by Comp1  (own state)
                └─► used by Comp2  (own state)

  useB() { const a = useA(...) ... }   ← composables compose
       cleanup: onUnmounted / watch onCleanup`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Composition reuse means extracting stateful logic into composables — use* functions that call ref/computed/watch/lifecycle hooks and return reactive state plus methods. Each call gets isolated state, so no collisions (unlike mixins) and no wrapper nesting (unlike HOCs). Best practices: return refs (so destructuring stays reactive), accept value|ref|getter inputs read via toValue, register cleanup in onUnmounted and abort stale async via watch onCleanup, and compose small composables into bigger ones. They are explicit, typed, and tree-shakeable.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Composition reuse patterns are how you share stateful logic in Vue 3, and the primary unit is the composable — a function, conventionally named with a use prefix, that calls the Composition APIs and returns reactive state and methods. The mechanism is simple: because the composable runs inside a component\'s setup, any lifecycle hooks or watchers it registers bind to that component, and any reactive state it creates is fresh on every call. That gives automatic isolation — two components using useCounter get independent counters — which is a big improvement over mixins, where everything merges into one instance and properties can silently collide. There are a few design conventions that make composables good. First, return refs rather than a reactive object, so consumers can destructure them without losing reactivity. Second, accept flexible inputs — a value, a ref, or a getter — and read them with toValue so the composable can react when its argument changes, usually inside a watch or computed. Third, always register cleanup: remove event listeners and clear intervals in onUnmounted, and for async work use watch\'s onCleanup with an AbortController to cancel stale requests and avoid race conditions where an old response overwrites a newer one. The real power shows when composables compose: a useProductSearch can call useDebounce to debounce a query ref, feed that into a computed URL, and pass that to useFetch, so the whole search-as-you-type feature is a few lines. Compared to the old patterns, composables make data sources explicit — you can see exactly where each value comes from — they avoid mixin name clashes and HOC wrapper nesting, they\'re fully type-inferable, and they tree-shake. For genuinely shared state you can hoist refs to module scope or use a Pinia setup store, which follows the same design.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Per-call isolation vs shared singleton: declaring state inside the composable isolates it; hoisting to module scope shares it — choose deliberately.',
      'Many small composables (composable, testable) vs fewer larger ones (fewer effects, simpler) — balance granularity against effect/watcher count.',
    ],
    edgeCases: [
      'Destructuring a returned reactive() loses reactivity — return refs/toRefs.',
      'Using a composable outside setup means no active instance for lifecycle hooks — wrap effects in effectScope.',
      'Stale async without onCleanup/AbortController causes last-write-wins races.',
      'Module-level shared state can leak across SSR requests if not request-scoped.',
    ],
    runtimeBehavior: [
      'Lifecycle hooks inside composables bind to the calling instance via currentInstance.',
      'effectScope groups effects so they dispose together, independent of a component.',
      'toValue normalizes value/ref/getter so the same code path stays reactive.',
    ],
    scalability: [
      'Composables scale logic reuse without the combinatorial wrapper nesting of HOCs.',
      'Typed composables propagate inference to every consumer, keeping large codebases safe.',
    ],
    productionConcerns: [
      'SSR: avoid module-level mutable state shared across requests; scope per request.',
      'Audit composables for missing cleanup — the top source of listener/timer leaks.',
      'Test composables in isolation by calling them within a minimal mounted component or effectScope.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Composable = use* function returning reactive state + methods.',
    'Each call = isolated state (no mixin collisions).',
    'Return refs (or toRefs) so destructuring stays reactive.',
    'Accept value|ref|getter inputs; read with toValue().',
    'Watch ref/getter inputs to react to argument changes.',
    'Clean up in onUnmounted; abort async with watch onCleanup + AbortController.',
    'Compose small composables into bigger ones.',
    'effectScope groups/disposes effects (incl. outside components).',
    'Module-scope state = intentional sharing (watch SSR leaks).',
    'Beats mixins (explicit, no merge) and HOCs (no wrapper nesting).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a useToggle(initial) composable returning a boolean ref and a toggle function.',
      hint: 'Return the ref so destructuring keeps reactivity.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const state = ref(initial)\n  const toggle = () => (state.value = !state.value)\n  return { state, toggle }\n}',
        explanation: ['state is a ref so consumers stay reactive.', 'Each call gets its own state.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write useEventListener(target, event, handler) that auto-removes the listener on unmount.',
      hint: 'Add in onMounted, remove in onUnmounted.',
      solution: {
        lang: 'ts',
        code: 'import { onMounted, onUnmounted } from \'vue\'\nexport function useEventListener(\n  target: EventTarget,\n  event: string,\n  handler: EventListenerOrEventListenerObject,\n) {\n  onMounted(() => target.addEventListener(event, handler))\n  onUnmounted(() => target.removeEventListener(event, handler))\n}',
        explanation: ['Listener is registered per instance and cleaned up on unmount.', 'No leaks because removal is tied to lifecycle.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write useFetch(url) where url is a ref/getter and a changing url cancels the in-flight request.',
      hint: 'watch toValue(url) and use onCleanup with AbortController.',
      solution: {
        lang: 'ts',
        code: 'import { ref, watch, toValue, type MaybeRefOrGetter } from \'vue\'\nexport function useFetch<T>(url: MaybeRefOrGetter<string>) {\n  const data = ref<T | null>(null)\n  const loading = ref(false)\n  watch(() => toValue(url), async (u, _o, onCleanup) => {\n    const ac = new AbortController()\n    onCleanup(() => ac.abort())\n    loading.value = true\n    try { data.value = await fetch(u, { signal: ac.signal }).then(r => r.json()) }\n    finally { loading.value = false }\n  }, { immediate: true })\n  return { data, loading }\n}',
        explanation: [
          'A new url aborts the previous fetch via onCleanup, avoiding races.',
          'toValue handles value/ref/getter inputs uniformly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Show a composable that intentionally shares ONE state across all components, and explain how it differs from per-call state.',
      hint: 'Declare the ref at module scope, outside the function.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\n// module-level ref = shared singleton across ALL callers\nconst online = ref(navigator.onLine)\nwindow.addEventListener(\'online\', () => (online.value = true))\nwindow.addEventListener(\'offline\', () => (online.value = false))\n\nexport function useOnlineStatus() {\n  return { online }   // every component sees the SAME ref\n}',
        explanation: [
          'Because online is declared outside the function, all callers share it.',
          'Per-call isolation would require declaring the ref INSIDE useOnlineStatus.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Reuse patterns are where Composition API earns its keep. Designing clean composables — return refs, flexible inputs, cleanup, composition — is exactly the architectural maturity senior interviews and code reviews look for.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is a composable and why use it over mixins". Product companies (Zoho, Flipkart, Razorpay) ask you to write useFetch/useDebounce and discuss cleanup. FAANG-level interviews probe per-call vs shared state, effectScope, async race handling, and SSR state leaks.',
    whatInterviewersExpect:
      'Define composables, demonstrate one with proper return-refs and cleanup, accept reactive inputs via toValue, compose composables together, and contrast the approach with mixins and HOCs on clarity, conflicts, and typing.',
  },
}

export default compositionReusePatterns
