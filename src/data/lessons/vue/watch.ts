import type { ConceptLesson } from '../../../types/lesson'

const watch: ConceptLesson = {
  // 1. Concept Summary
  slug: 'watch',
  name: 'watch',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'watch is how you run side effects in response to reactive changes — fetching data when a route param changes, persisting to storage, syncing with external systems.',
    'It gives you both the old and new value, which computed and watchEffect do not — essential for diffing and conditional logic.',
    'Knowing watch vs watchEffect vs computed is one of the most asked Vue 3 reactivity questions.',
    'Its options — immediate, deep, flush, and the onCleanup callback — solve real production problems like initial loads, nested object watching, and cancelling stale async requests.',
    'Misusing it (watching the wrong source, forgetting deep, leaking async work) is a common source of stale-data and race-condition bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'watch is a guard who only acts when one specific thing changes — and tells you what it was before and what it is now.',
    story: [
      'Imagine a guard whose only job is to watch the front door of your house.',
      'He does nothing all day. But the instant the door opens or closes, he springs into action — maybe he turns on the porch light.',
      'And he is helpful: he tells you "the door WAS closed, now it is open", so you know exactly what changed.',
      'watch is that guard. You point it at one thing (or a few things). When that thing changes, it runs your code and hands you both the old value and the new value.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes when a value changes, you do not just want to show something new — you want to DO something, like save data or call a server.',
    'watch lets you say: "watch this particular value, and run this function whenever it changes".',
    'Unlike a computed (which produces a value), watch runs an action — a side effect — and gives you the new value and the previous value.',
    'You explicitly choose what to watch, so it only reacts to that source. You can also tell it to run once at the start, or to look deeply inside objects.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'watch(source, callback, options?) runs a callback whenever the watched reactive source changes, giving you (newValue, oldValue, onCleanup). The source can be a ref, a reactive object, a getter function, or an array of these.',
    how: 'Vue tracks the source; when it changes, it queues the callback (by default after the source change, before the next render flush is configurable). The callback receives new and old values and an onCleanup hook to dispose previous work (e.g. cancel a fetch) before the next run.',
    why: 'It is the right tool for side effects tied to specific state changes — data fetching, persistence, imperative DOM/3rd-party syncs — where you need precise control and access to the previous value.',
    code: {
      label: 'Refetch when an id changes',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watch } from \'vue\'\nconst userId = ref(1)\nconst user = ref(null)\n\nwatch(userId, async (newId, oldId) => {\n  console.log(\'changed from\', oldId, \'to\', newId)\n  user.value = await fetch(`/api/users/${newId}`).then(r => r.json())\n})\n</script>\n\n<template>\n  <button @click="userId++">Next user</button>\n  <pre>{{ user }}</pre>\n</template>',
      explanation: [
        'watch(userId, cb) runs cb only when userId changes — not on initial setup (by default).',
        'The callback gets newId and oldId, useful for logging and conditional logic.',
        'The side effect (fetch) lives in the callback, which is exactly what watch is for.',
        'Clicking the button changes userId, triggering a refetch.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'watch() registers a lazy reactive effect that observes a specific source — a ref, a reactive object, a getter, or an array of these — and invokes a callback with (newValue, oldValue, onCleanup) whenever the source\'s tracked value changes. It does not run on registration unless immediate: true. Options include deep (recursively track nested properties), immediate (fire once on setup), once (fire at most once), and flush (\'pre\' default, \'post\' after DOM update, \'sync\' synchronously). The onCleanup callback registers teardown that runs before the next invocation or on stop, enabling cancellation of stale async work.',

  // 7. Internal Working
  internalWorking: [
    'watch creates a ReactiveEffect whose getter reads the source (a ref read, reactive traversal, or the provided getter) so it tracks the exact dependencies.',
    'The effect is lazy: it runs the getter once to collect dependencies and capture the initial old value, but the user callback is not invoked unless immediate is set.',
    'When a tracked dependency triggers, the effect\'s scheduler queues the job; by default flush:\'pre\' schedules it before the component re-render in the same tick, deduplicated.',
    'When the job runs, it re-evaluates the source to get the new value, calls any registered onCleanup from the previous run, then invokes the callback with (new, old, onCleanup).',
    'For reactive object sources or deep:true, Vue traverses the structure to touch (and thus track) every nested property, which is why deep watching is more expensive.',
    'Stopping the watcher (via the returned stop handle, scope disposal, or component unmount) removes the effect from all dep Sets and runs the final cleanup.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   watch(source, cb, { deep, immediate, flush })

   source changes ─► scheduler queues job (flush: pre|post|sync)
                         │
                         ▼
        run previous onCleanup()  ← cancels stale async
                         │
                         ▼
        cb(newValue, oldValue, onCleanup)
                         │ register new cleanup
                         ▼
     stop() / unmount ─► remove effect from deps + final cleanup`,

  // 9. Memory Visualization
  memoryVisualization: [
    'WATCHER EFFECT: a ReactiveEffect holding the source getter, the callback, the last old value, and the scheduler.',
    'DEP LINKS: the effect is registered in the dep Sets of every reactive key the source read; deep watching adds it to MANY keys across the tree.',
    'CLEANUP CLOSURE: onCleanup stores a teardown function (e.g. an AbortController.abort) that is invoked before the next run, preventing leaks/races.',
    'LIFECYCLE: created in setup, auto-stopped on unmount (bound to the component effect scope); a manual stop() handle is returned for early disposal.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — watch a single ref',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watch } from \'vue\'\nconst query = ref(\'\')\nwatch(query, (n, o) => {\n  console.log(`query: "${o}" -> "${n}"`)\n})\n</script>\n\n<template><input v-model="query" /></template>',
      explanation: [
        'watch(query, cb) reacts only to query changes.',
        'The callback receives new and old values for diffing/logging.',
        'It does not fire on setup (lazy by default).',
        'Typing updates query, triggering the callback each change.',
      ],
    },
    intermediate: {
      label: 'Intermediate — getter source, multiple sources, immediate',
      lang: 'vue',
      code: '<script setup>\nimport { reactive, watch } from \'vue\'\nconst filters = reactive({ q: \'\', page: 1 })\n\n// getter source: watch a derived expression\nwatch(() => filters.q, (q) => console.log(\'search\', q))\n\n// multiple sources: array, callback gets arrays of new/old\nwatch(\n  () => [filters.q, filters.page],\n  ([q, page], [oldQ, oldPage]) => console.log(q, page, oldQ, oldPage),\n  { immediate: true }, // also run once on setup\n)\n</script>',
      explanation: [
        'A getter source () => filters.q watches just that property of a reactive object.',
        'Watching an array of getters reacts when ANY of them changes; callback receives arrays.',
        'immediate: true runs the callback once at registration with the current values.',
        'On the immediate run, oldValue is undefined — handle that case.',
      ],
    },
    advanced: {
      label: 'Advanced — deep watch and onCleanup for race-free fetching',
      lang: 'vue',
      code: '<script setup>\nimport { ref, reactive, watch } from \'vue\'\nconst form = reactive({ profile: { name: \'\' } })\nconst id = ref(1)\nconst data = ref(null)\n\n// deep: track nested mutations of form.profile\nwatch(form, () => console.log(\'form changed deeply\'), { deep: true })\n\n// onCleanup cancels the stale request when id changes again quickly\nwatch(id, async (newId, _old, onCleanup) => {\n  const ctrl = new AbortController()\n  onCleanup(() => ctrl.abort())\n  data.value = await fetch(`/api/${newId}`, { signal: ctrl.signal }).then(r => r.json())\n})\n</script>',
      explanation: [
        'Watching a reactive object with deep:true reacts to nested property changes.',
        'onCleanup registers teardown that runs BEFORE the next callback (or on stop).',
        'AbortController.abort cancels the previous in-flight fetch, preventing a stale response from overwriting newer data.',
        'This is the standard pattern for race-free, watch-driven data fetching.',
      ],
    },
    realProject: {
      label: 'Real project — persist a setting and react to route changes',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watch } from \'vue\'\nimport { useRoute } from \'vue-router\'\n\nconst route = useRoute()\nconst theme = ref(localStorage.getItem(\'theme\') ?? \'light\')\n\n// persist whenever theme changes\nwatch(theme, (t) => localStorage.setItem(\'theme\', t))\n\n// refetch page data when the route param changes\nconst post = ref(null)\nwatch(\n  () => route.params.id,\n  async (id) => { post.value = await fetch(`/api/posts/${id}`).then(r => r.json()) },\n  { immediate: true }, // load on first mount too\n)\n</script>',
      explanation: [
        'Watching theme persists it to localStorage on every change — a classic side effect.',
        'Watching route.params.id refetches when navigating between detail pages.',
        'immediate: true covers the initial mount so the first load happens too.',
        'Both are side effects tied to specific sources — exactly what watch is for.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does watch do and what does its callback receive?',
      answer: 'watch runs a callback when a specified reactive source changes. The callback receives the new value, the old value, and an onCleanup function to dispose previous work.',
      explanation: 'Access to old value and onCleanup are the distinguishing features.',
    },
    {
      level: 'beginner',
      question: 'Does watch run immediately when the component sets up?',
      answer: 'No, not by default — it is lazy and only fires when the source changes. Pass { immediate: true } to also run it once on setup.',
      explanation: 'The immediate option is a frequent follow-up; on that first run oldValue is undefined.',
    },
    {
      level: 'intermediate',
      question: 'What can you pass as the watch source?',
      answer: 'A ref, a reactive object, a getter function returning a value, or an array of any of these. Watching a reactive object directly is implicitly deep; a getter lets you watch a specific derived value.',
      explanation: 'Knowing all source shapes — and that a getter is preferred for a single property — shows fluency.',
    },
    {
      level: 'intermediate',
      question: 'Why might a watcher on a nested property not fire, and how do you fix it?',
      answer: 'If you watch a getter that returns the parent object, mutations to nested properties may not trigger unless you enable deep:true, or you watch the specific nested getter. Watching a reactive object directly is deep automatically.',
      explanation: 'Tests understanding of shallow vs deep watching and getter granularity.',
    },
    {
      level: 'advanced',
      question: 'How do you prevent race conditions when watch triggers async work repeatedly?',
      answer: 'Use the onCleanup callback to cancel the previous in-flight operation (e.g. AbortController.abort) before the next run, or track a request token and ignore stale responses. onCleanup runs before each subsequent invocation and on stop.',
      explanation: 'Senior signal: recognizing the stale-response race and the onCleanup/AbortController fix.',
    },
    {
      level: 'senior',
      question: 'What does the flush option control and when would you use post or sync?',
      answer: 'flush controls when the callback runs relative to component updates. \'pre\' (default) runs before the DOM updates; \'post\' runs after the DOM is patched (use when you need to read the updated DOM, e.g. measure an element); \'sync\' runs synchronously on every change (rarely needed, can hurt performance and cause re-entrancy).',
      explanation: 'Demonstrates understanding of the scheduler timing and concrete reasons to change flush.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'watch vs watchEffect vs computed — when each?',
    'How do you watch a single property of a reactive object? (getter source)',
    'Why is watching a reactive object deep by default but a getter is not?',
    'How do you stop a watcher manually?',
    'What runs first on immediate:true and what is oldValue then?',
    'How does flush: post help when reading the DOM?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Watching a reactive object property by passing the property value, e.g. watch(state.count, ...).',
      why: 'You pass the current primitive value, not a reactive source, so it never reacts.',
      fix: 'Use a getter: watch(() => state.count, cb).',
    },
    {
      mistake: 'Expecting nested mutations to fire without deep.',
      why: 'A getter returning an object only tracks the reference, not nested keys.',
      fix: 'Add { deep: true } or watch the specific nested getter.',
    },
    {
      mistake: 'Not cancelling stale async work, causing race conditions.',
      why: 'An older fetch can resolve after a newer one and overwrite correct data.',
      fix: 'Use onCleanup with AbortController, or ignore responses for outdated tokens.',
    },
    {
      mistake: 'Using watch to derive a value that should be a computed.',
      why: 'Manually syncing a ref inside a watcher is error-prone and not cached.',
      fix: 'Use computed for pure derived values; reserve watch for side effects.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Refetching data on route/param changes, persisting settings to localStorage, syncing form state to a parent, and imperative integrations with 3rd-party libraries.' },
    { area: 'Vue Router', detail: 'Watching route.params/route.query to reload page data when navigating between similar routes that reuse the same component.' },
    { area: 'Pinia', detail: 'Watching store state to trigger persistence, analytics, or cross-store synchronization side effects.' },
    { area: 'Component library', detail: 'Watching prop changes (e.g. modelValue) to sync internal state or re-run layout/measurement with flush:\'post\'.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Explicit sources mean watch tracks exactly what you specify, avoiding over-reaction.',
      'Batched (flush:\'pre\') scheduling deduplicates multiple changes in a tick into one callback run.',
    ],
    bad: [
      'deep:true on large objects traverses the whole tree to track it, which is expensive on every change.',
      'flush:\'sync\' runs the callback on every mutation synchronously, which can thrash in hot paths.',
    ],
    optimizations: [
      'Watch the narrowest getter possible instead of a whole object with deep.',
      'Use onCleanup/AbortController to cancel obsolete async work rather than letting it complete.',
      'Prefer computed for derived values to avoid manual watch-and-sync overhead.',
      'Use flush:\'post\' only when you must read updated DOM; otherwise keep the default.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactive', 'computed'],
    nextConcepts: ['watcheffect', 'watch-vs-watcheffect', 'data-fetching-patterns', 'lifecycle-hooks-composition'],
    dependencyNote:
      'watch builds on ref/reactive and complements computed (side effects vs derived values). It leads into watchEffect and the watch-vs-watchEffect comparison, underpins data-fetching-patterns, and interacts with lifecycle-hooks-composition for setup/teardown timing.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write watch(source, (newVal, oldVal, onCleanup) => {...}, options).',
      'List valid sources: ref, reactive object (deep), getter, array of these.',
      'Show the lazy default and the immediate:true option (oldVal undefined on first run).',
      'Draw onCleanup running before the next callback to cancel stale async (AbortController).',
      'Mention flush pre/post/sync timing and contrast with computed (value) and watchEffect (auto-deps).',
    ],
    diagram: `   watch(source, cb, {deep, immediate, flush})
        source change ─► queue (pre|post|sync)
              │
        run prev onCleanup ─► cancel stale fetch
              │
        cb(new, old, onCleanup)  ── register new cleanup
              │
        unmount/stop ─► detach + final cleanup`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'watch runs a callback when a specific reactive source changes, giving you new value, old value, and onCleanup. Sources can be a ref, reactive object (deep by default), getter, or array. It is lazy unless immediate:true. Use it for side effects — fetching, persistence, syncing — not derived values (use computed). Options: deep for nested tracking, flush for timing (pre/post/sync), and onCleanup with AbortController to cancel stale async and avoid races.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'watch lets you run a side effect when a specific reactive source changes. You give it a source — which can be a ref, a reactive object, a getter function, or an array of those — and a callback that receives the new value, the old value, and an onCleanup function. The access to the old value is one of its defining features and distinguishes it from watchEffect and computed. By default watch is lazy: it does not run on setup, only when the source actually changes; pass immediate:true to also fire once at registration, though on that first run the old value is undefined. Internally watch creates a lazy reactive effect whose getter reads the source to track exactly the right dependencies, then queues the callback through the scheduler when those dependencies trigger. The flush option controls timing: pre, the default, runs before the component re-renders; post runs after the DOM is patched, which you want when you need to measure or read the updated DOM; sync runs synchronously on every change and is rarely appropriate. Two options matter a lot in practice. deep:true recursively tracks nested properties — note that watching a reactive object directly is implicitly deep, but a getter returning an object is not, which is a common gotcha. And onCleanup is how you avoid race conditions: it registers teardown that runs before the next callback or when the watcher stops, so you can call AbortController.abort to cancel a stale in-flight request before starting a new one. The key judgment is using watch only for side effects — fetching, persisting to storage, syncing with third-party libraries — and reaching for computed when you actually want a cached derived value, since manually syncing state inside a watcher is error-prone and uncached.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'watch (explicit source, gives old value) vs watchEffect (auto-collected deps, no old value): watch is precise and good for async; watchEffect is concise for setup-style sync side effects.',
      'deep watching is convenient but costly; narrow getters are more performant but require knowing the exact property.',
    ],
    edgeCases: [
      'On immediate:true the oldValue is undefined; code must guard against it.',
      'Watching a reactive object passes the same (mutated) object as both new and old, so reference comparison is useless — use deep diffing or watch specific getters.',
      'flush:\'sync\' can cause re-entrancy if the callback mutates the watched source.',
      'Watchers created outside a component scope (in a composable used at module level) must be stopped manually to avoid leaks.',
    ],
    runtimeBehavior: [
      'Callbacks are batched and deduped per tick with flush:\'pre\'; multiple synchronous source changes yield one callback with the final value.',
      'onCleanup runs before each subsequent run and on stop, in registration order.',
      'Deep traversal touches every nested key to establish tracking, which also pins those keys as dependencies.',
    ],
    scalability: [
      'Avoid many deep watchers on large state; prefer targeted getters or restructure state.',
      'For high-frequency sources (mouse move, scroll), debounce/throttle inside the callback or use a derived debounced ref to limit work.',
    ],
    productionConcerns: [
      'Stale-response races are the most common watch bug in data fetching — always wire onCleanup/AbortController.',
      'Forgotten manual stops in long-lived composables leak effects and memory.',
      'Using watch to mirror computed-style derivations leads to drift bugs; review for misuse.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'watch(source, (newVal, oldVal, onCleanup) => {}, options).',
    'Sources: ref, reactive object (deep), getter, array of these.',
    'Lazy by default; immediate:true runs once on setup (oldVal undefined).',
    'deep:true tracks nested mutations; reactive-object source is already deep.',
    'flush: pre (before render) | post (after DOM) | sync (immediate).',
    'onCleanup cancels stale async (AbortController) before the next run.',
    'Use watch for SIDE EFFECTS; computed for derived values.',
    'Watch a reactive property via a GETTER: () => state.count.',
    'Auto-stopped on unmount; returns a stop() handle for manual disposal.',
    'Watching a reactive object gives same ref as new and old — diff with getters.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Watch a count ref and log "from X to Y" on each change.',
      hint: 'The callback gets (new, old).',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nconst count = ref(0)\nwatch(count, (n, o) => console.log(`from ${o} to ${n}`))\ncount.value = 5 // logs "from 0 to 5"',
        explanation: [
          'watch(count, cb) reacts to count changes only.',
          'The callback receives the new and old values for the log.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Watch a single property page of a reactive filters object so nested changes fire correctly.',
      hint: 'Use a getter source, not the value.',
      solution: {
        lang: 'js',
        code: 'import { reactive, watch } from \'vue\'\nconst filters = reactive({ q: \'\', page: 1 })\nwatch(() => filters.page, (page, old) => console.log(\'page\', old, \'->\', page))\nfilters.page = 2 // fires',
        explanation: [
          'A getter () => filters.page makes watch react to that specific property.',
          'Passing filters.page directly would pass a number, not a reactive source.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a race-free search-as-you-type using watch + onCleanup + AbortController.',
      hint: 'Abort the previous request before starting a new one.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nconst q = ref(\'\')\nconst results = ref([])\n\nwatch(q, async (query, _old, onCleanup) => {\n  if (!query) { results.value = []; return }\n  const ctrl = new AbortController()\n  onCleanup(() => ctrl.abort())\n  try {\n    results.value = await fetch(`/api/search?q=${query}`, { signal: ctrl.signal })\n      .then(r => r.json())\n  } catch (e) { if (e.name !== \'AbortError\') throw e }\n})',
        explanation: [
          'onCleanup aborts the in-flight request when q changes again before it resolves.',
          'This guarantees only the latest query result is applied — no stale overwrite.',
          'AbortError is swallowed because aborting is expected, not a real failure.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain when you would use flush:\'post\' and show watching modelValue to measure an element after it updates.',
      hint: 'post runs after the DOM is patched.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nconst open = ref(false)\nconst panel = ref(null) // template ref\n\nwatch(open, () => {\n  // DOM is already updated here because flush is post\n  if (panel.value) console.log(\'height:\', panel.value.offsetHeight)\n}, { flush: \'post\' })',
        explanation: [
          'flush:\'post\' delays the callback until after Vue patches the DOM.',
          'That lets you read accurate layout (offsetHeight) reflecting the new state.',
          'With the default pre flush, the DOM would still be stale at callback time.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'watch is the side-effect tool of Vue reactivity and a guaranteed interview topic. Explaining sources, options (immediate/deep/flush), onCleanup races, and the watch-vs-computed line shows you handle real-world data fetching and state syncing correctly.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and watch vs computed. Product companies (Zoho, Flipkart, Razorpay) ask about deep watching, getter sources, and race-free fetching. FAANG-level interviews probe the scheduler/flush timing, onCleanup semantics, and watcher lifecycle/leaks.',
    whatInterviewersExpect:
      'Correct source forms, the lazy/immediate behavior, deep vs getter granularity, flush timing, and the onCleanup/AbortController pattern for races — plus a clear rule that watch is for side effects and computed for derived values.',
  },
}

export default watch
