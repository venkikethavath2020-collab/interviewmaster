import type { ConceptLesson } from '../../../types/lesson'

const timers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'timers',
  name: 'setTimeout / setInterval',
  category: 'async',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Timers are your first hands-on experience with asynchronous, non-blocking scheduling — the gateway to the event loop.',
    'Almost every UX utility uses them: debounce, throttle, polling, retries with backoff, toast auto-dismiss, animations fallback.',
    'They are a favorite interview vehicle because the "0ms" and var-in-loop questions reveal whether you truly understand the event loop and closures.',
    'Misusing them causes real bugs: leaked intervals that never stop, drifting clocks, and memory leaks from un-cleared timers holding closures alive.',
    'Understanding clamping, minimum delays, and that the delay is a minimum (not a guarantee) is essential for correct timing logic.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'setTimeout is setting a single kitchen timer; setInterval is a timer that rings over and over until you switch it off.',
    story: [
      'Imagine you are baking cookies. You set a kitchen timer for 10 minutes and go play, knowing it will beep when the time is up.',
      'That one-time beep is like setTimeout: do this thing once, later.',
      'Now imagine a timer that beeps every 10 minutes to remind you to drink water, again and again, until you press stop.',
      'That repeating beep is like setInterval: do this thing over and over, until you cancel it with clearInterval — just like you can cancel the cookie timer with clearTimeout before it rings.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'setTimeout asks JavaScript to run a function once after a number of milliseconds.',
    'setInterval asks JavaScript to run a function again and again, every so many milliseconds, until you stop it.',
    'Both return an id you can pass to clearTimeout or clearInterval to cancel them.',
    'The delay you give is the minimum wait, not an exact promise — the function only runs once JavaScript is free to run it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'setTimeout(fn, delay) schedules fn to run once after at least `delay` milliseconds. setInterval(fn, delay) runs fn repeatedly every `delay` ms. Both return an id; clearTimeout/clearInterval cancel them.',
    how: 'The host environment (browser/Node) starts a timer off the main thread. When it expires, the callback is placed in the macrotask queue and runs only when the call stack is empty and earlier tasks are done.',
    why: 'Timers let you defer work, repeat work, and build time-based behavior (debounce, polling, animations) without blocking the single thread.',
    code: {
      label: 'Both timers and cancelling',
      lang: 'js',
      code: `const id = setTimeout(() => console.log('once after 1s'), 1000)\n// clearTimeout(id) // would cancel it\n\nlet n = 0\nconst tick = setInterval(() => {\n  n++\n  console.log('tick', n)\n  if (n === 3) clearInterval(tick) // stop after 3\n}, 500)`,
      explanation: [
        'setTimeout schedules a one-time callback after ~1000ms and returns an id.',
        'clearTimeout(id) would cancel it before it fires.',
        'setInterval runs every ~500ms; the callback increments n.',
        'When n reaches 3 we call clearInterval(tick) to stop the repetition.',
        'Without clearInterval, the interval would run forever — a common leak.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'setTimeout and setInterval are host-provided (not ECMAScript core) timer functions that register a callback with the environment\'s timer subsystem. setTimeout schedules a single macrotask after a minimum delay; setInterval re-schedules a macrotask at a fixed period. The delay is a lower bound: the callback is enqueued when the timer expires but only executes when the call stack is empty and prior macrotasks have run. Browsers clamp nested timers to a 4ms minimum and throttle timers in background tabs. Each call returns an opaque handle used by clearTimeout/clearInterval to cancel.',

  // 7. Internal Working
  internalWorking: [
    'Calling setTimeout/setInterval hands the callback and delay to the host\'s timer module (Web APIs in browsers, libuv timers in Node) and returns immediately with a handle.',
    'The host tracks elapsed time off the main JS thread; the callback does NOT sit on the call stack while waiting.',
    'When the delay elapses, the host pushes the callback onto the macrotask (task) queue.',
    'The event loop runs the callback only after the current synchronous code finishes and the microtask queue is drained.',
    'For setInterval, the host re-queues the callback every period; if the callback runs long, intervals can bunch up or be dropped to avoid overlap.',
    'clearTimeout/clearInterval mark the timer cancelled so the host will not enqueue (or will discard) the callback.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   setTimeout(cb, 1000)
        │ returns handle immediately
        ▼
   ┌── Host timer subsystem ──┐
   │  counts ~1000ms off-thread│
   └────────────┬─────────────┘
                ▼ (expires)
        Macrotask Queue: [cb]
                │
   event loop (stack empty, microtasks drained)
                ▼
            cb runs   ← delay is a MINIMUM, not exact`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the callback closure and everything it captures stay alive as long as the timer is pending or the interval is active.',
    'A never-cleared setInterval keeps its callback (and captured DOM nodes / data) reachable forever — a classic memory leak.',
    'The timer handle itself is a small opaque value held by the host registry.',
    'Calling clearInterval/clearTimeout releases the host\'s reference, letting the closure and captured data be garbage collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — deferring with setTimeout(0)',
      lang: 'js',
      code: `console.log('A')\nsetTimeout(() => console.log('C'), 0)\nconsole.log('B')\n// A\n// B\n// C`,
      explanation: [
        'setTimeout(0) does NOT run immediately; it queues a macrotask.',
        'A and B are synchronous and run first.',
        'C runs only after the call stack clears.',
        '0ms means "as soon as possible after current work", not "now".',
      ],
    },
    intermediate: {
      label: 'Intermediate — the classic var loop bug',
      lang: 'js',
      code: `// Bug: prints 3, 3, 3\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100)\n}\n\n// Fix: let gives a fresh binding per iteration → 0, 1, 2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 100)\n}`,
      explanation: [
        'With var there is ONE shared i; by the time the timers fire the loop is done and i === 3.',
        'All three callbacks close over the same binding, so all print 3.',
        'let creates a new block-scoped i each iteration, so each callback captures 0, 1, 2.',
        'This is the most common timer + closure interview question.',
      ],
    },
    advanced: {
      label: 'Advanced — non-drifting interval with recursive setTimeout',
      lang: 'js',
      code: `function accurateInterval(fn, period) {\n  let expected = Date.now() + period\n  let id\n  function step() {\n    const drift = Date.now() - expected\n    fn()\n    expected += period\n    id = setTimeout(step, Math.max(0, period - drift)) // correct for drift\n  }\n  id = setTimeout(step, period)\n  return () => clearTimeout(id)\n}`,
      explanation: [
        'setInterval drifts because callback execution time accumulates and background tabs throttle it.',
        'Here we recompute the next delay to compensate for how late the last tick ran.',
        'Recursive setTimeout guarantees the previous callback finished before scheduling the next (no overlap).',
        'Returns a stop function — cleaner than tracking interval ids manually.',
      ],
    },
    realProject: {
      label: 'Real project — debounced input handler (Vue/React)',
      lang: 'js',
      code: `function debounce(fn, delay = 300) {\n  let timer\n  return function (...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}\n\n// usage\nconst onSearch = debounce((q) => api.search(q), 300)\ninput.addEventListener('input', (e) => onSearch(e.target.value))`,
      explanation: [
        'Each keystroke clears the previous pending timeout and schedules a new one.',
        'Only the last keystroke within the window actually fires the search.',
        'timer is held in a closure between calls — combining timers with closures.',
        'This exact pattern drives search-as-you-type and autosave in production apps; remember to clear it on unmount.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between setTimeout and setInterval?',
      answer: 'setTimeout runs a callback once after a delay; setInterval runs it repeatedly every interval until cleared. Both return a handle for clearTimeout/clearInterval.',
      explanation: 'A complete answer mentions cancellation and that both are non-blocking.',
    },
    {
      level: 'beginner',
      question: 'Does setTimeout(fn, 0) run fn immediately?',
      answer: 'No. It queues fn as a macrotask. It runs only after the current synchronous code finishes and the microtask queue is drained — 0 is a minimum delay.',
      explanation: 'Tests understanding that timers are scheduled, not immediate.',
    },
    {
      level: 'intermediate',
      question: 'Why does `for (var i...) setTimeout(() => console.log(i), 100)` print the last value repeatedly?',
      answer: 'var is function-scoped, so all callbacks close over the same single i, which equals the final value by the time they fire. Use let for a fresh per-iteration binding, or capture i in an IIFE.',
      explanation: 'Combines timers with closure/scope — the most common variant of this question.',
    },
    {
      level: 'intermediate',
      question: 'Is the delay in setTimeout guaranteed to be exact?',
      answer: 'No, it is a minimum. The callback fires only when the stack is empty; it can be later due to busy main thread, nested-timer 4ms clamping, and background-tab throttling.',
      explanation: 'Knowing the delay is a lower bound, plus clamping/throttling, is the key nuance.',
    },
    {
      level: 'advanced',
      question: 'Why might setInterval drift, and how do you avoid it?',
      answer: 'Long-running callbacks, main-thread congestion, and tab throttling make ticks late, and errors accumulate. Use recursive setTimeout that recomputes the next delay based on the actual elapsed time, ensuring no overlap and correcting drift.',
      explanation: 'Demonstrates real understanding of timing accuracy and overlap prevention.',
    },
    {
      level: 'senior',
      question: 'How do timers interact with the event loop relative to promises and rendering?',
      answer: 'Timer callbacks are macrotasks. After each macrotask the engine drains all microtasks (promises) and may render before the next macrotask. So a resolved promise runs before a 0ms timer, and a flood of microtasks can starve timers and block painting.',
      explanation: 'Placing timers correctly in the macrotask/microtask/render cycle is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the minimum delay for nested timers, and why?',
    'How do browsers throttle timers in background or inactive tabs?',
    'How would you implement debounce and throttle with timers?',
    'Why prefer recursive setTimeout over setInterval for polling?',
    'How do you cancel a pending timer, and what happens if you do not?',
    'What is the difference between setTimeout and requestAnimationFrame for animations?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to clearInterval / clearTimeout on cleanup.',
      why: 'The timer keeps firing and its closure keeps captured data (and DOM nodes) alive — a memory leak and duplicated work.',
      fix: 'Always clear timers in component unmount/cleanup (React useEffect return, Vue onUnmounted).',
    },
    {
      mistake: 'Assuming the delay is exact for animations or precise timing.',
      why: 'Delay is a minimum; throttling, clamping, and main-thread load make it imprecise and cause drift.',
      fix: 'Use requestAnimationFrame for visual animation and drift-corrected recursive setTimeout for accuracy.',
    },
    {
      mistake: 'Using var in a loop with setTimeout and expecting per-iteration values.',
      why: 'All callbacks share one var binding equal to the final loop value.',
      fix: 'Use let (per-iteration binding) or capture the value via an IIFE.',
    },
    {
      mistake: 'Using setInterval for tasks whose callback can run longer than the interval.',
      why: 'Callbacks can overlap or queue up, causing pile-ups and unexpected concurrency.',
      fix: 'Use recursive setTimeout that schedules the next run only after the previous finishes.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Timers power debounce/throttle hooks, toast auto-dismiss, and polling; cleanup in useEffect return prevents leaks and stale-closure bugs.' },
    { area: 'Vue', detail: 'Used in composables for debounced search and polling; clear them in onUnmounted to avoid orphaned intervals updating destroyed components.' },
    { area: 'Node.js', detail: 'setTimeout/setInterval drive retry backoff, heartbeat pings, cache TTL sweeps, and scheduled jobs; unref() prevents timers from keeping the process alive.' },
    { area: 'Backend', detail: 'Polling external services, rate-limit windows, and timeout guards on requests rely on timers; drift-correction matters for accurate scheduling.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Timers defer non-urgent work off the critical path, keeping the UI responsive.',
      'Debounce/throttle built on timers dramatically reduce expensive handler invocations.',
    ],
    bad: [
      'Many overlapping intervals create constant wakeups and GC pressure.',
      'Un-cleared timers leak memory by pinning closures and DOM nodes alive.',
    ],
    optimizations: [
      'Prefer recursive setTimeout over setInterval to prevent overlap and correct drift.',
      'Always clear timers on cleanup; in Node use unref() so they do not block process exit.',
      'Batch frequent work with throttle/debounce instead of firing every event.',
      'Use requestAnimationFrame for visual updates instead of setInterval to align with the paint cycle.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['sync-vs-async', 'callbacks', 'closure'],
    nextConcepts: ['event-loop', 'macrotask-queue', 'debounce', 'throttle', 'requestanimationframe'],
    dependencyNote:
      'Timers build on sync-vs-async, callbacks, and closures (the timer callback closes over state). They are the concrete entry into the event loop and the macrotask queue, and they implement debounce/throttle.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write setTimeout(cb, 1000) and draw an arrow to a "host timer" box that returns a handle immediately.',
      'Show synchronous code continuing while the timer counts off-thread.',
      'When it expires, drop cb into the "macrotask queue".',
      'Draw the event loop pulling cb onto the stack only when empty + microtasks drained.',
      'Say: "Delay is a minimum, not exact. setInterval re-queues each period; recursive setTimeout avoids overlap and drift. Always clear timers to avoid leaks."',
    ],
    diagram: `   setTimeout(cb, 1000) ──► host timer (off-thread)
                                   │ expires
                                   ▼
                          macrotask queue: [cb]
                                   │ (stack empty)
                          event loop ──► cb runs`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'setTimeout runs a callback once after a minimum delay; setInterval runs it repeatedly until cleared. Both return a handle for clearTimeout/clearInterval. Callbacks are macrotasks: they run only when the call stack is empty and microtasks are drained, so setTimeout(0) is deferred, not immediate. The delay is a minimum (clamping, throttling, busy thread cause lateness). Always clear timers to avoid leaks; prefer recursive setTimeout over setInterval to prevent overlap and drift.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'setTimeout and setInterval are host-provided timer functions, not part of core JavaScript. setTimeout schedules a callback to run once after a minimum delay; setInterval runs it repeatedly at a fixed period. Both return a handle you pass to clearTimeout or clearInterval to cancel. The important mental model is that they are non-blocking and tied to the event loop: when you call them, the callback is handed to the host timer subsystem, which counts the time off the main thread and returns immediately. When the delay elapses, the callback is placed in the macrotask queue, and it runs only when the call stack is empty and the microtask queue has been drained. That is why setTimeout with a zero delay is deferred, not immediate, and why a resolved promise always runs before a 0ms timer. A key subtlety is that the delay is a minimum, not a guarantee — nested timers are clamped to about 4 milliseconds, background tabs are throttled, and a busy main thread delays everything. For repetition, recursive setTimeout is usually better than setInterval because it prevents overlapping callbacks and lets you correct for drift. And the classic gotcha is the var-in-loop bug: with var all callbacks share one binding and print the final value, while let gives each iteration its own. Finally, always clear timers on cleanup, or you leak memory and keep running stale work.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'setInterval is simple but risks overlap and drift; recursive setTimeout is more code but safer and self-correcting.',
      'Timers vs requestAnimationFrame: timers run regardless of paint, rAF syncs to the refresh rate for smooth visuals.',
      'Precise timing vs battery/perf: tighter intervals waste CPU and battery; coarser ones save power.',
    ],
    edgeCases: [
      'Nested setTimeout is clamped to ~4ms minimum after several levels of nesting.',
      'Background/inactive tabs throttle timers to ~1s or pause them entirely (page visibility).',
      'setTimeout(fn, 0) still runs after the full microtask queue, so promise chains beat it.',
      'In Node, timers vs setImmediate vs process.nextTick have distinct phase ordering.',
    ],
    runtimeBehavior: [
      'Timer callbacks are macrotasks; only one macrotask runs per loop turn, with microtasks drained between.',
      'A long synchronous callback delays all subsequent timers regardless of their delay.',
      'Node timers can keep the process alive; unref() detaches them from the event-loop refcount.',
    ],
    scalability: [
      'Thousands of active intervals create constant wakeups; consolidate into a single scheduler tick where possible.',
      'For polling at scale, prefer event-driven push (WebSocket/SSE) over many polling timers.',
    ],
    productionConcerns: [
      'Un-cleared timers are a top cause of leaks and "zombie" callbacks updating destroyed components.',
      'Drift in setInterval breaks clocks and rate windows over long uptimes — use drift correction.',
      'Tab throttling can silently slow polling; design for variable, not exact, cadence.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'setTimeout(fn, ms) = run once after ~ms.',
    'setInterval(fn, ms) = run repeatedly every ~ms until cleared.',
    'Both return a handle → clearTimeout / clearInterval.',
    'Delay is a MINIMUM, not exact.',
    'Callbacks are MACROTASKS — run when stack empty + microtasks drained.',
    'setTimeout(fn, 0) is deferred, never immediate.',
    'Nested timers clamp to ~4ms; background tabs throttle.',
    'var-in-loop bug → use let or IIFE.',
    'Recursive setTimeout > setInterval (no overlap, drift correction).',
    'Always clear timers on cleanup or you leak memory.',
    'Node: use unref() so timers do not block process exit.',
    'Use requestAnimationFrame for visual animation, not setInterval.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function that logs "tick" every second and stops itself after 3 ticks.',
      hint: 'Count ticks and clearInterval when done.',
      solution: {
        lang: 'js',
        code: `let n = 0\nconst id = setInterval(() => {\n  console.log('tick')\n  if (++n === 3) clearInterval(id)\n}, 1000)`,
        explanation: ['setInterval fires every second.', 'We count ticks and clearInterval after the third to stop it.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement a promise-based `delay(ms)` and a `timeout(promise, ms)` that rejects if the promise takes too long.',
      hint: 'Use Promise.race with a setTimeout that rejects.',
      solution: {
        lang: 'js',
        code: `const delay = (ms) => new Promise(r => setTimeout(r, ms))\n\nfunction timeout(promise, ms) {\n  const timer = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error('timed out')), ms)\n  )\n  return Promise.race([promise, timer])\n}`,
        explanation: [
          'delay resolves after ms using setTimeout.',
          'timeout races the real promise against a timer that rejects.',
          'Whichever settles first wins; if the timer wins, it rejects with a timeout error.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a throttle(fn, ms) using timers so fn runs at most once per ms window.',
      hint: 'Track whether you are in a cooldown with a timer flag.',
      solution: {
        lang: 'js',
        code: `function throttle(fn, ms) {\n  let waiting = false\n  let lastArgs = null\n  return function (...args) {\n    if (waiting) { lastArgs = args; return }\n    fn.apply(this, args)\n    waiting = true\n    setTimeout(() => {\n      waiting = false\n      if (lastArgs) { fn.apply(this, lastArgs); lastArgs = null; waiting = true; setTimeout(() => waiting = false, ms) }\n    }, ms)\n  }\n}`,
        explanation: [
          'On first call we run fn immediately and enter a cooldown.',
          'During cooldown we just remember the latest args.',
          'When the timer fires we run the trailing call if there was one, keeping at most one call per window.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Predict and explain the output: for (var i=0;i<3;i++) setTimeout(()=>console.log(i),0); Then fix it to print 0,1,2.',
      hint: 'It is a closure/scope issue.',
      solution: {
        lang: 'js',
        code: `// prints 3, 3, 3 — all share one var i (=3 after loop)\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n\n// fix with let — fresh binding per iteration → 0, 1, 2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}`,
        explanation: [
          'var is function-scoped; the single i is 3 by the time the deferred callbacks run.',
          'All three closures share that one binding, so all print 3.',
          'let creates a new block-scoped i each iteration, so each callback captures its own value.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Timers are where async, the event loop, and closures all meet in beginner-friendly code. Mastering them lets you build debounce/throttle/polling correctly and explain the event loop confidently.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the setTimeout vs setInterval difference and the var-loop output. Product companies (Zoho, Flipkart, Razorpay) ask you to implement debounce/throttle/timeout from scratch. FAANG-level interviews probe macrotask ordering, drift, throttling, and Node timer phases.',
    whatInterviewersExpect:
      'They expect you to know timers are non-blocking macrotasks, that the delay is a minimum, to explain and fix the var-loop bug, implement debounce/throttle, and remember to clear timers to avoid leaks.',
  },
}

export default timers
