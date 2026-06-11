import type { ConceptLesson } from '../../../types/lesson'

const promises: ConceptLesson = {
  // 1. Concept Summary
  slug: 'promises',
  name: 'Promises',
  category: 'async',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Promises are the foundation of all modern asynchronous JavaScript — fetch, async/await, Promise.all, and almost every async API returns or consumes them.',
    'They replaced callback hell with a flat, composable model and a single error path, making async code readable and maintainable.',
    'Interviewers ask about Promises constantly because they reveal whether you truly understand the event loop, microtasks, error propagation, and state machines.',
    'Misunderstanding Promise behavior causes real bugs: unhandled rejections, swallowed errors, broken chains from forgotten returns, and surprising execution order.',
    'You cannot understand async/await without understanding Promises — async functions are just syntactic sugar that return Promises.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Promise is like a pizza order ticket: you do not get the pizza right away, but you hold a ticket that will eventually say "ready" or "sorry, we ran out".',
    story: [
      'When you order a pizza, the shop does not freeze and make you stand still until it is baked. They hand you a little ticket and say "we promise to call your number".',
      'You can walk around and do other things while you hold the ticket. The ticket is not the pizza — it is a promise about a pizza that will exist soon.',
      'Eventually one of two things happens: your number is called and you get your pizza (success), or they come out and say "we are out of dough, sorry" (failure).',
      'A JavaScript Promise works the same way: it is an object you get immediately that represents a result coming later. You attach a "when it succeeds, do this" note and a "when it fails, do this" note, and the kitchen (the async work) decides which one runs.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some operations take time — fetching data from a server, reading a file. JavaScript cannot freeze and wait, so it needs a way to say "this answer will come later".',
    'A Promise is an object that stands in for that future answer. The moment you start the work, you get the Promise back immediately, even though the answer is not ready yet.',
    'A Promise is always in one of three states: pending (still waiting), fulfilled (succeeded with a value), or rejected (failed with a reason). It moves from pending to one of the other two exactly once and then never changes.',
    'You react to it with .then (run this when it succeeds) and .catch (run this when it fails). You can chain .then calls to do steps in order, keeping the code flat instead of nested.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Promise is an object representing the eventual completion (or failure) of an asynchronous operation and its resulting value. It has three states — pending, fulfilled, rejected — and transitions from pending to one settled state exactly once, irreversibly.',
    how: 'You create a Promise with new Promise((resolve, reject) => {...}); the executor runs immediately and you call resolve(value) on success or reject(reason) on failure. Consumers attach handlers via .then(onFulfilled, onRejected), .catch(onRejected), and .finally(onSettled). .then returns a NEW Promise, which is what makes Promises chainable.',
    why: 'Promises give async work a first-class return value you can pass around, compose, and chain, with a single unified error path — eliminating callback hell and inversion of control.',
    code: {
      label: 'Creating and consuming a Promise',
      lang: 'js',
      code: `const fetchUser = (id) =>\n  new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (id > 0) resolve({ id, name: 'Sam' })\n      else reject(new Error('invalid id'))\n    }, 100)\n  })\n\nfetchUser(1)\n  .then(user => console.log('got', user.name)) // got Sam\n  .catch(err => console.error(err.message))\n  .finally(() => console.log('done'))`,
      explanation: [
        'new Promise takes an executor with resolve and reject; the executor runs synchronously and immediately.',
        'After 100ms, resolve({...}) settles the Promise as fulfilled with that value (or reject for an error).',
        '.then receives the fulfilled value; .catch receives any rejection reason.',
        '.finally runs regardless of success or failure — good for cleanup like hiding a spinner.',
        'fetchUser returns the Promise instantly; the value arrives later via the handlers.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Promise is a proxy object (per the Promises/A+ spec, integrated into ECMAScript) for a value not necessarily known at creation time. It is a state machine with three states — pending, fulfilled (with a value), and rejected (with a reason) — that transitions from pending to exactly one settled state, irreversibly. Consumers register reactions via .then/.catch/.finally; each call returns a new Promise, enabling chaining. Reactions are scheduled on the microtask queue and run after the current synchronous execution completes. Returning a value from a reaction fulfills the derived Promise; returning a thenable causes the derived Promise to adopt its eventual state; throwing rejects it.',

  // 7. Internal Working
  internalWorking: [
    'When you call new Promise(executor), the engine creates a Promise object in the pending state and synchronously invokes the executor with two functions: resolve and reject.',
    'Calling resolve(value) transitions the Promise to fulfilled and stores the value; calling reject(reason) transitions it to rejected and stores the reason. Only the first call wins — subsequent calls are ignored.',
    'If resolve is called with a thenable (another Promise), the Promise does not settle immediately; it "adopts" the thenable, waiting for it to settle before propagating its state.',
    '.then registers fulfillment/rejection reactions and returns a NEW Promise. If the Promise is already settled, the reaction is scheduled immediately on the microtask queue; if still pending, the reaction is stored and scheduled when it settles.',
    'When the Promise settles, the engine enqueues the appropriate reactions as microtasks. The microtask queue drains completely after the current synchronous task and before the next macrotask (timer, I/O, rendering).',
    'The value a reaction returns resolves the derived Promise; a thrown error rejects it; a returned thenable is adopted. This resolution procedure is what lets errors and values propagate down the chain until a matching handler is found.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `             new Promise(executor)
                     │
                     ▼
            ┌──────────────────┐
            │     PENDING      │
            └───────┬──────────┘
           resolve(v)│  reject(r)
            ┌────────┴─────────┐
            ▼                  ▼
     ┌────────────┐     ┌────────────┐
     │ FULFILLED  │     │  REJECTED  │   (settled once, forever)
     │  value: v  │     │ reason: r  │
     └─────┬──────┘     └─────┬──────┘
           │ .then(onF)       │ .catch(onR)
           ▼                  ▼
       returns a NEW promise (chainable)
       reactions run on the MICROTASK queue`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: each Promise is a heap object holding its state, settled value/reason, and a list of registered reaction records.',
    'A pending Promise keeps its reactions (and anything they capture via closures) alive until it settles — a never-settling Promise can leak those.',
    'MICROTASK QUEUE: when a Promise settles, its reaction callbacks are pushed here; the engine drains this queue fully before the next macrotask.',
    'Chained Promises form a linked structure: each .then\'s derived Promise references its parent\'s reactions, so the whole chain stays reachable until it fully settles.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — resolve and reject',
      lang: 'js',
      code: `const ok = Promise.resolve(42)\nok.then(v => console.log(v)) // 42\n\nconst bad = Promise.reject(new Error('nope'))\nbad.catch(e => console.log(e.message)) // nope`,
      explanation: [
        'Promise.resolve(v) creates an already-fulfilled Promise — handy for tests and adapting sync values.',
        'Promise.reject(r) creates an already-rejected Promise.',
        '.then runs for fulfillment, .catch for rejection.',
        'Even already-settled Promises run their reactions asynchronously (as microtasks), not inline.',
      ],
    },
    intermediate: {
      label: 'Intermediate — chaining and value transformation',
      lang: 'js',
      code: `Promise.resolve(2)\n  .then(n => n * 10)      // returns 20\n  .then(n => n + 1)       // returns 21\n  .then(n => { throw new Error('boom at ' + n) })\n  .then(() => console.log('skipped'))\n  .catch(e => console.log('caught:', e.message)) // caught: boom at 21`,
      explanation: [
        'Each .then returns a value, which becomes the input to the next .then.',
        'A non-Promise return value is wrapped and passed along automatically.',
        'Throwing inside a handler rejects the derived Promise, skipping subsequent .then handlers.',
        'The rejection skips down the chain until it hits a .catch (or rejection handler).',
        'This propagation is why one .catch at the end can guard the whole chain.',
      ],
    },
    advanced: {
      label: 'Advanced — adoption, finally, and error recovery',
      lang: 'js',
      code: `function withRetry(fn, attempts = 3) {\n  return fn().catch(err => {\n    if (attempts <= 1) throw err\n    return withRetry(fn, attempts - 1) // adopt the retried Promise\n  })\n}\n\nlet tries = 0\nconst flaky = () =>\n  new Promise((res, rej) => (++tries < 3 ? rej(new Error('fail ' + tries)) : res('ok')))\n\nwithRetry(flaky)\n  .then(v => console.log('result:', v)) // result: ok\n  .catch(e => console.log('gave up:', e.message))\n  .finally(() => console.log('attempts:', tries))`,
      explanation: [
        '.catch can RECOVER by returning a value (or another Promise) instead of re-throwing.',
        'Returning withRetry(...) adopts the new Promise — the chain waits for the retried attempt.',
        'If attempts run out, re-throwing propagates the error to the outer .catch.',
        '.finally runs once at the end regardless of outcome and does not alter the resolved value.',
        'This recursive-retry shape is common in production HTTP clients.',
      ],
    },
    realProject: {
      label: 'Real project — data loading in a Vue composable',
      lang: 'js',
      code: `import { ref } from 'vue'\n\nexport function useUser(id) {\n  const data = ref(null)\n  const error = ref(null)\n  const loading = ref(true)\n\n  fetch('/api/users/' + id)\n    .then(res => {\n      if (!res.ok) throw new Error('HTTP ' + res.status)\n      return res.json()\n    })\n    .then(json => { data.value = json })\n    .catch(err => { error.value = err })\n    .finally(() => { loading.value = false })\n\n  return { data, error, loading }\n}`,
      explanation: [
        'fetch returns a Promise; the composable returns reactive refs immediately while the request is in flight.',
        'res.ok is checked explicitly because fetch does NOT reject on HTTP error statuses (404/500).',
        'res.json() itself returns a Promise, so it is returned to keep the chain flat.',
        '.catch centralizes error handling into the error ref; .finally always clears the loading flag.',
        'This is the canonical loading/error/data triad used across Vue and React data hooks.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Promise and what are its states?',
      answer: 'A Promise is an object representing the eventual result of an asynchronous operation. It has three states: pending (initial), fulfilled (succeeded with a value), and rejected (failed with a reason). It settles from pending to exactly one of those, once and irreversibly.',
      explanation: 'Naming all three states and stressing the once-and-irreversible transition is the marker of a solid answer.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between .then, .catch, and .finally?',
      answer: '.then(onFulfilled, onRejected) handles fulfillment (and optionally rejection); .catch(onRejected) handles rejection and is sugar for .then(undefined, onRejected); .finally(onSettled) runs on either outcome for cleanup and passes the value/reason through unchanged.',
      explanation: 'Mentioning that .catch is .then(undefined, fn) and that .finally is transparent to the value shows precise understanding.',
    },
    {
      level: 'intermediate',
      question: 'Why does the executor run synchronously but .then handlers run asynchronously?',
      answer: 'The executor passed to new Promise runs immediately and synchronously so it can kick off the work. The .then/.catch reactions, however, are always scheduled on the microtask queue and run after the current synchronous code completes — even if the Promise is already settled.',
      explanation: 'This guarantees consistent ordering and avoids the "release Zalgo" problem where a callback sometimes fires sync and sometimes async.',
    },
    {
      level: 'intermediate',
      question: 'What happens when you return a value vs return a Promise from a .then handler?',
      answer: 'Returning a plain value fulfills the derived Promise with that value. Returning a Promise (or thenable) causes the derived Promise to adopt its state — the chain waits for the returned Promise to settle, then continues with its outcome.',
      explanation: 'Adoption is the mechanism that flattens nested async steps; forgetting to return breaks it.',
    },
    {
      level: 'advanced',
      question: 'How do Promise reactions interact with the event loop and microtask queue?',
      answer: 'When a Promise settles, its reactions are enqueued as microtasks. The microtask queue is drained completely after each macrotask and before the next one (and before rendering). So Promise callbacks run before setTimeout callbacks scheduled at the same time.',
      explanation: 'Connecting Promises to microtasks vs macrotasks is the classic intermediate-to-senior discriminator, often tested with an ordering puzzle.',
    },
    {
      level: 'senior',
      question: 'What is an unhandled rejection and how do you handle it at scale?',
      answer: 'A rejected Promise with no rejection handler in its chain triggers an unhandledrejection event (browser) or unhandledRejection process event (Node). In production you listen for these to log/alert, and you ensure every chain has a .catch or is awaited inside try/catch. Node can be configured to crash on unhandled rejections to fail fast.',
      explanation: 'Senior signal: treating unhandled rejections as observable, monitorable failures rather than silent ones, and knowing the runtime hooks.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why do already-resolved Promises still defer their .then callbacks to a microtask?',
    'What is the difference between Promise.resolve(p) and new Promise(r => r(p))?',
    'How does async/await map onto Promises under the hood?',
    'What is the difference between returning and not returning inside .then?',
    'How do Promise.all, allSettled, race, and any differ?',
    'Can a Promise be cancelled? (no native cancellation — AbortController for the underlying op)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to return inside .then so the next handler does not wait.',
      why: 'Without return, the derived Promise fulfills with undefined immediately instead of adopting the inner Promise, breaking sequencing.',
      fix: 'Always return the value or Promise from a .then handler, or use async/await where await makes it explicit.',
    },
    {
      mistake: 'Treating fetch as rejecting on HTTP error statuses.',
      why: 'fetch only rejects on network failure; a 404 or 500 still fulfills with a response whose ok is false.',
      fix: 'Check res.ok (or res.status) and throw explicitly to route HTTP errors into .catch.',
    },
    {
      mistake: 'Creating a chain with no .catch (or unhandled awaited rejection).',
      why: 'An unhandled rejection is silently swallowed in old environments or triggers warnings/crashes in modern ones.',
      fix: 'End every chain with .catch, or await inside try/catch, and add global unhandledrejection logging.',
    },
    {
      mistake: 'The Promise constructor anti-pattern: wrapping an existing Promise in new Promise.',
      why: 'It adds an extra layer, drops errors easily, and is redundant since the value is already a Promise.',
      fix: 'Just return or chain the existing Promise; only use new Promise to wrap genuinely callback/event-based APIs.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Data fetching in useEffect uses Promise-returning fetch/axios; results set state in .then, errors in .catch. Libraries like React Query manage Promise lifecycles (loading/error/data) for you.' },
    { area: 'Vue', detail: 'Composables and stores return Promises or async functions; reactive refs for loading/error/data are updated in .then/.catch/.finally, exactly the loading triad shown above.' },
    { area: 'Node.js', detail: 'fs.promises, the modern DB drivers, and HTTP clients all return Promises; route handlers chain or await them and funnel errors to one error-handling middleware.' },
    { area: 'Backend', detail: 'Service orchestration composes Promises — sequential dependencies via chaining, independent calls via Promise.all — with retries and timeouts layered on for resilience.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Promises add negligible overhead relative to the I/O they coordinate and make parallelization (Promise.all) trivial, cutting latency.',
      'Microtask scheduling is fast and batched, so resolved Promise chains run efficiently right after the current task.',
    ],
    bad: [
      'Flooding the microtask queue (e.g. resolving thousands of Promises in a tight synchronous loop) can starve macrotasks like rendering and timers.',
      'Over-sequentializing independent work with long chains wastes wall-clock time when Promise.all would run them concurrently.',
    ],
    optimizations: [
      'Run independent async work concurrently with Promise.all / allSettled instead of chaining.',
      'Avoid creating unnecessary Promises (the new Promise wrapper anti-pattern) in hot paths.',
      'Batch or throttle work that would otherwise enqueue huge bursts of microtasks.',
      'Prefer async/await for readability — it compiles to the same Promise machinery with no runtime penalty.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Unhandled rejections can hide security-relevant failures (e.g. an auth check that threw) so the code proceeds as if it succeeded.',
      'Swallowing errors with empty .catch blocks can mask injection or validation failures, leaving the app in an inconsistent state.',
    ],
    bestPractices: [
      'Never use empty .catch blocks; log and handle, or rethrow.',
      'Add global unhandledrejection / unhandledRejection handlers to capture and alert on silent async failures.',
      'Validate and check response status before trusting fetched data, and fail closed on auth/permission errors.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['callbacks', 'callback-hell', 'event-loop', 'microtask-queue'],
    nextConcepts: ['async-await', 'promise-combinators', 'async-error-handling', 'fetch-api', 'abortcontroller'],
    dependencyNote:
      'Promises sit at the center of the async spine: they grow out of callbacks/callback-hell and the event loop, and they underpin async/await, the combinators, fetch, and cancellation. Master them before anything async/await-related.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labeled PENDING with two arrows out: resolve→FULFILLED and reject→REJECTED.',
      'Note next to it: "settles once, then frozen forever".',
      'Draw .then hanging off FULFILLED and .catch off REJECTED; show each returns a NEW box (chainable).',
      'Write "reactions → MICROTASK queue" beside the arrows.',
      'Say: "A Promise is a state machine for a future value; .then transforms it, returns a new Promise, and errors fall through to the first .catch."',
    ],
    diagram: `   PENDING ──resolve──► FULFILLED ──.then──► (new promise)
        │                                  │ throw/reject
        └────reject──► REJECTED ──.catch──►┘
   reactions scheduled on the MICROTASK queue (after sync, before timers)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Promise is an object for a future value with three states — pending, fulfilled, rejected — that settles once and irreversibly. The executor runs synchronously; .then/.catch/.finally reactions run later as microtasks. .then returns a new Promise, so you chain steps; returning a Promise from a handler makes the chain wait (adoption), and thrown errors fall through to the first .catch. Promises replaced callback hell and are the basis of async/await and the combinators.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Promise is an object that represents the eventual result of an asynchronous operation. It is a state machine with three states: pending, fulfilled with a value, or rejected with a reason. It transitions from pending to exactly one settled state, once and irreversibly, which makes async results predictable. You create one with new Promise, whose executor runs synchronously and calls resolve or reject. Consumers attach reactions with .then, .catch, and .finally. Crucially, .then returns a new Promise, so you can chain: each handler\'s return value becomes the next handler\'s input, and returning a Promise causes the chain to adopt it and wait. A thrown error or rejection skips the remaining .then handlers and falls through to the first .catch, which gives you a single unified error path — the big win over callback hell. Reactions never run inline; they are scheduled on the microtask queue and run after the current synchronous code but before the next macrotask like a timer, which is why Promise callbacks beat setTimeout in ordering puzzles. The main pitfalls are forgetting to return inside .then, assuming fetch rejects on HTTP errors, and leaving chains without a .catch, which produces unhandled rejections. Promises are also the substrate for async/await and the combinators like Promise.all.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Promises model a single future value, not a stream of values — for multiple/ongoing emissions you need async iterators or observables (RxJS).',
      'No built-in cancellation: a Promise cannot be cancelled, so cancellation is bolted on via AbortController at the operation level, which can leave the Promise pending forever.',
    ],
    edgeCases: [
      'resolve called with a thenable triggers adoption, so resolution can be deferred and even loop if a Promise resolves to itself (the spec rejects self-resolution with a TypeError).',
      'Reactions on an already-settled Promise still defer to a microtask — never inline — to avoid the "release Zalgo" inconsistent-timing bug.',
      'A rejection with no handler at settle time becomes an unhandled rejection; attaching a handler later may still have fired the warning.',
    ],
    runtimeBehavior: [
      'Microtask draining is complete and reentrant: microtasks scheduled by microtasks run before the next macrotask, which can starve rendering/timers if unbounded.',
      'Each .then allocates a new Promise and reaction record; extremely long chains add allocation/GC pressure.',
      'await suspends an async function and resumes it as a microtask when the awaited Promise settles, preserving the same ordering guarantees as .then.',
    ],
    scalability: [
      'Fan-out with Promise.all parallelizes independent I/O and is the primary latency lever; cap concurrency with a pool for very large fan-outs to avoid resource exhaustion.',
      'Unbounded Promise creation (e.g. mapping over a huge array to fetches) can overwhelm connection pools; throttle with a concurrency limiter.',
    ],
    productionConcerns: [
      'Monitor unhandled rejections as first-class incidents; configure Node to fail fast if appropriate.',
      'Avoid the new Promise wrapper anti-pattern, which is a common source of dropped errors.',
      'Add timeouts (Promise.race with a timer) so a never-settling Promise does not hang requests indefinitely.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Promise = object for a future value; states: pending → fulfilled / rejected.',
    'Settles once, irreversibly; first resolve/reject wins.',
    'Executor runs SYNC; .then/.catch/.finally reactions run as MICROTASKS.',
    '.then returns a NEW Promise → chainable.',
    'Return a value → fulfill; return a Promise → adopt (wait); throw → reject.',
    '.catch = .then(undefined, onRejected); .finally is value-transparent.',
    'Errors fall through to the first matching .catch.',
    'fetch does NOT reject on 404/500 — check res.ok.',
    'No native cancellation; use AbortController on the operation.',
    'Unhandled rejection → warning/crash; always .catch or await in try/catch.',
    'Promise.resolve / Promise.reject create pre-settled Promises.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function delay(ms) that returns a Promise resolving after ms milliseconds.',
      hint: 'Wrap setTimeout in new Promise and call resolve in the callback.',
      solution: {
        lang: 'js',
        code: `function delay(ms) {\n  return new Promise(resolve => setTimeout(resolve, ms))\n}\n\ndelay(500).then(() => console.log('half a second later'))`,
        explanation: [
          'setTimeout calls resolve after ms; no value is needed so resolve is passed directly.',
          'This delay helper is a building block for timeouts, retries, and throttling.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict the output order: console.log(1); Promise.resolve().then(() => console.log(2)); setTimeout(() => console.log(3), 0); console.log(4).',
      hint: 'Sync first, then microtasks, then macrotasks.',
      solution: {
        lang: 'js',
        code: `console.log(1)\nPromise.resolve().then(() => console.log(2))\nsetTimeout(() => console.log(3), 0)\nconsole.log(4)\n// Output: 1, 4, 2, 3`,
        explanation: [
          '1 and 4 are synchronous and run first, in order.',
          'The .then callback (2) is a microtask, drained after sync code finishes.',
          'The setTimeout callback (3) is a macrotask, which runs only after the microtask queue is empty.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement promiseWithTimeout(promise, ms) that rejects with a timeout error if the promise does not settle within ms.',
      hint: 'Race the input promise against a delayed rejection.',
      solution: {
        lang: 'js',
        code: `function promiseWithTimeout(promise, ms) {\n  const timeout = new Promise((_, reject) =>\n    setTimeout(() => reject(new Error('timeout after ' + ms + 'ms')), ms)\n  )\n  return Promise.race([promise, timeout])\n}\n\n// promiseWithTimeout(fetch('/slow'), 2000).then(...).catch(...)`,
        explanation: [
          'Promise.race settles as soon as the FIRST input settles.',
          'If the real promise wins, you get its result; if the timer wins, you get a rejection.',
          'Note the original promise keeps running; race does not cancel it — combine with AbortController to truly stop work.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a minimal Promise-based retry(fn, attempts) that retries fn (a Promise-returning function) up to N times before rejecting.',
      hint: 'On rejection, decrement attempts and recurse; rethrow when exhausted.',
      solution: {
        lang: 'js',
        code: `function retry(fn, attempts = 3) {\n  return fn().catch(err => {\n    if (attempts <= 1) throw err\n    return retry(fn, attempts - 1)\n  })\n}\n\n// retry(() => fetch('/flaky').then(r => r.json()), 5)\n//   .then(console.log)\n//   .catch(e => console.error('all retries failed', e))`,
        explanation: [
          'fn() is invoked; if it rejects, .catch inspects remaining attempts.',
          'When attempts are exhausted, re-throwing propagates the final error.',
          'Otherwise it returns retry(...) — adoption makes the chain wait for the next attempt.',
          'In production you would add a backoff delay between attempts using the delay helper.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Promises are arguably the most important async concept in JavaScript — everything modern (fetch, async/await, combinators, framework data hooks) is built on them. Truly understanding the state machine and microtask scheduling makes a huge range of "tricky" async questions straightforward.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition, the three states, and the difference between .then and .catch. Product companies (Zoho, Flipkart, Razorpay) ask you to implement delay, timeout, retry, or even a mini-Promise. FAANG-level interviews give output-ordering puzzles mixing sync code, Promises, and setTimeout, and probe microtask scheduling and unhandled rejections.',
    whatInterviewersExpect:
      'They expect you to define the state machine precisely, explain sync executor vs async reactions, demonstrate chaining and error propagation, solve a microtask/macrotask ordering puzzle, and connect Promises to async/await and the combinators.',
  },
}

export default promises
