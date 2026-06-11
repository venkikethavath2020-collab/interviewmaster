import type { ConceptLesson } from '../../../types/lesson'

const smartDumbComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'smart-dumb-components',
  name: 'Smart vs Dumb Components',
  category: 'patterns',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The smart/dumb (container/presentational) split is the single most useful organizing principle for a Vue codebase — it keeps UI reusable and logic testable.',
    'Presentational components that are pure functions of their props can be reused anywhere, snapshot-tested easily, and previewed in isolation (Storybook/Histoire).',
    'Concentrating data fetching and side effects in a few container components makes the data flow easy to trace and the app easier to refactor.',
    'It is an extremely common interview topic because it reveals whether you think about separation of concerns or just dump everything into one component.',
    'It is the foundation the other patterns (headless, compound, render props) build on, so getting it right pays off everywhere.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A dumb component is a TV screen; a smart component is the cable box that decides what to show on it.',
    story: [
      'Think about a television. The screen itself is not very clever — it just shows whatever picture it is given. It does not know what channel exists or how to find a show.',
      'The cable box behind it is the clever one. It connects to the internet, figures out what channels you have, and decides which picture to send to the screen.',
      'The nice thing is you can plug the same screen into different boxes, and you can change the box without buying a new screen.',
      'In Vue, the dumb component is the screen — it just displays what it is told. The smart component is the box — it fetches the data and decides what to show. Keeping them separate lets you reuse the screen everywhere.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In a Vue app, some components only need to DISPLAY things, and some need to DECIDE things (fetch data, talk to a store, handle navigation).',
    'A dumb (presentational) component takes data through props and reports user actions by emitting events. It has no idea where the data came from or what happens next.',
    'A smart (container) component owns the logic: it fetches data, holds or reads state, and passes data down to dumb components while listening for their events.',
    'Separating them means the display pieces can be reused in many places and tested with simple props, while the messy logic lives in a few clearly-identified containers.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Smart (container) components own state, data fetching, and side effects; dumb (presentational) components are stateless and render purely from props, communicating intent back through emitted events. The split separates "how it works" from "how it looks".',
    how: 'You build presentational components that declare props and emit events and contain no fetching/store/router access. Container components import them, supply the data (from an API, a Pinia store, or a composable), and handle the emitted events.',
    why: 'It makes presentational components reusable and easy to test, isolates side effects for traceability, and lets you swap data sources or restyle without entangling the two concerns.',
    code: {
      label: 'Container feeds a presentational component',
      lang: 'vue',
      code: '<!-- ProductCard.vue — DUMB: pure display -->\n<script setup>\ndefineProps({ product: { type: Object, required: true } })\ndefineEmits([\'add\'])\n</script>\n<template>\n  <div class="card">\n    <h3>{{ product.name }}</h3>\n    <p>{{ product.price }}</p>\n    <button @click="$emit(\'add\', product.id)">Add to cart</button>\n  </div>\n</template>\n\n<!-- ProductsPage.vue — SMART: owns data + behavior -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nimport { useCart } from \'@/composables/useCart\'\nimport ProductCard from \'./ProductCard.vue\'\nconst products = ref([])\nconst { add } = useCart()\nonMounted(async () => { products.value = await api.getProducts() })\n</script>\n<template>\n  <ProductCard v-for="p in products" :key="p.id" :product="p" @add="add" />\n</template>',
      explanation: [
        'ProductCard is presentational: it only knows its product prop and emits add.',
        'It contains no fetching, no store, no router — so it is reusable and easy to test.',
        'ProductsPage is the container: it fetches products and wires the cart logic.',
        'Data flows down via props; user intent flows up via the add event.',
        'You could reuse ProductCard on a wishlist page with a different container unchanged.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The smart/dumb (container/presentational) pattern partitions components by responsibility. Presentational (dumb) components are stateless with respect to application data: they receive inputs via props, render markup, and communicate user intent via emitted events, holding only ephemeral local UI state. Container (smart) components own application concerns — data fetching, store access, routing, side effects, and orchestration — and compose presentational components, injecting data downward through props and handling emitted events. The pattern enforces a unidirectional data flow (props down, events up), maximizing the reusability and testability of presentational components while localizing side effects. In Vue 3 the "smart" logic is often delegated to composables, so containers become thin glue between composables and presentational components.',

  // 7. Internal Working
  internalWorking: [
    'The pattern is implemented purely with Vue\'s core data-flow primitives: props (reactive inputs flowing down) and emitted events (intent flowing up) — no special API is required.',
    'A presentational component declares its contract with defineProps/defineEmits; because it has no external dependencies, Vue re-renders it only when its props (or slots) change, making it cheap and predictable.',
    'A container component creates or reads reactive state (refs, a Pinia store, or a composable), and binds that state to child props with v-bind; when state changes, Vue\'s reactivity triggers the children to re-render with new props.',
    'Emitted events are handled in the container via v-on; the handler mutates the container\'s state or calls a composable/store action, completing the loop without the child knowing the consequences.',
    'In Vue 3, the "smart" responsibilities frequently move into composables called from the container\'s setup, so the container becomes a thin orchestrator and the reusable logic is itself testable in isolation.',
    'Because presentational components depend only on inputs, they can be mounted in isolation (tests, Storybook/Histoire) by simply supplying props — no backend or store needed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        SMART (container)                 DUMB (presentational)
   ┌──────────────────────────┐        ┌───────────────────────────┐
   │ fetch / store / router   │        │  NO fetch / store / router │
   │ owns app state           │        │  local UI state only       │
   │ calls composables        │        │  pure function of props    │
   │                          │        │                            │
   │   state ──── props ──────┼──────► │  render(props)             │
   │   handler ◄── events ────┼─────── │  $emit('intent', payload)  │
   └──────────────────────────┘        └───────────────────────────┘
        side effects live HERE              reusable + easy to test
        (few of these)                      (many of these)
                 unidirectional: props DOWN, events UP`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a pure presentational component',
      lang: 'vue',
      code: '<!-- Avatar.vue -->\n<script setup>\ndefineProps({\n  src: { type: String, required: true },\n  alt: { type: String, default: \'\' },\n  size: { type: Number, default: 40 },\n})\n</script>\n<template>\n  <img :src="src" :alt="alt" :width="size" :height="size" class="avatar" />\n</template>',
      explanation: [
        'Avatar is entirely defined by its props — no state, no effects.',
        'It can be dropped into any page, a test, or a Storybook story by just passing props.',
        'There is nothing to mock to test it; pass props, assert the rendered img.',
        'This purity is what makes presentational components so reusable.',
      ],
    },
    intermediate: {
      label: 'Intermediate — container delegating to a composable',
      lang: 'vue',
      code: '<!-- TodosPage.vue (smart) -->\n<script setup>\nimport { useTodos } from \'@/composables/useTodos\'\nimport TodoList from \'./TodoList.vue\'  // dumb\nimport TodoInput from \'./TodoInput.vue\' // dumb\nconst { todos, add, toggle, loading } = useTodos()\n</script>\n<template>\n  <TodoInput @submit="add" />\n  <p v-if="loading">Loading…</p>\n  <TodoList v-else :todos="todos" @toggle="toggle" />\n</template>',
      explanation: [
        'The container owns no logic itself — it delegates to the useTodos composable.',
        'It wires composable state (todos, loading) to dumb components via props.',
        'It maps emitted events (submit, toggle) to composable actions.',
        'TodoList and TodoInput stay purely presentational and reusable.',
        'This thin-container + composable shape is the idiomatic Vue 3 version of the pattern.',
      ],
    },
    advanced: {
      label: 'Advanced — same dumb component, two containers',
      lang: 'vue',
      code: '<!-- ProductGrid.vue is DUMB: props in, events out -->\n\n<!-- StoreContainer.vue -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nimport ProductGrid from \'./ProductGrid.vue\'\nconst items = ref([])\nonMounted(async () => { items.value = await api.getCatalog() })\n</script>\n<template><ProductGrid :items="items" @select="goToProduct" /></template>\n\n<!-- WishlistContainer.vue -->\n<script setup>\nimport { useWishlist } from \'@/composables/useWishlist\'\nimport ProductGrid from \'./ProductGrid.vue\'\nconst { items } = useWishlist()\n</script>\n<template><ProductGrid :items="items" @select="removeFromWishlist" /></template>',
      explanation: [
        'ProductGrid (dumb) is reused unchanged in two different contexts.',
        'StoreContainer feeds it from an API; WishlistContainer feeds it from a composable.',
        'Each container handles the select event differently (navigate vs remove).',
        'The presentational component never changes — that is the reuse payoff of the split.',
        'Side effects (fetch, navigation, mutation) stay isolated in the containers.',
      ],
    },
    realProject: {
      label: 'Real project — container reads a Pinia store, dumb renders',
      lang: 'vue',
      code: '<!-- CartIcon.vue (dumb) -->\n<script setup>\ndefineProps({ count: { type: Number, default: 0 } })\n</script>\n<template>\n  <span class="cart">🛒 <b v-if="count">{{ count }}</b></span>\n</template>\n\n<!-- Header.vue (smart) -->\n<script setup>\nimport { storeToRefs } from \'pinia\'\nimport { useCartStore } from \'@/stores/cart\'\nimport CartIcon from \'./CartIcon.vue\'\nconst cart = useCartStore()\nconst { count } = storeToRefs(cart)\n</script>\n<template>\n  <header><CartIcon :count="count" /></header>\n</template>',
      explanation: [
        'CartIcon is dumb: it just shows the count prop and knows nothing about Pinia.',
        'Header is the container: it reads the cart store and passes the reactive count down.',
        'storeToRefs keeps the destructured count reactive when handed to the prop.',
        'CartIcon stays reusable and testable without any store setup.',
        'This is how teams keep store coupling at the edges and UI components pure.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a smart and a dumb component?',
      answer: 'A dumb (presentational) component is stateless with respect to app data — it renders from props and emits events. A smart (container) component owns data fetching, state, and side effects, and feeds dumb components their data.',
      explanation: 'The core is responsibility: display vs decide, with props-down/events-up between them.',
    },
    {
      level: 'beginner',
      question: 'Why are presentational components easier to test?',
      answer: 'Because they are pure functions of their props with no side effects — you just pass props and assert the rendered output and emitted events, with nothing to mock.',
      explanation: 'Highlighting "nothing to mock" shows you understand why the split improves testability.',
    },
    {
      level: 'intermediate',
      question: 'How has the Composition API changed how you write smart components?',
      answer: 'The logic that used to bloat a smart component moves into composables, so the container becomes a thin glue layer that calls composables and wires their state/actions to dumb components — and the logic itself becomes independently testable.',
      explanation: 'Connecting containers to composables is the modern, idiomatic answer interviewers look for.',
    },
    {
      level: 'intermediate',
      question: 'Can a presentational component have any state at all?',
      answer: 'Yes — ephemeral local UI state (an open/closed flag, hover state, an input draft) is fine. The rule is it should not own application data, fetching, store, or routing.',
      explanation: 'The nuance is "no application data/side effects", not "no state whatsoever".',
    },
    {
      level: 'advanced',
      question: 'What are the downsides or limits of the smart/dumb split?',
      answer: 'Rigidly applying it can cause prop-drilling through many layers, lots of tiny components, and ceremony for trivial UI. Sometimes provide/inject, slots, or co-locating state is better. The split is a guideline, not a law.',
      explanation: 'Senior signal: knowing when NOT to apply it and naming the prop-drilling/over-fragmentation costs.',
    },
    {
      level: 'senior',
      question: 'How do you decide where the smart/dumb boundary should sit in a feature?',
      answer: 'I put the container at the level that owns the feature\'s data (often the page/route or a section root) and keep everything below it presentational, delegating logic to composables. The boundary follows data ownership: whoever fetches/owns the state is the container; everything that only displays derivations of it stays dumb.',
      explanation: 'Framing the boundary around data ownership shows architectural judgment beyond rote definitions.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does this relate to composables in Vue 3?',
    'When does the split cause prop-drilling, and how do you avoid it?',
    'How would you test a presentational vs a container component differently?',
    'Where should a Pinia store be accessed — container or presentational?',
    'How do slots fit into the presentational pattern?',
    'Is it okay for a presentational component to have local state?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Fetching data or accessing the store directly inside a presentational component.',
      why: 'It couples the component to a context, breaking reuse and forcing mocks in tests.',
      fix: 'Move fetching/store access up into the container (or a composable) and pass data down as props.',
    },
    {
      mistake: 'Making the dumb component reach back up by importing the parent\'s store/router.',
      why: 'It inverts the data flow and creates hidden dependencies, defeating the pattern.',
      fix: 'Communicate intent via emitted events; let the container decide the consequence.',
    },
    {
      mistake: 'Applying the split so rigidly that you prop-drill through many layers.',
      why: 'Threading props through intermediate components is tedious and brittle.',
      fix: 'Use provide/inject for genuinely shared state, or slots, or move the container closer to where data is used.',
    },
    {
      mistake: 'Putting all logic in the container instead of extracting composables.',
      why: 'Containers become fat and hard to test, recreating the original problem at a different level.',
      fix: 'Extract logic into composables and keep the container a thin glue layer.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Teams structure features as a page/section container (data + composables) wrapping reusable presentational components — the default architecture for maintainable apps.' },
    { area: 'Pinia', detail: 'Store access is concentrated in containers (useStore + storeToRefs), keeping presentational components store-agnostic and reusable.' },
    { area: 'Nuxt', detail: 'Pages act as containers (useAsyncData/useFetch on the route) feeding presentational components in components/, a natural smart/dumb boundary.' },
    { area: 'Component library', detail: 'Design-system components are purely presentational (props/events/slots) so consuming apps wrap them in their own containers and data sources.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Presentational components re-render only when props/slots change, so they are cheap and predictable.',
      'Concentrating effects in few containers reduces redundant fetching and duplicated state.',
    ],
    bad: [
      'Deep prop-drilling chains can cause intermediate components to re-render on changes they do not use.',
      'Over-fragmentation into many tiny components adds instance and patching overhead.',
    ],
    optimizations: [
      'Keep presentational components pure so memoization and minimal re-renders are easy.',
      'Use provide/inject for deeply shared state to skip prop-drilling re-renders.',
      'Push logic into composables so containers stay thin and re-render less.',
      'Avoid unnecessary component layers; not every div needs its own component.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['component-design-patterns', 'props', 'component-events', 'composables'],
    nextConcepts: ['headless-components', 'render-props-vue', 'pinia-basics'],
    dependencyNote:
      'Smart/dumb is the foundational case of the broader component-design-patterns family, built on props and events and (in Vue 3) composables for the smart logic. It leads into headless components and render props, which generalize how presentational reuse and logic-sharing are achieved.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes side by side: SMART (container) and DUMB (presentational).',
      'In SMART write: fetch, store, router, composables, owns app state.',
      'In DUMB write: props in, events out, local UI state only, pure render.',
      'Draw props flowing down (smart → dumb) and events flowing up (dumb → smart).',
      'Note "side effects live in SMART; DUMB is reusable + easy to test".',
      'Add the Vue 3 twist: smart logic moves into composables, container becomes thin glue.',
    ],
    diagram: `   SMART (container)            DUMB (presentational)
   fetch/store/router  ──props──►  render(props)
   composables         ◄─events──  $emit('intent')
   owns app state                 local UI state only
   (few, side effects)            (many, reusable, testable)
        props DOWN • events UP`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Smart (container) components own data fetching, state, store/router access, and side effects; dumb (presentational) components render purely from props and emit events. Data flows down via props, intent flows up via events. The split makes presentational components reusable and trivial to test (nothing to mock) and isolates side effects in a few containers. In Vue 3 the smart logic moves into composables, so containers become thin glue. It is a guideline — watch for prop-drilling and over-fragmentation.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The smart/dumb split, also called container/presentational, is how I keep a Vue codebase maintainable. The idea is to partition components by responsibility. Dumb, or presentational, components are stateless with respect to application data: they take their inputs through props, they render, and they report user intent by emitting events. Crucially they do not fetch data, touch a store, or use the router — at most they hold ephemeral local UI state like whether a dropdown is open. Because they are pure functions of their props, they are reusable in many contexts and trivial to test: you pass props and assert the rendered output and emitted events, with nothing to mock, and you can preview them in isolation in something like Storybook or Histoire. Smart, or container, components own the application concerns — fetching, state, store and router access, and side effects — and they compose the presentational components, passing data down through props and handling the events that come up. So the data flow is unidirectional: props down, events up. The big payoff is that you can reuse the same presentational component behind different containers — for example a product grid fed from an API on the catalog page and from a composable on the wishlist page, completely unchanged — while all the messy side effects stay isolated in a few clearly identified containers, which makes the data flow easy to trace and the app easy to refactor. In Vue 3 the pattern evolved: the logic that used to bloat the smart component now goes into composables, so the container becomes a thin glue layer that calls composables and wires their state and actions to the dumb components, and the logic itself becomes independently testable. I treat it as a strong default rather than a hard rule, though — if I apply it too rigidly I get prop-drilling through many layers or a swarm of trivial components, and in those cases provide/inject, slots, or simply moving the container closer to where the data is used are the better call. The boundary itself follows data ownership: whoever owns or fetches the state is the container, and everything that only displays derivations of it stays dumb.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Reusability/testability of pure presentational components vs the prop-drilling and boilerplate the split can introduce.',
      'Thin containers + composables (testable logic, clear boundary) vs co-located state (simpler for small features, less ceremony).',
      'Store access centralized in containers (clean, swappable UI) vs convenience of using the store directly in a leaf (faster to write, harder to reuse).',
    ],
    edgeCases: [
      'Deeply nested trees where prop-drilling becomes painful — provide/inject or a store is the relief valve.',
      'Components that are mostly presentational but need one effect (e.g. a resize listener) — keep it as local UI concern, not app data.',
      'Slots blur the line: a presentational shell with slotted content can host smart children — define ownership clearly.',
      'Over-extraction: splitting a single cohesive component just to follow the rule adds indirection with no reuse.',
    ],
    runtimeBehavior: [
      'Presentational components re-render only on prop/slot change, so they are predictable and easy to optimize.',
      'Reactive props from a container (storeToRefs, computed) propagate updates automatically to dumb children.',
      'Containers that hold many effects can become re-render hotspots; pushing logic to composables keeps render functions lean.',
    ],
    scalability: [
      'Following data ownership for the boundary scales feature teams — each feature has a clear container and shared presentational primitives.',
      'A shared library of pure presentational components scales consistency across many containers/pages.',
      'Composables let multiple containers share logic without duplicating it, scaling logic reuse alongside UI reuse.',
    ],
    productionConcerns: [
      'Audit presentational components for sneaky store/router imports that erode reusability over time.',
      'Watch prop-drilling chains; introduce provide/inject or a store before they become unmanageable.',
      'Keep containers thin by extracting composables, or they regress into the fat-component problem.',
      'Document each presentational component\'s prop/event contract so consumers and tests stay aligned.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Dumb = props in, events out, no fetch/store/router; pure render.',
    'Smart = owns fetch/state/store/router/side effects; feeds dumb components.',
    'Data flow: props DOWN, events UP (unidirectional).',
    'Dumb components are reusable + testable (nothing to mock).',
    'Local UI state in dumb components is fine; app data is not.',
    'Vue 3: move smart logic into composables; keep containers thin.',
    'Boundary follows DATA OWNERSHIP (whoever fetches = container).',
    'Access Pinia in containers (useStore + storeToRefs), not in leaves.',
    'Watch out for prop-drilling → use provide/inject or a store.',
    'Avoid over-fragmentation; not every element needs a component.',
    'It is a guideline, not a law.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a presentational PriceTag component that takes amount and currency props and renders them — no logic.',
      hint: 'Just props and a template; no fetching or state.',
      solution: {
        lang: 'vue',
        code: '<!-- PriceTag.vue -->\n<script setup>\ndefineProps({\n  amount: { type: Number, required: true },\n  currency: { type: String, default: \'USD\' },\n})\n</script>\n<template>\n  <span class="price">{{ currency }} {{ amount.toFixed(2) }}</span>\n</template>',
        explanation: [
          'PriceTag is a pure function of its props.',
          'No store, no fetch — reusable and testable with just props.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Given a fat component that fetches comments AND renders them, split it: show the container that uses a composable and renders a dumb CommentList.',
      hint: 'Container calls useComments(); passes comments to CommentList.',
      solution: {
        lang: 'vue',
        code: '<!-- CommentsSection.vue (smart) -->\n<script setup>\nimport { useComments } from \'@/composables/useComments\'\nimport CommentList from \'./CommentList.vue\' // dumb: props comments, emits reply\nconst { comments, loading, reply } = useComments()\n</script>\n<template>\n  <p v-if="loading">Loading…</p>\n  <CommentList v-else :comments="comments" @reply="reply" />\n</template>',
        explanation: [
          'The container delegates fetching to the useComments composable.',
          'CommentList stays dumb: it receives comments and emits reply.',
          'Logic is now reusable/testable and the list is reusable.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show the same dumb UserBadge component fed by two different containers: one from an API, one from a Pinia store.',
      hint: 'UserBadge takes a user prop; containers source it differently.',
      solution: {
        lang: 'vue',
        code: '<!-- UserBadge.vue (dumb): props { user }, renders name/avatar -->\n\n<!-- ApiUserContainer.vue -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nimport UserBadge from \'./UserBadge.vue\'\nconst user = ref(null)\nonMounted(async () => { user.value = await api.getUser() })\n</script>\n<template><UserBadge v-if="user" :user="user" /></template>\n\n<!-- StoreUserContainer.vue -->\n<script setup>\nimport { storeToRefs } from \'pinia\'\nimport { useUserStore } from \'@/stores/user\'\nimport UserBadge from \'./UserBadge.vue\'\nconst { current } = storeToRefs(useUserStore())\n</script>\n<template><UserBadge v-if="current" :user="current" /></template>',
        explanation: [
          'UserBadge is unchanged across both containers — the reuse payoff.',
          'One container sources the user from an API, the other from a Pinia store.',
          'Side effects/store coupling stay in the containers, keeping the badge pure.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You inherit a 600-line page component doing fetching, store updates, and rendering. Describe your refactor and show the resulting thin container.',
      hint: 'Extract logic to composables; extract UI to presentational components.',
      solution: {
        lang: 'vue',
        code: '<!-- DashboardPage.vue — thin container after refactor -->\n<script setup>\nimport { useDashboardData } from \'@/composables/useDashboardData\'\nimport StatsGrid from \'./StatsGrid.vue\'     // dumb\nimport RecentActivity from \'./RecentActivity.vue\' // dumb\nconst { stats, activity, loading, refresh } = useDashboardData()\n</script>\n<template>\n  <button @click="refresh">Refresh</button>\n  <p v-if="loading">Loading…</p>\n  <template v-else>\n    <StatsGrid :stats="stats" />\n    <RecentActivity :items="activity" />\n  </template>\n</template>',
        explanation: [
          'Fetching and store logic are extracted into useDashboardData (testable in isolation).',
          'The UI is split into presentational StatsGrid and RecentActivity components.',
          'The page becomes a thin container wiring composable state to dumb components.',
          'Each piece is now independently testable and reusable.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The smart/dumb split is the most practical architecture habit in Vue — it directly drives reusability, testability, and traceable data flow. Demonstrating it (and its composable-era evolution) signals you write maintainable code, not just working code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and the props-down/events-up flow. Product companies (Zoho, Flipkart, Razorpay) ask you to refactor a fat component into a container plus presentational pieces. FAANG-level interviews probe boundary placement, composable extraction, and the prop-drilling/over-fragmentation trade-offs.',
    whatInterviewersExpect:
      'They expect you to define the split by responsibility, explain unidirectional data flow, justify why presentational components are testable/reusable, place the boundary by data ownership, move smart logic into composables, and acknowledge it as a guideline with known costs.',
  },
}

export default smartDumbComponents
