import type { ConceptLesson } from '../../../types/lesson'

const dependencyInjectionComposition: ConceptLesson = {
  // 1. Concept Summary
  slug: 'dependency-injection-composition',
  name: 'Dependency Injection (Composition)',
  category: 'composition-api',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'provide/inject is Vue\'s built-in dependency injection — it lets an ancestor pass data to any descendant without prop-drilling through every level.',
    'It is how theme, locale, auth, and configuration are shared down deep component trees in real apps.',
    'In the Composition API, provide/inject are functions you call inside setup(), making DI explicit, typed, and composable.',
    'Done wrong (providing a plain value instead of a ref) you get non-reactive injections — a frequent, subtle bug.',
    'Knowing InjectionKey for type safety and the provide-reactive-state pattern separates intermediate from senior Vue developers.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'provide/inject is like the school\'s water cooler — any classroom can get water from it without someone carrying a cup from class to class.',
    story: [
      'Imagine the school installs a big water cooler in the hallway.',
      'Any classroom, no matter how far down the corridor, can walk out and fill a cup directly.',
      'Nobody has to pass a cup hand-to-hand through every classroom in between.',
      'A parent component "provides" something at the top, and any child far below can "inject" it directly, skipping all the components in the middle.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally, to get data from a top component to a deep child, you pass it as props through every component in between — that is tedious.',
    'provide/inject lets a parent make a value available, and any descendant ask for it directly, no matter how deep.',
    'In the Composition API you call provide(key, value) in the ancestor\'s setup() and inject(key) in the descendant\'s setup().',
    'If you provide a reactive value (like a ref), changes the parent makes are seen live by everyone who injected it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Dependency injection in the Composition API is the provide/inject pair: an ancestor calls provide(key, value) to make a value available to its entire subtree, and any descendant calls inject(key) to receive it — bypassing intermediate props.',
    how: 'provide registers a value on the current component instance keyed by a string or an InjectionKey symbol. inject walks up the component tree to find the nearest provider for that key. Providing a ref/reactive object keeps the connection reactive; inject can also take a default value or factory.',
    why: 'It avoids prop-drilling for cross-cutting concerns (theme, auth, i18n, config) and lets you build provider components and composables that share state across a subtree without a global store.',
    code: {
      label: 'Provide a theme, inject it deep below',
      lang: 'vue',
      code: '<!-- App.vue (ancestor) -->\n<script setup lang="ts">\nimport { provide, ref } from \'vue\'\nconst theme = ref(\'dark\')\nprovide(\'theme\', theme) // provide the REF, not theme.value\n</script>\n\n<!-- DeepButton.vue (descendant, any depth below) -->\n<script setup lang="ts">\nimport { inject, ref } from \'vue\'\nconst theme = inject(\'theme\', ref(\'light\')) // default if no provider\n</script>\n\n<template>\n  <button :class="theme">Click</button>\n</template>',
      explanation: [
        'provide(\'theme\', theme) shares the ref with the whole subtree.',
        'DeepButton injects it without any props passed through the middle.',
        'Because a ref was provided, changing theme.value updates the button reactively.',
        'The second inject argument is a default used when no provider exists.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'In the Composition API, provide(key, value) and inject(key, default?, treatDefaultAsFactory?) implement hierarchical dependency injection. provide registers value under key (string or InjectionKey<T> symbol) in the current instance\'s provides record, which prototypally inherits from its parent\'s provides — so children see ancestor provisions. inject resolves the nearest ancestor provision for key during setup(); if none exists it returns the supplied default (optionally produced by a factory) or undefined. Reactivity is preserved only when the provided value is itself reactive (ref/reactive/computed); providing a raw value yields a static, non-reactive injection. InjectionKey<T> gives end-to-end type inference between provider and consumer.',

  // 7. Internal Working
  internalWorking: [
    'Each component instance has a `provides` object. On creation it is initialized to (prototypally) inherit from its parent\'s `provides`, forming a chain up the tree.',
    'When a component calls provide(key, value), Vue, on first provide, gives the instance its own `provides` object (still inheriting the parent\'s) and sets provides[key] = value.',
    'inject(key) reads from the current instance\'s `provides`; because of prototypal inheritance, lookup naturally falls through to the nearest ancestor that defined that key.',
    'provide/inject must be called synchronously inside setup() (or <script setup>) because they rely on the currentInstance pointer Vue sets during setup.',
    'Reactivity is not added by DI itself — it simply passes the reference. If that reference is a ref/reactive object, descendants reading it become dependencies and update on change; a raw value does not.',
    'If no provider is found, inject returns the provided default (calling it as a factory when treatDefaultAsFactory is true) or undefined, logging a dev warning when no default is given.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   App.vue           provides: { theme: ref(\'dark\') }
     │                       ▲
     ├─ Layout.vue           │ provides chain (prototypal)
     │    │                  │
     │    └─ Sidebar.vue     │  (provides nothing, inherits)
     │         │             │
     │         └─ DeepButton.vue ── inject(\'theme\') ──┘
     │                                walks up to nearest provider
     no props passed through Layout/Sidebar — DI skips the middle`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — provide & inject a value',
      lang: 'vue',
      code: '<!-- Parent -->\n<script setup lang="ts">\nimport { provide } from \'vue\'\nprovide(\'appName\', \'FrameDrops\')\n</script>\n\n<!-- Child (any depth) -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst appName = inject<string>(\'appName\', \'Default\')\n</script>\n\n<template><h1>{{ appName }}</h1></template>',
      explanation: [
        'A plain string is provided — fine because it never changes.',
        'inject reads it directly with a fallback default.',
        'No props were threaded through intermediate components.',
        'Use a constant like this only for non-changing values.',
      ],
    },
    intermediate: {
      label: 'Intermediate — reactive injection with a typed key',
      lang: 'ts',
      code: '// keys.ts\nimport type { InjectionKey, Ref } from \'vue\'\nexport const ThemeKey: InjectionKey<Ref<string>> = Symbol(\'theme\')\n\n// Provider.vue setup\n// provide(ThemeKey, theme)  // theme = ref(\'dark\')\n\n// Consumer.vue setup\n// const theme = inject(ThemeKey)  // typed as Ref<string> | undefined',
      explanation: [
        'InjectionKey<Ref<string>> ties provider and consumer types together.',
        'inject(ThemeKey) is inferred as Ref<string> | undefined — type-safe.',
        'Providing the ref (not theme.value) keeps the injection reactive.',
        'Symbols avoid string-key collisions across the app.',
      ],
    },
    advanced: {
      label: 'Advanced — provide state AND mutators (encapsulated store)',
      lang: 'vue',
      code: '<!-- CounterProvider.vue -->\n<script setup lang="ts">\nimport { provide, ref, readonly } from \'vue\'\nconst count = ref(0)\nfunction increment() { count.value++ }\n// expose read-only state + an action so children cannot mutate directly\nprovide(\'counter\', { count: readonly(count), increment })\n</script>\n\n<template><slot /></template>\n\n<!-- Consumer -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst counter = inject<{ count: any; increment: () => void }>(\'counter\')!\n</script>\n<template>\n  <button @click="counter.increment">{{ counter.count }}</button>\n</template>',
      explanation: [
        'The provider owns the state and exposes a controlled API (readonly state + mutator).',
        'readonly(count) stops descendants from mutating state directly — single source of truth.',
        'This is the provide-reactive-state pattern: a scoped, store-like provider.',
        'A slot lets any subtree consume it without prop-drilling.',
      ],
    },
    realProject: {
      label: 'Real project — auth context via a composable',
      lang: 'ts',
      code: '// useAuth.ts\nimport { provide, inject, ref, type InjectionKey, type Ref } from \'vue\'\ninterface Auth { user: Ref<string | null>; login: (u: string) => void; logout: () => void }\nconst AuthKey: InjectionKey<Auth> = Symbol(\'auth\')\n\nexport function provideAuth() {\n  const user = ref<string | null>(null)\n  const login = (u: string) => (user.value = u)\n  const logout = () => (user.value = null)\n  const auth: Auth = { user, login, logout }\n  provide(AuthKey, auth)\n  return auth\n}\n\nexport function useAuth() {\n  const auth = inject(AuthKey)\n  if (!auth) throw new Error(\'useAuth must be used within provideAuth\')\n  return auth\n}',
      explanation: [
        'A provider composable (provideAuth) sets up state once at the app root.',
        'A consumer composable (useAuth) injects it with a clear error if missing.',
        'Wrapping DI in composables gives a typed, ergonomic API and prevents misuse.',
        'This is the standard way real apps share auth/theme/config across the tree.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem do provide/inject solve?',
      answer: 'They avoid prop-drilling: an ancestor provides a value once and any descendant injects it directly, without passing props through every intermediate component.',
      explanation: 'A good answer names prop-drilling and the ancestor-to-descendant relationship.',
    },
    {
      level: 'beginner',
      question: 'Where must provide and inject be called in the Composition API?',
      answer: 'Synchronously inside setup() (or <script setup>), because they rely on the current component instance.',
      explanation: 'Tests the same synchronous-instance rule as other Composition APIs.',
    },
    {
      level: 'intermediate',
      question: 'Why is my injected value not updating when the parent changes it?',
      answer: 'Because a raw, non-reactive value was provided. To stay reactive you must provide a ref/reactive/computed and the descendant reads it reactively.',
      explanation: 'This is the single most common DI bug; naming "provide the ref, not .value" is key.',
    },
    {
      level: 'intermediate',
      question: 'How do you make provide/inject type-safe?',
      answer: 'Use an InjectionKey<T> symbol shared by provider and consumer; inject(key) is then inferred as T | undefined.',
      explanation: 'Shows TS maturity and the symbol-collision benefit.',
    },
    {
      level: 'advanced',
      question: 'How do you stop descendants from mutating provided state directly?',
      answer: 'Provide readonly(state) plus explicit mutator functions, so consumers can read reactively and only change state through the controlled API.',
      explanation: 'Senior-ish: enforcing a single source of truth and unidirectional updates.',
    },
    {
      level: 'senior',
      question: 'When would you choose provide/inject over Pinia, and what are its limits?',
      answer: 'Use provide/inject for tree-scoped concerns (theme/form context/config) tied to a component subtree, or for library plugins. Limits: it is not globally addressable, not devtools-tracked like a store, harder to test in isolation, and easy to misuse without typed keys. Pinia is better for app-wide, persistent, debuggable state.',
      explanation: 'Senior signal: scoping, tooling, testability trade-offs vs a dedicated store.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between providing a ref vs a reactive object?',
    'How do you provide app-level values (app.provide) outside a component?',
    'What does the treatDefaultAsFactory argument of inject do?',
    'How do you enforce that a consumer is inside a provider? (throw in the composable)',
    'Can a child override an ancestor\'s provided key for its own subtree? (yes)',
    'How does provide/inject compare to props/events and to Pinia?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Providing theme.value instead of the ref theme.',
      why: 'You pass the unwrapped current value, so consumers get a static snapshot and never see updates.',
      fix: 'Provide the ref/reactive object itself; consumers read .value (or use it directly in templates).',
    },
    {
      mistake: 'Using plain string keys that collide across the app.',
      why: 'Two unrelated providers using \'data\' can clash, and there is no type safety.',
      fix: 'Use InjectionKey<T> symbols defined in a shared module.',
    },
    {
      mistake: 'Letting descendants mutate provided reactive state freely.',
      why: 'State can change from anywhere, breaking the single-source-of-truth and making bugs hard to trace.',
      fix: 'Provide readonly(state) + mutator functions for controlled, unidirectional updates.',
    },
    {
      mistake: 'Calling inject outside setup (e.g. in an event handler later).',
      why: 'inject relies on the active instance set only during setup.',
      fix: 'Call inject synchronously in setup and store the result for later use.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Theme, locale, and feature-flag context are provided near the root and injected by deeply nested UI components.' },
    { area: 'Component library', detail: 'Compound components (Tabs/Tab, Select/Option) use provide/inject so child parts coordinate with their parent without props.' },
    { area: 'Nuxt', detail: 'Plugins and layouts provide app-wide services (API client, config) via app.provide for pages and components to inject.' },
    { area: 'Pinia', detail: 'For app-wide state, teams prefer Pinia over provide/inject; DI is reserved for subtree-scoped or library-internal context.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Avoids re-rendering intermediate components that would otherwise just relay props.',
      'Lookup is a cheap prototypal property read — negligible runtime cost.',
    ],
    bad: [
      'Providing a large reactive object that many descendants read can broaden the dependency graph and cause wide re-renders on change.',
      'Overusing DI makes data flow implicit and harder to reason about than explicit props.',
    ],
    optimizations: [
      'Provide only what is needed; split concerns into separate keys instead of one giant object.',
      'Use readonly + actions to control and localize where state changes originate.',
      'Prefer computed slices so consumers track just the data they use.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['provide-inject', 'setup-function', 'ref'],
    nextConcepts: ['composables', 'provide-inject-state', 'compound-components'],
    dependencyNote:
      'This is the Composition-API form of provide-inject, so it builds on the general provide/inject concept and on setup()/ref for reactive provisions. It leads into provider composables, provide-inject-state patterns, and compound-component coordination.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a tree: App at top, two layers of components, a deep leaf at the bottom.',
      'Cross out the props you would otherwise thread through each level.',
      'Write provide(\'theme\', theme) at App and inject(\'theme\') at the leaf with an arrow up the tree.',
      'Annotate "provide the REF for reactivity" next to App.',
      'Say: "inject walks up the provides chain to the nearest provider; DI skips the middle entirely."',
    ],
    diagram: `  provide(key, ref)  ──► instance.provides[key]
        App                       ▲  (prototype chain)
         │                        │
       (middle, no props)         │
         │                        │
        Leaf  inject(key) ────────┘  finds nearest provider
                 reactive only if a ref/reactive was provided`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'provide/inject is Vue\'s dependency injection: an ancestor calls provide(key, value) in setup() and any descendant calls inject(key) — no prop-drilling. Reactivity survives only if you provide a ref/reactive (provide the ref, not .value). Use an InjectionKey<T> symbol for type safety and collision-free keys. For a clean contract, provide readonly state plus mutator functions, and wrap the pair in provider/consumer composables. Use it for tree-scoped concerns; reach for Pinia for app-wide state.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Dependency injection in the Composition API is the provide/inject pair, and it solves prop-drilling — the pain of passing a piece of data down through many intermediate components just so a deep child can use it. Instead, an ancestor calls provide(key, value) inside its setup, and any descendant, no matter how deep, calls inject(key) to receive it directly. Under the hood every component instance has a provides object that prototypally inherits from its parent\'s, so inject simply walks up that chain to the nearest provider. Both calls must happen synchronously in setup because they rely on the current instance pointer. The most important nuance is reactivity: DI itself does not add reactivity — it just passes a reference. So if you want descendants to see updates, you must provide a ref or a reactive object, not its unwrapped value. Providing theme.value instead of theme is the classic bug where injections never update. For type safety and to avoid string-key collisions, you define an InjectionKey<T> symbol in a shared module; inject then infers the type as T or undefined. A common production pattern is to keep a single source of truth: the provider owns the reactive state and provides readonly(state) plus explicit mutator functions, so children can read reactively but can only change state through the controlled API. People usually wrap this in two composables — a provideAuth that sets it up at the root and a useAuth that injects it and throws a clear error if there is no provider. As for when to use it versus Pinia: provide/inject shines for subtree-scoped context like theme, form state, or compound-component coordination, and for library plugins, whereas Pinia is better for app-wide, persistent, devtools-trackable state.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Implicit DI vs explicit props: DI removes boilerplate but makes data flow less visible and harder to trace than props.',
      'provide/inject vs Pinia: DI is tree-scoped and dependency-free; Pinia is globally addressable, devtools-friendly, and easier to test, at the cost of being a global concept.',
    ],
    edgeCases: [
      'Providing a raw value gives a non-reactive injection — a frequent bug.',
      'A descendant can re-provide the same key to shadow the ancestor for its own subtree.',
      'inject outside setup (e.g. in a delayed callback) fails because no active instance.',
      'App-level provide (app.provide) is needed for values not tied to a component instance.',
    ],
    runtimeBehavior: [
      'provides uses prototypal inheritance, so lookup is O(depth) but effectively a cheap prototype walk.',
      'Reactivity flows only through provided reactive references; consumers reading them register as dependencies.',
      'inject\'s default can be a value or, with treatDefaultAsFactory, a factory function.',
    ],
    scalability: [
      'Typed keys + provider composables scale DI safely across large apps without key collisions.',
      'readonly + actions keep mutation centralized, preventing scattered writes in big trees.',
    ],
    productionConcerns: [
      'Test consumers by wrapping them in a test provider; missing-provider errors should be explicit.',
      'Avoid giant single provided objects that widen the reactive dependency graph.',
      'Document which keys are provided where, since DI relationships are not visible in the template.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'provide(key, value) in ancestor setup; inject(key) in descendant setup.',
    'Skips prop-drilling through intermediate components.',
    'Reactive ONLY if you provide a ref/reactive (provide the ref, not .value).',
    'Use InjectionKey<T> symbols for type safety + no collisions.',
    'inject(key, default, treatDefaultAsFactory?) supports defaults.',
    'Provide readonly(state) + mutators to keep a single source of truth.',
    'Wrap in provideX/useX composables for a clean, safe API.',
    'Children can re-provide a key to shadow ancestors.',
    'Must be called synchronously in setup.',
    'Tree-scoped concern → DI; app-wide state → Pinia.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Provide a static app version string at the root and inject it in a deep footer component.',
      hint: 'A constant can be provided directly (no ref needed).',
      solution: {
        lang: 'ts',
        code: '// root setup\n// provide(\'version\', \'1.4.0\')\n\n// Footer.vue setup\nimport { inject } from \'vue\'\nconst version = inject<string>(\'version\', \'0.0.0\')',
        explanation: ['A non-changing value can be provided as-is.', 'inject supplies a default if no provider exists.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Provide a reactive theme ref and let a deep child toggle it, with TypeScript safety.',
      hint: 'Use an InjectionKey<Ref<string>> and provide the ref plus a setter.',
      solution: {
        lang: 'ts',
        code: 'import { provide, inject, ref, type InjectionKey, type Ref } from \'vue\'\ninterface ThemeCtx { theme: Ref<string>; toggle: () => void }\nconst ThemeKey: InjectionKey<ThemeCtx> = Symbol(\'theme\')\n\nexport function provideTheme() {\n  const theme = ref(\'light\')\n  const toggle = () => (theme.value = theme.value === \'light\' ? \'dark\' : \'light\')\n  provide(ThemeKey, { theme, toggle })\n}\nexport function useTheme() {\n  const ctx = inject(ThemeKey)\n  if (!ctx) throw new Error(\'useTheme outside provider\')\n  return ctx\n}',
        explanation: [
          'The ref is provided (with a toggle), so the injection stays reactive.',
          'InjectionKey types provider and consumer; useTheme throws if no provider.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a provider that exposes read-only state plus an action so children cannot mutate state directly.',
      hint: 'Provide readonly(state) and a mutator function.',
      solution: {
        lang: 'ts',
        code: 'import { provide, inject, ref, readonly, type InjectionKey } from \'vue\'\ninterface CartCtx { items: ReturnType<typeof readonly>; add: (id: number) => void }\nconst CartKey: InjectionKey<CartCtx> = Symbol(\'cart\')\n\nexport function provideCart() {\n  const items = ref<number[]>([])\n  const add = (id: number) => items.value.push(id)\n  provide(CartKey, { items: readonly(items), add })\n}\nexport function useCart() {\n  const ctx = inject(CartKey)\n  if (!ctx) throw new Error(\'useCart outside provider\')\n  return ctx\n}',
        explanation: [
          'readonly(items) prevents direct mutation by consumers.',
          'add() is the only sanctioned way to change the cart — unidirectional updates.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and fix: a child injects a theme but never updates when the parent changes it.',
      hint: 'The parent provided the unwrapped value, not the ref.',
      solution: {
        lang: 'ts',
        code: '// BROKEN parent:\n// const theme = ref(\'dark\')\n// provide(\'theme\', theme.value)   // ❌ provides a static string\n\n// FIXED parent:\nimport { provide, ref } from \'vue\'\nconst theme = ref(\'dark\')\nprovide(\'theme\', theme)            // ✅ provide the ref itself\n// now changing theme.value updates all injectors reactively',
        explanation: [
          'Providing theme.value passes a one-time snapshot, losing reactivity.',
          'Providing the ref keeps the reactive link so consumers update on change.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'provide/inject is how real Vue apps share cross-cutting state without prop-drilling. Mastering reactive provisions, typed keys, and the readonly+actions pattern shows you can architect data flow, not just wire props.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is provide/inject and when do you use it". Product companies (Zoho, Flipkart, Razorpay) ask why an injection is not reactive and to type it with InjectionKey. FAANG-level interviews probe provide/inject vs Pinia trade-offs, the provides prototype chain, and enforcing unidirectional updates.',
    whatInterviewersExpect:
      'Define the prop-drilling problem it solves, show provide/inject in setup, stress "provide the ref for reactivity", use InjectionKey for typing, and discuss readonly+actions and when to prefer Pinia.',
  },
}

export default dependencyInjectionComposition
