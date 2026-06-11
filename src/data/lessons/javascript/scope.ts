import type { ConceptLesson } from '../../../types/lesson'

const scope: ConceptLesson = {
  // 1. Concept Summary
  slug: 'scope',
  name: 'Scope',
  category: 'execution-model',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Scope decides where a variable is visible — it is the rule that prevents your variables from clashing across the whole program.',
    'Almost every "x is not defined" or "x is undefined" bug is a scope question in disguise.',
    'It is the prerequisite for closures, modules, the scope chain, and understanding var vs let/const.',
    'Good scoping is how you avoid global pollution and accidental shared state — a real source of bugs in large apps.',
    'Interviewers ask it because it reveals whether you understand how JS organizes and isolates data.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Scope is which rooms of a house you are allowed to use things in.',
    story: [
      'Imagine your toys in your bedroom: you can play with them in your room, and also when you bring them into the living room.',
      'But a toy you keep only in your bedroom cannot be seen by someone sitting in the kitchen — it is out of their reach.',
      'Things in the living room (the shared space) can be used from any room, because everyone passes through it.',
      'In JavaScript, each function or block is like a room: variables made inside it can be used there and in rooms inside it, but not from the outside.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Scope is the part of the program where a variable can be used.',
    'A variable made inside a function or a { } block only exists there; code outside cannot see it.',
    'Inner areas can use variables from the areas around them, but outer areas cannot reach inside.',
    'There is also a global area that everyone can see — but putting too much there is messy and causes clashes.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Scope is the set of rules that determines where in your code a given variable (binding) is accessible. JavaScript has global scope, function scope, and block scope.',
    how: 'When you declare a variable, it belongs to the nearest enclosing scope: var attaches to the nearest function (or global) scope, while let and const attach to the nearest block ({ }). Code can read variables in its own scope and any enclosing scope, but not in sibling or inner scopes.',
    why: 'Scope isolates data so names do not collide, keeps variables alive only as long as needed, and makes closures and modules possible.',
    code: {
      label: 'Function vs block scope',
      lang: 'js',
      code: "let g = 'global'\n\nfunction fn() {\n  let f = 'function'\n  if (true) {\n    let b = 'block'\n    var v = 'function-scoped' // var ignores the block\n    console.log(g, f, b, v) // all visible here\n  }\n  console.log(v)  // 'function-scoped' (var leaked out of the block)\n  // console.log(b) // ReferenceError: b is block-scoped\n}\nfn()\n// console.log(f) // ReferenceError: f is function-scoped",
      explanation: [
        'g is global, visible everywhere.',
        'f is function-scoped to fn; outside fn it does not exist.',
        'b is block-scoped to the if block; outside the block it is gone.',
        'v uses var, which ignores the block and is scoped to the whole function — note it leaks out of the if.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Scope is the region of a program in which a particular binding (variable, function, or parameter) is accessible. JavaScript uses lexical (static) scope: a binding\'s accessibility is determined by where it is written in the source, not where it is called. There are three scope kinds: global scope (program-wide), function scope (the body of a function, which is where var and function declarations live), and block scope (any { } region, where let and const live). Inner scopes can resolve bindings from enclosing scopes via the scope chain, but enclosing scopes cannot access bindings declared in inner scopes.',

  // 7. Internal Working
  internalWorking: [
    'When the engine creates an execution context, it builds an environment record listing the bindings declared in that scope.',
    'During the creation phase, var/function declarations are registered in the nearest function (or global) environment; let/const are registered in the nearest block environment but left uninitialized (TDZ).',
    'Each environment record holds a reference to its outer (lexically enclosing) environment, set based on where the code is written.',
    'To resolve an identifier, the engine looks in the current scope\'s record; if not found, it follows the outer reference up the chain until it finds the binding or reaches global.',
    'If the identifier is found nowhere, reading it throws a ReferenceError (or, for an assignment in sloppy mode, accidentally creates a global).',
    'When a scope\'s execution context is popped, its bindings are released unless still referenced by a surviving inner function (a closure).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  GLOBAL scope { g }',
    '    │  can see: g',
    '    ▼',
    '  function fn() scope { f }',
    '      │  can see: f, g',
    '      ▼',
    '    if block scope { b }',
    '        can see: b, f, g',
    '',
    '  Lookup walks OUTWARD: inner -> outer -> global',
    '  (never inward: outer cannot see inner bindings)',
  ].join('\n'),

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — inner can see outer, not vice versa',
      lang: 'js',
      code: "const outerVar = 'outer'\nfunction inner() {\n  const innerVar = 'inner'\n  console.log(outerVar) // 'outer' (visible)\n  console.log(innerVar) // 'inner'\n}\ninner()\n// console.log(innerVar) // ReferenceError",
      explanation: [
        'inner() can read outerVar because the global scope encloses it.',
        'innerVar is local to inner() and invisible outside.',
        'Lookup goes outward (inner -> global), never inward.',
      ],
    },
    intermediate: {
      label: 'Intermediate — var vs let in a loop',
      lang: 'js',
      code: "const fns = []\nfor (var i = 0; i < 3; i++) {\n  fns.push(() => i) // all close over the SAME function-scoped i\n}\nconsole.log(fns.map((f) => f())) // [3, 3, 3]\n\nconst fns2 = []\nfor (let j = 0; j < 3; j++) {\n  fns2.push(() => j) // each iteration: a NEW block-scoped j\n}\nconsole.log(fns2.map((f) => f())) // [0, 1, 2]",
      explanation: [
        'var i is function-scoped: there is one i shared by all closures, equal to 3 after the loop.',
        'let j is block-scoped and re-created each iteration, so each closure captures its own j.',
        'This is the classic demonstration of how scope kind changes behavior.',
        'It directly explains the most common closure interview question.',
      ],
    },
    advanced: {
      label: 'Advanced — shadowing and accidental globals',
      lang: 'js',
      code: "const x = 'global'\nfunction shadow() {\n  const x = 'local' // shadows the outer x within this scope\n  return x\n}\nconsole.log(shadow(), x) // 'local' 'global'\n\nfunction leak() {\n  'use strict'\n  // y = 5 // in strict mode: ReferenceError (no accidental global)\n}\nleak()",
      explanation: [
        'A local x shadows the global x inside shadow(); the outer x is unchanged.',
        'Shadowing resolves to the nearest binding in the scope chain.',
        'Without strict mode, assigning to an undeclared variable creates a global by accident.',
        'Strict mode turns that into a ReferenceError, preventing the leak.',
      ],
    },
    realProject: {
      label: 'Real project — module scope avoids globals (Vue/Node)',
      lang: 'js',
      code: "// counter.js — module scope keeps state private to this file\nlet count = 0 // not global; scoped to the module\n\nexport function increment() { count++; return count }\nexport function reset() { count = 0 }\n\n// other files import the functions but cannot touch `count` directly",
      explanation: [
        'In ES modules, top-level declarations are module-scoped, not global.',
        'count is encapsulated: importers use increment/reset but cannot mutate count directly.',
        'This is how Vue stores, composables, and Node modules avoid polluting the global namespace.',
        'Scope is the mechanism that gives modules their privacy.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is scope in JavaScript?',
      answer: 'Scope is the region of code where a variable is accessible. JS has global scope, function scope, and block scope, and lookups go from the current scope outward to enclosing scopes.',
      explanation: 'Listing the three scope kinds and the outward lookup direction is the complete beginner answer.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between function scope and block scope?',
      answer: 'Function scope means a variable is visible throughout the entire function (var, function declarations). Block scope means a variable is visible only within the nearest { } block (let, const).',
      explanation: 'Mapping var->function and let/const->block is exactly what is expected.',
    },
    {
      level: 'intermediate',
      question: 'Is JavaScript lexically or dynamically scoped?',
      answer: 'Lexically (statically) scoped: a variable\'s accessibility is determined by where it is written in the source, not where the function is called. This is why closures remember their definition environment.',
      explanation: 'Lexical scope is the foundation for closures; saying "where it is written, not called" nails it.',
    },
    {
      level: 'intermediate',
      question: 'What is variable shadowing?',
      answer: 'When an inner scope declares a variable with the same name as one in an outer scope, the inner one "shadows" the outer within that scope, so references resolve to the nearest binding.',
      explanation: 'Mentioning "nearest binding in the scope chain" connects it to lookup.',
    },
    {
      level: 'advanced',
      question: 'Why does the var-in-loop closure bug happen, in terms of scope?',
      answer: 'var is function-scoped, so the loop creates a single shared binding that all callbacks close over; by the time they run, it holds the final value. let is block-scoped and creates a fresh binding per iteration, so each callback captures a distinct value.',
      explanation: 'Framing the bug purely as a scope-kind difference is the strong answer.',
    },
    {
      level: 'senior',
      question: 'How does scope relate to memory and closures?',
      answer: 'Each scope has an environment record; when its context is popped, the record is freed unless an inner function still references it (a closure), which keeps it alive on the heap. So scope both isolates data and, via closures, can extend a binding\'s lifetime beyond its scope\'s execution.',
      explanation: 'Linking scope to environment records, GC, and closures is the senior-level connection.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between scope and the scope chain?',
    'Why is polluting the global scope considered bad?',
    'How does strict mode change scope behavior (accidental globals)?',
    'What is the temporal dead zone and how does it relate to block scope?',
    'How do modules create their own scope?',
    'Can an outer scope ever access an inner scope variable? (no, not directly)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming var respects block scope.',
      why: 'var is function-scoped, so it leaks out of if/for blocks, causing surprising visibility and the loop-closure bug.',
      fix: 'Prefer let/const, which are block-scoped, for predictable behavior.',
    },
    {
      mistake: 'Creating accidental globals by assigning to undeclared variables.',
      why: 'In sloppy mode, x = 5 without declaration creates a global, polluting shared state.',
      fix: 'Use strict mode / modules (strict by default) and always declare with let/const.',
    },
    {
      mistake: 'Expecting outer code to read an inner function/block variable.',
      why: 'Scope lookup only goes outward; outer scopes cannot see inner bindings.',
      fix: 'Return or expose the value explicitly if the outer scope needs it.',
    },
    {
      mistake: 'Unintentional shadowing hiding an outer variable.',
      why: 'Reusing a name in an inner scope silently resolves to the inner one, which can mask bugs.',
      fix: 'Use distinct names and enable lint rules (no-shadow) to catch it.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables and setup() rely on function/module scope to keep reactive state private; block scope in template handlers prevents leaks across iterations.' },
    { area: 'React', detail: 'Each render creates a function scope; hooks capture variables from that scope, and block-scoped let/const avoid the loop-closure bug in event lists.' },
    { area: 'Node.js', detail: 'Each module has its own scope (no shared globals), which is how configuration and connection state stay encapsulated per file.' },
    { area: 'Backend', detail: 'Request handlers use function scope to hold per-request data so concurrent requests do not clobber each other\'s variables.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Proper scoping lets the engine free bindings promptly when a scope exits, reducing memory pressure.',
      'Local variable access (current scope) is faster than walking far up the chain or hitting global.',
    ],
    bad: [
      'Excessive global variables increase lookup cost and risk of collisions and retained memory.',
      'Deeply nested scopes mean identifier resolution may walk several environments (usually negligible, occasionally measurable in hot loops).',
    ],
    optimizations: [
      'Keep variables in the narrowest scope that works so they are freed early and lookups stay shallow.',
      'Avoid globals; use modules and closures for encapsulation.',
      'Cache repeated outer/global lookups in a local variable inside hot loops.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['var-let-const', 'execution-context'],
    nextConcepts: ['scope-chain', 'lexical-environment', 'closure', 'hoisting'],
    dependencyNote:
      'Scope is the foundation of the execution-model spine: it depends on understanding var/let/const and execution contexts, and it leads directly into the scope chain, lexical environments, hoisting, and closures.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three nested boxes: GLOBAL, then function, then block.',
      'Write a variable in each box (g, f, b).',
      'Draw arrows pointing OUTWARD to show lookup direction (inner can read outer).',
      'Cross out an arrow pointing inward and say "outer cannot see inner".',
      'Note var attaches to the function box, let/const to the block box.',
    ],
    diagram: [
      '  ┌ GLOBAL  g ─────────────────┐',
      '  │  ┌ function  f ──────────┐ │',
      '  │  │   ┌ block  b ───────┐ │ │',
      '  │  │   │ sees b, f, g    │ │ │',
      '  │  │   └─────────────────┘ │ │',
      '  │  └ sees f, g ────────────┘ │',
      '  └ sees g ────────────────────┘',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Scope is where a variable is accessible. JS has global, function (var), and block (let/const) scope, and it is lexical — visibility depends on where code is written, not where it runs. Inner scopes can read outer bindings by walking the scope chain outward; outer scopes cannot see inner ones. Misunderstanding var\'s function scope causes the loop-closure bug; prefer let/const for block scope and avoid global pollution.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Scope is the set of rules that decides where in your program a variable is accessible. JavaScript has three kinds: global scope, which is program-wide; function scope, the body of a function, which is where var and function declarations live; and block scope, any pair of curly braces, which is where let and const live. Crucially, JavaScript is lexically — or statically — scoped, meaning a variable\'s visibility is determined by where it is physically written in the source, not by where the function is later called. That is exactly why closures work: a function remembers the scope it was defined in. When the engine resolves an identifier, it looks in the current scope first, and if it does not find it, it walks outward through enclosing scopes up to global — but it never looks inward, so an outer scope can never see a variable declared in an inner one. The practical payoffs are big: scope isolates data so names do not collide, frees variables when a scope exits, and enables modules to keep state private. The classic gotcha is var being function-scoped rather than block-scoped, which leaks out of loops and blocks and causes the loop-closure bug where every callback shares one binding; using let gives a fresh block-scoped binding each iteration and fixes it. So I default to let and const, keep variables in the narrowest scope, and avoid polluting the global namespace.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Narrow scoping improves clarity and GC but can lead to prop/variable threading; broader scope is convenient but risks shared mutable state.',
      'Closures extend a binding\'s lifetime beyond its scope, trading memory retention for encapsulation and persistence.',
    ],
    edgeCases: [
      'var leaks out of blocks (function-scoped) while let/const respect the block, changing closure capture.',
      'Sloppy-mode assignment to an undeclared name creates a global; strict mode/modules throw instead.',
      'The temporal dead zone makes block-scoped bindings inaccessible before their declaration line.',
      'Shadowing can silently mask outer bindings and obscure bugs.',
    ],
    runtimeBehavior: [
      'Identifier resolution walks the outer-environment chain from current scope to global.',
      'let/const live in the LexicalEnvironment record; var lives in the VariableEnvironment record.',
      'A scope\'s bindings are freed on context pop unless retained by a closure.',
    ],
    scalability: [
      'Avoiding globals and using module scope keeps large codebases free of cross-file coupling and collisions.',
      'Hot loops can benefit from caching outer/global lookups locally to avoid repeated chain walks.',
    ],
    productionConcerns: [
      'Global pollution causes hard-to-trace collisions and retained memory across an app\'s lifetime.',
      'Accidental globals from missing declarations are a real bug source; enforce strict mode and linting.',
      'Per-request scoping on servers must be correct or concurrent requests can read each other\'s state.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Scope = where a variable is accessible.',
    'Kinds: global, function (var), block (let/const).',
    'JS is lexically scoped: where written, not where called.',
    'Lookup goes OUTWARD only: inner sees outer, not vice versa.',
    'var = function-scoped; let/const = block-scoped.',
    'Shadowing: inner name hides outer name within its scope.',
    'Accidental global: undeclared assignment in sloppy mode.',
    'Strict mode / modules prevent accidental globals.',
    'var-in-loop bug is a scope-kind problem -> use let.',
    'Closures keep a scope\'s bindings alive after it exits.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Will console.log(secret) work outside the function? Explain. function f(){ const secret = 42 }',
      hint: 'Where is secret declared and who can see it?',
      solution: {
        lang: 'js',
        code: "function f() { const secret = 42 }\nf()\n// console.log(secret) // ReferenceError: secret is not defined",
        explanation: [
          'secret is function-scoped to f.',
          'Outside f the binding does not exist, so accessing it throws a ReferenceError.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict the output and explain via scope: { let a = 1; var b = 2 } console.log(typeof a, typeof b)',
      hint: 'let respects the block; var does not.',
      solution: {
        lang: 'js',
        code: "{ let a = 1; var b = 2 }\nconsole.log(typeof a, typeof b) // 'undefined' 'number'",
        explanation: [
          'a is block-scoped, so it does not exist outside the block -> typeof is "undefined".',
          'b uses var, which is function/global-scoped, so it leaks out and is 2 -> typeof "number".',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make this print 0,1,2 by changing only the declaration: for (var i=0;i<3;i++){ setTimeout(()=>console.log(i)) }',
      hint: 'Use a block-scoped declaration for a fresh binding per iteration.',
      solution: {
        lang: 'js',
        code: "for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i))\n}\n// 0, 1, 2",
        explanation: [
          'let is block-scoped, so each loop iteration creates a brand-new i.',
          'Each callback closes over its own i, so they print 0, 1, 2 instead of 3, 3, 3.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a private counter using scope so the count cannot be modified directly from outside.',
      hint: 'Keep the count in a function scope and expose only methods.',
      solution: {
        lang: 'js',
        code: "function makeCounter() {\n  let count = 0 // private to this scope\n  return {\n    inc() { return ++count },\n    get() { return count },\n  }\n}\nconst c = makeCounter()\nc.inc(); c.inc()\nconsole.log(c.get()) // 2\n// no direct access to count from outside",
        explanation: [
          'count lives in makeCounter\'s function scope and is not exposed directly.',
          'The returned methods close over count, so they can read/modify it while outside code cannot.',
          'This uses scope (via closure) to achieve true privacy.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Scope is the bedrock of how JavaScript organizes data. Understanding it makes "not defined"/"undefined" bugs, var-vs-let behavior, closures, and modules all click into place.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the definition and function-vs-block scope. Product companies (Zoho, Flipkart, Razorpay) give output-prediction snippets (var/let, shadowing, the loop bug). FAANG-level interviews probe lexical vs dynamic scope, environment records, and the scope-memory-closure relationship.',
    whatInterviewersExpect:
      'You can name the scope kinds, state that JS is lexically scoped, explain outward-only lookup and shadowing, map var/let/const to their scopes, and connect scope to closures and global-pollution avoidance.',
  },
}

export default scope
