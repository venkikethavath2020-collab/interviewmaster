import type { ConceptLesson } from '../../../types/lesson'

const listVirtualization: ConceptLesson = {
  // 1. Concept Summary
  slug: 'list-virtualization',
  name: 'List Virtualization',
  category: 'performance',
  difficulty: 'senior',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Rendering 10,000 rows means 10,000 DOM nodes — the browser chokes on layout, paint, and memory. Virtualization renders only what is visible, keeping huge lists buttery smooth.',
    'It is the difference between a 50ms first paint and a 5-second freeze; on feeds, tables, and chat apps it is often the single biggest perf win.',
    'Without it, scroll jank, memory bloat, and slow initial mount make large datasets unusable on mobile and low-end devices.',
    'Interviewers ask it to test whether you understand the cost of the DOM, not just how to call a library — windowing, recycling, and measurement are senior signals.',
    'Every serious frontend (Gmail, Slack, Twitter, trading dashboards) uses it; knowing the tradeoffs separates engineers who scale UIs from those who ship laggy ones.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'List virtualization is like a window on a moving train — you only see the few houses passing right now, not all of them.',
    story: [
      'Imagine you have a book with ten thousand pages, but your desk is tiny and can only hold three pages at once.',
      'Instead of laying every page on the desk (which would never fit), you keep just the three pages you are reading right now.',
      'As you scroll down, you quietly take away the page that left the top of the desk and slide in the next page at the bottom.',
      'The book FEELS like it is all there because the moment you need a new page it appears — but really your desk only ever holds three pages. That is exactly how virtualization shows a giant list using only a handful of real elements.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A web page is built from boxes called DOM nodes. The more boxes, the more work the browser does to position and paint them.',
    'If a list has thousands of items, making thousands of boxes is slow and uses lots of memory, even though you can only see a dozen at a time.',
    'Virtualization means you only create boxes for the items currently on screen (plus a few extra above and below), and you reuse them as the user scrolls.',
    'You fake the full height with one tall spacer so the scrollbar still looks right, but the actual visible boxes stay small in number.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'List virtualization (a.k.a. windowing) is a technique that renders only the subset of list items currently visible in the viewport, instead of rendering the entire dataset to the DOM.',
    how: 'You measure the scroll container, calculate which item indices fall inside the visible window (plus an overscan buffer), render only those, and offset them with padding/transform so they sit in the right place inside a container whose total height equals itemCount * itemHeight.',
    why: 'It keeps the number of live DOM nodes constant (a few dozen) regardless of dataset size, so mount time, memory, and scroll cost stay flat whether you have 100 or 1,000,000 rows.',
    code: {
      label: 'A minimal fixed-height virtual list',
      lang: 'js',
      code: `const ITEM_HEIGHT = 40\nconst items = Array.from({ length: 100000 }, (_, i) => 'Row ' + i)\n\nfunction render(scrollTop, viewportHeight) {\n  const start = Math.floor(scrollTop / ITEM_HEIGHT)\n  const visibleCount = Math.ceil(viewportHeight / ITEM_HEIGHT)\n  const end = start + visibleCount\n  const slice = items.slice(start, end)        // only ~15 rows\n  const offsetY = start * ITEM_HEIGHT          // push them down\n  const totalHeight = items.length * ITEM_HEIGHT\n  return { slice, offsetY, totalHeight }\n}`,
      explanation: [
        'ITEM_HEIGHT lets us compute geometry by arithmetic instead of measuring DOM.',
        'start = how many rows have scrolled past the top; end = start + how many fit on screen.',
        'We slice only the visible rows — never building 100,000 nodes.',
        'offsetY positions the slice correctly; totalHeight keeps the scrollbar honest by sizing a spacer.',
        'The visible node count stays ~15 no matter how big the dataset grows.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'List virtualization is a rendering optimization that maintains a constant-size pool of DOM nodes mapped to the items within the current scroll window plus an overscan margin. The scroll container is sized to the full virtual content height (itemCount × itemSize, or a cumulative offset map for variable sizes), and on each scroll event the visible index range is recomputed and the rendered slice (and its translate/padding offset) is updated. This bounds DOM node count, layout/paint cost, and memory to O(viewport) rather than O(dataset), at the cost of synchronized scroll handling and accurate size estimation.',

  // 7. Internal Working
  internalWorking: [
    'On mount, the component measures the scroll container height and either uses a known fixed item size or estimates/measures variable sizes to build a cumulative offset table.',
    'A spacer (or the container itself) is given the total virtual height so the native scrollbar reflects the full dataset, even though most rows do not exist in the DOM.',
    'On each scroll event, the engine reads scrollTop and computes startIndex = search(offsets, scrollTop) and endIndex from the viewport height, expanding by an overscan count on each side to avoid blank flashes.',
    'Only items in [startIndex, endIndex] are rendered; the slice is positioned with a transform translateY or top padding equal to the offset of startIndex.',
    'Frameworks reuse/recycle the same DOM nodes via keyed reconciliation (Vue/React) so scrolling mutates content rather than creating and destroying thousands of nodes, minimizing layout thrash and GC.',
    'For variable heights, measured row sizes are written back into the offset table after paint (often via ResizeObserver), and the total height is corrected, sometimes triggering a re-position to prevent scroll drift.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  FULL DATASET (100,000 rows)        WHAT IS ACTUALLY IN THE DOM
  ┌──────────────┐  index 0          ┌───────────────────────────┐
  │  row 0        │  ...              │  spacer top: 4980px (empty) │
  │  ...          │                   ├───────────────────────────┤
  ▼ scroll ▼                          │  row 124  ◄─┐               │
  ┌──────────────┐  index 124  ──────►│  row 125    │ visible      │
  │  row 124     │ ── VIEWPORT ──     │  row 126    │ window +     │
  │  row 125     │                    │  row 127    │ overscan     │
  │  row 126     │                    │  row 128  ◄─┘ (~15 nodes)  │
  └──────────────┘                    ├───────────────────────────┤
  │  ...          │                   │  spacer bottom: 3.9M px     │
  └──────────────┘  index 99999       └───────────────────────────┘
       total height = 100000 * 40px = 4,000,000px (scrollbar honest)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'DOM/heap: only ~15-30 element nodes plus their backing objects exist at any time, so memory is O(viewport), not O(dataset) — the other 99,985 rows are pure data in a JS array.',
    'The full data array still lives on the heap; virtualization shrinks the DOM, not the dataset. For truly massive data you also paginate/stream the array.',
    'Recycled nodes are mutated in place, so the GC sees stable allocation instead of churn from creating/destroying thousands of nodes per scroll.',
    'An offset/size table for variable rows is an extra O(dataset) array of numbers — cheap compared to DOM nodes, but still memory you should bound.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — visible range math',
      lang: 'js',
      code: `function visibleRange(scrollTop, viewportH, itemH, total, overscan = 3) {\n  const start = Math.max(0, Math.floor(scrollTop / itemH) - overscan)\n  const end = Math.min(total, Math.ceil((scrollTop + viewportH) / itemH) + overscan)\n  return { start, end }\n}\nvisibleRange(5000, 600, 40, 100000) // ~{ start: 122, end: 141 }`,
      explanation: [
        'Pure arithmetic — no DOM reads — so it is fast enough to run on every scroll frame.',
        'overscan renders a few rows beyond the viewport so fast scrolls do not flash blank.',
        'clamping with max/min keeps indices inside the dataset bounds.',
        'This is the heart of every fixed-height virtual list.',
      ],
    },
    intermediate: {
      label: 'Intermediate — variable heights via cumulative offsets',
      lang: 'js',
      code: `function buildOffsets(sizes) {\n  const offsets = [0]\n  for (let i = 0; i < sizes.length; i++) offsets.push(offsets[i] + sizes[i])\n  return offsets // offsets[i] = pixel top of row i; last = total height\n}\n\nfunction findStart(offsets, scrollTop) {\n  let lo = 0, hi = offsets.length - 1\n  while (lo < hi) {                 // binary search the offset table\n    const mid = (lo + hi) >> 1\n    if (offsets[mid] < scrollTop) lo = mid + 1\n    else hi = mid\n  }\n  return Math.max(0, lo - 1)\n}`,
      explanation: [
        'When rows differ in height you cannot divide; you keep a prefix-sum table of tops.',
        'buildOffsets is O(n) once; the last entry is the total scroll height.',
        'findStart binary-searches the table in O(log n) to map scrollTop to an index.',
        'Real libraries update sizes lazily as rows are measured, patching the table after paint.',
      ],
    },
    advanced: {
      label: 'Advanced — recycling pool with stable keys',
      lang: 'js',
      code: `// Conceptual recycler: map dataIndex -> reused node\nfunction makeRecycler(container) {\n  const pool = []                 // detached, reusable nodes\n  const active = new Map()        // dataIndex -> node\n  return function reconcile(start, end, getText) {\n    for (const [idx, node] of active) {\n      if (idx < start || idx >= end) { pool.push(node); active.delete(idx) }\n    }\n    for (let i = start; i < end; i++) {\n      if (active.has(i)) continue\n      const node = pool.pop() || document.createElement('div')\n      node.textContent = getText(i)         // mutate, do not recreate\n      node.style.transform = 'translateY(' + (i * 40) + 'px)'\n      container.appendChild(node)\n      active.set(i, node)\n    }\n  }\n}`,
      explanation: [
        'Nodes that scroll out are returned to a pool instead of destroyed.',
        'Nodes entering the window are pulled from the pool and re-textured — avoiding allocation/GC.',
        'transform: translateY positions rows without triggering layout reflow (composited).',
        'This is what frameworks do under the hood with keyed diffing; understanding it is a senior signal.',
      ],
    },
    realProject: {
      label: 'Real project — virtualized feed in Vue (vue-virtual-scroller style)',
      lang: 'js',
      code: `// Vue 3 setup: render only the windowed slice\nimport { ref, computed } from 'vue'\n\nexport function useVirtualList(items, itemHeight, viewportHeight) {\n  const scrollTop = ref(0)\n  const onScroll = (e) => { scrollTop.value = e.target.scrollTop }\n  const visible = computed(() => {\n    const start = Math.floor(scrollTop.value / itemHeight)\n    const count = Math.ceil(viewportHeight / itemHeight) + 4 // overscan\n    return items.value.slice(start, start + count).map((data, i) => ({\n      data, top: (start + i) * itemHeight, key: start + i,\n    }))\n  })\n  const totalHeight = computed(() => items.value.length * itemHeight)\n  return { onScroll, visible, totalHeight }\n}`,
      explanation: [
        'A composable returns reactive visible rows and a totalHeight to size the spacer.',
        'The template binds totalHeight to an inner div and absolutely positions each visible row at its top.',
        'In React this maps directly to react-window / react-virtualized; in Vue, vue-virtual-scroller / TanStack Virtual.',
        'This exact shape powers infinite feeds, big data tables, and chat histories in production.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem does list virtualization solve?',
      answer: 'Rendering a very large list creates one DOM node per item, which is slow to mount, paint, and scroll, and uses lots of memory. Virtualization renders only the visible items, keeping DOM size constant.',
      explanation: 'A good answer names the cost (DOM nodes) and the fix (render the visible window only), not just "it makes lists fast".',
    },
    {
      level: 'beginner',
      question: 'How does the scrollbar stay correct if most rows are not rendered?',
      answer: 'You set the scroll container (or an inner spacer) to the full virtual height — itemCount × itemHeight — so the browser shows a scrollbar as if every item existed, while only the windowed slice is actually in the DOM.',
      explanation: 'This tests whether the candidate understands the spacer/total-height trick that makes virtualization invisible to users.',
    },
    {
      level: 'intermediate',
      question: 'How do you virtualize a list when item heights are unknown or variable?',
      answer: 'Estimate sizes up front, render and measure rows after paint (e.g. with ResizeObserver), store measured heights in a cumulative offset table, and binary-search that table to map scrollTop to a start index. Correct the total height as measurements arrive.',
      explanation: 'Variable height is the real-world hard case; mentioning measurement + offset tables + binary search shows depth beyond fixed-height demos.',
    },
    {
      level: 'intermediate',
      question: 'What is overscan and why do you need it?',
      answer: 'Overscan renders a few extra rows above and below the viewport. It prevents blank flashes during fast scrolling because the next rows are already mounted by the time they enter view.',
      explanation: 'Shows awareness of perceived smoothness vs raw efficiency — a small buffer trades a little work for no flicker.',
    },
    {
      level: 'advanced',
      question: 'Why prefer transform: translateY over top for positioning rows?',
      answer: 'transform is handled on the compositor thread and does not trigger layout/reflow, only paint/composite, so repositioning rows during scroll is cheaper and avoids layout thrash. Changing top forces the layout engine to recompute geometry.',
      explanation: 'Connects virtualization to the rendering pipeline — a senior-level understanding of why a specific CSS choice matters.',
    },
    {
      level: 'senior',
      question: 'What are the downsides and failure modes of virtualization, and how do you mitigate them?',
      answer: 'Find-in-page (Ctrl+F) and accessibility can break because off-screen content is absent; anchor links and focus management get harder; variable heights cause scroll drift; and SEO suffers since crawlers see only the window. Mitigate with proper ARIA roles, rendering enough context, content-visibility as a lighter alternative, SSR for SEO, and careful scroll anchoring on size changes.',
      explanation: 'Senior signal: virtualization is a tradeoff, not a free win. Naming a11y, find-in-page, SEO, and scroll-anchoring shows real production scars.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does virtualization interact with infinite scroll / pagination?',
    'What is the difference between virtualization and the CSS content-visibility: auto property?',
    'How do you keep keyboard focus and ARIA correct in a virtualized list?',
    'How would you virtualize a grid (both axes) instead of a 1D list?',
    'How do you handle sticky headers or grouped sections in a virtual list?',
    'When is virtualization NOT worth it (small lists, SEO pages)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Virtualizing tiny lists (a few dozen items).',
      why: 'The bookkeeping (scroll math, measurement, recycling) costs more than just rendering the items, and it breaks find-in-page and a11y for no benefit.',
      fix: 'Only virtualize when item count is large (hundreds+) or item rendering is expensive; profile before adding it.',
    },
    {
      mistake: 'Using array index as the React/Vue key for recycled rows.',
      why: 'When the window shifts, indices change and the framework reuses the wrong DOM node, causing flicker, stale state, or wrong scroll positions.',
      fix: 'Key by a stable item id (data.id), and translate-position by absolute index instead.',
    },
    {
      mistake: 'Assuming fixed item height when content actually wraps.',
      why: 'Wrong heights cause overlapping rows, scroll jumps, and a scrollbar that does not match the content.',
      fix: 'Measure rows (ResizeObserver) and use a cumulative offset table, or enforce a fixed height with truncation.',
    },
    {
      mistake: 'Forgetting accessibility and find-in-page.',
      why: 'Off-screen rows do not exist in the DOM, so screen readers and Ctrl+F cannot find them.',
      fix: 'Add proper ARIA roles/aria-rowcount, expose total counts, and consider content-visibility for lighter cases that keep nodes searchable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'vue-virtual-scroller and TanStack Virtual power large data tables, comment threads, and feeds; composables expose the windowed slice as reactive computed refs.' },
    { area: 'React', detail: 'react-window and react-virtualized (and TanStack Virtual) virtualize tables and chat logs; the FixedSizeList/VariableSizeList components are interview-name-drop-worthy.' },
    { area: 'Node.js', detail: 'The server side streams/paginates the dataset so the client only fetches the pages near the visible window — virtualization on the client pairs with cursor pagination on the server.' },
    { area: 'Backend', detail: 'APIs expose total counts and cursor-based slices (limit/offset or keyset) so the virtual list can size its spacer and fetch on demand without loading the whole dataset.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'DOM node count stays O(viewport), so mount time and memory are flat regardless of dataset size.',
      'Scroll stays at 60fps because each frame only mutates a handful of recycled nodes.',
    ],
    bad: [
      'Scroll handlers run frequently; doing heavy work (layout reads, JSON parsing) per scroll event causes jank.',
      'Wrong height estimates cause reflows and scroll drift, which can be worse than no virtualization.',
    ],
    optimizations: [
      'Throttle/rAF-batch scroll handling and avoid synchronous layout reads inside it.',
      'Use transform translateY (composited) instead of top/margin to position rows.',
      'Cache measured row heights in an offset table; avoid re-measuring unchanged rows.',
      'Tune overscan: enough to avoid blank flashes, small enough to keep node count low.',
    ],
  },

  // 16. Related Concepts
  related: {
    prerequisites: ['dom', 'browser-rendering-pipeline', 'event-system', 'observers'],
    nextConcepts: ['code-splitting-lazy-loading', 'core-web-vitals', 'requestanimationframe', 'debounce', 'throttle'],
    dependencyNote:
      'Virtualization sits on top of how the DOM and rendering pipeline work; you need to understand layout/paint cost and scroll events first. It pairs with debounce/throttle and rAF for smooth scroll handling, and with code-splitting and Core Web Vitals as part of the broader performance toolkit.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a tall rectangle labeled "scroll container — full height = itemCount × itemHeight".',
      'Draw a small viewport window over the middle of it.',
      'Inside the window, draw ~5 rows and label them "the only nodes in the DOM (+overscan)".',
      'Write the math: start = floor(scrollTop / itemHeight), end = start + ceil(viewportH / itemHeight).',
      'Show a translateY arrow offsetting the rendered slice to its correct position.',
      'Say: "We fake the full height for the scrollbar but only render the visible window, so DOM size is constant no matter the dataset."',
    ],
    diagram: `  ┌─ container: height = N * itemH ─┐
  │  (empty spacer above)            │
  │ ┌─ viewport ───────────────────┐ │
  │ │ row k     ◄ translateY(k*h)  │ │  ← only these exist
  │ │ row k+1                       │ │
  │ │ row k+2                       │ │
  │ └──────────────────────────────┘ │
  │  (empty spacer below)            │
  └──────────────────────────────────┘
  start = floor(scrollTop / itemH)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'List virtualization renders only the items inside the scroll window (plus a small overscan) instead of the whole dataset, keeping DOM nodes constant at O(viewport). You size a spacer to the full virtual height so the scrollbar stays correct, compute the visible index range from scrollTop and itemHeight, and offset the slice with translateY. For variable heights you measure rows and binary-search a cumulative offset table. Watch out for a11y, find-in-page, wrong keys, and scroll drift — and only use it for large lists.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'List virtualization, or windowing, solves the problem that a large list creates one DOM node per item, and the browser cannot cheaply lay out, paint, and keep thousands of nodes in memory. The idea is to render only the items currently visible in the viewport, plus a small overscan buffer above and below to avoid blank flashes during fast scrolls. To make this invisible to the user, you size the scroll container — or an inner spacer — to the full virtual height, itemCount times itemHeight, so the native scrollbar behaves as if every row exists. On each scroll event you read scrollTop and compute the start index as floor of scrollTop over itemHeight, and the end index from the viewport height, then render just that slice and offset it with transform translateY, which is composited and avoids layout reflow. For variable heights you cannot divide, so you measure rows after paint, store their tops in a cumulative offset table, and binary-search it to map a scroll position to an index. The tradeoffs are real and senior interviewers probe them: off-screen content breaks find-in-page, accessibility, and SEO, and bad height estimates cause scroll drift. So I only virtualize genuinely large lists, key rows by stable ids, recycle nodes, and add ARIA roles and counts. In Vue I would reach for TanStack Virtual or vue-virtual-scroller; in React, react-window.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Performance vs accessibility/SEO: removing off-screen nodes speeds rendering but breaks find-in-page, screen-reader traversal, and crawler indexing — sometimes content-visibility: auto is a better, lighter choice.',
      'Fixed vs variable height: fixed height is O(1) math and rock-solid; variable height needs measurement, offset tables, and drift correction, adding real complexity.',
      'DIY vs library: hand-rolling teaches the mechanics but libraries handle edge cases (RTL, sticky headers, grids, resize) you will otherwise rediscover painfully.',
    ],
    edgeCases: [
      'Scroll drift when measured heights differ from estimates — must anchor scroll to a known item on correction.',
      'Sticky headers / grouped sections need separate handling outside the recycled pool.',
      'Jump-to-index requires computing the target offset from the size table and may need to measure on the way.',
      'Bi-directional (grid) virtualization multiplies complexity across both axes.',
    ],
    runtimeBehavior: [
      'Scroll events fire faster than frames; positioning should be batched with requestAnimationFrame and avoid synchronous layout reads (no forced reflow).',
      'transform/opacity changes stay on the compositor; top/left/height changes trigger layout — choose composited properties.',
      'ResizeObserver callbacks measuring rows can themselves cause work; debounce and write back to the offset table outside the paint critical path.',
    ],
    scalability: [
      'Client virtualization caps DOM cost but not data cost — pair with cursor/keyset pagination so you never hold a million-row array fully in memory.',
      'For infinite scroll, prefetch the next page when the window nears the end so new data is ready before the user reaches it.',
    ],
    productionConcerns: [
      'Test with screen readers and Ctrl+F; add aria-rowcount/aria-rowindex and announce loading state.',
      'SSR pages should render a reasonable first window for SEO/first paint, then hydrate the virtualizer.',
      'Monitor scroll jank (long tasks) and validate that height estimates match reality on real content/devices.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Virtualization = render only the visible window + overscan, recycle nodes.',
    'DOM nodes stay O(viewport), not O(dataset).',
    'Spacer/container height = itemCount × itemHeight → scrollbar stays correct.',
    'start = floor(scrollTop / itemH); end = start + ceil(viewportH / itemH).',
    'Variable heights → measure rows, cumulative offset table, binary search.',
    'Position with transform translateY (composited, no reflow).',
    'Overscan a few rows to avoid blank flashes on fast scroll.',
    'Key by stable id, NOT array index.',
    'Breaks find-in-page, a11y, SEO → add ARIA, consider content-visibility, SSR first window.',
    'Pair with cursor pagination so data stays bounded too.',
    'Libraries: react-window (React), TanStack Virtual / vue-virtual-scroller (Vue).',
    'Only virtualize large or expensive lists — never tiny ones.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function visibleCount(viewportHeight, itemHeight) that returns how many fixed-height rows fit (rounding up so a partial row still renders).',
      hint: 'Use Math.ceil.',
      solution: {
        lang: 'js',
        code: `function visibleCount(viewportHeight, itemHeight) {\n  return Math.ceil(viewportHeight / itemHeight)\n}\nvisibleCount(600, 40) // 15`,
        explanation: [
          'ceil ensures a partially visible bottom row is still rendered.',
          'This count plus overscan determines how many nodes to mount.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement getWindow(scrollTop, viewportH, itemH, total, overscan) returning clamped { start, end } indices.',
      hint: 'Clamp with Math.max(0, ...) and Math.min(total, ...).',
      solution: {
        lang: 'js',
        code: `function getWindow(scrollTop, viewportH, itemH, total, overscan = 3) {\n  const first = Math.floor(scrollTop / itemH)\n  const last = Math.ceil((scrollTop + viewportH) / itemH)\n  const start = Math.max(0, first - overscan)\n  const end = Math.min(total, last + overscan)\n  return { start, end }\n}`,
        explanation: [
          'first/last are the raw visible bounds from scroll geometry.',
          'overscan widens the window on both sides for smooth scrolling.',
          'Clamping prevents negative or out-of-range indices.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Given an array of variable row heights, build a cumulative offset table and write findIndex(offsets, scrollTop) using binary search.',
      hint: 'offsets[i] is the pixel top of row i; the last entry is the total height.',
      solution: {
        lang: 'js',
        code: `function buildOffsets(heights) {\n  const offsets = [0]\n  for (let i = 0; i < heights.length; i++) offsets.push(offsets[i] + heights[i])\n  return offsets\n}\nfunction findIndex(offsets, scrollTop) {\n  let lo = 0, hi = offsets.length - 1\n  while (lo < hi) {\n    const mid = (lo + hi) >> 1\n    if (offsets[mid] < scrollTop) lo = mid + 1\n    else hi = mid\n  }\n  return Math.max(0, lo - 1)\n}`,
        explanation: [
          'buildOffsets is a prefix sum: offsets[i] = sum of heights before row i.',
          'findIndex binary-searches for the first offset >= scrollTop, then steps back one to get the row containing scrollTop.',
          'This is O(log n) per scroll and underpins variable-height virtualization.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Sketch a minimal vanilla-JS virtual list: given a container, item height, count, and a renderRow(index) returning a string, render only visible rows on scroll. Explain how DOM stays bounded.',
      hint: 'Use one spacer div for total height and an absolutely positioned layer for rows.',
      solution: {
        lang: 'js',
        code: `function virtualList(container, itemH, count, renderRow, overscan = 3) {\n  const spacer = document.createElement('div')\n  spacer.style.height = count * itemH + 'px'\n  spacer.style.position = 'relative'\n  container.appendChild(spacer)\n  function paint() {\n    const top = container.scrollTop\n    const start = Math.max(0, Math.floor(top / itemH) - overscan)\n    const end = Math.min(count, Math.ceil((top + container.clientHeight) / itemH) + overscan)\n    spacer.innerHTML = ''\n    for (let i = start; i < end; i++) {\n      const row = document.createElement('div')\n      row.style.position = 'absolute'\n      row.style.top = (i * itemH) + 'px'\n      row.style.height = itemH + 'px'\n      row.textContent = renderRow(i)\n      spacer.appendChild(row)\n    }\n  }\n  container.addEventListener('scroll', () => requestAnimationFrame(paint))\n  paint()\n}`,
        explanation: [
          'The spacer is sized to count × itemH so the scrollbar reflects the whole dataset.',
          'On scroll, only rows in [start, end] are built and absolutely positioned at i × itemH.',
          'requestAnimationFrame batches paints to the frame, avoiding redundant work.',
          'Because we only ever create the visible window, the DOM holds a constant ~20 nodes regardless of count — a real impl would recycle nodes instead of innerHTML clearing to avoid allocation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Virtualization is the canonical answer to "how do you make a huge list fast", and it forces you to reason about real DOM cost, the rendering pipeline, and tradeoffs — exactly the systems thinking senior frontend roles screen for.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep — they may just ask what it is and name a library. Product companies (Zoho, Flipkart, Razorpay) ask you to implement the visible-range math and handle variable heights. FAANG-level interviews probe recycling, compositor vs layout, accessibility/SEO tradeoffs, and scroll-drift correction.',
    whatInterviewersExpect:
      'They expect you to state the problem (DOM node cost), describe windowing with overscan and a full-height spacer, give the index math, handle variable heights with an offset table, and honestly discuss the a11y/find-in-page/SEO downsides and when NOT to use it.',
  },
}

export default listVirtualization
