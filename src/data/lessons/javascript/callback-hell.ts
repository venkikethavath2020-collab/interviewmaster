import type { ConceptLesson } from '../../../types/lesson'

const callbackHell: ConceptLesson = {
  // 1. Concept Summary
  slug: 'callback-hell',
  name: 'Callback Hell → Promises',
  category: 'async',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Callback hell is the pyramid-of-doom nesting that made early async JavaScript unreadable and unmaintainable — understanding it explains WHY Promises and async/await were invented.',
    'Interviewers use it to test whether you understand async control flow, not just syntax: can you flatten nesting, handle errors once, and reason about order of execution?',
    'Without a mental model for sequencing asynchronous work, you get duplicated error handling, lost stack traces, and bugs where steps run in the wrong order.',
    'Legacy Node.js code, old libraries, and event-based APIs still hand you callbacks — you must be able to read them and refactor them to Promises.',
    'It is the cleanest narrative arc in the async curriculum: callbacks → Promises → async/await, and knowing the pain it solved makes you sound senior.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Callback hell is like telling a friend: "after you finish your homework, then after you eat, then after you brush, then after you..." — an endless chain of "and then".',
    story: [
      'Imagine you ask your little brother to do chores, but each chore can only start AFTER the one before it is completely done.',
      'So you say: "First wash the dishes, and when you are done, then sweep, and when THAT is done, then take out the trash, and when THAT is done, then feed the cat."',
      'Each instruction is hidden inside the one before it, so your note gets pushed further and further to the right of the page until it falls off the edge — a giant staircase of words.',
      'A Promise is like giving your brother a checklist instead: each task says "I promise to tell you when I am finished", and you simply line the tasks up one under another, neat and flat, instead of nesting them inside each other.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some tasks in JavaScript take time — like loading a file or asking a server for data. You cannot wait for them, so you hand the slow task a function to run "later, when you are done". That handed-over function is a callback.',
    'The trouble starts when one slow task must follow another: you put the next callback INSIDE the previous one, then the next inside that, and so on. The code drifts to the right in a triangle shape — people nickname it the "pyramid of doom".',
    'It is hard to read, and handling errors means writing the same check over and over at every level.',
    'A Promise is an object that represents a future result. Instead of nesting, you chain steps with .then(), which keeps the code flat and lets you catch all errors in one place.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Callback hell is deeply nested callback functions used to run asynchronous steps in sequence; each step lives inside the previous step\'s callback, producing a rightward-drifting "pyramid of doom" that is hard to read and error-prone. Promises fix it by representing a future value you can chain linearly.',
    how: 'A callback-based async function takes a function as its last argument and calls it when the work finishes (often with an error-first signature: callback(err, result)). To do step B after step A you call B inside A\'s callback, and so on — the nesting grows with each step. Promises replace this: an async function returns a Promise, and you attach .then() handlers that each return the next Promise, flattening the chain.',
    why: 'Flat, chainable code is far easier to read, has a single shared error path (.catch), and avoids the duplicated try/check logic that nesting forces on you.',
    code: {
      label: 'The pyramid vs the flat chain',
      lang: 'js',
      code: `// Callback hell — nesting grows with every step\ngetUser(1, (err, user) => {\n  if (err) return handle(err)\n  getOrders(user.id, (err, orders) => {\n    if (err) return handle(err)\n    getItems(orders[0].id, (err, items) => {\n      if (err) return handle(err)\n      console.log(items)\n    })\n  })\n})\n\n// Promises — flat chain, one error handler\ngetUser(1)\n  .then(user => getOrders(user.id))\n  .then(orders => getItems(orders[0].id))\n  .then(items => console.log(items))\n  .catch(handle)`,
      explanation: [
        'In the callback version, each step nests inside the previous callback, drifting right and repeating the `if (err)` check at every level.',
        'getUser, getOrders, getItems each fire their callback when their async work completes.',
        'In the Promise version, each .then receives the previous result and RETURNS the next Promise, so the chain stays flat.',
        'A single .catch at the end handles an error from ANY step — no repeated error checks.',
        'Returning the next Promise from inside .then is what links the steps; forgetting to return breaks the chain.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Callback hell is an anti-pattern where asynchronous operations are sequenced by nesting continuation callbacks inside one another, typically using Node\'s error-first callback convention, producing deeply indented "pyramid" code with fragmented, duplicated error handling and no composable return value. Promises remedy this by reifying a pending asynchronous result as a first-class object with three states (pending, fulfilled, rejected) and a chainable .then/.catch interface; returning a Promise from a handler flattens sequential steps into a linear chain and unifies error propagation along the chain.',

  // 7. Internal Working
  internalWorking: [
    'A callback-based async API does its work (I/O, a timer, a network request) and, on completion, invokes the provided callback by scheduling it on the event loop\'s task or microtask queue — control returns to the caller immediately and the callback runs later.',
    'To sequence work, each subsequent operation is invoked inside the previous callback, so the call tree nests; the JavaScript engine still runs each callback as a separate macrotask/microtask, but the SOURCE structure is nested.',
    'With the error-first convention, every callback must inspect its `err` argument; because each nesting level is its own function, the error check cannot be shared and is duplicated.',
    'A Promise wraps this: the executor calls resolve(value) or reject(reason), transitioning the Promise from pending to fulfilled/rejected exactly once; further transitions are ignored.',
    '.then registers fulfillment/rejection reactions; when the Promise settles, those reactions are scheduled on the MICROTASK queue (so they run after the current synchronous code but before timers).',
    'Returning a value from a .then handler resolves the next Promise with that value; returning a Promise causes the chain to wait for it (adoption), which is what flattens nested async steps into a linear chain with a single propagated rejection path.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  CALLBACK HELL (drifts right)        PROMISE CHAIN (stays flat)

  getUser(cb)                          getUser()
    └─ getOrders(cb)                     .then(getOrders)
         └─ getItems(cb)                 .then(getItems)
              └─ done                    .then(done)
                   └─ err? err? err?     .catch(handleAll)

  every level repeats: if (err)...    one .catch handles every step`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — two nested callbacks',
      lang: 'js',
      code: `function loadProfile(cb) {\n  setTimeout(() => cb(null, { id: 1 }), 100) // simulate async\n}\nfunction loadAvatar(user, cb) {\n  setTimeout(() => cb(null, 'avatar-' + user.id + '.png'), 100)\n}\n\nloadProfile((err, user) => {\n  if (err) return console.error(err)\n  loadAvatar(user, (err, avatar) => {\n    if (err) return console.error(err)\n    console.log(avatar) // avatar-1.png\n  })\n})`,
      explanation: [
        'loadProfile finishes asynchronously and calls its callback with (err, user).',
        'loadAvatar must run AFTER loadProfile, so it is nested inside its callback.',
        'Each callback repeats the `if (err)` guard — already a hint of the duplication problem.',
        'Two steps is manageable; the pain compounds with five or six.',
      ],
    },
    intermediate: {
      label: 'Intermediate — promisifying a callback API',
      lang: 'js',
      code: `// Wrap an error-first callback API in a Promise\nfunction loadProfile() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => resolve({ id: 1 }), 100)\n  })\n}\nfunction loadAvatar(user) {\n  return new Promise((resolve) => {\n    setTimeout(() => resolve('avatar-' + user.id + '.png'), 100)\n  })\n}\n\nloadProfile()\n  .then(user => loadAvatar(user))\n  .then(avatar => console.log(avatar)) // avatar-1.png\n  .catch(err => console.error(err))`,
      explanation: [
        'Each function now RETURNS a Promise instead of taking a callback.',
        'The executor calls resolve(value) when the async work completes.',
        'The chain reads top-to-bottom; returning loadAvatar(user) makes the next .then wait for it.',
        'One .catch covers failures from either step — the duplicated error checks are gone.',
        'In Node you would typically use util.promisify or fs.promises instead of hand-wrapping.',
      ],
    },
    advanced: {
      label: 'Advanced — generic promisify helper',
      lang: 'js',
      code: `function promisify(fn) {\n  return (...args) =>\n    new Promise((resolve, reject) => {\n      fn(...args, (err, result) => {\n        if (err) reject(err)\n        else resolve(result)\n      })\n    })\n}\n\n// usage with any error-first callback API\nconst readFileAsync = promisify(require('fs').readFile)\nreadFileAsync('./data.json', 'utf8')\n  .then(text => JSON.parse(text))\n  .then(obj => console.log(obj))\n  .catch(err => console.error('failed:', err))`,
      explanation: [
        'promisify takes an error-first callback function and returns a Promise-returning version.',
        'It appends its own callback that translates (err, result) into reject/resolve.',
        'This is essentially how Node\'s built-in util.promisify works.',
        'Once promisified, any legacy callback API can join a flat .then chain or be awaited.',
        'It centralizes the error-first translation in ONE place instead of at every call site.',
      ],
    },
    realProject: {
      label: 'Real project — refactoring a Node route handler',
      lang: 'js',
      code: `// BEFORE: callback hell in an Express handler\napp.get('/dashboard', (req, res) => {\n  db.getUser(req.userId, (err, user) => {\n    if (err) return res.status(500).end()\n    db.getOrders(user.id, (err, orders) => {\n      if (err) return res.status(500).end()\n      db.getStats(orders, (err, stats) => {\n        if (err) return res.status(500).end()\n        res.json({ user, orders, stats })\n      })\n    })\n  })\n})\n\n// AFTER: flat Promise chain\napp.get('/dashboard', (req, res) => {\n  let user, orders\n  db.getUser(req.userId)\n    .then(u => { user = u; return db.getOrders(u.id) })\n    .then(o => { orders = o; return db.getStats(o) })\n    .then(stats => res.json({ user, orders, stats }))\n    .catch(() => res.status(500).end())\n})`,
      explanation: [
        'The BEFORE version repeats the same 500 error response three times and nests three levels deep.',
        'The AFTER version assumes the db methods return Promises (most modern drivers do).',
        'Intermediate results are stashed in outer variables so the final .then can use all of them.',
        'A single .catch sends the error response once — the duplication is eliminated.',
        'This same handler is even cleaner with async/await, the natural next step after Promises.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is callback hell?',
      answer: 'It is deeply nested callbacks used to sequence asynchronous steps, where each step lives inside the previous callback, producing rightward-drifting "pyramid of doom" code that is hard to read and forces duplicated error handling at every level.',
      explanation: 'A good answer names both symptoms — the nesting/indentation AND the fragmented error handling — and mentions Promises as the fix.',
    },
    {
      level: 'beginner',
      question: 'What is the error-first callback convention?',
      answer: 'A Node.js convention where the callback\'s first argument is an error (null if none) and subsequent arguments are the result, e.g. callback(err, data). The caller checks err first before using the data.',
      explanation: 'Recognizing this convention shows you can read legacy Node code and explains why every nesting level repeats an `if (err)` check.',
    },
    {
      level: 'intermediate',
      question: 'How do Promises solve callback hell?',
      answer: 'A Promise represents a future value and exposes a chainable .then/.catch interface. Returning the next Promise from a .then handler flattens sequential steps into a linear chain, and a single .catch unifies error handling for the whole chain.',
      explanation: 'The key insight is that returning a Promise from .then adopts its state, which is what keeps the chain flat rather than nested.',
    },
    {
      level: 'intermediate',
      question: 'How would you convert a callback-based API into a Promise-based one?',
      answer: 'Wrap it: return new Promise((resolve, reject) => fn(...args, (err, result) => err ? reject(err) : resolve(result))). Or use Node\'s util.promisify, which does exactly this for error-first callbacks.',
      explanation: 'Mentioning util.promisify and the error-first translation shows practical Node experience, not just theory.',
    },
    {
      level: 'advanced',
      question: 'What problems persist even with Promise chains, and what fixes them?',
      answer: 'Long .then chains can still be verbose, branching/conditional logic is awkward, and accidentally forgetting to return a Promise silently breaks sequencing. async/await fixes readability by letting you write asynchronous code in a synchronous-looking style with try/catch.',
      explanation: 'Senior signal: knowing Promises are a step, not the end — async/await is the ergonomic layer on top.',
    },
    {
      level: 'senior',
      question: 'Why do Promise .then callbacks run as microtasks, and why does that matter when refactoring from callbacks?',
      answer: 'Promise reactions are queued on the microtask queue, which drains fully after the current synchronous task and before the next macrotask (timers, I/O). Callback APIs built on setTimeout/I/O run as macrotasks. So refactoring callbacks to Promises can change observable ordering relative to timers and I/O, which can surface or mask race conditions.',
      explanation: 'This connects callback hell to the event loop, microtask vs macrotask queues — a sign you understand the runtime, not just the syntax.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a callback and a Promise?',
    'What happens if you forget to return the inner Promise inside a .then?',
    'How does async/await improve on Promise chains?',
    'Can you run callback-style steps in parallel instead of sequentially? (Promise.all)',
    'What is "inversion of control" and how do callbacks suffer from it?',
    'How do you handle errors that are thrown synchronously inside a callback vs a Promise handler?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to return the inner Promise inside a .then handler.',
      why: 'Without the return, the next .then does not wait for the inner async work, so steps run out of order or with undefined values.',
      fix: 'Always `return` the Promise you create inside a .then, or switch to async/await where await makes sequencing explicit.',
    },
    {
      mistake: 'Mixing callbacks and Promises in the same flow (calling a callback inside a .then).',
      why: 'It reintroduces nesting and creates two error paths, defeating the point of promisifying.',
      fix: 'Promisify the callback API first, then keep the whole flow Promise-based (or async/await).',
    },
    {
      mistake: 'Handling errors at every nesting level instead of once.',
      why: 'Duplicated `if (err)` logic is verbose, easy to get wrong, and easy to forget on one branch.',
      fix: 'Use a single .catch at the end of the chain (or one try/catch around an async function).',
    },
    {
      mistake: 'Calling resolve or reject more than once in an executor.',
      why: 'A Promise can only settle once; later calls are silently ignored, hiding logic bugs.',
      fix: 'Structure the executor so exactly one of resolve/reject runs on each path; return early after settling.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Legacy APIs (fs.readFile, older DB drivers, the crypto module) use error-first callbacks; teams promisify them (util.promisify or fs.promises) to flatten request handlers and avoid pyramids.' },
    { area: 'Backend', detail: 'Sequential service calls (auth → fetch user → fetch orders) are classic pyramid candidates; Promise chaining and async/await keep handlers linear and give one error path for the response.' },
    { area: 'React', detail: 'Older code wired data loading with nested callbacks in lifecycle methods; modern code uses Promise-returning fetch in useEffect, often with async/await and a single catch to set an error state.' },
    { area: 'Vue', detail: 'Composables that orchestrate multiple async calls return Promises/async functions instead of nesting callbacks, so loading and error refs are updated in one clear place.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Refactoring to Promises does not slow anything down meaningfully — Promise overhead is tiny compared to the I/O it sequences.',
      'Flattening makes it easier to spot independent steps you can run in parallel with Promise.all, which can dramatically cut total latency.',
    ],
    bad: [
      'Accidental over-sequencing: awaiting/chaining steps that could run in parallel wastes wall-clock time.',
      'Promise reactions are microtasks; a huge synchronous burst of resolved Promises can starve the macrotask queue (timers, rendering) until the microtask queue drains.',
    ],
    optimizations: [
      'Identify steps with no data dependency and run them concurrently with Promise.all instead of chaining.',
      'Promisify hot callback APIs once at module load rather than wrapping at every call site.',
      'Avoid creating Promises in tight synchronous loops when a plain loop suffices.',
      'Prefer async/await for readability; it compiles to the same Promise machinery with no extra cost.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['callbacks', 'event-loop', 'higher-order-functions'],
    nextConcepts: ['promises', 'async-await', 'promise-combinators', 'async-error-handling'],
    dependencyNote:
      'Callback hell is the motivating problem for the whole async sequence: you need callbacks and the event loop to understand it, and it leads directly into Promises, then async/await, with promise-combinators for parallelism.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write three async calls nested inside each other, indenting further right each time — draw the triangle shape.',
      'Point at the repeated `if (err)` on each level and say "this is duplicated everywhere".',
      'Now rewrite it as a vertical .then chain, one call per line, flat against the left margin.',
      'Add a single .catch at the bottom and say "one error path for all steps".',
      'Say: "Returning the next Promise from .then is what flattens it; async/await is the same thing with nicer syntax."',
    ],
    diagram: `  NESTED                    FLAT
  a(() =>                   a()
    b(() =>                  .then(b)
      c(() =>                .then(c)
        d())))               .then(d)
                             .catch(handle)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Callback hell is deeply nested callbacks used to sequence async steps — each step inside the previous one — giving rightward "pyramid of doom" code with duplicated error checks at every level. Promises fix it: each async function returns a Promise, you chain steps with .then where returning the next Promise keeps the chain flat, and one .catch handles all errors. async/await then layers synchronous-looking syntax on top of the same machinery.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Callback hell is the anti-pattern you get when you sequence asynchronous work by nesting callbacks. To run step B after step A, you put B inside A\'s callback, then C inside B\'s, and so on. Two things go wrong: the code drifts further right with every step into a "pyramid of doom", and because each level is its own function, you repeat the error-first `if (err)` check everywhere — there is no single place to handle failure. Promises solve both problems. A Promise is an object representing a future value with three states: pending, fulfilled, and rejected. Instead of nesting, each async function returns a Promise and you chain steps with .then, where returning the next Promise from a handler adopts its result and keeps the chain flat. Crucially, one .catch at the end handles a rejection from any step, so error handling is unified. To bring legacy callback APIs into this world you promisify them, manually or with Node\'s util.promisify. The one gotcha is forgetting to return the inner Promise inside a .then, which silently breaks sequencing. Promises are a step on the way to async/await, which gives the same behavior with synchronous-looking syntax and ordinary try/catch.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Callbacks have zero abstraction cost and predate Promises, so they still appear in event emitters and streams where a single "future value" model does not fit; Promises model one-shot results, not streams.',
      'Promise chains are flat but can obscure branching logic; async/await reads better for conditionals and loops but can tempt over-sequentialization of independent work.',
    ],
    edgeCases: [
      'Forgetting to return a Promise inside .then breaks ordering without throwing — a silent class of bugs.',
      'An executor that resolves then rejects (or vice versa) settles only on the first call; the second is ignored, masking logic errors.',
      'Errors thrown synchronously inside a callback are NOT caught by an outer .catch unless the callback runs inside a Promise context; throwing inside a setTimeout callback is uncatchable by surrounding try/catch.',
    ],
    runtimeBehavior: [
      'Promise reactions schedule on the microtask queue and run after the current task but before the next macrotask, so converting callbacks to Promises can shift ordering relative to timers and I/O.',
      'A rejected Promise with no handler triggers an unhandledRejection event in Node (and a console warning in browsers), unlike a swallowed callback error.',
    ],
    scalability: [
      'Flattening exposes opportunities to parallelize independent steps with Promise.all, cutting latency in fan-out workloads like dashboards.',
      'Promisifying high-frequency I/O paths adds negligible overhead but greatly improves maintainability and error observability at scale.',
    ],
    productionConcerns: [
      'Lost stack traces: nested callbacks and naive Promise chains can produce shallow stacks; async/await and async stack traces in modern engines mitigate this.',
      'Unhandled rejections must be monitored (process.on(\'unhandledRejection\')) or they become silent failures.',
      'Mixed callback/Promise codebases create two error pathways — standardize on one model per module.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Callback hell = nested callbacks sequencing async steps → pyramid of doom.',
    'Error-first callbacks: callback(err, result); check err first.',
    'Symptoms: rightward drift + duplicated error handling at every level.',
    'Promise = future value with states pending / fulfilled / rejected.',
    'Chain steps with .then; RETURN the next Promise to keep it flat.',
    'One .catch handles errors from the whole chain.',
    'Promisify callbacks with new Promise(...) or util.promisify.',
    'Promise reactions run as microtasks (after sync code, before timers).',
    'Forgetting to return inside .then silently breaks sequencing.',
    'async/await is the ergonomic layer on top of Promises.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given an error-first `getNumber(cb)` that calls cb(null, 42), wrap it in a function that returns a Promise resolving to the number.',
      hint: 'Use new Promise and translate (err, result) to reject/resolve.',
      solution: {
        lang: 'js',
        code: `function getNumber(cb) {\n  setTimeout(() => cb(null, 42), 50)\n}\n\nfunction getNumberPromise() {\n  return new Promise((resolve, reject) => {\n    getNumber((err, result) => {\n      if (err) reject(err)\n      else resolve(result)\n    })\n  })\n}\n\ngetNumberPromise().then(n => console.log(n)) // 42`,
        explanation: [
          'The executor calls the callback API and maps its result onto resolve/reject.',
          'err truthy → reject; otherwise resolve with the result.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Refactor this nested callback flow into a flat Promise chain (assume each step returns a Promise): step1() → step2(a) → step3(b).',
      hint: 'Each .then should return the next Promise.',
      solution: {
        lang: 'js',
        code: `step1()\n  .then(a => step2(a))\n  .then(b => step3(b))\n  .then(c => console.log('done', c))\n  .catch(err => console.error(err))`,
        explanation: [
          'Each handler returns the next Promise so the next .then waits for it.',
          'A single .catch covers a failure in any of the three steps.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a generic `promisify(fn)` that converts any error-first callback function into one that returns a Promise.',
      hint: 'Return a function that spreads args and appends its own (err, result) callback.',
      solution: {
        lang: 'js',
        code: `function promisify(fn) {\n  return (...args) =>\n    new Promise((resolve, reject) => {\n      fn(...args, (err, result) => {\n        if (err) reject(err)\n        else resolve(result)\n      })\n    })\n}\n\n// const readFileP = promisify(fs.readFile)\n// readFileP('x.txt', 'utf8').then(...)`,
        explanation: [
          'The returned function forwards the original arguments and appends a translating callback.',
          'It resolves on success and rejects on error — the same logic util.promisify uses.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You have three independent async fetches (fetchA, fetchB, fetchC) each returning a Promise. The callback-hell version ran them one after another. Rewrite to run them in parallel and log all three results.',
      hint: 'Independent work has no data dependency — use Promise.all.',
      solution: {
        lang: 'js',
        code: `Promise.all([fetchA(), fetchB(), fetchC()])\n  .then(([a, b, c]) => {\n    console.log(a, b, c)\n  })\n  .catch(err => console.error('one failed:', err))\n\n// Sequential (slower) for contrast:\n// fetchA().then(a => fetchB().then(b => fetchC().then(c => ...)))`,
        explanation: [
          'Because the three fetches do not depend on each other, nesting/chaining them wastes time.',
          'Promise.all starts all three immediately and resolves with an array of results when all settle.',
          'It rejects as soon as any one rejects — the single .catch handles that.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Callback hell is the story that ties the entire async curriculum together. Being able to explain WHY Promises and async/await exist — the pain they removed — signals that you understand async control flow deeply, not just the latest syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to define callback hell and name the fix. Product companies (Zoho, Flipkart, Razorpay) hand you a nested snippet and ask you to refactor it to Promises and then to async/await. FAANG-level interviews probe the event-loop ordering differences and ask you to write promisify from scratch.',
    whatInterviewersExpect:
      'They expect you to identify the two symptoms (nesting + duplicated error handling), refactor a pyramid into a flat .then chain with one .catch, promisify a callback API, and connect it forward to async/await and parallelism with Promise.all.',
  },
}

export default callbackHell
