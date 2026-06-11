import type { ConceptLesson } from '../../../types/lesson'

const optionsVsCompositionApi: ConceptLesson = {
  // 1. Concept Summary
  slug: 'options-vs-composition-api',
  name: 'Options API vs Composition API',
  category: 'fundamentals',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'This is one of the most frequently asked Vue interview questions — every Vue 3 role expects a clear, balanced comparison.',
    'It decides how you structure components: by option type (data/methods/computed) or by feature (composables).',
    'The Composition API unlocks composables — the modern, collision-free way to reuse logic, replacing Vue 2 mixins.',
    'Choosing well affects readability and maintainability: large Options components fragment a feature\'s logic; Composition colocates it.',
    'It maps directly to TypeScript: the Composition API and <script setup> give far better type inference.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'It is like organizing a school bag by subject (Composition) versus by item type (Options).',
    story: [
      'Imagine your school bag. One way is to sort by item type: all books in one pocket, all pens in another, all notes in a third.',
      'That works for a small bag. But when you need everything for Math, you have to dig through three different pockets to gather it.',
      'The other way is to sort by subject: one pouch has the Math book, Math pen, and Math notes together. Grab one pouch, you have everything for Math.',
      'The Options API sorts by type; the Composition API sorts by feature, so all the pieces for one job sit together — much easier in a big bag.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue component has state, ways to change it, derived values, and reactions to changes.',
    'The Options API puts these in fixed buckets: data for state, methods for functions, computed for derived values, watch for reactions.',
    'The Composition API instead lets you write all of these together inside one setup area, grouped by the feature they belong to.',
    'Both build the same components; the difference is how the code is organized and reused.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Options API and Composition API are two ways to author Vue components. The Options API organizes a component into typed options (data, methods, computed, watch, lifecycle) and accesses everything via this. The Composition API organizes logic by feature inside setup() (or <script setup>) using functions like ref, reactive, computed, watch, and the on-prefixed lifecycle hooks, returning what the template needs.',
    how: 'Options API: export an object with data()/methods/computed and use this.x. Composition API: in <script setup>, declare const count = ref(0), functions, computed, and lifecycle hooks directly; top-level bindings are auto-exposed to the template. Reusable logic is extracted into composables (useXxx functions).',
    why: 'Options API is approachable and discoverable for small components; the Composition API colocates and reuses feature logic cleanly (composables) and gives better TypeScript inference — preferred for larger or shared logic.',
    code: {
      label: 'Same component, both APIs',
      lang: 'vue',
      code: '<!-- Options API -->\n<script>\nexport default {\n  data() { return { count: 0 } },\n  computed: { double() { return this.count * 2 } },\n  methods: { inc() { this.count++ } },\n}\n</script>\n\n<!-- Composition API (script setup) -->\n<script setup>\nimport { ref, computed } from \'vue\'\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\nfunction inc() { count.value++ }\n</script>',
      explanation: [
        'Options API groups by type: data, computed, methods, accessed via this.',
        'Composition API groups by feature: count, its derived double, and inc sit together.',
        'No this in script setup; you use count.value and call functions directly.',
        'Both render identically; organization and reuse differ.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Options API authors a component as an object of typed options (data, computed, methods, watch, lifecycle), with the framework merging them and exposing them on a component instance accessed via this. The Composition API authors logic inside a setup function (or the <script setup> compiler macro) using standalone reactive primitives (ref, reactive, computed, watch) and function-form lifecycle hooks; the returned/exposed bindings become the render context. The Composition API enables logic colocation by feature and extraction into composables — functions that encapsulate and return reactive state and behavior — providing collision-free reuse and superior TypeScript inference compared to mixins.',

  // 7. Internal Working
  internalWorking: [
    'For the Options API, Vue processes each option: data() runs to produce reactive state, computed creates cached reactive getters, methods are bound to the instance, and watchers are registered — all attached to the component instance (this).',
    'setup() runs once before the component is created, before any Options API resolution, and returns the bindings (or uses <script setup> to auto-expose top-level variables) used by render.',
    'Composition primitives (ref/reactive/computed/watch) create their own reactive effects independent of the instance; they are wired to the component\'s render effect when read in the template.',
    'Lifecycle hooks in Composition (onMounted, etc.) register callbacks on the currently-active component instance captured during setup.',
    '<script setup> is a compile-time transform: top-level declarations are exposed to the template and macros like defineProps/defineEmits compile away — no this, less boilerplate.',
    'Composables are just functions calling these primitives; each call creates fresh reactive state, so two components using the same composable get independent state.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   OPTIONS API (organize by TYPE)      COMPOSITION API (organize by FEATURE)
   ──────────────────────────────      ─────────────────────────────────────
   data:    { search, results, page }  function setup() {
   computed:{ filtered }                  // --- search feature ---
   methods: { fetch, nextPage }           const search = ref('')
   watch:   { search }                    const results = ref([])
   ── one feature spread across ──        watch(search, fetch)
      4 separate buckets                  // --- pagination feature ---
                                          const page = ref(1)
   reuse: mixins (implicit, collide)      function nextPage(){...}
                                        }   // each feature colocated;
                                            // reuse via composables`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — counter both ways',
      lang: 'vue',
      code: '<!-- Options -->\n<script>\nexport default { data: () => ({ n: 0 }), methods: { inc() { this.n++ } } }\n</script>\n\n<!-- Composition -->\n<script setup>\nimport { ref } from \'vue\'\nconst n = ref(0)\nconst inc = () => n.value++\n</script>',
      explanation: [
        'Options uses data() and this.n inside methods.',
        'Composition uses ref(0) and n.value directly.',
        'Both expose n and inc to the template the same way.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a feature with state, derived, watch',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed, watch } from \'vue\'\n\n// search feature, fully colocated\nconst query = ref(\'\')\nconst results = ref([])\nconst hasResults = computed(() => results.value.length > 0)\nwatch(query, async (q) => {\n  results.value = q ? await fetch(\'/s?q=\' + q).then(r => r.json()) : []\n})\n</script>',
      explanation: [
        'All parts of the search feature live together: state, derived, side effect.',
        'In Options API these would split across data/computed/watch.',
        'Colocation makes the feature easy to read, move, or extract.',
        'computed caches hasResults; watch runs the fetch side effect.',
      ],
    },
    advanced: {
      label: 'Advanced — extracting a reusable composable',
      lang: 'js',
      code: 'import { ref, watch } from \'vue\'\n\nexport function useSearch(fetcher) {\n  const query = ref(\'\')\n  const results = ref([])\n  const loading = ref(false)\n  watch(query, async (q) => {\n    if (!q) { results.value = []; return }\n    loading.value = true\n    results.value = await fetcher(q)\n    loading.value = false\n  })\n  return { query, results, loading }\n}\n\n// usage in a component:\n// const { query, results, loading } = useSearch(api.search)',
      explanation: [
        'The feature is now a composable usable in any component.',
        'Each call creates fresh, independent reactive state — no cross-component leakage.',
        'Unlike mixins, the source of query/results/loading is explicit at the call site.',
        'This is the headline reuse advantage of the Composition API.',
      ],
    },
    realProject: {
      label: 'Real project — shared logic across many views',
      lang: 'js',
      code: 'import { ref } from \'vue\'\n\nexport function usePagination(pageSize = 20) {\n  const page = ref(1)\n  const next = () => page.value++\n  const prev = () => { if (page.value > 1) page.value-- }\n  const offset = () => (page.value - 1) * pageSize\n  return { page, next, prev, offset }\n}\n\n// Orders list, Users list, and Logs view all import usePagination\n// and get isolated pagination state with one line.',
      explanation: [
        'A single composable powers pagination across unrelated views.',
        'Each view gets its own page state; nothing is shared accidentally.',
        'Doing this with Options-API mixins risks name collisions and unclear origins.',
        'This pattern is how production Vue 3 apps share cross-cutting logic.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between the Options API and the Composition API?',
      answer: 'The Options API organizes a component into typed options (data, methods, computed, watch) accessed via this. The Composition API organizes logic by feature inside setup/<script setup> using ref/reactive/computed/watch and function lifecycle hooks, enabling colocation and composable reuse.',
      explanation: 'Frame it as "organize by type vs by feature" and mention composables.',
    },
    {
      level: 'beginner',
      question: 'Do you have to choose one API for the whole project?',
      answer: 'No. Both are fully supported in Vue 3 and can coexist — even in the same project, and to a degree within a component. Many teams pick a default for consistency but it is not enforced.',
      explanation: 'Shows you know they are complementary, not mutually exclusive.',
    },
    {
      level: 'intermediate',
      question: 'Why does the Composition API scale better for large components?',
      answer: 'In the Options API a single feature\'s state, computed, watchers, and lifecycle are scattered across separate option buckets, so reading or editing one feature means jumping around. The Composition API colocates all of a feature\'s logic together and lets you extract it into a composable, keeping large components readable and reusable.',
      explanation: 'The "logic colocation + extraction" point is exactly what interviewers reward.',
    },
    {
      level: 'intermediate',
      question: 'How is a composable better than a mixin for reuse?',
      answer: 'Composables are explicit functions that return the state/behavior you destructure, so the origin of each binding is clear and there are no name collisions. Mixins merge implicitly into the component, making it ambiguous where a property came from and risking clashes when combining several.',
      explanation: 'Naming "explicit, collision-free, clear source" vs "implicit merge" is the model answer.',
    },
    {
      level: 'advanced',
      question: 'What are the trade-offs and when would you still use the Options API?',
      answer: 'Options API is more discoverable and beginner-friendly, with a fixed structure good for simple components and teams new to Vue. Composition API needs discipline (where to put logic) and a small learning curve. For tiny components or onboarding-heavy teams, Options can be fine; for large components, shared logic, and strong TypeScript needs, prefer Composition.',
      explanation: 'A balanced answer that does not blindly favor Composition signals maturity.',
    },
    {
      level: 'senior',
      question: 'How do the two APIs differ for TypeScript, and why does Composition infer better?',
      answer: 'The Composition API uses plain typed variables and functions, so TypeScript infers ref<number>, computed return types, and props/emits via defineProps/defineEmits naturally. The Options API relies on this with complex merged types that historically inferred poorly (needing defineComponent and helper types), making Composition the stronger choice for type safety.',
      explanation: 'Connecting the API shape to inference quality is a senior-level differentiator.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is a composable and how is it different from a mixin?',
    'What does <script setup> add over a plain setup() function?',
    'Can you mix Options API and Composition API in one component?',
    'How does each API handle lifecycle hooks?',
    'Why is there no this in <script setup>?',
    'How do you share state between components with composables?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Claiming the Composition API is "always better" with no nuance.',
      why: 'It ignores discoverability and team-onboarding advantages of the Options API for simple components.',
      fix: 'Give a balanced answer: Composition for scale/reuse/TS, Options for simplicity/onboarding.',
    },
    {
      mistake: 'Trying to use this inside <script setup>.',
      why: 'There is no component instance this in script setup; bindings are local variables.',
      fix: 'Use the local refs/functions directly; reach for useXxx/getCurrentInstance only when truly needed.',
    },
    {
      mistake: 'Returning reactive state from a composable in a way that loses reactivity (e.g. destructuring a reactive()).',
      why: 'Destructuring a reactive object breaks the reactive link.',
      fix: 'Return refs (or use toRefs) so destructured values stay reactive.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Most Vue 3 codebases default to <script setup> Composition API; composables (useAuth, usePagination) standardize cross-cutting logic.' },
    { area: 'Component library', detail: 'Libraries author components in Composition API for better TS types and ship composables (e.g. useDialog) as part of their API.' },
    { area: 'Pinia', detail: 'Setup-style Pinia stores are essentially composables, fitting the Composition model.' },
    { area: 'Legacy', detail: 'Older or simpler apps keep Options API; teams migrate incrementally where Composition adds value.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      '<script setup> compiles away boilerplate and enables better tree-shaking of unused features.',
      'Composables reuse logic without per-instance option-merging overhead.',
    ],
    bad: [
      'Poorly factored composables (over-creating refs/watchers) add reactivity overhead.',
      'Neither API is inherently faster at runtime; misuse (deep reactivity, extra watchers) costs more than the API choice.',
    ],
    optimizations: [
      'Prefer <script setup> for compile-time optimizations and smaller output.',
      'Extract shared logic into composables to avoid duplication and redundant watchers.',
      'Use computed for derived values instead of watchers that mutate state.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['vue2-vs-vue3', 'reactivity-fundamentals', 'components-basics'],
    nextConcepts: ['setup-function', 'script-setup', 'composables', 'composition-vs-mixins', 'lifecycle-hooks-composition'],
    dependencyNote:
      'This comparison is the gateway to the Composition API track. It builds on Vue 2 vs 3 and reactivity basics, and leads into setup(), <script setup>, composables, and the composables-vs-mixins comparison.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes: "Options API" and "Composition API".',
      'In Options, list buckets: data / computed / methods / watch, and note one feature spread across all four.',
      'In Composition, draw one feature\'s state+computed+watch grouped together inside setup.',
      'Add "reuse: mixins (implicit)" under Options and "reuse: composables (explicit)" under Composition.',
      'Conclude: "Same components; organize by type vs by feature; Composition wins for scale, reuse, and TS."',
    ],
    diagram: `  OPTIONS                 | COMPOSITION
  data/computed/methods   | setup(): group by feature
   (by type, this)        |   ref/computed/watch together
  reuse: mixins (implicit)| reuse: composables (explicit)
  great for small         | great for large + shared logic + TS`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Both author Vue components. The Options API organizes code by type — data, computed, methods, watch — accessed via this; it is discoverable and great for small components. The Composition API organizes by feature inside setup/<script setup> using ref/reactive/computed/watch and function lifecycle hooks, colocating a feature\'s logic and enabling composables for explicit, collision-free reuse (vs implicit mixins) plus better TypeScript inference. Both are supported in Vue 3 and can coexist; pick Composition for scale and shared logic, Options for simplicity.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Options API and Composition API are two ways to write Vue components, and the key difference is how you organize logic. The Options API organizes by type: you declare state in data, derived values in computed, functions in methods, reactions in watch, and lifecycle in named options, and you access everything through this. It is very discoverable — a newcomer immediately knows where each kind of thing lives — which makes it great for small components and for teams onboarding to Vue. The downside appears in large components: a single feature, say a search box, has its state, its computed flags, its watcher, and its lifecycle hooks scattered across four different option buckets, so understanding or moving that feature means jumping around the file. The Composition API flips this. Inside setup, or more commonly <script setup>, you use standalone reactive primitives — ref, reactive, computed, watch — and function-form lifecycle hooks, and you can place all of one feature\'s logic together. Beyond colocation, the real payoff is composables: you extract a feature into a plain function like useSearch that returns refs, and any component can import it. Each call creates fresh, independent state, and because you destructure exactly what you need, the origin of every value is explicit and there are no name collisions — which is precisely the problem with Vue 2 mixins, which merged in implicitly and clashed. The Composition API also gives much better TypeScript inference because you are working with plain typed variables rather than a complex merged this type. Both APIs are fully supported in Vue 3 and can even coexist, so it is not all-or-nothing. My rule of thumb: Composition for large components, shared logic, and strong typing; Options is perfectly fine for small, simple components or teams new to Vue.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Options API\'s rigid structure aids discoverability but fragments feature logic at scale.',
      'Composition API\'s flexibility enables reuse but, without conventions, lets teams scatter logic inconsistently.',
    ],
    edgeCases: [
      'Mixing both in one component works but the merge order and this-availability can confuse maintainers.',
      'Destructuring reactive() in a composable loses reactivity — return refs or toRefs.',
      'setup() runs before Options resolution, so Options data cannot be read inside setup directly.',
    ],
    runtimeBehavior: [
      'setup runs once at creation; Options data()/computed are resolved by the framework onto the instance.',
      'Composition lifecycle hooks bind to the active instance captured during setup; calling them outside setup fails.',
      '<script setup> is a compile-time transform exposing top-level bindings without a return statement.',
    ],
    scalability: [
      'Composables are the primary mechanism for scaling logic reuse across a large app.',
      'A team convention (default API, composable naming, file structure) is essential to keep Composition codebases coherent.',
    ],
    productionConcerns: [
      'Adopt lint rules/conventions to standardize on one API and consistent composable patterns.',
      'Ensure composables clean up listeners/timers (onUnmounted) to avoid leaks.',
      'Prefer Composition + <script setup> where TypeScript safety matters most.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Options API: organize by type (data/computed/methods/watch), use this.',
    'Composition API: organize by feature in setup/<script setup>.',
    'Composition primitives: ref, reactive, computed, watch, on* hooks.',
    'Composables = reusable functions returning reactive state (replace mixins).',
    'Composables are explicit + collision-free; mixins merge implicitly.',
    '<script setup> = no this, less boilerplate, compile-time optimized.',
    'Both supported in Vue 3; can coexist.',
    'Composition infers TypeScript types far better.',
    'Use Composition for scale/reuse/TS; Options for small/simple.',
    'setup() runs once before Options are resolved.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a counter component in the Options API and again in <script setup>.',
      hint: 'data()+methods vs ref()+function.',
      solution: {
        lang: 'vue',
        code: '<!-- Options -->\n<script>\nexport default { data: () => ({ n: 0 }), methods: { inc() { this.n++ } } }\n</script>\n\n<!-- Composition -->\n<script setup>\nimport { ref } from \'vue\'\nconst n = ref(0)\nfunction inc() { n.value++ }\n</script>',
        explanation: ['Options groups by type with this.', 'Composition declares n and inc as colocated local bindings.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show one feature (state + computed + watch) colocated in Composition that would be split in Options.',
      hint: 'Put query, a computed flag, and a watcher together.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed, watch } from \'vue\'\nconst query = ref(\'\')\nconst isEmpty = computed(() => query.value.trim() === \'\')\nwatch(query, (q) => console.log(\'search\', q))\n</script>',
        explanation: ['All of the query feature is in one place.', 'In Options this would be data.query, computed.isEmpty, watch.query — three buckets.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Extract the search feature into a composable and use it in a component.',
      hint: 'Return refs from useSearch and destructure them.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nexport function useSearch(fetcher) {\n  const query = ref(\'\')\n  const results = ref([])\n  watch(query, async (q) => { results.value = q ? await fetcher(q) : [] })\n  return { query, results }\n}\n// component: const { query, results } = useSearch(api.search)',
        explanation: ['The composable returns refs, so destructuring keeps reactivity.', 'Each component using it gets independent state — collision-free reuse.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Give a balanced recommendation: when would you choose each API? Express it as a decision comment block.',
      hint: 'Weigh size, reuse, team, and TypeScript.',
      solution: {
        lang: 'js',
        code: '// Choose COMPOSITION API when:\n//  - components are large / logic is cross-cutting (reuse via composables)\n//  - you want strong TypeScript inference\n//  - you want feature colocation\n// Choose OPTIONS API when:\n//  - components are small/simple\n//  - team is new to Vue and values discoverability\n//  - maintaining an existing Options-API codebase\n// Both coexist in Vue 3 — pick a team default for consistency.',
        explanation: [
          'Composition wins on scale, reuse, and typing.',
          'Options wins on simplicity and onboarding.',
          'A balanced, criteria-driven answer signals engineering maturity.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is among the most asked Vue 3 questions. A balanced, well-reasoned comparison — especially the composables-vs-mixins reuse story and TypeScript angle — instantly marks you as someone who understands modern Vue.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the basic difference and a code example. Product companies (Zoho, Flipkart, Razorpay) probe composables vs mixins and when to choose each. FAANG-level interviews dig into TypeScript inference, setup timing, and architecting reuse at scale.',
    whatInterviewersExpect:
      'They expect "organize by type vs by feature", composables for reuse (vs implicit mixins), the <script setup>/no-this point, the TypeScript advantage, and a balanced recommendation rather than dogma.',
  },
}

export default optionsVsCompositionApi
