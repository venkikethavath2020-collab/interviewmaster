import type { ConceptLesson } from '../../../types/lesson'

const customErrorsCause: ConceptLesson = {
  // 1. Concept Summary
  slug: 'custom-errors-cause',
  name: 'Custom Errors & cause',
  category: 'errors-debugging',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Custom error classes let you distinguish failure kinds (ValidationError vs NetworkError vs NotFoundError) so callers can handle each correctly instead of inspecting fragile message strings.',
    'The Error `cause` option (ES2022) preserves the original error when you wrap and rethrow, so you keep the full chain instead of losing the root stack trace.',
    'Without typed errors and cause chains, debugging production incidents means guessing from a single opaque message — you lose the "why" behind the "what".',
    'Interviewers ask it to test whether you extend Error correctly (instanceof, prototype, name), understand error wrapping, and know modern features like cause and AggregateError.',
    'Clean error taxonomies map directly to HTTP status codes, retry decisions, and user messaging in real backends and frontends.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A custom error is like putting a labeled sticker on a problem ("FOOD spill" vs "BROKEN toy"), and cause is the note that says "this happened BECAUSE of that".',
    story: [
      'Imagine your toy stops working and you bring it to a grown-up. If you just say "it is broken", they do not know how to help.',
      'Instead you put a clear label on it: "the wheel fell off". Now they know exactly what kind of problem it is.',
      'And you add a note: "the wheel fell off BECAUSE my little brother stepped on it". That note is the cause — the real reason behind the problem.',
      'Custom errors are those clear labels, and the cause is the note explaining the deeper reason, so whoever fixes it understands both what broke and why.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript has a built-in Error type, but you can make your own kinds of errors by extending it — like making a special "ValidationError" or "NetworkError".',
    'Giving each error its own type and name lets your code react differently depending on what went wrong.',
    'When one error happens because of another (a database failure causing a "save failed" error), you can attach the original error as the cause.',
    'This keeps a chain: the new error explains the high-level problem, and its cause points to the original low-level reason, which is invaluable when debugging.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A custom error is a class that extends Error, adding a specific name and often extra fields (like statusCode). The cause option lets you create an Error whose .cause is the underlying error it was triggered by.',
    how: 'You write `class ValidationError extends Error` and set this.name in the constructor. When wrapping a lower-level error, you pass `new Error(msg, { cause: originalError })` so the new error remembers what caused it. Callers branch with `instanceof`.',
    why: 'It gives errors meaning and structure — callers can handle ValidationError differently from NetworkError, map them to status codes, and trace a failure back through every layer via the cause chain.',
    code: {
      label: 'A custom error class plus cause',
      lang: 'js',
      code: `class ValidationError extends Error {\n  constructor(message, field) {\n    super(message)\n    this.name = 'ValidationError'  // so stack/logs show the right type\n    this.field = field            // extra structured data\n  }\n}\n\nfunction parseConfig(raw) {\n  try {\n    return JSON.parse(raw)\n  } catch (err) {\n    // wrap the low-level SyntaxError, keep it as the cause\n    throw new Error('Invalid config file', { cause: err })\n  }\n}\n\ntry { parseConfig('nope') }\ncatch (e) { console.log(e.message, '<-', e.cause.message) }`,
      explanation: [
        'extends Error makes ValidationError a real Error subclass — instanceof Error is true.',
        'super(message) sets the message; setting this.name controls how it is labeled.',
        'this.field adds structured context callers can read programmatically.',
        '{ cause: err } attaches the original SyntaxError so the root reason is not lost.',
        'e.cause lets you walk back to what really went wrong while e.message stays high-level.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A custom error is a subclass of the built-in Error (or a specific subclass) created with class X extends Error, where super(message) initializes message/stack and the subclass sets this.name and any domain fields. The Error constructor\'s second argument, an options object with a cause property (ES2022), stores an arbitrary value (usually the originating error) on instance.cause, enabling error chaining without discarding the original stack. Correct subclassing relies on the prototype chain so instanceof works; AggregateError aggregates multiple errors (e.g. Promise.any rejections) under an .errors array.',

  // 7. Internal Working
  internalWorking: [
    'class X extends Error sets X.prototype.__proto__ to Error.prototype, so instances inherit Error behavior and instanceof Error / instanceof X both succeed.',
    'In the constructor, super(message) invokes the Error constructor, which assigns message and (engine-specific) captures the stack trace at that point.',
    'Setting this.name in the subclass overrides the inherited "Error" name so toString() and logs read e.g. "ValidationError: ...".',
    'Passing { cause } as the second argument stores the value on this.cause; the engine does not interpret it — it is just preserved for you to inspect or log.',
    'Down-leveling to old targets (pre-ES2015 class transpilation) can break the prototype link so instanceof fails; setting Object.setPrototypeOf(this, X.prototype) in the constructor restores it.',
    'AggregateError is constructed with an iterable of errors plus a message; the engine exposes them on .errors so multiple simultaneous failures travel together.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ERROR CHAIN (cause links)
   ┌────────────────────────────┐
   │ AppError: "Could not save"  │  ← what the user/caller sees
   │   .name = 'AppError'        │
   │   .cause ──────────────┐    │
   └────────────────────────┼────┘
                            ▼
   ┌────────────────────────────┐
   │ DbError: "connection lost"  │  ← service layer
   │   .cause ──────────────┐    │
   └────────────────────────┼────┘
                            ▼
   ┌────────────────────────────┐
   │ TypeError: "socket null"    │  ← the ROOT cause (original)
   └────────────────────────────┘
   instanceof checks the prototype chain: e instanceof AppError ✓`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a typed error callers can branch on',
      lang: 'js',
      code: `class NotFoundError extends Error {\n  constructor(resource) {\n    super(resource + ' not found')\n    this.name = 'NotFoundError'\n    this.statusCode = 404\n  }\n}\n\ntry {\n  throw new NotFoundError('User')\n} catch (err) {\n  if (err instanceof NotFoundError) console.log(err.statusCode) // 404\n}`,
      explanation: [
        'NotFoundError extends Error so it is a real error with a stack trace.',
        'statusCode lets a web layer map the error straight to an HTTP response.',
        'instanceof NotFoundError lets the caller handle this case specifically.',
        'this is far more robust than checking err.message.includes("not found").',
      ],
    },
    intermediate: {
      label: 'Intermediate — wrapping with cause across layers',
      lang: 'js',
      code: `class RepoError extends Error {\n  constructor(message, options) {\n    super(message, options)   // forwards { cause }\n    this.name = 'RepoError'\n  }\n}\n\nasync function getUser(id) {\n  try {\n    return await db.query('SELECT ...', [id])\n  } catch (dbErr) {\n    // add context but keep the original as the cause\n    throw new RepoError('Failed to load user ' + id, { cause: dbErr })\n  }\n}`,
      explanation: [
        'The constructor forwards options to super so cause is set on the instance.',
        'The high-level message says what the app was doing; the cause holds the raw DB error.',
        'When this surfaces in logs you see both the friendly message and the root failure.',
        'No information is lost — the original stack is reachable via err.cause.',
      ],
    },
    advanced: {
      label: 'Advanced — walking the cause chain + AggregateError',
      lang: 'js',
      code: `function rootCause(err) {\n  let cur = err\n  while (cur.cause instanceof Error) cur = cur.cause\n  return cur                       // deepest original error\n}\n\nasync function firstSuccess(urls) {\n  try {\n    return await Promise.any(urls.map((u) => fetch(u)))\n  } catch (agg) {\n    // Promise.any rejects with an AggregateError of ALL failures\n    console.log(agg.errors.length, 'sources failed')\n    throw new Error('All sources failed', { cause: agg })\n  }\n}`,
      explanation: [
        'rootCause walks .cause until it reaches the original error — useful for logging the real failure.',
        'Promise.any rejects only if every promise rejects, producing an AggregateError.',
        'agg.errors is the array of all individual rejection reasons.',
        'We rethrow with the AggregateError as cause, preserving every failure for diagnosis.',
      ],
    },
    realProject: {
      label: 'Real project — error taxonomy in a Node API + Vue display',
      lang: 'js',
      code: `// Node: a small hierarchy mapped to HTTP\nclass AppError extends Error {\n  constructor(message, statusCode, options) {\n    super(message, options)\n    this.name = this.constructor.name\n    this.statusCode = statusCode\n  }\n}\nclass ValidationError extends AppError { constructor(m, o) { super(m, 400, o) } }\nclass AuthError extends AppError { constructor(m, o) { super(m, 401, o) } }\n\n// express error middleware\napp.use((err, req, res, next) => {\n  const status = err instanceof AppError ? err.statusCode : 500\n  if (err.cause) logger.error({ msg: err.message, cause: err.cause })\n  res.status(status).json({ error: err.message }) // safe message only\n})`,
      explanation: [
        'A base AppError carries statusCode; subclasses fix the code per failure kind.',
        'this.name = this.constructor.name auto-labels each subclass correctly.',
        'Centralized middleware maps instanceof AppError to the right HTTP status, defaulting unknown errors to 500.',
        'The cause is logged server-side for debugging, but only a safe message is sent to the client — a Vue app then shows that message in its error state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you create a custom error type in JavaScript?',
      answer: 'Define a class that extends Error, call super(message) in the constructor, and set this.name to the class name. You can add extra fields like statusCode. This gives you a real Error (with a stack) that instanceof can detect.',
      explanation: 'The must-haves are extends Error, super(message), and this.name — missing any weakens the error.',
    },
    {
      level: 'intermediate',
      question: 'What is the Error cause option and why is it useful?',
      answer: 'cause is the second-argument option (ES2022): new Error(msg, { cause: original }). It stores the underlying error on err.cause, so when you wrap and rethrow you preserve the original error and its stack instead of discarding it, keeping a full chain for debugging.',
      explanation: 'Shows knowledge of a modern feature and the wrap-without-losing-context pattern.',
    },
    {
      level: 'intermediate',
      question: 'Why prefer instanceof over checking err.message or err.name?',
      answer: 'Messages are human text that changes and may be localized, so matching on them is fragile. instanceof checks the prototype chain reliably, and a typed hierarchy lets callers branch on the actual error class regardless of message wording.',
      explanation: 'Tests judgment about robust error handling versus brittle string matching.',
    },
    {
      level: 'advanced',
      question: 'Why might instanceof fail for a custom error after transpilation, and how do you fix it?',
      answer: 'When classes are transpiled to ES5 (targeting old environments), extending built-ins like Error can break the prototype chain because the Error constructor returns a new object, so the subclass prototype is not linked. The fix is Object.setPrototypeOf(this, NewClass.prototype) in the constructor.',
      explanation: 'A real-world gotcha that signals deep understanding of prototypes and transpilation behavior.',
    },
    {
      level: 'advanced',
      question: 'What is AggregateError and when do you encounter it?',
      answer: 'AggregateError wraps multiple errors under an .errors array. You encounter it when Promise.any rejects (all input promises rejected), and you can throw your own to report several simultaneous failures together.',
      explanation: 'Connects custom errors to Promise combinators and multi-failure scenarios.',
    },
    {
      level: 'senior',
      question: 'How would you design an error taxonomy for a service, and how does it map to HTTP and retries?',
      answer: 'Create a base AppError with a statusCode and an isOperational/retryable flag, then subclass per category (ValidationError 400, AuthError 401, NotFoundError 404, ConflictError 409, UpstreamError 502). Centralized middleware maps instanceof to status codes; retryable/transient errors (timeouts, 5xx upstream) are retried while operational client errors are not. Use cause to preserve the originating error for logging.',
      explanation: 'Senior signal: a coherent taxonomy that drives status mapping, retry policy, and observability — not ad-hoc errors.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you serialize an error (including cause) to JSON for an API or logs?',
    'What is the difference between operational and programmer errors?',
    'How do you set this.name automatically for many subclasses?',
    'Does the cause appear automatically in console output / stack traces?',
    'How do error boundaries / middleware decide status codes from error types?',
    'How would you make a retryable vs non-retryable distinction in your error classes?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to set this.name in the subclass.',
      why: 'The error logs as generic "Error" instead of the specific type, making logs and stack traces harder to read.',
      fix: 'Set this.name = "MyError" (or this.constructor.name) in the constructor.',
    },
    {
      mistake: 'Throwing a new error and dropping the original.',
      why: 'You lose the root cause and its stack trace, so the real reason for the failure is gone from logs.',
      fix: 'Wrap with { cause: originalError } and forward options through super(message, options).',
    },
    {
      mistake: 'Branching on err.message strings instead of types.',
      why: 'Messages change, get localized, or are reworded, silently breaking the handling logic.',
      fix: 'Define typed error classes and branch with instanceof (or a stable code field).',
    },
    {
      mistake: 'Assuming instanceof always works after a build step.',
      why: 'Transpiling classes to ES5 can sever the prototype chain for built-in subclasses.',
      fix: 'Add Object.setPrototypeOf(this, NewClass.prototype) in the constructor, or target ES2015+ output.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'APIs define an AppError hierarchy with statusCode and retryable flags; centralized middleware maps instanceof to HTTP responses and logs cause chains to Sentry/Datadog.' },
    { area: 'Backend', detail: 'Wrapping low-level driver errors (DB, network) in domain errors with cause keeps the abstraction clean while preserving the root failure for ops.' },
    { area: 'Vue', detail: 'Service-layer functions throw typed errors; composables/components map ValidationError to inline field messages and AuthError to a redirect, reading err.field / err.statusCode.' },
    { area: 'React', detail: 'Error boundaries inspect the error type to decide whether to show a retry button (transient) or a permanent failure UI; logging includes the cause chain.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Typed errors are essentially free at runtime — they are normal objects; the benefit is faster debugging, not slower code.',
      'cause adds negligible cost while saving large amounts of investigation time during incidents.',
    ],
    bad: [
      'Throwing errors in hot loops is expensive because stack capture is costly — typing them does not change that.',
      'Deeply nested cause chains with large payloads can bloat logs if serialized naively.',
    ],
    optimizations: [
      'Reserve throwing for genuinely exceptional cases; use result objects for expected branches.',
      'Cap/serialize cause chains carefully (avoid dumping huge objects) when logging.',
      'Reuse a small set of error classes rather than constructing bespoke ones everywhere.',
      'Avoid attaching large request/response bodies directly to errors; attach identifiers instead.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Serializing full error/cause chains to API responses can leak stack traces, queries, and internal paths to attackers.',
      'Storing sensitive data (tokens, PII) in error fields or causes can expose it in logs.',
    ],
    bestPractices: [
      'Send only safe, generic messages to clients; keep detailed cause chains in server-side logs.',
      'Strip or redact sensitive fields before attaching context to an error.',
      'Map internal error types to client-safe codes so you never reveal implementation details.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['error-types-try-catch', 'es6-classes', 'inheritance-patterns', 'prototype-chain'],
    nextConcepts: ['global-error-handlers', 'async-error-handling', 'promise-combinators'],
    dependencyNote:
      'Custom errors build on basic Errors & try/catch and on ES6 classes / the prototype chain (since you extend Error and rely on instanceof). They feed into global error handlers and async error handling, and AggregateError ties them to promise combinators like Promise.any.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write class ValidationError extends Error { constructor(m){ super(m); this.name = "ValidationError" } }.',
      'Note "instanceof works because prototype chain → Error.prototype".',
      'Draw three stacked error boxes connected by .cause arrows: AppError → DbError → TypeError.',
      'Label the bottom one "root cause (original stack)".',
      'Write new Error(msg, { cause: original }) beside the arrows.',
      'Say: "Typed errors let callers branch with instanceof, and cause chains preserve the root reason all the way down for debugging."',
    ],
    diagram: `  class MyError extends Error {
    constructor(m, opts) { super(m, opts); this.name = 'MyError' }
  }
  new Error('high level', { cause: lowLevelErr })

  AppError ──.cause──► DbError ──.cause──► TypeError (root)
     instanceof AppError ✓   walk .cause to find the real reason`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Custom errors are classes that extend Error, call super(message), set this.name, and add fields like statusCode so callers branch with instanceof instead of fragile message matching. The cause option — new Error(msg, { cause: original }) — chains errors so wrapping a low-level failure preserves the root error and stack. AggregateError (from Promise.any) bundles many errors via .errors. Watch the transpilation gotcha where instanceof breaks — fix with Object.setPrototypeOf. Map a typed hierarchy to HTTP codes and retry decisions.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Custom errors and the cause option are about giving failures structure and traceability. A custom error is just a class that extends Error: in the constructor you call super(message), set this.name to the class name, and add any domain fields like statusCode or field. Because it is a real subclass, instanceof works through the prototype chain, so callers can branch on the actual type — handling a ValidationError differently from an AuthError — instead of matching fragile message strings that change or get localized. The cause option, added in ES2022, is the second argument to the Error constructor: new Error(message, { cause: originalError }). It stores the underlying error on err.cause, so when you catch a low-level failure, add context, and rethrow a higher-level error, you do not throw away the original stack — you keep a chain you can walk all the way down to the root cause when debugging an incident. A couple of advanced points: when classes are transpiled to ES5, extending built-ins like Error can break the prototype link so instanceof fails, and the fix is Object.setPrototypeOf(this, MyError.prototype) in the constructor. And AggregateError, what Promise.any rejects with, bundles multiple errors under an .errors array. In a real service I design a small taxonomy — a base AppError with a statusCode, subclassed per category — and centralized middleware maps instanceof to the right HTTP status while logging the full cause chain but sending only a safe message to the client.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Rich taxonomy vs simplicity: many error classes give precise handling but add maintenance; too few force string sniffing — find the right granularity per domain.',
      'Wrapping vs rethrowing as-is: wrapping with cause adds context but lengthens chains; sometimes preserving the original type is more useful for callers.',
      'Codes vs classes: a stable string `code` field travels across process/serialization boundaries better than instanceof, which fails after JSON round-trips.',
    ],
    edgeCases: [
      'instanceof breaks after JSON serialization/IPC/worker boundaries — use a code field for cross-boundary checks.',
      'Transpilation severs the prototype chain for built-in subclasses (the setPrototypeOf fix).',
      'cause is not auto-printed by all loggers/console versions — you may need to serialize it yourself.',
      'AggregateError handling: forgetting that Promise.any (not all/race) is the one that produces it.',
    ],
    runtimeBehavior: [
      'super(message) captures the stack at construction; constructing errors far from the throw site can mislead — construct where the failure occurs.',
      'cause is stored verbatim and not interpreted by the engine; circular causes are possible and can break naive serializers.',
      'Stack capture cost makes throwing in hot paths expensive regardless of typing.',
    ],
    scalability: [
      'A shared error module with a base class and a stable code/statusCode mapping keeps large codebases consistent across teams.',
      'Tagging errors as operational vs programmer (and retryable vs not) lets infrastructure decide retries, circuit-breaking, and alerting automatically.',
    ],
    productionConcerns: [
      'Serialize errors carefully for logs (message + name + code + sanitized cause chain) and never leak stacks to clients.',
      'Ensure monitoring (Sentry) captures the cause chain so the root failure is visible, not just the wrapper.',
      'Redact sensitive data before attaching it to error context.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Custom error = class X extends Error; super(message); this.name = "X".',
    'Add fields (statusCode, field, code) for structured handling.',
    'Branch with instanceof, NOT err.message matching.',
    'cause (ES2022): new Error(msg, { cause: original }) chains errors.',
    'Forward options through super(message, options) in subclasses.',
    'Walk .cause to find the root cause for logging.',
    'AggregateError(.errors) comes from Promise.any (all rejected).',
    'Transpile-to-ES5 breaks instanceof → Object.setPrototypeOf(this, X.prototype).',
    'instanceof fails across JSON/IPC boundaries → use a stable code field.',
    'Map error types → HTTP status + retry policy centrally.',
    'Construct errors at the failure site (correct stack).',
    'Log full chain server-side; send safe message to clients.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a TimeoutError class extending Error with a name and a durationMs field.',
      hint: 'Set this.name and store the duration.',
      solution: {
        lang: 'js',
        code: `class TimeoutError extends Error {\n  constructor(durationMs) {\n    super('Operation timed out after ' + durationMs + 'ms')\n    this.name = 'TimeoutError'\n    this.durationMs = durationMs\n  }\n}\nconst e = new TimeoutError(5000)\ne instanceof Error // true`,
        explanation: [
          'extends Error makes it a real error with a stack.',
          'super(...) sets a descriptive message.',
          'this.name and this.durationMs give callers a type and structured data to branch on.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Wrap a failing JSON.parse in a ConfigError that keeps the original SyntaxError as its cause.',
      hint: 'Pass { cause } to super.',
      solution: {
        lang: 'js',
        code: `class ConfigError extends Error {\n  constructor(message, options) {\n    super(message, options)\n    this.name = 'ConfigError'\n  }\n}\nfunction loadConfig(raw) {\n  try {\n    return JSON.parse(raw)\n  } catch (err) {\n    throw new ConfigError('Config is not valid JSON', { cause: err })\n  }\n}`,
        explanation: [
          'The constructor forwards options to super so cause is attached.',
          'The thrown ConfigError has a clear high-level message.',
          'err.cause still points to the original SyntaxError, preserving the root stack.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write getRootCause(err) that returns the deepest cause in a chain, and serializeError(err) returning a plain object with name, message, and a nested cause.',
      hint: 'Loop on .cause for the root; recurse for serialization.',
      solution: {
        lang: 'js',
        code: `function getRootCause(err) {\n  let cur = err\n  while (cur && cur.cause instanceof Error) cur = cur.cause\n  return cur\n}\nfunction serializeError(err) {\n  if (!(err instanceof Error)) return err\n  return {\n    name: err.name,\n    message: err.message,\n    cause: err.cause ? serializeError(err.cause) : undefined,\n  }\n}`,
        explanation: [
          'getRootCause walks .cause while each is an Error, returning the deepest one.',
          'serializeError builds a JSON-safe object since Error does not serialize via JSON.stringify by default.',
          'Recursing on cause preserves the whole chain in the serialized form — useful for logging.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a minimal error hierarchy (AppError base + ValidationError 400 + NotFoundError 404) and a function toHttp(err) returning { status, body } that defaults unknown errors to 500 without leaking internals.',
      hint: 'Base class holds statusCode; toHttp branches on instanceof AppError.',
      solution: {
        lang: 'js',
        code: `class AppError extends Error {\n  constructor(message, statusCode, options) {\n    super(message, options)\n    this.name = this.constructor.name\n    this.statusCode = statusCode\n  }\n}\nclass ValidationError extends AppError { constructor(m, o) { super(m, 400, o) } }\nclass NotFoundError extends AppError { constructor(m, o) { super(m, 404, o) } }\n\nfunction toHttp(err) {\n  if (err instanceof AppError) {\n    return { status: err.statusCode, body: { error: err.message } }\n  }\n  // unknown/programmer error: do not leak details\n  return { status: 500, body: { error: 'Internal Server Error' } }\n}`,
        explanation: [
          'AppError centralizes statusCode and auto-sets name from the subclass.',
          'Subclasses fix their status code so call sites just throw the right type.',
          'toHttp maps known AppErrors to their status and safe message; anything else becomes a generic 500 so stacks/internals never leak to the client.',
          'cause (passed via options) would be logged server-side, not returned in the body.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Typed errors and cause chains are what separate hobby error handling from production-grade systems — they show you can build maintainable failure handling, map errors to behavior, and debug incidents from the root cause.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) usually just ask how to create a custom error class. Product companies (Zoho, Flipkart, Razorpay) ask about wrapping with cause, instanceof vs message, and mapping errors to HTTP. FAANG-level interviews probe the transpilation/instanceof gotcha, AggregateError, cross-boundary code fields, and designing a retry-aware taxonomy.',
    whatInterviewersExpect:
      'They expect correct subclassing (extends Error, super, this.name), use of { cause } to preserve the original, branching via instanceof, and at the senior end a coherent error taxonomy mapped to status codes and retry policy with safe client messaging.',
  },
}

export default customErrorsCause
