import type { ConceptLesson } from '../../../types/lesson'

const customDirectives: ConceptLesson = {
  // 1. Concept Summary
  slug: 'custom-directives',
  name: 'Custom Directives',
  category: 'templates',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Custom directives give you direct, reusable access to a DOM element\'s lifecycle — perfect for low-level behaviors like autofocus, click-outside, lazy-loading images, or tooltips.',
    'They are the right tool when logic is purely about an element\'s DOM (not its data/state), where a component would be overkill.',
    'They expose Vue\'s element lifecycle hooks (mounted, updated, unmounted), teaching you how Vue manages DOM nodes.',
    'Interviewers use them to test whether you know the boundary between directives and components, and how to encapsulate imperative DOM code cleanly.',
    'Done wrong they leak (listeners/observers not cleaned up), so they are a good signal of whether you understand cleanup and the directive hook timeline.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A custom directive is a special instruction sticker you can slap on any element to give it a superpower.',
    story: [
      'Imagine you have magic stickers. One sticker says "always glow", another says "shake when tapped", another says "disappear if I click outside you".',
      'You do not rebuild the toy each time — you just stick the right sticker on, and the toy gains that behavior.',
      'You can put the same sticker on many toys, and they all get the same superpower.',
      'A custom directive is that sticker for web elements: you write the superpower once, then add v-yourname to any element to give it that behavior.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue ships built-in directives like v-if and v-for. A custom directive is one you create yourself, used like v-focus or v-tooltip.',
    'You define what should happen to the element when it appears (mounted), updates, or is removed (unmounted).',
    'Inside a directive you get the real DOM element, so you can do low-level things like focus it, add a listener, or observe it.',
    'They are best for behavior tied to the element itself, not for managing data — that is what components and composables are for.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A custom directive is a reusable object of lifecycle hooks (created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted) that receive the element and a binding object, letting you encapsulate imperative DOM logic and attach it to any element with v-name.',
    how: 'You register a directive globally (app.directive(\'focus\', {...})) or locally (the vDirectiveName convention in <script setup>). Vue calls the matching hooks at each phase, passing the element, the binding (value, arg, modifiers), and vnodes. You set up behavior in mounted and tear it down in unmounted.',
    why: 'It cleanly reuses element-level behavior (focus, click-outside, intersection-based lazy load) across components without duplicating DOM code or wrapping elements in components.',
    code: {
      label: 'A simple v-focus directive',
      lang: 'vue',
      code: '<script setup>\n// In <script setup>, a const named vXxx becomes the v-xxx directive\nconst vFocus = {\n  mounted(el) {\n    el.focus()\n  },\n}\n</script>\n\n<template>\n  <input v-focus placeholder="auto-focused on mount" />\n</template>',
      explanation: [
        'The vFocus const is auto-registered as the v-focus directive in <script setup>.',
        'The mounted hook runs after the element is inserted, with the real DOM node as el.',
        'el.focus() is imperative DOM work — exactly what directives are for.',
        'No data/state is involved, so a directive is lighter than a wrapper component.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A custom directive is an object whose keys are element lifecycle hooks — created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted — invoked by Vue at the corresponding phase of the host element. Each hook receives (el, binding, vnode, prevVnode), where binding carries value, oldValue, arg (v-dir:arg), modifiers (v-dir.mod), and instance. Directives are registered globally via app.directive(name, def) or locally (object option / the vName convention in <script setup>), and a function shorthand registers a directive whose body runs on both mounted and updated. They encapsulate imperative, element-scoped behavior and must clean up side effects (listeners, observers, timers) in unmounted.',

  // 7. Internal Working
  internalWorking: [
    'When the compiler encounters v-name on an element, it attaches the directive (with its binding metadata: value, arg, modifiers) to the element\'s vnode under a directives array.',
    'During patch, the runtime\'s directive handling (invokeDirectiveHook) fires the appropriate hooks at each phase: created before attributes are applied, beforeMount/mounted around insertion, beforeUpdate/updated around patches, and beforeUnmount/unmounted around removal.',
    'Each hook is called with the real element, a fresh binding object (computing value/oldValue/arg/modifiers from the current vnode), and the relevant vnodes.',
    'On re-render, if the directive\'s value changes, beforeUpdate/updated run so you can react to the new binding.value (e.g. update a tooltip text).',
    'On removal, unmounted runs so you can detach listeners, disconnect observers, and clear timers — the engine does not auto-clean your side effects.',
    'The function shorthand is internally expanded to { mounted: fn, updated: fn }, which is why a bare-function directive runs on both mount and every update.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   v-tooltip:top.fade="text"
       │      │    │     │
       │      │    │     └─ binding.value  = text
       │      │    └─────── binding.modifiers = { fade: true }
       │      └──────────── binding.arg = 'top'
       └─────────────────── directive name = tooltip

   element lifecycle the directive taps into:
   created → beforeMount → mounted → (beforeUpdate → updated)* → beforeUnmount → unmounted
        setup behavior in mounted ───────────────────► clean up in unmounted`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The directive object itself is shared; per-element state (a listener, an IntersectionObserver) is typically stored on the el (e.g. el._cleanup) so unmounted can find and release it.',
    'Anything captured in a mounted-registered listener stays alive as long as the listener is attached — failing to remove it in unmounted leaks that closure and the element references.',
    'binding objects are recreated each hook call from the current vnode, so they are short-lived.',
    'Observers (Intersection/Mutation/Resize) hold the element strongly; disconnecting them in unmounted is required to let the element be collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — function shorthand with a binding value',
      lang: 'vue',
      code: '<script setup>\n// function shorthand → runs on mounted AND updated\nconst vColor = (el, binding) => {\n  el.style.color = binding.value\n}\n</script>\n\n<template>\n  <p v-color="\'crimson\'">Red text</p>\n  <p v-color="\'teal\'">Teal text</p>\n</template>',
      explanation: [
        'The function shorthand is sugar for { mounted, updated }.',
        'binding.value is the expression passed to the directive.',
        'It re-applies on update, so changing the bound value re-colors the text.',
        'Good for simple, stateless DOM tweaks.',
      ],
    },
    intermediate: {
      label: 'Intermediate — v-click-outside with cleanup',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst open = ref(true)\nconst vClickOutside = {\n  mounted(el, binding) {\n    el._handler = (e) => {\n      if (!el.contains(e.target)) binding.value(e)\n    }\n    document.addEventListener(\'click\', el._handler)\n  },\n  unmounted(el) {\n    document.removeEventListener(\'click\', el._handler)\n    delete el._handler\n  },\n}\n</script>\n\n<template>\n  <div v-if="open" v-click-outside="() => (open = false)" class="menu">\n    Click outside to close\n  </div>\n</template>',
      explanation: [
        'mounted attaches a document listener and stores it on el for later removal.',
        'The handler calls binding.value (the provided callback) only for clicks outside the element.',
        'unmounted removes the listener — essential cleanup to avoid a leak and stale firing.',
        'This is the canonical custom-directive interview example.',
      ],
    },
    advanced: {
      label: 'Advanced — arg + modifiers for a tooltip',
      lang: 'vue',
      code: '<script setup>\nconst vTooltip = {\n  mounted(el, binding) {\n    el._tip = document.createElement(\'span\')\n    el._tip.className = \'tip tip--\' + (binding.arg || \'top\')\n    el._tip.textContent = binding.value\n    if (binding.modifiers.fade) el._tip.classList.add(\'fade\')\n    el.appendChild(el._tip)\n  },\n  updated(el, binding) {\n    el._tip.textContent = binding.value\n  },\n  unmounted(el) {\n    el._tip?.remove()\n  },\n}\n</script>\n\n<template>\n  <button v-tooltip:bottom.fade="\'Save your work\'">Save</button>\n</template>',
      explanation: [
        'binding.arg (here "bottom") selects placement; binding.modifiers.fade toggles animation.',
        'updated keeps the tooltip text in sync when the bound value changes.',
        'unmounted removes the injected node, preventing orphaned DOM.',
        'arg + modifiers + value give a directive a rich, declarative API.',
      ],
    },
    realProject: {
      label: 'Real project — lazy-load images with IntersectionObserver',
      lang: 'vue',
      code: '<script setup>\nconst vLazy = {\n  mounted(el, binding) {\n    const io = new IntersectionObserver((entries) => {\n      for (const entry of entries) {\n        if (entry.isIntersecting) {\n          el.src = binding.value\n          io.unobserve(el)\n        }\n      }\n    })\n    io.observe(el)\n    el._io = io\n  },\n  unmounted(el) {\n    el._io?.disconnect()\n    delete el._io\n  },\n}\n</script>\n\n<template>\n  <img v-lazy="\'/photos/large.jpg\'" alt="lazy" />\n</template>',
      explanation: [
        'The directive observes the image and only sets src when it scrolls into view, saving bandwidth.',
        'The observer is stored on el and disconnected in unmounted to release the element.',
        'This is a production-grade use: element-scoped behavior with proper teardown.',
        'A component wrapper would be heavier; the directive applies to any <img> directly.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a custom directive and when would you use one instead of a component?',
      answer: 'A custom directive is reusable element-level behavior attached via v-name, defined by lifecycle hooks that receive the DOM element. Use it for low-level DOM work tied to a single element (focus, click-outside, lazy-load) where a component would be unnecessary overhead.',
      explanation: 'The component-vs-directive boundary is the heart of a good answer.',
    },
    {
      level: 'beginner',
      question: 'What are the main directive hooks in Vue 3?',
      answer: 'created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, and unmounted — mirroring the element\'s lifecycle. mounted sets things up; unmounted tears them down.',
      explanation: 'Vue 3 renamed Vue 2 hooks (bind→beforeMount/mounted, update/componentUpdated→updated, unbind→unmounted); mentioning that earns credit.',
    },
    {
      level: 'intermediate',
      question: 'What information does the binding object give you?',
      answer: 'binding.value (the bound expression), binding.oldValue (previous value in update hooks), binding.arg (the part after the colon, v-dir:arg), binding.modifiers (the dotted flags), and binding.instance (the component using the directive).',
      explanation: 'Knowing arg and modifiers shows you can design a rich directive API.',
    },
    {
      level: 'intermediate',
      question: 'How do you register a custom directive globally vs locally?',
      answer: 'Globally with app.directive(\'name\', definition) in main.js. Locally via the directives option, or in <script setup> by naming a const vName which is auto-registered as v-name.',
      explanation: 'The <script setup> vName convention is the modern local pattern.',
    },
    {
      level: 'advanced',
      question: 'Why is cleanup in unmounted critical, and what happens if you skip it?',
      answer: 'Side effects you create in mounted (event listeners, IntersectionObservers, timers) are not auto-removed. If you skip unmounted, listeners keep firing on removed elements, observers keep the element alive, and closures leak memory.',
      explanation: 'Cleanup discipline is a senior signal; tying it to specific leak sources is strong.',
    },
    {
      level: 'senior',
      question: 'When should you NOT use a custom directive, and what is the alternative?',
      answer: 'When the logic involves reactive state, composition, or rendering — use a composable or component instead. Directives are for imperative, element-scoped DOM behavior; they have no template, limited reactivity, and can be hard to test, so anything stateful belongs in a composable.',
      explanation: 'Demonstrates judgment about the directive\'s narrow sweet spot versus composables/components.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What changed about directive hooks from Vue 2 to Vue 3?',
    'What does the function shorthand directive do?',
    'How do you pass multiple values to a directive?',
    'How do arg and modifiers shape a directive\'s API?',
    'Why prefer a composable over a directive for stateful logic?',
    'How do directives behave on components (and why is it discouraged)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Not cleaning up listeners/observers in unmounted.',
      why: 'They keep firing on removed elements and pin the element and closures in memory — a leak.',
      fix: 'Store the handler/observer on el in mounted and remove/disconnect it in unmounted.',
    },
    {
      mistake: 'Using a directive for stateful, reactive, or render logic.',
      why: 'Directives have no template and only coarse reactivity; the result is awkward and hard to test.',
      fix: 'Use a composable (useXxx) or a component for stateful behavior; keep directives for imperative DOM work.',
    },
    {
      mistake: 'Using Vue 2 hook names (bind, update, unbind) in Vue 3.',
      why: 'Vue 3 renamed them; the old names are not called, so the directive silently does nothing.',
      fix: 'Use mounted/updated/unmounted (and the other Vue 3 hooks).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Built-in v-focus-style autofocus, v-click-outside for menus/dropdowns, and v-lazy for image lazy-loading are common app-level directives.' },
    { area: 'Component library', detail: 'Libraries ship directives like v-tooltip, v-ripple, v-resize, and v-intersect for element behaviors that do not warrant a component.' },
    { area: 'VueUse', detail: 'Provides directive forms (vOnClickOutside, vIntersectionObserver, vElementSize) wrapping its composables for template-level use.' },
    { area: 'Analytics/A11y', detail: 'Directives attach tracking handlers or ARIA wiring to elements declaratively (e.g. v-track="\'cta_click\'").' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Directives reuse a single definition object across all usages — no per-usage component overhead.',
      'For element-only behavior they are lighter than wrapping in a component (no extra vnode/instance).',
    ],
    bad: [
      'Leaked listeners/observers from missing cleanup degrade performance over a session.',
      'Heavy work in updated runs on every relevant patch; uncontrolled it adds churn.',
    ],
    optimizations: [
      'Always disconnect observers and remove listeners in unmounted.',
      'Guard updated so you only act when binding.value actually changed (compare oldValue).',
      'Prefer one shared document listener with delegation over many per-element listeners when feasible.',
      'Throttle expensive directive work tied to high-frequency events.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'lifecycle-hooks-composition', 'template-refs'],
    nextConcepts: ['composables', 'composition-reuse-patterns', 'class-style-bindings'],
    dependencyNote:
      'Custom directives build on the element lifecycle and complement template-refs for imperative DOM access; for anything stateful, prefer composables — so this concept naturally leads into composition-reuse-patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write v-tooltip:top.fade="text" and label each part: name, arg, modifier, value.',
      'Draw the element lifecycle line and mark where mounted/updated/unmounted fire.',
      'Show mounted creating a listener stored on el, and unmounted removing it (the cleanup loop).',
      'Note the function shorthand expands to { mounted, updated }.',
      'Conclude: directives are for imperative, element-scoped DOM behavior with disciplined cleanup; stateful logic → composable.',
    ],
    diagram: `  v-name:arg.mod="value"
   name → which directive | arg → binding.arg
   mod → binding.modifiers | value → binding.value

  mounted(el): set up (listener/observer) ──┐
  updated(el): react to new value           │ store on el
  unmounted(el): tear down  ◄────────────────┘ MUST clean up`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A custom directive is reusable element-level behavior attached with v-name, defined by lifecycle hooks (mounted, updated, unmounted, etc.) that receive the DOM element and a binding (value, arg, modifiers). Register globally with app.directive or locally via the vName const in <script setup>. The function shorthand runs on mounted+updated. Use directives for imperative DOM work like focus, click-outside, lazy-load — and ALWAYS clean up listeners/observers in unmounted. For stateful logic, use a composable instead.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A custom directive lets you package reusable, element-level DOM behavior and attach it to any element with v-name. You define it as an object of lifecycle hooks — the Vue 3 set is created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, and unmounted — and each hook receives the real DOM element plus a binding object. The binding carries value (the expression you passed), oldValue, arg — the part after a colon like v-tooltip:top — and modifiers, the dotted flags like .fade. You register a directive globally with app.directive(\'name\', def), or locally; in script setup, naming a const vFocus automatically registers it as v-focus. There\'s also a function shorthand: a bare function is treated as both mounted and updated. The classic use cases are exactly the things that are about a single element\'s DOM and not about state: autofocus, click-outside, lazy-loading images with an IntersectionObserver, tooltips, ripple effects. The most important discipline is cleanup: anything you set up in mounted — an event listener, an observer, a timer — is not auto-removed by Vue, so you must store it (often on el) and remove or disconnect it in unmounted, or you leak memory and get handlers firing on removed elements. The key judgment call interviewers look for is when NOT to use a directive: if the logic involves reactive state, composition, or rendering, a composable or a component is the right tool. Directives have no template, only coarse reactivity, and are harder to test, so they shine narrowly — imperative DOM behavior tied to an element, with clean teardown.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Directives are lighter than components for element-only behavior, but lack a template, slots, and rich reactivity — wrong tool for stateful UI.',
      'Storing per-element state on el is pragmatic but untyped and easy to collide on; a WeakMap keyed by el is cleaner at scale.',
    ],
    edgeCases: [
      'On components, a directive is applied to the component\'s root element only with a single root; multi-root makes it ambiguous and is discouraged.',
      'updated fires for any patch of the host, not only when binding.value changed — compare oldValue to avoid redundant work.',
      'SSR: directives only run their DOM hooks on the client; server rendering ignores mounted, so DOM-dependent logic must guard for the client.',
      'getSSRProps lets a directive contribute attributes during SSR if needed.',
    ],
    runtimeBehavior: [
      'invokeDirectiveHook fires hooks at each patch phase with a freshly computed binding.',
      'The function shorthand expands to { mounted, updated }.',
      'Hooks run synchronously within the element\'s patch; heavy work blocks the patch.',
    ],
    scalability: [
      'Hundreds of per-element listeners are costly; prefer a single delegated document listener inside the directive.',
      'Use a WeakMap (el → state) instead of monkey-patching el for large apps and TypeScript safety.',
    ],
    productionConcerns: [
      'Missing unmounted cleanup is the dominant directive bug — memory leaks and ghost handlers.',
      'SSR mismatches occur when directives assume the DOM exists during render.',
      'Overusing directives for stateful logic produces untestable, hard-to-maintain code; reserve for imperative DOM.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Custom directive = reusable element behavior via v-name.',
    'Hooks: created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted.',
    'Hook args: (el, binding, vnode, prevVnode).',
    'binding: value, oldValue, arg, modifiers, instance.',
    'Register: app.directive(name, def) global; vName const local in <script setup>.',
    'Function shorthand = { mounted, updated }.',
    'Set up in mounted, ALWAYS clean up in unmounted.',
    'Vue 3 renamed Vue 2 hooks (bind→mounted, unbind→unmounted).',
    'Great for: focus, click-outside, lazy-load, tooltip, ripple.',
    'Stateful/reactive logic → use a composable, not a directive.',
    'On components: only single-root; multi-root is ambiguous.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a v-focus directive that focuses an input when it mounts.',
      hint: 'Use the mounted hook and el.focus().',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst vFocus = { mounted: (el) => el.focus() }\n</script>\n\n<template>\n  <input v-focus />\n</template>',
        explanation: [
          'mounted runs after insertion with the real element.',
          'el.focus() is the imperative DOM action the directive encapsulates.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a v-color directive (function shorthand) that sets text color from its binding value and reacts when the value changes.',
      hint: 'The function shorthand runs on both mounted and updated.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst color = ref(\'green\')\nconst vColor = (el, binding) => { el.style.color = binding.value }\n</script>\n\n<template>\n  <p v-color="color">Colored</p>\n  <button @click="color = \'purple\'">Change</button>\n</template>',
        explanation: [
          'The function shorthand applies on mount and on every update.',
          'Changing the color ref re-runs the directive and recolors the text.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement a v-click-outside directive that calls the bound callback when the user clicks outside the element, with correct cleanup.',
      hint: 'Add a document listener in mounted, remove it in unmounted, and check el.contains.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst open = ref(true)\nconst vClickOutside = {\n  mounted(el, binding) {\n    el._h = (e) => { if (!el.contains(e.target)) binding.value(e) }\n    document.addEventListener(\'click\', el._h)\n  },\n  unmounted(el) {\n    document.removeEventListener(\'click\', el._h)\n    delete el._h\n  },\n}\n</script>\n\n<template>\n  <div v-if="open" v-click-outside="() => (open = false)">Menu</div>\n</template>',
        explanation: [
          'mounted registers a document click handler stored on el for later removal.',
          'The handler invokes binding.value only when the click is outside the element.',
          'unmounted removes the listener to prevent leaks and stale firing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain when you would refactor a directive into a composable, and show a directive that should instead be a composable plus its composable version.',
      hint: 'Stateful, reactive logic belongs in a composable.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\n\n// Directive trying to expose reactive state is awkward — prefer a composable:\nfunction useMouse() {\n  const x = ref(0), y = ref(0)\n  const move = (e) => { x.value = e.pageX; y.value = e.pageY }\n  onMounted(() => window.addEventListener(\'mousemove\', move))\n  onUnmounted(() => window.removeEventListener(\'mousemove\', move))\n  return { x, y }\n}\nconst { x, y } = useMouse()\n</script>\n\n<template>\n  <p>Mouse: {{ x }}, {{ y }}</p>\n</template>',
        explanation: [
          'Tracking mouse position is reactive STATE consumed by the template — a directive cannot cleanly expose refs.',
          'A composable returns reactive refs (x, y) and manages its own lifecycle cleanup with onMounted/onUnmounted.',
          'Rule of thumb: imperative element-only behavior → directive; reactive state/logic → composable.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Custom directives test whether you understand the DOM lifecycle, cleanup discipline, and the boundary between directives, components, and composables — a sign of architectural maturity beyond basic template work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is a custom directive and its hooks". Product companies (Zoho, Flipkart, Razorpay) ask you to implement v-click-outside or v-lazy with cleanup. FAANG-level rounds probe the directive-vs-composable decision, SSR behavior, and memory-leak avoidance.',
    whatInterviewersExpect:
      'Define directives and their Vue 3 hooks, explain the binding (value/arg/modifiers), implement a click-outside or lazy-load with proper unmounted cleanup, and articulate when a composable or component is the better choice.',
  },
}

export default customDirectives
