import type { ConceptLesson } from '../../../types/lesson'

const debounce: ConceptLesson = {
  // 1. Concept Summary
  slug: 'debounce',
  name: 'Debounce',
  category: 'performance',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Debounce is the standard fix for "this fires way too often" — search-as-you-type, autosave, window resize, validation — turning a storm of events into one well-timed action.',
    'Without it you fire an API call on every keystroke (10 calls for "react hooks"), hammering the server, racing responses, and janking the UI.',
    'It is the single most asked utility-implementation question in front-end interviews — companies use it to test closures, setTimeout, this/arguments handling, and edge cases in one go.',
    'Getting it subtly wrong (forgetting to clear the timer, losing this, no leading/trailing options, no cancel) is a common real bug that ships to production.',
    'It demonstrates you can reason about time and event frequency, not just data — a skill that shows up everywhere from UI to rate limiting.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Debounce is like an elevator that waits a few seconds after the last person presses the button before closing the doors.',
    story: [
      'Imagine an elevator where, the instant someone presses a floor button, it tries to close the doors and leave.',
      'If five friends arrive one after another, the doors would slam shut and reopen five times — annoying and pointless.',
      'A smarter elevator waits: every time someone presses the button, it resets a little timer and only closes the doors once nobody has pressed anything for a few seconds.',
      'Debounce is that smart waiting. When events keep coming fast, it keeps resetting the timer and only does the real work (close the doors / send the search) once things go quiet.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some things happen very fast and very often, like typing letters or moving a window — a function attached to them would run dozens of times a second.',
    'Debounce says: "wait until the activity stops for a moment, then run once."',
    'Every time the event fires, it cancels the previous countdown and starts a new one; only when the countdown finishes uninterrupted does the function actually run.',
    'So if you type quickly, nothing happens until you pause — then it does the work a single time with your latest input.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Debounce is a higher-order function that wraps another function so it only runs after a specified quiet period has elapsed since the last call. Rapid repeated calls keep resetting an internal timer, so the wrapped function executes once, after the bursts stop.',
    how: 'It uses a closure to hold a timer id. On each call it clears the pending timer and schedules a new setTimeout for `delay` ms. Only when no new call interrupts that timer does the original function finally run, typically with the most recent arguments.',
    why: 'It collapses a burst of frequent events into one action — fewer API calls, less work, a smoother UI — ideal for search input, autosave, resize, and validation.',
    code: {
      label: 'A minimal debounce',
      lang: 'js',
      code: `function debounce(fn, delay = 300) {\n  let timer = null            // private state in the closure\n  return function (...args) {\n    clearTimeout(timer)       // cancel the previous pending run\n    timer = setTimeout(() => {\n      fn.apply(this, args)    // run once, with latest args + correct this\n    }, delay)\n  }\n}\n\nconst onSearch = debounce((q) => console.log('search', q), 300)\nonSearch('r'); onSearch('re'); onSearch('rea') // only 'rea' logs, once`,
      explanation: [
        '`timer` lives in the closure, persisting between calls — this is why understanding closures is a prerequisite.',
        'Every call clears the previous timer, so a rapid burst never lets the old timeout fire.',
        'setTimeout schedules fn for `delay` ms later; only an uninterrupted gap lets it run.',
        'fn.apply(this, args) preserves the caller’s `this` and passes the LATEST arguments — important for event handlers.',
        'Typing r, re, rea quickly results in a single call with "rea".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Debounce is a rate-limiting higher-order function that postpones invoking the wrapped function until a configurable interval has elapsed without any new invocation. It maintains a timer reference in closure state; each call clears the pending timer and reschedules, so only the trailing call after a quiescent period executes (trailing-edge), unless configured to fire on the leading edge or both. It forwards the latest arguments and binds `this` via apply, and a production-grade implementation exposes cancel() and flush() controls.',

  // 7. Internal Working
  internalWorking: [
    'The factory function creates a private `timer` variable captured by closure and returns a wrapper function.',
    'On each invocation, the wrapper calls clearTimeout(timer), cancelling any previously scheduled execution that has not yet fired (this is the core of "reset the countdown").',
    'It then schedules fn via setTimeout(..., delay), storing the returned id back into `timer`; the callback is a macrotask queued only after the delay elapses.',
    'It captures the current call’s arguments and `this`; because the latest call wins, the eventual execution uses the most recent arguments (trailing edge).',
    'If another call arrives before the delay expires, step 2 cancels the pending macrotask and step 3 reschedules — the timer effectively never fires during a continuous burst.',
    'Only when `delay` ms pass with no new call does the event loop dequeue the macrotask and run fn.apply(this, args); leading-edge variants instead fire immediately on the first call and suppress subsequent ones until quiet.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   calls:   c   c c    c              c
   time  ──┬───┬─┬────┬──────────────┬──────────►
           │   │ │    │  delay window │  delay window
   timer:  set reset reset reset .....fires!  set ...fires!
                                   ▲              ▲
                            quiet gap       quiet gap
                            triggers run    triggers run

   trailing-edge debounce: run ONCE after activity stops`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The `timer` id and the wrapped `fn` live in the closure’s environment record on the heap, kept alive as long as the debounced function is reachable.',
    'Each pending setTimeout holds a reference to the latest args; superseded args become unreachable and are collected when the timer is reset.',
    'A debounced handler attached to a long-lived element pins its closure (and captured fn) in memory until the listener is removed — clean up on unmount.',
    'cancel() clearing the timer also releases the pending callback and its captured args, helping the GC.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — debounce a resize handler',
      lang: 'js',
      code: `function debounce(fn, delay = 200) {\n  let t\n  return (...args) => {\n    clearTimeout(t)\n    t = setTimeout(() => fn(...args), delay)\n  }\n}\nwindow.addEventListener('resize', debounce(() => {\n  console.log('settled size:', window.innerWidth)\n}, 200))`,
      explanation: [
        'Resize fires dozens of times during a single drag; debounce runs the handler once after the user stops.',
        'The arrow wrapper forwards args; for resize we ignore them and read window directly.',
        'clearTimeout on each event cancels the previous pending run.',
        'Result: one layout recalculation instead of dozens — much smoother.',
      ],
    },
    intermediate: {
      label: 'Intermediate — preserve this + latest args (object method)',
      lang: 'js',
      code: `function debounce(fn, delay = 300) {\n  let timer\n  return function (...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}\n\nconst widget = {\n  name: 'search-box',\n  log(q) { console.log(this.name, 'queried', q) },\n}\nwidget.debouncedLog = debounce(widget.log, 300)\nwidget.debouncedLog('vue') // after 300ms: 'search-box queried vue'`,
      explanation: [
        'A regular function (not arrow) wrapper captures the call-site `this`.',
        'fn.apply(this, args) forwards both `this` and the latest arguments so the method works correctly.',
        'If we used an arrow wrapper here, `this` would be the closure’s lexical this, breaking widget.name.',
        'This this/arguments handling is exactly what interviewers check beyond the basic timer logic.',
      ],
    },
    advanced: {
      label: 'Advanced — leading/trailing options + cancel + flush',
      lang: 'js',
      code: `function debounce(fn, delay = 300, { leading = false, trailing = true } = {}) {\n  let timer = null, lastArgs = null, lastThis = null\n  function invoke() { fn.apply(lastThis, lastArgs); lastArgs = lastThis = null }\n  function debounced(...args) {\n    lastArgs = args; lastThis = this\n    const callNow = leading && !timer\n    clearTimeout(timer)\n    timer = setTimeout(() => {\n      timer = null\n      if (trailing && lastArgs) invoke()\n    }, delay)\n    if (callNow) invoke()\n  }\n  debounced.cancel = () => { clearTimeout(timer); timer = null; lastArgs = lastThis = null }\n  debounced.flush = () => { if (timer) { clearTimeout(timer); timer = null; if (lastArgs) invoke() } }\n  return debounced\n}`,
      explanation: [
        'leading fires immediately on the first call of a burst; trailing fires after it ends — both can be enabled.',
        'callNow = leading && !timer detects the first call of a new burst.',
        'cancel() throws away a pending invocation (e.g. on component unmount) so it never fires.',
        'flush() forces the pending invocation to run now instead of waiting (e.g. on form submit).',
        'This mirrors lodash.debounce and is the production-grade shape interviewers love.',
      ],
    },
    realProject: {
      label: 'Real project — debounced search in a Vue composable',
      lang: 'js',
      code: `import { ref, onUnmounted } from 'vue'\n\nexport function useSearch(api) {\n  const results = ref([])\n  const loading = ref(false)\n  let timer\n  function search(q) {\n    clearTimeout(timer)\n    if (!q) { results.value = []; return }\n    timer = setTimeout(async () => {\n      loading.value = true\n      results.value = await api.search(q) // one call after typing stops\n      loading.value = false\n    }, 300)\n  }\n  onUnmounted(() => clearTimeout(timer)) // avoid setting state after unmount\n  return { results, loading, search }\n}`,
      explanation: [
        'A debounced search fires the API only after the user pauses typing, not on every keystroke.',
        '`timer` is private closure state held by the composable, just like the makeCounter pattern.',
        'Empty query short-circuits to clear results without scheduling a call.',
        'onUnmounted clears the timer so we do not set reactive state after the component is gone (avoids a leak/warning).',
        'In React this is a useCallback(debounce(...)) plus a cleanup in useEffect; same idea.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is debounce and when would you use it?',
      answer: 'Debounce delays running a function until a quiet period has passed since the last call, so a burst of rapid events triggers it only once. Use it for search-as-you-type, autosave, window resize, and input validation.',
      explanation: 'The signal is "run once after activity stops" plus a concrete use case — search is the canonical one.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between debounce and throttle?',
      answer: 'Debounce waits for a pause and runs once after the bursts stop. Throttle runs at most once per interval during continuous activity. Debounce = "wait until quiet", throttle = "at most every N ms".',
      explanation: 'The clean one-line contrast — quiet-gap vs fixed-rate — is what separates a confident answer.',
    },
    {
      level: 'intermediate',
      question: 'Implement debounce from scratch.',
      answer: 'Use a closure to hold a timer; on each call clearTimeout the previous one and setTimeout the function for `delay` ms, calling it with fn.apply(this, args) to preserve this and the latest arguments.',
      explanation: 'They watch for: closure for the timer, clearTimeout-then-setTimeout, and correct this/arguments forwarding (not an arrow that loses this).',
    },
    {
      level: 'intermediate',
      question: 'Why use fn.apply(this, args) instead of just fn()?',
      answer: 'To preserve the calling context (this) — important when the debounced function is an object method or event handler — and to forward the latest arguments (like the event or input value) to the real function.',
      explanation: 'Tests understanding that the wrapper must be transparent about this and args; a frequent follow-up.',
    },
    {
      level: 'advanced',
      question: 'How do you add leading-edge invocation and a cancel method?',
      answer: 'Track whether a timer is currently pending; if leading is enabled and no timer exists, invoke immediately on the first call of a burst, then suppress until quiet. Expose cancel() that clearTimeouts and resets state so a pending trailing call never fires.',
      explanation: 'Leading/trailing options and cancel/flush show familiarity with lodash-grade implementations and real cleanup needs.',
    },
    {
      level: 'senior',
      question: 'How does debounce interact with stale closures and component lifecycles in React/Vue?',
      answer: 'A debounced callback captures variables from the render/scope where it was created; if recreated every render it loses its pending timer, and if not, it may read stale state. You memoize it (useMemo/useCallback or a composable) so the timer persists, read fresh state via refs or arguments, and cancel it on unmount to avoid setting state after teardown.',
      explanation: 'Senior signal: connecting debounce to closures, memoization, stale-closure bugs, and cleanup — the real-world pitfalls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you support both leading and trailing edges?',
    'How do you cancel a pending debounced call, and flush it immediately?',
    'What happens to `this` if you use an arrow function for the wrapper?',
    'How would you make a debounced function return a promise that resolves with the eventual result?',
    'When is throttle the better choice than debounce?',
    'How do you test debounce deterministically? (fake timers / jest.useFakeTimers)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to clearTimeout before scheduling the next run.',
      why: 'Without clearing, every call schedules its own timeout and the function fires multiple times — defeating debounce entirely.',
      fix: 'Always clearTimeout(timer) at the start of each call, then reschedule.',
    },
    {
      mistake: 'Using an arrow function wrapper when this matters, or calling fn() without apply.',
      why: 'The arrow captures lexical this and you drop the call-site this/arguments, breaking object methods and event handlers.',
      fix: 'Use a regular function wrapper and fn.apply(this, args) to forward context and the latest args.',
    },
    {
      mistake: 'Recreating the debounced function on every React render (new closure each time).',
      why: 'A fresh function has a fresh, empty timer, so debouncing never actually accumulates — it fires on every render/keystroke.',
      fix: 'Memoize it (useMemo/useCallback) or define it once in a composable so the timer persists.',
    },
    {
      mistake: 'Not cancelling the pending call on unmount.',
      why: 'The delayed callback fires after the component is gone, setting state on a dead component (leak/warning) or doing useless work.',
      fix: 'Expose and call cancel() (clearTimeout) in onUnmounted / useEffect cleanup.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Debounced search/autosave in composables holding the timer in closure; VueUse provides useDebounceFn and watchDebounced, and cleanup happens on scope dispose.' },
    { area: 'React', detail: 'Debounced inputs via useMemo(() => debounce(fn, 300), []) with a cleanup that cancels on unmount; hooks like useDebounce/useDebouncedCallback wrap this and address stale-closure reads.' },
    { area: 'Node.js', detail: 'Debouncing filesystem watch events (chokidar bursts), batching log flushes, or coalescing rapid config-reload triggers into a single reload.' },
    { area: 'Backend', detail: 'Coalescing rapid downstream invalidations or webhook bursts into one expensive recompute, and debouncing metric/aggregate writes to reduce DB pressure.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Drastically cuts redundant work: one API call/render/recalc after a burst instead of dozens.',
      'Reduces server load, bandwidth, and race conditions from overlapping in-flight requests.',
    ],
    bad: [
      'Adds perceived latency: results appear only after the quiet period (e.g. 300ms after the last keystroke).',
      'Too-long a delay feels sluggish; too-short defeats the purpose — tuning is required.',
    ],
    optimizations: [
      'Pick the delay to match human pause behavior (200–400ms for typing) and the cost of the action.',
      'Use leading-edge for the first action to feel instant, trailing for the final accurate result.',
      'Combine with request cancellation (AbortController) so a late debounced fetch does not overwrite a newer one.',
      'Cancel pending calls on navigation/unmount to avoid wasted work.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['closure', 'timers', 'this-keyword', 'call-apply-bind', 'higher-order-functions'],
    nextConcepts: ['throttle', 'requestanimationframe', 'abortcontroller', 'event-delegation'],
    dependencyNote:
      'Debounce is closures + setTimeout + this/arguments forwarding combined; understand those first. Its sibling is throttle, and in production it pairs with AbortController to cancel stale fetches and with rAF for visual updates.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write debounce(fn, delay) returning a function, with `let timer` outside it (the closure).',
      'Inside, clearTimeout(timer) first — say "cancel the previous countdown".',
      'Then timer = setTimeout(() => fn.apply(this, args), delay) — say "schedule a fresh run".',
      'Explain: rapid calls keep resetting, so fn runs only after a quiet gap.',
      'Stress fn.apply(this, args) for correct this and latest arguments.',
      'Mention extensions: leading/trailing, cancel, flush — and contrast with throttle (fixed rate).',
    ],
    diagram: `  debounce(fn, delay):
    let timer
    return function(...args) {
      clearTimeout(timer)            // cancel pending
      timer = setTimeout(() =>
        fn.apply(this, args),        // latest args + this
        delay)
    }
  burst → reset, reset, reset … quiet → FIRE once`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Debounce wraps a function so it runs only after a quiet gap since the last call — a burst of events triggers one execution. It uses a closure-held timer: each call clears the previous setTimeout and schedules a new one, calling fn.apply(this, args) for correct context and latest args. Perfect for search-as-you-type, autosave, and resize. Watch out for losing this with arrow wrappers, recreating it every render, and forgetting to cancel on unmount. Its sibling throttle runs at a fixed max rate instead of waiting for quiet.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Debounce is a higher-order function that delays running the wrapped function until a configurable quiet period has passed since the last call. The classic case is search-as-you-type: instead of firing an API request on every keystroke, I want one request after the user pauses. I implement it with a closure that holds a timer id. The returned function, on every call, first does clearTimeout on the previous timer — cancelling any pending run — then schedules a new setTimeout for the delay. Because each call resets the timer, a continuous burst never lets the timeout fire; only an uninterrupted gap does. I run the function with fn.apply(this, args) so it keeps the correct this when used as an object method or event handler and receives the latest arguments. A production-grade version adds options: leading-edge to fire immediately on the first call so the UI feels responsive, trailing-edge for the final accurate run, plus cancel() to drop a pending call and flush() to run it now. The pitfalls I watch for: using an arrow wrapper loses this; recreating the debounced function every render in React gives it a fresh empty timer so it never debounces — I memoize it; and I always cancel on unmount so a late callback does not set state on a dead component. Its sibling is throttle, which runs at most once per interval during continuous activity rather than waiting for things to go quiet.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Debounce (responsive but delayed; coalesces a burst into one) vs throttle (regular cadence; better for continuous progress like scroll).',
      'Leading edge (instant feedback) vs trailing edge (final accurate value) vs both (instant + correct, with care to avoid double work).',
      'Longer delay (fewer calls, more latency) vs shorter delay (snappier, more calls) — tuned per action cost and human behavior.',
    ],
    edgeCases: [
      'Arrow wrapper or bare fn() drops this and arguments — breaks methods/handlers.',
      'Recreated-per-render closures reset the timer, silently disabling debouncing.',
      'Trailing fetch can resolve after a newer one — needs AbortController/last-write-wins guard to avoid stale UI.',
      'flush/cancel timing around unmount: a flush after teardown can still touch dead state.',
    ],
    runtimeBehavior: [
      'The scheduled callback is a macrotask; it cannot run before the current synchronous burst and any microtasks complete.',
      'Timer resolution and background-tab throttling can stretch the effective delay beyond the requested value.',
      'Each reset discards the prior pending macrotask, so memory of superseded args is released.',
    ],
    scalability: [
      'On the client, debounce caps event-driven work regardless of how fast users type — bounded API/render load.',
      'On the server, debouncing/coalescing rapid invalidations or webhooks turns bursty load into steady, predictable work.',
    ],
    productionConcerns: [
      'Always pair debounced fetches with request cancellation to prevent out-of-order responses overwriting fresh data.',
      'Cancel on route change/unmount; otherwise late callbacks waste work or warn about setting state after teardown.',
      'Test with fake timers (jest.useFakeTimers) for deterministic behavior; real timers make tests flaky.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Debounce = run once after a quiet gap since the last call.',
    'Pattern: closure timer → clearTimeout → setTimeout(fn, delay).',
    'Use fn.apply(this, args) for correct this + latest args.',
    'Trailing edge (default) = run after burst ends; leading = run on first call.',
    'Add cancel() and flush() for real apps.',
    'Use for: search-as-you-type, autosave, resize, validation.',
    'Debounce = "wait until quiet"; throttle = "at most every N ms".',
    'Arrow wrapper loses this — use a regular function.',
    'Recreating it each render resets the timer — memoize it.',
    'Cancel on unmount to avoid setting state after teardown.',
    'Pair with AbortController to drop stale fetch responses.',
    'Test with fake timers for determinism.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write debounce(fn, delay) so that calling the returned function rapidly only runs fn once after the calls stop.',
      hint: 'Hold a timer in a closure; clearTimeout then setTimeout on each call.',
      solution: {
        lang: 'js',
        code: `function debounce(fn, delay = 300) {\n  let timer\n  return function (...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n}`,
        explanation: [
          'timer is private closure state shared across calls.',
          'clearTimeout cancels the previous pending run so only the last survives.',
          'fn.apply(this, args) forwards context and the latest arguments.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add a cancel() method to your debounce so a pending call can be aborted.',
      hint: 'Store the timer where the method can clear it; reset state too.',
      solution: {
        lang: 'js',
        code: `function debounce(fn, delay = 300) {\n  let timer\n  function debounced(...args) {\n    clearTimeout(timer)\n    timer = setTimeout(() => fn.apply(this, args), delay)\n  }\n  debounced.cancel = () => { clearTimeout(timer); timer = null }\n  return debounced\n}\nconst d = debounce(() => console.log('run'), 500)\nd(); d.cancel() // nothing runs`,
        explanation: [
          'cancel() clears the pending timeout so the scheduled fn never fires.',
          'Setting timer = null marks that nothing is pending (useful for leading-edge logic).',
          'This is essential for unmount cleanup in components.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement debounce with leading and trailing options, defaulting to trailing only.',
      hint: 'Track if a timer is pending; fire on the first call if leading; fire at the end if trailing and args are pending.',
      solution: {
        lang: 'js',
        code: `function debounce(fn, delay = 300, { leading = false, trailing = true } = {}) {\n  let timer = null, lastArgs = null, lastThis\n  return function (...args) {\n    lastArgs = args; lastThis = this\n    const callNow = leading && !timer\n    clearTimeout(timer)\n    timer = setTimeout(() => {\n      timer = null\n      if (trailing && lastArgs) { fn.apply(lastThis, lastArgs); lastArgs = null }\n    }, delay)\n    if (callNow) { fn.apply(lastThis, lastArgs); lastArgs = null }\n  }\n}`,
        explanation: [
          'callNow detects the first call of a burst (leading enabled, no timer pending).',
          'On leading we invoke immediately and null lastArgs so trailing does not double-fire the same args.',
          'On the timeout, trailing fires only if there are pending args (i.e. calls happened after the leading one).',
          'This matches lodash semantics: leading=true,trailing=true fires at both ends of a burst.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a debounced async search that returns a promise resolving with the latest results, cancelling superseded calls.',
      hint: 'Reject/ignore old promises; resolve only the most recent scheduled run; use AbortController for the fetch.',
      solution: {
        lang: 'js',
        code: `function debounceAsync(fn, delay = 300) {\n  let timer, controller\n  return function (...args) {\n    clearTimeout(timer)\n    if (controller) controller.abort() // cancel in-flight\n    controller = new AbortController()\n    const signal = controller.signal\n    return new Promise((resolve, reject) => {\n      timer = setTimeout(async () => {\n        try { resolve(await fn(...args, signal)) }\n        catch (e) { if (e.name !== 'AbortError') reject(e) }\n      }, delay)\n    })\n  }\n}\n// fn receives the signal: (q, signal) => fetch('/s?q='+q, { signal }).then(r => r.json())`,
        explanation: [
          'Each call clears the timer AND aborts any in-flight request from a previous call.',
          'A fresh AbortController per call lets the fetch be cancelled if superseded.',
          'The returned promise resolves only when the latest scheduled run completes.',
          'AbortError is swallowed so cancelled calls do not reject the consumer — only real errors do.',
          'This solves the out-of-order-response problem that plagues naive debounced search.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Debounce is the most common "implement this utility" interview question because it tests closures, timers, and this/arguments in one shot — and you will use it in nearly every UI you build. Nailing it signals practical front-end competence.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the definition and the debounce-vs-throttle difference. Product companies (Zoho, Flipkart, Razorpay) ask you to implement it from scratch, then extend it with cancel/leading/trailing. FAANG-level interviews probe stale closures in React, out-of-order responses, and testing with fake timers.',
    whatInterviewersExpect:
      'They expect a correct from-scratch implementation (closure timer, clearTimeout, fn.apply for this/args), the contrast with throttle, awareness of leading/trailing/cancel, and the real pitfalls — recreating it per render, losing this, and cancelling on unmount.',
  },
}

export default debounce
