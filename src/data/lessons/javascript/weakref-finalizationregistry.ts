import type { ConceptLesson } from '../../../types/lesson'

const weakrefFinalizationregistry: ConceptLesson = {
  // 1. Concept Summary
  slug: 'weakref-finalizationregistry',
  name: 'WeakRef & FinalizationRegistry',
  category: 'memory-model',
  difficulty: 'expert',
  importance: 2,
  interviewFrequency: 1,

  // 2. Why Should I Care?
  whyCare: [
    'They are the only way in JavaScript to hold a reference to an object that does NOT keep it alive, and to be (loosely) notified when an object is collected.',
    'They power advanced memory-sensitive caches and resource cleanup where you want data to disappear under memory pressure without leaking.',
    'The spec explicitly warns against them — knowing WHY (non-determinism, no guarantees) is the real interview signal.',
    'Understanding them deepens your grasp of reachability, GC timing, and why "cleanup callbacks" are fundamentally unreliable in JS.',
    'They are rare but distinctive: recognizing the few legitimate use cases (and the many wrong ones) marks expert-level memory knowledge.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A WeakRef is a photo of a toy instead of the toy itself — you can look to see if the toy still exists, but the photo never stops anyone from giving the toy away.',
    story: [
      'Imagine you really like a toy at a friend\'s house, but it is not yours, so you cannot stop them from giving it away.',
      'Instead of holding the toy, you keep a photo of it. Whenever you want to play, you check: "is the real toy still around?"',
      'Sometimes the answer is yes and you can play; sometimes the toy is gone and your photo is just a memory.',
      'A WeakRef is that photo. And a FinalizationRegistry is like asking a friend, "if that toy ever gets thrown away, maybe tell me later" — but they might forget, and they will never tell you exactly when.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally, if your program holds a reference to an object, the cleanup system must keep that object in memory.',
    'A WeakRef is a special "loose" reference: it lets you point at an object without forcing it to stay alive. You call deref() to ask "is it still here?" and get the object back, or undefined if it is gone.',
    'A FinalizationRegistry lets you register an object and ask to be told, sometime later, after that object has been cleaned up — so you can do related housekeeping.',
    'Both are unpredictable on purpose: the callback may run late, or never, so you should never rely on them for essential logic.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'WeakRef wraps a target object in a reference that does not prevent garbage collection; calling .deref() returns the target if still alive, or undefined if it has been collected. FinalizationRegistry lets you register objects with a held value and a cleanup callback that may be invoked after those objects are collected.',
    how: 'You create a WeakRef around an object you do not want to keep alive, and deref() each time you need it (never cache the result long-term). With a FinalizationRegistry you call register(target, heldValue) and provide a callback; the engine may call it later with heldValue once the target is reclaimed — with no timing or even occurrence guarantees.',
    why: 'They enable memory-sensitive patterns — caches that release entries under pressure, and best-effort cleanup of external resources tied to an object\'s lifetime — that are impossible with strong references alone.',
    code: {
      label: 'WeakRef: a reference that lets go',
      lang: 'js',
      code: `let data = { big: new Array(1e6) }\nconst ref = new WeakRef(data)\n\nconsole.log(ref.deref()?.big.length) // 1000000 (still alive)\n\ndata = null   // drop the strong reference\n// later, after GC, ref.deref() MAY return undefined\nconsole.log(ref.deref())             // possibly undefined`,
      explanation: [
        'WeakRef wraps the object without keeping it alive.',
        'deref() returns the target while it is still reachable through some strong reference.',
        'After dropping the strong reference (data = null), the object may be collected.',
        'A later deref() can return undefined — you must always handle that case.',
        'You should re-deref each time and never hold the dereffed value across an await/tick.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'WeakRef is a wrapper that holds a weak reference to a target object, exposing deref() which returns the target if it has not yet been reclaimed or undefined otherwise; the weak reference does not contribute to reachability. FinalizationRegistry allows registering target objects together with a held value (and optional unregister token); after a target becomes unreachable and is collected, the engine MAY enqueue the registry\'s cleanup callback with the held value. Both are explicitly best-effort and non-deterministic: callbacks may be delayed arbitrarily, batched, or never run (e.g. on program exit), so they must not be relied upon for correctness-critical behavior.',

  // 7. Internal Working
  internalWorking: [
    'A WeakRef records the target via a weak slot that the GC ignores during reachability tracing, so it never keeps the target alive.',
    'Within a single microtask/synchronous turn, the spec guarantees deref() is stable — if it returns the target once, it keeps returning it for that turn (the target is kept alive for the turn) to avoid mid-computation surprises.',
    'Across turns, once all strong references are gone, the GC may reclaim the target; subsequent deref() returns undefined.',
    'FinalizationRegistry.register associates a target (held weakly) with a heldValue and optional unregister token.',
    'When the GC reclaims a registered target, the engine MAY schedule the cleanup callback to run later on the event loop with the corresponding heldValue — never synchronously during collection.',
    'There are no guarantees on timing, ordering, batching, or whether the callback runs at all (notably it may be skipped at process/page teardown), so engines treat finalization as opportunistic.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   strong ref (your code)         WeakRef (weak slot)
        │                              │  ignored by GC
        ▼                              ▼
   ┌──────────┐  deref() ──► object | undefined
   │  object  │
   └──────────┘
   drop strong ref ──► GC may reclaim ──► deref() => undefined
                                   │
                 FinalizationRegistry MAY (later, maybe never)
                 call cleanup(heldValue) on the event loop`,

  // 9. Memory Visualization
  memoryVisualization: [
    'WEAK SLOT: the WeakRef\'s pointer to the target is invisible to reachability, so the target lives only as long as some strong reference exists.',
    'PER-TURN PINNING: a successful deref() keeps the target alive for the rest of the current job, preventing it vanishing mid-function.',
    'HELD VALUE: the FinalizationRegistry stores a separate held value (often an id/key) used to clean up associated state, distinct from the weakly-held target.',
    'CALLBACK QUEUE: finalization callbacks, if any, are enqueued as event-loop jobs after collection — never during the GC pause itself.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — always re-deref and handle undefined',
      lang: 'js',
      code: `const ref = new WeakRef({ value: 42 })\nfunction read() {\n  const obj = ref.deref()\n  if (!obj) return 'gone'\n  return obj.value\n}\nread() // 42 (until collected)`,
      explanation: [
        'deref() may return the object or undefined depending on GC.',
        'Always check for undefined before using the result.',
        'Re-deref each time you need the object rather than caching the result.',
        'This defensiveness is mandatory — the target can disappear between calls.',
      ],
    },
    intermediate: {
      label: 'Intermediate — FinalizationRegistry for best-effort cleanup',
      lang: 'js',
      code: `const registry = new FinalizationRegistry((heldId) => {\n  console.log('cleaning up external resource for', heldId)\n  releaseExternalHandle(heldId)   // best-effort only\n})\n\nfunction track(obj, id) {\n  registry.register(obj, id)   // heldValue = id\n}`,
      explanation: [
        'The registry callback receives the held value (an id), not the collected object.',
        'It MAY run sometime after the object is collected, on the event loop.',
        'Use it only for non-critical cleanup, since it may be delayed or never fire.',
        'Never put correctness-critical logic (e.g. flushing data) here — use explicit close()/dispose().',
      ],
    },
    advanced: {
      label: 'Advanced — memory-sensitive cache with WeakRef',
      lang: 'js',
      code: `const cache = new Map() // key -> WeakRef(value)\nfunction getExpensive(key, compute) {\n  const hit = cache.get(key)?.deref()\n  if (hit) return hit\n  const value = compute(key)\n  cache.set(key, new WeakRef(value))\n  return value\n}`,
      explanation: [
        'Values are stored as WeakRefs, so they can be collected under memory pressure.',
        'On a hit we deref; if the value was collected, we recompute.',
        'This trades guaranteed retention for memory friendliness — entries are a "maybe".',
        'A FinalizationRegistry can be added to delete the dead Map keys so the Map itself does not grow unbounded.',
      ],
    },
    realProject: {
      label: 'Real project — Node resource handle tied to object lifetime',
      lang: 'js',
      code: `const handles = new FinalizationRegistry((fd) => {\n  try { fs.closeSync(fd) } catch {}   // safety net, not the primary path\n})\nclass File {\n  constructor(path) {\n    this.fd = fs.openSync(path, 'r')\n    handles.register(this, this.fd, this)\n  }\n  close() { fs.closeSync(this.fd); handles.unregister(this) } // the real cleanup\n}`,
      explanation: [
        'The primary cleanup is the explicit close() method — deterministic and reliable.',
        'The FinalizationRegistry is only a safety net for forgotten handles, which may or may not fire.',
        'unregister() prevents a double-close after a proper close().',
        'This mirrors how some Node bindings provide a backstop without relying on it for correctness.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'intermediate',
      question: 'What is a WeakRef and how is it different from a WeakMap?',
      answer: 'A WeakRef holds a single object weakly and you call deref() to get it (or undefined). A WeakMap is a keyed collection holding keys weakly. WeakRef is about observing/optionally accessing one object without keeping it alive; WeakMap is about associating data with objects.',
      explanation: 'A good answer distinguishes "one weak pointer you can deref" from "a weak-keyed map".',
    },
    {
      level: 'intermediate',
      question: 'What does FinalizationRegistry do and what are its guarantees?',
      answer: 'It lets you register objects with a held value and a callback that MAY run after those objects are garbage collected. There are essentially no guarantees: the callback may be delayed, batched, run on the event loop later, or never run (e.g. at process exit).',
      explanation: 'Stressing the lack of guarantees is the key signal — overstating reliability is a red flag.',
    },
    {
      level: 'advanced',
      question: 'Why does the spec warn against using WeakRef and FinalizationRegistry?',
      answer: 'Because GC behavior is non-deterministic and implementation-specific. Relying on deref() returning a value, or on finalizers running at a particular time (or at all), leads to subtle, unreproducible bugs. They expose GC timing that is meant to be unobservable.',
      explanation: 'Senior signal: framing it as "do not build correctness on GC timing".',
    },
    {
      level: 'advanced',
      question: 'Why must you re-deref a WeakRef and never cache the result?',
      answer: 'Because the target can be collected between turns. Within one synchronous turn deref() is stable, but across awaits/ticks it may start returning undefined. Caching the dereffed value also defeats the purpose by creating a strong reference that keeps the object alive.',
      explanation: 'Both the staleness and the "you just made it strong again" insight matter.',
    },
    {
      level: 'senior',
      question: 'Give a legitimate use case and an anti-pattern for these APIs.',
      answer: 'Legitimate: a memory-sensitive cache whose entries may be reclaimed under pressure, or a best-effort safety-net to release external resources for forgotten objects. Anti-pattern: using a finalizer as the primary cleanup (e.g. flushing data, releasing locks) or relying on deref() for control flow correctness.',
      explanation: 'Knowing the narrow legitimate niche and the common misuse is the expert differentiator.',
    },
    {
      level: 'expert',
      question: 'How do these interact with the event loop and the within-turn liveness guarantee?',
      answer: 'Finalization callbacks are scheduled as event-loop jobs after collection, never synchronously during GC. WeakRef.deref() is guaranteed stable within a single synchronous execution (the target is kept alive for that turn), but across microtasks/macrotasks it may begin returning undefined as collection becomes possible.',
      explanation: 'Demonstrates precise knowledge of the per-turn liveness rule and async scheduling of finalizers.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Can you guarantee a FinalizationRegistry callback runs? (No)',
    'What is the unregister token for and when do you need it?',
    'Why should the finalizer never reference the target object itself?',
    'How would you use a FinalizationRegistry to clean up dead WeakRef entries in a Map cache?',
    'How do WeakRef/FinalizationRegistry differ from WeakMap/WeakSet?',
    'Why are these considered "last resort" tools?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a FinalizationRegistry as the primary resource-cleanup mechanism.',
      why: 'Callbacks may be delayed or never run, so critical resources (files, locks, sockets) could leak or never flush.',
      fix: 'Use explicit close()/dispose() (or try/finally, using-declarations) as the real path; treat finalizers as an optional safety net only.',
    },
    {
      mistake: 'Caching the result of deref() across asynchronous boundaries.',
      why: 'The cached value is now a strong reference, defeating the WeakRef and keeping the object alive (or going stale).',
      fix: 'Re-deref every time you need the object and handle undefined; never store the dereffed value long-term.',
    },
    {
      mistake: 'Referencing the target object inside the finalizer callback.',
      why: 'A finalizer that closes over its target would keep it alive, so it could never run — a contradiction.',
      fix: 'Pass only a held value (id/key) to register(); operate on that, never the original object.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Some native bindings use FinalizationRegistry as a backstop to release external handles (file descriptors, native memory) for objects the developer forgot to close — never as the primary path.' },
    { area: 'Backend', detail: 'Memory-sensitive caches store values behind WeakRefs so they can be reclaimed under pressure, recomputing on miss; a registry trims the dead keys.' },
    { area: 'React', detail: 'Rarely used directly, but underlies certain advanced libraries that track component/instance lifetimes for diagnostics without pinning them.' },
    { area: 'Vue', detail: 'Not part of typical app code; relevant when building framework-level tooling that observes object lifetimes for devtools or leak detection.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'WeakRef-backed caches can relieve memory pressure automatically by letting values be collected.',
      'Finalizers can reclaim external (non-GC) resources for forgotten objects, reducing slow leaks.',
    ],
    bad: [
      'Finalization adds GC bookkeeping and unpredictable, deferred callback work on the event loop.',
      'Misuse (per-frame WeakRefs, heavy finalizer logic) adds overhead and non-determinism that is hard to profile.',
    ],
    optimizations: [
      'Reserve these APIs for genuinely memory-sensitive or safety-net scenarios; prefer explicit cleanup otherwise.',
      'Keep finalizer callbacks tiny and side-effect-light; never block or do heavy work.',
      'Pair a WeakRef cache with a registry to delete dead keys so the backing Map does not grow.',
      'Always design correctness to work even if finalizers never run.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['garbage-collection', 'weakmap-weakset', 'event-loop'],
    nextConcepts: ['memory-leaks', 'memory-profiling', 'microtask-queue'],
    dependencyNote:
      'WeakRef/FinalizationRegistry sit at the top of the memory spine, building on garbage-collection and the Weak collections and requiring event-loop knowledge to understand when finalizers run; they connect to memory-leaks and memory-profiling in practice.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an object with a strong arrow from code and a dashed WeakRef arrow beside it.',
      'Show deref() returning the object while the strong arrow exists.',
      'Erase the strong arrow; say "GC may now reclaim it; deref() => undefined".',
      'Draw a FinalizationRegistry box with a clock and a "?" — "callback MAY run later, or never".',
      'Stress the rule: explicit close() is the real cleanup; finalizer is a maybe-safety-net.',
      'End with the per-turn guarantee: deref is stable within one synchronous turn only.',
    ],
    diagram: `  code ──strong──► (obj) ◄┄┄weak┄┄ WeakRef.deref()
   drop strong arrow -> GC may free -> deref() => undefined
   FinalizationRegistry: [obj registered] --(maybe, later)--> cleanup(heldValue)
   guarantees: NONE on timing/occurrence`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'WeakRef holds an object without keeping it alive; deref() returns it or undefined, and you must re-deref every time and handle undefined. FinalizationRegistry lets you register objects with a held value and a callback that MAY run after they are collected — with no guarantees on timing or occurrence (it can be delayed, batched, or never run, especially at exit). They enable memory-sensitive caches and best-effort resource cleanup, but the spec warns against relying on them: explicit close()/dispose() must be the real cleanup, and correctness must never depend on GC timing.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'WeakRef and FinalizationRegistry are JavaScript\'s lowest-level, last-resort memory tools. A WeakRef wraps a target object in a reference the garbage collector ignores, so it never keeps the target alive; you call deref() to get the object back, or undefined if it has already been collected. The discipline is to re-deref every single time and always handle undefined, and never to cache the dereffed value across an await or tick, because doing so creates a strong reference that defeats the entire purpose. Within one synchronous turn deref() is stable — the engine keeps the target alive for that turn so it cannot vanish mid-computation — but across turns it can start returning undefined. FinalizationRegistry lets you register a target along with a held value and a cleanup callback that the engine MAY invoke, on the event loop, sometime after the target is collected. The critical point, which the spec itself stresses, is that there are no guarantees: the callback can be delayed, batched, or never run at all, for instance at process or page teardown. So these are not cleanup mechanisms you build correctness on. The legitimate uses are narrow — a memory-sensitive cache whose entries can be reclaimed under pressure and recomputed, or a best-effort safety net to release an external resource for an object someone forgot to close. The real cleanup must always be an explicit close() or dispose(), with the finalizer as an optional backstop, and the finalizer must reference only a held value, never the target, or it could never run.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Memory friendliness vs predictability: WeakRef caches relieve pressure but turn every entry into a "maybe", complicating reasoning.',
      'Safety-net cleanup vs reliability: finalizers catch forgotten resources but can never replace deterministic disposal.',
    ],
    edgeCases: [
      'Finalizers may not run at process exit, so anything that MUST flush cannot rely on them.',
      'A finalizer closing over its target keeps it alive forever and can never fire — always use a held value.',
      'Within-turn liveness means deref() can "lie" about collectability until the next turn.',
    ],
    runtimeBehavior: [
      'Finalization callbacks are scheduled as event-loop jobs post-collection, never during the GC pause.',
      'Engines may batch or coalesce finalizations; ordering across targets is unspecified.',
      'WeakRef deref stability is guaranteed only for the current synchronous execution.',
    ],
    scalability: [
      'A WeakRef-backed Map still leaks the dead KEYS unless a FinalizationRegistry trims them, so pair the two.',
      'Heavy finalizer work can pile up event-loop jobs after a big collection, causing latency bumps.',
    ],
    productionConcerns: [
      'Document loudly that finalizers are best-effort; reviewers must not promote them to primary cleanup.',
      'Prefer explicit disposal patterns (try/finally, the using declaration) for real resource management.',
      'Profile to confirm a WeakRef cache actually helps; non-determinism makes its benefit workload-dependent.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'WeakRef = weak pointer to ONE object; deref() -> object | undefined.',
    'Always re-deref; never cache the result (it would become strong).',
    'Within one sync turn, deref() is stable; across turns it may go undefined.',
    'FinalizationRegistry.register(target, heldValue, [token]) + cleanup callback.',
    'Cleanup callback MAY run after collection — no timing/occurrence guarantees.',
    'May never run (e.g. at process/page exit) — never use for critical cleanup.',
    'Callback gets the HELD VALUE, never the (collected) target.',
    'Finalizer must NOT reference the target (would keep it alive).',
    'Use cases: memory-sensitive cache, best-effort resource backstop.',
    'Real cleanup = explicit close()/dispose(); finalizer is a safety net.',
    'WeakRef cache still leaks dead Map keys unless a registry trims them.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a safe reader for a WeakRef that returns a fallback when the target is gone.',
      hint: 'deref() then check undefined.',
      solution: {
        lang: 'js',
        code: `function safeRead(ref, fallback) {\n  const obj = ref.deref()\n  return obj === undefined ? fallback : obj\n}`,
        explanation: [
          'deref() may return undefined once the target is collected.',
          'Returning a fallback keeps callers robust against disappearance.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Register an object with a FinalizationRegistry so a log line MAY appear after it is collected.',
      hint: 'Pass an id as the held value, never the object.',
      solution: {
        lang: 'js',
        code: `const reg = new FinalizationRegistry((id) => {\n  console.log('collected:', id)\n})\nfunction watch(obj, id) { reg.register(obj, id) }`,
        explanation: [
          'The held value (id) identifies what was cleaned up without referencing the object.',
          'The callback is best-effort and may run later or not at all.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a WeakRef-backed cache and use a FinalizationRegistry to delete dead keys from the backing Map.',
      hint: 'Held value = the cache key; unregister on overwrite.',
      solution: {
        lang: 'js',
        code: `const map = new Map()\nconst reg = new FinalizationRegistry((key) => {\n  // only delete if the slot still holds a dead ref\n  if (map.get(key)?.deref() === undefined) map.delete(key)\n})\nfunction set(key, value) {\n  map.set(key, new WeakRef(value))\n  reg.register(value, key)\n}\nfunction get(key) { return map.get(key)?.deref() }`,
        explanation: [
          'Values are stored weakly so they can be collected under memory pressure.',
          'The registry callback runs (maybe) after a value is collected, removing its now-dead key.',
          'The guard avoids deleting a key that was re-set to a live value.',
          'Correctness does not depend on the callback firing — get() recomputes on miss anyway.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why a finalizer cannot reference its target, and show the correct register call.',
      hint: 'Closing over the target keeps it reachable, so it can never be collected.',
      solution: {
        lang: 'js',
        code: `const reg = new FinalizationRegistry((heldId) => cleanup(heldId))\nfunction track(obj) {\n  const id = obj.id\n  reg.register(obj, id)   // pass id (held value), NOT obj\n}\n// WRONG: () => cleanup(obj) would keep obj alive -> never finalizes`,
        explanation: [
          'A callback that closes over the target creates a strong reference, so the target stays reachable.',
          'If it stays reachable it is never collected, so the finalizer can never run — a contradiction.',
          'Passing a held value (id) lets the callback do cleanup without touching the object.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'These are expert-tier APIs that show up rarely but reveal how deeply you understand GC and the event loop. The mark of expertise is knowing their narrow legitimate uses and confidently explaining why you should almost never rely on them.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) almost never ask about them. Product companies (Zoho, Flipkart, Razorpay) may ask "what is a WeakRef?" as a depth probe. FAANG-level interviews ask why the spec discourages them, the per-turn liveness guarantee, and when a finalizer is acceptable.',
    whatInterviewersExpect:
      'They expect "weak, non-keeping reference; deref or undefined", the absence of finalization guarantees, the rule never to reference the target in the finalizer, and a clear stance that explicit disposal — not finalizers — is the real cleanup.',
  },
}

export default weakrefFinalizationregistry
