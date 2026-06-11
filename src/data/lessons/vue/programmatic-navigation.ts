import type { ConceptLesson } from '../../../types/lesson'

const programmaticNavigation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'programmatic-navigation',
  name: 'Programmatic Navigation',
  category: 'routing',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Not all navigation is a link — after a successful form submit, a login, or a delete, you need to navigate from JavaScript, and that is exactly what router.push does.',
    'It lets you carry data (params, query, state) and choose history behavior (push vs replace), which links cannot always express.',
    'Knowing push vs replace vs back is a quick interview filter — getting redirects-after-login right depends on it.',
    'router.push returns a promise, so understanding how to await it and handle redirects/aborts prevents the unhandled-rejection warnings that plague guard-heavy apps.',
    'It is the imperative counterpart to <router-link>, and you will reach for it constantly in event handlers and composables.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Programmatic navigation is telling the GPS "take me there" by voice, instead of tapping the screen.',
    story: [
      'Imagine you are in a car with a smart GPS. Usually you tap a place on the map to go there — that is like clicking a link.',
      'But sometimes you just say out loud, "Take me home now," and the GPS starts driving there without you touching anything. That is programmatic navigation: your code says "go to this page" instead of the user clicking.',
      'You can also say "go back to where we just were" (back) or "replace this stop so I cannot return to it" (replace) — like telling the GPS not to remember a wrong turn.',
      'So whether the trigger is a button, a finished form, or a timer, your code can drive the page anywhere, just like talking to the GPS.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes the user does not click a link — they submit a form or press a button, and your code decides where to go next. That is programmatic navigation.',
    'You get the router object (useRouter() in script setup, or this.$router in the Options API) and call router.push(location) to navigate.',
    'push adds a new entry to the browser history (so back returns to the previous page), while replace swaps the current entry (so there is nothing to go back to).',
    'You can describe where to go with a path string ("/about") or an object ({ name: "user", params: { id: 5 } }), and you can attach query data too.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Programmatic navigation is navigating from JavaScript using the router instance instead of a <router-link>. The core methods are push (add a history entry), replace (overwrite the current one), and go/back/forward (move along history).',
    how: 'Get the router with useRouter() in <script setup>. Call router.push("/path") or router.push({ name, params, query }). Use router.replace(...) when you do not want a back entry, and router.back() to go to the previous page. push/replace return a promise you can await.',
    why: 'Many navigations are triggered by logic, not clicks — after login, after saving, after a guard check — and only imperative navigation can run at the right moment and carry the right data.',
    code: {
      label: 'Navigate after a successful save',
      lang: 'vue',
      code: "<script setup>\nimport { useRouter } from 'vue-router'\nconst router = useRouter()\n\nasync function save(form) {\n  const created = await api.create(form)\n  // go to the new item's detail page by NAME with params\n  router.push({ name: 'item', params: { id: created.id } })\n}\n</script>",
      explanation: [
        'useRouter() returns the router instance (the navigation API), distinct from useRoute() (the current route data).',
        'router.push with a named location plus params is robust to URL changes.',
        'push adds a history entry, so the user can press back to return to the form.',
        'This runs only after the async save resolves — timing a link could not express.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Programmatic navigation is imperatively changing the current route via the router instance rather than declaratively via <router-link>. router.push(to) resolves the target location, runs the navigation guard pipeline, and on success pushes a new browser history entry and updates the reactive currentRoute. router.replace(to) does the same but replaces the current history entry. router.go(n)/back()/forward() traverse the existing history stack. The target may be a path string or a normalized location object ({ path | name, params, query, hash, state }); params apply to named routes, query serializes to the search string. push/replace return a Promise that resolves to the navigation outcome (or a failure object) and can reject, so it should be awaited or caught in guard-heavy apps.',

  // 7. Internal Working
  internalWorking: [
    'router.push(to) normalizes the argument into a full route location, resolving names against the matcher and serializing params/query/hash into a target URL.',
    'It then runs the same asynchronous navigation pipeline as link clicks — leave guards, beforeEach, beforeEnter, component enter/update guards, beforeResolve — awaiting any async guards.',
    'If a guard redirects, the original push resolves with a redirect failure and a new navigation to the redirect target begins; if a guard aborts, the promise resolves with an abort failure (or rejects, depending on cause).',
    'On success the router calls the History API: push uses history.pushState (new entry) while replace uses history.replaceState (overwrite), keeping the address bar in sync.',
    'The reactive currentRoute ref is updated, so <router-view> re-renders the matched components and afterEach fires.',
    'go(n)/back()/forward() delegate directly to history.go, triggering a popstate the router observes and resolves like any other navigation.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  event (submit / click / timer)
        │
        ▼
   router.push({ name:'item', params:{id} })
        │ normalize + run guards (async)
        ▼
   ┌─ history stack ────────────────────────┐
   │ push    → [ … prev , NEW ]   back works │
   │ replace → [ … , NEW ]        prev gone  │
   │ back()  → pop to previous               │
   └─────────────────────────────────────────┘
        │
        ▼
   update currentRoute → <router-view> re-renders`,

  // 9. Memory Visualization (omitted — not memory-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — push by path and by name',
      lang: 'vue',
      code: "<script setup>\nimport { useRouter } from 'vue-router'\nconst router = useRouter()\n\nfunction goAbout() {\n  router.push('/about')              // by path string\n}\nfunction goUser(id) {\n  router.push({ name: 'user', params: { id } }) // by name + params\n}\n</script>\n\n<template>\n  <button @click=\"goAbout\">About</button>\n  <button @click=\"goUser(7)\">User 7</button>\n</template>",
      explanation: [
        'A path string is the simplest form; a location object is more expressive.',
        'Navigating by name plus params avoids hardcoding URL structure.',
        'Both add a history entry, so back returns to the current page.',
        'useRouter() must be called in setup scope, not inside async callbacks created elsewhere.',
      ],
    },
    intermediate: {
      label: 'Intermediate — query params and replace',
      lang: 'vue',
      code: "<script setup>\nimport { useRouter } from 'vue-router'\nconst router = useRouter()\n\nfunction applyFilter(sort) {\n  // query serializes to ?sort=asc&page=1\n  router.push({ path: '/products', query: { sort, page: 1 } })\n}\n\nfunction loginRedirect(target) {\n  // replace so the login page is not in history after success\n  router.replace(target || '/')\n}\n</script>",
      explanation: [
        'query is serialized into the URL search string and read later via route.query.',
        'replace overwrites the current history entry — ideal after login so back does not return to the login form.',
        'Numbers in query become strings on read (route.query.page === "1").',
        'Use push for normal navigation, replace when a back entry would be undesirable.',
      ],
    },
    advanced: {
      label: 'Advanced — await push and handle redirect/abort',
      lang: 'js',
      code: "import { useRouter } from 'vue-router'\nimport { isNavigationFailure, NavigationFailureType } from 'vue-router'\n\nconst router = useRouter()\n\nasync function go(to) {\n  const failure = await router.push(to)\n  if (isNavigationFailure(failure, NavigationFailureType.aborted)) {\n    // a guard cancelled the navigation (e.g. unsaved changes)\n    console.warn('Navigation aborted by a guard')\n  } else if (isNavigationFailure(failure, NavigationFailureType.redirected)) {\n    // a guard redirected elsewhere\n  }\n}",
      explanation: [
        'router.push resolves to a navigation failure object (or undefined on success), not just throws.',
        'isNavigationFailure + NavigationFailureType classify why a navigation did not complete.',
        'Handling aborted/redirected outcomes prevents silent UX bugs and unhandled-rejection noise.',
        'This matters in guard-heavy apps where navigations are frequently cancelled or redirected.',
      ],
    },
    realProject: {
      label: 'Real project — navigation in a composable after a mutation',
      lang: 'js',
      code: "// useCreatePost.js\nimport { useRouter } from 'vue-router'\nimport { usePostStore } from '@/stores/posts'\n\nexport function useCreatePost() {\n  const router = useRouter() // must be called in setup synchronously\n  const posts = usePostStore()\n\n  async function createAndOpen(draft) {\n    const post = await posts.create(draft)\n    // replace the 'new' form URL so back doesn't reopen an empty form\n    await router.replace({ name: 'post', params: { id: post.id } })\n    return post\n  }\n\n  return { createAndOpen }\n}",
      explanation: [
        'useRouter() is captured synchronously at composable setup, then used in async handlers.',
        'After creating the post, replace swaps the /new URL so back skips the empty form.',
        'Awaiting the navigation lets callers know the route actually changed before continuing.',
        'Encapsulating navigation in a composable keeps components thin and the flow reusable.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you navigate from code instead of a <router-link>?',
      answer: 'Get the router instance with useRouter() (or this.$router in Options API) and call router.push(location), where location is a path string or an object with name/params/query.',
      explanation: 'A good answer distinguishes useRouter() (navigation) from useRoute() (current route data).',
    },
    {
      level: 'beginner',
      question: 'What is the difference between push and replace?',
      answer: 'push adds a new entry to the browser history, so the back button returns to the previous page. replace overwrites the current entry, so the previous page is removed from history — useful after login so back does not return to the login form.',
      explanation: 'The login-replace example is the canonical illustration interviewers look for.',
    },
    {
      level: 'intermediate',
      question: 'How do you pass data when navigating programmatically?',
      answer: 'Use a location object: params for route segments of a NAMED route ({ name: "user", params: { id } }), and query for filter/state appended after ? ({ path: "/list", query: { sort: "asc" } }). Params require a named route or matching path; query is free-form.',
      explanation: 'Noting that params only work with name (not with path) and that query values read back as strings shows precision.',
    },
    {
      level: 'intermediate',
      question: 'Why might router.push trigger an unhandled promise rejection?',
      answer: 'push returns a promise that can reject or resolve to a failure when a guard aborts or redirects the navigation. If you fire-and-forget many pushes (e.g. rapid clicks) some may be cancelled, surfacing warnings. Await the result and use isNavigationFailure to handle outcomes, or catch the promise.',
      explanation: 'Connecting push’s promise to guard outcomes is an intermediate/advanced signal.',
    },
    {
      level: 'advanced',
      question: 'How do you redirect a user back to their originally requested page after login?',
      answer: 'The auth guard stashes the intended path in query.redirect when redirecting to login. After a successful login, read route.query.redirect, validate it is an internal path, and router.replace to it (replace so login leaves no history entry).',
      explanation: 'Mentioning replace and validating the redirect target (open-redirect safety) is the complete senior answer.',
    },
    {
      level: 'senior',
      question: 'What are the pitfalls of calling useRouter()/useRoute() outside setup or in async code?',
      answer: 'These composables rely on the active component instance / injection context, which only exists synchronously during setup. Calling them after an await, in a plain module, or in a detached callback may return undefined or the wrong instance. Capture the router synchronously in setup, then use the captured reference in async handlers.',
      explanation: 'This injection-context nuance is a frequent real bug and a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When would you use router.back() vs pushing an explicit route?',
    'How do params differ from query in router.push?',
    'Why do params get dropped when you use path instead of name?',
    'How do you preserve scroll position on programmatic navigation?',
    'How do you handle navigation failures (aborted/redirected)?',
    'Why must useRouter() be called synchronously in setup?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Combining path with params and expecting params to apply.',
      why: 'Vue Router ignores params when you provide path; params only work with name (or are encoded into the path yourself).',
      fix: 'Use { name: "user", params: { id } }, or build the full path string when using path.',
    },
    {
      mistake: 'Using push after login so the back button returns to the login page.',
      why: 'push keeps the login entry in history, letting the user navigate back into a stale form.',
      fix: 'Use router.replace after authentication so the login entry is overwritten.',
    },
    {
      mistake: 'Calling useRouter()/useRoute() after an await or outside setup.',
      why: 'They depend on the active instance/injection context that exists only synchronously in setup.',
      fix: 'Capture const router = useRouter() at the top of setup and use the variable in async handlers.',
    },
    {
      mistake: 'Fire-and-forgetting push and ignoring its promise.',
      why: 'Guard aborts/redirects resolve to failures or reject, producing unhandled-rejection warnings.',
      fix: 'await the push and inspect with isNavigationFailure, or attach a .catch.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'router.push after form submit/login/delete is ubiquitous; replace is used to avoid stale history entries for one-shot screens.' },
    { area: 'Pinia', detail: 'Store actions return created entities and components push to their detail route; navigation logic is often wrapped in composables.' },
    { area: 'Nuxt', detail: 'navigateTo() is the universal (server+client) equivalent of router.push, returning a redirect during SSR.' },
    { area: 'Component library', detail: 'Wizard/stepper components call router.push/replace to move between steps while encoding progress in query.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Imperative navigation reuses the same client-side transition as links — no full reload, instant view swap.',
      'replace avoids growing the history stack for transient screens, keeping back behavior clean.',
    ],
    bad: [
      'Rapid repeated push calls (e.g. double-clicks) queue redundant navigations and trigger failure warnings.',
      'Heavy synchronous work in the handler before/after push can make the navigation feel janky.',
    ],
    optimizations: [
      'Debounce or guard against double navigations on buttons that push.',
      'Use replace for redirects and one-shot flows to keep history lean.',
      'await push so dependent UI updates only run after the route actually changed.',
      'Encode shareable state in query rather than component-only state so deep links and refresh work.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Open redirect: pushing/replacing to an unvalidated query.redirect or user-supplied URL can send users to an attacker’s site.',
      'Programmatic navigation alone does not protect routes — it does not run authorization, so it must not be treated as access control.',
    ],
    bestPractices: [
      'Validate redirect targets: only allow internal paths (e.g. must start with "/").',
      'Gate sensitive routes with navigation guards and enforce real authorization on the server.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'route-params-query'],
    nextConcepts: ['navigation-guards', 'dynamic-routes', 'nested-routes', 'form-handling'],
    dependencyNote:
      'Programmatic navigation builds on Vue Router Basics and the params/query model. It pairs tightly with navigation guards (redirects are pushes/replaces) and with form handling (navigate after submit), and feeds dynamic/nested route flows.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write an event (form submit) on the left with an arrow to router.push(...).',
      'Draw the history stack as boxes; show push adding a box and replace overwriting the last box.',
      'Note the two location forms: "/path" string vs { name, params, query } object.',
      'Mark "params need name" and "push returns a promise".',
      'Say: "After login I use replace so back does not return to the form, and I validate query.redirect before sending the user there to avoid open redirects."',
    ],
    diagram: `  submit → router.push({ name:'item', params:{id} })
                       │
  history: [ A , B ] --push--> [ A , B , C ]   (back → B)
  history: [ A , B ] --replace--> [ A , C ]    (back → A)

  push/replace → Promise (await + isNavigationFailure)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Programmatic navigation means navigating from code via the router: useRouter().push(location) to add a history entry, replace to overwrite it (use after login so back skips the form), and back/forward/go to traverse history. Location can be a path string or { name, params, query } — params need a named route. push returns a promise that can resolve to a navigation failure when a guard aborts/redirects, so await it and use isNavigationFailure. Capture useRouter() synchronously in setup, and validate any redirect target to avoid open redirects.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Programmatic navigation is navigating from JavaScript instead of a <router-link>. I grab the router instance with useRouter in script setup — or this.$router in the Options API — and call methods on it. The main one is router.push, which I pass either a path string like "/about" or a location object like { name: "user", params: { id } }. Using the named form with params is more robust than hardcoding URLs. push adds a new entry to the browser history, so the back button returns to the previous page. When I do not want that — classically after login — I use router.replace, which overwrites the current entry so back does not return to the login form. There is also router.back, forward, and go to move along the existing history stack. I carry data two ways: params for the route segments of a named route, and query for filters or state that serialize into the search string and read back as strings. A common gotcha is mixing path with params — Vue Router ignores params when you give it path, so I either use name or build the full path myself. Another is that push returns a promise: if a guard aborts or redirects the navigation, that promise resolves to a navigation failure or rejects, which is why guard-heavy apps see unhandled-rejection warnings on rapid clicks. I await the push and use isNavigationFailure to classify the outcome. A subtle senior point: useRouter and useRoute depend on the active injection context that only exists synchronously during setup, so I capture the router in a variable at the top of setup and use that variable inside async handlers rather than calling the composable after an await. Finally, for security I always validate any redirect target — only allowing internal paths — to prevent open redirects, and I remember that navigation itself is not authorization.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'push (preserves back-navigation, grows history) vs replace (clean history for one-shot screens, but no back).',
      'Navigate by name (decoupled from URL structure, needs params) vs by path (simple, but brittle to URL changes and drops params).',
      'Encoding state in query (shareable, refresh-safe) vs in component/store (private, lost on reload).',
    ],
    edgeCases: [
      'path + params silently drops params; only name carries params.',
      'useRouter/useRoute called after await or outside setup returns wrong/undefined context.',
      'Rapid duplicate pushes resolve to "duplicated" navigation failures, not errors.',
      'A guard redirect makes the original push resolve as redirected — afterEach fires for the final route, not the aborted one.',
    ],
    runtimeBehavior: [
      'push/replace run the full async guard pipeline before committing, so navigation can be delayed or cancelled.',
      'On success the router calls history.pushState/replaceState and updates the reactive currentRoute.',
      'back/forward/go delegate to the History API and resolve via the popstate the router observes.',
    ],
    scalability: [
      'Wrap navigation flows in composables (useCreatePost) so logic is reusable and components stay thin.',
      'Standardize replace-after-mutation and query-encoded state across the app for predictable history/UX.',
      'Centralize redirect-after-login handling so every entry point behaves identically.',
    ],
    productionConcerns: [
      'Open-redirect prevention: validate query.redirect / user-supplied targets to internal paths.',
      'Handle navigation failures explicitly to avoid silent no-ops and console noise.',
      'SSR: use the framework’s universal navigate (Nuxt navigateTo) so redirects work as HTTP redirects on the server.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'useRouter() = navigate; useRoute() = read current route.',
    'router.push(to) adds a history entry; router.replace(to) overwrites it.',
    'router.back() / forward() / go(n) traverse history.',
    'to = "/path" string OR { name, params, query, hash }.',
    'params require name (path drops params).',
    'query serializes to ?...; reads back as strings.',
    'replace after login so back skips the form.',
    'push returns a Promise → await + isNavigationFailure.',
    'Capture useRouter() synchronously in setup (not after await).',
    'Validate redirect targets to internal paths (open-redirect).',
    'Options API: this.$router.push / this.$route.',
    'Nuxt universal equivalent: navigateTo().',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'In a button handler, navigate to the named "dashboard" route.',
      hint: 'useRouter().push({ name }).',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { useRouter } from 'vue-router'\nconst router = useRouter()\nfunction goDashboard() {\n  router.push({ name: 'dashboard' })\n}\n</script>\n<template>\n  <button @click=\"goDashboard\">Dashboard</button>\n</template>",
        explanation: [
          'useRouter() gives the navigation API.',
          'Navigating by name is robust to URL changes.',
          'push adds a history entry so back returns here.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'After a successful login, replace to the home route (no back to login) carrying any query.redirect.',
      hint: 'Validate the redirect target before replacing.',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { useRoute, useRouter } from 'vue-router'\nconst route = useRoute()\nconst router = useRouter()\n\nasync function login(creds) {\n  await auth.login(creds)\n  const t = route.query.redirect\n  const safe = typeof t === 'string' && t.startsWith('/') ? t : '/'\n  router.replace(safe)\n}\n</script>",
        explanation: [
          'replace overwrites the login entry so back does not return to it.',
          'Validating the target to internal paths prevents open redirects.',
          'Falls back to "/" when no valid redirect is present.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Push to a product list with sort and page query, then await and handle a possible guard abort.',
      hint: 'isNavigationFailure(result, NavigationFailureType.aborted).',
      solution: {
        lang: 'js',
        code: "import { useRouter, isNavigationFailure, NavigationFailureType } from 'vue-router'\nconst router = useRouter()\n\nasync function applyFilter(sort, page) {\n  const result = await router.push({ path: '/products', query: { sort, page } })\n  if (isNavigationFailure(result, NavigationFailureType.aborted)) {\n    // a guard (e.g. unsaved changes) cancelled it\n    notify('Navigation cancelled')\n  }\n}",
        explanation: [
          'query serializes to ?sort=...&page=... and reads back as strings.',
          'Awaiting push exposes the navigation outcome.',
          'isNavigationFailure classifies an abort so the UI can respond instead of silently failing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a composable that captures the router correctly and exposes a function to create an item then navigate to it.',
      hint: 'Capture useRouter() synchronously; use it in the async function.',
      solution: {
        lang: 'js',
        code: "import { useRouter } from 'vue-router'\n\nexport function useCreateItem(api) {\n  const router = useRouter() // captured synchronously in setup\n  async function createAndGo(payload) {\n    const item = await api.create(payload)\n    // replace so the 'new' form is not in history\n    await router.replace({ name: 'item', params: { id: item.id } })\n    return item\n  }\n  return { createAndGo }\n}",
        explanation: [
          'useRouter() is called synchronously at composable setup, avoiding the after-await context bug.',
          'The captured router is used safely inside the async handler.',
          'replace + named route + params is the idiomatic post-mutation navigation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Almost every interactive flow — login, save, delete, wizard — ends in a programmatic navigation, so this is everyday code. Showing you know push vs replace, params vs query, the returned promise, and the setup-context rule signals you write real, bug-free flows.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask how to navigate from code and push vs replace. Product companies (Zoho, Flipkart, Razorpay) ask you to implement redirect-after-login and pass params/query correctly. FAANG-level interviews probe the navigation promise/failures, the injection-context pitfall, and open-redirect safety.',
    whatInterviewersExpect:
      'They expect you to use useRouter().push/replace with both location forms, choose push vs replace deliberately, carry params/query correctly, handle the returned promise, and validate redirect targets.',
  },
}

export default programmaticNavigation
