import type { ConceptLesson } from '../../../types/lesson'

const primitiveVsReference: ConceptLesson = {
  // 1. Concept Summary
  slug: 'primitive-vs-reference',
  name: 'Primitives vs References',
  category: 'memory-model',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'This is the root cause of the #1 beginner bug: "I changed one object and another changed too" — because they shared a reference.',
    'It explains why `===` on two identical-looking objects returns false, while two equal numbers return true.',
    'It determines what happens when you pass values to functions: primitives are copied, references share the same underlying object.',
    'Understanding it is the prerequisite for grasping immutability, shallow vs deep copy, and how the stack and heap work.',
    'Interviewers ask it constantly because it cleanly separates people who understand JavaScript\'s memory model from those who only memorized syntax.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A primitive is like writing a number on a sticky note; a reference is like sharing the address of a house — many people can point to the same house.',
    story: [
      'Imagine you write the number 5 on a sticky note and give a copy to your friend. If your friend changes their note to 6, your note still says 5 — each has their own.',
      'Now imagine instead you both have a piece of paper with the ADDRESS of the same treehouse. You did not copy the treehouse; you copied the address.',
      'If your friend goes to that treehouse and paints the door red, then when YOU visit the same address, you also see the red door — because it is the same treehouse.',
      'Numbers and text in JavaScript are like sticky notes (copies), but objects and arrays are like addresses to a shared treehouse. That is the difference between primitives and references.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript values come in two kinds: simple values (primitives) like numbers, text, and true/false, and complex values (references) like objects and arrays.',
    'When you copy a primitive, you get a brand-new independent copy of the value.',
    'When you copy a reference, you copy only the "address" that points to the same object — both names now point to the same thing.',
    'So changing the object through one name shows up through the other name, but changing a primitive copy never affects the original.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable values copied by value. Reference types (objects, arrays, functions) are stored on the heap; variables hold a reference (pointer) to them, and assignment/argument passing copies the reference, not the underlying object.',
    how: 'When you assign a primitive, the actual value is duplicated. When you assign an object, only the reference is duplicated, so two variables can point to the same object and see each other\'s mutations.',
    why: 'Copying small immutable values is cheap and safe; sharing references to large mutable structures avoids expensive copies but means changes are shared — which you must manage deliberately.',
    code: {
      label: 'Copy by value vs copy by reference',
      lang: 'js',
      code: `// Primitive: copied by value\nlet a = 5\nlet b = a\nb = 6\nconsole.log(a, b) // 5 6  (independent)\n\n// Reference: copied by reference\nconst obj1 = { count: 5 }\nconst obj2 = obj1\nobj2.count = 6\nconsole.log(obj1.count, obj2.count) // 6 6  (shared object)`,
      explanation: [
        '`b = a` copies the number 5 into b; changing b does not touch a.',
        'So a stays 5 and b becomes 6 — two independent values.',
        '`obj2 = obj1` copies the reference, so both point to the SAME object.',
        'Mutating `obj2.count` is visible through `obj1` because there is only one object.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JavaScript has two value categories. Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable and have copy-by-value semantics: assignment and parameter passing duplicate the value. Reference types (Object, Array, Function, and built-ins like Date/Map) are allocated on the heap; a variable stores a reference to that allocation. Assignment and argument passing copy the reference (the technique is often called "call by sharing"), so multiple bindings can alias the same object and observe each other\'s mutations. Equality with === compares primitives by value but compares references by identity (same allocation), not structural content.',

  // 7. Internal Working
  internalWorking: [
    'When a primitive is declared, its value is stored directly in the variable\'s slot (conceptually on the stack), small and self-contained.',
    'When an object/array is created, the engine allocates it on the heap and stores a reference (pointer) to that heap location in the variable.',
    'Assigning a primitive to another variable copies the bits of the value, producing two fully independent copies.',
    'Assigning a reference copies only the pointer, so both variables reference the identical heap object — this is call by sharing.',
    'Passing arguments follows the same rule: a function receives a copy of the value for primitives, and a copy of the reference for objects (so it can mutate the shared object but cannot reassign the caller\'s variable).',
    '=== compares primitives by their value bits; for references it compares the pointers, returning true only when both refer to the same allocation, regardless of structural equality.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   PRIMITIVES (copy by value)            REFERENCES (copy by reference)

   STACK                                 STACK            HEAP
   ┌──────────┐                          ┌──────────┐     ┌───────────────┐
   │ a = 5    │   b = a                   │ obj1 ───────┐  │ { count: 6 }  │
   ├──────────┤   ─────►                  ├──────────┤  ├─►│ (one object)  │
   │ b = 5    │   (independent copy)      │ obj2 ───────┘  └───────────────┘
   └──────────┘   change b → a unaffected └──────────┘
                                          both point to the SAME object;
                                          mutate via obj2 → obj1 sees it`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: primitive values and the references (pointers) to objects live in the variable\'s stack slot; these are small, fixed-size, and fast to copy.',
    'HEAP: the actual objects, arrays, and functions are allocated on the heap, where size can vary and grow.',
    'COPYING: copying a primitive duplicates the value on the stack; copying a reference duplicates only the pointer, leaving one shared heap object.',
    'GARBAGE COLLECTION: a heap object stays alive as long as any reference points to it; when the last reference is gone, it becomes eligible for collection.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — equality differs for primitives vs references',
      lang: 'js',
      code: `console.log(5 === 5)            // true  (value equality)\nconsole.log('hi' === 'hi')      // true\n\nconsole.log({} === {})          // false (different objects)\nconst x = {}; const y = x\nconsole.log(x === y)            // true  (same reference)`,
      explanation: [
        'Two identical primitives are === because their values match.',
        'Two object literals are different allocations, so === is false even though they look the same.',
        'Assigning `y = x` makes y reference the same object as x.',
        'Therefore `x === y` is true — identity, not structural content, decides reference equality.',
      ],
    },
    intermediate: {
      label: 'Intermediate — passing to functions',
      lang: 'js',
      code: `function bumpPrimitive(n) { n = n + 1; return n }\nfunction bumpObject(o) { o.n = o.n + 1 }      // mutates shared object\nfunction reassign(o) { o = { n: 999 } }       // reassigns local copy only\n\nlet num = 10\nconsole.log(bumpPrimitive(num), num) // 11 10  (original unchanged)\n\nconst obj = { n: 10 }\nbumpObject(obj)\nconsole.log(obj.n)                   // 11  (mutation is shared)\nreassign(obj)\nconsole.log(obj.n)                   // 11  (reassign didn't affect caller)`,
      explanation: [
        'A primitive argument is a copy, so `bumpPrimitive` cannot change the caller\'s `num`.',
        '`bumpObject` mutates the shared object, so the change is visible to the caller.',
        '`reassign` only rebinds its local parameter to a new object — the caller\'s reference is untouched.',
        'This is "call by sharing": you can mutate the shared object but cannot reassign the caller\'s variable.',
      ],
    },
    advanced: {
      label: 'Advanced — shallow copy shares nested references',
      lang: 'js',
      code: `const original = { name: 'A', tags: ['x', 'y'] }\nconst copy = { ...original }   // shallow copy\n\ncopy.name = 'B'                // top-level primitive: independent\ncopy.tags.push('z')            // nested array: SHARED reference!\n\nconsole.log(original.name)     // 'A'  (unaffected)\nconsole.log(original.tags)     // ['x','y','z']  (mutated via shared ref)`,
      explanation: [
        'Spread creates a new top-level object, so `name` (a primitive) is independent.',
        'But `tags` is an object/array; the spread copied its reference, not its contents.',
        'Pushing to `copy.tags` mutates the same array that `original.tags` points to.',
        'This is the classic shallow-copy trap — nested references are shared, motivating deep copy.',
      ],
    },
    realProject: {
      label: 'Real project — avoiding accidental shared state in Vue/React',
      lang: 'js',
      code: `// BUG: same object reused as initial state -> all rows share one object\n// const blank = { qty: 0 }\n// rows.forEach(r => r.form = blank) // mutating one row's form mutates all!\n\n// FIX: create a fresh object per item\nfunction makeForm() { return { qty: 0 } }\nconst rows = [1, 2, 3].map((id) => ({ id, form: makeForm() }))\nrows[0].form.qty = 5\nconsole.log(rows[1].form.qty) // 0  (independent objects)`,
      explanation: [
        'Reusing one object as initial state makes every row reference the same object.',
        'Mutating one row\'s form would then change every row — a real Vue/React state bug.',
        'A factory returns a fresh object per item, so each row has its own independent state.',
        'This pattern (factory for default state) prevents shared-reference bugs in component lists and stores.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between primitive and reference types in JavaScript?',
      answer: 'Primitives (string, number, boolean, null, undefined, symbol, bigint) are immutable and copied by value. Reference types (objects, arrays, functions) live on the heap and are copied by reference, so multiple variables can point to the same object and see each other\'s changes.',
      explanation: 'A strong answer lists the primitive types and contrasts copy-by-value vs copy-by-reference.',
    },
    {
      level: 'beginner',
      question: 'Why does {} === {} return false but 5 === 5 return true?',
      answer: 'Primitives compare by value, so 5 equals 5. Objects compare by identity (reference), and two object literals are different allocations, so they are not equal even if they look the same.',
      explanation: 'Tests the core idea that reference equality is about identity, not structure.',
    },
    {
      level: 'intermediate',
      question: 'Is JavaScript pass-by-value or pass-by-reference?',
      answer: 'It is always pass-by-value, but for objects the value being passed is a reference. This is sometimes called "call by sharing": a function can mutate the shared object, but reassigning the parameter does not affect the caller\'s variable.',
      explanation: 'The nuanced, correct answer that resolves the common confusion.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between a shallow copy and a deep copy?',
      answer: 'A shallow copy duplicates the top level but shares nested references, so mutating a nested object affects both. A deep copy recursively clones everything, producing fully independent data (e.g. via structuredClone).',
      explanation: 'Connects the reference concept to the practical copying problem.',
    },
    {
      level: 'advanced',
      question: 'Are primitives stored on the stack and objects on the heap? Is that always true?',
      answer: 'Conceptually yes — primitives and references sit in the variable slot (stack), and objects are allocated on the heap. In practice engines like V8 optimize (e.g. small integers as SMIs, escape analysis to stack-allocate non-escaping objects), so it is a useful mental model rather than a strict guarantee.',
      explanation: 'Senior-leaning nuance: the stack/heap model is conceptual; engines optimize beyond it.',
    },
    {
      level: 'senior',
      question: 'How does the reference model interact with garbage collection and memory leaks?',
      answer: 'A heap object is retained as long as it is reachable through any reference. Forgotten references — in closures, caches, arrays, or event listeners — keep objects alive and cause leaks. Using WeakMap/WeakRef lets the GC reclaim objects that are only weakly referenced.',
      explanation: 'Links references to reachability-based GC and the practical leak/weak-reference patterns.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you make a deep copy of a nested object?',
    'Why does spread/Object.assign only do a shallow copy?',
    'How do you compare two objects by value (structural equality)?',
    'What does Object.freeze do, and is it deep?',
    'Why can a function mutate an object argument but not reassign it?',
    'How do WeakMap/WeakRef relate to references and garbage collection?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming assigning an object copies it.',
      why: 'Assignment copies the reference, so both variables point to the same object and mutations are shared.',
      fix: 'Use a copy (spread, structuredClone) when you need an independent object; otherwise expect shared state.',
    },
    {
      mistake: 'Comparing objects with === expecting structural equality.',
      why: '=== checks reference identity for objects, not whether their contents match.',
      fix: 'Compare by value with a deep-equal utility or by serializing/comparing fields explicitly.',
    },
    {
      mistake: 'Using a shallow copy and being surprised nested data changed.',
      why: 'Spread/Object.assign copy only the top level; nested objects/arrays remain shared references.',
      fix: 'Deep copy (structuredClone) or clone the nested parts you intend to mutate.',
    },
    {
      mistake: 'Reusing one object as default state across many items.',
      why: 'All items reference the same object, so mutating one mutates all.',
      fix: 'Create a fresh object per item via a factory function.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue reactivity wraps objects in proxies; sharing the same object across components means a mutation reactively updates everywhere — intended when sharing state, a bug when you wanted independent copies.' },
    { area: 'React', detail: 'State updates must produce new references for objects/arrays so React detects the change; mutating the existing object (same reference) often fails to trigger a re-render.' },
    { area: 'Node.js', detail: 'Caching objects shares references across requests; mutating a cached object affects all consumers, so caches should store immutable or cloned data to avoid cross-request leakage.' },
    { area: 'Backend', detail: 'Passing large objects by reference avoids costly copies in hot paths, but you must guard against unintended mutation by callers (freeze, clone, or document ownership).' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Copying primitives is cheap and creates safe, independent values.',
      'Passing objects by reference avoids expensive deep copies for large structures.',
    ],
    bad: [
      'Deep-copying large objects (to get independence) is costly in time and memory.',
      'Unintended shared mutation causes subtle bugs that are expensive to debug, even if not "slow".',
    ],
    optimizations: [
      'Copy only when independence is required; otherwise share references and treat data as read-only.',
      'Prefer shallow copy plus targeted cloning of the nested parts you mutate, rather than always deep-copying.',
      'Use immutable update patterns (spread the changed level) so frameworks detect changes via new references.',
      'Use WeakMap/WeakRef for object-keyed caches so retained references do not block garbage collection.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'stack-vs-heap'],
    nextConcepts: ['shallow-vs-deep-copy', 'object-immutability', 'equality-comparison', 'garbage-collection', 'weakmap-weakset'],
    dependencyNote:
      'Builds on data-types and the stack-vs-heap memory model. It is the prerequisite for shallow-vs-deep-copy and object-immutability, clarifies equality-comparison, and connects to garbage-collection and weakmap-weakset via reachability.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a STACK column and a HEAP column.',
      'For primitives: write a=5 and b=5 in the stack as separate boxes; say "b=a copies the value".',
      'For references: write obj1 and obj2 in the stack, both with arrows to ONE box in the heap labeled { count: 6 }.',
      'Show mutating through obj2 changes the single heap object that obj1 also points to.',
      'Say: "Primitives copy by value (independent); objects copy the reference (shared) — and === compares value for primitives but identity for references."',
    ],
    diagram: `  STACK                      HEAP
  a = 5
  b = 5   (value copies, independent)

  obj1 ──┐
         ├──►  { count: 6 }   (one shared object)
  obj2 ──┘
  mutate via obj2 → obj1 sees it;  obj1 === obj2 → true`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript has primitives (string, number, boolean, null, undefined, symbol, bigint) which are immutable and copied by value, and reference types (objects, arrays, functions) which live on the heap and are copied by reference. Assigning or passing a primitive duplicates the value; doing the same with an object copies only the pointer, so both names share one object and see each other\'s mutations. === compares primitives by value but objects by identity. The classic traps are shared-reference mutation and shallow copies that share nested objects.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In JavaScript every value is either a primitive or a reference type. Primitives are string, number, boolean, null, undefined, symbol, and bigint. They are immutable, and they are copied by value — when you assign one variable to another, or pass one into a function, you get an independent copy, so changing one never affects the other. Reference types are objects, arrays, and functions. They are allocated on the heap, and the variable actually holds a reference — a pointer — to that allocation. So when you assign an object to another variable or pass it to a function, you copy the reference, not the object itself, which means both names point to the same underlying object and a mutation through one is visible through the other. People often ask whether JavaScript is pass-by-value or pass-by-reference; the precise answer is it is always pass-by-value, but for objects the value is a reference — sometimes called call by sharing. That is why a function can mutate the properties of an object you pass in, but reassigning the parameter to a new object does not affect your variable. This model also explains equality: === compares primitives by their value, but compares objects by identity, so two structurally identical objects are not equal — only two references to the same allocation are. The everyday bugs that come from this are sharing one object as default state across many items, and shallow copies — spread or Object.assign copy only the top level, so nested objects stay shared. When you truly need independence you deep-copy, for example with structuredClone.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Sharing references avoids copy cost for large structures but risks unintended mutation; deep copying gives safety at real time/memory cost.',
      'Immutable update patterns (new references) integrate well with React/Vue change detection but allocate more, adding GC pressure.',
    ],
    edgeCases: [
      'NaN === NaN is false despite both being the same primitive; Object.is handles it (and -0 vs +0).',
      'Boxing: accessing a method on a primitive (e.g. "abc".length) temporarily wraps it in an object, but the primitive itself stays immutable.',
      'structuredClone cannot clone functions or DOM nodes and throws; JSON-based deep copy drops functions, undefined, and Dates lose type.',
    ],
    runtimeBehavior: [
      'Engines optimize the stack/heap model: small integers as tagged SMIs, escape analysis to stack-allocate non-escaping objects.',
      'Reference equality is a pointer comparison; structural equality requires explicit recursion or serialization.',
      'A heap object lives until unreachable; lingering references (closures, caches, listeners) keep it alive.',
    ],
    scalability: [
      'In hot paths, passing references avoids per-call deep copies, but shared mutable state across requests/components is a scaling hazard.',
      'Caches that store references must clone or freeze to prevent consumers from corrupting shared data at scale.',
    ],
    productionConcerns: [
      'Cross-request reference sharing in server caches can leak one request\'s data into another — store immutable/cloned data.',
      'In React/Vue, mutating instead of replacing references causes missed updates (React) or unexpected reactivity (Vue).',
      'Use WeakMap/WeakRef for object-keyed caches so references do not prevent garbage collection and cause leaks.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Primitives: string, number, boolean, null, undefined, symbol, bigint.',
    'References: objects, arrays, functions (heap-allocated).',
    'Primitives = copy by value (independent); references = copy the pointer (shared).',
    'JS is pass-by-value; for objects the value is a reference (call by sharing).',
    'Function can mutate a passed object; reassigning the param does not affect caller.',
    '=== compares primitives by value, objects by identity.',
    '{} === {} is false; same reference === itself is true.',
    'Shallow copy (spread/Object.assign) shares nested references.',
    'Deep copy with structuredClone for full independence.',
    'Reachable references keep heap objects alive (GC); use WeakMap to allow collection.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: copying a primitive vs copying an object, then mutating the copy.',
      hint: 'Primitive copies are independent; object copies share the reference.',
      solution: {
        lang: 'js',
        code: `let p = 1; let q = p; q = 2\nconsole.log(p, q) // 1 2\n\nconst o1 = { v: 1 }; const o2 = o1; o2.v = 2\nconsole.log(o1.v, o2.v) // 2 2`,
        explanation: [
          'Numbers copy by value, so p stays 1 while q becomes 2.',
          'Objects copy by reference, so o1 and o2 are the same object and both show 2.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a function that updates an object immutably (returns a new object) instead of mutating it.',
      hint: 'Spread the original and override the changed field.',
      solution: {
        lang: 'js',
        code: `function setField(obj, key, value) {\n  return { ...obj, [key]: value } // new reference, original untouched\n}\nconst a = { x: 1, y: 2 }\nconst b = setField(a, 'y', 9)\nconsole.log(a, b) // { x:1, y:2 }  { x:1, y:9 }`,
        explanation: [
          'Spreading copies the top-level fields into a brand-new object.',
          'Overriding the key produces an updated copy while leaving the original unchanged.',
          'Returning a new reference is exactly what React state updates need.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate the shallow-copy trap and fix it so the nested array is independent.',
      hint: 'Spread copies nested references; clone the nested array too.',
      solution: {
        lang: 'js',
        code: `const original = { tags: ['x'] }\n\n// TRAP: shallow copy shares the nested array\nconst shallow = { ...original }\nshallow.tags.push('y')\nconsole.log(original.tags) // ['x','y'] -> leaked!\n\n// FIX: clone nested parts too\nconst safe = { ...original, tags: [...original.tags] }\nsafe.tags.push('z')\nconsole.log(original.tags, safe.tags) // ['x','y']  ['x','y','z']`,
        explanation: [
          'The shallow copy shares the same `tags` array reference as the original.',
          'Pushing through the copy mutates the original\'s array — the trap.',
          'Cloning the nested array (`[...original.tags]`) gives independent data so mutations stay separate.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a structural equality check for two flat objects (same keys/values), since === only checks identity.',
      hint: 'Compare key counts then each key\'s value.',
      solution: {
        lang: 'js',
        code: `function shallowEqual(a, b) {\n  if (a === b) return true            // same reference shortcut\n  const ka = Object.keys(a), kb = Object.keys(b)\n  if (ka.length !== kb.length) return false\n  return ka.every((k) => a[k] === b[k]) // compare values\n}\nshallowEqual({ x: 1 }, { x: 1 }) // true\nshallowEqual({ x: 1 }, { x: 2 }) // false`,
        explanation: [
          '=== alone returns false for two distinct objects, so we compare contents.',
          'We check that both objects have the same number of keys, then compare each value.',
          'This is shallow structural equality; nested objects would need recursion (deep equal).',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is the foundation of JavaScript\'s memory model and the source of the most common real-world bugs around shared state, equality, and copying. Mastering it makes immutability, deep copy, and framework state management click into place.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "difference between primitive and reference types" and the {} === {} question. Product companies (Zoho, Flipkart, Razorpay) probe pass-by-value vs reference and shallow vs deep copy with code. FAANG-level interviews connect it to the stack/heap model, garbage collection, and immutable update patterns in React/Vue.',
    whatInterviewersExpect:
      'They expect you to list the primitive types, contrast copy-by-value with copy-by-reference, correctly explain call by sharing (mutate yes, reassign no), explain why === differs for objects, and demonstrate the shallow-copy trap with a fix.',
  },
}

export default primitiveVsReference
