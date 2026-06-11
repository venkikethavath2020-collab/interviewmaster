import type { ConceptLesson } from '../../../types/lesson'

const componentsBasics: ConceptLesson = {
  // 1. Concept Summary
  slug: 'components-basics',
  name: 'Components Basics',
  category: 'components',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Components are the unit of reuse in Vue — every real app is a tree of components, so this is the concept everything else builds on.',
    'They let you split a huge UI into small, named, testable pieces that each own their template, logic, and styles.',
    'Understanding the parent→child data flow (props down) and child→parent communication (events up) is the backbone of Vue architecture interviews.',
    'Poor component boundaries are the #1 cause of unmaintainable Vue apps — knowing how to register, nest, and compose them is a daily skill.',
    'Interviewers use this to check whether you think in components or still write one giant template.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A component is like a LEGO brick — a small reusable piece you snap together to build something big.',
    story: [
      'Imagine you are building a LEGO castle. You do not carve the whole castle out of one giant block — that would be impossible to change later.',
      'Instead you use small bricks: a window brick, a door brick, a tower brick. Each brick is made once and you can use it many times.',
      'If you want ten windows, you just snap in the same window brick ten times instead of building each one from scratch.',
      'A Vue component is exactly that kind of brick for a web page. You build a "button" or a "card" once, then reuse it everywhere, and the whole page is just bricks snapped together.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A web page can be broken into repeating parts: a header, a list of cards, a footer. A component is a self-contained chunk of UI that owns its own HTML, its own logic, and its own look.',
    'You give the component a name and then use it like a custom HTML tag, e.g. <UserCard />. Vue swaps that tag for the component\'s actual content when it renders.',
    'Components can live inside other components, forming a tree with one root. Parents pass data down, children send messages back up.',
    'The big win is reuse and isolation: fix or restyle the card in one place and every place that uses it updates.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Vue component is a reusable, self-contained instance with its own template, reactive state, and behaviour, used in another template as a custom element.',
    how: 'You define a component (usually a Single-File Component, .vue), import it into a parent, and use it as a tag. The parent passes data via props and listens for events the child emits.',
    why: 'It turns a sprawling UI into composable, named building blocks that are easier to read, test, reuse, and reason about in isolation.',
    code: {
      label: 'A parent using a child component',
      lang: 'vue',
      code: '<!-- Greeting.vue (child) -->\n<script setup>\ndefineProps([\'name\'])\n</script>\n<template>\n  <p>Hello, {{ name }}!</p>\n</template>\n\n<!-- App.vue (parent) -->\n<script setup>\nimport Greeting from \'./Greeting.vue\'\n</script>\n<template>\n  <Greeting name="Sam" />\n  <Greeting name="Riya" />\n</template>',
      explanation: [
        'Greeting.vue is a child component that declares one prop, `name`.',
        'App.vue imports it and uses it as a custom tag <Greeting>.',
        'The same component is reused twice with different prop values.',
        'Each <Greeting> renders its own isolated paragraph — that is component reuse.',
        'No registration code is needed: in <script setup>, importing a component makes it available in the template automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Vue component is a reusable, encapsulated instance that bundles a render function (compiled from a template), its own reactive state, lifecycle, props interface, and emitted events. Components are organised into a single-rooted tree; data flows one-way down via props and back up via events. Each usage of a component creates a distinct component instance with its own scope, so state is isolated per instance unless deliberately shared.',

  // 7. Internal Working
  internalWorking: [
    'When you import and reference a component in a template, the Vue compiler turns <Greeting name="Sam" /> into a createVNode/h() call that captures the component definition and a props object.',
    'On mount, Vue creates a component instance for each usage: it runs setup() (or <script setup>), establishes the reactive scope, and resolves props passed from the parent.',
    'The instance produces a render function whose output is a subtree of virtual DOM nodes; child component vnodes nest inside the parent vnode tree.',
    'Vue mounts that vnode tree to real DOM, running lifecycle hooks (beforeMount/mounted) per instance in child-then-parent order for mounted.',
    'When a prop changes in the parent, Vue re-renders the parent, diffs the new child vnode against the old one, and patches only the child instance — it is not destroyed and recreated.',
    'Each instance keeps its own reactivity effects and event-listener registrations, so two usages of the same component never share local state.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `            App (root component)
                  │
        ┌─────────┴──────────┐
        ▼                    ▼
    Header              ProductList
      │                      │
      ▼              ┌───────┼────────┐
   NavBar            ▼       ▼        ▼
                  Product  Product  Product   ← same component, 3 instances

   props ↓ flow down            events ↑ bubble up
   (parent → child)             (child → parent via emit)`,

  // 9. Memory Visualization (omitted — not memory/reactivity-graph focused)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — defining and using a component',
      lang: 'vue',
      code: '<!-- Avatar.vue -->\n<script setup>\ndefineProps([\'src\'])\n</script>\n<template>\n  <img class="avatar" :src="src" alt="avatar" />\n</template>\n\n<!-- usage in a parent -->\n<script setup>\nimport Avatar from \'./Avatar.vue\'\n</script>\n<template>\n  <Avatar src="/u/1.png" />\n</template>',
      explanation: [
        'Avatar is a tiny presentational component with a single prop.',
        'It is imported and used as <Avatar> in the parent.',
        '`:src="src"` binds the incoming prop to the real <img> src attribute.',
        'This component can now be dropped anywhere an avatar is needed.',
      ],
    },
    intermediate: {
      label: 'Intermediate — nesting and reuse with a list',
      lang: 'vue',
      code: '<!-- TodoItem.vue -->\n<script setup>\ndefineProps([\'text\', \'done\'])\n</script>\n<template>\n  <li :class="{ done }">{{ text }}</li>\n</template>\n\n<!-- TodoList.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport TodoItem from \'./TodoItem.vue\'\nconst todos = ref([\n  { id: 1, text: \'Learn components\', done: true },\n  { id: 2, text: \'Build an app\', done: false },\n])\n</script>\n<template>\n  <ul>\n    <TodoItem\n      v-for="t in todos"\n      :key="t.id"\n      :text="t.text"\n      :done="t.done"\n    />\n  </ul>\n</template>',
      explanation: [
        'TodoList composes many TodoItem instances via v-for.',
        'Each item gets its own props and renders independently.',
        '`:key="t.id"` gives Vue a stable identity per item for efficient patching.',
        'The list owns the data; each item is a dumb, reusable presentational child.',
        'Changing TodoItem\'s look updates every row at once — reuse in action.',
      ],
    },
    advanced: {
      label: 'Advanced — local component state is isolated per instance',
      lang: 'vue',
      code: '<!-- Counter.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n<template>\n  <button @click="count++">Count: {{ count }}</button>\n</template>\n\n<!-- App.vue -->\n<script setup>\nimport Counter from \'./Counter.vue\'\n</script>\n<template>\n  <Counter />\n  <Counter />\n  <Counter />\n</template>',
      explanation: [
        'Three <Counter> tags create three separate component instances.',
        'Each instance has its OWN `count` ref — clicking one does not affect the others.',
        'This proves component state is per-instance, not shared by the definition.',
        'If you needed shared state you would lift it to the parent or a store (Pinia).',
        'A classic interview gotcha: candidates assume the count is shared; it is not.',
      ],
    },
    realProject: {
      label: 'Real project — a product card on an e-commerce grid',
      lang: 'vue',
      code: '<!-- ProductCard.vue -->\n<script setup>\ndefineProps([\'product\'])\nconst emit = defineEmits([\'add-to-cart\'])\n</script>\n<template>\n  <article class="card">\n    <img :src="product.image" :alt="product.name" />\n    <h3>{{ product.name }}</h3>\n    <p>{{ product.price }}</p>\n    <button @click="emit(\'add-to-cart\', product.id)">Add to cart</button>\n  </article>\n</template>\n\n<!-- ProductGrid.vue -->\n<script setup>\nimport ProductCard from \'./ProductCard.vue\'\ndefineProps([\'products\'])\nfunction handleAdd(id) { /* update cart store */ }\n</script>\n<template>\n  <div class="grid">\n    <ProductCard\n      v-for="p in products"\n      :key="p.id"\n      :product="p"\n      @add-to-cart="handleAdd"\n    />\n  </div>\n</template>',
      explanation: [
        'ProductCard is reused for every product in the catalogue.',
        'Data flows down via the `product` prop; the click flows up via the add-to-cart event.',
        'The grid owns the list and decides what happens when a card is acted on.',
        'This split (dumb card / smart grid) is the standard real-world component pattern.',
        'Restyling the card or fixing a bug touches exactly one file.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a component in Vue?',
      answer: 'A reusable, self-contained instance with its own template, state, and behaviour that you use as a custom tag inside another template.',
      explanation: 'A solid answer names the three ideas: reuse, encapsulation, and that each usage is an isolated instance.',
    },
    {
      level: 'beginner',
      question: 'How does a parent component pass data to a child?',
      answer: 'Through props: the child declares props with defineProps, and the parent binds values to them as attributes, e.g. <Child :name="user.name" />.',
      explanation: 'Interviewers want the phrase "props down" and that the binding is one-way from parent to child.',
    },
    {
      level: 'intermediate',
      question: 'If you use the same component three times, do they share state?',
      answer: 'No. Each usage creates a separate instance with its own reactive scope, so local refs/reactive state are independent.',
      explanation: 'This separates people who understand instances from those who think a component is a singleton.',
    },
    {
      level: 'intermediate',
      question: 'How does a child communicate back to its parent?',
      answer: 'By emitting events with defineEmits/emit; the parent listens with @event-name. Data flow stays one-way: props down, events up.',
      explanation: 'The key principle is unidirectional data flow — children never mutate props directly.',
    },
    {
      level: 'advanced',
      question: 'What does the Vue compiler do with a component tag like <Greeting name="Sam" />?',
      answer: 'It compiles it to a createVNode/h() call referencing the component definition and a props object; at runtime Vue creates an instance, runs setup, resolves props, and renders its vnode subtree into the parent tree.',
      explanation: 'Strong answers connect the template tag to the vdom and the per-instance setup lifecycle.',
    },
    {
      level: 'senior',
      question: 'How do you decide where to draw component boundaries in a large app?',
      answer: 'Split by responsibility and reuse: isolate repeated UI, separate smart (data/stateful) from dumb (presentational) components, keep components small and single-purpose, and avoid prop-drilling by lifting state or using provide/inject or a store.',
      explanation: 'Senior signal: architectural judgement about cohesion, reuse, and data flow rather than just syntax.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a component and a Single-File Component (.vue)?',
    'How do you register a component globally vs locally, and when would you do each?',
    'Why must a component template have a single root in Vue 2 but can have multiple roots in Vue 3?',
    'How do props and events keep data flow unidirectional?',
    'What is the difference between a presentational (dumb) and a container (smart) component?',
    'How do you reuse logic across components without duplicating it? (composables)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming all usages of one component share the same state.',
      why: 'Each usage is a distinct instance with its own reactive scope, so a ref in one is not the same ref in another.',
      fix: 'Lift shared state to a common parent (props/events) or a store (Pinia) when you genuinely need sharing.',
    },
    {
      mistake: 'Mutating a prop inside the child to "update the parent".',
      why: 'Props are one-way; mutating them breaks the data-flow contract and triggers warnings, and changes can be overwritten on re-render.',
      fix: 'Emit an event so the parent updates the source of truth, or use v-model for two-way binding.',
    },
    {
      mistake: 'Building one giant component with hundreds of lines and no children.',
      why: 'It becomes unreadable, untestable, and impossible to reuse.',
      fix: 'Extract repeated or self-contained UI into small named components with clear prop/event interfaces.',
    },
    {
      mistake: 'Using PascalCase tags but forgetting to import/register the component.',
      why: 'Vue cannot resolve an unknown tag and renders nothing or warns about an unregistered component.',
      fix: 'In <script setup>, just import it; with the Options API, register it locally in components or globally on the app.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Apps are component trees: layout, route views, and reusable widgets (buttons, modals, cards) are all components composed via props and events.' },
    { area: 'Component library', detail: 'Design systems ship a catalogue of base components (Button, Input, Dialog) with documented prop/event APIs that product teams compose.' },
    { area: 'Nuxt', detail: 'Auto-imports components from the components/ directory so you can use them without manual imports; pages and layouts are themselves components.' },
    { area: 'SSR', detail: 'The same component tree renders to an HTML string on the server then hydrates on the client; clean component boundaries keep hydration predictable.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Small, well-bounded components let Vue patch only the subtree that changed instead of a whole page.',
      'Reused components share one compiled render function, keeping bundle and memory cost low.',
    ],
    bad: [
      'Over-splitting into thousands of trivial components adds instance and vnode overhead.',
      'Passing large objects as props that change every render forces unnecessary child re-renders.',
    ],
    optimizations: [
      'Give v-for components a stable :key so Vue reuses instances instead of recreating them.',
      'Lazy-load heavy, rarely-shown components with defineAsyncComponent to shrink the initial bundle.',
      'Keep props stable (avoid creating new object/array literals inline) to reduce child re-renders.',
      'Use v-once or v-memo on static or rarely-changing subtrees.',
    ],
  },

  // 16. Security Considerations (omitted — no specific security angle for basics)

  // 17. Related Concepts
  related: {
    prerequisites: ['declarative-rendering', 'template-syntax', 'single-file-components'],
    nextConcepts: ['props', 'component-events', 'slots', 'component-registration'],
    dependencyNote:
      'Components build on declarative rendering and template syntax. Once you can define and nest components, the immediate next steps are props (data in), component-events (messages out), and slots (content injection).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a single box labelled App as the root of the tree.',
      'Branch it into two child boxes (e.g. Header and List).',
      'Under List, draw three identical Item boxes to show reuse and per-instance state.',
      'Draw a down-arrow labelled "props" and an up-arrow labelled "events" between a parent and child.',
      'Say: "Each box is an isolated instance; parents pass data down via props, children send messages up via events — one-way flow."',
    ],
    diagram: `        App
       /    \\
   Header    List
              |
        +-----+-----+
       Item  Item  Item   (3 instances, isolated state)
       props ↓   events ↑`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A component is a reusable, self-contained piece of UI with its own template, state, and behaviour, used as a custom tag. Apps are a single-rooted tree of components. Data flows one way: props down from parent to child, events up from child to parent. Each usage of a component is a separate instance with isolated state, so reusing a component three times gives three independent copies. Good apps are made of small, single-purpose components.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In Vue, a component is the fundamental unit of reuse — a self-contained instance that bundles its own template, reactive state, lifecycle, and behaviour, and that you use in other templates as a custom element like <UserCard />. A whole application is a tree of components with a single root; the parent passes data down to children through props, and children communicate back up by emitting events. This unidirectional data flow — props down, events up — is what keeps Vue apps predictable. A crucial point that trips people up is that every usage of a component creates a distinct instance with its own scope: if I render <Counter /> three times, each has its own count, so clicking one does not change the others. Under the hood, the compiler turns each component tag into a createVNode call; at runtime Vue creates an instance per usage, runs its setup, resolves props, and renders its vnode subtree into the parent tree, patching only what changed when props update. The practical value is enormous: I split a sprawling UI into small named pieces I can build, test, and restyle in isolation, then compose them. Good component design means drawing boundaries by responsibility and reuse — separating smart container components from dumb presentational ones, and lifting shared state to a parent or a store rather than duplicating it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Granularity: many tiny components maximise reuse but add instance/vnode overhead and prop-drilling; fewer large ones are simpler but harder to reuse and test.',
      'Local state vs lifted/shared state: local keeps components decoupled; lifting enables coordination but couples siblings to a parent or store.',
    ],
    edgeCases: [
      'Recursive components (a tree node rendering itself) need a name and a base case to avoid infinite render loops.',
      'Conditionally rendered components are destroyed/recreated unless wrapped in KeepAlive, which preserves their state.',
      'Multi-root (fragment) components in Vue 3 mean attribute fallthrough targets are ambiguous without an explicit binding.',
    ],
    runtimeBehavior: [
      'Patching reuses the same instance when the component type and key match; changing the key forces full teardown and remount.',
      'Mounted hooks run children-first then parent; updated/unmounted ordering matters for cleanup correctness.',
      'Each instance owns its reactivity effects, so per-instance state never leaks across usages.',
    ],
    scalability: [
      'Large component trees benefit from code-splitting via async components so initial bundles stay small.',
      'Deep prop-drilling does not scale — introduce provide/inject or a store before the chain gets long.',
    ],
    productionConcerns: [
      'Inconsistent component APIs across a codebase slow teams down — enforce conventions with a base/component library.',
      'Unstable keys in lists cause subtle state-bleed bugs where the wrong instance keeps state.',
      'Watch hydration mismatches in SSR when component output differs between server and client.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Component = reusable, self-contained UI instance (template + state + behaviour).',
    'Use it as a custom tag: <MyComponent />.',
    'Apps are a single-rooted tree of components.',
    'Data flow: props DOWN, events UP (one-way).',
    'Each usage = a separate instance with isolated state.',
    'In <script setup>, importing a component registers it for the template.',
    'Vue 3 allows multiple root nodes; Vue 2 required exactly one.',
    'Give v-for components a stable :key.',
    'Never mutate props in the child — emit an event or use v-model.',
    'Split by responsibility: smart (data) vs dumb (presentational).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Badge component that takes a `label` prop and renders it inside a <span class="badge">.',
      hint: 'Declare the prop with defineProps and interpolate it.',
      solution: {
        lang: 'vue',
        code: '<!-- Badge.vue -->\n<script setup>\ndefineProps([\'label\'])\n</script>\n<template>\n  <span class="badge">{{ label }}</span>\n</template>',
        explanation: [
          'defineProps([\'label\']) declares the incoming prop.',
          'The template interpolates it inside a styled span.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a UserList parent that renders a UserCard child for each user in an array, passing the user object as a prop.',
      hint: 'Use v-for with a stable :key and bind :user.',
      solution: {
        lang: 'vue',
        code: '<!-- UserCard.vue -->\n<script setup>\ndefineProps([\'user\'])\n</script>\n<template>\n  <li>{{ user.name }} — {{ user.email }}</li>\n</template>\n\n<!-- UserList.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport UserCard from \'./UserCard.vue\'\nconst users = ref([\n  { id: 1, name: \'Asha\', email: \'asha@x.com\' },\n  { id: 2, name: \'Ben\', email: \'ben@x.com\' },\n])\n</script>\n<template>\n  <ul>\n    <UserCard v-for="u in users" :key="u.id" :user="u" />\n  </ul>\n</template>',
        explanation: [
          'UserList owns the data and loops with v-for.',
          'Each UserCard receives one user via the `user` prop.',
          'The :key gives every instance a stable identity for patching.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Demonstrate that two instances of the same Toggle component have independent state.',
      hint: 'Give Toggle a local ref and render it twice.',
      solution: {
        lang: 'vue',
        code: '<!-- Toggle.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst on = ref(false)\n</script>\n<template>\n  <button @click="on = !on">{{ on ? \'ON\' : \'OFF\' }}</button>\n</template>\n\n<!-- App.vue -->\n<script setup>\nimport Toggle from \'./Toggle.vue\'\n</script>\n<template>\n  <Toggle />\n  <Toggle />\n</template>',
        explanation: [
          'Each <Toggle> has its own `on` ref because each is a separate instance.',
          'Clicking the first toggle does not flip the second.',
          'This proves component state is per-instance, not per-definition.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a smart/dumb split: a CommentBox (dumb) that takes a `comment` prop and emits a `delete` event, and a CommentFeed (smart) that owns the list and removes a comment on delete.',
      hint: 'Dumb component only renders + emits; smart component owns state and handles the event.',
      solution: {
        lang: 'vue',
        code: '<!-- CommentBox.vue (dumb) -->\n<script setup>\ndefineProps([\'comment\'])\nconst emit = defineEmits([\'delete\'])\n</script>\n<template>\n  <div class="comment">\n    <p>{{ comment.text }}</p>\n    <button @click="emit(\'delete\', comment.id)">Delete</button>\n  </div>\n</template>\n\n<!-- CommentFeed.vue (smart) -->\n<script setup>\nimport { ref } from \'vue\'\nimport CommentBox from \'./CommentBox.vue\'\nconst comments = ref([\n  { id: 1, text: \'Nice!\' },\n  { id: 2, text: \'Helpful.\' },\n])\nfunction remove(id) {\n  comments.value = comments.value.filter(c => c.id !== id)\n}\n</script>\n<template>\n  <CommentBox\n    v-for="c in comments"\n    :key="c.id"\n    :comment="c"\n    @delete="remove"\n  />\n</template>',
        explanation: [
          'CommentBox is presentational: it renders a comment and emits delete with the id.',
          'CommentFeed owns the data and reacts to the event by filtering the list.',
          'Data flows down (comment prop) and the action flows up (delete event) — clean one-way flow.',
          'This smart/dumb split is the canonical reusable component architecture.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Components are where Vue interviews begin and where real Vue work lives. If you can confidently define, nest, reuse, and communicate between components, you have the foundation for props, events, slots, routing, and state management — everything else is a refinement of this idea.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the definition and a parent/child props example. Product companies (Zoho, Flipkart, Razorpay) ask you to design a small component tree and explain data flow and reuse. FAANG-level interviews probe boundary decisions, instance isolation, and the compile-to-vdom pipeline.',
    whatInterviewersExpect:
      'They expect you to describe a component as a reusable isolated instance, demonstrate props-down/events-up, prove that usages have independent state, and show judgement about where to split a UI into components.',
  },
}

export default componentsBasics
