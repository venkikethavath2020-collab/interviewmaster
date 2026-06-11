import type { ConceptLesson } from '../../../types/lesson'

const requestanimationframe: ConceptLesson = {
  // 1. Concept Summary
  slug: 'requestanimationframe',
  name: 'requestAnimationFrame',
  category: 'performance',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'requestAnimationFrame (rAF) is the correct way to do JavaScript animation and visual updates — it syncs your code to the browser’s paint cycle so motion is smooth and never wasted.',
    'Animating with setInterval/setTimeout produces janky, frame-misaligned motion and keeps running uselessly in background tabs; rAF fixes both by aligning with the display refresh and pausing when hidden.',
    'It is the foundation of jank-free scroll effects, drag, canvas/WebGL rendering, and batching DOM reads/writes to avoid layout thrashing.',
    'Interviewers ask it to test whether you understand the rendering pipeline and the event loop’s render step — not just timers.',
    'Getting it wrong (animating with timers, forgetting to cancel, doing heavy work inside the callback) causes dropped frames and battery drain that ship to production.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'requestAnimationFrame is like telling a flip-book artist "draw the next picture right before each page flips" instead of guessing when to draw.',
    story: [
      'A cartoon is just many pictures shown quickly, one after another, so it looks like things move.',
      'Imagine you are the artist. If you draw new pictures at random times, some pages will be blank or doubled, and the cartoon will look jerky.',
      'Instead, the projector taps you on the shoulder right before each page is shown and says "okay, draw the next frame now." You always draw at exactly the right moment.',
      'requestAnimationFrame is that tap on the shoulder. The browser tells your code "I am about to paint the screen — update your animation now," so everything stays perfectly smooth.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Screens refresh many times a second (usually 60), and to animate smoothly your code should update right before each refresh.',
    'requestAnimationFrame asks the browser to run your function once, just before the next repaint, so your changes appear in that frame.',
    'Because it is tied to the screen’s rhythm, it adapts to fast displays (90/120Hz) and pauses automatically when the tab is hidden, saving battery.',
    'To keep an animation going you call requestAnimationFrame again from inside the callback, creating a loop that runs once per frame.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'requestAnimationFrame(callback) schedules a function to run once, just before the browser’s next repaint. The callback receives a high-resolution timestamp. To animate continuously you re-schedule from inside the callback, and you stop with cancelAnimationFrame(id).',
    how: 'The browser maintains a list of rAF callbacks; on each frame, after handling events and before painting, it runs them in order, passing the frame’s timestamp. Your callback reads that timestamp, updates positions/styles, and requests the next frame.',
    why: 'It aligns visual updates with the display refresh rate, producing smooth motion, avoiding wasted work between frames, and automatically pausing in background tabs — none of which timers give you.',
    code: {
      label: 'A simple rAF animation loop',
      lang: 'js',
      code: `const box = document.querySelector('#box')\nlet start = null\nfunction step(timestamp) {\n  if (start === null) start = timestamp\n  const elapsed = timestamp - start          // ms since animation began\n  box.style.transform = 'translateX(' + Math.min(elapsed / 5, 300) + 'px)'\n  if (elapsed < 1500) requestAnimationFrame(step) // keep going\n}\nconst id = requestAnimationFrame(step)\n// to stop early: cancelAnimationFrame(id)`,
      explanation: [
        'requestAnimationFrame(step) schedules step to run before the next paint, passing a timestamp.',
        'We compute elapsed time from the timestamp, so motion is based on TIME, not frame count — consistent across refresh rates.',
        'We update the transform once per frame; the browser paints it in that frame.',
        'Calling requestAnimationFrame(step) again inside step continues the loop until we stop.',
        'cancelAnimationFrame(id) cancels a pending frame (e.g. on unmount or when the animation ends).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'requestAnimationFrame is a browser scheduling API that registers a callback to be invoked once, immediately before the next repaint within the event loop’s rendering step. The callback receives a DOMHighResTimeStamp (the same time base as performance.now()) marking the frame start. Its cadence matches the display’s refresh rate (typically ~60Hz, but adaptive to 90/120Hz), it is throttled or suspended for background/hidden tabs, and it returns an id cancellable via cancelAnimationFrame. It is the correct primitive for time-based animation and for batching DOM mutations to align with the paint cycle, avoiding the drift and waste of setTimeout/setInterval.',

  // 7. Internal Working
  internalWorking: [
    'Each turn of the event loop, after running tasks and microtasks, the browser may enter the rendering step if it is time to paint a frame (gated by the display’s refresh interval, e.g. ~16.7ms at 60Hz).',
    'In that step the browser runs the queued requestAnimationFrame callbacks in registration order, each receiving the same frame timestamp.',
    'After the callbacks, the browser performs style recalculation, layout, paint, and compositing for that frame — so style/DOM changes made in the callback are applied in the SAME frame.',
    'Callbacks scheduled DURING a frame’s rAF run are deferred to the NEXT frame, not the current one — this is how the per-frame loop stays one-callback-per-frame.',
    'When the tab is hidden or the page is not visible, the browser stops issuing frames, so rAF callbacks pause entirely (saving CPU/battery); they resume on visibility.',
    'The cadence is variable: it follows the actual refresh rate and can drop frames under load, which is why time-based math (using the timestamp delta) is required instead of assuming a fixed 16ms.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   EVENT LOOP, one frame (~16.7ms @ 60Hz)

   ┌── tasks (timers, events) ──┐
   │                            │
   ├── microtasks (promises) ───┤
   │                            │
   ├── requestAnimationFrame ───┤  ← YOUR animation update here
   │   callbacks run            │
   │                            │
   └── style → layout → paint ──┘  ← browser renders the frame
                  │
                  ▼  repeat next frame (rAF re-scheduled inside callback)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each pending rAF callback is referenced by the browser until the frame runs; an uncancelled self-scheduling loop keeps its closure (and captured DOM/state) alive forever.',
    'The returned frame id is just a number; cancelAnimationFrame(id) removes the callback so its closure can be collected.',
    'Heavy objects captured in the callback closure stay on the heap for the life of the loop — capture minimally.',
    'A loop that keeps requesting frames after a component unmounts is a classic leak (and wasted CPU) — always cancel on teardown.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — time-based movement (refresh-rate independent)',
      lang: 'js',
      code: `let prev = performance.now()\nlet x = 0\nfunction loop(now) {\n  const dt = now - prev          // ms since last frame\n  prev = now\n  x += 0.2 * dt                  // move at 0.2px per ms = 200px/sec\n  el.style.transform = 'translateX(' + x + 'px)'\n  if (x < 400) requestAnimationFrame(loop)\n}\nrequestAnimationFrame(loop)`,
      explanation: [
        'We compute dt (delta time) between frames using the timestamp.',
        'Multiplying speed by dt makes motion consistent whether the screen is 60Hz or 120Hz.',
        'Frame-count-based math (x += 2 per frame) would move twice as fast on a 120Hz display — a real bug.',
        'The loop continues until the target is reached, then stops requesting frames.',
      ],
    },
    intermediate: {
      label: 'Intermediate — rAF-throttled scroll handler',
      lang: 'js',
      code: `let ticking = false\nwindow.addEventListener('scroll', () => {\n  if (ticking) return\n  ticking = true\n  requestAnimationFrame(() => {\n    const y = window.scrollY\n    header.classList.toggle('shrink', y > 50)  // visual update once per frame\n    ticking = false\n  })\n}, { passive: true })`,
      explanation: [
        'Scroll fires far more often than the screen repaints; doing DOM work on every event is wasted.',
        'The `ticking` flag ensures at most one rAF (one DOM update) per frame.',
        'Reading scrollY and toggling a class inside rAF aligns the change with the paint, avoiding jank.',
        'passive: true lets the browser scroll without waiting on this handler.',
        'This is the canonical pattern for scroll-linked visual effects.',
      ],
    },
    advanced: {
      label: 'Advanced — batch DOM reads then writes to avoid layout thrashing',
      lang: 'js',
      code: `function animateWidths(items) {\n  requestAnimationFrame(() => {\n    // READ phase: measure everything first\n    const widths = items.map((el) => el.offsetWidth)\n    // WRITE phase: now mutate (no interleaved reads → no forced reflow)\n    items.forEach((el, i) => {\n      el.style.width = widths[i] * 1.1 + 'px'\n    })\n  })\n}`,
      explanation: [
        'Interleaving reads (offsetWidth) and writes (style.width) forces the browser to recompute layout repeatedly — layout thrashing.',
        'Inside rAF we batch ALL reads first, then ALL writes, so layout is computed once.',
        'Doing this inside rAF aligns the single reflow with the frame the browser is about to paint.',
        'This pattern (read-then-write, in rAF) is the core of libraries like fastdom.',
      ],
    },
    realProject: {
      label: 'Real project — rAF loop cleanup in a Vue component',
      lang: 'js',
      code: `import { onMounted, onUnmounted } from 'vue'\n\nexport function useRafLoop(update) {\n  let id = null\n  function frame(t) { update(t); id = requestAnimationFrame(frame) }\n  onMounted(() => { id = requestAnimationFrame(frame) })\n  onUnmounted(() => { if (id !== null) cancelAnimationFrame(id) }) // stop the loop\n  return { stop: () => id !== null && cancelAnimationFrame(id) }\n}`,
      explanation: [
        'The loop self-schedules with requestAnimationFrame on each frame.',
        'We keep the latest frame id so we can cancel it.',
        'onUnmounted calls cancelAnimationFrame — without it the loop runs forever, leaking the closure and burning CPU.',
        'In React this is a useEffect that starts the loop and returns cancelAnimationFrame as cleanup; VueUse provides useRafFn with this built in.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is requestAnimationFrame and why use it over setInterval for animation?',
      answer: 'rAF schedules a callback to run just before the next repaint, syncing updates to the display refresh rate. Unlike setInterval it produces smooth, frame-aligned motion, adapts to the screen’s refresh rate, and pauses automatically in background tabs — saving CPU and battery.',
      explanation: 'The signal is "synced to paint / refresh rate" plus "pauses when hidden" — the two big wins over timers.',
    },
    {
      level: 'beginner',
      question: 'How do you create a continuous animation loop with rAF?',
      answer: 'Call requestAnimationFrame again from inside the callback. Each frame updates the visual state and schedules the next frame, until a stop condition is met or you call cancelAnimationFrame.',
      explanation: 'Tests whether they know rAF is one-shot and must be re-scheduled to loop.',
    },
    {
      level: 'intermediate',
      question: 'Why should animation math use the timestamp delta instead of a fixed step per frame?',
      answer: 'Because the frame rate varies — 60Hz, 120Hz, or dropped frames under load. Using elapsed time (dt) makes motion run at a consistent real-world speed; a fixed per-frame step runs twice as fast on a 120Hz display and stutters when frames drop.',
      explanation: 'Time-based vs frame-based animation is the key correctness insight; mentioning 120Hz displays shows depth.',
    },
    {
      level: 'intermediate',
      question: 'How does rAF help with scroll performance?',
      answer: 'Scroll events fire far more often than the screen repaints, so doing DOM work on each one is wasted and janky. Throttling with rAF (a ticking flag that schedules one rAF per frame) ensures the visual update happens at most once per frame, aligned with painting.',
      explanation: 'The ticking-flag rAF-throttle pattern is what they want to hear.',
    },
    {
      level: 'advanced',
      question: 'Where does rAF run in the event loop relative to microtasks and painting?',
      answer: 'On each frame, the browser runs tasks, then drains microtasks, then runs rAF callbacks, then performs style/layout/paint/composite. So DOM changes made in an rAF callback are applied in that same frame, and callbacks scheduled during the run are deferred to the next frame.',
      explanation: 'Placing rAF precisely in the render step (after microtasks, before paint) is the senior-leaning detail.',
    },
    {
      level: 'senior',
      question: 'How do rAF, requestIdleCallback, and the Scheduler API divide work across a frame?',
      answer: 'rAF runs high-priority visual updates right before paint. requestIdleCallback runs low-priority work during idle time at the end of a frame, when there is budget. The Scheduler API (scheduler.postTask / scheduler.yield) gives explicit priorities and lets you yield to keep the main thread responsive. Together they keep frames under the ~16ms budget so the UI never blocks.',
      explanation: 'Senior signal: understanding the whole frame budget and which API to use for visual vs background vs prioritized work.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What argument does the rAF callback receive, and what time base is it? (DOMHighResTimeStamp, same as performance.now)',
    'How do you stop an rAF loop? (cancelAnimationFrame with the saved id)',
    'What happens to rAF callbacks when the tab is in the background?',
    'How would you throttle a scroll handler with rAF?',
    'What is layout thrashing and how does rAF + read/write batching avoid it?',
    'When would you use requestIdleCallback instead of rAF?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using setInterval/setTimeout for animation instead of rAF.',
      why: 'Timers are not synced to the refresh rate, causing jank and tearing, and keep firing in background tabs wasting CPU/battery.',
      fix: 'Use requestAnimationFrame for any visual update; it aligns with paint and pauses when hidden.',
    },
    {
      mistake: 'Frame-count-based animation (move N px per frame).',
      why: 'Speed becomes tied to refresh rate — twice as fast on 120Hz, stuttery when frames drop.',
      fix: 'Use the timestamp delta (dt) so motion is time-based and consistent.',
    },
    {
      mistake: 'Forgetting cancelAnimationFrame on unmount/stop.',
      why: 'The self-scheduling loop runs forever, leaking the closure and burning CPU even when nothing is visible.',
      fix: 'Save the frame id and call cancelAnimationFrame in cleanup (onUnmounted / useEffect return).',
    },
    {
      mistake: 'Doing heavy work or interleaved DOM reads/writes inside the callback.',
      why: 'A long callback blows the frame budget (dropped frames), and read-after-write forces synchronous reflows (layout thrashing).',
      fix: 'Keep callbacks light, batch reads then writes, and offload heavy compute to a Web Worker.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Scroll-linked effects, drag/resize handles, and canvas/chart redraws use rAF; VueUse’s useRafFn and useTransition run updates per frame and cancel on scope dispose.' },
    { area: 'React', detail: 'rAF loops live in useEffect with cancelAnimationFrame cleanup; animation libraries (Framer Motion, react-spring) and chart libs drive interpolation via rAF for smooth 60fps motion.' },
    { area: 'Node.js', detail: 'Not available on the server (no display); the analogous primitives are setImmediate/setTimeout and the event loop phases — interviewers may contrast rAF as browser-only.' },
    { area: 'Backend', detail: 'N/A for rendering, but the conceptual parallel is scheduling work to a tick/budget; SSR frameworks avoid rAF and hydrate animations on the client.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Aligns updates with the paint cycle, eliminating tearing and producing smooth 60/120fps motion.',
      'Pauses in background/hidden tabs, saving CPU and battery automatically.',
      'Enables read/write batching to avoid forced synchronous reflows.',
    ],
    bad: [
      'A heavy callback exceeding the frame budget (~16ms) drops frames and janks the UI.',
      'An uncancelled loop wastes CPU and leaks memory after the visual is gone.',
    ],
    optimizations: [
      'Animate compositor-friendly properties (transform, opacity) so frames skip layout/paint and run on the GPU.',
      'Use the timestamp delta for time-based motion that survives frame drops.',
      'rAF-throttle high-frequency events (scroll) to one update per frame.',
      'Offload heavy computation to a Web Worker; keep the rAF callback to DOM/style writes only.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'macrotask-queue', 'microtask-queue', 'timers', 'browser-rendering-pipeline'],
    nextConcepts: ['throttle', 'long-task-scheduling', 'web-workers', 'core-web-vitals'],
    dependencyNote:
      'rAF sits in the event loop’s rendering step, so understand the event loop, micro/macrotasks, and the rendering pipeline first. It pairs with throttle (rAF-throttling), long-task scheduling (requestIdleCallback/Scheduler), and Web Workers for offloading, and underpins good Core Web Vitals.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw one frame of the event loop: tasks → microtasks → rAF callbacks → style/layout/paint.',
      'Point at rAF and say "this runs right before paint, once per frame."',
      'Write the loop: function step(t){ update(t); requestAnimationFrame(step) } and start it.',
      'Stress time-based math: use t delta (dt), not a fixed per-frame step, for refresh-rate independence.',
      'Mention it pauses in background tabs and is cancelled with cancelAnimationFrame(id).',
      'Add the scroll pattern: a ticking flag → one rAF update per frame.',
    ],
    diagram: `  one frame:
    tasks → microtasks → [ rAF callbacks ] → style→layout→paint
                              │
            function step(t){ update(t); requestAnimationFrame(step) }
                              │
            dt = t - prev   (time-based, refresh-rate independent)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'requestAnimationFrame schedules a callback to run just before the next repaint, syncing visual updates to the display refresh rate. Loop by re-calling it inside the callback; stop with cancelAnimationFrame. Use the timestamp delta for time-based motion so it is consistent across 60/120Hz and survives dropped frames. It runs after microtasks and before paint in the event loop, pauses in background tabs, and enables read-then-write batching to avoid layout thrashing. Prefer it over setInterval for animation and rAF-throttle scroll handlers to one update per frame.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'requestAnimationFrame is the browser’s API for scheduling work right before the next repaint. You pass a callback, and the browser runs it once, during the rendering step of the event loop — after tasks and microtasks, just before it does style, layout, paint, and compositing. That timing is the whole point: any DOM or style change I make inside the callback is painted in that same frame, perfectly aligned with the display. To animate continuously I re-call requestAnimationFrame from inside the callback, forming a loop that runs once per frame, and I stop it with cancelAnimationFrame using the id it returns. The callback receives a high-resolution timestamp, and I always drive motion off the time delta between frames rather than a fixed step per frame — otherwise the animation runs twice as fast on a 120Hz display and stutters when frames drop. Compared to setInterval, rAF is synced to the refresh rate so it is smooth, and it automatically pauses when the tab is hidden, saving CPU and battery. Two patterns I use constantly: rAF-throttling scroll handlers with a ticking flag so the DOM updates at most once per frame, and batching all DOM reads before all writes inside the callback to avoid layout thrashing. The one rule I never break is cancelling the loop on unmount — an uncancelled rAF loop runs forever, leaking its closure and wasting CPU even when nothing is visible.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'rAF (frame-aligned, adaptive to refresh rate, pauses when hidden) vs timers (predictable interval but unsynced and wasteful in background).',
      'rAF for visual/high-priority work vs requestIdleCallback for low-priority background work within the same frame budget.',
      'Animating transform/opacity (compositor-only, cheap) vs layout-affecting properties (width/top — force reflow, expensive).',
    ],
    edgeCases: [
      'Callbacks scheduled during an rAF run are deferred to the next frame, not the current one.',
      'Background/hidden tabs suspend rAF entirely; long-running loops must tolerate gaps and resume gracefully.',
      'On high-refresh displays the cadence is faster than 60Hz; frame-count math breaks — use dt.',
      'Multiple independent rAF loops compound work per frame and can collectively blow the budget.',
    ],
    runtimeBehavior: [
      'rAF runs after microtasks and before paint; a promise resolved inside it processes before the paint, but a setTimeout fires in a later frame.',
      'The timestamp is the frame start (performance.now() base), shared by all callbacks in that frame.',
      'Heavy synchronous work in the callback extends the frame and drops subsequent frames.',
    ],
    scalability: [
      'Coalesce all per-frame work into a single rAF (one scheduler) rather than many loops to bound per-frame cost.',
      'Offload computation to Web Workers and use rAF only for DOM/style application, keeping the main thread free.',
      'Use the Scheduler API (postTask/yield) to interleave non-visual work without starving frames.',
    ],
    productionConcerns: [
      'Always cancel loops on unmount/visibility change to avoid CPU/battery drain and leaks.',
      'Monitor long tasks and frame timing (PerformanceObserver, the Long Animation Frames API) to catch jank.',
      'Prefer compositor-only properties and avoid layout reads inside the callback to keep frames under budget.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'rAF(callback) runs once just before the next repaint.',
    'Loop = re-call rAF inside the callback; stop = cancelAnimationFrame(id).',
    'Callback gets a DOMHighResTimeStamp (performance.now base).',
    'Drive motion by time delta (dt), not per-frame steps.',
    'Synced to refresh rate (60/90/120Hz); pauses in background tabs.',
    'Runs after microtasks, before style/layout/paint.',
    'Prefer over setInterval for any animation.',
    'rAF-throttle scroll: ticking flag → one update/frame.',
    'Batch DOM reads then writes inside rAF to avoid layout thrashing.',
    'Animate transform/opacity (compositor) for cheap frames.',
    'Cancel on unmount or it leaks + burns CPU.',
    'Pair with requestIdleCallback / Scheduler for non-visual work.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Animate an element from x=0 to x=300 over ~1 second using rAF, then stop.',
      hint: 'Track the start timestamp; compute elapsed; stop when elapsed exceeds the duration.',
      solution: {
        lang: 'js',
        code: `function slide(el, duration = 1000) {\n  let start = null\n  function step(t) {\n    if (start === null) start = t\n    const p = Math.min((t - start) / duration, 1) // 0..1 progress\n    el.style.transform = 'translateX(' + p * 300 + 'px)'\n    if (p < 1) requestAnimationFrame(step)\n  }\n  requestAnimationFrame(step)\n}`,
        explanation: [
          'Progress p is elapsed/duration, clamped to 1 — time-based, so it is refresh-rate independent.',
          'We update transform each frame and keep scheduling until p reaches 1.',
          'The loop self-terminates when the duration is reached.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write an rAF-throttle helper that runs a handler at most once per frame with the latest arguments.',
      hint: 'Use a scheduled flag; if a frame is pending, just update args.',
      solution: {
        lang: 'js',
        code: `function rafThrottle(fn) {\n  let pending = false, lastArgs\n  return function (...args) {\n    lastArgs = args\n    if (pending) return\n    pending = true\n    requestAnimationFrame(() => { pending = false; fn.apply(this, lastArgs) })\n  }\n}\nwindow.addEventListener('scroll', rafThrottle(() => updateHeader()), { passive: true })`,
        explanation: [
          'At most one rAF is pending; extra calls only refresh lastArgs.',
          'The handler runs once per frame with the most recent arguments.',
          'Ideal for scroll/resize/mousemove visual updates aligned to paint.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a start/stop animation loop with proper cleanup that you can cancel at any time.',
      hint: 'Keep the frame id; expose start and stop; guard double-start.',
      solution: {
        lang: 'js',
        code: `function createLoop(update) {\n  let id = null\n  function frame(t) { update(t); id = requestAnimationFrame(frame) }\n  return {\n    start() { if (id === null) id = requestAnimationFrame(frame) },\n    stop() { if (id !== null) { cancelAnimationFrame(id); id = null } },\n  }\n}\nconst loop = createLoop((t) => render(t))\nloop.start()\n// loop.stop() to cancel`,
        explanation: [
          'The loop self-schedules; we store the id so stop() can cancel the pending frame.',
          'Guarding on id === null prevents starting two loops by accident.',
          'stop() cancels and resets id, releasing the closure and stopping CPU work.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a Vue composable useRafFn(callback) that runs the callback every frame while active, with isActive control and automatic cleanup on unmount.',
      hint: 'Track active state and the frame id; expose pause/resume; cancel in onUnmounted.',
      solution: {
        lang: 'js',
        code: `import { ref, onUnmounted } from 'vue'\n\nexport function useRafFn(callback) {\n  const isActive = ref(false)\n  let id = null\n  function loop(t) {\n    if (!isActive.value) return\n    callback(t)\n    id = requestAnimationFrame(loop)\n  }\n  function resume() {\n    if (!isActive.value) { isActive.value = true; id = requestAnimationFrame(loop) }\n  }\n  function pause() {\n    isActive.value = false\n    if (id !== null) { cancelAnimationFrame(id); id = null }\n  }\n  onUnmounted(pause) // critical cleanup\n  resume()\n  return { isActive, pause, resume }\n}`,
        explanation: [
          'isActive gates the loop so pause stops scheduling new frames.',
          'resume guards against double-start; pause cancels the pending frame.',
          'onUnmounted(pause) guarantees the loop stops when the component is destroyed — no leak, no wasted CPU.',
          'This mirrors VueUse’s useRafFn; the React equivalent is the same logic inside useEffect with a cleanup return.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'rAF separates developers who animate by timer guesswork from those who understand the rendering pipeline. Knowing where it sits in the event loop and how to write time-based, cancellable loops is exactly the kind of performance depth product and FAANG interviews probe.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "rAF vs setInterval" conceptually. Product companies (Zoho, Flipkart, Razorpay) ask you to build an animation loop or rAF-throttle a scroll handler. FAANG-level interviews probe its place in the event loop, time-based vs frame-based motion, layout thrashing, and how it relates to requestIdleCallback and the Scheduler API.',
    whatInterviewersExpect:
      'They expect you to explain that rAF runs before paint and syncs to the refresh rate, write a correct loop with re-scheduling and cancelAnimationFrame, use time-delta math, and know the production patterns: rAF-throttling, read/write batching, compositor-friendly properties, and cleanup on unmount.',
  },
}

export default requestanimationframe
