import type { ConceptLesson } from '../../../types/lesson'

const inheritancePatterns: ConceptLesson = {
  // 1. Concept Summary
  slug: 'inheritance-patterns',
  name: 'Inheritance & Composition',
  category: 'objects-prototypes',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Choosing how objects share behavior — classical inheritance vs composition vs mixins — shapes how maintainable and flexible your whole codebase is.',
    'Deep inheritance hierarchies are a famous source of rigidity ("the fragile base class", "gorilla/banana problem"); senior engineers are expected to know when to prefer composition.',
    'JavaScript offers many patterns (prototypal delegation, class extends, mixins, object composition, functional composition) — interviewers test whether you can pick the right one and explain trade-offs.',
    'React’s shift from mixins/HOCs to hooks and the general "composition over inheritance" guidance come up constantly in design discussions.',
    'Getting inheritance wiring wrong (super not called, broken constructor, diamond problems) causes real, hard-to-debug failures.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Inheritance is "I am a special kind of you"; composition is "I have a few helper friends I bring along".',
    story: [
      'Imagine a basic robot that can roll around. A "cleaning robot" is a special kind of robot — it IS a robot, plus it can vacuum. That "is a special kind of" relationship is inheritance.',
      'Now imagine instead you build a robot by snapping on parts: a wheels part, a vacuum part, a camera part. The robot HAS these parts, and you can mix and match them.',
      'If you want a flying cleaning robot, with snap-on parts you just add a "wings" part. With the "special kind of" tree, you might have to redraw the whole family tree to fit it in.',
      'Both let robots share abilities, but snapping parts together (composition) usually bends more easily when you need something new, while the family tree (inheritance) is neat when things really are kinds of each other.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Inheritance means one type is built on top of another and automatically gets its abilities, then adds or changes some — like a subclass extending a parent.',
    'Composition means you build an object by combining smaller pieces of behavior together, rather than inheriting from a big parent.',
    'In JavaScript, inheritance works through the prototype chain (or class extends), while composition usually means putting helper objects/functions inside, or copying methods in (mixins).',
    'A common rule of thumb is "prefer composition over inheritance" because composition stays flexible while deep inheritance trees get rigid and hard to change.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Inheritance and composition are two ways to reuse behavior. Inheritance models "is-a" via the prototype chain (class B extends A). Composition models "has-a"/"can-do" by combining smaller objects/functions or mixing methods into an object.',
    how: 'Inheritance: use `extends`/`super` or link prototypes. Composition: store collaborators as fields and delegate, or use mixins (Object.assign methods onto a prototype) or functional composition (build behavior from small functions).',
    why: 'Inheritance is concise for genuine is-a hierarchies, but composition avoids tight coupling and the fragile base class problem, making behavior easy to mix, swap, and test.',
    code: {
      label: 'Inheritance vs composition for the same feature',
      lang: 'js',
      code: `// Inheritance: Dog IS-A Animal
class Animal { move() { return 'moves' } }
class Dog extends Animal { bark() { return 'woof' } }

// Composition: Robot HAS capabilities mixed in
const canRoll = (o) => ({ roll: () => o.name + ' rolls' })
const canClean = (o) => ({ clean: () => o.name + ' cleans' })
function createRobot(name) {
  const self = { name }
  return Object.assign(self, canRoll(self), canClean(self))
}
const r = createRobot('R2')
console.log(r.roll(), r.clean())  // 'R2 rolls' 'R2 cleans'`,
      explanation: [
        'Dog extends Animal — a classic is-a relationship via the prototype chain.',
        'The robot is built by composing small capability factories.',
        'Object.assign mixes the chosen abilities onto one object.',
        'Want a flying robot? Add a canFly capability — no hierarchy to rework.',
        'This contrast is the heart of "composition over inheritance".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Inheritance in JavaScript is realized through prototypal delegation: an object (or a class via `extends`) links to a parent prototype so unresolved lookups delegate upward, modeling an is-a relationship and enabling method overriding and `super`. Composition assembles behavior from independent units — by holding collaborator objects and delegating to them (has-a), by copying methods onto a target (mixins via Object.assign / class factories), or by combining small functions (functional composition). The widely cited design guidance "favor composition over inheritance" stems from inheritance’s tight coupling, fragile base classes, and difficulty expressing cross-cutting or multiple capabilities, which composition handles more flexibly at the cost of more explicit wiring.',

  // 7. Internal Working
  internalWorking: [
    'Class inheritance sets the child prototype’s [[Prototype]] to the parent prototype (instance method delegation) and the child constructor’s [[Prototype]] to the parent constructor (static inheritance).',
    'A derived constructor must call super() to run the parent constructor and obtain an initialized `this`; until then `this` is in a TDZ.',
    'Method resolution walks the prototype chain: an overridden method on the child prototype shadows the parent’s; super.method() bypasses the child and resolves on the parent prototype.',
    'Mixins copy own enumerable methods from a source onto a target object or prototype (Object.assign), or a class-factory mixin returns `class extends Base {}` to layer behavior into the chain.',
    'Object composition stores collaborators as fields; the composing object forwards calls (delegation) rather than inheriting, so there is no prototype linkage between them.',
    'Functional composition chains pure functions (compose/pipe) so each transforms the previous output, building complex behavior without object hierarchies.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  INHERITANCE (is-a)               COMPOSITION (has-a / can-do)
  Animal.prototype { move }        robot { name }
        ▲ [[Proto]]                  ├── roll()   (mixed in)
  Dog.prototype { bark }             ├── clean()  (mixed in)
        ▲ [[Proto]]                  └── fly()    (add freely)
  dog { } → move + bark            assemble from small parts

  MIXIN:  Object.assign(target.prototype, A, B)   // copy methods in
  FUNC:   pipe(parse, validate, save)(input)       // chain functions`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Inheritance: prototypes are linked by reference into a chain; no methods are copied, so memory stays flat regardless of depth.',
    'Mixins: methods are COPIED onto the target prototype, so duplicating the same mixin across many classes duplicates method references (still one function object if the same source).',
    'Object composition: each composed object holds references to its collaborators on the heap; behavior is reached by delegation, not by chain walking.',
    'Functional composition: composed functions are closures referencing the smaller functions; intermediate results are short-lived heap allocations.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — class inheritance with override and super',
      lang: 'js',
      code: `class Shape {
  constructor(name) { this.name = name }
  area() { return 0 }
  toString() { return this.name + ': ' + this.area() }
}
class Circle extends Shape {
  constructor(r) { super('circle'); this.r = r }
  area() { return Math.PI * this.r ** 2 }   // override
}
console.log(new Circle(2).toString())  // 'circle: 12.566...'`,
      explanation: [
        'Circle is-a Shape, inheriting toString from the parent.',
        'super(\'circle\') runs the parent constructor first.',
        'Circle overrides area; the inherited toString calls the overridden area.',
        'This is textbook single inheritance with overriding.',
      ],
    },
    intermediate: {
      label: 'Intermediate — mixins via class factories',
      lang: 'js',
      code: `const Serializable = (Base) => class extends Base {
  toJSON() { return JSON.stringify({ ...this }) }
}
const Timestamped = (Base) => class extends Base {
  touch() { this.updatedAt = Date.now(); return this }
}
class Model {}
class User extends Serializable(Timestamped(Model)) {
  constructor(name) { super(); this.name = name }
}
const u = new User('Sam').touch()
console.log(typeof u.toJSON, typeof u.touch) // 'function' 'function'`,
      explanation: [
        'Each mixin is a function taking a Base class and returning an extended class.',
        'Composing them layers behavior into the prototype chain.',
        'User gains both toJSON (Serializable) and touch (Timestamped).',
        'This sidesteps single-inheritance limits without copying methods manually.',
      ],
    },
    advanced: {
      label: 'Advanced — composition (has-a) over inheritance',
      lang: 'js',
      code: `// Instead of: class Duck extends Animal, FlyingThing, SwimmingThing (impossible)
const flyer = () => ({ fly: () => 'flap flap' })
const swimmer = () => ({ swim: () => 'paddle' })
const quacker = () => ({ quack: () => 'quack' })

function createDuck(name) {
  return Object.assign({ name }, flyer(), swimmer(), quacker())
}
const d = createDuck('Donald')
console.log(d.fly(), d.swim(), d.quack()) // 'flap flap' 'paddle' 'quack'

// A penguin? compose only what fits — no fly()
const createPenguin = (name) => Object.assign({ name }, swimmer(), quacker())`,
      explanation: [
        'A duck needs multiple unrelated capabilities — impossible with single inheritance.',
        'Composition snaps independent capabilities together with Object.assign.',
        'A penguin reuses swim/quack but omits fly — no awkward hierarchy or empty overrides.',
        'This solves the multiple-behavior problem cleanly and is highly testable.',
      ],
    },
    realProject: {
      label: 'Real project — React hooks & Node service composition',
      lang: 'js',
      code: `// React moved from mixins/HOCs (inheritance-ish) to hooks (composition):
// function useUser(id) { const data = useFetch('/u/' + id); return data }
// function Profile({ id }) { const u = useUser(id); return null }
// Compose behavior by calling hooks, not by extending a base component.

// Node: compose a service from collaborators (dependency injection)
function createOrderService({ repo, payments, mailer }) {
  return {
    async place(order) {
      await payments.charge(order)
      const saved = await repo.save(order)
      await mailer.confirm(saved)
      return saved
    },
  }
}`,
      explanation: [
        'React hooks are composition: a component composes behavior by calling hooks instead of inheriting from a base.',
        'The Node service HAS collaborators (repo/payments/mailer) injected, delegating to them.',
        'Swapping a mock mailer in tests is trivial — no class hierarchy to fake.',
        'This injected-composition style dominates modern backend and frontend design.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between inheritance and composition?',
      answer: 'Inheritance is an is-a relationship where a child gets a parent’s behavior via the prototype chain. Composition is a has-a/can-do relationship where you build behavior by combining smaller objects or functions.',
      explanation: 'The is-a vs has-a framing is the expected baseline.',
    },
    {
      level: 'beginner',
      question: 'How does inheritance work in JavaScript under the hood?',
      answer: 'Through prototypal delegation: a child prototype links to a parent prototype, so unresolved lookups delegate up the chain. Classes use extends/super as sugar over this.',
      explanation: 'Connecting inheritance to the prototype chain shows you know the mechanism, not just syntax.',
    },
    {
      level: 'intermediate',
      question: 'Why do people say "favor composition over inheritance"?',
      answer: 'Deep inheritance creates tight coupling and the fragile base class problem — changing a base breaks subclasses, and you can’t mix multiple unrelated behaviors with single inheritance. Composition keeps units independent, mixable, and testable.',
      explanation: 'Mentioning fragile base class and single-inheritance limits demonstrates real design understanding.',
    },
    {
      level: 'intermediate',
      question: 'What is a mixin and how do you implement one in JavaScript?',
      answer: 'A mixin is reusable behavior added to a class/object without classical inheritance. Implement it by copying methods with Object.assign onto a prototype, or with a class factory: const Mixin = (Base) => class extends Base { ...methods }.',
      explanation: 'Knowing both Object.assign and class-factory mixins covers the practical answers.',
    },
    {
      level: 'advanced',
      question: 'What problems arise with deep inheritance hierarchies, and how does composition help?',
      answer: 'Fragile base class (base changes ripple to subclasses), the gorilla/banana problem (you inherit more than you wanted), rigid taxonomies that don’t fit new requirements, and inability to combine multiple behaviors. Composition decouples behaviors into swappable units that you assemble per need.',
      explanation: 'Naming the classic problems by name signals senior-level design literacy.',
    },
    {
      level: 'senior',
      question: 'How did React’s evolution illustrate composition over inheritance?',
      answer: 'React discouraged component inheritance, moved from mixins (deprecated due to name clashes and implicit dependencies) to higher-order components, and finally to hooks — pure composition where a component combines behavior by calling functions rather than extending a base class.',
      explanation: 'A concrete industry example with the mixin→HOC→hooks arc shows applied design judgment.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you implement multiple inheritance / multiple behaviors in JS?',
    'What is the diamond problem and does JavaScript suffer from it?',
    'When is classical inheritance actually the right choice?',
    'How do class-factory mixins differ from Object.assign mixins?',
    'What is functional composition (compose/pipe) and how does it relate?',
    'Why were React mixins deprecated?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Reaching for deep inheritance to share a little behavior.',
      why: 'It couples unrelated classes to a base and creates fragile, hard-to-change hierarchies.',
      fix: 'Extract the behavior into a mixin or a composed collaborator; inherit only for genuine is-a relationships.',
    },
    {
      mistake: 'Mixins that silently overwrite each other’s methods.',
      why: 'Object.assign copies in order, so two mixins with the same method name clash without warning (a reason React deprecated mixins).',
      fix: 'Namespace methods, detect collisions, or use class-factory mixins with explicit super calls.',
    },
    {
      mistake: 'Forgetting super() in a derived constructor before using this.',
      why: 'this is uninitialized until super() runs in a derived class, causing a ReferenceError.',
      fix: 'Always call super(...) first in the subclass constructor.',
    },
    {
      mistake: 'Overriding a method without calling super.method() when the parent behavior is still needed.',
      why: 'You lose the base behavior and may break invariants the parent maintained.',
      fix: 'Call super.method() within the override to extend rather than fully replace the parent.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Composition is the official guidance: hooks and component composition replaced mixins/inheritance; HOCs and render props were earlier composition tools.' },
    { area: 'Vue', detail: 'Composition API (composables) favors composing reactive behavior via functions; mixins exist but are discouraged for the same collision/implicitness reasons.' },
    { area: 'Node.js', detail: 'Inheritance for genuine is-a (EventEmitter, Error subclasses); composition/DI for services that combine repositories, clients, and loggers.' },
    { area: 'Backend', detail: 'Domain models use shallow inheritance plus composition; cross-cutting concerns (logging, retries) are composed as wrappers/decorators rather than inherited.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Prototype-based inheritance shares methods without copying, keeping memory flat across many instances.',
      'Composition with delegation avoids deep chain walks, so property/method lookups stay shallow.',
    ],
    bad: [
      'Deep inheritance chains add prototype-lookup hops for inherited members.',
      'Object.assign mixins copy methods per target prototype, and per-instance composed closures add allocations.',
    ],
    optimizations: [
      'Keep inheritance shallow; reserve it for true is-a relationships.',
      'Mix behavior into prototypes (shared) rather than per-instance when possible.',
      'Prefer delegation to small, stable collaborator objects over building deep chains.',
      'For functional composition in hot paths, avoid recreating composed pipelines per call — build them once.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es6-classes', 'prototype-chain', 'prototype'],
    nextConcepts: ['function-composition', 'factory-pattern', 'strategy-pattern', 'object-creation'],
    dependencyNote:
      'Inheritance patterns build on classes and the prototype chain; the composition side connects to function-composition and to the factory and strategy design patterns, which are composition-first alternatives to inheritance.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an inheritance tree (Animal → Dog → Puppy) and label it "is-a".',
      'Beside it, draw an object with snap-on capability boxes (roll, clean, fly) and label it "has-a / can-do".',
      'Show the problem: a duck needs fly + swim + quack — single inheritance can’t express it; composition just snaps them on.',
      'Note mixin (copy methods in) and functional pipe (chain functions) as composition tools.',
      'Say: "Use inheritance for true is-a; otherwise favor composition because it stays flexible and avoids fragile base classes."',
    ],
    diagram: `  IS-A (inheritance)        HAS-A / CAN-DO (composition)
  Animal                    duck ── fly()
   └─ Dog                        ── swim()
       └─ Puppy                  ── quack()
  rigid tree                 snap-on capabilities (mix freely)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Inheritance is an is-a relationship via the prototype chain (class extends, super), great for genuine taxonomies but prone to tight coupling and the fragile base class problem. Composition is has-a/can-do: build behavior by combining small objects (delegation), copying methods (mixins via Object.assign or class factories), or chaining functions (compose/pipe). Favor composition over inheritance because it stays flexible, mixable, and testable — React’s move from mixins to HOCs to hooks is the canonical example. Use inheritance only for real is-a, and call super correctly.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'There are two fundamental ways to reuse behavior. Inheritance models an is-a relationship: in JavaScript that’s prototypal delegation, where a child prototype links to a parent prototype so lookups delegate upward, and classes give us extends and super as sugar over that. It’s concise when something genuinely is a kind of something else, and overriding plus super lets you extend parent behavior. The problem is that deep inheritance couples everything to a base class — the fragile base class problem, where changing the parent ripples into subclasses — and single inheritance can’t express objects that need several unrelated behaviors, like a duck that flies, swims, and quacks. Composition solves that. Composition is has-a or can-do: I build an object by combining smaller pieces — holding collaborator objects and delegating to them, copying behavior in with mixins via Object.assign or class factories, or chaining small functions with compose/pipe. Composition keeps each unit independent, swappable, and easy to test, which is why the industry guidance is favor composition over inheritance. React is the perfect illustration: it discouraged component inheritance, used mixins, deprecated them because of name clashes and implicit dependencies, moved to higher-order components, and finally to hooks, which are pure composition. My rule is: inheritance only for true is-a relationships and shallow trees; everything else, compose — and always call super before using this in a derived constructor.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Inheritance is concise and gives instanceof/polymorphism but tightly couples subclasses to the base; composition is more verbose to wire but decoupled and flexible.',
      'Mixins enable multiple behaviors but risk silent method collisions; class-factory mixins restore super chaining at the cost of complexity.',
    ],
    edgeCases: [
      'JavaScript has no true multiple inheritance; mixins/composition simulate it, and method-name collisions must be managed.',
      'super in mixins requires class-factory style to chain correctly; Object.assign mixins lose super semantics.',
      'Subclassing built-ins (Array/Error) needs proper super handling and breaks under naive transpilation.',
      'Diamond-shaped mixin composition can re-apply a base layer; design mixins to be idempotent or linear.',
    ],
    runtimeBehavior: [
      'Inherited method resolution walks the chain; overrides shadow parents and super bypasses the child level.',
      'Object.assign mixins copy own enumerable methods at definition time; later source changes are not reflected.',
      'Composed delegation calls add a function-call indirection but avoid chain depth.',
    ],
    scalability: [
      'Large systems degrade with deep inheritance (rigid taxonomies); composition scales by adding independent capabilities.',
      'Cross-cutting concerns (logging, caching, retries) compose well as decorators/wrappers rather than inheritance layers.',
    ],
    productionConcerns: [
      'Refactoring deep hierarchies is expensive and risky; teams often migrate toward composition incrementally.',
      'Mixin collisions cause subtle behavior bugs — the documented reason React abandoned mixins.',
      'Inheritance across module/realm boundaries complicates instanceof and serialization; prefer composition for plugin systems.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Inheritance = is-a (prototype chain / class extends).',
    'Composition = has-a / can-do (combine small parts).',
    'Favor composition over inheritance (flexibility, testability).',
    'super() before this in a derived constructor.',
    'Override + super.method() to extend, not replace.',
    'Mixin = add behavior without classical inheritance.',
    'Object.assign mixin copies methods (no super); class-factory mixin keeps super.',
    'No true multiple inheritance → use mixins/composition.',
    'Fragile base class: base change breaks subclasses.',
    'React: mixins → HOCs → hooks (composition wins).',
    'Functional composition: pipe/compose small functions.',
    'Use inheritance only for genuine is-a + shallow trees.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create Employee extends Person where Person has name and Employee adds salary, reusing the parent constructor.',
      hint: 'Use extends and super(name).',
      solution: {
        lang: 'js',
        code: `class Person { constructor(name) { this.name = name } }
class Employee extends Person {
  constructor(name, salary) { super(name); this.salary = salary }
}
const e = new Employee('Sam', 100)
console.log(e.name, e.salary, e instanceof Person) // Sam 100 true`,
        explanation: [
          'super(name) reuses Person’s constructor to set name.',
          'Employee adds its own salary field.',
          'instanceof Person holds via the prototype chain.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a `withLogging` mixin (Object.assign style) that adds a log() method to any object, then apply it to a plain object.',
      hint: 'Return an object of methods and Object.assign it onto the target.',
      solution: {
        lang: 'js',
        code: `const withLogging = (target) => Object.assign(target, {
  log(msg) { return '[' + (target.name || 'obj') + '] ' + msg },
})
const service = withLogging({ name: 'auth' })
console.log(service.log('started'))  // '[auth] started'`,
        explanation: [
          'The mixin copies a log method onto the target via Object.assign.',
          'It reads target.name to contextualize the message.',
          'Any object can gain logging without inheritance.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Refactor a rigid inheritance need (a Robot that can fly, clean, and recharge) into composition so a CleaningDrone can be assembled from only the parts it needs.',
      hint: 'Make capability factories and Object.assign the chosen ones.',
      solution: {
        lang: 'js',
        code: `const canFly = (s) => ({ fly: () => s.name + ' flies' })
const canClean = (s) => ({ clean: () => s.name + ' cleans' })
const canRecharge = (s) => ({ recharge: () => s.name + ' recharges' })

function assemble(name, ...capabilities) {
  const self = { name }
  return capabilities.reduce((o, cap) => Object.assign(o, cap(self)), self)
}
const drone = assemble('Drone', canFly, canClean, canRecharge)
console.log(drone.fly(), drone.clean()) // 'Drone flies' 'Drone cleans'
const vacuum = assemble('Roomba', canClean, canRecharge) // no fly`,
        explanation: [
          'Each capability is an independent factory taking the object and returning methods.',
          'assemble composes only the chosen capabilities via reduce + Object.assign.',
          'Different machines pick different parts — no hierarchy, no empty overrides.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a class-factory mixin pattern: Serializable and Comparable mixins that both work via super-capable extends, applied to a Model class.',
      hint: 'Each mixin is (Base) => class extends Base { ... }.',
      solution: {
        lang: 'js',
        code: `const Serializable = (Base) => class extends Base {
  serialize() { return JSON.stringify({ ...this }) }
}
const Comparable = (Base) => class extends Base {
  equals(other) { return this.serialize?.() === other.serialize?.() }
}
class Model {}
class Item extends Comparable(Serializable(Model)) {
  constructor(id) { super(); this.id = id }
}
const a = new Item(1), b = new Item(1), c = new Item(2)
console.log(a.equals(b), a.equals(c)) // true false`,
        explanation: [
          'Each mixin returns a class extending its Base, so they layer into the prototype chain.',
          'Composing Comparable(Serializable(Model)) stacks both behaviors with working super.',
          'Item gains serialize and equals without single-inheritance limits or method copying.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'How you share behavior is a core design decision interviewers use to gauge seniority. Knowing inheritance’s mechanics AND when to prefer composition — with concrete examples like React hooks — marks you as someone who designs maintainable systems, not just working code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the difference between inheritance and composition and basic class extends. Product companies (Zoho, Flipkart, Razorpay) ask you to implement mixins and justify composition over inheritance. FAANG-level interviews probe fragile base classes, the diamond/collision problems, class-factory mixins with super, and the React mixin→hooks evolution.',
    whatInterviewersExpect:
      'They expect the is-a vs has-a distinction, the mechanics of prototypal/class inheritance and super, fluent use of mixins and composition, and a reasoned answer for why composition is usually preferred — backed by a real example.',
  },
}

export default inheritancePatterns
