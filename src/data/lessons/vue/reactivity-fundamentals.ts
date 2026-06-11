import type { ConceptLesson } from '../../../types/lesson'

const reactivityFundamentals: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactivity-fundamentals',
  name: 'Reactivity Fundamentals',
  category: 'reactivity',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Reactivity is the heart of Vue — it is the system that makes the DOM update automatically when state changes.',
    'Almost every other Vue concept (ref, reactive, computed, watch, rendering) is built directly on these fundamentals.',
    'It is a top interview topic: explaining track/trigger and the effect model separates memorizers from people who understand Vue.',
    'Misunderstanding reactivity causes the most common Vue bugs — lost reactivity from destructuring, stale values, missing updates.',
    'Knowing the dependency-tracking model lets you reason about performance: what re-renders, when, and why.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Reactivity is like a spreadsheet: change one number and every cell that used it updates by itself.',
    story: [
      'Imagine a spreadsheet. In cell A1 you write 5. In cell B1 you write "= A1 times 2", so it shows 10.',
      'Now you change A1 to 7. You do not touch B1 — but it instantly changes to 14 all on its own.',
      'How? The spreadsheet remembered that B1 was watching A1, so when A1 changed, it told B1 to recalculate.',
      'Vue works the same way. Your screen is like B1; it remembers which data it watches, and when that data changes, Vue updates the screen automatically.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Reactivity means that when a piece of data changes, everything that depends on it updates automatically.',
    'In Vue, when your template reads a piece of state, Vue secretly notes "this view depends on that data".',
    'Later, when you change the data, Vue looks up everything that depended on it and re-runs only those parts.',
    'You never write "now update the screen" — Vue tracks the connections and does it for you, like a spreadsheet recalculating.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Reactivity is Vue\'s system for automatically tracking dependencies between state and the code that uses it (effects), so that when state changes, the dependent effects — including component renders, computed values, and watchers — re-run automatically.',
    how: 'You create reactive state with ref or reactive. When an effect (like a render function or computed) reads that state, Vue "tracks" the dependency. When you mutate the state, Vue "triggers" all effects that read it to re-run. This track/trigger pair, built on Proxies, is the whole engine.',
    why: 'It removes manual UI synchronization: you change data, the right things update. It is the foundation that makes declarative rendering, computed caching, and watchers possible.',
    code: {
      label: 'Reactivity in action',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\n\nconst price = ref(100)\nconst qty = ref(2)\nconst total = computed(() => price.value * qty.value)\n// changing price re-runs total AND re-renders the template\n</script>\n\n<template>\n  <p>Total: {{ total }}</p>\n  <button @click="qty++">Add one</button>\n</template>',
      explanation: [
        'price and qty are reactive state; reading them inside computed tracks them.',
        'total is an effect depending on price and qty — it re-runs when either changes.',
        'The template reads total, so it also depends on it and re-renders.',
        'Clicking changes qty → total recomputes → template updates, all automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Reactivity in Vue 3 is a dependency-tracking system built on ES Proxies. Reactive state (ref/reactive) is wrapped so that property reads are intercepted to "track" the currently-running effect as a dependency, and writes are intercepted to "trigger" re-execution of all effects that depend on that property. An effect is any tracked function — a component render, a computed getter, or a watcher callback. Vue maintains a dependency map (target → key → set of effects); track adds the active effect to the set on read, trigger re-runs the set on write. Updates are batched and flushed asynchronously via a scheduler.',

  // 7. Internal Working
  internalWorking: [
    'reactive(obj) returns a Proxy whose get trap calls track(target, key) and whose set/delete traps call trigger(target, key).',
    'When an effect runs (e.g. a component render), Vue sets it as the "active effect" so any reactive read during that run can record the dependency.',
    'track(target, key) looks up (or creates) the dependency set for that target+key in a global WeakMap and adds the active effect to it.',
    'On a write, trigger(target, key) retrieves that dependency set and schedules each effect to re-run.',
    'The scheduler queues effects and flushes them asynchronously in a microtask, deduping and ordering them (e.g. parent before child) so the DOM updates once per tick.',
    'ref wraps a single value in an object with a reactive .value accessor (using the same track/trigger), which is why primitives need .value.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   READ (track)                         WRITE (trigger)
   ─────────────                        ───────────────
   effect runs ──► reads price.value    price.value = 120
        │              │                      │
        │ active       │ get trap             │ set trap
        ▼              ▼                       ▼
   depsMap: { price -> { effect } }      look up depsMap[price]
                                          re-run each effect (scheduler)
                                                │
                                                ▼
                                       computed recomputes,
                                       component re-renders`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A global WeakMap (targetMap) keys each reactive object to a Map of its keys; WeakMap lets unreferenced reactive objects be garbage-collected.',
    'Each key maps to a Set of effects (the "dep") that read it; this is the dependency graph living on the heap.',
    'The active effect is held on a stack during execution so nested effects track correctly; reads while it is active add to deps.',
    'When an object becomes unreachable, its entry in the WeakMap can be collected, and effects that are stopped/unmounted are removed from dep sets to avoid leaks.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — ref drives the view',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <button @click="count++">{{ count }}</button>\n</template>',
      explanation: [
        'count is reactive; the template reads it, creating a dependency.',
        'Clicking mutates count, which triggers the render effect.',
        'The button text updates automatically — no manual DOM code.',
      ],
    },
    intermediate: {
      label: 'Intermediate — watchEffect auto-tracks dependencies',
      lang: 'js',
      code: 'import { ref, watchEffect } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\n\nwatchEffect(() => {\n  // reads first + last → both are tracked as dependencies\n  console.log(`${first.value} ${last.value}`)\n})\nfirst.value = \'Grace\' // re-runs the effect automatically',
      explanation: [
        'watchEffect runs the function immediately and tracks every reactive value read.',
        'first and last become dependencies because they are read inside.',
        'Changing either triggers a re-run — no explicit dependency list needed.',
        'This is the raw track/trigger model exposed directly to you.',
      ],
    },
    advanced: {
      label: 'Advanced — using the reactivity engine standalone',
      lang: 'js',
      code: 'import { reactive, effect } from \'@vue/reactivity\'\n\nconst state = reactive({ n: 1 })\nlet doubled = 0\n\neffect(() => {\n  doubled = state.n * 2   // reading state.n registers this effect\n})\nconsole.log(doubled) // 2\nstate.n = 5            // triggers the effect to re-run\nconsole.log(doubled) // 10',
      explanation: [
        '@vue/reactivity is framework-agnostic; effect() is the primitive behind rendering.',
        'Reading state.n inside the effect tracks it as a dependency.',
        'Assigning state.n triggers the effect, recomputing doubled.',
        'This shows reactivity is independent of components — the same engine powers all of Vue.',
      ],
    },
    realProject: {
      label: 'Real project — derived cart totals stay in sync',
      lang: 'vue',
      code: '<script setup>\nimport { reactive, computed } from \'vue\'\nconst cart = reactive({ items: [{ price: 10, qty: 2 }, { price: 5, qty: 1 }] })\nconst subtotal = computed(() =>\n  cart.items.reduce((s, i) => s + i.price * i.qty, 0)\n)\nconst tax = computed(() => subtotal.value * 0.18)\nconst grandTotal = computed(() => subtotal.value + tax.value)\nfunction addQty(i) { cart.items[i].qty++ }\n</script>\n\n<template>\n  <p>Total: {{ grandTotal }}</p>\n</template>',
      explanation: [
        'A chain of computed values derives subtotal → tax → grandTotal.',
        'Each computed tracks exactly what it reads and caches until those change.',
        'Mutating an item\'s qty triggers the chain to recompute and the view to update.',
        'This dependency graph is the everyday payoff of Vue reactivity.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is reactivity in Vue?',
      answer: 'It is the system that automatically updates anything depending on a piece of state when that state changes — the view, computed values, and watchers all re-run without manual wiring.',
      explanation: 'Use the spreadsheet analogy and mention "depends on → auto re-run".',
    },
    {
      level: 'beginner',
      question: 'What is an effect in Vue\'s reactivity?',
      answer: 'An effect is a function whose dependencies are tracked — when the reactive state it reads changes, the effect re-runs. Component renders, computed getters, and watchers are all effects.',
      explanation: 'Defining "effect" precisely is foundational for everything else.',
    },
    {
      level: 'intermediate',
      question: 'Explain track and trigger.',
      answer: 'Track happens on a reactive read: the currently-running effect is recorded as a dependency of that property in a dependency map. Trigger happens on a write: Vue looks up all effects that depend on that property and schedules them to re-run. Together they form the reactivity loop.',
      explanation: 'Naming the read-tracks / write-triggers pair and the dependency map is the core intermediate answer.',
    },
    {
      level: 'intermediate',
      question: 'Why does Vue 3 reactivity use Proxy, and what did it improve?',
      answer: 'Proxy intercepts all operations on an object (get, set, has, delete), so Vue can track any property access and trigger on any mutation — including newly added properties, deletions, and array index/length changes that Vue 2\'s Object.defineProperty could not detect.',
      explanation: 'Connect Proxy to removing the Vue 2 caveats.',
    },
    {
      level: 'advanced',
      question: 'How are reactive updates batched, and why does the DOM not update synchronously?',
      answer: 'Triggered effects are queued in a scheduler and flushed asynchronously in a microtask, deduplicated and ordered (parent before child). This avoids redundant re-renders when you make several state changes in one tick; the DOM reflects the final state after nextTick.',
      explanation: 'The scheduler/microtask batching plus nextTick is the advanced expectation.',
    },
    {
      level: 'senior',
      question: 'What causes lost reactivity, and how do you reason about it?',
      answer: 'Reactivity tracks property access on the Proxy. Destructuring a reactive object copies the current values, breaking the link; passing a primitive loses tracking; replacing a whole ref instead of .value, or using a non-reactive plain object, also breaks it. Fix with toRefs/toRef, keep working with the reactive source, and use refs for primitives. The mental model: reactivity follows reads through the Proxy, not detached values.',
      explanation: 'Articulating the "tracking follows Proxy reads" rule and the destructuring pitfall is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between ref and reactive?',
    'Why do refs need .value but reactive objects do not?',
    'What is a computed and how does it cache via reactivity?',
    'How is watch different from watchEffect in terms of dependency tracking?',
    'What is shallowReactive and when would you use it?',
    'Why does destructuring a reactive object lose reactivity?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Destructuring a reactive() object and expecting the pieces to stay reactive.',
      why: 'Destructuring reads the current values and detaches them from the Proxy, so changes are no longer tracked.',
      fix: 'Use toRefs(state) to keep destructured properties reactive, or keep using state.x directly.',
    },
    {
      mistake: 'Forgetting .value on a ref in script (reading/writing it as if it were the value).',
      why: 'A ref is an object with a reactive .value; using the ref directly does not read the value.',
      fix: 'Use myRef.value in <script>; templates auto-unwrap top-level refs.',
    },
    {
      mistake: 'Mutating a plain (non-reactive) object and expecting the view to update.',
      why: 'Only state created via ref/reactive is tracked; plain objects are not.',
      fix: 'Wrap state in ref/reactive so reads/writes go through the tracking Proxy.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every component render is a reactive effect; computed and watch power derived state and side effects throughout apps.' },
    { area: 'Pinia', detail: 'Pinia stores are built on the reactivity system; state is reactive and getters are computed.' },
    { area: 'Composables', detail: 'Composables return refs/reactive objects so consuming components reactively track shared logic.' },
    { area: 'Component library', detail: '@vue/reactivity is used standalone for reactive logic outside components (e.g. animation, state engines).' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Fine-grained tracking means only effects that actually read changed state re-run.',
      'Async batching dedupes multiple mutations into a single flush per tick.',
    ],
    bad: [
      'Deeply reactive large objects incur proxy/tracking overhead on every nested access.',
      'Over-broad dependencies (reading a whole big object in an effect) cause unnecessary re-runs.',
    ],
    optimizations: [
      'Use shallowRef/shallowReactive and markRaw for large or immutable data.',
      'Prefer computed (cached) over watchers that recompute manually.',
      'Read only the specific properties an effect needs to narrow its dependencies.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue', 'declarative-rendering'],
    nextConcepts: ['ref', 'reactive', 'proxy-reactivity', 'computed', 'watch'],
    dependencyNote:
      'Reactivity fundamentals are the spine of the entire reactivity track. They build on what Vue is and declarative rendering, and lead directly into ref, reactive, the Proxy mechanism, computed, and watch.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write "state" on the left and "effect (render/computed/watch)" on the right.',
      'Draw a read arrow from effect to state labelled "track → record dependency".',
      'Draw a write arrow on state labelled "trigger → re-run dependents".',
      'Sketch the depsMap: state-key → set of effects.',
      'Say: "Reads track, writes trigger; that loop, built on Proxies and a scheduler, is all of Vue reactivity."',
    ],
    diagram: `  effect ──read──► state   (track: add effect to dep)
                    │
              write state
                    │ trigger: re-run effects in dep
                    ▼
            depsMap: state.key -> { effectA, effectB }`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Reactivity is Vue\'s system that auto-updates everything depending on state when state changes. State (ref/reactive) is wrapped in Proxies: reading a property tracks the currently-running effect as a dependency; writing triggers all dependent effects to re-run. Effects include component renders, computed getters, and watchers. Vue keeps a depsMap (target → key → set of effects) and a scheduler that batches re-runs asynchronously. Common bug: destructuring a reactive object breaks tracking — use toRefs. This track/trigger loop underlies declarative rendering, computed, and watch.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Reactivity is the core engine of Vue — it is what makes the DOM and derived values update automatically when state changes. The cleanest analogy is a spreadsheet: a cell with a formula recalculates by itself when a cell it references changes, because the spreadsheet remembers the dependency. Vue does the same with code. You create reactive state using ref or reactive. Under the hood, reactive wraps an object in a Proxy. The Proxy intercepts reads and writes. When some function — Vue calls it an effect — runs and reads a reactive property, Vue records that this effect depends on that property; that is called track. When you later write to that property, Vue looks up all the effects that depend on it and re-runs them; that is called trigger. An effect can be a component\'s render function, a computed getter, or a watcher, so all three stay in sync through the same mechanism. Internally, Vue maintains a dependency map — a WeakMap from each reactive object to a map of its keys to a set of effects — and the active effect is recorded while it runs so reads attach to the right place. Crucially, triggered effects are not run immediately and synchronously; they are queued in a scheduler and flushed asynchronously in a microtask, deduplicated and ordered parent before child, so multiple state changes in one tick produce a single re-render, and the DOM reflects the final state after nextTick. Vue 3 uses Proxy specifically because it can intercept every operation — including added properties, deletions, and array index changes — which fixes the Vue 2 limitations. The most common reactivity bug is losing tracking by destructuring a reactive object, which detaches the values from the Proxy; the fix is toRefs, or keep working with the reactive source. Once you internalize "reads track, writes trigger", every other reactivity feature follows.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Deep reactivity is ergonomic but costs proxy creation and per-access tracking; shallow variants trade convenience for speed.',
      'Async batching improves performance but means you must use nextTick to read post-update DOM, a common source of confusion.',
    ],
    edgeCases: [
      'Destructuring/spreading reactive objects detaches reactivity; toRefs/toRef are required.',
      'Collections (Map/Set) use special reactive handlers; raw mutation methods must go through the reactive proxy.',
      'Reading reactive state outside any effect does not track anything (e.g. in plain module code).',
    ],
    runtimeBehavior: [
      'Reactivity is lazy: nested objects are proxied on first access, not eagerly.',
      'The scheduler dedupes effects and flushes in a microtask; computed are lazy and only recompute when read after invalidation.',
      'Effects clean up their old dependencies on each run, so conditional reads correctly drop stale deps.',
    ],
    scalability: [
      'For very large/immutable datasets use shallowReactive/markRaw to avoid deep tracking overhead.',
      'Splitting components scopes render effects so a change re-renders only the relevant subtree.',
    ],
    productionConcerns: [
      'Profile for over-tracking: effects reading whole large objects re-run too often.',
      'Ensure watchers/effects in composables are stopped on unmount to avoid leaks.',
      'Be deliberate about deep vs shallow reactivity for performance-sensitive state.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Reactivity = auto re-run of dependents when state changes.',
    'Effect = tracked function (render, computed, watcher).',
    'Read → track (record dependency); Write → trigger (re-run).',
    'Built on Proxy (Vue 3) intercepting get/set/delete.',
    'depsMap: WeakMap(target → Map(key → Set(effects))).',
    'Updates are batched + flushed async (microtask) → use nextTick for DOM.',
    'ref wraps a value with reactive .value; reactive proxies objects.',
    'Destructuring reactive() loses reactivity → use toRefs.',
    'computed is cached; recomputes only when deps change.',
    'shallowRef/shallowReactive/markRaw reduce tracking overhead.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create reactive count state and a computed that doubles it.',
      hint: 'ref + computed.',
      solution: {
        lang: 'js',
        code: 'import { ref, computed } from \'vue\'\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\ncount.value = 4 // double becomes 8 on next read',
        explanation: ['count is reactive; computed tracks it.', 'Changing count invalidates double, which recomputes when read.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Use watchEffect to log a full name and demonstrate auto-tracking.',
      hint: 'Read both refs inside the effect.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst first = ref(\'A\'), last = ref(\'B\')\nwatchEffect(() => console.log(first.value, last.value))\nlast.value = \'C\' // effect re-runs automatically',
        explanation: ['watchEffect runs immediately and tracks first + last.', 'Changing either triggers a re-run with no dependency list.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show the lost-reactivity bug from destructuring reactive() and fix it with toRefs.',
      hint: 'Destructure breaks tracking; toRefs preserves it.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs, watchEffect } from \'vue\'\nconst state = reactive({ n: 1 })\n\n// BUG: n is a detached primitive, not reactive\nlet { n } = state\nwatchEffect(() => console.log(n)) // never re-runs on state.n change\n\n// FIX: keep refs\nconst { n: nRef } = toRefs(state)\nwatchEffect(() => console.log(nRef.value)) // re-runs correctly',
        explanation: ['Destructuring copies the value, detaching it from the Proxy.', 'toRefs converts each property to a ref, preserving the reactive link.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain track/trigger by implementing a tiny reactive effect using the public API and narrate it.',
      hint: 'Use @vue/reactivity effect + reactive.',
      solution: {
        lang: 'js',
        code: 'import { reactive, effect } from \'@vue/reactivity\'\nconst state = reactive({ price: 10 })\nlet total = 0\neffect(() => { total = state.price * 3 }) // reading state.price TRACKS this effect\n// state.price changed → TRIGGER → effect re-runs\nstate.price = 20\nconsole.log(total) // 60',
        explanation: [
          'Inside effect, reading state.price tracks the effect as a dependency.',
          'Writing state.price triggers the dependent effect to re-run.',
          'This is exactly the loop that drives every render, computed, and watcher.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Reactivity is the must-know foundation of Vue. If you can clearly explain track/trigger, effects, and async batching, every other reactivity question (ref, reactive, computed, watch) becomes straightforward.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is reactivity / how does Vue update the DOM". Product companies (Zoho, Flipkart, Razorpay) probe track/trigger and lost-reactivity bugs. FAANG-level interviews go into the dependency map, scheduler/batching, and Proxy internals.',
    whatInterviewersExpect:
      'They expect the dependency-tracking model (reads track, writes trigger), the effect concept, Proxy basis, async batching with nextTick, and awareness of the destructuring pitfall.',
  },
}

export default reactivityFundamentals
