import type { ConceptLesson } from '../../../types/lesson'

const csrf: ConceptLesson = {
  // 1. Concept Summary
  slug: 'csrf',
  name: 'Cross-Site Request Forgery',
  category: 'security',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'CSRF lets an attacker make a victim\'s browser perform authenticated actions (transfer money, change email, delete account) without the victim ever knowing.',
    'It exploits the browser\'s habit of automatically attaching cookies to every request to a domain — so ambient authority becomes a weapon.',
    'It is one of the OWASP classics; interviewers use it to test whether you understand the difference between authentication and intent.',
    'A single missing anti-CSRF token on a state-changing endpoint can compromise every user with an active session.',
    'Understanding CSRF forces you to reason about SameSite cookies, the same-origin policy, and why "GET should never change state".',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'CSRF is a forged note that tricks the school office into using YOUR signed permission slip.',
    story: [
      'Imagine the school office trusts your signed permission slip and lets anyone holding it take you out early.',
      'A trickster cannot copy your signature, but they know the office automatically accepts the slip already in your folder.',
      'So they slide a fake request into the folder: "Let this student leave now." The office sees the trusted slip attached and obeys.',
      'CSRF works the same way: a bad website tricks your browser into sending a request to a site you are logged into, and the browser helpfully attaches your "permission slip" (your cookie) so the site thinks it really came from you.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you log into a website, the browser stores a cookie and sends it automatically with every request to that site.',
    'A different, malicious website can secretly tell your browser to send a request to the site you are logged into — for example by hiding a form or an image that points there.',
    'Because the browser attaches your login cookie automatically, the target site believes the request really came from you and performs the action.',
    'CSRF is about forging the INTENT of a logged-in user; the attacker never sees your password or cookie, they just trigger a request that rides on your existing session.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Cross-Site Request Forgery is an attack where a malicious page causes a victim\'s authenticated browser to send an unwanted state-changing request to a target site, abusing automatically-sent credentials like cookies.',
    how: 'The attacker hosts a page with a hidden auto-submitting form (or an <img>/fetch) targeting the victim site\'s endpoint. When the logged-in victim visits it, the browser sends the request WITH the victim\'s cookies, and the server acts on it.',
    why: 'Browsers attach cookies to a domain on every request regardless of which site initiated it. The server cannot tell a legitimate same-site request apart from a forged cross-site one unless you add a defense it can verify (a token, or SameSite cookies).',
    code: {
      label: 'A malicious CSRF page',
      lang: 'html',
      code: `<!-- attacker.com -->\n<h1>You won a prize! Click below.</h1>\n<form action="https://bank.com/transfer" method="POST" id="f">\n  <input type="hidden" name="to" value="attacker" />\n  <input type="hidden" name="amount" value="10000" />\n</form>\n<script>document.getElementById('f').submit()</script>`,
      explanation: [
        'The victim is already logged into bank.com in another tab, so a session cookie exists.',
        'When they open attacker.com, the script auto-submits a POST to bank.com/transfer.',
        'The browser attaches the bank.com session cookie automatically — it does this for any request to bank.com.',
        'bank.com sees a valid session and a well-formed transfer, so it executes the transfer.',
        'The victim never typed anything; their authenticated browser was used as the weapon.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Cross-Site Request Forgery (CSRF, sometimes XSRF or "session riding") is a confused-deputy attack in which a malicious origin induces a victim\'s browser to issue an unwanted, state-changing HTTP request to a target application for which the victim holds ambient credentials (typically a session cookie). Because the browser attaches those credentials automatically based on the destination domain, the server cannot distinguish a forged cross-origin request from a legitimate one unless it requires an unguessable, origin-bound proof of intent — an anti-CSRF token, a custom header verifiable via CORS, or SameSite cookie restrictions.',

  // 7. Internal Working
  internalWorking: [
    'The victim authenticates to target.com; the server sets a session cookie scoped to target.com.',
    'The victim later loads attacker.com, which contains markup or script that triggers a request to target.com (form submit, image load, or fetch).',
    'The browser builds the outgoing request to target.com and, per cookie scoping rules, automatically attaches the target.com session cookie regardless of the initiating origin.',
    'The request reaches target.com with valid credentials; the server\'s authentication middleware sees a logged-in user and authorizes the action.',
    'Unless the endpoint verifies an additional secret that only the genuine site UI could supply (CSRF token / custom header), the forged request is indistinguishable from a real one and is executed.',
    'Modern browsers mitigate this by defaulting cookies to SameSite=Lax, which withholds cookies on most cross-site subrequests — but legacy/SameSite=None cookies remain exposed.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Victim (logged into bank.com)
        │
        │ 1. visits attacker.com
        ▼
  ┌─────────────────────┐
  │   attacker.com       │  hidden form / img / fetch
  │  auto-submits POST ──┼────────────┐
  └─────────────────────┘            │  2. request to bank.com
                                      ▼
                          ┌───────────────────────────┐
       browser AUTO-adds  │  POST bank.com/transfer    │
       bank.com cookie ──►│  Cookie: session=VALID  ✔  │
                          │  (no proof of intent)      │
                          └───────────────────────────┘
                                      │ 3. server trusts cookie
                                      ▼
                          $$ transfer executed (forged) $$`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — GET-based CSRF via an image',
      lang: 'html',
      code: `<!-- A state-changing GET is the easiest CSRF target -->\n<img src="https://app.com/account/delete?confirm=1" width="0" height="0" />`,
      explanation: [
        'Simply rendering this <img> on any page makes the browser issue a GET to app.com/delete.',
        'The browser attaches app.com cookies automatically, so a logged-in victim\'s account is deleted.',
        'Lesson: never let GET requests change server state — GET must be safe and idempotent.',
        'This is why REST conventions matter for security, not just tidiness.',
      ],
    },
    intermediate: {
      label: 'Intermediate — synchronizer (double-submit) token defense',
      lang: 'js',
      code: `// Server issues a random token in the page and in a cookie\n// Client echoes it back in a header; server compares the two\nasync function postWithCsrf(url, body) {\n  const token = document.cookie\n    .split('; ')\n    .find((c) => c.startsWith('csrf='))\n    ?.split('=')[1]\n  return fetch(url, {\n    method: 'POST',\n    credentials: 'include',\n    headers: { 'X-CSRF-Token': token, 'Content-Type': 'application/json' },\n    body: JSON.stringify(body),\n  })\n}`,
      explanation: [
        'The server places an unguessable token both in a readable cookie and expects it echoed in a custom header.',
        'A cross-origin attacker cannot read the victim\'s cookie value (different origin) and cannot set custom headers without a preflight, so it cannot reproduce the token.',
        'The server rejects any request whose header token does not match the cookie token.',
        'This "double-submit" pattern needs no server-side session storage — the match itself proves same-origin intent.',
      ],
    },
    advanced: {
      label: 'Advanced — Express anti-CSRF middleware',
      lang: 'js',
      code: `import crypto from 'node:crypto'\n\nfunction issueCsrf(req, res, next) {\n  if (!req.cookies.csrf) {\n    const token = crypto.randomBytes(32).toString('hex')\n    res.cookie('csrf', token, { sameSite: 'strict', secure: true })\n  }\n  next()\n}\n\nfunction verifyCsrf(req, res, next) {\n  const cookieToken = req.cookies.csrf\n  const headerToken = req.get('X-CSRF-Token')\n  if (!cookieToken || cookieToken !== headerToken) {\n    return res.status(403).json({ error: 'CSRF validation failed' })\n  }\n  next()\n}\n\napp.use(issueCsrf)\napp.post('/transfer', verifyCsrf, transferHandler)`,
      explanation: [
        'issueCsrf seeds a random token cookie on first visit using a cryptographically strong RNG.',
        'verifyCsrf runs only on state-changing routes and requires the header to match the cookie.',
        'SameSite=strict adds a second layer so the cookie is not even sent on cross-site navigation.',
        'Constant-time comparison (crypto.timingSafeEqual) would harden this further against timing attacks.',
      ],
    },
    realProject: {
      label: 'Real project — Axios interceptor in a Vue SPA',
      lang: 'js',
      code: `// main.ts — attach CSRF token to every mutating request\nimport axios from 'axios'\n\nfunction getCookie(name) {\n  return document.cookie\n    .split('; ')\n    .find((c) => c.startsWith(name + '='))\n    ?.split('=')[1]\n}\n\naxios.interceptors.request.use((config) => {\n  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {\n    config.headers['X-CSRF-Token'] = getCookie('csrf')\n  }\n  config.withCredentials = true\n  return config\n})`,
      explanation: [
        'A single interceptor centralizes CSRF protection so individual components never forget it.',
        'It only adds the token on mutating verbs; safe GETs do not need it.',
        'withCredentials ensures the session cookie is sent for the same-origin / configured API.',
        'Frameworks like Django, Rails, and Laravel ship this cookie+header convention out of the box; Vue/React just relay it.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is CSRF in one sentence?',
      answer: 'CSRF tricks a logged-in user\'s browser into sending an unwanted state-changing request to a site they are authenticated with, abusing the cookies the browser sends automatically.',
      explanation: 'A strong answer names the "automatic credentials" mechanism — that is the root cause.',
    },
    {
      level: 'beginner',
      question: 'Does CSRF let the attacker read the response or steal the cookie?',
      answer: 'No. CSRF is "write-only" / blind — the same-origin policy stops the attacker from reading the response, and they never see the cookie. They can only trigger an action.',
      explanation: 'Distinguishing CSRF (forge a request) from XSS (run script, read data) shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'How does a synchronizer (anti-CSRF) token stop the attack?',
      answer: 'The server embeds an unguessable token tied to the session and requires it back on each request. A cross-origin attacker cannot read or guess the token, so the forged request is missing or has the wrong token and is rejected.',
      explanation: 'The key is unguessability + the attacker\'s inability to read cross-origin responses/cookies.',
    },
    {
      level: 'intermediate',
      question: 'What does the SameSite cookie attribute do for CSRF?',
      answer: 'SameSite=Lax/Strict tells the browser not to send the cookie on cross-site requests (Strict) or on cross-site subrequests but allowing top-level GET navigations (Lax). This removes the ambient credential that CSRF depends on.',
      explanation: 'Mentioning Lax is the modern browser default and that it still allows top-level navigations is a senior nuance.',
    },
    {
      level: 'advanced',
      question: 'Are token-based (Authorization: Bearer) APIs vulnerable to CSRF?',
      answer: 'Generally no, IF the token is stored where the browser does not auto-attach it (e.g. memory/localStorage read by JS and sent as an explicit header). With no auto-sent credential there is nothing to forge. But if the token lives in a cookie, CSRF risk returns.',
      explanation: 'The principle: CSRF requires AMBIENT/automatic credentials. Explicit headers break the attack but reintroduce XSS exposure — a real tradeoff.',
    },
    {
      level: 'senior',
      question: 'Why is double-submit cookie sometimes weaker than a server-stored synchronizer token?',
      answer: 'Double-submit relies on the attacker being unable to set the cookie. But subdomain takeover or an XSS on a sibling subdomain can let an attacker write a cookie for the parent domain, forging a matching token. Signing/binding the token to the session (HMAC of the session id) mitigates this.',
      explanation: 'Senior signal: knowing the cookie-scoping and subdomain trust weaknesses, not just the happy path.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is CSRF different from XSS?',
    'Why should GET requests never change state?',
    'What is the difference between SameSite=Lax and SameSite=Strict?',
    'Can CORS by itself prevent CSRF? (No — CORS governs reading responses, not sending requests)',
    'How do you protect a login form, which has no session yet, from login CSRF?',
    'Why do custom headers (X-Requested-With) provide CSRF protection on JSON APIs?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Believing CORS or HTTPS alone stops CSRF.',
      why: 'CORS only restricts who can READ a cross-origin response; the forged request is still SENT and executed. HTTPS only encrypts transport.',
      fix: 'Use anti-CSRF tokens and/or SameSite cookies; CORS is complementary, not a CSRF defense.',
    },
    {
      mistake: 'Using state-changing GET endpoints (e.g. /logout, /delete via GET).',
      why: 'GET requests can be triggered by an <img>, <link>, or prefetch with zero user interaction.',
      fix: 'Reserve GET for safe reads; require POST/PUT/DELETE plus a token for any mutation.',
    },
    {
      mistake: 'Putting the CSRF token in a place the attacker can read or in the URL.',
      why: 'Tokens in referrer-leaking URLs or in attacker-readable storage defeat their unguessability.',
      fix: 'Send tokens in a custom header or hidden form field, and bind them to the session.',
    },
    {
      mistake: 'Protecting only some mutating endpoints.',
      why: 'Attackers target the weakest one; a single unprotected state-changer (e.g. change-email) can cascade to account takeover.',
      fix: 'Apply CSRF protection globally to all state-changing routes via middleware, with explicit opt-out only for stateless public APIs.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Backend', detail: 'Django, Rails, Laravel, and Spring Security ship synchronizer-token CSRF middleware enabled by default for form-based session apps; you opt out per route only for stateless APIs.' },
    { area: 'Vue', detail: 'SPAs reading a CSRF cookie set by the backend and echoing it via an Axios interceptor; Nuxt server routes commonly pair SameSite cookies with a double-submit token.' },
    { area: 'React', detail: 'Apps using cookie sessions read the CSRF token from a meta tag or cookie and attach it on mutating fetches; Next.js API routes often combine SameSite=Lax with origin checks.' },
    { area: 'Node.js', detail: 'Express apps use the modern csrf-csrf / @fastify/csrf-protection libraries plus Origin/Referer header validation as a defense-in-depth check on POST handlers.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'CSRF tokens add negligible per-request overhead — a string compare and a few bytes in a header.',
      'SameSite cookies are a pure browser-side enforcement with zero server cost.',
    ],
    bad: [
      'Server-stored synchronizer tokens require session lookup/storage, adding state to otherwise stateless services.',
      'Rotating tokens too aggressively can break multi-tab UX and trigger spurious 403s, hurting perceived performance.',
    ],
    optimizations: [
      'Prefer stateless double-submit (HMAC-signed) tokens to avoid server-side session storage at scale.',
      'Lean on SameSite=Lax as the cheap first line of defense and reserve tokens for genuinely sensitive actions.',
      'Cache nothing token-bearing at the CDN; mark such responses no-store to avoid leaking tokens.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Account takeover via forged change-email/change-password requests on unprotected endpoints.',
      'Login CSRF: forcing a victim into the attacker\'s account so the victim\'s later actions are captured.',
      'Subdomain/cookie-scope abuse can let attackers forge double-submit tokens if the token is not session-bound.',
    ],
    bestPractices: [
      'Default to SameSite=Lax (or Strict for sensitive cookies) and HTTPS-only, HttpOnly session cookies.',
      'Require an anti-CSRF token (synchronizer or signed double-submit) on every state-changing request.',
      'Validate the Origin/Referer header server-side as defense-in-depth.',
      'Never use GET for mutations; bind tokens to the session and use constant-time comparison.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['cors', 'storage-apis', 'fetch-api', 'event-system'],
    nextConcepts: ['xss', 'csp', 'secure-token-storage', 'clickjacking'],
    dependencyNote:
      'CSRF lives in the web-security cluster: it relies on understanding how cookies and the same-origin policy work (CORS, storage), and it pairs with XSS, CSP, and secure token storage to form a complete client-security mental model.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a victim logged into bank.com with a cookie.',
      'Draw attacker.com with a hidden auto-submitting form pointing at bank.com.',
      'Show the arrow from the browser to bank.com and label "cookie attached automatically".',
      'Mark bank.com as accepting it because the session is valid → action executed.',
      'Now add a "CSRF token" box the attacker cannot read, and show the request being rejected without it.',
      'Say: "CSRF abuses automatic credentials; the fix is to require unguessable proof of intent the cross-origin attacker cannot supply."',
    ],
    diagram: `  attacker.com ──forged POST──► bank.com
                  (browser adds cookie ✔)
                          │
            no CSRF token │  ──► 403 REJECTED
            valid token   │  ──► 200 (only real UI has it)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'CSRF tricks a logged-in user\'s browser into sending a state-changing request to a site they\'re authenticated with, abusing the cookie the browser attaches automatically. The attacker never reads the response or the cookie — it\'s a blind, write-only attack. Defend with anti-CSRF tokens (synchronizer or double-submit) that a cross-origin attacker can\'t read or guess, plus SameSite cookies and Origin checks. Never let GET change state.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'CSRF, Cross-Site Request Forgery, is a confused-deputy attack. The victim is logged into a target site, so the browser holds a session cookie for it. The attacker lures the victim to a malicious page that quietly fires a request — via a hidden auto-submitting form, an image, or fetch — at the target. Because browsers attach cookies to a domain automatically regardless of which site initiated the request, the target receives valid credentials and executes the action as if the user intended it. Crucially, this is blind: the same-origin policy stops the attacker from reading the response or the cookie, so CSRF can only trigger writes, not steal data — that distinguishes it from XSS. The root cause is ambient authority: credentials sent automatically. The defenses follow directly. First, require an unguessable anti-CSRF token — either a server-stored synchronizer token or a signed double-submit cookie — that the genuine UI includes but a cross-origin attacker cannot read or reproduce. Second, set cookies to SameSite=Lax or Strict so the browser withholds them on cross-site requests. Third, validate the Origin/Referer header. And never use GET for state changes, since GET can be triggered with zero interaction. Token-based APIs that send credentials in an explicit header rather than a cookie are largely immune, because there is no automatic credential to forge.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Synchronizer tokens give strong guarantees but add server-side state; double-submit is stateless but weaker against cookie-injection unless HMAC-bound to the session.',
      'Moving credentials out of cookies into Authorization headers kills CSRF but exposes you to XSS token theft — you trade one threat class for another.',
    ],
    edgeCases: [
      'Login CSRF: there is no session yet, so you must protect the login form itself (pre-session token).',
      'SameSite=Lax still sends cookies on top-level GET navigations, so a state-changing GET remains exploitable even with Lax.',
      'Subdomain takeover lets an attacker set a parent-domain cookie, forging a double-submit token.',
      'JSON-only APIs that require Content-Type: application/json get incidental protection because simple HTML forms cannot set that content type, triggering a CORS preflight.',
    ],
    runtimeBehavior: [
      'The browser, not your code, decides whether to attach a cookie — based on cookie scope and SameSite — before your server ever sees the request.',
      'A custom header like X-CSRF-Token forces a CORS preflight on cross-origin requests, which the attacker\'s origin will fail.',
      'Referer/Origin can be absent (privacy settings, some proxies), so treat missing-header policy carefully to avoid false rejects.',
    ],
    scalability: [
      'Stateless signed tokens scale horizontally with no shared session store, important behind load balancers.',
      'Per-request token rotation increases security but multiplies cache-busting and multi-tab coordination cost.',
    ],
    productionConcerns: [
      'Misconfigured SameSite=None without Secure is rejected by modern browsers, silently breaking auth — monitor for it.',
      'CDN/edge caching of token-bearing pages can leak one user\'s token to another; mark them no-store.',
      'Audit every mutating endpoint; a single forgotten one (e.g. an internal admin action) is enough for takeover.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'CSRF = forge a state-changing request from a logged-in victim\'s browser.',
    'Root cause: cookies sent automatically (ambient authority).',
    'Blind/write-only: attacker cannot read the response or the cookie (SOP).',
    'Different from XSS: XSS runs script & reads data; CSRF only triggers actions.',
    'Defense 1: anti-CSRF token (synchronizer or signed double-submit).',
    'Defense 2: SameSite=Lax/Strict cookies.',
    'Defense 3: validate Origin/Referer header.',
    'Never use GET to change state.',
    'CORS does NOT prevent CSRF (it governs reading responses).',
    'Bearer-token-in-header APIs are largely CSRF-immune (no auto credential).',
    'Custom headers force a preflight the attacker origin fails.',
    'Login CSRF needs a pre-session token on the login form.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function that reads a cookie named "csrf" and returns its value, or null if absent.',
      hint: 'Split document.cookie on "; " and find the entry.',
      solution: {
        lang: 'js',
        code: `function getCsrfToken() {\n  const entry = document.cookie\n    .split('; ')\n    .find((c) => c.startsWith('csrf='))\n  return entry ? entry.split('=')[1] : null\n}`,
        explanation: [
          'document.cookie is a single string of "name=value" pairs separated by "; ".',
          'find locates the csrf entry; if none exists we return null so callers can handle the missing case.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a fetch wrapper that attaches an X-CSRF-Token header on POST/PUT/PATCH/DELETE only, and includes credentials.',
      hint: 'Check the method case-insensitively before adding the header.',
      solution: {
        lang: 'js',
        code: `async function safeFetch(url, { method = 'GET', body } = {}) {\n  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE']\n  const headers = { 'Content-Type': 'application/json' }\n  if (mutating.includes(method.toUpperCase())) {\n    headers['X-CSRF-Token'] = getCsrfToken()\n  }\n  return fetch(url, { method, headers, credentials: 'include', body })\n}`,
        explanation: [
          'Safe verbs (GET/HEAD) do not need a token, so we skip it to avoid leaking it unnecessarily.',
          'credentials: "include" ensures the session cookie is sent for the authenticated request.',
          'Centralizing this in one wrapper means no component can forget the token.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a stateless double-submit verification on the server: compare an HMAC-signed token in a header against the session id, in constant time.',
      hint: 'HMAC the session id with a server secret; compare with crypto.timingSafeEqual.',
      solution: {
        lang: 'js',
        code: `import crypto from 'node:crypto'\nconst SECRET = process.env.CSRF_SECRET\n\nfunction signToken(sessionId) {\n  return crypto.createHmac('sha256', SECRET).update(sessionId).digest('hex')\n}\n\nfunction verifyCsrf(req, res, next) {\n  const expected = signToken(req.session.id)\n  const provided = req.get('X-CSRF-Token') || ''\n  const a = Buffer.from(expected)\n  const b = Buffer.from(provided)\n  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {\n    return res.status(403).end()\n  }\n  next()\n}`,
        explanation: [
          'The token is an HMAC of the session id, so it is bound to the session and cannot be forged without the server secret.',
          'No server storage is needed — the signature itself is the proof, making it stateless and horizontally scalable.',
          'timingSafeEqual avoids leaking how many leading bytes matched via response timing; we length-check first because it throws on length mismatch.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You are reviewing an app where /api/delete-account is a GET and there is no CSRF token. Explain the vulnerability and write the minimal HTML that exploits it, then describe the fix.',
      hint: 'A state-changing GET can be triggered by an image tag.',
      solution: {
        lang: 'html',
        code: `<!-- EXPLOIT: just rendering this on any page deletes a logged-in victim's account -->\n<img src="https://app.com/api/delete-account" style="display:none" />\n\n<!-- FIX (server side, pseudo):\n  1. Change the route to POST /api/delete-account\n  2. Require X-CSRF-Token matching the session-bound token\n  3. Set the session cookie SameSite=Strict; Secure; HttpOnly\n  4. Validate the Origin header equals app.com -->`,
        explanation: [
          'Because the action is a GET, an <img> forces the browser to issue it with the victim\'s cookie attached — no click needed.',
          'The fix has layers: move to POST so simple tags cannot trigger it, require an unguessable token, restrict the cookie with SameSite, and verify Origin.',
          'This is the canonical "GET should never mutate" lesson plus defense-in-depth.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'CSRF is a top OWASP risk and one of the clearest tests of whether you understand the difference between authentication (who you are) and intent (what you meant to do). Getting it right protects every authenticated user with a single piece of middleware.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the textbook definition and "how is it different from XSS". Product companies (Zoho, Flipkart, Razorpay) ask you to design the token flow and reason about SameSite. FAANG-level interviews probe double-submit weaknesses, subdomain cookie scope, and the cookie-vs-header credential tradeoff.',
    whatInterviewersExpect:
      'They expect you to name the root cause (automatically-sent credentials), explain that it is blind/write-only, contrast it cleanly with XSS, and lay out a layered defense — tokens, SameSite, Origin checks, and no state-changing GETs.',
  },
}

export default csrf
