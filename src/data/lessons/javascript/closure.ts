import type { ConceptLesson } from '../../../types/lesson'

const closure: ConceptLesson = {
  // 1. Concept Summary
  slug: 'closure',
  name: 'Closure',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Closures are how JavaScript gives a function private, persistent memory — the foundation of data privacy without classes.',
    'Almost every pattern you use daily is a closure underneath: debounce/throttle, memoization, React hooks, Vue composables, event handlers, the module pattern.',
    'Without closures, a function could never "remember" anything between calls, and callbacks would lose access to the data they were created with.',
    'They are the #1 way interviewers separate developers who memorized syntax from those who understand scope and memory.',
    'Misunderstanding closures causes real production bugs — the classic loop bug, and subtle memory leaks where a forgotten listener pins megabytes of data alive.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A closure is a backpack a function carries everywhere it goes.',
    story: [
      'Imagine you pack a backpack at home before going to school. Inside it you put your lunch, your pencil, and a photo of your dog.',
      'When you leave the house, the house is now empty and locked — but you still have your backpack with all those things inside.',
      'At school, even though you are far away from home, you can still open your backpack and eat your lunch or look at your dog photo.',
      'A function is like you. When it is created inside another function, it quietly packs a backpack with all the variables around it. Later, even after the outer function has finished and "gone home", the inner function still carries that backpack and can use everything inside it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript you can put a function inside another function. The inner function is allowed to use the variables of the outer function — that is just normal scope.',
    'The surprising part: even after the outer function finishes running and "ends", the inner function can STILL use those outer variables if you saved the inner function somewhere (returned it, or passed it as a callback).',
    'That bundle — the inner function plus the outer variables it remembers — is called a closure.',
    'Think of it like a remote control that still controls a specific TV even after you have left the room where you set it up. The connection stays.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A closure is a function together with the variables from its surrounding (lexical) scope that it still has access to, even after that outer scope has finished executing.',
    how: 'When a function is defined, it keeps a hidden reference to the environment where it was created. As long as that inner function is still reachable (e.g. you returned it), JavaScript keeps the captured variables alive in memory instead of throwing them away.',
    why: 'It lets you create private state and "remember" values between calls — like a counter that keeps counting, or a function pre-configured with some data.',
    code: {
      label: 'A counter that remembers',
      lang: 'js',
      code: `function makeCounter() {\n  let count = 0           // private variable\n  return function () {\n    count++               // inner function uses outer variable\n    return count\n  }\n}\n\nconst counter = makeCounter()\nconsole.log(counter()) // 1\nconsole.log(counter()) // 2\nconsole.log(counter()) // 3`,
      explanation: [
        'makeCounter() runs and creates a local variable `count = 0`.',
        'It returns an inner function that increments and returns `count`.',
        'Normally `count` would disappear when makeCounter() finishes — but the returned function still references it, so JavaScript keeps it alive.',
        'Each call to counter() reuses the SAME `count`, so it climbs 1, 2, 3. That persistence is the closure.',
        '`count` is completely private — nothing outside can read or change it directly.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A closure is the combination of a function and the lexical environment within which that function was declared. The function retains a reference to its outer variable environment via the scope chain, so it can read and mutate those bindings even after the outer execution context has been popped off the call stack. Captured variables are stored on the heap and remain alive as long as the closure is reachable.',

  // 7. Internal Working
  internalWorking: [
    'When the JS engine creates a function, it stores an internal [[Environment]] reference pointing to the Lexical Environment in which the function was defined (this is set at definition time, not call time — closures are lexical).',
    'When the outer function is invoked, a new execution context with its own variable environment is pushed onto the call stack; its variables (like `count`) are allocated.',
    'If the outer function returns an inner function (or stores it where it stays reachable), that inner function still holds its [[Environment]] link to the outer variable environment.',
    'Normally, when a function returns, its execution context is popped and its variables become unreachable and eligible for garbage collection. But here the variables are still referenced by the surviving inner function, so they are NOT collected.',
    'Because of this reachability, the captured variables live on the heap rather than dying with the stack frame.',
    'On each later call to the inner function, the engine resolves `count` by walking the scope chain to that retained outer environment — finding the same binding every time, which is why state persists and is shared across calls created from the same scope.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   makeCounter()  ── runs, then RETURNS ──┐
        │                                 │
        │ creates                         │ stack frame popped,
        ▼                                 │ BUT variable kept alive...
   ┌─────────────────┐                    │
   │ count = 0  (heap)│◄───────────────┐  │
   └─────────────────┘                 │  │
                                        │ [[Environment]] link
                                        │  │
                                   ┌────┴──▼─────────┐
                                   │ inner function  │  ← the closure
                                   │ () => count++   │
                                   └─────────────────┘
                                        │
                          counter() ────┘  still reads/writes the SAME count`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: while makeCounter() runs, a frame holds the reference to `count`. When it returns, this frame is popped.',
    'HEAP: the object `count` lives in (numbers are boxed inside the captured environment record) is on the heap. The returned inner function is also a heap object.',
    'REFERENCE CHAIN: `counter` (a variable) → inner function object → [[Environment]] → the environment record holding `count`. Every link is reachable from a root, so the GC keeps `count`.',
    'The moment you do `counter = null` and no other reference exists, the whole chain becomes unreachable and `count` is finally collected. This is exactly why a forgotten closure can leak memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — private variable',
      lang: 'js',
      code: `function greeter(name) {\n  return function () {\n    return 'Hello, ' + name\n  }\n}\nconst greetSam = greeter('Sam')\ngreetSam() // "Hello, Sam"`,
      explanation: [
        '`name` is captured by the returned function.',
        'After greeter() returns, `name` would normally vanish, but the inner function keeps it.',
        'greetSam() can be called any time later and still knows `name === "Sam"`.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the loop bug and its fix',
      lang: 'js',
      code: `// Bug: prints 3, 3, 3\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n\n// Fix: let creates a fresh binding per iteration → 0, 1, 2\nfor (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}`,
      explanation: [
        'With `var`, there is ONE `i` shared by all three closures (function scope). By the time the timers fire, the loop has finished and `i === 3`.',
        'All three callbacks close over the same single binding, so all print 3.',
        'With `let`, each iteration gets a NEW block-scoped binding of `i`, so each closure captures a different value: 0, 1, 2.',
        'This is the single most common closure interview question — be ready to explain WHY, not just the fix.',
      ],
    },
    advanced: {
      label: 'Advanced — memoize with a private cache',
      lang: 'js',
      code: `function memoize(fn) {\n  const cache = new Map()        // private, persists across calls\n  return function (...args) {\n    const key = JSON.stringify(args)\n    if (cache.has(key)) return cache.get(key)\n    const result = fn.apply(this, args)\n    cache.set(key, result)\n    return result\n  }\n}\n\nconst slowSquare = (n) => { /* expensive */ return n * n }\nconst fastSquare = memoize(slowSquare)\nfastSquare(4) // computes\nfastSquare(4) // returns cached`,
      explanation: [
        '`cache` lives in the closure created by memoize — it is private and survives between calls to the returned function.',
        'The returned function reads and writes that same Map every time it is invoked.',
        'No global state, no class — the closure gives encapsulated, persistent storage.',
        'This is closures doing real work: every memoization, debounce, and throttle utility uses this exact shape.',
      ],
    },
    realProject: {
      label: 'Real project — a debounced search in a Vue composable',
      lang: 'js',
      code: `function useDebouncedSearch(fetchResults, delay = 300) {\n  let timer = null               // captured by the closure below\n  return function search(query) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fetchResults(query), delay)\n  }\n}\n\n// usage\nconst search = useDebouncedSearch(api.search)\ninput.addEventListener('input', (e) => search(e.target.value))`,
      explanation: [
        '`timer` is private state held by the closure — it remembers the pending timeout between keystrokes.',
        'Each keystroke clears the previous pending call and schedules a new one; only the last survives.',
        'Without a closure you would need a global or a class field to hold `timer`; the closure keeps it neatly scoped to this one search function.',
        'This exact pattern powers search-as-you-type, autosave, and resize handlers in production apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a closure in JavaScript?',
      answer: 'A closure is a function bundled with references to the variables from its surrounding scope, which it can still access even after that outer function has finished executing.',
      explanation: 'A strong beginner answer names BOTH parts — the function AND the retained lexical environment — and gives one concrete use like a counter or a callback that remembers data.',
    },
    {
      level: 'beginner',
      question: 'Give a real example where you have used a closure.',
      answer: 'A debounce function: the timer ID is kept in a closure between calls. Or a counter/ID generator that increments a private variable. Or any event handler that needs to remember the element/data it was attached for.',
      explanation: 'Interviewers want evidence you recognize closures in everyday code, not just textbook examples.',
    },
    {
      level: 'intermediate',
      question: 'Why does `for (var i...) setTimeout(() => console.log(i))` print the final value three times, and how do you fix it?',
      answer: 'Because `var` is function-scoped: all three callbacks close over the SAME single `i`, which is 3 after the loop ends. Fix it with `let` (a fresh binding per iteration) or by capturing the value in an IIFE parameter.',
      explanation: 'The key insight is shared-binding vs per-iteration-binding. Mentioning that `let` creates a new lexical environment each iteration shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'Do two functions defined in the same scope share the same closure variables?',
      answer: 'Yes. If you create a getter and a setter inside the same outer function, both close over the same variable — the setter mutates it and the getter sees the change.',
      explanation: 'This demonstrates that a closure captures the environment by reference, not a snapshot copy — a frequent follow-up.',
    },
    {
      level: 'advanced',
      question: 'How can closures cause memory leaks?',
      answer: 'If a long-lived reference (e.g. an event listener, a timer, or a cache) holds a closure that captures large objects, those objects cannot be garbage collected for as long as the closure is reachable — even if you no longer need them.',
      explanation: 'Strong answers mention the reachability rule and the fix: remove listeners on cleanup, null out references, or use WeakMap so captured objects can still be collected.',
    },
    {
      level: 'senior',
      question: 'Explain how the JS engine implements closures and the memory implications.',
      answer: 'Each function stores an internal [[Environment]] link to the lexical environment where it was defined. When a closure outlives its outer call, the captured environment record is kept on the heap instead of being collected with the stack frame. Engines optimize by capturing only referenced variables, but a shared environment record can keep sibling variables alive too.',
      explanation: 'Senior signal: connecting closures to the scope chain, heap allocation, the reachability/GC model, and engine-level capture optimizations.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between scope and closure?',
    'Are closures created at definition time or call time? (definition — they are lexical)',
    'How is a closure different from a regular function?',
    'How would you create truly private variables before ES6 classes / # fields? (closures + module pattern)',
    'Can you implement `once(fn)` so a function runs only the first time?',
    'How do React hooks rely on closures, and what is the "stale closure" problem?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Defining a closure as just "a function inside a function".',
      why: 'It misses the whole point — the persistence of and access to outer variables after the outer scope ends.',
      fix: 'Always mention the retained lexical environment and give a persistence example (a counter that keeps its value).',
    },
    {
      mistake: 'Using `var` in loops with async callbacks and expecting per-iteration values.',
      why: '`var` is function-scoped, so every callback closes over the same single binding.',
      fix: 'Use `let` for a fresh per-iteration binding, or capture the value via an IIFE/parameter.',
    },
    {
      mistake: 'Assuming a closure copies the variable values.',
      why: 'Closures capture variables by reference; if the variable changes later, the closure sees the new value.',
      fix: 'If you need a snapshot, copy the value into a new variable at capture time.',
    },
    {
      mistake: 'Leaving event listeners / timers that capture large objects.',
      why: 'The captured objects stay reachable through the closure and never get collected.',
      fix: 'Remove listeners on unmount/cleanup (AbortController helps), clear timers, and prefer WeakMap for object-keyed caches.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables (useXxx functions) hold private reactive state and helpers in closures; the returned functions close over refs created inside the composable.' },
    { area: 'React', detail: 'Every hook relies on closures — useState/useEffect callbacks close over props and state from the render they were created in. The "stale closure" bug (an effect reading an old value) is a direct consequence; the dependency array controls which closure is current.' },
    { area: 'Node.js', detail: 'Request handlers and middleware close over per-request context; async callbacks close over connection/transaction objects. Module-level closures hold configuration and connection pools.' },
    { area: 'Backend', detail: 'Factory functions return handlers pre-configured with dependencies (a closure-based form of dependency injection), avoiding globals while keeping state encapsulated.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Closures avoid globals and give clean encapsulation with negligible overhead for typical use.',
      'They enable memoization, which trades a little memory for large compute savings on repeat calls.',
    ],
    bad: [
      'Capturing large objects in long-lived closures keeps them in memory (leak risk).',
      'Creating many closures in hot paths (e.g. a new function per array element on every render) adds allocation/GC pressure.',
    ],
    optimizations: [
      'Hoist stable callbacks out of loops/renders so you are not allocating a fresh closure every time.',
      'Use WeakMap/WeakRef for caches keyed by objects so captured data can still be collected.',
      'Capture only the minimal data you need — not an entire large object — to limit what stays alive.',
      'Clean up listeners and timers to release the closures (and everything they capture).',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Closures are commonly used to hold secrets (tokens, keys) as "private" state — but in the browser, anything in JS memory is inspectable via DevTools, so closure privacy is encapsulation, not real secrecy.',
    ],
    bestPractices: [
      'Never treat a closure as a secure vault for sensitive values in client-side code.',
      'Keep real secrets server-side; on the client, store tokens in httpOnly cookies rather than closures or localStorage.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scope', 'scope-chain', 'lexical-environment', 'execution-context', 'garbage-collection'],
    nextConcepts: ['memoization', 'debounce', 'throttle', 'currying-partial-application', 'module-pattern', 'iife'],
    dependencyNote:
      'Closures sit at the heart of the execution-model spine: you need scope and the scope chain to understand them, and they in turn unlock almost every functional pattern (memoize, debounce/throttle, currying) and the module pattern.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the outer function as a box; inside it write a variable (e.g. count = 0).',
      'Draw the inner function inside the box with an arrow pointing to that variable.',
      'Now cross out the outer box ("it returned / finished") but keep the variable, drawing it to the side as "kept on heap".',
      'Show the inner function still pointing to the kept variable.',
      'Say: "The function plus this retained link is the closure — it survives because the inner function still references the variable, so GC can\'t collect it."',
    ],
    diagram: `  ┌─ outer() ──────────────┐
  │   count = 0  ───────────┼──► kept alive (heap)
  │   inner() ──────────────┼──┐   ▲
  └────────────────────────┘  │   │
       (outer returns,        └───┘ inner still references count
        box discarded)              = CLOSURE`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A closure is a function that remembers the variables from where it was defined, even after that outer function has finished. The engine keeps those variables alive on the heap because the inner function still references them through the scope chain. This gives private, persistent state and powers debounce, memoize, currying, the module pattern, and hooks. The classic trap is the var-in-loop bug, fixed with let.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A closure is the combination of a function and the lexical environment it was defined in. In JavaScript, scope is lexical — a function remembers where it was written, not where it is called. When an inner function is created, it keeps a hidden reference to its outer scope. Normally, when the outer function returns, its variables are popped off the stack and garbage collected. But if the inner function is still reachable — because we returned it or passed it as a callback — those variables stay alive on the heap, because they are still referenced. That bundle of the function plus its retained variables is the closure. The practical value is private, persistent state: a counter that keeps counting, a debounce that remembers its timer, a memoize that holds a cache — all without globals or classes. Two closures from the same scope share the same variables, captured by reference, not by copy. The classic gotcha is using var in a loop with async callbacks: they all share one binding and print the final value; let fixes it by creating a fresh binding each iteration. The main risk is memory: a long-lived closure capturing large objects keeps them alive, so you clean up listeners and timers and use WeakMap when appropriate.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Encapsulation vs introspection: closures hide state cleanly, but that state is invisible to tooling and harder to inspect/serialize than an object field.',
      'Closures vs classes for state: closures give true privacy and ergonomic factory functions; classes are more discoverable and play better with prototype-based method sharing and instanceof.',
    ],
    edgeCases: [
      'Loop variable capture (var vs let) — the canonical example.',
      'Shared environment records: capturing one variable can keep sibling variables alive if the engine groups them, an under-appreciated leak source.',
      'Stale closures in React: an effect or callback captures props/state from a past render; fixed via dependency arrays, refs, or functional state updates.',
      'Closures over loop-created listeners can multiply memory if not cleaned up.',
    ],
    runtimeBehavior: [
      'Capture is by reference to the binding, so later mutations are visible to the closure.',
      'Engines (V8) perform escape analysis and only retain variables actually referenced, but conservative cases keep more alive than expected.',
      'Closure variable access walks the scope chain; deeply nested closures have marginally more lookup work, usually negligible.',
    ],
    scalability: [
      'In hot render paths, allocating a new closure per item per render creates GC churn — hoist or memoize callbacks.',
      'Server-side, per-request closures are fine and idiomatic, but capturing connection/transaction objects in long-lived structures can exhaust pools.',
    ],
    productionConcerns: [
      'Memory leaks from un-removed listeners/timers are the most common closure-related production incident — audit cleanup paths.',
      'Debugging stale closures requires understanding which render/scope the function was created in.',
      'Use AbortController to remove groups of listeners (and release their closures) in one call.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Closure = function + the lexical environment it was defined in.',
    'Lexical = decided at DEFINITION time, not call time.',
    'Captured variables live on the heap as long as the closure is reachable.',
    'Gives private + persistent state without classes.',
    'Powers: debounce, throttle, memoize, currying, module pattern, hooks/composables.',
    'Captures by REFERENCE, not by value — later changes are visible.',
    'var-in-loop bug → all callbacks share one binding → use let.',
    'Leak risk: long-lived closure capturing big objects → clean up listeners/timers, use WeakMap.',
    'Two closures from one scope share the same variables.',
    'Browser privacy is encapsulation, not real secrecy (DevTools can inspect).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write `makeAdder(x)` that returns a function adding x to its argument. `makeAdder(5)(3)` should return 8.',
      hint: 'Return an inner function that closes over x.',
      solution: {
        lang: 'js',
        code: `function makeAdder(x) {\n  return (y) => x + y\n}\nmakeAdder(5)(3) // 8`,
        explanation: ['The returned arrow function captures `x`.', 'Calling it later with `y` adds the remembered `x`.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement `once(fn)` so that fn runs only on the first call; later calls return the first result.',
      hint: 'Keep a `called` flag and a `result` in the closure.',
      solution: {
        lang: 'js',
        code: `function once(fn) {\n  let called = false\n  let result\n  return function (...args) {\n    if (!called) {\n      called = true\n      result = fn.apply(this, args)\n    }\n    return result\n  }\n}`,
        explanation: [
          '`called` and `result` are private closure state shared across calls.',
          'First call sets the flag and stores the result; subsequent calls short-circuit and return it.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Fix this so it logs 0,1,2 with a 1-second gap each, WITHOUT changing var to let: `for (var i=0;i<3;i++){ setTimeout(()=>console.log(i), i*1000) }`',
      hint: 'Capture i in a new scope per iteration using an IIFE.',
      solution: {
        lang: 'js',
        code: `for (var i = 0; i < 3; i++) {\n  ((j) => {\n    setTimeout(() => console.log(j), j * 1000)\n  })(i)\n}`,
        explanation: [
          'The IIFE creates a new scope each iteration and binds the current `i` to parameter `j`.',
          'Each timeout closes over its own `j`, so they print 0, 1, 2.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a `createBankAccount(initial)` returning { deposit, withdraw, balance } where the balance is private and cannot be set directly.',
      hint: 'Keep `balance` as a closure variable; expose only methods.',
      solution: {
        lang: 'js',
        code: `function createBankAccount(initial = 0) {\n  let balance = initial      // private — no direct access\n  return {\n    deposit(amount) { balance += amount; return balance },\n    withdraw(amount) {\n      if (amount > balance) throw new Error('Insufficient funds')\n      balance -= amount\n      return balance\n    },\n    balance() { return balance },\n  }\n}\n\nconst acct = createBankAccount(100)\nacct.deposit(50)   // 150\nacct.withdraw(30)  // 120\nacct.balance       // the function; acct.balance() → 120\n// no way to do acct.balance = 999999`,
        explanation: [
          '`balance` lives only in the closure shared by the three methods.',
          'All methods close over the same `balance`, so they stay consistent.',
          'There is no property to assign to from outside — true privacy via closure (the module pattern).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Closures are the single most foundational JavaScript concept after the basics — understanding them unlocks scope, the module pattern, functional utilities, and modern framework internals. If you truly get closures, most "hard" JS questions become easy.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition plus the var-loop bug. Product companies (Zoho, Flipkart, Razorpay) ask you to implement once/memoize/debounce from scratch. FAANG-level interviews probe the engine, GC implications, and stale-closure bugs in React.',
    whatInterviewersExpect:
      'They expect you to define it precisely (function + lexical environment), demonstrate it with a persistence example, explain the var/let loop behavior and WHY, and ideally connect it to a real pattern you have used and to the memory/GC model.',
  },
}

export default closure
