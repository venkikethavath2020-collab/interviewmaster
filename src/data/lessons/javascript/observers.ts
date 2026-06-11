import type { ConceptLesson } from '../../../types/lesson'

const observers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'observers',
  name: 'Intersection / Mutation / Resize Observers',
  category: 'browser-dom',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Observers let you react to visibility, size, and DOM changes EFFICIENTLY — asynchronously and off the main-thread hot path — instead of polling with scroll/resize listeners.',
    'Before IntersectionObserver, lazy-loading and infinite scroll meant expensive scroll handlers that called getBoundingClientRect on every frame, causing jank; observers fixed that.',
    'They prevent whole classes of bugs and performance problems: layout thrashing from polling, missed mutations, and resize loops.',
    'Interviewers ask them to test whether you know the modern, performant DOM APIs and understand why callback-based observation beats event polling.',
    'Real features depend on them: lazy images, infinite scroll, scroll-spy nav, animate-on-scroll, auto-resizing components, and watching third-party DOM mutations.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Observers are like hiring a lookout who taps you on the shoulder only when something specific happens, so you do not have to keep checking yourself.',
    story: [
      'Imagine you are waiting for your friend to arrive at a party, but you do not want to keep running to the window every few seconds to check — that is tiring.',
      'Instead, you ask a friend to stand by the window and just tap you when your friend shows up. Now you can relax until the tap comes.',
      'Browsers have three such lookouts. One taps you when something scrolls into view (Intersection). One taps you when a box changes size (Resize).',
      'And one taps you when someone adds or removes things from the room (Mutation). Each lookout only bothers you when its specific thing happens, which saves a lot of energy.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Old way: to know if something was visible or had changed, your code had to keep asking the browser over and over (polling), which is slow.',
    'Observers flip this around: you tell the browser "watch this element and call my function when X happens", and then you wait.',
    'IntersectionObserver tells you when an element enters or leaves the visible area. ResizeObserver tells you when an element changes size. MutationObserver tells you when the HTML inside an element changes.',
    'Because the browser does the watching efficiently and calls you back asynchronously, your page stays smooth.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Observers are browser APIs that asynchronously notify a callback when something changes about observed elements. IntersectionObserver watches visibility relative to a root/viewport, ResizeObserver watches element size, and MutationObserver watches DOM tree/attribute/text changes.',
    how: 'You create an observer with a callback, then call `observe(target)` (with options). The browser invokes your callback with entries describing what changed, batched and off the critical scroll/layout path. You call `disconnect()` or `unobserve()` to stop.',
    why: 'They replace inefficient polling (scroll/resize listeners + getBoundingClientRect) with efficient, declarative, asynchronous observation — improving performance and correctness.',
    code: {
      label: 'IntersectionObserver: lazy-load an image',
      lang: 'js',
      code: `const io = new IntersectionObserver((entries) => {\n  for (const entry of entries) {\n    if (entry.isIntersecting) {\n      const img = entry.target\n      img.src = img.dataset.src     // load the real image\n      io.unobserve(img)            // stop watching once loaded\n    }\n  }\n}, { rootMargin: '200px' })       // start loading 200px before it enters view\n\ndocument.querySelectorAll('img[data-src]').forEach(img => io.observe(img))`,
      explanation: [
        '`new IntersectionObserver(callback, options)` creates the observer; the callback receives entries when visibility changes.',
        '`entry.isIntersecting` is true when the target enters the root (viewport by default).',
        '`rootMargin: "200px"` triggers the callback before the element is actually visible, so the image is ready in time.',
        '`unobserve` stops watching that image once loaded, freeing the observer\'s work.',
        'This replaces a scroll handler that would call getBoundingClientRect every frame.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Observer APIs provide asynchronous, callback-based change detection for DOM concerns. IntersectionObserver reports changes in the intersection of a target with an ancestor root (or the viewport), delivering entries with `isIntersecting`, `intersectionRatio`, and bounding rects, configured via `root`, `rootMargin`, and `threshold`. ResizeObserver reports changes to an element\'s content/border box via `contentRect`/`borderBoxSize`. MutationObserver reports DOM mutations (childList, attributes, characterData) for a subtree per a config object, delivering a batch of MutationRecords as a microtask. All batch notifications and run off the synchronous scroll/layout hot path, avoiding the forced reflows of polling approaches.',

  // 7. Internal Working
  internalWorking: [
    'You instantiate an observer with a callback and call `observe(target, options)`, registering the target with the browser\'s observer machinery.',
    'IntersectionObserver: the browser computes intersection asynchronously (typically tied to the rendering/frame loop) and queues an entry when a configured `threshold` is crossed; the callback runs later, not synchronously on scroll.',
    'ResizeObserver: the browser checks observed elements\' box sizes after layout each frame and queues entries when sizes change; the callback runs after layout but is designed to avoid infinite resize loops (it may report and break cycles).',
    'MutationObserver: DOM mutations are recorded as MutationRecords and the callback is delivered as a microtask after the current synchronous script completes, so multiple mutations are batched into one callback.',
    'Callbacks receive arrays of entries/records, letting you process a batch rather than one event at a time; you read change details from entry properties.',
    'Observers hold references to their targets and callback, so you must `unobserve`/`disconnect` to release them and allow garbage collection — otherwise they leak.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   YOU                         BROWSER (watches efficiently)
   ───                         ────────────────────────────
   new IntersectionObserver(cb,{root,rootMargin,threshold})
   io.observe(el) ───────────► tracks el vs root each frame
                               │ threshold crossed
                  cb(entries) ◄┘ (async, batched)

   new ResizeObserver(cb); ro.observe(el)  → cb on size change (post-layout)
   new MutationObserver(cb); mo.observe(el,{childList,subtree}) → cb (microtask)

   STOP: unobserve(el) / disconnect()  ← required to avoid leaks`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — ResizeObserver reacting to element size',
      lang: 'js',
      code: `const ro = new ResizeObserver((entries) => {\n  for (const entry of entries) {\n    const { width } = entry.contentRect\n    entry.target.classList.toggle('compact', width < 300)\n  }\n})\n\nro.observe(document.getElementById('card'))\n// later: ro.disconnect()`,
      explanation: [
        'ResizeObserver fires when the observed element\'s size changes — not the window, the element itself.',
        '`entry.contentRect` gives the new dimensions without calling getBoundingClientRect yourself.',
        'This enables true container/element queries (responding to the element, not the viewport).',
        '`disconnect` stops all observation and frees references.',
      ],
    },
    intermediate: {
      label: 'Intermediate — MutationObserver watching DOM changes',
      lang: 'js',
      code: `const mo = new MutationObserver((records) => {\n  for (const r of records) {\n    if (r.type === 'childList' && r.addedNodes.length) {\n      enhanceNewNodes(r.addedNodes) // e.g. attach behavior to injected content\n    }\n  }\n})\n\nmo.observe(document.getElementById('feed'), {\n  childList: true,   // watch added/removed children\n  subtree: true,     // and descendants\n})\n// later: mo.disconnect()`,
      explanation: [
        'MutationObserver reports DOM tree changes — useful when third-party code or async loads inject nodes.',
        'The config object opts into specific mutation types (`childList`, `attributes`, `characterData`).',
        '`subtree: true` extends watching to all descendants, not just direct children.',
        'Records are batched into one callback (a microtask), so you process a group at once.',
      ],
    },
    advanced: {
      label: 'Advanced — infinite scroll + scroll-spy with IntersectionObserver',
      lang: 'js',
      code: `// Infinite scroll: load more when a sentinel at the list end appears\nconst loader = new IntersectionObserver(([entry]) => {\n  if (entry.isIntersecting) loadNextPage()\n}, { rootMargin: '400px' })\nloader.observe(document.getElementById('sentinel'))\n\n// Scroll-spy: highlight nav for the section most in view\nconst spy = new IntersectionObserver((entries) => {\n  entries.forEach(e => {\n    if (e.isIntersecting) setActiveNav(e.target.id)\n  })\n}, { threshold: 0.5 })\ndocument.querySelectorAll('section').forEach(s => spy.observe(s))`,
      explanation: [
        'A "sentinel" element at the list end triggers `loadNextPage` when it scrolls near view — efficient infinite scroll with no scroll handler.',
        '`rootMargin: "400px"` preloads before the user reaches the bottom.',
        'For scroll-spy, `threshold: 0.5` fires when a section is at least half visible, marking it active.',
        'Both replace expensive per-frame scroll math with the browser\'s optimized intersection computation.',
      ],
    },
    realProject: {
      label: 'Real project — Vue/React lazy + auto-resize composable',
      lang: 'js',
      code: `// A Vue composable (or React hook) wrapping IntersectionObserver\nimport { ref, onMounted, onUnmounted } from 'vue'\n\nexport function useInView(options) {\n  const el = ref(null)\n  const inView = ref(false)\n  let io\n  onMounted(() => {\n    io = new IntersectionObserver(([e]) => { inView.value = e.isIntersecting }, options)\n    if (el.value) io.observe(el.value)\n  })\n  onUnmounted(() => io && io.disconnect()) // CRUCIAL cleanup\n  return { el, inView }\n}`,
      explanation: [
        'A composable/hook encapsulates the observer and exposes a reactive `inView` flag.',
        'It creates the observer on mount and observes the bound element.',
        'On unmount it calls `disconnect()` — without this, observers leak and keep elements alive.',
        'React\'s equivalent uses `useEffect` with the same create-on-mount, disconnect-on-cleanup shape.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem do observers solve compared to scroll/resize event listeners?',
      answer: 'They detect visibility, size, and DOM changes asynchronously and efficiently via callbacks, instead of running expensive logic (like getBoundingClientRect) on every scroll/resize event, which causes jank and forced reflows.',
      explanation: 'Framing observers as the performant replacement for polling is the core point.',
    },
    {
      level: 'beginner',
      question: 'What does IntersectionObserver do and name one use case?',
      answer: 'It notifies you when a target element enters or leaves a root (the viewport by default). Use cases: lazy-loading images, infinite scroll, animate-on-scroll, and scroll-spy navigation.',
      explanation: 'Knowing the API plus a concrete use shows practical familiarity.',
    },
    {
      level: 'intermediate',
      question: 'What do `threshold` and `rootMargin` control in IntersectionObserver?',
      answer: '`threshold` is the visibility ratio(s) at which the callback fires (e.g. 0 = any pixel, 0.5 = half visible, 1 = fully). `rootMargin` grows/shrinks the root\'s bounding box, letting you trigger before/after the element is actually visible (e.g. preloading 200px early).',
      explanation: 'Precise control of when the callback fires is the intermediate-level detail.',
    },
    {
      level: 'intermediate',
      question: 'When is MutationObserver appropriate, and how are its callbacks delivered?',
      answer: 'When you must react to DOM changes you do not control — third-party scripts, async-injected content, or contenteditable edits. Its callback is delivered as a microtask after the current script, batching multiple MutationRecords into one call.',
      explanation: 'The batching/microtask delivery and "DOM you do not control" use case are key.',
    },
    {
      level: 'advanced',
      question: 'How does ResizeObserver avoid (or warn about) infinite resize loops?',
      answer: 'ResizeObserver runs after layout; if a callback resizes the observed element, that triggers another notification. The spec processes observations in a controlled loop and, to prevent infinite loops, defers deeper changes to the next frame and may emit a "ResizeObserver loop completed with undelivered notifications" warning.',
      explanation: 'Awareness of the loop-guard behavior signals real production experience.',
    },
    {
      level: 'senior',
      question: 'What are the memory and lifecycle pitfalls of observers?',
      answer: 'Observers hold strong references to their targets and callbacks; failing to `unobserve`/`disconnect` on teardown leaks both the observer and the observed DOM (and anything the callback closes over). In SPAs you must disconnect in component cleanup. Also, callbacks are async/batched, so state read inside may be slightly stale relative to synchronous code.',
      explanation: 'Connecting observers to GC, leaks, and SPA cleanup is the senior expectation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why is IntersectionObserver better than a scroll handler for lazy loading?',
    'What is the difference between `unobserve` and `disconnect`?',
    'How do you observe size of an element vs the window? (ResizeObserver vs resize event)',
    'Are observer callbacks synchronous? When do they run?',
    'How do you avoid leaking observers in a Vue/React component?',
    'How would you build animate-on-scroll with IntersectionObserver?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Never calling `disconnect`/`unobserve` on teardown.',
      why: 'Observers keep strong references to targets and callbacks, leaking memory and DOM in SPAs.',
      fix: 'Disconnect in component cleanup (`onUnmounted`/`useEffect` return); unobserve elements you no longer need.',
    },
    {
      mistake: 'Using scroll listeners + getBoundingClientRect for visibility.',
      why: 'It runs on every scroll event and forces synchronous layout, causing jank.',
      fix: 'Use IntersectionObserver, which computes intersection asynchronously and efficiently.',
    },
    {
      mistake: 'Resizing the observed element inside a ResizeObserver callback.',
      why: 'It can cause resize loops and the "undelivered notifications" warning.',
      fix: 'Avoid mutating the observed element\'s size in the callback, or defer changes to the next frame.',
    },
    {
      mistake: 'Expecting observer callbacks to run synchronously.',
      why: 'They are batched and asynchronous (rAF-aligned or microtask), so synchronous reads after observe() see no entries yet.',
      fix: 'Treat the callback as the source of truth; do not assume immediate firing.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables like `useIntersectionObserver`/`useResizeObserver` (VueUse) wrap these APIs with automatic cleanup on unmount; used for lazy images, infinite scroll, and container-query-style responsive components.' },
    { area: 'React', detail: 'Hooks (`react-intersection-observer`) drive lazy rendering, infinite lists, and animate-on-scroll; cleanup runs in the `useEffect` return to disconnect observers.' },
    { area: 'Node.js', detail: 'These are browser-only APIs (no DOM server-side); SSR must guard creation to the client (onMounted/useEffect) and rely on them only after hydration.' },
    { area: 'Backend', detail: 'Not applicable directly, but observer-driven lazy loading reduces initial payload the backend must serve, and infinite scroll shapes paginated API design.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Observers offload visibility/size/mutation detection to the browser, avoiding per-frame JS and forced reflows.',
      'IntersectionObserver-based lazy loading cuts initial network and render cost dramatically.',
    ],
    bad: [
      'Observing thousands of elements or huge subtrees still has overhead; MutationObserver on a large subtree can fire a lot.',
      'Leaked, never-disconnected observers accumulate and keep DOM alive.',
    ],
    optimizations: [
      'Unobserve targets once their job is done (e.g. after lazy-load fires once).',
      'Scope MutationObserver narrowly (specific node + only needed mutation types) instead of the whole document subtree.',
      'Use a single observer for many targets rather than one observer per element.',
      'Always disconnect on component teardown to free references.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'browser-rendering-pipeline', 'event-loop'],
    nextConcepts: ['list-virtualization', 'requestanimationframe', 'code-splitting-lazy-loading', 'core-web-vitals'],
    dependencyNote:
      'Observers build on the DOM and the rendering pipeline (they run relative to layout/frames and the event-loop microtask queue); they underpin lazy loading, list-virtualization, and Core Web Vitals optimizations.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the three observers: Intersection (visibility), Resize (size), Mutation (DOM changes).',
      'For each, draw the pattern: `new XObserver(cb)` → `observe(target, opts)` → `cb(entries)` async.',
      'For Intersection, annotate root, rootMargin, threshold.',
      'Contrast with the old scroll handler + getBoundingClientRect (mark it "jank/forced reflow").',
      'Add a big note: `disconnect()` on cleanup to avoid leaks.',
      'Say: "Declarative, async, batched observation beats polling — perfect for lazy load, infinite scroll, container queries, watching injected DOM."',
    ],
    diagram: `  new IntersectionObserver(cb,{root,rootMargin,threshold})
        observe(el) → cb(entries: isIntersecting, ratio) [async]
  new ResizeObserver(cb)      → cb(entries: contentRect)
  new MutationObserver(cb)    → cb(records) [microtask]
  ALWAYS: unobserve/disconnect on teardown (avoid leaks)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Observers replace inefficient polling with async, batched callbacks. IntersectionObserver fires when an element enters/leaves the viewport (lazy load, infinite scroll, scroll-spy) — tuned via root, rootMargin, threshold. ResizeObserver fires when an element\'s size changes (container queries). MutationObserver fires when DOM children/attributes/text change (watching injected content), delivered as a microtask. All avoid the forced reflows of scroll + getBoundingClientRect. Critical: call disconnect()/unobserve() on teardown or they leak memory and DOM.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Observer APIs are the modern, performant way to react to DOM changes, and there are three. IntersectionObserver tells you when an element enters or leaves a root — the viewport by default — and you configure it with `root`, `rootMargin`, and `threshold`. It powers lazy-loading images, infinite scroll via a sentinel element, animate-on-scroll, and scroll-spy navigation. ResizeObserver tells you when a specific element\'s size changes, which finally enables real container or element queries — responding to the element rather than the window. MutationObserver tells you when the DOM tree changes — children added or removed, attributes, or text — which is essential when you have to react to content you don\'t control, like third-party scripts or async-injected nodes; its callback is delivered as a microtask and batches multiple records. The big win across all three is performance: before these, you\'d attach scroll or resize listeners and call getBoundingClientRect every frame, which forces synchronous layout and causes jank. Observers let the browser do the watching efficiently and call you back asynchronously and batched. The pattern is always create the observer with a callback, call observe with options, and then — critically — disconnect or unobserve on teardown, because observers hold strong references to their targets and callbacks, so forgetting cleanup leaks memory and DOM. In Vue or React I wrap them in a composable or hook that disconnects in the cleanup phase.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Observers are async/batched — great for performance but you can\'t read results synchronously right after observe().',
      'One observer for many targets is efficient but mixes concerns; per-target observers are clearer but heavier — choose by scale.',
    ],
    edgeCases: [
      'IntersectionObserver only fires on threshold crossings, not continuous position; for continuous tracking you need rAF.',
      'ResizeObserver can trigger resize loops; the spec defers deeper changes and may warn about undelivered notifications.',
      'MutationObserver does not fire for changes you make and then immediately revert within the same synchronous task in some collapsing cases; records are coalesced.',
      'Detached or display:none targets may not produce intersection entries as expected.',
    ],
    runtimeBehavior: [
      'IntersectionObserver computations are tied to the frame/rendering loop and delivered async, not on the scroll event itself.',
      'ResizeObserver runs after layout each frame; MutationObserver delivers via the microtask queue after the current script.',
      'Callbacks receive batched entries; you must iterate and may need to filter relevant ones.',
    ],
    scalability: [
      'A single IntersectionObserver observing many list items scales better than many observers; reuse it.',
      'Narrow MutationObserver scope and mutation types to avoid storms on large/active subtrees.',
    ],
    productionConcerns: [
      'Leaked observers (no disconnect) are a top SPA memory-leak source across route changes.',
      'Polyfill/older-browser fallbacks may be needed for niche environments, though support is now broad.',
      'Async batching can make observer-driven state slightly stale; design UI to tolerate it (e.g. avoid assuming instant updates).',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Three observers: Intersection (visibility), Resize (size), Mutation (DOM changes).',
    'Pattern: `new XObserver(cb)` → `observe(target, opts)` → async batched `cb(entries)`.',
    'IntersectionObserver opts: `root`, `rootMargin` (pre/post trigger), `threshold` (visibility ratio).',
    'Use IO for: lazy load, infinite scroll (sentinel), scroll-spy, animate-on-scroll.',
    'ResizeObserver → element size changes → container/element queries.',
    'MutationObserver → childList/attributes/characterData; subtree:true for descendants.',
    'Observer callbacks are ASYNC and BATCHED (MutationObserver = microtask).',
    'Replaces scroll + getBoundingClientRect (which forces reflow/jank).',
    'ALWAYS `unobserve`/`disconnect` on teardown — they hold strong refs (leak risk).',
    'Reuse one observer for many targets when possible.',
    'Browser-only APIs — guard during SSR.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use IntersectionObserver to add a class "visible" when an element scrolls into view, once.',
      hint: 'Check isIntersecting, then unobserve.',
      solution: {
        lang: 'js',
        code: `const io = new IntersectionObserver((entries) => {\n  entries.forEach((e) => {\n    if (e.isIntersecting) {\n      e.target.classList.add('visible')\n      io.unobserve(e.target)\n    }\n  })\n})\ndocument.querySelectorAll('.fade-in').forEach(el => io.observe(el))`,
        explanation: [
          'The callback adds the class when the element intersects the viewport.',
          '`unobserve` stops watching after the one-time reveal.',
          'One observer handles all `.fade-in` elements efficiently.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build infinite scroll: call `loadMore()` when a sentinel element nears the viewport bottom.',
      hint: 'Use rootMargin to trigger early.',
      solution: {
        lang: 'js',
        code: `const io = new IntersectionObserver(([entry]) => {\n  if (entry.isIntersecting) loadMore()\n}, { rootMargin: '400px' })\nio.observe(document.getElementById('sentinel'))`,
        explanation: [
          'The sentinel sits at the end of the list.',
          '`rootMargin: "400px"` fires before the sentinel is visible, prefetching the next page.',
          'No scroll handler or per-frame math needed.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Use ResizeObserver to apply a "narrow" class when a card drops below 320px wide, and clean up.',
      hint: 'Read contentRect.width; keep a reference to disconnect.',
      solution: {
        lang: 'js',
        code: `function watchCard(card) {\n  const ro = new ResizeObserver(([entry]) => {\n    card.classList.toggle('narrow', entry.contentRect.width < 320)\n  })\n  ro.observe(card)\n  return () => ro.disconnect() // cleanup\n}\nconst stop = watchCard(document.getElementById('card'))\n// later: stop()`,
        explanation: [
          'ResizeObserver reacts to the element\'s own size, enabling container queries.',
          '`entry.contentRect.width` gives the new width without forcing a manual measurement.',
          'Returning a `disconnect` closure ensures the observer can be cleaned up.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a MutationObserver that auto-enhances any `<a>` injected into #content (e.g. add target="_blank"), batching and cleaning up.',
      hint: 'Watch childList + subtree; iterate addedNodes; querySelectorAll within them.',
      solution: {
        lang: 'js',
        code: `function autoEnhanceLinks(container) {\n  function enhance(root) {\n    root.querySelectorAll?.('a[href]').forEach((a) => {\n      a.target = '_blank'\n      a.rel = 'noopener noreferrer'\n    })\n  }\n  enhance(container) // existing links\n  const mo = new MutationObserver((records) => {\n    for (const r of records) {\n      r.addedNodes.forEach((node) => {\n        if (node.nodeType === 1) enhance(node) // element nodes only\n      })\n    }\n  })\n  mo.observe(container, { childList: true, subtree: true })\n  return () => mo.disconnect()\n}`,
        explanation: [
          'It first enhances existing links, then observes for future insertions.',
          '`childList: true, subtree: true` catches nodes added anywhere inside the container.',
          'It guards on `nodeType === 1` to skip text nodes and calls a helper that finds links within each added subtree.',
          'Returning a `disconnect` closure prevents leaks — essential when the container is removed.',
          'The `rel="noopener noreferrer"` addition is a security best practice for `target="_blank"` links.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Observers are the modern toolkit for performant, reactive DOM features — lazy loading, infinite scroll, container queries, and watching dynamic content. Knowing them marks you as someone who writes efficient, jank-free UI.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep. Product companies (Zoho, Flipkart, Razorpay) ask you to implement lazy loading or infinite scroll with IntersectionObserver. FAANG-level interviews probe the async/batched delivery model, resize-loop handling, MutationObserver scoping, and the memory-leak/cleanup story.',
    whatInterviewersExpect:
      'They expect you to know all three observers, frame them as the performant alternative to scroll/resize polling, use IntersectionObserver with root/rootMargin/threshold for a real feature, and stress disconnecting on teardown to avoid leaks.',
  },
}

export default observers
