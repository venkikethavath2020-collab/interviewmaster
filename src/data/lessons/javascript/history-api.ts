import type { ConceptLesson } from '../../../types/lesson'

const historyApi: ConceptLesson = {
  // 1. Concept Summary
  slug: 'history-api',
  name: 'History API & SPA Routing',
  category: 'browser-dom',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The History API is what lets a single-page app change the URL and update the page WITHOUT a full reload — the entire foundation of Vue Router, React Router, and every client-side router.',
    'Without it, every navigation would round-trip to the server, destroying the instant, app-like feel users expect; with it you get deep links, working back/forward buttons, and shareable URLs.',
    'Interviewers ask it to check whether you actually understand how SPAs route, or whether you just import a router and hope — the difference between pushState and a hash router is a real, common follow-up.',
    'Getting it wrong breaks the back button, loses scroll position, double-fires navigation, or 404s on refresh — bugs that ship to production constantly.',
    'It connects browser internals (the session history stack), the popstate event, and server configuration (rewrite rules) — a small API that touches the whole stack.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The History API is a stack of bookmarks you can flip back and forward through, while staying in the same book.',
    story: [
      'Imagine you are reading a giant choose-your-own-adventure book. Every time you turn to a new page, you slip a bookmark in so you can find your way back.',
      'Normally, to read a new chapter you would have to close the book, walk to the library, and check out a whole new book — that takes forever.',
      'But this magic book lets you jump straight to any chapter instantly, and it still drops a bookmark each time so the "back" button takes you to exactly where you were.',
      'The History API is that pile of bookmarks. The web page stays open (no trip to the library), but the address bar and the back/forward buttons act like you really moved pages.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you click a normal link, the browser throws away the current page and asks the server for a brand new one. That is slow.',
    'The History API gives JavaScript a way to change the address in the bar and add an entry to the back/forward list without fetching anything from the server.',
    'Your code then swaps the visible content itself, so it feels like a new page even though it is the same page underneath.',
    'The browser keeps a list (a stack) of these entries, and the back and forward buttons walk up and down that list, telling your code each time so it can show the right content.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The History API (history.pushState, history.replaceState, the popstate event, and helpers like history.back/forward/go) lets JavaScript read and modify the browser session history stack and the current URL without triggering a page reload.',
    how: 'You call history.pushState(state, "", url) to add a new history entry and change the URL silently. Your router then renders the matching view. When the user presses back/forward, the browser fires a popstate event with the saved state so you can render the previous view.',
    why: 'It enables fast, app-like navigation with real, bookmarkable URLs and working back/forward buttons — the core mechanism behind client-side routing in SPAs.',
    code: {
      label: 'Navigate without reloading',
      lang: 'js',
      code: `// Change URL + add a history entry, no reload\nhistory.pushState({ page: 'about' }, '', '/about')\nrenderView('/about')\n\n// React to back/forward buttons\nwindow.addEventListener('popstate', (e) => {\n  // e.state is whatever you passed to pushState\n  renderView(location.pathname)\n})\n\nfunction renderView(path) {\n  document.querySelector('#app').textContent = 'Showing ' + path\n}`,
      explanation: [
        'pushState changes the URL to /about and pushes a new entry onto the history stack — the page does NOT reload.',
        'The first argument is a state object the browser stores with the entry; you get it back later as event.state.',
        'When the user clicks Back, the browser fires popstate and you read location.pathname to know what to render.',
        'Note: pushState itself does NOT fire popstate — only user navigation (back/forward) and history.go() do.',
        'renderView is your "router" — in a real app this is Vue Router / React Router swapping components.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The History API is a browser interface (window.history) for manipulating the session history stack of the current browsing context. pushState and replaceState modify the current URL and associated serialized state object without issuing an HTTP request or unloading the document, while back(), forward(), and go() navigate the stack. The popstate event fires when the active history entry changes due to user-driven navigation, carrying the structured-clone state. Client-side routers build on this to map URL paths to view components, with the same-origin policy restricting which URLs you may push.',

  // 7. Internal Working
  internalWorking: [
    'The browser maintains a per-tab session history: an ordered stack of entries, each holding a URL, a state object, scroll position, and document reference.',
    'history.pushState serializes the state via the structured clone algorithm, appends a NEW entry after the current one (truncating any forward entries), updates location/the address bar, and crucially does NOT reload or fire popstate.',
    'history.replaceState does the same but overwrites the current entry instead of pushing, so the back button skips it.',
    'When the user clicks back/forward (or you call history.go/back/forward), the browser moves the current-entry pointer and fires a popstate event on window with a structured clone of that entry’s state.',
    'If the navigation crosses documents (a real different page), the browser unloads and reloads instead of firing popstate; same-document moves fire popstate without a reload.',
    'On a hard refresh, the browser re-requests the current URL from the server — which is why SPAs need server rewrite rules so /about returns index.html instead of 404.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SESSION HISTORY STACK (one browser tab)

   [ / ]  ──pushState('/products')──►  [ / ][ /products ]
                                              ▲ current

   click a product ─pushState('/products/42')►
   [ / ][ /products ][ /products/42 ]
                            ▲ current

   press BACK (popstate fires) ──►
   [ / ][ /products ][ /products/42 ]
              ▲ current        (forward entry kept)

   router hears popstate → renders /products view
   (NO server request, NO page reload)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The history stack lives in the browser process, not your JS heap — you cannot read other entries’ URLs, only history.length and the current state.',
    'Each pushState state object is structured-cloned and stored by the browser; it persists across reloads of that entry, so keep it small (browsers cap it, often ~2MB) and serializable.',
    'Your router keeps its own JS data (route table, current component) in the heap; popstate is the signal that tells it to reconcile with the browser-owned stack.',
    'References to old view components should be released on navigation; holding them in a route cache without bounds is a common SPA memory leak.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — pushState vs replaceState',
      lang: 'js',
      code: `history.pushState({}, '', '/step-1')   // back button now returns here\nhistory.pushState({}, '', '/step-2')\nhistory.replaceState({}, '', '/step-2-fixed') // overwrites step-2\n// History: / , /step-1 , /step-2-fixed\n// Back goes to /step-1, NOT /step-2`,
      explanation: [
        'pushState adds a new entry — the back button can return to the previous URL.',
        'replaceState rewrites the current entry in place — useful for redirects or fixing a URL without adding to history.',
        'After replaceState, /step-2 is gone from the stack; back skips straight to /step-1.',
        'Neither call reloads the page or contacts the server.',
      ],
    },
    intermediate: {
      label: 'Intermediate — a tiny client-side router',
      lang: 'js',
      code: `const routes = {\n  '/': () => 'Home',\n  '/about': () => 'About us',\n  '/contact': () => 'Contact',\n}\n\nfunction navigate(path) {\n  history.pushState({ path }, '', path)\n  render(path)\n}\n\nfunction render(path) {\n  const view = routes[path] || (() => '404')\n  document.querySelector('#app').textContent = view()\n}\n\n// intercept link clicks\ndocument.addEventListener('click', (e) => {\n  const a = e.target.closest('a[data-link]')\n  if (!a) return\n  e.preventDefault()\n  navigate(a.getAttribute('href'))\n})\n\nwindow.addEventListener('popstate', () => render(location.pathname))\nrender(location.pathname)`,
      explanation: [
        'We intercept clicks on internal links with e.preventDefault() so the browser does NOT do a full navigation.',
        'navigate() pushes the new URL and renders the matching view from a route table.',
        'popstate handles back/forward by re-rendering based on location.pathname.',
        'This is the minimal core of every SPA router: intercept, pushState, render, listen to popstate.',
        'A missing route falls through to a 404 view — real routers add params, guards, and lazy loading on top.',
      ],
    },
    advanced: {
      label: 'Advanced — scroll restoration + state on entries',
      lang: 'js',
      code: `// take manual control of scroll restoration\nif ('scrollRestoration' in history) history.scrollRestoration = 'manual'\n\nfunction navigate(path) {\n  // save current scroll into the OUTGOING entry before leaving\n  history.replaceState({ ...history.state, scrollY: window.scrollY }, '')\n  history.pushState({ path, scrollY: 0 }, '', path)\n  render(path)\n  window.scrollTo(0, 0)\n}\n\nwindow.addEventListener('popstate', (e) => {\n  render(location.pathname)\n  const y = e.state?.scrollY ?? 0\n  window.scrollTo(0, y)\n})`,
      explanation: [
        'Setting history.scrollRestoration = "manual" stops the browser from auto-jumping, so we control scroll precisely.',
        'Before navigating away we replaceState to stamp the current scrollY onto the OUTGOING entry.',
        'On back/forward, popstate gives us that saved scrollY via e.state, so we restore the exact position.',
        'This is how production routers (Nuxt, Next) make back-navigation feel native instead of jumping to the top.',
        'State must be structured-cloneable — no DOM nodes, functions, or class instances.',
      ],
    },
    realProject: {
      label: 'Real project — Vue Router uses the History API under the hood',
      lang: 'js',
      code: `import { createRouter, createWebHistory } from 'vue-router'\n\nconst router = createRouter({\n  // createWebHistory() = HTML5 History API (pushState) mode\n  history: createWebHistory(),\n  routes: [\n    { path: '/', component: Home },\n    { path: '/users/:id', component: UserProfile },\n  ],\n  scrollBehavior(to, from, savedPosition) {\n    return savedPosition || { top: 0 }\n  },\n})\n\n// router.push('/users/42') internally calls history.pushState\n// and listens to popstate to handle back/forward.`,
      explanation: [
        'createWebHistory() selects HTML5 history mode — Vue Router calls pushState/replaceState for you.',
        'router.push triggers pushState + component swap; the browser back button fires popstate, which Vue Router intercepts.',
        'scrollBehavior wraps the manual scroll-restoration pattern; savedPosition comes from the entry the user is returning to.',
        'The :id is a dynamic segment parsed from location.pathname — exactly the routing logic built on top of the raw API.',
        'createWebHashHistory() is the fallback (URLs like /#/about) for servers that cannot be configured with rewrite rules.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does history.pushState do, and does it reload the page?',
      answer: 'It adds a new entry to the browser history and changes the URL shown in the address bar without reloading the page or contacting the server. You then render the new view yourself.',
      explanation: 'The key beginner signal is "no reload, no server request" plus the realization that YOU must render the content.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between pushState and replaceState?',
      answer: 'pushState adds a new history entry (back button returns to the previous URL); replaceState overwrites the current entry (back skips it). Use replaceState for redirects or correcting a URL without polluting history.',
      explanation: 'Tests whether the candidate understands the history stack as a mutable list, not just URL changing.',
    },
    {
      level: 'intermediate',
      question: 'Does calling pushState fire a popstate event?',
      answer: 'No. pushState and replaceState do NOT fire popstate. popstate fires only on user-driven navigation (back/forward) or history.go/back/forward. That is why routers call render() manually after pushState.',
      explanation: 'A very common gotcha — many candidates assume popstate is a generic "URL changed" event, which causes double-render or missing-render bugs.',
    },
    {
      level: 'intermediate',
      question: 'Why does refreshing a deep SPA URL like /products/42 sometimes give a 404?',
      answer: 'On refresh the browser actually requests /products/42 from the server. If the server has no file/route there and no rewrite rule, it 404s. The fix is a server rewrite that returns index.html for all app routes so the SPA boots and routes client-side.',
      explanation: 'Connects client routing to server config — a real production issue and a strong full-stack signal.',
    },
    {
      level: 'advanced',
      question: 'How do hash-based routing and History API routing differ, and when would you use a hash router?',
      answer: 'Hash routing puts the route after # (/#/about); the fragment is never sent to the server, so refresh always works without rewrite rules and there is no popstate-style server dependency. History API routing gives clean URLs but needs server rewrites. Use hash mode for static hosting you cannot configure or legacy environments.',
      explanation: 'Senior-leaning tradeoff: clean URLs/SEO vs zero server config. Mentioning that the fragment never hits the server is the discriminator.',
    },
    {
      level: 'senior',
      question: 'How would you implement reliable scroll restoration across navigations?',
      answer: 'Set history.scrollRestoration = "manual", stamp the current scroll position onto the outgoing entry with replaceState before leaving, store it in the pushed entry’s state, and on popstate read e.state to scrollTo the saved position. Handle async content by waiting for the view to render before restoring.',
      explanation: 'Senior signal: knowing scrollRestoration, the outgoing-entry stamping trick, and the async timing problem with lazy content.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does pushState not fire popstate, and how do routers know to render? (they call render manually)',
    'What are the constraints on the state object? (structured-cloneable, size capped)',
    'How do you intercept link clicks so the browser does not do a full navigation? (preventDefault + pushState)',
    'What server configuration is needed for HTML5 history mode? (rewrite all routes to index.html)',
    'How is the hashchange event different from popstate?',
    'How does the Navigation API (newer) improve on the History API?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting pushState/replaceState to trigger popstate (or a re-render automatically).',
      why: 'They never fire popstate; the spec only fires it on user navigation. Code that only listens to popstate misses programmatic navigations.',
      fix: 'Call your render function explicitly after pushState; only rely on popstate for back/forward.',
    },
    {
      mistake: 'Forgetting server rewrite rules, so deep links 404 on refresh.',
      why: 'A refresh sends the full path to the server, which has no such route in an SPA.',
      fix: 'Configure the server (Nginx try_files, Vercel/Netlify rewrites) to serve index.html for all app routes.',
    },
    {
      mistake: 'Putting non-serializable data (DOM nodes, functions, class instances) in the state object.',
      why: 'State is structured-cloned; non-cloneable values throw or are dropped, and large blobs hit the size cap.',
      fix: 'Store only small, plain, serializable identifiers; keep heavy data in your app state keyed by an id from the URL.',
    },
    {
      mistake: 'Not calling e.preventDefault() when intercepting link clicks.',
      why: 'The browser performs its own full navigation in parallel, causing a reload that defeats the SPA.',
      fix: 'preventDefault on internal links, then pushState + render yourself.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Router’s createWebHistory() mode is a thin wrapper over pushState/replaceState/popstate; router.push/replace map directly to those calls, and scrollBehavior implements scroll restoration.' },
    { area: 'React', detail: 'React Router’s BrowserRouter uses the History API; useNavigate calls pushState, and the router subscribes to popstate to re-render route components. createHashRouter is the hash fallback.' },
    { area: 'Node.js', detail: 'The server side of SPA routing: an Express/Nginx catch-all that returns index.html for non-API, non-asset paths so client routing works on refresh and deep links.' },
    { area: 'Backend', detail: 'Analytics and SSR setups intercept history changes to log virtual pageviews and to hydrate the correct route on first load matching the requested URL.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Client-side navigation avoids full document reloads, eliminating re-parsing HTML/CSS/JS and re-establishing connections — navigations feel instant.',
      'Only the changed view is rendered and only its data is fetched, reducing bandwidth versus full server-rendered page loads.',
    ],
    bad: [
      'A large state object on every pushState adds serialization cost and memory, and can hit the browser’s state-size cap.',
      'Unbounded route/component caches that grow on each navigation leak memory across a long session.',
    ],
    optimizations: [
      'Keep history state tiny — store an id and rehydrate heavy data from your store or cache.',
      'Lazy-load route components (code-splitting) so each navigation pulls only the code it needs.',
      'Prefetch the next likely route on hover/visibility to hide network latency.',
      'Use manual scrollRestoration to avoid layout jank on back/forward.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'pushState can only change the URL within the same origin, but a misleading path can still aid phishing if the UI does not reflect real auth state.',
      'Storing sensitive data (tokens, PII) in the history state object exposes it: it persists across reloads and is inspectable.',
      'Open-redirect-style bugs if route params are used to construct external URLs without validation.',
    ],
    bestPractices: [
      'Never put secrets or PII in history.state; keep tokens in httpOnly cookies and sensitive data server-side.',
      'Validate and whitelist any path/param used to build URLs or perform navigations.',
      'Re-check authorization on the server for every route’s data, not just in the client router (client guards are UX, not security).',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'bom', 'event-system', 'es-modules'],
    nextConcepts: ['event-delegation', 'code-splitting-lazy-loading', 'dynamic-imports', 'observers'],
    dependencyNote:
      'The History API lives on the BOM (window.history) and is driven by the event system (popstate, intercepted clicks). It is the substrate for SPA routing, which in turn pairs with code-splitting/lazy-loading to deliver views on demand.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a horizontal stack of boxes labelled / , /about , /contact — the session history.',
      'Mark a "current" pointer under one box.',
      'Say: "pushState adds a box to the right and moves the pointer — no server request, no reload."',
      'Say: "replaceState rewrites the current box instead of adding one."',
      'Draw the back button moving the pointer left and an arrow up to "popstate fires → router renders".',
      'End with the gotcha: "pushState itself does NOT fire popstate — that is why the router calls render() manually."',
    ],
    diagram: `  history stack:
    [ / ] [ /about ] [ /contact ]
                ▲ current
  pushState('/x') -> [ / ][ /about ][ /contact ][ /x ]
                                              ▲ current  (no reload)
  BACK pressed -> popstate fires -> router.render(location.pathname)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The History API (pushState, replaceState, popstate, back/forward/go) lets JS change the URL and the back/forward stack without reloading — the engine of SPA routing. pushState adds an entry and silently changes the URL but does NOT fire popstate, so routers render manually; popstate fires only on user back/forward. Deep links need server rewrites to index.html or you 404 on refresh. Hash routing avoids that at the cost of ugly URLs. Keep state small and serializable.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The History API is how single-page apps navigate without full reloads. The browser keeps a session history stack for each tab. With history.pushState(state, "", url) I add a new entry and change the address bar instantly, with no server request, and then my router renders the matching view. replaceState does the same but overwrites the current entry, which I use for redirects. The crucial subtlety is that pushState and replaceState do NOT fire the popstate event — popstate fires only when the user clicks back or forward, or I call history.go. So a router renders explicitly after pushState and uses popstate purely to handle back/forward, reading location.pathname and the saved state. There are two practical gotchas. First, on a hard refresh the browser actually requests the deep URL from the server, so I need a rewrite rule that serves index.html for all app routes, otherwise I get a 404. Hash-based routing avoids that because the fragment never reaches the server, but the URLs are uglier and weaker for SEO. Second, the state object is structured-cloned and size-capped, so I keep it tiny — an id, not heavy data — and I take manual control of scrollRestoration to make back-navigation restore the exact scroll position. Vue Router and React Router are essentially thin, ergonomic wrappers over exactly this.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'History (clean URL) vs hash routing: clean URLs and SEO/canonicalization vs zero server config and guaranteed refresh-safety on static hosts.',
      'Client routing latency vs SSR first paint: SPA navigations are instant after load, but the initial deep-link load can be slow without SSR/streaming.',
      'Storing route state in history.state (survives reload, capped, serialized) vs in app store (rich, but lost on refresh).',
    ],
    edgeCases: [
      'pushState does not fire popstate — a frequent source of "router did not update" bugs and of double navigation when both fire.',
      'iframes and cross-document navigations reload instead of firing popstate; same-document moves do not.',
      'Browsers may coalesce or rate-limit rapid pushState calls; safari has historically thrown after too many in a short window.',
      'replaceState on the initial load to seed state can clash with the browser’s own restored entry on bfcache restore.',
    ],
    runtimeBehavior: [
      'State is serialized with the structured clone algorithm and persisted per entry, surviving reloads of that entry.',
      'On back/forward across documents the page may be served from the back/forward cache (bfcache), firing pageshow rather than a fresh load — design cleanup around that.',
      'history.length and same-origin policy limit introspection; you cannot read sibling entries’ URLs.',
    ],
    scalability: [
      'In long-lived SPA sessions, route component caches must be bounded (LRU) to avoid unbounded heap growth.',
      'Prefetching and code-splitting per route keep bundle size flat as the app grows; otherwise navigation cost scales with total app size.',
    ],
    productionConcerns: [
      'Server rewrite rules are mandatory for history mode; missing them is the classic "works in dev, 404 in prod" incident.',
      'Analytics must hook navigations explicitly since there is no full page load to count as a pageview.',
      'The newer Navigation API (navigation.navigate, the navigate event, interception) is supplanting raw History for SPAs where supported — worth adopting for cleaner interception and scroll/focus handling.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'pushState(state, "", url) → adds entry, changes URL, NO reload, NO server hit.',
    'replaceState → overwrites current entry (use for redirects).',
    'pushState/replaceState do NOT fire popstate.',
    'popstate fires only on back/forward and history.go/back/forward.',
    'Router pattern: intercept click → preventDefault → pushState → render.',
    'Refresh on deep link needs server rewrite to index.html (or 404).',
    'Hash routing (/#/path): no server config, fragment never sent to server.',
    'state is structured-cloned and size-capped — keep it tiny + serializable.',
    'history.scrollRestoration = "manual" for custom scroll behavior.',
    'Vue/React routers are wrappers over this API.',
    'Same-origin only; cannot read sibling entries.',
    'Newer Navigation API improves interception — adopt where supported.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function go(path) that changes the URL to `path` without reloading and logs the new path. Then make the back button log the path it returned to.',
      hint: 'Use pushState for go, and listen to popstate for back/forward.',
      solution: {
        lang: 'js',
        code: `function go(path) {\n  history.pushState({ path }, '', path)\n  console.log('navigated to', path)\n}\n\nwindow.addEventListener('popstate', () => {\n  console.log('back/forward to', location.pathname)\n})`,
        explanation: [
          'pushState changes the URL and adds a history entry with no reload.',
          'popstate fires when the user goes back/forward; we read location.pathname to know where we landed.',
          'Note pushState alone would not trigger the popstate handler — that is why we log inside go() too.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement link interception: clicking any <a data-link href="..."> should navigate within the SPA instead of reloading.',
      hint: 'Delegate a single click listener on document, find the nearest matching anchor, preventDefault, then pushState + render.',
      solution: {
        lang: 'js',
        code: `function render(path) {\n  document.querySelector('#app').textContent = 'View: ' + path\n}\n\ndocument.addEventListener('click', (e) => {\n  const a = e.target.closest('a[data-link]')\n  if (!a) return\n  e.preventDefault()\n  const path = a.getAttribute('href')\n  history.pushState({ path }, '', path)\n  render(path)\n})\n\nwindow.addEventListener('popstate', () => render(location.pathname))`,
        explanation: [
          'A single delegated listener handles all current and future links (event delegation).',
          'closest finds the anchor even if the click landed on a child element.',
          'preventDefault stops the browser’s full navigation; pushState + render does it client-side.',
          'popstate keeps back/forward in sync with the same render function.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add scroll restoration: when the user navigates back, restore the scroll position they were at on that page.',
      hint: 'Take manual control, stamp scrollY onto the outgoing entry before leaving, and restore from e.state on popstate.',
      solution: {
        lang: 'js',
        code: `if ('scrollRestoration' in history) history.scrollRestoration = 'manual'\n\nfunction navigate(path) {\n  history.replaceState({ ...history.state, y: window.scrollY }, '')\n  history.pushState({ path, y: 0 }, '', path)\n  render(path)\n  window.scrollTo(0, 0)\n}\n\nwindow.addEventListener('popstate', (e) => {\n  render(location.pathname)\n  window.scrollTo(0, e.state?.y ?? 0)\n})\n\nfunction render(path) { /* swap view */ }`,
        explanation: [
          'Manual scrollRestoration stops the browser auto-jumping so we control it.',
          'Before leaving we replaceState to stamp the current scrollY on the OUTGOING entry.',
          'The new entry starts at y:0; back/forward read e.state.y to restore the exact position.',
          'render must finish (or content be present) before scrollTo for the position to be valid.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a minimal router class with routes, navigate(path), and back/forward support, matching a dynamic param like /users/:id.',
      hint: 'Store a route table with regexes for params; on navigate pushState + match; on popstate match again.',
      solution: {
        lang: 'js',
        code: `class Router {\n  constructor(routes) {\n    // routes: { '/users/:id': (params) => string }\n    this.routes = Object.entries(routes).map(([pattern, view]) => {\n      const keys = []\n      const re = new RegExp('^' + pattern.replace(/:(\\w+)/g, (_, k) => {\n        keys.push(k); return '([^/]+)'\n      }) + '$')\n      return { re, keys, view }\n    })\n    window.addEventListener('popstate', () => this.render(location.pathname))\n  }\n  navigate(path) {\n    history.pushState({}, '', path)\n    this.render(path)\n  }\n  render(path) {\n    for (const { re, keys, view } of this.routes) {\n      const m = path.match(re)\n      if (m) {\n        const params = {}\n        keys.forEach((k, i) => (params[k] = m[i + 1]))\n        document.querySelector('#app').textContent = view(params)\n        return\n      }\n    }\n    document.querySelector('#app').textContent = '404'\n  }\n}\n\nconst router = new Router({\n  '/': () => 'Home',\n  '/users/:id': ({ id }) => 'User ' + id,\n})\nrouter.navigate('/users/42') // renders "User 42"`,
        explanation: [
          'Each route pattern is compiled to a regex, replacing :name segments with capture groups and recording the param names.',
          'navigate pushes the URL then renders; popstate re-renders for back/forward.',
          'render finds the first matching route, extracts params from the regex match, and calls the view.',
          'No match falls through to a 404 view — this is the essence of Vue/React routers without the framework glue.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Every SPA you build routes on this API, so understanding it turns "the router is magic" into "I know exactly what router.push does." It also exposes the client/server boundary (rewrites, refresh, SEO) that distinguishes a developer who has shipped SPAs from one who has only used them.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and pushState-vs-replaceState. Product companies (Zoho, Flipkart, Razorpay) ask you to build a mini router and explain the refresh-404 problem and hash-vs-history tradeoff. FAANG-level interviews probe scroll restoration, bfcache, the Navigation API, and SSR hydration matching the URL.',
    whatInterviewersExpect:
      'They expect you to explain that pushState changes the URL without reloading, that it does NOT fire popstate, how a router intercepts clicks and renders, why deep links need server rewrites, and the hash-vs-history tradeoff — ideally tying it to a router you have actually used.',
  },
}

export default historyApi
