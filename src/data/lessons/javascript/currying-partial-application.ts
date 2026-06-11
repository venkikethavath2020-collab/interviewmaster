import type { ConceptLesson } from '../../../types/lesson'

const curryingPartialApplication: ConceptLesson = {
  // 1. Concept Summary
  slug: 'currying-partial-application',
  name: 'Currying & Partial Application',
  category: 'functions',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Currying and partial application let you pre-configure functions, producing specialized, reusable versions without rewriting logic.',
    'They are the building blocks of point-free, composable functional code (compose/pipe), used heavily in libraries like Ramda and lodash/fp.',
    'They make callbacks cleaner: pre-bind known arguments so you pass a tidy single-argument function to map/filter/event handlers.',
    'Interviewers ask you to implement a curry function from scratch because it tests closures, arity, recursion, and rest/spread all at once.',
    'Confusing the two (currying vs partial application) or mishandling arity is a common stumble that signals shallow functional knowledge.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Currying is ordering a sandwich one topping at a time, where each choice hands you a smaller menu until the sandwich is finally made.',
    story: [
      'Imagine a sandwich shop where you cannot say everything at once. First they ask: "What bread?" You say wheat, and they hand you a slip.',
      'Then they ask: "What filling?" You say cheese, and they hand you another slip.',
      'Finally they ask: "What sauce?" You say mustard — and only NOW do they make and give you the sandwich.',
      'Currying turns one big question that needs three answers into a chain of small questions, each one waiting for the next. Partial application is similar but friendlier: you can answer two questions at once and finish later. Both let you "lock in" some choices early and finish the rest whenever you are ready.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally a function takes all its arguments at once: add(2, 3) gives 5.',
    'Currying rewrites that function so you give one argument at a time: add(2)(3) gives 5. Each call returns a new function waiting for the next argument.',
    'Partial application is similar but looser: you supply SOME arguments now and get back a function expecting the rest, like fixing add(2) and calling it later with any number.',
    'The point of both is to create specialized functions ("add 2 to anything", "log with the prefix ERROR") by locking in values ahead of time.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Currying transforms a function of N arguments into a sequence of N unary (one-argument) functions, each returning the next, until all arguments are collected. Partial application fixes some arguments of a function, producing a new function that takes the remaining ones — it does not require one-at-a-time calls.',
    how: 'Both rely on closures: the inner function remembers the arguments already supplied. A curry helper recursively gathers args until it has enough (matching the original function arity), then invokes the original. Partial application typically uses bind or a small wrapper that prepends fixed args.',
    why: 'They let you build specialized functions from general ones and write clean point-free pipelines, improving reuse and readability in functional code.',
    code: {
      label: 'Currying vs partial application',
      lang: 'js',
      code: `const add = (a, b, c) => a + b + c\n\n// Partial application: fix some args now, rest later (via bind)\nconst add5 = add.bind(null, 5)\nadd5(2, 3)        // 10  (5 + 2 + 3)\n\n// Currying: one argument at a time\nconst curriedAdd = (a) => (b) => (c) => a + b + c\ncurriedAdd(5)(2)(3) // 10`,
      explanation: [
        'bind(null, 5) fixes the first argument; add5 still expects b and c together.',
        'That is partial application — some args locked, the rest supplied in one later call.',
        'curriedAdd takes exactly one argument per call, returning a new function each time.',
        'Currying always produces a chain of unary functions; partial application does not.',
        'Both use closures to remember the arguments supplied so far.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Currying is the transformation of a function with arity N into a chain of N unary functions, each closing over the previously supplied argument and returning the next function until the final one returns the result. Partial application fixes a subset of a function\'s arguments, yielding a new function of smaller arity that accepts the remaining arguments in a single call. Both exploit closures to retain captured arguments; a generic curry helper inspects fn.length (arity) and accumulates arguments via rest/spread, invoking the original once enough are gathered. The distinction: currying is strictly one-argument-per-call (and total), whereas partial application is one-step fixing of any number of arguments.',

  // 7. Internal Working
  internalWorking: [
    'A generic curry reads the target function\'s arity from fn.length to know how many arguments are required.',
    'It returns a collector function that gathers arguments via rest parameters (...args) into an accumulating array.',
    'On each call, if the accumulated count is >= the arity, it invokes the original function with all gathered args (fn(...all)).',
    'Otherwise it returns a new collector closure that remembers the args so far and waits for more — this closure capture is the crux.',
    'Partial application (bind or a wrapper) creates a closure capturing the fixed leading arguments and prepends them to whatever is passed later.',
    'Because each intermediate function is a closure over previously supplied arguments, no external state is needed and the partial results are isolated per chain.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  CURRYING (one arg per call):
   curriedAdd(5) ─► fn waiting for b  (closure holds 5)
        │(2)
        ▼
   fn waiting for c        (closure holds 5,2)
        │(3)
        ▼
        10   ← all args collected, original runs

  PARTIAL APPLICATION (fix some, rest in one call):
   add.bind(null, 5) ─► fn(b, c)  (closure holds 5)
   add5(2, 3) ─► 10`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — manual currying with arrows',
      lang: 'js',
      code: `const multiply = (a) => (b) => a * b\nconst double = multiply(2)   // fix a = 2\ndouble(10)  // 20\ndouble(7)   // 14`,
      explanation: [
        'multiply takes a, then returns a function taking b.',
        'multiply(2) yields a specialized "double" function (a is fixed at 2).',
        'Each later call supplies b and computes a * b.',
        'The returned function closes over a — that is what remembers the 2.',
      ],
    },
    intermediate: {
      label: 'Intermediate — partial application for cleaner callbacks',
      lang: 'js',
      code: `function logWith(level, message) {\n  console.log(\`[\${level}] \${message}\`)\n}\nconst logError = logWith.bind(null, 'ERROR')   // fix level\nconst logInfo = (m) => logWith('INFO', m)        // partial via wrapper\n\nlogError('disk full')  // [ERROR] disk full\nlogInfo('started')     // [INFO] started`,
      explanation: [
        'bind(null, "ERROR") fixes the first argument, returning a partially applied function.',
        'logError now only needs the message — tidy for reuse.',
        'A small arrow wrapper is the other common way to partially apply.',
        'This produces specialized, single-purpose functions from one general one.',
      ],
    },
    advanced: {
      label: 'Advanced — a generic curry helper',
      lang: 'js',
      code: `function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args)        // enough args → run\n    }\n    return (...next) => curried.apply(this, [...args, ...next])  // gather more\n  }\n}\n\nconst sum3 = (a, b, c) => a + b + c\nconst c = curry(sum3)\nc(1)(2)(3)   // 6\nc(1, 2)(3)   // 6\nc(1)(2, 3)   // 6  — flexible arity collection`,
      explanation: [
        'curry reads fn.length to know the required arity.',
        'It accumulates args; once it has enough, it calls the original.',
        'Otherwise it returns a closure that remembers args so far and waits.',
        'This flexible version accepts arguments in any grouping, not strictly one at a time.',
      ],
    },
    realProject: {
      label: 'Real project — curried selectors / config in a Node service',
      lang: 'js',
      code: `// A curried fetcher pre-configured per resource\nconst makeApi = (baseUrl) => (resource) => (id) =>\n  fetch(\`\${baseUrl}/\${resource}/\${id}\`).then((r) => r.json())\n\nconst api = makeApi('https://api.example.com')\nconst users = api('users')   // specialized to /users\nconst getUser = users        // (id) => Promise<User>\n// getUser(42) → GET /users/42`,
      explanation: [
        'Currying builds increasingly specialized functions: base URL, then resource, then id.',
        'users is pre-bound to the /users resource and only needs an id.',
        'Each layer closes over its argument, so configuration is locked in cleanly.',
        'This pattern shows up in API clients, dependency injection, and Redux/Reselect selectors.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is currying?',
      answer: 'Transforming a function that takes multiple arguments into a sequence of functions that each take a single argument, returning the next function until all arguments are supplied.',
      explanation: 'A good answer stresses "one argument at a time" and gives add(1)(2)(3).',
    },
    {
      level: 'beginner',
      question: 'What is the difference between currying and partial application?',
      answer: 'Currying always breaks a function into a chain of unary calls (one argument each); partial application fixes some arguments now and lets you pass the rest together in one later call. Currying is total and strict; partial application is a single fixing step.',
      explanation: 'Distinguishing the two precisely is the most common discriminator in this topic.',
    },
    {
      level: 'intermediate',
      question: 'How does bind relate to partial application?',
      answer: 'fn.bind(thisArg, a, b) returns a new function with a and b fixed (and this set); calling it appends the remaining arguments. That is exactly partial application built into the language.',
      explanation: 'Connecting partial application to a native API shows practical familiarity.',
    },
    {
      level: 'intermediate',
      question: 'How do closures make currying possible?',
      answer: 'Each returned inner function closes over the arguments supplied so far, keeping them alive until the next call, so the chain accumulates state without any external variables.',
      explanation: 'Tying it back to closures is the conceptual core interviewers want.',
    },
    {
      level: 'advanced',
      question: 'How would you implement a generic curry function?',
      answer: 'Return a collector that uses fn.length for the required arity and rest params to accumulate args; if enough are collected, call fn(...args); otherwise return a closure that concatenates new args with the accumulated ones and recurses.',
      explanation: 'The classic implementation question — arity via fn.length and recursion via closures.',
    },
    {
      level: 'senior',
      question: 'What are the pitfalls of currying in real codebases?',
      answer: 'fn.length ignores rest/default/optional parameters, so arity detection breaks; variadic functions cannot be curried generically; over-currying hurts readability and debuggability; and extra closure allocations add minor overhead in hot paths.',
      explanation: 'Senior signal: arity edge cases, variadics, and pragmatic readability/perf concerns.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does fn.length behave with default and rest parameters?',
    'Can you curry a variadic function? Why is it tricky?',
    'How do currying and function composition work together (point-free style)?',
    'Where have you seen currying in real libraries (Ramda, lodash/fp, Redux selectors)?',
    'What is the performance cost of deep currying chains?',
    'How would you make a curry that supports placeholder arguments?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing currying with partial application.',
      why: 'They are related but distinct; conflating them signals shallow understanding.',
      fix: 'Remember: currying = strict one-arg-at-a-time chain; partial application = fix some args, pass the rest in one call.',
    },
    {
      mistake: 'Relying on fn.length when the function has default or rest parameters.',
      why: 'Default and rest parameters are not counted in fn.length, so a generic curry never reaches the required arity.',
      fix: 'Pass an explicit arity to curry, or avoid currying variadic/defaulted functions.',
    },
    {
      mistake: 'Over-currying simple functions.',
      why: 'It adds indirection and harder-to-read stack traces with little benefit.',
      fix: 'Curry only where pre-configuration or composition genuinely helps; otherwise call normally.',
    },
    {
      mistake: 'Losing this when partially applying methods.',
      why: 'A bare wrapper or bind(null, ...) detaches the method from its object.',
      fix: 'Bind the correct this (fn.bind(obj, ...)) or use an arrow that calls obj.method(...).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pre-configuring event handlers and formatters (e.g. a curried formatter bound to a locale) and building reusable composable factories.' },
    { area: 'React', detail: 'Curried event handlers like handleChange(field) => (e) => ..., and Reselect/Redux selectors that are partially applied with state shape.' },
    { area: 'Node.js', detail: 'Configurable middleware and clients: makeClient(config)(endpoint)(params); dependency injection via curried factories.' },
    { area: 'Backend', detail: 'Functional libraries (Ramda, lodash/fp) ship auto-curried, data-last functions to enable point-free pipelines over records.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Pre-binding arguments avoids re-passing the same values repeatedly, reducing boilerplate.',
      'Curried, data-last functions compose cleanly into pipelines that engines can still optimize.',
    ],
    bad: [
      'Each curry step allocates a closure; deep chains add allocation and GC overhead in hot paths.',
      'Generic curry via apply/spread is slower than a direct call and can deoptimize tight loops.',
    ],
    optimizations: [
      'Curry once at module load and reuse the specialized functions, not per call/render.',
      'For hot paths, prefer a hand-written closure or a direct call over a generic curry helper.',
      'Pass an explicit arity to skip fn.length pitfalls and reduce branching.',
      'Avoid currying inside render/loop bodies where a fresh chain would be created each iteration.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'higher-order-functions', 'call-apply-bind', 'default-rest-spread'],
    nextConcepts: ['function-composition', 'pure-functions', 'memoization'],
    dependencyNote:
      'Currying and partial application are closures plus higher-order functions in action, and bind provides native partial application. They directly enable function composition and point-free functional pipelines.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write add(a,b,c) and show two transforms beneath it.',
      'Currying: draw add(a)(b)(c) as a vertical chain, each box closing over its arg.',
      'Partial application: draw add.bind(null, 5) → a function taking (b, c).',
      'Annotate the closures that remember the supplied arguments.',
      'Say: "Currying makes a chain of unary functions; partial application fixes some args and takes the rest in one call. Both are closures remembering arguments — I implement curry by checking fn.length and gathering args until I have enough."',
    ],
    diagram: `  add(a,b,c)
  ─ curry ─►  add(a)(b)(c)   (unary chain, closures)
  ─ partial ► add.bind(null,5) ─► (b,c) => 5+b+c
  curry: fn.length tells how many args to collect`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Currying turns a multi-argument function into a chain of unary functions — add(1)(2)(3) — each closing over the supplied argument. Partial application fixes some arguments now (often via bind) and takes the rest in one later call. Both use closures to remember supplied arguments and let you build specialized functions for reuse and composition. A generic curry reads fn.length for arity and gathers args until it has enough, then invokes the original. Watch out for fn.length breaking with default/rest params.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Currying and partial application are two related ways to pre-configure functions, both powered by closures. Currying transforms a function that takes N arguments into a chain of N functions that each take exactly one argument, returning the next function until all arguments are collected and the result is produced — so add(a, b, c) becomes add(a)(b)(c). Partial application is looser: it fixes some of a function\'s arguments now and returns a new function that accepts the remaining ones in a single call, which is exactly what fn.bind(thisArg, a) does. The distinction interviewers care about is that currying is strict and total — one argument per call — while partial application is a single fixing step of any number of arguments. Both rely on closures: each returned function remembers the arguments supplied so far, so no external state is needed. To implement a generic curry, I return a collector that reads the target\'s arity from fn.length, accumulates arguments with rest parameters, and either invokes the original once it has enough or returns another closure that concatenates new arguments and recurses. The practical value is building specialized functions — a logger fixed to a level, an API client fixed to a base URL — and enabling point-free composition, which is why libraries like Ramda auto-curry their data-last functions. The main gotcha is that fn.length ignores default and rest parameters, so generic currying breaks on variadic functions unless you pass an explicit arity.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Currying enables elegant point-free composition but reduces readability and clutters stack traces for newcomers.',
      'Auto-currying (Ramda-style) is ergonomic but relies on arity detection that fails for variadic/defaulted functions.',
    ],
    edgeCases: [
      'fn.length excludes parameters after the first default and excludes rest parameters, breaking arity-based curry.',
      'Variadic functions (sum(...nums)) cannot be generically curried since required arity is unknown.',
      'Partial application of methods loses this unless bound correctly.',
      'Placeholder-aware currying (filling later gaps) needs special sentinel handling.',
    ],
    runtimeBehavior: [
      'Each curry step allocates a new closure; deep chains create several short-lived function objects.',
      'Generic curry uses apply/spread which is slower than direct invocation and may inhibit inlining.',
      'Captured argument arrays stay alive until the chain completes or is discarded.',
    ],
    scalability: [
      'Curry once and reuse specialized functions; never build chains inside hot loops or render paths.',
      'Data-last currying scales composition across large pipelines but profile hot transforms.',
    ],
    productionConcerns: [
      'Document arity expectations; provide an explicit-arity curry to avoid fn.length surprises.',
      'Avoid over-abstracting business logic into point-free chains that are hard to debug under incidents.',
      'Be deliberate about this-binding when partially applying object methods.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Currying: f(a, b, c) → f(a)(b)(c), unary chain.',
    'Partial application: fix some args, pass the rest in one call.',
    'bind(thisArg, ...fixed) = native partial application.',
    'Both built on closures remembering supplied args.',
    'Generic curry uses fn.length (arity) + rest/spread to gather args.',
    'fn.length ignores default & rest params — breaks generic curry.',
    'Variadic functions cannot be generically curried.',
    'Currying enables point-free composition (compose/pipe).',
    'Curry once, reuse; never build chains in hot loops.',
    'Mind this when partially applying methods.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a curried add(a)(b) and create an addTen using it.',
      hint: 'Return a function from a function; fix a.',
      solution: {
        lang: 'js',
        code: `const add = (a) => (b) => a + b\nconst addTen = add(10)\naddTen(5) // 15`,
        explanation: ['add returns a function that closes over a.', 'add(10) fixes a, producing a reusable addTen.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Use partial application to make a greet function fixed to a greeting word.',
      hint: 'bind or wrap to fix the first argument.',
      solution: {
        lang: 'js',
        code: `function greet(greeting, name) {\n  return \`\${greeting}, \${name}!\`\n}\nconst hello = greet.bind(null, 'Hello')\nhello('Ada') // 'Hello, Ada!'`,
        explanation: ['bind(null, "Hello") fixes the greeting argument.', 'hello now only needs the name — a partially applied function.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a generic curry(fn) that supports c(1)(2)(3), c(1,2)(3), and c(1)(2,3).',
      hint: 'Use fn.length and accumulate args until you have enough.',
      solution: {
        lang: 'js',
        code: `function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args)\n    return (...next) => curried.apply(this, [...args, ...next])\n  }\n}\nconst sum = curry((a, b, c) => a + b + c)\nsum(1)(2)(3)   // 6\nsum(1, 2)(3)   // 6\nsum(1)(2, 3)   // 6`,
        explanation: [
          'fn.length gives the required number of arguments.',
          'We accumulate args across calls via closures and spread.',
          'Once enough are gathered, the original runs; otherwise we return a new collector.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement partial(fn, ...preset) that fixes leading arguments and supports a placeholder (use the symbol _) to skip positions.',
      hint: 'Walk the preset; when you hit the placeholder, take the next supplied argument.',
      solution: {
        lang: 'js',
        code: `const _ = Symbol('placeholder')\nfunction partial(fn, ...preset) {\n  return function (...later) {\n    const args = []\n    let li = 0\n    for (const p of preset) {\n      args.push(p === _ ? later[li++] : p)\n    }\n    while (li < later.length) args.push(later[li++])\n    return fn.apply(this, args)\n  }\n}\nconst greet = (g, name, punct) => g + ', ' + name + punct\nconst ask = partial(greet, 'Hi', _, '?')\nask('Ada') // 'Hi, Ada?'`,
        explanation: [
          'Placeholders mark positions to be filled by later arguments.',
          'We merge preset and later args, substituting at placeholder slots.',
          'This mirrors lodash _.partial with placeholders — a strong functional-programming signal.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Currying and partial application sit at the heart of functional JavaScript. Being able to define both precisely and implement a generic curry from scratch proves you understand closures, arity, and higher-order functions deeply — a clear senior signal.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and the difference between the two. Product companies (Zoho, Flipkart, Razorpay) ask you to implement curry and partial from scratch. FAANG-level interviews probe arity edge cases (fn.length with default/rest), placeholder support, and how currying enables composition.',
    whatInterviewersExpect:
      'They expect you to clearly distinguish currying from partial application, explain the closure mechanism, implement a flexible curry using fn.length and rest/spread, and discuss real uses (selectors, API clients) plus pitfalls like variadic arity.',
  },
}

export default curryingPartialApplication
