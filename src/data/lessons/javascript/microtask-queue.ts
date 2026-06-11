import type { ConceptLesson } from '../../../types/lesson'

const microtaskQueue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'microtask-queue',
  name: 'Microtask Queue',
  category: 'async',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The microtask queue is the high-priority half of the event loop — promises and async/await all run here, so it governs the timing of nearly all modern async code.',
    'It is the reason a resolved promise runs before a setTimeout(0): microtasks drain completely before the next macrotask.',
    'Understanding it lets you precisely derive async ordering and explain framework behavior like Vue\'s nextTick.',
    'It explains a subtle but real production bug — microtask starvation — where an endless promise chain freezes rendering.',
    'Interviewers lean on it heavily because it separates people who memorized "promises are async" from those who understand exactly when they run.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The microtask queue is the VIP fast-pass line that must be completely empty before the next normal person gets on the ride.',
    story: [
      'Imagine a ride with a normal line and a special VIP line.',
      'The rule is: after each normal rider finishes, the operator lets EVERY VIP currently waiting go first — and if more VIPs show up while VIPs are boarding, they get added to the same group and go too.',
      'Only when the VIP line is totally empty does the next normal rider get a turn.',
      'The microtask queue is that VIP line: promise callbacks are VIPs that all get served before the next normal task (like a timer), even if new ones keep arriving.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a promise finishes, the function you gave to .then waits in a special high-priority line called the microtask queue.',
    'After the current piece of code finishes, the event loop empties this whole line before doing anything else.',
    'If running a microtask adds another microtask, that new one also runs in the same round.',
    'Because microtasks are emptied first, promise callbacks run before timers — even a timer set to 0 milliseconds.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The microtask queue is a high-priority FIFO queue for callbacks from promise reactions (.then/.catch/.finally), await continuations, queueMicrotask, and MutationObserver. It is fully drained after each macrotask and after the synchronous script.',
    how: 'When a promise settles, its reaction is enqueued as a microtask. At each microtask checkpoint, the loop runs every microtask — including ones scheduled during draining — until the queue is empty, before any macrotask or rendering.',
    why: 'Microtasks let promise-based code complete its follow-up work as soon as possible, before yielding to timers or rendering, giving predictable, immediate-ish continuation.',
    code: {
      label: 'Microtasks beat macrotasks',
      lang: 'js',
      code: `console.log('1')\nsetTimeout(() => console.log('2 (macro)'), 0)\nPromise.resolve().then(() => console.log('3 (micro)'))\nconsole.log('4')\n// 1, 4, 3 (micro), 2 (macro)`,
      explanation: [
        '"1" and "4" run synchronously first.',
        'setTimeout schedules a MACROtask ("2").',
        'Promise.then schedules a MICROtask ("3").',
        'After sync code, the microtask queue drains first → "3".',
        'Only then does the macrotask run → "2".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The microtask queue is a FIFO queue of microtasks processed at each microtask checkpoint: after the currently running script or task completes and the call stack empties. Microtask sources include promise reactions (.then/.catch/.finally), the continuation of an awaited async function, queueMicrotask, and MutationObserver callbacks. The checkpoint drains the queue completely — including microtasks enqueued during the drain — before the event loop proceeds to rendering or the next macrotask. This guarantees microtasks run before any macrotask and before paint, but also means an unbounded microtask chain can starve rendering and tasks.',

  // 7. Internal Working
  internalWorking: [
    'When a promise settles (resolve/reject), the engine schedules its registered reactions as microtasks rather than running them synchronously.',
    'An await expression suspends the async function and schedules its continuation as a microtask when the awaited value settles.',
    'After the synchronous script finishes (and after each macrotask), the event loop reaches a microtask checkpoint.',
    'At the checkpoint, the loop runs microtasks one by one; any microtask that schedules another microtask appends to the same queue, which is also processed now.',
    'The checkpoint ends only when the microtask queue is completely empty.',
    'Only then does the loop continue to rendering (browser) or dequeue the next macrotask — so microtasks always precede both.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   promise settles / await resumes / queueMicrotask
                       │ enqueue
                       ▼
              [ MICROTASK QUEUE ]  m1 → m2 → m3
                       │  drained COMPLETELY at each checkpoint
                       ▼  (new microtasks added here run NOW too)
   ... after sync code / after each macrotask ...
        drain ALL microtasks ──► then render ──► then next macrotask`,

  // 9. Memory Visualization
  memoryVisualization: [
    'QUEUE: holds promise reaction callbacks and their captured closures until the next checkpoint drains them.',
    'HEAP: a pending microtask keeps its captured values (resolved data, surrounding scope) reachable until it runs.',
    'A long or infinite microtask chain keeps allocating callbacks faster than they can be released, and blocks GC pauses/rendering.',
    'Because microtasks drain fully, transient promise chains are short-lived in memory, but recursive chains can grow without bound.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — queueMicrotask vs setTimeout',
      lang: 'js',
      code: `console.log('start')\nsetTimeout(() => console.log('timeout'), 0)\nqueueMicrotask(() => console.log('microtask'))\nconsole.log('end')\n// start, end, microtask, timeout`,
      explanation: [
        'start and end run synchronously.',
        'queueMicrotask schedules a microtask.',
        'After sync code, microtasks drain → "microtask".',
        'Then the macrotask (timeout) runs. Microtask always wins over the timer.',
      ],
    },
    intermediate: {
      label: 'Intermediate — chained microtasks all run before any macrotask',
      lang: 'js',
      code: `setTimeout(() => console.log('macro'), 0)\nPromise.resolve()\n  .then(() => console.log('then 1'))\n  .then(() => console.log('then 2'))\n  .then(() => console.log('then 3'))\n// then 1, then 2, then 3, macro`,
      explanation: [
        'Each .then schedules a microtask; resolving one schedules the next.',
        'The microtask checkpoint keeps draining as new microtasks appear.',
        'So then 1, 2, and 3 all run before the macrotask.',
        'This shows microtasks scheduled during draining run in the same pass.',
      ],
    },
    advanced: {
      label: 'Advanced — await continuation is a microtask',
      lang: 'js',
      code: `async function f() {\n  console.log('f: before await')\n  await Promise.resolve()\n  console.log('f: after await')   // microtask continuation\n}\nconsole.log('script start')\nf()\nPromise.resolve().then(() => console.log('outer then'))\nconsole.log('script end')\n// script start, f: before await, script end, f: after await, outer then`,
      explanation: [
        'Code up to the first await runs synchronously: "f: before await".',
        'await schedules the continuation ("f: after await") as a microtask.',
        '"script end" runs synchronously next.',
        'Microtasks drain in enqueue order: f\'s continuation, then the outer .then.',
      ],
    },
    realProject: {
      label: 'Real project — Vue nextTick uses a microtask',
      lang: 'js',
      code: `// Vue batches DOM updates and flushes them in a microtask\nstate.count++          // schedules a re-render (microtask)\nconsole.log(el.textContent) // still OLD value (DOM not patched yet)\n\nawait nextTick()        // wait for the microtask flush\nconsole.log(el.textContent) // NEW value (DOM updated)`,
      explanation: [
        'Reactive changes queue a flush as a microtask, so the DOM is not patched synchronously.',
        'Reading the DOM immediately still shows the old value.',
        'nextTick resolves after the microtask flush, so reading after it sees the updated DOM.',
        'This is why frameworks expose nextTick — to read DOM after the microtask-driven update.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the microtask queue and what goes in it?',
      answer: 'A high-priority FIFO queue for promise reactions (.then/.catch/.finally), await continuations, queueMicrotask, and MutationObserver callbacks. It is drained completely after each macrotask and after the synchronous script.',
      explanation: 'Naming the sources and the drain-completely rule is the core of a strong answer.',
    },
    {
      level: 'intermediate',
      question: 'Why do microtasks run before macrotasks?',
      answer: 'Because after each macrotask (and the initial script) the event loop performs a microtask checkpoint that fully drains the microtask queue before moving on to rendering or the next macrotask.',
      explanation: 'The checkpoint-drains-fully mechanic is the precise reason.',
    },
    {
      level: 'intermediate',
      question: 'Where does the continuation after `await` run?',
      answer: 'As a microtask. Code before the first await runs synchronously; everything after await is scheduled on the microtask queue when the awaited promise settles.',
      explanation: 'Mapping async/await onto microtasks is essential for ordering questions.',
    },
    {
      level: 'advanced',
      question: 'What is microtask starvation?',
      answer: 'When microtasks keep scheduling more microtasks indefinitely (e.g. recursive .then or queueMicrotask), the checkpoint never empties, so the loop never reaches rendering or the next macrotask. The UI freezes and timers never fire.',
      explanation: 'Recognizing starvation and its consequence (no render/macrotask) shows depth.',
    },
    {
      level: 'advanced',
      question: 'How do queueMicrotask and Promise.resolve().then differ?',
      answer: 'Both enqueue a microtask. queueMicrotask is a direct, explicit API with no promise allocation or error-to-rejection wrapping, so it is slightly lighter and clearer when you just need to defer to the microtask checkpoint without promise semantics.',
      explanation: 'Knowing queueMicrotask exists and why to use it is a senior-leaning detail.',
    },
    {
      level: 'senior',
      question: 'How do microtasks differ in Node, and where does process.nextTick fit?',
      answer: 'In Node, process.nextTick callbacks run before the promise microtask queue at each checkpoint — effectively a higher-priority microtask. Overusing nextTick can starve the event loop just like microtasks, so it must be bounded.',
      explanation: 'Distinguishing nextTick priority from promise microtasks is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a microtask and a macrotask?',
    'Why does Vue use a microtask for nextTick and what would change with a macrotask?',
    'What is process.nextTick and how does it relate to microtasks in Node?',
    'How can microtask starvation freeze the UI, and how do you avoid it?',
    'When would you choose queueMicrotask over setTimeout(0)?',
    'Do microtasks run before or after requestAnimationFrame?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting setTimeout(0) to run before a pending promise callback.',
      why: 'Microtasks (promises) drain entirely before any macrotask (timer).',
      fix: 'Remember the order: sync → all microtasks → one macrotask.',
    },
    {
      mistake: 'Reading the DOM immediately after a reactive state change in Vue/React.',
      why: 'The update is flushed in a microtask, so the DOM is not patched synchronously.',
      fix: 'await nextTick (Vue) or use effects/refs (React) to read after the flush.',
    },
    {
      mistake: 'Creating an unbounded recursive microtask chain.',
      why: 'The checkpoint never empties, starving rendering and macrotasks (frozen UI, timers never fire).',
      fix: 'Break the chain across macrotasks (setTimeout) so the loop can render and run tasks.',
    },
    {
      mistake: 'Assuming await yields to timers/rendering.',
      why: 'await schedules a microtask, which runs before any macrotask or paint.',
      fix: 'To actually yield to rendering, schedule a macrotask (setTimeout / MessageChannel).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'nextTick and the reactivity flush use microtasks so DOM updates are batched and applied before the next paint; read DOM after nextTick.' },
    { area: 'React', detail: 'Promise-based effects and act() in tests rely on microtask draining; understanding it explains why state reads after await see updated values.' },
    { area: 'Node.js', detail: 'Promise microtasks plus the higher-priority process.nextTick govern callback ordering between phases; overusing nextTick starves I/O.' },
    { area: 'Backend', detail: 'Promise-heavy pipelines complete their continuations in microtasks before yielding to I/O; unbounded chains can delay request handling.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Microtasks complete follow-up work immediately after the current task, minimizing latency for promise chains.',
      'Batching DOM updates into one microtask flush (Vue) avoids redundant reflows.',
    ],
    bad: [
      'Unbounded microtask chains starve rendering and macrotasks, freezing the UI.',
      'Excessive promise allocation for trivial deferral adds overhead vs queueMicrotask.',
    ],
    optimizations: [
      'Use queueMicrotask for lightweight deferral instead of Promise.resolve().then.',
      'Break long work into macrotasks (setTimeout / MessageChannel) so the loop can render.',
      'Avoid recursive self-scheduling microtasks; cap chain depth or switch to tasks.',
      'In Node, bound process.nextTick usage to prevent I/O starvation.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'promises', 'async-await', 'sync-vs-async'],
    nextConcepts: ['macrotask-queue', 'promise-combinators', 'event-loop-starvation', 'async-error-handling'],
    dependencyNote:
      'The microtask queue is the high-priority half of the event-loop tick rule and the runtime home of promises and async/await. It builds on the event loop and promises, and contrasts with the macrotask queue; understanding both explains all async ordering.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a queue labeled MICROTASK QUEUE next to the MACROTASK QUEUE.',
      'List microtask sources: promise .then/.catch/.finally, await continuation, queueMicrotask, MutationObserver.',
      'Write the rule: after sync code and after each macrotask, drain ALL microtasks (including new ones).',
      'Run a setTimeout + chained .then example to show all thens finish before the timer.',
      'Say: "Microtasks are higher priority and drain completely before any macrotask or paint — that is why promises beat timers and why an endless chain starves the UI."',
    ],
    diagram: `   promises / await / queueMicrotask ──► [ m1 | m2 | m3 ]
                                              │ drain ALL (even new ones)
   after sync & after each macrotask ─────────┘
        ... then render ... then next macrotask`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The microtask queue holds promise reactions, await continuations, queueMicrotask, and MutationObserver callbacks. It is fully drained at each checkpoint — after the sync script and after every macrotask — including microtasks scheduled during the drain, before any rendering or macrotask. That is why a resolved promise beats setTimeout(0), and why await\'s continuation runs as a microtask. The danger is starvation: an endless microtask chain blocks rendering and timers, freezing the UI.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The microtask queue is the high-priority queue in the event loop, and it is where almost all modern async work lands. Its sources are promise reactions — the callbacks in .then, .catch, and .finally — the continuation of an async function after an await, queueMicrotask, and MutationObserver callbacks. The defining rule is the microtask checkpoint: after the synchronous script finishes, and again after every single macrotask, the event loop drains the entire microtask queue before doing anything else. Crucially, if a microtask schedules another microtask while the queue is being drained, that new one also runs in the same pass — the checkpoint only ends when the queue is completely empty. This is exactly why a resolved promise callback runs before a setTimeout with zero delay: the timer callback is a macrotask, and all microtasks drain first. It is also why the code after an await runs as a microtask, so it executes before any timer but after the current synchronous code. Frameworks lean on this: Vue flushes DOM updates in a microtask, which is why you await nextTick to read the updated DOM. The big risk is microtask starvation — if you recursively schedule microtasks forever, the loop never reaches rendering or the next macrotask, and the UI freezes while timers never fire. To genuinely yield to rendering you must schedule a macrotask instead.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Microtasks give lowest-latency continuation but can starve rendering; macrotasks yield to paint but add latency.',
      'queueMicrotask is lighter than Promise.resolve().then but lacks promise chaining/error semantics.',
      'Batching updates into a microtask flush reduces reflows but defers visible changes by a checkpoint.',
    ],
    edgeCases: [
      'Microtasks scheduled during draining run in the same pass — recursive chains never yield.',
      'await on an already-resolved value still defers to a microtask, surprising intuitive ordering.',
      'In Node, process.nextTick runs before the promise microtask queue, a separate higher-priority phase.',
      'MutationObserver callbacks are microtasks, so DOM-mutation reactions run before paint.',
    ],
    runtimeBehavior: [
      'The checkpoint drains until empty; there is no fairness cap, so a tight loop blocks everything.',
      'Unhandled rejections are detected after the microtask completes, affecting error timing.',
      'requestAnimationFrame runs in the render step after microtasks, not within the microtask queue.',
    ],
    scalability: [
      'Promise-heavy server pipelines complete continuations before yielding to I/O; unbounded chains delay request throughput.',
      'In Node, unbounded process.nextTick or microtask recursion starves the poll phase, stalling I/O.',
    ],
    productionConcerns: [
      'Microtask starvation causes UI hangs that do not show as obvious CPU spikes — hard to diagnose.',
      'Subtle ordering bugs arise when mixing nextTick, promises, and timers in Node.',
      'Reading the DOM before the microtask flush yields stale values — a common framework gotcha.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Microtask queue = high-priority FIFO.',
    'Sources: Promise .then/.catch/.finally, await continuation, queueMicrotask, MutationObserver.',
    'Drained FULLY after sync script and after EACH macrotask.',
    'Microtasks scheduled during draining run in the same pass.',
    'Runs before any macrotask and before paint.',
    'Resolved promise beats setTimeout(0).',
    'await continuation = a microtask.',
    'Vue nextTick = microtask flush → await it to read updated DOM.',
    'Endless microtask chain → starvation → frozen UI, no timers.',
    'queueMicrotask = lighter than Promise.resolve().then.',
    'Node: process.nextTick runs before promise microtasks.',
    'To yield to rendering, use a MACROtask, not a microtask.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict: console.log("a"); queueMicrotask(()=>console.log("b")); console.log("c");',
      hint: 'queueMicrotask defers to the microtask checkpoint.',
      solution: {
        lang: 'js',
        code: `console.log('a')\nqueueMicrotask(() => console.log('b'))\nconsole.log('c')\n// a, c, b`,
        explanation: ['a and c are synchronous.', 'b runs at the microtask checkpoint after the sync code.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show that three chained .then callbacks all run before a setTimeout(0).',
      hint: 'Chain thens and add a timer.',
      solution: {
        lang: 'js',
        code: `setTimeout(() => console.log('macro'), 0)\nPromise.resolve()\n  .then(() => console.log('t1'))\n  .then(() => console.log('t2'))\n  .then(() => console.log('t3'))\n// t1, t2, t3, macro`,
        explanation: [
          'Each then schedules the next as a microtask.',
          'The checkpoint keeps draining the newly added microtasks.',
          'All three run before the macrotask timer fires.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate microtask starvation and then fix it so a setTimeout can still fire.',
      hint: 'Recursive queueMicrotask never yields; switch to setTimeout to yield.',
      solution: {
        lang: 'js',
        code: `// STARVATION: timer never fires\nsetTimeout(() => console.log('I never run'), 0)\nfunction loop(n) {\n  if (n <= 0) return\n  queueMicrotask(() => loop(n - 1)) // infinite-ish microtasks\n}\n// loop(Infinity) // would starve forever\n\n// FIX: yield via macrotask so the timer and render can run\nfunction loopYielding(n) {\n  if (n <= 0) return\n  setTimeout(() => loopYielding(n - 1), 0)\n}`,
        explanation: [
          'A recursive queueMicrotask keeps the checkpoint busy, so the timer macrotask never runs.',
          'Switching to setTimeout schedules macrotasks, letting microtasks drain and the loop reach the timer and rendering.',
          'Use macrotasks to yield when you must let the UI or timers proceed.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write code mixing sync, await, .then, and setTimeout, then derive the exact output step by step.',
      hint: 'sync first, then microtasks (await continuation + thens) in order, then the timer.',
      solution: {
        lang: 'js',
        code: `async function main() {\n  console.log('A')\n  await Promise.resolve()\n  console.log('C')\n}\nconsole.log('start')\nsetTimeout(() => console.log('E'), 0)\nmain()\nPromise.resolve().then(() => console.log('D'))\nconsole.log('B')\n// start, A, B, C, D, E`,
        explanation: [
          'Sync: start; main runs to await → A; then B (after main suspends).',
          'Microtasks drain in order: main\'s continuation C, then the outer then D.',
          'Macrotask: the timer E runs last after all microtasks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The microtask queue is where promises and async/await actually run, so it controls the timing of most modern code. Mastering it lets you derive any async ordering and explain framework behavior and subtle freezes.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask why a promise runs before setTimeout. Product companies (Zoho, Flipkart, Razorpay) give chained-promise + timer ordering puzzles and ask about nextTick. FAANG-level interviews probe starvation, queueMicrotask vs then, and Node process.nextTick priority.',
    whatInterviewersExpect:
      'They expect you to name microtask sources, explain the full-drain checkpoint, place await continuations as microtasks, derive mixed ordering, and discuss starvation plus the macrotask-to-yield fix.',
  },
}

export default microtaskQueue
