import type { ConceptLesson } from '../../../types/lesson'

const weakmapWeakset: ConceptLesson = {
  // 1. Concept Summary
  slug: 'weakmap-weakset',
  name: 'WeakMap & WeakSet',
  category: 'memory-model',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'They are the idiomatic way to associate data with an object WITHOUT preventing that object from being garbage collected — the cleanest fix for a whole class of leaks.',
    'They let you attach private/metadata state to objects (including DOM nodes and class instances) that disappears automatically when the object does.',
    'Understanding them proves you grasp reachability deeply: why "weak" references do not count toward keeping an object alive.',
    'Library authors use them constantly (private fields, caches, memoization keyed by objects, tracking "seen" objects in traversal) — recognizing the pattern signals maturity.',
    'Interviewers use WeakMap vs Map to test whether you understand the difference between strong and weak references and the GC consequences.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A WeakMap is a note written in disappearing ink that is tied to a toy — when the toy is thrown away, the note vanishes too.',
    story: [
      'Imagine you stick a little note on each of your toys saying how many times you played with it.',
      'Normally, even if you give a toy away, your list of notes still keeps a copy, so your notebook fills with notes about toys you no longer have.',
      'A WeakMap is special: the note is written in magic ink connected to the toy. The moment a toy is gone for good, its note quietly disappears on its own.',
      'So your notebook only ever holds notes for toys you still have — nothing piles up, and you never have to clean it yourself.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal Map or Set remembers everything you put in it, and that memory of the keys keeps those objects alive forever, even if you stop using them elsewhere.',
    'A WeakMap and WeakSet are different: they hold their keys/values "weakly", meaning they do not stop the cleanup system from removing those objects.',
    'So when an object is no longer used anywhere else in the program, the garbage collector can throw it away, and its WeakMap/WeakSet entry disappears automatically.',
    'Because of this, you cannot list or count what is inside them — they only work with objects as keys, and they are great for attaching data that should die with the object.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'WeakMap is a collection of key-value pairs where the keys must be objects and are held weakly; WeakSet is a collection of objects held weakly. "Weakly" means these references do not prevent garbage collection.',
    how: 'When the only remaining reference to a key object is the WeakMap/WeakSet itself, the GC may reclaim that object and automatically drop its entry. Because entries can vanish at any time, these collections are not iterable and have no size — only has/get/set/delete (WeakMap) or has/add/delete (WeakSet).',
    why: 'They let you attach metadata or membership to objects without creating a leak — the data lifecycle is tied to the object lifecycle automatically, with zero manual cleanup.',
    code: {
      label: 'Metadata that dies with its object',
      lang: 'js',
      code: `const lastSeen = new WeakMap()\n\nfunction touch(user) {\n  lastSeen.set(user, Date.now())  // key MUST be an object\n}\n\nlet user = { id: 1 }\ntouch(user)\nconsole.log(lastSeen.get(user)) // timestamp\n\nuser = null   // no other reference -> user + its WeakMap entry become collectible`,
      explanation: [
        'A WeakMap keys data by an object reference.',
        'Storing the timestamp does NOT keep `user` alive on its own.',
        'When `user` is set to null and nothing else references it, both the object and its entry can be collected.',
        'A regular Map would keep `user` alive forever, causing a leak.',
        'You cannot iterate or read the size — entries may disappear at any moment.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'WeakMap and WeakSet are collections that hold their keys (WeakMap) or values (WeakSet) by weak reference, meaning those references are not counted during reachability analysis by the garbage collector. Keys/members must be objects (or non-registered symbols in WeakMap), because primitives have no identity-based lifetime. Since entries can be reclaimed at any time once their key/member becomes otherwise unreachable, both collections are intentionally non-enumerable, have no size property, and are not iterable; they expose only get/set/has/delete (WeakMap) and add/has/delete (WeakSet). This makes them ideal for associating ancillary data with objects without affecting those objects\' lifetimes.',

  // 7. Internal Working
  internalWorking: [
    'When you set a key in a WeakMap, the engine records an association but marks the reference to the key object as weak — it is excluded from the GC\'s "keep alive" reachability trace.',
    'During a collection cycle, the GC traces strong references from roots; if the only path to a key object is through the WeakMap, that object is treated as unreachable.',
    'Such unreachable keys are reclaimed, and the engine removes the corresponding WeakMap entry (the value loses its sole anchor and may also be collected).',
    'Because the set of live entries depends on GC timing, the spec forbids enumeration, size, and clearing — observing them would expose non-deterministic GC behavior.',
    'WeakSet works the same way but stores objects as weak members for membership testing rather than key-value mapping.',
    'Values in a WeakMap are held strongly only as long as their key is alive — so the value\'s lifetime is effectively bounded by the key\'s.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   STRONG ref (your code)            WEAKMAP (weak ref to key)
        │                                  │
        ▼                                  ▼ (does NOT keep alive)
   ┌──────────┐  key ─────────────►  [ key -> value ]
   │  object  │
   └──────────┘
   drop the strong ref:
        (no strong path left) ──► GC collects object ──► entry auto-removed

   Map would add a STRONG arrow here ──► object pinned forever (leak)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'WEAK KEY: the WeakMap\'s reference to a key object is invisible to the GC\'s reachability trace, so it never keeps the key alive by itself.',
    'STRONG VALUE (bounded): the stored value is held strongly, but only while its key lives; when the key is collected, the value\'s anchor is gone too.',
    'NO STRONG PATH: once your code drops all strong references to the key, the only link is the weak one, so the object is unreachable and collectible.',
    'AUTO-CLEANUP: entry removal happens as part of GC, not deterministically — which is exactly why there is no size or iteration.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — WeakMap vs Map lifetime',
      lang: 'js',
      code: `const strong = new Map()\nconst weak = new WeakMap()\nlet key = {}\nstrong.set(key, 'data')\nweak.set(key, 'data')\nkey = null\n// strong STILL holds the object -> not collectible\n// weak's reference is weak -> object becomes collectible`,
      explanation: [
        'Both collections initially store an entry for the same object.',
        'A Map references its key strongly, so after key = null the object is still reachable via the Map.',
        'A WeakMap references its key weakly, so after key = null nothing strong reaches it.',
        'Only the WeakMap allows the object (and its entry) to be garbage collected.',
      ],
    },
    intermediate: {
      label: 'Intermediate — truly private instance fields',
      lang: 'js',
      code: `const _balance = new WeakMap()\nclass Account {\n  constructor(initial) { _balance.set(this, initial) }\n  deposit(n) { _balance.set(this, _balance.get(this) + n) }\n  get balance() { return _balance.get(this) }\n}\nconst a = new Account(100)\na.deposit(50)\nconsole.log(a.balance) // 150 — no public 'balance' property exists`,
      explanation: [
        'Each instance is the key; its private data is the value.',
        'Nothing on the instance exposes the balance, so it is genuinely private.',
        'When an Account instance is garbage collected, its WeakMap entry disappears automatically.',
        'This was the standard privacy pattern before # private class fields existed.',
      ],
    },
    advanced: {
      label: 'Advanced — WeakSet to track visited nodes safely',
      lang: 'js',
      code: `function deepFreeze(obj, seen = new WeakSet()) {\n  if (obj === null || typeof obj !== 'object' || seen.has(obj)) return obj\n  seen.add(obj)                 // mark visited; does not pin obj\n  Object.values(obj).forEach(v => deepFreeze(v, seen))\n  return Object.freeze(obj)\n}`,
      explanation: [
        'A WeakSet records which objects have already been visited to handle cycles.',
        'Membership testing prevents infinite recursion on circular references.',
        'Because the set is weak, it never extends the lifetime of the objects being processed.',
        'A normal Set would also work here but would needlessly keep references; WeakSet is the leak-safe choice.',
      ],
    },
    realProject: {
      label: 'Real project — DOM-node metadata in a Vue/vanilla widget',
      lang: 'js',
      code: `const handlers = new WeakMap()\nfunction bind(el, fn) {\n  handlers.set(el, fn)          // associate without pinning the node\n  el.addEventListener('click', fn)\n}\n// When the element is removed AND dereferenced, both the node and its\n// WeakMap entry are collectible — no manual cache cleanup needed.`,
      explanation: [
        'Associating per-element data via a WeakMap avoids a global registry that would pin detached nodes.',
        'If the element is removed from the DOM and no longer referenced, it can be collected along with its entry.',
        'A regular Map keyed by elements is a classic detached-DOM leak source.',
        'You still remove the listener explicitly; the WeakMap just prevents the metadata from leaking.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between Map and WeakMap?',
      answer: 'A Map can use any key and holds keys strongly, keeps insertion order, is iterable, and has a size. A WeakMap requires object keys, holds them weakly (so they can be garbage collected), and is not iterable and has no size.',
      explanation: 'A good answer pairs "weak keys" with the GC consequence and the resulting API limitations.',
    },
    {
      level: 'beginner',
      question: 'Why can WeakMap keys only be objects?',
      answer: 'Because the whole point is lifetime tied to object identity and reachability. Primitives are compared by value and have no individual lifetime to track, so weakly holding them would be meaningless.',
      explanation: 'Interviewers want the reachability/identity reasoning, not just "the spec says so".',
    },
    {
      level: 'intermediate',
      question: 'Why is a WeakMap not iterable and why has it no size?',
      answer: 'Because entries can be removed by the garbage collector at any time, exposing iteration or size would leak non-deterministic GC timing into observable behavior. The spec forbids it to keep GC unobservable.',
      explanation: 'The link between weak references, GC non-determinism, and the API restriction shows real depth.',
    },
    {
      level: 'intermediate',
      question: 'Give a real use case for WeakMap.',
      answer: 'Associating private/metadata state with objects without leaking: private class fields (pre-#), caching computed results keyed by an object, or attaching data to DOM nodes that disappears when the node is collected.',
      explanation: 'Concrete, leak-aware use cases signal practical experience.',
    },
    {
      level: 'advanced',
      question: 'How does a WeakMap actually prevent a leak that a Map would cause?',
      answer: 'A Map holds keys strongly, so any object used as a key stays reachable for the Map\'s lifetime — a leak if the object is otherwise dead. A WeakMap holds keys weakly, excluded from reachability, so once no strong reference remains, the GC reclaims the object and drops the entry automatically.',
      explanation: 'Senior signal: framing it as strong-vs-weak references in the reachability graph.',
    },
    {
      level: 'senior',
      question: 'What are the limits of WeakMap for caching, and when would you choose something else?',
      answer: 'WeakMap caches are keyed by object identity, cannot be enumerated or bounded by size, and offer no eviction control or hit-rate visibility. For value-based keys, size limits, or TTL you need a Map-backed LRU/TTL cache. WeakMap is ideal only when the cache lifetime should exactly follow the key object\'s lifetime.',
      explanation: 'Knowing where WeakMap stops and an LRU starts demonstrates design judgement.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Can you clear() a WeakMap? (No — there is no clear/size/iteration)',
    'What types can be WeakMap keys now that symbols are allowed? (objects + non-registered symbols)',
    'How does WeakMap compare to private # class fields for privacy?',
    'When would a Set be better than a WeakSet?',
    'How do WeakMap/WeakSet relate to WeakRef and FinalizationRegistry?',
    'Can you observe when an entry is removed? (No — that is the point)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a WeakMap when you need to iterate or know the size.',
      why: 'WeakMap is intentionally non-enumerable and has no size, so those operations are impossible.',
      fix: 'Use a regular Map (and manage cleanup yourself) when you need enumeration, size, or ordering.',
    },
    {
      mistake: 'Using primitives as keys.',
      why: 'WeakMap/WeakSet reject non-object keys (other than non-registered symbols in WeakMap) because primitives have no identity-based lifetime.',
      fix: 'Use object keys, or a regular Map/Set for primitive keys.',
    },
    {
      mistake: 'Assuming an entry disappears the instant the key goes out of scope.',
      why: 'Removal is tied to GC timing, which is non-deterministic; the entry persists until collection runs.',
      fix: 'Do not depend on timing — treat removal as "eventually" and never use it for observable behavior.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Libraries cache per-object derived data (e.g. memoized selectors keyed by props objects) in WeakMaps so the cache cannot outlive the object and leak.' },
    { area: 'Vue', detail: 'Vue 3 reactivity uses WeakMaps internally to map target objects to their dependency trackers, so reactive metadata is collected when the target is.' },
    { area: 'Node.js', detail: 'WeakMaps associate per-instance private state or request-scoped metadata with objects without holding them alive across the process lifetime.' },
    { area: 'Backend', detail: 'WeakSet tracks "already processed/visited" objects during traversal or validation without preventing those objects from being collected afterward.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'WeakMap/WeakSet prevent leaks by tying ancillary-data lifetime to object lifetime with zero manual cleanup.',
      'Lookup is effectively O(1) by object identity, like Map/Set.',
    ],
    bad: [
      'No size/iteration means you cannot bound or inspect them, so they are unsuitable as general-purpose caches.',
      'Non-deterministic cleanup can make memory behavior harder to reason about under profiling.',
    ],
    optimizations: [
      'Use WeakMap for object-keyed metadata/caches where lifetime should follow the key.',
      'Use a Map-backed LRU/TTL cache when you need bounds, eviction, or hit-rate metrics.',
      'Prefer WeakSet over Set for "seen" tracking in long-lived traversals to avoid pinning objects.',
      'Combine with FinalizationRegistry only when you genuinely need a cleanup hook (rare).',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['garbage-collection', 'stack-vs-heap', 'map-vs-object'],
    nextConcepts: ['weakref-finalizationregistry', 'memory-leaks', 'memory-profiling', 'set-operations'],
    dependencyNote:
      'WeakMap/WeakSet build on garbage-collection and reference semantics; they are a primary tool for preventing memory-leaks and a stepping stone to weakref-finalizationregistry. Contrast them with map-vs-object and set-operations.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an object and a strong arrow from your code variable to it.',
      'Add a Map with a STRONG arrow to the same object; note "Map pins it".',
      'Replace with a WeakMap drawn with a dashed (weak) arrow; note "GC ignores this arrow".',
      'Erase the code variable\'s strong arrow and say "now only the weak arrow remains".',
      'Conclude: "the object is unreachable, GC frees it, and the entry auto-disappears — no leak."',
      'List the API limits: object keys only, no size, no iteration, no clear.',
    ],
    diagram: `  code ──strong──► (object)
   Map ──strong──► (object)   = pinned (leak risk)
   WeakMap ┄┄weak┄┄► (object) = GC may free it
   drop code's arrow -> only weak left -> collected + entry gone`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'WeakMap and WeakSet hold their keys/members weakly, so those references do not stop the garbage collector from reclaiming the object. Keys must be objects, and because entries can vanish on GC timing, they are not iterable, have no size, and cannot be cleared — only get/set/has/delete (WeakMap) and add/has/delete (WeakSet). Their superpower is attaching metadata or membership to objects without leaking: the entry dies with the object. Use them for private state, object-keyed caches, and "visited" tracking; use a Map-backed LRU when you need bounds or enumeration.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'WeakMap and WeakSet are collections designed around the garbage collector. A normal Map or Set holds its entries strongly, which means any object you use as a key stays reachable for the collection\'s entire lifetime — and if that object is otherwise dead, that is a leak. WeakMap and WeakSet instead hold keys or members weakly: those references are excluded from the GC\'s reachability analysis, so they never keep an object alive on their own. The moment your code drops the last strong reference to an object, the GC can reclaim it and the corresponding entry disappears automatically, with no manual cleanup. Because of this, keys must be objects — primitives have no identity-based lifetime — and the collections are intentionally not iterable, have no size, and cannot be cleared, because exposing those would leak non-deterministic GC timing into observable behavior. The classic uses are attaching private or metadata state to objects, like the pre-private-fields class privacy pattern keyed on `this`, caching computed values keyed by an object, associating data with DOM nodes without creating a detached-node leak, and using a WeakSet to track already-visited objects during a cyclic traversal. Their limitation is that they cannot be bounded, enumerated, or given a TTL, so when I need an actual cache with size limits or eviction I reach for a Map-backed LRU instead. WeakMap is the right tool only when the data\'s lifetime should exactly match the key object\'s lifetime.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Automatic leak-free cleanup vs zero introspection: you cannot enumerate, size, or bound a WeakMap.',
      'Privacy via WeakMap vs # private fields: WeakMap works across files and pre-ES2022 but adds indirection; # fields are syntactic, faster, and self-documenting.',
    ],
    edgeCases: [
      'Symbols: non-registered symbols are now valid WeakMap keys, but registered (Symbol.for) symbols are not, because they are effectively global and never collected.',
      'A WeakMap value that strongly references its own key creates a cycle that the GC still handles, but circular strong refs between value and key can keep both alive.',
      'You cannot observe removal timing — relying on it for logic is a bug.',
    ],
    runtimeBehavior: [
      'Entries are reclaimed as part of normal GC cycles, so removal is eventual and unobservable.',
      'Lookups are by object identity (reference equality), not structural equality.',
      'Engines implement WeakMaps with ephemeron semantics so a value cannot keep its own key alive transitively.',
    ],
    scalability: [
      'Great for per-object metadata in long-lived apps because memory tracks object population automatically.',
      'Poor as a global cache at scale: no eviction or size cap means it cannot enforce a memory budget on its own.',
    ],
    productionConcerns: [
      'Use WeakMap to fix detached-DOM and per-instance leaks; verify with heap snapshots that entries actually drop.',
      'Do not build observable features on entry-removal timing.',
      'Document why a WeakMap is chosen so maintainers do not "upgrade" it to a Map and reintroduce a leak.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'WeakMap = object keys held weakly -> keys can be GC\'d.',
    'WeakSet = objects held weakly for membership.',
    'Keys/members must be objects (WeakMap also allows non-registered symbols).',
    'NOT iterable, NO size, NO clear() — by design.',
    'API: WeakMap get/set/has/delete; WeakSet add/has/delete.',
    'Entry disappears automatically when the key is collected.',
    'Use for: private state, object-keyed cache, DOM-node metadata, "visited" tracking.',
    'Prevents leaks that a Map/Set would cause.',
    'Removal timing is GC-driven and unobservable.',
    'Need bounds/eviction/iteration? Use a Map-backed LRU instead.',
    'Vue 3 reactivity uses WeakMaps internally for dependency tracking.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use a WeakMap to count how many times each object has been "touched", without leaking the objects.',
      hint: 'Object key, number value; get current count or default 0.',
      solution: {
        lang: 'js',
        code: `const counts = new WeakMap()\nfunction touch(obj) {\n  counts.set(obj, (counts.get(obj) || 0) + 1)\n  return counts.get(obj)\n}`,
        explanation: [
          'The object is the key; its count is the value.',
          'Because the key is weak, the object can still be collected when no longer used elsewhere, dropping its count.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement private state for a class so the secret cannot be read from the instance.',
      hint: 'Key the WeakMap on `this`.',
      solution: {
        lang: 'js',
        code: `const secret = new WeakMap()\nclass Vault {\n  constructor(code) { secret.set(this, code) }\n  check(input) { return secret.get(this) === input }\n}\nconst v = new Vault('1234')\nv.check('1234') // true; no 'code' property on v`,
        explanation: [
          'Each instance maps to its private value in the WeakMap.',
          'Nothing on the instance exposes the code, and the entry is collected with the instance.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a memoize-by-object-argument that does not keep arguments alive.',
      hint: 'WeakMap keyed by the argument object.',
      solution: {
        lang: 'js',
        code: `function memoizeByObject(fn) {\n  const cache = new WeakMap()\n  return function (obj) {\n    if (cache.has(obj)) return cache.get(obj)\n    const result = fn(obj)\n    cache.set(obj, result)\n    return result\n  }\n}`,
        explanation: [
          'The argument object is the cache key, held weakly.',
          'When the caller stops referencing the object, both it and its cached result become collectible.',
          'A Map here would pin every argument object forever — a leak.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why WeakMap has no size and demonstrate the lifetime difference from Map in code.',
      hint: 'GC non-determinism forbids size/iteration; show the key going collectible.',
      solution: {
        lang: 'js',
        code: `const m = new Map(), wm = new WeakMap()\nlet k = {}\nm.set(k, 1); wm.set(k, 1)\nk = null\n// m still holds the object (m.size === 1) -> not collectible\n// wm holds it weakly -> object + entry collectible; wm has no .size by design`,
        explanation: [
          'Exposing size/iteration would reveal exactly when the GC removed an entry — non-deterministic and unobservable by design.',
          'The Map keeps the object reachable via its strong key; the WeakMap does not.',
          'After k = null, only the WeakMap allows the object to be reclaimed.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'WeakMap/WeakSet are the precise, idiomatic tools for leak-free object association. Knowing exactly when to use them — and when an LRU is better — marks you as someone who reasons about lifetimes, not just data structures.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "Map vs WeakMap differences". Product companies (Zoho, Flipkart, Razorpay) ask for a real use case and why it prevents a leak. FAANG-level interviews probe why there is no size/iteration, ephemeron semantics, and the WeakMap-vs-LRU caching trade-off.',
    whatInterviewersExpect:
      'They expect "weak keys, GC can reclaim them", object-only keys, the non-enumerable/no-size API and WHY, plus concrete leak-prevention use cases and the limits versus a bounded cache.',
  },
}

export default weakmapWeakset
