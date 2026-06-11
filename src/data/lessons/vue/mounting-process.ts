import type { ConceptLesson } from '../../../types/lesson'

const mountingProcess: ConceptLesson = {
  // 1. Concept Summary
  slug: 'mounting-process',
  name: 'Mounting Process',
  category: 'lifecycle-rendering',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Mounting is the moment your component goes from a description (template/render function) to real DOM nodes on the page — understanding it tells you exactly WHEN your data is ready and the DOM exists.',
    'Almost every "my ref is null" or "my chart renders blank" bug comes from running DOM code before mounting finishes.',
    'It explains why onMounted exists, why template refs are null in setup(), and why you call third-party libraries (charts, maps, editors) in onMounted.',
    'Interviewers use it to test whether you understand the difference between the reactive setup phase and the DOM-commit phase.',
    'Knowing the mount sequence is the basis for SSR hydration, Suspense, and async component behavior later on.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Mounting is like building a LEGO model from the instruction booklet and finally placing it on the shelf.',
    story: [
      'Imagine you have an instruction booklet that says exactly which LEGO bricks to use and where they go. The booklet is not the model — it is just the plan.',
      'First you read the whole booklet and gather all your bricks on the table. Nothing is on the shelf yet.',
      'Then you snap all the bricks together following the plan, and only at the very end do you carefully place the finished model onto the shelf where everyone can see it.',
      'A Vue component works the same way: the template is the booklet, Vue gathers the data and builds the pieces in memory first, and "mounting" is the moment it places the finished result onto the real page.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue component is first described in code (a template plus some data). That description is not yet anything you can see on the screen.',
    'Before showing anything, Vue runs your setup code so all the data and functions are ready.',
    'Then Vue turns the template into a tree of fake DOM nodes in memory, and from that it creates the real HTML elements.',
    'Mounting is the final step where Vue inserts those real elements into the page so the user can see and interact with them — after this, onMounted runs.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Mounting is the lifecycle phase where Vue takes a component instance and inserts its rendered DOM into a real container element on the page for the first time.',
    how: 'You call createApp(Component).mount("#app"). Vue runs setup(), creates the render effect, produces a virtual DOM tree, turns it into real DOM nodes, and appends them into the target element. onBeforeMount runs just before the DOM is created; onMounted runs right after it is inserted.',
    why: 'Until mounting completes, there is no real DOM, so template refs are null and you cannot measure or manipulate elements. onMounted is your safe signal that the DOM exists.',
    code: {
      label: 'Watching the mount happen',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onBeforeMount, onMounted } from \'vue\'\n\nconst box = ref(null)\n\nonBeforeMount(() => {\n  console.log(\'before mount, box is:\', box.value) // null — no DOM yet\n})\n\nonMounted(() => {\n  console.log(\'mounted, box is:\', box.value)       // the real <div> element\n  box.value.focus?.()\n})\n</script>\n\n<template>\n  <div ref="box">Hello</div>\n</template>',
      explanation: [
        'During setup the template ref `box` is still null because the DOM has not been created yet.',
        'onBeforeMount fires after setup but before the DOM nodes are inserted.',
        'onMounted fires after the real <div> is in the page, so `box.value` is now the actual element.',
        'This is exactly why DOM measurements and third-party widget init go in onMounted.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Mounting is the phase in which Vue creates a component instance, runs its setup/render logic, and produces and inserts the real DOM for that component into a container for the first time. Internally the app render function wraps the component render in a reactive effect (the "render effect"); the effect runs to produce a vnode tree, the patch algorithm creates real DOM nodes from those vnodes, and they are inserted into the host element. The beforeMount hook fires just before DOM creation and the mounted hook fires after the subtree (including child components) is inserted.',

  // 7. Internal Working
  internalWorking: [
    'createApp(RootComponent) builds an app instance with its own context (config, plugins, provides); .mount(container) kicks off the process against the resolved DOM element.',
    'Vue creates the root component instance, then runs setup() (for Composition API) so all refs, reactive state, computed, and lifecycle registrations are established before any rendering.',
    'Vue creates a reactive render effect (ReactiveEffect) whose job is to call the component render function; running it the first time produces the initial vnode (virtual DOM) tree and tracks every reactive dependency read during render.',
    'beforeMount runs, then the patch function walks the vnode tree and, since there is no previous tree, takes the mount path: it creates real DOM elements/text nodes (createElement, createText), sets props/attrs/listeners, and recursively mounts child components.',
    'The freshly created subtree is inserted into the container element via the host insert operation, making it visible in the live document.',
    'mounted hooks fire bottom-up (children before parents) once the whole subtree is in the DOM; the component instance is now marked isMounted, and future reactive changes go through the update (patch-against-previous) path instead.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  createApp(App).mount('#app')
        │
        ▼
  ┌─────────────────────┐
  │ create instance     │  setup() runs → refs/reactive/computed ready
  └─────────┬───────────┘
            ▼
  ┌─────────────────────┐
  │ render effect runs  │  render() → VNODE TREE (in memory)
  └─────────┬───────────┘        (tracks reactive deps)
            ▼   beforeMount()
  ┌─────────────────────┐
  │ patch (mount path)  │  vnodes → REAL DOM nodes (createElement...)
  └─────────┬───────────┘
            ▼
  ┌─────────────────────┐
  │ insert into #app    │  DOM now visible
  └─────────┬───────────┘
            ▼   mounted()  (children first, then parent)
       template refs are now real elements`,

  // 9. Memory Visualization — omitted (not memory-graph relevant)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — mounting an app',
      lang: 'js',
      code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\napp.mount(\'#app\') // finds <div id="app"> and inserts App\'s DOM into it',
      explanation: [
        'createApp returns an application instance you can configure (use plugins, register components) before mounting.',
        '.mount("#app") resolves the selector, runs the root component, and inserts its DOM.',
        'Before this line nothing of your app is in the page; after it, the root component is mounted.',
      ],
    },
    intermediate: {
      label: 'Intermediate — DOM access only after mount',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\n\nconst input = ref(null)\nconst width = ref(0)\n\nonMounted(() => {\n  input.value.focus()                 // safe: element exists\n  width.value = input.value.offsetWidth // measuring needs real DOM\n})\n</script>\n\n<template>\n  <input ref="input" placeholder="Auto-focused" />\n  <p>Width: {{ width }}px</p>\n</template>',
      explanation: [
        'The template ref `input` is null during setup and becomes the real element by onMounted.',
        'Auto-focusing and measuring offsetWidth both require the element to be in the DOM.',
        'Doing this in setup() directly would throw because input.value is still null.',
        'This is the single most common real use of the mounting hook.',
      ],
    },
    advanced: {
      label: 'Advanced — mounted order is bottom-up',
      lang: 'vue',
      code: '<!-- Parent.vue -->\n<script setup>\nimport { onMounted } from \'vue\'\nimport Child from \'./Child.vue\'\nonMounted(() => console.log(\'parent mounted\'))\n</script>\n<template><Child /></template>\n\n<!-- Child.vue -->\n<script setup>\nimport { onMounted } from \'vue\'\nonMounted(() => console.log(\'child mounted\'))\n</script>\n<template><span>child</span></template>\n\n// Console order: "child mounted" then "parent mounted"',
      explanation: [
        'A parent cannot be fully mounted until its children are mounted, so children mount first.',
        'mounted hooks therefore fire bottom-up: deepest child to root.',
        'beforeMount, by contrast, fires top-down (parent before child) because parents start rendering first.',
        'Knowing this order prevents bugs where a parent assumes a child has already measured something.',
      ],
    },
    realProject: {
      label: 'Real project — initializing a chart library after mount',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted, onBeforeUnmount } from \'vue\'\nimport Chart from \'chart.js/auto\'\n\nconst canvas = ref(null)\nlet chart = null\n\nonMounted(() => {\n  // canvas element guaranteed to exist now\n  chart = new Chart(canvas.value, {\n    type: \'bar\',\n    data: { labels: [\'A\', \'B\'], datasets: [{ data: [3, 7] }] },\n  })\n})\n\nonBeforeUnmount(() => chart?.destroy())\n</script>\n\n<template>\n  <canvas ref="canvas" />\n</template>',
      explanation: [
        'Chart.js needs a real <canvas> element, which only exists after mounting — so init goes in onMounted.',
        'Initializing in setup() would fail because canvas.value is null.',
        'We pair it with onBeforeUnmount to destroy the chart and avoid leaks when the component is removed.',
        'This exact pattern (init in onMounted, cleanup in onBeforeUnmount) covers maps, editors, and DOM widgets.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does mounting mean in Vue?',
      answer: 'Mounting is the phase where Vue turns a component description into real DOM nodes and inserts them into the page for the first time. After it, the component is visible and onMounted fires.',
      explanation: 'A good answer separates "describing" the component (template/setup) from "committing" it to the real DOM.',
    },
    {
      level: 'beginner',
      question: 'Why is a template ref null inside setup() but available in onMounted?',
      answer: 'setup() runs before any DOM is created, so the ref has nothing to point to yet. By the time onMounted fires, Vue has created and inserted the real elements, so the ref now holds the actual DOM node.',
      explanation: 'This tests whether the candidate understands the order: setup → render → create DOM → insert → mounted.',
    },
    {
      level: 'intermediate',
      question: 'In what order do beforeMount and mounted fire for nested components?',
      answer: 'beforeMount fires top-down (parent then child) as rendering descends; mounted fires bottom-up (child then parent) because a parent is only mounted once its children are.',
      explanation: 'Senior signal: explaining WHY — parents start rendering first but finish last.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between mounting and updating?',
      answer: 'Mounting is the FIRST render that creates DOM from scratch (no previous tree). Updating is every subsequent render where Vue patches the new vnode tree against the previous one to apply minimal DOM changes.',
      explanation: 'Mentioning that the patch function takes a "mount" path when there is no old vnode shows real internals knowledge.',
    },
    {
      level: 'advanced',
      question: 'How does the render effect relate to mounting?',
      answer: 'Vue wraps the component render in a reactive effect. Its first run during mount produces the initial vnode tree and tracks all reactive dependencies. After mount, when those dependencies change, the same effect re-runs and triggers the update path instead of remounting.',
      explanation: 'This links mounting to the reactivity system and explains why reactivity "just works" after the first render.',
    },
    {
      level: 'senior',
      question: 'How does mounting differ in SSR/hydration scenarios?',
      answer: 'In SSR the server renders HTML as a string (no real DOM created on the server). On the client, instead of creating new DOM, Vue hydrates: it walks the existing server-rendered DOM, attaches the reactive effects and event listeners, and reuses the nodes rather than recreating them. Mismatches between server and client output cause hydration errors.',
      explanation: 'Connecting client mounting to the hydration variant is a strong senior/SSR signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between onBeforeMount and onMounted?',
    'Why should DOM-dependent code (focus, measure, chart init) live in onMounted?',
    'What happens to the render effect after the component is mounted?',
    'How is unmounting the reverse of mounting, and what cleanup happens?',
    'How do async components and Suspense affect when mounting completes?',
    'Why does createApp return an instance you configure before calling .mount?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Accessing a template ref or measuring the DOM inside setup().',
      why: 'No DOM exists yet during setup, so the ref is null and measurements throw or return 0.',
      fix: 'Move DOM-dependent code into onMounted, where the elements are guaranteed to exist.',
    },
    {
      mistake: 'Initializing third-party libraries (charts, maps, editors) too early.',
      why: 'These libraries need a real element; creating them before mount fails silently or errors.',
      fix: 'Initialize in onMounted and destroy in onBeforeUnmount to avoid leaks.',
    },
    {
      mistake: 'Assuming a parent is fully mounted before its children.',
      why: 'mounted fires bottom-up; the parent mounts last, so a parent onMounted runs after all children.',
      fix: 'Rely on the documented order, or coordinate via events/provide-inject rather than guessing.',
    },
    {
      mistake: 'Calling .mount() multiple times or mounting into a non-existent selector.',
      why: 'A second mount of the same app is ignored, and an invalid selector resolves to null, producing a blank app.',
      fix: 'Mount once into a known container and verify the element exists in index.html.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every app starts with createApp(App).mount("#app"); onMounted is the standard place for DOM measurement, focus management, and starting timers/observers.' },
    { area: 'Component library', detail: 'UI libraries init tooltips, popovers, and resize observers in onMounted and tear them down in onBeforeUnmount; mount order matters for portals/overlays.' },
    { area: 'SSR', detail: 'Nuxt/SSR replaces client-side mounting with hydration of server-rendered HTML; understanding the mount-vs-hydrate distinction is essential for fixing hydration mismatches.' },
    { area: 'Component library', detail: 'Chart/map/editor wrappers (Chart.js, Leaflet, CodeMirror) consistently initialize the underlying instance in onMounted because they require a live DOM node.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Mounting only creates DOM once; subsequent reactive changes use the cheaper patch/update path.',
      'Deferring heavy DOM work to onMounted keeps setup() fast and avoids blocking the initial render.',
    ],
    bad: [
      'Doing expensive synchronous work in onMounted (large loops, big chart datasets) blocks first paint and feels janky.',
      'Mounting very large component trees at once increases initial DOM creation cost.',
    ],
    optimizations: [
      'Lazy-load and async-mount heavy components so they mount only when needed (defineAsyncComponent + Suspense).',
      'Use v-if to delay mounting of off-screen or rarely used subtrees.',
      'Move non-critical onMounted work into requestIdleCallback or a microtask to unblock first paint.',
      'Virtualize long lists so only visible rows are mounted at a time.',
    ],
  },

  // 16. Security — omitted (no specific angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['lifecycle-hooks', 'virtual-dom', 'reactivity-fundamentals'],
    nextConcepts: ['lifecycle-hooks-composition', 'nexttick', 'ssr-hydration', 'suspense'],
    dependencyNote:
      'Mounting builds on the lifecycle model and the virtual DOM: you need to know what a vnode tree is and how the render effect runs. It then leads into the Composition lifecycle hooks, nextTick (DOM-update timing), and the SSR hydration variant of mounting.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write createApp(App).mount("#app") at the top as the trigger.',
      'Draw an arrow down to "setup() runs" and note refs/reactive are ready but DOM is null.',
      'Next box: "render effect → vnode tree (in memory)"; mark beforeMount here.',
      'Next box: "patch mount path → real DOM nodes"; then "insert into #app".',
      'Final box: "mounted() fires (children first)"; say template refs are now real elements and this is where DOM code belongs.',
    ],
    diagram: `  mount('#app')
     │ setup() (state ready, DOM null)
     ▼
  render() ──► vnode tree   [beforeMount]
     │
     ▼ patch (mount)
  real DOM ──► insert into #app
     │
     ▼ [mounted]  refs are real, child→parent order`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Mounting is when Vue turns a component into real DOM and inserts it into the page for the first time. The flow is: create instance, run setup, run the render effect to build a vnode tree, patch that into real DOM nodes (beforeMount), insert them into the container, then fire mounted. Template refs are null until mounted, which is why DOM measurement, focus, and third-party library init all go in onMounted. mounted fires bottom-up (children before parents). After mounting, reactive changes use the update/patch path instead of remounting.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Mounting is the lifecycle phase where Vue commits a component to the real DOM for the first time. It starts when you call createApp(App).mount("#app"). Vue creates the root component instance and runs setup, so all your refs, reactive state, and computed values are ready — but at this point there is no DOM yet. Then Vue wraps the render function in a reactive effect and runs it once; that first run produces a virtual DOM tree and, importantly, tracks every reactive value the render reads. The beforeMount hook fires here. Next the patch function takes the mount path — since there is no previous tree, it creates real DOM elements and text nodes from the vnodes, sets attributes and listeners, and recursively mounts child components. Those nodes are then inserted into the container, making them visible. Finally the mounted hooks fire, and they fire bottom-up — children before parents — because a parent is only considered mounted once its children are. This is why template refs are null in setup but real elements in onMounted, and why we init charts, maps, and editors there. After mounting, the same render effect re-runs on reactive changes, but now it takes the update path: it diffs the new tree against the old one and patches minimal DOM changes instead of recreating everything. In SSR the client variant is hydration, where Vue reuses server-rendered DOM instead of creating new nodes.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Eager mounting gives instant interactivity but a heavier initial render; lazy/async mounting improves first paint at the cost of loading spinners and layout shift.',
      'Doing setup work in onMounted guarantees DOM availability but runs after first paint; doing it earlier risks null DOM. You trade timing safety against immediacy.',
    ],
    edgeCases: [
      'Template refs are null in setup and during the synchronous part of the first render; only safe in onMounted (or via watch on the ref).',
      'mounted does NOT guarantee child async components are resolved unless wrapped in Suspense.',
      'Mounting into an element that itself gets removed (e.g. a modal container) can leave a detached instance if not unmounted.',
      'Re-mounting via key changes destroys and recreates the instance, re-running setup and onMounted (useful but expensive).',
    ],
    runtimeBehavior: [
      'The render effect tracks dependencies during the first (mount) run; only values actually read are tracked.',
      'beforeMount is top-down, mounted is bottom-up across the component tree.',
      'After mount, isMounted is set and subsequent runs use the patch-against-previous algorithm.',
    ],
    scalability: [
      'Mounting thousands of nodes synchronously blocks the main thread; virtualization and pagination keep the mounted node count bounded.',
      'Async components and route-level code splitting spread mounting cost over time and reduce the initial bundle.',
    ],
    productionConcerns: [
      'Forgetting cleanup of things started in onMounted (timers, observers, library instances) causes leaks across mount/unmount cycles.',
      'SSR hydration mismatches surface as console warnings and broken interactivity — keep server and client render output identical.',
      'Layout shift from late-mounting content hurts CLS; reserve space or use skeletons.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Mounting = first time a component becomes real DOM on the page.',
    'Flow: instance → setup() → render effect → vnode tree → patch (mount) → insert → mounted.',
    'setup() runs BEFORE any DOM exists; template refs are null there.',
    'onBeforeMount: DOM not created yet. onMounted: DOM exists, refs are real.',
    'mounted fires bottom-up (children before parents); beforeMount top-down.',
    'DOM code — focus, measure, chart/map/editor init — belongs in onMounted.',
    'Pair onMounted init with onBeforeUnmount cleanup to avoid leaks.',
    'After mount, changes use the update/patch path, not remount.',
    'createApp(App).mount("#app") — configure the app before mounting.',
    'SSR replaces mounting with hydration (reuse server DOM, attach effects).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Auto-focus an input element as soon as the component appears on screen.',
      hint: 'Use a template ref and onMounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst input = ref(null)\nonMounted(() => input.value.focus())\n</script>\n<template>\n  <input ref="input" />\n</template>',
        explanation: [
          'The ref is null during setup and becomes the real element by onMounted.',
          'Calling focus() in onMounted guarantees the element is in the DOM.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Log "before" and "after" so it proves the DOM does not exist before mount but does after.',
      hint: 'Use onBeforeMount and onMounted with a template ref.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onBeforeMount, onMounted } from \'vue\'\nconst el = ref(null)\nonBeforeMount(() => console.log(\'before:\', el.value)) // null\nonMounted(() => console.log(\'after:\', el.value))       // <div>\n</script>\n<template>\n  <div ref="el">hi</div>\n</template>',
        explanation: [
          'onBeforeMount logs null because the DOM has not been created.',
          'onMounted logs the real element because it now exists in the page.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Prove the mounted order is bottom-up by logging from a parent and its child.',
      hint: 'Add onMounted logs in both components and observe the console.',
      solution: {
        lang: 'vue',
        code: '<!-- Child.vue -->\n<script setup>\nimport { onMounted } from \'vue\'\nonMounted(() => console.log(\'child\'))\n</script>\n<template><span>c</span></template>\n\n<!-- Parent.vue -->\n<script setup>\nimport { onMounted } from \'vue\'\nimport Child from \'./Child.vue\'\nonMounted(() => console.log(\'parent\'))\n</script>\n<template><Child /></template>\n\n// Output: child, then parent',
        explanation: [
          'The child must mount before the parent can be considered mounted.',
          'So the console prints "child" then "parent", proving the bottom-up order.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Wrap a third-party library that needs a DOM node so it initializes after mount and cleans up on unmount. Use a fake "Widget" class.',
      hint: 'Init in onMounted, store the instance in a non-reactive variable, destroy in onBeforeUnmount.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted, onBeforeUnmount } from \'vue\'\n\nclass Widget {\n  constructor(el) { this.el = el; el.textContent = \'ready\' }\n  destroy() { this.el.textContent = \'\' }\n}\n\nconst host = ref(null)\nlet widget = null\n\nonMounted(() => { widget = new Widget(host.value) })\nonBeforeUnmount(() => widget?.destroy())\n</script>\n<template>\n  <div ref="host" />\n</template>',
        explanation: [
          'The widget needs a live element, so it is created in onMounted where host.value is real.',
          'The instance is held in a plain (non-reactive) let to avoid unnecessary reactivity.',
          'onBeforeUnmount destroys it, preventing leaks across mount/unmount cycles.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Mounting is the bridge between Vue\'s reactive data world and the real DOM. Once you understand it, lifecycle hooks, template refs, third-party integration, and even SSR hydration all click into place — and a whole class of "my element is null" bugs disappears.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what onMounted is for and why refs are null in setup. Product companies (Zoho, Flipkart, Razorpay) ask the full mount sequence and the parent/child hook order. FAANG-level interviews probe the render effect, the mount-vs-update patch path, and how hydration differs from mounting.',
    whatInterviewersExpect:
      'They expect you to describe the ordered flow (setup → render → DOM → insert → mounted), explain why DOM code goes in onMounted, state the bottom-up mounted order, and ideally connect mounting to the reactivity render effect and to SSR hydration.',
  },
}

export default mountingProcess
