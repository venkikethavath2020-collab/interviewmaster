import type { ConceptLesson } from '../../../types/lesson'

const promiseCombinators: ConceptLesson = {
  // 1. Concept Summary
  slug: 'promise-combinators',
  name: 'Promise Combinators',
  category: 'async',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Combinators (Promise.all, allSettled, race, any) are how you coordinate MULTIPLE async operations — the difference between fast parallel code and slow sequential code.',
    'Choosing the wrong combinator causes real bugs: Promise.all fails the whole batch if one item fails, when you often wanted allSettled to collect partial results.',
    'Interviewers use them to test whether you understand parallelism, error semantics, and short-circuiting — not just single-Promise basics.',
    'They power dashboards, batch loaders, timeouts, and fastest-source patterns that are everywhere in production frontends and backends.',
    'Knowing the exact resolve/reject semantics of each combinator (and which short-circuit) is a strong intermediate-to-senior signal.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The combinators are four different rules for waiting on a group of friends to finish a race.',
    story: [
      'Imagine you send four friends to fetch different snacks and you are waiting for them to come back.',
      'Promise.all is the strict rule: "I only start the party when ALL of you are back — and if even one of you gets lost, the whole party is cancelled."',
      'Promise.allSettled is the kind rule: "Come back whenever; I will wait for everyone and then just note who succeeded and who failed — nobody ruins it for the others."',
      'Promise.race is the impatient rule: "The very first person back decides everything — good news or bad news, whoever arrives first wins." And Promise.any is "the first person back with GOOD snacks wins; I ignore the ones who failed unless everybody fails."',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Often you have several asynchronous tasks running at the same time and you need a single Promise that represents the whole group.',
    'JavaScript gives you four built-in helpers, called combinators, that take an array (iterable) of Promises and return one new Promise describing the group.',
    'Promise.all waits for every task and fails if any one fails. Promise.allSettled waits for every task and never fails — it reports each result as fulfilled or rejected.',
    'Promise.race settles as soon as the first task settles (success or failure). Promise.any settles with the first SUCCESS, and only fails if every task fails.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Promise combinators are static methods on Promise that take an iterable of promises and return a single promise representing the group: Promise.all (all succeed or first failure), Promise.allSettled (wait for all, report each), Promise.race (first to settle wins), and Promise.any (first to fulfill wins, AggregateError if all reject).',
    how: 'You pass an array of promises. The combinator subscribes to all of them and aggregates their outcomes according to its rule. all and allSettled return arrays; allSettled wraps each in a {status, value/reason} object; race and any return a single value/reason. all and race short-circuit (settle early) on the first qualifying event.',
    why: 'They let you run independent async work concurrently and combine the outcomes cleanly, instead of awaiting one after another (slow) or hand-writing counters and flags.',
    code: {
      label: 'The four combinators side by side',
      lang: 'js',
      code: `const p = (v, ms, fail) =>\n  new Promise((res, rej) => setTimeout(() => (fail ? rej(v) : res(v)), ms))\n\n// all → array of values, or rejects on first failure\nPromise.all([p(1, 50), p(2, 30)]).then(r => console.log('all', r)) // all [1,2]\n\n// allSettled → array of {status,...}, never rejects\nPromise.allSettled([p(1, 50), p('x', 30, true)])\n  .then(r => console.log('allSettled', r))\n\n// race → first to settle (here the 30ms one)\nPromise.race([p(1, 50), p(2, 30)]).then(r => console.log('race', r)) // race 2\n\n// any → first to FULFILL (ignores rejections unless all fail)\nPromise.any([p('e', 20, true), p('ok', 40)]).then(r => console.log('any', r)) // any ok`,
      explanation: [
        'p is a helper that resolves or rejects with a value after ms milliseconds.',
        'Promise.all resolves with [1, 2] in input order once both succeed.',
        'Promise.allSettled resolves with one object per input describing fulfilled/rejected, regardless of failures.',
        'Promise.race resolves with 2 because that promise settled first (30ms < 50ms).',
        'Promise.any skips the early rejection and resolves with the first fulfillment, "ok".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Promise combinators are static Promise methods that accept an iterable of promises (or values, which are coerced via Promise.resolve) and return a single aggregate promise. Promise.all fulfills with an ordered array of values when all inputs fulfill and rejects (short-circuiting) with the first rejection reason. Promise.allSettled fulfills with an ordered array of result descriptors ({status:"fulfilled",value} | {status:"rejected",reason}) and never rejects. Promise.race settles with the outcome of the first input to settle, fulfilling or rejecting accordingly. Promise.any fulfills with the first input to fulfill and rejects with an AggregateError only if every input rejects. all/race short-circuit; allSettled/any always wait for the determining condition.',

  // 7. Internal Working
  internalWorking: [
    'The combinator iterates the input synchronously, calling Promise.resolve on each element to coerce plain values into promises and to subscribe with internal .then reactions.',
    'It maintains internal state: a results array (sized to the iterable length), a remaining counter, and a settled flag so it resolves/rejects exactly once.',
    'For Promise.all, each fulfillment writes its value into the results array at its original index and decrements the counter; when the counter hits zero it fulfills. Any rejection immediately rejects the aggregate (short-circuit) and ignores later settlements.',
    'For Promise.allSettled, each settlement writes a descriptor object at its index and decrements the counter; the aggregate fulfills only when the counter reaches zero — it never rejects.',
    'For Promise.race, the first settlement (fulfill OR reject) settles the aggregate with that outcome; subsequent settlements are ignored.',
    'For Promise.any, the first fulfillment fulfills the aggregate; rejections are collected, and only when all inputs have rejected does it reject with an AggregateError whose .errors holds every reason. All reactions still run via the microtask queue.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  INPUT: [ p1, p2, p3 ]  (all start running concurrently)

  Promise.all        → wait ALL fulfilled → [v1,v2,v3]
                       any reject?        → reject FIRST reason (short-circuit)

  Promise.allSettled → wait ALL settled  → [{status,value|reason}, ...]
                       (never rejects)

  Promise.race       → FIRST to settle   → that value OR reason
                       (success or failure, whoever is first)

  Promise.any        → FIRST to FULFILL  → that value
                       all reject?        → AggregateError(errors[])`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — parallel fetch with Promise.all',
      lang: 'js',
      code: `const ids = [1, 2, 3]\nPromise.all(ids.map(id => fetch('/api/u/' + id).then(r => r.json())))\n  .then(users => console.log('all users', users))\n  .catch(err => console.error('one failed:', err))`,
      explanation: [
        'ids.map produces an array of in-flight fetch promises that run concurrently.',
        'Promise.all resolves with the user objects in the SAME order as the ids, regardless of completion order.',
        'If ANY request fails, the whole .then is skipped and .catch fires with the first rejection.',
        'This is the canonical "load several things at once" pattern.',
      ],
    },
    intermediate: {
      label: 'Intermediate — partial results with allSettled',
      lang: 'js',
      code: `const urls = ['/a', '/b-broken', '/c']\nPromise.allSettled(urls.map(u => fetch(u).then(r => r.json())))\n  .then(results => {\n    const ok = results.filter(r => r.status === 'fulfilled').map(r => r.value)\n    const failed = results.filter(r => r.status === 'rejected').map(r => r.reason)\n    console.log('succeeded:', ok, 'failed:', failed.length)\n  })`,
      explanation: [
        'allSettled never rejects, so one broken URL does not discard the others.',
        'Each result is {status, value} for fulfilled or {status, reason} for rejected.',
        'You filter by status to separate successes from failures — ideal for dashboards and bulk imports.',
        'Use this whenever partial success is acceptable and you want every outcome.',
      ],
    },
    advanced: {
      label: 'Advanced — timeout with race, fastest-source with any',
      lang: 'js',
      code: `const timeout = (ms) =>\n  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))\n\n// race: fail if the request is slower than 3s\nPromise.race([fetch('/slow'), timeout(3000)])\n  .then(r => console.log('won in time'))\n  .catch(e => console.error(e.message))\n\n// any: take whichever mirror responds first, ignore individual failures\nPromise.any([fetch('https://m1/x'), fetch('https://m2/x'), fetch('https://m3/x')])\n  .then(r => console.log('fastest mirror responded'))\n  .catch(e => console.error('all mirrors down', e.errors))`,
      explanation: [
        'Promise.race against a timeout rejects if the real work is too slow — a common request-timeout pattern.',
        'Note race does not cancel the loser; pair with AbortController to stop the slow request.',
        'Promise.any returns the first SUCCESSFUL mirror and tolerates individual failures.',
        'If every mirror fails, any rejects with an AggregateError whose .errors lists each reason.',
      ],
    },
    realProject: {
      label: 'Real project — concurrent dashboard load in a Vue store',
      lang: 'js',
      code: `async function loadDashboard() {\n  const [profile, orders, notifications] = await Promise.all([\n    fetch('/api/profile').then(r => r.json()),\n    fetch('/api/orders').then(r => r.json()),\n    fetch('/api/notifications').then(r => r.json()),\n  ])\n  return { profile, orders, notifications }\n}\n\n// resilient variant: show whatever loaded\nasync function loadDashboardResilient() {\n  const results = await Promise.allSettled([\n    fetch('/api/profile').then(r => r.json()),\n    fetch('/api/orders').then(r => r.json()),\n    fetch('/api/notifications').then(r => r.json()),\n  ])\n  return results.map(r => (r.status === 'fulfilled' ? r.value : null))\n}`,
      explanation: [
        'Promise.all loads three independent widgets concurrently — total time is the slowest request, not the sum.',
        'Destructuring preserves order, so each variable maps to its endpoint.',
        'The resilient variant uses allSettled so one failing widget does not blank the whole dashboard.',
        'This is exactly how Pinia/Vuex actions and React data layers orchestrate multi-source loads.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does Promise.all do and when does it reject?',
      answer: 'Promise.all takes an iterable of promises and returns a promise that fulfills with an array of their values in input order once they all fulfill. It rejects immediately (short-circuits) with the reason of the first promise that rejects.',
      explanation: 'Stressing "in input order" and "rejects on the first failure" is what distinguishes a precise answer.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between Promise.all and Promise.allSettled?',
      answer: 'Promise.all fails the whole batch if any promise rejects and gives you raw values. Promise.allSettled always waits for all and never rejects, giving an array of {status, value} or {status, reason} descriptors so you can handle partial success.',
      explanation: 'The key is the "all-or-nothing vs collect everything" distinction — a frequent practical decision.',
    },
    {
      level: 'intermediate',
      question: 'When would you use Promise.race vs Promise.any?',
      answer: 'Use race when the FIRST settlement (success or failure) should decide, e.g. racing a request against a timeout. Use any when you want the first SUCCESS and want to ignore individual failures, e.g. querying multiple mirrors; it only rejects (with AggregateError) if all reject.',
      explanation: 'The discriminator is "first to settle" (race) vs "first to fulfill" (any) and their failure semantics.',
    },
    {
      level: 'intermediate',
      question: 'Does Promise.all run the promises in parallel or start them itself?',
      answer: 'It does not start anything — the promises are already running when you pass them in (they begin at creation). Promise.all just subscribes to all of them and aggregates. So concurrency comes from creating the promises eagerly, e.g. via array.map.',
      explanation: 'A subtle but important point: combinators coordinate already-running work; they do not launch it.',
    },
    {
      level: 'advanced',
      question: 'What does Promise.race resolve to if you pass an empty array, and what about Promise.all([])?',
      answer: 'Promise.all([]) fulfills immediately with an empty array. Promise.any([]) rejects immediately with an AggregateError (no promises to fulfill). Promise.race([]) stays pending forever, since nothing can ever settle it. allSettled([]) fulfills with an empty array.',
      explanation: 'The empty-iterable edge cases — especially race never settling — are classic senior gotchas.',
    },
    {
      level: 'senior',
      question: 'Promise.race rejects if the timeout wins, but the slow request keeps running. How do you actually cancel it?',
      answer: 'Combinators do not cancel losing promises. To stop the underlying work you use AbortController: pass its signal to fetch, and abort it when the timeout wins (or in finally). The promise still rejects via the abort, but now the network request is genuinely cancelled and resources freed.',
      explanation: 'Senior signal: knowing that race/any leave losers running and that real cancellation requires AbortController.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you limit concurrency when you have thousands of promises (a promise pool)?',
    'What is AggregateError and where does it appear?',
    'How do you preserve input order if results arrive out of order?',
    'Why does Promise.race never settle on an empty array?',
    'How would you implement Promise.all yourself?',
    'How do you cancel the losing promises in a race?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using Promise.all when partial success should be tolerated.',
      why: 'One rejected promise discards all the successful results, blanking a dashboard or aborting a bulk import.',
      fix: 'Use Promise.allSettled and handle each result by status when partial success is acceptable.',
    },
    {
      mistake: 'Awaiting promises one-by-one in a loop when they are independent.',
      why: 'Sequential awaits make total time the SUM of latencies instead of the max; it is needlessly slow.',
      fix: 'Create the promises up front (map) and await them together with Promise.all.',
    },
    {
      mistake: 'Assuming Promise.race cancels the slower promise.',
      why: 'The loser keeps running and consuming resources; only the aggregate result is decided.',
      fix: 'Use AbortController to actually cancel the losing operation (e.g. abort the fetch in finally).',
    },
    {
      mistake: 'Firing thousands of fetches via Promise.all at once.',
      why: 'It overwhelms the network/connection pool and can crash the server or trip rate limits.',
      fix: 'Use a concurrency-limited pool (process N at a time) instead of an unbounded Promise.all.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia/Vuex actions use Promise.all to load multiple resources for a view concurrently; allSettled keeps a dashboard usable when one widget endpoint is down.' },
    { area: 'React', detail: 'Route loaders (React Router) and data layers fan out with Promise.all; React Query parallelizes independent queries and surfaces per-query errors similar to allSettled.' },
    { area: 'Node.js', detail: 'Backends fan out to microservices with Promise.all, add timeouts via Promise.race, and use Promise.any to take the fastest of redundant providers.' },
    { area: 'Backend', detail: 'Bulk jobs use a concurrency-limited pool (chunks + Promise.all) to avoid exhausting DB connections; allSettled aggregates per-item success/failure for reporting.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Promise.all turns N sequential latencies into the latency of the slowest item — the single biggest async speedup.',
      'allSettled lets you proceed with partial data immediately instead of blocking on a flaky dependency.',
    ],
    bad: [
      'Unbounded Promise.all over a huge array can saturate the network/connection pool and degrade or crash the system.',
      'race/any leave losing operations running, wasting bandwidth and server resources unless you cancel them.',
    ],
    optimizations: [
      'Cap concurrency with a promise pool (e.g. process in chunks or with a limiter library) for large fan-outs.',
      'Combine race with AbortController so timeouts free resources, not just resolve the aggregate.',
      'Prefer allSettled when partial success unblocks the UI faster than waiting for everything.',
      'Start independent promises eagerly (map) so they actually run in parallel before awaiting.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'async-await', 'event-loop', 'microtask-queue'],
    nextConcepts: ['concurrency-patterns', 'async-error-handling', 'abortcontroller', 'fetch-api'],
    dependencyNote:
      'Combinators build directly on Promises and async/await. They are the gateway to concurrency-patterns (pools, throttling) and pair with AbortController for cancellation and async-error-handling for robust aggregation.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three promise circles feeding into one aggregate box.',
      'Label four arrows out of the box: all (wait all / fail-fast), allSettled (wait all / never fail), race (first settle), any (first fulfill).',
      'Write the result shape under each: all/allSettled → arrays; race/any → single value.',
      'Mark which short-circuit: all (on first reject) and race (on first settle).',
      'Say: "Pick by error tolerance and timing: all-or-nothing → all; partial OK → allSettled; first → race; first success → any."',
    ],
    diagram: `        p1 ─┐
        p2 ─┼──► COMBINATOR ──► aggregate promise
        p3 ─┘
   all       : ALL fulfilled → [v...] | first reject → reject
   allSettled: ALL settled   → [{status,...}]
   race      : first SETTLE  → value/reason
   any       : first FULFILL → value | all reject → AggregateError`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Combinators coordinate multiple promises. Promise.all waits for all and rejects on the first failure (ordered value array). Promise.allSettled waits for all and never rejects, returning {status,value|reason} descriptors for partial success. Promise.race settles with the first to settle (success OR failure). Promise.any settles with the first success and only rejects (AggregateError) if all fail. all and race short-circuit; allSettled and any wait for the determining condition. They coordinate already-running work and do not cancel losers — pair race with AbortController.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Promise combinators are static methods that take an iterable of promises and return one aggregate promise, letting you coordinate concurrent async work. Promise.all fulfills with an ordered array of values once every input fulfills, but rejects immediately with the first rejection reason — all or nothing. Promise.allSettled also waits for everything but never rejects; it gives you a descriptor per promise, either {status:"fulfilled",value} or {status:"rejected",reason}, which is what you want when partial success is acceptable, like a dashboard where one widget can fail. Promise.race settles with whichever input settles first, success or failure — classic for racing a request against a timeout. Promise.any settles with the first FULFILLMENT, ignoring individual rejections, and only rejects with an AggregateError if every input rejects — good for querying redundant mirrors. A key subtlety: combinators don\'t start the promises; the promises run as soon as they\'re created, so concurrency comes from creating them eagerly with map. Another subtlety: all and race short-circuit, and neither race nor any cancels the losing operations — those keep running, so for true cancellation you combine them with AbortController. Empty-array edge cases matter too: Promise.all([]) fulfills with [], but Promise.race([]) stays pending forever. The practical skill is choosing the right one by your error tolerance and timing needs.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'all maximizes speed but is fragile (one failure kills the batch); allSettled is resilient but you must post-process statuses and lose fail-fast behavior.',
      'race/any give responsiveness (timeouts, fastest-source) but leave losers running, so resilience comes at the cost of wasted work unless cancelled.',
    ],
    edgeCases: [
      'Empty iterables: all/allSettled fulfill with []; any rejects with AggregateError; race stays pending forever.',
      'Non-promise values in the iterable are coerced via Promise.resolve, so plain values fulfill immediately.',
      'Promise.all preserves input order in its result array even though settlements arrive out of order.',
      'AggregateError from any aggregates all reasons in .errors; older runtimes may lack it (polyfill needed).',
    ],
    runtimeBehavior: [
      'All combinators subscribe via internal .then reactions, so callbacks run on the microtask queue with normal ordering.',
      'all/race settle and ignore further settlements once determined, but pending losers still execute and may schedule more microtasks.',
      'A huge iterable forces the combinator to allocate a results array and subscribe to every promise up front.',
    ],
    scalability: [
      'Unbounded fan-out exhausts sockets/connection pools and trips rate limits; bound concurrency with a pool (chunking or a limiter) — a core concurrency pattern.',
      'For redundant-provider setups, any plus AbortController gives low tail latency while cancelling the slower providers.',
    ],
    productionConcerns: [
      'Always decide error tolerance explicitly — silently using all where allSettled was needed causes outages from a single flaky dependency.',
      'Add per-operation timeouts (race) AND cancellation (AbortController) so a hung dependency cannot stall the aggregate.',
      'Log AggregateError.errors fully; a single "all mirrors down" line hides the individual causes.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'all → all fulfill → ordered [values]; first reject → reject (short-circuit).',
    'allSettled → wait all → [{status,value|reason}]; never rejects.',
    'race → first to SETTLE (success or failure) wins.',
    'any → first to FULFILL wins; all reject → AggregateError(errors).',
    'Result shapes: all/allSettled → arrays; race/any → single value.',
    'Combinators coordinate ALREADY-running promises; map to start them.',
    'all preserves INPUT order, not completion order.',
    'race never settles on [] ; all([]) → [] ; any([]) → AggregateError.',
    'No combinator cancels losers — use AbortController.',
    'Bound concurrency for huge fan-outs (promise pool).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Fetch three URLs concurrently and log all their JSON bodies as an array, in URL order.',
      hint: 'map to fetch promises, then Promise.all.',
      solution: {
        lang: 'js',
        code: `const urls = ['/a', '/b', '/c']\nPromise.all(urls.map(u => fetch(u).then(r => r.json())))\n  .then(bodies => console.log(bodies))\n  .catch(err => console.error(err))`,
        explanation: [
          'map creates three in-flight fetches that run in parallel.',
          'Promise.all resolves with the bodies in the same order as urls.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Load three endpoints but tolerate failures: return an array where failed ones are null.',
      hint: 'Use allSettled and map status to value or null.',
      solution: {
        lang: 'js',
        code: `const calls = ['/x', '/y', '/z'].map(u => fetch(u).then(r => r.json()))\nPromise.allSettled(calls).then(results =>\n  console.log(results.map(r => (r.status === 'fulfilled' ? r.value : null)))\n)`,
        explanation: [
          'allSettled never rejects, so one failure does not drop the others.',
          'Mapping each descriptor to value-or-null gives a partial-success array.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement myAll(promises) that behaves like Promise.all (resolve with ordered values, reject on first failure).',
      hint: 'Track a results array and a remaining counter; resolve when counter hits 0.',
      solution: {
        lang: 'js',
        code: `function myAll(promises) {\n  return new Promise((resolve, reject) => {\n    const results = []\n    let remaining = promises.length\n    if (remaining === 0) return resolve(results)\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then(\n        value => {\n          results[i] = value\n          if (--remaining === 0) resolve(results)\n        },\n        reject // first rejection rejects the aggregate\n      )\n    })\n  })\n}`,
        explanation: [
          'Each promise writes its value at its original index, preserving order.',
          'remaining counts down; the aggregate resolves only when all have fulfilled.',
          'Passing reject as the rejection handler short-circuits on the first failure.',
          'The empty-array case resolves immediately with [].',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a concurrency-limited runner: given tasks (functions returning promises) and a limit, run at most `limit` at a time and return all results in order.',
      hint: 'Keep a pointer; when a slot frees, start the next task.',
      solution: {
        lang: 'js',
        code: `function runPool(tasks, limit) {\n  return new Promise((resolve, reject) => {\n    const results = []\n    let next = 0\n    let active = 0\n    let done = 0\n    function launch() {\n      while (active < limit && next < tasks.length) {\n        const i = next++\n        active++\n        Promise.resolve(tasks[i]()).then(\n          v => {\n            results[i] = v\n            active--\n            done++\n            if (done === tasks.length) resolve(results)\n            else launch()\n          },\n          reject\n        )\n      }\n    }\n    if (tasks.length === 0) resolve(results)\n    else launch()\n  })\n}\n\n// runPool([() => fetch('/a'), () => fetch('/b'), ...], 2)`,
        explanation: [
          'launch starts tasks until the active count reaches the limit.',
          'When a task finishes it frees a slot and launches the next pending task.',
          'Results are stored by index, so order is preserved despite out-of-order completion.',
          'This bounds load on the network/DB, the standard fix for unbounded Promise.all.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Combinators are where async theory becomes real performance. Choosing all vs allSettled vs race vs any correctly is a daily engineering decision that visibly affects latency and resilience, and interviewers love it because the semantics are precise and easy to probe.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the difference between all and allSettled. Product companies (Zoho, Flipkart, Razorpay) ask you to implement Promise.all or a concurrency-limited pool and to pick the right combinator for a scenario. FAANG-level interviews probe empty-array edge cases, cancellation of losers, and bounded fan-out at scale.',
    whatInterviewersExpect:
      'They expect you to know all four combinators\' resolve/reject semantics and result shapes, pick the right one for a given error tolerance, explain that combinators coordinate already-running work, and discuss cancellation and bounded concurrency for production safety.',
  },
}

export default promiseCombinators
