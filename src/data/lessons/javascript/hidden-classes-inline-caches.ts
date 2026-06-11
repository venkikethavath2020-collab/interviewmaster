import type { ConceptLesson } from '../../../types/lesson'

const hiddenClassesInlineCaches: ConceptLesson = {
  // 1. Concept Summary
  slug: 'hidden-classes-inline-caches',
  name: 'Hidden Classes & Inline Caches',
  category: 'fundamentals-engine',
  difficulty: 'expert',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Hidden classes and inline caches are how dynamically typed JavaScript gets near-C property-access speed — they are the heart of engine optimization.',
    'They explain the single most actionable performance rule: keep object shapes stable, and property access stays fast.',
    'Misunderstanding them causes subtle slowdowns — shape churn, delete, and conditional property addition silently degrade hot code.',
    'They are the foundation the JIT relies on: inline caches feed the type/shape feedback that drives optimization and deoptimization.',
    'Expert interviews use them to test whether you truly understand engine internals beyond "V8 is fast".',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A hidden class is like a labeled drawer layout, and an inline cache is remembering which drawer your socks are in so you do not search every time.',
    story: [
      'Imagine a dresser where every drawer has a fixed thing: top drawer socks, second drawer shirts, third drawer pants.',
      'If every dresser in the house uses the SAME layout, then once you learn "socks are in the top drawer", you can grab socks instantly from any dresser without looking.',
      'But if one dresser puts socks in the middle and another puts them on the bottom, you have to search each time — slow!',
      'JavaScript objects are dressers. When they all share the same layout (hidden class), the engine remembers where each thing lives (inline cache) and grabs it instantly. Mixing up layouts forces it to search, which is slower.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript objects do not have fixed types, so the engine secretly gives each object a "shape" describing which properties it has and where they are stored.',
    'Objects created the same way (same properties, same order) share the same secret shape, called a hidden class.',
    'When your code reads a property, the engine remembers the shape it saw and where that property lives, so next time it can jump straight there. That memory is the inline cache.',
    'If objects keep changing shape, the engine cannot reuse its memory and has to look things up the slow way, which is why consistent objects run faster.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Hidden classes (V8 calls them "Maps", other engines call them "shapes" or "structures") are internal descriptors of an object\'s structure — which properties it has and at what memory offsets. Inline caches (ICs) are per-call-site caches that remember the hidden class(es) seen and where a property lives, so repeated access skips the slow lookup.',
    how: 'When you add properties to an object, the engine transitions it through a chain of hidden classes. At each property-access site, the IC records the hidden class and the property\'s offset; if the next object has the same hidden class, access is a direct offset read.',
    why: 'This lets dynamically typed property access compile to a fast fixed-offset load instead of a hash-map lookup, dramatically speeding up real programs.',
    code: {
      label: 'Two objects sharing a hidden class',
      lang: 'js',
      code: `function Point(x, y) {\n  this.x = x   // transition: {} -> {x}\n  this.y = y   // transition: {x} -> {x, y}\n}\nconst a = new Point(1, 2)\nconst b = new Point(3, 4)\n// a and b share the SAME hidden class {x, y}\nfunction getX(p) { return p.x } // IC here becomes monomorphic\ngetX(a); getX(b) // fast: same shape, cached offset for x`,
      explanation: [
        'Assigning `x` then `y` transitions the object through hidden classes `{} -> {x} -> {x,y}`.',
        'Because `a` and `b` are built identically, they end up with the same final hidden class.',
        'The IC inside `getX` records that shape and the offset of `x` on the first call.',
        'The second call sees the same hidden class, so the IC stays monomorphic and access is a direct offset read.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Hidden classes (Maps/shapes/structures) are engine-internal metadata objects that describe an object\'s layout: its set of properties and their storage offsets. As properties are added, an object transitions along a tree of hidden classes; objects constructed identically converge on shared hidden classes, enabling structural sharing. Inline caches are per-access-site caches that record the hidden class(es) observed and resolved property location; they progress from uninitialized to monomorphic (one shape), polymorphic (a few shapes), to megamorphic (many shapes, cache effectively bypassed). Monomorphic ICs let property access compile to a constant-offset load and feed the optimizing JIT; shape divergence degrades to slower dictionary lookups and can prevent or undo optimization.',

  // 7. Internal Working
  internalWorking: [
    'On creation, an object starts with a base hidden class; each added property creates a transition to a new hidden class recording that property\'s name and offset.',
    'Objects built with the same properties in the same order follow the same transition chain and thus share the same final hidden class (structural sharing).',
    'At each property-access call site, the engine installs an inline cache; on first execution it does a full lookup, then records the hidden class and the property\'s offset.',
    'On subsequent executions, the IC checks if the object\'s hidden class matches the cached one; if so, it reads the value at the cached offset directly (a monomorphic hit).',
    'If a different hidden class appears, the IC becomes polymorphic (caching a few shapes); past a threshold it becomes megamorphic and falls back to a generic, slower lookup.',
    'The optimizing JIT uses IC feedback: monomorphic sites can be inlined to a fixed-offset load in optimized code; shape changes invalidate that and may trigger deoptimization.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   HIDDEN CLASS TRANSITIONS (shared structure)
     {}  ──add x──►  {x}  ──add y──►  {x,y}
                                       ▲   ▲
                a = {x,y} ─────────────┘   │
                b = {x,y} ─────────────────┘   (a,b share {x,y})

   INLINE CACHE at  return p.x
     ┌───────────────────────────────────────────┐
     │ seen shape: {x,y}  →  x at offset 0         │  monomorphic (fast)
     │ + shape {x,y,z}    →  polymorphic (slower)  │
     │ + many shapes      →  megamorphic (generic) │
     └───────────────────────────────────────────┘`,

  // 9. Memory Visualization
  memoryVisualization: [
    'OBJECT HEADER: each heap object stores a pointer to its hidden class (Map), plus its in-object property slots at fixed offsets.',
    'HIDDEN CLASS TREE (heap): hidden classes are shared metadata; many objects point to the same hidden class, so the structure is stored once, not per object.',
    'INLINE CACHE (in compiled code/feedback vector): stores the observed hidden class pointer(s) and resolved offsets for a specific access site.',
    'DICTIONARY/SLOW MODE: objects that mutate too unpredictably are switched to a dictionary (hash map) representation, trading fast offset access for flexibility — and losing IC benefits.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — consistent construction shares a shape',
      lang: 'js',
      code: `const u1 = { id: 1, name: 'A' }\nconst u2 = { id: 2, name: 'B' }\n// Same keys, same order -> same hidden class\nfunction getName(u) { return u.name } // monomorphic IC\ngetName(u1); getName(u2)`,
      explanation: [
        'Both literals declare `id` then `name`, so they transition to the same hidden class.',
        'The `getName` access site sees one shape and stays monomorphic.',
        'Property access compiles to a direct offset read — the fast path.',
        'This is the default good case you get for free when objects are built uniformly.',
      ],
    },
    intermediate: {
      label: 'Intermediate — property order changes the hidden class',
      lang: 'js',
      code: `const a = { x: 1, y: 2 } // shape: x then y\nconst b = { y: 2, x: 1 } // shape: y then x -> DIFFERENT hidden class\n\nfunction sum(o) { return o.x + o.y }\nsum(a) // monomorphic\nsum(b) // different shape -> IC becomes polymorphic (slower)`,
      explanation: [
        'Even with the same keys, a different insertion order produces a different hidden class.',
        '`a` and `b` therefore do not share a shape.',
        'The `sum` access site now sees two shapes and becomes polymorphic.',
        'Keeping a consistent property order is a concrete way to avoid this slowdown.',
      ],
    },
    advanced: {
      label: 'Advanced — delete forces slow (dictionary) mode',
      lang: 'js',
      code: `const obj = { a: 1, b: 2, c: 3 }\ndelete obj.b   // breaks the offset layout -> often switches to dictionary mode\n\nfunction readA(o) { return o.a }\nreadA(obj) // may now miss the fast offset path`,
      explanation: [
        '`delete` removes a property in the middle of the layout, invalidating fixed offsets.',
        'The engine often demotes the object to dictionary (hash-map) mode to handle the gap.',
        'Dictionary-mode access is slower and cannot benefit from monomorphic ICs.',
        'Prefer setting the property to null/undefined instead of deleting in hot objects.',
      ],
    },
    realProject: {
      label: 'Real project — uniform view models in a Node/Vue list',
      lang: 'js',
      code: `// Normalize rows so every record has the SAME shape and key order\nfunction toView(row) {\n  return {\n    id: row.id,\n    title: row.title ?? '',\n    done: row.done ?? false,   // always present, even if missing in source\n  }\n}\nconst items = rows.map(toView) // all items share one hidden class\n// In Vue, rendering this uniform array keeps property access on the fast IC path.`,
      explanation: [
        'Every record is built with the same keys in the same order, converging on one hidden class.',
        'Missing fields are filled with defaults so no record diverges in shape.',
        'Array methods and template access then hit monomorphic ICs across the whole list.',
        'This is the practical payoff: uniform data shapes keep render and processing hot paths fast.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'intermediate',
      question: 'What is a hidden class?',
      answer: 'It is an engine-internal descriptor of an object\'s structure — which properties it has and at what memory offsets. Objects built identically share a hidden class, letting the engine access properties by fixed offset instead of a hash lookup.',
      explanation: 'Captures both the "what" (shape descriptor) and the "why" (fast offset access via sharing).',
    },
    {
      level: 'intermediate',
      question: 'What is an inline cache?',
      answer: 'A per-access-site cache that remembers the hidden class(es) seen at that site and the resolved property location, so repeated access on the same shape skips the lookup. It can be monomorphic, polymorphic, or megamorphic.',
      explanation: 'Names the location (call site), what it stores (shape + offset), and the monomorphic→megamorphic progression.',
    },
    {
      level: 'advanced',
      question: 'Why does property insertion order matter for performance?',
      answer: 'Because hidden classes are determined by the sequence of property additions. {x,y} and {y,x} produce different hidden classes, so objects with the same keys in different orders do not share a shape, pushing access sites toward polymorphism and slower lookups.',
      explanation: 'Demonstrates the transition-chain mechanism and its real performance consequence.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between monomorphic, polymorphic, and megamorphic call sites?',
      answer: 'Monomorphic: the site has seen one hidden class — fastest, inlinable. Polymorphic: a few shapes (V8 caches up to ~4) — slower, still cached. Megamorphic: too many shapes — the cache is bypassed for a generic lookup, the slowest, and resists optimization.',
      explanation: 'Shows precise understanding of IC states and their performance ordering.',
    },
    {
      level: 'senior',
      question: 'How do hidden classes and inline caches interact with the JIT?',
      answer: 'ICs collect type/shape feedback during interpretation. Monomorphic sites let the optimizing JIT inline property access as a constant-offset load. If an object\'s hidden class later changes, the assumption is invalidated, which can deoptimize the function back to bytecode.',
      explanation: 'Connects the object model to JIT specialization and deoptimization — the full picture.',
    },
    {
      level: 'expert',
      question: 'What operations push an object into dictionary (slow) mode and why is that bad?',
      answer: 'Deleting properties, adding many properties dynamically, using objects as ad-hoc maps with arbitrary string keys, or extreme shape divergence can switch an object to a dictionary (hash-map) representation. That loses fixed-offset access and inline-cache benefits, making property access markedly slower and blocking related JIT optimizations.',
      explanation: 'Expert-level: identifies concrete triggers for the slow path and the optimization consequences.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does V8 call hidden classes internally, and what do other engines call them?',
    'How many shapes can a polymorphic inline cache hold before going megamorphic?',
    'Why is using an object as a dynamic map sometimes slower than using a Map?',
    'How do you keep object shapes stable when some fields are optional?',
    'How would you detect IC/shape problems while profiling?',
    'Do arrays have an analogous concept (element kinds)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Adding properties in different orders across instances.',
      why: 'Different insertion orders create different hidden classes, so instances do not share a shape.',
      fix: 'Initialize all properties in a fixed order (ideally in a constructor or single factory) for every instance.',
    },
    {
      mistake: 'Using delete to clear properties on hot objects.',
      why: 'delete breaks the offset layout and often demotes the object to slow dictionary mode.',
      fix: 'Set the property to null/undefined instead, preserving the hidden class.',
    },
    {
      mistake: 'Adding properties conditionally so some instances have extra fields.',
      why: 'Optional fields produce multiple shapes, making access sites polymorphic or megamorphic.',
      fix: 'Always define every field up front (with defaults) so all instances converge on one shape.',
    },
    {
      mistake: 'Using a plain object as a dynamic key/value map with arbitrary keys.',
      why: 'Constantly adding new string keys causes shape churn and can force dictionary mode.',
      fix: 'Use a Map for dynamic key/value collections; reserve plain objects for fixed-shape records.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'High-throughput services normalize DB rows and request payloads into uniformly shaped objects so hot serializers and handlers keep monomorphic ICs and stay JIT-optimized.' },
    { area: 'Backend', detail: 'ORMs and data layers that return consistently shaped entities help V8 share hidden classes across millions of records, reducing CPU per request.' },
    { area: 'Vue', detail: 'Keeping reactive state objects with stable, fully-initialized shapes avoids shape churn during re-renders, keeping template property access on the fast path.' },
    { area: 'React', detail: 'Stable prop/state object shapes (no conditionally added fields) keep render-time property access monomorphic and reduce deopts in frequently re-rendered components.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Monomorphic access sites compile to a single constant-offset load — about as fast as a struct field read.',
      'Shared hidden classes let millions of identically shaped objects reuse one shape descriptor, saving memory and lookup time.',
    ],
    bad: [
      'Shape divergence pushes ICs to polymorphic/megamorphic states with progressively slower lookups.',
      'delete, conditional fields, and object-as-map usage can force dictionary mode and block JIT optimization.',
    ],
    optimizations: [
      'Initialize all object properties once, in a fixed order, for every instance.',
      'Replace delete with assigning null/undefined on hot objects.',
      'Use Map for dynamic key/value collections instead of plain objects with arbitrary keys.',
      'Normalize external data into uniform shapes at the boundary so internal hot paths see one shape.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['javascript-engines', 'v8-architecture', 'jit-compilation'],
    nextConcepts: ['object-creation', 'map-vs-object', 'property-descriptors', 'memory-profiling'],
    dependencyNote:
      'This is the object-model substrate beneath jit-compilation and v8-architecture: ICs supply the feedback the JIT specializes on. It informs object-creation and map-vs-object choices and is diagnosed via memory-profiling.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the transition chain: {} → {x} → {x,y}, noting each arrow adds a property at a fixed offset.',
      'Show two objects a and b both pointing to the final {x,y} hidden class ("shared shape").',
      'Draw an access site "p.x" with a small box labeled "IC: shape {x,y} → offset 0".',
      'Add a second shape arriving and label the box monomorphic → polymorphic → megamorphic.',
      'Say: "Identically built objects share a hidden class, so an inline cache can read properties by fixed offset; shape divergence degrades the cache and slows access."',
    ],
    diagram: `  {} → {x} → {x,y}        a ─┐
                          b ─┴─► shared hidden class {x,y}

   access p.x:  [IC]  {x,y}→offset0   (monomorphic = fast)
                       + {y,x}         (polymorphic = slower)
                       + many          (megamorphic = generic/slow)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Hidden classes are engine-internal descriptors of an object\'s shape — its properties and their offsets. Objects built identically share a hidden class, so the engine can access properties by fixed offset instead of a hash lookup. Inline caches at each access site remember the shapes seen and the resolved offsets; a site is fast when monomorphic (one shape), slower when polymorphic, and slowest when megamorphic. delete and conditional/extra fields cause shape churn or dictionary mode and can deoptimize hot code. So keep object shapes uniform and fully initialized.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Because JavaScript objects are dynamic, the engine cannot rely on a static struct layout, so it invents one at runtime using hidden classes — V8 calls them Maps, other engines call them shapes or structures. A hidden class describes which properties an object has and at what offsets. The key trick is that objects constructed the same way — same properties added in the same order — transition through the same chain of hidden classes and end up sharing the same final one. That sharing lets the engine treat property access almost like a C struct field: a fixed-offset load. Inline caches make this concrete. At each property-access site in your code, the engine installs a cache. The first time, it does a full lookup and records the object\'s hidden class and the property\'s offset. Next time, if the object has the same hidden class, it reads straight from the cached offset — that is a monomorphic, fast hit. If a few different shapes show up, the site becomes polymorphic and a bit slower; if many shapes show up, it goes megamorphic and falls back to a generic, slow lookup. These caches also feed the JIT: monomorphic sites get inlined as constant-offset loads, but if an object\'s hidden class changes, that assumption is invalidated and the function can deoptimize. The practical rules follow directly: build objects with the same fields in the same order, do not use delete on hot objects — set null instead, avoid conditionally added fields, and use a Map for dynamic key/value collections so you do not churn shapes.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Uniform, fully-initialized shapes maximize IC hits but cost a little memory (carrying default/null fields you may not need).',
      'Plain objects give fast fixed-shape access; Maps give predictable performance for dynamic keys but lose struct-like offset speed — pick per use case.',
    ],
    edgeCases: [
      'Property insertion order changes the hidden class, so {x,y} and {y,x} are distinct shapes despite identical keys.',
      'delete or adding many late properties can demote an object to dictionary mode, permanently losing fast-path access for it.',
      'Array element-kind transitions (packed-smi → packed-double → holey) are the array analog and similarly affect performance.',
    ],
    runtimeBehavior: [
      'ICs progress uninitialized → monomorphic → polymorphic (a small bounded set) → megamorphic (generic), each step slower.',
      'Megamorphic sites generally cannot be specialized by the optimizer, so they cap the speed of surrounding code.',
      'A hidden-class change to an object flowing through optimized code can trigger deoptimization of that function.',
    ],
    scalability: [
      'At scale (millions of objects/records), shared hidden classes save both memory and per-access CPU, materially affecting throughput.',
      'Data layers that emit inconsistent shapes propagate polymorphism into every consumer hot path, so normalize at the source.',
    ],
    productionConcerns: [
      'Profile with V8 tooling (e.g. IC state inspection, --trace-ic in builds that support it, or DevTools) to find megamorphic hot sites.',
      'Establish data-normalization boundaries so external/variable payloads become uniform internal shapes.',
      'Audit hot objects for delete and conditional fields during performance reviews; they are common silent regressions.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Hidden class = internal descriptor of object shape (props + offsets).',
    'V8: "Maps"; others: "shapes"/"structures".',
    'Identically built objects share a hidden class (structural sharing).',
    'Inline cache = per-access-site memory of shape + property offset.',
    'IC states: monomorphic (fast) → polymorphic → megamorphic (slow).',
    'Insertion ORDER matters: {x,y} ≠ {y,x} hidden class.',
    'delete / conditional fields → shape churn or dictionary mode (slow).',
    'Dictionary mode loses fixed-offset access and IC benefits.',
    'ICs feed the JIT; shape change can cause deopt.',
    'Fix: uniform, fully-initialized shapes; null not delete; Map for dynamic keys.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a factory so every produced object has the same hidden class even when some inputs are missing.',
      hint: 'Always set all fields, defaulting missing ones.',
      solution: {
        lang: 'js',
        code: `function makeUser(input) {\n  return {\n    id: input.id,\n    name: input.name ?? '',\n    age: input.age ?? null,\n  }\n}\nmakeUser({ id: 1, name: 'A', age: 30 })\nmakeUser({ id: 2 }) // still { id, name, age } -> same shape`,
        explanation: [
          'Every object is built with the same keys in the same order.',
          'Defaults fill missing inputs so no instance diverges in shape.',
          'All instances share one hidden class, keeping consumer access sites monomorphic.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show two objects with the same keys that do NOT share a hidden class, and explain why.',
      hint: 'Insertion order is part of the shape.',
      solution: {
        lang: 'js',
        code: `const a = {}; a.x = 1; a.y = 2 // shape: x then y\nconst b = {}; b.y = 2; b.x = 1 // shape: y then x\n// Same keys {x,y} but DIFFERENT hidden classes due to insertion order.`,
        explanation: [
          'Hidden classes are determined by the order properties are added.',
          'Adding x-then-y vs y-then-x follows different transition chains.',
          'So despite identical final keys, the two objects have different hidden classes.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Refactor code that uses delete in a hot object into a version that preserves the hidden class.',
      hint: 'Assign null instead of deleting.',
      solution: {
        lang: 'js',
        code: `// BEFORE: delete demotes to dictionary mode\n// function clear(o) { delete o.cache; return o }\n\n// AFTER: keep the shape, clear the value\nfunction clear(o) { o.cache = null; return o }`,
        explanation: [
          '`delete` removes the property and invalidates the fixed-offset layout.',
          'Setting `o.cache = null` keeps the same hidden class and offsets.',
          'Access sites stay monomorphic and the object avoids slow dictionary mode.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You have a hot loop reading .x from objects built in several places with different field orders. Make the access monomorphic.',
      hint: 'Normalize through a single factory before the loop.',
      solution: {
        lang: 'js',
        code: `// One canonical factory enforces a single shape/order everywhere\nfunction Point(x, y) { return { x, y } } // always x then y\n\n// Normalize mixed-origin data through it before the hot loop\nfunction normalize(raw) { return Point(raw.x, raw.y) }\nconst points = mixedOrigin.map(normalize)\n\nlet sum = 0\nfor (const p of points) sum += p.x // monomorphic: all share {x,y}`,
        explanation: [
          'Routing all objects through one factory guarantees identical key order and shape.',
          'The normalized array contains only one hidden class.',
          'The hot loop\'s `.x` access site stays monomorphic, hitting the fast offset path.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Hidden classes and inline caches are the deepest practical explanation of why JavaScript is fast and how to keep it fast. Mastering them turns vague "make it faster" advice into a precise rule: keep object shapes uniform. It is the kind of internals knowledge that marks an expert.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) almost never ask this. Product companies (Zoho, Flipkart, Razorpay) may ask what hidden classes are and why shape stability matters. FAANG-level and performance-focused interviews probe IC states, dictionary mode, the JIT connection, and how you would diagnose a megamorphic hot site.',
    whatInterviewersExpect:
      'They expect you to define hidden classes and inline caches precisely, explain monomorphic/polymorphic/megamorphic progression, name what causes shape churn or dictionary mode (insertion order, delete, conditional fields), connect ICs to JIT specialization and deopt, and give concrete shape-stability practices.',
  },
}

export default hiddenClassesInlineCaches
