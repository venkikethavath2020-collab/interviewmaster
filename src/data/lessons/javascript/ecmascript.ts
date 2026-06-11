import type { ConceptLesson } from '../../../types/lesson'

const ecmascript: ConceptLesson = {
  // 1. Concept Summary
  slug: 'ecmascript',
  name: 'ECMAScript & TC39',
  category: 'fundamentals-engine',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'ECMAScript is the official standard that JavaScript implements — knowing it explains why features land in different engines at different times.',
    'Understanding the TC39 process (the proposal stages) tells you when a feature is safe to use, when it needs a polyfill, and when it might still change.',
    'It clarifies the confusing version names (ES5, ES6/ES2015, ES2020…) and the "annual release" model engineers casually reference.',
    'It is why tooling exists: Babel, browserslist, and polyfills all bridge the gap between the spec and what a given engine supports.',
    'Interviewers ask it to see if you understand JavaScript as a governed standard rather than a single vendor product — a sign of breadth.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'ECMAScript is the official rulebook for the JavaScript game, and TC39 is the committee that writes new rules each year.',
    story: [
      'Imagine a popular board game played in many houses. To stop arguments, a committee writes one official rulebook everyone agrees to follow.',
      'Every year the committee meets and decides which new rules to add — maybe a new card or a new way to win — but only after testing the idea carefully so it does not break the game.',
      'Each house (each browser) reads the rulebook and updates how they play. Some houses add the new rules quickly, others take a while.',
      'JavaScript is the game people actually play; ECMAScript is that official rulebook, and TC39 is the committee that meets, debates, and publishes the new rules once a year.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript is not owned by one company — it follows a written standard called ECMAScript so that all browsers behave the same way.',
    'A committee named TC39, made up of engineers from Google, Apple, Mozilla, Microsoft and others, decides what goes into the standard.',
    'New features are proposed and pass through stages (like rough drafts becoming final), and once approved they are published in a yearly version such as ES2015 or ES2020.',
    'Because browsers update at different speeds, a brand-new feature might work in one browser before another, which is why developers sometimes need helper tools.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'ECMAScript (ECMA-262) is the language specification that JavaScript implements. TC39 is the technical committee that maintains it, advancing features through a five-stage proposal process and publishing a new edition each year (ES2015 onward).',
    how: 'Anyone can propose a feature. It moves through Stage 0 (idea) to Stage 4 (finished), gaining specification text, implementations, and tests at each step. At Stage 4 it is merged into the standard and ships in engines.',
    why: 'A shared, versioned standard keeps all engines compatible and gives the language a predictable, governed evolution rather than vendor chaos.',
    code: {
      label: 'Spec features arriving over editions',
      lang: 'js',
      code: `// ES5 (2009): strict mode, Array methods\n'use strict'\n[1, 2, 3].map((n) => n)        // arrow is ES6, map is ES5\n\n// ES2015 (ES6): let/const, arrow, classes, promises\nconst double = (n) => n * 2\n\n// ES2020: optional chaining + nullish coalescing\nconst city = user?.address?.city ?? 'Unknown'`,
      explanation: [
        '`Array.prototype.map` and strict mode were standardized in ES5 (2009).',
        '`const`, arrow functions, classes, and promises arrived together in ES2015 (commonly called ES6).',
        'Optional chaining (`?.`) and nullish coalescing (`??`) were added in ES2020.',
        'Each feature entered the language via the TC39 process and a specific yearly edition — that is the lifecycle ECMAScript governs.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'ECMAScript is the standardized specification (ECMA-262, published by Ecma International) that defines the syntax, types, semantics, and built-in objects of the language that JavaScript implements. It is maintained by TC39, a committee of member organizations, which evolves the language through a five-stage proposal process (Stage 0 strawperson through Stage 4 finished) and ships a new edition annually since ES2015. JavaScript engines (V8, SpiderMonkey, JavaScriptCore) are implementations of this specification; conformance is checked against the Test262 suite.',

  // 7. Internal Working
  internalWorking: [
    'A champion (a TC39 member) authors a proposal as Stage 0 — an idea presented to the committee.',
    'Stage 1 (Proposal): the committee agrees the problem is worth solving; an API sketch and examples are produced.',
    'Stage 2 (Draft): the formal specification text is written; the feature\'s syntax and semantics are largely settled.',
    'Stage 3 (Candidate): the spec is complete and feedback is sought from implementers; engines begin shipping experimental implementations behind flags.',
    'Stage 4 (Finished): two independent implementations pass the Test262 conformance tests, the proposal is merged into the main spec, and it ships in the next annual edition.',
    'Engines then enable the feature for all users; tools like Babel transpile and core-js polyfills it for environments that do not yet support it.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   IDEA ──► TC39 PROPOSAL PIPELINE ──► SHIPPED IN ENGINES
            ┌──────────────────────────────────────┐
            │ Stage 0  strawperson  (just an idea)  │
            │ Stage 1  proposal     (worth solving) │
            │ Stage 2  draft        (spec text)     │
            │ Stage 3  candidate    (impl + flags)  │
            │ Stage 4  finished     (Test262 pass)  │
            └──────────────────────────────────────┘
                          │ merged into
                          ▼
            ECMAScript edition (ES2015, ES2020, ...)
                          │ implemented by
                          ▼
            V8 / SpiderMonkey / JavaScriptCore
                          │ gap filled by
                          ▼
                Babel (transpile) + core-js (polyfill)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — naming editions correctly',
      lang: 'js',
      code: `// ES6 === ES2015 (same edition, two names)\nclass Point { constructor(x) { this.x = x } } // ES2015\n\n// ES2017\nasync function load() { return await fetch('/data') }\n\n// ES2021\nconst total = 1_000_000   // numeric separators\nconst result = null\n// result ??= 'default'    // logical assignment`,
      explanation: [
        '"ES6" and "ES2015" are the same release — the committee switched to year-based naming after ES6.',
        '`async`/`await` was standardized in ES2017.',
        'Numeric separators and logical assignment operators came in ES2021.',
        'Knowing which edition introduced a feature helps you reason about support and transpilation needs.',
      ],
    },
    intermediate: {
      label: 'Intermediate — checking if a feature is safe to use',
      lang: 'js',
      code: `// Feature detection instead of assuming support\nif (typeof Array.prototype.at === 'function') {\n  console.log([1, 2, 3].at(-1)) // 3, ES2022\n} else {\n  const arr = [1, 2, 3]\n  console.log(arr[arr.length - 1]) // fallback\n}`,
      explanation: [
        '`Array.prototype.at` is an ES2022 feature; older engines lack it.',
        'Feature detection (`typeof … === "function"`) is safer than assuming an edition is supported.',
        'A fallback keeps the code working on engines that have not implemented the proposal yet.',
        'This mirrors how polyfills decide whether to install a shim.',
      ],
    },
    advanced: {
      label: 'Advanced — transpiling a Stage-3/new feature',
      lang: 'js',
      code: `// Source uses a modern feature\nclass Counter {\n  #count = 0            // private field (ES2022)\n  inc() { return ++this.#count }\n}\n\n// Babel transpiles #count down to a WeakMap-based shim\n// so it runs on engines without private-field support.\nconst c = new Counter()\nc.inc() // 1`,
      explanation: [
        'Private class fields (`#count`) reached Stage 4 and shipped in ES2022.',
        'For older targets, Babel rewrites `#count` into a WeakMap-backed pattern that emulates privacy.',
        'This is the practical payoff of understanding stages: you can adopt new syntax early and let tooling backfill support.',
        'Your browserslist config decides exactly how far down Babel transpiles.',
      ],
    },
    realProject: {
      label: 'Real project — browserslist driving the build in a Vue/Node app',
      lang: 'js',
      code: `// package.json — declares target environments\n// "browserslist": ["> 0.5%", "last 2 versions", "not dead"]\n\n// Vite/Babel reads this and transpiles + polyfills accordingly:\nconst settings = config?.theme?.dark ?? false // ES2020 optional chaining\n// Output is lowered for older browsers in the target list automatically.`,
      explanation: [
        'A `browserslist` config tells the toolchain which engines/editions to support.',
        'Vite, Babel, and autoprefixer read it to decide what to transpile and polyfill.',
        'You write modern ECMAScript and the build produces code that runs on your declared targets.',
        'This is how teams adopt new spec features confidently without breaking older browsers.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between JavaScript and ECMAScript?',
      answer: 'ECMAScript is the language specification (the standard, ECMA-262); JavaScript is the popular implementation of that specification. ECMAScript defines the rules; engines like V8 implement them as JavaScript.',
      explanation: 'The clean distinction is spec vs implementation. JavaScript "is an" implementation of ECMAScript.',
    },
    {
      level: 'beginner',
      question: 'Is ES6 the same as ES2015?',
      answer: 'Yes. ES6 was the sixth edition, released in 2015. After that, editions adopted year-based names (ES2016, ES2017, …), but ES6 and ES2015 refer to the identical release.',
      explanation: 'A common naming gotcha; knowing both names avoids confusion in older articles and job posts.',
    },
    {
      level: 'intermediate',
      question: 'What is TC39 and what does it do?',
      answer: 'TC39 is the Technical Committee 39 of Ecma International, made up of member organizations (browser vendors and others). It maintains the ECMAScript specification, evaluates feature proposals through a staged process, and publishes a new edition each year.',
      explanation: 'Shows awareness that the language is governed by a committee, not a single company.',
    },
    {
      level: 'intermediate',
      question: 'What are the TC39 proposal stages?',
      answer: 'Stage 0 (strawperson/idea), Stage 1 (proposal — worth solving), Stage 2 (draft — spec text), Stage 3 (candidate — implementations and feedback), Stage 4 (finished — passes Test262 and is merged into the standard).',
      explanation: 'Listing all five stages and what each requires is a strong, precise answer.',
    },
    {
      level: 'advanced',
      question: 'How can you safely use a feature that is only at Stage 3?',
      answer: 'Use a transpiler (Babel) with the appropriate plugin and/or a polyfill (core-js), guarded by feature detection if needed. Be aware Stage 3 features can still change slightly, so pin versions and watch for spec updates.',
      explanation: 'Demonstrates the practical link between proposal stages, tooling, and risk management.',
    },
    {
      level: 'senior',
      question: 'Why might the same modern feature behave differently across browsers even after it is standardized?',
      answer: 'Engines implement Stage 3 features experimentally before finalization and may ship subtle differences or bugs; rollout timing varies; and host integration differs. Test262 reduces divergence at Stage 4, but real-world edge cases and version skew remain, so feature detection, polyfills, and testing across targets are still needed.',
      explanation: 'Senior signal: connecting the spec process to the practical reality of implementation skew and the tooling that compensates.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is Test262 and why does it matter?',
    'What is the difference between a polyfill and a transpiler?',
    'Who are the members of TC39?',
    'What does "Stage 4" guarantee about a feature?',
    'How do you decide whether to use a new ES feature in production?',
    'What is browserslist and how does it affect your build?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Treating "JavaScript" and "ECMAScript" as interchangeable in a precise context.',
      why: 'ECMAScript is the spec; JavaScript is the implementation — conflating them muddies discussions about features and support.',
      fix: 'Say ECMAScript when you mean the standard/edition, JavaScript when you mean the running language.',
    },
    {
      mistake: 'Assuming a feature in a recent edition works everywhere immediately.',
      why: 'Engines adopt features at different times; users run old browsers.',
      fix: 'Check support (caniuse/MDN), use feature detection, and transpile/polyfill via your browserslist targets.',
    },
    {
      mistake: 'Thinking ES6 and ES2015 are different releases.',
      why: 'The naming convention changed after the sixth edition, creating two names for one release.',
      fix: 'Remember ES6 = ES2015; year-based names start with ES2016.',
    },
    {
      mistake: 'Using a Stage-1/2 proposal feature in production code.',
      why: 'Early-stage proposals can change or be dropped, breaking your code on upgrade.',
      fix: 'Prefer Stage 3+ for production; isolate experimental syntax and pin tool versions.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue projects scaffolded with Vite let you write the latest ECMAScript; the build pipeline transpiles to the configured browser targets so modern syntax ships safely.' },
    { area: 'React', detail: 'Create React App / Next.js use Babel/SWC presets to lower modern ES features (optional chaining, private fields) for the supported browser matrix.' },
    { area: 'Node.js', detail: 'Node tracks V8, so each Node version supports a known ECMAScript level; teams pick a Node LTS to guarantee which features are available without transpilation.' },
    { area: 'Backend', detail: 'Libraries publish builds for multiple ES targets; choosing the right target balances bundle size, performance, and compatibility with consumer runtimes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Writing native modern ES features lets engines run them with optimized built-in implementations rather than slower polyfill shims.',
      'Targeting modern editions in your build avoids shipping legacy transpilation overhead to capable browsers (differential serving).',
    ],
    bad: [
      'Transpiling new syntax down to ES5 can produce larger, slower output (e.g. generators/async lowered to state machines).',
      'Loading broad polyfills regardless of need bloats bundles and adds parse/execute time on every page load.',
    ],
    optimizations: [
      'Set a realistic browserslist so the toolchain transpiles only as far as necessary.',
      'Use differential serving (modern bundle for modern browsers, legacy fallback) to keep the common case lean.',
      'Polyfill on demand (core-js with usage-based imports) instead of importing everything.',
      'Prefer native features over userland reimplementations once support is broad enough.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript'],
    nextConcepts: ['javascript-engines', 'strict-mode', 'es-modules', 'var-let-const', 'arrow-functions'],
    dependencyNote:
      'Builds directly on what-is-javascript by explaining the standard behind it. It motivates engines (which implement the spec) and the modern syntax (let/const, arrow functions, modules) introduced across editions.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write two boxes side by side: "ECMAScript = spec (the rules)" and "JavaScript = implementation (the running language)".',
      'Below, draw a horizontal pipeline labeled Stage 0 → 1 → 2 → 3 → 4.',
      'Annotate Stage 4 with "passes Test262, merged into the standard".',
      'Draw an arrow from the pipeline to "annual edition: ES2015, ES2020…".',
      'Say: "TC39 advances proposals through five stages; finished ones ship in the yearly ECMAScript edition that engines implement."',
    ],
    diagram: `  ECMAScript (spec) ───implemented by───► JavaScript (engines)
        ▲
        │ merges Stage-4 proposals
   Stage 0 ─► 1 ─► 2 ─► 3 ─► 4  (TC39 process)
                              └─► ES2015 / ES2020 / ES2022 ...`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'ECMAScript (ECMA-262) is the standard JavaScript implements; TC39 is the committee that maintains it. Features advance through five stages — 0 idea, 1 proposal, 2 draft, 3 candidate, 4 finished — and a finished proposal (which passes Test262) ships in the next yearly edition. ES6 equals ES2015; later editions use year names. Because engines adopt features at different times, Babel transpiles and core-js polyfills to bridge the gap, guided by your browserslist targets.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'ECMAScript is the formal specification — ECMA-262 — that defines the language JavaScript implements. So the clean way to say it is: ECMAScript is the standard, JavaScript is the implementation that engines like V8 ship. The standard is maintained by TC39, the technical committee at Ecma International made up of browser vendors and other organizations. They evolve the language through a five-stage proposal process: Stage 0 is just an idea, Stage 1 says the problem is worth solving, Stage 2 produces the formal spec text, Stage 3 is a candidate where engines start implementing it and gathering feedback, and Stage 4 means it is finished — it has two independent implementations passing the Test262 conformance suite, so it gets merged into the standard. Since 2015 a new edition ships every year, which is why we have ES2015, ES2016, and so on; note that ES6 and ES2015 are the same release. The practical consequence is that engines adopt features at different times and users run old browsers, so we use feature detection, Babel to transpile new syntax, and core-js to polyfill missing built-ins, all driven by a browserslist config that declares which targets we support. Understanding the stages also tells you what is safe to use: Stage 3 and 4 are generally production-ready, earlier stages can still change.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Adopting new syntax early improves DX but risks transpilation bloat and, for pre-Stage-4 features, spec churn.',
      'Aggressive browserslist targets shrink bundles and boost speed but drop support for the long tail of old browsers.',
    ],
    edgeCases: [
      'Stage 3 features can change before finalization (e.g. historical decorator revisions), breaking early adopters on upgrade.',
      'Two engines can pass Test262 yet differ on unspecified or recently-specified edge behavior.',
      'Some proposals interact (e.g. private fields + decorators), so partial support can cause subtle build failures.',
    ],
    runtimeBehavior: [
      'Native features use optimized engine intrinsics; transpiled equivalents may run through slower userland code paths.',
      'Polyfills can monkey-patch built-ins, changing global behavior and occasionally clashing with other libraries.',
      'Async/generators lowered for old targets become state machines, changing stack traces and performance characteristics.',
    ],
    scalability: [
      'Differential serving (modern vs legacy bundles) scales bundle efficiency across a diverse user base.',
      'For libraries, shipping multiple ES targets lets consumers pick the right tradeoff for their own runtimes.',
    ],
    productionConcerns: [
      'Pin tool and proposal-plugin versions to avoid surprise behavior changes when a Stage-3 spec updates.',
      'Track Node/V8 versions so you know which features are native and skip unnecessary transpilation.',
      'Audit polyfill footprint; usage-based polyfilling avoids shipping shims users never need.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'ECMAScript = the spec (ECMA-262); JavaScript = the implementation.',
    'TC39 = the committee that maintains ECMAScript.',
    'Five stages: 0 idea, 1 proposal, 2 draft, 3 candidate, 4 finished.',
    'Stage 4 requires passing Test262 + two implementations.',
    'Annual editions since 2015; ES6 === ES2015.',
    'Engines implement the spec; Test262 checks conformance.',
    'New syntax → transpile with Babel; missing built-ins → polyfill with core-js.',
    'browserslist declares target environments for your build.',
    'Stage 3+ generally safe for production; earlier stages can change.',
    'Feature-detect when support is uncertain (typeof / in checks).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a feature-detection check that uses Array.prototype.at if available, else falls back to index math, to get the last element.',
      hint: 'Test typeof [].at === "function".',
      solution: {
        lang: 'js',
        code: `function last(arr) {\n  if (typeof arr.at === 'function') return arr.at(-1) // ES2022\n  return arr[arr.length - 1]                          // fallback\n}\nlast([10, 20, 30]) // 30`,
        explanation: [
          'Feature detection avoids assuming the engine supports the ES2022 method.',
          'The fallback keeps the function working on older engines.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Given a list of features, label each with the ECMAScript edition it was introduced in.',
      hint: 'Recall: let/const → ES2015, async/await → ES2017, optional chaining → ES2020.',
      solution: {
        lang: 'js',
        code: `const intro = {\n  'let/const': 'ES2015',\n  'arrow functions': 'ES2015',\n  'async/await': 'ES2017',\n  'optional chaining ?.': 'ES2020',\n  'nullish coalescing ??': 'ES2020',\n  'private fields #x': 'ES2022',\n}\nconsole.log(intro['async/await']) // ES2017`,
        explanation: [
          'Maps well-known features to their standardizing edition.',
          'Knowing these milestones helps you reason about support and transpilation.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain in code why a Stage-3 feature might need a Babel plugin, by showing source vs a conceptual lowered form.',
      hint: 'Private fields lower to a WeakMap pattern conceptually.',
      solution: {
        lang: 'js',
        code: `// SOURCE (modern, may be unsupported on old targets)\nclass Box { #v = 1; get() { return this.#v } }\n\n// CONCEPTUAL LOWERED FORM (what a transpiler emits)\nconst _v = new WeakMap()\nclass BoxLowered {\n  constructor() { _v.set(this, 1) }\n  get() { return _v.get(this) }\n}\nnew BoxLowered().get() // 1`,
        explanation: [
          'The modern `#v` private field is unsupported on some older targets.',
          'A transpiler conceptually rewrites it to a WeakMap keyed by the instance to emulate privacy.',
          'This is why advancing a proposal to Stage 4 plus tooling lets you write modern code safely.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate wants to ship a Stage-2 proposal feature to production. Write a short policy function/decision and justify it.',
      hint: 'Map stages to a go/no-go decision.',
      solution: {
        lang: 'js',
        code: `function isProductionSafe(stage) {\n  // Stage 4 = finished/standard; Stage 3 = candidate, usually safe with tooling\n  // Stage <= 2 = can still change significantly -> avoid in production\n  return stage >= 3\n}\nisProductionSafe(2) // false -> do not ship\nisProductionSafe(3) // true  -> ok with transpile/polyfill`,
        explanation: [
          'Stage 2 features can still change their syntax or semantics before finalization.',
          'Shipping them risks breakage when the spec updates and tooling follows.',
          'The policy returns false for Stage 2 and recommends waiting for Stage 3+.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing the spec/implementation distinction and the TC39 stages shows you see JavaScript as a governed, evolving standard. It directly informs real decisions: which features to use, when to polyfill, and how your build targets affect users.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the simple "difference between JavaScript and ECMAScript" and "what is ES6". Product companies (Zoho, Flipkart, Razorpay) probe the proposal stages and how you decide to adopt a feature. FAANG-level interviews discuss implementation skew, Test262, and differential serving strategy.',
    whatInterviewersExpect:
      'They expect you to separate spec from implementation, name the five stages and what Stage 4 means, know ES6 = ES2015, and connect it to practical tooling (Babel, polyfills, browserslist).',
  },
}

export default ecmascript
