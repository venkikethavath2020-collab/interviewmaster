import type { ConceptLesson } from '../../../types/lesson'

const errorTypesTryCatch: ConceptLesson = {
  // 1. Concept Summary
  slug: 'error-types-try-catch',
  name: 'Errors & try/catch',
  category: 'errors-debugging',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Errors are how JavaScript tells you something went wrong; try/catch is how you handle it gracefully instead of crashing the whole script.',
    'Without error handling, one failed network call or bad JSON parse can break an entire page — try/catch lets you recover, retry, or show a friendly message.',
    'Knowing the built-in error types (TypeError, ReferenceError, SyntaxError, RangeError) lets you read stack traces and diagnose bugs fast.',
    'Interviewers ask it to check the fundamentals: what throw does, how try/catch/finally flow, and the classic trap that try/catch does NOT catch async errors.',
    'Good error handling is the difference between a robust app and one that silently fails or shows users a blank white screen.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'try/catch is like wearing a helmet on your bike: you still ride normally, but if you fall, the helmet catches the bump so you are not hurt.',
    story: [
      'Imagine you are doing a science experiment that might explode a little. You put a clear safety shield in front of you before you start.',
      'You do the experiment (the "try" part). If everything goes fine, great — you never needed the shield.',
      'But if it pops and sparks fly, the shield catches them (the "catch" part) so you do not get burned, and you calmly write down what went wrong.',
      'At the end, no matter what happened — explosion or not — you always clean up your table (the "finally" part). try/catch/finally in code works exactly like that: try the risky thing, catch the problem, and always tidy up.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes code hits a problem it cannot continue past — like reading a property of nothing, or parsing broken data. JavaScript "throws an error" to stop and signal this.',
    'A try/catch block lets you run risky code in the "try" part; if an error is thrown, the program jumps to the "catch" part instead of crashing.',
    'You can also add a "finally" block that always runs at the end, whether or not there was an error — handy for cleanup like closing things.',
    'JavaScript has named error types (like TypeError when you use a value the wrong way) so you can tell what kind of problem happened.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An error is an object (usually an instance of Error or a subclass like TypeError) thrown to signal an exceptional condition. try/catch/finally is the control structure to run risky code, catch a thrown error, and always run cleanup.',
    how: 'Code in the try block runs normally; if any statement throws, execution immediately jumps to catch with the error object, skipping the rest of try. The finally block (if present) runs afterward no matter what. You can throw your own errors with `throw new Error(message)`.',
    why: 'It lets you contain failures so the rest of the program keeps running, turn raw errors into user-friendly handling, and guarantee cleanup (releasing resources, hiding spinners) even when something fails.',
    code: {
      label: 'try / catch / finally with JSON parsing',
      lang: 'js',
      code: `function safeParse(text) {\n  try {\n    return JSON.parse(text)        // risky: may throw SyntaxError\n  } catch (err) {\n    console.error('Bad JSON:', err.message)\n    return null                    // recover with a fallback\n  } finally {\n    console.log('parse attempt finished') // always runs\n  }\n}\n\nsafeParse('{\"ok\":true}') // { ok: true }\nsafeParse('not json')     // logs error, returns null`,
      explanation: [
        'JSON.parse throws a SyntaxError when the text is not valid JSON.',
        'The catch block receives the error object; err.message describes what went wrong.',
        'Returning null lets the caller continue instead of the whole program crashing.',
        'finally always runs — perfect for logging, hiding a loading spinner, or closing a resource.',
        'The function is now safe: callers never have to fear a thrown parse error.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'In JavaScript, errors are objects (typically Error or a built-in subclass: TypeError, ReferenceError, SyntaxError, RangeError, URIError, EvalError) carrying name, message, and a non-standard but ubiquitous stack property. The throw statement raises an exception, unwinding the call stack until a surrounding try block\'s catch clause handles it; if none does, it propagates to the global handler/uncaught-exception path. The finally block executes after try/catch regardless of normal completion, thrown exception, or a return/break, making it the deterministic cleanup hook. Synchronous try/catch does not catch errors thrown in later microtasks/callbacks unless awaited.',

  // 7. Internal Working
  internalWorking: [
    'When throw runs (or the engine throws internally, e.g. accessing a property of undefined), it creates/uses an Error object and begins unwinding the call stack.',
    'The engine looks for the nearest enclosing try block on the stack whose catch can handle the exception; intermediate function frames are popped as it unwinds.',
    'If a matching catch is found, control transfers there with the error bound to the catch parameter, and normal execution resumes after the try/catch.',
    'The finally block, if present, runs after try (and catch) complete — even if try returned, or catch rethrew — and can itself override the outcome (a return in finally wins).',
    'If no catch handles the error, it reaches the top of the stack as an uncaught exception, triggering window.onerror / process uncaughtException and typically aborting the current task.',
    'For async code, a rejected Promise or an error in a callback runs in a later task/microtask, so the original synchronous try/catch has already exited — only await inside try (or .catch on the Promise) can intercept it.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   try {                         normal path
     stepA()  ───────────────────────────────┐
     stepB()  ── throws ──┐                    │
     stepC()  (skipped)   │                    │
   }                      ▼                     │
   catch (err) {     err object bound           │
     handle(err) ────────────────┐              │
   }                              │              │
   finally {                      ▼              ▼
     cleanup()  ◄──────── ALWAYS runs (error or not)
   }
   // execution continues here after the block`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — throwing and catching a custom message',
      lang: 'js',
      code: `function divide(a, b) {\n  if (b === 0) throw new Error('Cannot divide by zero')\n  return a / b\n}\n\ntry {\n  console.log(divide(10, 0))\n} catch (err) {\n  console.log('Caught:', err.message) // Caught: Cannot divide by zero\n}`,
      explanation: [
        'throw new Error(...) raises an exception with a descriptive message.',
        'The try block calls divide; the throw immediately jumps to catch.',
        'err.message holds the text we threw, so we can react or log it.',
        'Without try/catch, the throw would propagate up and could crash the script.',
      ],
    },
    intermediate: {
      label: 'Intermediate — identifying built-in error types',
      lang: 'js',
      code: `function classify(fn) {\n  try {\n    fn()\n  } catch (err) {\n    if (err instanceof TypeError) return 'type error: ' + err.message\n    if (err instanceof ReferenceError) return 'reference error'\n    if (err instanceof RangeError) return 'range error'\n    return 'other: ' + err.name\n  }\n}\n\nclassify(() => null.x)              // TypeError\nclassify(() => [].length = -1)      // RangeError (invalid array length)`,
      explanation: [
        'instanceof checks which built-in subclass the error is, so you can branch on it.',
        'Accessing a property of null throws a TypeError.',
        'Setting an invalid array length throws a RangeError.',
        'err.name ("TypeError", etc.) is a quick string check; instanceof is more precise.',
      ],
    },
    advanced: {
      label: 'Advanced — try/catch with async/await (and the sync trap)',
      lang: 'js',
      code: `// CORRECT: await inside try catches the rejection\nasync function load(url) {\n  try {\n    const res = await fetch(url)\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch (err) {\n    console.error('load failed:', err.message)\n    return null\n  }\n}\n\n// TRAP: try/catch does NOT catch this — the error is thrown later\ntry {\n  setTimeout(() => { throw new Error('too late') }, 0)\n} catch (e) { /* never runs */ }`,
      explanation: [
        'await makes the rejected Promise throw synchronously *within* the try, so catch sees it.',
        'A non-OK HTTP response does NOT reject fetch — you must check res.ok and throw yourself.',
        'The setTimeout callback runs in a later task, after the try block already exited, so its throw escapes to the global handler.',
        'Rule: only errors that happen during the synchronous run of try (including awaited ones) are caught.',
      ],
    },
    realProject: {
      label: 'Real project — guarding an API call in a Vue composable',
      lang: 'js',
      code: `import { ref } from 'vue'\nexport function useUser(id) {\n  const user = ref(null), error = ref(null), loading = ref(false)\n  async function fetchUser() {\n    loading.value = true\n    error.value = null\n    try {\n      const res = await fetch('/api/users/' + id)\n      if (!res.ok) throw new Error('Failed to load user (' + res.status + ')')\n      user.value = await res.json()\n    } catch (err) {\n      error.value = err.message      // show a friendly message in the UI\n    } finally {\n      loading.value = false          // always stop the spinner\n    }\n  }\n  return { user, error, loading, fetchUser }\n}`,
      explanation: [
        'try wraps the network call; catch turns any failure into a reactive error message for the template.',
        'finally guarantees loading is reset whether the call succeeded or failed — no stuck spinners.',
        'This loading/error/finally shape is the standard data-fetching pattern in Vue and React.',
        'The component renders error.value to the user instead of crashing or showing a blank screen.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does the finally block do and when does it run?',
      answer: 'finally runs after the try (and catch) block regardless of whether an error was thrown, caught, or the function returned early. It is used for cleanup that must always happen, like hiding a spinner or releasing a resource.',
      explanation: 'Key point: finally always runs — even on return or rethrow — which is why it is the cleanup hook.',
    },
    {
      level: 'beginner',
      question: 'Name a few built-in error types and what causes each.',
      answer: 'TypeError (using a value in an invalid way, e.g. calling a non-function or reading a property of null), ReferenceError (using an undeclared variable), SyntaxError (invalid code/JSON), and RangeError (a value outside the allowed range, like an invalid array length).',
      explanation: 'Recognizing error types lets you read stack traces and diagnose bugs quickly.',
    },
    {
      level: 'intermediate',
      question: 'Why does try/catch not catch an error thrown inside a setTimeout callback?',
      answer: 'The setTimeout callback runs in a later task on the event loop, after the synchronous try/catch block has already finished executing. By then there is no active try block on the stack, so the error escapes to the global handler.',
      explanation: 'This is the classic async/try-catch trap; understanding the event-loop timing is the real answer.',
    },
    {
      level: 'intermediate',
      question: 'How do you catch errors from a Promise-returning async function?',
      answer: 'Either await it inside a try/catch (await makes the rejection throw synchronously within the try), or attach .catch() to the Promise. A plain try/catch around an un-awaited Promise will not catch its rejection.',
      explanation: 'Shows the link between await and try/catch and awareness that an un-awaited rejection is uncaught.',
    },
    {
      level: 'advanced',
      question: 'What happens if you return from both try and finally?',
      answer: 'The return in finally overrides the return (or thrown error) from try/catch — finally has the final word. This is a common gotcha: a return or throw in finally silently swallows the try block\'s result.',
      explanation: 'Senior-leaning detail: finally can mask the original outcome, so avoid returning/throwing from it.',
    },
    {
      level: 'advanced',
      question: 'When should you NOT use try/catch?',
      answer: 'Avoid wrapping everything in broad try/catch that swallows errors silently, and do not use exceptions for normal control flow (it is slower and obscures intent). Catch where you can actually recover or add context; otherwise let it propagate to a boundary that handles it.',
      explanation: 'Judgment signal: error handling should be intentional and at the right layer, not blanket swallowing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between throw new Error() and just throwing a string?',
    'How do you create a custom error type? (leads to custom-errors-cause)',
    'What does the optional catch binding (catch {} without a param) do?',
    'How do unhandled promise rejections get reported globally?',
    'Does finally run if the try block calls return?',
    'How do you add context to an error before rethrowing it?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Wrapping async code in a plain try/catch without await.',
      why: 'The Promise rejection happens later, after try has exited, so the catch never fires and the rejection goes unhandled.',
      fix: 'await the Promise inside the try block, or attach .catch() to it.',
    },
    {
      mistake: 'Swallowing errors with an empty catch block.',
      why: 'The failure disappears silently, making bugs nearly impossible to diagnose later.',
      fix: 'At minimum log the error (with context); ideally handle it, rethrow with context, or report it to monitoring.',
    },
    {
      mistake: 'Throwing strings or plain objects instead of Error instances.',
      why: 'Strings have no stack trace and break instanceof checks, making debugging and handling harder.',
      fix: 'Always throw new Error(message) (or a subclass) so you get a name, message, and stack.',
    },
    {
      mistake: 'Returning or throwing inside finally.',
      why: 'It overrides whatever try/catch produced, silently swallowing the real result or error.',
      fix: 'Use finally only for side-effect cleanup; never return or throw from it.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Data-fetching composables wrap fetch in try/catch with a reactive error ref and a finally that resets loading; errorCaptured / app.config.errorHandler catch render-time errors.' },
    { area: 'React', detail: 'Async handlers use try/catch around await; render errors are caught by Error Boundaries (componentDidCatch), which try/catch cannot handle since rendering is React-controlled.' },
    { area: 'Node.js', detail: 'Route handlers wrap awaited DB/IO calls in try/catch and forward errors to centralized error middleware; finally releases connections back to the pool.' },
    { area: 'Backend', detail: 'Services catch and classify errors (validation vs system), log with context, and translate them into appropriate HTTP status codes instead of leaking stack traces to clients.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'try/catch has negligible cost on the happy path in modern engines — the cost is mostly when an error is actually thrown.',
      'Catching at the right boundary prevents one failure from cascading into more expensive retries or crashes.',
    ],
    bad: [
      'Using exceptions for normal control flow (throwing in hot loops) is slow because building stack traces is expensive.',
      'Very broad try/catch around large blocks can deoptimize and obscure where failures originate.',
    ],
    optimizations: [
      'Reserve throw for exceptional cases; return result/error values for expected branches.',
      'Keep try blocks tight around the genuinely risky statements.',
      'Avoid generating stack traces for high-frequency, expected errors (e.g. validation) — use plain result objects.',
      'Validate inputs up front so you throw less in the first place.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Leaking raw error messages/stack traces to users or API responses can expose file paths, queries, and internal structure useful to attackers.',
      'Swallowing errors silently can hide security-relevant failures (auth checks, validation) that should have stopped the request.',
    ],
    bestPractices: [
      'Return generic, safe error messages to clients; log the detailed error server-side only.',
      'Never expose stack traces in production responses.',
      'Fail closed on security-sensitive errors (deny on auth/validation failure) rather than catching and continuing.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'function-declaration-vs-expression', 'sync-vs-async'],
    nextConcepts: ['custom-errors-cause', 'async-error-handling', 'global-error-handlers', 'promises'],
    dependencyNote:
      'Errors & try/catch are the foundation of the errors-debugging track: you build on them with custom errors (adding types and cause), async error handling (await + try/catch, .catch), and global handlers as the last line of defense. Understanding sync-vs-async is essential to avoid the classic "try/catch does not catch async" trap.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write three stacked boxes: try, catch (err), finally.',
      'In try, write two lines; circle the second and write "throws".',
      'Draw an arrow from the throw jumping past the rest of try straight into catch.',
      'Write "err = the Error object" next to catch.',
      'Draw a line from both try and catch down into finally, label "ALWAYS runs".',
      'Say: "try runs risky code, a throw jumps to catch with the error, and finally always runs for cleanup — but it only catches synchronous errors."',
    ],
    diagram: `  try {  riskyA()
          riskyB() ──throws──┐
          riskyC() (skipped) │
  }                          ▼
  catch (err) { handle(err) }
        │
        ▼
  finally { cleanup() }   ← runs no matter what`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'An error is an Error object thrown to signal a failure; try/catch lets risky code run and jumps to catch with the error instead of crashing, while finally always runs for cleanup. Built-in types include TypeError, ReferenceError, SyntaxError, and RangeError. The classic trap: try/catch only catches synchronous errors — for async you must await inside try or use .catch. Always throw Error instances, never swallow errors silently, and never return/throw from finally.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In JavaScript, an error is an object — usually an Error or a built-in subclass like TypeError, ReferenceError, SyntaxError, or RangeError — that carries a name, a message, and a stack trace. You raise one with the throw statement, and you handle it with try/catch/finally. Code in the try block runs normally; the moment any statement throws, execution skips the rest of try and jumps to catch, which receives the error object so you can log it, recover with a fallback, or rethrow with more context. The finally block, if present, always runs afterward — whether the try succeeded, threw, or returned — which makes it the place for cleanup like hiding a spinner or releasing a connection. The most important subtlety is that synchronous try/catch only catches errors thrown during the synchronous run of the try block. An error thrown inside a setTimeout or an un-awaited Promise happens in a later task, after try has already exited, so it escapes to the global handler. To catch async errors you either await the Promise inside the try — because await makes a rejection throw synchronously there — or attach a .catch. A couple of good-practice points: always throw Error instances rather than strings so you keep a stack trace, never use an empty catch that swallows the failure silently, and never return or throw from finally because it overrides the real result. In a Vue or React app this shows up as wrapping a fetch in try/catch with a reactive error state and a finally that resets loading.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Catch-and-recover vs let-it-propagate: catching locally adds resilience but can hide failures; propagating to a boundary centralizes handling but risks crashing if no boundary exists.',
      'Exceptions vs result objects: throwing is ergonomic for truly exceptional cases but expensive and implicit; returning {ok, error} is explicit and cheap for expected failures.',
      'Granular vs broad try blocks: tight blocks pinpoint the failing statement; broad blocks are convenient but obscure the source.',
    ],
    edgeCases: [
      'A return/throw in finally overrides the try/catch outcome, silently masking errors.',
      'Optional catch binding (catch {}) when you do not need the error object — valid ES2019+.',
      'await inside try is required to catch a rejection; forgetting it leaves an unhandled rejection.',
      'Errors thrown in event listeners, timers, or microtasks bypass enclosing sync try/catch.',
    ],
    runtimeBehavior: [
      'Throwing unwinds the call stack to the nearest catch, popping frames; building the stack trace has real cost, so avoid throwing in hot paths.',
      'Modern engines optimize try/catch on the happy path; the historical "try/catch deoptimizes" advice is largely obsolete.',
      'Uncaught errors trigger window.onerror / process uncaughtException and abort the current task.',
    ],
    scalability: [
      'Centralize error handling at boundaries (router middleware, error boundaries) so individual call sites stay clean and consistent.',
      'Classify errors (operational vs programmer) so you can decide which to recover from and which should crash/restart.',
    ],
    productionConcerns: [
      'Always log errors with context and ship them to monitoring (Sentry/Datadog); empty catches are a top source of invisible bugs.',
      'Never leak stack traces to clients; translate to safe messages and proper status codes.',
      'Ensure finally cleanup (connections, locks, spinners) is correct so failures do not leak resources.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Error object: name, message, stack. throw raises it.',
    'try runs risky code; catch(err) handles a throw; finally always runs.',
    'Built-ins: TypeError, ReferenceError, SyntaxError, RangeError, URIError.',
    'try/catch catches SYNC errors only — not setTimeout/un-awaited Promise.',
    'For async: await inside try, or use .catch().',
    'fetch does NOT reject on HTTP 4xx/5xx — check res.ok and throw yourself.',
    'finally runs on return/throw too; do NOT return or throw from finally.',
    'Always throw Error instances, never strings (you lose the stack).',
    'No empty catch blocks — log/handle/rethrow with context.',
    'Use instanceof / err.name to branch on error type.',
    'Don\'t use exceptions for normal control flow (slow, implicit).',
    'Never leak stack traces to users; log them server-side.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write tryParse(text) that returns the parsed object, or null if the JSON is invalid, without crashing.',
      hint: 'Wrap JSON.parse in try/catch.',
      solution: {
        lang: 'js',
        code: `function tryParse(text) {\n  try {\n    return JSON.parse(text)\n  } catch {\n    return null\n  }\n}`,
        explanation: [
          'JSON.parse throws SyntaxError on bad input.',
          'The optional catch binding (catch {}) is used since we do not need the error object.',
          'Returning null gives the caller a safe fallback.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a function that always resets a loading flag whether the operation succeeds or fails, returning the result or rethrowing the error.',
      hint: 'Use finally for the reset.',
      solution: {
        lang: 'js',
        code: `let loading = false\nasync function withLoading(op) {\n  loading = true\n  try {\n    return await op()\n  } finally {\n    loading = false   // always runs, even if op throws\n  }\n}`,
        explanation: [
          'await op() inside try means a rejection becomes a thrown error here.',
          'We do not catch it — we let it propagate — but finally still runs first.',
          'loading is guaranteed reset on both success and failure, preventing a stuck spinner.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why this logs nothing in catch and rewrite it so the error IS caught: try { setTimeout(() => { throw new Error("x") }, 0) } catch (e) { console.log("caught", e) }',
      hint: 'The throw happens in a later task; wrap the async work in a Promise and await it.',
      solution: {
        lang: 'js',
        code: `// Original fails: the callback runs after try exits.\n// Fix: make the async work a Promise and await it.\nfunction delay(ms) {\n  return new Promise((_, reject) => setTimeout(() => reject(new Error('x')), ms))\n}\nasync function run() {\n  try {\n    await delay(0)\n  } catch (e) {\n    console.log('caught', e.message) // caught x\n  }\n}\nrun()`,
        explanation: [
          'In the original, setTimeout schedules the throw for a later task; by then the try block is long gone, so catch cannot see it.',
          'Wrapping the timer in a Promise that rejects lets us await it.',
          'await turns the rejection into a synchronous throw inside the try, so catch finally fires.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement safeFetchJson(url) that returns { data } on success or { error } on failure, treating non-OK HTTP responses as errors, and never throws to the caller.',
      hint: 'Check res.ok, throw on failure, catch and return a shaped result.',
      solution: {
        lang: 'js',
        code: `async function safeFetchJson(url) {\n  try {\n    const res = await fetch(url)\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    const data = await res.json()\n    return { data }\n  } catch (err) {\n    return { error: err.message }\n  }\n}\n\n// usage\nconst { data, error } = await safeFetchJson('/api/items')\nif (error) showToast(error)\nelse render(data)`,
        explanation: [
          'fetch resolves even on 404/500, so we must check res.ok and throw to treat it as an error.',
          'await both the fetch and .json() inside try so any rejection is caught here.',
          'Returning a {data} | {error} shape means the caller never has to use try/catch — explicit, predictable handling.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Error handling is a baseline competency every interviewer checks — getting try/catch/finally and the sync-vs-async trap right immediately signals you write robust, production-minded code rather than happy-path-only code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the syntax and finally semantics and to name error types. Product companies (Zoho, Flipkart, Razorpay) ask why try/catch misses async errors and how to handle fetch failures. FAANG-level interviews probe stack unwinding, finally overriding returns, and where error boundaries belong in a system.',
    whatInterviewersExpect:
      'They expect you to explain try/catch/finally flow precisely, name the built-in error types, state clearly that synchronous try/catch does not catch async errors (and how await fixes it), and show good practice: throw Error instances, never swallow silently, and never return/throw from finally.',
  },
}

export default errorTypesTryCatch
