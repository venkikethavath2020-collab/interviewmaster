import type { ConceptLesson } from '../../../types/lesson'

const reactivityPerformance: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactivity-performance',
  name: 'Reactivity Performance',
  category: 'performance',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Vue\'s reactivity is cheap by default, but deep reactivity on large data structures can add real overhead — Proxy wrapping, dependency tracking, and trigger propagation all cost time and memory.',
    'Knowing when to reach for shallowRef, shallowReactive, markRaw, or computed memoization is what keeps data-heavy apps (grids, charts, editors) fast.',
    'It reveals whether you understand the track/trigger machinery rather than treating reactivity as magic.',
    'Subtle performance bugs — a watcher firing on every keystroke, a computed recomputing too often, a giant frozen dataset still being proxied — all stem from misunderstanding reactivity cost.',
    'Senior interviews probe exactly this: how reactivity scales, where it allocates, and how to opt out when you do not need it.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Reactivity is like putting a tiny doorbell on every box of your toys so you get told when any toy changes — wonderful, but you would not bell every single LEGO brick.',
    story: [
      'Imagine you put a little doorbell on each toy box so that whenever someone changes a toy, a bell rings and you go fix the picture you drew of your room.',
      'That is super helpful — you always know what to redraw. But if you put a doorbell on every single tiny LEGO brick in a box of 10,000 bricks, that is a LOT of doorbells, and just setting them all up takes ages.',
      'For the giant brick box you do not really need a bell on each brick — you only care if the whole box changes. So you put one bell on the box, not 10,000 inside it.',
      'Vue lets you choose: deep bells everywhere (the default) or just a shallow bell on the outside for big things. Choosing wisely keeps everything fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue makes your data reactive by wrapping objects in Proxies so it can detect when you read and write properties.',
    'Reading inside a computed or render "tracks" a dependency; writing "triggers" anything that depended on it to re-run.',
    'For small data this is basically free, but deeply reactive huge objects/arrays cost time to wrap and memory to track, and can fire lots of updates.',
    'Vue gives you shallow versions (shallowRef/shallowReactive) and markRaw to opt out of deep reactivity when you do not need it, which can dramatically speed up data-heavy parts of an app.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Reactivity performance is about the cost of Vue\'s tracking system — Proxy creation, dependency collection, and trigger propagation — and the tools (shallowRef, shallowReactive, markRaw, computed) used to keep that cost low on large or frequently-changing data.',
    how: 'reactive() recursively proxies nested objects on access; every tracked read adds the active effect to a dependency set, and every write iterates that set to re-run effects. Shallow APIs only track the top level; markRaw skips proxying entirely; computeds memoize derived work.',
    why: 'Deep reactivity over thousands of objects or per-keystroke updates can cause noticeable jank. Opting out where you do not need fine-grained tracking removes that overhead.',
    code: {
      label: 'Deep vs shallow reactivity',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, shallowRef, markRaw } from \'vue\'\n\n// deep: every nested item gets proxied on access (costly for huge arrays)\nconst deep = ref<{ id: number }[]>([])\n\n// shallow: only the .value replacement is reactive; items are NOT proxied\nconst rows = shallowRef<{ id: number }[]>([])\nrows.value = bigDataset() // triggers once; items stay raw\n\n// markRaw: a non-reactive object (e.g. a chart instance / large config)\nconst chart = markRaw(createHugeChartInstance())\n</script>',
      explanation: [
        'deep ref proxies nested objects as you access them — fine for small data, heavy for huge arrays.',
        'shallowRef only reacts when you replace .value, so assigning a new array triggers one update and items stay raw.',
        'markRaw flags an object so Vue never makes it reactive — ideal for class instances and large static configs.',
        'Choosing the right granularity is the core of reactivity performance.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Reactivity performance concerns the runtime cost of Vue 3\'s Proxy-based system: lazily creating nested Proxies on property access, registering the active effect into per-property dependency sets during track(), and iterating those sets during trigger() to schedule effects. Cost scales with the number of reactive properties accessed, the depth of nested proxying, the number of subscribed effects, and update frequency. Optimization means reducing tracked surface area (shallowRef/shallowReactive for top-level-only reactivity, markRaw/toRaw to exclude objects entirely), memoizing derived work (computed), batching and scheduling (Vue\'s async effect queue, nextTick), and debouncing high-frequency triggers.',

  // 7. Internal Working
  internalWorking: [
    'reactive(obj) returns a Proxy; nested objects are NOT proxied upfront — they are wrapped lazily the first time a nested property is accessed (so deep cost is paid on access, not creation).',
    'During an effect (render or computed) run, a get trap calls track(target, key), adding the currently active effect to that key\'s dependency Set (a dep). This builds the dependency graph.',
    'A set trap calls trigger(target, key), which looks up the dep Set for that key and schedules every subscribed effect to re-run via Vue\'s scheduler.',
    'Effects are queued and flushed asynchronously (deduplicated within a tick), so multiple synchronous mutations cause one flush — but a high-frequency source (e.g. mousemove writing a ref) still triggers each tick.',
    'shallowRef/shallowReactive install traps that track only the top level; nested objects are returned raw, so no deep proxying or nested tracking occurs.',
    'markRaw sets a flag that makes reactive()/ref() skip wrapping the object entirely; toRaw retrieves the underlying object from a proxy, both removing tracking cost for large or externally-managed data.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   reactive(state)
        │ get trap ── track(key) ──► dep Set { effectA, effectB }
        │ set trap ── trigger(key) ─► schedule effectA, effectB
        ▼
   ┌────────────────────────────────────────────┐
   │ DEEP:    state ─► proxy ─► nested proxy ...  │  cost ∝ depth × accesses
   │ SHALLOW: state ─► proxy ─► raw nested (no    │  cost ∝ top level only
   │          tracking below the first level)     │
   │ markRaw: object ──► (never proxied)          │  cost ≈ 0 tracking
   └────────────────────────────────────────────┘
        high-frequency writes ──► many triggers/tick ──► debounce / batch`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each reactive object holds a Proxy plus a depsMap (key → dep Set) on the heap; deeply proxying thousands of nested objects multiplies these structures.',
    'Every tracked dependency stores bidirectional links between the dep Set and the effect, so a widely-read ref with many subscribers grows its dep Set accordingly.',
    'shallowReactive/shallowRef avoid allocating proxies and depsMaps for nested data, keeping memory proportional to the top level only.',
    'markRaw / toRaw keep large objects (class instances, big config, third-party state) as plain heap objects with zero reactivity bookkeeping.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — shallowRef for a large replaced dataset',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { shallowRef, triggerRef } from \'vue\'\ninterface Row { id: number; name: string }\nconst rows = shallowRef<Row[]>([])\n\nfunction load(data: Row[]) {\n  rows.value = data // one trigger, items not proxied\n}\nfunction mutateInPlace() {\n  rows.value.push({ id: 99, name: \'x\' })\n  triggerRef(rows) // shallow: must manually trigger after in-place change\n}\n</script>',
      explanation: [
        'shallowRef reacts only when .value is replaced.',
        'Replacing the whole array (load) triggers a single update without proxying every row.',
        'If you mutate in place you must call triggerRef to notify subscribers.',
        'Great when the array is large and you usually replace it wholesale.',
      ],
    },
    intermediate: {
      label: 'Intermediate — markRaw for a non-reactive instance',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, markRaw } from \'vue\'\nclass Editor { /* huge internal state */ doc = \'...\' }\n\n// Without markRaw, Vue would deeply proxy the entire Editor instance.\nconst editor = ref(markRaw(new Editor()))\n\nfunction setDoc(text: string) {\n  editor.value.doc = text // mutates raw instance; no deep reactivity overhead\n}\n</script>',
      explanation: [
        'A class instance with large internal state should not be deeply proxied.',
        'markRaw flags it so Vue never wraps it, avoiding per-property tracking.',
        'You manage updates explicitly (or replace the ref) instead of relying on deep reactivity.',
        'Common for editor engines, chart instances, maps, and WebGL contexts.',
      ],
    },
    advanced: {
      label: 'Advanced — debounce a high-frequency reactive source',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, watch } from \'vue\'\nimport { refDebounced } from \'@vueuse/core\'\nconst query = ref(\'\')\nconst debounced = refDebounced(query, 300)\n\n// expensive effect runs at most every 300ms instead of every keystroke\nwatch(debounced, (q) => runExpensiveSearch(q))\n</script>\n\n<template>\n  <input v-model="query" />\n</template>',
      explanation: [
        'query triggers on every keystroke; the debounced ref limits how often the expensive watcher runs.',
        'This caps trigger propagation cost for high-frequency inputs.',
        'Debouncing the SOURCE (not the effect) keeps the reactive graph clean.',
        'Equivalent patterns: throttling scroll/resize-driven refs feeding heavy computeds.',
      ],
    },
    realProject: {
      label: 'Real project — large data grid store with shallow state',
      lang: 'ts',
      code: 'import { shallowReactive, computed, markRaw } from \'vue\'\nimport { defineStore } from \'pinia\'\n\ninterface Cell { v: string }\ninterface Row { id: string; cells: Cell[] }\n\nexport const useGrid = defineStore(\'grid\', () => {\n  // shallowReactive: top-level reactive, rows replaced immutably\n  const state = shallowReactive({ rows: [] as Row[], sortKey: \'id\' })\n\n  const sorted = computed(() =>\n    [...state.rows].sort((a, b) => a.id.localeCompare(b.id))\n  )\n\n  function setRows(rows: Row[]) { state.rows = markRaw(rows) }\n  return { state, sorted, setRows }\n})',
      explanation: [
        'shallowReactive keeps state.rows/state.sortKey reactive without proxying each row and cell.',
        'Rows are replaced immutably so the computed re-runs and the view updates.',
        'markRaw on the incoming rows avoids deep proxying a potentially huge dataset.',
        'sorted is a cached computed so the heavy sort runs only when rows or sortKey change.',
        'This is the standard pattern for performant grid/table stores at scale.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Is Vue 3 reactivity expensive?',
      answer: 'For typical app state it is cheap — tracking is O(1) per access and proxies are created lazily. It only becomes costly with deeply nested very large data, many subscribers, or very high-frequency updates.',
      explanation: 'The expected nuance is "cheap by default, costly at scale" — not a blanket yes/no.',
    },
    {
      level: 'beginner',
      question: 'What does shallowRef do and when would you use it?',
      answer: 'shallowRef makes only the .value assignment reactive; the value it holds is not deeply proxied. Use it for large objects/arrays you replace wholesale, or non-reactive instances, to avoid deep tracking overhead.',
      explanation: 'A good answer ties the API to a concrete large-data scenario.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue avoid the upfront cost of deeply proxying a large object?',
      answer: 'reactive() proxies lazily: nested objects are only wrapped the first time you access them, not when the reactive object is created. So you only pay for the parts you actually read.',
      explanation: 'Lazy nested proxying is the key mechanism that keeps the default reasonable.',
    },
    {
      level: 'intermediate',
      question: 'When would you use markRaw, and what is the risk?',
      answer: 'Use markRaw for objects that should never be reactive — class instances, third-party engines, large static config. The risk is that you lose reactivity entirely, so changes to that object will not update the UI unless you trigger updates manually or replace a surrounding ref.',
      explanation: 'Both the use case and the loss-of-reactivity trade-off are needed.',
    },
    {
      level: 'advanced',
      question: 'A watcher fires on every keystroke and runs an expensive query. How do you fix it at the reactivity level?',
      answer: 'Debounce or throttle the source ref (e.g. a debounced ref) so the watcher\'s dependency only changes at a controlled rate, instead of debouncing inside the callback. This reduces trigger propagation and effect runs.',
      explanation: 'Senior answer debounces the source so the reactive graph itself fires less, not just the side effect.',
    },
    {
      level: 'senior',
      question: 'Explain the full cost model of a reactive update and where each cost can be reduced.',
      answer: 'Costs: (1) Proxy creation on nested access — reduce with shallow APIs/markRaw; (2) track() adding effects to dep Sets on read — reduce by reading less reactive surface; (3) trigger() iterating dep Sets and scheduling effects on write — reduce by fewer subscribers and immutable bulk replacement; (4) effect re-runs (render/computed/watch) — reduce with computed memoization, v-memo, and debounced sources. The scheduler batches within a tick, so synchronous batches are already coalesced.',
      explanation: 'Senior signal: decomposing cost into proxy/track/trigger/effect and mapping each to a concrete lever.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does shallowReactive differ from shallowRef?',
    'What is triggerRef and when do you need it?',
    'How does Vue batch multiple synchronous mutations into one render?',
    'When does markRaw silently break your UI updates?',
    'How do computed and v-memo reduce reactivity-driven re-renders?',
    'Why can large reactive arrays be slow even though tracking is O(1)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Making a huge dataset deeply reactive when you only ever replace it.',
      why: 'Vue proxies and tracks nested items you do not need fine-grained reactivity for, costing time and memory.',
      fix: 'Use shallowRef/shallowReactive and replace the data immutably; call triggerRef if you must mutate in place.',
    },
    {
      mistake: 'Debouncing inside the watcher callback instead of the source.',
      why: 'The reactive trigger still fires on every change; only the side effect is delayed, so tracking/propagation cost remains.',
      fix: 'Debounce/throttle the source ref so the dependency itself changes less often.',
    },
    {
      mistake: 'Forgetting that markRaw removes ALL reactivity.',
      why: 'Mutations to a markRaw object never update the UI, leading to "why isn\'t my view updating?" bugs.',
      fix: 'Only markRaw truly non-reactive things; manage their updates explicitly or via a surrounding ref replacement.',
    },
    {
      mistake: 'Doing expensive derivation in the template or a method instead of a computed.',
      why: 'It re-runs on every render driven by unrelated reactive changes.',
      fix: 'Move it to a computed so it is cached and only recomputes when its inputs change.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'The reactivity package exposes shallowRef, shallowReactive, markRaw, toRaw, and triggerRef precisely for tuning tracking granularity on large data.' },
    { area: 'Pinia', detail: 'Performance-sensitive stores hold large collections with shallow reactivity and immutable replacement, exposing derived views via computed getters.' },
    { area: 'Component library', detail: 'Data grids, virtualized tables, and chart wrappers use markRaw for engine instances and shallow state for row data to stay fast at scale.' },
    { area: 'SSR', detail: 'During server render, minimizing reactive surface reduces per-request overhead; large static payloads are often kept raw and serialized directly.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy nested proxying means you only pay for reactive data you actually access.',
      'The async scheduler batches synchronous mutations into a single flush per tick.',
    ],
    bad: [
      'Deeply reactive large arrays/objects cost memory and per-access proxying.',
      'High-frequency sources (mousemove, scroll, keystrokes) writing refs cause a trigger/effect cycle each tick.',
    ],
    optimizations: [
      'Use shallowRef/shallowReactive for large data you replace wholesale.',
      'markRaw/toRaw to exclude class instances and big static objects from reactivity.',
      'Debounce/throttle high-frequency source refs, not the downstream effect.',
      'Memoize derivations with computed and skip unchanged renders with v-memo.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'proxy-reactivity', 'shallowref-shallowreactive', 'computed-caching'],
    nextConcepts: ['list-rendering-performance', 'v-once-v-memo', 'vue-performance-overview', 'watch-vs-watcheffect'],
    dependencyNote:
      'This sits on top of reactivity-fundamentals and proxy-reactivity — you must understand track/trigger before tuning its cost. It directly applies shallow reactivity APIs and computed caching, and pairs with list-rendering-performance and v-memo for the render side.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw reactive(state) with a get trap → track() adding effects to a dep Set, and a set trap → trigger() iterating it.',
      'Annotate deep reactivity: nested proxies created lazily on access (cost ∝ depth × access).',
      'Show shallowRef/shallowReactive stopping tracking at the top level, and markRaw skipping proxying entirely.',
      'Show a high-frequency write firing a trigger every tick, then a debounce on the source reducing that to controlled intervals.',
      'Conclude: "tune the four costs — proxy, track, trigger, effect — by reducing reactive surface, memoizing, and debouncing the source."',
    ],
    diagram: `  state.get ─► track(key) ─► dep { effects }
  state.set ─► trigger(key) ─► schedule effects (batched/tick)

  DEEP    : proxy→proxy→proxy   (lazy, cost ∝ depth)
  SHALLOW : proxy→raw           (top-level only)
  markRaw : (never proxied)

  highfreq writes ──► debounce SOURCE ──► fewer triggers`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue reactivity is cheap by default — proxies are created lazily and tracking is O(1) — but deeply reactive huge data, many subscribers, or high-frequency writes add up. The four costs are Proxy creation, track on read, trigger on write, and effect re-runs. Reduce them with shallowRef/shallowReactive for large replaced data, markRaw/toRaw to exclude objects entirely, computed/v-memo to memoize, and by debouncing high-frequency source refs rather than the downstream effect. The scheduler already batches synchronous mutations per tick.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue 3 reactivity is built on Proxies, and it is cheap for normal app state, but it has a cost model worth understanding for data-heavy apps. There are four costs. First, Proxy creation: reactive() does not deeply proxy upfront — nested objects are wrapped lazily the first time you access them, so you only pay for what you read. Second, tracking: when an effect like a render or computed reads a reactive property, the get trap adds that effect to the property\'s dependency set. Third, triggering: when you write, the set trap iterates that dependency set and schedules every subscribed effect. Fourth, the effect re-runs themselves — renders, computeds, watchers. The scheduler batches synchronous mutations into a single flush per tick, so a burst of writes coalesces, but a genuinely high-frequency source like mousemove or keystrokes still fires every tick. So how do you optimize? If you have a large dataset you replace wholesale, use shallowRef or shallowReactive so only the top level is reactive and you avoid proxying thousands of nested items — and call triggerRef if you must mutate in place. For objects that should never be reactive, like a chart engine or editor instance or a big static config, use markRaw so Vue skips proxying entirely, accepting that you then manage updates yourself. For expensive derivations, use computed so the work is cached and only re-runs when inputs change, and use v-memo to skip unchanged renders. And for high-frequency sources, debounce or throttle the source ref itself, not the callback, so the reactive graph fires less often. The senior framing is to decompose any reactivity perf problem into proxy, track, trigger, and effect, and pick the lever that targets the actual bottleneck.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Shallow reactivity removes deep tracking cost but shifts the burden to you to replace data immutably or trigger manually.',
      'markRaw gives zero tracking overhead but no automatic UI updates — correctness vs performance.',
      'Aggressive memoization (computed/v-memo) saves re-runs but adds comparison and cache memory; net win only when work saved exceeds it.',
    ],
    edgeCases: [
      'Lazy proxying means the first deep access of a huge tree is the expensive moment, not creation.',
      'triggerRef is required after in-place mutation of a shallowRef value.',
      'A markRaw object placed inside a reactive object stays raw — nested reactivity does not "re-wrap" it.',
      'Reading a widely-shared ref in many components grows its dependency set, increasing trigger cost on each write.',
    ],
    runtimeBehavior: [
      'track() and trigger() operate on per-key dependency Sets; iteration scales with subscriber count.',
      'Effects are deduplicated and flushed asynchronously within a tick by the scheduler.',
      'Computeds are lazy and cached; watchers can be eager or post-flush depending on options.',
    ],
    scalability: [
      'Memory scales with proxied nodes and subscriber links; shallow APIs keep it proportional to top-level size.',
      'For tens of thousands of records, combine shallow/raw state with virtualized rendering and cached computed projections.',
    ],
    productionConcerns: [
      '"View not updating" bugs frequently trace to markRaw or in-place shallowRef mutation without triggerRef.',
      'Per-keystroke/per-frame watchers are a common jank source — debounce/throttle the source.',
      'Profile with the Vue DevTools performance tab to find which effects dominate, then target that cost.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Four costs: Proxy create, track (read), trigger (write), effect re-run.',
    'reactive() proxies nested objects LAZILY on access.',
    'shallowRef: reactive only on .value replacement.',
    'shallowReactive: only top-level keys are reactive.',
    'markRaw: object never proxied (no auto updates).',
    'toRaw: get the underlying object from a proxy.',
    'triggerRef: manually trigger after in-place shallowRef mutation.',
    'Debounce/throttle the SOURCE ref, not the callback.',
    'computed memoizes derivations; v-memo skips unchanged renders.',
    'Scheduler batches synchronous mutations per tick.',
    'Large replaced datasets → shallow + immutable replace.',
    'Class/engine instances → markRaw.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert a deeply reactive large array (ref) into a shallowRef and replace it wholesale.',
      hint: 'shallowRef + assign a new array.',
      solution: {
        lang: 'ts',
        code: 'import { shallowRef } from \'vue\'\ninterface Row { id: number }\nconst rows = shallowRef<Row[]>([])\nfunction load(data: Row[]) {\n  rows.value = data // single trigger, no deep proxying\n}',
        explanation: [
          'shallowRef avoids proxying each row.',
          'Replacing .value fires one reactive update.',
          'Ideal when you always swap the whole dataset.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Mutate a shallowRef array in place and make the UI update.',
      hint: 'shallow reactivity does not see in-place mutation by itself.',
      solution: {
        lang: 'ts',
        code: 'import { shallowRef, triggerRef } from \'vue\'\nconst rows = shallowRef<number[]>([1, 2, 3])\nfunction add(n: number) {\n  rows.value.push(n)\n  triggerRef(rows) // notify subscribers manually\n}',
        explanation: [
          'A shallowRef only reacts to .value replacement, not internal mutation.',
          'triggerRef forces dependent effects to re-run.',
          'Use this when in-place mutation is cheaper than recreating the array.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A markRaw chart instance does not update the canvas when you change its data via a ref. Explain why and fix it.',
      hint: 'markRaw removes reactivity; you must drive updates yourself.',
      solution: {
        lang: 'ts',
        code: 'import { ref, markRaw, watch } from \'vue\'\nconst chart = markRaw(createChart())\nconst data = ref<number[]>([])\n// chart itself is raw, so watch the reactive data and call its API\nwatch(data, (d) => chart.setData(d), { deep: true })',
        explanation: [
          'markRaw means mutating the chart never triggers Vue updates — that is intended.',
          'Keep the DATA reactive and watch it, then imperatively update the raw instance.',
          'This separates reactive state from the non-reactive engine cleanly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Make an expensive search run at most once per 300ms as the user types, at the reactivity level (not inside the callback).',
      hint: 'Debounce the source ref so its dependency changes less often.',
      solution: {
        lang: 'ts',
        code: 'import { ref, watch } from \'vue\'\nimport { refDebounced } from \'@vueuse/core\'\nconst query = ref(\'\')\nconst debounced = refDebounced(query, 300)\nwatch(debounced, (q) => runExpensiveSearch(q))',
        explanation: [
          'query updates on every keystroke but debounced only changes every 300ms.',
          'The watcher depends on debounced, so it fires at most every 300ms.',
          'Debouncing the source keeps the reactive graph firing less, not just the effect.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Reactivity performance is what keeps data-heavy Vue apps smooth and shows you truly understand the track/trigger engine rather than treating it as magic. It is a strong senior differentiator.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what shallowRef does. Product companies (Zoho, Flipkart, Razorpay) ask how to keep a big grid or per-keystroke search fast. FAANG-level interviews want the full cost model — proxy/track/trigger/effect — and how each lever (shallow, markRaw, computed, debounce) targets it.',
    whatInterviewersExpect:
      'Explain that reactivity is cheap by default with lazy proxying, decompose the cost into proxy/track/trigger/effect, and map shallowRef, shallowReactive, markRaw, computed, v-memo, and source-debouncing to the right scenarios, including their trade-offs.',
  },
}

export default reactivityPerformance
