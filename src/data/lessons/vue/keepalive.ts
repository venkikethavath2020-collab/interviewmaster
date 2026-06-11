import type { ConceptLesson } from '../../../types/lesson'

const keepalive: ConceptLesson = {
  // 1. Concept Summary
  slug: 'keepalive',
  name: 'KeepAlive',
  category: 'built-in',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'KeepAlive caches a component instance instead of destroying it, so switching tabs/routes preserves scroll position, form input, and fetched data without re-fetching.',
    'It is the standard answer to "my tab loses its state when I switch away and back" — a very common UX requirement.',
    'It introduces two lifecycle hooks unique to it (onActivated/onDeactivated) that interviewers love to ask about.',
    'It teaches an important trade-off: caching for UX vs memory usage, with include/exclude/max controls.',
    'It pairs with dynamic components and router views, so understanding it is essential for real Vue app architecture.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'KeepAlive is like pausing a video game instead of turning the console off when you leave the room.',
    story: [
      'Imagine you are playing a video game and your mom calls you for dinner.',
      'If you turn the console off, when you come back you have to start the whole level again from the beginning — everything you did is gone.',
      'But if you just pause it, when you come back your character is exactly where you left them, with the same health and the same items.',
      'KeepAlive lets Vue "pause" a component when you switch away from it, so when you come back, everything you typed and saw is still there instead of starting over.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally when you switch from one component to another, Vue destroys the first one and builds the second from scratch — so any state in the first is lost.',
    'KeepAlive is a special built-in component you wrap around a switchable component to tell Vue: do not destroy it, just hide it and keep it in memory.',
    'When you come back to it, Vue shows the same kept instance again, with all its data intact.',
    'It even gives special signals (activated/deactivated) so the component knows when it was shown or hidden.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'KeepAlive is a built-in Vue component that caches dynamic or routed child components when they are switched out, instead of unmounting them. The cached instance is reused (not recreated) when shown again, preserving its state.',
    how: 'You wrap a <component :is> or <router-view> with <KeepAlive>. When the active child changes, KeepAlive moves the old instance into an in-memory cache and renders the new one. A cached component fires onDeactivated when hidden and onActivated when shown again, instead of unmounting/mounting.',
    why: 'Without it, every tab/route switch destroys and rebuilds the component, losing form input, scroll position, and triggering re-fetches. KeepAlive trades memory for instant, state-preserving switches.',
    code: {
      label: 'Caching a dynamic component',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport TabA from \'./TabA.vue\'\nimport TabB from \'./TabB.vue\'\nconst current = ref(\'TabA\')\nconst tabs = { TabA, TabB }\n</script>\n\n<template>\n  <button @click="current = \'TabA\'">A</button>\n  <button @click="current = \'TabB\'">B</button>\n\n  <!-- without KeepAlive, switching tabs resets each tab\'s state -->\n  <KeepAlive>\n    <component :is="tabs[current]" />\n  </KeepAlive>\n</template>',
      explanation: [
        '<component :is> swaps between TabA and TabB based on `current`.',
        'Wrapping it in <KeepAlive> caches the inactive tab instead of destroying it.',
        'Typing in TabA, switching to TabB, then back shows TabA with your text intact.',
        'Each tab fires onActivated when shown and onDeactivated when hidden.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'KeepAlive is an abstract built-in component that caches the instances of its dynamic children rather than unmounting them on switch. It maintains an internal cache keyed by vnode key/component, and on child change it moves the outgoing instance\'s DOM into a hidden storage container and reuses the cached instance when that child is requested again. Cached components do not run unmount/mount on toggle; instead they run the onDeactivated and onActivated hooks. Caching can be bounded with include, exclude (by component name), and max (LRU eviction).',

  // 7. Internal Working
  internalWorking: [
    'KeepAlive renders exactly one dynamic child slot and intercepts changes to which child is active.',
    'On first render of a child, KeepAlive stores a reference to that child\'s vnode and its mounted component instance in an internal cache Map (keyed by the vnode key or component type).',
    'When the active child changes, instead of unmounting the old instance, KeepAlive detaches its DOM subtree into an offscreen storage container and calls the instance\'s deactivated hooks (depth-first).',
    'When a previously cached child becomes active again, KeepAlive pulls the cached instance from the Map, re-inserts its preserved DOM into place, and calls the activated hooks — skipping setup/mount entirely so all state is intact.',
    'include/exclude (matched against component name) decide whether a given child is eligible for caching; non-matching children are unmounted normally.',
    'max enforces an LRU cache: when the cache exceeds max, the least-recently-accessed cached instance is fully unmounted (its real unmount hooks run) to free memory.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        <KeepAlive>
             │ active child = TabA
             ▼
   ┌──────────────────┐        switch to TabB
   │ TabA instance    │  ──────────────────────►  detach DOM → cache
   │ (state: typed!)  │                           onDeactivated(TabA)
   └──────────────────┘
                                CACHE (memory): { TabA: instance, ... }
        switch back to TabA
             │
             ▼  reuse cached instance (no remount)
   ┌──────────────────┐
   │ TabA instance    │   onActivated(TabA)  — state still "typed!"
   └──────────────────┘

   max=N → LRU eviction unmounts the least-recently-used cached instance`,

  // 9. Memory Visualization
  memoryVisualization: [
    'CACHE MAP (heap): KeepAlive holds a Map from key → cached vnode/instance; each cached instance keeps its reactive state, render effect, and detached DOM subtree alive.',
    'STORAGE CONTAINER: deactivated instances\' DOM is moved into an offscreen container element rather than removed from the document tree, so it can be re-inserted instantly.',
    'These cached instances are NOT eligible for garbage collection while cached — this is the memory cost of KeepAlive.',
    'max triggers LRU eviction: the evicted instance is truly unmounted, its effect stopped and DOM discarded, allowing GC.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — cache a router view',
      lang: 'vue',
      code: '<template>\n  <!-- preserves each route component\'s state when navigating away and back -->\n  <router-view v-slot="{ Component }">\n    <KeepAlive>\n      <component :is="Component" />\n    </KeepAlive>\n  </router-view>\n</template>',
      explanation: [
        'The v-slot pattern exposes the matched route component as `Component`.',
        'Wrapping it in KeepAlive caches each visited route component.',
        'Navigating away and back restores scroll, inputs, and fetched data.',
        'This is the canonical way to keep route state alive.',
      ],
    },
    intermediate: {
      label: 'Intermediate — activated/deactivated hooks',
      lang: 'vue',
      code: '<script setup>\nimport { onActivated, onDeactivated, ref } from \'vue\'\nconst lastSeen = ref(null)\n\nonActivated(() => {\n  // runs each time the cached component is shown again\n  lastSeen.value = Date.now()\n})\n\nonDeactivated(() => {\n  // runs when switched away — pause timers/polling here\n  console.log(\'hidden, pause work\')\n})\n</script>\n\n<template>\n  <p>Re-shown at: {{ lastSeen }}</p>\n</template>',
      explanation: [
        'onActivated fires every time the cached component becomes visible — not just once.',
        'onDeactivated fires when it is switched away but kept in cache.',
        'These replace mount/unmount for cached components — use them to pause/resume polling.',
        'onMounted still runs once on the very first activation.',
      ],
    },
    advanced: {
      label: 'Advanced — include / exclude / max',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport Dashboard from \'./Dashboard.vue\' // name: \'Dashboard\'\nimport Settings from \'./Settings.vue\'   // name: \'Settings\'\nimport Report from \'./Report.vue\'       // name: \'Report\'\nconst views = { Dashboard, Settings, Report }\nconst current = ref(\'Dashboard\')\n</script>\n\n<template>\n  <!-- cache only Dashboard & Settings, keep at most 2 in memory (LRU) -->\n  <KeepAlive :include="[\'Dashboard\', \'Settings\']" :max="2">\n    <component :is="views[current]" />\n  </KeepAlive>\n</template>',
      explanation: [
        'include matches against the component name option; only listed components are cached.',
        'Report is not in include, so it unmounts normally (no caching).',
        'max=2 caps memory; exceeding it evicts the least-recently-used cached instance.',
        'Components must define a name (or be name-inferred) for include/exclude to match.',
      ],
    },
    realProject: {
      label: 'Real project — keep a filtered list tab alive while editing in another tab',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport ProductList from \'./ProductList.vue\'\nimport ProductEditor from \'./ProductEditor.vue\'\nconst view = ref(\'list\')\nconst comp = { list: ProductList, editor: ProductEditor }\n</script>\n\n<template>\n  <nav>\n    <button @click="view = \'list\'">List</button>\n    <button @click="view = \'editor\'">Editor</button>\n  </nav>\n  <!-- the list keeps its filters/scroll/page while you jump to the editor and back -->\n  <KeepAlive>\n    <component :is="comp[view]" />\n  </KeepAlive>\n</template>',
      explanation: [
        'ProductList keeps its applied filters, scroll position, and page number while inactive.',
        'Switching to the editor and back avoids re-fetching the list and re-applying filters.',
        'onDeactivated in ProductList can pause any background polling while the editor is active.',
        'This is a common admin-panel UX pattern that would be jarring without KeepAlive.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does KeepAlive do?',
      answer: 'It caches a dynamic/routed child component instance instead of unmounting it when you switch away, so its state is preserved and restored when it is shown again.',
      explanation: 'A good answer names both the caching behavior and the preserved-state benefit.',
    },
    {
      level: 'beginner',
      question: 'Which lifecycle hooks are specific to KeepAlive?',
      answer: 'onActivated (fires each time a cached component is shown) and onDeactivated (fires when it is switched away but kept). They replace mount/unmount for cached components, though onMounted still runs once on first activation.',
      explanation: 'Mentioning that these fire repeatedly, unlike mounted/unmounted, shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'How do include, exclude, and max work?',
      answer: 'include/exclude match against component names to decide which children are cached; max sets an LRU cache size so the least-recently-used cached instance is unmounted when the limit is exceeded.',
      explanation: 'Noting that matching is by component name (so a name is required) is the key nuance.',
    },
    {
      level: 'intermediate',
      question: 'Why might KeepAlive cause stale data, and how do you handle it?',
      answer: 'Because the instance is reused, data fetched once is not refreshed on re-activation. Handle it by re-fetching in onActivated or invalidating cache when the underlying data changes.',
      explanation: 'This tests awareness that caching state can mean stale state.',
    },
    {
      level: 'advanced',
      question: 'What is the memory cost of KeepAlive and how do you bound it?',
      answer: 'Each cached instance keeps its reactive state, render effect, and detached DOM in memory, so it is not garbage collected while cached. Bound it with max (LRU eviction) and include/exclude to cache only what truly needs to persist.',
      explanation: 'Connecting caching to GC and using max/include shows the senior trade-off awareness.',
    },
    {
      level: 'senior',
      question: 'How does KeepAlive interact with timers, watchers, and polling inside a cached component?',
      answer: 'Because the component is not unmounted, its watchers, timers, and intervals keep running while it is cached unless you pause them. Use onDeactivated to stop polling/timers and onActivated to resume, otherwise hidden components keep doing background work and consuming resources.',
      explanation: 'This is the real production gotcha — cached does not mean inert.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is onActivated different from onMounted?',
    'How do you keep only specific routes alive with KeepAlive?',
    'What happens to a cached component when max is exceeded?',
    'How do you force-refresh data when a cached component is re-shown?',
    'Why must a component have a name for include/exclude to work?',
    'How does KeepAlive interact with <Transition>?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting onMounted to run every time the component is shown.',
      why: 'Cached components mount once; subsequent shows fire onActivated, not onMounted.',
      fix: 'Put re-show logic (re-fetch, reset scroll) in onActivated, not onMounted.',
    },
    {
      mistake: 'Leaving timers/polling running in a cached-but-hidden component.',
      why: 'KeepAlive does not unmount, so intervals and watchers keep firing in the background.',
      fix: 'Pause them in onDeactivated and resume in onActivated.',
    },
    {
      mistake: 'include/exclude not matching because the component has no name.',
      why: 'Matching is by component name; anonymous components never match.',
      fix: 'Give components an explicit name (or rely on SFC filename inference) so include/exclude work.',
    },
    {
      mistake: 'Caching everything and running out of memory.',
      why: 'Every cached instance pins its state and DOM in memory indefinitely.',
      fix: 'Use max for LRU eviction and include to cache only the views that need persistence.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Tab interfaces and wizards wrap <component :is> in KeepAlive so each tab/step retains form input and scroll when revisited.' },
    { area: 'Vue Router', detail: 'router-view + KeepAlive preserves list pages (filters, scroll, pagination) so navigating to a detail page and back is instant and stateful.' },
    { area: 'Component library', detail: 'Stepper/wizard and dashboard-shell components expose KeepAlive options so consumers can opt into state retention per panel.' },
    { area: 'Nuxt', detail: 'Nuxt pages support a keepalive option in route meta to cache specific pages, commonly for feed/list pages users frequently return to.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Re-showing a cached component skips setup, data fetching, and re-render-from-scratch, so switches are instant.',
      'Avoids redundant network requests by preserving already-fetched data.',
    ],
    bad: [
      'Each cached instance holds its state and DOM in memory, increasing memory footprint.',
      'Cached components keep watchers/timers running, doing background work while hidden if not paused.',
    ],
    optimizations: [
      'Use max for an LRU cache to bound memory usage.',
      'Use include/exclude to cache only the views that genuinely benefit.',
      'Pause polling/observers in onDeactivated and resume in onActivated.',
      'Re-validate or refresh data in onActivated to keep cached views from going stale.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['dynamic-components', 'lifecycle-hooks-composition', 'vue-router-basics'],
    nextConcepts: ['transition', 'route-meta-lazy-loading', 'vue-performance-overview', 'suspense'],
    dependencyNote:
      'KeepAlive builds on dynamic components and the lifecycle hooks (adding onActivated/onDeactivated) and is most useful with Vue Router. It connects to Transition (for animated switches) and performance topics, since caching is fundamentally a memory-vs-speed trade-off.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw <KeepAlive> wrapping a <component :is> with TabA active.',
      'Show switching to TabB: draw an arrow moving TabA\'s instance into a CACHE box (label onDeactivated).',
      'Show switching back: arrow pulls TabA from CACHE, re-inserts DOM (label onActivated), note "state intact, no remount".',
      'Add a max=N note and show LRU eviction unmounting the oldest cached instance.',
      'Say: "KeepAlive caches instances for instant, stateful switches — at a memory cost bounded by max/include, and remember timers keep running."',
    ],
    diagram: `  <KeepAlive include=[...] max=N>
     active: TabA  ──switch──► detach to CACHE  (onDeactivated)
                                  │
     CACHE: { TabA, TabB, ... }   │ (state + DOM kept alive)
                                  ▼
     switch back ──► reuse cached TabA (onActivated, no remount)
     cache > N ──► LRU evict → real unmount`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'KeepAlive is a built-in component that caches a dynamic or routed child instead of unmounting it on switch, so its state (inputs, scroll, fetched data) is preserved and restored. Cached components fire onActivated when shown and onDeactivated when hidden, instead of mount/unmount (mount still runs once). Control caching with include/exclude (by component name) and max (LRU eviction). The trade-off is memory: cached instances and their timers stay alive, so pause work in onDeactivated and bound the cache with max.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'KeepAlive is a built-in abstract component that changes how Vue handles switching between dynamic children. Normally, when you swap a <component :is> or navigate a router-view, Vue unmounts the outgoing component and mounts the incoming one from scratch — which loses all of the outgoing component\'s state: form input, scroll position, fetched data. Wrap that switchable child in <KeepAlive> and Vue caches the instance instead. When you switch away, KeepAlive detaches the component\'s DOM into an offscreen container, keeps the instance with all its reactive state in an internal cache, and fires the onDeactivated hook. When you switch back, it pulls the cached instance, re-inserts its preserved DOM, and fires onActivated — skipping setup and mount entirely, so everything is exactly as you left it. Two things matter for interviews. First, the lifecycle: cached components don\'t run mount/unmount on toggle; they run onActivated and onDeactivated, which fire repeatedly, although onMounted still runs once on the first activation. Second, the controls and trade-offs: include and exclude match against component names to decide what gets cached, and max creates an LRU cache that unmounts the least-recently-used instance when exceeded. The cost is memory — every cached instance pins its state and DOM and is not garbage collected while cached. A subtle production gotcha is that cached doesn\'t mean inert: watchers, intervals, and polling keep running while the component is hidden, so you should pause them in onDeactivated and resume in onActivated. And because state persists, you may need to re-fetch in onActivated to avoid stale data.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Instant stateful switches and fewer network requests vs higher memory usage from retained instances and DOM.',
      'Caching everything maximizes UX continuity but risks memory bloat and stale data; selective include + max is the balanced choice.',
    ],
    edgeCases: [
      'include/exclude only match components with a resolvable name.',
      'Cached components keep timers/watchers/polling alive while hidden unless paused.',
      'Data fetched once goes stale; re-fetch in onActivated when freshness matters.',
      'Combining with Transition requires care so enter/leave animations apply to activation, not mount.',
    ],
    runtimeBehavior: [
      'Cached instances are stored in an internal Map; their DOM lives in an offscreen container while inactive.',
      'onActivated/onDeactivated fire depth-first across the cached subtree.',
      'max enforces LRU; eviction performs a true unmount that runs real cleanup hooks.',
    ],
    scalability: [
      'Unbounded caches grow memory with the number of distinct visited views — always set max in large apps.',
      'For very large lists, prefer preserving lightweight state (filters/scroll) over caching whole heavy instances.',
    ],
    productionConcerns: [
      'Background work in hidden cached components is a common resource leak — audit onDeactivated cleanup.',
      'Stale-data bugs after returning to a cached view; define a re-validation strategy.',
      'Memory pressure on low-end devices; tune max and include conservatively.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'KeepAlive caches child instances instead of unmounting them on switch.',
    'Preserves state: inputs, scroll, fetched data.',
    'Hooks: onActivated (shown), onDeactivated (hidden) — fire repeatedly.',
    'onMounted still runs once on first activation.',
    'include/exclude match by component NAME.',
    'max = LRU cache size; exceeding it unmounts the least-recently-used instance.',
    'Cached instances stay in memory (not GC\'d) — that is the cost.',
    'Timers/watchers keep running while hidden → pause in onDeactivated.',
    'Re-fetch in onActivated to avoid stale data.',
    'Use with <component :is> and router-view (v-slot pattern).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Wrap a two-tab <component :is> in KeepAlive so each tab keeps its input.',
      hint: 'Just wrap the dynamic component.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <KeepAlive>\n    <component :is="tabs[current]" />\n  </KeepAlive>\n</template>',
        explanation: [
          'KeepAlive caches whichever tab is inactive instead of destroying it.',
          'Returning to a tab shows its preserved input.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Pause a polling interval when the cached component is hidden and resume when shown.',
      hint: 'Use onActivated/onDeactivated.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { onActivated, onDeactivated } from \'vue\'\nlet timer = null\nfunction poll() { /* fetch */ }\nonActivated(() => { timer = setInterval(poll, 5000) })\nonDeactivated(() => { clearInterval(timer) })\n</script>',
        explanation: [
          'onActivated starts polling each time the component becomes visible.',
          'onDeactivated clears it so the hidden cached component does no background work.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Cache only "Dashboard" and "Settings", keep at most 2 instances, and exclude everything else.',
      hint: 'Use include + max.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <KeepAlive :include="[\'Dashboard\', \'Settings\']" :max="2">\n    <component :is="views[current]" />\n  </KeepAlive>\n</template>\n<!-- components must define name: \'Dashboard\' / name: \'Settings\' -->',
        explanation: [
          'include caches only the two named components; others unmount normally.',
          'max=2 bounds memory with LRU eviction.',
          'The names must be resolvable for include matching to work.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A cached list view shows stale data after returning from an edit page. Fix it without disabling KeepAlive.',
      hint: 'Re-validate in onActivated.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { onActivated, ref } from \'vue\'\nconst items = ref([])\nconst dirty = ref(false) // set true after an edit elsewhere (e.g. via store)\n\nasync function load() { items.value = await fetchItems() }\n\nonActivated(async () => {\n  if (dirty.value || items.value.length === 0) {\n    await load()\n    dirty.value = false\n  }\n})\n</script>',
        explanation: [
          'KeepAlive preserves the instance, so onMounted will not re-run on return.',
          'onActivated re-validates: it re-fetches when data is marked dirty or empty.',
          'This keeps the instant switch benefit while avoiding stale data.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'KeepAlive is a high-leverage UX tool: it turns jarring "everything resets" tab/route switches into smooth, stateful navigation. Knowing its hooks and trade-offs signals you can build polished, performant Vue apps, not just functional ones.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what KeepAlive does and name its hooks. Product companies (Zoho, Flipkart, Razorpay) ask about include/exclude/max and stale-data/timer handling. FAANG-level interviews probe the caching mechanism, memory implications, LRU eviction, and Transition interplay.',
    whatInterviewersExpect:
      'They expect you to explain instance caching vs unmounting, name onActivated/onDeactivated and how they differ from mount/unmount, describe include/exclude/max, and discuss the memory and stale-data trade-offs.',
  },
}

export default keepalive
