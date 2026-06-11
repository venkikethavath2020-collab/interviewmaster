import type { ConceptLesson } from '../../../types/lesson'

const prototype: ConceptLesson = {
  // 1. Concept Summary
  slug: 'prototype',
  name: 'Prototype',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The prototype is how JavaScript shares behavior between objects — it is the entire inheritance model, not classes (classes are sugar on top of it).',
    'Every method you call (`arr.map`, `str.toUpperCase`, `obj.hasOwnProperty`) is found via the prototype; not knowing this means not knowing how JS actually works.',
    'It is the #1 distinguishing concept in JS interviews: candidates who confuse `prototype` (on functions) with `__proto__` (on instances) get filtered immediately.',
    'Misusing it causes real bugs — adding to a shared prototype mutates every instance, and extending built-in prototypes breaks other libraries.',
    'Understanding prototypes is the prerequisite for the prototype chain, `new`, classes, inheritance, and prototype-pollution security issues.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A prototype is a shared family recipe book every cousin can read from but nobody has to copy by hand.',
    story: [
      'Imagine a big family where every cousin needs to know how to make pancakes.',
      'Instead of giving each cousin their own copy of the recipe (which would waste a lot of paper), the family keeps ONE recipe book on a shelf everyone can reach.',
      'When a cousin wants pancakes, they look in their own pocket first; if it is not there, they go to the shared shelf and read the family recipe.',
      'In JavaScript, each object first checks its own pockets (its own properties), and if it cannot find something, it walks up to the shared book — its prototype — to borrow the method from there.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every JavaScript object has a secret link to another object called its prototype.',
    'When you ask an object for a property or method it does not have, JavaScript follows that link and looks on the prototype instead.',
    'This lets many objects share the same methods without each one storing its own copy, which saves memory.',
    'Functions have a special `prototype` property that becomes the prototype of every object you create with `new`, which is how shared methods get attached.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A prototype is an object that another object links to and inherits properties/methods from. Each object has an internal [[Prototype]] (exposed as __proto__), and functions have a separate .prototype property used when you call them with new.',
    how: 'When you read a property, the engine checks the object’s own properties first; if not found, it follows [[Prototype]] to the prototype object and looks there. Methods are typically defined on a constructor’s .prototype so all instances share one copy.',
    why: 'It gives memory-efficient shared behavior and is the mechanism behind every method call, classes, and inheritance in JavaScript.',
    code: {
      label: 'Own property vs inherited from prototype',
      lang: 'js',
      code: `function Dog(name) { this.name = name }   // own property
Dog.prototype.bark = function () {        // shared method
  return this.name + ' says woof'
}

const d = new Dog('Rex')
console.log(d.bark())                 // 'Rex says woof'
console.log(d.hasOwnProperty('name')) // true  (own)
console.log(d.hasOwnProperty('bark')) // false (inherited)
console.log(Object.getPrototypeOf(d) === Dog.prototype) // true`,
      explanation: [
        '`name` is set on the instance — it is an own property.',
        '`bark` is defined on Dog.prototype, so it is shared by all dogs, not copied per instance.',
        '`d.bark()` is found by following d’s prototype link to Dog.prototype.',
        '`hasOwnProperty` distinguishes own (name) from inherited (bark).',
        'The instance’s [[Prototype]] IS the constructor’s .prototype object.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A prototype is an object from which another object inherits properties via the internal [[Prototype]] slot (accessible through Object.getPrototypeOf / the legacy __proto__ accessor). Property lookups that fail on an object’s own properties delegate to its prototype. Constructor functions carry a separate, public `prototype` property whose object becomes the [[Prototype]] of every instance created with `new`; that prototype object holds shared methods and a `constructor` back-reference. This delegation model — objects linking to other objects — is JavaScript’s native inheritance mechanism, distinct from classical class-based inheritance, with classes being syntactic sugar over it.',

  // 7. Internal Working
  internalWorking: [
    'When a function is created, the engine also creates a companion object as its `.prototype`, with a non-enumerable `constructor` property pointing back to the function.',
    'When you call `new Fn()`, the new instance’s internal [[Prototype]] is set to `Fn.prototype` (a reference, not a copy).',
    'On a property read, the engine checks the object’s own properties; if absent, it follows [[Prototype]] to the prototype object and repeats, forming a lookup chain that ends at null.',
    'On a property write (`obj.x = v`), the engine sets an OWN property on the object — it does not modify the prototype (unless the prototype has a setter for that key).',
    'Methods placed on the prototype exist as a single shared function object; all instances reference the same function, with `this` bound to whichever instance invoked it.',
    'Object.getPrototypeOf reads [[Prototype]]; Object.setPrototypeOf changes it at runtime (slow, deoptimizes engines, generally discouraged).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Dog (function)                 Dog.prototype (object)
  ┌──────────────┐  .prototype   ┌──────────────────────┐
  │  Dog(name){} │ ────────────► │ bark: fn             │
  └──────────────┘               │ constructor: Dog ◄───┐│
                                 └──────────┬───────────┘│
   new Dog('Rex')                           ▲ [[Proto]]  │
   ┌──────────────┐                         │            │
   │ name: 'Rex'  │ ── [[Prototype]] ───────┘            │
   └──────────────┘   (instance links to Dog.prototype)  │
        d.bark() → not own → follow link → Dog.prototype.bark`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the prototype object is a single heap allocation shared by every instance; methods on it are NOT duplicated per instance.',
    'REFERENCE: each instance’s [[Prototype]] is a reference to that one prototype object — change the prototype and all instances see the change instantly.',
    'OWN vs INHERITED: own properties (set via this.x or assignment) live on the instance; inherited members live on the prototype and are looked up by delegation.',
    'A function’s `.prototype` and an object’s `[[Prototype]]` are different things that happen to point to the same object after `new`.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — prototype vs __proto__',
      lang: 'js',
      code: `function Cat() {}
const c = new Cat()
// .prototype lives on the FUNCTION
console.log(typeof Cat.prototype)              // 'object'
// __proto__ / [[Prototype]] lives on the INSTANCE
console.log(c.__proto__ === Cat.prototype)     // true
console.log(Object.getPrototypeOf(c) === Cat.prototype) // true`,
      explanation: [
        '`Cat.prototype` is a property of the function — the template for instances.',
        '`c.__proto__` (or Object.getPrototypeOf(c)) is the instance’s link to that prototype.',
        'They point to the SAME object after new.',
        'Confusing these two is the most common prototype mistake.',
      ],
    },
    intermediate: {
      label: 'Intermediate — shared methods save memory',
      lang: 'js',
      code: `function User(name) { this.name = name }
User.prototype.hello = function () { return 'Hi ' + this.name }

const a = new User('A')
const b = new User('B')
console.log(a.hello === b.hello)  // true — ONE shared function
// vs putting the method in the constructor (a copy each time):
function Bad(name) { this.name = name; this.hello = function () {} }
console.log(new Bad('A').hello === new Bad('B').hello) // false`,
      explanation: [
        'hello on the prototype is a single function shared by every User.',
        '`a.hello === b.hello` is true, proving it is not copied per instance.',
        'Defining the method inside the constructor creates a NEW function per instance.',
        'For many instances, the prototype approach uses far less memory.',
      ],
    },
    advanced: {
      label: 'Advanced — Object.create to set a prototype directly',
      lang: 'js',
      code: `const animal = {
  describe() { return this.type + ' makes ' + this.sound },
}
const dog = Object.create(animal)  // dog's [[Prototype]] = animal
dog.type = 'dog'
dog.sound = 'woof'
console.log(dog.describe())        // 'dog makes woof'
console.log(Object.getPrototypeOf(dog) === animal) // true
// describe is found by delegation, not stored on dog`,
      explanation: [
        'Object.create makes a new object with the chosen prototype directly — no constructor needed.',
        '`dog` has its own type and sound but borrows describe from animal.',
        'Calling describe binds `this` to dog, so it reads dog’s own properties.',
        'This is prototypal delegation in its purest form.',
      ],
    },
    realProject: {
      label: 'Real project — why NOT to extend built-in prototypes',
      lang: 'js',
      code: `// Tempting but dangerous: monkey-patching Array.prototype
// Array.prototype.last = function () { return this[this.length - 1] }
// Problem: it becomes enumerable in some patterns and can clash with
// other libraries that add the same method differently.

// Safe alternative — a standalone utility (used across Vue/React/Node):
function last(arr) { return arr[arr.length - 1] }
last([1, 2, 3]) // 3

// If you MUST extend, define non-enumerable to avoid for..in leaks:
Object.defineProperty(Array.prototype, 'lastSafe', {
  value() { return this[this.length - 1] },
  enumerable: false, writable: true, configurable: true,
})`,
      explanation: [
        'Adding to Array.prototype affects EVERY array in the app and any dependency — a notorious source of conflicts.',
        'An enumerable prototype method leaks into for...in loops everywhere.',
        'The safe pattern is a standalone function, which is also tree-shakeable.',
        'If extension is unavoidable, define it non-enumerable via Object.defineProperty.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a prototype in JavaScript?',
      answer: 'An object that another object links to and inherits properties/methods from. When a lookup fails on an object’s own properties, the engine checks its prototype.',
      explanation: 'A good answer mentions delegation: lookups fall back to the prototype.',
    },
    {
      level: 'beginner',
      question: 'Where are array methods like map and filter actually defined?',
      answer: 'On Array.prototype. Each array’s [[Prototype]] links to Array.prototype, so calling arr.map finds map there by delegation.',
      explanation: 'Connecting everyday methods to the prototype shows real understanding of how JS works.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between `prototype` and `__proto__`?',
      answer: '`prototype` is a property of constructor FUNCTIONS — the object that becomes instances’ prototype. `__proto__` (or Object.getPrototypeOf) is the actual prototype link on an INSTANCE. After new, instance.__proto__ === Constructor.prototype.',
      explanation: 'This distinction is the single most asked prototype question; precision matters.',
    },
    {
      level: 'intermediate',
      question: 'Why define methods on the prototype instead of inside the constructor?',
      answer: 'Prototype methods are defined once and shared by all instances (memory-efficient). Methods inside the constructor are recreated for every instance, wasting memory.',
      explanation: 'The memory/sharing trade-off is the practical reason for prototypes.',
    },
    {
      level: 'advanced',
      question: 'What happens when you write to a property that exists only on the prototype?',
      answer: 'Assignment creates an OWN property on the instance that shadows the prototype’s; it does not modify the prototype (unless the prototype defines a setter for that key). Reads then see the instance’s own value.',
      explanation: 'Understanding shadowing (write-creates-own, read-delegates) is a strong intermediate/advanced signal.',
    },
    {
      level: 'senior',
      question: 'Why is Object.setPrototypeOf considered slow and discouraged?',
      answer: 'Changing an object’s prototype after creation invalidates the engine’s hidden-class and inline-cache assumptions, forcing deoptimization of code that touches the object. It is far better to set the prototype at creation time via Object.create or new.',
      explanation: 'Senior signal: tying prototypes to V8 hidden classes, inline caches, and deopts.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the prototype chain and where does it end? (at null via Object.prototype)',
    'How do classes relate to prototypes? (sugar: methods live on the class prototype)',
    'What is the constructor property and can it be wrong?',
    'How does hasOwnProperty differ from the `in` operator?',
    'Why is extending native prototypes (Array, Object) discouraged?',
    'How does prototype pollution exploit the prototype chain?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing `Constructor.prototype` with `instance.__proto__`.',
      why: 'They are different slots that happen to reference the same object; mixing them up leads to wrong mental models and broken inheritance code.',
      fix: 'Remember: prototype is on the function; __proto__/[[Prototype]] is on the instance; new wires instance.__proto__ = Constructor.prototype.',
    },
    {
      mistake: 'Defining methods inside the constructor for many instances.',
      why: 'Each instance gets its own copy of the function, wasting memory.',
      fix: 'Put shared methods on Constructor.prototype (or use a class) so they are defined once.',
    },
    {
      mistake: 'Extending built-in prototypes (Array.prototype.foo = ...).',
      why: 'It affects every array app-wide, can leak into for...in, and clashes with libraries.',
      fix: 'Use standalone utility functions; if you must extend, define non-enumerable properties.',
    },
    {
      mistake: 'Expecting writing to a prototype property to update the prototype.',
      why: 'Assignment creates an own property that shadows the prototype, so other instances are unaffected.',
      fix: 'Mutate the prototype explicitly (Constructor.prototype.x = ...) if you really intend shared change.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Component options and instances rely on prototype-based method sharing; Vue 2 installed helpers (e.g. $emit, $nextTick) on the component prototype.' },
    { area: 'React', detail: 'Class components extend React.Component, inheriting setState/lifecycle via the prototype chain; method sharing keeps instances lean.' },
    { area: 'Node.js', detail: 'Core classes (EventEmitter, Stream) define methods on prototypes; subclasses inherit via the chain. Standalone utilities are preferred over patching built-ins.' },
    { area: 'Backend', detail: 'ORMs and domain models use prototypes/classes so all entities share query and serialization methods without per-instance duplication.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Shared prototype methods mean one function object regardless of instance count — minimal memory.',
      'Stable prototypes let engines build inline caches for fast method dispatch.',
    ],
    bad: [
      'Object.setPrototypeOf / mutating prototypes at runtime deoptimizes the engine and slows property access.',
      'Very long prototype chains add lookup steps for missing properties.',
    ],
    optimizations: [
      'Set the prototype once at creation (new / Object.create), never reassign it later.',
      'Keep prototype chains short and shapes stable to preserve inline caches.',
      'Define methods on the prototype, not in the constructor, for instance-heavy code.',
      'Avoid patching native prototypes; use tree-shakeable utilities instead.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Prototype pollution: if attacker-controlled keys like __proto__ reach a deep-merge or property set, they can add properties to Object.prototype, affecting every object (auth bypass, DoS, RCE in some libraries).',
      'Patched/poisoned native prototypes can change the behavior of code that assumes standard built-ins.',
    ],
    bestPractices: [
      'Sanitize or reject __proto__/constructor/prototype keys when merging untrusted data; use Map or Object.create(null) for untrusted key maps.',
      'Freeze critical prototypes/objects and avoid extending native prototypes to reduce the attack surface.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'this-keyword', 'constructor-functions-new'],
    nextConcepts: ['prototype-chain', 'es6-classes', 'inheritance-patterns', 'property-descriptors', 'prototype-pollution'],
    dependencyNote:
      'Prototype is the core of the objects-prototypes spine: it directly enables the prototype chain, constructors/new, classes, and inheritance, and underlies the prototype-pollution security topic.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the function Dog with a .prototype arrow to a box holding bark + constructor.',
      'Draw an instance from new Dog with name on it and a [[Prototype]] arrow up to that same prototype box.',
      'Show a lookup: d.bark → not on instance → follow arrow up → found on prototype.',
      'Label clearly: prototype is on the FUNCTION, [[Prototype]]/__proto__ is on the INSTANCE.',
      'Say: "Objects delegate to their prototype, so one shared method serves all instances — that is JavaScript inheritance."',
    ],
    diagram: `  Dog ──.prototype──► { bark, constructor }
                              ▲
                              │ [[Prototype]]
  new Dog('Rex') ── { name } ─┘
  d.bark() : own? no → follow link → prototype.bark ✓`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A prototype is an object that another object delegates to: failed property lookups fall back to the prototype. Functions have a .prototype property; instances created with new get that object as their [[Prototype]] (__proto__). Methods on the prototype are shared by all instances — defined once, saving memory — which is how arr.map and all built-in methods work. Writing a property creates an own property (shadowing); reading delegates up the chain. Don’t confuse .prototype (function) with __proto__ (instance), don’t patch native prototypes, and never mutate prototypes at runtime.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A prototype is simply another object that an object delegates to. When I read a property, the engine checks the object’s own properties first; if it’s not there, it follows the internal [[Prototype]] link to the prototype object and looks there, continuing up a chain until it hits null. This delegation is JavaScript’s native inheritance — there are no classes underneath, just objects linking to objects. The part people confuse is two different things named similarly: a constructor function has a public .prototype property, and that object becomes the [[Prototype]] of every instance you create with new, exposed as __proto__ or via Object.getPrototypeOf. So instance.__proto__ === Constructor.prototype. The big practical win is method sharing: if I put a method on the prototype, it exists as a single function object shared by every instance, with this bound to whichever instance called it — far cheaper than defining it inside the constructor, which copies it per instance. That’s literally why arr.map and str.toUpperCase work — they live on Array.prototype and String.prototype. A couple of caveats: writing to a property always creates an own property that shadows the prototype rather than mutating it; mutating prototypes at runtime via setPrototypeOf is slow because it deoptimizes the engine; and extending native prototypes is dangerous because it affects every object app-wide and is the basis of prototype-pollution attacks.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Prototypal delegation gives memory-efficient sharing and dynamic behavior but is less explicit than copying methods per object and can surprise developers expecting classical inheritance.',
      'Object.create-based delegation is flexible but loses the discoverability and instanceof ergonomics of classes.',
    ],
    edgeCases: [
      'Writing to a prototype-only property shadows it on the instance; only an explicit prototype mutation changes shared state.',
      'The constructor property can become wrong after reassigning a prototype object (set it back manually).',
      'Object.prototype is the root; objects from Object.create(null) have no prototype and lack hasOwnProperty/toString.',
      'Accessor properties on a prototype run with this bound to the instance, not the prototype.',
    ],
    runtimeBehavior: [
      'V8 tracks prototype shape; stable prototypes enable inline caches, while setPrototypeOf invalidates them and causes deopts.',
      'Property reads walk the chain step by step, so deep chains cost more for missing keys.',
      'Adding a property to a widely-shared prototype invalidates caches for all instances.',
    ],
    scalability: [
      'For millions of objects, prototype sharing is essential to keep memory flat; per-instance methods would explode heap usage.',
      'Long inheritance chains in hot paths add lookup overhead; favor flatter hierarchies or composition.',
    ],
    productionConcerns: [
      'Prototype pollution from deep-merging untrusted JSON is a recurring CVE; sanitize keys and use null-prototype maps.',
      'Monkey-patching native prototypes causes hard-to-debug cross-library conflicts and breaks on engine upgrades.',
      'Reassigning prototypes at runtime in performance-sensitive code triggers deopts that are hard to diagnose.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Prototype = object you delegate to when a lookup misses.',
    '.prototype is on the FUNCTION; __proto__/[[Prototype]] is on the INSTANCE.',
    'After new: instance.__proto__ === Constructor.prototype.',
    'Methods on the prototype are shared (one copy) by all instances.',
    'arr.map / str.toUpperCase live on Array/String.prototype.',
    'Read delegates up the chain; write creates an OWN property (shadowing).',
    'Object.getPrototypeOf reads; Object.setPrototypeOf changes (slow!).',
    'Object.create(proto) sets a prototype directly, no constructor.',
    'Object.create(null) → no prototype, clean map.',
    'Don’t patch native prototypes; use standalone functions.',
    'Chain ends at Object.prototype → null.',
    '__proto__ misuse / deep-merge → prototype pollution.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add a `greet` method to a Person constructor’s prototype so all instances share it. Show two instances share the same function.',
      hint: 'Define Person.prototype.greet and compare with ===.',
      solution: {
        lang: 'js',
        code: `function Person(name) { this.name = name }
Person.prototype.greet = function () { return 'Hi ' + this.name }
const a = new Person('A'), b = new Person('B')
console.log(a.greet())          // 'Hi A'
console.log(a.greet === b.greet) // true — shared`,
        explanation: [
          'greet is defined once on the prototype.',
          'Both instances delegate to it, so the function is shared.',
          '=== true proves it is not copied per instance.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Using Object.create, make `square` whose prototype is a `shape` object with an `area()` method that reads this.side ** 2.',
      hint: 'area lives on the prototype; side is own.',
      solution: {
        lang: 'js',
        code: `const shape = { area() { return this.side ** 2 } }
const square = Object.create(shape)
square.side = 4
console.log(square.area())  // 16
console.log(Object.getPrototypeOf(square) === shape) // true`,
        explanation: [
          'Object.create sets square’s [[Prototype]] to shape.',
          'square has its own side; area is borrowed via delegation.',
          'this inside area is square, so it reads square.side.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement `getOwnAndInherited(obj, key)` returning { own, inherited } booleans for a key, distinguishing own vs prototype-inherited.',
      hint: 'Use hasOwnProperty and `in`.',
      solution: {
        lang: 'js',
        code: `function getOwnAndInherited(obj, key) {
  const own = Object.prototype.hasOwnProperty.call(obj, key)
  const present = key in obj
  return { own, inherited: present && !own }
}
function A() {} ; A.prototype.shared = 1
const o = new A() ; o.local = 2
getOwnAndInherited(o, 'local')  // { own: true, inherited: false }
getOwnAndInherited(o, 'shared') // { own: false, inherited: true }`,
        explanation: [
          'hasOwnProperty.call safely checks own properties even for null-proto objects.',
          '`in` checks the whole chain; subtracting own gives inherited.',
          'This cleanly separates instance data from prototype data.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Polyfill a simplified `Object.create(proto)` using a constructor function (no Object.create allowed).',
      hint: 'Make an empty constructor, set its prototype to proto, return a new instance.',
      solution: {
        lang: 'js',
        code: `function myCreate(proto) {
  function F() {}            // empty constructor
  F.prototype = proto        // its instances will link to proto
  return new F()             // new instance with [[Prototype]] = proto
}
const base = { hi() { return 'hi' } }
const o = myCreate(base)
console.log(o.hi())                          // 'hi'
console.log(Object.getPrototypeOf(o) === base) // true`,
        explanation: [
          'Setting F.prototype = proto means new F() gets proto as its [[Prototype]].',
          'The empty constructor adds no own properties.',
          'This is exactly how Object.create was polyfilled before ES5 support — it demonstrates the new/prototype wiring.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Prototypes are the beating heart of JavaScript objects. Master this and the prototype chain, classes, new, and inheritance all become obvious. It is also the concept that most reliably separates candidates who truly understand JS from those who memorized class syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is a prototype" and the prototype vs __proto__ difference. Product companies (Zoho, Flipkart, Razorpay) ask why prototype methods save memory and to use Object.create. FAANG-level interviews probe shadowing, setPrototypeOf deopts, native-prototype dangers, and prototype pollution.',
    whatInterviewersExpect:
      'They expect a crisp delegation definition, the .prototype-vs-__proto__ distinction, the memory benefit of shared methods, and awareness of shadowing and the risks of mutating/patching prototypes.',
  },
}

export default prototype
