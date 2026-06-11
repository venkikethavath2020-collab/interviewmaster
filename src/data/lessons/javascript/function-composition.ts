import type { ConceptLesson } from '../../../types/lesson'

const functionComposition: ConceptLesson = {
  // 1. Concept Summary
  slug: 'function-composition',
  name: 'Function Composition',
  category: 'functions',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Composition lets you build complex behavior by snapping together small, single-purpose functions — the essence of functional programming.',
    'It produces declarative data pipelines (pipe/compose) that read top-to-bottom instead of nested, hard-to-follow calls.',
    'It encourages small pure functions, which are independently testable and reusable across pipelines.',
    'Interviewers ask you to implement compose/pipe with reduce to test higher-order functions, argument flow, and functional thinking.',
    'Without composition you get deeply nested f(g(h(x))) calls or imperative spaghetti that is hard to extend and reorder.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Composition is a factory conveyor belt: the toy passes through one station at a time — paint, then dry, then box — each doing one job.',
    story: [
      'Imagine a toy moving along a conveyor belt in a factory.',
      'At the first station it gets painted. At the next, it gets dried. At the last, it gets put in a box.',
      'Each station does just ONE small job and then passes the toy to the next station.',
      'Function composition is exactly that conveyor belt for data: you line up small functions, and the output of one becomes the input of the next, until the finished result comes out the end.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Composition means taking the output of one function and feeding it straight into the next function.',
    'If you have a function that doubles a number and another that adds one, composing them runs them in sequence on a single value.',
    'pipe runs left-to-right (first function first); compose runs right-to-left (last function first), like the math notation f(g(x)).',
    'It lets you build one big function out of many small ones, which is easier to read and to change.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Function composition is combining two or more functions so the output of each becomes the input of the next, producing a single new function. compose applies right-to-left; pipe applies left-to-right.',
    how: 'You implement it with reduce/reduceRight over an array of functions, threading a value through each. Each function should take one input and return one output (unary) for clean chaining.',
    why: 'It turns nested calls into readable pipelines, promotes small reusable pure functions, and makes the data flow explicit and easy to reorder or extend.',
    code: {
      label: 'compose and pipe',
      lang: 'js',
      code: `const double = (n) => n * 2\nconst inc = (n) => n + 1\n\n// compose: right-to-left  →  inc runs first? No: double(inc(x))\nconst compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x)\nconst pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)\n\ncompose(double, inc)(5) // double(inc(5)) = double(6) = 12\npipe(double, inc)(5)    // inc(double(5)) = inc(10) = 11`,
      explanation: [
        'compose(double, inc)(5) applies inc first (rightmost), then double — like double(inc(5)).',
        'pipe(double, inc)(5) applies double first (leftmost), then inc.',
        'reduceRight threads the value right-to-left; reduce threads it left-to-right.',
        'Each function takes the previous result as its single argument.',
        'The result is one new function you can call with an initial value.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Function composition combines unary functions into a single function where each function\'s output is the next function\'s input. compose(f, g, h) yields x => f(g(h(x))) (right-to-left, mirroring mathematical composition), while pipe(h, g, f) yields the same evaluation order written left-to-right. Both are implemented as higher-order functions using Array.prototype.reduce / reduceRight to fold an initial value through the function list. Composition favors small pure unary functions; multi-argument stages are accommodated by currying or by passing a single object/tuple through the pipeline.',

  // 7. Internal Working
  internalWorking: [
    'compose/pipe are higher-order functions: they accept a list of functions (via rest params) and return a new function.',
    'The returned function takes an initial value and uses reduce (pipe, left-to-right) or reduceRight (compose, right-to-left) to thread it through each function.',
    'On each fold step, the accumulator (current value) is passed to the next function, and its return value becomes the new accumulator.',
    'Because each stage receives exactly one argument, stages must be unary; multi-arg logic is curried or packed into one object/tuple.',
    'The composed function is itself a closure over the fns array, so it can be reused with different inputs.',
    'Evaluation is eager and synchronous per call; for async stages you compose promise-returning functions and await/chain them instead.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  pipe(f, g, h)   (left → right)
   x ─► f ─► g ─► h ─► result
        │    │    │
     each output feeds the next input

  compose(f, g, h)   (right → left, = f(g(h(x))))
   x ─► h ─► g ─► f ─► result

  Conveyor belt: one small function per station.`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — composing two functions',
      lang: 'js',
      code: `const trim = (s) => s.trim()\nconst upper = (s) => s.toUpperCase()\nconst shout = (s) => upper(trim(s))   // manual composition\nshout('  hello ') // 'HELLO'`,
      explanation: [
        'shout feeds the output of trim directly into upper.',
        'This is composition by hand — nested calls, inner runs first.',
        'trim cleans the string, then upper transforms it.',
        'Each function does exactly one thing.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a reusable pipe utility',
      lang: 'js',
      code: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)\n\nconst trim = (s) => s.trim()\nconst upper = (s) => s.toUpperCase()\nconst exclaim = (s) => s + '!'\n\nconst announce = pipe(trim, upper, exclaim)\nannounce('  hello ') // 'HELLO!'`,
      explanation: [
        'pipe builds one function from many, applied left-to-right.',
        'announce reads as a clear pipeline: trim → upper → exclaim.',
        'reduce threads the string through each stage.',
        'Adding/removing a stage is a one-line change — easy to extend.',
      ],
    },
    advanced: {
      label: 'Advanced — composing with curried multi-arg stages',
      lang: 'js',
      code: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)\n\nconst map = (fn) => (arr) => arr.map(fn)\nconst filter = (pred) => (arr) => arr.filter(pred)\nconst take = (n) => (arr) => arr.slice(0, n)\n\nconst topThreeEvenSquares = pipe(\n  filter((n) => n % 2 === 0),\n  map((n) => n * n),\n  take(3)\n)\ntopThreeEvenSquares([1,2,3,4,5,6,7,8]) // [4, 16, 36]`,
      explanation: [
        'Multi-argument operations are curried so each stage becomes unary (takes the array).',
        'filter(pred), map(fn), and take(n) each return a function of the array.',
        'pipe threads the array through filter → map → take.',
        'This is the data-last, point-free style used by Ramda and lodash/fp.',
      ],
    },
    realProject: {
      label: 'Real project — request transform pipeline in Node middleware',
      lang: 'js',
      code: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)\n\nconst normalizeEmail = (u) => ({ ...u, email: u.email.toLowerCase().trim() })\nconst addTimestamp = (u) => ({ ...u, createdAt: Date.now() })\nconst stripSensitive = (u) => { const { password, ...safe } = u; return safe }\n\nconst prepareUser = pipe(normalizeEmail, addTimestamp, stripSensitive)\n// app.post('/users', (req,res) => save(prepareUser(req.body)))`,
      explanation: [
        'Each transform is a small pure function returning a new object (no mutation).',
        'pipe composes them into one prepareUser pipeline.',
        'The data flow is explicit and each stage is independently testable.',
        'This declarative shape is common in request/response transformation and ETL.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is function composition?',
      answer: 'Combining functions so the output of one becomes the input of the next, producing a single new function that applies them in sequence.',
      explanation: 'A strong answer mentions the output-to-input chaining and that the result is itself a function.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between compose and pipe?',
      answer: 'compose applies functions right-to-left (compose(f, g)(x) = f(g(x))), matching math notation; pipe applies them left-to-right (pipe(f, g)(x) = g(f(x))), reading like a sequence of steps.',
      explanation: 'Getting the direction right is the classic discriminator.',
    },
    {
      level: 'intermediate',
      question: 'How do you implement pipe and compose?',
      answer: 'pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x); compose is the same but uses reduceRight (or reverses the fns array).',
      explanation: 'Implementing them with reduce/reduceRight is the canonical exercise.',
    },
    {
      level: 'intermediate',
      question: 'Why should composed functions be unary?',
      answer: 'Because each stage receives exactly one value — the previous output — so multi-argument functions must be curried or take a single object/tuple to fit the pipeline.',
      explanation: 'Tests understanding of how data threads through the chain.',
    },
    {
      level: 'advanced',
      question: 'How would you compose asynchronous functions?',
      answer: 'Use an async pipe that awaits each stage: const pipeAsync = (...fns) => (x) => fns.reduce((p, fn) => p.then(fn), Promise.resolve(x)); each function may return a value or a promise and they run sequentially.',
      explanation: 'Shows you can extend composition to promise-returning stages.',
    },
    {
      level: 'senior',
      question: 'What are the trade-offs of point-free composition in production?',
      answer: 'It improves reuse and reads declaratively, but obscures stack traces, hides argument names, and can hurt debuggability and performance (extra allocations, multiple passes). Use it where it clarifies; keep critical hot paths and complex logic explicit.',
      explanation: 'Senior signal: balancing elegance against debuggability and performance.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do currying and composition complement each other (point-free style)?',
    'How would you make composition lazy/short-circuiting?',
    'What happens to error handling inside a composition chain?',
    'How is composition different from method chaining (e.g. array methods)?',
    'How do transducers fuse map/filter to avoid intermediate arrays?',
    'How would you type compose/pipe in TypeScript?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mixing up the direction of compose vs pipe.',
      why: 'compose is right-to-left, pipe is left-to-right; reversing them produces wrong results.',
      fix: 'Remember compose mirrors math f(g(x)) (right-to-left); pipe reads like steps (left-to-right).',
    },
    {
      mistake: 'Trying to compose multi-argument functions directly.',
      why: 'Each stage only receives the single previous output, so extra arguments are lost.',
      fix: 'Curry the functions or thread a single object/tuple through the pipeline.',
    },
    {
      mistake: 'Putting side-effecting/impure functions in the chain unexpectedly.',
      why: 'Hidden mutations or I/O make the pipeline non-deterministic and hard to test.',
      fix: 'Keep stages pure; perform effects outside the composition or in a dedicated tap stage.',
    },
    {
      mistake: 'Ignoring async — composing promise-returning functions with a sync pipe.',
      why: 'A sync pipe passes a Promise to the next function instead of the resolved value.',
      fix: 'Use an async pipe that awaits each stage (reduce over .then).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composing data transforms in computeds and building reusable formatter pipelines; composables can return composed helper functions.' },
    { area: 'React', detail: 'Redux uses compose to combine store enhancers/middleware; HOCs are composed to layer behavior onto components.' },
    { area: 'Node.js', detail: 'Request/response transformation pipelines, ETL stages, and stream processing; libraries like Ramda/lodash-fp provide compose/pipe.' },
    { area: 'Backend', detail: 'Validation and normalization pipelines over records; transducers fuse map/filter to process large datasets in a single pass.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Small composed pure functions are individually optimizable and reusable.',
      'A single pipe over a value avoids manual intermediate variables and is easy to reason about.',
    ],
    bad: [
      'Composing array operations naively creates an intermediate array per stage (multiple passes).',
      'Deep composition adds function-call overhead and extra closures, minor but real in hot loops.',
    ],
    optimizations: [
      'Use transducers to fuse map/filter stages into one pass over the data.',
      'Build the composed function once (at module load) and reuse it, not per call/render.',
      'For extreme hot paths, inline the stages into a single function or loop.',
      'Keep stages monomorphic (consistent input shapes) so the engine can optimize them.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['higher-order-functions', 'pure-functions', 'currying-partial-application', 'array-methods'],
    nextConcepts: ['memoization', 'generators', 'strategy-pattern'],
    dependencyNote:
      'Composition is a higher-order function over other functions, works best with pure unary functions, and pairs naturally with currying to make multi-argument stages unary. It is the backbone of point-free functional pipelines.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a conveyor belt with three boxes f, g, h and an arrow threading a value through.',
      'Write pipe(f, g, h)(x) and label the order left-to-right.',
      'Write compose(f, g, h)(x) = f(g(h(x))) and label right-to-left.',
      'Implement both in one line each with reduce / reduceRight.',
      'Say: "Composition feeds each output into the next input. pipe reads like steps; compose mirrors math. I implement both with reduce, and I curry multi-arg stages so each is unary."',
    ],
    diagram: `  pipe:    x ─► f ─► g ─► h ─► out   (reduce)
  compose: x ─► h ─► g ─► f ─► out   (reduceRight)
  pipe = (...fns)=>(x)=>fns.reduce((a,f)=>f(a),x)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Function composition chains functions so each output is the next input, producing one new function. pipe runs left-to-right; compose runs right-to-left (like f(g(x))). Both are implemented with reduce/reduceRight over a list of unary functions. It turns nested calls into readable pipelines and pairs with currying so multi-argument stages become unary. Watch for direction confusion, intermediate-array passes (use transducers), and async (use an awaiting pipe).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Function composition is the technique of combining functions so that the output of one becomes the input of the next, producing a single new function. There are two conventions. compose applies functions right-to-left, mirroring the mathematical f(g(x)), so compose(f, g)(x) is f(g(x)). pipe applies them left-to-right, which reads like a sequence of steps: pipe(f, g)(x) is g(f(x)). Both are higher-order functions, and I implement them with reduce: pipe is (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x), and compose is the same with reduceRight or a reversed list. The key constraint is that each stage receives exactly one value — the previous output — so the functions should be unary; for multi-argument logic I curry the functions or thread a single object through the pipeline, which is the data-last, point-free style that Ramda and lodash/fp use. The payoff is readability and reuse: instead of deeply nested calls or imperative steps, a pipeline reads top-to-bottom and each small pure function is independently testable. For asynchronous stages I use an async pipe that awaits each step by folding over promise chaining. The trade-offs are that point-free composition can obscure stack traces and argument names and, for array operations, naive composition creates an intermediate array per stage — which transducers solve by fusing map and filter into a single pass.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Point-free composition is elegant and reusable but harder to debug (anonymous stages, opaque stack traces).',
      'Composition vs method chaining: composition works on any function; chaining requires methods on the object but reads fluently.',
    ],
    edgeCases: [
      'Mismatched directions (compose vs pipe) silently produce wrong results.',
      'A stage returning undefined breaks downstream stages expecting a value.',
      'Async stages need an awaiting pipe; a sync pipe passes a Promise downstream.',
      'Errors thrown mid-pipeline skip remaining stages; there is no per-stage catch unless added.',
    ],
    runtimeBehavior: [
      'Each call folds through every stage synchronously; composed array ops allocate intermediates per stage.',
      'The composed function closes over the fns array and is reusable across inputs.',
      'Engine optimization depends on stage monomorphism; varied shapes deoptimize.',
    ],
    scalability: [
      'Transducers fuse transformations into one pass, crucial for large collections.',
      'Lazy/streaming composition (generators) processes huge or infinite sequences without materializing intermediates.',
    ],
    productionConcerns: [
      'Keep critical hot paths explicit; reserve heavy point-free style for clarity, not everywhere.',
      'Add observability (a tap stage) without breaking purity when debugging pipelines.',
      'Type compose/pipe carefully in TypeScript; overloads or variadic tuple types are needed for accurate inference.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Composition = output of one feeds input of the next.',
    'compose: right-to-left, = f(g(h(x))).',
    'pipe: left-to-right, reads like steps.',
    'pipe = (...fns)=>(x)=>fns.reduce((a,f)=>f(a),x).',
    'compose = same with reduceRight.',
    'Stages must be unary → curry multi-arg functions.',
    'Pairs with currying for point-free, data-last style.',
    'Async: fold over promise chaining (await each stage).',
    'Naive array composition = intermediate arrays; use transducers.',
    'Keep stages pure; do effects outside or in a tap.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Compose two functions manually: given double and negate, make a function that doubles then negates.',
      hint: 'Feed the output of double into negate.',
      solution: {
        lang: 'js',
        code: `const double = (n) => n * 2\nconst negate = (n) => -n\nconst doubleThenNegate = (n) => negate(double(n))\ndoubleThenNegate(5) // -10`,
        explanation: ['double runs first; its output flows into negate.', 'This is composition by hand without a helper.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement pipe(...fns) using reduce.',
      hint: 'Return a function that folds x through each fn left-to-right.',
      solution: {
        lang: 'js',
        code: `const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x)\nconst f = pipe((n) => n + 1, (n) => n * 2)\nf(3) // (3+1)*2 = 8`,
        explanation: ['reduce threads x through each function left-to-right.', 'The accumulator is the running value passed to the next stage.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement compose(...fns) and verify compose(f, g)(x) === f(g(x)).',
      hint: 'Use reduceRight so the rightmost function runs first.',
      solution: {
        lang: 'js',
        code: `const compose = (...fns) => (x) => fns.reduceRight((acc, fn) => fn(acc), x)\nconst inc = (n) => n + 1\nconst dbl = (n) => n * 2\ncompose(dbl, inc)(5) // dbl(inc(5)) = 12`,
        explanation: ['reduceRight applies functions from right to left.', 'compose(dbl, inc)(5) equals dbl(inc(5)), matching math notation.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement an async pipe that runs promise-returning stages sequentially, passing each resolved value to the next.',
      hint: 'Fold over .then starting from Promise.resolve(x).',
      solution: {
        lang: 'js',
        code: `const pipeAsync = (...fns) => (x) =>\n  fns.reduce((p, fn) => p.then(fn), Promise.resolve(x))\n\nconst getUser = (id) => Promise.resolve({ id, name: 'Ada' })\nconst getName = (u) => Promise.resolve(u.name)\nconst shout = (s) => s.toUpperCase()\n\n// await pipeAsync(getUser, getName, shout)(1) → 'ADA'`,
        explanation: [
          'We start the chain from a resolved promise of the initial value.',
          'Each stage is attached via .then, so async and sync stages both work.',
          'Stages run sequentially, each receiving the prior resolved value.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Composition is the capstone of functional JavaScript: once you can build pipe/compose and curry stages to be unary, you can express complex transformations as clean, testable pipelines. It demonstrates mastery of higher-order functions and pure-function design.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and compose-vs-pipe direction. Product companies (Zoho, Flipkart, Razorpay) ask you to implement pipe/compose with reduce and build a small pipeline. FAANG-level interviews probe async composition, transducers, error handling, and TypeScript typing of variadic compose.',
    whatInterviewersExpect:
      'They expect you to define composition, get the compose/pipe directions right, implement both with reduce/reduceRight, explain why stages are unary (and how currying helps), and discuss async and performance considerations.',
  },
}

export default functionComposition
