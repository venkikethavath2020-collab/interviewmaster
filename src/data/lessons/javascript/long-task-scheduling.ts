import type { ConceptLesson } from '../../../types/lesson'

const longTaskScheduling: ConceptLesson = {
  // 1. Concept Summary
  slug: 'long-task-scheduling',
  name: 'Long Tasks & Scheduling',
  category: 'performance',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'A "long task" (any main-thread block over 50ms) freezes the whole page — clicks, scroll, and animation all stall — and is the #1 cause of poor responsiveness metrics like INP.',
    'The main thread does everything: events, layout, paint, and your JS; one long synchronous loop and the UI becomes unresponsive even if nothing visibly changes.',
    'Scheduling — breaking work into chunks and yielding to the browser — is how senior engineers keep apps smooth without moving everything to workers.',
    'Interviewers ask it to test deep understanding of the event loop, the frame budget, and the modern scheduling toolbox (yield, requestIdleCallback, scheduler.postTask, isInputPending).',
    'Getting it wrong ships janky pages that fail Core Web Vitals (INP/TBT), hurting SEO and conversions — a measurable business cost.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Long-task scheduling is like a chef who chops a huge pile of vegetables a little at a time, pausing to take customer orders, instead of vanishing into the kitchen for an hour.',
    story: [
      'Imagine one chef who is also the waiter. If a giant order comes in and the chef cooks it all at once without stopping, the customers at the counter are completely ignored — they cannot even ask for a glass of water.',
      'A smart chef cooks a little, then pops out to check on customers, then cooks a little more, then checks again.',
      'The customers stay happy because they are never ignored for long, even though the big order still gets done.',
      'Scheduling is teaching the browser-chef to cook in small bites and keep checking on the user, so the page never freezes during big work.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'The browser has one main worker that handles everything on the page: your code, drawing, and responding to clicks.',
    'If your code runs for too long without stopping, that worker cannot do anything else — the page feels frozen.',
    'A "long task" is any chunk of work that holds the main thread for more than about 50 milliseconds.',
    'Scheduling means splitting big work into small pieces and giving the browser tiny breaks in between, so it can respond to the user and keep things smooth.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A long task is any synchronous block of work on the main thread lasting over ~50ms, during which the browser cannot respond to input or paint. Long-task scheduling is the practice of splitting such work into small chunks and yielding control back to the browser between them, using APIs like setTimeout, await, requestIdleCallback, or scheduler.postTask/scheduler.yield.',
    how: 'Instead of looping over 100k items in one go, you process a batch, then yield (e.g. await a scheduler.yield() or a 0ms timeout) so the browser can handle events and paint, then continue. Idle/priority APIs let you run low-priority work only when there is spare time.',
    why: 'It keeps the main thread responsive: the UI stays interactive and animations stay smooth even while heavy work is in progress, directly improving responsiveness metrics like INP and TBT.',
    code: {
      label: 'Chunked processing that yields to the browser',
      lang: 'js',
      code: `async function processAll(items, handle) {\n  const BATCH = 500\n  for (let i = 0; i < items.length; i++) {\n    handle(items[i])\n    // every BATCH items, yield so the browser can paint/respond\n    if (i % BATCH === 0) await yieldToMain()\n  }\n}\n\nfunction yieldToMain() {\n  // scheduler.yield() where available; fallback to a 0ms task\n  if ('scheduler' in window && 'yield' in scheduler) return scheduler.yield()\n  return new Promise((r) => setTimeout(r, 0))\n}`,
      explanation: [
        'We process items in batches of 500 instead of all at once.',
        'After each batch we await yieldToMain(), handing control back to the event loop.',
        'During that yield the browser can handle clicks, run other tasks, and paint a frame — no freeze.',
        'scheduler.yield() is the modern, efficient way to yield; setTimeout(0) is the universal fallback.',
        'The total work is the same, but it is spread across many short tasks instead of one long one.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A long task is a contiguous period during which the main thread is busy for 50ms or more, blocking input handling and rendering; the browser surfaces them via the Long Tasks API (PerformanceObserver "longtask") and they drive Total Blocking Time and Interaction to Next Paint. Long-task scheduling decomposes blocking work into sub-50ms chunks and yields to the event loop between them, using cooperative scheduling primitives: yielding via tasks (setTimeout 0, MessageChannel) or microtasks, the prioritized Scheduler API (scheduler.postTask with user-blocking/user-visible/background priorities and scheduler.yield), requestIdleCallback for idle-time work, and navigator.scheduling.isInputPending to yield early when input is waiting.',

  // 7. Internal Working
  internalWorking: [
    'The event loop runs one task to completion before doing anything else — it cannot interrupt your synchronous code, so a long task blocks input dispatch and rendering until it finishes.',
    'Rendering (style/layout/paint) only happens between tasks; a task longer than the ~16ms frame budget delays the next paint and, over 50ms, registers as a long task.',
    'Yielding ends the current task and queues the continuation as a NEW task (or microtask), letting the loop process pending input events and render a frame before resuming.',
    'setTimeout(0)/MessageChannel schedule a macrotask (after rendering and pending events); await of a resolved promise schedules a microtask (runs before rendering, so it does NOT let the browser paint).',
    'scheduler.postTask queues work with a priority (user-blocking > user-visible > background); the scheduler interleaves them and can run high-priority work first, while requestIdleCallback runs callbacks only in leftover idle time with a deadline.',
    'navigator.scheduling.isInputPending() lets a running loop check whether input is queued and yield immediately, minimizing input latency without fixed time-slicing.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ONE LONG TASK (bad)                CHUNKED + YIELD (good)
   ┌──────────────────────────┐      ┌────┐ ┌────┐ ┌────┐ ┌────┐
   │  120ms of JS — UI FROZEN │      │40ms│ │40ms│ │40ms│ ...
   └──────────────────────────┘      └────┘ └────┘ └────┘
            no paint, no input        ▲yield  ▲yield  ▲yield
                                      paint + handle input each gap

   yield options:
     microtask (await Promise) → runs BEFORE paint (no repaint)
     task (setTimeout 0 / scheduler.yield) → AFTER paint + input`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Chunked async loops keep their iteration state in a closure across yields; that closure (and any captured large arrays) stays on the heap until the loop completes.',
    'Holding references to a huge dataset for the duration of a long chunked job keeps it alive — process in streams/slices to bound peak memory.',
    'Each scheduled continuation (timeout/postTask callback) is referenced until it runs; abandoning a job without an AbortController leaves callbacks (and captured data) reachable.',
    'requestIdleCallback callbacks are retained until idle time arrives; under sustained load they may be delayed, keeping their captured state alive longer than expected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — yield with isInputPending to stay responsive',
      lang: 'js',
      code: `async function work(items, handle) {\n  for (let i = 0; i < items.length; i++) {\n    handle(items[i])\n    // yield only when input is waiting OR every ~50ms\n    if (navigator.scheduling?.isInputPending?.()) {\n      await new Promise((r) => setTimeout(r))\n    }\n  }\n}`,
      explanation: [
        'isInputPending() asks the browser "is there a click/key waiting?"',
        'We only yield when input is pending, so we do not pay yield overhead unnecessarily.',
        'Yielding via setTimeout ends the task, letting the browser dispatch that input immediately.',
        'This minimizes input latency while still finishing the work as fast as possible.',
        'Optional chaining guards browsers that lack the API.',
      ],
    },
    intermediate: {
      label: 'Intermediate — prioritized work with the Scheduler API',
      lang: 'js',
      code: `// run urgent work first, defer the rest\nif ('scheduler' in window) {\n  scheduler.postTask(() => renderVisibleRows(), { priority: 'user-blocking' })\n  scheduler.postTask(() => prefetchNextPage(), { priority: 'background' })\n  scheduler.postTask(() => logAnalytics(), { priority: 'background' })\n} else {\n  renderVisibleRows()\n  requestIdleCallback(() => { prefetchNextPage(); logAnalytics() })\n}`,
      explanation: [
        'scheduler.postTask assigns a priority; user-blocking runs before user-visible before background.',
        'Visible rendering is urgent; prefetch and analytics are background and run when there is time.',
        'The scheduler can preempt: a newly arriving user-blocking task can jump ahead of background ones.',
        'The fallback uses requestIdleCallback for the non-urgent work on older browsers.',
        'This is cooperative prioritization without manually juggling timers.',
      ],
    },
    advanced: {
      label: 'Advanced — abortable chunked job that yields between batches',
      lang: 'js',
      code: `async function chunkedSort(rows, signal) {\n  const BATCH = 1000\n  const out = []\n  for (let i = 0; i < rows.length; i += BATCH) {\n    if (signal.aborted) throw new DOMException('aborted', 'AbortError')\n    out.push(...rows.slice(i, i + BATCH).map(transform))\n    await yieldToMain() // let the browser breathe\n  }\n  return out.sort(compare)\n}\nfunction yieldToMain() {\n  return 'scheduler' in window && scheduler.yield\n    ? scheduler.yield()\n    : new Promise((r) => setTimeout(r))\n}\n// const ctrl = new AbortController(); chunkedSort(rows, ctrl.signal); ctrl.abort()`,
      explanation: [
        'Work is split into 1000-row batches with a yield between each so the UI never freezes.',
        'An AbortSignal lets the caller cancel a long job (e.g. the user navigated away or changed filters).',
        'Checking signal.aborted at each batch boundary makes cancellation responsive.',
        'scheduler.yield() resumes with appropriate priority; setTimeout is the fallback.',
        'This is the production shape for processing large datasets on the client.',
      ],
    },
    realProject: {
      label: 'Real project — non-blocking list build in a Vue component',
      lang: 'js',
      code: `import { ref, onUnmounted } from 'vue'\n\nexport function useProgressiveList(source) {\n  const visible = ref([])\n  const ctrl = new AbortController()\n  async function build() {\n    const STEP = 200\n    for (let i = 0; i < source.length; i += STEP) {\n      if (ctrl.signal.aborted) return\n      visible.value.push(...source.slice(i, i + STEP))\n      await new Promise((r) => setTimeout(r)) // yield → paint each chunk\n    }\n  }\n  build()\n  onUnmounted(() => ctrl.abort()) // stop work if component unmounts\n  return { visible }\n}`,
      explanation: [
        'Rendering 50k rows at once causes a long task and a frozen page; we add them in chunks of 200.',
        'Yielding after each chunk lets Vue render the new rows and the browser handle input — a progressive, smooth fill.',
        'The AbortController stops the loop if the user navigates away mid-build.',
        'onUnmounted aborts so we do not keep pushing into a dead component (leak/wasted work).',
        'In React this maps to startTransition or chunked state updates with a cleanup-driven abort; React’s scheduler does cooperative yielding internally.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a "long task" and why is it bad?',
      answer: 'A long task is any work that blocks the main thread for 50ms or more. It is bad because while it runs the browser cannot respond to clicks, scroll, or paint — the page feels frozen, hurting responsiveness metrics like INP and TBT.',
      explanation: 'The signal is "blocks main thread > 50ms → frozen UI" and naming a metric (INP/TBT).',
    },
    {
      level: 'beginner',
      question: 'How can you break up a long task so the UI stays responsive?',
      answer: 'Split the work into smaller chunks and yield to the browser between them — for example process a batch, then await a setTimeout(0) or scheduler.yield(), then continue. The total work is unchanged but spread across many short tasks the browser can interleave with input and rendering.',
      explanation: 'Chunk + yield is the core technique; mentioning a concrete yield mechanism matters.',
    },
    {
      level: 'intermediate',
      question: 'Why does awaiting a resolved promise (microtask) NOT let the browser paint, but setTimeout(0) does?',
      answer: 'Microtasks run at the end of the current task, before rendering, so the browser still cannot paint between them. setTimeout(0) schedules a new macrotask, which runs after the browser has had a chance to render and process input. So to actually unblock painting you must yield with a task, not just a microtask.',
      explanation: 'The microtask-vs-macrotask-and-rendering distinction is the key intermediate insight and a common trap.',
    },
    {
      level: 'intermediate',
      question: 'What is requestIdleCallback for, and how is it different from yielding?',
      answer: 'requestIdleCallback runs low-priority work during the browser’s idle time at the end of a frame, giving you a deadline (timeRemaining). It is for non-urgent background work (analytics, prefetch, cleanup), whereas yielding is about cooperatively breaking up urgent work so it does not block. Idle work may be delayed indefinitely under load, so it takes a timeout option.',
      explanation: 'Knowing idle work = low priority/leftover time vs yielding = cooperative chunking shows real understanding.',
    },
    {
      level: 'advanced',
      question: 'How does the Scheduler API (scheduler.postTask / scheduler.yield) improve on setTimeout-based scheduling?',
      answer: 'It provides explicit priorities (user-blocking, user-visible, background) so the browser runs urgent work first and defers background work, and scheduler.yield resumes the same task at the right priority instead of going to the back of the timer queue. It also integrates with the browser’s prioritization and supports abort signals — far more precise than manual setTimeout time-slicing.',
      explanation: 'Senior signal: priorities, yield-with-continuation semantics, and integration vs hand-rolled timers.',
    },
    {
      level: 'senior',
      question: 'How do you decide between yielding/scheduling on the main thread and offloading to a Web Worker?',
      answer: 'If the work needs the DOM or is moderate, chunk-and-yield on the main thread to keep it responsive. If it is heavy, pure computation (parsing, crypto, big data) with no DOM needs, offload to a Web Worker so it runs truly in parallel and never touches the main thread at all. Yielding shares one thread cooperatively; workers add a real thread but pay message-passing cost. Often you combine: worker for compute, main-thread scheduling for DOM application.',
      explanation: 'The cooperative-single-thread vs true-parallel tradeoff, and combining both, is the senior-level answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you measure long tasks in production? (PerformanceObserver "longtask", INP, TBT)',
    'What is the difference between yielding with a microtask and a macrotask?',
    'When would you use requestIdleCallback vs scheduler.postTask?',
    'How does navigator.scheduling.isInputPending reduce input latency?',
    'How do React (startTransition/Scheduler) and Vue handle cooperative scheduling internally?',
    'How do you make a long chunked job cancellable?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Yielding only with await Promise (a microtask) and expecting the UI to repaint.',
      why: 'Microtasks run before rendering, so the browser still cannot paint or dispatch input between them — the page stays frozen.',
      fix: 'Yield with a task (setTimeout 0, MessageChannel, or scheduler.yield) to actually let the browser render and handle input.',
    },
    {
      mistake: 'Doing all heavy work synchronously in one event handler or effect.',
      why: 'It produces a long task that blocks input/paint, tanking INP/TBT and freezing the page.',
      fix: 'Chunk the work and yield, schedule by priority, or offload to a Web Worker.',
    },
    {
      mistake: 'Using requestIdleCallback for urgent work.',
      why: 'Idle callbacks run only in spare time and can be starved indefinitely under load, delaying important updates.',
      fix: 'Use idle callbacks only for low-priority background work; use yield/postTask(user-blocking) for urgent work.',
    },
    {
      mistake: 'Not making long jobs cancellable.',
      why: 'A job keeps running (and updating state) after the user navigates away or changes inputs, wasting CPU and risking stale updates.',
      fix: 'Thread an AbortSignal through the loop and check it at each chunk boundary; abort on unmount.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Progressively rendering large lists/tables by chunking pushes with yields; deferring non-critical setup with requestIdleCallback; aborting chunked jobs on scope dispose to keep INP healthy.' },
    { area: 'React', detail: 'React’s concurrent scheduler time-slices rendering; startTransition marks non-urgent updates so urgent input stays responsive, and useDeferredValue defers expensive derived work — the same long-task principles built into the framework.' },
    { area: 'Node.js', detail: 'On the server the analog is not blocking the event loop: chunk CPU-bound loops with setImmediate, use streams, or move heavy work to worker_threads so request handling stays responsive.' },
    { area: 'Backend', detail: 'Cooperative yielding (setImmediate/queueMicrotask balance) keeps the event loop free for I/O; long synchronous CPU work is offloaded to worker pools or external services to avoid blocking concurrent requests.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Chunking + yielding keeps INP low and TBT small, so the page feels responsive even during heavy work.',
      'Priority scheduling runs user-blocking work first, so interactions feel instant while background work waits.',
      'isInputPending-driven yielding minimizes input latency without arbitrary time slicing.',
    ],
    bad: [
      'Yielding too often adds task-scheduling overhead and slows total completion.',
      'Microtask-only yielding gives the illusion of yielding but never lets the browser paint.',
      'Idle work can be starved under sustained load, delaying important deferred tasks.',
    ],
    optimizations: [
      'Yield with tasks (scheduler.yield/setTimeout), and only when needed (isInputPending or every ~50ms).',
      'Use scheduler.postTask priorities to order work instead of hand-rolled timers.',
      'Offload pure computation to Web Workers; reserve main-thread scheduling for DOM-bound work.',
      'Measure with the Long Tasks API and INP, and abort jobs that are no longer needed.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'macrotask-queue', 'microtask-queue', 'timers', 'concurrency-patterns'],
    nextConcepts: ['web-workers', 'requestanimationframe', 'core-web-vitals', 'list-virtualization'],
    dependencyNote:
      'Long-task scheduling is applied event-loop knowledge: you must understand tasks vs microtasks and when rendering happens. It pairs with requestAnimationFrame (visual work), Web Workers (offloading compute), list virtualization (avoiding the work entirely), and is measured by Core Web Vitals (INP/TBT).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw one long bar of 120ms labelled "UI frozen — no paint, no input".',
      'Beside it draw four short bars with gaps labelled "yield → paint + input".',
      'Say: "A long task is >50ms on the main thread; we split work and yield between chunks."',
      'Note the trap: microtask (await Promise) runs before paint → does NOT unfreeze; use a task (setTimeout 0 / scheduler.yield).',
      'Add priorities: scheduler.postTask(user-blocking) for urgent, requestIdleCallback for background.',
      'Close with: heavy pure compute → Web Worker; measure with Long Tasks API / INP.',
    ],
    diagram: `  BAD:  [ 120ms JS — frozen ]            no paint/input
  GOOD: [40] yield [40] yield [40]       paint+input in each gap

  yield kinds:
    microtask (await) → before paint (NO repaint)
    task (setTimeout0 / scheduler.yield) → after paint+input
  priorities: user-blocking > user-visible > background`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A long task blocks the main thread for >50ms, freezing input and paint and wrecking INP/TBT. The fix is scheduling: split work into sub-50ms chunks and yield to the browser between them. Yield with a TASK (setTimeout 0 / scheduler.yield), not just a microtask (await Promise runs before paint, so it does not unfreeze). Use scheduler.postTask priorities for urgent vs background work, requestIdleCallback for spare-time work, and isInputPending to yield exactly when input waits. For heavy pure compute, offload to a Web Worker instead. Make long jobs abortable and measure with the Long Tasks API.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A long task is any synchronous work that holds the main thread for 50 milliseconds or more. Because the event loop runs one task to completion and can only paint or dispatch input between tasks, a long task freezes the page — clicks queue up, scroll stutters, animations stall — and it shows up as poor Total Blocking Time and Interaction to Next Paint. The core technique to fix it is cooperative scheduling: I break the work into chunks small enough to stay under the budget and yield control back to the browser between them. A crucial subtlety is how I yield. Awaiting a resolved promise only schedules a microtask, which runs at the end of the current task before rendering — so it does NOT let the browser paint. To actually unblock the UI I yield with a task: setTimeout(0), a MessageChannel, or, best, scheduler.yield(), which resumes my work at the right priority. Beyond simple chunking I reach for the Scheduler API: scheduler.postTask lets me assign priorities — user-blocking for urgent updates, background for prefetch and analytics — so the browser runs the important work first. requestIdleCallback runs low-priority work only in spare time, and navigator.scheduling.isInputPending lets a loop yield exactly when input is waiting, minimizing latency. When the work is heavy pure computation with no DOM needs, I skip main-thread scheduling entirely and offload to a Web Worker for real parallelism. And I always make long jobs abortable with an AbortSignal so I can cancel on navigation or unmount, and I measure long tasks in production with the PerformanceObserver longtask entry and INP.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Chunk-and-yield on the main thread (keeps DOM access, cooperative, slower total) vs Web Worker offload (true parallel, no DOM, message-passing cost).',
      'Yield frequency: yield often (responsive, more overhead, slower completion) vs yield rarely (faster total, riskier long tasks).',
      'Scheduler API priorities (precise, newer/limited support) vs hand-rolled setTimeout slicing (universal, blunt).',
    ],
    edgeCases: [
      'Microtask yielding never lets the browser paint — a frequent and subtle mistake.',
      'requestIdleCallback can be starved indefinitely under sustained load; always pass a timeout.',
      'isInputPending is not universally supported; needs a fallback time-based yield.',
      'Background-tab throttling stretches timer-based yields, changing chunk pacing.',
    ],
    runtimeBehavior: [
      'Rendering happens between tasks, not between microtasks; that boundary dictates which yield actually unfreezes the UI.',
      'scheduler.yield resumes as a continuation with its task’s priority, unlike setTimeout which appends to the timer queue.',
      'The Long Tasks API reports tasks ≥50ms with attribution, and the newer Long Animation Frames API gives richer per-frame detail.',
    ],
    scalability: [
      'For very large datasets, prefer avoiding the work (virtualization, pagination, server-side processing) over chunking it.',
      'Combine workers (compute) with main-thread scheduling (DOM application) to scale both throughput and responsiveness.',
      'Bound peak memory by streaming/slicing data rather than holding the whole dataset across a long chunked job.',
    ],
    productionConcerns: [
      'Instrument INP and long tasks with field data (web-vitals, PerformanceObserver) and set budgets/alerts.',
      'Make long jobs cancellable (AbortSignal) and abort on route change/unmount to avoid stale updates and waste.',
      'Feature-detect scheduler/isInputPending/requestIdleCallback and provide setTimeout fallbacks for broad support.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Long task = main thread blocked ≥50ms → frozen UI.',
    'Hurts INP and TBT (Core Web Vitals / responsiveness).',
    'Fix = chunk work + yield to the browser between chunks.',
    'Yield with a TASK (setTimeout 0 / scheduler.yield), NOT a microtask.',
    'Microtask (await Promise) runs before paint → does NOT unfreeze.',
    'scheduler.postTask: user-blocking > user-visible > background.',
    'scheduler.yield resumes at the right priority.',
    'requestIdleCallback = low-priority, spare-time work (pass a timeout).',
    'isInputPending() → yield exactly when input waits.',
    'Heavy pure compute → Web Worker (true parallel, no DOM).',
    'Make long jobs abortable; abort on unmount.',
    'Measure with PerformanceObserver "longtask" + INP.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Process a large array without freezing the UI by yielding every 1000 items.',
      hint: 'Use an async loop and await a 0ms timeout (a task) periodically.',
      solution: {
        lang: 'js',
        code: `async function process(items, handle) {\n  for (let i = 0; i < items.length; i++) {\n    handle(items[i])\n    if (i % 1000 === 999) await new Promise((r) => setTimeout(r))\n  }\n}`,
        explanation: [
          'We process items, yielding every 1000 with a 0ms setTimeout (a macrotask).',
          'Yielding as a task lets the browser paint and handle input between batches.',
          'A microtask (await Promise.resolve()) would NOT let it paint — the task yield is intentional.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a yieldToMain() helper that uses scheduler.yield when available and falls back to setTimeout.',
      hint: 'Feature-detect window.scheduler and its yield method.',
      solution: {
        lang: 'js',
        code: `function yieldToMain() {\n  if (typeof scheduler !== 'undefined' && scheduler.yield) {\n    return scheduler.yield()\n  }\n  return new Promise((resolve) => setTimeout(resolve, 0))\n}\n// usage: await yieldToMain() between chunks`,
        explanation: [
          'scheduler.yield() is the modern primitive: it ends the task and resumes at the right priority.',
          'The setTimeout fallback yields as a macrotask in browsers without the Scheduler API.',
          'Both let the browser render and process input before resuming.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a cancellable chunked job that yields between batches and throws AbortError when cancelled.',
      hint: 'Thread an AbortSignal; check signal.aborted at each batch boundary.',
      solution: {
        lang: 'js',
        code: `async function runChunked(items, handle, signal, batch = 500) {\n  for (let i = 0; i < items.length; i += batch) {\n    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')\n    for (let j = i; j < Math.min(i + batch, items.length); j++) handle(items[j])\n    await yieldToMain()\n  }\n}\nfunction yieldToMain() {\n  return typeof scheduler !== 'undefined' && scheduler.yield\n    ? scheduler.yield() : new Promise((r) => setTimeout(r))\n}\n// const c = new AbortController(); runChunked(data, fn, c.signal); c.abort()`,
        explanation: [
          'Work runs in batches with a yield between each, keeping tasks short.',
          'We check signal.aborted at every batch boundary so cancellation is responsive.',
          'Throwing AbortError lets the caller distinguish cancellation from real errors.',
          'This is the standard production pattern for big client-side jobs.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Schedule three pieces of work — render visible UI (urgent), prefetch next page (background), and log analytics (background) — using the Scheduler API with a graceful fallback.',
      hint: 'Use scheduler.postTask with priorities; fall back to direct call + requestIdleCallback.',
      solution: {
        lang: 'js',
        code: `function schedule({ renderUI, prefetch, logAnalytics }) {\n  if (typeof scheduler !== 'undefined' && scheduler.postTask) {\n    scheduler.postTask(renderUI, { priority: 'user-blocking' })\n    scheduler.postTask(prefetch, { priority: 'background' })\n    scheduler.postTask(logAnalytics, { priority: 'background' })\n  } else {\n    renderUI() // urgent, do now\n    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1))\n    idle(() => { prefetch(); logAnalytics() })\n  }\n}`,
        explanation: [
          'user-blocking work (render) is prioritized so interactions stay instant.',
          'background work (prefetch, analytics) is deferred and yields to urgent work automatically.',
          'The fallback runs urgent work immediately and pushes background work to idle time.',
          'requestIdleCallback is shimmed with setTimeout where unsupported.',
          'This delivers responsive UX while still completing the non-urgent work.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Long-task scheduling is where event-loop theory meets real responsiveness. Demonstrating that you can keep the main thread free — and knowing the modern scheduling toolbox — marks you as a senior engineer who ships fast, smooth apps that pass Core Web Vitals.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go deep here. Product companies (Zoho, Flipkart, Razorpay) ask how you would process a large dataset without freezing the page and to explain INP/TBT. FAANG-level interviews probe the microtask-vs-task yield distinction, the Scheduler API priorities, isInputPending, requestIdleCallback, and when to offload to a Web Worker instead.',
    whatInterviewersExpect:
      'They expect you to define a long task (>50ms), explain chunk-and-yield, correctly distinguish task vs microtask yielding (only tasks let the browser paint), name the modern scheduling APIs and their priorities, decide between scheduling and Web Workers, and mention measuring with the Long Tasks API / INP and making jobs abortable.',
  },
}

export default longTaskScheduling
