import type { ConceptLesson } from '../../../types/lesson'

const eventLoopStarvation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-loop-starvation',
  name: 'Event-Loop Starvation',
  category: 'async',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Event-loop starvation is the root cause of "my app froze" — the single thread is busy and nothing else (clicks, paints, timers) can run.',
    'It explains why an infinite stream of microtasks (promises) can lock a page harder than a slow synchronous loop, because microtasks run before the browser ever gets to repaint.',
    'Without understanding it, you will write code that passes in development but jank on real data, real devices, and real network conditions.',
    'It separates engineers who know "JS is single-threaded" as a slogan from those who understand the priority ordering of the task queues.',
    'It is the foundation for every responsiveness technique: chunking, yielding, web workers, requestIdleCallback, and cooperative scheduling.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'It is one cashier at a shop who never lets the next person pay because he keeps serving the same customer.',
    story: [
      'Imagine a shop with only ONE cashier and a long line of people waiting to pay.',
      'The cashier is fair: he serves one person, then the next, then the next.',
      'But one day a customer keeps adding more and more items at the counter and never finishes. The cashier is stuck on that one person forever.',
      'Everyone else in line just stands there, unable to pay or leave. The shop looks frozen even though the cashier is working very hard. That stuck-forever situation is starvation: one job hogs the only worker so all the other jobs starve.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript does one thing at a time using a single main thread, and a loop called the event loop decides what to do next.',
    'After the current code finishes, the event loop picks the next waiting job — a timer, a click, a network response — and runs it.',
    'If your current code never finishes, or keeps creating new urgent jobs, the event loop never gets a turn to handle clicks or redraw the screen.',
    'That is starvation: the important everyday jobs (like responding to a button) never get a chance because something keeps cutting in line.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Event-loop starvation happens when the single main thread is kept continuously busy — by a long synchronous task or an endless flood of higher-priority microtasks — so lower-priority work (rendering, timers, user input) never gets to run.',
    how: 'The event loop runs the call stack to empty, then drains ALL microtasks, then maybe renders, then takes ONE macrotask. If the stack never empties, or microtasks keep refilling, the loop never reaches rendering or the next macrotask.',
    why: 'Knowing the ordering lets you keep the UI responsive: break big work into chunks, yield control back to the loop, or move work off the main thread.',
    code: {
      label: 'Two ways to freeze the page',
      lang: 'js',
      code: `// 1) Synchronous starvation: blocks for 5s, no clicks, no paint\nfunction blockSync() {\n  const end = Date.now() + 5000\n  while (Date.now() < end) {} // hogs the thread\n}\n\n// 2) Microtask starvation: promises keep refilling the microtask queue\nfunction blockMicrotasks() {\n  function loop() {\n    Promise.resolve().then(loop) // schedules itself forever\n  }\n  loop() // page never repaints, timers never fire\n}`,
      explanation: [
        'blockSync holds the call stack with a busy-wait loop; the event loop cannot move on, so the page is frozen for 5 seconds.',
        'blockMicrotasks looks harmless because each callback is tiny, but each one schedules another microtask.',
        'The event loop must drain the ENTIRE microtask queue before rendering or running timers, so it never escapes the loop.',
        'This is why "lots of small promises" can be worse than one big sync block — they jump the queue ahead of rendering.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Event-loop starvation is a liveness failure in JavaScript\'s single-threaded concurrency model in which a class of pending work is indefinitely deprived of execution time. Because the event loop drains the entire microtask queue to completion after each macrotask and before the rendering opportunity, an unbounded or self-replenishing microtask chain prevents rendering, input handling, and macrotask dequeuing. Equivalently, a long synchronous task monopolizes the call stack so the loop never reaches the next tick. The symptom is an unresponsive UI or perpetually deferred timers despite the thread being fully utilized.',

  // 7. Internal Working
  internalWorking: [
    'A tick of the event loop begins by running the current macrotask (a script, timer callback, I/O event) to the point where the call stack empties.',
    'Once the stack is empty, the engine drains the microtask queue: it runs microtasks one by one, and any microtask that schedules another microtask appends to the SAME queue, which must also be drained before continuing.',
    'Only after the microtask queue is fully empty does the browser get a rendering opportunity (style, layout, paint) — roughly aligned to the display refresh (~16.7ms at 60Hz).',
    'After rendering, the loop returns to take the NEXT single macrotask from the macrotask queue.',
    'Starvation type A (synchronous): a long-running synchronous task never lets the stack empty, so step 2 onward never happens — input and paint are blocked.',
    'Starvation type B (microtask): the microtask queue never empties because callbacks keep enqueuing more microtasks, so steps 3-4 are never reached — rendering and timers are perpetually deferred even though no single task is long.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  ONE TICK OF THE EVENT LOOP (priority order, top = first)

   ┌──────────────────────────────────────────────┐
   │ 1. Run current MACROTASK until stack is empty  │
   └──────────────────────────────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────────┐
   │ 2. Drain ALL MICROTASKS  ◄── refills here =   │
   │    (promises, queueMicrotask)     STARVATION B │
   └──────────────────────────────────────────────┘
                      │  (only when empty)
                      ▼
   ┌──────────────────────────────────────────────┐
   │ 3. RENDER (style/layout/paint)  ◄── never      │
   │                              reached if 1 or 2 │
   │                              never finish      │
   └──────────────────────────────────────────────┘
                      │
                      ▼
   ┌──────────────────────────────────────────────┐
   │ 4. Take NEXT macrotask (setTimeout, click...)  │
   │    blocked forever by STARVATION A (long sync) │
   └──────────────────────────────────────────────┘`,

  // 9. Memory Visualization
  memoryVisualization: [
    'CALL STACK: a long synchronous task keeps frames on the stack; until they pop, no queue is consulted — the thread is pinned.',
    'MICROTASK QUEUE: lives in the heap and can grow unbounded if callbacks re-enqueue; a self-replenishing chain keeps it non-empty forever, so memory may also climb if results accumulate.',
    'MACROTASK QUEUE: timers and events sit here waiting; under starvation they accumulate but are never serviced, so "due" timers fire late or never.',
    'No extra threads are involved — everything competes for the one main thread, which is exactly why one greedy job starves all others.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a long sync loop blocks input',
      lang: 'js',
      code: `button.addEventListener('click', () => console.log('clicked'))\n\n// This runs and freezes everything for ~3s\nconst end = Date.now() + 3000\nwhile (Date.now() < end) {\n  // busy work\n}\n// clicks during this window are queued but handled only AFTER the loop ends`,
      explanation: [
        'The while loop holds the call stack for 3 seconds.',
        'Clicks are recorded as pending macrotasks but cannot run until the stack empties.',
        'The page cannot repaint, so it looks frozen — classic synchronous starvation.',
        'Fix: chunk the work or move it to a worker so the loop can breathe.',
      ],
    },
    intermediate: {
      label: 'Intermediate — microtasks beat setTimeout to starvation',
      lang: 'js',
      code: `setTimeout(() => console.log('timeout (macrotask)'), 0)\n\nlet n = 0\nfunction microStorm() {\n  if (n++ < 1e6) Promise.resolve().then(microStorm)\n}\nmicroStorm()\n\nconsole.log('sync done')\n// Order: 'sync done', then 1,000,000 microtasks drain,\n// and ONLY then 'timeout (macrotask)' — the timer is starved meanwhile`,
      explanation: [
        'The microtask chain enqueues a million callbacks before the timer can run.',
        'The event loop must drain the entire microtask queue before taking the setTimeout macrotask.',
        'So the timer is delayed far past its 0ms target — starved by higher-priority microtasks.',
        'This shows microtasks have priority over macrotasks and over rendering.',
      ],
    },
    advanced: {
      label: 'Advanced — chunked processing that yields to the loop',
      lang: 'js',
      code: `function processInChunks(items, work, chunk = 500) {\n  return new Promise((resolve) => {\n    let i = 0\n    function run() {\n      const end = Math.min(i + chunk, items.length)\n      for (; i < end; i++) work(items[i])\n      if (i < items.length) {\n        // yield to the event loop so it can render & handle input\n        setTimeout(run, 0)\n      } else {\n        resolve()\n      }\n    }\n    run()\n  })\n}\n\nprocessInChunks(bigArray, transform).then(() => console.log('done'))`,
      explanation: [
        'Instead of one giant synchronous loop, we process a fixed number of items per turn.',
        'Between chunks we schedule the next batch as a macrotask via setTimeout(0), releasing the thread.',
        'That gap lets the browser repaint and respond to clicks, keeping the UI alive.',
        'Using setTimeout (a macrotask) — not a microtask — is intentional: it allows rendering between chunks.',
      ],
    },
    realProject: {
      label: 'Real project — keeping a Vue/React list responsive while importing data',
      lang: 'js',
      code: `// A Node.js or browser importer that parses thousands of rows\nasync function importRows(rows, onRow) {\n  const yieldToLoop = () =>\n    new Promise((r) => setTimeout(r, 0)) // macrotask boundary\n\n  for (let i = 0; i < rows.length; i++) {\n    onRow(parseRow(rows[i]))         // update store / progress bar\n    if (i % 1000 === 0) await yieldToLoop() // unblock UI every 1k rows\n  }\n}\n\n// In a Vue component:\n// await importRows(csvRows, (row) => state.imported.push(row))\n// progress bar animates because we yield; without the await it would freeze`,
      explanation: [
        'Bulk import is the textbook starvation trigger: thousands of synchronous updates.',
        'Awaiting a setTimeout-backed promise every 1000 rows hands control back so Vue/React can flush updates and paint the progress bar.',
        'Without the periodic yield, the framework batches everything and the UI freezes until the whole import finishes.',
        'For CPU-heavy parsing, a Web Worker is even better — it removes the work from the main thread entirely.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why does a long synchronous loop freeze the browser UI?',
      answer: 'Because JavaScript runs on a single main thread. While the loop runs, the call stack never empties, so the event loop cannot process clicks, run timers, or repaint the page until the loop finishes.',
      explanation: 'The key phrase is "single thread + non-empty call stack". A beginner should connect freezing directly to the thread being busy.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between a microtask and a macrotask?',
      answer: 'Microtasks (promise callbacks, queueMicrotask) run after the current task and are fully drained before rendering. Macrotasks (setTimeout, events, I/O) run one per loop iteration, with rendering allowed in between.',
      explanation: 'This ordering is the basis of microtask starvation — microtasks have higher priority and run to exhaustion.',
    },
    {
      level: 'intermediate',
      question: 'Why can an infinite chain of resolved promises freeze the page even though each callback is tiny?',
      answer: 'Because each promise callback enqueues another microtask, and the event loop must empty the entire microtask queue before it can render or take the next macrotask. The queue never empties, so rendering never happens.',
      explanation: 'Tests whether the candidate knows microtasks are drained to completion, not one-per-tick like macrotasks.',
    },
    {
      level: 'intermediate',
      question: 'How do you keep the UI responsive while doing heavy computation?',
      answer: 'Break the work into chunks and yield to the event loop between them (setTimeout, MessageChannel, scheduler.yield, or requestIdleCallback), or move the work to a Web Worker so it runs off the main thread.',
      explanation: 'Strong answers distinguish cooperative yielding (still main thread) from true parallelism (workers).',
    },
    {
      level: 'advanced',
      question: 'Why prefer setTimeout over queueMicrotask to yield between chunks?',
      answer: 'A macrotask boundary (setTimeout/MessageChannel) gives the browser a rendering opportunity and lets pending input run; a microtask does not — it stays inside the same drain and would not relieve starvation.',
      explanation: 'Shows precise understanding of where rendering sits in the loop: after microtasks, before the next macrotask.',
    },
    {
      level: 'senior',
      question: 'In Node.js, how does starvation manifest, and what tools mitigate it?',
      answer: 'Node is also single-threaded for JS; a long synchronous handler blocks the entire server, starving all other connections and delaying timers and I/O callbacks. Mitigations: offload CPU work to worker_threads, partition work with setImmediate, use streams for backpressure, and watch process.nextTick which (like microtasks) can starve the loop if recursive.',
      explanation: 'Senior signal: recognizing that starvation is a server availability problem, and that process.nextTick is the Node analog of a microtask hazard.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Where does requestAnimationFrame run relative to microtasks and rendering?',
    'How does process.nextTick differ from setImmediate and Promise microtasks in Node?',
    'What is the difference between starvation and a deadlock?',
    'How would you detect a long task in production? (Long Tasks API / PerformanceObserver)',
    'When is a Web Worker the right answer instead of chunking?',
    'How does scheduler.postTask / scheduler.yield improve on setTimeout(0) for yielding?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming async/await automatically prevents freezing.',
      why: 'await only yields at the await point; synchronous CPU work between awaits still blocks the thread completely.',
      fix: 'Explicitly yield (await a setTimeout) inside long loops, or move CPU work to a worker.',
    },
    {
      mistake: 'Using queueMicrotask or Promise.resolve().then to "defer" heavy work.',
      why: 'Microtasks run before rendering and are drained to completion, so they do not relieve the UI and can cause microtask starvation.',
      fix: 'Use a macrotask boundary (setTimeout, MessageChannel, scheduler.yield) when you need the browser to paint.',
    },
    {
      mistake: 'Recursive promise chains or recursive process.nextTick without a base case bound.',
      why: 'They self-replenish the high-priority queue, starving timers, I/O, and rendering indefinitely.',
      fix: 'Cap recursion depth, batch work, or hop to a macrotask/setImmediate periodically.',
    },
    {
      mistake: 'Doing JSON.parse / heavy parsing of huge payloads on the main thread.',
      why: 'It is fully synchronous and can block for hundreds of milliseconds, dropping frames and ignoring input.',
      fix: 'Parse in a Web Worker or stream/chunk the data; show a loading state.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Large list rendering and bulk store mutations can starve the loop; chunked updates with awaited macrotask yields keep transitions and progress indicators smooth. nextTick schedules a microtask, so heavy work inside it can still block paint.' },
    { area: 'React', detail: 'React 18 concurrent rendering uses cooperative scheduling (time slicing) to yield to the browser and avoid starving input; understanding the loop explains why startTransition keeps typing responsive during expensive renders.' },
    { area: 'Node.js', detail: 'A single blocking handler (sync crypto, big JSON.parse, sync fs) starves every connection. Production servers offload to worker_threads, use setImmediate to break work, and monitor event-loop lag (e.g. with perf_hooks.monitorEventLoopDelay).' },
    { area: 'Backend', detail: 'Event-loop lag metrics are a standard SLI for Node services; sustained lag means requests are being starved and latency spikes. Autoscaling and worker offloading are common mitigations.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Cooperative chunking keeps the UI at 60fps even during large jobs by yielding regularly.',
      'Moving CPU work to Web Workers / worker_threads removes starvation from the main thread entirely.',
    ],
    bad: [
      'Any single task over ~50ms is a "long task" that risks dropped frames and input lag.',
      'Self-replenishing microtask chains can lock the page with no single long task visible in a naive profile.',
    ],
    optimizations: [
      'Yield with setTimeout(0)/MessageChannel/scheduler.yield between chunks so rendering and input run.',
      'Offload parsing/compression/crypto to Web Workers or worker_threads.',
      'Use requestIdleCallback for low-priority background work, and the Long Tasks API to detect offenders.',
      'In Node, monitor event-loop delay and break large loops with setImmediate; avoid recursive process.nextTick.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'microtask-queue', 'macrotask-queue', 'sync-vs-async', 'call-stack'],
    nextConcepts: ['web-workers', 'long-task-scheduling', 'requestanimationframe', 'concurrency-patterns', 'list-virtualization'],
    dependencyNote:
      'Starvation is a direct consequence of the event-loop priority model: you must first understand the call stack, microtask vs macrotask queues, and the rendering step. It then motivates web workers, long-task scheduling, and virtualization as the cures.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw one horizontal line labelled "main thread" — emphasise there is only one.',
      'Above it draw two boxes: a microtask queue and a macrotask queue, with a small "RENDER" box between them.',
      'Show the order: run task → drain ALL microtasks → render → take ONE macrotask, looping back.',
      'Circle the microtask box and say "if this keeps refilling, we never reach RENDER" — that is starvation type B.',
      'Then draw a long bar on the main thread and say "if one task is this long, same result — starvation type A".',
      'Conclude: the fix is to yield at a macrotask boundary or move work off-thread.',
    ],
    diagram: `  [ run task ] -> [ drain ALL microtasks ] -> [ RENDER ] -> [ 1 macrotask ]
                          ^      |                                |
                          |      | refills => never empties        |
                          +------+   = STARVATION (no render)      |
                                                                   |
       long sync task on main thread  =====================  (also starves)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript has one main thread. Each loop tick runs a task to stack-empty, drains all microtasks, renders, then takes one macrotask. Starvation is when lower-priority work never runs: either a long synchronous task pins the stack, or a self-replenishing microtask chain never lets the queue empty, so rendering, input, and timers are blocked. The cure is to yield at a macrotask boundary (setTimeout/MessageChannel/scheduler.yield) between chunks, or move heavy work to a Web Worker.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Event-loop starvation is a responsiveness failure that comes straight from JavaScript being single-threaded. The event loop runs in a fixed order: it executes the current task until the call stack is empty, then it drains the entire microtask queue, then the browser gets a chance to render, and only then does it pick up the next single macrotask. Starvation happens when some greedy work prevents the loop from reaching the parts that matter. There are two flavours. The first is synchronous: a long busy loop or a big JSON.parse keeps the call stack full, so nothing else runs and the page freezes. The second is more subtle — microtask starvation — where promise callbacks keep scheduling more promise callbacks. Because the loop must empty the whole microtask queue before it renders or takes the next timer, the queue never empties and the page locks up even though each callback is tiny. The fix depends on the case. For cooperative work, chunk it and yield at a macrotask boundary — setTimeout zero, a MessageChannel, or scheduler.yield — because that gives the browser a render and input opportunity; importantly, queueMicrotask does NOT help because microtasks run before rendering. For genuinely heavy CPU work, move it off the main thread with a Web Worker, or in Node with worker_threads. In Node the same problem starves all connections, so teams monitor event-loop lag as a health metric and avoid recursive process.nextTick.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Chunking keeps the UI responsive but increases total wall-clock time and code complexity versus a single tight loop.',
      'Web Workers eliminate main-thread starvation but add serialization cost (structured clone) and messaging complexity; not worth it for small jobs.',
      'Microtasks give low-latency continuation but at the cost of pre-empting rendering — great for ordering guarantees, dangerous for throughput.',
    ],
    edgeCases: [
      'A million-deep promise chain freezes the page with no single long task, so naive long-task profiling may miss it.',
      'process.nextTick in Node runs even before promise microtasks, so a recursive nextTick can starve the loop more aggressively than promises.',
      'requestAnimationFrame callbacks themselves can starve rendering if each one schedules heavy synchronous work.',
      'await inside a tight loop yields per iteration but at huge overhead, sometimes making things slower while still blocking between awaits.',
    ],
    runtimeBehavior: [
      'Microtasks are drained fully (including newly added ones) before any rendering opportunity; macrotasks are taken one per tick.',
      'Rendering is throttled to the display refresh, so even a free loop only paints ~every 16.7ms at 60Hz.',
      'In Node there is no rendering step, but the same phase ordering (timers, pending, poll, check/setImmediate, close) governs starvation.',
    ],
    scalability: [
      'On the client, starvation scales with data size and device speed — a list that is fine on a laptop janks on a mid-range phone.',
      'On the server, one blocking request can degrade p99 latency for ALL concurrent requests, so it is an availability and SLO concern, not just a single-user one.',
    ],
    productionConcerns: [
      'Instrument long tasks (PerformanceObserver longtask) on the client and event-loop delay (perf_hooks.monitorEventLoopDelay) on the server.',
      'Prefer cooperative schedulers (scheduler.postTask with priorities) over hand-rolled setTimeout chains for prioritized yielding.',
      'Guard third-party scripts and big JSON payloads — they are common silent starvation sources.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'One main thread: nothing else runs while it is busy.',
    'Loop order: task -> drain ALL microtasks -> render -> one macrotask.',
    'Microtasks: promises, queueMicrotask — drained to completion (can starve render).',
    'Macrotasks: setTimeout, events, I/O — one per tick, render allowed between.',
    'Sync starvation: long loop / big parse pins the stack.',
    'Microtask starvation: self-replenishing promise chain never empties.',
    'Yield at a MACROTASK boundary to relieve UI (setTimeout/MessageChannel/scheduler.yield).',
    'queueMicrotask does NOT relieve starvation — it runs before render.',
    'Heavy CPU work -> Web Worker (browser) / worker_threads (Node).',
    'Long task = >50ms; detect with Long Tasks API.',
    'Node: recursive process.nextTick is the nextTick starvation trap.',
    'Monitor event-loop lag as a server health metric.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the log order: console.log("A"); setTimeout(() => console.log("B"), 0); Promise.resolve().then(() => console.log("C")); console.log("D").',
      hint: 'Sync first, then microtasks, then macrotasks.',
      solution: {
        lang: 'js',
        code: `console.log('A')\nsetTimeout(() => console.log('B'), 0)\nPromise.resolve().then(() => console.log('C'))\nconsole.log('D')\n// Output: A, D, C, B`,
        explanation: [
          'A and D are synchronous, so they print first in order.',
          'C is a microtask, drained right after the synchronous code.',
          'B is a macrotask (setTimeout), so it runs last — after microtasks.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write yieldToLoop() that returns a promise resolving on the next macrotask, and use it to log 0..n with the UI able to update between numbers.',
      hint: 'Wrap setTimeout(resolve, 0) in a promise and await it in a loop.',
      solution: {
        lang: 'js',
        code: `function yieldToLoop() {\n  return new Promise((resolve) => setTimeout(resolve, 0))\n}\n\nasync function countUp(n) {\n  for (let i = 0; i <= n; i++) {\n    console.log(i)\n    await yieldToLoop() // macrotask boundary -> browser can render\n  }\n}\ncountUp(5)`,
        explanation: [
          'yieldToLoop resolves on a setTimeout, which is a macrotask, giving the browser a render opportunity.',
          'Awaiting it each iteration hands control back to the event loop.',
          'Using setTimeout (not queueMicrotask) is what makes the UI able to update between numbers.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate microtask starvation: show code where a setTimeout(0) callback is delayed indefinitely by a promise chain, then explain how to fix it.',
      hint: 'Have a promise callback re-schedule itself, then break the chain with a macrotask hop.',
      solution: {
        lang: 'js',
        code: `// Starves the timer:\nsetTimeout(() => console.log('timer fired'), 0)\nfunction storm(i = 0) {\n  if (i < 1e6) Promise.resolve().then(() => storm(i + 1))\n}\nstorm()\n\n// Fix: hop to a macrotask periodically so the loop can run the timer\nfunction stormFixed(i = 0) {\n  if (i >= 1e6) return\n  if (i % 1000 === 0) setTimeout(() => stormFixed(i + 1), 0) // yield\n  else Promise.resolve().then(() => stormFixed(i + 1))\n}`,
        explanation: [
          'storm keeps the microtask queue non-empty, so the event loop never reaches the setTimeout macrotask.',
          'stormFixed inserts a macrotask hop every 1000 iterations, letting the loop service the timer and render.',
          'The principle: break high-priority chains with a macrotask boundary to avoid starvation.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement processWithBudget(items, work, budgetMs) that processes items but yields whenever it has used more than budgetMs of the current frame, keeping the UI responsive.',
      hint: 'Track a start time per chunk; when performance.now() exceeds the budget, yield via setTimeout and resume.',
      solution: {
        lang: 'js',
        code: `function processWithBudget(items, work, budgetMs = 8) {\n  return new Promise((resolve) => {\n    let i = 0\n    function run() {\n      const start = performance.now()\n      while (i < items.length && performance.now() - start < budgetMs) {\n        work(items[i++])\n      }\n      if (i < items.length) setTimeout(run, 0) // yield, resume next frame\n      else resolve()\n    }\n    run()\n  })\n}\n\nprocessWithBudget(bigArray, transform).then(() => console.log('done'))`,
        explanation: [
          'Each turn processes items until it has spent budgetMs (kept under one frame, ~8ms).',
          'When the budget is exceeded, it yields with setTimeout so the browser can render and handle input.',
          'A time budget adapts to slow devices better than a fixed chunk size, keeping frames smooth.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Starvation is where "I know the event loop" becomes "I can keep an app responsive under real load". It ties together the queues, rendering, and threading into one practical skill that directly affects user-perceived performance and server availability.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go this deep — they ask the basic microtask vs macrotask order. Product companies (Zoho, Flipkart, Razorpay) ask why a page freezes during heavy work and how to fix it. FAANG-level interviews probe microtask starvation specifically, Node event-loop lag, and when to choose workers versus cooperative scheduling.',
    whatInterviewersExpect:
      'They expect you to state the loop ordering precisely, distinguish synchronous from microtask starvation, explain WHY queueMicrotask does not relieve the UI, and propose concrete fixes (chunk + yield at a macrotask boundary, or move work off-thread) with awareness of the Node server angle.',
  },
}

export default eventLoopStarvation
