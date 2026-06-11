import type { ConceptLesson } from '../../../types/lesson'

const progressiveFramework: ConceptLesson = {
  // 1. Concept Summary
  slug: 'progressive-framework',
  name: 'Progressive Framework',
  category: 'fundamentals',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    '"Progressive" is Vue\'s core marketing and architectural promise — interviewers ask what it actually means in practice.',
    'It explains why you can adopt Vue gradually in a legacy codebase instead of a risky big-bang rewrite.',
    'It frames Vue as layers (declarative rendering → components → routing → state → build tooling → SSR) you add only as needed.',
    'Understanding it helps you choose the right amount of Vue for a job — a single widget vs a full Nuxt app.',
    'It is a clean way to contrast Vue\'s adoption story with Angular\'s "all-in" framework model.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vue is like a LEGO set where you can build just a tiny car or a whole city, starting with the same first brick.',
    story: [
      'Imagine you get a box of LEGO. You do not have to build the giant castle on the box right away.',
      'You can snap together just two bricks to make a little car today, and that already works and is fun.',
      'Tomorrow, if you want more, you add a few more bricks to make a truck, then a road, then a whole town — without throwing away what you built.',
      'Vue is like that. You can use a little of it on one corner of your website, and later add more pieces — bit by bit — until you have built something huge, never starting over.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A "progressive framework" means you can use as little or as much of it as you need, adding capabilities step by step.',
    'You might start by using Vue just to make one button on an old website interactive.',
    'Later you can add components, then page routing, then a place to store shared data — each as a separate layer.',
    'You are never forced to adopt everything at once, which makes it easy to start and easy to grow.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A progressive framework is one designed to be incrementally adoptable: its core (declarative rendering + reactivity) works on its own, and additional layers — components, client-side routing, state management, build tooling, and server rendering — are opt-in and stack on top as your needs grow.',
    how: 'You can drop a single Vue app onto one DOM element of an existing page via createApp().mount(\'#widget\'), or scale up to a full SPA with Vue Router, Pinia, and Vite/Nuxt. Each layer is a separate package you add when needed.',
    why: 'It lowers the cost of starting (no big rewrite, gentle learning curve) and de-risks migration: you modernize a legacy app one feature at a time while it keeps shipping.',
    code: {
      label: 'Progressive adoption: enhancing one element',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport SearchBox from \'./SearchBox.vue\'\n\n// The rest of the legacy page is untouched;\n// Vue only controls the #search element.\ncreateApp(SearchBox).mount(\'#search\')',
      explanation: [
        'createApp(SearchBox) builds a small Vue app from one component.',
        '.mount(\'#search\') hands Vue control of just that node — everything else stays as-is.',
        'No router, no store, no build rewrite required for this first step.',
        'Later you can introduce more components and layers around it without redoing this work.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue is described as a progressive framework because it is incrementally adoptable: its minimal core provides declarative, reactive rendering that can enhance part of an existing page, while higher-level concerns (component systems, client-side routing via Vue Router, centralized state via Pinia, build-time tooling via Vite, and server-side rendering via Nuxt) are layered, opt-in modules. You scale the framework\'s footprint to match the application\'s complexity rather than committing to the entire stack up front.',

  // 7. Internal Working
  internalWorking: [
    'The runtime core (reactivity + renderer) is independent and can mount onto a single element without any other package.',
    'createApp returns an application instance with its own config, plugins, and global components, so multiple isolated Vue apps can coexist on one page.',
    'Optional layers register as plugins via app.use(plugin) — Vue Router and Pinia are added this way, extending the app without modifying core.',
    'The template compiler can run at build time (Vite, smaller/faster) or at runtime (full build, no build step) — another opt-in trade-off.',
    'SSR is a separate rendering target: the same components render to an HTML string on the server (Nuxt) and hydrate on the client.',
    'Because each capability is modular, you only ship the code for the layers you actually use (tree-shaking aids this).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Add layers only as needed (each opt-in):

   ┌─────────────────────────────────────────────┐
   │ SSR / Nuxt           (SEO, fast first paint)  │
   ├─────────────────────────────────────────────┤
   │ Build tooling / Vite (bundling, HMR)          │
   ├─────────────────────────────────────────────┤
   │ State management / Pinia                      │
   ├─────────────────────────────────────────────┤
   │ Routing / Vue Router (SPA navigation)         │
   ├─────────────────────────────────────────────┤
   │ Components (reusable building blocks)         │
   ├─────────────────────────────────────────────┤
   │ CORE: declarative rendering + reactivity ◄── start here
   └─────────────────────────────────────────────┘`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — just the core, one element',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\ncreateApp({\n  data: () => ({ likes: 0 }),\n  template: \'<button @click="likes++">Likes {{ likes }}</button>\'\n}).mount(\'#like-button\')',
      explanation: [
        'Only the reactivity + rendering core is used here.',
        'It enhances a single #like-button node on an otherwise non-Vue page.',
        'No components, router, or store — the smallest possible footprint.',
      ],
    },
    intermediate: {
      label: 'Intermediate — adding the components + routing layers',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport { createRouter, createWebHistory } from \'vue-router\'\nimport App from \'./App.vue\'\nimport Home from \'./Home.vue\'\n\nconst router = createRouter({\n  history: createWebHistory(),\n  routes: [{ path: \'/\', component: Home }],\n})\n\ncreateApp(App).use(router).mount(\'#app\')',
      explanation: [
        'We add the routing layer with app.use(router) — opt-in, not bundled into core.',
        'The same createApp().mount() pattern grows by chaining .use().',
        'Components (App, Home) are now the building blocks of a small SPA.',
        'We added a layer without changing how the core works.',
      ],
    },
    advanced: {
      label: 'Advanced — full stack: state + plugins',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport { createPinia } from \'pinia\'\nimport { createRouter, createWebHistory } from \'vue-router\'\nimport App from \'./App.vue\'\nimport routes from \'./routes\'\n\nconst app = createApp(App)\napp.use(createPinia())                 // state layer\napp.use(createRouter({ history: createWebHistory(), routes })) // routing layer\napp.mount(\'#app\')',
      explanation: [
        'Routing and centralized state are independent plugins stacked via app.use.',
        'The app instance composes layers; core never changed across these examples.',
        'Each .use adds capability and only its own code to the bundle.',
        'This is the same project, just further up the progressive ladder.',
      ],
    },
    realProject: {
      label: 'Real project — migrating a legacy site widget-by-widget',
      lang: 'js',
      code: '// Phase 1: enhance just the cart on a server-rendered page\ncreateApp(CartWidget).mount(\'#cart\')\n\n// Phase 2 (weeks later): the new /checkout route is a full Vue SPA\ncreateApp(CheckoutApp).use(router).use(pinia).mount(\'#checkout-root\')\n\n// Legacy pages keep working the whole time.',
      explanation: [
        'A real migration uses progressive adoption to avoid a risky rewrite.',
        'High-value widgets get Vue first; full routes follow when justified.',
        'The legacy stack and Vue coexist during the transition.',
        'This phased path is the practical payoff of "progressive".',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does it mean that Vue is a "progressive framework"?',
      answer: 'It means Vue is incrementally adoptable: its core can enhance a single part of a page, and you add higher-level layers — components, routing, state, tooling, SSR — only as your needs grow, rather than committing to everything at once.',
      explanation: 'A good answer names the "layers you add as needed" idea and gives the single-widget-to-full-SPA spectrum.',
    },
    {
      level: 'beginner',
      question: 'Can you use Vue without a build step?',
      answer: 'Yes. You can include Vue via a script tag or import it and use the runtime-with-compiler build to mount components without bundlers — useful for quick enhancements or prototypes.',
      explanation: 'Shows you understand that build tooling is itself an opt-in layer.',
    },
    {
      level: 'intermediate',
      question: 'What are the layers of the Vue ecosystem and which are optional?',
      answer: 'Core (reactivity + declarative rendering) is required; everything else is optional: components scale composition, Vue Router adds client-side navigation, Pinia adds shared state, Vite adds build/HMR tooling, and Nuxt adds SSR/SSG. You add each only when needed.',
      explanation: 'Listing the layers and labeling them opt-in demonstrates real ecosystem fluency.',
    },
    {
      level: 'intermediate',
      question: 'How does "progressive" help when modernizing a legacy app?',
      answer: 'You mount Vue onto individual high-value widgets first (cart, search, comments) while the legacy server-rendered pages keep working, then convert whole routes to Vue SPAs over time — avoiding a risky big-bang rewrite.',
      explanation: 'Connecting it to a phased migration strategy is exactly the practical signal interviewers want.',
    },
    {
      level: 'advanced',
      question: 'How does multiple Vue apps on one page work, and what are the gotchas?',
      answer: 'Each createApp() returns an isolated application instance with its own config, plugins, and global components, so several can coexist. Gotchas: plugins/state are not shared across instances unless you wire them, and global CSS/IDs can collide; for true sharing you mount one app or use a shared store deliberately.',
      explanation: 'Senior signal: understanding instance isolation and the limits of progressive coexistence.',
    },
    {
      level: 'senior',
      question: 'What are the trade-offs of progressive adoption vs an all-in framework?',
      answer: 'Progressive adoption lowers risk and entry cost and lets teams ship during migration, but a partially-migrated app carries two paradigms (more cognitive load, duplicated tooling) and can drift. An all-in framework forces consistency up front at higher migration risk. The choice depends on app size, deadline pressure, and team capacity.',
      explanation: 'Weighing migration risk against the cost of mixed paradigms shows architectural maturity.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Vue\'s runtime-only and runtime-with-compiler builds?',
    'How do you mount more than one Vue app on the same page?',
    'When would you choose Nuxt over a plain Vue SPA?',
    'What does app.use(plugin) actually do?',
    'How is Vue\'s adoption model different from Angular\'s?',
    'What is the smallest possible way to start using Vue?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking "progressive" means "progressive web app (PWA)".',
      why: 'They are unrelated — PWA is about offline/installable apps; progressive here means incremental adoption.',
      fix: 'Define progressive as incremental adoptability of layered, opt-in capabilities.',
    },
    {
      mistake: 'Pulling in Router, Pinia, and SSR for a tiny enhancement.',
      why: 'It over-engineers a one-widget job and bloats the bundle.',
      fix: 'Start with the core only; add layers when the complexity actually demands them.',
    },
    {
      mistake: 'Assuming two Vue apps on a page automatically share state and plugins.',
      why: 'Each createApp instance is isolated; nothing is shared unless you wire it.',
      fix: 'Share state via a single app instance or an explicitly shared store, not by coincidence.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Teams mount standalone Vue apps onto specific elements of legacy pages to modernize incrementally without a rewrite.' },
    { area: 'Nuxt', detail: 'When SEO/first-paint matters, the SSR layer is added on top of the same Vue components rather than rebuilt.' },
    { area: 'Component library', detail: 'Design systems ship plug-and-play components that drop into projects at any layer of adoption.' },
    { area: 'Micro-frontends', detail: 'Independent Vue app instances render separate widgets within a larger host page, each with its own config.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'You ship only the layers you use, keeping bundles small for simple enhancements.',
      'Build-time compilation (Vite) is an opt-in layer that improves runtime performance and bundle size.',
    ],
    bad: [
      'Multiple app instances each carry runtime overhead and may duplicate shared logic.',
      'Runtime-with-compiler builds (no build step) are larger and slower to start than runtime-only.',
    ],
    optimizations: [
      'Use the runtime-only build with a bundler in production to drop the compiler.',
      'Add Router/Pinia/SSR only where they earn their keep; lazy-load heavy layers.',
      'Consolidate to a single app instance with a shared store when many widgets need shared state.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue'],
    nextConcepts: ['vue-instance-app', 'declarative-rendering', 'components-basics', 'vue-router-basics', 'pinia-basics'],
    dependencyNote:
      'Progressive adoption explains how the rest of the Vue map fits together as layers. It builds on knowing what Vue is, and leads into the application instance (the entry layer) and the optional layers: components, routing, and state.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a vertical stack of boxes, with "CORE: rendering + reactivity" at the bottom.',
      'Above it stack: Components, Router, Pinia, Build tooling, SSR.',
      'Circle just the bottom box and say "you can start here, enhancing one element".',
      'Draw an upward arrow labelled "add layers only as needed".',
      'Conclude: "That opt-in, incremental layering is what \'progressive\' means."',
    ],
    diagram: `   SSR / Nuxt        ▲ add as needed
   Build tooling      │
   Pinia (state)      │
   Vue Router         │
   Components          │
   CORE (render+react) ◄ start here, one element ok`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '"Progressive framework" means Vue is incrementally adoptable. The core — declarative rendering plus reactivity — can enhance a single element of an existing page, and you add optional layers (components, Vue Router, Pinia, Vite tooling, Nuxt SSR) only as your app grows. This lets you modernize legacy apps widget-by-widget instead of a risky rewrite, and pick exactly the amount of framework a job needs. Each layer is an opt-in plugin added via app.use, so you ship only what you use.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'When we call Vue a progressive framework, we mean it is incrementally adoptable — you scale the amount of framework to the complexity of the problem. At the bottom is the core: declarative rendering and the reactivity system. That core alone is enough to enhance a single part of an existing page; you can write createApp(Widget).mount(\'#widget\') and Vue takes over just that one element while the rest of a legacy server-rendered page keeps working untouched. From there, each additional capability is an opt-in layer rather than something forced on you. Components let you compose reusable building blocks. Vue Router adds client-side navigation when you grow into a single-page app. Pinia gives you centralized shared state. Vite provides build tooling and hot module replacement, and you can even skip the build step entirely with the runtime-with-compiler build for quick prototypes. At the top, Nuxt adds server-side rendering and static generation when SEO and first-paint speed matter. You add these by registering plugins on the application instance with app.use, so you only ship the code for the layers you actually use. The practical payoff is migration: instead of a high-risk big-bang rewrite, a team can introduce Vue onto its highest-value widgets first, then convert whole routes to Vue over time. The trade-off to be honest about is that a half-migrated app temporarily carries two paradigms, which adds cognitive load, so you plan the path deliberately. Contrast this with Angular, which is much more all-in by design.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Incremental adoption reduces migration risk but a mixed-paradigm codebase increases cognitive load and tooling duplication.',
      'Opt-in layers keep bundles lean, but ad-hoc layer choices across teams can fragment architecture without governance.',
    ],
    edgeCases: [
      'Multiple isolated app instances do not share plugins/state unless explicitly wired.',
      'Global CSS, element IDs, and event listeners can collide between a Vue widget and the surrounding legacy page.',
      'Runtime-with-compiler builds disable some compile-time optimizations and inflate bundle size.',
    ],
    runtimeBehavior: [
      'Each createApp produces an independent reactivity/render scope with its own config and global registrations.',
      'app.use installs plugins by calling their install hook with the app instance, allowing them to inject globals and provide values.',
      'Tree-shaking removes unused core features when using a bundler, so the shipped runtime reflects only used APIs.',
    ],
    scalability: [
      'Progressive layering supports a clean growth path from widget to SPA to SSR app without rearchitecting the core.',
      'For many widgets needing shared state, consolidating to one app instance with Pinia scales better than many isolated instances.',
    ],
    productionConcerns: [
      'Document the adoption phase so new engineers know which pages are Vue vs legacy.',
      'Standardize the chosen layers across the org to avoid fragmentation.',
      'Plan the eventual decommissioning of the legacy stack so the mixed-paradigm period is bounded.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Progressive = incrementally adoptable, layer by layer.',
    'Core layer: declarative rendering + reactivity (required).',
    'Optional layers: components, Router, Pinia, Vite, Nuxt.',
    'Layers register as plugins via app.use(plugin).',
    'Start small: createApp(Widget).mount(\'#el\') on one node.',
    'Scale up to a full SPA, then SSR, without rewriting core.',
    'Each createApp instance is isolated (no shared state by default).',
    'Runtime-only (with bundler) vs runtime-with-compiler (no build) builds.',
    'Great for migrating legacy apps widget-by-widget.',
    'Not the same as "PWA" — it means incremental adoption.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Mount a minimal Vue app onto an element with id "promo" using only the core, no router or store.',
      hint: 'createApp with an inline template, then .mount.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\ncreateApp({ template: \'<p>Sale ends soon!</p>\' }).mount(\'#promo\')',
        explanation: ['Only the rendering core is used.', 'Vue controls just the #promo node — the smallest progressive footprint.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add the routing layer to an existing app via app.use, keeping the same createApp().mount() pattern.',
      hint: 'Create a router and chain .use(router) before .mount.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport { createRouter, createWebHistory } from \'vue-router\'\nimport App from \'./App.vue\'\nimport Home from \'./Home.vue\'\n\nconst router = createRouter({ history: createWebHistory(), routes: [{ path: \'/\', component: Home }] })\ncreateApp(App).use(router).mount(\'#app\')',
        explanation: ['Routing is added as an opt-in plugin via .use(router).', 'The core mount pattern is unchanged — we just stacked a layer.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Mount two independent Vue widgets on the same page and explain why they do not share state.',
      hint: 'Two separate createApp calls on two elements.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport Cart from \'./Cart.vue\'\nimport Search from \'./Search.vue\'\n\ncreateApp(Cart).mount(\'#cart\')\ncreateApp(Search).mount(\'#search\')\n// Each call creates an isolated app instance: separate reactivity,\n// plugins, and globals. They share nothing unless explicitly wired.',
        explanation: ['Each createApp produces an isolated instance.', 'No store or plugin is shared across instances by default — that is why state is independent.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Outline (in comments + code) a phased plan to migrate a legacy page to Vue progressively.',
      hint: 'Phase 1 a widget; later phases add layers.',
      solution: {
        lang: 'js',
        code: '// Phase 1 — enhance one high-value widget (core only)\ncreateApp(CartWidget).mount(\'#cart\')\n\n// Phase 2 — new feature route becomes a Vue SPA (add routing)\ncreateApp(FeatureApp).use(router).mount(\'#feature\')\n\n// Phase 3 — shared state across widgets (add Pinia)\nconst app = createApp(Shell)\napp.use(router).use(pinia).mount(\'#root\')\n\n// Phase 4 — SEO-critical pages move to Nuxt SSR\n// Legacy pages keep shipping throughout.',
        explanation: [
          'Start with the smallest footprint (one widget, core only).',
          'Add routing, then state, then SSR as justified — each an opt-in layer.',
          'The legacy stack coexists, so the app keeps shipping during migration.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Explaining "progressive framework" well signals that you think about frameworks as layered tools matched to a problem, not as monoliths. It directly maps to real migration and architecture decisions teams care about.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition. Product companies (Zoho, Flipkart, Razorpay) ask how you would migrate a legacy app or when to add Router/Pinia/Nuxt. FAANG-level interviews probe instance isolation, build trade-offs, and the cost of mixed paradigms during migration.',
    whatInterviewersExpect:
      'They expect the "incrementally adoptable layers" definition, the single-widget-to-full-SPA spectrum, awareness of the optional ecosystem, and a sensible phased migration story.',
  },
}

export default progressiveFramework
