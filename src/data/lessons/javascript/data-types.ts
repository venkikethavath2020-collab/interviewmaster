import type { ConceptLesson } from '../../../types/lesson'

const dataTypes: ConceptLesson = {
  // 1. Concept Summary
  slug: 'data-types',
  name: 'Data Types',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Data types are the alphabet of the language — every value you ever touch is one of a small, fixed set, and knowing them prevents constant confusion.',
    'The primitive vs object split explains copying, equality, and mutation behavior that otherwise looks like magic.',
    'typeof quirks (typeof null === "object") and the seven primitives are bread-and-butter interview checks.',
    'Misunderstanding types is the root of coercion bugs, NaN surprises, and "why is this undefined?" debugging sessions.',
    'A clear type model is the foundation for everything above it: coercion, equality, TypeScript, and JSON serialization.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Data types are like different kinds of containers: a number cup, a word box, a yes/no switch, and a big toy chest for everything else.',
    story: [
      'Imagine you have different containers for different things: a cup for numbers, a box for words, and a little switch that is either ON or OFF.',
      'Each container can only really hold its own kind of thing, and you treat them differently — you add numbers in cups, you join words in boxes.',
      'Some things are tiny and simple, so you just keep them in your pocket (these are "primitives" like numbers and words).',
      'Other things are big collections — like a toy chest full of toys — and instead of carrying the whole chest, you carry a map to where it is (these are "objects"). Knowing which container you are holding tells you what you can do with it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every value in JavaScript has a type, which tells you what kind of thing it is and what you can do with it.',
    'There are two big families: primitives (simple single values like numbers, text strings, and true/false) and objects (collections like arrays and objects that group many values).',
    'Primitives are copied by their value, so each copy is independent; objects are shared by a reference, like sharing a link to the same document.',
    'You can ask the type of any value with the typeof operator, which is handy for checking what you are working with.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JavaScript has seven primitive types — string, number, boolean, undefined, null, bigint, and symbol — and one non-primitive type, object (which includes arrays, functions, dates, etc.). Primitives are immutable and compared by value; objects are mutable and compared by reference.',
    how: 'You create primitives with literals (e.g. "hi", 42, true) and objects with {} / [] / new. Use typeof to inspect most types, with the known quirks: typeof null is "object" and typeof a function is "function". Arrays are objects, so use Array.isArray() to detect them.',
    why: 'The type determines copying, equality, and mutability behavior, so knowing a value\'s type tells you how it will behave when assigned, compared, or passed to a function.',
    code: {
      label: 'The types and how to check them',
      lang: 'js',
      code: `typeof 'hi'        // 'string'\ntypeof 42          // 'number'\ntypeof true        // 'boolean'\ntypeof undefined   // 'undefined'\ntypeof 10n         // 'bigint'\ntypeof Symbol()    // 'symbol'\ntypeof null        // 'object'  <- historical bug\ntypeof {}          // 'object'\ntypeof function(){} // 'function'\nArray.isArray([])  // true (arrays are objects)`,
      explanation: [
        'The seven primitive types each report a distinct typeof, except null.',
        'typeof null returns "object" — a famous, never-fixed historical quirk.',
        'Functions are objects but typeof reports "function" specifically.',
        'Arrays report "object", so you use Array.isArray() to detect them.',
        'These typeof results are a classic quick interview check.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JavaScript is dynamically typed with eight types: seven primitives — string, number, boolean, undefined, null, bigint, and symbol — and the object type. Primitives are immutable values compared by value and stored/copied directly; objects are mutable, heap-allocated, and held and compared by reference. Functions and arrays are specialized objects. The typeof operator returns the type as a string, with two historical/special cases: typeof null is "object" and typeof a callable is "function". Primitive values are auto-boxed into wrapper objects (String, Number, Boolean) when a method is accessed, then discarded.',

  // 7. Internal Working
  internalWorking: [
    'When the engine evaluates a literal, it tags the value with its type; primitives store their bytes inline while objects are allocated on the heap with a reference held by the variable.',
    'typeof inspects the internal type tag of a value and returns a string; the null case returns "object" due to an original implementation detail where null shared a type tag with objects.',
    'When you call a method on a primitive (e.g. "hi".toUpperCase()), the engine temporarily wraps it in the corresponding object wrapper, runs the method, then discards the wrapper — this is auto-boxing.',
    'Because primitives are immutable, operations that "change" them actually produce new values rather than mutating in place.',
    'Objects, being references, can be mutated in place, and multiple variables can reference the same object, so changes are visible through all of them.',
    'Type checks like Array.isArray and Object.prototype.toString.call read deeper internal markers than typeof, allowing precise discrimination among object subtypes.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `                  JavaScript values
                         │
        ┌────────────────┴────────────────┐
     PRIMITIVES (by value, immutable)   OBJECT (by reference, mutable)
        │                                  │
   string  number  boolean                ┌──────────────┐
   undefined  null                        │ {} [] fn date│
   bigint  symbol                         │ Map Set ...  │
        │                                  └──────────────┘
   typeof -> 'string','number',...   typeof -> 'object' (or 'function')
   (typeof null === 'object'  <- quirk)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'PRIMITIVES: stored by value — the variable directly holds the data (small, fixed-size); copying makes an independent duplicate.',
    'OBJECTS: stored on the heap; the variable holds a reference (address), so copying duplicates the reference, not the data.',
    'IMMUTABILITY: primitive operations create new values; you never mutate a primitive in place.',
    'AUTO-BOXING: a wrapper object is created transiently when calling a method on a primitive, then garbage collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — primitive immutability',
      lang: 'js',
      code: `let s = 'hello'\ns.toUpperCase()      // 'HELLO' (returns a NEW string)\nconsole.log(s)       // 'hello' (original unchanged)\n\nlet n = 5\nn + 1                // 6 (new value)\nconsole.log(n)       // 5`,
      explanation: [
        'String methods return new strings; the original is never modified.',
        'Primitives are immutable, so toUpperCase() cannot change s in place.',
        'Arithmetic produces new numbers rather than mutating n.',
        'This immutability is why primitives are safely copied by value.',
      ],
    },
    intermediate: {
      label: 'Intermediate — null vs undefined and typeof quirks',
      lang: 'js',
      code: `let a            // declared, not assigned -> undefined\nlet b = null     // intentional "no value"\nconsole.log(typeof a)  // 'undefined'\nconsole.log(typeof b)  // 'object'  (quirk!)\nconsole.log(a == b)    // true  (loose: both "empty")\nconsole.log(a === b)   // false (different types)`,
      explanation: [
        'undefined means "not assigned yet"; null means "intentionally empty".',
        'typeof null is the famous "object" quirk; typeof undefined is correctly "undefined".',
        'Loose equality treats null and undefined as equal to each other.',
        'Strict equality keeps them distinct because their types differ.',
      ],
    },
    advanced: {
      label: 'Advanced — reliable type detection',
      lang: 'js',
      code: `function typeOf(v) {\n  if (v === null) return 'null'\n  if (Array.isArray(v)) return 'array'\n  return typeof v\n}\ntypeOf(null)   // 'null'\ntypeOf([])     // 'array'\ntypeOf({})     // 'object'\n// or precise: Object.prototype.toString.call([]) -> '[object Array]'`,
      explanation: [
        'typeof alone cannot distinguish null, arrays, or dates from generic objects.',
        'Special-casing null and using Array.isArray gives accurate results.',
        'Object.prototype.toString.call() returns precise tags like [object Date].',
        'This pattern is common in libraries that need exact runtime type checks.',
      ],
    },
    realProject: {
      label: 'Real project — validating an API payload in Node',
      lang: 'js',
      code: `function validateUser(payload) {\n  if (typeof payload !== 'object' || payload === null) throw new Error('body must be object')\n  if (typeof payload.name !== 'string') throw new Error('name must be string')\n  if (typeof payload.age !== 'number' || Number.isNaN(payload.age)) throw new Error('age must be a number')\n  if (!Array.isArray(payload.roles)) throw new Error('roles must be an array')\n  return true\n}`,
      explanation: [
        'Real handlers must check types of untrusted input before using it.',
        'The `payload === null` guard is needed because typeof null is "object".',
        'Number.isNaN catches the number-typed-but-NaN case that typeof alone misses.',
        'Array.isArray is the correct way to confirm an array field, since arrays are objects.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the data types in JavaScript?',
      answer: 'Seven primitives — string, number, boolean, undefined, null, bigint, symbol — and the object type (which includes arrays, functions, dates, Map, Set, etc.).',
      explanation: 'A complete answer lists all seven primitives and notes object as the non-primitive category.',
    },
    {
      level: 'beginner',
      question: 'What does typeof null return and why?',
      answer: 'It returns "object", which is a long-standing historical bug from the original implementation where null shared a type tag with objects. It was never fixed to avoid breaking existing code.',
      explanation: 'Knowing it is a quirk (and the reason) is a classic quick check.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between null and undefined?',
      answer: 'undefined means a variable has been declared but not assigned (the default absence of value); null is an intentional assignment representing "no value". typeof undefined is "undefined" while typeof null is "object", and null == undefined is true but null === undefined is false.',
      explanation: 'The intent difference plus the equality behavior is what interviewers want.',
    },
    {
      level: 'intermediate',
      question: 'How do primitives differ from objects in copying and comparison?',
      answer: 'Primitives are immutable and copied/compared by value, so two equal primitives are ===. Objects are mutable and held by reference, so copying duplicates the reference and two distinct objects are never === even if identical in shape.',
      explanation: 'This ties data types to the stack/heap and reference model.',
    },
    {
      level: 'advanced',
      question: 'How would you reliably detect arrays, null, and dates given typeof\'s limits?',
      answer: 'Use Array.isArray() for arrays, an explicit === null check for null, and Object.prototype.toString.call(value) for precise tags like "[object Date]". typeof alone collapses all of these into "object".',
      explanation: 'Senior signal: knowing the precise tooling beyond typeof.',
    },
    {
      level: 'senior',
      question: 'What is auto-boxing and why can you call methods on primitives?',
      answer: 'When you access a method on a primitive, the engine transiently wraps it in the corresponding object wrapper (String, Number, Boolean), invokes the method, and discards the wrapper. That is why "abc".length works even though the primitive itself has no properties.',
      explanation: 'Auto-boxing explains the primitive/wrapper relationship and is a deeper-knowledge probe.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why is NaN of type number, and how do you test for it? (Number.isNaN)',
    'What is a Symbol used for and why is it primitive?',
    'When would you use BigInt instead of number?',
    'Why are arrays and functions both "object" under the hood?',
    'How does JSON.stringify treat undefined, functions, and symbols?',
    'How do primitive wrapper objects differ from primitives (e.g. new String("x"))?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying on typeof to detect null or arrays.',
      why: 'typeof null is "object" and typeof [] is "object", so neither is distinguishable this way.',
      fix: 'Use `value === null` and Array.isArray(value); use Object.prototype.toString.call for precise tags.',
    },
    {
      mistake: 'Confusing null and undefined.',
      why: 'They differ in intent (explicit empty vs not-assigned) and in strict equality, which causes subtle bugs.',
      fix: 'Use undefined for "not set", null for "intentionally empty", and prefer === to keep them distinct.',
    },
    {
      mistake: 'Treating NaN like a normal number in comparisons.',
      why: 'NaN is a number but is not equal to itself (NaN === NaN is false).',
      fix: 'Detect it with Number.isNaN(value), never with === comparisons.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Request validation checks types of untrusted input (typeof, Array.isArray, Number.isNaN) before processing; libraries like Zod formalize these runtime type guarantees.' },
    { area: 'React', detail: 'Conditional rendering and prop handling depend on distinguishing undefined (not provided) from null (explicitly empty) and on safe type checks before calling methods.' },
    { area: 'Vue', detail: 'Props with default values vs null vs undefined drive reactivity and template guards; correct type assumptions prevent render-time errors.' },
    { area: 'Backend', detail: 'Serialization layers must handle that JSON drops undefined, functions, and symbols, and that BigInt cannot be JSON.stringify\'d without a replacer.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Primitives are cheap: stored by value, no heap allocation, fast to compare.',
      'Stable, monomorphic types let the engine optimize property access and arithmetic (hidden classes, inline caches).',
    ],
    bad: [
      'Mixing types in a variable or array (polymorphism) can deoptimize hot paths.',
      'Creating wrapper objects explicitly (new Number(...)) wastes memory and causes surprising comparisons.',
    ],
    optimizations: [
      'Keep variables and array elements a consistent type so the engine stays optimized.',
      'Use primitive literals, not wrapper constructors (number, not new Number).',
      'Use Number.isNaN/Number.isInteger for correct, fast numeric checks.',
      'Prefer Array.isArray and === null over typeof for reliable, branch-predictable checks.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Trusting the type of untrusted input (e.g. assuming a field is a string/number) leads to injection, crashes, or type-confusion bugs.',
      'Coercion surprises (e.g. an attacker sending an array or object where a string is expected) can bypass naive checks.',
    ],
    bestPractices: [
      'Always validate the runtime type of external input before use (typeof + Array.isArray + null checks, or a schema validator).',
      'Reject unexpected types explicitly rather than coercing them silently.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['var-let-const', 'primitive-vs-reference'],
    nextConcepts: ['null-vs-undefined', 'typeof-instanceof', 'type-coercion', 'truthy-falsy', 'symbol'],
    dependencyNote:
      'Data types underpin the whole types-coercion spine: they build on primitive-vs-reference and lead into null-vs-undefined, typeof-instanceof, type-coercion, and the special types like symbol and bigint.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a tree: top node "values", split into PRIMITIVES and OBJECT.',
      'List the seven primitives under the left branch.',
      'Under OBJECT write arrays, functions, dates, Map/Set.',
      'Annotate "primitives = by value, immutable" and "objects = by reference, mutable".',
      'Write the typeof results, circling the two quirks: typeof null = object, typeof fn = function.',
      'Note the reliable checks: Array.isArray, === null, Number.isNaN.',
    ],
    diagram: `  values
   ├─ PRIMITIVES (by value): string number boolean
   │     undefined null bigint symbol
   └─ OBJECT (by reference): {} [] fn date Map Set
  typeof null === 'object'  | typeof fn === 'function'
  Array.isArray([]) === true`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript has seven primitives — string, number, boolean, undefined, null, bigint, symbol — and the object type (arrays, functions, dates, etc.). Primitives are immutable and compared by value; objects are mutable and compared by reference. typeof reports the type, with two quirks: typeof null is "object" and typeof a function is "function". Use Array.isArray for arrays, === null for null, and Number.isNaN for NaN. Knowing a value\'s type tells you how it copies, compares, and mutates.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript is dynamically typed and has eight types: seven primitives and the object type. The primitives are string, number, boolean, undefined, null, bigint, and symbol; everything else — arrays, functions, dates, Map, Set — is an object. The most important distinction is that primitives are immutable and handled by value, while objects are mutable and handled by reference. So when I copy or pass a primitive I get an independent value, but when I copy or pass an object I copy a reference, and both names then point at the same thing. typeof tells me the type as a string, but it has two well-known special cases worth calling out: typeof null returns "object", a historical bug that was never fixed for compatibility, and typeof a function returns "function" even though functions are technically objects. Because of that, typeof alone is not enough for precise checks — I use Array.isArray for arrays, an explicit equals-null check for null, and Object.prototype.toString.call for exact tags like dates. A couple of related gotchas: undefined means "not assigned yet" while null is an intentional empty value, and NaN is of type number yet not equal to itself, so I test it with Number.isNaN. There is also auto-boxing — when I call a method on a primitive, the engine briefly wraps it in a String or Number object, runs the method, and throws the wrapper away, which is why "hello".toUpperCase() works. Knowing a value\'s type up front tells me exactly how it will copy, compare, and mutate.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Dynamic typing is flexible and concise but pushes type errors to runtime; TypeScript trades some flexibility for compile-time safety.',
      'Coercion is convenient but error-prone; explicit type checks add code but prevent type-confusion bugs.',
    ],
    edgeCases: [
      'typeof null === "object" and typeof NaN === "number" trip up naive checks.',
      'BigInt and number cannot be mixed in arithmetic without explicit conversion, and BigInt is not JSON-serializable by default.',
      'Symbol values are unique and not enumerable in normal iteration, useful for collision-free keys.',
    ],
    runtimeBehavior: [
      'Primitives auto-box transiently when methods are accessed; the wrapper is discarded immediately.',
      'Engines optimize monomorphic (single-type) variables/arrays via hidden classes and inline caches; mixing types deoptimizes.',
      'Object subtype detection requires internal markers (Array.isArray, toStringTag), not typeof.',
    ],
    scalability: [
      'Validating types at trust boundaries (API inputs) with schema validators scales better than ad-hoc checks across a large codebase.',
      'Consistent typing across hot arrays/objects keeps engine optimizations stable under load.',
    ],
    productionConcerns: [
      'Always validate untrusted input types to avoid crashes and type-confusion vulnerabilities.',
      'Be explicit about null vs undefined in APIs to avoid ambiguous "missing" semantics.',
      'Account for JSON dropping undefined/functions/symbols and choking on BigInt during serialization.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '7 primitives: string, number, boolean, undefined, null, bigint, symbol.',
    'Everything else is object (arrays, functions, dates, Map, Set).',
    'Primitives: immutable, by value. Objects: mutable, by reference.',
    'typeof null === "object" (historical quirk).',
    'typeof function === "function"; arrays are "object".',
    'Detect arrays with Array.isArray; null with === null.',
    'NaN is type number; test with Number.isNaN.',
    'undefined = not assigned; null = intentional empty.',
    'null == undefined is true; null === undefined is false.',
    'Auto-boxing lets you call methods on primitives.',
    'JSON drops undefined/functions/symbols; BigInt is not JSON-serializable by default.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function that returns the type string of a value but reports null as "null" and arrays as "array".',
      hint: 'Special-case null and use Array.isArray.',
      solution: {
        lang: 'js',
        code: `function kind(v) {\n  if (v === null) return 'null'\n  if (Array.isArray(v)) return 'array'\n  return typeof v\n}\nkind(null) // 'null'\nkind([1])  // 'array'\nkind(42)   // 'number'`,
        explanation: [
          'The null check is needed because typeof null is "object".',
          'Array.isArray distinguishes arrays, which typeof reports as "object".',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Predict and explain: `console.log(NaN === NaN, Number.isNaN(NaN), typeof NaN)`',
      hint: 'NaN is a number that is not equal to itself.',
      solution: {
        lang: 'js',
        code: `console.log(NaN === NaN)        // false\nconsole.log(Number.isNaN(NaN)) // true\nconsole.log(typeof NaN)        // 'number'`,
        explanation: [
          'NaN is the only value not equal to itself, so === fails.',
          'Number.isNaN is the correct way to detect it.',
          'Despite meaning "not a number", its type is number.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show how auto-boxing lets a primitive use a method, and why `new String("x") === "x"` is false.',
      hint: 'Wrapper objects are objects, not primitives.',
      solution: {
        lang: 'js',
        code: `console.log('hello'.length)          // 5 (auto-boxed to String wrapper)\nconst wrapped = new String('x')\nconsole.log(typeof wrapped)          // 'object'\nconsole.log(wrapped === 'x')         // false (object vs primitive)\nconsole.log(wrapped.valueOf() === 'x') // true (unwrapped value)`,
        explanation: [
          'Accessing .length transiently boxes the primitive into a String wrapper.',
          'new String creates a persistent object wrapper, which is type "object".',
          'An object never strictly equals a primitive, hence false.',
          'valueOf() extracts the primitive, which does equal "x".',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Validate that an input is a non-null object with a numeric "id" and a string "name", returning clear errors.',
      hint: 'Guard null, use typeof and Number.isNaN.',
      solution: {
        lang: 'js',
        code: `function check(input) {\n  if (typeof input !== 'object' || input === null || Array.isArray(input))\n    throw new Error('expected a plain object')\n  if (typeof input.id !== 'number' || Number.isNaN(input.id))\n    throw new Error('id must be a valid number')\n  if (typeof input.name !== 'string')\n    throw new Error('name must be a string')\n  return true\n}`,
        explanation: [
          'The object guard must exclude null (typeof null is "object") and arrays.',
          'Number.isNaN rejects the number-but-NaN case.',
          'Explicit string check rejects coercible-but-wrong types.',
          'Clear errors make the validation usable at a trust boundary.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Data types are the foundation everything else stands on. A confident, complete answer (seven primitives plus object, value vs reference, typeof quirks) signals strong fundamentals and prevents a huge class of everyday bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "list the data types" and "what does typeof null return?". Product companies (Zoho, Flipkart, Razorpay) probe null vs undefined and reliable type detection. FAANG-level interviews ask about auto-boxing, BigInt/Symbol, and engine type optimizations.',
    whatInterviewersExpect:
      'They expect all seven primitives plus object, the value-vs-reference distinction, the typeof quirks (null, function, arrays), correct detection tools (Array.isArray, Number.isNaN), and the null-vs-undefined difference.',
  },
}

export default dataTypes
