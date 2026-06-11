import type { ConceptLesson } from '../../../types/lesson'

const nestedRoutes: ConceptLesson = {
  // 1. Concept Summary
  slug: 'nested-routes',
  name: 'Nested Routes',
  category: 'routing',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Real UIs are nested: a dashboard shell with a persistent sidebar swaps only the inner panel — nested routes model that "layout stays, content changes" structure directly in the URL.',
    'They keep shared layout (headers, tabs, sidebars) mounted while only the child view changes, avoiding flicker and preserving state.',
    'Tabbed detail pages (/users/:id/profile, /users/:id/settings) are the textbook use case and a very common interview prompt.',
    'Understanding the multiple <router-view> outlets and how children paths compose is a frequent source of "why is nothing rendering" bugs.',
    'They are the basis for layout-driven routing, default child routes (redirects/empty path), and named views.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Nested routes are like a TV picture-in-picture: the big channel stays on while a smaller box inside changes.',
    story: [
      'Picture a school notebook with a sturdy cover that never changes — it always has your name and the subject on it.',
      'Inside that same cover, you flip between different pages: page one is "Homework", page two is "Notes", page three is "Tests".',
      'The cover (your layout) stays put. Only the page inside it flips. You do not throw away the whole notebook every time you turn a page.',
      'Nested routes work the same way: an outer page holds the cover, and a little window inside it (called a child router-view) flips between the inner pages while the cover stays exactly where it is.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A nested route is a route inside another route. The parent route renders a layout component, and that layout contains its own <router-view> where the matching child renders.',
    'So a URL like /user/1/profile matches the parent /user/:id (which shows the user shell) AND the child profile (which shows inside the shell).',
    'Because the parent stays mounted while children change, shared parts like a sidebar or tabs do not reload or lose their state.',
    'Child paths are relative — you write profile, not /user/:id/profile — and the router joins them onto the parent path automatically.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Nested routes are routes defined in a parent route’s children array. The parent component renders a layout and includes a nested <router-view>; the matched child renders into that nested outlet, so the URL maps to a chain of components.',
    how: "You add children to a route record. Each child has a relative path. The parent component must contain its own <router-view /> for the child to appear. A child with path: '' is the default shown at the parent’s URL.",
    why: 'It mirrors nested UI structure (shells, tabs, sub-sections) in both the URL and the component tree, keeping shared layout mounted while only the inner view changes.',
    code: {
      label: 'A user shell with nested tabs',
      lang: 'js',
      code: "const routes = [\n  {\n    path: '/user/:id',\n    component: () => import('./UserLayout.vue'),\n    children: [\n      // /user/:id  -> default child\n      { path: '', name: 'user-home', component: () => import('./UserHome.vue') },\n      // /user/:id/profile\n      { path: 'profile', name: 'user-profile', component: () => import('./UserProfile.vue') },\n      // /user/:id/settings\n      { path: 'settings', name: 'user-settings', component: () => import('./UserSettings.vue') },\n    ],\n  },\n]",
      explanation: [
        'The parent /user/:id renders UserLayout.vue, which contains a nested <router-view />.',
        'Child paths are relative — "profile" becomes /user/:id/profile.',
        "path: '' is the default child rendered at the bare parent URL.",
        'The parent layout stays mounted while you switch between profile and settings.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Nested routes are route records declared in a parent record’s children array, producing a hierarchy where each level renders into a <router-view> placed in its parent’s component. A single URL resolves to an ordered list of matched records (route.matched), each rendered into the corresponding nested outlet. Child paths are relative (joined to the parent), an empty-path child is the parent’s default view, and the parent component instance persists across child navigations, preserving its state and avoiding re-render of shared layout. Optional named views allow multiple sibling outlets at the same level.',

  // 7. Internal Working
  internalWorking: [
    'At creation the router flattens the children hierarchy into the matcher, joining each child’s relative path onto its parent to form full path patterns.',
    'On navigation the matcher resolves the URL to route.matched — an ordered array of records from the top-most parent down to the deepest matched child.',
    'The top-level <router-view> renders route.matched[0]’s component; each nested <router-view> inside a parent renders the next record in that chain, so depth maps to outlet nesting.',
    'When navigating between siblings (profile -> settings), the shared parent record is unchanged, so Vue Router reuses the parent component instance and only swaps the child outlet’s component.',
    'An empty-path child ({ path: \'\' }) matches the parent’s exact URL and renders as the default inner view; a child redirect can send the bare parent URL to a specific tab.',
    'Because parent params (like :id) live on the shared route.params, all nested children read the same params reactively.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  URL: /user/1/settings
        │ resolves to chain
        ▼
   route.matched = [ UserLayout, UserSettings ]

   ┌ App.vue ─────────────────────────────┐
   │ <router-view/>  ← renders UserLayout  │
   │   ┌ UserLayout.vue ─────────────────┐ │
   │   │  sidebar / tabs  (STAYS mounted) │ │
   │   │  <router-view/> ← UserSettings   │ │
   │   └──────────────────────────────────┘ │
   └───────────────────────────────────────┘

   profile → settings : parent reused, only inner outlet swaps`,

  // 9. Memory Visualization (omitted — not memory-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — parent layout with a nested outlet',
      lang: 'vue',
      code: "<!-- UserLayout.vue -->\n<script setup>\nimport { useRoute } from 'vue-router'\nconst route = useRoute()\n</script>\n\n<template>\n  <h1>User {{ route.params.id }}</h1>\n  <nav>\n    <router-link :to=\"`/user/${route.params.id}/profile`\">Profile</router-link>\n    <router-link :to=\"`/user/${route.params.id}/settings`\">Settings</router-link>\n  </nav>\n  <!-- child renders here -->\n  <router-view />\n</template>",
      explanation: [
        'The parent layout owns the heading and tab links that stay constant across children.',
        'The nested <router-view /> is the outlet where profile/settings render.',
        'route.params.id is shared with all children because the parent owns the :id segment.',
        'Switching tabs keeps this layout mounted — no flicker, state preserved.',
      ],
    },
    intermediate: {
      label: 'Intermediate — default child via redirect or empty path',
      lang: 'js',
      code: "const routes = [\n  {\n    path: '/settings',\n    component: () => import('./SettingsLayout.vue'),\n    children: [\n      // Option A: empty path = default view at /settings\n      { path: '', name: 'settings-general', component: () => import('./General.vue') },\n      { path: 'security', name: 'settings-security', component: () => import('./Security.vue') },\n      // Option B (alternative): redirect bare /settings to a tab\n      // { path: '', redirect: { name: 'settings-general' } },\n    ],\n  },\n]",
      explanation: [
        "An empty-path child renders at the parent’s exact URL (/settings).",
        'Alternatively a redirect child sends /settings to a named default tab.',
        'Without either, visiting /settings shows the layout with an empty inner outlet — a common confusion.',
        'Named children make these links robust to path changes.',
      ],
    },
    advanced: {
      label: 'Advanced — multiple sibling outlets (named views)',
      lang: 'js',
      code: "const routes = [\n  {\n    path: '/dashboard',\n    components: {\n      default: () => import('./DashboardMain.vue'),\n      sidebar: () => import('./DashboardSidebar.vue'),\n    },\n    children: [\n      { path: 'reports', component: () => import('./Reports.vue') },\n    ],\n  },\n]\n// In DashboardLayout template:\n// <router-view />                used for `default`\n// <router-view name=\"sidebar\" /> used for `sidebar`",
      explanation: [
        'Named views render multiple components at the SAME route level into different outlets.',
        'The route uses components (plural) keyed by outlet name instead of a single component.',
        '<router-view name="sidebar" /> targets the matching keyed component.',
        'This composes layout regions (main + sidebar) without nesting them as parent/child.',
      ],
    },
    realProject: {
      label: 'Real project — admin shell with nested feature routes',
      lang: 'js',
      code: "const routes = [\n  {\n    path: '/admin',\n    component: () => import('@/layouts/AdminLayout.vue'),\n    meta: { requiresAuth: true },\n    children: [\n      { path: '', redirect: { name: 'admin-overview' } },\n      { path: 'overview', name: 'admin-overview', component: () => import('@/views/admin/Overview.vue') },\n      {\n        path: 'users',\n        component: () => import('@/views/admin/UsersLayout.vue'),\n        children: [\n          { path: '', name: 'admin-users', component: () => import('@/views/admin/UserList.vue') },\n          { path: ':id', name: 'admin-user', component: () => import('@/views/admin/UserDetail.vue'), props: true },\n        ],\n      },\n    ],\n  },\n]",
      explanation: [
        'AdminLayout provides the persistent shell (nav + header) for everything under /admin.',
        'A redirect child sends /admin to the overview tab as a sensible default.',
        'Routes nest two levels deep: /admin/users/:id resolves AdminLayout -> UsersLayout -> UserDetail.',
        'meta: { requiresAuth } on the parent applies to all descendants via a global guard.',
        'props: true on the deepest child keeps UserDetail decoupled from the router.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are nested routes and when do you use them?',
      answer: 'Nested routes are routes defined in a parent route’s children array. You use them when the UI has a persistent layout (sidebar, tabs, shell) whose inner content changes — the parent renders the layout with a nested <router-view>, and children render inside it.',
      explanation: 'A good answer ties the concept to nested UI and mentions the required nested <router-view> in the parent.',
    },
    {
      level: 'beginner',
      question: 'Why is nothing showing inside my parent route?',
      answer: 'The parent component is missing a nested <router-view />, or there is no default (empty-path) child for the bare parent URL. Add a <router-view /> inside the parent layout and/or an { path: \'\' } child or redirect.',
      explanation: 'This is the single most common nested-routes bug; naming both causes (missing outlet, no default child) shows real debugging experience.',
    },
    {
      level: 'intermediate',
      question: 'Are child paths absolute or relative, and how do you make a default child?',
      answer: "Child paths are relative and joined to the parent (path: 'profile' -> /user/:id/profile). A leading slash makes it absolute. The default child uses path: '' to render at the parent’s exact URL, or a redirect to a named tab.",
      explanation: 'Mentioning the leading-slash exception and the empty-path default demonstrates precise knowledge of path composition.',
    },
    {
      level: 'intermediate',
      question: 'What happens to the parent component when you navigate between sibling children?',
      answer: 'The parent stays mounted. Since the shared parent record does not change, Vue Router reuses the parent instance and only swaps the child outlet’s component, so the layout and its state are preserved without re-render.',
      explanation: 'This persistence is the whole point of nesting; contrast it with sibling-to-sibling reuse to show understanding.',
    },
    {
      level: 'advanced',
      question: 'How do named views differ from nested routes?',
      answer: 'Nested routes render a hierarchy (parent -> child) into nested outlets. Named views render multiple components at the SAME level into multiple sibling outlets (e.g. main + sidebar), configured with components (plural) keyed by name and matched by <router-view name="...">.',
      explanation: 'Distinguishing vertical nesting from horizontal multi-outlet layout is a senior-leaning distinction.',
    },
    {
      level: 'senior',
      question: 'How does route.matched relate to the rendered component tree, and why does it matter?',
      answer: 'route.matched is the ordered array of records from the top parent to the deepest child for the current URL. Each nested <router-view> renders the next record in that chain. It matters for guards (per-record beforeEnter), aggregating meta across the chain, and rendering breadcrumbs — you iterate route.matched to know the full active path.',
      explanation: 'Connecting route.matched to guards, meta inheritance, and breadcrumbs signals deep familiarity with the router internals.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you set a default tab for a parent route? (empty-path child or redirect)',
    'How do children access the parent’s :id param?',
    'What is the difference between a nested route and a named view?',
    'How does meta defined on a parent propagate to children?',
    'How would you render breadcrumbs from route.matched?',
    'Can a child route have an absolute path, and what happens if it does?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting the nested <router-view /> inside the parent layout.',
      why: 'The child route matches but has no outlet to render into, so the inner area is blank.',
      fix: 'Add a <router-view /> inside the parent component where the child should appear.',
    },
    {
      mistake: 'Giving child paths a leading slash by habit (path: "/profile").',
      why: 'A leading slash makes the path absolute, so it resolves to /profile instead of /user/:id/profile.',
      fix: 'Use relative child paths (path: "profile"); only use a leading slash when you intentionally want an absolute path.',
    },
    {
      mistake: 'Expecting the bare parent URL to show content with no default child.',
      why: 'Without an empty-path child or redirect, /settings renders only the layout with an empty inner outlet.',
      fix: "Add { path: '' , component: Default } or { path: '', redirect: { name: 'tab' } }.",
    },
    {
      mistake: 'Assuming the parent remounts when a child changes.',
      why: 'The parent record is unchanged across sibling navigation, so its instance is reused, not remounted.',
      fix: 'Rely on that persistence for shared state; if you truly need a fresh parent, change its key or route.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Dashboard/admin apps use a top-level layout route with nested feature routes so the sidebar/header persist while panels swap.' },
    { area: 'Nuxt', detail: 'Nested layouts are expressed via parent page files plus a <NuxtPage /> outlet, mirroring Vue Router’s nested <router-view>.' },
    { area: 'Component library', detail: 'Tabbed-detail components map each tab to a nested child route, keeping deep links shareable (/users/:id/activity).' },
    { area: 'SSR', detail: 'Server rendering resolves route.matched to render the full nested chain in one pass, then hydrates the same hierarchy on the client.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Persistent parent layout avoids re-rendering shared chrome (sidebar/header) on every inner navigation.',
      'Lazy-loaded children mean deep features are only downloaded when their tab is opened.',
    ],
    bad: [
      'Deeply nested layouts add render layers; a heavy parent that re-renders on param change cascades to all children.',
      'Multiple named views can fetch redundant data if each outlet loads independently without coordination.',
    ],
    optimizations: [
      'Keep parent layouts lightweight; push data fetching down to the child that needs it.',
      'Use lazy import per child route for code splitting at every level.',
      'Wrap inner outlets in <keep-alive> when returning to a tab should preserve scroll/state.',
      'Hoist shared parent data fetching to run once, and pass it down rather than refetching per child.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Placing requiresAuth meta only on a child (not the parent layout) can leak the layout/shell to unauthorized users.',
      'Nested params (parent :id) are user-controlled and reach child data calls, inviting IDOR if not authorized.',
    ],
    bestPractices: [
      'Put protective meta on the parent record so a global guard covers the whole subtree via route.matched.',
      'Enforce authorization server-side for every nested resource id, not just by gating the route.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['vue-router-basics', 'dynamic-routes'],
    nextConcepts: ['navigation-guards', 'route-meta-lazy-loading', 'programmatic-navigation', 'keepalive'],
    dependencyNote:
      'Nested routes build on Vue Router Basics (the route table and <router-view>) and dynamic routes (shared params). They lead naturally into guards (which iterate route.matched), per-route meta, and keep-alive for preserving inner-tab state.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the URL /user/1/settings at the top.',
      'Draw route.matched = [UserLayout, UserSettings] underneath.',
      'Draw the App <router-view> rendering UserLayout, and inside UserLayout draw a second <router-view> rendering UserSettings.',
      'Label the outer layout "STAYS mounted" and the inner outlet "swaps".',
      'Say: "Children are relative paths in a children array; the parent needs its own nested router-view, and an empty-path child is the default tab."',
    ],
    diagram: `  /user/1/settings → matched=[UserLayout, UserSettings]

  App
   └ <router-view> → UserLayout   (persists)
        └ <router-view> → UserSettings (swaps)

  children: ['', 'profile', 'settings']  (relative)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Nested routes are routes in a parent’s children array. The parent renders a layout containing its own nested <router-view>, and matched children render inside it, so /user/:id/profile maps to a chain of components (route.matched). Child paths are relative; an empty-path child is the default tab; the parent stays mounted across sibling navigations, preserving shared layout and state. The classic bug is forgetting the nested <router-view> or a default child. Named views render multiple sibling outlets at one level.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Nested routes let me model nested UI directly in the URL and the component tree. I define a parent route that renders a layout component, and inside that layout I place a nested <router-view>. The parent route gets a children array of route records with relative paths, so a child path like "profile" becomes /user/:id/profile. When a URL matches, Vue Router produces route.matched — an ordered list from the top parent down to the deepest child — and renders each record into the corresponding nested outlet. The big payoff is that the parent stays mounted while children change: navigating from the profile tab to the settings tab reuses the parent instance and only swaps the inner outlet, so the sidebar, tabs, and any layout state are preserved with no flicker. Two details I always get right: child paths are relative, so I avoid a leading slash unless I deliberately want an absolute path; and the bare parent URL shows only the layout with an empty inner area unless I add a default child — either an empty-path child or a redirect to a named tab. That missing-default or missing nested-router-view is the most common "nothing renders" bug. Children share the parent’s params, so all tabs read the same :id reactively. For more complex layouts I can use named views — components plural keyed by outlet name with <router-view name="sidebar"> — to render multiple sibling regions at the same level. At senior level I lean on route.matched for things like aggregating meta across the chain for a single auth guard, and for building breadcrumbs by iterating the matched records.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Deep nesting (clear URL/UI mapping, persistent layout) vs flat routes (simpler matching, fewer render layers).',
      'Empty-path default child (renders content at parent URL) vs redirect default (clean canonical URL but an extra navigation).',
      'Named views (multiple regions at one level) vs nested children (vertical hierarchy) — choose by whether regions are siblings or parent/child.',
    ],
    edgeCases: [
      'A child with an absolute path silently escapes the parent prefix, breaking expected nesting.',
      'No default child leaves the parent outlet empty at the bare URL — easy to miss.',
      'Parent param change (different :id) reuses the parent instance, so the layout must watch params to refresh shared data.',
      'Guards/meta defined per record require iterating route.matched to aggregate across the chain.',
    ],
    runtimeBehavior: [
      'route.matched is ordered parent-to-child; each nested <router-view> renders the next index.',
      'Sibling navigation reuses the shared parent instance; only the diverging records remount.',
      'Per-record beforeEnter guards run in matched order, enabling layout-level protection.',
    ],
    scalability: [
      'Feature teams own nested subtrees (e.g. /admin/users/*) as modular route files merged into the parent.',
      'Lazy-load at every level so deep features don’t bloat the initial bundle.',
      'Hoist shared parent data and pass down to avoid each child refetching the same context.',
    ],
    productionConcerns: [
      'Auth meta must sit on the parent layout record so the whole subtree is protected via a global guard reading route.matched.',
      'Breadcrumbs and analytics derive from route.matched + meta; keep meta consistent across records.',
      'Preserving inner-tab scroll/state on back navigation often needs <keep-alive> around the inner outlet.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Nested route = record in parent.children with a RELATIVE path.',
    'Parent component MUST contain a nested <router-view />.',
    "Default tab: { path: '' , component } or { path: '', redirect }.",
    'Leading slash in a child path = absolute (escapes parent).',
    'Parent instance PERSISTS across sibling navigation.',
    'All children share the parent’s params (e.g. :id).',
    'route.matched = ordered [parent...child] for the URL.',
    'Named views: components (plural) + <router-view name="x">.',
    'Put auth/meta on the PARENT to cover the subtree.',
    'Use <keep-alive> to preserve inner-tab state.',
    'Lazy-load each level for code splitting.',
    'Iterate route.matched for breadcrumbs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Define a /settings parent route with two children: general (default) and security.',
      hint: "Use children with an empty-path default.",
      solution: {
        lang: 'js',
        code: "const routes = [\n  {\n    path: '/settings',\n    component: () => import('./SettingsLayout.vue'),\n    children: [\n      { path: '', name: 'settings-general', component: () => import('./General.vue') },\n      { path: 'security', name: 'settings-security', component: () => import('./Security.vue') },\n    ],\n  },\n]",
        explanation: [
          'The empty-path child renders at /settings as the default.',
          'security is relative, becoming /settings/security.',
          'The layout must include a nested <router-view /> for these to show.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write the SettingsLayout template with tab links and the nested outlet.',
      hint: 'Named <router-link>s + nested <router-view />.',
      solution: {
        lang: 'vue',
        code: "<template>\n  <h1>Settings</h1>\n  <nav>\n    <router-link :to=\"{ name: 'settings-general' }\">General</router-link>\n    <router-link :to=\"{ name: 'settings-security' }\">Security</router-link>\n  </nav>\n  <router-view />\n</template>",
        explanation: [
          'The heading and tabs stay mounted across tab switches.',
          'Named links survive path changes.',
          'The nested <router-view /> renders the active child.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a two-level nested structure: /admin (layout) -> /admin/users (list layout) -> /admin/users/:id (detail), redirecting /admin to an overview.',
      hint: 'Nest children arrays and use a redirect for the bare parent.',
      solution: {
        lang: 'js',
        code: "const routes = [\n  {\n    path: '/admin',\n    component: () => import('./AdminLayout.vue'),\n    children: [\n      { path: '', redirect: { name: 'admin-overview' } },\n      { path: 'overview', name: 'admin-overview', component: () => import('./Overview.vue') },\n      {\n        path: 'users',\n        component: () => import('./UsersLayout.vue'),\n        children: [\n          { path: '', name: 'admin-users', component: () => import('./UserList.vue') },\n          { path: ':id', name: 'admin-user', component: () => import('./UserDetail.vue'), props: true },\n        ],\n      },\n    ],\n  },\n]",
        explanation: [
          'Two nested children arrays create a three-component chain for /admin/users/:id.',
          'The redirect gives /admin a sensible default tab.',
          'Each layout needs its own nested <router-view />.',
          'props: true decouples UserDetail from the router.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Render breadcrumbs from route.matched, using each record’s meta.title.',
      hint: 'Iterate route.matched and read record.meta.',
      solution: {
        lang: 'vue',
        code: "<script setup>\nimport { computed } from 'vue'\nimport { useRoute } from 'vue-router'\n\nconst route = useRoute()\nconst crumbs = computed(() =>\n  route.matched\n    .filter(r => r.meta && r.meta.title)\n    .map(r => ({ title: r.meta.title, path: r.path }))\n)\n</script>\n\n<template>\n  <nav>\n    <span v-for=\"(c, i) in crumbs\" :key=\"c.path\">\n      <router-link :to=\"c.path\">{{ c.title }}</router-link>\n      <span v-if=\"i < crumbs.length - 1\"> / </span>\n    </span>\n  </nav>\n</template>",
        explanation: [
          'route.matched is the ordered parent-to-child chain for the current URL.',
          'Filtering by meta.title yields the breadcrumb trail.',
          'computed keeps the breadcrumbs reactive to navigation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Nested routes are how real dashboards and detail pages are structured, so being fluent here signals you can architect an app’s navigation, not just wire up flat pages. The persistent-layout mental model and route.matched are exactly the details that separate confident candidates.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what nested routes are and how to make a default tab. Product companies (Zoho, Flipkart, Razorpay) ask you to build a tabbed detail page and debug the blank-outlet bug. FAANG-level interviews probe route.matched, named views, meta aggregation for guards, and keep-alive trade-offs.',
    whatInterviewersExpect:
      'They expect you to define children with relative paths, add the nested <router-view>, provide a default child, explain parent persistence, and use route.matched for breadcrumbs or subtree-wide auth.',
  },
}

export default nestedRoutes
