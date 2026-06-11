import type { ConceptLesson } from '../../../types/lesson'

const thisKeyword: ConceptLesson = {
  // 1. Concept Summary
  slug: 'this-keyword',
  name: 'this',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    '`this` is the single most misunderstood keyword in JavaScript, and getting it wrong causes "Cannot read property of undefined" errors when methods are passed as callbacks.',
    'Its value depends on HOW a function is called, not where it is defined — a rule that trips up developers from every other language.',
    'Understanding `this` is essential for event handlers, class methods, React/Vue method binding, and using call/apply/bind correctly.',
    'Arrow functions vs regular functions differ entirely in how they handle `this`, which is a top interview discriminator.',
    'Almost every framework bug about "lost context" or "undefined this" comes from not knowing the four binding rules.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: '`this` is like the word "here" — its meaning depends on where you are standing when you say it, not where you wrote it down.',
    story: [
      'Imagine you write a note that says "the snacks are HERE".',
      'If you read that note in the kitchen, "here" means the kitchen. If you read it in the living room, "here" means the living room.',
      'The word "here" did not change — but what it points to depends on WHERE you are when you read it.',
      '`this` works the same way: the same function can mean different things depending on how and where it is called. You only find out what `this` points to at the moment the function actually runs.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript, `this` is a special word inside a function that points to "who is calling me right now".',
    'If you call a function as someone\'s method (like person.greet()), then `this` is that person.',
    'If you call the same function on its own (just greet()), `this` is something default — usually undefined in strict mode.',
    'So `this` is not decided when you write the function; it is decided each time you call it, based on the way you call it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: '`this` is a reference that is determined at call time, pointing to the object a function is invoked on (its execution context). The same function can have different `this` values depending on the call site, governed by four binding rules: default, implicit, explicit, and new.',
    how: 'When a function runs, the engine sets `this` based on how it was called: standalone (default → undefined in strict mode / global otherwise), as obj.method() (implicit → obj), via call/apply/bind (explicit → the given object), or with new (construction → the new instance). Arrow functions ignore all of this and inherit `this` lexically from where they were defined.',
    why: 'It lets the same method body work across many objects (reuse), and it underpins constructors, event handlers, and method binding. Knowing the rules prevents the classic "lost this" bug.',
    code: {
      label: 'Same function, different this depending on call site',
      lang: 'js',
      code: `'use strict'\nfunction whoAmI() {\n  return this\n}\nconst user = { name: 'Sam', whoAmI }\n\nuser.whoAmI()        // user — implicit binding (called as a method)\nconst loose = user.whoAmI\nloose()              // undefined — default binding (standalone call)\nwhoAmI.call({ x: 1 }) // { x: 1 } — explicit binding`,
      explanation: [
        'Called as `user.whoAmI()`, the object left of the dot becomes `this` (implicit binding).',
        'Pulled off into `loose` and called alone, there is no object before the dot, so `this` is undefined in strict mode (default binding).',
        '`whoAmI.call({x:1})` forces `this` to be the passed object (explicit binding).',
        'Same function body — three different `this` values, all decided by the call site.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    '`this` is an implicit parameter bound to a function\'s execution context at invocation time, resolved by the call site rather than the definition site. Its value follows a precedence of binding rules: `new` binding (the freshly created instance) outranks explicit binding (call/apply/bind), which outranks implicit binding (the receiver before the dot), which outranks default binding (undefined in strict mode, the global object in sloppy mode). Arrow functions have no own `this`; they capture it lexically from the enclosing scope at definition time, making their `this` immune to call-site rules.',

  // 7. Internal Working
  internalWorking: [
    'When a regular function is invoked, the engine creates a new execution context and determines the `this` binding from the call site before running the body.',
    'It checks `new` first: if invoked with new, a fresh object is created, its prototype linked, and `this` is bound to it (unless the constructor returns an object).',
    'Otherwise it checks explicit binding: call/apply set `this` to the first argument for that one call; bind returns a new function permanently fixed to a given `this`.',
    'Otherwise it checks implicit binding: if called as obj.fn(), `this` is the receiver object obj.',
    'Otherwise default binding applies: `this` is undefined in strict mode, or the global object (window/globalThis) in sloppy mode.',
    'Arrow functions skip all of this: they have no [[ThisMode]] of their own and resolve `this` by walking the scope chain to the nearest enclosing regular function/scope, fixed at definition time.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  HOW was the function called?  ── decides \`this\`
  ─────────────────────────────────────────────
  new Fn()          ─►  this = brand-new instance      (highest)
  fn.call(obj)      ─►  this = obj (explicit)
  fn.apply(obj)     ─►  this = obj (explicit)
  bound = fn.bind(o)─►  this = o, permanently
  obj.fn()          ─►  this = obj (implicit / receiver)
  fn()              ─►  this = undefined (strict) / global  (lowest)

  Arrow ()=>{}      ─►  this = inherited from WHERE IT WAS DEFINED
                        (ignores all the above)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — implicit binding (the receiver)',
      lang: 'js',
      code: `const counter = {\n  count: 0,\n  increment() {\n    this.count++\n    return this.count\n  },\n}\ncounter.increment() // 1 — this is counter\ncounter.increment() // 2`,
      explanation: [
        '`increment` is called as `counter.increment()`, so `this` is `counter` (implicit binding).',
        '`this.count` therefore refers to `counter.count`.',
        'The receiver — the object left of the dot — determines `this`.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the lost-this bug and fixes',
      lang: 'js',
      code: `const user = {\n  name: 'Sam',\n  greet() { return 'Hi ' + this.name },\n}\nconst fn = user.greet\n// fn() -> "Hi undefined" (or throws in strict): this is lost\n\nconst bound = user.greet.bind(user)\nbound()           // "Hi Sam" — bind fixes this\nsetTimeout(user.greet.bind(user), 0) // also "Hi Sam"`,
      explanation: [
        'Assigning `user.greet` to `fn` strips the receiver; calling `fn()` uses default binding and loses `this`.',
        'This is exactly what happens when you pass a method as a callback (e.g. to setTimeout or an event listener).',
        '`bind(user)` returns a new function with `this` permanently set to `user`, fixing the bug.',
        'Arrow methods or class field arrows are the other common fix.',
      ],
    },
    advanced: {
      label: 'Advanced — arrow function captures lexical this',
      lang: 'js',
      code: `const timer = {\n  seconds: 0,\n  start() {\n    setInterval(() => {\n      this.seconds++          // arrow: this = timer (lexical)\n      console.log(this.seconds)\n    }, 1000)\n  },\n}\ntimer.start() // 1, 2, 3, ...\n\n// With a regular function callback, this would be undefined/global instead.`,
      explanation: [
        'The arrow callback has no own `this`; it captures `this` from `start`, where `this` is `timer`.',
        'So `this.seconds` correctly refers to `timer.seconds` inside the interval.',
        'A regular `function () { this.seconds++ }` callback would lose `this` (default binding).',
        'This lexical-`this` behavior is the main reason arrows are preferred for callbacks.',
      ],
    },
    realProject: {
      label: 'Real project — method binding in a class (React-style)',
      lang: 'js',
      code: `class Counter {\n  count = 0\n  // class field arrow: this is lexically the instance\n  handleClick = () => {\n    this.count++\n    console.log(this.count)\n  }\n}\nconst c = new Counter()\nconst onClick = c.handleClick\nonClick() // works — this stays the instance\n// In React class components, this pattern avoids manual bind in the constructor.`,
      explanation: [
        'A class field arrow captures `this` from construction time, so it is always the instance.',
        'Even when the method is detached (passed as an event handler), `this` is not lost.',
        'This is the standard React class-component fix for "this is undefined in event handlers".',
        'The alternative is binding in the constructor: this.handleClick = this.handleClick.bind(this).',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What determines the value of `this` in a regular function?',
      answer: 'The call site — HOW the function is invoked, not where it is defined. It follows four rules: new, explicit (call/apply/bind), implicit (receiver before the dot), and default (undefined in strict mode).',
      explanation: 'A strong answer stresses call-time resolution and lists the binding rules.',
    },
    {
      level: 'beginner',
      question: 'What is `this` when you call a plain function with no object, in strict mode?',
      answer: 'It is `undefined`. In sloppy (non-strict) mode it would be the global object (window/globalThis).',
      explanation: 'Tests knowledge of default binding and the strict-mode difference.',
    },
    {
      level: 'intermediate',
      question: 'Why does passing a method as a callback often "lose this"?',
      answer: 'Because passing it strips the receiver — the callback is later called standalone, so default binding applies and `this` is undefined/global. Fix with bind, an arrow wrapper, or a class field arrow.',
      explanation: 'Connects the rule to the most common real-world bug and its fixes.',
    },
    {
      level: 'intermediate',
      question: 'How do arrow functions treat `this` differently?',
      answer: 'Arrow functions have no own `this`; they capture it lexically from the enclosing scope at definition time. So call/apply/bind cannot change their `this`, and they are immune to call-site rules.',
      explanation: 'A key discriminator — shows you understand lexical vs dynamic this.',
    },
    {
      level: 'advanced',
      question: 'What is the precedence among the binding rules?',
      answer: 'new > explicit (call/apply/bind) > implicit (receiver) > default. So `new` wins over everything; an explicit bind beats an implicit receiver; a standalone call falls back to default.',
      explanation: 'Tests precise rule ordering, often via a tricky combined example.',
    },
    {
      level: 'senior',
      question: 'How does the engine resolve `this`, and what happens with bind + new together?',
      answer: 'The engine sets `this` at invocation per the binding precedence before executing the body. A function bound with bind() ignores a later call/apply receiver, but using `new` on a bound function actually ignores the bound `this` and binds to the fresh instance — `new` outranks bind. Arrow functions resolve `this` via the scope chain at definition time.',
      explanation: 'Senior signal: knowing the subtle new-vs-bind interaction and lexical resolution for arrows.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between call, apply, and bind?',
    'What does `this` refer to at the top level of a module vs a script?',
    'Can you change an arrow function\'s `this` with bind? (no)',
    'What is `this` inside a class method vs a class field arrow?',
    'What happens to `this` when a constructor explicitly returns an object?',
    'How do you fix "this is undefined" in an event handler?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming `this` is determined by where the function is defined.',
      why: 'For regular functions it is determined by the call site, so detaching a method changes `this`.',
      fix: 'Trace HOW the function is called; bind or use an arrow if you need a fixed `this`.',
    },
    {
      mistake: 'Using a regular function callback inside a method and expecting `this` to stay the object.',
      why: 'The callback is invoked standalone later, so default binding makes `this` undefined/global.',
      fix: 'Use an arrow callback (lexical this) or capture `const self = this` / bind.',
    },
    {
      mistake: 'Trying to rebind an arrow function with call/apply/bind.',
      why: 'Arrows have no own `this`; bind/call/apply cannot change it.',
      fix: 'Use a regular function if you need dynamic `this`, or define the arrow in the right scope.',
    },
    {
      mistake: 'Forgetting `new` and calling a constructor as a plain function.',
      why: 'Without new, `this` is undefined (strict) and the constructor may corrupt globals or throw.',
      fix: 'Always call constructors with new (or use class, which throws if called without new).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Class components historically required binding handlers (constructor bind or class field arrows) so event callbacks keep `this` as the instance; hooks largely sidestep `this` entirely.' },
    { area: 'Vue', detail: 'In the Options API, methods/computed run with `this` bound to the component instance; you must NOT use arrow functions for them, or `this` will not be the instance.' },
    { area: 'Node.js', detail: 'EventEmitter listeners get `this` set to the emitter when using regular functions; arrow listeners capture the surrounding scope instead — a common source of confusion.' },
    { area: 'Backend', detail: 'Class-based services and ORMs rely on `this` for instance state; passing methods as callbacks without binding is a frequent "lost context" bug.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Correct `this` reuse lets one method body serve many instances/objects without duplicating functions.',
      'bind once and store the result rather than rebinding per call avoids repeated allocations.',
    ],
    bad: [
      'Creating a new bound function or class-field arrow per instance increases memory vs a shared prototype method.',
      'Rebinding in a hot render path (new arrow every render) adds allocation/GC pressure.',
    ],
    optimizations: [
      'Prefer prototype methods + bind once (or stable handler refs) over creating new bound functions repeatedly.',
      'In React, use useCallback or class field arrows defined once, not inline arrows recreated each render, in hot paths.',
      'Use lexical `this` (arrows) for callbacks to avoid defensive `const self = this` allocations.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['execution-context', 'scope', 'function-declaration-vs-expression'],
    nextConcepts: ['call-apply-bind', 'arrow-functions', 'es6-classes', 'constructor-functions-new'],
    dependencyNote:
      '`this` depends on the execution context created at call time; mastering it requires call/apply/bind for explicit binding and arrow functions for lexical binding, and it directly feeds into classes and constructors.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the four rules in priority order: new > explicit (call/apply/bind) > implicit (obj.fn) > default.',
      'Show one function called four ways and annotate what `this` becomes each time.',
      'Add an arrow function and draw an arrow up to the enclosing scope: "lexical, fixed at definition".',
      'Demonstrate the lost-this bug: detach obj.fn into a variable, call it, this = undefined.',
      'Conclude: "Look at the call site, apply the precedence; arrows ignore it and inherit lexically."',
    ],
    diagram: `  one function, four call sites:
  new Fn()        -> this = new instance   (1 highest)
  Fn.call(o)      -> this = o              (2 explicit)
  obj.Fn()        -> this = obj            (3 implicit)
  Fn()            -> this = undefined      (4 default)

  arrow: this  ──inherits──► enclosing scope (definition-time)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '`this` is decided by HOW a function is called, not where it is written. Precedence: new (the new instance) > explicit (call/apply/bind) > implicit (the receiver before the dot) > default (undefined in strict mode, global otherwise). Detaching a method loses its receiver, causing the classic "this is undefined" bug — fix with bind or an arrow. Arrow functions are the exception: they have no own `this` and capture it lexically from where they were defined, so call/apply/bind cannot change it.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The key idea about `this` is that for a regular function it is determined by the call site — how the function is invoked — not where it was defined. There are four rules in priority order. Highest is `new` binding: calling a function with new creates a fresh object and binds `this` to it. Next is explicit binding: call and apply set `this` for a single invocation, and bind returns a new function permanently pinned to a given `this`. Then implicit binding: when you call obj.method(), the object left of the dot becomes `this`. And the fallback is default binding, where a standalone function call gives `this` as undefined in strict mode or the global object in sloppy mode. The most common real bug comes from implicit-to-default: if you pull a method off its object — for example passing user.greet as a callback — you strip the receiver, so when it is later called standalone `this` is undefined. You fix that with bind, by wrapping it in an arrow, or with a class field arrow. Arrow functions are the big exception: they have no own `this` and instead capture it lexically from the enclosing scope at definition time, which is exactly why they are ideal for callbacks inside methods. One subtle senior point: new outranks bind, so using new on a bound function ignores the bound `this`.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Dynamic `this` (regular functions) enables flexible method borrowing but is error-prone when detached; lexical `this` (arrows) is safe but cannot be reused across receivers.',
      'Class field arrows fix binding ergonomics but allocate a function per instance instead of sharing one prototype method — a memory vs convenience trade.',
    ],
    edgeCases: [
      'new on a bound function ignores the bound `this` and uses the new instance (new outranks bind).',
      'A constructor returning an object overrides the `this` instance that new created.',
      'At module top level `this` is undefined (ESM) or module.exports (CJS), not the global object.',
      'DOM addEventListener with a regular function sets `this` to the element; an arrow captures the outer scope instead.',
    ],
    runtimeBehavior: [
      '`this` is resolved per invocation and stored in the execution context before the body runs.',
      'Arrows resolve `this` by scope-chain lookup at definition, so they share the enclosing context\'s `this`.',
      'apply/call set `this` for exactly one call; bind creates a permanently partial-applied receiver.',
    ],
    scalability: [
      'Prefer shared prototype methods (bound once where needed) over per-instance arrows when creating very many instances.',
      'In large event-driven systems, consistent binding strategy (bind in constructor or field arrows) prevents whole classes of lost-context bugs.',
    ],
    productionConcerns: [
      '"Cannot read properties of undefined" in handlers is almost always a lost-`this` from detaching a method — audit callback passing.',
      'Mixing arrow and regular functions in framework APIs (Vue Options methods must be regular) causes silent `this` mistakes.',
      'Strict mode (and ESM, always strict) changes default `this` to undefined, surfacing latent bugs that sloppy mode hid behind the global object.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '`this` is decided at CALL TIME by the call site (regular functions).',
    'Precedence: new > explicit (call/apply/bind) > implicit (receiver) > default.',
    'Default binding: undefined (strict) / global (sloppy).',
    'Implicit: obj.fn() -> this = obj.',
    'Explicit: fn.call(o)/fn.apply(o)/fn.bind(o).',
    'new: this = the freshly created instance.',
    'Arrows: NO own this -> lexical, fixed at definition; bind/call/apply cannot change it.',
    'Detaching a method loses its receiver -> "this is undefined".',
    'Fix lost this: bind, arrow wrapper, or class field arrow.',
    'new outranks bind; a constructor returning an object overrides this.',
    'Vue Options methods: use regular functions, NOT arrows.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output and explain: const o = { x: 10, get() { return this.x } }; const g = o.get; console.log(o.get()); console.log(g());',
      hint: 'One is called as a method, one standalone.',
      solution: {
        lang: 'js',
        code: `'use strict'\nconst o = { x: 10, get() { return this.x } }\nconsole.log(o.get()) // 10 — implicit binding, this = o\nconst g = o.get\n// g() throws (strict) or returns undefined.x: this is undefined`,
        explanation: [
          '`o.get()` uses implicit binding, so `this` is `o` and returns 10.',
          '`g()` is standalone; default binding makes `this` undefined in strict mode, so `this.x` throws.',
          'This is the lost-this bug in miniature.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Fix this so the button handler keeps `this` as the widget: class W { label="hi"; onClick(){ console.log(this.label) } }',
      hint: 'Use a class field arrow or bind in the constructor.',
      solution: {
        lang: 'js',
        code: `class W {\n  label = 'hi'\n  onClick = () => {\n    console.log(this.label) // arrow captures the instance lexically\n  }\n}\nconst w = new W()\nconst handler = w.onClick\nhandler() // "hi" — this stays the instance`,
        explanation: [
          'A class field arrow captures `this` from construction, so it is always the instance.',
          'Even when detached as `handler`, `this.label` still works.',
          'The alternative is `this.onClick = this.onClick.bind(this)` in the constructor.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'What does this log and why? function f(){return this.v} const o={v:1}; const b=f.bind(o); console.log(b.call({v:2})); console.log(new b().v ?? "no v");',
      hint: 'bind beats call; new beats bind.',
      solution: {
        lang: 'js',
        code: `function f() { return this.v }\nconst o = { v: 1 }\nconst b = f.bind(o)\nconsole.log(b.call({ v: 2 })) // 1 — bind wins over a later call\nconsole.log(new b().v ?? 'no v') // "no v" — new ignores bound o; instance has no v`,
        explanation: [
          'A bound function ignores a later call/apply receiver, so `b.call({v:2})` still uses `o` -> 1.',
          'But `new b()` outranks bind: `this` becomes a fresh instance, not `o`.',
          'The new instance has no `v`, so `this.v` is undefined -> "no v".',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a polyfill for Function.prototype.bind that fixes `this` and supports partial args.',
      hint: 'Return a new function that calls apply with the saved this and merged args.',
      solution: {
        lang: 'js',
        code: `Function.prototype.myBind = function (ctx, ...preset) {\n  const fn = this\n  return function (...later) {\n    return fn.apply(ctx, [...preset, ...later])\n  }\n}\n\nfunction greet(greeting, name) { return greeting + ', ' + name }\nconst hi = greet.myBind(null, 'Hi')\nhi('Sam') // "Hi, Sam"`,
        explanation: [
          '`this` inside myBind is the original function; we save it as `fn`.',
          'We return a new function that applies `fn` with the fixed `ctx` and the preset + later args.',
          'This reproduces bind\'s permanent-this and partial-application behavior.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      '`this` is the keyword that separates people who "use" JavaScript from those who understand it. Nearly every framework binding bug, every "undefined is not a function" in a handler, traces back to the four rules. Master them and a huge class of interview and production puzzles becomes trivial.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is this" and the method-vs-standalone difference. Product companies (Zoho, Flipkart, Razorpay) give "what does this print" puzzles mixing call/bind/arrows. FAANG interviews probe binding precedence, new-vs-bind, and ask you to polyfill bind.',
    whatInterviewersExpect:
      'They expect you to say `this` is call-time, list the four rules in precedence order, explain the lost-this bug and its fixes, contrast arrow lexical `this`, and ideally polyfill bind or solve a tricky combined example.',
  },
}

export default thisKeyword
