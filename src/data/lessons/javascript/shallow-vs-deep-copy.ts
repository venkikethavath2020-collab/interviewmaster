import type { ConceptLesson } from '../../../types/lesson'

const shallowVsDeepCopy: ConceptLesson = {
  // 1. Concept Summary
  slug: 'shallow-vs-deep-copy',
  name: 'Shallow vs Deep Copy',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Copying wrong is one of the most common real bugs: you "copy" an object, edit the copy, and the original mutates too because nested references were shared.',
    'It is the foundation of immutable state updates — knowing exactly which level shares a reference and which is duplicated is essential for React/Vue/Redux.',
    'Interviewers love it because it forces you to understand the difference between values and references, and the limits of spread/Object.assign.',
    'Deep copying naively (JSON.parse(JSON.stringify())) silently drops functions, Dates, Maps, undefined, and breaks on circular references — knowing this prevents subtle data loss.',
    'The right copy strategy directly affects performance: deep copies are expensive, shallow copies are cheap; choosing wrong wastes CPU or causes bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A shallow copy is photocopying a folder\'s cover but sharing the same papers inside; a deep copy is photocopying every single page too.',
    story: [
      'Imagine you have a folder with photos inside, and your friend wants their own folder.',
      'If you just hand them a new folder cover but it still points to YOUR photos, then when they scribble on a photo, your photo gets scribbled too — because it is really the same photo. That is a shallow copy.',
      'If instead you photocopy every single photo and put the copies in their new folder, then they can scribble all they want and your originals stay clean. That is a deep copy.',
      'In code, a shallow copy duplicates only the top layer and shares the nested stuff, while a deep copy duplicates everything all the way down.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Objects in JavaScript can contain other objects inside them, like boxes inside boxes.',
    'A shallow copy makes a new outer box but keeps pointing to the same inner boxes — so changing an inner box changes it for both copies.',
    'A deep copy makes new versions of every box, all the way down, so the two are completely independent.',
    'Tools like the spread operator and Object.assign do shallow copies; deep copying needs more work, like structuredClone or a recursive function.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A shallow copy duplicates only the top-level properties of an object; nested objects are shared by reference. A deep copy recursively duplicates everything, so the copy shares no references with the original.',
    how: 'Shallow: spread `{ ...obj }`, `Object.assign({}, obj)`, `arr.slice()`. Deep: `structuredClone(obj)` (modern), a recursive clone, or libraries like lodash.cloneDeep.',
    why: 'You copy to avoid mutating the original. A shallow copy is enough when you only change top-level fields; you need a deep copy when you mutate nested data and must keep the original untouched.',
    code: {
      label: 'Shallow vs deep in one example',
      lang: 'js',
      code: `const original = { name: 'Sam', address: { city: 'NYC' } }\n\nconst shallow = { ...original }\nshallow.address.city = 'LA'\nconsole.log(original.address.city) // 'LA'  ← original mutated!\n\nconst deep = structuredClone(original)\ndeep.address.city = 'SF'\nconsole.log(original.address.city) // 'LA'  ← original safe`,
      explanation: [
        'Spread copies `name` by value but `address` by reference — both objects point to the SAME address.',
        'Editing shallow.address.city therefore changes original.address.city too.',
        'structuredClone duplicates address as well, so `deep` is fully independent.',
        'Mutating deep.address.city leaves the original untouched.',
        'This nested-reference trap is the #1 copy bug in real codebases.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A shallow copy creates a new object whose top-level properties are copied by value for primitives and by reference for objects — meaning nested objects are shared with the source. A deep copy recursively clones the entire object graph, producing a structure that shares no references with the original. Shallow copies are produced by spread, Object.assign, and Array.prototype.slice. Deep copies require recursion, structuredClone (which uses the structured clone algorithm and handles cycles, Dates, Maps, Sets, TypedArrays but not functions/DOM nodes), or library utilities. JSON.parse(JSON.stringify()) is a lossy deep copy that drops functions, undefined, symbols, and converts Dates to strings.',

  // 7. Internal Working
  internalWorking: [
    'Every object property either holds a primitive (stored inline by value) or a reference (a pointer to another heap object).',
    'A shallow copy iterates own enumerable properties and copies each slot: primitives are duplicated, reference slots copy the pointer (not the target).',
    'Because the pointer is shared, mutating the pointed-to nested object is visible through both the copy and the original.',
    'A deep copy must, for each reference slot, allocate a new heap object and recurse into it, rebuilding the entire graph.',
    'structuredClone uses the structured clone algorithm: it tracks already-cloned objects in a map to correctly handle circular references and shared subgraphs.',
    'JSON round-tripping serializes to a string then re-parses — anything not representable in JSON (functions, undefined, symbols, Dates as Dates) is lost or transformed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  ORIGINAL: { name, address ─┐
                              ▼ }
                         { city: 'NYC' }   (heap)
                              ▲
  SHALLOW COPY: { name, address ┘   ← SAME address pointer!
       (mutating address affects BOTH)

  DEEP COPY: { name, address ─► { city: 'NYC' } (NEW heap)
       (fully independent — no shared pointers)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: the variables (original, shallow, deep) hold references to top-level objects.',
    'HEAP: shallow copy creates ONE new top-level object but its nested-object slots point at the SAME heap allocations as the original.',
    'REFERENCE: the shared pointers are exactly why mutating a nested field through the shallow copy mutates the original.',
    'A deep copy allocates a parallel set of heap objects for every node, so no pointer is shared and the two graphs are fully isolated.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — shallow copy ways',
      lang: 'js',
      code: `const obj = { a: 1, b: 2 }\nconst c1 = { ...obj }\nconst c2 = Object.assign({}, obj)\n\nconst arr = [1, 2, 3]\nconst a1 = [...arr]\nconst a2 = arr.slice()`,
      explanation: [
        'Spread and Object.assign both produce a shallow copy of an object.',
        'For arrays, spread and slice() are the common shallow-copy idioms.',
        'These are perfect when the data is flat (only primitives) — there are no nested references to share.',
        'They are O(n) over top-level properties and very fast.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the nested mutation trap',
      lang: 'js',
      code: `const state = { user: { name: 'Sam' }, tags: ['a'] }\nconst copy = { ...state }\n\ncopy.user.name = 'Joe'   // mutates original.user too!\ncopy.tags.push('b')      // mutates original.tags too!\n\nconsole.log(state.user.name) // 'Joe'\nconsole.log(state.tags)      // ['a', 'b']`,
      explanation: [
        'Spread copied `user` and `tags` as shared references.',
        'Editing copy.user.name reaches the same object original.user points to.',
        'push on copy.tags mutates the same array original.tags points to.',
        'To update nested data safely, spread at each level you change, or deep-clone.',
      ],
    },
    advanced: {
      label: 'Advanced — recursive deep clone with cycle handling',
      lang: 'js',
      code: `function deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== 'object') return value\n  if (seen.has(value)) return seen.get(value)\n  if (value instanceof Date) return new Date(value)\n  if (Array.isArray(value)) {\n    const arr = []\n    seen.set(value, arr)\n    value.forEach((v, i) => { arr[i] = deepClone(v, seen) })\n    return arr\n  }\n  const out = {}\n  seen.set(value, out)\n  for (const key of Object.keys(value)) {\n    out[key] = deepClone(value[key], seen)\n  }\n  return out\n}`,
      explanation: [
        'Primitives are returned as-is; only objects need cloning.',
        'The WeakMap maps already-cloned sources to their clones, correctly handling circular references and shared subgraphs.',
        'Dates and arrays get special handling so they are reconstructed as the right type.',
        'This is essentially what structuredClone does natively — prefer that when available.',
      ],
    },
    realProject: {
      label: 'Real project — cloning props before mutating in a Node service',
      lang: 'js',
      code: `// Express handler: never mutate the incoming request body directly\napp.post('/order', (req, res) => {\n  const order = structuredClone(req.body)  // safe working copy\n  order.createdAt = new Date()\n  order.items = order.items.map(i => ({ ...i, validated: true }))\n  saveOrder(order)\n  res.json(order)\n})`,
      explanation: [
        'structuredClone gives a safe, fully independent copy of the request body.',
        'Mutating the clone never affects the original request object or middleware state.',
        'We still use immutable spread on items to keep updates explicit.',
        'In React/Vue the same idea applies: clone before local mutation to avoid corrupting store state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a shallow and a deep copy?',
      answer: 'A shallow copy duplicates only the top-level properties and shares nested objects by reference. A deep copy recursively duplicates everything, so the copy shares no references with the original.',
      explanation: 'A strong answer names the key consequence: mutating nested data through a shallow copy affects the original.',
    },
    {
      level: 'beginner',
      question: 'Does the spread operator make a deep copy?',
      answer: 'No. Spread (and Object.assign) make a shallow copy — nested objects and arrays are still shared by reference.',
      explanation: 'Very common gotcha; the interviewer wants you to know spread is one level deep only.',
    },
    {
      level: 'intermediate',
      question: 'What are the problems with JSON.parse(JSON.stringify(obj)) for deep cloning?',
      answer: 'It drops functions, undefined, and symbols; converts Dates to strings; throws on circular references; and loses Map/Set/RegExp types. It only works for plain JSON-safe data.',
      explanation: 'Listing the specific data losses shows you have actually been burned by it.',
    },
    {
      level: 'intermediate',
      question: 'How do you update a nested property without mutating the original, using a shallow copy?',
      answer: 'Shallow-copy each level on the path: `{ ...state, user: { ...state.user, name: \'Joe\' } }`. Only the objects you touch get new references; siblings are shared.',
      explanation: 'Demonstrates structural sharing — the efficient middle ground between shallow and full deep copy.',
    },
    {
      level: 'advanced',
      question: 'What is structuredClone and what can it and can it not clone?',
      answer: 'structuredClone is a built-in deep clone using the structured clone algorithm. It handles cycles, Dates, Maps, Sets, ArrayBuffers, and TypedArrays, but cannot clone functions, DOM nodes, or prototype chains (it returns plain objects, losing the class).',
      explanation: 'Knowing both its strengths and its limits (no functions, loses prototype) is a senior-leaning detail.',
    },
    {
      level: 'senior',
      question: 'How would you deep-clone an object with circular references and shared subgraphs correctly?',
      answer: 'Maintain a WeakMap from each visited source object to its clone. Before recursing, check the map; if present, return the existing clone. This both prevents infinite recursion on cycles and preserves shared identity (two refs to the same source map to the same clone).',
      explanation: 'Preserving shared identity, not just avoiding infinite loops, is the senior-level distinction.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When is a shallow copy sufficient and a deep copy wasteful?',
    'How does structural sharing relate to copying?',
    'Why does structuredClone lose the class/prototype of an instance?',
    'How do you copy a Map or Set deeply?',
    'What is the performance cost of deep cloning a large object graph?',
    'How do lodash.cloneDeep and Immer differ in approach?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming spread/Object.assign deep-copies.',
      why: 'They only copy one level; nested references are shared, so nested mutations leak to the original.',
      fix: 'Deep-clone (structuredClone) or spread at every nested level you intend to change.',
    },
    {
      mistake: 'Using JSON.parse(JSON.stringify()) for any object.',
      why: 'It silently drops functions, undefined, symbols, breaks Dates, and throws on cycles.',
      fix: 'Use structuredClone or a proper deep-clone library for non-JSON-safe data.',
    },
    {
      mistake: 'Deep-cloning when you only change a top-level field.',
      why: 'Wasteful CPU and memory — you cloned the whole graph for nothing.',
      fix: 'Use a shallow copy (spread) and only clone deeper on the path you actually mutate.',
    },
    {
      mistake: 'Expecting structuredClone to preserve class instances.',
      why: 'It returns plain objects and loses the prototype/methods.',
      fix: 'Reconstruct the instance manually or implement a custom clone/toJSON for the class.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Immutable state updates shallow-copy along the changed path; deep cloning is avoided for performance and only used for snapshots or test fixtures.' },
    { area: 'Vue', detail: 'Cloning store state or props before local edits prevents accidental reactive mutations; structuredClone is handy for snapshotting reactive data (after toRaw).' },
    { area: 'Node.js', detail: 'Cloning request/response payloads before mutation avoids corrupting shared middleware state; structuredClone is available natively in modern Node.' },
    { area: 'Backend', detail: 'Deep copies create isolated message payloads for queues and event buses so consumers cannot mutate each other\'s data.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Shallow copies are O(top-level keys) and very cheap — ideal for hot paths.',
      'structuredClone is implemented natively in C++, faster than hand-rolled recursion for large graphs.',
    ],
    bad: [
      'Deep cloning large nested structures is O(n) over the whole graph and creates heavy GC pressure.',
      'JSON round-tripping is slow (serialize + parse) and lossy for non-trivial data.',
    ],
    optimizations: [
      'Prefer structural sharing: copy only the path that changed instead of the entire object.',
      'Use shallow copies whenever you only touch top-level fields.',
      'Reach for structuredClone or lodash.cloneDeep instead of writing your own recursion.',
      'Cache or memoize clones of stable data instead of re-cloning every call.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['primitive-vs-reference', 'stack-vs-heap', 'object-creation', 'default-rest-spread'],
    nextConcepts: ['object-immutability', 'json-serialization', 'pure-functions', 'proxy-reflect'],
    dependencyNote:
      'Copying depends on understanding primitive-vs-reference and the stack-vs-heap memory model. It directly enables object-immutability and safe immutable state updates, and connects to json-serialization for its lossy clone pitfalls.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an object with a primitive (name) and a nested object (address).',
      'Draw a shallow copy: new outer box, but its address arrow points to the SAME nested box.',
      'Show that editing the nested box changes both — circle the shared pointer.',
      'Draw a deep copy: a fully duplicated tree with its own nested box.',
      'Say: "Spread is shallow — nested references are shared. structuredClone is deep — every node is duplicated, including cycles, but it loses functions and class prototypes."',
    ],
    diagram: `  shallow:  copy ─► {name}      original ─► {name}
                     address ─┐    address ─┘
                              ▼
                        {city}  (SHARED)

  deep:     copy ─► {name, address ─► {city}}  (own)
            original ─► {name, address ─► {city}}  (own)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A shallow copy duplicates only top-level properties and shares nested objects by reference (spread, Object.assign, slice). A deep copy recursively duplicates the whole graph so nothing is shared (structuredClone, recursion, lodash.cloneDeep). The classic bug: shallow-copy an object, mutate a nested field, and the original changes too. JSON.parse(JSON.stringify()) is a lossy deep copy that drops functions, undefined, and breaks on cycles. Use shallow when changing top-level fields, deep when isolating nested data.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The difference comes down to how nested references are handled. A shallow copy creates a new top-level object but copies nested objects and arrays by reference, so the copy and the original still share those inner objects. That is what spread, Object.assign, and array slice give you. The classic bug is copying an object with a nested address, editing copy.address.city, and being surprised that original.address.city changed too — because they point to the same address. A deep copy recursively duplicates the entire object graph, so the result shares no references with the source. The modern built-in is structuredClone, which handles circular references, Dates, Maps, and Sets, but cannot clone functions or DOM nodes and loses class prototypes. People often reach for JSON.parse(JSON.stringify()), but that is lossy: it drops functions, undefined, and symbols, turns Dates into strings, and throws on cycles. In practice the right answer is usually neither extreme but structural sharing: shallow-copy each level only along the path you are changing, which is what immutable state updates in React and Redux do. You only pay for a full deep clone when you truly need an isolated snapshot, because deep cloning a large graph is expensive.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Shallow copy: cheap and fast but shares nested state — safe only when you do not mutate nested data.',
      'Deep copy: full isolation but O(n) cost and GC pressure; overkill for top-level-only changes.',
      'Structural sharing is the pragmatic middle ground but requires discipline at every nesting level.',
    ],
    edgeCases: [
      'Circular references: naive recursion infinite-loops; need a visited WeakMap (structuredClone handles this).',
      'Shared subgraphs: a correct deep clone should preserve that two references to one object still point to one clone.',
      'Special types: Dates, Maps, Sets, RegExp, TypedArrays need explicit handling or a clone algorithm that supports them.',
      'Class instances: structuredClone and JSON both lose the prototype, returning plain objects.',
    ],
    runtimeBehavior: [
      'structuredClone runs natively and uses an internal map to dedupe references; it throws DataCloneError on non-cloneable types like functions.',
      'JSON.stringify invokes toJSON hooks and skips undefined/functions, which can silently change shape.',
      'Spread evaluates getters once, capturing their current value rather than the getter itself.',
    ],
    scalability: [
      'Deep cloning per request/render does not scale — prefer immutable updates with structural sharing.',
      'For very large datasets, consider persistent data structures (Immutable.js) that share unchanged nodes.',
    ],
    productionConcerns: [
      'Hidden nested-mutation bugs from accidental shallow copies are hard to trace — they manifest as "the original changed".',
      'JSON-clone data loss can corrupt records silently in pipelines; audit for Dates and undefined.',
      'Cloning sensitive payloads can duplicate secrets in memory longer than needed — clone only what you must.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Shallow = top level new, nested shared by reference.',
    'Deep = whole graph duplicated, nothing shared.',
    'Shallow: spread, Object.assign, arr.slice().',
    'Deep: structuredClone, recursion, lodash.cloneDeep.',
    'Spread is NOT deep — nested mutations leak to original.',
    'JSON.parse(JSON.stringify()) drops functions/undefined/symbols, breaks Dates and cycles.',
    'structuredClone handles cycles, Dates, Maps, Sets — but not functions/DOM/class prototype.',
    'Circular refs need a visited WeakMap.',
    'Preserve shared identity: same source ref → same clone.',
    'Best practice: structural sharing — copy only the changed path.',
    'Deep clone is O(n) — use only when you need full isolation.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Make a shallow copy of an array and add an element without mutating the original.',
      hint: 'Use spread.',
      solution: {
        lang: 'js',
        code: `const arr = [1, 2, 3]\nconst copy = [...arr, 4]\nconsole.log(arr)  // [1, 2, 3]\nconsole.log(copy) // [1, 2, 3, 4]`,
        explanation: ['Spread creates a new array from the old elements.', 'Appending 4 happens in the new array; the original is untouched.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Given `state = { user: { name: \'Sam\' } }`, immutably change the name to \'Joe\' using only shallow copies.',
      hint: 'Spread at each level on the path.',
      solution: {
        lang: 'js',
        code: `const next = {\n  ...state,\n  user: { ...state.user, name: 'Joe' },\n}\n// state.user.name still 'Sam'`,
        explanation: [
          'We spread the outer object and replace only `user`.',
          'We spread the inner user object and override name, so the original user is not mutated.',
          'This is structural sharing: only objects on the changed path get new references.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a deepClone that correctly handles a circular reference: `const a = {}; a.self = a;`.',
      hint: 'Track visited objects with a WeakMap and return the cached clone.',
      solution: {
        lang: 'js',
        code: `function deepClone(value, seen = new WeakMap()) {\n  if (value === null || typeof value !== 'object') return value\n  if (seen.has(value)) return seen.get(value)\n  const out = Array.isArray(value) ? [] : {}\n  seen.set(value, out)\n  for (const k of Object.keys(value)) out[k] = deepClone(value[k], seen)\n  return out\n}\nconst a = {}; a.self = a\nconst c = deepClone(a)\nconsole.log(c.self === c) // true, no infinite loop`,
        explanation: [
          'Before recursing we register the clone in the WeakMap.',
          'When we encounter the same source again, we return the already-created clone.',
          'This stops infinite recursion and preserves the self-reference in the clone.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why this logs the original being mutated, then fix it: `const o = { list: [1] }; const c = { ...o }; c.list.push(2);`.',
      hint: 'The list array is shared. Deep-copy the array.',
      solution: {
        lang: 'js',
        code: `const o = { list: [1] }\n\n// BUG: shallow copy shares the array\nconst bad = { ...o }\nbad.list.push(2)\nconsole.log(o.list) // [1, 2]  ← original mutated\n\n// FIX: copy the nested array too\nconst good = { ...o, list: [...o.list] }\ngood.list.push(2)\nconsole.log(o.list) // [1] (the second run starts fresh conceptually)`,
        explanation: [
          'Spread copies the `list` reference, so bad.list and o.list are the same array.',
          'push mutates that shared array, changing the original.',
          'Spreading the nested array `[...o.list]` gives an independent array so the original is safe.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Copying correctly is a daily skill that separates developers who write reliable state code from those who chase phantom mutation bugs. It is the practical application of the value-vs-reference model and the gateway to immutability.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and whether spread is deep. Product companies (Zoho, Flipkart, Razorpay) ask you to write deepClone with cycle handling or fix a nested-mutation bug. FAANG-level interviews probe structuredClone internals, preserving shared identity, and structural sharing for performance.',
    whatInterviewersExpect:
      'They expect you to know spread/Object.assign are shallow, list the JSON-clone pitfalls, write a recursive deep clone that handles cycles, and choose the right strategy based on whether you mutate nested data.',
  },
}

export default shallowVsDeepCopy
