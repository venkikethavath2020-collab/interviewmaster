import type { ConceptLesson } from '../../../types/lesson'

const reactive: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactive',
  name: 'reactive',
  category: 'reactivity',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'reactive() is one of the two ways Vue 3 makes data reactive — it turns a whole object into a live, observed thing that re-renders the UI when any property changes.',
    'It is the foundation of how Vue tracks dependencies: when you read a reactive property in a template or computed, Vue silently records "this effect depends on this property".',
    'Understanding reactive vs ref is the single most common Vue interview question, and reactive is half of that answer.',
    'Almost every Pinia store, form model, and complex component state object is built on reactive (directly or via reactive-backed helpers).',
    'Misusing reactive — destructuring it, reassigning it, or putting a primitive in it — causes the #1 category of "why is my UI not updating?" bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'reactive() is like a magic whiteboard that tells everyone the moment you change a number on it.',
    story: [
      'Imagine a whiteboard in your classroom where the teacher writes the lunch menu and how many cookies are left.',
      'Normally if the teacher changes "5 cookies" to "3 cookies", nobody knows unless they walk over and look again.',
      'But this is a MAGIC whiteboard. The instant the teacher rubs out the 5 and writes 3, every poster on the wall that mentions cookies automatically updates itself too.',
      'reactive() wraps an object in this magic. Whenever you change something inside it, every part of your app that was looking at that thing redraws itself, all by itself — you never have to tell it to.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue you keep your data in variables, and the screen shows that data. The hard part is keeping the screen in sync when the data changes.',
    'reactive() takes a normal JavaScript object and returns a special version of it. The special version watches every property.',
    'When you change a property like state.count = 5, Vue notices and re-runs only the parts of the page that used state.count.',
    'So instead of manually updating the screen, you just change the object, and Vue does the redrawing for you. reactive only works on objects and arrays, not on plain numbers or strings.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'reactive() takes a plain object (or array/Map/Set) and returns a deeply reactive Proxy of it. Reading properties tracks them as dependencies; writing properties triggers any effect (render, computed, watcher) that used them.',
    how: 'Vue wraps the object in a JavaScript Proxy. The proxy intercepts get and set operations. On get, it records the currently-running effect as a dependency. On set, it looks up every effect that depended on that key and re-runs them.',
    why: 'It lets you write code that just mutates an object — state.count++ — and have the UI stay in sync automatically, with no manual DOM updates and no setState calls.',
    code: {
      label: 'A reactive counter object',
      lang: 'vue',
      code: '<script setup>\nimport { reactive } from \'vue\'\n\nconst state = reactive({ count: 0, name: \'Vue\' })\n\nfunction increment() {\n  state.count++   // mutate directly — Vue re-renders\n}\n</script>\n\n<template>\n  <p>{{ state.name }} clicked {{ state.count }} times</p>\n  <button @click="increment">+1</button>\n</template>',
      explanation: [
        'reactive({ count: 0, name: \'Vue\' }) returns a proxy; state looks like a normal object.',
        'In the template, reading state.count registers the render as a dependency of count.',
        'increment() mutates state.count directly — no setter call, no .value.',
        'Because the render depended on count, Vue re-runs it and the number updates on screen.',
        'state.name is also reactive; changing it later would update the text too.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'reactive() is a Vue 3 Composition API function that returns a deeply reactive Proxy wrapping a target object. It uses ES2015 Proxy traps (get/set/deleteProperty/has/ownKeys) to implement dependency tracking and change notification. Reading a property during an active effect calls track() to record the dependency; mutating a property calls trigger() to re-run dependent effects. Reactivity is deep (nested objects are wrapped lazily on access) but the proxy identity is distinct from the raw object, and it only works on collection-like objects — it cannot wrap primitives.',

  // 7. Internal Working
  internalWorking: [
    'reactive(target) checks an internal WeakMap (reactiveMap) so the same raw object always yields the same proxy, then creates a new Proxy(target, baseHandlers) if one does not exist.',
    'When an effect (a component render, computed, or watcher callback) runs, Vue sets it as the global activeEffect before executing it.',
    'During execution, reading state.count fires the proxy get trap, which calls track(target, \'count\'): it looks up the dep Set for that target+key in a global targetMap (WeakMap<target, Map<key, Dep>>) and adds activeEffect to it.',
    'Nested objects are wrapped lazily: the get trap, on returning an object value, calls reactive() on it, so deep reactivity is built on demand rather than upfront.',
    'Writing state.count = 5 fires the set trap, which sets the raw value and, if it changed, calls trigger(target, \'count\'): it reads the dep Set and schedules every effect in it to re-run.',
    'Effects are not run synchronously one-by-one; they are pushed to a scheduler queue and flushed on the next microtask, deduplicated, so multiple mutations in one tick cause a single re-render.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        const state = reactive({ count: 0 })

   ┌────────────────────── Proxy ──────────────────────┐
   │   get count  ──► track(target,'count')            │
   │                    │  adds activeEffect to dep     │
   │   set count  ──► trigger(target,'count')          │
   │                    │  re-runs effects in dep       │
   └────────────────────┼──────────────────────────────┘
                        │
        targetMap (WeakMap)
          target ─► Map { 'count' ─► Dep{ renderEffect, computed } }
                                         │
                              mutate ───►│ schedule re-run on next tick`,

  // 9. Memory Visualization
  memoryVisualization: [
    'RAW OBJECT: the original { count: 0 } lives on the heap. reactive() never copies it — the proxy reads/writes straight through to it.',
    'PROXY: a separate heap object wrapping the raw target; state points to the proxy, not the raw object (so state !== rawObject).',
    'reactiveMap (WeakMap): raw object → proxy, so calling reactive() twice on the same object returns the cached proxy. WeakMap keys are weak, so when the raw object is gone the entry can be collected.',
    'targetMap (WeakMap): raw object → Map of key → Dep(Set of effects). This is the dependency graph; it keeps effects alive only while the target is reachable.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reactive object in a component',
      lang: 'vue',
      code: '<script setup>\nimport { reactive } from \'vue\'\n\nconst user = reactive({ first: \'Ada\', last: \'Lovelace\' })\nfunction rename() { user.first = \'Grace\' }\n</script>\n\n<template>\n  <p>{{ user.first }} {{ user.last }}</p>\n  <button @click="rename">Rename</button>\n</template>',
      explanation: [
        'user is a reactive proxy of the object; properties are accessed without .value.',
        'The template reads user.first and user.last, registering both as dependencies.',
        'Clicking the button mutates user.first directly.',
        'Vue triggers a re-render of just the parts that used user.first.',
      ],
    },
    intermediate: {
      label: 'Intermediate — nested objects and arrays are deeply reactive',
      lang: 'vue',
      code: '<script setup>\nimport { reactive } from \'vue\'\n\nconst board = reactive({\n  title: \'Sprint\',\n  columns: [{ name: \'Todo\', cards: [] }],\n})\n\nfunction addCard() {\n  board.columns[0].cards.push({ id: Date.now(), text: \'New\' })\n}\n</script>\n\n<template>\n  <h2>{{ board.title }}</h2>\n  <p>{{ board.columns[0].cards.length }} cards</p>\n  <button @click="addCard">Add</button>\n</template>',
      explanation: [
        'Nested objects (columns, cards) are wrapped reactively the first time they are accessed.',
        'Array methods like push are intercepted, so pushing triggers updates.',
        'Reading board.columns[0].cards.length tracks the array length dependency.',
        'addCard mutates a deeply nested array and the count updates automatically — no manual reassignment needed.',
      ],
    },
    advanced: {
      label: 'Advanced — why destructuring breaks reactivity',
      lang: 'vue',
      code: '<script setup>\nimport { reactive, toRefs } from \'vue\'\n\nconst state = reactive({ count: 0 })\n\n// BROKEN: count is now a plain number, disconnected from the proxy\n// const { count } = state\n\n// FIX: toRefs keeps each property reactive as a ref\nconst { count } = toRefs(state)\n\nfunction inc() { count.value++ }\n</script>\n\n<template>\n  <button @click="inc">{{ count }}</button>\n</template>',
      explanation: [
        'Destructuring a reactive object copies the primitive value out, severing the proxy link.',
        'The plain copy never triggers track/trigger, so the UI stops updating.',
        'toRefs() converts each property into a ref that stays connected to the proxy.',
        'In the template a ref auto-unwraps, so {{ count }} shows the number; in script you use count.value.',
      ],
    },
    realProject: {
      label: 'Real project — a form model as a reactive object',
      lang: 'vue',
      code: '<script setup>\nimport { reactive, computed } from \'vue\'\n\nconst form = reactive({\n  email: \'\',\n  password: \'\',\n  agree: false,\n})\n\nconst isValid = computed(() =>\n  form.email.includes(\'@\') && form.password.length >= 8 && form.agree,\n)\n\nasync function submit() {\n  if (!isValid.value) return\n  await fetch(\'/api/signup\', { method: \'POST\', body: JSON.stringify(form) })\n}\n</script>\n\n<template>\n  <input v-model="form.email" placeholder="Email" />\n  <input v-model="form.password" type="password" />\n  <label><input type="checkbox" v-model="form.agree" /> I agree</label>\n  <button :disabled="!isValid" @click="submit">Sign up</button>\n</template>',
      explanation: [
        'A single reactive form object groups related fields — idiomatic for forms.',
        'v-model binds inputs directly to form properties; typing mutates the proxy.',
        'isValid is a computed that depends on three form properties and recomputes only when they change.',
        'The submit button disables reactively, and the whole form serializes cleanly because the proxy reads through to the raw shape.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does reactive() do in Vue 3?',
      answer: 'It takes a plain object and returns a deeply reactive Proxy. Reading its properties tracks dependencies and writing them triggers re-renders of anything that used those properties.',
      explanation: 'A strong answer names the Proxy, the deep reactivity, and the track/trigger behavior, and notes it works only on objects, not primitives.',
    },
    {
      level: 'beginner',
      question: 'Can you use reactive() on a number or string?',
      answer: 'No. reactive() only works on object types (objects, arrays, Map, Set). For primitives you use ref(), which wraps the value in an object with a .value property.',
      explanation: 'This is the natural lead-in to ref vs reactive; primitives have no properties to intercept, so a Proxy cannot track them.',
    },
    {
      level: 'intermediate',
      question: 'Why does destructuring a reactive object lose reactivity?',
      answer: 'Destructuring copies the current primitive values out of the proxy into plain local variables. Those copies have no connection to the proxy, so reading them never calls track and the UI does not update. Use toRefs() to keep each property reactive.',
      explanation: 'Demonstrates understanding that reactivity is bound to property access on the proxy, not to the values themselves.',
    },
    {
      level: 'intermediate',
      question: 'Why can you not reassign a reactive object directly, e.g. state = reactive({...})?',
      answer: 'Reassigning the local variable just points it at a new proxy; existing references (in templates, computeds, watchers) still hold the old proxy and never see the change. You should mutate properties instead, or use Object.assign(state, newData) to update in place.',
      explanation: 'Senior follow-up territory — the reactivity is on the object you are observing, not on the variable binding.',
    },
    {
      level: 'advanced',
      question: 'How does reactive() implement deep reactivity without wrapping everything upfront?',
      answer: 'It wraps lazily. The proxy get trap, when it returns a value that is itself an object, calls reactive() on that value before returning it. So nested objects become reactive only when first accessed, avoiding the cost of recursively wrapping a large tree eagerly.',
      explanation: 'Shows engine-level understanding of lazy proxy creation and the reactiveMap cache that keeps proxy identity stable.',
    },
    {
      level: 'senior',
      question: 'What are the limitations of Proxy-based reactivity in reactive()?',
      answer: 'Proxy cannot intercept things it does not see: adding a brand-new property is fine in Vue 3 (Proxy traps it), but replacing the whole proxy reference, destructuring, passing a primitive, or operating on the raw object via toRaw bypasses tracking. Some built-ins (like RegExp, or class instances with private fields) interact awkwardly, and a proxy is not === to its raw object, which can surprise identity checks.',
      explanation: 'Senior signal: knowing exactly where the Proxy boundary leaks and how Vue 3 improved over Vue 2 defineProperty (which could not detect new keys or array index sets).',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is reactive() different from ref()?',
    'What happens if you call reactive() twice on the same object? (returns the cached proxy)',
    'How do you keep destructured properties reactive? (toRefs / toRef)',
    'Is state === the raw object? (no — it is a distinct Proxy)',
    'How would you update a whole reactive object at once? (Object.assign, not reassignment)',
    'Why did Vue 3 switch from Object.defineProperty (Vue 2) to Proxy?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Destructuring a reactive object: const { count } = state.',
      why: 'It copies the primitive out and severs the proxy link, so changes no longer trigger updates.',
      fix: 'Use toRefs(state) to destructure into refs, or keep accessing via state.count.',
    },
    {
      mistake: 'Reassigning the reactive variable: state = reactive(newData).',
      why: 'Existing references still point to the old proxy; the template never sees the new object.',
      fix: 'Mutate in place with Object.assign(state, newData), or model the replaceable value as a ref.',
    },
    {
      mistake: 'Passing a primitive to reactive(): reactive(0).',
      why: 'Primitives have no properties for the Proxy to intercept, so it returns the value unwrapped/inert (with a dev warning).',
      fix: 'Use ref() for primitive values.',
    },
    {
      mistake: 'Comparing a reactive object with === to its raw source.',
      why: 'The proxy is a different object identity from the raw target, so the check fails unexpectedly.',
      fix: 'Use toRaw() when you genuinely need the underlying object, or compare a stable id field instead.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Grouping related component state — forms, filters, wizard steps — in a single reactive object so v-model and computeds read/write it directly.' },
    { area: 'Pinia', detail: 'Setup-style stores often hold a reactive() object of state; Pinia itself uses Vue reactivity under the hood and returns reactive store instances.' },
    { area: 'Composables', detail: 'A useXxx composable returns a reactive() state bag plus methods that mutate it, encapsulating feature state with deep reactivity.' },
    { area: 'Component library', detail: 'Complex widgets (data tables, date pickers) keep internal UI state as one reactive object to coordinate many interdependent flags cleanly.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy deep wrapping means large objects only pay the proxy cost on the properties you actually touch.',
      'Fine-grained tracking re-runs only the effects that read a changed key, not the whole component tree.',
    ],
    bad: [
      'Every property access on a reactive object goes through a Proxy trap, which is marginally slower than a plain property read in very hot loops.',
      'Deeply nested, frequently-mutated structures create many dep Sets and can add tracking overhead and memory.',
    ],
    optimizations: [
      'Use shallowReactive() when only the top level needs to be reactive (e.g. a large config blob you replace wholesale).',
      'Use markRaw() on objects that should never be reactive (third-party class instances, big static datasets).',
      'Read frequently-accessed values into a local variable inside tight loops to avoid repeated trap traversal.',
      'Prefer narrow reactive state over one giant object when sections update independently.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'ref'],
    nextConcepts: ['ref-vs-reactive', 'proxy-reactivity', 'toref-torefs', 'shallowref-shallowreactive'],
    dependencyNote:
      'reactive sits at the core of the reactivity spine: it builds on reactivity-fundamentals and pairs with ref. Mastering it unlocks ref-vs-reactive comparisons, the proxy-reactivity internals, and the toRef/toRefs and shallow variants that fix its sharp edges.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write const state = reactive({ count: 0 }) and circle the object — say "this becomes a Proxy".',
      'Draw a get arrow leaving the proxy labelled track(count) → adds the current effect to a dependency set.',
      'Draw a set arrow labelled trigger(count) → re-runs the effects in that set.',
      'Sketch the targetMap as target → key → Set of effects to show where dependencies live.',
      'Conclude: "Mutating a property notifies exactly the effects that read it, which is why the UI stays in sync automatically — and why destructuring, which bypasses the proxy, breaks it."',
    ],
    diagram: `  reactive({ count: 0 })  ──►  Proxy
        │   read count  ─► track  ─┐
        │   write count ─► trigger │
        ▼                          ▼
   targetMap: target ─► { count ─► Set[renderEffect] }
                                   │ mutate → re-run effect → re-render`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'reactive() wraps an object in a Proxy that tracks reads and triggers updates on writes, giving deep, automatic reactivity. You mutate properties directly — state.count++ — and Vue re-renders whatever used them. It works only on objects/arrays/Maps/Sets, not primitives (use ref for those). The big gotchas: do not destructure it (use toRefs) and do not reassign the variable (use Object.assign). It is built on the same Proxy get/set track/trigger machinery that powers all of Vue 3 reactivity.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'reactive() is one of the two core reactivity APIs in Vue 3. You pass it a plain object and it returns a deeply reactive Proxy of that object. The Proxy intercepts property reads and writes: when an effect — a component render, a computed, or a watcher — reads a property, Vue calls track to record that this effect depends on that key, storing it in a global targetMap that maps the object to its keys to a set of effects. When you later mutate that property, Vue calls trigger, looks up the dependent effects, and schedules them to re-run on the next microtask, so the UI stays in sync automatically. The reactivity is deep but lazy: nested objects are only wrapped the first time you access them, which keeps it cheap for large structures. The important constraints are that it only works on object types — primitives have no properties to intercept, so for those you use ref — and that reactivity is tied to accessing properties on the proxy. That is why destructuring a reactive object breaks it: the destructured copies are plain values disconnected from the proxy, and you fix that with toRefs. Likewise you cannot reassign the variable to a new reactive object, because existing references still hold the old proxy; instead you mutate in place or use Object.assign. Compared with Vue 2, which used Object.defineProperty and could not detect added or deleted keys, Proxy makes all of this work uniformly.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'reactive vs ref for state shape: reactive reads ergonomically without .value but breaks on destructuring/reassignment; ref is verbose but portable and reassignable. Many teams standardize on ref for primitives and small state, reactive for grouped object state.',
      'Deep reactivity is convenient but costs tracking overhead on large trees; shallowReactive trades automatic deep updates for performance and explicit control.',
    ],
    edgeCases: [
      'reactive() on a ref-containing object unwraps the ref at the top level (ref values are auto-unwrapped when accessed as a reactive property), which can surprise you.',
      'Collections (Map/Set) use a separate set of handlers; iterating or using .size is tracked, but you must mutate via methods, not by reaching into internals.',
      'markRaw / non-extensible / frozen objects are skipped by reactive() and stay non-reactive by design.',
      'Returning the raw object via toRaw and mutating it bypasses all tracking — useful for perf, dangerous if accidental.',
    ],
    runtimeBehavior: [
      'Proxy identity is cached in reactiveMap, so reactive(obj) === reactive(obj) for the same source — important for dependency stability.',
      'Effects re-run is batched and deduplicated by the scheduler, so N synchronous mutations cause one flush.',
      'Adding a new key triggers iteration-based effects (v-for, Object.keys) because Vue tracks the ITERATE key as well.',
    ],
    scalability: [
      'For very large lists prefer keeping items as plain data and wrapping only the container, or use shallowReactive plus manual triggerRef-style patterns.',
      'Huge reactive trees increase memory via many Dep Sets; flatten or normalize state (e.g. by id) to keep dependency graphs lean.',
    ],
    productionConcerns: [
      'Accidental loss of reactivity from destructuring is the most common production bug — code review for it and prefer toRefs at composable boundaries.',
      'Passing reactive objects across boundaries (workers, JSON.stringify, structuredClone) requires toRaw or a plain copy; proxies can throw on clone.',
      'Class instances with private fields (#x) can throw inside proxy traps — wrap them in markRaw.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'reactive(obj) → deeply reactive Proxy of an object.',
    'Objects/arrays/Map/Set only — never primitives (use ref).',
    'Read property → track dependency; write property → trigger update.',
    'Deep but lazy: nested objects wrapped on first access.',
    'No .value needed — access properties directly.',
    'Do NOT destructure → use toRefs(state).',
    'Do NOT reassign the variable → use Object.assign(state, data).',
    'proxy !== raw object; use toRaw() for the underlying object.',
    'reactive(obj) === reactive(obj) (cached in reactiveMap).',
    'shallowReactive() = only top level reactive; markRaw() = never reactive.',
    'Vue 3 Proxy detects added/deleted keys; Vue 2 defineProperty could not.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a reactive object with name and age, and a button that increments age in a <script setup> component.',
      hint: 'Import reactive, mutate the property directly in a handler.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { reactive } from \'vue\'\nconst person = reactive({ name: \'Sam\', age: 20 })\nfunction birthday() { person.age++ }\n</script>\n\n<template>\n  <p>{{ person.name }} is {{ person.age }}</p>\n  <button @click="birthday">Birthday</button>\n</template>',
        explanation: [
          'person is a reactive proxy; reading person.age in the template tracks it.',
          'birthday() mutates person.age directly and Vue re-renders the paragraph.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Given const state = reactive({ count: 0 }), fix this broken destructure so count stays reactive: const { count } = state.',
      hint: 'Use toRefs to keep each property connected to the proxy.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs } from \'vue\'\nconst state = reactive({ count: 0 })\nconst { count } = toRefs(state)\n// count is now a ref: read count.value, and it stays in sync with state.count\ncount.value++   // also updates state.count',
        explanation: [
          'toRefs turns every property into a ref that proxies back to state.',
          'count.value reads/writes go through to state.count, preserving reactivity.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'You need to replace the entire contents of a reactive state object with fresh server data without losing reactivity. Show how.',
      hint: 'You cannot reassign the variable; mutate the existing proxy in place.',
      solution: {
        lang: 'js',
        code: 'import { reactive } from \'vue\'\nconst state = reactive({ user: null, items: [] })\n\nasync function load() {\n  const data = await fetch(\'/api/state\').then(r => r.json())\n  // Mutate in place — keeps the same proxy that templates reference\n  Object.assign(state, data)\n}',
        explanation: [
          'Reassigning state = reactive(data) would orphan all existing references.',
          'Object.assign copies the new keys/values onto the SAME proxy, so every dependent effect sees the update and re-renders.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why reactive(0) does not work and what to use instead.',
      hint: 'Think about what a Proxy needs to intercept.',
      solution: {
        lang: 'js',
        code: 'import { reactive, ref } from \'vue\'\n\n// reactive(0) returns 0 unchanged (dev warning): a primitive has no\n// properties for the Proxy get/set traps to intercept.\nconst broken = reactive(0)   // not reactive\n\n// Use ref for primitives — it wraps the value in an object { value }\nconst count = ref(0)\ncount.value++                // reactive: triggers updates',
        explanation: [
          'Proxy reactivity depends on intercepting property access; a primitive has none.',
          'ref wraps the primitive in an object with a single reactive .value property, which the Proxy/getter-setter can track.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'reactive is half of the most-asked Vue 3 question (ref vs reactive) and the mental model behind every store, form, and composable. If you can explain track/trigger and the destructuring/reassignment gotchas, you sound like someone who has actually shipped Vue 3.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and "ref vs reactive". Product companies (Zoho, Flipkart, Razorpay) ask why destructuring breaks it and how to update a whole object. FAANG-level interviews probe the Proxy internals, lazy deep wrapping, the targetMap, and Vue 2 defineProperty vs Vue 3 Proxy.',
    whatInterviewersExpect:
      'A precise definition (deeply reactive Proxy), the track-on-read / trigger-on-write model, the objects-only constraint, and fluency with the destructuring (toRefs) and reassignment (Object.assign) fixes — ideally tied to real form/store code you have written.',
  },
}

export default reactive
