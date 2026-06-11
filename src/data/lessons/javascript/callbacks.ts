import type { ConceptLesson } from '../../../types/lesson'

const callbacks: ConceptLesson = {
  // 1. Concept Summary
  slug: 'callbacks',
  name: 'Callback Functions',
  category: 'functions',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Callbacks are the original way JavaScript handles "do this later" — events, timers, I/O, and array iteration all run on them.',
    'Every async API you touch (setTimeout, addEventListener, fs.readFile, array .map/.forEach) is built on the callback contract: you hand over a function, the runtime calls it back.',
    'Without callbacks you could not react to things that happen in the future — a single-threaded language would freeze waiting for the network or a click.',
    'Interviewers ask about callbacks because they reveal whether you understand functions as values, asynchrony, and the difference between calling a function and passing one.',
    'Misusing them produces real bugs: calling instead of passing (fn() vs fn), callback hell, "this" loss, and double-invocation.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A callback is leaving your phone number so someone can call YOU back when the pizza is ready.',
    story: [
      'Imagine you order a pizza but you do not want to stand at the counter staring at the oven the whole time.',
      'So you give the shop your phone number and go sit down, play, and do other things.',
      'When the pizza is finally ready, the shop calls your number — and only then do you get up to fetch it.',
      'In JavaScript, when something takes time (like loading data), you hand the computer a little function — your "phone number". The computer keeps working on other things, and when the task is done, it "calls back" your function so your code can run at the right moment.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript a function is a value, just like a number or a string, so you can pass one function into another function as an argument.',
    'A callback is exactly that: a function you give to another function or to the browser, so it can run your code later — when an event happens or a task finishes.',
    'Some callbacks run immediately and repeatedly (like the function you pass to forEach), and some run much later (like the one you pass to setTimeout).',
    'The big idea is control: you decide WHAT happens, and the other code decides WHEN to run it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A callback function is a function passed as an argument to another function, to be invoked ("called back") by that function at a later or specific point in time.',
    how: 'You pass the function by name or as an inline function expression — without parentheses, because parentheses would call it immediately instead of handing it over. The receiving function stores it and invokes it when appropriate, often passing it arguments like data or an error.',
    why: 'It lets one piece of code stay generic ("do the iterating / wait for the event") while you plug in the specific behavior, and it lets async work finish without blocking the rest of your program.',
    code: {
      label: 'Passing a callback to setTimeout and forEach',
      lang: 'js',
      code: `function greet() {\n  console.log('Hello after 1 second')\n}\nsetTimeout(greet, 1000)        // pass greet, do NOT call it (no parens)\n\n[1, 2, 3].forEach(function (n) {\n  console.log(n * 2)           // runs once per element: 2, 4, 6\n})`,
      explanation: [
        'greet is passed to setTimeout as a value — note there are no parentheses after greet.',
        'setTimeout stores it and calls greet() itself after ~1000ms.',
        'The inline function passed to forEach is also a callback — forEach calls it once per array element.',
        'In both cases YOU define the behavior; the other function controls when it runs.',
        'If you wrote setTimeout(greet(), 1000) it would call greet immediately and pass its return value (undefined) instead.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A callback is a first-class function reference passed as an argument to a higher-order function, which then invokes it at a defined point — synchronously (e.g. Array.prototype.map applies it per element during the same tick) or asynchronously (e.g. event listeners and timers invoke it on a later iteration of the event loop). Asynchronous callbacks frequently follow the Node-style error-first convention (err, data) and execute as macrotasks or microtasks depending on their source.',

  // 7. Internal Working
  internalWorking: [
    'A function in JavaScript is an object (a first-class value), so a reference to it can be stored in a variable and passed as an argument like any other value.',
    'The higher-order function receives that reference as a parameter; it does not copy the function body, only the reference.',
    'For SYNCHRONOUS callbacks (map, forEach, filter), the host function invokes the callback inline within the same call stack, on the current event-loop tick, before it returns.',
    'For ASYNCHRONOUS callbacks (setTimeout, addEventListener, I/O), the function registers the callback with a Web API / host environment and returns immediately; the call stack unwinds.',
    'When the awaited event fires or the timer expires, the host pushes the callback onto the appropriate queue (macrotask queue for timers/events, microtask queue for promise jobs).',
    'The event loop, once the call stack is empty, dequeues the callback and pushes a fresh execution context for it onto the stack, where it finally runs with whatever arguments the host supplies.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  your code                higher-order fn / Web API
  ─────────                ─────────────────────────
  pass fn  ───────────────► stores reference (no call yet)
                                   │
                                   │ later: event fires / timer ends
                                   ▼
                            queue ──► event loop ──► CALL fn(args)
                                                        │
  your callback body runs ◄─────────────────────────────┘
  (often given data or an error-first (err, data))`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — synchronous callback',
      lang: 'js',
      code: `function repeat(times, action) {\n  for (let i = 0; i < times; i++) {\n    action(i)            // call the callback, passing the index\n  }\n}\nrepeat(3, (i) => console.log('tick', i))\n// tick 0\n// tick 1\n// tick 2`,
      explanation: [
        'repeat is a higher-order function: it takes a function (action) as an argument.',
        'It invokes action(i) on each loop iteration — a synchronous callback.',
        'The caller plugs in any behavior; repeat stays generic about WHAT to do.',
        'All of this runs in a single tick before repeat returns.',
      ],
    },
    intermediate: {
      label: 'Intermediate — error-first async callback (Node style)',
      lang: 'js',
      code: `function loadUser(id, callback) {\n  setTimeout(() => {\n    if (id <= 0) return callback(new Error('bad id'))\n    callback(null, { id, name: 'Ada' })   // err is null on success\n  }, 200)\n}\n\nloadUser(1, (err, user) => {\n  if (err) return console.error(err.message)\n  console.log(user.name)   // 'Ada'\n})`,
      explanation: [
        'The Node convention puts the error first: callback(err, data).',
        'On failure we pass an Error and return early; on success the first arg is null.',
        'The caller ALWAYS checks err before using data — skipping that is a classic bug.',
        'loadUser returns immediately; the callback runs ~200ms later on a future tick.',
      ],
    },
    advanced: {
      label: 'Advanced — callback hell vs a cleaner shape',
      lang: 'js',
      code: `// Pyramid of doom: nested callbacks are hard to read and error-prone\ngetUser(1, (e, user) => {\n  if (e) return handle(e)\n  getOrders(user.id, (e, orders) => {\n    if (e) return handle(e)\n    getItems(orders[0].id, (e, items) => {\n      if (e) return handle(e)\n      console.log(items)\n    })\n  })\n})\n\n// Modern fix: promisify and use async/await (built on the same idea)\nconst user = await getUserP(1)\nconst orders = await getOrdersP(user.id)\nconst items = await getItemsP(orders[0].id)`,
      explanation: [
        'Sequential dependent async steps with raw callbacks nest deeper and deeper — "callback hell".',
        'Error handling repeats at every level and is easy to forget.',
        'Promises/async-await flatten the same logic while preserving the callback contract underneath.',
        'Knowing callbacks are the foundation explains WHY promises exist and what they solve.',
      ],
    },
    realProject: {
      label: 'Real project — DOM event callback in a Vue component',
      lang: 'js',
      code: `// In a Vue setup() / composable\nimport { onMounted, onUnmounted } from 'vue'\n\nfunction useResize(onResize) {\n  const handler = () => onResize(window.innerWidth)  // a callback\n  onMounted(() => window.addEventListener('resize', handler))\n  onUnmounted(() => window.removeEventListener('resize', handler))\n}\n\n// usage\nuseResize((width) => console.log('width is', width))`,
      explanation: [
        'addEventListener takes handler as a callback the browser invokes on each resize event.',
        'We keep the SAME handler reference so we can remove it later — anonymous inline functions cannot be removed.',
        'Cleaning up in onUnmounted prevents leaks and duplicate handlers.',
        'This is the everyday face of callbacks in front-end frameworks.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a callback function?',
      answer: 'A function passed as an argument to another function so that it can be invoked later — when a task finishes or an event occurs.',
      explanation: 'A good answer stresses that the function is passed (not called) and that another piece of code decides when to run it.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between passing fn and fn()?',
      answer: 'fn passes the function itself as a value; fn() calls the function immediately and passes its return value. For a callback you almost always want fn.',
      explanation: 'This catches the single most common beginner mistake and shows you understand functions as first-class values.',
    },
    {
      level: 'intermediate',
      question: 'Are all callbacks asynchronous?',
      answer: 'No. forEach, map, filter, and sort callbacks run synchronously in the same tick. setTimeout, event listeners, and I/O callbacks run asynchronously on a later event-loop tick.',
      explanation: 'Distinguishing sync from async callbacks demonstrates real understanding of the execution model.',
    },
    {
      level: 'intermediate',
      question: 'What is the error-first callback convention?',
      answer: 'A Node.js pattern where the callback signature is (err, data): if something failed, err holds an Error and data is undefined; on success err is null and data holds the result.',
      explanation: 'Mentioning that you check err before touching data signals practical Node experience.',
    },
    {
      level: 'advanced',
      question: 'What problems do callbacks have, and how do promises solve them?',
      answer: 'Callbacks lead to deep nesting (callback hell), repeated/forgotten error handling, no easy composition, and inversion of control. Promises give a flat chainable structure, single error path via catch, and combinators; async/await reads like sync code.',
      explanation: 'Strong answers name inversion of control and explain that promises wrap, not replace, the callback idea.',
    },
    {
      level: 'senior',
      question: 'What is "inversion of control" with callbacks and why is it risky?',
      answer: 'When you pass a callback to third-party code, you trust it to call your function exactly once, at the right time, with the right arguments — but it might call it twice, never, too early, or swallow errors. You lose control over your own code path.',
      explanation: 'Senior signal: framing reliability/trust concerns and noting that promises constrain resolution to once, mitigating some of this.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you convert a callback-based API into a promise (promisify)?',
    'Why does an arrow-function callback help with "this", and when would a regular function lose it?',
    'How do microtask (promise) callbacks differ from macrotask (setTimeout) callbacks in ordering?',
    'How do you remove an event listener you added with an inline callback? (you cannot — keep a reference)',
    'What happens if a synchronous callback throws? What about an async one?',
    'Can you implement your own forEach/map that takes a callback?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling the function instead of passing it: setTimeout(greet(), 1000).',
      why: 'greet() runs immediately and its return value (often undefined) is passed, so the timer does nothing useful.',
      fix: 'Pass the reference: setTimeout(greet, 1000), or wrap it: setTimeout(() => greet(), 1000).',
    },
    {
      mistake: 'Ignoring the error argument in error-first callbacks.',
      why: 'You read data that is undefined on failure, causing crashes and hiding real errors.',
      fix: 'Always check if (err) return handle(err) before using the data.',
    },
    {
      mistake: 'Using an anonymous inline callback for addEventListener you later want to remove.',
      why: 'removeEventListener needs the exact same reference; an inline function creates a new one each time.',
      fix: 'Store the handler in a variable (or use AbortController) so you can remove it on cleanup.',
    },
    {
      mistake: 'Assuming a callback runs synchronously when it is async (or vice versa).',
      why: 'Reading a result right after an async call gives stale/undefined values; logging order surprises you.',
      fix: 'Know which APIs are async; put dependent logic inside the callback (or await a promise).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Event handlers bound in templates (@click) and watchers/lifecycle hooks all take callbacks; composables accept callbacks (e.g. an onSuccess handler) to stay generic.' },
    { area: 'React', detail: 'onClick/onChange handlers, useEffect setup/cleanup functions, and useCallback-memoized handlers are all callbacks; stale closures inside callbacks are a frequent bug.' },
    { area: 'Node.js', detail: 'Core APIs (fs, http, streams) historically use error-first callbacks; the EventEmitter pattern (.on/.once) invokes registered callbacks on emitted events.' },
    { area: 'Backend', detail: 'Middleware chains (Express next()) are callbacks; database drivers expose callback or promise APIs; retry/queue libraries call your job callback when it is time to run.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Callbacks let work be non-blocking — the thread stays free for other tasks instead of waiting on I/O.',
      'Synchronous array callbacks are highly optimized by engines and are typically as fast as a hand-written loop for most workloads.',
    ],
    bad: [
      'Allocating a brand-new inline callback on every render or every loop iteration adds GC pressure in hot paths.',
      'Deeply nested callbacks make code paths hard to reason about, indirectly causing performance bugs that are hard to spot.',
    ],
    optimizations: [
      'Hoist stable callbacks out of loops/renders (or memoize with useCallback) so you reuse one function reference.',
      'Prefer a plain for-loop over .forEach in extremely hot numeric loops where per-call overhead matters.',
      'Debounce/throttle high-frequency event callbacks (scroll, resize, input) to limit how often they run.',
      'Detach listeners and clear timers so dead callbacks (and what they capture) are collected.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['function-declaration-vs-expression', 'higher-order-functions', 'scope'],
    nextConcepts: ['promises', 'async-await', 'event-loop', 'closure', 'event-system'],
    dependencyNote:
      'Callbacks build on functions-as-values and higher-order functions, and they are the conceptual seed for the entire async story — promises and async/await are layered on top of the callback contract plus the event loop.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a higher-order function box on the left and "your function" on the right.',
      'Draw an arrow from your function INTO the box labeled "passed as argument (no parens)".',
      'Inside the box write "stores reference, calls it later".',
      'Draw a clock/event firing, then an arrow back out: "now it calls your function".',
      'Say: "A callback is a function I hand to other code so it can run my code at the right time — synchronously like map, or later like setTimeout."',
    ],
    diagram: `  myFn ──pass (no parens)──► [ higherOrderFn ]
                                  │ stores ref
        event/timer ───────────►  │ calls it later
                                  ▼
                              myFn(args)  ← runs now`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A callback is a function you pass to other code so it can call it back later. Because functions are first-class values, you hand over the reference (no parentheses) and the receiver decides when to run it. Some run synchronously (map, forEach) and some asynchronously (setTimeout, events, I/O). Node uses the error-first (err, data) convention. Nesting many callbacks gives "callback hell," which promises and async/await solve while building on the same idea.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A callback is simply a function passed as an argument to another function so that it can be invoked later. This works because functions are first-class values in JavaScript — you can store them in variables and pass them around. The key subtlety is that you pass the reference without parentheses; writing fn() would call it immediately and pass its return value instead. Callbacks come in two flavors. Synchronous callbacks, like the ones you give to map, forEach, or sort, run inline within the same tick. Asynchronous callbacks, like those for setTimeout, addEventListener, or Node I/O, get registered with the host environment; your function returns immediately, and when the event fires or the timer expires the runtime queues your callback and the event loop runs it on a later tick once the stack is clear. In Node the convention is error-first: the callback receives (err, data), and you always check err before using data. The downside of callbacks is nesting — sequential dependent async steps create a pyramid of doom with repeated error handling, and passing your callback to third-party code is an inversion of control where you trust it to call you exactly once. Promises and async/await were created to fix exactly that, while still being built on the callback foundation underneath.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Callbacks are the lowest-overhead async primitive (no promise allocation), but they sacrifice composability and readability versus promises/async-await.',
      'Inline callbacks are ergonomic but allocate per call; named/hoisted callbacks are reusable but spread logic across the file.',
    ],
    edgeCases: [
      'A third-party API may invoke your callback zero, one, or many times — defensive code or once() wrappers matter.',
      'Throwing inside an async callback does not propagate to the caller try/catch — it surfaces as an unhandled error on that tick.',
      'Regular-function callbacks lose their intended "this"; arrow callbacks capture the lexical this, which is usually what you want.',
      'Mixing sync and async paths in one callback API (sometimes immediate, sometimes deferred) causes Zalgo-style ordering bugs — pick one.',
    ],
    runtimeBehavior: [
      'Promise (microtask) callbacks drain fully before the next macrotask (timer/event) callback runs, which determines ordering.',
      'Synchronous callbacks share the caller call stack, so a deep recursive callback can overflow the stack.',
      'Event-listener callbacks accumulate if added repeatedly without removal, firing multiple times per event.',
    ],
    scalability: [
      'High-frequency event callbacks (scroll/resize/mousemove) must be throttled/debounced or they swamp the main thread.',
      'In Node, callback-heavy hot paths benefit from avoiding closure allocation per request; reuse handlers where possible.',
    ],
    productionConcerns: [
      'Forgotten listener callbacks are a leading cause of memory leaks and "handler fired twice" bugs — ensure cleanup.',
      'Silent error swallowing in callbacks hides incidents; centralize error handling and never ignore the err argument.',
      'Promisify legacy callback APIs at the boundary so the rest of the codebase uses a consistent async style.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Callback = a function passed to other code to be called later.',
    'Pass the reference (fn), do not call it (fn()).',
    'Sync callbacks: map, forEach, filter, sort — run in the same tick.',
    'Async callbacks: setTimeout, addEventListener, fs.readFile — run on a later tick.',
    'Node convention: error-first (err, data); check err first.',
    'Microtask (promise) callbacks run before macrotask (timer) callbacks.',
    'Keep a reference if you need to removeEventListener later.',
    'Arrow callbacks capture lexical this; regular functions can lose it.',
    'Nesting → callback hell → promises/async-await fix readability.',
    'Inversion of control: third-party code may call you 0, 1, or many times.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function each(arr, fn) that calls fn(element, index) for every item in arr.',
      hint: 'Loop and invoke the callback with the element and index.',
      solution: {
        lang: 'js',
        code: `function each(arr, fn) {\n  for (let i = 0; i < arr.length; i++) {\n    fn(arr[i], i)\n  }\n}\neach(['a', 'b'], (v, i) => console.log(i, v)) // 0 a / 1 b`,
        explanation: ['fn is the callback; we invoke it once per element.', 'We pass both the value and the index, like the built-in forEach.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement once(fn) so the wrapped function runs its callback only on the first call and returns the cached result afterward.',
      hint: 'Track a called flag and a stored result in a closure.',
      solution: {
        lang: 'js',
        code: `function once(fn) {\n  let called = false\n  let result\n  return function (...args) {\n    if (!called) {\n      called = true\n      result = fn.apply(this, args)\n    }\n    return result\n  }\n}\nconst init = once(() => console.log('run once'))\ninit(); init() // logs once`,
        explanation: ['Guards a callback so third-party code cannot invoke it more than once.', 'Subsequent calls short-circuit and return the first result.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write promisify(fn) that turns a Node error-first callback API into a promise-returning function.',
      hint: 'Return a function that returns a new Promise, calling fn with a (err, data) callback.',
      solution: {
        lang: 'js',
        code: `function promisify(fn) {\n  return function (...args) {\n    return new Promise((resolve, reject) => {\n      fn.call(this, ...args, (err, data) => {\n        if (err) return reject(err)\n        resolve(data)\n      })\n    })\n  }\n}\n// const readFileP = promisify(fs.readFile)\n// const text = await readFileP('a.txt', 'utf8')`,
        explanation: ['We append our own (err, data) callback as the last argument.', 'err rejects the promise; data resolves it — bridging callbacks to async/await.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement runSeries(tasks, done) where tasks is an array of functions each taking a callback(err, result); run them in order, stop on first error, and call done(err, results).',
      hint: 'Use an index and recurse into the next task inside each callback.',
      solution: {
        lang: 'js',
        code: `function runSeries(tasks, done) {\n  const results = []\n  let i = 0\n  function next(err, result) {\n    if (err) return done(err)\n    if (i > 0) results.push(result)\n    if (i === tasks.length) return done(null, results.slice(1 - 1))\n    const task = tasks[i++]\n    task(next)\n  }\n  next()\n}`,
        explanation: [
          'next is a callback that drives the series forward one task at a time.',
          'Any err short-circuits to done(err); otherwise we collect results and continue.',
          'This is essentially what async.series does and shows mastery of the callback contract.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Callbacks are the gateway to understanding asynchrony, the event loop, and eventually promises and async/await. If you can explain the difference between passing and calling a function, sync vs async callbacks, and why callback hell exists, you have the mental model that everything async builds on.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for a definition and the fn vs fn() difference. Product companies (Zoho, Flipkart, Razorpay) ask you to implement forEach, once, or promisify from scratch. FAANG-level interviews probe inversion of control, microtask vs macrotask ordering, and why promises improve on callbacks.',
    whatInterviewersExpect:
      'They expect you to define callbacks precisely, show you know functions are first-class values, distinguish synchronous from asynchronous callbacks, explain the error-first convention, and connect callbacks to the event loop and to why promises were introduced.',
  },
}

export default callbacks
