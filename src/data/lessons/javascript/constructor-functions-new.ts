import type { ConceptLesson } from '../../../types/lesson'

const constructorFunctionsNew: ConceptLesson = {
  // 1. Concept Summary
  slug: 'constructor-functions-new',
  name: 'Constructors & new',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The `new` operator and constructor functions are the original way JavaScript builds objects with shared prototype methods — and classes are just sugar over this exact mechanism.',
    'Understanding the four steps of `new` explains how `this`, the prototype link, and the return value all come together — a top interview topic.',
    'Forgetting `new` is a real, classic bug: `this` becomes the global object and properties leak globally or throw in strict mode.',
    'It is the prerequisite for understanding classes, inheritance, and how libraries like older jQuery/Backbone constructed instances.',
    'Interviewers love asking you to implement `new` from scratch — it proves you truly understand object creation and the prototype link.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A constructor is a cookie cutter and `new` is pressing it into dough to stamp out a fresh cookie.',
    story: [
      'Imagine you have a cookie cutter shaped like a star. The cutter itself is not a cookie — it is the tool that makes cookies.',
      'Every time you press it into the dough (that is the word "new"), you get a brand-new star cookie that you can decorate differently.',
      'All the cookies came from the same cutter, so they share the same shape, but each one is its own separate cookie you can frost in its own color.',
      'In code, the constructor function is the cookie cutter, "new" is the press, and each object you get is a fresh cookie that shares the cutter’s shape (its prototype) but has its own decorations (its own properties).',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A constructor function is a normal function whose job is to set up a new object.',
    'You call it with the keyword `new`, which secretly creates a blank object, runs the function with `this` pointing at that blank object, and hands the object back to you.',
    'Inside the function you attach properties to `this`, like this.name = name, to customize the new object.',
    'Shared methods are put on the function’s prototype so every object made this way can use them without storing its own copy.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A constructor function is a function intended to be invoked with `new` to create and initialize an object. `new` creates the object, links its prototype, binds `this`, runs the body, and returns the object.',
    how: 'Inside the constructor you assign instance data to `this`. Shared methods go on Fn.prototype. Calling `new Fn(args)` produces an instance whose [[Prototype]] is Fn.prototype.',
    why: 'It gives you many objects that share methods via the prototype (memory-efficient) and a real type you can test with instanceof — the basis for classes.',
    code: {
      label: 'A constructor with shared methods',
      lang: 'js',
      code: `function User(name, role) {
  this.name = name        // own property
  this.role = role
}
User.prototype.describe = function () {  // shared method
  return this.name + ' (' + this.role + ')'
}

const u = new User('Sam', 'admin')
console.log(u.describe())       // 'Sam (admin)'
console.log(u instanceof User)  // true`,
      explanation: [
        '`new User(...)` creates a blank object and binds `this` to it.',
        'Inside, name and role become own properties of the new object.',
        'describe is on the prototype, shared by all User instances.',
        'The function implicitly returns the new object.',
        'instanceof User is true because User.prototype is in the instance’s chain.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A constructor function is an ordinary function invoked with the `new` operator to produce an object. The new operation: (1) creates a fresh ordinary object, (2) sets its internal [[Prototype]] to the constructor’s `.prototype` (or Object.prototype if that is not an object), (3) invokes the constructor with `this` bound to the new object and the supplied arguments, and (4) returns the new object — unless the constructor explicitly returns a non-null object, in which case that object is returned instead (primitive returns are ignored). Constructors conventionally capitalize their name; classes are syntactic sugar that run this same algorithm but throw if called without new.',

  // 7. Internal Working
  internalWorking: [
    'The engine creates a new ordinary object on the heap.',
    'It sets that object’s [[Prototype]] to the constructor function’s `.prototype` property (a reference); if `.prototype` is not an object, it uses Object.prototype.',
    'It calls the constructor with `this` bound to the new object and forwards the arguments; the body assigns own properties to `this`.',
    'If the constructor returns an object, that object becomes the result of the new expression; if it returns a primitive or nothing, the newly created object is returned.',
    'new.target is set to the constructor inside the call, letting the function detect whether it was invoked with new.',
    'Methods placed on the prototype are shared; each instance only stores its own assigned properties, with this bound per call.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  new User('Sam','admin')
        │
        ▼  STEP 1: create {}            STEP 2: link prototype
   ┌──────────┐         [[Prototype]]   ┌────────────────────┐
   │  (blank) │ ───────────────────────►│ User.prototype     │
   └────┬─────┘                         │  describe()        │
        │ STEP 3: run body with         │  constructor: User │
        │ this = the blank object       └────────────────────┘
        ▼
   ┌──────────────┐  STEP 4: return this (unless body returns an object)
   │ name:'Sam'   │
   │ role:'admin' │  ◄── the instance you get back
   └──────────────┘`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: each `new` allocates a fresh instance object; own properties (name, role) are stored on it.',
    'SHARED: prototype methods live once on User.prototype; instances reference them, not copy them.',
    'REFERENCE: the instance’s [[Prototype]] is a reference to User.prototype, so changes to the prototype are visible to all instances immediately.',
    'If the constructor returns its own object, the originally allocated `this` object becomes garbage (unreferenced) and is collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — with vs without new',
      lang: 'js',
      code: `'use strict'
function Point(x) { this.x = x }
const good = new Point(5)
console.log(good.x)         // 5
try {
  const bad = Point(5)      // no new!
} catch (e) {
  console.log(e.constructor.name) // TypeError: this is undefined in strict mode
}`,
      explanation: [
        'With `new`, `this` is the new object and x is set on it.',
        'Without `new` in strict mode, `this` is undefined, so this.x throws.',
        'In non-strict mode it would silently leak x onto the global object — a sneaky bug.',
        'This is why constructors are capitalized and classes enforce new.',
      ],
    },
    intermediate: {
      label: 'Intermediate — guarding against missing new',
      lang: 'js',
      code: `function Widget(id) {
  if (!(this instanceof Widget)) {  // called without new?
    return new Widget(id)           // self-correct
  }
  this.id = id
}
const a = new Widget(1)
const b = Widget(2)        // works anyway thanks to the guard
console.log(a.id, b.id)    // 1 2
console.log(b instanceof Widget) // true`,
      explanation: [
        'The guard checks whether `this` is a Widget instance.',
        'If not (called without new), it re-invokes with new and returns that.',
        'This makes the constructor safe to call either way.',
        'new.target === undefined is a modern alternative check.',
      ],
    },
    advanced: {
      label: 'Advanced — explicit object return overrides this',
      lang: 'js',
      code: `function Cached(id) {
  if (Cached.pool.has(id)) return Cached.pool.get(id) // return existing object
  this.id = id
  Cached.pool.set(id, this)
}
Cached.pool = new Map()

const x = new Cached(1)
const y = new Cached(1)   // returns the SAME pooled object
console.log(x === y)      // true`,
      explanation: [
        'When a constructor returns an object, `new` yields that object instead of the fresh `this`.',
        'Here we reuse a pooled instance for the same id (a simple flyweight/cache).',
        'Returning a primitive would be ignored and the new object returned instead.',
        'This trick implements caching/singletons via the constructor itself.',
      ],
    },
    realProject: {
      label: 'Real project — Node EventEmitter-style constructor & React class component',
      lang: 'js',
      code: `// Classic Node-style constructor function pattern (pre-class):
function Server(port) {
  this.port = port
  this.routes = {}
}
Server.prototype.route = function (path, handler) {
  this.routes[path] = handler
  return this   // chainable
}
const s = new Server(3000).route('/health', () => 'ok')

// React class component is the same idea under the hood:
// class App extends React.Component { constructor(props){ super(props); this.state = {} } }`,
      explanation: [
        'Server is a constructor: port and routes are per-instance; route() is shared on the prototype.',
        'Returning `this` from a method enables chaining (s.route().route()).',
        'This is the pattern older Node/Express-style libraries used before classes.',
        'A React class component’s constructor calls super(props) and sets this.state — the same new-based construction.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a constructor function and how do you use it?',
      answer: 'A function meant to be called with `new` to create and initialize an object. You assign instance data to `this` inside it and put shared methods on its prototype.',
      explanation: 'Mentioning both this-assignment and prototype methods shows a complete picture.',
    },
    {
      level: 'beginner',
      question: 'What happens if you call a constructor without new?',
      answer: 'In strict mode `this` is undefined, so assigning to this.x throws. In non-strict mode `this` is the global object, so properties leak globally and the function returns undefined.',
      explanation: 'Knowing both strict and non-strict behavior is the expected detail.',
    },
    {
      level: 'intermediate',
      question: 'What exactly does the `new` operator do, step by step?',
      answer: 'It (1) creates a new object, (2) sets its [[Prototype]] to the constructor’s .prototype, (3) calls the constructor with this bound to the new object, and (4) returns the object — unless the constructor explicitly returns a different object.',
      explanation: 'Reciting the four steps is the canonical answer; the return-override clause earns extra credit.',
    },
    {
      level: 'intermediate',
      question: 'What happens if a constructor returns a value?',
      answer: 'If it returns an object, that object becomes the result of `new`. If it returns a primitive (or nothing), the primitive is ignored and the newly created `this` object is returned.',
      explanation: 'The object-vs-primitive distinction is a frequently tested subtlety.',
    },
    {
      level: 'advanced',
      question: 'How are constructor functions related to ES6 classes?',
      answer: 'Classes are syntactic sugar over constructor functions and prototypes: the constructor body is the function, methods go on the prototype, and `new` runs the same algorithm. Key differences: classes are not hoisted, run in strict mode, and throw if called without new.',
      explanation: 'Connecting classes to the underlying mechanism plus listing the behavioral differences is strong.',
    },
    {
      level: 'senior',
      question: 'How would you implement your own `new` operator?',
      answer: 'Create an object with Object.create(Ctor.prototype), call Ctor with this bound to it (apply the args), and return the result if it is an object, otherwise return the created object.',
      explanation: 'Senior signal: knowing the exact mechanics — prototype link via Object.create and the object-return override — is the classic implementation question.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is new.target used, and what is its value when called with vs without new?',
    'Why do classes throw when called without new but constructor functions do not?',
    'How do you set up inheritance between two constructor functions?',
    'What is the difference between a constructor function and a factory function?',
    'Why must the prototype.constructor be reset after replacing a prototype?',
    'How does Reflect.construct relate to new?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling a constructor without new.',
      why: '`this` becomes global (or undefined in strict mode), leaking properties or throwing.',
      fix: 'Use a class (which enforces new), or guard with `if (!(this instanceof Fn)) return new Fn(...)` / new.target.',
    },
    {
      mistake: 'Defining methods inside the constructor for many instances.',
      why: 'Each instance gets its own copy of the function, wasting memory.',
      fix: 'Put shared methods on Fn.prototype so they are defined once.',
    },
    {
      mistake: 'Returning a primitive expecting it to override the instance.',
      why: 'Only object returns override `this`; primitive returns are ignored.',
      fix: 'Return an object explicitly if you intend to override, otherwise rely on the implicit `this`.',
    },
    {
      mistake: 'Forgetting to reset prototype.constructor after replacing the prototype object for inheritance.',
      why: 'instance.constructor then points at the wrong function, breaking clone/serialize logic.',
      fix: 'After Child.prototype = Object.create(Parent.prototype), set Child.prototype.constructor = Child.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue 2 created component instances via a constructor (the Vue function / subclasses from Vue.extend) using new under the hood; options were merged onto the prototype.' },
    { area: 'React', detail: 'Class components are constructed with new and call super(props); their methods live on the prototype, inheriting from React.Component.' },
    { area: 'Node.js', detail: 'Core modules expose constructor functions/classes (new EventEmitter(), new URL()); pre-class libraries (Express-era) used constructor + prototype patterns.' },
    { area: 'Backend', detail: 'ORMs and SDKs instantiate models/clients with new, sharing methods via the prototype and using instanceof for type checks.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Prototype-shared methods mean one function object per type regardless of instance count.',
      'Constructing objects with a consistent set of properties lets the engine assign a stable hidden class.',
    ],
    bad: [
      'Defining methods inside the constructor allocates a new function per instance (memory + GC pressure).',
      'Conditionally adding different properties across instances creates polymorphic shapes and deopts.',
    ],
    optimizations: [
      'Initialize all instance fields in the constructor in a consistent order for a shared hidden class.',
      'Place methods on the prototype, not inside the constructor.',
      'Avoid returning objects from constructors in hot paths (the allocated `this` is wasted).',
      'Prefer classes for clarity; they compile to the same efficient construct.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A constructor reachable via constructor.prototype is part of the prototype-pollution surface; attacker-controlled access to `constructor` can be a gadget.',
      'Constructors that build objects from untrusted input without validation can create unsafe instances or trigger getters.',
    ],
    bestPractices: [
      'Validate and sanitize constructor arguments; avoid copying untrusted keys directly onto `this`.',
      'Freeze or guard prototypes and avoid exposing `constructor` access paths in security-sensitive code.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'this-keyword', 'prototype'],
    nextConcepts: ['es6-classes', 'prototype-chain', 'inheritance-patterns', 'factory-pattern'],
    dependencyNote:
      'Constructors and new sit between prototypes and classes: you need this and prototype first, and mastering new directly unlocks ES6 classes, inheritance patterns, and the factory pattern as an alternative.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the four steps of new as a numbered list: create object, link prototype, bind this + run body, return object.',
      'Draw a blank object, then an arrow to Ctor.prototype labeled [[Prototype]].',
      'Show this = the blank object while the body assigns name/role onto it.',
      'Add the return clause: object return overrides, primitive/none returns this.',
      'Say: "new is just those four steps; a class is the same thing with strict mode and a new-required guard."',
    ],
    diagram: `  new Ctor(args):
   1. obj = {}                       (create)
   2. obj.[[Prototype]] = Ctor.prototype  (link)
   3. result = Ctor.call(obj, args)  (bind this, run)
   4. return (typeof result === 'object' && result) ? result : obj`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A constructor function is a function called with `new`. new does four things: create a blank object, link its prototype to Fn.prototype, run the function with `this` bound to the object, and return that object — unless the body returns its own object. Put instance data on `this` and shared methods on Fn.prototype. Forgetting new makes `this` global (or undefined in strict mode), so guard with new.target or use a class. Classes are sugar over this exact mechanism but enforce new and run in strict mode.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A constructor function is just a normal function designed to be called with the new operator to build an object. The interesting part is what new actually does, which is four steps: first it creates a fresh empty object; second it sets that object’s internal prototype to the constructor’s .prototype property; third it calls the constructor with this bound to the new object, so assignments like this.name = name attach own properties; and fourth it returns that object. There’s one wrinkle on the return: if the constructor explicitly returns an object, new gives you that object instead, but if it returns a primitive or nothing, the primitive is ignored and you get the constructed object. The convention is to capitalize constructor names and to put shared methods on the prototype rather than inside the constructor, because prototype methods exist once and are shared by every instance, whereas methods defined in the body are recreated per instance. The classic bug is forgetting new: in strict mode this is undefined so it throws, and in sloppy mode this is the global object so properties leak globally. I guard with new.target or instanceof, or just use a class, since classes run this same algorithm but enforce new and run in strict mode. And the favorite interview task is implementing new yourself — Object.create(Ctor.prototype), call the constructor with that as this, then return the result if it’s an object, otherwise the created object.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Constructors + prototype give shared methods and instanceof but expose all state publicly, unlike factory + closure which gives privacy at the cost of per-call method allocation.',
      'Constructor functions are more flexible (callable without new with guards) but classes are clearer and enforce correct usage.',
    ],
    edgeCases: [
      'Object return from a constructor overrides this; primitive return is ignored.',
      'new.target is undefined when called without new, the constructor when with new, and useful for abstract-base enforcement.',
      'Replacing Fn.prototype breaks the constructor back-reference unless reset.',
      'Arrow functions cannot be constructors — they have no [[Construct]] and throw with new.',
    ],
    runtimeBehavior: [
      'new sets [[Prototype]] by reference to Fn.prototype at construction time; later prototype mutations affect existing instances.',
      'Consistent property initialization order yields a shared hidden class; conditional fields create polymorphism and deopts.',
      'Reflect.construct lets you specify a different prototype (newTarget) than the called constructor.',
    ],
    scalability: [
      'For large instance counts, prototype method sharing keeps memory flat; per-instance methods would multiply heap usage.',
      'Object pooling via constructor object-return can reduce allocations in hot paths but adds lifecycle complexity.',
    ],
    productionConcerns: [
      'Missing-new bugs in legacy code silently pollute globals; lint rules and classes prevent them.',
      'Constructors copying untrusted input onto this can introduce prototype-pollution gadgets via constructor.prototype.',
      'Mutating prototypes after instances exist causes hard-to-trace behavior changes across the app.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Constructor = function called with new.',
    'new: create obj → link [[Prototype]]=Fn.prototype → run body (this=obj) → return obj.',
    'Object return overrides this; primitive return is ignored.',
    'Instance data on `this`; shared methods on Fn.prototype.',
    'Forgetting new → this is global (or undefined in strict mode).',
    'Guard: if (!(this instanceof Fn)) return new Fn(...) / check new.target.',
    'Classes = sugar over this; enforce new + strict mode.',
    'Arrow functions cannot be constructors.',
    'Implement new: Object.create(proto) → call → object-return override.',
    'Reset prototype.constructor after replacing the prototype.',
    'instanceof works because Fn.prototype is in the instance chain.',
    'Capitalize constructor names by convention.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a `Book(title)` constructor and a shared `summary()` method on its prototype returning "Book: <title>".',
      hint: 'Assign title to this; put summary on Book.prototype.',
      solution: {
        lang: 'js',
        code: `function Book(title) { this.title = title }
Book.prototype.summary = function () { return 'Book: ' + this.title }
const b = new Book('JS')
console.log(b.summary())  // 'Book: JS'`,
        explanation: [
          'title becomes an own property via this.',
          'summary lives on the prototype, shared by all books.',
          'new returns the constructed instance.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make `Counter()` safe to call with OR without new, always producing an instance with a start of 0.',
      hint: 'Use a new.target / instanceof guard.',
      solution: {
        lang: 'js',
        code: `function Counter() {
  if (!new.target) return new Counter()  // called without new
  this.value = 0
}
Counter.prototype.inc = function () { return ++this.value }
const a = new Counter()
const b = Counter()        // still works
console.log(b.inc())       // 1
console.log(b instanceof Counter) // true`,
        explanation: [
          'new.target is undefined when called without new.',
          'In that case we re-invoke with new and return the result.',
          'Both call styles now produce a valid instance.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement `myNew(Ctor, ...args)` that behaves like the new operator, including the object-return override.',
      hint: 'Object.create the prototype, apply the constructor, return object if returned.',
      solution: {
        lang: 'js',
        code: `function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype)   // step 1+2
  const result = Ctor.apply(obj, args)        // step 3
  return (result !== null && typeof result === 'object') ? result : obj // step 4
}
function P(x) { this.x = x }
const p = myNew(P, 5)
console.log(p.x, p instanceof P) // 5 true`,
        explanation: [
          'Object.create(Ctor.prototype) creates the object and links its prototype.',
          'apply runs the constructor with this bound and the args spread.',
          'If the constructor returned an object we use it; otherwise we return the created object.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Use a constructor’s object-return to implement a Singleton: every `new Config()` returns the same instance.',
      hint: 'Cache the first instance on the constructor and return it on later calls.',
      solution: {
        lang: 'js',
        code: `function Config() {
  if (Config._instance) return Config._instance  // return cached object
  this.settings = {}
  Config._instance = this
}
const a = new Config()
const b = new Config()
console.log(a === b)  // true — same singleton instance`,
        explanation: [
          'The first call sets up the instance and caches it on Config._instance.',
          'Later calls return the cached object, so new yields the same instance.',
          'This works because an object return from a constructor overrides the fresh this.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The new operator and constructor functions are the foundation beneath every class in JavaScript. Knowing the four steps cold — and being able to implement new yourself — signals that you genuinely understand object creation and prototypes, not just class syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what new does and what happens without it. Product companies (Zoho, Flipkart, Razorpay) ask you to implement new, guard against missing new, and explain constructor vs factory. FAANG-level interviews probe new.target, object-return overrides, Reflect.construct, and hidden-class implications.',
    whatInterviewersExpect:
      'They expect the four steps of new verbatim, the missing-new behavior in both modes, the object-return override rule, and the connection to classes — ideally with a clean myNew implementation.',
  },
}

export default constructorFunctionsNew
