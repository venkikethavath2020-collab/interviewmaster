import type { ConceptLesson } from '../../../types/lesson'

const javascriptEngines: ConceptLesson = {
  // 1. Concept Summary
  slug: 'javascript-engines',
  name: 'JavaScript Engines',
  category: 'fundamentals-engine',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The engine is the program that actually runs your JavaScript — understanding it explains performance, memory, and why some patterns are fast and others slow.',
    'It demystifies "interpreted vs compiled": engines interpret for fast startup, then JIT-compile hot code, so your code is both.',
    'Knowing the pipeline (parse → AST → bytecode → optimized machine code) lets you write engine-friendly code that the optimizer can keep fast.',
    'Different engines (V8, SpiderMonkey, JavaScriptCore) mean the same code can vary in speed and feature support, motivating testing and tooling.',
    'Interviewers use it to separate developers who treat JS as magic from those who understand the runtime as a system with stages and tradeoffs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A JavaScript engine is like a super-fast chef who reads your recipe and cooks it, getting quicker the more times you order the same dish.',
    story: [
      'Imagine you hand a chef a recipe written in your own words. The chef first reads it carefully and understands every step.',
      'The very first time, the chef cooks it slowly and plainly, just to get food on the table fast.',
      'But the chef notices you keep ordering the same dish over and over, so they memorize a super-efficient way to make it and start cooking it much faster.',
      'A JavaScript engine works the same way: it reads your code, runs it simply at first, then watches which parts run a lot and rewrites those into a turbo version so they run fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A JavaScript engine is a piece of software inside your browser (or Node.js) that takes your JavaScript code and runs it.',
    'First it reads the code and turns it into a structured form it understands, then it starts running it line by line quickly.',
    'While running, it keeps an eye on which functions are used a lot and converts those into faster machine instructions so the program speeds up over time.',
    'Different browsers use different engines — Chrome uses V8, Firefox uses SpiderMonkey, Safari uses JavaScriptCore — but they all follow the same ECMAScript rules.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A JavaScript engine is the program that parses, optimizes, and executes JavaScript. Examples: V8 (Chrome, Node, Edge), SpiderMonkey (Firefox), and JavaScriptCore/Nitro (Safari).',
    how: 'It lexes and parses source into an Abstract Syntax Tree, an interpreter generates and runs bytecode for fast startup, a profiler marks hot functions, and an optimizing compiler JIT-compiles them to machine code — deoptimizing back if assumptions break.',
    why: 'This interpret-then-JIT design balances fast startup (no long upfront compile) with high steady-state performance (native speed on hot paths).',
    code: {
      label: 'Code the engine will optimize when it gets hot',
      lang: 'js',
      code: `function add(a, b) {\n  return a + b           // called millions of times -> becomes "hot"\n}\n\nlet sum = 0\nfor (let i = 0; i < 1e6; i++) {\n  sum = add(sum, i)      // consistent types let the engine optimize\n}\nconsole.log(sum)`,
      explanation: [
        '`add` starts running as interpreted bytecode for a quick start.',
        'Because the loop calls it a million times, the profiler flags it as hot.',
        'The optimizing JIT compiles `add` to machine code, assuming `a` and `b` are always numbers.',
        'Consistent number arguments keep the optimized code valid; mixing in strings later could trigger deoptimization.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A JavaScript engine is a runtime component that executes ECMAScript. It tokenizes and parses source into an AST, compiles it to bytecode run by an interpreter (e.g. V8\'s Ignition), profiles execution to identify hot code, and uses an optimizing JIT compiler (e.g. V8\'s TurboFan) to emit speculative, type-specialized machine code. When speculative assumptions are violated, the engine deoptimizes back to bytecode. It also manages the heap and a garbage collector. The engine implements only the language; host environments add APIs (DOM, fetch, fs).',

  // 7. Internal Working
  internalWorking: [
    'Lexing/Parsing: the source text is tokenized and parsed into an Abstract Syntax Tree (AST); lazy parsing may defer fully parsing functions until first call.',
    'Baseline/Interpreter: the AST is compiled to bytecode which an interpreter (Ignition in V8) executes immediately, giving fast startup without waiting for full compilation.',
    'Profiling: while running, the engine collects feedback — how often functions run, what types they see — to decide what is "hot".',
    'Optimizing JIT: hot functions are sent to an optimizing compiler (TurboFan) that emits type-specialized machine code based on observed types and hidden classes.',
    'Deoptimization: if a speculative assumption fails (e.g. an argument that was always a number is suddenly a string), the engine bails out (deopts) back to bytecode and may re-optimize later.',
    'Memory management: objects live on the heap; a generational garbage collector reclaims unreachable memory, while the engine also manages the call stack for execution contexts.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SOURCE
     │ lex + parse
     ▼
    AST ──► bytecode ──► [ INTERPRETER ]  (fast start, runs everything)
                              │ profiling feedback (hot? types?)
                              ▼
                       [ OPTIMIZING JIT ] ──► native machine code (fast)
                              ▲                       │
                              │   assumption broken?  │
                              └────── DEOPT ◄──────────┘
                              (fall back to bytecode)

   Alongside:  HEAP + Garbage Collector   |   CALL STACK`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: the engine maintains a call stack of execution contexts; each function call pushes a frame with its local bindings and pops on return.',
    'HEAP: objects, arrays, functions, and closures are allocated on the heap; variables on the stack hold references into it.',
    'GENERATIONAL GC: most objects die young, so the heap is split into a young generation (frequent, cheap scavenges) and an old generation (rarer, fuller collections).',
    'OPTIMIZED CODE CACHE: compiled machine code and feedback (hidden classes, inline caches) are stored so repeated calls reuse fast paths.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — same code, different engines',
      lang: 'js',
      code: `// This runs on V8 (Chrome/Node), SpiderMonkey (Firefox),\n// and JavaScriptCore (Safari) — all implement ECMAScript.\nconst nums = [3, 1, 2]\nconsole.log(nums.sort((a, b) => a - b)) // [1, 2, 3] everywhere`,
      explanation: [
        'The code uses only standard ECMAScript, so every engine runs it identically.',
        'Each engine may sort with a different algorithm internally, but the observable result conforms to the spec.',
        'Performance can differ between engines even with identical output.',
        'This is why cross-browser testing still matters despite a shared standard.',
      ],
    },
    intermediate: {
      label: 'Intermediate — helping the optimizer with stable shapes',
      lang: 'js',
      code: `// Optimizer-friendly: every point has the SAME shape\nfunction makePoint(x, y) { return { x, y } }\nconst pts = []\nfor (let i = 0; i < 1000; i++) pts.push(makePoint(i, i))\n\n// Optimizer-hostile: shapes diverge -> polymorphic/megamorphic\n// pts.push({ x: 1 })           // missing y\n// pts.push({ y: 2, x: 1 })     // different key order`,
      explanation: [
        'Creating objects with identical key sets and order lets the engine reuse one hidden class.',
        'Inline caches then stay monomorphic, so property access compiles to a fast field offset.',
        'Diverging shapes force the engine into polymorphic or megamorphic lookups, which are slower.',
        'Stable object shapes are one of the most practical engine-friendly habits.',
      ],
    },
    advanced: {
      label: 'Advanced — triggering a deoptimization',
      lang: 'js',
      code: `function addStuff(a, b) { return a + b }\n\n// Warm up with numbers -> engine optimizes for number + number\nfor (let i = 0; i < 1e5; i++) addStuff(i, i)\n\n// Now pass strings -> assumption broken -> DEOPT, then re-profile\naddStuff('x', 'y')\nfor (let i = 0; i < 1e5; i++) addStuff('a', 'b')`,
      explanation: [
        'The first loop teaches the optimizer that `addStuff` adds numbers, so it specializes for that.',
        'Calling it with strings violates the speculation, forcing a deoptimization back to bytecode.',
        'The engine re-profiles and may re-optimize for the new type mix, but the bailout costs time.',
        'In hot paths, keeping argument types consistent avoids these performance cliffs.',
      ],
    },
    realProject: {
      label: 'Real project — engine awareness in a Node/Vue render loop',
      lang: 'js',
      code: `// Node hot path: keep records monomorphic for steady throughput\nfunction normalizeUser(row) {\n  // always return the same shape, fill missing with null\n  return { id: row.id, name: row.name ?? null, email: row.email ?? null }\n}\n// In a Vue list render, returning consistently shaped view-model\n// objects keeps array methods and the engine's caches fast.\nconst users = rows.map(normalizeUser)`,
      explanation: [
        'A request handler that returns uniformly shaped records keeps V8\'s hidden classes stable across rows.',
        'Filling missing fields with `null` (instead of omitting them) preserves a single object shape.',
        'In Vue, consistently shaped view-model objects keep map/filter and property access on a fast path.',
        'This is engine knowledge applied: small habits that keep the JIT optimizations valid under load.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a JavaScript engine and can you name some?',
      answer: 'It is the program that parses and executes JavaScript. Major engines are V8 (Chrome, Node, Edge), SpiderMonkey (Firefox), and JavaScriptCore (Safari).',
      explanation: 'Naming the engine-to-browser mapping shows basic runtime literacy.',
    },
    {
      level: 'beginner',
      question: 'Is JavaScript interpreted or compiled?',
      answer: 'Both. Modern engines interpret bytecode for a fast start and JIT-compile frequently executed (hot) code into optimized machine code for speed.',
      explanation: 'The mature answer rejects the binary and names the interpret-then-JIT model.',
    },
    {
      level: 'intermediate',
      question: 'Walk me through how V8 executes a function.',
      answer: 'It parses source into an AST, compiles to bytecode run by the Ignition interpreter, profiles execution, and sends hot functions to the TurboFan optimizing compiler which emits type-specialized machine code. If assumptions break, it deoptimizes back to bytecode.',
      explanation: 'Listing the pipeline stages with the V8 component names (Ignition, TurboFan) is a strong intermediate answer.',
    },
    {
      level: 'intermediate',
      question: 'What is JIT compilation and why use it?',
      answer: 'Just-In-Time compilation compiles code to machine code at runtime, after observing how it behaves. It combines fast startup (interpret first) with high performance (compile hot paths) and can specialize based on actual runtime types.',
      explanation: 'Connects JIT to the startup-vs-speed tradeoff that motivates the design.',
    },
    {
      level: 'advanced',
      question: 'What is deoptimization and what can trigger it?',
      answer: 'Deoptimization is when the engine discards optimized machine code and falls back to bytecode because a speculative assumption was violated — e.g. an argument type changed, an object\'s hidden class changed, or accessing a deleted property. The engine may re-optimize later.',
      explanation: 'Senior-leaning: shows you understand the speculative nature of the JIT and the cost of breaking assumptions.',
    },
    {
      level: 'senior',
      question: 'How do hidden classes and inline caches affect engine performance?',
      answer: 'Engines assign objects hidden classes (shapes) based on their structure; objects with identical structure share a hidden class. Inline caches remember where a property lives for a given shape, so repeated access is a fast offset lookup. Diverging shapes cause polymorphic/megamorphic caches and slower lookups, and can prevent or undo optimization.',
      explanation: 'Demonstrates deep engine understanding linking object shape stability to real performance.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Ignition and TurboFan?',
    'What is a hidden class / shape and how is it created?',
    'What does it mean for code to be monomorphic vs megamorphic?',
    'How does the garbage collector work in V8?',
    'Why might the same code be slower in one browser than another?',
    'How would you profile and diagnose a slow hot path?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing JavaScript is "just interpreted and slow".',
      why: 'It ignores modern JIT compilation that reaches near-native speed on hot code.',
      fix: 'Explain interpret-then-JIT: fast start via bytecode, fast steady-state via optimized machine code.',
    },
    {
      mistake: 'Micro-optimizing prematurely based on guessed engine behavior.',
      why: 'Engine heuristics change between versions; guesses are often wrong and hurt readability.',
      fix: 'Profile first with DevTools/Node profilers; optimize measured hot paths, not assumptions.',
    },
    {
      mistake: 'Creating objects with inconsistent shapes in hot paths.',
      why: 'Diverging shapes break hidden-class sharing and inline caches, slowing property access.',
      fix: 'Initialize all fields up front in a consistent order; avoid adding/deleting properties later.',
    },
    {
      mistake: 'Assuming all engines behave identically because they share a spec.',
      why: 'Optimization heuristics, feature timing, and edge-case bugs differ between V8, SpiderMonkey, and JSC.',
      fix: 'Test across target browsers and use polyfills/transpilation for feature gaps.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue\'s compiled render functions and reactivity run on the browser engine; keeping component data shapes stable helps the engine keep list rendering on optimized paths.' },
    { area: 'React', detail: 'React reconciliation runs as plain JS on the engine; avoiding shape churn in props/state and minimizing allocations in render reduces GC pressure that the engine must handle.' },
    { area: 'Node.js', detail: 'Node embeds V8; choosing a Node LTS pins the V8/engine version, and engine flags (e.g. --max-old-space-size) tune heap and GC for server workloads.' },
    { area: 'Backend', detail: 'High-throughput services profile hot paths and keep records monomorphic so V8 keeps them optimized, directly affecting request latency and CPU cost.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Hot, type-stable code gets JIT-compiled to fast machine code with inline-cached property access.',
      'Generational GC makes short-lived allocations cheap, suiting typical request/render churn.',
    ],
    bad: [
      'Type instability and shape churn cause deoptimizations and slow megamorphic lookups.',
      'Excessive allocation in hot paths raises GC frequency and pause time, hurting latency.',
    ],
    optimizations: [
      'Keep argument types and object shapes consistent so functions stay monomorphic and optimized.',
      'Initialize object fields once in a fixed order; avoid delete and late property additions.',
      'Reduce allocations in hot loops (reuse arrays/objects where safe) to ease GC pressure.',
      'Profile with DevTools/--prof and only optimize measured hot spots; let the engine handle the rest.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript', 'ecmascript'],
    nextConcepts: ['v8-architecture', 'jit-compilation', 'hidden-classes-inline-caches', 'garbage-collection', 'call-stack'],
    dependencyNote:
      'This is the gateway to the deep engine track: it overviews the pipeline that v8-architecture, jit-compilation, and hidden-classes-inline-caches each zoom into, and it touches the memory/GC and call-stack concepts.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write SOURCE at the top, draw an arrow to AST (parse).',
      'Arrow from AST to "bytecode → Interpreter (Ignition)" labeled "fast start".',
      'Branch off with "profiling: hot?" into "Optimizing JIT (TurboFan) → machine code".',
      'Draw a loop-back arrow labeled DEOPT from machine code to bytecode when assumptions break.',
      'Say: "Engines interpret for fast startup, JIT-compile hot type-stable code, and deopt when speculation fails."',
    ],
    diagram: `  SOURCE → AST → bytecode → INTERPRETER (fast start)
                                 │ profile (hot? types?)
                                 ▼
                        OPTIMIZING JIT → machine code (fast)
                                 ▲                │
                                 └─── DEOPT ◄─────┘  (assumption broke)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A JavaScript engine parses your code into an AST, runs it as bytecode through an interpreter for a fast start, profiles which functions are hot, and JIT-compiles those into optimized, type-specialized machine code. If a speculative assumption breaks — like an argument type or object shape changing — it deoptimizes back to bytecode. V8 (Chrome/Node), SpiderMonkey (Firefox), and JavaScriptCore (Safari) all do this. Keeping types and object shapes stable keeps your hot code fast.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A JavaScript engine is the program that actually runs JavaScript — V8 in Chrome and Node, SpiderMonkey in Firefox, JavaScriptCore in Safari. The pipeline is the key thing to understand. First the engine lexes and parses your source into an Abstract Syntax Tree. Then, rather than fully compiling everything up front, it compiles to bytecode and runs that through an interpreter — in V8 that is Ignition — which gives a fast startup. While the program runs, the engine profiles it: it watches which functions execute frequently and what types they see. The functions that are "hot" get sent to an optimizing JIT compiler — TurboFan in V8 — which emits type-specialized machine code based on those observations, so steady-state performance approaches native speed. The catch is that this optimization is speculative: it assumes, say, that a function always adds numbers, or that an object always has the same shape. If that assumption is violated, the engine deoptimizes, throwing away the optimized code and falling back to bytecode, then possibly re-optimizing. That is why type stability and consistent object shapes matter for performance — they keep inline caches monomorphic and avoid deopts. Alongside execution, the engine manages a heap with a generational garbage collector and the call stack. The practical takeaway: don\'t guess, profile; and keep hot paths type-stable.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Interpret-then-JIT trades a little extra runtime work and memory (storing bytecode + machine code + feedback) for both fast startup and fast steady state.',
      'Speculative optimization is powerful but fragile: aggressive specialization risks deopt cliffs if real-world types are diverse.',
    ],
    edgeCases: [
      'Deopt loops: code that oscillates between type assumptions can repeatedly optimize/deopt, performing worse than plain interpretation.',
      'Hidden-class transitions from `delete` or late property addition silently degrade access performance.',
      'Lazy parsing means a syntax error in an unused function may surface only when it is first called.',
    ],
    runtimeBehavior: [
      'Inline caches start uninitialized, become monomorphic, then polymorphic/megamorphic as more shapes are seen, each step slower.',
      'GC pauses (especially major/old-generation collections) introduce latency spikes; allocation rate drives frequency.',
      'Engine versions change heuristics, so a pattern fast today may not be fast on the next release.',
    ],
    scalability: [
      'In long-lived servers, sustained type-stable hot paths stay optimized; shape churn under load causes throughput degradation.',
      'Heap sizing and GC tuning (e.g. V8 flags) matter for high-memory services to avoid frequent or long pauses.',
    ],
    productionConcerns: [
      'Pin engine/Node versions so performance characteristics are reproducible across deploys.',
      'Profile in production-like conditions; microbenchmarks often mislead because the JIT behaves differently at scale.',
      'Watch GC metrics and allocation rate as first-class production signals alongside CPU and latency.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Engine = parses + optimizes + executes JS (V8, SpiderMonkey, JavaScriptCore).',
    'Pipeline: source → AST → bytecode (interpreter) → JIT machine code (hot).',
    'V8 components: Ignition (interpreter), TurboFan (optimizing JIT).',
    'Interpret-then-JIT = fast start + fast steady state.',
    'Optimization is speculative; broken assumptions cause DEOPT.',
    'Hidden classes/shapes + inline caches make property access fast.',
    'Monomorphic > polymorphic > megamorphic (slower as shapes diverge).',
    'Keep argument types and object shapes stable in hot paths.',
    'Generational GC: young (cheap) + old (costly) generations.',
    'Profile before optimizing; engine heuristics change per version.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function that always returns objects with the same shape (id, name) even when name is missing.',
      hint: 'Fill missing fields with null to preserve one hidden class.',
      solution: {
        lang: 'js',
        code: `function toRecord(row) {\n  return { id: row.id, name: row.name ?? null }\n}\ntoRecord({ id: 1, name: 'Ada' }) // { id: 1, name: 'Ada' }\ntoRecord({ id: 2 })              // { id: 2, name: null }`,
        explanation: [
          'Both calls produce the same key set in the same order, so the engine reuses one hidden class.',
          'Filling `name` with `null` avoids a divergent shape that would slow property access.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Demonstrate code that the engine optimizes, then a single line that would cause a deoptimization, with comments.',
      hint: 'Warm up with one type, then pass another.',
      solution: {
        lang: 'js',
        code: `function square(x) { return x * x }\nfor (let i = 0; i < 1e5; i++) square(i) // optimized for numbers\n\nsquare('5') // string coerces; breaks the number assumption -> deopt risk`,
        explanation: [
          'The loop makes `square` hot and the JIT specializes it for numeric input.',
          'Passing a string violates the speculation and can trigger a deoptimization.',
          'Keeping the argument numeric preserves the optimized code path.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show how using delete on a hot object can degrade performance, and the better alternative.',
      hint: 'delete changes the hidden class; setting to null/undefined keeps the shape.',
      solution: {
        lang: 'js',
        code: `// BAD: delete transitions the hidden class -> slower access afterward\nfunction clearBad(o) { delete o.temp; return o }\n\n// BETTER: keep the shape, just clear the value\nfunction clearGood(o) { o.temp = null; return o }`,
        explanation: [
          '`delete` removes a property and forces the engine to change the object\'s hidden class.',
          'Subsequent property accesses may fall off the optimized fast path.',
          'Assigning `null` preserves the shape, keeping inline caches valid and access fast.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with a small profiling-style snippet, how you would decide whether a function is worth optimizing.',
      hint: 'Measure call frequency and time before changing anything.',
      solution: {
        lang: 'js',
        code: `function timeIt(fn, iters) {\n  const t0 = performance.now()\n  for (let i = 0; i < iters; i++) fn(i)\n  return performance.now() - t0\n}\n\nconst cost = timeIt((i) => i * i, 1e6)\nconsole.log('ms for 1e6 calls:', cost)\n// Only optimize if this is a measured hot path in a real profile.`,
        explanation: [
          'Measuring total time across many iterations approximates the cost of a hot path.',
          'Real decisions should use a profiler (DevTools / --prof) on realistic workloads, not microbenchmarks alone.',
          'The principle: measure first, optimize the proven hot spots, and let the engine handle the rest.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Understanding the engine turns JavaScript from magic into a system you can reason about: why startup is fast, why hot code speeds up, and why type/shape instability causes performance cliffs. It underpins every serious performance discussion.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "name some engines" and "is JS interpreted or compiled". Product companies (Zoho, Flipkart, Razorpay) want the parse→bytecode→JIT pipeline and what causes deopts. FAANG-level interviews go into hidden classes, inline caches, GC, and how to profile and keep hot paths optimized.',
    whatInterviewersExpect:
      'They expect you to name major engines, describe the interpret-then-JIT pipeline (with V8\'s Ignition/TurboFan if you can), explain speculative optimization and deoptimization, and connect type/shape stability to real performance, with a "profile before optimizing" mindset.',
  },
}

export default javascriptEngines
