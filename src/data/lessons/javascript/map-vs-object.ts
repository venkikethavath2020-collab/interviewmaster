import type { ConceptLesson } from '../../../types/lesson'

const mapVsObject: ConceptLesson = {
  // 1. Concept Summary
  slug: 'map-vs-object',
  name: 'Map vs Object',
  category: 'iteration-collections',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Choosing Map vs Object is a real design decision: the wrong choice causes prototype-pollution bugs, key-coercion surprises, and slow iteration on hot paths.',
    'Map preserves insertion order, allows ANY key type (objects, functions), and has a clean size/iteration API — Object cannot do those cleanly.',
    'Object keys are always strings or symbols and silently collide with inherited properties like toString or __proto__, a classic security and correctness trap.',
    'Interviewers ask this to see if you understand that "just use an object as a dictionary" has hidden costs and when a Map is the principled choice.',
    'It connects to performance (frequent add/delete favors Map), serialization (JSON only handles objects), and reactivity quirks in frameworks.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An Object is a labelled toy box; a Map is a special drawer where the label can be ANYTHING, even another toy.',
    story: [
      'Imagine you have a toy box where every drawer has a paper label with a word written on it, like "cars" or "blocks".',
      'That works great until you want a drawer labelled with a whole toy instead of a word — the paper label can only hold words, so you are stuck.',
      'A Map is a magic cabinet where the label on each drawer can be a word, a number, or even another toy itself.',
      'The magic cabinet also remembers exactly the order you added drawers and can instantly tell you how many drawers it has — the plain toy box cannot do those things easily.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An Object stores values under keys, but those keys are always turned into text (strings) or special symbols.',
    'A Map also stores values under keys, but the keys can be any value at all — numbers, objects, functions — kept exactly as they are.',
    'A Map remembers the order you added things and tells you its size with .size, while an Object needs extra steps to count its keys.',
    'You add/read with map.set(key, value) and map.get(key), whereas an object uses obj.key or obj[key]. Each is better for different jobs.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Both Map and Object associate keys with values, but a Map is a dedicated collection that accepts any value as a key, preserves insertion order, exposes .size, and is directly iterable, while an Object is a general-purpose record whose keys are coerced to strings (or symbols) and which inherits properties from its prototype.',
    how: 'Object: obj[key] = value, read obj[key], delete obj[key]. Map: map.set(key, value), map.get(key), map.has(key), map.delete(key), map.size, and iterate with for...of, map.keys(), map.values(), map.entries().',
    why: 'Use Object for fixed, known-shape records and JSON; use Map for dynamic dictionaries, non-string keys, frequent additions/deletions, or when order and size matter.',
    code: {
      label: 'Same idea, two tools',
      lang: 'js',
      code: `// Object as a dictionary\nconst objCounts = {}\nobjCounts['apple'] = 3\nconsole.log(objCounts['apple'])      // 3\nconsole.log(Object.keys(objCounts).length) // size = 1\n\n// Map as a dictionary\nconst mapCounts = new Map()\nmapCounts.set('apple', 3)\nconsole.log(mapCounts.get('apple'))  // 3\nconsole.log(mapCounts.size)          // 1\n\n// Map allows object keys; Object cannot\nconst keyObj = { id: 1 }\nmapCounts.set(keyObj, 'metadata')\nconsole.log(mapCounts.get(keyObj))   // 'metadata'`,
      explanation: [
        'Both store apple -> 3, but the Map exposes .size directly while the object needs Object.keys(...).length.',
        'Map uses explicit set/get methods; the object uses bracket/dot access.',
        'The Map can use an OBJECT as a key and retrieve by reference — an object dictionary would coerce that key to the string "[object Object]".',
        'This last point is the headline difference: arbitrary key types.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Object is the fundamental aggregate type whose own enumerable string/symbol keys map to values, with a prototype chain that contributes inherited properties. Map is a built-in keyed collection (ES2015) that stores key-value pairs where keys may be any value (compared by SameValueZero, so NaN matches NaN), maintains insertion order, exposes O(1) average get/set/has/delete and an O(1) size accessor, and is iterable, yielding [key, value] pairs. Object property keys are always coerced to strings or kept as symbols and are subject to prototype shadowing; Map has no prototype-pollution surface for its keys.',

  // 7. Internal Working
  internalWorking: [
    'Object: the engine stores properties; for stable, predictable shapes it uses hidden classes (shapes) and inline caches, making known-property access very fast; adding/deleting many dynamic keys can deoptimize this into a slower dictionary mode.',
    'Object key coercion: any non-symbol key is converted to a string at insertion (1 becomes "1", an object becomes "[object Object]"), so distinct object keys collide.',
    'Object iteration order: integer-like keys come first in ascending numeric order, then string keys in insertion order, then symbols — NOT pure insertion order.',
    'Map: implemented as a hash table keyed by SameValueZero equality, storing entries with their insertion order recorded so iteration is strictly insertion-ordered.',
    'Map.size reads a maintained count in O(1); add/get/has/delete are amortized O(1) regardless of how dynamic the keys are.',
    'Map keys hold real references; an object used as a key keeps that object reachable (use WeakMap if you want keys to be garbage-collectable).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `             OBJECT (record)                 MAP (collection)
        ┌───────────────────────┐        ┌───────────────────────────┐
   key  │ "name"  -> "Sam"       │   key  │  "name"     -> "Sam"       │
   type │ "age"   -> 30          │   type │  42 (number)-> "answer"    │
        │ keys: string | symbol  │        │  {id:1}     -> {meta}      │
        │ has prototype chain ───┼──►...  │  fn         -> handler     │
        │ order: ints, then ins. │        │  keys: ANY value           │
        │ .length? no (Object.keys)       │  order: strict insertion   │
        └───────────────────────┘        │  .size: O(1)               │
                                          │  no prototype keys         │
                                          └───────────────────────────┘

   Object keys collide: obj[1] === obj["1"], obj[{}] === obj["[object Object]"]
   Map keys do not:    map.set(1,a); map.set("1",b)  => two distinct entries`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Both Map and Object live on the heap; a variable holds a reference to the collection.',
    'An object key that is itself an object is coerced to a string, so the original object reference is NOT retained by the dictionary.',
    'A Map key that is an object IS held by reference, keeping that object alive (a leak risk for long-lived Maps) — WeakMap avoids this by holding keys weakly.',
    'Objects in "dictionary mode" (many dynamic keys) use a slower internal hash representation, trading the fast hidden-class path for flexibility.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — counting with each',
      lang: 'js',
      code: `const words = ['a', 'b', 'a', 'c', 'b', 'a']\n\n// Map version\nconst counts = new Map()\nfor (const w of words) {\n  counts.set(w, (counts.get(w) ?? 0) + 1)\n}\nconsole.log([...counts]) // [['a',3],['b',2],['c',1]] (insertion order)`,
      explanation: [
        'We tally occurrences using get with a nullish fallback and set.',
        'Map.size and direct iteration make frequency counting clean.',
        'Spreading a Map yields [key, value] pairs in insertion order.',
        'An object would also work here, but the Map gives order guarantees and .size for free.',
      ],
    },
    intermediate: {
      label: 'Intermediate — why object keys collide',
      lang: 'js',
      code: `const obj = {}\nobj[1] = 'number one'\nobj['1'] = 'string one'\nconsole.log(obj[1])           // 'string one' — collision! 1 -> "1"\n\nconst k1 = { id: 1 }\nconst k2 = { id: 2 }\nconst m = new Map()\nm.set(k1, 'A').set(k2, 'B')\nconsole.log(m.get(k1), m.get(k2)) // 'A' 'B' — distinct object keys`,
      explanation: [
        'Object coerces the number key 1 to the string "1", so the second assignment overwrites the first.',
        'There is no way to keep number 1 and string "1" as separate object keys.',
        'A Map keeps any key type as-is, so two different objects are two different entries.',
        'This is the decisive reason to use a Map when keys are non-strings.',
      ],
    },
    advanced: {
      label: 'Advanced — prototype pollution risk with object dictionaries',
      lang: 'js',
      code: `// Untrusted user input used as keys in a plain object\nfunction buildDict(pairs) {\n  const dict = {}\n  for (const [k, v] of pairs) dict[k] = v\n  return dict\n}\n\nconst dict = buildDict([['__proto__', { admin: true }]])\nconsole.log(({}).admin) // could be polluted in vulnerable patterns\n\n// Safer: a Map (or Object.create(null)) has no inherited keys\nconst safe = new Map([['__proto__', { admin: true }]])\nconsole.log(safe.get('__proto__')) // { admin: true } — just data`,
      explanation: [
        'Plain objects inherit from Object.prototype, so keys like __proto__, constructor, and toString are dangerous when keys come from user input.',
        'A Map treats "__proto__" as an ordinary key with no special meaning, eliminating prototype-pollution via assignment.',
        'Object.create(null) (a null-prototype object) is the object-based mitigation when you still want object syntax.',
        'For user-controlled keys, prefer Map or a null-prototype object.',
      ],
    },
    realProject: {
      label: 'Real project — caching by request object in Node/Vue',
      lang: 'js',
      code: `// Cache derived data keyed by a component/request OBJECT\nconst cache = new WeakMap()\n\nfunction getProcessed(node) {\n  if (cache.has(node)) return cache.get(node)\n  const result = expensiveProcess(node) // e.g. layout, parse\n  cache.set(node, result)\n  return result\n}\n// When the node is no longer referenced elsewhere, the WeakMap entry\n// is garbage-collected automatically — no manual cleanup, no leak.`,
      explanation: [
        'Keying a cache by an object (a DOM node, a request, a component instance) is impossible with a plain object dictionary.',
        'A WeakMap (object-keyed Map variant) is perfect: entries vanish when the key object is collected.',
        'This pattern powers per-instance caches in libraries and frameworks without manual cleanup.',
        'A regular Map would keep the key object alive forever, leaking memory.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the main difference between a Map and an Object?',
      answer: 'A Map can use any value as a key (including objects and functions), preserves insertion order, and gives .size directly. An Object coerces keys to strings/symbols, has a prototype chain, and needs Object.keys to count.',
      explanation: 'A solid answer names key types, ordering, size, and the prototype distinction.',
    },
    {
      level: 'beginner',
      question: 'How do you get the number of entries in each?',
      answer: 'Map: map.size (a property). Object: Object.keys(obj).length, which allocates an array and counts own enumerable string keys.',
      explanation: 'Highlights that Map size is O(1) and built-in while object counting is indirect.',
    },
    {
      level: 'intermediate',
      question: 'Why can using a plain object as a dictionary for user input be dangerous?',
      answer: 'Keys like __proto__, constructor, and prototype interact with the prototype chain and can cause prototype pollution or unexpected inherited properties. A Map or Object.create(null) avoids this since they have no inherited keys.',
      explanation: 'Connects Map vs Object to a real security concern interviewers like to probe.',
    },
    {
      level: 'intermediate',
      question: 'When would you prefer an Object over a Map?',
      answer: 'When the shape is fixed and known, when you need JSON serialization (Map does not serialize directly), when keys are simple strings, or when you want concise literal syntax and prototype methods. Objects also optimize well via hidden classes for stable shapes.',
      explanation: 'Shows balanced judgment — Map is not always the answer.',
    },
    {
      level: 'advanced',
      question: 'How are keys compared in a Map, and how does NaN behave?',
      answer: 'Map uses SameValueZero: it is like === except NaN equals NaN, and +0 and -0 are treated as the same key. So map.set(NaN, 1); map.get(NaN) returns 1, unlike with indexOf.',
      explanation: 'Tests precise knowledge of the equality algorithm, a senior-leaning detail.',
    },
    {
      level: 'senior',
      question: 'What are the performance and memory tradeoffs between Map and Object for frequently changing keys?',
      answer: 'Maps are designed for frequent add/delete with consistent O(1) operations and stable performance. Objects with many dynamic keys can fall out of the optimized hidden-class path into dictionary mode, and deleting properties is comparatively costly. For object-keyed entries, Map holds keys strongly (leak risk) whereas WeakMap holds them weakly.',
      explanation: 'Senior signal: hidden classes/dictionary mode, GC implications, and WeakMap.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you convert a Map to an object and vice versa? (Object.fromEntries / Object.entries)',
    'How do you serialize a Map to JSON?',
    'What is the difference between Map and WeakMap?',
    'Why is object iteration order not purely insertion order?',
    'What does SameValueZero mean and where else is it used?',
    'When would Object.create(null) be the right choice?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a plain object as a dictionary with object or number keys.',
      why: 'Keys are coerced to strings, so distinct objects collide ("[object Object]") and 1 and "1" merge.',
      fix: 'Use a Map when keys are non-strings or need to stay distinct by type.',
    },
    {
      mistake: 'Accepting user-controlled keys into a plain object dictionary.',
      why: '__proto__/constructor can trigger prototype pollution or unexpected inherited values.',
      fix: 'Use a Map or Object.create(null), and validate/whitelist keys.',
    },
    {
      mistake: 'Trying to JSON.stringify a Map directly.',
      why: 'JSON.stringify(map) yields {} because Map has no enumerable own properties.',
      fix: 'Convert first: JSON.stringify([...map]) or Object.fromEntries(map) for string keys.',
    },
    {
      mistake: 'Checking key existence with obj[key] truthiness.',
      why: 'A value of 0, false, or "" reads as falsy, and inherited keys can appear present.',
      fix: 'Use Object.hasOwn(obj, key) for objects, or map.has(key) for Maps.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Maps key reactive caches or lookups by entity id; note Vue 3 reactivity supports Map/Set via reactive(), but mutations must go through set/delete to be tracked. Objects remain ideal for fixed component-state shapes.' },
    { area: 'React', detail: 'WeakMap caches derived data per object (e.g. per props instance) without leaking; Maps back memoization and id->node indexes. State objects are kept as plain objects for easy spreading and serialization.' },
    { area: 'Node.js', detail: 'Maps store per-connection or per-session state keyed by socket/request objects; WeakMaps associate metadata with framework objects. Config and JSON payloads stay as plain objects.' },
    { area: 'Backend', detail: 'In-memory caches and rate-limit counters use Maps for O(1) churn and easy size tracking; null-prototype objects are used where untrusted keys are stored as data.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Map gives stable O(1) get/set/has/delete and O(1) .size, ideal for frequent insertion/deletion.',
      'Objects with a fixed, known shape are extremely fast via hidden classes and inline caches.',
    ],
    bad: [
      'Objects with many dynamic keys can deoptimize into dictionary mode, slowing access; property delete is costly.',
      'Maps have slightly higher per-entry memory overhead and Object literal syntax is more compact for tiny fixed records.',
    ],
    optimizations: [
      'Use Map for dictionaries that grow/shrink frequently or have non-string keys.',
      'Keep object shapes stable (initialize all fields up front) so the engine keeps the hidden-class fast path.',
      'Use WeakMap for object-keyed caches so entries are collected automatically.',
      'Avoid delete on hot objects; prefer setting to undefined or using a Map.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Plain object dictionaries are vulnerable to prototype pollution when keys come from untrusted input (__proto__, constructor, prototype).',
      'Inherited properties can make a key appear present or carry an unexpected value, leading to logic bypasses.',
    ],
    bestPractices: [
      'Use Map or Object.create(null) for dictionaries built from user input.',
      'Validate/whitelist keys and reject dangerous ones; use Object.hasOwn for existence checks.',
      'Never trust that an object dictionary contains only your data — guard against inherited keys.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'data-types', 'primitive-vs-reference', 'array-methods'],
    nextConcepts: ['weakmap-weakset', 'set-operations', 'prototype', 'prototype-pollution', 'json-serialization'],
    dependencyNote:
      'Understanding objects and reference semantics is the prerequisite; Map vs Object then connects forward to WeakMap/WeakSet, Set, the prototype chain (why object keys collide), prototype pollution, and serialization.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: Object and Map.',
      'Under Object write: keys -> string/symbol, has prototype chain, order = ints then insertion, count via Object.keys.',
      'Under Map write: keys -> ANY value, no prototype keys, strict insertion order, .size O(1).',
      'Show the collision: obj[1] and obj["1"] are the same slot; map.set(1) and map.set("1") are two slots.',
      'Note WeakMap for object keys that should be collectable.',
      'Conclude: Object for fixed records/JSON, Map for dynamic dictionaries and non-string keys.',
    ],
    diagram: `   OBJECT                        MAP
   key: string|symbol            key: ANY value
   prototype chain (risk)        no inherited keys
   order: ints, then ins.        order: insertion
   size: Object.keys().length    size: .size (O(1))
   obj[1] === obj["1"]           set(1) != set("1")
   JSON-friendly                 needs conversion for JSON`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Object and Map both map keys to values, but Map keys can be any type (objects, functions), Map preserves insertion order, exposes .size in O(1), and has no prototype-pollution surface. Object keys are coerced to strings, inherit from the prototype chain, and need Object.keys to count. Use Object for fixed, known-shape records and JSON; use Map for dynamic dictionaries, non-string keys, frequent add/delete, or user-controlled keys. WeakMap is the object-keyed variant that lets keys be garbage-collected.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Both Object and Map associate keys with values, but they are tools for different jobs. An Object is the general-purpose record type: its keys are always coerced to strings or symbols, it inherits from Object.prototype, and its iteration order is integer-like keys first then string keys in insertion order. A Map is a dedicated collection: its keys can be any value, including objects and functions, kept by reference; it preserves strict insertion order; it exposes .size in constant time; and it is directly iterable yielding key-value pairs. The headline difference is key types — with an object, obj[1] and obj["1"] collide because the number is stringified, and any object key becomes "[object Object]", whereas a Map keeps them distinct. I reach for a Map when keys are non-strings, when the dictionary grows and shrinks a lot since Map gives stable O(1) operations, or when keys come from user input, because a plain object is exposed to prototype pollution through keys like __proto__. I prefer an Object when the shape is fixed and known, when I need JSON serialization since Map does not stringify directly, or when I want concise literal syntax — and stable-shaped objects optimize beautifully via hidden classes. Finally, when I want a cache keyed by an object that should not leak, I use a WeakMap so entries are collected when the key object is gone. Map keys are compared with SameValueZero, so NaN can be a usable key.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Object gives the hidden-class fast path and JSON compatibility; Map gives any-type keys, ordering, and stable churn performance.',
      'Map has higher per-entry memory and no literal syntax; Object literals are compact but risky for dynamic/user keys.',
      'WeakMap enables auto-collected object-keyed entries but is not iterable and has no size.',
    ],
    edgeCases: [
      'SameValueZero means NaN keys work and +0/-0 are unified — different from === semantics.',
      'Object integer-like keys reorder ahead of string keys, breaking the assumption of pure insertion order.',
      'JSON.stringify(map) is {}; serialization needs explicit conversion and a reviver to restore.',
      'Deleting many object properties can push the object into slow dictionary mode.',
    ],
    runtimeBehavior: [
      'Map operations are amortized O(1) via an internal hash table; size is maintained, not computed.',
      'Object property access uses inline caches when shapes are stable; dynamic keys degrade this.',
      'Map holds object keys strongly; WeakMap holds them weakly so the GC can reclaim them.',
    ],
    scalability: [
      'For large, churny dictionaries (caches, counters), Map scales more predictably than Object.',
      'For millions of fixed-shape records, arrays of stable-shape objects are most memory- and cache-efficient.',
    ],
    productionConcerns: [
      'Untrusted keys -> Map or null-prototype object to avoid prototype pollution.',
      'Long-lived Maps keyed by objects can leak; prefer WeakMap or explicit eviction.',
      'Framework reactivity for Map/Set requires going through the proper APIs to be tracked.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Object keys: strings/symbols, coerced; Map keys: any value, by reference.',
    'Map preserves insertion order; Object orders integer keys first.',
    'Map.size is O(1); Object uses Object.keys(obj).length.',
    'Map: set/get/has/delete; Object: bracket/dot, delete.',
    'Map equality: SameValueZero (NaN matches NaN).',
    'JSON: Object yes; Map needs [...map] or Object.fromEntries.',
    'User-controlled keys -> Map or Object.create(null) (prototype pollution).',
    'WeakMap = object keys, garbage-collectable, not iterable, no size.',
    'Stable-shape objects optimize via hidden classes.',
    'Frequent add/delete -> prefer Map.',
    'Existence check: map.has(k) / Object.hasOwn(obj, k).',
    'obj[1] === obj["1"]; map.set(1) and map.set("1") are distinct.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert an object { a: 1, b: 2 } to a Map, and the Map back to an object.',
      hint: 'Object.entries and Object.fromEntries.',
      solution: {
        lang: 'js',
        code: `const obj = { a: 1, b: 2 }\nconst map = new Map(Object.entries(obj)) // Map { 'a'=>1, 'b'=>2 }\nconst back = Object.fromEntries(map)     // { a: 1, b: 2 }`,
        explanation: [
          'Object.entries gives [key, value] pairs that the Map constructor accepts directly.',
          'Object.fromEntries reverses it, turning the Map back into a plain object.',
          'This round-trips cleanly only for string keys, since object keys would be stringified.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a frequency counter that returns a Map of word -> count, preserving first-seen order.',
      hint: 'Iterate and use get/set with a fallback.',
      solution: {
        lang: 'js',
        code: `function frequency(words) {\n  const counts = new Map()\n  for (const w of words) {\n    counts.set(w, (counts.get(w) ?? 0) + 1)\n  }\n  return counts\n}\nfrequency(['a','b','a']) // Map { 'a'=>2, 'b'=>1 }`,
        explanation: [
          'Map preserves the order words were first inserted.',
          'get(w) ?? 0 handles the first occurrence cleanly.',
          'Returning a Map gives the caller .size and ordered iteration for free.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Serialize a Map (with string keys) to JSON and parse it back into a Map.',
      hint: 'Spread to an array of entries for stringify; pass entries to the Map constructor on parse.',
      solution: {
        lang: 'js',
        code: `function mapToJson(map) {\n  return JSON.stringify([...map])\n}\nfunction jsonToMap(json) {\n  return new Map(JSON.parse(json))\n}\n\nconst m = new Map([['a', 1], ['b', 2]])\nconst json = mapToJson(m)        // '[["a",1],["b",2]]'\nconst restored = jsonToMap(json) // Map { 'a'=>1, 'b'=>2 }`,
        explanation: [
          'JSON has no Map type, so we serialize the array of entries instead.',
          'Spreading a Map yields [key, value] pairs that JSON can represent.',
          'On parse, the array of pairs is fed straight into the Map constructor to reconstruct it.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement an LRU-style cache get/set with a fixed capacity using a Map (relying on insertion order).',
      hint: 'On get, delete and re-set to mark as most-recently used; on overflow, delete the first key (oldest).',
      solution: {
        lang: 'js',
        code: `function createLRU(capacity) {\n  const map = new Map()\n  return {\n    get(key) {\n      if (!map.has(key)) return undefined\n      const val = map.get(key)\n      map.delete(key)\n      map.set(key, val) // move to most-recent (end)\n      return val\n    },\n    set(key, val) {\n      if (map.has(key)) map.delete(key)\n      map.set(key, val)\n      if (map.size > capacity) {\n        const oldest = map.keys().next().value // first inserted\n        map.delete(oldest)\n      }\n    },\n  }\n}`,
        explanation: [
          'Map preserves insertion order, so the first key is the least-recently-used.',
          'On access we delete and re-set the key to move it to the end (most recent).',
          'When over capacity, we evict the oldest by reading the first key from map.keys() — this is why Map order matters here and an Object would not work cleanly.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing when to use Map vs Object is a sign of engineering judgment, not just syntax recall. It touches correctness (key collisions), security (prototype pollution), and performance (hidden classes vs O(1) churn) — exactly the dimensions interviewers use to gauge depth.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the surface differences (key types, .size). Product companies (Zoho, Flipkart, Razorpay) ask when you would choose one and to implement an LRU or a counter. FAANG-level interviews probe SameValueZero, hidden-class deopt, prototype pollution, and WeakMap memory semantics.',
    whatInterviewersExpect:
      'They expect you to articulate the key-type and ordering differences, name the prototype-pollution risk and its fix, give size/iteration specifics, and choose the right structure for a scenario — bonus for mentioning WeakMap for object-keyed, collectable caches.',
  },
}

export default mapVsObject
