import type { ConceptLesson } from '../../../types/lesson'

const templateRefs: ConceptLesson = {
  // 1. Concept Summary
  slug: 'template-refs',
  name: 'Template Refs',
  category: 'templates',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Template refs are the escape hatch to a real DOM element or child component instance when declarative bindings are not enough — focusing an input, measuring size, playing a video, integrating a non-Vue library.',
    'They are how you call imperative APIs (focus(), scrollIntoView(), a chart\'s redraw()) that have no declarative equivalent.',
    'In the Composition API the ref-variable-must-match-the-template-ref-name rule and the null-until-mounted timing are classic interview gotchas.',
    'Knowing when to reach for a ref versus staying declarative signals good judgment — overusing them fights the framework.',
    'They underpin integrations with canvas, maps, video players, and focus management / accessibility patterns.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A template ref is a name tag you put on one specific toy so you can grab exactly that toy later instead of all of them.',
    story: [
      'Imagine a toy box full of toys, and you usually just say "show me the red ones" — that is like normal Vue binding.',
      'But sometimes you need ONE exact toy — the blue robot in the corner — to press its button yourself.',
      'So you tie a little name tag on it that says "robot". Now you can reach in and say "give me robot" and grab exactly that one.',
      'A template ref is that name tag for a piece of your web page: you tag one element, and later your code can grab that exact element to do something special to it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Usually in Vue you describe what the page should look like and let Vue update it. But sometimes you need to touch one real element directly — to focus it, measure it, or scroll to it.',
    'A template ref lets you grab that element. You put ref="something" on it in the template and create a matching variable in your script.',
    'After the component is shown on screen (mounted), that variable points to the real element.',
    'Before mounting it is empty (null), so you wait until mounted to use it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A template ref is a direct reference to a rendered DOM element or child component instance, obtained by putting ref="name" in the template and reading a correspondingly-named ref variable (Composition API) or this.$refs.name (Options API).',
    how: 'In <script setup> you declare const el = ref(null) and add ref="el" to the element; the variable name must match the ref string. Vue assigns the element to el.value after mount (it is null before), and resets it on unmount. You access it in onMounted or later event handlers.',
    why: 'It gives imperative access for things bindings cannot do — focus, scroll, measurement, media control, and integrating third-party libraries that need a DOM node.',
    code: {
      label: 'Focusing an input on mount',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\n\nconst inputRef = ref(null)        // name must match ref="inputRef"\nonMounted(() => {\n  inputRef.value.focus()          // available only after mount\n})\n</script>\n\n<template>\n  <input ref="inputRef" placeholder="auto-focused" />\n</template>',
      explanation: [
        'const inputRef = ref(null) creates the holder; its name matches ref="inputRef".',
        'Vue fills inputRef.value with the DOM node after the component mounts.',
        'Inside onMounted the element exists, so .focus() works.',
        'Before mount inputRef.value is null — accessing it earlier would throw.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A template ref binds a rendered DOM element or component instance to a variable. In the Composition API with <script setup>, declaring a ref whose name equals the template ref string causes Vue to populate that ref\'s .value with the element/instance during mount and to null it on unmount; in the Options API it is exposed on this.$refs. The ref is null before mount and is updated synchronously after the DOM is patched (use onMounted, or a watcher/nextTick). On a child component, a template ref yields the component\'s public instance, which in <script setup> is restricted to whatever the child exposes via defineExpose. v-for on a ref collects the elements/instances into an array (Vue 3.5+ also supports a function ref).',

  // 7. Internal Working
  internalWorking: [
    'The compiler converts ref="name" into a ref binding on the vnode that tells the runtime to register this element/instance under that name.',
    'During patch, when the element is created and inserted, the runtime calls setRef, assigning the DOM node (or the component\'s exposed instance) into the matching ref.value (or this.$refs entry).',
    'Because assignment happens during the patch that mounts the node, the ref is only meaningful after mount — hence null in setup and populated by onMounted.',
    'On update, if the same ref stays bound to the same node, it is left in place; if the node is replaced or removed, setRef updates or nulls the ref accordingly.',
    'For v-for, setRef pushes each item into an array ref (or invokes the function ref per item), so order follows the rendered list.',
    'For component refs in <script setup>, the instance exposed is gated by defineExpose, so only intentionally public methods/state are reachable from the parent.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   template            runtime (during mount patch)        script
   <input             ┌──────────────────────────┐        const inputRef
     ref="inputRef" ──► setRef('inputRef', el) ───► inputRef.value = <input>
   />                 └──────────────────────────┘

   timeline:  setup() ──► inputRef.value = null
              mounted  ──► inputRef.value = real element  ✅ use here
              unmounted ─► inputRef.value = null

   child <Comp ref="c"/> → c.value = exposed instance (defineExpose only)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The ref variable is an ordinary reactive ref; its .value holds either null or a strong reference to the DOM node / component instance.',
    'Holding the element in .value keeps that node referenced; Vue nulls it on unmount so the node can be garbage collected once detached.',
    'For component refs, .value points at the exposed proxy, not the full internal instance, limiting what the parent can reach.',
    'v-for array refs hold one entry per rendered item; the array is replaced as the list changes, releasing old element references.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — measure an element after mount',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst boxRef = ref(null)\nconst width = ref(0)\nonMounted(() => {\n  width.value = boxRef.value.offsetWidth\n})\n</script>\n\n<template>\n  <div ref="boxRef" class="box">Measured box</div>\n  <p>Width: {{ width }}px</p>\n</template>',
      explanation: [
        'boxRef is null until mount, then holds the real <div>.',
        'onMounted is the earliest safe place to read layout like offsetWidth.',
        'Measurement (offsetWidth/getBoundingClientRect) has no declarative equivalent, so a ref is appropriate.',
        'The variable name matches the ref string exactly.',
      ],
    },
    intermediate: {
      label: 'Intermediate — ref inside v-for collects an array',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst items = ref([\'a\', \'b\', \'c\'])\nconst itemRefs = ref([])     // will become an array of elements\nonMounted(() => {\n  console.log(itemRefs.value.length) // 3\n})\n</script>\n\n<template>\n  <li v-for="item in items" :key="item" ref="itemRefs">{{ item }}</li>\n</template>',
      explanation: [
        'When ref is used inside v-for, Vue collects all elements into the array ref.',
        'The order matches the rendered list order.',
        'Do not assume order before mount; read it in onMounted.',
        'Vue 3.5+ also allows a function ref for finer control per item.',
      ],
    },
    advanced: {
      label: 'Advanced — child component ref with defineExpose',
      lang: 'vue',
      code: '<!-- VideoPlayer.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst el = ref(null)\nfunction play() { el.value.play() }\nfunction pause() { el.value.pause() }\ndefineExpose({ play, pause })   // only these are reachable by parent\n</script>\n<template><video ref="el" src="/clip.mp4" /></template>\n\n<!-- Parent.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport VideoPlayer from \'./VideoPlayer.vue\'\nconst player = ref(null)\nfunction start() { player.value.play() }\n</script>\n<template>\n  <VideoPlayer ref="player" />\n  <button @click="start">Play</button>\n</template>',
      explanation: [
        'A ref on a child component yields its public instance, restricted to what defineExpose lists.',
        'The parent can call player.value.play() but cannot reach el or other internals.',
        'This keeps the component\'s encapsulation intact while exposing a deliberate imperative API.',
        'Without defineExpose, a <script setup> child exposes nothing to the parent ref.',
      ],
    },
    realProject: {
      label: 'Real project — integrating a chart library',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nimport Chart from \'chart.js/auto\'\n\nconst canvasRef = ref(null)\nlet chart = null\nonMounted(() => {\n  chart = new Chart(canvasRef.value, {\n    type: \'bar\',\n    data: { labels: [\'A\', \'B\'], datasets: [{ data: [3, 7] }] },\n  })\n})\nonUnmounted(() => chart?.destroy())\n</script>\n\n<template>\n  <canvas ref="canvasRef"></canvas>\n</template>',
      explanation: [
        'A canvas-based library needs the real DOM node, obtained via the template ref.',
        'Initialization happens in onMounted when the canvas exists.',
        'The chart instance is destroyed in onUnmounted to free resources and listeners.',
        'This element-handoff pattern is how most third-party libraries integrate with Vue.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a template ref and why use one?',
      answer: 'It is a direct reference to a rendered DOM element or child component instance, used for imperative actions bindings can\'t do — focus, scroll, measure, control media, or integrate third-party libraries.',
      explanation: 'A good answer frames it as an escape hatch, not the default tool.',
    },
    {
      level: 'beginner',
      question: 'In the Composition API, how do you set up a template ref?',
      answer: 'Declare const el = ref(null) and add ref="el" in the template; the variable name must match the ref string. Vue assigns the element to el.value after mount.',
      explanation: 'The name-matching requirement is the key mechanical detail.',
    },
    {
      level: 'intermediate',
      question: 'Why is a template ref null in setup and when is it populated?',
      answer: 'setup runs before the DOM exists, so the ref is null. Vue assigns the element during the mount patch, so it is available in onMounted (or via a watcher/nextTick after render).',
      explanation: 'The timing/lifecycle answer is a classic gotcha; mentioning onMounted shows correct usage.',
    },
    {
      level: 'intermediate',
      question: 'How do you get a ref to a child component, and what can you access on it?',
      answer: 'Put ref on the component; el.value becomes the child\'s public instance. In <script setup>, only members listed in defineExpose are accessible — everything else is private.',
      explanation: 'Knowing defineExpose gates access is a Vue 3 specific and frequently tested.',
    },
    {
      level: 'advanced',
      question: 'How do refs behave inside v-for?',
      answer: 'Using ref inside v-for collects the elements/instances into an array (in render order). Order is reliable only after mount. Vue 3.5+ also supports function refs for per-item control.',
      explanation: 'Tests the array-collection behavior and the timing caveat.',
    },
    {
      level: 'senior',
      question: 'When should you avoid template refs, and what is the cost of overusing them?',
      answer: 'Avoid them for anything achievable declaratively (visibility, classes, content) — overuse leads to imperative code that fights Vue\'s reactivity, is harder to test, and can desync state from the DOM. Reserve them for genuine imperative needs and clean up any resources you create on the referenced element.',
      explanation: 'Demonstrates judgment: refs are a deliberate escape hatch, not a default.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why must the ref variable name match the template ref string in <script setup>?',
    'What is defineExpose and why does it matter for component refs?',
    'How do you access a ref created inside v-for?',
    'How is this different from refs in the Options API ($refs)?',
    'When is the ref guaranteed to be populated?',
    'What is a function ref and when is it useful?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Accessing the ref in setup (before mount), getting null and a crash.',
      why: 'The DOM does not exist during setup, so .value is null.',
      fix: 'Read the ref in onMounted, or in a watcher / after nextTick once the element is rendered.',
    },
    {
      mistake: 'Mismatching the ref variable name and the template ref string in <script setup>.',
      why: 'Vue links them by name; a mismatch leaves the variable null.',
      fix: 'Ensure const xxx = ref(null) exactly matches ref="xxx".',
    },
    {
      mistake: 'Expecting to call a child component\'s method that is not exposed.',
      why: 'In <script setup> the child exposes nothing unless it uses defineExpose, so the parent ref has no such method.',
      fix: 'Add defineExpose({ method }) in the child for the intended public API.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Autofocus on form open, scrollIntoView on validation error, measuring elements for layout, and managing focus for accessibility all use template refs.' },
    { area: 'Component library', detail: 'Components expose imperative methods (focus(), open(), validate()) via defineExpose so parents can drive them through a component ref.' },
    { area: 'Third-party integration', detail: 'Charting (Chart.js/ECharts), maps (Leaflet/Mapbox), video players, and editors (CodeMirror/Monaco) are initialized on a canvas/div obtained via a template ref.' },
    { area: 'VueUse', detail: 'Composables like useElementSize, useIntersectionObserver, and useFocus take a template ref as their target element.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Refs add negligible overhead — a single assignment during the mount patch.',
      'Direct measurement/imperative calls via a ref avoid round-trips through reactive state when one-off.',
    ],
    bad: [
      'Reading layout (offsetWidth/getBoundingClientRect) on a ref forces synchronous reflow; doing it repeatedly causes layout thrash.',
      'Imperative DOM mutation via refs can desync from Vue\'s reactive model, causing extra patches or bugs.',
    ],
    optimizations: [
      'Batch layout reads and avoid interleaving reads/writes to prevent reflow thrash.',
      'Use ResizeObserver/IntersectionObserver (via a ref) instead of polling sizes.',
      'Prefer declarative bindings whenever possible; use refs only for genuine imperative needs.',
      'Destroy third-party instances created on a ref in onUnmounted.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'lifecycle-hooks-composition', 'components-basics'],
    nextConcepts: ['custom-directives', 'nexttick', 'composables', 'component-events'],
    dependencyNote:
      'Template refs build on ref and the mount lifecycle; they pair with nextTick for post-update DOM access and with defineExpose for component instances, and for reusable element behavior they complement custom-directives and composables.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write const inputRef = ref(null) and ref="inputRef" on an input, stressing the name match.',
      'Draw the timeline: setup (null) → mounted (real element) → unmounted (null).',
      'Show onMounted as the safe place to call inputRef.value.focus().',
      'Show a child component ref yielding only defineExpose-d members.',
      'Conclude: refs are the imperative escape hatch — available after mount, used sparingly.',
    ],
    diagram: `  ref="inputRef"  ⇄  const inputRef = ref(null)   (names MUST match)

  setup     → inputRef.value = null
  mounted   → inputRef.value = <input>   ← use it here
  unmounted → inputRef.value = null

  <Child ref="c"/> → c.value = defineExpose-d API only`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A template ref gives imperative access to a real DOM element or child component instance. In <script setup>, declare const el = ref(null) and add ref="el" — names must match. It is null in setup and populated after mount, so use it in onMounted. A ref on a child yields only what the child exposes via defineExpose. Inside v-for, refs collect into an array. Use refs for focus/scroll/measure/3rd-party libs only — stay declarative otherwise, and clean up resources in onUnmounted.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A template ref is Vue\'s escape hatch to a real DOM element or a child component instance, for the cases declarative bindings can\'t handle — focusing an input, scrolling to an error, measuring an element, controlling a video, or initializing a third-party library like a chart or map. In the Composition API with script setup, you declare const inputRef = ref(null) and put ref="inputRef" on the element; the variable name must match the ref string, and Vue links them. The critical timing detail is that the ref is null during setup, because the DOM doesn\'t exist yet, and Vue assigns the real element during the mount patch — so the earliest safe place to use it is onMounted, or after nextTick once the element has rendered. On unmount Vue resets it to null. When you put a ref on a child component, value becomes the child\'s public instance, but in script setup the child is closed by default: the parent can only reach members the child intentionally publishes with defineExpose, which preserves encapsulation. Inside a v-for, using ref collects all the elements or instances into an array in render order, and Vue 3.5 also supports function refs for per-item control. The judgment part interviewers care about: template refs are a deliberate escape hatch, not the default. If something can be done declaratively — toggling a class, showing content, binding a value — do that instead, because imperative DOM code fights Vue\'s reactivity and is harder to test. And anything you create on a referenced element — a chart instance, an observer, a listener — must be cleaned up in onUnmounted.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Refs unlock imperative APIs but bypass reactivity; over-reliance creates state that the DOM, not Vue, owns — harder to reason about and test.',
      'Exposing component methods via defineExpose enables imperative control but couples parent and child; an event/prop-driven API is often more declarative.',
    ],
    edgeCases: [
      'Refs are null in setup; reading layout too early (before mount/nextTick) yields stale or missing values.',
      'Conditional elements (v-if) have a ref that is null while hidden and populated when shown — guard for null.',
      'v-for refs order is only reliable post-mount; mutating the list mid-flight can momentarily desync.',
      'In <script setup>, a child with no defineExpose gives the parent an effectively empty instance.',
    ],
    runtimeBehavior: [
      'setRef runs during patch when the node mounts/updates/unmounts, keeping the ref in sync with the DOM.',
      'Component refs resolve to the exposed proxy, not the raw internal instance.',
      'Reading layout properties forces synchronous reflow; interleaving reads and writes causes thrash.',
    ],
    scalability: [
      'Prefer observer-based approaches (Resize/Intersection) over per-frame ref measurement at scale.',
      'Centralize third-party lifecycle (init in mounted, destroy in unmounted) to avoid leaks across many instances.',
    ],
    productionConcerns: [
      'Null-ref crashes from premature access are common; always guard or read in onMounted.',
      'Leaked third-party instances/observers created on refs are a frequent memory-leak source.',
      'Layout thrash from repeated synchronous measurement degrades scroll/animation performance.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Template ref = direct handle to a DOM element or child instance.',
    'Setup: const el = ref(null) + ref="el" (names MUST match).',
    'null in setup → populated after mount → null on unmount.',
    'Use it in onMounted (or after nextTick).',
    'Child ref = public instance; gated by defineExpose in <script setup>.',
    'ref inside v-for → collects an array (render order).',
    'Vue 3.5+ supports function refs.',
    'Options API equivalent: this.$refs.name.',
    'Use for focus/scroll/measure/media/3rd-party libs only.',
    'Stay declarative otherwise; refs fight reactivity if overused.',
    'Clean up observers/instances created on the element in onUnmounted.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Auto-focus a text input when the component mounts using a template ref.',
      hint: 'Declare a ref, match the name, focus in onMounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst inputRef = ref(null)\nonMounted(() => inputRef.value.focus())\n</script>\n\n<template>\n  <input ref="inputRef" />\n</template>',
        explanation: [
          'inputRef is null until mount; onMounted is the safe place to use it.',
          'The variable name matches ref="inputRef".',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Scroll a target element into view when a button is clicked.',
      hint: 'Store a ref on the target and call scrollIntoView in the handler.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst targetRef = ref(null)\nfunction goToTarget() {\n  targetRef.value.scrollIntoView({ behavior: \'smooth\' })\n}\n</script>\n\n<template>\n  <button @click="goToTarget">Scroll down</button>\n  <div style="height: 1200px"></div>\n  <div ref="targetRef">Target</div>\n</template>',
        explanation: [
          'The ref gives the real element so scrollIntoView (an imperative DOM API) can be called.',
          'By click time the element is mounted, so targetRef.value is populated.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a child component exposing a focus() method, and have the parent call it via a component ref.',
      hint: 'Use defineExpose in the child and a component ref in the parent.',
      solution: {
        lang: 'vue',
        code: '<!-- TextField.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst input = ref(null)\nfunction focus() { input.value.focus() }\ndefineExpose({ focus })\n</script>\n<template><input ref="input" /></template>\n\n<!-- Parent.vue -->\n<script setup>\nimport { ref } from \'vue\'\nimport TextField from \'./TextField.vue\'\nconst field = ref(null)\nfunction focusField() { field.value.focus() }\n</script>\n<template>\n  <TextField ref="field" />\n  <button @click="focusField">Focus field</button>\n</template>',
        explanation: [
          'The child publishes focus() via defineExpose, making it the only public method.',
          'The parent\'s component ref (field) can call field.value.focus() but cannot touch the child\'s input ref directly.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Initialize a third-party chart on a canvas via a template ref and destroy it on unmount. Explain the lifecycle timing.',
      hint: 'Create in onMounted, destroy in onUnmounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nimport Chart from \'chart.js/auto\'\nconst canvasRef = ref(null)\nlet chart = null\nonMounted(() => {\n  chart = new Chart(canvasRef.value, {\n    type: \'line\',\n    data: { labels: [\'Mon\', \'Tue\'], datasets: [{ data: [1, 4] }] },\n  })\n})\nonUnmounted(() => chart?.destroy())\n</script>\n\n<template>\n  <canvas ref="canvasRef"></canvas>\n</template>',
        explanation: [
          'The chart library needs the real canvas node, available only after mount, so init happens in onMounted.',
          'canvasRef.value is null during setup, which is why initialization cannot run there.',
          'onUnmounted destroys the chart to release its listeners/observers and prevent a memory leak.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Template refs separate developers who only know declarative Vue from those who can integrate the real world — third-party libs, focus management, measurement. They also test your grasp of the mount lifecycle and encapsulation.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how do you focus an input" and "what is $refs". Product companies (Zoho, Flipkart, Razorpay) ask about the null-until-mounted timing, defineExpose, and refs in v-for. FAANG-level rounds probe when NOT to use refs, layout thrash, and clean lifecycle management of integrations.',
    whatInterviewersExpect:
      'Set up a ref correctly (matching names), explain the null-until-mounted timing and onMounted usage, know defineExpose for component refs and array refs in v-for, and show judgment that refs are an imperative escape hatch used sparingly with proper cleanup.',
  },
}

export default templateRefs
