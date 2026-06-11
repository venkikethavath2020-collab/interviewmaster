import type { ConceptLesson } from '../../../types/lesson'

const vueInstanceApp: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue-instance-app',
  name: 'Application Instance',
  category: 'fundamentals',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The application instance (createApp) is the entry point of every Vue 3 app — it is where the whole thing boots.',
    'It is where you register global plugins (Router, Pinia), global components, directives, and config — getting this wrong breaks the entire app.',
    'Vue 3 replaced the Vue 2 global Vue.use/Vue.component model with per-instance config, which interviewers love to contrast.',
    'Understanding the instance and mount() clarifies how Vue takes control of a DOM node and where lifecycle begins.',
    'Multiple instances enable micro-frontends and progressive adoption — but only if you understand instance isolation.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The application instance is like turning on a TV and choosing which screen it controls.',
    story: [
      'Imagine a TV that can show a movie. By itself, it is just sitting there doing nothing.',
      'You press the power button (createApp) and then plug it into one specific screen on the wall (mount).',
      'Now that one screen shows the movie, and the TV is in charge of it — it can change the picture whenever the story changes.',
      'The Vue application instance is the TV: you switch it on, point it at one spot on the page, and from then on Vue runs and updates that spot.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every Vue 3 app starts by creating an application instance from a root component using createApp.',
    'You then "mount" that instance onto a real element on the page (by id or selector), which is where Vue starts rendering.',
    'Before mounting, you can configure the app — add plugins like the router, register components everyone can use, and set options.',
    'The instance is like the manager of your whole app: it owns the global setup and the connection to the page.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The application instance is the object returned by createApp(RootComponent). It represents one Vue application: it holds global configuration (plugins, components, directives, provides, error handlers) and is mounted to a DOM container to render the root component and start the app.',
    how: 'You call createApp(App) to get the instance, chain configuration like .use(plugin), .component(name, comp), .directive(name, dir), .provide(key, value), and finally .mount(\'#app\') to attach it to the DOM. Mounting compiles and renders the root component into that element.',
    why: 'It scopes global config to a single app (no leaking globals like Vue 2 did), enables multiple isolated apps on a page, and gives a single, explicit boot sequence.',
    code: {
      label: 'Bootstrapping an app instance',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport router from \'./router\'\nimport { createPinia } from \'pinia\'\nimport GlobalButton from \'./GlobalButton.vue\'\n\nconst app = createApp(App)\n\napp.use(router)                    // register a plugin (routing)\napp.use(createPinia())             // register a plugin (state)\napp.component(\'GlobalButton\', GlobalButton) // global component\napp.config.errorHandler = (err) => console.error(err)\n\napp.mount(\'#app\')                  // attach to the DOM and render',
      explanation: [
        'createApp(App) creates the instance from the root component App.',
        '.use registers plugins; .component registers an app-wide component.',
        'app.config sets app-level options like a global error handler.',
        '.mount(\'#app\') renders App into the #app element — the app is now live.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The application instance is the object created by createApp(rootComponent[, rootProps]) that encapsulates a single Vue application context: its global component/directive registry, installed plugins, provide/inject defaults, and configuration (app.config). It exposes a chainable API (use, component, directive, provide, mount, unmount) and is bound to a DOM container by mount(), which creates the root component\'s render effect and patches the initial virtual DOM into that element. Unlike Vue 2\'s global Vue object, configuration is isolated per instance.',

  // 7. Internal Working
  internalWorking: [
    'createApp creates an app context object holding the global registries (components, directives), config, and provides, plus a reference to the root component.',
    'Chained calls like use/component/directive/provide mutate this app context before mounting.',
    'app.mount(container) resolves the container element, creates the root VNode from the root component, and creates the root render effect.',
    'The render effect runs the root component\'s setup/render to produce a virtual DOM tree, tracking reactive dependencies during render.',
    'Vue patches that initial VNode tree into the real container element, running mounted lifecycle hooks afterward.',
    'On subsequent reactive changes, only the affected component render effects re-run and patch their subtrees; app.unmount() tears the whole tree down and runs cleanup.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   createApp(App)
        │  returns
        ▼
   ┌──────────────── application instance ────────────────┐
   │  app context:                                         │
   │   • global components / directives                    │
   │   • installed plugins (Router, Pinia)                 │
   │   • provides + app.config (errorHandler, etc.)        │
   └───────────────────────┬───────────────────────────────┘
        .use() .component() .provide()  (configure)
                            │
                       .mount('#app')
                            ▼
                 ┌─────────────────────┐
                 │  #app  in real DOM   │ ◄── root component rendered here
                 └─────────────────────┘`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — minimal app',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\ncreateApp(App).mount(\'#app\')',
      explanation: [
        'The smallest valid Vue 3 app: create the instance and mount it.',
        '#app is the container element Vue renders the root component into.',
        'No plugins needed for a basic app.',
      ],
    },
    intermediate: {
      label: 'Intermediate — global registration and config',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport BaseInput from \'./BaseInput.vue\'\nimport focusDirective from \'./directives/focus\'\n\nconst app = createApp(App)\napp.component(\'BaseInput\', BaseInput)        // usable in any template\napp.directive(\'focus\', focusDirective)        // v-focus everywhere\napp.config.globalProperties.$api = myApiClient // legacy-style global\napp.mount(\'#app\')',
      explanation: [
        'app.component registers a component usable in any template without importing.',
        'app.directive adds a custom directive (v-focus) app-wide.',
        'globalProperties exposes a value on every component instance (use sparingly).',
        'All configuration happens before mount.',
      ],
    },
    advanced: {
      label: 'Advanced — provide at the app level and unmount',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\napp.provide(\'theme\', { mode: \'dark\' }) // available via inject in any descendant\napp.config.errorHandler = (err, instance, info) => {\n  reportToSentry(err, info)\n}\n\nconst vm = app.mount(\'#app\')\n// ... later, when tearing down a micro-frontend:\napp.unmount()',
      explanation: [
        'app.provide makes a value injectable anywhere without a Provider wrapper component.',
        'app.config.errorHandler centralizes error reporting for the whole app.',
        'app.mount returns the root component instance (the public proxy).',
        'app.unmount destroys the app and runs all cleanup — essential for micro-frontends.',
      ],
    },
    realProject: {
      label: 'Real project — production main.ts wiring the full stack',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport { createPinia } from \'pinia\'\nimport App from \'./App.vue\'\nimport router from \'./router\'\nimport i18n from \'./i18n\'\nimport \'./assets/main.css\'\n\nconst app = createApp(App)\napp.use(createPinia())\napp.use(router)\napp.use(i18n)\napp.config.errorHandler = (e) => console.error(\'[app]\', e)\napp.mount(\'#app\')',
      explanation: [
        'A typical main.ts wires state, routing, and i18n onto one instance.',
        'Order matters when plugins depend on each other; Pinia/router are common first.',
        'A global error handler catches unhandled render/lifecycle errors.',
        'This is the canonical Vue 3 entry file you will see in real codebases.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you create and start a Vue 3 application?',
      answer: 'Call createApp(RootComponent) to create an application instance, optionally configure it (plugins, global components), then call .mount(selector) to attach it to a DOM element and render the root component.',
      explanation: 'Naming createApp + mount and the order (configure before mount) is the core expectation.',
    },
    {
      level: 'beginner',
      question: 'What does app.mount(\'#app\') do?',
      answer: 'It resolves the #app element, renders the root component\'s virtual DOM into it, sets up the reactive render effect, and runs mounted lifecycle hooks — making the app live in that element.',
      explanation: 'Connect mount to where rendering and lifecycle begin.',
    },
    {
      level: 'intermediate',
      question: 'How is global registration in Vue 3 different from Vue 2?',
      answer: 'Vue 2 used the global Vue object (Vue.use, Vue.component, Vue.prototype), which leaked across all apps/tests. Vue 3 scopes everything to the instance: app.use, app.component, app.config.globalProperties — isolated per createApp, avoiding cross-app contamination.',
      explanation: 'The "no global pollution / per-instance isolation" point is the key Vue 3 differentiator.',
    },
    {
      level: 'intermediate',
      question: 'How do you register a plugin, and what does app.use do?',
      answer: 'app.use(plugin, options) calls the plugin\'s install(app, options) function (or invokes the plugin if it is a function), letting it register globals, provide values, or add config. Vue Router and Pinia are installed this way.',
      explanation: 'Explaining the install hook shows you understand the plugin contract.',
    },
    {
      level: 'advanced',
      question: 'Why and when would you use app.unmount(), and what does it return from mount()?',
      answer: 'mount() returns the root component instance proxy. app.unmount() destroys the application, removes its DOM, and runs all cleanup/unmounted hooks. You use it in micro-frontends, embedded widgets, or tests where a Vue app must be torn down and re-created without leaking.',
      explanation: 'Senior signal: lifecycle teardown and memory hygiene for embedded/multi-app scenarios.',
    },
    {
      level: 'senior',
      question: 'How do multiple application instances interact, and what are the isolation boundaries?',
      answer: 'Each createApp has its own app context: separate global components, directives, plugins, provides, and config. They do not share state or plugins unless you explicitly wire a shared store. This isolation enables micro-frontends but means provide/inject and Pinia instances are per-app by default.',
      explanation: 'Understanding the app-context isolation boundary is exactly the architectural depth seniors are expected to have.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between app.component and importing a component locally?',
    'What is app.config.globalProperties and when should you avoid it?',
    'How do app-level provide and component-level provide differ?',
    'What happens if you mount the same instance to two elements?',
    'How does createApp differ from the Vue 2 new Vue({}) constructor?',
    'How would you tear down a Vue app embedded in a non-Vue host page?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling app.use or app.component AFTER app.mount.',
      why: 'Configuration must happen before mount; registering afterward has no effect on the already-rendered tree.',
      fix: 'Do all .use/.component/.provide/config before calling .mount.',
    },
    {
      mistake: 'Overusing app.config.globalProperties to inject services everywhere.',
      why: 'It recreates Vue 2-style global pollution, hurts testability, and hides dependencies.',
      fix: 'Prefer provide/inject or composables for dependencies; reserve globalProperties for truly app-wide trivia.',
    },
    {
      mistake: 'Forgetting to unmount embedded Vue apps in micro-frontends/tests.',
      why: 'Leaves render effects, listeners, and DOM alive — a memory leak.',
      fix: 'Call app.unmount() on teardown to run cleanup and release everything.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'The main.ts entry file uses createApp to wire plugins, global components, and config before mounting the SPA.' },
    { area: 'Pinia', detail: 'createPinia() is installed via app.use(pinia) so all components share the same store registry within that instance.' },
    { area: 'Vue Router', detail: 'app.use(router) installs navigation; the router is bound to that specific app instance.' },
    { area: 'Micro-frontends', detail: 'Host pages create and unmount separate Vue app instances per widget, relying on per-instance isolation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A single mount sets up one efficient render effect tree; subsequent updates are scoped to changed components.',
      'Per-instance config avoids global lookups and keeps app contexts lean.',
    ],
    bad: [
      'Many app instances on one page each carry runtime/setup overhead and duplicate plugin state.',
      'Heavy synchronous work in main.ts before mount delays first render.',
    ],
    optimizations: [
      'Keep main.ts thin; lazy-load heavy plugins/features after mount where possible.',
      'Use a single instance with a shared store when widgets need shared state instead of many instances.',
      'Always unmount embedded apps to release effects and listeners.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue', 'progressive-framework'],
    nextConcepts: ['declarative-rendering', 'mounting-process', 'components-basics', 'provide-inject', 'lifecycle-hooks'],
    dependencyNote:
      'The application instance is the boot layer of a Vue app. It builds on knowing what Vue is and the progressive model, and leads into how mounting/rendering works, components, app-level provide/inject, and the lifecycle.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write createApp(App) on the left and draw an arrow to a box labelled "app instance".',
      'Inside the box list: global components, plugins, provides, config.',
      'Draw configuration calls (.use, .component) feeding into the box BEFORE mount.',
      'Draw .mount(\'#app\') as an arrow from the box to a DOM element on the right.',
      'Say: "Configure the instance, then mount once — that is where rendering and lifecycle begin."',
    ],
    diagram: `  createApp(App) ──► [ app instance ]
                       │  .use(router)
                       │  .component(...)
                       │  .provide(...)
                       ▼
                   .mount('#app') ──► <div id="app"> rendered`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Every Vue 3 app starts with createApp(RootComponent), which returns an application instance holding global config — plugins, components, directives, provides, and app.config. You configure it with chained calls like .use(router) and .component(name, comp), then call .mount(\'#app\') to render the root component into a DOM element and start the app. Unlike Vue 2\'s global Vue object, config is isolated per instance, enabling multiple apps and micro-frontends. app.unmount() tears it down.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The application instance is the entry point of every Vue 3 app. You create it by calling createApp and passing your root component, for example createApp(App). The instance is an object that encapsulates the entire application context: its registry of global components and directives, the plugins you install, app-level provide values, and configuration like a global error handler. It exposes a chainable API, so a typical main.ts reads app.use(pinia).use(router).component(\'BaseButton\', BaseButton), and finally app.mount(\'#app\'). The crucial rule is that all configuration must happen before mount, because mount is what actually attaches the app to the DOM and starts rendering. When you call mount with a selector, Vue resolves that element, creates the root component\'s virtual DOM, sets up the reactive render effect that tracks dependencies during render, patches the initial tree into the container, and runs the mounted lifecycle hooks. From then on, reactive changes re-run only the affected component effects. A big difference from Vue 2 is isolation: Vue 2 configured globals on the single Vue constructor — Vue.use, Vue.component, Vue.prototype — which leaked across apps and tests. Vue 3 scopes all of that to the instance, so each createApp is independent. That isolation is what makes multiple apps on a page and micro-frontends practical: each has its own plugins and provides and shares nothing unless you wire a common store. mount returns the root instance, and app.unmount destroys the app and runs cleanup, which you need when embedding Vue in a non-Vue host so you do not leak effects and listeners.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Per-instance config improves isolation/testability but means shared concerns (state, i18n) must be deliberately wired per app.',
      'globalProperties offers convenience at the cost of hidden dependencies and harder testing.',
    ],
    edgeCases: [
      'Mounting an instance twice or to an already-mounted element is unsupported and leads to undefined behavior.',
      'Plugins installed after mount silently have no effect on the rendered tree.',
      'Each instance has its own Pinia/inject scope, so cross-app sharing requires an explicit shared singleton.',
    ],
    runtimeBehavior: [
      'mount creates the root render effect and returns the public root instance proxy.',
      'app.use invokes plugin.install(app, options); plugins commonly call app.provide and app.component inside it.',
      'unmount runs the full teardown: unmounted hooks, effect disposal, and DOM removal.',
    ],
    scalability: [
      'A single instance with modular Pinia stores scales better than many instances for shared-state apps.',
      'Micro-frontends benefit from isolation but must coordinate shared libraries to avoid duplicate runtimes.',
    ],
    productionConcerns: [
      'Centralize error handling via app.config.errorHandler and report to monitoring.',
      'Keep the entry file thin to minimize time-to-first-render.',
      'Ensure embedded apps are unmounted to prevent leaks in long-lived host pages.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'createApp(RootComponent) → application instance.',
    'Configure BEFORE mount: .use, .component, .directive, .provide, app.config.',
    '.mount(selector) renders root component + starts lifecycle.',
    'mount() returns the root component instance proxy.',
    'app.unmount() destroys the app and runs cleanup.',
    'Vue 3 config is per-instance (no global Vue pollution like Vue 2).',
    'app.use(plugin) calls plugin.install(app, options).',
    'app.config.globalProperties = app-wide values (use sparingly).',
    'app.provide(key, val) = app-level provide for inject.',
    'Multiple instances are isolated — no shared state by default.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write the minimal main.ts that mounts a root component App onto #app.',
      hint: 'Import createApp and App, then create and mount.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\ncreateApp(App).mount(\'#app\')',
        explanation: ['createApp(App) builds the instance from the root component.', '.mount(\'#app\') renders it into the DOM and starts the app.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Register a global component "BaseButton" and a global directive "focus", then mount.',
      hint: 'Use .component and .directive before .mount.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport BaseButton from \'./BaseButton.vue\'\n\nconst app = createApp(App)\napp.component(\'BaseButton\', BaseButton)\napp.directive(\'focus\', { mounted: (el) => el.focus() })\napp.mount(\'#app\')',
        explanation: ['Global registrations happen on the instance before mount.', 'BaseButton and v-focus are now usable in any template.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Provide a value at the app level and add a global error handler, then mount and later unmount.',
      hint: 'Use app.provide, app.config.errorHandler, and app.unmount.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\napp.provide(\'apiBase\', \'/api/v1\')\napp.config.errorHandler = (err, _vm, info) => console.error(info, err)\napp.mount(\'#app\')\n// teardown when embedded host removes the widget:\nfunction destroy() { app.unmount() }',
        explanation: ['app.provide exposes a value to all descendants via inject.', 'errorHandler centralizes error reporting.', 'app.unmount runs cleanup for embedded/teardown scenarios.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why two createApp instances do not share a Pinia store unless wired.',
      hint: 'Each app.use(createPinia()) creates a separate registry.',
      solution: {
        lang: 'js',
        code: 'import { createApp } from \'vue\'\nimport { createPinia } from \'pinia\'\nimport A from \'./A.vue\'\nimport B from \'./B.vue\'\n\n// Two independent Pinia instances → two separate store registries\ncreateApp(A).use(createPinia()).mount(\'#a\')\ncreateApp(B).use(createPinia()).mount(\'#b\')\n\n// To SHARE, install ONE pinia on a single app instead:\n// const pinia = createPinia(); createApp(Root).use(pinia).mount(\'#root\')',
        explanation: [
          'Each createApp gets its own app context and its own installed Pinia.',
          'Stores live inside that registry, so A and B see different state.',
          'Sharing requires one app instance (or one shared Pinia) — isolation is the default.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The application instance is the very first thing in every Vue codebase. Showing you understand createApp, the configure-then-mount order, per-instance isolation, and unmount signals you actually understand how a Vue app boots and lives.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how do you start a Vue app". Product companies (Zoho, Flipkart, Razorpay) ask about global registration vs Vue 2 and plugin installation. FAANG-level interviews probe instance isolation, unmount lifecycle, and micro-frontend scenarios.',
    whatInterviewersExpect:
      'They expect createApp + mount, configuration before mount, the per-instance (not global) Vue 3 model, app.use/plugin install, and awareness of unmount for teardown.',
  },
}

export default vueInstanceApp
