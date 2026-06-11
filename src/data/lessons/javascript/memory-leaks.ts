import type { ConceptLesson } from '../../../types/lesson'

const memoryLeaks: ConceptLesson = {
  // 1. Concept Summary
  slug: 'memory-leaks',
  name: 'Memory Leaks',
  category: 'memory-model',
  difficulty: 'senior',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Memory leaks are one of the most common causes of real production incidents — slow tabs, crashing SPAs, and Node servers that OOM after hours of uptime.',
    'They are invisible in a quick local test and only surface under sustained use, which is exactly why teams value engineers who can prevent and find them.',
    'Understanding leaks proves you truly understand reachability and the garbage collector — the GC never fails; YOU keep things reachable.',
    'The four classic sources (forgotten timers, dangling listeners, detached DOM, growing caches/closures) appear in nearly every codebase.',
    'Senior interviews use "how would you find and fix a leak?" to test debugging methodology, not just trivia.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A memory leak is forgetting to let go of balloons — you keep grabbing new ones but never release the old, so your hands fill up.',
    story: [
      'Imagine every time you play a game you grab a new balloon and hold its string.',
      'When you finish the game you are supposed to let the balloon go so your hands are free for the next one.',
      'But if you forget to let go, your hands slowly fill with old balloons you do not even use anymore.',
      'Eventually you cannot hold anything new and you are stuck. A program leaks the same way: it keeps holding onto memory it no longer needs, until it runs out of room.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Programs ask the computer for memory to store data and are supposed to release it when done so it can be reused.',
    'JavaScript releases memory automatically — but only for data nothing is pointing at anymore.',
    'A memory leak happens when the program keeps a hidden pointer to data it no longer needs, so the cleanup system thinks the data is still in use.',
    'Over time these forgotten pieces pile up, the program uses more and more memory, and it can slow down or crash.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A memory leak is memory that is no longer needed by the application but cannot be reclaimed by the garbage collector because something still holds a reachable reference to it.',
    how: 'The GC only frees unreachable objects. A leak occurs when a long-lived structure (a timer, an event listener, a global/cache, or a closure) keeps a reference to data you are done with, so it stays reachable and the GC must keep it forever.',
    why: 'Leaks degrade performance and stability: SPAs get sluggish as the heap grows, and long-running Node processes eventually exceed their memory limit and crash. Preventing them is about disciplined cleanup of references.',
    code: {
      label: 'A timer that leaks',
      lang: 'js',
      code: `function startWidget(bigData) {\n  const id = setInterval(() => {\n    use(bigData)   // closure keeps bigData reachable forever\n  }, 1000)\n  // BUG: nothing ever calls clearInterval(id)\n}\nstartWidget(new Array(1e6))`,
      explanation: [
        'setInterval keeps the callback alive as long as the timer runs.',
        'The callback closes over `bigData`, so `bigData` stays reachable for the timer\'s lifetime.',
        'Because the interval is never cleared, the timer (and `bigData`) live forever.',
        'Even after the widget is gone from the screen, the megabyte array cannot be collected — that is the leak.',
        'Fix: store the id and call clearInterval on cleanup/unmount.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A memory leak in JavaScript is the unintended retention of heap memory: objects that are logically dead (the program will never use them again) remain reachable from a GC root and are therefore never reclaimed. Because collection is reachability-based, leaks are always caused by lingering references — typically through long-lived containers (globals, module-scope caches, the event-listener registry), scheduled callbacks (timers), detached DOM subtrees still referenced from JS, or closures that capture large environments. The heap grows monotonically under sustained use until performance degrades or the process exhausts its memory limit.',

  // 7. Internal Working
  internalWorking: [
    'A long-lived owner (global variable, module-scope Map, the DOM, or a running timer) holds a reference to an object.',
    'That object would otherwise be eligible for collection once its logical use ends, but the lingering reference keeps it reachable from a root.',
    'On each GC cycle, the collector traces from roots, finds a path to the object, marks it live, and does NOT reclaim it.',
    'If the leaking pattern recurs (e.g. a listener added per navigation, an entry added per request), the retained set grows monotonically.',
    'In the browser this manifests as ever-increasing heap-used and detached DOM node counts; in Node as growing RSS / old-space and eventual OOM.',
    'Fixing the leak means severing the reference — remove the listener, clear the timer, evict the cache entry, or null the binding — so the next GC cycle finds the object unreachable.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ROOT (global / timer / listener registry / DOM)
     │  (unintended, lingering reference)
     ▼
   ┌────────────────────────┐
   │ "dead" data you no      │   reachable -> GC keeps it
   │ longer need (big array, │   forever -> heap grows
   │ component, DOM subtree) │
   └────────────────────────┘

   add per navigation/request -> the retained set never shrinks:
     t0: [X]   t1: [X][X]   t2: [X][X][X]  ... -> OOM`,

  // 9. Memory Visualization
  memoryVisualization: [
    'ROOTS as leak anchors: globals, the running timer set, the DOM tree, and the event-listener registry all act as roots that can unintentionally pin objects.',
    'CLOSURE capture: a surviving callback keeps its entire environment record reachable, so large captured objects cannot be freed.',
    'DETACHED DOM: a removed DOM subtree still referenced by a JS variable stays on the heap (the node and its descendants).',
    'MONOTONIC GROWTH: repeated leaky operations append to a retained set that the GC can never shrink, so heap-used trends upward instead of sawtoothing.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — accidental global',
      lang: 'js',
      code: `function process() {\n  leaked = new Array(1e6)   // no var/let/const -> implicit global\n}\nprocess()\n// 'leaked' is attached to the global object and never collected`,
      explanation: [
        'Forgetting var/let/const (outside strict mode) creates a property on the global object.',
        'The global object is a root, so `leaked` stays reachable for the program\'s life.',
        'Each call could overwrite or accumulate such globals, pinning large data.',
        'Strict mode turns this into a ReferenceError, preventing the accidental global entirely.',
      ],
    },
    intermediate: {
      label: 'Intermediate — dangling event listener',
      lang: 'js',
      code: `class Widget {\n  constructor(el) {\n    this.el = el\n    this.onClick = () => this.handle()   // closes over 'this'\n    window.addEventListener('resize', this.onClick)\n  }\n  destroy() {\n    // BUG if omitted: listener pins 'this' (and el) forever\n    window.removeEventListener('resize', this.onClick)\n  }\n}`,
      explanation: [
        'The resize listener is registered on the long-lived `window`.',
        'The handler closes over `this`, so the whole Widget (and its DOM element) stays reachable.',
        'If destroy() is never called (or omits removeEventListener), the Widget can never be collected.',
        'You must remove the exact same function reference; an inline arrow you cannot reference later cannot be removed.',
      ],
    },
    advanced: {
      label: 'Advanced — detached DOM kept alive by JS',
      lang: 'js',
      code: `let detached\nfunction cache() {\n  const list = document.getElementById('list')\n  detached = list           // JS reference to the node\n  list.remove()             // removed from the document...\n}\ncache()\n// ...but 'detached' still references it, so the node + its children leak`,
      explanation: [
        'Removing a node from the document does not free it if JS still references it.',
        '`detached` keeps the node — and its entire subtree — reachable on the heap.',
        'DevTools shows these as "Detached HTMLElement" entries in a heap snapshot.',
        'Fix: set `detached = null` when done so the subtree becomes collectible.',
      ],
    },
    realProject: {
      label: 'Real project — React effect without cleanup',
      lang: 'js',
      code: `useEffect(() => {\n  const id = setInterval(() => poll(), 1000)\n  const sub = store.subscribe(onChange)\n  // WITHOUT this return, the interval + subscription leak on unmount:\n  return () => {\n    clearInterval(id)\n    sub.unsubscribe()\n  }\n}, [])`,
      explanation: [
        'Effects that create timers or subscriptions must return a cleanup function.',
        'Without cleanup, every mount/unmount leaves a live timer and subscription referencing stale closures.',
        'In an SPA navigating between pages, these accumulate and the heap grows steadily.',
        'Vue\'s onUnmounted and AbortController-based listeners solve the same problem the same way.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a memory leak in JavaScript?',
      answer: 'Memory that the application no longer needs but cannot be garbage collected because something still holds a reachable reference to it, so the heap grows over time.',
      explanation: 'A good answer ties leaks to reachability — the GC works fine; references linger.',
    },
    {
      level: 'beginner',
      question: 'Name common causes of memory leaks.',
      answer: 'Accidental globals, forgotten timers (setInterval/setTimeout), event listeners that are never removed, detached DOM nodes still referenced by JS, and unbounded caches or closures capturing large data.',
      explanation: 'Interviewers want the canonical four-or-five categories, not just one.',
    },
    {
      level: 'intermediate',
      question: 'Why does an un-removed event listener leak memory?',
      answer: 'The listener is held by a long-lived target (e.g. window/document). Its callback closes over the component and any captured data, keeping all of it reachable. Until you removeEventListener with the same reference, none of it can be collected.',
      explanation: 'The link between listener registry, closure capture, and reachability is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'How would you confirm whether a leak exists?',
      answer: 'Reproduce a repeatable action, take heap snapshots before/after in DevTools (or Node), and look for objects that grow with each cycle. Use the allocation timeline and "comparison" view; watch for rising detached DOM counts or a heap that never returns to baseline after GC.',
      explanation: 'Methodology (repeat action, snapshot, compare) signals real debugging experience.',
    },
    {
      level: 'advanced',
      question: 'How do closures contribute to leaks and how do you mitigate them?',
      answer: 'A surviving closure keeps its entire environment record alive, so large captured objects cannot be freed even if only a small variable is used. Mitigate by capturing only what you need, nulling references when done, and using WeakMap/WeakRef for object-keyed data so it remains collectible.',
      explanation: 'Senior signal: environment-record retention and Weak collections as the structural fix.',
    },
    {
      level: 'senior',
      question: 'You see a Node service whose RSS climbs steadily over days. How do you diagnose and fix it?',
      answer: 'Confirm growth with metrics (RSS/old-space). Capture heap snapshots at intervals and diff them to find the constructor/retainer that grows. Trace the retainer path to the root holding it (often a module-scope Map, listener, or cache). Fix by bounding the cache (LRU/TTL), removing listeners, clearing timers, or using Weak references, then verify the heap stabilizes.',
      explanation: 'Demonstrates end-to-end methodology: detect, snapshot, diff, find retainer path, fix, verify.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is a detached DOM node and how do you spot it in a heap snapshot?',
    'How does AbortController help remove many listeners at once?',
    'Why can WeakMap/WeakRef prevent certain leaks?',
    'What is the difference between high memory usage and an actual leak?',
    'How do you bound a cache so it cannot leak?',
    'How would you set up monitoring/alerts for slow memory growth in production?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Adding event listeners without ever removing them.',
      why: 'The listener (and everything its closure captures) stays reachable through the long-lived event target.',
      fix: 'Remove listeners on cleanup/unmount with the same reference, or use AbortController to remove a whole group at once.',
    },
    {
      mistake: 'Using setInterval without clearing it.',
      why: 'A running interval keeps its callback and captured data alive indefinitely.',
      fix: 'Store the timer id and clearInterval on teardown; prefer self-rescheduling setTimeout when appropriate.',
    },
    {
      mistake: 'Caching in an unbounded Map/object keyed by objects.',
      why: 'Entries are referenced strongly and grow without limit, pinning keys and values forever.',
      fix: 'Use a bounded LRU/TTL cache, or a WeakMap so entries vanish when keys are no longer used elsewhere.',
    },
    {
      mistake: 'Keeping a JS reference to a removed DOM node.',
      why: 'The detached node and its subtree stay on the heap as long as the variable references them.',
      fix: 'Null out the reference when the node is no longer needed.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'useEffect cleanup functions must clear timers and unsubscribe; missing cleanup is the #1 SPA leak, accumulating across route changes.' },
    { area: 'Vue', detail: 'onUnmounted (or onScopeDispose) removes listeners and intervals; long-lived Pinia/Vuex stores must avoid pushing into arrays that are never trimmed.' },
    { area: 'Node.js', detail: 'EventEmitter listeners (and the MaxListenersExceededWarning), unbounded in-memory caches, and per-request state stored at module scope cause steady RSS growth over uptime.' },
    { area: 'Backend', detail: 'Connection/stream objects retained in maps, or promises that never settle, keep request context alive; bounded caches, timeouts, and AbortControllers prevent accumulation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A leak-free app keeps a stable heap that sawtooths around a baseline as the GC reclaims short-lived data.',
      'Bounded caches and prompt cleanup keep latency predictable by avoiding ever-growing collection cost.',
    ],
    bad: [
      'Growing heaps make GC cycles longer and more frequent, adding pauses and latency.',
      'Severe leaks cause crashes: tab "Aw, Snap" in the browser or OOM kills in Node.',
    ],
    optimizations: [
      'Always pair add/remove: addEventListener+removeEventListener, setInterval+clearInterval, subscribe+unsubscribe.',
      'Bound every cache (LRU/TTL) and prefer WeakMap/WeakSet for object-keyed data.',
      'Use AbortController to tear down listeners and fetches in one signal.',
      'Profile with heap snapshots and diff retained sets to find and confirm fixes.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Sustained memory growth is a denial-of-service vector: an attacker can trigger the leaking path repeatedly to exhaust memory and crash the service.',
      'Leaked objects may retain sensitive data (tokens, PII) in memory far longer than intended, widening the window for heap-dump exposure.',
    ],
    bestPractices: [
      'Bound caches and request-scoped state so untrusted input cannot drive unbounded growth.',
      'Clear sensitive values when done and avoid pinning them in long-lived closures or globals.',
      'Add memory monitoring/alerting so abnormal growth is caught before it becomes an outage.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['garbage-collection', 'stack-vs-heap', 'closure'],
    nextConcepts: ['weakmap-weakset', 'weakref-finalizationregistry', 'memory-profiling', 'event-system'],
    dependencyNote:
      'Memory leaks are the practical consequence of garbage-collection plus reference semantics; preventing them leans on closures, the Weak collections, and the event system, and diagnosing them requires memory-profiling.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a long-lived root box: window / timer / cache.',
      'Draw an arrow from it to a "dead data" object you no longer need.',
      'Say: "the GC traces from the root, reaches this, marks it live — so it is never freed."',
      'Replicate the arrow a few times (per navigation/request) to show the retained set growing.',
      'Cross out the arrow and say "remove listener / clear timer / evict entry -> next GC frees it".',
      'Finish with the diagnosis loop: repeat action, snapshot, diff, find retainer, fix, verify.',
    ],
    diagram: `  window/timer/cache (ROOT)
        │  lingering ref
        ▼
   [ dead data ]  reachable -> kept
        │
   repeat -> [X][X][X]...  heap only grows
   cut the ref -> next GC reclaims it`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A memory leak is memory you no longer need that the GC cannot reclaim because something still references it. The GC never fails — references linger. The classic sources are accidental globals, uncleared timers, un-removed event listeners, detached DOM nodes referenced by JS, and unbounded caches or closures. Symptoms are a heap that only grows, eventually causing jank or OOM. You find leaks by repeating an action and diffing heap snapshots, and you fix them by severing references: remove listeners, clear timers, bound caches, and use WeakMap/WeakRef.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A memory leak in JavaScript is heap memory the application no longer needs but cannot reclaim, because collection is reachability-based and something still references the data. The garbage collector itself is not at fault — a leak is always a lingering reference from a root. The classic sources are accidental globals from missing var/let/const, timers created with setInterval that are never cleared, event listeners added but never removed, detached DOM nodes still referenced by a JS variable, and unbounded caches or closures that capture large objects. The symptom is a heap that grows monotonically under sustained use instead of sawtoothing around a baseline; in the browser that means a sluggish or crashing tab, and in Node it means rising RSS and eventual OOM. To diagnose, I make the suspicious action repeatable, take heap snapshots before and after, and diff them to find which constructor grows and what retainer path keeps it alive back to a root — often a module-scope Map, a listener, or a running timer. The fix is structural: pair every add with a remove, clear timers, bound caches with LRU or TTL, null out references to detached nodes, and use WeakMap or WeakRef for object-keyed data so the GC can do its job. In React I return a cleanup function from useEffect; in Vue I use onUnmounted; and AbortController lets me tear down groups of listeners and fetches at once.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Caching improves latency but every cache is a potential leak; bounding it trades hit-rate for memory safety.',
      'WeakMap/WeakRef prevent leaks but make timing non-deterministic — you cannot rely on when entries disappear.',
    ],
    edgeCases: [
      'Listeners added with anonymous inline functions cannot be removed because you have no reference to pass to removeEventListener.',
      'Promises that never settle keep their .then chains and captured context alive indefinitely.',
      'Closures retain the whole environment record, so capturing one small variable can pin a large sibling object.',
    ],
    runtimeBehavior: [
      'A leak shows as heap-used that fails to return to baseline after forced GC, plus rising detached-node counts in the browser.',
      'Node\'s old-space grows and major GCs lengthen; --max-old-space-size only delays the OOM.',
      'EventEmitter warns at >10 listeners (MaxListenersExceededWarning) — often an early leak signal.',
    ],
    scalability: [
      'Per-request or per-connection state retained at module scope multiplies with traffic and is the most common server leak.',
      'In long-lived SPAs, leaks compound across navigations; the longer the session, the worse the symptom.',
    ],
    productionConcerns: [
      'Set up memory monitoring and alert on slow upward trends, not just spikes.',
      'Reproduce with a scripted repeat-action harness so snapshots are comparable.',
      'Treat unbounded growth as a potential DoS surface for untrusted-input-driven paths.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Leak = unneeded memory kept reachable, so GC cannot free it.',
    'The GC never fails — a stray reference is the cause.',
    'Classic sources: globals, timers, listeners, detached DOM, unbounded caches/closures.',
    'Symptom: heap grows monotonically (no sawtooth back to baseline).',
    'Pair every add with a remove (listener/timer/subscription).',
    'Bound caches with LRU/TTL; prefer WeakMap/WeakSet for object keys.',
    'Anonymous inline listeners cannot be removed — keep a reference.',
    'Detached DOM = removed node still referenced by JS.',
    'Diagnose: repeat action -> heap snapshot -> diff -> find retainer -> fix -> verify.',
    'React: useEffect cleanup. Vue: onUnmounted. Listeners/fetch: AbortController.',
    'Sustained growth can be a DoS vector and can retain sensitive data.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Spot and fix the leak: `setInterval(() => render(state), 1000)` inside a component that can be destroyed.',
      hint: 'Store the id; clear it on teardown.',
      solution: {
        lang: 'js',
        code: `let id\nfunction mount() {\n  id = setInterval(() => render(state), 1000)\n}\nfunction unmount() {\n  clearInterval(id)   // sever the reference so callback + state can be GC'd\n}`,
        explanation: [
          'The interval keeps its callback (and `state`) alive while it runs.',
          'Clearing it on unmount removes the reference so the GC can reclaim everything captured.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite so the resize listener can actually be removed later.',
      hint: 'You cannot remove an anonymous inline function — keep a reference.',
      solution: {
        lang: 'js',
        code: `const onResize = () => layout()\nwindow.addEventListener('resize', onResize)\n// later, on cleanup:\nwindow.removeEventListener('resize', onResize)`,
        explanation: [
          'removeEventListener needs the exact same function reference that was added.',
          'Storing `onResize` makes removal possible, so window stops pinning the handler and its closure.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Convert an unbounded object-keyed cache into one that does not leak when keys go out of use.',
      hint: 'WeakMap keys are held weakly.',
      solution: {
        lang: 'js',
        code: `// Leaky: const cache = new Map()\nconst cache = new WeakMap()\nfunction getComputed(node) {\n  if (!cache.has(node)) cache.set(node, expensive(node))\n  return cache.get(node)\n}\n// when 'node' is no longer referenced elsewhere, its entry is collectible`,
        explanation: [
          'A Map holds keys strongly, so keyed nodes can never be collected while cached.',
          'A WeakMap holds keys weakly; once nothing else references a node, its entry and the node are collectible.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Describe your step-by-step process to find a leak in a long-running app, then show the cleanup fix for a subscription.',
      hint: 'Repeat action, snapshot, diff, retainer path, fix, verify.',
      solution: {
        lang: 'js',
        code: `// Process: 1) repeat the suspect action N times\n//          2) take heap snapshots before/after, diff them\n//          3) find the constructor that grows + its retainer path to a root\n//          4) sever that reference; 5) re-run and confirm heap returns to baseline\n\n// Example fix: always unsubscribe\nconst unsub = store.subscribe(onChange)\nfunction cleanup() { unsub() }   // drop the reference => collectible`,
        explanation: [
          'The diagnostic loop turns a vague "it leaks" into a concrete retainer to fix.',
          'The retainer path tells you which root keeps the data alive.',
          'Unsubscribing severs the reference so the callback and captured state become unreachable.',
          'Verifying with a fresh snapshot confirms the fix rather than assuming it.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Memory leaks are where theory meets production pain. Engineers who can prevent, find, and fix them are trusted with long-running systems — and the topic proves you understand the GC at a level beyond definitions.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to list common causes. Product companies (Zoho, Flipkart, Razorpay) ask why a listener/timer leaks and how to fix it, and probe WeakMap usage. FAANG-level interviews give a scenario ("RSS grows over days") and expect a full diagnose-snapshot-diff-fix-verify methodology.',
    whatInterviewersExpect:
      'They expect you to tie leaks to reachability, name the classic sources, show the cleanup patterns (remove/clear/unsubscribe, bound caches, Weak collections), and describe a real heap-snapshot debugging workflow.',
  },
}

export default memoryLeaks
