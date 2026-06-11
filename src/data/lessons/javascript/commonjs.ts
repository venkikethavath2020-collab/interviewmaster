import type { ConceptLesson } from '../../../types/lesson'

const commonjs: ConceptLesson = {
  // 1. Concept Summary
  slug: 'commonjs',
  name: 'CommonJS',
  category: 'modules',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'CommonJS (require/module.exports) is the module system Node.js was built on and that still powers a huge share of the npm ecosystem and existing codebases.',
    'Understanding it is essential for debugging interop issues between CJS and ES Modules — the single most common build/runtime headache in modern JavaScript.',
    'Its synchronous, runtime, value-copy semantics differ fundamentally from ESM\'s static, hoisted, live-binding model, and those differences cause real bugs (circular dependencies, default-export confusion).',
    'Interviewers ask it to test whether you understand how modules actually load, cache, and resolve — not just the syntax.',
    'Knowing the module wrapper, caching, and resolution algorithm explains exports, __dirname, singletons, and why deleting require.cache matters.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'CommonJS is asking a librarian to fetch one specific book and wait while they walk to the shelf and hand it to you.',
    story: [
      'Imagine you need a book from the library, so you ask the librarian by its exact title.',
      'The librarian walks off, finds it, and you wait right there until they come back and hand it to you — you do not move on until you have the book in your hands.',
      'If a friend later asks for the same book, the librarian just hands over the same copy they already fetched instead of walking all the way back.',
      'CommonJS works like that: require asks for a module by name, waits while it is loaded, and remembers it so the next request gets the same copy instantly.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Big programs are split into separate files called modules so each does one job and can be reused.',
    'In CommonJS, a file shares things by putting them on module.exports, and another file gets them by calling require with the file name.',
    'When you require a file, the program stops and runs that whole file right then, then gives you whatever it exported.',
    'The program also remembers each module after loading it once, so requiring the same file again does not run it a second time — it reuses the saved result.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'CommonJS is the module format used by Node.js by default for .js/.cjs files. A module exposes values via module.exports (or the exports shortcut) and imports them with the synchronous require() function. Each file is its own module scope.',
    how: 'require(id) resolves the path, loads and synchronously executes the module the first time (caching the result), and returns module.exports. You assign exports: module.exports = something or exports.name = value. Special variables module, exports, require, __dirname, __filename are injected.',
    why: 'It gave Node a simple, synchronous way to compose programs from files before ES Modules existed, with a caching/singleton model and a well-defined resolution algorithm that npm relies on.',
    code: {
      label: 'Export and require',
      lang: 'js',
      code: `// math.js\nfunction add(a, b) { return a + b }\nconst PI = 3.14159\nmodule.exports = { add, PI } // export an object\n\n// app.js\nconst math = require('./math') // synchronous load + cache\nconsole.log(math.add(2, 3)) // 5\nconsole.log(math.PI)        // 3.14159\n\n// or destructure\nconst { add } = require('./math')`,
      explanation: [
        'math.js attaches an object with add and PI to module.exports.',
        'require("./math") loads and runs math.js once, then returns that exports object.',
        'app.js uses the returned value like any object; the path is relative.',
        'Requiring math again anywhere returns the SAME cached exports object — not a re-run.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'CommonJS is a synchronous, runtime module system in which each file is wrapped in a function that receives (exports, require, module, __dirname, __filename), giving it a private scope. require(id) resolves the identifier via Node\'s resolution algorithm (core module, relative/absolute path with extension and index resolution, or node_modules lookup walking up directories), then, on first load, executes the module synchronously and caches module.exports in require.cache keyed by resolved filename; subsequent requires return the cached export. Exports are a snapshot of the value of module.exports at the moment require returns (value copy of the reference), in contrast to ESM\'s static, hoisted live bindings. exports is merely an alias for module.exports and reassigning it breaks the link.',

  // 7. Internal Working
  internalWorking: [
    'When require(id) is called, Node resolves id to an absolute filename: core modules win first, then relative/absolute paths (trying .js/.json/.node and index files), then a node_modules walk up the directory tree.',
    'If the resolved module is already in require.cache, its cached module.exports is returned immediately (the caching/singleton behavior).',
    'Otherwise Node creates a module object { exports: {}, id, loaded: false, ... }, inserts it into the cache BEFORE execution (so circular requires can see a partial exports), and reads the file.',
    'Node wraps the source in a function: (function (exports, require, module, __dirname, __filename) { ...code... }) and invokes it, so module-level code runs synchronously and top-level vars stay private.',
    'Whatever the code assigns to module.exports becomes the module\'s public value; require returns that. The exports parameter starts as an alias of module.exports, so exports.foo = ... works, but exports = ... rebinds the local only and is lost.',
    'After execution module.loaded becomes true. Because the exports value was copied by reference at return time, importers do NOT get live updates to re-assigned primitives the way ESM live bindings would.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   require('./math')
        │
        ├─ 1. RESOLVE id -> /abs/path/math.js
        │        (core? relative? node_modules walk-up?)
        │
        ├─ 2. in require.cache?  ── yes ──► return cached module.exports
        │            │ no
        │            ▼
        ├─ 3. create module = { exports: {} }; CACHE it (pre-exec)
        │
        ├─ 4. wrap & run:
        │     (function(exports, require, module, __dirname, __filename){
        │         ... math.js code, assigns module.exports ...
        │     })
        │
        └─ 5. return module.exports  (value of the reference now)

   exports ──alias──► module.exports   (reassigning exports breaks it)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'require.cache is a heap object mapping resolved filenames to module objects; each module.exports is a heap value kept alive as long as the cache holds it.',
    'Because modules are cached, a module that creates state (a connection pool, a counter) acts as a singleton shared by every requirer — the same object reference.',
    'The module wrapper gives each file its own function scope on the stack during execution; top-level declarations are locals, not globals.',
    'Deleting require.cache[id] lets the module be re-loaded (and its old exports garbage-collected if nothing else references them) — used in dev hot-reload and tests.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — exports alias vs module.exports',
      lang: 'js',
      code: `// good: add properties to the exports alias\nexports.add = (a, b) => a + b\nexports.sub = (a, b) => a - b\n\n// also good: replace the whole export\n// module.exports = { add, sub }\n\n// BAD: reassigning the alias breaks the link\n// exports = { add } // <-- importer gets {} not { add }`,
      explanation: [
        'exports starts as an alias of module.exports, so exports.add = ... mutates the shared object.',
        'Setting module.exports = {...} replaces the entire public value (common for single-export modules).',
        'Reassigning exports itself (exports = ...) only changes the local variable and is lost — a classic bug.',
        'Rule of thumb: add properties via exports.x, or replace wholesale via module.exports.',
      ],
    },
    intermediate: {
      label: 'Intermediate — caching makes a singleton',
      lang: 'js',
      code: `// counter.js\nlet count = 0\nmodule.exports = {\n  inc() { return ++count },\n  get() { return count },\n}\n\n// a.js\nconst c1 = require('./counter')\nc1.inc() // 1\n\n// b.js\nconst c2 = require('./counter')\nconsole.log(c2.get()) // 1  -> SAME instance as a.js (cached)`,
      explanation: [
        'counter.js runs only once; its module.exports is cached.',
        'Both a.js and b.js receive the SAME exports object reference.',
        'So state (count) is shared — CommonJS modules are de-facto singletons.',
        'This is how config, DB pools, and loggers are shared across a Node app.',
      ],
    },
    advanced: {
      label: 'Advanced — circular dependency and partial exports',
      lang: 'js',
      code: `// a.js\nconsole.log('a start')\nconst b = require('./b') // triggers b.js\nconsole.log('in a, b.value =', b.value)\nmodule.exports = { name: 'a' }\n\n// b.js\nconsole.log('b start')\nconst a = require('./a') // a is mid-execution -> partial exports!\nconsole.log('in b, a.name =', a.name) // undefined (not assigned yet)\nmodule.exports = { value: 42 }`,
      explanation: [
        'When a requires b, b then requires a, but a has not finished — its module.exports is still {}.',
        'So in b, a.name is undefined; b proceeds with a PARTIAL view of a.',
        'CommonJS handles cycles by returning whatever is on module.exports so far (cached pre-execution).',
        'The fix is to require lazily (inside functions) or restructure to remove the cycle.',
      ],
    },
    realProject: {
      label: 'Real project — Express app and config in Node',
      lang: 'js',
      code: `// config.js — loaded once, shared everywhere (singleton)\nmodule.exports = {\n  port: process.env.PORT || 3000,\n  dbUrl: process.env.DB_URL,\n}\n\n// db.js — a shared connection created once\nconst { dbUrl } = require('./config')\nconst pool = createPool(dbUrl)\nmodule.exports = pool\n\n// server.js\nconst express = require('express') // node_modules lookup\nconst config = require('./config')\nconst pool = require('./db')        // SAME pool everywhere\nconst app = express()\napp.listen(config.port)`,
      explanation: [
        'require("express") triggers the node_modules resolution walk-up.',
        'config and db are loaded once and cached, so every module shares the same config object and DB pool.',
        'This caching is exactly why a connection pool defined in a module behaves as an app-wide singleton.',
        'It is the idiomatic Node composition pattern that ESM mirrors with import.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you export and import in CommonJS?',
      answer: 'Export by assigning to module.exports (or adding properties to the exports alias); import with const x = require("./path"). require is synchronous and returns the module.exports value.',
      explanation: 'Foundational syntax; mentioning synchronous + returns module.exports shows depth.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between module.exports and exports?',
      answer: 'exports is just a reference (alias) to module.exports initially. Adding properties (exports.foo) works, but reassigning exports = {...} breaks the link — only module.exports is actually returned by require.',
      explanation: 'The alias gotcha is one of the most common CJS interview questions.',
    },
    {
      level: 'intermediate',
      question: 'What happens the second time you require the same module?',
      answer: 'Nothing re-runs — require returns the cached module.exports from require.cache. Modules execute only once, which makes them effective singletons sharing state.',
      explanation: 'Caching/singleton behavior is central to how Node apps share config/connections.',
    },
    {
      level: 'intermediate',
      question: 'How does Node resolve a require() identifier?',
      answer: 'Core modules first (e.g. "fs"); then relative/absolute paths trying extensions (.js/.json/.node) and index files; otherwise a node_modules lookup walking up parent directories until found, honoring package.json main/exports fields.',
      explanation: 'Tests understanding of the resolution algorithm, not just syntax.',
    },
    {
      level: 'advanced',
      question: 'How do CommonJS and ES Modules differ, and why do circular dependencies behave differently?',
      answer: 'CJS is synchronous, runtime, value-copy (exports snapshot) with require returning the current module.exports; ESM is static, hoisted, asynchronous-capable with live bindings resolved at parse time. In cycles, CJS returns a partial exports object (whatever ran so far), while ESM links bindings up front so they fill in once evaluated — handling cycles more gracefully for hoisted declarations.',
      explanation: 'Senior-leaning: the live-binding vs value-copy distinction and its effect on cycles.',
    },
    {
      level: 'senior',
      question: 'How do you interoperate between CommonJS and ESM in a modern Node project?',
      answer: 'ESM can import CJS (default import gives module.exports; named imports are statically analyzed where possible). CJS cannot require() an ESM module synchronously — it must use dynamic import(). package.json "type", the .mjs/.cjs extensions, and the "exports" field control which loader is used. Bundlers add interop helpers (esModuleInterop) to bridge default/named export shapes.',
      explanation: 'Senior signal: real-world interop rules, dynamic import requirement, and package.json controls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What variables are injected into a CommonJS module? (exports, require, module, __dirname, __filename)',
    'How do you clear or inspect the module cache? (require.cache, delete require.cache[id])',
    'Why is require synchronous and what limitation does that impose?',
    'What does package.json "main" vs "exports" vs "type" control?',
    'How do you import an ESM-only package from CommonJS code?',
    'What is the module wrapper function and why does it exist?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Reassigning exports (exports = {...}) and expecting it to export.',
      why: 'exports is only an alias; reassigning it detaches from module.exports, which is what require actually returns.',
      fix: 'Use module.exports = {...} to replace, or exports.name = value to add properties.',
    },
    {
      mistake: 'Mixing require and import in the same file or assuming they are interchangeable.',
      why: 'CJS and ESM have different loaders, timing, and binding semantics; you cannot require() an ESM module synchronously.',
      fix: 'Pick one format per file (per package.json type/extension); use dynamic import() to load ESM from CJS.',
    },
    {
      mistake: 'Assuming a re-required module re-runs its top-level code.',
      why: 'Modules are cached after first load; the code runs once and subsequent requires reuse the export.',
      fix: 'Rely on the singleton behavior intentionally, or delete require.cache[id] when you truly need a reload.',
    },
    {
      mistake: 'Reading a value from a partially-loaded module in a circular dependency.',
      why: 'During a cycle, require returns the in-progress module.exports, which may be incomplete.',
      fix: 'Require lazily inside functions, export functions instead of values, or break the cycle.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'The default module system for most existing Node code and a large share of npm; core modules (fs, path, http) and countless packages are CJS. require.cache underpins config/logger/DB-pool singletons.' },
    { area: 'Backend', detail: 'Express/Koa apps, CLIs, and serverless functions historically use require; tooling (Jest, ESLint configs, webpack configs) commonly run as CommonJS even in ESM projects.' },
    { area: 'Vue', detail: 'Build tooling and config files (older vue.config.js, postcss/tailwind configs) are CommonJS; bundlers transpile/interop CJS dependencies for the browser bundle since browsers do not run CJS natively.' },
    { area: 'React', detail: 'Many published libraries still ship CJS builds; bundlers (webpack/Vite via Rollup) consume them with interop, while app source is typically authored in ESM/JSX.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Caching means each module runs once, so repeated requires are cheap object lookups.',
      'Synchronous loading is simple and fast on the server where files are local on disk.',
    ],
    bad: [
      'Synchronous require blocks the event loop during load — many large requires at startup slow boot.',
      'No static analysis means weaker tree-shaking than ESM, producing larger bundles for the browser.',
    ],
    optimizations: [
      'Lazy-require heavy modules inside the function that needs them to defer cost and aid startup.',
      'Prefer ESM for browser bundles to enable tree-shaking; reserve CJS for Node tooling/legacy.',
      'Avoid deep/expensive top-level work in modules since it runs on first require.',
      'Use the package.json exports field to expose precise entry points and reduce accidental deep imports.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Dynamic require with a user-controlled path can load unintended files (path traversal / arbitrary module loading).',
      'Supply-chain risk: a required dependency runs its top-level code on load, so a malicious package executes immediately.',
      'Monkey-patching the shared module cache can alter behavior of other modules globally.',
    ],
    bestPractices: [
      'Never pass untrusted input into require(); use an allow-list/static mapping for dynamic loading.',
      'Audit and pin dependencies (lockfiles, npm audit) since require executes their code at load time.',
      'Avoid mutating require.cache in production; treat the cache/singletons as immutable shared state.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['function-declaration-vs-expression', 'scope', 'object-creation'],
    nextConcepts: ['es-modules', 'esm-vs-cjs', 'dynamic-imports', 'circular-dependencies', 'bundlers-module-resolution'],
    dependencyNote:
      'CommonJS builds on function scope and objects (the module wrapper and module.exports); it pairs directly with ES Modules and the ESM-vs-CJS comparison, and leads into dynamic imports, circular dependencies, and how bundlers resolve modules.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write require("./math") and draw the resolve step (core? relative? node_modules walk-up).',
      'Draw the require.cache box and show the cache check returning early on the second require.',
      'Show the module wrapper function with its five injected params (exports, require, module, __dirname, __filename).',
      'Point out exports is an alias of module.exports; reassigning exports breaks the link.',
      'Note module runs ONCE and the exports is a value snapshot (not live like ESM).',
      'Conclude: synchronous, cached singleton, runtime resolution — contrast with static, live-binding ESM.',
    ],
    diagram: `   require(id) -> RESOLVE -> in cache? --yes--> return module.exports
                                  | no
                                  v
        module={exports:{}} ; CACHE it (before run)
        (function(exports, require, module, __dirname, __filename){
            ...runs ONCE...  module.exports = X
        })
                                  v
                         return module.exports  (value snapshot)
   exports --alias--> module.exports   (exports = {} breaks it)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'CommonJS is Node\'s default, synchronous, runtime module system: export via module.exports, import via require(). Each file is wrapped in a function with exports, require, module, __dirname, __filename. require resolves the id (core, relative path, or node_modules walk-up), runs the module once, caches module.exports, and returns it — so modules are effective singletons. exports is just an alias; reassigning it breaks the link. Unlike ESM (static, hoisted, live bindings), CJS returns a value snapshot, which is why circular deps yield partial exports. Interop: CJS cannot synchronously require ESM — use dynamic import().',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'CommonJS is the module system Node.js was built on, and it is synchronous and runtime-based. A module exposes values by assigning to module.exports, and another file imports them by calling require, which returns whatever module.exports holds. Under the hood, Node wraps every file in a function that receives five things — exports, require, module, __dirname, and __filename — which is how each file gets its own private scope and those magic variables. When I call require with an id, Node resolves it: core modules like fs win first, then relative or absolute paths trying extensions and index files, and otherwise it walks up node_modules directories honoring the package.json main and exports fields. The first time a module loads, Node runs it once, synchronously, and caches the resulting module.exports in require.cache; every later require of the same module returns that cached object without re-running it. That caching is why CommonJS modules behave as singletons — a config object or a database pool defined in a module is shared everywhere. A classic gotcha is that exports is only an alias of module.exports, so adding properties works but reassigning exports itself breaks the link. The key contrast with ES Modules is that CommonJS gives you a value snapshot of the exports at require time, whereas ESM uses static, hoisted live bindings resolved before execution. That difference shows up in circular dependencies, where CommonJS returns a partial exports object. And for interop, CommonJS cannot synchronously require an ESM-only package — you have to use dynamic import — while package.json type and the .mjs/.cjs extensions decide which loader runs.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Synchronous simplicity and dynamic require are flexible but block the loop and prevent static analysis/tree-shaking.',
      'Singleton caching is convenient for shared state but creates hidden global coupling and makes testing/mocking harder.',
      'Value-snapshot exports are predictable but lack ESM\'s live bindings, complicating some cyclic and re-export patterns.',
    ],
    edgeCases: [
      'Circular dependencies return a partial module.exports; order of assignment matters.',
      'Reassigning exports vs module.exports silently changes behavior.',
      'Deleting require.cache mid-run can desynchronize singletons relied on elsewhere.',
      'Dynamic require with a computed path defeats static tooling and bundler analysis.',
    ],
    runtimeBehavior: [
      'Modules execute exactly once on first require; the cache is keyed by resolved absolute filename.',
      'The cache entry is inserted before execution so cycles can observe a partial export.',
      'require is fully synchronous, so module top-level code runs to completion before returning.',
    ],
    scalability: [
      'Heavy top-level work across many modules inflates cold-start/boot time (important for serverless).',
      'For browser delivery, CJS bundles tree-shake poorly; migrating hot paths to ESM reduces bundle size.',
    ],
    productionConcerns: [
      'Audit dependencies because require runs their top-level code on load (supply-chain risk).',
      'Never require untrusted paths; use an allow-list to avoid arbitrary module loading.',
      'Plan CJS/ESM interop deliberately via package.json exports/type to avoid dual-package hazards.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Export: module.exports = X or exports.name = value.',
    'Import: const x = require("./path") (synchronous).',
    'exports is an alias; reassigning exports breaks it.',
    'Modules run ONCE, then cached in require.cache (singletons).',
    'Injected: exports, require, module, __dirname, __filename.',
    'Resolution: core -> relative/abs (ext + index) -> node_modules walk-up.',
    'Exports are a VALUE snapshot (not live bindings like ESM).',
    'Circular deps yield a partial exports object.',
    'CJS cannot synchronously require ESM -> use dynamic import().',
    'package.json type/.cjs/.mjs choose the loader.',
    'delete require.cache[id] to force a reload (dev/tests).',
    'Synchronous load blocks the event loop at startup.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a logger.js module that exports a log(msg) function, and use it from app.js.',
      hint: 'Attach to module.exports; require with a relative path.',
      solution: {
        lang: 'js',
        code: `// logger.js\nmodule.exports = {\n  log(msg) { console.log('[LOG]', msg) },\n}\n\n// app.js\nconst logger = require('./logger')\nlogger.log('started') // [LOG] started`,
        explanation: [
          'logger.js exports an object with a log method.',
          'app.js requires it by relative path and calls the method.',
          'The module loads once and is cached for any other requirer.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate that two requires of the same counter module share state (singleton).',
      hint: 'Mutate state through one require, observe it through another.',
      solution: {
        lang: 'js',
        code: `// counter.js\nlet n = 0\nmodule.exports = { inc: () => ++n, value: () => n }\n\n// demo.js\nconst c1 = require('./counter')\nconst c2 = require('./counter')\nc1.inc()\nc1.inc()\nconsole.log(c2.value()) // 2 -> same cached module`,
        explanation: [
          'counter.js runs once; its exports object is cached.',
          'c1 and c2 are the SAME reference from require.cache.',
          'Incrementing via c1 is visible via c2, proving the singleton behavior.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show the exports-alias bug: write a module that fails to export because it reassigns exports, then fix it.',
      hint: 'Reassigning exports detaches it from module.exports.',
      solution: {
        lang: 'js',
        code: `// broken.js\nexports = { greet: () => 'hi' } // BUG: detaches alias\n// require('./broken') -> {}  (empty)\n\n// fixed.js (option A)\nmodule.exports = { greet: () => 'hi' }\n// fixed.js (option B)\nexports.greet = () => 'hi'`,
        explanation: [
          'Reassigning exports only changes the local variable, not module.exports, so require returns the original empty object.',
          'Option A replaces module.exports directly — the value require returns.',
          'Option B mutates the existing exports object (still the same reference as module.exports), which works.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate how a circular dependency resolves, and refactor to avoid the partial-export problem.',
      hint: 'Require lazily inside a function instead of at the top level.',
      solution: {
        lang: 'js',
        code: `// even.js\nmodule.exports = (n) => n === 0 ? true : require('./odd')(n - 1)\n// odd.js\nmodule.exports = (n) => n === 0 ? false : require('./even')(n - 1)\n\nconst isEven = require('./even')\nconsole.log(isEven(4)) // true\n// Works because each require('./other') runs at CALL time,\n// by which point the other module has finished exporting.`,
        explanation: [
          'Requiring at the TOP level during a cycle would give a partial (empty) export.',
          'Requiring inside the exported function defers the lookup until call time, when both modules are fully loaded and cached.',
          'Lazy require is the standard CommonJS technique to make mutual dependencies work correctly.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'CommonJS still runs an enormous amount of production Node code and npm packages. Understanding its caching, resolution, and value-snapshot semantics is what lets you debug module interop, circular-dependency bugs, and singleton behavior — the practical issues that trip up real teams.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the require/module.exports syntax and the exports-vs-module.exports difference. Product companies (Zoho, Flipkart, Razorpay) ask about caching/singletons, resolution, and circular dependencies. FAANG-level interviews probe CJS-vs-ESM semantics, live bindings vs value snapshots, and CJS/ESM interop rules.',
    whatInterviewersExpect:
      'They expect you to explain the synchronous require/cache/resolve flow, the module wrapper and injected variables, the exports alias pitfall, the singleton effect of caching, and how CommonJS differs from and interoperates with ES Modules.',
  },
}

export default commonjs
