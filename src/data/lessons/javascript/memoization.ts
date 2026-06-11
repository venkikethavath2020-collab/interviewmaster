import type { ConceptLesson } from '../../../types/lesson'

const memoization: ConceptLesson = {
  // 1. Concept Summary
  slug: 'memoization',
  name: 'Memoization',
  category: 'functions',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Memoization caches a function\'s results so repeated calls with the same input are instant — a classic time-for-memory trade.',
    'It is the practical fix for expensive pure computations: recursion with overlapping subproblems, derived data, and repeated API shaping.',
    'Frameworks rely on it: React useMemo/useCallback/memo, Vue computed caching, and Reselect selectors are all memoization.',
    'Interviewers ask you to implement memoize from scratch because it ties together closures, the Map/cache, argument keys, and purity.',
    'Done wrong it leaks memory (unbounded cache) or returns stale/incorrect results (impure functions, bad keys) — both real production bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Memoization is writing the answer to a hard math problem on a sticky note so next time you just read it instead of solving it again.',
    story: [
      'Imagine your teacher asks "what is 17 times 24?" It takes you a while to work it out.',
      'You solve it once, get 408, and stick a little note on your desk: "17 x 24 = 408".',
      'Next time anyone asks the same question, you do not work it out again — you just glance at your note and say 408 instantly.',
      'Memoization is a function keeping a notebook of answers it has already figured out. When it sees the same question (the same input) again, it skips the hard work and reads the saved answer.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some functions do a lot of work to compute their answer. If you call them again with the same input, they redo all that work for nothing.',
    'Memoization stores each answer the first time you compute it, using the input as a lookup key.',
    'Next time the same input comes in, the function returns the stored answer immediately instead of recomputing.',
    'It only works correctly for "pure" functions — ones that always give the same answer for the same input and do not change anything outside.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Memoization is an optimization that caches the results of a function keyed by its arguments, so subsequent calls with the same arguments return the cached result instead of recomputing.',
    how: 'You wrap the function in a higher-order function that holds a cache (usually a Map) in a closure. On each call you build a key from the arguments; if the key is in the cache you return the stored value, otherwise you compute, store, and return it.',
    why: 'It trades memory for speed: expensive pure computations (heavy math, recursive subproblems, derived data) run once per distinct input and are then served instantly.',
    code: {
      label: 'A simple memoize wrapper',
      lang: 'js',
      code: `function memoize(fn) {\n  const cache = new Map()              // private cache (closure)\n  return function (...args) {\n    const key = JSON.stringify(args)   // build a key from arguments\n    if (cache.has(key)) return cache.get(key)\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}\n\nconst slowSquare = (n) => { /* pretend expensive */ return n * n }\nconst fastSquare = memoize(slowSquare)\nfastSquare(4) // computes 16\nfastSquare(4) // returns cached 16`,
      explanation: [
        'cache lives in the closure and persists across calls.',
        'We derive a key from the arguments (here via JSON.stringify).',
        'If the key exists, we return the cached value — no recomputation.',
        'Otherwise we compute, store, and return the result.',
        'Only valid for pure fn; otherwise the cache would return wrong answers.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Memoization is a caching technique that stores the outputs of a (referentially transparent) function indexed by a key derived from its inputs, returning the cached value on subsequent calls with equivalent inputs to avoid recomputation. It is implemented as a higher-order function wrapping the target, with a cache (Map/object/WeakMap) retained in a closure. Correctness depends on function purity and a key function that captures argument equality; effectiveness depends on a hit rate that justifies the memory cost, and production use requires bounding the cache (size/TTL/LRU) to prevent unbounded growth.',

  // 7. Internal Working
  internalWorking: [
    'A higher-order memoize function creates a cache object (Map by default) captured in a closure and returns a wrapper function.',
    'On invocation, the wrapper computes a cache key from the arguments — a string for primitives, or a reference for single-object keys via WeakMap.',
    'It looks up the key: on a hit, it returns the stored value without calling the original (the time saving).',
    'On a miss, it calls the original via fn.apply(this, args), stores the result under the key, and returns it.',
    'For recursive memoization, the recursive function must call the memoized version so internal subcalls also hit the cache (top-down dynamic programming).',
    'Production-grade caches add eviction (LRU/size limit) or expiry (TTL), and may use WeakMap so object keys can be garbage collected when no longer referenced.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  call fastSquare(4)
        │
        ▼
   build key "[4]" ──► cache has it?
        │                 │
        │ NO              │ YES
        ▼                 ▼
   run fn(4)=16      return cached 16  (skip work)
        │
   store cache["[4]"] = 16
        │
   return 16

  cache lives in a CLOSURE, persists across calls.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the cache (Map) and all stored results live on the heap, referenced by the memoized function\'s closure.',
    'REFERENCE CHAIN: memoizedFn → closure → cache → stored values; as long as memoizedFn is reachable, the whole cache is kept alive.',
    'GROWTH: every distinct input adds an entry; without eviction the cache grows unbounded — a common leak.',
    'WEAKMAP: keying by object with a WeakMap lets entries be collected when the key object is no longer referenced elsewhere, avoiding leaks.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — memoizing a pure unary function',
      lang: 'js',
      code: `function memoizeOne(fn) {\n  const cache = new Map()\n  return (n) => {\n    if (cache.has(n)) return cache.get(n)\n    const r = fn(n)\n    cache.set(n, r)\n    return r\n  }\n}\nconst factorial = memoizeOne((n) => (n <= 1 ? 1 : n * factorial(n - 1)))\nfactorial(5) // 120 (and subresults cached)`,
      explanation: [
        'For a single primitive argument we can use it directly as the Map key.',
        'cache.has(n) checks for a prior result before computing.',
        'Because factorial calls the memoized version, subresults are cached too.',
        'Repeat calls are instant lookups.',
      ],
    },
    intermediate: {
      label: 'Intermediate — memoized Fibonacci (overlapping subproblems)',
      lang: 'js',
      code: `function memoize(fn) {\n  const cache = new Map()\n  return function (n) {\n    if (cache.has(n)) return cache.get(n)\n    const r = fn.call(this, n)\n    cache.set(n, r)\n    return r\n  }\n}\nconst fib = memoize((n) => (n < 2 ? n : fib(n - 1) + fib(n - 2)))\nfib(40) // fast: O(n) instead of O(2^n)`,
      explanation: [
        'Naive fib is exponential because it recomputes the same values.',
        'Memoization caches each n once, turning it into linear time (top-down DP).',
        'The recursive calls go through fib (the memoized wrapper), so they hit the cache.',
        'This is the canonical interview demonstration of memoization\'s power.',
      ],
    },
    advanced: {
      label: 'Advanced — bounded LRU-style cache and object keys',
      lang: 'js',
      code: `function memoize(fn, { max = 100 } = {}) {\n  const cache = new Map()             // Map preserves insertion order\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) {\n      const v = cache.get(key)\n      cache.delete(key); cache.set(key, v)  // mark as recently used\n      return v\n    }\n    const r = fn.apply(this, args)\n    cache.set(key, r)\n    if (cache.size > max) cache.delete(cache.keys().next().value) // evict oldest\n    return r\n  }\n}`,
      explanation: [
        'An unbounded cache leaks; we cap it with a max size.',
        'Re-inserting on hit moves the entry to the end (most-recently-used).',
        'When over capacity, we evict the least-recently-used (the first key).',
        'This is a minimal LRU — production code would use a dedicated LRU library.',
      ],
    },
    realProject: {
      label: 'Real project — memoized selector / Vue computed equivalent',
      lang: 'js',
      code: `// Reselect-style memoized selector (React/Redux)\nfunction createSelector(inputFn, resultFn) {\n  let lastArg\n  let lastResult\n  return (state) => {\n    const arg = inputFn(state)\n    if (arg === lastArg) return lastResult   // reference equality\n    lastArg = arg\n    lastResult = resultFn(arg)\n    return lastResult\n  }\n}\nconst selectVisible = createSelector(\n  (s) => s.todos,\n  (todos) => todos.filter((t) => !t.done)\n)`,
      explanation: [
        'Selectors memoize on the last input by reference (===) — a 1-entry cache.',
        'If state.todos is unchanged, the filtered result is reused without recomputing.',
        'This is exactly how Reselect and Vue computed avoid redundant derivation.',
        'Reference-equality memoization is cheap and pairs with immutable state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is memoization?',
      answer: 'An optimization that caches a function\'s results by its arguments so repeated calls with the same arguments return the cached value instead of recomputing.',
      explanation: 'A good answer names the time-for-memory trade and the argument-keyed cache.',
    },
    {
      level: 'beginner',
      question: 'When is memoization appropriate?',
      answer: 'When the function is pure (deterministic, no side effects), expensive to compute, and called repeatedly with the same inputs so the cache hit rate justifies the memory cost.',
      explanation: 'Stresses purity and a worthwhile hit rate — both required for it to help.',
    },
    {
      level: 'intermediate',
      question: 'How would you implement a generic memoize?',
      answer: 'A higher-order function holding a Map cache in a closure; build a key from arguments (JSON.stringify for simple cases), return the cached value on a hit, otherwise compute via fn.apply(this, args), store, and return.',
      explanation: 'The canonical implementation question — closures + Map + key derivation.',
    },
    {
      level: 'intermediate',
      question: 'What are the dangers of using JSON.stringify for cache keys?',
      answer: 'It fails for functions, undefined, and circular structures; key order matters for objects; and it is slow for large arguments. It also cannot distinguish references. For object keys prefer WeakMap; for multiple args consider a nested cache.',
      explanation: 'Shows awareness of key-equality subtleties beyond the naive approach.',
    },
    {
      level: 'advanced',
      question: 'How do you prevent a memoization cache from leaking memory?',
      answer: 'Bound it with an LRU/size limit or TTL, or use a WeakMap keyed by objects so entries are collected when the key is unreferenced. Avoid unbounded Maps on long-lived functions.',
      explanation: 'Senior-leaning: cache eviction and WeakMap to avoid the classic leak.',
    },
    {
      level: 'senior',
      question: 'How does memoization differ from caching, and what invalidation concerns arise?',
      answer: 'Memoization is in-process caching of pure function outputs keyed by arguments; general caching may be distributed and store I/O results that go stale. Memoization assumes purity so invalidation is rarely needed, but if the underlying data can change you need TTL/versioned keys or to clear the cache; reference-equality memoization invalidates automatically when inputs change identity.',
      explanation: 'Senior signal: invalidation strategy, purity assumption, and the distributed-cache distinction.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does React useMemo/useCallback relate to memoization, and what are the dependency-array pitfalls?',
    'How would you memoize a function with multiple arguments correctly?',
    'When would you use a WeakMap as the cache?',
    'What is the difference between memoization and dynamic programming?',
    'How do you bound and evict a cache (LRU/TTL)?',
    'Why does a Vue computed not recompute when its dependencies are unchanged?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Memoizing an impure function.',
      why: 'If the function reads time/random/globals or has side effects, the cache returns stale results and skips the effects.',
      fix: 'Only memoize pure functions; pass varying inputs (time, etc.) as arguments so they become part of the key.',
    },
    {
      mistake: 'Using an unbounded cache on a long-lived function.',
      why: 'Every distinct input adds an entry forever, leaking memory.',
      fix: 'Use an LRU/size cap or TTL, or a WeakMap for object keys so entries can be collected.',
    },
    {
      mistake: 'Naive JSON.stringify keys for objects/functions/circular data.',
      why: 'It throws on circular refs, drops functions/undefined, and is order-sensitive, producing wrong keys.',
      fix: 'Use stable serialization, structured keys, nested caches, or WeakMap for single-object keys.',
    },
    {
      mistake: 'Memoizing cheap functions or low-hit-rate functions.',
      why: 'The cache overhead and memory outweigh the negligible compute saved.',
      fix: 'Profile first; memoize only expensive functions with high repeat-input rates.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'computed properties cache their result and only recompute when reactive dependencies change — built-in memoization of derivations.' },
    { area: 'React', detail: 'useMemo caches expensive values, useCallback caches function identities, and React.memo skips re-renders on equal props; Reselect memoizes derived state.' },
    { area: 'Node.js', detail: 'Caching results of expensive pure transforms, parsed configs, compiled regexes/templates, and per-request derived data (with bounded caches).' },
    { area: 'Backend', detail: 'Memoizing pure pricing/validation computations within a request; lazy singletons memoize an initialized resource on first use.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Turns repeated expensive pure computations into O(1) lookups after the first call.',
      'Collapses exponential recursion (overlapping subproblems) to linear time.',
    ],
    bad: [
      'Unbounded caches grow with distinct inputs, increasing memory and GC pressure.',
      'Key construction (JSON.stringify) can itself be costly and offset the savings for cheap functions.',
    ],
    optimizations: [
      'Bound the cache with LRU/size limits or TTL; use WeakMap for object-keyed entries.',
      'Choose a cheap, correct key function; reference-equality (===) for immutable inputs is fastest.',
      'Only memoize functions that are expensive AND have a high repeat-input hit rate.',
      'For recursion, ensure recursive calls go through the memoized wrapper.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Caching by user-controlled keys can be abused to exhaust memory (cache-flooding DoS) if unbounded.',
      'Memoizing functions over sensitive data keeps that data resident in memory longer than necessary.',
    ],
    bestPractices: [
      'Always bound caches (size/TTL/LRU) when keys can be influenced by external input.',
      'Avoid caching sensitive values; if unavoidable, use WeakMap or clear caches on logout/teardown.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'pure-functions', 'higher-order-functions', 'map-vs-object'],
    nextConcepts: ['weakmap-weakset', 'recursion', 'function-composition'],
    dependencyNote:
      'Memoization is a closure holding a cache (built as a higher-order function) and requires purity for correctness. It pairs with recursion (to tame overlapping subproblems) and with WeakMap/Map for the cache store.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the memoize wrapper with a cache (Map) inside a closure box.',
      'Show a call: build key from args, check cache.',
      'Branch: hit → return cached; miss → compute, store, return.',
      'Add a note: "only for pure functions; bound the cache to avoid leaks".',
      'Say: "Memoization caches results by argument key so repeated pure calls are instant — the cache lives in a closure, and I cap it with LRU/TTL or use WeakMap to avoid leaks."',
    ],
    diagram: `  args ─► key ─► [cache]?
                   hit ─► return cached
                   miss ─► fn(args) ─► store ─► return
  cache in CLOSURE; bound it (LRU/TTL) to avoid leaks`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Memoization caches a pure function\'s results keyed by its arguments so repeat calls return instantly instead of recomputing — trading memory for speed. You implement it as a higher-order function with a Map cache in a closure: build a key, return on hit, compute-store-return on miss. It collapses exponential recursion (Fibonacci) to linear and powers useMemo, Vue computeds, and Reselect. Watch for impure functions (stale results), bad keys (JSON.stringify pitfalls), and unbounded caches (leaks) — bound with LRU/TTL or WeakMap.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Memoization is an optimization that caches a function\'s results keyed by its arguments, so a repeat call with the same arguments returns the stored result instead of recomputing — it trades memory for speed. I implement it as a higher-order function: I wrap the target function and keep a cache, usually a Map, in a closure. On each call I build a key from the arguments; if the cache has that key I return the stored value, otherwise I compute via fn.apply(this, args), store the result, and return it. The classic demonstration is Fibonacci: naive recursion is exponential because it recomputes the same subproblems, but memoizing each n makes it linear — that is top-down dynamic programming. Correctness has one hard requirement: the function must be pure. If it reads the clock, random numbers, or mutable globals, the cache will hand back stale answers and skip side effects, so anything that varies must be part of the arguments and therefore the key. The other big concern is memory: an unbounded cache on a long-lived function grows with every distinct input, which is a leak, so in production I bound it with an LRU or size limit or a TTL, or I key by object with a WeakMap so entries are collected when the key is no longer referenced. I also pick the key function carefully — JSON.stringify breaks on circular data and functions and is order-sensitive — and I only memoize functions that are genuinely expensive with a high repeat-input hit rate. This is exactly what React useMemo, Vue computeds, and Reselect selectors do.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Speed vs memory: caching saves compute but consumes heap; only worthwhile above a hit-rate/cost threshold.',
      'Key precision vs cost: precise keys (full serialization) are correct but slow; reference-equality keys are fast but require immutable inputs.',
    ],
    edgeCases: [
      'Impure functions produce stale cache hits and skipped effects.',
      'JSON.stringify keys fail on circular refs, functions, undefined, and are order-sensitive.',
      'this-dependent methods need the wrapper to forward this (fn.apply(this, args)).',
      'Recursive memoization only works if recursion goes through the memoized wrapper.',
    ],
    runtimeBehavior: [
      'The cache and results live on the heap, kept alive by the memoized function\'s closure.',
      'Unbounded caches grow indefinitely; eviction (LRU/TTL) controls the working set.',
      'WeakMap entries are collectable when their object keys are unreferenced, but WeakMap cannot key by primitives.',
    ],
    scalability: [
      'For multi-argument functions, nested caches or composite keys scale better than one giant stringified key.',
      'In distributed systems, in-process memoization does not share across instances; use a shared cache (Redis) for that, with explicit invalidation.',
    ],
    productionConcerns: [
      'Cache invalidation when underlying data changes (TTL/versioned keys) is the hard part — pure memoization sidesteps it but I/O caching does not.',
      'Guard against cache-flooding DoS with bounded caches when keys are user-controlled.',
      'Monitor cache size and hit rate; a low hit rate means the memoization is pure overhead.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Memoization = cache results by argument key; trade memory for speed.',
    'Implement: HOF + Map cache in a closure.',
    'On call: build key → hit returns cached → miss computes/stores.',
    'Requires a PURE function for correctness.',
    'Collapses exponential recursion (Fibonacci) to linear.',
    'JSON.stringify keys break on circular/functions/undefined; order-sensitive.',
    'Bound the cache: LRU / size limit / TTL.',
    'WeakMap cache for object keys → entries GC-able (no primitives).',
    'Reference-equality (===) memoization = cheap + immutable inputs.',
    'Powers useMemo, useCallback, Vue computed, Reselect.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Memoize a single-argument square function so repeated calls do not recompute.',
      hint: 'Keep a Map keyed by the number.',
      solution: {
        lang: 'js',
        code: `function memoize(fn) {\n  const cache = new Map()\n  return (n) => cache.has(n) ? cache.get(n) : (cache.set(n, fn(n)), cache.get(n))\n}\nconst sq = memoize((n) => n * n)\nsq(5); sq(5) // second is cached`,
        explanation: ['The Map stores each result keyed by its input.', 'A hit returns the cached value; a miss computes and stores it.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a generic memoize for functions with multiple primitive arguments.',
      hint: 'Derive a key from all arguments (e.g. JSON.stringify or join).',
      solution: {
        lang: 'js',
        code: `function memoize(fn) {\n  const cache = new Map()\n  return function (...args) {\n    const key = args.join('|')\n    if (cache.has(key)) return cache.get(key)\n    const r = fn.apply(this, args)\n    cache.set(key, r)\n    return r\n  }\n}\nconst add = memoize((a, b) => a + b)\nadd(1, 2) // 3 (cached on key '1|2')`,
        explanation: ['We build a composite key from all arguments.', 'join works for primitives; objects would need stable serialization.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Memoize using a WeakMap so an object argument is cached without leaking when the object is gone.',
      hint: 'Use the object itself as the WeakMap key.',
      solution: {
        lang: 'js',
        code: `function memoizeByObject(fn) {\n  const cache = new WeakMap()\n  return (obj) => {\n    if (cache.has(obj)) return cache.get(obj)\n    const r = fn(obj)\n    cache.set(obj, r)\n    return r\n  }\n}\nconst sizeOf = memoizeByObject((o) => Object.keys(o).length)`,
        explanation: [
          'WeakMap keys by object reference and holds them weakly.',
          'When the object becomes unreachable elsewhere, its cache entry is collected.',
          'This avoids the unbounded-growth leak of a plain Map for object keys.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement memoize with a max-size LRU eviction policy.',
      hint: 'Use a Map (insertion-ordered); on hit re-insert; evict the oldest when over capacity.',
      solution: {
        lang: 'js',
        code: `function memoize(fn, max = 50) {\n  const cache = new Map()\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) {\n      const v = cache.get(key)\n      cache.delete(key)\n      cache.set(key, v)        // most recently used → move to end\n      return v\n    }\n    const r = fn.apply(this, args)\n    cache.set(key, r)\n    if (cache.size > max) {\n      cache.delete(cache.keys().next().value) // evict least recently used\n    }\n    return r\n  }\n}`,
        explanation: [
          'Map preserves insertion order, which we exploit for LRU.',
          'On a hit we delete and re-set the entry to mark it most-recently-used.',
          'When over capacity we delete the first (oldest) key, bounding memory.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Memoization is where closures, purity, and performance thinking meet. Being able to implement it, reason about cache keys, and prevent leaks shows you can write fast, correct code — and it directly explains how React/Vue caching works under the hood.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and a basic memoize. Product companies (Zoho, Flipkart, Razorpay) ask you to implement memoize, memoize Fibonacci, and discuss key derivation. FAANG-level interviews probe cache eviction (LRU/TTL), WeakMap usage, invalidation, and the distinction from distributed caching.',
    whatInterviewersExpect:
      'They expect you to define memoization, implement it with a closure and Map, require purity, handle multi-argument keys, and discuss bounding the cache (LRU/TTL/WeakMap) plus real framework examples like useMemo and Reselect.',
  },
}

export default memoization
