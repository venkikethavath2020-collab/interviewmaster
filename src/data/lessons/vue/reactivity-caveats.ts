import type { ConceptLesson } from '../../../types/lesson'

const reactivityCaveats: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactivity-caveats',
  name: 'Reactivity Caveats',
  category: 'reactivity',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Vue 3’s Proxy reactivity is powerful but not magic — knowing its limits prevents the #1 class of "why isn’t my UI updating?" bugs.',
    'Destructuring, replacing arrays/objects, primitives passed by value, and Map/Set mutations all have subtle rules you must internalize.',
    'These caveats are favourite interview traps precisely because they reveal whether you understand HOW reactivity is implemented, not just the API.',
    'Production incidents — stale lists, dropped updates, lost links after destructuring — almost always trace back to one of these caveats.',
    'Understanding them tells you exactly when to reach for ref, toRefs, computed, or a fresh assignment.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Reactivity is a security camera that only watches things you keep inside the marked room.',
    story: [
      'Imagine a security camera that automatically tells everyone when something in a special room changes.',
      'If you keep your toys inside the room, the camera sees every time you move one and announces it.',
      'But if you take a toy OUT of the room and hold it in your hand, the camera can’t see it anymore — you can change it all you like and nobody gets told.',
      'Vue’s reactivity is that camera. As long as your data stays "inside the room" (a reactive object you read through), Vue notices changes. The moment you pull a plain value out, Vue loses sight of it — that is a reactivity caveat.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue watches your data using a special wrapper (a Proxy) so it knows when you read or change something.',
    'The wrapper can only see changes you make THROUGH it — go around it and Vue is blind.',
    'Common surprises: pulling a value out of a reactive object (it becomes a plain copy), replacing a whole reactive object with assignment, or wrapping a single number in reactive (it won’t work — use ref).',
    'Once you know these rules, you know exactly which tool (ref, reactive, toRefs, computed) to use to keep updates flowing.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Reactivity caveats are the situations where Vue 3’s Proxy-based reactivity cannot track a change: destructuring/spreading a reactive object, reassigning a reactive variable, using reactive() on a primitive, passing a primitive into a function, or losing the proxy reference.',
    how: 'Reactivity works only when you READ and WRITE through the reactive Proxy. Any operation that yields a plain value or a new object detached from the proxy breaks the tracking link.',
    why: 'Vue 3 replaced Vue 2’s Object.defineProperty with Proxy, which fixed array-index and property-add issues — but Proxy still cannot observe values that have been copied out or variables that have been reassigned.',
    code: {
      label: 'The classic destructure / reassign caveats',
      lang: 'js',
      code: 'import { reactive, ref, toRefs } from \'vue\'\n\nlet state = reactive({ count: 0 })\n\n// Caveat 1: destructuring detaches\nconst { count } = state // plain 0, not reactive\n\n// Caveat 2: reassigning the variable drops the proxy\nstate = { count: 5 } // now a plain object, reactivity lost\n\n// Fixes:\nconst s = reactive({ count: 0 })\nconst { count: c } = toRefs(s) // keep link\nObject.assign(s, { count: 5 }) // mutate, do not reassign',
      explanation: [
        'Destructuring count reads the number once and detaches it.',
        'Reassigning state replaces the proxy with a plain object.',
        'toRefs keeps a live link when you must destructure.',
        'Object.assign mutates the existing proxy instead of replacing it.',
        'Rule of thumb: mutate through the proxy, never replace the proxy variable.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Reactivity caveats are the boundary conditions of Vue 3’s Proxy-based reactivity system. Because tracking and triggering happen only on get/set traps of the reactive Proxy, reactivity is lost whenever a value escapes the proxy: destructuring or spreading a reactive object copies primitive values, reassigning a reactive-bound variable replaces the proxy reference, calling reactive() on a primitive returns the primitive unwrapped, and passing a reactive property as a function argument passes a value rather than a tracked binding. Collections (Map/Set) require mutation via their methods, and refs auto-unwrap only at the top level of templates and reactive objects — nested or array-element refs do not.',

  // 7. Internal Working
  internalWorking: [
    'reactive(obj) returns a Proxy whose get trap calls track(target, key) to record the current effect as a dependency and whose set trap calls trigger(target, key) to re-run dependents.',
    'Tracking is per (target, key): if you never read a key THROUGH the proxy, no dependency is recorded, so later writes to that copied value cannot notify anything.',
    'Destructuring/spreading evaluates each property once and binds the resulting primitive — there is no further proxy access, so track is never called for that variable again.',
    'Reassigning a let bound to a reactive proxy simply repoints the variable to a new (often plain) object; existing effects still reference the OLD proxy, so they never see the new object.',
    'reactive() only wraps objects; given a primitive it returns it as-is (dev warning), because a Proxy cannot wrap a number/string — that is why primitives need ref(), which boxes the value in an object with a tracked .value.',
    'Collections use dedicated handlers: Map.set/Array.push go through instrumented methods that call trigger; bypassing them (e.g. setting a raw length) can miss triggers, and ref unwrapping is applied only at top-level template/reactive contexts, not inside arrays.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   reactive Proxy (tracked)            ESCAPES (untracked)
   ┌──────────────────────┐
   │ get → track(t,key)    │   destructure ─► plain value  ╳
   │ set → trigger(t,key)  │   spread {...x} ─► plain copy  ╳
   └──────────▲───────────┘   reassign var ─► new object   ╳
              │                reactive(5) ─► 5 (no proxy)  ╳
   read/write THROUGH proxy     pass prop arg ─► value      ╳
   = updates flow ✓             ──────────────────────────────
                                fix: ref / toRefs / mutate-in-place`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the reactive target object and its Proxy live together; the dependency map (targetMap: target → key → Set<effect>) also lives on the heap.',
    'When you destructure, the copied primitive is a brand-new binding with no entry in targetMap — nothing links it back to the proxy.',
    'When you reassign a let, the old proxy (and its targetMap entries) may still be referenced by effects, while your variable now points to an unrelated plain object.',
    'A ref is a small heap object { value, dep }; reading .value tracks, writing .value triggers — which is why primitives must be boxed in a ref to be reactive.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reactive on a primitive does nothing',
      lang: 'js',
      code: 'import { reactive, ref } from \'vue\'\n\nconst n = reactive(42)   // returns 42, NOT reactive (dev warn)\nconst m = ref(42)        // correct: m.value is reactive\nm.value++                // triggers updates',
      explanation: [
        'reactive() can only wrap objects; a number is returned unchanged.',
        'There is no Proxy around a primitive, so no tracking.',
        'ref boxes the value in an object with a reactive .value.',
        'For primitives always use ref, not reactive.',
      ],
    },
    intermediate: {
      label: 'Intermediate — replacing vs mutating',
      lang: 'js',
      code: 'import { reactive } from \'vue\'\n\nconst list = reactive({ items: [1, 2, 3] })\n\n// OK: mutate through the proxy\nlist.items.push(4)\nlist.items = [5, 6]      // OK: assigning a property still goes through set trap\n\n// NOT OK: reassign the proxy variable itself\nlet box = reactive({ items: [1] })\nbox = { items: [9] }     // box is now a plain object — reactivity lost',
      explanation: [
        'Mutating list.items or assigning list.items goes through the proxy set trap — tracked.',
        'In Vue 3, replacing an array via a property assignment IS reactive (unlike Vue 2 index issues).',
        'But reassigning the variable that HELD the proxy detaches it entirely.',
        'Keep the proxy in a const and mutate its properties.',
      ],
    },
    advanced: {
      label: 'Advanced — refs inside arrays do not auto-unwrap',
      lang: 'js',
      code: 'import { ref, reactive } from \'vue\'\n\nconst a = ref(1)\nconst obj = reactive({ a })  // top-level: obj.a auto-unwraps → number\nconsole.log(obj.a)           // 1 (not the ref)\n\nconst arr = reactive([ref(1)])\nconsole.log(arr[0])          // a REF, not 1 — must use arr[0].value',
      explanation: [
        'A ref placed at the top level of a reactive object is auto-unwrapped.',
        'So obj.a behaves like a plain number and stays reactive.',
        'But refs stored inside arrays (or Map/Set) are NOT unwrapped.',
        'You must access arr[0].value explicitly — a frequent gotcha.',
      ],
    },
    realProject: {
      label: 'Real project — fixing a lost-reactivity composable',
      lang: 'js',
      code: 'import { reactive, toRefs } from \'vue\'\n\nexport function useFilters() {\n  const state = reactive({ q: \'\', sort: \'asc\' })\n  function reset() {\n    // BAD: state = reactive({ q: \'\', sort: \'asc\' }) — detaches\n    // GOOD: mutate in place\n    state.q = \'\'\n    state.sort = \'asc\'\n  }\n  return { ...toRefs(state), reset }\n}',
      explanation: [
        'Reassigning state inside reset would detach the proxy consumers hold.',
        'Mutating fields in place keeps every subscriber connected.',
        'toRefs lets consumers destructure q/sort and stay reactive.',
        'This pattern avoids the most common composable reactivity bug.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why does destructuring a reactive object lose reactivity?',
      answer: 'Destructuring reads each property once and binds the resulting primitive. After that there is no further Proxy access, so Vue cannot track or trigger updates for the copied value.',
      explanation: 'Tie it to track/trigger: reactivity needs reads to go THROUGH the proxy.',
    },
    {
      level: 'beginner',
      question: 'Why can’t you use reactive() on a number or string?',
      answer: 'A Proxy can only wrap objects, so reactive() returns primitives unchanged (with a dev warning). Use ref(), which boxes the primitive in an object with a reactive .value.',
      explanation: 'Knowing the object-vs-primitive boundary and the ref fix is essential.',
    },
    {
      level: 'intermediate',
      question: 'What caveats from Vue 2 did Vue 3’s Proxy reactivity fix?',
      answer: 'Vue 2 used Object.defineProperty and could not detect adding/deleting object properties or setting array items by index/length, requiring Vue.set/$set. Vue 3’s Proxy traps catch property additions, deletions, and array index/length changes natively.',
      explanation: 'Contrasting the two engines shows you understand the implementation shift.',
    },
    {
      level: 'intermediate',
      question: 'If you reassign a variable that held a reactive object, what happens to reactivity?',
      answer: 'It breaks. Existing effects still reference the old proxy; your variable now points to a new (often plain) object that nothing is tracking. Mutate the proxy in place instead of reassigning it.',
      explanation: 'Reassignment vs in-place mutation is a core senior distinction.',
    },
    {
      level: 'advanced',
      question: 'Do refs auto-unwrap everywhere?',
      answer: 'No. Refs auto-unwrap at the top level of templates and reactive objects. Inside arrays, Map, or Set they are NOT unwrapped — you must access .value explicitly.',
      explanation: 'The array/collection unwrapping exception is a classic advanced trap.',
    },
    {
      level: 'senior',
      question: 'How do collection mutations interact with reactivity, and where can they go wrong?',
      answer: 'reactive() wraps Map/Set with instrumented methods (set/add/delete) that call trigger. Reactivity works when you use those methods; bypassing them or reading raw internals can miss triggers. Also, iterating a reactive collection tracks the iteration so additions/removals re-run effects.',
      explanation: 'Senior signal: knowing collections use dedicated handlers and method-based mutation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you keep reactivity when you must destructure? (toRefs/toRef)',
    'Why does ref exist if reactive already handles objects?',
    'What is the difference between assigning a reactive PROPERTY vs reassigning the reactive VARIABLE?',
    'When does a ref auto-unwrap and when does it not?',
    'How does Vue 3 detect array index changes that Vue 2 could not?',
    'How do shallowRef/shallowReactive change which mutations are tracked?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Destructuring a reactive object and expecting reactive variables.',
      why: 'Primitives are copied out; the link to the proxy is severed.',
      fix: 'Use toRefs/toRef, or keep accessing through the proxy object.',
    },
    {
      mistake: 'Reassigning the variable that holds a reactive object.',
      why: 'Effects still point at the old proxy; the new object is untracked.',
      fix: 'Mutate properties in place (Object.assign, set fields) instead of reassigning.',
    },
    {
      mistake: 'Wrapping a primitive with reactive().',
      why: 'Proxies only wrap objects, so the primitive is returned unchanged.',
      fix: 'Use ref() for primitives.',
    },
    {
      mistake: 'Storing refs in arrays/Map/Set and expecting auto-unwrap.',
      why: 'Unwrapping applies only at top level of templates and reactive objects, not inside collections.',
      fix: 'Access .value explicitly, or store reactive objects instead of bare refs.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composable authors return toRefs(state) and mutate state in place specifically to dodge the destructure/reassign caveats.' },
    { area: 'Pinia', detail: 'storeToRefs exists because destructuring a store would otherwise lose reactivity — a direct response to this caveat.' },
    { area: 'Component library', detail: 'Libraries document which returned values are refs vs reactive objects so consumers know where .value and unwrapping apply.' },
    { area: 'Vue', detail: 'Form state replaced via Object.assign(form, serverData) instead of reassigning the form variable, to keep bindings live.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Understanding caveats lets you avoid unnecessary deep reactive wrapping, reducing Proxy overhead.',
      'Mutating in place avoids re-creating proxies and re-establishing dependencies.',
    ],
    bad: [
      'Working around caveats with deep clones or full reassignments forces full re-tracking and re-renders.',
      'Storing many bare refs in arrays and unwrapping manually adds boilerplate and access cost.',
    ],
    optimizations: [
      'Prefer shallowRef/shallowReactive for large structures you replace wholesale.',
      'Use markRaw for objects that never need reactivity to skip proxy creation.',
      'Mutate existing proxies (Object.assign) rather than reassigning to avoid dependency churn.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'ref', 'reactive', 'proxy-reactivity'],
    nextConcepts: ['toref-torefs', 'shallowref-shallowreactive', 'ref-vs-reactive', 'computed'],
    dependencyNote:
      'Reactivity caveats are the failure modes of the Proxy reactivity model, so you need ref, reactive, and proxy-reactivity first. They directly motivate toRefs (destructure safely) and shallowRef/shallowReactive (control depth), making them a hub in the reactivity track.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the reactive Proxy with get→track and set→trigger labels.',
      'Show four arrows escaping the proxy: destructure, spread, reassign, reactive(primitive).',
      'Mark each escaped value with a red ╳ for "untracked".',
      'Draw the fixes: toRefs (re-link), ref (box primitive), Object.assign (mutate in place).',
      'Say: "Reactivity only works through the proxy; anything that copies a value out or replaces the proxy is invisible — these are the caveats."',
    ],
    diagram: `   [ Proxy: get=track / set=trigger ]
        │ destructure ─► value ╳
        │ spread      ─► copy  ╳
        │ reassign    ─► newObj╳
        │ reactive(5) ─► 5     ╳
   FIX: toRefs / ref / Object.assign(in place)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue 3 reactivity is a Proxy that tracks reads and triggers writes — so it only works THROUGH the proxy. Caveats: destructuring/spreading copies primitives out (use toRefs), reassigning the reactive variable detaches it (mutate in place), reactive() ignores primitives (use ref), refs don’t auto-unwrap inside arrays/Map/Set (use .value). Vue 3’s Proxy fixed Vue 2’s add/delete and array-index blind spots, but the copy-out and reassignment caveats remain.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue 3’s reactivity is built on Proxy: reading a property fires a get trap that calls track to register the current effect as a dependency, and writing fires a set trap that calls trigger to re-run dependents. The crucial consequence is that reactivity only works when you read and write THROUGH the proxy — and the caveats are all the ways values escape it. First, destructuring or spreading a reactive object reads each property once and binds a plain primitive, so there is no further proxy access and updates stop; the fix is toRefs/toRef, which return delegating refs. Second, reassigning the variable that held a reactive object repoints it to a new plain object while existing effects still reference the old proxy, so you must mutate in place — Object.assign or setting fields — not reassign. Third, reactive() can only wrap objects; given a primitive it returns it unchanged, which is exactly why ref exists: it boxes the value in an object with a reactive .value. Fourth, ref auto-unwrapping is only applied at the top level of templates and reactive objects — refs stored inside arrays, Maps, or Sets are not unwrapped and need explicit .value. It is worth noting Vue 3 actually fixed several Vue 2 caveats: with Object.defineProperty, Vue 2 couldn’t detect property additions/deletions or array index/length changes and needed Vue.set; Proxy traps catch all of those natively. So the modern caveats are mostly about copying values out and replacing proxies, plus the collection-unwrapping exception. Knowing these tells you precisely when to reach for ref, toRefs, computed, or in-place mutation.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Deep reactivity (reactive) is convenient but proxies every nested access; shallow variants trade granularity for speed.',
      'In-place mutation keeps dependencies but is more verbose than reassigning a fresh object.',
    ],
    edgeCases: [
      'Refs inside arrays/Map/Set are not auto-unwrapped.',
      'reactive() returns the same proxy for the same target (identity), but wrapping an already-reactive object returns it as-is.',
      'Adding a property that did not exist at toRefs time yields no ref for it.',
      'markRaw objects are permanently excluded from reactivity even inside a reactive parent.',
    ],
    runtimeBehavior: [
      'targetMap (WeakMap of target → key → dep set) drives track/trigger; copied values have no entry.',
      'Collection handlers instrument set/add/delete/clear and iteration to trigger correctly.',
      'Array methods that mutate (push/splice) are intercepted to track length and indices.',
    ],
    scalability: [
      'Large, frequently replaced datasets benefit from shallowRef + manual triggerRef to avoid deep proxy cost.',
      'Excessive deep reactive trees increase proxy allocation and tracking overhead at scale.',
    ],
    productionConcerns: [
      'Lost reactivity after destructuring/reassignment is the most common silent UI-not-updating bug.',
      'Mixing bare refs into arrays causes intermittent .value bugs that are hard to spot in review.',
      'Document return shapes (ref vs reactive) in shared composables to prevent misuse.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Reactivity works only THROUGH the proxy (get=track, set=trigger).',
    'Destructure/spread → plain copy, reactivity lost → use toRefs.',
    'Reassign the reactive variable → detaches → mutate in place.',
    'reactive(primitive) → returned unchanged → use ref.',
    'Refs auto-unwrap only at top level of templates/reactive objects.',
    'Refs inside arrays/Map/Set → need .value.',
    'Vue 3 Proxy fixed Vue 2 add/delete + array-index caveats.',
    'Object.assign(target, src) to replace contents reactively.',
    'shallowRef/shallowReactive limit tracked depth.',
    'markRaw opts an object out of reactivity entirely.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Make a reactive counter for a single number that updates the UI.',
      hint: 'A number cannot be reactive() — use ref.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nconst count = ref(0)\ncount.value++ // triggers updates; count is reactive',
        explanation: ['reactive() ignores primitives.', 'ref boxes the number with a reactive .value.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Replace the contents of reactive form state with server data WITHOUT losing reactivity for existing bindings.',
      hint: 'Do not reassign the variable.',
      solution: {
        lang: 'js',
        code: 'import { reactive } from \'vue\'\nconst form = reactive({ name: \'\', email: \'\' })\nfunction load(data) {\n  Object.assign(form, data) // mutate in place — bindings stay live\n}',
        explanation: [
          'Reassigning form would detach existing effects.',
          'Object.assign mutates through the proxy set trap.',
          'All template bindings remain connected.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show why arr[0] is a ref (not a number) and fix the access.',
      hint: 'Refs inside arrays are not unwrapped.',
      solution: {
        lang: 'js',
        code: 'import { ref, reactive } from \'vue\'\nconst arr = reactive([ref(10)])\n// console.log(arr[0]) → a ref object, not 10\nconsole.log(arr[0].value) // 10 — explicit unwrap needed',
        explanation: [
          'Auto-unwrap does not apply inside arrays.',
          'arr[0] returns the ref itself.',
          'Use arr[0].value, or store a reactive object instead of a bare ref.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A composable returns const { user } = useUser() but user never updates. Diagnose and fix it.',
      hint: 'The composable likely returns a destructured/plain value.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs } from \'vue\'\n// BAD: return { user: state.user }\nexport function useUser() {\n  const state = reactive({ user: null })\n  function set(u) { state.user = u }\n  return { ...toRefs(state), set } // user is now a linked ref\n}',
        explanation: [
          'Returning state.user copies a plain value, losing reactivity.',
          'toRefs returns a delegating ref for user.',
          'Now the consumer’s user.value tracks state.user.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Caveats are where surface-level API knowledge meets real understanding. Engineers who know them debug "UI not updating" in seconds and write composables that never silently break — a clear seniority signal.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "why doesn’t reactive work on a number". Product companies (Zoho, Flipkart, Razorpay) give a broken composable/destructure and ask for the fix. FAANG-level interviews probe track/trigger internals, collection handlers, and ref-unwrapping rules.',
    whatInterviewersExpect:
      'They expect you to explain that reactivity works only through the proxy, list the main caveats (destructure, reassign, primitive, collection unwrapping), give the correct fix for each, and note which Vue 2 caveats Vue 3 resolved.',
  },
}

export default reactivityCaveats
