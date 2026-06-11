import type { ConceptLesson } from '../../../types/lesson'

const macrotaskQueue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'macrotask-queue',
  name: 'Macrotask (Task) Queue',
  category: 'async',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The macrotask queue is half of the event loop\'s scheduling model — you cannot reason about async ordering without it.',
    'Timers, DOM events, network callbacks, and message events are all macrotasks; understanding the queue explains when they actually run.',
    'It is the key to the most common interview puzzle: why a promise (microtask) runs before a setTimeout (macrotask).',
    'It explains why rendering and input can run between tasks but not within a long one — the foundation of responsive UIs.',
    'Knowing that only ONE macrotask runs per loop turn (with microtasks drained between) lets you derive any async output precisely.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The macrotask queue is the normal line at a ride — one rider at a time, and between each rider the staff do a quick safety check.',
    story: [
      'Imagine a theme-park ride that takes one person at a time, and a long line of people waiting their turn.',
      'After each rider finishes, the staff do a quick check and let any "fast-pass" people (microtasks) cut in before the next normal rider.',
      'So the normal line moves one person per round, with the fast-pass people squeezed in right after each one.',
      'The macrotask queue is that normal line: timers and clicks wait in it, and the ride operator (the event loop) takes just one each round, doing the fast-pass (microtask) check in between.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When something async finishes — a timer, a click, a network response — its callback waits in a line called the macrotask (or task) queue.',
    'The event loop takes only one callback from this line each round.',
    'Before taking the next one, it first runs all the higher-priority microtasks (like promises).',
    'This is why a setTimeout callback can be delayed even at 0ms — it must wait its turn in the macrotask line.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The macrotask queue (a.k.a. task queue) is a FIFO queue holding callbacks for things like setTimeout/setInterval, DOM events, I/O, MessageChannel, and setImmediate (Node). The event loop processes exactly one macrotask per iteration.',
    how: 'When an async source completes, its callback is enqueued as a macrotask. After the current macrotask finishes, the loop drains all microtasks, optionally renders, then dequeues the next macrotask.',
    why: 'It gives the loop a fair, ordered way to schedule discrete units of async work while leaving room between tasks for microtasks and rendering, keeping the app responsive.',
    code: {
      label: 'Macrotask ordering',
      lang: 'js',
      code: `setTimeout(() => console.log('timer 1'), 0)\nsetTimeout(() => console.log('timer 2'), 0)\nconsole.log('sync')\n// sync\n// timer 1\n// timer 2`,
      explanation: [
        '"sync" runs first as synchronous code.',
        'Both timers enqueue macrotasks in order.',
        'The loop runs ONE macrotask per turn, in FIFO order.',
        '"timer 1" runs, then on the next turn "timer 2" — preserving enqueue order.',
        'Between them, the loop would drain any microtasks.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The macrotask queue (formally a task queue in the HTML spec) is a FIFO collection of tasks, each representing a discrete callback scheduled by a task source: timers (setTimeout/setInterval), DOM/UI events, network/I/O callbacks, postMessage/MessageChannel, and (in Node) setImmediate. On each event-loop iteration the loop selects exactly one runnable task, executes it to completion, then fully drains the microtask checkpoint before optionally rendering and proceeding to the next task. Browsers may maintain multiple task sources/queues with prioritization, but the invariant is one task per turn with a microtask drain between turns.',

  // 7. Internal Working
  internalWorking: [
    'A task source (timer subsystem, DOM, network) completes its work off the main thread and enqueues a task (callback) into a task queue.',
    'The event loop, on each iteration, picks the oldest runnable task from a task queue (FIFO within a source).',
    'It pushes that task\'s callback onto the call stack and runs it to completion — no other task interrupts it.',
    'When the task finishes and the stack empties, the loop performs a microtask checkpoint, draining the entire microtask queue.',
    'In browsers, after microtasks the loop may run the rendering steps (rAF, style, layout, paint) before the next iteration.',
    'The loop then returns to pick the next task — so exactly one macrotask runs per turn, with microtasks and possibly rendering interleaved.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Task sources enqueue callbacks (FIFO):
     timers ─┐
     events ─┼──► [ MACROTASK QUEUE ]  t1 → t2 → t3
     I/O ────┘
                       │ event loop takes ONE per turn
                       ▼
        run t1 ──► drain ALL microtasks ──► render ──┐
                                                     │
        run t2 ──► drain ALL microtasks ──► render ──┘ ...`,

  // 9. Memory Visualization
  memoryVisualization: [
    'QUEUE: the macrotask queue stores references to callback functions plus their captured closures; entries are removed as they run.',
    'HEAP: each pending task keeps its closure and referenced data (DOM nodes, buffers) alive until it executes or is cancelled.',
    'A flood of enqueued tasks (e.g. rapid events) grows the queue and delays later tasks (event backlog).',
    'Cancelling a timer (clearTimeout) removes/ignores its task so its closure can be collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — one task per turn',
      lang: 'js',
      code: `console.log('start')\nsetTimeout(() => console.log('task A'), 0)\nsetTimeout(() => console.log('task B'), 0)\nconsole.log('end')\n// start, end, task A, task B`,
      explanation: [
        'Synchronous start and end run first.',
        'Task A and Task B are enqueued as macrotasks in order.',
        'The loop runs one per turn, FIFO.',
        'So A then B, each on its own loop iteration.',
      ],
    },
    intermediate: {
      label: 'Intermediate — microtasks drain between macrotasks',
      lang: 'js',
      code: `setTimeout(() => {\n  console.log('macro 1')\n  Promise.resolve().then(() => console.log('micro inside macro 1'))\n}, 0)\nsetTimeout(() => console.log('macro 2'), 0)\n// macro 1\n// micro inside macro 1\n// macro 2`,
      explanation: [
        'macro 1 runs first as the first macrotask.',
        'Inside it, a microtask is scheduled.',
        'After macro 1 finishes, the loop drains microtasks → "micro inside macro 1".',
        'Only then does macro 2 (the next macrotask) run.',
      ],
    },
    advanced: {
      label: 'Advanced — scheduling a macrotask without a timer (MessageChannel)',
      lang: 'js',
      code: `function postTask(fn) {\n  const { port1, port2 } = new MessageChannel()\n  port1.onmessage = () => fn()\n  port2.postMessage(null) // enqueues a macrotask, no 4ms clamp\n}\n\npostTask(() => console.log('runs as a macrotask, fast'))\nconsole.log('sync first')`,
      explanation: [
        'setTimeout(0) is clamped (~4ms after nesting); MessageChannel posts a macrotask without that clamp.',
        'postMessage schedules onmessage as a macrotask once the stack clears.',
        '"sync first" still runs before it, proving it is queued, not immediate.',
        'This trick (used by React scheduler historically) yields faster than setTimeout(0).',
      ],
    },
    realProject: {
      label: 'Real project — yielding long work via macrotasks (React-style scheduler)',
      lang: 'js',
      code: `async function processInChunks(items, work, chunk = 200) {\n  for (let i = 0; i < items.length; i += chunk) {\n    items.slice(i, i + chunk).forEach(work)\n    // yield a macrotask so the browser can render/handle input\n    await new Promise((resolve) => setTimeout(resolve, 0))\n  }\n}`,
      explanation: [
        'Each chunk runs synchronously, then we await a setTimeout to yield a macrotask.',
        'Yielding lets the event loop drain microtasks AND render between chunks.',
        'This keeps the UI responsive during large workloads, the core idea behind cooperative schedulers.',
        'React\'s concurrent scheduler uses a similar yield-to-the-host strategy.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the macrotask queue and what goes in it?',
      answer: 'It is a FIFO queue of callbacks scheduled by task sources: setTimeout/setInterval, DOM/UI events, I/O callbacks, postMessage, and setImmediate in Node. The event loop runs one macrotask per iteration.',
      explanation: 'Listing concrete task sources shows you know what counts as a macrotask.',
    },
    {
      level: 'intermediate',
      question: 'How many macrotasks does the event loop run per iteration, and what happens between them?',
      answer: 'Exactly one. After each macrotask the loop drains the entire microtask queue and, in browsers, may render before running the next macrotask.',
      explanation: 'The one-per-turn rule with a microtask drain between is the crucial mechanic.',
    },
    {
      level: 'intermediate',
      question: 'Why does a Promise callback run before a setTimeout callback scheduled earlier?',
      answer: 'Because promise callbacks are microtasks and setTimeout callbacks are macrotasks. The microtask queue is fully drained after the current macrotask, before the next macrotask runs.',
      explanation: 'This is the canonical macro-vs-micro question; the priority rule is the answer.',
    },
    {
      level: 'advanced',
      question: 'Why is setTimeout(fn, 0) not actually 0ms, and how can you schedule a macrotask faster?',
      answer: 'Nested timers are clamped to ~4ms minimum and background tabs throttle them. MessageChannel/postMessage enqueues a macrotask without the clamp, so it runs sooner — a technique used by schedulers.',
      explanation: 'Knowing the clamp and the MessageChannel workaround signals deep practical knowledge.',
    },
    {
      level: 'advanced',
      question: 'How does the macrotask queue enable rendering and input responsiveness?',
      answer: 'Because rendering and input handling occur between macrotasks (after microtasks), keeping each task short lets the browser paint and respond. A single long macrotask blocks all of this until it finishes.',
      explanation: 'Connecting task length to rendering/INP shows you understand performance implications.',
    },
    {
      level: 'senior',
      question: 'How do macrotasks differ between the browser and Node.js?',
      answer: 'The browser has task sources processed one-per-turn with microtask drains and rendering. Node uses libuv phases: timers phase (setTimeout/setInterval), poll phase (I/O), and check phase (setImmediate), with process.nextTick and microtasks drained between callbacks. setImmediate vs setTimeout(0) ordering depends on context.',
      explanation: 'Articulating Node phases and where each macrotask source runs is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a macrotask and a microtask?',
    'Why is setTimeout(0) clamped, and what is the minimum delay?',
    'How does setImmediate differ from setTimeout(0) in Node?',
    'How can you schedule a macrotask without setTimeout (MessageChannel)?',
    'Where does requestAnimationFrame fit relative to macrotasks?',
    'What causes a macrotask backlog and how do you mitigate it?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking all queued macrotasks run back-to-back without interruption.',
      why: 'Only one runs per turn; microtasks (and possibly rendering) run between them.',
      fix: 'Model the loop as: one macrotask → drain microtasks → maybe render → next macrotask.',
    },
    {
      mistake: 'Assuming setTimeout(fn, 0) executes in 0ms.',
      why: 'Nested timers are clamped to ~4ms and the callback waits for its turn in the queue.',
      fix: 'Treat the delay as a minimum; use MessageChannel for clamp-free macrotask scheduling.',
    },
    {
      mistake: 'Putting heavy work in a single macrotask.',
      why: 'One long task blocks microtasks, rendering, and input until it finishes.',
      fix: 'Split into smaller macrotasks and yield between them to keep the UI responsive.',
    },
    {
      mistake: 'Confusing Node setImmediate ordering with browser timing.',
      why: 'Node has distinct phases; setImmediate and setTimeout(0) can order differently than expected.',
      fix: 'Learn the libuv phase model when timing matters in Node.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'The concurrent scheduler yields to the host between units of work using macrotask-style scheduling (MessageChannel) so rendering and input stay responsive.' },
    { area: 'Vue', detail: 'While Vue flushes updates via microtasks (nextTick), long user-triggered work is chunked across macrotasks to avoid blocking paint.' },
    { area: 'Node.js', detail: 'The libuv timers and check phases process macrotasks; setImmediate is used to defer work until after I/O, and timers drive retries and timeouts.' },
    { area: 'Backend', detail: 'Breaking large jobs into macrotasks keeps the event loop free to accept new connections, preventing request latency spikes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'One-task-per-turn scheduling leaves room for rendering and input between tasks.',
      'Splitting work into macrotasks keeps individual tasks short and the app responsive.',
    ],
    bad: [
      'A single long macrotask blocks microtasks, rendering, and input (long-task jank).',
      'A backlog of enqueued tasks (event storms) delays important callbacks.',
    ],
    optimizations: [
      'Chunk heavy work across macrotasks and yield (setTimeout / MessageChannel / scheduler.yield).',
      'Coalesce rapid events (debounce/throttle) to reduce queued tasks.',
      'Use MessageChannel to schedule clamp-free macrotasks when timing matters.',
      'Keep each task under ~50ms to protect input responsiveness (INP).',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'sync-vs-async', 'timers', 'callbacks'],
    nextConcepts: ['microtask-queue', 'promises', 'event-loop-starvation', 'long-task-scheduling'],
    dependencyNote:
      'The macrotask queue is one of the two queues the event-loop tick rule operates on. It builds on the event loop, timers, and callbacks, and contrasts directly with the microtask queue; mastering both lets you derive any async ordering.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a FIFO box labeled MACROTASK QUEUE with t1, t2, t3.',
      'List task sources feeding it: timers, events, I/O, postMessage.',
      'Write the loop rule: take ONE task → drain ALL microtasks → render → next task.',
      'Run a setTimeout + Promise example to show the promise jumps ahead of the next timer.',
      'Say: "One macrotask per turn, microtasks fully drained between. setTimeout(0) is clamped and waits its turn — that is why promises beat it."',
    ],
    diagram: `   timers/events/IO ──► [ t1 | t2 | t3 ]  (FIFO)
                                │ ONE per turn
                                ▼
         t1 → (drain microtasks) → render → t2 → ...`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The macrotask (task) queue is a FIFO of callbacks from timers, DOM events, I/O, postMessage, and setImmediate. The event loop runs exactly ONE macrotask per iteration, then drains all microtasks and possibly renders before the next. That is why promises (microtasks) beat setTimeout (macrotask), and why setTimeout(0) — clamped to ~4ms — is never instant. One long macrotask blocks rendering and input, so chunk heavy work across tasks.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The macrotask queue, called the task queue in the spec, is a FIFO collection of callbacks scheduled by task sources: timers like setTimeout and setInterval, DOM and UI events, network and I/O completions, postMessage and MessageChannel, and setImmediate in Node. The defining rule is that the event loop runs exactly one macrotask per iteration. After that single task completes and the call stack empties, the loop performs a microtask checkpoint, draining the entire microtask queue, and in the browser it may then run rendering before picking the next macrotask. This one-task-per-turn-with-microtasks-between model is what explains async ordering: a promise callback, being a microtask, always runs before the next setTimeout callback, which is a macrotask. It also explains why setTimeout with zero delay is never truly immediate — nested timers are clamped to about four milliseconds, and the callback still has to wait its turn in the queue. The practical performance lesson is that because rendering and input handling happen between macrotasks, keeping each task short keeps the app responsive, while a single long macrotask blocks paint and input until it finishes. That is why cooperative schedulers, including React\'s, break work into chunks and yield a macrotask between them, sometimes using MessageChannel to avoid the timer clamp. In Node, macrotasks are organized into libuv phases — timers, poll, and check — which determine ordering between setTimeout and setImmediate.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Yielding via macrotasks restores responsiveness but adds per-yield latency and overhead.',
      'setTimeout(0) is universal but clamped; MessageChannel is faster but more code and less obvious.',
      'Fine-grained tasks improve INP but increase scheduling churn.',
    ],
    edgeCases: [
      'Nested setTimeout clamps to ~4ms; background tabs throttle to ~1s.',
      'Browsers may have multiple task queues with prioritization, so strict cross-source FIFO is not guaranteed.',
      'Node: setImmediate (check phase) vs setTimeout(0) (timers phase) ordering varies with call context.',
      'rAF callbacks run in the rendering step, not the macrotask queue, so they batch to the refresh rate.',
    ],
    runtimeBehavior: [
      'Exactly one macrotask runs per loop turn; it runs to completion uninterrupted.',
      'Microtasks scheduled inside a macrotask run after it, before the next macrotask.',
      'Long tasks over 50ms degrade responsiveness metrics (INP) and block input.',
    ],
    scalability: [
      'Server event loops must keep tasks short; one slow synchronous handler stalls all concurrent work.',
      'Event storms (e.g. high-frequency messages) can backlog the queue — apply backpressure or coalescing.',
    ],
    productionConcerns: [
      'Long macrotasks are the leading cause of UI jank and poor INP; measure with the Long Tasks API.',
      'Misjudging Node phase ordering causes subtle bugs between timers, I/O, and immediates.',
      'Unbounded task enqueueing (e.g. recursive setTimeout fan-out) can saturate the loop.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Macrotask queue = FIFO of task callbacks.',
    'Sources: setTimeout, setInterval, DOM events, I/O, postMessage, setImmediate (Node).',
    'Event loop runs exactly ONE macrotask per iteration.',
    'Between macrotasks: drain ALL microtasks, then maybe render.',
    'Microtasks (promises) beat macrotasks (timers).',
    'setTimeout(0) is clamped (~4ms) and waits its turn — not instant.',
    'MessageChannel schedules a macrotask without the clamp.',
    'One long macrotask blocks render + input (jank).',
    'Keep tasks < ~50ms for good INP.',
    'Chunk heavy work and yield between macrotasks.',
    'Node organizes macrotasks into libuv phases (timers/poll/check).',
    'rAF runs in the render step, not the macrotask queue.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the order: console.log("a"); setTimeout(()=>console.log("b")); console.log("c");',
      hint: 'The timer callback is a macrotask.',
      solution: {
        lang: 'js',
        code: `console.log('a')\nsetTimeout(() => console.log('b'))\nconsole.log('c')\n// a, c, b`,
        explanation: ['a and c are synchronous.', 'b is a macrotask that runs after the stack clears.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show that a microtask scheduled inside a macrotask runs before the next macrotask.',
      hint: 'Schedule a Promise.then inside the first setTimeout.',
      solution: {
        lang: 'js',
        code: `setTimeout(() => {\n  console.log('macro1')\n  Promise.resolve().then(() => console.log('micro'))\n})\nsetTimeout(() => console.log('macro2'))\n// macro1, micro, macro2`,
        explanation: [
          'macro1 runs first.',
          'It schedules a microtask which drains before the next macrotask.',
          'So micro prints before macro2.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a yield-to-host helper that schedules a macrotask faster than setTimeout(0).',
      hint: 'Use MessageChannel.',
      solution: {
        lang: 'js',
        code: `function yieldToHost() {\n  return new Promise((resolve) => {\n    const { port1, port2 } = new MessageChannel()\n    port1.onmessage = () => resolve()\n    port2.postMessage(null)\n  })\n}\n\nasync function chunked(items, work) {\n  for (let i = 0; i < items.length; i++) {\n    work(items[i])\n    if (i % 100 === 0) await yieldToHost()\n  }\n}`,
        explanation: [
          'MessageChannel.postMessage enqueues a macrotask without the ~4ms timer clamp.',
          'Awaiting it yields control so the browser can render and process input.',
          'Yielding periodically keeps long loops from blocking the UI.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Given mixed sync, microtask, and two macrotasks, write the code and derive the exact output, explaining each step.',
      hint: 'Apply: sync → all microtasks → one macrotask → microtasks → next macrotask.',
      solution: {
        lang: 'js',
        code: `console.log('sync 1')\nsetTimeout(() => console.log('macro 1'), 0)\nPromise.resolve().then(() => console.log('micro 1'))\nsetTimeout(() => console.log('macro 2'), 0)\nconsole.log('sync 2')\n// sync 1, sync 2, micro 1, macro 1, macro 2`,
        explanation: [
          'Synchronous lines run first: sync 1, sync 2.',
          'Microtask queue drains next: micro 1.',
          'Then one macrotask per turn in FIFO order: macro 1, then macro 2 (no microtasks added, so they just run in order).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The macrotask queue is one of the two pillars of event-loop reasoning. Understanding it lets you derive any async ordering, explain why timers run when they do, and diagnose UI jank from long tasks.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what a macrotask is and the promise-vs-timer ordering. Product companies (Zoho, Flipkart, Razorpay) give multi-step ordering puzzles and ask about clamping. FAANG-level interviews probe Node phases, MessageChannel scheduling, and long-task impact on INP.',
    whatInterviewersExpect:
      'They expect you to name macrotask sources, state the one-per-turn rule with microtask drains, explain why promises beat timers and why setTimeout(0) is clamped, and discuss keeping tasks short for responsiveness.',
  },
}

export default macrotaskQueue
