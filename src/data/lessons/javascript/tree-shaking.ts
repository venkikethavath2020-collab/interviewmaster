import type { ConceptLesson } from '../../../types/lesson'

const treeShaking: ConceptLesson = {
  // 1. Concept Summary
  slug: 'tree-shaking',
  name: 'Tree Shaking',
  category: 'modules',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Tree shaking removes code your app never uses from the final bundle, directly shrinking download size and improving load performance.',
    'It is the single biggest reason ES Modules matter for production: the static `import`/`export` structure is what makes dead-code elimination possible.',
    'Without it, importing one helper from a big utility library could drag the entire library into your bundle.',
    'It is fragile — side effects, dynamic access, and CommonJS interop can silently defeat it, bloating bundles in ways juniors never notice.',
    'Interviewers use it to test whether you understand bundlers, module semantics, side effects, and how to design libraries that ship lean.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Tree shaking is shaking a fruit tree so only the fruit you\'ll actually eat stays, and the dead leaves fall off.',
    story: [
      'Imagine you have a big tree full of branches, but you only want to take home three apples.',
      'Instead of cutting down and carrying the whole heavy tree, you give it a good shake.',
      'All the dead leaves and empty branches you don\'t need fall to the ground, and you\'re left holding just the apples you came for.',
      'A bundler does the same to your code: it shakes the tree of all your imported files and lets the parts you never use "fall off", so you only ship the code you actually need.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you build a website, a tool called a bundler gathers all your code files into one package to send to the browser.',
    'Often you import a library but only use one or two functions from it.',
    'Tree shaking is when the bundler looks at exactly which exported functions you actually use and throws away the rest before packaging.',
    'This makes the file the browser downloads smaller, so the site loads faster — but only works well when the code is written in a way the bundler can analyze.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Tree shaking is a build-time optimization that eliminates unused exports (dead code) from the final bundle by statically analyzing which ES module exports are actually imported and reachable.',
    how: 'A bundler (Rollup, webpack, esbuild, Vite) builds the static import graph, marks which exports each module actually uses, and drops the rest. It relies on ESM\'s static structure and on knowing which code has no side effects, so it can safely remove untouched exports.',
    why: 'It keeps bundles small without forcing you to manually split libraries — you import what you need, and the build strips everything else, improving load time.',
    code: {
      label: 'Only the used export survives',
      lang: 'js',
      code: `// utils.js\nexport function used() { return 'kept' }\nexport function unused() { return 'dropped' } // never imported\n\n// app.js\nimport { used } from './utils.js'\nconsole.log(used())\n\n// After bundling + tree shaking, 'unused' is NOT in the output bundle.`,
      explanation: [
        'utils.js exports two functions, but app.js only imports `used`.',
        'The bundler statically sees `unused` is never imported anywhere reachable.',
        'It eliminates `unused` from the production bundle, shrinking the output.',
        'This requires ESM (`export`) so the analysis can be done at build time.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Tree shaking is static dead-code elimination performed by a bundler over an ES module graph. Because ESM imports/exports are statically analyzable, the bundler can build a reachability graph from the entry points, mark which exported bindings are actually referenced, and remove unreferenced exports plus any code reachable only through them. Correctness hinges on side-effect analysis: code with observable side effects at module evaluation (mutating globals, registering listeners, polyfills) cannot be safely removed unless declared pure (via the package.json `"sideEffects"` flag or `/*#__PURE__*/` annotations). CommonJS, dynamic property access on namespace objects, and re-export barrels with side effects degrade or defeat tree shaking.',

  // 7. Internal Working
  internalWorking: [
    'GRAPH BUILD: the bundler parses the entry and follows static `import` statements to construct the full module dependency graph.',
    'BINDING ANALYSIS: for each module it records which exported bindings are imported/used and which are never referenced from any reachable point.',
    'SIDE-EFFECT DETERMINATION: it checks the package.json `"sideEffects"` field and `/*#__PURE__*/` hints to decide whether a module/statement can be dropped without changing observable behavior.',
    'MARK + ELIMINATE: it marks reachable, used code as live and treats unreferenced, side-effect-free exports (and code only they reach) as dead, removing them.',
    'MINIFIER COOPERATION: the minifier (Terser/esbuild) performs the final dead-code removal and constant folding; PURE annotations tell it a call can be dropped if its result is unused.',
    'OUTPUT: the emitted bundle contains only live code; dynamic specifiers, namespace re-exports, and side-effectful modules are conservatively KEPT to preserve correctness.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  ENTRY: app.js  import { used } from 'lib'
        │
        ▼  bundler builds static graph + marks reachability
  ┌──────────────── lib (ESM) ────────────────┐
  │  used()      ◄── REFERENCED ── KEEP        │
  │  unused()    ◄── never used ── DROP        │
  │  sideEffectInit()  (side effect) ── KEEP?  │
  └────────────────────────────────────────────┘
        │ "sideEffects": false → safe to drop unused
        ▼
   FINAL BUNDLE: only used()  (smaller download)
   CJS / dynamic[x] / side-effect barrels ⇒ conservatively KEPT`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — named imports enable shaking',
      lang: 'js',
      code: `// math.js\nexport const add = (a, b) => a + b\nexport const sub = (a, b) => a - b\nexport const mul = (a, b) => a * b\n\n// app.js — import ONE\nimport { add } from './math.js'\nconsole.log(add(1, 2))\n// 'sub' and 'mul' are dropped from the bundle`,
      explanation: [
        'Small, named exports let the bundler track usage per export.',
        'Only `add` is referenced, so `sub` and `mul` are eliminated.',
        'A default export of one big object would not shake as cleanly.',
        'This is why tree-shakeable libraries favor many named exports.',
      ],
    },
    intermediate: {
      label: 'Intermediate — what defeats tree shaking',
      lang: 'js',
      code: `// shapes.js\nexport const circle = () => 'o'\nexport const square = () => '#'\n\n// DEFEATED: namespace + dynamic property access\nimport * as shapes from './shapes.js'\nconst name = getUserChoice()\nconsole.log(shapes[name]())   // bundler can't know which → keeps ALL\n\n// SHAKEABLE: direct named import\nimport { circle } from './shapes.js'\nconsole.log(circle())          // square is dropped`,
      explanation: [
        '`import * as shapes` + `shapes[name]` is dynamic, so the bundler cannot prove which exports are unused.',
        'To stay safe it keeps every export — defeating tree shaking.',
        'A direct named import (`circle`) is statically analyzable, so `square` is dropped.',
        'Dynamic access on namespace objects is a common real-world bloat source.',
      ],
    },
    advanced: {
      label: 'Advanced — sideEffects flag and PURE annotations',
      lang: 'js',
      code: `// package.json of a library\n{ "name": "lib", "sideEffects": false }  // \"my whole package is pure\"\n// OR be specific:\n// { "sideEffects": ["./src/polyfill.js", "*.css"] }\n\n// constants.js\nexport const CONFIG = /*#__PURE__*/ buildConfig()\n// the PURE comment tells the minifier: if CONFIG is unused, dropping\n// buildConfig() is safe (no side effects)`,
      explanation: [
        '`"sideEffects": false` promises the bundler that importing a module for side effects is unnecessary, so unused exports are safe to drop.',
        'Listing specific files (CSS, polyfills) keeps those while shaking the rest.',
        '`/*#__PURE__*/` marks a function call as side-effect-free so the minifier can remove it if its result is unused.',
        'Misdeclaring side effects as absent causes broken builds (e.g. a dropped polyfill), so these flags must be accurate.',
      ],
    },
    realProject: {
      label: 'Real project — tree-shakeable design vs barrel bloat',
      lang: 'js',
      code: `// GOOD: import directly from the source (Vite/Rollup shakes well)\nimport { debounce } from 'lodash-es'         // ESM, tree-shakeable\n// or per-method packages\nimport debounce from 'lodash.debounce'\n\n// RISKY: huge barrel re-export\n// components/index.js\nexport * from './Button'\nexport * from './DataGrid'   // pulls heavy DataGrid even if unused\nimport { Button } from './components'  // may drag DataGrid if not pure`,
      explanation: [
        '`lodash-es` is ESM with named exports, so `debounce` imports without the whole library.',
        'The classic CommonJS `lodash` is not tree-shakeable; per-method packages or `lodash-es` fix that.',
        'A large barrel that `export *`s side-effectful modules can pull in heavy code you never use.',
        'In Vue/React apps, importing components directly (or marking the barrel side-effect-free) keeps route chunks lean.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is tree shaking?',
      answer: 'A build-time optimization where the bundler removes unused exports (dead code) from the final bundle by analyzing the static ES module import graph.',
      explanation: 'A good answer ties it to ESM\'s static structure and the goal of smaller bundles.',
    },
    {
      level: 'beginner',
      question: 'Why does tree shaking need ES Modules and not CommonJS?',
      answer: 'ESM imports/exports are static and analyzable at build time, so the bundler can prove which exports are unused. CommonJS `require`/`module.exports` are dynamic runtime values, so the bundler usually cannot safely remove anything.',
      explanation: 'This connects the optimization directly to module semantics.',
    },
    {
      level: 'intermediate',
      question: 'What is a side effect and why does it affect tree shaking?',
      answer: 'A side effect is observable behavior that runs at module evaluation — mutating a global, registering a listener, applying a polyfill, importing CSS. The bundler must keep side-effectful code even if its exports are unused, because removing it would change behavior.',
      explanation: 'Mentioning the package.json `"sideEffects"` flag shows you know how to declare purity.',
    },
    {
      level: 'intermediate',
      question: 'Name two things that commonly defeat tree shaking.',
      answer: 'Dynamic property access on a namespace import (`shapes[name]`), CommonJS modules, large barrel files with side effects, and importing a whole default-export object instead of named exports.',
      explanation: 'The interviewer wants concrete bloat causes, not just the definition.',
    },
    {
      level: 'advanced',
      question: 'What does `"sideEffects": false` in package.json do, and what is the risk of setting it wrongly?',
      answer: 'It tells bundlers that the package\'s modules have no import-time side effects, so unused exports can be dropped even if the module is "imported for effect". If wrong, the bundler may remove code that was actually needed (e.g. a polyfill or CSS), breaking the app.',
      explanation: 'Senior signal: understanding the contract and its failure mode.',
    },
    {
      level: 'senior',
      question: 'How would you design a library to be maximally tree-shakeable?',
      answer: 'Ship ESM with many small named exports, avoid module-level side effects, declare `"sideEffects": false` (or list the few that exist), annotate pure expensive calls with `/*#__PURE__*/`, avoid re-export barrels that aggregate side-effectful modules, and provide proper `exports`/`module` fields so bundlers pick the ESM build.',
      explanation: 'This tests packaging and bundler expertise end to end.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do Rollup, webpack, and esbuild differ in tree-shaking capability?',
    'Why is a default export of a big object harder to tree-shake than named exports?',
    'How does the minifier (Terser) cooperate with the bundler for dead-code elimination?',
    'What is the difference between tree shaking and code splitting?',
    'How can importing CSS or a polyfill break tree shaking?',
    'How do you verify what actually made it into your bundle?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting CommonJS libraries to tree-shake.',
      why: 'CJS exports are dynamic, so bundlers cannot statically prove which parts are unused.',
      fix: 'Use the library\'s ESM build (e.g. `lodash-es`), per-method packages, or named ESM imports.',
    },
    {
      mistake: 'Using namespace imports with dynamic access (`import * as x; x[key]`).',
      why: 'The bundler cannot determine which exports are used, so it keeps them all.',
      fix: 'Use direct named imports, or map known keys to static imports.',
    },
    {
      mistake: 'Declaring `"sideEffects": false` when modules do have side effects.',
      why: 'The bundler may strip needed effect-only code (polyfills, CSS, global registration), breaking the app.',
      fix: 'List the side-effectful files explicitly in the `"sideEffects"` array instead of blanket false.',
    },
    {
      mistake: 'Assuming tree shaking removed code without verifying.',
      why: 'Barrels, side effects, and interop quietly keep code; bundle size can balloon unnoticed.',
      fix: 'Inspect the output with a bundle analyzer and check for unexpectedly large modules.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vite/Rollup tree-shake Vue apps automatically; importing only the composables/components you use keeps route chunks small. Vue itself ships ESM with `__PURE__` annotations to shake unused runtime features.' },
    { area: 'React', detail: 'webpack/Vite shake named imports from UI libraries; teams switch from CJS utility imports to ESM (or per-method packages) and audit bundles to avoid pulling whole libraries.' },
    { area: 'Node.js', detail: 'Server bundling (for serverless/edge) tree-shakes ESM dependencies to reduce cold-start size; CJS-only deps limit how much can be removed.' },
    { area: 'Backend', detail: 'Internal shared packages publish ESM with `"sideEffects": false` so consuming services only bundle the functions they call, shrinking deploy artifacts.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Smaller bundles mean faster downloads, parse, and execution — better LCP/TTI.',
      'Lets you keep convenient "import what you need" ergonomics without paying for the whole library.',
    ],
    bad: [
      'Defeated tree shaking (CJS, dynamic access, bad barrels) silently bloats the bundle.',
      'Incorrect side-effect declarations can break the app at runtime, not just inflate size.',
    ],
    optimizations: [
      'Prefer ESM builds and direct named imports; avoid namespace + dynamic access.',
      'Set an accurate `"sideEffects"` field and use `/*#__PURE__*/` on heavy side-effect-free calls.',
      'Avoid aggregating side-effectful modules in barrels; import from source on hot paths.',
      'Verify with a bundle analyzer and watch bundle-size budgets in CI.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'esm-vs-cjs', 'bundlers-module-resolution'],
    nextConcepts: ['code-splitting-lazy-loading', 'dynamic-imports', 'circular-dependencies', 'core-web-vitals'],
    dependencyNote:
      'Tree shaking depends on es-modules\' static structure and an understanding of esm-vs-cjs (CJS defeats it) plus how bundlers-module-resolution builds the graph. It complements code-splitting-lazy-loading and dynamic-imports for shrinking what ships, and ties into core-web-vitals via smaller bundles.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a module box with three exports: used, unused, sideEffectInit.',
      'Draw the entry importing only `used`.',
      'Cross out `unused` ("never referenced → dropped").',
      'Put a question mark on `sideEffectInit` and write "kept unless sideEffects:false".',
      'Say: "tree shaking = static dead-code elimination, only works with ESM".',
      'Add the killers: "CJS, dynamic namespace access, side-effect barrels keep code".',
    ],
    diagram: `   entry: import { used } from 'lib'
   ┌──────────── lib ────────────┐
   │ used()        → KEEP         │
   │ unused()      → DROP (dead)  │
   │ sideEffect()  → KEEP unless  │
   │                sideEffects:false
   └──────────────────────────────┘
   KILLERS: CJS · ns[dynamic] · effectful barrels`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Tree shaking is build-time dead-code elimination: the bundler analyzes the static ESM import graph, marks which exports are actually used, and drops the rest, shrinking the bundle. It only works with ES Modules because they are statically analyzable — CommonJS, dynamic namespace access, and side-effectful barrels defeat it. Correctness depends on side-effect analysis, controlled by the package.json `"sideEffects"` field and `/*#__PURE__*/` annotations. Design libraries with small named ESM exports and accurate side-effect flags to shake well.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Tree shaking is a build-time optimization where the bundler removes code your application never uses from the final bundle. It works by exploiting the static structure of ES Modules: because `import` and `export` are analyzable before runtime, the bundler can build a reachability graph from the entry points, mark which exported bindings are actually referenced, and eliminate the unreferenced ones along with any code only they reach. This is why it needs ESM — CommonJS uses dynamic `require`/`module.exports`, so the bundler usually cannot prove an export is unused and keeps everything. The other half of the story is side effects: code that does observable work at module evaluation — registering a global, applying a polyfill, importing CSS — cannot be safely removed even if its exports are unused, because dropping it would change behavior. Bundlers determine purity from the package.json `"sideEffects"` field and `/*#__PURE__*/` annotations, and cooperate with the minifier for the final removal. In practice, tree shaking is fragile: namespace imports with dynamic property access, CommonJS libraries, and big re-export barrels that aggregate side-effectful modules all defeat it and silently bloat bundles. To ship lean, you design libraries with many small named ESM exports, avoid module-level side effects, declare an accurate `"sideEffects"` flag, and verify the output with a bundle analyzer rather than assuming it worked.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Aggressive elimination (smaller bundles) vs correctness risk from mis-declared side effects.',
      'Convenient barrels/namespaces (DX) vs shakeability — broad re-exports trade bundle size for import ergonomics.',
    ],
    edgeCases: [
      'Re-export barrels with side effects keep the whole module even when one export is used.',
      'CommonJS interop and `__esModule` transpiler shims block static analysis.',
      'Class methods are often not shaken (the whole class is kept once instantiated), unlike standalone functions.',
      'Getters/Proxies or dynamic property access on a namespace object force the bundler to retain all exports.',
    ],
    runtimeBehavior: [
      'Tree shaking is entirely build-time; there is no runtime cost or behavior change when done correctly.',
      'The minifier performs the final dead-code removal guided by reachability marks and PURE hints.',
      'Dynamic imports create separate chunks but their internals are still tree-shaken individually.',
    ],
    scalability: [
      'Large dependency trees benefit most, but only if every layer is ESM and side-effect-honest.',
      'Monorepos need consistent ESM publishing and `"sideEffects"` flags or one CJS dep blocks shaking app-wide.',
    ],
    productionConcerns: [
      'Set bundle-size budgets in CI and use an analyzer to catch regressions when a dep silently goes CJS.',
      'Validate `"sideEffects"` accuracy — a wrong `false` can drop a polyfill and break only in production.',
      'Audit barrels and prefer source imports on critical paths to keep route chunks lean.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Tree shaking = build-time dead-code elimination.',
    'Drops unused EXPORTS from the bundle → smaller download.',
    'Needs ESM (static); CommonJS defeats it.',
    'Side-effectful code is KEPT even if exports unused.',
    'Control purity with package.json `"sideEffects"`.',
    '`/*#__PURE__*/` marks a call as droppable if result unused.',
    'Namespace import + dynamic key (`ns[x]`) keeps ALL exports.',
    'Default-export-one-big-object shakes poorly; prefer named.',
    'Barrels of side-effectful modules can pull in everything.',
    'Use `lodash-es`/per-method packages, not CJS `lodash`.',
    'Minifier (Terser/esbuild) does the final removal.',
    'Always verify with a bundle analyzer — don\'t assume.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given `export const a=1; export const b=2; export const c=3` in nums.js, write an import that lets the bundler drop `b` and `c`.',
      hint: 'Import only the one you use, by name.',
      solution: {
        lang: 'js',
        code: `// nums.js\nexport const a = 1\nexport const b = 2\nexport const c = 3\n// app.js\nimport { a } from './nums.js'\nconsole.log(a) // b and c are unreferenced → dropped`,
        explanation: [
          'Importing only `a` makes `b` and `c` unreachable.',
          'The bundler statically removes the unused named exports.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite this so it becomes tree-shakeable: `import * as icons from "./icons.js"; render(icons[name])`.',
      hint: 'Replace dynamic namespace access with explicit static imports.',
      solution: {
        lang: 'js',
        code: `// icons.js\nexport const home = '🏠'\nexport const user = '👤'\n// app.js — explicit map of only the icons you use\nimport { home, user } from './icons.js'\nconst icons = { home, user }\nrender(icons[name]) // only home & user are bundled`,
        explanation: [
          'Dynamic `icons[name]` on a namespace import forces the bundler to keep every icon.',
          'Naming the imports you actually support lets unused icons be dropped.',
          'The lookup object is built from statically imported bindings.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A library has one effect-only module (`./polyfill.js`) and many pure modules. Write the package.json `"sideEffects"` so the polyfill is kept but everything else shakes.',
      hint: 'Use an array listing only the effectful file.',
      solution: {
        lang: 'js',
        code: `{\n  "name": "lib",\n  "module": "./dist/index.js",\n  "sideEffects": ["./dist/polyfill.js"]\n}`,
        explanation: [
          'An array `"sideEffects"` whitelists files that MUST be kept for their effects.',
          'polyfill.js is preserved even when imported only for effect.',
          'All other modules are treated as pure and their unused exports are dropped.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain with code why importing from a barrel can break tree shaking, and how to fix it.',
      hint: 'A barrel that re-exports side-effectful heavy modules pulls them all in.',
      solution: {
        lang: 'js',
        code: `// components/index.js (barrel)\nexport * from './Button'\nexport * from './HeavyChart'  // has top-level side effects\n\n// consumer — wanted only Button\nimport { Button } from './components'\n// HeavyChart may be retained because the barrel module isn't pure\n\n// FIX: import directly from source\nimport { Button } from './components/Button'\n// or mark the package \"sideEffects\": false if truly pure`,
        explanation: [
          'A barrel evaluates all re-exported modules; side-effectful ones can\'t be dropped.',
          'Importing `Button` via the barrel can therefore drag in HeavyChart.',
          'Importing directly from the source module, or declaring purity, restores shakeability.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Bundle size is a direct performance and cost lever, and tree shaking is the main automated tool for it. Explaining why it depends on ESM, how side effects gate it, and what defeats it shows senior-level understanding of the build pipeline — not just feature work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and the ESM requirement. Product companies (Zoho, Flipkart, Razorpay) probe what defeats it (CJS, dynamic access, barrels) and how to ship tree-shakeable libraries. FAANG-level interviews go into side-effect contracts, minifier cooperation, and edge cases like class methods and re-export barrels.',
    whatInterviewersExpect:
      'Define tree shaking as static dead-code elimination, explain its dependence on ESM and side-effect analysis, list concrete defeaters, and describe how to design and verify a tree-shakeable library and bundle.',
  },
}

export default treeShaking
