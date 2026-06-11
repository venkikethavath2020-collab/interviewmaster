import type { ConceptLesson } from '../../../types/lesson'

const refVsReactive: ConceptLesson = {
  // 1. Concept Summary
  slug: 'ref-vs-reactive',
  name: 'ref vs reactive',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'This is the single most common Vue 3 interview question — knowing exactly when to reach for ref versus reactive marks you as someone who has actually built Vue 3 apps.',
    'Choosing wrong leads to either endless .value noise or silent reactivity loss from destructuring — both are real, frequent production bugs.',
    'It shapes how you design composables and stores: the return shape (refs vs reactive bag) decides how ergonomic your API is for consumers.',
    'Understanding the tradeoff means understanding the underlying machinery — Proxy for reactive, an accessor object for ref — which is the deeper question behind the question.',
    'Teams adopt conventions around this; being able to articulate a clear rule (primitives → ref, grouped object state → reactive) shows engineering judgment.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'ref is a single magic jar; reactive is a magic toy box full of compartments.',
    story: [
      'Imagine you have a single cookie you want everyone to watch. You put it in a special magic jar — and whenever you swap the cookie, everyone watching the jar knows instantly. That jar is a ref: it can hold one thing of any kind, even a single number.',
      'Now imagine a whole toy box with many compartments — cars, blocks, crayons. The whole box is magic: change anything inside any compartment and everyone watching sees it. That box is reactive.',
      'The jar has a lid you must open to see what is inside — that is the .value you write in code. The toy box has no lid; you reach straight into a compartment.',
      'You use a jar for one simple thing, and a toy box when you have a group of related things you want to keep together.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue 3 gives two tools to make data live: ref and reactive. Both make the screen update when the data changes — they differ in shape and what they can hold.',
    'ref can wrap ANY value — a number, a string, a boolean, an object — and you read or write it through a .value property in your code.',
    'reactive only wraps objects, arrays, Maps, and Sets, and you use it like a normal object with no .value.',
    'A simple rule: use ref for single values and reactive for a bundle of related properties. Under the hood, ref uses a getter/setter and reactive uses a JavaScript Proxy.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'ref(value) returns a reactive object with a single .value property and works on any value, including primitives. reactive(obj) returns a deeply reactive Proxy and works only on objects/arrays/Maps/Sets. They are two ways to declare reactive state with different ergonomics and constraints.',
    how: 'A ref tracks dependencies on access to .value; in templates the .value is auto-unwrapped so you write just the name. A reactive proxy tracks dependencies on each property access. ref can hold and reassign anything; reactive must be mutated in place and breaks if destructured.',
    why: 'ref is portable and reassignable, ideal for primitives and values you swap wholesale; reactive is ergonomic for grouped object state you mutate property-by-property. Picking the right one keeps code both correct and clean.',
    code: {
      label: 'The same counter, two ways',
      lang: 'vue',
      code: '<script setup>\nimport { ref, reactive } from \'vue\'\n\n// ref — primitive, needs .value in script\nconst count = ref(0)\nfunction incRef() { count.value++ }\n\n// reactive — object, no .value\nconst state = reactive({ count: 0 })\nfunction incReactive() { state.count++ }\n</script>\n\n<template>\n  <button @click="incRef">ref: {{ count }}</button>\n  <button @click="incReactive">reactive: {{ state.count }}</button>\n</template>',
      explanation: [
        'count is a ref; in script you must use count.value, but the template auto-unwraps to {{ count }}.',
        'state is a reactive proxy; you access state.count with no .value anywhere.',
        'Both re-render on change — the difference is purely shape and capability.',
        'ref(0) works on a primitive; reactive(0) would NOT, because Proxy needs an object.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'ref and reactive are the two primary reactivity primitives in Vue 3. ref(x) wraps any value in a RefImpl object exposing a tracked get/set .value accessor; for object values it internally calls reactive() so the inner object is deep-reactive too. reactive(obj) returns a Proxy whose get/set traps perform track/trigger directly on property access, providing deep reactivity but only for collection-like targets. The practical distinction: ref accepts primitives and is reassignable and destructure-safe (the ref object survives), while reactive offers .value-free ergonomics but loses reactivity when destructured or reassigned.',

  // 7. Internal Working
  internalWorking: [
    'ref(x) constructs a RefImpl whose .value getter calls trackRefValue (recording the active effect) and whose setter compares old/new and calls triggerRefValue to re-run effects.',
    'If the ref holds an object, the setter passes it through toReactive(), so ref({...}).value is itself a reactive Proxy — refs are deep too.',
    'reactive(obj) creates a Proxy via baseHandlers; its get trap calls track(target, key) and its set trap calls trigger(target, key), with nested objects wrapped lazily on access.',
    'In templates, the compiler/renderer applies ref auto-unwrapping: a ref used in the render context is read via .value automatically, so you write the bare name.',
    'A ref placed as a property of a reactive object is also auto-unwrapped (state.myRef returns the value, not the ref) — except inside arrays/Maps, where it is not unwrapped.',
    'Both ultimately feed the same dependency system (targetMap + Dep + scheduler); the difference is only in how the value is stored and accessed, not in how effects are tracked and flushed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ref(0)                          reactive({ count: 0 })
   ┌──────────────┐                ┌─────────────────────────┐
   │ RefImpl      │                │ Proxy                   │
   │  get value ─►│ track          │  get count ─► track     │
   │  set value ─►│ trigger        │  set count ─► trigger    │
   └──────┬───────┘                └──────────┬──────────────┘
          │ access via .value                 │ access directly
          │ (template auto-unwraps)            │ (no .value)
          ▼                                    ▼
   any value, reassignable           objects only, mutate in place
   destructure-safe                  destructure BREAKS (use toRefs)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'REF: a small RefImpl heap object holding _value plus a dep. For object values, _value points to a reactive Proxy. The variable points to the RefImpl, so reassigning .value swaps the inner value but keeps the same ref identity.',
    'REACTIVE: a Proxy heap object wrapping the raw target; the variable points to the Proxy. There is no wrapper to survive destructuring — pulling out a primitive copies it away from the proxy.',
    'SHARED GRAPH: both register effects in the same global targetMap/Dep structures, so the dependency graph looks identical regardless of which primitive you chose.',
    'AUTO-UNWRAP: when a ref is a property of a reactive object, the proxy get trap returns ref.value, so the ref wrapper is transparent in that context.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — choosing by value type',
      lang: 'vue',
      code: '<script setup>\nimport { ref, reactive } from \'vue\'\n\nconst loading = ref(false)              // primitive → ref\nconst filters = reactive({ q: \'\', page: 1 }) // grouped object → reactive\n</script>\n\n<template>\n  <p v-if="loading">Loading…</p>\n  <input v-model="filters.q" />\n  <span>Page {{ filters.page }}</span>\n</template>',
      explanation: [
        'A boolean flag is a single value → ref(false).',
        'A bundle of related filter fields → reactive({...}).',
        'In the template, loading auto-unwraps; filters is used as a plain object.',
        'This is the canonical "primitives → ref, grouped state → reactive" rule.',
      ],
    },
    intermediate: {
      label: 'Intermediate — reassignment and destructuring differences',
      lang: 'js',
      code: 'import { ref, reactive, toRefs } from \'vue\'\n\n// ref: reassign freely, destructure-safe\nconst user = ref(null)\nuser.value = { name: \'Ada\' }   // fine — swap the whole value\n\n// reactive: cannot reassign the variable\nlet state = reactive({ count: 0 })\n// state = reactive({ count: 9 }) // BAD: orphans old references\nObject.assign(state, { count: 9 }) // good: mutate in place\n\n// reactive destructure loses reactivity → use toRefs\nconst { count } = toRefs(state)  // count is a ref, stays in sync',
      explanation: [
        'A ref can be reassigned via .value to a completely new object — handy for fetched data.',
        'A reactive variable must not be reassigned; do Object.assign to update in place.',
        'Destructuring reactive copies primitives out and breaks tracking.',
        'toRefs bridges the gap, giving destructure-safe refs from a reactive object.',
      ],
    },
    advanced: {
      label: 'Advanced — ref auto-unwrapping inside reactive',
      lang: 'js',
      code: 'import { ref, reactive } from \'vue\'\n\nconst count = ref(0)\nconst state = reactive({ count })  // ref nested in reactive\n\nconsole.log(state.count)   // 0  — auto-unwrapped, NOT the ref\nstate.count = 5            // writes through to count.value\nconsole.log(count.value)   // 5\n\n// but inside an array, refs are NOT unwrapped:\nconst list = reactive([count])\nconsole.log(list[0].value) // 5  — still a ref here',
      explanation: [
        'A ref used as a reactive object property is transparently unwrapped on get/set.',
        'state.count and count.value stay synchronized — they are the same underlying value.',
        'Inside arrays (and Map/Set), refs are NOT auto-unwrapped, a classic gotcha.',
        'This explains why mixing refs and reactive can confuse — know where unwrapping happens.',
      ],
    },
    realProject: {
      label: 'Real project — a composable returning the right shapes',
      lang: 'js',
      code: 'import { ref, reactive, toRefs } from \'vue\'\n\nexport function useUsers() {\n  // single async value → ref\n  const loading = ref(false)\n  const error = ref(null)\n  // grouped query params → reactive\n  const query = reactive({ search: \'\', page: 1, pageSize: 20 })\n  const users = ref([])\n\n  async function fetchUsers() {\n    loading.value = true\n    try {\n      users.value = await api.getUsers(query)\n    } catch (e) { error.value = e } finally { loading.value = false }\n  }\n\n  // expose query fields as refs so callers can destructure safely\n  return { loading, error, users, fetchUsers, ...toRefs(query) }\n}',
      explanation: [
        'Single values (loading, error, users) are refs — reassignable and destructure-safe.',
        'Related query params are grouped in a reactive object for clean v-model binding.',
        'toRefs(query) lets consumers destructure search/page/pageSize without losing reactivity.',
        'This mixed approach is idiomatic: reactive for cohesion internally, refs at the API boundary.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between ref and reactive?',
      answer: 'ref wraps any value (including primitives) in an object with a .value property; reactive wraps only objects/arrays/Maps/Sets in a Proxy and is used without .value. ref is reassignable and destructure-safe; reactive must be mutated in place and breaks on destructuring.',
      explanation: 'The crisp answer covers value type, .value, and the destructure/reassign behavior — three distinct axes.',
    },
    {
      level: 'beginner',
      question: 'Why does ref need .value but reactive does not?',
      answer: 'ref must support primitives, which have no properties to intercept, so Vue wraps the value in an object exposing a .value accessor it can track. reactive only handles objects, whose properties the Proxy intercepts directly, so no wrapper is needed.',
      explanation: 'Connects the ergonomic difference to the underlying mechanism (accessor vs Proxy).',
    },
    {
      level: 'intermediate',
      question: 'When would you choose reactive over ref, and vice versa?',
      answer: 'Use ref for primitives, single values, and anything you reassign wholesale (fetched data, flags). Use reactive for a cohesive group of related properties you mutate individually, like a form model or filter set. Many teams default to ref everywhere for consistency and use reactive only for grouped state.',
      explanation: 'Shows engineering judgment and awareness that there is a defensible convention either way.',
    },
    {
      level: 'intermediate',
      question: 'What happens when you put a ref inside a reactive object?',
      answer: 'It is auto-unwrapped: accessing the property returns and sets the ref value directly, so you use it without .value and it stays in sync with the original ref. The exception is when the ref is inside an array, Map, or Set, where it is NOT unwrapped.',
      explanation: 'A favorite gotcha question; mentioning the array/collection exception is the senior touch.',
    },
    {
      level: 'advanced',
      question: 'Is reactive deeper or shallower than ref? Are object refs reactive?',
      answer: 'Both are deep by default. ref of an object internally calls reactive on the value, so ref({...}).value is a reactive Proxy and nested mutations are tracked. There is no depth difference; the only difference is the .value wrapper and what types each accepts.',
      explanation: 'Corrects the common misconception that ref is shallow and reactive is deep.',
    },
    {
      level: 'senior',
      question: 'How would you design a composable\'s return type given this distinction?',
      answer: 'Return refs (or toRefs of internal reactive state) so consumers can destructure freely without losing reactivity. Avoid returning a bare reactive object that callers will destructure. Group internal mutation-heavy state as reactive for ergonomics, but expose it as refs at the boundary. This keeps the public API safe and predictable.',
      explanation: 'Senior signal: API design driven by the reactivity semantics, anticipating how consumers will use the return value.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Can reactive hold a primitive? (no — use ref)',
    'Is ref shallow? (no — object refs are deep via reactive internally)',
    'How do you safely destructure a reactive object? (toRefs / toRef)',
    'What happens to a ref nested in a reactive array? (NOT auto-unwrapped)',
    'Why can you reassign a ref but not a reactive variable?',
    'What is your team convention — ref-everywhere or mixed — and why?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting .value when reading/writing a ref in script.',
      why: 'Templates auto-unwrap, so beginners assume script does too; using the ref directly compares the wrapper object, not the value.',
      fix: 'Always use .value in script; only the template (and reactive-object access) auto-unwraps.',
    },
    {
      mistake: 'Destructuring a reactive object and losing reactivity.',
      why: 'Destructuring copies primitives out of the proxy, severing tracking.',
      fix: 'Use toRefs(state) to destructure into refs, or keep accessing via state.x.',
    },
    {
      mistake: 'Reassigning a reactive variable to swap data.',
      why: 'The new proxy is invisible to existing references that hold the old one.',
      fix: 'Use a ref if you need to reassign, or Object.assign to mutate the reactive object in place.',
    },
    {
      mistake: 'Assuming a ref inside an array unwraps like it does as an object property.',
      why: 'Auto-unwrapping does not apply inside arrays/Maps/Sets, so you get the ref object, not the value.',
      fix: 'Access .value explicitly for refs stored in collections, or avoid nesting refs in arrays.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Components use ref for flags/single values and reactive for grouped form or filter state; v-model binds cleanly to both.' },
    { area: 'Composables', detail: 'Return refs (or toRefs) so consumers can destructure; internal grouped state may be reactive for ergonomics.' },
    { area: 'Pinia', detail: 'Setup stores declare state as refs (reassignable, destructure-friendly via storeToRefs); some use reactive for grouped sub-state.' },
    { area: 'Component library', detail: 'Public composable/hook APIs standardize on refs to give predictable, destructure-safe contracts to library users.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Both share the same fine-grained dependency system, so neither is inherently faster for typical app state.',
      'ref of a primitive is a very lightweight wrapper; access through .value is a simple getter.',
    ],
    bad: [
      'Wrapping huge objects with either creates many dep Sets; the choice does not avoid that cost.',
      'Mixing refs and reactive carelessly adds cognitive overhead and unwrapping confusion that leads to bugs (a maintenance cost more than a runtime one).',
    ],
    optimizations: [
      'Use shallowRef for large objects you replace wholesale (e.g. fetched JSON) to skip deep proxying.',
      'Use shallowReactive when only the top level needs tracking.',
      'Pick one convention per codebase to reduce churn and mistakes.',
      'Use toRefs at composable boundaries rather than re-creating refs manually.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactive', 'reactivity-fundamentals'],
    nextConcepts: ['toref-torefs', 'shallowref-shallowreactive', 'proxy-reactivity', 'reactivity-caveats'],
    dependencyNote:
      'This comparison assumes you know ref and reactive individually and the reactivity-fundamentals beneath them. It leads naturally into toRef/toRefs (the destructure fix), the shallow variants (perf), the proxy-reactivity internals, and reactivity-caveats (the sharp edges of both).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: REF and REACTIVE.',
      'Under REF write: any value (incl. primitives), .value accessor, reassignable, destructure-safe, backed by a getter/setter object.',
      'Under REACTIVE write: objects only, no .value, mutate in place, destructure breaks (toRefs), backed by a Proxy.',
      'Draw an arrow showing a ref nested in a reactive object gets auto-unwrapped (except in arrays).',
      'Conclude with the rule: "primitives and reassignable values → ref; cohesive grouped state → reactive; both feed the same track/trigger engine."',
    ],
    diagram: `        REF                         REACTIVE
  ┌───────────────────┐        ┌───────────────────────┐
  │ any value         │        │ objects/arrays only   │
  │ .value (unwrapped │        │ no .value             │
  │   in template)    │        │ mutate in place       │
  │ reassignable      │        │ no reassign           │
  │ destructure-safe  │        │ destructure → toRefs  │
  │ accessor object   │        │ Proxy                 │
  └───────────────────┘        └───────────────────────┘
        \\______ same targetMap / track / trigger ______/`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'ref wraps ANY value (uses .value, auto-unwrapped in templates) and is reassignable and destructure-safe; reactive wraps only objects (no .value) but breaks on destructuring and reassignment. Both are deep and feed the same dependency engine. Rule of thumb: primitives and values you swap wholesale → ref; cohesive grouped state → reactive. A ref nested in a reactive object auto-unwraps (except inside arrays). Many teams just use ref everywhere for consistency.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'ref and reactive are Vue 3\'s two reactivity primitives, and the choice comes down to value type and ergonomics. ref wraps any value — including primitives like numbers and booleans — in a small object exposing a tracked .value accessor. You read and write count.value in script, but templates auto-unwrap it so you just write the name. Because the wrapper object survives, a ref is reassignable — you can set .value to a brand new object — and it is destructure-safe. reactive, by contrast, takes an object and returns a Proxy whose property reads and writes are tracked directly, so there is no .value and the ergonomics are cleaner for grouped state. The catch is that reactivity is tied to accessing properties on the proxy, so destructuring it copies primitives out and breaks tracking — you need toRefs — and you cannot reassign the variable, because existing references still hold the old proxy; you mutate in place or use Object.assign. A common misconception is that ref is shallow and reactive is deep — actually both are deep, because a ref holding an object internally calls reactive on it. Another subtlety is auto-unwrapping: a ref placed as a property of a reactive object is transparently unwrapped, but the same ref inside an array or Map is not. My practical rule is: primitives, single values, and anything reassignable go in refs; a cohesive group of related fields like a form goes in reactive; and at composable or store boundaries I expose refs, often via toRefs, so consumers can destructure safely. Underneath, both feed the exact same track/trigger dependency system, so the decision is about shape and safety, not raw performance.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Consistency vs ergonomics: ref-everywhere is uniform and destructure-safe but noisy with .value; reactive is cleaner to read but introduces destructure/reassign footguns.',
      'API surface: returning refs from composables is safe for consumers; returning a reactive bag is ergonomic internally but fragile externally.',
    ],
    edgeCases: [
      'Ref auto-unwrap applies to reactive object properties but NOT to refs inside arrays/Maps/Sets.',
      'ref of an object is deep-reactive via internal reactive(), so ref vs reactive depth is identical — a frequent misconception.',
      'reactive() unwraps top-level refs you assign as properties, which can hide that a value is a ref.',
      'storeToRefs (Pinia) exists precisely to destructure reactive store state without losing reactivity.',
    ],
    runtimeBehavior: [
      'Template compiler injects .value access for refs detected in the render scope; manual script access still needs .value.',
      'Both schedule effects through the same batched scheduler, so update timing is identical.',
      'Setting .value to an equal value (Object.is) is a no-op and does not trigger.',
    ],
    scalability: [
      'For large, frequently-replaced payloads prefer shallowRef to avoid deep proxy overhead; for large top-level-only state use shallowReactive.',
      'A consistent convention across a large codebase reduces onboarding and review cost more than micro-optimizing the choice.',
    ],
    productionConcerns: [
      'Most reactivity-loss incidents trace to destructuring reactive objects — enforce toRefs/storeToRefs in review.',
      'Mixed ref/reactive code creates unwrapping confusion; document the team convention.',
      'Serializing reactive proxies (JSON.stringify, structuredClone) may need toRaw; refs serialize fine after reading .value.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'ref: any value, .value, reassignable, destructure-safe, accessor object.',
    'reactive: objects only, no .value, mutate in place, destructure breaks, Proxy.',
    'Templates auto-unwrap refs; script needs .value.',
    'Both are DEEP (ref of object → reactive inside).',
    'Both use the same track/trigger engine — no perf winner.',
    'Rule: primitives + reassignable → ref; grouped cohesive state → reactive.',
    'Ref as a reactive property → auto-unwrapped.',
    'Ref inside array/Map/Set → NOT unwrapped.',
    'Fix reactive destructure with toRefs; Pinia uses storeToRefs.',
    'Update whole reactive object → Object.assign, never reassign.',
    'Many teams standardize on ref everywhere for consistency.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Declare a loading boolean and a filters object (q, page) using the appropriate primitive each. Explain your choice.',
      hint: 'Single value vs grouped object.',
      solution: {
        lang: 'js',
        code: 'import { ref, reactive } from \'vue\'\nconst loading = ref(false)               // primitive → ref\nconst filters = reactive({ q: \'\', page: 1 }) // grouped → reactive',
        explanation: [
          'loading is a single boolean, so ref is the natural choice.',
          'filters groups related fields you mutate individually, so reactive reads cleanly.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Fix this so name stays reactive after destructuring: const state = reactive({ name: \'A\' }); const { name } = state.',
      hint: 'toRefs.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs } from \'vue\'\nconst state = reactive({ name: \'A\' })\nconst { name } = toRefs(state)\n// name is a ref now: read name.value; stays in sync with state.name',
        explanation: [
          'Plain destructuring copies the string out, breaking tracking.',
          'toRefs gives a ref per property that proxies back to the reactive object.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Predict the logs: const c = ref(1); const s = reactive({ c }); s.c = 2; console.log(c.value, s.c); const arr = reactive([c]); console.log(arr[0]).',
      hint: 'Think about auto-unwrapping inside objects vs arrays.',
      solution: {
        lang: 'js',
        code: 'import { ref, reactive } from \'vue\'\nconst c = ref(1)\nconst s = reactive({ c })\ns.c = 2\nconsole.log(c.value, s.c) // 2 2  (ref auto-unwrapped in reactive object, writes through)\nconst arr = reactive([c])\nconsole.log(arr[0])       // the ref object (NOT unwrapped in arrays)\nconsole.log(arr[0].value) // 2',
        explanation: [
          'As a reactive object property, c is auto-unwrapped, so s.c reads/writes c.value.',
          'Inside an array, refs are not unwrapped, so arr[0] is the ref itself and needs .value.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You are writing a composable useToggle(). Decide its return shape so consumers can destructure without losing reactivity, and implement it.',
      hint: 'Return refs, not a reactive bag.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\n\nexport function useToggle(initial = false) {\n  const state = ref(initial)\n  const toggle = () => { state.value = !state.value }\n  const set = (v) => { state.value = v }\n  return { state, toggle, set } // refs/functions → destructure-safe\n}\n\n// consumer\n// const { state, toggle } = useToggle()  // stays reactive',
        explanation: [
          'Returning a ref (plus plain functions) means destructuring keeps reactivity.',
          'A reactive return object would break the moment the consumer destructured it.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is THE Vue 3 question. A clear, structured answer — value type, .value, reassign/destructure behavior, both-are-deep, same engine — instantly signals real Composition API experience and good API instincts.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is the difference between ref and reactive". Product companies (Zoho, Flipkart, Razorpay) ask when to use each and to debug a destructuring reactivity loss. FAANG-level interviews probe auto-unwrapping rules, depth misconceptions, and composable API design driven by these semantics.',
    whatInterviewersExpect:
      'A structured comparison across value type, syntax, reassignment, and destructuring; the correction that both are deep; awareness of auto-unwrapping; and a defensible convention with reasoning, ideally tied to composable/store design you have done.',
  },
}

export default refVsReactive
