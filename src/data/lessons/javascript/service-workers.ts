import type { ConceptLesson } from '../../../types/lesson'

const serviceWorkers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'service-workers',
  name: 'Service Workers',
  category: 'browser-dom',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'A service worker is a programmable network proxy that sits between your app and the network — it is what makes Progressive Web Apps, offline support, and reliable caching possible.',
    'Without it, your app dies the moment the network does; with it you can serve a cached shell instantly, queue failed requests, and update assets in the background.',
    'It powers push notifications and background sync — capabilities that used to require a native app.',
    'Interviewers ask it to test whether you understand the browser beyond the main thread: a separate, event-driven, persistent worker with its own lifecycle and no DOM access.',
    'It is also a foot-gun: a bad service worker can cache the wrong thing forever and "brick" a site for returning users — understanding the lifecycle is how you avoid shipping that incident.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A service worker is a helpful librarian who stands between you and the bookshelf, keeping copies of your favorite books so you can read even when the library is closed.',
    story: [
      'Imagine every time you want a book, you have to ask a librarian, who walks to a faraway warehouse to fetch it. If the road is closed, you get nothing.',
      'Now imagine a clever librarian who keeps copies of the books you read most on a shelf right next to the desk.',
      'When you ask for a book, the librarian can hand you the nearby copy instantly — even if the road to the warehouse is closed (the internet is down).',
      'The librarian can also quietly fetch newer editions in the background and swap them in later. A service worker is that librarian: it intercepts your app’s requests and decides whether to answer from its own shelf (cache) or go to the network.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A service worker is a small script the browser runs in the background, separate from the web page, even when the page is closed.',
    'It can listen for the page’s network requests and decide to answer them from a saved cache instead of the internet, which is how apps work offline.',
    'It cannot touch the page directly (no DOM); it talks to pages through messages and works only over HTTPS for safety.',
    'It has a strict lifecycle — install, then activate, then control pages — and a new version waits until old pages close, so updates do not break a running app.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A service worker is a JavaScript file the browser runs on a separate thread as an event-driven network proxy for a given scope (origin/path). It intercepts fetch events from controlled pages and can respond from a Cache Storage cache, enabling offline support, custom caching strategies, push notifications, and background sync.',
    how: 'You register it from the page (navigator.serviceWorker.register). The browser downloads it, fires install (where you pre-cache assets), then activate (where you clean old caches), then it controls pages and receives their fetch events, where you call event.respondWith(...) to serve cached or network responses.',
    why: 'It decouples your app from network availability and latency: instant loads from cache, working offline, and background capabilities — the foundation of PWAs.',
    code: {
      label: 'Register + cache-first fetch',
      lang: 'js',
      code: `// in the page\nif ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js')\n}\n\n// sw.js\nself.addEventListener('install', (e) => {\n  e.waitUntil(\n    caches.open('v1').then((c) => c.addAll(['/', '/app.js', '/styles.css']))\n  )\n})\nself.addEventListener('fetch', (e) => {\n  e.respondWith(\n    caches.match(e.request).then((hit) => hit || fetch(e.request))\n  )\n})`,
      explanation: [
        'register("/sw.js") tells the browser to install a service worker scoped to the path of sw.js.',
        'The install event pre-caches the app shell; waitUntil keeps the worker alive until the caching promise resolves.',
        'The fetch event intercepts every request from controlled pages.',
        'respondWith lets us answer the request ourselves: try the cache first, fall back to the network — that is the "cache-first" strategy and the basis of offline support.',
        'It only runs over HTTPS (and localhost), and cannot access the DOM directly.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A service worker is an event-driven Web Worker registered against a scope that acts as a programmable network proxy between web pages and the network/cache. It runs on its own thread without DOM access, is terminated when idle and revived on events, and progresses through a lifecycle (download, install, waiting/activate, controlling). It intercepts navigation and resource fetch events via event.respondWith, persists responses in Cache Storage, and exposes background capabilities (Push, Background Sync). It requires a secure context (HTTPS), uses promises throughout (waitUntil/respondWith), and updates via byte-comparison of the worker script with a controlled activation handover.',

  // 7. Internal Working
  internalWorking: [
    'Registration: the page calls navigator.serviceWorker.register(url, { scope }); the browser fetches the script and creates a registration scoped to that path (a worker can only control pages within its scope).',
    'Install: the new worker runs its install handler. event.waitUntil(promise) delays moving on until pre-caching completes; if it rejects, installation fails and the worker is discarded.',
    'Waiting: if an existing worker still controls open pages, the new worker enters the waiting state and does NOT activate until those pages close (unless skipWaiting() is called) — this prevents version mismatch mid-session.',
    'Activate: once it takes over, the activate handler runs, typically deleting stale caches; clients.claim() lets it immediately control existing pages instead of waiting for a reload.',
    'Running/idle: the worker is event-driven and gets terminated when idle to save resources, then re-spun on the next event (fetch/push/sync) — so it must keep no in-memory state between events.',
    'Fetch interception: for controlled pages, every request fires a fetch event; respondWith returns a Response (from Cache Storage, the network, or generated), implementing strategies like cache-first, network-first, or stale-while-revalidate.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        PAGE (main thread, has DOM)
            │  fetch('/api/x')
            ▼
   ┌────────────────────────────────┐
   │   SERVICE WORKER (own thread)   │  ← network proxy, no DOM
   │   fetch event → respondWith()   │
   │      │                 │        │
   │   CACHE STORAGE     NETWORK     │
   │   (offline copy)    (fresh)     │
   └────────────────────────────────┘

   LIFECYCLE:
   register → install (pre-cache) → [waiting] → activate (clean caches) → control
                                       ▲ waits until old pages close (unless skipWaiting)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The worker is terminated when idle, so any module-level variables are NOT durable — never store app state in the worker’s heap between events; persist to Cache Storage or IndexedDB.',
    'Cache Storage lives on disk (Cache API), not in the JS heap, and persists across sessions until you delete it — old caches you forget to clear accumulate on the user’s device.',
    'Messages between page and worker are structured-cloned (copied), not shared references; large transfers cost serialization unless you use transferable objects.',
    'A controlled page and its worker are separate execution contexts with separate heaps; the proxy boundary is the request, not shared memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — register with feature detection',
      lang: 'js',
      code: `if ('serviceWorker' in navigator) {\n  window.addEventListener('load', async () => {\n    try {\n      const reg = await navigator.serviceWorker.register('/sw.js')\n      console.log('SW scope:', reg.scope)\n    } catch (err) {\n      console.error('SW registration failed', err)\n    }\n  })\n}`,
      explanation: [
        'Feature-detect with "serviceWorker" in navigator so unsupported browsers degrade gracefully.',
        'Registering on window load avoids competing with critical first-paint requests.',
        'reg.scope shows which paths the worker controls (defaults to the directory of sw.js).',
        'Registration is progressive enhancement: the app still works without it, just without offline.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cache cleanup on activate + versioning',
      lang: 'js',
      code: `const CACHE = 'app-v3'\nself.addEventListener('install', (e) => {\n  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['/', '/main.js'])))\n})\nself.addEventListener('activate', (e) => {\n  e.waitUntil(\n    caches.keys().then((keys) =>\n      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))\n    ).then(() => self.clients.claim())\n  )\n})`,
      explanation: [
        'Bumping the cache name (app-v3) is how you ship a new asset set — old caches become stale.',
        'On activate we delete every cache except the current version, reclaiming disk and preventing serving old files.',
        'clients.claim() lets the new worker control already-open pages immediately, without a reload.',
        'This activate-time cleanup is essential: without it, stale caches pile up and you can serve outdated assets forever.',
      ],
    },
    advanced: {
      label: 'Advanced — stale-while-revalidate strategy',
      lang: 'js',
      code: `self.addEventListener('fetch', (e) => {\n  if (e.request.method !== 'GET') return // never cache mutations\n  e.respondWith(\n    caches.open('swr').then(async (cache) => {\n      const cached = await cache.match(e.request)\n      const network = fetch(e.request).then((res) => {\n        cache.put(e.request, res.clone()) // update cache in background\n        return res\n      }).catch(() => cached)\n      return cached || network // serve cache fast, refresh behind the scenes\n    })\n  )\n})`,
      explanation: [
        'Stale-while-revalidate: respond instantly from cache, then fetch a fresh copy and update the cache for next time.',
        'res.clone() is required because a Response body is a one-shot stream — you read it once for the page, once for the cache.',
        'We skip non-GET requests so we never cache POST/PUT (mutations must hit the network).',
        'If the network fails, we fall back to the cached copy, keeping the app usable offline.',
        'This balances speed (cache-first) with freshness (background update) and powers many PWA shells.',
      ],
    },
    realProject: {
      label: 'Real project — Workbox-style precache + runtime caching (Vue PWA)',
      lang: 'js',
      code: `// Typical generated sw.js (Vite PWA / Workbox)\nimport { precacheAndRoute } from 'workbox-precaching'\nimport { registerRoute } from 'workbox-routing'\nimport { NetworkFirst, CacheFirst } from 'workbox-strategies'\n\n// app shell precached at build time (hashed filenames)\nprecacheAndRoute(self.__WB_MANIFEST)\n\n// API: prefer network, fall back to cache when offline\nregisterRoute(({ url }) => url.pathname.startsWith('/api/'),\n  new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 3 }))\n\n// images: cache-first (rarely change)\nregisterRoute(({ request }) => request.destination === 'image',\n  new CacheFirst({ cacheName: 'images' }))`,
      explanation: [
        'In real apps you rarely hand-write fetch handlers — Vite PWA / Workbox generate the worker.',
        'precacheAndRoute caches the hashed build assets so the app shell loads instantly and works offline.',
        'NetworkFirst for /api keeps data fresh but falls back to cache when offline, with a timeout to avoid hanging.',
        'CacheFirst for images serves them from disk since they rarely change, saving bandwidth.',
        'Hashed filenames make cache invalidation automatic: a new build = new filenames = new precache entries.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a service worker and what is it for?',
      answer: 'A background script that acts as a network proxy between your web app and the network. It can intercept requests and serve them from a cache, enabling offline support, fast repeat loads, push notifications, and background sync — the foundation of PWAs.',
      explanation: 'The signal is "programmable network proxy" + "offline/caching/PWA" — not just "background script".',
    },
    {
      level: 'beginner',
      question: 'Why does a service worker require HTTPS and have no DOM access?',
      answer: 'Because it can intercept and rewrite every network request, it is a powerful man-in-the-middle, so it is restricted to secure contexts (HTTPS or localhost) to prevent tampering. It runs on its own thread with no DOM access; it communicates with pages via postMessage.',
      explanation: 'Tests awareness of the security model and the worker-thread isolation.',
    },
    {
      level: 'intermediate',
      question: 'Explain the service worker lifecycle.',
      answer: 'register → install (pre-cache assets via waitUntil) → waiting (if an old worker still controls open pages) → activate (clean old caches) → controlling pages (handling fetch events). A new worker waits until old pages close unless you call skipWaiting; clients.claim lets it control existing pages immediately.',
      explanation: 'The waiting state and skipWaiting/clients.claim are the discriminators — they show you understand safe updates.',
    },
    {
      level: 'intermediate',
      question: 'Compare cache-first, network-first, and stale-while-revalidate.',
      answer: 'Cache-first serves from cache, falling back to network (fast, may be stale — good for static assets). Network-first tries network, falls back to cache (fresh, slower — good for API data). Stale-while-revalidate serves cache instantly then updates it in the background (fast + eventually fresh — good for app shells).',
      explanation: 'Knowing which strategy fits which resource type (assets vs API vs shell) shows applied understanding.',
    },
    {
      level: 'advanced',
      question: 'How can a service worker "brick" a site, and how do you avoid it?',
      answer: 'If it caches the HTML/app shell with a cache-first strategy and you later ship a broken or permanently-stale worker, returning users keep getting the old/broken cached version. Avoid it with cache versioning + activate-time cleanup, network-first or revalidation for navigations, a kill-switch (unregister) path, and careful skipWaiting usage.',
      explanation: 'Senior signal: awareness of the most feared SW failure mode and concrete mitigations (versioning, kill-switch, network-first navigations).',
    },
    {
      level: 'senior',
      question: 'Why must a service worker keep no in-memory state between events?',
      answer: 'Because the browser terminates idle workers to save resources and revives them on the next event, so module-level variables are not durable. Any state must be persisted to Cache Storage or IndexedDB. This also means handlers must be stateless and use waitUntil to keep the worker alive long enough to finish async work.',
      explanation: 'Understanding the ephemeral, event-driven execution model — and waitUntil keeping the worker alive — is a senior-level detail.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does event.waitUntil do and why is it needed? (keeps the worker alive until the promise settles)',
    'What is the difference between skipWaiting and clients.claim?',
    'Why must you clone() a Response before caching it?',
    'How does scope determine which pages a worker controls?',
    'How do Background Sync and Push fit into the service worker model?',
    'How do you safely update or remove a deployed service worker?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Cache-first caching of the HTML/navigation requests without a freshness strategy.',
      why: 'Returning users get a permanently stale (or broken) shell — the classic "site is bricked" incident.',
      fix: 'Use network-first or stale-while-revalidate for navigations, version caches, and provide an unregister kill-switch.',
    },
    {
      mistake: 'Storing state in module-level variables in the worker.',
      why: 'The browser terminates idle workers; that state vanishes and the next event starts fresh.',
      fix: 'Persist to Cache Storage / IndexedDB; treat every handler as stateless.',
    },
    {
      mistake: 'Forgetting event.waitUntil / respondWith returns a promise.',
      why: 'Without waitUntil the worker may be killed before async caching finishes; without respondWith the request goes to the network untouched.',
      fix: 'Wrap async install/activate work in waitUntil and always pass a Response (or promise of one) to respondWith.',
    },
    {
      mistake: 'Not cleaning up old caches on activate.',
      why: 'Stale caches accumulate on the user’s disk and old assets may still be served.',
      fix: 'In activate, list caches.keys() and delete everything except the current version.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'vite-plugin-pwa generates a Workbox service worker that precaches the hashed build, runtime-caches API/images, and exposes an updateSW() prompt so users can refresh to the new version safely.' },
    { area: 'React', detail: 'Create React App / Workbox or Next.js PWA setups register a worker for offline shells and asset caching; the update flow shows a "new version available" toast tied to the waiting worker.' },
    { area: 'Node.js', detail: 'The server emits a build manifest of hashed assets that the worker precaches, and sets correct Cache-Control/HTTPS; push notifications use a Node web-push server sending to the worker’s push subscription.' },
    { area: 'Backend', detail: 'Background Sync queues failed mutations (e.g. form submits) in the worker and retries when connectivity returns; push subscriptions are stored server-side to deliver notifications.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Instant repeat loads: the app shell and assets come from Cache Storage instead of the network.',
      'Resilience to flaky/offline networks reduces failed requests and perceived latency.',
      'Background update/sync moves work off the critical path so the user is never blocked.',
    ],
    bad: [
      'A heavy install (pre-caching too much) delays first useful interaction and wastes the user’s storage.',
      'Worker startup latency: a terminated worker must boot before handling the first fetch, adding small delay.',
      'Wrong strategy (cache-first on dynamic data) serves stale content, a correctness/perceived-quality cost.',
    ],
    optimizations: [
      'Precache only the critical shell; runtime-cache the rest on demand.',
      'Pick the strategy per resource: cache-first for static hashed assets, network-first/SWR for data.',
      'Version caches and prune on activate to keep storage bounded.',
      'Use navigation preload to fetch in parallel with worker startup, hiding boot latency.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A compromised or malicious service worker can intercept and rewrite every request on its scope — a powerful persistent attack surface, which is why HTTPS is mandatory.',
      'Caching responses that contain sensitive/authenticated data can leak it to other users on a shared device.',
      'An over-broad scope lets the worker control more of the origin than intended.',
    ],
    bestPractices: [
      'Serve the worker and app over HTTPS only; never cache authenticated/personalized responses without care.',
      'Scope the worker tightly and never cache sensitive API responses; bypass the cache for auth flows.',
      'Validate the worker source (it must be same-origin), keep it minimal, and provide an unregister/kill-switch in case you must revoke it.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['web-workers', 'fetch-api', 'promises', 'async-await', 'event-system'],
    nextConcepts: ['websocket-sse', 'code-splitting-lazy-loading', 'storage-apis', 'core-web-vitals'],
    dependencyNote:
      'Service workers are a specialized Web Worker, so understand workers and the async/promise model (waitUntil/respondWith) first. They build on the Fetch API and pair with storage APIs (Cache Storage/IndexedDB); together they underpin PWAs and improve Core Web Vitals through fast repeat loads.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the page (with DOM) on top, the network at the bottom, and the service worker in between as a proxy.',
      'Draw a fetch arrow from page into the worker, then two outputs: Cache Storage and Network.',
      'Say: "It intercepts requests and decides cache vs network — that is offline support."',
      'Below, draw the lifecycle arrow: register → install → [waiting] → activate → control.',
      'Annotate install = pre-cache, activate = clean old caches, waiting = until old pages close.',
      'End with the warning: cache-first on HTML can brick the site → version caches + kill-switch.',
    ],
    diagram: `   PAGE (DOM)
     │ fetch
     ▼
   [ SERVICE WORKER ]  no DOM, own thread
     │            │
   CACHE       NETWORK
   (offline)   (fresh)

   register → install(pre-cache) → waiting → activate(clean) → control`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A service worker is a background, event-driven script that acts as a programmable network proxy between your app and the network. It intercepts fetch events and serves from Cache Storage, enabling offline support, fast repeat loads, push, and background sync — the core of PWAs. It has no DOM access, requires HTTPS, and follows a lifecycle: install (pre-cache), waiting (until old pages close), activate (clean old caches), then control. It is terminated when idle so it keeps no in-memory state. Pick caching strategies per resource, and version caches to avoid bricking the site.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A service worker is a script the browser runs in the background on its own thread, acting as a programmable network proxy between my pages and the network. Because it can intercept every request and respond from a cache, it is what makes Progressive Web Apps possible: offline support, instant repeat loads, push notifications, and background sync. It has no DOM access, communicates with pages via postMessage, and requires HTTPS because it is effectively a man-in-the-middle. The lifecycle is the part interviewers care about: I register it from the page, then it installs — where I pre-cache the app shell using event.waitUntil to keep the worker alive until caching finishes. If an old worker still controls open tabs, the new one waits, which prevents a version mismatch mid-session; skipWaiting and clients.claim override that when I want an immediate takeover. On activate I delete stale caches. The worker is terminated when idle and revived per event, so I never keep state in memory — I persist to Cache Storage or IndexedDB. For fetch handling I choose a strategy per resource: cache-first for hashed static assets, network-first or stale-while-revalidate for API data and navigations. The biggest danger is caching the HTML cache-first and shipping a stale or broken worker, which can brick the site for returning users — so I version caches, clean them on activate, prefer network-first for navigations, and keep an unregister kill-switch.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Cache-first (fast, riskier staleness) vs network-first (fresh, slower) vs stale-while-revalidate (fast + eventually fresh, complexity) — chosen per resource type.',
      'skipWaiting for instant updates vs waiting for safe handover: instant updates risk new worker controlling pages built for the old assets.',
      'Precaching everything (offline-complete, big install/storage) vs runtime caching (lean install, first miss hits network).',
    ],
    edgeCases: [
      'Idle termination wipes in-memory state — handlers must be stateless and use waitUntil.',
      'Response bodies are one-shot streams; failing to clone() before caching consumes the body for the page.',
      'Scope is path-based; a worker at /app/sw.js cannot control /; the Service-Worker-Allowed header can widen scope.',
      'The browser refuses to update a worker whose script is byte-identical; a stale-but-different worker can persist if update checks are misconfigured.',
    ],
    runtimeBehavior: [
      'Workers boot lazily on events, adding cold-start latency to the first intercepted request — navigation preload mitigates it.',
      'Updates are detected by byte-comparing the fetched worker script; HTTP caching of sw.js itself can dangerously delay updates (serve it no-cache).',
      'postMessage payloads are structured-cloned; use transferables for large buffers.',
    ],
    scalability: [
      'Cache Storage is per-origin and disk-backed; unbounded or unversioned caches consume user storage and risk eviction under quota pressure.',
      'Background Sync batches and retries deferred work, smoothing load spikes from many reconnecting clients.',
      'Push at scale requires a server-side subscription store and respect for browser push-service rate limits.',
    ],
    productionConcerns: [
      'A bad worker is sticky — design a kill-switch (an empty/unregistering worker) and serve sw.js with no-cache so fixes propagate.',
      'Cache versioning and activate-time pruning are mandatory to avoid serving stale assets and to bound storage.',
      'Observability is hard: log version, install/activate outcomes, and cache hit rates; test update flows explicitly because the waiting state surprises teams.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Service worker = background, event-driven network proxy; no DOM; HTTPS only.',
    'Lifecycle: register → install → [waiting] → activate → control.',
    'install = pre-cache (waitUntil); activate = clean old caches; fetch = respondWith.',
    'Terminated when idle → keep NO in-memory state (use Cache Storage/IndexedDB).',
    'Strategies: cache-first (assets), network-first (API), stale-while-revalidate (shell).',
    'Must clone() a Response before caching (body is one-shot).',
    'skipWaiting = activate now; clients.claim = control open pages now.',
    'Scope is path-based; worker controls only pages under its path.',
    'Version caches + prune on activate to avoid stale/bloated storage.',
    'Cache-first HTML can brick the site → network-first navigations + kill-switch.',
    'Serve sw.js with no-cache so updates propagate.',
    'Powers PWAs: offline, push, background sync.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Register a service worker /sw.js only in supporting browsers, and log its scope on success.',
      hint: 'Feature-detect "serviceWorker" in navigator and await register().',
      solution: {
        lang: 'js',
        code: `if ('serviceWorker' in navigator) {\n  navigator.serviceWorker.register('/sw.js')\n    .then((reg) => console.log('controlled scope:', reg.scope))\n    .catch((e) => console.error('SW failed', e))\n}`,
        explanation: [
          'Feature detection lets unsupported browsers skip silently (progressive enhancement).',
          'register returns a promise resolving to the registration, whose scope shows controlled paths.',
          'Catching the error avoids an unhandled rejection if registration fails (e.g. non-HTTPS).',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write an install handler that pre-caches "/" and "/app.js" into a versioned cache.',
      hint: 'Open caches.open(name), addAll the URLs, and keep the worker alive with waitUntil.',
      solution: {
        lang: 'js',
        code: `const CACHE = 'shell-v1'\nself.addEventListener('install', (e) => {\n  e.waitUntil(\n    caches.open(CACHE).then((cache) => cache.addAll(['/', '/app.js']))\n  )\n})`,
        explanation: [
          'caches.open(CACHE) gets (or creates) a named cache; the name encodes the version.',
          'addAll fetches and stores all URLs atomically — if one fails, install fails.',
          'waitUntil keeps the worker alive until caching resolves, so it is not killed mid-install.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a network-first fetch handler for /api/* that falls back to cache when offline, and updates the cache on success.',
      hint: 'Try fetch first; on success clone+put into cache; on failure return caches.match.',
      solution: {
        lang: 'js',
        code: `self.addEventListener('fetch', (e) => {\n  const url = new URL(e.request.url)\n  if (!url.pathname.startsWith('/api/') || e.request.method !== 'GET') return\n  e.respondWith(\n    fetch(e.request)\n      .then((res) => {\n        const copy = res.clone()\n        caches.open('api').then((c) => c.put(e.request, copy))\n        return res\n      })\n      .catch(() => caches.match(e.request))\n  )\n})`,
        explanation: [
          'Network-first: we try the network so data is fresh, only falling back to cache when it fails (offline).',
          'res.clone() lets us both return the response to the page AND store a copy in the cache.',
          'We restrict to GET /api so we never cache mutations or non-API requests.',
          'On network failure, caches.match serves the last-known-good response, keeping the app usable offline.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a safe update flow: activate cleans old caches, claims clients, and the page is told a new version is ready so it can prompt the user to reload.',
      hint: 'In activate delete non-current caches + clients.claim(); postMessage from worker to page, or detect the waiting worker from the page.',
      solution: {
        lang: 'js',
        code: `// sw.js\nconst CACHE = 'app-v4'\nself.addEventListener('activate', (e) => {\n  e.waitUntil((async () => {\n    const keys = await caches.keys()\n    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))\n    await self.clients.claim()\n  })())\n})\n\n// page: detect a waiting worker and prompt reload\nnavigator.serviceWorker.register('/sw.js').then((reg) => {\n  reg.addEventListener('updatefound', () => {\n    const sw = reg.installing\n    sw.addEventListener('statechange', () => {\n      if (sw.state === 'installed' && navigator.serviceWorker.controller) {\n        showReloadToast(() => sw.postMessage('SKIP_WAITING'))\n      }\n    })\n  })\n})`,
        explanation: [
          'On activate the worker prunes stale caches and claims open pages so the new version takes effect.',
          'updatefound + statechange let the PAGE detect a newly installed (waiting) worker.',
          'Instead of silently skipping waiting, we prompt the user; on accept we message the worker to skipWaiting and reload.',
          'This avoids the "bricked site" trap: updates are explicit, controlled, and never serve mismatched old/new assets mid-session.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Service workers are how the web competes with native apps — offline, installable, push-enabled. Understanding their lifecycle and caching strategies marks you as someone who can ship reliable PWAs and, crucially, avoid the infamous cache-bricking incident.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is a service worker / what is a PWA" at a conceptual level. Product companies (Zoho, Flipkart, Razorpay) ask about caching strategies and the update/lifecycle flow. FAANG-level interviews probe the ephemeral execution model, safe updates, the bricking failure mode, and scaling push/background sync.',
    whatInterviewersExpect:
      'They expect you to describe the proxy role, the install/waiting/activate/control lifecycle, why it needs HTTPS and has no DOM, the main caching strategies and when to use each, and the production danger of caching navigations cache-first plus the mitigations (versioning, network-first, kill-switch).',
  },
}

export default serviceWorkers
