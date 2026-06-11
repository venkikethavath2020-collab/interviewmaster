import type { ConceptLesson } from '../../../types/lesson'

const typescriptWithVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'typescript-with-vue',
  name: 'TypeScript with Vue',
  category: 'ecosystem',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'TypeScript is the default for serious Vue 3 codebases — create-vue offers it, and most product companies expect type-safe components, props, emits, and stores.',
    'Vue 3 was rewritten in TypeScript, so the Composition API and <script setup> have first-class type inference — ref, computed, props, and emits are all strongly typed.',
    'Typed props/emits catch entire classes of bugs at compile time (wrong prop type, missing event payload) before they ever reach the browser.',
    'Interviewers ask it constantly because it separates developers who can build maintainable apps from those who only know JavaScript syntax.',
    'Knowing the Vue-specific TS macros (defineProps, defineEmits, defineModel, withDefaults) and pitfalls (generic components, template refs) is a frequent intermediate-to-senior differentiator.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'TypeScript with Vue is like labels on jars in the kitchen — you can never accidentally put salt where sugar should go.',
    story: [
      'Imagine a kitchen where every jar looks the same and none are labelled. You might grab salt thinking it is sugar and ruin the cake.',
      'Now put a clear label on every jar: "sugar", "salt", "flour". Before you pour, you read the label and know exactly what is inside.',
      'If you reach for the wrong jar for a recipe, a little voice warns you before you pour — so you never make the mistake.',
      'TypeScript labels every piece of data in your Vue app. When you try to use a number where a name should go, it warns you right away, before anything breaks on the screen.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'TypeScript is JavaScript with types — you tell the code what kind of value each thing is (a number, a string, a list of users).',
    'In Vue, you can say exactly what props a component accepts and what events it sends, so the editor warns you if you pass the wrong thing.',
    'Because Vue 3 was built with TypeScript, things like ref and computed automatically figure out their types, so you often get safety for free.',
    'The benefit is catching mistakes while you type, in the editor, instead of discovering them when the app crashes for a user.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Using TypeScript with Vue means writing components, composables, and stores with static types: typed props and emits, typed reactive state (ref<T>, reactive), typed computed values, and typed component APIs — all checked at compile time.',
    how: 'Use <script setup lang="ts"> and the compiler macros: defineProps<Props>() for typed props, defineEmits<Emits>() for typed events, withDefaults for defaults, and defineModel<T>() for v-model. ref/computed infer types automatically or take an explicit generic. vue-tsc type-checks .vue files.',
    why: 'Static types catch wrong prop types, missing event payloads, and typos at build time, give excellent autocomplete, and make refactoring safe across large codebases — dramatically improving maintainability.',
    code: {
      label: 'Typed props, emits, and state in <script setup>',
      lang: 'ts',
      code: '// <script setup lang="ts">\nimport { ref, computed } from \'vue\'\n\ninterface Props { id: number; name?: string }\nconst props = withDefaults(defineProps<Props>(), { name: \'Guest\' })\n\nconst emit = defineEmits<{ (e: \'save\', id: number): void }>()\n\nconst count = ref(0)                 // inferred Ref<number>\nconst label = computed(() => props.name + \': \' + count.value)\n\nfunction save() { emit(\'save\', props.id) }\n// </script>',
      explanation: [
        'defineProps<Props>() gives fully typed props with no runtime declaration needed.',
        'withDefaults supplies defaults for optional props while preserving types.',
        'defineEmits with a type literal enforces the event name and payload type.',
        'ref(0) infers Ref<number>; computed infers its return type from the function.',
        'emit(\'save\', props.id) is checked: a wrong payload type fails compilation.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Using TypeScript with Vue leverages Vue 3\'s native TypeScript design to statically type components and logic. In <script setup lang="ts">, compiler macros provide type-only APIs: defineProps and defineEmits accept type arguments that the SFC compiler turns into runtime declarations and type checks; withDefaults attaches defaults; defineModel types v-model. Reactivity APIs are generic (Ref<T>, ComputedRef<T>, reactive<T>) and infer or accept explicit types. Template expressions are type-checked by vue-tsc / Volar, which understands the SFC template and binds component instance types, enabling end-to-end type safety from props through template to emitted events.',

  // 7. Internal Working
  internalWorking: [
    'The Vue SFC compiler parses <script setup lang="ts"> and compiles the type-only macros (defineProps/defineEmits/defineModel/withDefaults) into runtime props/emits declarations plus type metadata — the macros do not exist at runtime.',
    'defineProps<T>() is erased to a runtime props object; in dev/build the type T also drives type-checking, so passing a wrong prop type is a compile error even though the runtime declaration is generated.',
    'Reactivity APIs are declared with generics: ref<T>(v) returns Ref<T>, computed(fn) infers ComputedRef from fn\'s return type, and reactive<T> deep-unwraps refs in its type.',
    'Volar (the language service) and vue-tsc parse the SFC, type the template against the component\'s inferred props/slots/emits, and surface errors in the editor and CLI — this is separate from tsc which alone cannot check .vue templates.',
    'Generic components use <script setup lang="ts" generic="T">, compiled so the component is parameterised and call sites infer T from props.',
    'Type-checking runs as a build/CI step (vue-tsc --noEmit) decoupled from Vite\'s transpile-only dev pipeline (esbuild strips types without checking), so a build can be type-clean while dev stays fast.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  <script setup lang="ts">\n   defineProps<Props>()  ──compiler──► runtime props + TYPE check\n   defineEmits<Emits>()  ──compiler──► runtime emits + TYPE check\n   ref<T>(v) ─► Ref<T>     computed(fn) ─► ComputedRef<infer>\n        │                         │\n        ▼                         ▼\n  ┌──────────── template (checked by Volar/vue-tsc) ────────┐\n  │  {{ props.name }}   @click="emit(\'save\', props.id)"      │\n  └──────────────────────────────────────────────────────────┘\n  parent <Child :id="7" @save="..."/>  ◄─ id:number enforced\n\n  vite dev = strip types (fast)   |   vue-tsc = real type check (CI)',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — typed ref and computed',
      lang: 'ts',
      code: '// <script setup lang="ts">\nimport { ref, computed } from \'vue\'\n\nconst count = ref(0)                  // Ref<number> inferred\nconst name = ref<string | null>(null) // explicit generic\nconst doubled = computed(() => count.value * 2) // ComputedRef<number>\n\ncount.value = 5\n// name.value = 42  // ❌ type error: number not assignable to string|null\n// </script>',
      explanation: [
        'ref(0) infers Ref<number>; you rarely annotate primitive refs.',
        'Use an explicit generic when the initial value does not capture the full type (e.g. null first).',
        'computed infers its type from the function\'s return value.',
        'Assigning the wrong type to .value is a compile error.',
      ],
    },
    intermediate: {
      label: 'Intermediate — typed emits and defineModel',
      lang: 'ts',
      code: '// Child.vue\n// <script setup lang="ts">\nconst emit = defineEmits<{\n  (e: \'update\', value: number): void\n  (e: \'close\'): void\n}>()\n\n// two-way binding, typed:\nconst model = defineModel<string>({ required: true })\n\nfunction bump() { emit(\'update\', 1) }\n// </script>\n// <template>\n//   <input v-model="model" />\n// </template>',
      explanation: [
        'The defineEmits type literal lists each event with its payload signature.',
        'emit(\'update\', 1) is checked; emit(\'update\', \'x\') would fail to compile.',
        'defineModel<string>() types the v-model value and generates modelValue/update:modelValue.',
        'required: true makes the binding mandatory at the type level.',
        'This is the idiomatic Vue 3.4+ way to type events and v-model.',
      ],
    },
    advanced: {
      label: 'Advanced — typed composable and generic component',
      lang: 'ts',
      code: '// useFetch.ts — a generic composable\nimport { ref, type Ref } from \'vue\'\nexport function useFetch<T>(url: string): { data: Ref<T | null>; load: () => Promise<void> } {\n  const data = ref<T | null>(null) as Ref<T | null>\n  const load = async () => { data.value = await (await fetch(url)).json() }\n  return { data, load }\n}\n\n// Generic component: <script setup lang="ts" generic="T">\n// const props = defineProps<{ items: T[]; selected: T }>()\n// defineEmits<{ (e: \'pick\', item: T): void }>()',
      explanation: [
        'useFetch<T> returns typed data so callers get full inference: useFetch<User>(url).',
        'The Ref<T | null> annotation preserves the generic through reactivity.',
        'generic="T" on script setup makes the component itself generic.',
        'Call sites infer T from the items prop, so selected and the pick event are type-safe.',
        'Generic components are the advanced edge of Vue + TS and a common senior question.',
      ],
    },
    realProject: {
      label: 'Real project — typed Pinia store',
      lang: 'ts',
      code: '// stores/user.ts\nimport { defineStore } from \'pinia\'\nimport { ref, computed } from \'vue\'\n\nexport interface User { id: number; name: string }\n\nexport const useUserStore = defineStore(\'user\', () => {\n  const current = ref<User | null>(null)\n  const isLoggedIn = computed(() => current.value !== null)\n  function setUser(u: User) { current.value = u }\n  return { current, isLoggedIn, setUser }\n})\n// Usage: const store = useUserStore(); store.setUser({ id: 1, name: \'A\' })',
      explanation: [
        'A setup-style Pinia store is fully typed with no extra annotations.',
        'current is Ref<User | null>; isLoggedIn is inferred boolean.',
        'setUser enforces the User shape at every call site.',
        'Consuming components get autocomplete for state, getters, and actions.',
        'This is the standard, type-safe way teams structure Pinia state in production.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you type props in Vue 3 with <script setup>?',
      answer: 'Use the type-based form: defineProps<{ id: number; name?: string }>(). For defaults, wrap it: withDefaults(defineProps<Props>(), { name: \'Guest\' }).',
      explanation: 'A good answer prefers the type-based defineProps over the runtime object form and knows withDefaults for defaults.',
    },
    {
      level: 'beginner',
      question: 'How are ref and computed typed?',
      answer: 'ref infers Ref<T> from its initial value, or you pass an explicit generic like ref<string | null>(null). computed infers ComputedRef<T> from its getter\'s return type.',
      explanation: 'Tests understanding that reactivity APIs are generic and usually infer correctly.',
    },
    {
      level: 'intermediate',
      question: 'Why can\'t plain tsc type-check your .vue files, and what do you use instead?',
      answer: 'tsc does not understand SFC templates or the <template> bindings. You use vue-tsc (powered by Volar) which parses SFCs and type-checks templates against the component\'s props/emits/slots, typically run as vue-tsc --noEmit in CI.',
      explanation: 'A senior signal is knowing vue-tsc/Volar handle template type-checking that tsc alone cannot.',
    },
    {
      level: 'intermediate',
      question: 'How do you type emitted events, and why is it better than the old array form?',
      answer: 'Use defineEmits<{ (e: \'save\', id: number): void }>(). It enforces both the event name and payload type, so emitting the wrong payload is a compile error — unlike the runtime array form which only lists names.',
      explanation: 'Shows knowledge of typed emits and the safety they add over the string-array declaration.',
    },
    {
      level: 'advanced',
      question: 'How do you write a generic Vue component, and when is it useful?',
      answer: 'Use <script setup lang="ts" generic="T"> and reference T in defineProps/defineEmits. It is useful for reusable components like a typed Table or Select where the item type should flow from props to events, giving call-site inference.',
      explanation: 'Demonstrates the advanced generic="T" feature and a realistic use case.',
    },
    {
      level: 'senior',
      question: 'Why is dev fast but type errors only appear at build/CI in a Vite + Vue + TS setup?',
      answer: 'Vite transpiles with esbuild, which strips types without checking them, so dev stays fast. Real type-checking is a separate step (vue-tsc --noEmit) run in build/CI or by the editor language service. So a dev server can run code that has type errors.',
      explanation: 'Senior answers understand the decoupling of transpilation (esbuild) from type-checking (vue-tsc) and the implications for CI.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you type a template ref to a component instance?',
    'What is the difference between the type-based and runtime forms of defineProps?',
    'How do you type provide/inject safely (InjectionKey<T>)?',
    'How does defineModel<T>() type two-way binding?',
    'How do you type slots and scoped slot props?',
    'Why might reactive() lose some type precision compared to ref()?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying on the dev server to catch type errors.',
      why: 'Vite/esbuild strips types without checking, so type errors silently pass in dev.',
      fix: 'Run vue-tsc --noEmit in CI (and trust the editor language service) as the real type gate.',
    },
    {
      mistake: 'Mixing runtime and type-based defineProps incorrectly.',
      why: 'You can use either a runtime object or a type argument, not both; conflating them causes errors or lost inference.',
      fix: 'Prefer the type-based form defineProps<Props>() and use withDefaults for defaults.',
    },
    {
      mistake: 'Using a plain string key for provide/inject.',
      why: 'inject loses its type and can collide, so the injected value is typed as unknown/any.',
      fix: 'Use an InjectionKey<T> symbol so inject is fully typed.',
    },
    {
      mistake: 'Forgetting that template refs to components are typed via InstanceType.',
      why: 'A ref to a child component is not just the element; accessing methods needs the right type.',
      fix: 'Type it as ref<InstanceType<typeof Child> | null>(null) (or use useTemplateRef in 3.5+).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'create-vue scaffolds a TS option with <script setup lang="ts">, defineProps/defineEmits macros, and vue-tsc for build-time checking.' },
    { area: 'Pinia', detail: 'Setup-style stores are fully type-inferred, giving typed state, getters, and actions across the app with zero extra annotation.' },
    { area: 'Component library', detail: 'Libraries ship .d.ts types and use generic components so consumers get full inference for typed tables, selects, and forms.' },
    { area: 'Nuxt', detail: 'Nuxt auto-generates types for routes, composables, and runtime config, and runs vue-tsc-based checking for end-to-end type safety.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Types are erased at build, so there is zero runtime cost in the shipped bundle.',
      'Type-safety prevents bugs and enables confident refactors that keep code lean.',
    ],
    bad: [
      'vue-tsc type-checking can be slow on very large codebases, lengthening CI.',
      'Overly complex generic types can balloon editor/compiler performance.',
    ],
    optimizations: [
      'Run type-checking in parallel/CI separately from the fast esbuild dev transpile.',
      'Use project references / incremental builds to speed up vue-tsc on large repos.',
      'Prefer simple, explicit types over deeply nested conditional generics in hot paths.',
      'Lean on inference (ref/computed) rather than over-annotating, reducing maintenance and check time.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['script-setup', 'props', 'component-events', 'ref'],
    nextConcepts: ['prop-validation', 'composables', 'pinia-basics', 'vite-vue'],
    dependencyNote:
      'TypeScript with Vue builds on <script setup>, props, emits, and refs. It strengthens prop validation, composables, and Pinia stores with static types. Learn the Composition API basics first, then layer types onto them.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write <script setup lang="ts"> and the four macros: defineProps, defineEmits, defineModel, withDefaults.',
      'Show defineProps<Props>() compiling to runtime props PLUS a type check.',
      'Show ref<T> and computed inferring Ref<T>/ComputedRef<T>.',
      'Draw vue-tsc/Volar checking the template against props/emits — note tsc alone cannot.',
      'Conclude: "Vite strips types for fast dev; vue-tsc --noEmit in CI is the real type gate. Use InjectionKey<T> and InstanceType for the tricky cases."',
    ],
    diagram: '  defineProps<Props>()  → runtime props + type check\n  defineEmits<Emits>()  → runtime emits + type check\n  ref<T>(v): Ref<T>     computed(fn): ComputedRef<infer>\n             │\n             ▼\n   template ── checked by Volar / vue-tsc ──► errors\n   parent <Child :id="7"/> ← id:number enforced\n\n   dev (esbuild) strips types | CI runs vue-tsc --noEmit',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue 3 is built in TypeScript, so <script setup lang="ts"> gives first-class typing. Use defineProps<Props>() and withDefaults for typed props, defineEmits<{...}>() for typed events, defineModel<T>() for v-model, and rely on ref<T>/computed inference. Templates are type-checked by vue-tsc/Volar, not plain tsc, so run vue-tsc --noEmit in CI — Vite\'s esbuild strips types without checking. Tricky cases: InjectionKey<T> for provide/inject, InstanceType<typeof Child> for component refs, and generic="T" for generic components.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue 3 was rewritten in TypeScript, which is why TS support is first-class rather than bolted on. In a single-file component you opt in with <script setup lang="ts">, and then a set of compiler macros give you type safety. defineProps takes a type argument — defineProps<{ id: number; name?: string }>() — and the compiler turns that into both the runtime props declaration and a compile-time type check, so passing the wrong prop type from a parent is an error. withDefaults adds defaults to optional props while keeping the types. defineEmits with a type literal enforces each event\'s name and payload, so emitting the wrong payload fails to compile, which is much safer than the old string-array form. defineModel<T>() types two-way binding for v-model. The reactivity APIs are generic too: ref infers Ref<T> from its initial value or takes an explicit generic when the initial value does not capture the full type, like ref<string | null>(null), and computed infers its type from the getter. A key thing many people miss is that plain tsc cannot type-check the template inside an SFC — you need vue-tsc, which is powered by Volar, the language service. And because Vite transpiles with esbuild, which strips types without checking them, your dev server runs fast but does not catch type errors; the real type gate is running vue-tsc --noEmit in CI, plus the editor surfacing errors as you type. For the trickier cases: provide/inject should use an InjectionKey<T> symbol to stay typed, a template ref to a child component is typed with InstanceType<typeof Child>, and you can write a generic component with generic="T" on the script tag so types flow from props to events. The payoff is catching whole classes of bugs at compile time, great autocomplete, and safe refactoring across large codebases.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Type-based vs runtime defineProps: type-based is cleaner and inferable but cannot express some runtime-only validators; runtime form allows custom validation.',
      'ref vs reactive for typing: ref preserves precise types through .value; reactive can lose some precision and unwraps nested refs, complicating types.',
      'Inference vs explicit annotation: inference is less code but explicit types document intent and stabilise public APIs.',
    ],
    edgeCases: [
      'Generic components (generic="T") need correct call-site inference and can confuse older tooling.',
      'Template refs to components require InstanceType<typeof Child> to access methods.',
      'provide/inject is untyped without InjectionKey<T>; inject returns T | undefined which must be narrowed.',
      'reactive() deep-unwraps refs, so the type differs from the runtime ergonomics in subtle ways.',
    ],
    runtimeBehavior: [
      'Macros are compiled away; defineProps/defineEmits produce runtime declarations plus erased types.',
      'esbuild (dev) strips types without checking; vue-tsc performs the actual check separately.',
      'Generated runtime props from type-only declarations still drive dev-time prop validation.',
    ],
    scalability: [
      'Large repos benefit from project references and incremental vue-tsc to keep check times manageable.',
      'Stable, well-documented public types on shared components/composables keep big teams in sync.',
    ],
    productionConcerns: [
      'CI must run vue-tsc --noEmit, since a passing Vite build does not imply type correctness.',
      'Overly clever conditional/recursive types hurt editor and compiler performance — keep them readable.',
      'Ship accurate .d.ts for published libraries; broken types silently degrade consumer DX.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Opt in with <script setup lang="ts">.',
    'Typed props: defineProps<Props>(); defaults: withDefaults(...).',
    'Typed events: defineEmits<{ (e: \'x\', p: T): void }>().',
    'Two-way binding: defineModel<T>().',
    'ref<T> infers Ref<T>; computed infers ComputedRef<T>.',
    'Templates checked by vue-tsc/Volar, NOT plain tsc.',
    'CI gate: vue-tsc --noEmit (Vite/esbuild does not type-check).',
    'provide/inject: use InjectionKey<T> for typing.',
    'Component template ref: InstanceType<typeof Child>.',
    'Generic component: <script setup lang="ts" generic="T">.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Type a component\'s props with an optional name defaulting to "Guest".',
      hint: 'Combine defineProps<T> with withDefaults.',
      solution: {
        lang: 'ts',
        code: '// <script setup lang="ts">\ninterface Props { id: number; name?: string }\nconst props = withDefaults(defineProps<Props>(), { name: \'Guest\' })\n// </script>',
        explanation: [
          'defineProps<Props>() gives typed props with no runtime object needed.',
          'withDefaults supplies the default while keeping the type information.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Declare typed emits for an update event carrying a number and a close event with no payload.',
      hint: 'Use a defineEmits type literal with call signatures.',
      solution: {
        lang: 'ts',
        code: '// <script setup lang="ts">\nconst emit = defineEmits<{\n  (e: \'update\', value: number): void\n  (e: \'close\'): void\n}>()\nemit(\'update\', 5)\n// </script>',
        explanation: [
          'Each call signature pins the event name to its payload type.',
          'emit(\'update\', \'x\') would be a compile error, catching the bug early.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Type provide/inject for a theme value so inject() is fully typed and guarded.',
      hint: 'Use InjectionKey<T> and narrow the inject result.',
      solution: {
        lang: 'ts',
        code: 'import type { InjectionKey } from \'vue\'\nimport { provide, inject } from \'vue\'\n\nexport const ThemeKey: InjectionKey<{ dark: boolean }> = Symbol(\'theme\')\n// provider: provide(ThemeKey, { dark: true })\nexport function useTheme() {\n  const t = inject(ThemeKey)\n  if (!t) throw new Error(\'useTheme must be used under a theme provider\')\n  return t\n}',
        explanation: [
          'InjectionKey<T> makes inject(ThemeKey) typed as { dark: boolean } | undefined.',
          'The guard narrows it and gives a clear error when the provider is missing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a generic <SelectList> setup that infers the item type from props and types the pick event.',
      hint: 'Use generic="T" on the script tag.',
      solution: {
        lang: 'ts',
        code: '// SelectList.vue\n// <script setup lang="ts" generic="T">\nconst props = defineProps<{ items: T[]; selected: T }>()\nconst emit = defineEmits<{ (e: \'pick\', item: T): void }>()\nfunction choose(item: T) { emit(\'pick\', item) }\n// </script>\n// Usage: <SelectList :items="users" :selected="users[0]" @pick="..." />\n// T is inferred as User → selected and @pick payload are type-safe',
        explanation: [
          'generic="T" makes the component parameterised by its item type.',
          'Call sites infer T from items, so selected and the pick payload are checked against the same type.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'TypeScript is effectively required for serious Vue roles, so fluency signals you can build maintainable, type-safe apps. Knowing the Vue-specific macros and the vue-tsc-vs-tsc distinction shows depth that pure-JavaScript candidates lack.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask how to type props and refs. Product companies (Zoho, Flipkart, Razorpay) ask about typed emits, defineModel, typed Pinia stores, and the vue-tsc CI gate. FAANG-level rounds probe generic components, provide/inject typing, InstanceType refs, and the esbuild-vs-vue-tsc decoupling.',
    whatInterviewersExpect:
      'They expect type-based defineProps/withDefaults, typed defineEmits, ref/computed inference, awareness that vue-tsc (not tsc) checks templates and must run in CI, and handling of the tricky cases: InjectionKey, InstanceType refs, and generic components.',
  },
}

export default typescriptWithVue
