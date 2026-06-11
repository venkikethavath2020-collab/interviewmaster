import type { ConceptLesson } from '../../../types/lesson'

const arrowFunctions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'arrow-functions',
  name: 'Arrow Functions',
  category: 'functions',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Arrow functions solved the single most annoying JavaScript bug — losing `this` in callbacks — by capturing `this` lexically from where they are defined.',
    'They are the default function form in modern code: callbacks, array methods, React/Vue handlers, and composables almost all use arrows.',
    'Knowing exactly what arrows DO NOT have (own this, arguments, prototype, new) is a top interview discriminator.',
    'Misusing arrows (e.g. as object methods or Vue Options methods) causes silent `this` bugs, so you must know when NOT to use them.',
    'Their concise syntax and implicit return make functional code (map/filter/reduce, currying) readable, but the implicit-return rules trip people up.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An arrow function is like a kid who always wears the family name tag of wherever they were born — no matter whose house they visit, they keep their original family name.',
    story: [
      'Imagine a child who, the day they are born, gets a family name tag they can never swap.',
      'They might go play at many different friends\' houses, but their name tag always says THEIR family.',
      'Even if a friend tries to give them a new name tag, it does not stick — the original stays.',
      'A regular function gets a new "name tag" (its `this`) depending on whose house it is called in. But an arrow function keeps the `this` from where it was born — its definition place — forever, no matter where it is later called.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An arrow function is a shorter way to write a function using => instead of the function keyword.',
    'The big special rule: an arrow function does not get its own `this`. Instead it borrows `this` from the place where you wrote it.',
    'This is great for callbacks inside a method, because the arrow keeps the method\'s `this` instead of losing it.',
    'Arrows also let you skip the word return for one-line functions, making short helper functions very compact.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An arrow function is a concise function expression using the => syntax that does NOT bind its own this, arguments, super, or new.target. It captures this lexically from the enclosing scope at definition time and cannot be used as a constructor.',
    how: 'You write (params) => expression for an implicit return, or (params) => { statements; return ... } for a block body. When the arrow references this, the engine resolves it by walking the scope chain to the nearest enclosing non-arrow function/scope, fixed where the arrow was defined.',
    why: 'Lexical this makes arrows ideal for callbacks (no lost context), and the concise syntax keeps functional code readable. The trade-off is you cannot rebind this or use them where dynamic this is needed (object methods, constructors, prototypes).',
    code: {
      label: 'Lexical this in a callback',
      lang: 'js',
      code: `const timer = {\n  count: 0,\n  start() {\n    setInterval(() => {\n      this.count++          // arrow: this = timer (lexical)\n      console.log(this.count)\n    }, 1000)\n  },\n}\ntimer.start() // 1, 2, 3, ...`,
      explanation: [
        'The arrow callback has no own `this`, so it inherits `this` from `start`.',
        'Inside `start`, `this` is `timer` (implicit binding), so the arrow\'s `this` is `timer` too.',
        '`this.count` therefore correctly updates `timer.count`.',
        'A regular `function(){ this.count++ }` callback would lose `this` (default binding) and break.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An arrow function is a function expression with the => syntax that lacks its own this binding, arguments object, super reference, new.target, and prototype property. this (and arguments, super, new.target) are resolved lexically from the enclosing lexical environment at definition time, so they cannot be overridden by call/apply/bind. Arrow functions are not constructable — invoking them with new throws a TypeError. They support concise bodies with implicit return and are syntactically always expressions, never declarations.',

  // 7. Internal Working
  internalWorking: [
    'At definition, an arrow function captures references to the enclosing scope\'s this, arguments, super, and new.target — it does not create its own bindings for them.',
    'When the arrow runs, any reference to this resolves via the scope chain to the nearest enclosing ordinary function (or module/global), exactly as it was at definition.',
    'Because there is no own this binding, call/apply/bind can pass arguments but cannot change the arrow\'s this.',
    'Arrows have no [[Construct]] internal method and no prototype property, so `new arrow()` throws a TypeError.',
    'There is no local `arguments` object; referencing arguments inside an arrow reaches the enclosing function\'s arguments (or is undefined at top level) — rest params (...args) are the modern alternative.',
    'A concise-body arrow (no braces) implicitly returns its expression; a block-body arrow requires an explicit return, and returning an object literal needs parentheses to disambiguate from a block.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  REGULAR FUNCTION                   ARROW FUNCTION
  ────────────────                   ──────────────
  has its OWN: this, arguments,      has NONE of its own:
              new, prototype           this, arguments, new, prototype
  this = decided by CALL SITE        this = inherited from DEFINITION scope

      obj.method()  -> this=obj          () => this  ──┐ looks up
      fn()          -> this=undefined                  │ enclosing scope
      new Fn()      -> this=instance                   ▼
                                              enclosing function's this
  call/apply/bind CAN set this       call/apply/bind CANNOT set this`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — concise syntax and implicit return',
      lang: 'js',
      code: `const square = (n) => n * n        // implicit return\nconst greet = (name) => 'Hi ' + name\nconst log = () => console.log('hi') // no params -> ()\nsquare(4) // 16`,
      explanation: [
        'A single expression body returns implicitly — no `return` keyword needed.',
        'With one parameter you may omit parentheses, but keeping them is consistent and lint-friendly.',
        'With zero parameters you must write empty parentheses ().',
        'These compact forms make functional pipelines readable.',
      ],
    },
    intermediate: {
      label: 'Intermediate — returning an object literal needs parentheses',
      lang: 'js',
      code: `const makeUser = (name) => ({ name, active: true })\nmakeUser('Sam') // { name: 'Sam', active: true }\n\n// WRONG: braces are read as a block, returns undefined\nconst bad = (name) => { name }\nbad('Sam') // undefined`,
      explanation: [
        'To implicitly return an object literal, wrap it in parentheses so { } is not parsed as a block.',
        'Without parentheses, { name } is a block containing a label/expression statement, not an object.',
        '`bad` therefore returns undefined — a very common beginner gotcha.',
        'The parentheses tell the parser "this is an expression to return".',
      ],
    },
    advanced: {
      label: 'Advanced — arrows cannot be rebound or constructed',
      lang: 'js',
      code: `const f = () => this       // this is lexical (module: undefined / object)\nf.call({ x: 1 })           // still NOT { x: 1 } — bind/call ignored for this\n\nconst Animal = () => {}\ntry {\n  new Animal()             // TypeError: Animal is not a constructor\n} catch (e) { console.log(e.constructor.name) } // "TypeError"`,
      explanation: [
        'Arrows have no own this, so call/apply/bind cannot change it (args still pass through).',
        'They have no [[Construct]] method and no prototype, so `new` throws a TypeError.',
        'This is exactly why you must NOT use arrows for constructors or object methods needing dynamic this.',
        'Knowing these limits is a frequent interview check.',
      ],
    },
    realProject: {
      label: 'Real project — arrows in array methods and a React handler',
      lang: 'js',
      code: `const users = [{ age: 20 }, { age: 30 }, { age: 40 }]\nconst adults = users.filter((u) => u.age >= 21).map((u) => u.age)\n// adults = [30, 40]\n\n// React: stable handler via useCallback + arrow\n// const onClick = useCallback((e) => setCount((c) => c + 1), [])`,
      explanation: [
        'Arrows are the idiomatic callback form for map/filter/reduce — concise and lexically scoped.',
        'The functional-update arrow (c) => c + 1 avoids stale closures over state.',
        'In React, arrows are the default for event handlers and effect callbacks.',
        'Their lexical this means handlers inside components/classes keep the right context.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do arrow functions differ from regular functions regarding `this`?',
      answer: 'Arrow functions do not have their own `this`; they capture it lexically from the enclosing scope at definition time. Regular functions determine `this` from the call site. So call/apply/bind cannot change an arrow\'s `this`.',
      explanation: 'The lexical-this answer is the single most expected point.',
    },
    {
      level: 'beginner',
      question: 'What does an arrow function NOT have?',
      answer: 'No own this, no arguments object, no prototype, cannot be used with new (not a constructor), and no own super/new.target. It also cannot be a generator with function* syntax.',
      explanation: 'Tests the full list of arrow limitations.',
    },
    {
      level: 'intermediate',
      question: 'When should you NOT use an arrow function?',
      answer: 'As object methods that need dynamic this, as constructors, as prototype methods, and as Vue Options API methods/lifecycle — because they would not bind this to the instance/receiver. Also when you need the arguments object.',
      explanation: 'Shows practical judgment about misuse, not just definition.',
    },
    {
      level: 'intermediate',
      question: 'Why does (x) => { foo: x } not return an object?',
      answer: 'Because the braces are parsed as a block body, not an object literal; foo: x is read as a label and expression, and the arrow returns undefined. Wrap the object in parentheses: (x) => ({ foo: x }).',
      explanation: 'A common syntax gotcha demonstrating concise-body parsing.',
    },
    {
      level: 'advanced',
      question: 'Can you change an arrow function\'s this with bind, call, or apply?',
      answer: 'No. Arrows have no own this binding, so the thisArg is ignored for this resolution (arguments still pass through for call/apply). this stays whatever it was lexically at definition.',
      explanation: 'Confirms understanding that lexical this is immutable.',
    },
    {
      level: 'senior',
      question: 'How does the engine resolve this/arguments inside an arrow, and what are the implications for hot paths?',
      answer: 'The arrow has no own bindings for this/arguments/super/new.target; they are resolved by walking the scope chain to the nearest enclosing ordinary function, captured at definition. This makes arrows ideal for callbacks but means each arrow created in a render/loop is a new allocation, so hoist or memoize stable arrows in hot paths to avoid GC churn and broken referential equality.',
      explanation: 'Senior signal: lexical resolution mechanism plus allocation/performance and referential-identity concerns.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Are arrow functions hoisted? (no — they are expressions, assigned to consts -> TDZ)',
    'How do you access variadic args in an arrow without `arguments`? (rest params ...args)',
    'Why can\'t arrows be used as constructors?',
    'What is the difference between concise body and block body return rules?',
    'How do arrows interact with generators? (you cannot write an arrow generator)',
    'Why are arrows a problem as Vue Options API methods?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using an arrow function as an object method that relies on `this`.',
      why: 'The arrow captures the outer (often global/undefined) this, not the object, so this.prop breaks.',
      fix: 'Use a regular method shorthand: { method() { return this.x } } when you need the receiver.',
    },
    {
      mistake: 'Trying to return an object with concise-body braces.',
      why: '{ } is parsed as a block, not an object literal, so it returns undefined.',
      fix: 'Wrap the object in parentheses: () => ({ key: value }).',
    },
    {
      mistake: 'Expecting `arguments` inside an arrow.',
      why: 'Arrows have no own arguments object; it refers to the enclosing function\'s (or is undefined).',
      fix: 'Use rest parameters: (...args) => { ... }.',
    },
    {
      mistake: 'Trying to rebind an arrow with bind/call/apply.',
      why: 'Arrows have no own this, so the thisArg is ignored.',
      fix: 'Use a regular function when you need dynamic or rebindable this.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Arrows are the default for event handlers, effect callbacks, and functional state updates (setX(c => c + 1)); class field arrows bind handlers to the instance lexically.' },
    { area: 'Vue', detail: 'Arrows are ideal inside composables and watchers (lexical this), but must NOT be used for Options API methods/computed/lifecycle, where this must be the component instance.' },
    { area: 'Node.js', detail: 'Arrows keep `this`/context in async callbacks and promise chains, avoiding the old const self = this workaround; rest params replace arguments.' },
    { area: 'Backend', detail: 'Functional helpers (map/filter/reduce pipelines) and middleware closures use concise arrows; avoid arrows for class methods that rely on instance this via dynamic dispatch.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lexical this removes defensive const self = this allocations and avoids a class of context bugs.',
      'Concise arrows keep functional pipelines readable with no runtime penalty once defined.',
    ],
    bad: [
      'Creating a new arrow on every render/iteration allocates a fresh function, adding GC pressure and breaking referential equality (causing extra React re-renders).',
      'Inline arrows in JSX props recreate handlers each render, which can defeat memoized child components.',
    ],
    optimizations: [
      'Hoist stable arrows out of loops/renders or wrap with useCallback to keep a stable reference.',
      'Use rest params instead of arguments and avoid recreating closures in hot paths.',
      'For methods needing dynamic this, prefer regular methods to avoid per-instance arrow allocations when many instances exist.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['function-declaration-vs-expression', 'this-keyword', 'scope'],
    nextConcepts: ['call-apply-bind', 'closure', 'higher-order-functions', 'default-rest-spread'],
    dependencyNote:
      'Arrow functions are a specialized function expression whose defining trait is lexical this, so understand function expressions and `this` first; they pair naturally with call/apply/bind (which cannot rebind them) and with higher-order functions and rest/spread.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: regular function vs arrow function.',
      'Under regular: own this (call-site decided), arguments, new, prototype.',
      'Under arrow: NONE of those — this is lexical (definition scope).',
      'Show a method with a setInterval callback: arrow keeps this=obj, regular loses it.',
      'Conclude: "Use arrows for callbacks (lexical this); avoid them for methods/constructors needing dynamic this."',
    ],
    diagram: `  REGULAR                       ARROW
  own this (call site)          this = lexical (definition)
  has arguments                 no arguments (use ...rest)
  new OK, has prototype         new -> TypeError, no prototype
  bind/call/apply set this      bind/call/apply CANNOT set this

  obj.method(){ setInterval(()=>this.x++) }  // arrow keeps obj`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Arrow functions use => and do NOT have their own this, arguments, prototype, or new — they capture this lexically from where they are defined, so call/apply/bind cannot rebind it. That makes them perfect for callbacks (no lost context) and concise functional code with implicit return. Do not use them as object methods, constructors, prototype methods, or Vue Options methods, where dynamic this to the receiver is required. Remember to wrap a returned object literal in parentheses.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Arrow functions are a concise function-expression syntax using the fat arrow, but their defining behavior is lexical this. Unlike a regular function, an arrow does not have its own this — instead it captures this from the enclosing scope at the moment it is defined, and that binding is fixed. This is exactly why arrows fixed the most common JavaScript bug: a callback inside a method used to lose this when it was later called standalone, forcing the old const self = this workaround. With an arrow, the callback simply inherits the method\'s this. Beyond this, arrows also lack their own arguments object — you use rest parameters instead — and they have no prototype and no construct behavior, so calling one with new throws a TypeError. A consequence of lexical this is that call, apply, and bind cannot change an arrow\'s this; they can pass arguments but the this is ignored. Syntactically, arrows support an implicit return for a single expression, which keeps map/filter/reduce pipelines readable, with the gotcha that to implicitly return an object literal you must wrap it in parentheses, otherwise the braces are parsed as a block. The key judgment for an interview is knowing when not to use them: object methods, prototype methods, constructors, and Vue Options API methods all need dynamic this bound to the instance or receiver, so a regular function is correct there.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Lexical this is safe and ergonomic for callbacks but removes flexibility — you cannot reuse an arrow across receivers or rebind it.',
      'Concise implicit return improves readability but introduces parsing gotchas (object literals) and can hide complex logic in one line.',
    ],
    edgeCases: [
      'Returning an object literal requires parentheses, else braces are a block returning undefined.',
      'arguments inside an arrow refers to the enclosing function\'s arguments, not the arrow\'s.',
      'new on an arrow throws because arrows have no [[Construct]] or prototype.',
      'Arrows cannot be generators; there is no arrow generator syntax.',
    ],
    runtimeBehavior: [
      'this/arguments/super/new.target resolve by scope-chain lookup to the nearest ordinary function, captured at definition.',
      'bind/call/apply pass args but never change an arrow\'s this.',
      'Each arrow expression evaluated creates a new function object — relevant for identity-based memoization.',
    ],
    scalability: [
      'In hot render paths, recreating arrows per render breaks referential equality and can trigger unnecessary child re-renders — memoize with useCallback or hoist.',
      'For classes with many instances, per-instance field arrows cost memory vs shared prototype methods; choose based on instance count and binding needs.',
    ],
    productionConcerns: [
      'Silent this bugs from using arrows as object/Vue Options methods are common and hard to spot — enforce conventions/lint.',
      'Inline JSX arrow props defeating React.memo is a frequent perf regression; profile and stabilize handlers.',
      'Stack traces for anonymous arrows can be unclear; rely on variable-name inference and source maps.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Arrow = concise function expression using =>.',
    'NO own this -> lexical, captured at definition; bind/call/apply cannot change it.',
    'NO own arguments -> use rest params (...args).',
    'NO prototype, NOT a constructor -> new throws TypeError.',
    'Implicit return for single-expression bodies.',
    'Return an object literal: wrap in parens -> () => ({ a: 1 }).',
    'Ideal for callbacks, array methods, functional updates.',
    'Do NOT use as object/prototype methods needing dynamic this.',
    'Do NOT use as Vue Options API methods/computed/lifecycle.',
    'Always expressions -> not hoisted as values (TDZ when const).',
    'Cannot be a generator (no arrow function*).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite as an arrow with implicit return: function inc(n){ return n + 1 }',
      hint: 'Single expression -> no braces, no return.',
      solution: {
        lang: 'js',
        code: `const inc = (n) => n + 1\ninc(4) // 5`,
        explanation: [
          'The single expression n + 1 is implicitly returned.',
          'No braces and no return keyword are needed for a concise body.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Fix this arrow so it returns the object: const make = (id) => { id, ok: true }',
      hint: 'Wrap the object literal in parentheses.',
      solution: {
        lang: 'js',
        code: `const make = (id) => ({ id, ok: true })\nmake(7) // { id: 7, ok: true }`,
        explanation: [
          'The original braces were parsed as a block, so it returned undefined.',
          'Wrapping the object in parentheses makes it an expression that is implicitly returned.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why this logs undefined and fix it: const obj = { x: 5, get: () => this.x }; console.log(obj.get())',
      hint: 'Arrows capture this lexically, not the object.',
      solution: {
        lang: 'js',
        code: `const obj = {\n  x: 5,\n  get() { return this.x }, // regular method -> this = obj\n}\nconsole.log(obj.get()) // 5`,
        explanation: [
          'The original arrow captured the outer this (module/undefined), not obj, so this.x was undefined.',
          'A regular method gets this from the call site (obj.get() -> this = obj).',
          'Use method shorthand for object methods that rely on this.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Use an arrow + rest params to sum any number of arguments (no arguments object).',
      hint: 'Arrows have no arguments; gather with ...nums.',
      solution: {
        lang: 'js',
        code: `const sum = (...nums) => nums.reduce((a, b) => a + b, 0)\nsum(1, 2, 3, 4) // 10`,
        explanation: [
          'Rest params gather all arguments into a real array `nums`, since arrows lack `arguments`.',
          'reduce with an arrow accumulator computes the total.',
          'This is the idiomatic variadic pattern for arrow functions.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Arrow functions are everywhere in modern JS, and the lexical-this rule is one of the highest-signal facts you can demonstrate. Knowing precisely what arrows lack — and when NOT to use them — instantly marks you as someone who understands `this`, not just syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do arrows differ from regular functions" (lexical this). Product companies (Zoho, Flipkart, Razorpay) probe the object-literal return gotcha and when arrows break as methods. FAANG interviews dig into lexical resolution, the no-bind rule, and arrow allocation/referential-equality in render paths.',
    whatInterviewersExpect:
      'They expect lexical this front and center, the full list of what arrows lack (this/arguments/prototype/new), correct judgment on when not to use them, and the concise-body/object-return syntax nuances.',
  },
}

export default arrowFunctions
