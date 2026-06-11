import type { ConceptLesson } from '../../../types/lesson'

const asyncAwait: ConceptLesson = {
  // 1. Concept Summary
  slug: 'async-await',
  name: 'async / await',
  category: 'async',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'async/await is how modern JavaScript writes asynchronous code that READS like synchronous code — it is the default style in virtually every codebase today.',
    'It lets you use ordinary control flow (if, for, try/catch) with async work, eliminating both callback nesting and verbose .then chains.',
    'Interviewers ask about it constantly because it tests whether you understand that it is just sugar over Promises, plus the event loop and error handling.',
    'Misusing it causes real performance bugs: awaiting in a loop serializes independent work, and a missing try/catch leaks unhandled rejections.',
    'It is the bridge concept — you cannot reason about async/await correctly without understanding Promises and microtasks underneath.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'await is like pressing pause on your own turn in a board game while you wait for a card to be drawn, letting everyone else keep playing until your card is ready.',
    story: [
      'Imagine you are playing a board game and you draw a card that says "wait until the timer dings before you move".',
      'Instead of everyone freezing and staring at you, you simply pause YOUR turn and let your friends keep taking their turns.',
      'When the timer dings, it becomes your turn again and you pick up exactly where you left off, as if you never stopped.',
      'await works like that: it pauses only your function until the slow thing is done, while the rest of the program keeps running. When the result is ready, your function resumes right after the await, on the next line.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Promises let you handle future values with .then, but chains of .then can still be hard to follow. async/await makes async code look like normal, top-to-bottom code.',
    'You put the word async before a function. Inside it, you can use await before a Promise, and the function pauses on that line until the Promise settles, then continues with the result.',
    'While the function is paused, the rest of the program is NOT frozen — JavaScript goes off and does other work, and comes back when the Promise is ready.',
    'Errors are handled with ordinary try/catch, just like synchronous code, instead of .catch. An async function always returns a Promise.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'async/await is syntactic sugar over Promises. An async function always returns a Promise; await pauses the async function until the awaited Promise settles, then resumes with its fulfilled value (or throws its rejection reason), letting you write asynchronous code in a synchronous-looking style.',
    how: 'Marking a function async wraps its return value in a Promise (and a thrown error becomes a rejection). await unwraps a Promise: it suspends the function, yields control back to the event loop, and schedules the resumption as a microtask when the Promise settles. You handle failures with try/catch around the await.',
    why: 'It makes async control flow readable — using if/for/try-catch directly — while keeping the exact same Promise/microtask semantics underneath, so there is no behavioral cost.',
    code: {
      label: 'Promise chain vs async/await',
      lang: 'js',
      code: `// Promise chain\nfunction loadChain() {\n  return fetch('/api/user')\n    .then(r => r.json())\n    .then(user => fetch('/api/orders/' + user.id))\n    .then(r => r.json())\n}\n\n// async/await — same behavior, reads top to bottom\nasync function load() {\n  const r1 = await fetch('/api/user')\n  const user = await r1.json()\n  const r2 = await fetch('/api/orders/' + user.id)\n  return r2.json()\n}`,
      explanation: [
        'async load() returns a Promise just like loadChain().',
        'Each await pauses load() until that Promise settles, then assigns the result to a variable.',
        'The dependent steps run in sequence because each needs the previous result.',
        'No nesting, no .then — just normal variable assignments and a return.',
        'A thrown error anywhere becomes a rejection of the Promise that load() returns.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'async/await is syntactic sugar built on Promises and generator-like suspension. An async function implicitly returns a Promise: a returned value resolves it, a thrown error rejects it, and a returned thenable is adopted. The await operator suspends execution of the async function until its operand settles, coercing the operand via Promise.resolve; on fulfillment it evaluates to the value, on rejection it throws the reason at the await site. Suspension yields control to the event loop, and resumption is scheduled as a microtask when the awaited Promise settles. Errors propagate through ordinary try/catch and through the returned Promise.',

  // 7. Internal Working
  internalWorking: [
    'When an async function is invoked, the engine begins executing it synchronously up to the first await; everything before the first await runs immediately on the current call stack.',
    'At await, the operand is coerced with Promise.resolve and the function is SUSPENDED — its execution state (locals, position) is saved, the call stack unwinds, and control returns to the caller, which receives the still-pending returned Promise.',
    'A continuation (the rest of the function) is registered as a reaction on the awaited Promise. When that Promise settles, the continuation is scheduled on the MICROTASK queue.',
    'On resumption, if the awaited Promise fulfilled, await evaluates to its value; if it rejected, await throws the reason at that point, which is caught by any surrounding try/catch.',
    'The function continues to the next await (suspending again) or to its return/throw, which resolves or rejects the function\'s own Promise.',
    'Because resumption is a microtask, code after an await runs after the current synchronous task and any earlier-queued microtasks, but before timers — identical ordering to .then.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  async function f() {
    A                 ── runs SYNC up to first await
    const x = await P ── SUSPEND f, return pending promise to caller
    B                    │   (event loop runs other work)
    return x             │
  }                      ▼  when P settles → schedule continuation
                    MICROTASK queue → resume f at B with x
                       │
                       └─ f's returned promise resolves with x

  await fulfilled → value ;  await rejected → throws (try/catch catches)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — await and try/catch',
      lang: 'js',
      code: `async function getName(id) {\n  try {\n    const res = await fetch('/api/u/' + id)\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    const user = await res.json()\n    return user.name\n  } catch (err) {\n    console.error('failed:', err.message)\n    return 'unknown'\n  }\n}`,
      explanation: [
        'getName is async, so it returns a Promise resolving to the name.',
        'await fetch pauses until the response arrives; await res.json() pauses for the body.',
        'A non-ok status is turned into a thrown Error, caught by the surrounding try/catch.',
        'try/catch handles both the explicit throw and any network rejection from fetch.',
        'Returning a value resolves the function\'s Promise; the catch provides a fallback.',
      ],
    },
    intermediate: {
      label: 'Intermediate — sequential vs parallel awaits',
      lang: 'js',
      code: `// SLOW: serializes two independent requests (sum of latencies)\nasync function slow() {\n  const a = await fetch('/a').then(r => r.json())\n  const b = await fetch('/b').then(r => r.json())\n  return [a, b]\n}\n\n// FAST: start both, then await together (max of latencies)\nasync function fast() {\n  const pa = fetch('/a').then(r => r.json())\n  const pb = fetch('/b').then(r => r.json())\n  return [await pa, await pb] // or: await Promise.all([pa, pb])\n}`,
      explanation: [
        'In slow(), the second fetch does not even START until the first await resolves — independent work runs serially.',
        'In fast(), both fetches are kicked off before any await, so they run concurrently.',
        'Awaiting the already-running promises (or Promise.all) collects results once both finish.',
        'This await-in-sequence mistake is one of the most common real performance bugs.',
      ],
    },
    advanced: {
      label: 'Advanced — awaiting in loops, correctly',
      lang: 'js',
      code: `// Sequential when each step depends on the previous (correct use of await-in-loop)\nasync function pagedSum(firstUrl) {\n  let url = firstUrl\n  let total = 0\n  while (url) {\n    const page = await fetch(url).then(r => r.json())\n    total += page.value\n    url = page.next // depends on this page\n  }\n  return total\n}\n\n// Parallel when items are independent\nasync function fetchAll(ids) {\n  return Promise.all(ids.map(id => fetch('/x/' + id).then(r => r.json())))\n}`,
      explanation: [
        'pagedSum MUST be sequential — each page reveals the next URL, so await-in-loop is correct here.',
        'fetchAll has independent items, so mapping to promises and using Promise.all parallelizes them.',
        'The rule: await in a loop only when each iteration depends on the previous result.',
        'Using forEach with async does NOT wait — use for...of for sequential, or map+Promise.all for parallel.',
      ],
    },
    realProject: {
      label: 'Real project — async action in a Vue/Pinia store',
      lang: 'js',
      code: `// stores/cart.js (Pinia-style)\nexport const useCart = defineStore('cart', {\n  state: () => ({ items: [], loading: false, error: null }),\n  actions: {\n    async checkout(payload) {\n      this.loading = true\n      this.error = null\n      try {\n        const res = await fetch('/api/checkout', {\n          method: 'POST',\n          body: JSON.stringify(payload),\n        })\n        if (!res.ok) throw new Error('checkout failed')\n        this.items = []\n        return await res.json()\n      } catch (err) {\n        this.error = err.message\n        throw err // let the component decide how to surface it\n      } finally {\n        this.loading = false\n      }\n    },\n  },\n})`,
      explanation: [
        'The async action returns a Promise the component can await and react to.',
        'loading/error/finally form the standard async UI pattern, made readable by async/await.',
        'try/catch maps network and HTTP errors to a reactive error field.',
        'finally always clears the loading flag, even on failure — equivalent to .finally on a chain.',
        'Re-throwing lets the caller (component) also respond, e.g. show a toast.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does an async function return?',
      answer: 'Always a Promise. A value you return resolves that Promise; an error you throw rejects it. Even if you return a plain value, the caller gets a Promise that fulfills with it.',
      explanation: 'This is the single most important fact about async — it is Promise sugar, so it always returns a Promise.',
    },
    {
      level: 'beginner',
      question: 'How do you handle errors with async/await?',
      answer: 'With ordinary try/catch around the await. A rejected awaited Promise throws its reason at the await site, which try/catch catches. You can also attach .catch to the Promise the async function returns.',
      explanation: 'Knowing that await turns rejections into thrown errors is the bridge between Promise and synchronous-style error handling.',
    },
    {
      level: 'intermediate',
      question: 'Does await block the entire program?',
      answer: 'No. await only suspends the async function it is in. Control returns to the event loop, which continues running other tasks; the function resumes as a microtask when the awaited Promise settles. It is non-blocking despite looking synchronous.',
      explanation: 'A common misconception is that await freezes everything; clarifying that only the function suspends shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'Why can awaiting in a loop be a performance problem, and how do you fix it?',
      answer: 'If the iterations are independent, awaiting one before starting the next serializes them, making total time the sum of latencies. Fix it by starting all promises first (map) and awaiting them together with Promise.all, turning total time into the max latency.',
      explanation: 'The independent-vs-dependent distinction is the crux; sequential await is correct only when each step needs the previous result.',
    },
    {
      level: 'advanced',
      question: 'How does async/await map onto Promises and microtasks under the hood?',
      answer: 'An async function runs synchronously up to the first await, then suspends and returns a pending Promise. The awaited operand is coerced via Promise.resolve, and the continuation is registered as a reaction scheduled on the microtask queue when it settles. So await has identical ordering to .then.',
      explanation: 'Senior signal: describing suspension, the microtask resumption, and the equivalence to .then ordering.',
    },
    {
      level: 'senior',
      question: 'What is top-level await and what are its implications?',
      answer: 'Top-level await lets you use await at the top level of an ES module (no enclosing async function). It makes the module asynchronous: importers wait for it to finish evaluating. It is powerful for config/initialization but can delay the module graph and create deadlocks with circular dependencies, so use it deliberately.',
      explanation: 'Knowing module-level effects and the deadlock/latency tradeoffs is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between return await x and return x in an async function?',
    'Why does forEach with an async callback not wait?',
    'How do you run async work over an array in parallel vs in sequence?',
    'What happens to an unhandled rejection from an async function?',
    'How does await interact with the microtask queue vs setTimeout?',
    'Can you use await outside an async function? (only top-level await in modules)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Awaiting independent operations sequentially in a loop or one after another.',
      why: 'It serializes work that could run in parallel, making total latency the sum instead of the max.',
      fix: 'Start the promises first and await them with Promise.all (or map + Promise.all).',
    },
    {
      mistake: 'Using array.forEach with an async callback and expecting it to wait.',
      why: 'forEach ignores the returned Promises, so it does not await them; the outer code continues immediately.',
      fix: 'Use for...of with await for sequential, or map + Promise.all for parallel.',
    },
    {
      mistake: 'Forgetting try/catch (or .catch) around awaits.',
      why: 'A rejected await throws; with no handler it becomes an unhandled rejection.',
      fix: 'Wrap awaits in try/catch, or attach .catch to the returned Promise, and add global rejection logging.',
    },
    {
      mistake: 'Assuming await blocks the whole runtime.',
      why: 'It only suspends the current async function; misunderstanding this leads to wrong reasoning about ordering and responsiveness.',
      fix: 'Remember await yields to the event loop; other tasks run while the function is suspended.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia/Vuex actions and composables are written as async functions with try/catch/finally to manage loading and error state; components await the returned Promise.' },
    { area: 'React', detail: 'Effects call an inner async function (you cannot make the effect callback itself async); event handlers and React Query mutation functions are async, with try/catch driving error UI.' },
    { area: 'Node.js', detail: 'Route handlers and services are async; await chains DB and HTTP calls, and a single try/catch (or async error middleware) centralizes failures. Top-level await loads config in ESM entrypoints.' },
    { area: 'Backend', detail: 'Sequential workflows use await; independent calls use Promise.all; transactions wrap awaits in try/catch with rollback on error in the catch and commit on success.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'No runtime penalty over equivalent Promise chains — it compiles to the same microtask machinery.',
      'Readable control flow makes it easier to spot where you can parallelize, improving real performance.',
    ],
    bad: [
      'Accidentally serializing independent awaits multiplies latency (sum instead of max).',
      'Awaiting inside large synchronous-feeling loops can create long sequential critical paths.',
    ],
    optimizations: [
      'Kick off independent promises before awaiting, then await with Promise.all.',
      'Use for...of with await only for genuinely dependent sequences; use map + Promise.all otherwise.',
      'For bounded concurrency over huge arrays, use a promise pool rather than awaiting all at once.',
      'Prefer return x over return await x in tail position unless you need the try/catch to catch its rejection.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Missing try/catch around an awaited auth/validation call can let execution continue past a failed check, an availability or authorization risk.',
      'Unhandled rejections from async functions can hide security-relevant failures silently.',
    ],
    bestPractices: [
      'Wrap security-critical awaits in try/catch and fail closed on error.',
      'Add global unhandledrejection / unhandledRejection handlers to surface silent async failures.',
      'Validate awaited responses (status, schema) before trusting the data downstream.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'callback-hell', 'event-loop', 'microtask-queue'],
    nextConcepts: ['async-error-handling', 'promise-combinators', 'top-level-await', 'fetch-api', 'abortcontroller'],
    dependencyNote:
      'async/await is sugar over Promises and the microtask queue, so master those first. It then unlocks clean async-error-handling, pairs with promise-combinators for parallelism, and extends to top-level-await in modules.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write an async function with code before an await, the await line, and code after it.',
      'Draw an arrow: "runs sync to here", then a SUSPEND marker at the await.',
      'Show control returning to the caller with a pending Promise.',
      'Draw the awaited Promise settling → continuation pushed to the MICROTASK queue → resume after await.',
      'Say: "async always returns a Promise; await suspends only this function and resumes as a microtask; rejections throw into try/catch."',
    ],
    diagram: `  async f() {
    sync code   ───────────────►  runs now
    await P     ── SUSPEND ──►  return pending promise to caller
                                 (event loop free)
    after-await ◄── resume (microtask) when P settles
    return v    ──► f()'s promise fulfills with v
  }`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'async/await is sugar over Promises. An async function always returns a Promise; await suspends only that function until the awaited Promise settles, resuming as a microtask with the value (or throwing the rejection into try/catch). It reads like synchronous code with if/for/try-catch but keeps identical Promise/microtask semantics. The classic mistake is awaiting independent work sequentially — start the promises first and await with Promise.all to parallelize.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'async/await is syntactic sugar over Promises that lets you write asynchronous code in a synchronous-looking style. Marking a function async means it always returns a Promise: a returned value resolves it and a thrown error rejects it. Inside, await takes a Promise, suspends the function until that Promise settles, and then resumes with the fulfilled value — or, if it rejected, throws the reason right at the await, where ordinary try/catch can catch it. The crucial point is that await does not block the whole program; it suspends only the current async function and yields control back to the event loop, so other work keeps running. When the awaited Promise settles, the continuation is scheduled on the microtask queue, which means await has exactly the same ordering semantics as .then. The big wins are readability and being able to use normal control flow — if, for, try/catch. The classic pitfall is awaiting independent operations sequentially, which serializes them and makes total latency the sum instead of the max; the fix is to start the promises first and await them together with Promise.all. Other gotchas: forEach with an async callback does not wait, and forgetting try/catch produces unhandled rejections. In modern modules you can also use top-level await, which makes the module itself async.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Readability vs accidental serialization: the synchronous look tempts you to await sequentially even when work is independent.',
      'try/catch ergonomics vs granularity: a broad try/catch is readable but can swallow which specific await failed; finer-grained handling is more precise but noisier.',
    ],
    edgeCases: [
      'return await x vs return x: identical result, but return await keeps the frame alive so a surrounding try/catch can catch the rejection (relevant for tracing/cleanup).',
      'forEach/map misuse: async callbacks return promises that forEach ignores; map returns a promise array you must await.',
      'Top-level await makes a module async and can deadlock with circular imports or delay the module graph.',
      'Errors thrown synchronously before the first await still reject the returned Promise, not throw synchronously to the caller.',
    ],
    runtimeBehavior: [
      'Code before the first await runs synchronously on the caller\'s stack; everything after await runs as a microtask continuation.',
      'await coerces non-promise operands via Promise.resolve, so awaiting a plain value still defers one microtask.',
      'Async stack traces in modern engines reconstruct the logical call chain across awaits, aiding debugging.',
    ],
    scalability: [
      'Parallelize independent awaits with Promise.all; for very large fan-outs, bound concurrency with a pool to protect connection limits.',
      'Long sequential await chains create critical paths; profile and parallelize the independent segments.',
    ],
    productionConcerns: [
      'Unhandled rejections from async functions must be monitored; wrap entrypoints or use framework-level async error handlers.',
      'Ensure cleanup (timers, listeners, transactions) runs in finally so it executes on both success and rejection paths.',
      'Combine await with AbortController for cancellable requests so a hung await does not pin resources.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'async function ALWAYS returns a Promise.',
    'await suspends ONLY the current function, not the program.',
    'await fulfilled → value ; await rejected → throws (use try/catch).',
    'Resumption after await is a MICROTASK (same ordering as .then).',
    'Code before first await runs synchronously.',
    'Independent awaits in series = slow → use Promise.all.',
    'for...of + await = sequential; map + Promise.all = parallel.',
    'forEach with async does NOT wait.',
    'Top-level await: only in ES modules; makes the module async.',
    'return await vs return: same value; return await keeps try/catch in scope.',
    'No behavioral cost vs Promise chains — pure sugar.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write an async function getJson(url) that fetches a URL and returns the parsed JSON, returning null on any error.',
      hint: 'Use try/catch and await res.json().',
      solution: {
        lang: 'js',
        code: `async function getJson(url) {\n  try {\n    const res = await fetch(url)\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch {\n    return null\n  }\n}`,
        explanation: [
          'await fetch then await res.json() unwrap the two Promises.',
          'try/catch turns any failure (network or non-ok status) into a null return.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite this to run the two independent fetches in parallel: const a = await fetch("/a"); const b = await fetch("/b");',
      hint: 'Start both promises before awaiting.',
      solution: {
        lang: 'js',
        code: `const pa = fetch('/a')\nconst pb = fetch('/b')\nconst a = await pa\nconst b = await pb\n// or: const [a, b] = await Promise.all([fetch('/a'), fetch('/b')])`,
        explanation: [
          'Kicking off both fetches before any await lets them run concurrently.',
          'Awaiting the already-running promises (or Promise.all) collects them once both finish.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Process an array of ids SEQUENTIALLY with an async fetch, collecting results in order. Then explain how to make it parallel.',
      hint: 'for...of with await is sequential; map + Promise.all is parallel.',
      solution: {
        lang: 'js',
        code: `// sequential\nasync function sequential(ids) {\n  const out = []\n  for (const id of ids) {\n    out.push(await fetch('/x/' + id).then(r => r.json()))\n  }\n  return out\n}\n\n// parallel\nasync function parallel(ids) {\n  return Promise.all(ids.map(id => fetch('/x/' + id).then(r => r.json())))\n}`,
        explanation: [
          'for...of awaits each iteration, so requests happen one at a time, in order.',
          'map creates all promises up front; Promise.all runs them concurrently and preserves order.',
          'Choose sequential only when each step depends on the previous or you must throttle load.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement asyncRetry(fn, attempts, delayMs) that awaits fn(), and on failure waits delayMs then retries, up to attempts times, before throwing.',
      hint: 'Use a loop with try/catch and an awaited delay helper.',
      solution: {
        lang: 'js',
        code: `const delay = ms => new Promise(r => setTimeout(r, ms))\n\nasync function asyncRetry(fn, attempts = 3, delayMs = 200) {\n  let lastErr\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn()\n    } catch (err) {\n      lastErr = err\n      if (i < attempts - 1) await delay(delayMs)\n    }\n  }\n  throw lastErr\n}\n\n// await asyncRetry(() => fetch('/flaky').then(r => r.json()), 5, 300)`,
        explanation: [
          'The loop awaits fn(); on success it returns immediately.',
          'On failure it records the error and awaits a delay before the next attempt.',
          'After the last attempt it re-throws the most recent error.',
          'return await keeps the call inside the try so its rejection is caught and retried.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'async/await is the everyday face of asynchronous JavaScript — almost all modern async code is written this way. Demonstrating that you know it is just Promise sugar, plus how it interacts with the event loop and how to parallelize correctly, signals genuine async fluency.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what async returns and how to handle errors. Product companies (Zoho, Flipkart, Razorpay) ask you to fix sequential awaits, write retry/timeout helpers, and explain forEach-vs-for-of. FAANG-level interviews probe the microtask resumption model, top-level await, and return-await nuances.',
    whatInterviewersExpect:
      'They expect you to state that async returns a Promise, handle errors with try/catch, explain that await suspends only the function (not the program), correctly parallelize independent work with Promise.all, and connect await to microtask scheduling.',
  },
}

export default asyncAwait
