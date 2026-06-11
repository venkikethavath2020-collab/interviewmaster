import type { ConceptLesson } from '../../../types/lesson'

const suspense: ConceptLesson = {
  // 1. Concept Summary
  slug: 'suspense',
  name: 'Suspense',
  category: 'built-in',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Suspense lets you coordinate async dependencies (async components, async setup) and show a single fallback while they load — no manual loading flags scattered everywhere.',
    'It enables top-level await directly in <script setup>, a clean way to fetch data before a component renders.',
    'It is the building block for graceful loading UX: one spinner for a whole async subtree instead of flickering placeholders.',
    'It pairs with async components, the router, and SSR streaming, so it shows up in advanced architecture discussions.',
    'Interviewers use it to test whether you understand async rendering, the experimental-feature caveat, and error handling for async setup.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Suspense is like a "Please wait, your food is cooking" sign that shows until ALL the dishes are ready.',
    story: [
      'Imagine you order a big meal at a restaurant with several dishes that take different times to cook.',
      'Instead of bringing out each dish one by one and making the table look messy and half-empty, the waiter puts a "cooking, please wait" card on your table.',
      'Only when every dish is ready does the waiter clear the card and bring the whole meal out together.',
      'Suspense does this for parts of your app that need to load data: it shows one "loading" message until everything inside is ready, then swaps in the finished content all at once.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some components need to fetch data or load extra code before they can show anything, and that takes time.',
    'Suspense is a built-in Vue component with two slots: a default slot for the real content and a fallback slot for what to show while it loads.',
    'It waits for all the async work inside its default slot to finish, showing the fallback in the meantime.',
    'When everything is ready, it swaps the fallback out and reveals the real content together.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Suspense is a built-in component that orchestrates async dependencies in its default slot — async components and components with an async setup() — and renders a fallback slot until all of them resolve.',
    how: 'You provide #default and #fallback slots. While any async setup or async component in the default tree is pending, Suspense shows the fallback. Once all resolve, it swaps to the default content. It also emits pending/resolve/fallback events you can hook into.',
    why: 'It removes the need for per-component loading booleans and prevents layout flicker by coordinating multiple async sources into a single loading state for the whole subtree.',
    code: {
      label: 'Suspense with an async-setup child',
      lang: 'vue',
      code: '<!-- UserCard.vue uses top-level await in setup -->\n<script setup>\nconst user = await fetch(\'/api/me\').then(r => r.json())\n</script>\n<template>\n  <p>{{ user.name }}</p>\n</template>\n\n<!-- Parent uses Suspense to show a fallback while UserCard loads -->\n<template>\n  <Suspense>\n    <template #default>\n      <UserCard />\n    </template>\n    <template #fallback>\n      <p>Loading user…</p>\n    </template>\n  </Suspense>\n</template>',
      explanation: [
        'UserCard uses top-level await in <script setup>, making its setup() async.',
        'Suspense detects the pending async setup and shows the #fallback slot.',
        'When the fetch resolves, Suspense swaps in the #default content.',
        'No manual isLoading flag is needed in the parent.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Suspense is a built-in component that renders one of two slots — default or fallback — based on the resolution state of asynchronous dependencies in its default subtree. Async dependencies are components with an async setup() (including top-level await in <script setup>) and async components created via defineAsyncComponent. Suspense tracks the count of pending async setups; while any are pending it shows the fallback, and once all resolve it commits and displays the default tree. It exposes pending, resolve, and fallback events, supports a timeout prop, and underpins SSR streaming and router-level loading. It is still marked experimental in the Vue docs.',

  // 7. Internal Working
  internalWorking: [
    'When Suspense mounts, it renders its default slot subtree but defers committing it to the DOM while async dependencies are pending; it tracks a counter of outstanding async setup promises.',
    'Components with an async setup() return a promise; Suspense intercepts these and increments its pending counter for each, registering a continuation when they resolve.',
    'While the counter is greater than zero, Suspense displays the fallback slot in the DOM instead of the default subtree.',
    'As each async dependency resolves, the counter decrements; when it reaches zero, Suspense "resolves": it swaps the fallback out and mounts/commits the fully-prepared default subtree in one go.',
    'Suspense emits lifecycle events — pending (entering loading), resolve (default committed), and fallback (showing fallback) — and an optional timeout can delay showing the fallback to avoid flicker on fast loads.',
    'On subsequent updates that introduce new async dependencies (e.g. switching to a new async route component), Suspense can re-enter the pending state and show the fallback again, keeping the previous content until the new tree is ready.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        <Suspense>
          ├─ #default ── (async setup / async components)
          │      │
          │      ▼  pending count > 0
          │   ┌─────────────┐
          │   │  FALLBACK   │  shown in DOM
          │   └─────────────┘
          │      │ all promises resolve → count == 0
          │      ▼
          │   ┌─────────────┐
          │   │  DEFAULT    │  committed + shown together
          │   └─────────────┘
          └─ events: pending → (fallback) → resolve`,

  // 9. Memory Visualization — omitted

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — fallback while an async component loads',
      lang: 'vue',
      code: '<script setup>\nimport { defineAsyncComponent } from \'vue\'\nconst Chart = defineAsyncComponent(() => import(\'./HeavyChart.vue\'))\n</script>\n\n<template>\n  <Suspense>\n    <template #default><Chart /></template>\n    <template #fallback><div class="skeleton" /></template>\n  </Suspense>\n</template>',
      explanation: [
        'defineAsyncComponent lazy-loads HeavyChart as a separate chunk.',
        'Suspense shows the skeleton fallback while the chunk loads.',
        'When the component code arrives and mounts, the skeleton is replaced.',
        'This coordinates code-splitting loading state declaratively.',
      ],
    },
    intermediate: {
      label: 'Intermediate — multiple async children, one fallback',
      lang: 'vue',
      code: '<template>\n  <Suspense>\n    <template #default>\n      <!-- both have async setup; Suspense waits for BOTH -->\n      <UserProfile />\n      <UserActivity />\n    </template>\n    <template #fallback>\n      <p>Loading dashboard…</p>\n    </template>\n  </Suspense>\n</template>',
      explanation: [
        'Suspense aggregates all async dependencies in its default tree.',
        'The fallback shows until BOTH UserProfile and UserActivity resolve.',
        'This prevents one panel appearing before the other (no flicker).',
        'One coordinated loading state replaces two separate spinners.',
      ],
    },
    advanced: {
      label: 'Advanced — error handling for async setup',
      lang: 'vue',
      code: '<script setup>\nimport { onErrorCaptured, ref } from \'vue\'\nconst error = ref(null)\n// errors thrown in a child\'s async setup propagate up and can be captured here\nonErrorCaptured((err) => {\n  error.value = err\n  return false // stop propagation\n})\n</script>\n\n<template>\n  <div v-if="error">Failed to load: {{ error.message }}</div>\n  <Suspense v-else>\n    <template #default><AsyncWidget /></template>\n    <template #fallback>Loading…</template>\n  </Suspense>\n</template>',
      explanation: [
        'A rejected promise in a child\'s async setup throws during resolution.',
        'Suspense itself has no error slot, so you use onErrorCaptured on a parent.',
        'Capturing the error lets you render an error UI instead of a stuck fallback.',
        'This is the standard pattern since Suspense does not handle errors itself.',
      ],
    },
    realProject: {
      label: 'Real project — Suspense around a lazy route view',
      lang: 'vue',
      code: '<template>\n  <router-view v-slot="{ Component }">\n    <Suspense>\n      <template #default>\n        <component :is="Component" />\n      </template>\n      <template #fallback>\n        <PageSkeleton />\n      </template>\n    </Suspense>\n  </router-view>\n</template>',
      explanation: [
        'Route components that use async setup show a unified page skeleton while loading.',
        'Navigating keeps the previous page until the new async route resolves, avoiding blank flashes.',
        'Combine with an onErrorCaptured boundary to handle failed route data.',
        'This is a common app-shell pattern for data-driven pages.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is Suspense used for?',
      answer: 'It coordinates async dependencies (async components and components with async setup) in its default slot and shows a fallback slot until they all resolve, then reveals the content together.',
      explanation: 'A good answer names both async sources and the two-slot fallback mechanism.',
    },
    {
      level: 'beginner',
      question: 'What counts as an async dependency for Suspense?',
      answer: 'A component with an async setup() — including using top-level await in <script setup> — and async components created with defineAsyncComponent.',
      explanation: 'Top-level await enabling async setup is the key modern feature to mention.',
    },
    {
      level: 'intermediate',
      question: 'How does Suspense handle multiple async children?',
      answer: 'It tracks a count of all pending async setups in its default tree and only swaps from fallback to content when every one has resolved, so the whole subtree appears together.',
      explanation: 'The "wait for all, show together" behavior is the differentiator vs per-component loading.',
    },
    {
      level: 'intermediate',
      question: 'How do you handle errors from async setup under Suspense?',
      answer: 'Suspense has no error slot, so a rejected async setup propagates as a captured error. Use onErrorCaptured on a parent (or an error-boundary component) to catch it and render an error UI.',
      explanation: 'Knowing Suspense does NOT handle errors itself is the practical gotcha.',
    },
    {
      level: 'advanced',
      question: 'What is the timeout prop and why use it?',
      answer: 'timeout delays showing the fallback for a given number of milliseconds, so very fast async resolutions don\'t flash a spinner. If resolution finishes within the timeout, the fallback never appears.',
      explanation: 'This shows awareness of loading-flicker UX, a senior consideration.',
    },
    {
      level: 'senior',
      question: 'How does Suspense relate to SSR and what are its caveats?',
      answer: 'Suspense underpins SSR/streaming by letting the server wait for async data before flushing a subtree. Caveats: it is still marked experimental, it doesn\'t handle errors itself, and re-entering pending on navigation can keep stale content visible, so you coordinate it with error boundaries and possibly transitions.',
      explanation: 'Naming SSR, the experimental status, and error/stale-content nuances is a strong senior answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does async setup() differ from fetching in onMounted?',
    'Why does Suspense not have an error slot, and what do you use instead?',
    'What events does Suspense emit (pending/resolve/fallback)?',
    'How do you avoid spinner flicker with the timeout prop?',
    'How does Suspense behave when navigating between async route components?',
    'Is Suspense production-ready, and what is the experimental caveat?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting Suspense to catch and display async errors itself.',
      why: 'Suspense only manages loading; rejected async setups propagate as errors with no built-in error slot.',
      fix: 'Wrap with onErrorCaptured or an error-boundary component to render a failure UI.',
    },
    {
      mistake: 'Using top-level await in setup() without a Suspense ancestor.',
      why: 'An async setup component must be rendered under Suspense to be coordinated; otherwise behavior is undefined/warns.',
      fix: 'Always place async-setup components inside a <Suspense> boundary.',
    },
    {
      mistake: 'Putting heavy data fetching in async setup that blocks the whole subtree.',
      why: 'Suspense waits for all async deps, so one slow fetch delays everything in the default slot.',
      fix: 'Split independent async parts into separate Suspense boundaries or fetch non-blocking in onMounted where appropriate.',
    },
    {
      mistake: 'Relying on Suspense as a stable, finalized API.',
      why: 'It is still marked experimental and its API/behavior may change between versions.',
      fix: 'Use it deliberately, isolate it, and follow release notes; have fallbacks if the API shifts.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Wrapping data-driven views in Suspense provides a single loading state for async setup components instead of scattered isLoading flags.' },
    { area: 'Vue Router', detail: 'Suspense around router-view gives a unified page skeleton while async route components resolve, with the previous page held until ready.' },
    { area: 'SSR', detail: 'Suspense lets the server await async data before flushing a subtree and underpins streaming SSR; Nuxt builds higher-level data fetching on similar mechanics.' },
    { area: 'Component library', detail: 'Lazy-loaded heavy widgets (charts, editors) are paired with Suspense fallbacks/skeletons for graceful code-split loading.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Coordinates multiple async sources into one loading state, avoiding layout flicker from staggered placeholders.',
      'Pairs with code-splitting so heavy chunks load behind a clean fallback.',
    ],
    bad: [
      'A single slow async dependency blocks the entire default subtree from showing.',
      'Over-broad boundaries make a small slow fetch delay a large UI region.',
    ],
    optimizations: [
      'Scope Suspense boundaries narrowly so independent regions load independently.',
      'Use the timeout prop to avoid flashing the fallback on fast loads.',
      'Combine with defineAsyncComponent loading/error/delay options for fine control.',
      'Keep blocking async setup minimal; defer non-critical fetches to after render.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['async-components', 'script-setup', 'lifecycle-hooks-composition'],
    nextConcepts: ['error-handling-vue', 'ssr-hydration', 'data-fetching-patterns', 'transition'],
    dependencyNote:
      'Suspense builds on async components and async setup() (top-level await in <script setup>). It depends on understanding the composition lifecycle, and it connects to error handling (since it doesn\'t catch errors itself), SSR/hydration, and data-fetching patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw <Suspense> with two branches: #default (async children) and #fallback.',
      'Show a pending counter next to default; while > 0, draw the fallback as the visible DOM.',
      'Draw arrows for each async promise resolving, decrementing the counter to 0.',
      'At 0, draw the swap: fallback out, default committed and shown together.',
      'Say: "Suspense waits for ALL async deps then reveals the subtree at once; it emits pending/resolve and does NOT handle errors — use onErrorCaptured."',
    ],
    diagram: `  <Suspense>
    #default: [AsyncA, AsyncB]   pending=2 → show #fallback
                   │ A resolves → pending=1
                   │ B resolves → pending=0
                   ▼
              commit #default (shown together)
    events: pending → (fallback) → resolve
    errors → propagate → onErrorCaptured (no error slot)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Suspense is a built-in component that coordinates async dependencies — async components and components with async setup (top-level await in script setup) — and shows a #fallback slot until they all resolve, then reveals the #default content together. It tracks a pending counter and emits pending/resolve/fallback events; a timeout prop avoids spinner flicker. Crucially it does NOT handle errors — use onErrorCaptured. It underpins SSR streaming and router loading but is still marked experimental.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Suspense is a built-in Vue component for orchestrating asynchronous rendering. The problem it solves is that components often need to load before they can render — either because they are async components loaded via defineAsyncComponent for code-splitting, or because their setup() is asynchronous, which in modern Vue you get simply by using top-level await inside <script setup>. Without Suspense you\'d sprinkle isLoading booleans everywhere and risk staggered, flickery placeholders. Suspense gives you two slots: #default for the real content and #fallback for the loading state. Internally it tracks a counter of pending async setups in its default subtree; while that counter is above zero it shows the fallback, and only when every async dependency has resolved does it commit and reveal the whole default tree at once — so the UI appears coordinated instead of piecemeal. It also emits pending, resolve, and fallback events, and accepts a timeout prop that delays showing the fallback so a fast load doesn\'t flash a spinner. A really important nuance for interviews: Suspense does NOT handle errors. If a child\'s async setup rejects, that error propagates, and you catch it with onErrorCaptured on a parent or a dedicated error boundary to render a failure state — otherwise the fallback can hang. In practice you commonly wrap a router-view in Suspense so async route components show one page skeleton, holding the previous page until the new one is ready. Two final caveats worth stating: a single slow async dependency blocks the whole default subtree, so scope boundaries narrowly; and Suspense is still marked experimental in the docs, so use it deliberately and watch release notes. It also underpins SSR streaming by letting the server await async data before flushing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'One coordinated loading state (clean UX) vs the whole subtree being gated by the slowest dependency.',
      'Declarative async orchestration vs an experimental API that may change and lacks built-in error handling.',
    ],
    edgeCases: [
      'Rejected async setup needs onErrorCaptured; Suspense has no error slot.',
      'Re-entering pending on navigation keeps previous content visible until the new tree resolves.',
      'Async setup must run under a Suspense ancestor or behavior is undefined.',
      'timeout interacts with fast resolutions to suppress fallback flicker.',
    ],
    runtimeBehavior: [
      'Suspense defers committing the default subtree to the DOM until the pending counter hits zero.',
      'Each async setup returns a promise tracked by the boundary; resolution decrements the counter.',
      'Events (pending/resolve/fallback) let you drive analytics or coordinate transitions.',
    ],
    scalability: [
      'Narrow, independent Suspense boundaries let regions load in parallel without blocking each other.',
      'For SSR, Suspense enables streaming so the shell flushes early while async parts resolve.',
    ],
    productionConcerns: [
      'Experimental status — isolate usage and track API changes.',
      'Missing error handling can leave a hung fallback; always pair with an error boundary.',
      'Over-broad boundaries hurt perceived performance when one fetch is slow.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Suspense coordinates async deps and shows #fallback until all resolve.',
    'Async deps = async components (defineAsyncComponent) + async setup (top-level await).',
    'Reveals #default all at once when the pending counter hits 0.',
    'Emits pending / resolve / fallback events.',
    'timeout prop delays the fallback to avoid spinner flicker.',
    'Does NOT handle errors — use onErrorCaptured / error boundary.',
    'Async-setup components must live under a Suspense ancestor.',
    'One slow dependency blocks the whole subtree → scope boundaries narrowly.',
    'Underpins SSR streaming and unified router loading.',
    'Still marked experimental — use deliberately.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Wrap an async-setup component in Suspense with a loading fallback.',
      hint: 'Use #default and #fallback slots.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <Suspense>\n    <template #default><AsyncCard /></template>\n    <template #fallback><p>Loading…</p></template>\n  </Suspense>\n</template>',
        explanation: [
          'Suspense shows the fallback while AsyncCard\'s async setup is pending.',
          'It swaps to AsyncCard when the promise resolves.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add an error boundary so a failed async setup shows an error instead of hanging.',
      hint: 'onErrorCaptured on the parent.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onErrorCaptured } from \'vue\'\nconst err = ref(null)\nonErrorCaptured((e) => { err.value = e; return false })\n</script>\n<template>\n  <p v-if="err">Error: {{ err.message }}</p>\n  <Suspense v-else>\n    <template #default><AsyncCard /></template>\n    <template #fallback>Loading…</template>\n  </Suspense>\n</template>',
        explanation: [
          'Suspense has no error slot, so a rejected async setup would otherwise hang the fallback.',
          'onErrorCaptured catches the propagated error and renders an error UI.',
          'Returning false stops further propagation.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Use timeout so a fast load (< 200ms) never flashes the fallback.',
      hint: 'Bind the timeout prop.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <Suspense :timeout="200">\n    <template #default><AsyncCard /></template>\n    <template #fallback><Spinner /></template>\n  </Suspense>\n</template>',
        explanation: [
          'timeout delays showing the fallback by 200ms.',
          'If AsyncCard resolves within 200ms, the spinner never appears.',
          'This avoids jarring spinner flicker on fast networks.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Set up Suspense around a lazy router-view with a page skeleton, holding the previous page until the new one resolves.',
      hint: 'Use the router-view v-slot pattern.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <router-view v-slot="{ Component }">\n    <Suspense>\n      <template #default>\n        <component :is="Component" />\n      </template>\n      <template #fallback>\n        <PageSkeleton />\n      </template>\n    </Suspense>\n  </router-view>\n</template>',
        explanation: [
          'The v-slot pattern exposes the matched route component.',
          'Async route components trigger the skeleton fallback while resolving.',
          'Pair with onErrorCaptured for failed route data; the previous content stays until the new tree commits.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Suspense is how modern Vue handles async rendering cleanly. Understanding it — especially that it coordinates all async deps, doesn\'t handle errors, and is still experimental — signals you can design polished loading UX and reason about async component trees and SSR.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what Suspense is and its two slots. Product companies (Zoho, Flipkart, Razorpay) ask about async setup, error handling, and router integration. FAANG-level interviews probe the pending-counter mechanics, SSR streaming, timeout, and the experimental caveat.',
    whatInterviewersExpect:
      'They expect you to define the async dependencies it coordinates, the default/fallback slot behavior (wait for all, reveal together), that it does NOT handle errors (use onErrorCaptured), and to mention timeout, SSR, and its experimental status.',
  },
}

export default suspense
