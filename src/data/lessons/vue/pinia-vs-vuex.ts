import type { ConceptLesson } from '../../../types/lesson'

const piniaVsVuex: ConceptLesson = {
  // 1. Concept Summary
  slug: 'pinia-vs-vuex',
  name: 'Pinia vs Vuex',
  category: 'state',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Pinia is the current official recommendation and Vuex is in maintenance mode — knowing why the ecosystem moved is a standard interview talking point.',
    'Many real codebases still run Vuex, so you need to understand both APIs and how to migrate from one to the other.',
    'The comparison crystallizes good store design: it explains WHY mutations existed, why they were dropped, and what TypeScript and devtools needs drove the change.',
    'Interviewers use this question to see if you understand the trade-offs of explicit-mutation-tracking vs ergonomics, not just which library is "newer".',
    'Choosing or recommending a state library for a new Vue 3 project is a real decision you may be asked to justify.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vuex is a toy box with a strict rule that every toy change must be written in a logbook by a special helper; Pinia is the same toy box but you can just tidy it yourself and it still keeps a tidy history.',
    story: [
      'Imagine two shared toy boxes. The old one, Vuex, has a rule: you cannot change anything directly — you must ask a special helper called a "mutation" to do it, and they write it in a logbook.',
      'That logbook was great for seeing exactly what changed and when, but asking a helper for every tiny change got tiring and slow.',
      'The new box, Pinia, lets you change toys directly through simple "actions", and it cleverly keeps the same tidy history automatically.',
      'So Pinia gives you the same benefit of knowing what changed, but with far less fuss — that is why most people switched to it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vuex and Pinia are both libraries for keeping shared data in a Vue app, but Pinia is the newer official one.',
    'Vuex made you change data only through special functions called "mutations", and async work went in "actions" that then called mutations — lots of steps.',
    'Pinia removed mutations: you just change data inside actions directly, so there is much less code and it works better with TypeScript.',
    'Both let you inspect changes in devtools, but Pinia\'s API is simpler, has no global namespacing headaches, and is the recommended choice for new Vue 3 apps.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vuex and Pinia are state management libraries for Vue. Vuex (v3/v4) uses a single store with state, getters, mutations (the only way to change state synchronously) and actions (async). Pinia uses multiple flat stores with state, getters and actions only — mutations are gone.',
    how: 'In Vuex you commit a mutation to change state and dispatch an action for async flows. In Pinia you call an action and assign to state directly; there is no commit/dispatch ceremony and no global module namespacing.',
    why: 'Pinia\'s removal of mutations and string-based dispatch dramatically improves TypeScript inference, reduces boilerplate, and simplifies code splitting, which is why Vue made it the official recommendation.',
    code: {
      label: 'Same counter — Vuex vs Pinia',
      lang: 'js',
      code: '// VUEX\nconst store = createStore({\n  state: () => ({ count: 0 }),\n  mutations: { INC(s) { s.count++ } },\n  actions: { inc({ commit }) { commit(\'INC\') } },\n})\n// component: store.dispatch(\'inc\')\n\n// PINIA\nimport { defineStore } from \'pinia\'\nexport const useCounter = defineStore(\'counter\', {\n  state: () => ({ count: 0 }),\n  actions: { inc() { this.count++ } },\n})\n// component: useCounter().inc()',
      explanation: [
        'Vuex requires a mutation (INC) AND an action (inc) that commits it — two layers for one change.',
        'Pinia collapses that into a single action that mutates state directly via this.',
        'Vuex uses string types (commit(\'INC\'), dispatch(\'inc\')) which break TypeScript inference.',
        'Pinia methods are real functions with full type inference and autocomplete.',
        'Less code, fewer concepts, same devtools tracking.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vuex is the legacy Flux-inspired store for Vue: a single centralized store with strictly tracked synchronous mutations, async actions that commit those mutations, getters, and namespaced modules. Pinia is the official successor for Vue 3: multiple independent, flat, composable stores with state, getters, and actions only — mutations are removed because Vue 3\'s Proxy reactivity makes direct, devtools-trackable mutation feasible. Pinia offers superior TypeScript inference (no string types), simpler code splitting (no nested modules), and the same time-travel devtools, while remaining SSR-safe via per-request instances.',

  // 7. Internal Working
  internalWorking: [
    'Vuex enforced mutations as the only synchronous state-change channel so it could intercept and log every change for devtools time-travel under Vue 2\'s reactivity.',
    'Vue 3\'s Proxy-based reactivity lets Pinia observe arbitrary state writes directly, so the dedicated mutation layer became unnecessary — actions can mutate and devtools still records via $onAction and state patches.',
    'Vuex modules were nested and namespaced, requiring string path prefixes; Pinia stores are flat singletons keyed by id, removing namespace plumbing.',
    'Pinia getters compile to computed refs (cached); Vuex getters were also cached but accessed through the store getter map by string key.',
    'Both integrate with the same Vue Devtools; Pinia maps each store to a devtools panel and exposes $patch/$reset/$subscribe for inspection and mutation tracing.',
    'Under SSR both create fresh stores per request, but Pinia\'s flat composable design makes hydration and typing simpler.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '            VUEX (single store, strict flow)              PINIA (flat stores)\n\n  Component                                          Component\n     │ dispatch(\'inc\')                                   │ store.inc()\n     ▼                                                   ▼\n  ┌─ actions ─┐  commit(\'INC\')  ┌─ mutations ─┐     ┌──── actions ────┐\n  │  async    │ ───────────────►│ sync only   │     │ mutate state    │\n  └───────────┘                 └──────┬──────┘     │ directly (this) │\n        │ getters                      ▼            └────────┬────────┘\n        ▼                          ┌ state ┐                 ▼\n   namespaced modules              └───────┘            state + getters\n   (string paths)                                       (flat, typed)\n\n  More layers, string types  ──────────────►  Fewer layers, full inference',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — accessing state and getters',
      lang: 'js',
      code: '// VUEX\nthis.$store.state.count\nthis.$store.getters.double\nthis.$store.commit(\'INC\')\nthis.$store.dispatch(\'incAsync\')\n\n// PINIA\nconst counter = useCounter()\ncounter.count        // state\ncounter.double       // getter\ncounter.inc()        // action (sync or async)',
      explanation: [
        'Vuex access goes through $store with string keys and commit/dispatch.',
        'Pinia exposes state, getters, and actions as plain properties/methods on the store.',
        'Pinia has no separate commit/dispatch vocabulary.',
        'The Pinia API is fully typed; Vuex string keys are not.',
      ],
    },
    intermediate: {
      label: 'Intermediate — async flow comparison',
      lang: 'js',
      code: '// VUEX: action must commit a mutation\nactions: {\n  async fetchUser({ commit }, id) {\n    const u = await api.get(id)\n    commit(\'SET_USER\', u)        // cannot assign state here directly\n  },\n}\nmutations: { SET_USER(s, u) { s.user = u } }\n\n// PINIA: action assigns state directly\nactions: {\n  async fetchUser(id) {\n    this.user = await api.get(id)   // direct, no mutation\n  },\n}',
      explanation: [
        'Vuex forbids assigning state inside actions; you must commit a mutation.',
        'This split means every async fetch needs both an action and a mutation.',
        'Pinia lets the action assign state directly, halving the code.',
        'Devtools still tracks the Pinia change without an explicit mutation.',
        'This is the most visible day-to-day difference.',
      ],
    },
    advanced: {
      label: 'Advanced — modules vs flat stores',
      lang: 'js',
      code: '// VUEX: namespaced modules, string paths\nconst store = createStore({\n  modules: {\n    cart: { namespaced: true, state: ..., mutations: ... },\n  },\n})\n// usage: store.commit(\'cart/ADD\'); mapState(\'cart\', [\'items\'])\n\n// PINIA: independent flat stores, just import what you need\nimport { useCartStore } from \'@/stores/cart\'\nimport { useUserStore } from \'@/stores/user\'\nconst cart = useCartStore()\nconst user = useUserStore()\n// cross-store: call useUserStore() inside a cart action',
      explanation: [
        'Vuex modules require namespacing and string path prefixes for everything.',
        'Pinia treats each store as an independent module you import directly — natural code splitting.',
        'Cross-store access in Pinia is just calling the other useStore() inside an action.',
        'No global registration of modules; stores register lazily on first use.',
        'This flat design is far friendlier to tree-shaking and TypeScript.',
      ],
    },
    realProject: {
      label: 'Real project — migrating a Vuex module to a Pinia store',
      lang: 'js',
      code: '// FROM Vuex module:\n// state, getters, mutations(SET_*), actions(commit SET_*)\n\n// TO Pinia store:\nimport { defineStore } from \'pinia\'\nexport const useAuthStore = defineStore(\'auth\', {\n  state: () => ({ user: null, token: null }),\n  getters: { isLoggedIn: (s) => !!s.token },\n  actions: {\n    async login(creds) {\n      const { user, token } = await api.login(creds)\n      this.user = user            // was a SET_USER mutation\n      this.token = token          // was a SET_TOKEN mutation\n    },\n    logout() { this.user = null; this.token = null },\n  },\n})',
      explanation: [
        'Migration: state and getters map almost 1:1.',
        'Each mutation collapses into a direct assignment inside the corresponding action.',
        'commit/dispatch call sites become plain method calls (store.login()).',
        'Namespaced module paths become a single imported store.',
        'Components swap mapState/mapActions for useStore() + storeToRefs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the main difference between Vuex and Pinia?',
      answer: 'Pinia removes mutations — you change state directly inside actions — and uses flat, independently importable stores instead of Vuex\'s single store with namespaced modules. Pinia is the official recommendation for Vue 3; Vuex is in maintenance mode.',
      explanation: 'Naming the mutation removal and flat stores covers the core distinction.',
    },
    {
      level: 'beginner',
      question: 'Why did Pinia drop mutations?',
      answer: 'Vue 3\'s Proxy reactivity lets devtools track direct state writes, so the dedicated mutation layer that Vuex needed for change tracking became unnecessary boilerplate. Removing it simplifies code and improves TypeScript inference.',
      explanation: 'Linking the removal to Proxy reactivity shows understanding of the why, not just the what.',
    },
    {
      level: 'intermediate',
      question: 'Why does Pinia have better TypeScript support than Vuex?',
      answer: 'Vuex relies on string-based commit/dispatch and getter access, which TypeScript cannot infer types for. Pinia uses real methods and properties, so types, autocomplete, and refactoring flow naturally from the store definition.',
      explanation: 'String-typing is the crux of Vuex\'s TS pain.',
    },
    {
      level: 'intermediate',
      question: 'How do modules differ between the two?',
      answer: 'Vuex uses one store with nested, namespaced modules accessed by string paths. Pinia has multiple flat, independent stores you import directly, which simplifies code splitting and avoids namespace plumbing.',
      explanation: 'The flat-vs-nested point matters for scalability and tree-shaking.',
    },
    {
      level: 'advanced',
      question: 'How would you migrate a large Vuex store to Pinia incrementally?',
      answer: 'Run both side by side: keep Vuex installed while introducing Pinia, migrate one module at a time into a flat store (state/getters map directly, mutations fold into actions), update call sites from commit/dispatch to method calls, and remove the Vuex module once consumers are switched.',
      explanation: 'Incremental coexistence and per-module migration show real migration experience.',
    },
    {
      level: 'senior',
      question: 'Are there cases where Vuex is still preferable?',
      answer: 'Mainly inertia: large existing Vuex codebases, Vue 2 apps not yet on Vue 3, or teams whose tooling/conventions depend on the explicit mutation log. For new Vue 3 work, Pinia is the recommended choice; the explicit-mutation guarantee Vuex offered is rarely worth its cost given Proxy-based tracking.',
      explanation: 'Acknowledging legacy realities while defaulting to Pinia is the balanced senior answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What problem did Vuex mutations solve that Pinia handles differently?',
    'How does devtools time-travel still work in Pinia without mutations?',
    'Can Pinia and Vuex coexist during a migration?',
    'How do getters differ between the two libraries?',
    'Why are flat stores better for code splitting?',
    'What does $patch do in Pinia and is there a Vuex equivalent?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Claiming Pinia is "just Vuex 5 with a new name".',
      why: 'It misses the architectural shift: no mutations, flat composable stores, and TS-first design.',
      fix: 'Explain the removal of mutations and the move from one namespaced store to many flat stores.',
    },
    {
      mistake: 'Trying to commit/dispatch in Pinia.',
      why: 'Pinia has no commit/dispatch — those are Vuex concepts.',
      fix: 'Call actions as methods (store.action()) and assign state directly inside actions.',
    },
    {
      mistake: 'Recreating Vuex namespacing in Pinia with one giant store.',
      why: 'It throws away Pinia\'s code-splitting and modularity benefits.',
      fix: 'Use multiple small stores, importing only what each component needs.',
    },
    {
      mistake: 'Assuming dropping mutations loses devtools tracing.',
      why: 'Vue 3 Proxy reactivity lets Pinia trace direct writes via $onAction/$subscribe.',
      fix: 'Rely on Pinia devtools integration; no mutation layer is needed for tracking.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Pinia', detail: 'Default store for all new Vue 3 projects; flat domain stores with typed actions and getters.' },
    { area: 'Vuex', detail: 'Still present in legacy Vue 2/3 codebases; teams migrate module-by-module to Pinia while both run.' },
    { area: 'Vue', detail: 'Official docs now recommend Pinia and treat Vuex as maintenance-only, guiding new architecture decisions.' },
    { area: 'Nuxt', detail: 'Nuxt 3 ships with Pinia as the recommended store, with SSR-safe per-request instances.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Pinia\'s flat stores tree-shake unused stores, shrinking bundles versus a monolithic Vuex store.',
      'Both cache getters as computed values, so derived reads are cheap.',
    ],
    bad: [
      'A giant Vuex store (or one giant Pinia store) makes many components re-render on unrelated changes.',
      'Vuex\'s extra mutation layer adds indirection (minor runtime, larger code).',
    ],
    optimizations: [
      'Split state into focused Pinia stores so subscriptions stay narrow.',
      'Lazily import stores so unused state code never loads.',
      'Use storeToRefs to bind only needed fields, avoiding broad subscriptions.',
      'Prefer $patch for batched multi-field updates to coalesce reactivity triggers.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['pinia-basics', 'state-management-overview', 'reactivity-fundamentals'],
    nextConcepts: ['pinia-stores-actions', 'state-sharing-composables', 'provide-inject-state'],
    dependencyNote:
      'Understand pinia-basics and the state-management overview first; this comparison contextualizes why Pinia exists and how to migrate from Vuex, then pinia-stores-actions deepens store internals.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: Vuex (left), Pinia (right).',
      'Under Vuex list: single store, mutations (sync only), actions (async, commit), namespaced modules, string types.',
      'Under Pinia list: many flat stores, no mutations, actions mutate directly, full TS inference.',
      'Draw the Vuex flow dispatch → action → commit → mutation → state, then Pinia\'s action → state.',
      'Say: "Proxy reactivity made the mutation layer redundant, so Pinia removed it — less code, better types, same devtools."',
    ],
    diagram: '  VUEX                              PINIA\n  dispatch → action → commit        store.action()\n              → mutation → state        → state (direct)\n  one store, namespaced modules     many flat stores\n  string types (no inference)       full TS inference\n  maintenance mode                  official recommendation',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vuex and Pinia both manage shared Vue state, but Pinia is the official Vue 3 successor. Vuex forced changes through synchronous mutations (committed by async actions) inside one namespaced store. Pinia removes mutations — actions assign state directly — and uses many flat, independently imported stores. Because Vue 3\'s Proxy reactivity lets devtools track direct writes, the mutation layer became unnecessary. The payoff: far less boilerplate, full TypeScript inference, easier code splitting, same time-travel devtools.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vuex and Pinia are both state libraries for Vue, but Pinia is the official recommendation for Vue 3 and Vuex is now in maintenance mode. Vuex follows a stricter Flux-style flow: state can only be changed synchronously through mutations, async work lives in actions that commit those mutations, and everything sits in one centralized store organized into namespaced modules accessed by string paths. That mutation layer existed so Vue 2 devtools could track every change for time-travel debugging. Pinia drops mutations entirely. The reason is that Vue 3\'s Proxy-based reactivity lets devtools observe direct state writes, so you no longer need a dedicated channel just for tracking. In Pinia you assign to state directly inside actions through `this`, which roughly halves the code for any async flow. Pinia also replaces one nested, namespaced store with many flat, independently importable stores, which makes code splitting natural and removes namespace plumbing. The biggest practical win is TypeScript: Vuex relies on string-based commit and dispatch that TS cannot infer, while Pinia\'s actions and getters are real methods and properties with full inference and autocomplete. Migration is incremental — you can run both side by side and convert one module at a time: state and getters map almost directly, each mutation folds into the matching action, and commit/dispatch call sites become plain method calls. The only reason to stay on Vuex today is inertia in large existing codebases. For any new Vue 3 project, Pinia is the right default.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Explicit mutations (Vuex) give a guaranteed single change channel and a clear audit log; Pinia trades that strictness for ergonomics, relying on Proxy tracking and discipline.',
      'Flat stores (Pinia) ease splitting but require conventions to avoid accidental cross-store coupling; Vuex modules made boundaries explicit but verbose.',
      'Migration cost: rewriting commit/dispatch call sites across a large app is non-trivial even if the store mapping is mechanical.',
    ],
    edgeCases: [
      'Mutating Vuex state outside a mutation triggers strict-mode errors; Pinia has no such restriction, so undisciplined direct mutation can scatter logic.',
      'Cross-store calls in Pinia must invoke useStore() inside actions/getters, not at module load, to avoid getActivePinia errors.',
      'Devtools time-travel in Pinia replays via state patches, not a mutation log, so very large state snapshots can be heavy.',
    ],
    runtimeBehavior: [
      'Both cache getters as computed; Pinia exposes $subscribe/$onAction for tracing and $patch for batched updates.',
      'Pinia stores instantiate lazily and tree-shake; unused Vuex modules in one store still ship.',
      'Direct assignment in Pinia actions batches through the same async render queue as all reactivity.',
    ],
    scalability: [
      'Pinia scales by adding focused stores; Vuex scaled by adding namespaced modules with growing string-path overhead.',
      'For server data, neither replaces a proper caching/query layer — keep both stores lean.',
      'Large migrations are best staged behind feature areas with both libraries coexisting.',
    ],
    productionConcerns: [
      'During migration, two state systems coexist — guard against duplicating the same data in both.',
      'SSR hydration differs slightly; verify serialized state shape after migrating each module.',
      'Persisted Vuex plugins need re-implementing as Pinia plugins with versioned migrations.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pinia = official Vue 3 store; Vuex = maintenance mode.',
    'Vuex: mutations (sync) + actions (async, commit) + namespaced modules.',
    'Pinia: state + getters + actions only — NO mutations.',
    'Pinia actions assign state directly via this.',
    'Vuex uses string commit/dispatch (poor TS); Pinia uses real methods (full TS).',
    'Vuex = one nested store; Pinia = many flat, importable stores.',
    'Proxy reactivity made the mutation layer redundant.',
    'Both keep time-travel devtools.',
    'Migration: map state/getters, fold mutations into actions, swap commit/dispatch for method calls.',
    'Pinia stores tree-shake and code-split naturally.',
    'Both are SSR-safe via per-request instances.',
    'Default to Pinia for new Vue 3 apps.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Name the four parts of a Vuex store and the three parts of a Pinia store.',
      hint: 'Think about what each library uses to change state.',
      solution: {
        lang: 'js',
        code: '// VUEX: state, getters, mutations, actions\n// PINIA: state, getters, actions   (no mutations)',
        explanation: [
          'Vuex separates synchronous mutations from async actions.',
          'Pinia merges change logic into actions, removing the mutation concept.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite this Vuex action+mutation as a single Pinia action: actions:{ async load({commit}){ commit(\'SET\', await api()) } }, mutations:{ SET(s,d){ s.data=d } }',
      hint: 'Assign state directly inside the action.',
      solution: {
        lang: 'js',
        code: 'actions: {\n  async load() {\n    this.data = await api()   // direct assignment, no mutation\n  },\n}',
        explanation: [
          'The mutation collapses into a direct assignment.',
          'No commit is needed; devtools still traces the change.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why "const { count } = mapState([\'count\'])" style code in Vuex becomes "storeToRefs" in Pinia, and write the Pinia equivalent.',
      hint: 'Both must preserve reactivity when extracting state.',
      solution: {
        lang: 'js',
        code: '// Vuex used mapState/mapGetters helpers to wire reactive bindings.\n// Pinia uses storeToRefs:\nimport { storeToRefs } from \'pinia\'\nconst store = useCounter()\nconst { count } = storeToRefs(store)   // reactive\nconst { inc } = store                  // bound action',
        explanation: [
          'Both libraries must avoid breaking reactivity when destructuring state.',
          'storeToRefs is Pinia\'s mechanism, replacing Vuex\'s mapState helpers.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A team on Vuex wants to adopt Pinia without a big-bang rewrite. Outline a safe incremental migration.',
      hint: 'Both can be installed at once.',
      solution: {
        lang: 'js',
        code: '// 1. Install Pinia alongside Vuex: app.use(createPinia()); keep app.use(store)\n// 2. Pick one Vuex module; create an equivalent flat Pinia store\n//    (state/getters map 1:1, mutations fold into actions)\n// 3. Migrate that module\'s consumers from commit/dispatch to store.method()\n// 4. Delete the Vuex module once nothing references it\n// 5. Repeat per module; remove Vuex when empty',
        explanation: [
          'Coexistence avoids a risky big-bang rewrite.',
          'Per-module migration keeps each change small and testable.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This comparison is a favorite because it reveals whether you understand the WHY behind state architecture — the role of mutations, the impact of Proxy reactivity, and TypeScript ergonomics — not just which library is newer.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is the difference between Vuex and Pinia". Product companies (Zoho, Flipkart, Razorpay) ask you to migrate a module and justify dropping mutations. FAANG-level interviews probe devtools tracing without mutations, code-splitting implications, and migration strategy at scale.',
    whatInterviewersExpect:
      'They expect you to name the structural differences (mutations, flat stores, typing), explain why Proxy reactivity made mutations redundant, default to Pinia for new work, and describe an incremental migration.',
  },
}

export default piniaVsVuex
