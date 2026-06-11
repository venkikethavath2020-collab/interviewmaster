import type { ConceptLesson } from '../../../types/lesson'

const factoryPattern: ConceptLesson = {
  // 1. Concept Summary
  slug: 'factory-pattern',
  name: 'Factory Pattern',
  category: 'design-patterns',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'A factory centralizes object creation so the rest of your code never says `new SomeClass()` directly — it just asks the factory for "a thing", and the factory decides which concrete thing to build.',
    'It lets you swap implementations (a real API client vs a mock, a JSON parser vs an XML parser) without touching every call site — the #1 way to keep creation logic from leaking everywhere.',
    'Without a factory, construction details (which subclass, what defaults, validation) get duplicated and scattered, so a small change to how objects are built turns into a hunt across the codebase.',
    'Interviewers ask it to see whether you can separate "what to build" from "how to use it" — a core decoupling skill that shows up in dependency injection, plugins, and testing.',
    'In JavaScript a factory is often just a function that returns an object — so it doubles as a closure-based alternative to classes, giving private state without `this` headaches.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A factory is like a pizza counter: you say what you want, and a worker behind the counter makes the right pizza and hands it to you — you never go into the kitchen yourself.',
    story: [
      'Imagine you walk up to a pizza counter and say "I want a cheese pizza" or "I want a veggie pizza".',
      'You do not go into the kitchen, grab dough, turn on the oven, or know any of the recipes. You just ask, and the worker behind the counter makes exactly the right one.',
      'If the shop changes its recipe, or buys a new oven, you do not have to learn anything new — you still just ask for "a cheese pizza" the same way.',
      'A factory in code is that counter worker: you ask it for the kind of object you want, and it knows all the messy steps to build it and hands you back the finished thing.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally to make an object you write `new Car()` yourself, which means you must know the exact recipe everywhere you build one.',
    'A factory is a helper function (or method) whose only job is to create and return objects for you, so you just call `createCar()` instead.',
    'The clever bit: the factory can look at what you asked for and decide which kind of object to build — a sports car or a truck — and you do not have to care which.',
    'This keeps all the "how to build it" knowledge in one place, like one recipe book, instead of copying the recipe into every part of the program.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Factory Pattern is a creational pattern where a dedicated function or method is responsible for creating objects, hiding the concrete construction logic from the code that uses those objects.',
    how: 'Instead of calling a constructor directly, callers call the factory and pass a few inputs; the factory chooses the concrete type, applies defaults/validation, and returns a ready-to-use object that conforms to a known shape or interface.',
    why: 'It decouples object creation from object usage, so you can add or swap implementations in one place, simplify call sites, and make code far easier to test by substituting fakes.',
    code: {
      label: 'A simple factory function',
      lang: 'js',
      code: `function createUser(role) {\n  const base = { name: '', loggedIn: false }\n  if (role === 'admin') {\n    return { ...base, role, canDelete: true }\n  }\n  if (role === 'guest') {\n    return { ...base, role, canDelete: false, readOnly: true }\n  }\n  return { ...base, role: 'member', canDelete: false }\n}\n\nconst a = createUser('admin')   // { ..., canDelete: true }\nconst g = createUser('guest')   // { ..., readOnly: true }`,
      explanation: [
        '`createUser` is the factory — the single place that knows how each kind of user is built.',
        'Callers never write `new` or repeat the default fields; they just say what role they want.',
        'Adding a new role (e.g. "moderator") means editing ONE function, not every call site.',
        'Every returned object shares the same base shape, so the rest of the code can treat them uniformly.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Factory Pattern is a creational design pattern that encapsulates object instantiation behind a function or method, decoupling client code from concrete constructors. Instead of binding callers to specific classes via `new`, the factory selects and returns an appropriate concrete implementation that satisfies a shared interface or shape. In JavaScript this manifests as a factory function returning an object literal (often closing over private state) or as a static method that dispatches on input to instantiate one of several classes, centralizing construction, defaults, validation, and dependency wiring.',

  // 7. Internal Working
  internalWorking: [
    'A caller invokes the factory with descriptive inputs (a type discriminator, config, dependencies) instead of choosing a constructor itself.',
    'The factory branches on those inputs (switch/if, a lookup map, or registry) to decide which concrete type or object shape to produce.',
    'It applies shared construction concerns once: default values, input validation, normalization, and injection of collaborators.',
    'For the closure-based form, the factory creates local variables and returns an object whose methods close over them — those variables live on the heap as private state for the lifetime of the returned object.',
    'For the class-based form, the factory calls `new ConcreteClass(...)`, so a prototype-linked instance is allocated and its constructor runs, but the caller only sees the abstract return type.',
    'The factory returns the finished object; the caller programs against the common interface and remains unaware of which concrete implementation it received.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        caller code
            │  "give me a NOTIFIER for 'sms'"
            ▼
   ┌──────────────────────┐
   │   createNotifier()   │  ◄── the FACTORY (one place)
   │  ┌────────────────┐  │
   │  │ switch(type) { │  │
   │  │  'sms'  -> ... │  │
   │  │  'email'-> ... │  │
   │  │  'push' -> ... │  │
   │  │ }              │  │
   │  └────────────────┘  │
   └──────────┬───────────┘
              │ returns object with common shape { send() }
              ▼
   ┌───────────┐ ┌───────────┐ ┌───────────┐
   │ SmsNotifier│ │EmailNotif.│ │PushNotif. │  ← caller doesn't know which
   └───────────┘ └───────────┘ └───────────┘`,

  // 9. Code Examples
  examples: {
    basic: {
      label: 'Basic — factory function returning an object',
      lang: 'js',
      code: `function createCircle(radius) {\n  return {\n    radius,\n    area() {\n      return Math.PI * this.radius ** 2\n    },\n  }\n}\n\nconst c = createCircle(5)\nc.area() // ~78.54`,
      explanation: [
        'The factory builds and returns a plain object — no `new`, no class needed.',
        'Callers get a ready-to-use object and never touch construction details.',
        'Swapping how circles are built (caching, validation) changes only this function.',
      ],
    },
    intermediate: {
      label: 'Intermediate — dispatching to different implementations',
      lang: 'js',
      code: `function createShape(type, size) {\n  switch (type) {\n    case 'circle':\n      return { type, area: () => Math.PI * size ** 2 }\n    case 'square':\n      return { type, area: () => size * size }\n    case 'triangle':\n      return { type, area: () => (Math.sqrt(3) / 4) * size ** 2 }\n    default:\n      throw new Error('Unknown shape: ' + type)\n  }\n}\n\nconst shapes = ['circle', 'square'].map((t) => createShape(t, 4))\nshapes.forEach((s) => console.log(s.type, s.area()))`,
      explanation: [
        'The factory hides which concrete shape is created behind a single entry point.',
        'Every returned object exposes the same `area()` interface, so callers treat them uniformly.',
        'A bad type fails fast in one place instead of producing a broken object downstream.',
        'Adding a new shape is a one-case change — the canonical benefit of a factory.',
      ],
    },
    advanced: {
      label: 'Advanced — registry-based factory (open for extension)',
      lang: 'js',
      code: `function createRegistryFactory() {\n  const registry = new Map()\n  return {\n    register(type, builder) {\n      registry.set(type, builder)\n    },\n    create(type, ...args) {\n      const builder = registry.get(type)\n      if (!builder) throw new Error('Unregistered type: ' + type)\n      return builder(...args)\n    },\n  }\n}\n\nconst factory = createRegistryFactory()\nfactory.register('button', (label) => ({ tag: 'button', label }))\nfactory.register('link', (href) => ({ tag: 'a', href }))\n\nfactory.create('button', 'Save')  // { tag: 'button', label: 'Save' }`,
      explanation: [
        '`registry` is private closure state holding type -> builder mappings.',
        'New types are added at runtime via `register` without modifying the factory itself (Open/Closed Principle).',
        'This is how plugin systems and component libraries register and instantiate variants by name.',
        'The factory stays a thin dispatcher; each builder owns its own construction details.',
      ],
    },
    realProject: {
      label: 'Real project — HTTP client factory in a Vue/Node app',
      lang: 'js',
      code: `// services/apiFactory.js\nimport axios from 'axios'\n\nexport function createApiClient({ baseURL, token, mock = false } = {}) {\n  if (mock) {\n    return {\n      get: async (url) => ({ data: fakeData[url] }),\n      post: async () => ({ data: { ok: true } }),\n    }\n  }\n  const instance = axios.create({ baseURL })\n  instance.interceptors.request.use((cfg) => {\n    if (token) cfg.headers.Authorization = 'Bearer ' + token\n    return cfg\n  })\n  return instance\n}\n\n// in a Vue composable / Pinia store\nconst api = createApiClient({ baseURL: '/api', token: authToken })\n// in tests\nconst api = createApiClient({ mock: true })`,
      explanation: [
        'The factory centralizes base URL, auth headers, and interceptor wiring so every consumer gets a consistent client.',
        'Passing `mock: true` returns a fake client with the same shape — tests run with zero network calls.',
        'Call sites just receive "an api with get/post"; they never know whether it is axios or a stub.',
        'Switching transports (axios -> fetch) is a single-file change because creation is encapsulated.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Factory Pattern and why use it?',
      answer: 'It is a creational pattern where a function or method creates objects for you instead of calling a constructor directly. You use it to centralize construction logic, decouple callers from concrete types, and make swapping or extending implementations easy.',
      explanation: 'A strong answer names the decoupling benefit (callers depend on an interface, not a concrete class) and gives a one-line example like a factory function returning an object.',
    },
    {
      level: 'beginner',
      question: 'In JavaScript, how is a factory function different from a constructor function?',
      answer: 'A factory function is a normal function that explicitly returns an object; you call it without `new`. A constructor function relies on `new`, uses `this`, and links the result to a prototype. Factories avoid `this`/`new` pitfalls and can return private-state objects via closures.',
      explanation: 'Interviewers want you to mention that factories sidestep forgotten-`new` bugs and give true privacy through closures rather than prototype-shared methods.',
    },
    {
      level: 'intermediate',
      question: 'When would you choose a factory over directly using `new ClassName()`?',
      answer: 'When the concrete type depends on runtime input, when construction needs shared defaults/validation/dependency wiring, when you want to swap implementations (real vs mock) easily, or when you want to hide the concrete class from callers.',
      explanation: 'The key signal is "creation logic that would otherwise be duplicated or that varies" — that is exactly what a factory consolidates.',
    },
    {
      level: 'intermediate',
      question: 'How does the Factory Pattern relate to the Open/Closed Principle?',
      answer: 'A registry-based factory lets you add new types by registering new builders without modifying existing factory code, so the system is open for extension but closed for modification.',
      explanation: 'Mentioning the registry/lookup-map variant (vs a growing switch statement) shows you understand how to keep the factory itself stable as types grow.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between a simple factory, the Factory Method pattern, and Abstract Factory?',
      answer: 'A simple factory is one function/method that dispatches on input. Factory Method defines a creation method that subclasses override to decide the concrete product. Abstract Factory provides an interface for creating families of related objects without specifying concrete classes.',
      explanation: 'Senior signal: distinguishing the GoF formal patterns from the everyday "factory function" idiom, and noting JavaScript usually needs only the simple form.',
    },
    {
      level: 'senior',
      question: 'How do factories enable dependency injection and testability in a large codebase?',
      answer: 'A factory is a seam: it decides which concrete collaborators to inject and return. By passing dependencies (or a config flag) into the factory, you can return production objects in prod and lightweight fakes/mocks in tests, all sharing one interface, without changing any consumer.',
      explanation: 'This connects the pattern to DI containers, hexagonal architecture, and test doubles — showing you see factories as an architectural decoupling tool, not just a helper.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you refactor a growing `switch` in a factory into a registry/lookup map?',
    'Can a factory return a cached/shared instance? (yes — that is how it overlaps with Singleton)',
    'How do factories help unit testing and mocking?',
    'What are the downsides of overusing factories? (indirection, harder to trace)',
    'How is a factory function different from a class with a static `create()` method?',
    'How would you type a factory function in TypeScript so callers get the right return type per input?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Creating a factory for objects that never vary and are only built in one place.',
      why: 'It adds indirection and ceremony with no decoupling benefit, making the code harder to follow.',
      fix: 'Use a factory only when the concrete type varies, construction is non-trivial, or you need to swap implementations.',
    },
    {
      mistake: 'Letting the factory grow an ever-expanding switch statement.',
      why: 'Every new type forces editing the factory, violating Open/Closed and creating merge conflicts.',
      fix: 'Switch to a registry/lookup map where types register their own builders.',
    },
    {
      mistake: 'Returning objects with inconsistent shapes from different branches.',
      why: 'Callers can no longer treat results uniformly, defeating the purpose of the factory.',
      fix: 'Ensure every branch returns the same interface/shape (in TS, a shared type); validate at the boundary.',
    },
    {
      mistake: 'Putting unrelated business logic inside the factory.',
      why: 'A factory should build objects, not orchestrate workflows; mixing concerns makes it a god-function.',
      fix: 'Keep the factory focused on construction/dispatch; move behavior into the returned objects.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables act as factories: `useApi()` / `useFeatureFlags()` build and return objects of refs and methods, wiring dependencies and defaults once; component-library factories create UI elements by variant name.' },
    { area: 'React', detail: 'Factory functions create configured hooks/clients (e.g. `createStore`, `createQueryClient`), and createContext + provider patterns hand consumers a pre-wired object without exposing construction.' },
    { area: 'Node.js', detail: 'App and server factories (`createApp()`, `createServer()`), logger/transport factories, and database client factories centralize config, middleware, and connection wiring so the rest of the app stays decoupled.' },
    { area: 'Backend', detail: 'Factories pick concrete adapters at runtime — a Postgres vs in-memory repository, an S3 vs local file storage — driven by environment config, the backbone of dependency injection and the ports/adapters architecture.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Factories can return cached or pooled instances, avoiding repeated expensive construction (connection pools, parsers).',
      'Centralized creation makes it easy to add lazy initialization so heavy objects are only built when first requested.',
    ],
    bad: [
      'A factory invoked in a hot loop that allocates a fresh object each call adds GC pressure just like any allocation.',
      'Deeply layered factories-of-factories add indirection and a few extra function calls, usually negligible but harder to inline.',
    ],
    optimizations: [
      'Memoize/cache results inside the factory when the same inputs should yield the same instance.',
      'Use a lookup map instead of a long switch so dispatch is O(1) and JIT-friendly.',
      'Hoist factory calls out of render/hot paths; build once and reuse the returned object.',
      'For object pools, have the factory reuse and reset instances instead of allocating new ones.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'closure', 'constructor-functions-new', 'es6-classes'],
    nextConcepts: ['singleton-pattern', 'strategy-pattern', 'module-pattern', 'observer-pattern'],
    dependencyNote:
      'A factory is built from object-creation fundamentals and closures (for private state) or classes/`new` (for the class-based form). It pairs naturally with Singleton (a factory returning a shared instance), Strategy (a factory choosing an algorithm object), and the Module pattern.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw caller code on the left with an arrow saying "give me a logger".',
      'Draw one box in the middle labeled createLogger() — the factory.',
      'Inside it draw a branch (switch) pointing to three concrete boxes: Console, File, Remote.',
      'Draw an arrow back from the factory to the caller labeled "returns { log() }".',
      'Say: "The caller depends only on the { log() } interface; the factory owns which concrete logger to build, so I can add or swap loggers in one place."',
    ],
    diagram: `  caller ──"need a logger"──► createLogger(type)
                                  │ switch(type)
                ┌─────────────────┼─────────────────┐
                ▼                 ▼                 ▼
          ConsoleLogger      FileLogger       RemoteLogger
                └─────────────────┴─────────────────┘
                        all expose { log() }
                                  │
              caller ◄── returns object with { log() }`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Factory Pattern puts object creation behind a single function or method, so callers ask for "a thing" instead of choosing a constructor. The factory branches on input (switch or registry) to pick the concrete type, applies defaults and validation, and returns an object with a shared interface. In JavaScript it is often just a function returning an object literal — giving private state via closures and avoiding `new`/`this` traps. Use it when the concrete type varies or when you want to swap real vs mock implementations in one place.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Factory Pattern is a creational pattern that encapsulates object construction behind a function or method, so the code using an object is decoupled from how that object is built. Instead of every call site doing `new ConcreteClass()`, they call a factory and pass a few inputs; the factory decides which concrete type to create, applies shared defaults and validation, wires in dependencies, and returns an object that conforms to a known interface. In JavaScript the most common form is simply a factory function that returns an object literal — its methods can close over private variables, giving real encapsulation without classes and avoiding the forgotten-`new` and `this`-binding pitfalls of constructor functions. The big win is that creation logic lives in one place: when you need to add a new type, change defaults, or substitute a mock in tests, you edit the factory, not the dozens of call sites. A naive factory uses a switch, but as types grow you move to a registry — a map of type to builder — so it stays open for extension and closed for modification. The formal GoF variants are Factory Method, where subclasses decide the product, and Abstract Factory, for creating families of related objects; in JS the simple factory usually suffices. I reach for it whenever the concrete type depends on runtime config or I want a clean seam for dependency injection and testing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Decoupling vs indirection: factories hide concrete types, which aids flexibility but makes "go to definition" and tracing harder; overuse turns simple code into a maze.',
      'Closure-based factories give true privacy but allocate a fresh copy of each method per instance; class-based construction shares methods on the prototype, cheaper at scale.',
      'A registry is more extensible than a switch but adds runtime wiring and loses some static type guarantees unless carefully typed.',
    ],
    edgeCases: [
      'Factories that return cached instances blur into Singletons — be explicit about lifecycle (new vs shared) to avoid surprising shared mutable state.',
      'Factory functions returning object literals do not work with `instanceof`; if callers rely on type checks, you need a class-based factory or a tag field.',
      'Asynchronous construction (e.g. opening a DB connection) means the factory must return a Promise — callers must await, which changes the API.',
    ],
    runtimeBehavior: [
      'Each closure-based factory call allocates new method functions unless you hoist shared logic outside the closure.',
      'Switch-based dispatch is fine but a Map lookup is O(1) and avoids long branch chains in very hot paths.',
      'Returned objects keep their captured environment alive, so capturing large config in a factory pins it in memory for the object lifetime.',
    ],
    scalability: [
      'Registry factories scale to plugin architectures: modules self-register builders at load time, enabling lazy, code-split type loading.',
      'For high-throughput object creation, combine the factory with object pooling to cap allocations and GC churn.',
    ],
    productionConcerns: [
      'Centralizing creation means a bug in the factory affects every consumer — cover it well with tests since it is a shared seam.',
      'Use the factory as the single place to inject environment-specific implementations (prod vs staging vs mock), driven by config, to keep environments swappable.',
      'Document the contract/interface the factory guarantees; consumers depend on shape stability more than on the concrete class.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Factory = a function/method that creates and returns objects so callers avoid `new`.',
    'Creational pattern: separates "what to build" from "how to use it".',
    'JS idiom: factory function returning an object literal (private state via closure).',
    'Dispatches on input: switch for few types, registry/Map for many/extensible.',
    'Registry form = Open/Closed: add types without editing the factory.',
    'Enables dependency injection and easy mocking (return fakes in tests).',
    'GoF variants: simple factory, Factory Method (subclass decides), Abstract Factory (families).',
    'Returned objects should share ONE interface/shape.',
    'Can return cached instances → overlaps with Singleton.',
    'Avoid for trivial, single-use objects — needless indirection.',
    'Closure factory: per-instance methods; class factory: prototype-shared methods.',
    'No `instanceof` on literal-returning factories — use a tag or class.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write `createPoint(x, y)` factory that returns an object with x, y and a `distanceTo(other)` method.',
      hint: 'Return an object literal; use Math.hypot.',
      solution: {
        lang: 'js',
        code: `function createPoint(x, y) {\n  return {\n    x,\n    y,\n    distanceTo(other) {\n      return Math.hypot(other.x - this.x, other.y - this.y)\n    },\n  }\n}\ncreatePoint(0, 0).distanceTo(createPoint(3, 4)) // 5`,
        explanation: [
          'The factory returns a ready-to-use object — no class or `new`.',
          'Callers get a consistent { x, y, distanceTo } shape every time.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write `createLogger(type)` that returns a logger with a `log(msg)` method for type "console" or "silent". Throw on unknown types.',
      hint: 'Dispatch on type and return objects sharing the same { log } interface.',
      solution: {
        lang: 'js',
        code: `function createLogger(type) {\n  switch (type) {\n    case 'console':\n      return { log: (msg) => console.log('[LOG]', msg) }\n    case 'silent':\n      return { log: () => {} }\n    default:\n      throw new Error('Unknown logger type: ' + type)\n  }\n}\n\nconst log = createLogger('console')\nlog.log('hello') // [LOG] hello`,
        explanation: [
          'Both branches return the same { log } interface so callers are uniform.',
          'Unknown types fail fast in one place rather than producing a broken logger.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a registry-based shape factory: `register(type, builder)` and `create(type, ...args)`. Adding a shape must not modify create().',
      hint: 'Hold a Map of type -> builder in a closure.',
      solution: {
        lang: 'js',
        code: `function createShapeFactory() {\n  const builders = new Map()\n  return {\n    register(type, builder) {\n      builders.set(type, builder)\n      return this\n    },\n    create(type, ...args) {\n      const b = builders.get(type)\n      if (!b) throw new Error('Unregistered: ' + type)\n      return b(...args)\n    },\n  }\n}\n\nconst f = createShapeFactory()\nf.register('rect', (w, h) => ({ type: 'rect', area: () => w * h }))\nf.create('rect', 2, 3).area() // 6`,
        explanation: [
          '`builders` is private closure state mapping type to a builder function.',
          'New shapes are added via register() without touching create() — Open/Closed.',
          'create() is a thin O(1) dispatcher; each builder owns its construction.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `createNotifier(channel)` returning { send(to, msg) } for "email", "sms", "push". Make it easy to mock all channels for tests.',
      hint: 'Use a lookup map of channel -> builder, and allow a transport to be injected.',
      solution: {
        lang: 'js',
        code: `function createNotifier(channel, transport = realSend) {\n  const builders = {\n    email: () => ({ send: (to, msg) => transport('email', to, msg) }),\n    sms: () => ({ send: (to, msg) => transport('sms', to, msg) }),\n    push: () => ({ send: (to, msg) => transport('push', to, msg) }),\n  }\n  const build = builders[channel]\n  if (!build) throw new Error('Unknown channel: ' + channel)\n  return build()\n}\n\nfunction realSend(kind, to, msg) {\n  // network call...\n  return { kind, to, msg, status: 'sent' }\n}\n\n// production\nconst email = createNotifier('email')\nemail.send('a@b.com', 'Hi')\n// tests: inject a fake transport\nconst sent = []\nconst fake = (kind, to, msg) => sent.push({ kind, to, msg })\ncreateNotifier('sms', fake).send('+100', 'test')`,
        explanation: [
          'The map dispatches channel to a builder; every channel returns the same { send } interface.',
          'Injecting `transport` lets tests substitute a fake and assert on captured calls — no network.',
          'Unknown channels throw immediately, keeping callers safe.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The Factory Pattern is the gateway to thinking about decoupling and dependency injection — concepts that dominate real architecture discussions. Showing you can separate "what to build" from "how to use it" signals you write maintainable, testable code, not just code that works once.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) usually ask for the definition and a factory-vs-constructor comparison. Product companies (Zoho, Flipkart, Razorpay) ask you to implement a factory function or a registry factory and discuss when you would use it. FAANG-level interviews probe the GoF distinctions (Factory Method vs Abstract Factory), DI/testability seams, and tradeoffs versus plain construction.',
    whatInterviewersExpect:
      'Define it as a creational pattern that encapsulates construction, show the JS factory-function idiom returning an object, explain the decoupling/testability benefit, contrast switch vs registry (Open/Closed), and know when NOT to use it.',
  },
}

export default factoryPattern
