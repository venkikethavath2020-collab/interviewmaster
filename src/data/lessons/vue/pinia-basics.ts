import type { ConceptLesson } from '../../../types/lesson'

const piniaBasics: ConceptLesson = {
  // 1. Concept Summary
  slug: 'pinia-basics',
  name: 'Pinia Basics',
  category: 'state',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Pinia is the official, default state management library for Vue 3 — it replaced Vuex and is what real Vue jobs use day-to-day.',
    'It gives you devtools time-travel, hot module reload, full TypeScript inference, and SSR safety out of the box — things a hand-rolled store does not.',
    'Its API is tiny and intuitive: state, getters, actions — no mutations, no boilerplate, no string event types like Vuex.',
    'Almost every Vue interview at product companies includes "how do you manage global state" — the expected answer is Pinia, and they will ask you to define a store.',
    'Getting Pinia patterns right (where state lives, reactive destructuring, actions vs mutations) prevents the most common Vue state bugs in production.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Pinia store is a labelled toy box that the whole house shares, with rules for who can take toys out and put them back.',
    story: [
      'Imagine one big toy box in the living room that everyone in the family uses, instead of toys scattered in every bedroom.',
      'The box has a label so everyone knows it is the "toys" box and not the "snacks" box.',
      'There are little helper rules written on the lid: "to add a toy, do it this way" so nobody just dumps things in messily.',
      'A store is that shared, labelled, organized box for your app\'s important data — everyone reaches into the same box, and the helpers keep it tidy.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Pinia is a small library that gives your app a tidy central place to keep data that many components share, like the logged-in user or the shopping cart.',
    'You create a "store" with a name, some starting data (state), some computed shortcuts (getters), and some functions that change the data (actions).',
    'Any component can ask for the store, read its data, and call its actions — and they all see the same data because it is one shared store.',
    'Compared to the older tool Vuex, Pinia is simpler: there are no separate "mutations" and far less setup code.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Pinia is Vue 3\'s official store library. A store is a reactive container defined with defineStore() holding state (data), getters (computed/derived values), and actions (methods that read or change state), accessible from any component.',
    how: 'You install Pinia once with app.use(createPinia()), define stores with defineStore(\'id\', { state, getters, actions }), then call useXxxStore() inside any component to get the live, reactive store instance.',
    why: 'It centralizes shared state with a predictable shape, gives every consumer one reactive source of truth, and adds devtools, typing, persistence and SSR support that ad-hoc sharing lacks.',
    code: {
      label: 'A minimal Pinia counter store',
      lang: 'js',
      code: '// stores/counter.js\nimport { defineStore } from \'pinia\'\n\nexport const useCounterStore = defineStore(\'counter\', {\n  state: () => ({ count: 0 }),\n  getters: { double: (s) => s.count * 2 },\n  actions: {\n    increment() { this.count++ },\n  },\n})\n\n// in a component\n// const counter = useCounterStore()\n// counter.increment(); counter.count; counter.double',
      explanation: [
        'defineStore takes a unique id (\'counter\') and an options object.',
        'state is a FUNCTION returning the initial data so each app/request gets a fresh object.',
        'getters are like computed properties derived from state, accessed as properties.',
        'actions are regular methods; inside them `this` is the store, so this.count++ mutates state directly — no Vuex-style mutations.',
        'useCounterStore() returns the same reactive instance everywhere it is called.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Pinia is the official state management library for Vue 3. A store created with defineStore is a reactive singleton scoped to the active Pinia instance: its state is held in a reactive() object, getters are implemented as computed refs (cached and lazily evaluated), and actions are plain functions bound so `this` references the store. Stores are lazily instantiated on first useStore() call and cached for the Pinia instance lifetime, integrate with Vue Devtools, support plugins, and are request-scoped under SSR for isolation.',

  // 7. Internal Working
  internalWorking: [
    'createPinia() creates a Pinia instance (a reactive registry of stores) and app.use() injects it so useStore() can find it via inject during setup.',
    'defineStore returns a useStore composable; it does not create the store until first called, at which point Pinia builds the store and caches it under its id.',
    'Options-style state is wrapped in reactive(), so reads inside components are tracked and writes trigger re-renders through the normal reactivity core.',
    'Getters are compiled into computed refs keyed off state, so they cache and only recompute when their reactive dependencies change.',
    'Actions are wrapped so `this` binds to the store instance; calls can be intercepted by plugins (e.g. for logging or persistence) via $onAction.',
    'Under SSR, each request gets a new Pinia instance via createPinia(), so stores are isolated per request and serialized state can be hydrated on the client.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: 'app.use(createPinia())  ── one registry ──┐\n                                          │\n   defineStore(\'cart\', {...})  ──► useCartStore() (first call builds it)\n                                          │\n            ┌─────────────────────────────▼───────────────────────────┐\n            │                    cartStore (reactive)                  │\n            │  state:   { items: [...] }      ← reactive()             │\n            │  getters: total ─────────────── ← computed (cached)      │\n            │  actions: add() / remove() ──── ← methods, this = store  │\n            └───────────▲───────────────▲───────────────▲─────────────┘\n                        │               │               │\n                  ComponentA      ComponentB       ComponentC\n             (all share the SAME reactive store instance)',

  // 9. Memory Visualization
  memoryVisualization: [
    'The Pinia instance is held by the Vue app; it owns a map of store-id → store object.',
    'Each store object is created lazily on first use and then retained for the app (or request) lifetime — repeated useStore() calls return the cached instance.',
    'State lives inside a reactive() object on the heap; components hold references to it, keeping it alive while mounted.',
    'Under SSR, a fresh Pinia instance per request means store objects are garbage-collected after the request completes, preventing cross-request retention.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — setup and use a store',
      lang: 'js',
      code: '// main.js\nimport { createApp } from \'vue\'\nimport { createPinia } from \'pinia\'\nimport App from \'./App.vue\'\n\ncreateApp(App).use(createPinia()).mount(\'#app\')\n\n// stores/user.js\nimport { defineStore } from \'pinia\'\nexport const useUserStore = defineStore(\'user\', {\n  state: () => ({ name: \'\', loggedIn: false }),\n  actions: { login(name) { this.name = name; this.loggedIn = true } },\n})',
      explanation: [
        'You must call app.use(createPinia()) once before any store is used.',
        'defineStore registers a store factory; nothing is created until useUserStore() is called.',
        'The state function returns a fresh object — never share a single object reference here.',
        'login() mutates state directly via `this`.',
      ],
    },
    intermediate: {
      label: 'Intermediate — using a store in a component with reactive destructuring',
      lang: 'vue',
      code: '<script setup>\nimport { storeToRefs } from \'pinia\'\nimport { useUserStore } from \'@/stores/user\'\n\nconst user = useUserStore()\n// destructuring state directly LOSES reactivity:\n// const { name } = user   // ❌\n// use storeToRefs to keep reactivity:\nconst { name, loggedIn } = storeToRefs(user)\n// actions can be destructured plainly (they are bound):\nconst { login } = user\n</script>\n\n<template>\n  <p v-if="loggedIn">Hello {{ name }}</p>\n  <button @click="login(\'Ada\')">Log in</button>\n</template>',
      explanation: [
        'Plain destructuring of state breaks reactivity because you copy the value out of the reactive proxy.',
        'storeToRefs converts state and getters to refs that stay reactive.',
        'Actions are already bound, so you CAN destructure them directly.',
        'In the template, name and loggedIn auto-unwrap as refs.',
        'This storeToRefs gotcha is one of the most asked Pinia interview points.',
      ],
    },
    advanced: {
      label: 'Advanced — setup-style store with composables inside',
      lang: 'js',
      code: '// stores/cart.js — setup syntax (function form)\nimport { defineStore } from \'pinia\'\nimport { ref, computed } from \'vue\'\n\nexport const useCartStore = defineStore(\'cart\', () => {\n  const items = ref([])                                   // state\n  const total = computed(() =>                            // getter\n    items.value.reduce((n, i) => n + i.price, 0))\n  function add(item) { items.value.push(item) }           // action\n  function clear() { items.value = [] }\n  return { items, total, add, clear }\n})',
      explanation: [
        'The setup (function) form lets you use ref/computed/watch and other composables directly.',
        'Returned refs become state, computeds become getters, functions become actions.',
        'This form is more flexible for complex logic (private helpers, watchers) than the options form.',
        'You MUST return everything you want exposed; un-returned values are private.',
        'Both forms produce identical, fully reactive stores.',
      ],
    },
    realProject: {
      label: 'Real project — async action with loading and error state',
      lang: 'js',
      code: '// stores/products.js\nimport { defineStore } from \'pinia\'\n\nexport const useProductStore = defineStore(\'products\', {\n  state: () => ({ list: [], loading: false, error: null }),\n  actions: {\n    async fetchAll() {\n      this.loading = true\n      this.error = null\n      try {\n        const res = await fetch(\'/api/products\')\n        this.list = await res.json()\n      } catch (e) {\n        this.error = e.message\n      } finally {\n        this.loading = false\n      }\n    },\n  },\n})',
      explanation: [
        'Actions can be async — Pinia has no mutation/action split, so async logic lives naturally in actions.',
        'loading/error are part of state so the UI can react to request lifecycle.',
        'Components call await store.fetchAll() and bind to store.loading / store.error.',
        'This is the canonical pattern for API-backed stores in real apps.',
        'For heavy server caching you would layer a query library, keeping the store for client concerns.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Pinia and how do you create a store?',
      answer: 'Pinia is Vue 3\'s official state library. You create a store with defineStore(\'id\', { state, getters, actions }), install Pinia via app.use(createPinia()), and access the store by calling useXxxStore() inside a component.',
      explanation: 'Mentioning the three parts and the install step shows you have actually used it.',
    },
    {
      level: 'beginner',
      question: 'Why is state defined as a function in a Pinia store?',
      answer: 'So each Pinia instance (e.g. each SSR request) gets a fresh, independent state object. A shared object reference would leak state across instances/requests.',
      explanation: 'This connects directly to SSR safety and is a frequent follow-up.',
    },
    {
      level: 'intermediate',
      question: 'Why does destructuring state from a store lose reactivity, and how do you fix it?',
      answer: 'Destructuring copies the current value out of the reactive proxy, breaking the dependency link. Use storeToRefs(store) to get refs that stay reactive. Actions can be destructured directly because they are bound functions.',
      explanation: 'The storeToRefs answer is the single most common Pinia gotcha question.',
    },
    {
      level: 'intermediate',
      question: 'What are getters and how do they differ from actions?',
      answer: 'Getters are derived, cached values computed from state (like computed properties), accessed as properties. Actions are methods that read or mutate state and can be async. Getters should be pure/derivation-only; mutation belongs in actions.',
      explanation: 'Strong answers note getter caching and the read vs write separation.',
    },
    {
      level: 'advanced',
      question: 'Compare the options store syntax with the setup store syntax.',
      answer: 'Options form uses { state, getters, actions } and `this`. Setup form is a function returning refs/computeds/functions, letting you use any composable, private state, and watchers directly. Setup form is more flexible for complex stores; both yield identical reactive stores.',
      explanation: 'Knowing both forms and when to prefer setup form signals real experience.',
    },
    {
      level: 'senior',
      question: 'How does Pinia ensure SSR safety and how do you hydrate state?',
      answer: 'Each request creates a fresh Pinia instance (createPinia()) so stores are request-scoped, avoiding cross-request leaks. On the server you serialize pinia.state.value into the HTML; on the client you assign it back to pinia.state.value before mounting so the client store matches the server-rendered markup.',
      explanation: 'The request-scoping plus serialize/hydrate cycle is the senior differentiator.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does Pinia not have mutations like Vuex?',
    'How do getters cache, and what triggers recomputation?',
    'Can one store use another store? How?',
    'How do you reset a store to its initial state?',
    'How do Pinia plugins work (e.g. for persistence)?',
    'How do you type a store with TypeScript?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Destructuring state directly from the store.',
      why: 'It copies the value out of the reactive proxy, so the component stops updating.',
      fix: 'Use storeToRefs(store) for state/getters; destructure actions directly.',
    },
    {
      mistake: 'Defining state as an object literal instead of a function.',
      why: 'A shared object reference leaks state across Pinia instances/requests (SSR bug).',
      fix: 'Always write state: () => ({ ... }) so each instance gets a fresh object.',
    },
    {
      mistake: 'Calling useStore() at module top-level (outside setup/before Pinia is installed).',
      why: 'Pinia may not be active yet, throwing "getActivePinia" errors.',
      fix: 'Call useStore() inside setup(), components, or after app.use(createPinia()).',
    },
    {
      mistake: 'Mutating state from components directly everywhere.',
      why: 'Scattered mutations make state changes hard to trace and test.',
      fix: 'Funnel meaningful changes through actions so logic is centralized and devtools-traceable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Pinia', detail: 'Auth, cart, feature flags, and cached entities live in typed stores; async actions handle API calls with loading/error state.' },
    { area: 'Vue', detail: 'storeToRefs is used pervasively in <script setup> to bind reactive state into templates without losing reactivity.' },
    { area: 'Nuxt', detail: 'Nuxt auto-imports Pinia stores and handles SSR serialization/hydration of pinia.state for request-scoped isolation.' },
    { area: 'Component library', detail: 'Persistence plugins (pinia-plugin-persistedstate) sync chosen stores to localStorage with versioned migrations.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Getters cache like computed properties, so derived values are not recomputed on every access.',
      'Lazy store instantiation means unused stores cost nothing until first used.',
    ],
    bad: [
      'One giant store causes many components to subscribe and re-render on unrelated state changes.',
      'Deeply reactive large arrays/objects in state add Proxy traversal overhead.',
    ],
    optimizations: [
      'Split into focused domain stores so subscriptions and re-renders stay narrow.',
      'Use markRaw or shallow refs in setup stores for large non-reactive data.',
      'Bind only needed fields via storeToRefs rather than spreading whole state.',
      'Keep heavy server-cache data in a query layer, leaving Pinia lean.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['state-management-overview', 'reactivity-fundamentals', 'ref', 'computed'],
    nextConcepts: ['pinia-stores-actions', 'pinia-vs-vuex', 'state-sharing-composables', 'provide-inject-state'],
    dependencyNote:
      'Pinia builds directly on Vue\'s reactivity (ref/reactive/computed). Understand those and the state-management overview first; then pinia-stores-actions goes deeper on actions, getters, and store composition.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write app.use(createPinia()) at the top to show the one-time install.',
      'Draw a store box labelled by id with three rows: state, getters, actions.',
      'Draw two components both pointing arrows INTO the same store box.',
      'Annotate state as reactive(), getters as cached computed, actions as methods where this = store.',
      'Say: "Components call useStore() to get the same reactive singleton; storeToRefs keeps destructured state reactive."',
    ],
    diagram: '  createPinia() → app.use()\n  ┌──────────────── useCartStore() ─────────────────┐\n  │  state:   () => ({ items })   (reactive)         │\n  │  getters: total               (cached computed)  │\n  │  actions: add / clear         (this = store)     │\n  └──────▲───────────────────────────▲──────────────┘\n         │ storeToRefs(store)         │\n     ComponentA                   ComponentB',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Pinia is Vue 3\'s official store. You install it once with createPinia(), define stores with defineStore(\'id\', { state, getters, actions }) — state is a function, getters are cached computed values, actions are methods (and can be async, no Vuex mutations). Access any store with useStore() to get one shared reactive singleton. The big gotcha: destructuring state loses reactivity, so use storeToRefs. It is SSR-safe because each request gets a fresh Pinia instance.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Pinia is the official state management library for Vue 3 and the successor to Vuex. You install it once with app.use(createPinia()), then define stores with defineStore, passing an id and either an options object or a setup function. A store has three parts: state, which is a function returning the initial data so each instance gets a fresh object; getters, which are like computed properties — derived, cached values; and actions, which are methods that read or mutate state and can be async. Crucially, Pinia drops Vuex\'s mutations entirely — you just assign to state inside actions via `this`, which makes it far less boilerplate-heavy. To use a store you call useXxxStore() inside a component and you get the same reactive singleton everywhere. The most important gotcha is reactivity on destructuring: if you destructure state straight off the store you copy the value out of the reactive proxy and lose reactivity, so you wrap it in storeToRefs, which gives you refs that stay live. Actions, on the other hand, are already bound, so you can destructure them directly. Pinia is also SSR-safe: because each request creates a fresh Pinia instance, stores are request-scoped, and you serialize pinia.state on the server and hydrate it on the client. On top of that you get full TypeScript inference, Vue Devtools time-travel, hot module reload, and a plugin system used for things like localStorage persistence. In practice I keep auth, cart, and cached domain data in focused stores, use async actions for API calls with loading and error fields, and split large stores so re-renders stay localized.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Options vs setup store form: options is concise and familiar; setup form unlocks composables, private state, and watchers at the cost of more verbosity.',
      'Centralized stores aid sharing and devtools tracing but can absorb state that should stay local, eroding component encapsulation.',
      'Plugin-based persistence is convenient but couples store shape to stored data, requiring migration discipline.',
    ],
    edgeCases: [
      'Calling useStore() before Pinia is installed throws — common in module-scope helpers and tests.',
      'storeToRefs only converts state and getters, not actions; spreading the raw store into a template loses reactivity on state.',
      'Cross-store usage (one store calling another) must call the other useStore() inside actions/getters, not at module load.',
    ],
    runtimeBehavior: [
      'Getters are computed refs: cached until a reactive dependency changes, so repeated reads are cheap.',
      'Actions can be observed via $onAction for logging, undo, or persistence side-effects.',
      'State mutations batch through the same async render queue as all Vue reactivity.',
    ],
    scalability: [
      'Modularize into domain stores; cross-cutting concerns become plugins rather than a god-store.',
      'Use shallow reactivity / markRaw for large datasets to avoid deep Proxy costs.',
      'For server data, pair Pinia with a query/caching layer rather than caching API responses manually in state.',
    ],
    productionConcerns: [
      'SSR hydration mismatches if server-serialized state diverges from client expectations — keep serialization total and deterministic.',
      'Persisted state needs versioning and migration to survive shape changes across deploys.',
      'Test stores in isolation by creating a fresh testing Pinia (setActivePinia) per test to avoid shared state bleed.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pinia = official Vue 3 store (replaces Vuex).',
    'Install once: app.use(createPinia()).',
    'defineStore(\'id\', { state, getters, actions }) or defineStore(\'id\', () => {...}).',
    'state MUST be a function: state: () => ({ ... }).',
    'getters = cached, derived (like computed); actions = methods, can be async.',
    'No mutations — assign to state inside actions via this.',
    'useStore() returns the same reactive singleton everywhere.',
    'Destructuring state loses reactivity → use storeToRefs(store).',
    'Actions can be destructured directly (already bound).',
    'SSR-safe: fresh Pinia per request; serialize/hydrate pinia.state.',
    'Plugins add persistence, logging, etc.; getters cache lazily.',
    'Split big stores into focused domain stores for performance.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Define a Pinia store "settings" with state { darkMode: false } and an action toggleDark().',
      hint: 'Use the options form; mutate via this.',
      solution: {
        lang: 'js',
        code: 'import { defineStore } from \'pinia\'\nexport const useSettingsStore = defineStore(\'settings\', {\n  state: () => ({ darkMode: false }),\n  actions: { toggleDark() { this.darkMode = !this.darkMode } },\n})',
        explanation: [
          'state is a function returning the initial object.',
          'toggleDark flips state directly through this — no mutation needed.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'In a component, read darkMode reactively and call toggleDark from the settings store.',
      hint: 'storeToRefs for state, direct destructure for the action.',
      solution: {
        lang: 'js',
        code: 'import { storeToRefs } from \'pinia\'\nimport { useSettingsStore } from \'@/stores/settings\'\nconst store = useSettingsStore()\nconst { darkMode } = storeToRefs(store)   // reactive\nconst { toggleDark } = store              // bound action',
        explanation: [
          'storeToRefs keeps darkMode reactive when destructured.',
          'toggleDark is already bound, so plain destructuring is fine.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a setup-style products store with items (ref), a count getter (computed), and an async load() action.',
      hint: 'Return refs/computeds/functions from the setup function.',
      solution: {
        lang: 'js',
        code: 'import { defineStore } from \'pinia\'\nimport { ref, computed } from \'vue\'\nexport const useProductStore = defineStore(\'products\', () => {\n  const items = ref([])\n  const count = computed(() => items.value.length)\n  async function load() {\n    items.value = await (await fetch(\'/api/products\')).json()\n  }\n  return { items, count, load }\n})',
        explanation: [
          'In setup form, ref → state, computed → getter, function → action.',
          'Everything must be returned to be exposed; un-returned values stay private.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate reports their component shows stale user data after destructuring `const { name } = useUserStore()`. Diagnose and fix.',
      hint: 'Think about what destructuring does to a reactive proxy.',
      solution: {
        lang: 'js',
        code: '// BUG: destructuring copies the current value out of the reactive proxy\n// const { name } = useUserStore()   // name never updates\n\n// FIX:\nimport { storeToRefs } from \'pinia\'\nconst store = useUserStore()\nconst { name } = storeToRefs(store)   // name is now a reactive ref',
        explanation: [
          'Plain destructuring severs the reactive link, so the local copy never updates.',
          'storeToRefs returns refs bound to the store state, restoring reactivity.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Pinia is the answer to "how do you manage global state in Vue 3" — a near-guaranteed interview question. Knowing its shape, the storeToRefs gotcha, and its SSR safety puts you ahead of candidates who only memorized the API surface.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and to write a basic counter store. Product companies (Zoho, Flipkart, Razorpay) ask about storeToRefs, async actions, and store composition. FAANG-level interviews probe SSR request-scoping, getter caching, and performance of large stores.',
    whatInterviewersExpect:
      'They expect you to define a store with state/getters/actions, explain why state is a function, demonstrate storeToRefs, write an async action with loading/error state, and articulate SSR safety.',
  },
}

export default piniaBasics
