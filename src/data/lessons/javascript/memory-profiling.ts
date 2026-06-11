import type { ConceptLesson } from '../../../types/lesson'

const memoryProfiling: ConceptLesson = {
  // 1. Concept Summary
  slug: 'memory-profiling',
  name: 'Memory Profiling',
  category: 'memory-model',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Memory profiling is the difference between guessing "I think it leaks" and proving exactly which object and which retainer path is the problem.',
    'It is the practical skill behind diagnosing the production incidents everyone fears: sluggish SPAs, growing Node RSS, and OOM crashes.',
    'It teaches you to read heap snapshots — shallow vs retained size, dominators, detached DOM — which is real, transferable engineering competence.',
    'Senior interviews ask "how would you find a leak?" precisely to see whether you have a methodology or just vague intuition.',
    'Profiling protects performance budgets: high allocation rate and GC pressure show up here long before users feel jank.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Memory profiling is taking before-and-after photos of your messy room to find exactly which pile keeps growing.',
    story: [
      'Imagine your room slowly fills with clutter, but you cannot tell what is causing it.',
      'So you take a photo of the room, do one activity, then take another photo and compare them side by side.',
      'You notice that every time you play a certain game, a new pile of cards appears and never gets cleaned up.',
      'Now you know exactly what to fix. Memory profiling is taking these "photos" (snapshots) of a program\'s memory and comparing them to find what keeps growing.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Programs use memory, and sometimes they use more and more over time without releasing it, which is bad.',
    'Memory profiling means using special tools to look at exactly what is stored in memory and how much space each thing takes.',
    'A common trick is to take a "snapshot" of memory, do something, take another snapshot, and compare them to see what grew.',
    'These tools also show how objects are connected, so you can find what is holding onto memory that should have been freed.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Memory profiling is the practice of measuring and analyzing a program\'s heap usage — using heap snapshots, allocation timelines, and metrics — to understand what is allocated, how much it retains, and what keeps it alive.',
    how: 'In the browser you use Chrome DevTools\' Memory panel (heap snapshots, allocation instrumentation, allocation sampling); in Node you use --inspect with DevTools, process.memoryUsage(), or v8.writeHeapSnapshot(). You take snapshots around a repeatable action and compare them, reading shallow size, retained size, and the retainer (dominator) path.',
    why: 'It turns memory problems from guesswork into evidence: you can confirm a leak exists, identify the exact growing object and its retainer, fix it, and verify the heap returns to baseline.',
    code: {
      label: 'Measuring heap usage in Node',
      lang: 'js',
      code: `const before = process.memoryUsage().heapUsed\nrunWorkload()\nglobal.gc?.()                       // requires node --expose-gc\nconst after = process.memoryUsage().heapUsed\nconsole.log('retained bytes:', after - before)`,
      explanation: [
        'process.memoryUsage().heapUsed reports current V8 heap usage.',
        'Measuring before and after a workload shows net growth.',
        'Forcing GC (with --expose-gc) isolates real retention from short-lived garbage.',
        'A persistent positive delta after GC is a strong leak signal.',
        'For deeper analysis you take a full heap snapshot and inspect retainer paths.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Memory profiling is the systematic measurement and analysis of heap allocation and retention in a JavaScript runtime. It relies on heap snapshots — graph dumps of all reachable objects with their shallow size (memory the object occupies itself) and retained size (memory freed if the object were collected) — plus allocation timelines and sampling that attribute allocations to call stacks. Analysis centers on the dominator tree and retainer paths to identify which root keeps an object alive. Tooling includes Chrome DevTools\' Memory panel for browsers and the V8 inspector, process.memoryUsage(), and v8.writeHeapSnapshot() for Node.js. The goal is to distinguish high-but-stable usage from genuine leaks and to locate the exact retaining reference.',

  // 7. Internal Working
  internalWorking: [
    'A heap snapshot serializes the live object graph: every reachable object becomes a node, every reference an edge, with shallow size recorded per node.',
    'The tool computes retained size via the dominator tree — for each object, the total memory that would be freed if it became unreachable.',
    'To find a leak, you take snapshots around a repeatable action; the comparison/diff view shows objects allocated and still alive between snapshots (the "Objects allocated between" filter).',
    'For a suspicious object you inspect its retainer path: the chain of references from a GC root that keeps it alive, revealing the culprit (a Map, listener, closure, etc.).',
    'Allocation instrumentation/sampling attributes allocations to the call stacks that created them, pinpointing hot allocation sites that cause GC pressure.',
    'You apply the fix (sever the retaining reference), re-run the same action, and confirm the retained set no longer grows — closing the loop with evidence.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Snapshot A ──(repeat action N times)──► Snapshot B
        │                                      │
        └──────────────── DIFF ────────────────┘
                          │
              objects still alive in B but new since A
                          │
                  pick the growing one
                          │
                 RETAINER PATH to a ROOT
        root ─► Map ─► entry ─► [leaked object]   <- cut this edge
                          │
                 fix + re-run -> heap returns to baseline`,

  // 9. Memory Visualization
  memoryVisualization: [
    'SHALLOW SIZE: the memory an object holds directly (its own fields), excluding what it references.',
    'RETAINED SIZE: the memory reclaimed if this object were collected — it includes everything only this object keeps alive (its dominator subtree).',
    'DOMINATOR TREE: a structure where each node\'s parent is the object that exclusively keeps it alive; great for spotting big retainers.',
    'RETAINER PATH: the reference chain from a GC root down to the suspect object — the actual cause of retention you must break.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — Node heap snapshot to disk',
      lang: 'js',
      code: `const v8 = require('v8')\nconst fs = require('fs')\nfunction dumpHeap(label) {\n  const file = v8.writeHeapSnapshot()      // writes a .heapsnapshot file\n  fs.renameSync(file, label + '.heapsnapshot')\n}\ndumpHeap('before')\nrunWorkload()\ndumpHeap('after')`,
      explanation: [
        'v8.writeHeapSnapshot() captures the full live object graph to a file.',
        'You load before/after files into Chrome DevTools and use the comparison view.',
        'This works for a running production-like Node process via --inspect too.',
        'Comparing the two reveals which constructors grew between captures.',
      ],
    },
    intermediate: {
      label: 'Intermediate — confirming a leak with a repeatable loop',
      lang: 'js',
      code: `// In DevTools: take snapshot 1, run this, take snapshot 2, compare\nfunction leakRound() {\n  for (let i = 0; i < 1000; i++) {\n    window.addEventListener('resize', () => doWork(i)) // never removed!\n  }\n}\nleakRound() // each round adds 1000 listeners + closures that persist`,
      explanation: [
        'Running the same action between two snapshots makes growth visible and comparable.',
        'The diff shows 1000 new (closure) objects retained after each round.',
        'Selecting one and viewing its retainer path points to the window listener registry.',
        'That retainer path is the proof of cause, not just a symptom.',
      ],
    },
    advanced: {
      label: 'Advanced — distinguishing high usage from a real leak',
      lang: 'js',
      code: `function probe(action, rounds = 5) {\n  const samples = []\n  for (let r = 0; r < rounds; r++) {\n    action()\n    global.gc?.()                          // node --expose-gc\n    samples.push(process.memoryUsage().heapUsed)\n  }\n  return samples // rising monotonically => leak; flat => just high baseline\n}`,
      explanation: [
        'Sampling heapUsed across rounds, each after a forced GC, separates retention from churn.',
        'A monotonically rising series indicates a leak; a flat (sawtooth-collapsed) series is just high steady usage.',
        'Forcing GC removes short-lived garbage so only true retention shows.',
        'This quantifies the problem before you ever open a snapshot.',
      ],
    },
    realProject: {
      label: 'Real project — profiling a Vue/React SPA route leak',
      lang: 'js',
      code: `// Repro in DevTools Memory panel:\n// 1) Load app, take heap snapshot (baseline)\n// 2) Navigate into and out of the leaky route 10 times\n// 3) Force GC (trash-can icon), take snapshot 2\n// 4) Filter 'Detached' to find detached DOM + components\n// 5) Open retainer path -> often an uncleaned listener/subscription\n// 6) Add cleanup (useEffect return / onUnmounted) and re-verify`,
      explanation: [
        'Repeated route navigation is the repeatable action that exposes per-mount leaks.',
        'Filtering "Detached" surfaces DOM nodes and component instances that should have been collected.',
        'The retainer path usually leads to a subscription/timer/listener added on mount but never cleaned up.',
        'Re-profiling after adding cleanup confirms the detached count stops growing.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is memory profiling and what tools do you use?',
      answer: 'Measuring and analyzing heap usage to find what is allocated and what retains memory. In the browser you use Chrome DevTools\' Memory panel (heap snapshots, allocation timelines); in Node you use --inspect, process.memoryUsage(), and v8.writeHeapSnapshot().',
      explanation: 'Naming the concrete tools per environment shows hands-on familiarity.',
    },
    {
      level: 'beginner',
      question: 'How do you take and compare heap snapshots to find a leak?',
      answer: 'Take a baseline snapshot, perform a repeatable action one or more times, force GC, take a second snapshot, then use the comparison view to see which objects were allocated and are still alive between the two.',
      explanation: 'The repeatable-action + compare workflow is the core methodology.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between shallow size and retained size?',
      answer: 'Shallow size is the memory an object occupies by itself. Retained size is the total memory that would be freed if that object were collected, including everything it exclusively keeps alive (its dominator subtree).',
      explanation: 'Retained size is what tells you which object is actually responsible for big memory.',
    },
    {
      level: 'intermediate',
      question: 'How do you tell a real leak from just high memory usage?',
      answer: 'Sample heap usage across repeated identical actions, each after a forced GC. If retained memory rises monotonically, it is a leak; if it plateaus or sawtooths back to a baseline, it is just high steady usage.',
      explanation: 'The "does it return to baseline after GC?" test is the key discriminator.',
    },
    {
      level: 'advanced',
      question: 'What is a retainer path / dominator tree and how do you use it?',
      answer: 'The retainer path is the chain of references from a GC root to an object that keeps it alive; the dominator tree shows which object exclusively retains which others. You use the retainer path to find the exact reference (e.g. a Map entry or listener) to remove to fix a leak.',
      explanation: 'Senior signal: knowing the analysis goes "growing object -> retainer path -> root -> cut edge".',
    },
    {
      level: 'senior',
      question: 'Walk me through diagnosing a Node service whose RSS grows over days.',
      answer: 'Confirm with metrics (RSS, heapUsed over time). Write a script or use --inspect to capture heap snapshots at intervals under representative load, diff them to find the constructor that grows, follow its retainer path to the retaining root (often a module-scope cache or emitter), fix it (bound the cache, remove listeners), and re-profile to confirm the heap stabilizes.',
      explanation: 'A complete detect-capture-diff-retainer-fix-verify narrative is the senior differentiator.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does process.memoryUsage() report (rss, heapTotal, heapUsed, external, arrayBuffers)?',
    'Why force GC before taking a comparison snapshot?',
    'How do you profile memory in a production Node process safely?',
    'What is a "detached DOM node" and how do you find it in a snapshot?',
    'When would you use allocation sampling vs a full heap snapshot?',
    'How do you set up alerting for slow memory growth in production?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Comparing snapshots without forcing GC first.',
      why: 'Short-lived garbage that has not been collected yet inflates the diff and hides the real retained growth.',
      fix: 'Force GC (DevTools trash-can / --expose-gc) before each comparison snapshot so only true retention shows.',
    },
    {
      mistake: 'Treating high memory usage as automatically a leak.',
      why: 'A large but stable heap that returns to baseline after GC is not a leak — only monotonic growth is.',
      fix: 'Sample across repeated actions and check whether memory returns to baseline.',
    },
    {
      mistake: 'Looking only at shallow size and missing the real retainer.',
      why: 'Small objects can retain huge subtrees; shallow size hides this.',
      fix: 'Sort by retained size and follow the dominator/retainer path to the true cause.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Capture v8 heap snapshots from a live process via --inspect or v8.writeHeapSnapshot(), diff them to find growing constructors, and monitor process.memoryUsage() in dashboards.' },
    { area: 'React', detail: 'Use the DevTools Memory panel and the "Detached" filter to find components/DOM not freed after route changes, then add useEffect cleanup and re-verify.' },
    { area: 'Vue', detail: 'Profile navigation cycles to catch reactive effects/listeners not disposed in onUnmounted; confirm detached node counts stop growing after the fix.' },
    { area: 'Backend', detail: 'Long-running services add memory metrics (RSS/heap) to observability and alert on upward trends; on-call captures snapshots under load to localize retainers.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Profiling lets you catch GC pressure and leaks before users feel jank or the process OOMs.',
      'Allocation sampling pinpoints hot allocation sites so you can reduce churn at the source.',
    ],
    bad: [
      'Capturing a full heap snapshot pauses the runtime and is expensive on large heaps.',
      'Heavy instrumentation/sampling adds overhead, so it is unsuitable to leave always-on in hot paths.',
    ],
    optimizations: [
      'Use lightweight metrics (memoryUsage) for continuous monitoring; reserve snapshots for investigation.',
      'Reduce allocation rate at hot sites identified by sampling (reuse objects, hoist closures).',
      'Bound caches and clean up listeners/timers — the fixes profiling most often points to.',
      'Profile under representative load and repeatable actions so results are comparable.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['garbage-collection', 'memory-leaks', 'stack-vs-heap'],
    nextConcepts: ['weakmap-weakset', 'weakref-finalizationregistry', 'devtools-debugging', 'core-web-vitals'],
    dependencyNote:
      'Memory profiling applies garbage-collection and stack-vs-heap knowledge to find and fix memory-leaks; it shares tooling with devtools-debugging and feeds performance work tracked by core-web-vitals.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two snapshot boxes: A (baseline) and B (after repeating the action).',
      'Draw a DIFF arrow between them and write "objects new in B and still alive".',
      'Pick the growing object and draw a retainer path: root -> Map -> entry -> object.',
      'Circle the bad edge and say "cut this reference to fix".',
      'Note shallow vs retained size beside the object.',
      'Close the loop: "fix, repeat the action, confirm heap returns to baseline".',
    ],
    diagram: `  A ──diff──► B   (what grew & survived?)
  root ─► Map ─► entry ─► (LEAK)   shallow=small, retained=HUGE
                              ▲ cut this edge
  fix -> re-run -> heap back to baseline = verified`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Memory profiling measures and analyzes the heap to find what is allocated and what retains it. The core workflow: baseline snapshot, repeat the action, force GC, second snapshot, diff to find objects that grew and survived, then follow the retainer path to the root and cut that reference. Read shallow size (the object alone) vs retained size (everything it keeps alive). Distinguish a leak (monotonic growth after GC) from high-but-stable usage. Tools: Chrome DevTools Memory panel in the browser; --inspect, process.memoryUsage(), and v8.writeHeapSnapshot() in Node.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Memory profiling is how I turn a vague "the app feels like it leaks" into hard evidence about which object grows and what keeps it alive. The foundation is the heap snapshot, which serializes the entire live object graph with each object\'s shallow size — the memory it occupies itself — and its retained size, the memory that would be freed if it were collected, including everything it exclusively dominates. My methodology is to take a baseline snapshot, perform a repeatable action one or several times, force garbage collection so transient garbage does not pollute the result, then take a second snapshot and use the comparison view to see exactly which objects were allocated and are still alive between the two. For a suspicious object I open its retainer path, the chain of references from a GC root that keeps it alive, which almost always lands on the real culprit: a module-scope Map, an event-listener registry, a running timer, or a closure. The first question I answer is whether it is even a leak: I sample heap usage across repeated identical actions after forced GC, and if it rises monotonically it is a leak, whereas if it returns to a baseline it is just high steady usage. Tooling differs by environment — Chrome DevTools\' Memory panel, including the Detached filter for orphaned DOM, in the browser, and --inspect, process.memoryUsage(), and v8.writeHeapSnapshot() in Node. Then I cut the retaining reference, re-run the same action, and confirm the heap returns to baseline, which is the verification step people often skip.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Full heap snapshots give complete detail but pause the runtime and are costly on large heaps; sampling is cheap but approximate.',
      'Continuous instrumentation catches regressions early but adds overhead, so production needs lightweight metrics plus on-demand deep capture.',
    ],
    edgeCases: [
      'External memory (ArrayBuffers, native bindings) is reported separately and can leak without growing the JS heap obviously.',
      'Detached DOM leaks may not appear unless you filter for them and force GC first.',
      'Closures can make a tiny object retain a huge subtree; sorting by retained size, not shallow, is essential.',
    ],
    runtimeBehavior: [
      'Snapshots are taken at a stop-the-world moment, so they reflect a consistent graph but momentarily pause execution.',
      'Forcing GC before a comparison snapshot is required to avoid counting not-yet-collected garbage.',
      'process.memoryUsage() distinguishes rss, heapTotal, heapUsed, external, and arrayBuffers — each tells a different story.',
    ],
    scalability: [
      'Snapshotting a multi-gigabyte production heap can be disruptive; capture on a canary or replica under representative load.',
      'Automate periodic snapshots and diffs in long-running services to catch slow growth before OOM.',
    ],
    productionConcerns: [
      'Alert on memory TRENDS (slope), not just thresholds, to catch slow leaks early.',
      'Always verify a fix by re-profiling; assuming a fix worked is a common regression source.',
      'Be cautious taking snapshots in production — they pause the process and can affect SLOs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Workflow: baseline snapshot -> repeat action -> force GC -> second snapshot -> diff.',
    'Shallow size = object alone; retained size = all it keeps alive.',
    'Sort by RETAINED size to find the real culprit.',
    'Retainer path = root -> ... -> object; cut the bad edge to fix.',
    'Leak = monotonic growth after GC; high+stable = not a leak.',
    'Browser: DevTools Memory panel; use "Detached" filter for DOM leaks.',
    'Node: --inspect, process.memoryUsage(), v8.writeHeapSnapshot().',
    'Force GC before comparison snapshots (DevTools trash-can / --expose-gc).',
    'memoryUsage fields: rss, heapTotal, heapUsed, external, arrayBuffers.',
    'Allocation sampling -> find hot allocation sites / GC pressure.',
    'Always re-profile to VERIFY the fix.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a helper that logs net retained heap (in MB) around a function, forcing GC.',
      hint: 'process.memoryUsage().heapUsed before/after; node --expose-gc.',
      solution: {
        lang: 'js',
        code: `function measure(fn) {\n  global.gc?.()\n  const before = process.memoryUsage().heapUsed\n  fn()\n  global.gc?.()\n  const after = process.memoryUsage().heapUsed\n  console.log(((after - before) / 1048576).toFixed(2), 'MB retained')\n}`,
        explanation: [
          'GC before and after isolates true retention from transient garbage.',
          'The delta in heapUsed, converted to MB, quantifies what the function kept alive.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Sample heap across N rounds of an action and decide leak vs stable.',
      hint: 'Rising series = leak; flat = stable.',
      solution: {
        lang: 'js',
        code: `function isLeaking(action, rounds = 6) {\n  const samples = []\n  for (let i = 0; i < rounds; i++) {\n    action()\n    global.gc?.()\n    samples.push(process.memoryUsage().heapUsed)\n  }\n  const rising = samples.every((v, i) => i === 0 || v >= samples[i - 1])\n  return rising && samples[rounds - 1] > samples[0] * 1.2\n}`,
        explanation: [
          'Each round samples heapUsed after a forced GC, capturing retention only.',
          'A consistently rising series with meaningful growth flags a leak versus a flat baseline.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a Node script that dumps two named heap snapshots around a workload for offline diffing.',
      hint: 'v8.writeHeapSnapshot() returns the file path; rename for clarity.',
      solution: {
        lang: 'js',
        code: `const v8 = require('v8'), fs = require('fs')\nfunction snap(name) {\n  global.gc?.()\n  const f = v8.writeHeapSnapshot()\n  fs.renameSync(f, name + '.heapsnapshot')\n}\nsnap('before')\nfor (let i = 0; i < 50; i++) runWorkload()\nsnap('after')\n// Load both into Chrome DevTools -> Comparison view`,
        explanation: [
          'Two snapshots around a repeated workload make growth diffable in DevTools.',
          'Forcing GC before each keeps the comparison focused on retained objects.',
          'The Comparison view reveals which constructors grew and survived.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Describe end-to-end how you would localize and verify the fix for a detached-DOM leak in an SPA.',
      hint: 'Repeat navigation, force GC, Detached filter, retainer path, add cleanup, re-verify.',
      solution: {
        lang: 'js',
        code: `// 1) Baseline heap snapshot after first load\n// 2) Navigate into/out of the suspect route ~10x\n// 3) Click trash-can (force GC), take snapshot 2\n// 4) Filter 'Detached' -> find detached nodes/components still alive\n// 5) Open retainer path -> e.g. window listener / store subscription\n// 6) Add cleanup (useEffect return / onUnmounted; removeEventListener)\n// 7) Repeat steps 2-4 and confirm detached count no longer grows`,
        explanation: [
          'Repeated navigation is the repeatable action that triggers per-mount retention.',
          'The Detached filter surfaces DOM/components that should have been collected.',
          'The retainer path identifies the exact uncleaned reference to fix.',
          'Re-profiling after the fix is what proves the leak is gone.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Memory profiling is the senior skill that converts memory anxiety into a repeatable, evidence-based process. Being able to confidently say "baseline, repeat, force GC, diff, retainer path, fix, verify" instantly signals production maturity.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "which tools do you use to find a leak?". Product companies (Zoho, Flipkart, Razorpay) ask you to describe the snapshot/diff workflow and shallow vs retained size. FAANG-level interviews give a production scenario (growing RSS) and expect a full methodology including dominators and verification.',
    whatInterviewersExpect:
      'They expect the snapshot-compare workflow, the shallow-vs-retained distinction, the retainer/dominator path to localize the cause, the leak-vs-stable test, environment-specific tooling, and an explicit verification step.',
  },
}

export default memoryProfiling
