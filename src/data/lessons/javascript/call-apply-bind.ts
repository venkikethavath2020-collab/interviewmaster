import type { ConceptLesson } from '../../../types/lesson'

const callApplyBind: ConceptLesson = {
  // 1. Concept Summary
  slug: 'call-apply-bind',
  name: 'call / apply / bind',
  category: 'execution-model',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'call, apply, and bind are how you explicitly control `this`, which is the fix for the most common JavaScript bug: a method losing its context when passed as a callback.',
    'They enable method borrowing — using one object\'s method on another — and function composition tricks that appear constantly in libraries and polyfills.',
    'bind is the basis of partial application/currying and of stable event handlers in class components.',
    'Interviewers love asking you to polyfill bind (and sometimes call/apply) because it tests `this`, closures, arrays, and the prototype all at once.',
    'Knowing the difference (call takes args individually, apply takes an array, bind returns a new function) is a quick litmus test for JS fluency.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'call/apply/bind are like lending your friend\'s special tool to do YOUR job: "use your hammer, but on my nail".',
    story: [
      'Your friend has a great hammer (a function) that knows how to hit nails.',
      'You have your own nail (your object). You want the hammer to work on YOUR nail, not your friend\'s.',
      'With "call" you say: "hammer, hit THIS nail, right now" and hand it the nail. "apply" is the same but you hand over a whole box of supplies at once.',
      '"bind" is different: you do not hammer yet — instead you get a brand-new hammer that is permanently set to always hit YOUR nail, so you can use it later whenever you want.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every function in JavaScript secretly has three helper methods: call, apply, and bind.',
    'They all let you decide what `this` should be when the function runs, instead of letting the call site decide.',
    'call and apply run the function immediately — call takes the extra arguments one by one, apply takes them as a single array.',
    'bind does not run the function; it gives you back a new copy of the function that will always use the `this` you chose, which you can call later.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'call, apply, and bind are methods on every function that let you explicitly set the `this` value (and arguments) used when the function executes. call and apply invoke the function immediately; bind returns a new function with `this` (and optionally leading arguments) permanently fixed.',
    how: 'fn.call(thisArg, a, b) runs fn now with `this = thisArg` and args a, b. fn.apply(thisArg, [a, b]) is identical but takes args as an array. fn.bind(thisArg, a) returns a new function that, whenever called, runs fn with `this = thisArg` and a prepended to whatever args you pass.',
    why: 'They give you control over `this` for method borrowing, fixing lost context in callbacks, and partial application — without rewriting the original function.',
    code: {
      label: 'The three at a glance',
      lang: 'js',
      code: `function intro(greeting, punct) {\n  return greeting + ', ' + this.name + punct\n}\nconst user = { name: 'Sam' }\n\nintro.call(user, 'Hi', '!')          // "Hi, Sam!" — args listed\nintro.apply(user, ['Hello', '.'])    // "Hello, Sam." — args as array\nconst greetSam = intro.bind(user, 'Hey')\ngreetSam('?')                         // "Hey, Sam?" — new fn, this fixed`,
      explanation: [
        '`call` sets `this` to `user` and passes the remaining args individually, running immediately.',
        '`apply` does the same but takes the arguments as a single array — handy when args are already in an array.',
        '`bind` does NOT run; it returns a new function with `this` fixed to `user` and "Hey" pre-filled.',
        'Calling `greetSam("?")` later supplies the remaining argument — that is partial application.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'call, apply, and bind are methods inherited from Function.prototype that perform explicit `this` binding. Function.prototype.call(thisArg, ...args) and Function.prototype.apply(thisArg, argsArray) invoke the function synchronously with the supplied receiver, differing only in how arguments are passed (variadic vs array-like). Function.prototype.bind(thisArg, ...presetArgs) returns an exotic bound function object whose [[BoundThis]] and [[BoundArguments]] are permanently captured; invoking it calls the target with that fixed receiver and prepended arguments. Explicit binding outranks implicit binding but is overridden by `new` (bound `this` is ignored when a bound function is used as a constructor).',

  // 7. Internal Working
  internalWorking: [
    'call/apply look up the target function (the `this` of the call/apply invocation itself), then create an execution context whose `this` binding is the provided thisArg (boxed to an object in sloppy mode; left as-is in strict mode).',
    'The arguments are spread into the parameter list — individually for call, expanded from the array-like for apply — and the function body runs immediately, returning its value.',
    'bind constructs a new exotic "bound function" object that internally stores the target function, the bound `this`, and any preset (partially applied) arguments.',
    'When the bound function is later invoked, the engine calls the target with the stored `this` and concatenates the preset args with the call-time args.',
    'If the bound function is invoked with `new`, the stored `this` is ignored and a fresh instance is used instead (new outranks bind), though preset args still apply.',
    'A primitive thisArg is wrapped (Number/String/Boolean object) in sloppy mode; null/undefined falls back to the global object in sloppy mode and stays null/undefined in strict mode.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  fn.call(obj, a, b)   ─►  run fn NOW   | this=obj | args: a, b (listed)
  fn.apply(obj, [a,b]) ─►  run fn NOW   | this=obj | args: from ARRAY
  fn.bind(obj, a)      ─►  returns NEW fn (does NOT run)
                              │  this=obj fixed forever
                              │  a is pre-filled (partial application)
                              ▼
                         boundFn(b) ─► run fn | this=obj | args: a, b

  mnemonic:  Call = Commas   Apply = Array   Bind = Bound-later`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — borrow a method with call',
      lang: 'js',
      code: `const person = { fullName() { return this.first + ' ' + this.last } }\nconst data = { first: 'Ada', last: 'Lovelace' }\nperson.fullName.call(data) // "Ada Lovelace"`,
      explanation: [
        '`data` has no fullName method of its own.',
        '`call` borrows person.fullName and runs it with `this = data`.',
        'This is method borrowing — reusing behavior across unrelated objects.',
      ],
    },
    intermediate: {
      label: 'Intermediate — apply to spread an array, and the Math.max trick',
      lang: 'js',
      code: `const nums = [3, 7, 2, 9, 4]\n// pre-spread era: pass array as args via apply\nMath.max.apply(null, nums) // 9\n\n// convert an arguments-like object to a real array (classic borrow)\nfunction list() {\n  return Array.prototype.slice.call(arguments)\n}\nlist(1, 2, 3) // [1, 2, 3]`,
      explanation: [
        '`apply` expands the array into individual arguments, so Math.max sees 3,7,2,9,4.',
        'Before the spread operator, this was THE way to apply array elements as args.',
        '`Array.prototype.slice.call(arguments)` borrows slice to turn the array-like arguments into a real array.',
        'Modern equivalents are Math.max(...nums) and [...arguments], but these borrows still appear in legacy code and polyfills.',
      ],
    },
    advanced: {
      label: 'Advanced — bind for partial application / currying',
      lang: 'js',
      code: `function multiply(a, b, c) { return a * b * c }\nconst double = multiply.bind(null, 2)      // a fixed to 2\nconst doubleTriple = double.bind(null, 3)   // b fixed to 3\ndoubleTriple(5) // 2 * 3 * 5 = 30`,
      explanation: [
        '`bind` pre-fills leading arguments, returning a specialized function.',
        '`double` fixes a=2; `doubleTriple` further fixes b=3.',
        'The final call supplies c=5, completing the chain — this is partial application.',
        'No `this` is needed here, so we pass null as the receiver.',
      ],
    },
    realProject: {
      label: 'Real project — bind to keep handler context (React class component)',
      lang: 'js',
      code: `class SearchBox {\n  query = ''\n  constructor() {\n    // fix this once so the handler keeps the instance when passed to the DOM\n    this.handleInput = this.handleInput.bind(this)\n  }\n  handleInput(e) {\n    this.query = e.target.value\n  }\n}\nconst box = new SearchBox()\ninput.addEventListener('input', box.handleInput) // this stays \`box\``,
      explanation: [
        'Passing box.handleInput to addEventListener would normally lose `this` (the DOM element becomes this).',
        'Binding once in the constructor fixes `this` to the instance permanently.',
        'This is the canonical React class-component pattern (before class-field arrows).',
        'Binding once (not per render) avoids creating a new function on every use.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between call, apply, and bind?',
      answer: 'call and apply invoke the function immediately with a chosen `this`; call takes arguments individually, apply takes them as an array. bind does not invoke — it returns a new function with `this` (and optional preset args) permanently fixed.',
      explanation: 'The crisp distinction (Commas / Array / Bound-later) is the expected fluency check.',
    },
    {
      level: 'beginner',
      question: 'When would you use call/apply instead of just calling the function normally?',
      answer: 'When you need to control `this` — for method borrowing (using one object\'s method on another) or to pass an explicit receiver. apply is useful to spread an array of arguments into a function.',
      explanation: 'Tests practical motivation, not just syntax.',
    },
    {
      level: 'intermediate',
      question: 'How does bind help with the lost-this problem in callbacks?',
      answer: 'When you pass a method as a callback, it is later called standalone and loses its receiver. bind returns a new function with `this` permanently set, so the callback keeps the correct context.',
      explanation: 'Connects bind to the most common real bug it solves.',
    },
    {
      level: 'intermediate',
      question: 'What happens to the bound `this` if you call a bound function with new?',
      answer: 'new outranks bind: the bound `this` is ignored and a fresh instance is used instead. Preset (partially applied) arguments still apply.',
      explanation: 'A precise edge case showing binding precedence.',
    },
    {
      level: 'advanced',
      question: 'How is partial application implemented with bind?',
      answer: 'bind accepts leading arguments after thisArg; these are stored and prepended to the call-time arguments. So bind(null, 2) returns a function with the first parameter fixed to 2, which you complete later.',
      explanation: 'Shows understanding of bind beyond just this-fixing.',
    },
    {
      level: 'senior',
      question: 'Polyfill Function.prototype.bind and explain the new-vs-bind subtlety.',
      answer: 'Save the target (`this`) and preset args in a closure; return a function that, when called normally, applies the target with the fixed receiver and merged args, but when called with new, ignores the fixed receiver and uses the new instance (typically detected by checking instanceof the bound function / setting up the prototype chain).',
      explanation: 'Senior signal: implementing the exotic-bound-function semantics including the new override.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you spread an array as arguments today vs with apply? (Math.max(...arr))',
    'Does bind create a new function every time you call it? (yes — store it, do not rebind repeatedly)',
    'What is the thisArg when you pass null or undefined? (global in sloppy mode, null/undefined in strict)',
    'Can you bind an arrow function\'s this? (no — arrows have no own this)',
    'How would you polyfill call and apply?',
    'What is the performance cost of binding in a hot render path?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing call and apply argument forms.',
      why: 'call expects individual args; apply expects a single array — swapping them passes wrong arguments.',
      fix: 'Remember "Call = Commas, Apply = Array". Use spread (fn(...arr)) when you have an array in modern code.',
    },
    {
      mistake: 'Calling bind repeatedly (e.g. in render) and creating new functions each time.',
      why: 'Each bind returns a brand-new function, breaking referential equality and adding allocations.',
      fix: 'Bind once (constructor / module scope) and reuse the bound reference.',
    },
    {
      mistake: 'Trying to bind/call/apply an arrow function to change its `this`.',
      why: 'Arrow functions have no own `this`; the thisArg is ignored (args still pass through).',
      fix: 'Use a regular function when you need dynamic `this`, or fix the lexical scope instead.',
    },
    {
      mistake: 'Expecting bound `this` to survive when the bound function is used with new.',
      why: 'new outranks bind, so the bound receiver is discarded for a fresh instance.',
      fix: 'Do not use bound functions as constructors; if you need both, restructure the code.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Class components bind handlers in the constructor (this.fn = this.fn.bind(this)) so DOM/event callbacks retain the instance as `this`; done once, not per render.' },
    { area: 'Node.js', detail: 'Binding handlers and middleware to a service instance keeps `this` consistent; apply/call appear in polyfills and in forwarding variadic arguments to wrapped functions.' },
    { area: 'Vue', detail: 'Less common in the Composition API, but utility libraries and decorators use bind to fix method context; method borrowing via call shows up in low-level helpers.' },
    { area: 'Backend', detail: 'Function wrappers (logging, timing, retry decorators) use apply/call to forward arguments and preserve `this` while invoking the wrapped function.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Binding once and reusing the result has negligible overhead and prevents repeated allocations.',
      'apply/call avoid wrapper closures when you just need to forward args with a chosen receiver.',
    ],
    bad: [
      'Calling bind in a hot path (per render, per loop iteration) allocates a new function each time, adding GC pressure.',
      'apply with a very large array can be slower and historically risked argument-count limits in some engines.',
    ],
    optimizations: [
      'Bind once at construction/module load; store and reuse the bound reference.',
      'Prefer spread (fn(...args)) over apply in modern code for clarity and engine optimization.',
      'For stable callback identity in React, bind once or use class field arrows / useCallback rather than inline binds.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['this-keyword', 'function-declaration-vs-expression', 'closure'],
    nextConcepts: ['arrow-functions', 'currying-partial-application', 'prototype', 'es6-classes'],
    dependencyNote:
      'call/apply/bind are the explicit-binding rule for `this`, so understand `this` first; they rely on closures (bind) and feed directly into currying/partial application and prototype-based method borrowing.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write one function `f(a,b){return this.x + a + b}` and an object {x:1}.',
      'Show f.call(obj, 2, 3) -> runs now, args listed -> 6.',
      'Show f.apply(obj, [2, 3]) -> runs now, args as array -> 6.',
      'Show const g = f.bind(obj, 2) -> new function; g(3) -> 6 (this fixed, a prefilled).',
      'Say the mnemonic: "Call = Commas, Apply = Array, Bind = Bound-later", and note new beats bind.',
    ],
    diagram: `  f.call(obj, 2, 3)    -> NOW | this=obj | a=2,b=3  (commas)
  f.apply(obj, [2,3])  -> NOW | this=obj | a=2,b=3  (array)
  g = f.bind(obj, 2)   -> NEW fn (this=obj, a=2 fixed)
        g(3)           -> NOW | this=obj | a=2,b=3
  note: new g() ignores bound this`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'call, apply, and bind let you explicitly set `this`. call and apply run the function immediately — call takes arguments individually, apply takes them in an array. bind does not run; it returns a new function with `this` (and any leading args) permanently fixed, which is the basis of partial application and stable handlers. Remember "Call = Commas, Apply = Array, Bind = Bound-later". new outranks bind, and arrows ignore all three because they have no own `this`.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'call, apply, and bind are methods that every function inherits from Function.prototype, and they exist to give you explicit control over `this`. call and apply both invoke the function immediately with a `this` value you choose; the only difference is how you pass arguments — call takes them as a comma-separated list, while apply takes them as a single array. A handy mnemonic is Call equals Commas, Apply equals Array. bind is different: it does not run the function at all. Instead it returns a brand-new function whose `this` is permanently fixed to the value you gave, and you can also pre-fill leading arguments, which is partial application. The classic use cases are method borrowing — using one object\'s method on another via call or apply — and fixing the lost-this problem when you pass a method as a callback, where you bind it once so it keeps its receiver. apply also historically spread an array into arguments, like Math.max.apply(null, arr), which today we write as Math.max(...arr). Two important subtleties for senior interviews: first, new outranks bind, so using a bound function as a constructor ignores the bound `this` and uses the fresh instance; and second, arrow functions have no own `this`, so passing a thisArg to call, apply, or bind on an arrow has no effect on its `this`. A common interview task is to polyfill bind using a closure that stores the receiver and preset arguments.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Explicit binding gives precise control but is verbose vs lexical arrows; choose call/apply/bind when you need dynamic receivers, arrows when you want a fixed lexical this.',
      'bind creates a new function object (extra allocation and lost referential equality) — fine once, costly if repeated in hot paths.',
    ],
    edgeCases: [
      'new on a bound function ignores the bound this but keeps preset args.',
      'A null/undefined thisArg becomes the global object in sloppy mode but stays null/undefined in strict mode.',
      'Primitive thisArg is boxed (Number/String/Boolean) in sloppy mode.',
      'apply with an extremely large arguments array historically hit per-engine argument-count limits.',
    ],
    runtimeBehavior: [
      'call/apply create one execution context immediately with the specified receiver; bind produces an exotic bound function with stored [[BoundThis]] and [[BoundArguments]].',
      'Bound functions concatenate preset and call-time args at invocation.',
      'Strict vs sloppy mode changes how the receiver is coerced.',
    ],
    scalability: [
      'In large event-driven or class-heavy systems, a consistent binding strategy (bind once in constructor) avoids lost-context bugs at scale.',
      'Prefer spread over apply for clarity and to avoid argument-limit pitfalls when forwarding many args.',
    ],
    productionConcerns: [
      'Repeated bind in render loops causes GC churn and breaks memoization that relies on stable function identity.',
      'Polyfills/decorators must forward arguments and preserve this correctly via apply, or they silently break wrapped functions.',
      'Mixing bound functions with class inheritance/new can surprise — document binding intent clearly.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'All three set `this` explicitly; they live on Function.prototype.',
    'call: run NOW, args as a comma list -> fn.call(this, a, b).',
    'apply: run NOW, args as an ARRAY -> fn.apply(this, [a, b]).',
    'bind: returns a NEW fn, this fixed forever, optional preset args.',
    'Mnemonic: Call = Commas, Apply = Array, Bind = Bound-later.',
    'bind enables partial application / currying (pre-fill leading args).',
    'new outranks bind (bound this ignored, preset args kept).',
    'Arrows ignore thisArg — they have no own this.',
    'null/undefined thisArg -> global (sloppy) / null|undefined (strict).',
    'Bind ONCE and reuse; do not rebind per render/loop.',
    'Modern array spread fn(...arr) often replaces apply.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use call to borrow greet so it runs with {name:"Eve"}: function greet(){ return "Hi "+this.name }',
      hint: 'Pass the object as the first argument to call.',
      solution: {
        lang: 'js',
        code: `function greet() { return 'Hi ' + this.name }\ngreet.call({ name: 'Eve' }) // "Hi Eve"`,
        explanation: [
          'call sets `this` to the passed object and runs greet immediately.',
          'So `this.name` is "Eve" and it returns "Hi Eve".',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Find the max of [4,1,9,3] using apply (no spread), then write the modern spread equivalent.',
      hint: 'Math.max.apply spreads the array as arguments.',
      solution: {
        lang: 'js',
        code: `const arr = [4, 1, 9, 3]\nMath.max.apply(null, arr) // 9 (apply spreads the array)\nMath.max(...arr)          // 9 (modern spread)`,
        explanation: [
          'apply expands the array into individual arguments for Math.max.',
          'The spread operator does the same thing more readably in modern code.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a `boundAdd5` using bind so boundAdd5(10) returns 15: function add(a,b){return a+b}',
      hint: 'Pre-fill the first argument with bind.',
      solution: {
        lang: 'js',
        code: `function add(a, b) { return a + b }\nconst boundAdd5 = add.bind(null, 5) // a fixed to 5\nboundAdd5(10) // 15`,
        explanation: [
          'bind pre-fills the first argument a=5 and returns a new function.',
          'Calling boundAdd5(10) supplies b=10, so it returns 5 + 10 = 15.',
          'No `this` is needed, so we pass null as the receiver.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Polyfill Function.prototype.bind (support partial args; bound this fixed).',
      hint: 'Capture the target and preset args in a closure; apply them when called.',
      solution: {
        lang: 'js',
        code: `Function.prototype.myBind = function (ctx, ...preset) {\n  const fn = this\n  if (typeof fn !== 'function') throw new TypeError('not callable')\n  return function (...later) {\n    return fn.apply(ctx, [...preset, ...later])\n  }\n}\n\nfunction greet(g, name) { return g + ', ' + name }\nconst hi = greet.myBind(null, 'Hi')\nhi('Sam') // "Hi, Sam"`,
        explanation: [
          '`this` inside myBind is the original function; save it as `fn`.',
          'Return a function that applies `fn` with the fixed `ctx` and merged preset + later args.',
          'This reproduces bind\'s permanent-this and partial-application behavior (a full version also handles new).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'call/apply/bind are the practical levers for controlling `this`, and the bind polyfill is one of the most common JS interview tasks because it exercises closures, `this`, arrays, and prototypes at once. Fluency here signals you truly understand function execution.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the call-vs-apply-vs-bind difference. Product companies (Zoho, Flipkart, Razorpay) ask method borrowing and partial application with bind. FAANG interviews ask you to polyfill bind (and explain the new-vs-bind override) or call/apply.',
    whatInterviewersExpect:
      'They expect the crisp three-way distinction, real use cases (borrowing, lost-this fix, partial application), the new-vs-bind precedence, that arrows ignore them, and ideally a correct bind polyfill.',
  },
}

export default callApplyBind
