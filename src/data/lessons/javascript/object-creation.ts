import type { ConceptLesson } from '../../../types/lesson'

const objectCreation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'object-creation',
  name: 'Object Creation Patterns',
  category: 'objects-prototypes',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Objects are how JavaScript models almost everything — users, config, DOM nodes, API responses — so knowing how to create them well is daily work.',
    'There are five distinct ways to make an object (literal, Object.create, constructor + new, class, factory), and choosing the wrong one bloats memory or breaks the prototype chain.',
    'Interviewers use object creation to probe whether you understand prototypes, `this`, and `new` — the truth behind every "create N users efficiently" question.',
    'Without the right pattern you end up duplicating methods on every instance, leaking shared state, or accidentally mutating a single object you thought you had copied.',
    'Frameworks (Vue reactive objects, React state, Node config) all hand you objects; understanding their identity and prototype lets you reason about reactivity and equality.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Making an object is like filling a labeled lunchbox with named compartments.',
    story: [
      'Imagine a lunchbox with little compartments, and on each compartment you write a label: "sandwich", "apple", "juice".',
      'You can fill one lunchbox by hand, putting the apple in the apple slot — that is making an object directly.',
      'Or you can have a lunchbox machine: you tell it "make me a lunchbox" and it stamps out one already filled the same way every time.',
      'Both give you a lunchbox with labeled compartments. The labels are the object keys, and what is inside them is the values. Picking how you build the lunchbox is just picking a convenient way to fill those labeled slots.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An object in JavaScript is a collection of key-value pairs, like a dictionary where each word (key) maps to a meaning (value).',
    'The simplest way to make one is the object literal: you write curly braces and list the keys and values inside.',
    'When you need many similar objects (lots of users), you use a "recipe" — a function or a class — so you do not retype the same shape over and over.',
    'Every object also secretly links to another object called its prototype, which is where shared abilities (methods) can live so they are not copied into each instance.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Object creation is the set of techniques for producing a JavaScript object: literal syntax `{}`, `Object.create(proto)`, constructor functions with `new`, ES6 `class`, and factory functions that return an object.',
    how: 'A literal is fastest for one-off objects. For many similar objects you use a class/constructor (shared methods via the prototype) or a factory function (returns a fresh object, often using closures for privacy).',
    why: 'Choosing the right pattern controls memory (shared vs duplicated methods), privacy (closures vs public fields), and the prototype chain (what the object inherits).',
    code: {
      label: 'Three common ways to make a "user"',
      lang: 'js',
      code: `// 1. Object literal — one-off
const u1 = { name: 'Sam', greet() { return 'Hi ' + this.name } }

// 2. Factory function — returns a new object each call
function createUser(name) {
  return { name, greet() { return 'Hi ' + name } }
}
const u2 = createUser('Lee')

// 3. Class — shared method on the prototype
class User {
  constructor(name) { this.name = name }
  greet() { return 'Hi ' + this.name }
}
const u3 = new User('Mo')`,
      explanation: [
        'The literal is perfect when you need exactly one object with a fixed shape.',
        'The factory returns a brand-new object every call; here `greet` is recreated per object (uses a closure over `name`).',
        'The class puts `greet` once on `User.prototype`, so all instances share it — more memory-efficient for many users.',
        'All three produce an object with a `name` and a `greet`, but they differ in method sharing and privacy.',
        '`u3 instanceof User` is true; `u2` has no such class relationship.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Object creation refers to the mechanisms by which JavaScript instantiates objects and wires their [[Prototype]] link. Literal syntax creates a plain object whose prototype is Object.prototype. Object.create(proto, descriptors) creates an object with an explicitly chosen prototype and optional property descriptors. Constructor functions invoked with `new` create an object whose prototype is the constructor’s `.prototype`, bind `this`, run the body, and implicitly return the new object. Classes are syntactic sugar over constructor + prototype. Factory functions are ordinary functions that build and return an object, typically leveraging closures for encapsulation rather than the prototype chain.',

  // 7. Internal Working
  internalWorking: [
    'For a literal `{a:1}`, the engine allocates a new object on the heap, sets its [[Prototype]] to Object.prototype, and defines the listed own properties (engines also build a hidden class / shape for fast property access).',
    'For `Object.create(proto)`, the engine allocates an object and sets [[Prototype]] directly to `proto` (which may be null for a dictionary-like object with no inherited members).',
    'For `new Ctor()`, the engine: (1) creates a new object, (2) sets its [[Prototype]] to Ctor.prototype, (3) calls Ctor with `this` bound to that object, (4) returns the object unless the body explicitly returns another object.',
    'For a `class`, the constructor runs the same `new` algorithm; methods are installed once on the class prototype, and fields are assigned per instance.',
    'For a factory, the engine just runs the function; the returned object’s prototype is whatever the returned literal/expression uses (Object.prototype by default) — no `new`, no automatic prototype wiring.',
    'Engines optimize by sharing hidden classes (shapes) between objects created with the same key order, so consistent construction order improves inline-cache hit rates.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  LITERAL  { name }            CLASS / new            FACTORY
  ┌───────────────┐            ┌───────────────┐       ┌───────────────┐
  │ obj           │            │ instance      │       │ obj (returned)│
  │  name: 'Sam'  │            │  name: 'Mo'   │       │  name: 'Lee'  │
  └──────┬────────┘            └──────┬────────┘       │  greet()  ◄── closure
         │ [[Proto]]                  │ [[Proto]]      └──────┬────────┘
         ▼                            ▼                       │ [[Proto]]
  Object.prototype             User.prototype                 ▼
                               { greet }  (shared)     Object.prototype
                                     │
                                     ▼
                               Object.prototype`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: every object (literal, instance, factory result) is a heap allocation; variables on the stack hold references to it.',
    'SHARED vs PER-INSTANCE: class/constructor methods live ONCE on the shared prototype object; factory methods defined inline are duplicated per returned object (more heap usage).',
    'REFERENCES: assigning `const b = a` copies the reference, not the object, so both names point to the same heap object — mutating through one is visible through the other.',
    'HIDDEN CLASS: V8 attaches a shape descriptor to objects with the same property layout; creating objects with identical key order lets them share that shape and stay fast.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — literal vs Object.create',
      lang: 'js',
      code: `const a = { x: 1 }              // prototype = Object.prototype
const b = Object.create(a)     // prototype = a
b.y = 2
console.log(b.x)               // 1 (inherited from a)
console.log(Object.getPrototypeOf(b) === a) // true`,
      explanation: [
        '`a` is a plain object whose prototype is Object.prototype.',
        '`Object.create(a)` makes `b` whose prototype is `a` itself.',
        'Reading `b.x` is not found as an own property, so the engine walks to `a` and finds `1`.',
        'This is the most direct way to control an object’s prototype.',
      ],
    },
    intermediate: {
      label: 'Intermediate — factory with private state',
      lang: 'js',
      code: `function createCounter(start = 0) {
  let count = start            // private via closure
  return {
    increment() { return ++count },
    value() { return count },
  }
}
const c = createCounter(10)
c.increment()                  // 11
c.value()                      // 11
// c.count is undefined — truly private`,
      explanation: [
        'The factory returns a new object whose methods close over the private `count`.',
        'There is no `count` property on the object, so it cannot be read or set from outside.',
        'No `new` and no prototype gymnastics — just a function returning an object.',
        'Trade-off: each call recreates the method functions, costing more memory than a shared prototype.',
      ],
    },
    advanced: {
      label: 'Advanced — constructor + new with shared methods',
      lang: 'js',
      code: `function Point(x, y) {
  this.x = x
  this.y = y
}
Point.prototype.distanceTo = function (other) {
  return Math.hypot(this.x - other.x, this.y - other.y)
}

const p1 = new Point(0, 0)
const p2 = new Point(3, 4)
p1.distanceTo(p2)              // 5
console.log(p1.distanceTo === p2.distanceTo) // true (shared)`,
      explanation: [
        '`new Point(...)` creates an object whose prototype is `Point.prototype` and binds `this`.',
        '`distanceTo` is defined once on the prototype, so all points share the same function object.',
        'This is far more memory-efficient than a factory that recreates `distanceTo` per object.',
        'Forgetting `new` would make `this` the global object (or undefined in strict mode) — a classic bug.',
      ],
    },
    realProject: {
      label: 'Real project — config object factory in Node.js',
      lang: 'js',
      code: `// Node service: build an immutable config object once at startup
function createConfig(env) {
  const cfg = Object.create(null)   // no prototype → safe key map
  cfg.port = Number(env.PORT) || 3000
  cfg.dbUrl = env.DATABASE_URL
  cfg.isProd = env.NODE_ENV === 'production'
  return Object.freeze(cfg)         // prevent accidental mutation
}

const config = createConfig(process.env)
// config.port = 9999  // silently ignored (or throws in strict mode)`,
      explanation: [
        '`Object.create(null)` makes a prototype-less object — safe as a key/value map (no inherited `toString`, no prototype-pollution surface).',
        'Properties are assigned explicitly from environment variables.',
        '`Object.freeze` locks the object so no part of the app can mutate shared config at runtime.',
        'This pattern appears in Express/Fastify apps and any service that loads config once and treats it as read-only.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the different ways to create an object in JavaScript?',
      answer: 'Object literal `{}`, `Object.create(proto)`, constructor function with `new`, ES6 `class`, and factory functions that return an object.',
      explanation: 'A strong answer also notes how they differ: literals for one-offs, classes/constructors for many objects sharing methods via the prototype, factories for closures/privacy.',
    },
    {
      level: 'beginner',
      question: 'What prototype does `{}` get versus `Object.create(null)`?',
      answer: '`{}` gets Object.prototype as its prototype, so it inherits methods like toString and hasOwnProperty. `Object.create(null)` has no prototype at all, so it is a clean key map with no inherited members.',
      explanation: 'Shows awareness of the prototype link and why a null-prototype object is safer as a dictionary.',
    },
    {
      level: 'intermediate',
      question: 'Factory function vs constructor function — when would you use each?',
      answer: 'Factories return a fresh object (often with closures for private state) and avoid `this`/`new` pitfalls. Constructors/classes share methods on the prototype, are memory-efficient for many instances, and support `instanceof`.',
      explanation: 'The key trade-off is method sharing (prototype) vs privacy (closure) and the memory cost of recreating methods per factory call.',
    },
    {
      level: 'intermediate',
      question: 'What exactly does `new` do?',
      answer: 'It creates a new object, sets its prototype to the constructor’s `.prototype`, binds `this` to it, runs the constructor body, and returns the object (unless the body explicitly returns another object).',
      explanation: 'Reciting the four steps demonstrates real understanding of object construction, not just syntax.',
    },
    {
      level: 'advanced',
      question: 'Why can defining methods inside a factory cost more memory than a class?',
      answer: 'A factory recreates each method function on every call, so 1000 objects means 1000 copies of each method. A class defines the method once on the shared prototype, so all 1000 instances reference the same function.',
      explanation: 'Strong answers mention heap allocation, GC pressure, and that you can mitigate factories by sharing a method object or using a prototype.',
    },
    {
      level: 'senior',
      question: 'How do engines optimize object creation, and how should that influence how you write code?',
      answer: 'V8 assigns hidden classes (shapes) to objects with the same property layout and order; objects sharing a shape use inline caches for fast property access. Adding properties in a consistent order and avoiding deleting properties keeps objects on a stable shape and avoids deopts.',
      explanation: 'Senior signal: connecting object creation to hidden classes, inline caches, and the cost of polymorphic shapes in hot paths.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a shallow and deep copy of an object?',
    'How do you make an object immutable, and is Object.freeze deep?',
    'What happens if you forget `new` when calling a constructor?',
    'How does `Object.create(proto, descriptors)` let you set property attributes at creation time?',
    'When would you use `Object.create(null)` over `{}`?',
    'How do classes desugar into constructor functions and prototype methods?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Defining shared methods inside a factory for thousands of objects.',
      why: 'Each call allocates a fresh copy of every method, wasting memory and adding GC pressure.',
      fix: 'Use a class/constructor so methods live once on the prototype, or share a single method object across factory results.',
    },
    {
      mistake: 'Calling a constructor without `new`.',
      why: '`this` becomes the global object (or undefined in strict mode), so properties leak globally or throw.',
      fix: 'Use a `class` (which throws if called without new), or guard with `if (!(this instanceof Ctor)) return new Ctor(...)`.',
    },
    {
      mistake: 'Treating `const b = a` as a copy of the object.',
      why: 'It copies the reference, not the object; mutating `b` mutates `a` because they point to the same heap object.',
      fix: 'Use spread `{...a}` for a shallow copy or structuredClone(a) for a deep copy when you need independence.',
    },
    {
      mistake: 'Using `{}` as a generic map and being surprised by inherited keys.',
      why: 'A plain object inherits Object.prototype members (e.g. `toString`), and untrusted keys can collide or trigger prototype pollution.',
      fix: 'Use `Object.create(null)` or a real `Map` for arbitrary/user-controlled keys.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Reactive state is created from plain objects (reactive()/ref()); Vue wraps them in Proxies, so understanding that the object identity is preserved while access is intercepted matters for reactivity.' },
    { area: 'React', detail: 'State and props are plain objects; immutable update patterns rely on creating NEW objects with spread so referential equality changes and triggers re-render.' },
    { area: 'Node.js', detail: 'Config and DTO objects are often built with factories or Object.create(null) maps; classes model domain entities (User, Order) with shared methods on the prototype.' },
    { area: 'Backend', detail: 'ORMs instantiate entities via constructors; repositories return fresh objects per query — knowing creation patterns helps reason about identity, caching, and serialization.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Object literals are extremely fast and let the engine assign an optimal hidden class up front.',
      'Sharing methods via a prototype (class/constructor) keeps per-instance memory tiny for large collections.',
    ],
    bad: [
      'Factories that define methods inline duplicate functions per object, increasing memory and GC churn at scale.',
      'Adding/deleting properties after creation or using inconsistent key order forces shape transitions and deopts in hot paths.',
    ],
    optimizations: [
      'Initialize all properties in the constructor/literal in a consistent order so objects share one hidden class.',
      'Prefer prototype methods (or a shared method object) over per-instance functions when creating many objects.',
      'Use `Object.create(null)` or `Map` for large/dynamic key collections to avoid prototype lookups and pollution.',
      'Avoid `delete` on hot objects; set to undefined or use a Map if keys come and go.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Plain objects used as maps with user-controlled keys are vulnerable to prototype pollution (a malicious `__proto__` key can alter Object.prototype).',
      'Deep-merging untrusted JSON into existing objects can inject properties onto the prototype chain.',
    ],
    bestPractices: [
      'Use `Object.create(null)` or `Map` for objects keyed by untrusted input.',
      'Reject or sanitize `__proto__`, `constructor`, and `prototype` keys when merging external data, and freeze critical config objects.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'primitive-vs-reference', 'this-keyword'],
    nextConcepts: ['prototype', 'constructor-functions-new', 'es6-classes', 'property-descriptors', 'object-immutability'],
    dependencyNote:
      'Object creation is the entry point to the objects-prototypes spine: you need data-types and reference semantics first, and it leads directly into prototypes, constructors/new, classes, and property descriptors.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'List the five creation patterns down the left: literal, Object.create, constructor+new, class, factory.',
      'Draw two objects from a class sharing ONE prototype box (arrows from both to the same { greet }).',
      'Draw two objects from a factory each with their OWN greet inside them.',
      'Point out: class shares methods (less memory), factory duplicates them (privacy via closure).',
      'Say: "The pattern I pick depends on whether I want shared prototype methods, private state, or just a quick one-off object."',
    ],
    diagram: `  CLASS (shared)              FACTORY (per-object)
  obj1 ─┐                      obj1 { greet }
  obj2 ─┼──► prototype{greet}  obj2 { greet }
        │                      (each has its own copy)
  one shared method            more memory, true privacy`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript objects can be made five ways: literal `{}`, Object.create(proto), constructor + new, class, and factory functions. Literals are for one-offs. Classes/constructors share methods on the prototype, so they are memory-efficient for many instances and support instanceof. Factories return a fresh object and can use closures for true private state but recreate methods per call. `new` makes an object, links its prototype, binds this, runs the body, and returns it. Watch for reference copies, forgetting new, and prototype pollution when using objects as maps.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'There are five main ways to create objects in JavaScript, and the choice is really about prototypes, memory, and privacy. The simplest is the object literal, great for a one-off object; its prototype is Object.prototype. Object.create lets me pick the prototype explicitly, including null for a clean key map. For many similar objects I reach for a constructor function with new, or its modern sugar, a class. new does four things: it creates a new object, sets its prototype to the constructor’s prototype, binds this to it, runs the body, and returns the object. The big win is that methods live once on the shared prototype, so a thousand instances do not each carry their own copy. A factory function is just a function that returns an object; it sidesteps this and new and can use closures for genuinely private state, but the trade-off is that any methods defined inline are recreated on every call, costing memory at scale. The common traps are treating const b = a as a copy when it only copies the reference, forgetting new so this leaks to the global object, and using plain objects as maps with untrusted keys, which opens the door to prototype pollution — there I use Object.create(null) or a Map.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Prototype-based (class/constructor) gives shared methods and instanceof but exposes state publicly; factory + closure gives privacy but duplicates methods and breaks instanceof.',
      'Object.create(null) avoids prototype pollution and inherited keys but loses convenient methods like hasOwnProperty (call Object.prototype.hasOwnProperty.call instead).',
    ],
    edgeCases: [
      'A constructor that explicitly returns an object overrides the implicitly created `this` object — returning a primitive is ignored.',
      'Calling a class without `new` throws a TypeError, unlike a constructor function (which silently misbehaves).',
      'Mixing key insertion order across instances creates polymorphic hidden classes and slows property access.',
    ],
    runtimeBehavior: [
      'V8 builds a hidden class per shape; transitions occur when properties are added in different orders or deleted, degrading inline caches.',
      'Object.freeze prevents adding/changing/removing properties but is shallow — nested objects remain mutable.',
      'Factory-created closures keep captured variables alive on the heap for the object’s lifetime.',
    ],
    scalability: [
      'For large collections (10k+), prototype-shared methods drastically reduce memory versus per-instance factory methods.',
      'Hot allocation paths benefit from monomorphic shapes; construct objects with a fixed, consistent set of fields.',
    ],
    productionConcerns: [
      'Prototype pollution via deep-merge of untrusted JSON is a real CVE class; sanitize keys or use null-prototype objects/Maps.',
      'Serialization differs: class instances lose methods through JSON; null-prototype objects need care with libraries expecting Object.prototype.',
      'Immutability with freeze is shallow; for deep immutability use structuredClone + freeze recursively or a library.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Five ways: literal, Object.create, constructor+new, class, factory.',
    'Literal {} → prototype is Object.prototype.',
    'Object.create(null) → no prototype = clean map, no pollution surface.',
    'new: create obj → link prototype → bind this → run body → return obj.',
    'Class/constructor share methods on the prototype (memory-efficient).',
    'Factory returns a fresh object; closures give true private state.',
    'Factory inline methods are duplicated per object (more memory).',
    'const b = a copies the reference, not the object.',
    'Object.freeze is shallow immutability.',
    'Use Object.create(null) or Map for untrusted keys (prototype pollution).',
    'Class called without new throws; constructor function silently misbehaves.',
    'Consistent key order → shared hidden class → faster property access.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create an object `book` with title and pages, then create a copy `book2` that is independent (mutating book2 must not affect book).',
      hint: 'Use the spread operator for a shallow copy.',
      solution: {
        lang: 'js',
        code: `const book = { title: 'JS', pages: 300 }
const book2 = { ...book }
book2.pages = 500
console.log(book.pages)  // 300 (unchanged)`,
        explanation: [
          'Spread copies own enumerable properties into a new object.',
          'Because the values here are primitives, the copy is fully independent.',
          'For nested objects you would need a deep copy instead.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a factory `createStack()` returning { push, pop, size } where the underlying array is private.',
      hint: 'Keep the array in a closure variable; expose only methods.',
      solution: {
        lang: 'js',
        code: `function createStack() {
  const items = []        // private
  return {
    push(x) { items.push(x); return items.length },
    pop() { return items.pop() },
    size() { return items.length },
  }
}
const s = createStack()
s.push(1); s.push(2)
s.size()   // 2
s.pop()    // 2`,
        explanation: [
          '`items` lives only in the closure shared by the three methods.',
          'There is no `items` property on the returned object, so it is truly private.',
          'All methods operate on the same array, keeping state consistent.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make a constructor `Circle(r)` where all instances share an `area()` method (defined once, not per instance). Prove they share it.',
      hint: 'Put area on Circle.prototype, then compare with ===.',
      solution: {
        lang: 'js',
        code: `function Circle(r) { this.r = r }
Circle.prototype.area = function () {
  return Math.PI * this.r * this.r
}
const a = new Circle(1)
const b = new Circle(2)
console.log(a.area === b.area)  // true (shared on prototype)
console.log(b.area().toFixed(2)) // 12.57`,
        explanation: [
          '`area` is defined once on Circle.prototype, so every instance references the same function.',
          'The `=== true` proves it is shared, not copied per instance.',
          'This is why prototypes are memory-efficient for many objects.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `safeMap()` returning an object you can use as a key/value store with arbitrary user keys WITHOUT risking prototype pollution, exposing get/set/has.',
      hint: 'Use Object.create(null) so there is no prototype chain to pollute.',
      solution: {
        lang: 'js',
        code: `function safeMap() {
  const store = Object.create(null)   // no prototype
  return {
    set(k, v) { store[k] = v; return this },
    get(k) { return store[k] },
    has(k) { return k in store },
  }
}
const m = safeMap()
m.set('__proto__', 'evil')  // harmless: just a normal key now
console.log(m.has('__proto__')) // true
console.log(({}).polluted)      // undefined — prototype untouched`,
        explanation: [
          '`Object.create(null)` makes a prototype-less object, so writing `__proto__` is just a normal property.',
          'No inherited keys exist, so `in`/get behave predictably even for malicious keys.',
          'Object.prototype is never touched, eliminating the pollution vector. A real Map is an even cleaner choice.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Object creation is the gateway to the entire objects-and-prototypes topic. Knowing the five patterns and their trade-offs lets you answer follow-ups about prototypes, new, classes, and memory with confidence, and it directly shapes how you write models and config in real apps.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to list the ways to create objects and explain the prototype of {}. Product companies (Zoho, Flipkart, Razorpay) ask factory-vs-class trade-offs and want you to implement a stack/counter with private state. FAANG-level interviews probe hidden classes, what new does step by step, and prototype-pollution safe maps.',
    whatInterviewersExpect:
      'They expect you to name the patterns, explain how each wires the prototype, articulate the memory/privacy trade-off between classes and factories, and recall the four steps of new — ideally tying it to a real config or model object you have built.',
  },
}

export default objectCreation
