import type { ConceptLesson } from '../../../types/lesson'

const readonlyReactivity: ConceptLesson = {
  // 1. Concept Summary
  slug: 'readonly-reactivity',
  name: 'readonly',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'readonly() lets you share reactive state downward while guaranteeing children cannot mutate it — enforcing one-way data flow.',
    'It is the safe way to expose provide/inject state so descendants read but only the owner mutates.',
    'It catches accidental mutations at dev time with a clear console warning, turning silent bugs into loud ones.',
    'It is how libraries expose internal reactive state without letting consumers corrupt invariants.',
    'Understanding readonly vs a plain copy is a common signal for whether you really grasp Vue’s Proxy-based reactivity.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'readonly is a museum display case: you can look at the painting and see when it changes, but you cannot touch it.',
    story: [
      'Imagine a beautiful painting in a museum behind clear glass.',
      'You can walk up, look closely, and if the curator swaps in a new painting, you instantly see the new one through the glass.',
      'But no matter how hard you push, the glass stops you from grabbing or drawing on it — only the curator with the key can change what is inside.',
      'readonly puts your reactive data behind that glass: everyone can watch it and react to changes, but only the owner who holds the original can actually change it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A reactive object in Vue can be both read and changed, and the screen updates when it changes.',
    'Sometimes you want to let other parts of your app see the data and react to changes, but NOT change it themselves.',
    'readonly wraps a reactive object so that any attempt to change it is blocked and warns you in development.',
    'It is still reactive for reading — when the original changes, anything watching the readonly version updates too.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'readonly(target) returns a reactive Proxy of an object (or ref/reactive) whose properties can be read and tracked but not mutated; any write or delete is blocked and warns in development.',
    how: 'It wraps the target in a Proxy whose set/deleteProperty traps do nothing but warn. Get traps still register dependencies and recursively wrap nested objects as readonly, so deep reads stay reactive.',
    why: 'It enforces one-way data flow: an owner can hand a readonly view to consumers so they react to updates without being able to mutate shared state, preventing a whole class of bugs.',
    code: {
      label: 'A read-only reactive view',
      lang: 'js',
      code: 'import { reactive, readonly } from \'vue\'\n\nconst original = reactive({ count: 0 })\nconst copy = readonly(original)\n\noriginal.count++        // OK — owner mutates the source\nconsole.log(copy.count) // 1 — readonly reflects it (still reactive)\n\ncopy.count++            // WARN in dev, no-op',
      explanation: [
        'original is a normal writable reactive object.',
        'readonly(original) returns a Proxy you can read from.',
        'Mutating original is allowed and flows through to copy.',
        'Writing to copy.count is blocked and warns — it does not change anything.',
        'Reads of copy are still tracked, so watchers/templates react.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'readonly(target) creates a deeply immutable reactive Proxy over an object, ref, or reactive object. Its get trap performs dependency tracking and lazily wraps nested objects in readonly as well, so deep property reads remain reactive; its set and deleteProperty traps are no-ops that emit a development warning. The returned proxy shares the same underlying reactive source, so it reflects upstream changes but rejects any local mutation — making it the primitive Vue uses to enforce one-way data flow and to expose immutable views of shared state.',

  // 7. Internal Working
  internalWorking: [
    'readonly(target) calls createReactiveObject with readonly handlers, caching the result in a readonlyMap so repeated calls on the same target return the same proxy.',
    'The get trap tracks the dependency (so reads are reactive) and, if the returned value is an object, recursively returns readonly(value) — giving DEEP immutability lazily, only as nested objects are accessed.',
    'The set trap does not write; in development it logs "Set operation on key failed: target is readonly" and returns true to satisfy Proxy invariants.',
    'The deleteProperty trap similarly blocks deletion and warns in dev.',
    'Because the readonly proxy wraps the SAME underlying target as the original reactive object, mutations made through the writable original still trigger effects observed via the readonly view.',
    'shallowReadonly differs by NOT recursively wrapping nested objects, so only the top level is read-only while nested objects remain mutable/reactive.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        writable reactive (owner)
        ┌───────────────────────────┐
        │  original.count = 0        │  ── mutate here (allowed)
        └─────────────▲──────────────┘
                      │ same underlying target
        ┌─────────────┴──────────────┐
        │  readonly(original)        │
        │   get  → track + return    │  reads OK, stay reactive
        │   set  → WARN, no-op  ╳    │  writes blocked
        │   delete → WARN, no-op ╳   │
        └────────────────────────────┘
        consumers receive THIS view`,

  // 9. Memory Visualization
  memoryVisualization: [
    'readonly does NOT copy data — it adds a second Proxy over the same target object on the heap.',
    'A readonlyMap caches target → readonly-proxy so the same proxy instance is reused, avoiding duplicate wrappers.',
    'Nested readonly proxies are created lazily on first access and cached, so deep structures only allocate wrappers for paths you actually read.',
    'Because the proxy references the original target, the source stays alive as long as the readonly view is reachable.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — blocking mutation',
      lang: 'js',
      code: 'import { reactive, readonly } from \'vue\'\n\nconst config = readonly(reactive({ theme: \'dark\' }))\nconfig.theme = \'light\' // dev warning, stays "dark"\nconsole.log(config.theme) // "dark"',
      explanation: [
        'readonly wraps the reactive config object.',
        'Assigning config.theme is blocked and warns in development.',
        'The value remains unchanged.',
        'Use this to hand out config no one downstream should edit.',
      ],
    },
    intermediate: {
      label: 'Intermediate — deep vs shallow readonly',
      lang: 'js',
      code: 'import { reactive, readonly, shallowReadonly } from \'vue\'\n\nconst deep = readonly(reactive({ user: { name: \'Sam\' } }))\ndeep.user.name = \'Max\'   // WARN — nested also frozen\n\nconst shallow = shallowReadonly(reactive({ user: { name: \'Sam\' } }))\nshallow.user.name = \'Max\' // OK — only top level is readonly\nconsole.log(shallow.user.name) // "Max"',
      explanation: [
        'readonly is deep: nested objects are wrapped read-only on access.',
        'So deep.user.name cannot be reassigned — it warns.',
        'shallowReadonly only protects the top-level keys.',
        'Nested mutation through shallowReadonly is allowed and reactive.',
      ],
    },
    advanced: {
      label: 'Advanced — reactivity flows through readonly',
      lang: 'js',
      code: 'import { reactive, readonly, watchEffect } from \'vue\'\n\nconst store = reactive({ count: 0 })\nconst view = readonly(store)\n\nwatchEffect(() => console.log(\'view sees\', view.count))\n// logs "view sees 0"\n\nstore.count = 5 // owner mutates source\n// logs "view sees 5" — readonly reads are tracked',
      explanation: [
        'The readonly view shares store’s underlying target.',
        'Reading view.count inside watchEffect tracks the dependency.',
        'When the owner mutates store.count, the effect re-runs.',
        'readonly removes write ability but keeps full read reactivity.',
      ],
    },
    realProject: {
      label: 'Real project — provide a readonly store to descendants',
      lang: 'js',
      code: 'import { reactive, readonly, provide } from \'vue\'\n\n// in a parent <script setup>\nconst _state = reactive({ user: null, loggedIn: false })\nfunction login(u) { _state.user = u; _state.loggedIn = true }\n\nprovide(\'auth\', {\n  state: readonly(_state), // children read only\n  login,                   // mutate only via this action\n})',
      explanation: [
        'The parent owns the writable _state.',
        'Children inject auth.state but it is readonly — they cannot mutate it.',
        'Mutation is funneled through login(), keeping invariants in one place.',
        'This is the textbook one-way-data-flow pattern with provide/inject.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does readonly() do in Vue 3?',
      answer: 'It returns a reactive proxy over an object that can be read and tracked but not mutated; any write or delete is blocked and warns in development.',
      explanation: 'A solid answer stresses that it is still reactive for reads — it removes mutation, not reactivity.',
    },
    {
      level: 'beginner',
      question: 'If I wrap a reactive object in readonly and then change the ORIGINAL, does the readonly view update?',
      answer: 'Yes. The readonly proxy wraps the same underlying target, so mutations through the writable original are reflected and trigger effects observed via the readonly view.',
      explanation: 'This shows you understand readonly is a view, not a snapshot copy.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between readonly and shallowReadonly?',
      answer: 'readonly is deep — nested objects are also wrapped read-only when accessed. shallowReadonly only makes the top-level properties read-only; nested objects remain mutable and reactive.',
      explanation: 'Naming the lazy/recursive wrapping of nested objects in readonly is the precise distinction.',
    },
    {
      level: 'intermediate',
      question: 'Does readonly throw when you try to mutate?',
      answer: 'No — by default it does not throw. The set/delete traps are no-ops that emit a console warning in development; in production the warning is stripped and the write is silently ignored.',
      explanation: 'Knowing it warns (dev) rather than throws is a common gotcha.',
    },
    {
      level: 'advanced',
      question: 'How is readonly implemented under the hood?',
      answer: 'It uses createReactiveObject with readonly handlers. The get trap tracks deps and recursively returns readonly(value) for nested objects; set and deleteProperty are no-ops that warn. Results are cached in a readonlyMap for identity.',
      explanation: 'Referencing the handler traps, lazy deep wrapping, and the cache shows real internals knowledge.',
    },
    {
      level: 'senior',
      question: 'Why is readonly preferable to handing out a deep clone of state to children?',
      answer: 'A clone is a disconnected snapshot — it does not reflect later owner updates and doubles memory. readonly shares the same target, so it stays reactive and cheap while still preventing mutation, enforcing one-way data flow without copying.',
      explanation: 'Senior signal: contrasting view semantics (live, cheap) with copy semantics (stale, costly).',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Does readonly throw or warn on mutation, and what happens in production builds?',
    'What is shallowReadonly and when would you use it?',
    'Can you call readonly on a ref? What does it return?',
    'How do isReadonly and isReactive behave on a readonly object?',
    'Why are component props effectively readonly, and how does that relate?',
    'Does readonly prevent mutation through the ORIGINAL reactive object too? (no — only the readonly view)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting readonly to throw on mutation.',
      why: 'It only warns in development and silently no-ops in production, so bugs can slip past untested paths.',
      fix: 'Treat the dev warning as authoritative and add tests; never rely on a thrown error to catch writes.',
    },
    {
      mistake: 'Cloning state to "protect" it instead of using readonly.',
      why: 'A clone goes stale and does not reflect owner updates, plus it wastes memory.',
      fix: 'Wrap with readonly() to keep a live, reactive, immutable view.',
    },
    {
      mistake: 'Using shallowReadonly when deep immutability is intended.',
      why: 'Nested objects stay mutable, so children can still corrupt deep state.',
      fix: 'Use readonly() for deep protection; use shallowReadonly only as a deliberate performance choice.',
    },
    {
      mistake: 'Trying to mutate props directly (which are readonly).',
      why: 'Props are a readonly reactive view from the parent; mutation warns and breaks one-way flow.',
      fix: 'Emit an event or use a local computed/ref derived from the prop.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Component props are exposed as a readonly reactive object, which is why mutating a prop warns — readonly is the mechanism behind one-way data flow.' },
    { area: 'Pinia', detail: 'Stores can expose readonly slices of state to components that should only read, funneling mutations through actions.' },
    { area: 'Component library', detail: 'Libraries hand out readonly internal state to consumers so they can observe values without breaking internal invariants.' },
    { area: 'Vue', detail: 'provide/inject patterns wrap shared state in readonly so descendants subscribe but only the provider mutates.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'No data copying — a readonly view shares the source, so it is far cheaper than cloning.',
      'Nested readonly proxies are created lazily and cached, so only accessed paths allocate.',
    ],
    bad: [
      'Every property access still goes through a Proxy get trap, a small constant overhead.',
      'Deeply nested readonly access creates wrapper proxies along the path, adding minor allocation.',
    ],
    optimizations: [
      'Use shallowReadonly when you only need top-level protection to skip deep wrapping.',
      'Avoid wrapping the same object multiple times — the cache reuses one proxy, but redundant readonly calls add noise.',
      'Prefer readonly over deep cloning in hot paths to avoid copy cost and stale data.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'reactive', 'proxy-reactivity'],
    nextConcepts: ['shallowref-shallowreactive', 'provide-inject', 'props', 'pinia-stores-actions'],
    dependencyNote:
      'readonly builds directly on reactive() and the Proxy reactivity model: you need to understand reactive Proxies before readonly makes sense. It then underpins one-way data flow via props and provide/inject, and pairs with shallowReadonly for performance tuning.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a writable reactive box labeled "owner / original".',
      'Draw a second box over the same data labeled readonly(original).',
      'Put a green check on reads through both; put a red ╳ on writes through the readonly box.',
      'Mutate the owner box and show an arrow updating the readonly view (still reactive).',
      'Say: "readonly is a live, reactive view that blocks writes — share it down, mutate only at the source."',
    ],
    diagram: `   owner ──write OK──► [ reactive target ]
                            ▲   ▲
                  read OK ──┘   │ read OK
                                │
   consumers ── write ╳ ── [ readonly view ]  (warns, no-op)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'readonly(target) returns a reactive Proxy you can read and track but not mutate — writes/deletes warn in dev and no-op in production. It is deep by default (nested objects wrapped lazily); shallowReadonly protects only the top level. Crucially it shares the same underlying target, so it reflects owner updates and stays reactive — it is a live view, not a copy. Use it to enforce one-way data flow via props and provide/inject, letting children read shared state while only the owner mutates.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'readonly is Vue 3’s primitive for immutable reactive views. You pass it an object, ref, or reactive object and it returns a Proxy that shares the same underlying target. The get trap still does dependency tracking and lazily wraps nested objects in readonly too, so deep reads remain fully reactive; the set and deleteProperty traps are no-ops that warn in development and are silently stripped in production. The key insight is that it is a view, not a snapshot — because it wraps the same target as the writable original, any mutation made through the original flows through and triggers effects observed via the readonly view. That makes it ideal for one-way data flow: a parent owns a writable reactive state, exposes readonly(state) plus explicit mutator functions through provide/inject, and descendants can subscribe to changes but cannot corrupt the state directly. This is exactly how component props work — they are a readonly reactive object, which is why mutating a prop warns. Compared to handing out a deep clone, readonly is both cheaper (no copy, lazy nested wrapping, cached proxies) and correct (stays live instead of going stale). When you only need top-level protection, shallowReadonly skips the recursive wrapping for performance, leaving nested objects mutable. A common gotcha: readonly does not throw on mutation; it warns, so you should treat the dev warning seriously and back it with tests.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'readonly (deep, safe) vs shallowReadonly (cheaper, only top level) — choose based on how deep mutation risk goes.',
      'Live readonly view vs deep clone: view stays reactive and cheap but exposes the same identity; a clone fully decouples but goes stale and costs memory.',
    ],
    edgeCases: [
      'Mutations still possible through the ORIGINAL writable object — readonly only locks the view.',
      'readonly(ref) returns a readonly ref; .value reads work but assignment warns.',
      'shallowReadonly leaves nested objects fully mutable and reactive — easy to misuse.',
      'isReactive returns true for a readonly object too, while isReadonly distinguishes them.',
    ],
    runtimeBehavior: [
      'set/delete traps return true to satisfy Proxy invariants while doing nothing, only logging in dev.',
      'Nested readonly proxies are created on first access and cached in readonlyMap, so identity is stable.',
      'Reads still register effects exactly like a normal reactive get.',
    ],
    scalability: [
      'In large shared stores, exposing readonly slices avoids defensive copying across many consumers.',
      'Deep readonly over very large trees adds wrapper proxies along accessed paths — prefer shallowReadonly for hot, wide structures.',
    ],
    productionConcerns: [
      'Because mutation only warns, untested write paths can silently no-op in production — add tests and lint rules.',
      'Document that the source remains mutable so teammates do not assume the whole state is frozen.',
      'Mutating props is the most common real-world trigger of the readonly warning — educate the team on emit/computed alternatives.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'readonly(target) → reactive proxy, reads OK, writes blocked.',
    'Mutation WARNS in dev, silently no-ops in production (does not throw).',
    'Deep by default; nested objects wrapped lazily on access.',
    'shallowReadonly = only top-level keys read-only.',
    'It is a LIVE view of the same target — reflects owner updates.',
    'Reads stay reactive: watchers/templates update.',
    'The original writable object can still be mutated.',
    'Props are a readonly reactive object — hence prop-mutation warnings.',
    'isReactive(readonlyObj) === true; isReadonly distinguishes it.',
    'Use for provide/inject one-way data flow.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Wrap reactive({ score: 0 }) so callers can read but not change score, then prove writes are blocked.',
      hint: 'Use readonly and try to assign.',
      solution: {
        lang: 'js',
        code: 'import { reactive, readonly } from \'vue\'\nconst s = readonly(reactive({ score: 0 }))\ns.score = 10 // warns, no-op\nconsole.log(s.score) // 0',
        explanation: ['readonly blocks the write and warns in dev.', 'The value stays 0, proving immutability of the view.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show that mutating the original reactive object is reflected through its readonly view.',
      hint: 'Keep a reference to the writable original.',
      solution: {
        lang: 'js',
        code: 'import { reactive, readonly } from \'vue\'\nconst orig = reactive({ n: 1 })\nconst view = readonly(orig)\norig.n = 42\nconsole.log(view.n) // 42 — live view',
        explanation: [
          'view shares orig’s underlying target.',
          'Mutating orig updates what view reads.',
          'readonly is a view, not a copy.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate the difference between readonly and shallowReadonly on a nested object.',
      hint: 'Try mutating a nested property through each.',
      solution: {
        lang: 'js',
        code: 'import { reactive, readonly, shallowReadonly } from \'vue\'\nconst deep = readonly(reactive({ a: { b: 1 } }))\ndeep.a.b = 2 // WARN, stays 1\n\nconst shallow = shallowReadonly(reactive({ a: { b: 1 } }))\nshallow.a.b = 2 // OK\nconsole.log(shallow.a.b) // 2',
        explanation: [
          'readonly wraps nested objects read-only, so deep.a.b is protected.',
          'shallowReadonly only freezes the top level.',
          'So shallow.a.b can be mutated.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a provide/inject auth module where children can read user state but only the parent can mutate it.',
      hint: 'Provide readonly(state) plus mutator functions.',
      solution: {
        lang: 'js',
        code: 'import { reactive, readonly, provide, inject } from \'vue\'\n// parent\nconst _s = reactive({ user: null })\nprovide(\'auth\', { state: readonly(_s), setUser: (u) => { _s.user = u } })\n\n// child\nconst auth = inject(\'auth\')\nauth.state.user      // read OK, reactive\n// auth.state.user = x // warns — must use auth.setUser(x)',
        explanation: [
          'The parent owns the writable _s.',
          'Children get a readonly view, enforcing one-way flow.',
          'All mutation goes through setUser, centralizing invariants.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'readonly is how you express intent — "read this, do not change it" — in a reactive system. It turns architecture (one-way data flow) into an enforced, dev-time-checked contract, and understanding it shows you grasp Vue’s Proxy model deeply enough to reason about views vs copies.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go beyond "what does readonly do". Product companies (Zoho, Flipkart, Razorpay) ask how to safely share state with children and why props can’t be mutated. FAANG-level interviews probe the Proxy traps, deep vs shallow lazy wrapping, and why a live view beats a clone.',
    whatInterviewersExpect:
      'They expect you to say it blocks mutation (warns, not throws), keeps reads reactive, is deep by default with a shallow variant, shares the same target as the source, and underpins props/provide-inject one-way data flow.',
  },
}

export default readonlyReactivity
