import type { ConceptLesson } from '../../../types/lesson'

const toRefToRefs: ConceptLesson = {
  // 1. Concept Summary
  slug: 'toref-torefs',
  name: 'toRef & toRefs',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Destructuring a reactive object breaks reactivity — toRef/toRefs are the official escape hatch that keeps the connection alive.',
    'Every composable that returns "loose" values you can destructure (const { user, loading } = useUser()) relies on toRefs under the hood.',
    'They let you pass a single reactive property into another function or composable while it stays linked to the source.',
    'toRef can create a ref to a property that does not exist yet, which is essential for safely binding optional props.',
    'Misusing them is a top cause of "my value updates but the template does not re-render" bugs in interviews and real code.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'toRef is a magic straw that always sips from the same juice box, no matter where you carry it.',
    story: [
      'Imagine a big juice box (a reactive object) with several flavors inside, like apple and grape.',
      'If you pour some apple juice into a separate cup and walk away, refilling the big box later does nothing to your cup — they are now disconnected.',
      'But if instead you use a magic straw that reaches all the way back into the apple section of the box, then no matter how far you walk, sipping the straw always gives you the freshest apple juice.',
      'toRef gives you that magic straw for one flavor, and toRefs hands you a whole bundle of straws — one for every flavor in the box — so you can carry them around separately but they all still reach back to the same box.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue, a reactive object is a special object that Vue watches for changes so the screen updates automatically.',
    'If you copy a single value out of it into a normal variable, Vue can no longer see when that value changes, so the screen stops updating.',
    'toRef makes a special two-way link to one property of the object, and toRefs does it for all the properties at once.',
    'Because they stay linked, you can pull values out (destructure) and still keep the automatic updating working.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'toRef(source, key) creates a ref that stays in sync with a single property of a reactive object. toRefs(object) converts every property of a reactive object into individual refs, returning a plain object of refs you can safely destructure.',
    how: 'The returned ref does not hold a copy — its .value is a getter/setter that reads from and writes to the original reactive source, so changes flow in both directions.',
    why: 'Plain destructuring (const { count } = reactive(...)) copies the current primitive value and severs reactivity. toRef/toRefs preserve the live link so composables can return destructurable, still-reactive values.',
    code: {
      label: 'Destructuring safely with toRefs',
      lang: 'js',
      code: 'import { reactive, toRefs } from \'vue\'\n\nconst state = reactive({ count: 0, name: \'Sam\' })\n\n// BAD: count is now a detached number, loses reactivity\n// const { count } = state\n\n// GOOD: each becomes a linked ref\nconst { count, name } = toRefs(state)\n\ncount.value++          // also updates state.count\nconsole.log(state.count) // 1',
      explanation: [
        'reactive() makes state observable by Vue.',
        'Plain destructuring would copy 0 into a number and lose the link.',
        'toRefs turns each property into a ref whose .value proxies the original.',
        'Incrementing count.value writes straight back into state.count.',
        'This is exactly how composables expose values you can destructure.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'toRef creates an ObjectRefImpl: a ref-like object whose value getter/setter delegate to source[key] on the original reactive object, so reads track and writes trigger the underlying reactive property rather than holding an independent value. toRefs iterates the source object and produces a plain object whose every (enumerable) key maps to a toRef of that key. Both exist to bridge Vue’s ref API with reactive objects so that properties can be passed around or destructured without losing the dependency link to their reactive source.',

  // 7. Internal Working
  internalWorking: [
    'toRef(source, key) constructs an ObjectRefImpl instance carrying a reference to the source object and the key — it does NOT read the value eagerly.',
    'Accessing the returned ref.value invokes a getter that returns source[key]; because source is a reactive Proxy, this access is tracked by the current effect just like a normal property read.',
    'Writing ref.value = x invokes a setter that does source[key] = x, which fires the Proxy trap and triggers any dependent effects.',
    'toRefs(object) checks the object is reactive (warns in dev if not), then loops the object’s own keys and assigns ret[key] = toRef(object, key) for each, returning a plain (non-reactive) container of refs.',
    'Because the refs delegate rather than copy, the container can be spread/destructured while each ref still points back into the same reactive Proxy.',
    'toRef also supports a fallback/default for keys that do not yet exist, so the created ref is valid even before the property is set.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        reactive state (Proxy)
        ┌───────────────────────────┐
        │  count: 0                 │
        │  name : "Sam"             │
        └───────▲───────────▲───────┘
                │           │
        getter/ │   getter/ │  (delegating refs — NOT copies)
        setter  │   setter  │
        ┌───────┴──┐    ┌───┴───────┐
        │ countRef │    │  nameRef  │   ◄── from toRefs(state)
        │ .value ──┼─►  │ .value ───┼─►  reads/writes back into Proxy
        └──────────┘    └───────────┘

   const { count, name } = toRefs(state)  // safe to destructure`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The reactive Proxy and its target object live on the heap; toRefs does NOT clone the data.',
    'Each ObjectRefImpl is a tiny heap object holding only { _object: source, _key: key } — no stored value.',
    'A ref’s .value access walks to source[key] at read time, so memory stays minimal and there is a single source of truth.',
    'Because refs keep a reference to the source, the source stays alive as long as any toRef of it is reachable.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — toRef on one property',
      lang: 'js',
      code: 'import { reactive, toRef } from \'vue\'\n\nconst state = reactive({ volume: 50 })\nconst volume = toRef(state, \'volume\')\n\nvolume.value = 70\nconsole.log(state.volume) // 70  (two-way link)',
      explanation: [
        'toRef(state, "volume") creates a ref linked to state.volume.',
        'Setting volume.value writes through to state.volume.',
        'No data is copied — both refer to the same property.',
        'Useful when a function expects a ref but you only have one property.',
      ],
    },
    intermediate: {
      label: 'Intermediate — why plain destructuring fails',
      lang: 'js',
      code: 'import { reactive, toRefs, watchEffect } from \'vue\'\n\nconst state = reactive({ count: 0 })\n\n// Detached copy — watchEffect never re-runs:\nconst { count: brokenCount } = state\nwatchEffect(() => console.log(\'broken\', brokenCount))\n\n// Linked ref — watchEffect re-runs on every change:\nconst { count } = toRefs(state)\nwatchEffect(() => console.log(\'linked\', count.value))\n\nstate.count++ // logs only "linked 1"',
      explanation: [
        'brokenCount is a primitive snapshot (0); incrementing state.count cannot change it.',
        'watchEffect over brokenCount never re-runs because nothing reactive was read.',
        'count from toRefs reads count.value, a tracked Proxy access.',
        'So the linked effect re-runs and logs the new value; the broken one stays silent.',
      ],
    },
    advanced: {
      label: 'Advanced — toRef with a default for optional props',
      lang: 'js',
      code: 'import { toRef } from \'vue\'\n\n// inside <script setup>\nconst props = defineProps({ title: String, pageSize: Number })\n\n// ref to a possibly-undefined prop with a sensible fallback\nconst pageSize = toRef(props, \'pageSize\', 20)\n\n// pageSize.value is 20 until parent passes a value,\n// then it reflects the prop reactively (read-only on props)\nconsole.log(pageSize.value)',
      explanation: [
        'toRef can take a third argument used when the property is undefined.',
        'This avoids null checks when wiring optional props into composables.',
        'Because props are readonly, the ref reflects parent updates but you should not write to it.',
        'The ref stays reactive: when the parent passes pageSize, the value updates.',
      ],
    },
    realProject: {
      label: 'Real project — a composable returning destructurable state',
      lang: 'js',
      code: 'import { reactive, toRefs } from \'vue\'\n\nexport function usePagination(total) {\n  const state = reactive({ page: 1, perPage: 10, total })\n  function next() { state.page++ }\n  function prev() { if (state.page > 1) state.page-- }\n  // spread linked refs + methods\n  return { ...toRefs(state), next, prev }\n}\n\n// component <script setup>\nconst { page, perPage, next, prev } = usePagination(240)\n// page.value, perPage.value stay reactive in the template',
      explanation: [
        'Internally state is one reactive object — easy to mutate via methods.',
        'toRefs lets the consumer destructure page/perPage and keep reactivity.',
        'Spreading methods alongside the refs gives a clean, flat API.',
        'This is the canonical composable shape used across production Vue apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem do toRef and toRefs solve?',
      answer: 'They preserve reactivity when you extract properties from a reactive object. Plain destructuring copies primitive values and breaks the reactive link; toRef/toRefs create refs that delegate back to the source.',
      explanation: 'A good answer names the broken-destructuring problem and states that the returned refs are live links, not copies.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between toRef and toRefs?',
      answer: 'toRef(source, key) makes ONE ref linked to a single property. toRefs(source) converts EVERY property of a reactive object into refs and returns a plain object of those refs.',
      explanation: 'Mentioning that toRefs returns a plain (non-reactive) container of refs you can destructure shows precision.',
    },
    {
      level: 'intermediate',
      question: 'Why does const { count } = reactive({ count: 0 }) lose reactivity?',
      answer: 'Destructuring reads count once and binds a plain number to the variable. There is no Proxy access afterward, so Vue cannot track or trigger updates for it; later changes to the source do not propagate.',
      explanation: 'Connecting it to Proxy track/trigger — reactivity needs the property to be read through the Proxy — is the senior signal.',
    },
    {
      level: 'intermediate',
      question: 'Can you write through a ref created by toRef?',
      answer: 'Yes for a normal reactive object — the setter writes back to source[key]. But if the source is readonly (like props), writing is disallowed/warns; treat such refs as read-only.',
      explanation: 'Distinguishing writable reactive sources from readonly props demonstrates real-world awareness.',
    },
    {
      level: 'advanced',
      question: 'How does toRef behave when the property does not exist yet?',
      answer: 'toRef still creates a valid ref; reading .value yields undefined (or the provided default in Vue 3.3+). When the property is later set on the source, the ref reflects it. This makes it safe for optional props.',
      explanation: 'The default-value overload and lazy reading are advanced details many candidates miss.',
    },
    {
      level: 'senior',
      question: 'What is the runtime cost of toRefs on a large object, and any pitfalls?',
      answer: 'toRefs only iterates own enumerable keys present at call time, creating one tiny delegating ref each — cheap, but it snapshots the KEY SET, so properties added later are not included. It also only works on reactive objects; calling it on a plain object warns and gives non-reactive refs.',
      explanation: 'Senior answers note the key-set snapshot limitation and the reactive-source requirement.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What happens if you call toRefs on a plain (non-reactive) object?',
    'Does toRefs include properties added to the source after the call? (no — keys are snapshotted)',
    'How is toRef different from computed for reading a single property?',
    'Why are props readonly, and how does toRef(props, key) interact with that?',
    'When would you prefer returning the whole reactive object vs toRefs from a composable?',
    'How does toRef relate to the ref unwrapping done in templates?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Destructuring a reactive object directly and expecting reactivity.',
      why: 'It copies primitive values; later source changes are invisible and the template will not update.',
      fix: 'Wrap with toRefs first: const { a, b } = toRefs(state).',
    },
    {
      mistake: 'Calling toRefs on a plain object or a ref.',
      why: 'toRefs is meant for reactive objects; on a plain object it warns and the refs are not reactive.',
      fix: 'Make the source reactive() first, or use toRef for a single property of a ref-wrapped object.',
    },
    {
      mistake: 'Writing to a toRef created from props.',
      why: 'Props are readonly; mutation warns and breaks one-way data flow.',
      fix: 'Use the ref read-only, or copy into local state / use a computed with get/set + emit.',
    },
    {
      mistake: 'Expecting toRefs to track properties added after the call.',
      why: 'toRefs snapshots the key set at call time; new keys get no ref.',
      fix: 'Define all properties up front in the reactive object, or re-run toRefs / use the object directly.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables return { ...toRefs(state), ...methods } so consumers can destructure values while keeping them reactive — the standard composable contract.' },
    { area: 'Component library', detail: 'Headless components forward individual reactive props/state via toRef into slot scopes or child composables without flattening reactivity.' },
    { area: 'Pinia', detail: 'storeToRefs (Pinia’s tailored version of toRefs) lets you destructure state/getters from a store while keeping reactivity and leaving actions un-wrapped.' },
    { area: 'Nuxt', detail: 'useState/useAsyncData consumers often toRef into derived composables to pass a single reactive slice down a feature module.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'No data copying — refs delegate to a single source of truth, so memory overhead is tiny.',
      'Enables a flat, destructurable composable API without giving up reactivity.',
    ],
    bad: [
      'toRefs on huge objects creates one ref per key up front, even for properties you never use.',
      'Overusing toRef everywhere can obscure where the single reactive source actually lives.',
    ],
    optimizations: [
      'Prefer toRef for the one or two properties you actually need instead of toRefs on a giant object.',
      'Return the reactive object directly when the consumer will not destructure, avoiding ref wrappers.',
      'Use storeToRefs for Pinia instead of manual toRefs to avoid wrapping actions accidentally.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'ref', 'reactive', 'ref-vs-reactive'],
    nextConcepts: ['reactivity-caveats', 'composables', 'pinia-stores-actions', 'props'],
    dependencyNote:
      'toRef/toRefs sit on top of ref and reactive: you must understand both, plus why destructuring breaks reactivity (a reactivity caveat), before they make sense. They are the bridge that makes idiomatic composables and Pinia’s storeToRefs possible.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a reactive object box with two properties (count, name).',
      'Show a plain destructure pulling count out as a detached number — draw a broken arrow.',
      'Now draw toRefs producing two small ref boxes, each with an arrow pointing BACK into the object.',
      'Emphasize the arrows are getter/setter delegations, not copies.',
      'Say: "toRefs lets me destructure without cutting the wire — every ref still reads and writes the same reactive source."',
    ],
    diagram: `  reactive { count, name }
        │           ▲ ▲
   plain X (copy)   │ │  toRefs → countRef, nameRef
        ╳           │ │  (.value delegates back)
                    └─┴── still linked = reactive`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Destructuring a reactive object copies primitives and kills reactivity. toRef(source, key) makes one ref that delegates its .value getter/setter to a property of the source, and toRefs turns every property into such a ref so you can safely destructure. Nothing is copied — the refs read and write the original Proxy, so updates still flow. This is how composables return destructurable, still-reactive values, and Pinia’s storeToRefs is the same idea.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In Vue 3, reactivity on objects comes from a Proxy that tracks property reads and triggers effects on writes. The catch is that if you destructure a reactive object — const { count } = state — you read count once and bind a plain number; there is no further Proxy access, so Vue can neither track nor trigger it and your template stops updating. toRef and toRefs are the fix. toRef(source, key) returns a special ref whose .value is a getter/setter that delegates to source[key]: reading it is a tracked Proxy access and writing it triggers the source, so the link is two-way and live, not a copy. toRefs simply applies toRef to every key of a reactive object and returns a plain object of those refs, which you can then destructure freely. This is exactly why composables return { ...toRefs(state), ...methods }: internally you mutate one tidy reactive object, but the consumer gets flat, destructurable, reactive values. Pinia’s storeToRefs is the same pattern specialized for stores. A couple of caveats: toRefs snapshots the key set at call time, so properties added later get no ref; and a toRef from props is effectively read-only because props are readonly. toRef also accepts a default for properties that do not exist yet, which makes it ideal for optional props.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Flat destructurable API (toRefs) vs single-object simplicity (return the reactive object): refs are ergonomic for consumers but add wrapper objects.',
      'toRef’s lazy delegation gives one source of truth but makes the value’s origin less obvious than a local ref.',
    ],
    edgeCases: [
      'toRefs snapshots keys at call time — dynamically added properties are not exposed.',
      'toRef on a readonly source (props) yields a ref you must not write to.',
      'toRef on a non-existent key returns a ref reading undefined (or the provided default in 3.3+).',
      'Spreading toRefs then re-wrapping in reactive() can double-wrap — usually unnecessary.',
    ],
    runtimeBehavior: [
      'Each toRef is an ObjectRefImpl with no stored value; reads/writes hit the source Proxy live.',
      'Dependency tracking happens at .value access time, identical to reading the source property.',
      'toRefs cost is O(keys) at call time; per-ref access cost matches normal Proxy property access.',
    ],
    scalability: [
      'For large state objects, prefer toRef on the few needed keys to avoid creating dozens of unused refs.',
      'In big component trees, passing a single toRef down keeps a clear, narrow reactive dependency.',
    ],
    productionConcerns: [
      'Accidental writes through toRef(props) cause subtle one-way-data-flow violations — lint or readonly typing helps.',
      'Forgetting storeToRefs in Pinia and using plain destructuring is a recurring reactivity bug in code review.',
      'Document that toRefs does not pick up later-added keys to prevent confusing reports.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'toRef(source, key) → one ref linked to source[key].',
    'toRefs(reactiveObj) → plain object of refs, one per key.',
    'Refs DELEGATE (getter/setter), they do not copy.',
    'Plain destructuring of reactive() breaks reactivity — use toRefs.',
    'toRefs snapshots the key set at call time (no later-added keys).',
    'toRef from props is read-only (props are readonly).',
    'toRef(source, key, default) supports a fallback (Vue 3.3+).',
    'Composable pattern: return { ...toRefs(state), ...methods }.',
    'Pinia equivalent: storeToRefs(store).',
    'Only meaningful on reactive sources — plain objects warn.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given const state = reactive({ x: 1, y: 2 }), destructure x and y so both stay reactive.',
      hint: 'Wrap state with toRefs before destructuring.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs } from \'vue\'\nconst state = reactive({ x: 1, y: 2 })\nconst { x, y } = toRefs(state)\nx.value++ // state.x is now 2',
        explanation: ['toRefs converts each key to a linked ref.', 'x.value writes back to state.x, preserving reactivity.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a composable useToggle that returns a destructurable { on } ref and a toggle() method, with internal state in a reactive object.',
      hint: 'Mutate reactive state inside toggle; expose with toRefs.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRefs } from \'vue\'\nexport function useToggle(initial = false) {\n  const state = reactive({ on: initial })\n  const toggle = () => { state.on = !state.on }\n  return { ...toRefs(state), toggle }\n}',
        explanation: [
          'Internal state is one reactive object, easy to mutate.',
          'toRefs makes { on } destructurable and still reactive.',
          'The consumer writes const { on, toggle } = useToggle().',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a ref to an optional prop maxItems that defaults to 50 when the parent does not pass it.',
      hint: 'Use toRef with a third default argument.',
      solution: {
        lang: 'js',
        code: 'import { toRef } from \'vue\'\nconst props = defineProps({ maxItems: Number })\nconst maxItems = toRef(props, \'maxItems\', 50)\n// maxItems.value is 50 until the parent passes maxItems',
        explanation: [
          'The default argument supplies a value when the prop is undefined.',
          'The ref stays reactive: passing maxItems later updates it.',
          'Do not write to it — props are readonly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and fix this broken composable: function useCounter(){ const s = reactive({ n: 0 }); return { n: s.n, inc: () => s.n++ } }. The template using n never updates.',
      hint: 'n: s.n copies a number. Return a linked ref instead.',
      solution: {
        lang: 'js',
        code: 'import { reactive, toRef } from \'vue\'\nexport function useCounter() {\n  const s = reactive({ n: 0 })\n  return { n: toRef(s, \'n\'), inc: () => s.n++ }\n}\n// or: return { ...toRefs(s), inc: () => s.n++ }',
        explanation: [
          'n: s.n captured 0 as a plain number — no reactive link.',
          'toRef(s, "n") returns a ref delegating to s.n, so reads are tracked.',
          'Now inc() mutates s.n and the template re-renders.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'toRef/toRefs are the glue of the Composition API. Once you understand them, composables, Pinia’s storeToRefs, and the whole "destructure without breaking reactivity" story click into place — and you stop writing the most common reactivity bug in Vue 3.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and the difference between the two. Product companies (Zoho, Flipkart, Razorpay) hand you a broken composable and ask you to fix the lost reactivity. FAANG-level interviews probe the ObjectRefImpl delegation, the key-set snapshot limitation, and readonly props.',
    whatInterviewersExpect:
      'They expect you to explain why plain destructuring breaks reactivity (no Proxy access), state that toRef/toRefs return delegating refs rather than copies, show the composable return pattern, and mention storeToRefs as the Pinia equivalent.',
  },
}

export default toRefToRefs
