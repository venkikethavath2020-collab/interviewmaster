import type { ConceptLesson } from '../../../types/lesson'

const objectImmutability: ConceptLesson = {
  // 1. Concept Summary
  slug: 'object-immutability',
  name: 'Immutability',
  category: 'objects-prototypes',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Immutability is how you make state predictable — if data never changes in place, you can always reason about what a value was at any point in time.',
    'Every modern framework (React, Vue, Redux) relies on it: change detection compares old and new references, so accidentally mutating in place silently breaks re-renders.',
    'It prevents an entire class of bugs where one part of the code mutates an object another part still holds — "spooky action at a distance".',
    'Interviewers use it to test whether you understand the difference between freezing a reference, freezing values, and shallow vs deep immutability.',
    'Functional programming, undo/redo, time-travel debugging, and safe concurrency all depend on data that does not change underneath you.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An immutable object is like a photograph — you cannot change what is in it; you can only take a new photo.',
    story: [
      'Imagine you draw a picture of your room and frame it on the wall. That picture can never change — the toys are exactly where you drew them, forever.',
      'If you tidy your room and want to show the new arrangement, you cannot erase the framed picture. You have to draw a brand new one.',
      'Now anyone who looked at the old picture still sees the old room, and they are never surprised by a change they did not make.',
      'Immutable data in code works the same way: instead of editing the old thing, you make a fresh copy with the change. The old version stays safe and unchanged for anyone still looking at it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript, objects and arrays can normally be changed after you create them — you can add, remove, or edit their contents. That is called being mutable.',
    'Immutability is a rule you choose to follow: once you make an object, you never change it. If you need a different value, you build a new object instead.',
    'This makes programs easier to trust, because a value you stored earlier is guaranteed to still be the same later.',
    'JavaScript even gives you a tool, Object.freeze, that enforces this by refusing to let an object be edited.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Immutability means a value cannot be changed after it is created. To "change" it, you create a new value that includes the modification, leaving the original intact.',
    how: 'Primitives (string, number, boolean) are already immutable in JS. For objects and arrays you enforce it by convention (always copy: spread, map, filter) and/or with Object.freeze to make accidental mutation throw or fail silently.',
    why: 'Immutable data is predictable: shared references never surprise you, change detection becomes a cheap reference comparison, and you get safe undo/history for free.',
    code: {
      label: 'Update without mutating',
      lang: 'js',
      code: `const user = { name: 'Sam', age: 30 }\n\n// DON'T mutate:\n// user.age = 31  // changes the original everyone shares\n\n// DO create a new object:\nconst older = { ...user, age: 31 }\n\nconsole.log(user.age)  // 30  (original untouched)\nconsole.log(older.age) // 31  (new object)`,
      explanation: [
        '`user` is the original object; we treat it as read-only.',
        'The spread `{ ...user, age: 31 }` copies every property of user, then overrides `age`.',
        'The result `older` is a brand-new object — `user` is completely unaffected.',
        'Anyone still holding `user` sees the old value, so no surprise mutations.',
        'This copy-on-write pattern is the heart of immutable updates in Redux, Vue, and React.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Immutability is the property that an object\'s state cannot be modified after construction. In JavaScript, primitive values are inherently immutable, while objects and arrays are mutable by default. Immutability is achieved either by convention (always producing new objects via spread/map/filter rather than mutating) or enforced via Object.freeze, which sets the object non-extensible and marks all own properties writable:false and configurable:false. Object.freeze is shallow: nested objects remain mutable. True deep immutability requires recursive freezing or a persistent data-structure library.',

  // 7. Internal Working
  internalWorking: [
    'A variable holds either a primitive value (stored by value) or a reference (a pointer to an object on the heap).',
    'For primitives, the engine never edits the value in place; assigning a new value simply rebinds the variable to a different immutable value.',
    'For objects, mutation changes the heap object that the reference points to — every variable sharing that reference sees the change.',
    'Object.freeze flips the object\'s internal [[Extensible]] flag to false and rewrites each own property descriptor to writable:false, configurable:false.',
    'In non-strict mode, writes to a frozen property fail silently; in strict mode (and ES modules) they throw a TypeError.',
    'Because freeze only touches own first-level properties, a frozen object whose property is another object can still have that nested object mutated — hence "shallow".',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  MUTABLE update (BAD):              IMMUTABLE update (GOOD):

  user ──► { name, age:30 }          user ──► { name, age:30 }   (unchanged)
              │                                  │ spread copy
   user.age = 31  (edits in place)               ▼
              ▼                        older ──► { name, age:31 }  (new object)
       { name, age:31 }
   everyone sharing user             user and older are
   is now surprised                  independent references`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: the variable (user) holds a reference (pointer); the pointer value itself is small.',
    'HEAP: the actual object lives on the heap. Mutation rewrites fields of that single heap object.',
    'REFERENCE: when two variables share one object, mutating through either changes the same heap allocation — the source of shared-mutation bugs.',
    'Immutable updates allocate a NEW heap object and leave the old one untouched, so old references keep seeing old data until GC collects it.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — Object.freeze',
      lang: 'js',
      code: `'use strict'\nconst config = Object.freeze({ env: 'prod', retries: 3 })\nconfig.retries = 5  // TypeError in strict mode\nconsole.log(config.retries) // 3`,
      explanation: [
        'Object.freeze makes `config` non-extensible and all properties read-only.',
        'In strict mode, attempting to write throws a TypeError; in sloppy mode it just fails silently.',
        'The value stays 3 — the write had no effect.',
        'Great for constants and configuration you never want mutated.',
      ],
    },
    intermediate: {
      label: 'Intermediate — immutable array updates',
      lang: 'js',
      code: `const todos = [{ id: 1, done: false }]\n\n// add (no push):\nconst added = [...todos, { id: 2, done: false }]\n\n// update one (no in-place edit):\nconst toggled = added.map(t =>\n  t.id === 1 ? { ...t, done: true } : t\n)\n\n// remove (no splice):\nconst removed = toggled.filter(t => t.id !== 2)`,
      explanation: [
        'Spread creates a new array for additions instead of mutating with push.',
        'map returns a new array; only the matched item is replaced with a new object via spread.',
        'filter produces a new array without the removed item, leaving the original intact.',
        'Each step yields a fresh reference — exactly what framework change detection needs.',
      ],
    },
    advanced: {
      label: 'Advanced — deepFreeze',
      lang: 'js',
      code: `function deepFreeze(obj) {\n  Object.getOwnPropertyNames(obj).forEach((key) => {\n    const value = obj[key]\n    if (value && typeof value === 'object') {\n      deepFreeze(value)\n    }\n  })\n  return Object.freeze(obj)\n}\n\nconst state = deepFreeze({ user: { name: 'Sam', roles: ['admin'] } })\nstate.user.name = 'Joe' // ignored / throws in strict mode\nconsole.log(state.user.name) // 'Sam'`,
      explanation: [
        'Object.freeze is shallow, so we recurse into every nested object first.',
        'We freeze children before freezing the parent so the whole tree is locked.',
        'Now even nested mutations are blocked — true deep immutability.',
        'Watch out: deepFreeze on huge graphs is O(n) and can be slow; freeze only what you need.',
      ],
    },
    realProject: {
      label: 'Real project — immutable state in a Vuex/Pinia-style reducer',
      lang: 'js',
      code: `// Redux-style reducer: NEVER mutate state, always return new\nfunction cartReducer(state, action) {\n  switch (action.type) {\n    case 'ADD_ITEM':\n      return { ...state, items: [...state.items, action.item] }\n    case 'CLEAR':\n      return { ...state, items: [] }\n    default:\n      return state\n  }\n}`,
      explanation: [
        'Reducers must be pure: given the same state and action, return a new state without touching the old one.',
        'Spreading state and items produces fresh references so the store knows something changed.',
        'Returning the SAME state reference for unknown actions lets connected components skip re-rendering.',
        'This immutable contract is what makes time-travel debugging and undo possible in Redux DevTools.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does it mean for a value to be immutable?',
      answer: 'It means the value cannot be changed after creation. To get a different value you create a new one rather than editing the original. In JS, primitives are immutable; objects/arrays are mutable unless you enforce immutability.',
      explanation: 'A good answer distinguishes built-in immutability of primitives from the convention/enforcement needed for objects.',
    },
    {
      level: 'beginner',
      question: 'Is Object.freeze deep or shallow?',
      answer: 'Shallow. It only freezes the object\'s own first-level properties; nested objects remain mutable. You need a recursive deepFreeze for full immutability.',
      explanation: 'This is the single most common follow-up and trips up many candidates.',
    },
    {
      level: 'intermediate',
      question: 'Why do React and Vue care about immutable updates?',
      answer: 'They detect changes by comparing references. If you mutate an object in place, the reference stays the same, so the framework may not detect the change and skip re-rendering. Creating a new object/array gives a new reference that signals a change.',
      explanation: 'Connecting immutability to reference-equality change detection shows real framework understanding.',
    },
    {
      level: 'intermediate',
      question: 'How do you update a nested property immutably?',
      answer: 'Spread at every level you touch: `{ ...state, user: { ...state.user, name: \'Joe\' } }`. Only the objects on the path to the change get new references; siblings are reused.',
      explanation: 'Demonstrates structural sharing — copying only the changed path, not the whole tree.',
    },
    {
      level: 'advanced',
      question: 'What is structural sharing and why does it matter for performance?',
      answer: 'When producing a new immutable value, you reuse the unchanged sub-trees and only allocate new nodes along the path that changed. This keeps immutable updates cheap (O(log n) or O(path length)) instead of deep-copying everything.',
      explanation: 'Libraries like Immer and Immutable.js rely on structural sharing; mentioning it signals depth.',
    },
    {
      level: 'senior',
      question: 'How does Immer give you "mutable" syntax with immutable results?',
      answer: 'Immer wraps your state in a Proxy "draft". You mutate the draft normally; the Proxy records which paths you touched. When you finish, Immer produces a new immutable state, copying only the changed paths and structurally sharing the rest.',
      explanation: 'Senior signal: connecting immutability to Proxy-based copy-on-write and structural sharing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Object.freeze, Object.seal, and Object.preventExtensions?',
    'Are const-declared objects immutable? (No — const only freezes the binding, not the object.)',
    'How would you implement a deepFreeze that handles circular references?',
    'What is the cost of deep-cloning vs structural sharing for large state?',
    'How do persistent data structures (Immutable.js) achieve O(log n) updates?',
    'How does immutability help with concurrency and Web Workers?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking `const obj = {}` makes the object immutable.',
      why: 'const only prevents reassigning the variable; you can still mutate the object\'s properties.',
      fix: 'Use Object.freeze (or deepFreeze) to actually prevent property changes.',
    },
    {
      mistake: 'Assuming Object.freeze is deep.',
      why: 'It only freezes top-level own properties; nested objects stay mutable.',
      fix: 'Recursively freeze, or use a library, when you need deep immutability.',
    },
    {
      mistake: 'Mutating state directly in React/Vue/Redux (e.g. state.items.push(x)).',
      why: 'The reference does not change, so change detection misses it and the UI does not update.',
      fix: 'Return new objects/arrays via spread, map, filter, or use Immer for ergonomic immutable updates.',
    },
    {
      mistake: 'Deep-cloning entire state on every update for "safety".',
      why: 'Deep clones are O(n) and create GC pressure; on large state this is a real performance problem.',
      fix: 'Use structural sharing — copy only the path that changed, reuse the rest.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'State updates must be immutable; setState/useState compare references. Libraries like Immer and Redux Toolkit enforce immutable updates with mutable-looking syntax.' },
    { area: 'Vue', detail: 'Pinia/Vuex strict mode warns on out-of-action mutations. While Vue 3 reactivity does track in-place changes, immutable patterns keep state predictable and play well with devtools time-travel.' },
    { area: 'Node.js', detail: 'Freezing configuration and shared constants prevents accidental mutation across modules; immutable message payloads make event-driven systems easier to reason about.' },
    { area: 'Backend', detail: 'Immutable domain events and value objects underpin event sourcing and CQRS — events never change after being recorded, giving a reliable audit log.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Reference-equality checks make change detection O(1) instead of deep comparison.',
      'Immutable snapshots enable cheap memoization and React.memo/computed caching keyed on reference identity.',
    ],
    bad: [
      'Naive deep cloning on every update is O(n) and generates significant garbage.',
      'Deep-freezing very large object graphs adds upfront cost and freezes are irreversible.',
    ],
    optimizations: [
      'Use structural sharing — only copy the path from root to the changed node.',
      'Reach for Immer or Immutable.js for large/complex state instead of hand-rolled deep copies.',
      'Freeze only in development to catch mutations; ship without the freeze cost in production.',
      'Prefer reference checks over deep equality wherever immutability guarantees it.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['primitive-vs-reference', 'shallow-vs-deep-copy', 'object-creation', 'property-descriptors'],
    nextConcepts: ['pure-functions', 'proxy-reflect', 'destructuring', 'default-rest-spread'],
    dependencyNote:
      'Immutability builds directly on understanding primitive-vs-reference and shallow-vs-deep copy. It powers pure functions and predictable state, and modern implementations (Immer) lean on proxy-reflect for copy-on-write drafts.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box "obj" with a reference arrow to a heap object { age: 30 }.',
      'Show two variables (a and b) pointing to the SAME heap object — mutate through a, b sees it.',
      'Cross that out as the "shared mutation bug".',
      'Now draw the immutable version: keep the old object, allocate a NEW object { age: 31 } and point only the new variable at it.',
      'Say: "Immutability means never editing the heap object — always allocate a new one, so old references stay safe. That is why frameworks compare references to detect change."',
    ],
    diagram: `  SHARED MUTATION:            IMMUTABLE:
   a ─┐                        old ─► {age:30}  (kept)
      ├─► {age:30→31}          new ─► {age:31}  (fresh)
   b ─┘  both surprised        references are independent`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Immutability means a value never changes after creation — instead of editing, you create a new value. Primitives are immutable already; objects/arrays you enforce by always copying (spread/map/filter) or with Object.freeze, which is shallow. Frameworks rely on it because they detect change by comparing references, so in-place mutation breaks re-rendering. The trade-off is copy cost, solved with structural sharing (Immer, Immutable.js). Remember: const freezes the binding, not the object.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Immutability means that once a value is created it cannot be changed; to represent a change you produce a brand-new value and leave the original untouched. In JavaScript, primitives like strings and numbers are already immutable. Objects and arrays are mutable by default, so we enforce immutability either by convention — always using spread, map, and filter to create new objects rather than mutating — or with Object.freeze, which makes an object non-extensible and its properties read-only. A key gotcha is that Object.freeze is shallow: nested objects remain mutable, so you need a recursive deepFreeze for true immutability. Another is that const only freezes the variable binding, not the object it points to. The big reason this matters in practice is change detection: React and Redux compare references to decide whether to re-render, so if you mutate state in place the reference is unchanged and the UI silently fails to update. The cost of immutability is allocating new objects, which we keep cheap with structural sharing — copying only the path that changed and reusing the rest. Tools like Immer use a Proxy draft so you write mutable-looking code that produces an immutable result.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Predictability and cheap change detection vs allocation cost and GC pressure from new objects.',
      'Manual immutable updates are verbose and error-prone for deep state; libraries add bundle size and a learning curve but improve correctness.',
      'Deep freezing catches mutation bugs but is irreversible and costs CPU — often dev-only.',
    ],
    edgeCases: [
      'Object.freeze does not deep-freeze, and frozen Maps/Sets can still have their entries mutated (freeze does not affect internal slots).',
      'Freezing arrays prevents push/pop but typed-array buffers and DOM-backed objects have their own rules.',
      'Circular references will infinite-loop a naive deepFreeze unless you track visited objects.',
    ],
    runtimeBehavior: [
      'Writes to frozen properties throw in strict mode / ES modules but fail silently otherwise — a subtle source of "why did nothing happen" bugs.',
      'Frozen objects can let V8 optimize property access (stable shape), a minor perf upside.',
      'Object.isFrozen lets you assert immutability at runtime in tests.',
    ],
    scalability: [
      'For large application state, hand-rolled deep copies do not scale — use persistent data structures with structural sharing (O(log n) updates).',
      'Immutable snapshots enable easy memoization and selector caching across many subscribers.',
    ],
    productionConcerns: [
      'Silent freeze failures in sloppy mode can mask bugs — prefer strict mode / modules.',
      'Over-freezing hot paths adds measurable overhead; profile before deep-freezing large graphs.',
      'Mixing mutable and immutable patterns in one codebase causes hard-to-trace state bugs; pick one discipline.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Immutable = value cannot change after creation; make a new one instead.',
    'Primitives are immutable; objects/arrays are not by default.',
    'const freezes the BINDING, not the object.',
    'Object.freeze = shallow, non-extensible, read-only own props.',
    'Strict mode: writing a frozen prop throws; sloppy mode: silent fail.',
    'Deep immutability needs recursive deepFreeze (watch circular refs).',
    'Update immutably with spread / map / filter.',
    'Nested update: spread at every level on the changed path.',
    'Frameworks detect change by reference — mutation breaks re-renders.',
    'Structural sharing keeps immutable updates cheap (Immer, Immutable.js).',
    'Object.freeze vs seal vs preventExtensions = decreasing strictness.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function `withAge(person, age)` that returns a new object with the updated age, without mutating the original.',
      hint: 'Use the spread operator.',
      solution: {
        lang: 'js',
        code: `function withAge(person, age) {\n  return { ...person, age }\n}\nconst p = { name: 'Sam', age: 30 }\nwithAge(p, 31) // { name: 'Sam', age: 31 }, p unchanged`,
        explanation: ['Spread copies all properties of person.', 'The `age` key after it overrides the original, producing a new object.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement an immutable `toggleTodo(todos, id)` that flips the `done` flag of the matching todo.',
      hint: 'Use map and only replace the matched item.',
      solution: {
        lang: 'js',
        code: `function toggleTodo(todos, id) {\n  return todos.map(t =>\n    t.id === id ? { ...t, done: !t.done } : t\n  )\n}`,
        explanation: [
          'map returns a new array, never mutating the original.',
          'Only the matched todo is replaced with a new object; others are reused by reference (structural sharing).',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write `deepFreeze(obj)` that recursively freezes an object and survives circular references.',
      hint: 'Track visited objects in a WeakSet.',
      solution: {
        lang: 'js',
        code: `function deepFreeze(obj, seen = new WeakSet()) {\n  if (obj === null || typeof obj !== 'object' || seen.has(obj)) return obj\n  seen.add(obj)\n  for (const key of Object.getOwnPropertyNames(obj)) {\n    deepFreeze(obj[key], seen)\n  }\n  return Object.freeze(obj)\n}`,
        explanation: [
          'The WeakSet records objects we have already visited to avoid infinite recursion on cycles.',
          'We recurse into every own property before freezing the parent.',
          'Non-objects are returned as-is; objects end up fully frozen.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `setIn(obj, path, value)` that immutably sets a deeply nested value, e.g. setIn(state, [\'user\', \'name\'], \'Joe\').',
      hint: 'Recurse down the path, spreading at each level.',
      solution: {
        lang: 'js',
        code: `function setIn(obj, path, value) {\n  if (path.length === 0) return value\n  const [head, ...rest] = path\n  return {\n    ...obj,\n    [head]: setIn(obj ? obj[head] : undefined, rest, value),\n  }\n}\n\nconst state = { user: { name: 'Sam', age: 30 } }\nconst next = setIn(state, ['user', 'name'], 'Joe')\n// next.user.name === 'Joe', state unchanged`,
        explanation: [
          'At each level we spread the current object and replace only the key on the path.',
          'Recursion walks down to the leaf, where the base case returns the new value.',
          'Only objects along the path get new references; everything else is structurally shared.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Immutability is the discipline that makes large applications maintainable — it underpins predictable state, time-travel debugging, and reliable change detection. Understanding it deeply shows you can reason about references and write framework code that actually re-renders correctly.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and whether Object.freeze is deep. Product companies (Zoho, Flipkart, Razorpay) ask you to write immutable update helpers like toggleTodo or setIn. FAANG-level interviews probe structural sharing, persistent data structures, and how Immer uses Proxies.',
    whatInterviewersExpect:
      'They expect you to distinguish const from frozen objects, explain shallow vs deep freeze, write a clean immutable update with spread/map/filter, and connect immutability to reference-based change detection in frameworks.',
  },
}

export default objectImmutability
