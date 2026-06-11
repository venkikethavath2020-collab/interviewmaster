import type { ConceptLesson } from '../../../types/lesson'

const globalErrorHandlers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'global-error-handlers',
  name: 'Global Error Handlers',
  category: 'errors-debugging',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'No matter how careful your try/catch is, some errors slip through — global handlers are the safety net that catches them so you learn about crashes instead of users silently suffering.',
    'They are how you wire production error monitoring (Sentry, Datadog): window.onerror, unhandledrejection, and Node\'s process events feed your observability pipeline.',
    'Without them, uncaught errors and rejected promises vanish into the console (or crash the server) with no report, and you find out about outages from angry users.',
    'Interviewers ask them to test whether you understand the difference between local and last-resort handling, the various global hooks, and crash policy (fail fast vs keep running).',
    'Correct global handling decides whether a Node process should restart, whether a browser app shows a fallback UI, and what gets logged for postmortems.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A global error handler is like the big safety net under a trapeze act — most of the time the acrobats are fine, but if anyone falls and nobody caught them, the net catches them so they are not hurt.',
    story: [
      'Imagine acrobats flying through the air at a circus. Their partners try to catch them — that is like normal error handling in your code.',
      'But sometimes a catch is missed and an acrobat starts falling with no one to grab them.',
      'That is when the giant net stretched across the whole stage saves the day — it catches anyone who slips past everyone else.',
      'A global error handler is that net for your program: it catches the errors that escaped every try/catch, so instead of disappearing or crashing quietly, the problem gets noticed and written down.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally you handle errors right where they happen using try/catch. But you can never wrap absolutely everything, so some errors escape.',
    'A global error handler is one place that listens for ANY error that was not caught anywhere else in the program.',
    'In the browser there are special listeners (window.onerror and unhandledrejection) and in Node.js there are process events (uncaughtException and unhandledRejection).',
    'Apps use these to report crashes to a monitoring service, show the user a friendly fallback, and decide whether the program should keep going or restart.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Global error handlers are top-level hooks that fire for errors and promise rejections that no local try/catch handled. In the browser: window.onerror / "error" and "unhandledrejection" events. In Node.js: process.on("uncaughtException") and process.on("unhandledRejection").',
    how: 'You register listeners once at startup. When an uncaught synchronous error or an un-awaited rejected Promise reaches the top of the stack, the engine invokes your handler with the error so you can log/report it before the default behavior (console error, or process exit in Node).',
    why: 'They are the last line of defense: a place to capture and report every escaped error to monitoring, present a graceful fallback, and apply a deliberate crash/recovery policy instead of letting failures vanish or take the app down uncontrolled.',
    code: {
      label: 'Registering global handlers in the browser',
      lang: 'js',
      code: `// uncaught synchronous (and resource) errors\nwindow.addEventListener('error', (event) => {\n  report({ message: event.message, source: event.filename, error: event.error })\n})\n\n// promises that rejected with no .catch / try-catch\nwindow.addEventListener('unhandledrejection', (event) => {\n  report({ reason: event.reason })\n  event.preventDefault() // optional: stop the default console warning\n})\n\nfunction report(info) { navigator.sendBeacon('/errors', JSON.stringify(info)) }`,
      explanation: [
        'The "error" event fires for uncaught exceptions and (with a 3rd arg / useCapture) some resource load failures.',
        'event.error is the actual Error object (with stack); event.message is the string.',
        '"unhandledrejection" fires when a Promise rejects and nothing handled it.',
        'event.reason is whatever the promise rejected with.',
        'sendBeacon reliably ships the report even if the page is unloading after the crash.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Global error handlers are runtime-level hooks invoked when an exception or promise rejection propagates past all local handlers. In browsers, the window "error" event (and onerror) fires for uncaught exceptions and resource errors, while "unhandledrejection" fires for promises that reject without a handler within a microtask turn; "rejectionhandled" fires if one is attached late. In Node.js, process "uncaughtException" fires for unhandled synchronous throws and "unhandledRejection" for unhandled promise rejections. These are last-resort interceptors for logging/monitoring and controlled shutdown — not a substitute for local handling — and in Node an uncaughtException leaves the process in an undefined state, so the recommended policy is to log and exit (let a supervisor restart).',

  // 7. Internal Working
  internalWorking: [
    'When an error is thrown and unwinds the entire call stack with no catch, the runtime marks it uncaught and dispatches it to the global hook (window error event / Node uncaughtException) with the Error object.',
    'For promises, the engine tracks whether each rejected promise gains a rejection handler by the end of the current microtask checkpoint; if not, it queues an unhandledrejection notification with the rejection reason.',
    'If a handler is attached later to a previously unhandled rejected promise, the browser fires rejectionhandled so monitors can retract the earlier report.',
    'In the browser, calling event.preventDefault() in the handler suppresses the default action (e.g. logging the rejection to console); the app otherwise keeps running.',
    'In Node.js, after uncaughtException the process is considered to be in an unknown/corrupted state — outstanding resources may be inconsistent — so the safe pattern is to log, flush, and process.exit(1), letting a process manager (PM2, systemd, Kubernetes) restart a clean instance.',
    'Framework-level boundaries (Vue app.config.errorHandler, React error boundaries) intercept render/lifecycle errors before they reach the window hooks, giving component-scoped fallbacks; the window hooks remain the catch-all for everything outside the framework.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   error thrown
        │
   ┌────▼─────────────────────────┐
   │ local try/catch?  ── yes ──► handled, done
   └────┬─────────────────────────┘
        │ no (escaped)
   ┌────▼─────────────────────────┐
   │ framework boundary?           │
   │ (Vue errorHandler / React EB) │ ── yes ──► fallback UI
   └────┬─────────────────────────┘
        │ no
   ┌────▼─────────────────────────┐   browser: window 'error' /
   │ GLOBAL HANDLER (last resort)  │   'unhandledrejection'
   │  → report to monitoring       │   node: uncaughtException /
   │  → fallback / log & exit      │         unhandledRejection
   └───────────────────────────────┘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — Node uncaught exception and rejection',
      lang: 'js',
      code: `process.on('uncaughtException', (err, origin) => {\n  logger.fatal({ err, origin })\n  // process is in an unknown state: log, flush, then exit\n  process.exit(1)\n})\n\nprocess.on('unhandledRejection', (reason) => {\n  logger.error({ reason })\n  // often treated the same as uncaughtException in strict setups\n})`,
      explanation: [
        'uncaughtException catches synchronous throws that escaped every try/catch.',
        'After it fires, the process state is unreliable, so the recommended action is to exit and let a supervisor restart.',
        'unhandledRejection catches promises that rejected with no handler.',
        'Logging here ensures the failure is recorded before the process dies.',
      ],
    },
    intermediate: {
      label: 'Intermediate — browser handlers feeding monitoring',
      lang: 'js',
      code: `function install(report) {\n  window.addEventListener('error', (e) => {\n    // e.error may be null for cross-origin scripts (\"Script error.\")\n    report({ type: 'error', message: e.message, stack: e.error?.stack })\n  })\n  window.addEventListener('unhandledrejection', (e) => {\n    const r = e.reason\n    report({ type: 'rejection', message: r?.message ?? String(r), stack: r?.stack })\n  })\n}\ninstall((info) => navigator.sendBeacon('/api/errors', JSON.stringify(info)))`,
      explanation: [
        'A single install() wires both hooks to one reporting function.',
        'Cross-origin script errors are sanitized by the browser to "Script error." with no stack unless the script is served with CORS + crossorigin attribute.',
        'For rejections, the reason may be an Error or any value, so we guard with optional chaining.',
        'sendBeacon delivers reliably even during navigation/unload.',
      ],
    },
    advanced: {
      label: 'Advanced — framework boundary + global catch-all',
      lang: 'js',
      code: `// Vue: component/render errors hit this BEFORE window\napp.config.errorHandler = (err, instance, info) => {\n  report({ err, info, component: instance?.$options.name })\n  // optionally show a fallback via a reactive flag\n}\n\n// Still keep the window catch-all for non-Vue code (timers, libs)\nwindow.addEventListener('unhandledrejection', (e) => report({ reason: e.reason }))\n\n// React equivalent: an Error Boundary component for render errors\nclass Boundary extends React.Component {\n  componentDidCatch(error, info) { report({ error, info }) }\n  render() { return this.state?.failed ? <Fallback/> : this.props.children }\n}`,
      explanation: [
        'Framework boundaries catch render/lifecycle errors with component context the window hooks lack.',
        'They let you render a scoped fallback instead of a blank screen.',
        'You still need window handlers because errors in timers, event listeners, and third-party libs bypass the framework.',
        'React error boundaries do NOT catch async/event-handler errors — those still need try/catch or window handlers.',
      ],
    },
    realProject: {
      label: 'Real project — graceful shutdown on fatal Node error',
      lang: 'js',
      code: `let shuttingDown = false\nfunction fatal(err, origin) {\n  if (shuttingDown) return\n  shuttingDown = true\n  logger.fatal({ err, origin })\n  server.close(() => process.exit(1))         // stop taking new requests\n  setTimeout(() => process.exit(1), 5000).unref() // force-exit if hung\n}\nprocess.on('uncaughtException', (e, o) => fatal(e, o))\nprocess.on('unhandledRejection', (e) => fatal(e instanceof Error ? e : new Error(String(e))))`,
      explanation: [
        'On a fatal error, stop accepting new requests (server.close) and drain in-flight ones.',
        'A guarded shuttingDown flag prevents double-shutdown if both hooks fire.',
        'A timeout force-exits if graceful close hangs; unref() lets it not keep the loop alive.',
        'A process manager (Kubernetes/PM2) then restarts a fresh, clean instance — the fail-fast policy.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a global error handler and why do you need one?',
      answer: 'It is a top-level hook that catches errors and promise rejections not handled by any local try/catch. You need it as a last-resort safety net to report escaped errors to monitoring, show a fallback, and control crash behavior instead of letting failures vanish or crash uncontrolled.',
      explanation: 'The key framing is "last line of defense / safety net", not a replacement for local handling.',
    },
    {
      level: 'beginner',
      question: 'Which global hooks exist in the browser vs Node.js?',
      answer: 'Browser: the window "error" event (and onerror) for uncaught exceptions, and "unhandledrejection" for unhandled promise rejections. Node.js: process "uncaughtException" and process "unhandledRejection".',
      explanation: 'Naming all four shows familiarity with both environments.',
    },
    {
      level: 'intermediate',
      question: 'What does unhandledrejection catch and how is it triggered?',
      answer: 'It fires when a Promise rejects and no rejection handler (.catch or try/catch around await) is attached by the end of the microtask turn. event.reason holds the rejection value. If a handler is attached late, rejectionhandled fires to retract the report.',
      explanation: 'Tests understanding of the microtask timing and the reason/late-handler detail.',
    },
    {
      level: 'intermediate',
      question: 'Why is "Script error." with no details common in window.onerror?',
      answer: 'Browsers sanitize errors from cross-origin scripts for security, hiding the message and stack. To get full details you must serve the script with CORS headers and add the crossorigin attribute to the script tag.',
      explanation: 'A practical monitoring gotcha that shows real production experience.',
    },
    {
      level: 'advanced',
      question: 'In Node.js, should you keep running after uncaughtException? Why or why not?',
      answer: 'No — after uncaughtException the process is in an undefined state; resources may be half-released and continuing risks corrupted data or leaks. The recommended policy is to log, flush, gracefully stop accepting work, and exit, letting a process manager restart a clean instance.',
      explanation: 'Senior signal: fail-fast philosophy and understanding why resuming is unsafe.',
    },
    {
      level: 'senior',
      question: 'How do framework error boundaries relate to global handlers, and what do they each miss?',
      answer: 'Vue app.config.errorHandler and React error boundaries catch render/lifecycle errors with component context and let you show scoped fallbacks, intercepting before the window hooks. But they miss errors in event handlers, timers, and async code, and React boundaries do not catch async errors. The window/process global handlers remain the catch-all for everything outside the framework. You layer both.',
      explanation: 'Senior signal: knowing the layered model and the precise gaps of each layer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you avoid an infinite loop if your error handler itself throws?',
    'How does sendBeacon help report errors during page unload?',
    'What is the difference between Node uncaughtException and unhandledRejection policy?',
    'How do you de-duplicate or rate-limit error reports to monitoring?',
    'How do you get real stack traces for cross-origin scripts?',
    'How do React error boundaries differ from window error handlers?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using uncaughtException to keep a Node server running indefinitely.',
      why: 'The process is in an unknown state; continuing can corrupt data, leak resources, or serve wrong responses.',
      fix: 'Log, drain, and exit; let a supervisor restart a clean process (fail fast).',
    },
    {
      mistake: 'Relying on global handlers instead of local try/catch.',
      why: 'Global handlers cannot recover gracefully at the point of failure — by then context is lost and the operation already failed.',
      fix: 'Handle recoverable errors locally; reserve global handlers for reporting and last-resort policy.',
    },
    {
      mistake: 'Doing risky work (that can throw) inside the global handler.',
      why: 'If the handler itself throws, you can get recursive errors or lose the original report.',
      fix: 'Keep handlers minimal and defensive; wrap reporting in its own try/catch and guard against re-entry.',
    },
    {
      mistake: 'Ignoring "Script error." cross-origin sanitization.',
      why: 'Most third-party/CDN script errors arrive with no useful detail, so monitoring looks empty or useless.',
      fix: 'Serve scripts with CORS headers and add crossorigin to the script tag to receive full stacks.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'process.on uncaughtException/unhandledRejection log to the monitoring pipeline and trigger graceful shutdown; orchestrators (Kubernetes, PM2) restart the pod/process.' },
    { area: 'Backend', detail: 'A top-level handler flushes logs and metrics before exit, and health checks fail so load balancers stop routing traffic to the dying instance.' },
    { area: 'Vue', detail: 'app.config.errorHandler reports render errors and toggles a global error/fallback view; window unhandledrejection covers async and third-party code.' },
    { area: 'React', detail: 'Error Boundaries (componentDidCatch) render fallback UI for render errors; window handlers + Sentry capture async/event errors the boundaries miss.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Registering global handlers has essentially zero steady-state cost — they only run on failure.',
      'Centralized reporting avoids scattering logging logic, keeping hot paths clean.',
    ],
    bad: [
      'An error storm (a loop throwing repeatedly) can flood your monitoring endpoint and slow the app.',
      'Heavy synchronous work in a handler delays shutdown or blocks the main thread during a crash.',
    ],
    optimizations: [
      'Rate-limit and de-duplicate reports (sample repeated identical errors) before sending.',
      'Use navigator.sendBeacon / async transport so reporting does not block the main thread.',
      'Keep handlers minimal; defer heavy serialization and guard against re-entry.',
      'Batch reports and flush on visibilitychange/beforeunload.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Error reports can leak stack traces, tokens, PII, or internal paths if you send raw error/context to a third party.',
      'An unauthenticated error-ingest endpoint can be abused to flood logs or inject misleading data.',
    ],
    bestPractices: [
      'Scrub/redact sensitive fields and avoid sending full request bodies or auth headers in reports.',
      'Authenticate/rate-limit your error-ingest endpoint and validate payload size.',
      'Configure CORS + crossorigin for scripts to get stacks without exposing more than necessary, and keep detailed traces server-side.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['error-types-try-catch', 'async-error-handling', 'promises', 'event-loop'],
    nextConcepts: ['custom-errors-cause', 'devtools-debugging', 'microtask-queue'],
    dependencyNote:
      'Global handlers are the top of the errors-debugging stack: they build on basic try/catch, async error handling, and the promise/microtask model (since unhandledrejection depends on microtask timing). They pair with custom errors for richer reports and with DevTools debugging for diagnosing what the handler captured.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a downward funnel: top "error thrown".',
      'First filter: "local try/catch" with a branch off to "handled".',
      'Second filter: "framework boundary (Vue/React)" branching to "fallback UI".',
      'Bottom catch-all box: "GLOBAL HANDLER".',
      'Off the global box draw two arrows: "report to monitoring" and "fallback / log & exit".',
      'Say: "Errors fall through local then framework handling; the global handler is the net that reports whatever escaped and decides crash policy — in Node, log and exit."',
    ],
    diagram: `  error
    │ not caught locally
    ▼
  framework boundary? ── yes ─► fallback UI
    │ no
    ▼
  GLOBAL HANDLER ─► report to monitoring
   (window error /   ─► browser: fallback, keep running
    unhandledrejection  node: log + exit → supervisor restarts
    / process events)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Global error handlers are the last-resort net for errors that escaped every try/catch. Browser: window "error" and "unhandledrejection"; Node: process uncaughtException and unhandledRejection. Use them to report escaped errors to monitoring, show a fallback, and set crash policy. In Node, after uncaughtException the process state is unknown, so log and exit and let a supervisor restart. Layer framework boundaries (Vue errorHandler, React error boundaries) above the window hooks; watch the cross-origin "Script error." gotcha.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Global error handlers are the last line of defense for errors that slipped past every local try/catch, because you can never wrap absolutely everything. In the browser there are two: the window "error" event, which fires for uncaught exceptions and gives you event.error with a stack, and "unhandledrejection", which fires when a promise rejects and nothing handled it by the end of the microtask turn, giving you event.reason. In Node.js the equivalents are the process events uncaughtException and unhandledRejection. The main job of these handlers is to report the escaped error to your monitoring pipeline — Sentry, Datadog — using something like navigator.sendBeacon so the report survives even if the page is unloading after a crash, and to apply a deliberate policy. That policy differs by environment: in the browser you typically log and maybe show a fallback UI while the app keeps running, but in Node, after an uncaughtException the process is in an undefined state with possibly half-released resources, so the recommended approach is to log, stop accepting new work, drain in-flight requests, and exit, letting a process manager restart a clean instance — fail fast. Crucially, global handlers are not a substitute for local try/catch; by the time an error reaches them, context is lost and you cannot recover gracefully at the point of failure. So I layer it: local handling where I can recover, framework boundaries like Vue\'s app.config.errorHandler or React error boundaries for scoped render fallbacks, and the window or process handlers as the catch-all. One real gotcha is cross-origin scripts being sanitized to "Script error." with no stack unless you set CORS headers and the crossorigin attribute.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Fail fast vs stay up: exiting on uncaughtException is safe but causes restarts; trying to keep running risks corrupted state — for stateless servers, restart wins.',
      'Centralized reporting vs noise: a single global pipeline is consistent but can drown in error storms without sampling/dedup.',
      'Detail vs privacy: rich stacks/context aid debugging but risk leaking PII/secrets — scrub before sending.',
    ],
    edgeCases: [
      'Cross-origin "Script error." with no stack unless CORS + crossorigin are set.',
      'rejectionhandled fires when a handler is attached late — monitors must retract the earlier unhandledrejection report.',
      'Errors thrown inside the handler itself can recurse — guard against re-entry.',
      'React error boundaries do not catch async/event-handler errors; those need try/catch or window hooks.',
    ],
    runtimeBehavior: [
      'unhandledrejection depends on the microtask checkpoint: a .catch added synchronously after the rejecting call still prevents it.',
      'In Node, the default unhandledRejection behavior has shifted to terminating the process in recent versions — set policy explicitly.',
      'Global handlers run after the stack has fully unwound, so the failing operation has already aborted.',
    ],
    scalability: [
      'Behind a load balancer, fail health checks on fatal errors so traffic drains before the instance exits.',
      'Sample and rate-limit reports so a widespread bug does not DDoS your own ingest endpoint.',
    ],
    productionConcerns: [
      'Always flush logs/metrics before process.exit so the fatal record is not lost.',
      'Wire source maps so minified stacks are readable in monitoring.',
      'De-duplicate identical errors and tag with release/version for triage.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Global handlers = last-resort net for escaped errors, NOT a try/catch replacement.',
    'Browser: window "error" (uncaught) + "unhandledrejection" (promises).',
    'Node: process uncaughtException + unhandledRejection.',
    'event.error / event.reason hold the value; sendBeacon to report.',
    'unhandledrejection depends on microtask timing; late .catch → rejectionhandled.',
    'Node policy: log, drain, process.exit(1); supervisor restarts (fail fast).',
    'Cross-origin scripts → "Script error." unless CORS + crossorigin set.',
    'Layer above: Vue app.config.errorHandler, React error boundaries.',
    'React boundaries miss async/event errors — use try/catch / window hooks.',
    'Guard handler against re-entry; keep it minimal.',
    'Rate-limit/dedup reports; scrub PII/secrets; ship source maps.',
    'Flush logs before exit; fail health checks to drain traffic.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Register a browser handler that reports any unhandled promise rejection to /errors via sendBeacon.',
      hint: 'Listen for "unhandledrejection" and read event.reason.',
      solution: {
        lang: 'js',
        code: `window.addEventListener('unhandledrejection', (event) => {\n  const reason = event.reason\n  navigator.sendBeacon('/errors', JSON.stringify({\n    message: reason?.message ?? String(reason),\n    stack: reason?.stack,\n  }))\n})`,
        explanation: [
          'The event fires for promises that rejected with no handler.',
          'event.reason may be an Error or any value, so we guard with optional chaining.',
          'sendBeacon delivers even if the page is being unloaded.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write Node handlers that log fatal errors and exit, but never run shutdown twice if both events fire.',
      hint: 'Use a guard flag.',
      solution: {
        lang: 'js',
        code: `let down = false\nfunction fatal(err) {\n  if (down) return\n  down = true\n  console.error('FATAL', err)\n  process.exit(1)\n}\nprocess.on('uncaughtException', fatal)\nprocess.on('unhandledRejection', (r) => fatal(r instanceof Error ? r : new Error(String(r))))`,
        explanation: [
          'The down flag ensures shutdown logic runs once even if both hooks fire close together.',
          'unhandledRejection reasons may not be Errors, so we normalize them.',
          'Exiting lets a supervisor restart a clean process.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add report de-duplication so identical errors (same message+stack) are only sent once per 10 seconds.',
      hint: 'Key by message+stack into a Map of last-sent timestamps.',
      solution: {
        lang: 'js',
        code: `const lastSent = new Map()\nfunction reportOnce(info, windowMs = 10000) {\n  const key = info.message + '|' + (info.stack || '')\n  const now = Date.now()\n  if (now - (lastSent.get(key) || 0) < windowMs) return\n  lastSent.set(key, now)\n  navigator.sendBeacon('/errors', JSON.stringify(info))\n}\nwindow.addEventListener('error', (e) =>\n  reportOnce({ message: e.message, stack: e.error?.stack }))`,
        explanation: [
          'A Map tracks when each distinct error was last reported.',
          'If the same error recurs within the window, we skip it, preventing report storms.',
          'This keeps monitoring useful and avoids DDoSing your own ingest endpoint during a tight error loop.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a graceful Node shutdown on fatal error: stop accepting requests, drain in-flight ones, force-exit if it hangs, and explain why you exit rather than continue.',
      hint: 'server.close + a timeout that unref()s.',
      solution: {
        lang: 'js',
        code: `let shuttingDown = false\nfunction shutdown(err) {\n  if (shuttingDown) return\n  shuttingDown = true\n  logger.fatal({ err })\n  healthy = false                 // health check now fails → LB drains\n  server.close(() => process.exit(1)) // finish in-flight, then exit\n  setTimeout(() => process.exit(1), 8000).unref() // force exit if hung\n}\nprocess.on('uncaughtException', shutdown)\nprocess.on('unhandledRejection', (r) => shutdown(r))`,
        explanation: [
          'Flipping the health flag makes the load balancer stop sending new traffic.',
          'server.close stops accepting new connections but lets in-flight requests finish.',
          'The unref()ed timeout guarantees the process exits even if a request hangs.',
          'We exit rather than continue because after an uncaught error the process state is undefined — half-finished writes, leaked handles — so a fresh restart from a supervisor is the only safe state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Global error handling is what makes an app observable and survivable in production — knowing the hooks, the layered model, and the Node crash policy proves you think about reliability, not just the happy path.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) usually just want the names of the hooks. Product companies (Zoho, Flipkart, Razorpay) ask how you wire monitoring, handle unhandled rejections, and show fallback UIs. FAANG-level interviews probe the fail-fast-vs-resume debate in Node, microtask timing of unhandledrejection, cross-origin sanitization, and graceful shutdown with traffic draining.',
    whatInterviewersExpect:
      'They expect you to name the browser and Node hooks, frame global handlers as a last-resort safety net for reporting and policy (not recovery), explain why Node should log-and-exit after uncaughtException, and describe layering with framework boundaries plus the cross-origin "Script error." caveat.',
  },
}

export default globalErrorHandlers
