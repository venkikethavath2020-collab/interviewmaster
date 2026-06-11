import type { ConceptLesson } from '../../../types/lesson'

const componentDesignPatterns: ConceptLesson = {
  // 1. Concept Summary
  slug: 'component-design-patterns',
  name: 'Component Design Patterns',
  category: 'patterns',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Patterns are the shared vocabulary of component architecture — saying "make it a headless component" or "this should be smart/dumb" communicates a whole design in two words.',
    'Choosing the right pattern is what keeps a growing app maintainable: the difference between a reusable, testable component library and a tangle of copy-pasted, tightly-coupled components.',
    'Senior interviews lean heavily on this — they want to see you reason about reuse, coupling, and composition, not just wire up a feature.',
    'The Composition API reshaped Vue patterns: composables now handle much of what mixins, render props, and HOCs did, so knowing what each pattern is FOR (and its modern replacement) is essential.',
    'Good patterns directly affect testability, performance, and how easily a team can extend a component without breaking everyone who uses it.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Component patterns are like different ways to build with LEGO: some pieces are decorations, some are engines, and some are connectors that let any piece snap onto any other.',
    story: [
      'Imagine a giant box of LEGO. Over time you notice some pieces always do the same job.',
      'Some pieces are just for looks — a flag, a window, a sticker. They do not think; you just place them. Those are like "dumb" display pieces.',
      'Some pieces are the engine or the control panel — they decide what happens. Those are the "smart" pieces.',
      'And some clever pieces are just connectors that let you snap any decoration onto any engine, so you can mix and match forever. Component patterns are these reusable ways of organizing pieces so your creations are easy to build, change, and reuse.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'As an app grows, components start to repeat ideas: some only display what they are told, some hold the logic and data, and some exist purely to share behavior.',
    'A design pattern is a named, repeatable solution to a common component problem — like "separate logic from looks" or "let the parent decide what to render".',
    'In Vue, common patterns include smart/dumb (container/presentational) components, render props done via scoped slots, higher-order components, compound components, and headless components.',
    'With the Composition API, composables (useXxx functions) have become the go-to way to share logic, often replacing older patterns like mixins, render props, and HOCs.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Component design patterns are reusable architectural approaches for structuring Vue components to maximize reuse, separation of concerns, and flexibility — including smart/dumb split, scoped-slot render props, higher-order components, compound components, and headless (logic-only) components.',
    how: 'You apply a pattern by deciding who owns state and how behavior is shared: presentational components take props and emit events; logic is extracted into composables; flexible rendering uses scoped slots; related components coordinate via provide/inject (compound) or expose only behavior (headless).',
    why: 'Patterns make components testable, reusable across contexts, and resistant to the coupling that makes large apps brittle — and they give the team a shared language for design decisions.',
    code: {
      label: 'Smart (container) + dumb (presentational) split',
      lang: 'vue',
      code: '<!-- Dumb: only displays, emits intent -->\n<!-- UserList.vue -->\n<script setup>\ndefineProps({ users: { type: Array, required: true } })\ndefineEmits([\'select\'])\n</script>\n<template>\n  <ul>\n    <li v-for="u in users" :key="u.id" @click="$emit(\'select\', u.id)">\n      {{ u.name }}\n    </li>\n  </ul>\n</template>\n\n<!-- Smart: owns data + logic, renders the dumb one -->\n<!-- UsersContainer.vue -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nimport UserList from \'./UserList.vue\'\nconst users = ref([])\nonMounted(async () => { users.value = await api.getUsers() })\nfunction open(id) { /* navigate */ }\n</script>\n<template>\n  <UserList :users="users" @select="open" />\n</template>',
      explanation: [
        'UserList is presentational: it takes users as a prop and emits select — no fetching, no routing.',
        'UsersContainer is the smart component: it owns the data fetching and the select behavior.',
        'This separation makes UserList trivially reusable and testable with just props/events.',
        'The container can be swapped (different data source) without touching the presentation.',
        'This is the most fundamental Vue component pattern and the basis for the others.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Component design patterns are recurring structural solutions for organizing Vue components around separation of concerns and reuse. Container/presentational (smart/dumb) splits stateful orchestration from stateless rendering. Render props in Vue are expressed through scoped slots, where a component exposes data to slot content the parent controls. Higher-order components wrap a component to inject props/behavior. Compound components coordinate a parent and tightly-related children through provide/inject sharing implicit state. Headless components expose only behavior and state (via slots or composables) with no markup, letting consumers own presentation. In Vue 3, composables — functions that encapsulate reactive logic — are the primary, idiomatic reuse mechanism and frequently supersede mixins, HOCs, and render props for logic sharing, while scoped slots and provide/inject remain the tools for flexible rendering and component coordination.',

  // 7. Internal Working
  internalWorking: [
    'Container/presentational relies only on the props-down/events-up data flow: the smart component passes reactive props and listens for emitted events, so the dumb component is a pure function of its props.',
    'Scoped slots (render props) work because the child calls its slot function with data: <slot :item="x" />, and the parent receives that data via v-slot, so the child controls WHEN/WHAT data, the parent controls the markup.',
    'Compound components use provide() in the parent to expose shared reactive state and methods, and inject() in children to consume it, coordinating without prop-drilling — the state lives on the parent\'s provides record.',
    'Headless components/composables put all logic in setup and expose it through the default scoped slot (or a returned object), so the component tree renders whatever the consumer supplies — the logic effect graph is the only thing the headless layer owns.',
    'HOCs wrap a component by rendering it inside a new component (often via h()/render function), merging in props/handlers; in Vue 3 this is rarer because composables inject behavior without an extra wrapper instance.',
    'Composables share logic by returning refs/computeds/methods created with Vue\'s reactivity, so each call site gets its own isolated reactive state without the implicit-merge problems of mixins.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   WHAT ARE YOU SHARING / VARYING?
   ┌─────────────────────────────────────────────────────────────┐
   │ vary the DATA flow      → Smart/Dumb (container/presentational)│
   │ vary the MARKUP         → Render props via SCOPED SLOTS        │
   │ coordinate RELATED kids → Compound (provide/inject)            │
   │ share LOGIC only        → Composable  (useXxx)   ← Vue 3 default│
   │ behavior, no UI         → Headless (slots/composable)          │
   │ wrap to inject props    → HOC (legacy, rarely needed in Vue 3) │
   └─────────────────────────────────────────────────────────────┘
                 Composables replaced mixins/HOC/render-props
                 for LOGIC; slots & provide/inject for STRUCTURE`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — presentational component (props in, events out)',
      lang: 'vue',
      code: '<!-- StarRating.vue: pure presentational -->\n<script setup>\ndefineProps({ value: { type: Number, default: 0 }, max: { type: Number, default: 5 } })\ndefineEmits([\'update:value\'])\n</script>\n<template>\n  <span>\n    <button\n      v-for="n in max" :key="n"\n      @click="$emit(\'update:value\', n)"\n    >{{ n <= value ? \'★\' : \'☆\' }}</button>\n  </span>\n</template>',
      explanation: [
        'No internal state, no side effects — it is a function of its props.',
        'It emits update:value so it can be a v-model target for any parent.',
        'Because it is pure presentation, it is reusable in any context and trivial to test.',
        'The owning logic (persisting the rating) lives in a smart parent, not here.',
      ],
    },
    intermediate: {
      label: 'Intermediate — render props via a scoped slot',
      lang: 'vue',
      code: '<!-- List.vue: owns iteration, parent owns item markup -->\n<script setup>\ndefineProps({ items: { type: Array, required: true } })\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i" />\n    </li>\n  </ul>\n</template>\n\n<!-- Usage: parent decides how each item looks -->\n<!--\n<List :items="users">\n  <template #default="{ item, index }">\n    <strong>{{ index + 1 }}.</strong> {{ item.name }}\n  </template>\n</List>\n-->',
      explanation: [
        'List owns the structural concern (iteration, keys, the <ul>).',
        'It exposes each item to the slot via <slot :item="item" :index="i" />.',
        'The parent supplies the markup through v-slot, so one List renders any item shape.',
        'This is Vue\'s idiomatic "render prop": flexibility of rendering without inheritance.',
        'It is far more reusable than hard-coding the item template inside List.',
      ],
    },
    advanced: {
      label: 'Advanced — compound components with provide/inject',
      lang: 'vue',
      code: '<!-- Tabs.vue (parent) -->\n<script setup>\nimport { provide, ref } from \'vue\'\nconst active = ref(0)\nprovide(\'tabs\', { active, select: (i) => (active.value = i) })\n</script>\n<template><div class="tabs"><slot /></div></template>\n\n<!-- Tab.vue (child) -->\n<script setup>\nimport { inject } from \'vue\'\nconst props = defineProps({ index: Number })\nconst tabs = inject(\'tabs\')\n</script>\n<template>\n  <button :class="{ active: tabs.active === props.index }" @click="tabs.select(props.index)">\n    <slot />\n  </button>\n</template>',
      explanation: [
        'Tabs (parent) provides shared state and a select method via provide.',
        'Each Tab (child) injects that context — no prop-drilling between siblings.',
        'Consumers compose <Tabs><Tab/>...</Tabs> declaratively; coordination is implicit.',
        'This is the compound pattern: tightly-related components that only make sense together.',
        'provide/inject is the mechanism that lets the children share the parent\'s reactive state.',
      ],
    },
    realProject: {
      label: 'Real project — headless logic component (useToggle-style)',
      lang: 'vue',
      code: '<!-- Disclosure.vue: behavior only, NO markup of its own -->\n<script setup>\nimport { ref } from \'vue\'\nconst open = ref(false)\nconst toggle = () => (open.value = !open.value)\n</script>\n<template>\n  <!-- expose state+behavior to the consumer via a scoped slot -->\n  <slot :open="open" :toggle="toggle" />\n</template>\n\n<!-- Usage: consumer owns ALL the markup and styling -->\n<!--\n<Disclosure v-slot="{ open, toggle }">\n  <button @click="toggle">{{ open ? \'Hide\' : \'Show\' }}</button>\n  <p v-if="open">Secret content</p>\n</Disclosure>\n-->',
      explanation: [
        'Disclosure ships behavior (open state + toggle) but renders no opinionated UI.',
        'It exposes state and methods through the default scoped slot.',
        'The consumer owns 100% of the markup and styling, so it fits any design system.',
        'This headless pattern (popularized by Headless UI / VueUse) maximizes reuse.',
        'The same logic could equally be packaged as a useDisclosure composable — patterns converge.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the smart/dumb (container/presentational) component pattern?',
      answer: 'Splitting components into stateless presentational ones that take props and emit events, and stateful container ones that own data fetching and logic and render the presentational pieces.',
      explanation: 'A good answer ties it to props-down/events-up and notes it makes presentational components reusable and testable.',
    },
    {
      level: 'beginner',
      question: 'How does Vue implement the "render props" pattern?',
      answer: 'Through scoped slots: a component exposes data to slot content via <slot :data="x" />, and the parent supplies the markup with v-slot, controlling how that data is rendered.',
      explanation: 'Naming scoped slots (not a React-style function-as-child) shows Vue-specific knowledge.',
    },
    {
      level: 'intermediate',
      question: 'What is a headless component and why is it useful?',
      answer: 'A component that provides behavior and state but no markup, exposing them via scoped slots (or as a composable). It is useful because consumers fully own the presentation, so the logic is reusable across any design system.',
      explanation: 'Mentioning Headless UI/VueUse and the design-system independence is the senior touch.',
    },
    {
      level: 'intermediate',
      question: 'What is a compound component pattern in Vue?',
      answer: 'A set of components designed to work together (like Tabs/Tab or Select/Option) where the parent shares state via provide and children consume it via inject, so they coordinate without prop-drilling.',
      explanation: 'The key mechanism is provide/inject sharing implicit reactive state among related components.',
    },
    {
      level: 'advanced',
      question: 'How did the Composition API change Vue component patterns?',
      answer: 'Composables became the primary logic-reuse mechanism, largely replacing mixins (no implicit name collisions), HOCs (no wrapper instances), and render-props-for-logic. Scoped slots and provide/inject remain for flexible rendering and component coordination, while logic moves into useXxx functions.',
      explanation: 'Senior signal: knowing which old patterns composables replaced and which structural patterns persist.',
    },
    {
      level: 'senior',
      question: 'How do you decide which pattern to use for a reusable component?',
      answer: 'I ask what varies. If only the markup varies, scoped slots (render props). If only logic is shared, a composable. If presentation must be fully consumer-owned, headless. If related components must coordinate, compound via provide/inject. If I just need to separate orchestration from display, smart/dumb. I default to composables for logic and slots for structure, avoiding HOCs/mixins.',
      explanation: 'Demonstrates a decision framework keyed on "what varies", which is exactly what interviewers want.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why are mixins discouraged in Vue 3 and what replaced them?',
    'When would you still reach for a higher-order component in Vue?',
    'How do scoped slots differ from regular slots?',
    'How do you avoid prop-drilling without overusing provide/inject?',
    'What are the testability implications of each pattern?',
    'How do headless components and composables relate?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting data fetching and business logic inside presentational components.',
      why: 'It couples them to a context, kills reusability, and makes them hard to test in isolation.',
      fix: 'Keep presentational components pure (props in, events out) and move logic to containers or composables.',
    },
    {
      mistake: 'Reaching for mixins or HOCs to share logic in Vue 3.',
      why: 'Mixins cause implicit name collisions and unclear data sources; HOCs add wrapper instances and prop forwarding.',
      fix: 'Use composables — explicit imports, isolated reactive state, no collisions or extra instances.',
    },
    {
      mistake: 'Overusing provide/inject for ordinary parent-child data.',
      why: 'It hides data flow and creates implicit, hard-to-trace dependencies across the tree.',
      fix: 'Use props/events for direct relationships; reserve provide/inject for genuinely cross-cutting or compound-component state.',
    },
    {
      mistake: 'Forcing a clever pattern where a simple component would do.',
      why: 'Premature abstraction (headless/HOC everywhere) adds indirection and cognitive load for no payoff.',
      fix: 'Start simple; introduce a pattern only when a real reuse or coupling problem appears.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Libraries like Headless UI Vue and Radix Vue ship headless components; consumers style them, separating logic from presentation across design systems.' },
    { area: 'Vue', detail: 'Element Plus, Vuetify, and similar use compound patterns (Tabs/Tab, Select/Option) coordinating via provide/inject, and scoped slots for customizable item rendering.' },
    { area: 'VueUse', detail: 'VueUse packages cross-cutting behavior as composables (useStorage, useMouse), the modern logic-reuse pattern that replaced mixins.' },
    { area: 'Nuxt', detail: 'Nuxt apps lean on smart/dumb split (page-level containers fetch via useAsyncData; presentational components render) and composables for shared logic across pages.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Presentational components are easy to memoize/cache because they depend only on props.',
      'Composables share logic without extra component instances, unlike HOC wrappers.',
    ],
    bad: [
      'HOC wrappers add component instances and prop forwarding overhead.',
      'Overusing scoped slots/provide-inject can add indirection and make render dependencies harder to optimize.',
    ],
    optimizations: [
      'Prefer composables over HOCs to avoid wrapper-instance overhead.',
      'Keep presentational components pure so they re-render only when props change.',
      'Use provide/inject for genuinely shared state rather than re-fetching/duplicating in children.',
      'Avoid premature abstraction; fewer layers means fewer instances and simpler updates.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'props', 'component-events', 'composables'],
    nextConcepts: ['smart-dumb-components', 'render-props-vue', 'headless-components', 'compound-components'],
    dependencyNote:
      'This is the umbrella for component architecture: it builds on components, props/events, and composables, and it specializes into smart/dumb, render props (scoped slots), headless, compound, and HOC patterns — each a focused application of "what varies".',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the guiding question at the top: "What varies / what am I sharing?"',
      'List five rows: data flow → smart/dumb; markup → scoped slots; logic → composable; behavior-only → headless; related kids → compound (provide/inject).',
      'Cross out mixins and HOC, noting composables replaced them for logic in Vue 3.',
      'Draw a smart container passing props down and a dumb child emitting events up.',
      'Draw a child <slot :item> with the parent supplying v-slot markup (render props).',
      'End with the rule: default to composables for logic, slots/provide-inject for structure; do not over-abstract.',
    ],
    diagram: `  WHAT VARIES?
   data flow   → Smart ──props──► Dumb ──events──►
   markup      → <slot :item> ← parent v-slot (render props)
   logic       → useXxx() composable        (Vue 3 default)
   behavior    → Headless (slot exposes state)
   related kids→ Compound (provide/inject)
   [mixins / HOC ✗ — replaced by composables]`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue component patterns solve "what varies". Smart/dumb separates logic-owning containers from pure presentational components (props in, events out). Render props are scoped slots — the child exposes data, the parent owns the markup. Compound components coordinate related children via provide/inject. Headless components ship behavior with no UI. In Vue 3, composables are the default logic-reuse tool and replaced mixins/HOCs; slots and provide/inject remain for structure. Default to composables for logic and slots for rendering, and avoid premature abstraction.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'When I think about component design patterns in Vue, I anchor on one question: what is varying, or what am I trying to share? That picks the pattern. The most fundamental is the smart/dumb, or container/presentational, split: presentational components are pure — props in, events out, no fetching or routing — which makes them reusable and trivially testable, while container components own the data and logic and render the presentational pieces. If only the markup needs to vary, I use render props, which in Vue means scoped slots: the child owns a structural concern like iteration and exposes data through the slot, and the parent supplies the template via v-slot, so one component can render any item shape. If related components need to coordinate, like Tabs and Tab or Select and Option, I use the compound pattern: the parent provides shared reactive state and the children inject it, so they cooperate without prop-drilling. If I want logic with no opinionated UI at all, that is a headless component — it exposes state and behavior through a scoped slot and the consumer owns every pixel, which is how libraries like Headless UI and Radix Vue work across design systems. The big shift in Vue 3 is that composables became the primary way to share logic. They largely replaced mixins, which had implicit name collisions and unclear data sources, and higher-order components, which added wrapper instances and prop forwarding. So my defaults are: composables for sharing logic, scoped slots for flexible rendering, and provide/inject for coordinating compound components. The senior discipline on top of that is restraint — I do not reach for a headless or HOC abstraction until there is a real reuse or coupling problem, because premature abstraction just adds indirection. Patterns are a shared vocabulary for those trade-offs, not boxes to force every component into.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Composables vs HOCs/mixins: composables are explicit and collision-free but require importing/wiring; mixins are implicit (worse) and HOCs add instances — composables win for logic.',
      'Headless flexibility vs convenience: headless maximizes reuse but pushes all markup/styling onto the consumer; opinionated components are faster to adopt but less flexible.',
      'provide/inject (decoupled coordination) vs props (explicit data flow): inject reduces drilling but hides dependencies, hurting traceability if overused.',
    ],
    edgeCases: [
      'Compound components break if a child is used outside its provider (inject returns undefined) — guard with a default or runtime error.',
      'Scoped slot typing in TS requires care so consumers get typed slot props.',
      'Headless components that expose refs can leak internal state if not designed as a deliberate contract.',
      'HOCs must forward attrs/events/slots correctly or they silently drop them (attribute fallthrough pitfalls).',
    ],
    runtimeBehavior: [
      'Presentational components re-render only on prop/slot changes, making them cheap and cacheable.',
      'provide/inject is reactive when the provided value is reactive; injecting a plain value will not update.',
      'Composables create isolated reactive state per call, unlike a shared mixin object.',
    ],
    scalability: [
      'A consistent pattern vocabulary across a team scales onboarding and review — people recognize structures instantly.',
      'Headless + composable layering scales a design system: one logic core, many themed presentations.',
      'Over-patterning (deep wrapper/HOC chains) hurts scalability via instance count and indirection — prefer flat composables.',
    ],
    productionConcerns: [
      'Document the contract of headless/compound components (what slot props/inject keys exist) or consumers misuse them.',
      'Avoid mixin usage in new code; migrate legacy mixins to composables to remove collision/source-ambiguity bugs.',
      'Keep provide/inject keys typed and namespaced to prevent silent mismatches across a large app.',
      'Resist premature abstraction; refactor toward a pattern when duplication is proven, not anticipated.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Pick the pattern by asking "what varies / what am I sharing?".',
    'Smart/Dumb: containers own logic; presentational are props-in/events-out + reusable.',
    'Render props in Vue = scoped slots (child exposes data, parent owns markup).',
    'Compound: related components coordinate via provide/inject.',
    'Headless: behavior/state only, no markup; consumer owns the UI.',
    'Composables = the Vue 3 default for sharing LOGIC.',
    'Composables replaced mixins (collisions) and HOCs (wrapper instances).',
    'Slots + provide/inject handle STRUCTURE; composables handle LOGIC.',
    'Keep presentational components pure for testability and cheap re-renders.',
    'Avoid premature abstraction — pattern when duplication is proven.',
    'Guard compound children used outside their provider (inject default/error).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Refactor a component that both fetches users AND renders them into a smart container + dumb list. Show the dumb component.',
      hint: 'The dumb component should only take a users prop and emit select.',
      solution: {
        lang: 'vue',
        code: '<!-- UserList.vue (dumb) -->\n<script setup>\ndefineProps({ users: { type: Array, required: true } })\ndefineEmits([\'select\'])\n</script>\n<template>\n  <ul>\n    <li v-for="u in users" :key="u.id" @click="$emit(\'select\', u)">{{ u.name }}</li>\n  </ul>\n</template>',
        explanation: [
          'No fetching here — only props in and a select event out.',
          'A smart parent owns the fetch and passes users down.',
          'This makes UserList reusable and testable with plain props.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a reusable <DataList> that owns iteration but lets the parent render each item via a scoped slot.',
      hint: 'Use <slot :item="item" :index="i" /> inside the v-for.',
      solution: {
        lang: 'vue',
        code: '<!-- DataList.vue -->\n<script setup>\ndefineProps({ items: { type: Array, required: true } })\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i" />\n    </li>\n  </ul>\n</template>',
        explanation: [
          'DataList owns the structural concern (the list and keys).',
          'It exposes item and index to the slot so the parent controls markup.',
          'One DataList now renders any item shape — the render-props pattern.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a compound Accordion + AccordionItem where only one item is open at a time, coordinating via provide/inject.',
      hint: 'Parent provides the open index and a setter; items inject it.',
      solution: {
        lang: 'vue',
        code: '<!-- Accordion.vue -->\n<script setup>\nimport { provide, ref } from \'vue\'\nconst openId = ref(null)\nprovide(\'accordion\', { openId, set: (id) => (openId.value = openId.value === id ? null : id) })\n</script>\n<template><div><slot /></div></template>\n\n<!-- AccordionItem.vue -->\n<script setup>\nimport { inject, computed } from \'vue\'\nconst props = defineProps({ id: { required: true } })\nconst acc = inject(\'accordion\')\nconst open = computed(() => acc.openId.value === props.id)\n</script>\n<template>\n  <div>\n    <button @click="acc.set(props.id)"><slot name="header" /></button>\n    <div v-if="open"><slot /></div>\n  </div>\n</template>',
        explanation: [
          'Accordion provides the shared open id and a toggler.',
          'Each item injects that state and computes whether it is open.',
          'Only one item can be open because they all read/write the same provided openId.',
          'This is the compound pattern coordinating siblings without prop-drilling.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Turn a Toggle headless component into an equivalent composable, and explain when you would choose each.',
      hint: 'Headless exposes via scoped slot; composable returns the same state/methods.',
      solution: {
        lang: 'js',
        code: '// useToggle.js — same logic, as a composable\nimport { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const on = ref(initial)\n  const toggle = () => (on.value = !on.value)\n  return { on, toggle }\n}\n\n// Choose the COMPOSABLE when consumers also need the logic outside a template\n// (e.g. in setup logic, other composables).\n// Choose the HEADLESS COMPONENT when the reuse point is the TEMPLATE — you want\n// to drop <Toggle v-slot="{ on, toggle }"> declaratively into markup.',
        explanation: [
          'The composable packages the identical state and behavior as a returned object.',
          'Composables shine when logic is consumed in script/setup or composed further.',
          'Headless components shine when the reuse happens declaratively in templates and consumers own markup.',
          'They are two delivery mechanisms for the same logic — pick by where it is consumed.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Component design patterns are the architecture vocabulary that separates engineers who build features from those who design maintainable, reusable systems. Reasoning about reuse and coupling is exactly what senior and lead interviews assess.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask you to name and define patterns like container/presentational. Product companies (Zoho, Flipkart, Razorpay) ask you to refactor a tangled component or build a reusable list/compound component. FAANG-level interviews probe pattern selection, why composables replaced mixins/HOCs, and trade-offs at scale.',
    whatInterviewersExpect:
      'They expect a decision framework keyed on "what varies", correct mapping (markup→scoped slots, logic→composables, related→compound, behavior-only→headless), awareness that composables superseded mixins/HOCs, and the judgment to avoid premature abstraction.',
  },
}

export default componentDesignPatterns
