import type { ConceptLesson } from '../../../types/lesson'

const es6Classes: ConceptLesson = {
  // 1. Concept Summary
  slug: 'es6-classes',
  name: 'Classes',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Classes are the standard, readable way to define object types with shared methods, inheritance, and encapsulation in modern JavaScript and TypeScript.',
    'They are everywhere: React class components, Node’s EventEmitter subclasses, Angular/NestJS services, ORM entities, and most error hierarchies.',
    'They are syntactic sugar over prototypes — interviewers test whether you know what they really compile to, not just the syntax.',
    'Class features (private #fields, static members, getters/setters, super) solve real problems like true privacy and shared behavior cleanly.',
    'Misunderstanding class semantics (non-hoisting, strict mode, method binding losing `this`) causes common production bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A class is a blueprint for a house; each house you build from it is a separate home with the same plan.',
    story: [
      'Imagine an architect draws one blueprint for a house: where the rooms go, where the door is, how the kitchen works.',
      'Builders can use that single blueprint to build many houses on different streets. Each house is its own home with its own family and furniture, but they all share the same plan.',
      'If the blueprint says "every house has a way to ring the doorbell", then every house built from it can ring its doorbell — the ability comes from the shared plan, not copied into each house.',
      'A class is that blueprint, and each object you create with "new" is a house built from it: same shared abilities, but its own contents.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A class is a template that describes what data an object holds and what it can do.',
    'The constructor sets up each new object’s starting data, and methods describe the actions all objects of that type can perform.',
    'You make an object from a class with the keyword `new`, and you can build one class on top of another using `extends` to reuse and add behavior.',
    'Under the hood, JavaScript classes are just a tidier way to write the older constructor-and-prototype style — the methods are still shared through the prototype.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A class is a declarative syntax for creating a constructor function plus a shared prototype: the constructor initializes instance fields, methods live on the prototype, and `extends`/`super` set up inheritance.',
    how: 'Define fields and a constructor, add methods (shared), static members (on the class itself), getters/setters, and #private fields. Create instances with `new`. Subclass with `extends` and call `super()` in the child constructor.',
    why: 'Classes give readable, structured object types with inheritance, true privacy via #fields, and the same memory efficiency as prototypes — the idiomatic modern approach.',
    code: {
      label: 'A class with fields, method, getter, and static',
      lang: 'js',
      code: `class Circle {
  static PI = 3.14159        // static (on the class)
  #radius                    // private field
  constructor(r) { this.#radius = r }
  get area() { return Circle.PI * this.#radius ** 2 } // getter
  scale(f) { this.#radius *= f; return this }          // method (shared)
}

const c = new Circle(2)
console.log(c.area)          // 12.56636
c.scale(2)
console.log(c.area)          // 50.26544
// c.#radius // SyntaxError — truly private`,
      explanation: [
        '`static PI` lives on the class itself, not instances.',
        '`#radius` is a private field — inaccessible outside the class body.',
        'The constructor initializes each instance’s private radius.',
        '`get area` is a computed accessor; `scale` is a shared prototype method.',
        'Accessing `c.#radius` from outside is a syntax error — genuine encapsulation.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A class is syntactic sugar over JavaScript’s prototype-based model. A class declaration creates a constructor function (the body of `constructor`), installs prototype methods (non-enumerable) on the class’s `.prototype`, and defines static members on the constructor itself. Instances are created with `new`, which runs the same construct algorithm. Classes add real features: `#` private fields/methods (lexically scoped, not on the prototype), `static` members and static blocks, getters/setters, and `extends`/`super` for prototype-chain inheritance where `super()` invokes the parent constructor. Class bodies always run in strict mode, class bindings are not hoisted (temporal dead zone), and classes throw if invoked without `new`.',

  // 7. Internal Working
  internalWorking: [
    'Evaluating a class declaration creates a constructor function whose body is the `constructor` method (or a default one) and sets up its `.prototype` object.',
    'Instance methods are defined as non-enumerable properties on the class prototype; static members are defined on the constructor function itself.',
    'Private #fields are stored in a hidden internal slot keyed lexically to the class, not as normal properties, so they are invisible and inaccessible outside the class body.',
    'With `extends`, the child’s prototype is linked to the parent’s prototype (chain), and the child constructor’s [[Prototype]] is the parent constructor (so static members inherit too).',
    '`super(...)` in a derived constructor invokes the parent constructor to initialize `this`; you must call it before using `this`. `super.method()` looks up the method on the parent prototype.',
    'Calling a class without `new` throws a TypeError because the class constructor has [[Construct]] but its [[Call]] is restricted.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  class Dog extends Animal { ... }

  Animal (ctor) ──.prototype──► Animal.prototype { speak }
      ▲ [[Proto]] (static inherit)        ▲ [[Proto]]
      │                                   │
  Dog (ctor) ────.prototype──► Dog.prototype { bark }
                                          ▲ [[Proto]]
   new Dog() ── instance { #id } ─────────┘
   instance.bark → Dog.prototype ; instance.speak → Animal.prototype`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Instance fields (and #private fields) are stored per instance on the heap; private fields live in a hidden slot, not as enumerable properties.',
    'Methods are defined once on the class prototype and shared by all instances — no per-instance copies.',
    'Static members live once on the constructor function object.',
    'With extends, prototypes are linked by reference into a chain; no methods are copied between parent and child.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — class vs its desugared form',
      lang: 'js',
      code: `class User {
  constructor(name) { this.name = name }
  hi() { return 'Hi ' + this.name }
}
// Roughly equivalent to:
function UserFn(name) { this.name = name }
UserFn.prototype.hi = function () { return 'Hi ' + this.name }

const u = new User('Sam')
console.log(u.hi())  // 'Hi Sam'`,
      explanation: [
        'The constructor body becomes the constructor function.',
        '`hi` is installed on User.prototype (non-enumerable, unlike the literal version).',
        'new User runs the same construction algorithm as new UserFn.',
        'Classes are readability sugar over this prototype wiring.',
      ],
    },
    intermediate: {
      label: 'Intermediate — inheritance with super',
      lang: 'js',
      code: `class Animal {
  constructor(name) { this.name = name }
  speak() { return this.name + ' makes a sound' }
}
class Dog extends Animal {
  constructor(name) { super(name); this.legs = 4 } // must call super first
  speak() { return super.speak() + ' (woof)' }     // extend parent method
}
const d = new Dog('Rex')
console.log(d.speak())        // 'Rex makes a sound (woof)'
console.log(d instanceof Animal) // true`,
      explanation: [
        '`extends` links Dog’s prototype chain to Animal.',
        '`super(name)` calls the Animal constructor to initialize `this` before adding legs.',
        '`super.speak()` invokes the parent method, then Dog extends the result.',
        'instanceof Animal is true because Animal.prototype is in the chain.',
      ],
    },
    advanced: {
      label: 'Advanced — private fields, static, and a custom error',
      lang: 'js',
      code: `class BankError extends Error {
  constructor(message, code) {
    super(message)
    this.name = 'BankError'
    this.code = code
  }
}
class Account {
  #balance = 0
  static #count = 0
  constructor() { Account.#count++ }
  static get total() { return Account.#count }
  deposit(n) { this.#balance += n; return this.#balance }
  withdraw(n) {
    if (n > this.#balance) throw new BankError('Insufficient', 'E_FUNDS')
    this.#balance -= n; return this.#balance
  }
}
new Account(); new Account()
console.log(Account.total) // 2`,
      explanation: [
        'BankError subclasses the built-in Error using super(message) — the idiomatic custom-error pattern.',
        '`#balance` and static `#count` are truly private to the class.',
        'A static getter exposes a read-only count without leaking the field.',
        'withdraw throws a typed custom error that retains the Error chain.',
      ],
    },
    realProject: {
      label: 'Real project — Node service class & React-style component',
      lang: 'js',
      code: `// Node: a service class with dependency injection via the constructor
class UserService {
  #repo
  constructor(repo) { this.#repo = repo }
  async findById(id) {
    const row = await this.#repo.get(id)
    if (!row) throw new Error('Not found')
    return row
  }
}

// React class component (same class semantics):
// class Counter extends React.Component {
//   state = { n: 0 }
//   inc = () => this.setState(s => ({ n: s.n + 1 })) // arrow keeps this
//   render() { return null }
// }`,
      explanation: [
        'UserService stores its dependency in a private field, injected via the constructor — clean encapsulation used across NestJS/Express apps.',
        'Methods are shared on the prototype; async methods work like any other.',
        'In React, class fields with arrow functions bind `this` so handlers keep their instance when passed as callbacks.',
        'This is the everyday production shape of classes in backend and frontend code.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a class in JavaScript and how is it different from an object?',
      answer: 'A class is a template/blueprint for creating objects with shared methods and inheritance. An object is an actual instance. You create instances from a class with `new`.',
      explanation: 'Distinguishing blueprint (class) from instance (object) is the baseline.',
    },
    {
      level: 'beginner',
      question: 'Are JavaScript classes "real" classes or something else?',
      answer: 'They are syntactic sugar over constructor functions and prototypes. Methods still live on the prototype; instances are still prototype-linked. JS uses prototypal inheritance underneath.',
      explanation: 'The "sugar over prototypes" answer is what interviewers want to hear.',
    },
    {
      level: 'intermediate',
      question: 'What does `super` do, and what must you do before using `this` in a subclass constructor?',
      answer: '`super(...)` calls the parent constructor to initialize `this`; `super.method()` calls a parent method. In a derived constructor you must call super() before accessing `this`, or you get a ReferenceError.',
      explanation: 'The must-call-super-before-this rule is a precise, commonly tested detail.',
    },
    {
      level: 'intermediate',
      question: 'How do private fields (#) differ from a leading-underscore convention?',
      answer: '#fields are enforced by the language — inaccessible and even un-referenceable outside the class body (syntax error). A leading underscore is only a naming convention and is fully accessible.',
      explanation: 'Knowing # is true privacy (not convention) and stored off the prototype is the expected depth.',
    },
    {
      level: 'advanced',
      question: 'Why is `this` undefined when you pass a class method as a callback, and how do you fix it?',
      answer: 'Class methods are not auto-bound; passing them detaches `this`. In strict mode (classes are always strict) `this` becomes undefined. Fix with arrow-function class fields, .bind(this) in the constructor, or wrapping in an arrow at the call site.',
      explanation: 'Strong answers tie it to strict mode and list the binding fixes.',
    },
    {
      level: 'senior',
      question: 'How do classes differ from constructor functions beyond syntax?',
      answer: 'Classes are not hoisted (TDZ), always run in strict mode, throw if called without new, have non-enumerable prototype methods, support #private fields/static blocks, and set up static inheritance via the constructor’s [[Prototype]]. They also handle subclassing built-ins (Array, Error) correctly via super.',
      explanation: 'Senior signal: enumerating the concrete behavioral differences, especially subclassing built-ins and static inheritance.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you create a private method in a class?',
    'What are static members and when do you use them?',
    'Why are class methods non-enumerable while object-literal methods are enumerable?',
    'How does subclassing Error or Array work, and why did it break in transpiled ES5?',
    'What is the difference between class declarations and class expressions?',
    'How do mixins work with classes?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to call super() before using this in a subclass constructor.',
      why: 'In a derived class, `this` is not initialized until super() runs; using it first throws a ReferenceError.',
      fix: 'Call super(...) as the first statement in the derived constructor.',
    },
    {
      mistake: 'Passing a class method as a callback and losing `this`.',
      why: 'Methods are not bound; detached, `this` becomes undefined in strict-mode class code.',
      fix: 'Use an arrow-function class field, bind in the constructor, or wrap the call in an arrow.',
    },
    {
      mistake: 'Treating leading-underscore properties as private.',
      why: 'They are fully public; only # fields are truly private.',
      fix: 'Use #private fields for real encapsulation when it matters.',
    },
    {
      mistake: 'Using a class before its declaration, expecting hoisting.',
      why: 'Class bindings are in a temporal dead zone until the declaration is evaluated.',
      fix: 'Declare classes before use, or use class expressions assigned to variables in order.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Class components extend React.Component with state, lifecycle, and arrow-field handlers to preserve `this`; custom Error subclasses model app errors.' },
    { area: 'Vue', detail: 'Class-style components (vue-class-component / decorators) and store classes; under the hood still prototype-based.' },
    { area: 'Node.js', detail: 'Subclassing EventEmitter, Stream, and Error; NestJS services/controllers are classes with DI via constructors.' },
    { area: 'Backend', detail: 'ORM entities (TypeORM/Sequelize models), domain aggregates, and typed error hierarchies are modeled as classes with inheritance and static factory methods.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Methods are shared on the prototype, so per-instance memory stays small for large instance counts.',
      'Consistent field initialization in the constructor yields stable hidden classes for fast property access.',
    ],
    bad: [
      'Arrow-function class fields create a new function per instance (per-instance memory) to preserve `this`.',
      'Deep extends chains add prototype lookup hops and reduce readability.',
    ],
    optimizations: [
      'Prefer prototype methods over arrow-field methods unless you specifically need bound `this`.',
      'Initialize all fields in a consistent order; avoid conditionally adding fields.',
      'Keep inheritance shallow; favor composition for cross-cutting behavior.',
      'Bind once (in the constructor) rather than creating new bound functions in render/hot paths.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Class constructors that copy untrusted input onto instances can introduce unsafe state; `constructor`/`prototype` access remains a prototype-pollution gadget surface.',
      'Private #fields are encapsulated but not secret — values are still in memory and inspectable in DevTools.',
    ],
    bestPractices: [
      'Validate constructor inputs; never blindly assign untrusted objects onto `this`.',
      'Do not treat #fields as a secure vault for client-side secrets; keep real secrets server-side.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['constructor-functions-new', 'prototype', 'this-keyword'],
    nextConcepts: ['inheritance-patterns', 'prototype-chain', 'custom-errors-cause', 'object-immutability'],
    dependencyNote:
      'Classes build directly on constructors/new and prototypes; mastering them leads into inheritance patterns, the prototype chain, and custom error hierarchies (which subclass Error).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a class with constructor + one method, then write its desugared constructor-function + prototype.method equivalent beside it.',
      'Draw the prototype: method lives on Class.prototype, shared by instances.',
      'Add extends: draw Child.prototype linking to Parent.prototype and call out super().',
      'Mark a #field on the instance as "private, not on prototype, inaccessible outside".',
      'Say: "Classes are sugar over prototypes — methods are shared on the prototype, # gives real privacy, and super wires the chain and calls the parent constructor."',
    ],
    diagram: `  class C { constructor(){} m(){} }   ≈  function C(){}; C.prototype.m=...
  instance ─[[Proto]]─► C.prototype { m }   (shared, non-enumerable)
  extends:  Child.prototype ─[[Proto]]─► Parent.prototype
  super() → call parent ctor ; super.m() → parent prototype method
  #field → private slot on instance (not on prototype)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A class is syntactic sugar over constructor functions and prototypes: the constructor initializes instance fields, methods are shared (non-enumerable) on the prototype, static members live on the class, and #fields are truly private. `extends` links the prototype chain and `super()` calls the parent constructor (call it before using `this`). Classes are not hoisted, run in strict mode, and throw without `new`. Watch out for losing `this` when passing methods as callbacks — fix with arrow fields or bind.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A class in JavaScript is syntactic sugar over the prototype model — it’s a cleaner way to write a constructor function plus prototype methods. The constructor body initializes per-instance fields with this, instance methods are installed once on the class prototype as non-enumerable properties so all instances share them, and static members live on the class itself. Classes also add genuinely new capabilities: # private fields and methods that are enforced by the language and stored off the prototype, static blocks, getters and setters, and proper inheritance with extends and super, where super() calls the parent constructor and super.method() reaches a parent prototype method. There are real behavioral differences from constructor functions: classes are not hoisted, so there’s a temporal dead zone; their bodies always run in strict mode; they throw if you call them without new; and they correctly support subclassing built-ins like Error and Array, which the old ES5 patterns couldn’t. The most common gotcha is losing this: methods aren’t auto-bound, so passing a method as a callback detaches this and, because class code is strict, this becomes undefined. I fix that with an arrow-function class field or by binding in the constructor. The custom-error pattern — class AppError extends Error with super(message) — is something I use constantly. Underneath, it’s all still prototypes and the prototype chain.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Classes give structure, inheritance, and discoverability but encourage hierarchies; composition often scales better for cross-cutting behavior.',
      'Arrow-field methods bind `this` ergonomically but cost per-instance allocation versus shared prototype methods.',
    ],
    edgeCases: [
      'Must call super() before this in a derived constructor or it throws.',
      'Subclassing built-ins (Array/Error) works natively but breaks under naive ES5 transpilation without proper super handling.',
      'Class declarations are in a TDZ (not hoisted like function declarations).',
      'Static members are inherited because the subclass constructor’s [[Prototype]] is the parent constructor.',
    ],
    runtimeBehavior: [
      'Prototype methods are non-enumerable, unlike object-literal methods.',
      'Private #fields use an internal mechanism keyed to the class; accessing a missing brand throws.',
      'Class bodies run in strict mode regardless of surrounding code.',
    ],
    scalability: [
      'Prototype-shared methods keep memory flat for large instance counts; avoid arrow-field methods at scale unless binding is required.',
      'Deep inheritance increases lookup cost and coupling; prefer shallow hierarchies plus mixins/composition.',
    ],
    productionConcerns: [
      'Lost-`this` bugs from passing unbound methods as callbacks are a frequent source of runtime errors.',
      'Transpilation targets matter for #fields and built-in subclassing; verify the build output.',
      'Custom error subclasses need name/cause set correctly and may require Object.setPrototypeOf workarounds under old transpilers.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Class = sugar over constructor function + prototype.',
    'Constructor sets instance fields; methods are shared on the prototype (non-enumerable).',
    'static members live on the class itself.',
    '#fields/#methods = true privacy, not on the prototype.',
    'extends links the prototype chain; super() calls parent ctor.',
    'Call super() before using this in a derived constructor.',
    'Classes are NOT hoisted (TDZ) and run in strict mode.',
    'Calling a class without new throws.',
    'Methods are not auto-bound → lost this when passed as callbacks.',
    'Fix this: arrow class field or bind in constructor.',
    'Subclass Error: class X extends Error { constructor(m){ super(m) } }.',
    'getters/setters and static blocks are supported.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a `Rectangle` class with width/height and an `area()` method.',
      hint: 'Set fields in the constructor; area is a method.',
      solution: {
        lang: 'js',
        code: `class Rectangle {
  constructor(w, h) { this.width = w; this.height = h }
  area() { return this.width * this.height }
}
console.log(new Rectangle(3, 4).area())  // 12`,
        explanation: [
          'The constructor assigns width and height per instance.',
          'area is a shared prototype method.',
          'new creates an instance whose prototype is Rectangle.prototype.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create a `Stack` class with a private #items array and push/pop/size methods.',
      hint: 'Use a #items field initialized to [].',
      solution: {
        lang: 'js',
        code: `class Stack {
  #items = []
  push(x) { this.#items.push(x); return this.#items.length }
  pop() { return this.#items.pop() }
  size() { return this.#items.length }
}
const s = new Stack()
s.push(1); s.push(2)
console.log(s.size())  // 2
console.log(s.pop())   // 2
// s.#items // SyntaxError — private`,
        explanation: [
          '#items is a private field, inaccessible outside the class.',
          'Methods operate on the same private array.',
          'Encapsulation is enforced by the language, not convention.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build `Shape` with a `describe()` and a subclass `Square(side)` that overrides `area()` and uses super in describe.',
      hint: 'extends + super(); override area; call super in describe.',
      solution: {
        lang: 'js',
        code: `class Shape {
  constructor(name) { this.name = name }
  area() { return 0 }
  describe() { return this.name + ' area=' + this.area() }
}
class Square extends Shape {
  constructor(side) { super('square'); this.side = side }
  area() { return this.side ** 2 }
}
const sq = new Square(5)
console.log(sq.describe())  // 'square area=25'
console.log(sq instanceof Shape) // true`,
        explanation: [
          'super(\'square\') initializes the parent before setting side.',
          'Square overrides area; describe (inherited) calls the overridden area via this.',
          'instanceof Shape holds because Shape.prototype is in the chain.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Create a custom `ValidationError` extending Error that carries a `field` and works with instanceof Error and error.message.',
      hint: 'Call super(message), set name and field.',
      solution: {
        lang: 'js',
        code: `class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.name = 'ValidationError'
    this.field = field
  }
}
try {
  throw new ValidationError('Email is required', 'email')
} catch (e) {
  console.log(e instanceof Error)          // true
  console.log(e instanceof ValidationError) // true
  console.log(e.message, e.field)          // 'Email is required' 'email'
}`,
        explanation: [
          'super(message) initializes the built-in Error message/stack.',
          'Setting name and field adds structured context.',
          'instanceof works for both Error and ValidationError because of the chain.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Classes are the way most real codebases define object types, so fluency is expected. Knowing they are sugar over prototypes — plus the # privacy, super rules, and this-binding pitfalls — proves you understand both modern syntax and the underlying model.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask class syntax, inheritance, and "are JS classes real classes". Product companies (Zoho, Flipkart, Razorpay) ask private fields, super semantics, and custom errors. FAANG-level interviews probe subclassing built-ins, static inheritance, the desugaring, and the lost-this/strict-mode interaction.',
    whatInterviewersExpect:
      'They expect you to write a class with inheritance, explain super and the call-before-this rule, contrast # privacy with conventions, and articulate that classes are syntactic sugar over prototypes with a few real behavioral differences.',
  },
}

export default es6Classes
