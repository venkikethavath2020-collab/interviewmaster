import type { ConceptLesson } from '../../../types/lesson'

const secureTokenStorage: ConceptLesson = {
  // 1. Concept Summary
  slug: 'secure-token-storage',
  name: 'Token Storage',
  category: 'security',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Where you store an auth token decides your whole client-side threat model — get it wrong and a single XSS can hand attackers full account access.',
    'It is the crux of the classic "localStorage vs cookies" debate every frontend interview eventually reaches.',
    'The right choice balances two opposing risks: XSS (token theft from JS-readable storage) versus CSRF (cookies sent automatically).',
    'Token lifetime and refresh strategy directly affect both security (blast radius of a leak) and UX (how often users get logged out).',
    'Senior engineers are expected to articulate the httpOnly + refresh-token-rotation pattern and why "store the access token in memory" is increasingly the answer.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A token is like a wristband at a theme park — where you keep it decides who can steal it.',
    story: [
      'When you enter a park you get a wristband that proves you paid, and you show it to ride the rides.',
      'If you keep it loosely in your open pocket, a pickpocket can grab it and pretend to be you all day.',
      'If you keep it locked in a special box that only the ride operator can open, a thief in the crowd cannot reach it.',
      'A login token works the same way: if you keep it somewhere any script on the page can read, a sneaky script can steal it; if you keep it in a special locked box (an httpOnly cookie or in memory), it is much harder to steal.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'After you log in, the server gives your browser a token that proves who you are, so you do not have to type your password on every page.',
    'The browser needs to keep that token somewhere — common places are localStorage, sessionStorage, a normal cookie, or just a JavaScript variable in memory.',
    'Each place has a tradeoff: places JavaScript can read are vulnerable if a malicious script gets in (XSS); cookies are sent automatically so they can be tricked into use (CSRF).',
    'The safest common pattern is to keep the token where page scripts cannot read it (an httpOnly cookie) or in memory only, and to keep tokens short-lived so a stolen one expires quickly.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Token storage is the strategy for persisting and transmitting an authentication credential (e.g. a JWT or session token) in the browser, choosing among localStorage, sessionStorage, cookies (ideally httpOnly), or in-memory variables.',
    how: 'On login the server returns a token. The client either stores it (localStorage/cookie) and attaches it to requests, or the server sets an httpOnly cookie the browser sends automatically. The choice determines what attacks can reach the token.',
    why: 'Every storage location trades off against a different attack. JS-readable storage is exposed to XSS; auto-sent cookies are exposed to CSRF. Understanding the tradeoffs lets you pick the combination that minimizes blast radius for your app.',
    code: {
      label: 'In-memory access token + httpOnly refresh cookie',
      lang: 'js',
      code: `let accessToken = null // in memory only — gone on refresh, unreadable by other tabs\n\nasync function login(credentials) {\n  const res = await fetch('/auth/login', {\n    method: 'POST',\n    credentials: 'include', // server sets httpOnly refresh cookie\n    body: JSON.stringify(credentials),\n  })\n  const data = await res.json()\n  accessToken = data.accessToken // short-lived, kept in a variable\n}\n\nfunction authHeader() {\n  return accessToken ? { Authorization: 'Bearer ' + accessToken } : {}\n}`,
      explanation: [
        'The short-lived access token lives only in a JS variable — never written to localStorage, so XSS persistence is harder and it dies on tab close/refresh.',
        'The long-lived refresh token is set by the server as an httpOnly cookie, so page scripts cannot read it.',
        'Requests send the access token via an explicit Authorization header (immune to CSRF since it is not auto-attached).',
        'On refresh, you call a /refresh endpoint that uses the httpOnly cookie to mint a new access token.',
        'This is the widely-recommended modern pattern balancing XSS and CSRF.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Token storage refers to the client-side persistence and transport strategy for authentication credentials. The core tradeoff is between JS-accessible stores (localStorage, sessionStorage, non-httpOnly cookies), which are readable by any script and therefore exposed to XSS exfiltration, and httpOnly cookies, which are unreadable by JS but sent automatically and therefore exposed to CSRF unless mitigated with SameSite/anti-CSRF tokens. The prevailing best practice is a split model: a short-lived access token held in memory and sent via an explicit Authorization header, paired with a long-lived refresh token in a SameSite, Secure, httpOnly cookie, with refresh-token rotation and server-side revocation to bound the blast radius of any single leak.',

  // 7. Internal Working
  internalWorking: [
    'On successful authentication the server issues credentials; how it returns them (response body vs Set-Cookie) dictates where they can live.',
    'localStorage/sessionStorage are synchronous key-value stores readable by any same-origin script via the DOM Storage API — convenient but fully exposed to XSS.',
    'A cookie with the HttpOnly flag is stored by the browser and attached to matching requests automatically, but is invisible to document.cookie and JS, removing it from the XSS read surface.',
    'In-memory storage (a closure/module variable) is the most ephemeral: unreadable by other tabs, wiped on reload, so a persisted XSS payload cannot simply read it back later.',
    'For transport, JS-held tokens are added as explicit headers (not auto-sent, so CSRF-safe), while cookies are auto-attached based on domain/SameSite (CSRF-relevant).',
    'Refresh flows trade a long-lived credential for short-lived ones: the refresh token (httpOnly cookie) is exchanged at a /refresh endpoint; rotation invalidates the old one to detect theft.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `         Storage location        Readable by JS?   Auto-sent?   Main risk
  ┌──────────────────────────┬────────────────┬───────────┬──────────┐
  │ localStorage             │      YES        │    no     │   XSS    │
  │ sessionStorage           │      YES        │    no     │   XSS    │
  │ cookie (no HttpOnly)      │      YES        │   yes     │ XSS+CSRF │
  │ cookie (HttpOnly,SameSite)│      NO         │   yes     │ CSRF*    │
  │ in-memory variable        │  yes (this tab) │    no     │ XSS(live)│
  └──────────────────────────┴────────────────┴───────────┴──────────┘
            *mitigated by SameSite + anti-CSRF token

   RECOMMENDED:  access token → in memory (short-lived)
                 refresh token → HttpOnly+SameSite+Secure cookie (rotated)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'In-memory token: lives on the JS heap inside a module/closure variable; reachable only by this tab\'s scripts and discarded when the page unloads.',
    'localStorage/sessionStorage: persisted by the browser outside the JS heap but exposed back to any same-origin script synchronously on demand.',
    'httpOnly cookie: stored in the browser\'s cookie jar, never materialized into the JS heap at all — the value is simply unreachable from script.',
    'Because the in-memory token has no persistent reference after unload, a stored XSS payload that runs on a later visit cannot read a token that no longer exists — limiting replay.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the risky localStorage approach',
      lang: 'js',
      code: `// Convenient but XSS-exposed\nlocalStorage.setItem('token', jwt)\n\nfetch('/api/me', {\n  headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },\n})`,
      explanation: [
        'localStorage persists the token across reloads and tabs, which is convenient.',
        'But ANY script that runs on your page — including an injected XSS payload — can read localStorage and exfiltrate the token.',
        'A stolen JWT is a bearer credential: whoever holds it is authenticated until it expires.',
        'This is why "just use localStorage" is the answer interviewers want you to critique, not endorse.',
      ],
    },
    intermediate: {
      label: 'Intermediate — httpOnly cookie set by the server',
      lang: 'js',
      code: `// Server (Express) on login:\nres.cookie('session', token, {\n  httpOnly: true,   // JS cannot read it\n  secure: true,     // HTTPS only\n  sameSite: 'lax',  // CSRF mitigation\n  maxAge: 1000 * 60 * 15, // 15 min\n})\n\n// Client just sends requests with credentials; no token handling in JS\nfetch('/api/me', { credentials: 'include' })`,
      explanation: [
        'The token never enters JavaScript — document.cookie cannot see an httpOnly cookie, defeating XSS theft.',
        'secure restricts it to HTTPS; sameSite=lax stops it being sent on most cross-site requests (CSRF mitigation).',
        'The client does not manage the token at all — it just includes credentials, simplifying frontend code.',
        'Tradeoff: because it is auto-sent, you still pair it with an anti-CSRF token for state-changing requests.',
      ],
    },
    advanced: {
      label: 'Advanced — refresh-token rotation with auto-retry',
      lang: 'js',
      code: `let accessToken = null\n\nasync function apiFetch(url, opts = {}) {\n  let res = await fetch(url, {\n    ...opts,\n    headers: { ...opts.headers, Authorization: 'Bearer ' + accessToken },\n  })\n  if (res.status === 401) {\n    // access token expired → use httpOnly refresh cookie to mint a new one\n    const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' })\n    if (!r.ok) throw new Error('session expired')\n    accessToken = (await r.json()).accessToken\n    res = await fetch(url, {\n      ...opts,\n      headers: { ...opts.headers, Authorization: 'Bearer ' + accessToken },\n    })\n  }\n  return res\n}`,
      explanation: [
        'The short-lived access token in memory limits the damage window if it leaks.',
        'On a 401, the wrapper transparently calls /refresh, which authenticates via the httpOnly refresh cookie.',
        'The server ROTATES the refresh token on each use; reuse of an old one signals theft and revokes the family.',
        'Users stay logged in seamlessly while each individual access token expires quickly.',
        'In React/Vue this lives in an Axios interceptor so components never touch tokens.',
      ],
    },
    realProject: {
      label: 'Real project — Pinia auth store keeping the token in memory',
      lang: 'js',
      code: `// stores/auth.ts (Vue + Pinia)\nimport { defineStore } from 'pinia'\n\nexport const useAuth = defineStore('auth', {\n  state: () => ({ accessToken: null }), // in-memory reactive state, NOT persisted\n  actions: {\n    async login(creds) {\n      const res = await fetch('/auth/login', {\n        method: 'POST',\n        credentials: 'include', // server sets httpOnly refresh cookie\n        body: JSON.stringify(creds),\n      })\n      this.accessToken = (await res.json()).accessToken\n    },\n    async bootstrap() {\n      // on app load, try to silently refresh from the cookie\n      const r = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' })\n      if (r.ok) this.accessToken = (await r.json()).accessToken\n    },\n    logout() { this.accessToken = null },\n  },\n})`,
      explanation: [
        'The access token lives in Pinia state in memory — deliberately NOT persisted to localStorage.',
        'On app load, bootstrap() silently refreshes using the httpOnly cookie so the user stays logged in across reloads.',
        'Because the token is in memory, a stored XSS that runs on a fresh load cannot read a leftover token.',
        'React equivalents keep it in a Context/Zustand store with the same no-persist rule.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Where can you store an auth token in the browser?',
      answer: 'localStorage, sessionStorage, cookies (ideally httpOnly+Secure+SameSite), or in-memory JS variables. Each has different persistence and security tradeoffs.',
      explanation: 'Listing all four and noting they differ in persistence and exposure is the baseline.',
    },
    {
      level: 'beginner',
      question: 'Why is localStorage considered risky for tokens?',
      answer: 'Any JavaScript on the page can read localStorage, so an XSS vulnerability lets an attacker steal the token and impersonate the user until it expires.',
      explanation: 'The link "JS-readable → XSS-stealable" is the key point.',
    },
    {
      level: 'intermediate',
      question: 'Compare httpOnly cookies and localStorage for token storage.',
      answer: 'httpOnly cookies are unreadable by JS (XSS-safe for theft) but auto-sent (CSRF-relevant, needs SameSite/anti-CSRF token). localStorage is XSS-exposed but immune to CSRF since you attach it manually. The tradeoff is XSS vs CSRF.',
      explanation: 'Framing it as the XSS-vs-CSRF tradeoff, not "one is better", shows maturity.',
    },
    {
      level: 'intermediate',
      question: 'Why keep access tokens short-lived?',
      answer: 'To bound the blast radius: if a short-lived token leaks, it expires within minutes, so the attacker\'s window is small. A long-lived refresh token, kept more protected (httpOnly, rotated), restores access seamlessly.',
      explanation: 'Connecting lifetime to blast radius is the expected reasoning.',
    },
    {
      level: 'advanced',
      question: 'Describe the in-memory access token + httpOnly refresh cookie pattern.',
      answer: 'The short-lived access token lives only in a JS variable and is sent via an Authorization header (CSRF-safe). The long-lived refresh token is an httpOnly, Secure, SameSite cookie the JS cannot read. On 401 the client silently calls /refresh; the server rotates the refresh token and reissues the access token. This minimizes both XSS and CSRF exposure.',
      explanation: 'This is the modern recommended architecture; explaining each piece\'s role is the senior-leaning signal.',
    },
    {
      level: 'senior',
      question: 'What is refresh-token rotation and how does it detect theft?',
      answer: 'Each time a refresh token is used, the server issues a new one and invalidates the old. If a stolen, already-rotated token is replayed, the server sees a token from an invalidated "family" and revokes the entire family, logging out the attacker (and prompting re-auth). It turns a silent leak into a detectable event.',
      explanation: 'Senior signal: understanding rotation as theft DETECTION, not just hygiene.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'If XSS can read localStorage, can it also abuse an httpOnly cookie? (Yes — it can ride the session via requests, just not read the token)',
    'How do you handle token storage across multiple tabs?',
    'What is the difference between an access token and a refresh token?',
    'Why is "store JWT in localStorage" still so common despite the risk?',
    'How do you revoke a JWT before it expires?',
    'How does SameSite interact with token-in-cookie strategies?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Storing long-lived JWTs in localStorage for convenience.',
      why: 'A single XSS exfiltrates the token, and a long-lived bearer token grants lasting account access with no easy revocation.',
      fix: 'Keep access tokens short-lived and in memory; put the refresh token in an httpOnly, Secure, SameSite cookie with rotation.',
    },
    {
      mistake: 'Assuming httpOnly cookies make you immune to all attacks.',
      why: 'XSS still can\'t read the cookie but can make authenticated requests in the user\'s context (session-riding); cookies also bring CSRF risk.',
      fix: 'Combine httpOnly with SameSite, anti-CSRF tokens, and CSP — defense in depth.',
    },
    {
      mistake: 'Treating client-side closures/memory as a "secure vault".',
      why: 'Anything in JS memory is inspectable via DevTools and reachable by any script in the same context.',
      fix: 'Rely on httpOnly cookies for unreadable storage; treat in-memory as ephemerality, not secrecy.',
    },
    {
      mistake: 'Forgetting to clear tokens on logout / not handling refresh-token reuse.',
      why: 'Stale tokens linger and reused refresh tokens may go undetected, leaving sessions hijackable.',
      fix: 'Null out in-memory tokens, clear cookies server-side, and implement rotation with family revocation.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Pinia/Vuex auth stores hold the access token in non-persisted memory; an Axios interceptor attaches it and silently refreshes via an httpOnly cookie on 401.' },
    { area: 'React', detail: 'Context/Zustand/Redux keep the access token in memory; refresh flows live in an Axios/fetch interceptor. Next.js often uses server-set httpOnly cookies read only on the server.' },
    { area: 'Node.js', detail: 'Auth services set Set-Cookie with HttpOnly/Secure/SameSite for refresh tokens, store hashed refresh tokens server-side, and implement rotation + revocation endpoints.' },
    { area: 'Backend', detail: 'API gateways validate short-lived access tokens (stateless JWT) while a stateful refresh-token store enables revocation; token families track and detect reuse.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Stateless short-lived JWTs let APIs validate without a DB lookup, scaling well horizontally.',
      'In-memory tokens avoid synchronous localStorage reads on every request.',
    ],
    bad: [
      'Refresh-token rotation with server-side revocation adds a stateful store and a DB hit per refresh.',
      'Very short access-token lifetimes increase refresh frequency, adding round-trips and potential UX stalls.',
    ],
    optimizations: [
      'Tune access-token TTL to balance refresh chatter against blast radius (e.g. 5-15 min).',
      'Cache/queue concurrent 401-triggered refreshes so simultaneous requests share one refresh call.',
      'Use the BroadcastChannel/storage events to sync token state across tabs without re-authenticating each.',
      'Prefer stateless JWT validation at the edge and reserve stateful checks for refresh/revocation.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'XSS exfiltration of JS-readable tokens (localStorage/sessionStorage/non-httpOnly cookies).',
      'CSRF abuse of auto-sent cookies without SameSite/anti-CSRF protection.',
      'Long-lived bearer tokens that cannot be revoked before expiry widen the blast radius of any leak.',
      'Token replay if refresh tokens are not rotated and reuse is not detected.',
    ],
    bestPractices: [
      'Access token: short-lived, in memory, sent via Authorization header.',
      'Refresh token: httpOnly, Secure, SameSite cookie, rotated with family-based reuse detection.',
      'Layer CSP to limit XSS impact and anti-CSRF tokens to protect cookie-based flows.',
      'Provide server-side revocation and clear all tokens on logout; never log tokens.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['storage-apis', 'xss', 'csrf'],
    nextConcepts: ['cors', 'csp', 'clickjacking'],
    dependencyNote:
      'Token storage is the practical intersection of XSS and CSRF: you need both to reason about the tradeoffs, plus storage-apis to know the mechanics. It pairs with CSP (limit XSS) and CORS (cross-origin auth) in a complete client-auth design.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw four boxes: localStorage, cookie(no httpOnly), cookie(httpOnly+SameSite), in-memory.',
      'Label each with "JS readable?" and "auto-sent?".',
      'Mark localStorage/sessionStorage as XSS-exposed; httpOnly as XSS-safe-but-CSRF-relevant.',
      'Draw the recommended split: access token in memory, refresh token in httpOnly cookie.',
      'Show the 401 → /refresh → rotate → new access token loop.',
      'Say: "The whole problem is XSS vs CSRF; the split model minimizes both and bounds blast radius with short lifetimes plus rotation."',
    ],
    diagram: `  login ─► server
            ├─ accessToken  → JS memory (15m, Bearer header)
            └─ refreshToken → Set-Cookie HttpOnly;Secure;SameSite
  401 ─► POST /refresh (cookie) ─► rotate ─► new accessToken`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Token storage is the XSS-vs-CSRF tradeoff. JS-readable stores (localStorage, sessionStorage, non-httpOnly cookies) are XSS-exposed; httpOnly cookies are XSS-safe but auto-sent so CSRF-relevant. The modern best practice is a short-lived access token kept in memory and sent via an Authorization header, plus a long-lived refresh token in an httpOnly, Secure, SameSite cookie with rotation. Short lifetimes bound the blast radius; rotation detects theft.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Token storage comes down to a tradeoff between two attacks. Anywhere JavaScript can read — localStorage, sessionStorage, or a non-httpOnly cookie — is exposed to XSS: if an attacker injects script, they can read and exfiltrate the token, and a bearer token grants account access until it expires. An httpOnly cookie removes the token from JavaScript\'s reach entirely, defeating XSS theft, but because cookies are sent automatically it introduces CSRF risk, which you mitigate with SameSite and anti-CSRF tokens. So it\'s fundamentally XSS versus CSRF, and the answer is to minimize both. The pattern I reach for is a split model: a short-lived access token held only in a memory variable and attached via an explicit Authorization header — which is CSRF-safe because it isn\'t auto-sent — paired with a long-lived refresh token in an httpOnly, Secure, SameSite cookie that JavaScript can\'t read. On a 401 the client silently calls a /refresh endpoint using that cookie, and the server rotates the refresh token, issuing a new one and invalidating the old. Rotation is key because it turns a silent leak into a detectable event: if an old, already-rotated token is replayed, the server revokes the whole token family. Short access-token lifetimes bound the blast radius of any leak, and I layer CSP to reduce XSS likelihood in the first place.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Stateless JWT access tokens scale without a DB lookup but can\'t be revoked before expiry; stateful sessions revoke instantly but add storage and lookups.',
      'In-memory tokens are most XSS-resistant but lost on reload, requiring a silent refresh that complicates app bootstrap.',
    ],
    edgeCases: [
      'Multi-tab sync: each tab has its own memory; coordinate via BroadcastChannel or accept independent refreshes.',
      'Concurrent requests hitting 401 simultaneously can stampede /refresh — queue and dedupe.',
      'Clock skew can cause premature 401s with short TTLs; build in leeway.',
      'Silent refresh on load can race with the first protected request; gate requests until bootstrap completes.',
    ],
    runtimeBehavior: [
      'httpOnly cookies never enter the JS heap; document.cookie simply omits them.',
      'XSS with an httpOnly cookie still can\'t read the token but can ride the session by issuing requests in-context — so httpOnly is not a full XSS cure.',
      'SameSite=Lax still sends the cookie on top-level GET navigations, relevant to refresh-endpoint design.',
    ],
    scalability: [
      'Stateless access-token validation at the edge/gateway scales horizontally; reserve the stateful refresh store for the lower-volume refresh path.',
      'Hash refresh tokens at rest and index by family to make revocation and reuse detection efficient.',
    ],
    productionConcerns: [
      'Never log tokens; scrub them from error reporting and analytics.',
      'Implement explicit logout that clears in-memory state and invalidates the refresh token server-side.',
      'Monitor refresh-reuse events as a security signal and rate-limit the refresh endpoint.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Core tradeoff: XSS (JS-readable stores) vs CSRF (auto-sent cookies).',
    'localStorage/sessionStorage/non-httpOnly cookie = XSS-exposed.',
    'httpOnly cookie = XSS-safe to read, but CSRF-relevant (use SameSite + token).',
    'In-memory variable = ephemeral, unreadable across tabs/reloads.',
    'Best practice: access token in memory + httpOnly refresh cookie.',
    'Send access tokens via Authorization header (CSRF-safe).',
    'Keep access tokens short-lived to bound blast radius.',
    'Rotate refresh tokens; detect reuse → revoke the family.',
    'httpOnly does NOT stop session-riding via XSS.',
    'Layer CSP (limit XSS) + anti-CSRF + SameSite.',
    'Stateless JWT = no revoke before expiry; pair with refresh store.',
    'Never log tokens; clear everything on logout.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a tiny module that stores an access token in memory with set/get/clear functions (no localStorage).',
      hint: 'Use a closure variable.',
      solution: {
        lang: 'js',
        code: `let token = null\nexport const tokenStore = {\n  set: (t) => { token = t },\n  get: () => token,\n  clear: () => { token = null },\n}`,
        explanation: [
          'The token lives only in the closure variable — never persisted, gone on reload.',
          'A stored XSS payload on a later page load finds nothing to read.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Configure an Express response that sets a refresh token as a hardened httpOnly cookie.',
      hint: 'Set httpOnly, secure, sameSite, and a maxAge.',
      solution: {
        lang: 'js',
        code: `res.cookie('refreshToken', refreshToken, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict',\n  maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days\n  path: '/auth/refresh', // scope it to the refresh endpoint only\n})`,
        explanation: [
          'httpOnly hides it from JS; secure forces HTTPS; sameSite=strict blocks cross-site sending.',
          'Scoping path to /auth/refresh means the cookie is only attached where it is needed, shrinking exposure.',
          'A 7-day life with rotation balances UX and security.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a fetch wrapper that, on 401, refreshes the access token once and dedupes concurrent refreshes so only one /refresh call happens.',
      hint: 'Cache the in-flight refresh promise.',
      solution: {
        lang: 'js',
        code: `let accessToken = null\nlet refreshing = null\n\nasync function refresh() {\n  refreshing ??= fetch('/auth/refresh', { method: 'POST', credentials: 'include' })\n    .then((r) => { if (!r.ok) throw new Error('expired'); return r.json() })\n    .then((d) => { accessToken = d.accessToken })\n    .finally(() => { refreshing = null })\n  return refreshing\n}\n\nexport async function apiFetch(url, opts = {}) {\n  const call = () => fetch(url, { ...opts, headers: { ...opts.headers, Authorization: 'Bearer ' + accessToken } })\n  let res = await call()\n  if (res.status === 401) { await refresh(); res = await call() }\n  return res\n}`,
        explanation: [
          'refreshing caches the in-flight promise so simultaneous 401s share ONE /refresh call (no stampede).',
          '??= assigns only if null, the dedupe trick; finally clears it for the next cycle.',
          'After refresh, the original request is retried once with the new token.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'An interviewer says "we store the JWT in localStorage". Critique it and propose a safer design, naming the tradeoffs.',
      hint: 'Lead with the XSS exposure, then the split model.',
      solution: {
        lang: 'js',
        code: `// Critique: localStorage is readable by ANY script → one XSS exfiltrates the JWT,\n// and a long-lived bearer token can't be revoked before expiry.\n\n// Safer split model:\n//  - access token: short-lived (~10m), kept in memory, sent as Authorization header (CSRF-safe)\n//  - refresh token: httpOnly + Secure + SameSite cookie, rotated, server-revocable\nlet accessToken = null // memory only\n// refresh handled via /auth/refresh using the httpOnly cookie\n// Layer CSP to reduce XSS; SameSite + anti-CSRF token for the cookie path.`,
        explanation: [
          'The critique names the concrete failure: XSS reads localStorage and steals a long-lived bearer token.',
          'The proposal splits credentials so the readable one is short-lived/in-memory and the powerful one is unreadable (httpOnly).',
          'Naming the residual tradeoffs (CSRF on the cookie, refresh complexity, multi-tab) shows senior-level honesty.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Token storage is where authentication theory meets real attack surface. Articulating the XSS-vs-CSRF tradeoff and the in-memory + httpOnly-refresh pattern immediately marks you as someone who has shipped real auth, not just read about JWTs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "localStorage vs cookies for JWT". Product companies (Zoho, Flipkart, Razorpay) ask you to design the full login + refresh flow and defend the choices. FAANG-level interviews probe rotation, revocation, multi-tab sync, and refresh stampedes.',
    whatInterviewersExpect:
      'They expect you to frame it as XSS vs CSRF, reject naive long-lived localStorage tokens, describe the split access/refresh model with httpOnly + SameSite + rotation, and connect lifetime to blast radius.',
  },
}

export default secureTokenStorage
