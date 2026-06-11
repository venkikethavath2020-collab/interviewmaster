import type { ConceptLesson } from '../../../types/lesson'

const esModules: ConceptLesson = {
  // 1. Concept Summary
  slug: 'es-modules',
  name: 'ES Modules',
  category: 'modules',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'ES Modules (ESM) are the official, standardized module system of JavaScript — the language finally has built-in `import`/`export` instead of script tags and globals.',
    'Every modern tool — Vite, Rollup, webpack, Node 14+, the browser itself — speaks ESM natively, so understanding it is non-negotiable for shipping real apps.',
    'Without modules you fall back to global variables, name collisions, load-order bugs, and the inability to tree-shake dead code.',
    'ESM has unique semantics interviewers love to probe: it is static, hoisted, strict-mode-by-default, and bindings are live — not copies.',
    'The static structure of ESM is what makes tree shaking, code splitting, and top-level await possible at all.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'ES Modules are like labelled LEGO boxes that snap together.',
    story: [
      'Imagine you build with LEGO, but every brick you own is dumped into one giant messy pile on the floor. Finding the red 2x4 brick takes forever and someone might grab the one you needed.',
      'Now imagine instead you keep your bricks in separate labelled boxes: one box for wheels, one for windows, one for doors.',
      'When you want to build a car, you say "give me the wheels box and the doors box" and only those come out — the rest stay tidy in their own boxes.',
      'ES Modules let a program keep its code in separate labelled boxes (files). Each file says what it shares with `export`, and other files ask for exactly what they need with `import`. Nothing leaks onto the messy floor.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A big program is easier to manage when you split it into many small files, each doing one job.',
    'A module is one such file. It uses the word `export` to mark the things other files are allowed to use, and `import` to borrow things from other files.',
    'Because each file is its own little world, a variable named `total` in one file does not clash with `total` in another — they stay private unless exported.',
    'The browser and Node read these `import`/`export` statements before running anything, figure out which file depends on which, and load them in the right order automatically.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'ES Modules are the native JavaScript module system: each file is a module with its own scope, and you share values across files using `export` and pull them in with `import`.',
    how: 'You write `export` next to things you want to expose (named or default), and `import { thing } from \'./file.js\'` in the file that needs them. The engine parses all the import/export statements first (statically), builds a dependency graph, then runs the modules in order.',
    why: 'It replaces ad-hoc globals and `<script>` ordering with explicit, analyzable dependencies — giving you encapsulation, reusability, and the static structure tools need to optimize bundles.',
    code: {
      label: 'Named and default exports/imports',
      lang: 'js',
      code: `// math.js\nexport const PI = 3.14159          // named export\nexport function square(n) {        // named export\n  return n * n\n}\nexport default function add(a, b) {  // default export\n  return a + b\n}\n\n// main.js\nimport add, { PI, square } from './math.js'\nconsole.log(add(2, 3))  // 5\nconsole.log(square(4))  // 16\nconsole.log(PI)         // 3.14159`,
      explanation: [
        '`math.js` exposes three things: two named exports (`PI`, `square`) and one default export (`add`).',
        'In `main.js`, the default export is imported with any name you choose (`add`), no braces.',
        'Named exports are imported inside braces and must match the exported name (or be aliased with `as`).',
        'Anything NOT exported (e.g. a private helper) stays invisible to `main.js` — module scope gives privacy by default.',
        'The engine reads these statements before executing, so `import` is hoisted and order-independent.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'ES Modules are the ECMAScript standard module format defined by the language specification. Each module has its own top-level scope, executes in strict mode automatically, and declares a static dependency graph via `import`/`export` statements that must appear at the top level and are resolved before evaluation. Imports are live, read-only bindings to the exported variables (not value copies), so consumers always observe the current value. Module loading proceeds in three phases — construction (parse + resolve the graph), instantiation (allocate exports and wire up bindings), and evaluation (run module bodies once, in dependency order) — and each module is a singleton cached by its resolved specifier.',

  // 7. Internal Working
  internalWorking: [
    'CONSTRUCTION/PARSING: the host fetches the entry module, parses it, and extracts its `import`/`export` statements statically (they cannot be conditional), then recursively fetches and parses every dependency to build the full module graph.',
    'RESOLUTION: each import specifier (e.g. `./math.js`) is resolved to a unique module record; if the same specifier is imported many times it maps to ONE cached Module Record (singleton).',
    'INSTANTIATION (linking): the engine walks the graph and allocates a Module Environment Record for each module, creating the exported binding slots and wiring each import to point at the corresponding export slot — but bodies have NOT run yet.',
    'EVALUATION: modules are evaluated depth-first in dependency order; each module body runs exactly once and its export slots get their values. Imports are live bindings, so they reflect later reassignments of the exported variable.',
    'STRICT MODE + SCOPE: every module runs in strict mode and has its own lexical top-level scope, so `this` at top level is `undefined` and top-level `var` does not become a global.',
    'CACHING: subsequent imports of an already-evaluated module return the cached instance immediately without re-running its body, which is why module-level side effects happen only once.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  ENTRY: main.js
     │ import add from './math.js'
     │ import { format } from './util.js'
     ▼
  ┌───────────── MODULE GRAPH (static) ─────────────┐
  │                                                 │
  │   main.js                                       │
  │     ├──► math.js   (export default add)         │
  │     └──► util.js   ──► helpers.js               │
  │                                                 │
  └─────────────────────────────────────────────────┘
        │ 1. construct (parse + resolve)
        │ 2. instantiate (allocate + LINK bindings)
        │ 3. evaluate (run bodies once, in order)
        ▼
  main.js sees a LIVE binding to math's 'add'
  (not a copy — reassigning the export is visible)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — exporting and importing',
      lang: 'js',
      code: `// logger.js\nexport function log(msg) {\n  console.log('[LOG]', msg)\n}\n\n// app.js\nimport { log } from './logger.js'\nlog('app started') // [LOG] app started`,
      explanation: [
        '`logger.js` exports a single named function `log`.',
        '`app.js` imports it by name and calls it.',
        'Each file is its own scope — `logger.js` could have private variables that `app.js` never sees.',
        'In the browser this requires `<script type="module" src="app.js">`.',
      ],
    },
    intermediate: {
      label: 'Intermediate — live bindings, re-exports, aliasing',
      lang: 'js',
      code: `// counter.js\nexport let count = 0\nexport function inc() { count++ }\n\n// main.js\nimport { count, inc } from './counter.js'\nconsole.log(count) // 0\ninc()\nconsole.log(count) // 1  ← live binding, not a copy!\n\n// index.js — barrel / re-export\nexport { inc as increment } from './counter.js'\nexport * from './math.js'`,
      explanation: [
        'Imports are LIVE bindings: after `inc()` mutates `count` inside the module, `main.js` sees the updated `1`.',
        'You cannot reassign an imported binding from the consumer side — `count = 5` would throw (read-only).',
        '`export { x as y } from \'...\'` re-exports with a new name without importing it locally — the basis of barrel files.',
        '`export *` forwards all named exports of another module; great for a package public API surface.',
      ],
    },
    advanced: {
      label: 'Advanced — namespace import + tree-shakeable design',
      lang: 'js',
      code: `// shapes.js — many small named exports (tree-shakeable)\nexport const circleArea = (r) => Math.PI * r * r\nexport const squareArea = (s) => s * s\nexport const triangleArea = (b, h) => 0.5 * b * h\n\n// geometry.js\nimport * as shapes from './shapes.js'  // namespace object\nexport function totalArea(items) {\n  return items.reduce((sum, it) => sum + shapes[it.type + 'Area'](...it.dims), 0)\n}\n\n// If you only 'import { circleArea }' elsewhere, bundlers can drop the rest.`,
      explanation: [
        '`import * as shapes` creates a read-only namespace object exposing every named export.',
        'Many small named exports let a bundler perform tree shaking — unused exports are eliminated from the final bundle.',
        'Dynamic property access (`shapes[name]`) defeats static analysis, so the bundler must keep ALL of `shapes` — a real-world tree-shaking pitfall.',
        'Prefer direct named imports (`import { circleArea }`) in code you want fully tree-shaken.',
      ],
    },
    realProject: {
      label: 'Real project — Vue feature module with a barrel file',
      lang: 'js',
      code: `// features/cart/useCart.js  (a Vue composable)\nimport { ref, computed } from 'vue'\nconst items = ref([])\nexport function useCart() {\n  const total = computed(() => items.value.reduce((s, i) => s + i.price, 0))\n  const add = (item) => items.value.push(item)\n  return { items, total, add }\n}\n\n// features/cart/index.js  (barrel — public API of the feature)\nexport { useCart } from './useCart.js'\nexport { default as CartIcon } from './CartIcon.vue'\n\n// usage in a component\nimport { useCart, CartIcon } from '@/features/cart'`,
      explanation: [
        'Each Vue composable/component lives in its own ESM file with explicit exports.',
        'A barrel `index.js` re-exports the feature\'s public surface so consumers import from one clean path.',
        'The module-level `items` ref is a singleton (modules are cached) — every component using `useCart` shares the same cart state.',
        'Vite resolves `@/features/cart` to `index.js` and tree-shakes anything the app never imports.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a named export and a default export?',
      answer: 'A module can have many named exports (imported with braces and the exact name) but only one default export (imported without braces under any name you choose).',
      explanation: 'A solid answer notes that named exports aid tree shaking and discoverability, while a default export is convenient for a module that exposes one main thing.',
    },
    {
      level: 'beginner',
      question: 'How do you enable ES Modules in the browser and in Node?',
      answer: 'In the browser use `<script type="module">`. In Node, name the file `.mjs`, or set `"type": "module"` in package.json so `.js` files are treated as ESM.',
      explanation: 'Interviewers want to know you understand ESM is opt-in and differs from the default CommonJS in older Node setups.',
    },
    {
      level: 'intermediate',
      question: 'Are ES Module imports copies of values or live references?',
      answer: 'They are live, read-only bindings. If the exporting module reassigns an exported variable, importers see the new value; but importers cannot reassign the binding themselves.',
      explanation: 'This is a key ESM-vs-CJS distinction — CommonJS `require` copies the value at import time, while ESM links to the binding.',
    },
    {
      level: 'intermediate',
      question: 'Why must import/export statements be at the top level and not inside an if-block?',
      answer: 'Because ESM is static — the engine resolves the whole dependency graph before evaluating any code, so imports cannot be conditional. For conditional/runtime loading you use dynamic `import()` which returns a promise.',
      explanation: 'This static structure is exactly what enables tree shaking and ahead-of-time bundling.',
    },
    {
      level: 'advanced',
      question: 'Explain the three phases of ES module loading.',
      answer: 'Construction: fetch and parse the entry and all dependencies into a module graph. Instantiation: allocate export slots and link each import to the right export binding (no code runs yet). Evaluation: run each module body once, depth-first in dependency order.',
      explanation: 'Knowing the link-before-evaluate model explains why circular dependencies can yield `undefined` bindings rather than crashes.',
    },
    {
      level: 'senior',
      question: 'Why are ES Modules better for dead-code elimination than CommonJS?',
      answer: 'ESM imports/exports are statically analyzable — a bundler can determine at build time exactly which exports are used and drop the rest (tree shaking). CommonJS `require`/`module.exports` are dynamic runtime values, so a bundler usually cannot prove an export is unused.',
      explanation: 'Senior signal: connecting the language\'s static module structure to concrete build-time optimizations and bundle size.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What happens if two modules import each other (circular dependency)?',
    'How is `import()` (dynamic) different from a static `import` statement?',
    'Why is `this` undefined at the top level of a module?',
    'What is a barrel file and what is its downside for tree shaking?',
    'How does Node decide whether a `.js` file is ESM or CommonJS?',
    'Can you mix `require` and `import` in the same file? What are the constraints?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting the file extension in browser-native imports (`import x from \'./util\'`).',
      why: 'Native browser ESM does not auto-resolve extensions like Node/bundlers do, so the fetch 404s.',
      fix: 'Include the full path with extension (`./util.js`) for browser-native modules, or rely on a bundler that resolves them.',
    },
    {
      mistake: 'Trying to reassign an imported binding (`import { count }; count = 5`).',
      why: 'Imports are read-only live bindings; reassigning throws a TypeError.',
      fix: 'Expose a setter function from the module (`export function setCount(v) { count = v }`) instead of mutating the import.',
    },
    {
      mistake: 'Putting `import`/`export` inside conditionals or functions.',
      why: 'Static imports must be at the module top level; the parser rejects conditional ones.',
      fix: 'Use dynamic `import()` (which returns a promise) for conditional or lazy loading.',
    },
    {
      mistake: 'Assuming module-level code runs every time you import it.',
      why: 'Modules are singletons cached by specifier — the body runs only once, so side effects do not repeat.',
      fix: 'Export a factory function if you need fresh state per consumer instead of relying on module-level initialization.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vite is ESM-native — every `.vue`, composable, and store is an ES module. Single-file components compile to ESM and barrel `index.js` files define each feature\'s public API.' },
    { area: 'React', detail: 'Components and hooks are ESM files; `React.lazy(() => import(...))` uses dynamic ESM imports for route-level code splitting, and named exports keep bundles tree-shakeable.' },
    { area: 'Node.js', detail: 'Modern Node runs ESM via `"type": "module"` or `.mjs`. Server code uses top-level await for config/db setup and ESM-only packages increasingly require it.' },
    { area: 'Backend', detail: 'Shared utility packages publish small named exports so consuming services only bundle what they use; barrel re-exports define stable package entry points.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Static structure enables tree shaking, so unused exports never reach the production bundle.',
      'Module singleton caching means expensive top-level initialization (parsing config, building lookup tables) happens exactly once.',
    ],
    bad: [
      'Deep or wide module graphs increase the number of network round-trips for native (unbundled) ESM in the browser.',
      'Large barrel files can pull in far more code than needed and confuse tree shaking if they have side effects.',
    ],
    optimizations: [
      'Bundle and code-split for production rather than shipping thousands of raw module requests to the browser.',
      'Prefer direct named imports over `import *` and side-effect-free modules (`"sideEffects": false`) to maximize tree shaking.',
      'Use dynamic `import()` to lazy-load rarely used modules and shrink the initial bundle.',
      'Avoid large barrel files on hot paths; import directly from the source module when bundle size matters.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Importing from untrusted or compromised packages (supply-chain risk) executes that module\'s top-level code in your app with full privileges.',
      'Dynamic `import()` with a user-controlled specifier can load unintended or remote code.',
    ],
    bestPractices: [
      'Pin and audit dependencies (lockfiles, `npm audit`, integrity hashes) since any imported module runs on load.',
      'Never build an `import()` specifier from unsanitized user input; whitelist allowed module paths.',
      'Use Subresource Integrity and a strict CSP when loading ESM from a CDN in the browser.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript', 'scope', 'strict-mode'],
    nextConcepts: ['esm-vs-cjs', 'dynamic-imports', 'top-level-await', 'tree-shaking', 'circular-dependencies', 'bundlers-module-resolution'],
    dependencyNote:
      'ES Modules are the foundation of the entire modules track: understand scope and strict mode first, then ESM unlocks esm-vs-cjs comparison, dynamic imports, top-level await, tree shaking, and how bundlers resolve and optimize the graph.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two file boxes: math.js and main.js.',
      'In math.js write `export default add` and `export const PI`; in main.js write `import add, { PI } from "./math.js"`.',
      'Draw an arrow from main.js to math.js labelled "dependency".',
      'Above both, write the three phases: construct → instantiate(link) → evaluate.',
      'Point to the link arrow and say "imports are LIVE read-only bindings, not value copies".',
      'Conclude: "static structure → tree shaking + code splitting are possible".',
    ],
    diagram: `  main.js                 math.js
  ┌──────────────┐        ┌──────────────────┐
  │ import add,  │───────▶│ export default add│
  │   { PI }     │  link  │ export const PI   │
  └──────────────┘ (live) └──────────────────┘
   phases: construct → instantiate(link) → evaluate
   binding is LIVE + read-only (not a copy)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'ES Modules are JavaScript\'s native module system: each file has its own scope, runs in strict mode, and shares values via `export`/`import`. They are static — the engine resolves the whole dependency graph before running anything, in three phases: construct, instantiate (link bindings), evaluate. Imports are live read-only bindings, not copies, and each module is a cached singleton. The static structure is what makes tree shaking and code splitting possible. For runtime/conditional loading you use dynamic `import()`.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'ES Modules are the standardized module system built into the JavaScript language. Each module is a file with its own top-level scope that runs in strict mode by default, and it shares values using `export` and consumes them with `import`. The defining property is that ESM is static: import and export statements must be at the top level and cannot be conditional, so the engine can resolve the entire dependency graph before executing a single line. Loading happens in three phases — construction, where it parses and fetches all modules; instantiation, where it allocates export slots and links each import to the right binding without running any code yet; and evaluation, where each module body runs exactly once in dependency order. A crucial detail is that imports are live, read-only bindings — not value copies — so if the exporting module reassigns a variable, importers see the new value, but they cannot reassign it themselves. This differs from CommonJS, which copies the value at require time. Each module is also a cached singleton, so its top-level code runs only once. The big payoff of this static design is tooling: bundlers can tree-shake unused exports and code-split, which you cannot reliably do with dynamic CommonJS. For conditional or lazy loading you reach for dynamic `import()`, which returns a promise.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Static analyzability (great for tree shaking) vs flexibility — you cannot compute import paths at parse time; dynamic needs comes from `import()`.',
      'Barrel files give clean public APIs but can hurt tree shaking and slow cold builds if they aggregate side-effectful modules.',
    ],
    edgeCases: [
      'Circular imports: ESM links bindings before evaluation, so an early access can read an uninitialized (TDZ/undefined) export instead of crashing.',
      'Live bindings mean a default export of a primitive that is later reassigned will surprise consumers who expected a snapshot.',
      'Top-level `this` is `undefined`, breaking code that assumed `this === window`/`globalThis` from script context.',
      'Importing the same module under different specifiers (e.g. different casing or query strings) can create duplicate instances and split state.',
    ],
    runtimeBehavior: [
      'Module bodies execute once, depth-first; later imports return the cached namespace immediately.',
      'Imported bindings are read-only references into the exporting module\'s environment record.',
      'In browsers, native ESM is fetched and parsed asynchronously, so module scripts are deferred by default.',
    ],
    scalability: [
      'Unbundled native ESM with huge graphs creates request waterfalls — production should bundle and code-split.',
      'Module singletons holding large caches/state persist for the process lifetime; on the server this can accumulate memory if not bounded.',
    ],
    productionConcerns: [
      'Mixing ESM and CJS across a dependency tree causes interop headaches (default-export shape, dual packages); pick a strategy and document it.',
      'Side-effectful modules can break tree shaking — mark packages `"sideEffects": false` only when truly pure.',
      'Specifier resolution differences between Node, browser, and bundlers cause "works locally, breaks in prod" — align via `exports` maps and a single resolver config.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'ESM = JavaScript\'s native module system: `import` / `export`.',
    'Each module has its own scope + runs in strict mode automatically.',
    'Static: import/export at top level only, no conditionals.',
    'Three phases: construct → instantiate (link) → evaluate.',
    'Imports are LIVE, read-only bindings — not value copies.',
    'Each module is a cached singleton; body runs once.',
    'Default export: one per module, any import name, no braces.',
    'Named exports: many per module, braces, exact name (or `as` alias).',
    'Static structure enables tree shaking + code splitting.',
    'Browser: `<script type="module">`, include file extensions.',
    'Node ESM: `.mjs` or `"type":"module"` in package.json.',
    'Conditional/lazy loading → dynamic `import()` (returns a promise).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a module `temperature.js` that exports a named `toFahrenheit(c)` and a default `freezingPointC = 0`. Import both in `main.js`.',
      hint: 'Use one `export function` and one `export default`.',
      solution: {
        lang: 'js',
        code: `// temperature.js\nexport function toFahrenheit(c) {\n  return c * 9 / 5 + 32\n}\nexport default 0 // freezing point in Celsius\n\n// main.js\nimport freezingPointC, { toFahrenheit } from './temperature.js'\nconsole.log(freezingPointC)        // 0\nconsole.log(toFahrenheit(100))     // 212`,
        explanation: [
          'The named export is imported with braces and the exact name.',
          'The default export is imported without braces under any name you like.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate live bindings: a module exports `let total` and an `add(n)` function. Show that an importer sees the updated value after calling `add`.',
      hint: 'Mutate the exported variable inside the module, not from the importer.',
      solution: {
        lang: 'js',
        code: `// store.js\nexport let total = 0\nexport function add(n) { total += n }\n\n// main.js\nimport { total, add } from './store.js'\nconsole.log(total) // 0\nadd(5)\nconsole.log(total) // 5  ← live binding\n// total = 10 would throw: imports are read-only`,
        explanation: [
          '`total` is a live binding into store.js\'s scope, so the importer sees `5` after `add(5)`.',
          'The importer cannot reassign `total` directly — only the owning module can mutate it.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a barrel `index.js` that re-exports `useCart` from `./useCart.js` (renamed to `cart`) and forwards all named exports of `./helpers.js`.',
      hint: 'Use `export { x as y } from` and `export * from`.',
      solution: {
        lang: 'js',
        code: `// index.js\nexport { useCart as cart } from './useCart.js'\nexport * from './helpers.js'\n\n// consumer.js\nimport { cart, formatPrice } from './index.js'`,
        explanation: [
          '`export { useCart as cart } from` re-exports without importing it locally and renames it.',
          '`export *` forwards every named export of helpers.js through the barrel.',
          'Consumers now import the whole feature surface from a single path.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Two modules a.js and b.js import each other. Show what value `a.js` sees from `b.js` if it reads the import during its own top-level evaluation, and explain why.',
      hint: 'Think about link-before-evaluate and evaluation order.',
      solution: {
        lang: 'js',
        code: `// a.js\nimport { b } from './b.js'\nexport const a = 'A'\nconsole.log('in a, b =', b)   // 'B' (b.js evaluated first as a dep)\n\n// b.js\nimport { a } from './a.js'\nexport const b = 'B'\nconsole.log('in b, a =', a)   // undefined ← a not yet evaluated\n\n// entry: import './a.js'`,
        explanation: [
          'Bindings are LINKED before any body runs, so the names exist even with a cycle.',
          'Evaluation is depth-first: a.js imports b.js, so b.js runs first; at that point a.js\'s `a` is still in its uninitialized (TDZ) state and reads as undefined for a `const` accessed early.',
          'The lesson: avoid reading circular imports at module top level; reference them lazily inside functions instead.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Modules are how every real codebase is organized, and ESM is the present and future of JavaScript. Understanding live bindings, the static graph, and the three load phases shows you grasp how modern tooling (Vite, Rollup, Node) actually works — not just syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the named-vs-default difference and how to enable modules. Product companies (Zoho, Flipkart, Razorpay) probe live bindings vs copies and barrel-file tree-shaking tradeoffs. FAANG-level interviews dig into the three loading phases, circular-dependency behavior, and ESM/CJS interop.',
    whatInterviewersExpect:
      'Define ESM precisely (own scope, strict mode, static), explain named vs default exports, articulate that imports are live read-only bindings (vs CJS copies), and connect the static structure to tree shaking and code splitting.',
  },
}

export default esModules
