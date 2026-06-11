import type { ConceptLesson } from '../../../types/lesson'

const coreWebVitals: ConceptLesson = {
  // 1. Concept Summary
  slug: 'core-web-vitals',
  name: 'Core Web Vitals',
  category: 'performance',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Core Web Vitals are Google\'s standardized, field-measured signals for loading, interactivity, and visual stability — they quantify what "fast and smooth" actually means.',
    'They influence search ranking and directly correlate with conversions and bounce rate, so they tie frontend engineering to business outcomes.',
    'Without measuring them you optimize blind — you fix things users do not feel and miss the ones that actually hurt (a slow LCP image, a layout shift, a janky click).',
    'Interviewers ask them to test whether you know what to measure, how the metrics map to real rendering/runtime behavior, and how to fix each one — not just "make it fast".',
    'They unify a vocabulary (LCP, CLS, INP) so teams, Lighthouse, and real-user monitoring all talk about the same three things.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Core Web Vitals are like a report card for a website with three grades: how fast it shows up, how quickly it answers when you poke it, and whether it stays still while you read.',
    story: [
      'Imagine you visit a friend\'s house. First you care: how long until they open the door and let you see inside? That is the loading grade.',
      'Then you ask them a question and care: how quickly do they answer instead of just staring blankly? That is the responsiveness grade.',
      'Finally, while you are sitting down, you care: do the chairs suddenly slide around and make you fall? That is the stability grade.',
      'A website gets the same three grades — show up fast, answer fast, and stay still — and Core Web Vitals are exactly those three grades written down with numbers.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you open a web page, three things matter to how good it feels: how soon the main content appears, how fast it reacts when you tap or click, and whether things jump around.',
    'Google created three measurements for these: LCP measures when the biggest content shows up, INP measures how fast the page responds to your clicks, and CLS measures how much stuff shifts unexpectedly.',
    'Each measurement has a "good" target — for example LCP under 2.5 seconds — and pages are graded good, needs-improvement, or poor.',
    'These are measured on real users\' devices, not just on a fast developer laptop, so they reflect what people actually experience.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Core Web Vitals are three user-centric performance metrics: LCP (Largest Contentful Paint — loading), INP (Interaction to Next Paint — responsiveness), and CLS (Cumulative Layout Shift — visual stability), each with good/needs-improvement/poor thresholds.',
    how: 'You measure them in the field with the web-vitals JS library (Real User Monitoring) and in the lab with Lighthouse/PageSpeed Insights. The library reports each metric via PerformanceObserver-based APIs as the user interacts.',
    why: 'They give an objective, comparable target for "fast and stable" that maps to real user experience and search ranking, so you can prioritize fixes that users actually feel.',
    code: {
      label: 'Measuring Core Web Vitals with the web-vitals library',
      lang: 'js',
      code: `import { onLCP, onINP, onCLS } from 'web-vitals'\n\nfunction send(metric) {\n  // beacon to your analytics endpoint\n  navigator.sendBeacon('/vitals', JSON.stringify({\n    name: metric.name,   // 'LCP' | 'INP' | 'CLS'\n    value: metric.value, // ms (LCP/INP) or unitless score (CLS)\n    rating: metric.rating // 'good' | 'needs-improvement' | 'poor'\n  }))\n}\n\nonLCP(send)\nonINP(send)\nonCLS(send)`,
      explanation: [
        'The web-vitals library wraps the underlying Performance APIs and computes each metric correctly.',
        'Each callback fires when the metric is finalized (LCP at load, INP/CLS as the user interacts/leaves).',
        'sendBeacon reliably ships the data even as the page unloads.',
        'rating tells you which bucket the value falls in against Google\'s thresholds.',
        'Collecting from real users (RUM) reflects actual device/network conditions, not just your lab machine.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Core Web Vitals are Google\'s field-centric quality signals comprising LCP (time until the largest in-viewport content element renders, good < 2.5s), INP (the worst-case latency from a user interaction to the next visual update across the page lifecycle, good < 200ms), and CLS (the sum of unexpected layout-shift scores, each = impact fraction × distance fraction, good < 0.1). They are surfaced via the LargestContentfulPaint, EventTiming/PerformanceEventTiming, and LayoutShift PerformanceObserver entries, evaluated at the 75th percentile of real users segmented by device class, and feed Google\'s page-experience ranking signal.',

  // 7. Internal Working
  internalWorking: [
    'As the page loads, the browser tracks candidate "largest contentful" elements (images, text blocks, video posters); LCP is the render time of the largest one still in the viewport, reported via the LargestContentfulPaint observer and finalized at the first user interaction or page hide.',
    'For interactivity, every input event records its processing latency; INP observes EventTiming entries and reports (roughly) the worst interaction latency — input delay + processing time + presentation delay — over the page\'s lifetime.',
    'For stability, the browser emits LayoutShift entries whenever visible elements move without a user-initiated cause; each shift score = impact fraction (viewport area affected) × distance fraction (how far it moved). CLS sums the largest session window of these.',
    'The web-vitals library subscribes to these PerformanceObserver entry types and applies Google\'s attribution and windowing rules to produce final metric values.',
    'Field data is aggregated by the Chrome User Experience Report (CrUX) at the 75th percentile per device class; lab tools (Lighthouse) simulate or emulate conditions to estimate the same metrics.',
    'Improvements come from changing the underlying behavior the metric measures: faster server + preloaded LCP resource (LCP), shorter main-thread tasks and yielding (INP), and reserved space for async content (CLS).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   PAGE LIFECYCLE → THREE VITALS
   request ─────────────────────────────────────────────►
   │
   │  LCP: when does the BIGGEST content paint?
   │  ┌──────────────┐
   │  │ hero image    │ ── painted at 2.1s  ✓ good (<2.5s)
   │  └──────────────┘
   │
   │  INP: tap → how long until the screen updates?
   │  click ──[input delay]──[JS processing]──[paint]──► 140ms ✓ (<200ms)
   │
   │  CLS: did things jump while loading?
   │  [ad loads] → text shoved down 80px → shift score 0.12  ✗ (>0.1)
   │
   target (75th pct):  LCP<2.5s   INP<200ms   CLS<0.1`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — reserve space to avoid CLS',
      lang: 'html',
      code: `<!-- Bad: no dimensions → image load shoves content down (CLS) -->\n<img src="hero.jpg" alt="hero" />\n\n<!-- Good: intrinsic size reserved → no shift -->\n<img src="hero.jpg" alt="hero" width="1200" height="630" />\n\n/* CSS for responsive while keeping the ratio */\nimg { aspect-ratio: 1200 / 630; width: 100%; height: auto; }`,
      explanation: [
        'Without width/height the browser does not know how tall the image is until it loads, so surrounding content reflows when it arrives.',
        'Specifying width/height (or aspect-ratio) lets the browser reserve the box up front — no shift.',
        'This is the single most common CLS fix: always reserve space for images, ads, and embeds.',
        'aspect-ratio keeps it responsive without re-introducing the shift.',
      ],
    },
    intermediate: {
      label: 'Intermediate — improve LCP by prioritizing the hero image',
      lang: 'html',
      code: `<head>\n  <!-- Tell the browser to fetch the LCP image ASAP -->\n  <link rel="preload" as="image" href="/hero.avif" fetchpriority="high" />\n</head>\n<body>\n  <img src="/hero.avif" fetchpriority="high" decoding="async"\n       width="1200" height="630" alt="hero" />\n</body>`,
      explanation: [
        'The LCP element is usually a hero image or headline; speeding up that one resource moves LCP directly.',
        'preload + fetchpriority="high" makes the browser fetch the hero before lower-priority resources.',
        'A modern format (AVIF/WebP) shrinks bytes, and width/height also protects CLS.',
        'Avoid lazy-loading the LCP image — that delays the very thing the metric measures.',
      ],
    },
    advanced: {
      label: 'Advanced — improve INP by breaking up a long task',
      lang: 'js',
      code: `// Bad: one long task blocks the main thread → high INP on click\nfunction processAll(items) {\n  for (const item of items) heavyWork(item) // 300ms blocking\n}\n\n// Good: yield to the browser so input can be handled between chunks\nasync function processAll(items) {\n  for (let i = 0; i < items.length; i++) {\n    heavyWork(items[i])\n    if (i % 50 === 0) await scheduler.yield?.() ?? new Promise(r => setTimeout(r))\n  }\n}`,
      explanation: [
        'INP is hurt when a long main-thread task delays the response to a click (input delay) or the paint after it.',
        'Yielding (scheduler.yield, or a setTimeout fallback) lets the browser interleave input handling and rendering.',
        'Chunking heavy work keeps each task short (< 50ms) so interactions stay responsive.',
        'Moving truly heavy work to a Web Worker is the next step when yielding is not enough.',
      ],
    },
    realProject: {
      label: 'Real project — RUM reporting in a Vue app',
      lang: 'js',
      code: `// main.ts — collect field vitals for real users\nimport { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals'\n\nconst report = (m) =>\n  navigator.sendBeacon('/api/vitals', JSON.stringify({\n    name: m.name, value: Math.round(m.value), rating: m.rating,\n    id: m.id, path: location.pathname,\n  }))\n\n;[onLCP, onINP, onCLS, onFCP, onTTFB].forEach((fn) => fn(report))`,
      explanation: [
        'Real-user monitoring (RUM) captures vitals from actual devices/networks, which lab tests cannot replicate.',
        'sendBeacon survives page unload so INP/CLS (finalized late) still report.',
        'Tagging by path lets you find which routes are slow.',
        'The same pattern works in React/Next.js (reportWebVitals) and any SPA; pipe to your analytics/Datadog/Sentry.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the three Core Web Vitals and what does each measure?',
      answer: 'LCP (Largest Contentful Paint) measures loading — when the largest visible content renders. INP (Interaction to Next Paint) measures responsiveness — latency from interaction to the next visual update. CLS (Cumulative Layout Shift) measures visual stability — how much content unexpectedly shifts.',
      explanation: 'A clean answer pairs each acronym with the user-facing quality (loading/responsiveness/stability), not just the words.',
    },
    {
      level: 'beginner',
      question: 'What are the "good" thresholds for LCP, INP, and CLS?',
      answer: 'LCP good is under 2.5 seconds, INP good is under 200 milliseconds, and CLS good is under 0.1, all measured at the 75th percentile of real users.',
      explanation: 'Knowing the numbers and that they are measured at the 75th percentile of field data signals real familiarity.',
    },
    {
      level: 'intermediate',
      question: 'What typically causes a bad LCP and how do you fix it?',
      answer: 'Slow server response (TTFB), render-blocking CSS/JS, a large unoptimized hero image, or lazy-loading the LCP element. Fixes: speed up TTFB/CDN, preload and prioritize the LCP resource, use modern image formats and proper sizing, and never lazy-load the LCP image.',
      explanation: 'Connecting LCP to its concrete causes and matching fixes shows you can actually move the metric.',
    },
    {
      level: 'intermediate',
      question: 'How is INP different from the old FID metric?',
      answer: 'FID measured only the input delay of the first interaction. INP measures the full latency (input delay + processing + presentation) of essentially the worst interaction across the whole page lifecycle, so it captures sluggishness throughout the session, not just the first click.',
      explanation: 'INP replaced FID in 2024; knowing why (full lifecycle, full latency, worst-case) is current and senior.',
    },
    {
      level: 'advanced',
      question: 'Why is CLS measured as impact fraction times distance fraction, and what counts as an "expected" shift?',
      answer: 'Each layout shift score is impact fraction (how much of the viewport the moving elements occupy) times distance fraction (how far they moved relative to the viewport), so big elements moving far are penalized most. Shifts within 500ms of a user interaction are considered expected and excluded.',
      explanation: 'This shows understanding of the actual formula and the user-initiated exception, not a vague "things moving is bad".',
    },
    {
      level: 'senior',
      question: 'Why can lab scores (Lighthouse) and field scores (CrUX) disagree, and which do you trust?',
      answer: 'Lab tests run once on simulated conditions and a fresh load, so they cannot capture real device variety, cache states, or interaction patterns — and Lighthouse cannot measure INP at all since there are no real interactions. Field data (CrUX/RUM) reflects actual users at the 75th percentile and is what Google ranks on, so for vitals you trust field data and use lab as a fast debugging proxy.',
      explanation: 'Senior signal: knowing lab vs field, that INP needs real interactions, and that ranking uses field data at p75.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you set up Real User Monitoring for vitals in production?',
    'What is TTFB and how does it feed into LCP?',
    'How do you debug a CLS that only happens on some users\' devices?',
    'How does code splitting / image optimization affect each vital?',
    'What main-thread work hurts INP the most and how do you find it?',
    'How does SSR vs CSR affect LCP and CLS?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Optimizing only the Lighthouse score on a fast laptop.',
      why: 'Lab conditions differ from real users and Lighthouse cannot even measure INP; you can score 100 and still have poor field vitals.',
      fix: 'Measure field data with RUM (web-vitals + CrUX) at the 75th percentile and treat Lighthouse as a debugging aid only.',
    },
    {
      mistake: 'Lazy-loading the hero/LCP image.',
      why: 'It delays loading the exact element LCP measures, making LCP worse.',
      fix: 'Eagerly load and preload the LCP resource with fetchpriority="high"; lazy-load only below-the-fold images.',
    },
    {
      mistake: 'Not reserving space for images, ads, fonts, or async content.',
      why: 'When the content arrives it pushes the layout, producing layout shifts and a high CLS.',
      fix: 'Set width/height or aspect-ratio, reserve ad slots, and use font-display/size-adjust to avoid font-swap shifts.',
    },
    {
      mistake: 'Treating one long JS task as harmless because the page "looks loaded".',
      why: 'A long main-thread task blocks input handling and the next paint, spiking INP when the user finally interacts.',
      fix: 'Break work into < 50ms chunks, yield to the main thread (scheduler.yield), and offload heavy compute to Web Workers.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Apps wire web-vitals in main.ts to beacon RUM data; route-based code splitting and preloading the hero image are the standard LCP/INP levers, and reserving layout space avoids CLS.' },
    { area: 'React', detail: 'Create React App / Next.js expose reportWebVitals; Next.js Image component enforces width/height (CLS) and prioritizes the LCP image, and Suspense/streaming improves perceived LCP.' },
    { area: 'Node.js', detail: 'Backend TTFB is the floor for LCP — caching, CDN edge rendering, and fast SSR/streaming directly improve the loading vital.' },
    { area: 'Backend', detail: 'Serve responsive, modern-format images, set cache headers, and send early hints (103) / preload Link headers so the LCP resource starts downloading sooner.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Optimizing the LCP resource and TTFB gives a directly measurable loading improvement.',
      'Reserving layout space eliminates CLS at essentially zero runtime cost.',
    ],
    bad: [
      'Long main-thread tasks and heavy hydration spike INP even when the page looks loaded.',
      'Unsized media, late-injected ads, and font swaps cause layout shifts that hurt CLS.',
    ],
    optimizations: [
      'Preload + fetchpriority the LCP image; use AVIF/WebP and responsive sizes.',
      'Chunk and yield long tasks, offload to Web Workers, and reduce hydration cost to improve INP.',
      'Set width/height/aspect-ratio and reserve space for async content for CLS.',
      'Improve TTFB with CDN/caching/SSR streaming since it gates LCP.',
    ],
  },

  // 16. Related Concepts
  related: {
    prerequisites: ['browser-rendering-pipeline', 'event-loop', 'long-task-scheduling'],
    nextConcepts: ['code-splitting-lazy-loading', 'list-virtualization', 'requestanimationframe', 'web-workers'],
    dependencyNote:
      'Core Web Vitals are the measurable outcome of how the rendering pipeline, event loop, and task scheduling behave. You improve them with the broader performance toolkit — code splitting, image optimization, virtualization, workers, and rAF — so understanding those mechanisms is how you actually move the numbers.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a timeline arrow from "request" to the right.',
      'Mark a point "LCP — biggest content paints" with the target < 2.5s.',
      'Below it draw a click → bar split into input delay / processing / paint, label "INP < 200ms".',
      'Below that draw a box shifting down with a small box arriving above it, label "CLS < 0.1".',
      'Write "measured at p75 of real users (CrUX/RUM)".',
      'Say: "Three vitals — loading, responsiveness, stability — each with a target, measured in the field, and each fixed by changing the behavior it measures."',
    ],
    diagram: `  request ───────────────────────────────────►
     │ LCP (loading)      [hero paints] 2.1s  < 2.5s ✓
     │ INP (responsive)   click→|delay|js|paint| 140ms < 200ms ✓
     │ CLS (stability)    [box jumps]  score 0.12  < 0.1 ✗
     └ all at 75th percentile of real users`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Core Web Vitals are three user-centric, field-measured metrics: LCP (loading, good < 2.5s — when the largest content paints), INP (responsiveness, good < 200ms — interaction to next paint), and CLS (stability, good < 0.1 — unexpected layout shift), each judged at the 75th percentile of real users. Fix LCP by speeding TTFB and prioritizing the hero resource, INP by shortening main-thread tasks and yielding, and CLS by reserving space for images/ads/fonts. Measure in the field with the web-vitals library; lab tools like Lighthouse cannot capture INP.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Core Web Vitals are Google\'s three user-centric performance metrics, each capturing a different feeling of quality and each with a target measured at the 75th percentile of real users. LCP, Largest Contentful Paint, is loading — the time until the largest visible element renders, with good under 2.5 seconds. INP, Interaction to Next Paint, is responsiveness — roughly the worst latency from a user interaction to the next visual update over the page lifecycle, with good under 200 milliseconds; it replaced FID because FID only measured the first input\'s delay. CLS, Cumulative Layout Shift, is visual stability — the sum of unexpected shift scores, where each is the impact fraction times the distance fraction, with good under 0.1. The crucial point is that these are field metrics from real devices via CrUX or your own RUM with the web-vitals library; lab tools like Lighthouse run once on simulated conditions and cannot even measure INP because there are no real interactions, so you debug with lab data but trust field data, which is also what feeds ranking. To improve them you change what each measures: for LCP, speed up TTFB with caching and a CDN and preload the hero image with high fetch priority, never lazy-loading it; for INP, break long main-thread tasks into sub-50ms chunks, yield to the browser, and push heavy compute to Web Workers; for CLS, reserve space with width and height or aspect-ratio and avoid late-injected content and font-swap shifts.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Lab vs field: lab is fast and reproducible for debugging but misses real variety and INP; field is authoritative but slow to move and noisy — you need both.',
      'Eager LCP resource vs total bytes: prioritizing the hero can starve other resources; balance fetchpriority so you do not just shift the bottleneck.',
      'Hydration completeness vs INP: shipping less JS / partial hydration improves INP but can complicate interactivity guarantees.',
    ],
    edgeCases: [
      'SPA route changes are not "page loads", so LCP is only the initial nav — soft-navigation vitals are an evolving area you must instrument deliberately.',
      'CLS uses session windows, so a single big late shift can still pass while many small ones fail; understand the windowing.',
      'INP captures the worst interaction, so one slow handler on an obscure control can tank the whole page\'s score.',
      'Font swaps and animated layout (accordions) can register as shifts if not within the interaction exclusion window.',
    ],
    runtimeBehavior: [
      'LayoutShift/EventTiming/LCP entries come from PerformanceObserver; the web-vitals library encodes Google\'s exact attribution and windowing so hand-rolling is error-prone.',
      'INP is dominated by long tasks blocking the main thread; the Long Tasks API and the INP attribution build help locate the offending handler.',
      'LCP candidates change as the page loads; the final value is whichever largest element was painted before the first interaction/hide.',
    ],
    scalability: [
      'Pipe RUM vitals into your observability stack, segment by route/device/country, and alert on p75 regressions per deploy.',
      'As the app grows, INP regressions usually come from accumulating third-party scripts and heavier hydration — budget and monitor them.',
    ],
    productionConcerns: [
      'Third-party tags (ads, A/B, chat widgets) are the top cause of CLS and INP regressions — load them async/deferred and reserve their space.',
      'Set performance budgets in CI and track field vitals dashboards, not just one-off Lighthouse runs.',
      'Use attribution builds of web-vitals to capture the specific element/script responsible, so fixes are targeted.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Three vitals: LCP (loading), INP (responsiveness), CLS (stability).',
    'Targets: LCP < 2.5s, INP < 200ms, CLS < 0.1, at p75 of real users.',
    'INP replaced FID in 2024 — full lifecycle, full latency, worst interaction.',
    'CLS score = impact fraction × distance fraction; shifts <500ms after input excluded.',
    'Measure FIELD data with web-vitals (RUM) + CrUX; Lighthouse can\'t measure INP.',
    'LCP fix: fast TTFB/CDN, preload + fetchpriority hero, modern image formats, no lazy-load.',
    'INP fix: short tasks (<50ms), yield (scheduler.yield), Web Workers, less hydration.',
    'CLS fix: width/height or aspect-ratio, reserve ad/font space, font-display.',
    'TTFB gates LCP; long tasks gate INP; unsized async content gates CLS.',
    'Third-party scripts are the top INP/CLS offenders.',
    'Ranking uses field data, not your lab score.',
    'Beacon vitals with navigator.sendBeacon so late metrics still report.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write code that logs each Core Web Vital and its rating using the web-vitals library.',
      hint: 'Import onLCP, onINP, onCLS and pass a logger.',
      solution: {
        lang: 'js',
        code: `import { onLCP, onINP, onCLS } from 'web-vitals'\nconst log = (m) => console.log(m.name, Math.round(m.value), m.rating)\nonLCP(log)\nonINP(log)\nonCLS(log)`,
        explanation: [
          'Each on* function registers a callback fired when that metric finalizes.',
          'metric.rating buckets the value as good/needs-improvement/poor.',
          'This is the minimal RUM setup before piping to analytics.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Rewrite this image so it cannot cause a layout shift while staying responsive: <img src="/banner.jpg">.',
      hint: 'Reserve the box with dimensions or aspect-ratio.',
      solution: {
        lang: 'html',
        code: `<img src="/banner.jpg" alt="banner" width="1600" height="600"\n     style="width:100%; height:auto; aspect-ratio:1600/600;" />`,
        explanation: [
          'width/height give the browser the intrinsic ratio so it reserves the correct box before the image loads.',
          'width:100%; height:auto keeps it responsive.',
          'aspect-ratio guarantees the reserved space matches even as the column width changes — no shift.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A click handler runs a 250ms synchronous loop, spiking INP. Refactor it to yield to the main thread so the UI stays responsive.',
      hint: 'Chunk the loop and await a yield between chunks.',
      solution: {
        lang: 'js',
        code: `async function onClick(items) {\n  const yieldToMain = () =>\n    'scheduler' in window && scheduler.yield\n      ? scheduler.yield()\n      : new Promise((r) => setTimeout(r, 0))\n  for (let i = 0; i < items.length; i++) {\n    process(items[i])\n    if (i % 100 === 0) await yieldToMain()\n  }\n}`,
        explanation: [
          'The original 250ms task blocks input and paint, so INP measures the full delay.',
          'Yielding every 100 items breaks the work into short tasks the scheduler can interleave with rendering.',
          'scheduler.yield is the modern primitive; setTimeout(0) is the fallback.',
          'For genuinely heavy compute, move process() into a Web Worker so the main thread never blocks.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a tiny RUM reporter that batches all three vitals and sends them once on page hide, tagged with the route, using sendBeacon.',
      hint: 'Collect into an object and flush on visibilitychange=hidden.',
      solution: {
        lang: 'js',
        code: `import { onLCP, onINP, onCLS } from 'web-vitals'\nconst metrics = {}\nconst record = (m) => { metrics[m.name] = { value: Math.round(m.value), rating: m.rating } }\nonLCP(record)\nonINP(record)\nonCLS(record)\n\nfunction flush() {\n  if (!Object.keys(metrics).length) return\n  navigator.sendBeacon('/api/vitals', JSON.stringify({\n    path: location.pathname,\n    metrics,\n  }))\n}\ndocument.addEventListener('visibilitychange', () => {\n  if (document.visibilityState === 'hidden') flush()\n})`,
        explanation: [
          'INP and CLS are only final near page end, so we collect into an object and send once on hide.',
          'visibilitychange to hidden is the reliable unload signal across mobile/desktop.',
          'sendBeacon delivers even as the page is being discarded, unlike a normal fetch.',
          'Tagging by path lets the backend find which routes have poor vitals.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Core Web Vitals turn "make it fast" into three measurable targets tied to ranking and revenue, so talking about them well proves you can connect frontend engineering to user experience and business impact.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) typically ask you to name the three vitals and their thresholds. Product companies (Zoho, Flipkart, Razorpay) ask how you would diagnose and fix a bad LCP/INP/CLS and how you measure them in production. FAANG-level interviews probe lab-vs-field, the INP/FID change, the CLS formula, and how rendering/event-loop behavior maps to each metric.',
    whatInterviewersExpect:
      'They expect the three metrics with thresholds, what each measures, that they are field-measured at p75, and concrete cause-and-fix for each — plus awareness that Lighthouse cannot measure INP and that third-party scripts are common offenders.',
  },
}

export default coreWebVitals
