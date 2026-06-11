import type { ConceptLesson } from '../../../types/lesson'

const cors: ConceptLesson = {
  // 1. Concept Summary
  slug: 'cors',
  name: 'CORS',
  category: 'security',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'CORS is the single most common "why does my fetch fail?" error every web developer hits — understanding it saves hours of debugging.',
    'It is the browser\'s controlled relaxation of the Same-Origin Policy, the foundational rule that keeps one site from reading another\'s data.',
    'Misconfigured CORS (e.g. reflecting any origin with credentials) is a real vulnerability that leaks authenticated data cross-site.',
    'Interviewers use CORS to test whether you understand that it is a BROWSER enforcement, not a server firewall — a frequent misconception.',
    'Every SPA talking to an API on a different domain, every third-party widget, and every public API depends on getting CORS right.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'CORS is a guest list at a party — the host decides which other houses are allowed to come in and look around.',
    story: [
      'Imagine your house keeps your toys, and your friend\'s house keeps theirs. Normally you can only play with toys in your own house.',
      'Sometimes you want a toy from your friend\'s house. The rule is: you can only take it if your friend\'s house has YOUR name on its "allowed visitors" list.',
      'If your name is on the list, the toy comes to you. If it is not, the door guard says "sorry, you are not allowed" and sends you home empty-handed.',
      'CORS is that guard: when a website wants data from a different website, the browser checks whether that other site put your website on its allowed list before letting you read the answer.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'By default, the browser stops code on one website from reading data from a different website — this is the Same-Origin Policy, and it protects your private data.',
    'But often we genuinely need cross-site data, like a shopping app calling its own API on another domain.',
    'CORS is a system of HTTP headers where the server says "I allow website X to read my responses". The browser checks those headers.',
    'If the server\'s headers permit the calling site, the browser hands the response to the JavaScript; if not, it blocks the read and shows a CORS error — even though the server may have actually processed the request.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'CORS (Cross-Origin Resource Sharing) is a browser mechanism that uses HTTP headers to let a server declare which other origins are allowed to read its responses, selectively relaxing the Same-Origin Policy.',
    how: 'When JS makes a cross-origin request, the browser adds an Origin header. The server replies with Access-Control-Allow-Origin (and related headers). The browser compares them; if they permit the caller, the response is exposed to JS — otherwise it is blocked.',
    why: 'The Same-Origin Policy blocks all cross-origin reads by default to protect data. CORS provides a safe, opt-in way for a server to share specific resources with specific origins without disabling that protection globally.',
    code: {
      label: 'A server allowing one origin',
      lang: 'js',
      code: `// Express API on api.shop.com allowing the SPA on app.shop.com\napp.use((req, res, next) => {\n  res.setHeader('Access-Control-Allow-Origin', 'https://app.shop.com')\n  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')\n  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')\n  if (req.method === 'OPTIONS') return res.sendStatus(204)\n  next()\n})`,
      explanation: [
        'Access-Control-Allow-Origin names exactly which origin may read responses — here only app.shop.com.',
        'Allow-Methods/Allow-Headers tell the browser which verbs and headers are permitted on this resource.',
        'The OPTIONS short-circuit answers the browser\'s "preflight" question before the real request.',
        'Note: these headers control the BROWSER\'s decision to expose the response — the request itself still reached the server.',
        'A non-browser client (curl, server-to-server) ignores CORS entirely.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Cross-Origin Resource Sharing (CORS) is a W3C/Fetch standard that lets servers use HTTP response headers to relax the browser-enforced Same-Origin Policy on a per-origin, per-method, per-header basis. An origin is the tuple (scheme, host, port). For "non-simple" requests the browser first sends a preflight OPTIONS request carrying Access-Control-Request-Method/Headers; the server must answer with matching Access-Control-Allow-* headers before the browser will issue and expose the actual request. CORS governs whether JavaScript may READ a cross-origin response — it is enforced entirely in the user agent, not by the server, and does not prevent the request from being received.',

  // 7. Internal Working
  internalWorking: [
    'JS issues a cross-origin request; the browser computes the request\'s origin and decides whether it is "simple" (safe method + safe headers + allowed content types) or requires a preflight.',
    'For non-simple requests, the browser first sends an OPTIONS "preflight" with Access-Control-Request-Method and Access-Control-Request-Headers, asking permission.',
    'The server responds to the preflight with Access-Control-Allow-Origin/Methods/Headers (and optionally Max-Age to cache the decision).',
    'If the preflight response permits the operation, the browser sends the actual request; otherwise it blocks it and never sends the real call.',
    'On the actual response, the browser re-checks Access-Control-Allow-Origin (and Allow-Credentials if credentials were used) before exposing the body/headers to JS.',
    'If any check fails, the browser throws a TypeError on the fetch/XHR and logs a CORS error — even though the server may have fully processed and responded.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  app.shop.com (JS)                api.shop.com (server)
        │                                  │
        │  PREFLIGHT (non-simple)          │
        │  OPTIONS  ───────────────────────►
        │  Origin: app.shop.com            │
        │  Access-Control-Request-Method   │
        │                                  │
        │  ◄─── Access-Control-Allow-Origin: app.shop.com
        │       Access-Control-Allow-Methods: POST
        │                                  │
        │  ACTUAL REQUEST (only if allowed)│
        │  POST /orders  ──────────────────►
        │  ◄─── 200 + Access-Control-Allow-Origin
        │                                  │
   browser checks header ─► matches? ─► expose to JS ✔
                          └► mismatch? ─► BLOCK + CORS error ✘`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a simple GET (no preflight)',
      lang: 'js',
      code: `// A "simple" cross-origin GET — no custom headers\nfetch('https://api.example.com/data')\n  .then((r) => r.json())\n  .then(console.log)\n  .catch((e) => console.error('blocked by CORS?', e))`,
      explanation: [
        'A GET with no custom headers is a "simple request" — the browser sends it without a preflight.',
        'The browser still checks Access-Control-Allow-Origin on the response before exposing it.',
        'If that header is missing or does not match, .catch fires with a TypeError, not an HTTP error.',
        'The server still received and may have logged the request — CORS only blocks the JS read.',
      ],
    },
    intermediate: {
      label: 'Intermediate — credentialed request',
      lang: 'js',
      code: `// Sending cookies cross-origin\nfetch('https://api.example.com/me', {\n  credentials: 'include',\n})\n\n// Server MUST respond with BOTH:\n//   Access-Control-Allow-Origin: https://app.example.com  (exact, not *)\n//   Access-Control-Allow-Credentials: true`,
      explanation: [
        'credentials: "include" tells the browser to send cookies/Authorization on the cross-origin request.',
        'With credentials, the server may NOT use the wildcard "*" for Allow-Origin — it must echo the exact origin.',
        'It must also send Access-Control-Allow-Credentials: true, or the browser blocks the read.',
        'This pairing is a frequent interview gotcha: wildcard + credentials is forbidden by the spec.',
      ],
    },
    advanced: {
      label: 'Advanced — safe dynamic origin reflection',
      lang: 'js',
      code: `const ALLOWED = new Set([\n  'https://app.shop.com',\n  'https://admin.shop.com',\n])\n\napp.use((req, res, next) => {\n  const origin = req.headers.origin\n  if (origin && ALLOWED.has(origin)) {\n    res.setHeader('Access-Control-Allow-Origin', origin)\n    res.setHeader('Access-Control-Allow-Credentials', 'true')\n    res.setHeader('Vary', 'Origin')\n  }\n  if (req.method === 'OPTIONS') {\n    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')\n    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')\n    res.setHeader('Access-Control-Max-Age', '600')\n    return res.sendStatus(204)\n  }\n  next()\n})`,
      explanation: [
        'You echo the request Origin only if it is on an explicit allowlist — never blindly reflect any origin with credentials.',
        'Vary: Origin tells caches the response differs per origin, preventing one origin\'s headers being served to another.',
        'Access-Control-Max-Age caches the preflight decision for 10 minutes, cutting OPTIONS round-trips.',
        'This is the secure pattern; reflecting Origin unconditionally + credentials = data leak to any site.',
      ],
    },
    realProject: {
      label: 'Real project — Vite dev proxy to dodge CORS in development',
      lang: 'js',
      code: `// vite.config.ts — proxy /api to the backend so the browser sees same-origin\nexport default {\n  server: {\n    proxy: {\n      '/api': {\n        target: 'https://api.internal.dev',\n        changeOrigin: true,\n        rewrite: (path) => path.replace(/^\\/api/, ''),\n      },\n    },\n  },\n}`,
      explanation: [
        'In dev the Vue/React app runs on localhost:5173 but the API is elsewhere, triggering CORS.',
        'The Vite dev server proxies /api requests server-side, so the browser only ever talks to its own origin — no CORS.',
        'changeOrigin rewrites the Host header so the backend accepts it; rewrite strips the /api prefix.',
        'In production you would instead configure real CORS headers or serve API and app from the same origin / a gateway.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is CORS and what problem does it solve?',
      answer: 'CORS is a browser mechanism using HTTP headers that lets a server opt in to sharing its responses with specific other origins, safely relaxing the Same-Origin Policy which otherwise blocks all cross-origin reads.',
      explanation: 'Strong answers tie CORS to the Same-Origin Policy and frame it as opt-in relaxation, not a new restriction.',
    },
    {
      level: 'beginner',
      question: 'What defines an "origin"?',
      answer: 'The tuple of scheme + host + port. https://a.com and http://a.com differ (scheme); a.com:80 and a.com:8080 differ (port); a.com and b.a.com differ (host).',
      explanation: 'Many candidates forget port and scheme count — naming all three is the signal.',
    },
    {
      level: 'intermediate',
      question: 'What is a CORS preflight and when does it happen?',
      answer: 'A preflight is an automatic OPTIONS request the browser sends before a "non-simple" request (custom headers, methods beyond GET/POST/HEAD, or non-form content types) to ask the server\'s permission. The real request only fires if the preflight is approved.',
      explanation: 'Listing what makes a request non-simple (e.g. application/json, Authorization header) shows depth.',
    },
    {
      level: 'intermediate',
      question: 'Why does my server log the request but the browser still shows a CORS error?',
      answer: 'Because CORS is enforced by the BROWSER on the response, not by the server on the request. The server received and processed it; the browser simply refuses to expose the response to JS because the Allow-Origin header did not match.',
      explanation: 'This corrects the most common misconception — that CORS blocks the request from arriving.',
    },
    {
      level: 'advanced',
      question: 'Why can\'t you use Access-Control-Allow-Origin: * with credentials?',
      answer: 'The spec forbids it: a wildcard with credentials would let any site read another user\'s authenticated data. With credentials you must echo the exact requesting origin and send Access-Control-Allow-Credentials: true.',
      explanation: 'Connecting the rule to the data-leak it prevents is the senior-leaning answer.',
    },
    {
      level: 'senior',
      question: 'How can a misconfigured CORS policy become a vulnerability?',
      answer: 'If a server reflects ANY incoming Origin into Allow-Origin AND sets Allow-Credentials: true, a malicious site can make credentialed requests and read the authenticated response — effectively a data-exfiltration channel. Trusting "null" origin or sloppy regex matching of subdomains causes similar leaks.',
      explanation: 'Senior signal: treating CORS as an authorization surface, not just a config toggle, and naming reflection/null/regex pitfalls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between the Same-Origin Policy and CORS?',
    'Which requests are "simple" and skip the preflight?',
    'Does CORS prevent CSRF? (No — CORS governs reading responses, not whether requests are sent)',
    'What does the Vary: Origin header do and why is it needed?',
    'How would you debug a CORS error in the Network tab?',
    'How do you handle CORS for a public API meant for any origin?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Thinking CORS blocks the request from reaching the server.',
      why: 'CORS is enforced in the browser on the RESPONSE; the server still receives and can act on the request.',
      fix: 'Treat CORS as "can JS read the answer?", and never rely on it for server-side authorization.',
    },
    {
      mistake: 'Pairing Access-Control-Allow-Origin: * with credentials: include.',
      why: 'The spec rejects this combination; the browser blocks the read and it is a security hole if it worked.',
      fix: 'Echo the exact origin from an allowlist and send Access-Control-Allow-Credentials: true.',
    },
    {
      mistake: 'Reflecting any incoming Origin into Allow-Origin to "make CORS work".',
      why: 'With credentials this lets every website read your users\' authenticated data.',
      fix: 'Validate Origin against an explicit allowlist and add Vary: Origin so caches do not cross responses.',
    },
    {
      mistake: 'Forgetting to handle the OPTIONS preflight, so it returns 404/405.',
      why: 'A failed preflight means the browser never sends the real request.',
      fix: 'Respond to OPTIONS with the Allow-* headers and a 204, ideally via a CORS middleware.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Express apps use the cors middleware with an origin allowlist function; Fastify/NestJS have first-class CORS plugins configured per environment.' },
    { area: 'Vue', detail: 'Vite/Nuxt dev servers proxy API calls to avoid CORS in development; production relies on the backend\'s real CORS headers or same-origin gateway routing.' },
    { area: 'React', detail: 'CRA/Next.js use a dev proxy; Next.js API routes and middleware set CORS headers for cross-origin clients, and edge functions configure per-route policies.' },
    { area: 'Backend', detail: 'API gateways (NGINX, Kong, AWS API Gateway, Cloudflare) often centralize CORS headers, with per-route Max-Age tuning to cut preflight chatter.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Access-Control-Max-Age caches preflight decisions in the browser, eliminating repeated OPTIONS round-trips.',
      'Same-origin or proxied architectures avoid CORS entirely, saving a network round-trip per non-simple request.',
    ],
    bad: [
      'Every non-simple cross-origin request without cached preflight costs an extra OPTIONS round-trip, adding latency.',
      'Low or zero Max-Age forces a preflight on nearly every call, doubling request counts on chatty APIs.',
    ],
    optimizations: [
      'Set a sensible Access-Control-Max-Age (e.g. 600s) to amortize preflights.',
      'Keep requests "simple" where possible (avoid unnecessary custom headers) to skip preflight altogether.',
      'Co-locate the SPA and API on the same origin (or behind one gateway) to remove CORS overhead in production.',
      'Add Vary: Origin to keep CDN/proxy caches correct without disabling caching.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Reflecting arbitrary Origin + Allow-Credentials lets any site read authenticated responses — a data-exfiltration hole.',
      'Trusting the "null" origin (sandboxed iframes, file://) can be abused by attacker-controlled contexts.',
      'Sloppy subdomain regexes (e.g. matching evil-shop.com because it contains shop.com) leak to lookalike domains.',
    ],
    bestPractices: [
      'Use an explicit origin allowlist; never blindly reflect Origin when credentials are involved.',
      'Never combine wildcard Allow-Origin with credentials; echo the exact origin instead.',
      'Add Vary: Origin and validate origins with strict equality, not substring/regex matching.',
      'Remember CORS does not authorize requests — keep server-side authz and CSRF defenses independent of it.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['fetch-api', 'event-system', 'storage-apis'],
    nextConcepts: ['csrf', 'csp', 'secure-token-storage', 'xss'],
    dependencyNote:
      'CORS builds on understanding HTTP and the fetch API, and it sits beside CSRF, CSP, and token storage in the browser-security cluster. People often confuse CORS and CSRF, so learning them together clarifies both.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes: app.com (browser/JS) and api.com (server).',
      'Draw the OPTIONS preflight arrow from app.com to api.com for a non-simple request.',
      'Draw the server\'s reply with Access-Control-Allow-Origin and Allow-Methods.',
      'Show the actual request firing only after approval, then the browser re-checking the header.',
      'Mark "browser decides whether JS can READ the response" — server already got the request.',
      'Say: "CORS is the browser\'s opt-in relaxation of Same-Origin Policy; the server declares who may read its responses."',
    ],
    diagram: `  app.com ──OPTIONS (preflight)──► api.com
          ◄── Allow-Origin: app.com
  app.com ──actual request──────► api.com
          ◄── response + Allow-Origin
   browser: header matches? ─► JS reads ✔ / blocked ✘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'CORS is the browser\'s opt-in relaxation of the Same-Origin Policy. An origin is scheme+host+port. For non-simple requests the browser sends an OPTIONS preflight; the server replies with Access-Control-Allow-* headers, and only then does the real request go and get exposed to JS. It is enforced in the browser on the RESPONSE — the server still receives the request. Wildcard origin with credentials is forbidden; echo the exact origin from an allowlist.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'CORS, Cross-Origin Resource Sharing, is how a server safely opts in to sharing its responses with other origins, relaxing the Same-Origin Policy that otherwise blocks all cross-origin reads. An origin is the tuple of scheme, host, and port, so https and http differ, and different ports or subdomains are different origins. When JavaScript makes a cross-origin call, the browser categorizes it as simple or non-simple. Simple requests — GET or POST with safe headers and form content types — go straight through, and the browser just checks Access-Control-Allow-Origin on the response. Non-simple requests, like anything with a JSON body or an Authorization header, trigger a preflight: the browser first sends an OPTIONS asking permission, and only if the server replies with matching Allow-Origin, Allow-Methods, and Allow-Headers does the real request fire. The crucial mental model is that CORS is enforced by the browser on the response — the server already received and may have processed the request, so CORS is never a substitute for server-side authorization. With credentials you cannot use a wildcard origin; you must echo the exact origin and send Allow-Credentials true. And a dangerous misconfiguration is reflecting any incoming origin with credentials, which lets any site read a user\'s authenticated data. Performance-wise, set Access-Control-Max-Age to cache preflights, or co-locate app and API to avoid CORS entirely.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Strict allowlisting is secure but operationally heavier than a wildcard; you must update it as new front-ends appear.',
      'A high Max-Age reduces latency but delays propagation of policy changes (the browser keeps an old decision cached).',
    ],
    edgeCases: [
      'Credentialed requests forbid wildcard origin and require exact echo + Allow-Credentials.',
      'The "null" origin appears for sandboxed iframes, redirects, and file://; trusting it is dangerous.',
      'Caches can serve one origin\'s CORS headers to another unless Vary: Origin is set.',
      'Some headers (Set-Cookie, etc.) and most response headers are hidden from JS unless listed in Access-Control-Expose-Headers.',
    ],
    runtimeBehavior: [
      'A failed preflight prevents the actual request entirely — useful to know when debugging "no request was sent".',
      'CORS errors surface as a generic TypeError in fetch with no status, by design, to avoid leaking response details cross-origin.',
      'opaque responses (mode: no-cors) are returned but unreadable — status 0, empty body — a common surprise.',
    ],
    scalability: [
      'Centralizing CORS at an API gateway/edge avoids per-service drift and lets you tune Max-Age globally.',
      'Chatty SPAs benefit hugely from keeping requests simple and from preflight caching to cut OPTIONS volume.',
    ],
    productionConcerns: [
      'Audit for Origin reflection + credentials, the classic exfiltration bug, in security reviews.',
      'Ensure Vary: Origin everywhere a dynamic origin is echoed, or CDN caching will leak headers across origins.',
      'Remember CORS is not CSRF protection nor authorization — keep those defenses independent.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'CORS = server opt-in to share responses cross-origin; relaxes Same-Origin Policy.',
    'Origin = scheme + host + port.',
    'Enforced by the BROWSER on the response — server still gets the request.',
    'Non-simple request → preflight OPTIONS first.',
    'Simple = GET/POST/HEAD + safe headers + form content types.',
    'Key headers: Access-Control-Allow-Origin / -Methods / -Headers / -Credentials / -Max-Age.',
    'Wildcard "*" + credentials = forbidden; echo exact origin instead.',
    'Use an allowlist; never blindly reflect Origin with credentials.',
    'Add Vary: Origin when echoing a dynamic origin.',
    'CORS does NOT prevent CSRF or replace server-side authz.',
    'CORS errors appear as a TypeError with no status.',
    'Expose extra response headers via Access-Control-Expose-Headers.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given two URLs, write a function isSameOrigin(a, b) that returns true only if scheme, host, and port match.',
      hint: 'Use the URL constructor and compare origin.',
      solution: {
        lang: 'js',
        code: `function isSameOrigin(a, b) {\n  return new URL(a).origin === new URL(b).origin\n}\nisSameOrigin('https://a.com/x', 'https://a.com/y')   // true\nisSameOrigin('https://a.com', 'http://a.com')        // false (scheme)`,
        explanation: [
          'URL.origin already combines scheme + host + port into a comparable string.',
          'This mirrors exactly how the browser decides whether a request is cross-origin.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write Express middleware that allows credentials only for origins in an allowlist and sets Vary: Origin.',
      hint: 'Echo the request origin if allowed; never use "*".',
      solution: {
        lang: 'js',
        code: `const ALLOWED = new Set(['https://app.com', 'https://admin.com'])\nfunction cors(req, res, next) {\n  const origin = req.headers.origin\n  if (origin && ALLOWED.has(origin)) {\n    res.setHeader('Access-Control-Allow-Origin', origin)\n    res.setHeader('Access-Control-Allow-Credentials', 'true')\n    res.setHeader('Vary', 'Origin')\n  }\n  next()\n}`,
        explanation: [
          'We echo the exact origin only when it is allowlisted — required because credentials forbid wildcard.',
          'Vary: Origin prevents a cache from serving one origin\'s headers to another.',
          'Non-allowlisted origins simply get no CORS headers, so the browser blocks them.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add preflight handling to the middleware above: answer OPTIONS with allowed methods/headers and a Max-Age, returning 204.',
      hint: 'Check req.method === "OPTIONS" and short-circuit.',
      solution: {
        lang: 'js',
        code: `function cors(req, res, next) {\n  const origin = req.headers.origin\n  if (origin && ALLOWED.has(origin)) {\n    res.setHeader('Access-Control-Allow-Origin', origin)\n    res.setHeader('Access-Control-Allow-Credentials', 'true')\n    res.setHeader('Vary', 'Origin')\n  }\n  if (req.method === 'OPTIONS') {\n    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')\n    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')\n    res.setHeader('Access-Control-Max-Age', '600')\n    return res.sendStatus(204)\n  }\n  next()\n}`,
        explanation: [
          'The OPTIONS branch answers the browser\'s preflight before any real handler runs.',
          'Allow-Methods/Headers must cover what the client intends to use or the real request is blocked.',
          'Max-Age=600 caches this decision for 10 minutes, cutting repeated preflights.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate set Access-Control-Allow-Origin to the reflected request Origin AND Allow-Credentials: true to "fix CORS". Explain the vulnerability and the correct fix.',
      hint: 'Think about what an attacker site can now read.',
      solution: {
        lang: 'js',
        code: `// VULNERABLE: reflects ANY origin with credentials\n// res.setHeader('Access-Control-Allow-Origin', req.headers.origin)\n// res.setHeader('Access-Control-Allow-Credentials', 'true')\n\n// FIX: allowlist + exact echo + Vary\nconst ALLOWED = new Set(['https://app.com'])\nif (ALLOWED.has(req.headers.origin)) {\n  res.setHeader('Access-Control-Allow-Origin', req.headers.origin)\n  res.setHeader('Access-Control-Allow-Credentials', 'true')\n  res.setHeader('Vary', 'Origin')\n}`,
        explanation: [
          'Reflecting any origin with credentials lets evil.com make credentialed requests and READ the victim\'s authenticated response — full cross-site data theft.',
          'The fix restricts echoing to a strict allowlist so only trusted front-ends can read responses.',
          'Vary: Origin keeps shared caches from mixing per-origin responses.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'CORS is the error every web developer hits, and explaining it correctly — especially that it is a browser-side response check, not a server firewall — instantly signals you understand web security fundamentals.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and "why does my fetch fail". Product companies (Zoho, Flipkart, Razorpay) ask about preflights, credentials rules, and proxying in dev. FAANG-level interviews probe misconfiguration vulnerabilities, the null origin, Vary, and the CORS-vs-CSRF distinction.',
    whatInterviewersExpect:
      'They expect you to define origin precisely, describe the preflight flow, state that CORS is browser-enforced on the response, know the wildcard-with-credentials rule, and articulate how a reflected-origin misconfig becomes a data-exfiltration vulnerability.',
  },
}

export default cors
