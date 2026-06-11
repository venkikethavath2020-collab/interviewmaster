import type { ConceptLesson } from '../../../types/lesson'

const bom: ConceptLesson = {
  // 1. Concept Summary
  slug: 'bom',
  name: 'BOM',
  category: 'browser-dom',
  difficulty: 'beginner',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'The BOM (Browser Object Model) is how your JavaScript talks to the browser itself — the window, the URL bar, history, screen, and timers — everything outside the page content.',
    'Without it you could not navigate (`location.href`), open popups, read the URL, go back/forward, detect screen size, or schedule work with `setTimeout` — these are BOM APIs, not DOM ones.',
    'Interviewers ask it to check whether you understand that `window` is the global object in browsers and that the DOM (`document`) is just one branch of the larger BOM tree.',
    'Confusing BOM and DOM is a classic junior mistake; knowing the boundary signals you understand where the language ends and the host environment begins.',
    'Routing, analytics, redirects, and feature detection in every SPA (Vue Router, React Router) sit on top of BOM objects like `location` and `history`.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The BOM is the dashboard and controls of the car your webpage rides in.',
    story: [
      'Imagine your webpage is a passenger sitting inside a car. The car is the browser.',
      'The passenger (your page content) can only see the seats and windows — that is the DOM, the inside of the car.',
      'But the car also has a steering wheel, a speedometer, a horn, and a sign showing what street you are on. Those belong to the car, not the passenger.',
      'The BOM is that whole set of car controls. With it your JavaScript can steer to a new address, honk a popup, check how big the windows are, or look at the street sign to see where you are.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a web page runs in a browser, the browser gives it a big helper object called `window`. Everything lives inside `window`.',
    'Some parts of `window` are about the page content — that is the DOM, reached through `window.document`.',
    'Other parts are about the browser as a program: the current address (`location`), the visited pages (`history`), the screen size (`screen`), and pop-up boxes (`alert`). Together those browser parts are called the BOM.',
    'So DOM = the page; BOM = the browser around the page. Both hang off the same `window` object.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Browser Object Model (BOM) is the collection of objects the browser exposes to JavaScript for interacting with the browser environment rather than the document — chiefly `window`, `location`, `history`, `navigator`, and `screen`.',
    how: 'The browser creates a global `window` object for each tab/frame; it is the global scope, so `window.x` and `x` are the same at the top level. BOM members like `location` and `history` are properties of `window`, so you can read and call them directly.',
    why: 'It lets a page control and observe the browser: change the URL, navigate history, read the user agent, get the viewport size, and run code on a timer.',
    code: {
      label: 'Touring the BOM',
      lang: 'js',
      code: `console.log(window === globalThis) // true in browsers\n\nconsole.log(location.href)      // current full URL\nconsole.log(location.pathname)  // just the path, e.g. /products\n\nconsole.log(navigator.language) // 'en-US'\nconsole.log(screen.width)       // physical screen width in px\n\nhistory.back()                  // like clicking the back button\n\nsetTimeout(() => console.log('1s later'), 1000) // BOM timer`,
      explanation: [
        '`window` is the global object — `window === globalThis` confirms it.',
        '`location` describes and controls the current URL; `.href` is the whole address, `.pathname` is the path part.',
        '`navigator` carries info about the browser/user, like preferred language.',
        '`screen` reports the physical display dimensions (not the page).',
        '`history.back()` navigates the session history; `setTimeout` is a BOM-provided timer, not part of core JavaScript.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Browser Object Model is the host-provided object hierarchy rooted at the global `window` object, exposing browser-level functionality to JavaScript: `location` (URL manipulation and navigation), `history` (session history and the History API), `navigator` (user-agent and capability data), `screen` (display metrics), and timer/dialog functions (`setTimeout`, `alert`). It is not standardized as a single spec like the DOM; rather it is a loose, historically-grown set of interfaces defined across the HTML Living Standard. The DOM (`document`) is one property of `window`, so the BOM is the broader environment that contains the DOM.',

  // 7. Internal Working
  internalWorking: [
    'When the browser loads a document, it creates a fresh JavaScript realm with a global object — `window` — for that browsing context (tab, iframe, or popup).',
    'The engine installs host objects as properties of `window`: `document`, `location`, `history`, `navigator`, `screen`, plus global functions like `setTimeout` and `fetch`.',
    'Because `window` is the global object, top-level `var` declarations and undeclared globals become properties of it; identifier lookups that miss local scopes resolve against `window`.',
    'Reading `location.href` returns a live string of the parsed URL; assigning to it (`location.href = ...`) instructs the browser engine to start a navigation, tearing down the current realm.',
    '`history` wraps the session-history stack maintained by the browser; `pushState`/`back` mutate or traverse it without a full reload via the History API.',
    'Each browsing context gets its own `window`; iframes have separate `window` objects, and cross-origin access between them is blocked by the same-origin policy.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `                  ┌──────────────── window ────────────────┐
                  │   (the global object = globalThis)       │
                  │                                          │
   ┌──────────────┼───────────┬──────────┬──────────┬───────┤
   ▼              ▼           ▼          ▼          ▼        ▼
 document      location    history   navigator   screen   setTimeout/
 (the DOM)     (URL/nav)   (back/fwd)(UA info)  (display)  alert/fetch
   │
   ▼
 <html>…<body>…  ← page content tree

  BOM = everything under window  ·  DOM = the document subtree`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reading and changing the URL',
      lang: 'js',
      code: `// Read parts of the current URL\nconsole.log(location.protocol) // 'https:'\nconsole.log(location.host)     // 'example.com'\nconsole.log(location.search)   // '?id=42'\n\n// Navigate to a new page\nfunction goToProduct(id) {\n  location.href = '/products/' + id\n}`,
      explanation: [
        '`location` is a structured view of the URL split into protocol, host, path, and query.',
        'Assigning to `location.href` triggers a full navigation (and a page reload).',
        'This is the simplest, most common BOM operation: programmatic navigation.',
      ],
    },
    intermediate: {
      label: 'Intermediate — parsing query params and feature detection',
      lang: 'js',
      code: `// Parse the query string with the URL/URLSearchParams APIs\nconst params = new URLSearchParams(location.search)\nconst page = Number(params.get('page')) || 1\n\n// Feature/capability detection via navigator\nconst online = navigator.onLine\nconst lang = navigator.language\n\n// Responsive logic from the BOM\nconst isSmall = window.innerWidth < 768`,
      explanation: [
        '`URLSearchParams` cleanly reads query parameters from `location.search` instead of manual string splitting.',
        '`navigator.onLine` and `navigator.language` let you adapt behavior to the user environment.',
        '`window.innerWidth` gives the viewport width — distinct from `screen.width`, which is the physical display.',
        'These are read-only checks, safe to run on load without side effects.',
      ],
    },
    advanced: {
      label: 'Advanced — client-side routing with the History API',
      lang: 'js',
      code: `function navigate(path) {\n  // Change the URL WITHOUT a full reload\n  history.pushState({ path }, '', path)\n  render(path)\n}\n\n// React to the user pressing Back/Forward\nwindow.addEventListener('popstate', (e) => {\n  render(location.pathname)\n})\n\nfunction render(path) {\n  document.getElementById('app').textContent = 'Route: ' + path\n}`,
      explanation: [
        '`history.pushState` adds an entry to session history and updates the URL bar without reloading — the basis of SPAs.',
        'The `popstate` event fires when the user navigates the history stack, so you re-render the matching view.',
        'This combines BOM (`history`, `location`, `window` events) with the DOM (`document`) to build a router.',
        'Vue Router and React Router use exactly this mechanism in their "history" mode.',
      ],
    },
    realProject: {
      label: 'Real project — a redirect guard + analytics in a Vue app',
      lang: 'js',
      code: `// router guard (Vue Router style)\nrouter.beforeEach((to) => {\n  if (to.meta.requiresAuth && !isLoggedIn()) {\n    // remember where the user wanted to go\n    const next = encodeURIComponent(location.pathname)\n    return '/login?next=' + next\n  }\n})\n\n// fire a page-view to analytics using BOM data\nfunction trackPageView() {\n  sendBeacon('/analytics', {\n    url: location.href,\n    referrer: document.referrer,\n    lang: navigator.language,\n    viewport: window.innerWidth + 'x' + window.innerHeight,\n  })\n}`,
      explanation: [
        'Auth guards read `location.pathname` to preserve the intended destination across a login redirect.',
        'Analytics payloads are assembled almost entirely from BOM objects: `location`, `navigator`, and `window` dimensions.',
        '`document.referrer` (a DOM/BOM boundary value) records where the user came from.',
        'Every SPA mixes BOM data like this for routing, redirects, and telemetry.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between the BOM and the DOM?',
      answer: 'The DOM (Document Object Model) represents the page content as a tree of nodes, reached via `document`. The BOM (Browser Object Model) is the broader set of browser objects — `window`, `location`, `history`, `navigator`, `screen` — and the DOM is actually one property (`window.document`) of the BOM.',
      explanation: 'The key signal is that `document` lives inside `window`, so the BOM contains the DOM, not the other way around.',
    },
    {
      level: 'beginner',
      question: 'What is the `window` object?',
      answer: 'It is the global object in a browser environment — the root of the BOM and the global scope. Top-level globals become its properties, and `window === globalThis` in browsers.',
      explanation: 'Knowing `window` is both the global object AND the BOM root shows the candidate understands the host model.',
    },
    {
      level: 'intermediate',
      question: 'How do you read query parameters from the URL?',
      answer: 'Use `new URLSearchParams(location.search)` and call `.get(name)`. Avoid manual string splitting, which is error-prone with encoding and repeated keys.',
      explanation: 'Mentioning `URLSearchParams` over manual parsing demonstrates awareness of modern, encoding-safe APIs.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between `window.innerWidth` and `screen.width`?',
      answer: '`window.innerWidth` is the viewport width (the visible content area including scrollbar), while `screen.width` is the physical resolution of the entire monitor, independent of the browser window size.',
      explanation: 'Confusing these breaks responsive logic; viewport size is what matters for layout.',
    },
    {
      level: 'advanced',
      question: 'How does client-side routing avoid full page reloads?',
      answer: 'It uses the History API (`history.pushState`/`replaceState`) to change the URL and add history entries without navigating, then listens for the `popstate` event to re-render when the user uses Back/Forward.',
      explanation: 'Connecting routing to `pushState` + `popstate` shows understanding of how SPA frameworks work under the hood.',
    },
    {
      level: 'senior',
      question: 'Why is cross-frame BOM access restricted, and what governs it?',
      answer: 'Each browsing context (tab/iframe) has its own `window`. The same-origin policy blocks reading another frame\'s `window`/`document` when origins differ; controlled communication is done via `postMessage`. This protects users from one site reading another\'s data.',
      explanation: 'Senior signal: linking the BOM to browsing contexts, the same-origin policy, and `postMessage` as the safe channel.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Is `setTimeout` part of JavaScript or the BOM? (the host/BOM, not ECMAScript)',
    'How do you redirect without leaving a history entry? (`location.replace`)',
    'Why is `navigator.userAgent` unreliable for feature detection?',
    'What is the difference between `history.pushState` and `history.replaceState`?',
    'How would you detect whether the user is offline?',
    'Why can opening popups with `window.open` be blocked by the browser?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Calling the DOM and BOM the same thing.',
      why: 'They are different layers — DOM is page content, BOM is the browser environment that contains the DOM.',
      fix: 'Remember `window.document` is the DOM; the BOM is everything else under `window`.',
    },
    {
      mistake: 'Using `screen.width` for responsive breakpoints.',
      why: '`screen.width` is the monitor resolution, not the resizable browser viewport, so layout logic breaks.',
      fix: 'Use `window.innerWidth` (or, better, CSS media queries / `matchMedia`) for responsive decisions.',
    },
    {
      mistake: 'Sniffing `navigator.userAgent` to decide features.',
      why: 'UA strings are spoofable, inconsistent, and constantly change, leading to brittle branching.',
      fix: 'Detect capabilities directly (`if (\'geolocation\' in navigator)`) instead of parsing the UA.',
    },
    {
      mistake: 'Assuming BOM globals exist everywhere (e.g. in Node/SSR).',
      why: '`window`, `location`, and `document` do not exist on the server; touching them during SSR throws.',
      fix: 'Guard with `typeof window !== \'undefined\'` or run such code only in client lifecycle hooks (`onMounted`).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Router\'s history mode wraps `history.pushState`/`popstate`; components read `location`/route info and must guard BOM access during SSR with client-only hooks like `onMounted`.' },
    { area: 'React', detail: 'React Router similarly builds on the History API; analytics and auth-redirect logic read `location` and `navigator`. SSR (Next.js) requires `typeof window` guards before touching BOM objects.' },
    { area: 'Node.js', detail: 'The BOM does NOT exist server-side; isomorphic code must abstract URL handling (use the WHATWG `URL` class, available in both) and avoid `window`/`location` outside the browser.' },
    { area: 'Backend', detail: 'When generating client redirects or canonical URLs server-side, teams mirror BOM `location` semantics with the `URL` API to keep parsing consistent across environments.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'History API navigation (`pushState`) avoids full reloads, making SPA route changes near-instant.',
      'Reading BOM properties like `location` or `navigator.language` is cheap and synchronous.',
    ],
    bad: [
      'Repeatedly reading layout-dependent BOM/DOM values (`innerWidth`) inside scroll/resize handlers can force synchronous reflow.',
      'Setting `location.href` triggers a full page teardown and reload — expensive compared to client routing.',
    ],
    optimizations: [
      'Debounce or throttle resize/scroll handlers that read `window.innerWidth`.',
      'Cache viewport size and update it only on `resize` rather than reading it every frame.',
      'Prefer `history.pushState`-based routing over `location.href` assignment for in-app navigation.',
      'Use `matchMedia` listeners instead of polling `innerWidth` for breakpoint changes.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Open redirects: blindly using a `?next=` value from `location.search` as a redirect target lets attackers send users to malicious sites.',
      'Cross-frame access and `postMessage` without origin checks can leak data between contexts.',
      'Trusting `document.referrer` or `navigator` data, which can be spoofed or absent.',
    ],
    bestPractices: [
      'Validate and allow-list redirect targets; reject absolute/external URLs from user-controlled `location` params.',
      'Always check `event.origin` in `postMessage` handlers before trusting the data.',
      'Never make security decisions based on UA strings or referrer; enforce auth on the server.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript', 'dom', 'execution-context'],
    nextConcepts: ['history-api', 'event-system', 'storage-apis', 'timers'],
    dependencyNote:
      'The BOM is the environment layer that contains the DOM; understanding it is a prerequisite for the History API (routing), storage APIs, and how host functions like timers and `fetch` differ from core JavaScript.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a big box labeled `window` at the top.',
      'Branch off children: document, location, history, navigator, screen, setTimeout.',
      'Circle `document` and label it "the DOM = page content".',
      'Label everything else "BOM = browser environment".',
      'Say: "window is the global object; the DOM is just one branch of the larger BOM, which is how JS controls the browser itself — URL, history, timers."',
    ],
    diagram: `        window  (global object)
        /   |    |     |      |     \\
  document location history navigator screen setTimeout
     │
   the DOM        \\__________ the BOM __________/
   (page)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The BOM (Browser Object Model) is the set of browser objects JavaScript can use, all hanging off the global `window`: `location` for the URL, `history` for navigation, `navigator` for browser info, `screen` for display size, plus timers and dialogs. The DOM (`document`) is just one branch of the BOM. It powers routing, redirects, analytics, and responsive logic. Key gotcha: BOM globals do not exist during SSR, so guard with `typeof window`.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Browser Object Model is the collection of objects the browser exposes to JavaScript for interacting with the browser environment, as opposed to the page content. It is rooted at the global `window` object — which is also the global scope, so `window === globalThis`. Under `window` you get `location` for reading and changing the URL and triggering navigation, `history` for the session history and the History API, `navigator` for user-agent and capability info, `screen` for the physical display, and host functions like `setTimeout`, `alert`, and `fetch`. Importantly, the DOM — `document` — is itself one property of `window`, so the BOM is the broader environment that contains the DOM. In real apps the BOM is everywhere: SPA routers use `history.pushState` and the `popstate` event to change routes without reloading, auth guards read `location.pathname`, and analytics payloads are built from `location`, `navigator`, and viewport size. Two things to watch: these globals do not exist during server-side rendering, so I guard with `typeof window !== \'undefined\'`; and security-wise I validate any redirect target taken from the URL and check `event.origin` on `postMessage`.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'History API routing gives fast, app-like navigation but requires server config (fallback to index.html) so deep links work on reload.',
      'Reading BOM environment data (UA, language) enables personalization but couples behavior to spoofable, changing values — prefer capability detection.',
    ],
    edgeCases: [
      'Each iframe/popup has its own `window`; cross-origin access is blocked, and `window.opener` can be a security hole if not nulled.',
      '`location.replace` vs `href`: replace does not add a history entry, which matters for back-button behavior.',
      'During SSR/hydration, BOM access must be deferred to client-only lifecycle or it throws / causes mismatch.',
    ],
    runtimeBehavior: [
      'Assigning `location.href` tears down the current JS realm and starts a new navigation; pending async work is abandoned.',
      'The `popstate` event fires only for history traversal, not for `pushState` calls themselves — you render manually after pushing.',
      'Timer functions (`setTimeout`) are host-provided and subject to throttling in background tabs.',
    ],
    scalability: [
      'Centralize BOM access behind a small abstraction so isomorphic/SSR code has one place to stub for the server.',
      'For analytics at scale, prefer `navigator.sendBeacon` so page-unload events reliably flush without blocking navigation.',
    ],
    productionConcerns: [
      'Open-redirect vulnerabilities from unvalidated `location` params are a common audit finding.',
      'SSR crashes from unguarded `window`/`document` access are a frequent regression source.',
      'Background-tab timer throttling can break polling logic that assumed precise intervals.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'BOM = browser environment objects rooted at `window`.',
    '`window === globalThis` in browsers; it is the global object AND BOM root.',
    'DOM (`document`) is ONE branch of the BOM.',
    '`location` = URL read/write + navigation; assigning `.href` reloads.',
    '`location.replace()` navigates WITHOUT adding history.',
    '`history.pushState`/`popstate` = SPA routing without reload.',
    '`navigator` = UA, language, onLine; detect capabilities, do not sniff UA.',
    '`window.innerWidth` = viewport; `screen.width` = monitor.',
    '`setTimeout`/`alert`/`fetch` are host functions, not core JS.',
    'No `window`/`location` in Node/SSR — guard with `typeof window`.',
    'Validate redirect targets from URL params (open-redirect risk).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function `getParam(name)` that returns the value of a query-string parameter from the current URL.',
      hint: 'Use URLSearchParams over location.search.',
      solution: {
        lang: 'js',
        code: `function getParam(name) {\n  const params = new URLSearchParams(location.search)\n  return params.get(name)\n}\n// /page?id=42  ->  getParam('id') === '42'`,
        explanation: [
          '`location.search` is the raw `?...` string.',
          '`URLSearchParams` parses it and `.get` returns the value (or null if missing).',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write `safeRedirect(target)` that only navigates if `target` is a same-origin path, otherwise goes to "/".',
      hint: 'Resolve target against location.origin with the URL API and compare origins.',
      solution: {
        lang: 'js',
        code: `function safeRedirect(target) {\n  try {\n    const url = new URL(target, location.origin)\n    if (url.origin === location.origin) {\n      location.href = url.pathname + url.search\n    } else {\n      location.href = '/'\n    }\n  } catch {\n    location.href = '/'\n  }\n}`,
        explanation: [
          'Resolving with `new URL(target, location.origin)` normalizes relative and absolute inputs.',
          'Comparing `url.origin` to `location.origin` blocks open-redirects to external sites.',
          'Any parse error falls back to a safe default.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a tiny router: `navigate(path)` updates the URL without reload, and Back/Forward re-render. Provide a `render` stub.',
      hint: 'Use history.pushState and listen for popstate.',
      solution: {
        lang: 'js',
        code: `function render(path) {\n  document.getElementById('app').textContent = 'Route: ' + path\n}\n\nfunction navigate(path) {\n  history.pushState({ path }, '', path)\n  render(path)\n}\n\nwindow.addEventListener('popstate', () => render(location.pathname))\n\n// initial render\nrender(location.pathname)`,
        explanation: [
          '`pushState` changes the URL and history without a reload.',
          'We call `render` manually after pushing because `popstate` does NOT fire for our own push.',
          'The `popstate` listener handles Back/Forward by re-rendering from `location.pathname`.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build `onViewportChange(cb)` that calls `cb({width, height})` on resize, throttled to once per animation frame, and returns a cleanup function.',
      hint: 'Use requestAnimationFrame to coalesce, and removeEventListener for cleanup.',
      solution: {
        lang: 'js',
        code: `function onViewportChange(cb) {\n  let scheduled = false\n  function handler() {\n    if (scheduled) return\n    scheduled = true\n    requestAnimationFrame(() => {\n      scheduled = false\n      cb({ width: window.innerWidth, height: window.innerHeight })\n    })\n  }\n  window.addEventListener('resize', handler)\n  return () => window.removeEventListener('resize', handler)\n}`,
        explanation: [
          'Reading `innerWidth`/`innerHeight` gives the live viewport size.',
          'The `scheduled` flag coalesces bursts of resize events into one `requestAnimationFrame` callback, avoiding layout thrash.',
          'Returning a cleanup function (removing the listener) prevents leaks — essential in component lifecycles.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The BOM is foundational vocabulary: it draws the line between the JavaScript language and the browser host. Knowing it lets you reason about routing, redirects, SSR pitfalls, and analytics with confidence.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the straightforward "difference between BOM and DOM" and "what is window". Product companies (Zoho, Flipkart, Razorpay) push into the History API and URL handling. FAANG-level questions probe browsing contexts, same-origin policy, and SSR/isomorphic concerns.',
    whatInterviewersExpect:
      'They expect you to state that `window` is the global object and BOM root, that the DOM is one branch of it, and to name `location`, `history`, and `navigator` with a real use each — ideally connecting `history.pushState` to SPA routing and noting the SSR guard.',
  },
}

export default bom
