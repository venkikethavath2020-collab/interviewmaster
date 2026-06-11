import type { ConceptLesson } from '../../../types/lesson'

const devtoolsDebugging: ConceptLesson = {
  // 1. Concept Summary
  slug: 'devtools-debugging',
  name: 'DevTools Debugging',
  category: 'errors-debugging',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'DevTools is the microscope for the browser — breakpoints, the call stack, scope inspection, and the network panel let you see exactly what your code is doing instead of guessing.',
    'Debugging with breakpoints (not just console.log) lets you pause, inspect every variable, and step through logic — the single biggest productivity multiplier for finding bugs.',
    'Without DevTools skills you waste hours sprinkling logs, missing the real state, the failing request, the memory leak, or the slow function.',
    'Interviewers ask it to see whether you can methodically diagnose a bug — set a breakpoint, read the call stack, watch an expression — rather than randomly mutating code.',
    'The same tools cover performance profiling, memory snapshots, network inspection, and source-map-mapped stack traces, so it is your one-stop diagnosis kit.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'DevTools is like a pause button and a magnifying glass for a movie — you can freeze any frame and look closely at exactly what every character is holding.',
    story: [
      'Imagine watching a fast cartoon where something goes wrong, but it happens too quickly to see why.',
      'You grab a magic remote that lets you pause the cartoon at any exact moment.',
      'While it is frozen, you can lean in with a magnifying glass and read every label, see what each character has in their hands, and check what just happened a second ago.',
      'Then you press a button to move forward just ONE tiny step at a time and watch what changes. DevTools does this for your program: pause it anywhere, look at every value, and step forward slowly to find exactly where things go wrong.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Browsers come with a built-in toolkit called DevTools (open with F12) that shows what your web page and code are doing.',
    'Instead of guessing, you can set a "breakpoint" — a stop sign in your code — so the program pauses right there and lets you look at all the variables at that moment.',
    'You can then step through the code one line at a time and watch how values change, which makes finding the cause of a bug much easier than just printing messages.',
    'It also has panels to inspect the page structure, see network requests, and measure performance.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'DevTools is the browser\'s built-in debugging suite. Core debugging is in the Sources panel: breakpoints pause execution so you can inspect the call stack, scope variables, and watch expressions, then step through code line by line.',
    how: 'You open DevTools (F12), go to Sources, click a line number (or write a `debugger` statement) to set a breakpoint, reload/trigger the code, and when it pauses you read the Scope/Call Stack panels and use Step Over / Into / Out to advance. The Console, Network, Performance, and Memory panels cover logging, requests, profiling, and leaks.',
    why: 'Pausing and inspecting real state beats console.log because you see every variable, the exact call path, and can change values live — diagnosing bugs faster and more accurately.',
    code: {
      label: 'The debugger statement and conditional pausing',
      lang: 'js',
      code: `function processOrders(orders) {\n  let total = 0\n  for (const order of orders) {\n    if (order.amount < 0) {\n      debugger // pauses here ONLY when an amount is negative\n    }\n    total += order.amount\n  }\n  return total\n}\n\n// In the Console while paused you can type:\n//   order            -> inspect the offending order\n//   total            -> see the running total\n//   order.amount = 0 -> live-edit to test a fix`,
      explanation: [
        'A `debugger` statement triggers a breakpoint when DevTools is open — handy for code that is hard to click.',
        'Wrapping it in a condition is a quick manual "conditional breakpoint" so you only pause on the interesting case.',
        'While paused, the Scope panel shows order, total, and all in-scope variables.',
        'You can type expressions in the Console to read or even mutate live state and continue.',
        'Remove debugger statements before committing — they will halt anyone with DevTools open.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Browser DevTools is an integrated debugging environment exposing the JavaScript engine\'s debugging protocol (e.g. the Chrome DevTools Protocol over V8\'s inspector). The Sources panel sets breakpoints — line, conditional, logpoint, DOM, event-listener, and XHR/fetch — that suspend the engine at a program point, surfacing the live call stack, lexical scope chain, and closure variables for inspection and live evaluation; stepping commands (over/into/out/resume) drive controlled execution. Complementary panels provide network waterfall analysis, CPU flame-chart profiling, allocation/heap-snapshot memory tooling, and source-map-based mapping of minified code back to original sources.',

  // 7. Internal Working
  internalWorking: [
    'DevTools connects to the JS engine via an inspector/debugging protocol; setting a breakpoint registers a pause point with the engine for a specific source location.',
    'When execution reaches a breakpoint, the engine suspends the current thread at that instruction and exposes a snapshot: the call-stack frames, each frame\'s scope chain (local, closure, global), and `this`.',
    'The DevTools UI renders that snapshot — Scope and Call Stack panels read live engine state, and the Console evaluates expressions in the selected frame\'s context.',
    'Step commands instruct the engine to resume until the next line (over), into a called function (into), or until the current function returns (out), re-suspending and refreshing the snapshot each time.',
    'Source maps let DevTools translate positions in minified/transpiled bundles back to original files, so breakpoints and stack traces show your real code.',
    'The Performance panel samples the call stack on a timer to build a flame chart, while Memory takes heap snapshots / allocation timelines that the engine produces from the GC\'s object graph.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SOURCES PANEL (paused at a breakpoint)
   ┌──────────────────────────┬──────────────────────────┐
   │  code (line 12 ● paused) │  CALL STACK               │
   │  function inner() {      │   inner   ◄ current frame │
   │ ●  const x = compute()   │   outer                   │
   │    return x + 1          │   handleClick             │
   │  }                       │   (anonymous)             │
   ├──────────────────────────┼──────────────────────────┤
   │  WATCH                    │  SCOPE                    │
   │   x = <not yet>          │   Local: x, args          │
   │   total = 42             │   Closure: cache, timer   │
   │                          │   Global: window          │
   └──────────────────────────┴──────────────────────────┘
     [Step Over ⤼] [Step Into ↓] [Step Out ↑] [Resume ▶]`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — better console methods than console.log',
      lang: 'js',
      code: `console.table(users)                 // tabular view of an array of objects\nconsole.group('request')             // collapsible group\nconsole.log('url', url)\nconsole.groupEnd()\nconsole.assert(total >= 0, 'total went negative!', { total })\nconsole.count('render')              // how many times this ran\nconsole.time('parse'); /* ... */ console.timeEnd('parse') // duration`,
      explanation: [
        'console.table renders arrays/objects as a readable grid — far clearer than dumping JSON.',
        'group/groupEnd organize related logs so the console is not a wall of text.',
        'console.assert only logs when the condition is false — a cheap inline invariant check.',
        'count and time/timeEnd quantify how often code runs and how long it takes without manual counters.',
      ],
    },
    intermediate: {
      label: 'Intermediate — conditional breakpoints and logpoints',
      lang: 'js',
      code: `// In the Sources panel, right-click a line number to add:\n//  Conditional breakpoint:  pause only when  user.id === 42\n//  Logpoint:                logs without pausing:  'render', count, user.name\n\nfunction render(user, count) {\n  // Right-click this line → \"Add conditional breakpoint\" → count > 100\n  return draw(user)\n}`,
      explanation: [
        'A conditional breakpoint pauses only when an expression is truthy — essential in loops or hot handlers.',
        'A logpoint prints a message every time the line runs WITHOUT pausing — like a console.log you did not have to edit code for.',
        'Both are set from the line-number context menu, so you debug without touching source.',
        'Logpoints are great in production-like builds where you cannot easily add logging.',
      ],
    },
    advanced: {
      label: 'Advanced — event-listener / async breakpoints and the network panel',
      lang: 'js',
      code: `// Sources > Event Listener Breakpoints: tick \"click\" to pause on ANY click handler.\n// Sources > XHR/fetch Breakpoints: pause when a URL containing \"/api/orders\" is requested.\n// Enable \"Async\" stack traces to see across setTimeout / await boundaries.\n\nasync function checkout() {\n  await fetch('/api/orders', { method: 'POST' }) // XHR breakpoint pauses here\n}\n// Network panel: inspect status, timing, headers, payload, and \"Initiator\" (who called it)`,
      explanation: [
        'Event-listener breakpoints pause on a category of events without knowing which handler is bound.',
        'XHR/fetch breakpoints pause when a matching request is about to fire — great for tracing an unexpected API call.',
        'Async stack traces stitch the stack across timers/promises so you see the full causal chain.',
        'The Network panel reveals status, timing waterfall, payloads, and the Initiator that triggered each request.',
      ],
    },
    realProject: {
      label: 'Real project — debugging a Vue/React app with source maps + framework devtools',
      lang: 'js',
      code: `// vite.config.js — keep source maps so breakpoints map to .vue/.tsx source\nexport default { build: { sourcemap: true } }\n\n// In the browser:\n// - Vue Devtools / React Devtools extension: inspect component tree, props, state, events\n// - Performance panel: record a slow interaction, find the long task / expensive render\n// - Memory panel: take 2 heap snapshots around an action, compare to find a leak`,
      explanation: [
        'Source maps let DevTools show your original Vue/TS code instead of the minified bundle when you hit a breakpoint.',
        'Framework devtools add a component layer: inspect props/state and which event caused a re-render.',
        'The Performance panel pinpoints the long task or expensive component responsible for jank.',
        'Comparing heap snapshots before/after an action surfaces detached DOM nodes and leaked closures.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why use breakpoints instead of console.log?',
      answer: 'A breakpoint pauses execution so you can inspect every variable in scope, the full call stack, and `this` at that exact moment, and step through line by line. console.log only shows the values you anticipated logging, at a single point, and requires editing and re-running code.',
      explanation: 'The core advantage is inspecting complete live state and the call path, not just pre-chosen values.',
    },
    {
      level: 'beginner',
      question: 'What does the debugger statement do?',
      answer: 'It programmatically triggers a breakpoint: when DevTools is open, execution pauses at that line. If DevTools is closed it does nothing. It is useful for pausing in code that is hard to click, but should be removed before committing.',
      explanation: 'Tests basic tooling knowledge and the gotcha that it halts anyone with DevTools open.',
    },
    {
      level: 'intermediate',
      question: 'What is a conditional breakpoint and when is it essential?',
      answer: 'A breakpoint that only pauses when an expression evaluates truthy. It is essential inside loops or frequently-called handlers where an unconditional breakpoint would pause on every iteration — you pause only on the specific case (e.g. id === 42).',
      explanation: 'Shows you can debug efficiently in high-frequency code paths.',
    },
    {
      level: 'intermediate',
      question: 'How do source maps help debugging, and what breaks without them?',
      answer: 'Source maps map minified/transpiled bundle positions back to original source, so breakpoints, stack traces, and the Sources panel show your real code/line numbers. Without them you debug unreadable minified output and stack traces point to meaningless locations.',
      explanation: 'Connects build tooling to the debugging experience — a practical, frequently-hit issue.',
    },
    {
      level: 'advanced',
      question: 'How would you find a memory leak using DevTools?',
      answer: 'Use the Memory panel: take a heap snapshot, perform the suspect action repeatedly, take another snapshot, and compare. Look for growing object counts, detached DOM nodes, and retained closures; use the retainers view to find what keeps them alive. Allocation instrumentation on timeline shows where allocations accumulate.',
      explanation: 'Senior-leaning: knowing snapshot comparison, detached nodes, and retainer analysis signals real profiling experience.',
    },
    {
      level: 'senior',
      question: 'Walk through diagnosing a slow interaction with the Performance panel.',
      answer: 'Record while reproducing the interaction, then read the flame chart: identify long tasks (>50ms) blocking the main thread, expand to find the expensive function or layout/recalc, check for forced reflows (style read after write), and look at scripting vs rendering vs painting time. Then fix the hotspot — memoize, chunk/yield, or move work off the main thread.',
      explanation: 'Senior signal: a structured profiling method tied to concrete fixes, not just "open the panel".',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Step Over, Step Into, and Step Out?',
    'How do you debug an unexpected network request? (XHR/fetch breakpoints + Initiator)',
    'How do async stack traces help across await/setTimeout boundaries?',
    'What are logpoints and why are they better than temporary console.logs?',
    'How do you pause when a specific DOM node changes? (DOM breakpoints)',
    'How do you debug code running in production with minified bundles?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying only on console.log for everything.',
      why: 'You only see values you anticipated, at one point, and you must edit/re-run code, which is slow and misses unexpected state.',
      fix: 'Use breakpoints (incl. conditional/logpoints) to inspect full scope and the call stack live.',
    },
    {
      mistake: 'Leaving debugger statements in committed code.',
      why: 'Anyone with DevTools open will have execution halted unexpectedly, breaking the app for testers/users.',
      fix: 'Remove debugger statements before committing; add a lint rule (no-debugger) to enforce it.',
    },
    {
      mistake: 'Debugging minified bundles without source maps.',
      why: 'Stack traces and breakpoints land in unreadable code, wasting time.',
      fix: 'Enable source maps in the build (sourcemap: true) and upload them to your monitoring tool.',
    },
    {
      mistake: 'Profiling on a fast dev machine only.',
      why: 'You miss jank that real users on slower devices/networks experience.',
      fix: 'Use CPU/network throttling in DevTools and validate against real-device metrics.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue Devtools inspects the component tree, props, reactive state, and timeline of events; source maps map breakpoints to .vue files for stepping through composables.' },
    { area: 'React', detail: 'React Devtools shows the component tree, props/state, and the Profiler flamegraph of renders; breakpoints + async stacks debug hooks and effects.' },
    { area: 'Node.js', detail: 'node --inspect opens the same Chrome DevTools protocol so you set breakpoints, inspect scope, and CPU/heap profile server code from the browser.' },
    { area: 'Backend', detail: 'Heap snapshots and the --inspect CPU profiler diagnose server memory leaks and hot functions; source maps map traces back to TypeScript.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'DevTools itself is the tool you use to find and fix performance problems (flame charts, network waterfalls).',
      'Throttling lets you reproduce and quantify slow-device/network behavior before shipping.',
    ],
    bad: [
      'Having DevTools open (especially Performance/Memory recording) adds overhead, so measured numbers are slightly inflated.',
      'Excessive console logging in hot paths slows the app and can itself cause jank.',
    ],
    optimizations: [
      'Use the Performance panel to find long tasks and forced reflows, then chunk/yield or batch DOM reads/writes.',
      'Use heap snapshots to find and eliminate leaks (detached nodes, retained closures).',
      'Throttle CPU/network to reproduce real-user conditions while profiling.',
      'Remove verbose logging from production builds; prefer logpoints during debugging.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Sensitive data logged to the console (tokens, PII) is visible to anyone who opens DevTools and may end up in screenshots/recordings.',
      'Source maps deployed publicly expose your original source code to anyone.',
    ],
    bestPractices: [
      'Never log secrets/PII; strip debug logging from production builds.',
      'Serve source maps privately (upload to monitoring, restrict public access) rather than shipping them openly.',
      'Be aware that closure "private" values are fully inspectable in DevTools — client-side privacy is not security.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['error-types-try-catch', 'call-stack', 'scope', 'closure'],
    nextConcepts: ['global-error-handlers', 'memory-profiling', 'memory-leaks', 'core-web-vitals'],
    dependencyNote:
      'DevTools debugging puts concepts like the call stack, scope chain, and closures on screen, so understanding those makes the panels meaningful. It is the practical companion to error handling and global handlers (diagnosing what they catch) and to memory profiling and Core Web Vitals (measuring leaks and performance).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a code editor box with a red dot on a line ("breakpoint").',
      'To the right draw a stacked list labeled "Call Stack" (inner → outer → handler).',
      'Below it draw "Scope: Local / Closure / Global".',
      'Draw four buttons: Step Over, Step Into, Step Out, Resume.',
      'Add a note: "conditional breakpoint = pause only when expr is true".',
      'Say: "Set a breakpoint, pause, read the call stack and scope to see exactly how I got here and with what values, then step to find where it diverges."',
    ],
    diagram: `  ● line 12  ──pause──►  CALL STACK: inner ◄ / outer / onClick
                          SCOPE: Local {x} | Closure {cache} | Global
  [Step Over] [Step Into] [Step Out] [Resume]
  conditional breakpoint: pause only if (user.id === 42)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'DevTools is the browser\'s debugging suite. In Sources you set breakpoints (line, conditional, logpoint, DOM, event, XHR/fetch) to pause execution and inspect the live call stack, scope (local/closure/global), and `this`, then step over/into/out. The Console has richer tools than log (table, assert, time, count); Network shows requests and initiators; Performance gives flame charts of long tasks; Memory compares heap snapshots to find leaks. Source maps map minified code to your source. Prefer breakpoints over console.log, and remove debugger statements before committing.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'DevTools is the browser\'s built-in debugging and profiling suite, and the most important skill is debugging with breakpoints rather than scattering console.logs. In the Sources panel I set a breakpoint on a line — or use a debugger statement — and when execution pauses I get a full snapshot: the call stack showing exactly how I reached this point, the scope panel showing local, closure, and global variables, and `this`. From there I step over, into, or out to walk the logic and watch values change, which surfaces where reality diverges from my mental model. For high-frequency code I use conditional breakpoints, which pause only when an expression is true, and logpoints, which print a message every time a line runs without pausing or editing code. There are also DOM breakpoints to pause when a node changes, event-listener breakpoints to pause on any handler of a category, and XHR/fetch breakpoints to trace an unexpected request — and enabling async stack traces stitches the stack across timers and awaits. The Console is more than log: console.table, group, assert, count, and time give structured output. The Network panel shows status, timing, payloads, and which code initiated each request. The Performance panel records a flame chart so I can find long tasks blocking the main thread and forced reflows, and the Memory panel lets me compare heap snapshots around an action to find leaks like detached DOM nodes or retained closures. Source maps tie all of this back to my original Vue or TypeScript code instead of the minified bundle. One habit: remove debugger statements before committing, since they halt anyone with DevTools open.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Breakpoints vs logging: breakpoints give complete state but pause the app (bad for timing-sensitive/animation bugs); logpoints/logging are non-intrusive but only show chosen values.',
      'Source maps in production: invaluable for readable traces but expose source unless served privately.',
      'Profiling overhead: recording adds cost, so absolute numbers are inflated — compare relative deltas.',
    ],
    edgeCases: [
      'Timing-sensitive bugs (animations, races) can disappear when paused — use logpoints or performance traces instead.',
      'Async stack traces may be incomplete across some boundaries or libraries; the Initiator column helps reconstruct causality.',
      'Minified production errors are unreadable without uploaded source maps in the monitoring tool.',
      'Conditional breakpoints with heavy expressions slow execution because they evaluate every hit.',
    ],
    runtimeBehavior: [
      'Breakpoints suspend the V8 thread; the Console evaluates expressions in the selected frame\'s scope, so you can read closure variables you could not otherwise reach.',
      'The Performance profiler samples the stack on an interval, so very short functions may be under-represented.',
      'Heap snapshots walk the live object graph via the GC; comparing snapshots reveals retained-size growth and retainer paths.',
    ],
    scalability: [
      'For server code, node --inspect exposes the same protocol so you profile CPU/heap of production-like workloads.',
      'Integrate source-map upload into CI so every release\'s minified traces are decodable in monitoring.',
    ],
    productionConcerns: [
      'Strip console/debug noise and secrets from production bundles; lint no-debugger.',
      'Throttle CPU/network when profiling to match real users, not your dev machine.',
      'Pair DevTools findings with field data (RUM/Core Web Vitals) — lab traces alone can mislead.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Sources panel = breakpoints + call stack + scope + stepping.',
    'Breakpoint types: line, conditional, logpoint, DOM, event-listener, XHR/fetch.',
    'Step Over (skip calls), Into (enter call), Out (finish function), Resume.',
    'Scope panel shows Local / Closure / Global — inspect closure vars live.',
    'debugger; statement pauses when DevTools is open — remove before commit.',
    'Console: table, group, assert, count, time/timeEnd > plain log.',
    'Network: status, timing waterfall, payload, Initiator (who called it).',
    'Performance: flame chart → find long tasks (>50ms) and forced reflows.',
    'Memory: compare 2 heap snapshots → detached nodes / retained closures.',
    'Source maps map minified code → original source (enable + upload).',
    'Async stack traces stitch across setTimeout/await.',
    'Throttle CPU/network to reproduce real-user conditions.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use a conditional debugger to pause only when a loop encounters a falsy item. Write the snippet.',
      hint: 'Put debugger inside an if.',
      solution: {
        lang: 'js',
        code: `for (const item of items) {\n  if (!item) {\n    debugger // pauses only for the falsy item when DevTools is open\n  }\n  process(item)\n}`,
        explanation: [
          'The if guards the debugger so it only triggers for the problematic value.',
          'When paused, inspect item and the loop index in the Scope panel.',
          'This mimics a conditional breakpoint without leaving the editor — but remove it before committing.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Replace ad-hoc logging with structured console methods to show an array of orders as a table and time how long processing takes.',
      hint: 'console.table and console.time/timeEnd.',
      solution: {
        lang: 'js',
        code: `console.time('process')\nconsole.table(orders.map((o) => ({ id: o.id, amount: o.amount })))\nconst total = orders.reduce((s, o) => s + o.amount, 0)\nconsole.timeEnd('process') // logs e.g. \"process: 1.2ms\"\nconsole.assert(total >= 0, 'negative total', { total })`,
        explanation: [
          'console.table renders the orders as a readable grid.',
          'time/timeEnd measure the processing duration with no manual Date math.',
          'console.assert flags an invariant violation only when it fails.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Describe (in code comments) the exact DevTools steps to find which code triggered an unexpected POST to /api/track, including how to see the call path.',
      hint: 'XHR/fetch breakpoint + Initiator + async stacks.',
      solution: {
        lang: 'js',
        code: `// 1. Sources > XHR/fetch Breakpoints > Add: \"/api/track\"\n// 2. Reproduce the action; execution pauses right before the request.\n// 3. Read the Call Stack panel to see who initiated it.\n// 4. Enable \"Async\" stacks so the path across setTimeout/await is shown.\n// 5. Alternatively, Network panel > select the request > Initiator column\n//    shows the call chain that fired it.\nfetch('/api/track', { method: 'POST', body }) // breakpoint pauses here`,
        explanation: [
          'An XHR/fetch breakpoint pauses before any request whose URL matches, even from third-party code.',
          'The call stack (with async frames enabled) reveals the full chain that led to the request.',
          'The Network panel Initiator column is a non-pausing alternative that shows the same causality.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Outline a methodical approach to debug a reproducible "button click does nothing" bug using DevTools, from event to root cause.',
      hint: 'Event listener breakpoint → step → check handler, state, and network.',
      solution: {
        lang: 'js',
        code: `// METHOD:\n// 1. Sources > Event Listener Breakpoints > Mouse > tick \"click\" → reproduce.\n//    If it never pauses: the handler is not attached → inspect element listeners.\n// 2. If it pauses, Step Into the handler; watch Scope for unexpected values.\n// 3. Check for an early return / guard that exits before the action.\n// 4. If it calls an API, open Network: is the request sent? what status?\n// 5. If an error is swallowed, check Console + add an exception pause\n//    (Pause on caught/uncaught exceptions).\nbutton.addEventListener('click', handleClick)`,
        explanation: [
          'Starting from an event-listener breakpoint confirms whether the handler even runs.',
          'Stepping through reveals guards/early returns and wrong state that silently abort the action.',
          'Checking Network and pausing on exceptions catches failed requests and swallowed errors.',
          'This event → handler → state → network → exception path is a repeatable debugging methodology.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Debugging skill is what turns "I am stuck" into "I found it in five minutes" — interviewers and teammates trust engineers who methodically use breakpoints, the call stack, and profilers instead of guessing.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask basic things like breakpoints vs console.log and what the debugger statement does. Product companies (Zoho, Flipkart, Razorpay) ask how you would debug a specific bug — a bad request, a leak, slow render. FAANG-level interviews probe profiling methodology, heap snapshot leak hunting, async stack traces, and source-map workflows.',
    whatInterviewersExpect:
      'They expect you to prefer breakpoints over logging, know conditional breakpoints/logpoints and the stepping commands, read the call stack and scope, use Network/Performance/Memory for the right problem, and rely on source maps — described as a methodical process, not random poking.',
  },
}

export default devtoolsDebugging
