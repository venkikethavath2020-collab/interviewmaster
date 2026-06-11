import type { ConceptLesson } from '../../../types/lesson'

const stackVsHeap: ConceptLesson = {
  // 1. Concept Summary
  slug: 'stack-vs-heap',
  name: 'Stack vs Heap',
  category: 'memory-model',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'It explains the single most confusing class of JS bugs: why mutating one variable secretly changes another (shared references) — and why primitives never do that.',
    'Understanding stack vs heap is the foundation for reasoning about copying, equality, function arguments, and garbage collection.',
    'It is how interviewers test whether you understand WHY `a = b` copies a value for numbers but copies a reference for objects.',
    'Without this model you cannot reason about memory leaks, deep vs shallow copy, or why recursion can blow the stack.',
    'Every framework gotcha — Vue reactivity on objects, React state mutation bugs — traces back to "is this on the stack or the heap?".',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The stack is a tidy stack of sticky notes; the heap is a big warehouse, and a sticky note can just say "go to shelf 42".',
    story: [
      'Imagine your desk has a small pad of sticky notes. Each note is tiny, so you can only write a short thing on it like a number or "yes".',
      'But some things are too big for a sticky note — like a whole box of toys. So you put the box in a giant warehouse instead.',
      'On the sticky note you just write the shelf number where the box lives, like "shelf 42".',
      'If you copy a sticky note that holds a number, you get two separate notes. But if you copy a note that says "shelf 42", both notes now point at the SAME box — change the box and both notes see the change.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Computers store data in two main areas. One is a small, fast, very organized area called the stack; the other is a big, flexible area called the heap.',
    'Small, fixed-size values like numbers and true/false live directly on the stack. Big or growable things like objects and arrays live in the heap.',
    'When something lives in the heap, the stack only keeps an address (a reference) that points to it — like a treasure map instead of the treasure.',
    'This is why copying a number gives you a real second copy, but copying an object only copies the map, so both maps lead to the same treasure.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The stack stores primitive values and the references to objects in fixed-size, automatically-managed frames; the heap stores objects, arrays, and functions whose size can grow and whose lifetime is not tied to a single function call.',
    how: 'When you declare a primitive, its value sits in the current stack frame. When you create an object, the object is allocated on the heap and the variable on the stack holds a reference (pointer) to it. Assigning between variables copies what is ON the stack — the value for primitives, the reference for objects.',
    why: 'The stack is fast and freed automatically when a function returns; the heap is flexible enough for data that outlives a single call or changes size, but must be cleaned up by the garbage collector.',
    code: {
      label: 'Primitives copy, objects share',
      lang: 'js',
      code: `let a = 10\nlet b = a       // b is a real, separate copy of 10\nb = 20\nconsole.log(a)  // 10 — a is untouched\n\nconst obj1 = { count: 1 }\nconst obj2 = obj1   // copies the REFERENCE, not the object\nobj2.count = 99\nconsole.log(obj1.count) // 99 — same object on the heap`,
      explanation: [
        '`a` holds the primitive 10 directly on the stack.',
        '`b = a` copies the value 10, so changing b never affects a.',
        '`obj1` holds a reference to an object on the heap; `obj2 = obj1` copies that reference.',
        'Now obj1 and obj2 point to the SAME heap object, so mutating through one is visible through the other.',
        'This is the root cause of most "why did my other variable change?" bugs.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'In JavaScript the call stack stores execution contexts as LIFO frames; each frame holds primitive values and references (pointers) of fixed, known size. Objects, arrays, functions, and other dynamically-sized data are allocated on the heap, an unstructured region whose memory is reclaimed by the garbage collector once values become unreachable. Variables bound to objects hold a reference on the stack pointing into the heap, which is why assignment and argument passing copy the value for primitives but copy the reference for objects (call-by-sharing).',

  // 7. Internal Working
  internalWorking: [
    'When a function is invoked, the engine pushes a new stack frame containing its parameters and local bindings; primitive locals store their bytes inline in that frame.',
    'When code creates an object literal, array, or function, the engine allocates that structure on the heap and returns its address.',
    'The variable that "holds" the object actually stores only the heap reference inside its stack slot.',
    'Assignment (`b = a`) and passing arguments copy the contents of the stack slot: a full value for primitives, a reference (address) for objects — so both names alias the same heap object.',
    'When the function returns, its stack frame is popped instantly and its primitive locals vanish; heap objects survive only if still referenced from a reachable root.',
    'The garbage collector periodically traces reachability from roots (the stack, globals) and frees heap objects no stack reference points to anymore.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        STACK (fast, LIFO)              HEAP (flexible, GC-managed)
   ┌───────────────────────┐         ┌──────────────────────────┐
   │ a = 10                 │         │  { count: 1 }   <─┐       │
   │ b = 20  (own copy)     │         │                   │       │
   │ obj1 = ref ───────────────────►──┘                   │       │
   │ obj2 = ref ──────────────────────────────────────────┘       │
   └───────────────────────┘         └──────────────────────────┘
     primitives stored inline          obj1 & obj2 share ONE object
     refs are just addresses           mutating one shows in the other`,

  // 9. Memory Visualization
  memoryVisualization: [
    'STACK: holds primitives (number, boolean, the bits of a small value) and references to heap objects, organized as one frame per active function call.',
    'HEAP: holds every object, array, function, Map/Set, etc. — variable-sized and longer-lived; the place where reference values actually live.',
    'REFERENCE: a variable typed as an object is really a stack slot containing a pointer to a heap address; copying the variable copies the pointer, not the target.',
    'LIFETIME: stack frames die when their function returns; heap objects die only when no reachable reference remains and the GC collects them.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — value vs reference equality',
      lang: 'js',
      code: `console.log(10 === 10)               // true (same primitive value)\nconsole.log({} === {})               // false (two different heap objects)\nconst x = { a: 1 }\nconsole.log(x === x)                  // true (same reference)`,
      explanation: [
        'Primitive comparison compares the actual values, so 10 equals 10.',
        'Two object literals are separate heap allocations, so they are never `===` even if identical in shape.',
        'An object equals itself because both sides resolve to the same reference.',
      ],
    },
    intermediate: {
      label: 'Intermediate — function arguments are call-by-sharing',
      lang: 'js',
      code: `function reassign(o) { o = { changed: true } }   // rebinds local copy only\nfunction mutate(o) { o.changed = true }           // mutates shared object\n\nconst data = { changed: false }\nreassign(data)\nconsole.log(data.changed) // false — only the local reference was reassigned\nmutate(data)\nconsole.log(data.changed) // true — mutated the shared heap object`,
      explanation: [
        'The parameter `o` receives a COPY of the reference, not the variable itself.',
        'Reassigning `o` inside reassign() only repoints the local copy; the caller is unaffected.',
        'Mutating a property through `o` reaches the same heap object, so the caller sees the change.',
        'This is "call by sharing" — neither pure call-by-value nor call-by-reference.',
      ],
    },
    advanced: {
      label: 'Advanced — shallow copy still shares nested heap objects',
      lang: 'js',
      code: `const original = { name: 'Sam', address: { city: 'Pune' } }\nconst copy = { ...original }      // shallow copy\ncopy.name = 'Max'                  // independent (primitive, copied)\ncopy.address.city = 'Delhi'        // shared! nested object is the same ref\nconsole.log(original.name)         // 'Sam'\nconsole.log(original.address.city) // 'Delhi' — leaked through shared nested ref`,
      explanation: [
        'Spread copies the top-level entries: the primitive `name` is duplicated.',
        'But `address` is itself a heap object; the spread copies only its reference.',
        'So copy.address and original.address point to the SAME nested object.',
        'Mutating the nested object is visible through both — the classic shallow-copy trap that motivates deep copy.',
      ],
    },
    realProject: {
      label: 'Real project — Vue/React state mutation bug',
      lang: 'js',
      code: `// React: mutating heap state in place does NOT trigger a re-render\nconst [user, setUser] = useState({ name: 'Sam', tags: ['a'] })\n\n// WRONG — same reference, React sees no change\nuser.tags.push('b')\nsetUser(user)\n\n// RIGHT — new reference on the heap\nsetUser(prev => ({ ...prev, tags: [...prev.tags, 'b'] }))`,
      explanation: [
        'React compares state by reference identity (Object.is) to decide whether to re-render.',
        'Pushing into the existing array mutates the same heap object, so the reference is unchanged and React bails out.',
        'Creating a new object/array gives a fresh reference, signalling a real change.',
        'Vue 3 deep reactivity tracks mutations, but immutable updates are still safer and the same heap/reference rules govern both.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Where do primitives and objects live in memory in JavaScript?',
      answer: 'Primitives are stored by value on the stack (inside the current frame), while objects, arrays, and functions are allocated on the heap, with the variable on the stack holding a reference to them.',
      explanation: 'A strong answer names both regions and notes that the variable holds the value for primitives but a reference for objects.',
    },
    {
      level: 'beginner',
      question: 'Why does copying an object not give you an independent object?',
      answer: 'Because `b = a` for an object copies the reference (the address), not the underlying object. Both variables then point at the same heap object, so mutating one is seen by the other.',
      explanation: 'Interviewers want you to distinguish copying the pointer from copying the data.',
    },
    {
      level: 'intermediate',
      question: 'Is JavaScript pass-by-value or pass-by-reference?',
      answer: 'It is pass-by-value, but the "value" of an object is a reference — often called call-by-sharing. Reassigning a parameter does not affect the caller, but mutating the referenced object does.',
      explanation: 'The nuance (reassign vs mutate) is exactly what separates a memorized answer from real understanding.',
    },
    {
      level: 'intermediate',
      question: 'Why does a shallow copy still let nested mutations leak?',
      answer: 'A shallow copy duplicates top-level primitives but only copies references for nested objects. The nested objects remain shared on the heap, so mutating them is visible through both copies.',
      explanation: 'This connects the stack/heap model directly to the deep-vs-shallow-copy topic.',
    },
    {
      level: 'advanced',
      question: 'How do stack and heap relate to garbage collection and the call stack?',
      answer: 'Stack frames are freed deterministically when functions return. Heap objects are freed by the GC only when they become unreachable from any root (stack or globals). Deep recursion can overflow the stack; retaining heap references can leak memory.',
      explanation: 'Senior signal: linking lifetimes, reachability, stack overflow, and leaks into one coherent model.',
    },
    {
      level: 'senior',
      question: 'What does the stack/heap split imply for performance and engine optimizations?',
      answer: 'Stack allocation is essentially free and cache-friendly; heap allocation costs more and creates GC pressure. Engines like V8 use escape analysis to keep short-lived objects on the stack or in registers, and hidden classes to lay out heap objects predictably. Allocating many short-lived objects in hot paths causes GC churn.',
      explanation: 'Demonstrates awareness of escape analysis, GC pressure, and why allocation patterns matter at scale.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a shallow copy and a deep copy, and how do you make a deep copy safely? (structuredClone)',
    'Why is `{} === {}` false but `NaN === NaN` also false — different reasons?',
    'What causes a "Maximum call stack size exceeded" error?',
    'How does the garbage collector decide what to free?',
    'Why can mutating React/Vue state in place cause missed renders?',
    'How does escape analysis let the engine avoid heap allocation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming `const obj` means the object cannot change.',
      why: '`const` only freezes the binding (the stack reference), not the heap object it points to; properties can still be mutated.',
      fix: 'Use Object.freeze() or immutable update patterns when you need the object itself to be unchangeable.',
    },
    {
      mistake: 'Expecting a spread or Object.assign to fully clone nested data.',
      why: 'They are shallow — nested objects are still shared references on the heap.',
      fix: 'Use structuredClone() (or a deep-clone utility) when you need true independence.',
    },
    {
      mistake: 'Believing JavaScript is pass-by-reference for objects.',
      why: 'Reassigning a parameter does not affect the caller, which proves the reference itself was passed by value.',
      fix: 'Describe it as call-by-sharing: the reference is copied, so mutate-yes, reassign-no.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'State updates must produce new references on the heap so the reconciler detects changes; mutating existing objects/arrays in place silently skips renders.' },
    { area: 'Vue', detail: 'Reactivity wraps heap objects in proxies; understanding reference identity helps explain why replacing vs mutating a ref behaves differently and why reactive() needs objects.' },
    { area: 'Node.js', detail: 'Passing large objects between functions is cheap (only the reference is copied), but holding references in module-level caches keeps heap data alive and can leak.' },
    { area: 'Backend', detail: 'Deep recursion (e.g. unbounded tree traversal) can overflow the call stack; converting to iteration with an explicit heap-allocated stack avoids the crash.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Passing objects by reference is O(1) regardless of size — no data is copied, only a pointer.',
      'Stack-allocated primitives are extremely fast to read/write and need no GC.',
    ],
    bad: [
      'Allocating many short-lived heap objects in hot loops creates garbage-collection pressure and pauses.',
      'Deep recursion grows the stack and can overflow; deeply nested heap structures slow traversal and cloning.',
    ],
    optimizations: [
      'Reuse objects or use object pools in hot paths to reduce allocation churn.',
      'Let the engine keep short-lived objects on the stack by not letting them escape (return/store them).',
      'Prefer iterative algorithms with an explicit stack over deep recursion for large inputs.',
      'Use structuredClone only when needed; shallow copies are far cheaper when nested sharing is acceptable.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['primitive-vs-reference', 'data-types', 'call-stack'],
    nextConcepts: ['garbage-collection', 'shallow-vs-deep-copy', 'memory-leaks', 'object-immutability'],
    dependencyNote:
      'Stack vs heap sits on top of primitive-vs-reference and the call stack, and it directly feeds garbage-collection, shallow-vs-deep-copy, and memory-leaks — you cannot reason about any of those without it.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: STACK (small boxes) on the left, HEAP (a big cloud) on the right.',
      'Put `a = 10` and `b = 20` as values directly inside stack boxes.',
      'Draw `obj1` and `obj2` as stack boxes containing arrows pointing into one object in the heap cloud.',
      'Say: "primitives store their value here; objects store an address pointing there."',
      'Mutate the heap object and show both arrows still hit it → "that is why aliasing happens".',
      'Pop a frame to show stack memory freed instantly, then note the heap object survives until unreachable.',
    ],
    diagram: `   STACK            HEAP
  ┌──────┐       ┌────────────┐
  │ a=10 │       │ {count:1}  │◄─┐
  │ b=20 │       └────────────┘  │
  │ obj1 │───────────────────────┤
  │ obj2 │───────────────────────┘
  └──────┘   two refs, one object`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The stack stores primitives by value and holds references in fixed-size frames freed when a function returns. The heap stores objects, arrays, and functions, with variables keeping only a reference to them. So copying or passing a primitive duplicates the value, but copying or passing an object duplicates only the reference — both names then share one heap object. This explains aliasing bugs, shallow-copy leaks, call-by-sharing, and why the garbage collector, not the stack, frees heap memory.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript memory has two regions. The call stack stores execution frames in LIFO order; each frame holds fixed-size data — primitives by value, and references for objects. The heap is a larger, flexible region where every object, array, and function actually lives. When I write a primitive like `let a = 10`, the value sits in the stack. When I create an object, it is allocated on the heap and my variable just holds a reference, an address, in its stack slot. That distinction explains the behavior people find surprising: assigning `b = a` for a number copies the value, so the two are independent, but assigning `obj2 = obj1` copies only the reference, so both point at the same heap object and mutating one is visible through the other. Function arguments work the same way — JavaScript is call-by-sharing, so I can mutate an object a function received, but reassigning the parameter does not affect the caller. Lifetime differs too: stack frames are freed the instant a function returns, while heap objects live until the garbage collector finds them unreachable. This model underpins shallow-vs-deep copy, immutable state updates in React and Vue, stack overflows from deep recursion, and most memory leaks.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Sharing references is cheap and avoids copying large data, but it couples code: an unexpected mutation in one place ripples everywhere the reference is held.',
      'Immutable updates make change tracking trivial (reference equality) but allocate more heap objects, adding GC pressure.',
    ],
    edgeCases: [
      'Strings are primitives but can be large; engines intern/share them, so identity behaves like a primitive even though storage is heap-backed.',
      'Closures keep heap objects alive even after their defining frame pops — a common leak vector.',
      'Deeply nested or cyclic structures break naive cloning; structuredClone handles cycles, JSON does not.',
    ],
    runtimeBehavior: [
      'V8 escape analysis can keep non-escaping objects in registers/stack, avoiding heap allocation entirely.',
      'Hidden classes give heap objects predictable layouts; changing shape after creation deoptimizes access.',
      'The stack has a fixed size limit; exceeding it (deep/infinite recursion) throws RangeError.',
    ],
    scalability: [
      'High allocation rates in request handlers cause frequent minor GCs; pooling or reuse reduces pause frequency.',
      'Holding references in long-lived caches (module scope, singletons) keeps heap data alive and grows memory over time unless bounded.',
    ],
    productionConcerns: [
      'Most leaks are reachable heap objects nobody intended to keep — listeners, caches, closures pinning data.',
      'Shared-reference mutation bugs are hard to trace; defensive copying or immutability at module boundaries helps.',
      'Stack overflows in production usually mean an unbounded recursive path on large/cyclic input.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Stack = primitives by value + references; fast, LIFO, auto-freed on return.',
    'Heap = objects, arrays, functions; flexible, GC-managed.',
    'Variable for an object holds a reference (address), not the object.',
    'Assigning/passing primitives copies the value; objects copy the reference.',
    'JavaScript is call-by-sharing: mutate-yes, reassign-no.',
    '`const obj` freezes the binding, not the object.',
    'Spread/Object.assign are shallow; nested objects stay shared.',
    'structuredClone() for true deep copies (handles cycles).',
    'Deep recursion can overflow the stack (RangeError).',
    'Heap objects live until unreachable, then GC frees them.',
    'React/Vue: new reference = detected change; in-place mutation can be missed.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: `let a = 5; let b = a; b++; console.log(a, b);` and explain why.',
      hint: 'Is a number stored by value or by reference?',
      solution: {
        lang: 'js',
        code: `let a = 5\nlet b = a   // copies the value 5\nb++\nconsole.log(a, b) // 5 6`,
        explanation: [
          'Numbers are primitives stored by value on the stack.',
          '`b = a` makes an independent copy, so incrementing b leaves a at 5.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a function `swapValues(arr, i, j)` that swaps two elements in place, and explain why the caller sees the change.',
      hint: 'Arrays are heap objects passed by shared reference.',
      solution: {
        lang: 'js',
        code: `function swapValues(arr, i, j) {\n  const tmp = arr[i]\n  arr[i] = arr[j]\n  arr[j] = tmp\n}\nconst nums = [1, 2, 3]\nswapValues(nums, 0, 2)\nconsole.log(nums) // [3, 2, 1]`,
        explanation: [
          'The parameter `arr` receives a copy of the reference, pointing at the same heap array.',
          'Mutating elements through that reference is visible to the caller because it is the same object.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Given `const a = { list: [1] }`, write `clone` so that `clone.list.push(2)` does NOT affect `a.list`.',
      hint: 'A shallow copy is not enough — the nested array is shared.',
      solution: {
        lang: 'js',
        code: `const a = { list: [1] }\nconst clone = structuredClone(a) // deep copy\nclone.list.push(2)\nconsole.log(a.list)     // [1]\nconsole.log(clone.list) // [1, 2]`,
        explanation: [
          'A shallow copy would share the same `list` array reference, so the push would leak.',
          'structuredClone recursively duplicates nested heap objects, giving full independence.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why reassigning a parameter does not affect the caller, but mutating it does. Show both in one snippet.',
      hint: 'Reference is copied (call-by-sharing): reassign repoints the local copy; mutate reaches the shared object.',
      solution: {
        lang: 'js',
        code: `function tryBoth(o) {\n  o.touched = true   // mutates the shared heap object\n  o = { fresh: 1 }   // repoints local copy only\n  o.touched = false  // affects the new local object, not caller's\n}\nconst obj = {}\ntryBoth(obj)\nconsole.log(obj) // { touched: true }`,
        explanation: [
          'The parameter holds a copy of the reference, so mutating a property reaches the original object.',
          'Reassigning the parameter rebinds only the local copy; the caller still references the original.',
          'Hence obj shows `touched: true` from the mutation but nothing from the reassignment.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Stack vs heap is the mental model that makes copying, equality, function arguments, garbage collection, and framework reactivity finally click. Once you see where data lives, a whole category of "spooky action at a distance" bugs becomes predictable.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "pass by value or reference?" and the classic object-copy output question. Product companies (Zoho, Flipkart, Razorpay) probe shallow vs deep copy and state mutation bugs. FAANG-level interviews go into escape analysis, GC pressure, and why immutability aids reconciliation.',
    whatInterviewersExpect:
      'They expect you to place primitives on the stack and objects on the heap, explain call-by-sharing precisely (mutate vs reassign), connect it to shallow/deep copy and reactivity, and ideally mention lifetimes and garbage collection.',
  },
}

export default stackVsHeap
