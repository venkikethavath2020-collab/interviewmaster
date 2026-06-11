import type { ConceptLesson } from '../../../types/lesson'

const lifecycleHooks: ConceptLesson = {
  // 1. Concept Summary
  slug: 'lifecycle-hooks',
  name: 'Lifecycle Hooks',
  category: 'lifecycle-rendering',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Lifecycle hooks are how you run code at the right moment — fetch data after mount, clean up listeners before unmount, react to updates.',
    'Almost every real component needs at least onMounted (initial fetch/DOM access) and onUnmounted (cleanup) — they are everyday tools.',
    'Doing work at the wrong phase (e.g. touching the DOM before mount) is a common source of "el is null/undefined" bugs.',
    'Forgetting cleanup in onUnmounted leaks listeners, timers, and subscriptions — a frequent production memory-leak cause.',
    'Interviewers expect you to name the main hooks, their order, and the Options-vs-Composition mapping (mounted → onMounted).',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Lifecycle hooks are like the bell schedule of a school day — different things happen at fixed times: arrive, learn, leave.',
    story: [
      'A school day has a schedule: a bell rings when you arrive, bells ring between lessons, and a bell rings when it is time to go home.',
      'You do different things at each bell — put your bag down when you arrive, switch subjects between lessons, pack up before leaving.',
      'You would not pack your bag to go home in the middle of first lesson — you do the right thing at the right bell.',
      'A component has the same kind of schedule: it is born, it gets shown on the screen, it updates, and finally it leaves — and you can attach code to each of those moments.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every component goes through a series of stages: it is created, it is added to the page, it updates when data changes, and eventually it is removed.',
    'Lifecycle hooks are functions Vue calls automatically at each of those stages, so you can run your own code at the right time.',
    'For example, you usually fetch data right after the component appears on the page (mounted), and you remove timers right before it disappears (unmounted).',
    'In the Composition API these hooks are functions you call inside setup, like onMounted and onUnmounted.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Lifecycle hooks are callbacks Vue runs at defined points in a component\'s life: creation, mounting to the DOM, updating after reactive changes, and unmounting/teardown. They let you run setup and cleanup code at the correct phase.',
    how: 'In the Composition API you register them inside setup() by calling on* functions (onMounted, onUpdated, onUnmounted, onBeforeMount, etc.) and passing a callback. Vue invokes each callback when the component reaches that phase. In the Options API the same phases are options named without the "on" prefix (mounted, updated, unmounted).',
    why: 'Different work belongs to different phases: DOM access and initial data fetching after mount, reacting to changes on update, and releasing resources before unmount to avoid leaks.',
    code: {
      label: 'Fetch on mount, clean up on unmount',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst data = ref<unknown>(null)\nlet timer: number\n\nonMounted(async () => {\n  data.value = await fetch(\'/api/items\').then(r => r.json()) // safe: DOM is ready\n  timer = window.setInterval(() => console.log(\'tick\'), 1000)\n})\n\nonUnmounted(() => {\n  clearInterval(timer) // release the resource → no leak\n})\n</script>\n\n<template><pre>{{ data }}</pre></template>',
      explanation: [
        'onMounted runs after the component is in the DOM — the right place to fetch and access elements.',
        'A timer is started on mount and stored for later cleanup.',
        'onUnmounted clears the timer before the component is destroyed.',
        'This fetch-on-mount / cleanup-on-unmount pair is the most common lifecycle usage.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Lifecycle hooks are instance-bound callbacks invoked by Vue at fixed stages of a component\'s existence: setup/creation, before/after mount (DOM insertion), before/after update (re-render triggered by reactive change), and before/after unmount (teardown). In the Composition API they are registered via on* functions inside setup() and attach to the current instance through the internal currentInstance pointer (hence must be called synchronously). The Options API exposes the equivalent phases as options (beforeCreate, created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted). Mount hooks run child-before-parent for mounted; update hooks fire only when a component actually re-renders; unmount hooks run during teardown for cleanup. keep-alive adds onActivated/onDeactivated, and onErrorCaptured/onRenderTracked/onRenderTriggered are additional Composition hooks.',

  // 7. Internal Working
  internalWorking: [
    'During component creation Vue sets currentInstance, runs setup() (Composition) or the created phase (Options), so any on* hook registered there is recorded on that instance\'s hook queues.',
    'After the render function produces the initial vnode tree and Vue patches it into the DOM, it flushes the mounted queue — children mount before parents, so a parent\'s onMounted fires after its children\'s.',
    'When reactive state a component depends on changes, its render effect is scheduled; before the re-render Vue calls beforeUpdate, patches the DOM via the diff algorithm, then calls updated.',
    'Updates are batched: multiple synchronous state changes coalesce into one re-render, so updated fires once per flush, not per mutation.',
    'On removal, Vue runs beforeUnmount, tears down the component (stopping its effects/watchers and recursing into children), then runs unmounted — the place registered cleanups execute.',
    'Composition on* hooks work because they read currentInstance synchronously during setup; calling them after an await or outside setup means no active instance and the registration is dropped.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   create ─► setup() / created
                │
        beforeMount
                │  (render → DOM insert)
            onMounted   ◄── fetch data, access $el  (children mount first)
                │
     ┌── state change ──┐
     │   beforeUpdate    │   (re-render only if it actually renders)
     │   (patch DOM)     │
     │   onUpdated       │
     └──────────────────┘
                │
       beforeUnmount
            onUnmounted  ◄── clear timers, remove listeners (cleanup)`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — log each phase',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onMounted, onUpdated, onUnmounted } from \'vue\'\nconst count = ref(0)\nonMounted(() => console.log(\'mounted\'))\nonUpdated(() => console.log(\'updated\'))\nonUnmounted(() => console.log(\'unmounted\'))\n</script>\n\n<template>\n  <button @click="count++">{{ count }}</button>\n</template>',
      explanation: [
        'onMounted runs once after the button is in the DOM.',
        'onUpdated runs after each re-render caused by count changing.',
        'onUnmounted runs once when the component is removed.',
        'These three cover the everyday lifecycle needs.',
      ],
    },
    intermediate: {
      label: 'Intermediate — Options API vs Composition mapping',
      lang: 'ts',
      code: '// Options API\nexport default {\n  created() { /* state ready, no DOM yet */ },\n  mounted() { /* DOM ready — fetch / measure */ },\n  updated() { /* after re-render */ },\n  unmounted() { /* cleanup */ },\n}\n\n// Composition API equivalent (inside setup)\nimport { onMounted, onUpdated, onUnmounted } from \'vue\'\n// setup itself replaces beforeCreate/created\nonMounted(() => {})\nonUpdated(() => {})\nonUnmounted(() => {})',
      explanation: [
        'setup() runs at the created phase, so there is no separate onCreated.',
        'Options hooks drop the "on" prefix; Composition hooks add it.',
        'mounted ↔ onMounted, updated ↔ onUpdated, unmounted ↔ onUnmounted.',
        'beforeUnmount ↔ onBeforeUnmount, beforeMount ↔ onBeforeMount, etc.',
      ],
    },
    advanced: {
      label: 'Advanced — DOM measurement & keep-alive hooks',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onMounted, onActivated, onDeactivated } from \'vue\'\nconst box = ref<HTMLElement | null>(null)\nconst width = ref(0)\n\nonMounted(() => {\n  width.value = box.value?.offsetWidth ?? 0 // el exists now\n})\n// fired when shown/hidden inside <KeepAlive>\nonActivated(() => console.log(\'activated\'))\nonDeactivated(() => console.log(\'deactivated\'))\n</script>\n\n<template><div ref="box">{{ width }}px</div></template>',
      explanation: [
        'Measuring the element must wait for onMounted — before that the ref is null.',
        'onActivated/onDeactivated only fire for components cached by <KeepAlive>.',
        'A deactivated cached component is NOT unmounted, so onUnmounted does not run.',
        'Use activated/deactivated to pause/resume work for cached views.',
      ],
    },
    realProject: {
      label: 'Real project — subscription with guaranteed cleanup',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, onMounted, onUnmounted } from \'vue\'\nimport { socket } from \'@/api/socket\'\nconst messages = ref<string[]>([])\n\nfunction onMessage(msg: string) { messages.value.push(msg) }\n\nonMounted(() => socket.on(\'message\', onMessage))   // subscribe\nonUnmounted(() => socket.off(\'message\', onMessage)) // unsubscribe → no leak\n</script>\n\n<template>\n  <ul><li v-for="(m, i) in messages" :key="i">{{ m }}</li></ul>\n</template>',
      explanation: [
        'The subscription is created on mount and torn down on unmount.',
        'Pairing subscribe/unsubscribe in mount/unmount prevents leaks and duplicate handlers.',
        'The same handler reference is used to subscribe and unsubscribe.',
        'This is the standard pattern for sockets, event buses, and observers.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the main lifecycle phases of a Vue component?',
      answer: 'Creation (setup/created), mounting (beforeMount/mounted), updating (beforeUpdate/updated when reactive data changes), and unmounting (beforeUnmount/unmounted).',
      explanation: 'A good answer lists the four phases and pairs the before/after hooks.',
    },
    {
      level: 'beginner',
      question: 'Where should you fetch initial data, and why not earlier?',
      answer: 'In mounted/onMounted, because the component is in the DOM and you can safely access elements; doing it earlier risks missing DOM refs and the data may not be needed before render.',
      explanation: 'Tests understanding that DOM access requires the mounted phase.',
    },
    {
      level: 'intermediate',
      question: 'How do Composition API hooks map to Options API hooks?',
      answer: 'Add "on" and camelCase: mounted → onMounted, updated → onUpdated, unmounted → onUnmounted, beforeUnmount → onBeforeUnmount; setup() itself covers beforeCreate/created, so there is no onCreated.',
      explanation: 'The mapping plus the "no onCreated" detail signals real familiarity.',
    },
    {
      level: 'intermediate',
      question: 'Why must onMounted/onUnmounted be called synchronously in setup?',
      answer: 'They register against the current instance via an internal pointer set only during synchronous setup; after an await or outside setup there is no active instance, so registration is silently dropped.',
      explanation: 'Connects the rule to currentInstance, a common follow-up.',
    },
    {
      level: 'advanced',
      question: 'In what order do mounted hooks fire across a parent and its children?',
      answer: 'Children mount before parents, so a child\'s onMounted runs before its parent\'s onMounted (the parent\'s DOM is complete only once children are mounted).',
      explanation: 'Ordering is a classic gotcha; the child-first rule is the key insight.',
    },
    {
      level: 'senior',
      question: 'How do keep-alive and update batching affect lifecycle behaviour?',
      answer: 'A component inside <KeepAlive> is cached, not destroyed, when hidden — it fires onDeactivated (not onUnmounted) and onActivated when shown again. Updates are batched, so onUpdated fires once per flush regardless of how many synchronous state changes occurred, and only if the component actually re-renders.',
      explanation: 'Senior signal: cached-vs-destroyed semantics and batched-update timing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between created and mounted?',
    'Why is there no onCreated in the Composition API?',
    'When does onUpdated NOT fire even though data changed? (no re-render)',
    'What hooks does <KeepAlive> add and how do they differ from unmount?',
    'How does nextTick relate to the update hooks?',
    'What are onErrorCaptured / onRenderTracked / onRenderTriggered used for?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Accessing the DOM (template refs) in setup/created instead of onMounted.',
      why: 'The element does not exist until the component mounts, so the ref is null.',
      fix: 'Do DOM reads/writes inside onMounted (or after nextTick).',
    },
    {
      mistake: 'Forgetting to clean up listeners/timers/subscriptions in onUnmounted.',
      why: 'They keep running after the component is gone, leaking memory and firing on dead components.',
      fix: 'Pair every subscription/timer with a teardown in onUnmounted (or use watch onCleanup / AbortController).',
    },
    {
      mistake: 'Registering a hook after an await in an async setup.',
      why: 'currentInstance is cleared after the first await, so the hook never registers.',
      fix: 'Register all lifecycle hooks synchronously, before any await.',
    },
    {
      mistake: 'Doing heavy work in onUpdated and triggering more state changes.',
      why: 'It can cause repeated updates or loops and runs on every re-render.',
      fix: 'Prefer watch/computed for reacting to specific data; keep onUpdated light or avoid mutating state in it.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'onMounted for initial data fetch and DOM measurement; onUnmounted for removing listeners, timers, and subscriptions.' },
    { area: 'Component library', detail: 'Hooks drive setup/teardown of third-party widgets (charts, maps, editors) — init on mount, destroy on unmount.' },
    { area: 'Nuxt', detail: 'SSR-aware components avoid browser-only APIs until onMounted (client-only), since server render has no DOM/window.' },
    { area: 'Vue', detail: '<KeepAlive> views use onActivated/onDeactivated to pause polling or refresh data when tabs are switched.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Doing work at the correct phase (fetch on mount, cleanup on unmount) avoids wasted/early work and leaks.',
      'Batched updates mean onUpdated runs once per flush rather than per mutation.',
    ],
    bad: [
      'Heavy synchronous work in onMounted delays interactivity right after render.',
      'Expensive logic in onUpdated runs on every re-render and can cascade.',
    ],
    optimizations: [
      'Defer non-critical work (analytics, prefetch) with requestIdleCallback or after first paint.',
      'Use watch/computed for targeted reactions instead of broad onUpdated logic.',
      'Always clean up in onUnmounted to release resources promptly.',
      'For cached views, pause polling in onDeactivated and resume in onActivated.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'setup-function', 'reactivity-fundamentals'],
    nextConcepts: ['lifecycle-hooks-composition', 'nexttick', 'keepalive'],
    dependencyNote:
      'Lifecycle hooks build on components-basics and setup() (where Composition hooks are registered) and on reactivity (which triggers update hooks). They lead into the Composition-specific hook details, nextTick (post-update DOM timing), and keep-alive\'s activated/deactivated hooks.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a vertical timeline: create → mount → update (loop) → unmount.',
      'Mark beforeMount/mounted, beforeUpdate/updated, beforeUnmount/unmounted next to each stage.',
      'Annotate "fetch + DOM access" at mounted and "cleanup" at unmounted.',
      'Note that children mount before parents next to the mounted arrow.',
      'Say: "setup runs at create; do DOM work at mount; clean up at unmount; updates are batched."',
    ],
    diagram: `  create ─► (setup/created)
  mount  ─► beforeMount → mounted   (children first) ⇐ fetch/DOM
  update ─► beforeUpdate → updated  (batched, only if re-renders)
  unmount─► beforeUnmount → unmounted  ⇐ clear timers/listeners`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Lifecycle hooks let you run code at a component\'s stages: creation, mount (onMounted — fetch data, access DOM), update (onUpdated — after a re-render, batched), and unmount (onUnmounted — clean up timers/listeners). In the Composition API they are on* functions registered synchronously in setup; the Options API uses the same names without "on" (mounted, updated, unmounted), and setup replaces created. Children mount before parents. <KeepAlive> swaps unmount for onDeactivated/onActivated.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Every Vue component goes through a lifecycle, and lifecycle hooks let you run your own code at each stage. The four phases are creation, mounting, updating, and unmounting. Creation is when the component instance and its reactive state are set up — in the Composition API, setup() itself runs at this point, which is why there is no separate onCreated. Mounting is when the rendered output is inserted into the DOM; onMounted is where you do initial data fetching and any DOM access, because before this the element does not exist and template refs are null. Updating happens whenever reactive data the component depends on changes and it re-renders: beforeUpdate fires before the DOM is patched and onUpdated after. Crucially, updates are batched, so if you change several pieces of state synchronously, the component re-renders once and onUpdated fires once, not per change — and it only fires if the component actually re-renders. Unmounting is teardown: beforeUnmount then onUnmounted, which is where you must clean up — clear intervals, remove event listeners, unsubscribe from sockets — otherwise you leak memory and code keeps running on a dead component. A couple of important details: the Composition hooks are on* functions you register inside setup, and they must be called synchronously, because they attach to the current instance through an internal pointer that is only active during synchronous setup — register after an await and it silently fails. Ordering matters too: children mount before parents, so a child\'s onMounted runs before its parent\'s. And if a component lives inside <KeepAlive>, hiding it does not unmount it — instead it fires onDeactivated and, when shown again, onActivated, which is where you pause and resume things like polling. The everyday pattern people use most is fetch-and-subscribe in onMounted, and tear-down in onUnmounted.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'onMounted fetching is simple but delays data until after first paint; SSR/prefetch patterns fetch earlier at the cost of complexity.',
      'Reacting in onUpdated is broad and easy but fires on every render; watch/computed are more targeted but require naming dependencies.',
    ],
    edgeCases: [
      'No onCreated in Composition API — setup covers it.',
      'Async setup clears currentInstance after await, dropping later hook registrations.',
      'KeepAlive caches components: onDeactivated/onActivated instead of unmount/mount.',
      'onUpdated does not fire if a state change does not actually cause a re-render.',
    ],
    runtimeBehavior: [
      'mounted hooks flush child-before-parent; the parent DOM is complete only after children mount.',
      'Updates are scheduled and batched into one flush, so update hooks coalesce.',
      'onUnmounted runs during teardown, after effects/watchers are stopped, recursing through children.',
    ],
    scalability: [
      'Disciplined cleanup in onUnmounted across many components prevents accumulating leaks in long-lived SPAs.',
      'For cached/route-tabbed views, activated/deactivated control resource use as the app grows.',
    ],
    productionConcerns: [
      'Missing onUnmounted cleanup is the most common lifecycle-related leak — audit subscriptions/timers.',
      'SSR has no DOM/window, so browser-only work must wait for onMounted (client-side).',
      'Heavy onMounted work hurts time-to-interactive; defer non-critical tasks.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Phases: create → mount → update → unmount (each has before/after).',
    'Composition: on* functions in setup (onMounted, onUpdated, onUnmounted...).',
    'Options: same names, no "on" (mounted, updated, unmounted).',
    'setup() = the created phase → there is NO onCreated.',
    'onMounted: fetch data + access DOM (el exists now).',
    'onUnmounted: clear timers, remove listeners, unsubscribe.',
    'Register hooks SYNCHRONOUSLY in setup (before any await).',
    'Children mount before parents.',
    'Updates are batched → onUpdated once per flush, only if it re-renders.',
    '<KeepAlive>: onActivated/onDeactivated instead of mount/unmount.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Log "mounted" when a component appears and "bye" when it is removed.',
      hint: 'Use onMounted and onUnmounted.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { onMounted, onUnmounted } from \'vue\'\nonMounted(() => console.log(\'mounted\'))\nonUnmounted(() => console.log(\'bye\'))\n</script>\n\n<template><div>Hi</div></template>',
        explanation: ['onMounted runs after insertion.', 'onUnmounted runs at teardown.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Start a 1s interval on mount and ensure it stops when the component unmounts.',
      hint: 'Store the timer id and clear it in onUnmounted.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst seconds = ref(0)\nlet id: number\nonMounted(() => { id = window.setInterval(() => seconds.value++, 1000) })\nonUnmounted(() => clearInterval(id))\n</script>\n\n<template>{{ seconds }}s</template>',
        explanation: ['The interval starts after mount.', 'Clearing it on unmount prevents a leak.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Measure an element\'s width after it renders and update it on window resize, with proper cleanup.',
      hint: 'Read width in onMounted; add/remove a resize listener.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst box = ref<HTMLElement | null>(null)\nconst width = ref(0)\nconst measure = () => { width.value = box.value?.offsetWidth ?? 0 }\nonMounted(() => { measure(); window.addEventListener(\'resize\', measure) })\nonUnmounted(() => window.removeEventListener(\'resize\', measure))\n</script>\n\n<template><div ref="box">{{ width }}px</div></template>',
        explanation: [
          'The element only exists in onMounted, so measure runs there first.',
          'The resize listener is removed on unmount to avoid leaks.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why this async setup hook never fires and fix it: async setup runs `await load()` then calls onMounted.',
      hint: 'currentInstance is gone after await.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, onMounted } from \'vue\'\nconst data = ref<unknown>(null)\n// CORRECT: register the hook BEFORE awaiting\nonMounted(() => console.log(\'mounted\'))\ndata.value = await fetch(\'/api\').then(r => r.json())\n// onMounted placed AFTER this await would NOT register\n</script>',
        explanation: [
          'After the first await, Vue has cleared currentInstance, so hook registration is dropped.',
          'Register lifecycle hooks synchronously, before any await.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Lifecycle hooks are bread-and-butter: nearly every component fetches on mount and cleans up on unmount. Knowing the phases, their order, and the Options↔Composition mapping makes you immediately effective and catches common leak/timing bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask you to list the hooks and the created-vs-mounted difference. Product companies (Zoho, Flipkart, Razorpay) ask where to fetch data, how to clean up, and the Options↔Composition mapping. FAANG-level interviews probe parent/child mount order, batched-update timing, keep-alive activated/deactivated, and the async-setup currentInstance rule.',
    whatInterviewersExpect:
      'Name the four phases and key hooks, explain fetch-on-mount and cleanup-on-unmount, give the Options↔Composition mapping (and why no onCreated), and mention ordering, batching, and keep-alive nuances.',
  },
}

export default lifecycleHooks
