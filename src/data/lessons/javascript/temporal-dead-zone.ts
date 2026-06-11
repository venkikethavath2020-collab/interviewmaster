import type { ConceptLesson } from '../../../types/lesson'

const temporalDeadZone: ConceptLesson = {
  // 1. Concept Summary
  slug: 'temporal-dead-zone',
  name: 'Temporal Dead Zone',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The TDZ is why let/const "feel safer" than var — using a variable before its declaration throws a clear ReferenceError instead of silently giving you undefined.',
    'It turns a whole class of subtle bugs (reading a value before it is ready) into loud, early failures you can fix immediately.',
    'It explains startup crashes in modules with circular imports, where a binding is accessed before initialization.',
    'Interviewers ask about it to verify you truly understand that let/const ARE hoisted — just not initialized — which is a common misconception.',
    'Without it, you cannot fully explain the difference between var, let, and const, one of the most asked beginner-to-intermediate topics.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The TDZ is like a wrapped birthday present sitting on the table: everyone can SEE the box, but no one is allowed to open or use it until the moment the party officially starts.',
    story: [
      'Imagine your present arrives early and sits on the table where everyone can see it.',
      'You really want to play with the toy inside, but the rule is: you cannot touch it until your party officially begins.',
      'If you try to grab it early, your mom stops you and says "not yet!" — that is an error, not a "maybe later".',
      'A let or const variable is like that present: it exists from the start of the room (its scope), but if you try to use it before the official line where it is declared, JavaScript stops you with an error. That waiting window is the Temporal Dead Zone.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When JavaScript prepares a block of code, it notices all the let and const variables and reserves their names right away.',
    'But unlike var, it does NOT give them the value undefined yet — it leaves them in a special "do not use" state.',
    'If your code tries to read one of these variables before reaching the line that declares it, JavaScript throws a ReferenceError on purpose.',
    'That period — from the start of the scope up to the declaration line — is called the Temporal Dead Zone, because the variable is technically there but temporarily off-limits.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Temporal Dead Zone (TDZ) is the span of time, within a scope, between when a let/const binding is created (at the top of the scope, via hoisting) and when it is actually initialized at its declaration line. Accessing the variable during this span throws a ReferenceError.',
    how: 'During the creation phase the engine registers the let/const name but marks it "uninitialized". Any read/write before the declaration evaluates hits that mark and throws. Once execution reaches the declaration, the binding is initialized and becomes usable.',
    why: 'It exists to make let/const safer and more predictable than var by catching use-before-declaration as an explicit error rather than silently returning undefined — which prevents a whole category of hard-to-find bugs.',
    code: {
      label: 'Reading a let before its declaration throws',
      lang: 'js',
      code: `{\n  // TDZ for \`x\` starts here\n  console.log(typeof x) // ReferenceError (not "undefined"!)\n  let x = 10            // TDZ ends here\n  console.log(x)        // 10\n}`,
      explanation: [
        'The binding `x` exists from the top of the block because let is hoisted.',
        'But it is uninitialized, so reading it before the `let x = 10` line throws a ReferenceError.',
        'Note even `typeof x` throws here — surprising, since typeof on an undeclared variable normally returns "undefined".',
        'Once the `let x = 10` line runs, the TDZ ends and `x` is usable normally.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Temporal Dead Zone is the region of a lexical scope in which a let, const, or class binding exists (having been created during the creation phase of the execution context) but is uninitialized, so any reference to it throws a ReferenceError. The zone begins at the start of the enclosing scope and ends when control flow reaches and evaluates the binding\'s declaration, at which point the binding is initialized. The TDZ enforces that block-scoped bindings cannot be observed before their lexical declaration, eliminating the silent-undefined behavior of var.',

  // 7. Internal Working
  internalWorking: [
    'When the engine enters a scope, the creation phase instantiates let/const/class bindings in the lexical environment but flags each as "uninitialized" rather than assigning undefined.',
    'Every access to such a binding compiles to a check: if the binding is still uninitialized, the engine throws a ReferenceError.',
    'During the execution phase, when control flow reaches the declaration statement, the engine marks the binding initialized and assigns the declared value (or undefined for `let x;` without an initializer).',
    'From that point the uninitialized flag is cleared, so subsequent reads/writes succeed normally.',
    'Because the check is on initialization state (not textual position), even forward references inside the same scope from earlier-running code throw — the TDZ is about runtime order, not just line numbers.',
    'class declarations behave identically: the class name is in the TDZ until the class definition is evaluated.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  SCOPE START
     │
     │   ┌──────────── TEMPORAL DEAD ZONE ────────────┐
     │   │  x exists (hoisted) but UNINITIALIZED       │
     │   │  any access -> ReferenceError               │
     │   └─────────────────────────────────────────────┘
     ▼
  let x = 10   ◄── declaration line: binding initialized, TDZ ENDS
     │
     ▼
  use x freely  (no error)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — const in the TDZ',
      lang: 'js',
      code: `function demo() {\n  // TDZ for PI starts\n  // console.log(PI) // would throw ReferenceError\n  const PI = 3.14   // TDZ ends\n  return PI\n}\ndemo() // 3.14`,
      explanation: [
        '`PI` is hoisted to the top of demo() but uninitialized during the TDZ.',
        'Reading it before the const line would throw a ReferenceError.',
        'After the declaration, `PI` is fully usable.',
      ],
    },
    intermediate: {
      label: 'Intermediate — TDZ vs var (silent undefined)',
      lang: 'js',
      code: `function compare() {\n  console.log(a) // undefined (var: hoisted + initialized)\n  var a = 1\n\n  try {\n    console.log(b) // throws (let: TDZ)\n  } catch (e) {\n    console.log(e.constructor.name) // "ReferenceError"\n  }\n  let b = 2\n}\ncompare()`,
      explanation: [
        '`var a` is hoisted AND initialized to undefined, so reading it early is silent.',
        '`let b` is hoisted but uninitialized, so reading it early throws a ReferenceError.',
        'This contrast is the core reason let/const are preferred: errors surface early.',
        'The TDZ converts a silent bug into a loud one.',
      ],
    },
    advanced: {
      label: 'Advanced — TDZ in default parameters',
      lang: 'js',
      code: `function tricky(a = b, b = 2) {\n  return [a, b]\n}\ntry {\n  tricky() // ReferenceError: Cannot access 'b' before initialization\n} catch (e) {\n  console.log(e.message)\n}\n\nfunction ok(a = 1, b = a) { return [a, b] }\nok() // [1, 1]`,
      explanation: [
        'Parameters are initialized left to right and live in their own TDZ until assigned.',
        '`a = b` references `b` before it is initialized, so it throws — `b` is in the TDZ.',
        'Reversing the dependency (`b = a`) works because `a` is already initialized when `b` is evaluated.',
        'This is a subtle, senior-flavored consequence of how the parameter scope applies the TDZ.',
      ],
    },
    realProject: {
      label: 'Real project — circular imports triggering a TDZ crash (Node ESM)',
      lang: 'js',
      code: `// a.js\nimport { b } from './b.js'\nexport const a = 'A'\nconsole.log(b) // may throw if b not yet initialized\n\n// b.js\nimport { a } from './a.js'\nexport const b = 'B'\nconsole.log(a) // ReferenceError if a is still in its TDZ`,
      explanation: [
        'ES module bindings are live and block-scoped, subject to the TDZ during initialization.',
        'With a circular import, one module may read another\'s export before that const is initialized.',
        'The result is "Cannot access before initialization" at startup — a real production crash.',
        'The fix is to break the cycle, defer access (inside a function), or restructure exports.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Temporal Dead Zone?',
      answer: 'It is the window in a scope between where a let/const binding is created (hoisted) and where it is declared/initialized. Accessing the variable in that window throws a ReferenceError instead of returning undefined.',
      explanation: 'A good answer makes clear the binding exists but is uninitialized, distinguishing it from var.',
    },
    {
      level: 'beginner',
      question: 'Are let and const hoisted if they have a TDZ?',
      answer: 'Yes. They are hoisted — their bindings are created at the top of the scope — but they are left uninitialized, which is exactly what causes the TDZ.',
      explanation: 'Tests the common misconception that let/const are not hoisted at all.',
    },
    {
      level: 'intermediate',
      question: 'Why does typeof throw for a let in its TDZ but return "undefined" for a truly undeclared variable?',
      answer: 'For an undeclared identifier, typeof is defined to return "undefined" safely. But a let binding in the TDZ exists and is uninitialized, so any access — including typeof — hits the uninitialized check and throws a ReferenceError.',
      explanation: 'Shows precise understanding that the TDZ check fires on access regardless of operator.',
    },
    {
      level: 'intermediate',
      question: 'What problem does the TDZ solve compared to var?',
      answer: 'var silently returns undefined when read before assignment, hiding use-before-declaration bugs. The TDZ makes that an explicit ReferenceError, so mistakes fail fast and are easy to locate.',
      explanation: 'Connects the TDZ to its design motivation: safety and predictability.',
    },
    {
      level: 'advanced',
      question: 'How can default parameters trigger a TDZ error?',
      answer: 'Parameters initialize left to right in their own scope. If an earlier parameter\'s default references a later parameter, that later one is still uninitialized (in its TDZ), so it throws "Cannot access before initialization".',
      explanation: 'A subtle case demonstrating the TDZ applies within the parameter list, not just the body.',
    },
    {
      level: 'senior',
      question: 'How is the TDZ implemented and why can it cause module startup crashes?',
      answer: 'The engine flags let/const/class bindings as uninitialized in the lexical environment; accesses compile to a check that throws if still uninitialized, cleared only when the declaration evaluates. In ESM, bindings are live and block-scoped; circular imports can cause one module to read another\'s export before its declaration runs, throwing "Cannot access before initialization" at load time.',
      explanation: 'Senior signal: linking the TDZ mechanism to live bindings, circular imports, and real init-order failures.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does the TDZ relate to hoisting? (it is what hoisting of let/const looks like)',
    'Does var have a TDZ? (no — it is initialized to undefined immediately)',
    'Do class declarations have a TDZ? (yes, identical behavior)',
    'Why does even typeof throw inside the TDZ?',
    'How can circular ES module imports trigger a TDZ error?',
    'How do default parameter defaults interact with the TDZ?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Saying "let/const are not hoisted".',
      why: 'They ARE hoisted; the TDZ exists precisely because the binding is created but left uninitialized.',
      fix: 'State it as "hoisted but uninitialized — accessing before declaration throws".',
    },
    {
      mistake: 'Expecting typeof to safely return "undefined" for a TDZ variable.',
      why: 'typeof only suppresses errors for truly undeclared identifiers, not for declared-but-uninitialized bindings.',
      fix: 'Remember any access (including typeof) on a TDZ binding throws a ReferenceError.',
    },
    {
      mistake: 'Referencing a later parameter inside an earlier parameter\'s default value.',
      why: 'Parameters initialize left to right; the later one is still in its TDZ.',
      fix: 'Order parameters so defaults only reference already-initialized (earlier) parameters.',
    },
    {
      mistake: 'Ignoring circular imports as a cause of "Cannot access before initialization".',
      why: 'A module can read another\'s const export before that module finishes initializing.',
      fix: 'Break the cycle, defer the access into a function, or restructure the exports.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Circular ESM imports surface as TDZ "Cannot access before initialization" crashes during startup; understanding the TDZ guides the fix (lazy access or dependency restructuring).' },
    { area: 'React', detail: 'Using a const-declared helper or component before its declaration throws a TDZ error; this is why ESLint flags use-before-define for arrow-function components.' },
    { area: 'Vue', detail: 'In <script setup>, refs and computeds declared with const are in a TDZ until their line runs, so ordering of declarations matters during component setup.' },
    { area: 'Backend', detail: 'Config and dependency-injection containers built with const are subject to TDZ ordering; initialization sequence must respect declaration order to avoid early-access throws.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'The TDZ check is extremely cheap (an initialization flag test) and turns silent bugs into immediate, debuggable errors.',
      'Fail-fast behavior reduces time spent chasing undefined-related defects in production.',
    ],
    bad: [
      'An unexpected TDZ throw can crash module initialization or a hot path if not anticipated.',
      'Over-eager forward references (e.g. circular imports) can make startup brittle.',
    ],
    optimizations: [
      'Declare variables close to first use to keep the TDZ window small and obvious.',
      'Use ESLint (no-use-before-define) to catch TDZ-prone access statically before runtime.',
      'Break circular import chains or defer cross-module access into functions called after init.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['hoisting', 'var-let-const', 'scope', 'execution-context'],
    nextConcepts: ['lexical-environment', 'closure', 'es-modules', 'circular-dependencies'],
    dependencyNote:
      'The TDZ is the runtime face of hoisting for let/const, so understand hoisting and var/let/const first; it then connects to the lexical environment and to circular-dependency startup failures in ES modules.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a vertical timeline of a scope from "scope start" down to "scope end".',
      'Mark the declaration line (let x = 10) partway down.',
      'Shade the region from scope start to the declaration line and label it "TDZ".',
      'Write "access here -> ReferenceError" with an arrow into the shaded region.',
      'Say: "The binding exists the whole time (hoisted) but is uninitialized until the declaration runs — that shaded gap is the TDZ."',
    ],
    diagram: `  scope start ─────────────┐
  ░░░░░ TDZ ░░░░░ (uninit)  │  access => ReferenceError
  ░░░░░░░░░░░░░░░░░░░░░░░░░  │
  let x = 10  ◄──── init ───┘  TDZ ends here
  use x ✓
  scope end`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Temporal Dead Zone is the gap in a scope between where a let/const (or class) binding is hoisted and where it is actually initialized at its declaration line. The binding exists but is uninitialized, so any access — even typeof — throws a ReferenceError instead of returning undefined like var would. It exists to make block-scoped variables fail fast on use-before-declaration. Watch for it in default parameters and circular ES module imports.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Temporal Dead Zone is the period within a scope between when a let, const, or class binding is created and when it is initialized. People often say let and const are not hoisted, but that is wrong — they are hoisted, in the sense that their bindings are created at the top of the scope during the creation phase. The difference from var is that they are left uninitialized rather than being set to undefined. The engine flags the binding as uninitialized, and any access to it compiles to a check that throws a ReferenceError if it is still uninitialized. Control flow reaching the declaration line is what initializes the binding and ends the TDZ. The whole point is safety: var silently gives you undefined if you read it too early, which hides bugs, whereas the TDZ turns the same mistake into a loud, early error. A surprising detail is that even typeof throws inside the TDZ, because typeof only safely returns "undefined" for truly undeclared identifiers, not for declared-but-uninitialized ones. Two practical places this bites you are default parameters, where an earlier parameter referencing a later one throws, and circular ES module imports, where one module reads another module\'s const export before it has been initialized — producing a "Cannot access before initialization" crash at startup.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Safety vs leniency: the TDZ makes let/const fail fast, but it also means forward references that var tolerated now throw — a deliberate trade favoring correctness.',
      'Predictable ordering vs flexibility: the TDZ enforces declare-before-use, which can complicate patterns (mutual references) that need restructuring or lazy access.',
    ],
    edgeCases: [
      'typeof throwing inside the TDZ, contrary to its normally safe behavior on undeclared names.',
      'Default parameters referencing later parameters throw because of left-to-right initialization.',
      'Circular ESM imports reading a not-yet-initialized live binding throw at load time.',
      'class declarations are in the TDZ until evaluated, so referencing a class before its definition throws.',
    ],
    runtimeBehavior: [
      'The TDZ is enforced by an uninitialized flag on the binding, checked on every access at runtime.',
      'It is about runtime initialization order, not just source line position — earlier-running code that forward-references still throws.',
      'Initialization clears the flag exactly once when the declaration evaluates; thereafter access is normal.',
    ],
    scalability: [
      'In large ESM codebases, the TDZ plus live bindings makes module init order matter; circular dependencies become brittle and should be designed out.',
      'Lint-enforced declare-before-use keeps big teams from accidentally relying on hoisting-era leniency.',
    ],
    productionConcerns: [
      '"Cannot access before initialization" at startup almost always points to a circular import or bad init ordering — a common production incident.',
      'TDZ throws in hot paths or component setup can break rendering; declaration order must be correct.',
      'Bundlers can reorder/concatenate modules, occasionally exposing latent TDZ issues — test the production build, not just dev.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'TDZ = gap between a let/const/class binding being hoisted and being initialized.',
    'Binding exists but is UNINITIALIZED -> access throws ReferenceError.',
    'let/const ARE hoisted; they just are not initialized to undefined.',
    'var has NO TDZ (initialized to undefined immediately).',
    'Even typeof throws inside the TDZ.',
    'TDZ ends when control reaches the declaration line.',
    'It is about runtime order, not just line position.',
    'Default params: earlier param referencing later one -> TDZ throw.',
    'Circular ESM imports can cause TDZ startup crashes.',
    'Purpose: fail fast instead of silent undefined.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict and explain: { console.log(x); let x = 1; }',
      hint: 'x is hoisted but uninitialized at the log line.',
      solution: {
        lang: 'js',
        code: `{\n  // console.log(x) throws here\n  let x = 1\n  console.log(x) // 1\n}`,
        explanation: [
          'Logging x before its declaration hits the TDZ and throws a ReferenceError.',
          'Only after `let x = 1` runs is x initialized and safely loggable.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Explain why typeof y throws here but typeof z does not: { typeof z; /* z never declared */ console.log("ok"); let y; typeof y; }',
      hint: 'Compare an undeclared identifier vs a TDZ binding.',
      solution: {
        lang: 'js',
        code: `{\n  console.log(typeof z) // "undefined" — z is undeclared, typeof is safe\n  // console.log(typeof y) // would THROW here: y is in its TDZ\n  let y\n  console.log(typeof y) // "undefined" — now y is initialized\n}`,
        explanation: [
          'typeof on a truly undeclared identifier (z) safely returns "undefined".',
          'typeof on a declared-but-uninitialized binding (y, before its line) throws a ReferenceError.',
          'After `let y` runs, y is initialized to undefined and typeof returns "undefined".',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Fix this default-parameter TDZ error and explain: function f(a = b, b = 2) { return [a, b]; }',
      hint: 'Parameters initialize left to right.',
      solution: {
        lang: 'js',
        code: `function f(a = 2, b = a) {\n  return [a, b]\n}\nf() // [2, 2]`,
        explanation: [
          'Original threw because `a = b` read `b` while `b` was still in its TDZ (initialized later).',
          'Reordering so defaults only reference earlier (already initialized) parameters fixes it.',
          'Here `b = a` is valid because `a` is initialized before `b` is evaluated.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Demonstrate the difference between var and let when read before declaration, and explain what the TDZ adds.',
      hint: 'One returns undefined, the other throws.',
      solution: {
        lang: 'js',
        code: `function demo() {\n  console.log(v) // undefined (var: hoisted + initialized)\n  var v = 1\n\n  try {\n    console.log(l) // ReferenceError (let: TDZ)\n  } catch (e) {\n    console.log(e.constructor.name) // "ReferenceError"\n  }\n  let l = 2\n}\ndemo()`,
        explanation: [
          'var v is hoisted and initialized to undefined, so the early read is silent.',
          'let l is hoisted but uninitialized, so the early read throws — that is the TDZ.',
          'The TDZ adds fail-fast safety: it converts a silent undefined into an explicit error.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The TDZ is the concept that makes "are let/const hoisted?" a trap question — and knowing it cleanly signals you understand the engine, not just syntax. It is also the root cause of real startup crashes, so it has practical weight beyond trivia.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "is let hoisted?" and the var-vs-let early-read difference. Product companies (Zoho, Flipkart, Razorpay) probe typeof-throws and default-parameter TDZ. FAANG interviews connect it to live bindings and circular-import startup failures.',
    whatInterviewersExpect:
      'They expect you to say let/const are hoisted but uninitialized, define the zone precisely, explain why it exists (fail fast vs silent undefined), and ideally cite a real consequence like the typeof throw or a circular-import crash.',
  },
}

export default temporalDeadZone
