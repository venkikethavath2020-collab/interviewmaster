import type { ConceptLesson } from '../../../types/lesson'

const hoisting: ConceptLesson = {
  // 1. Concept Summary
  slug: 'hoisting',
  name: 'Hoisting',
  category: 'execution-model',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Hoisting explains why some code runs even when it "looks" like you used a variable or function before declaring it — and why other code crashes with a ReferenceError.',
    'It is the mechanism behind the most common beginner bug: reading a `var` and getting `undefined` instead of a value, or calling a function expression before it exists.',
    'Understanding hoisting is the foundation for understanding the Temporal Dead Zone, closures, and how the engine builds an execution context.',
    'Interviewers use hoisting questions to instantly tell who memorized syntax from who understands the two-phase nature of JS execution (creation phase vs execution phase).',
    'Without knowing it, you will be confused by why function declarations can be called from the top of a file but arrow functions assigned to const cannot.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Hoisting is like a teacher writing every student\'s NAME on the attendance sheet before class starts, but leaving the "present/absent" box blank until each student actually arrives.',
    story: [
      'Before the school bell rings, the teacher prepares a sheet and writes down every name she knows will be in the room today.',
      'At that moment the names exist on the paper, but next to each one the box is empty — she does not yet know if they are here.',
      'When a student walks in, the teacher fills in their box. Only then does the name "have a value".',
      'JavaScript does the same thing: before running your code it quietly writes down all the variable and function names first (this is hoisting), but it leaves most of them empty until the line that gives them a value actually runs.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Before JavaScript runs your code top to bottom, it does a quick first pass and notices all the variables and functions you declared.',
    'It "lifts" those names to the top of their scope so they already exist when the code starts running — this lifting is called hoisting.',
    'Function declarations get lifted fully, so you can call them before the line where they are written. But variables declared with var only have their name lifted; their value is still undefined until the assignment line runs.',
    'So hoisting is really about WHEN names are registered, not about physically moving your code around.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Hoisting is JavaScript\'s behavior of registering declarations (variables and functions) at the top of their enclosing scope during a creation phase, before any code executes. Function declarations are fully available; var variables exist but are initialized to undefined; let/const exist but are uninitialized (the Temporal Dead Zone).',
    how: 'When the engine enters a scope it scans for declarations first and allocates them in the variable environment. Then it runs the code line by line, filling in the real values when it reaches the assignments.',
    why: 'It lets functions reference each other regardless of order (mutual recursion, helper functions defined below their use) and is a direct consequence of the engine compiling a scope before executing it.',
    code: {
      label: 'var is hoisted but undefined; function declaration is fully hoisted',
      lang: 'js',
      code: `console.log(greet())  // "hi" — works!\nconsole.log(name)     // undefined — NOT an error\nvar name = 'Sam'\nconsole.log(name)     // "Sam"\n\nfunction greet() {\n  return 'hi'\n}`,
      explanation: [
        'The function declaration `greet` is hoisted with its full body, so calling it on line 1 works.',
        '`var name` is hoisted, so the name exists on line 2 — but its value is still `undefined` because the assignment has not run yet.',
        'Logging `name` on line 2 prints `undefined` instead of throwing, which surprises many beginners.',
        'After the assignment line runs, `name` finally holds "Sam".',
        'No code was physically moved — the engine just registered the names during the creation phase.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Hoisting is the result of the two-phase processing of a scope: during the creation (compilation) phase the engine scans the lexical scope and registers all declarations in the variable environment before executing any statements. Function declarations are bound to their complete function object; var bindings are created and initialized to undefined; let and const bindings are created but left uninitialized, producing the Temporal Dead Zone until their declaration is evaluated. Thus identifiers are conceptually "raised" to the top of their scope, though no source is physically relocated.',

  // 7. Internal Working
  internalWorking: [
    'When the engine enters an execution context (global or a function call), it first runs a creation phase that walks the scope looking for declarations.',
    'Each `var` declaration creates a binding in the variable environment and initializes it to `undefined`.',
    'Each function declaration creates a binding bound to the fully-constructed function object, so it is callable immediately.',
    'Each `let`/`const` declaration creates a binding in the lexical environment but marks it uninitialized — accessing it before its declaration line throws a ReferenceError (the Temporal Dead Zone).',
    'After the creation phase, the engine runs the execution phase, evaluating statements top to bottom and performing the actual assignments at the lines where they appear.',
    'Inner function declarations are hoisted within their own function scope when that function is later invoked, repeating the same two-phase process per call.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  SOURCE (what you wrote)            ENGINE'S VIEW (two phases)
  ─────────────────────             ────────────────────────────
  console.log(x)   // undefined     CREATION PHASE:
  var x = 10                          var x      -> undefined
  foo()            // works           function foo() { ... } (full)
  function foo(){}                    let y      -> <uninitialized>(TDZ)
  console.log(y)   // ReferenceError
  let y = 5                         EXECUTION PHASE (top to bottom):
                                      x = 10
                                      foo() runs
                                      y = 5`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — function declaration usable before its line',
      lang: 'js',
      code: `sayHi()  // "Hi!" — works because the declaration is hoisted\n\nfunction sayHi() {\n  console.log('Hi!')\n}`,
      explanation: [
        'A function declaration is hoisted together with its body during the creation phase.',
        'So it can be called on a line that appears physically above the declaration.',
        'This is why helper functions defined at the bottom of a file still work at the top.',
      ],
    },
    intermediate: {
      label: 'Intermediate — function expression is NOT hoisted like a declaration',
      lang: 'js',
      code: `try {\n  speak()  // TypeError: speak is not a function\n} catch (e) {\n  console.log(e.message)\n}\nvar speak = function () {\n  console.log('Hello')\n}`,
      explanation: [
        'Only the `var speak` binding is hoisted (initialized to `undefined`), NOT the function value.',
        'At the call site `speak` is still `undefined`, so calling it throws "speak is not a function".',
        'If you had used `let speak`, you would instead get a ReferenceError due to the TDZ.',
        'This distinction between declarations and expressions is a classic interview trap.',
      ],
    },
    advanced: {
      label: 'Advanced — shadowing and per-scope hoisting',
      lang: 'js',
      code: `var value = 'global'\nfunction test() {\n  console.log(value)  // undefined, not "global"\n  var value = 'local'\n  console.log(value)  // "local"\n}\ntest()`,
      explanation: [
        'Inside `test`, the local `var value` is hoisted to the top of the function scope.',
        'So the first log sees the local `value` (still `undefined`), NOT the outer global "global".',
        'This is variable shadowing combined with hoisting — a frequent "what does this print?" question.',
        'Using `let`/`const` would throw on the first log because of the TDZ instead of printing undefined.',
      ],
    },
    realProject: {
      label: 'Real project — function declarations let utilities live below their use (Node module)',
      lang: 'js',
      code: `// userService.js (Node.js)\nexport function createUser(data) {\n  validate(data)            // declared below, works due to hoisting\n  return save(normalize(data))\n}\n\nfunction validate(d) { if (!d.email) throw new Error('email required') }\nfunction normalize(d) { return { ...d, email: d.email.toLowerCase() } }\nfunction save(d) { /* persist */ return d }`,
      explanation: [
        'Function declarations are hoisted, so the public `createUser` can sit at the top while helpers stay below.',
        'This reading order (public API first, details after) is a common, readable module style.',
        'It works specifically because declarations — not expressions — are fully hoisted within the module scope.',
        'If `validate` were a `const validate = () => {}`, calling it above its line would throw.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is hoisting?',
      answer: 'Hoisting is JavaScript registering declarations at the top of their scope during a creation phase before executing code. Function declarations are fully available; var variables exist but start as undefined; let/const exist but are uninitialized (TDZ).',
      explanation: 'A strong answer mentions the two-phase model and distinguishes how var, let/const, and function declarations behave differently.',
    },
    {
      level: 'beginner',
      question: 'What does this print: console.log(a); var a = 1;?',
      answer: 'It prints `undefined`. The `var a` declaration is hoisted and initialized to undefined, but the assignment `= 1` has not executed yet at the log line.',
      explanation: 'Tests whether the candidate knows var is hoisted as a binding but not its value.',
    },
    {
      level: 'intermediate',
      question: 'Why can you call a function declaration before it appears but not a function expression?',
      answer: 'A function declaration is hoisted with its full body, so it is callable immediately. A function expression assigned to var only hoists the variable as undefined, so calling it throws "not a function"; with let/const it throws a ReferenceError due to the TDZ.',
      explanation: 'Shows understanding of the declaration-vs-expression distinction and how hoisting differs per binding kind.',
    },
    {
      level: 'intermediate',
      question: 'Are let and const hoisted?',
      answer: 'Yes — their bindings are created in the lexical environment during the creation phase, but they are left uninitialized. Accessing them before their declaration line throws a ReferenceError. This window is the Temporal Dead Zone.',
      explanation: 'A common misconception is that let/const are not hoisted at all; the precise answer is they are hoisted but not initialized.',
    },
    {
      level: 'advanced',
      question: 'What happens when a var and a function declaration share the same name?',
      answer: 'During the creation phase the function declaration binding wins (functions are hoisted with their value); a same-named var declaration without an initializer does not overwrite it. But a var ASSIGNMENT executed at runtime will overwrite the function reference at that point.',
      explanation: 'Tests nuanced knowledge of declaration precedence and the difference between declaration and assignment.',
    },
    {
      level: 'senior',
      question: 'How does the engine actually implement hoisting, and why is "code moves to the top" an inaccurate mental model?',
      answer: 'The engine performs a creation phase that instantiates the lexical and variable environments for a scope, binding declarations before execution. Nothing is relocated in the source; the AST is processed so bindings exist up front. var binds to undefined, functions bind to their objects, let/const stay uninitialized. The "move to top" phrasing is a teaching shortcut, not the runtime reality.',
      explanation: 'Senior signal: describing environment records, the creation/execution split, and correcting the popular oversimplification.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the Temporal Dead Zone and how does it relate to hoisting?',
    'Are function expressions and arrow functions hoisted? (only their variable binding, per var/let/const rules)',
    'What is the difference between the variable environment and the lexical environment?',
    'Does hoisting happen per scope or only globally? (per scope — each function call repeats it)',
    'If a var and function share a name, which one wins after the creation phase?',
    'Why did let/const introduce the TDZ instead of behaving like var?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing hoisting physically moves code to the top of the file.',
      why: 'It leads to wrong predictions about execution order and assignment timing.',
      fix: 'Think in two phases: declarations are registered first (creation), assignments run later (execution). Nothing is relocated.',
    },
    {
      mistake: 'Expecting a var to hold its value above the assignment line.',
      why: 'Only the binding is hoisted; the value is undefined until the assignment executes.',
      fix: 'Declare and initialize at the top, or use let/const so an accidental early read throws instead of silently being undefined.',
    },
    {
      mistake: 'Calling a function expression before its line and expecting it to work like a declaration.',
      why: 'The variable is hoisted but holds undefined (var) or is in the TDZ (let/const), not the function.',
      fix: 'Use a function declaration if you need to call it earlier, or move the call below the assignment.',
    },
    {
      mistake: 'Assuming let/const are "not hoisted" at all.',
      why: 'They are hoisted but uninitialized; the real difference is the TDZ, not the absence of hoisting.',
      fix: 'Say precisely: "hoisted but uninitialized, accessing before declaration throws a ReferenceError".',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Modules commonly place the exported public function at the top and helper function declarations below, relying on hoisting so the helpers are usable from the API function.' },
    { area: 'React', detail: 'Linters (ESLint no-use-before-define) often disallow using a const-defined component/helper before its declaration; hoisting knowledge explains why function declarations are exempt and arrow functions are not.' },
    { area: 'Vue', detail: 'In <script setup>, composable calls and refs declared with const are NOT hoisted as values, so ordering matters — understanding hoisting prevents accidental TDZ errors at setup time.' },
    { area: 'Backend', detail: 'Recursive and mutually-recursive helper functions (e.g. tree traversal utilities) work in any order thanks to declaration hoisting, simplifying file organization.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Hoisting itself is a compile-time bookkeeping step with negligible runtime cost.',
      'Function declarations being available up front means no extra setup is needed to organize files by readability.',
    ],
    bad: [
      'Relying on hoisted var can hide bugs (silent undefined) that surface later as harder-to-trace logic errors.',
      'Accidentally reading a TDZ variable throws at runtime, which can crash a hot path if not caught.',
    ],
    optimizations: [
      'Prefer let/const so early-access mistakes fail fast instead of silently producing undefined.',
      'Declare variables close to their first use to minimize the window where hoisting could surprise you.',
      'Use ESLint rules (no-use-before-define, no-var) to catch hoisting-dependent code statically.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['execution-context', 'scope', 'var-let-const'],
    nextConcepts: ['temporal-dead-zone', 'lexical-environment', 'closure', 'function-declaration-vs-expression'],
    dependencyNote:
      'Hoisting is a direct consequence of how an execution context is created; understanding scope and var/let/const first makes it click, and it leads straight into the Temporal Dead Zone and the lexical environment.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Split the board into two columns: "What you wrote" and "Engine\'s two phases".',
      'In phase 1 (creation), write the declarations: var x -> undefined, function foo -> full body, let y -> uninitialized.',
      'Say: "Names are registered first, before any line runs."',
      'In phase 2 (execution), run top to bottom and fill in assignments (x = 10, y = 5).',
      'Conclude: "That is why a var reads undefined early, a function declaration works early, and a let throws — all from one creation phase."',
    ],
    diagram: `  CREATION PHASE             EXECUTION PHASE
  ────────────────           ────────────────
  var x   = undefined        x = 10
  foo     = fn(){...}        foo()  ✓
  let y   = <TDZ>            y = 5
       ▲                          ▲
   names exist            values assigned`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Hoisting is the engine registering all declarations at the top of their scope during a creation phase before any code runs. Function declarations are fully available, so you can call them early; var variables exist but are undefined until their assignment line; let/const are hoisted but uninitialized, giving the Temporal Dead Zone. Nothing is physically moved — it is a two-phase model: register first, execute second. This explains why function expressions fail when called too early while declarations succeed.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Hoisting describes how JavaScript processes a scope in two phases. When the engine enters a scope it first does a creation phase where it scans for all declarations and registers them in the environment before executing any statements. How a name behaves depends on how it was declared. A function declaration is bound to its full function object during creation, so you can call it on a line above where it is written — that is real hoisting of both name and value. A var declaration is hoisted too, but only the binding; it is initialized to undefined, so reading it before its assignment gives undefined rather than throwing. let and const are also hoisted as bindings, but they are left uninitialized, so accessing them before their declaration line throws a ReferenceError — that window is the Temporal Dead Zone. After the creation phase, the engine runs the execution phase top to bottom and performs the actual assignments. The important correction to make in an interview is that nothing is physically moved to the top of the file; the "move to the top" phrase is just a teaching shortcut for the fact that bindings are created up front. This also explains the classic trap: a function expression assigned to var fails when called early because the variable is still undefined, while a function declaration succeeds.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declaration hoisting improves file readability (public API on top, helpers below) but can mask use-before-define mistakes if you over-rely on it.',
      'var hoisting silently yields undefined (lenient, bug-prone); let/const hoisting throws in the TDZ (strict, fail-fast). The trade is forgiveness vs early error detection.',
    ],
    edgeCases: [
      'A var and a function declaration sharing a name: the function binding is established in creation; a later var assignment overwrites it at runtime.',
      'Block-scoped function declarations behave differently in strict vs sloppy mode and across engines — avoid relying on them.',
      'Shadowing: a local var hoisted in a function masks an outer same-named variable, so an early read sees undefined, not the outer value.',
      'Default parameters and destructuring create their own TDZ-like ordering constraints within the parameter list.',
    ],
    runtimeBehavior: [
      'Hoisting occurs per execution context: every function invocation re-runs a creation phase for its own scope.',
      'The variable environment holds var/function bindings; the lexical environment holds let/const — both instantiated during creation.',
      'TDZ access is enforced by the engine marking the binding uninitialized, not by static analysis.',
    ],
    scalability: [
      'In large modules, leaning on declaration hoisting keeps the public surface readable, but tooling (bundlers, tree-shakers) generally handles either ordering fine.',
      'Strict-mode and ESM (which is always strict) make hoisting behavior more predictable across a codebase, reducing onboarding friction.',
    ],
    productionConcerns: [
      'Silent undefined from var hoisting can cause downstream NaN/null-pointer-style bugs that are expensive to trace — prefer let/const.',
      'TDZ ReferenceErrors at module init can crash app startup; ensure declaration order is correct, especially with circular imports.',
      'Lint rules (no-use-before-define, no-var) codify safe hoisting practices across teams.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Hoisting = declarations registered at top of scope during the creation phase.',
    'Two phases: creation (register names) then execution (run + assign).',
    'Function declarations: hoisted fully (name + body) — callable early.',
    'var: hoisted as binding, initialized to undefined.',
    'let/const: hoisted but uninitialized -> Temporal Dead Zone.',
    'Nothing is physically moved; it is bookkeeping, not relocation.',
    'Function EXPRESSIONS follow var/let/const rules, not declaration rules.',
    'Hoisting runs per execution context (every function call repeats it).',
    'A local var shadows outer same-named variables (early read = undefined).',
    'Prefer let/const + lint rules to fail fast instead of silent undefined.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: console.log(typeof a); var a = 5; — then explain why.',
      hint: 'var is hoisted as a binding initialized to undefined.',
      solution: {
        lang: 'js',
        code: `console.log(typeof a) // "undefined"\nvar a = 5`,
        explanation: [
          'The `var a` binding is hoisted and set to undefined during the creation phase.',
          'typeof undefined is "undefined", so it prints "undefined" without throwing.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite this so it does not throw, explaining the original error: foo(); const foo = () => console.log("hi");',
      hint: 'const is in the TDZ before its declaration line; use a function declaration or move the call.',
      solution: {
        lang: 'js',
        code: `function foo() {\n  console.log('hi')\n}\nfoo() // works — declaration is fully hoisted`,
        explanation: [
          'The original threw a ReferenceError because `foo` was in the Temporal Dead Zone when called.',
          'A function declaration is hoisted with its body, so it is callable before its textual position.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'What does this log, and why? var x = 1; function f() { console.log(x); var x = 2; } f();',
      hint: 'The inner var x is hoisted to the top of f, shadowing the outer x.',
      solution: {
        lang: 'js',
        code: `var x = 1\nfunction f() {\n  // var x is hoisted here as undefined\n  console.log(x) // undefined\n  var x = 2\n}\nf()`,
        explanation: [
          'Inside f, the local `var x` is hoisted to the top of the function scope as undefined.',
          'So the log sees the local x (undefined), not the outer x (1) — this is hoisting plus shadowing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and predict: console.log(fn()); function fn() { return 1; } var fn = () => 2; console.log(fn());',
      hint: 'Function declaration is established in creation; the var assignment overwrites it at runtime.',
      solution: {
        lang: 'js',
        code: `console.log(fn()) // 1 — declaration is hoisted with body\nfunction fn() { return 1 }\nvar fn = () => 2\nconsole.log(fn()) // 2 — assignment overwrote fn at runtime`,
        explanation: [
          'During creation, the function declaration `fn` is bound to its body, so the first call returns 1.',
          'The `var fn` declaration does not erase it (same binding), but the runtime ASSIGNMENT `fn = () => 2` replaces the reference.',
          'After that assignment line, calling fn returns 2 — declaration value first, reassignment later.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Hoisting is one of the very first "aha" concepts that separates people who understand how JavaScript executes from those who just write syntax. It underpins the TDZ, closures, and the entire execution-context model, so nailing it makes a chain of later topics easy.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) love the classic "what does this print" with var and undefined. Product companies (Zoho, Flipkart, Razorpay) push on let/const TDZ and declaration-vs-expression behavior. FAANG interviews probe the creation/execution phases and ask you to correct the "code moves up" myth.',
    whatInterviewersExpect:
      'They expect you to describe the two-phase model precisely, distinguish var (undefined), let/const (TDZ), and function declarations (fully hoisted), predict tricky outputs correctly, and avoid the "physically moves to the top" oversimplification.',
  },
}

export default hoisting
