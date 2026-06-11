import type { ConceptLesson } from '../../../types/lesson'

const proxyReflect: ConceptLesson = {
  // 1. Concept Summary
  slug: 'proxy-reflect',
  name: 'Proxy & Reflect',
  category: 'objects-prototypes',
  difficulty: 'expert',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Proxy lets you intercept and customize fundamental object operations (get, set, has, delete, function calls) — it is metaprogramming built into the language.',
    'It powers Vue 3\'s entire reactivity system, Immer\'s copy-on-write drafts, and many validation, logging, and ORM libraries.',
    'Reflect gives you the canonical default behavior for each operation so your trap can do its thing and then forward correctly — the two are designed to be used together.',
    'Interviewers ask about it to test deep understanding: how property access actually works, the meaning of receiver, and the invariants the engine enforces.',
    'Misusing Proxy creates subtle, hard-to-debug bugs (broken `this`, infinite recursion, identity confusion), so understanding it signals senior-level mastery.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Proxy is like a helpful receptionist standing in front of an office — every request goes through them first.',
    story: [
      'Imagine an important person in an office, and a receptionist sitting at the front desk.',
      'Anyone who wants to talk to that person, give them something, or take something from them must go through the receptionist first.',
      'The receptionist can do extra things: write down who visited, refuse rude visitors, or correct a message before passing it along — and then they hand the request to the real person.',
      'A Proxy is that receptionist for an object: every time code reads, writes, or checks something, the Proxy gets to step in, do something extra, and then (using Reflect) pass the request to the real object.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally when you read or change a property on an object, JavaScript just does it directly.',
    'A Proxy wraps an object so you can put "traps" in between — little functions that run whenever someone reads, writes, or checks a property.',
    'Inside a trap you can add behavior like logging, validation, or default values, and then let the real action happen.',
    'Reflect is a helper object whose methods do the normal, default operation, so your trap can finish the job the standard way.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Proxy is a wrapper around a target object that intercepts operations via handler functions called traps (get, set, has, deleteProperty, apply, etc.). Reflect is a built-in object whose methods perform the default version of those same operations.',
    how: 'You create `new Proxy(target, handler)`, where handler defines traps. Inside a trap you run custom logic, then typically call the matching `Reflect.*` method to perform the real operation and return its result.',
    why: 'It lets you add cross-cutting behavior — validation, logging, reactivity, access control — without modifying the original object or its call sites.',
    code: {
      label: 'A logging + validating proxy',
      lang: 'js',
      code: `const user = { age: 30 }\n\nconst guarded = new Proxy(user, {\n  get(target, key, receiver) {\n    console.log('read', key)\n    return Reflect.get(target, key, receiver)\n  },\n  set(target, key, value, receiver) {\n    if (key === 'age' && typeof value !== 'number') {\n      throw new TypeError('age must be a number')\n    }\n    return Reflect.set(target, key, value, receiver)\n  },\n})\n\nguarded.age          // logs "read age" → 30\nguarded.age = 31     // ok\n// guarded.age = 'x' // throws TypeError`,
      explanation: [
        'new Proxy wraps `user` with custom get/set traps.',
        'The get trap logs the key, then Reflect.get returns the real value.',
        'The set trap validates that age is a number before allowing the write.',
        'Reflect.set performs the actual assignment and returns a boolean the proxy must return.',
        'Call sites use `guarded` exactly like a normal object — the interception is invisible.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Proxy is an exotic object that virtualizes another object (the target) by intercepting its internal methods through a handler whose properties are traps (get, set, has, deleteProperty, ownKeys, getPrototypeOf, apply, construct, etc.). Each trap may run custom logic and must respect engine-enforced invariants for non-configurable/non-writable properties. Reflect is a namespace object exposing one static method per interceptable operation, mirroring the trap signatures, so a trap can forward to the default behavior. Reflect methods return meaningful values (e.g. Reflect.set returns a boolean) and correctly thread the receiver argument for proper getter/setter and prototype handling.',

  // 7. Internal Working
  internalWorking: [
    'When you operate on a Proxy (e.g. read a property), the engine invokes the corresponding internal method, which dispatches to the handler\'s trap if defined, otherwise to the target\'s default behavior.',
    'The trap receives the target, the property key, and a receiver (the object the operation was originally called on — important for inherited accessors).',
    'Inside the trap you can run side effects or alter arguments, then call Reflect.<op>(target, key, receiver) to perform the genuine operation.',
    'Reflect threads the receiver so that getters/setters run with the correct `this`, especially when the Proxy sits in a prototype chain.',
    'The engine enforces invariants: e.g. a get trap cannot report a different value for a non-writable, non-configurable property; violating an invariant throws a TypeError.',
    'For function targets, apply and construct traps intercept calls and `new`; the Proxy itself remains callable/constructable, preserving its exotic behavior.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   code: proxy.age = 31
        │
        ▼
   ┌──────────── Proxy ────────────┐
   │  handler.set(target,key,val,  │
   │              receiver)        │  ← your trap runs (validate/log)
   │        │                      │
   │        ▼                      │
   │  Reflect.set(...) ────────────┼──► TARGET object  { age: 31 }
   └───────────────────────────────┘     (real operation)
        ▲
        └─ returns boolean back through the trap`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: both the Proxy (an exotic object) and the target live on the heap; the Proxy holds internal references to its target and handler.',
    'REFERENCE: the Proxy is a distinct object identity from the target — `proxy !== target` — which matters for Map keys, WeakMap, and identity checks.',
    'A Proxy keeps its target reachable, so a forgotten Proxy pins the target in memory (potential leak).',
    'Revocable proxies (Proxy.revocable) let you sever the target reference, after which any operation throws and the target can be collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — default values via get trap',
      lang: 'js',
      code: `const withDefaults = new Proxy({}, {\n  get(target, key, receiver) {\n    return key in target ? Reflect.get(target, key, receiver) : 'N/A'\n  },\n})\nwithDefaults.name = 'Sam'\nconsole.log(withDefaults.name)    // 'Sam'\nconsole.log(withDefaults.email)   // 'N/A'`,
      explanation: [
        'The get trap checks whether the key exists on the target.',
        'If it does, Reflect.get returns the real value with the correct receiver.',
        'If not, it returns a fallback "N/A" instead of undefined.',
        'A clean way to add default-value behavior without touching the object.',
      ],
    },
    intermediate: {
      label: 'Intermediate — negative array indexing',
      lang: 'js',
      code: `function negArray(arr) {\n  return new Proxy(arr, {\n    get(target, key, receiver) {\n      const i = Number(key)\n      if (Number.isInteger(i) && i < 0) {\n        return Reflect.get(target, target.length + i, receiver)\n      }\n      return Reflect.get(target, key, receiver)\n    },\n  })\n}\nconst a = negArray(['a', 'b', 'c'])\nconsole.log(a[-1]) // 'c'\nconsole.log(a[0])  // 'a'`,
      explanation: [
        'We intercept get and detect negative integer indices.',
        'For negatives we translate to length + i, like Python.',
        'All other keys (including methods like length, push) forward to the real array via Reflect.get.',
        'The proxy still behaves as a normal array for everything else.',
      ],
    },
    advanced: {
      label: 'Advanced — minimal reactive system (Vue-style)',
      lang: 'js',
      code: `let activeEffect = null\nconst deps = new WeakMap()\n\nfunction reactive(obj) {\n  return new Proxy(obj, {\n    get(target, key, receiver) {\n      if (activeEffect) track(target, key)\n      return Reflect.get(target, key, receiver)\n    },\n    set(target, key, value, receiver) {\n      const result = Reflect.set(target, key, value, receiver)\n      trigger(target, key)\n      return result\n    },\n  })\n}\nfunction track(t, k) { /* record activeEffect under deps[t][k] */ }\nfunction trigger(t, k) { /* re-run effects for deps[t][k] */ }\n\nfunction effect(fn) { activeEffect = fn; fn(); activeEffect = null }`,
      explanation: [
        'reactive wraps an object so reads (get) register the current effect as a dependency.',
        'Writes (set) perform the real assignment via Reflect.set, then trigger re-runs of dependent effects.',
        'This is the exact shape of Vue 3 reactivity — Proxy makes get/set observable.',
        'Reflect keeps default semantics intact (receiver, return value) so reactivity does not corrupt behavior.',
      ],
    },
    realProject: {
      label: 'Real project — read-only / frozen API surface in a library',
      lang: 'js',
      code: `function readonly(obj) {\n  return new Proxy(obj, {\n    set() { throw new Error('This object is read-only') },\n    deleteProperty() { throw new Error('This object is read-only') },\n    get(target, key, receiver) {\n      const value = Reflect.get(target, key, receiver)\n      return value && typeof value === 'object' ? readonly(value) : value\n    },\n  })\n}\nconst config = readonly({ db: { host: 'localhost' } })\n// config.db.host = 'x'  // throws — even nested!`,
      explanation: [
        'set and deleteProperty traps reject all mutations.',
        'The get trap recursively wraps nested objects so deep read-only is enforced lazily.',
        'Unlike Object.freeze, this is deep without eagerly walking the whole tree.',
        'Vue 3 ships exactly this as `readonly()` for protecting props and store state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Proxy in JavaScript?',
      answer: 'A Proxy wraps a target object and lets you intercept fundamental operations (get, set, has, delete, function calls) using handler functions called traps, so you can customize or augment behavior without changing the original object.',
      explanation: 'A good answer names traps and gives a concrete use like validation or logging.',
    },
    {
      level: 'beginner',
      question: 'What is Reflect and why is it used with Proxy?',
      answer: 'Reflect is a built-in object whose static methods perform the default version of each interceptable operation. Inside a Proxy trap you call the matching Reflect method to forward to the real behavior, correctly handling the receiver and return value.',
      explanation: 'Pairing the two and mentioning receiver/return-value correctness is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'Why use Reflect.get(target, key, receiver) instead of target[key] inside a get trap?',
      answer: 'Because Reflect.get threads the receiver, so any getter on the target runs with the correct `this`. With target[key], an inherited accessor would use the target as this instead of the proxy/inheriting object, breaking expected behavior in prototype chains.',
      explanation: 'Receiver-correctness for accessors is the classic intermediate/advanced Proxy question.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue 3 use Proxy for reactivity, and how is it better than Vue 2?',
      answer: 'Vue 3 wraps reactive objects in a Proxy: the get trap tracks dependencies and the set trap triggers updates. Unlike Vue 2 (Object.defineProperty), Proxy intercepts property additions/deletions and array index changes natively, so no $set workarounds are needed.',
      explanation: 'Connecting Proxy traps to a real framework and contrasting with defineProperty shows applied depth.',
    },
    {
      level: 'advanced',
      question: 'What invariants does the engine enforce on Proxy traps?',
      answer: 'Traps must respect the target\'s non-configurable/non-writable properties. For example, a get trap must return the actual value of a non-writable, non-configurable property; ownKeys must report all non-configurable keys; getPrototypeOf must match a non-extensible target\'s prototype. Violations throw a TypeError.',
      explanation: 'Knowing that proxies cannot lie about non-configurable invariants is a senior detail.',
    },
    {
      level: 'senior',
      question: 'What are the downsides and gotchas of using Proxy in production?',
      answer: 'Proxies have per-operation overhead (every access goes through a trap), break referential identity (proxy !== target, affecting Map/WeakMap keys and ===), can cause infinite recursion if a trap re-accesses the proxy, and keep the target alive (use Proxy.revocable to release). They also do not transparently work with some internal slots (e.g. private fields, Date internals).',
      explanation: 'Listing performance, identity, recursion, and internal-slot pitfalls signals real production experience.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Proxy and Object.defineProperty?',
    'Why does proxying a class instance with private #fields throw?',
    'What is Proxy.revocable used for?',
    'How does Immer use Proxies to give mutable-looking immutable updates?',
    'What is the receiver argument and when does it differ from target?',
    'How do you avoid infinite recursion in a get/set trap?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using target[key] instead of Reflect.get(target, key, receiver) in a get trap.',
      why: 'It loses the receiver, so inherited getters run with the wrong `this`, returning incorrect values in prototype chains.',
      fix: 'Always forward through Reflect with the receiver to preserve correct accessor semantics.',
    },
    {
      mistake: 'Accessing the proxy itself inside a trap.',
      why: 'It re-triggers the same trap, causing infinite recursion and a stack overflow.',
      fix: 'Operate on `target` (or use Reflect on target), never on the proxy reference, inside traps.',
    },
    {
      mistake: 'Assuming the proxy and target are the same object identity.',
      why: 'proxy !== target, so using one as a Map key and the other for lookup fails, and identity checks break.',
      fix: 'Be consistent about whether you store/compare the proxy or the target.',
    },
    {
      mistake: 'Proxying objects with private #fields or internal slots (Date, Map) and calling their methods.',
      why: 'Private fields and internal slots are keyed to the real instance, not the proxy, so methods throw.',
      fix: 'Bind methods to the target, or avoid proxying such objects directly.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue 3\'s reactive(), readonly(), and ref internals are built on Proxy + Reflect; get traps track dependencies and set traps trigger component re-renders.' },
    { area: 'React', detail: 'Libraries like Valtio and MobX (and Immer used with Redux Toolkit) use Proxies to observe mutations and produce immutable updates from mutable-looking code.' },
    { area: 'Node.js', detail: 'ORMs and validation libraries use Proxies to lazily load relations, validate writes, and present virtual properties; testing libraries use them for auto-mocking.' },
    { area: 'Backend', detail: 'Access-control wrappers and audit-logging layers proxy domain objects to enforce permissions and record every read/write transparently.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Proxies enable powerful behavior (reactivity, validation) without modifying every call site, which is a maintainability win.',
      'Lazy deep wrapping (wrap nested objects on access) avoids eagerly processing huge trees.',
    ],
    bad: [
      'Every intercepted operation pays trap-dispatch overhead, slower than direct property access.',
      'Proxies defeat some JIT optimizations (hidden-class/inline-cache assumptions), hurting hot paths.',
    ],
    optimizations: [
      'Avoid proxying objects in tight loops or performance-critical hot paths; access the raw target there.',
      'Cache wrapped child proxies (WeakMap) so you do not re-create them on every access (Vue does this).',
      'Use Reflect to keep default fast-path semantics rather than re-implementing operations.',
      'Prefer simpler tools (Object.defineProperty, plain functions) when full interception is not needed.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Proxies can transparently intercept and exfiltrate every read/write on an object, so a malicious proxy injected into a dependency could harvest sensitive data invisibly.',
      'Traps can spoof behavior (within invariant limits), making code that trusts an object\'s shape vulnerable to confusion attacks.',
    ],
    bestPractices: [
      'Do not wrap security-sensitive objects (tokens, credentials) in proxies from untrusted code.',
      'Use Proxy.revocable to limit the lifetime of access granted to other code, revoking when done.',
      'Validate and sanitize inside set traps when proxying user-controlled writes to prevent prototype pollution and injection.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['property-descriptors', 'prototype-chain', 'object-creation', 'this-keyword'],
    nextConcepts: ['object-immutability', 'observer-pattern', 'event-emitter', 'shallow-vs-deep-copy'],
    dependencyNote:
      'Proxy & Reflect sit at the top of the objects-prototypes spine: you need property descriptors, the prototype chain, and a firm grasp of `this`/receiver to use them correctly. They unlock reactivity, the observer pattern, and copy-on-write immutability.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labeled "target { age }" and in front of it a gate labeled "Proxy".',
      'Show an arrow "proxy.age = 31" hitting the gate first.',
      'Inside the gate write the set trap: validate, then call Reflect.set(target, key, value, receiver).',
      'Draw Reflect.set forwarding to the target and returning a boolean back out.',
      'Say: "Proxy intercepts the operation; Reflect performs the default version with the right receiver. This is exactly how Vue 3 tracks reads and triggers updates."',
    ],
    diagram: `   proxy.age = 31
        │
     ┌──┴── Proxy gate ──┐
     │ set trap: validate │
     │  → Reflect.set ────┼──► target { age: 31 }
     └────────────────────┘
        get trap → track dep
        set trap → trigger update   (= reactivity)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Proxy wraps a target and intercepts operations (get, set, has, delete, apply) via traps; Reflect provides the default implementation of each so traps can forward correctly with the right receiver and return value. Together they enable metaprogramming: validation, logging, access control, and reactivity. Vue 3 reactivity is Proxy get (track) + set (trigger). Watch out for overhead, broken identity (proxy !== target), infinite recursion, and private-field issues.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Proxy and Reflect are JavaScript\'s built-in metaprogramming tools. A Proxy wraps a target object and lets you define traps — handler functions that intercept fundamental operations like reading a property, writing one, checking existence, deleting, or calling a function. Inside a trap you can run custom logic such as validation, logging, or dependency tracking, and then forward to the real behavior using Reflect. Reflect is a namespace of static methods that mirror the traps and perform the default operation; crucially, methods like Reflect.get and Reflect.set take a receiver so that getters and setters run with the correct `this`, which matters when the proxy is in a prototype chain. The flagship real-world use is Vue 3 reactivity: it wraps reactive objects in a Proxy where the get trap records which effect is currently running as a dependency, and the set trap triggers re-running those effects — this is why Vue 3 can detect property additions and array index changes that Vue 2\'s Object.defineProperty could not. The main gotchas are performance overhead because every access goes through a trap, the fact that the proxy is a different identity from the target so it breaks Map keys and ===, the risk of infinite recursion if a trap touches the proxy itself instead of the target, and problems proxying objects with private fields or internal slots.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Powerful transparent interception vs measurable per-operation overhead and lost JIT optimizations.',
      'Proxy (Vue 3) handles dynamic keys and arrays natively but is unsupported in legacy environments and harder to debug than Object.defineProperty.',
      'Deep reactivity via lazy wrapping is memory-light but adds wrapping cost on first access of each nested object.',
    ],
    edgeCases: [
      'receiver differs from target when the proxy is accessed through an inheriting object — must forward it via Reflect.',
      'Engine invariants forbid lying about non-configurable/non-writable properties; traps throw TypeError if they try.',
      'Private #fields and internal slots are keyed to the real instance, so proxied method calls throw unless bound to the target.',
      'Proxying built-ins like Date/Map/Set breaks because their methods rely on internal slots not present on the proxy.',
    ],
    runtimeBehavior: [
      'A missing trap falls through to the target\'s default internal method.',
      'Reflect methods return status values (Reflect.set/deleteProperty return booleans) that the trap should return to satisfy the protocol.',
      'Proxy.revocable yields a revoke() that, once called, makes all operations throw — useful for capability-style security.',
    ],
    scalability: [
      'Frameworks cache child proxies in a WeakMap so the same nested object always yields the same proxy, preserving identity and avoiding re-wrapping.',
      'For very large reactive structures, fine-grained per-property tracking can balloon dependency maps; shallow reactivity (shallowReactive) bounds the cost.',
    ],
    productionConcerns: [
      'Debugging is harder because stack traces pass through traps and proxies look like normal objects in some tools.',
      'Identity bugs: storing the target but comparing against the proxy (or vice versa) causes elusive failures.',
      'Forgotten proxies keep targets alive; use revocable proxies for capability boundaries and to allow GC.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Proxy(target, handler) intercepts ops via traps; handler defines them.',
    'Common traps: get, set, has, deleteProperty, ownKeys, apply, construct.',
    'Reflect = default implementation of each operation.',
    'Always forward with Reflect.<op>(target, key, ..., receiver).',
    'receiver keeps getters/setters running with correct `this`.',
    'Vue 3 reactivity = get(track) + set(trigger) via Proxy.',
    'Better than Object.defineProperty: catches new keys + array indices.',
    'proxy !== target — different identity (Map/WeakMap/=== pitfalls).',
    'Touching the proxy inside a trap → infinite recursion.',
    'Cannot proxy private #fields / internal slots transparently.',
    'Proxy.revocable() → revoke() makes all ops throw, frees target.',
    'Overhead per access — avoid in hot paths.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Proxy that logs every property read on an object.',
      hint: 'Use a get trap and Reflect.get.',
      solution: {
        lang: 'js',
        code: `function logged(obj) {\n  return new Proxy(obj, {\n    get(target, key, receiver) {\n      console.log('get', key)\n      return Reflect.get(target, key, receiver)\n    },\n  })\n}`,
        explanation: ['The get trap logs the accessed key.', 'Reflect.get returns the real value with the correct receiver.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a Proxy that validates that all numeric properties stay non-negative on assignment.',
      hint: 'Use a set trap; throw on negative numbers.',
      solution: {
        lang: 'js',
        code: `function nonNegative(obj) {\n  return new Proxy(obj, {\n    set(target, key, value, receiver) {\n      if (typeof value === 'number' && value < 0) {\n        throw new RangeError(key + ' cannot be negative')\n      }\n      return Reflect.set(target, key, value, receiver)\n    },\n  })\n}`,
        explanation: [
          'The set trap checks negative numbers and rejects them.',
          'Reflect.set performs the real write and returns the boolean the trap must return.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement deep readonly with Proxy so nested mutations also throw, without eagerly walking the tree.',
      hint: 'Recursively wrap objects in the get trap.',
      solution: {
        lang: 'js',
        code: `function deepReadonly(obj) {\n  return new Proxy(obj, {\n    get(target, key, receiver) {\n      const v = Reflect.get(target, key, receiver)\n      return v && typeof v === 'object' ? deepReadonly(v) : v\n    },\n    set() { throw new Error('read-only') },\n    deleteProperty() { throw new Error('read-only') },\n  })\n}`,
        explanation: [
          'set and deleteProperty reject all mutations.',
          'The get trap lazily wraps nested objects in their own readonly proxy on access.',
          'This is deep but lazy — nodes are wrapped only when touched, unlike Object.freeze.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a minimal observable: wrap an object so that assigning a property calls registered listeners with (key, value).',
      hint: 'Keep listeners in the closure; call them from the set trap after Reflect.set.',
      solution: {
        lang: 'js',
        code: `function observable(obj) {\n  const listeners = new Set()\n  const proxy = new Proxy(obj, {\n    set(target, key, value, receiver) {\n      const ok = Reflect.set(target, key, value, receiver)\n      listeners.forEach(fn => fn(key, value))\n      return ok\n    },\n  })\n  return { proxy, subscribe: fn => listeners.add(fn) }\n}\n\nconst { proxy, subscribe } = observable({})\nsubscribe((k, v) => console.log('changed', k, v))\nproxy.name = 'Sam' // logs: changed name Sam`,
        explanation: [
          'listeners live in a closure shared by the proxy and subscribe.',
          'The set trap first performs the real write via Reflect.set.',
          'Then it notifies every listener with the changed key and value — the core of observer/reactivity systems.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Proxy & Reflect are the metaprogramming layer that powers modern reactivity and many libraries. Understanding them deeply proves you grasp how property access actually works, the role of the receiver, and engine invariants — hallmark senior knowledge.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go beyond "what is a Proxy". Product companies (Zoho, Flipkart, Razorpay) ask you to build a logging or validating proxy and explain Vue 3 reactivity. FAANG-level interviews probe receiver semantics, invariants, identity pitfalls, and the trade-offs versus Object.defineProperty.',
    whatInterviewersExpect:
      'They expect you to define Proxy and Reflect, explain why traps forward through Reflect with the receiver, connect it to Vue 3 reactivity, and articulate the gotchas: overhead, identity, recursion, and private fields.',
  },
}

export default proxyReflect
