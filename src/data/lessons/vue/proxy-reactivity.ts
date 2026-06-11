import type { ConceptLesson } from '../../../types/lesson'

const proxyReactivity: ConceptLesson = {
  // 1. Concept Summary
  slug: 'proxy-reactivity',
  name: 'Proxy Reactivity',
  category: 'reactivity',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Proxy is the engine that makes Vue 3 reactivity work — understanding it turns ref/reactive/computed/watch from magic into mechanism.',
    'It explains why Vue 3 can detect added/deleted keys and array index sets that Vue 2 could not — a top "Vue 2 vs Vue 3" interview point.',
    'It is the deep "how does it actually work" question that separates senior candidates: track on get, trigger on set, stored in a global dependency map.',
    'Knowing the Proxy boundary tells you exactly why destructuring, toRaw, and primitives break reactivity — the root cause of most reactivity bugs.',
    'Performance and correctness decisions (shallow variants, markRaw, escape from tracking) only make sense once you understand the trap-based model.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Proxy is a helpful butler who stands in front of your toy box and writes down who looked at what.',
    story: [
      'Imagine your toys are in a box, but there is a polite butler standing in front of it. You are not allowed to grab toys yourself — you ask the butler.',
      'Every time someone asks "can I see the red car?", the butler hands it over AND writes their name in a notebook: "this person cares about the red car".',
      'Later, when you swap the red car for a blue one, the butler checks his notebook and runs to tell everyone who cared about that toy: "it changed!"',
      'A Proxy is that butler. Vue puts one in front of your data so it always knows who is watching what, and who to notify when something changes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Proxy is a JavaScript feature that wraps an object and lets you run code whenever someone reads or writes a property.',
    'Vue uses this to make reactivity work: when you READ a property, Vue records that the current piece of code depends on it. When you WRITE a property, Vue re-runs everything that depended on it.',
    'The functions that run on read and write are called "traps" — get, set, deleteProperty, has, and a few more.',
    'Because the Proxy sees every operation, Vue 3 can notice things old Vue 2 missed, like adding a new key or setting an array item by index.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Proxy reactivity is Vue 3\'s mechanism for tracking dependencies and triggering updates using the ES2015 Proxy object. reactive() wraps your data in a Proxy whose traps intercept reads (to track) and writes (to trigger).',
    how: 'The get trap calls track(target, key) to remember that the currently-running effect uses that key; the set trap calls trigger(target, key) to re-run every effect that used it. Dependencies live in a global WeakMap (targetMap): target → key → Set of effects.',
    why: 'It gives fully automatic, fine-grained reactivity that works for added/deleted keys, array indices, and collections — without the per-property setup or caveats Vue 2 had with Object.defineProperty.',
    code: {
      label: 'A minimal reactive() built on Proxy',
      lang: 'js',
      code: 'let activeEffect = null\nconst targetMap = new WeakMap()\n\nfunction track(target, key) {\n  if (!activeEffect) return\n  let deps = targetMap.get(target)\n  if (!deps) targetMap.set(target, (deps = new Map()))\n  let dep = deps.get(key)\n  if (!dep) deps.set(key, (dep = new Set()))\n  dep.add(activeEffect)\n}\nfunction trigger(target, key) {\n  const dep = targetMap.get(target)?.get(key)\n  dep?.forEach(effect => effect())\n}\nfunction reactive(obj) {\n  return new Proxy(obj, {\n    get(t, key, r) { track(t, key); return Reflect.get(t, key, r) },\n    set(t, key, val, r) { const ok = Reflect.set(t, key, val, r); trigger(t, key); return ok },\n  })\n}',
      explanation: [
        'reactive wraps obj in a Proxy with get/set traps — this is the heart of Vue 3 reactivity.',
        'get calls track to record the active effect against this target+key.',
        'set writes the value (via Reflect) then calls trigger to re-run dependent effects.',
        'targetMap is the global dependency graph: object → key → set of effects.',
        'This 25-line sketch is conceptually exactly what Vue does (Vue adds scheduling, deep wrapping, collections, etc.).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Proxy reactivity is Vue 3\'s reactivity implementation built on the ES2015 Proxy and Reflect APIs. reactive() returns a Proxy whose handler traps (get, set, has, deleteProperty, ownKeys) drive dependency collection and change propagation. During an active effect, property reads invoke track(), associating the effect with target+key in a global targetMap (WeakMap<target, Map<key, Dep>>). Mutations invoke trigger(), which schedules the dependent effects to re-run via a batched, deduplicated scheduler on the next microtask. Reflect is used inside traps to preserve correct receiver semantics. Deep reactivity is achieved lazily by wrapping nested object results from the get trap.',

  // 7. Internal Working
  internalWorking: [
    'reactive(target) consults reactiveMap (WeakMap) for an existing proxy; if none, it creates new Proxy(target, baseHandlers) using mutableHandlers (collections use collectionHandlers).',
    'When an effect runs, Vue pushes it onto an effect stack and sets it as activeEffect, so any reads during execution can be attributed to it.',
    'The get trap runs Reflect.get for the real value, calls track(target, key) (adding activeEffect to the key\'s Dep), and — if the returned value is an object — wraps it with reactive() lazily for deep reactivity.',
    'track also handles special keys: iteration (ITERATE_KEY) for ownKeys/for-in, and array-length tracking so length-dependent effects update on push/splice.',
    'The set trap runs Reflect.set, determines whether the key is an ADD or a SET (to know whether iteration/length deps must fire), and calls trigger(target, key, type) only if the value actually changed (Object.is check).',
    'trigger collects the relevant Dep(s) and pushes their effects into the scheduler queue; the queue is flushed once per tick (queueJob + flushJobs on a microtask), deduplicating so multiple mutations cause a single re-render.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   reactive(obj) ───► new Proxy(obj, handlers)

        READ  obj.x ──► get trap ──► Reflect.get ──► track(obj,'x')
                                              │ add activeEffect
                                              ▼
   targetMap (WeakMap)
     obj ─► Map { 'x' ─► Dep{ effectA, effectB } , ITERATE ─► Dep{...} }
                          ▲
        WRITE obj.x = 9 ──┘ set trap ──► Reflect.set ──► trigger(obj,'x')
                                              │ push effects to scheduler
                                              ▼
                                   flush on next microtask (batched, deduped)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'PROXY + TARGET: the raw object and its Proxy are two heap objects; the proxy holds an internal reference to the target and reads/writes through it.',
    'reactiveMap (WeakMap): raw target → proxy, ensuring stable proxy identity; weak keys let the pair be collected when the target is unreachable.',
    'targetMap (WeakMap): raw target → Map(key → Dep(Set of ReactiveEffect)). This graph keeps effects referenced only while their target lives.',
    'EFFECT: a ReactiveEffect object holds its deps array (back-pointers to the Dep Sets it is in) so it can be cleaned up and re-tracked on each run, preventing stale dependencies.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — observing get/set traps fire',
      lang: 'js',
      code: 'import { reactive, effect } from \'@vue/reactivity\'\n\nconst state = reactive({ count: 0 })\n\neffect(() => {\n  console.log(\'count is\', state.count) // reads → tracked\n})\n\nstate.count++ // writes → triggers the effect → logs "count is 1"',
      explanation: [
        '@vue/reactivity is the standalone package powering Vue 3 reactivity.',
        'effect() runs its function immediately and re-runs it when tracked deps change.',
        'Reading state.count inside the effect registers the dependency via the get trap.',
        'Mutating state.count fires the set trap → trigger → the effect re-runs.',
      ],
    },
    intermediate: {
      label: 'Intermediate — why Vue 3 detects new keys (Vue 2 could not)',
      lang: 'js',
      code: 'import { reactive, effect } from \'@vue/reactivity\'\n\nconst obj = reactive({})\n\neffect(() => {\n  console.log(\'keys:\', Object.keys(obj)) // tracks ITERATE_KEY\n})\n\nobj.newProp = 1 // ADD → triggers iteration effects → re-runs\n// In Vue 2, obj.newProp = 1 would NOT be reactive (needed Vue.set)',
      explanation: [
        'Object.keys triggers the ownKeys trap, tracked under a special ITERATE key.',
        'Adding a brand new property is an ADD operation that the set trap detects.',
        'Because iteration is tracked, the effect re-runs when keys change.',
        'Vue 2 used Object.defineProperty per existing key and could not see new keys — hence Vue.set; Proxy removes that limitation.',
      ],
    },
    advanced: {
      label: 'Advanced — Reflect and receiver correctness',
      lang: 'js',
      code: 'const handler = {\n  get(target, key, receiver) {\n    track(target, key)\n    // Reflect.get forwards the receiver so getters using `this`\n    // resolve against the PROXY, keeping nested tracking correct.\n    return Reflect.get(target, key, receiver)\n  },\n}\n\nconst raw = {\n  first: \'Ada\', last: \'Lovelace\',\n  get full() { return this.first + \' \' + this.last }, // `this` matters\n}\nconst p = new Proxy(raw, handler)\np.full // get trap fires for full, AND for first/last via the proxy receiver',
      explanation: [
        'Passing receiver to Reflect.get makes `this` inside a getter point at the proxy.',
        'That ensures reads of first/last inside full() also go through the proxy and get tracked.',
        'Without Reflect, a getter\'s internal reads would hit the raw object and be invisible to tracking.',
        'This receiver correctness is exactly why Vue uses Reflect in its handlers.',
      ],
    },
    realProject: {
      label: 'Real project — a typed store built directly on @vue/reactivity',
      lang: 'js',
      code: 'import { reactive, computed, effect } from \'@vue/reactivity\'\n\n// A framework-agnostic store usable outside components too\nexport function createCartStore() {\n  const state = reactive({ items: [] })\n  const total = computed(() =>\n    state.items.reduce((s, i) => s + i.price * i.qty, 0),\n  )\n  function add(item) { state.items.push(item) }\n\n  // persist whenever total changes (a reactive side-effect)\n  effect(() => localStorage.setItem(\'cartTotal\', String(total.value)))\n\n  return { state, total, add }\n}',
      explanation: [
        'computed caches its value and only recomputes when tracked deps (items) change.',
        'effect runs the persistence side-effect and re-runs when total.value changes.',
        'All of this is Proxy reactivity working outside any component — the same engine.',
        'This is how libraries (and Pinia) reuse Vue reactivity in plain JS modules.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What JavaScript feature powers Vue 3 reactivity?',
      answer: 'The ES2015 Proxy object. Vue wraps reactive data in a Proxy whose get trap tracks dependencies and set trap triggers updates.',
      explanation: 'Names the core mechanism and the read=track / write=trigger split.',
    },
    {
      level: 'intermediate',
      question: 'Why can Vue 3 detect adding a new property when Vue 2 could not?',
      answer: 'Vue 2 used Object.defineProperty, which only installs getters/setters on properties that exist at init time, so new keys and array index sets were invisible (hence Vue.set). A Proxy intercepts ALL operations including property addition, deletion, and iteration, so new keys are reactive automatically.',
      explanation: 'The flagship Vue 2 vs Vue 3 reactivity contrast — mention ADD detection and ownKeys/ITERATE tracking.',
    },
    {
      level: 'intermediate',
      question: 'Where are dependencies stored and what is their structure?',
      answer: 'In a global targetMap, a WeakMap from the raw object to a Map from each key to a Dep (a Set of effects). track adds the active effect to the key\'s Dep; trigger reads that Dep and re-runs its effects.',
      explanation: 'Three-level structure: target → key → Set of effects, stored weakly so it does not leak.',
    },
    {
      level: 'advanced',
      question: 'Why does Vue use Reflect inside its Proxy traps?',
      answer: 'To preserve the correct receiver so that `this` inside getters/setters resolves to the proxy, not the raw target. That keeps reads performed inside a getter going through the proxy and thus tracked. Reflect.get/set also returns the spec-correct result for the trap.',
      explanation: 'Senior-level: receiver semantics and why naive target[key] would lose nested tracking.',
    },
    {
      level: 'advanced',
      question: 'How is deep reactivity achieved without wrapping the whole tree upfront?',
      answer: 'Lazily. The get trap, when the returned value is an object, calls reactive() on it before returning, so nested objects become proxies only when first accessed. The reactiveMap caches them so identity stays stable.',
      explanation: 'Lazy wrapping is a key perf design; mentioning the cache shows depth.',
    },
    {
      level: 'senior',
      question: 'What are the limits of Proxy reactivity, and how does Vue handle them?',
      answer: 'A Proxy only tracks operations that go through it: toRaw access, destructured primitives, and operations on the raw object bypass it. Some objects misbehave inside traps (class instances with private fields, certain built-ins) so Vue offers markRaw to opt out. Collections (Map/Set) need dedicated handlers because their mutations are method calls, not property sets. Scheduling is batched, so reads immediately after a write still see old DOM until flush; nextTick bridges that.',
      explanation: 'Demonstrates a complete mental model of the Proxy boundary, collection handling, opt-outs, and async scheduling.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are the Proxy traps Vue actually uses? (get, set, has, deleteProperty, ownKeys)',
    'How does Vue track array length and iteration?',
    'What is the difference between track and trigger?',
    'Why is the effect scheduler batched on a microtask?',
    'How do collection (Map/Set) handlers differ from object handlers?',
    'How does this compare to Object.defineProperty in Vue 2?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing Vue still needs Vue.set / $set in Vue 3.',
      why: 'That was a Vue 2 workaround for defineProperty\'s inability to detect new keys; Proxy makes it unnecessary.',
      fix: 'In Vue 3 just assign new properties directly — they are reactive.',
    },
    {
      mistake: 'Mutating the raw object obtained via toRaw and expecting updates.',
      why: 'toRaw returns the unproxied target; mutations on it bypass the traps entirely.',
      fix: 'Mutate the reactive proxy; use toRaw only for reads/perf where you intentionally skip tracking.',
    },
    {
      mistake: 'Assuming a property read immediately after a write shows updated DOM.',
      why: 'Effects are scheduled and flushed on the next microtask, so the DOM is not yet patched synchronously.',
      fix: 'await nextTick() before reading DOM that depends on the change.',
    },
    {
      mistake: 'Wrapping class instances with private fields in reactive.',
      why: 'Accessing #fields through a Proxy throws (the receiver is the proxy, not the instance).',
      fix: 'Use markRaw on such instances, or store them outside reactive state.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every ref/reactive/computed/watch is built on this Proxy track/trigger core; the renderer\'s update is itself a reactive effect.' },
    { area: 'Pinia', detail: 'Stores reuse @vue/reactivity directly, so store state is Proxy-reactive and integrates with components seamlessly.' },
    { area: 'Standalone', detail: '@vue/reactivity can be used in plain JS (even non-Vue apps) to get reactive state, computed, and effects.' },
    { area: 'SSR', detail: 'On the server reactivity still tracks, but markRaw/shallow variants and avoiding leaks across requests matter because effects can pin state.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy deep wrapping means you only pay proxy cost on touched branches, not the whole tree.',
      'Fine-grained dependency tracking re-runs only effects that read changed keys; batching deduplicates updates per tick.',
    ],
    bad: [
      'Every property access traverses a trap, measurably slower than plain reads in very hot loops.',
      'Large, frequently-mutated reactive trees create many Dep Sets, increasing memory and tracking work.',
    ],
    optimizations: [
      'Use shallowReactive/shallowRef to limit proxying depth for big payloads.',
      'markRaw objects that never need reactivity (heavy third-party instances, static data).',
      'Hoist hot reads into locals to avoid repeated trap traversal in loops.',
      'Use toRaw for read-heavy, non-tracked computations where you knowingly opt out of reactivity.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'On SSR, a module-level reactive store shared across requests can leak one user\'s data into another\'s render if effects/state are not request-scoped.',
    ],
    bestPractices: [
      'Create per-request app/store instances on the server so reactive state is not shared between users.',
      'Avoid storing secrets in reactive state that may be serialized into the SSR payload sent to the client.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'reactive', 'ref'],
    nextConcepts: ['reactivity-render-link', 'shallowref-shallowreactive', 'reactivity-caveats', 'computed'],
    dependencyNote:
      'Proxy reactivity is the deep internals layer beneath reactive and ref. Understand reactivity-fundamentals first; afterward it explains the reactivity-render-link (effects driving renders), why the shallow variants and reactivity-caveats exist, and how computed memoizes on top of the same engine.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the raw object and a Proxy box in front of it with get/set traps.',
      'From the get trap draw an arrow to track(target, key) adding the active effect to a Dep.',
      'Draw the targetMap as target → key → Set of effects.',
      'From the set trap draw an arrow to trigger(target, key) reading that Set and scheduling the effects.',
      'Conclude: "Read = track, write = trigger, stored in a WeakMap; this is why Vue 3 sees new keys and array indices that Vue 2 missed, and why bypassing the proxy breaks reactivity."',
    ],
    diagram: `   raw obj ◄── reads/writes through ── Proxy[ get→track , set→trigger ]
                                              │            │
                              track adds      ▼            ▼  trigger reads
                          targetMap: target ─► key ─► Dep{ effects }
                                                          │
                                          schedule → flush (microtask, deduped)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue 3 reactivity is built on the ES2015 Proxy. reactive() wraps data in a Proxy; the get trap calls track to record that the active effect depends on a key, storing it in a global WeakMap (target → key → Set of effects); the set trap calls trigger to re-run those effects via a batched microtask scheduler. Reflect preserves receiver/getter correctness, and nested objects are wrapped lazily. This is why Vue 3 detects new keys and array index sets that Vue 2\'s Object.defineProperty could not.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue 3 reactivity is built on the JavaScript Proxy. When you call reactive(obj), Vue returns a Proxy whose handler defines traps — most importantly get and set, plus has, deleteProperty, and ownKeys. The big idea is read equals track, write equals trigger. While an effect is running — an effect being a component render, a computed, or a watcher — Vue marks it as the active effect. Any property read inside that effect fires the get trap, which calls track to associate the effect with that target and key. Dependencies are stored in a global targetMap, a WeakMap from the raw object to a Map from each key to a Dep, which is a Set of effects. When you later mutate a property, the set trap fires, runs Reflect.set, checks whether the value actually changed, and if so calls trigger, which looks up the Dep and schedules its effects to re-run. That scheduling is batched and deduplicated on the next microtask, so many mutations in one tick cause a single re-render — which is also why you need nextTick to read updated DOM. Vue uses Reflect inside the traps to forward the receiver so that getters using this resolve against the proxy and their nested reads stay tracked. Deep reactivity is achieved lazily: the get trap wraps nested objects with reactive on first access, cached in a reactiveMap for stable identity. The headline advantage over Vue 2 is that Object.defineProperty only instrumented properties that existed at init time and could not see added or deleted keys or array index assignments — that is why Vue 2 needed Vue.set. Because a Proxy intercepts every operation, including additions and iteration, all of that just works in Vue 3, and the only way to lose reactivity is to step outside the proxy via toRaw, destructuring, or a primitive.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Proxy gives complete, uniform interception at the cost of per-access trap overhead versus plain object reads.',
      'Lazy deep wrapping balances correctness and performance but creates surprising proxy identity (proxy !== raw) that complicates equality and serialization.',
    ],
    edgeCases: [
      'Array operations: index sets and length changes are tracked, but mutating length directly or sparse arrays can surprise; push/splice are handled specially to avoid double-trigger.',
      'Collections (Map/Set) use separate handlers because mutations are method calls; iterating tracks the collection, and keys must themselves be raw vs reactive consistently.',
      'Class instances with private fields throw inside traps; markRaw is the escape hatch.',
      'Nested reactive of an already-reactive value returns the same proxy (idempotent), but reactive(ref) unwraps differently than expected.',
    ],
    runtimeBehavior: [
      'Effects clean up their old dependency links before each run, so conditional reads do not leave stale deps.',
      'The scheduler flushes pre/sync/post queues; component updates run post, watchers can choose flush timing.',
      'trigger differentiates ADD/SET/DELETE to know whether iteration and length deps must also fire.',
    ],
    scalability: [
      'For very large datasets, prefer shallow reactivity and normalize state; deep proxies over thousands of nodes add real memory and tracking cost.',
      'In standalone @vue/reactivity usage, manually stopping effects (effect scope / stop) is essential to avoid leaks.',
    ],
    productionConcerns: [
      'SSR must scope reactive state per request to avoid cross-request leakage.',
      'toRaw misuse silently disables reactivity — audit any use in mutation paths.',
      'Memory leaks from never-stopped effects in long-lived non-component code; use effectScope to dispose groups.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Vue 3 reactivity = ES2015 Proxy + Reflect.',
    'Read → get trap → track(target, key).',
    'Write → set trap → trigger(target, key).',
    'Deps live in targetMap: WeakMap<target, Map<key, Dep=Set<effect>>>.',
    'Reflect preserves receiver so getter `this` = proxy (keeps nested tracking).',
    'Deep reactivity is LAZY (wrap nested on first get), cached in reactiveMap.',
    'Effects scheduled + batched + deduped on next microtask → nextTick to read DOM.',
    'Proxy detects ADD/DELETE/array-index — Vue 2 defineProperty could not (needed Vue.set).',
    'Bypass via toRaw / destructure / primitive = no tracking.',
    'Collections (Map/Set) use dedicated handlers; class private fields → markRaw.',
    '@vue/reactivity is usable standalone (effect/computed/reactive).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use @vue/reactivity\'s effect() to log a count whenever it changes.',
      hint: 'effect runs immediately and re-runs on tracked dep change.',
      solution: {
        lang: 'js',
        code: 'import { reactive, effect } from \'@vue/reactivity\'\nconst s = reactive({ count: 0 })\neffect(() => console.log(s.count)) // logs 0, then re-logs on change\ns.count = 1 // logs 1',
        explanation: [
          'Reading s.count inside effect tracks it via the get trap.',
          'Writing s.count triggers the effect to re-run, logging the new value.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a tiny reactive() and effect() from scratch using Proxy that supports a single get/set dependency.',
      hint: 'Track the active effect on get; trigger it on set.',
      solution: {
        lang: 'js',
        code: 'let activeEffect = null\nconst map = new WeakMap()\nfunction effect(fn) { activeEffect = fn; fn(); activeEffect = null }\nfunction reactive(obj) {\n  return new Proxy(obj, {\n    get(t, k, r) {\n      if (activeEffect) {\n        let m = map.get(t) || map.set(t, new Map()).get(t)\n        let dep = m.get(k) || m.set(k, new Set()).get(k)\n        dep.add(activeEffect)\n      }\n      return Reflect.get(t, k, r)\n    },\n    set(t, k, v, r) {\n      const ok = Reflect.set(t, k, v, r)\n      map.get(t)?.get(k)?.forEach(fn => fn())\n      return ok\n    },\n  })\n}',
        explanation: [
          'effect sets a global activeEffect, runs fn (collecting deps), then clears it.',
          'get adds activeEffect to the dep set for target+key.',
          'set writes via Reflect then re-runs every effect in that key\'s dep set.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate why Reflect.get(target, key, receiver) matters for a computed-like getter, versus target[key].',
      hint: 'A getter using `this` should read through the proxy.',
      solution: {
        lang: 'js',
        code: 'const raw = { a: 1, b: 2, get sum() { return this.a + this.b } }\nconst log = []\nconst p = new Proxy(raw, {\n  get(t, k, recv) { log.push(k); return Reflect.get(t, k, recv) },\n})\np.sum\n// log === [\'sum\', \'a\', \'b\']  — Reflect forwards receiver=p, so reads of\n// a and b inside the getter go through the proxy and are seen/tracked.\n// With `return t[k]` instead, `this` would be raw and a/b reads would\n// bypass the proxy: log would be just [\'sum\'].',
        explanation: [
          'Reflect.get passes the proxy as receiver, so this inside sum is the proxy.',
          'Thus a and b are read through the proxy and recorded; tracking stays complete.',
          'Using target[key] would let the getter read raw, hiding nested dependencies.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with a code example, why Vue 3 no longer needs Vue.set for adding object keys.',
      hint: 'Compare defineProperty (per-key, init-time) to Proxy (all operations).',
      solution: {
        lang: 'js',
        code: 'import { reactive, effect } from \'@vue/reactivity\'\nconst state = reactive({})\neffect(() => console.log(JSON.stringify(state)))\nstate.newKey = 1 // re-runs the effect — reactive in Vue 3\n\n// Vue 2 (conceptually): Object.defineProperty installed getters/setters\n// only on keys present at init, so a brand-new key had no setter and\n// was invisible — you needed Vue.set(state, \'newKey\', 1).\n// Proxy intercepts the ADD operation, so it is reactive automatically.',
        explanation: [
          'Proxy traps fire for property additions (ADD), so new keys are tracked.',
          'Vue 2\'s defineProperty only instrumented existing keys at init time.',
          'Hence Vue.set/$set was needed in Vue 2 and is obsolete in Vue 3.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is the "how does Vue actually work" question. Explaining Proxy traps, track/trigger, the targetMap, and the Vue 2 vs Vue 3 difference proves you understand the framework, not just its API — exactly what senior interviewers probe for.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go this deep; they may ask "what powers Vue 3 reactivity". Product companies (Zoho, Flipkart, Razorpay) ask the Vue 2 vs Vue 3 reactivity difference and to sketch track/trigger. FAANG-level interviews ask you to implement a mini reactive/effect and discuss Reflect, scheduling, collections, and the Proxy boundary.',
    whatInterviewersExpect:
      'The Proxy + Reflect mechanism, read=track / write=trigger, the targetMap structure, lazy deep wrapping, batched scheduling, and a crisp explanation of why Proxy supersedes Object.defineProperty — ideally backed by a hand-written mini-reactive sketch.',
  },
}

export default proxyReactivity
