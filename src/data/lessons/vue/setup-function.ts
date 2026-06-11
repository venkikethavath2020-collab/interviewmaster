import type { ConceptLesson } from '../../../types/lesson'

const setupFunction: ConceptLesson = {
  // 1. Concept Summary
  slug: 'setup-function',
  name: 'setup() Function',
  category: 'composition-api',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'setup() is the entry point of the Composition API — it is where refs, computed, watchers, lifecycle hooks, and composables all live.',
    'It runs before the component is created, replacing the Options API\'s data/methods/computed with a single function you fully control.',
    'Understanding setup() explains how <script setup> works under the hood, since <script setup> is compiler sugar over it.',
    'It is where the famous "this is undefined" rule comes from — setup() has no component instance via this, which trips up Options-API developers.',
    'Knowing its arguments (props, context) and what it must return is a frequent intermediate interview checkpoint.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'setup() is like setting up your desk before class starts — you lay out everything you will need before the lesson begins.',
    story: [
      'Before school starts in the morning, you arrange your desk: pencils here, notebook there, eraser ready.',
      'You do all of this BEFORE the teacher walks in and the lesson actually begins.',
      'Once everything is laid out, you simply use the things you prepared during the whole class.',
      'A component does the same: setup() runs first to lay out all the data and tools, and then the component uses them while it is on the screen.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'setup() is a special function on a Vue component that runs once, very early, before the component is fully created.',
    'Inside it you create your reactive data (with ref/reactive), your computed values, your watchers, and you register lifecycle hooks.',
    'Whatever you want the template to use, you return from setup() as an object.',
    'Because it runs before the instance exists, you cannot use `this` inside setup() — instead Vue gives you the props and a context object as arguments.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'setup() is the Composition API entry-point function. It runs once during component creation, before any lifecycle hook, and is where you declare reactive state and logic. Whatever it returns is exposed to the template.',
    how: 'It receives two arguments: props (reactive) and context ({ attrs, slots, emit, expose }). You create state with ref/reactive, derive values with computed, react with watch, and register lifecycle hooks like onMounted — then return what the template needs. It has no `this`.',
    why: 'It centralizes a component\'s logic in plain functions you can extract into composables, instead of splitting it across the Options API\'s data/methods/computed buckets.',
    code: {
      label: 'A counter using setup()',
      lang: 'vue',
      code: '<script lang="ts">\nimport { ref, computed, onMounted } from \'vue\'\nexport default {\n  setup() {\n    const count = ref(0)\n    const doubled = computed(() => count.value * 2)\n    function increment() { count.value++ }\n    onMounted(() => console.log(\'mounted\'))\n    return { count, doubled, increment } // exposed to template\n  },\n}\n</script>\n\n<template>\n  <button @click="increment">{{ count }} (x2 = {{ doubled }})</button>\n</template>',
      explanation: [
        'count, doubled, and increment are created inside setup().',
        'The returned object is what the template can access.',
        'onMounted is registered inside setup(), not as a separate option.',
        'No `this` is used anywhere — everything is closed over locally.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'setup() is the Composition API entry hook invoked once per component instance after props are resolved but before the instance proper (beforeCreate/created equivalent) and before any other lifecycle hook. It receives (props, context) where props is a reactive, read-only proxy and context = { attrs, slots, emit, expose }. Inside it you create reactive primitives (ref/reactive), derived state (computed), side effects (watch/watchEffect), and register lifecycle hooks (onMounted, etc.) that are bound to the current instance via internal currentInstance tracking. setup() has no `this`. Its return value — an object of state/methods, or a render function — becomes the component\'s render context exposed to the template.',

  // 7. Internal Working
  internalWorking: [
    'During component creation Vue resolves and normalizes props into a reactive shallow-readonly proxy, then sets the internal currentInstance pointer to this component.',
    'Vue calls setup(props, context). Because currentInstance is set, calls to onMounted/watch/inject inside setup() can register against the correct instance — this is why those APIs only work synchronously inside setup().',
    'Reactive objects you create (ref/reactive) set up dependency tracking via Proxy traps; computed creates a lazy effect; watch creates an eager/lazy effect with a scheduler.',
    'If setup() returns an object, Vue proxies it as the render context (setupState); template identifiers resolve against it, automatically unwrapping top-level refs.',
    'If setup() returns a function, Vue treats it as the render function for that component (useful for programmatic/JSX rendering).',
    'After setup() completes, Vue clears currentInstance and proceeds to compile/run the render, then mounts — firing the lifecycle hooks that setup() registered.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   props resolved ──► currentInstance = this component
                            │
                            ▼
                  setup(props, context)
                  ┌───────────────────────────┐
                  │ const x = ref(0)           │  create reactive state
                  │ const y = computed(...)    │  derive
                  │ watch(...), onMounted(...) │  register effects/hooks
                  │ return { x, y, ... }       │  expose to template
                  └───────────────┬───────────┘
                                  │ return object => render context
                                  ▼
                   template uses x, y (refs auto-unwrapped)
                                  │
                                  ▼
                   mount ──► onMounted fires (registered above)`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — return state and a method',
      lang: 'vue',
      code: '<script lang="ts">\nimport { ref } from \'vue\'\nexport default {\n  setup() {\n    const name = ref(\'Vue\')\n    const greet = () => alert(`Hi ${name.value}`)\n    return { name, greet }\n  },\n}\n</script>\n\n<template>\n  <input v-model="name" />\n  <button @click="greet">Greet</button>\n</template>',
      explanation: [
        'name is a ref; in the template it is auto-unwrapped (no .value).',
        'Inside setup() you must use name.value.',
        'The returned object is the template\'s data source.',
        'No `this`, no data() option — pure functions and closures.',
      ],
    },
    intermediate: {
      label: 'Intermediate — props and emit via arguments',
      lang: 'vue',
      code: '<script lang="ts">\nimport { computed } from \'vue\'\nexport default {\n  props: { first: String, last: String },\n  emits: [\'rename\'],\n  setup(props, { emit }) {\n    const full = computed(() => `${props.first} ${props.last}`)\n    function rename() { emit(\'rename\', full.value) }\n    return { full, rename }\n  },\n}\n</script>\n\n<template>\n  <span>{{ full }}</span>\n  <button @click="rename">Save</button>\n</template>',
      explanation: [
        'props is the first argument and is reactive — read props.first directly.',
        'emit comes from the destructured context (second argument).',
        'Never destructure props directly (it loses reactivity) — access via props.x.',
        'computed over props re-evaluates when first/last change.',
      ],
    },
    advanced: {
      label: 'Advanced — returning a render function & expose',
      lang: 'vue',
      code: '<script lang="ts">\nimport { ref, h } from \'vue\'\nexport default {\n  setup(_props, { expose }) {\n    const count = ref(0)\n    expose({ reset: () => (count.value = 0) }) // public instance API\n    // returning a function makes IT the render function\n    return () => h(\'button\', { onClick: () => count.value++ }, count.value)\n  },\n}\n</script>',
      explanation: [
        'Returning a function from setup() makes it the render function (no template needed).',
        'expose() defines what a parent ref can access — by default nothing is public.',
        'h() creates vnodes programmatically — handy for dynamic structures.',
        'This is the low-level shape that <script setup> hides from you.',
      ],
    },
    realProject: {
      label: 'Real project — composing logic from a composable',
      lang: 'vue',
      code: '<script lang="ts">\nimport { onMounted } from \'vue\'\nimport { useUser } from \'@/composables/useUser\'\nexport default {\n  props: { userId: { type: Number, required: true } },\n  setup(props) {\n    const { user, loading, fetchUser } = useUser()\n    onMounted(() => fetchUser(props.userId))\n    return { user, loading }\n  },\n}\n</script>\n\n<template>\n  <p v-if="loading">Loading…</p>\n  <p v-else>{{ user?.name }}</p>\n</template>',
      explanation: [
        'setup() is where you call composables to pull in reusable reactive logic.',
        'onMounted registered in setup() triggers the initial fetch.',
        'props.userId is read reactively as an argument, never via this.',
        'This is the real value of setup(): logic composition, not bucketed options.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the setup() function and when does it run?',
      answer: 'It is the Composition API entry point, running once during component creation before any lifecycle hook (before created), where you declare reactive state and logic and return what the template needs.',
      explanation: 'A strong answer notes the timing (very early, before hooks) and that the return value feeds the template.',
    },
    {
      level: 'beginner',
      question: 'Why can\'t you use `this` inside setup()?',
      answer: 'Because setup() runs before the component instance is fully created, so there is no `this` to refer to — you receive props and context as arguments instead.',
      explanation: 'Tests the core mental shift from Options API; mentioning props/context as the replacement is key.',
    },
    {
      level: 'intermediate',
      question: 'What are setup()\'s two arguments?',
      answer: 'props (a reactive read-only proxy) and context, an object containing attrs, slots, emit, and expose.',
      explanation: 'Knowing context\'s members and that props is reactive distinguishes someone who has used it.',
    },
    {
      level: 'intermediate',
      question: 'What happens if setup() returns a function instead of an object?',
      answer: 'Vue treats that function as the component\'s render function, so the template (if any) is ignored in favour of programmatic rendering.',
      explanation: 'Shows depth beyond the common object-return case.',
    },
    {
      level: 'advanced',
      question: 'Why must onMounted/watch/inject be called synchronously inside setup()?',
      answer: 'They rely on the internal currentInstance pointer that Vue sets only while setup() runs synchronously; calling them after an await or outside setup() means no active instance, so registration fails.',
      explanation: 'Senior signal: understanding the currentInstance mechanism behind the synchronous-call rule.',
    },
    {
      level: 'senior',
      question: 'How does <script setup> relate to setup(), and why is it preferred?',
      answer: '<script setup> is compile-time sugar that turns the block into a setup() function — top-level bindings become the render context automatically, and macros like defineProps/defineEmits/defineExpose map onto props/context. It is preferred for less boilerplate, better type inference, and no manual return.',
      explanation: 'Connecting the sugar to the underlying setup() and listing concrete benefits is a strong senior answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you access slots and attrs inside setup()? (context.slots / context.attrs)',
    'Why should you not destructure props in setup()? (loses reactivity — use toRefs)',
    'What does context.expose() do and what is exposed by default?',
    'Can setup() be async, and what changes if it is? (works with <Suspense>)',
    'How do lifecycle hooks differ between Options API and setup()?',
    'What is the difference between setupState and the props proxy?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using `this` inside setup().',
      why: 'The instance does not exist yet during setup(), so `this` is undefined.',
      fix: 'Use the props and context arguments; create local state with ref/reactive.',
    },
    {
      mistake: 'Destructuring props directly: const { id } = props.',
      why: 'Destructuring a reactive proxy reads a plain value and breaks reactivity to future changes.',
      fix: 'Access props.id where needed, or use toRefs(props) to keep reactivity.',
    },
    {
      mistake: 'Calling onMounted/watch after an await in an async setup().',
      why: 'currentInstance is only active synchronously; after await there is no instance to register against.',
      fix: 'Register all hooks/watchers synchronously before any await.',
    },
    {
      mistake: 'Forgetting to return state, so the template cannot see it.',
      why: 'Only what setup() returns becomes the render context (in the non-<script setup> form).',
      fix: 'Return every value/method the template uses, or switch to <script setup> where it is automatic.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every Composition-API component runs setup() (directly or via <script setup>) to wire refs, computed, watchers, and composables.' },
    { area: 'Component library', detail: 'Library components often use the explicit setup() form with expose() to define a deliberate public instance API for consumers using template refs.' },
    { area: 'Nuxt', detail: 'Async setup() (or <script setup> with top-level await) pairs with Suspense/asyncData patterns to fetch before render during SSR.' },
    { area: 'Pinia', detail: 'Setup stores mirror the setup() pattern: a function returning refs/computed/actions, the same mental model as component setup.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'setup() runs once per instance — there is no per-render cost for the setup logic itself.',
      'Co-locating logic enables extracting composables, reducing duplication and bundle size.',
    ],
    bad: [
      'Heavy synchronous work in setup() delays first render of that component.',
      'Creating large reactive objects you do not need adds proxy/tracking overhead.',
    ],
    optimizations: [
      'Defer expensive work to onMounted or to user interaction instead of running it inline in setup().',
      'Use shallowRef/shallowReactive for big external structures you do not deeply track.',
      'Move reusable logic into composables so it is created once and tree-shaken when unused.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['options-vs-composition-api', 'ref', 'reactive'],
    nextConcepts: ['script-setup', 'composables', 'lifecycle-hooks-composition'],
    dependencyNote:
      'setup() is the foundation of the Composition API: it presumes you understand ref/reactive and the Options-vs-Composition split. It leads directly to <script setup> (its sugar), composables (logic extracted from it), and the composition lifecycle hooks registered inside it.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write setup(props, context) and label the timeline: "before created, before any hook".',
      'Inside, list ref/computed/watch/onMounted being created.',
      'Draw a return { ... } arrow pointing to the template as "render context".',
      'Cross out `this` with a note: "no instance yet".',
      'Say: "<script setup> is just sugar that auto-returns the top-level bindings of this same function."',
    ],
    diagram: `  setup(props, { emit, slots, attrs, expose })
     │  no this
     ├─ ref / reactive   → state
     ├─ computed         → derived
     ├─ watch / onX      → effects & hooks (need currentInstance)
     └─ return { ... }   → template render context (refs unwrapped)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'setup() is the Composition API entry point: it runs once, very early (before any lifecycle hook), with no `this`. It receives props (reactive) and context ({ attrs, slots, emit, expose }). Inside it you create state with ref/reactive, derive with computed, react with watch, and register hooks like onMounted — then return an object exposed to the template (refs auto-unwrap). Returning a function instead makes it the render function. <script setup> is compiler sugar over exactly this.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'setup() is the entry point of the Composition API. Vue calls it once per component instance, very early — after props are resolved but before the component is fully created, which means before any lifecycle hook and before there is a `this`. That is the biggest mental shift coming from the Options API: inside setup() you never use this; instead Vue hands you two arguments. The first is props, which is a reactive, read-only proxy, so you read props.userId directly and it stays reactive. The second is context, an object with attrs, slots, emit, and expose. Inside setup() you do all your logic: create reactive state with ref or reactive, derive values with computed, set up side effects with watch or watchEffect, and register lifecycle hooks like onMounted. Those hooks work because Vue sets an internal currentInstance pointer while setup() runs synchronously, which is why you must register them synchronously and not after an await. Whatever you return from setup() becomes the render context for the template, and top-level refs are automatically unwrapped so you write count, not count.value, in the template. There is a special case: if you return a function instead of an object, Vue treats that function as the render function, which is how you do programmatic or JSX rendering. The real payoff is that all of a component\'s logic lives together in plain functions you can extract into composables, instead of being split across data, methods, and computed buckets. And finally, <script setup> is just compile-time sugar over this same function — top-level bindings become the render context automatically, and defineProps/defineEmits/defineExpose map onto props and context — which is why it is the preferred modern style.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Explicit setup() vs <script setup>: the explicit form gives full control (return a render fn, conditional exposure) but more boilerplate; <script setup> is terser with better inference but hides the mechanism.',
      'Logic composition vs discoverability: setup() centralizes logic but a large setup() can become a wall of code unless split into composables.',
    ],
    edgeCases: [
      'Async setup() suspends the component and must be wrapped in <Suspense>; hooks must still be registered before the first await.',
      'Returning a function turns setup() into the render function, bypassing the template.',
      'Destructuring props inside setup() silently breaks reactivity.',
      'context is not reactive and should not be destructured-then-stored beyond emit/expose usage.',
    ],
    runtimeBehavior: [
      'currentInstance is set only during synchronous execution of setup(), enabling hook registration.',
      'The returned object is wrapped as setupState and proxied as the render context with automatic ref unwrapping at the top level.',
      'props is shallow-readonly reactive; mutating it throws/warns.',
    ],
    scalability: [
      'Composables called from setup() let large apps share reactive logic without mixin collisions.',
      'Setup stores (Pinia) reuse the exact pattern, keeping a consistent model from component to global state.',
    ],
    productionConcerns: [
      'Heavy synchronous setup work delays render; defer to onMounted or interaction.',
      'expose() should be used deliberately in library components to define a stable public API.',
      'Be disciplined about not introducing this/Options patterns into Composition code during migration.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'setup() = Composition API entry; runs once, before all hooks.',
    'No `this` — instance does not exist yet.',
    'Arguments: (props, context) where context = { attrs, slots, emit, expose }.',
    'props is reactive & read-only — do NOT destructure it (use toRefs).',
    'Create state with ref/reactive, derive with computed, react with watch.',
    'Register onMounted/watch/inject SYNCHRONOUSLY inside setup().',
    'Return an object → template render context (top-level refs unwrapped).',
    'Return a function → it becomes the render function.',
    'context.expose() defines the public instance API (default: nothing).',
    '<script setup> is compiler sugar over setup().',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a component using the explicit setup() that exposes a count ref and an increment method to the template.',
      hint: 'Create the ref inside setup() and return it with the method.',
      solution: {
        lang: 'vue',
        code: '<script lang="ts">\nimport { ref } from \'vue\'\nexport default {\n  setup() {\n    const count = ref(0)\n    const increment = () => count.value++\n    return { count, increment }\n  },\n}\n</script>\n\n<template>\n  <button @click="increment">{{ count }}</button>\n</template>',
        explanation: ['count is created and returned, auto-unwrapped in the template.', 'increment mutates count.value inside setup().'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'In setup(), build a fullName computed from first/last props and emit a "change" event with it.',
      hint: 'Read props.first/props.last (do not destructure) and use context.emit.',
      solution: {
        lang: 'vue',
        code: '<script lang="ts">\nimport { computed } from \'vue\'\nexport default {\n  props: { first: String, last: String },\n  emits: [\'change\'],\n  setup(props, { emit }) {\n    const fullName = computed(() => `${props.first} ${props.last}`)\n    const save = () => emit(\'change\', fullName.value)\n    return { fullName, save }\n  },\n}\n</script>',
        explanation: ['props is accessed via props.x to preserve reactivity.', 'emit comes from the destructured context object.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make setup() return a render function that renders a clickable counter without a <template>.',
      hint: 'Import h and return () => h(...).',
      solution: {
        lang: 'vue',
        code: '<script lang="ts">\nimport { ref, h } from \'vue\'\nexport default {\n  setup() {\n    const n = ref(0)\n    return () => h(\'button\', { onClick: () => n.value++ }, `Clicked ${n.value}`)\n  },\n}\n</script>',
        explanation: [
          'Returning a function makes it the render function.',
          'h() builds the vnode; reactivity re-runs the function on change.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why registering onMounted after an await in async setup() fails, and fix it.',
      hint: 'currentInstance is only active synchronously; register before await.',
      solution: {
        lang: 'vue',
        code: '<script lang="ts">\nimport { ref, onMounted } from \'vue\'\nexport default {\n  async setup() {\n    const data = ref(null)\n    // CORRECT: register hook BEFORE any await\n    onMounted(() => console.log(\'mounted\'))\n    data.value = await fetch(\'/api\').then(r => r.json())\n    // onMounted here would NOT register (no active instance after await)\n    return { data }\n  },\n}\n</script>',
        explanation: [
          'After an await, Vue has cleared currentInstance, so hook registration silently fails.',
          'Register onMounted synchronously, before the first await.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'setup() is the heart of the Composition API. Once you understand its timing, arguments, the no-`this` rule, and the return contract, every other Composition concept — composables, <script setup>, the hooks — falls into place.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is setup() and why no this". Product companies (Zoho, Flipkart, Razorpay) ask about props/context, why not to destructure props, and to convert an Options component. FAANG-level interviews probe currentInstance, async setup + Suspense, and how <script setup> compiles down.',
    whatInterviewersExpect:
      'Define setup() precisely with its timing, name both arguments and context\'s members, explain the no-this and synchronous-hook rules, and connect it to composables and <script setup>.',
  },
}

export default setupFunction
