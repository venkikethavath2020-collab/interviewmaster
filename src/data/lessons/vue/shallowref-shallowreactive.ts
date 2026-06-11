import type { ConceptLesson } from '../../../types/lesson'

const shallowrefShallowreactive: ConceptLesson = {
  // 1. Concept Summary
  slug: 'shallowref-shallowreactive',
  name: 'shallowRef & shallowReactive',
  category: 'reactivity',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'shallowRef and shallowReactive are the performance escape hatches of Vue reactivity — they make only the top level reactive, skipping expensive deep proxying.',
    'They are the right tool for large immutable-ish data (big API payloads, large lists) and for integrating non-reactive third-party objects (chart instances, maps, editors).',
    'Knowing them — and triggerRef / markRaw — signals senior-level understanding of how to control reactivity cost, a common advanced interview probe.',
    'Misusing them (expecting nested mutations to update the UI) causes confusing "why is my nested change not rendering?" bugs.',
    'They clarify the deep-by-default behavior of ref/reactive by contrast, deepening your overall reactivity mental model.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A normal magic box watches every compartment inside; a shallow box only notices when you swap the WHOLE box.',
    story: [
      'Imagine the magic toy box again. The normal one watches every compartment — move a single crayon and everyone knows.',
      'But watching every compartment is a lot of work, especially if the box is huge with thousands of compartments.',
      'So there is a lazier "shallow" box. It only notices one thing: when you replace the entire box with a new one. It does not bother watching the little compartments inside.',
      'shallowRef and shallowReactive are these lazy boxes. They are faster because they watch less. You use them when the inside rarely changes piece-by-piece, or when you plan to swap the whole thing at once.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally ref and reactive are "deep": they watch every nested property, so changing anything inside updates the screen.',
    'Watching deeply costs time and memory, especially for big objects. Sometimes you do not need it.',
    'shallowRef only reacts when you replace its whole .value; it ignores changes to properties inside that value. shallowReactive only reacts to top-level property changes; nested objects stay plain.',
    'They trade automatic deep updates for speed and control. If you change something deep and need an update, you either replace the top-level value or call triggerRef to force it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'shallowRef(value) creates a ref that is reactive only when its .value is reassigned — the inner value is NOT made deeply reactive. shallowReactive(obj) creates a proxy where only top-level properties are reactive; nested objects remain plain (non-reactive).',
    how: 'shallowRef skips the toReactive() conversion of its value, so mutating value.foo does not trigger; only value = newValue does. shallowReactive uses handlers that do not lazily wrap nested objects, so only direct property reads/writes track and trigger.',
    why: 'They avoid the cost of deep proxying for large structures, allow wrapping non-reactive third-party objects safely, and give you explicit control over when updates happen (via reassignment or triggerRef).',
    code: {
      label: 'Shallow vs deep behavior',
      lang: 'js',
      code: 'import { shallowRef, shallowReactive, triggerRef } from \'vue\'\n\nconst sr = shallowRef({ count: 0 })\nsr.value.count++        // does NOT trigger (nested mutation)\nsr.value = { count: 1 } // DOES trigger (whole value replaced)\ntriggerRef(sr)          // force a trigger without reassigning\n\nconst sre = shallowReactive({ user: { name: \'Ada\' } })\nsre.user = { name: \'Grace\' } // top-level set → reactive\nsre.user.name = \'X\'           // nested → NOT reactive',
      explanation: [
        'shallowRef only reacts to replacing .value, not to mutating inside it.',
        'triggerRef forces dependents to re-run when you intentionally mutated deeply.',
        'shallowReactive reacts to top-level property changes only.',
        'Nested objects under shallowReactive are plain and their mutations are ignored.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'shallowRef and shallowReactive are non-deep variants of Vue 3 reactivity. shallowRef(value) returns a ref whose .value is tracked on get and triggered on set, but whose value is stored as-is without being passed through reactive() — so nested mutations are invisible and only reassigning .value triggers (triggerRef can force a trigger). shallowReactive(obj) returns a Proxy whose traps track/trigger only direct (top-level) property access; the get trap does NOT recursively wrap returned objects, leaving nested values non-reactive. Both exist to reduce deep-proxy overhead and to safely hold externally-managed or large objects, complemented by markRaw (opt-out) and triggerRef (manual trigger).',

  // 7. Internal Working
  internalWorking: [
    'shallowRef constructs a RefImpl with the shallow flag set; its setter stores the new value directly and triggers, but never calls toReactive(), so the inner object is the raw object.',
    'Because the inner value is raw, reading sr.value.foo does NOT go through a proxy and is not tracked; only sr.value itself (get/set) participates in reactivity.',
    'triggerRef(sr) manually invokes the ref\'s trigger, re-running its dependents — used when you mutate the inner value in place and still want an update.',
    'shallowReactive creates a Proxy with shallow handlers: the get trap runs track for the accessed key but, unlike the deep handler, returns the raw nested value without wrapping it in reactive().',
    'Thus nested objects under shallowReactive are plain objects; mutating their properties bypasses any proxy and triggers nothing.',
    'Both still feed the same targetMap/Dep scheduler for the levels they DO track, so top-level updates batch and flush exactly like deep reactivity.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   shallowRef(obj)                shallowReactive(obj)
   ┌──────────────────┐          ┌─────────────────────────┐
   │ get/set .value ─►│ track/   │ get/set TOP key ─► track/│
   │  (tracked)       │ trigger  │  trigger (top only)      │
   │ value.foo  ──────┼─► RAW    │ obj.nested ─► RAW object │
   │  (NOT tracked)   │ (deep    │  (NOT proxied/tracked)   │
   └──────────────────┘  skipped)└─────────────────────────┘
     reassign .value → update      set top key → update
     mutate inside → use triggerRef nested mutate → ignored`,

  // 9. Memory Visualization
  memoryVisualization: [
    'shallowRef: a RefImpl holding the RAW value (no nested proxy). Only the ref\'s own Dep exists; nested objects have none.',
    'shallowReactive: a single top-level Proxy; nested objects are NOT proxied, so the dependency graph stops at depth 1 — far fewer Dep Sets than deep reactive.',
    'COST SAVING: deep reactive would create proxies and Deps for every nested branch on access; shallow variants skip that, reducing heap objects and tracking work.',
    'triggerRef path: forces the shallowRef\'s Dep to notify dependents even though .value identity did not change.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — shallowRef reacts only to reassignment',
      lang: 'js',
      code: 'import { shallowRef } from \'vue\'\nconst state = shallowRef({ count: 0 })\n\nstate.value.count = 5  // no UI update (nested mutation ignored)\nstate.value = { count: 5 } // UI updates (whole value replaced)',
      explanation: [
        'shallowRef tracks .value identity, not its inner properties.',
        'Mutating count in place does not trigger because nesting is not reactive.',
        'Replacing the whole object changes .value, which does trigger.',
        'This is the defining behavior to remember.',
      ],
    },
    intermediate: {
      label: 'Intermediate — triggerRef for intentional deep mutation',
      lang: 'js',
      code: 'import { shallowRef, triggerRef } from \'vue\'\nconst big = shallowRef({ rows: [/* thousands */] })\n\nfunction addRow(row) {\n  big.value.rows.push(row) // mutate in place — cheap, no deep proxy\n  triggerRef(big)          // explicitly notify dependents\n}',
      explanation: [
        'A large dataset is held shallow to avoid deep proxy overhead.',
        'Mutating rows in place does not auto-trigger (shallow).',
        'triggerRef forces dependents (renders/computeds) to re-run on demand.',
        'This pattern gives manual, batched control over expensive updates.',
      ],
    },
    advanced: {
      label: 'Advanced — wrapping a non-reactive third-party instance',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef, onMounted, onUnmounted } from \'vue\'\nlet chart\nconst chartRef = shallowRef(null)\n\nonMounted(() => {\n  // A chart library instance should NOT be deeply proxied —\n  // proxying its internals can break it or hurt performance.\n  chart = new ChartLib(document.getElementById(\'c\'))\n  chartRef.value = chart // shallow: store as-is\n})\nonUnmounted(() => chart?.destroy())\n</script>',
      explanation: [
        'Third-party instances often misbehave when wrapped in a deep proxy.',
        'shallowRef stores the instance without proxying its internals.',
        'You get a reactive handle (reassignment triggers) without corrupting the object.',
        'markRaw is an alternative when the object lives inside other reactive state.',
      ],
    },
    realProject: {
      label: 'Real project — large fetched payload held shallow',
      lang: 'vue',
      code: '<script setup>\nimport { shallowRef, computed } from \'vue\'\nconst dataset = shallowRef([]) // big array, replaced wholesale on fetch\n\nasync function load() {\n  // Replacing .value triggers once — no per-item deep proxy cost\n  dataset.value = await fetch(\'/api/huge-list\').then(r => r.json())\n}\n\nconst count = computed(() => dataset.value.length)\n</script>\n\n<template>\n  <button @click="load">Load</button>\n  <p>{{ count }} rows</p>\n</template>',
      explanation: [
        'A large list is replaced wholesale, so deep reactivity is unnecessary.',
        'shallowRef avoids creating thousands of nested proxies on assignment.',
        'Reassigning dataset.value triggers a single update; computeds recompute.',
        'This is the canonical performance use case for shallowRef.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between ref and shallowRef?',
      answer: 'ref is deep: assigning an object makes that object deeply reactive, so nested mutations trigger updates. shallowRef stores the value as-is and only triggers when .value is reassigned, not when its inner properties change.',
      explanation: 'Deep vs reassignment-only reactivity is the core distinction.',
    },
    {
      level: 'beginner',
      question: 'What does shallowReactive do differently from reactive?',
      answer: 'reactive is deeply reactive — nested objects are wrapped on access. shallowReactive makes only top-level properties reactive; nested objects stay plain and their mutations are not tracked.',
      explanation: 'Top-level-only vs full-tree tracking.',
    },
    {
      level: 'intermediate',
      question: 'When would you use shallow reactivity?',
      answer: 'For large data structures you replace wholesale (big API payloads, large lists) to avoid deep-proxy overhead, and for wrapping non-reactive third-party objects (chart/map/editor instances) that should not be proxied. Also when you want explicit control over when updates fire.',
      explanation: 'Performance and third-party integration are the two main motivations.',
    },
    {
      level: 'intermediate',
      question: 'How do you force an update after mutating a shallowRef in place?',
      answer: 'Call triggerRef(theRef). It manually notifies the ref\'s dependents to re-run even though .value identity did not change.',
      explanation: 'triggerRef is the manual escape valve that pairs with shallowRef.',
    },
    {
      level: 'advanced',
      question: 'How do shallowRef/shallowReactive relate to markRaw and toRaw?',
      answer: 'shallow variants stop reactivity at the top level for a value/object. markRaw permanently flags an object so it is never made reactive even when placed inside reactive state. toRaw returns the underlying raw object from a proxy. Together they form the toolkit for opting out of or limiting reactivity for performance or compatibility.',
      explanation: 'Senior signal: knowing the full opt-out toolkit and when each applies.',
    },
    {
      level: 'senior',
      question: 'What are the risks of using shallow reactivity, and how do you mitigate them?',
      answer: 'The main risk is silent staleness — nested mutations do not update the UI, leading to confusing bugs. Mitigate by treating shallow state as immutable (replace whole values), documenting the contract, using triggerRef where in-place mutation is intentional, and reserving shallow for genuine performance/compat needs rather than as a default.',
      explanation: 'Demonstrates judgment about the correctness tradeoff and disciplined usage.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When does shallowRef trigger vs not?',
    'What is triggerRef and when do you need it?',
    'How is shallowReactive different from reactive at nested levels?',
    'How do markRaw and toRaw fit in?',
    'Why would wrapping a third-party instance deeply be a problem?',
    'Is shallowRef of a primitive any different from ref of a primitive? (no)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting nested mutations of a shallowRef/shallowReactive to update the UI.',
      why: 'Only top-level reassignment (or top-level keys) is tracked; nested changes are invisible.',
      fix: 'Replace the whole value/top-level key, or call triggerRef after in-place mutation.',
    },
    {
      mistake: 'Using shallow variants as a default for ordinary state.',
      why: 'It sacrifices the deep reactivity that makes Vue ergonomic, inviting staleness bugs.',
      fix: 'Default to ref/reactive; use shallow only for real performance or compatibility needs.',
    },
    {
      mistake: 'Deeply proxying a third-party instance with reactive instead of shallowRef/markRaw.',
      why: 'Proxying internals can break the library or degrade performance.',
      fix: 'Hold such instances in shallowRef or wrap with markRaw.',
    },
    {
      mistake: 'Forgetting triggerRef after mutating shallowRef inner data.',
      why: 'The mutation is real but no dependents are notified, so the UI is stale.',
      fix: 'Call triggerRef(ref) after intentional in-place mutation.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Holding large fetched lists/datasets that are replaced wholesale, avoiding per-item deep proxies for big payloads.' },
    { area: 'Component library', detail: 'Wrapping non-reactive third-party instances (charts, maps, editors, animation engines) in shallowRef so they are not proxied.' },
    { area: 'Performance-critical', detail: 'Using shallowReactive for top-level-only state plus manual triggerRef to control expensive update cycles precisely.' },
    { area: 'State management', detail: 'Stores may use shallow state for large immutable blobs combined with markRaw for static reference data.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Avoids creating nested proxies and Dep Sets for large structures, cutting memory and tracking cost.',
      'Replacing a whole value triggers a single update instead of many fine-grained ones.',
    ],
    bad: [
      'Nested mutations silently do nothing, which can cause stale UI and debugging time if misused.',
      'Manual triggerRef adds boilerplate and a chance to forget, risking missed updates.',
    ],
    optimizations: [
      'Use shallowRef for large arrays/objects replaced wholesale on fetch.',
      'Use shallowReactive when only top-level fields change reactively.',
      'Pair markRaw with reactive state to exclude heavy/static sub-objects.',
      'Use triggerRef deliberately for batched, in-place updates of big data.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactive', 'proxy-reactivity'],
    nextConcepts: ['reactivity-performance', 'reactivity-caveats', 'reactivity-render-link'],
    dependencyNote:
      'shallowRef/shallowReactive are advanced variants of ref/reactive and presuppose the proxy-reactivity internals (lazy deep wrapping). They feed directly into reactivity-performance tuning and the reactivity-caveats around when updates do and do not fire.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write shallowRef(obj): only reacts when .value is reassigned, not on obj.foo mutation.',
      'Write shallowReactive(obj): only top-level keys reactive; nested objects stay plain.',
      'Explain WHY: skip deep proxy wrapping → less memory/tracking for big data.',
      'Show triggerRef(ref) to force an update after intentional in-place mutation.',
      'Conclude: "use for large wholesale-replaced data and non-reactive third-party objects; default to deep ref/reactive otherwise; markRaw/toRaw round out the opt-out toolkit."',
    ],
    diagram: `   shallowRef: react on .value REASSIGN ; ignore .value.x mutation
                in-place change → triggerRef(ref) to update
   shallowReactive: react on TOP key ; nested stays RAW
   ----------------------------------------------------------
   opt-out toolkit: shallow* (limit depth) | markRaw (never reactive)
                    | toRaw (get underlying) | triggerRef (force)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'shallowRef and shallowReactive make only the top level reactive. shallowRef triggers only when you reassign .value, not when you mutate inside it; shallowReactive tracks only top-level keys, leaving nested objects plain. They skip deep proxy wrapping, saving memory and tracking cost for large data, and safely hold non-reactive third-party objects. Use triggerRef to force an update after intentional in-place mutation. Default to deep ref/reactive; markRaw and toRaw complete the opt-out toolkit.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'shallowRef and shallowReactive are the shallow, non-deep variants of Vue 3\'s reactivity primitives, and they exist mainly for performance and for integrating non-reactive objects. By default ref and reactive are deep: assign an object to a ref or wrap one in reactive and Vue lazily proxies every nested branch you access, so any nested mutation triggers updates. That deep wrapping costs memory and tracking work, which is wasteful for large data you do not mutate piece-by-piece. shallowRef stores its value as-is without converting it to a reactive proxy, so it only triggers when you reassign .value — mutating value.foo does nothing reactive. shallowReactive makes only the top-level properties of an object reactive; its get trap does not recursively wrap nested objects, so nested values stay plain and their mutations are ignored. The classic use cases are a large API payload or list that you replace wholesale — shallowRef avoids creating thousands of nested proxies on assignment and fires a single update — and wrapping a third-party instance like a chart, map, or editor, which can break or slow down if you deeply proxy its internals. When I do need to mutate shallow data in place and still update the UI, I call triggerRef on the ref, which manually notifies its dependents even though the value identity did not change. The main risk is silent staleness: a nested change that does not render, which confuses people, so I treat shallow state as effectively immutable, document the contract, and reserve it for genuine performance or compatibility needs rather than using it as a default. These fit into a broader opt-out toolkit: markRaw permanently flags an object so it is never made reactive even inside reactive state, and toRaw returns the underlying object from a proxy. Understanding shallow variants also reinforces that ref and reactive are deep precisely because of that lazy nested proxy wrapping.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Performance vs ergonomics: shallow variants cut proxy/Dep overhead but give up automatic deep updates, shifting burden to disciplined replacement or triggerRef.',
      'Control vs safety: explicit triggerRef gives batched control but introduces the risk of forgetting to call it, causing stale UI.',
    ],
    edgeCases: [
      'shallowReactive of an object whose nested value is itself a reactive proxy: the nested one stays reactive (it was already a proxy), which can surprise.',
      'shallowRef holding a value that is later mutated AND reassigned: only the reassignment path triggers unless triggerRef is used for the mutation.',
      'A ref inside shallowReactive is still unwrapped at the top level but nested refs are not.',
      'markRaw on an object placed in deep reactive state prevents it from being proxied even though its container is deep.',
    ],
    runtimeBehavior: [
      'Shallow handlers skip the nested reactive() call in the get trap; everything else (scheduler, batching) is identical.',
      'triggerRef directly invokes the ref\'s dep trigger, scheduling dependents per the normal flush.',
      'toRaw on a shallow proxy returns the same raw object the shallow proxy already exposed at nested levels.',
    ],
    scalability: [
      'For very large datasets, shallow plus normalized/immutable update patterns scale far better than deep reactive over the whole tree.',
      'Combine shallowReactive top-level with markRaw on heavy sub-objects to keep the reactive graph minimal.',
    ],
    productionConcerns: [
      'Stale-UI bugs from forgotten nested reactivity are the main hazard — code review and documentation are essential.',
      'Mixing shallow and deep state in one structure increases cognitive load; isolate shallow regions clearly.',
      'Third-party objects must use shallowRef/markRaw to avoid proxy-induced breakage; audit any reactive() around external instances.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'shallowRef: triggers only on .value REASSIGN, not nested mutation.',
    'shallowReactive: only TOP-LEVEL keys reactive; nested stays plain.',
    'Purpose: skip deep proxy → save memory/tracking for big data.',
    'Use for large wholesale-replaced payloads/lists.',
    'Use to wrap non-reactive third-party instances (charts/maps/editors).',
    'triggerRef(ref): force update after intentional in-place mutation.',
    'markRaw: object NEVER made reactive (even inside reactive state).',
    'toRaw: get the underlying raw object from a proxy.',
    'Main risk: silent stale UI from ignored nested changes.',
    'Default to deep ref/reactive; reach for shallow only when justified.',
    'shallowRef of a primitive == ref of a primitive (no nesting to skip).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show one mutation of a shallowRef that triggers and one that does not.',
      hint: 'Reassign vs mutate inside.',
      solution: {
        lang: 'js',
        code: 'import { shallowRef } from \'vue\'\nconst s = shallowRef({ n: 0 })\ns.value.n = 1   // does NOT trigger (nested)\ns.value = { n: 2 } // DOES trigger (reassign)',
        explanation: [
          'Nested mutation of .value.n is invisible to shallow reactivity.',
          'Reassigning .value changes its identity and triggers dependents.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Mutate a shallowRef array in place and still update the UI.',
      hint: 'triggerRef.',
      solution: {
        lang: 'js',
        code: 'import { shallowRef, triggerRef } from \'vue\'\nconst list = shallowRef([1, 2, 3])\nlist.value.push(4)   // in-place, no auto-trigger\ntriggerRef(list)     // force dependents to re-run',
        explanation: [
          'push mutates the array without changing .value identity, so nothing triggers.',
          'triggerRef manually notifies dependents to re-render.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate shallowReactive: which of these update the UI? sre.top = 1 ; sre.nested.x = 2.',
      hint: 'Only top level is reactive.',
      solution: {
        lang: 'js',
        code: 'import { shallowReactive } from \'vue\'\nconst sre = shallowReactive({ top: 0, nested: { x: 0 } })\nsre.top = 1       // reactive (top-level key)\nsre.nested.x = 2  // NOT reactive (nested object is plain)\nsre.nested = { x: 2 } // reactive (replacing the top-level key)',
        explanation: [
          'Top-level key assignment is tracked and triggers.',
          'Mutating a nested plain object is not tracked.',
          'Replacing the whole nested key at the top level does trigger.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You must store a third-party map instance and a 50k-row dataset reactively without deep-proxy cost. Choose primitives and justify.',
      hint: 'shallowRef + markRaw considerations.',
      solution: {
        lang: 'js',
        code: 'import { shallowRef, markRaw, reactive } from \'vue\'\n\n// Map instance: must not be deeply proxied → shallowRef (or markRaw if nested)\nconst mapRef = shallowRef(null)\n// onMounted: mapRef.value = new MapLib(...)\n\n// 50k rows replaced wholesale → shallowRef avoids per-row proxies\nconst rows = shallowRef([])\n// rows.value = await fetch(...).then(r => r.json())\n\n// If both live inside a reactive container, exclude the instance:\nconst store = reactive({ map: markRaw({}), filters: { q: \'\' } })',
        explanation: [
          'shallowRef holds the map instance without proxying its internals (which could break it).',
          'shallowRef holds the large dataset; reassigning triggers one update, skipping deep wrapping.',
          'markRaw excludes a heavy/external object from deep reactivity when it sits inside reactive state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'shallowRef/shallowReactive show you can reason about reactivity cost and control, not just use the defaults. Explaining the depth tradeoff, triggerRef, and the markRaw/toRaw toolkit is a strong senior signal in performance and integration discussions.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely ask these. Product companies (Zoho, Flipkart, Razorpay) ask when to use shallow reactivity and how to integrate third-party libraries. FAANG-level interviews probe the depth mechanics, triggerRef, markRaw/toRaw, and performance tradeoffs for large state.',
    whatInterviewersExpect:
      'The reassignment-only vs top-level-only behavior, the performance and third-party-integration motivations, the triggerRef escape valve, awareness of the staleness risk, and how shallow variants relate to markRaw and toRaw.',
  },
}

export default shallowrefShallowreactive
