import type { ConceptLesson } from '../../../types/lesson'

const compoundComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'compound-components',
  name: 'Compound Components',
  category: 'patterns',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Compound components let you build flexible, expressive APIs like <Tabs><Tab/><TabPanel/></Tabs> where related pieces share state implicitly instead of through prop drilling.',
    'They power almost every serious component library — Tabs, Accordion, Select, Menu, Dialog — so understanding the pattern lets you read and extend libraries like Headless UI, Element Plus, or Naive UI.',
    'They teach the right use of provide/inject: a parent shares context with descendants without passing props through every level.',
    'Interviewers use them to test API design judgement — can you design a component that is both powerful and pleasant to use?',
    'Done wrong they leak state, break when children are conditionally rendered, or force users into rigid markup; done right they feel effortless.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Compound components are like a board game box: the board and the pieces are sold together and only make sense as a set.',
    story: [
      'Think of a board game like Snakes and Ladders. The box has a board, the dice, and the little player pieces.',
      'On their own a single piece does nothing — it only matters when it is on the board, following the board\'s rules.',
      'The board quietly keeps track of whose turn it is and where everyone is. Each piece just asks the board "where am I?" instead of carrying all the rules itself.',
      'Compound components work the same way: a parent component is the board, and the smaller components inside it are the pieces. The parent secretly shares the rules and state, so the little pieces stay simple and just play along.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A compound component is really a group of components designed to work together as one feature — like a parent and several children that only make sense inside that parent.',
    'The parent holds the shared state (for tabs, which tab is active) and quietly passes it down to the children using provide/inject, not by writing props on every child.',
    'Each child reads what it needs from that shared context and reports back when the user interacts (clicks a tab).',
    'The result is markup that reads like plain English — you compose the pieces in the template — while all the coordination happens behind the scenes.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A compound component is a set of components that cooperate to deliver one feature. A parent owns the shared state and provides it via provide(); the children inject() that context to read state and trigger updates, so the public API is just nested tags.',
    how: 'The parent creates reactive state and calls provide(key, api). Children call inject(key) to access the same state and methods. Users compose the pieces in the template, e.g. <Tabs><Tab name="a"/><Tab name="b"/></Tabs>, and the parent coordinates them.',
    why: 'It removes prop drilling and rigid prop-based configuration, giving a flexible, declarative API where users arrange children freely while the parent keeps everything in sync.',
    code: {
      label: 'A minimal Tabs compound component',
      lang: 'js',
      code: '// Tabs.vue (parent)\n// <script setup>\nimport { ref, provide } from \'vue\'\nconst active = ref(0)\nprovide(\'tabs\', { active, select: (i) => (active.value = i) })\n// </script>\n// <template><slot /></template>\n\n// Tab.vue (child)\n// <script setup>\nimport { inject } from \'vue\'\nconst props = defineProps({ index: Number })\nconst tabs = inject(\'tabs\')\n// </script>\n// <template>\n//   <button :class="{ active: tabs.active.value === index }"\n//           @click="tabs.select(index)"><slot /></button>\n// </template>',
      explanation: [
        'The parent owns active state and provides an api object with the state and a select method.',
        'Each Tab injects that api, reads which tab is active, and calls select on click.',
        'No props are passed from Tabs to Tab — the link is the injected context.',
        'Users compose <Tabs><Tab/>...</Tabs> freely; the parent coordinates selection.',
        'The same provide/inject channel can feed TabPanel children to show/hide content.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Compound components are a composition pattern where a parent component manages shared state and exposes it to a set of cooperating child components through provide/inject, rather than explicit props. The parent defines a context (reactive state plus methods) keyed by a Symbol or string and provides it; descendants at any depth inject it to read state and dispatch interactions. This yields a declarative, prop-light API where consumers arrange children in the template and the parent transparently orchestrates behaviour such as selection, expansion, or focus management.',

  // 7. Internal Working
  internalWorking: [
    'The parent\'s setup() creates reactive state (refs/reactive) and an API object of state plus mutation methods, then calls provide(KEY, api) — registering it on the current component instance\'s provides chain.',
    'Vue links each component instance\'s provides object to its parent\'s via prototype, so a provided value is visible to ALL descendants, however deeply nested, not just direct children.',
    'Each child\'s setup() calls inject(KEY); Vue walks up the instance tree resolving the nearest provided value, returning the same reactive API object (by reference).',
    'Because the injected state is reactive, when a child mutates it (e.g. select(index)), the parent\'s state changes and every dependent child re-renders via the normal reactivity effect/trigger mechanism.',
    'Children often register themselves with the parent on mount (pushing into a provided array) so the parent can know order/count — and must unregister on unmount to avoid stale entries.',
    'Using a Symbol key prevents collisions and keeps the context private; an InjectionKey<T> typed symbol gives full TypeScript inference for the injected shape.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '          <Tabs>  (parent owns: active = ref(0))\n            │  provide(\'tabs\', { active, select })\n            │\n   ┌────────┼─────────────────────────┐\n   │        │                          │\n   ▼        ▼                          ▼\n <Tab 0> <Tab 1> ...             <TabPanel n>\n   │        │                          │\n   └── inject(\'tabs\') ◄────────────────┘\n        reads active, calls select(i)\n\n  click Tab 1 → select(1) → active = 1 → reactivity re-renders\n  all tabs (highlight) + panels (show/hide). No props drilled.',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — Accordion with provide/inject',
      lang: 'js',
      code: '// Accordion.vue\n// <script setup>\nimport { ref, provide } from \'vue\'\nconst openId = ref(null)\nprovide(\'accordion\', {\n  openId,\n  toggle: (id) => (openId.value = openId.value === id ? null : id),\n})\n// </script>\n// <template><div class="accordion"><slot /></div></template>',
      explanation: [
        'The Accordion parent tracks which single item is open via openId.',
        'It provides toggle so any item can open itself and close the rest.',
        'A null openId means all items are collapsed.',
        'Items are passed as slot content and inject this context.',
      ],
    },
    intermediate: {
      label: 'Intermediate — children self-registering for order',
      lang: 'js',
      code: '// Tabs.vue\n// <script setup>\nimport { ref, provide, reactive } from \'vue\'\nconst active = ref(0)\nconst tabs = reactive([])\nprovide(\'tabs\', {\n  active,\n  register: (label) => tabs.push(label) - 1, // returns index\n  select: (i) => (active.value = i),\n  tabs,\n})\n// </script>\n\n// Tab.vue\n// <script setup>\nimport { inject, onMounted, ref } from \'vue\'\nconst props = defineProps({ label: String })\nconst ctx = inject(\'tabs\')\nconst index = ref(-1)\nonMounted(() => { index.value = ctx.register(props.label) })\n// </script>',
      explanation: [
        'Children register themselves on mount so the parent learns their order automatically.',
        'register returns the assigned index, which the child stores to know its position.',
        'This means users never hand-number tabs — the DOM order is the source of truth.',
        'The parent can now render a navigation bar from the registered labels if desired.',
        'Remember to also unregister on unmount in production to avoid stale entries.',
      ],
    },
    advanced: {
      label: 'Advanced — typed context with InjectionKey',
      lang: 'ts',
      code: 'import type { InjectionKey, Ref } from \'vue\'\nimport { inject, provide, ref } from \'vue\'\n\ninterface TabsContext {\n  active: Ref<number>\n  select: (i: number) => void\n}\nexport const TabsKey: InjectionKey<TabsContext> = Symbol(\'tabs\')\n\nexport function provideTabs() {\n  const active = ref(0)\n  const ctx: TabsContext = { active, select: (i) => (active.value = i) }\n  provide(TabsKey, ctx)\n  return ctx\n}\n\nexport function useTabs() {\n  const ctx = inject(TabsKey)\n  if (!ctx) throw new Error(\'Tab must be used inside <Tabs>\')\n  return ctx\n}',
      explanation: [
        'An InjectionKey<TabsContext> gives full type inference: inject(TabsKey) is typed as TabsContext | undefined.',
        'A Symbol key avoids name collisions with other providers.',
        'useTabs() throws a clear error if a Tab is used outside <Tabs> — guarding misuse.',
        'Wrapping provide/inject in composables keeps the parent/child files clean and reusable.',
        'This is exactly how typed component libraries expose their internal context safely.',
      ],
    },
    realProject: {
      label: 'Real project — a Select/Listbox in a design system',
      lang: 'js',
      code: '// Select.vue\n// <script setup>\nimport { ref, provide } from \'vue\'\nconst modelValue = defineModel()\nconst open = ref(false)\nprovide(\'select\', {\n  modelValue,\n  isSelected: (v) => modelValue.value === v,\n  choose: (v) => { modelValue.value = v; open.value = false },\n})\n// </script>\n\n// Option.vue\n// <script setup>\nimport { inject } from \'vue\'\nconst props = defineProps({ value: null })\nconst sel = inject(\'select\')\n// </script>\n// <template>\n//   <li role="option" :aria-selected="sel.isSelected(value)"\n//       @click="sel.choose(value)"><slot /></li>\n// </template>',
      explanation: [
        'A design-system Select exposes <Select v-model><Option value="x"/></Select>.',
        'The parent owns v-model via defineModel and provides isSelected/choose to options.',
        'Each Option marks itself selected and reports a choice — no prop drilling.',
        'aria-selected is driven by shared state, keeping accessibility consistent.',
        'This is the real-world shape of accessible compound components in production UI kits.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a compound component?',
      answer: 'A set of components designed to work together as one feature, where a parent owns shared state and provides it to children so they coordinate without explicit props — e.g. Tabs/Tab/TabPanel.',
      explanation: 'A good answer names the parent-owns-state idea and gives a Tabs/Accordion/Select example.',
    },
    {
      level: 'beginner',
      question: 'How do compound components share state without prop drilling?',
      answer: 'The parent calls provide(key, context) and the children call inject(key) to access the same reactive context, regardless of nesting depth.',
      explanation: 'Tests understanding that provide/inject is the mechanism behind the pattern.',
    },
    {
      level: 'intermediate',
      question: 'Why use a Symbol (InjectionKey) instead of a string for the provide key?',
      answer: 'A Symbol guarantees a unique, collision-free key, and an InjectionKey<T> carries the context type so inject() is fully typed. Strings risk silent collisions across libraries.',
      explanation: 'Shows awareness of safety and TypeScript ergonomics in library-grade code.',
    },
    {
      level: 'intermediate',
      question: 'How does a parent learn the order or count of its children in a compound component?',
      answer: 'Children self-register on mount by pushing into a provided reactive array (often getting back their index), and unregister on unmount. The DOM order becomes the source of truth.',
      explanation: 'Demonstrates the register/unregister lifecycle that real Tabs/Menu components rely on.',
    },
    {
      level: 'advanced',
      question: 'What happens if a child is used outside its parent, and how do you handle it?',
      answer: 'inject() returns undefined (or a default), so accessing the context crashes. Wrap inject in a useXxx() helper that throws a clear "must be used inside <Parent>" error, or provide a sensible default.',
      explanation: 'Senior signal: defensive context access and good developer-experience error messages.',
    },
    {
      level: 'senior',
      question: 'Compare compound components with passing a config array of items as a prop. When is each better?',
      answer: 'A config-prop API (items=[...]) is simpler and data-driven, great for dynamic lists from a server. Compound components give richer per-item markup, slots, and flexibility but more boilerplate. Choose config for uniform data lists, compound for expressive, customisable UI with arbitrary content per item.',
      explanation: 'Senior answers weigh API ergonomics, flexibility, and data-drivenness rather than declaring one universally better.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you make the compound component accessible (roles, aria, keyboard nav)?',
    'How do you handle children rendered conditionally or in a v-for?',
    'How do scoped slots compare to provide/inject for sharing parent state?',
    'How would you support controlled vs uncontrolled state (v-model) in the parent?',
    'What breaks if a child injects but is teleported outside the parent\'s tree?',
    'How do you unit test a compound component\'s parent/child coordination?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Providing a plain (non-reactive) value, so children do not update.',
      why: 'If you provide a snapshot rather than a ref/reactive, children read a stale value and never re-render on change.',
      fix: 'Provide reactive state (refs, reactive objects) so injected values stay live.',
    },
    {
      mistake: 'Using a string key that collides with another provider.',
      why: 'Two libraries (or two nested instances) providing the same string key silently overwrite each other.',
      fix: 'Use a Symbol/InjectionKey, ideally exported from a single module.',
    },
    {
      mistake: 'Children that register on mount but never unregister.',
      why: 'Removed or conditionally hidden children leave stale entries in the parent\'s list, corrupting order/count.',
      fix: 'Pair register() in onMounted with unregister() in onUnmounted (or onBeforeUnmount).',
    },
    {
      mistake: 'Injecting without guarding for missing context.',
      why: 'A child used outside its parent gets undefined and crashes with a cryptic error.',
      fix: 'Wrap inject in a useXxx() helper that throws a clear message, or supply a default.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Tabs, Accordion, Menu, Select, RadioGroup, and Dialog are almost always built as compound components sharing context via provide/inject.' },
    { area: 'Vue', detail: 'Headless UI for Vue and Naive UI expose compound APIs; the parent manages focus, selection, and aria state while child slots stay flexible.' },
    { area: 'Nuxt', detail: 'Layout and form-section components use compound patterns so pages compose pieces declaratively while shared form state lives in the parent.' },
    { area: 'SSR', detail: 'Compound components are SSR-safe because provide/inject runs during render; just avoid relying on browser-only APIs in self-registration logic.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'provide/inject avoids re-rendering intermediate components that prop drilling would otherwise touch.',
      'Shared reactive state means only the children that actually depend on a value re-render when it changes.',
    ],
    bad: [
      'A single large reactive context object can over-trigger if children read more than they need.',
      'Self-registration arrays that are not cleaned up grow and cause subtle leaks and wrong indices.',
    ],
    optimizations: [
      'Split context into focused refs/computed so children subscribe only to what they use.',
      'Use shallowReactive for context that holds large or stable sub-objects to limit deep tracking.',
      'Always unregister children on unmount to keep registration lists tight.',
      'Memoise derived values with computed in the parent instead of recomputing per child.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['provide-inject', 'slots', 'components-basics', 'props'],
    nextConcepts: ['headless-components', 'scoped-slots', 'render-props-vue', 'component-design-patterns'],
    dependencyNote:
      'Compound components are built on provide/inject and slots. They lead naturally into headless components (which expose behaviour-only context) and scoped slots (an alternative way to share parent state). Master props and provide/inject first.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the target API: <Tabs><Tab/><Tab/></Tabs> — markup that reads like English.',
      'Draw the parent box holding active = ref(0) and provide(\'tabs\', api).',
      'Draw arrows from the parent down to each Tab child labelled inject(\'tabs\').',
      'Show a click on a Tab calling select(i), mutating active, and reactivity re-rendering all tabs.',
      'Note the safeguards: Symbol key, reactive context, register/unregister, and a useTabs() guard for misuse.',
    ],
    diagram: '  <Tabs>  active=ref(0)  provide(\'tabs\',{active,select})\n     │\n     ├── <Tab> inject(\'tabs\') → click → select(0)\n     ├── <Tab> inject(\'tabs\') → click → select(1)\n     └── <TabPanel> inject(\'tabs\') → v-if active===n\n\n   select(i) ⟶ active=i ⟶ reactive trigger ⟶ re-render\n   (no props drilled; context is the shared channel)',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Compound components are a set of components that work as one feature: a parent owns shared reactive state and provides it via provide(), children inject() it to read state and trigger updates. This gives a declarative, prop-light API like <Tabs><Tab/></Tabs>. Use a Symbol/InjectionKey for safety and typing, make the context reactive, register/unregister children for ordering, and guard inject with a useXxx() helper so misuse fails loudly. It is the backbone of Tabs, Accordion, Select, and Menu in every UI library.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Compound components are a pattern where several components are designed to work together as a single feature, like Tabs, Tab, and TabPanel. The idea is that the parent owns the shared state — for Tabs, which tab is active — and exposes it to its children through provide and inject rather than through explicit props. The parent calls provide with a key and a context object containing reactive state plus methods like select. Each child calls inject with that key to get the exact same reactive context by reference, no matter how deeply it is nested. So when a user clicks a Tab, the child calls select, the parent\'s active ref updates, and Vue\'s reactivity re-renders every dependent child automatically. The payoff is a declarative API: the consumer just arranges the pieces in the template and everything coordinates behind the scenes, with no prop drilling. There are a few things you have to get right. The context must be reactive, or children read stale values. You should use a Symbol, ideally an InjectionKey<T>, both to avoid collisions and to get full TypeScript inference. If the parent needs to know the order or count of children, the children register themselves on mount and must unregister on unmount, or you get stale entries. And you wrap inject in a useTabs helper that throws a clear error if a child is used outside its parent. This pattern is everywhere — Tabs, Accordion, Select, Menu, Dialog in libraries like Headless UI. The main trade-off versus a config-array prop is flexibility: compound components allow rich custom markup per item, while a config prop is simpler for uniform, data-driven lists.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Compound vs config-prop API: compound gives expressive per-item markup and slots; a config array is simpler and better for dynamic, data-driven lists.',
      'provide/inject vs scoped slots: inject scales to deep trees and many children; scoped slots are more explicit and discoverable but get unwieldy with many pieces.',
      'Flexibility vs constraint: open child arrangement is powerful but lets users build invalid combinations unless you guard with runtime checks.',
    ],
    edgeCases: [
      'Conditionally rendered or v-for children must register/unregister correctly or order/count drifts.',
      'A child teleported outside the parent loses the injected context unless provide is done above the teleport target.',
      'Controlled vs uncontrolled state: supporting v-model on the parent while still allowing internal default state needs careful syncing.',
      'Multiple nested instances of the same compound (Tabs inside Tabs) rely on inject resolving the nearest provider.',
    ],
    runtimeBehavior: [
      'inject resolves the nearest provided value by walking the instance provides chain at setup time.',
      'Reactive context means a single mutation triggers fine-grained re-render of only dependent children.',
      'Self-registration runs in mount order, so DOM order becomes the canonical ordering source.',
    ],
    scalability: [
      'Splitting context into focused refs/computed prevents unrelated children re-rendering on every change.',
      'For very large lists, a compound component\'s per-child instance overhead can exceed a virtualized config-driven list — measure before choosing.',
    ],
    productionConcerns: [
      'Accessibility (roles, aria-selected, keyboard nav, focus management) is the hardest part and usually lives in the parent context.',
      'Clear errors on misuse (child outside parent) save hours of debugging for consumers.',
      'Stable Symbol keys exported from one module prevent cross-version or cross-library collisions.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Compound = parent owns state, children cooperate as one feature.',
    'Share state via provide() (parent) / inject() (children), not props.',
    'API reads declaratively: <Tabs><Tab/><TabPanel/></Tabs>.',
    'Context MUST be reactive (refs/reactive) or children go stale.',
    'Use Symbol / InjectionKey<T> for collision-free, typed context.',
    'Children self-register on mount, unregister on unmount for ordering.',
    'Guard inject with a useXxx() helper that throws if outside parent.',
    'works at any nesting depth — inject finds the nearest provider.',
    'Accessibility (aria, keyboard, focus) lives in the parent context.',
    'Config-array prop is simpler for uniform data; compound for rich markup.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Sketch the provide() call a Tabs parent makes to share an active ref and a select method.',
      hint: 'Provide an object containing the reactive ref and a setter.',
      solution: {
        lang: 'js',
        code: 'import { ref, provide } from \'vue\'\nconst active = ref(0)\nprovide(\'tabs\', { active, select: (i) => (active.value = i) })',
        explanation: [
          'The provided object carries reactive state plus a mutation method.',
          'Children inject(\'tabs\') and use active / select directly.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write the Tab child that injects the tabs context and highlights itself when active.',
      hint: 'inject the context and compare active.value to the index prop.',
      solution: {
        lang: 'js',
        code: '// <script setup>\nimport { inject } from \'vue\'\nconst props = defineProps({ index: Number })\nconst tabs = inject(\'tabs\')\n// </script>\n// <template>\n//   <button :class="{ active: tabs.active.value === index }"\n//           @click="tabs.select(index)"><slot /></button>\n// </template>',
        explanation: [
          'The child reads shared active state to know if it is selected.',
          'Clicking calls select(index) which updates the parent\'s ref and re-renders all tabs.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add self-registration so children get their index automatically and unregister on unmount.',
      hint: 'Provide a reactive array plus register/unregister; track a symbol id per child.',
      solution: {
        lang: 'js',
        code: '// parent\nimport { reactive, provide } from \'vue\'\nconst items = reactive([])\nprovide(\'tabs\', {\n  items,\n  register: (item) => { items.push(item) },\n  unregister: (item) => {\n    const i = items.indexOf(item)\n    if (i > -1) items.splice(i, 1)\n  },\n})\n// child\n// onMounted(() => ctx.register(self))\n// onUnmounted(() => ctx.unregister(self))',
        explanation: [
          'The parent exposes register/unregister against a reactive array.',
          'Each child adds itself on mount and removes itself on unmount, keeping order/count correct.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Make the tabs context typed and safe: an InjectionKey plus a useTabs() helper that throws if used outside <Tabs>.',
      hint: 'Use InjectionKey<T> and check the inject result.',
      solution: {
        lang: 'ts',
        code: 'import type { InjectionKey, Ref } from \'vue\'\nimport { inject } from \'vue\'\n\ninterface TabsCtx { active: Ref<number>; select: (i: number) => void }\nexport const TabsKey: InjectionKey<TabsCtx> = Symbol(\'tabs\')\n\nexport function useTabs(): TabsCtx {\n  const ctx = inject(TabsKey)\n  if (!ctx) throw new Error(\'<Tab> must be used inside <Tabs>\')\n  return ctx\n}',
        explanation: [
          'InjectionKey<TabsCtx> makes inject(TabsKey) fully typed as TabsCtx | undefined.',
          'useTabs throws a clear error if the context is missing, turning misuse into an immediate, readable failure.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Compound components are how real component libraries are built, so demonstrating them signals you can design APIs, not just consume them. They also force you to use provide/inject correctly, which is a frequent advanced topic. Nailing this question marks you as someone who thinks about developer experience.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) mostly ask the definition and how provide/inject works. Product companies (Zoho, Flipkart, Razorpay) ask you to design a Tabs or Accordion and discuss API trade-offs. FAANG-level rounds push on accessibility, typed context, child registration, and compound-vs-config API design.',
    whatInterviewersExpect:
      'They expect the parent-owns-state definition, a provide/inject implementation with reactive context, awareness of Symbol keys, child registration, and inject guards, plus a thoughtful comparison with config-prop and scoped-slot alternatives.',
  },
}

export default compoundComponents
