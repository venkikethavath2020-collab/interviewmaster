import type { ConceptLesson } from '../../../types/lesson'

const errorHandlingVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'error-handling-vue',
  name: 'Error Handling in Vue',
  category: 'forms-async',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Unhandled errors crash components or leave broken UI; robust error handling keeps the app usable and trustworthy when things go wrong.',
    'Vue gives you layered tools — onErrorCaptured, app.config.errorHandler, error boundaries, async error handling — and knowing which to use where is a real skill.',
    'It is how you build graceful degradation: a fallback UI for a broken widget instead of a white screen for the whole app.',
    'Interviewers probe it to see if you understand the component tree, error propagation, and the difference between render errors and async (Promise) errors.',
    'Production reliability — logging to Sentry, retrying, surfacing user-friendly messages — depends entirely on a coherent error-handling strategy.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Error handling is like having a safety net under a trapeze: if an acrobat slips, the net catches them so the whole show doesn\'t stop and the audience just sees a quick recovery.',
    story: [
      'Imagine a circus with acrobats on a trapeze. Sometimes one slips — that is an error.',
      'Without a safety net, a slip could end the whole show and scare everyone. With a net, the acrobat lands safely, gets back up, and the show continues.',
      'A good circus has nets in the right places — under the trapeze, not in the parking lot — and someone watching to write down what went wrong so they can fix it.',
      'In a Vue app, error boundaries are the nets that catch a broken piece so the rest of the page keeps working, and a global handler is the person writing down what happened.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes code fails — a network request errors, a value is missing, a component throws while rendering. Error handling is the plan for when that happens.',
    'Vue lets a parent component "catch" errors from its children with a special hook (onErrorCaptured), so it can show a fallback instead of crashing.',
    'There is also a global handler for the whole app to log errors in one place, and you handle async errors (failed fetches) with try/catch in your code.',
    'The goal is graceful failure: show a helpful message or a smaller broken area, log what happened for developers, and keep the rest of the app working.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Error handling in Vue is the layered strategy for catching and responding to errors: try/catch for async logic, onErrorCaptured for component-tree error boundaries, app.config.errorHandler for global logging, plus user-facing fallback UI.',
    how: 'Async errors are caught with try/catch in your functions. Errors thrown during a child\'s render/lifecycle/watcher propagate up and can be intercepted by an ancestor\'s onErrorCaptured hook, which can show a fallback and stop propagation. Anything uncaught reaches the global app.config.errorHandler.',
    why: 'It prevents a single failure from breaking the whole UI, gives users sensible feedback, and centralizes logging/monitoring so you can detect and fix issues in production.',
    code: {
      label: 'try/catch for async + a simple error boundary',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onErrorCaptured } from \'vue\'\nconst failed = ref(false)\n\n// catches errors thrown by descendant components\nonErrorCaptured((err) => {\n  console.error(\'caught:\', err)\n  failed.value = true\n  return false // stop the error from propagating further up\n})\n</script>\n\n<template>\n  <div v-if="failed">Something went wrong in this section.</div>\n  <slot v-else />\n</template>',
      explanation: [
        'onErrorCaptured catches errors from descendant components.',
        'Returning false stops the error propagating to ancestors/global handler.',
        'The boundary shows a fallback instead of crashing the subtree.',
        'Async errors inside your own code still need their own try/catch.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Error handling in Vue is a multi-layer mechanism. Synchronous errors thrown during a component\'s render, lifecycle hooks, watchers, or event handlers propagate up the component tree and can be intercepted by any ancestor\'s onErrorCaptured(err, instance, info) hook, which may inspect/log the error and return false to stop further propagation (forming an error boundary). Errors not stopped reach the application-level app.config.errorHandler for centralized logging. Asynchronous errors (rejected Promises in async setup, fetches, or callbacks) are NOT automatically caught by these hooks unless they occur within Vue-invoked lifecycle/watcher code, so they require explicit try/catch or .catch, often surfaced via reactive error state. Vue also surfaces warnings via app.config.warnHandler, and Suspense provides a coordinated way to handle async-setup errors with onErrorCaptured.',

  // 7. Internal Working
  internalWorking: [
    'When Vue invokes user code (render, lifecycle hook, watcher callback, event handler), it wraps the call in an internal handleError; a thrown error is captured there rather than crashing the whole runtime.',
    'handleError walks up the parent chain, calling each ancestor\'s onErrorCaptured(err, instance, info) hook in order; info is a string describing where it happened (e.g. "render", "setup function").',
    'If a hook returns false, propagation stops; otherwise the error continues to the next ancestor.',
    'If no boundary stops it, Vue forwards the error to app.config.errorHandler(err, instance, info) for global handling/logging; if that is unset, it logs to the console.',
    'Async errors only enter this pipeline if they reject within Vue-tracked async work (e.g. an async setup used with Suspense, or a watcher returning a rejected Promise); plain unawaited Promise rejections in your handlers bypass it and need try/catch.',
    'A boundary that sets reactive fallback state triggers a re-render of the boundary component showing the fallback UI instead of the failed subtree.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `            error thrown in a child (render/lifecycle/watcher)
                         │  Vue handleError
                         ▼
        ┌──────────── walk up parent chain ────────────┐
        │  ancestorA.onErrorCaptured → return true?     │ keep going up
        │  ancestorB.onErrorCaptured → return false?    │ STOP (boundary)
        └───────────────────────────────────────────────┘
                         │ (not stopped)
                         ▼
              app.config.errorHandler  ── log to Sentry / console

   ASYNC (fetch reject) ──► needs try/catch ──► set error ref ──► show UI`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each component instance can register onErrorCaptured hooks; these closures live with the instance and are invoked during error propagation up the tree.',
    'A boundary holds reactive fallback state (e.g. an error ref) that, when set, re-renders the fallback branch.',
    'The global errorHandler is a single app-level function reference reused for every uncaught error.',
    'Async error state (an error ref per request) lives in the component/composable scope and drives the error UI; it is released on unmount.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — async error into reactive state',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst error = ref<string | null>(null)\nconst data = ref<unknown>(null)\n\nasync function load() {\n  error.value = null\n  try {\n    const res = await fetch(\'/api/data\')\n    if (!res.ok) throw new Error(`HTTP ${res.status}`)\n    data.value = await res.json()\n  } catch (e) {\n    error.value = (e as Error).message // surface to UI\n  }\n}\n</script>\n\n<template>\n  <button @click="load">Load</button>\n  <p v-if="error" role="alert">{{ error }}</p>\n  <pre v-else-if="data">{{ data }}</pre>\n</template>',
      explanation: [
        'Async/fetch errors are not caught by onErrorCaptured, so use try/catch.',
        'The error message is stored in reactive state and rendered to the user.',
        'Checking res.ok ensures HTTP error responses become real errors.',
        'role="alert" makes the message accessible to screen readers.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a reusable ErrorBoundary component',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onErrorCaptured } from \'vue\'\nconst error = ref<Error | null>(null)\n\nonErrorCaptured((err) => {\n  error.value = err as Error\n  return false // contain the error here\n})\n\nfunction retry() { error.value = null }\n</script>\n\n<template>\n  <div v-if="error">\n    <p>This section failed: {{ error.message }}</p>\n    <button @click="retry">Try again</button>\n  </div>\n  <slot v-else />\n</template>',
      explanation: [
        'A generic boundary catches render/lifecycle errors from its slotted subtree.',
        'Returning false contains the error so the rest of the app keeps working.',
        'A retry resets the error state to re-render the children.',
        'Wrap risky widgets: <ErrorBoundary><RiskyWidget /></ErrorBoundary>.',
      ],
    },
    advanced: {
      label: 'Advanced — global handler with monitoring',
      lang: 'ts',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\n\napp.config.errorHandler = (err, instance, info) => {\n  // centralized logging for anything not caught by a boundary\n  console.error(`[Vue error] ${info}`, err)\n  // report to monitoring (e.g. Sentry.captureException(err))\n}\n\napp.config.warnHandler = (msg, _instance, trace) => {\n  if (import.meta.env.DEV) console.warn(msg, trace)\n}\n\napp.mount(\'#app\')',
      explanation: [
        'errorHandler is the global safety net for uncaught component errors.',
        'info tells you where it happened (render, watcher, lifecycle, etc.).',
        'This is where you wire monitoring like Sentry for production visibility.',
        'warnHandler can silence/forward Vue warnings; usually only logged in dev.',
      ],
    },
    realProject: {
      label: 'Real project — Suspense + boundary for async components',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onErrorCaptured } from \'vue\'\nimport AsyncDashboard from \'./AsyncDashboard.vue\' // uses async setup\nconst failed = ref(false)\nonErrorCaptured(() => { failed.value = true; return false })\n</script>\n\n<template>\n  <div v-if="failed">Dashboard failed to load. <button @click="failed = false">Retry</button></div>\n  <Suspense v-else>\n    <template #default>\n      <AsyncDashboard />\n    </template>\n    <template #fallback>\n      <p>Loading dashboard...</p>\n    </template>\n  </Suspense>\n</template>',
      explanation: [
        'Suspense shows a fallback while an async-setup component resolves its data.',
        'If the async setup throws/rejects, the error propagates to onErrorCaptured.',
        'The boundary shows a recoverable failure UI instead of crashing the page.',
        'This is the production pattern for lazy/async data-driven sections.',
        'Combines loading (Suspense) and failure (boundary) handling cleanly.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you handle errors from an async fetch in a Vue component?',
      answer: 'With try/catch around the await, storing the error in a reactive ref and rendering an error message. Async/Promise errors are not caught by Vue\'s component error hooks, so explicit try/catch is required.',
      explanation: 'The key nuance is that async errors need try/catch — the error hooks do not catch them automatically.',
    },
    {
      level: 'beginner',
      question: 'What is onErrorCaptured and what does it catch?',
      answer: 'A lifecycle hook that lets a component catch errors thrown by its descendant components during their render, lifecycle hooks, and watchers. It receives the error, the source instance, and an info string, and can return false to stop propagation.',
      explanation: 'Expected: it is a tree-based boundary for descendant synchronous errors, not async ones.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between onErrorCaptured and app.config.errorHandler?',
      answer: 'onErrorCaptured is component-scoped: it catches errors from a specific subtree and can contain them locally with a fallback. app.config.errorHandler is the global, app-wide handler for any uncaught error, used mainly for centralized logging/monitoring. Boundaries handle UX; the global handler handles observability.',
      explanation: 'The distinction is local containment/UX vs global logging — strong answers state both roles.',
    },
    {
      level: 'intermediate',
      question: 'How do you build an error boundary in Vue 3?',
      answer: 'Create a wrapper component that registers onErrorCaptured, stores the error in reactive state, returns false to stop propagation, and renders either a fallback UI or its <slot> children. Wrap risky subtrees with it.',
      explanation: 'Tests that Vue has no built-in boundary component, so you compose one with onErrorCaptured + slot.',
    },
    {
      level: 'advanced',
      question: 'How does error propagation work up the component tree, and how do you stop it?',
      answer: 'Vue calls handleError, which walks up the parent chain invoking each onErrorCaptured hook in order. Returning false from a hook stops propagation; otherwise it continues to the next ancestor and finally to app.config.errorHandler. So the nearest boundary that returns false contains the error.',
      explanation: 'Senior signal: describing the parent-chain walk, the return-false semantics, and the global fallback.',
    },
    {
      level: 'senior',
      question: 'How do you design a production error-handling strategy in a Vue app?',
      answer: 'Layer it: try/catch (or a fetch wrapper) for async with user-facing error state and retries; targeted ErrorBoundary components around risky/independent sections for graceful degradation; a global errorHandler wired to monitoring (Sentry) for observability; Suspense for async-setup loading; consistent error normalization; and route-level error pages. Distinguish recoverable (show retry) from fatal (reload/redirect) errors.',
      explanation: 'Senior signal: a coherent layered architecture spanning UX, containment, and observability.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does onErrorCaptured not catch errors from setTimeout/Promise callbacks?',
    'How do you integrate Sentry or another monitor with Vue error handling?',
    'How does Suspense interact with onErrorCaptured for async setup?',
    'What is the info argument to onErrorCaptured and how is it useful?',
    'How do you handle errors in event handlers vs render functions?',
    'How would you show a route-level error page on navigation failure?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting onErrorCaptured to catch async/Promise errors.',
      why: 'It only catches synchronous errors from descendants\' render/lifecycle/watchers, not unawaited Promise rejections.',
      fix: 'Use try/catch (or .catch) around async work and surface the error via reactive state.',
    },
    {
      mistake: 'Swallowing errors silently in catch blocks.',
      why: 'The app appears to work but failures are invisible to both users and developers, hiding real bugs.',
      fix: 'Always do something: show user feedback AND log/report to monitoring.',
    },
    {
      mistake: 'Having no error boundaries, so one broken widget blanks the whole app.',
      why: 'An uncaught render error can unmount the entire tree, giving users a white screen.',
      fix: 'Wrap independent/risky sections in ErrorBoundary components that show a contained fallback.',
    },
    {
      mistake: 'Relying only on the global handler for UX.',
      why: 'The global handler is for logging; it does not give the user a meaningful recovery UI per section.',
      fix: 'Use boundaries/reactive error state for UX and reserve the global handler for observability.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'onErrorCaptured, app.config.errorHandler, and app.config.warnHandler are the built-in layers for tree-level boundaries, global logging, and warnings.' },
    { area: 'Component library', detail: 'Reusable ErrorBoundary/ErrorFallback components wrap widgets so a failure in one degrades gracefully without taking down the page.' },
    { area: 'Nuxt', detail: 'Provides error pages (error.vue), useError/clearError, and onErrorCaptured support, plus server-side error handling for SSR routes.' },
    { area: 'SSR', detail: 'Server render errors must be caught and turned into proper HTTP responses/error pages; the global handler and per-request isolation matter for reliability.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Boundaries contain failures to a subtree, avoiding a full re-render/unmount of the app.',
      'Centralized logging adds negligible overhead while giving production visibility.',
    ],
    bad: [
      'Catching and re-throwing or logging huge error payloads on hot paths adds overhead.',
      'Aggressive auto-retry loops can amplify load and worsen an outage.',
    ],
    optimizations: [
      'Place boundaries at meaningful section granularity, not around every node.',
      'Throttle/sample error reporting to avoid flooding monitoring during incidents.',
      'Use backoff and caps on retries to prevent retry storms.',
      'Normalize errors once in a wrapper rather than repeating handling everywhere.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Leaking sensitive details (stack traces, tokens, internal URLs, PII) in error messages shown to users or logged client-side.',
      'Verbose server error responses can reveal implementation details useful to attackers.',
    ],
    bestPractices: [
      'Show users generic, friendly messages; keep detailed diagnostics in server-side/monitoring logs only.',
      'Scrub sensitive fields before reporting to monitoring, and avoid logging credentials or PII.',
      'Return safe, non-revealing error responses from SSR/server routes; log the details server-side.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['lifecycle-hooks-composition', 'data-fetching-patterns', 'components-basics', 'slots'],
    nextConcepts: ['suspense', 'ssr-hydration', 'async-components', 'testing-overview'],
    dependencyNote:
      'Error handling builds on lifecycle hooks (onErrorCaptured), slots (for boundary fallbacks), and data fetching (where most async errors originate). It pairs with Suspense for async-setup errors and matters heavily in SSR/hydration and when testing failure paths.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a component tree; a child throws during render.',
      'Show Vue walking up the parent chain calling each onErrorCaptured.',
      'Mark a boundary returning false → propagation stops, fallback rendered there.',
      'If nothing stops it, draw the arrow reaching app.config.errorHandler → Sentry.',
      'Separately draw an async fetch reject needing try/catch → error ref → UI. Conclude with the layered strategy.',
    ],
    diagram: `  child throws (render/lifecycle/watch)
        │ walk up parents
   onErrorCaptured? return false → STOP (fallback UI)
        │ else
   app.config.errorHandler → log/monitor

  async fetch reject → try/catch → error ref → message
  layers: try/catch (async) + boundaries (UX) + global (observability)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue error handling is layered. Async/Promise errors need try/catch and a reactive error state for the UI — the component error hooks do not catch them. Synchronous errors from a child\'s render, lifecycle, or watcher propagate up and can be caught by an ancestor\'s onErrorCaptured, which returns false to contain them as an error boundary with a fallback. Anything uncaught reaches the global app.config.errorHandler, where you wire monitoring like Sentry. Use boundaries for UX/graceful degradation, the global handler for observability, and Suspense for async-setup loading plus errors.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Error handling in Vue is best understood as layers, because different error types need different tools. First, async errors. A failed fetch or any rejected Promise is not caught by Vue\'s component error hooks, so I wrap async work in try/catch — or use a fetch wrapper — and store the error in a reactive ref that the template renders as a user-friendly message, ideally with role="alert" for accessibility. Second, synchronous component errors. If a child throws during its render, a lifecycle hook, or a watcher, Vue catches it internally via handleError and walks up the parent chain, calling each ancestor\'s onErrorCaptured hook, which receives the error, the source instance, and an info string saying where it happened. A hook can log the error and return false to stop propagation — that is how you build an error boundary. Vue has no built-in boundary component, so I compose one: a wrapper that registers onErrorCaptured, stores the error in state, returns false to contain it, and renders either a fallback UI with a retry or its slot children. I wrap independent or risky sections so one broken widget degrades gracefully instead of white-screening the whole app. Third, the global net. Anything no boundary stops reaches app.config.errorHandler, which is where I wire monitoring like Sentry — its job is observability, not UX. There\'s also warnHandler for Vue warnings, usually only in dev. For async-setup components I combine Suspense, which shows a loading fallback, with a surrounding boundary that catches setup errors. The overall strategy: try/catch for async with recoverable error UI, targeted boundaries for graceful degradation, a global handler for logging, distinguishing recoverable from fatal errors, and being careful not to leak sensitive details — users get generic messages while full diagnostics go to server-side or monitoring logs only.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Fine-grained boundaries give better containment but add wrapper components and complexity; coarse boundaries are simpler but degrade larger areas.',
      'Auto-retry improves resilience but risks retry storms during outages — needs backoff and caps.',
      'Detailed client logging aids debugging but risks leaking sensitive data; balance visibility with privacy.',
    ],
    edgeCases: [
      'Async/Promise rejections bypass onErrorCaptured unless within Vue-tracked async (e.g. Suspense async setup).',
      'Errors in the global handler itself or in a boundary\'s fallback can cascade if not guarded.',
      'Event-handler errors are reported but do not unmount the component; render errors can unmount the subtree.',
      'SSR errors must become proper HTTP responses, not client-style fallbacks.',
    ],
    runtimeBehavior: [
      'handleError walks ancestors in order; the first onErrorCaptured returning false stops propagation.',
      'info distinguishes the error source (render, setup, watcher, lifecycle) for better diagnostics.',
      'Setting reactive fallback state in a boundary re-renders it with the fallback subtree.',
    ],
    scalability: [
      'A consistent fetch wrapper + error normalization keeps handling uniform as the codebase grows.',
      'Sampling/throttling error reports keeps monitoring costs and noise manageable at scale.',
    ],
    productionConcerns: [
      'Integrate monitoring (Sentry) via the global handler and capture component info/trace.',
      'Provide route-level error pages and distinguish recoverable (retry) from fatal (reload) failures.',
      'Never expose stack traces, tokens, or PII to users; scrub before logging.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Async errors → try/catch + reactive error state (hooks do NOT catch them).',
    'onErrorCaptured(err, instance, info) catches descendant render/lifecycle/watcher errors.',
    'Return false from onErrorCaptured to stop propagation (= error boundary).',
    'No built-in boundary — compose one with onErrorCaptured + slot.',
    'app.config.errorHandler = global net for uncaught errors → monitoring.',
    'app.config.warnHandler for Vue warnings (usually dev only).',
    'Suspense handles async-setup loading; pair with a boundary for its errors.',
    'Boundaries = UX/containment; global handler = observability.',
    'Check res.ok — fetch does not reject on HTTP errors.',
    'Distinguish recoverable (retry) vs fatal (reload/redirect).',
    'Never leak stack traces/tokens/PII to users; scrub logs.',
    'Use backoff + caps on retries to avoid storms.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Catch a failed fetch and show an error message to the user.',
      hint: 'try/catch + error ref, check res.ok.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst error = ref<string | null>(null)\nasync function load() {\n  error.value = null\n  try {\n    const r = await fetch(\'/api/x\')\n    if (!r.ok) throw new Error(\'HTTP \' + r.status)\n  } catch (e) { error.value = (e as Error).message }\n}\n</script>\n\n<template>\n  <button @click="load">Load</button>\n  <p v-if="error" role="alert">{{ error }}</p>\n</template>',
        explanation: [
          'try/catch captures the async failure.',
          'res.ok converts HTTP errors into thrown errors.',
          'The message is surfaced to the user.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a reusable ErrorBoundary component with a fallback slot and a retry.',
      hint: 'onErrorCaptured + return false + slot.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onErrorCaptured } from \'vue\'\nconst err = ref<Error | null>(null)\nonErrorCaptured((e) => { err.value = e as Error; return false })\n</script>\n\n<template>\n  <div v-if="err">\n    <p>Failed: {{ err.message }}</p>\n    <button @click="err = null">Retry</button>\n  </div>\n  <slot v-else />\n</template>',
        explanation: [
          'onErrorCaptured catches descendant errors.',
          'Returning false contains them in this boundary.',
          'Resetting err re-renders the slot children.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Wire a global error handler that logs to console and would report to Sentry, including the info string.',
      hint: 'app.config.errorHandler in main.ts.',
      solution: {
        lang: 'ts',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nconst app = createApp(App)\napp.config.errorHandler = (err, _instance, info) => {\n  console.error(`[Vue ${info}]`, err)\n  // Sentry.captureException(err, { extra: { info } })\n}\napp.mount(\'#app\')',
        explanation: [
          'The global handler catches anything no boundary stopped.',
          'info pinpoints where the error originated.',
          'This is the integration point for monitoring tools.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Use Suspense to show a loading fallback for an async-setup component, with a boundary that catches setup errors.',
      hint: 'onErrorCaptured around <Suspense> with #default and #fallback.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onErrorCaptured } from \'vue\'\nimport AsyncView from \'./AsyncView.vue\'\nconst failed = ref(false)\nonErrorCaptured(() => { failed.value = true; return false })\n</script>\n\n<template>\n  <p v-if="failed">Failed to load.</p>\n  <Suspense v-else>\n    <template #default><AsyncView /></template>\n    <template #fallback><p>Loading...</p></template>\n  </Suspense>\n</template>',
        explanation: [
          'Suspense renders #fallback while async setup resolves.',
          'A thrown/rejected async setup propagates to onErrorCaptured.',
          'The boundary shows a contained failure UI instead of crashing.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Robust error handling is what makes an app feel reliable instead of fragile. Knowing Vue\'s layered model — async try/catch, boundaries, and the global handler — shows you can ship resilient, observable, user-friendly applications.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask how to handle a failed API call and what onErrorCaptured does. Product companies (Zoho, Flipkart, Razorpay) ask you to build an error boundary and distinguish it from the global handler. FAANG-level interviews probe propagation semantics, Suspense interaction, monitoring integration, and a full production strategy.',
    whatInterviewersExpect:
      'Explain that async errors need try/catch and reactive state, that onErrorCaptured catches descendant synchronous errors and returns false to contain them, that app.config.errorHandler is the global logging net, and describe a layered strategy with boundaries for UX, monitoring for observability, Suspense for async setup, and care around leaking sensitive data.',
  },
}

export default errorHandlingVue
