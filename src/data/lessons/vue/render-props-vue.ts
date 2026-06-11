import type { ConceptLesson } from '../../../types/lesson'

const renderPropsVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'render-props-vue',
  name: 'Render Props (Scoped Slots)',
  category: 'patterns',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Scoped slots are Vue\'s answer to the render-props pattern: they let a component own behavior and data while letting the consumer own the markup — the foundation of truly reusable, presentation-agnostic components.',
    'They are how headless components and flexible list/table/fetcher components work, so understanding them unlocks a whole class of reusable building blocks.',
    'Interviewers use scoped slots to test whether you understand inversion of control — who owns the data versus who owns the rendering.',
    'They solve real reuse problems (a data fetcher that does not dictate the UI, a list that does not dictate the row markup) without the wrapper-instance cost of HOCs.',
    'Knowing scoped slots versus regular slots, and scoped slots versus composables, is a frequent senior-level discussion that shows architectural judgment.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A scoped slot is a vending machine that hands you the ingredients and lets YOU decide what sandwich to make.',
    story: [
      'Imagine a magic machine that is really good at finding fresh ingredients — bread, cheese, tomatoes — but it has no idea what you like to eat.',
      'Instead of forcing a fixed sandwich on you, the machine hands you the ingredients on a tray and says: "Here you go — you make the sandwich however you want."',
      'You take the same ingredients and one friend makes a grilled cheese while another makes a salad. The machine did the hard work of finding the ingredients; each person decided the final dish.',
      'A scoped slot works like that: the component does the clever work (fetching, looping, tracking state) and hands the data to you, and YOU write the markup that shows it however you like.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal slot lets a parent drop some markup INTO a child component, but the parent gets no information from the child.',
    'A scoped slot is more powerful: the child passes data BACK to the slot content, so the parent can render using values the child computed (like the current item in a loop, or fetched data).',
    'This is Vue\'s version of the "render props" pattern from React: a component provides data and behavior, and the consumer provides the rendering.',
    'It is great for reusable components like lists, data fetchers, or toggles where the logic should be shared but the look should be decided by whoever uses it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Render props in Vue are implemented with scoped slots: a child component exposes data and methods to its slot content, and the parent supplies the template that renders them. This inverts control — the child owns logic, the consumer owns presentation.',
    how: 'The child renders <slot :data="value" :action="fn" /> to pass props up to the slot. The parent receives them with v-slot (or #default="{ data, action }") and writes markup using those slot props.',
    why: 'It lets you build one component whose behavior is reusable across any UI: the same fetcher, list, or toggle can render completely different markup depending on who uses it, without duplicating the logic.',
    code: {
      label: 'A reusable list with a scoped slot',
      lang: 'vue',
      code: '<!-- ItemList.vue: owns iteration, exposes each item -->\n<script setup>\ndefineProps({ items: { type: Array, required: true } })\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i" />\n    </li>\n  </ul>\n</template>\n\n<!-- Usage: the consumer decides how each item looks -->\n<!--\n<ItemList :items="users">\n  <template #default="{ item, index }">\n    {{ index + 1 }}. <strong>{{ item.name }}</strong> — {{ item.email }}\n  </template>\n</ItemList>\n-->',
      explanation: [
        'ItemList owns the structural logic: the loop, keys, and the <ul>/<li>.',
        'It passes each item and index back to the slot via <slot :item="item" :index="i" />.',
        'The consumer receives them with #default="{ item, index }" and writes any markup.',
        'One ItemList can now render user cards, product rows, or anything — logic reused, markup free.',
        'That data flowing from child to slot content is what makes it a scoped slot (render prop).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Scoped slots are Vue\'s realization of the render-props pattern. A slot is compiled to a function; a scoped slot is a function that the child invokes with an arguments object (the slot props), so the child controls when and with what data the slot content renders, while the parent supplies that content as a template bound via v-slot. This inverts control: the child encapsulates behavior, state, and data acquisition, and exposes them as slot props, while the consuming parent owns the presentation. Because slot content is a function called during the child\'s render with the child\'s reactive data, updates to that data re-invoke the slot, keeping the consumer\'s markup in sync. Scoped slots underpin headless components, flexible list/table renderers, and renderless data-fetching components, and they avoid the extra wrapper instance an HOC would introduce.',

  // 7. Internal Working
  internalWorking: [
    'The template compiler turns slot content into a render function stored on the child\'s $slots (in <script setup>, accessible via useSlots); a scoped slot is a function taking the slot-prop object.',
    'When the child renders, it calls that slot function — e.g. <slot :item="x" /> compiles to invoking $slots.default({ item: x }) — returning the parent-provided vnodes built with the child\'s data.',
    'Because the slot props come from the child\'s reactive state, when that state changes the child re-renders and re-invokes the slot function, so the consumer\'s markup reflects the new data automatically.',
    'The parent declares which slot props it wants via v-slot="{ item, index }" destructuring; these are just the function arguments, scoped to the slot content (hence "scoped").',
    'Multiple named scoped slots are separate functions on $slots (default, header, row, etc.), letting a component expose several rendering hooks with different data.',
    'No wrapper component instance is created (unlike an HOC) — the slot function runs within the existing parent/child relationship, so there is no extra instance overhead.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   CHILD (owns logic + data)                PARENT (owns markup)
   ┌──────────────────────────┐             ┌───────────────────────────┐
   │ for each item:           │  slot props │ <template #default=        │
   │   <slot :item :index /> ─┼───{item}───►│   "{ item, index }">       │
   │                          │             │   render however I want    │
   │ (calls the slot as a     │             │ </template>                │
   │  FUNCTION with data)     │◄── vnodes ──┤  returns markup            │
   └──────────────────────────┘             └───────────────────────────┘
        behavior reused                          presentation owned by consumer
        = INVERSION OF CONTROL (Vue's render prop)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — scoped slot vs regular slot',
      lang: 'vue',
      code: '<!-- Regular slot: parent gets NO data from child -->\n<!-- Panel.vue -->\n<template><section><slot /></section></template>\n\n<!-- Scoped slot: child passes data to the slot content -->\n<!-- MousePosition.vue -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nconst x = ref(0), y = ref(0)\nonMounted(() => window.addEventListener(\'mousemove\', (e) => { x.value = e.x; y.value = e.y }))\n</script>\n<template>\n  <slot :x="x" :y="y" />  <!-- exposes tracked position -->\n</template>\n\n<!-- Usage -->\n<!-- <MousePosition v-slot="{ x, y }">Cursor at {{ x }}, {{ y }}</MousePosition> -->',
      explanation: [
        'Panel uses a regular slot: content goes in, but the parent learns nothing from the child.',
        'MousePosition uses a scoped slot: it tracks the cursor and exposes x/y to the slot.',
        'The consumer renders whatever it wants with those reactive values.',
        'The defining difference is data flowing from child to slot content.',
        'MousePosition is a tiny headless/renderless component — logic only, no opinionated UI.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a renderless data fetcher',
      lang: 'vue',
      code: '<!-- Fetch.vue: does the fetching, renders nothing of its own -->\n<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst props = defineProps({ url: { type: String, required: true } })\nconst data = ref(null), error = ref(null), loading = ref(true)\nwatchEffect(async () => {\n  loading.value = true; error.value = null\n  try { data.value = await (await fetch(props.url)).json() }\n  catch (e) { error.value = e }\n  finally { loading.value = false }\n})\n</script>\n<template>\n  <slot :data="data" :error="error" :loading="loading" />\n</template>\n\n<!-- Usage: consumer owns the UI for each state -->\n<!--\n<Fetch url="/api/user" v-slot="{ data, loading, error }">\n  <p v-if="loading">Loading…</p>\n  <p v-else-if="error">Failed</p>\n  <UserCard v-else :user="data" />\n</Fetch>\n-->',
      explanation: [
        'Fetch encapsulates the loading/error/data logic and exposes all three via slot props.',
        'It renders no markup of its own — a "renderless" component.',
        'The consumer decides how to render loading, error, and success states.',
        'The same Fetch component powers any endpoint with any UI.',
        'This is the classic render-prop use case; note a useFetch composable can do the same logic — see the trade-offs.',
      ],
    },
    advanced: {
      label: 'Advanced — multiple named scoped slots (a table)',
      lang: 'vue',
      code: '<!-- DataTable.vue -->\n<script setup>\ndefineProps({ rows: Array, columns: Array })\n</script>\n<template>\n  <table>\n    <thead><tr>\n      <th v-for="c in columns" :key="c.key">\n        <slot name="header" :column="c">{{ c.label }}</slot>\n      </th>\n    </tr></thead>\n    <tbody>\n      <tr v-for="row in rows" :key="row.id">\n        <td v-for="c in columns" :key="c.key">\n          <slot name="cell" :row="row" :column="c">{{ row[c.key] }}</slot>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</template>\n\n<!-- Usage: customize only the price cell -->\n<!--\n<DataTable :rows="products" :columns="cols">\n  <template #cell="{ row, column }">\n    <PriceTag v-if="column.key === \'price\'" :amount="row.price" />\n    <span v-else>{{ row[column.key] }}</span>\n  </template>\n</DataTable>\n-->',
      explanation: [
        'DataTable owns the table structure and iteration, exposing header and cell as scoped slots.',
        'Each slot passes the relevant data (column, or row+column) to the consumer.',
        'Default slot content ({{ c.label }} / {{ row[c.key] }}) provides sensible fallbacks.',
        'Consumers override only the cells they care about — maximal reuse with full customization.',
        'Multiple named scoped slots are just multiple functions the child invokes with different data.',
      ],
    },
    realProject: {
      label: 'Real project — a headless toggle/disclosure',
      lang: 'vue',
      code: '<!-- Toggle.vue: behavior only -->\n<script setup>\nimport { ref } from \'vue\'\nconst on = ref(false)\nfunction toggle() { on.value = !on.value }\n</script>\n<template>\n  <slot :on="on" :toggle="toggle" />\n</template>\n\n<!-- Usage: drop into any design, consumer owns markup -->\n<!--\n<Toggle v-slot="{ on, toggle }">\n  <button :aria-expanded="on" @click="toggle">\n    {{ on ? \'Hide details\' : \'Show details\' }}\n  </button>\n  <section v-if="on"><slot-content/></section>\n</Toggle>\n-->',
      explanation: [
        'Toggle ships state (on) and behavior (toggle) but renders no opinionated UI.',
        'It exposes them through the default scoped slot.',
        'Consumers build any button/disclosure markup and wire aria attributes themselves.',
        'This headless pattern (à la Headless UI / VueUse) is built directly on scoped slots.',
        'The same behavior could be a useToggle composable — choose based on where reuse happens.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between a slot and a scoped slot?',
      answer: 'A regular slot lets the parent inject markup into the child but passes no data back. A scoped slot lets the child pass data to the slot content, so the parent can render using values the child computed.',
      explanation: 'The defining word is "scope" — data flows from child to slot content, enabling render-prop reuse.',
    },
    {
      level: 'beginner',
      question: 'How are render props expressed in Vue?',
      answer: 'Through scoped slots: the child does <slot :data="x" /> and the consumer receives it with v-slot="{ data }", controlling the markup.',
      explanation: 'Vue does not use React-style function-as-child; scoped slots are the idiomatic mechanism.',
    },
    {
      level: 'intermediate',
      question: 'What is a renderless (headless) component and how does it use scoped slots?',
      answer: 'A component that contains logic/state but renders no markup of its own, exposing everything through a scoped slot so the consumer owns the entire presentation — like a data fetcher or a toggle.',
      explanation: 'Connecting renderless components to scoped slots and to libraries like Headless UI shows depth.',
    },
    {
      level: 'intermediate',
      question: 'Why might you choose a scoped slot over hard-coding the markup in the component?',
      answer: 'To reuse the component\'s logic across different presentations. Hard-coded markup locks the component to one UI; a scoped slot lets one component (list, table, fetcher) render anything the consumer wants.',
      explanation: 'The point is reuse via inversion of control — the consumer owns the look.',
    },
    {
      level: 'advanced',
      question: 'When would you use a scoped slot versus a composable for sharing logic?',
      answer: 'Use a composable when the logic is consumed in script/setup or composed with other logic. Use a scoped slot when the reuse point is the template — you want to drop a component into markup that exposes data for rendering. Often both can express the same logic; pick by where it is consumed.',
      explanation: 'Senior signal: recognizing scoped slots and composables as overlapping tools chosen by consumption site.',
    },
    {
      level: 'senior',
      question: 'How do scoped slots work internally and what are their performance implications?',
      answer: 'Slot content compiles to a function; a scoped slot is that function invoked by the child with a slot-prop argument. It re-runs when the child re-renders, so the consumer markup stays reactive. Unlike HOCs, no extra wrapper instance is created. The cost is that the slot function executes on each relevant child re-render, so heavy slot content can add work; keep slot content lean and key lists properly.',
      explanation: 'Demonstrates the function-call model, the reactivity link, and the no-wrapper-instance advantage over HOCs.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you provide default content for a scoped slot?',
    'Can a component have multiple named scoped slots? Give an example.',
    'How do scoped slots compare to higher-order components?',
    'How do you type scoped slot props in TypeScript?',
    'What is the difference between v-slot, #default, and slot-scope (legacy)?',
    'When is a composable a better choice than a renderless component?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing scoped slots with regular slots and expecting data without exposing it.',
      why: 'A regular <slot /> passes no data; the consumer cannot access child state, so bindings are undefined.',
      fix: 'Bind the data on the slot tag (<slot :item="item" />) and destructure it with v-slot.',
    },
    {
      mistake: 'Using a renderless component when a composable would be simpler.',
      why: 'If the logic is consumed in setup (not the template), a renderless component adds an unnecessary component layer.',
      fix: 'Use a composable for logic consumed in script; reserve scoped slots for template-level rendering reuse.',
    },
    {
      mistake: 'Putting heavy computation directly inside slot content.',
      why: 'Slot content re-runs on relevant child re-renders, so expensive work there runs repeatedly.',
      fix: 'Move heavy work into computeds/composables and keep slot markup lean; key lists correctly.',
    },
    {
      mistake: 'Forgetting default slot content, so consumers must always provide a template.',
      why: 'Without a fallback, omitting the slot renders nothing, surprising consumers.',
      fix: 'Provide sensible default content inside the <slot> tag for the common case.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Headless UI Vue and Radix Vue expose state/behavior through scoped slots so consumers fully control markup and styling across design systems.' },
    { area: 'Vue', detail: 'Data tables, lists, and virtual scrollers (e.g. Element Plus, vue-virtual-scroller) use named scoped slots for header/row/cell so consumers customize rendering.' },
    { area: 'VueUse', detail: 'VueUse ships renderless components (e.g. OnClickOutside, UseMouse) alongside composables, the component-form built on scoped slots.' },
    { area: 'Nuxt', detail: 'Renderless/async components and data wrappers use scoped slots to expose pending/error/data states the page renders however it wants.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'No wrapper component instance is created (unlike HOCs), avoiding that overhead.',
      'One logic component can serve many UIs, eliminating duplicated logic and its render cost.',
    ],
    bad: [
      'Slot content re-executes on relevant child re-renders; heavy slot markup repeats that work.',
      'Deeply nested scoped slots can make render dependencies harder to reason about and optimize.',
    ],
    optimizations: [
      'Keep slot content lean; push expensive computation into computeds/composables.',
      'Key lists rendered through scoped slots correctly to enable efficient patching.',
      'Prefer a composable when logic is consumed in setup to avoid an extra component layer.',
      'Provide default slot content so the common case needs no consumer markup.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['scoped-slots', 'slots', 'component-design-patterns'],
    nextConcepts: ['headless-components', 'composables', 'higher-order-components-vue'],
    dependencyNote:
      'Render props in Vue are scoped slots, so this builds directly on slots/scoped-slots and is one branch of the component-design-patterns family. It leads into headless components (built on it) and into composables and HOCs as alternative logic-reuse mechanisms.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'State the equivalence: "render props in Vue = scoped slots".',
      'Draw the child doing <slot :item :index /> — note "calls the slot as a function with data".',
      'Draw the parent receiving #default="{ item, index }" and rendering custom markup.',
      'Label the arrows: data flows child → slot content; vnodes flow back.',
      'Call it inversion of control: child owns logic, consumer owns presentation.',
      'Contrast with HOC (extra wrapper instance) and composable (logic for setup) as alternatives.',
    ],
    diagram: `  CHILD: <slot :item="x" :index="i" />   ← calls slot(fn) with data
                 │ data ▲ vnodes
                 ▼      │
  PARENT: <template #default="{ item, index }"> custom markup </template>
        child owns LOGIC • consumer owns MARKUP
        (no wrapper instance, unlike HOC)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Render props in Vue are scoped slots: the child exposes data and methods via <slot :data="x" /> and the consumer renders them with v-slot="{ data }". This inverts control — the child owns logic and data, the consumer owns the markup — enabling reusable lists, tables, fetchers, and headless components. Internally slot content is a function the child calls with slot props, staying reactive, with no wrapper instance like an HOC. Choose scoped slots when reuse is in the template; choose a composable when it is in setup.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In Vue, the render-props pattern is implemented with scoped slots. A regular slot just lets a parent drop markup into a child and the parent learns nothing from the child. A scoped slot is the powerful version: the child passes data back to the slot content, so the consumer can render using values the child computed. Mechanically, the child renders something like <slot :item="item" :index="i" />, and the consumer receives those with v-slot, for example template hash-default equals { item, index }, and writes whatever markup it wants. The big idea is inversion of control: the child encapsulates the behavior, the state, and the data acquisition, and the consumer owns the presentation. That is exactly what you want for reusable building blocks. A list component can own the iteration and keys but let each consumer decide how a row looks. A renderless data-fetcher can own the loading, error, and data logic and expose all three as slot props, rendering none of its own markup, so the same fetcher powers any endpoint with any UI. A headless toggle can expose an `on` state and a `toggle` method and let the consumer build any button. Internally this works because slot content compiles to a function; a scoped slot is that function, and the child invokes it with the slot-prop object during its render. Because the data comes from the child\'s reactive state, when that state changes the child re-renders and re-invokes the slot, so the consumer\'s markup stays in sync automatically. A nice property compared to higher-order components is that no extra wrapper instance is created — the slot function just runs in the existing relationship. The senior nuance is when to use a scoped slot versus a composable, since both can share logic. I use a composable when the logic is consumed in script or setup or composed with other logic, and a scoped slot when the reuse point is the template and I want to drop a component into markup that exposes data for rendering. Often the same logic can be delivered both ways, and many libraries like VueUse ship exactly that — a composable and a matching renderless component built on a scoped slot.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Scoped slots (template-level reuse, consumer owns markup) vs composables (setup-level reuse, consumer owns everything programmatically) — overlapping; choose by consumption site.',
      'Scoped slots vs HOCs: scoped slots avoid an extra wrapper instance and forward nothing implicitly, but HOCs can transparently inject props — scoped slots are usually preferable in Vue.',
      'Flexibility vs convenience: exposing many slot props maximizes customization but creates a wider contract consumers must learn and you must keep stable.',
    ],
    edgeCases: [
      'TypeScript typing of slot props requires defineSlots (Vue 3.3+) or generics so consumers get typed v-slot destructuring.',
      'Conditional slots: a child must guard when a named scoped slot is absent (check $slots.name) to provide fallbacks.',
      'Reactivity: slot props must be reactive sources from the child; passing a destructured plain value can lose reactivity.',
      'Heavy slot content re-runs on child re-render; large lists need correct keys and lean templates.',
    ],
    runtimeBehavior: [
      'Slot content is a function on $slots invoked during the child render with the slot-prop argument.',
      'Updates to the child\'s reactive slot data re-invoke the slot, propagating to consumer markup.',
      'No wrapper component instance is created, so there is no HOC-style instance/attr-forwarding overhead.',
    ],
    scalability: [
      'A small set of well-documented scoped-slot contracts (list/table/fetcher) scales a UI toolkit across many features.',
      'Named scoped slots let one complex component (table) absorb many customization needs without forking it.',
      'Pairing a composable with a renderless component scales logic reuse for both script and template consumers.',
    ],
    productionConcerns: [
      'Document each scoped slot\'s exposed props as a stable contract; changing them is a breaking change for consumers.',
      'Provide default slot content so the common case works without consumer markup.',
      'Watch performance of slot content in large lists; keep it lean and keyed.',
      'Prefer composables for pure logic reuse to avoid an unnecessary component layer when the template is not the reuse point.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Render props in Vue = scoped slots.',
    'Scoped slot: child passes data to slot content via <slot :x="x" />.',
    'Consumer reads it with v-slot="{ x }" (or #default="{ x }").',
    'Regular slot = no data back; scoped slot = data flows child → content.',
    'Inversion of control: child owns LOGIC, consumer owns MARKUP.',
    'Renderless/headless component = logic only, all output via scoped slot.',
    'Slot content compiles to a FUNCTION the child calls with slot props.',
    'Stays reactive: child re-render re-invokes the slot.',
    'No wrapper instance (advantage over HOCs).',
    'Multiple named scoped slots = multiple functions (header/cell/row).',
    'Use a composable when reuse is in setup; scoped slot when reuse is in the template.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a List component that loops over items and exposes each item to a scoped slot.',
      hint: 'Use <slot :item="item" /> inside the v-for.',
      solution: {
        lang: 'vue',
        code: '<!-- List.vue -->\n<script setup>\ndefineProps({ items: { type: Array, required: true } })\n</script>\n<template>\n  <ul>\n    <li v-for="(item, i) in items" :key="i">\n      <slot :item="item" :index="i" />\n    </li>\n  </ul>\n</template>',
        explanation: [
          'The component owns iteration and keys.',
          'It exposes item and index to the slot, so the consumer owns each item\'s markup.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a renderless MouseTracker that exposes the cursor x/y via a scoped slot.',
      hint: 'Track position in onMounted; expose via <slot :x :y />.',
      solution: {
        lang: 'vue',
        code: '<!-- MouseTracker.vue -->\n<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst x = ref(0), y = ref(0)\nfunction move(e) { x.value = e.clientX; y.value = e.clientY }\nonMounted(() => window.addEventListener(\'mousemove\', move))\nonUnmounted(() => window.removeEventListener(\'mousemove\', move))\n</script>\n<template>\n  <slot :x="x" :y="y" />\n</template>',
        explanation: [
          'The component owns the mouse-tracking logic and cleanup.',
          'It renders nothing of its own — it exposes x/y via the scoped slot.',
          'Consumers render the position however they like.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create a renderless Fetch component that exposes data, loading, and error for a url prop.',
      hint: 'watchEffect on the url; expose all three states via the slot.',
      solution: {
        lang: 'vue',
        code: '<!-- Fetch.vue -->\n<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst props = defineProps({ url: { type: String, required: true } })\nconst data = ref(null), error = ref(null), loading = ref(true)\nwatchEffect(async () => {\n  loading.value = true; error.value = null\n  try { const r = await fetch(props.url); data.value = await r.json() }\n  catch (e) { error.value = e }\n  finally { loading.value = false }\n})\n</script>\n<template>\n  <slot :data="data" :loading="loading" :error="error" />\n</template>',
        explanation: [
          'Fetch owns the loading/error/data lifecycle and re-fetches when the url changes.',
          'It exposes all three states through the scoped slot.',
          'The consumer renders loading/error/success markup however it wants.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Show the same toggle logic as BOTH a renderless component (scoped slot) and a composable, and say when to use each.',
      hint: 'Same ref+toggle, two delivery mechanisms.',
      solution: {
        lang: 'vue',
        code: '<!-- Toggle.vue (renderless / scoped slot) -->\n<script setup>\nimport { ref } from \'vue\'\nconst on = ref(false)\nconst toggle = () => (on.value = !on.value)\n</script>\n<template><slot :on="on" :toggle="toggle" /></template>\n\n<!-- useToggle.js (composable) -->\n<!--\nimport { ref } from \'vue\'\nexport function useToggle(initial = false) {\n  const on = ref(initial)\n  const toggle = () => (on.value = !on.value)\n  return { on, toggle }\n}\n-->\n<!-- Renderless: when reuse happens in the TEMPLATE (drop <Toggle v-slot>).\n     Composable: when the logic is consumed in SETUP / composed further. -->',
        explanation: [
          'Both package identical logic; the difference is the delivery mechanism.',
          'The renderless component is consumed declaratively in templates via a scoped slot.',
          'The composable is consumed in script/setup and composes with other logic.',
          'Pick by where the reuse point is, not by which is "better".',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Scoped slots are the mechanism behind every flexible, reusable Vue component — lists, tables, fetchers, and headless UI. Understanding them, and how they relate to composables and HOCs, signals real command of component composition and inversion of control.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the slot vs scoped-slot difference. Product companies (Zoho, Flipkart, Razorpay) ask you to build a renderless list/fetcher or a customizable table with named scoped slots. FAANG-level interviews probe the internal function-call model, scoped slots vs composables vs HOCs, and reactivity/performance implications.',
    whatInterviewersExpect:
      'They expect you to equate render props with scoped slots, expose data via <slot :x> and consume with v-slot, build a renderless component, explain inversion of control and the function-call internals, and choose between scoped slots and composables by consumption site.',
  },
}

export default renderPropsVue
