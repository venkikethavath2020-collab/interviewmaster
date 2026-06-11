import type { ConceptLesson } from '../../../types/lesson'

const scriptLoading: ConceptLesson = {
  // 1. Concept Summary
  slug: 'script-loading',
  name: 'Script Loading',
  category: 'browser-dom',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'How and when scripts load directly controls how fast a page becomes interactive — the difference between a snappy site and a blank, frozen screen.',
    'A plain `<script>` in the `<head>` blocks HTML parsing and rendering; knowing `async`, `defer`, and module loading is how you fix render-blocking and improve Core Web Vitals.',
    'Misordered scripts cause "X is not defined" errors and race conditions; understanding execution order prevents a whole class of production bugs.',
    'Interviewers ask it because it tests your grasp of the browser parsing pipeline, the event loop ordering of `DOMContentLoaded`/`load`, and module semantics.',
    'Modern apps use `type="module"`, dynamic `import()`, and code splitting — all built on the script-loading model.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Loading scripts is like a teacher reading a story aloud while helpers fetch books — some helpers make the teacher stop and wait, others let her keep reading.',
    story: [
      'Imagine a teacher reading your webpage out loud, word by word, to build the page.',
      'Sometimes she hits a note that says "go get a book and read it RIGHT NOW" — she stops reading the story until that book is fetched and read. That is a normal script: it blocks everything.',
      'With a smarter note (async), a helper quietly fetches the book in the background, but the moment it arrives the teacher pauses to read it.',
      'With the best note (defer), the helper fetches the book in the background AND waits politely until the teacher finishes the whole story before reading the books in order.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'The browser reads your HTML from top to bottom to build the page.',
    'When it meets a plain `<script>`, it stops everything: downloads the script, runs it, and only then keeps building the page. That can make the page appear slow or blank.',
    'Adding `defer` tells the browser to download the script in the background while it keeps building the page, then run scripts in order right before the page is ready.',
    'Adding `async` also downloads in the background but runs the script the instant it arrives, in no guaranteed order — good for independent scripts like analytics.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Script loading is how the browser fetches and executes `<script>` resources during HTML parsing. The behavior is controlled by attributes: a plain script blocks parsing; `async` fetches in parallel and executes as soon as ready (unordered); `defer` fetches in parallel and executes in order after parsing completes; `type="module"` scripts defer by default and support `import`.',
    how: 'You place scripts and choose attributes. `<script src>` (no attr) pauses the parser. `<script defer src>` downloads concurrently and runs in document order just before `DOMContentLoaded`. `<script async src>` downloads concurrently and runs whenever it finishes, possibly out of order. `<script type="module">` is deferred and runs after parsing.',
    why: 'Choosing the right strategy keeps HTML parsing and first paint from stalling, prevents dependency-order bugs, and makes pages interactive sooner.',
    code: {
      label: 'The three loading strategies',
      lang: 'html',
      code: `<!-- 1) Blocking: parser stops, downloads + runs, then resumes -->\n<script src=\"app.js\"></script>\n\n<!-- 2) defer: download in parallel, run IN ORDER after parsing -->\n<script defer src=\"vendor.js\"></script>\n<script defer src=\"app.js\"></script>\n\n<!-- 3) async: download in parallel, run ASAP, order NOT guaranteed -->\n<script async src=\"analytics.js\"></script>\n\n<!-- modules are deferred by default -->\n<script type=\"module\" src=\"main.js\"></script>`,
      explanation: [
        'The first script blocks HTML parsing while it downloads and executes — worst for perceived speed if placed in <head>.',
        '`defer` scripts download alongside parsing and execute in the order they appear, after the DOM is built — ideal for app code with dependencies.',
        '`async` scripts run as soon as each finishes downloading, in unpredictable order — ideal for independent third-party scripts.',
        '`type="module"` is implicitly deferred, runs once, and can `import` other modules.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Script loading defines how the HTML parser handles `<script>` elements. A classic script with no attribute is parser-blocking: the parser halts, fetches the resource, executes it synchronously, then resumes. `async` makes the fetch non-blocking and executes the script as soon as it is available, interrupting parsing and without guaranteed order relative to other scripts. `defer` fetches non-blocking but defers execution until after the document is fully parsed, preserving document order, and runs before `DOMContentLoaded`. Scripts with `type="module"` are deferred by default, evaluated once per module graph, run in strict mode, and support static/dynamic `import`. Inline scripts ignore `async`/`defer` (except module).',

  // 7. Internal Working
  internalWorking: [
    'The HTML parser builds the DOM token by token; when it encounters a `<script>` it consults the element\'s loading attributes.',
    'Classic, no-attribute: the parser pauses, the script is fetched (if external) and executed synchronously on the main thread, then parsing resumes — blocking DOM construction and paint.',
    'With `async`: the fetch is initiated in parallel via the preload scanner; when the bytes arrive the parser is paused to execute the script immediately, so order depends on download completion, not document order.',
    'With `defer`: the fetch runs in parallel during parsing, but execution is queued until parsing finishes; deferred scripts then execute in document order, just before `DOMContentLoaded` fires.',
    'Modules are fetched as a dependency graph (resolving `import`s), deferred by default; each module evaluates once and shares a single instance.',
    'After all deferred/module scripts execute and the DOM is parsed, `DOMContentLoaded` fires; `window.load` fires later once images and subresources finish.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  HTML parse ───────────────────────────────────► DOMContentLoaded
   │           │              │                    │
   │  <script> │  <script     │  <script           │
   │  (block)  │   async>     │   defer>            │
   ▼           ▼              ▼                    ▼
 parse stops  fetch ‖ parse  fetch ‖ parse        run defer
 fetch+run    run ASAP       run AFTER parse       (in order)
 then resume  (any order)    (in order)
                                                  load fires
                                                  after images etc.`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — defer vs async choice',
      lang: 'html',
      code: `<head>\n  <!-- App bundle that touches the DOM and has order deps: defer -->\n  <script defer src=\"/js/vendor.js\"></script>\n  <script defer src=\"/js/app.js\"></script>\n\n  <!-- Independent third party: async -->\n  <script async src=\"https://cdn.example.com/analytics.js\"></script>\n</head>`,
      explanation: [
        'App code goes in `defer` so it downloads early (in <head>) but runs in order after the DOM exists.',
        'vendor.js runs before app.js because defer preserves document order.',
        'Analytics is independent, so `async` lets it run the moment it arrives without waiting.',
        'Putting deferred scripts in <head> is fine and even preferable — the download starts sooner.',
      ],
    },
    intermediate: {
      label: 'Intermediate — waiting for the DOM correctly',
      lang: 'js',
      code: `// In a deferred/module script the DOM is already parsed — safe to query\nconst btn = document.getElementById('go') // exists\n\n// In an async/blocking script that might run early, guard:\nif (document.readyState === 'loading') {\n  document.addEventListener('DOMContentLoaded', init)\n} else {\n  init() // DOM already ready\n}\n\nfunction init() { /* ... */ }`,
      explanation: [
        'Because `defer` and modules execute after parsing, the DOM is guaranteed present — no `DOMContentLoaded` wait needed.',
        'For `async` or head-blocking scripts, the DOM may not exist yet, so you guard on `document.readyState`.',
        '`DOMContentLoaded` fires once the DOM is parsed (before images); `load` waits for all resources.',
        'This pattern avoids the classic "Cannot read property of null" when querying elements too early.',
      ],
    },
    advanced: {
      label: 'Advanced — dynamic import for code splitting',
      lang: 'js',
      code: `// Load a heavy feature only when needed (on demand)\nbutton.addEventListener('click', async () => {\n  const { renderChart } = await import('./chart.js') // network fetch + eval\n  renderChart(data)\n})\n\n// Preload it during idle time without executing yet\nconst link = document.createElement('link')\nlink.rel = 'modulepreload'\nlink.href = './chart.js'\ndocument.head.appendChild(link)`,
      explanation: [
        'Dynamic `import()` returns a promise and fetches+evaluates the module only when called — the basis of code splitting.',
        'This keeps the initial bundle small; the chart code ships only to users who click.',
        '`modulepreload` warms the cache during idle time so the later `import()` is instant.',
        'Bundlers (Vite, webpack) turn `import()` into separate chunks automatically.',
      ],
    },
    realProject: {
      label: 'Real project — Vue/React app entry and lazy routes',
      lang: 'js',
      code: `// index.html (built by Vite) injects the module entry deferred-by-default:\n// <script type=\"module\" src=\"/assets/index-abc123.js\"></script>\n\n// Lazy-load a route component so its code splits into its own chunk\nconst Settings = () => import('./views/Settings.vue') // Vue Router\n// or React:\nconst Settings = React.lazy(() => import('./views/Settings'))`,
      explanation: [
        'Built SPAs ship a `type="module"` entry that is deferred, so the framework boots after the DOM is parsed.',
        'Route-level dynamic `import()` splits each page into its own chunk, loaded on navigation.',
        'This minimizes the initial JS payload, improving Time-to-Interactive.',
        'Vue Router\'s function-component syntax and React\'s `lazy`/`Suspense` both rely on dynamic import.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between `async` and `defer`?',
      answer: 'Both download the script in parallel without blocking parsing. `defer` executes scripts after parsing completes, in document order, just before DOMContentLoaded. `async` executes each script as soon as it finishes downloading, in no guaranteed order, possibly interrupting parsing.',
      explanation: 'Order guarantee and execution timing are the two distinguishing axes — name both.',
    },
    {
      level: 'beginner',
      question: 'Why does a plain `<script>` in the `<head>` slow down a page?',
      answer: 'It is parser-blocking: the browser stops building the DOM, downloads and runs the script, then resumes — delaying first paint and interactivity.',
      explanation: 'Connecting blocking to delayed render shows understanding of the parsing pipeline.',
    },
    {
      level: 'intermediate',
      question: 'When would you use `async` over `defer`?',
      answer: 'Use `async` for independent scripts with no dependencies and no need for DOM/order — like analytics or ad tags — so they run as soon as available. Use `defer` for app code that has ordering dependencies and needs the parsed DOM.',
      explanation: 'The independence/order criterion is the practical decision rule.',
    },
    {
      level: 'intermediate',
      question: 'How do `type="module"` scripts differ from classic scripts?',
      answer: 'Modules are deferred by default, run in strict mode, have their own scope (no implicit globals), are evaluated once per module graph even if imported many times, and support static/dynamic `import`. They are also fetched with CORS.',
      explanation: 'Listing defer-by-default, single evaluation, and module scope demonstrates real module knowledge.',
    },
    {
      level: 'advanced',
      question: 'What is dynamic `import()` and why is it useful?',
      answer: 'It is a function-like form of import that returns a promise and loads a module on demand at runtime, enabling code splitting and lazy loading so the initial bundle stays small. Bundlers emit a separate chunk per dynamic import.',
      explanation: 'Tying dynamic import to code splitting and performance is the expected advanced answer.',
    },
    {
      level: 'senior',
      question: 'How does script loading affect Core Web Vitals, and how do you optimize it?',
      answer: 'Render-blocking scripts delay FCP/LCP and long script execution hurts INP/TBT. Optimize by deferring non-critical JS, using async for independent third-party scripts, code-splitting with dynamic import, preloading critical chunks (`modulepreload`/`preload`), and minimizing main-thread work. Inline critical and defer the rest.',
      explanation: 'Mapping loading strategy to specific CWV metrics and concrete optimizations is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'In what order do multiple `defer` scripts run? (document order)',
    'Do `async`/`defer` affect inline scripts? (no, except modules)',
    'When does `DOMContentLoaded` fire relative to defer scripts? (after they run)',
    'What is the difference between `DOMContentLoaded` and `load`?',
    'How does the preload scanner speed up script fetching?',
    'How do bundlers use dynamic `import()` for code splitting?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting blocking `<script>` tags in the `<head>` for app code.',
      why: 'It stalls HTML parsing and first paint, making the page feel slow.',
      fix: 'Use `defer` (or modules) so downloads happen in parallel but execute after parsing.',
    },
    {
      mistake: 'Using `async` for scripts that depend on order or the DOM.',
      why: '`async` execution order is unpredictable and may run before the DOM is ready.',
      fix: 'Use `defer` for ordered, DOM-dependent app scripts; reserve `async` for independent ones.',
    },
    {
      mistake: 'Querying the DOM in a head script before it exists.',
      why: 'A blocking/async head script may run before the target elements are parsed, returning null.',
      fix: 'Use `defer`/module (DOM guaranteed) or guard with `DOMContentLoaded`/`readyState`.',
    },
    {
      mistake: 'Assuming `async`/`defer` work on inline scripts.',
      why: 'Those attributes only apply to external (`src`) classic scripts; inline classic scripts ignore them.',
      fix: 'Use an external file with `defer`, or `type="module"` for deferred inline behavior.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vite injects a deferred `type="module"` entry; route-level `() => import()` splits pages into chunks loaded on navigation, keeping the initial payload small.' },
    { area: 'React', detail: 'CRA/Next/Vite emit module bundles; `React.lazy(() => import())` with `Suspense` lazy-loads components, and Next.js automatically code-splits per route.' },
    { area: 'Node.js', detail: 'Build tooling (Vite/webpack/esbuild) runs in Node to produce optimally-ordered, hashed, code-split script bundles and inject the right `defer`/`module` tags.' },
    { area: 'Backend', detail: 'Server-rendered pages add `defer` to hydration scripts and `preload`/`modulepreload` hints in the response so the browser fetches critical JS early without blocking the HTML stream.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      '`defer`/module loading lets downloads overlap parsing, improving first paint and TTI.',
      'Code splitting via dynamic import ships less JS upfront, reducing parse/eval time.',
    ],
    bad: [
      'Blocking head scripts delay FCP/LCP and freeze the main thread during execution.',
      'Many small async scripts can cause unpredictable ordering and layout shifts.',
    ],
    optimizations: [
      'Defer non-critical JS; async only truly independent third-party scripts.',
      'Split bundles with dynamic `import()` and preload critical chunks (`modulepreload`).',
      'Minimize and compress scripts; remove unused code (tree-shaking).',
      'Avoid long synchronous work on load; break up tasks to protect INP.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Loading third-party scripts gives them full access to the page (DOM, cookies accessible to JS) — a supply-chain risk.',
      'A compromised CDN can inject malicious code through an `async`/`defer` script.',
    ],
    bestPractices: [
      'Use Subresource Integrity (`integrity` + `crossorigin`) to verify third-party script hashes.',
      'Apply a Content-Security-Policy to restrict allowed script sources.',
      'Self-host or pin critical dependencies and audit third-party scripts you load.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'browser-rendering-pipeline'],
    nextConcepts: ['es-modules', 'dynamic-imports', 'code-splitting-lazy-loading', 'tree-shaking', 'core-web-vitals'],
    dependencyNote:
      'Script loading sits between the browser-rendering-pipeline and the module system; understanding it unlocks es-modules, dynamic-imports, and code-splitting, and is essential for optimizing core-web-vitals.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a horizontal timeline of HTML parsing left to right.',
      'Mark a blocking script: parsing stops, fetch+run, then resumes.',
      'Mark an async script: fetch overlaps parsing, runs ASAP (any order).',
      'Mark defer scripts: fetch overlaps parsing, run in order AFTER parse.',
      'Place DOMContentLoaded after defer scripts, and load after images.',
      'Say: "defer = ordered + after parse (app code); async = unordered ASAP (independent); modules are deferred by default."',
    ],
    diagram: `  parse ──█(block)──── parse ──── DCL ── load
            fetch+run
  parse ════════════════ (async fetch ‖) run ASAP
  parse ════════════════ (defer fetch ‖) ── run in order → DCL`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A plain `<script>` blocks HTML parsing — bad in the head. `defer` downloads in parallel and runs scripts in document order after parsing, right before DOMContentLoaded — use it for app code with dependencies. `async` downloads in parallel and runs each ASAP in no order — use it for independent third-party scripts like analytics. `type="module"` is deferred by default, runs once, in strict mode, with import support. Dynamic `import()` loads modules on demand for code splitting. Choose loading strategy to protect first paint and Core Web Vitals.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Script loading is about how and when the browser fetches and runs your JavaScript while it parses HTML, and it has a big impact on performance. A plain script tag is parser-blocking: the browser stops building the DOM, downloads and executes the script, then resumes — which is why a blocking script in the head delays first paint and makes pages feel slow. The `defer` attribute fixes this for app code: the script downloads in parallel with parsing but executes only after the DOM is fully parsed, and multiple deferred scripts run in document order, right before DOMContentLoaded — so dependencies are preserved and the DOM is guaranteed to exist. The `async` attribute also downloads in parallel but executes each script as soon as it arrives, in no guaranteed order, which is perfect for independent third-party scripts like analytics that don\'t depend on anything. Scripts with `type="module"` are deferred by default, run in strict mode with their own scope, evaluate once per graph, and support import. For larger apps I lean on dynamic `import()` to code-split and lazy-load — for example route components — so the initial bundle stays small and Time-to-Interactive improves. Practically, I defer or split non-critical JS, async the truly independent stuff, preload critical chunks, and for third-party scripts add Subresource Integrity and a CSP.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'async maximizes early execution but sacrifices ordering and can interrupt parsing; defer guarantees order at the cost of running later.',
      'Aggressive code splitting reduces initial payload but adds request waterfalls; preloading critical chunks offsets this.',
    ],
    edgeCases: [
      'async/defer are ignored on inline classic scripts (only external src), but inline module scripts ARE deferred.',
      'Dynamically inserted scripts default to async behavior unless you set `script.async = false`.',
      'Modules are fetched with CORS; missing headers cause cross-origin module load failures.',
      'A throwing module aborts evaluation of dependents in the graph.',
    ],
    runtimeBehavior: [
      'The preload scanner discovers and prefetches script URLs even while the main parser is blocked.',
      'Deferred scripts execute in document order regardless of which finished downloading first.',
      'DOMContentLoaded waits for deferred/module scripts; window.load additionally waits for images and subresources.',
    ],
    scalability: [
      'For large apps, route-based and component-based splitting plus shared-vendor chunks keep per-page JS bounded.',
      'HTTP/2 multiplexing makes many small chunks viable, but excessive granularity adds overhead — tune chunk sizes.',
    ],
    productionConcerns: [
      'Render-blocking third-party tags are a recurring CWV regression — audit and async/defer them.',
      'Supply-chain risk from CDN scripts — enforce SRI and CSP.',
      'Chunk-loading failures (stale hashed filenames after deploy) need retry/refresh handling for SPAs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Plain `<script>` = parser-blocking (fetch+run, then resume).',
    '`defer` = parallel fetch, run AFTER parse, IN ORDER, before DOMContentLoaded.',
    '`async` = parallel fetch, run ASAP, NO order guarantee.',
    'Use defer for app/dependent code; async for independent third-party.',
    '`type="module"` = deferred by default, strict mode, own scope, run once.',
    'async/defer ignored on inline classic scripts (external only).',
    'Dynamically inserted scripts default to async (set script.async=false to order).',
    'Dynamic `import()` → promise → code splitting / lazy load.',
    'DOMContentLoaded after defer/modules; load after images too.',
    'Optimize CWV: defer/split JS, preload critical, minimize main-thread work.',
    'Third-party scripts: use SRI + CSP.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given vendor.js then app.js (app depends on vendor) plus an independent analytics.js, write the correct script tags.',
      hint: 'defer preserves order; async for independent.',
      solution: {
        lang: 'html',
        code: `<script defer src=\"vendor.js\"></script>\n<script defer src=\"app.js\"></script>\n<script async src=\"analytics.js\"></script>`,
        explanation: [
          'Both app scripts use `defer` so they run in order after parsing.',
          'analytics is independent, so `async` runs it as soon as it downloads.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a guard so an init function runs whether the script loaded before or after the DOM was parsed.',
      hint: 'Check document.readyState.',
      solution: {
        lang: 'js',
        code: `function onReady(fn) {\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', fn, { once: true })\n  } else {\n    fn() // DOM already parsed\n  }\n}\nonReady(init)`,
        explanation: [
          '`readyState === "loading"` means the DOM is not yet parsed, so wait for DOMContentLoaded.',
          'Otherwise the DOM is ready and we call immediately.',
          '`{ once: true }` auto-removes the listener after firing.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Lazy-load a heavy module only on first button click, and only once even if clicked repeatedly.',
      hint: 'Cache the import() promise.',
      solution: {
        lang: 'js',
        code: `let modPromise = null\nbutton.addEventListener('click', async () => {\n  modPromise = modPromise || import('./heavy.js')\n  const { run } = await modPromise\n  run()\n})`,
        explanation: [
          'Dynamic `import()` fetches+evaluates the module on demand.',
          'Caching the promise ensures the module is fetched/evaluated only once across clicks.',
          'Subsequent clicks await the already-resolved promise instantly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write `loadScript(src)` that injects a script tag, resolves a promise on load and rejects on error, loading the same src only once.',
      hint: 'Cache by src; use onload/onerror.',
      solution: {
        lang: 'js',
        code: `const cache = new Map()\nfunction loadScript(src) {\n  if (cache.has(src)) return cache.get(src)\n  const p = new Promise((resolve, reject) => {\n    const s = document.createElement('script')\n    s.src = src\n    s.async = true\n    s.onload = () => resolve()\n    s.onerror = () => reject(new Error('Failed to load ' + src))\n    document.head.appendChild(s)\n  })\n  cache.set(src, p)\n  return p\n}`,
        explanation: [
          'A dynamically inserted script defaults to async, so we set it explicitly for clarity.',
          '`onload`/`onerror` convert the load lifecycle into a promise.',
          'Caching the promise by `src` dedupes concurrent and repeat loads.',
          'This is the standard pattern for loading SDKs (maps, payments) on demand.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Script loading is where JavaScript meets performance. Knowing async vs defer, module semantics, and dynamic import lets you make pages fast and avoid maddening ordering bugs — skills visible in every code review.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "difference between async and defer". Product companies (Zoho, Flipkart, Razorpay) ask about module loading, dynamic import, and how to keep bundles small. FAANG-level interviews tie it to Core Web Vitals, the preload scanner, and code-splitting strategy.',
    whatInterviewersExpect:
      'They expect a crisp async-vs-defer explanation (order + timing), why blocking scripts hurt rendering, module defer-by-default semantics, and the use of dynamic `import()` for code splitting — bonus for connecting choices to CWV.',
  },
}

export default scriptLoading
