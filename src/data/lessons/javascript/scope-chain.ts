import type { ConceptLesson } from '../../../types/lesson'

const scopeChain: ConceptLesson = {
  // 1. Concept Summary
  slug: 'scope-chain',
  name: 'Scope Chain',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The scope chain is the exact mechanism JavaScript uses to find a variable — it answers "which x does this refer to?"',
    'It explains why inner functions can use outer variables, which is the literal basis of closures.',
    'Misreading the chain is behind most "wrong value" and "is not defined" bugs, including shadowing surprises.',
    'It clarifies why lookups are lexical (based on where code is written), not dynamic (based on who called).',
    'Interviewers use it to verify you understand identifier resolution, not just that code "works".',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The scope chain is asking people in a line of rooms, "do you have my pencil?", from your room outward.',
    story: [
      'Imagine you need a pencil. You first look in your own room.',
      'If it is not there, you go to the room your room is inside of, and ask there.',
      'You keep stepping outward, room by room, until someone has the pencil — or until you reach the front hall and still find nothing.',
      'JavaScript finds variables the same way: it checks the current area first, then the area around it, then further out, until it finds the variable or runs out of rooms.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When JavaScript sees a variable name, it has to figure out which variable you mean.',
    'It starts in the current scope and checks if the name is there.',
    'If not, it looks in the scope that surrounds this one, then the one around that, and so on — this ordered search path is the scope chain.',
    'The search stops at the first match; if it reaches the global scope and finds nothing, you get a "not defined" error.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The scope chain is the ordered list of nested scopes the engine searches to resolve an identifier: current scope, then each enclosing (lexical) scope, up to global.',
    how: 'Each scope keeps a reference to its outer scope, fixed by where the code is written (lexical). When a name is referenced, the engine checks the current scope\'s bindings; if absent it follows the outer reference and repeats, stopping at the first match or throwing ReferenceError at the end.',
    why: 'It defines how variables are found, why inner functions see outer variables (closures), and why shadowing resolves to the nearest binding.',
    code: {
      label: 'Resolving a name up the chain',
      lang: 'js',
      code: "const a = 'global-a'\nfunction outer() {\n  const b = 'outer-b'\n  function inner() {\n    const c = 'inner-c'\n    console.log(c) // found in inner\n    console.log(b) // not in inner -> found in outer\n    console.log(a) // not in inner/outer -> found in global\n  }\n  inner()\n}\nouter()",
      explanation: [
        'inner\'s scope is searched first: c is found immediately.',
        'b is not in inner, so the engine follows the outer link to outer\'s scope and finds it.',
        'a is in neither inner nor outer, so the search continues to global and finds it.',
        'The chain is inner -> outer -> global, searched in that order.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The scope chain is the linked sequence of lexical environments the JavaScript engine traverses to resolve an identifier. Each execution context\'s environment holds an outer-environment reference pointing to the environment in which the code was lexically defined; together these references form a chain from the innermost scope up to the global scope. Identifier resolution proceeds from the current environment\'s record outward along this chain, returning the first matching binding; if none is found, a ReferenceError is thrown. Because the outer references are set by lexical position (definition site), the chain is static, which is the foundation of closures.',

  // 7. Internal Working
  internalWorking: [
    'When a function is defined, it stores an internal [[Environment]] reference to the lexical environment it was created in — this fixes its place in the scope chain.',
    'When the function is invoked, a new execution context is created whose lexical environment\'s outer reference is set to that captured [[Environment]] (not to the caller — scope is lexical, not dynamic).',
    'To resolve an identifier, the engine checks the current environment record for a matching binding.',
    'If not found, it follows the outer reference to the parent environment and searches its record, repeating outward.',
    'The first matching binding wins (this is how shadowing resolves to the nearest scope).',
    'If the global environment is reached without a match, the engine throws a ReferenceError (or, for an unguarded assignment in sloppy mode, creates a global).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  reference: console.log(b)',
    '',
    '  inner env   { c }          search 1: no b',
    '     │ outer',
    '     ▼',
    '  outer env   { b }          search 2: FOUND b  ✓ stop',
    '     │ outer',
    '     ▼',
    '  global env  { a }          (not reached)',
    '',
    '  resolution walks outward; first match wins',
  ].join('\n'),

  // 9. Memory Visualization
  memoryVisualization: [
    'Each environment record (current, outer, global) is an object; the outer references link them into a chain.',
    'A function object holds [[Environment]] pointing at the record where it was defined — this keeps that record reachable.',
    'If an inner function survives (closure), the whole chain it references stays alive on the heap, even after outer calls return.',
    'GC frees an environment record only when nothing in any live scope chain references it anymore.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — first match wins (shadowing)',
      lang: 'js',
      code: "const x = 'global'\nfunction f() {\n  const x = 'local'\n  return x // found in f's scope first -> 'local'\n}\nconsole.log(f(), x) // 'local' 'global'",
      explanation: [
        'Resolving x starts in f\'s scope and finds the local x immediately.',
        'The search stops at the first match, so the global x is never consulted inside f.',
        'This first-match rule is exactly what makes shadowing work.',
      ],
    },
    intermediate: {
      label: 'Intermediate — lexical, not dynamic',
      lang: 'js',
      code: "const value = 'defined-here'\nfunction child() { return value } // resolves via where it was DEFINED\n\nfunction parent() {\n  const value = 'caller-here'\n  return child() // does NOT see parent's value\n}\nconsole.log(parent()) // 'defined-here'",
      explanation: [
        'child resolves value through its definition-site chain (global), not its call-site (parent).',
        'Even though parent has its own value, child cannot see it.',
        'This proves JS scoping is lexical: the chain is based on where code is written.',
        'Dynamic scoping (rare in other languages) would have returned "caller-here".',
      ],
    },
    advanced: {
      label: 'Advanced — closures are the scope chain made persistent',
      lang: 'js',
      code: "function makeAdder(base) {\n  return function add(n) {\n    return base + n // base resolved via the retained chain\n  }\n}\nconst add10 = makeAdder(10)\nconsole.log(add10(5)) // 15\n// add's chain still points to makeAdder's environment holding base=10",
      explanation: [
        'add\'s [[Environment]] points to makeAdder\'s environment where base lives.',
        'After makeAdder returns, that environment stays alive because add references it.',
        'Resolving base walks add\'s scope chain to that retained environment.',
        'A closure is literally a function plus its still-reachable scope chain.',
      ],
    },
    realProject: {
      label: 'Real project — module-level config resolved by the chain (Node/Vue)',
      lang: 'js',
      code: "// config resolved through the module + global scope chain\nconst DEFAULTS = { retries: 3 }\n\nexport function createClient(overrides = {}) {\n  const options = { ...DEFAULTS, ...overrides } // DEFAULTS via module scope\n  return {\n    call() { return `retries=${options.retries}` }, // options via closure chain\n  }\n}\nconsole.log(createClient({ retries: 5 }).call()) // retries=5",
      explanation: [
        'DEFAULTS is found via the module scope on the chain.',
        'The returned call() resolves options through its retained chain to createClient\'s scope.',
        'This is the everyday shape of factories/composables: inner functions resolving outer config via the chain.',
        'Understanding the chain explains why each client keeps its own options.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the scope chain?',
      answer: 'It is the ordered path of nested scopes the engine searches to resolve a variable: the current scope first, then each enclosing scope, up to global, stopping at the first match.',
      explanation: 'Naming the outward search order and "first match" is the core.',
    },
    {
      level: 'beginner',
      question: 'What happens if a variable is not found anywhere in the chain?',
      answer: 'Reading it throws a ReferenceError. In sloppy mode, assigning to an undeclared name instead creates a global variable.',
      explanation: 'Covering both the read (error) and the sloppy-mode assignment edge is thorough.',
    },
    {
      level: 'intermediate',
      question: 'Is the scope chain based on where a function is defined or where it is called?',
      answer: 'Where it is defined — JavaScript uses lexical (static) scope. A function\'s outer reference is its definition environment, not its caller.',
      explanation: 'Definition-site vs call-site is the crux; it underpins closures.',
    },
    {
      level: 'intermediate',
      question: 'How does the scope chain explain shadowing?',
      answer: 'Because resolution returns the first match while walking outward, a binding in a nearer scope shadows one with the same name in an outer scope.',
      explanation: 'Tying shadowing to first-match traversal shows mechanism-level understanding.',
    },
    {
      level: 'advanced',
      question: 'How is the scope chain related to closures?',
      answer: 'A closure is a function that retains its scope chain after the outer context returns. The function\'s [[Environment]] keeps the outer environment reachable, so resolving outer variables still works via that retained chain.',
      explanation: 'Closures = persistent scope chain; this is the key connection.',
    },
    {
      level: 'senior',
      question: 'What are the performance and memory implications of the scope chain?',
      answer: 'Resolution cost grows with chain depth (usually negligible, but measurable in hot loops hitting far/global scopes). Memory-wise, a retained chain (closure) keeps all referenced environment records alive, so capturing large outer scopes can leak. Engines optimize via caching and escape analysis but conservative cases retain more.',
      explanation: 'Discussing lookup cost plus retained-environment memory is senior-level.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between scope and the scope chain?',
    'What is the difference between lexical and dynamic scoping?',
    'How does the global scope sit at the end of the chain?',
    'Why can two functions in the same scope share variables via the chain?',
    'How does the scope chain affect variable lookup performance?',
    'What is [[Environment]] and how does it fix a function\'s place in the chain?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking a function resolves variables from its caller\'s scope.',
      why: 'JS is lexically scoped; the chain is set by definition site, not call site.',
      fix: 'Trace the chain by where the function is written, ignoring who calls it.',
    },
    {
      mistake: 'Assuming an outer scope can reach into an inner scope via the chain.',
      why: 'The chain only goes outward; there is no inward link.',
      fix: 'Expose inner values explicitly (return them) if the outer scope needs them.',
    },
    {
      mistake: 'Forgetting that the first match wins, causing accidental shadowing.',
      why: 'A nearer same-named binding hides the intended outer one silently.',
      fix: 'Use distinct names and a no-shadow lint rule.',
    },
    {
      mistake: 'Repeatedly resolving a far/global variable inside a hot loop.',
      why: 'Each access walks the chain; deep/global lookups add (small) overhead per iteration.',
      fix: 'Hoist the value into a local variable before the loop.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables resolve refs and helpers through their retained scope chain; nested handlers find outer reactive state via the chain rather than props drilling.' },
    { area: 'React', detail: 'Event handlers and effects resolve props/state via the closure scope chain of the render they were created in — the basis of (and the cause of stale) closures.' },
    { area: 'Node.js', detail: 'Module and global scopes form the outer links of every function\'s chain, so config/constants are found without passing them everywhere.' },
    { area: 'Backend', detail: 'Factory functions return handlers that resolve injected dependencies through the chain, a closure-based dependency-injection pattern.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Local (current-scope) resolution is the fastest path; well-scoped code keeps hot lookups shallow.',
      'Engines cache resolutions and inline accesses, so typical chain walks are negligible.',
    ],
    bad: [
      'Deep nesting plus frequent far/global lookups in hot loops can add measurable overhead.',
      'Retained chains (closures over large scopes) keep environment records alive, risking memory bloat.',
    ],
    optimizations: [
      'Hoist repeatedly used outer/global values into locals inside hot loops.',
      'Keep scopes shallow and capture only the minimal variables in closures.',
      'Clean up long-lived closures (listeners/timers) so their retained chains are released.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scope', 'lexical-environment', 'execution-context'],
    nextConcepts: ['closure', 'hoisting', 'this-keyword'],
    dependencyNote:
      'The scope chain is the resolution mechanism built on scopes and lexical environments within execution contexts. Understanding it is the direct prerequisite for closures, and it clarifies hoisting and how this differs (this is not resolved via the scope chain).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three stacked environments: inner, outer, global, with an outer arrow linking each up.',
      'Pick a variable referenced in inner that lives in outer.',
      'Trace the search: check inner (miss), follow outer link, check outer (hit), stop.',
      'Emphasize the links are set by where code is WRITTEN (lexical), not who called.',
      'Say: "A closure is just this chain kept alive after the outer call returns."',
    ],
    diagram: [
      '  inner  { } ──outer──► outer { x } ──outer──► global { }',
      '    │                       ▲',
      '    └ lookup x: miss ───────┘ hit (stop)',
      '',
      '  links fixed lexically (definition site)',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The scope chain is the ordered path the engine searches to resolve a variable: current scope, then each enclosing scope, up to global, stopping at the first match (or ReferenceError). The links are set lexically — by where code is written, not who called it — which is why inner functions see outer variables and why closures work. First-match traversal is also what makes shadowing resolve to the nearest binding.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The scope chain is the mechanism JavaScript uses to figure out which variable a name refers to. Every scope keeps a reference to its outer scope, and those references link together into a chain that runs from the innermost scope all the way out to global. When the engine encounters an identifier, it looks in the current scope first; if it does not find a binding there, it follows the outer reference to the enclosing scope and searches again, repeating outward until it finds the first match — and the first match wins, which is precisely why shadowing works. If it reaches global without finding anything, reading the name throws a ReferenceError. The critical detail is that these outer links are fixed lexically: they point to where a function was defined, not where it was called. A function stores an internal reference, [[Environment]], to its definition environment, so its position in the chain is set at definition time. That is the foundation of closures: when an inner function outlives its outer call, it still holds onto that chain, keeping the outer environment alive on the heap so it can keep resolving those variables. So the scope chain explains three things at once — how variables are found, why inner functions can use outer ones, and why closures remember their data. Practically, it also has a small performance angle: deep or repeated far/global lookups in hot loops cost a bit, so I sometimes hoist them into locals.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Relying on the chain (outer/module scope) reduces parameter threading but increases coupling to surrounding scope and hampers testability.',
      'Closures persist the chain for encapsulation, trading memory retention for not needing classes/globals.',
    ],
    edgeCases: [
      'Lexical vs dynamic: the chain follows definition site, surprising those expecting caller-based resolution.',
      'this is NOT resolved via the scope chain — it is set per call, a common point of confusion.',
      'Sloppy-mode undeclared assignment creates a global instead of erroring at the end of the chain.',
      'with and eval can alter the chain dynamically, defeating engine optimizations.',
    ],
    runtimeBehavior: [
      'Resolution returns the first matching binding while walking outward; depth determines worst-case lookup cost.',
      'A function\'s [[Environment]] is captured at definition and reused for every invocation.',
      'Retained chains (closures) keep all referenced environment records reachable for GC purposes.',
    ],
    scalability: [
      'Shallow, well-organized scopes keep resolution cheap across large codebases.',
      'Capturing minimal variables in closures prevents large retained chains from bloating memory at scale.',
    ],
    productionConcerns: [
      'Long-lived closures (listeners/timers) holding big chains are a frequent memory-leak source; ensure cleanup.',
      'Accidental shadowing causes subtle wrong-value bugs; enforce linting.',
      'Avoid with/eval, which break the static chain and the optimizations that depend on it.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Scope chain = ordered scopes searched to resolve a name.',
    'Order: current -> enclosing -> ... -> global.',
    'First match wins (this is shadowing).',
    'Links are lexical: definition site, not call site.',
    'Function stores [[Environment]] to its definition scope.',
    'Not found at the end -> ReferenceError (read) / global (sloppy assign).',
    'Inner sees outer; outer never sees inner.',
    'Closures = the chain kept alive after the outer call returns.',
    'this is NOT resolved via the scope chain.',
    'Hot loops: hoist far/global lookups into locals.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Trace where each variable is found: const a=1; function f(){ const b=2; return a+b } f()',
      hint: 'Search f first, then global.',
      solution: {
        lang: 'js',
        code: "const a = 1\nfunction f() {\n  const b = 2\n  return a + b // b from f, a from global\n}\nf() // 3",
        explanation: [
          'b is found in f\'s own scope.',
          'a is not in f, so the chain is followed outward to global where a lives.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict the output and explain via lexical scope: const v="g"; function child(){return v} function parent(){const v="p"; return child()} parent()',
      hint: 'child resolves via where it was defined.',
      solution: {
        lang: 'js',
        code: "const v = 'g'\nfunction child() { return v }\nfunction parent() { const v = 'p'; return child() }\nconsole.log(parent()) // 'g'",
        explanation: [
          'child\'s chain points to its definition scope (global), not to parent.',
          'So v resolves to the global "g", not parent\'s "p" — proving lexical scoping.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why two functions returned from the same factory share the same outer variable via the chain.',
      hint: 'Both capture the same outer environment.',
      solution: {
        lang: 'js',
        code: "function makePair() {\n  let shared = 0\n  return {\n    inc() { return ++shared },\n    get() { return shared },\n  }\n}\nconst p = makePair()\np.inc(); p.inc()\nconsole.log(p.get()) // 2",
        explanation: [
          'Both inc and get have [[Environment]] pointing at the SAME makePair environment.',
          'Resolving shared in either function walks to that one environment record.',
          'So they read/write the same binding — shared state via one retained chain.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Given deeply nested scopes, explain how identifier resolution and shadowing interact, with code.',
      hint: 'Place the same name at multiple levels and resolve from the innermost.',
      solution: {
        lang: 'js',
        code: "const n = 'global'\nfunction a() {\n  const n = 'a'\n  function b() {\n    const n = 'b'\n    return n // innermost wins\n  }\n  return [b(), n]\n}\nconsole.log(a(), n) // ['b', 'a'] 'global'",
        explanation: [
          'Inside b, n resolves to b\'s own n first (first match), shadowing a\'s and global\'s n.',
          'Inside a (but outside b), n resolves to a\'s n.',
          'At the top level, n is the global one — each reference resolves to the nearest binding on its chain.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The scope chain is the precise answer to "how does JS find a variable?". Mastering it demystifies closures, shadowing, lexical scope, and a whole class of wrong-value bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the definition and the search order. Product companies (Zoho, Flipkart, Razorpay) give nested-scope output-prediction and lexical-vs-dynamic questions. FAANG-level interviews probe [[Environment]], closures as retained chains, and the memory/performance implications of deep or captured chains.',
    whatInterviewersExpect:
      'You can describe the outward, first-match search, state that links are lexical (definition site), explain shadowing via traversal, and connect the chain to closures and to lookup cost/memory.',
  },
}

export default scopeChain
