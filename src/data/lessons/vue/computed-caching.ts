import type { ConceptLesson } from '../../../types/lesson'

const computedCaching: ConceptLesson = {
  // 1. Concept Summary
  slug: 'computed-caching',
  name: 'Computed Caching',
  category: 'performance',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Computed caching is the single most common performance win in Vue: derived values are recalculated only when their reactive dependencies actually change, not on every render.',
    'It is why you should prefer computed over methods for derived state — a method runs every render, a computed reuses its cached result.',
    'Understanding the cache invalidation rules (the "dirty" flag) explains subtle bugs where a computed seems "stale" or recomputes "too often".',
    'It is one of the most frequently asked Vue interview topics because it tests whether you understand reactivity tracking, not just syntax.',
    'Misusing it — side effects in computeds, depending on non-reactive values — causes hard-to-debug stale data in production.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A computed is like a smart calculator that remembers its last answer and only recalculates when the numbers you typed actually change.',
    story: [
      'Imagine you have a calculator that adds up your weekly allowance. You type the numbers once and it shows the total.',
      'If a friend asks "what is your total?" five times, a dumb calculator would add everything up again every single time — slow and pointless.',
      'A smart calculator just remembers the answer it already worked out and shows it instantly. It only does the math again if you change one of the numbers.',
      'Vue\'s computed is that smart calculator. It saves its answer and hands it back instantly, only recalculating when the data it depends on really changes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A computed property is a value that Vue works out from other reactive values (its dependencies).',
    'The clever part is caching: Vue stores the last result and gives it back instantly whenever you read the computed again, as long as none of its dependencies have changed.',
    'Only when a dependency changes does Vue mark the computed as "dirty" and recalculate it the next time you read it.',
    'This makes computeds far cheaper than methods, which re-run their work on every single re-render regardless of whether anything changed.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A computed property is a reactive value derived from other reactive state that caches its result and only recomputes when one of its tracked dependencies changes.',
    how: 'Vue runs your getter once, tracking which reactive values it reads as dependencies. It stores the result and a "dirty" flag. Reading the computed returns the cached value; when a dependency changes, Vue flips the dirty flag so the next read recomputes and re-caches.',
    why: 'It avoids redundant work: expensive derivations (filtering, sorting, formatting) run only when their inputs change, not on every render or every access.',
    code: {
      label: 'Cached vs recomputed',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst price = ref(100)\nconst qty = ref(2)\n\n// cached: recomputes only when price or qty changes\nconst total = computed(() => {\n  console.log(\'computing total\')\n  return price.value * qty.value\n})\n\nconsole.log(total.value) // logs "computing total", 200\nconsole.log(total.value) // 200 (no log — cached)\nqty.value = 3\nconsole.log(total.value) // logs "computing total", 300\n</script>',
      explanation: [
        'The getter reads price.value and qty.value, so those become its dependencies.',
        'The first read computes and caches 200.',
        'The second read returns the cached 200 without re-running the getter — note no second log.',
        'Changing qty marks the computed dirty, so the next read recomputes to 300.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A computed property is a reactive ref backed by a lazily-evaluated, cached effect. When its getter first runs, Vue records every reactive dependency accessed during evaluation and stores the result alongside a dirty flag. Subsequent reads return the cached value without re-running the getter while the computed is clean. When any tracked dependency triggers, the computed\'s effect is notified and its dirty flag is set, so the next read re-evaluates the getter and refreshes the cache. The computed itself is a dependency for any effect (render, watcher) that reads it, so dependents re-run only when the computed\'s value actually changes.',

  // 7. Internal Working
  internalWorking: [
    'computed() creates a ComputedRefImpl that wraps the getter in a reactive effect with lazy evaluation (it does not run immediately).',
    'On the first access of `.value`, the effect runs the getter; during this run, Vue\'s dependency tracking (the active effect + track()) records each reactive property read as a dependency.',
    'The returned result is stored in an internal `_value`, and a `_dirty` (or version) flag is set to false, meaning the cache is valid.',
    'When any tracked dependency is mutated, its trigger() notifies the computed\'s effect, which does NOT recompute eagerly — instead it sets `_dirty = true` and triggers the computed\'s own dependents.',
    'The next time `.value` is read while dirty, the getter re-runs, dependencies are re-tracked, the new result replaces `_value`, and `_dirty` returns to false.',
    'Because the computed is itself a reactive ref, effects that read it (the render function, watchers) subscribe to it and re-run only when the recomputed value differs, propagating the change minimally.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   price ───┐
            ├──► computed total (getter)
   qty   ───┘          │
                       ▼
              ┌──────────────────┐
              │ _value = 200     │  ◄── cached
              │ _dirty = false   │
              └──────────────────┘
                       │ read .value
            dirty? ─────┴─────► return _value (no recompute)

   qty changes ──► trigger ──► _dirty = true
                       │
            next read .value ──► run getter ──► _value = 300, _dirty = false`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The ComputedRefImpl holds `_value` (the cached result) and a dirty flag on the heap for the lifetime of the component scope.',
    'It maintains a dependency set linking it to each reactive source it read, and a subscriber set linking it to effects that read it.',
    'While clean, reading the computed touches only `_value` — no new allocation, no getter execution.',
    'When the owning component unmounts, the computed effect is stopped and its dependency links are cleaned up so it can be garbage collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — derived full name',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\nconst fullName = computed(() => `${first.value} ${last.value}`)\n</script>\n\n<template>\n  <p>{{ fullName }}</p>\n  <input v-model="first" />\n</template>',
      explanation: [
        'fullName depends on first and last.',
        'It is cached until either ref changes, so reading it many times in the template is cheap.',
        'Typing in the input updates first, marking fullName dirty and recomputing on the next render.',
        'Compared to a method, this avoids re-concatenating on unrelated re-renders.',
      ],
    },
    intermediate: {
      label: 'Intermediate — computed vs method',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst items = ref([1, 2, 3, 4, 5, 6])\nconst tick = ref(0)\n\n// computed: recomputes only when items changes\nconst evens = computed(() => items.value.filter(n => n % 2 === 0))\n\n// method: runs on EVERY render, even when only tick changed\nfunction evensMethod() { return items.value.filter(n => n % 2 === 0) }\n</script>\n\n<template>\n  <button @click="tick++">tick {{ tick }}</button>\n  <p>computed: {{ evens.length }}</p>\n  <p>method: {{ evensMethod().length }}</p>\n</template>',
      explanation: [
        'Clicking the button changes tick and re-renders the component.',
        'evens (computed) does NOT recompute because items did not change — it returns its cache.',
        'evensMethod() re-runs the filter on every render because methods are not cached.',
        'For expensive derivations this is a real, measurable difference — prefer computed for derived display values.',
      ],
    },
    advanced: {
      label: 'Advanced — writable computed and dependency chains',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst celsius = ref(25)\n\n// writable computed: get caches, set updates the source\nconst fahrenheit = computed({\n  get: () => celsius.value * 9 / 5 + 32,\n  set: (f: number) => { celsius.value = (f - 32) * 5 / 9 },\n})\n\n// chained computed depends on another computed (also cached)\nconst label = computed(() => `${fahrenheit.value.toFixed(1)}F`)\n</script>\n\n<template>\n  <input :value="fahrenheit" @input="e => fahrenheit = +(e.target as HTMLInputElement).value" />\n  <p>{{ label }}</p>\n</template>',
      explanation: [
        'The getter is cached and depends on celsius; the setter writes back to celsius.',
        'label depends on fahrenheit (a computed), forming a cached chain — label recomputes only when fahrenheit changes.',
        'Reading label twice returns the cache; changing celsius invalidates fahrenheit, which invalidates label.',
        'Writable computeds keep two-way derived state (like unit conversion) consistent and cached.',
      ],
    },
    realProject: {
      label: 'Real project — filtered/sorted product list in an e-commerce app',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\ninterface Product { id: number; name: string; price: number; inStock: boolean }\nconst products = ref<Product[]>([])\nconst search = ref(\'\')\nconst onlyInStock = ref(false)\nconst sortBy = ref<\'price\' | \'name\'>(\'price\')\n\nconst visible = computed(() => {\n  let list = products.value\n  if (search.value) list = list.filter(p => p.name.toLowerCase().includes(search.value.toLowerCase()))\n  if (onlyInStock.value) list = list.filter(p => p.inStock)\n  return [...list].sort((a, b) =>\n    sortBy.value === \'price\' ? a.price - b.price : a.name.localeCompare(b.name)\n  )\n})\n</script>\n\n<template>\n  <input v-model="search" placeholder="Search" />\n  <label><input type="checkbox" v-model="onlyInStock" /> In stock</label>\n  <ul><li v-for="p in visible" :key="p.id">{{ p.name }} - {{ p.price }}</li></ul>\n</template>',
      explanation: [
        'The expensive filter+sort runs only when products, search, onlyInStock, or sortBy change.',
        'Unrelated re-renders (e.g. a modal opening elsewhere) reuse the cached, already-sorted list.',
        'The template reads `visible` once per render and gets the cache, so scrolling/hovering does not re-sort.',
        'This is the textbook production use of computed caching: derive expensive view state once and reuse it.',
        'Note the [...list] copy before sort — never mutate the source array inside a computed.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a computed property and a method in Vue?',
      answer: 'A computed is cached based on its reactive dependencies and only recomputes when one of them changes; a method runs every time it is called, including on every re-render. For derived display values, computed is more efficient.',
      explanation: 'The expected key word is "caching" — methods have no cache, computeds do.',
    },
    {
      level: 'beginner',
      question: 'When does a computed property recompute?',
      answer: 'Only when one of the reactive dependencies it read during its last evaluation changes. Reading the computed when nothing changed returns the cached value without re-running the getter.',
      explanation: 'A strong answer ties recomputation to dependency tracking, not to access frequency.',
    },
    {
      level: 'intermediate',
      question: 'Why might a computed property never update even though related data changed?',
      answer: 'Because it does not actually depend on that data — either the value is non-reactive (a plain variable, a destructured ref losing reactivity, or a value read outside tracking) or the dependency was not accessed during the getter run. Vue only tracks reactive reads inside the getter.',
      explanation: 'This tests understanding that caching is driven by what the getter reads reactively.',
    },
    {
      level: 'intermediate',
      question: 'Can a computed have side effects, and should it?',
      answer: 'It technically can, but it should not. A computed getter should be pure — given the same dependencies it returns the same value with no mutations, fetches, or DOM changes. Side effects make caching unpredictable; use watch/watchEffect for effects.',
      explanation: 'Purity is what makes caching safe; senior candidates explain why side effects break the model.',
    },
    {
      level: 'advanced',
      question: 'Is a computed evaluated eagerly or lazily, and how does that interact with the dirty flag?',
      answer: 'Lazily. The getter does not run until `.value` is first read. When a dependency changes, Vue does not recompute immediately; it sets a dirty flag and notifies dependents. The getter only re-runs on the next read while dirty, so unread computeds never recompute.',
      explanation: 'Lazy evaluation plus the dirty flag is the precise mechanism — it explains why an off-screen computed costs nothing.',
    },
    {
      level: 'senior',
      question: 'How does a computed avoid triggering downstream re-renders when its value did not actually change?',
      answer: 'A computed is itself a reactive ref. When recomputed, Vue compares the new value to the previous one; dependents are triggered only if it changed. So even if a dependency changes, if the computed result is identical, downstream effects/renders can be skipped — minimizing propagation.',
      explanation: 'Senior signal: knowing the computed acts as a memoization barrier in the dependency graph, not just a per-component cache.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you make a computed writable (get/set)?',
    'What happens if you mutate state inside a computed getter?',
    'Why does destructuring a reactive object break computed dependency tracking?',
    'Can a computed depend on another computed? (yes — cached chains)',
    'How is computed caching different from v-memo and v-once?',
    'When would you prefer a method or a watcher over a computed?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting side effects (fetch, mutation, DOM writes) inside a computed getter.',
      why: 'Caching means the getter may not run when you expect, so side effects fire unpredictably or get skipped.',
      fix: 'Keep getters pure; move side effects to watch or watchEffect.',
    },
    {
      mistake: 'Using a method for derived state that is read many times per render.',
      why: 'Methods re-run on every render and every access, recomputing identical work and hurting performance.',
      fix: 'Use a computed so the result is cached until its dependencies change.',
    },
    {
      mistake: 'Reading non-reactive values in the getter and expecting updates.',
      why: 'Vue only tracks reactive reads; a plain variable or a lost-reactivity destructure is never a dependency, so the cache never invalidates.',
      fix: 'Depend on refs/reactive properties (or toRefs) so the read is tracked.',
    },
    {
      mistake: 'Mutating the source array/object inside the computed (e.g. .sort() in place).',
      why: 'It mutates the dependency you are reading, risking infinite loops and corrupting source data.',
      fix: 'Copy first (e.g. [...arr].sort()) and return a new value without touching the source.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'computed() is the core API for derived reactive state; the framework caches via the ComputedRefImpl dirty/version mechanism.' },
    { area: 'Pinia', detail: 'Store getters are computed properties under the hood — derived store state cached until the underlying state changes, shared across all components reading it.' },
    { area: 'Component library', detail: 'Derived display values (formatted labels, aria attributes, class maps) use computeds so they recalc only on relevant prop/state changes.' },
    { area: 'SSR', detail: 'During server render computeds evaluate once; on the client they re-track and cache after hydration, avoiding repeated derivation work.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Expensive derivations (filter/sort/format) run only when inputs change, not on every render.',
      'Repeated reads of the same computed in a template are O(1) cache hits.',
    ],
    bad: [
      'A computed that depends on a constantly-changing value recomputes constantly — no benefit over a method.',
      'Very large computed chains can make dependency invalidation harder to reason about and debug.',
    ],
    optimizations: [
      'Prefer computed over methods for any derived value used in the template.',
      'Split a big computed into smaller composable computeds so changing one input does not invalidate everything.',
      'Ensure getters are pure and depend only on the minimal reactive inputs needed.',
      'For per-row list derivations, combine with v-memo so unchanged rows skip patching too.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'computed', 'ref', 'reactive'],
    nextConcepts: ['watch', 'watch-vs-watcheffect', 'v-once-v-memo', 'reactivity-performance'],
    dependencyNote:
      'Computed caching builds directly on reactivity-fundamentals and the computed API: you need to understand dependency tracking before you can reason about when the cache invalidates. It contrasts with watch (side effects) and complements v-memo (render-level memoization).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two refs (price, qty) feeding into a computed box labeled "total".',
      'Inside the box draw _value and a _dirty flag.',
      'Show reading .value: if not dirty, return _value (draw a fast arrow, no getter run).',
      'Change qty: draw a trigger arrow flipping _dirty to true.',
      'Show the next read re-running the getter, refreshing _value, and clearing _dirty. Conclude: "cached until a dependency changes, recomputed lazily on next read."',
    ],
    diagram: `  price ─┐
         ├─► [ total: _value | _dirty ]
  qty  ─┘            │
        read .value ─┴─ clean? → return _value (fast)
        qty change ── trigger ─► _dirty = true
        next read ── run getter ─► refresh _value, _dirty=false`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A computed property derives a value from reactive state and caches the result. It tracks the dependencies its getter reads, stores the result with a dirty flag, and returns the cache on every read until a dependency changes. Only then does it mark itself dirty and lazily recompute on the next read. This beats a method, which re-runs on every render. Keep getters pure, depend only on reactive values, and never mutate the source inside the getter.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Computed caching is Vue\'s mechanism for efficiently deriving values from reactive state. When you create a computed, Vue wraps your getter in a lazily-evaluated reactive effect. The getter does not run until you first read the computed\'s value. On that first read, Vue tracks every reactive property the getter accesses as a dependency, stores the result in an internal cache, and marks the computed clean. Every subsequent read returns the cached value directly without re-running the getter, as long as none of the dependencies have changed. When a dependency is mutated, Vue does not recompute immediately — it just flips a dirty flag and notifies the computed\'s own dependents. The getter only re-runs on the next read while dirty, which means an unread computed costs nothing. This is why computed is preferred over a method for derived display values: a method re-runs on every render regardless, while a computed reuses its cache. Importantly, the computed is itself a reactive ref, so when it recomputes Vue compares the new value to the old one and only triggers downstream renders if it actually changed — it acts as a memoization barrier in the dependency graph. The rules to follow: keep getters pure with no side effects, depend only on reactive values so the cache invalidates correctly, and never mutate the source data inside the getter. Pinia store getters are built on this exact mechanism, sharing one cached derivation across every component that reads it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Caching saves CPU but adds bookkeeping (dependency + subscriber sets); for trivial derivations the overhead can exceed a simple inline expression.',
      'A computed acts as a memoization barrier that can suppress downstream renders, but only if it returns a referentially/structurally meaningful unchanged value.',
      'Splitting into many small computeds improves invalidation granularity but increases the number of effects to track.',
    ],
    edgeCases: [
      'Returning a new object/array each recompute defeats value-based change suppression downstream because the reference always differs.',
      'Reading a non-reactive or lost-reactivity value never registers as a dependency, so the cache silently never invalidates.',
      'A computed depending on a value that changes every tick recomputes every tick — no caching benefit.',
      'Side effects in a getter run on an unpredictable schedule due to lazy evaluation.',
    ],
    runtimeBehavior: [
      'computed is lazy: the getter runs on first access, not on creation.',
      'Dependency changes set a dirty flag and notify dependents without immediate recomputation.',
      'On recompute, Vue compares new vs old value and only triggers subscribers if it differs.',
    ],
    scalability: [
      'In large apps, shared Pinia getters compute once and serve many components, avoiding N duplicate derivations.',
      'Deep computed chains can create wide invalidation cascades; structure them so high-churn inputs touch the smallest possible subtree.',
    ],
    productionConcerns: [
      'Stale-data bugs almost always trace to a dependency not being tracked (non-reactive read or destructure).',
      'Accidental side effects in getters cause intermittent, hard-to-reproduce behavior.',
      'Profile heavy computeds; consider memoizing inputs or debouncing the source if it changes too frequently.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'computed = derived reactive value, cached on its dependencies.',
    'Recomputes only when a tracked dependency changes.',
    'Lazy: getter runs on first read, not on creation.',
    'Dirty flag set on dependency change; recompute on next read.',
    'Prefer computed over methods for derived display values.',
    'Getter must be PURE — no side effects.',
    'Only reactive reads are tracked as dependencies.',
    'Never mutate the source inside the getter (copy first).',
    'Writable computed: { get, set }.',
    'Computed is a reactive ref — suppresses downstream renders if value unchanged.',
    'Pinia getters are computeds under the hood.',
    'Chained computeds form cached dependency graphs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a computed `discounted` that returns price * 0.9, and verify it caches between reads when price is unchanged.',
      hint: 'computed(() => ...) and read .value twice.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst price = ref(200)\nconst discounted = computed(() => {\n  console.log(\'compute\')\n  return price.value * 0.9\n})\nconsole.log(discounted.value) // "compute", 180\nconsole.log(discounted.value) // 180 (cached, no log)\n</script>',
        explanation: [
          'discounted depends on price.',
          'The first read computes and caches 180.',
          'The second read returns the cache without re-running the getter.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Refactor a method `formatList()` that filters then joins names into a cached computed.',
      hint: 'Move the body into computed(() => ...).',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst users = ref([{ name: \'Ann\', active: true }, { name: \'Bo\', active: false }])\nconst activeNames = computed(() =>\n  users.value.filter(u => u.active).map(u => u.name).join(\', \')\n)\n</script>\n\n<template>\n  <p>{{ activeNames }}</p>\n</template>',
        explanation: [
          'The derivation now caches on users.',
          'Re-renders caused by unrelated state reuse the cached string.',
          'It only recomputes when users changes.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A computed `total` does not update when you push into items. Explain why and fix it without breaking caching.',
      hint: 'Think about what the getter actually reads and how Vue tracks arrays.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { reactive, computed } from \'vue\'\nconst state = reactive({ items: [1, 2, 3] })\n// total reads state.items.length and each element, so it IS tracked\nconst total = computed(() => state.items.reduce((a, b) => a + b, 0))\n// push triggers because reactive arrays track length/index access\nstate.items.push(4) // total recomputes to 10 on next read\n</script>',
        explanation: [
          'If items were a plain (non-reactive) array, the getter would never invalidate — that is the bug to avoid.',
          'Using reactive (or ref) makes array operations tracked, so push triggers recomputation.',
          'The getter stays pure and cached; only the reactive source change invalidates it.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a two-way writable computed `fullName` over `first` and `last` refs, where setting it splits on the space.',
      hint: 'Use computed({ get, set }).',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\nconst fullName = computed({\n  get: () => `${first.value} ${last.value}`,\n  set: (v: string) => {\n    const [f, ...rest] = v.split(\' \')\n    first.value = f\n    last.value = rest.join(\' \')\n  },\n})\nfullName.value = \'Grace Hopper\' // first=Grace, last=Hopper\n</script>',
        explanation: [
          'The getter is cached and depends on first and last.',
          'The setter writes back to the source refs, keeping the derivation consistent.',
          'Reading fullName returns the cache until first or last changes.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Computed caching is the most practical, everyday Vue optimization and a direct test of whether you understand reactivity. Getting it right keeps apps fast by default and shows you can reason about the dependency graph.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the classic "computed vs method" difference. Product companies (Zoho, Flipkart, Razorpay) probe when a computed goes stale and how to make it writable. FAANG-level interviews ask how caching interacts with the dirty flag, lazy evaluation, and downstream render suppression.',
    whatInterviewersExpect:
      'Define computeds as cached, dependency-tracked derivations; explain lazy evaluation and the dirty flag; contrast with methods; and name the rules — pure getters, reactive dependencies only, no source mutation — that keep caching correct.',
  },
}

export default computedCaching
