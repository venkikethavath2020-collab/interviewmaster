import type { ConceptLesson } from '../../../types/lesson'

const stateSharingComposables: ConceptLesson = {
  // 1. Concept Summary
  slug: 'state-sharing-composables',
  name: 'State Sharing via Composables',
  category: 'state',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Composables are Vue 3\'s primary code-reuse mechanism, and the placement of reactive state inside vs outside them decides whether state is per-instance or globally shared — a subtle, bug-prone distinction.',
    'A module-level ref exposed through a composable is the lightest possible global store — no library — and many apps use it for theme, locale, auth, or toasts.',
    'Understanding the "singleton vs factory" axis lets you build both reusable per-component logic (useMouse) and shared global state (useAuth) with the same tool.',
    'It is a favorite advanced interview probe because the answer hinges on JavaScript module scope and closures, not Vue magic.',
    'Misplacing the state (inside the function) causes silent desync bugs; misusing a global singleton in SSR causes cross-request data leaks.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A composable is a recipe card. If the cake is baked once and shared by everyone, it is global state; if everyone bakes their own cake from the same recipe, it is local state.',
    story: [
      'Imagine a recipe card that tells you how to make a cake. The card itself is the composable — the instructions you reuse.',
      'If you bake ONE big cake on the kitchen counter and the whole family shares slices from it, everyone is touching the same cake — that is shared state.',
      'But if you hand the same recipe to each family member and they each bake their own little cake, everyone has a separate cake that does not affect the others — that is local state.',
      'The clever part: whether you get one shared cake or many separate ones depends only on WHERE you put the bowl — on the shared counter, or inside each person\'s own kitchen.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A composable is just a function (usually named useSomething) that groups reusable reactive logic so multiple components can use it.',
    'If you create the reactive state INSIDE the function, every component that calls it gets its own fresh copy — that is local, per-component state.',
    'If you create the state OUTSIDE the function, at the top of the file, it is made only once and shared by everyone who calls the function — that is global, shared state.',
    'So the same composable can be a private helper or a tiny global store, depending on where the state lives.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A composable is a function that encapsulates reactive logic and returns reactive state and helpers. Whether the state is shared depends on scope: state declared at module level is a shared singleton across all callers; state declared inside the function is created per call (per component).',
    how: 'For shared state, declare ref/reactive at the top of the module (outside the exported function) so JavaScript creates it once when the module loads, then return it (often as readonly) plus mutators from the function. For local state, declare it inside the function.',
    why: 'This gives you a library-free way to share global state and a clean way to package reusable per-component logic, all built on plain module scope and closures plus Vue reactivity.',
    code: {
      label: 'Singleton (shared) vs factory (local)',
      lang: 'js',
      code: '// SHARED — module-level state = one instance for the whole app\nimport { ref } from \'vue\'\nconst user = ref(null)                 // created ONCE at module load\nexport function useAuth() {\n  function login(u) { user.value = u }\n  return { user, login }               // every caller shares `user`\n}\n\n// LOCAL — state inside the function = fresh per call\nexport function useToggle(initial = false) {\n  const on = ref(initial)              // new ref every call\n  return { on, toggle: () => (on.value = !on.value) }\n}',
      explanation: [
        'In useAuth, `user` is at module scope, so it is created once and shared by all callers.',
        'Every component calling useAuth().user reads/writes the SAME ref.',
        'In useToggle, `on` is inside the function, so each call returns an independent ref.',
        'The ONLY difference is the position of the ref declaration.',
        'This is plain JS module scope + closures — Vue reactivity just makes the shared ref reactive.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'State sharing via composables exploits ES module scope: a ref/reactive declared at module top-level is instantiated once (modules are singletons evaluated once per module registry) and closed over by the exported composable, so all callers reference the same reactive state — a library-free global store. State declared inside the composable is created per invocation, yielding per-component instances. Best practice exposes shared state as readonly with explicit mutators. Under SSR this singleton is shared across requests, so genuinely request-scoped state must use Pinia or a per-request factory rather than a module-level singleton.',

  // 7. Internal Working
  internalWorking: [
    'When a module is first imported, its top-level code runs exactly once; the module instance is cached in the module registry, so top-level refs are created a single time.',
    'The exported composable function closes over those module-level refs, so every call returns references to the same reactive objects (closure capture of module bindings).',
    'Vue reactivity makes those refs track/trigger normally, so all components reading the shared ref subscribe and re-render on mutation regardless of which component changed it.',
    'When state is declared inside the composable, each call allocates new refs in that call\'s scope, producing isolated per-component state with no sharing.',
    'readonly() wraps the shared state in a Proxy that throws/warns on writes, forcing mutations through the exposed functions for centralized control.',
    'On the server, the module registry persists across requests in the same process, so a module-level singleton is shared by all concurrent requests — the root cause of SSR state leakage.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: '  MODULE useAuth.js  (evaluated ONCE)\n  ┌───────────────────────────────────────────────┐\n  │  const user = ref(null)   ◄── single instance   │\n  │         ▲         ▲         ▲                    │\n  │  closure│  closure│  closure│                    │\n  │  ┌──────┴──┐ ┌────┴────┐ ┌──┴──────┐             │\n  │  │useAuth()│ │useAuth()│ │useAuth()│  (calls)     │\n  │  └────┬────┘ └────┬────┘ └────┬────┘             │\n  └───────┼──────────┼───────────┼──────────────────┘\n        CompA      CompB        CompC   → all SHARE one user\n\n  vs. state INSIDE the function → each call gets its OWN ref → isolated.',

  // 9. Memory Visualization
  memoryVisualization: [
    'Module-level state: allocated once on first import and retained for the page/process lifetime; shared by reference across all importers.',
    'Per-call state: allocated each time the composable runs (typically once per component setup) and freed when that component unmounts.',
    'Closures: the exported function holds a closure over module bindings, keeping shared state reachable as long as the module is loaded.',
    'SSR: the module-level singleton is one heap object per server process, reused across requests — long-lived and dangerously shared unless made request-scoped.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — shared toast state',
      lang: 'js',
      code: '// useToasts.js\nimport { ref, readonly } from \'vue\'\nconst toasts = ref([])                       // shared singleton\nexport function useToasts() {\n  function push(msg) { toasts.value.push({ id: Date.now(), msg }) }\n  function dismiss(id) { toasts.value = toasts.value.filter((t) => t.id !== id) }\n  return { toasts: readonly(toasts), push, dismiss }\n}',
      explanation: [
        'toasts lives at module scope, so any component can push a toast and all see it.',
        'readonly(toasts) prevents components mutating the array directly.',
        'push/dismiss are the controlled mutators.',
        'No store library needed for this app-wide concern.',
      ],
    },
    intermediate: {
      label: 'Intermediate — per-component logic (factory)',
      lang: 'js',
      code: '// useMouse.js — fresh state per component\nimport { ref, onMounted, onUnmounted } from \'vue\'\nexport function useMouse() {\n  const x = ref(0), y = ref(0)\n  function update(e) { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', update))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', update))\n  return { x, y }\n}',
      explanation: [
        'x and y are declared inside, so each component gets its own coordinates.',
        'Lifecycle hooks register/clean up per component — composables can use them.',
        'This is reusable logic, NOT shared state.',
        'Calling useMouse() in two components gives two independent trackers.',
        'Cleanup in onUnmounted prevents listener leaks.',
      ],
    },
    advanced: {
      label: 'Advanced — lazy singleton with controlled init',
      lang: 'js',
      code: '// useFeatureFlags.js\nimport { ref, readonly } from \'vue\'\nconst flags = ref(null)\nlet inited = false\nexport function useFeatureFlags() {\n  async function init() {\n    if (inited) return\n    inited = true\n    flags.value = await (await fetch(\'/api/flags\')).json()\n  }\n  const isOn = (k) => !!flags.value?.[k]\n  return { flags: readonly(flags), isOn, init }\n}',
      explanation: [
        'flags and the inited guard are module-level, so initialization happens once.',
        'init() is idempotent — repeated calls do not refetch.',
        'isOn reads the shared flags reactively across the app.',
        'This is the singleton pattern with controlled, one-time async setup.',
        'Components call init() early (e.g. in App.vue) and isOn() anywhere.',
      ],
    },
    realProject: {
      label: 'Real project — SSR-safe shared state via a factory + provide',
      lang: 'js',
      code: '// createAuth.js — per-request instance to avoid SSR leakage\nimport { ref } from \'vue\'\nexport function createAuth() {\n  const user = ref(null)\n  function login(u) { user.value = u }\n  return { user, login }\n}\n\n// in app setup (server creates one per request):\n// const auth = createAuth(); app.provide(\'auth\', auth)\n// components: const auth = inject(\'auth\')',
      explanation: [
        'A module-level singleton would leak across SSR requests — instead use a factory.',
        'createAuth() makes a fresh instance; the app provides it so components inject it.',
        'On the server each request calls createAuth(), isolating user data.',
        'On the client there is one instance per app, behaving like a singleton.',
        'This is the SSR-correct alternative to a top-level module ref.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a composable?',
      answer: 'A composable is a reusable function (conventionally named useSomething) that encapsulates reactive logic using Vue\'s reactivity APIs and returns reactive state and helper functions for components to use.',
      explanation: 'Naming the convention and that it returns reactive state covers the basics.',
    },
    {
      level: 'beginner',
      question: 'How do you make a composable share state across components?',
      answer: 'Declare the reactive state (ref/reactive) at module top-level, outside the exported function, so it is created once and every caller closes over the same instance. Return it (ideally readonly) plus mutators.',
      explanation: 'Module-scope placement is the entire mechanism.',
    },
    {
      level: 'intermediate',
      question: 'Why does state declared inside a composable NOT get shared?',
      answer: 'Because the function body runs on every call, so each invocation allocates new refs. Only state lifted to module scope is created once and shared via closure.',
      explanation: 'Connecting it to per-call execution vs one-time module evaluation shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'How is a composable singleton different from a Pinia store?',
      answer: 'A composable singleton is a library-free module-level ref — minimal, no devtools, no formal structure, and NOT SSR-safe by default. Pinia adds devtools, structure (state/getters/actions), plugins, typing, and per-request SSR isolation.',
      explanation: 'The SSR-safety and tooling gap is the key differentiator.',
    },
    {
      level: 'advanced',
      question: 'Why does a module-level composable singleton leak state in SSR, and how do you fix it?',
      answer: 'The module is evaluated once per server process, so the singleton is shared across all concurrent requests, leaking one user\'s state to another. Fix it with a factory function called per request (provide/inject the instance) or use Pinia, which creates a fresh store tree per request.',
      explanation: 'The per-process module evaluation and the factory/Pinia fix are the senior points.',
    },
    {
      level: 'senior',
      question: 'When would you choose a composable singleton over Pinia, and vice versa?',
      answer: 'Use a composable singleton for tiny, self-contained client-only global state (theme, toasts) where you want zero dependencies and minimal ceremony. Use Pinia when you need devtools, persistence, structured actions/getters, TypeScript ergonomics at scale, or SSR safety. The deciding factors are tooling needs, SSR, and complexity.',
      explanation: 'Articulating the trade-off axes (tooling, SSR, scale) is the senior-level answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Where exactly is module-level state created, and how many times?',
    'How do closures make the sharing work?',
    'Why is a module singleton unsafe in SSR but fine in a SPA?',
    'How do you expose shared state read-only?',
    'Can a composable use lifecycle hooks? What are the constraints?',
    'How would you make a per-request singleton with provide/inject?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Declaring intended-shared state inside the composable function.',
      why: 'Each call creates a new copy, so components silently do not share — a hard-to-spot desync bug.',
      fix: 'Lift the ref/reactive to module top-level (outside the function) for true sharing.',
    },
    {
      mistake: 'Using a module-level singleton for shared state in an SSR/Nuxt app.',
      why: 'The module is evaluated once per server process, leaking state across requests.',
      fix: 'Use a per-request factory with provide/inject, or use Pinia (request-scoped).',
    },
    {
      mistake: 'Exposing shared state as a mutable ref to all consumers.',
      why: 'Any component can mutate it, scattering logic and making changes untraceable.',
      fix: 'Return readonly(state) and explicit mutator functions.',
    },
    {
      mistake: 'Putting lifecycle hooks in a shared singleton expecting per-component cleanup.',
      why: 'onMounted/onUnmounted in a shared composable bind to whichever component calls it, which is fragile for global state.',
      fix: 'Keep lifecycle-bound logic in per-component (factory) composables; manage global resources explicitly.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Theme, locale, toasts, and feature flags are commonly shared via module-level composable singletons with readonly state and mutators.' },
    { area: 'Component library', detail: 'Reusable per-component logic (useMouse, useIntersectionObserver, useFetch) ships as factory composables with proper lifecycle cleanup — VueUse is built this way.' },
    { area: 'Nuxt', detail: 'Module singletons are avoided server-side; Nuxt provides useState() and Pinia for SSR-safe shared state instead.' },
    { area: 'Pinia', detail: 'Teams use composable singletons for trivial global state and graduate to Pinia when devtools, persistence, or SSR isolation are needed.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'A shared singleton avoids duplicating state and keeps one dependency graph for all consumers.',
      'Factory composables allocate only when used and clean up on unmount, keeping memory tight.',
    ],
    bad: [
      'A broad shared reactive object causes many consumers to re-render on any property change.',
      'Forgetting cleanup in factory composables leaks listeners/timers per component instance.',
    ],
    optimizations: [
      'Split shared state so consumers subscribe only to what they need.',
      'Expose readonly + derived computed values to limit unnecessary re-renders.',
      'Always clean up listeners/timers in onUnmounted for factory composables.',
      'Use shallowRef for large shared structures that change wholesale.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['composables', 'ref', 'reactive', 'state-management-overview'],
    nextConcepts: ['pinia-basics', 'provide-inject-state', 'composition-reuse-patterns', 'testing-composables'],
    dependencyNote:
      'Builds directly on composables and the ref/reactive primitives. It is the bridge between reusable logic and lightweight global state, contrasting with provide-inject-state (subtree scope) and pinia-basics (formal global state).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a module box; put a ref at the TOP, outside the function, labelled "created once".',
      'Draw the exported useX() function inside, with a closure arrow up to that ref.',
      'Draw three components all calling useX(), arrows converging on the one shared ref.',
      'Then draw a second version with the ref INSIDE the function and three separate refs branching out.',
      'Say: "Module-scope = one shared instance via closure; in-function = fresh per call. In SSR the module singleton leaks across requests, so I use a factory + provide or Pinia."',
    ],
    diagram: '  SHARED                          LOCAL\n  module {                        export function useX(){\n    const s = ref()  ◄─closure┐     const s = ref()  // new each call\n    export useX(){ return s } ─┘     return s\n  }                               }\n  CompA CompB CompC → one s       CompA→s1 CompB→s2 CompC→s3',
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A composable is a reusable function returning reactive state and helpers. Whether state is shared depends only on scope: declare the ref OUTSIDE the function (module level) and it is created once and shared by all callers via closure — a library-free global store; declare it INSIDE and each call gets its own copy (per-component logic). Expose shared state as readonly with mutators. Crucial gotcha: a module-level singleton leaks across requests in SSR, so use a per-request factory + provide/inject or Pinia there.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A composable is Vue 3\'s main code-reuse primitive — a function, conventionally named useSomething, that bundles reactive logic with the Composition API and returns reactive state and helpers. The interesting part for state sharing is that whether the state is shared or per-component depends entirely on where you declare it, which comes down to plain JavaScript module scope and closures. If I declare a ref at the top of the module, outside the exported function, it is created exactly once when the module is first imported, because ES modules are evaluated a single time and cached. The exported function then closes over that ref, so every component that calls the composable references the same reactive state — that is effectively a library-free global store, perfect for theme, locale, toasts, or feature flags. If instead I declare the ref inside the function, the body runs on every call, so each component gets its own fresh copy — that is the right shape for reusable per-component logic like useMouse, where each component tracks its own coordinates and cleans up its own listeners in onUnmounted. For shared state I expose it as readonly plus explicit mutator functions so changes stay centralized. The big caveat is SSR: because the module is evaluated once per server process, a module-level singleton is shared across all concurrent requests, which leaks one user\'s state into another\'s. So in a Nuxt or SSR app I either use a factory function called per request and hand the instance down via provide/inject, or I use Pinia, which is request-scoped by design. The rule of thumb: composable singletons for tiny client-only global state with zero dependencies, Pinia when I need devtools, persistence, structure, or SSR safety.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Composable singleton vs Pinia: zero dependency and minimal ceremony versus devtools, structure, persistence, and SSR safety.',
      'Module-level sharing is implicit and easy to misuse (in-function vs module-level) compared to an explicit store.',
      'readonly + mutators add control at the cost of more boilerplate than a raw shared ref.',
    ],
    edgeCases: [
      'Tree-shaking/module duplication: if a module is bundled twice (e.g. mismatched dependency versions), you can accidentally get two singletons.',
      'Lifecycle hooks in a shared singleton bind to whichever component happens to call it, which is fragile.',
      'Lazy one-time init needs an explicit guard flag to avoid duplicate async setup.',
    ],
    runtimeBehavior: [
      'Top-level module code runs once per module registry entry; the singleton is a closure capture, not Vue-specific.',
      'Shared reactive state triggers all subscribers through the standard async render queue.',
      'Per-call composables allocate and free with component lifetime, so cleanup discipline matters.',
    ],
    scalability: [
      'For many small global concerns, composable singletons keep bundles tiny and avoid store ceremony.',
      'As state grows or needs tooling/SSR, graduate to Pinia rather than expanding ad-hoc singletons.',
      'Split shared state and expose computed/readonly views to keep re-render fan-out narrow.',
    ],
    productionConcerns: [
      'SSR cross-request leakage is the headline risk — never use module singletons for per-user state on the server.',
      'Document whether a composable shares state, since the call signature does not reveal it.',
      'Ensure factory composables clean up listeners/timers to avoid per-instance leaks.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Composable = reusable function returning reactive state + helpers (useX).',
    'State at MODULE level (outside fn) = shared singleton (created once).',
    'State INSIDE the fn = fresh per call = per-component logic.',
    'Sharing works via ES module single-evaluation + closures.',
    'Expose shared state as readonly() + mutator functions.',
    'Module singleton LEAKS across requests in SSR.',
    'SSR fix: per-request factory + provide/inject, or Pinia.',
    'Factory composables can use lifecycle hooks; clean up in onUnmounted.',
    'Lazy init needs an idempotency guard flag.',
    'Choose singleton for tiny client global state; Pinia for tooling/SSR/scale.',
    'Beware duplicate module instances creating two singletons.',
    'Call signature does not reveal sharing — document it.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write useDarkMode() that shares an enabled flag across the whole app and a toggle() function.',
      hint: 'Put the ref at module scope.',
      solution: {
        lang: 'js',
        code: 'import { ref, readonly } from \'vue\'\nconst enabled = ref(false)              // module scope = shared\nexport function useDarkMode() {\n  function toggle() { enabled.value = !enabled.value }\n  return { enabled: readonly(enabled), toggle }\n}',
        explanation: [
          'enabled is shared because it is declared once at module scope.',
          'readonly + toggle keep mutation controlled.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write useCounter() as a FACTORY so each component gets its own independent counter.',
      hint: 'Declare the ref inside the function.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nexport function useCounter(start = 0) {\n  const count = ref(start)              // inside = fresh per call\n  return { count, inc: () => count.value++ }\n}',
        explanation: [
          'count is created on each call, so components do not share it.',
          'This is reusable logic rather than shared state.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Convert a shared module-level auth singleton into an SSR-safe per-request factory exposed via provide/inject.',
      hint: 'Replace the top-level ref with a createAuth() factory.',
      solution: {
        lang: 'js',
        code: '// createAuth.js\nimport { ref } from \'vue\'\nexport function createAuth() {\n  const user = ref(null)\n  return { user, login: (u) => (user.value = u) }\n}\n// server: per request → const auth = createAuth(); app.provide(\'auth\', auth)\n// component: const auth = inject(\'auth\')',
        explanation: [
          'A factory makes a fresh instance per request, avoiding cross-request leaks.',
          'provide/inject distributes the request-scoped instance to components.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate\'s useCart() composable declares `const items = ref([])` inside the function and reports that adding to the cart in one component does not show in another. Diagnose and fix.',
      hint: 'Where is the state created?',
      solution: {
        lang: 'js',
        code: '// BUG: items is inside the function → each component gets its own copy\n// export function useCart() { const items = ref([]); ... }\n\n// FIX: lift items to module scope so it is shared\nimport { ref, readonly } from \'vue\'\nconst items = ref([])\nexport function useCart() {\n  function add(i) { items.value.push(i) }\n  return { items: readonly(items), add }\n}',
        explanation: [
          'In-function state is per-call, so the two components had separate carts.',
          'Lifting items to module scope makes it a shared singleton.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This concept reveals whether you truly understand module scope, closures, and reactivity — not just Vue syntax. It is the difference between accidentally shipping a desync bug or an SSR data leak and confidently choosing between a tiny singleton and a full store.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is a composable". Product companies (Zoho, Flipkart, Razorpay) ask how to share state with a composable and the singleton-vs-factory distinction. FAANG-level interviews probe the SSR cross-request leak, module evaluation semantics, and when to pick a singleton over Pinia.',
    whatInterviewersExpect:
      'They expect you to explain module-scope sharing via closures, contrast singleton vs factory, expose readonly + mutators, identify the SSR leak and its factory/Pinia fix, and articulate when each approach is appropriate.',
  },
}

export default stateSharingComposables
