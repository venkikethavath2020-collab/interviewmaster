import type { ConceptLesson } from '../../../types/lesson'

const callStack: ConceptLesson = {
  // 1. Concept Summary
  slug: 'call-stack',
  name: 'Call Stack',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The call stack is how JavaScript keeps track of "where am I and what called me" — it is the backbone of every function call and return.',
    'It explains stack traces: the list of frames in an error IS the call stack at the moment of the throw.',
    'It explains "Maximum call stack size exceeded" (stack overflow) from runaway recursion — a classic bug and interview question.',
    'Because JS has ONE call stack, understanding it is the key to the event loop: synchronous work must finish before async callbacks run.',
    'Interviewers use it to test whether you understand single-threaded execution and why blocking the stack freezes the whole app.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The call stack is a stack of plates: you add on top and you must take from the top.',
    story: [
      'Imagine washing plates and stacking them one on top of the other. The last plate you put down is the first one you can pick up.',
      'When you start a task that needs a helper task, you put the helper plate on top and work on it first.',
      'Only when the top plate (task) is done do you remove it and go back to the plate below.',
      'JavaScript stacks function calls the same way: the newest call sits on top and must finish before the one beneath it continues.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript can only do one thing at a time, and it uses a stack to remember which function it is currently inside.',
    'When you call a function, JS puts a marker for it on top of the stack; when that function finishes, the marker is removed.',
    'If that function calls another function, the new one goes on top and runs first, then control returns down.',
    'If functions keep calling each other forever without stopping, the stack gets too tall and JavaScript stops with a "stack overflow" error.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The call stack is a LIFO (last-in, first-out) data structure the JS engine uses to track the chain of active function calls. Each call pushes a stack frame (an execution context); each return pops it.',
    how: 'When a function is invoked, its frame is pushed on top. While it runs, any function it calls is pushed above it and runs to completion first. When a function returns, its frame is popped and execution resumes in the frame now on top.',
    why: 'It gives JS a way to remember return points and local state per call, produces stack traces, and — because there is only one stack — enforces single-threaded, run-to-completion execution.',
    code: {
      label: 'Push and pop order',
      lang: 'js',
      code: "function third() { return 'done' }\nfunction second() { return third() }\nfunction first() { return second() }\n\nconsole.log(first())\n// stack grows: first -> second -> third\n// then unwinds:   third pops -> second pops -> first pops",
      explanation: [
        'Calling first() pushes a frame for first.',
        'first calls second, pushing a frame on top; second calls third, pushing another.',
        'third returns first (it is on top), so its frame pops, then second, then first.',
        'LIFO: the last function called is the first to finish and pop.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The call stack is a LIFO stack of execution contexts (stack frames) that the single-threaded JavaScript engine uses to manage function invocation and return. Invoking a function pushes a new frame containing its execution context (local bindings, this, and the return address); completing or returning pops the frame and transfers control to the caller. Because JS has exactly one call stack, code runs to completion synchronously, and asynchronous callbacks are only dispatched from the event loop once the stack is empty. Exceeding the engine\'s maximum stack depth throws a RangeError ("Maximum call stack size exceeded").',

  // 7. Internal Working
  internalWorking: [
    'At program start the engine pushes the global execution context as the bottom frame.',
    'On each function call, a new frame is created (allocating the function\'s execution context: arguments, local variables, this) and pushed onto the top of the stack.',
    'The engine always executes the topmost frame; nested calls push further frames that must complete first.',
    'When a function returns (or its end is reached), its frame is popped and control resumes in the caller\'s frame at the point after the call.',
    'A thrown error that is not caught unwinds frames off the stack until a try/catch is found or the stack empties; the captured frames form the stack trace.',
    'Only when the call stack is completely empty does the event loop push the next queued task/microtask callback onto it — this is why long synchronous work blocks async work.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  call first()           returns unwind',
    '                                       ',
    '   ┌────────┐  push      ┌────────┐  pop',
    '   │ third  │  ◄──top──  │ third  │  ──►',
    '   ├────────┤            ├────────┤',
    '   │ second │            │ second │',
    '   ├────────┤            ├────────┤',
    '   │ first  │            │ first  │',
    '   ├────────┤            ├────────┤',
    '   │ global │            │ global │',
    '   └────────┘            └────────┘',
    '   LIFO: last pushed (third) is first popped',
  ].join('\n'),

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: each frame stores the call\'s local primitives, parameters, this, and the return address; frames are fixed-size and fast to allocate/free.',
    'HEAP: objects/arrays/closures referenced by a frame live on the heap; the frame holds references, not the objects themselves.',
    'DEPTH LIMIT: the stack has a bounded size (engine/OS dependent), so unbounded recursion overflows it.',
    'When a frame pops, its local references are gone; heap objects survive only if still referenced elsewhere (e.g. by a returned closure).',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — tracing push/pop',
      lang: 'js',
      code: "function multiply(a, b) { return a * b }\nfunction square(n) { return multiply(n, n) }\nfunction printSquare(n) { console.log(square(n)) }\n\nprintSquare(4) // 16",
      explanation: [
        'printSquare(4) is pushed; it calls square(4), pushed on top.',
        'square calls multiply(4,4), pushed on top; it returns 16 and pops.',
        'square returns 16 and pops; printSquare logs 16 and pops.',
        'The order of completion is the reverse of the order of calls (LIFO).',
      ],
    },
    intermediate: {
      label: 'Intermediate — stack overflow from recursion',
      lang: 'js',
      code: "function countdown(n) {\n  // missing base case -> never stops pushing frames\n  return countdown(n - 1)\n}\n// countdown(3) // RangeError: Maximum call stack size exceeded\n\nfunction safeCountdown(n) {\n  if (n <= 0) return 'done' // base case pops the chain\n  return safeCountdown(n - 1)\n}\nconsole.log(safeCountdown(3)) // 'done'",
      explanation: [
        'Each recursive call pushes a new frame before the previous returns.',
        'Without a base case the stack grows until it exceeds the limit -> RangeError.',
        'A correct base case lets the deepest call return, so frames pop back up.',
        'This is the canonical "stack overflow" interview scenario.',
      ],
    },
    advanced: {
      label: 'Advanced — the single stack and the event loop',
      lang: 'js',
      code: "console.log('1: sync start')\nsetTimeout(() => console.log('4: timeout callback'), 0)\nPromise.resolve().then(() => console.log('3: microtask'))\nconsole.log('2: sync end')\n// order: 1, 2, 3, 4",
      explanation: [
        'The synchronous logs (1 and 2) run while the stack is busy.',
        'The Promise callback (microtask) runs after the stack empties, before timers.',
        'The setTimeout callback (macrotask) runs after microtasks, once the stack is clear.',
        'Async callbacks only run when the call stack is empty — that is why blocking the stack delays everything.',
      ],
    },
    realProject: {
      label: 'Real project — why a heavy sync loop freezes a Vue/React UI',
      lang: 'js',
      code: "// BAD: blocks the single call stack, freezing rendering and input\nfunction blockUi() {\n  const end = Date.now() + 3000\n  while (Date.now() < end) { /* spin */ }\n}\n\n// BETTER: yield so the stack clears and the UI can update\nasync function chunkedWork(items, doWork) {\n  for (const item of items) {\n    doWork(item)\n    await new Promise((r) => setTimeout(r, 0)) // let the stack empty\n  }\n}",
      explanation: [
        'The synchronous while loop keeps the single call stack occupied, so no rendering or event handling can run.',
        'In a Vue/React app this manifests as a frozen, unresponsive UI.',
        'Yielding with await/setTimeout lets the stack empty so the event loop can process render and input.',
        'Understanding the single stack is the key to keeping UIs responsive.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the call stack?',
      answer: 'A LIFO data structure the JS engine uses to track active function calls. Calling a function pushes a frame; returning pops it. The top frame is the one currently executing.',
      explanation: 'Naming LIFO and push-on-call/pop-on-return is the core answer.',
    },
    {
      level: 'beginner',
      question: 'What is a stack overflow and what causes it?',
      answer: 'It is the "Maximum call stack size exceeded" RangeError, caused by too many nested calls — usually recursion without a base case (or too deep) filling the stack beyond its limit.',
      explanation: 'Connecting it to missing/insufficient base cases shows practical understanding.',
    },
    {
      level: 'intermediate',
      question: 'How does the call stack relate to stack traces?',
      answer: 'A stack trace is a snapshot of the call stack at the moment an error is thrown — the list of frames from the current function down to the entry point, showing how execution got there.',
      explanation: 'This links a debugging tool directly to the data structure.',
    },
    {
      level: 'intermediate',
      question: 'Why does blocking the call stack freeze the UI?',
      answer: 'JS is single-threaded with one call stack. Async callbacks (timers, promises, events) only run when the stack is empty, so a long synchronous task keeps the stack occupied and prevents rendering and event handling.',
      explanation: 'The single-stack + event-loop relationship is the key insight.',
    },
    {
      level: 'advanced',
      question: 'What is tail-call optimization and is it available in JS?',
      answer: 'Proper tail calls reuse the current frame for a call in tail position, keeping stack depth constant. ECMAScript specifies it, but in practice only some engines (notably Safari/JavaScriptCore) implement it, so you cannot rely on it generally.',
      explanation: 'Knowing it is specced but largely unimplemented signals depth and pragmatism.',
    },
    {
      level: 'senior',
      question: 'How would you handle very deep recursion that risks stack overflow?',
      answer: 'Convert to iteration with an explicit stack/queue, use a trampoline (return thunks and loop), or process in async chunks that yield control. Each keeps the native call stack shallow while expressing the recursive logic.',
      explanation: 'Offering concrete strategies (iteration, trampoline, chunking) is the senior answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How big is the call stack? (engine/OS dependent, thousands of frames)',
    'What is the difference between the call stack and the heap?',
    'How does the event loop interact with the call stack?',
    'What is a trampoline and how does it avoid stack overflow?',
    'Why are async stack traces sometimes incomplete?',
    'Does each Web Worker have its own call stack? (yes — separate thread)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Writing recursion without a reachable base case.',
      why: 'Every call pushes a frame and none return, so the stack overflows.',
      fix: 'Ensure a base case that is always eventually reached, and bound recursion depth.',
    },
    {
      mistake: 'Doing heavy synchronous work and expecting the UI to update mid-loop.',
      why: 'The single stack stays busy, so rendering/events cannot run until it empties.',
      fix: 'Break work into chunks that yield (setTimeout/await) or offload to a Web Worker.',
    },
    {
      mistake: 'Assuming setTimeout(fn, 0) runs immediately.',
      why: 'It only runs after the current synchronous stack clears and the timer task is dispatched.',
      fix: 'Treat it as "after the stack empties", not "now".',
    },
    {
      mistake: 'Relying on tail-call optimization to make deep recursion safe.',
      why: 'Most engines do not implement it, so deep tail recursion still overflows.',
      fix: 'Use iteration or a trampoline for unbounded depth.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'A blocking synchronous computation freezes reactivity and the DOM update cycle; heavy work should be chunked or moved to a worker to keep the single stack free.' },
    { area: 'React', detail: 'Long synchronous renders/handlers block painting and input; React\'s concurrent features and yielding exist precisely because of the single call stack.' },
    { area: 'Node.js', detail: 'A blocking CPU loop stalls the event loop and all incoming requests since there is one stack per thread; offload to worker_threads or break work up.' },
    { area: 'Backend', detail: 'Stack traces from the call stack are the primary tool for diagnosing errors; deep recursion (e.g. tree processing) must guard against overflow.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Push/pop of stack frames is extremely cheap and cache-friendly, so normal function calls are fast.',
      'Keeping the stack shallow and clearing it quickly keeps the event loop responsive.',
    ],
    bad: [
      'Deep recursion stacks many frames and can overflow or thrash memory.',
      'Long synchronous tasks monopolize the single stack and block all async work and rendering.',
    ],
    optimizations: [
      'Replace deep recursion with iteration or trampolining to bound stack depth.',
      'Chunk long tasks and yield (setTimeout/await/scheduler) so the stack empties periodically.',
      'Offload CPU-heavy work to Web Workers / worker_threads to keep the main stack free.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['execution-context', 'function-declaration-vs-expression', 'recursion'],
    nextConcepts: ['event-loop', 'microtask-queue', 'macrotask-queue', 'error-types-try-catch'],
    dependencyNote:
      'The call stack is built from execution contexts and is the synchronous half of the runtime; understanding it is the prerequisite for the event loop, the task/microtask queues, and reasoning about stack traces and recursion limits.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a vertical box and label the bottom "global".',
      'Call a chain first -> second -> third and push a frame for each on top.',
      'Point at the top frame and say "this is what is running now".',
      'Pop them in reverse order to show LIFO unwinding on return.',
      'Add a side note: "async callbacks only run when this box is empty — that is the event loop link."',
    ],
    diagram: [
      '   top  ┌ third  ┐  <- running now',
      '        ├ second ┤',
      '        ├ first  ┤',
      '  bottom├ global ┤',
      '        └────────┘',
      '  push on call, pop on return (LIFO)',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The call stack is a LIFO structure tracking active function calls: each call pushes a frame (execution context), each return pops it, and the top frame is what runs now. JS has exactly one stack, so code runs to completion and async callbacks only fire when the stack is empty. Too many nested calls (recursion without a base case) overflow it with "Maximum call stack size exceeded", and stack traces are just a snapshot of the stack at the throw.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The call stack is a last-in-first-out structure the JavaScript engine uses to keep track of where it is in the program. When you call a function, the engine pushes a stack frame — its execution context, holding the function\'s local variables, arguments, this, and where to return to. The engine always runs the frame on top. If that function calls another, a new frame is pushed above it and must finish first; when a function returns, its frame is popped and control goes back to the caller. So the order of completion is the reverse of the order of calls. Two big consequences follow. First, because there is exactly one call stack, JavaScript is single-threaded and runs synchronous code to completion; asynchronous callbacks from timers, promises, or events are only dispatched by the event loop once the stack is empty. That is why a long synchronous loop freezes the whole UI. Second, the stack has a finite depth, so recursion without a reachable base case keeps pushing frames until it throws "Maximum call stack size exceeded" — a stack overflow. Stack traces in errors are simply a snapshot of the stack at the moment of the throw. When recursion is genuinely deep, I convert it to iteration with an explicit stack, use a trampoline, or process in async chunks to keep the native stack shallow.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Recursion is expressive but bounded by stack depth; iteration is safer at scale but often less readable.',
      'Yielding to keep the stack clear improves responsiveness but adds scheduling overhead and complexity.',
    ],
    edgeCases: [
      'Tail-call optimization is specced but only reliably implemented in some engines (JavaScriptCore), so it cannot be assumed.',
      'Async/await flattens logical flow but produces fragmented native stack traces unless the engine reconstructs async stacks.',
      'Each Web Worker / worker thread has its own independent call stack.',
      'A thrown error unwinds frames until a catch; uncaught errors empty the stack and surface to global handlers.',
    ],
    runtimeBehavior: [
      'Only the topmost frame executes; nested calls fully complete before the caller resumes.',
      'The event loop pushes the next macrotask/microtask only when the stack is empty.',
      'Microtasks (promise callbacks) drain completely between macrotasks, all on the same single stack.',
    ],
    scalability: [
      'Unbounded recursion does not scale with input size; use explicit-stack iteration or trampolines for large/deep data.',
      'CPU-bound work scales by moving off the main stack to workers, not by optimizing the stack itself.',
    ],
    productionConcerns: [
      'Stack overflows often appear only on large/adversarial inputs — guard recursive parsers/traversals with depth limits.',
      'Blocking the stack causes UI jank and, on the server, head-of-line blocking of all requests.',
      'Incomplete async stack traces complicate debugging; enable async stack trace support in tooling.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Call stack = LIFO of execution contexts (frames).',
    'Call -> push frame; return -> pop frame.',
    'Top frame is the one currently executing.',
    'Exactly ONE stack -> JS is single-threaded, run-to-completion.',
    'Async callbacks run only when the stack is empty.',
    'Too deep -> RangeError "Maximum call stack size exceeded".',
    'Stack trace = snapshot of the stack at the throw.',
    'Blocking the stack freezes UI / blocks all requests.',
    'Deep recursion fixes: iteration, trampoline, async chunking.',
    'Tail-call optimization is specced but rarely implemented.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write the order in which frames pop for: a() calls b(), b() calls c(). Show with code and comments.',
      hint: 'LIFO: last called pops first.',
      solution: {
        lang: 'js',
        code: "function c() { return 1 }\nfunction b() { return c() }\nfunction a() { return b() }\na()\n// push: a, b, c\n// pop order: c, then b, then a",
        explanation: [
          'Calls push a, then b, then c.',
          'c is on top so it returns and pops first, then b, then a — reverse of call order.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Fix this so it does not overflow: function sum(n){ return n + sum(n-1) }',
      hint: 'Add a base case that returns without recursing.',
      solution: {
        lang: 'js',
        code: "function sum(n) {\n  if (n <= 0) return 0   // base case\n  return n + sum(n - 1)\n}\nsum(5) // 15",
        explanation: [
          'Without a base case every call pushes a frame forever -> overflow.',
          'The base case lets the deepest call return so frames pop back up.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Rewrite factorial iteratively so deep inputs cannot overflow the stack.',
      hint: 'Use a loop and an accumulator instead of recursion.',
      solution: {
        lang: 'js',
        code: "function factorial(n) {\n  let acc = 1\n  for (let i = 2; i <= n; i++) acc *= i\n  return acc\n}\nfactorial(5) // 120",
        explanation: [
          'The loop uses a single stack frame regardless of n.',
          'No matter how large n is, stack depth stays constant, so it cannot overflow.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Predict the log order and explain via the call stack and event loop: console.log("A"); setTimeout(()=>console.log("B")); Promise.resolve().then(()=>console.log("C")); console.log("D");',
      hint: 'Sync first, then microtasks, then macrotasks.',
      solution: {
        lang: 'js',
        code: "console.log('A')\nsetTimeout(() => console.log('B'))\nPromise.resolve().then(() => console.log('C'))\nconsole.log('D')\n// Output: A, D, C, B",
        explanation: [
          'A and D run synchronously while the stack is busy.',
          'After the stack empties, the microtask (C) runs before any macrotask.',
          'The setTimeout callback (B) is a macrotask and runs last, once the stack is clear and microtasks are drained.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The call stack is the bridge between writing functions and understanding the runtime: it explains stack traces, stack overflows, single-threadedness, and why the event loop exists. It is one of the highest-signal fundamentals in interviews.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and what a stack overflow is. Product companies (Zoho, Flipkart, Razorpay) give push/pop tracing and sync-vs-async ordering questions. FAANG-level interviews probe the event-loop interaction, tail calls, and strategies for deep recursion at scale.',
    whatInterviewersExpect:
      'You can define the LIFO stack, trace push/pop for a call chain, explain stack overflow and stack traces, and connect the single stack to the event loop and to keeping UIs/servers responsive.',
  },
}

export default callStack
