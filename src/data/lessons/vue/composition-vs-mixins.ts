import type { ConceptLesson } from '../../../types/lesson'

const compositionVsMixins: ConceptLesson = {
  // 1. Concept Summary
  slug: 'composition-vs-mixins',
  name: 'Composition API vs Mixins',
  category: 'composition-api',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Mixins were Vue 2\'s main code-reuse tool, and the Composition API was created largely to fix their problems — knowing why is core Vue history.',
    'Mixins suffer from implicit sources, naming collisions, and unclear data flow; composables fix all three explicitly.',
    'You will meet mixins in legacy Vue 2 / Options-API codebases and must be able to migrate them to composables.',
    'Interviewers love this comparison because it tests whether you understand reuse trade-offs, not just syntax.',
    'Choosing the right reuse mechanism affects readability, type safety, and how easily teammates can follow your code.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Mixins are like dumping two toy boxes into one bin — you lose track of what came from where. Composables are like labeled drawers.',
    story: [
      'Imagine you pour two boxes of LEGO into one big bin and shake it.',
      'Now you cannot tell which piece came from which box, and if both boxes had the same red brick, you do not know which one you grabbed.',
      'Instead, if you keep each set in its own labeled drawer, you always know exactly where a piece came from.',
      'Mixins pour everything into one bin (the component); composables keep each piece of logic in its own labeled drawer you ask for by name.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Both mixins and the Composition API let you reuse logic across components, but they work very differently.',
    'A mixin is an object of options (data, methods, etc.) that Vue merges into a component — but you cannot easily tell which property came from which mixin, and two mixins can clash.',
    'A composable is a function you call that returns exactly what you asked for, so the source of every value is clear and you choose its name.',
    'The Composition API replaced mixins as the recommended way to share logic in Vue 3 because it is explicit and collision-free.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'This is the comparison between two logic-reuse mechanisms: mixins (Options API objects merged into a component) versus the Composition API (composables — functions called in setup that return reactive state). The Composition API is the recommended modern approach.',
    how: 'A mixin merges its options into the component; on name conflict, the component wins and merge strategies apply, but the origin of each property is hidden. A composable is invoked explicitly; you bind its return to local names, so every value\'s source and type is visible, and multiple composables never clash.',
    why: 'Composables solve the three classic mixin problems — implicit property sources, name collisions, and unclear cross-mixin interactions — while adding better TypeScript inference and tree-shaking.',
    code: {
      label: 'Same logic: mixin vs composable',
      lang: 'ts',
      code: '// MIXIN (Vue 2 style) — where does `count` come from? unclear at use site\nexport const counterMixin = {\n  data: () => ({ count: 0 }),\n  methods: { inc() { (this as any).count++ } },\n}\n// used via: mixins: [counterMixin]  — count just \"appears\" on this\n\n// COMPOSABLE (Vue 3) — explicit source and name\nimport { ref } from \'vue\'\nexport function useCounter() {\n  const count = ref(0)\n  const inc = () => count.value++\n  return { count, inc }\n}\n// used via: const { count, inc } = useCounter()  — origin is obvious',
      explanation: [
        'With the mixin, count silently appears on `this`; the use site gives no hint of its origin.',
        'With the composable, you explicitly call useCounter() and name what you get.',
        'Two composables can coexist by renaming on destructure; two mixins with `count` collide.',
        'The composable is also far easier to type than a merged mixin.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Mixins are Options-API objects whose options (data, computed, methods, lifecycle hooks) are merged into a consuming component via defined merge strategies: data/objects are shallow-merged with the component taking precedence, while lifecycle hooks of the same name are all collected and called in order. Their drawbacks are implicit property sources (a value on `this` could come from any mixin), name collisions across mixins, and opaque interdependencies. The Composition API replaces this with composables — functions invoked in setup() that return explicit reactive bindings. Sources are visible at the call site, names are chosen by the consumer (no collisions), interdependencies are expressed as ordinary function calls/arguments, and TypeScript inference is end-to-end.',

  // 7. Internal Working
  internalWorking: [
    'When a component declares mixins, Vue applies merge strategies: same-name data keys merge with the component winning, methods/computed merge with component precedence, and same-name lifecycle hooks are merged into an array and all invoked (mixin hooks before the component\'s).',
    'All merged properties land on the single component instance (this), so there is exactly one namespace — which is where collisions and ambiguity arise.',
    'A composable, by contrast, is a plain function executed during setup(); it creates its own reactive state and returns references the consumer binds locally — there is no merging into a shared namespace.',
    'Because composables are explicit function calls, ordering, inputs, and outputs are visible; one composable can take another\'s output as an argument, making interdependencies first-class.',
    'Lifecycle hooks inside a composable bind to the calling instance via currentInstance, the same as in setup, so multiple composables can each register hooks without overwriting one another.',
    'TypeScript can infer a composable\'s return type precisely, whereas a merged mixin\'s contribution to `this` is hard to type and often requires augmentation.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   MIXINS                                COMPOSABLES
   mixinA { count }  ─┐                  useA() ─► { count }  (named/renamable)
   mixinB { count }  ─┼─ merged ──► this  useB() ─► { count: countB }
   componentData     ─┘   one shared       const { count } = useA()
                          namespace        const { count: c2 } = useB()
   ❓ which count? collisions, hidden       ✅ explicit source, no clash
   source on \`this\``,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a mixin and its composable equivalent',
      lang: 'ts',
      code: '// mixin\nexport const titleMixin = {\n  created() { document.title = (this as any).title }\n}\n\n// composable equivalent\nimport { onMounted } from \'vue\'\nexport function useTitle(title: string) {\n  onMounted(() => { document.title = title })\n}',
      explanation: [
        'The mixin assumes a `title` exists on `this` — an implicit dependency.',
        'The composable takes title as an explicit argument.',
        'You can see exactly what useTitle needs and returns.',
        'Lifecycle is registered the same way (created → onMounted).',
      ],
    },
    intermediate: {
      label: 'Intermediate — collision: two mixins both define `loading`',
      lang: 'ts',
      code: '// Problem\nconst fetchMixin = { data: () => ({ loading: false }) }\nconst saveMixin  = { data: () => ({ loading: false }) } // collides!\n// mixins: [fetchMixin, saveMixin] → one `loading`, the two intents clash\n\n// Composable fix — independent, renamable state\nimport { useAsync } from \'./useAsync\'\n// const { loading: fetching } = useAsync(fetchData)\n// const { loading: saving }   = useAsync(saveData)',
      explanation: [
        'Both mixins want their own loading flag but share one on the instance.',
        'You cannot have two independent loadings via mixins without renaming options manually.',
        'Composables let each call return its own loading, renamed at the call site.',
        'This is the canonical reason mixins do not scale.',
      ],
    },
    advanced: {
      label: 'Advanced — interdependent logic made explicit',
      lang: 'ts',
      code: '// Mixins: hidden dependency — mixinB silently relies on mixinA\'s `user`\n// const mixinA = { data: () => ({ user: null }) }\n// const mixinB = { computed: { greeting() { return `Hi ${(this as any).user?.name}` } } }\n\n// Composables: dependency is a visible argument\nimport { computed, type Ref } from \'vue\'\nexport function useGreeting(user: Ref<{ name: string } | null>) {\n  return computed(() => `Hi ${user.value?.name ?? \'guest\'}`)\n}\n// const greeting = useGreeting(user)  // dependency explicit',
      explanation: [
        'With mixins, mixinB silently assumes mixinA provided `user` — invisible coupling.',
        'With composables, useGreeting declares it needs a user ref as a parameter.',
        'The dependency graph is readable and type-checked.',
        'Refactoring is safe because contracts are explicit.',
      ],
    },
    realProject: {
      label: 'Real project — migrating a Vue 2 mixin to a composable',
      lang: 'ts',
      code: '// BEFORE (Vue 2 mixin)\n// export const paginationMixin = {\n//   data: () => ({ page: 1, perPage: 10 }),\n//   methods: { next() { this.page++ }, prev() { this.page-- } },\n// }\n\n// AFTER (Vue 3 composable)\nimport { ref } from \'vue\'\nexport function usePagination(perPage = 10) {\n  const page = ref(1)\n  const next = () => page.value++\n  const prev = () => { if (page.value > 1) page.value-- }\n  return { page, perPage, next, prev }\n}\n// component: const { page, next, prev } = usePagination(20)',
      explanation: [
        'Mixin data becomes refs; mixin methods become returned functions.',
        'perPage is now a configurable argument, not a fixed data field.',
        'The component\'s use site clearly shows pagination came from usePagination.',
        'This is the standard mixin→composable migration recipe.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a mixin in Vue, and what is its main downside?',
      answer: 'A mixin is an options object merged into a component to share logic; its main downside is implicit property sources — you cannot tell from the use site which mixin a value came from — plus naming collisions.',
      explanation: 'A good answer pairs the definition with at least one of the classic problems.',
    },
    {
      level: 'beginner',
      question: 'How does a composable make logic reuse clearer than a mixin?',
      answer: 'You explicitly call the composable and bind its return to local names, so every value\'s source is visible and you can rename to avoid clashes.',
      explanation: 'Tests the explicit-source advantage central to the comparison.',
    },
    {
      level: 'intermediate',
      question: 'What happens when two mixins define a property or hook with the same name?',
      answer: 'For data/methods/computed there is a collision resolved by merge strategy (component wins over mixins); for lifecycle hooks of the same name, all are merged into an array and called in order (mixins before the component).',
      explanation: 'Shows precise knowledge of merge strategies, a frequent follow-up.',
    },
    {
      level: 'intermediate',
      question: 'Can you have two independent loading flags with mixins? With composables?',
      answer: 'Not cleanly with mixins — they share one instance namespace. With composables you call the composable twice and rename each returned loading at the call site.',
      explanation: 'Illustrates the scalability difference concretely.',
    },
    {
      level: 'advanced',
      question: 'How do you migrate a mixin to a composable?',
      answer: 'Move data fields to refs/reactive, methods to returned functions, computed to returned computed, and lifecycle hooks to the on* hooks inside the function; turn implicit `this` dependencies into explicit arguments; return what consumers need.',
      explanation: 'Senior-ish: the mechanical recipe plus making dependencies explicit.',
    },
    {
      level: 'senior',
      question: 'Are mixins ever still appropriate, and what are the deeper trade-offs?',
      answer: 'Rarely — only in legacy Options-API code or for truly global, framework-level behaviour. The deeper trade-offs are namespace pollution and collisions, opaque interdependencies, poor TypeScript inference, and harder testing/tree-shaking, all of which composables resolve while composing cleanly.',
      explanation: 'A strong answer is honest about legacy use yet articulates why composables win on every modern axis.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are Vue\'s mixin merge strategies for data, methods, and hooks?',
    'How do composables improve TypeScript inference over mixins?',
    'What about global mixins — why are they discouraged?',
    'How do HOCs and scoped slots compare as older reuse patterns?',
    'How do you share state (not just logic) — composable module scope vs Pinia?',
    'What is the mechanical recipe for converting a mixin to a composable?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Stacking multiple mixins and losing track of where properties come from.',
      why: 'All mixin properties merge onto one `this`, hiding their origin and risking collisions.',
      fix: 'Refactor to composables where each value\'s source is explicit at the call site.',
    },
    {
      mistake: 'Assuming the component always overrides mixin lifecycle hooks.',
      why: 'Same-name hooks are NOT overridden — they all run, mixins before the component.',
      fix: 'Know the merge strategy; if order matters, make it explicit in composables instead.',
    },
    {
      mistake: 'Porting a mixin to a composable but keeping implicit `this` dependencies.',
      why: 'A composable cannot rely on `this`; hidden dependencies become bugs.',
      fix: 'Turn each dependency into an explicit argument (often a ref/getter).',
    },
    {
      mistake: 'Using global mixins for cross-cutting behaviour.',
      why: 'They affect every component invisibly, causing hard-to-trace bugs and overhead.',
      fix: 'Prefer composables, plugins, or provide/inject with explicit opt-in.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'New Vue 3 codebases use composables exclusively for logic reuse; mixins survive mainly in unmigrated Options-API code.' },
    { area: 'Component library', detail: 'Libraries migrated mixin-based behaviour (e.g. form validation, positioning) into composables for typed, collision-free APIs.' },
    { area: 'Nuxt', detail: 'Nuxt 2 plugins/mixins were replaced by auto-imported composables (useState, useFetch) in Nuxt 3.' },
    { area: 'Vue', detail: 'Migration projects systematically convert each mixin to a use* composable, turning `this` dependencies into arguments.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Composables tree-shake when unused; mixins are merged regardless of need.',
      'Explicit composition avoids the merge-strategy overhead and surprises of stacked mixins.',
    ],
    bad: [
      'Global mixins add per-component overhead and run for every instance.',
      'Mixin lifecycle-hook stacking can run more code than intended on each lifecycle event.',
    ],
    optimizations: [
      'Replace mixins with composables so only the logic actually used is included.',
      'Avoid global mixins; opt in per component via explicit composable calls.',
      'Use computed inside composables for cached derivations rather than repeated mixin computed merges.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['options-vs-composition-api', 'composables', 'lifecycle-hooks'],
    nextConcepts: ['composition-reuse-patterns', 'script-setup', 'pinia-basics'],
    dependencyNote:
      'This comparison builds on the Options-vs-Composition split and on composables/lifecycle hooks. It leads into the broader composition reuse patterns, the <script setup> style, and Pinia for shared state — the modern replacements for what mixins once did.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two mixin boxes feeding into one component `this`, both with a `count` — circle the collision.',
      'Write "implicit source / collision / hard to type" under the mixin side.',
      'On the other side, draw useA() and useB() returning named values into local consts.',
      'Show renaming on destructure to avoid clashes.',
      'Say: "Composables make source explicit, names yours, deps arguments, types inferable — that is why they replaced mixins."',
    ],
    diagram: `  MIXINS                       COMPOSABLES
  A{count} B{count}            const { count } = useA()
       \\   /                    const { count: c2 } = useB()
        this  ← collision        explicit, no clash, typed`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Mixins merge options into a component\'s single `this` namespace, causing implicit property sources, name collisions, and opaque interdependencies, with poor TypeScript inference. Composables are functions you call in setup that return named reactive bindings — sources are explicit, names are yours (rename to avoid clashes), dependencies are arguments, and types infer end-to-end. The Composition API replaced mixins for exactly these reasons; migrate mixins by turning data→refs, methods→returned functions, and `this` dependencies→arguments.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Mixins were Vue 2\'s primary way to reuse logic: you write an options object with data, methods, computed, and lifecycle hooks, and Vue merges it into a component. The Composition API was introduced largely to fix three concrete problems with that approach. First, implicit sources: once a mixin is merged, its properties just appear on `this`, and at the use site you have no idea which mixin a given value came from. Second, name collisions: if two mixins both define a `loading` data field, they share one slot on the instance, and you cannot have two independent loadings without manual workarounds. Third, opaque interdependencies: one mixin can silently rely on a property another provides, which is invisible coupling that breaks when you remove or reorder mixins. It is also worth knowing the merge strategies, because they surprise people: same-name data/methods resolve with the component winning, but same-name lifecycle hooks are not overridden — they are all collected and called in order, mixins before the component. Composables solve all of this. A composable is just a function, conventionally use-prefixed, that you call inside setup and whose return you bind to local names. The source of every value is visible at the call site, you choose the names so collisions disappear — you simply rename on destructure — and any dependency becomes an explicit argument, often a ref, so the dependency graph is readable and type-checked. TypeScript inference is end-to-end, and unused composables tree-shake out. Migrating a mixin is mechanical: data fields become refs, methods become returned functions, computed become returned computed, lifecycle hooks become the on* hooks inside the function, and anything the mixin assumed on `this` becomes a parameter. Mixins are essentially only justified in legacy Options-API code today; for everything new, composables are the answer.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Mixins are terse for simple shared options but degrade fast as they stack; composables need explicit wiring but stay clear at scale.',
      'Global mixins offer zero-config cross-cutting behaviour at the cost of invisible, app-wide effects; explicit composables trade convenience for traceability.',
    ],
    edgeCases: [
      'Same-name lifecycle hooks all run (not overridden) — ordering surprises during migration.',
      'data merge favours the component, but deep object shapes can silently shadow mixin fields.',
      'Porting mixins that depend on `this`-provided values requires turning those into arguments.',
      'Global mixins interact with every component including third-party ones.',
    ],
    runtimeBehavior: [
      'Mixin options are resolved at component creation via merge strategies into one instance.',
      'Composable hooks bind to currentInstance per call, so multiple composables coexist without overwriting.',
      'Composable return types are statically inferable; mixin contributions to `this` typically need type augmentation.',
    ],
    scalability: [
      'Composables compose by function calls/arguments, avoiding the combinatorial ambiguity of stacked mixins.',
      'Renaming on destructure removes the collision ceiling that limits mixin reuse.',
    ],
    productionConcerns: [
      'Migrations should convert one mixin at a time, making each implicit dependency explicit and adding tests.',
      'Avoid introducing new global mixins; prefer plugins/provide-inject/composables with explicit opt-in.',
      'Document composable contracts (inputs/outputs) since they are the new reuse boundary.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Mixin = options object merged into a component\'s `this`.',
    'Composable = function called in setup returning named reactive bindings.',
    'Mixin problems: implicit source, name collisions, hidden interdependencies, weak types.',
    'Same-name mixin hooks ALL run (mixins before component), not overridden.',
    'Data/methods collisions: component wins over mixins.',
    'Composables: explicit source, you name them (rename to avoid clashes).',
    'Dependencies become explicit arguments (often refs/getters).',
    'Composables infer types end-to-end and tree-shake.',
    'Migration: data→refs, methods→fns, computed→computed, hooks→on*, this-deps→args.',
    'Mixins only for legacy Options-API code; composables for everything new.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert this mixin to a composable: { data: () => ({ open: false }), methods: { toggle() { this.open = !this.open } } }.',
      hint: 'open becomes a ref; toggle a returned function.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\nexport function useDisclosure() {\n  const open = ref(false)\n  const toggle = () => (open.value = !open.value)\n  return { open, toggle }\n}',
        explanation: ['data field → ref.', 'method → returned function; the source is now explicit.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show how two independent "loading" states are impossible cleanly with mixins but trivial with composables.',
      hint: 'Call the composable twice and rename on destructure.',
      solution: {
        lang: 'ts',
        code: 'import { useAsync } from \'./useAsync\' // returns { loading, run }\n// two independent loadings via composables:\nconst { loading: fetching, run: fetchData } = useAsync(getList)\nconst { loading: saving, run: save } = useAsync(persist)\n// mixins would share ONE `loading` on `this` — collision',
        explanation: [
          'Each call returns its own loading, renamed locally.',
          'Mixins merge into one namespace, so two loadings collide.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A mixin computed depends on a `user` that another mixin provides. Rewrite as composables with an explicit dependency.',
      hint: 'Pass the user ref into the second composable.',
      solution: {
        lang: 'ts',
        code: 'import { ref, computed, type Ref } from \'vue\'\nexport function useUser() {\n  const user = ref<{ name: string } | null>(null)\n  return { user }\n}\nexport function useGreeting(user: Ref<{ name: string } | null>) {\n  return computed(() => `Hi ${user.value?.name ?? \'guest\'}`)\n}\n// const { user } = useUser(); const greeting = useGreeting(user)',
        explanation: [
          'useGreeting declares its dependency as a parameter — no hidden coupling.',
          'The relationship is visible and type-checked at the call site.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain the lifecycle-hook merge behavior that surprises people when migrating mixins.',
      hint: 'Same-name hooks are not overridden.',
      solution: {
        lang: 'ts',
        code: '// Mixin and component BOTH define created():\n// const mixin = { created() { console.log(\'mixin created\') } }\n// component: { mixins:[mixin], created(){ console.log(\'component created\') } }\n// Output (both run): \'mixin created\' then \'component created\'\n\n// Composable equivalent makes order explicit:\nimport { onMounted } from \'vue\'\nonMounted(() => console.log(\'first\'))\nonMounted(() => console.log(\'second\'))  // run in registration order',
        explanation: [
          'Same-name mixin hooks are merged and all run (mixin first), not overridden.',
          'Composables register hooks in explicit order, removing the surprise.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This comparison is the clearest window into why the Composition API exists. Articulating the mixin problems and the composable fixes shows you understand reuse architecture and can confidently lead a Vue 2→3 migration.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what are mixins and why did Vue 3 move away from them". Product companies (Zoho, Flipkart, Razorpay) ask you to migrate a mixin to a composable live. FAANG-level interviews probe merge strategies, hidden interdependencies, TypeScript inference, and when (if ever) mixins are still acceptable.',
    whatInterviewersExpect:
      'Name the three mixin problems (implicit source, collisions, opaque deps), know the merge strategies (especially hook stacking), demonstrate a clean migration, and explain why composables win on clarity, naming, dependencies, and types.',
  },
}

export default compositionVsMixins
