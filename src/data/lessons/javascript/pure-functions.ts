import type { ConceptLesson } from '../../../types/lesson'

const pureFunctions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'pure-functions',
  name: 'Pure Functions & Side Effects',
  category: 'functions',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Pure functions are predictable: same input always gives the same output, which makes code easy to test, cache, and reason about.',
    'They isolate side effects (I/O, mutation, randomness, time) so the rest of your app stays deterministic and bug-resistant.',
    'Modern frameworks lean on purity: React components/reducers, Vue computeds, Redux reducers, and memoization all assume pure logic.',
    'Interviewers ask about purity to see whether you understand referential transparency, immutability, and where bugs hide.',
    'Without separating pure logic from effects, you get flaky tests, hard-to-debug state mutations, and code that behaves differently each run.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A pure function is a vending machine: same button, same snack, every single time — and it changes nothing else in the room.',
    story: [
      'Think of a vending machine. You press B4 and you always get the same chocolate bar.',
      'It does not depend on the weather, your mood, or what someone pressed yesterday — only on the button you push right now.',
      'And pressing the button does not rearrange the furniture or turn off the lights; it only gives you your snack.',
      'A pure function works the same way: for the same input it always returns the same output, and it never secretly changes anything outside itself. A function that DOES change something outside — like sending an email or scribbling on a shared list — is doing a "side effect".',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A pure function is like a math formula: f(x) gives the same answer every time you plug in the same x.',
    'It only uses the inputs you give it, and it returns a value without changing anything else in the program.',
    'A side effect is anything a function does beyond returning a value: changing a global variable, modifying an object passed in, printing to the screen, saving to disk, or calling the network.',
    'Side effects are not bad — your app needs them — but keeping them out of most functions makes your code far easier to trust and test.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A pure function is one that (1) returns the same output for the same inputs and (2) has no observable side effects — it does not mutate external state, perform I/O, or depend on anything outside its arguments. A side effect is any interaction with the outside world beyond computing a return value.',
    how: 'You write the function to depend only on its parameters and to produce a brand-new result instead of mutating inputs or globals. Anything impure (fetch, console.log, Date.now, Math.random, DOM writes, mutating arrays) is pushed to the edges of the program.',
    why: 'Purity makes functions trivially testable (no setup/teardown), safely cacheable (memoization), and safe to run in any order or in parallel, because they cannot interfere with each other.',
    code: {
      label: 'Pure vs impure',
      lang: 'js',
      code: `// PURE: depends only on input, returns new value, no mutation\nfunction addTax(price, rate) {\n  return price + price * rate\n}\n\n// IMPURE: mutates the input AND reads external state\nlet taxRate = 0.1\nfunction applyTax(cart) {\n  cart.total += cart.total * taxRate   // mutates cart, reads global\n  return cart\n}`,
      explanation: [
        'addTax uses only its parameters and returns a fresh number — same inputs, same output.',
        'applyTax mutates the cart object passed in (a side effect) and reads the global taxRate.',
        'The impure version behaves differently if taxRate changes elsewhere, and it surprises callers by altering their object.',
        'Calling addTax twice with the same args is always identical; calling applyTax twice double-taxes the cart.',
        'Prefer returning new data over mutating arguments.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A pure function is referentially transparent: it always maps the same arguments to the same return value and produces no observable side effects (no mutation of external/argument state, no I/O, no reliance on non-deterministic sources like Date.now, Math.random, or network). Because a call can be replaced by its result without changing program behavior, pure functions are safely memoizable, parallelizable, and order-independent. Side effects are any state changes or external interactions beyond computing the return value, and well-structured programs concentrate them at the boundaries (the "functional core, imperative shell").',

  // 7. Internal Working
  internalWorking: [
    'A pure function reads only its parameters; the engine resolves no free variables that change behavior, so its result is fully determined by inputs.',
    'It allocates and returns new values (objects/arrays) rather than mutating references it received, so no caller-visible heap state changes.',
    'Referential transparency means the runtime/compiler (or you) can substitute a call with its cached result — this is the basis of memoization.',
    'Impurity enters when a function dereferences and writes to an object/array argument, assigns to an outer/global binding, or calls an effectful API; these create observable changes outside the call.',
    'Non-determinism (Date.now, Math.random, reading mutable globals) breaks the same-input-same-output guarantee even without mutation.',
    'A common architecture is "functional core, imperative shell": pure functions compute decisions/values; a thin outer layer performs the actual I/O and mutation based on those values.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  PURE                              IMPURE
  ────                              ──────
  input ─► [ f ] ─► output          input ─► [ g ] ─► output
            │ no other effect                 │  │
            ▼                                 │  ├─► mutates arg / global
  same input ⇒ same output                    │  ├─► console / DOM / fetch
  (cacheable, testable)                       │  └─► reads Date.now/random
                                    different each run, hard to test`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a pure transformer',
      lang: 'js',
      code: `function fullName(user) {\n  return \`\${user.first} \${user.last}\`\n}\nfullName({ first: 'Ada', last: 'Lovelace' }) // 'Ada Lovelace'`,
      explanation: [
        'Depends only on the user argument.',
        'Returns a new string; the user object is untouched.',
        'Same input always yields the same output.',
        'Trivially testable: no mocks or setup needed.',
      ],
    },
    intermediate: {
      label: 'Intermediate — avoiding mutation (immutable updates)',
      lang: 'js',
      code: `// Impure: push mutates the original array\nfunction addImpure(list, item) { list.push(item); return list }\n\n// Pure: returns a new array, original untouched\nfunction addPure(list, item) { return [...list, item] }\n\nconst a = [1, 2]\nconst b = addPure(a, 3)   // a is still [1, 2], b is [1, 2, 3]`,
      explanation: [
        'addImpure mutates the caller\'s array — a hidden side effect that causes aliasing bugs.',
        'addPure spreads into a new array, leaving the input intact.',
        'Immutability is the practical key to purity for objects and arrays.',
        'This is exactly how Redux reducers and Vue/React state updates are written.',
      ],
    },
    advanced: {
      label: 'Advanced — functional core, imperative shell',
      lang: 'js',
      code: `// PURE core: decides what to do, no I/O\nfunction nextState(state, action) {\n  switch (action.type) {\n    case 'increment': return { ...state, count: state.count + 1 }\n    default: return state\n  }\n}\n\n// IMPURE shell: performs effects based on the pure result\nfunction dispatch(action) {\n  state = nextState(state, action)   // pure computation\n  saveToLocalStorage(state)          // side effect at the edge\n  render(state)                      // side effect at the edge\n}`,
      explanation: [
        'nextState is pure: it computes a new state from the old state and an action, with no I/O.',
        'dispatch is the impure shell that runs the side effects (persistence, rendering).',
        'Isolating effects makes the core unit-testable without any environment.',
        'This is the reducer pattern at the heart of Redux/Vuex/Pinia.',
      ],
    },
    realProject: {
      label: 'Real project — pure derivation in a Vue computed',
      lang: 'js',
      code: `import { computed } from 'vue'\n\n// items is a ref<CartItem[]>\nconst subtotal = computed(() =>\n  items.value.reduce((sum, i) => sum + i.price * i.qty, 0)   // PURE\n)\n\n// the impure part — persisting — lives outside, in a watcher\nwatch(subtotal, (v) => analytics.track('subtotal', v))`,
      explanation: [
        'The computed is a pure derivation: given the same items it always returns the same subtotal.',
        'It never mutates items and never performs I/O, so Vue can cache it safely.',
        'The side effect (analytics) is pushed into a watcher at the boundary.',
        'Pure computeds are why Vue can skip recomputation when dependencies are unchanged.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What makes a function pure?',
      answer: 'It returns the same output for the same inputs and has no side effects — it does not mutate external state, perform I/O, or depend on anything outside its arguments.',
      explanation: 'A strong answer names both conditions: determinism AND no side effects.',
    },
    {
      level: 'beginner',
      question: 'Give examples of side effects.',
      answer: 'Mutating a global or an argument, writing to the DOM, console.log, network/fetch, reading/writing files, using Date.now() or Math.random(), throwing based on external state.',
      explanation: 'Listing concrete effects shows you can spot impurity in real code.',
    },
    {
      level: 'intermediate',
      question: 'Why are pure functions easy to test and cache?',
      answer: 'Because they are referentially transparent: a call can be replaced by its result. Tests need no setup or mocks, and identical inputs can return a cached result (memoization) since nothing else affects the output.',
      explanation: 'Connecting purity to referential transparency and memoization is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'Is a function that calls Math.random() pure?',
      answer: 'No. Even though it does not mutate anything, it returns different outputs for the same (empty) input, breaking determinism. Time and randomness are inputs that must be passed in to keep functions pure.',
      explanation: 'Tests whether you understand that non-determinism alone breaks purity.',
    },
    {
      level: 'advanced',
      question: 'How do you structure an app that obviously needs side effects (DB, network) while keeping logic pure?',
      answer: 'Use the "functional core, imperative shell": pure functions compute decisions and new state; a thin outer layer performs the actual I/O based on those results. Reducers and command/effect patterns formalize this.',
      explanation: 'Senior architectural thinking — purity is about where effects live, not eliminating them.',
    },
    {
      level: 'senior',
      question: 'What are the limits and costs of enforcing purity in JavaScript?',
      answer: 'JS has no compiler-enforced purity, so it is by convention. Immutable updates allocate new objects (GC cost), deep copies can be expensive, and over-purifying can hurt readability. Use structural sharing, freeze in dev only, and accept localized mutation in hot loops where it stays unobservable.',
      explanation: 'Senior signal: pragmatic trade-offs, not dogma; local mutation is fine if it is not observable.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does immutability relate to purity, and what is structural sharing?',
    'Why must Redux/Vuex reducers be pure?',
    'How do you make a function that depends on the current time testable?',
    'What is referential transparency and how does it enable memoization?',
    'Can a function be pure but slow? How does that interact with caching?',
    'How do you contain side effects in async code?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mutating an object or array passed as an argument.',
      why: 'The caller still holds that reference, so you silently change their data — classic aliasing bug.',
      fix: 'Return a new value (spread, map, structuredClone) instead of mutating inputs.',
    },
    {
      mistake: 'Calling Date.now() / Math.random() inside otherwise pure logic.',
      why: 'It makes the output non-deterministic, breaking caching and making tests flaky.',
      fix: 'Inject time/randomness as parameters so the core stays pure and testable.',
    },
    {
      mistake: 'Hiding console.log / analytics / fetch deep inside business logic.',
      why: 'It couples computation to effects, so you cannot test or reuse the logic in isolation.',
      fix: 'Push effects to the boundary (shell, watchers, effect handlers); keep the core pure.',
    },
    {
      mistake: 'Believing immutability is enough for purity.',
      why: 'A function can avoid mutation yet still read globals or randomness, which is still impure.',
      fix: 'Check both rules: deterministic output AND no external reads/effects.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'computed getters must be pure derivations so Vue can cache them; mutating state inside a computed is a documented anti-pattern.' },
    { area: 'React', detail: 'Components should render purely from props/state; reducers must be pure; effects (fetch, subscriptions) live in useEffect at the boundary. Strict Mode double-invokes to surface impurity.' },
    { area: 'Node.js', detail: 'Business rules written as pure functions are unit-tested without DB/network; the service layer performs the actual I/O around them.' },
    { area: 'Backend', detail: 'Validation, pricing, and transformation logic kept pure enables deterministic tests and safe retries; effectful steps (persist, publish) are isolated and idempotent.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Pure functions are safely memoizable — repeat calls with the same input return a cached result.',
      'Determinism and no shared state make pure code safe to parallelize or run in workers.',
    ],
    bad: [
      'Immutable updates allocate new objects/arrays, increasing GC pressure versus in-place mutation.',
      'Deep-copying large structures to avoid mutation can be costly if done naively.',
    ],
    optimizations: [
      'Use structural sharing (spread only the changed branch) so most of the data is reused, not copied.',
      'Memoize expensive pure functions; cache invalidation is trivial because output depends only on input.',
      'Allow localized, unobservable mutation in hot inner loops, returning a frozen/new result at the boundary.',
      'Prefer shallow immutable updates over deep clones; reach for structuredClone only when truly needed.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['primitive-vs-reference', 'shallow-vs-deep-copy', 'higher-order-functions'],
    nextConcepts: ['memoization', 'function-composition', 'object-immutability', 'currying-partial-application'],
    dependencyNote:
      'Purity depends on understanding reference vs value (to avoid accidental mutation) and immutability. It unlocks reliable memoization, composition, and the reducer architecture used across modern state management.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the two rules: "same input → same output" and "no side effects".',
      'Draw f(x) → y with nothing leaking out the sides (pure).',
      'Draw g(x) → y with arrows leaking to "global", "DOM", "fetch", "Date.now" (impure).',
      'Sketch "functional core / imperative shell": pure box inside, effects on the rim.',
      'Say: "Purity is about determinism and isolating effects at the edges — that is what makes code testable, cacheable, and safe to reorder."',
    ],
    diagram: `   PURE              IMPURE
   x→[f]→y           x→[g]→y
       (no leaks)        │└─► global / DOM / fetch
                         └─► reads time / random
   core(pure) ─ shell(effects)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A pure function returns the same output for the same input and causes no side effects — no mutation of external/argument state, no I/O, no reading time or randomness. Purity gives referential transparency, which makes functions testable, memoizable, and safe to reorder or parallelize. Side effects are necessary but should be pushed to the edges ("functional core, imperative shell"). The practical key is immutability: return new data instead of mutating inputs, as Redux/Vue computeds require.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A pure function satisfies two conditions: it always returns the same output for the same inputs, and it has no observable side effects — it does not mutate anything outside itself, does not perform I/O, and does not depend on non-deterministic sources like the clock or random numbers. A side effect is any interaction with the outside world beyond computing a return value: mutating a global or an argument, writing to the DOM, logging, fetching, or reading Date.now. The big benefit of purity is referential transparency — a call can be replaced by its result without changing behavior — which is exactly what makes pure functions trivially testable, safely memoizable, and safe to run in any order or in parallel. In practice the key technique is immutability: instead of mutating the array or object you were given, you return a new one with a spread or map. Real systems obviously need effects, so the goal is not to eliminate them but to isolate them. The pattern is a functional core and an imperative shell: pure functions compute decisions and new state, and a thin outer layer performs the actual I/O based on those results — this is exactly the reducer pattern in Redux, Vuex, and Pinia. The trade-off is that immutable updates allocate new objects, so for hot paths I use structural sharing and allow localized, unobservable mutation.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Purity buys testability and cacheability but costs allocations from immutable updates; structural sharing mitigates this.',
      'Strict purity can hurt readability/ergonomics; pragmatic teams allow local mutation that is not observable outside the function.',
    ],
    edgeCases: [
      'A function can be non-mutating yet impure (reads Math.random or a mutable global).',
      'Returning a reference to an internal mutable object leaks the ability to mutate it later.',
      'Throwing based on external state (e.g. a global flag) is a hidden impurity.',
      'Async purity is subtle: a function returning a Promise can still be pure if it does no effects, but most async work is effectful by nature.',
    ],
    runtimeBehavior: [
      'Immutable updates create new heap objects; old ones become collectable, shifting work to the GC.',
      'Memoizing pure functions trades memory for compute; unbounded caches can leak.',
      'JS does not enforce purity, so guarantees rely on discipline and tooling (eslint, Object.freeze in dev).',
    ],
    scalability: [
      'Pure cores parallelize across web workers/threads because they share no mutable state.',
      'Caching pure results scales read-heavy workloads; invalidation is simple since output depends only on input.',
    ],
    productionConcerns: [
      'Accidental argument mutation causes hard-to-trace aliasing bugs across modules — freeze in dev to catch them.',
      'Hidden effects break retries and idempotency in distributed systems; keep effectful steps explicit and idempotent.',
      'Over-cloning large objects for purity can become a performance bottleneck; profile and use structural sharing.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pure = same input → same output AND no side effects.',
    'Side effect = anything beyond returning a value (mutation, I/O, time, random).',
    'Referential transparency = call can be replaced by its result.',
    'Pure ⇒ testable, memoizable, parallelizable, reorderable.',
    'Immutability is the practical key: return new data, do not mutate inputs.',
    'Non-mutating ≠ pure (Math.random/Date.now still impure).',
    'Reducers (Redux/Vuex/Pinia) and Vue computeds must be pure.',
    'Isolate effects: functional core, imperative shell.',
    'Inject time/randomness as params to stay deterministic.',
    'Cost: allocations; mitigate with structural sharing.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this impure function to be pure: function addItem(cart, item){ cart.items.push(item); return cart }',
      hint: 'Return a new cart object with a new items array.',
      solution: {
        lang: 'js',
        code: `function addItem(cart, item) {\n  return { ...cart, items: [...cart.items, item] }\n}`,
        explanation: ['We spread the cart and create a new items array instead of mutating.', 'The original cart is untouched, so the function is pure.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make this testable/pure: function greet(){ return Date.now() > 0 ? "morning" : "night" }. Inject the time.',
      hint: 'Pass the timestamp (or an hour) as a parameter.',
      solution: {
        lang: 'js',
        code: `function greet(hour) {\n  return hour < 12 ? 'morning' : 'night'\n}\ngreet(9)  // 'morning'\ngreet(20) // 'night'`,
        explanation: ['The clock is now an explicit input, restoring determinism.', 'Tests can pass any hour without mocking Date.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a pure reducer for a todo list supporting add and toggle actions, never mutating state.',
      hint: 'Return a new state object; map todos to a new array for toggle.',
      solution: {
        lang: 'js',
        code: `function todos(state = { items: [] }, action) {\n  switch (action.type) {\n    case 'add':\n      return { ...state, items: [...state.items, { id: action.id, text: action.text, done: false }] }\n    case 'toggle':\n      return {\n        ...state,\n        items: state.items.map((t) =>\n          t.id === action.id ? { ...t, done: !t.done } : t\n        ),\n      }\n    default:\n      return state\n  }\n}`,
        explanation: [
          'Every branch returns a new state object; nothing is mutated.',
          'toggle maps to a new array, copying the changed todo with spread.',
          'Same (state, action) always yields the same next state — fully pure.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement memoize(fn) that only works correctly for pure fn, and explain why purity is required.',
      hint: 'Cache by a key derived from arguments; if fn were impure the cache would return stale/wrong results.',
      solution: {
        lang: 'js',
        code: `function memoize(fn) {\n  const cache = new Map()\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}\n// Works because a pure fn always returns the same result for the same args,\n// so a cached value is always valid. An impure fn (reads time/globals) would\n// return a stale cached value and skip its side effects.`,
        explanation: [
          'Memoization relies on referential transparency: cached result == fresh result.',
          'If fn read Date.now or mutated state, the cache would hand back wrong values and skip the effect.',
          'This is why caching layers assume (and require) purity.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Purity is the concept that makes large codebases maintainable: it underpins testing, caching, immutable state management, and concurrency. Engineers who instinctively separate pure logic from side effects write code that is dramatically easier to debug and scale.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and examples of side effects. Product companies (Zoho, Flipkart, Razorpay) ask you to refactor impure code or write a pure reducer. FAANG-level interviews probe referential transparency, the functional-core/imperative-shell architecture, and the costs of immutability.',
    whatInterviewersExpect:
      'They expect you to state both purity rules, identify side effects in code, explain why purity enables testing and memoization, demonstrate immutable updates, and discuss how real apps isolate necessary effects at the boundaries.',
  },
}

export default pureFunctions
