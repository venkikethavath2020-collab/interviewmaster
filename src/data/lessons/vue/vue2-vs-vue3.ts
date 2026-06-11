import type { ConceptLesson } from '../../../types/lesson'

const vue2VsVue3: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue2-vs-vue3',
  name: 'Vue 2 vs Vue 3',
  category: 'fundamentals',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Most real codebases are either on Vue 3 or migrating from Vue 2 — interviewers ask to gauge whether you can work in and migrate both.',
    'The reactivity rewrite (Object.defineProperty → Proxy) removed the famous Vue 2 caveats; understanding why is a top interview signal.',
    'The Composition API and <script setup> are Vue 3 flagships; knowing what they solve over Options API/mixins is essential.',
    'Vue 2 reached end-of-life, so migration knowledge (compat build, breaking changes) is a practical, in-demand skill.',
    'It is the cleanest way to demonstrate you understand the framework\'s evolution and the reasoning behind major API decisions.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vue 2 to Vue 3 is like upgrading from a watchdog that only notices toys it was told about, to one that notices any toy in the room.',
    story: [
      'Imagine an old guard dog. When you set up the room, you point at each toy and say "watch this one". If you bring in a new toy later, the dog ignores it — it was never told.',
      'That was Vue 2: it could only watch the data it was told about at the start. If you added a new piece of data later, it would not react.',
      'The new guard dog (Vue 3) is smarter — it watches the whole room. Any toy added or removed, it notices instantly, no special pointing needed.',
      'Vue 3 also gave builders a tidier toolbox to organize their work, so big projects do not turn into a tangled mess.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue 3 is the newer version of Vue, rewritten to be faster, smaller, and easier to scale to big apps.',
    'The biggest change is how it watches data: Vue 2 had limits (it could miss newly added properties), while Vue 3 uses a smarter system that catches everything.',
    'Vue 3 also added the Composition API, a new way to organize a component\'s logic by feature instead of by type, which helps reuse code.',
    'It is built with TypeScript in mind, so the editor can catch more mistakes for you.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue 3 is a ground-up rewrite of Vue 2 with the same mental model but major upgrades: a Proxy-based reactivity system (replacing Object.defineProperty), the Composition API and <script setup> alongside the Options API, better TypeScript support, multiple root nodes (fragments), new built-ins (Teleport, Suspense), and a smaller, tree-shakable, faster runtime.',
    how: 'You bootstrap with createApp instead of new Vue, write reactive state with ref/reactive instead of relying on the data() option\'s defineProperty conversion, and can colocate logic by feature in setup() rather than spreading it across data/methods/computed/watch.',
    why: 'It fixes Vue 2 reactivity caveats, scales better for large components via composables, improves performance and bundle size, and gives first-class TypeScript inference.',
    code: {
      label: 'Same counter: Vue 2 Options vs Vue 3 setup',
      lang: 'vue',
      code: '<!-- Vue 2 (Options API) -->\n<script>\nexport default {\n  data() { return { count: 0 } },\n  methods: { inc() { this.count++ } },\n}\n</script>\n\n<!-- Vue 3 (Composition API, script setup) -->\n<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\nfunction inc() { count.value++ }\n</script>',
      explanation: [
        'Vue 2 declares state in data() and uses this.count via the Options API.',
        'Vue 3 uses ref(0) and accesses count.value directly in script setup.',
        'Vue 3 colocates state and the function that updates it, no this needed.',
        'Both render the same way; the difference is reactivity internals and organization.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue 3 is a rewrite of Vue 2 that replaces the Object.defineProperty-based reactivity (which could not detect property addition/deletion or array index/length changes without Vue.set) with a Proxy-based system that intercepts all operations. It introduces the Composition API (setup/<script setup>) for logic colocation and reuse via composables, ships a smaller tree-shakable runtime with a faster optimized compiler (static hoisting, patch flags), enables multiple root nodes (fragments), and adds built-ins like Teleport and Suspense. The global API moved from the singleton Vue object to per-application instances (createApp), and TypeScript support is first-class.',

  // 7. Internal Working
  internalWorking: [
    'Vue 2 wrapped each data property at init time with Object.defineProperty getters/setters, so properties added later were not reactive (needing Vue.set) and array index/length changes were not tracked.',
    'Vue 3 wraps objects in a Proxy, intercepting get/set/has/deleteProperty for the whole object, so new properties, deletions, and array mutations are reactive automatically.',
    'Vue 3 reactivity is lazy and on-demand: nested objects are proxied when accessed, reducing init cost vs Vue 2\'s eager full-tree conversion.',
    'The Vue 3 compiler emits patch flags and hoists static VNodes, so the runtime skips diffing unchanged parts — faster updates than Vue 2.',
    'Global configuration moved from the shared Vue constructor to per-instance app contexts (createApp), eliminating cross-app/test pollution.',
    'The runtime is modularized and tree-shakable, so unused features (transitions, etc.) are dropped from the bundle, unlike Vue 2\'s monolithic build.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   VUE 2 reactivity                 VUE 3 reactivity
   ────────────────                 ────────────────
   data() ─► defineProperty         reactive() ─► Proxy
     per known key                    whole object intercepted
   add new key  ✗ not reactive      add new key   ✓ reactive
   arr[i] = x   ✗ (need Vue.set)     arr[i] = x    ✓
   arr.length = n ✗                  arr.length=n  ✓

   ORGANIZATION
   Options API: data/methods/computed/watch (by type)
   Composition API: setup() groups logic (by feature) + composables`,

  // 9. Memory Visualization (omitted — see proxy-reactivity)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — bootstrapping difference',
      lang: 'js',
      code: '// Vue 2\nimport Vue from \'vue\'\nnew Vue({ render: h => h(App) }).$mount(\'#app\')\n\n// Vue 3\nimport { createApp } from \'vue\'\ncreateApp(App).mount(\'#app\')',
      explanation: [
        'Vue 2 used the Vue constructor with new Vue and $mount.',
        'Vue 3 uses createApp(App).mount, returning an isolated app instance.',
        'Global config (Vue.use vs app.use) follows the same shift from singleton to instance.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the reactivity caveat that Vue 3 fixes',
      lang: 'js',
      code: '// Vue 2: adding a property later is NOT reactive\nthis.user.age = 30          // view does NOT update\nthis.$set(this.user, \'age\', 30) // needed in Vue 2\n\n// Vue 3: Proxy makes it reactive automatically\nimport { reactive } from \'vue\'\nconst user = reactive({ name: \'A\' })\nuser.age = 30               // view updates — no $set needed',
      explanation: [
        'Vue 2 could not detect properties added after init, requiring this.$set.',
        'Array index/length assignment had the same limitation.',
        'Vue 3\'s Proxy intercepts these operations, so they are reactive by default.',
        'This is the single most-cited improvement in interviews.',
      ],
    },
    advanced: {
      label: 'Advanced — Composition API reuse vs mixins',
      lang: 'js',
      code: '// Vue 2 mixin (implicit, name-collision prone)\nconst mouseMixin = { data: () => ({ x: 0, y: 0 }), /* ... */ }\n\n// Vue 3 composable (explicit, no collisions)\nimport { ref, onMounted, onUnmounted } from \'vue\'\nexport function useMouse() {\n  const x = ref(0), y = ref(0)\n  const update = (e) => { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', update))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update))\n  return { x, y }\n}',
      explanation: [
        'Vue 2 mixins merged into the component implicitly, risking name collisions and unclear origins.',
        'Composables are plain functions returning refs — explicit imports, no collisions.',
        'Logic and its lifecycle setup/cleanup live together and are easily reused.',
        'This is the headline Composition API advantage over Options-API mixins.',
      ],
    },
    realProject: {
      label: 'Real project — incremental migration with the compat build',
      lang: 'js',
      code: '// vue.config.js / build: alias vue to @vue/compat\nresolve: { alias: { vue: \'@vue/compat\' } }\n\n// @vue/compat runs Vue 2 code on the Vue 3 runtime,\n// emitting warnings for each breaking change so you fix them\n// component-by-component, then drop compat.',
      explanation: [
        'The migration build (@vue/compat) lets a Vue 2 app run on Vue 3 with warnings.',
        'Teams fix breaking changes incrementally rather than in a big bang.',
        'Common fixes: createApp, removed filters, v-model API, global API changes.',
        'Once warnings are gone, you remove compat and run pure Vue 3.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the main differences between Vue 2 and Vue 3?',
      answer: 'Vue 3 uses Proxy-based reactivity (fixing Vue 2 caveats), adds the Composition API and <script setup>, has first-class TypeScript support, allows multiple root nodes, adds Teleport/Suspense, uses createApp instead of new Vue, and ships a smaller, faster, tree-shakable runtime.',
      explanation: 'Lead with reactivity + Composition API; those are the headline changes.',
    },
    {
      level: 'beginner',
      question: 'Does Vue 3 remove the Options API?',
      answer: 'No. Vue 3 fully supports the Options API; the Composition API is an additional option, not a replacement. You can mix them or choose per project.',
      explanation: 'Clearing this misconception shows accurate knowledge of Vue 3.',
    },
    {
      level: 'intermediate',
      question: 'Why did Vue 3 switch from Object.defineProperty to Proxy?',
      answer: 'Object.defineProperty only intercepts pre-declared properties, so Vue 2 could not detect property addition/deletion or array index/length changes (requiring Vue.set/splice). Proxy intercepts all operations on an object, making those reactive automatically, with lazy nested conversion that also improves init performance.',
      explanation: 'Explaining the limitation and the Proxy fix (plus lazy conversion) is the key intermediate answer.',
    },
    {
      level: 'intermediate',
      question: 'What problems does the Composition API solve over the Options API and mixins?',
      answer: 'In large components, Options API scatters one feature\'s logic across data/methods/computed/watch. The Composition API colocates a feature\'s state, computed, and lifecycle in setup, and composables enable explicit, collision-free reuse — unlike mixins, which merge implicitly and obscure where properties come from.',
      explanation: 'Logic colocation + composables-vs-mixins is exactly what interviewers want here.',
    },
    {
      level: 'advanced',
      question: 'What are the key performance improvements in Vue 3?',
      answer: 'A faster, tree-shakable runtime; an optimizing compiler that hoists static VNodes and adds patch flags so the runtime only diffs dynamic bindings; lazy/on-demand Proxy reactivity reducing init cost; and a smaller core bundle. Result: faster mount/update and lower memory in large apps.',
      explanation: 'Naming static hoisting + patch flags + tree-shaking signals real depth.',
    },
    {
      level: 'senior',
      question: 'How would you plan a Vue 2 to Vue 3 migration for a large app?',
      answer: 'Audit dependencies for Vue 3 support, adopt the migration build (@vue/compat) to run on the Vue 3 runtime with warnings, fix breaking changes incrementally (createApp, global API, removed filters, v-model/event APIs, $children removal), migrate to <script setup>/composables where it adds value, update tooling (Vite), then drop compat and verify with tests.',
      explanation: 'A phased, compat-build-driven plan with concrete breaking changes is the senior-level expectation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What were the Vue 2 reactivity caveats and how did you work around them?',
    'What is @vue/compat (the migration build)?',
    'Why were filters removed in Vue 3 and what replaces them?',
    'How did the global API change (Vue.use vs app.use)?',
    'What is a fragment / multiple root nodes?',
    'Can you use the Composition API in Vue 2? (yes, via the plugin)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Claiming Vue 3 replaced/removed the Options API.',
      why: 'The Options API is fully supported; Composition is additive.',
      fix: 'Say the Composition API is an alternative/addition, not a replacement.',
    },
    {
      mistake: 'Forgetting Vue 2-style this.$set when explaining migrated code.',
      why: 'In Vue 3, $set/$delete are removed because Proxy handles dynamic keys automatically.',
      fix: 'In Vue 3, just assign/delete properties directly on reactive objects.',
    },
    {
      mistake: 'Mixing Vue 2 global APIs (Vue.use, Vue.prototype) into Vue 3 code.',
      why: 'Vue 3 moved global config to per-app instances; the old globals do not exist.',
      fix: 'Use createApp + app.use + app.config.globalProperties instead.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'New projects start on Vue 3 with <script setup>; legacy apps run @vue/compat during migration.' },
    { area: 'Pinia', detail: 'Pinia (Vue 3-first) replaces Vuex as the recommended store, leveraging the Composition API.' },
    { area: 'TypeScript', detail: 'Vue 3 + <script setup> gives strong prop/emit inference, a major reason teams upgrade.' },
    { area: 'Build tooling', detail: 'Vite (Vue 3 default) replaces Vue CLI/webpack for faster dev and builds.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Tree-shakable runtime drops unused features from the bundle.',
      'Compiler static hoisting + patch flags make updates faster than Vue 2.',
      'Lazy Proxy reactivity lowers initialization cost for large state.',
    ],
    bad: [
      'Proxy is unsupported in very old browsers (IE11) — Vue 3 dropped IE support.',
      'Naive deep reactivity on huge objects still has tracking overhead.',
    ],
    optimizations: [
      'Use shallowRef/shallowReactive and markRaw for large/immutable data.',
      'Leverage <script setup> compile-time benefits and code-split routes.',
      'Adopt Vite for faster builds and better tree-shaking.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue', 'reactivity-fundamentals'],
    nextConcepts: ['options-vs-composition-api', 'proxy-reactivity', 'reactivity-caveats', 'script-setup', 'composition-vs-mixins'],
    dependencyNote:
      'Comparing Vue 2 and Vue 3 anchors the framework\'s evolution. It builds on what Vue is and reactivity basics, and leads into Options vs Composition API, Proxy reactivity, the old reactivity caveats, and <script setup>.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: "Vue 2" and "Vue 3".',
      'Top row reactivity: defineProperty (per-key, caveats) vs Proxy (whole object, no caveats).',
      'Next row organization: Options API only vs Options + Composition/<script setup>.',
      'Next row: new Vue/global Vue vs createApp/per-instance; plus fragments, Teleport, Suspense, TS.',
      'Conclude: "Vue 3 keeps the model but fixes reactivity, improves reuse, perf, and TypeScript."',
    ],
    diagram: `  VUE 2                  | VUE 3
  defineProperty (caveats)| Proxy (full interception)
  new Vue / global Vue    | createApp / per-instance
  Options API + mixins    | + Composition API / composables
  single root             | fragments, Teleport, Suspense
  partial TS              | first-class TS`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue 3 is a rewrite of Vue 2 with the same model but big upgrades. Reactivity moved from Object.defineProperty (per-key, with caveats — no detecting added properties or array index changes, needing Vue.set) to Proxy, which intercepts the whole object so those are reactive automatically. It adds the Composition API and <script setup> for logic colocation and composable reuse (vs implicit mixins), first-class TypeScript, multiple root nodes, Teleport/Suspense, createApp instead of new Vue, and a smaller, faster, tree-shakable runtime. Options API still works.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue 3 is a ground-up rewrite of Vue 2 that keeps the same declarative, reactive mental model but improves nearly every layer. The headline change is reactivity. Vue 2 used Object.defineProperty, which installs getters and setters on each property it knows about at initialization. That meant it could not detect properties added or deleted after init, nor array index or length assignments — you had to use Vue.set, this.$set, or array methods like splice. Vue 3 wraps objects in a Proxy, which intercepts every operation on the whole object, so adding properties, deleting them, and mutating arrays by index are all reactive automatically, and nested objects are converted lazily on access, which is also cheaper at init. The second big change is the Composition API with <script setup>. In a large component, the Options API scatters one feature\'s logic across data, methods, computed, and watch. The Composition API lets you colocate a feature\'s state, derived values, and lifecycle in setup, and extract reusable logic into composables — plain functions returning refs — which are explicit and collision-free, unlike Vue 2 mixins that merge implicitly. Vue 3 also adds first-class TypeScript inference, multiple root nodes (fragments), new built-ins like Teleport and Suspense, and moves global configuration from the singleton Vue object to per-application instances via createApp, so apps and tests no longer pollute each other. Performance improves through a tree-shakable runtime and a compiler that hoists static nodes and emits patch flags so the runtime only diffs dynamic bindings. Importantly, the Options API is fully supported — Composition is additive. For migration, the @vue/compat build runs Vue 2 code on the Vue 3 runtime with warnings, so teams upgrade incrementally rather than in a big bang.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Proxy reactivity is more capable but unsupported on legacy browsers (IE11), so Vue 3 dropped them.',
      'Composition API improves reuse/scaling but adds a learning curve and lets teams write inconsistent styles without conventions.',
    ],
    edgeCases: [
      'Proxies are not the original object — identity checks and some third-party libs need toRaw/markRaw.',
      'Migrated code relying on removed APIs ($children, filters, event bus via $on) needs rewrites.',
      'Destructuring reactive objects loses reactivity in Vue 3 (needs toRefs) — a new class of bug vs Vue 2 patterns.',
    ],
    runtimeBehavior: [
      'Vue 3 batches updates and flushes asynchronously like Vue 2, but with patch-flag-guided, more granular diffing.',
      'Reactive conversion is lazy: nested proxies are created on first access, not eagerly at init.',
      'Per-instance app context means plugins/provides are scoped, not global.',
    ],
    scalability: [
      'Composables scale logic reuse across large apps far better than mixins.',
      'Tree-shaking and code-splitting keep large Vue 3 bundles lean compared to Vue 2 monolithic builds.',
    ],
    productionConcerns: [
      'Audit and upgrade ecosystem libraries for Vue 3 compatibility before migrating.',
      'Use @vue/compat warnings as a migration checklist and gate removal of compat on a clean run.',
      'Establish team conventions (Composition vs Options, composable naming) to avoid divergence.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Reactivity: Vue 2 defineProperty (caveats) → Vue 3 Proxy (full).',
    'Vue 2 needed Vue.set/$set for new keys & array indexes; Vue 3 does not.',
    'Vue 3 adds Composition API + <script setup> (Options API still supported).',
    'Composables replace mixins for collision-free reuse.',
    'Bootstrapping: new Vue → createApp; global API per-instance.',
    'Vue 3: multiple root nodes (fragments), Teleport, Suspense.',
    'First-class TypeScript inference in Vue 3.',
    'Faster: tree-shakable runtime, static hoisting, patch flags.',
    'Proxy not in IE11 — Vue 3 dropped legacy browsers.',
    'Migration: @vue/compat runs Vue 2 code on Vue 3 with warnings.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite a Vue 2 bootstrap (new Vue) as a Vue 3 bootstrap (createApp).',
      hint: 'createApp(App).mount(\'#app\').',
      solution: {
        lang: 'js',
        code: '// Vue 2\n// new Vue({ render: h => h(App) }).$mount(\'#app\')\n\n// Vue 3\nimport { createApp } from \'vue\'\nimport App from \'./App.vue\'\ncreateApp(App).mount(\'#app\')',
        explanation: ['createApp replaces new Vue and returns an isolated instance.', '.mount replaces $mount.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show the Vue 2 way to add a reactive property to an object vs the Vue 3 way.',
      hint: 'Vue 2 needs $set; Vue 3 just assigns.',
      solution: {
        lang: 'js',
        code: '// Vue 2\n// this.$set(this.user, \'age\', 30)\n\n// Vue 3\nimport { reactive } from \'vue\'\nconst user = reactive({ name: \'A\' })\nuser.age = 30 // reactive automatically via Proxy',
        explanation: ['Vue 2 required $set for late-added properties.', 'Vue 3\'s Proxy makes direct assignment reactive.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Convert a Vue 2 mixin that tracks window width into a Vue 3 composable.',
      hint: 'Return a ref and register/cleanup the resize listener.',
      solution: {
        lang: 'js',
        code: 'import { ref, onMounted, onUnmounted } from \'vue\'\nexport function useWindowWidth() {\n  const width = ref(window.innerWidth)\n  const onResize = () => { width.value = window.innerWidth }\n  onMounted(() => window.addEventListener(\'resize\', onResize))\n  onUnmounted(() => window.removeEventListener(\'resize\', onResize))\n  return { width }\n}',
        explanation: ['A composable is a plain function returning refs.', 'It colocates state, lifecycle, and cleanup — explicit and collision-free vs a mixin.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Outline (comments) a migration plan from Vue 2 to Vue 3 for a large app.',
      hint: 'Audit, compat build, fix breaking changes, modernize, drop compat.',
      solution: {
        lang: 'js',
        code: '// 1. Audit dependencies for Vue 3 support; replace incompatible ones.\n// 2. Switch to @vue/compat to run on the Vue 3 runtime with warnings.\n// 3. Fix breaking changes: new Vue->createApp, global API, removed filters,\n//    v-model/event API, $children removal, event bus -> mitt/store.\n// 4. Migrate Vuex->Pinia and high-value components to <script setup>.\n// 5. Update tooling to Vite; run full test suite.\n// 6. Remove @vue/compat once warnings are clear; ship pure Vue 3.',
        explanation: [
          'Compat build enables incremental, low-risk migration.',
          'Breaking changes are fixed as a warning-driven checklist.',
          'Modernization (Pinia, script setup, Vite) follows, then compat is dropped.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Vue 2 vs Vue 3 is one of the most common Vue interview topics because it tests whether you understand the framework\'s reasoning, not just syntax. It directly maps to real work: maintaining legacy apps and migrating them.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for a list of differences. Product companies (Zoho, Flipkart, Razorpay) probe the reactivity rewrite and Composition API benefits. FAANG-level interviews ask you to design a migration and reason about Proxy internals and performance.',
    whatInterviewersExpect:
      'They expect the Proxy-vs-defineProperty reactivity story (with caveats), Composition API/<script setup> motivations, createApp/global API change, perf improvements, and a sensible migration approach.',
  },
}

export default vue2VsVue3
