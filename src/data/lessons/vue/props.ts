import type { ConceptLesson } from '../../../types/lesson'

const props: ConceptLesson = {
  // 1. Concept Summary
  slug: 'props',
  name: 'Props',
  category: 'components',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Props are how data flows INTO a component — the single most-used mechanism for making components reusable and configurable.',
    'Understanding one-way data flow (props down) is the cornerstone of predictable Vue architecture.',
    'Almost every interview includes "how does a parent pass data to a child?" — the answer is props.',
    'Mishandling props (mutating them, wrong types, missing keys) causes a large share of real Vue bugs and console warnings.',
    'Typed props with TypeScript or runtime validation form the contract between components, which matters hugely in team codebases.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Props are like the settings you choose when ordering a pizza — the kitchen makes the pizza, you just tell it the toppings.',
    story: [
      'Imagine a pizza shop. You do not go into the kitchen and cook; you fill out an order: medium size, extra cheese, no olives.',
      'The kitchen reads your order and makes exactly that pizza. You gave it instructions from outside, and it followed them.',
      'You cannot reach into the kitchen and stir the pot yourself — you only choose the settings on the order form.',
      'A component is the kitchen, and props are the order form. The parent fills in the settings, the component reads them and renders accordingly, but the component is not allowed to scribble new things back onto your order form.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A component often needs information from the outside to do its job — a button needs its label, a card needs its title.',
    'Props are named inputs a component declares. The parent passes values to those names when it uses the component, like attributes on a tag.',
    'Data flows one way: from parent down to child. The child can read props but should not change them, because the parent owns that data.',
    'If a child needs to request a change, it sends a message back up (an event) instead of editing the prop directly. This keeps the flow predictable.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Props are custom attributes a component declares to receive data from its parent. They are read-only inside the child and form the component\'s input interface.',
    how: 'The child declares props with defineProps; the parent binds values using v-bind (the : shorthand). Static strings pass as plain attributes; dynamic values use :prop="expression".',
    why: 'Props make components reusable and configurable, and they enforce one-way data flow so state stays predictable and easy to trace.',
    code: {
      label: 'Declaring and passing props',
      lang: 'vue',
      code: '<!-- UserBadge.vue (child) -->\n<script setup>\nconst props = defineProps([\'name\', \'role\'])\n</script>\n<template>\n  <span>{{ props.name }} ({{ props.role }})</span>\n</template>\n\n<!-- Parent -->\n<script setup>\nimport UserBadge from \'./UserBadge.vue\'\nconst me = { name: \'Asha\', role: \'admin\' }\n</script>\n<template>\n  <UserBadge name="Static Sam" role="guest" />\n  <UserBadge :name="me.name" :role="me.role" />\n</template>',
      explanation: [
        'defineProps([\'name\',\'role\']) declares two inputs.',
        'The first usage passes static strings; the second binds dynamic values with `:`.',
        'Inside the child, props are accessed via the returned `props` object (or directly in the template).',
        'Props are read-only — the child renders them but never reassigns them.',
        'Reusing the component with different props produces different output.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Props are a component\'s declared input interface: named, externally-supplied values bound by the parent. Vue resolves props for each instance from the parent\'s rendered vnode, makes them reactive and read-only within the child, and re-renders the child when a prop value changes. Props enforce one-way (top-down) data flow; declaring them with types/validators or TypeScript creates a checked contract between parent and child.',

  // 7. Internal Working
  internalWorking: [
    'The template compiler turns parent bindings like :name="me.name" into a props object attached to the child component vnode.',
    'When Vue creates the child instance, it separates declared props from fallthrough attributes using the component\'s props definition.',
    'Resolved props are exposed through a reactive, shallow-readonly proxy so the template re-renders when a prop changes but the child cannot legally mutate them.',
    'Each prop access inside the child is tracked by the reactivity system; when the parent re-renders and a prop value differs, Vue patches the child instead of recreating it.',
    'If a prop is omitted, Vue applies its declared default (calling a factory for objects/arrays) before the child reads it.',
    'In development, type/validator declarations run and emit console warnings on mismatch; in production these checks are stripped for performance.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Parent (owns the data)
   ┌──────────────────────────┐
   │ const me = { name, role }│
   └─────────────┬────────────┘
                 │  :name / :role   (props DOWN, read-only)
                 ▼
   ┌──────────────────────────┐
   │ Child component          │
   │   reads props.name       │  ✗ cannot reassign props.name
   │   renders output         │
   └─────────────┬────────────┘
                 │  emit('update') (events UP to request change)
                 ▲
   back to parent ─ parent updates its own data → re-render`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — single prop',
      lang: 'vue',
      code: '<!-- Title.vue -->\n<script setup>\ndefineProps([\'text\'])\n</script>\n<template>\n  <h1>{{ text }}</h1>\n</template>\n\n<!-- usage -->\n<Title text="Welcome" />',
      explanation: [
        'One prop, `text`, declared as a string array entry.',
        'In the template props can be used directly by name.',
        'The static string "Welcome" is passed without a colon.',
        'The component renders whatever text the parent gives it.',
      ],
    },
    intermediate: {
      label: 'Intermediate — typed props with defaults (object syntax)',
      lang: 'vue',
      code: '<!-- PriceTag.vue -->\n<script setup>\nconst props = defineProps({\n  amount: { type: Number, required: true },\n  currency: { type: String, default: \'USD\' },\n  onSale: { type: Boolean, default: false },\n})\n</script>\n<template>\n  <span :class="{ sale: props.onSale }">\n    {{ props.currency }} {{ props.amount }}\n  </span>\n</template>',
      explanation: [
        'Object syntax lets you declare type, required, and default per prop.',
        '`amount` is required — omitting it warns in development.',
        '`currency` defaults to USD when not provided.',
        'Boolean props default sensibly and support shorthand (presence = true).',
        'Defaults are applied before the child reads the prop.',
      ],
    },
    advanced: {
      label: 'Advanced — TypeScript props with withDefaults',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { computed } from \'vue\'\ninterface Props {\n  items: string[]\n  max?: number\n  variant?: \'list\' | \'grid\'\n}\nconst props = withDefaults(defineProps<Props>(), {\n  max: 10,\n  variant: \'list\',\n})\nconst visible = computed(() => props.items.slice(0, props.max))\n</script>\n<template>\n  <ul :class="props.variant">\n    <li v-for="(item, i) in visible" :key="i">{{ item }}</li>\n  </ul>\n</template>',
      explanation: [
        'Type-only defineProps<Props>() gives compile-time prop typing with no runtime declaration.',
        'withDefaults supplies defaults for optional props.',
        'The literal union `variant` restricts allowed values at compile time.',
        'computed derives visible items from the typed props reactively.',
        'TypeScript catches wrong prop types in the editor before runtime.',
      ],
    },
    realProject: {
      label: 'Real project — configurable data table column',
      lang: 'vue',
      code: '<!-- DataCell.vue -->\n<script setup lang="ts">\ninterface Props {\n  value: string | number\n  align?: \'left\' | \'right\' | \'center\'\n  bold?: boolean\n}\nconst props = withDefaults(defineProps<Props>(), { align: \'left\', bold: false })\n</script>\n<template>\n  <td :style="{ textAlign: props.align, fontWeight: props.bold ? 700 : 400 }">\n    {{ props.value }}\n  </td>\n</template>\n\n<!-- used inside a row component -->\n<DataCell :value="row.total" align="right" bold />',
      explanation: [
        'A reusable table cell driven entirely by props.',
        'Typed props document the cell\'s configuration contract.',
        'The parent row controls alignment, weight, and value per cell.',
        'Boolean prop `bold` uses shorthand (presence implies true).',
        'One small component, reused for every cell with different settings.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are props in Vue?',
      answer: 'Custom attributes a component declares to receive data from its parent. They are read-only inside the child and form the component\'s input interface.',
      explanation: 'A complete answer mentions both "input from parent" and "read-only / one-way".',
    },
    {
      level: 'beginner',
      question: 'How do you pass a dynamic value as a prop?',
      answer: 'Bind it with v-bind or its : shorthand: :title="post.title". Without the colon the value is a literal string.',
      explanation: 'The static-vs-dynamic distinction (with/without :) is a classic beginner check.',
    },
    {
      level: 'intermediate',
      question: 'Can a child mutate a prop? Why or why not?',
      answer: 'No — props are one-way and read-only. Mutating them breaks data flow and warns in dev. To change the source, emit an event or use v-model; for local derived state, copy the prop into a ref or computed.',
      explanation: 'The reasoning about ownership and predictability is what interviewers want, not just "no".',
    },
    {
      level: 'intermediate',
      question: 'How do prop defaults for objects and arrays work?',
      answer: 'They must be provided via a factory function (default: () => ([])) because objects/arrays are reference types; a shared default object would be reused across instances and cause cross-instance bugs.',
      explanation: 'The factory requirement is a frequent gotcha that distinguishes careful candidates.',
    },
    {
      level: 'advanced',
      question: 'How do you type props with TypeScript and provide defaults?',
      answer: 'Use type-only defineProps<Props>() with an interface, and wrap it in withDefaults(defineProps<Props>(), { ... }) to supply defaults for optional props.',
      explanation: 'Shows fluency with the modern <script setup lang="ts"> prop workflow.',
    },
    {
      level: 'senior',
      question: 'What happens internally when a parent updates a value bound to a child prop?',
      answer: 'The parent re-renders, producing a new child vnode with the new props object; Vue diffs it against the previous child vnode and patches the same child instance (it is not recreated). The prop\'s reactive read triggers only the affected parts of the child to re-render.',
      explanation: 'Connecting prop updates to vdom diffing and instance reuse is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between props and data/state?',
    'How do you handle a prop you need to also edit locally? (copy into ref/computed)',
    'What is prop validation and how do you add it? (links to prop-validation)',
    'How does attribute fallthrough relate to props?',
    'What is the difference between camelCase prop declarations and kebab-case in templates?',
    'How do you make a prop two-way bindable? (v-model on components)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating a prop directly inside the child.',
      why: 'Props are read-only; the change is illegal, warns in dev, and can be overwritten when the parent re-renders.',
      fix: 'Emit an event to ask the parent to change its data, use v-model, or copy the prop into a local ref/computed for derived state.',
    },
    {
      mistake: 'Using a plain object/array as a prop default instead of a factory.',
      why: 'Reference-type defaults are shared across all instances, so mutating one instance\'s default leaks into others.',
      fix: 'Use a factory: default: () => ([]) or default: () => ({}).',
    },
    {
      mistake: 'Forgetting the colon and passing "true" as a string instead of boolean true.',
      why: 'foo="true" passes the string "true"; :foo="true" passes the boolean.',
      fix: 'Use v-bind (:) whenever the value is not a literal string.',
    },
    {
      mistake: 'Naming mismatch between camelCase declaration and template attribute.',
      why: 'A prop declared userName is passed as :user-name in templates (kebab-case); mismatches silently fail to bind.',
      fix: 'Declare props in camelCase and pass them in kebab-case in DOM templates (SFC templates accept either).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every reusable component (buttons, inputs, cards, tables) exposes a typed props API as its configuration surface.' },
    { area: 'Component library', detail: 'Design systems treat props as the public contract — documented, typed, and versioned so consumers can rely on them.' },
    { area: 'Nuxt', detail: 'Page and layout components receive route data and config via props; definePageMeta and props combine to configure pages.' },
    { area: 'TypeScript', detail: 'Type-only defineProps with interfaces gives end-to-end type safety from parent binding to child usage.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Stable, primitive props let Vue skip re-rendering children whose props did not change.',
      'Typed props catch mistakes at compile time, avoiding runtime re-render churn from bad data.',
    ],
    bad: [
      'Passing freshly-created object/array literals each render forces the child to re-render every time.',
      'Deeply nested reactive object props can trigger broad re-renders when any nested field changes.',
    ],
    optimizations: [
      'Avoid inline object/array literals as props; hoist or memoize them so references stay stable.',
      'Pass primitives where possible, or use shallowRef for large objects you do not need deeply reactive.',
      'Use v-memo on expensive child subtrees keyed by the props that matter.',
      'Keep prop shapes flat to limit reactive tracking overhead.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'v-bind'],
    nextConcepts: ['prop-validation', 'component-events', 'v-model-components', 'attribute-fallthrough'],
    dependencyNote:
      'Props build directly on components-basics and v-bind. They pair with component-events to complete the props-down/events-up loop, and lead into prop-validation (typed contracts) and v-model-components (two-way binding).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a parent box holding some data (e.g. user object).',
      'Draw a child box below it.',
      'Draw a downward arrow labelled ":prop = value (read-only)" from parent to child.',
      'Draw an upward arrow labelled "emit(event)" from child to parent.',
      'Say: "Data flows down via props, which the child can read but not mutate; to change it the child emits an event and the parent updates its own state."',
    ],
    diagram: `   ┌── Parent (owns data) ──┐
   │  user = {...}           │
   └──────────┬──────────────┘
              │ :user (props down, read-only)
              ▼
   ┌── Child (reads props) ──┐
   │  reads props.user       │
   └──────────┬──────────────┘
              │ emit('update') (events up)
              ▲`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Props are the named inputs a component declares to receive data from its parent. They are read-only inside the child and flow one way, parent to child. Declare them with defineProps (array, object with type/required/default, or type-only with TypeScript and withDefaults). Object/array defaults need a factory function. A child must never mutate a prop — to change the data it emits an event or uses v-model. Props are the component\'s public configuration contract.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Props are how data flows into a Vue component — they are the named inputs a child declares to receive values from its parent, and they form the component\'s public input interface. You declare them with defineProps, which has three flavours: an array of names for quick cases, an object syntax where each prop specifies type, required, and a default, or in TypeScript a type-only defineProps with an interface, optionally wrapped in withDefaults to supply defaults. The parent passes values as attributes — a plain attribute for a static string, or v-bind with the colon shorthand for any dynamic expression. The defining principle is one-way data flow: props go down from parent to child, and they are read-only inside the child. The child can render and derive from them but must never reassign them, because the parent owns that data. If a child needs to change something, it emits an event so the parent updates its own state, or you use v-model for two-way binding. A subtle but important rule is that object and array defaults must come from a factory function, because reference-type defaults would otherwise be shared across all instances and leak mutations between them. Internally, the compiler turns parent bindings into a props object on the child vnode; Vue exposes them through a shallow-readonly reactive proxy, so when a prop changes the parent re-renders and Vue patches the same child instance rather than recreating it. In dev, declared types and validators produce warnings on mismatch; in production those checks are stripped. Well-designed props — typed, defaulted, documented — are the contract that makes components reusable and team codebases maintainable.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Many fine-grained props give precise control but bloat the API; a single config object prop is compact but loses per-prop validation and reactivity granularity.',
      'Type-only props (TS) lose runtime validation; object syntax gives runtime checks but more verbosity — pick based on whether inputs come from untyped sources.',
    ],
    edgeCases: [
      'Object/array default factories vs shared reference bugs across instances.',
      'Boolean prop shorthand and casting rules (presence = true, "false" string pitfalls).',
      'Mutating a nested field of an object prop does not warn (only reassignment does) yet still violates one-way flow.',
      'Prop name casing: camelCase in script, kebab-case in DOM templates.',
    ],
    runtimeBehavior: [
      'Props are exposed via a shallow-readonly reactive proxy; reads are tracked for re-render.',
      'A parent re-render produces a new props object; Vue diffs and patches the same child instance.',
      'Validation/type checks run only in development and are tree-shaken out of production.',
    ],
    scalability: [
      'Deep prop-drilling across many layers does not scale — switch to provide/inject or a store.',
      'Unstable object/array prop references cause cascading child re-renders in large trees; stabilise references.',
    ],
    productionConcerns: [
      'Inconsistent prop contracts across a codebase slow teams — enforce typed, documented props via a component library.',
      'Silent failures from casing mismatches or wrong types in untyped data — validate at the boundary.',
      'Large reactive object props can over-trigger renders; consider shallowRef or flattening.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Props = component inputs declared with defineProps.',
    'One-way flow: props DOWN, read-only in the child.',
    'Static: prop="text"; dynamic: :prop="expr".',
    'Object syntax: { type, required, default, validator }.',
    'TS: defineProps<Props>() + withDefaults(...).',
    'Object/array defaults MUST be a factory: () => ([]).',
    'Never mutate a prop — emit an event or use v-model.',
    'camelCase in script ↔ kebab-case in DOM templates.',
    'Validation runs in dev only, stripped in production.',
    'Unstable object/array prop refs cause extra child re-renders.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Greeting.vue with a required string prop `name` and render "Hello, {name}".',
      hint: 'Use object syntax with type and required.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps({ name: { type: String, required: true } })\n</script>\n<template>\n  <p>Hello, {{ name }}</p>\n</template>',
        explanation: [
          'name is declared as a required String.',
          'Omitting it warns in development.',
          'The template interpolates the prop directly.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create a Tag.vue with props `label` (string) and `color` (string, default "gray"), applying the color as inline style.',
      hint: 'Provide a default for color.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst props = defineProps({\n  label: { type: String, required: true },\n  color: { type: String, default: \'gray\' },\n})\n</script>\n<template>\n  <span :style="{ background: props.color }">{{ props.label }}</span>\n</template>',
        explanation: [
          'color defaults to gray when not passed.',
          'The default is applied before the child renders.',
          ':style binds the color reactively.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A child receives an `initialCount` prop but needs an editable local counter. Show the correct pattern.',
      hint: 'Do not mutate the prop — seed a local ref from it.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst props = defineProps({ initialCount: { type: Number, default: 0 } })\nconst count = ref(props.initialCount) // local copy, editable\n</script>\n<template>\n  <button @click="count++">Count: {{ count }}</button>\n</template>',
        explanation: [
          'The prop seeds a local ref; the prop itself is never mutated.',
          'The component can freely edit `count` without violating one-way flow.',
          'If the parent must know the new value, also emit an event on change.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a typed Alert.vue (TypeScript) with props: message (string, required), type ("info" | "warn" | "error", default "info"), and dismissible (boolean, default false).',
      hint: 'Use type-only defineProps + withDefaults with a literal union.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ninterface Props {\n  message: string\n  type?: \'info\' | \'warn\' | \'error\'\n  dismissible?: boolean\n}\nconst props = withDefaults(defineProps<Props>(), {\n  type: \'info\',\n  dismissible: false,\n})\n</script>\n<template>\n  <div :class="[\'alert\', props.type]">\n    {{ props.message }}\n    <button v-if="props.dismissible">×</button>\n  </div>\n</template>',
        explanation: [
          'Type-only defineProps gives compile-time prop typing.',
          'withDefaults supplies defaults for the optional props.',
          'The literal union restricts `type` to three valid values, caught by TypeScript.',
          'dismissible toggles the close button conditionally.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Props are the most fundamental data-flow mechanism in Vue. Master them and you understand how components are configured, reused, and kept predictable through one-way flow — knowledge that underpins events, v-model, validation, and state management.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how does a parent pass data to a child?" and the static-vs-dynamic binding difference. Product companies (Zoho, Flipkart, Razorpay) ask why props are read-only and how to handle editable local state. FAANG-level interviews probe default factories, TypeScript typing, and how prop updates flow through the vdom.',
    whatInterviewersExpect:
      'They expect you to declare props correctly, explain one-way read-only flow, demonstrate the events-up pattern for changes, and avoid the classic mutation and reference-default mistakes.',
  },
}

export default props
