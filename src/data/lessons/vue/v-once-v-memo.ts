import type { ConceptLesson } from '../../../types/lesson'

const vOnceVMemo: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-once-v-memo',
  name: 'v-once & v-memo',
  category: 'performance',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'v-once and v-memo are Vue 3\'s surgical tools for skipping re-renders of expensive subtrees that rarely or never change.',
    'In long lists or heavy static content, re-diffing nodes that did not change wastes CPU on every update — these directives let you opt out of that work.',
    'They show interviewers you understand Vue\'s render-update cycle deeply enough to know WHEN diffing is the bottleneck, not just how to write components.',
    'Misusing them (especially v-memo with wrong dependencies) causes stale UI bugs that are hard to trace, so knowing their exact semantics matters.',
    'They are the manual escape hatch when the compiler\'s automatic static hoisting and patch-flag optimizations are not enough.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-once is like drawing a picture in permanent marker; v-memo is like a sticky note that says "only redraw if the weather changes".',
    story: [
      'Imagine you draw a poster for your classroom wall. Some parts, like the school name, never change — so you draw them once in permanent marker and never touch them again. That is v-once.',
      'Other parts, like "today\'s weather", only need redrawing when the weather actually changes. So you put a little rule on it: "only redraw this if the weather is different from yesterday." That is v-memo.',
      'If you redrew the whole poster every single morning, even the parts that never change, you would waste a lot of markers and time.',
      'Vue normally checks every part of your page to see if it changed. v-once and v-memo are your way of telling Vue: "trust me, you can skip checking this part."',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When data changes, Vue re-runs your component\'s render and compares the new output to the old to decide what to update on the page.',
    'v-once tells Vue to render an element and its children exactly once, then treat them as completely static forever — never checking them again.',
    'v-memo is smarter: you give it a list of values, and Vue only re-renders that block when one of those values changes; otherwise it reuses the previous result.',
    'Both are performance tools — you use them only when re-checking a part of the page is genuinely slow and that part rarely needs updating.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-once renders an element/subtree a single time and caches it as static. v-memo([deps]) caches a subtree and only re-renders it when one of the dependency values changes between renders.',
    how: 'v-once makes the compiler mark the node as cached after the first render so it is skipped in every subsequent patch. v-memo compares the current dependency array to the previous one (like a React useMemo dependency check) and skips patching the subtree when they are shallow-equal.',
    why: 'They eliminate diffing/patching work for content that does not need to update, which matters most in large lists or heavy static blocks rendered many times.',
    code: {
      label: 'v-once for never-changing content',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst count = ref(0)\nconst appName = \'InterviewMaster\'\n</script>\n\n<template>\n  <!-- rendered once, never re-checked even when count changes -->\n  <h1 v-once>{{ appName }}</h1>\n\n  <!-- this updates normally -->\n  <button @click="count++">Count: {{ count }}</button>\n</template>',
      explanation: [
        'The <h1> is rendered on first mount and then marked static.',
        'Clicking the button updates count and re-renders the component, but Vue skips the v-once <h1> entirely.',
        'appName never changes, so v-once is safe and saves a tiny bit of patch work each update.',
        'If appName DID change later, the <h1> would NOT update — that is the trade-off of v-once.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-once is a compiler directive that renders an element and its descendants only on the first render and then caches the resulting VNode, inserting the cached VNode (and skipping the patch) on all subsequent renders. v-memo takes a dependency array and memoizes a subtree: on each render the compiler emits code that shallow-compares the new dependency array against the cached one; if every value is equal (using ===), it reuses the previously rendered VNode tree and bails out of patching, otherwise it re-renders and updates the cache. Both reduce the cost of the virtual DOM diff for stable content; v-memo is the conditional, dependency-driven version of v-once.',

  // 7. Internal Working
  internalWorking: [
    'At compile time, the template compiler detects v-once and wraps the node\'s render expression in a cache slot on the component instance (the `_cache` array), generating code roughly like `_cache[0] || (_cache[0] = createVNode(...))`.',
    'On first render the VNode is created and stored in `_cache`; on every later render the cached VNode is returned directly, so the diff/patch step for that subtree is entirely skipped.',
    'For v-memo, the compiler emits a call to the runtime `withMemo(deps, renderFn, cache, index)` helper, passing the dependency array.',
    'withMemo compares the new `deps` array element-by-element with the previously cached `deps` using strict equality; if all are equal it returns the cached VNode and sets it as the patched output, skipping re-creation and diffing.',
    'If any dependency differs, withMemo invokes the render function to build a fresh VNode subtree, stores both the new VNode and the new deps array in the cache, and lets the patch proceed normally.',
    'Because the cached VNode is reused by reference, Vue\'s patch algorithm sees the same node and short-circuits — this is why correct dependencies are critical: a missed dependency means the subtree never updates.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Component re-render triggered (some ref changed)
            │
            ▼
   ┌──────────────────────────────────────────────┐
   │  render() walks the template VNodes           │
   └──────────────────────────────────────────────┘
            │
   ┌────────┴───────────┬──────────────────────────┐
   ▼                    ▼                          ▼
 normal node        v-once node               v-memo([a,b]) node
   │                    │                          │
 diff + patch      _cache hit?               deps changed?
   │                  │   │                    │      │
 update DOM         yes  no                   yes     no
                    │     └─ create + cache    │       │
              reuse cached VNode          re-render   reuse cached
              (SKIP patch)                + recache   VNode (SKIP)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each component instance owns a `_cache` array on the heap; v-once and v-memo store their cached VNodes (and v-memo also the last deps array) in slots of that array.',
    'A cached VNode keeps its entire subtree alive in memory for the lifetime of the component, even when off-screen — so caching a huge subtree trades memory for skipped CPU.',
    'v-memo additionally retains the previous dependency values; if those are large objects, they stay referenced until the next render that changes them.',
    'When the component unmounts, the instance and its `_cache` become unreachable and are garbage collected along with the cached VNodes.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — v-once on a static header',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst likes = ref(0)\n</script>\n\n<template>\n  <header v-once>\n    <h1>My Blog</h1>\n    <p>Welcome to my permanent header</p>\n  </header>\n  <button @click="likes++">Likes: {{ likes }}</button>\n</template>',
      explanation: [
        'The <header> and everything inside it render exactly once.',
        'Incrementing likes re-renders the component but the header subtree is skipped during patch.',
        'Good for truly static branding/legal text that never depends on reactive state.',
        'If the header contained {{ likes }} it would freeze at its first value — a classic v-once gotcha.',
      ],
    },
    intermediate: {
      label: 'Intermediate — v-memo to skip unchanged list rows',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Item { id: number; name: string; selected: boolean }\nconst items = ref<Item[]>([])\nconst selectedId = ref<number | null>(null)\n</script>\n\n<template>\n  <div\n    v-for="item in items"\n    :key="item.id"\n    v-memo="[item.name, item.id === selectedId]"\n  >\n    <span :class="{ active: item.id === selectedId }">{{ item.name }}</span>\n  </div>\n</template>',
      explanation: [
        'Each row only re-renders when its name changes OR its selected state flips.',
        'When selectedId changes, only the two affected rows (old + new selection) re-render; the other thousands are skipped.',
        'The dependency array must include EVERY value the row\'s output depends on — here name and the selected flag.',
        'This is the canonical v-memo pattern: large lists where most rows are unchanged between updates.',
        'Without v-memo, every row would be diffed on every selection change.',
      ],
    },
    advanced: {
      label: 'Advanced — v-memo with no deps equals v-once',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst tick = ref(0)\nsetInterval(() => tick.value++, 1000)\n</script>\n\n<template>\n  <!-- empty deps array: only renders once, like v-once -->\n  <ExpensiveChart v-memo="[]" :data="staticData" />\n\n  <!-- re-renders every tick because tick is a dependency -->\n  <Clock v-memo="[tick]" :time="tick" />\n</template>\n\n<script lang="ts">\nconst staticData = [1, 2, 3]\n</script>',
      explanation: [
        'v-memo="[]" has an always-equal (empty) dependency array, so the subtree renders once and is reused forever — functionally identical to v-once.',
        'Vue docs explicitly note that v-memo with an empty array behaves like v-once.',
        'The Clock lists tick as a dependency, so it correctly re-renders each second.',
        'This contrast clarifies the mental model: v-once = always cached; v-memo = conditionally cached on its deps.',
      ],
    },
    realProject: {
      label: 'Real project — virtualized data grid in an analytics dashboard',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\ninterface Row { id: string; cells: string[]; highlighted: boolean }\nconst rows = ref<Row[]>([])\nconst activeRowId = ref<string>(\'\')\nconst visibleRows = computed(() => rows.value.slice(0, 200))\n</script>\n\n<template>\n  <table>\n    <tr\n      v-for="row in visibleRows"\n      :key="row.id"\n      v-memo="[row.cells, row.id === activeRowId]"\n      :class="{ active: row.id === activeRowId }"\n    >\n      <td v-for="(cell, i) in row.cells" :key="i">{{ cell }}</td>\n    </tr>\n  </table>\n</template>',
      explanation: [
        'In a 200-row financial grid, hovering/selecting rows triggers frequent re-renders.',
        'v-memo ensures only rows whose cell data changed (or whose active state toggled) are re-patched.',
        'row.cells is the array reference — it must be replaced (not mutated) when data updates, so === detects the change.',
        'Combined with windowing (slice/virtual scroll), this keeps a heavy grid at 60fps during interaction.',
        'This is exactly where v-memo earns its keep: many rows, frequent updates, mostly-unchanged content.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does v-once do?',
      answer: 'v-once renders an element and its children only once, on the first render, and then caches that result. On all later re-renders Vue skips diffing and patching that subtree, so it never updates again even if its data changes.',
      explanation: 'A good answer states both the "render once" behavior AND the consequence: the content is frozen and will not react to future data changes.',
    },
    {
      level: 'beginner',
      question: 'When would you reach for v-once?',
      answer: 'For genuinely static content rendered inside a component that updates often — branding, legal disclaimers, static help text — where re-diffing the node on every update is wasted work.',
      explanation: 'Interviewers want to hear that it is a micro-optimization for static subtrees, not something to sprinkle everywhere.',
    },
    {
      level: 'intermediate',
      question: 'How is v-memo different from v-once?',
      answer: 'v-once is unconditional — render once, cache forever. v-memo is conditional: you pass a dependency array, and the subtree only re-renders when one of those dependencies changes (compared with ===). v-memo with an empty array behaves like v-once.',
      explanation: 'The key distinction is "always cached" vs "cached until a tracked dependency changes". Mentioning the empty-array equivalence shows precise knowledge.',
    },
    {
      level: 'intermediate',
      question: 'What happens if you forget a dependency in v-memo?',
      answer: 'The subtree will not re-render when that missing value changes, producing stale UI — the displayed content lags behind the real state. v-memo only re-renders when a listed dependency changes, so any value the output depends on must be in the array.',
      explanation: 'This mirrors React\'s useMemo/useEffect dependency pitfall; senior candidates connect the two.',
    },
    {
      level: 'advanced',
      question: 'Why is v-memo most useful with v-for, and what is the catch?',
      answer: 'Large v-for lists are where re-diffing every item is expensive, so memoizing unchanged rows saves the most. The catch is that the v-memo and v-for must be on the same element, the comparison is shallow (===), and array/object dependencies must be replaced rather than mutated for the change to be detected.',
      explanation: 'Strong answers note the shallow-equality semantics and the immutability requirement for object dependencies.',
    },
    {
      level: 'senior',
      question: 'How does v-memo interact with Vue 3\'s existing compiler optimizations, and when is it NOT worth it?',
      answer: 'Vue 3 already does static hoisting, patch flags, and tree-flattening, so most components are fast without v-memo. v-memo adds its own comparison cost and memory for cached VNodes/deps, so for small or already-cheap subtrees it can be slower than just letting Vue diff. It pays off only for large, frequently-updated lists where the saved patch work exceeds the comparison overhead.',
      explanation: 'Senior signal: knowing v-memo competes with the compiler\'s built-in optimizations and has its own overhead, so it should be measured, not assumed.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Can v-once contain reactive interpolations, and what happens to them?',
    'What is the equivalent of v-once using v-memo? (v-memo="[]")',
    'Does v-once work on components as well as elements? (yes, it caches the component VNode)',
    'Why must v-memo be on the same element as v-for rather than a wrapper?',
    'How does v-memo\'s comparison handle objects and arrays? (shallow ===, so replace not mutate)',
    'How would you measure whether v-memo actually improved performance?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using v-once on content that actually needs to update.',
      why: 'v-once permanently freezes the subtree; any interpolation inside keeps its first value forever, causing a stale UI bug.',
      fix: 'Only apply v-once to truly static content; if it must update conditionally, use v-memo with the right dependencies instead.',
    },
    {
      mistake: 'Forgetting a dependency in the v-memo array.',
      why: 'v-memo only re-renders when a listed dependency changes, so a missing value leaves the subtree stale.',
      fix: 'List every reactive value the subtree\'s output depends on, exactly like a React dependency array.',
    },
    {
      mistake: 'Mutating an object/array dependency in place instead of replacing it.',
      why: 'v-memo compares with === (shallow); an in-place mutation keeps the same reference, so the change is never detected.',
      fix: 'Replace the array/object (e.g. items.value = [...]) or list a primitive that captures the change.',
    },
    {
      mistake: 'Sprinkling v-memo everywhere as a default optimization.',
      why: 'The comparison and cache cost can exceed the diffing cost for small subtrees, making the app slower and harder to reason about.',
      fix: 'Reserve v-memo for large, frequently-updated v-for lists and profile before/after.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Core directives compiled by @vue/compiler-core into `_cache` slots (v-once) and `withMemo` runtime calls (v-memo); used to opt subtrees out of the patch phase.' },
    { area: 'Component library', detail: 'Heavy table/grid components use v-memo per-row so that selecting or hovering one row does not re-diff thousands of others.' },
    { area: 'Nuxt', detail: 'Static marketing sections and footers rendered with v-once to avoid client-side re-patching after hydration, shaving hydration/update cost.' },
    { area: 'SSR', detail: 'v-once content is rendered server-side and treated as static on the client, reducing the work needed during reactive updates after hydration.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Skips diffing/patching for cached subtrees, directly reducing CPU work on each update.',
      'In large v-for lists, v-memo can cut update time dramatically by re-rendering only changed rows.',
    ],
    bad: [
      'Cached VNodes (and v-memo deps) consume memory for the component\'s lifetime, even off-screen.',
      'For small or cheap subtrees, v-memo\'s comparison overhead can outweigh the saved diff, making things slower.',
    ],
    optimizations: [
      'Apply v-memo only on the v-for element of large lists, with a minimal, complete dependency array.',
      'Prefer Vue\'s automatic compiler optimizations first; reach for these directives only when profiling shows diffing is the bottleneck.',
      'Combine v-memo with virtual scrolling so you both render fewer rows and skip unchanged ones.',
      'Use immutable updates for object/array dependencies so the shallow === comparison detects changes correctly.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['virtual-dom', 'reactivity-render-link', 'v-for', 'computed-caching'],
    nextConcepts: ['list-rendering-performance', 'reactivity-performance', 'vue-performance-overview', 'keepalive'],
    dependencyNote:
      'These directives sit on top of the virtual-dom diffing model and the reactivity-render link: you must understand how Vue re-renders and patches before you can reason about deliberately skipping that work. They naturally lead into broader list-rendering and reactivity performance topics.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a component that re-renders when a ref changes, with three child nodes side by side.',
      'Label node 1 "normal" — show it being diffed and patched on every render.',
      'Label node 2 "v-once" — draw a cache box; first render fills it, later renders just pull the cached VNode and skip patch.',
      'Label node 3 "v-memo([a,b])" — draw a comparison gate: if deps equal, reuse cache; if not, re-render and update cache.',
      'Conclude: "v-once is unconditional caching, v-memo is conditional caching keyed on a dependency array — both skip the diff to save CPU."',
    ],
    diagram: `  re-render
     │
     ├─ normal  ──► diff ──► patch DOM
     │
     ├─ v-once  ──► _cache[i] ? reuse : create+cache  (SKIP patch)
     │
     └─ v-memo([a,b]) ──► deps === prev ? reuse (SKIP)
                                        : render + recache`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-once renders a subtree once and caches it forever, skipping all future diffing — great for static content but it freezes any interpolation inside it. v-memo takes a dependency array and only re-renders the subtree when one of those values changes (shallow ===), making it ideal for large v-for lists where most rows are unchanged. v-memo with an empty array equals v-once. The big risk is missing or mutated dependencies causing stale UI, and over-using v-memo whose comparison cost can exceed the diff it saves.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-once and v-memo are Vue 3\'s manual tools for skipping virtual-DOM diffing on subtrees that do not need to update. When any reactive value changes, Vue re-runs the render function and diffs the new VNode tree against the old one to patch the DOM. For content that never or rarely changes, that diffing is wasted work. v-once tells the compiler to render an element and its children once, cache the resulting VNode in the instance\'s _cache array, and reuse it on every subsequent render — completely skipping the patch. The trade-off is that the subtree is frozen: any interpolation inside keeps its first value, so it is only safe for truly static content. v-memo is the conditional version: you give it a dependency array, and on each render the runtime shallow-compares it with the previous one. If all dependencies are === equal, it reuses the cached VNode and bails out of patching; otherwise it re-renders and updates the cache. An empty v-memo array behaves exactly like v-once. v-memo shines on large v-for lists — you put it on the same element as v-for so that, say, selecting one row only re-renders that row instead of all thousand. The pitfalls mirror React\'s dependency arrays: a missing dependency leaves the UI stale, and object/array dependencies must be replaced rather than mutated because the comparison is shallow. Finally, because Vue 3 already does static hoisting and patch flags, these directives are a measured optimization for genuinely expensive, frequently-updated subtrees — not a default.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'CPU vs memory: both directives trade retained VNode (and deps) memory for skipped diffing — heavy on memory if the cached subtree is large.',
      'Correctness vs speed: v-memo\'s manual dependency list can drift out of sync with what the template actually uses, trading guaranteed correctness for performance.',
      'These compete with the compiler\'s automatic optimizations, so the marginal gain is often smaller than expected and must be measured.',
    ],
    edgeCases: [
      'v-once interpolations freeze at their first value, which surprises developers who expect them to update.',
      'v-memo and v-for must be on the same element; placing v-memo on a wrapper does not memoize per item.',
      'Shallow === comparison means mutated objects/arrays are not detected as changed — a silent staleness bug.',
      'v-memo with an empty array is an intentional v-once equivalent, which can confuse readers.',
    ],
    runtimeBehavior: [
      'v-once compiles to `_cache[i] || (_cache[i] = createVNode(...))`, returning the cached VNode directly on later renders.',
      'v-memo compiles to a `withMemo(deps, renderFn, cache, index)` call that does the per-element strict-equality comparison.',
      'A cache hit returns the same VNode by reference, which Vue\'s patch short-circuits as unchanged.',
    ],
    scalability: [
      'On lists of thousands of rows with frequent selection/hover updates, v-memo can turn O(n) per-update diffing into O(changed-rows).',
      'Cache memory grows with the number of memoized instances, so on enormous lists pair it with virtual scrolling to bound both render count and cache size.',
    ],
    productionConcerns: [
      'Stale UI from missing/mutated dependencies is the main incident type — code review v-memo arrays carefully.',
      'v-once content must be re-audited if requirements change so it does not silently stay static.',
      'Always profile with Vue DevTools / performance marks before and after; remove the directive if it does not help.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-once = render once, cache forever, never re-diff.',
    'v-once freezes interpolations at their first value.',
    'v-memo="[deps]" = re-render only when a dep changes (shallow ===).',
    'v-memo="[]" behaves exactly like v-once.',
    'Put v-memo on the SAME element as v-for, not a wrapper.',
    'Missing a v-memo dependency → stale UI.',
    'Object/array deps must be REPLACED, not mutated (shallow ===).',
    'Best use: large, frequently-updated v-for lists.',
    'Both store cached VNodes in the instance _cache array (memory cost).',
    'They compete with Vue\'s built-in compiler optimizations — measure first.',
    'v-once → _cache slot; v-memo → withMemo runtime call.',
    'Not a default; a targeted micro-optimization.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Add v-once to a footer that shows a static copyright line so it is not re-diffed when the rest of the page updates.',
      hint: 'v-once goes on the element you want rendered once.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <footer v-once>\n    <p>&copy; 2026 InterviewMaster. All rights reserved.</p>\n  </footer>\n</template>',
        explanation: [
          'The footer renders once on mount and is then cached.',
          'Any later re-render of the component skips this subtree entirely.',
          'Safe because the copyright text never depends on reactive state.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Use v-memo on a v-for list so each item row only re-renders when its title or its done flag changes.',
      hint: 'Put v-memo on the same element as v-for, listing the values the row depends on.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Todo { id: number; title: string; done: boolean }\nconst todos = ref<Todo[]>([])\n</script>\n\n<template>\n  <li\n    v-for="t in todos"\n    :key="t.id"\n    v-memo="[t.title, t.done]"\n  >\n    {{ t.title }} - {{ t.done ? \'done\' : \'open\' }}\n  </li>\n</template>',
        explanation: [
          'Each row memoizes on title and done.',
          'Toggling one todo\'s done flag re-renders only that row.',
          'Other rows reuse their cached VNodes, skipping the diff.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A v-memo row shows item.tags (a string array) but never updates when tags change. Explain why and fix it.',
      hint: 'Think about how v-memo compares array dependencies.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Item { id: number; tags: string[] }\nconst items = ref<Item[]>([])\n\n// BUG: mutating in place keeps the same array reference\nfunction addTagBad(item: Item, tag: string) { item.tags.push(tag) }\n\n// FIX: replace the array so === detects the change\nfunction addTagGood(item: Item, tag: string) { item.tags = [...item.tags, tag] }\n</script>\n\n<template>\n  <div v-for="item in items" :key="item.id" v-memo="[item.tags]">\n    {{ item.tags.join(\', \') }}\n  </div>\n</template>',
        explanation: [
          'v-memo compares dependencies with strict equality; push() mutates in place so the reference is unchanged.',
          'Because [item.tags] === previous [item.tags], v-memo reuses the stale cached VNode.',
          'Replacing the array with a new one makes === detect the change and triggers a re-render.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Without using v-once, make an <ExpensiveWidget> render only a single time using v-memo, and explain why it works.',
      hint: 'What dependency array is always equal to its previous value?',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- empty deps array is always shallow-equal to itself -->\n  <ExpensiveWidget v-memo="[]" />\n</template>',
        explanation: [
          'An empty dependency array compares equal on every render (no elements differ).',
          'So v-memo always hits the cache after the first render and reuses the VNode.',
          'This is documented as equivalent to v-once: render once, never update.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'v-once and v-memo prove you understand Vue\'s render-and-patch cycle well enough to deliberately skip parts of it. Performance questions separate engineers who can only build features from those who can make them fast at scale.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) may simply ask what v-once does. Product companies (Zoho, Flipkart, Razorpay) ask when you would use v-memo and the dependency-array pitfalls. FAANG-level interviews probe how these interact with the compiler\'s patch flags and when memoization actually hurts.',
    whatInterviewersExpect:
      'Define both precisely, explain v-memo\'s shallow dependency comparison and the empty-array = v-once equivalence, identify the stale-UI risk from missing/mutated deps, and state that these are measured optimizations for large frequently-updated lists, not defaults.',
  },
}

export default vOnceVMemo
