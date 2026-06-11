import type { ConceptLesson } from '../../../types/lesson'

const jitCompilation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'jit-compilation',
  name: 'JIT Compilation & Deoptimization',
  category: 'fundamentals-engine',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'JIT compilation is why JavaScript can be fast despite being dynamically typed — it explains the gap between cold and hot performance.',
    'Understanding speculation and deoptimization tells you why certain code "suddenly gets slow" and how to avoid performance cliffs.',
    'It clarifies the false "interpreted vs compiled" dichotomy: JS is interpreted first, then compiled on demand.',
    'It directly informs how to write engine-friendly hot paths: stable types, stable shapes, no surprise inputs.',
    'Senior interviews use it to probe whether you understand runtime optimization as a feedback-driven, reversible process rather than magic.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'JIT is like learning shortcuts to a maze after walking it many times — but if someone moves a wall, your shortcut stops working and you must walk it again.',
    story: [
      'Imagine a maze you have to cross every day. The first few times you walk slowly, reading the signs at every turn.',
      'After many trips you memorize a fast shortcut and zoom straight through without reading the signs.',
      'One day someone secretly moves a wall. Your memorized shortcut now leads into a dead end!',
      'So you throw away the shortcut and carefully walk the maze again, reading signs, until you learn the new fast path. A JavaScript engine does exactly this: it learns fast shortcuts for code it runs a lot (JIT), but if the situation changes unexpectedly, it throws the shortcut away (deoptimizes) and goes back to the careful way.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When the engine runs your code many times, it notices the patterns — like "this function always gets numbers" — and writes a super-fast version specialized for that pattern.',
    'This is called Just-In-Time (JIT) compilation because the fast version is created while the program is running, not before.',
    'But the engine is only guessing based on what it saw. If your code suddenly does something different, the guess is wrong.',
    'When the guess is wrong, the engine throws away the fast version and goes back to the slow-but-safe one. That throwing-away is called deoptimization.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JIT (Just-In-Time) compilation is the technique where a JS engine compiles frequently executed ("hot") code into optimized machine code at runtime, using observed type/shape feedback to specialize it. Deoptimization is bailing out of that optimized code back to the interpreter when a speculative assumption is violated.',
    how: 'The engine interprets bytecode first while collecting feedback. When a function gets hot, the optimizing compiler emits specialized code guarded by assumptions. If a guard fails at runtime, the engine deoptimizes to bytecode and may re-optimize later.',
    why: 'It gives dynamically typed JavaScript near-native speed on hot paths without an upfront compile step, while staying correct via deopt safety nets.',
    code: {
      label: 'A function that gets JIT-optimized then deoptimized',
      lang: 'js',
      code: `function area(w, h) {\n  return w * h            // optimizer will assume numbers\n}\n\n// Warm-up: always numbers -> JIT specializes for number * number\nfor (let i = 0; i < 1e5; i++) area(i, i + 1)\n\n// Surprise input -> assumption breaks -> deoptimize\narea('5', 2) // string forces a bailout from the optimized code`,
      explanation: [
        '`area` starts as interpreted bytecode while the engine records that it multiplies numbers.',
        'Once hot, the JIT emits machine code specialized for number-by-number multiplication, guarded by a type check.',
        'Calling `area("5", 2)` violates the number assumption, tripping the guard.',
        'The engine deoptimizes back to bytecode, then may re-profile and re-optimize for the new type mix.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JIT compilation is runtime compilation of hot code into optimized native machine code, driven by profiling feedback (type feedback, hidden-class/shape information, call counts). Optimizing compilers (e.g. V8\'s TurboFan) generate speculative, type-specialized code protected by guards/type checks. When a guard fails — a type change, hidden-class change, out-of-bounds access, or other violated assumption — the engine performs deoptimization: it discards the optimized code, restores interpreter state, and resumes in bytecode, potentially re-optimizing later. Repeated bailouts can cause deopt loops, where a function oscillates between optimized and interpreted states.',

  // 7. Internal Working
  internalWorking: [
    'Interpretation + profiling: the function runs as bytecode (e.g. V8\'s Ignition) while the engine records type feedback and counts invocations to gauge hotness.',
    'Tier-up decision: when call/loop counts cross a threshold, the function is queued for optimizing compilation, sometimes via a fast baseline tier first.',
    'Speculative optimization: the optimizer emits machine code specialized to the observed types and object shapes, inserting guards (cheap checks) that validate those assumptions at runtime.',
    'On-stack replacement (OSR): long-running loops can be swapped from interpreted to optimized code mid-execution so they speed up without restarting.',
    'Guard failure → deoptimization: if a guard detects a violated assumption (e.g. a non-number argument), the engine reconstructs interpreter frame state and continues in bytecode.',
    'Re-optimization / bailout limits: the engine may re-optimize after gathering new feedback, but functions that repeatedly bail out can be marked as not optimizable to avoid wasteful deopt loops.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   bytecode (interpreter) ── runs + collects feedback ──┐
        ▲                                              │ hot?
        │                                              ▼
        │                                    ┌────────────────────┐
        │  re-optimize after new feedback    │ OPTIMIZING COMPILER│
        │                                    │ specialized code   │
        │                                    │ + GUARDS (type/shape)│
        │                                    └─────────┬──────────┘
        │                                              │ guard OK → fast
        │      DEOPT (guard fails: type/shape changed) │
        └──────────────────────────────────────────────┘

   Risk: bytecode ⇄ optimized oscillation = DEOPT LOOP (slow)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — cold vs hot performance',
      lang: 'js',
      code: `function sumTo(n) {\n  let s = 0\n  for (let i = 0; i < n; i++) s += i\n  return s\n}\nsumTo(1000)            // cold: interpreted bytecode\nfor (let k = 0; k < 1e5; k++) sumTo(1000) // hot: JIT-compiled`,
      explanation: [
        'The first `sumTo` call runs interpreted — correct but not yet optimized.',
        'Repeated calls make it hot, so the engine JIT-compiles it to fast machine code.',
        'Cold and hot runtimes differ significantly; this is why warm-up matters in benchmarks.',
        'No syntax change was needed — the speedup comes purely from runtime optimization.',
      ],
    },
    intermediate: {
      label: 'Intermediate — guards and type stability',
      lang: 'js',
      code: `function classify(x) {\n  return x + 1           // guarded: optimizer assumes x is a number\n}\nfor (let i = 0; i < 1e5; i++) classify(i) // monomorphic numbers -> stays optimized\n\n// Mixing types makes it polymorphic and harder to keep optimized\nclassify('a') // now '+' means string concat -> different behavior + deopt risk`,
      explanation: [
        'The optimizer specializes `classify` for numeric `x`, inserting a guard that checks the type.',
        'Calling it only with numbers keeps the guard passing and the optimized code in use.',
        'Passing a string changes the meaning of `+` and violates the guard.',
        'Type-stable (monomorphic) inputs are what keep JIT-compiled code fast and resident.',
      ],
    },
    advanced: {
      label: 'Advanced — creating a deopt loop',
      lang: 'js',
      code: `function pick(arr, i) { return arr[i] }\n\nconst nums = [1, 2, 3]\nconst objs = [{ v: 1 }, { v: 2 }]\n\n// Alternating element kinds keeps changing the speculation -> repeated deopts\nfor (let i = 0; i < 1e4; i++) {\n  pick(nums, 0)  // optimizer specializes for SMI/packed array\n  pick(objs, 0)  // different element kind -> bail out\n}`,
      explanation: [
        '`pick` is optimized assuming a particular array element kind (e.g. packed integers).',
        'Alternating between a number array and an object array repeatedly violates that assumption.',
        'Each violation triggers a deoptimization, then re-optimization — a deopt loop.',
        'A deopt loop can be slower than never optimizing; keep inputs to a hot function consistent.',
      ],
    },
    realProject: {
      label: 'Real project — keeping a Node hot path optimizable',
      lang: 'js',
      code: `// A request transformer on a hot route. Keep inputs/outputs type-stable.\nfunction toDTO(row) {\n  // Always coerce to consistent types so the JIT stays specialized\n  return {\n    id: Number(row.id),\n    name: String(row.name ?? ''),\n    active: Boolean(row.active),\n  }\n}\n// Called per request; consistent shapes/types keep it in optimized code.\nconst dto = toDTO({ id: '42', name: 'Ada', active: 1 })`,
      explanation: [
        'On a hot route, `toDTO` is called constantly, so it gets JIT-optimized.',
        'Explicit coercion guarantees stable property types regardless of messy input.',
        'Stable types + a fixed object shape keep the optimizer\'s guards passing.',
        'This avoids per-request deopts that would otherwise add latency under load.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'intermediate',
      question: 'What is JIT compilation?',
      answer: 'Just-In-Time compilation compiles hot code to optimized machine code at runtime, using profiling feedback (observed types and shapes) to specialize it, rather than compiling everything ahead of time.',
      explanation: 'Captures the "at runtime, feedback-driven, hot code" essence rather than just "compiles code".',
    },
    {
      level: 'intermediate',
      question: 'Why does JavaScript interpret first instead of compiling everything up front?',
      answer: 'To start fast. Interpreting bytecode begins instantly, and optimizing compilation is expensive, so the engine only pays that cost for code proven hot enough to benefit — balancing startup latency and peak throughput.',
      explanation: 'Shows the startup-vs-throughput tradeoff that justifies lazy, on-demand compilation.',
    },
    {
      level: 'advanced',
      question: 'What is deoptimization and what triggers it?',
      answer: 'Deoptimization discards optimized code and resumes in the interpreter because a speculative guard failed — typically a changed argument type, a changed object hidden class, an out-of-bounds or holey-array access, or arguments/eval surprises. The engine may re-optimize after gathering new feedback.',
      explanation: 'Listing concrete triggers and the recovery path signals real understanding.',
    },
    {
      level: 'advanced',
      question: 'What is a deopt loop and why is it bad?',
      answer: 'A deopt loop is when a function repeatedly optimizes and bails out because its inputs keep violating the speculation. The constant optimize/deopt cycle wastes compilation work and can make the function slower than if it had stayed interpreted.',
      explanation: 'Demonstrates awareness that optimization has cost and can backfire under unstable inputs.',
    },
    {
      level: 'senior',
      question: 'What is on-stack replacement (OSR)?',
      answer: 'OSR lets the engine swap a currently-executing function (typically stuck in a long loop) from interpreted bytecode to optimized machine code mid-execution, without waiting for the next call, so long-running loops speed up immediately.',
      explanation: 'A more advanced detail showing depth on how optimization is applied to in-flight code.',
    },
    {
      level: 'senior',
      question: 'How do you write code that stays JIT-optimized in a hot path?',
      answer: 'Keep argument types monomorphic, keep object shapes stable (initialize all fields once, in order, no delete), avoid mixing array element kinds, avoid arguments/with/eval that defeat optimization, and minimize allocations. Then profile to confirm it stays optimized rather than guessing.',
      explanation: 'Connects the theory to concrete, actionable practices and a measure-first mindset.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between baseline and optimizing JIT tiers?',
    'What is a guard and where does the engine place it?',
    'What kinds of operations or syntax tend to defeat optimization?',
    'How does type feedback get collected and used?',
    'How would you detect deopts in V8 (e.g. --trace-deopt)?',
    'How is JIT different from AOT (ahead-of-time) compilation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Benchmarking only cold runs.',
      why: 'JIT compiles over time, so cold measurements ignore the optimized steady state most code actually runs in.',
      fix: 'Warm up with many iterations before timing, and prefer real-workload profiling.',
    },
    {
      mistake: 'Passing mixed/changing types to a hot function.',
      why: 'Type changes break speculative guards and cause deoptimizations, sometimes deopt loops.',
      fix: 'Normalize/coerce inputs to consistent types so the function stays monomorphic.',
    },
    {
      mistake: 'Assuming "more optimization is always faster".',
      why: 'Optimizing compilation has a cost, and unstable inputs cause wasteful optimize/deopt cycles.',
      fix: 'Stabilize inputs and shapes; if a path keeps deopting, fix the cause rather than expecting the JIT to win.',
    },
    {
      mistake: 'Using constructs that disable optimization in hot code.',
      why: 'Things like the deprecated arguments leakage, with, eval, or holey arrays can block or undo optimization.',
      fix: 'Use rest parameters instead of arguments, avoid with/eval, and keep arrays packed/dense.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Hot request handlers and serializers get JIT-optimized; keeping their inputs type-stable avoids per-request deopts that add tail latency under load.' },
    { area: 'Backend', detail: 'CPU-heavy services profile with V8 flags (--trace-deopt, --prof) to find functions stuck deopting and fix the unstable inputs causing it.' },
    { area: 'React', detail: 'Reconciliation and hot render utilities benefit from monomorphic props/state shapes; shape churn forces the engine to re-profile and can deopt frequently-run code.' },
    { area: 'Vue', detail: 'Compiled render functions run repeatedly; stable reactive data shapes keep these hot functions in optimized code during heavy interactions.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Hot, type-stable functions reach near-native speed once JIT-compiled.',
      'On-stack replacement speeds up long-running loops without waiting for the next call.',
    ],
    bad: [
      'Type/shape instability causes deopts and, at worst, deopt loops that are slower than interpretation.',
      'Optimization-defeating constructs (eval, with, holey arrays, arguments leakage) keep code on slow paths.',
    ],
    optimizations: [
      'Keep argument types and object shapes consistent so guards keep passing.',
      'Coerce/normalize inputs at boundaries so hot internals see uniform types.',
      'Keep arrays packed and avoid mixing element kinds in hot iteration.',
      'Profile with --trace-deopt / DevTools to find and eliminate deopt sources rather than guessing.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['javascript-engines', 'v8-architecture'],
    nextConcepts: ['hidden-classes-inline-caches', 'garbage-collection', 'memory-profiling', 'data-types'],
    dependencyNote:
      'Sits between javascript-engines/v8-architecture (which describe the compilers that perform JIT) and hidden-classes-inline-caches (the feedback the JIT relies on). Type stability ties it to data-types, and profiling ties it to memory-profiling.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw bytecode/interpreter on the left with a label "collects type feedback".',
      'Arrow right labeled "hot?" to a box "Optimizing compiler → specialized machine code + GUARDS".',
      'From the optimized box draw a "guard OK → fast" loop and a "guard fails → DEOPT" arrow back to bytecode.',
      'Annotate the back-and-forth with "repeat = deopt loop (slow)".',
      'Say: "The JIT speculatively specializes hot code using observed types; if a guard fails it deoptimizes back to the interpreter — so type/shape stability keeps it fast."',
    ],
    diagram: `  bytecode (interpreter, collects feedback)
        │ hot?                ▲
        ▼                     │ DEOPT (guard fails)
  optimized code + GUARDS ────┘
        │ guard OK → fast
        ▼
   (unstable inputs → optimize/deopt LOOP = slow)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JIT compilation turns hot JavaScript into optimized machine code at runtime, specialized to the types and shapes the engine observed, with cheap guards protecting those assumptions. If a guard fails — a type or hidden class changes — the engine deoptimizes back to interpreted bytecode and may re-optimize later. Unstable inputs can cause deopt loops that are slower than interpreting. So in hot paths, keep argument types and object shapes consistent, avoid optimization-killers like eval, and profile with --trace-deopt rather than guessing.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JIT — Just-In-Time — compilation is how a JavaScript engine makes dynamically typed code fast. Instead of compiling everything up front, the engine first runs your code as bytecode in an interpreter, which starts instantly and collects feedback: which functions run often and what types and object shapes they actually see. When a function becomes hot, the optimizing compiler — TurboFan in V8 — generates machine code specialized to those observed types, for example assuming a function always multiplies two numbers. Because that is a speculation, the optimizer inserts cheap guards that verify the assumption at runtime. As long as the guards pass, the function runs at near-native speed. If a guard fails — say you suddenly pass a string where it expected a number, or an object\'s hidden class changes — the engine deoptimizes: it throws away the optimized code, restores interpreter state, and continues in bytecode, possibly re-optimizing later once it has new feedback. There is also on-stack replacement, which lets a long-running loop switch from interpreted to optimized code mid-execution. The big practical pitfall is the deopt loop: if a hot function keeps getting inputs that violate its speculation, it repeatedly optimizes and bails out, which can be slower than never optimizing. So for hot paths I keep argument types monomorphic, keep object shapes stable, keep arrays packed, avoid eval and with, and I profile with flags like --trace-deopt to find and fix deopt sources rather than guessing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Speculative specialization maximizes peak speed but risks deopt cliffs when production inputs are more polymorphic than the warm-up suggested.',
      'Aggressive tiering improves throughput but costs compilation CPU and memory (multiple code versions + feedback), which matters for short-lived/serverless processes.',
    ],
    edgeCases: [
      'Deopt loops: oscillating inputs cause repeated optimize/bail cycles; the engine may eventually mark a function as not optimizable.',
      'Holey/sparse arrays and mixed element kinds defeat array-access specialization.',
      'Constructs like eval, with, and leaking arguments can disable optimization for an entire function.',
    ],
    runtimeBehavior: [
      'Guards are cheap checks inserted before specialized operations; their failure is what triggers deoptimization.',
      'On-stack replacement re-enters optimized code for in-flight loops, so a single long loop can speed up partway through.',
      'Cold vs hot performance can differ by an order of magnitude, so steady-state behavior is what matters in production.',
    ],
    scalability: [
      'Serverless/short-lived processes may never reach steady state, so cold-start performance (interpreter/baseline) dominates — favoring less code and faster startup.',
      'Long-lived servers benefit from sustained optimization, but only if hot paths stay type/shape stable under varied production traffic.',
    ],
    productionConcerns: [
      'Diagnose with --trace-deopt and --prof; treat frequent deopts on hot functions as a performance bug.',
      'Pin Node/V8 versions since tiering thresholds and heuristics change across releases.',
      'Normalize inputs at trust boundaries so internal hot code sees uniform types regardless of messy external data.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'JIT = compile hot code to optimized machine code at runtime.',
    'Interpret first (fast start) → profile → optimize hot functions.',
    'Optimization is speculative; guards verify assumptions.',
    'Guard failure → DEOPT back to bytecode (then maybe re-optimize).',
    'Triggers: type change, hidden-class change, out-of-bounds/holey arrays.',
    'Deopt loop = repeated optimize/bail = slower than interpreting.',
    'OSR swaps a running loop from interpreted to optimized mid-flight.',
    'Keep argument types monomorphic; keep object shapes stable.',
    'Avoid eval/with/arguments-leakage/holey arrays in hot paths.',
    'Measure with --trace-deopt / --prof; warm up before benchmarking.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a warm-up harness that calls a function many times so it can be JIT-optimized before you time it.',
      hint: 'Run a big loop first, then measure.',
      solution: {
        lang: 'js',
        code: `function fn(x) { return x * x }\n\n// warm up so the JIT can optimize\nfor (let i = 0; i < 1e5; i++) fn(i)\n\n// now measure steady-state\nconst t0 = performance.now()\nfor (let i = 0; i < 1e6; i++) fn(i)\nconsole.log('hot ms:', performance.now() - t0)`,
        explanation: [
          'The first loop makes `fn` hot so the optimizer compiles it.',
          'Timing happens afterward, capturing steady-state (optimized) performance rather than cold runs.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show a single line that would deoptimize an otherwise number-specialized function, with a comment.',
      hint: 'Pass a type the function was not warmed up with.',
      solution: {
        lang: 'js',
        code: `function inc(x) { return x + 1 }\nfor (let i = 0; i < 1e5; i++) inc(i) // specialized for numbers\n\ninc('5') // string '+' -> assumption violated -> deopt`,
        explanation: [
          'Warm-up specializes `inc` for numeric addition with a type guard.',
          'Passing a string changes `+` semantics and trips the guard.',
          'The engine bails out of the optimized code; consistent numeric input would have kept it fast.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Refactor a function that mixes array element kinds in a hot loop into a version that stays optimizable.',
      hint: 'Process homogeneous arrays separately to keep element kinds stable.',
      solution: {
        lang: 'js',
        code: `// BEFORE: one loop touches both number and object arrays -> deopt risk\n// function sumAll(a, b) { let s = 0; for (const x of a) s += x; for (const o of b) s += o.v; return s }\n\n// AFTER: split so each loop sees a single, stable element kind\nfunction sumNumbers(nums) { let s = 0; for (const n of nums) s += n; return s }\nfunction sumValues(objs) { let s = 0; for (const o of objs) s += o.v; return s }\nfunction total(nums, objs) { return sumNumbers(nums) + sumValues(objs) }`,
        explanation: [
          'Splitting the loops gives each hot function a single, consistent element kind.',
          'Each function can be specialized and stay optimized without conflicting speculations.',
          'This avoids the deopt loop caused by alternating array kinds in one hot path.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain how you would prove a hot function is deopting in production-like Node, and what you would change.',
      hint: 'Use V8 deopt tracing, then stabilize inputs.',
      solution: {
        lang: 'js',
        code: `// 1) Run with deopt tracing to see bailouts:\n//    node --trace-deopt --trace-opt app.js\n// 2) Identify the hot function repeatedly listed as 'deoptimizing'.\n// 3) Stabilize its inputs by coercing at the boundary:\nfunction hot(x) { return x + 1 }\nfunction safeHot(x) { return hot(Number(x)) } // ensure number type before the hot path\n// 4) Re-run tracing to confirm the deopts disappear.`,
        explanation: [
          '`--trace-deopt`/`--trace-opt` reveal which functions optimize and bail out and why.',
          'Coercing inputs to a stable type at the boundary keeps the hot function monomorphic.',
          'Re-running the trace verifies the fix removed the deoptimizations rather than assuming it did.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'JIT and deoptimization explain the single biggest source of "mysterious" JavaScript performance behavior. Understanding speculation and guards lets you reason about cold vs hot speed and write hot paths that stay fast — exactly the depth senior interviews want.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) seldom go here, at most "is JS compiled or interpreted". Product companies (Zoho, Flipkart, Razorpay) ask what JIT and deopt are and what triggers a bailout. FAANG-level interviews probe guards, OSR, deopt loops, optimization-killers, and how you would profile and fix a deopting hot path.',
    whatInterviewersExpect:
      'They expect you to define JIT as runtime, feedback-driven, speculative compilation; explain deoptimization and its triggers; recognize deopt loops; and give concrete practices (type/shape stability, avoid optimization-killers, profile with --trace-deopt) to keep hot code optimized.',
  },
}

export default jitCompilation
