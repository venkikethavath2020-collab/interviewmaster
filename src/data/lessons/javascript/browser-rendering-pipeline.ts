import type { ConceptLesson } from '../../../types/lesson'

const browserRenderingPipeline: ConceptLesson = {
  // 1. Concept Summary
  slug: 'browser-rendering-pipeline',
  name: 'Rendering Pipeline',
  category: 'browser-dom',
  difficulty: 'senior',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The rendering pipeline is how the browser turns HTML/CSS/JS into pixels — understanding it is the difference between a smooth 60fps UI and janky, stuttering scroll.',
    'Layout thrashing (forced synchronous reflow) is a top real-world performance bug; you can only fix it if you know which operations trigger layout, paint, or composite.',
    'It explains WHY some CSS animations (transform/opacity) are cheap and others (width/top) are expensive — knowledge that directly improves Core Web Vitals.',
    'Interviewers ask it to separate engineers who can profile and fix jank from those who only guess; it tests deep browser internals.',
    'Frameworks batch DOM updates precisely because uncontrolled reflows are costly — understanding the pipeline explains the virtual DOM and `requestAnimationFrame` patterns.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Drawing a webpage is like building and painting a LEGO city in steps: read the plans, measure where things go, color them in, then snap the layers together.',
    story: [
      'Imagine you get instructions to build a tiny LEGO city. First you read the instruction book and figure out which pieces exist — that is building the structure.',
      'Then you measure exactly where each building sits and how big it is — that is figuring out the layout.',
      'Next you color and decorate each building — that is the painting step.',
      'Finally you stack the transparent layers on top of each other to see the whole city at once — that is compositing. If you move one tiny building, sometimes you only repaint it, but sometimes you have to re-measure the whole street, which is slow.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a browser shows a page, it does not draw it all at once — it goes through several stages.',
    'First it reads the HTML to build a tree of elements (the DOM) and the CSS into a tree of styles, then combines them into a render tree of what is actually visible.',
    'Then it calculates the exact size and position of every element (layout), fills in the colors and text (paint), and finally stacks the painted layers together on screen (composite).',
    'If your JavaScript changes something, the browser may have to redo some of these stages. Redoing layout for the whole page is the slowest, so smart code avoids triggering it repeatedly.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The rendering (or "critical rendering") pipeline is the sequence of stages the browser runs to display a page: parse HTML→DOM and CSS→CSSOM, combine into the Render Tree, compute geometry (Layout/reflow), fill pixels (Paint), and assemble layers on the GPU (Composite).',
    how: 'On load and on each visual change, the browser runs as many of these stages as needed. Changing geometry (width, position) forces Layout → Paint → Composite. Changing color/background forces Paint → Composite. Changing `transform`/`opacity` can be Composite-only — the cheapest path.',
    why: 'Knowing which stage a change triggers lets you write code and CSS that update only cheap stages, avoiding layout thrashing and keeping animations at 60fps.',
    code: {
      label: 'Cheap vs expensive visual changes',
      lang: 'js',
      code: `// EXPENSIVE: changing layout properties triggers reflow (Layout→Paint→Composite)\nel.style.width = '200px'\nel.style.top = '50px'\n\n// CHEAP: transform/opacity can be composited on the GPU (Composite only)\nel.style.transform = 'translateX(100px) scale(1.1)'\nel.style.opacity = '0.5'\n\n// LAYOUT THRASH: reading a layout prop right after writing forces sync reflow\nfor (const box of boxes) {\n  box.style.height = box.offsetHeight + 10 + 'px' // write then read in a loop = thrash\n}`,
      explanation: [
        'Setting `width`/`top` changes geometry, so the browser must recompute layout, then repaint, then composite.',
        '`transform` and `opacity` are handled by the compositor and often skip layout and paint entirely — ideal for animation.',
        'Reading `offsetHeight` (a layout property) right after a write forces the browser to flush layout synchronously each iteration — the classic "layout thrashing" bug.',
        'The fix is to batch all reads, then all writes (see later examples).',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The browser rendering pipeline transforms markup, styles, and script into rendered frames through ordered stages: parsing HTML into the DOM and CSS into the CSSOM; computing styles and constructing the Render Tree (visible nodes with computed styles); Layout/reflow (computing the box geometry of each node); Paint (rasterizing each render-tree node into paint records / layers); and Compositing (the compositor thread assembles GPU layers and applies transforms to produce the final frame). Mutations dirty the pipeline from the earliest affected stage downward; reading layout-dependent properties forces a synchronous layout flush. `transform`/`opacity` changes can be promoted to compositor-only updates, bypassing layout and paint.',

  // 7. Internal Working
  internalWorking: [
    'Parsing: the HTML parser builds the DOM tree; CSS is parsed into the CSSOM. Render-blocking CSS must be available before the first render.',
    'Style: the engine computes the final (cascaded, inherited) styles for each element and builds the Render Tree, which excludes non-visual nodes (e.g. `display:none`).',
    'Layout (reflow): the engine walks the render tree to compute exact positions and sizes (the box model) in a relative/absolute coordinate space; this is expensive and global-ish because elements affect siblings/parents.',
    'Paint: the engine generates paint records and rasterizes pixels for text, colors, borders, shadows — possibly into multiple layers.',
    'Composite: a separate compositor thread (and GPU) combines layers, applying transforms/opacity, and produces the final frame; transform/opacity-only changes happen here without touching layout/paint.',
    'Frame loop: this runs ideally once per ~16.7ms (60fps). JavaScript, `requestAnimationFrame` callbacks, and style/layout/paint all share the main thread, so long JS or forced synchronous layout blows the frame budget and causes jank.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  HTML ─► DOM ┐
              ├─► Render Tree ─► Layout ─► Paint ─► Composite ─► PIXELS
  CSS  ─► CSSOM┘                 (reflow)  (raster) (GPU layers)

  Change type → cheapest stage re-run:
   geometry (width/top/margin) ─► Layout ─► Paint ─► Composite   (expensive)
   color/background/shadow     ──────────► Paint ─► Composite   (medium)
   transform / opacity         ───────────────────► Composite   (cheap)

  Reading offsetHeight/getBoundingClientRect after a write = FORCED reflow`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — animate with transform, not top/left',
      lang: 'css',
      code: `/* BAD: animating left forces layout every frame */\n.box-bad { position: absolute; transition: left 0.3s; }\n.box-bad:hover { left: 200px; }\n\n/* GOOD: transform is composited on the GPU */\n.box-good { transition: transform 0.3s; }\n.box-good:hover { transform: translateX(200px); }`,
      explanation: [
        'Animating `left` changes geometry, forcing Layout → Paint → Composite on every frame.',
        'Animating `transform` runs on the compositor, often skipping Layout and Paint entirely.',
        'The transform version stays smooth at 60fps even on weaker devices.',
        'Same visual result, dramatically different cost — the core practical takeaway.',
      ],
    },
    intermediate: {
      label: 'Intermediate — fixing layout thrashing (read then write)',
      lang: 'js',
      code: `// THRASH: interleaved read/write forces a reflow each iteration\nfunction bad(boxes) {\n  for (const b of boxes) {\n    b.style.width = b.offsetWidth + 10 + 'px' // read forces layout flush\n  }\n}\n\n// FIX: batch reads, then batch writes\nfunction good(boxes) {\n  const widths = boxes.map(b => b.offsetWidth) // all reads first\n  boxes.forEach((b, i) => { b.style.width = widths[i] + 10 + 'px' }) // then writes\n}`,
      explanation: [
        'In `bad`, each `offsetWidth` read forces the browser to flush pending layout, then the write dirties it again — N reflows.',
        'In `good`, all layout reads happen first (one flush), then all writes batch into a single reflow.',
        'This read-then-write batching is the canonical fix for layout thrashing.',
        'Libraries like FastDOM formalize this read/write scheduling.',
      ],
    },
    advanced: {
      label: 'Advanced — scheduling visual work with requestAnimationFrame',
      lang: 'js',
      code: `let pending = false\nfunction onScroll() {\n  if (pending) return\n  pending = true\n  requestAnimationFrame(() => {\n    pending = false\n    // do layout reads/writes here, aligned to the frame\n    const y = window.scrollY\n    header.style.transform = 'translateY(' + (-y * 0.3) + 'px)'\n  })\n}\nwindow.addEventListener('scroll', onScroll, { passive: true })`,
      explanation: [
        '`requestAnimationFrame` runs the callback right before the next paint, so visual updates align with the frame.',
        'The `pending` flag coalesces a burst of scroll events into one update per frame.',
        'Using `transform` keeps the parallax on the compositor, avoiding layout.',
        '`{ passive: true }` lets the browser scroll without waiting for the handler.',
      ],
    },
    realProject: {
      label: 'Real project — why frameworks batch DOM updates',
      lang: 'js',
      code: `// Vue/React batch state changes and flush DOM mutations once per tick\n// Conceptually:\nstate.count++       // marks component dirty\nstate.name = 'Asha' // still just one re-render queued\n\n// Framework flushes all changes together (one layout/paint), e.g. Vue nextTick:\nawait nextTick()\nconst h = el.offsetHeight // read measurements AFTER the batched DOM update`,
      explanation: [
        'Vue and React batch multiple state changes into a single DOM update to avoid repeated reflows.',
        'The virtual DOM computes a minimal patch, then applies it once — one trip through Layout/Paint.',
        'Reading layout (`offsetHeight`) before the flush would force a premature reflow; you wait for `nextTick`/`useLayoutEffect`.',
        'This is the pipeline-aware design behind modern frameworks\' performance.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the main stages of the browser rendering pipeline?',
      answer: 'Parse HTML→DOM and CSS→CSSOM, build the Render Tree, Layout (compute geometry), Paint (rasterize pixels), and Composite (assemble layers on the GPU into the final frame).',
      explanation: 'Listing the five stages in order is the baseline expectation.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between reflow (layout) and repaint?',
      answer: 'Reflow/layout recomputes the geometry (size and position) of elements and is expensive because it can cascade to other elements. Repaint redraws pixels (colors, text) without changing geometry. Geometry changes trigger reflow then repaint; color-only changes trigger just repaint.',
      explanation: 'The cost hierarchy (layout > paint > composite) is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'Why are `transform` and `opacity` animations cheaper than animating `width` or `top`?',
      answer: 'Because `transform`/`opacity` can be handled by the compositor thread on the GPU without re-running Layout or Paint, while `width`/`top` change geometry and force Layout → Paint → Composite every frame.',
      explanation: 'Connecting properties to the stages they trigger is exactly what interviewers want.',
    },
    {
      level: 'advanced',
      question: 'What is layout thrashing and how do you avoid it?',
      answer: 'Layout thrashing is forcing many synchronous reflows by interleaving DOM writes with reads of layout properties (offsetHeight, getBoundingClientRect) in a loop. Avoid it by batching all reads first, then all writes, and by using requestAnimationFrame to align updates to frames.',
      explanation: 'Naming the forced-synchronous-layout cause and the read-then-write fix demonstrates real profiling experience.',
    },
    {
      level: 'senior',
      question: 'How does the main thread vs compositor thread split affect smoothness?',
      answer: 'The main thread runs JS, style, layout, and paint; the compositor thread assembles layers. If the main thread is busy (long JS or forced layout), it can\'t produce frames, causing jank — but compositor-only changes (transform/opacity) can keep scrolling/animation smooth even under main-thread load. Offloading work (web workers, compositor-friendly animations) protects frame rate and INP.',
      explanation: 'Understanding the thread split and how to keep work off the main thread is a strong senior signal.',
    },
    {
      level: 'senior',
      question: 'What is `will-change` and how can layer promotion backfire?',
      answer: '`will-change` (or transforms) promotes an element to its own compositor layer so changes are cheap to composite. But each layer consumes memory and too many layers cause "layer explosion," increasing memory and compositing cost — so promote sparingly and remove the hint when animation ends.',
      explanation: 'Knowing both the benefit and the memory trade-off of layer promotion shows depth.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Which CSS properties trigger layout vs paint vs composite only?',
    'How does `requestAnimationFrame` fit into the frame budget?',
    'What is the difference between DOMContentLoaded and first paint/LCP?',
    'How do the virtual DOM and batching reduce pipeline cost?',
    'What does `content-visibility` / containment do for rendering?',
    'How do you diagnose jank in DevTools Performance panel?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Animating layout properties like `width`, `height`, `top`, `left`.',
      why: 'They force Layout → Paint → Composite every frame, causing jank.',
      fix: 'Animate `transform` and `opacity`, which can be composited on the GPU.',
    },
    {
      mistake: 'Interleaving DOM reads and writes in a loop.',
      why: 'Each read after a write forces a synchronous reflow — layout thrashing.',
      fix: 'Batch all reads first, then all writes; use requestAnimationFrame to schedule.',
    },
    {
      mistake: 'Doing heavy work in scroll/resize handlers synchronously.',
      why: 'It blocks the main thread and blows the frame budget, stuttering the UI.',
      fix: 'Throttle to rAF, use passive listeners, and keep handler work minimal.',
    },
    {
      mistake: 'Over-using `will-change` or promoting everything to layers.',
      why: 'Excess compositor layers cause "layer explosion," consuming memory and slowing compositing.',
      fix: 'Promote only the animating element, and remove `will-change` after the animation.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue batches reactive updates and flushes DOM mutations once per tick; `nextTick` lets you safely read layout after the batched update, avoiding mid-batch reflows.' },
    { area: 'React', detail: 'React batches state updates and uses a virtual DOM diff to apply one minimal mutation; `useLayoutEffect` runs after DOM mutation but before paint for synchronous measurement, while `useEffect` runs after paint.' },
    { area: 'Node.js', detail: 'No rendering pipeline server-side, but SSR streams HTML so the browser can start parsing/painting sooner, improving first paint and LCP.' },
    { area: 'Backend', detail: 'Critical-CSS inlining and resource hints (preload, priority) shaped by the server response control how fast CSSOM is ready, gating first render.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Compositor-only animations (transform/opacity) stay at 60fps even under main-thread load.',
      'Batching DOM updates and reads minimizes reflows and keeps frames within budget.',
    ],
    bad: [
      'Forced synchronous layout (read-after-write loops) can multiply reflow cost dramatically.',
      'Animating geometry or large repaint areas blows the per-frame budget and causes jank.',
    ],
    optimizations: [
      'Prefer transform/opacity; avoid animating width/height/top/left.',
      'Batch reads then writes; schedule visual updates with requestAnimationFrame.',
      'Reduce paint area and complexity (avoid huge box-shadows/filters on large elements).',
      'Use CSS containment / `content-visibility` to limit layout/paint scope for offscreen content.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'script-loading', 'event-loop'],
    nextConcepts: ['core-web-vitals', 'requestanimationframe', 'list-virtualization', 'observers'],
    dependencyNote:
      'The rendering pipeline builds on the DOM and event-loop (frames share the main thread) and is the foundation for optimizing core-web-vitals, using requestAnimationFrame, and techniques like list-virtualization.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the stages left to right: DOM + CSSOM → Render Tree → Layout → Paint → Composite → Pixels.',
      'Annotate Layout as "geometry, expensive", Paint as "pixels", Composite as "GPU layers, cheap".',
      'Map a width change to Layout→Paint→Composite, a color change to Paint→Composite, a transform to Composite only.',
      'Draw a read-after-write loop and label it "forced reflow / thrash".',
      'Note the main thread does JS+style+layout+paint; compositor is separate.',
      'Say: "Animate transform/opacity, batch reads then writes, schedule with rAF — that\'s how you protect 60fps and INP."',
    ],
    diagram: `  DOM+CSSOM → RenderTree → Layout → Paint → Composite → pixels
                            (geom)   (px)    (GPU)
   width/top  → Layout+Paint+Composite   (costly)
   color      → Paint+Composite          (medium)
   transform  → Composite                (cheap)
   read after write = forced reflow ✗`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The rendering pipeline turns HTML/CSS into pixels: DOM + CSSOM → Render Tree → Layout (geometry) → Paint (pixels) → Composite (GPU layers). Geometry changes (width/top) trigger the whole expensive chain; color changes trigger Paint+Composite; transform/opacity can be Composite-only and cheap. Reading layout properties after a write forces synchronous reflow (layout thrashing) — fix by batching reads then writes and scheduling with requestAnimationFrame. Animate transform/opacity, keep the main thread free, to hold 60fps and good INP.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The browser rendering pipeline is the sequence the browser runs to paint a page. It parses HTML into the DOM and CSS into the CSSOM, combines them into a render tree of visible nodes, then runs Layout — computing the exact size and position of every box — followed by Paint, which rasterizes pixels for text, colors, and borders, and finally Composite, where a separate compositor thread assembles GPU layers and applies transforms to produce the final frame. The crucial insight for performance is that different changes re-run different amounts of this pipeline. Changing geometry like width or top forces Layout, then Paint, then Composite — the most expensive path. Changing a color forces Paint and Composite. But changing transform or opacity can be handled entirely by the compositor, skipping Layout and Paint — which is why those properties animate smoothly at 60fps. The classic bug is layout thrashing: interleaving DOM writes with reads of layout properties like offsetHeight in a loop forces a synchronous reflow each iteration. The fix is to batch all reads first, then all writes, and to schedule visual updates with requestAnimationFrame so they align to the frame. Senior-wise, the main thread runs JS, style, layout, and paint, so long JS or forced layout starves frame production and hurts INP — which is exactly why frameworks batch DOM updates and why we keep heavy work off the main thread.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Layer promotion (transform/will-change) makes animation cheap to composite but costs GPU memory; over-promotion causes layer explosion.',
      'Virtual DOM batching reduces reflows but adds diffing overhead; for tiny apps direct DOM may be faster.',
    ],
    edgeCases: [
      'Reading getBoundingClientRect/offsetTop/scrollHeight forces a synchronous layout flush even mid-script.',
      'Some transforms still trigger paint if the element\'s contents change; not every transform is free.',
      '`display:none` removes nodes from the render tree (no layout), while `visibility:hidden` still lays out.',
      'Sticky/positioned elements and stacking contexts can create unexpected extra layers.',
    ],
    runtimeBehavior: [
      'The frame loop targets ~16.7ms at 60Hz; rAF callbacks run right before layout/paint each frame.',
      'The compositor thread can scroll and run transform/opacity animations even while the main thread is blocked.',
      'Style recalculation cost scales with selector complexity and affected element count.',
    ],
    scalability: [
      'Large lists overwhelm layout/paint; virtualize so only visible rows are in the render tree.',
      'Use CSS containment and `content-visibility: auto` to bound layout/paint to onscreen regions.',
    ],
    productionConcerns: [
      'Jank from forced synchronous layout is a recurring incident — profile with DevTools Performance and look for purple layout bars.',
      'Animating layout properties is a common CWV/INP regression; enforce transform/opacity in reviews.',
      'Memory growth from excessive compositor layers (will-change everywhere) can crash low-end devices.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Stages: DOM+CSSOM → Render Tree → Layout → Paint → Composite.',
    'Layout = geometry (expensive); Paint = pixels; Composite = GPU layers (cheap).',
    'width/top/margin → Layout+Paint+Composite.',
    'color/background → Paint+Composite.',
    'transform/opacity → Composite only (animate these!).',
    'Reading offsetHeight/getBoundingClientRect after a write = forced reflow.',
    'Fix thrashing: batch READS then WRITES.',
    'Schedule visual updates with requestAnimationFrame (frame-aligned).',
    'Main thread: JS+style+layout+paint; compositor thread separate.',
    'will-change promotes layers — use sparingly (layer explosion).',
    'content-visibility / containment bound layout+paint scope.',
    'Frameworks batch DOM updates to avoid repeated reflows.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite an animation that uses `left` to use `transform` instead, explaining the pipeline benefit.',
      hint: 'transform is composite-only.',
      solution: {
        lang: 'css',
        code: `/* before */ .a { transition: left .3s; } .a:hover { left: 100px; }\n/* after  */ .a { transition: transform .3s; } .a:hover { transform: translateX(100px); }`,
        explanation: [
          'Animating `left` forces Layout+Paint+Composite each frame.',
          '`transform` runs on the compositor, skipping layout and usually paint.',
          'Result: smoother animation, lower CPU.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Refactor this thrashing loop to avoid forced reflows: `for (b of boxes) b.style.height = b.offsetHeight*2 + "px"`.',
      hint: 'Read all, then write all.',
      solution: {
        lang: 'js',
        code: `const heights = boxes.map(b => b.offsetHeight) // all reads (one flush)\nboxes.forEach((b, i) => { b.style.height = heights[i] * 2 + 'px' }) // all writes`,
        explanation: [
          'Separating reads from writes collapses N reflows into effectively one.',
          'The reads happen before any write dirties layout.',
          'This is the standard layout-thrash remedy.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a frame-aligned scroll handler that updates a transform at most once per frame.',
      hint: 'Coalesce with a flag + requestAnimationFrame.',
      solution: {
        lang: 'js',
        code: `let ticking = false\nfunction onScroll() {\n  if (ticking) return\n  ticking = true\n  requestAnimationFrame(() => {\n    ticking = false\n    el.style.transform = 'translateY(' + (window.scrollY * -0.2) + 'px)'\n  })\n}\nwindow.addEventListener('scroll', onScroll, { passive: true })`,
        explanation: [
          'The `ticking` flag drops extra scroll events until the frame runs.',
          '`requestAnimationFrame` aligns the visual update to the next paint.',
          'Using `transform` keeps the work on the compositor; `passive` avoids blocking scroll.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with a code sketch, why `useLayoutEffect` (React) / `nextTick` (Vue) exists in terms of the rendering pipeline.',
      hint: 'Measure AFTER DOM mutation but relative to paint.',
      solution: {
        lang: 'js',
        code: `// React: run after DOM mutation, BEFORE the browser paints\nuseLayoutEffect(() => {\n  const h = ref.current.offsetHeight // safe measurement after mutation\n  setTooltipPos(h)                   // adjust before paint → no flicker\n})\n\n// Vue: wait for the batched DOM update to flush, then measure\nawait nextTick()\nconst h = el.offsetHeight`,
        explanation: [
          'Frameworks batch state changes and flush DOM mutations once to avoid repeated reflows.',
          '`useLayoutEffect`/`nextTick` let you read layout AFTER the DOM update but at the right point relative to paint.',
          'Measuring before the flush would force a premature reflow or read stale geometry.',
          '`useLayoutEffect` runs before paint (prevents flicker); `useEffect` runs after paint.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The rendering pipeline is the mental model behind every UI performance fix: smooth animations, jank-free scrolling, fast first paint. Engineers who understand it can diagnose and fix problems others can only guess at.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep here. Product companies (Zoho, Flipkart, Razorpay) ask about reflow vs repaint and why transform animations are cheap. FAANG-level interviews probe the main/compositor thread split, forced synchronous layout, layer promotion trade-offs, and Core Web Vitals.',
    whatInterviewersExpect:
      'They expect you to name the stages in order, distinguish layout/paint/composite costs, explain layout thrashing and its read-then-write fix, and know that transform/opacity are compositor-friendly — bonus for tying it to frameworks\' batching and INP/CWV.',
  },
}

export default browserRenderingPipeline
