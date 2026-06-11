import type { ConceptLesson } from '../../../types/lesson'

const navigationGuards: ConceptLesson = {
  // 1. Concept Summary
  slug: 'navigation-guards',
  name: 'Navigation Guards',
  category: 'routing',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Guards are how you protect routes — auth checks, role gating, and "are you sure you want to leave with unsaved changes?" all run through them.',
    'They centralize cross-cutting navigation logic (auth, page titles, analytics, scroll) so you do not repeat it in every component.',
    'Getting the async/await and return-value contract right is a frequent senior interview filter — the old next() callback vs the modern return style trips people up.',
    'Misused guards cause real incidents: infinite redirect loops, race conditions, and auth bypasses that leak protected pages.',
    'They are the backbone of route-level data prefetching and confirming destructive navigations, both expected in production-grade apps.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A navigation guard is the security person at a door who checks your ticket before letting you into the room.',
    story: [
      'Imagine a museum with a special room full of treasure. Before you can walk in, a guard stands at the door.',
      'The guard looks at your ticket. If your ticket is valid, the guard steps aside and you walk right in.',
      'If you do not have a ticket, the guard does not let you in — instead they point you to the front desk to go buy one (that is a redirect).',
      'And when you try to leave a room where you were painting, a guard might gently ask, "Are you sure? Your painting is not finished" — giving you a chance to stay. Navigation guards in a Vue app do exactly this, checking before you enter or leave a page.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A navigation guard is a function the router runs before it actually changes the page. It gets to decide: allow the navigation, cancel it, or send the user somewhere else.',
    'There are guards that run for every route (global), guards attached to one route (per-route), and guards inside a component (like "before you leave this page").',
    'A guard receives where you are going (to) and where you came from (from), so it can make smart decisions — for example, only allow /admin if the user is logged in.',
    'In modern Vue Router you simply return true to allow, return false to cancel, or return a path/route to redirect. You can also make the guard async and await something first.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Navigation guards are hooks that run during a route transition, letting you allow, cancel, or redirect a navigation. They come in three scopes: global (beforeEach/beforeResolve/afterEach), per-route (beforeEnter), and in-component (onBeforeRouteUpdate/onBeforeRouteLeave or the option-style hooks).',
    how: 'Register a global guard with router.beforeEach((to, from) => {...}). Return true (or undefined) to proceed, false to cancel, or a location ({ name: "login" }) to redirect. Guards can be async — return a promise and the router waits.',
    why: 'They centralize auth, permissions, title/analytics, and unsaved-changes confirmations so navigation rules live in one place instead of being scattered across components.',
    code: {
      label: 'A global auth guard',
      lang: 'js',
      code: "import { useAuth } from '@/composables/useAuth'\n\nrouter.beforeEach((to) => {\n  const { isLoggedIn } = useAuth()\n  // protect any route flagged in meta\n  if (to.meta.requiresAuth && !isLoggedIn.value) {\n    // redirect to login, remembering where we wanted to go\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n  // returning nothing/true allows navigation\n})",
      explanation: [
        'beforeEach runs before EVERY navigation, receiving the target route (to).',
        'to.meta.requiresAuth is a flag you set on protected routes.',
        'Returning a location object redirects; returning nothing allows the navigation.',
        'Stashing to.fullPath in query lets login bounce the user back after authenticating.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Navigation guards are hooks invoked during Vue Router’s asynchronous navigation pipeline, enabling code to allow, abort, or redirect a transition. They are registered at three scopes: global (router.beforeEach, router.beforeResolve, router.afterEach), per-route (beforeEnter on a record), and in-component (beforeRouteEnter / beforeRouteUpdate / beforeRouteLeave, or their composition-API equivalents onBeforeRouteUpdate / onBeforeRouteLeave). Each guard receives the target (to) and source (from) route locations and signals its decision by returning a value: true/undefined to proceed, false to abort, a route location to redirect, or a promise resolving to one of these. afterEach is a non-blocking hook for side effects. The pipeline runs guards in a defined order across the matched route chain, resolving async guards before committing the new currentRoute.',

  // 7. Internal Working
  internalWorking: [
    'When navigation starts, the router resolves the target location and computes which records are leaving, updating, and entering by diffing the old and new route.matched chains.',
    'It then executes guards in a fixed order: leave guards (beforeRouteLeave) of components being left, global beforeEach, per-route beforeEnter of activated records, in-component beforeRouteUpdate (reused) and beforeRouteEnter (entered), then global beforeResolve.',
    'Each guard’s return value is awaited: undefined/true continues the pipeline, false aborts and restores the previous URL, and a returned location triggers a fresh navigation to that target (cancelling the current one).',
    'Because guards can be async (return promises), the router pauses the transition until each resolves — this is how route-level data prefetch and async permission checks work.',
    'Only after all blocking guards pass does the router commit the new currentRoute (the reactive ref), causing <router-view> to render the new components.',
    'afterEach then fires as a non-blocking hook for side effects like setting document.title or sending analytics, since the navigation is already confirmed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  navigate to /admin
        │
        ▼
  ┌──────────── NAVIGATION PIPELINE (async) ────────────┐
  │ 1 beforeRouteLeave (leaving components)              │
  │ 2 global beforeEach   ◄── auth check here            │
  │ 3 beforeEnter (per-route on activated records)       │
  │ 4 beforeRouteUpdate / beforeRouteEnter (components)  │
  │ 5 global beforeResolve                               │
  └──────────────────────────────────────────────────────┘
        │ each step returns:
        │   true/undefined → continue
        │   false          → ABORT (stay)
        │   { name:'login' } → REDIRECT (new navigation)
        ▼
  commit currentRoute → render → afterEach (side effects)`,

  // 9. Memory Visualization (omitted — not memory-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — global beforeEach + afterEach',
      lang: 'js',
      code: "// Allow/deny and a non-blocking title side effect\nrouter.beforeEach((to, from) => {\n  if (to.meta.requiresAuth && !isLoggedIn()) {\n    return { name: 'login' } // redirect\n  }\n  // else allow (return nothing)\n})\n\nrouter.afterEach((to) => {\n  document.title = to.meta.title || 'My App' // runs after navigation confirmed\n})",
      explanation: [
        'beforeEach is the gate: redirect unauthenticated users to login.',
        'Returning nothing allows the navigation to proceed.',
        'afterEach cannot block or redirect — it is for side effects only.',
        'Setting the title in afterEach guarantees it only changes once navigation succeeds.',
      ],
    },
    intermediate: {
      label: 'Intermediate — per-route guard with async permission check',
      lang: 'js',
      code: "const routes = [\n  {\n    path: '/admin',\n    component: () => import('./Admin.vue'),\n    // beforeEnter runs only for THIS route\n    beforeEnter: async (to) => {\n      const role = await fetchUserRole()\n      if (role !== 'admin') {\n        return { name: 'forbidden' } // redirect non-admins\n      }\n      // return nothing => allow\n    },\n  },\n]",
      explanation: [
        'beforeEnter is scoped to one route record — no need to branch inside a global guard.',
        'The guard is async: the router awaits fetchUserRole() before deciding.',
        'Returning a location redirects; returning nothing allows entry.',
        'Per-route guards keep route-specific logic next to the route definition.',
      ],
    },
    advanced: {
      label: 'Advanced — confirm unsaved changes on leave',
      lang: 'vue',
      code: "<script setup>\nimport { ref } from 'vue'\nimport { onBeforeRouteLeave } from 'vue-router'\n\nconst isDirty = ref(false) // set true when the form changes\n\nonBeforeRouteLeave((to, from) => {\n  if (isDirty.value) {\n    const ok = window.confirm('You have unsaved changes. Leave anyway?')\n    if (!ok) return false // cancel the navigation -> stay on the page\n  }\n})\n</script>\n\n<template>\n  <form @input=\"isDirty = true\"> ... </form>\n</template>",
      explanation: [
        'onBeforeRouteLeave is the composition-API in-component leave guard.',
        'Returning false cancels the navigation, keeping the user on the dirty form.',
        'This is the canonical "are you sure you want to leave?" pattern.',
        'It only guards in-app navigation; native page close needs beforeunload separately.',
      ],
    },
    realProject: {
      label: 'Real project — auth + role + title in a layered setup',
      lang: 'js',
      code: "// router/guards.js\nimport { useAuthStore } from '@/stores/auth'\n\nexport function installGuards(router) {\n  router.beforeEach(async (to) => {\n    const auth = useAuthStore()\n    if (!auth.ready) await auth.restoreSession() // resolve session once\n\n    if (to.meta.requiresAuth && !auth.isLoggedIn) {\n      return { name: 'login', query: { redirect: to.fullPath } }\n    }\n    if (to.meta.role && to.meta.role !== auth.role) {\n      return { name: 'forbidden' }\n    }\n    // allow\n  })\n\n  router.afterEach((to) => {\n    document.title = to.meta.title ? `${to.meta.title} · App` : 'App'\n  })\n}",
      explanation: [
        'A single global guard handles both auth and role gating using meta flags set per route.',
        'It awaits session restoration once so the very first navigation is not falsely rejected.',
        'Redirect to login preserves the intended destination in query.redirect.',
        'Title updates live in afterEach because they are a confirmed-navigation side effect.',
        'Reading meta from to (the deepest matched record’s merged meta) keeps rules declarative.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a navigation guard and what can it do?',
      answer: 'It is a hook the router runs during a route transition that can allow, cancel, or redirect the navigation. For example, a global beforeEach can redirect unauthenticated users to /login before a protected page renders.',
      explanation: 'A solid answer names the three outcomes (allow/cancel/redirect) and gives the auth use case.',
    },
    {
      level: 'beginner',
      question: 'What are the three scopes of guards?',
      answer: 'Global guards (beforeEach, beforeResolve, afterEach) run for every navigation; per-route guards (beforeEnter) run for a specific route; in-component guards (beforeRouteEnter/Update/Leave, or onBeforeRouteUpdate/onBeforeRouteLeave) run inside a component.',
      explanation: 'Listing all three scopes with one example each demonstrates breadth.',
    },
    {
      level: 'intermediate',
      question: 'In Vue Router 4, how does a guard signal its decision without next()?',
      answer: 'You return a value: return true or nothing to proceed, return false to abort, or return a route location ({ name: "login" }) to redirect. Guards can be async and return a promise. next() still works but the return style is preferred and less error-prone.',
      explanation: 'The shift from next() to returning values is a key v4 detail; mentioning that calling next() multiple times was a classic bug shows maturity.',
    },
    {
      level: 'intermediate',
      question: 'Why can’t you access the component instance in beforeRouteEnter?',
      answer: 'beforeRouteEnter runs before the component is created, so this is undefined. To use the instance, pass a callback to next: next(vm => { vm.something }). The composition API has no beforeRouteEnter — you fetch in setup or onMounted instead.',
      explanation: 'This nuance separates people who memorized the list from those who understand the lifecycle timing.',
    },
    {
      level: 'advanced',
      question: 'How do you avoid an infinite redirect loop in beforeEach?',
      answer: 'Always allow the destination you redirect TO. If beforeEach redirects to /login when not authenticated, it must let /login itself pass (e.g. guard only when to.meta.requiresAuth, and /login has no such flag). Otherwise navigating to /login re-triggers the guard and loops.',
      explanation: 'Naming the guard-against-self condition is the standard fix and a frequent real bug.',
    },
    {
      level: 'senior',
      question: 'What is the full order of guard execution, and where does data prefetching fit?',
      answer: 'Order: in-component beforeRouteLeave (leaving), global beforeEach, per-route beforeEnter (entering records), in-component beforeRouteUpdate (reused) and beforeRouteEnter (entered), global beforeResolve, then commit, then afterEach. Async data prefetch goes in beforeResolve or beforeRouteEnter so the view only renders once data is ready, though many teams prefer in-component <Suspense>/loaders to keep navigation snappy.',
      explanation: 'Reciting the order and reasoning about where to put prefetch (and the UX trade-off) is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between beforeEach and beforeResolve?',
    'How is afterEach different from the blocking guards?',
    'How do you redirect after login back to the originally requested page?',
    'When would you use beforeEnter over a global beforeEach?',
    'How do onBeforeRouteUpdate and onBeforeRouteLeave differ from the option-style hooks?',
    'How do you handle async errors thrown inside a guard?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Causing an infinite redirect by guarding the redirect target too.',
      why: 'Redirecting unauthenticated users to /login while also requiring auth for /login re-triggers the guard endlessly.',
      fix: 'Only guard routes flagged requiresAuth, and ensure the login route is not flagged, so the redirect target passes.',
    },
    {
      mistake: 'Calling next() multiple times (or both next() and returning a value).',
      why: 'The router only honors the first signal; extra calls cause undefined behavior and warnings.',
      fix: 'Prefer the return-value style in v4; if using next(), call it exactly once on every code path.',
    },
    {
      mistake: 'Trying to use this in beforeRouteEnter.',
      why: 'The component instance does not exist yet; this is undefined.',
      fix: 'Use next(vm => {...}) for option-style, or fetch in setup/onMounted with the composition API.',
    },
    {
      mistake: 'Putting blocking side effects (analytics, title) in beforeEach.',
      why: 'beforeEach is blocking; slow work there delays every navigation, and a thrown error can abort it.',
      fix: 'Move non-blocking side effects to afterEach, which runs after navigation is confirmed.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'A global beforeEach reads to.meta.requiresAuth/role against an auth store to gate protected routes app-wide.' },
    { area: 'Pinia', detail: 'Guards call store actions (restoreSession, fetchPermissions) and await them so the first navigation reflects real auth state.' },
    { area: 'Nuxt', detail: 'Route middleware (defineNuxtRouteMiddleware) plays the guard role, running navigateTo() to redirect on the server and client.' },
    { area: 'SSR', detail: 'Guards run on the server during the initial request; redirects there become proper HTTP redirects, and prefetch fills the store before render.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Centralized guards remove repeated auth checks from components, reducing duplicated logic and bundle size.',
      'beforeResolve/beforeRouteEnter prefetch means the view renders with data already present, avoiding loading flashes.',
    ],
    bad: [
      'Heavy async work in beforeEach blocks every navigation, making the whole app feel sluggish.',
      'Per-navigation network calls in a global guard (e.g. re-fetching permissions each time) add latency to every route change.',
    ],
    optimizations: [
      'Resolve session/permissions once and cache in a store; guard reads the cached value instead of refetching.',
      'Keep beforeEach synchronous where possible; await only when strictly necessary (first load).',
      'Prefer in-component data loading with <Suspense> for snappy navigation, reserving guard prefetch for hard gates.',
      'Use afterEach for non-blocking side effects so they never delay the transition.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Client-side guards are UX only — a determined user can bypass them, so they never replace server authorization.',
      'Race conditions on first load (guard runs before session is restored) can wrongly allow or deny access.',
      'Leaking redirect targets (open redirect) if you blindly trust query.redirect from the URL.',
    ],
    bestPractices: [
      'Enforce authorization on the API/server for every protected resource; treat client guards as convenience.',
      'Await session restoration before evaluating the first navigation to avoid false denials/allows.',
      'Validate/whitelist redirect targets so query.redirect cannot point off-site.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'route-meta-lazy-loading', 'programmatic-navigation'],
    nextConcepts: ['nested-routes', 'pinia-basics', 'error-handling-vue', 'ssr-hydration'],
    dependencyNote:
      'Navigation guards build on Vue Router Basics and route meta (the flags guards read), and on programmatic navigation (redirects are pushes). They pair with Pinia for auth state and feed into SSR and error-handling concerns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a horizontal pipeline box labelled "navigation".',
      'Write the guard order inside: beforeRouteLeave → beforeEach → beforeEnter → beforeRouteUpdate/Enter → beforeResolve.',
      'To the right, list the three return values: true=continue, false=abort, {location}=redirect.',
      'After the pipeline draw "commit → render → afterEach (side effects)".',
      'Say: "Auth lives in beforeEach reading meta; I return a login location to redirect, and I must let /login itself pass to avoid a loop. Titles/analytics go in afterEach because it cannot block."',
    ],
    diagram: `  [ leave → beforeEach → beforeEnter → enter/update → beforeResolve ]
        return true → continue
        return false → abort
        return {name:'login'} → redirect
        │
        ▼
   commit → render → afterEach (title, analytics)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Navigation guards run during a route transition and can allow, cancel, or redirect it. Three scopes: global (beforeEach/beforeResolve/afterEach), per-route (beforeEnter), and in-component (onBeforeRouteUpdate/Leave). In Vue Router 4 you signal by returning a value — true/nothing to proceed, false to abort, a location to redirect — and guards can be async. Auth goes in beforeEach reading to.meta, redirecting to login while letting login itself pass to avoid loops. afterEach is non-blocking, ideal for titles and analytics. Client guards are UX only — authorize on the server.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Navigation guards are hooks Vue Router runs during a route transition that let me allow, cancel, or redirect a navigation. There are three scopes. Global guards — beforeEach, beforeResolve, and the non-blocking afterEach — run for every navigation. Per-route guards (beforeEnter) run for a single route record. And in-component guards — beforeRouteEnter, beforeRouteUpdate, beforeRouteLeave, or their composition-API forms onBeforeRouteUpdate and onBeforeRouteLeave — run inside a component. The most common use is auth: in beforeEach I check to.meta.requiresAuth against my auth store, and if the user isn’t logged in I return a login location, stashing to.fullPath in the query so I can bounce them back after they sign in. The big Vue Router 4 change is the signaling contract: instead of the old next() callback, I just return a value — true or nothing to proceed, false to abort, or a route location to redirect — and guards can be async, returning a promise the router awaits. That async support is how route-level prefetching works in beforeResolve or beforeRouteEnter, though I often prefer in-component loaders with Suspense to keep navigation snappy. Two gotchas I always call out: first, avoid infinite redirect loops by making sure the route I redirect to — login — isn’t itself guarded; second, beforeRouteEnter runs before the instance exists, so this is undefined and I use the next(vm => ...) callback or just fetch in setup. afterEach can’t block or redirect, so I put side effects like document.title and analytics there, after navigation is confirmed. Finally, and most importantly for security: client-side guards are UX only. They improve experience but a user can bypass them, so real authorization must be enforced on the server, and I await session restoration before the first navigation to avoid false denials.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Global beforeEach (one place, easy audit) vs per-route beforeEnter (logic colocated with the route, no global branching).',
      'Guard-based prefetch (data ready before render, but navigation feels slower) vs in-component <Suspense>/loaders (snappy navigation, transient loading state).',
      'Return-value style (clean, no double-call bugs) vs legacy next() (more explicit but error-prone).',
    ],
    edgeCases: [
      'Infinite redirect loops when the redirect target is itself guarded.',
      'First-load race: guard evaluates before async session restore completes — must await it.',
      'beforeRouteEnter has no this; use the next(vm) callback or composition-API fetching.',
      'A guard returning a location starts a fresh navigation, so the original afterEach won’t fire for the aborted one.',
    ],
    runtimeBehavior: [
      'Guards execute in a fixed order across leaving/updating/entering records and are awaited if async.',
      'currentRoute is only committed after all blocking guards resolve, so <router-view> never shows a half-guarded state.',
      'Throwing or rejecting in a guard aborts navigation and surfaces via router.onError.',
    ],
    scalability: [
      'Centralize auth/role logic in a single guard reading declarative meta so adding a protected route is just a flag.',
      'Cache permissions/session in a store; never refetch on every navigation inside beforeEach.',
      'Split guards into composable installers (installAuthGuard, installTitleGuard) for large apps.',
    ],
    productionConcerns: [
      'Server authorization is mandatory — guards are not a security boundary.',
      'Open-redirect risk: validate query.redirect before pushing to it.',
      'Observability: log redirects/aborts and wire router.onError so guard failures are visible, not silent.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Scopes: global (beforeEach/beforeResolve/afterEach), per-route (beforeEnter), in-component (beforeRouteEnter/Update/Leave).',
    'v4 signaling: return true/nothing=proceed, false=abort, {location}=redirect.',
    'Guards can be async (return a promise; router awaits).',
    'afterEach is NON-blocking — titles, analytics, scroll.',
    'Auth: beforeEach checks to.meta.requiresAuth → redirect to login.',
    'Avoid loops: don’t guard the route you redirect TO.',
    'beforeRouteEnter has no this → use next(vm => ...).',
    'Composition API: onBeforeRouteUpdate / onBeforeRouteLeave only.',
    'Stash to.fullPath in query.redirect to bounce back post-login.',
    'Prefetch in beforeResolve/beforeRouteEnter (or prefer <Suspense>).',
    'Await session restore before evaluating first navigation.',
    'Client guards = UX only; authorize on the server.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a global guard that redirects to { name: "login" } when to.meta.requiresAuth and the user is not logged in.',
      hint: 'Return a location to redirect; return nothing to allow.',
      solution: {
        lang: 'js',
        code: "router.beforeEach((to) => {\n  if (to.meta.requiresAuth && !isLoggedIn()) {\n    return { name: 'login', query: { redirect: to.fullPath } }\n  }\n})",
        explanation: [
          'beforeEach runs for every navigation and reads the target meta.',
          'Returning a location redirects; returning nothing allows.',
          'query.redirect remembers the intended page for post-login bounce.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add a per-route async guard that only allows /reports when fetchUserRole() resolves to "manager".',
      hint: 'beforeEnter can be async and return a location to redirect.',
      solution: {
        lang: 'js',
        code: "const route = {\n  path: '/reports',\n  component: () => import('./Reports.vue'),\n  beforeEnter: async () => {\n    const role = await fetchUserRole()\n    if (role !== 'manager') return { name: 'forbidden' }\n  },\n}",
        explanation: [
          'beforeEnter is scoped to this route only.',
          'The router awaits the async role check before deciding.',
          'Returning a location redirects non-managers; returning nothing allows entry.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement an unsaved-changes guard in a form component that confirms before leaving.',
      hint: 'onBeforeRouteLeave + return false to cancel.',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { ref } from 'vue'\nimport { onBeforeRouteLeave } from 'vue-router'\nconst dirty = ref(false)\nonBeforeRouteLeave(() => {\n  if (dirty.value && !window.confirm('Discard unsaved changes?')) {\n    return false // stay\n  }\n})\n</script>\n<template>\n  <form @input=\"dirty = true\"><!-- fields --></form>\n</template>",
        explanation: [
          'onBeforeRouteLeave is the composition-API in-component leave guard.',
          'Returning false cancels the navigation, keeping the user on the form.',
          'It only covers in-app navigation; combine with a beforeunload listener for tab close.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Bounce the user back to their originally requested page after a successful login.',
      hint: 'Read query.redirect (validate it) and router.replace to it.',
      solution: {
        lang: 'js',
        code: "// in the login handler\nimport { useRoute, useRouter } from 'vue-router'\nconst route = useRoute()\nconst router = useRouter()\n\nasync function onLogin(credentials) {\n  await auth.login(credentials)\n  const target = route.query.redirect\n  // only allow internal paths to avoid open redirects\n  const safe = typeof target === 'string' && target.startsWith('/') ? target : '/'\n  router.replace(safe)\n}",
        explanation: [
          'The guard stored the intended path in query.redirect during the redirect to login.',
          'After login, replace (not push) so the login page leaves no history entry.',
          'Validating that the target is an internal path prevents open-redirect attacks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Auth and route protection appear in nearly every app, so guards are a high-signal topic. Demonstrating the v4 return contract, the guard order, and the security caveat (server authorization) marks you as someone who has shipped protected, production routing.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what a guard is and how to redirect unauthenticated users. Product companies (Zoho, Flipkart, Razorpay) ask you to wire a real auth guard, handle the unsaved-changes case, and avoid redirect loops. FAANG-level interviews probe the exact guard order, async prefetch trade-offs, first-load race conditions, and why client guards are not a security boundary.',
    whatInterviewersExpect:
      'They expect you to register a global auth guard, use the return-value contract correctly, distinguish the three scopes, avoid infinite redirects, and articulate that real authorization must live on the server.',
  },
}

export default navigationGuards
