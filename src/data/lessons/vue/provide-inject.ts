import type { ConceptLesson } from '../../../types/lesson'

const provideInject: ConceptLesson = {
  // 1. Concept Summary
  slug: 'provide-inject',
  name: 'Provide / Inject',
  category: 'components',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Provide/inject lets an ancestor share data with any descendant — no matter how deep — without passing props through every layer (the "prop drilling" problem).',
    'It is how component libraries implement compound components (Tabs/Tab, Form/Field, Select/Option) and how plugins expose app-wide services like themes, i18n, and config.',
    'Understanding it clarifies the difference between local state, props, provide/inject, and a full store (Pinia) — a common architecture question.',
    'Used incorrectly it creates hidden, hard-to-trace coupling; used well it dramatically simplifies deep component trees.',
    'Interviewers ask it to test your grasp of dependency injection, reactivity across the tree, and when DI beats props or a global store.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Provide/inject is like the school putting snacks in a shared fridge so any classroom can grab them, instead of passing the snack hand-to-hand down a long line of kids.',
    story: [
      'Imagine the principal has a box of snacks and wants every classroom in the building to be able to take one.',
      'The slow way: hand the box to the first class, who pass it to the next class, who pass it to the next — all the way down. Every class has to carry it even if they do not want a snack.',
      'The smart way: the principal puts the snacks in a shared fridge labeled "snacks". Now ANY classroom, no matter how far away, can just open the fridge and grab one whenever they want.',
      'In Vue, a parent "provides" something into a shared fridge, and any child deep below can "inject" it directly — no passing it down through every classroom in between.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally a parent gives data to a child using props, and if a grandchild needs it, the parent passes it to the child who passes it to the grandchild — boring and repetitive.',
    'Provide/inject is a shortcut. A parent (or ancestor) calls provide(key, value) to make something available.',
    'Any descendant, even far below, calls inject(key) to grab that value directly — the in-between components do not need to know about it.',
    'It is like the parent leaving a labeled note on a shared board, and any child below reading the note by its label whenever they need it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Provide/inject is Vue\'s built-in dependency injection: an ancestor component calls provide(key, value) to expose data, and any descendant calls inject(key) to receive it, skipping the intermediate components. It solves prop drilling.',
    how: 'provide registers the value on the current component instance\'s provides object (which prototypally inherits from its parent\'s). inject walks up that chain to find the matching key. If you provide a ref/reactive value, descendants get a reactive reference and update automatically when it changes.',
    why: 'It keeps deep trees clean — you avoid threading the same prop through five layers — and it is the standard way to share themes, config, and compound-component context.',
    code: {
      label: 'Provide in ancestor, inject in descendant',
      lang: 'vue',
      code: '<!-- Ancestor.vue -->\n<script setup lang="ts">\nimport { provide, ref } from \'vue\'\nimport Child from \'./Child.vue\'\nconst theme = ref(\'dark\')\nprovide(\'theme\', theme) // share the REF so it stays reactive\nfunction toggle() { theme.value = theme.value === \'dark\' ? \'light\' : \'dark\' }\n</script>\n<template>\n  <button @click="toggle">Toggle theme</button>\n  <Child />\n</template>\n\n<!-- DeepGrandChild.vue (anywhere below) -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst theme = inject(\'theme\', \'light\') // default \'light\' if not provided\n</script>\n<template>\n  <p>Current theme: {{ theme }}</p>\n</template>',
      explanation: [
        'The ancestor provides a reactive ref under the key "theme".',
        'A deeply nested grandchild injects "theme" directly — no props through Child.',
        'Because a ref was provided, the grandchild updates automatically when toggle() runs.',
        'inject takes a default value used when no ancestor provided the key.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'provide/inject is Vue\'s dependency-injection mechanism. provide(key, value) registers a value on the current instance\'s provides object; because each instance\'s provides prototypally inherits from its parent\'s provides, inject(key) resolves by walking that prototype chain up to the app-level provides. Keys may be strings or, for type safety and collision avoidance, InjectionKey<T> Symbols. Reactivity is preserved only if a reactive source (ref/reactive/computed) is provided — primitives are passed by value and won\'t update. inject accepts an optional default (value or factory) and must be called synchronously during setup. By convention the provider mutates the shared state (often exposing methods alongside it) so injectors stay read-mostly, and readonly() can enforce that.',

  // 7. Internal Working
  internalWorking: [
    'Each component instance has a provides object. At creation, an instance\'s provides is created with its parent\'s provides as the prototype (Object.create(parentProvides)).',
    'Calling provide(key, value) sets the key on the CURRENT instance\'s own provides; if it is the same object as the parent\'s (no prior provide), Vue first clones it so the child does not mutate the parent\'s.',
    'inject(key) reads from the current instance\'s provides via normal prototype lookup, so it finds the nearest ancestor that provided that key.',
    'The app-level app.provide() seeds the root provides, making values available to every component.',
    'Reactivity is not added by provide/inject itself: if you provide a ref/reactive, the injector receives the same reactive object and its dependency tracking works across the tree; if you provide a raw primitive, there is no reactive link.',
    'inject must run synchronously in setup() because it reads the currently-active instance; calling it later (e.g. in a callback) loses the instance context and fails.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   App.provide('theme', ref)                provides chain (prototype links)
        │                                   ┌────────────────────────┐
   <Ancestor> provide('theme', themeRef) ──►│ {theme} → parentProvides │
        │                                   └────────────────────────┘
   <Middle>   (knows nothing)                        ▲ inject walks UP
        │                                            │
   <DeepChild> inject('theme') ─────────────────────┘  finds nearest 'theme'

   prop drilling (the problem):            provide/inject (the fix):
   A → B → C → D  (B,C just forward)        A ──provide──►  D ──inject──
        ❌ tedious                                ✅ skips B, C`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each instance holds a provides object linked by prototype to its parent\'s, so the whole tree shares one inheritance chain — lookups are constant-ish (prototype walk), no copying of values.',
    'Providing a ref shares ONE reactive object across all injectors: the dep/subscriber set lives on that single ref, and every injecting component\'s render effect subscribes to it.',
    'Because injectors hold a reference to the provided reactive object, that object stays alive as long as any injector (or the provider) is mounted — relevant for cleanup of large provided structures.',
    'Symbol keys avoid string-key collisions in the shared provides namespace, preventing accidental overwrites across libraries.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — string key with a default',
      lang: 'vue',
      code: '<!-- Parent.vue -->\n<script setup lang="ts">\nimport { provide } from \'vue\'\nprovide(\'appName\', \'FrameDrops\')\n</script>\n\n<!-- Child.vue -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst appName = inject(\'appName\', \'Untitled\')\n</script>\n<template><h1>{{ appName }}</h1></template>',
      explanation: [
        'The parent provides a static string under "appName".',
        'The child injects it, with a default "Untitled" if no ancestor provided it.',
        'A plain string is non-reactive — fine here because it never changes.',
        'No props were threaded through any intermediate components.',
      ],
    },
    intermediate: {
      label: 'Intermediate — reactive state + methods (controlled mutation)',
      lang: 'vue',
      code: '<!-- ThemeProvider.vue -->\n<script setup lang="ts">\nimport { provide, ref, readonly } from \'vue\'\nconst theme = ref<\'light\' | \'dark\'>(\'light\')\nfunction setTheme(t: \'light\' | \'dark\') { theme.value = t }\n// expose read-only state + an explicit mutator\nprovide(\'theme\', { theme: readonly(theme), setTheme })\n</script>\n<template><slot /></template>\n\n<!-- ThemeToggle.vue (deep descendant) -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst t = inject(\'theme\')!\n</script>\n<template>\n  <button @click="t.setTheme(t.theme === \'light\' ? \'dark\' : \'light\')">\n    {{ t.theme }}\n  </button>\n</template>',
      explanation: [
        'The provider shares readonly(theme) so descendants cannot mutate it directly.',
        'It also provides setTheme, the only sanctioned way to change state — controlled, traceable mutation.',
        'Descendants inject the object and call the method, keeping data flow predictable.',
        'This provider/consumer pattern is the backbone of compound components.',
      ],
    },
    advanced: {
      label: 'Advanced — typed InjectionKey for safety',
      lang: 'ts',
      code: '// keys.ts\nimport type { InjectionKey, Ref } from \'vue\'\nexport interface UserContext {\n  user: Ref<{ id: number; name: string } | null>\n  login: (name: string) => void\n}\nexport const userKey: InjectionKey<UserContext> = Symbol(\'user\')\n\n// Provider.vue (script setup)\nimport { provide, ref } from \'vue\'\nimport { userKey } from \'./keys\'\nconst user = ref<{ id: number; name: string } | null>(null)\nfunction login(name: string) { user.value = { id: 1, name } }\nprovide(userKey, { user, login }) // fully typed\n\n// Consumer.vue (script setup)\nimport { inject } from \'vue\'\nimport { userKey } from \'./keys\'\nconst ctx = inject(userKey) // TS infers UserContext | undefined',
      explanation: [
        'InjectionKey<T> ties a Symbol key to a value type, so provide and inject are type-checked.',
        'Symbols also prevent name collisions in the shared provides namespace.',
        'inject(userKey) is inferred as UserContext | undefined, nudging you to handle the missing case.',
        'This is the recommended pattern for any non-trivial provided context.',
      ],
    },
    realProject: {
      label: 'Real project — compound Tabs component',
      lang: 'vue',
      code: '<!-- Tabs.vue (provider) -->\n<script setup lang="ts">\nimport { provide, ref } from \'vue\'\nconst active = ref(0)\nprovide(\'tabs\', { active, select: (i: number) => (active.value = i) })\n</script>\n<template><div class="tabs"><slot /></div></template>\n\n<!-- Tab.vue (consumer) -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\nconst props = defineProps<{ index: number }>()\nconst tabs = inject<{ active: { value: number }; select: (i: number) => void }>(\'tabs\')!\n</script>\n<template>\n  <button :class="{ active: tabs.active.value === props.index }" @click="tabs.select(props.index)">\n    <slot />\n  </button>\n</template>\n\n<!-- usage -->\n<!-- <Tabs><Tab :index="0">A</Tab><Tab :index="1">B</Tab></Tabs> -->',
      explanation: [
        'Tabs (the provider) owns the active index and a select method.',
        'Each Tab injects that shared context — no props are passed from Tabs to each Tab manually.',
        'This is exactly how real UI libraries build Tabs, Accordion, Select, and Form/Field.',
        'The implicit parent-child contract via provide/inject is the defining trait of compound components.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem does provide/inject solve?',
      answer: 'Prop drilling — passing the same prop down through many intermediate components that don\'t use it. An ancestor provides a value and any descendant injects it directly, regardless of depth.',
      explanation: 'Naming prop drilling explicitly is the expected framing.',
    },
    {
      level: 'beginner',
      question: 'How do you make provided data reactive?',
      answer: 'Provide a reactive source — a ref, reactive object, or computed. Descendants then receive the same reactive reference and update automatically. Providing a raw primitive gives a one-time value with no reactivity.',
      explanation: 'The reactive-source-vs-primitive distinction is a common trip-up.',
    },
    {
      level: 'intermediate',
      question: 'How does inject find the right value, and where must it be called?',
      answer: 'Each instance\'s provides object prototypally inherits from its parent\'s, so inject does a prototype-chain lookup to the nearest ancestor that provided the key. inject must be called synchronously during setup, because it relies on the currently active component instance.',
      explanation: 'The prototype chain + synchronous-setup requirement shows real internals knowledge.',
    },
    {
      level: 'intermediate',
      question: 'How do you avoid key collisions and get type safety?',
      answer: 'Use a Symbol typed as InjectionKey<T> instead of a string key. The Symbol is unique (no collisions across libraries) and the type binds provide and inject to the same value type.',
      explanation: 'InjectionKey is the idiomatic best practice; mentioning it scores points.',
    },
    {
      level: 'advanced',
      question: 'When should you use provide/inject vs a store like Pinia?',
      answer: 'Use provide/inject for tree-scoped context — a value relevant to a subtree, like compound-component state, a theme for a section, or per-route config. Use a store for truly global, app-wide state shared across unrelated parts of the tree, with devtools, persistence, and structured actions. provide/inject is implicit and scoped; a store is explicit and global.',
      explanation: 'A clear scoping-based decision rule signals architectural maturity.',
    },
    {
      level: 'senior',
      question: 'What are the downsides of provide/inject and how do you mitigate them?',
      answer: 'It creates implicit, hidden coupling (a descendant\'s dependency isn\'t visible in its props), is harder to trace and test, and uncontrolled mutation by injectors breaks one-way data flow. Mitigate by using typed InjectionKeys, providing readonly state plus explicit mutator methods, documenting the contract, and reserving it for genuine cross-cutting/tree-scoped concerns rather than ordinary parent-child data.',
      explanation: 'Senior signal: naming the implicit-coupling cost and the readonly+methods discipline.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between app.provide() and component-level provide()?',
    'Why must inject be called synchronously in setup?',
    'How do you provide a value that descendants can read but not mutate? (readonly)',
    'Can a descendant override a provided key for its own subtree? (yes — it provides the same key)',
    'How do InjectionKey symbols improve type safety?',
    'When is a Pinia store a better fit than provide/inject?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Providing a primitive and expecting descendants to update when it changes.',
      why: 'Primitives are passed by value; there is no reactive link, so injectors keep the original value.',
      fix: 'Provide a ref/reactive/computed so the shared reactive reference updates everywhere.',
    },
    {
      mistake: 'Letting any descendant mutate the provided state directly.',
      why: 'Uncontrolled, scattered mutation makes data flow untraceable and bug-prone.',
      fix: 'Provide readonly() state plus explicit mutator methods; descendants call the methods.',
    },
    {
      mistake: 'Calling inject outside of setup (e.g. inside an event handler or async callback).',
      why: 'inject needs the active component instance, which only exists synchronously during setup.',
      fix: 'Call inject at the top of setup and use the captured value later in callbacks.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Compound components (Tabs/Tab, Form/Field, Select/Option, Menu/MenuItem) use provide/inject to share context between a parent and its descendant parts without manual prop wiring.' },
    { area: 'Vue', detail: 'App-wide concerns like the current theme, locale/i18n, and feature flags are provided at the app root (app.provide) and injected anywhere, avoiding global imports.' },
    { area: 'Pinia', detail: 'Pinia stores cover global state, while provide/inject handles tree-scoped context; teams use both, choosing by scope (subtree vs whole app).' },
    { area: 'Nuxt', detail: 'Plugins use the Nuxt app\'s provide to expose helpers (e.g. an API client) that pages/components inject, similar to Vue\'s app.provide but integrated with Nuxt\'s context.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Eliminates prop drilling, reducing intermediate re-renders and boilerplate in deep trees.',
      'Sharing a single reactive object means only components that actually read it subscribe and re-render.',
    ],
    bad: [
      'Providing a large reactive object that many components inject can cause broad re-renders when it changes.',
      'Implicit dependencies make it easy to accidentally couple far-apart components, complicating refactors.',
    ],
    optimizations: [
      'Provide narrow, focused context objects rather than one giant blob, so changes invalidate fewer consumers.',
      'Use computed/readonly to expose just what descendants need.',
      'Split frequently-changing and rarely-changing data into separate provided keys.',
      'For truly global, heavily-shared state, a store with fine-grained reactivity may be a better fit.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['props', 'components-basics', 'reactivity-fundamentals'],
    nextConcepts: ['dependency-injection-composition', 'provide-inject-state', 'compound-components', 'pinia-basics'],
    dependencyNote:
      'provide/inject builds on props and components-basics (it complements/replaces deep prop passing) and on reactivity-fundamentals (you provide reactive sources). It leads into dependency-injection-composition, provide-inject-state, compound-components (its killer use case), and pinia-basics (the global-state alternative).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a tall tree A → B → C → D and show a prop threaded A→B→C→D (label B,C "just forwarding").',
      'Cross out the forwarding; draw A calling provide("x") and D calling inject("x") directly.',
      'Explain the provides object inherits from the parent\'s, so inject walks up the chain.',
      'Stress: provide a REF for reactivity; provide readonly + methods for controlled mutation.',
      'Conclude: tree-scoped DI that kills prop drilling; for app-wide global state, use a store.',
    ],
    diagram: `  A provide('x', ref) ─┐
  B (forwards nothing) │  provides chain (proto links)
  C (forwards nothing) │        ▲ inject walks up
  D inject('x') ───────┘────────┘ finds nearest 'x'

  reactive? provide a ref/reactive (not a primitive)
  safe?     provide readonly(state) + setX() method`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'provide/inject is Vue\'s dependency injection: an ancestor calls provide(key, value) and any descendant calls inject(key), skipping intermediate components and killing prop drilling. Each instance\'s provides object prototypally inherits from its parent\'s, so inject walks up to the nearest provider. Provide a ref/reactive for reactivity (primitives won\'t update). Use Symbol InjectionKeys for type safety and no collisions, and expose readonly state plus mutator methods for controlled mutation. Use it for tree-scoped context (compound components, theme); use a store for app-wide global state.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'provide/inject is Vue\'s built-in dependency injection, and the problem it solves is prop drilling — when you have a deep component tree and the same data has to be threaded through many intermediate components that don\'t actually use it. Instead, an ancestor calls provide with a key and a value, and any descendant, no matter how deep, calls inject with that key to get the value directly. The intermediate components don\'t need to know anything about it. Under the hood, every component instance has a provides object whose prototype is its parent\'s provides object, so calling inject is essentially a prototype-chain lookup that finds the nearest ancestor that provided that key. A couple of important details. First, reactivity isn\'t magic: provide/inject just shares a reference, so if you want descendants to update when the value changes, you must provide a reactive source — a ref, reactive object, or computed. Providing a raw primitive gives a one-time snapshot. Second, inject has to be called synchronously during setup because it depends on the currently active component instance. For type safety and to avoid key collisions in the shared namespace, the best practice is to use a Symbol typed as InjectionKey<T>, which binds provide and inject to the same type. And to keep data flow sane, the provider should typically expose readonly state plus explicit mutator methods, so descendants read freely but only change state through a controlled API — otherwise you get scattered, untraceable mutations. The classic use cases are compound components like Tabs and Tab or Form and Field, where the parent shares context with its descendant parts, and app-wide concerns like theme, locale, or a feature-flag service provided at the root. The decision rule versus a store like Pinia is scope: provide/inject is for tree-scoped, implicit context, while a store is for explicit, app-wide global state with devtools and structured actions.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'provide/inject removes prop-drilling boilerplate but introduces implicit coupling that isn\'t visible in a component\'s public API (props), hurting traceability.',
      'It is tree-scoped and lightweight vs a store, which is global, explicit, devtools-integrated, and testable — choose by scope.',
      'Readonly + methods adds discipline (more code) but buys predictable, one-way data flow over free-for-all mutation.',
    ],
    edgeCases: [
      'A descendant can re-provide the same key to override the value for its own subtree.',
      'inject called outside setup (in callbacks/async) loses the instance context and fails.',
      'Providing a primitive looks reactive in templates only by coincidence; it won\'t update — must provide a reactive source.',
      'app.provide values are available to all components including those created later, unlike component-level provides scoped to descendants.',
    ],
    runtimeBehavior: [
      'provides objects are created lazily via Object.create(parentProvides) and cloned on first provide to avoid mutating the parent\'s.',
      'Only components that actually read a provided reactive value subscribe to it, so changes re-render just the consumers.',
      'Symbol keys live on the same provides object; uniqueness prevents cross-library overwrites.',
    ],
    scalability: [
      'Splitting context into focused keys limits the blast radius of updates as the tree and team grow.',
      'For state shared across unrelated subtrees and the whole app, a store scales better than threading many provides.',
    ],
    productionConcerns: [
      'Implicit dependencies make components harder to unit test in isolation — tests must provide the expected context.',
      'Uncontrolled mutation from injectors is a real source of hard-to-debug state changes; enforce readonly + methods in review.',
      'Document provided contracts (keys + shapes) so consumers and refactors stay safe.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'provide(key, value) in ancestor; inject(key) in descendant.',
    'Solves prop drilling (skips intermediate components).',
    'Each instance provides inherits (prototype) from parent\'s provides.',
    'inject walks UP the chain to the nearest provider.',
    'Reactive? provide a ref/reactive/computed (NOT a primitive).',
    'inject(key, default) supports a default value/factory.',
    'Must call inject synchronously in setup.',
    'Use Symbol InjectionKey<T> for type safety + no collisions.',
    'Provide readonly(state) + mutator methods for controlled mutation.',
    'Descendants can re-provide a key to override for their subtree.',
    'app.provide() = global; component provide() = subtree only.',
    'Tree-scoped context → provide/inject; app-wide global → store.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Provide a static app version string at an ancestor and inject it in a deep descendant with a default of "0.0.0".',
      hint: 'provide(key, value) and inject(key, default).',
      solution: {
        lang: 'ts',
        code: '// Ancestor setup\nimport { provide } from \'vue\'\nprovide(\'version\', \'1.4.2\')\n\n// Descendant setup\nimport { inject } from \'vue\'\nconst version = inject(\'version\', \'0.0.0\')',
        explanation: [
          'The ancestor provides a string under "version".',
          'The descendant injects it with a default used if no ancestor provided it.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Share a reactive counter from a provider so a deep child can display it and a button (also deep) can increment it.',
      hint: 'Provide a ref plus an increment method.',
      solution: {
        lang: 'ts',
        code: '// Provider setup\nimport { provide, ref, readonly } from \'vue\'\nconst count = ref(0)\nprovide(\'counter\', { count: readonly(count), inc: () => count.value++ })\n\n// Consumer setup\nimport { inject } from \'vue\'\nconst c = inject<{ count: { value: number }; inc: () => void }>(\'counter\')!\n// template: {{ c.count.value }} and @click="c.inc()"',
        explanation: [
          'The provider shares a readonly count plus an inc method — controlled mutation.',
          'Consumers read c.count and call c.inc(); the shared ref keeps everyone in sync reactively.',
          'Providing readonly prevents descendants from mutating count directly.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make a typed, collision-safe user context using InjectionKey, and have the consumer handle the not-provided case.',
      hint: 'Use InjectionKey<T> with a Symbol and check for undefined.',
      solution: {
        lang: 'ts',
        code: '// keys.ts\nimport type { InjectionKey, Ref } from \'vue\'\nexport interface UserCtx { user: Ref<string | null>; setUser: (n: string) => void }\nexport const userKey: InjectionKey<UserCtx> = Symbol(\'user\')\n\n// provider setup\nimport { provide, ref } from \'vue\'\nimport { userKey } from \'./keys\'\nconst user = ref<string | null>(null)\nprovide(userKey, { user, setUser: (n) => (user.value = n) })\n\n// consumer setup\nimport { inject } from \'vue\'\nimport { userKey } from \'./keys\'\nconst ctx = inject(userKey)\nif (!ctx) throw new Error(\'UserCtx not provided — wrap in <UserProvider>\')',
        explanation: [
          'InjectionKey<UserCtx> ties the Symbol to the value type, so provide/inject are type-checked.',
          'The Symbol avoids string-key collisions across the app.',
          'The consumer explicitly handles the undefined case, failing fast if no provider exists.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a minimal compound <Accordion>/<AccordionItem> where items register themselves and only one is open at a time, using provide/inject.',
      hint: 'The Accordion provides the open id and a toggle function.',
      solution: {
        lang: 'vue',
        code: '<!-- Accordion.vue -->\n<script setup lang="ts">\nimport { provide, ref } from \'vue\'\nconst openId = ref<string | null>(null)\nprovide(\'accordion\', {\n  openId,\n  toggle: (id: string) => (openId.value = openId.value === id ? null : id),\n})\n</script>\n<template><div class="accordion"><slot /></div></template>\n\n<!-- AccordionItem.vue -->\n<script setup lang="ts">\nimport { inject, computed } from \'vue\'\nconst props = defineProps<{ id: string; title: string }>()\nconst acc = inject<{ openId: { value: string | null }; toggle: (id: string) => void }>(\'accordion\')!\nconst isOpen = computed(() => acc.openId.value === props.id)\n</script>\n<template>\n  <div>\n    <button @click="acc.toggle(props.id)">{{ title }}</button>\n    <div v-show="isOpen"><slot /></div>\n  </div>\n</template>',
        explanation: [
          'Accordion owns openId and the toggle logic, provided to all items.',
          'Each AccordionItem injects the context and derives isOpen from the shared openId — no props from Accordion to each item.',
          'Toggling one item closes others because there is a single shared openId; this is the compound-component pattern.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'provide/inject is the dividing line between people who only know props and those who understand component architecture. Explaining the prototype-chain lookup, reactivity rules, and when to choose it over a store shows real design thinking.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is provide/inject and why use it". Product companies (Zoho, Flipkart, Razorpay) ask about reactivity, InjectionKeys, and compound components. FAANG-level interviews probe the internals (provides prototype chain), implicit-coupling tradeoffs, and provide/inject vs Pinia.',
    whatInterviewersExpect:
      'They expect you to frame it as DI that solves prop drilling, explain the ancestor-to-descendant resolution, know that you must provide a reactive source for reactivity, recommend Symbol InjectionKeys and readonly+methods, and give a clear scope-based rule for choosing it over a global store.',
  },
}

export default provideInject
