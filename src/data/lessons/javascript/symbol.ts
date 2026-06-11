import type { ConceptLesson } from '../../../types/lesson'

const symbol: ConceptLesson = {
  // 1. Concept Summary
  slug: 'symbol',
  name: 'Symbol',
  category: 'types-coercion',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Symbols are the only way to create guaranteed-unique property keys, so two libraries can add properties to the same object without ever colliding.',
    'They power the customization hooks of the language itself — Symbol.iterator (for...of, spread), Symbol.asyncIterator, Symbol.hasInstance (instanceof), and Symbol.toPrimitive (coercion).',
    'They provide a form of "hidden" metadata: symbol-keyed properties are skipped by for...in, Object.keys, and JSON.stringify, making them ideal for non-enumerable internal state.',
    'Understanding well-known symbols is what lets you make your own objects iterable or control how they coerce — a senior-level capability.',
    'Interviewers use Symbol to probe whether you understand property keys beyond strings, protocol-based design, and the iteration protocols.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Symbol is a one-of-a-kind sticker — even if two stickers say the same word, no two stickers are ever the same.',
    story: [
      'Imagine everyone in class brings a labeled box, and you each get a special sticker to mark which drawer is yours.',
      'Even if two stickers happen to have the same word printed on them, each sticker is still its own unique thing — yours is yours, theirs is theirs, and they never get mixed up.',
      'So you can safely put your sticker on a shared drawer and no one else\'s identical-looking sticker will open your spot.',
      'In JavaScript a Symbol is exactly that unique sticker. You can use it as a name (key) on a shared object, and even if someone makes a symbol with the same description, it is a different unique key and will never clash with yours.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally object property names are strings, like obj.name. A Symbol is a brand-new kind of value you can also use as a property name.',
    'The special thing about a Symbol is that every Symbol is unique — even two symbols created with the same text description are different from each other.',
    'You create one by calling Symbol("description"); the description is just a label for debugging and does not affect uniqueness.',
    'Because each symbol is unique, you can add a property with a symbol key to an object and be sure nobody else\'s code will accidentally overwrite it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Symbol is a primitive type whose values are always unique. You create them with Symbol(description) and use them mainly as collision-proof object property keys, and as "well-known symbols" that hook into language behavior.',
    how: 'Each call to Symbol() produces a new unique value (the description is only a label). Symbols used as keys are non-enumerable to the usual iteration mechanisms (for...in, Object.keys, JSON.stringify) and are accessed via Object.getOwnPropertySymbols.',
    why: 'They prevent property-name collisions in shared/extensible objects and let you implement protocols like iteration (Symbol.iterator) without occupying a string name that could clash with user data.',
    code: {
      label: 'Uniqueness and use as a key',
      lang: 'js',
      code: `const a = Symbol('id')
const b = Symbol('id')
console.log(a === b)        // false — always unique
console.log(typeof a)       // "symbol"

const user = { name: 'Sam' }
const SECRET = Symbol('secret')
user[SECRET] = 42           // collision-proof key

console.log(Object.keys(user))   // ["name"] — symbol hidden
console.log(user[SECRET])        // 42 (accessed via the symbol)
console.log(JSON.stringify(user))// {"name":"Sam"} — symbol skipped`,
      explanation: [
        'Two symbols with the same description are still different values.',
        'typeof a symbol is "symbol".',
        'A symbol key never collides with string keys or other symbols.',
        'Symbol keys are skipped by Object.keys, for...in, and JSON.stringify.',
        'You must hold the symbol itself to read the property.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Symbol is a primitive type introduced in ES2015 whose every value is guaranteed unique and immutable. Symbols are created via the Symbol([description]) function (never with new), with the optional description serving only as a debugging label. They are valid property keys alongside strings; symbol-keyed properties are excluded from for...in, Object.keys/values/entries, and JSON.stringify, and are retrievable only via Object.getOwnPropertySymbols or Reflect.ownKeys. A global symbol registry is accessible through Symbol.for(key)/Symbol.keyFor(sym) for cross-realm sharing. Well-known symbols (Symbol.iterator, Symbol.asyncIterator, Symbol.hasInstance, Symbol.toPrimitive, Symbol.toStringTag, etc.) are predefined symbols the language uses to let objects customize built-in operations.',

  // 7. Internal Working
  internalWorking: [
    'Calling Symbol(desc) allocates a new, unique symbol value; the engine guarantees identity uniqueness — no two such calls ever produce equal symbols, regardless of description.',
    'A symbol used as a property key is stored in the object\'s property table like any key, but flagged so it is omitted from string-key enumeration paths (for...in, Object.keys, JSON.stringify).',
    'Object.getOwnPropertySymbols and Reflect.ownKeys are the only standard ways to enumerate symbol keys, keeping them out of accidental serialization/iteration.',
    'Symbol.for(key) consults a process-wide global symbol registry: if a symbol for that string key exists it returns the same one, otherwise it creates and registers it — enabling shared symbols across modules/realms; Symbol.keyFor returns the registry key for a registered symbol.',
    'When the engine performs built-in operations it looks up well-known symbols on the operand: for...of/spread call obj[Symbol.iterator](), coercion calls obj[Symbol.toPrimitive](hint), instanceof calls Ctor[Symbol.hasInstance](obj), and Object.prototype.toString reads Symbol.toStringTag.',
    'Symbols cannot be implicitly coerced to strings (string concatenation throws a TypeError); you must call String(sym) or sym.toString() explicitly, a deliberate safety guard.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Symbol('id')  Symbol('id')   <- both UNIQUE, never equal
        │             │
        ▼             ▼
   ┌──────────────────────────────┐
   │ object property table         │
   │  "name"      -> "Sam"         │  <- string key (enumerable)
   │  Symbol(secret) -> 42         │  <- symbol key (HIDDEN)
   └──────────────────────────────┘
     Object.keys  -> ["name"]   (symbols skipped)
     getOwnPropertySymbols -> [Symbol(secret)]

   WELL-KNOWN SYMBOLS hook the language:
     Symbol.iterator    -> for...of / spread
     Symbol.toPrimitive -> coercion (+, template)
     Symbol.hasInstance -> instanceof
     Symbol.toStringTag -> Object.prototype.toString

   Symbol.for('x') === Symbol.for('x')  (global registry)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A symbol is a small immutable primitive carrying a unique identity; comparisons are identity checks, not value/string comparisons.',
    'Symbols created with Symbol() are not interned — each is a distinct value; only Symbol.for() entries are shared via the global registry.',
    'Symbol-keyed properties live in the same property table as string keys but are filtered out of enumeration, so they hold "side-channel" metadata without bloating visible shape.',
    'Because registry symbols (Symbol.for) persist for the program lifetime, over-registering many of them is a (rare) source of unbounded retained memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — unique keys that never collide',
      lang: 'js',
      code: `const ID = Symbol('id')
const obj = { [ID]: 123, name: 'Sam' }

console.log(obj[ID])             // 123
console.log(Symbol('id') in obj) // false — a DIFFERENT symbol

// Even libraries can safely tag the same object:
const LIB_A = Symbol('meta')
const LIB_B = Symbol('meta')
obj[LIB_A] = 'a'
obj[LIB_B] = 'b'
console.log(obj[LIB_A], obj[LIB_B]) // "a" "b" — no clash`,
      explanation: [
        'A computed [ID] key uses the symbol as the property name.',
        'A freshly created Symbol("id") is a different key, so it is not "in" the object.',
        'Two libraries using the same description still get distinct keys.',
        'This collision-proofness is the core practical value of symbols.',
      ],
    },
    intermediate: {
      label: 'Intermediate — making an object iterable with Symbol.iterator',
      lang: 'js',
      code: `const range = {
  from: 1,
  to: 4,
  [Symbol.iterator]() {
    let current = this.from
    const last = this.to
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}

console.log([...range])          // [1, 2, 3, 4]
for (const n of range) console.log(n) // 1 2 3 4`,
      explanation: [
        'Defining [Symbol.iterator] makes the object conform to the iteration protocol.',
        'for...of and spread call that method to get an iterator object.',
        'The iterator\'s next() returns { value, done } until exhausted.',
        'This is exactly how arrays, maps, and strings are iterable — via Symbol.iterator.',
      ],
    },
    advanced: {
      label: 'Advanced — global registry and well-known symbols',
      lang: 'js',
      code: `// Global registry: same key -> same symbol everywhere
const s1 = Symbol.for('app.token')
const s2 = Symbol.for('app.token')
console.log(s1 === s2)              // true (shared)
console.log(Symbol.keyFor(s1))     // "app.token"

// Customize coercion and tag:
const temp = {
  celsius: 20,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? this.celsius + '°C' : this.celsius
  },
  get [Symbol.toStringTag]() { return 'Temperature' }
}
console.log(temp + 5)                         // 25
console.log(\`\${temp}\`)                        // "20°C"
console.log(Object.prototype.toString.call(temp)) // "[object Temperature]"`,
      explanation: [
        'Symbol.for/keyFor use a global registry to share symbols across modules and realms.',
        'Symbol.toPrimitive lets the object control number vs string coercion via the hint.',
        'Symbol.toStringTag customizes the [object X] tag from Object.prototype.toString.',
        'Well-known symbols are the official hooks for plugging into built-in language operations.',
      ],
    },
    realProject: {
      label: 'Real project — private/internal state and Vue/Node protocols',
      lang: 'js',
      code: `// Node/library: attach internal metadata without polluting public shape
const INTERNAL = Symbol('internal')
function createCache() {
  const cache = {}
  cache[INTERNAL] = { hits: 0, misses: 0 } // hidden from JSON/Object.keys
  return cache
}
const c = createCache()
c[INTERNAL].hits++
console.log(JSON.stringify(c))   // "{}" — internal stats not leaked

// Async iteration protocol (used by streams):
async function* lines(stream) { /* yields lines */ }
// for await (const line of lines(stream)) uses Symbol.asyncIterator
console.log(typeof Symbol.asyncIterator) // "symbol"`,
      explanation: [
        'A symbol key stores internal stats that stay out of JSON and public enumeration.',
        'Consumers never see or accidentally overwrite the internal metadata.',
        'Node streams and async generators rely on Symbol.asyncIterator for for-await-of.',
        'Vue/React libraries similarly use symbols to brand or tag objects without name clashes.',
        'This is the idiomatic way to keep framework/library internals invisible.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Symbol and what is its defining property?',
      answer: 'Symbol is a primitive type whose every value is unique and immutable. Even two symbols created with the same description are not equal. typeof a symbol is "symbol".',
      explanation: 'Uniqueness is the headline; the description being a mere label is the common follow-up.',
    },
    {
      level: 'beginner',
      question: 'Why would you use a Symbol as an object key?',
      answer: 'To create a property key guaranteed not to collide with any string key or any other symbol, which is essential when multiple pieces of code add properties to a shared object. Symbol keys are also hidden from for...in, Object.keys, and JSON.stringify.',
      explanation: 'Collision avoidance plus the non-enumerable behavior are the two practical reasons.',
    },
    {
      level: 'intermediate',
      question: 'How do Symbol() and Symbol.for() differ?',
      answer: 'Symbol() always creates a brand-new unique symbol. Symbol.for(key) uses a global registry: the same string key always returns the same shared symbol, allowing reuse across modules and realms. Symbol.keyFor retrieves the registry key.',
      explanation: 'The local-unique vs global-shared distinction is the key intermediate concept.',
    },
    {
      level: 'intermediate',
      question: 'How do you read symbol-keyed properties, and are they truly private?',
      answer: 'Via the symbol reference itself, or enumerate them with Object.getOwnPropertySymbols / Reflect.ownKeys. They are not truly private — anyone who can reach those reflection methods can find them — they are "hidden" from normal enumeration, not secure.',
      explanation: 'Distinguishing "hidden/non-enumerable" from "private/secure" shows nuance.',
    },
    {
      level: 'advanced',
      question: 'What are well-known symbols and name a few with their effect.',
      answer: 'Predefined symbols the engine uses to let objects customize built-in operations: Symbol.iterator (for...of/spread), Symbol.asyncIterator (for-await-of), Symbol.toPrimitive (coercion), Symbol.hasInstance (instanceof), and Symbol.toStringTag (Object.prototype.toString output).',
      explanation: 'Listing several and tying each to the operation it customizes is a strong advanced signal.',
    },
    {
      level: 'senior',
      question: 'How would you make a custom object iterable, and how does the engine consume it?',
      answer: 'Define a [Symbol.iterator]() method returning an iterator object with a next() that yields { value, done }. for...of, spread, and destructuring call obj[Symbol.iterator]() once to obtain the iterator, then repeatedly call next() until done is true. Generators implement this protocol automatically.',
      explanation: 'Senior signal: precise protocol mechanics and how built-ins drive it via the well-known symbol.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does `"" + Symbol()` throw, and how do you convert a symbol to a string?',
    'Are symbol-keyed properties included in spread/Object.assign? (yes — own enumerable symbols are copied)',
    'How does Symbol.toPrimitive interact with the + operator and template literals?',
    'What is the difference between non-enumerable string keys and symbol keys for "privacy"?',
    'How do generators relate to Symbol.iterator?',
    'When would you reach for the global registry (Symbol.for) versus a module-local symbol?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling `new Symbol()`.',
      why: 'Symbol is not a constructor; using new throws a TypeError.',
      fix: 'Call Symbol(description) as a function, without new.',
    },
    {
      mistake: 'Treating symbol-keyed properties as secure/private.',
      why: 'They are hidden from normal enumeration but discoverable via Object.getOwnPropertySymbols/Reflect.ownKeys.',
      fix: 'Use them for collision-free non-enumerable metadata; use closures or #private fields for true privacy.',
    },
    {
      mistake: 'Concatenating a symbol into a string implicitly.',
      why: 'Implicit string coercion of a symbol throws a TypeError by design.',
      fix: 'Convert explicitly with String(sym) or sym.toString() / sym.description.',
    },
    {
      mistake: 'Expecting symbols to survive JSON.stringify or appear in Object.keys.',
      why: 'Symbol keys are intentionally excluded from JSON and string-key enumeration.',
      fix: 'Read them via the symbol reference / getOwnPropertySymbols; store serializable data under string keys.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Streams and async generators use Symbol.asyncIterator for for-await-of; libraries brand objects with symbols (e.g. internal type tags) to avoid colliding with user data.' },
    { area: 'Vue', detail: 'provide/inject can use symbol keys to avoid name collisions across plugins, and reactivity internals use symbols to mark objects without exposing enumerable flags.' },
    { area: 'React', detail: 'React elements are tagged with a Symbol.for("react.element") brand so that only genuine elements are recognized, hardening against injection of fake element objects.' },
    { area: 'Backend', detail: 'Frameworks attach hidden metadata (request context, DI tokens) via symbol keys so it stays out of serialization and never clashes with domain fields.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Symbol-keyed lookups are ordinary property accesses with no meaningful overhead versus string keys.',
      'Using symbols to avoid collisions prevents the costly bugs and defensive checks that name clashes otherwise require.',
    ],
    bad: [
      'Over-registering symbols via Symbol.for keeps them alive for the program lifetime, a minor but real retained-memory cost.',
      'Heavy reflection over getOwnPropertySymbols in hot paths adds overhead compared to direct access.',
    ],
    optimizations: [
      'Prefer module-local Symbol() for internal keys and reserve Symbol.for for genuinely cross-module/realm sharing.',
      'Access symbol properties directly via the held symbol rather than enumerating with reflection in hot code.',
      'Define well-known symbol methods (iterator/toPrimitive) once on prototypes, not per-instance, to avoid duplication.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Symbol keys provide obscurity, not security: Object.getOwnPropertySymbols and Reflect.ownKeys can reveal them, so they must not be used to hide secrets in client code.',
      'Relying on a brand symbol for trust (e.g. element validation) can be undermined if an attacker can call Symbol.for with the same registry key to forge the brand.',
    ],
    bestPractices: [
      'Never store secrets in symbol-keyed properties expecting privacy; use closures, #private fields, or server-side storage.',
      'For trust/brand checks, prefer module-local (non-registry) symbols that external code cannot recreate via Symbol.for.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'object-creation', 'typeof-instanceof'],
    nextConcepts: ['iterables-iterators', 'generators', 'type-coercion', 'property-descriptors'],
    dependencyNote:
      'Symbol is a primitive (checked via typeof) used as object keys (object-creation) and as the backbone of iterables-iterators and generators (Symbol.iterator). It also drives coercion hooks (Symbol.toPrimitive, type-coercion) and relates to property descriptors/enumerability.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write Symbol("id") twice and show the two are !==, emphasizing guaranteed uniqueness.',
      'Add a symbol key to an object and show Object.keys/JSON.stringify skip it; getOwnPropertySymbols reveals it.',
      'Contrast Symbol() (always new) with Symbol.for("x") (global registry, shared).',
      'List well-known symbols and the operation each hooks: iterator→for...of, toPrimitive→coercion, hasInstance→instanceof, toStringTag→toString.',
      'Sketch a [Symbol.iterator]() returning { next() -> {value, done} } and show [...range].',
      'Say: "Symbols are unique, collision-proof keys and the language\'s extension points — hidden from enumeration but not secret."',
    ],
    diagram: `   Symbol('id') !== Symbol('id')   (always unique)
   Symbol.for('x') === Symbol.for('x')  (registry)

   obj = { name:'Sam', [SECRET]: 42 }
     Object.keys     -> ["name"]   (symbol hidden)
     getOwnPropertySymbols -> [SECRET]

   well-known:
     [Symbol.iterator]    -> for...of / spread
     [Symbol.toPrimitive] -> + / template coercion
     [Symbol.hasInstance] -> instanceof
     [Symbol.toStringTag] -> "[object X]"`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Symbol is a primitive whose every value is unique, created with Symbol(desc) (the description is just a label) and checked with typeof "symbol". Its main use is collision-proof property keys that are hidden from for...in, Object.keys, and JSON.stringify (read them via getOwnPropertySymbols). Symbol.for/keyFor share symbols through a global registry. Well-known symbols like Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance, and Symbol.toStringTag let objects hook into built-in operations. Symbols are hidden, not secure, and never use new Symbol().',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Symbol is a primitive type added in ES2015 whose defining feature is uniqueness: every symbol is its own distinct value, and even two symbols created with the same description are not equal. You make one with Symbol(description) — never with new — and the description is only a debugging label. The first big use is collision-proof property keys. Because each symbol is unique, two independent libraries can both add a property to the same shared object without ever clashing. Symbol-keyed properties are also excluded from for...in, Object.keys, and JSON.stringify, so they are great for internal metadata; you read them via Object.getOwnPropertySymbols or by holding the symbol itself. Importantly, that is hidden, not private or secure — reflection can still find them. There is also a global registry: Symbol.for("key") returns the same shared symbol everywhere for that key, and Symbol.keyFor gives the key back, which is how you share symbols across modules or realms. The second big use is the well-known symbols, which are the language\'s official extension points. Symbol.iterator makes an object work with for...of, spread, and destructuring; Symbol.asyncIterator powers for-await-of; Symbol.toPrimitive controls how an object coerces in arithmetic versus string contexts; Symbol.hasInstance customizes instanceof; and Symbol.toStringTag changes the Object.prototype.toString output. One safety detail: a symbol will not implicitly coerce to a string — concatenation throws — so you convert explicitly with String(sym). In production they show up as React\'s element brand, Node\'s stream iteration, and library internal tags.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Symbols give collision-free, enumeration-hidden keys but are less discoverable and harder to serialize/debug than string keys.',
      'Module-local symbols are unforgeable (good for brands/trust) but cannot be shared across realms; registry symbols share but become forgeable via Symbol.for.',
    ],
    edgeCases: [
      'Implicit string coercion of a symbol throws a TypeError; only explicit String()/toString()/.description work.',
      'Own enumerable symbol properties ARE copied by spread and Object.assign, even though they are skipped by Object.keys/JSON — an easy-to-miss asymmetry.',
      'new Symbol() throws; Symbol is callable but not constructable.',
      'Symbol.for symbols persist for the program lifetime in the global registry, unlike GC-eligible local symbols.',
    ],
    runtimeBehavior: [
      'Built-in operations look up well-known symbols on operands (for...of → Symbol.iterator, coercion → Symbol.toPrimitive, instanceof → Symbol.hasInstance).',
      'Symbol comparison is identity-based; there is no value equality across separately created symbols.',
      'Reflect.ownKeys returns string keys first, then symbol keys, reflecting their ordered storage.',
    ],
    scalability: [
      'In large plugin ecosystems, symbol keys (and provide/inject tokens) prevent the namespace collisions that string keys cause as the codebase grows.',
      'Cross-realm/microfrontend code needs registry symbols (Symbol.for) or shared modules for protocol interoperability, since local symbols differ per realm.',
    ],
    productionConcerns: [
      'Brand/trust checks using registry symbols can be spoofed; prefer module-local symbols for security-relevant branding.',
      'Data accidentally stored under symbol keys silently disappears from JSON APIs and logs — a subtle data-loss class of bug.',
      'Reflection-heavy frameworks must remember to walk symbol keys (Reflect.ownKeys) or they will miss symbol-tagged metadata.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Symbol = unique, immutable primitive; typeof → "symbol".',
    'Create with Symbol(desc); description is a label, not identity.',
    'Never use new Symbol() — it throws.',
    'Symbol("x") !== Symbol("x"); always unique.',
    'Symbol.for("x") === Symbol.for("x") via global registry; Symbol.keyFor reverses it.',
    'Symbol keys are skipped by for...in, Object.keys, JSON.stringify.',
    'Read symbol keys via Object.getOwnPropertySymbols / Reflect.ownKeys.',
    'Hidden, NOT secure — reflection can reveal them.',
    'Well-known: iterator (for...of), asyncIterator, toPrimitive (coercion), hasInstance (instanceof), toStringTag.',
    'Spread/Object.assign DO copy own enumerable symbol keys.',
    'Implicit string coercion throws → use String(sym).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create two symbols with the same description and prove they are not equal; also show typeof.',
      hint: 'Symbol() always returns a fresh value.',
      solution: {
        lang: 'js',
        code: `const a = Symbol('id')
const b = Symbol('id')
console.log(a === b)   // false
console.log(typeof a)  // "symbol"
console.log(a.description, b.description) // "id" "id"`,
        explanation: [
          'Each Symbol() call yields a unique value regardless of description.',
          'typeof a symbol is "symbol".',
          'The description matches but does not make them equal.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add a hidden metadata property to an object using a symbol and show it does not appear in Object.keys or JSON.stringify, but is readable.',
      hint: 'Use a computed symbol key and getOwnPropertySymbols to reveal it.',
      solution: {
        lang: 'js',
        code: `const META = Symbol('meta')
const obj = { name: 'Sam', [META]: { role: 'admin' } }

console.log(Object.keys(obj))             // ["name"]
console.log(JSON.stringify(obj))          // {"name":"Sam"}
console.log(obj[META])                    // { role: "admin" }
console.log(Object.getOwnPropertySymbols(obj)) // [Symbol(meta)]`,
        explanation: [
          'The symbol key holds metadata invisible to normal enumeration and JSON.',
          'You read it directly via the held symbol reference.',
          'getOwnPropertySymbols exposes it for reflection — so it is hidden, not private.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make a class Range(start, end) iterable so `[...new Range(1, 3)]` returns [1, 2, 3].',
      hint: 'Implement [Symbol.iterator] returning an object with next().',
      solution: {
        lang: 'js',
        code: `class Range {
  constructor(start, end) { this.start = start; this.end = end }
  [Symbol.iterator]() {
    let current = this.start
    const end = this.end
    return {
      next() {
        return current <= end
          ? { value: current++, done: false }
          : { value: undefined, done: true }
      }
    }
  }
}
console.log([...new Range(1, 3)])       // [1, 2, 3]
for (const n of new Range(1, 3)) console.log(n) // 1 2 3`,
        explanation: [
          'Defining [Symbol.iterator] satisfies the iteration protocol.',
          'for...of and spread call it to get an iterator, then call next() until done.',
          'Each next() yields the standard { value, done } shape.',
          'This is how built-in iterables like arrays expose iteration.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build an object that returns a number in arithmetic and a formatted string in template literals using a well-known symbol; also give it a custom toString tag.',
      hint: 'Implement [Symbol.toPrimitive] (branch on hint) and [Symbol.toStringTag].',
      solution: {
        lang: 'js',
        code: `const price = {
  amount: 19.99,
  [Symbol.toPrimitive](hint) {
    return hint === 'string' ? '$' + this.amount : this.amount
  },
  get [Symbol.toStringTag]() { return 'Price' }
}
console.log(price * 2)                          // 39.98 (number hint)
console.log(\`Total: \${price}\`)                  // "Total: $19.99" (string hint)
console.log(Object.prototype.toString.call(price)) // "[object Price]"`,
        explanation: [
          'Symbol.toPrimitive receives the coercion hint and returns number or formatted string accordingly.',
          'Arithmetic uses the number/default branch; template literals use the string branch.',
          'Symbol.toStringTag customizes the [object X] label.',
          'These well-known symbols are the official way to control built-in coercion behavior.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Symbols unlock the language\'s extension points — iteration, coercion, instanceof, toString tags — and give you collision-proof keys for safe metadata. Mastering them signals you understand JavaScript beyond strings-and-objects, at the protocol level.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep — maybe "what is a Symbol and is it unique?". Product companies (Zoho, Flipkart, Razorpay) ask about symbol keys, the global registry, and making objects iterable. FAANG-level rounds probe well-known symbols (toPrimitive/iterator/hasInstance), the hidden-vs-private distinction, and brand-check security.',
    whatInterviewersExpect:
      'They expect you to state uniqueness and typeof, explain collision-proof non-enumerable keys (and that they are hidden, not secure), distinguish Symbol() from Symbol.for(), and demonstrate at least one well-known symbol such as implementing Symbol.iterator or Symbol.toPrimitive.',
  },
}

export default symbol
