import type { ConceptLesson } from '../../../types/lesson'

const typeofInstanceof: ConceptLesson = {
  // 1. Concept Summary
  slug: 'typeof-instanceof',
  name: 'typeof & instanceof',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript is dynamically typed, so at runtime you constantly need to ask "what is this value?" — typeof and instanceof are the two primary tools for that.',
    'Both have famous traps: typeof null is "object", typeof a function is "function", and instanceof breaks across iframes/realms — interviewers test whether you know them.',
    'Getting type checks wrong leads to crashes (calling a method on the wrong type) or security holes (trusting an object that is not what you think).',
    'Robust libraries and frameworks rely on precise type detection (Object.prototype.toString, Array.isArray) because typeof/instanceof alone are insufficient.',
    'Understanding why instanceof works reveals the prototype chain, one of the deepest JavaScript mechanisms.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'typeof asks "what KIND of thing is this?"; instanceof asks "does this come from that family?"',
    story: [
      'Imagine you find an animal and want to know about it.',
      'One question is "what kind of animal is it?" — a quick label like "dog" or "bird". That is like typeof: a fast, rough category.',
      'A deeper question is "is this animal part of the Husky family?" — you trace its parents and grandparents to see if a Husky is in its family tree. That is like instanceof: it follows the family line.',
      'In JavaScript, typeof gives you a quick label ("number", "string", "object"), while instanceof walks up an object\'s family tree (its prototype chain) to check if a certain ancestor is there.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'typeof is an operator that returns a short string telling you the basic type of a value, like "number", "string", "boolean", "function", or "object".',
    'instanceof checks whether an object was built from a particular constructor (class) by looking through its prototype chain — its "family tree".',
    'So you use typeof for primitive types and a quick "is it an object?" check, and instanceof to ask "is this an Array? a Date? a custom MyClass?"',
    'Both have quirks: typeof null surprisingly says "object", and instanceof can give wrong answers when objects come from different windows/frames.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'typeof is a unary operator returning a string describing a value\'s primitive type ("number", "string", "boolean", "undefined", "symbol", "bigint", "function", or "object"). instanceof is a binary operator returning a boolean: whether a constructor\'s prototype appears anywhere in the object\'s prototype chain.',
    how: 'typeof reads an internal type tag and returns a fixed string. instanceof walks the object\'s [[Prototype]] chain comparing each link against constructor.prototype; if it finds a match it returns true.',
    why: 'You need runtime type checks in a dynamically typed language: typeof for primitives and "is this a function/object", instanceof (or better, Array.isArray / Object.prototype.toString) for specific object kinds.',
    code: {
      label: 'typeof for primitives, instanceof for object kinds',
      lang: 'js',
      code: `typeof 42          // "number"
typeof 'hi'        // "string"
typeof true        // "boolean"
typeof undefined   // "undefined"
typeof Symbol()    // "symbol"
typeof 10n         // "bigint"
typeof function(){} // "function"
typeof null        // "object"  (historic bug!)
typeof {}          // "object"

[] instanceof Array        // true
new Date() instanceof Date // true
[] instanceof Object       // true (Array's chain includes Object)`,
      explanation: [
        'typeof returns a string for the value\'s type; it never throws (even for undeclared variables).',
        'Functions get their own "function" result even though they are objects.',
        'typeof null is "object" — a well-known historic bug.',
        'instanceof checks the prototype chain, so an array is both an Array and an Object.',
        'Use typeof for primitives, instanceof for class/constructor membership.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'typeof is a unary operator that returns one of a fixed set of strings identifying the operand\'s type without coercion or throwing — even on undeclared identifiers it returns "undefined". It distinguishes the seven primitive-ish categories plus "function" for callables, but collapses all non-callable objects (and the buggy null) to "object". instanceof is a binary operator implemented via the constructor\'s Symbol.hasInstance method (default OrdinaryHasInstance), which walks the left operand\'s prototype chain and returns true if the right operand\'s .prototype object is encountered; it therefore tests prototype-chain membership, not literal construction, and fails across realms because each realm has distinct constructor identities.',

  // 7. Internal Working
  internalWorking: [
    'typeof reads the operand\'s internal type representation and maps it to a string: undefined→"undefined", boolean→"boolean", number→"number", bigint→"bigint", string→"string", symbol→"symbol", and any object→"object" EXCEPT callable objects→"function".',
    'typeof is uniquely safe on undeclared variables: the spec specifies it returns "undefined" instead of throwing a ReferenceError, because it short-circuits the binding resolution.',
    'typeof null returning "object" is a legacy artifact: the original type tag for objects was 0 and the null pointer was also represented as 0, so the check collided — never fixed for compatibility.',
    'instanceof invokes the right operand\'s [Symbol.hasInstance](left) method. The default implementation (OrdinaryHasInstance) retrieves constructor.prototype and walks left.[[Prototype]] chain via [[GetPrototypeOf]].',
    'At each link it compares the prototype object identity; if it equals constructor.prototype it returns true, if the chain reaches null it returns false.',
    'Because identity comparison is used, an Array created in another realm (iframe) is an instance of THAT realm\'s Array, not the current one — so cross-realm instanceof Array is false, which is why Array.isArray (realm-safe) exists.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   typeof value  ──► quick TYPE LABEL (a string)
   ─────────────────────────────────────────
   "number" "string" "boolean" "undefined"
   "symbol" "bigint" "function"
   ...everything else (incl. null!) ──► "object"

   value instanceof Ctor  ──► walk the PROTOTYPE CHAIN
   ─────────────────────────────────────────────────
        value
          │ [[Prototype]]
          ▼
      Array.prototype  === Array.prototype ?  -> true
          │ [[Prototype]]
          ▼
     Object.prototype  === Array.prototype ?  -> no
          │
          ▼
        null            -> reached end -> false`,

  // 9. Memory Visualization
  memoryVisualization: [
    'typeof inspects the value in place (its type tag) and allocates only a short result string — no traversal, O(1).',
    'instanceof follows [[Prototype]] reference links on the heap from the object up toward Object.prototype (or null), comparing object identities.',
    'The chain links are real references between heap objects; instanceof is O(depth of the prototype chain), usually tiny.',
    'Cross-realm objects live with their own realm\'s prototype objects (different heap identities), which is why instanceof fails across frames.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — guarding by primitive type',
      lang: 'js',
      code: `function double(x) {
  if (typeof x !== 'number') {
    throw new TypeError('expected a number')
  }
  return x * 2
}
double(5)        // 10
// double('5')   // throws TypeError

// typeof is safe even on undeclared vars:
console.log(typeof notDeclared) // "undefined" (no ReferenceError)`,
      explanation: [
        'typeof gives a quick guard against the wrong primitive type.',
        'Throwing early with a clear message beats a cryptic NaN later.',
        'Uniquely, typeof on an undeclared identifier returns "undefined" rather than throwing.',
        'This makes typeof a safe feature-detection tool.',
      ],
    },
    intermediate: {
      label: 'Intermediate — instanceof and the prototype chain',
      lang: 'js',
      code: `class Animal {}
class Dog extends Animal {}

const d = new Dog()
console.log(d instanceof Dog)    // true
console.log(d instanceof Animal) // true (up the chain)
console.log(d instanceof Object) // true
console.log(d instanceof Array)  // false

// instanceof checks the CHAIN, so all ancestors match
console.log(Object.getPrototypeOf(d) === Dog.prototype) // true`,
      explanation: [
        'instanceof returns true for the class AND every ancestor in the chain.',
        'A Dog is an Animal and an Object because their prototypes are on its chain.',
        'It is false for unrelated constructors like Array.',
        'Under the hood it compares Dog.prototype, Animal.prototype, etc. against the chain links.',
      ],
    },
    advanced: {
      label: 'Advanced — why you need Array.isArray and toString tag',
      lang: 'js',
      code: `// Robust type detection beyond typeof/instanceof:
function typeOf(v) {
  return Object.prototype.toString.call(v).slice(8, -1)
}
typeOf([])        // "Array"
typeOf(null)      // "Null"   (fixes typeof null bug)
typeOf(new Date) // "Date"
typeOf(/re/)      // "RegExp"

// Array.isArray works across realms; instanceof Array can fail:
Array.isArray([])         // true (realm-safe)
// iframeArray instanceof Array -> false across frames!`,
      explanation: [
        'Object.prototype.toString.call exposes the internal [[Class]]/toStringTag, giving precise tags.',
        'It correctly reports "Null" and distinguishes Date/RegExp/Array where typeof says "object".',
        'Array.isArray is the canonical, realm-safe array check.',
        'Libraries use these because typeof is too coarse and instanceof is realm-fragile.',
        'This is the production-grade approach to type detection.',
      ],
    },
    realProject: {
      label: 'Real project — argument normalization in a Node/Vue utility',
      lang: 'js',
      code: `// Accept a string, array, or Error and normalize to a message
function toMessage(input) {
  if (typeof input === 'string') return input
  if (Array.isArray(input)) return input.join(', ')
  if (input instanceof Error) return input.message
  if (input != null && typeof input === 'object') return JSON.stringify(input)
  return String(input)
}
toMessage('hi')                 // "hi"
toMessage(['a', 'b'])           // "a, b"
toMessage(new Error('boom'))    // "boom"
toMessage({ code: 1 })          // '{"code":1}'`,
      explanation: [
        'typeof handles the primitive (string) branch cheaply.',
        'Array.isArray is used instead of instanceof Array for realm safety.',
        'instanceof Error reliably detects error objects to extract .message.',
        'A final object check (with null guard) covers plain objects.',
        'This overload-style normalization is common in Vue composables and Node utilities.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are all the possible results of typeof?',
      answer: '"undefined", "boolean", "number", "bigint", "string", "symbol", "function", and "object". Note that typeof null is "object" and typeof a function is "function".',
      explanation: 'Listing all eight plus the two gotchas (null, function) demonstrates precision.',
    },
    {
      level: 'beginner',
      question: 'Why does typeof null return "object"?',
      answer: 'It is a historic bug: in the original implementation null was the all-zero pointer that shared the type tag used for objects. It was never fixed to preserve backward compatibility.',
      explanation: 'Classic trivia; the takeaway is to check null explicitly before typeof-object branching.',
    },
    {
      level: 'beginner',
      question: 'What does instanceof check?',
      answer: 'Whether a constructor\'s .prototype object appears anywhere in the left operand\'s prototype chain — i.e. prototype-chain membership, not literal construction.',
      explanation: 'Tying it to the prototype chain (not "was created with new X") shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'How do you reliably check if a value is an array?',
      answer: 'Use Array.isArray(value). It is realm-safe, unlike `value instanceof Array`, which returns false for arrays created in another iframe/realm, and unlike typeof, which just says "object".',
      explanation: 'Knowing the realm problem and the canonical fix is a strong intermediate signal.',
    },
    {
      level: 'intermediate',
      question: 'How can you distinguish arrays, dates, and null when typeof says "object" for all of them?',
      answer: 'Use Object.prototype.toString.call(value), which returns "[object Array]", "[object Date]", "[object Null]", etc., or use Array.isArray and instanceof Date for specific checks.',
      explanation: 'Demonstrates the standard production technique beyond typeof/instanceof.',
    },
    {
      level: 'senior',
      question: 'How does instanceof actually work internally, and how can you customize it?',
      answer: 'instanceof calls the right operand\'s [Symbol.hasInstance] method; the default walks the prototype chain comparing identities. You can override Symbol.hasInstance on a class/object to define custom membership logic (used by abstract-class checks and some libraries).',
      explanation: 'Senior signal: naming Symbol.hasInstance, OrdinaryHasInstance, the chain walk, and the realm-identity caveat.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does typeof not throw on an undeclared variable?',
    'How does instanceof behave across iframes/realms and why?',
    'What is Symbol.hasInstance and when would you override it?',
    'How do Object.prototype.toString tags relate to Symbol.toStringTag?',
    'Why is typeof a function "function" but a function is still an object?',
    'How would you write a robust isPlainObject check?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using typeof to detect arrays or null-vs-object.',
      why: 'typeof [] and typeof null are both "object", so arrays and null are indistinguishable from plain objects.',
      fix: 'Use Array.isArray for arrays and an explicit `=== null` check; use Object.prototype.toString for fine-grained tags.',
    },
    {
      mistake: 'Relying on `value instanceof Array` for values that may cross frames.',
      why: 'Each realm has its own Array constructor, so cross-realm arrays fail the check.',
      fix: 'Use Array.isArray, which is realm-agnostic.',
    },
    {
      mistake: 'Assuming instanceof means "constructed with this exact constructor".',
      why: 'It actually tests prototype-chain membership, so subclasses and prototype reassignments affect the result.',
      fix: 'Understand it as a chain check; for exact construction compare constructor or use a tag.',
    },
    {
      mistake: 'Checking typeof on the right-hand primitive of instanceof.',
      why: 'instanceof on a primitive left operand is always false (primitives have no prototype chain link to walk meaningfully) and the right side must be callable or it throws.',
      fix: 'Use typeof for primitives; use instanceof only with objects on the left and a constructor on the right.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Argument validation and overloaded function signatures use typeof for primitives and instanceof Error/Buffer/Stream for object kinds; Array.isArray is standard for arrays.' },
    { area: 'React', detail: 'PropType-style runtime checks and utility libraries detect element/children types with typeof and React.isValidElement (a tag check), since instanceof is unreliable across bundles.' },
    { area: 'Vue', detail: 'Composables and props validators use typeof and Array.isArray to coerce/validate inputs; instanceof Date/Error for richer values.' },
    { area: 'Backend', detail: 'Serialization and schema validators (zod/joi) internally rely on Object.prototype.toString and typeof to classify values precisely across types.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'typeof is O(1) — a direct type-tag read — and extremely fast in hot paths.',
      'instanceof is O(prototype-chain depth), which is normally just a few links and very cheap.',
    ],
    bad: [
      'Deep or pathological prototype chains make instanceof slightly slower, though rarely a real bottleneck.',
      'Custom Symbol.hasInstance implementations run arbitrary code per check and can be slow if naively written.',
    ],
    optimizations: [
      'Prefer typeof for primitive checks and Array.isArray for arrays — both are fast and correct.',
      'Cache or hoist repeated type checks out of tight loops when the type cannot change.',
      'Use a single Object.prototype.toString.call dispatch table for multi-type branching instead of long if/instanceof chains.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Trusting instanceof for security decisions can be bypassed: an attacker-controlled object can spoof a prototype or originate from another realm to evade the check.',
      'A malicious object can override Symbol.hasInstance to lie about instanceof results, or define a toString that returns misleading tags.',
    ],
    bestPractices: [
      'Do not base authorization or trust boundaries on instanceof of untrusted objects; validate structure/shape explicitly with a schema.',
      'Use realm-safe, tamper-resistant checks (Array.isArray, Object.prototype.toString.call) and freeze critical prototypes where appropriate.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'prototype', 'prototype-chain'],
    nextConcepts: ['es6-classes', 'inheritance-patterns', 'null-vs-undefined', 'symbol'],
    dependencyNote:
      'typeof/instanceof depend on knowing data types and the prototype chain (instanceof literally walks it). They precede deeper work on classes and inheritance patterns and connect to null/undefined handling and Symbol (Symbol.hasInstance / toStringTag).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write "typeof = quick label" and list the 8 results, circling the traps: null→"object", function→"function".',
      'Write "instanceof = walk prototype chain" and draw an object linked up through Ctor.prototype → Object.prototype → null.',
      'Show instanceof returning true at each ancestor match, false when the chain hits null.',
      'Add the two production fixes: Array.isArray (realm-safe) and Object.prototype.toString.call (precise tags).',
      'Mention instanceof breaks across iframes because each realm has its own constructors.',
      'Say: "typeof for primitives, instanceof for class membership, isArray/toString for the gritty real cases."',
    ],
    diagram: `   typeof x -> "number"|"string"|"boolean"|"undefined"|
               "symbol"|"bigint"|"function"|"object"
               (null -> "object" !! )

   x instanceof Ctor:
        x ─►[[Proto]]─► Ctor.prototype ?  yes -> true
                      ─► Object.prototype
                      ─► null            -> false

   Array.isArray(x)  (realm-safe)
   Object.prototype.toString.call(x) -> "[object Array]" ...`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'typeof is a fast operator returning a type-label string — "number", "string", "boolean", "undefined", "symbol", "bigint", "function", or "object" — with the traps that typeof null is "object" and typeof a function is "function". instanceof walks an object\'s prototype chain checking whether a constructor\'s .prototype is on it, so subclasses and ancestors all match. Both have gaps: use Array.isArray (realm-safe) for arrays and Object.prototype.toString.call for precise tags. typeof never throws, even on undeclared variables.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'typeof and instanceof are the two runtime type-checking operators. typeof is a quick label: it returns a string — "number", "string", "boolean", "undefined", "symbol", "bigint", "function", or "object". It is best for primitives and for asking "is this a function?". It has two famous quirks: typeof null is "object", a historic bug, and a function reports "function" even though functions are objects. It also uniquely never throws — typeof on an undeclared variable returns "undefined", which makes it a safe feature-detection tool. instanceof is deeper: it walks the left operand\'s prototype chain and returns true if the constructor\'s .prototype object is found on it. Internally it calls the constructor\'s Symbol.hasInstance, and the default implementation does that chain walk. Because it tests chain membership, a Dog is an instanceof Dog, Animal, and Object all at once. The big caveat is realms: each iframe has its own Array constructor, so an array from another frame is not instanceof your Array — which is exactly why Array.isArray exists and is realm-safe. Since typeof reports "object" for arrays, null, dates, and regexes alike, the production-grade tool for precise detection is Object.prototype.toString.call(value), which returns tags like "[object Array]" or "[object Null]". So in practice I use typeof for primitives, Array.isArray for arrays, instanceof for custom classes and Error/Date, and the toString tag when I need exact classification.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'typeof is cheap and never throws but too coarse (everything object-y is "object"); toString tags are precise but slower and a bit obscure.',
      'instanceof is intuitive for class hierarchies but realm-fragile and spoofable; structural ("duck typing") checks are robust but more verbose.',
    ],
    edgeCases: [
      'typeof null === "object" and typeof function === "function" — the two perennial gotchas.',
      'instanceof across iframes/Workers fails due to per-realm constructor identity; Array.isArray and toString tags are realm-safe.',
      'Symbol.hasInstance can be overridden, so instanceof results are customizable (and spoofable).',
      'instanceof on a primitive left operand is always false; the right operand must be callable or it throws a TypeError.',
    ],
    runtimeBehavior: [
      'typeof reads a type tag in O(1) and bypasses binding resolution (hence safe on undeclared names).',
      'instanceof is O(prototype-chain depth) and uses identity comparison against constructor.prototype.',
      'Subclassing, Object.setPrototypeOf, and proxies all influence instanceof outcomes because they alter the chain.',
    ],
    scalability: [
      'In libraries shipped across bundlers/microfrontends (multiple realms), prefer Array.isArray / toString tags / brand checks over instanceof to avoid silent failures.',
      'A toString-tag dispatch map scales cleaner than growing if/instanceof ladders for many types.',
    ],
    productionConcerns: [
      'Cross-realm instanceof failures cause intermittent, environment-specific bugs that are painful to reproduce.',
      'Security-sensitive code must not trust instanceof on untrusted objects (spoofable via Symbol.hasInstance/prototype).',
      'Minifiers/bundlers can duplicate class identities, breaking instanceof between chunks — validate by shape when crossing module boundaries.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'typeof results: undefined, boolean, number, bigint, string, symbol, function, object.',
    'typeof null === "object" (historic bug).',
    'typeof function === "function" (still an object).',
    'typeof never throws — safe on undeclared variables.',
    'instanceof = is Ctor.prototype on the object\'s prototype chain?',
    'instanceof matches the class AND all ancestors.',
    'instanceof breaks across iframes/realms → use Array.isArray.',
    'Array.isArray(x) is the realm-safe array check.',
    'Object.prototype.toString.call(x) → precise tags ("[object Array]", "[object Null]").',
    'instanceof uses Symbol.hasInstance (overridable / spoofable).',
    'Use typeof for primitives, instanceof for classes/Error/Date.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write isFunction(v) that returns true only for functions.',
      hint: 'One typeof check does it.',
      solution: {
        lang: 'js',
        code: `function isFunction(v) {
  return typeof v === 'function'
}
isFunction(() => {}) // true
isFunction(class {}) // true (classes are callable)
isFunction({})       // false`,
        explanation: [
          'typeof returns "function" for any callable, including class definitions.',
          'It is the simplest and fastest function check.',
          'Non-callables return their own type string.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write typeOf(v) that returns precise tags like "array", "null", "date", "regexp", and primitive type names, all lowercase.',
      hint: 'Use Object.prototype.toString.call and slice out the tag.',
      solution: {
        lang: 'js',
        code: `function typeOf(v) {
  return Object.prototype.toString
    .call(v)
    .slice(8, -1)   // "[object Array]" -> "Array"
    .toLowerCase()
}
typeOf([])       // "array"
typeOf(null)     // "null"
typeOf(new Date) // "date"
typeOf(/x/)      // "regexp"
typeOf(42)       // "number"`,
        explanation: [
          'Object.prototype.toString.call exposes the internal tag.',
          'Slicing removes the "[object " prefix and "]" suffix.',
          'This correctly separates array/null/date/regexp where typeof says "object".',
          'A robust, realm-safe classifier libraries use.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement isPlainObject(v): true only for objects created from Object/{}, not arrays, null, or class instances.',
      hint: 'Check the prototype is Object.prototype or null (Object.create(null)).',
      solution: {
        lang: 'js',
        code: `function isPlainObject(v) {
  if (v === null || typeof v !== 'object') return false
  const proto = Object.getPrototypeOf(v)
  return proto === Object.prototype || proto === null
}
isPlainObject({})                 // true
isPlainObject(Object.create(null))// true
isPlainObject([])                 // false
isPlainObject(new Date())         // false
isPlainObject(null)               // false`,
        explanation: [
          'Reject null and non-objects up front via typeof.',
          'A plain object\'s prototype is exactly Object.prototype (or null for Object.create(null)).',
          'Arrays, dates, and class instances have different prototypes, so they fail.',
          'This is the same logic libraries like lodash use.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Show how to make a class C where `x instanceof C` is true for any value that has a `.quack` method (custom instanceof).',
      hint: 'Define a static [Symbol.hasInstance].',
      solution: {
        lang: 'js',
        code: `class Duck {
  static [Symbol.hasInstance](value) {
    return value != null && typeof value.quack === 'function'
  }
}
const realDuck = { quack() {} }
console.log(realDuck instanceof Duck) // true (duck typing!)
console.log({} instanceof Duck)       // false`,
        explanation: [
          'instanceof delegates to the right operand\'s Symbol.hasInstance.',
          'Overriding it lets you define membership by SHAPE rather than prototype chain.',
          'Here any object with a quack method passes — structural typing.',
          'This is the mechanism abstract-class and brand checks use.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Runtime type checking is unavoidable in a dynamically typed language. Knowing the precise results of typeof, the prototype-chain truth of instanceof, and the realm-safe alternatives prevents crashes and the subtle environment-specific bugs that are notoriously hard to debug.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the typeof results and why typeof null is "object". Product companies (Zoho, Flipkart, Razorpay) probe array detection (instanceof vs Array.isArray) and how to tell arrays/dates/null apart. FAANG-level rounds dig into Symbol.hasInstance, the realm problem, and robust isPlainObject implementations.',
    whatInterviewersExpect:
      'They expect the full list of typeof results with the null/function gotchas, an explanation of instanceof as a prototype-chain walk, awareness of the realm failure and Array.isArray, and ideally the Object.prototype.toString and Symbol.hasInstance techniques.',
  },
}

export default typeofInstanceof
