import type { ConceptLesson } from '../../../types/lesson'

const computed: ConceptLesson = {
  // 1. Concept Summary
  slug: 'computed',
  name: 'computed',
  category: 'reactivity',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'computed is how you derive state in Vue — any value that depends on other reactive state (totals, filtered lists, formatted strings) should be a computed.',
    'Its caching is the key feature: it only recomputes when its dependencies change, so expensive derivations run once, not on every render.',
    'Knowing computed vs method vs watch is a guaranteed interview question — computed for derived values, methods for actions, watch for side effects.',
    'Misusing it (mutating inside a getter, depending on non-reactive values) causes subtle "stale value" and "never updates" bugs in production.',
    'Clean components lean heavily on computed to keep templates declarative and logic out of the markup.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'computed is a smart calculator that only does the math again when the numbers actually change.',
    story: [
      'Imagine you have a calculator that shows the total price of your shopping cart.',
      'A lazy-but-clever calculator does not redo the sum every single time you glance at it. It remembers the last total.',
      'Only when you ADD or REMOVE an item does it bother to add everything up again, then it remembers that new total.',
      'computed is exactly this. It watches the things it depends on. As long as they stay the same, it hands you the saved answer instantly. The moment one of them changes, it recalculates once and saves the new answer.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue, some values are not stored directly — they are calculated from other values, like a total calculated from a list of prices.',
    'computed lets you define such a value with a function. Vue runs the function and remembers (caches) the result.',
    'If you read the computed value again and nothing it depends on changed, Vue gives you the cached result without re-running the function.',
    'When a dependency does change, Vue marks the cache as stale and recalculates the next time you read it. This makes computed efficient compared to calling a method every time.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'computed() creates a reactive, cached derived value. You give it a getter function; it returns a ref whose .value is the computed result, recalculated only when its reactive dependencies change.',
    how: 'computed runs its getter inside a reactive effect, tracking which reactive values it reads. It caches the result and marks itself "dirty" when a dependency changes; the next .value read re-runs the getter and re-caches. Reads while not dirty return the cache.',
    why: 'It keeps derived data in sync automatically and avoids recomputing expensive logic on every access or render, which a plain method would not.',
    code: {
      label: 'A cached derived total',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\n\nconst items = ref([\n  { name: \'Pen\', price: 2 },\n  { name: \'Book\', price: 8 },\n])\n\nconst total = computed(() =>\n  items.value.reduce((sum, i) => sum + i.price, 0),\n)\n</script>\n\n<template>\n  <ul><li v-for="i in items" :key="i.name">{{ i.name }}: {{ i.price }}</li></ul>\n  <p>Total: {{ total }}</p>\n</template>',
      explanation: [
        'computed(() => ...) returns a ref-like value; in the template you write {{ total }} (auto-unwrapped).',
        'The getter reads items.value, so total depends on items.',
        'Reading total multiple times in one render uses the cached result — the reduce runs once.',
        'If items changes, total is marked stale and recomputes on next access.',
        'In script you would read total.value; in template it auto-unwraps.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'computed() returns a ComputedRef whose value is lazily and reactively derived from a getter. Internally it is a ReactiveEffect configured as lazy with a custom scheduler. The getter runs once on first access, tracking its reactive dependencies; the result is cached. When any dependency triggers, the computed is marked dirty (without immediately recomputing) and any effects depending on the computed are notified. The next read of .value re-runs the getter only if dirty, re-caches, and returns the value. A writable computed accepts { get, set } where set lets you map writes back to underlying state.',

  // 7. Internal Working
  internalWorking: [
    'computed(getter) creates a ComputedRefImpl wrapping a ReactiveEffect with lazy: true (so the getter does not run until first read) and a scheduler that flips a _dirty flag instead of re-running.',
    'On the first .value read, if dirty, the effect runs the getter; reads inside it are tracked, so the computed becomes a dependent of those reactive sources.',
    'The result is stored in _value and _dirty is set to false; subsequent reads return _value without running the getter.',
    'When a tracked dependency changes, its trigger calls the computed\'s scheduler, which sets _dirty = true and triggers the computed\'s OWN dependents (effects/renders that read this computed) — but does NOT recompute yet.',
    'The next time something reads the computed\'s .value and _dirty is true, the getter re-runs, _value updates, _dirty resets — this lazy recompute is what makes it cached.',
    'Reading a computed also tracks the computed itself as a dependency of the active effect, so a render that uses the computed re-runs when the computed value actually changes.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   deps: items, taxRate
        │ change                 read total.value
        ▼                              │
   scheduler: _dirty = true            ▼
        │ (no recompute yet)     is _dirty?
        │                         ├─ no  → return cached _value (fast)
        │                         └─ yes → run getter, cache _value,
        ▼                                   _dirty = false, return it
   notify computed's OWN dependents (renders/effects) ──► they re-read`,

  // 9. Memory Visualization
  memoryVisualization: [
    'COMPUTED REF: a ComputedRefImpl heap object holding _value (the cache), _dirty flag, and an inner ReactiveEffect.',
    'AS DEPENDENT: the inner effect is registered in the dep Sets of every reactive source it read (items, taxRate), so changes notify it.',
    'AS DEPENDENCY: the computed has its own Dep; effects/renders that read total.value are added there, so the computed can notify them when it changes.',
    'CACHE LIFECYCLE: _value lives until a dependency triggers the scheduler (sets _dirty), after which the next read replaces it — no recompute happens between dependency change and next read.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — derived string',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\nconst fullName = computed(() => first.value + \' \' + last.value)\n</script>\n\n<template>\n  <input v-model="first" /> <input v-model="last" />\n  <p>{{ fullName }}</p>\n</template>',
      explanation: [
        'fullName depends on first and last; reading them in the getter tracks them.',
        'Editing either input changes a dependency, marking fullName stale.',
        'The next render reads fullName, recomputes once, and shows the new value.',
        'In the template fullName auto-unwraps; in script use fullName.value.',
      ],
    },
    intermediate: {
      label: 'Intermediate — caching vs a method',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst list = ref([5, 3, 8, 1])\n\n// computed: sorts ONCE per change to list, cached across reads\nconst sorted = computed(() => [...list.value].sort((a, b) => a - b))\n\n// method: re-sorts on EVERY call / every render that calls it\nfunction sortedMethod() { return [...list.value].sort((a, b) => a - b) }\n</script>\n\n<template>\n  <p>{{ sorted }}</p>\n  <p>{{ sorted }}</p> <!-- still cached, no re-sort -->\n  <p>{{ sortedMethod() }}</p> <!-- re-sorts every render -->\n</template>',
      explanation: [
        'sorted caches; reading it twice in one render sorts only once.',
        'sortedMethod() runs the sort each time it appears and on every re-render.',
        'For expensive derivations, computed saves real work via caching.',
        'Rule: derived values → computed; one-off imperative work → method.',
      ],
    },
    advanced: {
      label: 'Advanced — writable computed',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst firstName = ref(\'Ada\')\nconst lastName = ref(\'Lovelace\')\n\nconst fullName = computed({\n  get: () => firstName.value + \' \' + lastName.value,\n  set(value) {\n    const [f, l] = value.split(\' \')\n    firstName.value = f\n    lastName.value = l ?? \'\'\n  },\n})\n</script>\n\n<template>\n  <input v-model="fullName" /> <!-- writes flow back to first/last -->\n  <p>{{ firstName }} | {{ lastName }}</p>\n</template>',
      explanation: [
        'A writable computed takes { get, set } instead of a plain getter.',
        'The getter derives fullName from the two refs.',
        'The setter parses an assigned value and writes back to the underlying refs.',
        'v-model can bind to the writable computed, enabling two-way derived state.',
      ],
    },
    realProject: {
      label: 'Real project — filtered + paginated table',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst rows = ref([])         // fetched data\nconst search = ref(\'\')\nconst page = ref(1)\nconst pageSize = 10\n\nconst filtered = computed(() =>\n  rows.value.filter(r => r.name.toLowerCase().includes(search.value.toLowerCase())),\n)\nconst pageCount = computed(() => Math.ceil(filtered.value.length / pageSize))\nconst pageRows = computed(() =>\n  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),\n)\n</script>\n\n<template>\n  <input v-model="search" placeholder="Filter…" />\n  <tr v-for="r in pageRows" :key="r.id">{{ r.name }}</tr>\n  <p>Page {{ page }} / {{ pageCount }}</p>\n</template>',
      explanation: [
        'Chained computeds: filtered → pageCount and pageRows, each cached.',
        'Typing in search only re-runs filtered (and its dependents), not the whole component logic redundantly.',
        'Changing page re-runs only pageRows since pageCount/filtered are unaffected.',
        'This declarative derivation chain is the idiomatic way to build tables in Vue.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a computed property and why use it?',
      answer: 'A computed is a reactive, cached value derived from other reactive state. You use it for any value that depends on other state, because it recomputes only when its dependencies change and caches the result otherwise.',
      explanation: 'Names the two essentials: derived + cached.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between a computed and a method?',
      answer: 'A computed caches its result and only re-evaluates when a reactive dependency changes; a method runs every time it is called and on every re-render that invokes it. Use computed for derived values and methods for actions or one-off work.',
      explanation: 'The caching distinction is the heart of the answer.',
    },
    {
      level: 'intermediate',
      question: 'When is a computed re-evaluated?',
      answer: 'Lazily: when one of the reactive dependencies it read changes, the computed is marked dirty, and it actually re-runs the getter only on the next read of its value. If nothing reads it, it does not recompute.',
      explanation: 'Lazy + dirty-flag is the precise model; many candidates say "when deps change" but miss the lazy read trigger.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between computed and watch?',
      answer: 'computed produces a derived VALUE (synchronously, cached, no side effects); watch runs a SIDE EFFECT in response to a change (async calls, logging, DOM work). If you only need a derived value, use computed; if you need to do something when state changes, use watch.',
      explanation: 'Value vs side-effect is the clean dividing line.',
    },
    {
      level: 'advanced',
      question: 'Can a computed be writable? How?',
      answer: 'Yes. Pass { get, set } instead of a plain function. The getter derives the value; the setter maps an assigned value back to the underlying state. This lets v-model bind to a derived value.',
      explanation: 'Shows knowledge beyond the read-only default and a concrete use (v-model on derived state).',
    },
    {
      level: 'senior',
      question: 'Why should a computed getter be pure, and what breaks if it is not?',
      answer: 'The getter should have no side effects and depend only on reactive sources. If it mutates state, it can cause infinite update loops or unexpected re-tracking. If it reads non-reactive values (a plain variable, Date.now()), the result will not update when those change, producing stale values. Caching also means side effects would not run predictably.',
      explanation: 'Senior signal: purity, the dirty/caching model, non-reactive dependency staleness, and loop risks.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'computed vs method vs watch — when each?',
    'Is a computed lazy? When exactly does the getter run?',
    'How do you make a computed writable?',
    'What happens if a computed depends on a non-reactive value?',
    'Can a computed have side effects? (it should not)',
    'How does computed caching work under the hood (dirty flag)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating reactive state inside a computed getter.',
      why: 'Getters should be pure; mutating can trigger re-tracking and infinite loops, and breaks caching guarantees.',
      fix: 'Keep getters pure; do side effects in watch/watchEffect or event handlers.',
    },
    {
      mistake: 'Using a method where a computed belongs (e.g. an expensive filter called in the template).',
      why: 'Methods run on every render with no caching, wasting work.',
      fix: 'Move derived values into computed so they are cached.',
    },
    {
      mistake: 'Depending on non-reactive values (plain variables, Date.now()) inside the getter.',
      why: 'Vue only tracks reactive reads; the computed will not update when the non-reactive value changes.',
      fix: 'Make the dependency reactive (ref/reactive), or use watch if it is event-driven.',
    },
    {
      mistake: 'Forgetting .value when reading a computed in script.',
      why: 'A computed returns a ref; the template auto-unwraps but script does not.',
      fix: 'Use computedRef.value in script; bare name only in templates.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Filtered/sorted/paginated lists, formatted display strings, derived flags (isValid, canSubmit) are all computeds keeping templates declarative.' },
    { area: 'Pinia', detail: 'Store getters are computeds; they cache derived store state (e.g. cart total) and recompute only when underlying state changes.' },
    { area: 'Composables', detail: 'Composables expose computed values (e.g. useAuth returning a computed isLoggedIn) so consumers get cached, reactive derivations.' },
    { area: 'Component library', detail: 'Derived ARIA attributes, classes, and layout calculations are computeds so they update reactively without manual wiring.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Caching avoids recomputing expensive derivations on every render or repeated read.',
      'Chained computeds recompute only the affected links when a single dependency changes.',
    ],
    bad: [
      'A getter that does heavy work and is read very frequently with frequently-changing deps recomputes often — caching does not help if deps change every tick.',
      'Creating computeds that depend on huge reactive structures adds tracking overhead.',
    ],
    optimizations: [
      'Split large computeds so a change invalidates only the relevant part.',
      'Keep getters cheap and pure; move heavy async work to watch.',
      'Avoid depending on broad objects when a narrow key suffices.',
      'Use shallow reactivity for big inputs the computed reads to limit tracking cost.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactive', 'reactivity-fundamentals'],
    nextConcepts: ['watch', 'watcheffect', 'computed-caching', 'reactivity-render-link'],
    dependencyNote:
      'computed builds on ref/reactive and the reactivity-fundamentals (track/trigger). It pairs with watch/watchEffect (value vs side-effect), is explored deeper in computed-caching, and connects to the reactivity-render-link since renders consume computed values.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write const total = computed(() => sum(items.value)) and say "derived + cached".',
      'Draw the getter reading items → arrow "tracks items as dependency".',
      'Show a _dirty flag: false after compute, set to true when items changes.',
      'Show that recompute happens on the NEXT read, not immediately (lazy).',
      'Contrast with a method (runs every call) and watch (side effect) to nail the three-way distinction.',
    ],
    diagram: `   computed(getter)
     │ first read → run getter → cache _value, _dirty=false
     │ items change → scheduler sets _dirty=true (NO recompute)
     │ next read → _dirty? yes → recompute+cache ; no → return cache
     ▼
   vs method: runs EVERY call    vs watch: runs a SIDE EFFECT`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'computed creates a cached, reactive derived value from a getter. It tracks the reactive things it reads; when one changes it marks itself dirty and recomputes lazily on the next read, otherwise returning the cache. Use it for derived values (totals, filters, formatted strings); use methods for actions and watch for side effects. Getters must be pure. It returns a ref — bare in templates, .value in script. Optionally writable via { get, set } for v-model on derived state.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'computed creates a reactive value derived from other reactive state, and its defining feature is caching. You pass a getter function; computed runs it inside a lazy reactive effect that tracks every reactive value the getter reads. The result is cached, so reading the computed multiple times — even across many renders — does not re-run the getter as long as nothing it depends on changed. When a dependency does change, computed does not recompute immediately; its scheduler just flips an internal dirty flag and notifies anything that depends on the computed. The getter actually re-runs lazily, the next time someone reads the value, at which point it re-caches and clears the dirty flag. This laziness is why computed is more efficient than a method: a method runs every single time it is called and on every re-render that invokes it, with no caching. The clean rule I follow is: computed for derived values, methods for actions or imperative one-off work, and watch for side effects like API calls or logging when state changes. computed should be pure — no mutations, no side effects — because mutating inside a getter can cause infinite loops and undermines caching, and it should depend only on reactive sources, because reading a plain variable or Date.now() inside it produces a stale value that never updates. By default a computed is read-only, but you can make it writable by passing get and set, where the setter maps an assigned value back to the underlying state, which is handy for binding v-model to a derived value. In code a computed is a ref, so I read .value in script while templates auto-unwrap it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'computed vs watch: computed is synchronous, cached, and pure for derived values; watch is for asynchronous or side-effecting reactions. Forcing side effects into computed is an anti-pattern.',
      'Granularity: one big computed is simple but invalidates fully on any dependency change; splitting into smaller computeds improves cache hit rates at the cost of more wiring.',
    ],
    edgeCases: [
      'A computed that reads non-reactive state silently goes stale; reading another computed is fine and chains correctly.',
      'Writable computeds can create surprising loops if the setter writes a value the getter immediately re-derives differently.',
      'A computed not read by anything never recomputes (truly lazy) — useful but can surprise when debugging.',
      'Returning new object/array references from a getter means downstream === checks always differ, which can defeat memoization in children.',
    ],
    runtimeBehavior: [
      'Dirty flag flips synchronously on dependency trigger, but recompute is deferred to the next read.',
      'A computed is both a dependent (of its sources) and a dependency (of its consumers), forming a reactive DAG.',
      'computed integrates with the same scheduler, so consumer re-renders are batched per tick.',
    ],
    scalability: [
      'For large derived datasets, prefer incremental or chunked computeds and stable references to avoid invalidating big subtrees.',
      'In stores, getters (computeds) centralize derivation so many components share one cached result rather than each recomputing.',
    ],
    productionConcerns: [
      'Hidden expensive getters that recompute on hot deps are a real perf trap — profile with Vue Devtools.',
      'Stale computeds from non-reactive dependencies cause hard-to-spot UI bugs; keep inputs reactive.',
      'Returning fresh references each compute can cause unnecessary child re-renders downstream.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'computed = derived + CACHED reactive value.',
    'Recomputes lazily: dep change marks dirty, getter re-runs on next read.',
    'Returns a ref — .value in script, auto-unwrap in template.',
    'computed for derived values, method for actions, watch for side effects.',
    'Getter must be PURE (no mutations/side effects).',
    'Depend only on reactive sources or it goes stale.',
    'Writable via { get, set } → enables v-model on derived state.',
    'Chained computeds form a reactive dependency graph.',
    'Reading it multiple times = one compute (cache).',
    'Pinia getters and many composable outputs are computeds.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a computed doubled that is twice a count ref.',
      hint: 'Read count.value inside the getter.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nconst count = ref(2)\nconst doubled = computed(() => count.value * 2)\n// doubled.value === 4; changing count updates it',
        explanation: [
          'The getter reads count.value, making doubled depend on count.',
          'doubled caches until count changes, then recomputes on next read.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a writable computed fullName backed by first and last refs, usable with v-model.',
      hint: 'Pass { get, set }.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\nconst fullName = computed({\n  get: () => first.value + \' \' + last.value,\n  set(v) { const [f, l = \'\'] = v.split(\' \'); first.value = f; last.value = l },\n})',
        explanation: [
          'The getter derives the combined name; the setter splits and writes back.',
          'A writable computed can be the target of v-model.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain and fix why this computed never updates: const now = computed(() => Date.now()).',
      hint: 'What does Vue actually track?',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\n// BROKEN: Date.now() is not reactive, so the getter has no deps and\n// the cached value never invalidates.\n// const now = computed(() => Date.now())\n\n// FIX: drive it from a reactive tick that you update.\nconst tick = ref(0)\nsetInterval(() => tick.value++, 1000)\nconst now = computed(() => { tick.value; return Date.now() })',
        explanation: [
          'computed only invalidates when a TRACKED reactive dependency changes.',
          'Date.now() is non-reactive, so the cache is never marked dirty.',
          'Introducing a reactive tick that the getter reads gives it a real dependency to invalidate on.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Given a list and a search ref, return a cached filtered list and explain why computed beats a template method here.',
      hint: 'Compare per-render cost.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nconst items = ref([/* many rows */])\nconst search = ref(\'\')\nconst filtered = computed(() =>\n  items.value.filter(i => i.name.includes(search.value)),\n)\n// computed: filters once per change to items/search, cached across reads.\n// A template method filterItems() would re-run the filter on EVERY\n// render and every place it is called — wasteful for large lists.',
        explanation: [
          'computed caches the filtered result and recomputes only when items or search change.',
          'A method runs the filter on each render invocation, with no caching.',
          'For large lists or frequent renders, the computed avoids redundant O(n) work.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'computed is the bread-and-butter of clean Vue components and a guaranteed interview topic. Explaining its caching/lazy model and the computed-vs-method-vs-watch trichotomy instantly shows you write idiomatic, performant Vue.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "computed vs method" and the definition. Product companies (Zoho, Flipkart, Razorpay) ask when it recomputes, writable computeds, and computed vs watch. FAANG-level interviews probe the lazy dirty-flag caching model and purity/loop pitfalls.',
    whatInterviewersExpect:
      'A precise "derived + cached + lazy" definition, the dirty-flag recompute model, the three-way distinction with methods and watch, awareness of purity and non-reactive-dependency staleness, and writable computeds for v-model.',
  },
}

export default computed
