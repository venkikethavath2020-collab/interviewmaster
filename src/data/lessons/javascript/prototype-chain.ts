import type { ConceptLesson } from '../../../types/lesson'

const prototypeChain: ConceptLesson = {
  // 1. Concept Summary
  slug: 'prototype-chain',
  name: 'Prototype Chain',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The prototype chain is the actual mechanism JavaScript uses to resolve every property and method — understanding it explains where map, toString, and hasOwnProperty come from.',
    'It is the foundation of inheritance: subclasses, instanceof, and method overriding all work by walking the chain.',
    'Knowing the chain ends at null lets you reason about Object.create(null) maps, undefined lookups, and why some objects lack toString.',
    'Bugs around shadowing, instanceof across realms, and prototype pollution all stem from misunderstanding the chain.',
    'Interviewers use chain-walking diagrams to test whether you can trace a property lookup step by step — a core JS competency.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The prototype chain is asking people in a line one after another until someone knows the answer.',
    story: [
      'Imagine you have a question and you ask your friend. If your friend does not know, they ask their older sister.',
      'If the older sister does not know, she asks Grandma, and if Grandma does not know either, she asks the wise village elder at the end of the line.',
      'You keep passing the question up the line until someone answers it — or until you reach the very end and there is nobody left, so the answer is "I don’t know" (undefined).',
      'In JavaScript, when an object is asked for something it does not have, it passes the question up its chain of prototypes, one link at a time, until it finds the answer or reaches the end of the line.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every object links to a prototype, and that prototype links to its own prototype, forming a chain.',
    'When you ask for a property, JavaScript checks the object, then its prototype, then that prototype’s prototype, and so on.',
    'The search stops the moment it finds the property; if it reaches the end of the chain (null) without finding it, the result is undefined.',
    'The chain is why a plain object can call toString even though you never defined it — that method lives near the end of the chain on Object.prototype.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The prototype chain is the linked series of prototype objects that the engine searches, link by link, to resolve a property or method, ending at Object.prototype and then null.',
    how: 'A lookup checks own properties first, then follows [[Prototype]] to the next object, repeating until found or until [[Prototype]] is null (then undefined). instanceof works by checking whether a constructor’s prototype appears anywhere in the chain.',
    why: 'It is how delegation and inheritance work; a short, stable chain means fast lookups and predictable inheritance.',
    code: {
      label: 'Walking the chain',
      lang: 'js',
      code: `const arr = [1, 2, 3]
// arr -> Array.prototype -> Object.prototype -> null
console.log(arr.hasOwnProperty('length'))            // true (own)
console.log(typeof arr.map)                           // 'function' (Array.prototype)
console.log(typeof arr.toString)                      // 'function' (Object.prototype)
console.log(Object.getPrototypeOf(arr) === Array.prototype) // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype) // true
console.log(Object.getPrototypeOf(Object.prototype)) // null (end)`,
      explanation: [
        '`length` is an own property of the array.',
        '`map` is not own — it is found one link up on Array.prototype.',
        '`toString` is found two links up on Object.prototype.',
        'Each Object.getPrototypeOf step reveals the next link.',
        'The chain ends when getPrototypeOf returns null.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The prototype chain is the ordered sequence of objects connected through the internal [[Prototype]] slot, terminating at null. Property access performs an ordered lookup: it checks an object’s own properties, then delegates to its prototype, and so on up the chain, returning the first match or undefined if the chain is exhausted. This delegation implements inheritance — instances inherit from their constructor’s prototype, which may itself inherit from a parent prototype, up to Object.prototype. instanceof is defined in terms of whether a constructor’s prototype object is present anywhere in the operand’s chain. The chain is also the lookup path that engines optimize with inline caches.',

  // 7. Internal Working
  internalWorking: [
    'On a property GET, the engine reads the object’s own property table; if the key is present it returns immediately.',
    'If absent, it reads the object’s [[Prototype]] and repeats the own-property check on that object — one hop up the chain.',
    'This continues until the property is found or [[Prototype]] is null, in which case the access yields undefined.',
    'If a found property is an accessor (getter), the engine invokes it with `this` bound to the original receiver (not the prototype that holds it).',
    'instanceof walks the chain of the left operand, comparing each [[Prototype]] against the right operand’s .prototype; true if any match, false at null.',
    'Engines cache the resolution path (which object in the chain holds a key) via inline caches; changing a prototype or shape invalidates these caches.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  instance (new Dog)        Dog.prototype        Object.prototype     null
  ┌──────────────┐ [[Proto]]┌──────────────┐[[Proto]]┌────────────┐[[Proto]]
  │ name: 'Rex'  │────────► │ bark()       │───────► │ toString() │──────► ⌀
  └──────────────┘          │ constructor  │         │ hasOwnP... │
                            └──────────────┘         └────────────┘
   lookup d.toString:
   own? no → Dog.prototype? no → Object.prototype? YES → return
   lookup d.fly:
   own? no → ... → Object.prototype? no → null → undefined`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each link in the chain is a separate heap object; instances merely hold a [[Prototype]] reference to the next one — no copying.',
    'Shared methods (map, toString) exist once on their prototype objects and are reused by every object whose chain passes through them.',
    'A lookup walks references hop by hop on the heap; deeper chains mean more hops for missing keys.',
    'Object.create(null) produces an object with an empty chain (no Object.prototype), so it has no inherited toString/hasOwnProperty.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — found vs not found',
      lang: 'js',
      code: `const obj = { a: 1 }
console.log(obj.a)        // 1   (own)
console.log(obj.toString) // function (Object.prototype)
console.log(obj.missing)  // undefined (end of chain)
// chain: obj -> Object.prototype -> null`,
      explanation: [
        '`a` is found immediately as an own property.',
        '`toString` is found by walking up to Object.prototype.',
        '`missing` is not found anywhere, so the chain returns undefined.',
        'This is the entire lookup algorithm in three lines.',
      ],
    },
    intermediate: {
      label: 'Intermediate — inheritance chain with overriding',
      lang: 'js',
      code: `function Animal() {}
Animal.prototype.speak = function () { return 'generic sound' }

function Dog() {}
Dog.prototype = Object.create(Animal.prototype) // link the chain
Dog.prototype.constructor = Dog
Dog.prototype.speak = function () { return 'woof' } // override

const d = new Dog()
console.log(d.speak())                 // 'woof' (own prototype wins)
console.log(d instanceof Dog)          // true
console.log(d instanceof Animal)       // true (Animal.prototype in chain)`,
      explanation: [
        'Dog.prototype is linked to Animal.prototype, building a two-level chain.',
        'Dog’s own speak shadows Animal’s because it is found first.',
        'instanceof Animal is true because Animal.prototype appears in d’s chain.',
        'Resetting constructor keeps it pointing at Dog after replacing the prototype.',
      ],
    },
    advanced: {
      label: 'Advanced — how instanceof walks the chain',
      lang: 'js',
      code: `function isInstanceOf(obj, Ctor) {
  let proto = Object.getPrototypeOf(obj)
  while (proto) {
    if (proto === Ctor.prototype) return true
    proto = Object.getPrototypeOf(proto)  // hop up the chain
  }
  return false
}
class A {} ; class B extends A {}
const b = new B()
console.log(isInstanceOf(b, B)) // true
console.log(isInstanceOf(b, A)) // true
console.log(isInstanceOf(b, Array)) // false`,
      explanation: [
        'We start at the object’s prototype and walk upward.',
        'At each link we check if it equals the constructor’s .prototype.',
        'If we reach null without a match, the object is not an instance.',
        'This is exactly what the native instanceof operator does.',
      ],
    },
    realProject: {
      label: 'Real project — Node EventEmitter inheritance & Object.create(null) maps',
      lang: 'js',
      code: `const EventEmitter = require('events')
class Bus extends EventEmitter {}  // Bus.prototype chain → EventEmitter.prototype
const bus = new Bus()
bus.on('ping', () => {})           // 'on' found on EventEmitter.prototype
console.log(bus instanceof EventEmitter) // true

// Safe lookup map with NO chain (no inherited keys, no pollution):
const cache = Object.create(null)
cache['toString'] = 'a value'      // not shadowing any inherited method
console.log(cache.toString)        // 'a value' (no Object.prototype above)`,
      explanation: [
        '`extends` wires Bus.prototype’s chain to EventEmitter.prototype, so on/emit are inherited.',
        'bus.on resolves by walking up to EventEmitter.prototype.',
        'instanceof EventEmitter is true because it is in the chain.',
        'Object.create(null) has an empty chain, so keys like toString do not collide with inherited methods — ideal for untrusted maps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the prototype chain?',
      answer: 'The linked series of prototype objects the engine searches to resolve a property: object → its prototype → that prototype’s prototype → ... → Object.prototype → null.',
      explanation: 'A good answer mentions the ordered lookup and that it ends at null with undefined.',
    },
    {
      level: 'beginner',
      question: 'Why can a plain object call toString even though you never defined it?',
      answer: 'Because toString lives on Object.prototype, which is at the top of the object’s chain; the lookup walks up and finds it there.',
      explanation: 'Connecting a builtin method to its position in the chain shows you understand delegation.',
    },
    {
      level: 'intermediate',
      question: 'What does a property lookup return when nothing in the chain has the key?',
      answer: 'undefined. The engine walks every link; when [[Prototype]] becomes null and the key was never found, the access yields undefined (it does not throw).',
      explanation: 'Knowing it returns undefined, not an error, is a precise detail interviewers check.',
    },
    {
      level: 'intermediate',
      question: 'How does instanceof use the prototype chain?',
      answer: 'It walks the left operand’s chain checking whether the right operand’s .prototype appears anywhere; true if found, false at null. So `b instanceof A` is true if A.prototype is in b’s chain.',
      explanation: 'Describing the walk (not just "checks the type") is the expected depth.',
    },
    {
      level: 'advanced',
      question: 'What is property shadowing in the context of the chain?',
      answer: 'When an own property (or a closer prototype) has the same key as one higher in the chain, the closer one is found first and "shadows" the further one. Writing a property always creates it on the instance, shadowing any inherited value.',
      explanation: 'Strong answers note that lookup stops at the first match and that writes create own properties.',
    },
    {
      level: 'senior',
      question: 'Why can instanceof fail across iframes/realms, and how do you avoid it?',
      answer: 'Each realm has its own Object/Array/etc. with distinct .prototype objects, so an array from another iframe is not in the chain of THIS realm’s Array, making instanceof Array false. Use Array.isArray or structural/duck checks instead.',
      explanation: 'Senior signal: understanding realms, distinct intrinsics, and the chain-based definition of instanceof.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you set up a multi-level inheritance chain with constructor functions?',
    'What is at the very top of the chain, and what is its prototype? (Object.prototype → null)',
    'How is the chain different for Object.create(null)?',
    'How do classes build the chain with extends and super?',
    'Why is a long prototype chain potentially slow?',
    'How does the chain enable prototype pollution attacks?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to reset prototype.constructor after replacing a prototype object.',
      why: 'Object.create(Parent.prototype) leaves constructor pointing at Parent, breaking code that relies on instance.constructor.',
      fix: 'Set Child.prototype.constructor = Child after wiring the chain.',
    },
    {
      mistake: 'Assuming a missing property throws.',
      why: 'Chain lookups return undefined when nothing matches, not an error — so typos silently yield undefined.',
      fix: 'Validate/guard expected properties, and use TypeScript or `in` checks to catch missing keys.',
    },
    {
      mistake: 'Relying on instanceof across iframes or realms.',
      why: 'Different realms have different prototype objects, so the chain check fails for cross-realm values.',
      fix: 'Use Array.isArray, typeof, or structural checks instead of instanceof for cross-realm data.',
    },
    {
      mistake: 'Building very deep chains for code reuse.',
      why: 'Deep chains slow missing-property lookups and make behavior hard to trace.',
      fix: 'Prefer composition or flatter hierarchies; keep chains short.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Component instances inherit through a prototype chain to shared option/helper objects; understanding the chain explains where $emit/$slots resolve.' },
    { area: 'React', detail: 'Class components form a chain to React.Component to Object; instanceof and inherited lifecycle methods resolve via the chain.' },
    { area: 'Node.js', detail: 'EventEmitter/Stream subclasses build chains so on/emit/pipe are inherited; Object.create(null) is used for safe header/param maps.' },
    { area: 'Backend', detail: 'Domain entity hierarchies (BaseModel → User) share serialization/query methods through the chain, avoiding duplication.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Short, stable chains let engines inline-cache lookups for fast repeated property access.',
      'Sharing methods up the chain keeps per-object memory minimal across large collections.',
    ],
    bad: [
      'Deep chains add hops for missing-property lookups (and for any property near the top).',
      'Mutating prototypes within the chain at runtime invalidates inline caches and forces deopts.',
    ],
    optimizations: [
      'Keep inheritance chains shallow; prefer composition for reuse where possible.',
      'Set up the chain once at definition time, never reassign prototypes later.',
      'Use hasOwnProperty / own-key iteration when you specifically want to skip inherited members.',
      'For untrusted/large key maps, use Object.create(null) or Map to avoid chain lookups entirely.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Prototype pollution targets the chain: writing to __proto__ or constructor.prototype injects properties onto Object.prototype, affecting every object whose chain passes through it.',
      'Polluted prototypes can cause auth bypasses, denial of service, or code execution in vulnerable libraries.',
    ],
    bestPractices: [
      'Use Object.create(null) or Map for maps keyed by untrusted input so there is no Object.prototype in the chain to pollute.',
      'Sanitize __proto__/constructor/prototype keys when merging untrusted data and freeze critical prototypes.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['prototype', 'object-creation', 'constructor-functions-new'],
    nextConcepts: ['es6-classes', 'inheritance-patterns', 'typeof-instanceof', 'prototype-pollution'],
    dependencyNote:
      'The prototype chain builds directly on prototype and object creation, and it is the mechanism behind classes, inheritance patterns, and instanceof — as well as the surface for prototype-pollution attacks.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three boxes left to right: instance, Constructor.prototype, Object.prototype, then write null after.',
      'Connect them with [[Prototype]] arrows pointing right (toward null).',
      'Pick a property and trace it: check the instance, then hop right, then hop right, mark where it is found.',
      'Pick a missing property and walk all the way to null, ending in undefined.',
      'Say: "Lookups walk the chain link by link, stop at the first match, and return undefined if they reach null."',
    ],
    diagram: `  instance ─►[[Proto]]─► Ctor.prototype ─►[[Proto]]─► Object.prototype ─► null
     own?               own?                    own?                 (miss)
      └── found → return at first match; reach null → undefined`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The prototype chain is the linked list of prototype objects the engine searches to resolve a property: own → prototype → prototype’s prototype → ... → Object.prototype → null. Lookups stop at the first match; if they reach null, the result is undefined (no error). It is how inheritance works — instanceof checks whether a constructor’s prototype appears in the chain, and overriding works by shadowing closer in the chain. Keep chains short for speed; Object.create(null) gives an empty chain (safe maps); deep-merge of untrusted data into the chain causes prototype pollution.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The prototype chain is the series of objects JavaScript walks to resolve a property. When I access obj.x, the engine first checks obj’s own properties; if it’s not there, it follows the internal [[Prototype]] link to the next object and checks again, repeating link by link until it either finds the key or reaches null — at which point the access just returns undefined rather than throwing. For an array, that chain is the array → Array.prototype → Object.prototype → null, which is exactly why arr.map comes from Array.prototype and arr.toString comes from Object.prototype. This chain is JavaScript’s inheritance: a subclass’s prototype links to its parent’s prototype, so instances inherit methods all the way up, and instanceof is literally defined as "does this constructor’s prototype appear anywhere in the operand’s chain?" Overriding is just shadowing — a method found closer in the chain wins, and any write creates an own property that shadows inherited ones. A few important nuances: lookups stop at the first match, so deep chains cost more for misses; instanceof breaks across iframes because each realm has its own Array with its own prototype, so I use Array.isArray instead; and the chain is the attack surface for prototype pollution, where writing to __proto__ poisons Object.prototype for every object, which is why I use Object.create(null) or Map for untrusted key maps.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Delegation up a chain saves memory and enables dynamic behavior but makes the source of a property less obvious than a flat copied object.',
      'Deep inheritance chains maximize reuse but cost lookup time and reduce readability versus composition.',
    ],
    edgeCases: [
      'Object.create(null) has an empty chain — no toString/hasOwnProperty; call Object.prototype.hasOwnProperty.call instead.',
      'instanceof is realm-sensitive; cross-iframe values fail the chain check.',
      'Replacing a prototype object orphans the original constructor reference; reset constructor manually.',
      'Getters found in the chain run with `this` bound to the original receiver, not the holding prototype.',
    ],
    runtimeBehavior: [
      'V8 inline-caches the chain position where a key resolves; prototype mutation or shape change invalidates those caches and causes deopts.',
      'Missing-property access walks the entire chain to null every time unless cached.',
      'Symbol.hasInstance can customize instanceof, decoupling it from the literal chain check.',
    ],
    scalability: [
      'Flat, shallow chains scale best for hot property access across millions of objects.',
      'Library hierarchies should favor composition over deep extends to keep lookups and bundles lean.',
    ],
    productionConcerns: [
      'Prototype pollution via the chain is a recurring CVE class in merge/clone utilities; use null-prototype maps and key sanitization.',
      'Cross-realm instanceof failures cause subtle bugs in micro-frontends and iframe-embedded widgets.',
      'Forgetting to fix constructor after manual chain wiring breaks serialization/clone logic that reads instance.constructor.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Chain: object → prototype → ... → Object.prototype → null.',
    'Lookup checks own first, then hops up link by link.',
    'Stops at FIRST match; reaches null → undefined (no throw).',
    'arr: array → Array.prototype → Object.prototype → null.',
    'instanceof = is Ctor.prototype anywhere in the chain?',
    'Overriding = shadowing closer in the chain.',
    'Writes create OWN properties (shadow inherited).',
    'Object.create(null) = empty chain = safe map.',
    'Reset Child.prototype.constructor after chain wiring.',
    'instanceof breaks across realms → use Array.isArray.',
    'Deep chains = slower lookups; keep them short.',
    '__proto__ deep-merge → prototype pollution.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Log the full prototype chain links of `[]` until null using Object.getPrototypeOf.',
      hint: 'Call getPrototypeOf repeatedly.',
      solution: {
        lang: 'js',
        code: `let p = Object.getPrototypeOf([])
console.log(p === Array.prototype)                 // true
p = Object.getPrototypeOf(p)
console.log(p === Object.prototype)                // true
console.log(Object.getPrototypeOf(p))              // null`,
        explanation: [
          'First hop gives Array.prototype.',
          'Second hop gives Object.prototype.',
          'Third hop gives null — the end of the chain.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Set up Cat extends Animal with constructor functions so cat.speak() returns "meow" (override) and cat instanceof Animal is true.',
      hint: 'Link Cat.prototype to Animal.prototype with Object.create and fix constructor.',
      solution: {
        lang: 'js',
        code: `function Animal() {}
Animal.prototype.speak = function () { return 'sound' }
function Cat() {}
Cat.prototype = Object.create(Animal.prototype)
Cat.prototype.constructor = Cat
Cat.prototype.speak = function () { return 'meow' }
const cat = new Cat()
console.log(cat.speak())          // 'meow'
console.log(cat instanceof Animal) // true`,
        explanation: [
          'Object.create(Animal.prototype) links the chain to Animal.',
          'Overriding speak on Cat.prototype shadows Animal’s.',
          'instanceof Animal is true because Animal.prototype is in the chain.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write `chainOf(obj)` returning an array of the constructor names along obj’s prototype chain (e.g. for [] → ["Array","Object"]).',
      hint: 'Walk getPrototypeOf and read constructor.name at each step.',
      solution: {
        lang: 'js',
        code: `function chainOf(obj) {
  const names = []
  let p = Object.getPrototypeOf(obj)
  while (p) {
    names.push(p.constructor ? p.constructor.name : 'null-proto')
    p = Object.getPrototypeOf(p)
  }
  return names
}
console.log(chainOf([]))   // ['Array', 'Object']
console.log(chainOf({}))   // ['Object']`,
        explanation: [
          'We walk each prototype, reading its constructor.name.',
          'The loop stops when getPrototypeOf returns null.',
          'This visualizes the inheritance chain as readable names.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Polyfill `instanceof` as a function `isA(obj, Ctor)` that walks the chain and handles primitives safely.',
      hint: 'Return false for primitives; otherwise walk getPrototypeOf comparing to Ctor.prototype.',
      solution: {
        lang: 'js',
        code: `function isA(obj, Ctor) {
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false
  }
  let proto = Object.getPrototypeOf(obj)
  const target = Ctor.prototype
  while (proto !== null) {
    if (proto === target) return true
    proto = Object.getPrototypeOf(proto)
  }
  return false
}
class A {} ; class B extends A {}
console.log(isA(new B(), A)) // true
console.log(isA(5, Number))  // false (primitive)`,
        explanation: [
          'Primitives are not objects, so they are never instances (matching native behavior).',
          'We walk the chain comparing each link to Ctor.prototype.',
          'Reaching null without a match returns false — exactly how instanceof works.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The prototype chain is the single mechanism behind property lookup, inheritance, and instanceof. If you can trace a lookup link by link on a whiteboard, you have demonstrated the deepest part of how JavaScript objects work — and it makes classes and inheritance trivial.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is the prototype chain" and where toString comes from. Product companies (Zoho, Flipkart, Razorpay) ask you to trace a lookup, set up inheritance, and explain instanceof. FAANG-level interviews probe cross-realm instanceof, inline-cache deopts, and prototype pollution through the chain.',
    whatInterviewersExpect:
      'They expect you to describe the ordered lookup ending at null/undefined, explain instanceof as a chain walk, demonstrate shadowing/overriding, and connect the chain to performance and prototype pollution.',
  },
}

export default prototypeChain
