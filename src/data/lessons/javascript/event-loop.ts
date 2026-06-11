import type { ConceptLesson } from '../../../types/lesson'

const eventLoop: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-loop',
  name: 'Event Loop',
  category: 'async',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The event loop is THE mechanism that lets single-threaded JavaScript handle async work without blocking — it is the engine behind everything async.',
    'Almost every tricky async interview question (ordering of setTimeout vs Promise, why something logs in a surprising order) is really an event-loop question.',
    'Understanding it is the difference between guessing output and being able to derive it precisely, every time.',
    'It explains real production behavior: UI jank, starved tasks, blocked rendering, and why heavy work freezes the page.',
    'It unifies callbacks, promises, async/await, timers, and rendering into one coherent model — once you get it, all of async clicks.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The event loop is a tireless waiter who only serves the next table once the current table is completely done.',
    story: [
      'Imagine a restaurant with one super-fast waiter and a list of tables waiting to be served.',
      'The waiter helps one table at a time and will not jump to another table until the first is fully finished.',
      'But there are two lists: a special VIP list (people who must be served right after the current table) and a normal list (everyone else).',
      'The waiter always clears the entire VIP list before going to the next normal table. The event loop is that waiter, the VIP list is microtasks (promises), and the normal list is macrotasks (timers, clicks) — always finishing the current job, then all VIPs, then the next normal one.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript can do only one thing at a time because it has a single call stack.',
    'The event loop is a constant cycle that checks: is the stack empty? If yes, take the next waiting task and run it.',
    'There are two waiting lines: microtasks (like promise callbacks) and macrotasks (like timers and clicks).',
    'After each macrotask, the loop empties the entire microtask line before moving on — which is why promises usually run before timers.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The event loop is the runtime mechanism that coordinates the call stack, task (macrotask) queue, and microtask queue so that asynchronous callbacks run when the stack is empty, keeping the single thread non-blocking.',
    how: 'It repeatedly: (1) runs all synchronous code on the stack until empty, (2) drains the entire microtask queue, (3) optionally renders, (4) takes one macrotask and runs it, then loops. Microtasks always finish before the next macrotask.',
    why: 'It is how JavaScript stays responsive on one thread: long-running async work is queued and interleaved instead of blocking.',
    code: {
      label: 'Classic ordering puzzle',
      lang: 'js',
      code: `console.log('1')\nsetTimeout(() => console.log('2'), 0)\nPromise.resolve().then(() => console.log('3'))\nconsole.log('4')\n\n// Output: 1, 4, 3, 2`,
      explanation: [
        '"1" and "4" are synchronous — they run first, in order.',
        'setTimeout queues "2" as a MACROtask.',
        'Promise.then queues "3" as a MICROtask.',
        'After the synchronous code, the loop drains microtasks first → "3".',
        'Only then does it run the next macrotask → "2". So: 1, 4, 3, 2.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The event loop is the concurrency model that coordinates execution of JavaScript on a single thread. After the call stack empties, the loop performs one iteration (a "tick"): it dequeues and runs exactly one macrotask, then fully drains the microtask queue (running every microtask, including those enqueued during draining), and—in browsers—may perform a rendering update before the next iteration. Macrotasks include timers, I/O callbacks, and UI events; microtasks include promise reactions, queueMicrotask, and MutationObserver callbacks. This ordering guarantees that microtasks always run before the next macrotask and before rendering.',

  // 7. Internal Working
  internalWorking: [
    'Synchronous code executes on the call stack; functions push frames and pop on return. The loop does nothing while the stack is non-empty.',
    'Host APIs (timers, fetch, DOM events) run their work off the main thread and enqueue callbacks into the macrotask or microtask queue when ready.',
    'When the stack empties, the event loop selects the oldest macrotask, pushes its callback onto the stack, and runs it to completion.',
    'Immediately after that macrotask, the loop drains the ENTIRE microtask queue — including microtasks scheduled by other microtasks — before doing anything else.',
    'In browsers, after microtasks the loop may run rendering steps (style, layout, paint), aiming for the display refresh rate.',
    'The loop then returns to step 3 for the next macrotask. This is why one synchronous block, then all its microtasks, then render, then the next macrotask.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        ┌──────────── Call Stack ────────────┐
        │   runs sync code to completion      │
        └───────────────┬─────────────────────┘
                        │ (empty)
                        ▼
   ┌─ EVENT LOOP TICK ───────────────────────────┐
   │ 1. run ONE macrotask  (timer / event / I/O)  │
   │ 2. drain ALL microtasks (promises) ──┐       │
   │        (loop until microtask queue empty)    │
   │ 3. render (browser) ◄────────────────┘       │
   └──────────────────┬───────────────────────────┘
                      └─► back to 1 (next macrotask)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'CALL STACK: holds currently running frames; the loop waits for it to empty.',
    'MACROTASK QUEUE: holds callback references for timers, I/O, and events, processed one per tick.',
    'MICROTASK QUEUE: holds promise reactions; fully drained after each macrotask, so it can grow during draining.',
    'Pending callbacks keep their captured closures (and referenced data) alive in the heap until they run or are cleared.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — sync vs micro vs macro',
      lang: 'js',
      code: `console.log('A')\nsetTimeout(() => console.log('B'), 0)   // macrotask\nqueueMicrotask(() => console.log('C'))  // microtask\nconsole.log('D')\n// A, D, C, B`,
      explanation: [
        'A and D run synchronously first.',
        'queueMicrotask schedules C as a microtask.',
        'After sync code, microtasks drain → C.',
        'Then the next macrotask runs → B. Order: A, D, C, B.',
      ],
    },
    intermediate: {
      label: 'Intermediate — async/await desugared',
      lang: 'js',
      code: `async function f() {\n  console.log('1')\n  await null          // suspends; continuation is a microtask\n  console.log('3')\n}\nconsole.log('start')\nf()\nconsole.log('2')\n// start, 1, 2, 3`,
      explanation: [
        '"start" logs, then f() is called and "1" logs synchronously up to the await.',
        'await null suspends f(); its continuation ("3") is scheduled as a microtask.',
        'Control returns to the caller, so "2" logs synchronously next.',
        'After the sync code, the microtask resumes f() → "3". Order: start, 1, 2, 3.',
      ],
    },
    advanced: {
      label: 'Advanced — microtasks scheduled during draining',
      lang: 'js',
      code: `console.log('A')\nsetTimeout(() => console.log('timeout'), 0)\nPromise.resolve().then(() => {\n  console.log('p1')\n  Promise.resolve().then(() => console.log('p2'))\n})\nconsole.log('B')\n// A, B, p1, p2, timeout`,
      explanation: [
        'A and B are synchronous.',
        'The first .then (p1) is a microtask; while running it it schedules p2 as another microtask.',
        'The microtask queue is drained completely, so p2 runs BEFORE the timeout macrotask.',
        'Only after all microtasks does the timeout fire. Order: A, B, p1, p2, timeout.',
      ],
    },
    realProject: {
      label: 'Real project — why a heavy loop freezes the UI (and the fix)',
      lang: 'js',
      code: `// Bad: blocks the loop, UI frozen until done\nfunction processAll(items) {\n  items.forEach(heavyWork) // one giant macrotask\n}\n\n// Good: yield between chunks so the loop can render/handle input\nasync function processChunked(items, size = 500) {\n  for (let i = 0; i < items.length; i += size) {\n    items.slice(i, i + size).forEach(heavyWork)\n    await new Promise((r) => setTimeout(r)) // yield a macrotask\n  }\n}`,
      explanation: [
        'A single long synchronous loop keeps the call stack busy, so the event loop never reaches rendering or input handling.',
        'The chunked version returns control to the loop between batches.',
        'Yielding lets the browser render and process clicks, keeping the UI responsive.',
        'This is the standard fix for jank from heavy work in Vue/React apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the event loop?',
      answer: 'It is the mechanism that lets single-threaded JavaScript run async code without blocking. When the call stack is empty, it takes queued callbacks (tasks/microtasks) and runs them, keeping the thread free while waiting on I/O.',
      explanation: 'A solid answer ties single-threadedness to the queue-based scheduling of callbacks.',
    },
    {
      level: 'intermediate',
      question: 'Why does a resolved Promise callback run before a setTimeout(fn, 0)?',
      answer: 'Promise reactions are microtasks; setTimeout callbacks are macrotasks. After the synchronous code, the loop drains the entire microtask queue before running the next macrotask, so the promise runs first.',
      explanation: 'The microtask-before-macrotask rule is the single most asked event-loop fact.',
    },
    {
      level: 'intermediate',
      question: 'Predict: console.log(1); setTimeout(()=>console.log(2)); Promise.resolve().then(()=>console.log(3)); console.log(4);',
      answer: '1, 4, 3, 2. Synchronous 1 and 4 first; then microtask 3; then macrotask 2.',
      explanation: 'Being able to derive ordering quickly demonstrates a working model, not memorization.',
    },
    {
      level: 'advanced',
      question: 'What happens to microtasks scheduled while the microtask queue is being drained?',
      answer: 'They are added to the same queue and also run in the same draining pass, before the next macrotask. The loop keeps draining until the microtask queue is completely empty.',
      explanation: 'This explains how a chain of .then callbacks all complete before any timer.',
    },
    {
      level: 'advanced',
      question: 'How can microtasks cause the UI to hang even without blocking the stack for long at once?',
      answer: 'If microtasks continually schedule more microtasks (an infinite or very long microtask chain), the loop never reaches rendering or the next macrotask — starving paint and input. This is microtask starvation.',
      explanation: 'Recognizing starvation shows deep understanding beyond simple ordering.',
    },
    {
      level: 'senior',
      question: 'How does the event loop differ between browsers and Node.js?',
      answer: 'Browsers run one macrotask, drain microtasks, then optionally render. Node uses libuv with distinct phases (timers, pending, poll, check, close) and additionally has process.nextTick (run before other microtasks) and setImmediate (check phase). Microtask draining happens between phases too.',
      explanation: 'Knowing Node phases, nextTick vs microtasks, and setImmediate is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between the macrotask and microtask queues?',
    'Where does rendering fit in the event loop cycle?',
    'What is microtask starvation and how do you avoid it?',
    'How does async/await map onto microtasks?',
    'What are process.nextTick and setImmediate in Node, and how do they order?',
    'How does requestAnimationFrame relate to the event loop?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing setTimeout(fn, 0) runs before pending promise callbacks.',
      why: 'Timers are macrotasks; promises are microtasks drained first.',
      fix: 'Remember: sync → all microtasks → one macrotask → repeat.',
    },
    {
      mistake: 'Thinking the event loop gives true parallelism.',
      why: 'It interleaves tasks on ONE thread; only host I/O happens off-thread.',
      fix: 'For parallel CPU work use Web Workers / worker_threads.',
    },
    {
      mistake: 'Scheduling unbounded microtasks (e.g. recursive .then) expecting the UI to update.',
      why: 'Microtasks drain before rendering, so the loop never paints — the UI hangs (starvation).',
      fix: 'Break work across macrotasks (setTimeout) to let rendering and input run.',
    },
    {
      mistake: 'Assuming Node and the browser order async callbacks identically.',
      why: 'Node has phases plus process.nextTick and setImmediate with different ordering.',
      fix: 'Learn the Node phase model when targeting Node-specific timing.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Concurrent rendering and scheduling decide when to yield to the event loop; understanding micro/macro tasks explains effect timing and batched updates.' },
    { area: 'Vue', detail: 'nextTick uses a microtask to flush DOM updates after reactive state changes, so reads after nextTick see the updated DOM.' },
    { area: 'Node.js', detail: 'The libuv phase model (timers, poll, check) and process.nextTick/setImmediate govern callback ordering; event-loop lag is a key health metric.' },
    { area: 'Backend', detail: 'Keeping the loop unblocked is critical for throughput; long synchronous work or microtask storms cause request latency spikes and timeouts.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'The event loop enables high I/O concurrency on a single thread with minimal overhead.',
      'Proper task scheduling keeps the UI responsive and rendering at the refresh rate.',
    ],
    bad: [
      'Long synchronous tasks block the loop, freezing UI and stalling servers.',
      'Microtask storms starve rendering and macrotasks, causing hangs.',
    ],
    optimizations: [
      'Chunk heavy work and yield via setTimeout / scheduler.yield so the loop can render and handle input.',
      'Avoid unbounded microtask chains; spread work across macrotasks.',
      'Offload CPU-bound work to Web Workers / worker_threads.',
      'Monitor event-loop lag in production to detect blocking early.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['call-stack', 'sync-vs-async', 'callbacks', 'execution-context'],
    nextConcepts: ['microtask-queue', 'macrotask-queue', 'promises', 'async-await', 'event-loop-starvation'],
    dependencyNote:
      'The event loop sits at the center of the async spine. It requires the call stack and sync-vs-async, and it unifies the microtask and macrotask queues, promises, async/await, and timers into one model.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the call stack on the left; show sync code running to empty.',
      'Draw two queues: macrotask (timers/events) and microtask (promises).',
      'Write the tick rule: run ONE macrotask → drain ALL microtasks → render → repeat.',
      'Walk through console.log/setTimeout/Promise.then to derive 1,4,3,2 live.',
      'Say: "One thread, one stack. After sync, microtasks fully drain before any macrotask, and before rendering — that explains every async ordering puzzle."',
    ],
    diagram: `   Stack        Microtasks (promises)     Macrotasks (timers/events)
   [sync]  ──►   [ .then, await ]    AND   [ setTimeout, click ]
     │ empty          │ drain ALL              │ run ONE
     └──── loop: macro(1) → micro(all) → render → repeat ────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The event loop lets single-threaded JS run async code without blocking. When the call stack empties, each tick runs ONE macrotask (timer/event/I/O), then drains the ENTIRE microtask queue (promises), then the browser may render — then repeat. Microtasks always run before the next macrotask and before paint, which is why a resolved promise beats setTimeout(0). Long sync work blocks the loop; endless microtasks starve rendering. Node adds phases plus nextTick/setImmediate.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript is single-threaded with one call stack, so the event loop is what lets it handle asynchronous work without blocking. While synchronous code runs, it occupies the stack and nothing else happens. When the stack empties, the event loop begins its cycle. There are two queues: the macrotask queue, holding callbacks from timers, I/O, and UI events, and the microtask queue, holding promise reactions, queueMicrotask, and MutationObserver callbacks. Each tick of the loop runs exactly one macrotask, then drains the entire microtask queue — including any microtasks scheduled while draining — and then, in the browser, it may perform a rendering update before moving to the next macrotask. This ordering is the key to every async puzzle: microtasks always run before the next macrotask and before paint, which is why a resolved promise callback runs before a setTimeout with zero delay. async/await fits in here too: code before the first await runs synchronously, and the continuation after await is scheduled as a microtask. The practical consequences are important — a long synchronous task blocks the whole loop and freezes the UI, while an endless chain of microtasks starves rendering and macrotasks. Node is similar but uses libuv phases plus process.nextTick, which runs before other microtasks, and setImmediate in the check phase.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Microtasks give fast, ordered follow-up work but can starve rendering if overused; macrotasks yield to paint but add latency.',
      'Single-threaded simplicity (no locks/races) vs the need to manually offload CPU work to keep the loop free.',
      'Batching updates into microtasks (Vue nextTick) reduces reflows but defers visible changes by a tick.',
    ],
    edgeCases: [
      'Microtasks scheduled during draining run in the same pass — a recursive chain never yields to macrotasks.',
      'await on an already-resolved value still defers to a microtask, changing intuitive ordering.',
      'In Node, process.nextTick runs before the promise microtask queue, and setImmediate vs setTimeout(0) ordering depends on context.',
      'Rendering is not guaranteed every tick; the browser coalesces frames to the refresh rate.',
    ],
    runtimeBehavior: [
      'Exactly one macrotask runs per loop iteration; the microtask queue is fully emptied between macrotasks.',
      'requestAnimationFrame callbacks run just before paint, distinct from both queues.',
      'Long tasks (>50ms) block input responsiveness and hurt INP/Core Web Vitals.',
    ],
    scalability: [
      'Server throughput depends on keeping the loop unblocked; one slow synchronous handler degrades all concurrent requests.',
      'At scale, monitor event-loop lag (delay between scheduled and actual execution) as a saturation signal.',
    ],
    productionConcerns: [
      'Microtask starvation causes hard-to-diagnose UI hangs that are not obvious in CPU profiles.',
      'Mismodeling Node phases leads to subtle ordering bugs between timers, I/O, and immediates.',
      'Blocking the loop in serverless/edge functions causes timeouts affecting every coexecuting request.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Single thread, one call stack; loop runs when stack empty.',
    'Tick = run ONE macrotask → drain ALL microtasks → maybe render → repeat.',
    'Macrotasks: setTimeout, setInterval, I/O, UI events, message.',
    'Microtasks: Promise.then/catch/finally, await continuation, queueMicrotask, MutationObserver.',
    'Microtasks ALWAYS run before the next macrotask and before paint.',
    'Resolved promise beats setTimeout(0).',
    'Microtasks scheduled during draining run in the same pass.',
    'Long sync task → blocks loop → UI freeze.',
    'Endless microtasks → starvation → no rendering.',
    'Yield with setTimeout to let render/input run.',
    'Node: phases + process.nextTick (before microtasks) + setImmediate (check).',
    'requestAnimationFrame runs just before paint.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: console.log("a"); Promise.resolve().then(()=>console.log("b")); console.log("c");',
      hint: 'The .then is a microtask.',
      solution: {
        lang: 'js',
        code: `console.log('a')\nPromise.resolve().then(() => console.log('b'))\nconsole.log('c')\n// a, c, b`,
        explanation: ['a and c run synchronously.', 'b is a microtask that runs after the sync code, before any macrotask.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict the output of mixed timers and promises: setTimeout(()=>console.log(1)); Promise.resolve().then(()=>console.log(2)); console.log(3);',
      hint: 'Sync, then micro, then macro.',
      solution: {
        lang: 'js',
        code: `setTimeout(() => console.log(1))\nPromise.resolve().then(() => console.log(2))\nconsole.log(3)\n// 3, 2, 1`,
        explanation: [
          '3 is synchronous and prints first.',
          '2 is a microtask, drained before any macrotask.',
          '1 is a macrotask (timer), runs last.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Order this: async function with two awaits interleaved with a setTimeout and a Promise.then. Write code and the exact output.',
      hint: 'Each await continuation is a separate microtask.',
      solution: {
        lang: 'js',
        code: `async function f() {\n  console.log('f start')\n  await 0\n  console.log('after await 1')\n  await 0\n  console.log('after await 2')\n}\nconsole.log('script start')\nsetTimeout(() => console.log('timeout'), 0)\nf()\nPromise.resolve().then(() => console.log('promise'))\nconsole.log('script end')\n// script start, f start, script end, after await 1, promise, after await 2, timeout`,
        explanation: [
          'Sync: script start, f start (up to first await), script end.',
          'Microtask pass: f resumes (after await 1), then the promise .then, then f resumes again (after await 2).',
          'Macrotask: timeout runs last after all microtasks drain.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate microtask starvation, then fix it so a counter UI can update.',
      hint: 'A recursive promise chain never yields; use setTimeout to yield.',
      solution: {
        lang: 'js',
        code: `// STARVATION: never lets the browser render\nfunction starve() {\n  Promise.resolve().then(starve) // infinite microtasks\n}\n\n// FIX: yield to a macrotask so render + input can run\nlet count = 0\nfunction loopWithYield() {\n  count++\n  updateUI(count)\n  if (count < 1000) setTimeout(loopWithYield, 0) // macrotask yields\n}`,
        explanation: [
          'A self-rescheduling microtask drains forever, so the loop never reaches rendering — the page freezes.',
          'Switching to setTimeout schedules a macrotask, after which microtasks drain and the browser can paint.',
          'Yielding via macrotasks is the standard fix for keeping the UI responsive during repeated work.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The event loop is the most important async concept and the one interviewers lean on hardest. Master it and every promise/timer ordering question becomes a derivation, not a guess — and you can explain real UI-freeze and latency bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is the event loop" and the basic setTimeout vs Promise ordering. Product companies (Zoho, Flipkart, Razorpay) give multi-step output-prediction puzzles with async/await. FAANG-level interviews probe starvation, rendering placement, and Node phases vs browser model.',
    whatInterviewersExpect:
      'They expect you to explain single-threaded scheduling, the macrotask/microtask ordering rule, derive output of mixed sync/promise/timer code, place async/await continuations as microtasks, and discuss starvation and Node differences.',
  },
}

export default eventLoop
