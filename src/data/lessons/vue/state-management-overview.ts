import type { ConceptLesson } from '../../../types/lesson'

const stateManagementOverview: ConceptLesson = {
  // 1. Concept Summary
  slug: 'state-management-overview',
  name: 'State Management Overview',
  category: 'state',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'State is the single source of truth your UI renders from — getting its shape and ownership right is the difference between a maintainable app and a tangle of prop-drilling and event bubbling.',
    'Almost every non-trivial feature (auth, cart, theme, notifications, cached server data) needs state shared across components that are NOT in a parent-child line — this is the core problem state management solves.',
    'Choosing the right tool (local ref, provide/inject, a composable, or Pinia) per situation is a constant senior-level judgement call interviewers love to probe.',
    'Bad state choices cause real bugs: stale data, components that do not update, accidental shared mutation, and untestable spaghetti.',
    'Vue 3 has multiple official layers (reactivity primitives, composables, provide/inject, Pinia) and knowing when each fits is expected of any mid-level Vue developer.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'State is the shared whiteboard in a classroom that everyone reads from and some people are allowed to write on.',
    story: [
      'Imagine a classroom where the teacher writes the day\'s homework on one big whiteboard at the front.',
      'Every student looks at the SAME whiteboard, so nobody has a different copy that goes out of date — when the teacher changes it, everyone instantly sees the new homework.',
      'If instead each student copied the homework onto their own little paper, and the teacher changed it, some papers would be wrong and confusing.',
      'State management is deciding where to put the whiteboard: sometimes a note on one desk is enough, sometimes you need the big shared board at the front so the whole class stays in sync.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'State is just the data your app remembers right now — like which user is logged in, what is in the shopping cart, or whether a menu is open.',
    'Some data only matters to one component (a toggle), so it lives right there. Other data many far-apart components need (the cart), so it should live somewhere they can all reach.',
    'State management is the set of patterns for deciding WHERE data lives and HOW components read and change it without making copies that fall out of sync.',
    'Vue gives you a ladder of options: keep it local, hand it down through provide/inject, share it through a composable, or use a dedicated store like Pinia for big app-wide state.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'State management is the practice of organizing your application data so the right components can read it and update it predictably, choosing the smallest tool that fits the scope of sharing.',
    how: 'You start with local reactive state (ref/reactive) inside a component. When two unrelated components need the same data, you lift it into a shared place: a composable module, provide/inject down a subtree, or a global Pinia store.',
    why: 'Without a deliberate strategy you end up prop-drilling values through many layers and emitting events back up, which is brittle. Centralizing shared state keeps every consumer in sync from one source of truth.',
    code: {
      label: 'Local vs shared state',
      lang: 'js',
      code: 'import { ref } from \'vue\'\n\n// LOCAL state — lives in one component, dies with it\nconst isOpen = ref(false)\nfunction toggle() { isOpen.value = !isOpen.value }\n\n// SHARED state — a module-level ref imported by many components\n// store.js\nexport const cart = ref([])\nexport function addItem(item) { cart.value.push(item) }',
      explanation: [
        'A ref declared inside setup() is local: each component instance gets its own copy.',
        'A ref created at module scope and exported is shared: every importer touches the SAME ref.',
        'Reading cart.value in two different components shows identical data because it is one reactive object.',
        'This module pattern is the seed of every state-management tool, including Pinia.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'State management in Vue 3 is the discipline of locating reactive state at the appropriate scope and exposing controlled read/write access to it. It spans a spectrum: component-local state via ref/reactive; subtree-scoped state via provide/inject; cross-cutting shared state via module-level reactive singletons (composables); and centralized, devtools-integrated, SSR-safe global state via Pinia. The unifying mechanism is Vue\'s reactivity system, which tracks which effects (renders/watchers) depend on which state and re-runs them on mutation, regardless of where that state lives.',

  // 7. Internal Working
  internalWorking: [
    'Reactive state (ref/reactive) is backed by Proxies and dependency tracking: reading a property inside a reactive effect registers that effect as a subscriber via track().',
    'When state mutates, trigger() schedules every subscribed effect — including component render functions — onto the async update queue, so the UI re-renders.',
    'Sharing state across components works simply because the SAME reactive object is referenced from multiple component scopes; there is no special machinery — reactivity does not care where the object is imported from.',
    'provide/inject walks the component instance parent chain at inject() time, reading from the nearest ancestor that called provide() with that key, so the scope is the subtree, not the whole app.',
    'Pinia builds on this: a store is essentially a reactive() object plus computed getters plus action methods, registered on the app so it is a true singleton and discoverable by devtools and SSR serialization.',
    'Because every layer ultimately routes through the same track/trigger reactivity core, components subscribed to any of them update through the identical render-effect mechanism.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '              SCOPE OF SHARING  ── choose the smallest that fits\n\n  narrow ───────────────────────────────────────────────► wide\n\n  ref/reactive      provide/inject       composable        Pinia store\n  (one component)   (a subtree)          (whole app, ad-hoc) (whole app, formal)\n      │                  │                    │                 │\n      ▼                  ▼                    ▼                 ▼\n  ┌────────┐        ┌─────────┐         ┌──────────┐      ┌───────────┐\n  │ Toggle │        │ <Form/> │         │ useAuth()│      │ cartStore │\n  │ isOpen │        │ provide │         │ module   │      │ devtools  │\n  └────────┘        │   ▼     │         │ singleton│      │ SSR-safe  │\n                    │ inject  │         └──────────┘      └───────────┘\n                    └─────────┘\n\n  ALL of them run through the SAME reactivity core: track() on read, trigger() on write.',

  // 9. Memory Visualization
  memoryVisualization: [
    'LOCAL: a ref created in setup() lives as long as the component instance; unmounting frees it.',
    'MODULE SINGLETON: a ref created at module top-level is allocated once when the module first loads and lives for the entire page session — it is shared by reference across all importers.',
    'PROVIDE/INJECT: the provided value is stored on the provider component instance; descendants hold a reference, so it survives as long as that provider is mounted.',
    'PINIA: the store object is held by the Pinia instance attached to the app, so it persists for the app lifetime (in SSR, one fresh store tree per request to avoid cross-request leakage).',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — local component state',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <button @click="count++">Clicked {{ count }} times</button>\n</template>',
      explanation: [
        'count is local to this component — perfect when no other component needs it.',
        'No store, no provide/inject — the simplest correct choice.',
        'Premature globalization of state like this is a common over-engineering mistake.',
        'Start here and lift state up only when a second consumer appears.',
      ],
    },
    intermediate: {
      label: 'Intermediate — shared state via a module composable',
      lang: 'js',
      code: '// useTheme.js — shared across the whole app, no library needed\nimport { ref, readonly } from \'vue\'\n\nconst theme = ref(\'light\')              // module-level → singleton\n\nexport function useTheme() {\n  function toggle() {\n    theme.value = theme.value === \'light\' ? \'dark\' : \'light\'\n  }\n  return { theme: readonly(theme), toggle }\n}',
      explanation: [
        'theme is declared OUTSIDE the function, so it is created once and shared by every caller of useTheme().',
        'Returning readonly(theme) prevents consumers from mutating it directly — they must use toggle().',
        'Any component calling useTheme() reads and reacts to the same value.',
        'This is the lightweight alternative to Pinia for small global state.',
        'If theme were declared INSIDE useTheme(), each call would get a separate copy — a classic bug.',
      ],
    },
    advanced: {
      label: 'Advanced — provide/inject for subtree-scoped state',
      lang: 'vue',
      code: '<!-- FormRoot.vue -->\n<script setup>\nimport { reactive, provide } from \'vue\'\nconst formState = reactive({ values: {}, errors: {} })\nfunction setField(name, value) { formState.values[name] = value }\nprovide(\'form\', { formState, setField })\n</script>\n\n<!-- deep child FormInput.vue -->\n<script setup>\nimport { inject } from \'vue\'\nconst { formState, setField } = inject(\'form\')\n</script>',
      explanation: [
        'The form state is scoped to this form subtree — two forms on a page each have their own.',
        'inject() finds the nearest ancestor provider, so nested inputs share one form object without prop-drilling.',
        'This is better than a global store when the state is inherently scoped to a component subtree.',
        'Provide a Symbol key in real code to avoid name collisions.',
        'Mutating reactive(formState) re-renders any input subscribed to the changed field.',
      ],
    },
    realProject: {
      label: 'Real project — choosing layers in an e-commerce app',
      lang: 'js',
      code: '// Decision map for a real shop:\n// - Button hover/open menu     -> local ref\n// - Wizard step shared by steps -> provide/inject on the wizard root\n// - Theme / locale             -> useTheme()/useLocale() composable singleton\n// - Cart, user, orders         -> Pinia stores (devtools, persistence, SSR)\n\nimport { defineStore } from \'pinia\'\nexport const useCartStore = defineStore(\'cart\', {\n  state: () => ({ items: [] }),\n  getters: { total: (s) => s.items.reduce((n, i) => n + i.price, 0) },\n  actions: { add(item) { this.items.push(item) } },\n})',
      explanation: [
        'Cross-cutting, persisted, devtools-inspected data (cart, user) belongs in Pinia.',
        'Ephemeral UI state stays local — putting it in a store is noise.',
        'Subtree-coupled state (a multi-step form) uses provide/inject.',
        'App-wide-but-simple state (theme) uses a composable singleton.',
        'Senior engineers articulate this layering rather than reaching for a global store for everything.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is "state" in a Vue application?',
      answer: 'State is the reactive data the UI is rendered from — anything the app remembers at runtime, like the logged-in user, cart contents, or whether a modal is open. When state changes, Vue re-renders the parts of the UI that depend on it.',
      explanation: 'A good answer ties state to reactivity and to the UI being a function of state.',
    },
    {
      level: 'beginner',
      question: 'When should state be local versus shared?',
      answer: 'Keep state local when only one component cares about it. Lift it to a shared location (composable, provide/inject, or store) only when two or more unrelated components need to read or write the same data.',
      explanation: 'Interviewers want the instinct to start local and lift only on demand, avoiding premature global state.',
    },
    {
      level: 'intermediate',
      question: 'What are the main ways to share state in Vue 3?',
      answer: 'Module-level reactive singletons exposed via a composable; provide/inject for subtree scope; and Pinia for formal global state. Props/emit handle parent-child but are not really cross-cutting sharing.',
      explanation: 'Listing the spectrum and the scope each fits demonstrates breadth.',
    },
    {
      level: 'intermediate',
      question: 'Why is prop-drilling a problem and what solves it?',
      answer: 'Prop-drilling passes data through many intermediate components that do not use it, coupling them to the data and making refactors painful. provide/inject or a shared store lets the deep consumer read directly without intermediaries.',
      explanation: 'Strong answers name the coupling cost and the right tool per scope.',
    },
    {
      level: 'advanced',
      question: 'A module-level ref shared via a composable already works — why use Pinia?',
      answer: 'Pinia adds devtools time-travel, a structured state/getters/actions shape, plugin support (persistence), HMR, TypeScript inference, and crucially SSR safety (a fresh store tree per request) which a raw module singleton leaks across requests.',
      explanation: 'The SSR cross-request leak point is the senior differentiator here.',
    },
    {
      level: 'senior',
      question: 'How do you decide the boundary between server state and client state?',
      answer: 'Server-cache state (data fetched from APIs) is best handled by data-fetching/query layers with caching, deduping and invalidation, while genuine client/UI state (selections, toggles, optimistic edits) belongs in Pinia or local state. Conflating the two leads to stale caches and manual refetch spaghetti.',
      explanation: 'Distinguishing server-cache from client state shows architectural maturity beyond "put everything in a store".',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does Vue know which components to re-render when shared state changes?',
    'What is the difference between provide/inject and a Pinia store in terms of scope?',
    'Why can a module-level singleton leak data across requests in SSR?',
    'How would you make shared state read-only for consumers?',
    'When is props/emit still the right answer instead of a store?',
    'How do you test components that depend on shared state?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting all state in a global store "to be safe".',
      why: 'Ephemeral UI state in a global store adds boilerplate, hurts encapsulation, and makes the store a dumping ground.',
      fix: 'Keep state at the narrowest scope that works; promote to a store only when sharing is real.',
    },
    {
      mistake: 'Declaring shared state INSIDE a composable function.',
      why: 'Each call creates a fresh copy, so consumers do not actually share — a silent desync bug.',
      fix: 'Declare the ref/reactive at module top-level; only the helper functions go inside the exported composable.',
    },
    {
      mistake: 'Prop-drilling through many layers instead of provide/inject or a store.',
      why: 'It couples intermediate components to data they do not use and is fragile to refactor.',
      fix: 'Use provide/inject for subtree state or a store for app-wide state.',
    },
    {
      mistake: 'Using a module singleton for state in an SSR app.',
      why: 'The singleton is shared across all requests on the server, leaking one user\'s data to another.',
      fix: 'Use Pinia, which creates a fresh store tree per request via app.use(createPinia()).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Teams establish a layering convention: local ref for UI, composable singletons for theme/locale, provide/inject for form/wizard subtrees, Pinia for domain state.' },
    { area: 'Pinia', detail: 'The de-facto global store for Vue 3 apps — auth, cart, feature flags, and cached entities live in typed stores with devtools and persistence plugins.' },
    { area: 'Nuxt', detail: 'Nuxt bundles Pinia and useState() for SSR-safe shared state; module singletons are avoided server-side to prevent cross-request leakage.' },
    { area: 'SSR', detail: 'State is serialized on the server and hydrated on the client; the store must be request-scoped so each user gets isolated state.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Centralized reactive state means a single source updates all consumers efficiently through one dependency graph.',
      'Keeping ephemeral state local avoids global re-render fan-out and keeps dependency graphs small.',
    ],
    bad: [
      'Over-broad reactive objects cause many components to subscribe and re-render on unrelated changes.',
      'Deeply nested reactive state has Proxy overhead on every property access path.',
    ],
    optimizations: [
      'Split large stores into focused stores so components subscribe only to what they use.',
      'Use shallowRef/shallowReactive for large, rarely-mutated structures to skip deep tracking.',
      'Expose readonly views to consumers to prevent accidental wide mutations.',
      'Keep server-cache data in a query layer so client state stores stay lean.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'ref', 'reactive', 'composables'],
    nextConcepts: ['pinia-basics', 'provide-inject-state', 'state-sharing-composables', 'pinia-vs-vuex'],
    dependencyNote:
      'State management sits on top of the reactivity primitives (ref/reactive) and composables. Master those first; this overview then frames the choice between provide/inject, composable singletons, and Pinia, each covered in its own lesson.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a horizontal arrow labelled "scope of sharing: narrow → wide".',
      'Place four boxes along it: local ref, provide/inject, composable singleton, Pinia.',
      'Under each write its scope: one component, a subtree, the app (ad-hoc), the app (formal).',
      'Draw a single shared core underneath labelled "reactivity: track on read, trigger on write".',
      'Say: "I pick the leftmost box that satisfies the sharing need — escalating only when a real second consumer or SSR/devtools needs appear."',
    ],
    diagram: '  narrow ──────────────────────────────► wide\n  [ref] → [provide/inject] → [composable] → [Pinia]\n   one      subtree           app(adhoc)     app(formal)\n        \\        |          /            /\n         \\       |         /            /\n          ▼      ▼        ▼            ▼\n      ── reactivity core: track() / trigger() ──',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'State management is choosing WHERE reactive data lives based on how widely it is shared. Start local with ref/reactive; lift to provide/inject for a subtree; use a composable singleton for simple app-wide state; reach for Pinia when you need devtools, structure, persistence, or SSR-safe request-scoped stores. Everything runs through Vue\'s one reactivity core, so updates propagate the same way regardless of layer. The skill is picking the smallest scope that works and distinguishing client/UI state from server-cache data.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In Vue 3, state management is really about deciding where reactive data should live, scoped to how widely it is shared. The simplest layer is local component state with ref or reactive — perfect when only one component cares. As soon as two unrelated components need the same data, I lift it. For state coupled to a component subtree, like a multi-step form, I use provide/inject so deep children read it without prop-drilling. For simple app-wide state like theme or locale, a module-level ref exposed through a composable is enough — it is a singleton because the ref is created once at module scope. For real domain state — auth, cart, cached entities — I use Pinia, because it adds devtools time-travel, a clear state/getters/actions structure, TypeScript inference, persistence plugins, and importantly SSR safety: Pinia creates a fresh store tree per request, whereas a raw module singleton would leak one user\'s state into another\'s on the server. Underneath, every one of these layers uses the same reactivity core: reading state inside a render registers a dependency, and mutating it triggers a re-render. The senior nuance is separating server-cache state — API data that needs caching, deduping, and invalidation, often handled by a query layer — from genuine client state. My rule is to use the narrowest scope that satisfies the requirement and escalate only when a concrete need appears, rather than dumping everything into a global store.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Composable singleton vs Pinia: the composable is zero-dependency and tiny but lacks devtools, SSR request-scoping, and a standard structure; Pinia adds those at the cost of a dependency and ceremony.',
      'provide/inject vs store: provide/inject keeps state naturally scoped and disposed with the subtree but is harder to inspect and test than an explicit store.',
      'Centralization vs encapsulation: a central store eases sharing but can erode component boundaries if overused for local concerns.',
    ],
    edgeCases: [
      'Module singletons leak across requests in SSR — the canonical reason Pinia exists.',
      'A composable that declares state inside the function silently gives each caller a separate copy.',
      'inject() outside setup (or with no matching provider) returns undefined unless a default is given.',
    ],
    runtimeBehavior: [
      'All layers schedule updates onto the same async queue; multiple mutations in a tick batch into one render.',
      'Reactive Proxies track per-property, so the granularity of re-render depends on which properties a component actually reads.',
      'Pinia stores are lazily instantiated on first use and then cached for the app lifetime.',
    ],
    scalability: [
      'Split monolithic stores into domain stores so subscription graphs stay narrow and re-renders localized.',
      'Use shallow reactivity for large datasets and keep server-cache state out of client stores.',
      'Establish team conventions for the layering decision so the codebase stays consistent as it grows.',
    ],
    productionConcerns: [
      'SSR hydration mismatches arise if server and client state diverge — serialize and restore store state carefully.',
      'Persisted state (localStorage plugins) needs versioning/migration to avoid loading incompatible shapes after a deploy.',
      'Memory: app-wide singletons live for the whole session; avoid stuffing large transient data into them.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'State = reactive data the UI renders from.',
    'Pick the NARROWEST scope that works.',
    'Local → ref/reactive in one component.',
    'Subtree → provide/inject (forms, wizards).',
    'Simple app-wide → module-level ref via composable (singleton).',
    'Formal app-wide → Pinia (devtools, SSR, persistence, types).',
    'Declare shared state at MODULE top-level, not inside the composable function.',
    'Module singletons LEAK across requests in SSR — use Pinia.',
    'Expose readonly() views to prevent consumer mutation.',
    'Separate server-cache state from client/UI state.',
    'All layers share one reactivity core: track on read, trigger on write.',
    'Avoid prop-drilling; do not over-globalize ephemeral state.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Convert a local toggle into shared app-wide state using a composable singleton called useSidebar().',
      hint: 'Declare the ref at module scope, outside the function.',
      solution: {
        lang: 'js',
        code: '// useSidebar.js\nimport { ref } from \'vue\'\nconst isOpen = ref(false)               // module scope = singleton\nexport function useSidebar() {\n  function toggle() { isOpen.value = !isOpen.value }\n  return { isOpen, toggle }\n}',
        explanation: [
          'isOpen lives at module scope so every component sharing useSidebar() reads the same value.',
          'toggle mutates the one shared ref, updating all consumers.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Provide a reactive "user" object from an App root and inject it in a deeply nested Avatar component, exposing it read-only to the child.',
      hint: 'Use provide with readonly() and inject with a default.',
      solution: {
        lang: 'js',
        code: '// App.vue setup\nimport { reactive, provide, readonly } from \'vue\'\nconst user = reactive({ name: \'Ada\' })\nprovide(\'user\', readonly(user))\n\n// Avatar.vue setup\nimport { inject } from \'vue\'\nconst user = inject(\'user\', { name: \'Guest\' })',
        explanation: [
          'readonly(user) lets descendants read but not mutate the provided object.',
          'inject supplies a default so the child still works if no provider exists.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain in code why declaring state inside the composable function breaks sharing, and fix it.',
      hint: 'Compare in-function vs module-level declaration.',
      solution: {
        lang: 'js',
        code: '// BROKEN: each call makes a new count\nexport function useCounterBad() {\n  const count = ref(0)        // fresh every call!\n  return { count }\n}\n\n// FIXED: one shared count\nconst count = ref(0)          // module scope\nexport function useCounterGood() {\n  return { count }\n}',
        explanation: [
          'In useCounterBad, every component gets its own count, so they never sync.',
          'In useCounterGood, the module-level count is created once and shared by reference.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You are building an SSR Nuxt app. A teammate shares auth state via a module-level ref. Explain the bug and recommend the correct approach.',
      hint: 'Think about who shares that module on the server.',
      solution: {
        lang: 'js',
        code: '// BUG: on the server this single module instance is shared\n// across ALL concurrent requests → user A sees user B\'s auth.\n// export const auth = ref(null)  // do NOT do this in SSR\n\n// FIX: use Pinia (request-scoped) or Nuxt useState\nimport { defineStore } from \'pinia\'\nexport const useAuthStore = defineStore(\'auth\', {\n  state: () => ({ user: null }),\n})\n// createPinia() runs per request, giving each request its own store tree.',
        explanation: [
          'Module singletons are process-global on the server, so concurrent requests share them — a serious data-leak bug.',
          'Pinia (or Nuxt useState) creates a fresh, request-scoped store tree, isolating users.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'State architecture is what separates a junior who reaches for a global store reflexively from an engineer who reasons about scope, coupling, and SSR safety. Nail this and the rest of Vue\'s state ecosystem (Pinia, provide/inject, composables) becomes a set of tools you deploy deliberately.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and "how do you share data between components". Product companies (Zoho, Flipkart, Razorpay) ask you to choose the right layer for a given feature and justify it. FAANG-level interviews probe SSR request-scoping, server-cache vs client state, and re-render performance of broad reactive stores.',
    whatInterviewersExpect:
      'They expect you to lay out the spectrum (local → provide/inject → composable → Pinia), pick the narrowest fit for a scenario, explain the SSR singleton leak, and distinguish client state from cached server data.',
  },
}

export default stateManagementOverview
