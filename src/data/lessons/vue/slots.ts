import type { ConceptLesson } from '../../../types/lesson'

const slots: ConceptLesson = {
  // 1. Concept Summary
  slug: 'slots',
  name: 'Slots',
  category: 'components',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Slots let a component accept arbitrary template content from its parent — the foundation of flexible, composable layout components.',
    'Without slots, components could only be configured by props (data), not by injected markup, so reusable wrappers (cards, modals, layouts) would be impossible.',
    'Named and default slots are a guaranteed interview topic for any intermediate Vue role.',
    'Slots enable the powerful "content distribution" pattern that underpins component libraries and design systems.',
    'They are the prerequisite for scoped slots, headless components, and compound-component patterns.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A slot is like an empty picture frame — the frame is the same, but you decide which photo to put inside.',
    story: [
      'Imagine you buy a nice picture frame. The frame itself never changes — same wood, same glass, same stand.',
      'But the photo you slide into it is up to you: a dog one day, a beach another, your family the next.',
      'The frame provides the structure and the decoration; you provide the content that goes in the middle.',
      'A Vue slot is that empty middle of a component. The component gives you a styled, structured frame, and you slide in whatever content you want — text, buttons, even other components.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Props let a parent pass data into a component, but sometimes you want to pass whole chunks of HTML or other components instead.',
    'A slot is a placeholder inside a component\'s template where the parent\'s content gets inserted. The component decides where the hole is; the parent fills it.',
    'A component can have one default slot, or several named slots (like header, body, footer) so the parent can fill different regions.',
    'If the parent provides nothing, the component can show fallback content instead. This makes components reusable as flexible containers, not just data displays.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A slot is a content outlet in a child component where the parent injects template content. <slot /> marks the insertion point; named slots target specific regions.',
    how: 'The child places <slot /> (or <slot name="header" />) in its template. The parent puts content between the component\'s tags; for named slots it uses <template #header>. Fallback content inside <slot> shows when nothing is provided.',
    why: 'Slots let components define structure and styling while letting callers supply the actual content, enabling reusable wrappers like cards, modals, and layouts.',
    code: {
      label: 'Default and named slots',
      lang: 'vue',
      code: '<!-- Card.vue (child) -->\n<template>\n  <div class="card">\n    <header><slot name="title">Untitled</slot></header>\n    <div class="body"><slot /></div>\n  </div>\n</template>\n\n<!-- Parent -->\n<Card>\n  <template #title>My Heading</template>\n  <p>This goes in the default slot (body).</p>\n</Card>',
      explanation: [
        '<slot name="title"> is a named outlet; <slot /> is the default outlet.',
        '"Untitled" is fallback content shown if the title slot is empty.',
        'The parent fills #title with a heading and the default slot with a paragraph.',
        'The card owns the structure/styling; the parent owns the content.',
        'This is content distribution — the core purpose of slots.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A slot is a content-distribution outlet: a placeholder in a child component\'s template, rendered with <slot>, into which the parent injects template content. Slot content is compiled in the parent\'s scope but rendered at the child\'s slot location. Components support a default slot and multiple named slots (targeted with v-slot/#name), each able to declare fallback content. Internally, slots are passed to the child as a slots object of render functions keyed by name.',

  // 7. Internal Working
  internalWorking: [
    'When the parent template is compiled, content placed inside a child component tag is turned into slot render functions, keyed by slot name (default for unnamed content).',
    'These slot functions are passed to the child as part of its instance ($slots / setup context slots).',
    'In the child\'s render, each <slot name="x" /> calls the corresponding slot function and inserts the returned vnodes at that position; if absent, the slot\'s fallback children render instead.',
    'Slot content is compiled in the PARENT\'s lexical scope, so it can access the parent\'s data/components — not the child\'s internal state (unless via scoped slots).',
    'When the parent re-renders, slot functions are re-invoked, so slot content stays reactive to parent state.',
    'Named slots and the default slot are independent functions, allowing the child to place each in a different location of its template.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Parent supplies content      Child defines the holes
   ┌───────────────────────┐    ┌──────────────────────────┐
   │ <Card>                │    │ <div class="card">       │
   │   #title -> "Hello"   │──► │   <slot name="title"/>   │
   │   default -> <p>...   │──► │   <slot/>  (default)     │
   │ </Card>               │    │ </div>                   │
   └───────────────────────┘    └──────────────────────────┘
   content compiled in PARENT scope, rendered at CHILD's slot spot`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — default slot with fallback',
      lang: 'vue',
      code: '<!-- Button.vue -->\n<template>\n  <button class="btn"><slot>Click me</slot></button>\n</template>\n\n<!-- usage -->\n<Button>Save</Button>\n<Button />  <!-- shows fallback "Click me" -->',
      explanation: [
        '<slot>Click me</slot> defines a default outlet with fallback text.',
        'When the parent provides "Save", it replaces the fallback.',
        'An empty <Button /> shows the fallback "Click me".',
        'The button owns styling; the label is caller-supplied content.',
      ],
    },
    intermediate: {
      label: 'Intermediate — multiple named slots',
      lang: 'vue',
      code: '<!-- Layout.vue -->\n<template>\n  <div class="layout">\n    <header><slot name="header" /></header>\n    <main><slot /></main>\n    <footer><slot name="footer">© 2026</slot></footer>\n  </div>\n</template>\n\n<!-- usage -->\n<Layout>\n  <template #header><h1>Dashboard</h1></template>\n  <p>Main content here</p>\n  <template #footer>Custom footer</template>\n</Layout>',
      explanation: [
        'Three outlets: named header, default main, named footer.',
        'The parent fills each region with #header, default content, and #footer.',
        'The footer has fallback "© 2026" used when not provided.',
        '# is shorthand for v-slot:.',
        'This is the canonical reusable layout component pattern.',
      ],
    },
    advanced: {
      label: 'Advanced — conditional rendering based on slot presence',
      lang: 'vue',
      code: '<script setup>\nimport { useSlots } from \'vue\'\nconst slots = useSlots()\n</script>\n<template>\n  <div class="panel">\n    <header v-if="slots.header" class="panel-head">\n      <slot name="header" />\n    </header>\n    <div class="panel-body"><slot /></div>\n  </div>\n</template>',
      explanation: [
        'useSlots() exposes the slots object in <script setup>.',
        'slots.header is truthy only when the parent provided that slot.',
        'The header markup (and its padding) is skipped entirely when absent.',
        'This avoids rendering empty wrappers — a common real-world need.',
        'Lets a component adapt its structure to what content it receives.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable Modal with header/body/footer slots',
      lang: 'vue',
      code: '<!-- Modal.vue -->\n<script setup lang="ts">\ndefineProps<{ open: boolean }>()\nconst emit = defineEmits<{ close: [] }>()\n</script>\n<template>\n  <div v-if="open" class="overlay" @click.self="emit(\'close\')">\n    <div class="modal">\n      <header class="modal-head"><slot name="header" /></header>\n      <section class="modal-body"><slot /></section>\n      <footer class="modal-foot">\n        <slot name="footer">\n          <button @click="emit(\'close\')">Close</button>\n        </slot>\n      </footer>\n    </div>\n  </div>\n</template>\n\n<!-- usage -->\n<!-- <Modal :open="show" @close="show=false"> -->\n<!--   <template #header><h2>Confirm</h2></template> -->\n<!--   <p>Are you sure?</p> -->\n<!-- </Modal> -->',
      explanation: [
        'The Modal owns overlay/positioning/styling; callers supply content.',
        'Three slots let callers customise header, body, and footer.',
        'The footer falls back to a default Close button if none is given.',
        'This single component is reused for confirms, forms, alerts — all different content.',
        'Slots are why one modal serves the whole app.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a slot in Vue?',
      answer: 'A placeholder in a child component\'s template where the parent injects content. <slot /> marks the spot; the parent supplies content between the component tags.',
      explanation: 'Defining it as a content outlet and naming who supplies what is the core answer.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between props and slots?',
      answer: 'Props pass data (values) into a component; slots pass template content (markup/components). Use props for configuration values, slots for arbitrary content the component should render.',
      explanation: 'This data-vs-content distinction is a very common opening question.',
    },
    {
      level: 'intermediate',
      question: 'How do named slots work and what is the # shorthand?',
      answer: 'A child declares <slot name="header" />; the parent fills it with <template v-slot:header> or its shorthand <template #header>. Each named slot is an independent outlet.',
      explanation: 'Knowing the v-slot directive and the # shorthand shows hands-on familiarity.',
    },
    {
      level: 'intermediate',
      question: 'In whose scope is slot content compiled?',
      answer: 'Slot content is compiled in the PARENT\'s scope, so it can access parent data and components but not the child\'s internal state — unless the child exposes data via scoped slots.',
      explanation: 'The scoping rule is a key conceptual point that leads into scoped slots.',
    },
    {
      level: 'advanced',
      question: 'How do you render different structure depending on whether a slot was provided?',
      answer: 'Check the slots object — $slots.header in templates or useSlots() in script — and use v-if to conditionally render the wrapper, avoiding empty containers.',
      explanation: 'Demonstrates practical, real-world slot handling beyond the basics.',
    },
    {
      level: 'senior',
      question: 'How are slots represented internally and why does that matter for reactivity?',
      answer: 'Slots are passed to the child as a slots object of render functions keyed by name. Because they are functions invoked during the child\'s render, slot content re-evaluates with the parent\'s reactive state on re-render — so it stays reactive to the parent.',
      explanation: 'Connecting slots to render functions and reactivity is a senior-level insight.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a default slot and a named slot?',
    'How do you provide fallback content for a slot?',
    'In whose scope does slot content run, parent or child?',
    'How do you conditionally render based on slot presence?',
    'What are scoped slots and how do they differ from regular slots?',
    'How do dynamic slot names work? (v-slot:[name])',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting slot content to access the child\'s internal data.',
      why: 'Regular slot content is compiled in the parent scope and cannot see the child\'s state.',
      fix: 'Use scoped slots: the child binds data on <slot :item="x" /> and the parent receives it via v-slot="{ item }".',
    },
    {
      mistake: 'Forgetting fallback content and rendering empty wrappers.',
      why: 'A named slot with no content still renders its surrounding markup, leaving empty boxes.',
      fix: 'Provide fallback inside <slot> or conditionally render the wrapper with v-if on $slots.name.',
    },
    {
      mistake: 'Mixing up v-slot syntax (using it on the wrong element).',
      why: 'v-slot/# must be on a <template> tag (or directly on the component for the default slot).',
      fix: 'Use <template #name> for named slots; default-only content can be placed directly in the component.',
    },
    {
      mistake: 'Assuming multiple unnamed slots are allowed.',
      why: 'There is only one default (unnamed) slot; extra unnamed content all goes to it.',
      fix: 'Use named slots when you need multiple distinct regions.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Cards, modals, tables, and layout primitives expose named slots so consumers inject headers, footers, actions, and body content.' },
    { area: 'Vue', detail: 'App-wide layout shells use slots for page content, sidebars, and toolbars, keeping one structure with swappable content.' },
    { area: 'Nuxt', detail: 'Layouts use a default slot for page content (<slot /> in layout files); components expose slots for flexible composition.' },
    { area: 'SSR', detail: 'Slot content renders on the server within the child\'s structure; predictable slot usage keeps hydration clean.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Slots compile to render functions with no significant overhead beyond rendering the content itself.',
      'Conditionally rendering based on slot presence avoids unnecessary wrapper DOM.',
    ],
    bad: [
      'Passing heavy slot content that re-renders with the parent can re-evaluate on every parent update.',
      'Many always-present empty slots add minor render and DOM cost.',
    ],
    optimizations: [
      'Use v-if on $slots.name to skip rendering wrappers for absent slots.',
      'Keep slot content lean; move expensive logic into the providing component.',
      'Combine with v-memo for static slot content that rarely changes.',
      'Prefer named slots over duplicating components for each layout variant.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'template-syntax', 'props'],
    nextConcepts: ['scoped-slots', 'dynamic-components', 'compound-components', 'headless-components'],
    dependencyNote:
      'Slots extend components-basics with content distribution. They are the prerequisite for scoped-slots (data-passing slots) and underpin compound-components and headless-components patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a child component box with two labelled holes: header and default.',
      'Draw a parent supplying content arrows into each hole.',
      'Write <slot name="header" /> and <slot /> in the child.',
      'Write <template #header> and default content in the parent.',
      'Say: "Slots are content outlets. The child defines where content goes; the parent supplies it, compiled in the parent scope. Fallback shows when empty."',
    ],
    diagram: `   Child (frame)            Parent (content)
   ┌───────────────┐        <Card>
   │ <slot name=   │  ◄───   <template #title>Hi</template>
   │   "title"/>   │
   │ <slot/>       │  ◄───   <p>body</p>
   └───────────────┘        </Card>`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Slots are content outlets: placeholders in a child\'s template where the parent injects markup. <slot /> is the default outlet; <slot name="x" /> is a named one, filled with <template #x>. Slot content is compiled in the parent\'s scope, so it sees parent data, not the child\'s internals (that needs scoped slots). Slots can declare fallback content shown when nothing is provided. They turn components into flexible containers — cards, modals, layouts — where the component owns structure and the caller owns content.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Slots are Vue\'s content-distribution mechanism: they let a parent pass not just data but whole chunks of template content into a child component. Whereas props configure a component with values, slots let the component define structure and styling while the caller supplies the actual markup that fills it. In the child you place <slot /> wherever you want injected content to appear; that is the default slot. You can also declare named slots like <slot name="header" /> for multiple distinct regions, and the parent targets them with <template v-slot:header>, or the # shorthand, <template #header>. Any content placed directly between the component tags goes to the default slot. A slot can include fallback content between its tags, which renders when the parent provides nothing. A crucial conceptual point is scoping: slot content is compiled in the parent\'s scope, so it can use the parent\'s data and components but cannot see the child\'s internal state — to expose child data to the slot you need scoped slots, where the child binds values on the slot element and the parent destructures them. You can also react to whether a slot was provided by inspecting the slots object — $slots in the template or useSlots() in script — and conditionally rendering wrappers to avoid empty boxes. Internally, slots are passed to the child as an object of render functions keyed by name, invoked during the child\'s render, which is why slot content stays reactive to the parent\'s state. This is the pattern behind every reusable card, modal, and layout in a component library: one component owns the structure, and slots let it serve unlimited content variations.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Slots maximise flexibility but loosen the contract — callers can inject anything, which is powerful but harder to validate than typed props.',
      'Many named slots make a component very flexible but increase its API surface and documentation burden.',
    ],
    edgeCases: [
      'Slot content runs in parent scope — a frequent source of "why can\'t my slot see the child data" confusion.',
      'Empty named slots still render wrappers unless guarded with $slots checks.',
      'Dynamic slot names (#[name]) enable runtime slot targeting but reduce static analyzability.',
      'Default slot vs named slot precedence when content is ambiguous.',
    ],
    runtimeBehavior: [
      'Slots are render functions keyed by name passed to the child instance.',
      'They are re-invoked on the parent\'s re-render, keeping content reactive to parent state.',
      'Fallback children render only when the slot function is absent/empty.',
    ],
    scalability: [
      'Slot-based composition scales design systems by keeping structure in one component and content open-ended.',
      'Over-slotting a component can make it harder to reason about than splitting into smaller composed components.',
    ],
    productionConcerns: [
      'Document each slot\'s purpose and expected content for library consumers.',
      'Guard wrappers with $slots checks to avoid empty DOM and layout bugs.',
      'Watch SSR/hydration when slot content depends on parent-only client state.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Slots = content outlets; props = data inputs.',
    '<slot /> = default outlet; <slot name="x" /> = named.',
    'Fill named slots with <template #x> (shorthand for v-slot:x).',
    'Fallback content goes inside <slot>…</slot>.',
    'Slot content is compiled in the PARENT scope.',
    'Only one default (unnamed) slot per component.',
    'Inspect $slots / useSlots() to render conditionally.',
    'Child data in a slot requires scoped slots.',
    'Dynamic slot names: <template #[name]>.',
    'Slots = render functions, reactive to parent re-renders.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create an Alert.vue with a default slot and fallback text "Notice".',
      hint: 'Put fallback between <slot> tags.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <div class="alert"><slot>Notice</slot></div>\n</template>',
        explanation: [
          'The default slot renders parent content if given.',
          '"Notice" is shown when no content is provided.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create a Panel.vue with named header and footer slots plus a default body slot.',
      hint: 'Three <slot> elements, two named.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <section class="panel">\n    <header><slot name="header" /></header>\n    <div class="body"><slot /></div>\n    <footer><slot name="footer" /></footer>\n  </section>\n</template>\n\n<!-- usage -->\n<!-- <Panel> -->\n<!--   <template #header>Title</template> -->\n<!--   Body text -->\n<!--   <template #footer>Footer</template> -->\n<!-- </Panel> -->',
        explanation: [
          'header and footer are named outlets; the middle is the default slot.',
          'The parent fills each region with template #name or default content.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Render the header wrapper only when a header slot is actually provided.',
      hint: 'Use useSlots() and v-if.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { useSlots } from \'vue\'\nconst slots = useSlots()\n</script>\n<template>\n  <div class="card">\n    <header v-if="slots.header" class="head">\n      <slot name="header" />\n    </header>\n    <div class="body"><slot /></div>\n  </div>\n</template>',
        explanation: [
          'useSlots() exposes whether each slot was provided.',
          'v-if="slots.header" skips the header markup when absent.',
          'This prevents rendering an empty header wrapper.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a Tabs-like Toolbar.vue with a "left" and "right" named slot and a default slot in the centre, all in a flex row.',
      hint: 'Three slots positioned with flex.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <div class="toolbar">\n    <div class="left"><slot name="left" /></div>\n    <div class="center"><slot /></div>\n    <div class="right"><slot name="right" /></div>\n  </div>\n</template>\n<style scoped>\n.toolbar { display: flex; justify-content: space-between; align-items: center; }\n</style>\n\n<!-- usage -->\n<!-- <Toolbar> -->\n<!--   <template #left><Logo /></template> -->\n<!--   <SearchBar /> -->\n<!--   <template #right><UserMenu /></template> -->\n<!-- </Toolbar> -->',
        explanation: [
          'Three slots map to three flex regions: left, centre (default), right.',
          'The toolbar owns layout; callers inject any components into each region.',
          'Scoped flex styling keeps the structure consistent across uses.',
          'One reusable toolbar serves many pages with different content.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Slots are how Vue components become true composition building blocks. Mastering default, named, and conditional slots means you can build reusable layout and container components — the backbone of any design system — and you are ready for scoped slots and advanced patterns.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the props-vs-slots difference and named slot syntax. Product companies (Zoho, Flipkart, Razorpay) ask you to design a reusable card/modal with slots and explain slot scoping. FAANG-level interviews probe slot internals (render functions), conditional rendering, and the lead-in to scoped slots.',
    whatInterviewersExpect:
      'They expect you to use default and named slots, provide fallbacks, explain that slot content compiles in the parent scope, and conditionally render based on slot presence.',
  },
}

export default slots
