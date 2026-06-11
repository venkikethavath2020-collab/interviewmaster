import type { ConceptLesson } from '../../../types/lesson'

const v8Architecture: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v8-architecture',
  name: 'V8 Architecture',
  category: 'fundamentals-engine',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'V8 powers Chrome, Edge, Node.js, Deno, and Electron, so understanding it explains the runtime behind most JavaScript you ship.',
    'Knowing its components (Ignition, TurboFan, Sparkplug/Maglev, Orinoco GC) lets you reason about startup cost, steady-state speed, and pause times.',
    'It explains the tiered compilation model — why functions start slow and get fast, and how warm-up affects benchmarks and cold starts.',
    'V8 flags and heap tuning (e.g. --max-old-space-size) are real production levers for memory-heavy Node services.',
    'Senior interviews use it to test whether you understand the engine as a tiered, GC-managed system rather than a black box.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'V8 is like a kitchen with several cooks of increasing skill, plus a cleaner who clears away dishes you are no longer using.',
    story: [
      'Imagine a kitchen where a new order comes in. A quick line cook starts making it right away so you do not wait.',
      'If lots of people keep ordering the same dish, a more skilled chef steps in and prepares a special, much faster version of just that dish.',
      'Meanwhile a cleaner walks around collecting plates and ingredients nobody is using anymore, so the kitchen never runs out of space.',
      'V8 works like this kitchen: a fast simple cook (interpreter) starts everything, better cooks (compilers) take over the popular dishes (hot functions), and the cleaner (garbage collector) frees up memory you no longer need.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'V8 is the engine Google built to run JavaScript fast; it is used by Chrome and by Node.js on servers.',
    'It does not just run your code one way — it has several "levels", starting simple and switching popular code to faster versions as the program runs.',
    'It also has a garbage collector that automatically finds memory your program no longer uses and frees it so the program keeps running smoothly.',
    'All these parts work together so JavaScript starts quickly and then becomes very fast on the parts that run a lot.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'V8 is Google\'s open-source JavaScript (and WebAssembly) engine. Its core pieces are the parser, the Ignition interpreter, the optimizing compilers (Sparkplug/Maglev/TurboFan), the Orinoco generational garbage collector, and the object model based on hidden classes and inline caches.',
    how: 'Source is parsed to an AST, Ignition runs bytecode for fast startup, and a tiered set of compilers progressively optimizes hot functions into machine code; the GC reclaims unreachable heap objects in the background.',
    why: 'This tiered design gives both fast startup (crucial for page load and serverless cold starts) and high peak performance, while automatic memory management keeps developers from manual allocation.',
    code: {
      label: 'Code that walks through V8 tiers as it warms up',
      lang: 'js',
      code: `function hot(n) {\n  let s = 0\n  for (let i = 0; i < n; i++) s += i\n  return s\n}\n\n// First calls: Ignition bytecode (cold)\nhot(10)\n// Many calls: Sparkplug/Maglev then TurboFan optimize it (hot)\nfor (let k = 0; k < 1e5; k++) hot(1000)`,
      explanation: [
        'The first `hot(10)` runs as Ignition bytecode — fast to start, not yet optimized.',
        'Repeated calls make `hot` a candidate for V8\'s tiered compilers.',
        'Mid-tiers (Sparkplug/Maglev) and then TurboFan produce faster machine code as confidence grows.',
        'By the end of the loop, `hot` is running highly optimized native code.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'V8 is a tiered JavaScript/WebAssembly engine. It parses source to an AST and compiles to bytecode executed by the Ignition register-based interpreter. Hot code is progressively optimized through tiers — Sparkplug (fast baseline JIT), Maglev (mid-tier optimizer), and TurboFan (top-tier speculative optimizer) — guided by feedback vectors, hidden classes (Maps), and inline caches. Speculation failures trigger deoptimization to bytecode. Memory is managed by Orinoco, a generational, mostly-concurrent, parallel garbage collector that splits the heap into young (scavenge) and old (mark-compact) generations.',

  // 7. Internal Working
  internalWorking: [
    'Parsing: V8 scans and parses source into an AST, using lazy/pre-parsing to defer fully compiling functions until they are first called, reducing startup cost.',
    'Ignition: the AST is compiled to compact bytecode that the Ignition interpreter executes immediately; Ignition also records type feedback in feedback vectors.',
    'Sparkplug: a non-optimizing baseline compiler quickly turns bytecode into machine code (no IR, near-instant) to remove interpreter overhead for warm functions.',
    'Maglev/TurboFan: as functions get hotter, Maglev (mid-tier) and then TurboFan (top-tier) use the collected feedback to emit speculative, type-specialized optimized machine code.',
    'Deoptimization: if speculation is violated (type change, shape change, etc.), V8 bails out (deopts) to Ignition bytecode and may re-tier later.',
    'Orinoco GC: the heap is split into a young generation (cheap, frequent Scavenger collections using two semi-spaces) and an old generation (Mark-Compact), with much work done concurrently/in parallel to minimize main-thread pauses.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SOURCE ─► Parser ─► AST ─► bytecode
                                  │
                                  ▼
                          ┌──────────────┐  records feedback
                          │  IGNITION    │  (interpreter)
                          └──────┬───────┘
                 warm │ hot      │ hotter        │ hottest
                      ▼          ▼               ▼
                 SPARKPLUG → MAGLEV ──────► TURBOFAN
                 (baseline) (mid-tier)     (top-tier optimizer)
                      ▲           ▲              │
                      └─────── DEOPT ◄───────────┘ (speculation broke)

   MEMORY:  Orinoco GC  ──  Young gen (Scavenger) + Old gen (Mark-Compact)
            Objects use HIDDEN CLASSES (Maps) + INLINE CACHES`,

  // 9. Memory Visualization
  memoryVisualization: [
    'YOUNG GENERATION: new objects are allocated here; the Scavenger uses two semi-spaces (from/to) and copies live objects between them, which is cheap because most young objects die fast.',
    'OLD GENERATION: objects that survive a couple of scavenges are promoted here and collected by the slower Mark-Compact collector, which marks reachable objects then compacts to reduce fragmentation.',
    'HIDDEN CLASSES (Maps): every object points to a hidden class describing its shape and property offsets; adding properties transitions to new hidden classes.',
    'INLINE CACHES + FEEDBACK VECTORS: call sites cache the shapes/types they have seen so repeated access compiles to fast offset lookups; this feedback drives the optimizing tiers.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — where V8 runs',
      lang: 'js',
      code: `// All of these embed V8:\n// - Chrome / Edge (browser)\n// - Node.js (process.versions.v8 shows the version)\nconsole.log(typeof process !== 'undefined' ? process.versions.v8 : 'browser V8')`,
      explanation: [
        'V8 is not browser-only — Node.js embeds the same engine.',
        'In Node, `process.versions.v8` reports the exact V8 version powering the runtime.',
        'Knowing your V8 version tells you which language features and optimizations are present.',
        'Deno and Electron also embed V8, so the same architecture applies broadly.',
      ],
    },
    intermediate: {
      label: 'Intermediate — tiering up by warming a function',
      lang: 'js',
      code: `function dot(a, b) {\n  let s = 0\n  for (let i = 0; i < a.length; i++) s += a[i] * b[i]\n  return s\n}\nconst x = [1, 2, 3], y = [4, 5, 6]\n// Repeated, type-stable calls let V8 promote dot through its tiers\nfor (let i = 0; i < 1e6; i++) dot(x, y)`,
      explanation: [
        'The first calls run on Ignition bytecode while V8 collects type feedback.',
        'Stable array-of-number inputs let V8 specialize the arithmetic in higher tiers.',
        'Sparkplug removes interpreter overhead, then TurboFan emits optimized loop code.',
        'Type stability across the million iterations keeps the optimized version valid.',
      ],
    },
    advanced: {
      label: 'Advanced — observing GC generations conceptually',
      lang: 'js',
      code: `// Short-lived allocations stay in the young generation (cheap Scavenger)\nfunction makeTemp() { return { a: 1, b: 2 } } // dies almost immediately\nfor (let i = 0; i < 1e6; i++) makeTemp()\n\n// Long-lived data gets promoted to the old generation\nconst cache = []\nfor (let i = 0; i < 1e4; i++) cache.push({ id: i }) // survives -> promoted`,
      explanation: [
        'The temp objects in the loop are unreachable immediately, so the Scavenger reclaims them cheaply in the young generation.',
        'The `cache` array keeps its objects reachable, so after surviving scavenges they are promoted to the old generation.',
        'Old-generation collection (Mark-Compact) is more expensive, so growing long-lived structures raises GC cost.',
        'This is why high allocation churn vs long-lived retention have very different GC profiles.',
      ],
    },
    realProject: {
      label: 'Real project — tuning V8 heap in a Node service',
      lang: 'js',
      code: `// Start a memory-heavy Node service with a larger old-space heap:\n//   node --max-old-space-size=4096 server.js\n\n// Inside the app, watch heap usage to catch leaks/promotion pressure:\nsetInterval(() => {\n  const m = process.memoryUsage()\n  console.log('heapUsed MB:', (m.heapUsed / 1048576).toFixed(1))\n}, 5000)`,
      explanation: [
        '`--max-old-space-size` raises V8\'s old-generation limit so large heaps do not OOM-crash.',
        'Monitoring `process.memoryUsage().heapUsed` reveals growth trends and possible leaks.',
        'Rising heapUsed that never drops after GC suggests retained references (promotion pressure or a leak).',
        'These are concrete production levers that come directly from understanding V8\'s heap model.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is V8 and where is it used?',
      answer: 'V8 is Google\'s open-source JavaScript and WebAssembly engine, written in C++. It powers Chrome and Edge, and it is embedded in Node.js, Deno, and Electron.',
      explanation: 'Establishes that V8 is broader than just Chrome — it is the runtime for server JS too.',
    },
    {
      level: 'intermediate',
      question: 'What are Ignition and TurboFan?',
      answer: 'Ignition is V8\'s register-based bytecode interpreter that runs code at startup and collects type feedback. TurboFan is the top-tier optimizing compiler that turns hot, type-profiled functions into optimized machine code.',
      explanation: 'Naming the two classic components and their roles is the expected intermediate baseline.',
    },
    {
      level: 'intermediate',
      question: 'Why does V8 use a tiered compilation approach?',
      answer: 'To balance fast startup with high peak performance. Interpreting bytecode starts instantly; cheaper baseline compilers (Sparkplug) remove interpreter overhead; and expensive optimizers (Maglev, TurboFan) are reserved for functions hot enough to justify the cost.',
      explanation: 'Shows understanding of the startup-vs-throughput tradeoff that motivates multiple tiers.',
    },
    {
      level: 'advanced',
      question: 'How does V8\'s garbage collector (Orinoco) work?',
      answer: 'It is generational: a young generation collected by a fast Scavenger (copying between two semi-spaces) and an old generation collected by Mark-Compact. Surviving young objects are promoted to old. Much of the work is concurrent and parallel to keep main-thread pauses short.',
      explanation: 'Senior-level: generational hypothesis, the two collectors, promotion, and concurrency for low pause times.',
    },
    {
      level: 'senior',
      question: 'What roles do hidden classes and inline caches play in V8?',
      answer: 'Hidden classes (internally "Maps") describe object shapes and property offsets so V8 can access properties by fixed offset instead of dictionary lookup. Inline caches at call sites remember the shapes/types seen and feed the optimizing tiers. Consistent shapes keep ICs monomorphic and code optimized; divergence causes polymorphism, megamorphism, and deopts.',
      explanation: 'Connects the object model to the optimization pipeline and to real performance behavior.',
    },
    {
      level: 'senior',
      question: 'What is deoptimization in V8 and what triggers it?',
      answer: 'Deoptimization discards optimized machine code and resumes execution in Ignition bytecode because a speculative assumption failed — a type change, hidden-class change, out-of-bounds access, or accessing a deleted/undefined property in a way the optimizer did not expect. V8 may re-tier the function later.',
      explanation: 'Demonstrates understanding that optimization is speculative and reversible, with concrete triggers.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Sparkplug, Maglev, and TurboFan?',
    'What is a feedback vector and how does it drive optimization?',
    'How does the Scavenger differ from Mark-Compact?',
    'What does --max-old-space-size control and when would you raise it?',
    'How would you diagnose a memory leak in a Node/V8 process?',
    'How are WebAssembly modules executed within V8?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking V8 only matters for browsers.',
      why: 'It ignores that Node.js, Deno, and Electron embed V8, so server and desktop performance depend on it too.',
      fix: 'Treat V8 as the shared runtime; tuning and engine-friendly code apply to Node services as much as the browser.',
    },
    {
      mistake: 'Writing microbenchmarks without warming up the function.',
      why: 'V8 tiers code over time; measuring only cold runs misrepresents steady-state performance.',
      fix: 'Warm up with many iterations before timing, and prefer real-workload profiling over microbenchmarks.',
    },
    {
      mistake: 'Letting object shapes diverge in hot code.',
      why: 'Shape churn breaks hidden-class sharing and inline caches, causing polymorphism and deopts.',
      fix: 'Initialize all properties once in a fixed order; avoid delete and late additions in hot paths.',
    },
    {
      mistake: 'Ignoring GC and heap metrics until the process crashes.',
      why: 'Memory leaks and promotion pressure build silently until an OOM or long pauses appear.',
      fix: 'Monitor heapUsed and GC pauses; set --max-old-space-size appropriately and chase retained references.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Node embeds V8; choosing a Node LTS pins the V8 version and feature/optimization set, and V8 flags (--max-old-space-size, --max-semi-space-size) tune the heap for the workload.' },
    { area: 'Backend', detail: 'High-throughput services keep hot handlers type-stable so V8 keeps them in TurboFan, and they watch GC pause times as a latency signal.' },
    { area: 'Vue', detail: 'Vue apps run on V8 in the browser; minimizing allocations and shape churn in render-heavy components reduces young-generation GC pressure during interactions.' },
    { area: 'React', detail: 'React rendering is plain JS on V8; stable component data shapes and fewer per-render allocations keep inline caches monomorphic and ease GC during reconciliation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Tiered compilation gives fast cold starts (Ignition/Sparkplug) and high peak throughput (TurboFan) for hot code.',
      'The generational Scavenger makes short-lived allocations very cheap, suiting typical render/request churn.',
    ],
    bad: [
      'Shape/type instability causes deopts and pushes inline caches into slow megamorphic states.',
      'High retention/allocation pushes objects into the old generation, making Mark-Compact pauses more frequent and longer.',
    ],
    optimizations: [
      'Keep object shapes and argument types stable so functions stay in higher tiers.',
      'Reduce allocations in hot loops and reuse buffers/objects to keep work in the cheap young generation.',
      'Warm up critical paths and profile with real workloads; use --prof or Chrome DevTools for V8 traces.',
      'Tune heap flags for memory-heavy services and monitor GC pause metrics in production.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['javascript-engines', 'jit-compilation', 'garbage-collection'],
    nextConcepts: ['hidden-classes-inline-caches', 'memory-leaks', 'memory-profiling', 'stack-vs-heap'],
    dependencyNote:
      'Deepens javascript-engines and jit-compilation with V8 specifics, and pairs tightly with garbage-collection and hidden-classes-inline-caches; it feeds directly into memory-leaks and memory-profiling work.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the linear flow: Source → Parser → AST → bytecode → Ignition (interpreter).',
      'Below Ignition, draw three boxes left-to-right: Sparkplug (baseline) → Maglev (mid) → TurboFan (top).',
      'Add an arrow labeled "feedback" from Ignition feeding the optimizers, and a DEOPT arrow back from TurboFan to bytecode.',
      'Off to the side, draw the heap: Young gen (Scavenger) and Old gen (Mark-Compact) under "Orinoco GC".',
      'Say: "V8 tiers code from interpreter to optimized machine code using runtime feedback, deopts when speculation breaks, and manages memory with a generational GC."',
    ],
    diagram: `  Source→Parser→AST→bytecode→IGNITION ──feedback──┐
                                                    ▼
            SPARKPLUG → MAGLEV → TURBOFAN (optimized native code)
                                     │ DEOPT ▲
                                     └───────┘
   ORINOCO GC:  Young(Scavenger)  +  Old(Mark-Compact)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'V8 is Google\'s JS/Wasm engine behind Chrome, Node, Deno, and Electron. It parses to an AST, runs bytecode on the Ignition interpreter for fast startup, then tiers hot code up through Sparkplug, Maglev, and TurboFan into optimized machine code using runtime feedback, hidden classes, and inline caches. Broken speculation triggers deoptimization. Memory is managed by the generational Orinoco GC: a cheap Scavenger for the young generation and Mark-Compact for the old. Stable shapes and low allocation keep it fast.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'V8 is Google\'s open-source JavaScript and WebAssembly engine, written in C++, and it is not just Chrome — Node.js, Deno, and Electron all embed it, so it is the runtime behind most JavaScript we ship. Its defining feature is tiered execution. Source is parsed into an AST and compiled to bytecode, which the Ignition interpreter runs immediately for fast startup while collecting type feedback in feedback vectors. As a function gets warm, Sparkplug — a fast baseline compiler — turns bytecode into machine code to remove interpreter overhead. As it gets hotter, Maglev and then TurboFan use the collected feedback to emit speculative, type-specialized optimized code. The optimization is speculative, so if an assumption breaks — a type changes, an object\'s hidden class changes, an out-of-bounds access — V8 deoptimizes back to bytecode and may re-tier later. Underpinning all this is the object model: hidden classes describe object shapes so properties are accessed by fixed offset, and inline caches at call sites remember the shapes seen, which keeps access fast as long as shapes stay consistent. Memory is handled by Orinoco, a generational, mostly-concurrent GC: a cheap Scavenger collects the young generation by copying live objects between semi-spaces, and Mark-Compact handles the old generation. Practically, this is why I keep object shapes stable, minimize allocations in hot paths, warm up before benchmarking, and tune heap flags like --max-old-space-size for memory-heavy Node services.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'More tiers (Sparkplug/Maglev/TurboFan) improve the latency-to-peak-performance curve but cost memory (multiple code versions + feedback) and engineering complexity.',
      'Speculative optimization maximizes throughput but introduces deopt cliffs when real-world inputs are polymorphic.',
    ],
    edgeCases: [
      'Deopt loops where a function repeatedly optimizes and bails out can be slower than staying interpreted.',
      'Large objects or arrays may bypass the young generation and pressure the old generation directly.',
      'Lazy parsing can delay surfacing of errors in never-called functions until first invocation.',
    ],
    runtimeBehavior: [
      'Inline caches progress uninitialized → monomorphic → polymorphic → megamorphic, each step slower; megamorphic sites resist optimization.',
      'Scavenges are frequent and cheap; old-generation Mark-Compact is rarer but can cause noticeable pauses under high retention.',
      'Tiering decisions depend on call counts and feedback, so cold-start and steady-state performance differ markedly.',
    ],
    scalability: [
      'Long-lived servers benefit from sustained, type-stable hot paths staying in TurboFan; shape churn under load degrades throughput.',
      'Heap sizing and semi-space tuning matter at scale; under-sized heaps cause frequent GC, over-sized heaps cause longer major collections.',
    ],
    productionConcerns: [
      'Pin Node/V8 versions for reproducible performance; engine upgrades can change tiering and GC behavior.',
      'Treat GC pause time and allocation rate as first-class SLO inputs alongside CPU and latency.',
      'Use heap snapshots and --prof / DevTools to find retained references and deopt-heavy functions before they cause incidents.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'V8 = Google\'s JS/Wasm engine (Chrome, Node, Deno, Electron).',
    'Pipeline: Source → AST → bytecode → Ignition (interpreter, collects feedback).',
    'Tiers: Sparkplug (baseline) → Maglev (mid) → TurboFan (top optimizer).',
    'Optimization is speculative; broken assumptions cause deopt to bytecode.',
    'Object model: hidden classes (Maps) + inline caches → fast property access.',
    'Monomorphic > polymorphic > megamorphic call sites.',
    'GC = Orinoco: Young (Scavenger, semi-spaces) + Old (Mark-Compact).',
    'Surviving young objects are promoted to the old generation.',
    'Most GC work is concurrent/parallel to cut main-thread pauses.',
    'Levers: stable shapes, fewer allocations, warm-up, --max-old-space-size.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'In Node, print the V8 version powering the runtime.',
      hint: 'process.versions has a v8 field.',
      solution: {
        lang: 'js',
        code: `console.log('V8 version:', process.versions.v8)`,
        explanation: [
          'Node exposes the embedded V8 version via `process.versions.v8`.',
          'This tells you which engine features and optimizations are available.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a loop of short-lived allocations and explain which GC generation handles them.',
      hint: 'Objects that die immediately stay young.',
      solution: {
        lang: 'js',
        code: `for (let i = 0; i < 1e6; i++) {\n  const tmp = { a: i, b: i + 1 } // unreachable after the iteration\n  void tmp\n}\n// These die in the young generation -> collected cheaply by the Scavenger.`,
        explanation: [
          'Each `tmp` becomes unreachable at the end of its iteration.',
          'Such short-lived objects are reclaimed by the cheap young-generation Scavenger.',
          'High churn of dying-young objects is exactly what generational GC is optimized for.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate, with comments, how growing a long-lived cache pressures the old generation, and a mitigation.',
      hint: 'Unbounded retention promotes objects; bound the cache or use weak references.',
      solution: {
        lang: 'js',
        code: `// PROBLEM: unbounded cache -> objects survive -> promoted to old gen -> heavier GC\nconst cache = new Map()\nfunction remember(k, v) { cache.set(k, v) } // grows forever\n\n// MITIGATION: bound the size (LRU-style) so retention is capped\nfunction rememberBounded(k, v, max = 1000) {\n  if (cache.size >= max) cache.delete(cache.keys().next().value)\n  cache.set(k, v)\n}`,
        explanation: [
          'An unbounded cache keeps objects reachable, so they get promoted to the old generation.',
          'A growing old generation means more frequent and longer Mark-Compact collections.',
          'Bounding the cache caps retention, keeping the old generation small and GC cheap.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain how you would investigate a Node process whose memory keeps climbing, using V8 concepts.',
      hint: 'Monitor heapUsed, take snapshots, look for retained references.',
      solution: {
        lang: 'js',
        code: `// 1) Watch the trend\nsetInterval(() => {\n  const { heapUsed } = process.memoryUsage()\n  console.log('heapUsed MB:', (heapUsed / 1048576).toFixed(1))\n}, 10000)\n\n// 2) Take heap snapshots (Chrome DevTools / heapdump) over time and diff them\n//    to find objects whose retained count keeps growing.\n// 3) Trace retainers to the code path holding references (caches, listeners,\n//    closures, globals) and release them.`,
        explanation: [
          'Steadily rising heapUsed that does not drop after GC indicates retained (leaked) memory promoted to old gen.',
          'Diffing heap snapshots over time pinpoints which object types and retainers grow.',
          'Fixing the leak means breaking the reference chain — unbounded caches, un-removed listeners, or stale closures are common culprits.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'V8 is the runtime behind most JavaScript in the world. Understanding its tiers, object model, and GC lets you reason precisely about cold starts, peak performance, and memory — exactly the senior-level reasoning interviews and real incidents demand.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep — maybe "what engine does Node use". Product companies (Zoho, Flipkart, Razorpay) ask about Ignition/TurboFan, deopts, and GC generations. FAANG-level interviews expect the full tiered pipeline, hidden classes/inline caches, Orinoco internals, and how you would diagnose performance/memory issues with V8 tooling.',
    whatInterviewersExpect:
      'They expect you to describe V8\'s tiered compilation (Ignition → Sparkplug → Maglev → TurboFan), explain speculative optimization and deoptimization, the hidden-class/inline-cache object model, the generational Orinoco GC, and to connect all of it to practical tuning and debugging.',
  },
}

export default v8Architecture
