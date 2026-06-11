import type { ConceptLesson } from '../../../types/lesson'

const whatIsVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'what-is-vue',
  name: 'What is Vue',
  category: 'fundamentals',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Vue is one of the three dominant front-end frameworks (with React and Angular); knowing what it is and where it fits is table-stakes for any Vue role.',
    'It powers the UI of huge products — GitLab, Alibaba, Adobe, Nintendo — so understanding its model maps directly to real, shipping software.',
    'Vue introduces the mental shift from manual DOM manipulation to declarative, reactive UI — the single biggest idea you carry into every other lesson.',
    'Interviewers open with "what is Vue and why would you choose it?" to gauge whether you understand frameworks as solutions to a problem, not just syntax.',
    'Vue 3 + Composition API + the reactivity system are the foundation everything else (refs, computed, components, router, Pinia) builds on.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vue is like a smart whiteboard that redraws itself the instant you change the notes behind it.',
    story: [
      'Imagine a whiteboard where you write "Score: 0". Normally, if the score changes, you have to walk up and erase the 0 and write a 1 yourself.',
      'Now imagine a magic whiteboard connected to a little notepad in your pocket. You just change the number on your notepad to 1, and the whiteboard updates by itself — instantly.',
      'Vue is that magic. You keep your data in a "notepad" (variables), and you tell Vue once how the screen should look based on that data.',
      'After that, whenever you change the data, Vue redraws the matching part of the screen for you. You never walk up and erase things by hand again.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue is a JavaScript framework for building user interfaces — the visible part of a website or app that people click and read.',
    'Instead of writing long instructions to find an element and change its text, you describe what the screen should show for a given piece of data, and Vue keeps the two in sync.',
    'You build apps out of "components" — reusable building blocks like a Button or a UserCard — that you snap together like LEGO.',
    'It is called "progressive" because you can sprinkle it onto one part of an existing page, or use it to build an entire large application.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue is a progressive, component-based JavaScript framework for building user interfaces and single-page applications, built around a declarative rendering model and a reactivity system that automatically updates the DOM when your state changes.',
    how: 'You define state (data), write a template that references that state, and Vue compiles the template into a render function. When state changes, Vue re-runs the minimal work needed and patches the real DOM through a virtual DOM diff.',
    why: 'It removes the error-prone manual DOM updates of plain JavaScript/jQuery, gives you reusable components, and scales from a tiny widget to a full app — with a gentle learning curve.',
    code: {
      label: 'A counter in Vue 3 (script setup)',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\n\nconst count = ref(0)\nfunction increment() {\n  count.value++\n}\n</script>\n\n<template>\n  <button @click="increment">Clicked {{ count }} times</button>\n</template>',
      explanation: [
        'ref(0) creates a reactive piece of state holding the number 0.',
        'The template references {{ count }} — Vue tracks that this button text depends on count.',
        'Clicking calls increment(), which mutates count.value; Vue notices and re-renders only the button text.',
        'You never wrote document.querySelector or textContent — the UI follows the data automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue is an open-source, progressive JavaScript framework for building user interfaces. Its core is a declarative rendering layer and a fine-grained reactivity system: components declare state and a template, the template compiler turns the template into a render function, and a reactive effect re-runs that render function and patches the DOM via virtual-DOM diffing whenever a tracked dependency changes. It is incrementally adoptable, supports both an Options API and a Composition API, and is the foundation of an ecosystem (Vue Router, Pinia, Vite, Nuxt).',

  // 7. Internal Working
  internalWorking: [
    'You create an application instance with createApp(RootComponent) and mount it to a DOM element, which bootstraps Vue\'s runtime.',
    'Each component\'s template is compiled (at build time by Vite, or at runtime) into a render function that returns a virtual DOM tree (VNodes).',
    'During setup, reactive state is created with ref/reactive, which wrap values in Proxies that track which effects read them.',
    'The render function runs inside a reactive effect: reading reactive state during render registers that state as a dependency of the component.',
    'When a tracked value changes, its Proxy triggers the dependent effect; the component\'s render function re-runs, producing a new VNode tree.',
    'Vue diffs the new tree against the previous one (the patch algorithm) and applies only the minimal set of real DOM mutations needed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        STATE (reactive)                 TEMPLATE
        ┌──────────────┐                ┌────────────────────────┐
        │ count = 0    │  referenced by │ <button>{{ count }}</.. │
        └──────┬───────┘                └───────────┬────────────┘
               │                                    │ compiled to
               │ change count++                     ▼
               │                              render() → VNode tree
               ▼                                    │
        triggers effect ──────────────────────────►│ diff vs old tree
                                                    ▼
                                          patch minimal DOM updates
                                                    ▼
                                            real <button> text updates`,

  // 9. Memory Visualization (omitted — covered in reactivity lessons)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — declarative greeting',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst name = ref(\'World\')\n</script>\n\n<template>\n  <h1>Hello, {{ name }}!</h1>\n  <input v-model="name" />\n</template>',
      explanation: [
        'name is reactive state, displayed via {{ name }}.',
        'v-model two-way binds the input to name, so typing updates the state.',
        'The <h1> re-renders automatically as you type — no event wiring by hand.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a reusable component with props',
      lang: 'vue',
      code: '<!-- UserCard.vue -->\n<script setup>\ndefineProps({ name: String, role: String })\n</script>\n\n<template>\n  <div class="card">\n    <strong>{{ name }}</strong> — {{ role }}\n  </div>\n</template>\n\n<!-- Parent.vue -->\n<template>\n  <UserCard name="Asha" role="Engineer" />\n  <UserCard name="Ravi" role="Designer" />\n</template>',
      explanation: [
        'UserCard is a reusable component receiving data through props.',
        'The parent renders it twice with different data — this is the LEGO model.',
        'Each instance is isolated; changing one does not affect the other.',
        'This composition into components is what makes large Vue apps maintainable.',
      ],
    },
    advanced: {
      label: 'Advanced — derived state and side effects',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed, watch } from \'vue\'\n\nconst items = ref([{ price: 10 }, { price: 20 }])\nconst total = computed(() => items.value.reduce((s, i) => s + i.price, 0))\n\nwatch(total, (newTotal) => {\n  console.log(\'total changed to\', newTotal)\n})\n</script>\n\n<template>\n  <p>Total: {{ total }}</p>\n</template>',
      explanation: [
        'computed derives total from items and caches it until items change.',
        'watch runs a side effect whenever total changes.',
        'Both are powered by the same reactivity system that drives rendering.',
        'This shows Vue is not just templating — it is a full reactive programming model.',
      ],
    },
    realProject: {
      label: 'Real project — feature widget mounted into a legacy page',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport CartWidget from \'./CartWidget.vue\'\n\n// progressive adoption: only the #cart node is controlled by Vue\ncreateApp(CartWidget).mount(\'#cart\')',
      explanation: [
        'A large legacy server-rendered site can adopt Vue one widget at a time.',
        'createApp(CartWidget).mount(\'#cart\') hands Vue control of just one element.',
        'The rest of the page stays untouched — this is the "progressive" promise in practice.',
        'Teams use exactly this to migrate from jQuery/Razor/PHP templates to Vue incrementally.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Vue.js?',
      answer: 'Vue is a progressive, open-source JavaScript framework for building user interfaces, centered on declarative rendering and a reactive data model where the DOM automatically stays in sync with your state.',
      explanation: 'A strong answer names "declarative rendering", "reactivity", and "component-based", not just "a framework for websites".',
    },
    {
      level: 'beginner',
      question: 'Why would you use Vue instead of plain JavaScript?',
      answer: 'Plain JS forces you to manually find and update DOM nodes, which is error-prone and hard to scale. Vue lets you declare what the UI should look like for a given state and updates the DOM for you, plus gives reusable components, routing, and state management.',
      explanation: 'Interviewers want to see you frame frameworks as solutions to manual-DOM and maintainability problems.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue differ from React?',
      answer: 'Both are component-based and use a virtual DOM, but Vue offers single-file components with HTML-based templates, a built-in fine-grained reactivity system (Proxies), and official libraries (Router, Pinia). React leans on JSX, explicit re-render via setState/hooks, and a larger third-party ecosystem.',
      explanation: 'Mention reactivity granularity and the "batteries-included official ecosystem" as the key differentiators.',
    },
    {
      level: 'intermediate',
      question: 'What does "progressive framework" mean for Vue?',
      answer: 'You can adopt Vue incrementally — drop it into one element of an existing page via createApp().mount(), or scale up to a full SPA with build tooling, routing, and state management — adding layers only as needed.',
      explanation: 'Connect it to real migration strategies from legacy stacks.',
    },
    {
      level: 'advanced',
      question: 'At a high level, how does Vue keep the DOM in sync with state?',
      answer: 'Reactive state is wrapped in Proxies that track which render effects read them. The component render function runs inside a reactive effect; when a tracked value changes, the effect re-runs to produce a new virtual DOM tree, which Vue diffs against the old tree and patches with minimal real DOM mutations.',
      explanation: 'Senior signal: connecting Proxy-based tracking, render effects, and virtual-DOM patching in one coherent flow.',
    },
    {
      level: 'senior',
      question: 'When might Vue be a poor fit, and what are its trade-offs?',
      answer: 'For ultra-small static sites, any framework adds bundle/runtime overhead vs hand-written HTML. Very large orgs sometimes prefer React for its hiring pool and ecosystem breadth. Vue\'s reactivity also has caveats (adding properties, array index assignment in Vue 2) and SSR/hydration complexity that you must manage.',
      explanation: 'Showing you know when NOT to reach for Vue signals real engineering judgment.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a library and a framework, and which is Vue?',
    'What is a single-page application and how does Vue support it?',
    'What is a single-file component (.vue file)?',
    'What is the virtual DOM and why does Vue use one?',
    'What is the difference between the Options API and the Composition API?',
    'How does Vue 3 differ from Vue 2 at a high level?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Describing Vue as "just a templating library like Handlebars".',
      why: 'It ignores reactivity, components, and the virtual DOM — the things that make it a framework.',
      fix: 'Define Vue as a reactive, component-based framework with declarative rendering, not a one-shot template renderer.',
    },
    {
      mistake: 'Reaching for document.querySelector and manual DOM updates inside a Vue app.',
      why: 'It fights Vue\'s reactivity, causes state/DOM drift, and breaks when Vue re-renders.',
      fix: 'Drive the UI from reactive state and template bindings; use template refs only when you truly need direct DOM access.',
    },
    {
      mistake: 'Assuming you must build a full SPA to use Vue.',
      why: 'It misses the "progressive" point and over-engineers small enhancements.',
      fix: 'Mount Vue onto a single element for a widget; scale up only when complexity warrants it.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Core SPA framework for dashboards, admin panels, and customer apps; GitLab and many SaaS UIs are built entirely in Vue components.' },
    { area: 'Nuxt', detail: 'Nuxt builds on Vue to add SSR, file-based routing, and SEO-friendly rendering for content and e-commerce sites.' },
    { area: 'Component library', detail: 'UI libraries like Vuetify, PrimeVue, and Element Plus ship Vue components teams compose into products.' },
    { area: 'Progressive enhancement', detail: 'Legacy server-rendered sites mount Vue onto individual widgets (cart, search, comments) to modernize incrementally.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Virtual-DOM diffing plus compiler optimizations mean only changed nodes touch the real DOM.',
      'Vue 3\'s compiler hoists static content and patches dynamic bindings precisely, reducing render work.',
    ],
    bad: [
      'The framework runtime adds bundle size and startup cost vs hand-written HTML for trivial pages.',
      'Naive reactivity (huge reactive arrays, unkeyed lists) can cause unnecessary re-renders.',
    ],
    optimizations: [
      'Use build tooling (Vite) for tree-shaking and code-splitting to keep bundles small.',
      'Lazy-load routes/components and use keyed v-for to minimize render and diff cost.',
      'Lean on computed caching instead of recomputing derived data in templates.',
    ],
  },

  // 16. Security Considerations (omitted — covered in template/v-html lessons)

  // 17. Related Concepts
  related: {
    prerequisites: [],
    nextConcepts: ['progressive-framework', 'declarative-rendering', 'vue-instance-app', 'reactivity-fundamentals', 'options-vs-composition-api'],
    dependencyNote:
      'This is the entry point to the whole Vue map. It leads naturally into what "progressive" means, how the application instance bootstraps an app, declarative rendering, and the reactivity system that all later concepts build on.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write "STATE" on the left and "DOM" on the right with a gap between them.',
      'Draw an arrow from STATE to DOM labelled "Vue renders".',
      'Change the state value and draw a second arrow showing Vue automatically re-patching the DOM.',
      'Say: "In plain JS you\'d redraw the DOM by hand each time; Vue keeps this arrow automatic via reactivity + virtual DOM."',
      'Add a box around a piece of UI labelled "component" to show reuse and composition.',
    ],
    diagram: `  STATE  ──── Vue renders ────►  DOM
   count=0                          <button>0</button>
     │  count++                        ▲
     └──── reactivity triggers ────────┘ (auto re-patch)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue is a progressive, component-based JavaScript framework for building UIs. You keep data in reactive state and write a template that describes the UI for that state; Vue compiles the template to a render function and, via its Proxy-based reactivity and virtual-DOM diffing, automatically patches the minimal DOM when state changes. It is "progressive" because you can add it to one widget or build a full SPA. The big mental shift is declarative (describe the result) over imperative (manually edit the DOM).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue is an open-source, progressive JavaScript framework for building user interfaces. Its core idea is declarative rendering backed by a reactivity system. Instead of manually selecting DOM nodes and updating them like you would in jQuery, you hold your data in reactive state and write a template that declares what the UI should look like for that data. Vue compiles the template into a render function and runs it inside a reactive effect; reading state during render registers that state as a dependency. When the state changes, its Proxy triggers the effect, the render function re-runs to produce a new virtual DOM tree, and Vue diffs it against the old tree and patches only the minimal real DOM changes. You build apps from components — reusable, isolated building blocks with their own template, state, and logic — which is what lets Vue scale from a small widget to a large app. It is called "progressive" because adoption is incremental: you can mount Vue onto a single element of a legacy page, or grow into a full single-page application with Vue Router for navigation, Pinia for state, and Vite or Nuxt for tooling and server rendering. Compared to React, Vue ships an HTML-based template syntax, single-file components, and a built-in fine-grained reactivity system, with official libraries that make it batteries-included. The trade-off is that, like any framework, it adds runtime and bundle cost, so for trivial static pages plain HTML may be better.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarative reactivity is ergonomic but hides update cost — large reactive structures can re-render more than you expect without profiling.',
      'Vue\'s batteries-included ecosystem reduces decision fatigue but offers less ecosystem breadth than React in some niches.',
    ],
    edgeCases: [
      'Mounting multiple app instances on one page (micro-frontends) requires care with shared plugins and global config.',
      'Progressive adoption on a server-rendered page can clash with existing scripts that also mutate the same DOM nodes.',
      'Runtime template compilation (no build step) increases bundle size and disables some compiler optimizations.',
    ],
    runtimeBehavior: [
      'Updates are batched and flushed asynchronously in a microtask, so the DOM reflects the latest state after nextTick, not synchronously.',
      'Static parts of templates are hoisted by the compiler and skipped during diffing.',
      'Each component is its own reactive effect, so re-renders are scoped to the components whose dependencies changed.',
    ],
    scalability: [
      'Component-based architecture plus code-splitting keeps large apps maintainable and lazily loaded.',
      'Reactivity scales well, but global reactive stores must be structured (Pinia modules) to avoid wide re-render fan-out.',
    ],
    productionConcerns: [
      'Choose CSR vs SSR (Nuxt) deliberately based on SEO and time-to-content needs.',
      'Bundle size and hydration cost are the main performance levers; measure with build analysis and Lighthouse.',
      'Pin framework/major versions and plan Vue 2→3 migrations (different reactivity and API surface) carefully.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Vue = progressive, component-based, reactive UI framework.',
    'Declarative rendering: describe UI for state, Vue updates the DOM.',
    'Reactivity = Proxy-based dependency tracking + automatic re-render.',
    'Virtual DOM diff → minimal real DOM patches.',
    'Components are reusable building blocks (template + logic + state).',
    'Progressive: one widget (createApp().mount()) up to a full SPA.',
    'Two styles: Options API and Composition API (<script setup>).',
    'Ecosystem: Vue Router, Pinia, Vite, Nuxt.',
    'Vue 3 uses Proxy reactivity; Vue 2 used Object.defineProperty.',
    'Use it to replace manual DOM/jQuery work and scale UI maintainably.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Vue 3 <script setup> component that shows a message ref and a button that changes the message.',
      hint: 'Use ref for the message and @click to update message.value.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst message = ref(\'Hello\')\n</script>\n\n<template>\n  <p>{{ message }}</p>\n  <button @click="message = \'Changed!\'">Change</button>\n</template>',
        explanation: ['message is reactive state shown via interpolation.', 'Clicking reassigns it and Vue re-renders the <p> automatically.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Mount a Vue component onto an existing element with id "app" using the application instance API.',
      hint: 'Import createApp and call .mount with a selector.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\ncreateApp(App).mount(\'#app\')',
        explanation: ['createApp(App) builds an application instance from a root component.', '.mount(\'#app\') hands Vue control of that DOM node — the entry point of every Vue app.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain in code how derived state stays in sync: show a list and a computed count that updates when items change.',
      hint: 'Use computed over a reactive array.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst items = ref([\'a\', \'b\'])\nconst count = computed(() => items.value.length)\nfunction add() { items.value.push(\'x\') }\n</script>\n\n<template>\n  <p>{{ count }} items</p>\n  <button @click="add">Add</button>\n</template>',
        explanation: ['count is derived from items via computed and caches until items change.', 'Pushing to items triggers reactivity; count and the <p> update with no manual wiring.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'In one paragraph (as you would on a whiteboard), explain why Vue is called declarative and reactive, with a concrete contrast to plain JS.',
      hint: 'Contrast "describe the result" vs "issue DOM commands step by step".',
      solution: {
        lang: 'js',
        code: '// Imperative (plain JS): you command each DOM change\nconst el = document.getElementById(\'count\')\nlet n = 0\nbutton.onclick = () => { n++; el.textContent = n }\n\n// Declarative (Vue): you describe the relationship once\n// template: <span>{{ n }}</span>; n.value++ and Vue updates the span',
        explanation: [
          'Imperative code lists the steps to mutate the DOM and must repeat them on every change.',
          'Vue lets you declare that the span shows n once; reactivity re-renders it whenever n changes.',
          'That is the declarative + reactive model — describe the result, let the framework keep it true.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing what Vue is — and articulating the declarative + reactive + component model — is the foundation interviewers test before anything else. Nail this and every later concept (refs, computed, components, router) slots into a clear mental picture.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the textbook "what is Vue and why use it". Product companies (Zoho, Flipkart, Razorpay) push on Vue vs React and progressive adoption. FAANG-level interviews probe the rendering pipeline, reactivity internals, and when a framework is the wrong choice.',
    whatInterviewersExpect:
      'They expect a crisp definition (progressive, component-based, reactive, declarative), a contrast with manual DOM/plain JS, awareness of the ecosystem, and ideally a real example of where you used or would use Vue.',
  },
}

export default whatIsVue
