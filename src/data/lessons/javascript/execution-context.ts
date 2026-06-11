import type { ConceptLesson } from '../../../types/lesson'

const executionContext: ConceptLesson = {
  // 1. Concept Summary
  slug: 'execution-context',
  name: 'Execution Context',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Execution context is the runtime "environment" every line of JS runs inside — it is the single mental model that explains hoisting, scope, this, and the call stack at once.',
    'Without understanding it, hoisting, the temporal dead zone, and "why is this undefined?" feel like random rules instead of consequences of one process.',
    'It is the foundation for closures: a closure works because a function keeps a reference to the variable environment of the context it was defined in.',
    'Interviewers use it to test whether you understand HOW JS runs code, not just what the code outputs.',
    'Debugging async bugs, stack traces, and "this lost its binding" all become tractable once you can picture contexts being created and destroyed.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An execution context is a fresh desk set up each time you start a new task.',
    story: [
      'Imagine every time you start a homework task, you get a brand new desk with a name tag, a box for your supplies, and a note saying who you are working for.',
      'You put all the pencils and papers for THIS task on THIS desk, so they do not get mixed up with other tasks.',
      'When you finish the task, you clear the desk away completely, and go back to whatever desk you were using before.',
      'JavaScript does the same: every function call gets its own fresh desk (context) with its own variables and its own idea of "this", and clears it away when the function finishes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When JavaScript runs your code, it first creates a global environment — like opening the program.',
    'Every time a function is called, JavaScript makes a new little workspace just for that call, holding its variables, its arguments, and what "this" means.',
    'These workspaces stack on top of each other; the one on top is the one currently running.',
    'When a function finishes, its workspace is thrown away and the one underneath continues. This setup-and-teardown is the execution context lifecycle.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An execution context is the internal data structure the JS engine creates to run a piece of code (global code or a function call). It tracks the variable environment (its variables/functions), the scope chain, and the value of this.',
    how: 'There are two phases. In the creation phase the engine sets up the variable environment (hoisting declarations, allocating bindings, fixing this). In the execution phase it runs the code line by line, assigning values and calling functions (which create more contexts).',
    why: 'It explains hoisting, the temporal dead zone, scope, and this as outcomes of one model, and underpins the call stack and closures.',
    code: {
      label: 'Two phases: creation then execution',
      lang: 'js',
      code: "console.log(a) // undefined (var hoisted, not yet assigned)\n// console.log(b) // ReferenceError (let in temporal dead zone)\n\nvar a = 1\nlet b = 2\n\nfunction greet(name) {\n  // new execution context created on each call\n  return 'Hi ' + name\n}\nconsole.log(greet('Sam')) // 'Hi Sam'",
      explanation: [
        'During the creation phase of the GLOBAL context, var a is hoisted and initialized to undefined.',
        'let b is hoisted too but left uninitialized, so reading it early throws (temporal dead zone).',
        'In the execution phase, a becomes 1 and b becomes 2 as the lines run.',
        'Calling greet creates a NEW function execution context with its own name binding and this.',
        'When greet returns, its context is discarded.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An execution context is the abstract runtime container in which JavaScript code is evaluated. Each context has a LexicalEnvironment and a VariableEnvironment (each containing an Environment Record plus a reference to an outer environment, forming the scope chain) and a ThisBinding. Contexts are created for global code, each function invocation, and eval. They are managed on the call stack: a context is pushed when code begins executing and popped when it completes. Creation establishes bindings (hoisting var/function declarations, leaving let/const in the temporal dead zone) before execution evaluates statements.',

  // 7. Internal Working
  internalWorking: [
    'When the script starts, the engine creates the Global Execution Context, sets this to the global object (or undefined in module/strict code), and pushes it onto the call stack.',
    'Creation phase: the engine scans the code, creating the Environment Record — function declarations are hoisted fully, var bindings are created and initialized to undefined, and let/const bindings are created but left uninitialized (TDZ).',
    'The outer environment reference is set lexically (based on where the code is written), forming the scope chain used for variable lookup.',
    'Execution phase: statements run top to bottom; assignments populate bindings and expressions are evaluated.',
    'On a function call, a new Function Execution Context is created (its own variable environment, arguments object for non-arrow functions, and this binding) and pushed onto the stack.',
    'When the function returns, its context is popped; any bindings still referenced by a surviving inner function (a closure) remain alive on the heap instead of being discarded.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  Execution Context',
    '  ┌───────────────────────────────────────┐',
    '  │ LexicalEnvironment                      │',
    '  │   - Environment Record (let/const, fns) │',
    '  │   - outer ───────────────► (scope chain)│',
    '  │ VariableEnvironment                     │',
    '  │   - Environment Record (var)            │',
    '  │ ThisBinding ──► what `this` refers to   │',
    '  └───────────────────────────────────────┘',
    '',
    '  Phase 1 CREATION: hoist decls, fix this, link outer',
    '  Phase 2 EXECUTION: run statements, assign values',
  ].join('\n'),

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: each execution context is a frame on the call stack; entering a function pushes a frame, returning pops it.',
    'HEAP: the environment records (holding the variables) referenced by closures live on the heap so they can outlive the popped stack frame.',
    'REFERENCES: the outer-environment links form a chain from the current context up to global; variable lookup walks this chain.',
    'When a context is popped and nothing references its environment record, that record becomes eligible for garbage collection.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — global vs function context',
      lang: 'js',
      code: "var globalVar = 'G'\n\nfunction outer() {\n  var local = 'L'        // lives in outer()'s context\n  return globalVar + local\n}\n\nconsole.log(outer()) // 'GL'\n// console.log(local) // ReferenceError: not in global context",
      explanation: [
        'globalVar lives in the global execution context.',
        'Calling outer() creates a function context where local exists.',
        'outer() can see globalVar through its outer-environment link (scope chain).',
        'local is gone once outer() returns; the global context cannot see it.',
      ],
    },
    intermediate: {
      label: 'Intermediate — hoisting is a creation-phase effect',
      lang: 'js',
      code: "function demo() {\n  console.log(x)      // undefined (var hoisted in creation phase)\n  console.log(typeof fn) // 'function' (declaration hoisted)\n  var x = 10\n  function fn() {}\n  console.log(x)      // 10 (now in execution phase)\n}\ndemo()",
      explanation: [
        'In demo()\'s creation phase, var x is initialized to undefined and fn is fully hoisted.',
        'So reading x before its assignment gives undefined, and fn is already callable.',
        'During execution, x is assigned 10 when that line runs.',
        'Hoisting is not magic — it is just what the creation phase did before execution started.',
      ],
    },
    advanced: {
      label: 'Advanced — context, this, and arrow functions',
      lang: 'js',
      code: "const obj = {\n  value: 42,\n  regular() { return this.value },          // this = obj at call time\n  arrow: () => (typeof this === 'undefined' ? 'no this' : this),\n}\n\nconsole.log(obj.regular()) // 42 (this bound by call site)\nconst f = obj.regular\n// console.log(f()) // this is undefined (strict) -> error reading .value",
      explanation: [
        'Each function call sets up this in its execution context based on how it is called.',
        'obj.regular() binds this to obj; detaching it (f) loses that binding.',
        'Arrow functions do NOT create their own this; they inherit it from the enclosing context.',
        'this is a property of the execution context, decided at call time for normal functions.',
      ],
    },
    realProject: {
      label: 'Real project — why React/Vue handlers lose this and the fix',
      lang: 'js',
      code: "class Counter {\n  count = 0\n  // arrow method captures the instance's this via the enclosing context\n  increment = () => { this.count++ }\n  // regular method would lose this when passed as a callback\n  reset() { this.count = 0 }\n}\n\nconst c = new Counter()\nconst inc = c.increment\ninc()            // works: arrow kept this\nconst rst = c.reset\n// rst()         // breaks: this is undefined when called standalone",
      explanation: [
        'Passing a method as a callback creates a call where this is no longer the instance.',
        'A regular method relies on the call-site this, which is lost when detached.',
        'An arrow class field captures this from the surrounding context at definition, so it stays bound.',
        'This is exactly why React class handlers used bind/arrow fields and why understanding contexts matters in components.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is an execution context?',
      answer: 'It is the environment in which a piece of JS code runs. It holds the variable environment (its variables/functions), the scope chain (outer reference), and the value of this. One is created for global code and one per function call.',
      explanation: 'A strong answer lists the three parts and notes contexts are created per call.',
    },
    {
      level: 'beginner',
      question: 'How many types of execution context are there?',
      answer: 'Global execution context (one per program), function execution context (one per function call), and eval execution context (rarely used).',
      explanation: 'Naming the three and noting "one global, many function" shows the model is understood.',
    },
    {
      level: 'intermediate',
      question: 'What are the two phases of an execution context?',
      answer: 'The creation phase (set up the variable environment: hoist var/function declarations, leave let/const in the TDZ, fix this and the outer reference) and the execution phase (run the statements line by line).',
      explanation: 'Tying hoisting and TDZ to the creation phase is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'How does the execution context explain hoisting?',
      answer: 'During the creation phase, declarations are registered before any code runs: function declarations are fully available, var bindings exist initialized to undefined, and let/const exist but are uninitialized (TDZ). So hoisting is just the result of the creation phase.',
      explanation: 'Framing hoisting as a creation-phase outcome, not a separate rule, is what interviewers want.',
    },
    {
      level: 'advanced',
      question: 'How is this determined in an execution context?',
      answer: 'For normal functions, this is set when the context is created based on the call site (method call -> the object; plain call -> undefined in strict mode / global object otherwise; new -> the new instance; call/apply/bind -> the supplied value). Arrow functions do not create their own this and inherit it lexically.',
      explanation: 'Call-site binding plus the arrow exception is the complete answer.',
    },
    {
      level: 'senior',
      question: 'How do execution contexts relate to closures and memory?',
      answer: 'A function keeps a reference to the lexical environment of the context where it was defined. When that context is popped from the stack but its environment is still referenced by a surviving inner function, the environment record stays alive on the heap — that is a closure. If such references are long-lived, they keep memory alive and can leak.',
      explanation: 'Linking context teardown, heap retention, and closures is the senior-level connection.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between LexicalEnvironment and VariableEnvironment?',
    'When is the global context this the global object vs undefined?',
    'How does the creation phase produce the temporal dead zone?',
    'What happens to a context when its function returns?',
    'How does the execution context form the scope chain?',
    'Do arrow functions create their own execution context? (yes — but no own this/arguments)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking hoisting physically moves code to the top.',
      why: 'It implies a literal rewrite rather than the creation-phase registration of bindings.',
      fix: 'Explain that declarations are registered during the creation phase before execution, which only LOOKS like moving.',
    },
    {
      mistake: 'Assuming this is determined by where a function is defined.',
      why: 'For normal functions this is set at call time by the call site, not at definition.',
      fix: 'Remember: normal functions = call-site this; arrow functions = lexical this from the enclosing context.',
    },
    {
      mistake: 'Confusing the global object with the global execution context.',
      why: 'The global object (window/globalThis) is data; the global execution context is the runtime environment that includes the scope chain and this.',
      fix: 'Treat the context as the process running the code and the global object as one thing it references.',
    },
    {
      mistake: 'Expecting let/const to be undefined like var before assignment.',
      why: 'They are created in the creation phase but uninitialized (TDZ), so access throws.',
      fix: 'Access let/const only after their declaration line.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Understanding contexts explains why methods bound to events keep this, and why setup()/composables run in a fresh function context each time a component instance is created.' },
    { area: 'React', detail: 'Class component handlers losing this, and hooks capturing values from a render\'s execution context (stale closures), are direct consequences of how contexts and their environments work.' },
    { area: 'Node.js', detail: 'Each module runs in its own function-like context (CommonJS wrapper), and per-request handlers create contexts whose variables hold request-scoped state.' },
    { area: 'Backend', detail: 'Stack traces correspond to the chain of active execution contexts; understanding push/pop helps diagnose deep call chains and recursion limits.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Context creation is highly optimized; for normal code the overhead per call is negligible.',
      'Predictable creation/teardown lets engines reuse and inline simple functions effectively.',
    ],
    bad: [
      'Very deep call chains create many stacked contexts and can hit the maximum call stack size (stack overflow).',
      'Closures that retain environment records keep memory alive longer than the stack frame, a potential leak source.',
    ],
    optimizations: [
      'Convert deep recursion to iteration to avoid unbounded context stacking.',
      'Capture only needed variables in closures so retained environment records stay small.',
      'Avoid creating unnecessary functions (hence contexts) in hot loops/renders; hoist stable callbacks.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scope', 'hoisting', 'this-keyword'],
    nextConcepts: ['call-stack', 'scope-chain', 'lexical-environment', 'closure'],
    dependencyNote:
      'Execution context is the hub of the execution-model spine: it requires understanding scope, hoisting, and this, and it directly explains the call stack, the scope chain, lexical environments, and ultimately closures.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labeled "Global Execution Context" with three slots: VariableEnv, LexicalEnv, this.',
      'Show phase 1 (creation): write hoisted var = undefined and function decls into the slots.',
      'Show phase 2 (execution): fill the values as lines run.',
      'Call a function: draw a new context box on top, with its own slots.',
      'Pop it when it returns; say "stack of contexts = the call stack; the outer links = the scope chain."',
    ],
    diagram: [
      '  push ->  ┌ greet() ctx ┐  (own vars, this, outer link)',
      '           └─────────────┘',
      '  base     ┌ Global ctx  ┐  (var/fn hoisted, this=global)',
      '           └─────────────┘',
      '',
      '  creation phase  ->  execution phase  ->  pop on return',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'An execution context is the environment JS code runs in: a variable environment, the scope chain (outer reference), and a this binding. One global context plus one per function call live on the call stack. Each context has a creation phase (hoist var/function declarations, leave let/const in the TDZ, fix this) and an execution phase (run statements). This one model explains hoisting, scope, this, the call stack, and closures.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'An execution context is the internal environment the JavaScript engine builds to run a piece of code. There is one global execution context, and a new one is created for every function call. Each context has three key parts: a variable environment that holds its variables and functions, a reference to its outer environment which forms the scope chain, and a this binding. A context goes through two phases. First, the creation phase: the engine scans the code and sets up bindings before anything runs — function declarations are hoisted fully, var bindings are created and initialized to undefined, and let and const are created but left uninitialized, which is the temporal dead zone. It also fixes this and links the outer environment lexically. Second, the execution phase runs the statements top to bottom, assigning values and calling functions, each of which pushes a new context. Contexts live on the call stack: pushed on entry, popped on return. This single model is powerful because it explains so much at once: hoisting and the TDZ are creation-phase effects, scope and the scope chain come from the outer links, this comes from the call site, and closures happen because a returned function keeps a reference to the environment of the context it was defined in, keeping it alive on the heap even after that context is popped.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'The spec-level model (LexicalEnvironment vs VariableEnvironment) is precise but engines optimize aggressively, so the mental model and the machine reality diverge for performance.',
      'Per-call context creation gives clean isolation but means heavy recursion can exhaust the stack; iteration trades clarity for safety at depth.',
    ],
    edgeCases: [
      'let/const share LexicalEnvironment while var lives in VariableEnvironment, which is why with/eval and block scoping interact subtly.',
      'Arrow functions create a context but reuse the enclosing this/arguments, causing "lost this" surprises when refactoring.',
      'Strict vs sloppy mode changes the global/standalone this (undefined vs global object).',
      'eval and the deprecated with statement can mutate the variable environment dynamically, defeating optimizations.',
    ],
    runtimeBehavior: [
      'Creation phase registers bindings before any statement executes, producing hoisting and TDZ behavior.',
      'Variable resolution walks the outer-environment chain from the current context to global.',
      'Returning pops the context, but referenced environment records persist on the heap (closures).',
    ],
    scalability: [
      'Deep or unbounded recursion stacks contexts until the engine throws RangeError; convert to iteration or trampolining.',
      'Long-lived closures over large environment records scale memory poorly; capture minimal state.',
    ],
    productionConcerns: [
      'Stack traces mirror the active context chain; understanding push/pop speeds up debugging async and recursive failures.',
      '"Stale closure" bugs in React stem from a callback capturing a past render context — manage with deps/refs.',
      'Memory leaks from retained environment records (timers/listeners) are a common incident; ensure cleanup.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Execution context = environment code runs in.',
    'Parts: VariableEnvironment, LexicalEnvironment (scope chain), ThisBinding.',
    'Types: 1 global, 1 per function call, eval (rare).',
    'Two phases: creation (hoist + this + outer) then execution (run).',
    'var -> hoisted to undefined; let/const -> hoisted but TDZ.',
    'Function declarations are fully hoisted; expressions are not.',
    'this for normal functions = call site; arrows inherit lexical this.',
    'Contexts live on the call stack: push on call, pop on return.',
    'Outer links between contexts form the scope chain.',
    'Closure = function keeping its definition context alive after pop.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output and explain via the creation phase: console.log(x); var x = 5; console.log(x);',
      hint: 'var is hoisted and initialized to undefined in the creation phase.',
      solution: {
        lang: 'js',
        code: "console.log(x) // undefined\nvar x = 5\nconsole.log(x) // 5",
        explanation: [
          'During creation, var x is registered and set to undefined.',
          'The first log runs in the execution phase before the assignment, so it prints undefined.',
          'After x = 5 runs, the second log prints 5.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Explain why this logs throws/undefined: const o = { v: 1, get() { return this.v } }; const g = o.get; g();',
      hint: 'this is set by the call site of the execution context.',
      solution: {
        lang: 'js',
        code: "'use strict'\nconst o = { v: 1, get() { return this.v } }\nconst g = o.get\n// g() -> this is undefined in strict mode -> reading .v throws\nconsole.log(o.get()) // 1 (called as a method, this = o)",
        explanation: [
          'o.get() sets this to o because of the method call site.',
          'g() is a plain call, so in strict mode this is undefined and this.v throws.',
          'this is a property of the execution context fixed at call time for normal functions.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show how a returned inner function keeps its defining context alive (a closure) and explain in terms of contexts.',
      hint: 'The inner function references a variable from the outer context after it returns.',
      solution: {
        lang: 'js',
        code: "function makeId() {\n  let n = 0            // lives in makeId's context\n  return function () { return ++n }\n}\nconst next = makeId()\nconsole.log(next(), next(), next()) // 1 2 3",
        explanation: [
          'makeId() creates a context whose environment holds n.',
          'The returned function references n, so when makeId returns, its environment record is not discarded.',
          'It stays alive on the heap and each next() call resolves the same n via the retained outer link.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Predict outputs and justify each via execution-context phases: function f(){ console.log(a, typeof g); var a = 1; function g(){} let b; console.log(a, b); } f();',
      hint: 'Separate creation-phase setup from execution-phase assignments.',
      solution: {
        lang: 'js',
        code: "function f() {\n  console.log(a, typeof g) // undefined 'function'\n  var a = 1\n  function g() {}\n  let b\n  console.log(a, b)        // 1 undefined\n}\nf()",
        explanation: [
          'Creation phase: a -> undefined, g -> fully hoisted function, b -> TDZ (but only read after declaration here).',
          'First log: a is undefined, typeof g is "function".',
          'Execution phase assigns a = 1; b is declared with no initializer so it is undefined.',
          'Second log prints 1 undefined.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Execution context is the unifying model behind hoisting, scope, this, the call stack, and closures. Master it and a huge swath of "tricky" JS questions collapse into one consistent explanation.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the definition and the two phases, often paired with a hoisting output question. Product companies (Zoho, Flipkart, Razorpay) probe this binding and closures via output prediction. FAANG-level interviews dig into LexicalEnvironment vs VariableEnvironment, TDZ mechanics, and how contexts relate to GC and stale closures.',
    whatInterviewersExpect:
      'You can define the context and its three parts, explain creation vs execution phases, connect them to hoisting/TDZ/this, and trace how contexts push/pop on the call stack and survive as closures.',
  },
}

export default executionContext
