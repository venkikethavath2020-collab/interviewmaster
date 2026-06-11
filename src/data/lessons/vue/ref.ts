import type { ConceptLesson } from '../../../types/lesson'

const ref: ConceptLesson = {
  // 1. Concept Summary
  slug: 'ref',
  name: 'ref',
  category: 'reactivity',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'ref is the most-used reactivity API in Vue 3 — it is how you make any value (especially primitives) reactive.',
    'Understanding the .value box (and when it auto-unwraps) prevents the single most common Vue 3 beginner bug.',
    'It is the building block of composables: composables return refs so consumers stay reactive.',
    'ref vs reactive is a guaranteed interview question; knowing when to use each shows real Vue 3 fluency.',
    'Template refs (a related use of ref) are how you access DOM elements and child components imperatively.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A ref is a labeled box: you keep the toy inside, and to play with it you open the box with .value.',
    story: [
      'Imagine you have a special box with a label "score". You cannot just hold the number 5 and have a magic alarm — numbers are slippery.',
      'So you put the 5 inside the box. The box is magic: whenever you change what is inside, it rings a bell so everyone watching knows.',
      'To see or change what is inside, you open the lid — that lid is called .value. You say box.value to peek, or box.value = 6 to swap the toy.',
      'A ref is that magic box. Putting a value in a box lets Vue notice when it changes, even for plain numbers and strings.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue, plain variables like let n = 0 are not watched — changing them does nothing to the screen.',
    'ref wraps a value in a small reactive container so Vue can detect when it changes.',
    'You read or change the inner value through .value in your code (for example n.value = 5).',
    'Inside templates you can usually drop the .value and just write the name, because Vue unwraps it for you.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'ref(value) creates a reactive reference: an object with a single .value property that holds the value. Reading and writing .value is tracked by the reactivity system, so any value — primitive or object — can be made reactive.',
    how: 'Call const count = ref(0). In <script> you access count.value to read/write. In templates, top-level refs are auto-unwrapped, so you write {{ count }} not {{ count.value }}. If a ref holds an object, ref deeply makes the inner object reactive too (via reactive internally).',
    why: 'Proxies cannot wrap primitives directly, so Vue needs a container (.value) to track primitive changes. ref gives one consistent, reassignable API for any value type and is the standard return shape for composables.',
    code: {
      label: 'Creating and using a ref',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\n\nconst count = ref(0)          // reactive container holding 0\nfunction inc() {\n  count.value++               // .value to read/write in script\n}\n</script>\n\n<template>\n  <!-- auto-unwrapped: no .value needed in template -->\n  <button @click="inc">{{ count }}</button>\n</template>',
      explanation: [
        'ref(0) returns a reactive box; the value lives in count.value.',
        'In script you must use count.value to read or change it.',
        'In the template, {{ count }} auto-unwraps to count.value.',
        'Clicking mutates count.value, which triggers the render to update.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'ref is a Vue reactivity API that wraps a value in a RefImpl object exposing a single reactive .value accessor. The getter calls track to register the active effect as a dependency and the setter calls trigger to re-run dependents on change. Because ES Proxies cannot intercept primitive values, ref provides the object wrapper needed to make primitives reactive; when given an object, ref converts it to a deep reactive proxy internally via reactive(). Refs are auto-unwrapped when used as top-level properties in templates and when nested inside reactive objects, but must be accessed via .value in plain JavaScript.',

  // 7. Internal Working
  internalWorking: [
    'ref(value) returns a RefImpl instance with a private _value and a public get/set value accessor (and a __v_isRef flag).',
    'If the initial value is an object, ref runs it through reactive() so the inner object is deeply reactive; primitives are stored directly.',
    'Reading .value calls trackRefValue, which records the currently-active effect in the ref\'s own dependency set (dep).',
    'Writing .value compares the new value (with hasChanged) and, if changed, updates _value and calls triggerRefValue to re-run dependent effects via the scheduler.',
    'In templates, the compiler/render context auto-unwraps top-level refs, so {{ count }} reads count.value without you writing it.',
    'When a ref is a property of a reactive() object, that object\'s proxy unwraps it automatically, so you access obj.count not obj.count.value.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   const count = ref(0)

        ┌──────────── RefImpl ────────────┐
        │  _value: 0                        │
        │  get value() -> track(); return _value
        │  set value(v) -> _value=v; trigger()
        └───────────────┬───────────────────┘
                        │
   script:  count.value (read/write)  ── track / trigger
   template:  {{ count }}  ── auto-unwrapped to count.value

   ref(obj) ──► _value = reactive(obj)   (deep proxy inside)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A ref is a heap object (RefImpl) holding _value and its own dependency Set of effects.',
    'For a primitive ref, _value stores the primitive directly; the box gives an identity Proxies cannot give a primitive.',
    'For an object ref, _value points to a separate reactive Proxy of that object, which has its own per-key dependency map.',
    'When the ref is unreachable and not referenced by any active effect, both the RefImpl and any inner reactive proxy become eligible for garbage collection.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — primitive ref',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst name = ref(\'Asha\')\nname.value = \'Ravi\' // reactive update\n</script>\n\n<template>\n  <p>{{ name }}</p>\n</template>',
      explanation: [
        'ref(\'Asha\') makes a string reactive via a .value box.',
        'Assigning name.value triggers the template to update.',
        'In the template, name auto-unwraps — no .value.',
      ],
    },
    intermediate: {
      label: 'Intermediate — object ref vs reassigning',
      lang: 'js',
      code: 'import { ref } from \'vue\'\nconst user = ref({ name: \'A\', age: 20 })\n\n// mutate a property (deep reactive inside)\nuser.value.age = 21        // reactive\n\n// replace the whole object\nuser.value = { name: \'B\', age: 30 } // also reactive\n\n// reassigning the variable itself is NOT possible reactively:\n// user = ref(...) // would replace the box, breaking watchers',
      explanation: [
        'ref of an object makes the inner object deeply reactive (via reactive()).',
        'You can mutate properties or replace the whole .value — both are tracked.',
        'Reassigning the ref variable (user = ...) replaces the box and breaks reactivity.',
        'Always go through .value, never reassign the const itself.',
      ],
    },
    advanced: {
      label: 'Advanced — template ref to a DOM element',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst inputEl = ref(null) // will hold the DOM node\n\nonMounted(() => {\n  inputEl.value?.focus()  // imperative DOM access after mount\n})\n</script>\n\n<template>\n  <input ref="inputEl" />\n</template>',
      explanation: [
        'A ref declared and bound via ref="inputEl" becomes a template ref.',
        'After mount, inputEl.value holds the real DOM element.',
        'This is the supported imperative escape hatch (focus, measure, integrate libs).',
        'The same name links the script ref to the template element.',
      ],
    },
    realProject: {
      label: 'Real project — a composable returning refs',
      lang: 'js',
      code: 'import { ref } from \'vue\'\n\nexport function useCounter(start = 0) {\n  const count = ref(start)\n  const inc = () => count.value++\n  const reset = () => { count.value = start }\n  return { count, inc, reset }\n}\n\n// component:\n// const { count, inc } = useCounter(10)\n// template uses {{ count }} (auto-unwrapped)',
      explanation: [
        'Composables return refs so consumers reactively track the state.',
        'Returning a ref (not a raw value) preserves reactivity across the function boundary.',
        'Destructuring the returned refs keeps reactivity (refs survive destructuring, unlike reactive()).',
        'This is the canonical reuse pattern in Vue 3 codebases.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is ref in Vue 3?',
      answer: 'ref(value) creates a reactive reference — an object with a .value property holding the value — so any value, including primitives, can be made reactive. You access it via .value in script and it auto-unwraps in templates.',
      explanation: 'Mention the .value box and primitive support up front.',
    },
    {
      level: 'beginner',
      question: 'Why do refs need .value but reactive objects do not?',
      answer: 'reactive uses a Proxy, which can intercept property access on objects directly. Proxies cannot wrap primitives, so ref provides an object wrapper with a single .value property whose get/set are tracked — hence you must use .value for refs.',
      explanation: 'The Proxy-can\'t-wrap-primitives reason is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'When should you use ref vs reactive?',
      answer: 'Use ref for primitives and for any value you may reassign wholesale, and as the return type from composables (it survives destructuring). Use reactive for objects you mutate property-by-property. Many teams prefer ref everywhere for consistency since it handles both cases.',
      explanation: 'A practical rule plus the "ref survives destructuring" point is what interviewers want.',
    },
    {
      level: 'intermediate',
      question: 'What happens when you pass an object to ref?',
      answer: 'ref converts the inner object to a deep reactive proxy via reactive(), so mutating nested properties through .value is reactive. You can also replace the whole .value with a new object and it stays reactive.',
      explanation: 'Showing you know ref(obj) delegates to reactive internally is a depth signal.',
    },
    {
      level: 'advanced',
      question: 'What is a template ref and how does it differ from a data ref?',
      answer: 'A template ref is a ref bound to an element/component via ref="name"; after mount, its .value holds the DOM node or component instance for imperative access. It uses the same ref() object but Vue populates .value during mounting rather than you setting it.',
      explanation: 'Distinguishing data refs (state) from template refs (DOM access) shows complete understanding.',
    },
    {
      level: 'senior',
      question: 'How does ref auto-unwrapping work and where does it NOT happen?',
      answer: 'Refs auto-unwrap as top-level properties in templates and when nested inside a reactive() object. They do NOT auto-unwrap inside plain (non-reactive) objects, inside arrays accessed in templates by index, or in plain JavaScript — there you need .value. Knowing these boundaries prevents subtle bugs.',
      explanation: 'Listing exactly where unwrapping applies and fails is a precise senior-level answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between ref and reactive?',
    'Why does destructuring a reactive object lose reactivity but destructuring refs does not?',
    'How do template refs work with v-for or child components?',
    'What is shallowRef and when would you use it?',
    'How do toRef and toRefs relate to ref?',
    'Does ref deeply track nested objects, and how do you avoid that?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting .value when reading/writing a ref in script.',
      why: 'The ref is an object; using it directly returns the RefImpl, not the value.',
      fix: 'Always use myRef.value in <script>; rely on auto-unwrap only in templates.',
    },
    {
      mistake: 'Reassigning the ref variable (count = ref(1)) instead of count.value = 1.',
      why: 'It replaces the reactive box, so existing watchers/dependencies point at the old ref.',
      fix: 'Mutate through .value; never reassign the const holding the ref.',
    },
    {
      mistake: 'Expecting a ref to auto-unwrap inside a plain object or array in the template.',
      why: 'Auto-unwrap only applies to top-level template refs and refs nested in reactive() objects.',
      fix: 'Access .value explicitly in those cases, or wrap the container in reactive().',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'ref is the default way to declare reactive state in <script setup> components.' },
    { area: 'Composables', detail: 'Composables return refs so destructured state stays reactive in consuming components.' },
    { area: 'Template refs', detail: 'Used to focus inputs, measure elements, control media, or integrate non-Vue libraries imperatively.' },
    { area: 'Pinia', detail: 'Setup-style Pinia stores declare state as refs, which Pinia exposes as reactive store properties.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A primitive ref is lightweight — a single object with one dependency set.',
      'Refs survive destructuring, avoiding toRefs overhead and accidental reactivity loss.',
    ],
    bad: [
      'ref of a large object creates a deep reactive proxy, adding tracking overhead per nested access.',
      'Excessive fine-grained refs for tightly-coupled state can add bookkeeping vs one reactive object.',
    ],
    optimizations: [
      'Use shallowRef for large objects/immutable data you replace wholesale (e.g. API responses).',
      'Use markRaw or shallowRef to skip deep reactivity where it is unnecessary.',
      'Group closely-related primitives into a reactive object when it reduces ref churn.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'what-is-vue'],
    nextConcepts: ['reactive', 'ref-vs-reactive', 'computed', 'toref-torefs', 'shallowref-shallowreactive'],
    dependencyNote:
      'ref is the primary reactive primitive built on reactivity fundamentals. It pairs with reactive (compared in ref-vs-reactive) and leads into computed, toRef/toRefs, and the shallow variants.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labelled "ref" with the value inside and a lid labelled ".value".',
      'Show get value() → track, set value() → trigger on the lid.',
      'Note "script uses .value; template auto-unwraps".',
      'For ref(object), draw the inner value as a reactive() proxy.',
      'Say: "Proxies can\'t wrap primitives, so ref gives a .value box that track/trigger hook into."',
    ],
    diagram: `  ref(0):  [ .value = 0 ]
              ▲ get -> track   ▼ set -> trigger
   script:  count.value      template: {{ count }} (unwrapped)

  ref(obj): [ .value = reactive(obj) ] (deep proxy inside)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'ref(value) creates a reactive container with a .value property; reading .value tracks dependencies and writing it triggers updates. Because Proxies cannot wrap primitives, ref is how you make primitives (and any value) reactive. In script you use .value; in templates top-level refs auto-unwrap so you write {{ count }}. ref of an object becomes deeply reactive via reactive() internally. Key rules: never reassign the ref variable (mutate .value), and remember refs survive destructuring — which is why composables return refs.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'ref is the most-used reactivity primitive in Vue 3. Calling ref(value) returns a reactive reference — an object with a single .value property that holds the value. The whole point is that reading and writing .value is tracked by the reactivity system: the getter calls track to register whatever effect is running as a dependency, and the setter calls trigger to re-run those dependents when the value actually changes. The reason ref exists alongside reactive comes down to how Vue 3 reactivity works: reactive uses an ES Proxy, and a Proxy can intercept property access on an object but cannot wrap a primitive like a number or string. So to make a primitive reactive, Vue needs a container, and that container is the .value box. In practice you write const count = ref(0), and in script you read and write count.value, while in templates top-level refs are auto-unwrapped, so you just write {{ count }}. If you pass an object to ref, it converts the inner object into a deep reactive proxy via reactive, so mutating nested properties through .value is reactive, and you can also replace the whole .value with a new object. There are a few important rules. First, always go through .value and never reassign the variable itself — doing count = ref(1) replaces the box and detaches existing dependencies. Second, refs survive destructuring, unlike reactive objects, which is exactly why composables return refs: you can destructure the returned object and each piece stays reactive. There is also a second use of ref — template refs. When you bind ref="inputEl" on an element and declare a matching ref in script, Vue fills its .value with the DOM node after mount, giving you the supported imperative escape hatch for things like focusing an input or measuring layout. For large objects you do not want deeply tracked, shallowRef avoids the deep proxy.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'ref gives a uniform, reassignable, destructure-safe API but adds the .value ceremony in script.',
      'ref of objects is convenient but deep reactivity can be costly; shallowRef trades fine-grained tracking for speed.',
    ],
    edgeCases: [
      'Auto-unwrapping does not apply inside plain objects/arrays or in raw JS — .value is required there.',
      'Reassigning the ref binding breaks watchers tracking the old ref instance.',
      'A ref holding a reactive object: comparing identities can surprise you because .value is a proxy, not the original.',
    ],
    runtimeBehavior: [
      'RefImpl stores _value and its own dep Set; get triggers trackRefValue, set uses hasChanged then triggerRefValue.',
      'ref(object) delegates to reactive() for the inner value, so it shares the per-key dependency machinery.',
      'Template compilation unwraps top-level refs; reactive() objects unwrap nested refs on access.',
    ],
    scalability: [
      'For large API payloads, shallowRef + manual replacement avoids deep proxy overhead at scale.',
      'Returning refs from composables keeps reactive sharing clean across many components without toRefs boilerplate.',
    ],
    productionConcerns: [
      'Lint for missing .value in script (common bug) and accidental ref reassignment.',
      'Choose shallowRef/markRaw deliberately for performance-sensitive or non-reactive data.',
      'For template refs in loops/components, use the array/function ref form and clean up on unmount.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'ref(value) → reactive box with .value.',
    'Read/write .value in script; templates auto-unwrap top-level refs.',
    'ref works for primitives (Proxy can\'t wrap primitives) AND objects.',
    'ref(object) → inner value is deep reactive (via reactive()).',
    'Mutate via .value; NEVER reassign the ref variable.',
    'Refs survive destructuring → composables return refs.',
    'Template ref: ref="el" binds .value to the DOM node after mount.',
    'No auto-unwrap inside plain objects/arrays or raw JS.',
    'shallowRef = no deep tracking; replace .value wholesale.',
    'Nested in reactive() objects, refs auto-unwrap (obj.count not obj.count.value).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a ref holding a boolean and a function that toggles it.',
      hint: 'Use .value in the toggle.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nconst open = ref(false)\nfunction toggle() { open.value = !open.value }',
        explanation: ['open is a reactive boolean box.', 'toggle flips open.value, triggering dependents.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate that mutating a property and replacing the whole object are both reactive for an object ref.',
      hint: 'Use user.value.x and user.value = {...}.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nconst user = ref({ name: \'A\', age: 20 })\nuser.value.age = 21              // reactive (deep)\nuser.value = { name: \'B\', age: 30 } // reactive (replace box contents)',
        explanation: ['ref(obj) makes the inner object deep reactive.', 'Both property mutation and full replacement through .value are tracked.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Use a template ref to focus an input on mount.',
      hint: 'Declare a ref, bind ref="...", focus in onMounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst inputEl = ref(null)\nonMounted(() => inputEl.value?.focus())\n</script>\n\n<template>\n  <input ref="inputEl" />\n</template>',
        explanation: ['The template ref name matches the script ref.', 'Vue sets inputEl.value to the DOM node after mount, enabling .focus().'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a composable useToggle that returns a ref and a toggle function, and explain why it returns a ref.',
      hint: 'Refs survive destructuring across the function boundary.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const state = ref(initial)\n  const toggle = () => { state.value = !state.value }\n  return { state, toggle }\n}\n// const { state, toggle } = useToggle()  // state stays reactive',
        explanation: [
          'The composable returns a ref so the consumer can destructure it.',
          'Refs survive destructuring (unlike reactive()), preserving reactivity.',
          'This is exactly why returning refs is the standard composable shape.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'ref is the API you reach for constantly in Vue 3. Mastering the .value box, auto-unwrapping rules, and ref-vs-reactive choice marks you as fluent in modern Vue and prevents the most common beginner bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is ref / why .value". Product companies (Zoho, Flipkart, Razorpay) probe ref vs reactive and composable patterns. FAANG-level interviews dig into auto-unwrap boundaries, RefImpl internals, and shallowRef performance trade-offs.',
    whatInterviewersExpect:
      'They expect the .value reactive container, the Proxy-can\'t-wrap-primitives reason, auto-unwrap in templates, the "never reassign / refs survive destructuring" rules, and template refs as the DOM escape hatch.',
  },
}

export default ref
