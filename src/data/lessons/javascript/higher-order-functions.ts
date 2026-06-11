import type { ConceptLesson } from '../../../types/lesson'

const higherOrderFunctions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'higher-order-functions',
  name: 'Higher-Order Functions',
  category: 'functions',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Higher-order functions (HOFs) are the backbone of functional JavaScript — map, filter, reduce, and every utility you compose are HOFs.',
    'They let you abstract behavior, not just data: pass logic around, build reusable pipelines, and avoid repetitive imperative loops.',
    'Without HOFs you cannot have callbacks, currying, composition, decorators, or middleware — the whole functional toolkit collapses.',
    'Interviewers use them to test whether you treat functions as first-class values and can write code that takes or returns functions.',
    'Used well, they shrink boilerplate; used carelessly (a new closure per render/item) they create GC pressure and subtle bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A higher-order function is a kitchen machine that lets you snap in different blades — chop, slice, or grate.',
    story: [
      'Imagine a single kitchen machine. By itself it just spins, but it has a slot where you snap in a tool.',
      'Snap in the chopping blade and it chops; snap in the grating blade and it grates; snap in the slicing blade and it slices.',
      'The machine stays the same — what changes is the little tool you give it, and that tool decides what the machine actually does.',
      'A higher-order function is that machine: it takes a small function (the blade) as input, and the function you give it decides the real work. Sometimes the machine even hands you back a brand-new custom tool to use later.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript, functions are values: you can store them in variables and pass them as arguments, just like numbers.',
    'A higher-order function is a function that either takes one or more functions as arguments, or returns a function as its result — or both.',
    'You already use them: array methods like map and filter take a small function and apply it to each item.',
    'The benefit is that one general function (like map) can do many different things depending on the small function you plug in.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A higher-order function is a function that operates on other functions — by taking them as arguments and/or returning a function.',
    how: 'Because functions are first-class values, a parameter can hold a function and you can call it inside; or you can return a fresh function (often a closure) that the caller uses later. The classic examples are array iteration methods and function factories.',
    why: 'It lets you separate the generic mechanism (iterate, retry, time, memoize) from the specific behavior, so you write less repetitive code and compose small functions into bigger ones.',
    code: {
      label: 'A HOF that takes a function and one that returns a function',
      lang: 'js',
      code: `// Takes a function:\nconst nums = [1, 2, 3]\nconst doubled = nums.map((n) => n * 2)   // map is a HOF\n\n// Returns a function:\nfunction multiplier(factor) {\n  return (n) => n * factor               // returns a new function\n}\nconst triple = multiplier(3)\ntriple(5) // 15`,
      explanation: [
        'map is a HOF: it accepts the (n) => n * 2 function and applies it to each element.',
        'multiplier is a HOF: it RETURNS a function that remembers factor (a closure).',
        'triple is the returned function, pre-configured with factor = 3.',
        'Calling triple(5) computes 5 * 3 using the remembered factor.',
        'Both directions — taking and returning functions — qualify as higher-order.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A higher-order function is a function that accepts one or more functions as arguments and/or returns a function as its result, made possible by functions being first-class objects in JavaScript. HOFs enable abstraction over behavior: array combinators (map/filter/reduce) abstract iteration, function factories return specialized closures, and decorators wrap functions to add cross-cutting behavior (timing, memoization, retries) without modifying the original.',

  // 7. Internal Working
  internalWorking: [
    'Functions are first-class objects: a function reference can be stored, passed, and returned exactly like any other value.',
    'When a HOF receives a function argument, it binds that reference to a parameter and may invoke it any number of times with arguments it chooses.',
    'When a HOF returns a function, it usually returns a closure that captures variables from the HOF call (e.g. the factor), which the engine keeps alive on the heap as long as the returned function is reachable.',
    'Array combinators iterate internally and invoke the supplied callback per element, collecting results (map), filtering (filter), or folding into an accumulator (reduce).',
    'Decorator-style HOFs return a wrapper function that calls the original via fn.apply(this, args), often adding logic before/after, while preserving this and arguments.',
    'Because each returned function can capture different state, calling the factory multiple times yields independent specialized functions.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  TAKES a function                RETURNS a function
  ────────────────                ──────────────────
  data ─► [ map(fn) ] ─► result   factor ─► [ multiplier ]
              ▲                                  │
              │ calls fn per item                │ returns
            (your fn)                            ▼
                                        ( n => n * factor )  ← closure
                                                 │
                                        triple(5) ─► 15

  Either (or both) makes it HIGHER-ORDER.`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — map / filter / reduce',
      lang: 'js',
      code: `const nums = [1, 2, 3, 4, 5]\nconst evens = nums.filter((n) => n % 2 === 0)   // [2, 4]\nconst squares = nums.map((n) => n * n)           // [1, 4, 9, 16, 25]\nconst sum = nums.reduce((acc, n) => acc + n, 0)  // 15`,
      explanation: [
        'filter keeps elements where the callback returns truthy.',
        'map transforms each element via the callback and returns a new array.',
        'reduce folds the array into a single value using an accumulator.',
        'All three are HOFs because each takes a function as input.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a function factory',
      lang: 'js',
      code: `function withPrefix(prefix) {\n  return (message) => \`[\${prefix}] \${message}\`\n}\nconst info = withPrefix('INFO')\nconst error = withPrefix('ERROR')\ninfo('server started')   // '[INFO] server started'\nerror('disk full')       // '[ERROR] disk full'`,
      explanation: [
        'withPrefix returns a new function each time, capturing its own prefix.',
        'info and error are independent specialized loggers.',
        'This is the "returns a function" form of a HOF, powered by closures.',
        'Factories let you stamp out pre-configured functions without repeating logic.',
      ],
    },
    advanced: {
      label: 'Advanced — a decorator that wraps a function',
      lang: 'js',
      code: `function withTiming(fn) {\n  return function (...args) {\n    const start = performance.now()\n    const result = fn.apply(this, args)\n    console.log(\`\${fn.name} took \${(performance.now() - start).toFixed(2)}ms\`)\n    return result\n  }\n}\n\nfunction heavy(n) { let s = 0; for (let i = 0; i < n; i++) s += i; return s }\nconst timedHeavy = withTiming(heavy)\ntimedHeavy(1e6)`,
      explanation: [
        'withTiming both takes a function and returns a function — doubly higher-order.',
        'The wrapper calls the original via fn.apply(this, args), preserving this and arguments.',
        'It adds cross-cutting timing behavior without modifying heavy itself.',
        'This decorator pattern underlies memoize, retry, throttle, and logging wrappers.',
      ],
    },
    realProject: {
      label: 'Real project — composing data transforms in a Vue computed',
      lang: 'js',
      code: `import { computed } from 'vue'\n\n// products is a ref<Product[]>\nconst visible = computed(() =>\n  products.value\n    .filter((p) => p.inStock)\n    .map((p) => ({ ...p, price: p.price * 1.1 }))   // add tax\n    .sort((a, b) => a.price - b.price)\n)`,
      explanation: [
        'filter, map, and sort are all HOFs chained into a declarative pipeline.',
        'Each step takes a small function describing one transformation.',
        'The computed re-runs only when products changes, recomputing the derived list.',
        'This reads top-to-bottom as a sequence of intentions, far clearer than nested loops.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a higher-order function?',
      answer: 'A function that takes one or more functions as arguments and/or returns a function as its result.',
      explanation: 'A good answer mentions both directions and gives examples like map (takes a function) and a factory (returns one).',
    },
    {
      level: 'beginner',
      question: 'Name some built-in higher-order functions.',
      answer: 'Array methods like map, filter, reduce, forEach, sort, some, every, and find; also setTimeout and addEventListener take function arguments.',
      explanation: 'Listing everyday examples shows you recognize HOFs in code you already write.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between map and forEach?',
      answer: 'map returns a new array of transformed values and does not mutate the original; forEach returns undefined and is used for side effects, not building a result.',
      explanation: 'A frequent follow-up that checks whether you use the right combinator for the job.',
    },
    {
      level: 'intermediate',
      question: 'How do higher-order functions relate to closures?',
      answer: 'HOFs that return functions almost always return closures — the returned function captures variables from the HOF call (like a factor or prefix) and keeps them alive for later use.',
      explanation: 'Connecting HOFs to closures demonstrates you understand WHY returned functions remember state.',
    },
    {
      level: 'advanced',
      question: 'How would you implement a decorator that adds caching to any function?',
      answer: 'Write a HOF memoize(fn) that returns a wrapper closing over a cache (Map); on each call it builds a key from the arguments, returns the cached value if present, otherwise calls fn, stores, and returns the result.',
      explanation: 'Shows mastery of HOFs as decorators and the take-and-return pattern.',
    },
    {
      level: 'senior',
      question: 'What are the performance and correctness pitfalls of HOFs at scale?',
      answer: 'Chained array HOFs allocate an intermediate array per step (multiple passes), and creating callbacks per item/render adds GC churn. For very hot paths, fuse into a single reduce or for-loop, hoist stable callbacks, and beware mutating shared state inside a supposedly pure callback.',
      explanation: 'Senior signal: balancing readability against allocation, passes, and purity.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Implement your own map/filter/reduce from scratch.',
    'How would you chain HOFs vs fuse them into one reduce, and when does it matter?',
    'What is the difference between a higher-order function and a callback?',
    'How do currying and composition build on higher-order functions?',
    'Why does reduce need an initial accumulator, and what happens without one?',
    'How do you preserve this when a HOF wraps a method?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using map when you mean forEach (or vice versa).',
      why: 'map builds a new array you then throw away (wasteful), or forEach returns undefined when you needed the transformed array.',
      fix: 'Use map to transform into a new array; use forEach only for side effects.',
    },
    {
      mistake: 'Mutating the source array or external state inside a map/filter callback.',
      why: 'Breaks the expectation that these combinators are pure and produce predictable, reusable results.',
      fix: 'Return new values; keep callbacks pure. Use a separate explicit loop if you truly need mutation.',
    },
    {
      mistake: 'Forgetting reduce needs an initial value for an empty or single-element-safe fold.',
      why: 'reduce without an initial value throws on an empty array and uses the first element as the seed otherwise.',
      fix: 'Pass an explicit initial accumulator that matches your result type (0, [], {}).',
    },
    {
      mistake: 'Creating a new callback function on every render/iteration in hot paths.',
      why: 'Each call allocates a fresh closure, adding GC pressure and breaking referential equality (e.g. React memoization).',
      fix: 'Hoist stable callbacks or memoize them (useCallback) so the reference is reused.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'computed properties chain map/filter/sort to derive view data; composables return functions; directives and plugins use factory HOFs.' },
    { area: 'React', detail: 'Rendering lists with map, deriving state with reduce, and HOCs (higher-order components) which are literally HOFs over components; useCallback memoizes callbacks.' },
    { area: 'Node.js', detail: 'Express middleware factories return (req, res, next) handlers; libraries like lodash/ramda are collections of HOFs; stream transforms take mapping functions.' },
    { area: 'Backend', detail: 'Retry/circuit-breaker/rate-limit wrappers are decorator HOFs around handlers; pipelines transform records with composed map/filter stages.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'HOFs make intent declarative and code reusable, reducing bugs from hand-rolled loops.',
      'Engines optimize built-in array combinators well; for typical data sizes they are plenty fast.',
    ],
    bad: [
      'Chaining .filter().map().sort() allocates a new array per step and iterates multiple times.',
      'Allocating a fresh callback per item/render creates GC churn and can defeat memoization.',
    ],
    optimizations: [
      'Fuse multiple passes into a single reduce or for-loop when the array is large and the path is hot.',
      'Hoist or memoize callbacks so you reuse one function reference.',
      'Prefer find/some/every (short-circuiting) over filter when you only need one match or a boolean.',
      'Avoid building intermediate arrays you immediately discard; transform once.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['function-declaration-vs-expression', 'callbacks', 'closure'],
    nextConcepts: ['pure-functions', 'currying-partial-application', 'function-composition', 'array-methods', 'memoization'],
    dependencyNote:
      'HOFs rest on functions being first-class values and on closures (for the return-a-function form). They are the gateway to pure functions, currying, composition, and the array combinator toolkit.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the definition: "takes a function and/or returns a function".',
      'On the left draw map(fn) with arrows showing fn applied to each element.',
      'On the right draw a factory box that returns a small function.',
      'Show a closure bubble around the returned function capturing a variable (factor).',
      'Say: "Because functions are first-class values, I can pass behavior in or hand a pre-configured function back — that is what makes map, decorators, and factories possible."',
    ],
    diagram: `  takes fn:  [a,b,c] ─► map(fn) ─► [fn(a),fn(b),fn(c)]
  returns fn: multiplier(3) ─► ( n => n*3 )  ◄ closure over 3
  HOF = at least one of the two arrows is a FUNCTION.`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A higher-order function takes a function as an argument and/or returns a function, which is possible because functions are first-class values. map/filter/reduce take functions; factories and decorators return them (usually closures). HOFs let you abstract behavior, build pipelines, and add cross-cutting concerns like timing or caching. Watch for multiple-pass allocations when chaining and for creating fresh callbacks in hot paths.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A higher-order function is one that operates on other functions, either by taking them as arguments or by returning a function — or both. This is possible because functions in JavaScript are first-class values: they can be stored in variables, passed around, and returned. The most familiar HOFs are the array combinators. map takes a function and returns a new array of transformed values; filter keeps elements where the callback is truthy; reduce folds an array into a single value with an accumulator. The second form is functions that return functions: a factory like multiplier(factor) returns a closure that remembers the factor, and decorators like memoize(fn) or withTiming(fn) both take a function and return a wrapped version that adds behavior — caching, timing, retries — by calling the original through fn.apply(this, args). HOFs are powerful because they let you separate the generic mechanism from the specific behavior, which makes code reusable and declarative. The trade-offs are real at scale: chaining combinators allocates an intermediate array per step and iterates multiple times, and creating a fresh callback per item or per render adds GC pressure and can break referential-equality memoization. So for hot paths I fuse passes into a single reduce or loop and hoist stable callbacks.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarative chains are readable but allocate intermediate arrays and multiple passes; a single reduce is faster but less obvious.',
      'Decorator HOFs add behavior cleanly but obscure stack traces and can break function.name/arity unless you preserve them.',
    ],
    edgeCases: [
      'reduce on an empty array without an initial value throws TypeError.',
      'Wrapping a method loses this unless the wrapper uses fn.apply(this, args).',
      'Callbacks that close over loop variables can capture the wrong value (var vs let).',
      'sort mutates the array in place and its comparator must return a number, not a boolean.',
    ],
    runtimeBehavior: [
      'Each chained combinator creates a new array; memory peaks at the sum of intermediates for large inputs.',
      'Returned closures keep their captured variables alive on the heap until the function is unreachable.',
      'Engines may inline simple monomorphic callbacks but deoptimize when the callback shape varies (polymorphism).',
    ],
    scalability: [
      'For large datasets prefer streaming/generators or a single fused pass to avoid materializing intermediates.',
      'In UI frameworks, unstable callback identities cause unnecessary re-renders; memoize at boundaries.',
    ],
    productionConcerns: [
      'Decorator HOFs should preserve name, length, and this, and rethrow/await correctly for async functions.',
      'Overusing clever point-free HOF chains hurts debuggability; keep stack traces meaningful.',
      'Audit hot render paths for per-item closure allocation that defeats memoization.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'HOF = takes a function and/or returns a function.',
    'Possible because functions are first-class values.',
    'Take-a-function: map, filter, reduce, forEach, sort, some, every, find.',
    'Return-a-function: factories and decorators (usually closures).',
    'map → new array; forEach → undefined (side effects only).',
    'reduce needs an initial accumulator; folds to one value.',
    'Decorators wrap via fn.apply(this, args) to add timing/caching/retry.',
    'Chaining allocates intermediate arrays + multiple passes.',
    'Hoist/memoize callbacks in hot paths to avoid GC churn.',
    'HOFs underpin currying, composition, and middleware.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a HOF applyTwice(fn, x) that returns fn(fn(x)).',
      hint: 'Just call fn on x, then call fn on that result.',
      solution: {
        lang: 'js',
        code: `function applyTwice(fn, x) {\n  return fn(fn(x))\n}\napplyTwice((n) => n + 3, 1) // 7`,
        explanation: ['applyTwice takes a function as an argument — that makes it higher-order.', 'It applies fn to x, then to the result.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement your own map(arr, fn) without using Array.prototype.map.',
      hint: 'Build a new array and push fn(element, index) for each item.',
      solution: {
        lang: 'js',
        code: `function map(arr, fn) {\n  const out = []\n  for (let i = 0; i < arr.length; i++) {\n    out.push(fn(arr[i], i, arr))\n  }\n  return out\n}\nmap([1, 2, 3], (n) => n * 10) // [10, 20, 30]`,
        explanation: ['We invoke the callback per element, passing value, index, and array.', 'We collect the transformed values into a new array, never mutating the input.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a decorator memoize(fn) that caches results by argument list.',
      hint: 'Return a wrapper closing over a Map keyed by a stringified args.',
      solution: {
        lang: 'js',
        code: `function memoize(fn) {\n  const cache = new Map()\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}`,
        explanation: ['memoize takes a function and returns a wrapped one — a decorator HOF.', 'The cache lives in the closure and persists across calls.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement reduce(arr, fn, initial) yourself, handling the no-initial-value case like the built-in.',
      hint: 'If no initial value is given, seed with the first element and start iteration at index 1.',
      solution: {
        lang: 'js',
        code: `function reduce(arr, fn, initial) {\n  let acc\n  let start = 0\n  if (arguments.length >= 3) {\n    acc = initial\n  } else {\n    if (arr.length === 0) throw new TypeError('Reduce of empty array with no initial value')\n    acc = arr[0]\n    start = 1\n  }\n  for (let i = start; i < arr.length; i++) {\n    acc = fn(acc, arr[i], i, arr)\n  }\n  return acc\n}`,
        explanation: [
          'We detect whether an initial value was passed using arguments.length.',
          'Without one we seed from the first element and start at index 1, matching the spec.',
          'An empty array with no initial value throws, exactly like Array.prototype.reduce.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Higher-order functions are the dividing line between writing imperative loops and writing composable, functional JavaScript. Mastering them unlocks the array toolkit, decorators, currying, composition, middleware, and framework patterns like HOCs and composables.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and examples of built-in HOFs. Product companies (Zoho, Flipkart, Razorpay) ask you to reimplement map/filter/reduce or write a memoize/decorator. FAANG-level interviews probe performance of chains, purity, and how HOFs compose into currying and pipelines.',
    whatInterviewersExpect:
      'They expect you to define HOFs in both directions, recognize built-ins, reimplement combinators, explain the closure link for returned functions, and discuss the allocation/pass trade-offs at scale.',
  },
}

export default higherOrderFunctions
