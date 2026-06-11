import type { ConceptLesson } from '../../../types/lesson'

const listRenderingPerformance: ConceptLesson = {
  // 1. Concept Summary
  slug: 'list-rendering-performance',
  name: 'List Rendering Performance',
  category: 'performance',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Lists are where Vue apps slow down first — rendering and diffing thousands of rows is the most common real-world performance bottleneck.',
    'The :key choice directly controls how efficiently Vue\'s diff reuses DOM nodes; a bad key (or index key) causes wasteful re-creation and state bugs.',
    'Techniques like virtual scrolling, pagination, v-memo, and stable keys are exactly what interviewers probe when they ask "how do you render 10,000 rows smoothly?".',
    'Understanding the children diff algorithm (keyed reconciliation) separates engineers who can debug janky lists from those who only know v-for syntax.',
    'Production incidents — frozen tables, dropped frames during scroll, lost input focus in editable rows — almost always trace back to list rendering decisions.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Rendering a big list is like seating a huge classroom: smart teachers only re-seat the kids who actually moved, and only set out chairs for the rows you can currently see.',
    story: [
      'Imagine a teacher seating 1,000 students. A lazy teacher would clear every chair and re-seat everyone whenever one new kid arrives — exhausting and slow.',
      'A smart teacher gives every student a name tag (a key). When a new kid arrives, she just adds one chair and leaves everyone else where they are.',
      'And if the room only fits 30 chairs on screen at once, she only sets out 30 — the rest wait outside until you scroll to them. That is virtual scrolling.',
      'Vue is the smart teacher: with good name tags (keys) and only drawing the rows you can see, it keeps even huge lists fast.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you render a list with v-for, Vue builds a virtual list of nodes and compares it to the previous one to update the page efficiently.',
    'Each item needs a unique, stable key so Vue can match old nodes to new ones instead of rebuilding everything — this lets it move, reuse, and add nodes minimally.',
    'For very large lists, even efficient diffing of every row is too much, so you only render the rows currently visible on screen (virtual scrolling) or split them into pages.',
    'Other tricks include avoiding heavy work per row, memoizing unchanged rows, and not putting expensive method calls inside the loop.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'List rendering performance is the set of techniques for rendering and updating v-for lists efficiently: stable unique keys, minimizing per-row work, memoizing unchanged rows, and rendering only visible rows for very large datasets.',
    how: 'Vue diffs keyed children to reuse DOM nodes; you help it with a stable :key. For large lists you cap the rendered DOM with virtual scrolling or pagination, and use v-memo to skip diffing unchanged rows.',
    why: 'The DOM is expensive: creating, patching, and laying out thousands of nodes drops frames. Limiting DOM size and reuse keeps interactions at 60fps.',
    code: {
      label: 'Stable key vs index key',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface User { id: number; name: string }\nconst users = ref<User[]>([{ id: 1, name: \'Ann\' }, { id: 2, name: \'Bo\' }])\n</script>\n\n<template>\n  <!-- GOOD: stable unique id -->\n  <li v-for="u in users" :key="u.id">{{ u.name }}</li>\n\n  <!-- RISKY: index reorders/inserts break node identity -->\n  <li v-for="(u, i) in users" :key="i">{{ u.name }}</li>\n</template>',
      explanation: [
        'A stable id lets Vue track each row across reorders and insertions, reusing DOM nodes.',
        'An index key changes meaning when items are inserted/removed, so Vue patches the wrong nodes.',
        'Index keys can corrupt component state (e.g. an input\'s value attaching to the wrong row).',
        'Always key by a stable unique identifier from your data, not the loop index.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'List rendering performance concerns how Vue\'s keyed children diff (patchKeyedChildren) reconciles a v-for output and how you bound the cost of that reconciliation. With unique stable keys, Vue uses a two-ended diff plus a longest-increasing-subsequence pass to minimize DOM moves and reuse existing nodes; with unstable or index keys it falls back to patching by position, often re-creating nodes and detaching component state. Beyond keys, performance comes from limiting the number of rendered nodes (virtual scrolling / pagination / windowing), memoizing rows whose inputs are unchanged (v-memo), keeping per-row work cheap (no inline expensive calls), and avoiding deep reactivity where shallow suffices.',

  // 7. Internal Working
  internalWorking: [
    'The compiler turns v-for into a render call that produces an array of VNodes, each carrying its key.',
    'On update, Vue runs patchKeyedChildren: it first syncs from both ends (matching equal keys at the start and end) to handle the common append/prepend/edit cases cheaply.',
    'For the remaining middle, it builds a key-to-index map of the new children, then walks the old children, reusing nodes whose keys still exist and removing those whose keys vanished.',
    'It computes the longest increasing subsequence of reused node positions so that the minimum number of DOM move operations are performed for reorders.',
    'New keys with no old match cause node creation; unmatched old keys cause removal — so a stable key set maximizes reuse and minimizes create/remove churn.',
    'With v-memo on the v-for element, each row\'s subtree is additionally guarded by a dependency comparison so unchanged rows skip patching entirely; virtual scrolling caps how many VNodes exist in the first place.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   data: [a, b, c, d]   ──►  v-for ──► VNodes [k:a][k:b][k:c][k:d]
                                              │
                      reorder to [a, c, b, d] │  patchKeyedChildren
                                              ▼
        old: a b c d            sync ends: a ... d match
        new: a c b d            middle {b,c} → reuse by key, LIS → 1 move
                                              │
                                  minimal DOM ops (move b/c, no recreate)

   HUGE list (10k):
   ┌───────── viewport (30 rows rendered) ─────────┐
   │  row 120 .. row 150   ◄── only these in DOM    │
   └────────────────────────────────────────────────┘
        rows 0..119 and 151..9999 = not rendered (windowed)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Every rendered row holds a VNode and real DOM nodes on the heap; a 10k-row table without windowing keeps 10k DOM subtrees alive, ballooning memory and layout cost.',
    'Virtual scrolling keeps only the visible window of DOM nodes alive, recycling them as you scroll, so memory stays roughly constant regardless of dataset size.',
    'The keyed diff allocates a temporary key-to-index map per update; stable keys keep this work proportional to changed items, not total items.',
    'v-memo retains a cached VNode and deps per row; on huge lists this memory is bounded by combining it with windowing.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — correct keys and cheap rows',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Task { id: string; title: string }\nconst tasks = ref<Task[]>([])\n</script>\n\n<template>\n  <ul>\n    <li v-for="task in tasks" :key="task.id">{{ task.title }}</li>\n  </ul>\n</template>',
      explanation: [
        'Each row is keyed by a stable unique id.',
        'The row template is minimal — no expensive method calls inline.',
        'Adding/removing/reordering tasks lets Vue reuse the unaffected DOM nodes.',
        'This is the baseline correct pattern before any advanced optimization.',
      ],
    },
    intermediate: {
      label: 'Intermediate — pagination to cap DOM size',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst all = ref<{ id: number; name: string }[]>([])\nconst page = ref(0)\nconst pageSize = 50\nconst pageItems = computed(() =>\n  all.value.slice(page.value * pageSize, page.value * pageSize + pageSize)\n)\nconst pageCount = computed(() => Math.ceil(all.value.length / pageSize))\n</script>\n\n<template>\n  <li v-for="item in pageItems" :key="item.id">{{ item.name }}</li>\n  <button :disabled="page === 0" @click="page--">Prev</button>\n  <button :disabled="page >= pageCount - 1" @click="page++">Next</button>\n</template>',
      explanation: [
        'Only 50 rows are ever in the DOM regardless of total dataset size.',
        'pageItems is a computed, so the slice is cached until all or page changes.',
        'This is the simplest way to keep a large list fast without a windowing library.',
        'Keys remain stable ids so within-page updates still reuse nodes.',
      ],
    },
    advanced: {
      label: 'Advanced — v-memo to skip unchanged rows on selection',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Row { id: number; label: string }\nconst rows = ref<Row[]>([])\nconst selectedId = ref<number | null>(null)\n</script>\n\n<template>\n  <div\n    v-for="row in rows"\n    :key="row.id"\n    v-memo="[row.label, row.id === selectedId]"\n    :class="{ selected: row.id === selectedId }"\n  >\n    {{ row.label }}\n  </div>\n</template>',
      explanation: [
        'Without v-memo, changing selectedId re-diffs every row.',
        'With v-memo, only the previously-selected and newly-selected rows re-render.',
        'The dependency array must include every value the row\'s output uses (label + selected state).',
        'This is the classic interview answer for "selecting a row in a 5,000-row list is laggy".',
      ],
    },
    realProject: {
      label: 'Real project — virtual-scrolled activity feed',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\ninterface Event { id: string; text: string }\nconst events = ref<Event[]>([]) // could be 50,000\nconst rowH = 40\nconst viewportH = 600\nconst scrollTop = ref(0)\nconst start = computed(() => Math.floor(scrollTop.value / rowH))\nconst count = Math.ceil(viewportH / rowH) + 5\nconst visible = computed(() => events.value.slice(start.value, start.value + count))\nconst pad = computed(() => start.value * rowH)\nconst totalH = computed(() => events.value.length * rowH)\nfunction onScroll(e: Event & { target: HTMLElement }) {\n  scrollTop.value = (e.target as unknown as HTMLElement).scrollTop\n}\n</script>\n\n<template>\n  <div :style="{ height: viewportH + \'px\', overflow: \'auto\' }" @scroll="onScroll">\n    <div :style="{ height: totalH + \'px\', position: \'relative\' }">\n      <div :style="{ transform: `translateY(${pad}px)` }">\n        <div v-for="ev in visible" :key="ev.id" :style="{ height: rowH + \'px\' }">\n          {{ ev.text }}\n        </div>\n      </div>\n    </div>\n  </div>\n</template>',
      explanation: [
        'Only ~20 rows are ever in the DOM even with 50,000 events.',
        'A tall spacer (totalH) preserves the scrollbar size; a translateY offset positions the window.',
        'visible is a computed window keyed by stable event ids.',
        'In production you would use a battle-tested lib (vue-virtual-scroller / TanStack Virtual), but this shows the mechanics interviewers want.',
        'Memory and layout stay constant as the dataset grows — the core scalability win.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why does Vue require a :key on v-for, and what makes a good key?',
      answer: 'The key lets Vue identify each node across updates so it can reuse, move, and patch DOM nodes minimally instead of recreating them. A good key is a stable, unique identifier from the data (like an id), not the loop index.',
      explanation: 'The expected point is node identity for the diff — and that index is unstable under insert/reorder.',
    },
    {
      level: 'beginner',
      question: 'What can go wrong if you use the array index as the key?',
      answer: 'When items are inserted, removed, or reordered, indexes shift, so Vue matches the wrong old node to the new one. This causes unnecessary DOM patches and bugs like input values or component state attaching to the wrong row.',
      explanation: 'Mentioning both performance waste and the stateful-component bug is the complete answer.',
    },
    {
      level: 'intermediate',
      question: 'How would you render a list of 10,000 items without freezing the page?',
      answer: 'Avoid putting all 10,000 in the DOM. Use virtual scrolling (render only the visible window) or pagination. Keep stable keys, minimize per-row work, and optionally use v-memo to skip unchanged rows. Fetch incrementally if the data is remote.',
      explanation: 'The headline answer is windowing — limiting DOM nodes is the dominant factor.',
    },
    {
      level: 'intermediate',
      question: 'Selecting a row in a large list is laggy because every row re-renders. How do you fix it?',
      answer: 'Use v-memo on the v-for element with a dependency array including the row\'s data plus its selected state, so only the rows whose selected state changed re-render. Alternatively isolate per-row state in child components so selection does not touch siblings.',
      explanation: 'This tests knowing that a single shared selection ref invalidates the whole list unless rows are memoized.',
    },
    {
      level: 'advanced',
      question: 'Explain how Vue\'s keyed children diff minimizes DOM operations.',
      answer: 'Vue first syncs matching keys from both ends to handle common append/prepend/edit. For the middle it builds a key-to-index map, reuses nodes by key, removes vanished keys, and computes a longest-increasing-subsequence of reused positions to perform the fewest DOM moves for reorders.',
      explanation: 'Naming the two-ended sync and the LIS step is a strong senior signal.',
    },
    {
      level: 'senior',
      question: 'What are the trade-offs of virtual scrolling, and when is it the wrong choice?',
      answer: 'Virtual scrolling keeps DOM/memory constant but complicates variable-height rows, scroll restoration, find-in-page, accessibility, and SEO (content not in the DOM). For modest lists (a few hundred), pagination or plain rendering with v-memo is simpler and avoids these issues. Use windowing only when the dataset is large enough that DOM size is the proven bottleneck.',
      explanation: 'Senior signal: weighing correctness/accessibility costs against the perf benefit and not over-engineering small lists.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does v-memo complement keyed diffing for lists?',
    'Why can index keys cause input focus/value bugs in editable rows?',
    'What is the longest-increasing-subsequence step in Vue\'s diff for?',
    'How do you handle variable-height rows in virtual scrolling?',
    'When would shallowRef on a large array help list performance?',
    'How do you keep scroll position when prepending items to a feed?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using the loop index as :key.',
      why: 'Indexes shift on insert/remove/reorder, so Vue patches the wrong nodes and stateful elements (inputs, components) attach to the wrong row.',
      fix: 'Key by a stable unique identifier from the data.',
    },
    {
      mistake: 'Rendering thousands of rows directly into the DOM.',
      why: 'The DOM cost (creation, layout, memory) dominates and drops frames regardless of how good the diff is.',
      fix: 'Use virtual scrolling or pagination to cap rendered nodes.',
    },
    {
      mistake: 'Calling expensive methods or building new objects inside the v-for template.',
      why: 'They run for every row on every render, multiplying work and creating GC churn.',
      fix: 'Precompute with a computed (cached) and pass plain data into the row.',
    },
    {
      mistake: 'Sharing one selection/hover ref across all rows without memoization.',
      why: 'Any change to that ref re-renders every row in the list.',
      fix: 'Use v-memo per row keyed on its own selected state, or isolate state in row components.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'patchKeyedChildren and the LIS-based move minimization power all v-for updates; correct keys are what make it efficient.' },
    { area: 'Component library', detail: 'Data grids/tables (e.g. PrimeVue, Element Plus) ship virtual scrolling and row memoization to handle thousands of rows at 60fps.' },
    { area: 'Nuxt', detail: 'Infinite-scroll feeds combine server pagination with client windowing; SSR renders the first window for fast first paint.' },
    { area: 'Pinia', detail: 'Large list state is often kept with shallow reactivity and replaced immutably so the keyed diff and v-memo detect changes efficiently.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Stable keys let the diff reuse DOM nodes and minimize moves via the LIS pass.',
      'Windowing keeps DOM size and memory constant regardless of dataset size.',
    ],
    bad: [
      'Index keys and full re-renders cause node re-creation and state bugs.',
      'Heavy per-row work or deep reactivity on huge arrays multiplies cost across all rows.',
    ],
    optimizations: [
      'Always key by a stable unique id.',
      'Virtualize or paginate large lists so only visible rows render.',
      'Use v-memo to skip unchanged rows on frequent updates like selection/hover.',
      'Consider shallowRef for large arrays of immutable items to cut reactivity overhead, and precompute row data in cached computeds.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-for', 'v-for-key', 'virtual-dom', 'computed-caching'],
    nextConcepts: ['v-once-v-memo', 'lazy-loading-components', 'reactivity-performance', 'vue-performance-overview'],
    dependencyNote:
      'This builds on v-for and especially v-for-key (the diff relies on keys) plus the virtual-dom diffing model. It pairs with v-memo for row memoization and shallow reactivity for large datasets, and is a core pillar of overall Vue performance.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw old children [a b c d] and new [a c b d] with keys.',
      'Show the two-ended sync matching a at the start and d at the end.',
      'For the middle, draw a key map and show b/c being reused (not recreated) and moved via the LIS step.',
      'Switch to a huge-list sketch: draw a viewport box rendering only ~30 rows with a tall spacer above/below.',
      'Conclude: "stable keys make the diff reuse nodes; windowing bounds the DOM — together they make huge lists smooth."',
    ],
    diagram: `  KEYED DIFF
  old: a b c d
  new: a c b d   → sync ends (a,d) → reuse b,c by key → LIS → 1 move

  WINDOWING
  [ spacer height = start*rowH ]
  [ render rows start..start+30 ]  ◄ only these in DOM
  [ spacer height = remaining   ]`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'List performance comes down to two things: help the diff and limit the DOM. Give every v-for row a stable unique key so Vue reuses and moves nodes instead of recreating them; never use the index. For large datasets, render only what is visible with virtual scrolling or pagination so DOM size stays constant. Add v-memo to skip unchanged rows on frequent updates, keep per-row work cheap, and prefer cached computeds over inline method calls. Index keys and full-DOM rendering are the two classic causes of janky lists.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'List rendering is usually where a Vue app first gets slow, and the fixes fall into two buckets: making the diff efficient and limiting how much DOM exists. First, keys. Vue diffs the children of a v-for with patchKeyedChildren: it syncs matching keys from both ends to handle the common append, prepend, and edit cases cheaply, then for the middle it builds a key-to-index map, reuses nodes whose keys still exist, removes ones that vanished, and computes a longest-increasing-subsequence so it performs the minimum number of DOM moves on reorder. This only works if keys are stable and unique — keying by the array index breaks it, because inserting or reordering shifts indexes, so Vue patches the wrong nodes and stateful elements like inputs attach to the wrong row. So rule one: always key by a stable id. Second, the DOM itself is the expensive part. Even a perfect diff over 10,000 nodes is too much layout and memory. So for large datasets you render only the visible window with virtual scrolling, or you paginate. Windowing keeps DOM size and memory roughly constant no matter how big the dataset grows. On top of that, when a shared piece of state like the selected row changes, every row would normally re-render; you fix that with v-memo per row so only the affected rows re-render. Finally, keep per-row work cheap — no expensive method calls inside the loop, precompute with cached computeds, and consider shallowRef for huge arrays of immutable items to cut reactivity overhead. The senior nuance is not to over-engineer: for a few hundred rows, pagination plus v-memo is simpler and avoids virtual scrolling\'s costs around variable heights, accessibility, and find-in-page.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Virtual scrolling gives constant memory/DOM but breaks find-in-page, complicates variable-height rows, scroll restoration, and accessibility.',
      'v-memo saves diffing but adds comparison + cache memory; on tiny rows it can be net-negative.',
      'shallowRef cuts reactivity cost on large arrays but you must update immutably and lose deep tracking.',
    ],
    edgeCases: [
      'Index keys silently corrupt component/input state on reorder.',
      'Variable-height rows make windowing math (offsets, total height) significantly harder.',
      'Prepending to a feed shifts scroll position unless you compensate the scrollTop.',
      'Mutating array items in place can prevent v-memo from detecting changes (shallow ===).',
    ],
    runtimeBehavior: [
      'The keyed diff is roughly O(n) with a key map and an LIS pass for minimal moves.',
      'Unkeyed lists fall back to positional patching, often recreating nodes.',
      'Windowed lists recycle a fixed pool of DOM nodes as scrollTop changes.',
    ],
    scalability: [
      'Windowing makes render cost independent of dataset size — the key scalability lever for big tables/feeds.',
      'Combine server-side pagination with client windowing so neither the network nor the DOM becomes the bottleneck.',
    ],
    productionConcerns: [
      'Profile with the Performance panel to confirm DOM size vs diffing is the real cost before adding complexity.',
      'Test accessibility and keyboard navigation in virtualized lists; offscreen rows are not in the accessibility tree.',
      'Guard against layout thrashing from reading scroll metrics in tight loops; debounce/raf the scroll handler.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Always :key by a stable unique id — never the index.',
    'Index keys break reorder/insert and corrupt input/component state.',
    'Keyed diff: two-ended sync + key map + LIS for minimal moves.',
    'Large lists: virtual scroll or paginate to cap DOM nodes.',
    'v-memo per row skips unchanged rows on frequent updates.',
    'Keep per-row templates cheap; no inline expensive calls.',
    'Precompute filtered/sorted data in cached computeds.',
    'shallowRef + immutable updates for huge arrays.',
    'Windowing → constant memory/DOM regardless of size.',
    'Virtual scrolling costs: a11y, find-in-page, variable heights.',
    'Compensate scrollTop when prepending to feeds.',
    'Profile before optimizing — confirm DOM vs diff is the bottleneck.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Fix a v-for that uses the index as key so it uses a stable id instead.',
      hint: 'Each item already has an id field.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- before: :key="i" -->\n  <li v-for="item in items" :key="item.id">{{ item.name }}</li>\n</template>',
        explanation: [
          'The stable id lets Vue track each row across updates.',
          'Reorders and insertions now reuse DOM nodes correctly.',
          'Stateful children no longer attach to the wrong row.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add client-side pagination (50 per page) to a large list using a cached computed.',
      hint: 'slice() inside a computed, plus a page ref.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst all = ref<{ id: number; name: string }[]>([])\nconst page = ref(0)\nconst items = computed(() => all.value.slice(page.value * 50, page.value * 50 + 50))\n</script>\n\n<template>\n  <li v-for="i in items" :key="i.id">{{ i.name }}</li>\n  <button @click="page++">Next</button>\n</template>',
        explanation: [
          'Only 50 rows are rendered at a time.',
          'items is cached until all or page changes.',
          'DOM size stays small regardless of total count.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A 5,000-row list re-renders entirely when the hovered row changes. Use v-memo to fix it.',
      hint: 'Memoize each row on its own data plus the hovered state.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst rows = ref<{ id: number; text: string }[]>([])\nconst hoveredId = ref<number | null>(null)\n</script>\n\n<template>\n  <div\n    v-for="row in rows"\n    :key="row.id"\n    v-memo="[row.text, row.id === hoveredId]"\n    @mouseenter="hoveredId = row.id"\n  >\n    {{ row.text }}\n  </div>\n</template>',
        explanation: [
          'Only the previously- and newly-hovered rows re-render.',
          'The deps array captures both the row data and the hover flag.',
          'The other ~4,998 rows reuse their cached VNodes.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Sketch the core of a fixed-height virtual scroller: compute the visible window and the spacer offset for rowH=40 in a 600px viewport.',
      hint: 'start = scrollTop / rowH; render a window; offset with translateY.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst items = ref<{ id: number; v: string }[]>([])\nconst rowH = 40, viewH = 600\nconst scrollTop = ref(0)\nconst start = computed(() => Math.floor(scrollTop.value / rowH))\nconst count = Math.ceil(viewH / rowH) + 5\nconst window = computed(() => items.value.slice(start.value, start.value + count))\nconst offset = computed(() => start.value * rowH)\nconst total = computed(() => items.value.length * rowH)\n</script>\n\n<template>\n  <div :style="{ height: viewH + \'px\', overflow: \'auto\' }"\n       @scroll="e => scrollTop = (e.target as HTMLElement).scrollTop">\n    <div :style="{ height: total + \'px\', position: \'relative\' }">\n      <div :style="{ transform: `translateY(${offset}px)` }">\n        <div v-for="it in window" :key="it.id" :style="{ height: rowH + \'px\' }">{{ it.v }}</div>\n      </div>\n    </div>\n  </div>\n</template>',
        explanation: [
          'start is derived from scrollTop; the window is a small slice.',
          'A spacer of total height preserves the scrollbar; translateY positions the window.',
          'Only ~20 rows exist in the DOM no matter the dataset size.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Lists are the most common performance hot spot in real apps, so knowing how to render them fast is a high-signal skill. It proves you understand Vue\'s diff and the cost of the DOM, not just template syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask why keys are needed and why index keys are bad. Product companies (Zoho, Flipkart, Razorpay) ask how to render 10k rows and fix laggy selection. FAANG-level interviews probe the keyed diff (LIS), virtual scrolling trade-offs, and reactivity overhead on large arrays.',
    whatInterviewersExpect:
      'Explain stable keys and the keyed diff, lead with windowing/pagination for large datasets, use v-memo for unchanged rows, keep per-row work cheap, and discuss the accessibility/complexity trade-offs of virtual scrolling.',
  },
}

export default listRenderingPerformance
