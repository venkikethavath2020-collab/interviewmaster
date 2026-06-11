import type { ConceptLesson } from '../../../types/lesson'

const syncVsAsync: ConceptLesson = {
  // 1. Concept Summary
  slug: 'sync-vs-async',
  name: 'Synchronous vs Asynchronous',
  category: 'async',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript runs on a single thread, so understanding sync vs async is the difference between an app that freezes and one that stays responsive.',
    'Every network request, file read, timer, and user interaction is asynchronous — you cannot build a real app without grasping this.',
    'It is the foundation for callbacks, promises, async/await, and the event loop — all the "hard async" topics build on this distinction.',
    'Interviewers use it to check whether you understand non-blocking I/O and why long synchronous work blocks everything else.',
    'Blocking the main thread with synchronous work causes janky UIs, unresponsive pages, and failed health checks on servers — a real production problem.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Synchronous is waiting in line for one cashier; asynchronous is dropping off your laundry and coming back when it beeps.',
    story: [
      'Imagine you order food at a counter. If it is synchronous, you stand at the counter and wait, doing nothing, until your food is ready — and nobody behind you can order.',
      'If it is asynchronous, the cashier gives you a buzzer. You go sit down, chat with friends, and do other things.',
      'When your food is ready, the buzzer goes off and you go pick it up — and meanwhile other people could order too.',
      'JavaScript works like the buzzer way for slow things: instead of standing and waiting, it says "tell me when it is done" and keeps doing other useful work in the meantime.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Synchronous code runs one line at a time, top to bottom, and each line must finish before the next starts.',
    'If one line takes a long time (like downloading a file), synchronous code would make everything else wait.',
    'Asynchronous code lets JavaScript start a slow task, keep running the rest of the program, and come back to handle the result later.',
    'Because JavaScript has only one main worker (single-threaded), this "start now, finish later" trick is how it stays fast and responsive.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Synchronous code executes sequentially and blocks — each operation completes before the next begins. Asynchronous code starts an operation and continues without waiting; the result is delivered later via a callback, promise, or await.',
    how: 'JavaScript runs synchronous code on a single call stack. For async operations (timers, fetch, file I/O), it hands the work to the browser/Node APIs, continues executing, and the event loop queues the callback to run once the call stack is empty.',
    why: 'Because JS is single-threaded, blocking on slow I/O would freeze the entire program. Async keeps the one thread free to do other work while waiting.',
    code: {
      label: 'Sync blocks, async does not',
      lang: 'js',
      code: `console.log('1 start')\n\nsetTimeout(() => {\n  console.log('3 async (later)')\n}, 0)\n\nconsole.log('2 end')\n\n// Output:\n// 1 start\n// 2 end\n// 3 async (later)`,
      explanation: [
        'console.log("1 start") runs synchronously, first.',
        'setTimeout schedules its callback asynchronously — even with 0ms it does not run now.',
        'console.log("2 end") runs next, synchronously, because the timer callback is deferred.',
        'Only after all synchronous code finishes does the event loop run the timer callback ("3").',
        'This proves async work waits for the synchronous code to complete, even at 0ms delay.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Synchronous execution runs operations sequentially on the single-threaded call stack, where each operation blocks the thread until it completes. Asynchronous execution offloads long-running operations (timers, network, file I/O) to host APIs (Web APIs in the browser, libuv in Node) that run outside the JS thread; upon completion their callbacks are placed in a task or microtask queue and executed by the event loop only when the call stack is empty. This non-blocking model lets a single thread remain responsive while awaiting I/O.',

  // 7. Internal Working
  internalWorking: [
    'Synchronous function calls push frames onto the call stack and pop them when they return; nothing else runs until the stack is empty.',
    'When an async API is called (e.g. setTimeout, fetch), the engine hands the operation to the host environment (Web API / libuv) and immediately returns, continuing synchronous execution.',
    'The host environment performs the work off the main thread (or via the OS) and, when done, places the associated callback into a queue (macrotask or microtask).',
    'The event loop continuously checks: if the call stack is empty, it dequeues the next callback and pushes it onto the stack to run.',
    'Microtasks (promise reactions) are drained completely before the next macrotask, which is why a resolved promise runs before a 0ms timer.',
    'Thus async code never interrupts running synchronous code — it only runs in the gaps when the stack is clear.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  SYNCHRONOUS (blocking):
    [A]──►[B]──►[C]   each waits for the previous
    line1  line2 line3

  ASYNCHRONOUS (non-blocking):
    [A]──►(start slow task)──►[B]──►[C]   keep going
                  │
                  ▼ host API does work off-thread
            ┌── callback queued ──┐
            ▼                     │
   event loop runs it when stack empty ──► [D]`,

  // 9. Memory Visualization
  memoryVisualization: [
    'CALL STACK: holds the currently executing synchronous frames; async callbacks are NOT here until they are dequeued.',
    'HEAP: closures captured by pending callbacks (and the data they reference) stay alive while the callback waits in a queue.',
    'QUEUES: completed async results sit in the task/microtask queues as callback references until the loop runs them.',
    'A pending async callback keeps its captured variables reachable, which is why forgotten timers/listeners can leak memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — blocking vs non-blocking',
      lang: 'js',
      code: `// BLOCKING (synchronous): freezes for 2s\nfunction blockFor(ms) {\n  const end = Date.now() + ms\n  while (Date.now() < end) {} // busy wait\n}\nblockFor(2000) // nothing else can run during this\n\n// NON-BLOCKING (async): schedules, frees the thread\nsetTimeout(() => console.log('done'), 2000)\nconsole.log('thread free meanwhile')`,
      explanation: [
        'blockFor busy-waits, holding the single thread hostage for 2 seconds.',
        'During that loop the UI freezes and no other code runs — classic blocking.',
        'setTimeout schedules work for later and returns immediately.',
        '"thread free meanwhile" prints right away because the timer does not block.',
      ],
    },
    intermediate: {
      label: 'Intermediate — async with promises',
      lang: 'js',
      code: `function getUser(id) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve({ id, name: 'Sam' }), 500)\n  })\n}\n\nconsole.log('before')\ngetUser(1).then((u) => console.log('got', u.name))\nconsole.log('after')\n\n// before\n// after\n// got Sam`,
      explanation: [
        'getUser returns a promise that resolves after a simulated 500ms delay.',
        '.then registers a callback to run when the promise resolves — it does not block.',
        '"before" and "after" print synchronously, immediately.',
        '"got Sam" prints later, when the async result arrives and the loop runs the callback.',
      ],
    },
    advanced: {
      label: 'Advanced — async/await reads like sync but is not',
      lang: 'js',
      code: `async function load() {\n  console.log('A')\n  const user = await getUser(1) // pauses load(), frees thread\n  console.log('C', user.name)\n}\nconsole.log('start')\nload()\nconsole.log('B')\n\n// start, A, B, C Sam`,
      explanation: [
        'async/await is syntactic sugar over promises; it does NOT block the thread.',
        'await pauses only the load() function, returning control to the caller.',
        '"B" prints before "C" because load() suspended at await and the rest of the script ran.',
        'When the awaited promise resolves, load() resumes from where it paused.',
      ],
    },
    realProject: {
      label: 'Real project — non-blocking I/O in a Node server',
      lang: 'js',
      code: `import { readFile } from 'fs/promises'\n\napp.get('/data', async (req, res) => {\n  // async read — server handles other requests while waiting\n  const json = await readFile('./data.json', 'utf8')\n  res.json(JSON.parse(json))\n})\n\n// NEVER do this in a request handler:\n// const json = readFileSync('./data.json') // blocks ALL requests`,
      explanation: [
        'await readFile yields the thread so the server can handle other requests during the disk read.',
        'This non-blocking model is why a single Node process can serve thousands of concurrent connections.',
        'readFileSync would block the event loop, stalling every other request — a real production outage cause.',
        'In Vue/React the same principle keeps the UI responsive while data loads.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between synchronous and asynchronous code?',
      answer: 'Synchronous code runs line by line and blocks until each operation finishes. Asynchronous code starts an operation and continues without waiting, handling the result later via a callback, promise, or await.',
      explanation: 'A strong answer ties this to JS being single-threaded and the need to avoid blocking.',
    },
    {
      level: 'beginner',
      question: 'If JavaScript is single-threaded, how does it do multiple things at once?',
      answer: 'It does not truly run JS in parallel. Slow operations are handed to host APIs (Web APIs / libuv) that work off the main thread; their callbacks are queued and run by the event loop when the call stack is empty.',
      explanation: 'Distinguishing concurrency (managed by the host + event loop) from true parallelism is key.',
    },
    {
      level: 'beginner',
      question: 'Why does setTimeout(fn, 0) not run immediately?',
      answer: 'Because the callback is scheduled as a macrotask. It can only run after all currently executing synchronous code finishes and the call stack is empty — 0ms is the minimum delay, not immediate execution.',
      explanation: 'This classic question checks understanding that async work waits for the sync stack to clear.',
    },
    {
      level: 'intermediate',
      question: 'What does it mean to "block the main thread" and why is it bad?',
      answer: 'It means running long synchronous work (heavy loops, sync I/O) that occupies the single thread, preventing the event loop from processing other callbacks. The UI freezes or the server stops responding until it finishes.',
      explanation: 'Connecting blocking to UI jank / server stalls shows practical understanding.',
    },
    {
      level: 'intermediate',
      question: 'Does async/await make code run in parallel?',
      answer: 'No. async/await is sugar over promises; it makes async code read sequentially but still runs on the single thread. await only pauses the enclosing async function, freeing the thread; it does not create parallelism.',
      explanation: 'Common misconception; the correct mental model is cooperative pausing, not threads.',
    },
    {
      level: 'senior',
      question: 'How would you run CPU-heavy work without blocking the event loop?',
      answer: 'Offload it: Web Workers in the browser or worker_threads / child processes in Node, communicating via messages. Alternatively, chunk the work and yield to the event loop (e.g. via setTimeout, requestIdleCallback, or scheduler.yield) so other tasks can run.',
      explanation: 'Senior signal: recognizing that async I/O does not help CPU-bound work — you need real parallelism or chunking.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the event loop and how does it relate to async code?',
    'What is the difference between concurrency and parallelism?',
    'Why is a microtask (promise) run before a 0ms setTimeout?',
    'How do callbacks, promises, and async/await relate to each other?',
    'What happens if an async operation never resolves?',
    'How do Web Workers differ from async I/O?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming setTimeout(fn, 0) runs fn before the rest of the synchronous code.',
      why: 'The callback is queued and only runs after the call stack is empty.',
      fix: 'Remember async callbacks always wait for synchronous code to finish first.',
    },
    {
      mistake: 'Thinking async/await runs operations in parallel or on another thread.',
      why: 'It is single-threaded cooperative pausing, not parallelism.',
      fix: 'Use Promise.all for concurrent async ops, and Workers for true parallel CPU work.',
    },
    {
      mistake: 'Doing heavy CPU work in the main thread thinking async will help.',
      why: 'Async only helps with I/O waiting; CPU-bound loops still block the single thread.',
      fix: 'Offload to Web Workers / worker_threads or chunk and yield.',
    },
    {
      mistake: 'Using synchronous file/network APIs (readFileSync) in a server request path.',
      why: 'It blocks the event loop, stalling all concurrent requests.',
      fix: 'Always use the async variants (fs/promises, await) in hot paths.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Non-blocking I/O via libuv lets one process handle thousands of concurrent connections; never use Sync APIs in request handlers.' },
    { area: 'React', detail: 'Data fetching, transitions, and Suspense are async so the UI stays responsive; heavy compute is moved to workers or memoized.' },
    { area: 'Vue', detail: 'Async components, await in setup/composables, and nextTick rely on the async model; long synchronous work in a component freezes the page.' },
    { area: 'Backend', detail: 'Async database drivers and message queues keep services responsive; sync blocking causes health-check timeouts and cascading failures.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Non-blocking async I/O keeps the single thread free, enabling high concurrency with low memory.',
      'Async lets the UI stay at 60fps while data loads in the background.',
    ],
    bad: [
      'Synchronous heavy work blocks the thread, freezing the UI or stalling the server.',
      'Excessive tiny async tasks add scheduling overhead and can starve other work.',
    ],
    optimizations: [
      'Use Promise.all to run independent async operations concurrently instead of awaiting them in series.',
      'Offload CPU-bound work to Web Workers / worker_threads.',
      'Chunk long synchronous loops and yield to the event loop to keep the app responsive.',
      'Avoid synchronous I/O APIs in hot paths; prefer their async counterparts.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['call-stack', 'execution-context', 'callbacks'],
    nextConcepts: ['event-loop', 'promises', 'async-await', 'timers', 'web-workers'],
    dependencyNote:
      'Sync vs async is the entry point to the async spine. It requires understanding the call stack, and it directly leads into the event loop, timers, promises, and async/await.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a single vertical "call stack" and write three sync lines stacking and popping in order.',
      'Now add an async call (setTimeout): draw an arrow off to a "Web API" box, returning immediately.',
      'Show the rest of the sync code continuing while the Web API works.',
      'Draw the callback dropping into a "queue", then the event loop moving it onto the stack once empty.',
      'Say: "Sync blocks the one thread; async hands work to host APIs and the event loop runs the callback later, when the stack is clear."',
    ],
    diagram: `   Call Stack (1 thread)        Web APIs        Queue
     sync line 1
     sync line 2 ──setTimeout──► [timer] ──done──► [cb]
     sync line 3                                   │
     (stack empties) ◄── event loop dequeues ──────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript is single-threaded. Synchronous code runs line by line and blocks the thread until each step finishes. Asynchronous code (timers, fetch, I/O) is handed to host APIs that work off-thread; their callbacks are queued and run by the event loop only when the call stack is empty — which is why setTimeout(fn,0) runs after all sync code. Async keeps the one thread responsive but is not parallelism; for CPU-heavy work use Web Workers or chunk-and-yield.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript runs on a single thread with one call stack, so it can only do one thing at a time. Synchronous code executes top to bottom and each operation blocks the thread until it completes — if a line takes two seconds, nothing else runs for two seconds, freezing the UI or stalling the server. Asynchronous code solves this: when you call something slow like setTimeout, fetch, or a file read, JavaScript hands that work to the host environment — Web APIs in the browser or libuv in Node — and immediately continues running the rest of your code. When the operation finishes, its callback is placed in a queue, and the event loop runs that callback only when the call stack is empty. That is why setTimeout with a zero delay still runs after all your synchronous code: it is scheduled, not immediate. A crucial nuance is that async is not parallelism. async/await just makes asynchronous code read sequentially while still cooperatively pausing on the single thread. So async is great for I/O-bound waiting, but it does not help CPU-bound work — a heavy loop still blocks everything. For real parallelism you reach for Web Workers in the browser or worker_threads in Node, or you chunk the work and yield to the event loop between chunks.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Single-threaded async gives high I/O concurrency with low memory but offers no help for CPU-bound work.',
      'Async code is more scalable but harder to reason about (ordering, error handling) than straight synchronous code.',
      'Callbacks vs promises vs async/await trade verbosity, error propagation, and readability differently.',
    ],
    edgeCases: [
      'Microtasks (promises) drain fully before the next macrotask, so a resolved promise beats a 0ms timer.',
      'await on an already-resolved promise still defers continuation to a microtask — order surprises follow.',
      'A long microtask chain can starve the macrotask queue (and rendering), causing a frozen-feeling UI.',
    ],
    runtimeBehavior: [
      'Timers have a minimum delay (clamped, often 4ms after nesting) and run only when the stack clears, so timing is approximate.',
      'Node and browsers differ in some ordering details (e.g. setImmediate, process.nextTick) that matter at scale.',
      'Unhandled promise rejections behave differently across environments and can crash Node.',
    ],
    scalability: [
      'Non-blocking I/O lets one process serve thousands of connections; sync blocking destroys this advantage.',
      'CPU-heavy endpoints must be offloaded to workers or separate services to avoid blocking the loop for all users.',
    ],
    productionConcerns: [
      'Accidental synchronous APIs (readFileSync, sync crypto) in hot paths cause hard-to-diagnose latency spikes.',
      'Event-loop lag monitoring is essential to detect blocking before it causes timeouts.',
      'Unbounded concurrent async operations can exhaust connection pools or memory; throttle with queues/limits.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'JS is single-threaded — one call stack, one thing at a time.',
    'Sync = runs in order, blocks the thread.',
    'Async = start now, finish later via callback/promise/await.',
    'Slow ops go to host APIs (Web APIs / libuv) off the main thread.',
    'Event loop runs queued callbacks only when the stack is empty.',
    'setTimeout(fn,0) runs AFTER all sync code, not immediately.',
    'async/await = cooperative pausing, NOT parallelism.',
    'Promise.all = run independent async ops concurrently.',
    'CPU-bound work blocks the loop — use Workers or chunk-and-yield.',
    'Never use Sync I/O APIs in server request paths.',
    'Microtasks beat macrotasks — promise before 0ms timer.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: console.log(1); setTimeout(() => console.log(2), 0); console.log(3);',
      hint: 'The timer callback is deferred.',
      solution: {
        lang: 'js',
        code: `console.log(1)\nsetTimeout(() => console.log(2), 0)\nconsole.log(3)\n// 1\n// 3\n// 2`,
        explanation: ['1 and 3 are synchronous and run first in order.', '2 is queued as a macrotask and runs only after the stack is empty.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert a callback-based delay into a promise-returning `wait(ms)` function and use it with async/await.',
      hint: 'Wrap setTimeout in a Promise.',
      solution: {
        lang: 'js',
        code: `function wait(ms) {\n  return new Promise((resolve) => setTimeout(resolve, ms))\n}\nasync function run() {\n  console.log('start')\n  await wait(1000)\n  console.log('1s later')\n}\nrun()`,
        explanation: [
          'wait returns a promise that resolves after ms via setTimeout.',
          'await pauses run() without blocking the thread.',
          'After 1s the promise resolves and run() continues.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'You have a CPU-heavy loop blocking the UI. Show how to chunk it so the page stays responsive.',
      hint: 'Process a batch, then yield to the event loop before the next batch.',
      solution: {
        lang: 'js',
        code: `function processChunked(items, batchSize = 1000) {\n  let i = 0\n  function next() {\n    const end = Math.min(i + batchSize, items.length)\n    for (; i < end; i++) heavyWork(items[i])\n    if (i < items.length) setTimeout(next, 0) // yield\n  }\n  next()\n}`,
        explanation: [
          'We process a batch synchronously, then schedule the next batch with setTimeout.',
          'Yielding to the event loop between batches lets the browser paint and handle input.',
          'This keeps a long computation from freezing the UI.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Run three independent async fetches concurrently and return all results, then explain why this is faster than awaiting them one by one.',
      hint: 'Use Promise.all.',
      solution: {
        lang: 'js',
        code: `async function loadAll() {\n  const [a, b, c] = await Promise.all([\n    fetch('/a').then(r => r.json()),\n    fetch('/b').then(r => r.json()),\n    fetch('/c').then(r => r.json()),\n  ])\n  return { a, b, c }\n}`,
        explanation: [
          'All three fetches start immediately and run concurrently (the host handles them in parallel).',
          'Promise.all waits for all to resolve, so total time is the slowest one, not the sum.',
          'Awaiting them sequentially would add the latencies together — much slower.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Sync vs async is the gateway to all of asynchronous JavaScript. Get it right and the event loop, promises, and async/await all click into place; get it wrong and you write blocking code that freezes apps.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and the setTimeout(0) output question. Product companies (Zoho, Flipkart, Razorpay) ask you to reason about ordering and to avoid blocking the thread. FAANG-level interviews probe concurrency vs parallelism, event-loop lag, and offloading CPU work.',
    whatInterviewersExpect:
      'They expect you to explain single-threaded execution, why async work is deferred, that async is not parallelism, and how to keep the thread responsive (Promise.all, Workers, chunking).',
  },
}

export default syncVsAsync
