import type { ConceptLesson } from '../../../types/lesson'

const reactivityRenderLink: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactivity-render-link',
  name: 'Reactivity → Render Link',
  category: 'lifecycle-rendering',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'This is the single mechanism that makes Vue feel magical: change data, and only the affected components re-render — understanding it removes all the mystery.',
    'It explains exactly which component re-renders when state changes and why unrelated components stay untouched.',
    'It is the root cause of "my UI didn\'t update" and "my whole app re-renders" bugs — both are about how the reactive system connects to the render effect.',
    'It ties together refs/reactive, computed/watch, the render function, and the Virtual DOM into one coherent model.',
    'Senior interviews probe this directly: "how does Vue know what to re-render?" The answer is the render effect and dependency tracking.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'It is like a smart light that only turns on when the exact room you care about gets dark.',
    story: [
      'Imagine you have a magic notebook. Whenever you write in it, a little robot is watching which words you read.',
      'The robot remembers: "this drawing depends on the word cat and the word red."',
      'Later, if you erase "red" and write "blue", the robot instantly knows that ONE drawing needs to be redrawn — and it only redraws that one, not the whole notebook.',
      'Vue works the same way: when it draws your screen, it secretly notes which pieces of data each part used. When a piece changes, it redraws only the parts that used it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When Vue draws a component, it runs a special function that reads your data to figure out what to show.',
    'While that function reads the data, Vue secretly keeps a list: "this component used these specific values."',
    'Each value remembers which components used it (its subscribers).',
    'Later, when one of those values changes, Vue tells only the components that used it to redraw themselves — nothing else.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The reactivity-render link is the connection between Vue\'s reactive state and a component\'s rendering. Each component\'s render runs inside a reactive effect; reading reactive values during render subscribes that effect to them, so a later change triggers a re-render.',
    how: 'When a component mounts, Vue wraps its render in a ReactiveEffect and runs it. During that run, every reactive value read (a ref\'s .value, a reactive property) is "tracked" as a dependency of this effect. When any tracked dependency is mutated, it "triggers" the effect to re-run, producing a new vnode tree that gets diffed and patched.',
    why: 'This is what makes updates targeted and automatic: you never tell Vue what to re-render; the dependency graph built during render does it for you, so only components that actually used the changed data update.',
    code: {
      label: 'Reading a ref during render subscribes the component',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\nconst other = ref(\'unused\') // not read in template → does NOT trigger re-render\n</script>\n\n<template>\n  <!-- reading count here subscribes THIS component to count -->\n  <button @click="count++">Count is {{ count }}</button>\n</template>',
      explanation: [
        'The template reads count, so during render the component\'s effect is tracked as a dependency of count.',
        'Clicking mutates count, which triggers the effect to re-run and re-render.',
        '`other` is never read in the template, so changing it would NOT re-render this component.',
        'The link is built by what you READ during render, not by what you declare.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The reactivity-render link is the binding between Vue\'s dependency-tracking reactivity system and the component update cycle. Each component instance owns a render effect — a ReactiveEffect whose function runs the component render. During execution, reactive reads call track(), recording the active effect as a subscriber of each accessed reactive property (via dep sets keyed by target/key in Proxy get traps). Mutations call trigger(), which schedules the subscribed effects. The component render effect is scheduled asynchronously through the scheduler and flushed on the next tick, re-running render to produce a new vnode tree for the Virtual DOM to diff and patch.',

  // 7. Internal Working
  internalWorking: [
    'On mount, Vue creates a ReactiveEffect whose fn is the component\'s render (componentUpdateFn); it runs immediately to perform the initial render.',
    'Before the render runs, Vue sets it as the "active effect". As the render reads reactive data, each reactive object\'s Proxy get trap calls track(), adding the active effect to that property\'s dependency set (dep).',
    'After render, the active effect is cleared. The component now has a precise dependency set: exactly the reactive properties its render touched.',
    'When a tracked property is mutated, the Proxy set trap calls trigger(), which looks up the dep set and queues each subscribed effect via the scheduler instead of running it synchronously.',
    'The scheduler dedupes (a component re-renders at most once per tick even if many of its deps changed) and flushes the queued render effects on the next microtask tick — this is why DOM updates are batched and asynchronous.',
    'When the render effect re-runs, dependency tracking happens again (deps are re-collected each render), it produces a new vnode tree, and the patch algorithm diffs it against the previous tree to apply minimal DOM changes.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  ref(count)                       Component A render effect
      │  read during render            ▲
      │  ───── track() ───────────────►│  (A is now a subscriber of count)
      │                                │
   count.value++                       │
      │  ───── trigger() ──────────────┘  schedule A to re-run
      ▼
   scheduler queue: [A]  (deduped, flushed next tick)
      │
      ▼  flush
   A.render() → new vnode tree → diff/patch → real DOM
   (Component B never read count → never scheduled → no re-render)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'DEPENDENCY GRAPH (heap): each reactive object has a per-key map of dep Sets; each dep Set holds the effects subscribed to that key. The render effect of a component appears in the dep Sets of exactly the keys it read.',
    'EFFECT → DEPS back-link: each ReactiveEffect also keeps a list of the deps it belongs to, so on each re-run it can clean up stale subscriptions (cleanup) before re-tracking — preventing leaks from conditionals.',
    'SCHEDULER QUEUE: a transient array of effects pending flush on the next tick; deduped by effect id so a component re-renders once per tick regardless of how many of its deps changed.',
    'When a component unmounts, its render effect is stopped, removing it from all dep Sets so the captured reactive objects can be collected if otherwise unreferenced.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — only the reading component re-renders',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst a = ref(0)\nconst b = ref(0)\n</script>\n<template>\n  <!-- this component reads BOTH, so changing either re-renders it -->\n  <p>{{ a }} / {{ b }}</p>\n  <button @click="a++">a</button>\n  <button @click="b++">b</button>\n</template>',
      explanation: [
        'During render the effect reads both a and b, subscribing to both deps.',
        'Clicking either button triggers the same render effect once.',
        'A sibling component that read neither would not be scheduled.',
        'The subscription is determined entirely by what render read.',
      ],
    },
    intermediate: {
      label: 'Intermediate — conditional reads change the dependency set',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst show = ref(true)\nconst name = ref(\'Ada\')\n</script>\n<template>\n  <button @click="show = !show">toggle</button>\n  <!-- name is only READ when show is true; deps are recollected each render -->\n  <p v-if="show">{{ name }}</p>\n</template>',
      explanation: [
        'When show is true, render reads name, so the effect subscribes to name.',
        'When show becomes false, the v-if branch isn\'t rendered, so name is no longer read.',
        'On that re-render Vue cleans up stale deps, so changing name while hidden won\'t re-render.',
        'Dependencies are dynamic — recollected on every render run.',
      ],
    },
    advanced: {
      label: 'Advanced — computed sits between state and render',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst price = ref(100)\nconst qty = ref(2)\n// computed has its own effect; it tracks price+qty and is itself a dep of render\nconst total = computed(() => price.value * qty.value)\n</script>\n<template>\n  <p>{{ total }}</p>\n  <button @click="qty++">+</button>\n</template>',
      explanation: [
        'The computed runs its getter in its own effect, subscribing to price and qty.',
        'The render effect reads total, so the render subscribes to the computed (not directly to price/qty).',
        'Changing qty triggers the computed to invalidate, which triggers the render that depends on it.',
        'This chaining (state → computed → render) is the dependency graph at work.',
      ],
    },
    realProject: {
      label: 'Real project — store change re-renders only subscribed components',
      lang: 'vue',
      code: '<script setup>\n// Pinia store getter is reactive; reading it in render subscribes this component\nimport { useCartStore } from \'@/stores/cart\'\nconst cart = useCartStore()\n</script>\n<template>\n  <!-- only components that READ cart.count re-render when it changes -->\n  <span class="badge">{{ cart.count }}</span>\n</template>',
      explanation: [
        'Pinia state is reactive, so reading cart.count in render subscribes this component to it.',
        'Adding an item elsewhere mutates the store, triggering only components that read count.',
        'A product card that doesn\'t read count won\'t re-render on cart changes.',
        'This selective re-rendering is why Vue apps scale without manual shouldComponentUpdate.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How does Vue know to re-render when data changes?',
      answer: 'Each component\'s render runs inside a reactive effect. Reading reactive data during render subscribes the effect to that data. When the data changes, the effect is triggered to re-run, producing a new render.',
      explanation: 'Naming the render effect and the read-time subscription is the core of a good answer.',
    },
    {
      level: 'beginner',
      question: 'If I change a reactive value that the template never uses, does the component re-render?',
      answer: 'No. The component only subscribes to values its render actually reads. An unread value has no dependency link, so changing it won\'t schedule that component\'s render effect.',
      explanation: 'This tests understanding that subscriptions come from reads, not declarations.',
    },
    {
      level: 'intermediate',
      question: 'Are DOM updates synchronous when you change a ref?',
      answer: 'No. Mutating a ref triggers the render effect, but the scheduler queues it and flushes on the next tick (a microtask). Multiple changes in the same tick are batched and dedaped into one re-render. Use nextTick to read the updated DOM.',
      explanation: 'Connecting trigger → scheduler → batching → nextTick shows the full update path.',
    },
    {
      level: 'intermediate',
      question: 'How do computed properties fit into the reactivity-render link?',
      answer: 'A computed has its own effect that tracks the reactive values its getter reads and caches the result. When render reads the computed, render subscribes to the computed. A change to the computed\'s sources invalidates it, which in turn triggers any render that depends on it.',
      explanation: 'Describing the state → computed → render chain demonstrates layered dependency tracking.',
    },
    {
      level: 'advanced',
      question: 'How are a component\'s dependencies maintained across re-renders?',
      answer: 'Dependencies are re-collected on every render run. Before re-tracking, the effect cleans up its previous dep subscriptions, so stale dependencies (e.g. behind a now-false v-if) are removed. This keeps the subscription set exactly matching what the latest render read.',
      explanation: 'Mentioning cleanup/re-tracking explains why conditional dependencies behave correctly.',
    },
    {
      level: 'senior',
      question: 'Why does Vue schedule render effects asynchronously instead of running them synchronously on each mutation?',
      answer: 'Synchronous re-rendering on every mutation would re-render repeatedly within a single logical update (e.g. setting three refs in a handler would render three times). The scheduler queues effects, dedupes by id, and flushes once per tick, so each component re-renders at most once per batch — far fewer diffs and DOM writes.',
      explanation: 'Batching and dedup are the senior-level justification; tie it to performance and nextTick.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What do track() and trigger() do, and when are they called?',
    'What is the render effect (ReactiveEffect) and how is it created?',
    'How does the scheduler dedupe and batch updates?',
    'Why is nextTick needed to read the DOM after a state change?',
    'How does unmounting a component stop its render effect?',
    'How does this model compare to React\'s top-down re-render?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting the DOM to be updated immediately after changing a ref.',
      why: 'Updates are scheduled and flushed on the next tick, so the DOM reflects the old value synchronously.',
      fix: 'await nextTick() (or use a watcher with flush:"post") before reading the updated DOM.',
    },
    {
      mistake: 'Destructuring reactive state so reads happen outside render tracking.',
      why: 'Destructuring a reactive object copies primitives, breaking the Proxy link, so reads no longer track.',
      fix: 'Use toRefs/toRef or access via the reactive object so reads go through the Proxy and track.',
    },
    {
      mistake: 'Assuming a parent re-render re-renders all children.',
      why: 'Vue re-renders by dependency, not strictly top-down; a child only re-renders if its own deps changed or its props changed.',
      fix: 'Rely on dependency tracking; for prop-stable children, the diff is cheap or skipped.',
    },
    {
      mistake: 'Reading reactive data only in a callback (not during render) and expecting reactivity.',
      why: 'Tracking only happens during the render run; reads in unrelated callbacks don\'t subscribe the render.',
      fix: 'Read the value in the template/computed, or use watch/watchEffect for non-render reactions.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every component update is the render effect re-running after a tracked dependency triggers; this is the default update model of all Vue 3 apps.' },
    { area: 'Pinia', detail: 'Store state and getters are reactive; components subscribe only to the slices they read, so store changes re-render a minimal set of components.' },
    { area: 'Component library', detail: 'Performance-sensitive components use shallowRef/markRaw to limit what gets tracked, keeping the dependency graph small and re-renders cheap.' },
    { area: 'SSR', detail: 'On the server the render runs once without persistent effects; on the client hydration attaches the render effect so subsequent changes re-render normally.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Surgical re-renders: only components that read changed data update, with no manual optimization needed.',
      'Batching via the scheduler collapses many mutations in a tick into a single re-render per component.',
    ],
    bad: [
      'Deeply reactive large objects make tracking and trigger lists expensive and inflate the dependency graph.',
      'Reading a frequently changing value in a large component re-renders the whole component on each change.',
    ],
    optimizations: [
      'Use shallowRef/shallowReactive and markRaw for large or external data to limit tracking depth.',
      'Split big components so each subscribes to a smaller dependency slice and re-renders independently.',
      'Use computed to cache derived values so render subscribes to a stable computed instead of many sources.',
      'Use v-memo/v-once to skip re-rendering parts that didn\'t meaningfully change.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'proxy-reactivity', 'virtual-dom'],
    nextConcepts: ['computed', 'watch', 'nexttick', 'reactivity-performance'],
    dependencyNote:
      'This link is the spine connecting the reactivity system (Proxy track/trigger) to the Virtual DOM render. It requires understanding reactivity fundamentals and the vnode model, and it leads into computed/watch (other effect types), nextTick (flush timing), and reactivity performance tuning.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a ref box (count) and a component box (A) with a "render effect" inside it.',
      'Draw an arrow from A\'s render to count labeled "track() during render = subscribe".',
      'Show count.value++ with an arrow back to the scheduler queue labeled "trigger()".',
      'Draw the scheduler flushing on next tick → A re-renders → diff/patch → DOM.',
      'Add a component B that never reads count and show it is never scheduled. Say: "subscriptions come from reads during render, updates are batched per tick."',
    ],
    diagram: `  count ──track(read in render)──► [render effect of A]
     │                                    ▲
  count++ ──trigger()──► scheduler queue ─┘  (flush next tick)
                              │
                              ▼
                A.render → new vnodes → diff/patch → DOM
  B (never read count) ─────────────────────────► not scheduled`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Each Vue component renders inside a reactive effect. While rendering, every reactive value it reads is tracked, subscribing the render effect to that value. When the value changes, it triggers the effect, which the scheduler queues and flushes on the next tick — producing a new vnode tree that the Virtual DOM diffs and patches. So only components that actually read the changed data re-render, updates are batched per tick, and dependencies are recollected each render (with cleanup of stale ones).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The reactivity-render link is how Vue knows what to re-render when data changes. When a component mounts, Vue wraps its render function in a reactive effect — internally a ReactiveEffect — and runs it for the initial render. The crucial part happens during that run: Vue marks this effect as the active effect, and every time the render reads a reactive value, the Proxy get trap calls track(), which records this effect as a subscriber of that specific property. So after the first render, the component has a precise dependency set: exactly the reactive properties its render touched. Now when one of those properties is mutated, the Proxy set trap calls trigger(), which looks up the subscribers and queues them — not synchronously, but through a scheduler. The scheduler dedupes by effect id, so even if you change ten dependencies in one event handler, the component re-renders only once, and it flushes on the next microtask tick. That batching is why DOM updates are asynchronous and why you need nextTick to read the updated DOM. When the render effect re-runs, it re-collects dependencies from scratch — cleaning up stale ones first — which is why a value behind a now-false v-if stops triggering re-renders. The re-run produces a new vnode tree, and the Virtual DOM diffs it against the previous tree to apply minimal DOM changes. The beautiful consequence is surgical updates: a component that never read a value will never be scheduled when that value changes, so unrelated parts of the app stay completely untouched without any manual optimization. Computed properties slot into this as intermediate effects — render subscribes to the computed, and the computed subscribes to its sources.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Fine-grained per-property tracking gives surgical updates but adds bookkeeping overhead proportional to the number of tracked reads.',
      'Asynchronous batched flushing improves throughput but means the DOM is momentarily stale, requiring nextTick discipline.',
    ],
    edgeCases: [
      'Conditional reads change the dependency set each render; stale-dep cleanup prevents phantom re-renders.',
      'Destructuring or spreading reactive objects detaches reads from tracking.',
      'Reading reactive state only inside non-render callbacks won\'t subscribe the render effect.',
      'A computed with no subscribers is lazy and won\'t recompute until read; over-relying on side effects in computed getters breaks this.',
    ],
    runtimeBehavior: [
      'track() runs only while an effect is active (during render/computed/watch evaluation).',
      'trigger() schedules rather than runs effects; the scheduler dedupes and flushes per tick.',
      'Each effect keeps back-links to its deps for cleanup before re-tracking on the next run.',
    ],
    scalability: [
      'Large deeply-reactive structures grow the dependency graph and trigger fan-out; shallowRef/markRaw bound it.',
      'Component splitting localizes subscriptions so high-frequency state re-renders only a small subtree.',
    ],
    productionConcerns: [
      'Memory: unmounting must stop the render effect to remove it from dep sets and release captured state.',
      'Hot-changing values read by big components cause whole-component re-renders — isolate them.',
      'SSR has no persistent effects; the link is established only after client hydration.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Each component render runs inside a reactive effect (render effect).',
    'Reading reactive data during render = track() = subscribe the effect.',
    'Mutating tracked data = trigger() = schedule the effect.',
    'The scheduler dedupes + batches; flush on next tick → re-render once.',
    'New render → new vnode tree → Virtual DOM diff/patch → DOM.',
    'Only components that READ changed data re-render.',
    'Deps are recollected every render; stale deps are cleaned up.',
    'DOM updates are async → use nextTick to read updated DOM.',
    'computed = its own effect; render subscribes to the computed.',
    'Destructuring reactive state breaks tracking; use toRefs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show two refs where changing one does NOT re-render the component because the template never reads it.',
      hint: 'Only read one of them in the template.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst shown = ref(0)\nconst hidden = ref(0) // never read in template\nfunction bump() { hidden.value++ } // no re-render\n</script>\n<template>\n  <p>{{ shown }}</p>\n  <button @click="bump">bump hidden</button>\n</template>',
        explanation: [
          'Only `shown` is read in render, so only it subscribes the render effect.',
          'Mutating `hidden` triggers nothing because no effect subscribed to it.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate that DOM updates are async by using nextTick.',
      hint: 'Compare the DOM text right after a mutation vs after nextTick.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, nextTick } from \'vue\'\nconst n = ref(0)\nconst el = ref(null)\nasync function go() {\n  n.value++\n  console.log(\'sync:\', el.value.textContent) // old value\n  await nextTick()\n  console.log(\'after tick:\', el.value.textContent) // new value\n}\n</script>\n<template>\n  <p ref="el">{{ n }}</p>\n  <button @click="go">go</button>\n</template>',
        explanation: [
          'The render effect is scheduled, not run synchronously, so the DOM is stale right after mutation.',
          'After nextTick the flush has run and the DOM reflects the new value.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show how a conditional read removes a dependency so a hidden value stops triggering re-renders.',
      hint: 'Guard the read with v-if and toggle it.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst show = ref(true)\nconst val = ref(0)\n// while show=false, val is not read → changing it won\'t re-render\nfunction tick() { val.value++ }\n</script>\n<template>\n  <button @click="show = !show">toggle</button>\n  <button @click="tick">tick</button>\n  <p v-if="show">{{ val }}</p>\n</template>',
        explanation: [
          'When show is true, render reads val and subscribes to it.',
          'When show is false, the re-render doesn\'t read val, so cleanup removes the subscription.',
          'Ticking val while hidden triggers no re-render.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain via code why destructuring a reactive object breaks reactivity in render, and fix it.',
      hint: 'Destructuring copies primitives; use toRefs.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { reactive, toRefs } from \'vue\'\nconst state = reactive({ count: 0 })\n\n// BUG: const { count } = state  → count is a plain number snapshot, no tracking\n// FIX: keep the Proxy link\nconst { count } = toRefs(state) // count is now a ref bound to state.count\nfunction inc() { count.value++ }\n</script>\n<template>\n  <button @click="inc">{{ count }}</button>\n</template>',
        explanation: [
          'Plain destructuring reads the value once and copies it, so render never tracks state.count.',
          'toRefs returns refs that proxy back to the reactive object, preserving track/trigger.',
          'Now reading count.value in render subscribes the effect correctly.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is the conceptual heart of Vue. Once you can explain how reading data during render subscribes the render effect, and how mutation triggers a batched re-render, every reactivity, performance, and update-timing question becomes answerable from first principles.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how does Vue update the DOM when data changes". Product companies (Zoho, Flipkart, Razorpay) ask why updates are async and what re-renders. FAANG-level interviews probe track/trigger, the scheduler, dependency cleanup, and how this compares to React\'s re-render model.',
    whatInterviewersExpect:
      'They expect you to describe the render effect, read-time tracking, mutation-time triggering, the scheduler\'s batching/dedup, the new-vnode-tree → diff/patch flow, and that only components reading changed data re-render.',
  },
}

export default reactivityRenderLink
