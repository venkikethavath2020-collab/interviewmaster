import type { ConceptLesson } from '../../../types/lesson'

const singletonPattern: ConceptLesson = {
  // 1. Concept Summary
  slug: 'singleton-pattern',
  name: 'Singleton',
  category: 'design-patterns',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'A Singleton guarantees exactly one instance of something for the whole app — the right tool when a second copy would be wrong or wasteful (one DB connection pool, one config, one cache).',
    'It gives a single, well-known access point to that shared instance so unrelated parts of the code coordinate through the same object instead of passing it around everywhere.',
    'Without it you risk duplicate connections, conflicting config, or two caches that disagree — subtle, expensive bugs that only show up under load.',
    'Interviewers love it because the naive version is easy but the real version forces you to reason about lazy initialization, thread/async timing, module caching, and testability.',
    'It is also the classic "anti-pattern" debate: knowing WHEN it hurts (hidden global state, hard-to-test code) is as important as knowing how to write it.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Singleton is like the one and only principal of a school — no matter who asks for "the principal", everyone gets the same single person.',
    story: [
      'Your school has many teachers and hundreds of students, but only ONE principal.',
      'If a teacher says "send this to the principal" and a student says "I need the principal", they are both talking about the exact same person — there is never a second principal.',
      'Anyone in the school can find the principal by going to the principal\'s office; there is one known place to look.',
      'A Singleton in code is like that: no matter how many parts of the program ask for the object, they all get the one and only copy, found in one known place.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes you want only one of something in your whole program — like one settings object that everyone reads from.',
    'A Singleton makes sure that the first time anyone asks, you create that object, and every time after that, you hand back the same one instead of making a new copy.',
    'You usually hide the "make a new one" step and only give people a `getInstance()` door, so they cannot accidentally create a second one.',
    'It is like having one shared whiteboard in a classroom: everyone writes on and reads from the same board, so they all see the same notes.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Singleton Pattern restricts a type to a single shared instance and provides one global access point to it, creating that instance lazily on first use and returning the same one thereafter.',
    how: 'You keep a private cached reference; an access function checks whether the instance exists — if not it creates it once, stores it, and returns it; every later call returns the cached reference. In JavaScript, an ES module is itself a singleton because the module cache returns the same exports to every importer.',
    why: 'It centralizes shared state and resources (config, connection pools, caches, loggers) so the whole app coordinates through one consistent object instead of duplicating or fragmenting that state.',
    code: {
      label: 'A simple lazy singleton',
      lang: 'js',
      code: `let instance = null\n\nfunction getConfig() {\n  if (instance === null) {\n    instance = { theme: 'dark', loadedAt: Date.now() } // created ONCE\n  }\n  return instance\n}\n\nconst a = getConfig()\nconst b = getConfig()\nconsole.log(a === b) // true — same object`,
      explanation: [
        '`instance` is a private cached reference, initially null.',
        'The first call to getConfig() creates the object and stores it.',
        'Every later call sees `instance` is set and returns the SAME object.',
        '`a === b` is true because both variables point to the one instance — that is the whole point of a Singleton.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Singleton Pattern is a creational design pattern that ensures a class or service has exactly one instance for the lifetime of an application and exposes a single global access point to it. Instantiation is controlled — typically via a static factory method or closure-guarded function that performs lazy initialization on first access and memoizes the result. In JavaScript, the ES module system provides singletons for free: a module is evaluated once and its cached exports are shared by every importer, so an exported object literal or instance is inherently a per-process singleton.',

  // 7. Internal Working
  internalWorking: [
    'A private slot (closure variable, module-scope variable, or static class field) is reserved to hold the single instance, initialized to a sentinel like null/undefined.',
    'An access function/method checks that slot: if empty, it constructs the instance exactly once, runs any expensive setup, and assigns it to the slot (lazy initialization).',
    'On every subsequent call the slot is already populated, so the function short-circuits and returns the cached reference — no new allocation.',
    'Because all callers receive the identical reference, reads and writes flow through one shared object; mutations are visible everywhere immediately.',
    'In module-based JS, the runtime caches the evaluated module; repeated imports of the same specifier return the same module record, so an exported instance is shared without any explicit guard.',
    'The instance lives on the heap and stays reachable from the module/closure root for the process lifetime, so it is generally not garbage collected until the program ends or the reference is cleared.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   moduleA ──┐
   moduleB ──┤  all call getInstance()
   moduleC ──┘        │
                      ▼
            ┌───────────────────┐
            │  getInstance()    │
            │  instance == null?│
            │     yes → create  │──► create ONCE
            │     no  → reuse    │
            └─────────┬─────────┘
                      │ returns same ref
                      ▼
              ┌───────────────┐
              │  THE INSTANCE │ ◄── single shared object (heap)
              │  { config,... }│
              └───────────────┘
        moduleA, B, C all point to this ONE object`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the single instance object lives on the heap and is referenced by the module/closure slot that caches it.',
    'REFERENCES: every importer/caller holds a reference to that one heap object, so reference count never drops to zero while the module is loaded.',
    'LIFETIME: because the cached slot is a long-lived root, the instance is effectively immortal for the process — great for shared resources, dangerous if it captures large per-request data.',
    'RESET: nulling the cached slot (and dropping all other references) is the only way to let GC reclaim it — relevant for test isolation between cases.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — closure-guarded singleton',
      lang: 'js',
      code: `const Counter = (function () {\n  let instance\n  function create() {\n    let count = 0\n    return { inc: () => ++count, value: () => count }\n  }\n  return {\n    getInstance() {\n      if (!instance) instance = create()\n      return instance\n    },\n  }\n})()\n\nCounter.getInstance().inc()\nCounter.getInstance().inc()\nCounter.getInstance().value() // 2 — same instance`,
      explanation: [
        'An IIFE creates a private `instance` slot that nothing outside can touch.',
        '`getInstance()` builds the object on first call and caches it.',
        'Both `inc()` calls hit the same instance, so the count is shared → 2.',
        'This is the textbook closure-based Singleton.',
      ],
    },
    intermediate: {
      label: 'Intermediate — ES module singleton (the idiomatic JS way)',
      lang: 'js',
      code: `// logger.js\nclass Logger {\n  constructor() { this.logs = [] }\n  log(msg) { this.logs.push(msg); console.log(msg) }\n}\nexport default new Logger() // instance created once at module eval\n\n// a.js\nimport logger from './logger.js'\nlogger.log('from A')\n\n// b.js\nimport logger from './logger.js'\nlogger.log('from B')\n// logger.logs === ['from A', 'from B'] — SAME instance in both files`,
      explanation: [
        'The module is evaluated once; `new Logger()` runs a single time.',
        'Both a.js and b.js import the cached default export — the same object.',
        'No explicit getInstance guard is needed; the module cache IS the singleton mechanism.',
        'This is how most production JS singletons (config, clients, stores) are actually written.',
      ],
    },
    advanced: {
      label: 'Advanced — lazy singleton with async initialization',
      lang: 'js',
      code: `let dbPromise = null\n\nasync function connectDb() {\n  // pretend this opens a pool\n  await new Promise((r) => setTimeout(r, 10))\n  return { query: (sql) => Promise.resolve(['row for ' + sql]) }\n}\n\nexport function getDb() {\n  if (!dbPromise) {\n    dbPromise = connectDb() // start once; cache the PROMISE, not just the value\n  }\n  return dbPromise\n}\n\n// concurrent callers all await the same connection\nawait Promise.all([getDb(), getDb(), getDb()]) // connects ONCE`,
      explanation: [
        'Caching the Promise (not the resolved value) prevents the "thundering herd": concurrent callers during init all reuse the one in-flight connection.',
        'If you cached only the resolved value, two callers racing before it resolved could each start a connection.',
        'Every caller awaits the same promise and gets the same db object.',
        'This is the correct async singleton shape for connection pools and one-time setup.',
      ],
    },
    realProject: {
      label: 'Real project — Pinia/Vuex store and a shared API client',
      lang: 'js',
      code: `// store/auth.js (Pinia) — defineStore caches one store instance per id\nimport { defineStore } from 'pinia'\nexport const useAuthStore = defineStore('auth', {\n  state: () => ({ user: null, token: null }),\n  actions: { login(u, t) { this.user = u; this.token = t } },\n})\n\n// any component\nconst auth = useAuthStore() // same singleton store everywhere\n\n// services/http.js — shared client singleton via module cache\nimport axios from 'axios'\nexport const http = axios.create({ baseURL: '/api' })`,
      explanation: [
        'Pinia/Vuex stores are app-wide singletons: every `useAuthStore()` returns the same reactive instance, so all components share auth state.',
        'The `http` client is a module-cached singleton — one axios instance with shared interceptors and config across the app.',
        'This avoids duplicate state and duplicate HTTP configuration.',
        'Frameworks lean heavily on singletons for stores, routers, and clients — exactly this pattern.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Singleton Pattern?',
      answer: 'A creational pattern that ensures a type has only one instance for the whole application and provides a single global access point to it, creating it lazily on first use and returning the same instance thereafter.',
      explanation: 'A strong answer mentions both halves: single instance AND one access point, plus a real use (config, logger, connection pool).',
    },
    {
      level: 'beginner',
      question: 'How do you create a singleton in modern JavaScript?',
      answer: 'The idiomatic way is an ES module that exports a single instance or object — the module is evaluated once and its exports are cached, so every importer shares the same object. Alternatively, a closure with a cached `instance` and a getInstance() function.',
      explanation: 'Interviewers want you to know that JS modules give singletons for free, not just the manual getInstance pattern.',
    },
    {
      level: 'intermediate',
      question: 'What is lazy initialization and why does it matter for singletons?',
      answer: 'Lazy initialization means the instance is created only on first access rather than at load time. It matters because the setup may be expensive (a DB connection) or depend on runtime info; deferring it avoids paying the cost if the singleton is never used.',
      explanation: 'Bonus points for noting you must guard against creating it twice — and in async cases, cache the promise to avoid races.',
    },
    {
      level: 'intermediate',
      question: 'Why is the Singleton often called an anti-pattern?',
      answer: 'Because it introduces hidden global mutable state: dependencies become implicit, code is harder to test (shared state leaks between tests), and tight coupling to the global access point reduces flexibility.',
      explanation: 'Senior signal: balancing legitimate uses (truly single resources) against the testability and coupling costs, and preferring dependency injection where possible.',
    },
    {
      level: 'advanced',
      question: 'How do you handle a singleton that needs async setup with many concurrent callers?',
      answer: 'Cache the initialization Promise, not just the resolved value. The first call starts initialization and stores the promise; concurrent callers await the same in-flight promise, so initialization happens exactly once even under a burst of requests.',
      explanation: 'This addresses the thundering-herd / double-init race that a naive value cache would suffer when callers race before resolution.',
    },
    {
      level: 'senior',
      question: 'How do singletons interact with module bundling, SSR, and testing?',
      answer: 'Module-cached singletons can be duplicated if the same module is bundled into multiple chunks or loaded under different specifiers, breaking the single-instance guarantee. In SSR, a module singleton is shared across requests in the same process — dangerous if it holds per-user state. In tests, persistent state leaks between cases, so you need reset hooks or fresh module registries.',
      explanation: 'Top-tier answer: connects the pattern to real failure modes — duplicate instances across bundles, request bleed in SSR, and test isolation — and the mitigations.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why is an ES module effectively a singleton?',
    'How would you make a singleton resettable for unit tests?',
    'What is the thundering-herd problem in lazy async singletons and how do you fix it?',
    'When should you prefer dependency injection over a singleton?',
    'How can a singleton be accidentally duplicated by a bundler or in a monorepo?',
    'Why is global mutable singleton state dangerous in SSR / serverless environments?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a singleton to hold per-request or per-user state in a server.',
      why: 'A process-wide singleton is shared across all requests, so one user can see or corrupt another user\'s data.',
      fix: 'Keep singletons for truly shared, stateless-or-immutable resources; pass per-request state explicitly (request-scoped objects).',
    },
    {
      mistake: 'Caching the resolved value (not the promise) in an async singleton.',
      why: 'Concurrent callers during initialization each start the expensive setup, defeating the single-instance goal.',
      fix: 'Cache the in-flight Promise so all callers await the same initialization.',
    },
    {
      mistake: 'Treating singletons as harmless globals and overusing them.',
      why: 'They create hidden dependencies and shared mutable state, making code tightly coupled and hard to test.',
      fix: 'Prefer dependency injection; reserve singletons for genuinely single resources and document the shared state.',
    },
    {
      mistake: 'Forgetting that bundlers/SSR can create more than one instance.',
      why: 'Duplicated modules across chunks or per-request module registries break the single-instance assumption.',
      fix: 'Ensure one module copy (dedupe in the bundler), and avoid relying on a singleton for cross-request uniqueness in SSR.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia/Vuex stores are app-scoped singletons (one instance per store id), as are the router and i18n instances — every component shares the same reactive object.' },
    { area: 'React', detail: 'Module-level clients (a single React Query client, a Redux store, an analytics client) act as singletons; context providers expose that one instance to the tree.' },
    { area: 'Node.js', detail: 'Database connection pools, the logger, config, and SDK clients are typically module-cached singletons created once at startup and reused across the process.' },
    { area: 'Backend', detail: 'Caches, feature-flag clients, and metrics registries are singletons; in serverless they persist across warm invocations of the same container, which must be accounted for to avoid stale or leaked state.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Avoids repeated expensive construction (one connection pool, one parser) — created once, reused everywhere.',
      'Lazy initialization defers cost until first use, so unused features pay nothing.',
    ],
    bad: [
      'A long-lived singleton holding large data keeps that memory alive for the whole process lifetime.',
      'Shared mutable state can become a contention/serialization point or a source of subtle cross-feature coupling.',
    ],
    optimizations: [
      'Cache the initialization promise for async singletons to avoid duplicate setup under concurrency.',
      'Keep the singleton lean — store references/handles, not large per-request payloads.',
      'Use lazy creation so the instance only exists when actually needed.',
      'Provide a teardown/reset path for tests and for graceful shutdown (close pools, flush buffers).',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A process-wide singleton holding auth/session state can leak one user\'s data to another in SSR or serverless, since the instance is shared across requests.',
      'Storing secrets (tokens, keys) in a singleton in client-side code is no more secure than any other JS memory — DevTools can read it.',
    ],
    bestPractices: [
      'Never store per-user/per-request mutable state in a server-side singleton; use request-scoped containers instead.',
      'Keep real secrets server-side and out of client singletons; on the client use httpOnly cookies for tokens.',
      'On graceful shutdown, ensure singletons holding connections/credentials are cleaned up so they are not left dangling.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'closure', 'es-modules', 'es6-classes'],
    nextConcepts: ['factory-pattern', 'module-pattern', 'observer-pattern', 'event-emitter'],
    dependencyNote:
      'A Singleton builds on closures (private cached slot) and ES modules (module cache provides singletons for free). It overlaps with the Factory pattern (a factory can return a shared instance) and the Module pattern, and shared event buses/stores are commonly singletons.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three caller boxes on the left all pointing to one getInstance() box.',
      'Inside getInstance() write the check: "instance == null? create : reuse".',
      'Draw one instance box on the right; arrow from getInstance() to it labeled "created ONCE".',
      'Draw arrows from all three callers converging on that single instance.',
      'Say: "Whoever asks first creates it; everyone else gets the same cached reference — one instance, one access point. In JS an ES module gives this for free."',
    ],
    diagram: `  callerA ─┐
  callerB ─┼─► getInstance()  ── instance==null? ──► create ONCE
  callerC ─┘        │  else reuse cached
                    ▼
            ┌──────────────┐
            │ THE INSTANCE │  ◄── all three share this one object
            └──────────────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Singleton Pattern guarantees one instance of something for the whole app and one access point to it, creating it lazily on first use and returning the same reference forever after. In JavaScript the idiomatic form is an ES module exporting a single instance — the module cache makes it a singleton automatically — or a closure with a cached getInstance(). Use it for genuinely single resources like config, loggers, and connection pools. Watch out: it is hidden global mutable state, so it hurts testability and is dangerous for per-request data in SSR; for async setup, cache the promise to avoid double initialization.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Singleton Pattern is a creational pattern that ensures a type has exactly one instance for the lifetime of the application and exposes a single global access point to it. The instance is created lazily on first access and cached, so every later request returns the same object. In JavaScript the most natural way is an ES module: a module is evaluated once and its exports are cached by the runtime, so an exported instance or object literal is inherently a per-process singleton, no explicit getInstance needed. The manual form uses a closure or static field holding a cached reference, with an access function that creates the instance once and reuses it. We reach for it when a second copy would be wrong or wasteful — one database connection pool, one config object, one logger, one app store like Pinia. The subtle parts interviewers probe: for async initialization you must cache the in-flight promise, not just the resolved value, otherwise concurrent callers each start the expensive setup. And the singleton is frequently called an anti-pattern because it is hidden global mutable state that couples code and hurts testing — in SSR or serverless a process-wide singleton holding per-user state can leak data across requests. So I treat it as a deliberate choice for truly single resources, prefer dependency injection where I can, and always provide a reset path for tests.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Convenience vs coupling: a global access point is easy to use but creates implicit dependencies and tight coupling, the opposite of dependency injection.',
      'Single source of truth vs hidden mutable state: one instance prevents fragmentation but concentrates shared state that is hard to reason about and test.',
      'Module-cached singleton (free, idiomatic) vs explicit getInstance (more control over lazy/async init and reset).',
    ],
    edgeCases: [
      'Bundlers can duplicate the same module across chunks or a monorepo can resolve two copies, silently producing two "singletons".',
      'In SSR/serverless, a module singleton persists across requests (and warm invocations), leaking per-user state if misused.',
      'Async lazy init has a race: caching the value instead of the promise lets concurrent callers double-initialize.',
      'Circular imports can observe a partially initialized singleton if it is consumed during module evaluation.',
    ],
    runtimeBehavior: [
      'The cached instance is a long-lived GC root, so it survives for the process lifetime unless explicitly cleared.',
      'Lazy creation means the first caller pays the construction cost; subsequent calls are a cheap reference return.',
      'Module evaluation order determines when an eagerly-instantiated module singleton is built.',
    ],
    scalability: [
      'Singletons holding connection pools scale well because they cap and reuse expensive resources across the process.',
      'A singleton that is a write hotspot (e.g. a shared cache under heavy concurrency) can become a contention point; consider sharding or per-worker instances.',
    ],
    productionConcerns: [
      'Provide explicit teardown for graceful shutdown (close pools, flush logs) and reset for test isolation.',
      'Never put per-request/per-user mutable state in a server singleton — a top cause of data-leak incidents.',
      'Audit bundler dedupe and module resolution to ensure the single-instance guarantee actually holds in production builds.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Singleton = one instance for the whole app + one global access point.',
    'Lazy init: create on first access, cache, reuse thereafter.',
    'Idiomatic JS: an ES module exporting one instance (module cache = singleton).',
    'Manual form: closure/static field holding a cached `instance` + getInstance().',
    'Use for: config, logger, connection pool, app store, single cache.',
    'Async init: cache the PROMISE, not the value (avoids double-init race).',
    'Often called anti-pattern: hidden global mutable state, hard to test.',
    'Prefer dependency injection when feasible; document shared state.',
    'SSR/serverless danger: shared across requests → never hold per-user state.',
    'Bundlers/monorepos can duplicate modules → two "singletons".',
    'Provide reset/teardown for tests and graceful shutdown.',
    'Pinia/Vuex stores, routers, and HTTP clients are real-world singletons.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a `getConfig()` that returns the same config object every time it is called.',
      hint: 'Cache the object in a module/closure variable and create it only once.',
      solution: {
        lang: 'js',
        code: `let config = null\nexport function getConfig() {\n  if (!config) config = { env: 'prod', retries: 3 }\n  return config\n}\nconsole.log(getConfig() === getConfig()) // true`,
        explanation: [
          'The first call creates and caches the object.',
          'Every later call returns the cached reference, so equality holds.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement a closure-based Singleton with getInstance() that returns an object with a private incrementing id generator.',
      hint: 'Use an IIFE with a private instance slot.',
      solution: {
        lang: 'js',
        code: `const IdGen = (function () {\n  let instance\n  function create() {\n    let next = 0\n    return { nextId: () => ++next }\n  }\n  return { getInstance: () => instance || (instance = create()) }\n})()\n\nIdGen.getInstance().nextId() // 1\nIdGen.getInstance().nextId() // 2 — same instance`,
        explanation: [
          'The IIFE hides `instance`; getInstance() creates it once.',
          'Both calls hit the same generator, so ids continue 1, 2.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement an async singleton getConnection() that initializes exactly once even when called concurrently many times.',
      hint: 'Cache the promise, not the resolved value.',
      solution: {
        lang: 'js',
        code: `let connPromise = null\nlet initCount = 0\n\nasync function init() {\n  initCount++\n  await new Promise((r) => setTimeout(r, 5))\n  return { id: initCount, query: () => 'ok' }\n}\n\nexport function getConnection() {\n  if (!connPromise) connPromise = init()\n  return connPromise\n}\n\n// concurrent\nconst [a, b, c] = await Promise.all([getConnection(), getConnection(), getConnection()])\nconsole.log(a === b && b === c, initCount) // true 1`,
        explanation: [
          'The promise is cached on the first call, so concurrent callers reuse it.',
          'init() runs exactly once (initCount stays 1) despite three concurrent calls.',
          'All callers resolve to the same connection object.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a singleton Logger with log()/getLogs() AND a reset() so tests can clear shared state between cases. Show why reset matters.',
      hint: 'Keep the instance and its logs in module scope; reset() rebuilds it.',
      solution: {
        lang: 'js',
        code: `let instance = null\n\nfunction createLogger() {\n  const logs = []\n  return {\n    log: (msg) => { logs.push(msg); return logs.length },\n    getLogs: () => [...logs],\n  }\n}\n\nexport function getLogger() {\n  if (!instance) instance = createLogger()\n  return instance\n}\n\nexport function resetLogger() {\n  instance = null // drop reference so a fresh one is built next time\n}\n\n// test isolation\ngetLogger().log('case A')\nresetLogger()\nconsole.log(getLogger().getLogs().length) // 0 — clean slate`,
        explanation: [
          'The singleton caches one logger with private `logs`.',
          'Without reset, logs from one test leak into the next because state is process-wide.',
          'resetLogger() nulls the cached slot so getLogger() builds a fresh instance — the standard test-isolation hook.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Singleton is the most discussed creational pattern because it sits at the intersection of resource management, global state, and testability — exactly the tradeoffs senior engineers weigh daily. Showing you know both how to write one AND when it becomes harmful sets you apart.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and a basic getInstance implementation. Product companies (Zoho, Flipkart, Razorpay) ask you to implement it (including the async/concurrent variant) and discuss the anti-pattern critique. FAANG-level interviews probe module-cache subtleties, SSR/serverless request bleed, bundler duplication, and dependency injection alternatives.',
    whatInterviewersExpect:
      'Define one-instance + one-access-point, show the ES-module idiom and a closure version, explain lazy/async initialization (cache the promise), and articulate the testability/global-state tradeoffs and when to prefer DI.',
  },
}

export default singletonPattern
