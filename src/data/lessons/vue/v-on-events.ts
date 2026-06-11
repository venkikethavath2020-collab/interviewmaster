import type { ConceptLesson } from '../../../types/lesson'

const vOnEvents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-on-events',
  name: 'v-on Events',
  category: 'templates',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'v-on (the @ shorthand) is how every click, input, submit, and keystroke flows from the DOM into your Vue logic — without it your app is just static markup.',
    'It is the foundation of interactivity and the counterpart to data binding: props/v-bind flow data down, events flow actions up.',
    'Component events (this.$emit / defineEmits) build on the same v-on mechanism, so understanding it unlocks parent-child communication.',
    'Event handling is where beginners introduce bugs — calling handlers instead of passing them, losing the event object, or forgetting to clean up — so interviewers probe it.',
    'Modifiers like .prevent, .stop, and .once let you handle common DOM chores declaratively instead of writing boilerplate in JS.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-on is a doorbell wire: pressing the button (an event) rings a specific bell (your function).',
    story: [
      'Imagine your house has a doorbell. When someone presses the button, a wire carries the signal to a bell inside that goes "ding".',
      'You get to choose which bell rings for which button. The front-door button rings the hallway bell; the back-door button rings the kitchen bell.',
      'v-on is the wire you connect. You tell Vue: when THIS button is clicked, run THAT function.',
      'So whenever a user clicks, types, or submits, Vue follows your wire and runs the exact piece of code you connected to it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue, you listen for things the user does — clicks, typing, key presses — using v-on, usually written with the @ shortcut, like @click="handler".',
    'When the event happens, Vue calls the function you named and can pass it the native event object.',
    'You can write a method name, or a small inline expression like @click="count++".',
    'This is how data changes in response to the user, which is what makes a page feel alive.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-on is the directive that attaches an event listener to an element or component, written v-on:event="handler" or with the shorthand @event="handler", where handler is a method name or an inline statement.',
    how: 'The compiler registers a DOM addEventListener (or, for components, subscribes to emitted events). When the event fires, Vue invokes your handler; if you pass a method name, it receives the native event as its argument, and if you need both custom args and the event you use the special $event token.',
    why: 'It declaratively wires user interaction to your reactive logic, so state updates and re-renders happen in response to user actions without manual listener bookkeeping or cleanup.',
    code: {
      label: 'Click and input handling',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\nfunction increment() { count.value++ }\nfunction logKey(e) { console.log(e.key) }\n</script>\n\n<template>\n  <button @click="increment">Clicked {{ count }} times</button>\n  <input @keyup="logKey" />\n  <button @click="count++">Inline +1</button>\n</template>',
      explanation: [
        '@click="increment" passes the method by name; Vue calls it and gives it the native event automatically.',
        '@keyup="logKey" receives the event so you can read e.key.',
        '@click="count++" is an inline expression — handy for trivial updates.',
        'You write the method without parentheses when you want Vue to pass the event for you.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-on binds an event listener to an element or component. On native elements the compiler generates an addEventListener registration whose callback invokes your handler with the native Event; on components it subscribes to the child\'s emitted events. A method-name handler is called with the native event as its sole argument, while an inline-statement handler can reference the native event via the special $event variable. Vue caches inline handler functions and supports modifiers (.prevent, .stop, .once, .passive, key/mouse qualifiers) that the compiler expands into guard or option code so you avoid manual boilerplate.',

  // 7. Internal Working
  internalWorking: [
    'The compiler parses v-on/@ and produces an onEvent prop on the vnode (e.g. onClick), whose value is the handler function or a generated wrapper for inline statements and modifiers.',
    'During mount/patch, the runtime attaches the listener once via addEventListener and stores it as an invoker on the element so that updating the handler only swaps the inner function — no remove/re-add churn.',
    'When the DOM event fires, the invoker reads the current handler and calls it; for a bare method, Vue forwards the native event as the argument.',
    'Modifiers are expanded at compile time: .prevent injects event.preventDefault(), .stop injects event.stopPropagation(), key modifiers wrap the handler in a key guard, and .passive/.capture/.once become addEventListener options.',
    'For component listeners, v-on subscribes to events the child raises via emit; the child\'s emit looks up the matching onEvent prop and invokes it with the emitted payload.',
    'On unmount, Vue removes the listeners it added automatically, so there is no manual cleanup for template-bound handlers.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   user action            v-on wire               your code
   ┌───────────┐        ┌───────────────┐        ┌──────────────┐
   │  click /   │──────► │ @click=        │ ─────► │ increment()  │
   │  keyup /   │  DOM   │  "increment"   │ invoke │ count.value++│
   │  submit    │ event  │ (listener)     │        └──────────────┘
   └───────────┘        └───────────────┘
        │  native Event ──────────► passed as arg (or $event)
        │  modifiers (.prevent/.stop) applied before handler runs`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each listener is stored on the DOM element as an "invoker" object whose .value points at the current handler — Vue swaps .value on update rather than re-registering.',
    'Inline handlers compile to functions that Vue caches on the component instance, so re-renders reuse the same function reference instead of allocating a new one each time.',
    'Method handlers are stable references from setup, so no per-render allocation occurs.',
    'On unmount the invoker is detached and removeEventListener is called, releasing the closure so captured component state can be garbage collected.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — method vs inline',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst msg = ref(\'\')\nfunction greet() { msg.value = \'Hello!\' }\n</script>\n\n<template>\n  <button @click="greet">Greet (method)</button>\n  <button @click="msg = \'Hi inline\'">Greet (inline)</button>\n  <p>{{ msg }}</p>\n</template>',
      explanation: [
        '@click="greet" passes the method reference; Vue calls it on click.',
        '@click="msg = ..." is an inline statement evaluated in the template scope.',
        'No parentheses on greet means Vue supplies the native event automatically.',
        'Both update reactive state, triggering a re-render of the <p>.',
      ],
    },
    intermediate: {
      label: 'Intermediate — passing args and the native event',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\'a\', \'b\', \'c\'])\nfunction remove(item, e) {\n  e.preventDefault()\n  items.value = items.value.filter((x) => x !== item)\n}\n</script>\n\n<template>\n  <a\n    v-for="item in items"\n    :key="item"\n    href="#"\n    @click="remove(item, $event)"\n  >Remove {{ item }}</a>\n</template>',
      explanation: [
        'When you call the handler with parentheses, you control the arguments yourself.',
        '$event is the special token for the native event when you also pass custom args.',
        'Here e.preventDefault() stops the link from navigating.',
        'This pattern is essential in v-for rows where each handler needs item-specific data.',
      ],
    },
    advanced: {
      label: 'Advanced — multiple handlers and dynamic event names',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst eventName = ref(\'click\')\nfunction log(e) { console.log(e.type) }\nfunction track() { console.log(\'tracked\') }\n</script>\n\n<template>\n  <!-- multiple comma-separated handlers (no modifiers) -->\n  <button @click="log($event), track()">Two handlers</button>\n\n  <!-- dynamic event name -->\n  <button @[eventName]="log">Listens to {{ eventName }}</button>\n</template>',
      explanation: [
        'An inline expression can invoke several handlers separated by commas.',
        '@[eventName] is a dynamic argument — the event being listened to is computed at runtime.',
        'Dynamic events are useful for configurable or generic components.',
        'Use multiple handlers sparingly; a single method that orchestrates is usually clearer.',
      ],
    },
    realProject: {
      label: 'Real project — form submit and child-to-parent events',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport SearchBox from \'./SearchBox.vue\'\nconst results = ref([])\nasync function onSearch(query) {\n  const res = await fetch(\'/api/search?q=\' + encodeURIComponent(query))\n  results.value = await res.json()\n}\nfunction onSubmit() { /* handled by .prevent in template */ }\n</script>\n\n<template>\n  <!-- listen to a component event emitted by the child -->\n  <SearchBox @search="onSearch" />\n\n  <form @submit.prevent="onSubmit">\n    <button type="submit">Go</button>\n  </form>\n  <p>{{ results.length }} results</p>\n</template>',
      explanation: [
        '@search="onSearch" listens to a custom event the child emits via defineEmits — same v-on syntax as DOM events.',
        '@submit.prevent stops the browser\'s default full-page reload declaratively.',
        'The parent receives the emitted payload (query) as the handler argument.',
        'This up-flow of events plus down-flow of props is the core Vue data pattern.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is v-on and what is its shorthand?',
      answer: 'v-on attaches an event listener to an element or component; its shorthand is @, so v-on:click="fn" is written @click="fn".',
      explanation: 'Basic recall, but mentioning that it also works on component events shows breadth.',
    },
    {
      level: 'beginner',
      question: 'How do you access the native event object inside a handler?',
      answer: 'If you pass a method by name (@click="fn"), Vue passes the native event automatically as the argument. If you call the handler with custom args, use the special $event token: @click="fn(item, $event)".',
      explanation: 'The $event token is a frequent point of confusion; naming both cases is the strong answer.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between @click="fn" and @click="fn()"?',
      answer: '@click="fn" passes the function reference and Vue calls it with the native event. @click="fn()" calls fn immediately as an inline statement (running on render) only if misused; with parentheses you typically pass explicit arguments like @click="fn(id)", and you no longer get the event unless you add $event.',
      explanation: 'Tests understanding of reference vs invocation and the event-argument consequence.',
    },
    {
      level: 'intermediate',
      question: 'How do component events differ from native DOM events with v-on?',
      answer: 'Native events come from the DOM via addEventListener and carry an Event object. Component events are custom: the child calls emit(\'name\', payload) (declared with defineEmits) and the parent listens with @name; the payload, not a DOM Event, is what the handler receives.',
      explanation: 'Connects v-on to the emit system and clarifies the payload difference.',
    },
    {
      level: 'advanced',
      question: 'How does Vue avoid re-adding listeners on every re-render?',
      answer: 'Vue stores an "invoker" on the element whose .value holds the current handler. On update it swaps .value rather than calling removeEventListener/addEventListener, so the registration is stable and cheap. Inline handlers are also cached so their reference is stable.',
      explanation: 'Shows knowledge of the runtime optimization (invoker pattern), a strong intermediate-to-advanced signal.',
    },
    {
      level: 'senior',
      question: 'When would you bypass v-on and add a listener manually, and what are the trade-offs?',
      answer: 'For listeners on window/document/non-Vue elements, or for fine control (passive scroll, capture, dynamic registration), you add them in onMounted with addEventListener — and you MUST remove them in onUnmounted (or use VueUse useEventListener). The trade-off is losing Vue\'s automatic cleanup and invoker optimization, so you own lifecycle management.',
      explanation: 'Senior insight: knowing the boundary of template-bound events and the cleanup responsibility.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is $event and when do you need it?',
    'How do event modifiers like .prevent and .stop work under the hood?',
    'How do you listen to keyboard events for a specific key?',
    'What is the difference between native and custom (emitted) events?',
    'Why must manually-added listeners be removed on unmount?',
    'Can you bind multiple handlers to one event?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Writing @click="fn()" when you meant to pass the function, accidentally calling it during render.',
      why: 'Parentheses invoke the function as an inline statement evaluated when the handler runs, and without $event you lose the native event.',
      fix: 'Use @click="fn" to pass the reference, or @click="fn(arg, $event)" when you need both args and the event.',
    },
    {
      mistake: 'Manually adding window/document listeners in onMounted and forgetting to remove them.',
      why: 'The listener (and the closure it captures) survives after the component unmounts, leaking memory and firing on dead components.',
      fix: 'Remove the listener in onUnmounted, or use VueUse useEventListener which auto-cleans.',
    },
    {
      mistake: 'Calling preventDefault by reaching into the event manually for common cases instead of using modifiers.',
      why: 'It adds boilerplate and mixes DOM plumbing into business logic.',
      fix: 'Use declarative modifiers like @submit.prevent and @click.stop.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every interactive element wires user input via @click/@input/@submit; forms use @submit.prevent to avoid full-page reloads.' },
    { area: 'Component library', detail: 'Reusable components expose custom events (emit) that consumers listen to with @, e.g. a <Modal> emitting @close or a <DatePicker> emitting @update:modelValue.' },
    { area: 'Pinia', detail: 'Event handlers call store actions (@click="store.addToCart(id)") to mutate global state in response to user interaction.' },
    { area: 'Nuxt', detail: 'Client-only interactivity (clicks, navigation) is wired with v-on after hydration; SSR renders the markup, hydration attaches the listeners.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Vue\'s invoker pattern keeps a single stable listener per event, so updates swap the handler without re-registering.',
      'Cached inline handlers avoid allocating a new function each render.',
    ],
    bad: [
      'Attaching many high-frequency listeners (scroll, mousemove) without throttling causes excessive handler calls and jank.',
      'Manually-added global listeners that are never removed leak memory and keep firing.',
    ],
    optimizations: [
      'Use .passive on touch/scroll listeners so the browser need not wait for preventDefault.',
      'Throttle/debounce high-frequency handlers (mousemove, scroll, resize).',
      'Prefer event delegation on a parent for very large lists rather than a listener per row when feasible.',
      'Use VueUse useEventListener for window/document events to get automatic cleanup.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'v-bind', 'declarative-rendering'],
    nextConcepts: ['event-modifiers', 'v-model', 'component-events', 'v-model-components'],
    dependencyNote:
      'v-on is the event half of template binding (v-bind is the data half); it leads directly into event-modifiers for declarative DOM control and into component-events / v-model for parent-child communication.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw an element with @click pointing to a method box.',
      'Show the DOM event arriving and being passed as the argument to the method.',
      'Add a second arrow showing $event used when custom args are passed.',
      'Draw a parallel path: a child component emitting an event up to a parent\'s @handler with a payload (not a DOM event).',
      'Conclude: v-on wires both DOM and component events into your reactive logic, with the invoker keeping the listener stable.',
    ],
    diagram: `  <button @click="fn">    child <emit('save', data)>
        │ DOM event                 │ payload
        ▼                           ▼
     fn(event)                parent @save="onSave"
     (or fn(arg,$event))        onSave(data)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-on (shorthand @) attaches an event listener to an element or component. @click="fn" passes the method and Vue gives it the native event; @click="fn(arg, $event)" lets you pass custom args plus the event via $event. The same syntax listens to component events emitted with emit, but those carry a payload, not a DOM Event. Vue uses an invoker so listeners stay stable across renders. For window/document listeners added manually, remember to remove them on unmount.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-on, shorthand @, is how Vue listens to events. You write @click="handler" or @input="handler" on an element. There are two handler forms: a method name, like @click="increment", where Vue calls the function and automatically passes the native DOM event as the argument; and an inline statement, like @click="count++" or @click="remove(item, $event)", where you control what runs and use the special $event token if you also need the native event. The same directive works on components: a child declares events with defineEmits and raises them with emit(\'save\', payload), and the parent listens with @save="onSave" — except the handler receives the emitted payload, not a DOM Event. Under the hood, Vue stores an invoker on the element whose value points at the current handler, so on re-render it swaps the handler reference instead of removing and re-adding the listener, which keeps it cheap, and inline handlers are cached so they don\'t allocate every render. Modifiers like .prevent, .stop, and .once let you handle default-prevention, propagation, and one-time listeners declaratively. The one thing to watch is manually-added listeners: if you attach to window or document in onMounted with addEventListener, you own the cleanup and must remove them in onUnmounted, or use VueUse useEventListener which auto-cleans. Template-bound listeners are cleaned up by Vue automatically. Events flowing up plus props flowing down is the fundamental Vue communication pattern.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Template v-on gives automatic registration/cleanup and the invoker optimization, but for global or capture-phase listeners you must drop to manual addEventListener and own the lifecycle.',
      'Inline statements are convenient for trivial logic but hide logic in templates; method handlers keep logic testable in script.',
    ],
    edgeCases: [
      'Dynamic event names (@[name]) resolve at runtime; an undefined name silently attaches nothing.',
      'Once you pass parentheses you lose the auto-event unless you add $event explicitly.',
      'Component events are case-sensitive and not part of the DOM; @click on a component without an emitted "click" falls through to the root element via fallthrough attributes.',
      'Listeners on the same element with and without modifiers can compile to separate invokers.',
    ],
    runtimeBehavior: [
      'The invoker holds .value (current handler); patch swaps .value, so removeEventListener/addEventListener is avoided across updates.',
      'Modifiers are compiled into guard code (preventDefault/stopPropagation/key checks) or addEventListener options (passive/capture/once).',
      'Emitted component events traverse the parent\'s onEvent props; there is no DOM bubbling for component-only events.',
    ],
    scalability: [
      'High-frequency events (scroll/mousemove/resize) need throttling/debouncing or rAF batching to avoid main-thread saturation.',
      'For thousands of rows, a single delegated listener on the container can outperform a listener per row.',
    ],
    productionConcerns: [
      'Leaked global listeners are a common memory-leak and "handler fires on unmounted component" bug source — audit onUnmounted.',
      'Passive listeners matter for scroll performance scores (and the browser warns about non-passive touch listeners).',
      'Mixing default-prevention into business methods makes them harder to reuse than declarative modifiers.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-on:event or @event attaches a listener.',
    '@click="fn" → Vue passes the native event as the arg.',
    '@click="fn(arg, $event)" → custom args + $event for the event.',
    'Inline statements allowed: @click="count++".',
    'Same syntax for component events; payload not a DOM Event.',
    'Modifiers: .prevent, .stop, .once, .passive, .capture, key/mouse.',
    'Vue uses an invoker → stable listener, swaps handler on update.',
    'Inline handlers are cached (no per-render allocation).',
    'Manual window/document listeners → remove in onUnmounted.',
    'Dynamic event name: @[eventName]="fn".',
    'Throttle/debounce high-frequency events.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Make a button that increments a counter on click and shows the current count.',
      hint: 'Bind @click to a method or an inline expression that mutates a ref.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <button @click="count++">Count: {{ count }}</button>\n</template>',
        explanation: [
          '@click="count++" is an inline statement run on each click.',
          'Mutating the ref triggers a re-render so the count updates.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'In a v-for of products, add a button per product that calls addToCart(product) and also prevents the default of a wrapping link, using the native event.',
      hint: 'Pass both the product and $event to the handler.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst products = ref([{ id: 1, name: \'Pen\' }])\nfunction addToCart(product, e) {\n  e.preventDefault()\n  console.log(\'added\', product.name)\n}\n</script>\n\n<template>\n  <a v-for="p in products" :key="p.id" href="#" @click="addToCart(p, $event)">\n    Add {{ p.name }}\n  </a>\n</template>',
        explanation: [
          'Calling with parentheses lets you pass the product explicitly.',
          '$event provides the native event so you can preventDefault.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Listen to the window resize event and store the window width reactively, with proper cleanup on unmount.',
      hint: 'Use onMounted to addEventListener and onUnmounted to removeEventListener.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted, onUnmounted } from \'vue\'\nconst width = ref(window.innerWidth)\nfunction onResize() { width.value = window.innerWidth }\nonMounted(() => window.addEventListener(\'resize\', onResize))\nonUnmounted(() => window.removeEventListener(\'resize\', onResize))\n</script>\n\n<template>\n  <p>Window width: {{ width }}px</p>\n</template>',
        explanation: [
          'Global listeners are added manually since they are not on a Vue-rendered element.',
          'Removing the listener in onUnmounted prevents a memory leak and stale firing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a child SearchBox that emits a "search" event with the query when its form is submitted, and a parent that listens and logs it. Prevent the default form submit.',
      hint: 'Child uses defineEmits and @submit.prevent; parent uses @search.',
      solution: {
        lang: 'vue',
        code: '<!-- SearchBox.vue -->\n<script setup>\nimport { ref } from \'vue\'\nconst emit = defineEmits([\'search\'])\nconst q = ref(\'\')\nfunction submit() { emit(\'search\', q.value) }\n</script>\n<template>\n  <form @submit.prevent="submit">\n    <input v-model="q" />\n    <button>Search</button>\n  </form>\n</template>\n\n<!-- Parent.vue -->\n<script setup>\nimport SearchBox from \'./SearchBox.vue\'\nfunction onSearch(query) { console.log(\'search:\', query) }\n</script>\n<template>\n  <SearchBox @search="onSearch" />\n</template>',
        explanation: [
          'The child declares the search event with defineEmits and raises it with emit, passing the query payload.',
          'The parent listens with @search using the same v-on syntax; the handler receives the payload, not a DOM event.',
          '@submit.prevent stops the browser reloading the page.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Event handling is half of what makes an app interactive, so interviewers expect fluency. Clear answers on $event, method vs inline, and component events show you can actually wire up real UIs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Wipro) ask the syntax and "how do you get the event object". Product companies (Zoho, Flipkart, Razorpay) ask about $event, custom emitted events, and cleanup of manual listeners. FAANG-level rounds probe the invoker optimization, passive listeners, and delegation for large lists.',
    whatInterviewersExpect:
      'Explain v-on and the @ shorthand, distinguish method vs inline handlers and how the event is passed, contrast native vs component events, and for senior credit discuss the invoker pattern and manual-listener cleanup.',
  },
}

export default vOnEvents
