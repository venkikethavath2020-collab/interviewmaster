import type { ConceptLesson } from '../../../types/lesson'

const scopedSlots: ConceptLesson = {
  // 1. Concept Summary
  slug: 'scoped-slots',
  name: 'Scoped Slots',
  category: 'components',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Scoped slots let a child expose its internal data UP to the parent\'s slot content — the key to reusable components that own logic but let callers control rendering.',
    'They are the foundation of the "renderless" / headless component pattern: a component manages data/state and delegates all markup to the parent.',
    'Lists, tables, dropdowns, and data-fetchers in every component library use scoped slots to let consumers customise each item\'s rendering.',
    'This is the advanced slots topic interviewers use to separate intermediate from senior Vue developers.',
    'Understanding scoped slots unlocks compound components, virtualized lists, and flexible data presentation patterns.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A scoped slot is like a vending machine that hands you the ingredients and lets YOU decide how to plate the dish.',
    story: [
      'Imagine a kitchen helper who chops all the vegetables, cooks the rice, and grills the chicken — it does all the hard work.',
      'But instead of deciding how the plate should look, it hands you each ingredient on a tray and says "you arrange it however you like".',
      'You get the prepared food (the data) but you choose the presentation: a bowl, a wrap, a fancy plate.',
      'A scoped slot is that helper. The component prepares the data and passes it out to you, and you decide exactly how to display each piece.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal slot lets the parent put content into the child, but that content can only use the parent\'s own data — it cannot see what is inside the child.',
    'A scoped slot fixes this: the child attaches some of its data to the slot, like a tag on a gift, and the parent can read that data when filling the slot.',
    'So the child stays in charge of the data and logic, but the parent decides how to display each piece using the data the child handed up.',
    'This is incredibly useful for lists: the child loops and provides each item, while the parent decides how each item looks. The component is reusable for any kind of item.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A scoped slot is a slot through which the child passes data to the parent\'s slot content via slot props, so the parent can render using the child\'s internal data.',
    how: 'The child binds data on the slot element: <slot :item="x" :index="i" />. The parent receives it by destructuring the slot props: <template #default="{ item, index }">. The default slot can use v-slot="..." directly on the component.',
    why: 'It inverts control: the child owns the data/logic, the parent owns the presentation. This enables reusable list/table/headless components where consumers customise rendering.',
    code: {
      label: 'A list component exposing each item via a scoped slot',
      lang: 'vue',
      code: '<!-- List.vue (child) -->\n<script setup>\ndefineProps([\'items\'])\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i">{{ item }}</slot>\n    </li>\n  </ul>\n</template>\n\n<!-- Parent decides how each item looks -->\n<List :items="users">\n  <template #default="{ item, index }">\n    <strong>{{ index + 1 }}.</strong> {{ item.name }} — {{ item.email }}\n  </template>\n</List>',
      explanation: [
        'The child loops and binds :item and :index on the slot.',
        'The parent destructures { item, index } from the slot props.',
        'The child owns iteration; the parent owns per-item presentation.',
        '{{ item }} inside <slot> is fallback if the parent gives no template.',
        'This single List renders any item shape the caller designs.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A scoped slot is a slot that receives slot props: data the child binds to the <slot> element and exposes to the parent\'s slot content. The slot content becomes a function that the child invokes with a props object, so the parent\'s template runs with access to child-provided data while still being defined in the parent\'s scope. This inverts the control of rendering: the child supplies data and structure hooks, the parent supplies presentation — the basis of renderless/headless components.',

  // 7. Internal Working
  internalWorking: [
    'When the parent declares <template #default="slotProps">, the compiler turns the slot content into a function that takes slotProps and returns vnodes.',
    'That slot function is passed to the child in its slots object, keyed by slot name.',
    'In the child\'s render, <slot :item="x" :index="i" /> calls the slot function with an object { item: x, index: i } — these are the slot props.',
    'The returned vnodes (built using the parent\'s scope plus the passed slot props) are inserted at the slot location in the child\'s output.',
    'Because the slot is a function invoked per render with current child data, scoped slot content re-renders reactively when either the child\'s exposed data or the parent\'s scope changes.',
    'A renderless component takes this to the extreme: its template is essentially just <slot v-bind="exposedState" />, delegating ALL markup to the parent.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Parent: #default="{ item, index }"   (a FUNCTION of slot props)
                       ▲
                       │  invoked with { item, index }
   Child render:       │
   <slot :item="x" :index="i" />  ── passes child data UP into the
                                     parent's slot function

   child owns DATA  ──►  parent owns PRESENTATION
   (inverted control of rendering = headless/renderless pattern)`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — passing one value up',
      lang: 'vue',
      code: '<!-- Hello.vue -->\n<script setup>\nconst user = { name: \'Asha\' }\n</script>\n<template>\n  <slot :name="user.name">Guest</slot>\n</template>\n\n<!-- parent -->\n<Hello v-slot="{ name }">\n  Hi {{ name }}!\n</Hello>',
      explanation: [
        'The child binds :name (a slot prop) on the slot.',
        'The parent reads it via v-slot="{ name }" on the component (default slot).',
        'The parent\'s template now uses the child\'s data.',
        '"Guest" is fallback if no slot content is supplied.',
      ],
    },
    intermediate: {
      label: 'Intermediate — named scoped slots in a table',
      lang: 'vue',
      code: '<!-- DataTable.vue -->\n<script setup>\ndefineProps([\'rows\'])\n</script>\n<template>\n  <table>\n    <tr v-for="row in rows" :key="row.id">\n      <td><slot name="cell" :row="row" /></td>\n    </tr>\n  </table>\n</template>\n\n<!-- parent -->\n<DataTable :rows="orders">\n  <template #cell="{ row }">\n    <span :class="{ paid: row.paid }">#{{ row.id }} — {{ row.total }}</span>\n  </template>\n</DataTable>',
      explanation: [
        'A named scoped slot "cell" exposes each row to the parent.',
        'The parent destructures { row } and renders custom cell markup.',
        'The table owns iteration and structure; the parent styles each row.',
        'Named scoped slots use <template #name="{ ... }">.',
        'This is how reusable table components let consumers format cells.',
      ],
    },
    advanced: {
      label: 'Advanced — a renderless data-fetcher component',
      lang: 'vue',
      code: '<!-- Fetcher.vue (renderless) -->\n<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst props = defineProps([\'url\'])\nconst data = ref(null)\nconst loading = ref(false)\nconst error = ref(null)\nwatchEffect(async () => {\n  loading.value = true; error.value = null\n  try { data.value = await (await fetch(props.url)).json() }\n  catch (e) { error.value = e }\n  finally { loading.value = false }\n})\n</script>\n<template>\n  <slot :data="data" :loading="loading" :error="error" />\n</template>\n\n<!-- parent controls ALL markup -->\n<Fetcher url="/api/users" v-slot="{ data, loading, error }">\n  <p v-if="loading">Loading…</p>\n  <p v-else-if="error">Failed</p>\n  <ul v-else><li v-for="u in data" :key="u.id">{{ u.name }}</li></ul>\n</Fetcher>',
      explanation: [
        'Fetcher owns the fetching logic and exposes data/loading/error as slot props.',
        'Its template is just a single <slot> — it renders no markup of its own (renderless).',
        'The parent decides exactly how loading, error, and success look.',
        'This separates reusable LOGIC from presentation — the headless pattern.',
        'Composables now often replace this, but scoped slots are the template-based form.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable VirtualList exposing visible items',
      lang: 'vue',
      code: '<!-- VirtualList.vue -->\n<script setup>\nimport { computed, ref } from \'vue\'\nconst props = defineProps([\'items\', \'rowHeight\'])\nconst scrollTop = ref(0)\nconst visible = computed(() => {\n  const start = Math.floor(scrollTop.value / props.rowHeight)\n  return props.items.slice(start, start + 20).map((item, i) => ({ item, index: start + i }))\n})\n</script>\n<template>\n  <div class="viewport" @scroll="scrollTop = $event.target.scrollTop">\n    <div v-for="entry in visible" :key="entry.index" :style="{ height: rowHeight + \'px\' }">\n      <slot :item="entry.item" :index="entry.index" />\n    </div>\n  </div>\n</template>\n\n<!-- parent renders each visible item however it wants -->\n<!-- <VirtualList :items="big" :row-height="40" v-slot="{ item }"> -->\n<!--   <ProductRow :product="item" /> -->\n<!-- </VirtualList> -->',
      explanation: [
        'VirtualList owns the hard part: computing which items are visible.',
        'It exposes each visible item via a scoped slot.',
        'The parent decides how to render each row (any component/markup).',
        'One virtualization engine works for any item type, thanks to scoped slots.',
        'This is a classic real-world use: reusable logic, caller-controlled rendering.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a scoped slot?',
      answer: 'A slot through which the child passes data (slot props) up to the parent\'s slot content, so the parent can render using the child\'s internal data.',
      explanation: 'Mentioning "slot props" and "child data exposed to parent" is the core.',
    },
    {
      level: 'intermediate',
      question: 'How does a scoped slot differ from a regular slot?',
      answer: 'A regular slot\'s content can only access the parent\'s data; a scoped slot lets the child expose its own data to that content via slot props, so the parent can render with child-internal values.',
      explanation: 'The data-access difference is exactly what interviewers probe.',
    },
    {
      level: 'intermediate',
      question: 'How do you receive slot props in the parent?',
      answer: 'Destructure them in v-slot: <template #default="{ item, index }">, or for the default slot, v-slot="{ item }" directly on the component tag.',
      explanation: 'The destructuring syntax is the practical knowledge being tested.',
    },
    {
      level: 'advanced',
      question: 'What is a renderless (headless) component and how do scoped slots enable it?',
      answer: 'A component that contains logic/state but renders no markup of its own — its template is essentially <slot v-bind="state" />. Scoped slots pass that state to the parent, which supplies all markup, separating logic from presentation.',
      explanation: 'Connecting scoped slots to the headless pattern is a senior-level signal.',
    },
    {
      level: 'advanced',
      question: 'How are scoped slots represented internally?',
      answer: 'The parent\'s slot content compiles to a function taking a slot-props object; the child invokes it via <slot v-bind="props" />, returning vnodes inserted at the slot location. It re-runs on render, staying reactive.',
      explanation: 'The "slot is a function of props" model is the deep insight.',
    },
    {
      level: 'senior',
      question: 'When would you choose a composable over a renderless component?',
      answer: 'Composables are usually preferred now: they share logic without an extra component instance or wrapper element, are easier to compose/type, and avoid slot indirection. Renderless/scoped-slot components still shine when the LOGIC must drive template structure (e.g. list virtualization) or when you want a template-level API.',
      explanation: 'Comparing the two reuse mechanisms shows architectural maturity.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are slot props and how does the child expose them?',
    'How do you destructure slot props in the parent?',
    'What is the difference between a scoped slot and a regular slot?',
    'What is a renderless component?',
    'When would you use a composable instead of a scoped slot for reuse?',
    'How do scoped slots compare to React render props?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Trying to access child data in a regular (non-scoped) slot.',
      why: 'Regular slot content runs in the parent scope and cannot see child internals.',
      fix: 'Bind the data on the <slot> element in the child and destructure it in the parent\'s v-slot.',
    },
    {
      mistake: 'Putting v-slot on a normal element instead of <template> (for named slots).',
      why: 'Named scoped slots must use v-slot on a <template>; the default scoped slot can go on the component itself.',
      fix: 'Use <template #name="slotProps"> for named slots; v-slot="props" on the component for the default.',
    },
    {
      mistake: 'Forgetting to bind the data on the <slot> element.',
      why: 'Without :item="x" on <slot>, the parent\'s destructured slot props are undefined.',
      fix: 'Bind every value the parent needs: <slot :item="x" :index="i" />.',
    },
    {
      mistake: 'Reaching for a renderless component when a composable is simpler.',
      why: 'Renderless components add a component instance and slot indirection for logic that a composable could share more cleanly.',
      fix: 'Prefer a composable for pure logic reuse; use scoped slots when logic must shape template output.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Lists, tables, comboboxes, and dropdowns expose items/state via scoped slots so consumers fully customise rendering.' },
    { area: 'Vue', detail: 'Renderless data-fetchers, form-validation wrappers, and virtualized lists pass state up through scoped slots.' },
    { area: 'Headless components', detail: 'Headless UI-style libraries deliver behaviour/accessibility logic and let apps own all markup via scoped slots.' },
    { area: 'Nuxt', detail: 'Reusable presentation-agnostic components (pagination, infinite scroll) expose state through scoped slots for page-specific markup.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Scoped slots avoid duplicating components for each rendering variant — one logic component serves all.',
      'Combined with virtualization, they let you render only visible items with caller-defined markup.',
    ],
    bad: [
      'Slot functions re-run on render; heavy slot content re-evaluates with each update.',
      'Deeply nested scoped slots add indirection that can be harder for the compiler to optimise.',
    ],
    optimizations: [
      'Keep slot-prop objects stable and minimal to limit re-render scope.',
      'Use v-memo or keys on slot content for expensive, rarely-changing items.',
      'Prefer composables for pure logic reuse to avoid extra component/slot overhead.',
      'Virtualize large lists so scoped slots only render visible rows.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['slots', 'props', 'components-basics'],
    nextConcepts: ['headless-components', 'render-props-vue', 'compound-components', 'composables'],
    dependencyNote:
      'Scoped slots build directly on slots by adding slot props (child→parent data). They are the template-based foundation of headless-components and render-props-vue, and an alternative to composables for logic reuse.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the child with <slot :item="x" :index="i" /> and label it "binds data UP".',
      'Draw the parent with #default="{ item, index }" and label it "a function of slot props".',
      'Draw an arrow from child data into the parent\'s slot function.',
      'Note: child owns DATA, parent owns PRESENTATION.',
      'Say: "A scoped slot makes the slot content a function the child calls with its own data, so the parent renders using child internals — that inversion is the renderless/headless pattern."',
    ],
    diagram: `   Child:  <slot :item="x" :index="i"/>
                     │  (calls parent's slot fn with {item,index})
                     ▼
   Parent: #default="{ item, index }"  → custom markup
           DATA from child + PRESENTATION from parent`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A scoped slot lets the child pass data up to the parent\'s slot content via slot props. The child binds values on <slot :item="x" />, and the parent destructures them with v-slot="{ item }" (or <template #name="{ item }">). Internally the slot content is a function the child invokes with a props object, so the parent renders using the child\'s internal data. This inverts control — child owns logic/data, parent owns presentation — and is the basis of renderless/headless components, reusable lists, and tables.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Scoped slots solve a limitation of regular slots: normal slot content can only access the parent\'s data, never the child\'s internals. A scoped slot lets the child expose some of its own data to the slot content by binding it on the <slot> element — for example <slot :item="x" :index="i" /> — and the parent receives those slot props by destructuring them in v-slot, like <template #default="{ item, index }">, or for the default slot, v-slot="{ item }" directly on the component. The mechanism is that the parent\'s slot content compiles into a function that takes a slot-props object; the child invokes that function during its render with the data it wants to expose, and the returned vnodes are inserted at the slot location. Because it is a function called per render, the content stays reactive to both the child\'s exposed data and the parent\'s scope. The big idea is inversion of control over rendering: the child owns the data and logic, while the parent owns the presentation. This is exactly what powers reusable lists and tables, where the component handles iteration and the consumer formats each item, and it is the foundation of renderless or headless components, whose template is essentially just <slot v-bind="state" /> so they contribute logic but no markup. A data-fetcher that exposes data, loading, and error as slot props is a classic example. In modern Vue, composables often replace renderless components for pure logic reuse because they avoid the extra component and slot indirection, but scoped slots remain the right tool when the logic must shape the template structure — virtualized lists being the canonical case. Conceptually they are Vue\'s equivalent of React\'s render props.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Scoped slots vs composables: composables share logic with less indirection and better typing; scoped slots are right when logic must drive template structure or you want a template-level API.',
      'Maximum flexibility for consumers vs a looser, harder-to-validate contract than typed props.',
    ],
    edgeCases: [
      'Named scoped slots require v-slot on <template>; default can be on the component.',
      'Slot content runs in parent scope plus injected slot props — a subtle dual-scope model.',
      'Forgetting to bind data on <slot> leaves slot props undefined.',
      'Deeply nested scoped slots reduce compiler optimisability and readability.',
    ],
    runtimeBehavior: [
      'Slot content compiles to a function of slot props, invoked by the child via <slot v-bind="props" />.',
      'Re-invoked on render, so content tracks both child-exposed data and parent reactivity.',
      'Renderless components delegate all vnodes to the parent through a single bound slot.',
    ],
    scalability: [
      'Scales presentation flexibility across a design system from one logic component.',
      'Pairs with virtualization so only visible rows invoke the scoped slot, keeping large lists fast.',
    ],
    productionConcerns: [
      'Document slot-prop shapes for consumers; an undocumented scoped-slot API is hard to use.',
      'Prefer composables for pure logic to avoid unnecessary component/slot overhead.',
      'Watch reactivity of slot-prop objects — unstable references cause extra re-renders.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Scoped slot = slot that passes data (slot props) child → parent.',
    'Child: <slot :item="x" :index="i" />.',
    'Parent default: v-slot="{ item, index }" on the component.',
    'Parent named: <template #name="{ item }">.',
    'Slot content compiles to a function of slot props.',
    'Inverts control: child owns data, parent owns presentation.',
    'Renderless component = template is just <slot v-bind="state" />.',
    'Vue equivalent of React render props.',
    'Prefer composables for pure logic reuse.',
    'Use scoped slots when logic must shape the template (e.g. virtual lists).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a component that exposes a `count` value (e.g. 42) to its default scoped slot.',
      hint: 'Bind :count on the <slot>.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <slot :count="42" />\n</template>\n\n<!-- usage -->\n<!-- <Counter v-slot="{ count }">Total: {{ count }}</Counter> -->',
        explanation: [
          'The child binds :count as a slot prop.',
          'The parent reads it via v-slot="{ count }".',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a List.vue that loops items and exposes each item + index to a scoped slot.',
      hint: 'Bind :item and :index inside the v-for.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps([\'items\'])\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i" />\n    </li>\n  </ul>\n</template>\n\n<!-- usage -->\n<!-- <List :items="rows" v-slot="{ item, index }">{{ index }}: {{ item.name }}</List> -->',
        explanation: [
          'The child owns iteration and exposes item/index per row.',
          'The parent destructures them to render each item its own way.',
          'One List renders any item shape the caller defines.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a renderless MousePosition component that tracks the cursor and exposes x/y via a scoped slot.',
      hint: 'Track mousemove in onMounted; template is just <slot :x :y />.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst x = ref(0), y = ref(0)\nfunction update(e) { x.value = e.clientX; y.value = e.clientY }\nonMounted(() => window.addEventListener(\'mousemove\', update))\nonUnmounted(() => window.removeEventListener(\'mousemove\', update))\n</script>\n<template>\n  <slot :x="x" :y="y" />\n</template>\n\n<!-- usage -->\n<!-- <MousePosition v-slot="{ x, y }">Cursor: {{ x }}, {{ y }}</MousePosition> -->',
        explanation: [
          'The component owns the mouse-tracking logic and cleanup.',
          'Its template is a single slot exposing x and y — no markup of its own.',
          'The parent decides how to display the coordinates.',
          'This is the renderless pattern; a composable (useMouse) is the modern alternative.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a DataProvider that fetches a URL and exposes { data, loading, error } via a scoped slot so the parent controls all rendering.',
      hint: 'Renderless: do the fetch, expose state through one <slot>.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst props = defineProps([\'url\'])\nconst data = ref(null), loading = ref(false), error = ref(null)\nwatchEffect(async () => {\n  loading.value = true; error.value = null\n  try { data.value = await (await fetch(props.url)).json() }\n  catch (e) { error.value = e }\n  finally { loading.value = false }\n})\n</script>\n<template>\n  <slot :data="data" :loading="loading" :error="error" />\n</template>\n\n<!-- usage -->\n<!-- <DataProvider url="/api/x" v-slot="{ data, loading, error }"> -->\n<!--   <Spinner v-if="loading" /> -->\n<!--   <Error v-else-if="error" /> -->\n<!--   <Result v-else :data="data" /> -->\n<!-- </DataProvider> -->',
        explanation: [
          'DataProvider owns fetching and exposes the async state as slot props.',
          'The parent decides exactly how loading/error/success render.',
          'No markup in the provider — pure logic delegated via the scoped slot.',
          'A useFetch composable is the modern equivalent for non-template-shaping reuse.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Scoped slots are an advanced topic that signals senior-level Vue understanding. They power reusable lists, tables, and headless components by inverting control of rendering — the kind of architectural flexibility that distinguishes strong Vue engineers.',
    howCompaniesAsk:
      'Service companies rarely go this deep. Product companies (Zoho, Flipkart, Razorpay) ask how scoped slots differ from regular slots and to build a reusable list/table. FAANG-level interviews probe the renderless pattern, the slot-as-function model, and when to choose composables over scoped slots.',
    whatInterviewersExpect:
      'They expect you to expose child data via slot props, destructure them in the parent, explain the inversion of control, build a renderless component, and reason about scoped slots vs composables.',
  },
}

export default scopedSlots
