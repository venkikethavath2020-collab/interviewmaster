import type { ConceptLesson } from '../../../types/lesson'

const vModel: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-model',
  name: 'v-model',
  category: 'templates',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'v-model is two-way data binding made trivial — it keeps an input and your reactive state perfectly in sync with one attribute, which is the backbone of every form.',
    'Forms are everywhere (login, checkout, search, settings) and v-model is the single most-used directive for handling their input.',
    'It is sugar over a value binding plus an event listener, so understanding it teaches you how Vue\'s one-way data flow underpins "two-way" convenience.',
    'On components, v-model defines the contract for reusable inputs — interviewers love asking how it works on custom components in Vue 3.',
    'Misunderstanding v-model (mutating props, wrong modifiers, multiple v-models) causes real bugs and is a frequent interview discriminator.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-model is a walkie-talkie pair: whatever you say into one is instantly heard on the other, both ways.',
    story: [
      'Imagine you and a friend each have a walkie-talkie that are magically linked.',
      'When you speak into yours, your friend hears it immediately. When your friend speaks, you hear it too — it works in both directions automatically.',
      'You never have to ask "did you get that?" — they are always saying the same thing.',
      'v-model links a box on the screen (like a text field) with a value in your program. Type in the box and the value updates; change the value in code and the box updates. They always match, both ways.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you make a form input in Vue, you usually want two things: show the current value in the box, and update your data when the user types.',
    'v-model does both at once. You write v-model="name" and the input shows name and updates name as you type.',
    'It works on text fields, checkboxes, radio buttons, selects, and textareas, each in a sensible way.',
    'Behind the scenes it is just a value being shown plus an event that updates it — Vue bundles those two into one tidy directive.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-model is two-way binding sugar: on a form element it combines a value binding (showing the state) with an input/change listener (updating the state) so the input and the reactive variable stay synchronized.',
    how: 'The compiler expands v-model="x" on a text input into :value="x" plus @input="x = $event.target.value" (the property and event differ by element type — checkbox uses :checked/@change, select uses :value/@change). On a component it expands to :modelValue="x" plus @update:modelValue="x = $event".',
    why: 'It eliminates the boilerplate of manually wiring value + event for every field, while still respecting Vue\'s one-way data flow under the hood.',
    code: {
      label: 'Binding text, checkbox, and select',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst name = ref(\'\')\nconst agree = ref(false)\nconst color = ref(\'red\')\n</script>\n\n<template>\n  <input v-model="name" placeholder="Your name" />\n  <label><input type="checkbox" v-model="agree" /> I agree</label>\n  <select v-model="color">\n    <option value="red">Red</option>\n    <option value="blue">Blue</option>\n  </select>\n  <p>{{ name }} | {{ agree }} | {{ color }}</p>\n</template>',
      explanation: [
        'v-model="name" syncs the text input both ways with the name ref.',
        'On a checkbox, v-model binds the boolean checked state to agree.',
        'On a select, v-model binds the chosen option value to color.',
        'Each element type uses the appropriate property/event automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-model is compiler-generated two-way binding. On native elements it desugars into an element-appropriate value binding plus an event handler — :value + @input for text, :checked + @change for checkboxes, :value + @change for selects — with input modifiers .lazy (use change instead of input), .number (coerce to Number), and .trim (trim whitespace). On a component, v-model="x" expands to :modelValue="x" and @update:modelValue="x = $event", and named v-models (v-model:title) bind arbitrary prop/event pairs, enabling multiple two-way bindings on one component. The child receives a prop and must emit the update event rather than mutating the prop.',

  // 7. Internal Working
  internalWorking: [
    'At compile time, the directive transform inspects the element. For native inputs it picks the correct property/event pair based on type (text→value/input, checkbox/radio→checked/change, select→value/change).',
    'It generates a value binding (e.g. :value="x") so the DOM reflects the current reactive state on every render.',
    'It generates an event listener (e.g. @input) whose handler assigns the event\'s value back into the bound expression, completing the loop.',
    'Input modifiers wrap the assignment: .number coerces with a Number parse, .trim trims the string, and .lazy switches the listener from input to change.',
    'For components, v-model lowers to a modelValue prop and an update:modelValue listener; named v-models use the given name as both prop and the update:name event.',
    'Because the data still flows one way (state → prop → DOM) and the update is an explicit event, v-model never violates Vue\'s unidirectional data flow — it just automates the two halves.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        state (ref)                       DOM input
        ┌─────────┐   :value (bind down)   ┌──────────┐
        │  name   │ ─────────────────────► │  <input> │
        │  'Ada'  │ ◄───────────────────── │          │
        └─────────┘   @input (event up)    └──────────┘
                       x = $event.target.value

  component:  v-model="x"  ⇄  :modelValue + @update:modelValue
  named:      v-model:title ⇄ :title + @update:title`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The bound ref lives in the reactive heap; the value binding reads it inside the render effect, registering a dependency so the DOM updates when it changes.',
    'The generated input listener is a stable invoker (like any v-on handler) and assigns back into the ref, triggering the ref\'s setter and a re-render.',
    'For components, modelValue is an ordinary prop (read-only from the child\'s view); the update event is the only sanctioned channel to change the parent\'s state.',
    'No extra two-way "binding object" exists — it is purely a prop read plus an event write, so there is no hidden synchronization cost.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — text and textarea with modifiers',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst age = ref(0)\nconst bio = ref(\'\')\n</script>\n\n<template>\n  <!-- .number coerces the string to a Number -->\n  <input v-model.number="age" type="number" />\n  <!-- .trim removes leading/trailing whitespace -->\n  <textarea v-model.trim="bio"></textarea>\n  <p>{{ typeof age }} / {{ age }}</p>\n</template>',
      explanation: [
        'v-model.number makes age a real Number instead of a string from the input.',
        'v-model.trim trims whitespace on the bound value.',
        '.lazy (not shown) would update on change/blur instead of every keystroke.',
        'Modifiers stack: v-model.number.trim is valid.',
      ],
    },
    intermediate: {
      label: 'Intermediate — checkboxes bound to an array',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst toppings = ref([])\n</script>\n\n<template>\n  <label><input type="checkbox" value="cheese" v-model="toppings" /> Cheese</label>\n  <label><input type="checkbox" value="olives" v-model="toppings" /> Olives</label>\n  <label><input type="checkbox" value="basil" v-model="toppings" /> Basil</label>\n  <p>Selected: {{ toppings }}</p>\n</template>',
      explanation: [
        'When multiple checkboxes share a v-model bound to an array, each checked value is added/removed from the array.',
        'The value attribute determines what gets pushed into toppings.',
        'A single checkbox bound to a boolean toggles true/false instead.',
        'This is the idiomatic way to collect a set of selections.',
      ],
    },
    advanced: {
      label: 'Advanced — v-model on a custom component',
      lang: 'vue',
      code: '<!-- MoneyInput.vue -->\n<script setup>\ndefineProps([\'modelValue\'])\nconst emit = defineEmits([\'update:modelValue\'])\nfunction onInput(e) {\n  emit(\'update:modelValue\', Number(e.target.value))\n}\n</script>\n<template>\n  <input :value="modelValue" @input="onInput" type="number" />\n</template>\n\n<!-- Parent.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport MoneyInput from \'./MoneyInput.vue\'\nconst price = ref(100)\n</script>\n<template>\n  <MoneyInput v-model="price" />\n  <p>Price: {{ price }}</p>\n</template>',
      explanation: [
        'On a component, v-model="price" expands to :modelValue="price" + @update:modelValue.',
        'The child declares modelValue as a prop and emits update:modelValue to change it — never mutating the prop.',
        'This contract makes the component reusable as a drop-in form control.',
        'In <script setup> you can alternatively use the defineModel() macro for less boilerplate.',
      ],
    },
    realProject: {
      label: 'Real project — multiple v-models with defineModel',
      lang: 'vue',
      code: '<!-- NameFields.vue (Vue 3.4+) -->\n<script setup>\nconst first = defineModel(\'first\')\nconst last = defineModel(\'last\')\n</script>\n<template>\n  <input v-model="first" placeholder="First" />\n  <input v-model="last" placeholder="Last" />\n</template>\n\n<!-- Parent.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport NameFields from \'./NameFields.vue\'\nconst firstName = ref(\'Ada\')\nconst lastName = ref(\'Lovelace\')\n</script>\n<template>\n  <NameFields v-model:first="firstName" v-model:last="lastName" />\n  <p>{{ firstName }} {{ lastName }}</p>\n</template>',
      explanation: [
        'defineModel(\'first\') creates a writable two-way ref wired to the first prop and update:first event automatically.',
        'Named v-models (v-model:first, v-model:last) bind multiple independent two-way values on one component.',
        'defineModel removes the manual prop + emit boilerplate of the older pattern.',
        'This is the modern idiom for building multi-field reusable form controls.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is v-model and what problem does it solve?',
      answer: 'v-model provides two-way data binding for form inputs: it shows the current value and updates the bound reactive state as the user types, eliminating the manual value + event wiring.',
      explanation: 'A strong answer notes it is sugar, not magic — value down, event up.',
    },
    {
      level: 'beginner',
      question: 'What does v-model desugar into on a text input?',
      answer: 'It expands to :value="x" plus @input="x = $event.target.value". For checkboxes it uses :checked/@change, and for selects :value/@change.',
      explanation: 'Knowing the exact desugaring (and that it varies by element) is the key intermediate detail.',
    },
    {
      level: 'intermediate',
      question: 'What do the .lazy, .number, and .trim modifiers do?',
      answer: '.lazy syncs on the change event (e.g. blur) instead of every input; .number coerces the value to a Number; .trim trims leading/trailing whitespace.',
      explanation: 'Common knowledge for form work; .number is especially useful since inputs are strings by default.',
    },
    {
      level: 'intermediate',
      question: 'How does v-model work on a custom component in Vue 3?',
      answer: 'v-model="x" expands to :modelValue="x" and @update:modelValue="x = $event". The child takes a modelValue prop and emits update:modelValue to change it. Vue 3.4+ offers the defineModel() macro to do this with less boilerplate.',
      explanation: 'The Vue 2 → Vue 3 change (value/input → modelValue/update:modelValue) is a frequent question.',
    },
    {
      level: 'advanced',
      question: 'How do you put multiple v-models on one component?',
      answer: 'Use named v-models: v-model:title="t" and v-model:body="b". Each expands to its own prop (title/body) and update event (update:title/update:body), so a component can have several independent two-way bindings.',
      explanation: 'Named v-models are a Vue 3 feature (Vue 2 had only one via value); naming them shows current knowledge.',
    },
    {
      level: 'senior',
      question: 'Why does v-model not violate one-way data flow, and what is the anti-pattern to avoid?',
      answer: 'Data still flows one way: parent state → prop (modelValue) → child DOM. The child never mutates the prop; it emits an event that asks the parent to update, keeping the source of truth in the parent. The anti-pattern is mutating modelValue directly in the child, which breaks the contract and triggers a warning.',
      explanation: 'Demonstrates the deeper principle that two-way binding is two coordinated one-way flows.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is v-model in Vue 3 different from Vue 2 (value/input vs modelValue/update:modelValue)?',
    'What is defineModel() and what does it generate?',
    'How does v-model behave on a group of checkboxes vs a single checkbox?',
    'Can you add a custom modifier to a component v-model?',
    'Why should a child component never mutate its modelValue prop?',
    'How would you implement a debounced v-model?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating the modelValue prop directly inside a child component.',
      why: 'Props are one-way and read-only; mutating them breaks the data-flow contract and Vue warns about it.',
      fix: 'Emit update:modelValue (or use defineModel) so the parent owns the change.',
    },
    {
      mistake: 'Expecting a numeric input bound with v-model to be a Number.',
      why: 'DOM input values are strings, so v-model="age" yields a string even on type="number".',
      fix: 'Use v-model.number to coerce, or parse explicitly.',
    },
    {
      mistake: 'Using value/input convention for component v-model in Vue 3.',
      why: 'Vue 3 renamed the default to modelValue/update:modelValue; the old names no longer wire up automatically.',
      fix: 'Use modelValue + update:modelValue, or defineModel() in Vue 3.4+.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every form — login, checkout, settings, search — binds inputs with v-model, often with .number/.trim for clean data.' },
    { area: 'Component library', detail: 'Inputs, selects, switches, and date pickers expose v-model via modelValue/update:modelValue (or defineModel) so they slot into forms like native controls.' },
    { area: 'Form libraries', detail: 'VeeValidate / FormKit build on v-model semantics; custom fields implement the modelValue contract to integrate with validation.' },
    { area: 'Pinia', detail: 'Form state is often bound to store-backed refs via v-model, so edits flow into the store and persist across navigation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'v-model is just a value binding plus a listener — no hidden watcher, so overhead is minimal.',
      'It keeps state and DOM in sync with a single stable invoker per input.',
    ],
    bad: [
      'Binding a huge object\'s deeply nested field across many inputs can cause broad re-renders if not scoped.',
      'High-frequency text inputs that trigger expensive computed/watchers on every keystroke can lag.',
    ],
    optimizations: [
      'Use .lazy to update on change/blur instead of every keystroke when immediacy is not needed.',
      'Debounce expensive side effects driven by an input rather than running them per keystroke.',
      'Bind to local refs and commit to the store on submit for large forms.',
      'Use defineModel for component inputs to avoid extra wrapper computeds.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-bind', 'v-on-events', 'reactivity-fundamentals', 'ref'],
    nextConcepts: ['v-model-components', 'form-handling', 'component-events', 'props'],
    dependencyNote:
      'v-model is built from v-bind (value down) and v-on (event up), so understand those first; it extends naturally into v-model-components for custom inputs and into form-handling for full forms.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write v-model="name" on an input, then expand it to :value="name" + @input="name = $event.target.value".',
      'Draw the down arrow (state → DOM) for the value binding and the up arrow (event → state) for the listener.',
      'Show the component form: v-model="x" → :modelValue + @update:modelValue, with the child emitting, never mutating.',
      'Add named v-models (v-model:title / :body) as two parallel down/up pairs.',
      'Conclude: two-way binding is two coordinated one-way flows — sugar, not magic.',
    ],
    diagram: `  v-model="name"
   = :value="name"            (down: state → DOM)
   + @input="name=$event...  (up:   DOM → state)

  <Comp v-model="x" /> = :modelValue + @update:modelValue
  child: prop in, emit out (never mutate the prop)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-model is two-way binding sugar. On a text input it expands to :value plus @input; on checkboxes/selects it uses checked/change or value/change. Modifiers: .lazy (change not input), .number (coerce), .trim. On a component it becomes :modelValue + @update:modelValue, and you can have multiple named v-models (v-model:title). Vue 3.4+ has defineModel() to remove boilerplate. The child must emit, never mutate the prop — so data still flows one way underneath.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-model gives two-way data binding, but it is really just syntactic sugar over a value binding plus an event listener. On a text input, v-model="name" compiles to :value="name" — which shows the current state in the box — plus @input="name = $event.target.value", which writes the user\'s typing back into the state. The exact property and event depend on the element: checkboxes use :checked and @change, selects use :value and @change, and a group of checkboxes sharing one v-model collects values into an array. There are three input modifiers: .lazy syncs on change instead of every keystroke, .number coerces the string to a Number — important because DOM inputs are always strings — and .trim strips whitespace. On a custom component, v-model is the contract for reusable inputs: v-model="x" expands to :modelValue="x" and @update:modelValue="x = $event". The child receives modelValue as a prop and emits update:modelValue to request a change — it must never mutate the prop, because that breaks one-way data flow. Vue 3 also supports multiple named v-models on one component, like v-model:title and v-model:body, each mapping to its own prop and update event, and Vue 3.4 added the defineModel macro that creates a writable ref and wires the prop and emit for you. The key insight for interviews: two-way binding isn\'t magic — it\'s two coordinated one-way flows, state down via the prop and changes up via the event, so the source of truth always stays in the parent.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'v-model is concise but hides the value/event pair; for unusual controls you may need the explicit :value/@input form to customize behavior.',
      'defineModel reduces boilerplate but couples the child tightly to a parent-owned value; a local-draft-then-commit pattern is sometimes better for complex forms.',
    ],
    edgeCases: [
      'IME composition: v-model does not update mid-composition (during e.g. Chinese/Japanese input) until composition ends — relevant for international forms.',
      'A numeric input without .number yields a string, breaking arithmetic and validation that assumes a Number.',
      'Custom v-model modifiers reach the child via the modelModifiers prop, letting the child implement its own .capitalize etc.',
      'Binding v-model to a computed without a setter throws; you need a writable computed (get/set).',
    ],
    runtimeBehavior: [
      'The value binding runs in the render effect (down), and the listener writes back (up) triggering a fresh render.',
      'For components, modelValue is a normal reactive prop; updates flow through the parent\'s reactivity, so the child re-renders with the new value.',
      '.lazy swaps the listener to change so updates are debounced to commit points.',
    ],
    scalability: [
      'Large forms with many v-models are fine, but binding directly to a shared store on every keystroke can cause wide reactivity; prefer local refs committed on submit.',
      'Reusable input components with defineModel keep large design systems consistent and reduce per-field boilerplate.',
    ],
    productionConcerns: [
      'The "mutating prop" warning is a common code-review catch in child inputs.',
      'IME and number-coercion bugs surface in international and financial apps respectively.',
      'Debouncing must wrap the side effect, not the binding, or characters can be dropped.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-model = value binding (down) + event listener (up).',
    'Text: :value + @input. Checkbox: :checked + @change. Select: :value + @change.',
    'Modifiers: .lazy (change), .number (coerce), .trim.',
    'Group of checkboxes + array v-model collects values.',
    'Component v-model = :modelValue + @update:modelValue.',
    'Named: v-model:title → :title + @update:title (multiple allowed).',
    'Vue 3.4+: defineModel() generates the prop + emit + writable ref.',
    'Child must EMIT, never mutate the modelValue prop.',
    'It is sugar — one-way data flow underneath.',
    'IME composition delays updates until composition ends.',
    'Writable computed needs get/set to be v-model-able.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Bind a text input to a ref called email and display it live below the input.',
      hint: 'Use v-model on the input.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst email = ref(\'\')\n</script>\n\n<template>\n  <input v-model="email" type="email" />\n  <p>You typed: {{ email }}</p>\n</template>',
        explanation: [
          'v-model="email" keeps the input and the ref in sync both ways.',
          'The interpolation re-renders whenever email changes.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Bind a number input so that the bound value is a real Number, and update only when the field loses focus.',
      hint: 'Combine the .number and .lazy modifiers.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst qty = ref(1)\n</script>\n\n<template>\n  <input v-model.number.lazy="qty" type="number" />\n  <p>{{ typeof qty }} = {{ qty }}</p>\n</template>',
        explanation: [
          '.number coerces the string to a Number so arithmetic works.',
          '.lazy switches the sync to the change event, so qty updates on blur, not each keystroke.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a reusable ToggleSwitch component that supports v-model (boolean) without mutating its prop.',
      hint: 'Use modelValue prop + emit update:modelValue (or defineModel).',
      solution: {
        lang: 'vue',
        code: '<!-- ToggleSwitch.vue -->\n<script setup>\nconst props = defineProps({ modelValue: Boolean })\nconst emit = defineEmits([\'update:modelValue\'])\nfunction toggle() { emit(\'update:modelValue\', !props.modelValue) }\n</script>\n<template>\n  <button role="switch" :aria-checked="modelValue" @click="toggle">\n    {{ modelValue ? \'ON\' : \'OFF\' }}\n  </button>\n</template>\n\n<!-- usage -->\n<!-- <ToggleSwitch v-model="enabled" /> -->',
        explanation: [
          'The component reads modelValue as a prop and never mutates it.',
          'Clicking emits update:modelValue with the negated value, letting the parent flip its state.',
          'v-model="enabled" on the parent wires :modelValue and @update:modelValue automatically.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a component with TWO independent v-models (v-model:first and v-model:last) using defineModel.',
      hint: 'Call defineModel with a name argument for each.',
      solution: {
        lang: 'vue',
        code: '<!-- NameFields.vue -->\n<script setup>\nconst first = defineModel(\'first\')\nconst last = defineModel(\'last\')\n</script>\n<template>\n  <input v-model="first" placeholder="First" />\n  <input v-model="last" placeholder="Last" />\n</template>\n\n<!-- Parent -->\n<!-- <NameFields v-model:first="fn" v-model:last="ln" /> -->',
        explanation: [
          'defineModel(\'first\') returns a writable ref wired to the first prop and update:first event; same for last.',
          'Using v-model:first and v-model:last on the parent creates two independent two-way bindings on one component.',
          'No manual props/emit are needed — defineModel generates both.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'v-model is the most-used directive for forms, so fluency is assumed. Explaining its desugaring and the component contract instantly shows you understand Vue\'s data flow, not just its syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Wipro) ask "what is v-model" and the modifiers. Product companies (Zoho, Flipkart, Razorpay) ask the desugaring, custom-component v-model, and named/multiple v-models. FAANG-level rounds probe why it preserves one-way flow, defineModel internals, IME edge cases, and writable computeds.',
    whatInterviewersExpect:
      'Define v-model as value-down + event-up sugar, give the exact text-input desugaring, know .lazy/.number/.trim, explain the Vue 3 component contract (modelValue/update:modelValue, defineModel, named v-models), and articulate why it never breaks one-way data flow.',
  },
}

export default vModel
