import type { ConceptLesson } from '../../../types/lesson'

const fetchApi: ConceptLesson = {
  // 1. Concept Summary
  slug: 'fetch-api',
  name: 'Fetch API',
  category: 'async',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'fetch is the standard, built-in way to make HTTP requests in browsers (and modern Node) — it replaced XMLHttpRequest and underpins almost all data loading.',
    'It returns a Promise, so it is the most common real-world place you apply Promises and async/await.',
    'Interviewers ask about it to test practical async skills plus the subtle gotchas: fetch does not reject on 404/500, you must call .json(), and CORS rules apply.',
    'Misunderstanding it causes real bugs — treating HTTP errors as successes, forgetting to check res.ok, double-reading the body, and uncancelled requests.',
    'It pairs with AbortController for cancellation/timeouts, streams for large responses, and is the foundation for libraries like axios and React Query.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'fetch is like mailing a letter to a shop asking for something, and getting a reply envelope back that you still have to open to read what is inside.',
    story: [
      'Imagine you write a letter to a toy shop asking "do you have this toy?" and you drop it in the mailbox.',
      'You do not stand at the mailbox waiting; you go play, and later a reply envelope arrives.',
      'But the envelope itself is not the answer — you still have to OPEN it and read the note inside to find out what the shop said.',
      'fetch works like that: you send a request, and you get back a "reply envelope" (the response). Even if the shop wrote "sorry, sold out", that still counts as getting a reply — so you have to open it and check the message, not just assume a reply means good news.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Web pages often need data from a server — a list of products, a user profile. fetch is the built-in function that asks a server for that data over HTTP.',
    'fetch returns a Promise that resolves to a Response object. The Response is like a sealed envelope: it tells you the status (did it work?) but you still call a method like .json() to actually read the body.',
    'A surprising rule: fetch only fails (rejects) if the network itself breaks. If the server replies "404 Not Found" or "500 Error", that is still a successful reply, so you must check response.ok yourself.',
    'You can also send data (POST), add headers, and cancel requests. Reading the body is itself asynchronous, so it returns another Promise.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Fetch API is a Promise-based interface for making HTTP requests. fetch(url, options) returns a Promise that resolves to a Response object representing the HTTP response headers and status; you then call a body method (.json(), .text(), .blob()) which returns another Promise for the parsed body.',
    how: 'Call fetch with a URL and optional config (method, headers, body, signal, credentials). It resolves to a Response as soon as the headers arrive. Check response.ok (status 200-299) before reading the body. The body is a stream that can be read ONCE via .json()/.text()/etc. Errors only reject on network failure or abort, so HTTP error statuses must be handled manually.',
    why: 'It is the native, dependency-free way to talk to servers, integrates cleanly with async/await, supports cancellation via AbortController, and gives fine control over headers, methods, and credentials.',
    code: {
      label: 'GET and POST with fetch',
      lang: 'js',
      code: `// GET\nasync function getUser(id) {\n  const res = await fetch('/api/users/' + id)\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return res.json() // returns a Promise for the parsed body\n}\n\n// POST with JSON body\nasync function createUser(data) {\n  const res = await fetch('/api/users', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data),\n  })\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return res.json()\n}`,
      explanation: [
        'fetch resolves to a Response once the headers arrive — not the body yet.',
        'res.ok is true only for 2xx statuses; you must check it because fetch does not reject on 4xx/5xx.',
        'res.json() reads and parses the body and itself returns a Promise.',
        'For POST you set method, a Content-Type header, and a stringified body.',
        'JSON.stringify converts the JS object into the JSON string the server expects.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Fetch API is a modern, Promise-based browser/Node interface (built on the WHATWG Fetch standard) for performing HTTP(S) requests. fetch(resource, init) returns a Promise that fulfills with a Response object as soon as the response headers are available; it rejects only on network errors, CORS failures, or request abortion — not on HTTP error status codes. The Response exposes status/ok/headers and a readable body stream consumable exactly once via methods like json(), text(), blob(), arrayBuffer(), or formData(). Requests are configured via the init object (method, headers, body, mode, credentials, cache, signal). Cancellation is achieved by passing an AbortController signal.',

  // 7. Internal Working
  internalWorking: [
    'fetch builds a Request from the URL and init options and hands it to the browser\'s networking layer (or Node\'s undici), which performs DNS, connection, TLS, and the HTTP exchange off the main thread.',
    'For cross-origin requests, the browser applies CORS: it may send a preflight OPTIONS request and checks Access-Control-Allow-* response headers before exposing the response to JS.',
    'As soon as the response status line and headers arrive, the returned Promise fulfills with a Response object — the body may still be streaming in.',
    'The Response body is a ReadableStream; calling .json()/.text() consumes that stream asynchronously and returns a Promise for the parsed result. The body can be read only once (use response.clone() to read twice).',
    'fetch rejects only for network-level failures (DNS, connection reset, CORS rejection, abort) — HTTP statuses like 404/500 still fulfill, so response.ok must be checked in code.',
    'If an AbortController\'s signal is passed and aborted, the fetch Promise rejects with an AbortError and the underlying connection is torn down.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  fetch(url, init)
        │  (network off main thread)
        ▼
  ┌─────────────────────────┐   resolves when HEADERS arrive
  │ Promise<Response>        │──────────────► Response { ok, status, headers }
  └─────────────────────────┘                      │  body = ReadableStream
        │ rejects ONLY on                           │  (read ONCE)
        │ network err / CORS / abort                ▼
        │                                   res.json() / .text() / .blob()
        ▼                                          │
   .catch(networkError)                            ▼
                                          Promise<parsed body>

   404 / 500 → still RESOLVES → check res.ok yourself!`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — fetch JSON and check status',
      lang: 'js',
      code: `fetch('https://api.example.com/todos/1')\n  .then(res => {\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return res.json()\n  })\n  .then(todo => console.log(todo.title))\n  .catch(err => console.error('failed:', err.message))`,
      explanation: [
        'fetch returns a Promise resolving to the Response.',
        'res.ok guards against 4xx/5xx, which fetch does NOT treat as rejections.',
        'res.json() parses the body and returns another Promise.',
        'One .catch covers both network failures and the thrown HTTP error.',
      ],
    },
    intermediate: {
      label: 'Intermediate — POST, headers, and credentials',
      lang: 'js',
      code: `async function login(email, password) {\n  const res = await fetch('/api/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email, password }),\n    credentials: 'include', // send/receive cookies (e.g. session)\n  })\n  if (res.status === 401) throw new Error('Invalid credentials')\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return res.json()\n}`,
      explanation: [
        'method, headers, and a stringified body configure a JSON POST.',
        'credentials: "include" tells fetch to send cookies on cross-origin requests (needed for cookie auth).',
        'Specific statuses (401) can be handled distinctly before the generic check.',
        'Always set Content-Type so the server parses the body correctly.',
        'Note: credentials:"include" requires the server to allow it via CORS headers.',
      ],
    },
    advanced: {
      label: 'Advanced — timeout via AbortController and reading streams',
      lang: 'js',
      code: `async function fetchWithTimeout(url, ms = 5000) {\n  const ctrl = new AbortController()\n  const timer = setTimeout(() => ctrl.abort(), ms)\n  try {\n    const res = await fetch(url, { signal: ctrl.signal })\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch (err) {\n    if (err.name === 'AbortError') throw new Error('Request timed out')\n    throw err\n  } finally {\n    clearTimeout(timer)\n  }\n}`,
      explanation: [
        'AbortController provides a signal; passing it to fetch makes the request cancellable.',
        'A timer aborts the controller after ms, causing fetch to reject with an AbortError.',
        'The catch distinguishes a timeout (AbortError) from other failures.',
        'finally clears the timer on every path so it does not fire late or leak.',
        'Modern shortcut: fetch(url, { signal: AbortSignal.timeout(ms) }).',
      ],
    },
    realProject: {
      label: 'Real project — fetch wrapper used across a Vue app',
      lang: 'js',
      code: `// api.js — a thin fetch wrapper used by composables/stores\nexport async function api(path, { method = 'GET', body, signal } = {}) {\n  const res = await fetch('/api' + path, {\n    method,\n    headers: body ? { 'Content-Type': 'application/json' } : undefined,\n    body: body ? JSON.stringify(body) : undefined,\n    credentials: 'include',\n    signal,\n  })\n  if (res.status === 204) return null // no content\n  const data = await res.json().catch(() => null)\n  if (!res.ok) {\n    const err = new Error(data?.message || 'HTTP ' + res.status)\n    err.status = res.status\n    throw err\n  }\n  return data\n}\n\n// usage in a composable\n// const user = await api('/me', { signal: controller.signal })`,
      explanation: [
        'A single wrapper centralizes base path, JSON headers, credentials, and error shaping.',
        '204 No Content is handled before trying to parse a (nonexistent) body.',
        'It attaches res.status to the thrown Error so callers can branch (e.g. redirect on 401).',
        'A signal param lets callers cancel via AbortController (e.g. on component unmount).',
        'This is essentially a minimal axios — most teams build one of these.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Does fetch reject the Promise on a 404 or 500 response?',
      answer: 'No. fetch only rejects on network-level failures (DNS, connection, CORS, abort). HTTP error statuses like 404 and 500 still fulfill with a Response whose ok is false, so you must check response.ok (or response.status) yourself.',
      explanation: 'This is the single most common fetch gotcha and a near-guaranteed interview question.',
    },
    {
      level: 'beginner',
      question: 'Why do you call res.json() and what does it return?',
      answer: 'Because fetch resolves with a Response when the headers arrive, not the parsed body. res.json() reads the body stream and parses it as JSON, returning another Promise that resolves to the JavaScript value.',
      explanation: 'Knowing that the body is read separately and asynchronously (and returns a Promise) shows you understand the two-step nature.',
    },
    {
      level: 'intermediate',
      question: 'How do you send JSON in a POST request with fetch?',
      answer: 'Set method:"POST", headers with Content-Type:"application/json", and body: JSON.stringify(data). The Content-Type header tells the server to parse the body as JSON, and JSON.stringify serializes your object.',
      explanation: 'Forgetting the Content-Type header or JSON.stringify is a frequent practical mistake.',
    },
    {
      level: 'intermediate',
      question: 'How do you cancel a fetch request?',
      answer: 'Create an AbortController, pass controller.signal in the fetch init, and call controller.abort() to cancel. The fetch Promise then rejects with an AbortError. This is used for timeouts and to cancel in-flight requests when a component unmounts or the user navigates away.',
      explanation: 'Cancellation via AbortController is the standard answer and connects to a related concept.',
    },
    {
      level: 'advanced',
      question: 'Why can you read a fetch response body only once, and how do you read it twice?',
      answer: 'The body is a ReadableStream that is consumed when you call .json()/.text()/etc., so a second read throws "body already used". To read it twice, call response.clone() before consuming, which tees the stream into two readable copies.',
      explanation: 'Understanding the body-as-stream model and clone() is an advanced, practical detail.',
    },
    {
      level: 'senior',
      question: 'What is CORS and how does it affect fetch?',
      answer: 'CORS (Cross-Origin Resource Sharing) is a browser security model: for cross-origin requests, the browser may send a preflight OPTIONS request and only exposes the response to JS if the server returns the right Access-Control-Allow-* headers. Without them, fetch rejects with a network/CORS error. credentials:"include" additionally requires Access-Control-Allow-Credentials and a non-wildcard origin.',
      explanation: 'Senior signal: explaining preflight, the server\'s role, and credentials nuances — CORS is server-controlled, not bypassable from the client.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is fetch different from axios? (axios rejects on HTTP errors, auto-JSON, interceptors)',
    'What is a preflight request and when is it triggered?',
    'How do you upload a file with fetch? (FormData body, no manual Content-Type)',
    'How do you stream a large response progressively?',
    'What is the difference between credentials omit/same-origin/include?',
    'How would you implement retry-with-backoff around fetch?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming fetch rejects on HTTP error statuses.',
      why: 'A 404/500 fulfills with ok:false; treating any resolution as success uses error pages as data.',
      fix: 'Always check res.ok (or res.status) and throw/handle non-2xx explicitly.',
    },
    {
      mistake: 'Reading the response body twice (.json() then .text()).',
      why: 'The body is a one-time stream; the second read throws "body already used".',
      fix: 'Read once, or call response.clone() before the first read if you truly need two reads.',
    },
    {
      mistake: 'Setting Content-Type manually when sending FormData.',
      why: 'The browser must set the multipart boundary itself; a manual header breaks the upload.',
      fix: 'Omit Content-Type for FormData bodies and let the browser set it automatically.',
    },
    {
      mistake: 'Not cancelling in-flight requests on unmount/navigation.',
      why: 'Late responses set state on dead components and waste bandwidth; rapid typing causes race conditions.',
      fix: 'Use AbortController and abort on cleanup or before issuing a newer request.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables wrap fetch with a shared api() helper (base URL, JSON headers, error shaping) and pass AbortController signals to cancel requests on component unmount via onUnmounted.' },
    { area: 'React', detail: 'useEffect data loading uses fetch with an AbortController cleanup; libraries like React Query/SWR build caching, deduping, and retries on top of fetch.' },
    { area: 'Node.js', detail: 'Modern Node (18+) ships a global fetch (undici) for server-to-server calls, webhooks, and SSR data fetching, replacing node-fetch/axios for many cases.' },
    { area: 'Backend', detail: 'Service-to-service HTTP uses fetch with timeouts (AbortSignal.timeout), retries with backoff, and structured error handling; credentials/headers carry auth tokens.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'fetch is native, so there is no library bundle cost, and it integrates with HTTP/2 multiplexing and browser caching.',
      'Streaming response bodies lets you process large payloads progressively instead of buffering everything.',
    ],
    bad: [
      'Cross-origin requests with credentials trigger preflight OPTIONS round-trips, adding latency.',
      'Uncancelled or duplicate requests waste bandwidth and cause race conditions (stale responses overwriting fresh ones).',
    ],
    optimizations: [
      'Use the cache option and proper HTTP caching headers to avoid redundant network trips.',
      'Cancel superseded requests with AbortController (e.g. search-as-you-type) to avoid races.',
      'Parallelize independent requests with Promise.all and bound concurrency for large fan-outs.',
      'Prefer streaming for large downloads and consider HTTP/2 to reduce per-request overhead.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Sending tokens in URLs or logging full request bodies can leak secrets.',
      'credentials:"include" sends cookies cross-origin and can expose CSRF surface if not protected.',
      'Trusting response data without validation enables injection if rendered unsafely.',
    ],
    bestPractices: [
      'Send auth tokens in headers (Authorization), not URLs; prefer httpOnly cookies for sessions.',
      'Use CSRF tokens / SameSite cookies when using cookie-based auth with credentials.',
      'Validate and sanitize fetched data before rendering; never innerHTML untrusted responses.',
      'Rely on server-side CORS configuration; never assume the client can relax it.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'async-await', 'json-serialization'],
    nextConcepts: ['abortcontroller', 'async-error-handling', 'cors', 'promise-combinators'],
    dependencyNote:
      'fetch is the practical application of Promises and async/await for HTTP. It depends on JSON serialization for bodies, and leads to AbortController (cancellation), CORS (cross-origin rules), and async-error-handling for robustness.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw fetch(url) → Promise<Response> resolving when HEADERS arrive.',
      'Write "rejects ONLY on network/CORS/abort" and "404/500 still resolve → check res.ok".',
      'Show res.json() as a SECOND Promise that reads the body stream once.',
      'Add an init box: method, headers, body (JSON.stringify), signal, credentials.',
      'Say: "fetch is Promise-based HTTP; check res.ok, read the body separately, and cancel with AbortController."',
    ],
    diagram: `  fetch(url, init) ──► Promise<Response>  (headers arrive)
                          │ res.ok? (2xx)  ← check this!
                          ▼
                     res.json()  ──► Promise<body>  (stream read ONCE)

  rejects only: network / CORS / abort      404,500 → resolves`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'fetch is the native Promise-based HTTP API. fetch(url, init) resolves to a Response when headers arrive; you then call res.json()/.text() to read the body (a one-time stream) which returns another Promise. Crucially, fetch only rejects on network/CORS/abort errors — 404 and 500 still resolve, so you must check res.ok. For POST set method, Content-Type, and JSON.stringify(body). Cancel with AbortController, handle CORS server-side, and validate responses before rendering.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Fetch API is the native, Promise-based way to make HTTP requests. You call fetch with a URL and an optional init object specifying method, headers, body, credentials, and a signal. It returns a Promise that resolves to a Response object as soon as the response headers arrive — not the full body. The single most important gotcha is that fetch only rejects on network-level failures: DNS errors, connection problems, CORS rejections, or an abort. An HTTP 404 or 500 still resolves successfully with a Response whose ok property is false, so you must check res.ok yourself and throw if it is not in the 2xx range — otherwise you treat error pages as valid data. Reading the body is a separate, asynchronous step: res.json(), res.text(), or res.blob() consumes the body, which is a ReadableStream you can read only once; if you need it twice you call response.clone() first. For a POST you set method, a Content-Type header, and JSON.stringify the body. Cancellation is done by passing an AbortController signal and calling abort, which is how you implement timeouts and cancel stale requests, for example on component unmount or search-as-you-type. Cross-origin requests are governed by CORS, which is enforced by the browser and controlled by the server\'s Access-Control headers. In practice most teams wrap fetch in a small helper that centralizes the base URL, JSON handling, error shaping, and credentials.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'fetch is lean and native but lacks built-in features axios provides (HTTP-error rejection, JSON auto-parse, interceptors, progress) — teams reimplement these in a wrapper.',
      'Streaming gives memory efficiency for large bodies but adds complexity vs the simple .json() one-shot read.',
    ],
    edgeCases: [
      'Body can be consumed once; response.clone() tees the stream but doubles memory while both are read.',
      'credentials:"include" with CORS requires a specific (non-wildcard) Access-Control-Allow-Origin and Allow-Credentials:true.',
      'FormData bodies must NOT have a manual Content-Type or the multipart boundary breaks.',
      'Aborting rejects with an AbortError (err.name === "AbortError"), which you typically treat as a non-error cancellation.',
    ],
    runtimeBehavior: [
      'Networking happens off the main thread; the Promise resolves on header arrival while the body streams in.',
      'CORS preflight (OPTIONS) is triggered by non-simple methods/headers and adds a round-trip before the real request.',
      'In Node 18+ fetch is backed by undici; behavior is close to browsers but without CORS (server context).',
    ],
    scalability: [
      'Bound concurrency for large fan-outs (a pool) to avoid exhausting sockets and tripping rate limits.',
      'Leverage HTTP caching (cache option, ETags) and HTTP/2 multiplexing to cut per-request overhead at scale.',
    ],
    productionConcerns: [
      'Always set timeouts (AbortSignal.timeout) so a hung server cannot stall the app.',
      'Cancel superseded requests to avoid stale-response race conditions overwriting fresh data.',
      'Centralize auth, retries with backoff, and error normalization in one wrapper for consistency and observability.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'fetch(url, init) → Promise<Response> (resolves on headers).',
    'Rejects ONLY on network / CORS / abort — NOT on 404/500.',
    'Always check res.ok (2xx) before using the body.',
    'Body methods: json(), text(), blob(), arrayBuffer(), formData().',
    'Body is a stream → read ONCE; clone() to read twice.',
    'POST JSON: method, Content-Type header, JSON.stringify(body).',
    'FormData body: omit Content-Type (browser sets boundary).',
    'Cancel: pass AbortController signal, call abort() → AbortError.',
    'credentials: omit | same-origin | include (cookies).',
    'Cross-origin = CORS, enforced by browser, controlled by server.',
    'Node 18+ has global fetch (undici); axios adds error-reject + interceptors.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write getTodo(id) that fetches /todos/:id and returns the parsed JSON, throwing on non-ok status.',
      hint: 'Check res.ok and return res.json().',
      solution: {
        lang: 'js',
        code: `async function getTodo(id) {\n  const res = await fetch('/todos/' + id)\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return res.json()\n}`,
        explanation: [
          'await fetch resolves to the Response once headers arrive.',
          'res.ok guards against 4xx/5xx since fetch does not reject on them.',
          'res.json() reads and parses the body.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write postJson(url, data) that POSTs JSON, sets the right header, and returns the parsed response.',
      hint: 'method, Content-Type, JSON.stringify.',
      solution: {
        lang: 'js',
        code: `async function postJson(url, data) {\n  const res = await fetch(url, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(data),\n  })\n  if (!res.ok) throw new Error('HTTP ' + res.status)\n  return res.json()\n}`,
        explanation: [
          'method:"POST" plus the Content-Type header tells the server to expect JSON.',
          'JSON.stringify serializes the object into the request body.',
          'The response is checked and parsed like any other fetch.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement search-as-you-type that cancels the previous request whenever a new query is typed.',
      hint: 'Keep a controller; abort it before starting a new fetch.',
      solution: {
        lang: 'js',
        code: `let controller\nasync function search(query) {\n  controller?.abort()          // cancel the previous request\n  controller = new AbortController()\n  try {\n    const res = await fetch('/search?q=' + encodeURIComponent(query), {\n      signal: controller.signal,\n    })\n    if (!res.ok) throw new Error('HTTP ' + res.status)\n    return await res.json()\n  } catch (err) {\n    if (err.name === 'AbortError') return // superseded — ignore\n    throw err\n  }\n}`,
        explanation: [
          'Each new query aborts the in-flight request so only the latest survives.',
          'A fresh AbortController is created per request.',
          'AbortError is swallowed because cancellation is expected, not a real failure.',
          'This prevents stale responses from overwriting newer ones.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build fetchRetry(url, retries) that retries on network failure or 5xx, with exponential backoff, before giving up.',
      hint: 'Loop, await a growing delay, distinguish retryable failures.',
      solution: {
        lang: 'js',
        code: `const delay = ms => new Promise(r => setTimeout(r, ms))\n\nasync function fetchRetry(url, retries = 3) {\n  let lastErr\n  for (let i = 0; i < retries; i++) {\n    try {\n      const res = await fetch(url)\n      if (res.status >= 500) throw new Error('server ' + res.status)\n      if (!res.ok) throw new Error('HTTP ' + res.status) // 4xx: not retried below\n      return await res.json()\n    } catch (err) {\n      lastErr = err\n      const isClientError = /HTTP 4/.test(err.message)\n      if (isClientError || i === retries - 1) break\n      await delay(2 ** i * 200) // 200, 400, 800ms\n    }\n  }\n  throw lastErr\n}`,
        explanation: [
          'Network errors and 5xx are treated as retryable; 4xx are not (client error, retry will not help).',
          'Backoff doubles each attempt (200, 400, 800ms) to avoid hammering the server.',
          'On the last attempt or a client error, it stops and throws the last error.',
          'In production you would add jitter to the delay to avoid synchronized retries.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'fetch is the most-used async API in front-end work and increasingly on the server. Knowing its exact semantics — especially that it does not reject on HTTP errors — and how to cancel, post JSON, and handle CORS marks you as someone who has shipped real data-driven features.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the basics and the "does fetch reject on 404?" trick. Product companies (Zoho, Flipkart, Razorpay) ask you to write a fetch wrapper, implement cancellation/search-as-you-type, and explain CORS. FAANG-level interviews probe streaming, clone(), preflight, and retry/backoff strategies.',
    whatInterviewersExpect:
      'They expect you to know fetch returns a Promise<Response>, that it does not reject on HTTP errors (check res.ok), that the body is read separately and once, how to POST JSON, how to cancel with AbortController, and a working understanding of CORS.',
  },
}

export default fetchApi
