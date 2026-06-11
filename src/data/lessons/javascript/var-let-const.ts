import type { ConceptLesson } from '../../../types/lesson'

const varLetConst: ConceptLesson = {
  // 1. Concept Summary
  slug: 'var-let-const',
  name: 'var vs let vs const',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Choosing the right declaration is the very first decision in almost every line you write — getting scope and reassignment right prevents a whole category of bugs.',
    'var\'s function scope and hoisting cause the classic loop bug and accidental overwrites that let/const eliminate.',
    'The temporal dead zone (TDZ) for let/const turns "use before declare" into a clear error instead of a silent undefined.',
    'It is the single most common warm-up interview question — fumbling it signals shaky fundamentals before you even reach the hard topics.',
    'Modern code is almost entirely const-by-default with let where needed; understanding why is part of writing idiomatic JavaScript.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'var is a shout that fills the whole house; let and const are a whisper that stays in one room.',
    story: [
      'Imagine you say a word in your bedroom. With let and const, only people in that room (the curly braces) can hear it.',
      'With var, it is like shouting — the whole house (the entire function) hears it, even people in other rooms.',
      'const is special: it is a word written in permanent marker — once you write it, you cannot replace that word with a different one.',
      'let is written in pencil, so you can erase and rewrite it. Knowing which "pen" to use keeps your house from getting confusing and full of mix-ups.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript you make a variable with one of three keywords: var, let, or const.',
    'let and const are "block scoped", meaning they only exist inside the nearest pair of curly braces { } where you made them.',
    'var is "function scoped" — it leaks out to the whole function it is in, which can cause surprises.',
    'const means you cannot point the name at a new value later; let means you can change it. Use const unless you know you need to reassign.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'var, let, and const are the three ways to declare variables. var is function-scoped and hoisted with an undefined initialization; let and const are block-scoped and live in a temporal dead zone until their declaration. const additionally forbids reassigning the binding.',
    how: 'Use block-scoped let/const so a variable only exists where it is needed. Reach for const by default (you cannot reassign it), use let when you must reassign, and avoid var to prevent function-scope leaks and hoisting surprises.',
    why: 'Block scope and the TDZ make code predictable: variables do not leak, using one too early throws a clear error, and const documents intent and prevents accidental reassignment.',
    code: {
      label: 'Scope and reassignment differences',
      lang: 'js',
      code: `function demo() {\n  if (true) {\n    var a = 1     // function-scoped: leaks out of the if-block\n    let b = 2     // block-scoped: only inside this if\n    const c = 3   // block-scoped + cannot be reassigned\n  }\n  console.log(a)  // 1 (var leaked)\n  // console.log(b) // ReferenceError (b is block scoped)\n}\ndemo()`,
      explanation: [
        '`var a` is visible throughout the whole function, even outside the if-block.',
        '`let b` and `const c` exist only inside the { } of the if-block.',
        'Accessing b outside the block throws a ReferenceError — that is good, it catches mistakes.',
        '`const c` cannot be pointed at a new value later; attempting `c = 9` throws a TypeError.',
        'This is why modern code prefers let/const over var.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'var declarations are function-scoped (or global) and are hoisted to the top of their scope and initialized to undefined, so they are readable before the textual declaration. let and const are block-scoped and are also hoisted, but remain in the Temporal Dead Zone — uninitialized and inaccessible (throwing a ReferenceError) — from the start of the block until execution reaches the declaration. const creates an immutable binding: the variable cannot be reassigned, though the value it references (if an object) can still be mutated. Redeclaration rules also differ: var allows redeclaration in the same scope, while let/const do not.',

  // 7. Internal Working
  internalWorking: [
    'During the creation phase of an execution context, the engine scans for declarations: var bindings are created in the variable environment and initialized to undefined.',
    'let and const bindings are also created (hoisted) in the lexical environment but left uninitialized, entering the Temporal Dead Zone.',
    'Any access to a let/const binding before its declaration is evaluated throws a ReferenceError, because the binding exists but has no value yet.',
    'When execution reaches a let/const declaration, the binding is initialized (to its value or undefined for let with no initializer), ending the TDZ.',
    'For var, function scope means a single binding shared across the whole function; for let/const, each block — and each loop iteration with let — gets a fresh binding.',
    'const binds the name to its value permanently; the engine rejects reassignment of the binding with a TypeError, though object/array contents remain mutable.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   FUNCTION SCOPE                 BLOCK SCOPE { }
   ┌───────────────────────┐      ┌──────────────────────┐
   │ var x  (whole func)   │      │ let y / const z      │
   │   visible everywhere  │      │   visible only here  │
   │   in this function    │      └──────────────────────┘
   └───────────────────────┘

   TIMELINE inside a block:
   |== TDZ (let/const exist but unusable) ==| declaration | usable -->
   var:  undefined from the very top --------- declaration | usable -->`,

  // 9. Memory Visualization
  memoryVisualization: [
    'BINDINGS: var lives in the function\'s variable environment (one slot for the whole function); let/const live in the block\'s lexical environment (one slot per block).',
    'TDZ: a let/const slot exists in the environment record but holds a special "uninitialized" marker until the declaration runs.',
    'PER-ITERATION: a `for (let i...)` loop creates a brand-new `i` binding each iteration, so closures capture distinct values.',
    'const + objects: the binding (the stack slot/name) is fixed, but if it points to a heap object, that object\'s properties can still change.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — const blocks reassignment, not mutation',
      lang: 'js',
      code: `const n = 5\n// n = 6           // TypeError: Assignment to constant variable\n\nconst obj = { a: 1 }\nobj.a = 99         // OK! mutating the object is allowed\nconsole.log(obj.a) // 99`,
      explanation: [
        '`const n` cannot be reassigned to a new value.',
        'But `const obj` only freezes the binding, not the object it points to.',
        'Mutating obj.a is allowed because the reference itself never changes.',
        'Use Object.freeze(obj) if you also want to prevent mutation.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the classic loop bug',
      lang: 'js',
      code: `// var: prints 3, 3, 3 (one shared binding)\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}\n\n// let: prints 0, 1, 2 (fresh binding per iteration)\nfor (let j = 0; j < 3; j++) {\n  setTimeout(() => console.log(j), 0)\n}`,
      explanation: [
        'With var there is ONE `i` for the whole loop; by the time the timers fire it is 3.',
        'All three callbacks close over the same `i`, so all print 3.',
        'With let, each iteration creates a NEW `j`, so each closure captures a different value.',
        'This is the single most common var/let interview question.',
      ],
    },
    advanced: {
      label: 'Advanced — temporal dead zone in action',
      lang: 'js',
      code: `console.log(a)   // undefined (var hoisted + initialized)\nvar a = 1\n\n// console.log(b) // ReferenceError: Cannot access 'b' before initialization\nlet b = 2\n\nfunction tdz() {\n  // typeof guard does NOT save you here:\n  // console.log(typeof c) // ReferenceError (c is in TDZ)\n  let c = 3\n}`,
      explanation: [
        'var a is hoisted and pre-initialized to undefined, so reading it early is allowed (but undefined).',
        'let b is hoisted but in the TDZ, so reading it before the declaration throws.',
        'Even typeof, which is normally safe for undeclared names, throws for a TDZ variable.',
        'The TDZ exists to catch "use before declare" bugs early.',
      ],
    },
    realProject: {
      label: 'Real project — const-first style in a Vue/React component',
      lang: 'js',
      code: `// React-style: const for values that don't get reassigned\nfunction Cart({ items }) {\n  const total = items.reduce((sum, it) => sum + it.price, 0) // never reassigned\n  let discount = 0                                            // reassigned below\n  if (total > 100) discount = total * 0.1\n  const payable = total - discount\n  return { total, payable }\n}`,
      explanation: [
        'const is used for total and payable because they are computed once and never reassigned.',
        'let is used for discount because it is conditionally updated.',
        'Defaulting to const makes intent obvious and prevents accidental reassignment bugs.',
        'This const-first, let-when-needed, never-var style is standard in modern Vue/React/Node code.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between var, let, and const?',
      answer: 'var is function-scoped and hoisted (initialized to undefined). let and const are block-scoped and sit in the temporal dead zone until declared. const cannot be reassigned, while let and var can.',
      explanation: 'A strong answer covers scope, hoisting/TDZ, and reassignment in one breath.',
    },
    {
      level: 'beginner',
      question: 'Does const make an object immutable?',
      answer: 'No. const prevents reassigning the binding, but you can still mutate the object or array it references. Use Object.freeze() for shallow immutability.',
      explanation: 'This binding-vs-value distinction is a frequent gotcha and a common follow-up.',
    },
    {
      level: 'intermediate',
      question: 'What is the temporal dead zone?',
      answer: 'The span from the start of a block until a let/const declaration is evaluated, during which the variable exists but accessing it throws a ReferenceError. var has no TDZ because it is initialized to undefined when hoisted.',
      explanation: 'Mentioning that even typeof throws for a TDZ variable shows deeper understanding.',
    },
    {
      level: 'intermediate',
      question: 'Why does a var loop with setTimeout print the same final value?',
      answer: 'Because var is function-scoped: all iterations share one binding, which holds the final value by the time the async callbacks run. let fixes it by creating a fresh per-iteration binding.',
      explanation: 'The shared-binding-vs-per-iteration-binding insight is the key point.',
    },
    {
      level: 'advanced',
      question: 'How are var and let/const hoisted differently?',
      answer: 'All are hoisted in the sense that their bindings are created at the top of their scope. var is also initialized to undefined immediately, so it is readable early; let/const are left uninitialized in the TDZ and throw if accessed before their declaration.',
      explanation: 'Senior signal: "hoisting" applies to all, but initialization timing differs.',
    },
    {
      level: 'senior',
      question: 'When, if ever, would you still use var, and why prefer const by default?',
      answer: 'Practically never in new code — var is kept for legacy compatibility. const by default signals immutability of the binding, prevents accidental reassignment, and makes code easier to reason about; let is used only where reassignment is genuinely needed.',
      explanation: 'Demonstrates idiomatic judgement and awareness of intent-communicating code.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is hoisting, and how does it apply to function declarations vs var vs let/const?',
    'Why does typeof throw for a TDZ variable but not for a totally undeclared name?',
    'How does block scope interact with closures?',
    'Can you redeclare a variable with let in the same scope? (No)',
    'What does "use strict" change about undeclared assignments?',
    'How does const help tree-shakers and tooling reason about code?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking const makes objects/arrays immutable.',
      why: 'const only locks the binding; the referenced heap object can still be mutated.',
      fix: 'Use Object.freeze() (shallow) or immutable update patterns when you need real immutability.',
    },
    {
      mistake: 'Using var in loops with async callbacks and expecting per-iteration values.',
      why: 'var shares one function-scoped binding across all iterations.',
      fix: 'Use let for a fresh per-iteration binding (or an IIFE to capture the value).',
    },
    {
      mistake: 'Assuming let/const are not hoisted.',
      why: 'They are hoisted, but stay uninitialized in the TDZ, which is why early access throws.',
      fix: 'Remember "hoisted but in TDZ" — declare variables before using them.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Components are written const-first; hooks return values are usually const, and let is reserved for genuinely reassigned locals — linters (eslint prefer-const) enforce this.' },
    { area: 'Vue', detail: 'Composables and setup() use const for refs and computed values; block scoping keeps temporary variables from leaking and causing reactivity confusion.' },
    { area: 'Node.js', detail: 'Module code uses const for imports and configuration; var is avoided so function-scope leaks do not cause subtle bugs in long files.' },
    { area: 'Backend', detail: 'const-by-default plus block scope make request handlers easier to reason about and reduce accidental shared-state bugs across branches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Block scoping helps the engine and humans reason about variable lifetimes precisely.',
      'const communicates immutability of the binding, enabling clearer optimizations and tooling (tree-shaking, dead-code elimination).',
    ],
    bad: [
      'Misusing var can create accidental long-lived function-scoped bindings that keep data alive longer than needed.',
      'There is no meaningful runtime speed difference between them; choosing var for "performance" is a myth.',
    ],
    optimizations: [
      'Default to const, use let only when reassigning, and avoid var entirely in new code.',
      'Declare variables in the narrowest block that needs them to limit their lifetime.',
      'Enable eslint rules (prefer-const, no-var) to enforce idiomatic usage automatically.',
      'Prefer per-iteration let in loops to avoid closure-capture bugs and unintended shared state.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'scope'],
    nextConcepts: ['hoisting', 'temporal-dead-zone', 'scope-chain', 'closure', 'strict-mode'],
    dependencyNote:
      'var/let/const is the entry point to the scope spine: it leads directly into hoisting and the temporal-dead-zone, and understanding block scope here is a prerequisite for scope-chain and closure.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a big box "function scope" and a smaller box inside it "block { }".',
      'Put var in the big box (visible everywhere) and let/const in the small box (visible only inside).',
      'Draw a timeline: mark TDZ before the let/const declaration where access throws.',
      'Show var on the same timeline as "undefined from the top".',
      'Write a tiny var-loop vs let-loop and annotate "3,3,3 vs 0,1,2".',
      'Conclude: "const by default, let when reassigning, never var".',
    ],
    diagram: `  ┌ function ─────────────┐
  │ var x  (whole func)   │
  │  ┌ block { } ───────┐ │
  │  │ let y / const z  │ │
  │  └──────────────────┘ │
  └───────────────────────┘
  TDZ |--- let/const unusable ---| decl | usable`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'var is function-scoped and hoisted to undefined, so it is readable before declaration and leaks out of blocks. let and const are block-scoped and live in the temporal dead zone until declared, so early access throws a ReferenceError. const cannot be reassigned, but its referenced object can still be mutated. The classic var-loop bug (3,3,3) comes from one shared binding; let fixes it with a fresh binding per iteration. Modern style: const by default, let when you must reassign, never var.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript has three declaration keywords, and the differences come down to scope, hoisting, and reassignment. var is function-scoped: it belongs to the whole enclosing function regardless of any inner blocks, and it is hoisted and initialized to undefined, so you can read it before its line and just get undefined. let and const are block-scoped, meaning they only exist inside the nearest pair of curly braces. They are also hoisted, but instead of being initialized they sit in the temporal dead zone — the binding exists but accessing it before the declaration throws a ReferenceError, which is helpful because it catches use-before-declare mistakes; even typeof throws there. const adds one more rule: the binding cannot be reassigned. A crucial nuance is that const does not make objects immutable — you can still mutate the object or array it points to, because only the binding is fixed. The most famous consequence of var being function-scoped is the loop bug: a var loop with async callbacks prints the final value every time because all iterations share one binding, whereas a let loop creates a fresh binding each iteration and prints the distinct values. In modern code the guidance is simple and what teams enforce with linters: default to const, use let only when you genuinely need to reassign, and avoid var entirely, both to prevent scope leaks and to make intent clear.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'const-by-default maximizes clarity but occasionally forces a let where a value is conditionally built — readability usually wins.',
      'Block scoping prevents leaks but means you must declare in the right block; over-narrowing can require restructuring.',
    ],
    edgeCases: [
      'A const object can be fully mutated; only the binding is protected — a common source of confusion.',
      'TDZ also applies inside the same statement: `let x = x` throws because the right-hand x is still in the TDZ.',
      'In loops, `for (let i...)` creates a new binding per iteration, but `for (const i...)` only works when not reassigning i (e.g. for...of).',
    ],
    runtimeBehavior: [
      'All three are hoisted; the difference is initialization timing (var: undefined immediately; let/const: uninitialized in TDZ).',
      'Per-iteration let bindings are what make closures in loops capture distinct values.',
      'Redeclaration with let/const in the same scope is a SyntaxError; var permits it.',
    ],
    scalability: [
      'In large files, var\'s function scope makes reasoning about state harder; block scope keeps mental load local.',
      'const-heavy code is easier for tooling (tree-shaking, refactors) and humans to analyze at scale.',
    ],
    productionConcerns: [
      'Enforce no-var and prefer-const via ESLint to keep a codebase consistent.',
      'Watch for accidental mutation of const objects when immutability is assumed.',
      'Be aware transpilers may rewrite let/const to var for old targets, reintroducing some semantics at runtime.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'var = function-scoped, hoisted to undefined, redeclarable.',
    'let = block-scoped, TDZ, reassignable, not redeclarable.',
    'const = block-scoped, TDZ, NOT reassignable, not redeclarable.',
    'const locks the BINDING, not the object (you can still mutate).',
    'TDZ: access before declaration throws ReferenceError (even typeof).',
    'All three are hoisted; only var is pre-initialized to undefined.',
    'var loop + async => shared binding (3,3,3); let => per-iteration (0,1,2).',
    'Modern rule: const by default, let when reassigning, never var.',
    'Object.freeze() for shallow immutability of a const object.',
    'let/const redeclaration in same scope = SyntaxError.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict and explain the output: `console.log(x); var x = 5;`',
      hint: 'var is hoisted and initialized to undefined.',
      solution: {
        lang: 'js',
        code: `console.log(x) // undefined\nvar x = 5`,
        explanation: [
          'var x is hoisted to the top of the scope and initialized to undefined.',
          'So the log runs before the assignment and prints undefined, not a ReferenceError.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make this loop print 0,1,2 with setTimeout, changing as little as possible.',
      hint: 'One keyword change fixes the binding scope.',
      solution: {
        lang: 'js',
        code: `for (let i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0)\n}`,
        explanation: [
          'Switching var to let gives each iteration its own binding of i.',
          'Each setTimeout closure captures a distinct i, printing 0, 1, 2.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why `let a = a;` throws, and rewrite to safely initialize a from a previous value.',
      hint: 'The right-hand a is still in the TDZ.',
      solution: {
        lang: 'js',
        code: `// let a = a  // ReferenceError: a is in the TDZ on the right-hand side\nlet prev = 0\nlet a = prev + 1   // safe: prev is already initialized\nconsole.log(a)     // 1`,
        explanation: [
          'In `let a = a`, the binding a exists but is uninitialized (TDZ) when the right side is evaluated, so it throws.',
          'Using a different, already-initialized variable avoids the TDZ access.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Show that const prevents reassignment but not mutation, and add real immutability.',
      hint: 'Object.freeze for shallow immutability.',
      solution: {
        lang: 'js',
        code: `const cfg = { mode: 'dev' }\ncfg.mode = 'prod'        // allowed: mutation\n// cfg = {}              // TypeError: reassignment\n\nconst frozen = Object.freeze({ mode: 'dev' })\nfrozen.mode = 'prod'     // silently ignored (throws in strict mode)\nconsole.log(frozen.mode) // 'dev'`,
        explanation: [
          'const blocks pointing cfg at a new object but allows changing cfg\'s properties.',
          'Object.freeze prevents adding/changing top-level properties.',
          'In strict mode, writing to a frozen property throws; otherwise it is silently ignored.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is the most common opening interview question, and a crisp answer instantly establishes that your fundamentals are solid. It also prevents real bugs around scope, hoisting, and accidental mutation.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the straight "difference between var, let, const" and the var-loop output. Product companies (Zoho, Flipkart, Razorpay) probe the TDZ and const-object mutation. FAANG-level interviews ask about hoisting initialization timing and per-iteration bindings.',
    whatInterviewersExpect:
      'They expect scope (function vs block), hoisting/TDZ behavior, reassignment rules, the const-object nuance, the var-loop explanation, and the idiomatic "const by default" recommendation.',
  },
}

export default varLetConst
