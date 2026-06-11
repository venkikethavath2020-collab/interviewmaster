import type { ConceptLesson } from '../../../types/lesson'

const lexicalEnvironment: ConceptLesson = {
  // 1. Concept Summary
  slug: 'lexical-environment',
  name: 'Lexical Environment',
  category: 'execution-model',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The lexical environment is the actual data structure that stores your variables — it is what scope and the scope chain are made of.',
    'It is the precise, spec-level answer to "where do closures keep their captured variables?"',
    'It explains hoisting and the temporal dead zone as states of bindings inside an environment record.',
    'Knowing it lets you reason about memory: closures keep environment records alive on the heap.',
    'Interviewers use it to separate people who can describe JS at the engine/spec level from those who only know surface behavior.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A lexical environment is a labeled box of your stuff plus a note saying which bigger box it sits inside.',
    story: [
      'Imagine every room has a box that holds the things made in that room, with each thing labeled by name.',
      'On the box there is also a sticky note that says "this room is inside the kitchen", pointing to the next box out.',
      'If you cannot find your thing in your box, you read the note and go look in the box it points to.',
      'A lexical environment is exactly that: a box of named things, plus a pointer to the box around it — and JavaScript follows those pointers to find variables.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When JavaScript runs a piece of code, it makes a container to hold that code\'s variables, with each variable stored by its name.',
    'That container also remembers which container is its "parent" — the one around it in the code.',
    'To find a variable, JavaScript looks in the current container, and if it is not there, it follows the parent pointer to the next container.',
    'This named container plus its parent pointer is called a lexical environment, and it is the building block of scope.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A lexical environment is the internal structure that holds the bindings (variables, functions, parameters) declared in a particular scope, together with a reference to the outer lexical environment it is nested in.',
    how: 'It has two parts: an Environment Record (a map of binding names to values for this scope) and an outer reference (a pointer to the enclosing lexical environment). New environments are created for the global code, each function call, and each block; the outer reference is set based on where the code is written (lexical).',
    why: 'It is the concrete mechanism behind scope, the scope chain (the outer references), hoisting/TDZ (binding states in the record), and closures (a function captures its defining environment).',
    code: {
      label: 'Record + outer reference',
      lang: 'js',
      code: "const top = 1\nfunction outer() {\n  const mid = 2\n  function inner() {\n    const low = 3\n    return top + mid + low\n  }\n  return inner()\n}\nconsole.log(outer()) // 6\n// inner's environment record = { low: 3 }, outer-> outer's env { mid: 2 }, outer-> global { top: 1 }",
      explanation: [
        'Each function call creates a lexical environment with its own record.',
        'inner\'s record holds { low }, and its outer reference points to outer\'s environment.',
        'outer\'s record holds { mid }, with an outer reference to the global environment holding { top }.',
        'Resolving top + mid + low walks the outer references until each name is found.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A lexical environment is a specification-level structure used to define the association of identifiers to specific variables and functions based on the lexical nesting of code. It consists of an Environment Record (which stores the bindings created within its scope) and a reference to an outer lexical environment (null for the global environment). The engine creates lexical environments for the global execution context, each function invocation, and each block. Identifier resolution consults the current Environment Record and, on a miss, follows the outer reference recursively — the chain of these references is the scope chain. A function value captures the lexical environment in which it was defined via its internal [[Environment]] slot, which is the basis of closures.',

  // 7. Internal Working
  internalWorking: [
    'On entering an execution context, the engine creates a LexicalEnvironment (for let/const, function declarations, block bindings) and a VariableEnvironment (for var bindings); both have an Environment Record and an outer reference.',
    'During the creation phase, declarations populate the record: var/function are initialized (var to undefined, functions to the function object) while let/const are recorded but marked uninitialized (the temporal dead zone).',
    'Each block ({ }) that declares let/const/class creates a new declarative Environment Record whose outer reference is the surrounding environment.',
    'The outer reference is fixed lexically — it points to the environment where the code is written, captured in the function\'s [[Environment]] at definition time.',
    'Identifier resolution checks the current Environment Record; on a miss it follows the outer reference up the chain to global, returning the first binding found.',
    'When the context is popped, its environment is released unless still referenced (e.g. by a closure\'s [[Environment]]), in which case the record persists on the heap.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  Lexical Environment',
    '  ┌──────────────────────────────┐',
    '  │ Environment Record            │',
    '  │   name -> value bindings      │',
    '  │   (var=undefined, let=TDZ,    │',
    '  │    fn=function object)        │',
    '  ├──────────────────────────────┤',
    '  │ outer ───────────────────────┼──► enclosing Lexical Environment',
    '  └──────────────────────────────┘            (null at global)',
    '',
    '  chain of outer refs = the scope chain',
  ].join('\n'),

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: while a context runs, its lexical environment is associated with the active stack frame.',
    'HEAP: Environment Records that are captured by a function (closure) live on the heap so they survive the frame being popped.',
    'REFERENCES: a function object holds [[Environment]] -> the record where it was defined; the record holds outer -> the next record, forming a reachable chain.',
    'GC: a record is collected only when no live [[Environment]] or outer reference reaches it; long-lived closures keep records (and their captured values) alive.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a block creates a new environment',
      lang: 'js',
      code: "let a = 'outer'\n{\n  let a = 'inner' // new block environment record with its own a\n  console.log(a) // 'inner'\n}\nconsole.log(a) // 'outer'",
      explanation: [
        'The { } block creates a new lexical environment with its own record.',
        'The inner a is a separate binding from the outer a.',
        'Inside the block, a resolves to the block record; outside, to the outer environment.',
        'let/const are what make blocks create these declarative records.',
      ],
    },
    intermediate: {
      label: 'Intermediate — TDZ is an uninitialized binding state',
      lang: 'js',
      code: "function demo() {\n  // the binding `v` already exists in the record here, but is uninitialized\n  // console.log(v) // ReferenceError: Cannot access 'v' before initialization\n  let v = 5\n  console.log(v) // 5\n}\ndemo()",
      explanation: [
        'In the creation phase, let v is added to the environment record but marked uninitialized.',
        'Accessing it before the declaration line throws because the binding is in the temporal dead zone.',
        'After the let v = 5 line, the binding is initialized and readable.',
        'TDZ is thus a state of a binding inside the lexical environment, not a separate rule.',
      ],
    },
    advanced: {
      label: 'Advanced — [[Environment]] capture (closure)',
      lang: 'js',
      code: "function makeTagger(tag) {\n  // returned function captures THIS lexical environment via [[Environment]]\n  return function (msg) { return `[${tag}] ${msg}` }\n}\nconst err = makeTagger('ERROR')\nconsole.log(err('disk full')) // [ERROR] disk full\n// the env record { tag: 'ERROR' } stays alive because err references it",
      explanation: [
        'When the inner function is created, it stores [[Environment]] pointing to makeTagger\'s lexical environment.',
        'That environment\'s record holds { tag }.',
        'After makeTagger returns, the record persists on the heap because err still references it.',
        'Resolving tag inside err walks to that retained record — a closure is a captured lexical environment.',
      ],
    },
    realProject: {
      label: 'Real project — per-instance environments in a Vue composable',
      lang: 'js',
      code: "function useToggle(initial = false) {\n  let state = initial // each call creates a fresh lexical environment\n  const toggle = () => { state = !state; return state }\n  const value = () => state\n  return { toggle, value }\n}\nconst a = useToggle()\nconst b = useToggle(true)\na.toggle(); // a's env state -> true\nconsole.log(a.value(), b.value()) // true true",
      explanation: [
        'Each useToggle() call creates its own lexical environment with its own state binding.',
        'toggle and value capture that specific environment via [[Environment]].',
        'So instances a and b have completely independent state — no shared global.',
        'This per-call environment is exactly how Vue composables and React hooks isolate state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a lexical environment?',
      answer: 'It is the internal structure that stores the variables/functions of a scope, made of an Environment Record (the name-to-value bindings) plus a reference to the outer lexical environment.',
      explanation: 'Naming both parts — record and outer reference — is the core answer.',
    },
    {
      level: 'beginner',
      question: 'What does "lexical" mean here?',
      answer: 'It means "based on where the code is physically written". The outer reference is set by the nesting of the source, not by runtime call order.',
      explanation: 'Connecting "lexical" to definition-site nesting is what is expected.',
    },
    {
      level: 'intermediate',
      question: 'How does the lexical environment relate to the scope chain?',
      answer: 'The scope chain is the sequence formed by following the outer references from one lexical environment to the next, up to global. The lexical environment is the node; the chain is the linked list of outer references.',
      explanation: 'Distinguishing the node (environment) from the links (chain) shows precision.',
    },
    {
      level: 'intermediate',
      question: 'How does the lexical environment explain the temporal dead zone?',
      answer: 'let/const bindings are created in the environment record during the creation phase but left uninitialized. Accessing them before their declaration is the TDZ — a state of the binding within the record, which throws on access.',
      explanation: 'Framing TDZ as a binding state inside the record is the deep answer.',
    },
    {
      level: 'advanced',
      question: 'What is [[Environment]] and why does it matter?',
      answer: 'It is an internal slot on every function value that stores the lexical environment in which the function was defined. On invocation, the new context\'s outer reference is set from [[Environment]], which makes scoping lexical and enables closures by keeping the defining environment reachable.',
      explanation: 'This is the precise mechanism behind closures and lexical scope.',
    },
    {
      level: 'senior',
      question: 'How do lexical environments affect memory and garbage collection?',
      answer: 'An Environment Record is reachable as long as some live [[Environment]] or outer reference points to it. A surviving closure keeps its captured record (and all its bindings) on the heap, so capturing large scopes or never releasing closures (listeners/timers) prevents collection and can leak.',
      explanation: 'Connecting reachability of records to GC and leaks is senior-level.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between LexicalEnvironment and VariableEnvironment?',
    'What is the difference between a lexical environment and a scope?',
    'How is the global lexical environment different (outer = null)?',
    'How do blocks create new declarative environment records?',
    'How does [[Environment]] enable closures?',
    'What types of environment records exist (declarative, object, global, module)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using "scope" and "lexical environment" interchangeably without nuance.',
      why: 'Scope is the conceptual rule; the lexical environment is the concrete spec structure (record + outer ref) that implements it.',
      fix: 'Say scope is the concept and the lexical environment is the data structure realizing it.',
    },
    {
      mistake: 'Believing the outer reference points to the caller.',
      why: 'It points to the definition environment (lexical), captured at function creation, not the call site.',
      fix: 'Trace outer references by code nesting, set via [[Environment]] at definition.',
    },
    {
      mistake: 'Thinking let/const bindings do not exist before their declaration line.',
      why: 'They exist in the environment record (created in the creation phase) but are uninitialized (TDZ).',
      fix: 'Remember TDZ = binding present but uninitialized; access after the declaration.',
    },
    {
      mistake: 'Ignoring that captured environments keep all their bindings alive.',
      why: 'A closure retains the whole record, not just the one variable you use, so sibling bindings can linger.',
      fix: 'Capture minimal data and release closures (cleanup) to free records.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Each composable call creates a fresh lexical environment holding its reactive state; returned functions capture it via [[Environment]], giving per-instance isolation.' },
    { area: 'React', detail: 'Each render creates lexical environments captured by hook callbacks; the "stale closure" bug is a callback holding an old render\'s environment record.' },
    { area: 'Node.js', detail: 'Module code runs in a module environment; per-request handlers create environments whose records hold request-scoped state, kept alive while the handler runs.' },
    { area: 'Backend', detail: 'Dependency-injection-style factories return handlers that capture an environment holding injected deps, avoiding globals while keeping state encapsulated.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Engines optimize environment access heavily (slot indexing, inline caches), so typical resolution is fast.',
      'Per-call environments give clean isolation with little overhead for normal code.',
    ],
    bad: [
      'Closures retaining large environment records keep all captured bindings alive, increasing memory.',
      'Deep nesting of environments lengthens the outer-reference chain, marginally raising lookup cost in hot paths.',
    ],
    optimizations: [
      'Capture only the variables you need so retained records stay small.',
      'Release long-lived closures (remove listeners, clear timers) to free their environment records.',
      'Flatten unnecessary nesting and hoist far lookups into locals in hot loops.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scope', 'scope-chain', 'execution-context'],
    nextConcepts: ['closure', 'hoisting', 'temporal-dead-zone', 'garbage-collection'],
    dependencyNote:
      'The lexical environment is the concrete structure underlying scope and the scope chain within an execution context. It is the direct prerequisite for understanding closures, hoisting/TDZ as binding states, and the GC implications of captured environments.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a two-part box: top = Environment Record (name->value), bottom = outer reference.',
      'Draw a few nested boxes (inner, outer, global) linked by outer references.',
      'Show resolution walking the outer references = the scope chain.',
      'Add [[Environment]] from a function object pointing at the box where it was defined.',
      'Say: "A closure keeps that box alive on the heap after its context is popped."',
    ],
    diagram: [
      '  fn.[[Environment]] ──► ┌ Record { x } ┐',
      '                         │ outer ───────┼──► ┌ Record { y } ┐',
      '                         └──────────────┘    │ outer ──► null│ (global)',
      '                                             └──────────────┘',
      '  chain of outer refs = scope chain',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A lexical environment is the spec-level structure holding a scope\'s bindings: an Environment Record (name-to-value map) plus an outer reference to the enclosing environment. The chain of outer references is the scope chain, and it is lexical because the outer link is set by where code is written. Functions capture their defining environment via [[Environment]], which is how closures work; var/let states inside the record explain hoisting and the TDZ.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A lexical environment is the actual structure the JavaScript engine uses to store the variables of a scope, defined in the specification. It has two parts: an Environment Record, which is essentially a map of binding names to their values for that scope, and an outer reference, which points to the lexical environment that encloses it — with the global environment\'s outer reference being null. The engine creates a lexical environment for the global context, for each function call, and for each block that declares let, const, or class. The word "lexical" is key: the outer reference is set by where the code is written, not by who calls the function. In fact, every function value stores an internal slot, [[Environment]], holding the lexical environment it was defined in, and when the function runs, the new context\'s outer reference comes from that slot. This is exactly why scoping is lexical and why closures work: when an inner function outlives its outer call, its [[Environment]] keeps the outer Environment Record reachable, so it survives on the heap and the function can still resolve those variables. This structure also explains other behaviors precisely — the scope chain is just the linked list of outer references; hoisting and the temporal dead zone are states of bindings inside the record, since let and const are added during the creation phase but left uninitialized. And it has real memory consequences: a closure retains its whole captured record, so capturing large scopes or never releasing closures keeps those bindings alive and can leak.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'The spec model (separate LexicalEnvironment/VariableEnvironment, multiple record types) is precise but engines collapse and optimize it, so the conceptual model and machine reality differ.',
      'Per-call environments give isolation at the cost of allocation; closures persist them for encapsulation at the cost of retained memory.',
    ],
    edgeCases: [
      'var lives in the VariableEnvironment record while let/const live in the LexicalEnvironment record, affecting block behavior.',
      'TDZ is a binding present-but-uninitialized state, not absence — typeof on a TDZ binding still throws.',
      'Block, function, module, and global use different Environment Record types (declarative vs object vs global).',
      'with and eval can introduce object environment records dynamically, defeating static optimization.',
    ],
    runtimeBehavior: [
      'Resolution checks the current record, then follows outer references; first match wins.',
      '[[Environment]] is captured at function definition and reused for every invocation, fixing lexical scope.',
      'Captured records persist on the heap until no live [[Environment]]/outer reference reaches them.',
    ],
    scalability: [
      'Minimal capture keeps retained records small, which matters across many long-lived closures.',
      'Shallow nesting and slot-indexed access keep resolution cheap in large, hot codebases.',
    ],
    productionConcerns: [
      'Closures (listeners/timers) retaining large records are a leading memory-leak cause; ensure cleanup.',
      'Stale-closure bugs in React stem from capturing a previous render\'s environment record.',
      'Avoid with/eval, which mutate environments dynamically and harm performance and tooling.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Lexical environment = Environment Record + outer reference.',
    'Record = name->value bindings of one scope.',
    'Outer reference = link to enclosing environment (null at global).',
    'Chain of outer refs = the scope chain.',
    'Created for: global, each function call, each block (let/const/class).',
    '"Lexical" = set by where code is written (definition site).',
    'Function captures defining env via internal [[Environment]].',
    'Closure = a retained captured lexical environment.',
    'var=VariableEnvironment record; let/const=LexicalEnvironment record.',
    'TDZ = binding exists in record but is uninitialized.',
    'Captured records (and all their bindings) stay alive -> leak risk.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show that a block with let creates a separate binding from the outer scope.',
      hint: 'Declare the same name inside a block and log inside and outside.',
      solution: {
        lang: 'js',
        code: "let msg = 'outer'\n{\n  let msg = 'inner'\n  console.log(msg) // 'inner' (block environment record)\n}\nconsole.log(msg) // 'outer'",
        explanation: [
          'The block creates a new lexical environment with its own record holding msg.',
          'Inside, msg resolves to the block record; outside, to the enclosing environment.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Explain via the environment record why accessing a let before its declaration throws.',
      hint: 'The binding exists but is uninitialized (TDZ).',
      solution: {
        lang: 'js',
        code: "function f() {\n  try { return x } catch (e) { /* ReferenceError */ }\n  finally { /* unreachable order issue, illustrative */ }\n}\n// Cleaner illustration:\nfunction g() {\n  // console.log(x) // ReferenceError: Cannot access 'x' before initialization\n  let x = 1\n  return x\n}\ng()",
        explanation: [
          'During the creation phase, let x is added to the record but uninitialized.',
          'Reading it before the declaration line hits the TDZ and throws a ReferenceError.',
          'After let x = 1 runs, the binding is initialized and usable.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate [[Environment]] capture: show two closures from the same call sharing one environment record.',
      hint: 'Return two functions from one factory; both capture the same record.',
      solution: {
        lang: 'js',
        code: "function makeStore() {\n  let data = []\n  const add = (x) => { data.push(x); return data.length }\n  const all = () => data.slice()\n  return { add, all }\n}\nconst s = makeStore()\ns.add(1); s.add(2)\nconsole.log(s.all()) // [1, 2]",
        explanation: [
          'add and all both have [[Environment]] pointing to the same makeStore lexical environment.',
          'They share the one record holding data, so add mutates what all reads.',
          'The record persists on the heap because both closures keep it reachable.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with code, how per-call lexical environments give each composable/hook instance independent state.',
      hint: 'Each call creates a fresh environment record captured by the returned functions.',
      solution: {
        lang: 'js',
        code: "function useCounter(start = 0) {\n  let n = start // fresh environment record per call\n  return {\n    inc: () => ++n,\n    value: () => n,\n  }\n}\nconst c1 = useCounter()\nconst c2 = useCounter(100)\nc1.inc()\nconsole.log(c1.value(), c2.value()) // 1 100",
        explanation: [
          'Each useCounter() call builds a new lexical environment whose record holds its own n.',
          'inc and value capture that specific environment via [[Environment]].',
          'So c1 and c2 have fully independent state — the structural reason hooks/composables isolate per instance.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The lexical environment is the engine-level truth behind scope, the scope chain, hoisting, TDZ, and closures. Explaining it cleanly is one of the strongest signals of deep JavaScript understanding.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go this deep, sometimes just asking how scope is implemented. Product companies (Zoho, Flipkart, Razorpay) ask how closures capture variables and what TDZ really is. FAANG-level interviews want the Environment Record + outer reference model, [[Environment]] capture, record types, and the GC implications.',
    whatInterviewersExpect:
      'You can define the structure (record + outer reference), explain "lexical" as definition-site nesting, connect it to the scope chain, TDZ, and closures via [[Environment]], and discuss how captured records affect memory.',
  },
}

export default lexicalEnvironment
