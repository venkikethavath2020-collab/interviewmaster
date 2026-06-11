import type { ConceptLesson } from '../../../types/lesson'

const esmVsCjs: ConceptLesson = {
  // 1. Concept Summary
  slug: 'esm-vs-cjs',
  name: 'ESM vs CJS',
  category: 'modules',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript has two module systems living side by side — ES Modules (ESM) and CommonJS (CJS) — and the Node ecosystem is mid-migration, so interop bugs are everywhere.',
    'The infamous "Error [ERR_REQUIRE_ESM]: require() of ES Module not supported" and "Cannot use import statement outside a module" come straight from misunderstanding this split.',
    'They differ in loading (sync vs async), binding semantics (value copy vs live binding), timing (runtime vs static), and the magic variables each provides (`require`/`module.exports` vs `import`/`export`).',
    'Choosing wrong affects tree shaking, bundle size, and whether your library is usable by both worlds (the "dual package" problem).',
    'Interviewers use this to test depth: anyone can write `import`, but explaining WHY `require` is synchronous and ESM is not separates senior candidates.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'CJS is photocopying a page; ESM is sharing a live link to a document.',
    story: [
      'Imagine your friend writes a list of today\'s lunch menu on a whiteboard.',
      'With CommonJS, you walk over and PHOTOCOPY the whiteboard. If your friend later erases "pizza" and writes "pasta", your photocopy still says pizza — it never updates.',
      'With ES Modules, instead of copying you just keep a window pointing at the real whiteboard. When your friend changes pizza to pasta, you look up and instantly see pasta — it is live.',
      'Also, CommonJS goes and fetches each page one at a time, right when you ask. ES Modules read the whole list of pages first, plan everything, then fill them in. Two different ways of sharing, and they don\'t always mix nicely.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Older Node.js code shares functions using `require()` to get them and `module.exports` to give them away — this style is called CommonJS (CJS).',
    'Newer standardized code uses `import` and `export` instead — this is ES Modules (ESM), the official language feature.',
    'CommonJS loads files one-by-one while the program runs and copies the value you ask for. ES Modules read all the connections up front and keep a live link to the original value.',
    'Because they work so differently, mixing the two in one project takes extra care, which is why understanding the difference matters.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'CommonJS (CJS) is Node\'s original module system using `require()` and `module.exports`; ES Modules (ESM) is the language standard using `import`/`export`. They differ in syntax, load timing, and binding semantics.',
    how: 'CJS resolves `require()` synchronously at runtime and returns a copy of `module.exports` at that moment. ESM resolves a static import graph before execution and links live, read-only bindings to the exports. Node decides which mode a file uses based on extension (`.cjs`/`.mjs`) or the package.json `"type"` field.',
    why: 'You need to know both because the npm ecosystem still ships huge amounts of CJS while new code and tooling are ESM — interop choices affect compatibility, tree shaking, and bundle size.',
    code: {
      label: 'Same module, two syntaxes',
      lang: 'js',
      code: `// CommonJS — math.cjs\nfunction add(a, b) { return a + b }\nmodule.exports = { add }\n// consumer\nconst { add } = require('./math.cjs')\nconsole.log(add(2, 3)) // 5\n\n// ES Module — math.mjs\nexport function add(a, b) { return a + b }\n// consumer\nimport { add } from './math.mjs'\nconsole.log(add(2, 3)) // 5`,
      explanation: [
        'CJS exposes values by assigning to `module.exports` and pulls them in with `require()` (a function call).',
        'ESM uses the `export` keyword and the `import` statement, which are language syntax, not function calls.',
        '`require()` returns a copied object at the moment it runs; `import` links a live binding resolved before run.',
        'File extensions (`.cjs` vs `.mjs`) tell Node unambiguously which system to use.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'CommonJS is a runtime, synchronous module system in which `require()` resolves and executes a module on demand and returns the current value of its `module.exports`, copying primitive bindings by value. ES Modules are a statically analyzable system whose import/export graph is constructed and instantiated before evaluation, exposing live, read-only bindings to exports. CJS modules are wrapped in a function providing `module`, `exports`, `require`, `__dirname`, and `__filename`; ESM has none of these and instead offers `import.meta` and top-level await, runs in strict mode with its own scope, and is evaluated in dependency order. Node selects the mode per file via extension (`.cjs`/`.mjs`) or the nearest package.json `"type"` field, and constrains interop: ESM can `import` CJS (with caveats about named exports), while CJS can only load ESM via dynamic `import()`.',

  // 7. Internal Working
  internalWorking: [
    'CJS LOADING: when `require(id)` runs, Node resolves the path, checks the module cache, and if absent wraps the file source in a function `(exports, require, module, __dirname, __filename) => { ... }`, executes it synchronously, then caches and returns `module.exports`.',
    'CJS BINDING: the returned reference is `module.exports` at call time; destructured primitives are copies, so later reassignment inside the module is NOT seen by earlier consumers.',
    'ESM LOADING: the host parses the entry, statically extracts imports, recursively fetches/parses the whole graph (construction), then links export slots to import bindings (instantiation) before any body runs.',
    'ESM EVALUATION: module bodies run once, depth-first, in dependency order; imports are live read-only views of the exporter\'s binding, so later reassignment by the exporter is visible.',
    'MODE SELECTION: Node treats `.mjs` as ESM, `.cjs` as CJS, and `.js` according to the nearest package.json `"type"` (`module` → ESM, default/`commonjs` → CJS).',
    'INTEROP: ESM importing CJS gets `module.exports` as the default export and Node attempts to expose detectable named exports; CJS cannot `require()` ESM (async graph) and must use dynamic `import()` which returns a promise.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        CommonJS (CJS)                 ES Modules (ESM)
  ┌───────────────────────┐      ┌───────────────────────────┐
  │ require('./m')        │      │ import { x } from './m'    │
  │   ▼ runtime, SYNC     │      │   ▼ static, resolved first  │
  │ wrap(exports,require, │      │ phases:                     │
  │      module,__dirname)│      │  construct→instantiate→eval │
  │   ▼ run, cache        │      │   ▼ LINK live bindings      │
  │ returns COPY of       │      │ x = LIVE read-only view of  │
  │ module.exports value  │      │ exporter's binding          │
  └───────────────────────┘      └───────────────────────────┘
   has __dirname/__filename        has import.meta + top-level await
   can't require() ESM ──use──►    import() returns a promise`,

  // 9. Memory Visualization
  memoryVisualization: [
    'CJS CACHE: `require.cache` holds one `module` object per resolved path; the same require returns the identical cached `module.exports` object (singleton), but destructured primitives are independent copies on the consumer side.',
    'ESM RECORDS: each module has a Module Environment Record on the heap holding its export slots; importers store references (pointers) to those slots, not copies — so the value lives once and is shared live.',
    'COPY vs LINK: in CJS, `const { count } = require(...)` copies the number into the consumer\'s scope; in ESM, `import { count }` keeps a pointer to the exporter\'s `count` binding.',
    'DUAL INSTANCE RISK: loading the same package as both CJS and ESM creates two separate module records in memory, so module-level state (caches, singletons) is duplicated and can diverge.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — export/import shapes side by side',
      lang: 'js',
      code: `// CJS export styles\nmodule.exports = function () {}        // whole-module export\nmodule.exports.helper = () => {}       // attach a named-ish export\nexports.foo = 1                        // shorthand for module.exports.foo\n\n// ESM export styles\nexport default function () {}          // default\nexport const helper = () => {}         // named\nexport { foo }                         // named (existing binding)`,
      explanation: [
        'In CJS everything hangs off the single `module.exports` object (or its `exports` alias).',
        'Reassigning `exports = ...` (not `module.exports`) breaks the link — a classic CJS gotcha.',
        'ESM separates `default` and named exports as distinct language constructs.',
        'ESM names are static identifiers; CJS "names" are just object properties resolved at runtime.',
      ],
    },
    intermediate: {
      label: 'Intermediate — copy vs live binding behavior',
      lang: 'js',
      code: `// --- CJS: counter.cjs ---\nlet count = 0\nfunction inc() { count++ }\nmodule.exports = { count, inc } // count copied into the export object NOW\n// consumer.cjs\nconst m = require('./counter.cjs')\nm.inc()\nconsole.log(m.count) // 0  ← stale! the exported 'count' was a snapshot\n\n// --- ESM: counter.mjs ---\nexport let count = 0\nexport function inc() { count++ }\n// consumer.mjs\nimport { count, inc } from './counter.mjs'\ninc()\nconsole.log(count) // 1  ← live binding reflects the update`,
      explanation: [
        'In CJS, `{ count, inc }` captured `count`\'s value (0) at export time, so mutating the internal `count` does not update the exported property.',
        'In ESM, `count` is a live binding, so the consumer sees `1` after `inc()`.',
        'This is the single biggest semantic difference and a favorite interview trap.',
        'To get live-ish behavior in CJS you must export getters or the whole mutable object, not destructured primitives.',
      ],
    },
    advanced: {
      label: 'Advanced — interop: ESM importing CJS and CJS loading ESM',
      lang: 'js',
      code: `// ESM importing a CJS package\nimport pkg from 'legacy-cjs-lib'      // CJS module.exports → default import\nconst { someNamed } = pkg            // safest: read named off the default\n// (Node may also expose detectable named exports, but it is best-effort)\n\n// CJS loading an ESM-only package — require() throws ERR_REQUIRE_ESM\n// must use dynamic import (async):\nasync function load() {\n  const esm = await import('esm-only-lib')\n  esm.doThing()\n}`,
      explanation: [
        'When ESM imports CJS, the whole `module.exports` becomes the default export; named imports work only if Node can statically detect them.',
        'The robust pattern is `import pkg from ...` then destructure off `pkg`.',
        'CJS cannot synchronously `require()` an ESM module because ESM loading is asynchronous — you get `ERR_REQUIRE_ESM`.',
        'The workaround is dynamic `import()`, which returns a promise and bridges CJS → ESM.',
        '(Recent Node versions add limited synchronous `require(esm)` for graphs without top-level await, but dynamic import remains the portable choice.)',
      ],
    },
    realProject: {
      label: 'Real project — shipping a dual-package npm library',
      lang: 'js',
      code: `// package.json of a library supporting both worlds\n{\n  "name": "my-lib",\n  "type": "module",\n  "main": "./dist/index.cjs",      // CJS consumers\n  "module": "./dist/index.mjs",     // bundlers prefer this\n  "exports": {\n    ".": {\n      "import": "./dist/index.mjs", // import / ESM\n      "require": "./dist/index.cjs"  // require / CJS\n    }\n  }\n}`,
      explanation: [
        'A dual package ships both an ESM build and a CJS build so any consumer can use it.',
        'The `exports` map\'s conditional keys (`import` vs `require`) route each consumer to the right file.',
        'Bundlers (Vite/Rollup/webpack) prefer the `module`/`import` entry to enable tree shaking.',
        'Beware the "dual package hazard": if both builds get loaded, module-level state (singletons, caches) exists twice — keep such state out of the package or share it via a single CJS core.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the syntactic difference between CJS and ESM exports/imports?',
      answer: 'CJS uses `module.exports = ...` / `require()`; ESM uses the `export` keyword and `import` statement. `require` is a function call resolved at runtime; `import`/`export` are static language syntax.',
      explanation: 'A good answer notes that ESM keywords are not functions and must sit at the top level.',
    },
    {
      level: 'beginner',
      question: 'How does Node decide whether a file is CJS or ESM?',
      answer: 'By extension (`.cjs` = CJS, `.mjs` = ESM) or, for `.js`, by the nearest package.json `"type"` field — `"module"` means ESM, otherwise CJS.',
      explanation: 'Interviewers want to see you know mode is per-file and configuration-driven, which causes many real-world errors.',
    },
    {
      level: 'intermediate',
      question: 'Why is `require()` synchronous but `import` (the static form) is not a runtime call?',
      answer: 'CJS executes modules on demand during runtime, blocking until the required file is loaded and run. ESM resolves and links the whole static graph before evaluation, which can be asynchronous (e.g. network fetch in browsers), so it cannot be expressed as a synchronous call.',
      explanation: 'This explains why CJS cannot `require()` an ESM module and must use dynamic `import()`.',
    },
    {
      level: 'intermediate',
      question: 'Explain the difference between a value copy and a live binding with an example.',
      answer: 'In CJS, destructuring a primitive off `require()` copies its current value, so later changes inside the module are invisible. In ESM, an imported name is a live read-only binding, so the consumer always sees the exporter\'s current value.',
      explanation: 'Demonstrating the counter example proves you understand the deepest semantic difference.',
    },
    {
      level: 'advanced',
      question: 'How do you load an ESM-only package from a CommonJS file?',
      answer: 'You cannot `require()` it (ERR_REQUIRE_ESM); you use dynamic `import()`, which returns a promise, inside an async function. Newer Node also allows `require()` of ESM that has no top-level await, but dynamic import is the portable approach.',
      explanation: 'Senior answers mention the async nature of ESM graphs as the root cause.',
    },
    {
      level: 'senior',
      question: 'What is the dual-package hazard and how do you mitigate it?',
      answer: 'If a library ships both ESM and CJS builds and an app ends up loading both, you get two separate module instances, so module-level singletons/caches duplicate and state diverges. Mitigate by keeping shared mutable state in a single CJS core that both wrappers import, or avoid module-level state entirely; use a proper `exports` map so only one build is selected.',
      explanation: 'This tests real packaging experience and understanding of module instance identity.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does reassigning `exports = {...}` (instead of `module.exports`) break a CJS module?',
    'What variables does CJS give you that ESM does not, and what are the ESM equivalents?',
    'How do circular dependencies behave differently in CJS vs ESM?',
    'Which module format tree-shakes better and why?',
    'What does the package.json `exports` field do and why prefer it over `main`/`module`?',
    'Can a single file use both `require` and `import`? Under what conditions?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling `require()` on an ESM-only package and expecting it to work.',
      why: 'ESM loading is asynchronous; synchronous `require()` cannot drive it, so Node throws ERR_REQUIRE_ESM.',
      fix: 'Use dynamic `import()` inside an async function, or migrate the consuming file to ESM.',
    },
    {
      mistake: 'Assuming destructured CJS imports update live like ESM.',
      why: 'CJS copies primitive values at require time; the exporter mutating its internal variable is invisible.',
      fix: 'Import the whole object and read its property each time, export getters, or switch to ESM for true live bindings.',
    },
    {
      mistake: 'Using `__dirname`/`__filename` in an ESM file.',
      why: 'Those CJS-only variables do not exist in ESM, causing ReferenceErrors.',
      fix: 'Use `import.meta.url` with `fileURLToPath` to derive directory/file paths in ESM.',
    },
    {
      mistake: 'Shipping a library as a dual package with module-level singleton state.',
      why: 'If both builds load, the singleton exists twice and state diverges (dual-package hazard).',
      fix: 'Keep shared state in one CJS core both wrappers import, or remove module-level mutable state; configure a clean `exports` map.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Backends choose a primary mode (`"type": "module"`) and bridge legacy CJS deps with dynamic `import()` or interop wrappers; tooling configs (`.eslintrc.cjs`) often stay CJS.' },
    { area: 'Vue', detail: 'Vite is ESM-first; Vue libraries publish ESM for tree shaking but ship a CJS build via `exports` so SSR/Node tooling that still uses `require` keeps working.' },
    { area: 'React', detail: 'Many React packages publish dual builds; bundlers pick the ESM (`module`/`import`) entry for tree shaking while older CJS toolchains fall back to the `require` build.' },
    { area: 'Backend', detail: 'Shared internal packages standardize on an `exports` map so service repos in different module modes can all consume them without ERR_REQUIRE_ESM surprises.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'ESM\'s static structure enables tree shaking, producing smaller production bundles.',
      'CJS synchronous loading is simple and fast for small server scripts where the whole graph is local on disk.',
    ],
    bad: [
      'CJS generally cannot be tree-shaken reliably, so bundlers may ship unused exports.',
      'Dual-package setups can double-load code and state, increasing memory and load time.',
    ],
    optimizations: [
      'Prefer ESM and named exports for app and library code to maximize tree shaking.',
      'Use the package.json `exports` map to serve one correct build per consumer and avoid duplicate instances.',
      'For CJS-heavy servers, lazy-load rarely used modules with `require()` only when needed.',
      'When bundling, configure the resolver to prefer the `module`/`import` field so ESM wins for optimization.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Both systems execute a module\'s top-level code on load, so a malicious dependency runs immediately (supply-chain risk) regardless of format.',
      'Dynamic specifiers (`require(userInput)` or `import(userInput)`) can load unintended modules or paths.',
    ],
    bestPractices: [
      'Audit and pin dependencies with lockfiles and integrity hashes since require/import both run code on load.',
      'Never construct module specifiers from unsanitized input; restrict to a known allowlist.',
      'Prefer ESM with an explicit `exports` map to limit a package\'s reachable internal files.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'commonjs', 'scope'],
    nextConcepts: ['dynamic-imports', 'tree-shaking', 'circular-dependencies', 'bundlers-module-resolution', 'top-level-await'],
    dependencyNote:
      'This comparison sits on top of knowing both es-modules and commonjs; once you understand the copy-vs-live and sync-vs-static differences, you can reason about dynamic imports, tree shaking, circular-dependency behavior, and how bundlers resolve and merge both formats.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Split the board in two: CJS on the left, ESM on the right.',
      'CJS: write `require()` + `module.exports`; label it "runtime, synchronous, returns a COPY".',
      'ESM: write `import`/`export`; label it "static, resolved first, LIVE binding".',
      'Under both write how Node picks: `.cjs`/`.mjs` or package.json `"type"`.',
      'Draw an arrow CJS→ESM labelled "only via dynamic import()" and ESM→CJS labelled "default import".',
      'Conclude: "ESM tree-shakes; CJS usually cannot — and watch the dual-package hazard".',
    ],
    diagram: `   CJS (left)            |   ESM (right)
   require()             |   import / export
   module.exports        |   export keyword
   SYNC, runtime         |   STATIC, pre-eval
   returns COPY (value)  |   LIVE read-only binding
   __dirname/__filename  |   import.meta + TLA
   can't require ESM ──► dynamic import() ──► ESM
   ESM import CJS ──► default = module.exports`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'CJS (`require`/`module.exports`) is Node\'s original runtime, synchronous module system that returns a value copy. ESM (`import`/`export`) is the language standard: static, resolved before execution, with live read-only bindings. Node picks the mode by extension (`.cjs`/`.mjs`) or package.json `"type"`. ESM can import CJS (whole exports as default); CJS must use dynamic `import()` to load ESM. ESM tree-shakes; CJS usually cannot. Watch for the dual-package hazard when shipping both.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'CommonJS and ES Modules are JavaScript\'s two module systems. CommonJS is Node\'s original format: you share values with `module.exports` and pull them in with `require()`, which is a function call that runs synchronously at runtime, executes the target module, and returns the current value of its exports. Crucially, destructured primitives are copies — if the module later mutates an internal variable, earlier consumers do not see it. ES Modules are the language standard using `import` and `export`. They are static: the engine resolves the entire dependency graph before execution, linking live, read-only bindings, so consumers always observe the exporter\'s current value. ESM also runs in strict mode with its own scope and offers `import.meta` and top-level await, while CJS gives you `require`, `module`, `exports`, `__dirname`, and `__filename`. Node decides the mode by extension — `.cjs` or `.mjs` — or by the nearest package.json `"type"` field for `.js` files. Interop is asymmetric: ESM can import CJS, getting `module.exports` as the default export; but CJS cannot synchronously `require()` ESM because ESM loading is asynchronous, so it must use dynamic `import()`. The practical payoffs: ESM\'s static structure enables tree shaking and smaller bundles, while CJS generally cannot be tree-shaken. The big trap when shipping libraries is the dual-package hazard, where loading both builds duplicates module-level state.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'ESM gives tree shaking and a clean static graph but forces async-friendly design and stricter interop; CJS is simpler and synchronous but opaque to bundlers.',
      'Dual packaging maximizes compatibility but risks duplicate instances; single-format simplifies but may exclude part of the ecosystem.',
    ],
    edgeCases: [
      'Circular deps: CJS returns a partially populated `module.exports` (whatever ran so far); ESM links bindings first so names exist but may read as uninitialized/undefined if accessed too early.',
      'CJS `exports = {...}` reassignment severs the reference and exports nothing — only `module.exports = ...` works.',
      'ESM importing CJS named exports relies on best-effort static detection (cjs-module-lexer) and can fail for computed exports.',
      'Newer Node permits synchronous `require()` of ESM without top-level await, blurring the old hard rule.',
    ],
    runtimeBehavior: [
      'CJS executes lazily on first `require` and caches the `module` object; repeated requires return the same instance.',
      'ESM evaluates once, depth-first, after a separate link phase; imports are pointers into the exporter\'s environment record.',
      'CJS interop in ESM wraps the CJS namespace; `default` always equals `module.exports`.',
    ],
    scalability: [
      'Large CJS server graphs load synchronously and can stall startup if files are slow to compile; ESM allows more parallel fetch in browsers.',
      'Mixed-format monorepos need consistent `exports` maps or you get instance duplication and split caches across services.',
    ],
    productionConcerns: [
      'ERR_REQUIRE_ESM and "Cannot use import outside a module" are common deploy-time failures — pin module mode explicitly per package.',
      'Transpilers (Babel/TS) emitting CJS interop helpers (`__esModule`, `interopRequireDefault`) can hide subtle default-export shape bugs.',
      'Dual-package hazard duplicates singletons (e.g. a shared event bus or DB pool) — keep such state in one core build.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'CJS: `require()` + `module.exports`; ESM: `import` + `export`.',
    'CJS = runtime + synchronous; ESM = static + resolved before eval.',
    'CJS returns a value COPY; ESM gives LIVE read-only bindings.',
    'Mode picked by `.cjs`/`.mjs` or package.json `"type"`.',
    'ESM has `import.meta` + top-level await; no `__dirname`/`__filename`.',
    'CJS has `__dirname`, `__filename`, `require`, `module`, `exports`.',
    'ESM can import CJS → whole `module.exports` is the default.',
    'CJS loads ESM only via dynamic `import()` (async, returns promise).',
    'ESM tree-shakes; CJS usually does not.',
    'Use the package.json `exports` map for dual packages.',
    'Dual-package hazard = duplicated module-level state.',
    'Reassign `module.exports`, never `exports`, in CJS.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this CJS module as ESM: `function greet(n){return "hi "+n} module.exports = { greet }` and import it.',
      hint: 'Replace module.exports with the export keyword and require with import.',
      solution: {
        lang: 'js',
        code: `// greet.mjs\nexport function greet(n) { return 'hi ' + n }\n// main.mjs\nimport { greet } from './greet.mjs'\nconsole.log(greet('Sam')) // hi Sam`,
        explanation: [
          'The named export replaces the `module.exports = { greet }` assignment.',
          'The `import` statement replaces the `require()` call and is resolved statically.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show that a CJS consumer of a counter does NOT see a live update, then explain how to make it observe the change.',
      hint: 'Destructuring copies primitives; reading off the object each time does not.',
      solution: {
        lang: 'js',
        code: `// counter.cjs\nlet count = 0\nmodule.exports = {\n  inc() { count++ },\n  get count() { return count } // getter exposes the live value\n}\n// consumer.cjs\nconst m = require('./counter.cjs')\nconsole.log(m.count) // 0\nm.inc()\nconsole.log(m.count) // 1 via getter\n// const { count } = m  // would copy 0 and stay stale`,
        explanation: [
          'A destructured primitive (`const { count } = m`) copies 0 and never updates.',
          'Exposing `count` via a getter makes each access recompute the current value, mimicking ESM live bindings.',
          'ESM would give this for free with `export let count`.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'You are in a CommonJS file and must use an ESM-only library `chalk`. Load it without converting your file to ESM.',
      hint: 'require() will throw; you need an async dynamic import.',
      solution: {
        lang: 'js',
        code: `// app.cjs\nasync function main() {\n  const { default: chalk } = await import('chalk') // ESM default\n  console.log(chalk.green('loaded ESM from CJS'))\n}\nmain()`,
        explanation: [
          '`require(\'chalk\')` would throw ERR_REQUIRE_ESM because ESM loads asynchronously.',
          'Dynamic `import()` returns a promise; awaiting it bridges CJS to ESM.',
          'The ESM default export is read as `.default` from the resolved namespace.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a package.json `exports` map so `import` consumers get index.mjs and `require` consumers get index.cjs, and explain the dual-package hazard it can still create.',
      hint: 'Use conditional exports with "import" and "require" keys.',
      solution: {
        lang: 'js',
        code: `{\n  "name": "my-lib",\n  "exports": {\n    ".": {\n      "import": "./dist/index.mjs",\n      "require": "./dist/index.cjs"\n    }\n  }\n}\n// HAZARD: if an app loads my-lib via both import and require,\n// two module instances exist → module-level singletons duplicate.\n// FIX: keep shared state in one ./dist/core.cjs both builds import.`,
        explanation: [
          'Conditional `import`/`require` keys route each consumer to the matching build.',
          'If both paths are reached in one app, the package is instantiated twice, splitting any module-level state.',
          'Centralizing mutable state in a single shared core file avoids the divergence.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Every Node project today straddles both module systems, and interop bugs (ERR_REQUIRE_ESM, stale CJS values, dual instances) are extremely common. Explaining the copy-vs-live and sync-vs-static differences precisely shows you understand modules at a level most candidates never reach.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the syntax difference and how Node picks the mode. Product companies (Zoho, Flipkart, Razorpay) probe copy-vs-live bindings and how to load ESM from CJS. FAANG-level interviews dig into the dual-package hazard, circular-dependency behavior, and the asynchronous ESM graph as the root cause of interop limits.',
    whatInterviewersExpect:
      'Contrast syntax, timing (runtime/sync vs static/pre-eval), and semantics (value copy vs live binding); explain mode selection; describe interop in both directions; and connect ESM\'s static structure to tree shaking and the dual-package hazard.',
  },
}

export default esmVsCjs
