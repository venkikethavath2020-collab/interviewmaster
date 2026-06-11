import type { ConceptLesson } from '../../../types/lesson'

const vModelComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-model-components',
  name: 'v-model on Components',
  category: 'components',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'v-model on a component is how you build reusable two-way-bindable inputs (custom text fields, selects, toggles) that feel native.',
    'It is the most elegant way to keep a parent variable and a child input in sync while still respecting one-way data flow under the hood.',
    'Interviewers love this because it tests whether you understand that v-model is sugar for a prop + an event, not magic.',
    'Vue 3.4+ changed the recommended API (defineModel), so knowing both old and new forms signals up-to-date Vue knowledge.',
    'Custom form components in every real app and component library rely on this pattern.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-model is like a walkie-talkie pair — when one person speaks, the other instantly hears the same thing, and it works both ways.',
    story: [
      'Imagine two friends with walkie-talkies tuned to the same channel. When one says "blue", the other hears "blue" right away.',
      'And it goes both ways: if the second friend says "red", the first hears "red" too. They are always in sync.',
      'But under the hood it is not magic: one friend talks (sends), the other listens (receives), and they swap roles. Talking down, listening back up.',
      'v-model on a component is that two-way walkie-talkie: the parent sends a value down, the child sends changes back up, and both always show the same thing.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'On a normal input, v-model keeps a variable and the input box in sync automatically — type in the box and the variable updates, change the variable and the box updates.',
    'You can give your own components this same power. v-model on a component passes a value down as a prop and listens for an update event coming back up.',
    'So it is really two things bundled together: a prop (the current value) and an event (the new value the child reports). Vue wires them so it looks like one tidy two-way binding.',
    'This still respects the rule that data flows one way: the child does not secretly change the parent\'s variable; it emits the new value and Vue assigns it back for you.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-model on a component is a shorthand for binding a value prop and listening to its update event, giving the component two-way binding with the parent.',
    how: 'In Vue 3, <Comp v-model="x" /> passes modelValue="x" and listens for update:modelValue. In Vue 3.4+, the child uses defineModel() to get a writable ref that handles both sides automatically.',
    why: 'It lets you build custom inputs that behave like native ones, keeping parent and child in sync without manually wiring a prop and an event every time.',
    code: {
      label: 'Custom input with defineModel (Vue 3.4+)',
      lang: 'vue',
      code: '<!-- TextField.vue (child) -->\n<script setup>\nconst model = defineModel()  // writable ref synced with parent\n</script>\n<template>\n  <input :value="model" @input="model = $event.target.value" />\n</template>\n\n<!-- Parent -->\n<script setup>\nimport { ref } from \'vue\'\nimport TextField from \'./TextField.vue\'\nconst name = ref(\'\')\n</script>\n<template>\n  <TextField v-model="name" />\n  <p>You typed: {{ name }}</p>\n</template>',
      explanation: [
        'defineModel() returns a writable ref tied to the parent\'s v-model value.',
        'Reading `model` shows the current value; assigning to it emits the update upward.',
        'The parent binds v-model="name"; typing keeps name in sync automatically.',
        'No manual prop + emit wiring — defineModel handles both directions.',
        'This is the modern, recommended Vue 3.4+ approach.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-model on a component is syntactic sugar that combines a one-way prop binding with an event listener to simulate two-way binding. By default <Comp v-model="x" /> binds the modelValue prop to x and attaches an update:modelValue listener that assigns the emitted value back to x. Named models (v-model:title) use the title prop and update:title event. In Vue 3.4+, defineModel() in the child returns a writable ref whose reads reflect the prop and whose writes emit the corresponding update event, encapsulating the pattern.',

  // 7. Internal Working
  internalWorking: [
    'The compiler expands <Comp v-model="x" /> into :modelValue="x" plus @update:modelValue="newVal => x = newVal" on the component vnode.',
    'A named v-model:foo expands to :foo and @update:foo, allowing multiple independent v-model bindings on one component.',
    'In the child, defineProps must declare modelValue (or the named prop) and defineEmits must declare update:modelValue; the child emits the update event when its value changes.',
    'In Vue 3.4+, defineModel() declares the prop and emit under the hood and returns a writable ref; reading it returns the prop value, assigning to it calls emit(\'update:modelValue\', value).',
    'Modifiers (v-model.trim, .number, custom) are passed to the child as a modelModifiers object so the child can transform the value before emitting.',
    'Because the assignment happens in the parent\'s listener, the data ownership stays with the parent — one-way flow is preserved despite the two-way appearance.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   <Comp v-model="x" />   ── expands to ──►

   Parent
   ┌────────────────────────────────────────────┐
   │ :modelValue="x"      (prop DOWN)             │
   │ @update:modelValue="v => x = v" (event UP)   │
   └───────┬───────────────────────▲──────────────┘
           │ value                 │ new value
           ▼                       │
   Child:  modelValue prop ──► input ──► emit('update:modelValue', v)
           (defineModel() wraps both into one writable ref)`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — classic prop + event (Vue 3.0–3.3 style)',
      lang: 'vue',
      code: '<!-- MyInput.vue -->\n<script setup>\ndefineProps([\'modelValue\'])\nconst emit = defineEmits([\'update:modelValue\'])\n</script>\n<template>\n  <input\n    :value="modelValue"\n    @input="emit(\'update:modelValue\', $event.target.value)"\n  />\n</template>\n\n<!-- parent -->\n<MyInput v-model="text" />',
      explanation: [
        'The child declares modelValue prop and update:modelValue event.',
        'It binds :value from the prop and emits the new value on input.',
        '<MyInput v-model="text" /> wires both sides for the parent.',
        'This explicit form shows exactly what v-model is sugar for.',
      ],
    },
    intermediate: {
      label: 'Intermediate — named and multiple v-models',
      lang: 'vue',
      code: '<!-- NameFields.vue -->\n<script setup>\nconst first = defineModel(\'first\')\nconst last = defineModel(\'last\')\n</script>\n<template>\n  <input :value="first" @input="first = $event.target.value" placeholder="First" />\n  <input :value="last" @input="last = $event.target.value" placeholder="Last" />\n</template>\n\n<!-- parent -->\n<NameFields v-model:first="firstName" v-model:last="lastName" />',
      explanation: [
        'Named models let one component expose multiple two-way bindings.',
        'defineModel(\'first\') uses the `first` prop and update:first event.',
        'The parent binds v-model:first and v-model:last independently.',
        'Each ref syncs its own field with its own parent variable.',
        'Great for components that manage several related values.',
      ],
    },
    advanced: {
      label: 'Advanced — v-model with modifiers',
      lang: 'vue',
      code: '<!-- TrimmedInput.vue -->\n<script setup>\nconst [model, modifiers] = defineModel({\n  set(value) {\n    return modifiers.upper ? value.toUpperCase() : value\n  },\n})\n</script>\n<template>\n  <input :value="model" @input="model = $event.target.value" />\n</template>\n\n<!-- parent uses a custom modifier -->\n<TrimmedInput v-model.upper="code" />',
      explanation: [
        'defineModel can return the model ref plus a modifiers object.',
        'The set transform runs before the value is emitted to the parent.',
        'Here a custom .upper modifier uppercases the value on the way out.',
        'Modifiers like .trim and .number work similarly via modelModifiers.',
        'This lets reusable inputs offer native-feeling modifier behaviour.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable Toggle bound with v-model',
      lang: 'vue',
      code: '<!-- ToggleSwitch.vue -->\n<script setup lang="ts">\nconst model = defineModel<boolean>()\n</script>\n<template>\n  <button\n    role="switch"\n    :aria-checked="model"\n    :class="{ on: model }"\n    @click="model = !model"\n  >\n    {{ model ? \'On\' : \'Off\' }}\n  </button>\n</template>\n\n<!-- settings form -->\n<!-- <ToggleSwitch v-model="notificationsEnabled" /> -->',
      explanation: [
        'A typed boolean model gives a clean two-way bindable switch.',
        'Clicking flips the value, which syncs straight back to the parent.',
        'aria-checked tracks the model for accessibility.',
        'The parent uses it like any native checkbox: v-model="notificationsEnabled".',
        'This is the standard way component libraries expose form controls.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does v-model on a component do?',
      answer: 'It creates two-way binding by passing a value prop down (modelValue) and listening for an update event (update:modelValue) that assigns the new value back to the bound variable.',
      explanation: 'The "prop + event" framing is the answer interviewers want.',
    },
    {
      level: 'beginner',
      question: 'Is v-model magic two-way binding that breaks one-way flow?',
      answer: 'No. It is sugar over a one-way prop plus an event; the parent assigns the emitted value back, so the parent still owns the data and flow stays unidirectional.',
      explanation: 'Dispelling the "magic" idea shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'What prop and event does the default v-model use in Vue 3?',
      answer: 'The modelValue prop and the update:modelValue event. Named v-model:foo uses the foo prop and update:foo event.',
      explanation: 'Knowing the exact names (and the Vue 2 → Vue 3 change from value/input) is a common check.',
    },
    {
      level: 'intermediate',
      question: 'How do you put multiple v-models on one component?',
      answer: 'Use named models: <Comp v-model:first="a" v-model:last="b" />, with defineModel(\'first\') and defineModel(\'last\') in the child. Each is an independent prop/event pair.',
      explanation: 'Multiple named models is a frequent intermediate follow-up.',
    },
    {
      level: 'advanced',
      question: 'What changed with defineModel in Vue 3.4+?',
      answer: 'defineModel() returns a writable ref that wraps the prop and emit, so you no longer manually declare modelValue/update:modelValue. Reads reflect the prop; writes emit the update. It also exposes modifiers and supports types/defaults.',
      explanation: 'Awareness of the modern API and what it abstracts is a strong, current signal.',
    },
    {
      level: 'senior',
      question: 'How do v-model modifiers (.trim, .number, custom) reach the child?',
      answer: 'They are passed as a modelModifiers object (e.g. { trim: true }); with defineModel you receive them and apply transformations in the get/set so the value is normalised before emitting.',
      explanation: 'Explaining the modifier propagation mechanism is a senior-level detail.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What was the Vue 2 default (value prop + input event) and why did Vue 3 change it?',
    'How would you implement v-model without defineModel (classic prop + emit)?',
    'How do named v-models map to props and events?',
    'How do you add a custom v-model modifier?',
    'Can a v-model value be an object, and what are the reactivity caveats?',
    'How does v-model interact with computed get/set?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating the modelValue prop directly in the child.',
      why: 'It is still a read-only prop; mutating it breaks flow and the change gets overwritten on re-render.',
      fix: 'Emit update:modelValue (or assign to the defineModel ref) so the parent updates its variable.',
    },
    {
      mistake: 'Using the Vue 2 value/input names in Vue 3.',
      why: 'Vue 3 renamed the default to modelValue/update:modelValue; value/input will not wire up v-model.',
      fix: 'Use modelValue + update:modelValue, or just use defineModel().',
    },
    {
      mistake: 'Forgetting to declare the prop AND the emit in the classic pattern.',
      why: 'Both halves are required; missing the emit declaration causes warnings and broken updates.',
      fix: 'Declare both, or switch to defineModel which declares them for you.',
    },
    {
      mistake: 'Binding v-model to a deeply nested object and expecting field-level reactivity for free.',
      why: 'v-model replaces/assigns the whole bound reference; mutating nested fields needs care.',
      fix: 'Bind specific fields with named v-models or emit granular updates; consider a computed get/set.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'All form controls (Input, Select, Checkbox, Switch, DatePicker) expose v-model so consumers bind them like native inputs.' },
    { area: 'Vue', detail: 'App-specific composite inputs (currency fields, tag editors) use v-model and named models to sync multiple values.' },
    { area: 'Nuxt', detail: 'Form pages bind v-model to reusable field components, often combined with validation libraries.' },
    { area: 'Pinia', detail: 'Components v-model local refs then commit to a store on submit, keeping store writes intentional rather than per-keystroke.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'v-model is a thin compile-time expansion — no runtime overhead beyond the prop/event it represents.',
      'defineModel encapsulates the pattern with the same cost as a manual prop + emit.',
    ],
    bad: [
      'v-model on a text input fires on every keystroke; binding directly to expensive computed or store writes can cause churn.',
      'Many v-models on a large form each trigger their own updates.',
    ],
    optimizations: [
      'Use the .lazy modifier or debounce to update on change/blur instead of every keystroke for heavy handlers.',
      'Bind to local refs and commit to a store on submit rather than per-keystroke.',
      'Prefer named models over one giant object model to limit re-render scope.',
      'Apply .number/.trim modifiers to normalise once at the source.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['v-model', 'props', 'component-events'],
    nextConcepts: ['form-handling', 'computed', 'component-design-patterns'],
    dependencyNote:
      'v-model on components builds directly on the v-model directive, props, and component-events (it is sugar for a prop + an update event). It leads into form-handling and reusable component-design-patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write <Comp v-model="x" /> on the board.',
      'Below it, expand it to :modelValue="x" and @update:modelValue="v => x = v".',
      'Draw a down arrow (prop) into the child and an up arrow (emit) back to the parent.',
      'Note that defineModel() wraps both into one writable ref.',
      'Say: "v-model is sugar for a value prop plus an update event. The parent assigns the emitted value back, so one-way flow is preserved — it just looks two-way."',
    ],
    diagram: `   <Comp v-model="x" />
        =
   :modelValue="x"
   @update:modelValue="v => x = v"

   Parent x ──prop──► Child ──emit('update:modelValue', v)──► x`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-model on a component is sugar for a value prop plus an update event. By default <Comp v-model="x" /> binds modelValue and listens for update:modelValue, assigning the emitted value back to x. Named models (v-model:foo → foo prop + update:foo) allow multiple bindings. In Vue 3.4+, defineModel() returns a writable ref that handles both sides, including modifiers. It looks two-way but preserves one-way flow: the child emits, the parent assigns.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-model on a component is how you give your own components the two-way binding that native inputs have, and the key insight is that it is not magic — it is syntactic sugar over a prop and an event. When you write <Comp v-model="x" />, the compiler expands it into binding the modelValue prop to x and attaching an update:modelValue listener that assigns the emitted value back to x. So the child receives the current value as a read-only prop and, when its internal value changes, it emits update:modelValue with the new value; the parent\'s generated listener does the assignment. That is why one-way data flow is preserved despite the two-way appearance: the parent still owns and assigns the data. In the classic Vue 3.0 to 3.3 style you declare modelValue with defineProps and update:modelValue with defineEmits and wire them by hand. From Vue 3.4 onward the recommended approach is defineModel(), which returns a writable ref: reading it gives the prop value, and writing to it emits the update event, so it encapsulates both halves in one object. You can have multiple independent bindings using named models — v-model:first and v-model:last map to the first/update:first and last/update:last pairs. Modifiers like .trim, .number, or custom ones are delivered to the child as a modelModifiers object so the child can normalise the value before emitting. One thing to remember from Vue 2: the default names changed from value/input to modelValue/update:modelValue. This pattern is everywhere — every form control in a component library exposes v-model so consumers can bind it exactly like a native field.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'v-model is concise but hides the prop/event mechanics; for complex controlled components an explicit prop + event can be clearer.',
      'One object model vs multiple named models: object is compact but couples updates; named models give granular, independently-reactive bindings.',
    ],
    edgeCases: [
      'Per-keystroke updates vs .lazy/blur — choosing the update frequency.',
      'Object/array models and nested mutation reactivity pitfalls.',
      'Custom modifiers requiring get/set transforms via defineModel.',
      'SSR: initial modelValue must match server-rendered value to avoid hydration mismatch.',
    ],
    runtimeBehavior: [
      'Compile-time expansion to :modelValue + @update:modelValue (or named equivalents).',
      'defineModel reads reflect the prop; writes call emit synchronously, parent re-renders.',
      'Modifiers arrive as modelModifiers and are applied in the model\'s get/set.',
    ],
    scalability: [
      'Large forms with many v-models benefit from local refs committed on submit rather than per-keystroke store writes.',
      'Named models scale better than a single mega-object model for independent field reactivity.',
    ],
    productionConcerns: [
      'Mixing Vue 2 value/input names in Vue 3 code silently breaks binding — audit during migration.',
      'High-frequency v-model bound to expensive computed/store causes jank — debounce or use .lazy.',
      'Document a component library\'s v-model contract (default vs named models, modifiers) clearly.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-model on a component = value prop + update event (sugar).',
    'Default: modelValue prop + update:modelValue event.',
    'Named: v-model:foo → foo prop + update:foo event.',
    'Vue 3.4+: defineModel() returns a writable ref (recommended).',
    'Multiple bindings: use named models.',
    'Modifiers arrive as modelModifiers; apply in get/set.',
    'Never mutate modelValue — emit/assign the ref instead.',
    'Vue 2 used value/input; Vue 3 renamed to modelValue/update:modelValue.',
    'One-way flow is preserved: child emits, parent assigns.',
    'Use .lazy or debounce for expensive update handlers.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Using defineModel, make a CharCount input that is v-model bindable.',
      hint: 'defineModel() returns a writable ref.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst model = defineModel()\n</script>\n<template>\n  <input :value="model" @input="model = $event.target.value" />\n  <small>{{ (model || \'\').length }} chars</small>\n</template>',
        explanation: [
          'defineModel() gives a ref synced with the parent\'s v-model.',
          'Assigning to model emits the update automatically.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement the same input with the classic prop + emit pattern (no defineModel).',
      hint: 'Declare modelValue and update:modelValue explicitly.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps([\'modelValue\'])\nconst emit = defineEmits([\'update:modelValue\'])\n</script>\n<template>\n  <input\n    :value="modelValue"\n    @input="emit(\'update:modelValue\', $event.target.value)"\n  />\n</template>',
        explanation: [
          'modelValue is the value prop; update:modelValue is the event.',
          'This is exactly what v-model expands to.',
          'defineModel is just a convenience over this.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a FullName component with two named v-models: first and last.',
      hint: 'Two defineModel calls with names.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst first = defineModel(\'first\')\nconst last = defineModel(\'last\')\n</script>\n<template>\n  <input :value="first" @input="first = $event.target.value" />\n  <input :value="last" @input="last = $event.target.value" />\n</template>\n\n<!-- parent: <FullName v-model:first="f" v-model:last="l" /> -->',
        explanation: [
          'Each named model maps to its own prop/event pair.',
          'first ↔ first prop + update:first; last ↔ last prop + update:last.',
          'The parent binds each independently with v-model:name.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a typed (TS) NumberInput with a .double custom modifier that doubles the value before emitting.',
      hint: 'Destructure [model, modifiers] from defineModel and transform in set.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nconst [model, modifiers] = defineModel<number>({\n  set(value: number) {\n    return modifiers.double ? value * 2 : value\n  },\n})\n</script>\n<template>\n  <input\n    type="number"\n    :value="model"\n    @input="model = Number($event.target.value)"\n  />\n</template>\n\n<!-- parent: <NumberInput v-model.double="qty" /> -->',
        explanation: [
          'defineModel returns the model ref and a modifiers object.',
          'The set transform doubles the value when the .double modifier is present.',
          'The transform runs before the value is emitted to the parent.',
          'Typed as number for compile-time safety.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'v-model on components is the bridge between the props/events fundamentals and real-world reusable inputs. Understanding it as sugar for a prop and an event proves you grasp Vue\'s data flow, and knowing defineModel shows you are current with Vue 3.4+. Every form control you build relies on it.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what v-model does on a component. Product companies (Zoho, Flipkart, Razorpay) ask you to build a custom v-model input from scratch and explain the prop/event expansion. FAANG-level interviews probe named models, modifiers, defineModel internals, and SSR/hydration concerns.',
    whatInterviewersExpect:
      'They expect you to explain v-model as a value prop plus an update event, implement it both classically and with defineModel, use named models, and confirm one-way flow is preserved.',
  },
}

export default vModelComponents
