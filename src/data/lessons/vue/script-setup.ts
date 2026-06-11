import type { ConceptLesson } from '../../../types/lesson'

const scriptSetup: ConceptLesson = {
  // 1. Concept Summary
  slug: 'script-setup',
  name: '<script setup>',
  category: 'composition-api',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    '<script setup> is the de-facto standard way to write Vue 3 components — terser, faster, and with the best TypeScript inference.',
    'It removes the boilerplate of setup(): no explicit return, no manual component registration — top-level bindings are auto-exposed to the template.',
    'Compiler macros (defineProps, defineEmits, defineModel, defineExpose) give type-safe component contracts you cannot express as cleanly elsewhere.',
    'It compiles to a more optimized render function than the equivalent options object, improving runtime performance.',
    'Almost every modern Vue codebase, tutorial, and library uses it — being fluent is expected in interviews and on the job.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: '<script setup> is like a magic notebook where everything you write on the page is automatically shared with your friend — you do not have to hand it over.',
    story: [
      'Imagine a notebook where, the moment you write a word on the page, your friend across the room can instantly read it.',
      'You do not need to walk over and pass the notebook — sharing happens by itself.',
      'You just write your notes normally, and your friend always sees the latest version.',
      'A <script setup> block works the same way: whatever you create at the top level is automatically available to the template, with no extra step to share it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    '<script setup> is a special way to write the script part of a single-file component.',
    'Everything you declare at the top level — variables, functions, imported components — is automatically usable in the template, without returning anything.',
    'You declare a component\'s inputs (props) and outputs (events) using compiler macros like defineProps and defineEmits.',
    'It is just a shorthand: the Vue compiler turns it into the normal setup() function behind the scenes, but with less typing for you.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: '<script setup> is compile-time syntactic sugar for the Composition API. Code in a <script setup> block runs as the component\'s setup() function, and all top-level bindings (variables, functions, imported components) are automatically exposed to the template.',
    how: 'The Vue compiler transforms the block into a setup() that returns those top-level bindings. Compiler macros — defineProps, defineEmits, defineModel, defineExpose, withDefaults — declare props/emits/model and the public API without imports, and are erased at compile time.',
    why: 'It eliminates the manual return statement and component-registration boilerplate, improves TypeScript inference for props/emits, and produces more optimized output than a plain options object.',
    code: {
      label: 'A counter in <script setup>',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst count = ref(0)\nconst doubled = computed(() => count.value * 2)\nfunction increment() { count.value++ }\n</script>\n\n<template>\n  <button @click="increment">{{ count }} (x2 = {{ doubled }})</button>\n</template>',
      explanation: [
        'count, doubled, and increment are top-level — automatically available in the template.',
        'No return statement and no setup() wrapper are written.',
        'Refs are auto-unwrapped in the template (count, not count.value).',
        'This compiles to a setup() that returns these bindings.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    '<script setup> is a compile-time-only syntax that designates an SFC\'s script as the body of its setup() function. The compiler hoists imports, collects top-level bindings, and synthesizes a setup() that exposes them as the render context, so the template can reference them directly (with automatic ref unwrapping). Component imports are auto-registered. Compiler macros — defineProps, defineEmits, defineModel, defineExpose, withDefaults — are compiled away into the equivalent props/emits options, the model wiring, and expose calls; they require no import and exist only at compile time. The result is a fully typed, more optimized component definition with no manual return.',

  // 7. Internal Working
  internalWorking: [
    'The SFC compiler parses the <script setup> block and identifies all top-level declarations (const/let/function/class) and imports.',
    'It wraps the block in a generated setup() function and produces a render context that includes those top-level bindings, so the compiled template resolves identifiers against them.',
    'Compiler macros are detected and erased: defineProps becomes the component\'s props option, defineEmits the emits option, defineModel generates a prop + update event + a writable ref, and defineExpose generates an expose() call. None survive into runtime as function calls.',
    'Imported components are auto-registered for the template by name, removing the need for a components option.',
    'Template compilation can use the static binding information from <script setup> to apply optimizations (e.g. knowing which bindings are refs vs constants), generating a tighter render function.',
    'At runtime the generated setup() executes exactly like a hand-written one: currentInstance is set, reactivity/hook registration happens, and the exposed bindings drive rendering.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   <script setup>                       compiler                runtime
   ┌──────────────────────┐                                  ┌─────────────────┐
   │ import Child from ... │ ── auto-register ──────────────► │ components: {…} │
   │ const x = ref(0)      │ ── collect top-level ──┐         │ setup() {        │
   │ function f() {…}       │                        ├──────►  │   …              │
   │ defineProps<{…}>()    │ ── erase → props opt ───┤         │   return { x, f }│
   │ defineEmits<{…}>()    │ ── erase → emits opt ───┘         │ }                │
   └──────────────────────┘                                  └─────────────────┘
        no return written            macros vanish           behaves like setup()`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — auto-exposed bindings & component import',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport ChildCard from \'./ChildCard.vue\'\nimport { ref } from \'vue\'\nconst open = ref(false)\n</script>\n\n<template>\n  <button @click="open = !open">Toggle</button>\n  <ChildCard v-if="open" />\n</template>',
      explanation: [
        'ChildCard is auto-registered just by importing it — no components option.',
        'open is a top-level ref, usable in the template directly.',
        'No setup() wrapper and no return needed.',
        'This is the everyday shape of modern Vue 3 components.',
      ],
    },
    intermediate: {
      label: 'Intermediate — typed props & emits with macros',
      lang: 'vue',
      code: '<script setup lang="ts">\nconst props = withDefaults(defineProps<{\n  title: string\n  count?: number\n}>(), { count: 0 })\n\nconst emit = defineEmits<{\n  increment: [by: number]\n  close: []\n}>()\n</script>\n\n<template>\n  <h2>{{ title }} — {{ count }}</h2>\n  <button @click="emit(\'increment\', 1)">+1</button>\n  <button @click="emit(\'close\')">x</button>\n</template>',
      explanation: [
        'defineProps with a type argument gives fully typed props — no runtime import.',
        'withDefaults supplies defaults for optional props.',
        'defineEmits with a type literal types each event\'s payload.',
        'Both macros are erased at compile time into props/emits options.',
      ],
    },
    advanced: {
      label: 'Advanced — defineModel and defineExpose',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\n// two-way binding without manual prop+emit\nconst model = defineModel<string>()\nconst internal = ref(0)\n// expose a deliberate public API to parent template refs\ndefineExpose({ reset: () => (internal.value = 0) })\n</script>\n\n<template>\n  <input :value="model" @input="model = ($event.target as HTMLInputElement).value" />\n</template>',
      explanation: [
        'defineModel creates a writable ref wired to modelValue + update:modelValue.',
        'Assigning model.value emits the update automatically — clean v-model support.',
        'defineExpose defines what a parent ref can call (default exposes nothing).',
        'These macros encode component contracts that would be verbose in plain setup().',
      ],
    },
    realProject: {
      label: 'Real project — feature component using a composable',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { onMounted } from \'vue\'\nimport { useProducts } from \'@/composables/useProducts\'\n\nconst props = defineProps<{ category: string }>()\nconst { products, loading, error, load } = useProducts()\n\nonMounted(() => load(props.category))\n</script>\n\n<template>\n  <p v-if="loading">Loading…</p>\n  <p v-else-if="error">{{ error.message }}</p>\n  <ul v-else>\n    <li v-for="p in products" :key="p.id">{{ p.name }}</li>\n  </ul>\n</template>',
      explanation: [
        'Props are typed via defineProps and used directly in onMounted.',
        'A composable supplies reactive state and a load action — clean separation.',
        'No return statement; products/loading/error are auto-exposed.',
        'This is the canonical structure of a real list/feature component.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is <script setup> and what is its main benefit?',
      answer: 'It is compile-time sugar that runs the script block as the component\'s setup() and auto-exposes all top-level bindings to the template, removing the manual return and component-registration boilerplate.',
      explanation: 'A good answer names the auto-exposure and the boilerplate it removes, plus the better type inference.',
    },
    {
      level: 'beginner',
      question: 'How do you declare props and emits in <script setup>?',
      answer: 'With the compiler macros defineProps and defineEmits, which need no import and are erased at compile time; with TypeScript you pass type arguments for full typing.',
      explanation: 'Tests familiarity with the core macros and that they are compile-time only.',
    },
    {
      level: 'intermediate',
      question: 'How do you set default values for props in <script setup> with TypeScript?',
      answer: 'Wrap defineProps in withDefaults, e.g. withDefaults(defineProps<{ count?: number }>(), { count: 0 }).',
      explanation: 'A common practical detail; reactive-props-destructure defaults are an alternative in newer versions.',
    },
    {
      level: 'intermediate',
      question: 'How are imported components used in a <script setup> template?',
      answer: 'Simply importing them auto-registers them for the template — no components option is required.',
      explanation: 'Distinguishes <script setup> ergonomics from the Options API.',
    },
    {
      level: 'advanced',
      question: 'What does defineExpose do, and why is it needed?',
      answer: 'By default a <script setup> component exposes nothing to parent template refs (its bindings are private). defineExpose declares the explicit public API a parent can access via a ref.',
      explanation: 'Senior signal: knowing the privacy default and the deliberate-expose contract.',
    },
    {
      level: 'senior',
      question: 'How does <script setup> relate to setup(), and what are its compile-time advantages?',
      answer: 'It compiles into a setup() function: top-level bindings become the return/render context and macros become props/emits/expose options. Because the compiler knows binding kinds statically, it can generate a more optimized render function and erase macros entirely, yielding less boilerplate, better TS inference, and faster output than a plain options object.',
      explanation: 'Connecting the sugar to the generated setup() and citing concrete compile-time wins is the strong answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you define a component name or inheritAttrs with <script setup>? (defineOptions)',
    'What is defineModel and how does it simplify v-model? ',
    'Can you use top-level await in <script setup>? (yes, with Suspense)',
    'Why are <script setup> bindings private to the parent by default?',
    'How do useSlots()/useAttrs() replace context.slots/attrs here?',
    'Can you mix a normal <script> with <script setup> in one SFC, and why would you?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Trying to import defineProps/defineEmits from vue.',
      why: 'They are compiler macros, not runtime functions, and are available globally inside <script setup>.',
      fix: 'Use them without importing; the compiler erases them.',
    },
    {
      mistake: 'Expecting a parent ref to access internal bindings.',
      why: '<script setup> exposes nothing by default; internals are private.',
      fix: 'Use defineExpose({ ... }) to publish the intended public API.',
    },
    {
      mistake: 'Destructuring defineProps result and losing reactivity (in versions without reactive props destructure).',
      why: 'Pulling values out of the props proxy reads plain values.',
      fix: 'Keep the props object (const props = defineProps(...)) and read props.x, or use toRefs.',
    },
    {
      mistake: 'Setting component name/inheritAttrs via export default options alongside <script setup>.',
      why: 'You cannot export an options object from a pure <script setup> block.',
      fix: 'Use defineOptions({ name, inheritAttrs }) inside <script setup>, or a separate normal <script>.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'The default authoring style for SFCs in new Vue 3 projects — refs, computed, watchers, and composables all live in the <script setup> block.' },
    { area: 'Component library', detail: 'Libraries use defineProps/defineEmits/defineExpose to publish typed, stable component contracts and a deliberate public API.' },
    { area: 'Nuxt', detail: 'Nuxt pages/components use <script setup> with top-level await (Suspense) for data fetching and auto-imported composables.' },
    { area: 'TypeScript', detail: 'Type-based defineProps/defineEmits give end-to-end prop/event typing in templates and parents, central to large typed codebases.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Compiles to a more optimized render function than an equivalent options object.',
      'Static binding analysis lets the compiler skip work for constants and known refs.',
    ],
    bad: [
      'Heavy synchronous logic at the top level delays first render, same as setup().',
      'Top-level await turns the component async (Suspense), which can defer rendering if misused.',
    ],
    optimizations: [
      'Defer expensive initialization to onMounted or user interaction.',
      'Extract reusable logic into composables so it is tree-shaken when unused.',
      'Use shallowRef/shallowReactive for large external objects to limit tracking overhead.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle beyond shared v-html caution)

  // 17. Related Concepts
  related: {
    prerequisites: ['setup-function', 'ref', 'reactive'],
    nextConcepts: ['composables', 'props', 'v-model-components'],
    dependencyNote:
      '<script setup> is sugar over setup(), so understanding setup() (timing, props/context) clarifies what the compiler generates. From here you compose with composables and use the macros to define props, emits, and v-model contracts.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a <script setup> block with an import, a ref, and a function.',
      'Draw arrows from each top-level binding into the template labelled "auto-exposed".',
      'Add defineProps/defineEmits and label them "compiler macros, erased at build".',
      'Show the compiler transforming the block into setup() { ... return {...} }.',
      'Say: "It is just setup() with no return and auto-registered components, plus typed macros."',
    ],
    diagram: `  <script setup>                  compiles to
  ─────────────                  ─────────────
  import Child                   components: { Child }
  const x = ref()         ─────► setup() {
  function f() {}                  const x = ref(); function f(){}
  defineProps<P>()                 // props option = P
  defineEmits<E>()                 // emits option = E
                                   return { x, f }
                                 }`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '<script setup> is compile-time sugar over setup(): all top-level bindings auto-expose to the template, imported components auto-register, and you write no return. Props, emits, v-model, and the public API are declared with compiler macros — defineProps, defineEmits, defineModel, defineExpose, withDefaults — which need no import and are erased at build. It gives the best TypeScript inference and compiles to a more optimized render function. It is the modern default for writing Vue 3 components.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    '<script setup> is the modern, default way to author Vue 3 single-file components, and it is purely a compile-time feature. The Vue compiler takes the contents of the <script setup> block and uses it as the body of the component\'s setup() function. The big ergonomic win is that every top-level binding — variables, functions, even imported components — is automatically exposed to the template, so you never write an explicit return and you never register components in a components option; importing them is enough. Refs are still auto-unwrapped in the template, so you write count, not count.value. To declare a component\'s contract you use compiler macros: defineProps for inputs, defineEmits for outputs, withDefaults for prop defaults, defineModel for two-way binding, and defineExpose for the public API. These are not runtime functions — you do not import them — they are detected and erased by the compiler, which turns them into the normal props, emits, and expose configuration. With TypeScript you pass type arguments, like defineProps<{ title: string }>(), which gives end-to-end typing of props and events all the way into the template and the parent. One subtlety worth mentioning: a <script setup> component exposes nothing to a parent template ref by default — its bindings are private — so if a parent needs to call a method on it, you must publish it with defineExpose. Compared to a plain options object, <script setup> also produces a more optimized render function because the compiler knows statically which bindings are constants versus refs. You can also use top-level await for async data with Suspense, and defineOptions for things like the component name or inheritAttrs. In short, it is setup() with less boilerplate, better types, and faster output, which is why essentially every new Vue 3 codebase uses it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      '<script setup> terseness vs explicit setup() control: you lose the ability to return a render function or conditionally expose bindings the way explicit setup() allows.',
      'Type-based vs runtime props: type-based defineProps gives the best inference but needs withDefaults/macros for defaults and runtime validation, which differ from object-syntax props.',
    ],
    edgeCases: [
      'Default privacy: parent refs see nothing unless defineExpose is used.',
      'Macros are compile-time only — using them dynamically or outside the top level fails.',
      'Top-level await makes the component async and requires Suspense.',
      'Mixing a normal <script> with <script setup> is allowed for code that must run once at module scope or to export extra things.',
    ],
    runtimeBehavior: [
      'The generated setup() behaves identically to a hand-written one: currentInstance set, hooks/watchers registered, bindings exposed.',
      'defineModel synthesizes a prop + update event + writable ref so v-model "just works".',
      'Compiler optimizations rely on static analysis of binding kinds in the block.',
    ],
    scalability: [
      'Combined with composables, <script setup> keeps large feature components small and logic shareable.',
      'Typed macros scale type safety across hundreds of components and their parents without manual interfaces in each consumer.',
    ],
    productionConcerns: [
      'Be deliberate with defineExpose to keep a stable public API for library components.',
      'Audit top-level await usage so unexpected Suspense boundaries do not stall rendering.',
      'During migration, avoid mixing Options-style this with Composition code in the same file.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '<script setup> = compile-time sugar; block body becomes setup().',
    'Top-level bindings auto-expose to the template (no return).',
    'Imported components auto-register (no components option).',
    'Macros (no import, erased at build): defineProps, defineEmits, defineModel, defineExpose, withDefaults, defineOptions.',
    'Type-based props: defineProps<{...}>() + withDefaults for defaults.',
    'Typed events: defineEmits<{ evt: [payload] }>().',
    'defineModel → writable ref wired to v-model.',
    'Component is PRIVATE to parent refs unless defineExpose is used.',
    'Top-level await allowed (needs Suspense).',
    'Compiles to a more optimized render fn than an options object.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a <script setup> component with a toggle ref and a button that flips it, plus a child component imported and shown conditionally.',
      hint: 'Just import the child and declare a ref at the top level.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport Panel from \'./Panel.vue\'\nimport { ref } from \'vue\'\nconst open = ref(false)\n</script>\n\n<template>\n  <button @click="open = !open">Toggle</button>\n  <Panel v-if="open" />\n</template>',
        explanation: ['Panel auto-registers via import.', 'open is auto-exposed with no return.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Declare typed props (label: string, disabled?: boolean defaulting to false) and a typed "submit" emit.',
      hint: 'Use withDefaults(defineProps<...>()) and defineEmits<...>().',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nwithDefaults(defineProps<{ label: string; disabled?: boolean }>(), {\n  disabled: false,\n})\nconst emit = defineEmits<{ submit: [] }>()\n</script>\n\n<template>\n  <button :disabled="disabled" @click="emit(\'submit\')">{{ label }}</button>\n</template>',
        explanation: ['Type-based props with a default via withDefaults.', 'submit is a typed, payload-less event.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a TextField with v-model support using defineModel, and expose a focus() method to the parent.',
      hint: 'defineModel<string>() for binding; defineExpose for the method.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst model = defineModel<string>()\nconst input = ref<HTMLInputElement | null>(null)\ndefineExpose({ focus: () => input.value?.focus() })\n</script>\n\n<template>\n  <input ref="input" :value="model" @input="model = ($event.target as HTMLInputElement).value" />\n</template>',
        explanation: [
          'defineModel wires modelValue/update:modelValue so v-model works on the parent.',
          'defineExpose publishes focus() for a parent template ref.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why "import { defineProps } from \'vue\'" is wrong and why a parent ref cannot call a <script setup> child\'s internal method by default.',
      hint: 'Macros are compile-time; bindings are private without defineExpose.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\n// WRONG: defineProps is a compiler macro, do NOT import it\n// import { defineProps } from \'vue\'  ❌\nconst props = defineProps<{ id: number }>() // ✅ available globally\n\nfunction secret() {/* private by default */}\n// Parent ref sees NOTHING unless we expose:\ndefineExpose({ /* secret stays private unless listed here */ })\n</script>',
        explanation: [
          'Macros are erased at compile time and are globally available — importing them is an error/no-op.',
          'Top-level bindings are private to parent refs; only defineExpose-listed members are accessible.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      '<script setup> is the language you will actually write Vue 3 in every day. Mastering its macros and the auto-expose/privacy rules makes you immediately productive and credible in any modern Vue interview or codebase.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is <script setup> and how is it different from setup()". Product companies (Zoho, Flipkart, Razorpay) ask you to type props/emits, implement v-model with defineModel, and explain defineExpose. FAANG-level interviews probe the compile-time nature of macros, default privacy, top-level await/Suspense, and the generated render-function optimizations.',
    whatInterviewersExpect:
      'Explain it as sugar over setup(), demonstrate auto-exposed bindings and auto-registered components, use the macros correctly (no imports), know the parent-privacy default and defineExpose, and articulate the TypeScript and performance benefits.',
  },
}

export default scriptSetup
