import type { ConceptLesson } from '../../../types/lesson'

const strategyPattern: ConceptLesson = {
  // 1. Concept Summary
  slug: 'strategy-pattern',
  name: 'Strategy Pattern',
  category: 'design-patterns',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The Strategy Pattern lets you swap an algorithm at runtime by passing in a different interchangeable behavior — instead of a giant if/else or switch picking what to do.',
    'It is the cleanest cure for the "sprawling conditional" smell: payment methods, sorting orders, pricing rules, validation, compression — all become pluggable strategies.',
    'In JavaScript it is almost free because functions are first-class: a strategy is often just a function (or a map of functions) you pass around — no class hierarchy required.',
    'Interviewers ask it to see if you can replace branching with polymorphism/composition and keep code Open/Closed — extend behavior without editing existing code.',
    'It underpins everyday APIs you already use: Array.sort\'s comparator, passport.js auth strategies, validation rule sets, and framework plugin hooks.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Strategy is like choosing how you travel to school: walk, bike, or bus. The goal (get to school) is the same — you just pick a different way each day.',
    story: [
      'Every morning you need to get to school. That goal never changes.',
      'But HOW you get there can change: some days you walk, some days you bike, some days you take the bus.',
      'You pick the method that fits the day — raining? take the bus; sunny? ride your bike. You swap the method without changing the goal.',
      'In code, the Strategy Pattern is having several interchangeable "ways to do a job" and picking the right one at the moment you need it, instead of being stuck with one fixed way.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Imagine you have one task — like sorting a list — but several different methods to do it (by name, by date, by size).',
    'The Strategy Pattern says: keep each method separate and interchangeable, then choose which one to use when you run the program.',
    'Instead of writing a long if/else that knows every method inside one big function, you hand the function a "strategy" object or function that knows how to do that one job.',
    'This way, adding a new method is as easy as writing a new strategy and plugging it in — you do not have to rewrite the old code.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Strategy Pattern is a behavioral pattern that defines a family of interchangeable algorithms, encapsulates each one behind a common interface, and lets the client select or swap which algorithm to use at runtime.',
    how: 'You define a shared interface (e.g. an object with an execute method, or simply a function signature). Each concrete strategy implements it. A context holds a reference to the current strategy and delegates the work to it, so behavior changes by swapping the strategy rather than editing the context.',
    why: 'It removes large conditional blocks, isolates each algorithm for easy testing, and keeps code open for extension (add a new strategy) but closed for modification (no need to touch the chooser).',
    code: {
      label: 'Strategies as plain functions',
      lang: 'js',
      code: `const shipping = {\n  standard: (weight) => weight * 1.0,\n  express: (weight) => weight * 2.5 + 5,\n  free: () => 0,\n}\n\nfunction calculateShipping(method, weight) {\n  const strategy = shipping[method]\n  if (!strategy) throw new Error('Unknown method: ' + method)\n  return strategy(weight)\n}\n\ncalculateShipping('standard', 10) // 10\ncalculateShipping('express', 10)  // 30\ncalculateShipping('free', 10)     // 0`,
      explanation: [
        'Each shipping method is an interchangeable strategy — a function with the same signature.',
        'calculateShipping picks a strategy by key and delegates to it — no if/else chain of formulas.',
        'Adding "overnight" pricing means adding one entry, not editing the calculator (Open/Closed).',
        'In JS, functions are first-class, so a strategy can simply be a function.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Strategy Pattern is a behavioral design pattern that defines a family of algorithms, encapsulates each behind a common interface, and makes them interchangeable so the algorithm can vary independently of the clients that use it. A context object is configured with a concrete strategy and delegates algorithm-specific work to it, replacing conditional logic with composition and runtime polymorphism. In JavaScript, first-class functions collapse the classic class-based form: a strategy is frequently just a function, and the "family" is a lookup map of functions, while still preserving the core idea of swappable, encapsulated behavior.',

  // 7. Internal Working
  internalWorking: [
    'A common interface/contract is defined for the interchangeable behaviors (a method signature like `execute(input)` or a plain function shape).',
    'Each concrete strategy implements that contract independently, encapsulating one algorithm with no knowledge of the others.',
    'A context holds a reference to the currently selected strategy (injected via constructor, setter, or a parameter).',
    'When the client triggers the operation, the context delegates to the current strategy through the shared interface — it does not branch on type.',
    'Swapping behavior is a single assignment: point the context at a different strategy (or pass a different function), and the next call runs the new algorithm.',
    'Because the context depends only on the interface, new strategies are added without modifying the context or the existing strategies — runtime polymorphism replaces compile-time conditionals.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        ┌──────────────┐
        │   Context    │  holds a reference to ONE strategy
        │  strategy ───┼───────────────┐
        │  run(x) ─────┼──► strategy.execute(x)  (delegates)
        └──────────────┘               │
                                        │ swap at runtime
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
     ┌────────────────┐       ┌────────────────┐       ┌────────────────┐
     │ StrategyA      │       │ StrategyB      │       │ StrategyC      │
     │ execute(x){...}│       │ execute(x){...}│       │ execute(x){...}│
     └────────────────┘       └────────────────┘       └────────────────┘
            all share the SAME interface  →  interchangeable`,

  // 9. Code Examples
  examples: {
    basic: {
      label: 'Basic — pluggable sort comparator (built-in Strategy)',
      lang: 'js',
      code: `const byName = (a, b) => a.name.localeCompare(b.name)\nconst byAgeDesc = (a, b) => b.age - a.age\n\nconst people = [{ name: 'Bo', age: 30 }, { name: 'Al', age: 25 }]\n\nconsole.log([...people].sort(byName))    // sorted by name\nconsole.log([...people].sort(byAgeDesc)) // sorted by age, desc`,
      explanation: [
        'Array.prototype.sort takes a comparator — that comparator IS a strategy.',
        'byName and byAgeDesc are interchangeable algorithms with the same signature.',
        'sort delegates the "how to compare" decision to whichever strategy you pass.',
        'You change the result by swapping the strategy, not by editing sort.',
      ],
    },
    intermediate: {
      label: 'Intermediate — payment strategies via a context',
      lang: 'js',
      code: `class PaymentProcessor {\n  constructor(strategy) { this.strategy = strategy }\n  setStrategy(strategy) { this.strategy = strategy }\n  pay(amount) { return this.strategy.pay(amount) }\n}\n\nconst creditCard = { pay: (a) => 'Charged $' + a + ' to card' }\nconst paypal = { pay: (a) => 'Paid $' + a + ' via PayPal' }\nconst crypto = { pay: (a) => 'Sent $' + a + ' in crypto' }\n\nconst processor = new PaymentProcessor(creditCard)\nprocessor.pay(100)            // card\nprocessor.setStrategy(paypal)\nprocessor.pay(100)            // PayPal`,
      explanation: [
        'The context (PaymentProcessor) delegates pay() to whatever strategy it holds.',
        'Each payment method is an encapsulated strategy with a shared pay(amount) interface.',
        'Switching providers is one setStrategy call — no conditional inside pay().',
        'Adding Apple Pay means writing a new strategy object, not editing the processor.',
      ],
    },
    advanced: {
      label: 'Advanced — strategy registry with a default and Open/Closed extension',
      lang: 'js',
      code: `function createDiscountEngine() {\n  const strategies = new Map()\n  let fallback = (price) => price // no discount\n  return {\n    register(type, fn) { strategies.set(type, fn); return this },\n    setFallback(fn) { fallback = fn; return this },\n    apply(type, price, ctx) {\n      const fn = strategies.get(type) ?? fallback\n      return fn(price, ctx)\n    },\n  }\n}\n\nconst engine = createDiscountEngine()\n  .register('student', (p) => p * 0.8)\n  .register('blackFriday', (p) => p * 0.5)\n  .register('loyalty', (p, ctx) => p - ctx.points * 0.1)\n\nengine.apply('student', 100)              // 80\nengine.apply('loyalty', 100, { points: 50 }) // 95\nengine.apply('unknown', 100)              // 100 (fallback)`,
      explanation: [
        'Strategies live in a registry; new discount rules are registered without editing apply().',
        'A fallback strategy handles unknown types gracefully instead of throwing.',
        'Each strategy receives a shared (price, ctx) interface, so they stay interchangeable.',
        'This is Strategy + registry: maximally extensible (Open/Closed) and testable per rule.',
      ],
    },
    realProject: {
      label: 'Real project — form validation strategies in Vue/React',
      lang: 'js',
      code: `// validators are strategies keyed by rule name\nconst validators = {\n  required: (v) => (v?.trim() ? null : 'Required'),\n  email: (v) => (/^[^@]+@[^@]+\\.[^@]+$/.test(v) ? null : 'Invalid email'),\n  min: (len) => (v) => (v.length >= len ? null : 'Too short'),\n}\n\nfunction validateField(value, rules) {\n  for (const rule of rules) {\n    const fn = typeof rule === 'function' ? rule : validators[rule]\n    const error = fn(value)\n    if (error) return error // first failing strategy wins\n  }\n  return null\n}\n\n// in a Vue/React form\nvalidateField('', ['required'])                 // 'Required'\nvalidateField('ab', [validators.min(5)])         // 'Too short'\nvalidateField('a@b.com', ['required', 'email'])  // null (valid)`,
      explanation: [
        'Each validation rule is an interchangeable strategy returning an error or null.',
        'validateField composes a list of strategies and applies them in order — no nested if/else.',
        'Parameterized strategies (min(5)) are factory-produced strategies, still sharing the interface.',
        'This is exactly how validation libraries (and form composables) let you plug rules per field.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Strategy Pattern?',
      answer: 'A behavioral pattern that defines a family of interchangeable algorithms behind a common interface and lets you select or swap which one runs at runtime, so the algorithm varies independently of the code that uses it.',
      explanation: 'A strong answer mentions "interchangeable algorithms", "common interface", and "chosen at runtime", with an example like sort comparators or payment methods.',
    },
    {
      level: 'beginner',
      question: 'How is the Strategy Pattern usually expressed in JavaScript?',
      answer: 'Because functions are first-class, a strategy is often just a function, and the family is a lookup map of functions (or an object of methods). You can pass the function directly or select it by key — no class hierarchy needed, though a context object/class also works.',
      explanation: 'Interviewers want recognition that JS collapses the class-heavy GoF form into simple functions/maps.',
    },
    {
      level: 'intermediate',
      question: 'How does the Strategy Pattern relate to replacing conditionals and the Open/Closed Principle?',
      answer: 'It replaces a growing if/else or switch (which you must edit for every new case) with a set of encapsulated strategies selected via a map. Adding a behavior means registering a new strategy, not modifying existing code — open for extension, closed for modification.',
      explanation: 'Connecting Strategy to the "replace conditional with polymorphism" refactor and Open/Closed is the key intermediate signal.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between Strategy and the State pattern?',
      answer: 'They share structure (a context delegating to a pluggable object) but differ in intent. Strategy swaps interchangeable algorithms chosen by the client for the same task; State changes behavior based on the object\'s internal state, and states often trigger transitions to other states themselves.',
      explanation: 'Distinguishing intent (client-chosen algorithm vs self-driven state transitions) despite similar shape shows real pattern understanding.',
    },
    {
      level: 'advanced',
      question: 'When would you prefer Strategy over a Factory, and can they combine?',
      answer: 'Factory is about choosing which object to CREATE; Strategy is about choosing which behavior to RUN. They combine well: a factory or registry can select and instantiate the right strategy, then a context delegates to it. You prefer Strategy when the variation is in an algorithm/behavior used over time, not just construction.',
      explanation: 'Senior signal: cleanly separating creation (Factory) from behavior selection (Strategy) and knowing they compose.',
    },
    {
      level: 'senior',
      question: 'What are the tradeoffs and pitfalls of overusing Strategy?',
      answer: 'It adds indirection and more moving parts; for two stable branches it can be over-engineering versus a simple conditional. Strategies must agree on a stable interface, and shared context/state passing can get awkward. The win is when variations are many, change often, or need independent testing/extension.',
      explanation: 'Top-tier: weighing decoupling/extensibility against indirection, and articulating when a plain if is the better choice.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you combine Strategy with a Factory to pick and build the strategy?',
    'How do you pass shared context/state to a strategy without coupling them?',
    'When is a plain conditional better than Strategy?',
    'How would you provide a default/fallback strategy?',
    'How is Strategy different from the State and Template Method patterns?',
    'How would you type interchangeable strategies in TypeScript so they stay swappable?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Applying Strategy to only two stable cases.',
      why: 'It adds classes/maps and indirection where a simple if/else would be clearer and shorter.',
      fix: 'Reserve Strategy for many variants, frequently changing behavior, or when you need independent testing/extension.',
    },
    {
      mistake: 'Letting strategies have inconsistent interfaces.',
      why: 'If strategies take different arguments or return different shapes, they are no longer interchangeable and the context must branch again.',
      fix: 'Pin a single signature/contract (and in TS, a shared type) that every strategy honors.',
    },
    {
      mistake: 'Leaking context details into every strategy.',
      why: 'Passing the whole context object couples strategies to internals and makes them hard to test in isolation.',
      fix: 'Pass only the minimal data each strategy needs through the agreed interface.',
    },
    {
      mistake: 'Hardcoding strategy selection with a switch inside the context.',
      why: 'That reintroduces the conditional you were trying to eliminate and breaks Open/Closed.',
      fix: 'Inject the strategy or select it from a registry/map so the context never branches on type.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Form validation composables select per-field validator strategies; transition/animation behaviors and sort/filter functions in tables are passed as interchangeable strategy functions.' },
    { area: 'React', detail: 'Sort/filter comparators, render strategies passed as props or render-props, and pluggable formatters are strategies; libraries accept a strategy function (e.g. a key resolver or serializer) to vary behavior.' },
    { area: 'Node.js', detail: 'passport.js authentication strategies (local, JWT, OAuth) are the textbook example; logging transports, compression algorithms, and serialization formats are selected as strategies via config.' },
    { area: 'Backend', detail: 'Pricing/discount engines, retry/backoff policies, rate-limiting algorithms, and storage adapters are implemented as interchangeable strategies chosen by configuration or request context.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Map/object lookup of a strategy is O(1), faster and flatter than a long if/else chain on a hot path.',
      'Each strategy is small and isolated, so the JIT can optimize the focused function well.',
    ],
    bad: [
      'An extra indirection (context -> strategy call) adds a function call versus inlined logic — usually negligible.',
      'Creating fresh parameterized strategy closures repeatedly (e.g. min(5) in a render loop) adds allocation/GC pressure.',
    ],
    optimizations: [
      'Precompute/memoize parameterized strategies instead of recreating them per call or per render.',
      'Use a Map/object lookup rather than a switch so dispatch is O(1) and monomorphic.',
      'Keep strategy interfaces monomorphic (same shapes) so the engine can optimize the delegated call.',
      'Reuse stable strategy references (define once at module scope) rather than inline literals in hot paths.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['higher-order-functions', 'function-composition', 'closure', 'pure-functions'],
    nextConcepts: ['factory-pattern', 'observer-pattern', 'module-pattern', 'currying-partial-application'],
    dependencyNote:
      'Strategy leans on first-class/higher-order functions and composition; parameterized strategies use closures/currying. It pairs with the Factory pattern (factory selects and builds the strategy) and complements other behavioral patterns for building flexible, extensible behavior.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a Context box that holds a "strategy" reference and a run() method.',
      'Draw three strategy boxes below, all sharing the same interface (execute / same signature).',
      'Draw an arrow from run() to "strategy.execute(x)" showing delegation, not branching.',
      'Show swapping: an arrow re-pointing the context\'s strategy reference to a different box.',
      'Say: "The context delegates to an interchangeable strategy chosen at runtime. Adding a behavior is a new strategy, not an edit to the context — that is Open/Closed. In JS a strategy is often just a function in a map."',
    ],
    diagram: `  ┌──────────┐ strategy ─► [ A.execute | B.execute | C.execute ]
  │ Context  │ run(x) ──► strategy(x)   (delegate, no if/else)
  └──────────┘
  swap: context.strategy = B   → next run uses B
  JS form: const map = { a: fn, b: fn }; map[key](x)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Strategy Pattern defines a family of interchangeable algorithms behind a common interface and lets you pick or swap one at runtime, replacing big if/else chains with composition. A context holds the current strategy and delegates to it, so adding a behavior is a new strategy rather than an edit — Open/Closed. In JavaScript a strategy is usually just a function, and the family is a lookup map of functions: think Array.sort comparators, passport.js auth strategies, validation rules, and pricing engines. Use it when variations are many or change often; skip it for two stable branches.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Strategy Pattern is a behavioral pattern that defines a family of interchangeable algorithms, encapsulates each one behind a common interface, and lets the client choose or swap which algorithm runs at runtime. The structure is a context that holds a reference to the current strategy and delegates the work to it, rather than branching on a type with a big if/else or switch. The payoff is that adding a new behavior means writing a new strategy and registering it, without modifying the context or the existing strategies — that is the Open/Closed Principle, and it also makes each algorithm independently testable. In JavaScript the pattern is almost free because functions are first-class: a strategy is frequently just a function, and the family is a lookup map of functions you select by key, so you often do not need any class hierarchy at all. You already use it constantly — the comparator you pass to Array.sort is a strategy, passport.js auth strategies, validation rule sets, pricing and discount engines, retry policies, and compression or serialization formats chosen by config. People confuse it with the State pattern because the shape is similar, but the intent differs: Strategy swaps client-chosen algorithms for one task, while State changes behavior based on internal state and often drives its own transitions. It also pairs naturally with a Factory, which selects and builds the right strategy. The caution is not to over-apply it — for two stable branches a plain conditional is clearer; Strategy earns its indirection when variations are many or change often.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Extensibility vs indirection: Strategy removes conditionals and enables Open/Closed extension but adds objects/functions and an extra hop — over-engineering for few stable cases.',
      'Function strategies (lightweight, idiomatic JS) vs class/object strategies (richer, can hold state and multiple methods).',
      'Centralized selection (registry/factory) vs caller-passed strategy: the former hides the menu, the latter is explicit and flexible.',
    ],
    edgeCases: [
      'Strategies needing shared state must receive it through the interface; smuggling the whole context couples them.',
      'Parameterized strategies (factories returning strategies) must be created/memoized carefully to avoid per-call allocation.',
      'Unknown/missing strategy keys need a fallback or fail-fast policy.',
      'Async strategies change the interface to return Promises — all strategies must agree on sync vs async.',
    ],
    runtimeBehavior: [
      'Delegation is one extra function call; with monomorphic strategy shapes the JIT optimizes it well.',
      'Map lookup is O(1) and avoids long branch prediction misses of big switch statements.',
      'Closures used for parameterized strategies capture their config and live as long as the strategy is referenced.',
    ],
    scalability: [
      'A registry-based Strategy scales to plugin ecosystems: strategies register themselves, enabling lazy/code-split loading by name.',
      'Config-driven strategy selection lets you change behavior per environment/tenant without redeploying logic.',
    ],
    productionConcerns: [
      'Define and version the strategy interface clearly; all strategies depend on its stability.',
      'Provide a safe default/fallback strategy and validate selection keys at the boundary.',
      'Cover each strategy with isolated unit tests and the selection logic separately — the decoupling makes this easy.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Strategy = interchangeable algorithms behind a common interface, chosen at runtime.',
    'Replaces big if/else / switch with composition + delegation.',
    'Context holds the current strategy and delegates; it never branches on type.',
    'JS idiom: a strategy is a function; the family is a lookup map of functions.',
    'Open/Closed: add a strategy without editing the context.',
    'Built-in example: Array.sort comparator IS a strategy.',
    'Real-world: passport.js auth, validation rules, pricing/discount, retry policies.',
    'Strategy = client-chosen algorithm; State = self-driven behavior by internal state.',
    'Combine with Factory: factory selects/builds the strategy, context runs it.',
    'Provide a fallback/default; validate unknown keys.',
    'Keep all strategies on ONE signature/contract.',
    'Avoid for two stable branches — needless indirection.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Implement a tax calculator that picks a strategy by country code ("US" 0.07, "DE" 0.19) and applies it to a price.',
      hint: 'Use an object of country -> rate functions.',
      solution: {
        lang: 'js',
        code: `const taxStrategies = {\n  US: (p) => p * 0.07,\n  DE: (p) => p * 0.19,\n}\nfunction calcTax(country, price) {\n  const fn = taxStrategies[country]\n  if (!fn) throw new Error('No tax strategy for ' + country)\n  return fn(price)\n}\ncalcTax('US', 100) // 7\ncalcTax('DE', 100) // 19`,
        explanation: [
          'Each country rate is an interchangeable strategy function.',
          'calcTax delegates by key — no if/else chain of rates.',
          'Adding a country is one new entry (Open/Closed).',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a Sorter context with setStrategy(fn) and sort(arr) that delegates to the current comparator strategy.',
      hint: 'Store the comparator; sort delegates to it.',
      solution: {
        lang: 'js',
        code: `class Sorter {\n  constructor(cmp = (a, b) => a - b) { this.cmp = cmp }\n  setStrategy(cmp) { this.cmp = cmp; return this }\n  sort(arr) { return [...arr].sort(this.cmp) }\n}\nconst s = new Sorter()\ns.sort([3, 1, 2])               // [1,2,3]\ns.setStrategy((a, b) => b - a)\ns.sort([3, 1, 2])               // [3,2,1]`,
        explanation: [
          'The context holds a comparator strategy and delegates sorting to it.',
          'Swapping order is one setStrategy call, no change to sort().',
          'The comparator is the strategy — the same idea Array.sort uses.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a discount engine with register(type, fn) and apply(type, price, ctx), a fallback for unknown types, and a context-aware loyalty strategy.',
      hint: 'Use a Map registry plus a default fallback strategy.',
      solution: {
        lang: 'js',
        code: `function createDiscountEngine() {\n  const map = new Map()\n  let fallback = (p) => p\n  return {\n    register(type, fn) { map.set(type, fn); return this },\n    setFallback(fn) { fallback = fn; return this },\n    apply(type, price, ctx = {}) { return (map.get(type) ?? fallback)(price, ctx) },\n  }\n}\nconst e = createDiscountEngine()\n  .register('vip', (p) => p * 0.7)\n  .register('loyalty', (p, ctx) => p - (ctx.points ?? 0))\ne.apply('vip', 200)                  // 140\ne.apply('loyalty', 200, { points: 30 }) // 170\ne.apply('none', 200)                 // 200 (fallback)`,
        explanation: [
          'Strategies live in a registry; new rules register without editing apply().',
          'A fallback handles unknown types gracefully.',
          'The loyalty strategy reads ctx through the shared (price, ctx) interface.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a PaymentProcessor that uses interchangeable async payment strategies (card, wallet), selected via a factory, all sharing an async pay(amount) interface. Show swapping and a mock for tests.',
      hint: 'Strategies return Promises; a factory picks the strategy; the context awaits it.',
      solution: {
        lang: 'js',
        code: `const strategies = {\n  card: { pay: async (amt) => ({ method: 'card', amt, status: 'ok' }) },\n  wallet: { pay: async (amt) => ({ method: 'wallet', amt, status: 'ok' }) },\n}\n\nfunction makeProcessor(type, registry = strategies) {\n  const strategy = registry[type]\n  if (!strategy) throw new Error('Unknown payment: ' + type)\n  return {\n    strategy,\n    setStrategy(t) { this.strategy = registry[t]; return this },\n    async pay(amt) { return this.strategy.pay(amt) }, // delegate, await\n  }\n}\n\n// production\nconst p = makeProcessor('card')\nawait p.pay(100)            // { method:'card', ... }\np.setStrategy('wallet')\nawait p.pay(100)            // { method:'wallet', ... }\n\n// tests: inject a fake registry\nconst calls = []\nconst fake = { card: { pay: async (a) => { calls.push(a); return { mock: true } } } }\nawait makeProcessor('card', fake).pay(50) // calls == [50]`,
        explanation: [
          'Every strategy implements the same async pay(amount) contract, so they stay interchangeable.',
          'The factory selects/builds the strategy; the context just delegates and awaits it.',
          'Injecting a fake registry swaps in mocks for tests with no real payment calls — Strategy + Factory + DI together.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The Strategy Pattern is the canonical "replace conditionals with composition" tool, and it shows you understand Open/Closed and runtime polymorphism — exactly the design maturity interviewers look for. Because JS makes it almost free with first-class functions, demonstrating it cleanly signals idiomatic, extensible coding.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and a simple swap example. Product companies (Zoho, Flipkart, Razorpay) ask you to refactor a sprawling switch into strategies or build a pricing/validation engine. FAANG-level interviews probe Strategy-vs-State/Factory distinctions, registry-based extensibility, and tradeoffs versus a plain conditional.',
    whatInterviewersExpect:
      'Define interchangeable algorithms behind a common interface chosen at runtime, show the JS function/map idiom, connect it to Open/Closed and "replace conditional with polymorphism", distinguish it from State and Factory, and judge when NOT to use it.',
  },
}

export default strategyPattern
