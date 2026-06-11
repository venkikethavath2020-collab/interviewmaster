import type { ConceptLesson } from '../../../types/lesson'

const asyncErrorHandling: ConceptLesson = {
  // 1. Concept Summary
  slug: 'async-error-handling',
  name: 'Async Error Handling',
  category: 'async',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Async errors fail differently from sync errors — a thrown error inside a setTimeout or an unawaited Promise escapes your try/catch entirely, causing silent failures.',
    'Unhandled rejections crash Node processes (in modern defaults) and trigger browser warnings; mishandling them is a top cause of production incidents.',
    'Interviewers probe this because correct async error handling separates engineers who understand the event loop and Promise propagation from those who copy patterns.',
    'Swallowed or mis-routed errors hide bugs, leave the app in inconsistent states, and break observability (no logs, no alerts).',
    'Robust handling — try/catch around awaits, .catch on chains, global handlers, and error boundaries — is a daily requirement in any real application.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A synchronous error is like dropping a glass while you are holding it — you can catch it. An async error is like a glass that falls off the table ten minutes after you left the room — your hands are not there to catch it anymore.',
    story: [
      'Imagine you put a cup near the edge of a table and walk away to do other things.',
      'If the cup falls RIGHT NOW while you are standing there, you can catch it. That is a normal, synchronous error.',
      'But if the cup falls LATER, after you have already walked off to play, your hands are not there — you cannot catch something that happens when you are no longer standing in the right spot.',
      'Async errors are like that: the slow task finishes and fails later, when your original try/catch "hands" have already moved on. So you must leave a special net (a .catch or an await inside try/catch) right where the slow thing lands, not where you started it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal try/catch catches errors that happen RIGHT NOW, while the code inside the try is running.',
    'But asynchronous work — like a timer or a network request — finishes LATER, after the try block has already ended. So an error from inside a setTimeout callback escapes the try/catch around it.',
    'Promises fix this by carrying the error along the chain: a rejection skips the .then handlers and lands in the nearest .catch. With async/await, await turns a rejection back into a thrown error you can catch with a normal try/catch.',
    'If no handler catches a rejection, it becomes an "unhandled rejection", which logs a warning or even crashes the program — so every async path needs a handler.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Async error handling is the set of techniques for catching and routing errors from asynchronous operations. Because async work completes after the surrounding code has run, a plain try/catch only catches errors thrown synchronously; rejections must be caught with .catch on the Promise, or with try/catch around an await, plus global handlers as a safety net.',
    how: 'For Promise chains, attach .catch at the end so a rejection from any step lands there. For async/await, wrap awaits in try/catch — a rejected await throws at the await site. Errors thrown inside non-awaited callbacks (setTimeout, event listeners) are NOT caught by surrounding try/catch and need their own handling. Add window.onunhandledrejection / process.on("unhandledRejection") as a last line of defense.',
    why: 'Async errors that escape become silent failures or process crashes; correct routing makes failures observable, recoverable, and contained.',
    code: {
      label: 'Why try/catch misses async errors',
      lang: 'js',
      code: `// WRONG: try/catch does NOT catch the async throw\ntry {\n  setTimeout(() => {\n    throw new Error('boom') // escapes — try block already finished\n  }, 0)\n} catch (e) {\n  console.log('never runs')\n}\n\n// RIGHT: handle where the async work settles\nasync function load() {\n  try {\n    const res = await fetch('/api') // rejection throws HERE\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch (e) {\n    console.error('caught:', e.message)\n    throw e // rethrow if the caller should know\n  }\n}`,
      explanation: [
        'The setTimeout callback runs AFTER the try block exits, so its throw is uncatchable by that try/catch.',
        'await, by contrast, throws the rejection right at the await line, which the surrounding try/catch can catch.',
        'A non-ok HTTP status is converted into a throw so it routes through the same catch.',
        'Re-throwing lets the caller decide how to surface the error (toast, retry, 500 response).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Async error handling addresses the fact that synchronous try/catch only intercepts exceptions thrown during the synchronous execution of its block. Asynchronous failures surface as Promise rejections, which propagate down a Promise chain (skipping fulfillment handlers) until a rejection handler (.catch or the second argument to .then) is found; with async/await, await re-throws a rejection at its call site so try/catch applies. Errors thrown inside callbacks scheduled on the event loop (timers, I/O, event listeners) run on a fresh stack with no surrounding try/catch and must be handled locally. A rejection with no handler at the time of microtask processing becomes an unhandledrejection (browser) or unhandledRejection (Node) event, the global safety net.',

  // 7. Internal Working
  internalWorking: [
    'A try/catch installs an exception handler only for the synchronous call stack of its block; when the block returns, that handler is gone — later callbacks run on a new stack without it.',
    'When a Promise rejects, the engine looks for the next rejection reaction registered on it; if none, it propagates the rejection to the derived Promise, repeating down the chain.',
    'If the chain ends with no rejection handler, the engine marks the rejection as unhandled. After the microtask queue settles, it dispatches an unhandledrejection/unhandledRejection event with the reason.',
    'await is implemented as a Promise reaction: on rejection, the engine resumes the async function by THROWING the reason at the await point, so it enters any enclosing try/catch on the resumed stack.',
    'A throw inside an async function (or a rejected await not caught) rejects the function\'s returned Promise, propagating to whoever awaits/.catches it.',
    'finally / .finally always runs on both paths and, importantly, does not alter the propagating value or rejection unless it itself throws.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  SYNC error                         ASYNC error (Promise)
  ─────────────                      ─────────────────────
  try { throw e }  ──► catch         p.then(a).then(b)   reject!
  (same stack)                          │ skips a, b (fulfillment)
                                        ▼
                                     .catch(handler)  ◄─ lands here
                                        │ none?
                                        ▼
                              unhandledrejection event (global net)

  await P  (rejected) ──► throws at await ──► enclosing try/catch
  setTimeout(() => throw e)  ──► NEW stack, no try/catch ──► uncatchable`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — .catch vs try/catch',
      lang: 'js',
      code: `// Promise chain — handle with .catch\nfetch('/api')\n  .then(r => r.json())\n  .then(data => use(data))\n  .catch(err => console.error('chain failed:', err))\n\n// async/await — handle with try/catch\nasync function go() {\n  try {\n    const data = await fetch('/api').then(r => r.json())\n    use(data)\n  } catch (err) {\n    console.error('await failed:', err)\n  }\n}`,
      explanation: [
        'In the chain, a rejection from fetch OR json OR use lands in the single .catch.',
        'In the async version, await turns those same rejections into thrown errors caught by try/catch.',
        'Both are equivalent; the choice follows the code style you are using.',
        'One handler covers the whole flow — do not scatter handling at every step.',
      ],
    },
    intermediate: {
      label: 'Intermediate — errors that escape, and how to contain them',
      lang: 'js',
      code: `// setTimeout throw escapes — handle inside the callback\nsetTimeout(async () => {\n  try {\n    await riskyWork()\n  } catch (err) {\n    report(err) // must catch HERE; outer try/catch cannot\n  }\n}, 0)\n\n// event listeners similarly need local handling\nbutton.addEventListener('click', async () => {\n  try {\n    await submitForm()\n  } catch (err) {\n    showToast(err.message)\n  }\n})`,
      explanation: [
        'A setTimeout/event callback runs on a fresh stack, so surrounding try/catch cannot see its errors.',
        'You must place the try/catch INSIDE the callback where the await actually runs.',
        'Async event handlers are a classic source of unhandled rejections if not wrapped.',
        'The fix is always local: handle the error where the async work settles.',
      ],
    },
    advanced: {
      label: 'Advanced — combinator error semantics and global net',
      lang: 'js',
      code: `// allSettled to collect partial failures instead of failing fast\nconst results = await Promise.allSettled(tasks)\nconst errors = results.filter(r => r.status === 'rejected').map(r => r.reason)\nif (errors.length) log.warn('partial failures', errors)\n\n// global safety net (browser)\nwindow.addEventListener('unhandledrejection', (e) => {\n  monitor.capture(e.reason)\n  e.preventDefault() // stop the default console error if desired\n})\n\n// global safety net (Node)\nprocess.on('unhandledRejection', (reason) => {\n  monitor.capture(reason)\n  // optionally process.exit(1) to fail fast\n})`,
      explanation: [
        'Promise.all rejects on the first failure; allSettled lets you collect every outcome and decide.',
        'The unhandledrejection event is the LAST line of defense, not a substitute for local handling.',
        'Capturing to a monitoring tool (Sentry, Datadog) makes silent async failures observable.',
        'In Node you can choose to crash on unhandled rejections to avoid running in a corrupt state.',
      ],
    },
    realProject: {
      label: 'Real project — Node async error middleware',
      lang: 'js',
      code: `// Wrap async route handlers so rejections reach Express error middleware\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next)\n\napp.get('/users/:id', asyncHandler(async (req, res) => {\n  const user = await db.getUser(req.params.id)\n  if (!user) {\n    const err = new Error('Not found')\n    err.status = 404\n    throw err // routed to error middleware via asyncHandler\n  }\n  res.json(user)\n}))\n\n// central error middleware (must have 4 args)\napp.use((err, req, res, next) => {\n  log.error(err)\n  res.status(err.status || 500).json({ error: err.message })\n})`,
      explanation: [
        'Express does not catch rejections from async handlers, so unwrapped throws become unhandled rejections.',
        'asyncHandler wraps the handler and routes any rejection to next(), reaching the error middleware.',
        'Throwing an error with a status lets the central middleware build the right response.',
        'Centralizing error responses avoids duplicated try/catch in every route — the standard Express pattern.',
        'Libraries like express-async-errors or frameworks like NestJS automate this wrapping.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why does try/catch not catch an error thrown inside a setTimeout callback?',
      answer: 'Because the callback runs later, on a fresh call stack, after the try block has already finished executing. try/catch only covers the synchronous execution of its block, so the async throw escapes it.',
      explanation: 'The core insight is that try/catch is tied to the synchronous stack of its block, not to anything scheduled for later.',
    },
    {
      level: 'beginner',
      question: 'How do you handle errors in a Promise chain vs with async/await?',
      answer: 'In a chain, attach .catch at the end so any step\'s rejection lands there. With async/await, wrap the awaits in try/catch, since a rejected await throws its reason at the await site.',
      explanation: 'Knowing the two equivalent mechanisms and that await converts rejections into throws is the baseline.',
    },
    {
      level: 'intermediate',
      question: 'What is an unhandled rejection and what happens when one occurs?',
      answer: 'It is a rejected Promise with no rejection handler when the microtask queue processes it. In browsers it fires an unhandledrejection event and logs a warning; in modern Node it fires process unhandledRejection and, by default, terminates the process.',
      explanation: 'Understanding the global event and the Node crash-by-default behavior shows production awareness.',
    },
    {
      level: 'intermediate',
      question: 'How do error semantics differ across Promise.all, allSettled, race, and any?',
      answer: 'all rejects on the first rejection (fail-fast); allSettled never rejects and reports each outcome; race settles with the first to settle including a rejection; any ignores rejections and only rejects with an AggregateError if all reject.',
      explanation: 'Choosing the combinator by error tolerance is a practical, frequently tested decision.',
    },
    {
      level: 'advanced',
      question: 'Why might a .catch added to a chain still not prevent an unhandled rejection warning?',
      answer: 'If a rejection occurs and there is a tick where no handler is attached yet (e.g. you store the Promise and attach .catch later, or you create a Promise that rejects synchronously without an immediate handler), the engine may flag it as unhandled before the handler attaches. Also, a forgotten branch (one path of a fork) can reject without a handler.',
      explanation: 'Senior signal: knowing the timing of unhandled-rejection detection and the danger of late or partial handler attachment.',
    },
    {
      level: 'senior',
      question: 'How do you build robust async error handling across a large application?',
      answer: 'Local handling where work settles (try/catch around awaits, .catch on chains), a single centralized error path per layer (Express error middleware, Vue/React error boundaries), explicit combinator choice for partial failure, retries/timeouts for transient errors, AbortController for cancellation, and global unhandledrejection handlers wired to monitoring as a safety net — never the primary mechanism.',
      explanation: 'Strong answers describe a layered strategy: local, centralized, global, plus resilience patterns and observability.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why can React error boundaries not catch errors from async event handlers?',
    'What is the difference between unhandledrejection and the error event?',
    'How do you distinguish operational errors from programmer errors?',
    'How do you add a timeout so a hung Promise does not hang forever?',
    'How does finally behave if it throws or returns?',
    'How do you preserve the original cause when wrapping an error?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Wrapping setTimeout/event-listener code in an outer try/catch and expecting it to catch async throws.',
      why: 'The callback runs on a new stack after the try block ends, so the throw escapes.',
      fix: 'Put the try/catch INSIDE the callback where the async work actually runs.',
    },
    {
      mistake: 'Empty or swallowing catch blocks (catch {} or .catch(() => {})).',
      why: 'Errors vanish with no log or recovery, hiding bugs and leaving inconsistent state.',
      fix: 'Always log, recover, or rethrow; never silently swallow.',
    },
    {
      mistake: 'Forgetting to handle rejections from async route handlers/event handlers.',
      why: 'Frameworks like Express do not catch them, so they become unhandled rejections.',
      fix: 'Wrap async handlers (asyncHandler/next) and add local try/catch in event listeners.',
    },
    {
      mistake: 'Using Promise.all where one failure should not abort the rest.',
      why: 'all is fail-fast, so a single rejection discards all successful results.',
      fix: 'Use Promise.allSettled when partial success is acceptable, then inspect each status.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Express/Fastify centralize errors via async-handler wrappers and error middleware; process.on("unhandledRejection") logs to monitoring and can fail fast to avoid corrupt state.' },
    { area: 'React', detail: 'Error boundaries catch render-time errors but NOT async/event-handler errors; those need try/catch in handlers and a global window.onunhandledrejection wired to Sentry.' },
    { area: 'Vue', detail: 'app.config.errorHandler and onErrorCaptured catch component errors; async actions use try/catch/finally to set error refs, with a global unhandledrejection listener as backup.' },
    { area: 'Backend', detail: 'Distinguish operational errors (retry/timeouts, AbortController) from programmer errors (fail fast); wrap external calls with retries and route all failures through one structured-logging path.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Try/catch has negligible cost on the happy path in modern engines, so guarding awaits is essentially free.',
      'Fast, centralized error routing avoids retry storms and lets you shed load quickly on failure.',
    ],
    bad: [
      'Using exceptions for normal control flow (throwing on expected conditions in hot paths) adds overhead and obscures logic.',
      'Naive unbounded retries on failure can amplify load and cause cascading failures (retry storms).',
    ],
    optimizations: [
      'Use exponential backoff with jitter and a cap for retries to avoid synchronized retry storms.',
      'Add timeouts (Promise.race or AbortSignal.timeout) so failures surface quickly instead of hanging.',
      'Reserve exceptions for exceptional cases; return result/error values for expected branches in hot paths.',
      'Centralize handling so you are not allocating handlers per call in tight loops.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Leaking internal error details (stack traces, SQL, file paths) to clients aids attackers.',
      'Swallowing errors can bypass auth/validation, letting execution continue in an unauthorized or invalid state.',
      'Unhandled rejections can leave processes in undefined states that are easier to exploit.',
    ],
    bestPractices: [
      'Return generic client-facing messages; log full details server-side only.',
      'Fail closed on auth/validation errors — never proceed past a failed security check.',
      'Wire global rejection handlers to monitoring and consider failing fast on unexpected rejections.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'async-await', 'error-types-try-catch', 'event-loop'],
    nextConcepts: ['promise-combinators', 'abortcontroller', 'global-error-handlers', 'custom-errors-cause'],
    dependencyNote:
      'Async error handling builds on Promises, async/await, and basic try/catch. It connects to combinators (error semantics), AbortController (cancellation as error), global-error-handlers (the net), and custom-errors-cause (rich error objects).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a try { setTimeout(() => throw e) } catch and cross out the catch — say "never runs, new stack".',
      'Draw a Promise chain with a reject arrow skipping .then handlers into a .catch.',
      'Show await inside try/catch: "rejection throws here, caught here".',
      'Below the chain, draw the unhandledrejection event as the global net if no .catch exists.',
      'Say: "Handle where it settles — .catch or try/catch around await — and add a global handler as backup, never as the main plan."',
    ],
    diagram: `  try { setTimeout(throw e) } catch {}   ← X never catches (new stack)

  p ──► .then ──► .then ──reject──► (skips) ──► .catch  ✓
                                       │ none
                                       ▼
                              unhandledrejection (global net)

  try { await P } catch (e) { ... }      ← rejection throws at await ✓`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'try/catch only catches synchronous throws in its block, so errors from timers and unawaited Promises escape. Handle async errors where they settle: .catch on chains, try/catch around awaits (await re-throws rejections). A rejection with no handler becomes an unhandledrejection event — log it via a global handler as a safety net, never the primary plan. Pick combinators by error tolerance (all fails fast, allSettled collects), add retries with backoff and timeouts, and centralize routing (Express error middleware, error boundaries).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Async errors are tricky because a synchronous try/catch only catches exceptions thrown during the synchronous execution of its block. By the time a timer fires or a network request fails, that block has finished and its handler is gone, so the error escapes — a throw inside a setTimeout callback is simply uncatchable by the try/catch around the setTimeout. The correct model is to handle errors where the async work settles. For Promise chains, you attach .catch at the end, and a rejection from any step skips the fulfillment handlers and lands there. For async/await, you wrap the awaits in try/catch, because await re-throws a rejection as a thrown error at the await site. If a rejection reaches the microtask queue with no handler, it becomes an unhandledrejection event in the browser or process unhandledRejection in Node, which by default now crashes the process — that global handler should be a safety net wired to monitoring, never your primary mechanism. Beyond the basics, you choose combinators by error tolerance: Promise.all is fail-fast, allSettled collects every outcome. For resilience you add timeouts with Promise.race or AbortSignal.timeout, retries with exponential backoff and jitter, and AbortController for cancellation. And you centralize: Express async-handler wrappers feeding error middleware, or framework error boundaries, so handling is consistent and observable rather than scattered and swallowed.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Local granular try/catch gives precise recovery but is verbose; centralized handling is clean but can lose context about which operation failed.',
      'Crashing on unhandled rejections (fail fast) avoids corrupt state but reduces availability; deciding to crash vs continue is a per-service judgment.',
    ],
    edgeCases: [
      'A .catch attached a tick late (storing a Promise then handling it later) can still trigger an unhandled-rejection warning in the gap.',
      'finally that throws or returns overrides the original outcome — a subtle source of swallowed errors.',
      'React error boundaries do not catch errors in async callbacks or event handlers, only render/lifecycle.',
      'Errors thrown synchronously before the first await reject the returned Promise rather than throwing to the caller synchronously.',
    ],
    runtimeBehavior: [
      'Unhandled-rejection detection happens after microtask processing, so timing of handler attachment matters.',
      'await rejections resume the async function by throwing on its resumed (microtask) stack, entering enclosing try/catch.',
      'Promise rejections propagate down the derived-Promise chain until a rejection reaction exists.',
    ],
    scalability: [
      'Retry storms: synchronized retries after a dependency blip can self-DDoS; use jittered exponential backoff and circuit breakers.',
      'Timeouts everywhere on external calls prevent a single slow dependency from exhausting request handlers and connection pools.',
    ],
    productionConcerns: [
      'Distinguish operational errors (transient, retry) from programmer errors (bugs, fail fast) and treat them differently.',
      'Wire all async failures to structured logging/monitoring; an empty catch is an outage waiting to happen.',
      'Use error cause (new Error(msg, { cause })) to preserve the original error when wrapping across layers.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'try/catch catches only SYNC throws in its block.',
    'Timer/listener throws run on a new stack → uncatchable by outer try/catch.',
    'Chains: handle with .catch at the end.',
    'async/await: await re-throws rejections → use try/catch.',
    'No handler → unhandledrejection (browser) / unhandledRejection (Node, crashes by default).',
    'Global handlers = safety net + monitoring, NOT the primary plan.',
    'all = fail-fast; allSettled = collect; race = first settle; any = first success.',
    'Add timeouts (Promise.race / AbortSignal.timeout) and retries (backoff + jitter).',
    'Centralize: Express error middleware, error boundaries.',
    'Never swallow — log, recover, or rethrow; preserve cause.',
    'Fail closed on security checks; hide internal details from clients.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Fix this so the error is actually caught: try { setTimeout(() => JSON.parse("{bad"), 0) } catch (e) { handle(e) }',
      hint: 'The try/catch must be inside the callback.',
      solution: {
        lang: 'js',
        code: `setTimeout(() => {\n  try {\n    JSON.parse('{bad')\n  } catch (e) {\n    handle(e)\n  }\n}, 0)`,
        explanation: [
          'The callback runs later on a new stack, so the catch must live inside it.',
          'Now the parse error is caught where it actually occurs.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write fetchJson(url) that throws a descriptive error on non-ok status and lets the caller catch network and HTTP errors uniformly.',
      hint: 'Check res.ok and throw; let fetch rejections propagate.',
      solution: {
        lang: 'js',
        code: `async function fetchJson(url) {\n  const res = await fetch(url) // network errors reject here\n  if (!res.ok) throw new Error('HTTP ' + res.status + ' for ' + url)\n  return res.json()\n}\n\n// caller\ntry {\n  const data = await fetchJson('/api')\n} catch (e) {\n  console.error(e.message)\n}`,
        explanation: [
          'fetch rejects only on network failure, so res.ok must be checked explicitly.',
          'Throwing on non-ok routes HTTP errors through the same catch as network errors.',
          'The caller handles both uniformly with one try/catch.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add a timeout to an async operation so it rejects after ms milliseconds, and cancel the underlying fetch.',
      hint: 'Use AbortController and AbortSignal.timeout (or a manual timer + abort).',
      solution: {
        lang: 'js',
        code: `async function fetchWithTimeout(url, ms) {\n  const controller = new AbortController()\n  const timer = setTimeout(() => controller.abort(), ms)\n  try {\n    const res = await fetch(url, { signal: controller.signal })\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } finally {\n    clearTimeout(timer)\n  }\n}\n// abort makes fetch reject with an AbortError`,
        explanation: [
          'AbortController lets us actually cancel the request, not just reject the wrapper.',
          'The timer aborts the controller after ms, causing fetch to reject with an AbortError.',
          'finally clears the timer on every path so it does not leak.',
          'Modern alternative: fetch(url, { signal: AbortSignal.timeout(ms) }).',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build asyncHandler for Express that routes async route-handler rejections to error middleware, and show a handler that throws a 404.',
      hint: 'Wrap with Promise.resolve(fn(...)).catch(next).',
      solution: {
        lang: 'js',
        code: `const asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next)\n\napp.get('/item/:id', asyncHandler(async (req, res) => {\n  const item = await db.find(req.params.id)\n  if (!item) {\n    const err = new Error('Not found')\n    err.status = 404\n    throw err\n  }\n  res.json(item)\n}))\n\napp.use((err, req, res, next) => {\n  res.status(err.status || 500).json({ error: err.message })\n})`,
        explanation: [
          'asyncHandler wraps the async handler and forwards any rejection to next().',
          'next(err) hands control to the error middleware (the 4-arg one).',
          'Throwing an Error with a status lets the middleware build the correct response.',
          'This removes try/catch boilerplate from every route while keeping errors observable.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Async error handling is where real applications live or die — silent failures and unhandled rejections are among the most common production incidents. Showing you understand WHY async errors escape try/catch and how to route them correctly marks you as someone who ships reliable systems.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask why try/catch misses a setTimeout error and how to catch a rejection. Product companies (Zoho, Flipkart, Razorpay) ask you to add timeouts, retries, and an Express async error wrapper. FAANG-level interviews probe unhandled-rejection timing, combinator error semantics, retry storms, and layered handling strategy.',
    whatInterviewersExpect:
      'They expect you to explain that try/catch only covers synchronous throws, handle errors where they settle (.catch / try-catch around await), describe unhandled rejections and the global net, choose combinators by error tolerance, and add resilience via timeouts, retries with backoff, and cancellation.',
  },
}

export default asyncErrorHandling
