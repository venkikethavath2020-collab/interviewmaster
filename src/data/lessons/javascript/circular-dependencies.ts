import type { ConceptLesson } from '../../../types/lesson'

const circularDependencies: ConceptLesson = {
  // 1. Concept Summary
  slug: 'circular-dependencies',
  name: 'Circular Dependencies',
  category: 'modules',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'A circular dependency is when module A imports B and B imports A (directly or through a chain) — and it produces some of the most confusing "undefined is not a function" bugs in real codebases.',
    'The behavior differs between ESM and CommonJS, so understanding it requires understanding the module evaluation model deeply.',
    'Cycles often signal a design smell — tangled responsibilities — and large cyclic graphs hurt build time, tree shaking, and refactorability.',
    'They cause heisenbugs: code works until you reorder imports or add a top-level access, then suddenly breaks with `undefined`.',
    'Interviewers use them to probe whether you truly understand link-before-evaluate (ESM) versus partial-exports (CJS), separating memorizers from people who know how modules load.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Two friends each waiting for the other to go first — neither is ready yet.',
    story: [
      'Imagine two friends, Amy and Ben, getting ready to leave for a party.',
      'Amy says "I\'ll go once Ben is ready," and Ben says "I\'ll go once Amy is ready."',
      'If they both wait for the other to finish first, and one of them peeks too early, they\'ll see the other is "not ready yet" and get confused.',
      'Modules can do this too: file A needs file B, and file B needs file A. If one tries to use the other before it has finished setting up, it sees an empty, half-ready answer — that is a circular dependency bug.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you split code into files, each file can ask another file for things using imports.',
    'A circular dependency happens when file A asks for something from file B, and file B also asks for something from file A — they depend on each other in a loop.',
    'The computer has to run one of them first, so when it runs file A and A immediately tries to use B, B may not have finished setting up yet.',
    'That can lead to errors where something is "undefined" because it was used before it existed — which is why circular dependencies are tricky and often best avoided.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A circular dependency is when two or more modules depend on each other, forming a cycle in the import graph (A → B → A). The module loader must evaluate them in some order, so one ends up partially initialized when the other reads from it.',
    how: 'In ESM, bindings are linked before any code runs, so the names exist but may hold their uninitialized value if accessed too early. In CommonJS, `require()` returns whatever `module.exports` holds at the moment of the call — which may be incomplete. Both can yield `undefined` if you access the cyclic import at module top level.',
    why: 'Understanding cycles explains baffling `undefined` errors and guides you to fix them by restructuring code or deferring access until after both modules finish loading.',
    code: {
      label: 'A cycle that reads undefined',
      lang: 'js',
      code: `// a.js\nimport { b } from './b.js'\nexport const a = 'A'\nconsole.log('a sees b =', b) // 'B' (b finished first)\n\n// b.js\nimport { a } from './a.js'\nexport const b = 'B'\nconsole.log('b sees a =', a) // undefined ← a not ready yet\n\n// entry.js\nimport './a.js'`,
      explanation: [
        'entry.js imports a.js; a.js imports b.js, so b.js is evaluated first as a dependency.',
        'While b.js runs, a.js has been linked but its `a` binding is still uninitialized, so `a` reads as undefined.',
        'After b.js finishes, a.js resumes and `b` is now defined.',
        'The fix is to avoid reading the cyclic import at top level — reference it inside a function instead.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A circular dependency exists when the module dependency graph contains a cycle. The loader cannot evaluate every module strictly after its dependencies, so it picks a depth-first order and one module in the cycle is evaluated while its cyclic counterpart is only partially initialized. In ES Modules, all exported bindings are allocated and linked before evaluation, so a circular import name always resolves to a binding, but reading it before the exporter has run yields its uninitialized state (a TDZ error for `let`/`const` accessed too early, or the value at access time for function-hoisted declarations). In CommonJS, `require()` returns the current `module.exports` object, which may be incomplete (a partial export), so consumers can capture `undefined` or a stale snapshot. Cycles are usually a design smell and are best broken by extracting shared code, deferring access, or using lazy references.',

  // 7. Internal Working
  internalWorking: [
    'GRAPH + ORDER: the loader builds the dependency graph and, finding a cycle, performs a depth-first traversal; it marks modules as "in progress" to avoid infinite recursion when it re-encounters one.',
    'ESM LINKING: before any body runs, all modules in the cycle have their export bindings allocated and imports wired to those binding slots (live references), so names always exist.',
    'ESM EVALUATION: bodies run depth-first; when the loop is detected, the already-in-progress module is NOT re-run. If its bindings are accessed before its body assigned them, `let`/`const` are in the temporal dead zone (throws) while hoisted `function` declarations are already available.',
    'CJS EVALUATION: `require()` of an in-progress module returns its current `module.exports` (whatever has been assigned so far) instead of re-running it, so the consumer may capture an incomplete object.',
    'COMPLETION: once each body finishes, exports are fully populated; references obtained earlier in CJS are stale snapshots, while ESM live bindings now reflect the final values.',
    'RESULT: top-level use of a cyclic import is fragile; access deferred to call time (after all modules loaded) sees fully initialized values in both systems.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        entry.js ──► a.js ──► b.js ──┐
                       ▲              │
                       └──────────────┘  (b imports a → CYCLE)

  evaluation order (depth-first): a starts → needs b → b runs first
  ┌──────────── b.js (runs first) ────────────┐
  │ uses 'a' NOW → a.js body not run yet       │
  │   ESM: a binding = uninitialized (TDZ)     │
  │   CJS: a = current module.exports (partial)│
  └─────────────────────────────────────────────┘
  Fix: don't touch the cyclic import at TOP LEVEL;
       reference it lazily inside a function instead.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'ESM: each module has one environment record on the heap with export slots; cyclic importers hold live references (pointers) to those slots, so a too-early read finds the slot uninitialized.',
    'CJS: each module has a `module.exports` object in the cache; a cyclic `require()` returns the SAME object reference but with whatever properties exist so far — a partial snapshot.',
    'SNAPSHOT vs LIVE: a destructured CJS value captured during a cycle is a copy and stays `undefined`; an ESM live binding updates once the exporter finishes.',
    'The cycle does not duplicate modules — each is still a singleton; the issue is timing of when slots/properties are populated relative to access.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — ESM: function declarations survive cycles',
      lang: 'js',
      code: `// even.js\nimport { isOdd } from './odd.js'\nexport function isEven(n) { return n === 0 ? true : isOdd(n - 1) }\n\n// odd.js\nimport { isEven } from './even.js'\nexport function isOdd(n) { return n === 0 ? false : isEven(n - 1) }\n\n// main.js\nimport { isEven } from './even.js'\nconsole.log(isEven(10)) // true — works despite the cycle`,
      explanation: [
        'even.js and odd.js form a cycle, but each only USES the other inside a function (call time), not at top level.',
        'By the time `isEven(10)` runs, both modules are fully evaluated, so the cyclic calls resolve correctly.',
        'ESM live bindings plus deferred (call-time) access make this safe.',
        'This is the canonical "good" cycle — mutual recursion across modules.',
      ],
    },
    intermediate: {
      label: 'Intermediate — CJS partial exports bug',
      lang: 'js',
      code: `// a.cjs\nconst { b } = require('./b.cjs') // b is undefined here!\nmodule.exports.a = 'A'\nconsole.log('a got b =', b) // undefined\n\n// b.cjs\nconst a = require('./a.cjs')   // a.exports is { } so far (partial)\nmodule.exports.b = 'B'\nconsole.log('b got a =', a)     // {} then later { a: 'A' }\n\n// entry.cjs\nrequire('./a.cjs')`,
      explanation: [
        'entry requires a.cjs; a.cjs requires b.cjs before it has exported anything.',
        'b.cjs then requires a.cjs, which is in progress, so it gets a.cjs\'s current (empty) exports object.',
        '`const { b } = require(...)` in a.cjs copies `undefined` because b.cjs has not assigned `b` yet at that point.',
        'CJS returns partial exports during cycles — destructuring captures stale/undefined values.',
      ],
    },
    advanced: {
      label: 'Advanced — breaking the cycle by extracting shared code',
      lang: 'js',
      code: `// BEFORE: user.js ↔ post.js cycle (each imports the other's type/helper)\n\n// AFTER: extract the shared piece into a third module\n// shared.js\nexport const formatId = (id) => 'ID_' + id\n\n// user.js\nimport { formatId } from './shared.js'\nexport const makeUser = (id) => ({ id: formatId(id), posts: [] })\n\n// post.js\nimport { formatId } from './shared.js'\nexport const makePost = (id) => ({ id: formatId(id) })`,
      explanation: [
        'The cycle existed because user and post each needed a shared helper from the other.',
        'Extracting `formatId` into shared.js removes the mutual dependency entirely.',
        'Now both depend on shared.js, which depends on neither — an acyclic (DAG) graph.',
        'Extracting shared code is the most robust fix; deferring access only masks the timing problem.',
      ],
    },
    realProject: {
      label: 'Real project — Vue store / service cycle and the lazy fix',
      lang: 'js',
      code: `// authStore.js imports apiClient; apiClient imports authStore for the token → cycle\n// FIX: lazy import inside the function, not at top level\n\n// apiClient.js\nexport async function request(url) {\n  const { useAuthStore } = await import('./authStore.js') // deferred\n  const token = useAuthStore().token\n  return fetch(url, { headers: { Authorization: 'Bearer ' + token } })\n}`,
      explanation: [
        'A store and an API client commonly reference each other, creating a cycle.',
        'Reading the store at module top level would capture an uninitialized value.',
        'A dynamic `import()` inside `request` defers resolution until call time, after both modules have loaded.',
        'This pattern (lazy import to break a cycle) is common in Vue/React app architectures.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a circular dependency?',
      answer: 'When two or more modules depend on each other directly or transitively, forming a cycle in the import graph (A imports B and B imports A).',
      explanation: 'A good answer mentions it forces a partial-initialization situation during loading.',
    },
    {
      level: 'beginner',
      question: 'What symptom does a circular dependency usually cause?',
      answer: 'An import unexpectedly being `undefined` (or a "is not a function" error) when accessed too early, because the other module had not finished initializing.',
      explanation: 'Connecting the symptom to load timing shows understanding beyond the definition.',
    },
    {
      level: 'intermediate',
      question: 'How does ESM handle a circular dependency differently from CommonJS?',
      answer: 'ESM links all export bindings before evaluating bodies, so names always exist but read as uninitialized (TDZ for let/const) if accessed too early; function declarations are hoisted and usable. CommonJS returns the current `module.exports` from `require()`, which may be a partial/empty object during the cycle.',
      explanation: 'This is the core senior distinction — link-before-evaluate vs partial-exports.',
    },
    {
      level: 'intermediate',
      question: 'Why does the even/odd mutual-recursion cycle work but a top-level read does not?',
      answer: 'Because even/odd only access each other inside functions (at call time, after both modules finished loading), whereas a top-level read happens during evaluation while the other module is still partially initialized.',
      explanation: 'Deferring access to call time is the key insight.',
    },
    {
      level: 'advanced',
      question: 'How do you fix a circular dependency properly?',
      answer: 'Best: extract the shared code into a third module so the graph becomes acyclic. Otherwise defer access (reference the import inside a function or via dynamic `import()`), or invert the dependency. Reordering imports is a fragile band-aid.',
      explanation: 'Senior answers prioritize restructuring over masking the symptom.',
    },
    {
      level: 'senior',
      question: 'Why are circular dependencies a design and tooling concern beyond the runtime bug?',
      answer: 'Cycles couple modules tightly, hurt testability and refactorability, complicate tree shaking and code splitting, can slow incremental builds, and make initialization order brittle. They usually indicate misplaced responsibilities that should be factored out.',
      explanation: 'This shows architectural maturity, not just bug-fixing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How can you detect circular dependencies in a large codebase?',
    'Does a circular dependency always cause a bug, or only sometimes?',
    'How does the temporal dead zone relate to cyclic ESM imports?',
    'Why might reordering import statements "fix" a cycle, and why is that fragile?',
    'How do circular dependencies interact with tree shaking and bundling?',
    'How do you break a cycle between a store and a service in a Vue/React app?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Accessing a cyclic import at module top level.',
      why: 'The other module may be partially initialized, so the value is undefined or in the TDZ.',
      fix: 'Defer access to call time (inside a function) or use a dynamic `import()` so both modules finish first.',
    },
    {
      mistake: 'Destructuring values from a CJS module involved in a cycle.',
      why: 'Destructuring copies the current (possibly undefined) value and never updates.',
      fix: 'Import the whole module object and read the property later, or restructure to remove the cycle.',
    },
    {
      mistake: 'Treating import reordering as a real fix.',
      why: 'It only changes which module is partially initialized; the cycle and its fragility remain.',
      fix: 'Extract shared code into a separate module so the dependency graph becomes acyclic.',
    },
    {
      mistake: 'Ignoring cycle warnings from the bundler.',
      why: 'Cycles can silently produce undefined at scale and degrade tree shaking/build performance.',
      fix: 'Use a detector (madge / bundler circular-dependency plugin) and resolve cycles as part of CI.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia stores and API services commonly reference each other; teams break the cycle with lazy/dynamic imports inside actions and run a circular-dependency check in CI.' },
    { area: 'React', detail: 'Context providers and the services they call can form cycles; the fix is extracting shared types/helpers or deferring the import inside hooks/handlers.' },
    { area: 'Node.js', detail: 'CJS server modules (models referencing each other) often hit partial-export bugs; codebases either migrate to ESM with deferred access or factor out shared schemas.' },
    { area: 'Backend', detail: 'Domain layers (entities ↔ repositories) are prone to cycles; clean architecture breaks them with interfaces and dependency inversion so the graph stays acyclic.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A well-contained cycle accessed only at call time has no runtime performance penalty once loaded.',
      'Mutual recursion across modules (even/odd style) is a legitimate, harmless use when access is deferred.',
    ],
    bad: [
      'Large cyclic graphs slow incremental/rebuild times and complicate the bundler\'s work.',
      'Cycles can defeat or weaken tree shaking, leaving more code in the bundle.',
    ],
    optimizations: [
      'Break cycles by extracting shared modules so the graph is a DAG, improving build and shake.',
      'Detect cycles in CI (madge, eslint-plugin-import\'s no-cycle, bundler plugins).',
      'Prefer dependency inversion/interfaces to decouple layers that tend to reference each other.',
      'Use lazy/dynamic imports only as a targeted fix when restructuring is impractical.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'esm-vs-cjs', 'temporal-dead-zone'],
    nextConcepts: ['bundlers-module-resolution', 'tree-shaking', 'dynamic-imports', 'top-level-await'],
    dependencyNote:
      'Circular dependencies require understanding es-modules\' link-before-evaluate model, the esm-vs-cjs difference (live bindings vs partial exports), and the temporal-dead-zone for too-early access. Fixing them often uses dynamic-imports, and cycles interact with bundlers-module-resolution and tree-shaking.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a.js and b.js with arrows in both directions (the cycle).',
      'Mark the depth-first order: entry → a → b (b runs first).',
      'Show b reading `a` while a.js is still "in progress".',
      'Annotate: ESM → uninitialized binding (TDZ); CJS → partial module.exports.',
      'Say: "top-level access breaks; call-time access is safe after both load".',
      'Conclude with the fix: "extract shared code → make the graph acyclic".',
    ],
    diagram: `   a.js ⇄ b.js   (mutual imports = cycle)
   order: entry → a → (needs b) → b runs first
   b reads a NOW:
     ESM → a = uninitialized (TDZ)
     CJS → a = partial module.exports ({})
   safe: use the import INSIDE a function (call time)
   best fix: move shared code to shared.js (DAG)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A circular dependency is a cycle in the import graph (A↔B). The loader evaluates one module while the other is partially initialized. In ESM, bindings are linked first so names exist but read uninitialized (TDZ) if accessed too early; function declarations still work. In CJS, `require()` returns the current, possibly partial, `module.exports`. Top-level access of a cyclic import is fragile; call-time access is safe. The real fix is to extract shared code so the graph becomes acyclic.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A circular dependency is when modules depend on each other, forming a cycle in the import graph — A imports B and B imports A, directly or through a chain. The loader cannot evaluate every module after its dependencies, so it picks a depth-first order, and one module in the cycle ends up running while its counterpart is only partially initialized. The behavior then differs by system. In ES Modules, all export bindings are allocated and linked before any code runs, so the imported names always exist; but if you read one before its module\'s body has assigned it, a `let` or `const` is in the temporal dead zone and throws, while a hoisted function declaration is already usable. In CommonJS, `require()` of a module that is mid-evaluation returns whatever its `module.exports` holds so far — often an incomplete object — so destructuring captures `undefined`. The practical rule: accessing a cyclic import at module top level is fragile, but accessing it at call time, inside a function, is safe because by then both modules have finished loading. That\'s why mutual recursion like cross-module isEven/isOdd works. The proper fix is not reordering imports, which just shifts which module is partial; it\'s to extract the shared code into a third module so the graph becomes acyclic, or to defer the reference with a lazy or dynamic import. Beyond the bug, cycles are usually a design smell that hurts testability, tree shaking, and build times, so I detect them in CI and refactor them out.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Lazy/dynamic import fixes the bug quickly but adds indirection and can hide the underlying coupling.',
      'Extracting shared modules is cleaner but requires refactoring and may add small files; it pays off in maintainability.',
    ],
    edgeCases: [
      'ESM function declarations are hoisted and survive cycles; `let`/`const` accessed too early throw via TDZ.',
      'CJS returns partial exports, so a destructured primitive stays undefined while a whole-object reference can update later.',
      'Reordering imports changes which module is partially initialized, occasionally "fixing" it by luck — brittle.',
      'Top-level await in a cycle can stall or surface uninitialized peers, compounding the problem.',
    ],
    runtimeBehavior: [
      'The cycle does not duplicate modules; each remains a cached singleton — only initialization timing is at issue.',
      'ESM live bindings reflect final values after evaluation; CJS captured copies do not.',
      'Bundlers may emit runtime that preserves evaluation order and can warn on detected cycles.',
    ],
    scalability: [
      'Large cyclic clusters slow incremental builds and make modules hard to test in isolation.',
      'Cycles weaken tree shaking, leaving dead code in big bundles, so removing them improves both build and runtime size.',
    ],
    productionConcerns: [
      'Add a cycle detector (madge / eslint no-cycle / bundler plugin) to CI to prevent regressions.',
      'Prefer dependency inversion (interfaces) at layer boundaries to structurally eliminate cycles.',
      'Document any intentional lazy-import cycle-break so future refactors don\'t reintroduce the top-level access.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Circular dep = cycle in the import graph (A↔B).',
    'Loader evaluates one module while the other is partial.',
    'ESM: bindings linked first → names exist; too-early read = TDZ.',
    'ESM: hoisted function declarations survive cycles.',
    'CJS: require() returns current (maybe partial) module.exports.',
    'Top-level access = fragile; call-time access = safe.',
    'Mutual recursion (isEven/isOdd) works via deferred access.',
    'Reordering imports is a band-aid, not a fix.',
    'Real fix: extract shared code → acyclic graph (DAG).',
    'Quick fix: lazy / dynamic import() to defer resolution.',
    'Cycles hurt tree shaking, builds, testability.',
    'Detect with madge / eslint no-cycle in CI.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Identify whether this ESM cycle prints a defined value or undefined, and explain: `a.js` reads `b` at top level; `b.js` reads `a` at top level; entry imports a.js.',
      hint: 'Which module evaluates first, and is the other assigned yet?',
      solution: {
        lang: 'js',
        code: `// a.js\nimport { b } from './b.js'\nexport const a = 'A'\nconsole.log('a:', b) // 'B'\n// b.js\nimport { a } from './a.js'\nexport const b = 'B'\nconsole.log('b:', a) // undefined (TDZ-era read)`,
        explanation: [
          'a.js imports b.js, so b.js evaluates first.',
          'b.js reads `a` while a.js is still in progress → undefined.',
          'a.js then resumes and reads `b`, which is now defined.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make this cross-module mutual recursion work despite the cycle: even.js needs isOdd, odd.js needs isEven.',
      hint: 'Only reference the other import inside the function body.',
      solution: {
        lang: 'js',
        code: `// even.js\nimport { isOdd } from './odd.js'\nexport function isEven(n) { return n === 0 ? true : isOdd(n - 1) }\n// odd.js\nimport { isEven } from './even.js'\nexport function isOdd(n) { return n === 0 ? false : isEven(n - 1) }\n// usage after load: isEven(4) === true`,
        explanation: [
          'The cyclic imports are only used at CALL time, not top level.',
          'By the time isEven runs, both modules are fully evaluated.',
          'ESM live bindings + deferred access make the cycle harmless.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Break a user.js ↔ post.js cycle caused by a shared `formatId` helper without using lazy imports.',
      hint: 'Extract the shared helper into its own module.',
      solution: {
        lang: 'js',
        code: `// shared.js\nexport const formatId = (id) => 'ID_' + id\n// user.js\nimport { formatId } from './shared.js'\nexport const makeUser = (id) => ({ id: formatId(id) })\n// post.js\nimport { formatId } from './shared.js'\nexport const makePost = (id) => ({ id: formatId(id) })`,
        explanation: [
          'The mutual dependency existed only because of the shared helper.',
          'Moving formatId to shared.js makes both depend on it and on nothing cyclic.',
          'The graph is now acyclic — the most robust fix.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A Pinia/store and an apiClient import each other. Break the cycle so the API client can still read the auth token.',
      hint: 'Defer the store import to call time inside the request function.',
      solution: {
        lang: 'js',
        code: `// apiClient.js — defer the store import\nexport async function request(url) {\n  const { useAuthStore } = await import('./authStore.js')\n  const token = useAuthStore().token\n  return fetch(url, { headers: { Authorization: 'Bearer ' + token } })\n}`,
        explanation: [
          'Top-level importing the store created the cycle and risked an uninitialized read.',
          'A dynamic import inside `request` defers resolution to call time, after both modules load.',
          'The token is read fresh on each request, avoiding stale/undefined values.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Circular dependencies cause some of the most baffling real-world bugs, and explaining them well proves you understand module evaluation at a deep level. It also signals architectural maturity, since cycles are usually a design smell you know how to refactor away.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and the typical undefined symptom. Product companies (Zoho, Flipkart, Razorpay) probe the ESM-vs-CJS behavior difference and how to fix cycles. FAANG-level interviews dig into link-before-evaluate, TDZ interaction, tree-shaking/build impact, and dependency-inversion solutions.',
    whatInterviewersExpect:
      'Define a cycle, explain partial initialization, contrast ESM (linked bindings, TDZ on early read, hoisted functions OK) with CJS (partial exports), and recommend the real fix — extract shared code or defer access — over fragile import reordering.',
  },
}

export default circularDependencies
