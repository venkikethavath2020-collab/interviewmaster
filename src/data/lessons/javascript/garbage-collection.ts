import type { ConceptLesson } from '../../../types/lesson'

const garbageCollection: ConceptLesson = {
  // 1. Concept Summary
  slug: 'garbage-collection',
  name: 'Garbage Collection',
  category: 'memory-model',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'GC is why you almost never call free() in JavaScript — understanding it explains when memory IS and ISN\'T released, which is the root of every leak discussion.',
    'It directly powers the most senior memory questions: reachability, the mark-and-sweep cycle, generational collection, and why a forgotten reference quietly grows your heap.',
    'Misunderstanding GC leads to real production incidents — listeners, caches, and closures that pin megabytes alive in long-running tabs and Node servers.',
    'It explains GC pauses: why a hot allocation path can cause jank in the UI or latency spikes on the server.',
    'Interviewers use it to separate developers who think "memory is automatic and free" from those who understand reachability and allocation cost.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Garbage collection is a cleanup robot that throws away any toy no string still connects to your hand.',
    story: [
      'Imagine your room is full of toys, and every toy you still care about has a string tying it back to your hand.',
      'A cleanup robot walks the room. It follows every string starting from your hand and puts a sticker on each toy it can reach.',
      'When it finishes, any toy with NO sticker — nothing connects it to you anymore — is thrown in the bin to make space.',
      'In JavaScript, your "hand" is the program\'s roots, the strings are references, and the robot is the garbage collector. If nothing reaches an object, it gets cleaned up automatically.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Programs need memory to store data, and when data is no longer needed that memory should be given back so the program does not run out.',
    'In some languages the programmer must free memory by hand, which is error-prone. JavaScript does it for you automatically.',
    'It works by checking which pieces of data can still be reached by following references starting from known starting points (like global variables and the current functions running).',
    'Anything that can no longer be reached is considered garbage and its memory is reclaimed. This is called garbage collection.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Garbage collection is the automatic process by which the JavaScript engine reclaims memory occupied by objects that are no longer reachable from any root (the global object, the current call stack, and active closures).',
    how: 'The engine periodically traces references starting from roots, marks everything reachable as "live", and frees everything else. Modern engines use generational collection: new objects are collected often and cheaply, survivors are promoted and collected less often.',
    why: 'It frees you from manual memory management and a whole class of bugs (dangling pointers, double frees), at the cost of non-deterministic timing and occasional pauses you must design around.',
    code: {
      label: 'Reachability decides collection',
      lang: 'js',
      code: `let user = { name: 'Sam', big: new Array(1e6) }\n\n// While 'user' references it, the object is reachable -> kept.\nconsole.log(user.name)\n\nuser = null   // last reference gone -> object becomes unreachable\n// Eligible for GC now; memory reclaimed at some later, engine-chosen time.`,
      explanation: [
        'The object is allocated on the heap and `user` holds a reference to it.',
        'As long as `user` (a root-reachable binding) points at it, the GC must keep it.',
        'Setting `user = null` removes the only reference, making the object unreachable.',
        'The object is now eligible for collection — but GC runs on its own schedule, not instantly.',
        'You do not free memory yourself; you make things unreachable and the GC does the rest.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Garbage collection in JavaScript is an automatic memory-management mechanism based on reachability. The engine maintains a set of roots (global object, the execution stack, and active closures) and treats an object as live if it is reachable by following references from any root. Modern engines (e.g. V8) implement a generational, mark-and-sweep collector: a fast "scavenge" repeatedly collects the short-lived young generation using a copying algorithm, while survivors are promoted to the old generation collected by an incremental, concurrent mark-sweep-compact cycle. Unreachable objects are reclaimed; the reference-counting approach is avoided because it cannot collect cycles.',

  // 7. Internal Working
  internalWorking: [
    'Every allocation places a new object in the young generation (V8\'s "new space"), a small region optimized for fast allocation and frequent collection.',
    'When new space fills, a minor GC (scavenge) runs: it traces from roots, copies live objects to a survivor region, and discards the rest by reclaiming the whole space at once.',
    'Objects surviving one or two scavenges are promoted to the old generation ("old space"), assuming they are long-lived.',
    'Old space is collected by a major GC: a mark phase traces reachability from roots and marks live objects, then a sweep/compact phase reclaims and defragments the unmarked memory.',
    'Modern engines do major GC incrementally and concurrently (mark in small steps and on background threads) to avoid long stop-the-world pauses on the main thread.',
    'Reachability — not reference counting — is the rule, which is why reference cycles between unreachable objects are still collected correctly.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ROOTS (globals, stack, closures)
        │  follow references...
        ▼
   ┌──────────┐    ┌──────────┐        ┌──────────┐
   │ reachable│──► │ reachable│        │ orphan   │  (no path from roots)
   └──────────┘    └──────────┘        └──────────┘
        keep            keep                 ▲
                                             └── unreachable -> GC frees it

   YOUNG GEN: many short-lived objects -> frequent cheap scavenge
   OLD GEN  : survivors -> infrequent mark-sweep-compact`,

  // 9. Memory Visualization
  memoryVisualization: [
    'ROOTS: the global object, every active stack frame, and variables captured by live closures — collection always starts here.',
    'YOUNG GENERATION: a small heap region where fresh objects land; collected frequently and cheaply by copying live survivors out.',
    'OLD GENERATION: promoted, longer-lived objects; collected by incremental mark-sweep-compact, less often.',
    'REACHABILITY GRAPH: objects are nodes, references are edges; anything with no path from a root is garbage, regardless of how many other dead objects reference it.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — losing the last reference',
      lang: 'js',
      code: `function build() {\n  const temp = { data: new Array(1000) }\n  return temp.data.length\n}\nbuild()   // 'temp' is unreachable the moment build() returns`,
      explanation: [
        '`temp` lives only inside build()\'s stack frame.',
        'When build() returns, the frame is popped and nothing references `temp` anymore.',
        'The object becomes unreachable and is eligible for the next scavenge.',
        'You did nothing special — letting references go out of scope is the normal way memory is freed.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cycles are still collected',
      lang: 'js',
      code: `function makeCycle() {\n  const a = {}\n  const b = {}\n  a.b = b\n  b.a = a    // a <-> b reference each other\n  return null // neither is returned\n}\nmakeCycle() // a and b reference each other but NOTHING references them`,
      explanation: [
        '`a` and `b` form a reference cycle, each pointing at the other.',
        'A naive reference-counting GC would never free them (counts never hit zero).',
        'JavaScript uses reachability, not counting: since no root reaches a or b, both are garbage.',
        'This is exactly why modern engines use mark-and-sweep instead of reference counting.',
      ],
    },
    advanced: {
      label: 'Advanced — WeakMap lets keys be collected',
      lang: 'js',
      code: `const meta = new WeakMap()\nlet node = document.createElement('div')\nmeta.set(node, { clicks: 0 })   // does NOT keep 'node' alive\n\nnode = null   // node now unreachable; WeakMap entry can be collected too`,
      explanation: [
        'A WeakMap holds its keys weakly — the reference does not count toward reachability.',
        'So storing metadata keyed by `node` does not, by itself, keep the node alive.',
        'When the last strong reference (`node`) is gone, both the node and its WeakMap entry become collectible.',
        'A regular Map would keep the node alive forever, which is a classic leak.',
      ],
    },
    realProject: {
      label: 'Real project — Node.js cache that leaks vs one that does not',
      lang: 'js',
      code: `// Leaky: unbounded Map grows forever in a long-running server\nconst cache = new Map()\nfunction getUser(id, fetchFn) {\n  if (!cache.has(id)) cache.set(id, fetchFn(id))\n  return cache.get(id)\n}\n\n// Safer: bounded LRU so old entries become unreachable and are GC'd\nimport { LRUCache } from 'lru-cache'\nconst lru = new LRUCache({ max: 1000 })`,
      explanation: [
        'A plain Map keeps every entry reachable forever, so the GC can never reclaim them — memory climbs.',
        'In a long-running Node process this is a textbook leak that eventually OOMs the server.',
        'A bounded LRU evicts old entries, dropping the last reference so the GC can free them.',
        'The lesson: the GC only helps once you stop referencing data — caches must have eviction.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How is memory freed in JavaScript?',
      answer: 'Automatically by the garbage collector. When an object is no longer reachable from any root, the engine reclaims its memory; you do not free it manually.',
      explanation: 'A good answer centers on reachability and the absence of manual free().',
    },
    {
      level: 'beginner',
      question: 'When does an object become eligible for garbage collection?',
      answer: 'When there is no longer any reference path to it from a root (globals, the call stack, or active closures). Dropping the last reference — e.g. setting it to null or letting it fall out of scope — makes it eligible.',
      explanation: 'Interviewers want "unreachable", not "when its variable goes out of scope" alone, since closures can keep things alive.',
    },
    {
      level: 'intermediate',
      question: 'Why is reachability used instead of reference counting?',
      answer: 'Reference counting cannot collect reference cycles — two objects referencing each other keep nonzero counts even when nothing else points to them. Reachability (mark-and-sweep) collects them correctly because neither is reachable from a root.',
      explanation: 'The cycle example is the canonical reason and shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'What is generational garbage collection?',
      answer: 'The heap is split into a young generation for new objects and an old generation for survivors. Most objects die young, so the engine collects the young generation frequently and cheaply, and the old generation less often with a more expensive algorithm.',
      explanation: 'Mentioning the "weak generational hypothesis" (most objects die young) is a strong signal.',
    },
    {
      level: 'advanced',
      question: 'Walk through the mark-and-sweep cycle.',
      answer: 'Mark: starting from roots, the collector traverses the reference graph and marks every reachable object as live. Sweep: it scans the heap and reclaims memory for unmarked objects. Many engines also compact to reduce fragmentation, and run mark incrementally/concurrently to limit pause time.',
      explanation: 'Senior signal: naming the phases, compaction, and incremental/concurrent execution to reduce pauses.',
    },
    {
      level: 'senior',
      question: 'How do GC pauses affect performance and how do you mitigate them?',
      answer: 'Major GC can pause the main thread, causing UI jank or server latency spikes. Mitigate by reducing allocation rate (object pooling, avoiding per-frame/per-request churn), keeping object shapes stable for hidden classes, and letting short-lived objects stay in the young generation. Engines also use incremental and concurrent marking to spread the work.',
      explanation: 'Connecting allocation patterns, generational behavior, and pause mitigation is the senior differentiator.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are the GC roots in a browser vs in Node.js?',
    'Why can\'t you force garbage collection in standard JavaScript? (no spec-guaranteed API)',
    'How do WeakMap, WeakSet, and WeakRef interact with the collector?',
    'What is the difference between a minor (scavenge) and major GC?',
    'How would you detect that GC pressure is hurting performance?',
    'What is the "weak generational hypothesis" and why does it justify generational GC?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing setting a variable to null instantly frees memory.',
      why: 'It only removes a reference; the GC runs on its own schedule, and other references may still keep the object alive.',
      fix: 'Think in terms of reachability — ensure ALL references are gone — and trust the GC to reclaim later.',
    },
    {
      mistake: 'Assuming the GC will clean up listeners, timers, and caches for you.',
      why: 'These hold live references, so the captured objects remain reachable and are never collected — a leak.',
      fix: 'Remove listeners, clear timers, bound caches, and use Weak collections so the GC can do its job.',
    },
    {
      mistake: 'Treating GC as free and ignoring allocation rate.',
      why: 'High allocation churn triggers frequent collections and pauses, hurting latency and frame rate.',
      fix: 'Reduce allocations in hot paths, reuse objects, and keep shapes stable for engine optimizations.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Long-running servers must avoid unbounded caches and accumulating event listeners; --max-old-space-size and heap snapshots are used to tune and diagnose GC behavior.' },
    { area: 'React', detail: 'Cleaning up effects (timers, subscriptions) on unmount drops references so components and their captured props/state can be collected, preventing leaks in SPAs.' },
    { area: 'Vue', detail: 'onUnmounted hooks remove listeners and intervals; reactive objects held in module scope stay alive until dereferenced, so global stores must avoid unbounded growth.' },
    { area: 'Backend', detail: 'High-throughput services tune allocation to reduce GC pause frequency, using object pooling and streaming to keep the young generation churning cheaply instead of promoting to old space.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Automatic memory management eliminates entire bug classes (dangling pointers, double frees) with no manual effort.',
      'Generational collection makes the common case (many short-lived objects) extremely cheap.',
    ],
    bad: [
      'Major GC can introduce pauses that cause UI jank or server latency spikes.',
      'High allocation churn and frequent promotions increase collection frequency and CPU overhead.',
    ],
    optimizations: [
      'Lower allocation rate in hot paths: reuse objects/arrays, avoid creating closures per frame/request.',
      'Keep object shapes stable so V8 hidden classes and inline caches stay optimized.',
      'Use WeakMap/WeakSet/WeakRef for caches and metadata so entries can be collected.',
      'Bound caches (LRU/TTL) so old entries become unreachable instead of pinning memory.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['stack-vs-heap', 'primitive-vs-reference', 'closure'],
    nextConcepts: ['memory-leaks', 'weakmap-weakset', 'weakref-finalizationregistry', 'memory-profiling'],
    dependencyNote:
      'Garbage collection builds directly on stack-vs-heap and reference semantics, and it is the foundation for memory-leaks, the Weak collections, and memory-profiling — all of which are about helping or hindering the collector.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labelled ROOTS (globals, stack, closures).',
      'Draw a few object circles, connecting some back to ROOTS with arrows and leaving one or two orphaned.',
      'Walk the arrows from ROOTS and tick each reachable object as "marked / live".',
      'Circle the orphans with no path back and say "these are swept — memory reclaimed".',
      'Add two regions: YOUNG (collected often, cheap) and OLD (survivors, collected rarely).',
      'Conclude: "GC is reachability-based, generational, and runs on its own schedule — you free memory by removing references."',
    ],
    diagram: `  ROOTS ──► (A) ──► (B)        (C)   <- no path = garbage
            live    live
   ─────────────────────────────────────────
   YOUNG: A,B,C land here, scavenged often
   OLD:   survivors promoted, mark-sweep-compact`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Garbage collection automatically reclaims memory for objects that are no longer reachable from roots (globals, stack, closures). It uses mark-and-sweep, not reference counting, so even reference cycles are collected. V8 is generational: a cheap scavenge collects the short-lived young generation frequently, while survivors move to the old generation collected by incremental, concurrent mark-sweep-compact. You never free memory manually — you drop references and the GC does the rest, though leaks happen when listeners, caches, or closures keep objects reachable.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript manages memory automatically through garbage collection, and the core rule is reachability. The engine starts from a set of roots — the global object, the current call stack, and variables captured by live closures — and traces references. Any object it can reach is kept alive; anything it cannot reach is garbage and gets reclaimed. It deliberately uses mark-and-sweep rather than reference counting, because counting can never free reference cycles, while reachability handles them naturally. Modern engines like V8 are generational, based on the observation that most objects die young: new objects go into a small young generation that is collected very frequently and cheaply by copying out the few survivors; objects that survive are promoted to the old generation, which is collected less often using an incremental, concurrent mark-sweep-compact cycle to keep pauses short. The practical takeaway is that I never free memory by hand — I make objects unreachable by dropping references, and the GC reclaims them on its own schedule. Leaks happen not because GC fails but because something still references the data: forgotten event listeners, uncleaned timers, unbounded caches, or closures pinning large objects. So the engineering work is removing references and using Weak collections, plus watching allocation rate, since high churn causes frequent collections and pauses.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Automatic GC removes manual-memory bugs but gives up deterministic timing — you cannot rely on when (or that) collection happens.',
      'Generational design optimizes the common short-lived case but penalizes workloads that allocate many medium-lived objects that keep getting promoted.',
    ],
    edgeCases: [
      'Reference cycles are fine for the tracing GC but break WeakRef-based assumptions and reference-counting mental models.',
      'Closures can keep an entire environment record alive even when only one captured variable is used.',
      'Detached DOM nodes still referenced by JS (or vice versa) are a classic uncollectable leak in browsers.',
    ],
    runtimeBehavior: [
      'V8 runs minor GC (scavenge) on the main thread but very fast; major GC marking is incremental and concurrent to limit jank.',
      'There is no standard way to force GC; --expose-gc in Node exposes global.gc only for testing/diagnostics.',
      'Object shape stability matters: polymorphic shapes deoptimize and indirectly increase memory and collection cost.',
    ],
    scalability: [
      'In high-throughput servers, allocation rate dominates GC cost; streaming and pooling keep the young generation cheap.',
      'Large heaps make major GC marking longer; keeping the old generation small via bounded caches helps latency.',
    ],
    productionConcerns: [
      'Most "memory leaks" are reachable objects nobody meant to keep — audit listeners, timers, caches, and closures.',
      'GC pauses can violate latency SLOs; profile with heap snapshots and allocation timelines, not guesses.',
      'Tune --max-old-space-size and monitor RSS/heap-used to catch slow growth before OOM in production.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'GC reclaims memory for UNREACHABLE objects automatically.',
    'Roots = global object + call stack + active closures.',
    'Mark-and-sweep, NOT reference counting (so cycles are collected).',
    'V8 is generational: young (frequent, cheap) + old (rare, mark-sweep-compact).',
    'Weak generational hypothesis: most objects die young.',
    'You never free memory; you drop references.',
    'Leaks = reachable data you forgot: listeners, timers, caches, closures.',
    'WeakMap/WeakSet/WeakRef let referenced objects still be collected.',
    'No standard force-GC; --expose-gc only for diagnostics.',
    'High allocation churn => more collections => pauses.',
    'Bound caches (LRU/TTL) so old entries become collectible.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Explain whether this object can be collected after the function returns, and why: `function f(){ const o = {x:1}; return o.x }`',
      hint: 'Is anything still referencing the object after f returns?',
      solution: {
        lang: 'js',
        code: `function f() {\n  const o = { x: 1 }\n  return o.x   // returns the primitive 1, not o\n}\nf() // the object {x:1} is unreachable once f returns -> collectible`,
        explanation: [
          'Only the primitive `o.x` (1) is returned; the object itself is not.',
          'When the frame pops, no reference remains to {x:1}, so it is unreachable and eligible for GC.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show why two objects in a cycle are still collected, and contrast with what reference counting would do.',
      hint: 'Reachability from roots, not counts, decides collection.',
      solution: {
        lang: 'js',
        code: `function cycle() {\n  const a = {}, b = {}\n  a.ref = b\n  b.ref = a\n  // nothing returned -> no root reaches a or b\n}\ncycle() // both collectible under mark-and-sweep`,
        explanation: [
          'a and b reference each other, so reference counts never reach zero.',
          'A reference-counting GC would leak them; mark-and-sweep sees no root path and frees both.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Convert this leaky cache to one whose entries can be garbage collected when the key object is no longer used elsewhere.',
      hint: 'Object-keyed metadata that should not keep keys alive => WeakMap.',
      solution: {
        lang: 'js',
        code: `// Leaky: Map keeps keys alive forever\n// const cache = new Map()\n\n// Fixed: WeakMap holds keys weakly\nconst cache = new WeakMap()\nfunction attachMeta(obj) {\n  if (!cache.has(obj)) cache.set(obj, { created: Date.now() })\n  return cache.get(obj)\n}`,
        explanation: [
          'A Map references its keys strongly, so keyed objects can never be collected while in the Map.',
          'A WeakMap references keys weakly, so once no other reference exists, the key and its entry are collectible.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Describe, in steps, what happens in memory from object creation to collection, and what determines collection eligibility.',
      hint: 'Allocation -> young gen -> reachability check -> survive/promote or sweep.',
      solution: {
        lang: 'js',
        code: `let big = new Array(1e6)   // 1) allocated in young generation\nuse(big)                    // 2) reachable from root 'big' -> kept across scavenges\n// (survives a couple scavenges) 3) promoted to old generation\nbig = null                  // 4) last reference dropped -> unreachable\n// 5) next major GC marks reachable set; 'big' is unmarked -> swept`,
        explanation: [
          'New objects start in the young generation, optimized for fast allocation.',
          'While reachable from a root they survive collections; long-lived ones get promoted to old space.',
          'Dropping the last reference makes the object unreachable.',
          'The next appropriate GC cycle marks the live set and sweeps anything unmarked, reclaiming the memory.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Garbage collection is where junior and senior answers diverge sharply. Knowing it turns vague "memory is automatic" statements into precise reasoning about reachability, generations, and leaks — which is exactly what production debugging demands.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how is memory freed?" and "when is an object collected?". Product companies (Zoho, Flipkart, Razorpay) probe cycles, WeakMap, and cache leaks. FAANG-level interviews dig into generational GC, mark-sweep-compact, incremental/concurrent marking, and pause mitigation.',
    whatInterviewersExpect:
      'They expect reachability (not reference counting), the mark-and-sweep cycle, generational behavior, and a clear link to real leaks (listeners, timers, caches, closures) plus how to mitigate GC pauses.',
  },
}

export default garbageCollection
