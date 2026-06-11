import type { ConceptLesson } from '../../../types/lesson'

const piniaStoresActions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'pinia-stores-actions',
  name: 'Pinia Stores & Actions',
  category: 'state',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Actions are where your real business logic lives — API calls, validation, optimistic updates, cross-store coordination — so mastering them is mastering the useful part of Pinia.',
    'Knowing the full store surface ($patch, $reset, $subscribe, $onAction, getters with arguments, cross-store calls) separates someone who can write a counter from someone who can architect an app\'s data layer.',
    'Async actions with proper loading/error handling are the most common real-world store pattern and a frequent live-coding task.',
    'Store composition (one store using another) and getter design are where subtle bugs and interview follow-ups concentrate.',
    'Testing stores in isolation is expected in production teams, and it hinges on understanding how actions and the active Pinia instance work.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A store is a kitchen; the state is the food in the fridge, getters are the recipes that combine food into a dish, and actions are the chefs who actually cook and restock.',
    story: [
      'Picture a kitchen. The fridge holds the ingredients — that is the state, the raw data.',
      'Recipes tell you how to combine ingredients into a finished dish without changing what is in the fridge — those are getters, like "total price".',
      'The chefs are the only ones who open the fridge to cook with ingredients or go shopping to restock — those are actions.',
      'When you want food, you do not rummage in the fridge yourself; you ask a chef (call an action), and they handle it properly and keep the kitchen tidy.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Pinia store has three jobs: hold data (state), compute shortcuts from that data (getters), and change the data (actions).',
    'Getters are like smart read-only values — for example, a "cart total" that adds up item prices automatically whenever the cart changes.',
    'Actions are functions you call to do things: add an item, fetch data from a server, log a user in. They can use other actions and even other stores.',
    'Stores also have built-in helpers like $reset (back to start), $patch (change several fields at once), and $subscribe (run code whenever state changes).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'In Pinia, getters are cached computed values derived from state, and actions are methods that contain logic and mutate state. Stores also expose built-in helpers: $patch (batched update), $reset (restore initial state), $subscribe (state change hook), and $onAction (action interceptor).',
    how: 'You define getters as functions of state (and optionally other getters), and actions as methods that read/write state via this and can be async. You call actions like normal methods and use $-helpers on the store instance for batch updates, resets, and subscriptions.',
    why: 'Centralizing logic in actions keeps state changes traceable and testable, getters avoid recomputing derived data, and the $-helpers cover cross-cutting needs like persistence and analytics.',
    code: {
      label: 'A cart store with getters and actions',
      lang: 'js',
      code: 'import { defineStore } from \'pinia\'\n\nexport const useCartStore = defineStore(\'cart\', {\n  state: () => ({ items: [] }),\n  getters: {\n    count: (s) => s.items.length,\n    total: (s) => s.items.reduce((n, i) => n + i.price * i.qty, 0),\n    // getter returning a function (parameterized getter)\n    itemById: (s) => (id) => s.items.find((i) => i.id === id),\n  },\n  actions: {\n    add(item) { this.items.push(item) },\n    clear() { this.$reset() },           // built-in reset helper\n  },\n})',
      explanation: [
        'count and total are cached getters recomputed only when items change.',
        'itemById returns a function, letting you pass arguments (parameterized getter); note such getters are NOT cached.',
        'Actions use this to read and mutate state directly.',
        '$reset() restores state to the initial value from the state() function.',
        'Components call useCartStore().add(...) and read .count / .total reactively.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'In Pinia, getters are compiled to cached computed refs derived from state (and other getters), accessed as properties; a getter may return a function to accept arguments, which forgoes caching. Actions are plain methods bound so `this` is the store, may be synchronous or async, can call other actions and other stores, and mutate state directly. Each store instance also exposes runtime helpers: $patch for batched mutation, $reset to restore the initial state, $subscribe to react to any state change, and $onAction to intercept action invocations (used by plugins for persistence, logging, and undo).',

  // 7. Internal Working
  internalWorking: [
    'Each getter becomes a computed ref keyed off its reactive dependencies, so it caches and only recomputes when those dependencies change; a getter returning a function bypasses caching because the returned function is re-invoked each call.',
    'Actions are wrapped so `this` binds to the store; the wrapper enables $onAction interception, capturing arguments, after-resolution, and error hooks.',
    'Direct state writes inside actions flow through the reactive() Proxy, scheduling subscribed render effects on the async update queue.',
    '$patch accepts an object (shallow-merged) or a mutator function; it groups multiple changes so devtools logs one patch and reactivity triggers efficiently.',
    '$reset (options stores) re-invokes the original state() function and assigns the fresh object back, restoring defaults.',
    '$subscribe registers a watcher on the store state, firing on any mutation with the patch and new state — the hook persistence plugins use.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '                         useCartStore() (reactive singleton)\n  ┌──────────────────────────────────────────────────────────────────┐\n  │  STATE      items: [ {price,qty}, ... ]   ← reactive() Proxy       │\n  │                 ▲              ▲                                    │\n  │     reads       │              │ writes (this.items.push)          │\n  │  GETTERS  total ─┘  count ─────┘   itemById(id) → fn (uncached)     │\n  │  (cached computed)                                                 │\n  │  ACTIONS  add() / clear() ── mutate state, call other actions/stores│\n  └───────┬───────────────┬───────────────┬───────────────┬───────────┘\n          │ $patch        │ $reset        │ $subscribe     │ $onAction\n     batched update   restore initial   state-change hook   action hook\n                                          (persist)          (log/undo)',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — getter vs parameterized getter',
      lang: 'js',
      code: 'getters: {\n  doneCount: (s) => s.todos.filter((t) => t.done).length,   // cached\n  byId: (s) => (id) => s.todos.find((t) => t.id === id),     // NOT cached\n  // getter using another getter via this:\n  summary() { return this.doneCount + \' done\' },\n}',
      explanation: [
        'doneCount is a cached computed — recomputed only when todos change.',
        'byId returns a function so you can call store.byId(3); it runs every call (no cache).',
        'A getter can reference other getters through this.',
        'Use parameterized getters sparingly since they skip caching.',
      ],
    },
    intermediate: {
      label: 'Intermediate — async action with loading/error and $patch',
      lang: 'js',
      code: 'actions: {\n  async fetchTodos() {\n    this.$patch({ loading: true, error: null })   // batched update\n    try {\n      const res = await fetch(\'/api/todos\')\n      this.todos = await res.json()\n    } catch (e) {\n      this.error = e.message\n    } finally {\n      this.loading = false\n    }\n  },\n}',
      explanation: [
        '$patch sets loading and error together as one tracked change.',
        'The action is async; no mutation layer is needed.',
        'todos, loading, and error are all reactive state the UI binds to.',
        'finally guarantees loading resets even on error.',
        'This loading/error/data shape is the standard production async pattern.',
      ],
    },
    advanced: {
      label: 'Advanced — store composition and $onAction',
      lang: 'js',
      code: 'import { defineStore } from \'pinia\'\nimport { useAuthStore } from \'./auth\'\n\nexport const useOrderStore = defineStore(\'orders\', {\n  state: () => ({ list: [] }),\n  actions: {\n    async placeOrder(cart) {\n      const auth = useAuthStore()             // call other store INSIDE action\n      if (!auth.isLoggedIn) throw new Error(\'login required\')\n      const order = await api.create(cart, auth.token)\n      this.list.push(order)\n      return order\n    },\n  },\n})\n\n// elsewhere: intercept every action\n// orderStore.$onAction(({ name, after, onError }) => {\n//   after(() => track(name)); onError((e) => report(e))\n// })',
      explanation: [
        'Another store is accessed by calling its useStore() inside the action (never at module top-level).',
        'placeOrder coordinates auth + API + local state in one place.',
        '$onAction intercepts every action for analytics, logging, or undo.',
        'after() runs on successful resolution; onError() runs on throw/reject.',
        'This is how plugins (persistence, audit) hook in without touching action code.',
      ],
    },
    realProject: {
      label: 'Real project — testing a store in isolation',
      lang: 'js',
      code: 'import { setActivePinia, createPinia } from \'pinia\'\nimport { beforeEach, it, expect } from \'vitest\'\nimport { useCartStore } from \'@/stores/cart\'\n\nbeforeEach(() => {\n  setActivePinia(createPinia())   // fresh Pinia per test\n})\n\nit(\'adds items and computes total\', () => {\n  const cart = useCartStore()\n  cart.add({ id: 1, price: 10, qty: 2 })\n  expect(cart.count).toBe(1)\n  expect(cart.total).toBe(20)\n})',
      explanation: [
        'setActivePinia(createPinia()) gives each test an isolated store, preventing state bleed.',
        'You can call actions and assert on getters/state directly — no component needed.',
        'Getters recompute reactively as state changes.',
        'This isolation is exactly why state() must be a function.',
        'Stub fetch/api in async-action tests to assert loading/error transitions.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a getter and an action in Pinia?',
      answer: 'A getter is a cached, derived read-only value computed from state (like a computed property). An action is a method that contains logic and can mutate state, can be async, and can call other actions or stores.',
      explanation: 'Read-derived vs write-logic plus caching is the core distinction.',
    },
    {
      level: 'beginner',
      question: 'How do you pass an argument to a getter?',
      answer: 'Return a function from the getter: byId: (state) => (id) => state.items.find(i => i.id === id), then call store.byId(3). Note such parameterized getters are not cached.',
      explanation: 'The return-a-function pattern and the caching caveat are both expected.',
    },
    {
      level: 'intermediate',
      question: 'When and why would you use $patch?',
      answer: '$patch applies multiple state changes as one batched, devtools-logged mutation, either via an object (shallow merge) or a mutator function. It is cleaner and slightly more efficient than several separate assignments and reads as a single intentional change.',
      explanation: 'Batching and single-change semantics are the key points.',
    },
    {
      level: 'intermediate',
      question: 'How do you call one store from another?',
      answer: 'Call the other store\'s useStore() inside the action or getter (not at module top level). For example, inside an order action: const auth = useAuthStore(); then read auth.token. This keeps Pinia active and avoids initialization-order issues.',
      explanation: 'Inside-action invocation is the correct, gotcha-aware answer.',
    },
    {
      level: 'advanced',
      question: 'What is $onAction used for?',
      answer: 'It intercepts every action call on a store, exposing the action name, args, and after/onError callbacks. It powers cross-cutting concerns — logging, analytics, undo/redo, and persistence — without modifying the actions themselves. It is the primary hook Pinia plugins use.',
      explanation: 'Connecting it to plugins and cross-cutting concerns shows depth.',
    },
    {
      level: 'senior',
      question: 'How do you test a store with an async action and assert loading/error transitions?',
      answer: 'Create a fresh Pinia per test with setActivePinia(createPinia()), stub the network (e.g. mock fetch), then call the action and assert loading flips true then false and that data or error is set. Because state() is a function each test is isolated.',
      explanation: 'Isolation via fresh Pinia plus stubbing the boundary is the senior testing answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Are parameterized getters cached? Why not?',
    'What is the difference between $patch with an object and with a function?',
    'How does $subscribe differ from watching a getter?',
    'Can a getter mutate state? (no — keep getters pure)',
    'How do you reset a setup-style store (no built-in $reset)?',
    'How do plugins use $onAction and $subscribe?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating state inside a getter.',
      why: 'Getters are derivations; mutating in them causes infinite loops or surprising side-effects.',
      fix: 'Keep getters pure; put all mutation in actions.',
    },
    {
      mistake: 'Calling another store\'s useStore() at module top level.',
      why: 'Pinia may not be active yet, throwing getActivePinia errors and creating init-order bugs.',
      fix: 'Call the other useStore() inside the action/getter where it is needed.',
    },
    {
      mistake: 'Expecting parameterized getters to cache.',
      why: 'A getter returning a function re-runs every call, so it does not benefit from computed caching.',
      fix: 'Use them only for cheap lookups, or memoize explicitly if expensive.',
    },
    {
      mistake: 'Assuming setup-style stores have $reset.',
      why: '$reset is only auto-implemented for options stores; setup stores need a manual reset.',
      fix: 'Write a reset() action that reassigns the refs to their initial values.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Pinia', detail: 'Async actions encapsulate API calls with loading/error state; $patch batches related updates; $reset clears stores on logout.' },
    { area: 'Component library', detail: 'Persistence plugins use $subscribe to write state to storage and $onAction to log/replay actions.' },
    { area: 'Vue', detail: 'Components bind to getters (count, total) and call actions; storeToRefs keeps getter/state bindings reactive.' },
    { area: 'Nuxt', detail: 'Server-side actions fetch data during SSR; state is serialized and hydrated, with stores reset per request.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Cached getters avoid recomputing derived values on every read.',
      '$patch coalesces multiple mutations into one reactivity trigger.',
    ],
    bad: [
      'Parameterized getters re-run every call, so expensive ones hurt in hot paths.',
      'Heavy logic in actions on large reactive state can cause many subscriber re-renders.',
    ],
    optimizations: [
      'Prefer plain cached getters over parameterized ones when arguments are not truly needed.',
      'Batch related writes with $patch instead of several assignments.',
      'Memoize expensive parameterized lookups explicitly.',
      'Keep getters pure and cheap; move heavy work into actions that run on demand.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['pinia-basics', 'computed', 'reactive', 'composables'],
    nextConcepts: ['pinia-vs-vuex', 'state-sharing-composables', 'testing-composables', 'data-fetching-patterns'],
    dependencyNote:
      'Builds on pinia-basics and the computed/reactive primitives. Getters mirror computed; actions mirror methods. After this, state-sharing-composables and data-fetching-patterns show how stores fit the broader data layer.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the store box with three labelled rows: state, getters, actions.',
      'Show getters reading state (cached) and one getter returning a function (uncached, takes args).',
      'Show actions writing state and calling another store via useOtherStore() inside the action.',
      'List the $-helpers off the side: $patch, $reset, $subscribe, $onAction.',
      'Say: "Getters derive and cache; actions hold logic and mutate; the $-helpers cover batching, reset, and cross-cutting hooks."',
    ],
    diagram: '  ┌──── store ────────────────────────────────┐\n  │ state   {...}                               │\n  │ getters total(cached)  byId(id)→fn(uncached)│\n  │ actions add()  fetch()  (async, this=store) │\n  └───┬──────┬───────┬────────┬─────────────────┘\n      $patch $reset  $subscribe $onAction\n      batch  default  state-hook action-hook',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'In Pinia, getters are cached derived values (like computed); a getter can return a function to take arguments but then loses caching. Actions hold logic, mutate state directly via this, can be async, and can call other actions or stores (call the other useStore() INSIDE the action). Stores expose $patch for batched updates, $reset to restore defaults, $subscribe for state-change hooks, and $onAction to intercept actions — the basis for persistence and logging plugins. Test with a fresh Pinia per test.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Pinia store has three core pieces and a set of runtime helpers. State is the data. Getters are derived values computed from state — they behave like computed properties, so they cache and only recompute when their dependencies change. If a getter needs an argument, you return a function from it, like byId returning (id) => find, but that pattern bypasses caching because the inner function runs on every call, so I reserve it for cheap lookups. Actions are where the real logic lives: they are methods bound so `this` is the store, they can be synchronous or async, they mutate state directly without any mutation layer, and they can call other actions and even other stores. The important gotcha for cross-store access is that you call the other store\'s useStore() inside the action, not at module top level, otherwise Pinia may not be active and you get a getActivePinia error. Beyond these, every store instance gives you helpers: $patch applies several state changes as one batched, devtools-logged mutation, taking either an object that is shallow-merged or a mutator function; $reset restores options-store state to its initial value; $subscribe fires on any state change; and $onAction intercepts every action call with after and onError hooks. Those last two are what persistence, logging, analytics, and undo plugins hook into without touching your action code. For the everyday async case I write an action that flips a loading flag, awaits the API, sets either data or an error, and resets loading in finally. And to test a store I call setActivePinia(createPinia()) before each test for isolation, stub the network, then call actions and assert on getters and state directly — no component required.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Parameterized getters add flexibility but sacrifice caching; sometimes an explicit memo or an action is better.',
      'Centralizing all logic in actions improves traceability but can grow fat stores — extract pure helpers or composables when logic is reusable.',
      'Cross-store coupling via useStore() inside actions is convenient but can create implicit dependency graphs that are hard to reason about at scale.',
    ],
    edgeCases: [
      'Setup-style stores lack auto $reset; you must implement reset manually.',
      'Mutating state inside a getter can cause render loops or stale caches.',
      '$onAction\'s onError fires for thrown sync errors and rejected promises; forgetting to handle one leaks unhandled rejections.',
    ],
    runtimeBehavior: [
      'Getters are computed refs: lazy and cached; reading an unused getter costs nothing until accessed.',
      '$patch with a function lets you mutate complex nested state in one tracked transaction.',
      'Actions intercepted by $onAction still run normally; hooks observe, they do not replace.',
    ],
    scalability: [
      'Split domain logic across focused stores; use store composition for coordination rather than one mega-store.',
      'Move shared, framework-agnostic logic into composables that stores call, keeping stores thin.',
      'For heavy server data, let actions delegate to a caching/query layer instead of hand-managing cache invalidation.',
    ],
    productionConcerns: [
      'Persistence via $subscribe must throttle writes and version the stored shape to survive deploys.',
      'Reset stores on logout to avoid leaking previous-user data into a new session.',
      'Test async actions by stubbing boundaries and asserting loading/error transitions, with a fresh Pinia per test.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Getters = cached derived values (like computed).',
    'Parameterized getter = getter returning a function → NOT cached.',
    'Actions = logic + state mutation; can be async.',
    'Cross-store: call useOtherStore() INSIDE the action, not at module top.',
    'Keep getters pure — never mutate state in a getter.',
    '$patch = batched update (object merge or mutator fn).',
    '$reset = restore options-store initial state (manual for setup stores).',
    '$subscribe = run on any state change (persistence).',
    '$onAction = intercept actions (logging, undo, analytics).',
    'Reset stores on logout to avoid cross-user data leaks.',
    'Test: setActivePinia(createPinia()) per test, stub the network.',
    'Standard async shape: loading → await → data/error → finally loading=false.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add a getter "completed" that returns the number of done todos to a store with state { todos: [] }.',
      hint: 'Filter and take length; it will be cached.',
      solution: {
        lang: 'js',
        code: 'getters: {\n  completed: (s) => s.todos.filter((t) => t.done).length,\n}',
        explanation: [
          'A plain getter is a cached computed value.',
          'It recomputes only when todos changes.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write an async action loadUser(id) that sets loading, fetches /api/users/:id, stores the user or an error, and clears loading. Use $patch for the initial flags.',
      hint: 'Use try/catch/finally.',
      solution: {
        lang: 'js',
        code: 'async loadUser(id) {\n  this.$patch({ loading: true, error: null })\n  try {\n    this.user = await (await fetch(`/api/users/${id}`)).json()\n  } catch (e) {\n    this.error = e.message\n  } finally {\n    this.loading = false\n  }\n}',
        explanation: [
          '$patch batches the loading/error reset into one tracked change.',
          'finally guarantees loading clears even on failure.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'In an orders store action, require the user to be logged in by reading an auth store, then create the order. Show the correct cross-store access.',
      hint: 'Call useAuthStore() inside the action.',
      solution: {
        lang: 'js',
        code: 'async placeOrder(cart) {\n  const auth = useAuthStore()        // inside the action!\n  if (!auth.isLoggedIn) throw new Error(\'login required\')\n  const order = await api.create(cart, auth.token)\n  this.list.push(order)\n  return order\n}',
        explanation: [
          'Accessing another store inside the action keeps Pinia active.',
          'The action coordinates auth, API, and local state in one place.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a manual reset() for a setup-style store with items (ref) and selectedId (ref), since setup stores have no automatic $reset.',
      hint: 'Reassign each ref to its initial value.',
      solution: {
        lang: 'js',
        code: 'export const useThingStore = defineStore(\'thing\', () => {\n  const items = ref([])\n  const selectedId = ref(null)\n  function reset() {\n    items.value = []\n    selectedId.value = null\n  }\n  return { items, selectedId, reset }\n})',
        explanation: [
          'Setup stores do not auto-implement $reset, so you write one.',
          'reset reassigns each ref to its starting value.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Actions and getters are where Pinia earns its keep. If you can design clean getters, write robust async actions with loading/error handling, compose stores correctly, and use the $-helpers, you can architect a real app\'s data layer — exactly what mid-to-senior Vue roles require.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is a getter vs an action". Product companies (Zoho, Flipkart, Razorpay) ask you to write an async action with loading/error and explain $patch/cross-store access. FAANG-level interviews probe getter caching internals, $onAction-based plugins, and isolated store testing.',
    whatInterviewersExpect:
      'They expect you to distinguish cached getters from parameterized ones, write a correct async action, access another store inside an action, use $patch/$reset/$subscribe appropriately, and describe how to test stores in isolation.',
  },
}

export default piniaStoresActions
