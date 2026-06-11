import type { ConceptLesson } from '../../../types/lesson'

const provideInjectState: ConceptLesson = {
  // 1. Concept Summary
  slug: 'provide-inject-state',
  name: 'Provide/Inject for State',
  category: 'state',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'provide/inject is Vue\'s built-in way to share state down a component subtree without prop-drilling through every intermediate layer.',
    'It is the right tool — better than a global store — when state is inherently scoped to one subtree, like a form, a wizard, or a tabs container.',
    'It is the foundation of headless/compound component patterns (Tabs/Tab, Accordion/Item) used by every serious Vue component library.',
    'Getting reactivity right with provide/inject (provide refs/reactive, not raw values) is a common source of "why does my injected value not update" bugs.',
    'Interviewers use it to test whether you understand scoping, the difference vs a global store, and how to keep injected state controlled and read-only.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'provide/inject is like a family handing down a household rule that everyone in the house follows, but the neighbours never hear about it.',
    story: [
      'Imagine a parent puts a jar of cookies on a high shelf and tells the family: "anyone in this house can take a cookie."',
      'Every child, grandchild, and visitor inside the house can reach the jar without the parent walking each cookie to each room one by one.',
      'But the family next door cannot reach this jar at all — it only belongs to this house.',
      'provide is the parent putting the jar up and announcing the rule; inject is any family member reaching for it. The "house" is the component subtree, so only descendants can use it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally to give data to a deeply nested component you pass it as props through every component in between, even ones that do not need it — that is tedious "prop-drilling".',
    'provide/inject lets a parent component "provide" some data, and any descendant — no matter how deep — can "inject" and use it directly.',
    'The catch: it only works downward, to children and their children, not to unrelated components elsewhere.',
    'To make injected data update when it changes, you must provide a reactive value (a ref or reactive object), not a plain snapshot.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'provide/inject is a Vue dependency-injection mechanism: an ancestor calls provide(key, value) and any descendant calls inject(key) to read it, bypassing intermediate props. For shared STATE, you provide reactive values (refs/reactive) plus updater functions.',
    how: 'In the provider you create reactive state and call provide(key, { state, update }). Descendants call inject(key) to get the same reactive object and the updaters, so they stay in sync and can request changes through the provided functions.',
    why: 'It removes prop-drilling for subtree-scoped state and keeps that state naturally scoped: when the provider unmounts, the state goes with it, and other subtrees get their own independent copy.',
    code: {
      label: 'Providing reactive state to descendants',
      lang: 'vue',
      code: '<!-- Provider.vue -->\n<script setup>\nimport { reactive, provide, readonly } from \'vue\'\nconst state = reactive({ count: 0 })\nfunction increment() { state.count++ }\nprovide(\'counter\', { state: readonly(state), increment })\n</script>\n\n<!-- DeepChild.vue (any depth below) -->\n<script setup>\nimport { inject } from \'vue\'\nconst { state, increment } = inject(\'counter\')\n</script>\n<template>\n  <button @click="increment">{{ state.count }}</button>\n</template>',
      explanation: [
        'The provider creates reactive state and provides it together with an updater.',
        'readonly(state) lets descendants read but not directly mutate — changes go through increment.',
        'inject(\'counter\') in any descendant returns the SAME object, so it stays reactive.',
        'No intermediate component had to pass count as a prop.',
        'When Provider unmounts, this state is gone — it is scoped to the subtree.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'provide/inject is Vue\'s built-in dependency injection across the component tree. An ancestor registers a value under a key on its component instance via provide(); descendants resolve it by walking up the parent chain at inject() time, reading from the nearest ancestor that provided that key. The binding is scoped to the subtree, so it is suited to subtree-local shared state (forms, wizards, compound components). Reactivity is preserved only when the provided value is itself reactive (ref/reactive); to keep state controlled, you provide readonly views plus updater functions and use Symbol keys to avoid collisions.',

  // 7. Internal Working
  internalWorking: [
    'provide(key, value) stores the value in the current component instance\'s provides object during setup; the instance\'s provides prototypically inherits from its parent\'s provides, forming a chain.',
    'inject(key) reads from the current instance\'s provides, which resolves up the prototype chain to the nearest ancestor that provided that key.',
    'Because resolution uses the parent chain at injection time, only descendants of the provider can inject — siblings and unrelated trees cannot.',
    'If the provided value is a ref or reactive object, descendants reading it register as reactive subscribers, so mutations re-render them through the normal track/trigger core.',
    'If you provide a plain primitive, descendants get a one-time snapshot with no reactive link, which is the classic non-updating bug.',
    'When the provider component unmounts, its provides chain entry is gone, so the scoped state is released and independent provider instances hold independent state.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '          provide(\'form\', reactive state + updaters)\n          ┌──────────────── FormRoot (provider) ────────────────┐\n          │  provides: { form: {state, setField} }               │\n          │        │ (prototype chain)                           │\n          │   ┌────▼─────┐        ┌──────────┐                    │\n          │   │ Fieldset │        │  Section  │                   │\n          │   └────┬─────┘        └────┬─────┘                    │\n          │   ┌────▼─────┐        ┌────▼──────┐                   │\n          │   │  Input   │ inject │  Input    │ inject            │\n          │   │ (\'form\') │◄───────│ (\'form\')  │  same object       │\n          │   └──────────┘        └───────────┘                   │\n          └──────────────────────────────────────────────────────┘\n   Sibling tree outside FormRoot CANNOT inject \'form\' (scoped to subtree).',

  // 9. Memory Visualization
  memoryVisualization: [
    'The provided value lives on the provider component instance\'s provides object.',
    'Descendant instances hold a reference to it via the prototype-chained provides, so it stays alive while any of them (and the provider) are mounted.',
    'Two separate provider instances (e.g. two forms on a page) each hold their own state object — no sharing between them.',
    'When the provider unmounts, the provides entry is dropped; if no descendant retains it, the state becomes collectible — scoping doubles as cleanup.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — provide a ref, inject reactively',
      lang: 'js',
      code: '// provider setup\nimport { ref, provide } from \'vue\'\nconst theme = ref(\'light\')\nprovide(\'theme\', theme)\n\n// descendant setup\nimport { inject } from \'vue\'\nconst theme = inject(\'theme\')   // same ref, stays reactive\n// theme.value updates propagate to this component',
      explanation: [
        'Providing a ref keeps the connection reactive in descendants.',
        'inject returns the same ref, so theme.value changes re-render consumers.',
        'No intermediate component needed to pass theme down.',
        'Providing theme.value (a string) instead would break reactivity.',
      ],
    },
    intermediate: {
      label: 'Intermediate — Symbol keys and a typed contract',
      lang: 'js',
      code: '// keys.js\nexport const FormKey = Symbol(\'form\')\n\n// provider\nimport { reactive, provide, readonly } from \'vue\'\nimport { FormKey } from \'./keys\'\nconst values = reactive({})\nfunction setField(name, v) { values[name] = v }\nprovide(FormKey, { values: readonly(values), setField })\n\n// consumer\nimport { inject } from \'vue\'\nimport { FormKey } from \'./keys\'\nconst form = inject(FormKey)\nif (!form) throw new Error(\'must be used inside <FormRoot>\')',
      explanation: [
        'A Symbol key avoids string collisions across libraries/teams.',
        'readonly(values) exposes read access; mutation must go through setField.',
        'The consumer guards against missing provider (used outside the subtree).',
        'This key + contract pattern is how component libraries expose injection points.',
        'With TypeScript you use InjectionKey<T> for full type inference.',
      ],
    },
    advanced: {
      label: 'Advanced — compound component (Tabs/Tab) via injection',
      lang: 'vue',
      code: '<!-- Tabs.vue -->\n<script setup>\nimport { ref, provide } from \'vue\'\nconst active = ref(0)\nprovide(\'tabs\', { active, select: (i) => (active.value = i) })\n</script>\n<template><slot /></template>\n\n<!-- Tab.vue -->\n<script setup>\nimport { inject } from \'vue\'\nconst { active, select } = inject(\'tabs\')\nconst props = defineProps({ index: Number })\n</script>\n<template>\n  <button :class="{ on: active === props.index }" @click="select(props.index)">\n    <slot />\n  </button>\n</template>',
      explanation: [
        'Tabs provides shared active state and a select function to all nested Tab children.',
        'Each Tab injects the same state — no props passed between Tabs and Tab.',
        'This is the compound-component pattern: parent owns state, children consume it implicitly.',
        'Two <Tabs> on a page each provide independent active state (subtree scoping).',
        'Headless UI libraries (Radix-style) are built on exactly this mechanism.',
      ],
    },
    realProject: {
      label: 'Real project — multi-step wizard with subtree state',
      lang: 'js',
      code: '// WizardRoot.vue setup\nimport { reactive, provide, readonly } from \'vue\'\nconst wizard = reactive({ step: 0, data: {} })\nfunction next() { wizard.step++ }\nfunction setData(patch) { Object.assign(wizard.data, patch) }\nprovide(\'wizard\', { state: readonly(wizard), next, setData })\n\n// StepTwo.vue setup\nimport { inject } from \'vue\'\nconst { state, next, setData } = inject(\'wizard\')\n// read state.step / state.data; call setData({...}); next()',
      explanation: [
        'The wizard owns step + collected data, scoped to this wizard instance.',
        'Each step injects the shared state and the next/setData controllers.',
        'A global store would be overkill — the state dies with the wizard.',
        'readonly prevents steps from corrupting shared state directly.',
        'Multiple wizards (e.g. in different modals) stay independent.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem does provide/inject solve?',
      answer: 'It avoids prop-drilling: an ancestor provides a value and any descendant injects it directly, without passing it through every intermediate component as props.',
      explanation: 'Naming prop-drilling and the ancestor→descendant flow covers the basics.',
    },
    {
      level: 'beginner',
      question: 'Is provide/inject reactive by default?',
      answer: 'Only if you provide a reactive value. Providing a ref or reactive object keeps descendants in sync; providing a plain primitive gives a one-time snapshot with no reactive updates.',
      explanation: 'The reactivity caveat is the most common beginner mistake.',
    },
    {
      level: 'intermediate',
      question: 'How does provide/inject differ from a Pinia store?',
      answer: 'provide/inject is scoped to a component subtree (only descendants can inject, and state dies with the provider), while a Pinia store is global and accessible anywhere. Use provide/inject for subtree-coupled state (forms, tabs); use a store for app-wide state needing devtools/persistence/SSR.',
      explanation: 'Scope is the defining difference; pairing each with a use case shows judgement.',
    },
    {
      level: 'intermediate',
      question: 'Why use a Symbol as an injection key?',
      answer: 'To avoid name collisions between unrelated providers (e.g. two libraries both using the string \'form\') and, with InjectionKey<T>, to get full TypeScript inference for the injected value.',
      explanation: 'Collision avoidance plus typing are both expected.',
    },
    {
      level: 'advanced',
      question: 'How would you keep injected state controlled/read-only for consumers?',
      answer: 'Provide a readonly() view of the state plus explicit updater functions, so descendants can read and request changes but cannot mutate the shared object directly, keeping mutation logic centralized in the provider.',
      explanation: 'readonly + updaters is the controlled-injection pattern used in libraries.',
    },
    {
      level: 'senior',
      question: 'How is provide/inject resolved internally and what are the scoping implications?',
      answer: 'Each instance has a provides object that prototypically inherits from its parent\'s; provide() writes to it and inject() resolves up that chain to the nearest provider. Therefore only descendants can inject, sibling subtrees are isolated, and separate provider instances hold independent state — the mechanism is dependency injection scoped by the render tree, not a global registry.',
      explanation: 'The prototype-chained provides and tree-scoped resolution is the senior-level internal answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What happens if you inject a key that was never provided? (returns undefined unless a default is given)',
    'Can a child override a provided value for its own descendants? (yes — it provides again with the same key)',
    'Why does providing theme.value instead of theme break reactivity?',
    'How do you type provide/inject with TypeScript? (InjectionKey<T>)',
    'When should you prefer a store over provide/inject?',
    'How does provide/inject power compound components?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Providing a plain value (e.g. ref.value) instead of the ref/reactive object.',
      why: 'Descendants get a static snapshot and never update when the source changes.',
      fix: 'Provide the ref or reactive object itself so the reactive link is preserved.',
    },
    {
      mistake: 'Letting descendants mutate the injected state directly.',
      why: 'Scattered mutation makes changes untraceable and can corrupt shared state.',
      fix: 'Provide readonly(state) plus updater functions; route all changes through them.',
    },
    {
      mistake: 'Using string keys that collide with other providers/libraries.',
      why: 'A nested provider or a library using the same string silently shadows yours.',
      fix: 'Use Symbol (or InjectionKey<T>) keys exported from a shared module.',
    },
    {
      mistake: 'Using provide/inject for app-wide state.',
      why: 'It only reaches descendants and lacks devtools/persistence/SSR tooling.',
      fix: 'Use a Pinia store for global state; reserve provide/inject for subtree scope.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Forms, wizards, and tab/accordion containers provide subtree state so deeply nested fields/items read it without prop-drilling.' },
    { area: 'Component library', detail: 'Compound and headless components (Tabs/Tab, Menu/MenuItem) use provide/inject to share state implicitly between parent and children, often with Symbol keys.' },
    { area: 'Pinia', detail: 'Apps mix the two: provide/inject for component-scoped state and Pinia for global state, choosing by scope.' },
    { area: 'Nuxt', detail: 'Plugins provide app-level dependencies (clients, config) via provide so any component can inject them.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Avoids prop-drilling, so intermediate components do not re-render just to pass data through.',
      'Reactivity is granular — only injecting consumers that read changed reactive properties re-render.',
    ],
    bad: [
      'Providing a large reactive object that many descendants read can fan out re-renders on any property change.',
      'Overusing injection for unrelated values makes data flow implicit and harder to trace.',
    ],
    optimizations: [
      'Provide readonly views and split state so consumers subscribe only to what they need.',
      'Provide refs of derived/computed values rather than recomputing in each consumer.',
      'Prefer props for shallow parent-child passing; reserve inject for genuinely deep sharing.',
      'Use Symbol keys and explicit contracts to keep injection points discoverable.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['provide-inject', 'reactive', 'ref', 'state-management-overview'],
    nextConcepts: ['pinia-basics', 'state-sharing-composables', 'compound-components', 'headless-components'],
    dependencyNote:
      'This applies the general provide-inject feature specifically to sharing state, building on reactive/ref. It contrasts with pinia-basics (global) and underpins compound-components/headless-components patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a provider component at the top with provide(key, reactive state + updaters).',
      'Draw several layers of children below it; mark deep ones calling inject(key).',
      'Draw an arrow showing inject resolving UP the parent chain to the provider.',
      'Draw a sibling subtree outside the provider and cross out its ability to inject.',
      'Say: "It is dependency injection scoped to the render tree — descendants only — and reactivity holds because I provide a ref/reactive plus readonly + updaters."',
    ],
    diagram: '  Provider  provide(KEY, {state, update})\n     │ (provides chain)\n     ├── Middle (passes nothing)\n     │      └── Deep  inject(KEY) ──┐ reads same reactive state\n     └── Other ── inject(KEY) ───────┘\n  --------------------------------------------\n  Sibling (outside)  inject(KEY) → undefined (not a descendant)',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'provide/inject shares state down a component subtree without prop-drilling: an ancestor calls provide(key, value) and any descendant calls inject(key). It is scoped — only descendants can inject and the state dies with the provider — making it ideal for forms, wizards, and compound components, and the wrong tool for app-wide state (use Pinia). Provide a ref or reactive object to keep it reactive, expose readonly + updater functions for control, and use Symbol keys to avoid collisions.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'provide/inject is Vue\'s built-in dependency injection for sharing data down the component tree. An ancestor calls provide with a key and a value, and any descendant — no matter how deep — calls inject with that key to read it, completely bypassing the intermediate components, which solves prop-drilling. The key thing about it is scope: internally each component instance has a provides object that prototypically inherits from its parent\'s, so inject resolves up that chain to the nearest provider. That means only descendants can inject; sibling subtrees are isolated, and two separate provider instances hold completely independent state. That scoping is exactly why it shines for subtree-local state — a form whose deeply nested inputs all need the shared form object, a multi-step wizard, or compound components like Tabs and Tab where the parent owns state and the children consume it implicitly. It is the wrong tool for app-wide state, where a Pinia store gives you global access plus devtools, persistence, and SSR support. There are two reactivity rules to respect. First, you must provide a reactive value — a ref or a reactive object — because if you provide a plain primitive, descendants only get a one-time snapshot and never update; that is the classic non-updating bug. Second, to keep the state controlled, I provide a readonly view of the state plus explicit updater functions, so children can read and request changes but cannot mutate the shared object directly, keeping mutation logic centralized. Finally, I use Symbol keys, exported from a shared module, to avoid string collisions between providers or libraries, and with TypeScript I use InjectionKey<T> for full type inference and guard consumers against a missing provider.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'provide/inject keeps state naturally scoped and disposed with the subtree but makes data flow implicit and harder to trace than explicit props or a discoverable store.',
      'It is dependency-light (no library) but lacks devtools inspection, persistence, and SSR tooling a store provides.',
      'readonly + updaters add safety at the cost of more ceremony than a raw shared object.',
    ],
    edgeCases: [
      'Injecting a non-provided key returns undefined unless a default is supplied — guard or default explicitly.',
      'A nested component can re-provide the same key, shadowing the ancestor for its own descendants (intentional override or accidental bug).',
      'Providing a primitive instead of a ref silently breaks reactivity with no error.',
    ],
    runtimeBehavior: [
      'Resolution walks the prototype-chained provides at inject time, so reordering the tree changes which provider wins.',
      'Reactive injected objects integrate with the normal track/trigger queue; only consumers reading changed properties re-render.',
      'app.provide() makes a value injectable globally for the whole app, blurring the line toward store-like usage.',
    ],
    scalability: [
      'For libraries, expose Symbol/InjectionKey contracts and document the required provider to keep injection points discoverable.',
      'Split provided state so wide subtrees do not all re-render on unrelated changes.',
      'Reserve provide/inject for subtree concerns; promote to a store when state outgrows one subtree.',
    ],
    productionConcerns: [
      'Implicit dependencies can surprise new contributors — document which ancestor must provide a key.',
      'Over-providing global values via app.provide() recreates store-like coupling without store tooling.',
      'Ensure consumers degrade gracefully (defaults or clear errors) when used outside the expected provider.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'provide(key, value) in ancestor; inject(key) in descendant.',
    'Scoped to the subtree — only descendants can inject.',
    'State dies with the provider; separate providers = independent state.',
    'Provide a ref/reactive to stay reactive — NOT a primitive snapshot.',
    'Expose readonly(state) + updater functions for controlled mutation.',
    'Use Symbol / InjectionKey<T> keys to avoid collisions and get types.',
    'inject(key, default) supplies a fallback; otherwise undefined if not provided.',
    'A descendant can re-provide the same key to override for its own subtree.',
    'Powers compound/headless components (Tabs/Tab, Menu/MenuItem).',
    'Use it for subtree state (forms, wizards); use Pinia for app-wide state.',
    'app.provide() makes a value injectable app-wide (store-like).',
    'Document the required provider — dependencies are implicit.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Provide a reactive { count: 0 } object under the key \'counter\' and inject it in a child to display count.',
      hint: 'Provide the reactive object itself, not count.',
      solution: {
        lang: 'js',
        code: '// provider\nimport { reactive, provide } from \'vue\'\nprovide(\'counter\', reactive({ count: 0 }))\n\n// child\nimport { inject } from \'vue\'\nconst counter = inject(\'counter\')   // counter.count is reactive',
        explanation: [
          'Providing the reactive object keeps the link live.',
          'The child reads counter.count, which updates when the provider mutates it.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make injected counter state read-only and expose an increment function so children cannot mutate count directly.',
      hint: 'Use readonly() and provide an updater.',
      solution: {
        lang: 'js',
        code: 'import { reactive, provide, readonly } from \'vue\'\nconst state = reactive({ count: 0 })\nfunction increment() { state.count++ }\nprovide(\'counter\', { state: readonly(state), increment })',
        explanation: [
          'readonly(state) blocks direct mutation in children.',
          'Children call increment() to request changes, centralizing the logic.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A consumer must fail loudly if used outside its provider. Use a Symbol key and throw if inject returns nothing.',
      hint: 'inject without a default returns undefined.',
      solution: {
        lang: 'js',
        code: '// keys.js\nexport const TabsKey = Symbol(\'tabs\')\n\n// consumer\nimport { inject } from \'vue\'\nimport { TabsKey } from \'./keys\'\nconst tabs = inject(TabsKey)\nif (!tabs) throw new Error(\'<Tab> must be used inside <Tabs>\')',
        explanation: [
          'A Symbol key avoids collisions with other providers.',
          'Throwing on a missing provider gives a clear developer error.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why two <Tabs> components on the same page do not interfere, in terms of how provide/inject is scoped.',
      hint: 'Think about per-instance provides objects.',
      solution: {
        lang: 'js',
        code: '// Each <Tabs> instance calls provide(\'tabs\', { active, select })\n// with its OWN reactive active ref.\n// inject in each Tab resolves UP to its nearest Tabs provider,\n// so Tab children only see THEIR Tabs\' state.\n// Separate provider instances => separate provides objects => isolated state.',
        explanation: [
          'provide writes to the instance\'s own provides object.',
          'inject resolves to the nearest ancestor, so each Tabs subtree is independent.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'provide/inject is how you avoid prop-drilling AND how component libraries build compound/headless components. Knowing when it beats a global store, and how to keep injected state reactive and controlled, marks you as someone who understands component architecture, not just APIs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is provide/inject and how does it avoid prop-drilling". Product companies (Zoho, Flipkart, Razorpay) ask provide/inject vs store and to build a compound component. FAANG-level interviews probe the prototype-chained provides resolution, scoping guarantees, and reactivity/readonly contracts.',
    whatInterviewersExpect:
      'They expect you to explain the ancestor→descendant scoping, why you provide reactive values (not snapshots), readonly + updater contracts, Symbol keys, and when to choose it over a Pinia store.',
  },
}

export default provideInjectState
