import type { ConceptLesson } from '../../../types/lesson'

const lifecycleHooksComposition: ConceptLesson = {
  // 1. Concept Summary
  slug: 'lifecycle-hooks-composition',
  name: 'Lifecycle Hooks (Composition)',
  category: 'composition-api',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Lifecycle hooks let you run code at exactly the right moment — after the DOM exists, before the component is destroyed, when data updates — which is essential for real apps.',
    'In the Composition API the hooks are imported functions (onMounted, onUnmounted…) you call inside setup, a totally different mental model from the Options API methods.',
    'They are how you set up and tear down side effects: fetch data, attach listeners, start timers, integrate third-party libraries — and clean them up to avoid leaks.',
    'Interviewers test whether you know the hook ORDER, the Options-to-Composition name mapping, and why hooks must be registered synchronously.',
    'Getting cleanup wrong (no onUnmounted) is one of the most common causes of memory leaks and "ghost" event handlers in production Vue apps.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Lifecycle hooks are alarms you set for different moments of a play.',
    story: [
      'Imagine you are putting on a school play. There are special moments: before the curtain opens, right after the actors walk on stage, and right before everyone goes home.',
      'You set little alarms for each moment so you remember what to do — "turn on the lights when the curtain opens", "switch off the lights before we leave".',
      'A Vue component is like that play. It is born, it appears on the screen, it changes, and finally it leaves.',
      'Lifecycle hooks are your alarms for those moments. You tell Vue "when the component appears, do THIS" and "before it leaves, clean up THAT", and Vue rings the alarm at exactly the right time.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Every Vue component goes through stages: it is created, then mounted (added to the page), it may update when data changes, and finally it is unmounted (removed).',
    'In the Composition API you respond to these stages by importing functions like onMounted and onUnmounted from "vue" and calling them inside setup.',
    'You pass each one a callback, and Vue runs that callback at the matching stage — onMounted runs after the component is on the page so you can safely touch the real DOM.',
    'The most important pair is onMounted (start something) and onUnmounted (clean it up), like opening and closing a door.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Composition API lifecycle hooks are functions (onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted) you call inside setup to register callbacks that Vue invokes at specific points in a component\'s life.',
    how: 'Import the hook from "vue" and call it synchronously inside setup/<script setup>, passing a callback. Vue ties the registration to the current component instance and fires your callback at the right stage. There is no onCreated/onBeforeCreate — that code just goes directly in setup.',
    why: 'Hooks give you precise timing for side effects: fetch after mount, read DOM measurements after render, and tear everything down before unmount.',
    code: {
      label: 'onMounted + onUnmounted',
      lang: 'js',
      code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\n\nconst seconds = ref(0)\nlet timer = null\n\nonMounted(() => {\n  // DOM is ready here; start a timer\n  timer = setInterval(() => seconds.value++, 1000)\n})\n\nonUnmounted(() => {\n  // clean up so the timer does not leak\n  clearInterval(timer)\n})\n</script>\n\n<template><p>Alive for {{ seconds }}s</p></template>',
      explanation: [
        'onMounted runs after the component is inserted into the DOM, the safe place to start side effects.',
        'The timer increments a ref, so the template re-renders each second.',
        'onUnmounted clears the interval when the component is removed — without this the timer keeps running forever.',
        'Both hooks are registered synchronously at the top of setup so Vue knows which instance they belong to.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Composition API lifecycle hooks are registration functions imported from Vue (onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted, plus onErrorCaptured, onActivated, onDeactivated, onRenderTracked, onRenderTriggered) that attach callbacks to the current component instance\'s lifecycle. They must be called synchronously during setup() so Vue can resolve the active instance via its internal currentInstance pointer. The setup() function itself runs at the "created" stage, so beforeCreate/created have no Composition equivalent — that logic lives inline in setup.',

  // 7. Internal Working
  internalWorking: [
    'When a component renders, Vue sets an internal currentInstance pointer and synchronously executes setup(); any hook called now reads that pointer to know which instance to attach to.',
    'Each hook (e.g. onMounted) pushes its callback into an array on the instance (instance.m for mounted, instance.um for unmounted, etc.), so multiple calls to the same hook are all kept and run in order.',
    'After setup returns, Vue compiles/renders the component to a vdom tree and patches it into the DOM; once the real DOM nodes are inserted, it flushes the instance.m array — firing onMounted callbacks.',
    'On a reactive data change, the render effect re-runs: Vue fires onBeforeUpdate, diffs old vs new vdom, patches the DOM, then fires onUpdated.',
    'When the component is removed, Vue fires onBeforeUnmount, tears down child components and stops the component\'s effect scope (disposing watchers/computeds), then fires onUnmounted.',
    'Because registration depends on the synchronous currentInstance, calling a hook after an await or inside a setTimeout finds currentInstance === null and the hook silently does nothing (with a dev warning).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   setup() runs   ← "created" stage (no onCreated hook needed)
        │
        ▼
   onBeforeMount      (DOM not yet inserted)
        │
        ▼
   ░░ render → patch → insert into DOM ░░
        │
        ▼
   onMounted          (real DOM available — fetch, measure, listeners)
        │
   ┌────┴─────────── reactive data changes ───────────┐
   │   onBeforeUpdate → re-render/patch → onUpdated    │  (loops)
   └───────────────────────────────────────────────────┘
        │
        ▼ component removed
   onBeforeUnmount    (still in DOM — last chance)
        │
        ▼
   onUnmounted        (gone — clear timers/listeners here)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Hook callbacks are stored in arrays on the component instance (instance.m, instance.um, …) and are reachable as long as the instance lives.',
    'Side effects started in onMounted (timers, listeners, subscriptions) capture component refs in their closures; if not cleared in onUnmounted they keep the instance and its data alive — a leak.',
    'When the component unmounts, Vue stops its effect scope, freeing watchers and computeds; the instance becomes unreachable and is GC\'d once external references are gone.',
    'A common leak: an onMounted addEventListener on window with no matching removeEventListener in onUnmounted keeps the whole component graph alive forever.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — fetch data after mount',
      lang: 'js',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst users = ref([])\nonMounted(async () => {\n  const res = await fetch(\'/api/users\')\n  users.value = await res.json()\n})\n</script>\n<template>\n  <ul><li v-for="u in users" :key="u.id">{{ u.name }}</li></ul>\n</template>',
      explanation: [
        'Data fetching belongs in onMounted (client side) — the component is on the page and ready to display results.',
        'Note: the await is INSIDE the hook callback; the onMounted call itself is synchronous, which is required.',
        'Updating the users ref triggers a re-render with the fetched list.',
        'There is no onCreated; if you wanted to fetch even earlier you would just put it directly in setup.',
      ],
    },
    intermediate: {
      label: 'Intermediate — multiple hooks and registration order',
      lang: 'js',
      code: '<script setup>\nimport { onBeforeMount, onMounted, onBeforeUnmount, onUnmounted } from \'vue\'\n\nonBeforeMount(() => console.log(\'1 before mount\'))\nonMounted(() => console.log(\'2 mounted\'))\nonMounted(() => console.log(\'2b second onMounted also runs\'))\nonBeforeUnmount(() => console.log(\'3 before unmount\'))\nonUnmounted(() => console.log(\'4 unmounted\'))\n</script>',
      explanation: [
        'You may register the same hook multiple times — Vue stores each callback and runs them in registration order.',
        'This is impossible in the Options API where each lifecycle is a single method; composition lets composables add their own hooks independently.',
        'The console order on mount is: 1, then 2, then 2b.',
        'On removal it is: 3, then 4.',
      ],
    },
    advanced: {
      label: 'Advanced — read DOM in onUpdated and parent/child order',
      lang: 'js',
      code: '<script setup>\nimport { ref, onUpdated, nextTick } from \'vue\'\nconst list = ref([1, 2, 3])\nconst el = ref(null)\n\nonUpdated(() => {\n  // DOM reflects the latest data here\n  console.log(\'rendered items:\', el.value?.children.length)\n})\n\nasync function addItem() {\n  list.value.push(list.value.length + 1)\n  await nextTick()   // wait for DOM patch if you need it immediately\n  console.log(\'after nextTick\', el.value.children.length)\n}\n</script>\n<template>\n  <ul ref="el"><li v-for="n in list" :key="n">{{ n }}</li></ul>\n  <button @click="addItem">add</button>\n</template>',
      explanation: [
        'onUpdated fires after the DOM has been patched, so DOM reads reflect the new data.',
        'Child onMounted/onUpdated run BEFORE the parent\'s (children mount first), an important ordering detail.',
        'For one-off post-update DOM access prefer await nextTick() over onUpdated, which fires on every update.',
        'Avoid mutating reactive state inside onUpdated — it can cause an infinite update loop.',
      ],
    },
    realProject: {
      label: 'Real project — third-party chart integration with cleanup',
      lang: 'js',
      code: '<script setup>\nimport { ref, onMounted, onBeforeUnmount, watch } from \'vue\'\nimport Chart from \'chart.js/auto\'\n\nconst canvas = ref(null)\nconst props = defineProps([\'data\'])\nlet chart = null\n\nonMounted(() => {\n  chart = new Chart(canvas.value, { type: \'bar\', data: props.data })\n})\n\nwatch(() => props.data, (d) => {\n  if (chart) { chart.data = d; chart.update() }\n})\n\nonBeforeUnmount(() => {\n  chart?.destroy()   // free canvas + listeners the library attached\n})\n</script>\n<template><canvas ref="canvas" /></template>',
      explanation: [
        'Third-party libraries that need a real DOM node are initialized in onMounted using a template ref.',
        'A watch keeps the imperative chart in sync with reactive props.',
        'onBeforeUnmount calls chart.destroy() to release the library\'s internal listeners and avoid leaks — the most common real-world reason to use the hook.',
        'This integrate-on-mount / destroy-on-unmount pattern applies to maps, editors, video players, and most JS widgets.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Name the main Composition API lifecycle hooks and what each is for.',
      answer: 'onBeforeMount (before DOM insertion), onMounted (after DOM insertion — fetch/measure/listeners), onBeforeUpdate (before re-render), onUpdated (after DOM patched), onBeforeUnmount (last chance before removal), onUnmounted (after removal — cleanup). Plus onErrorCaptured and the keep-alive hooks onActivated/onDeactivated.',
      explanation: 'A complete answer pairs each hook with a typical use and notes the before/after symmetry.',
    },
    {
      level: 'beginner',
      question: 'What is the Composition API equivalent of created / beforeCreate?',
      answer: 'There is none — setup() itself runs at that stage, so any code you would have put in created just goes directly in the body of setup/<script setup>.',
      explanation: 'A frequent gotcha; interviewers want to see you know setup replaces the create phase.',
    },
    {
      level: 'intermediate',
      question: 'Why must lifecycle hooks be called synchronously inside setup?',
      answer: 'Hooks resolve the component they belong to via Vue\'s internal currentInstance pointer, which is only set during synchronous execution of setup. After an await or inside a callback, currentInstance is null, so the hook registers nowhere and warns in dev.',
      explanation: 'Connecting the rule to currentInstance is the senior-grade explanation.',
    },
    {
      level: 'intermediate',
      question: 'In what order do parent and child lifecycle hooks fire on mount?',
      answer: 'Parent beforeMount → child beforeMount → child mounted → parent mounted. Children mount before the parent because the parent\'s DOM is only complete once its children are inserted. On unmount it is parent beforeUnmount → child beforeUnmount → child unmounted → parent unmounted.',
      explanation: 'Tests understanding of the tree-recursive mounting process, a common follow-up.',
    },
    {
      level: 'advanced',
      question: 'How can a composable register lifecycle hooks, and why is that powerful?',
      answer: 'A composable called during setup can call onMounted/onUnmounted itself, and those attach to the host component. This lets useMouse or useFetch set up and tear down their own side effects without the component knowing — true encapsulated, self-cleaning logic. Multiple composables can each register hooks and they all run.',
      explanation: 'Shows the synergy between hooks and composables that Options API mixins could not match cleanly.',
    },
    {
      level: 'senior',
      question: 'What problems arise from mutating reactive state inside onUpdated, and how do keep-alive hooks differ?',
      answer: 'Mutating state in onUpdated can trigger another render, leading to an infinite update loop. For cached components under <KeepAlive>, onMounted/onUnmounted do not fire on toggle; instead onActivated/onDeactivated fire, so you put pause/resume logic there rather than full setup/teardown.',
      explanation: 'Senior signal: awareness of update-loop hazards plus the keep-alive lifecycle variant.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Where do you put cleanup code and why is onUnmounted critical?',
    'What is onErrorCaptured used for?',
    'How do onActivated/onDeactivated relate to <KeepAlive>?',
    'What is the difference between onUpdated and awaiting nextTick?',
    'Can you call onMounted conditionally inside an if? (no — must be top-level synchronous)',
    'How does the SSR environment change which hooks run? (mounted/updated/unmounted do not run on the server)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Looking for onCreated / onBeforeCreate hooks.',
      why: 'They do not exist in the Composition API — setup runs at that point.',
      fix: 'Put created-stage logic directly in setup/<script setup>.',
    },
    {
      mistake: 'Registering a hook after an await or inside a callback.',
      why: 'currentInstance is no longer set, so the hook is ignored (dev warning only).',
      fix: 'Call all lifecycle hooks synchronously at the top level of setup.',
    },
    {
      mistake: 'Starting timers/listeners in onMounted but forgetting onUnmounted cleanup.',
      why: 'The side effect outlives the component, leaking memory and causing ghost handlers.',
      fix: 'Pair every setup in onMounted with teardown in onUnmounted (or use a self-cleaning composable).',
    },
    {
      mistake: 'Doing heavy DOM measurement in onMounted assuming the layout is final.',
      why: 'Child components and async content may not be ready; reads can be stale.',
      fix: 'Use await nextTick() (or onUpdated for measurements that depend on the latest render).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'onMounted is the standard place to fetch initial data, attach window/document listeners, and initialize third-party widgets (charts, maps, editors).' },
    { area: 'Component library', detail: 'Components like dialogs and tooltips use onMounted to attach focus traps and resize observers and onBeforeUnmount to detach them, ensuring no leaks across many instances.' },
    { area: 'Nuxt', detail: 'Because onMounted only runs client-side, Nuxt apps use it for browser-only code (localStorage, window) while data fetching uses useAsyncData so it works during SSR.' },
    { area: 'KeepAlive', detail: 'Tab and wizard UIs wrapped in <KeepAlive> use onActivated/onDeactivated to refresh or pause data when a cached view is shown or hidden.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Deferring expensive work to onMounted keeps initial setup fast and avoids blocking the first render.',
      'Proper onUnmounted cleanup prevents accumulated listeners/timers that would degrade a long-lived SPA.',
    ],
    bad: [
      'Heavy synchronous work inside onMounted delays the moment the user can interact.',
      'Side effects in onUpdated run on every update and can become a hot-path bottleneck.',
    ],
    optimizations: [
      'Use onUpdated sparingly; prefer watch on specific data or a single await nextTick().',
      'Debounce or batch expensive onUpdated/onMounted work like layout reads.',
      'Always tear down in onUnmounted to keep memory flat over the session.',
      'Use onActivated/onDeactivated with KeepAlive to pause work for hidden views instead of full re-init.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['script-setup', 'setup-function', 'lifecycle-hooks'],
    nextConcepts: ['composables', 'mounting-process', 'nexttick', 'keepalive'],
    dependencyNote:
      'These hooks build on setup/<script setup> and mirror the Options API lifecycle-hooks; understanding them unlocks composables (which register their own hooks), the mounting-process, nextTick timing, and KeepAlive\'s activated/deactivated variants.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a vertical timeline: setup → beforeMount → mounted → (update loop) → beforeUnmount → unmounted.',
      'Mark setup as the "created" stage and note there is no onCreated.',
      'Highlight onMounted as "DOM is ready — fetch, measure, listen".',
      'Highlight onUnmounted as "clean up — clear timers/listeners".',
      'Add the parent/child note: children mount before the parent; parent unmounts trigger children first.',
    ],
    diagram: `  setup() ─ created stage
     │
  onBeforeMount
     │  [render → DOM insert]
  onMounted ──────► fetch / listeners / 3rd-party init
     │
  (onBeforeUpdate → patch → onUpdated)  × N
     │
  onBeforeUnmount
     │  [remove from DOM]
  onUnmounted ────► clearInterval / removeEventListener`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Composition API lifecycle hooks are imported functions — onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted — called synchronously inside setup. setup itself is the created stage, so there is no onCreated. onMounted is for fetching, measuring, and attaching listeners; onUnmounted is for cleanup. They attach to the current instance via currentInstance, which is why they must run synchronously, and composables can register their own hooks too.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'In the Composition API, lifecycle hooks are functions you import from Vue and call inside setup, rather than methods on the component options. The main ones are onBeforeMount and onMounted around the first render, onBeforeUpdate and onUpdated around re-renders, and onBeforeUnmount and onUnmounted around removal. There is no onCreated or onBeforeCreate, because the setup function itself runs at the created stage — any code you would have put in created just goes directly in setup. The most important hook is onMounted: it fires after the component\'s real DOM is inserted, so it is the safe place to fetch data, measure the DOM, attach event listeners, or initialize a third-party library against a template ref. Its counterpart is onUnmounted, where you must tear down those side effects — clear timers, remove listeners, destroy widgets — or you leak memory and create ghost handlers. A crucial rule is that hooks must be called synchronously inside setup, because they resolve the component via Vue\'s internal currentInstance pointer, which is only set during synchronous setup execution; if you call a hook after an await it registers nowhere. Two more senior points: children mount before their parent, so child onMounted runs before parent onMounted; and a huge advantage over the Options API is that composables can register their own onMounted and onUnmounted, so a composable like useMouse sets up and cleans up its own listeners independently, and multiple composables can each add hooks that all run.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'onUpdated vs targeted watch: onUpdated catches every update but is broad and easy to misuse; a watch on specific state is more precise and avoids unnecessary work.',
      'Putting logic in setup (created stage) vs onMounted: setup runs during SSR while onMounted does not, so the choice affects server rendering.',
      'KeepAlive activated/deactivated vs mounted/unmounted: caching reuses the instance, trading memory for instant re-show but requiring different lifecycle handling.',
    ],
    edgeCases: [
      'onMounted, onUpdated, onUnmounted do NOT run during server-side rendering — only beforeCreate/created-stage (setup) and beforeMount run on the server.',
      'Mutating reactive state in onUpdated can cause an infinite render loop.',
      'Calling a hook conditionally or after await silently fails because currentInstance is unavailable.',
      'Under <KeepAlive>, toggling a view fires onDeactivated/onActivated instead of onUnmounted/onMounted, so cleanup placed only in onUnmounted never runs while cached.',
    ],
    runtimeBehavior: [
      'Hooks are stored as callback arrays on the instance, so multiple registrations of the same hook all run in order.',
      'The render effect drives onBeforeUpdate/onUpdated; they fire only when the component actually re-renders, not on every reactive read.',
      'On unmount Vue stops the component\'s effectScope, disposing watchers and computeds before onUnmounted runs.',
    ],
    scalability: [
      'Encapsulate setup/teardown in composables so dozens of components reuse self-cleaning side effects without duplicating onUnmounted logic.',
      'Share expensive global resources (a single ResizeObserver) with refcounting across instances rather than one per onMounted.',
      'Keep onUpdated handlers cheap; in large lists they run frequently and can dominate frame time.',
    ],
    productionConcerns: [
      'Leaks from missing onUnmounted cleanup are the top lifecycle bug — audit every onMounted side effect for a teardown.',
      'For SSR apps, guard browser-only code (window, localStorage) inside onMounted or import.meta.client checks.',
      'Use onErrorCaptured at a boundary component to log and gracefully handle descendant errors.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Order: setup → beforeMount → mounted → (beforeUpdate → updated)* → beforeUnmount → unmounted.',
    'setup() = created stage; no onCreated/onBeforeCreate.',
    'onMounted: DOM ready — fetch, measure, listeners, 3rd-party init.',
    'onUnmounted: cleanup — clearInterval, removeEventListener, widget.destroy().',
    'Call hooks SYNCHRONOUSLY in setup (needs currentInstance).',
    'Same hook can be registered multiple times; all run in order.',
    'Children mount before parent; parent unmounts trigger children first.',
    'onMounted/onUpdated/onUnmounted do NOT run during SSR.',
    'Never mutate reactive state in onUpdated (infinite loop).',
    'KeepAlive uses onActivated/onDeactivated, not mounted/unmounted.',
    'Composables can register their own hooks — self-cleaning logic.',
    'Use await nextTick() for one-off post-render DOM reads.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Log "mounted" when a component appears and "gone" when it is removed.',
      hint: 'Use onMounted and onUnmounted.',
      solution: {
        lang: 'js',
        code: '<script setup>\nimport { onMounted, onUnmounted } from \'vue\'\nonMounted(() => console.log(\'mounted\'))\nonUnmounted(() => console.log(\'gone\'))\n</script>',
        explanation: ['Both hooks are imported from vue.', 'They are called at the top level of setup, synchronously.', 'onMounted fires after DOM insert; onUnmounted after removal.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Start a 1-second ticking counter on mount and stop it cleanly on unmount.',
      hint: 'Store the interval id and clear it in onUnmounted.',
      solution: {
        lang: 'js',
        code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst ticks = ref(0)\nlet id = null\nonMounted(() => { id = setInterval(() => ticks.value++, 1000) })\nonUnmounted(() => clearInterval(id))\n</script>\n<template>{{ ticks }}</template>',
        explanation: [
          'The interval is created in onMounted so it only starts once the component is live.',
          'clearInterval in onUnmounted prevents the timer from running after removal.',
          'Updating the ref re-renders the count each second.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Predict the console order: parent has onMounted("P"), child has onMounted("C"). What logs first?',
      hint: 'Children must be in the DOM before the parent\'s DOM is complete.',
      solution: {
        lang: 'js',
        code: '// Parent <script setup>\nimport { onMounted } from \'vue\'\nonMounted(() => console.log(\'P mounted\'))\n// Child <script setup>\nimport { onMounted } from \'vue\'\nonMounted(() => console.log(\'C mounted\'))\n// Output: "C mounted" then "P mounted"',
        explanation: [
          'Vue mounts children before the parent, so child onMounted fires first.',
          'The parent\'s DOM is only complete once all children are inserted.',
          'On unmount the order is reversed at the lifecycle level: parent beforeUnmount runs first, then children unmount, then parent unmounted.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a useWindowSize() composable that tracks window width/height and cleans up its own listener.',
      hint: 'Register onMounted/onUnmounted inside the composable.',
      solution: {
        lang: 'js',
        code: 'import { ref, onMounted, onUnmounted } from \'vue\'\nexport function useWindowSize() {\n  const width = ref(window.innerWidth)\n  const height = ref(window.innerHeight)\n  const update = () => { width.value = window.innerWidth; height.value = window.innerHeight }\n  onMounted(() => window.addEventListener(\'resize\', update))\n  onUnmounted(() => window.removeEventListener(\'resize\', update))\n  return { width, height }\n}',
        explanation: [
          'The composable registers its OWN lifecycle hooks on the host component.',
          'onMounted attaches the resize listener; onUnmounted removes it — fully self-cleaning.',
          'Any number of components can use it, and each gets isolated width/height refs.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Lifecycle timing is fundamental to building real apps — fetching, integrating libraries, and cleaning up all depend on it. Mastering the Composition hooks shows you understand both the component lifecycle and the setup/currentInstance mechanics underneath.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to list the hooks and their order. Product companies (Zoho, Flipkart, Razorpay) ask where to fetch data, how to avoid leaks, and the parent/child order. FAANG-level interviews probe currentInstance, SSR hook behavior, KeepAlive activated/deactivated, and update-loop hazards.',
    whatInterviewersExpect:
      'They expect you to map Options to Composition hooks, know setup is the created stage, place fetch in onMounted and cleanup in onUnmounted, explain the synchronous-registration rule, and reason about parent/child order and SSR.',
  },
}

export default lifecycleHooksComposition
