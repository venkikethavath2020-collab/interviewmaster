import type { ConceptLesson } from '../../../types/lesson'

const abortcontroller: ConceptLesson = {
  // 1. Concept Summary
  slug: 'abortcontroller',
  name: 'AbortController & Cancellation',
  category: 'async',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Promises cannot be cancelled, so AbortController is the standard mechanism for cancelling fetch requests, timeouts, and any abortable async work.',
    'Without cancellation you get race conditions (stale responses overwriting fresh ones), wasted bandwidth, memory leaks, and "set state on unmounted component" warnings.',
    'It is the idiomatic answer to "how do you cancel a fetch?" and "how do you implement a request timeout?" — common interview questions.',
    'A single controller can cancel MANY operations at once (multiple fetches, multiple event listeners), which is key to clean teardown.',
    'Modern APIs (fetch, addEventListener, streams) accept an AbortSignal, so understanding it is essential for writing leak-free, responsive code.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'AbortController is like a TV remote with one big "STOP" button, and the signal is the wire that connects it to everything you want to stop.',
    story: [
      'Imagine you started three slow chores — the washing machine, the dishwasher, and a download — and then you suddenly need to leave.',
      'Instead of running to each machine to switch it off, you have a single magic remote with a STOP button.',
      'You handed each machine a little receiver (a signal) when you started it, all connected to the same remote.',
      'When you press STOP once, every machine that got the receiver hears it and halts at the same time. AbortController is that remote, the signal is the receiver you give to each task, and abort() is pressing the button.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes you start an asynchronous task — like downloading data — but then change your mind: the user navigated away, or typed a new search.',
    'A Promise on its own has no "cancel" button. AbortController gives you one. You create a controller, take its signal, and pass that signal into the task (like fetch).',
    'When you call controller.abort(), the signal flips to "aborted" and notifies anything listening to it. fetch, for example, then stops and rejects with a special AbortError.',
    'One controller can hand its signal to many tasks, so a single abort() can stop a whole group at once — perfect for cleaning up when a page closes.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'AbortController is a built-in API for signalling cancellation to asynchronous operations. It exposes a signal (an AbortSignal) you pass to abortable APIs like fetch or addEventListener, and an abort(reason?) method that, when called, marks the signal aborted and notifies all consumers.',
    how: 'Create const controller = new AbortController(). Pass controller.signal to a fetch (or other API) in its options. Call controller.abort() to cancel — the signal fires an "abort" event and aborted becomes true; fetch rejects with an AbortError. A controller is single-use: once aborted, create a new one for the next operation. AbortSignal.timeout(ms) and AbortSignal.any([...]) create signals declaratively.',
    why: 'It provides a standard, composable cancellation primitive so you can stop wasteful work, implement timeouts, prevent stale-response races, and tear down listeners cleanly.',
    code: {
      label: 'Cancel a fetch',
      lang: 'js',
      code: `const controller = new AbortController()\n\nfetch('/api/big-report', { signal: controller.signal })\n  .then(res => res.json())\n  .then(data => render(data))\n  .catch(err => {\n    if (err.name === 'AbortError') console.log('cancelled')\n    else console.error(err)\n  })\n\n// later: user clicked "cancel" or navigated away\ncontroller.abort()`,
      explanation: [
        'new AbortController() creates a controller with a .signal.',
        'Passing signal into fetch makes the request cancellable.',
        'controller.abort() cancels the in-flight request immediately.',
        'fetch then rejects with an error whose name is "AbortError".',
        'You typically treat AbortError as an expected cancellation, not a real failure.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'AbortController is a DOM/Web API (also available in Node) providing a controller object with an associated AbortSignal. The signal is an EventTarget that consumers observe; it exposes aborted (boolean), reason, and an "abort" event. Calling controller.abort(reason) synchronously sets signal.aborted to true, records the reason (default an AbortError DOMException), and dispatches the abort event to all listeners. Abortable APIs (fetch, addEventListener via the signal option, ReadableStream, etc.) accept the signal and react by terminating and rejecting/cleaning up. Controllers are single-use; AbortSignal also offers static helpers AbortSignal.timeout(ms) and AbortSignal.any(signals) for declarative and composed cancellation.',

  // 7. Internal Working
  internalWorking: [
    'new AbortController() creates a controller and an associated AbortSignal; the signal starts with aborted=false and is an EventTarget that can have "abort" listeners.',
    'When you pass signal to an abortable API, that API registers an internal listener on the signal (or checks signal.aborted) so it knows when to stop.',
    'Calling controller.abort(reason) synchronously sets signal.aborted=true, stores signal.reason (defaulting to an AbortError DOMException), and dispatches the "abort" event to all registered listeners.',
    'fetch responds by aborting the underlying network request and rejecting its Promise with the abort reason; addEventListener with { signal } removes the listener; other APIs perform their own teardown.',
    'If abort() is called on an already-aborted signal, it is a no-op; if a fetch is given an already-aborted signal, it rejects immediately without making a network request.',
    'A single signal shared across multiple operations causes all of them to abort together; AbortSignal.any([...]) creates a composite signal that aborts when any of its inputs aborts.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        ┌──────────────────┐
        │  AbortController  │
        │  .abort(reason)   │──── press STOP
        └────────┬─────────┘
                 │ owns
                 ▼
        ┌──────────────────┐   aborted: false → true
        │   AbortSignal     │   reason, "abort" event
        └───┬──────┬───────┘
            │      │            (one signal → many consumers)
            ▼      ▼      ▼
        fetch   listener  stream
         │        │        │
         └─ all abort together when abort() is called`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — timeout with AbortSignal.timeout',
      lang: 'js',
      code: `// Declarative timeout — no manual controller needed\ntry {\n  const res = await fetch('/api/slow', { signal: AbortSignal.timeout(3000) })\n  const data = await res.json()\n} catch (err) {\n  if (err.name === 'TimeoutError') console.log('timed out')\n  else if (err.name === 'AbortError') console.log('aborted')\n  else throw err\n}`,
      explanation: [
        'AbortSignal.timeout(ms) returns a signal that auto-aborts after ms.',
        'It rejects with a TimeoutError (a DOMException), distinct from a manual AbortError.',
        'No controller or clearTimeout to manage — the platform handles it.',
        'This is the cleanest way to add a per-request timeout in modern environments.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cancel previous request (search-as-you-type)',
      lang: 'js',
      code: `let controller\nasync function search(query) {\n  controller?.abort()                 // cancel the prior in-flight request\n  controller = new AbortController()  // controllers are single-use\n  try {\n    const res = await fetch('/search?q=' + encodeURIComponent(query), {\n      signal: controller.signal,\n    })\n    return await res.json()\n  } catch (err) {\n    if (err.name === 'AbortError') return // superseded — ignore\n    throw err\n  }\n}`,
      explanation: [
        'Each keystroke aborts the previous request so stale results cannot win the race.',
        'A NEW controller is created per request because controllers are single-use.',
        'AbortError is swallowed since cancellation here is intentional.',
        'This prevents an older, slower response from overwriting a newer one.',
      ],
    },
    advanced: {
      label: 'Advanced — one controller for many things + composition',
      lang: 'js',
      code: `const controller = new AbortController()\nconst { signal } = controller\n\n// One signal cancels multiple fetches and removes listeners in one call\nPromise.all([\n  fetch('/a', { signal }),\n  fetch('/b', { signal }),\n])\nwindow.addEventListener('resize', onResize, { signal })\nwindow.addEventListener('scroll', onScroll, { signal })\n\n// Compose: abort if EITHER the user cancels OR a 5s timeout fires\nconst combined = AbortSignal.any([signal, AbortSignal.timeout(5000)])\nfetch('/c', { signal: combined })\n\n// teardown — cancels both fetches AND both listeners at once\ncontroller.abort()`,
      explanation: [
        'A single signal passed to many APIs lets one abort() tear everything down together.',
        'addEventListener with { signal } auto-removes the listener on abort — no manual removeEventListener.',
        'AbortSignal.any composes signals: the combined signal aborts when ANY input aborts.',
        'This pattern gives clean, leak-free teardown for components and modules.',
      ],
    },
    realProject: {
      label: 'Real project — cancel on unmount in Vue and React',
      lang: 'js',
      code: `// Vue composable\nimport { ref, onUnmounted } from 'vue'\nexport function useData(url) {\n  const data = ref(null)\n  const controller = new AbortController()\n  fetch(url, { signal: controller.signal })\n    .then(r => r.json())\n    .then(d => { data.value = d })\n    .catch(e => { if (e.name !== 'AbortError') throw e })\n  onUnmounted(() => controller.abort()) // cancel if user leaves before it loads\n  return { data }\n}\n\n// React effect\n// useEffect(() => {\n//   const controller = new AbortController()\n//   fetch(url, { signal: controller.signal }).then(...)\n//   return () => controller.abort() // cleanup cancels the request\n// }, [url])`,
      explanation: [
        'On unmount the controller aborts the in-flight request, avoiding stale state updates.',
        'AbortError is filtered out because cancellation is expected, not an error.',
        'In React, the effect cleanup function calls abort — the canonical pattern.',
        'This eliminates the classic "Can\'t perform a React state update on an unmounted component" warning.',
        'It also frees the network connection immediately instead of waiting for the response.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you cancel a fetch request?',
      answer: 'Create an AbortController, pass controller.signal in the fetch options, and call controller.abort() to cancel. The fetch Promise then rejects with an AbortError (err.name === "AbortError").',
      explanation: 'This is the textbook answer and the most common way the topic is introduced.',
    },
    {
      level: 'beginner',
      question: 'Can you cancel a Promise directly?',
      answer: 'No. Promises have no built-in cancellation. AbortController does not cancel the Promise itself; it signals the underlying operation (like fetch) to stop, which then rejects its Promise. Cancellation is cooperative — the operation must observe the signal.',
      explanation: 'Clarifying that AbortController cancels the operation, not the Promise abstraction, shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'How do you implement a request timeout?',
      answer: 'Either use AbortSignal.timeout(ms) which auto-aborts (rejecting with a TimeoutError), or manually create a controller, setTimeout(() => controller.abort(), ms), pass the signal to fetch, and clearTimeout in finally.',
      explanation: 'Knowing both the modern declarative helper and the manual timer pattern is the complete answer.',
    },
    {
      level: 'intermediate',
      question: 'Why must you create a new AbortController for each request in search-as-you-type?',
      answer: 'Because controllers and their signals are single-use: once aborted, a signal stays aborted forever. Reusing it would make the next fetch reject immediately. So you abort the old controller and create a fresh one per request.',
      explanation: 'The single-use nature is a subtle but important detail that trips people up.',
    },
    {
      level: 'advanced',
      question: 'How can one AbortController cancel multiple operations, and how do you compose signals?',
      answer: 'Pass the same signal to multiple APIs (several fetches, multiple addEventListener calls with { signal }); one abort() stops them all. To combine cancellation sources, use AbortSignal.any([sigA, sigB]) which returns a signal that aborts when any input aborts.',
      explanation: 'Demonstrating shared signals and AbortSignal.any composition is an advanced, practical signal of mastery.',
    },
    {
      level: 'senior',
      question: 'How do you make your OWN async function honor an AbortSignal?',
      answer: 'Accept a signal parameter, check signal.aborted early and throw if set, listen for the abort event to reject/clean up, and pass the signal down to any nested abortable calls. For long loops, check signal.aborted between iterations. Use signal.throwIfAborted() to bail cleanly.',
      explanation: 'Senior signal: cancellation is cooperative, so your own code must actively observe the signal and propagate it.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What error does an aborted fetch reject with, and how do you distinguish it from a real error?',
    'What is the difference between AbortError and TimeoutError?',
    'How does addEventListener\'s { signal } option help with cleanup?',
    'What happens if you pass an already-aborted signal to fetch?',
    'How would you implement a cancellable delay/sleep?',
    'How does AbortSignal.any differ from manually wiring listeners?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Reusing one AbortController for sequential requests.',
      why: 'Once aborted, the signal is permanently aborted, so the next fetch rejects immediately.',
      fix: 'Create a fresh AbortController for each new operation.',
    },
    {
      mistake: 'Treating AbortError as a real failure (showing an error toast on cancellation).',
      why: 'Cancellation is usually intentional (user navigated, newer request started), so surfacing it confuses users.',
      fix: 'Check err.name === "AbortError" and ignore it (or handle it as cancellation).',
    },
    {
      mistake: 'Forgetting to abort on unmount/cleanup.',
      why: 'In-flight requests resolve later and set state on dead components, leaking memory and causing warnings.',
      fix: 'Call controller.abort() in the cleanup/onUnmounted path; pass { signal } to listeners for auto-removal.',
    },
    {
      mistake: 'Assuming abort() cancels arbitrary CPU work in your own functions.',
      why: 'Cancellation is cooperative; nothing checks the signal unless your code does.',
      fix: 'In your own async code, check signal.aborted / call throwIfAborted() and propagate the signal to nested calls.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'useEffect cleanup aborts in-flight fetches to prevent stale state updates; React Query and SWR pass AbortSignals to cancel superseded or unmounted queries.' },
    { area: 'Vue', detail: 'Composables abort fetches in onUnmounted and on watched-param changes; addEventListener with { signal } auto-removes listeners on teardown.' },
    { area: 'Node.js', detail: 'fetch (undici), file streams, and many APIs accept signals; servers propagate a request-scoped signal so downstream calls abort when a client disconnects (req.signal in modern frameworks).' },
    { area: 'Backend', detail: 'Per-operation timeouts (AbortSignal.timeout) and request-cancellation propagation prevent runaway work when clients give up, freeing connections and DB resources.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Cancelling superseded requests frees bandwidth and server resources immediately instead of waiting for completion.',
      'Auto-removing listeners via { signal } prevents memory leaks from accumulated handlers.',
    ],
    bad: [
      'Not cancelling causes stale-response races and wasted work, degrading both client and server.',
      'Excessive controller churn (new controller per tiny operation in hot loops) adds minor allocation overhead.',
    ],
    optimizations: [
      'Use one shared signal to tear down many operations in a single abort() call.',
      'Prefer AbortSignal.timeout for timeouts to avoid manual timer bookkeeping.',
      'Propagate a request-scoped signal through the call chain so abandoned work stops everywhere.',
      'Debounce/throttle the trigger so you are not creating and aborting controllers on every keystroke unnecessarily.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Failing to cancel work after auth/permission changes can let abandoned requests complete with stale privileges.',
      'Unbounded uncancelled requests can be abused for resource exhaustion on the server.',
    ],
    bestPractices: [
      'Propagate cancellation server-side (abort downstream work when the client disconnects) to limit wasted/abusable work.',
      'Always enforce timeouts on external calls so a hung dependency cannot tie up resources indefinitely.',
      'Re-validate authorization on the result path; do not assume an in-flight request is still permitted.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'async-await', 'fetch-api', 'event-system'],
    nextConcepts: ['async-error-handling', 'concurrency-patterns', 'promise-combinators', 'debounce'],
    dependencyNote:
      'AbortController builds on Promises, async/await, and fetch, and uses the event system (the abort event). It is essential for async-error-handling (cancellation as a controlled error) and concurrency-patterns (timeouts, cancelling losers in races).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a controller box with an abort() button, owning a signal.',
      'Draw the signal feeding into fetch (and a listener) — one signal, many consumers.',
      'Show abort() flipping signal.aborted to true and firing the abort event.',
      'Note fetch rejects with AbortError; listeners with { signal } auto-remove.',
      'Say: "Promises can\'t be cancelled; AbortController signals the operation to stop. One controller can tear down a whole group, and it\'s single-use."',
    ],
    diagram: `  new AbortController() ──► controller.abort()
            │ owns                    │
            ▼                         ▼ sets aborted=true, fires "abort"
        signal ──┬─► fetch(url,{signal})  → rejects AbortError
                 ├─► addEventListener(...,{signal}) → auto-removed
                 └─► your async fn (must check signal.aborted)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Promises can\'t be cancelled, so AbortController provides cancellation. Create a controller, pass its signal to abortable APIs like fetch, and call abort() to cancel — fetch then rejects with an AbortError. One signal can cancel many operations at once, and { signal } on addEventListener auto-removes listeners. Controllers are single-use, so make a new one per request. Use AbortSignal.timeout(ms) for timeouts and AbortSignal.any to compose signals. Cancellation is cooperative — your own code must check signal.aborted.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Promise has no built-in cancellation, so the platform provides AbortController as the standard cancellation primitive. You create a controller, which owns an AbortSignal, and you pass that signal into an abortable API like fetch. When you call controller.abort(), the signal\'s aborted flag flips to true, it records a reason, and it fires an abort event; fetch reacts by tearing down the network request and rejecting its Promise with an AbortError. The key practical uses are cancelling stale requests — for example aborting the previous request on every keystroke in search-as-you-type so an older response can\'t overwrite a newer one — and implementing timeouts, either manually with a setTimeout that calls abort, or declaratively with AbortSignal.timeout, which rejects with a TimeoutError. A really nice property is that one signal can be passed to many operations: several fetches, multiple addEventListener calls using the { signal } option, and so on, so a single abort tears the whole group down at once, which is perfect for component teardown. There are a few gotchas: controllers are single-use, so once aborted you must create a new one; you should treat AbortError as an expected cancellation rather than a real error; and cancellation is cooperative, so if you write your own long-running async function you must actively check signal.aborted or call throwIfAborted and propagate the signal to nested calls. AbortSignal.any lets you compose multiple cancellation sources into one.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Cancellation is cooperative, not preemptive — it stops abortable I/O cleanly but cannot interrupt a synchronous CPU-bound loop unless that loop checks the signal.',
      'Sharing one signal across many operations is convenient but couples their lifetimes; sometimes per-operation controllers are clearer.',
    ],
    edgeCases: [
      'A controller/signal is single-use; an already-aborted signal makes a new fetch reject immediately without a network call.',
      'AbortSignal.timeout rejects with a TimeoutError (DOMException) which is distinct from a manual AbortError.',
      'abort() is synchronous and idempotent; calling it twice is a no-op.',
      'Aborting a fetch whose body you are already streaming will also error the stream read.',
    ],
    runtimeBehavior: [
      'The signal is an EventTarget; consumers either listen for the abort event or poll signal.aborted.',
      'abort(reason) lets you pass a custom reason, exposed as signal.reason and used as the rejection value.',
      'AbortSignal.any returns a composite that aborts when any input does and is itself single-use.',
    ],
    scalability: [
      'Propagating a request-scoped signal through the call chain stops abandoned downstream work (DB queries, upstream fetches) when a client disconnects, protecting resources at scale.',
      'Timeouts on every external call prevent a single slow dependency from exhausting connection pools and request handlers.',
    ],
    productionConcerns: [
      'Always cancel in-flight requests on unmount/navigation to avoid stale-state bugs and leaks.',
      'Distinguish AbortError/TimeoutError from genuine failures in logging and UI so cancellations are not reported as errors.',
      'Wire server frameworks to expose req.signal and pass it downstream so cancellation propagates end to end.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Promises are NOT cancellable; AbortController signals operations to stop.',
    'new AbortController() → .signal + .abort(reason?).',
    'Pass signal to fetch / addEventListener({ signal }) / streams.',
    'abort() → signal.aborted=true, fires "abort", fetch rejects AbortError.',
    'Controllers/signals are SINGLE-USE → new one per request.',
    'Treat AbortError as cancellation, not a failure (check err.name).',
    'Timeout: AbortSignal.timeout(ms) → TimeoutError.',
    'Compose: AbortSignal.any([a, b]) aborts when ANY aborts.',
    'One signal → many consumers → one abort() tears all down.',
    'Cancellation is COOPERATIVE — your code must check signal.aborted.',
    '{ signal } on addEventListener auto-removes the listener on abort.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Fetch a URL but cancel it after 2 seconds using a manual AbortController.',
      hint: 'setTimeout(() => controller.abort(), 2000) and clear it in finally.',
      solution: {
        lang: 'js',
        code: `async function fetchMax2s(url) {\n  const controller = new AbortController()\n  const t = setTimeout(() => controller.abort(), 2000)\n  try {\n    const res = await fetch(url, { signal: controller.signal })\n    return await res.json()\n  } finally {\n    clearTimeout(t)\n  }\n}`,
        explanation: [
          'The timer aborts the controller after 2s, cancelling the fetch.',
          'clearTimeout in finally prevents the timer firing after a fast response.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a cancellable sleep(ms, signal) that resolves after ms but rejects with the abort reason if the signal aborts first.',
      hint: 'Reject on the abort event and clear the timer.',
      solution: {
        lang: 'js',
        code: `function sleep(ms, signal) {\n  return new Promise((resolve, reject) => {\n    if (signal?.aborted) return reject(signal.reason)\n    const t = setTimeout(resolve, ms)\n    signal?.addEventListener('abort', () => {\n      clearTimeout(t)\n      reject(signal.reason)\n    }, { once: true })\n  })\n}`,
        explanation: [
          'If already aborted, reject immediately with signal.reason.',
          'Otherwise schedule the resolve and listen for abort to cancel and reject.',
          'clearTimeout on abort prevents a late resolve; { once: true } cleans up the listener.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement search(query) that cancels the previous request and ignores AbortErrors, returning only the latest result.',
      hint: 'Keep a module-level controller; abort it before each new request.',
      solution: {
        lang: 'js',
        code: `let current\nasync function search(query) {\n  current?.abort()\n  const controller = (current = new AbortController())\n  try {\n    const res = await fetch('/search?q=' + encodeURIComponent(query), {\n      signal: controller.signal,\n    })\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch (err) {\n    if (err.name === 'AbortError') return undefined\n    throw err\n  }\n}`,
        explanation: [
          'Each call aborts the previous controller so only the newest request survives.',
          'A fresh controller is created and stored per call (single-use rule).',
          'AbortError returns undefined since it just means a newer request superseded this one.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Make your own long-running async task honor cancellation: process an array of items, but stop and throw if the signal aborts.',
      hint: 'Check signal.throwIfAborted() between iterations.',
      solution: {
        lang: 'js',
        code: `async function processAll(items, worker, signal) {\n  const results = []\n  for (const item of items) {\n    signal?.throwIfAborted()        // bail cleanly if aborted\n    results.push(await worker(item, signal)) // propagate to nested work\n  }\n  return results\n}\n\n// const c = new AbortController()\n// processAll(big, doWork, c.signal); setTimeout(() => c.abort(), 1000)`,
        explanation: [
          'Cancellation is cooperative, so the loop must actively check the signal.',
          'throwIfAborted() throws the abort reason between iterations, stopping further work.',
          'Passing the signal into worker propagates cancellation to nested abortable calls.',
          'This is how you make custom async code respect AbortController.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'AbortController is the standard answer to cancellation — a topic that comes up the moment you build anything beyond a toy: search inputs, route changes, timeouts, and clean teardown all depend on it. Showing you use it correctly signals you write leak-free, responsive applications.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do you cancel a fetch?". Product companies (Zoho, Flipkart, Razorpay) ask you to implement search-as-you-type cancellation, a request timeout, or a cancellable sleep. FAANG-level interviews probe cooperative cancellation, signal composition (AbortSignal.any), and server-side cancellation propagation.',
    whatInterviewersExpect:
      'They expect you to cancel a fetch with a controller+signal, know it rejects with AbortError, implement a timeout (manual or AbortSignal.timeout), explain that controllers are single-use, and understand that cancellation is cooperative so your own code must observe the signal.',
  },
}

export default abortcontroller
