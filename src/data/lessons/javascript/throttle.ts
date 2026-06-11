import type { ConceptLesson } from '../../../types/lesson'

const throttle: ConceptLesson = {
  // 1. Concept Summary
  slug: 'throttle',
  name: 'Throttle',
  category: 'performance',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Throttle caps how often a function runs during continuous activity — the standard fix for scroll, mousemove, drag, and resize handlers that would otherwise fire hundreds of times a second.',
    'Without it, a scroll handler can run 100+ times per second, blocking the main thread, dropping frames, and making the page stutter.',
    'It is asked in almost every front-end interview, usually right after debounce, to test whether you understand "fixed rate" vs "wait for quiet" and can implement both correctly.',
    'It powers real features: infinite-scroll triggers, sticky headers, drag handlers, rate-limited analytics, and API rate limiting.',
    'Getting the edges wrong (no trailing call, dropping the final state, leaking timers) causes subtle bugs like a scroll position that is slightly stale or a final event never handled.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Throttle is like a water tap that only lets one cup through every few seconds, no matter how hard you turn it.',
    story: [
      'Imagine a drinking fountain that, if you mash the button, would spray water nonstop and flood the floor.',
      'So the fountain is built with a rule: it gives you a sip, then ignores the button for three seconds, then allows another sip.',
      'No matter how fast or how many times you press, you get water at a steady, sensible pace — one sip every few seconds.',
      'Throttle is that rule. Even if events come in a flood (scrolling, moving the mouse), it lets the function run at most once every set interval, keeping things steady instead of overwhelming.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some events fire extremely fast — moving the mouse or scrolling can trigger a function a hundred times a second.',
    'Throttle limits that to a steady rate, like "run at most once every 200 milliseconds", no matter how many events arrive.',
    'The first call runs immediately, then any calls during the cooldown are ignored, and once the interval passes another call is allowed.',
    'Unlike debounce, which waits for the activity to STOP, throttle keeps running at regular intervals WHILE the activity continues — good when you want steady progress, like updating a scroll indicator.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Throttle is a higher-order function that ensures the wrapped function runs at most once per specified interval, regardless of how often it is called. During continuous bursts it fires on a fixed cadence instead of every event.',
    how: 'A common implementation records the last execution time (or sets a cooldown flag); when called, it runs immediately if enough time has elapsed since the last run, otherwise it ignores the call (optionally scheduling a trailing call so the final state is not lost).',
    why: 'It keeps high-frequency handlers (scroll, mousemove, resize, drag) from flooding the main thread, giving steady, frame-friendly updates instead of hundreds of redundant calls.',
    code: {
      label: 'A minimal throttle (timestamp version)',
      lang: 'js',
      code: `function throttle(fn, interval = 200) {\n  let last = 0                      // time of last run (closure state)\n  return function (...args) {\n    const now = Date.now()\n    if (now - last >= interval) {    // enough time passed?\n      last = now\n      fn.apply(this, args)           // run now, with this + args\n    }\n    // otherwise: ignore this call\n  }\n}\n\nconst onScroll = throttle(() => console.log(window.scrollY), 200)\nwindow.addEventListener('scroll', onScroll) // runs ~5x/sec, not 100x`,
      explanation: [
        '`last` is closure state holding the timestamp of the previous execution.',
        'On each call we check if at least `interval` ms have passed since the last run.',
        'If yes, we update `last` and run; if no, we silently skip the call.',
        'fn.apply(this, args) preserves context and forwards the latest arguments.',
        'Result: a scroll handler runs at a steady ~5 times/second instead of flooding the thread.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Throttle is a rate-limiting higher-order function that guarantees the wrapped function executes at most once per fixed interval. Implementations either compare the current timestamp against the last execution time (leading-edge) or use a cooldown flag with a timer; production versions add a trailing-edge invocation so the final call within an interval is not lost, and forward `this` and the latest arguments via apply. It bounds invocation frequency during continuous event streams, trading completeness for predictable, frame-aligned cadence.',

  // 7. Internal Working
  internalWorking: [
    'The factory captures closure state — either a `last` timestamp or a boolean cooldown flag plus a timer — and returns a wrapper.',
    'Leading-edge (timestamp) variant: on each call it reads Date.now(); if now - last >= interval it sets last = now and invokes fn immediately, otherwise it returns without running.',
    'Cooldown (timer) variant: if not currently in cooldown, it runs fn, sets a flag, and starts a setTimeout that clears the flag after the interval, ignoring calls until then.',
    'A trailing-edge addition stores the latest args/this and, if calls arrived during cooldown, schedules one final invocation at the end of the interval so the last state is applied.',
    'Because invocation is gated by elapsed time rather than reset on every call, throttle fires repeatedly during a continuous burst (unlike debounce, which never fires until quiet).',
    'Timer callbacks are macrotasks; the trailing call is queued and dequeued by the event loop after the interval, and timers in background tabs may be clamped, stretching the effective cadence.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   calls:  c c c c c c c c c c c c c c
   time  ──┼──┼──┼──┼──┼──┼──┼──┼──┼──►
           │interval│interval│interval│
   runs:   ✓        ✓        ✓        ✓
           (others in each window are ignored)

   DEBOUNCE waits for quiet → 1 run after burst
   THROTTLE keeps a steady cadence DURING the burst`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Closure state (`last` timestamp or cooldown flag + timer id) lives on the heap, kept alive while the throttled function is reachable.',
    'A trailing-edge implementation also retains the latest args/this until the trailing call fires, then releases them.',
    'A throttled scroll/mousemove handler attached to a long-lived target pins its closure until the listener is removed — clean up on unmount.',
    'Pending trailing timers must be cleared on cancel/unmount or they hold the closure and may fire after teardown.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — throttle a mousemove handler',
      lang: 'js',
      code: `function throttle(fn, interval = 100) {\n  let last = 0\n  return (...args) => {\n    const now = Date.now()\n    if (now - last >= interval) { last = now; fn(...args) }\n  }\n}\ndocument.addEventListener('mousemove', throttle((e) => {\n  console.log(e.clientX, e.clientY)\n}, 100))`,
      explanation: [
        'mousemove can fire continuously; throttle caps it to ~10 updates/second.',
        'The latest event is passed through via ...args.',
        'Calls within the 100ms window are dropped, keeping the handler cheap.',
        'This leading-edge version runs on the first event of each window.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cooldown flag with trailing call',
      lang: 'js',
      code: `function throttle(fn, interval = 200) {\n  let inCooldown = false, lastArgs = null, lastThis = null\n  return function (...args) {\n    lastArgs = args; lastThis = this\n    if (inCooldown) return            // ignore during cooldown\n    fn.apply(this, args)              // leading run\n    inCooldown = true\n    setTimeout(() => {\n      inCooldown = false\n      if (lastArgs) { fn.apply(lastThis, lastArgs); lastArgs = null } // trailing\n    }, interval)\n  }\n}`,
      explanation: [
        'Runs immediately (leading), then enters cooldown ignoring calls for the interval.',
        'It remembers the latest args/this so the FINAL call in the window is not lost.',
        'When the timer fires, if calls happened during cooldown it runs once more (trailing edge).',
        'This guarantees the last scroll/resize value is applied, fixing the "stale final state" bug.',
        'fn.apply preserves context for object methods and event handlers.',
      ],
    },
    advanced: {
      label: 'Advanced — configurable leading/trailing + cancel',
      lang: 'js',
      code: `function throttle(fn, interval = 200, { leading = true, trailing = true } = {}) {\n  let last = 0, timer = null, lastArgs = null, lastThis = null\n  function run(time) { last = time; fn.apply(lastThis, lastArgs); lastArgs = null }\n  function throttled(...args) {\n    const now = Date.now()\n    if (!last && !leading) last = now      // skip the leading run\n    const remaining = interval - (now - last)\n    lastArgs = args; lastThis = this\n    if (remaining <= 0) {\n      if (timer) { clearTimeout(timer); timer = null }\n      run(now)\n    } else if (trailing && !timer) {\n      timer = setTimeout(() => { timer = null; run(leading ? Date.now() : 0) }, remaining)\n    }\n  }\n  throttled.cancel = () => { clearTimeout(timer); timer = null; last = 0; lastArgs = null }\n  return throttled\n}`,
      explanation: [
        'remaining computes how long until the next allowed run, based on the last execution time.',
        'When remaining <= 0 we run immediately (and clear any pending trailing timer).',
        'Otherwise, if trailing is on, we schedule one run at the end of the window with the latest args.',
        'leading=false suppresses the first run; trailing=false drops the final one — mirrors lodash.throttle.',
        'cancel() clears the pending trailing timer and resets state for clean unmount.',
      ],
    },
    realProject: {
      label: 'Real project — infinite scroll + sticky header in Vue',
      lang: 'js',
      code: `import { onMounted, onUnmounted } from 'vue'\n\nexport function useInfiniteScroll(loadMore, { interval = 200, offset = 300 } = {}) {\n  let last = 0\n  function onScroll() {\n    const now = Date.now()\n    if (now - last < interval) return     // throttle\n    last = now\n    const { scrollTop, scrollHeight, clientHeight } = document.documentElement\n    if (scrollHeight - (scrollTop + clientHeight) < offset) loadMore()\n  }\n  onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))\n  onUnmounted(() => window.removeEventListener('scroll', onScroll))\n}`,
      explanation: [
        'Scroll fires extremely often; throttling to 200ms keeps the handler cheap and the page smooth.',
        'We only call loadMore when the user nears the bottom (within offset px).',
        'passive: true tells the browser the handler will not preventDefault, improving scroll performance.',
        'onUnmounted removes the listener so the closure and handler are released — no leak.',
        'In React this is a useEffect that adds/removes the throttled scroll listener with the same logic.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is throttle and when would you use it?',
      answer: 'Throttle limits a function to run at most once per interval, no matter how often it is called. Use it for high-frequency events like scroll, mousemove, drag, and resize where you want steady updates instead of hundreds per second.',
      explanation: 'The signal is "at most once per interval" plus a continuous-event use case like scroll.',
    },
    {
      level: 'beginner',
      question: 'How is throttle different from debounce?',
      answer: 'Throttle runs at a steady cadence DURING continuous activity (at most once per interval). Debounce waits for the activity to STOP and then runs once. Use throttle for progress during scroll/drag; debounce for a final action after typing/resizing stops.',
      explanation: 'The clean contrast — steady-rate vs wait-for-quiet — and matching each to a use case is the key.',
    },
    {
      level: 'intermediate',
      question: 'Implement throttle from scratch.',
      answer: 'Keep a `last` timestamp in a closure; on each call compute now - last and run fn (updating last) only if it is >= interval, otherwise ignore the call. Use fn.apply(this, args) to preserve context and the latest arguments.',
      explanation: 'They check for closure state, the timestamp comparison (or cooldown flag), and correct this/args forwarding.',
    },
    {
      level: 'intermediate',
      question: 'Why might a basic throttle miss the final event, and how do you fix it?',
      answer: 'A leading-only throttle ignores calls during the cooldown, so the very last call in a window is dropped — e.g. the final scroll position is stale. Fix it with a trailing-edge call: remember the latest args and run once at the end of the interval if calls arrived during cooldown.',
      explanation: 'Knowing the leading/trailing distinction and the stale-final-state bug is the discriminator.',
    },
    {
      level: 'advanced',
      question: 'When would you throttle with requestAnimationFrame instead of a time interval?',
      answer: 'For visual updates tied to the frame rate — scroll-driven animations, parallax, drag positioning. rAF-throttling runs the handler at most once per frame (~16ms at 60fps), aligning work with the browser’s paint cycle so updates are smooth and never wasted on frames that will not render.',
      explanation: 'Senior signal: matching the throttle cadence to the rendering pipeline rather than an arbitrary ms value.',
    },
    {
      level: 'senior',
      question: 'How does throttling relate to rate limiting and backpressure on the server?',
      answer: 'They are the same idea applied differently: client throttle caps event-handler frequency; server rate limiting (token/leaky bucket) caps request frequency per client. Both protect a constrained resource from being overwhelmed. On the server you also need backpressure — rejecting or queuing excess — whereas client throttle simply drops intermediate calls.',
      explanation: 'Connecting client throttle to server-side rate-limiting algorithms and backpressure shows systems-level thinking.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you add a trailing call so the final event is not lost?',
    'What is the difference between the timestamp and the setTimeout (flag) implementations?',
    'How would you throttle using requestAnimationFrame?',
    'How do you cancel a pending trailing call on unmount?',
    'When is debounce the better choice than throttle?',
    'How does this relate to server-side rate limiting (token bucket / leaky bucket)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Implementing leading-only throttle and losing the final event.',
      why: 'Calls during the cooldown are ignored, so the last scroll/resize value never gets applied — the UI ends up slightly stale.',
      fix: 'Add a trailing-edge call that runs once at the end of the interval with the latest args.',
    },
    {
      mistake: 'Confusing throttle with debounce.',
      why: 'Using debounce for scroll progress means nothing updates until scrolling stops; using throttle for search fires too many requests.',
      fix: 'Throttle = steady rate during activity; debounce = one run after activity stops. Pick by the desired behavior.',
    },
    {
      mistake: 'Using an arrow wrapper or bare fn() when this/arguments matter.',
      why: 'You lose the call-site this and the event/argument, breaking object methods and handlers.',
      fix: 'Use a regular function wrapper and fn.apply(this, args).',
    },
    {
      mistake: 'Not removing the throttled listener (and pending timer) on unmount.',
      why: 'The closure and listener stay alive (leak) and a trailing timer can fire after teardown.',
      fix: 'removeEventListener and call cancel()/clearTimeout in onUnmounted / useEffect cleanup.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Throttled scroll handlers for infinite scroll, sticky headers, and scroll-spy; VueUse provides useThrottleFn and useScroll with throttling, cleaned up on scope dispose.' },
    { area: 'React', detail: 'Throttled scroll/resize handlers memoized with useMemo and removed in useEffect cleanup; libraries expose useThrottledCallback. rAF-throttling powers scroll-linked animations.' },
    { area: 'Node.js', detail: 'Throttling log/metric emission, coalescing rapid filesystem events, and capping outbound request rate to a downstream API to respect its limits.' },
    { area: 'Backend', detail: 'API rate limiting (token bucket / leaky bucket) is server-side throttling; throttling expensive recomputations or cache invalidations protects shared resources from spikes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Bounds main-thread work during scroll/mousemove/resize, preventing jank and dropped frames.',
      'Reduces redundant layout reads/writes, network calls, and re-renders to a predictable cadence.',
    ],
    bad: [
      'Too-large an interval makes updates feel laggy (e.g. a sticky header that snaps late).',
      'A leading-only throttle drops the final state, which can look like a bug.',
    ],
    optimizations: [
      'Use requestAnimationFrame-throttling for visual/scroll-linked work so updates align with paint.',
      'Add passive event listeners for scroll/touch to avoid blocking the scroll thread.',
      'Include a trailing call so the final value is applied; tune the interval to the work cost.',
      'Batch DOM reads then writes inside the throttled handler to avoid layout thrashing.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'timers', 'this-keyword', 'call-apply-bind', 'higher-order-functions'],
    nextConcepts: ['debounce', 'requestanimationframe', 'event-delegation', 'long-task-scheduling'],
    dependencyNote:
      'Throttle is closures + timers/timestamps + this/arguments forwarding, the same toolkit as debounce (its sibling). For visual work it pairs with requestAnimationFrame, and at scale it mirrors server-side rate limiting and long-task scheduling.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write throttle(fn, interval) returning a function, with `let last = 0` in the closure.',
      'Inside: const now = Date.now(); if (now - last >= interval) { last = now; fn.apply(this, args) }.',
      'Say: "Runs on the first call, then ignores calls until the interval passes — a steady cadence."',
      'Draw the timeline: many calls, ticks at fixed intervals where it runs.',
      'Contrast with debounce: throttle fires DURING the burst, debounce only after it stops.',
      'Mention trailing edge to avoid losing the final event, and rAF-throttle for visual work.',
    ],
    diagram: `  throttle(fn, interval):
    let last = 0
    return function(...args) {
      const now = Date.now()
      if (now - last >= interval) {
        last = now
        fn.apply(this, args)   // steady cadence
      }
    }
  calls: |||||||||  →  runs:  ✓   ✓   ✓   (every interval)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Throttle caps a function to run at most once per interval during continuous activity — the fix for scroll, mousemove, drag, and resize. Implement with a closure-held `last` timestamp: run and update `last` only if now - last >= interval, otherwise skip. Add a trailing call so the final event is not lost. Contrast with debounce, which waits for quiet then runs once — throttle keeps a steady cadence WHILE events flow. For visual work, throttle with requestAnimationFrame; always use fn.apply for this/args and clean up listeners/timers on unmount.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Throttle is a higher-order function that guarantees the wrapped function runs at most once per interval, no matter how often it is called. It is the standard tool for high-frequency events like scroll, mousemove, and resize, where the handler could otherwise fire a hundred times a second and jank the page. The simplest implementation keeps a `last` timestamp in a closure; on each call it computes now minus last, and only runs the function — updating last — if that gap is at least the interval, otherwise it ignores the call. I use fn.apply(this, args) so context and the latest arguments are preserved. The subtlety is the leading vs trailing edge: a leading-only throttle runs on the first call of each window but drops the final call during a cooldown, so the last scroll position can end up stale. A production version remembers the latest args and adds a trailing call at the end of the interval to apply that final state, and exposes cancel() for cleanup. The key contrast with debounce is timing: debounce waits for activity to STOP and runs once; throttle keeps a steady cadence WHILE activity continues — so I use throttle for ongoing progress like infinite scroll or drag, and debounce for a final action like search after typing stops. For purely visual, scroll-linked work I often throttle with requestAnimationFrame so updates align with the browser’s paint cycle. And I always remove the listener and clear any pending timer on unmount.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Throttle (steady cadence, may drop intermediates) vs debounce (one final run, no intermediates) — choose by whether you need progress or a final result.',
      'Timestamp implementation (simple, leading-edge, no timer) vs flag/timer implementation (supports trailing edge, more state).',
      'Fixed-ms interval (predictable) vs rAF-throttle (frame-aligned, adapts to refresh rate but pauses in background tabs).',
    ],
    edgeCases: [
      'Leading-only throttle loses the final event — needs a trailing call.',
      'leading=false + trailing=false would never fire; guard configuration.',
      'Background-tab timer clamping stretches the interval; rAF stops entirely when the tab is hidden.',
      'Trailing timer firing after unmount touches dead state — must cancel.',
    ],
    runtimeBehavior: [
      'Trailing calls are macrotasks scheduled via setTimeout; they run after the current sync work and microtasks.',
      'Date.now() comparisons are wall-clock based and unaffected by paint, unlike rAF which is paint-driven.',
      'In a continuous burst, throttle invokes roughly duration/interval times, bounded and predictable.',
    ],
    scalability: [
      'Client throttle bounds handler frequency regardless of input rate, keeping the main thread responsive at any scroll speed.',
      'Mirrors server rate limiting (token/leaky bucket); both cap throughput to protect a constrained resource.',
    ],
    productionConcerns: [
      'Combine throttle with passive listeners and read-then-write batching to avoid layout thrashing in scroll handlers.',
      'Prefer rAF-throttle for animation-adjacent work so you never paint more than once per frame.',
      'Always remove listeners and cancel trailing timers on unmount; test with fake timers for deterministic results.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Throttle = run at most once per interval during continuous calls.',
    'Pattern: closure `last` timestamp → run only if now - last >= interval.',
    'Alternative: cooldown flag + setTimeout for trailing support.',
    'Add a trailing call so the FINAL event is not lost.',
    'Use fn.apply(this, args) for context + latest args.',
    'Use for: scroll, mousemove, drag, resize, rate-limited analytics.',
    'Throttle = steady rate; debounce = wait for quiet then once.',
    'rAF-throttle for scroll-linked / visual updates (~16ms).',
    'Add passive: true to scroll/touch listeners.',
    'Arrow wrapper loses this — use a regular function.',
    'Remove listener + cancel timer on unmount.',
    'Client throttle ≈ server rate limiting (token/leaky bucket).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write throttle(fn, interval) using a timestamp so fn runs at most once per interval.',
      hint: 'Keep `last` in a closure; run only when now - last >= interval.',
      solution: {
        lang: 'js',
        code: `function throttle(fn, interval = 200) {\n  let last = 0\n  return function (...args) {\n    const now = Date.now()\n    if (now - last >= interval) {\n      last = now\n      fn.apply(this, args)\n    }\n  }\n}`,
        explanation: [
          '`last` is closure state for the time of the previous run.',
          'We run only when at least `interval` ms have elapsed, ignoring calls in between.',
          'fn.apply forwards this and the latest arguments.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add a trailing call so the last invocation during a cooldown still runs at the end of the interval.',
      hint: 'Remember the latest args; in the cooldown timer, run once if calls happened.',
      solution: {
        lang: 'js',
        code: `function throttle(fn, interval = 200) {\n  let cooling = false, lastArgs = null, lastThis = null\n  return function (...args) {\n    lastArgs = args; lastThis = this\n    if (cooling) return\n    fn.apply(this, args)\n    cooling = true\n    setTimeout(() => {\n      cooling = false\n      if (lastArgs) { fn.apply(lastThis, lastArgs); lastArgs = null }\n    }, interval)\n  }\n}`,
        explanation: [
          'Leading run happens immediately, then we enter cooldown.',
          'We stash the latest args/this on every call so the final one is not lost.',
          'When the timer fires, if calls arrived during cooldown we run once more (trailing edge).',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a requestAnimationFrame-based throttle that runs the handler at most once per frame.',
      hint: 'If a frame is already scheduled, just update the args; otherwise schedule one rAF.',
      solution: {
        lang: 'js',
        code: `function rafThrottle(fn) {\n  let scheduled = false, lastArgs = null, lastThis = null\n  function throttled(...args) {\n    lastArgs = args; lastThis = this\n    if (scheduled) return\n    scheduled = true\n    requestAnimationFrame(() => {\n      scheduled = false\n      fn.apply(lastThis, lastArgs)\n    })\n  }\n  throttled.cancel = () => { scheduled = false }\n  return throttled\n}`,
        explanation: [
          'At most one rAF is in flight; extra calls just update the stored args.',
          'The handler runs once per frame (~16ms at 60fps), perfectly aligned with painting.',
          'It always uses the latest args, so the final position is applied.',
          'Ideal for scroll-linked animations and drag where updating more than once per frame is wasted work.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement throttle with configurable leading and trailing edges plus cancel, like lodash.throttle.',
      hint: 'Track last-run time and a pending timer; compute remaining time; schedule trailing when needed.',
      solution: {
        lang: 'js',
        code: `function throttle(fn, interval = 200, { leading = true, trailing = true } = {}) {\n  let last = 0, timer = null, lastArgs = null, lastThis = null\n  function invoke(time) { last = time; fn.apply(lastThis, lastArgs); lastArgs = null }\n  function throttled(...args) {\n    const now = Date.now()\n    if (!last && !leading) last = now\n    const remaining = interval - (now - last)\n    lastArgs = args; lastThis = this\n    if (remaining <= 0) {\n      if (timer) { clearTimeout(timer); timer = null }\n      invoke(now)\n    } else if (trailing && !timer) {\n      timer = setTimeout(() => { timer = null; invoke(leading ? Date.now() : 0) }, remaining)\n    }\n  }\n  throttled.cancel = () => { clearTimeout(timer); timer = null; last = 0; lastArgs = null }\n  return throttled\n}`,
        explanation: [
          'remaining tells us how long until the next allowed run, derived from the last run time.',
          'When remaining <= 0 we run now and clear any pending trailing timer.',
          'Otherwise, with trailing enabled, we schedule one final run at the end of the window.',
          'leading=false skips the immediate run; cancel() clears the timer and resets state for unmount.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Throttle is the companion to debounce and the standard answer for "my scroll handler is janky." Implementing it and clearly contrasting it with debounce signals you understand both event frequency and the rendering pipeline.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and the throttle-vs-debounce difference. Product companies (Zoho, Flipkart, Razorpay) ask you to implement throttle and add a trailing call. FAANG-level interviews probe rAF-throttling, frame alignment, and the parallel to server-side rate limiting and backpressure.',
    whatInterviewersExpect:
      'They expect a correct implementation (closure timestamp or cooldown flag, fn.apply for this/args), a crisp contrast with debounce, awareness of the leading/trailing edges and the lost-final-event bug, and ideally the rAF and rate-limiting connections.',
  },
}

export default throttle
