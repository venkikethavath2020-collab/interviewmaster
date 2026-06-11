import type { ConceptLesson } from '../../../types/lesson'

const storageApis: ConceptLesson = {
  // 1. Concept Summary
  slug: 'storage-apis',
  name: 'Storage APIs',
  category: 'browser-dom',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Storage APIs let a web app remember things between page loads — preferences, cart contents, draft text — without a server round-trip.',
    'Choosing the wrong store (e.g. putting auth tokens in localStorage) is a real security mistake interviewers probe directly.',
    'localStorage/sessionStorage are synchronous and string-only, while IndexedDB is async and structured — knowing when to use which is a practical engineering decision.',
    'Without understanding storage limits and the same-origin model, you ship apps that silently fail (quota exceeded) or leak data across tabs.',
    'Almost every SPA persists state to storage (theme, tokens, offline cache), so it is a high-frequency, hands-on interview topic.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Storage APIs are different drawers in your desk for keeping notes so you do not forget them tomorrow.',
    story: [
      'Imagine your webpage is forgetful — every time you reload, it forgets everything, like waking up with no memory.',
      'To fix this, the browser gives you little drawers where you can tuck away notes. One drawer (localStorage) keeps your notes even after you close the browser and come back days later.',
      'Another drawer (sessionStorage) only keeps notes until you close that tab — like a sticky note you throw away when you leave the room.',
      'A bigger, fancier cabinet (IndexedDB) can hold lots of organized files, not just simple notes, but you have to wait a moment to open and search it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Browsers can save small pieces of data on the user\'s computer so the page remembers them later.',
    'localStorage saves data with no expiry — it stays until you delete it, even after closing the browser. sessionStorage saves data only for the current tab and is cleared when the tab closes.',
    'Both store only text (strings), so to save an object you turn it into text with `JSON.stringify` and turn it back with `JSON.parse`.',
    'For bigger or more complex data, browsers offer IndexedDB, a small database. Cookies are another, older way that gets automatically sent to the server with each request.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Browser Storage APIs are mechanisms for persisting data on the client, scoped per origin: the Web Storage API (`localStorage` and `sessionStorage`, synchronous key/value string stores), `IndexedDB` (an asynchronous, transactional, structured database), and cookies (small strings auto-attached to HTTP requests).',
    how: 'Web Storage uses `setItem(key, value)`, `getItem(key)`, `removeItem(key)`, and `clear()`; values must be strings, so you `JSON.stringify` objects in and `JSON.parse` out. localStorage persists indefinitely; sessionStorage clears when the tab closes. IndexedDB is accessed via async transactions and object stores.',
    why: 'They let apps remember user state (theme, cart, drafts), cache data for offline use, and avoid unnecessary server requests — each store fitting a different size/lifetime/security need.',
    code: {
      label: 'Saving and reading an object',
      lang: 'js',
      code: `// Save an object (must serialize to a string)\nconst prefs = { theme: 'dark', fontSize: 14 }\nlocalStorage.setItem('prefs', JSON.stringify(prefs))\n\n// Read it back (must parse, and guard against null)\nconst raw = localStorage.getItem('prefs')\nconst loaded = raw ? JSON.parse(raw) : {}\nconsole.log(loaded.theme) // 'dark'\n\n// sessionStorage: same API, but cleared when the tab closes\nsessionStorage.setItem('scrollY', String(window.scrollY))\n\n// remove / clear\nlocalStorage.removeItem('prefs')`,
      explanation: [
        'Web Storage only holds strings, so the object is serialized with `JSON.stringify`.',
        '`getItem` returns `null` if the key is missing — always guard before `JSON.parse`.',
        '`sessionStorage` shares the exact same API but its data dies with the tab.',
        '`removeItem` deletes one key; `clear()` wipes the whole store for that origin.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Client storage in browsers comprises: the Web Storage API (`localStorage`, `sessionStorage`) — synchronous, origin-scoped key/value stores holding UTF-16 strings with a typical ~5–10 MB quota, where localStorage persists across sessions and sessionStorage is scoped to a single tab/session; cookies — small (~4 KB) strings sent automatically with same-site HTTP requests, governed by `Secure`, `HttpOnly`, and `SameSite` attributes; and IndexedDB — an asynchronous, transactional, object-store database supporting structured data and large quotas. All are partitioned by origin under the same-origin policy. Web Storage emits a `storage` event to other same-origin tabs on change.',

  // 7. Internal Working
  internalWorking: [
    'On first access, the browser associates a storage area with the document\'s origin (scheme + host + port); all reads/writes are partitioned to that origin.',
    'Web Storage operations are synchronous and run on the main thread: `setItem` serializes the string to disk-backed storage immediately, which can block on large writes.',
    'Values are coerced to strings; numbers/objects must be serialized, and reading returns either a string or `null`.',
    'When localStorage changes, the browser dispatches a `storage` event to OTHER same-origin tabs/windows (not the originating one), enabling cross-tab sync.',
    'sessionStorage areas are isolated per top-level browsing context (tab); duplicating a tab copies the data, but separate tabs do not share it.',
    'IndexedDB runs asynchronously via request/transaction objects, storing structured clones (not just strings) and supporting indexes; quota is larger and managed by the browser\'s storage manager, which may evict under pressure.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ORIGIN: https://app.example.com
   ┌───────────────────────────────────────────────────────┐
   │ localStorage   key/value strings · ~5-10MB · persists   │
   │ sessionStorage key/value strings · per-TAB · tab-life   │
   │ cookies        ~4KB strings · auto-sent to server       │
   │ IndexedDB      structured DB · large · async/transac.   │
   └───────────────────────────────────────────────────────┘
        │ same-origin policy isolates each origin's data
        ▼
   localStorage change ──► 'storage' event fires in OTHER tabs`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a safe get/set helper',
      lang: 'js',
      code: `const store = {\n  get(key, fallback = null) {\n    const raw = localStorage.getItem(key)\n    if (raw === null) return fallback\n    try { return JSON.parse(raw) } catch { return fallback }\n  },\n  set(key, value) {\n    localStorage.setItem(key, JSON.stringify(value))\n  },\n}\n\nstore.set('user', { id: 1, name: 'Asha' })\nstore.get('user') // { id: 1, name: 'Asha' }`,
      explanation: [
        'Wrapping get/set centralizes the JSON.stringify/parse boilerplate.',
        'The `try/catch` guards against corrupted/non-JSON values (a real production hazard).',
        'A `fallback` avoids returning `null` and crashing downstream code.',
        'This is the typical reusable storage utility shipped in apps.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cross-tab sync with the storage event',
      lang: 'js',
      code: `// Tab A writes; Tab B reacts automatically\nwindow.addEventListener('storage', (e) => {\n  if (e.key === 'theme') {\n    applyTheme(e.newValue) // 'dark' or 'light'\n  }\n})\n\nfunction setTheme(theme) {\n  localStorage.setItem('theme', theme) // fires 'storage' in OTHER tabs\n  applyTheme(theme)                    // apply locally (event won't fire here)\n}`,
      explanation: [
        'The `storage` event fires in OTHER same-origin tabs when localStorage changes.',
        'It does NOT fire in the tab that made the change, so you apply locally yourself.',
        '`e.key`, `e.newValue`, and `e.oldValue` describe what changed.',
        'This gives free cross-tab synchronization (e.g. theme, logout-everywhere).',
      ],
    },
    advanced: {
      label: 'Advanced — handling quota and choosing IndexedDB',
      lang: 'js',
      code: `function safeSet(key, value) {\n  try {\n    localStorage.setItem(key, JSON.stringify(value))\n    return true\n  } catch (err) {\n    // QuotaExceededError when storage is full or in private mode\n    if (err.name === 'QuotaExceededError') {\n      console.warn('Storage full — fall back to IndexedDB or evict')\n      return false\n    }\n    throw err\n  }\n}`,
      explanation: [
        'Web Storage throws `QuotaExceededError` when the ~5–10 MB limit is hit (or in some private modes).',
        'Catching it lets you degrade gracefully instead of crashing.',
        'For large/structured data, IndexedDB (much larger quota, async) is the right tool.',
        'Never assume storage writes succeed — always handle the quota path.',
      ],
    },
    realProject: {
      label: 'Real project — persisting a Pinia/Redux slice (Vue/React)',
      lang: 'js',
      code: `// Vue (Pinia) — hydrate from storage on init, persist on change\nimport { watch } from 'vue'\n\nfunction persistStore(store, key) {\n  // hydrate\n  const saved = localStorage.getItem(key)\n  if (saved) store.$patch(JSON.parse(saved))\n  // persist on every mutation\n  watch(() => store.$state, (state) => {\n    localStorage.setItem(key, JSON.stringify(state))\n  }, { deep: true })\n}`,
      explanation: [
        'On startup the store is hydrated from localStorage so the UI restores instantly.',
        'A deep `watch` re-serializes state on every change — the core of persistence plugins.',
        'React/Redux equivalents subscribe to the store and write to storage similarly.',
        'Crucially, you would NEVER persist sensitive auth tokens this way — only non-sensitive UI/app state.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between localStorage and sessionStorage?',
      answer: 'Both are synchronous string key/value stores scoped per origin. localStorage persists indefinitely across sessions and tabs; sessionStorage is scoped to a single tab and is cleared when that tab closes.',
      explanation: 'Lifetime and tab-scope are the defining differences — name both.',
    },
    {
      level: 'beginner',
      question: 'How do you store an object in localStorage?',
      answer: 'Serialize it with `JSON.stringify` before `setItem`, and parse it with `JSON.parse` after `getItem`, because Web Storage only holds strings.',
      explanation: 'The string-only limitation and JSON round-trip are fundamental.',
    },
    {
      level: 'intermediate',
      question: 'When would you use IndexedDB instead of localStorage?',
      answer: 'When you need to store large amounts of data, structured/queryable data, binary blobs, or do work without blocking the main thread. IndexedDB is asynchronous, transactional, and has a much larger quota, whereas localStorage is synchronous, string-only, and ~5–10 MB.',
      explanation: 'Size, async, and structure are the deciding factors.',
    },
    {
      level: 'intermediate',
      question: 'How can two tabs of the same app stay in sync?',
      answer: 'Listen for the `storage` event on `window`; it fires in other same-origin tabs when localStorage changes, giving you the key, oldValue, and newValue. (BroadcastChannel is an alternative for richer messaging.)',
      explanation: 'Knowing the storage event fires only in OTHER tabs is the key nuance.',
    },
    {
      level: 'advanced',
      question: 'Why is localStorage a poor place to store auth tokens?',
      answer: 'localStorage is readable by any JavaScript on the origin, so an XSS vulnerability lets an attacker steal the token. It also isn\'t sent automatically to the server and can\'t be marked HttpOnly. Prefer HttpOnly, Secure, SameSite cookies for tokens so JS cannot read them.',
      explanation: 'Connecting localStorage exposure to XSS and recommending HttpOnly cookies is exactly what interviewers want.',
    },
    {
      level: 'senior',
      question: 'What are the performance and reliability concerns of Web Storage at scale?',
      answer: 'Web Storage is synchronous and main-thread, so large reads/writes block rendering and input. It can throw QuotaExceededError (also in some private modes) and offers no transactions. For large or frequent writes, use IndexedDB (async, transactional) or batch/throttle writes; never assume a write succeeds.',
      explanation: 'Synchronous blocking, quota handling, and the IndexedDB alternative are senior-level concerns.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why is localStorage synchronous a problem on the main thread?',
    'What is the difference between cookies and localStorage for auth?',
    'How big can localStorage get, and what happens when it is full?',
    'Does the `storage` event fire in the tab that made the change? (no)',
    'What is BroadcastChannel and when is it better than the storage event?',
    'How do you persist data offline reliably — IndexedDB vs Cache API?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Storing objects without serializing.',
      why: 'Web Storage coerces values to strings, so an object becomes the useless "[object Object]".',
      fix: 'Always `JSON.stringify` on write and `JSON.parse` on read (with a try/catch).',
    },
    {
      mistake: 'Putting JWTs or session tokens in localStorage.',
      why: 'Any XSS can read localStorage and exfiltrate the token; it cannot be HttpOnly.',
      fix: 'Store tokens in HttpOnly, Secure, SameSite cookies handled by the server.',
    },
    {
      mistake: 'Calling JSON.parse on getItem without a null/error guard.',
      why: '`getItem` returns null for missing keys and may hold corrupted data, throwing on parse.',
      fix: 'Guard for null and wrap `JSON.parse` in try/catch with a fallback.',
    },
    {
      mistake: 'Assuming localStorage always works (private mode / quota).',
      why: 'Some browsers throw on write in private mode or when the quota is exceeded.',
      fix: 'Feature-detect and wrap writes in try/catch, degrading gracefully (memory fallback or IndexedDB).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia persistence plugins hydrate stores from localStorage on init and write on mutation; theme/locale prefs are kept in localStorage and applied before paint to avoid flashes.' },
    { area: 'React', detail: 'A `useLocalStorage` hook syncs state to localStorage and listens for the `storage` event for cross-tab updates; sensitive data is deliberately excluded.' },
    { area: 'Node.js', detail: 'No Web Storage on the server; isomorphic code must guard storage access (`typeof window`) and rely on cookies (which the server can read) for anything that must reach the backend.' },
    { area: 'Backend', detail: 'Auth flows set HttpOnly Secure cookies server-side rather than trusting client storage; CSRF defenses (SameSite, tokens) pair with cookie-based sessions.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'localStorage reads are fast and synchronous — fine for tiny values like theme/flags read at startup.',
      'Caching server responses in IndexedDB reduces network round-trips and enables offline use.',
    ],
    bad: [
      'Synchronous Web Storage writes block the main thread; large/frequent writes cause jank.',
      'Storing big JSON blobs in localStorage repeatedly re-serializes and risks quota errors.',
    ],
    optimizations: [
      'Throttle/debounce writes (e.g. persist state at most once per few hundred ms).',
      'Use IndexedDB (async) for large or frequent data instead of localStorage.',
      'Store only what you need; keep payloads small and avoid serializing entire app state every keystroke.',
      'Read storage once at startup and keep a runtime copy rather than reading on every access.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'localStorage/sessionStorage are fully readable by any JS on the origin, so XSS can steal anything stored there.',
      'Cookies without `HttpOnly`/`Secure`/`SameSite` are vulnerable to theft and CSRF.',
      'Sensitive PII or tokens in client storage can persist on shared machines.',
    ],
    bestPractices: [
      'Never store auth tokens or secrets in localStorage; use HttpOnly, Secure, SameSite cookies.',
      'Treat all client storage as readable by attackers under XSS; mitigate XSS (CSP, encoding) as the real fix.',
      'Validate and sanitize anything read back from storage before using it (it could be tampered with).',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['json-serialization', 'bom'],
    nextConcepts: ['secure-token-storage', 'service-workers', 'xss', 'csrf'],
    dependencyNote:
      'Storage APIs depend on json-serialization for objects and the bom/origin model; they connect directly to secure-token-storage and the xss/csrf security topics, and to service-workers for offline caching.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw four boxes for one origin: localStorage, sessionStorage, cookies, IndexedDB.',
      'Label localStorage "persists, ~5-10MB, sync, strings" and sessionStorage "per-tab, dies on close".',
      'Label cookies "~4KB, auto-sent to server, HttpOnly possible".',
      'Label IndexedDB "large, async, structured".',
      'Cross out "tokens in localStorage" and write "use HttpOnly cookie".',
      'Say: "Same-origin isolated; pick by size/lifetime/security; serialize objects with JSON; storage event syncs other tabs."',
    ],
    diagram: `  ORIGIN
  ┌──────────────┬──────────────┬──────────┬───────────┐
  │ localStorage │ sessionStg   │ cookies  │ IndexedDB │
  │ persist/sync │ per-tab      │ →server  │ async/big │
  └──────────────┴──────────────┴──────────┴───────────┘
  tokens? → use HttpOnly cookie, NOT localStorage`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Browser storage is origin-scoped. localStorage and sessionStorage are synchronous string key/value stores (~5–10MB); localStorage persists, sessionStorage dies with the tab. Objects need JSON.stringify/parse. The `storage` event syncs other same-origin tabs. Cookies (~4KB) auto-attach to requests and can be HttpOnly. IndexedDB is the async, structured, large-quota database for big data. Key rule: never store auth tokens in localStorage (XSS-readable) — use HttpOnly Secure cookies.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Browsers give you several client-side storage options, all partitioned by origin. The Web Storage API has two stores with the same simple key/value string interface: localStorage, which persists across sessions and tabs until you delete it, and sessionStorage, which is scoped to a single tab and cleared when that tab closes. Both are synchronous and only hold strings, so to store an object I serialize with JSON.stringify and parse it back with JSON.parse, guarding against null and corrupted data. A useful feature is the `storage` event, which fires in other same-origin tabs when localStorage changes, giving cross-tab sync for things like theme or logout-everywhere. Cookies are a separate, older mechanism — small, around 4KB, and automatically sent to the server with requests, which makes them right for authentication, especially with the HttpOnly, Secure, and SameSite attributes. For large or structured data, or to avoid blocking the main thread, I use IndexedDB, which is asynchronous, transactional, and has a much bigger quota. The decision comes down to size, lifetime, and security. The security point I always raise: never store auth tokens in localStorage, because any XSS can read it; tokens belong in HttpOnly cookies the JavaScript can\'t touch. I also handle QuotaExceededError and remember storage may be unavailable in private mode.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'localStorage is trivially simple but synchronous and string-only; IndexedDB is powerful but verbose and async — wrap it (e.g. idb) to be usable.',
      'Cookies reach the server automatically (good for auth) but add weight to every request and need careful SameSite/CSRF handling.',
    ],
    edgeCases: [
      'The `storage` event does NOT fire in the originating tab — apply changes locally too.',
      'Private/incognito modes may throw on write or wipe data on close.',
      'sessionStorage is copied when a tab is duplicated but not shared between independent tabs.',
      'Browsers may evict IndexedDB/Cache under storage pressure unless the origin is persistent.',
    ],
    runtimeBehavior: [
      'Web Storage writes are synchronous and disk-backed, blocking the main thread proportional to payload size.',
      'IndexedDB transactions auto-commit when the microtask queue drains; holding a transaction open across awaits can abort it.',
      'Quota is shared across an origin\'s storage buckets and managed by the browser.',
    ],
    scalability: [
      'For frequent state persistence, debounce writes and avoid serializing entire app state on every change.',
      'Use IndexedDB or the Cache API for large offline datasets; localStorage does not scale past a few MB.',
    ],
    productionConcerns: [
      'XSS turning localStorage tokens into account takeover is a recurring security incident — keep tokens in HttpOnly cookies.',
      'Schema migrations: data written by an old app version may not match new code — version and validate stored data.',
      'SSR crashes from unguarded `localStorage` access during render — guard with `typeof window`.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'All client storage is ORIGIN-scoped (same-origin policy).',
    'localStorage = persistent, sessionStorage = per-tab; both sync, strings, ~5-10MB.',
    'Objects need `JSON.stringify`/`JSON.parse` (guard null + try/catch).',
    '`storage` event fires in OTHER same-origin tabs (not the writer).',
    'Cookies ~4KB, auto-sent to server, support HttpOnly/Secure/SameSite.',
    'IndexedDB = async, transactional, structured, large quota.',
    'NEVER put auth tokens in localStorage (XSS-readable) → HttpOnly cookie.',
    'Handle QuotaExceededError; storage may fail in private mode.',
    'Web Storage is synchronous → debounce large/frequent writes.',
    'Guard storage access during SSR (`typeof window`).',
    'BroadcastChannel for richer cross-tab messaging beyond storage event.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write `saveUser(user)` and `loadUser()` using localStorage, returning null if nothing is stored.',
      hint: 'Serialize on save, guard null on load.',
      solution: {
        lang: 'js',
        code: `function saveUser(user) {\n  localStorage.setItem('user', JSON.stringify(user))\n}\nfunction loadUser() {\n  const raw = localStorage.getItem('user')\n  return raw ? JSON.parse(raw) : null\n}`,
        explanation: [
          'The object is serialized to a string on save.',
          '`getItem` returns null when absent, so we guard before parsing.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Sync a "theme" value across tabs: write a setter and a listener that applies the theme when another tab changes it.',
      hint: 'Use the storage event; remember it does not fire in the writing tab.',
      solution: {
        lang: 'js',
        code: `function setTheme(theme) {\n  localStorage.setItem('theme', theme)\n  document.documentElement.dataset.theme = theme // apply locally\n}\nwindow.addEventListener('storage', (e) => {\n  if (e.key === 'theme' && e.newValue) {\n    document.documentElement.dataset.theme = e.newValue\n  }\n})`,
        explanation: [
          'Writing to localStorage fires `storage` in OTHER tabs.',
          'We apply locally in the writer because the event won\'t fire there.',
          '`e.newValue` carries the updated theme for the listening tabs.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement `safeSet(key, value)` that returns true on success and false on QuotaExceededError, rethrowing other errors.',
      hint: 'Inspect err.name.',
      solution: {
        lang: 'js',
        code: `function safeSet(key, value) {\n  try {\n    localStorage.setItem(key, JSON.stringify(value))\n    return true\n  } catch (err) {\n    if (err.name === 'QuotaExceededError') return false\n    throw err\n  }\n}`,
        explanation: [
          'Writes can throw when the quota is exceeded (or in private mode).',
          'We return false only for quota errors so callers can degrade gracefully.',
          'Other errors are rethrown so real bugs are not swallowed.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a tiny `createStore(key)` returning `{ get, set, remove }` that caches an in-memory copy and debounces writes to localStorage by 300ms.',
      hint: 'Keep a runtime value, use a timer for the write.',
      solution: {
        lang: 'js',
        code: `function createStore(key) {\n  let value\n  const raw = localStorage.getItem(key)\n  try { value = raw ? JSON.parse(raw) : null } catch { value = null }\n  let timer = null\n  function flush() { localStorage.setItem(key, JSON.stringify(value)) }\n  return {\n    get() { return value },\n    set(v) {\n      value = v\n      clearTimeout(timer)\n      timer = setTimeout(flush, 300)\n    },\n    remove() {\n      value = null\n      clearTimeout(timer)\n      localStorage.removeItem(key)\n    },\n  }\n}`,
        explanation: [
          'On creation it hydrates the in-memory `value` from storage once (avoiding repeated reads).',
          '`set` updates the runtime copy immediately but debounces the expensive synchronous write by 300ms.',
          'Debouncing prevents main-thread jank when state changes rapidly (e.g. typing).',
          '`remove` clears both the memory copy and the persisted key.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Storage decisions touch performance, offline behavior, and security in every web app. Getting the localStorage-vs-cookie-vs-IndexedDB choice right — especially for tokens — separates careful engineers from those who copy-paste.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "difference between localStorage and sessionStorage" and "how to store an object". Product companies (Zoho, Flipkart, Razorpay) ask when to use IndexedDB and how to persist app state with cross-tab sync. FAANG-level interviews probe the synchronous main-thread cost, quota handling, and the security model around tokens.',
    whatInterviewersExpect:
      'They expect the lifetime/scope distinctions, the JSON serialization requirement, awareness of the `storage` event for cross-tab sync, and — most importantly — the security stance that tokens go in HttpOnly cookies, not localStorage.',
  },
}

export default storageApis
