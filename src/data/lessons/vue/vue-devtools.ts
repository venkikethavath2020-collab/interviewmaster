import type { ConceptLesson } from '../../../types/lesson'

const vueDevtools: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue-devtools',
  name: 'Vue DevTools',
  category: 'ecosystem',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Vue DevTools is the primary way you inspect, debug, and understand a running Vue app — seeing the component tree, props, reactive state, events, and routing live.',
    'It turns invisible reactivity into something you can watch: you can see which component re-rendered, what props it got, and how Pinia state changed over time.',
    'It dramatically speeds up debugging — instead of scattering console.logs you select a component and read its state directly.',
    'Interviewers ask about it to check you debug like a professional and know the tooling, not just the syntax.',
    'It also surfaces performance data (component render timings) and lets you time-travel through Pinia/Vuex mutations, which is invaluable on real bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Vue DevTools is like X-ray glasses for your app — you can see inside every part to find out what is going on.',
    story: [
      'Imagine a toy robot doing something weird and you cannot tell why just by looking at the outside.',
      'Now put on magic X-ray glasses. Suddenly you can see all the gears and wires inside, and which button is stuck.',
      'You can even watch the gears turn in slow motion to spot the exact moment something goes wrong.',
      'Vue DevTools is those glasses for a web app: it lets you peek inside, see every component and its data, and watch what changes when you click things — so you can find and fix problems fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue DevTools is an add-on for your browser (and a standalone app) that lets you look inside a running Vue application.',
    'It shows the tree of components on the page, and when you click one you can see its props (inputs) and its reactive data (memory) right now.',
    'It also shows events being fired, the current route, and how shared state (Pinia) changes when you interact with the app.',
    'Because it understands Vue specifically, it shows things the normal browser tools cannot — like component names and reactive values instead of raw HTML.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue DevTools is the official debugging toolkit for Vue apps — a browser extension (and standalone Electron app, plus a Vite plugin) that inspects the component tree, reactive state, props, events, routing, Pinia/Vuex stores, and component render performance of a running app.',
    how: 'Install the extension (Chrome/Firefox/Edge) or the vite-plugin-vue-devtools. Open browser DevTools and switch to the Vue tab; it connects to the app via a global hook the Vue runtime exposes in development. You then select components, edit state live, inspect events, and timeline performance.',
    why: 'It gives visibility into Vue\'s otherwise invisible reactivity and component lifecycle, so you debug by observing real state rather than guessing — faster and more accurate than console logging.',
    code: {
      label: 'Installing devtools (Vite plugin)',
      lang: 'js',
      code: '// npm i -D vite-plugin-vue-devtools\n\n// vite.config.ts\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\nimport VueDevTools from \'vite-plugin-vue-devtools\'\n\nexport default defineConfig({\n  plugins: [vue(), VueDevTools()],\n})\n\n// Browser extension alternative: install \'Vue.js devtools\'\n// from the Chrome/Firefox store, then open the Vue panel.',
      explanation: [
        'The Vite plugin adds an in-app DevTools overlay you can open during development.',
        'Alternatively the browser extension adds a Vue tab to the browser DevTools.',
        'DevTools only connect in development builds (the hook is disabled in production by default).',
        'Once connected you select components from the tree and inspect their state.',
        'No code changes are needed beyond installing it.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue DevTools is the official inspection and debugging tooling for Vue applications, available as a browser extension, a standalone Electron app, and a Vite plugin. It connects to a running app through a global hook (__VUE_DEVTOOLS_GLOBAL_HOOK__) that the Vue runtime registers in development, receiving events about component mounting, updates, and reactivity. Through it you inspect and live-edit the component tree, props, reactive state and computed values, emitted events, the router state, Pinia/Vuex stores with time-travel, and a performance timeline of component render durations. It is a development-only tool, deliberately inert in production builds.',

  // 7. Internal Working
  internalWorking: [
    'In a development build, the Vue runtime registers a global hook (__VUE_DEVTOOLS_GLOBAL_HOOK__) on window that emits lifecycle and reactivity events the DevTools frontend can subscribe to.',
    'When DevTools opens, its backend script (injected by the extension/plugin) connects to that hook and walks the app\'s component instance tree to build the inspectable tree view.',
    'Selecting a component reads its instance: setup state/refs, props, computed values, and provides — DevTools serialises these reactive values for display and lets you write back to them, triggering normal reactivity.',
    'For Pinia/Vuex, DevTools subscribes to store mutations/actions and records them, enabling a time-travel timeline that re-applies or reverts state snapshots.',
    'The performance timeline hooks component render boundaries to record how long each render takes, helping locate slow or over-rendering components.',
    'In production, the hook is not registered (and build flags strip dev-only code), so DevTools cannot attach — which is both a privacy/security choice and a bundle-size optimisation.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  Running Vue app (dev)\n   Vue runtime ──registers──► __VUE_DEVTOOLS_GLOBAL_HOOK__\n                                       │ events (mount/update/state)\n                                       ▼\n   ┌─────────── Vue DevTools panel ───────────┐\n   │ Components tree  │  Selected: <UserCard>  │\n   │  App            │   props: { id: 7 }      │\n   │   └ UserList    │   state: { open: true } │\n   │      └ UserCard │   computed: { full }    │\n   │ Pinia | Router | Timeline | Events        │\n   └───────────────────────────────────────────┘\n   live-edit state ──► app re-renders (real reactivity)',

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — inspecting component state',
      lang: 'js',
      code: '// Counter.vue\n// <script setup>\nimport { ref, computed } from \'vue\'\nconst count = ref(0)\nconst doubled = computed(() => count.value * 2)\nconst inc = () => count.value++\n// </script>\n// <template><button @click="inc">{{ count }} / {{ doubled }}</button></template>\n\n// In DevTools > Components > Counter you will see:\n//   setup: count = 0, doubled = 0\n// Click the button → values update live in the panel.',
      explanation: [
        'Selecting Counter in the tree shows count and the computed doubled.',
        'Clicking the button updates the displayed values in real time.',
        'You can edit count directly in DevTools and watch the UI react.',
        'No console.log needed — the reactive state is visible directly.',
      ],
    },
    intermediate: {
      label: 'Intermediate — naming components for readable trees',
      lang: 'js',
      code: '// <script setup> infers the name from the filename, but you can set it:\n// <script>\nexport default { name: \'UserCard\' }\n// </script>\n// <script setup>\nimport { ref } from \'vue\'\nconst expanded = ref(false)\n// </script>\n\n// Without a clear name DevTools may show <Anonymous> or a path,\n// making the tree hard to read.',
      explanation: [
        '<script setup> usually infers the component name from the file, aiding the tree.',
        'A second normal <script> block with name makes it explicit and stable.',
        'Clear names make the component tree readable when debugging deep hierarchies.',
        'This matters most for dynamically created or wrapped components.',
        'Good names also improve error messages and the performance timeline.',
      ],
    },
    advanced: {
      label: 'Advanced — custom inspector with the devtools API',
      lang: 'js',
      code: 'import { setupDevtoolsPlugin } from \'@vue/devtools-api\'\n\nexport function installMyPlugin(app) {\n  setupDevtoolsPlugin(\n    { id: \'my-cache\', label: \'My Cache\', app },\n    (api) => {\n      api.addInspector({ id: \'cache\', label: \'Cache\' })\n      api.on.getInspectorTree((payload) => {\n        if (payload.inspectorId === \'cache\') {\n          payload.rootNodes = [{ id: \'root\', label: \'cache entries\' }]\n        }\n      })\n    }\n  )\n}',
      explanation: [
        'Libraries can expose their own DevTools panels via @vue/devtools-api.',
        'addInspector registers a custom tab; getInspectorTree feeds it data.',
        'This is how Pinia and Vue Router add their dedicated DevTools views.',
        'It lets your own library surface internal state to developers.',
        'Only runs in development where the devtools hook exists.',
      ],
    },
    realProject: {
      label: 'Real project — debugging an over-rendering list',
      lang: 'js',
      code: '// Symptom: a long list feels janky on every keystroke.\n// In DevTools:\n//   1. Open the Timeline / Performance tab, start recording.\n//   2. Type in the search box, stop recording.\n//   3. See that EVERY ListItem re-renders, not just filtered ones.\n//   4. Inspect a ListItem: it receives a new inline object prop each render.\n//\n// Fix: stabilise the prop / add a proper :key, or memoize with v-memo.\n// <ListItem v-for="item in items" :key="item.id" :item="item" />',
      explanation: [
        'The performance timeline reveals which components re-render and how long they take.',
        'DevTools shows ListItem receiving fresh object props every render, the cause.',
        'You confirm the hypothesis by inspecting props rather than guessing.',
        'The fix (stable keys / v-memo / stable props) is then verified in the same timeline.',
        'This is exactly how real performance bugs are diagnosed in production apps.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Vue DevTools and what can you do with it?',
      answer: 'It is the official debugging tool for Vue apps. You can inspect the component tree, view and live-edit props and reactive state, watch events, inspect the router and Pinia/Vuex stores with time-travel, and profile component render performance.',
      explanation: 'A good answer lists several capabilities, not just "inspect components".',
    },
    {
      level: 'beginner',
      question: 'How do you install and open Vue DevTools?',
      answer: 'Install the browser extension (Chrome/Firefox/Edge) or the vite-plugin-vue-devtools, run the app in development, open browser DevTools, and switch to the Vue tab (or open the in-app overlay for the Vite plugin).',
      explanation: 'Tests basic practical familiarity with the tool.',
    },
    {
      level: 'intermediate',
      question: 'Why does Vue DevTools not work on a production build?',
      answer: 'The devtools global hook is only registered in development; production builds strip dev-only code via build flags. This is intentional for security/privacy and to reduce bundle size, so the tool cannot attach.',
      explanation: 'Shows understanding that devtools is a dev-only tool and why.',
    },
    {
      level: 'intermediate',
      question: 'How would you use DevTools to debug a component that is not updating?',
      answer: 'Select the component, inspect its reactive state and props to confirm the value actually changed. If the panel shows the old value, the source of truth is not reactive; if it shows the new value but the DOM does not, suspect a missing key, a non-reactive render, or a stale closure.',
      explanation: 'Demonstrates a methodical, observe-the-state debugging approach.',
    },
    {
      level: 'advanced',
      question: 'How do DevTools enable time-travel debugging for Pinia/Vuex?',
      answer: 'DevTools subscribes to store mutations/actions and records state snapshots over time. The timeline lets you step backward and forward, re-applying or reverting snapshots so you can reproduce the exact sequence that led to a bug.',
      explanation: 'Senior signal: understanding the mutation-recording mechanism behind time-travel.',
    },
    {
      level: 'senior',
      question: 'How can a library expose its own panel in Vue DevTools?',
      answer: 'Via @vue/devtools-api: call setupDevtoolsPlugin to register the plugin, then addInspector to add a custom tab and respond to getInspectorTree/getInspectorState events with the library\'s internal data. This is how Pinia and Vue Router add their views.',
      explanation: 'Shows knowledge of the devtools plugin API used by ecosystem libraries.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between the browser extension and the standalone app?',
    'How do you debug a Vue app inside an iframe or non-browser environment?',
    'How does DevTools show composition-API setup state versus options-API data?',
    'Why might a component show as <Anonymous> and how do you fix it?',
    'How do you profile re-renders and find over-rendering components?',
    'How does the Vite plugin differ from the browser extension?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting DevTools to work on a deployed production site.',
      why: 'The devtools hook is disabled and dev code is stripped in production builds.',
      fix: 'Debug against a development build, or temporarily enable a debug build if you must inspect prod-like behaviour.',
    },
    {
      mistake: 'Leaving components unnamed so the tree shows <Anonymous>.',
      why: 'Anonymous components make the tree and timeline unreadable, slowing debugging.',
      fix: 'Rely on <script setup> filename inference or add an explicit name option.',
    },
    {
      mistake: 'Relying only on console.log instead of inspecting reactive state.',
      why: 'Logs show a point-in-time snapshot and clutter the console; they miss the live reactive picture.',
      fix: 'Select the component in DevTools to read current state, and use the timeline for renders.',
    },
    {
      mistake: 'Forgetting to use the Pinia/Router tabs for state and navigation bugs.',
      why: 'Developers debug component state but miss that the issue is in shared store state or route params.',
      fix: 'Use the dedicated Pinia and Router panels and time-travel to inspect store/route history.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Daily debugging: inspect/live-edit component props and reactive state, view events, and profile renders during development.' },
    { area: 'Pinia', detail: 'Pinia integrates a dedicated DevTools panel showing stores, state, getters, and a time-travel timeline of actions/mutations.' },
    { area: 'Component library', detail: 'Libraries (Vue Router, Pinia, VueUse-adjacent tools) register custom inspectors via @vue/devtools-api to expose internal state.' },
    { area: 'Nuxt', detail: 'Nuxt DevTools builds on the same foundation, adding panels for modules, routes, payloads, and server state in development.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'The performance timeline pinpoints slow or over-rendering components objectively.',
      'In production, devtools code is stripped, so there is zero runtime/bundle cost for end users.',
    ],
    bad: [
      'With DevTools open, recording timelines and serialising large reactive trees adds dev-time overhead.',
      'Inspecting very large/deeply reactive objects can momentarily slow the panel.',
    ],
    optimizations: [
      'Close DevTools (or stop recording) when measuring raw app performance to avoid observer overhead.',
      'Use the timeline to find over-rendering, then fix with keys, computed, or v-memo.',
      'Name components clearly so the timeline attributes time to the right place.',
      'Inspect store time-travel to isolate which mutation caused a state regression.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'reactivity-fundamentals', 'vite-vue'],
    nextConcepts: ['pinia-basics', 'vue-performance-overview', 'error-handling-vue', 'reactivity-performance'],
    dependencyNote:
      'DevTools sits on top of component and reactivity fundamentals — you need to know what props, state, and re-renders are to interpret it. It is the lens through which you study Pinia state and performance. Learn components and reactivity first.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the running app exposing a global devtools hook in development.',
      'Draw the DevTools panel connecting to that hook and reading the component tree.',
      'Show selecting a component to reveal props, setup state, and computed values.',
      'Add the Pinia and Timeline tabs: store time-travel and render profiling.',
      'Conclude: "It is dev-only — the hook is stripped in production — and it lets me observe reactivity instead of guessing with logs."',
    ],
    diagram: '  app (dev) ──hook──► Vue DevTools\n                       ├ Components: tree + props + state (editable)\n                       ├ Pinia: stores + time-travel\n                       ├ Router: current route + params\n                       └ Timeline: render performance\n\n  production: hook stripped → DevTools cannot attach',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue DevTools is the official debugging tool — a browser extension, standalone app, or Vite plugin. It connects to a dev build via a global hook and lets you inspect and live-edit the component tree, props, reactive state and computed values, watch events, inspect the router, and time-travel through Pinia/Vuex stores, plus profile render performance. It is dev-only: the hook is stripped from production builds. Use it to observe reactivity directly instead of guessing with console.logs, and use the timeline to find over-rendering components.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue DevTools is the official debugging toolkit for Vue applications. It comes as a browser extension for Chrome, Firefox, and Edge, as a standalone Electron app, and as a Vite plugin that gives you an in-app overlay. It connects to a running application through a global hook that the Vue runtime registers in development builds, and through that hook it receives events about component mounting, updates, and reactivity. The most-used feature is the Components panel: it shows the live component tree, and when you select a component you see its props, its setup state and refs, its computed values, and what it provides — and you can edit those values directly and watch the app react, because you are writing back into the real reactive system. Beyond components, there are dedicated panels: a Router panel showing the current route and params, a Pinia or Vuex panel that records store mutations and lets you time-travel backward and forward through state snapshots, an events view, and a performance timeline that records how long each component takes to render. That timeline is how I diagnose performance problems — for example, finding that every item in a list re-renders on each keystroke because it receives a fresh inline object prop, then confirming the fix in the same timeline. A key thing to know is that DevTools is strictly a development tool: in production the global hook is not registered and the dev-only code is stripped out by build flags, both for privacy and to keep the bundle small, so it simply cannot attach to a deployed production build. The practical mindset it encourages is to debug by observing real reactive state rather than scattering console.logs, which is faster and more accurate.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Extension vs standalone app vs Vite plugin: the extension is convenient, the standalone app debugs non-browser/embedded contexts, and the plugin gives an integrated overlay — pick by environment.',
      'Live observability vs overhead: keeping DevTools open and recording adds dev-time cost when measuring raw performance.',
      'Dev-only design: zero production cost but no way to inspect a real production incident without a special build.',
    ],
    edgeCases: [
      'Apps inside iframes or web components may need the standalone app or extra configuration to connect.',
      'Anonymous components clutter the tree and timeline, hindering attribution.',
      'Very large reactive trees can be slow to serialise in the panel.',
      'Multiple Vue apps on one page each register separately and must be selected individually.',
    ],
    runtimeBehavior: [
      'The global hook emits lifecycle and reactivity events the DevTools backend subscribes to.',
      'Store time-travel works by recording mutations and re-applying/reverting snapshots.',
      'Live-editing state writes back through the normal reactivity, triggering real re-renders.',
    ],
    scalability: [
      'For large apps, clear component naming and store namespacing keep DevTools usable.',
      'Timeline profiling scales to find systemic over-rendering across big trees.',
    ],
    productionConcerns: [
      'Never depend on DevTools for production debugging; add logging/telemetry for that.',
      'Be mindful that live-editing state in DevTools can mask the real source of a bug if overused.',
      'Library authors should expose meaningful custom inspectors to aid downstream debugging.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Official Vue debugger: extension, standalone app, or Vite plugin.',
    'Connects via a dev-only global hook (stripped in production).',
    'Components panel: tree + props + reactive state + computed (editable live).',
    'Router panel: current route, params, query.',
    'Pinia/Vuex panel: stores + time-travel through mutations.',
    'Timeline: profile component render performance.',
    'Name components clearly to avoid <Anonymous> in the tree.',
    'Observe reactive state instead of console.log guessing.',
    'Libraries add custom panels via @vue/devtools-api.',
    'Close/stop recording when measuring raw performance.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add the Vue DevTools Vite plugin to a project.',
      hint: 'Install vite-plugin-vue-devtools and add it to plugins.',
      solution: {
        lang: 'js',
        code: '// npm i -D vite-plugin-vue-devtools\nimport { defineConfig } from \'vite\'\nimport vue from \'@vitejs/plugin-vue\'\nimport VueDevTools from \'vite-plugin-vue-devtools\'\n\nexport default defineConfig({ plugins: [vue(), VueDevTools()] })',
        explanation: [
          'The plugin adds an in-app DevTools overlay during development.',
          'It works alongside or instead of the browser extension.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Give a component a clear, stable name so it does not show as <Anonymous> in the tree.',
      hint: 'Add a name via a normal <script> block alongside <script setup>.',
      solution: {
        lang: 'js',
        code: '// <script>\nexport default { name: \'UserCard\' }\n// </script>\n// <script setup>\nimport { ref } from \'vue\'\nconst open = ref(false)\n// </script>',
        explanation: [
          'The extra <script> block sets an explicit component name.',
          'This makes the DevTools tree and timeline readable.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Describe the DevTools-driven steps to diagnose a list that re-renders entirely on each keystroke.',
      hint: 'Use the timeline plus prop inspection.',
      solution: {
        lang: 'text',
        code: '1. Open Timeline, start recording.\n2. Type in the search input; stop recording.\n3. Observe every ListItem re-rendered (not just matches).\n4. Select a ListItem; inspect props → new inline object each render.\n5. Fix: stable :key, stable props, or v-memo; re-record to confirm.',
        explanation: [
          'The timeline objectively shows which components re-render and how often.',
          'Prop inspection reveals the unstable prop causing the churn, guiding the fix.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Register a custom DevTools inspector for a small cache library using @vue/devtools-api.',
      hint: 'Use setupDevtoolsPlugin and addInspector.',
      solution: {
        lang: 'js',
        code: 'import { setupDevtoolsPlugin } from \'@vue/devtools-api\'\n\nexport function installCacheDevtools(app, cache) {\n  setupDevtoolsPlugin({ id: \'cache\', label: \'Cache\', app }, (api) => {\n    api.addInspector({ id: \'cache\', label: \'Cache\' })\n    api.on.getInspectorTree((p) => {\n      if (p.inspectorId === \'cache\') {\n        p.rootNodes = [...cache.keys()].map((k) => ({ id: k, label: k }))\n      }\n    })\n  })\n}',
        explanation: [
          'setupDevtoolsPlugin connects the library to DevTools in development.',
          'addInspector + getInspectorTree surface the cache keys as a custom panel, exactly how Pinia/Router do it.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Knowing Vue DevTools signals you debug like a professional and understand Vue\'s reactivity well enough to interpret what you see. It is also a quick way to demonstrate practical, hands-on experience rather than purely theoretical knowledge.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what it is and how to inspect a component. Product companies (Zoho, Flipkart, Razorpay) ask how you debug not-updating components and over-rendering with the timeline. FAANG-level rounds may probe the devtools hook, time-travel mechanics, and the @vue/devtools-api plugin model.',
    whatInterviewersExpect:
      'They expect you to list the core panels (components, router, Pinia, timeline), explain it is a dev-only tool connected via a hook, and describe a concrete debugging workflow — inspecting reactive state and profiling renders rather than relying on console.log.',
  },
}

export default vueDevtools
