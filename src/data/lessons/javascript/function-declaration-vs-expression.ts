import type { ConceptLesson } from '../../../types/lesson'

const functionDeclarationVsExpression: ConceptLesson = {
  // 1. Concept Summary
  slug: 'function-declaration-vs-expression',
  name: 'Declarations vs Expressions',
  category: 'functions',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The difference explains why you can call some functions before they appear in the file (declarations) but not others (expressions) — a frequent source of "not a function" and ReferenceError bugs.',
    'It is the foundation for understanding hoisting, IIFEs, callbacks, and how functions are passed around as values.',
    'Choosing the right form affects readability, hoisting behavior, and how the function appears in stack traces (named vs anonymous).',
    'Interviewers use it as a quick filter: knowing exactly how each form is hoisted shows you understand the engine\'s creation phase.',
    'Almost all modern code (callbacks, arrow functions, methods, module exports) uses function expressions, so you must know their rules.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A function declaration is like a name written on the class roster before school starts; a function expression is like a name tag you only get when you actually walk in and pick it up.',
    story: [
      'On the first day, the teacher already has some kids\' names on the roster before anyone arrives — those kids are "known" from the very start.',
      'Other kids get a name tag only at the moment they walk through the door and grab one.',
      'If you call out a roster name early, it works, because that name was there from the beginning.',
      'But if you call out a name-tag kid before they have walked in, there is no tag yet. A function declaration is the roster name (ready early); a function expression is the name tag (only ready once you reach that line).',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A function declaration starts with the word `function` and a name, like `function add() {}`. The engine knows about it from the start of the scope, so you can use it before its line.',
    'A function expression is when you put a function on the right side of an assignment, like `const add = function () {}`. It is treated as a value.',
    'Because it is a value assigned to a variable, you cannot use it until that assignment line runs.',
    'So the same-looking code behaves differently depending on whether the function is a declaration (lifted whole) or an expression (a value created at its line).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A function declaration is a statement that defines a named function and is fully hoisted (name + body) to the top of its scope. A function expression defines a function as a value assigned to a variable (or passed as an argument); only the variable binding follows hoisting rules, not the function value.',
    how: 'During the creation phase the engine binds declarations to their complete function object, so they are callable immediately. For an expression, only the variable is hoisted (undefined for var, TDZ for let/const); the function value is created when the assignment line executes.',
    why: 'Declarations let you organize code with helpers below their use; expressions let functions be values — passed as callbacks, returned, assigned conditionally, or used as IIFEs.',
    code: {
      label: 'Declaration is callable early; expression is not',
      lang: 'js',
      code: `sayHi()        // "hi" — declaration is fully hoisted\nfunction sayHi() { return 'hi' }\n\ntry {\n  speak()      // TypeError: speak is not a function\n} catch (e) { console.log(e.message) }\nvar speak = function () { return 'yo' }\nspeak()        // "yo" — works after the assignment`,
      explanation: [
        '`sayHi` is a declaration, hoisted with its body, so calling it on line 1 works.',
        '`speak` is a function EXPRESSION assigned to `var speak`; only the variable is hoisted (as undefined).',
        'Calling `speak()` before the assignment throws "speak is not a function" — undefined is not callable.',
        'After the assignment line runs, `speak` holds the function and can be called.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A function declaration is a statement whose binding is instantiated with its full function object during the creation phase of the enclosing scope, making it invocable before its textual position. A function expression is an operand that produces a function value at evaluation time; it may be anonymous or named (a named function expression scopes its own name only inside its body for self-reference). Expressions are subject to the hoisting rules of whatever variable they are assigned to (var → undefined; let/const → Temporal Dead Zone), so they are not invocable until the assignment executes.',

  // 7. Internal Working
  internalWorking: [
    'During the creation phase, the engine scans the scope: every function declaration creates a binding bound to its complete function object.',
    'This is why a declaration can be invoked on a line above where it is written — its value already exists before execution begins.',
    'A function expression is not processed as a declaration; the parser sees a function in expression position and defers creating the function object until that line runs.',
    'The variable holding the expression follows normal hoisting: var is initialized to undefined, let/const are uninitialized (TDZ), so early access fails (TypeError or ReferenceError respectively).',
    'A named function expression additionally creates a read-only binding of its own name in a small scope around the function body, usable only for self-reference (recursion), invisible outside.',
    'When the assignment statement executes, the function object is created and assigned to the variable, after which it is callable.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  DECLARATION                         EXPRESSION
  ───────────                         ──────────
  function f() {...}                  const f = function () {...}
        │                                   │
   creation phase:                     creation phase:
   f = full function  ◄── callable     f = <undefined/TDZ>  ◄── NOT callable yet
   BEFORE its line                          │
                                       execution reaches the line:
                                       f = function object ◄── now callable

  Rule: declaration -> name+body hoisted | expression -> value made at its line`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the two forms side by side',
      lang: 'js',
      code: `// Declaration\nfunction square(n) { return n * n }\n\n// Expression (anonymous, assigned to a const)\nconst cube = function (n) { return n * n * n }\n\nsquare(3) // 9\ncube(3)   // 27`,
      explanation: [
        '`square` is a declaration: named, hoisted with its body.',
        '`cube` is an anonymous function expression assigned to `cube`.',
        'Both work here because they are called after their definitions.',
        'The difference only shows when you try to call them before their line.',
      ],
    },
    intermediate: {
      label: 'Intermediate — named function expression for recursion',
      lang: 'js',
      code: `const factorial = function fac(n) {\n  return n <= 1 ? 1 : n * fac(n - 1) // \`fac\` only usable inside\n}\nfactorial(5) // 120\n// fac(5) // ReferenceError — the name is not visible outside`,
      explanation: [
        'This is a NAMED function expression: `fac` is the internal name.',
        '`fac` is usable only inside the function body, which is handy for safe recursion.',
        'Outside, only `factorial` exists; `fac` is not in scope.',
        'Named expressions also produce clearer stack traces than anonymous ones.',
      ],
    },
    advanced: {
      label: 'Advanced — conditional definition needs expressions',
      lang: 'js',
      code: `let formatter\nif (Intl && Intl.NumberFormat) {\n  formatter = function (n) { return new Intl.NumberFormat().format(n) }\n} else {\n  formatter = function (n) { return String(n) }\n}\nformatter(1234567) // "1,234,567" (locale-dependent)`,
      explanation: [
        'Function expressions are values, so they can be assigned conditionally.',
        'Function declarations inside blocks behave inconsistently across modes/engines, so expressions are the safe choice here.',
        'Assigning the right implementation to one variable keeps the call site uniform.',
        'This pattern (feature detection -> assign implementation) is common in polyfills.',
      ],
    },
    realProject: {
      label: 'Real project — callbacks and exports (Node/React)',
      lang: 'js',
      code: `// callbacks are function expressions passed as values\n[1, 2, 3].map(function (x) { return x * 2 }) // [2,4,6]\n\n// React: components/handlers as expressions\nconst Button = (props) => <button>{props.label}</button>\n\n// Node module: named export as a declaration (hoisted, readable)\nexport function createServer(opts) { /* ... */ }`,
      explanation: [
        'Array methods take function expressions (here anonymous) as callback values.',
        'Arrow-function components are expressions assigned to a const — not hoisted as values.',
        'Public module APIs are often declarations so they can sit at the top while helpers stay below.',
        'You constantly mix both forms: declarations for named APIs, expressions for callbacks/values.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a function declaration and a function expression?',
      answer: 'A declaration is a named statement hoisted fully (name + body), so it is callable before its line. An expression is a function used as a value assigned to a variable; only the variable is hoisted, so it is not callable until the assignment runs.',
      explanation: 'The expected answer ties the distinction to hoisting/callability.',
    },
    {
      level: 'beginner',
      question: 'Can you call a function expression before it is defined?',
      answer: 'No. The variable is hoisted (undefined for var, TDZ for let/const), but the function value is not. Calling early throws "not a function" (var) or a ReferenceError (let/const).',
      explanation: 'Tests the practical consequence of the hoisting difference.',
    },
    {
      level: 'intermediate',
      question: 'What is a named function expression and why use one?',
      answer: 'It is a function expression that has its own name, like const f = function inner() {}. The name `inner` is only visible inside the function (for recursion/self-reference) and improves stack traces, but is not accessible outside.',
      explanation: 'Shows awareness of the internal-name scoping nuance.',
    },
    {
      level: 'intermediate',
      question: 'Why are function expressions required for callbacks and IIFEs?',
      answer: 'Because callbacks and IIFEs need a function as a VALUE — to pass as an argument or to invoke immediately. Declarations are statements, not values, and cannot be passed inline or immediately invoked without forcing expression context.',
      explanation: 'Connects the value-vs-statement nature to real patterns.',
    },
    {
      level: 'advanced',
      question: 'What happens with function declarations inside blocks?',
      answer: 'Their behavior is inconsistent: in strict mode/ESM they are block-scoped; in sloppy mode legacy semantics may hoist them to the function scope, and engines historically differed. Best practice is to use function expressions inside blocks to avoid ambiguity.',
      explanation: 'A senior-flavored edge case about block-level declarations.',
    },
    {
      level: 'senior',
      question: 'How does the engine treat the two forms during the creation phase, and how does that affect tooling?',
      answer: 'Declarations are bound to their full function objects in the creation phase, so they are available before execution; expressions create the function only when the assignment evaluates. This affects hoisting, the TDZ for let/const expressions, stack-trace names (named expressions help), and lint rules like no-use-before-define which exempt declarations.',
      explanation: 'Senior signal: engine creation-phase behavior plus tooling/observability implications.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does hoisting differ between the two forms?',
    'What is a named function expression and where is its name visible?',
    'Why do callbacks have to be expressions?',
    'Are arrow functions declarations or expressions? (always expressions)',
    'What happens if you declare a function inside an if-block?',
    'How does each form appear in a stack trace?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling a function expression above its assignment line and expecting it to work.',
      why: 'Only the variable is hoisted (undefined/TDZ), not the function value.',
      fix: 'Use a declaration if you need to call it earlier, or move the call below the assignment.',
    },
    {
      mistake: 'Assuming arrow functions are hoisted like declarations.',
      why: 'Arrows are always expressions; assigned to const they are in the TDZ before their line.',
      fix: 'Define arrows before use, or use a function declaration when early calls are needed.',
    },
    {
      mistake: 'Relying on function declarations inside if/for blocks.',
      why: 'Block-level declaration semantics vary by mode/engine and can hoist unexpectedly.',
      fix: 'Assign a function expression to a block-scoped variable instead.',
    },
    {
      mistake: 'Using anonymous expressions everywhere and getting unreadable stack traces.',
      why: 'Anonymous functions show as <anonymous> in traces, hindering debugging.',
      fix: 'Use named function expressions or assign to clearly named variables.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Components and handlers are almost always function expressions (arrows assigned to const); they are not hoisted, so ESLint no-use-before-define flags using them too early.' },
    { area: 'Node.js', detail: 'Public module functions are often declarations (hoisted, readable top-down), while callbacks to async APIs and array methods are expressions.' },
    { area: 'Vue', detail: 'Composables and setup logic assign functions to consts (expressions); render functions and event handlers are expressions passed as values.' },
    { area: 'Backend', detail: 'Middleware, route handlers, and decorators are passed as function-expression values; named expressions improve error stack traces in logs.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Neither form has meaningful runtime cost difference; the engine optimizes both equivalently once defined.',
      'Defining stable functions once (module scope) avoids repeated allocation, regardless of form.',
    ],
    bad: [
      'Creating new function expressions inside hot loops/renders allocates a new function each time, adding GC pressure.',
      'Anonymous expressions can complicate profiling because frames lack descriptive names.',
    ],
    optimizations: [
      'Hoist stable callbacks out of loops/renders so a fresh expression is not created each iteration.',
      'Use named function expressions to get useful names in profiles and stack traces.',
      'Prefer declarations or top-level consts for functions reused many times.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['hoisting', 'scope', 'var-let-const'],
    nextConcepts: ['arrow-functions', 'iife', 'closure', 'higher-order-functions'],
    dependencyNote:
      'This distinction is grounded in hoisting and scope; it directly explains arrow functions (always expressions), IIFEs (expressions invoked immediately), and how functions become values for callbacks and higher-order functions.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a declaration `function f(){}` and an expression `const g = function(){}` side by side.',
      'Above both, write a call: f() works, g() throws.',
      'Explain: declaration is hoisted name+body; expression hoists only the variable (undefined/TDZ).',
      'Add a named expression `const h = function inner(){ inner() }` and note inner is internal-only.',
      'Conclude: declarations are statements available early; expressions are values created at their line.',
    ],
    diagram: `  DECLARATION                 EXPRESSION
  function f(){}              const g = function(){}
  f()  ✓ (hoisted)           g()  ✗ before line (TDZ/undefined)

  named expr: const h = function inner(){...}
              inner visible ONLY inside h`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A function declaration is a named statement hoisted with its full body, so you can call it before its line. A function expression is a function used as a value assigned to a variable; only the variable is hoisted (undefined for var, TDZ for let/const), so it is not callable until the assignment runs. Callbacks, arrows, and IIFEs are all expressions. Named function expressions expose their name only inside themselves for recursion and better stack traces.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The core difference is how each is processed and when it becomes callable. A function declaration is a statement — function name() {} — and during the engine\'s creation phase it is bound to its complete function object. That means it is fully hoisted, so you can call it on a line above where it is written; this is why people put public functions at the top of a file and helper declarations below. A function expression is a function used as a value, like const fn = function() {} or an arrow assigned to a const. Here the engine does not create the function during the creation phase; it follows the hoisting rules of the variable. With var the variable is hoisted as undefined, so calling it early throws "fn is not a function"; with let or const the variable is in the Temporal Dead Zone, so calling early throws a ReferenceError. Function expressions are essential because functions need to be values for callbacks, IIFEs, conditional assignment, and returning functions. A nice nuance is the named function expression, like const f = function inner() {}: the name inner is scoped only inside the function body, useful for safe recursion and producing readable stack traces, but it is invisible outside. In modern code we lean heavily on expressions — every arrow function and callback is one — while declarations remain handy for named, hoisted, top-level APIs.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarations give hoisting and readable top-down organization; expressions give first-class-value flexibility (callbacks, conditional assignment) but no early callability.',
      'Anonymous expressions are concise but hurt debuggability; named expressions cost a few characters for far better stack traces.',
    ],
    edgeCases: [
      'Block-level function declarations behave differently in strict/ESM vs sloppy mode — avoid them; use expressions in blocks.',
      'A named function expression\'s internal name is a read-only binding visible only inside the body.',
      'A function expression assigned to let/const is in the TDZ before its line; assigned to var it is undefined.',
      'Arrow functions are always expressions and additionally lack their own this/arguments/prototype.',
    ],
    runtimeBehavior: [
      'Declarations are instantiated in the creation phase; expressions create the function object at evaluation of the assignment.',
      'Both compile to equivalent optimized function objects once defined.',
      'Inferred names: modern engines infer a name for const fn = () => {} from the variable, aiding traces; truly anonymous callbacks may still show <anonymous>.',
    ],
    scalability: [
      'In large codebases, declarations for the public API plus expressions for internals is a readable convention that scales.',
      'Avoiding function-creation in hot render paths (hoist callbacks) matters more than which form you choose.',
    ],
    productionConcerns: [
      '"X is not a function"/ReferenceError before definition is a classic expression-hoisting bug — fix ordering or use a declaration.',
      'Anonymous functions degrade production stack traces and error monitoring; prefer named expressions for observability.',
      'Lint rules (no-use-before-define, func-style) enforce a consistent team convention and catch ordering bugs early.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Declaration: function f(){} — a statement, fully hoisted (name + body).',
    'Expression: const f = function(){} — a value; only the variable is hoisted.',
    'Declaration callable BEFORE its line; expression is NOT.',
    'Expression early-call: TypeError (var, undefined) or ReferenceError (let/const TDZ).',
    'Arrows are ALWAYS expressions (never hoisted as values).',
    'Callbacks and IIFEs must be expressions (functions as values).',
    'Named function expression: const f = function inner(){} — inner is internal-only.',
    'Named expressions give better stack traces + safe recursion.',
    'Avoid function declarations inside blocks (mode/engine-dependent).',
    'Convention: declarations for top-level APIs, expressions for callbacks/values.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert this declaration into a function expression assigned to a const: function double(n){return n*2}',
      hint: 'Put the function on the right of an assignment.',
      solution: {
        lang: 'js',
        code: `const double = function (n) {\n  return n * 2\n}\ndouble(4) // 8`,
        explanation: [
          'The function becomes a value assigned to the const `double`.',
          'It is no longer hoisted as a value, so it must be defined before use.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict and explain: greet(); var greet = function(){ console.log("hi") };',
      hint: 'Only the var binding is hoisted, not the function value.',
      solution: {
        lang: 'js',
        code: `// greet() throws: TypeError: greet is not a function\nvar greet = function () { console.log('hi') }\ngreet() // "hi" — works after assignment`,
        explanation: [
          '`var greet` is hoisted as undefined; the function value is not.',
          'Calling greet() before the assignment tries to invoke undefined -> TypeError.',
          'After the assignment line, greet holds the function and works.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a recursive countdown using a NAMED function expression, and show that the name is not visible outside.',
      hint: 'const f = function inner(n){ ... inner(n-1) }',
      solution: {
        lang: 'js',
        code: `const countdown = function tick(n) {\n  if (n < 0) return\n  console.log(n)\n  tick(n - 1)        // self-reference via internal name\n}\ncountdown(3)         // 3 2 1 0\n// tick(3)           // ReferenceError: tick is not defined outside`,
        explanation: [
          '`tick` is the internal name of the function expression, usable only inside the body.',
          'It enables recursion even if `countdown` were reassigned.',
          'Outside the function, only `countdown` exists; `tick` is out of scope.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why you cannot immediately invoke a function declaration but can an expression, and write the smallest IIFE.',
      hint: 'Force expression context with parentheses.',
      solution: {
        lang: 'js',
        code: `// function foo(){}()  // SyntaxError: declaration cannot be invoked\n(function () {\n  console.log('runs once')\n})() // IIFE: expression + call operator`,
        explanation: [
          'At statement start, `function` is parsed as a declaration, which cannot be followed by ().',
          'Wrapping in parentheses forces expression context, producing a function value.',
          'The trailing () then invokes that value immediately — the IIFE pattern.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing declarations vs expressions is the gateway to hoisting, closures, IIFEs, and treating functions as values — the heart of JavaScript. It is a small topic that quietly explains a whole family of "why does this throw before its line" bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the plain definition and a hoisting predict-the-output. Product companies (Zoho, Flipkart, Razorpay) probe named function expressions and why callbacks must be expressions. FAANG interviews dig into block-level declarations, creation-phase behavior, and stack-trace implications.',
    whatInterviewersExpect:
      'They expect you to define both forms, explain the hoisting/callability difference precisely, mention named function expressions and their scoping, and connect expressions to callbacks/IIFEs/arrows.',
  },
}

export default functionDeclarationVsExpression
