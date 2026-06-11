import type { ConceptLesson } from '../../../types/lesson'

const recursion: ConceptLesson = {
  // 1. Concept Summary
  slug: 'recursion',
  name: 'Recursion',
  category: 'functions',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Recursion is the natural way to process self-similar, nested data: trees, the DOM, file systems, JSON, and graphs.',
    'Many classic algorithms (traversals, divide-and-conquer like merge sort, backtracking) are far cleaner expressed recursively.',
    'Without understanding recursion you cannot reason about the call stack, stack overflow, or why some recursive code is slow (overlapping subproblems).',
    'Interviewers love it because it tests base/recursive-case thinking, the call stack mental model, and the ability to optimize (memoization, iteration).',
    'Misused recursion causes real production crashes: RangeError stack overflow on deep input, and exponential blow-ups like naive Fibonacci.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Recursion is like a set of Russian nesting dolls — open one to find a smaller one inside, until you reach the tiniest doll that opens no more.',
    story: [
      'Imagine a big wooden doll. You open it and inside is a smaller doll. You open that one and there is an even smaller one.',
      'You keep opening doll after doll, each smaller than the last.',
      'Eventually you reach the tiniest doll — it is solid and does not open. That is your signal to stop.',
      'Recursion is a function that solves a big problem by handing a smaller version of the same problem to itself, again and again, until it reaches the tiniest case (the "base case") that it can answer directly without going deeper.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Recursion is when a function calls itself to solve a smaller piece of the same problem.',
    'Every recursive function needs two parts: a base case that stops the recursion, and a recursive case that calls itself on a smaller input.',
    'Without a base case it would call itself forever and crash — like a mirror facing another mirror.',
    'It is great for things that contain smaller copies of themselves, like a folder that holds other folders, or counting down from 5 to 0.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Recursion is a technique where a function solves a problem by calling itself on a smaller subproblem, combining the results, until it hits a base case that returns directly without further recursion.',
    how: 'You define (1) a base case — the simplest input you can answer immediately — and (2) a recursive case that reduces the problem toward the base case and calls the function again. Each call gets its own stack frame; results unwind as calls return.',
    why: 'It expresses naturally recursive structures and algorithms in fewer, clearer lines than manual loops with explicit stacks, especially for trees and divide-and-conquer.',
    code: {
      label: 'Factorial — base case + recursive case',
      lang: 'js',
      code: `function factorial(n) {\n  if (n <= 1) return 1          // base case: stop here\n  return n * factorial(n - 1)  // recursive case: smaller problem\n}\nfactorial(4) // 24  (4 * 3 * 2 * 1)`,
      explanation: [
        'The base case (n <= 1) returns 1 and stops the recursion.',
        'The recursive case multiplies n by factorial of n-1, a smaller input.',
        'factorial(4) → 4 * factorial(3) → 4 * 3 * factorial(2) → ... → 4*3*2*1.',
        'Each call waits ("pauses") for the inner call to return, then multiplies.',
        'Without the base case it would recurse forever and overflow the stack.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Recursion is a problem-solving technique in which a function invokes itself on a strictly smaller subproblem until reaching a base case that returns without recursing. Each invocation pushes a new frame onto the call stack capturing its parameters and locals; frames unwind as calls return, combining partial results. Recursion has the same expressive power as iteration (any recursion can be rewritten with an explicit stack), but in JavaScript it is bounded by the engine call-stack limit and, without tail-call optimization in most engines, deep recursion risks RangeError. Overlapping subproblems can make naive recursion exponential, mitigated by memoization (top-down DP) or conversion to iteration.',

  // 7. Internal Working
  internalWorking: [
    'Calling the function pushes a new execution context (stack frame) holding its arguments, locals, and a return address.',
    'If the input is not a base case, the function calls itself with a reduced argument, pushing yet another frame — the stack grows with depth.',
    'When a call reaches the base case, it returns a concrete value without recursing further.',
    'Returns unwind the stack: each waiting frame resumes, combines the returned value (e.g. multiplies, concatenates), and returns to its caller.',
    'The maximum stack depth is bounded by the engine; exceeding it throws RangeError: Maximum call stack size exceeded.',
    'Most JS engines do not implement proper tail-call optimization (despite the spec), so even tail-recursive functions still consume a frame per call — deep recursion must be converted to iteration or trampolined.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  factorial(4)
   │  pushes frames going DOWN
   ▼
  factorial(4)  waits for ──► factorial(3) waits ──► factorial(2) waits ──► factorial(1)=1  (base)
   ▲                                                                              │
   │  unwinds going UP, combining results                                         │
   └─ 24 = 4*6 ◄── 6 = 3*2 ◄── 2 = 2*1 ◄──────────────────────────────────────────┘

  CALL STACK grows with depth → too deep = RangeError`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: each recursive call adds a frame holding that call\'s n and return address; depth d means d frames live simultaneously.',
    'HEAP: any objects/arrays built (e.g. an accumulator array, a results list) live on the heap, referenced by frames.',
    'UNWIND: as base cases return, frames pop one by one and their locals become collectable.',
    'OVERFLOW: when total frame count exceeds the engine limit (often tens of thousands), the stack overflows — this is why deep/unbounded recursion is dangerous.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — sum a range recursively',
      lang: 'js',
      code: `function sumTo(n) {\n  if (n === 0) return 0       // base case\n  return n + sumTo(n - 1)     // recursive case\n}\nsumTo(5) // 15`,
      explanation: [
        'Base case: sumTo(0) is 0.',
        'Recursive case: n plus the sum of everything below it.',
        'sumTo(5) → 5 + sumTo(4) → ... → 5+4+3+2+1+0.',
        'Each frame waits for the smaller call to resolve.',
      ],
    },
    intermediate: {
      label: 'Intermediate — traverse a nested tree',
      lang: 'js',
      code: `const tree = {\n  name: 'root',\n  children: [\n    { name: 'a', children: [] },\n    { name: 'b', children: [{ name: 'b1', children: [] }] },\n  ],\n}\nfunction collectNames(node, acc = []) {\n  acc.push(node.name)\n  for (const child of node.children) {\n    collectNames(child, acc)   // recurse into each subtree\n  }\n  return acc\n}\ncollectNames(tree) // ['root', 'a', 'b', 'b1']`,
      explanation: [
        'Trees are self-similar: each node has children that are themselves nodes — perfect for recursion.',
        'The base case is implicit: a node with no children stops the loop.',
        'We thread an accumulator (acc) through the calls to gather results.',
        'This is exactly how you walk the DOM, a file system, or JSON.',
      ],
    },
    advanced: {
      label: 'Advanced — naive vs memoized Fibonacci',
      lang: 'js',
      code: `// Naive: exponential O(2^n) — recomputes the same values\nfunction fib(n) {\n  if (n < 2) return n\n  return fib(n - 1) + fib(n - 2)\n}\n\n// Memoized: O(n) — cache overlapping subproblems\nfunction fibMemo(n, cache = new Map()) {\n  if (n < 2) return n\n  if (cache.has(n)) return cache.get(n)\n  const result = fibMemo(n - 1, cache) + fibMemo(n - 2, cache)\n  cache.set(n, result)\n  return result\n}`,
      explanation: [
        'Naive fib recomputes fib(n-2) many times — the call tree is exponential.',
        'Memoization caches each n once, collapsing the work to linear (top-down dynamic programming).',
        'This is the canonical interview demonstration of overlapping subproblems.',
        'For very large n, even the memoized version risks stack depth — an iterative bottom-up version avoids that.',
      ],
    },
    realProject: {
      label: 'Real project — deep clone / flatten nested config in Node',
      lang: 'js',
      code: `function deepFreeze(obj) {\n  Object.freeze(obj)\n  for (const key of Object.keys(obj)) {\n    const val = obj[key]\n    if (val && typeof val === 'object' && !Object.isFrozen(val)) {\n      deepFreeze(val)             // recurse into nested objects\n    }\n  }\n  return obj\n}\n\nconst config = deepFreeze({ db: { host: 'x', opts: { ssl: true } } })`,
      explanation: [
        'Config objects are arbitrarily nested, so recursion mirrors their shape.',
        'The base case is a non-object value (no further recursion).',
        'We freeze each level, recursing into child objects to make the whole tree immutable.',
        'This pattern appears in deepClone, deepMerge, and schema validators across Node libraries.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the two essential parts of a recursive function?',
      answer: 'A base case that stops the recursion by returning a value directly, and a recursive case that calls the function on a smaller subproblem moving toward the base case.',
      explanation: 'Naming both parts and stressing "smaller subproblem" is the core of a strong answer.',
    },
    {
      level: 'beginner',
      question: 'What happens if a recursive function has no base case (or never reaches it)?',
      answer: 'It calls itself indefinitely, pushing frames until the call stack overflows, throwing RangeError: Maximum call stack size exceeded.',
      explanation: 'Connecting the missing base case to the call stack shows you understand the mechanism.',
    },
    {
      level: 'intermediate',
      question: 'Why is naive recursive Fibonacci slow, and how do you fix it?',
      answer: 'Because it has overlapping subproblems — fib(n) recomputes the same values exponentially, O(2^n). Fix it with memoization (cache each result) for O(n), or rewrite iteratively bottom-up.',
      explanation: 'Tests whether you recognize overlapping subproblems and know dynamic-programming fixes.',
    },
    {
      level: 'intermediate',
      question: 'How would you convert a recursive function to an iterative one?',
      answer: 'Use an explicit stack (array) to mimic the call stack: push the work to do, loop while the stack is non-empty, pop and process, pushing subproblems instead of recursing.',
      explanation: 'Demonstrates the equivalence of recursion and iteration and a way to avoid stack overflow.',
    },
    {
      level: 'advanced',
      question: 'What is tail recursion, and does JavaScript optimize it?',
      answer: 'Tail recursion is when the recursive call is the last operation, so no work remains after it returns, making it theoretically convertible to a loop without growing the stack. The ES2015 spec includes proper tail calls, but most engines (V8) do not implement it, so you still get a frame per call.',
      explanation: 'Senior nuance: knowing the spec says one thing but engines do not implement it is a strong signal.',
    },
    {
      level: 'senior',
      question: 'How do you handle recursion on very deep or untrusted input safely in production?',
      answer: 'Convert to iteration with an explicit stack, or use a trampoline to flatten recursion, or set/bound a depth limit. For untrusted input (deeply nested JSON), cap depth to prevent a stack-overflow denial of service.',
      explanation: 'Senior signal: thinking about stack limits, DoS via deep nesting, and trampolining.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between recursion and iteration in time/space cost?',
    'How does a trampoline let you do deep recursion without overflowing the stack?',
    'What is mutual recursion (two functions calling each other)?',
    'How would you traverse the DOM/tree iteratively (BFS vs DFS)?',
    'When is recursion clearer than a loop, and when is it worse?',
    'How does memoization turn an exponential recursion into a linear one?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting or never reaching the base case.',
      why: 'The function recurses forever and overflows the stack (RangeError).',
      fix: 'Define the base case first and ensure every recursive call moves strictly toward it.',
    },
    {
      mistake: 'Using naive recursion for problems with overlapping subproblems (e.g. Fibonacci).',
      why: 'Recomputing the same subproblems makes it exponential and slow.',
      fix: 'Add memoization (cache results) or convert to bottom-up iteration.',
    },
    {
      mistake: 'Recursing on deeply nested or unbounded input.',
      why: 'Even correct recursion overflows the stack past the engine depth limit.',
      fix: 'Convert to an iterative explicit-stack version or trampoline; cap depth for untrusted data.',
    },
    {
      mistake: 'Mutating shared state across recursive calls without care.',
      why: 'Accumulators passed by reference can be corrupted by sibling branches if reused incorrectly.',
      fix: 'Thread the accumulator explicitly or return new values; be deliberate about shared vs per-call state.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Recursive components (a component that renders itself via its own name) render trees like nested menus, comment threads, and file explorers.' },
    { area: 'React', detail: 'Rendering nested comment trees or category trees with a recursive component; reconciliation conceptually walks the tree.' },
    { area: 'Node.js', detail: 'Walking the file system (fs recursion), traversing/transforming ASTs (Babel/ESLint), and deep-merging/cloning config objects.' },
    { area: 'Backend', detail: 'Graph/tree algorithms (org charts, category hierarchies), parsing nested structures, and divide-and-conquer processing of large inputs.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Recursion expresses tree/divide-and-conquer algorithms concisely and correctly.',
      'With memoization, recursive top-down DP achieves the same asymptotic cost as iterative DP while staying readable.',
    ],
    bad: [
      'Each call adds a stack frame; deep recursion risks RangeError and uses O(depth) memory.',
      'Naive recursion with overlapping subproblems explodes to exponential time.',
    ],
    optimizations: [
      'Memoize to eliminate recomputation of overlapping subproblems.',
      'Convert deep recursion to iteration with an explicit stack to bound memory and avoid overflow.',
      'Use a trampoline for tail-recursive logic so each step does not grow the native stack.',
      'Prefer iterative bottom-up DP for very large inputs where stack depth is a concern.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['call-stack', 'execution-context', 'function-declaration-vs-expression', 'scope'],
    nextConcepts: ['memoization', 'higher-order-functions', 'stack-vs-heap', 'generators'],
    dependencyNote:
      'Recursion is the call stack made visible: you need execution contexts and the call stack to reason about it. It leads into memoization (taming exponential recursion) and divide-and-conquer algorithmic thinking.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the two pieces: base case (stop) and recursive case (smaller problem).',
      'Draw factorial(4) at the top and arrows going DOWN to factorial(3), factorial(2), factorial(1).',
      'Mark factorial(1) as the base case returning 1.',
      'Draw arrows going back UP showing results combine: 1 → 2 → 6 → 24.',
      'Say: "Each call is a stack frame; we go down until the base case, then unwind combining results. Too deep and the stack overflows, so for big input I iterate or memoize."',
    ],
    diagram: `  fact(4)─►fact(3)─►fact(2)─►fact(1)=1   (down: push frames)
     24  ◄─  6   ◄─  2   ◄─────┘            (up: combine + pop)
  base case stops it; depth = stack frames`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Recursion is a function calling itself on a smaller subproblem until it hits a base case that returns directly. Each call is a stack frame; calls go down pushing frames, then unwind combining results. It is ideal for self-similar data like trees, the DOM, and JSON. Watch for stack overflow on deep input and exponential blow-ups from overlapping subproblems — fix with memoization or by converting to iteration with an explicit stack.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Recursion is a technique where a function solves a problem by calling itself on a smaller version of the same problem. Every recursive function needs two parts: a base case that returns a value directly and stops the recursion, and a recursive case that reduces the input toward the base case and calls itself. Mechanically, each call pushes a new frame onto the call stack holding its arguments and locals; the stack grows as we recurse deeper, and once we reach the base case the frames unwind, each combining the returned value — for factorial, multiplying on the way back up. Recursion shines on self-similar structures: trees, the DOM, file systems, JSON, and divide-and-conquer algorithms like merge sort. The two big dangers are stack overflow — if the input is too deep or there is no reachable base case, you exceed the engine call-stack limit and get a RangeError — and exponential time when there are overlapping subproblems, the classic example being naive Fibonacci which recomputes the same values, O(2^n). The fix for the latter is memoization, caching each result for linear time; the fix for depth is converting to iteration with an explicit stack or using a trampoline, because most JS engines do not actually implement the spec\'s proper tail calls. For untrusted, deeply nested input I also cap the recursion depth to avoid a denial-of-service.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Recursion is more readable for tree/divide-and-conquer but uses O(depth) stack and risks overflow; iteration is uglier but bounded.',
      'Memoized top-down recursion is clear but uses a cache and stack; bottom-up iteration is fastest and most memory-predictable.',
    ],
    edgeCases: [
      'Missing/unreachable base case → infinite recursion → RangeError.',
      'Tail-recursive code still overflows because V8 does not implement proper tail calls.',
      'Mutual recursion (a calls b calls a) must have a base case reachable across both.',
      'Deeply nested untrusted JSON can be a stack-overflow DoS vector.',
    ],
    runtimeBehavior: [
      'Stack depth limit is engine- and frame-size-dependent (often tens of thousands of simple frames).',
      'Each frame holds locals/args; large per-frame data multiplies memory with depth.',
      'Returns unwind synchronously; an exception thrown deep in recursion propagates up through all waiting frames.',
    ],
    scalability: [
      'For large/deep inputs, prefer iterative explicit-stack traversal or streaming to bound memory.',
      'Trampolining lets tail-recursive workloads run in constant native stack space.',
    ],
    productionConcerns: [
      'Guard against stack-overflow DoS on user-supplied nested data with depth limits.',
      'Profile exponential recursion early; memoize or restructure before it reaches production.',
      'Document and test the base case and the depth assumptions for recursive utilities.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Recursion = a function calling itself on a smaller subproblem.',
    'Needs a base case (stop) + recursive case (smaller input).',
    'Each call = a stack frame; depth = number of live frames.',
    'No reachable base case → RangeError (stack overflow).',
    'Great for trees, DOM, JSON, file systems, divide-and-conquer.',
    'Overlapping subproblems → exponential (naive Fibonacci) → memoize.',
    'Any recursion can be rewritten iteratively with an explicit stack.',
    'Tail recursion is in the spec but NOT optimized by most engines.',
    'Use a trampoline for constant-stack tail recursion.',
    'Cap depth on untrusted nested input to avoid DoS.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a recursive countdown(n) that returns an array [n, n-1, ..., 0].',
      hint: 'Base case at 0; otherwise prepend n to countdown(n-1).',
      solution: {
        lang: 'js',
        code: `function countdown(n) {\n  if (n < 0) return []\n  return [n, ...countdown(n - 1)]\n}\ncountdown(3) // [3, 2, 1, 0]`,
        explanation: ['Base case returns [] when n goes below 0.', 'Each call prepends n to the result of the smaller call.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a recursive function flatten(arr) that flattens an arbitrarily nested array.',
      hint: 'For each element, if it is an array recurse, otherwise include it.',
      solution: {
        lang: 'js',
        code: `function flatten(arr) {\n  return arr.reduce((acc, el) =>\n    Array.isArray(el) ? acc.concat(flatten(el)) : acc.concat(el)\n  , [])\n}\nflatten([1, [2, [3, [4]]]]) // [1, 2, 3, 4]`,
        explanation: ['Arrays are self-similar (arrays inside arrays), so recursion fits.', 'Non-array elements are the base case; arrays trigger a recursive flatten.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Compute the depth of a nested object/array tree recursively.',
      hint: 'Depth is 1 + the max depth of any child; primitives are depth 0.',
      solution: {
        lang: 'js',
        code: `function depth(value) {\n  if (value === null || typeof value !== 'object') return 0\n  const children = Array.isArray(value) ? value : Object.values(value)\n  if (children.length === 0) return 1\n  return 1 + Math.max(...children.map(depth))\n}\ndepth({ a: { b: { c: 1 } } }) // 3`,
        explanation: [
          'Primitives are the base case with depth 0.',
          'For containers we take 1 plus the deepest child, recursing into each value.',
          'Math.max over mapped child depths gives the tallest branch.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Rewrite a recursive sum of a deep nested array iteratively (explicit stack) to avoid stack overflow.',
      hint: 'Push values onto a stack; pop, and if an element is an array push its items instead.',
      solution: {
        lang: 'js',
        code: `function deepSum(arr) {\n  const stack = [...arr]\n  let total = 0\n  while (stack.length) {\n    const el = stack.pop()\n    if (Array.isArray(el)) {\n      stack.push(...el)      // push children instead of recursing\n    } else {\n      total += el\n    }\n  }\n  return total\n}\ndeepSum([1, [2, [3, [4, [5]]]]]) // 15`,
        explanation: [
          'We replace the call stack with an explicit array stack.',
          'Encountering an array pushes its items; numbers are added to the total.',
          'This handles arbitrary depth without risking RangeError.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Recursion is a rite of passage: it forces you to internalize the call stack, base/recursive-case decomposition, and the time/space costs of an algorithm. Mastering it makes tree traversal, parsing, and divide-and-conquer second nature.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for factorial/Fibonacci and the base-case explanation. Product companies (Zoho, Flipkart, Razorpay) ask you to flatten arrays, traverse trees, or memoize Fibonacci. FAANG-level interviews probe tail calls, stack-overflow handling, recursion-to-iteration conversion, and complexity analysis.',
    whatInterviewersExpect:
      'They expect you to identify the base and recursive cases, trace the call stack, recognize and fix exponential blow-ups with memoization, and know how to convert deep recursion to iteration to avoid stack overflow.',
  },
}

export default recursion
