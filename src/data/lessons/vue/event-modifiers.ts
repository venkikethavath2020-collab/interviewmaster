import type { ConceptLesson } from '../../../types/lesson'

const eventModifiers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-modifiers',
  name: 'Event Modifiers',
  category: 'templates',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Event modifiers let you handle common DOM chores — preventDefault, stopPropagation, key filtering — declaratively in the template instead of cluttering your methods with plumbing.',
    'They keep handlers focused on business logic: a method should add a todo, not also know it must call event.preventDefault().',
    '.passive is a real performance lever for scroll/touch handlers, and interviewers like to see you know it.',
    'Key and mouse modifiers (@keyup.enter, @click.right) make keyboard and pointer interactions readable and less error-prone.',
    'Knowing modifier order and the difference between .self and .stop prevents subtle propagation bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Modifiers are little stickers you put on the doorbell wire that say "only ring for the red button" or "do not also ring the upstairs bell".',
    story: [
      'Remember the doorbell wire that connects a button to a bell? Sometimes you want extra rules on that wire.',
      'You could add a sticker that says "ignore presses that are not the Enter key", so the bell only rings for the right press.',
      'Another sticker could say "do not let this ring spread to the bell next door" — that stops the signal traveling further.',
      'Event modifiers are those stickers. They are tiny instructions you add right next to @click or @keyup to change exactly how the event is handled, without rewriting the bell itself.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you listen for an event with @click or @keyup, you can add a small dotted word after it, like @click.stop or @keyup.enter — that word is a modifier.',
    'Modifiers tell Vue to do a common job for you, such as stopping the page from reloading, stopping the event from bubbling up, or only reacting to a specific key.',
    'This saves you from writing that plumbing inside your function.',
    'You can even chain several modifiers together, and the order they appear matters.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Event modifiers are dotted suffixes appended to a v-on binding (e.g. @submit.prevent, @click.stop, @keyup.enter) that instruct Vue to apply common event-handling behavior — calling preventDefault/stopPropagation, filtering by key/mouse button, or setting listener options like passive/capture/once.',
    how: 'The compiler reads the modifiers and either wraps the handler in guard code (preventDefault, stopPropagation, key checks) or passes addEventListener options (.passive, .capture, .once). Your handler then runs only when the conditions are met, and the DOM plumbing has already been applied.',
    why: 'It keeps handlers pure and focused on logic, makes intent obvious in the template, and gives a declarative way to opt into performance and propagation behavior.',
    code: {
      label: 'Common modifiers in action',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst text = ref(\'\')\nconst submitted = ref(\'\')\nfunction submit() { submitted.value = text.value }\n</script>\n\n<template>\n  <!-- .prevent: no full-page reload -->\n  <form @submit.prevent="submit">\n    <!-- .enter: only fire on Enter key -->\n    <input v-model="text" @keyup.enter="submit" />\n  </form>\n  <p>Submitted: {{ submitted }}</p>\n</template>',
      explanation: [
        '@submit.prevent calls event.preventDefault() for you, stopping the browser reload.',
        '@keyup.enter runs submit only when the Enter key is released.',
        'The submit method stays clean — it just copies the value, no event plumbing.',
        'Modifiers are resolved at compile time, so there is no runtime if/else in your code.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Event modifiers are compile-time directives appended to v-on bindings that the template compiler expands into handler-guard code or listener options. Behavioral modifiers (.prevent, .stop, .self, .capture, .once, .passive) control DOM dispatch — preventDefault, stopPropagation, target checks, and addEventListener flags. Key modifiers (.enter, .esc, .tab, custom keys) and system/mouse modifiers (.ctrl, .shift, .left, .right, .exact) wrap the handler so it only runs when the matching key, modifier-key, or button condition holds. Some modifiers (.capture, .once, .passive) become addEventListener options rather than inline guards, and modifier order is significant.',

  // 7. Internal Working
  internalWorking: [
    'The compiler parses the dotted modifiers attached to a v-on binding and classifies them as guard modifiers (.prevent, .stop, .self, key/mouse filters) or option modifiers (.capture, .once, .passive).',
    'Guard modifiers are compiled into a wrapper using helpers like withModifiers and withKeys, which inject event.preventDefault(), event.stopPropagation(), a target===currentTarget check, or a key/button check before calling your handler.',
    'Option modifiers are encoded into the event name suffix (e.g. onClickOnce / onScrollPassive) that the runtime translates into addEventListener options { capture, once, passive }.',
    'At mount, the runtime registers the listener with those options; when the event fires, the wrapper runs its guards first and only invokes your handler if the conditions pass.',
    'Because expansion happens at compile time, there is no per-call branching written by you, and modifier order determines the sequence — e.g. @click.prevent.self vs @click.self.prevent behave differently.',
    'Key modifiers map names to KeyboardEvent.key values (with kebab-case for multi-word keys like page-down), and .exact restricts to precisely the listed system modifier keys.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   @keyup.enter.prevent="submit"
        │       │      │
        │       │      └─ guard: event.preventDefault()
        │       └──────── guard: only if key === 'Enter'
        └──────────────── base event: keyup

   DOM event ─► [ key guard ] ─► [ prevent ] ─► submit()
                 (skip if not Enter)  (always)   your logic

   option modifiers (.passive/.once/.capture)
   ─► become addEventListener(name, fn, { passive,once,capture })`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Guard modifiers compile to a wrapper function (withModifiers/withKeys) cached on the instance, so no new closure is allocated per render.',
    'Option modifiers add no wrapper — they only set flags on the single addEventListener registration.',
    '.passive registrations let the browser skip waiting for a potential preventDefault, keeping the scroll path off the main-thread blocking list.',
    '.once causes the browser/Vue to auto-detach the listener after the first fire, releasing the closure immediately.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — prevent and stop',
      lang: 'vue',
      code: '<script setup>\nfunction outer() { console.log(\'outer\') }\nfunction inner() { console.log(\'inner only\') }\n</script>\n\n<template>\n  <div @click="outer">\n    <!-- .stop prevents the click bubbling to the parent div -->\n    <button @click.stop="inner">No bubble</button>\n  </div>\n\n  <!-- .prevent stops the link navigating -->\n  <a href="https://example.com" @click.prevent="inner">Stay here</a>\n</template>',
      explanation: [
        '.stop calls stopPropagation so the parent\'s outer() does not run when the button is clicked.',
        '.prevent calls preventDefault so the anchor does not navigate.',
        'Both replace boilerplate you would otherwise write inside the handler.',
        'The handlers stay free of DOM plumbing.',
      ],
    },
    intermediate: {
      label: 'Intermediate — key and mouse modifiers',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst msg = ref(\'\')\nfunction save() { msg.value = \'saved\' }\nfunction context() { msg.value = \'right-click\' }\n</script>\n\n<template>\n  <!-- Ctrl+Enter to save -->\n  <textarea @keyup.ctrl.enter="save" />\n  <!-- only the right mouse button -->\n  <div @click.right.prevent="context">Right click me</div>\n  <p>{{ msg }}</p>\n</template>',
      explanation: [
        '@keyup.ctrl.enter fires only when Enter is pressed while Ctrl is held.',
        '@click.right targets the right mouse button; .prevent suppresses the browser context menu.',
        'Combining modifiers chains their guards.',
        'Key names use KeyboardEvent.key values, kebab-cased for multi-word keys.',
      ],
    },
    advanced: {
      label: 'Advanced — .self, .capture, .exact, .passive',
      lang: 'vue',
      code: '<script setup>\nfunction onOverlay() { console.log(\'overlay clicked, not its children\') }\nfunction onScroll() { /* heavy work, but passive so scroll stays smooth */ }\nfunction onExactClick() { console.log(\'plain click, no modifier keys\') }\n</script>\n\n<template>\n  <!-- .self: only when the overlay itself (not a child) is the target -->\n  <div class="overlay" @click.self="onOverlay">\n    <div class="modal">Modal content</div>\n  </div>\n\n  <!-- .passive: never calls preventDefault → smoother scrolling -->\n  <div class="scroller" @scroll.passive="onScroll">...</div>\n\n  <!-- .exact: fires only if NO other system modifier is pressed -->\n  <button @click.exact="onExactClick">Plain click only</button>\n</template>',
      explanation: [
        '.self runs the handler only when event.target is the element itself — perfect for click-outside / overlay dismiss.',
        '.passive tells the browser the handler will not preventDefault, improving scroll/touch performance.',
        '.exact requires that exactly the listed system keys (none here) are pressed — Ctrl+click would not trigger it.',
        '.capture (not shown) would register the listener in the capture phase instead of bubble.',
      ],
    },
    realProject: {
      label: 'Real project — modal with overlay dismiss and Esc to close',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst open = ref(true)\nfunction close() { open.value = false }\n</script>\n\n<template>\n  <div\n    v-if="open"\n    class="overlay"\n    @click.self="close"\n    @keyup.esc="close"\n    tabindex="0"\n  >\n    <div class="dialog" @click.stop>\n      <h2>Confirm</h2>\n      <button @click="close">Close</button>\n    </div>\n  </div>\n</template>',
      explanation: [
        '@click.self="close" dismisses only when the backdrop itself is clicked, not the dialog.',
        '@click.stop on the dialog prevents inner clicks from bubbling to the overlay and closing it.',
        '@keyup.esc="close" gives the standard keyboard escape-to-close behavior.',
        'All accessibility/UX wiring is declarative and readable in the template.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does @submit.prevent do?',
      answer: 'It listens for the form submit event and calls event.preventDefault() automatically, stopping the browser from doing a full-page reload, before running your handler.',
      explanation: 'The most common modifier; naming the reload prevention shows you understand the default behavior.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between .stop and .prevent?',
      answer: '.stop calls stopPropagation (stops the event bubbling to ancestor handlers); .prevent calls preventDefault (stops the browser default action like navigating or submitting).',
      explanation: 'Conflating these two is a classic error; distinguishing propagation vs default action is the key.',
    },
    {
      level: 'intermediate',
      question: 'What does the .self modifier do and where is it useful?',
      answer: 'It runs the handler only when event.target is the element itself, not a descendant. It is ideal for overlay/backdrop click-to-dismiss, where clicking the modal content should not close it.',
      explanation: 'Tests understanding of event target vs currentTarget and a real UI pattern.',
    },
    {
      level: 'intermediate',
      question: 'Why and when would you use the .passive modifier?',
      answer: 'On scroll/touch listeners. .passive promises the handler will not call preventDefault, so the browser can start scrolling immediately without waiting — improving scroll performance and avoiding the "non-passive listener" warning.',
      explanation: 'A performance-aware answer; mentioning the browser need-not-wait detail is strong.',
    },
    {
      level: 'advanced',
      question: 'Does modifier order matter? Give an example.',
      answer: 'Yes. @click.prevent.self prevents default for every click, then checks .self; @click.self.prevent only prevents default when the target is the element itself. The guards are applied in the order written.',
      explanation: 'Order-sensitivity is a subtle, senior-leaning detail many miss.',
    },
    {
      level: 'senior',
      question: 'How are modifiers implemented, and which become listener options vs guards?',
      answer: 'The compiler expands guard modifiers (.prevent, .stop, .self, key/mouse) into withModifiers/withKeys wrapper code that runs before your handler. Option modifiers (.capture, .once, .passive) are encoded into the event name and become addEventListener options { capture, once, passive } rather than inline guards.',
      explanation: 'Demonstrates compile-time mechanics and the guard-vs-option distinction — a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you listen for a specific key like Enter or Escape?',
    'What is the difference between .self and .stop?',
    'What does .exact do?',
    'How would you handle Ctrl+click or right-click?',
    'Why does .passive improve scroll performance?',
    'Can you register a listener for the capture phase in Vue?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting preventDefault/stopPropagation logic inside the handler instead of using modifiers.',
      why: 'It mixes DOM plumbing into business logic and makes the handler harder to reuse and test.',
      fix: 'Use @submit.prevent / @click.stop declaratively and keep the method pure.',
    },
    {
      mistake: 'Confusing .self with .stop.',
      why: '.self only filters by target (still allows bubbling), while .stop halts propagation entirely — different semantics.',
      fix: 'Use .self for "only when I am the target" and .stop to block bubbling to ancestors.',
    },
    {
      mistake: 'Calling event.preventDefault() inside a .passive-marked listener.',
      why: '.passive promises no preventDefault; calling it is ignored and logs a browser warning.',
      fix: 'Do not mark a listener .passive if it needs to prevent default; choose one.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Forms universally use @submit.prevent; modals use @click.self and @keyup.esc for dismiss; menus use @click.right.prevent for custom context menus.' },
    { area: 'Component library', detail: 'Headless dialog/menu components ship key-modifier handlers (@keydown.arrow-down, @keydown.esc) to provide accessible keyboard navigation out of the box.' },
    { area: 'Performance', detail: 'Scroll-heavy components (infinite lists, parallax) mark scroll/touch listeners .passive to keep scrolling smooth and pass Lighthouse audits.' },
    { area: 'Vue', detail: 'Keyboard shortcuts (@keyup.ctrl.enter to submit, @keydown.meta.k for command palette) are wired declaratively with system + key modifiers.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      '.passive lets the browser scroll without blocking on the handler, improving perceived smoothness and Lighthouse scores.',
      'Compile-time expansion means no extra per-call branching is written by you; wrappers are cached, not re-allocated.',
    ],
    bad: [
      'Chaining heavy guards on very high-frequency events still runs the wrapper each fire — modifiers do not throttle.',
      'Overusing .stop can break legitimate event delegation patterns elsewhere in the tree.',
    ],
    optimizations: [
      'Mark non-preventing scroll/touch handlers .passive.',
      'Use .once for genuinely one-time interactions so the listener auto-detaches.',
      'Still debounce/throttle high-frequency handlers; modifiers are guards, not rate-limiters.',
      'Prefer .self over manual target checks for overlay dismiss to avoid extra code.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-on-events', 'template-syntax'],
    nextConcepts: ['v-model', 'custom-directives', 'form-handling'],
    dependencyNote:
      'Event modifiers are declarative sugar on top of v-on-events; once comfortable you use them constantly in form-handling and they pair with v-model input modifiers (.trim/.number/.lazy) which share the dotted-suffix idea.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write @click.stop.prevent and split it: base event + each dotted guard.',
      'Show a pipeline: DOM event → key/self guard → prevent/stop → handler.',
      'Contrast .stop (halts bubbling) with .self (only filters target).',
      'Separately show option modifiers (.passive/.once/.capture) becoming addEventListener options.',
      'Conclude: modifiers move DOM plumbing into the template, keeping handlers pure, and order matters.',
    ],
    diagram: `  @click.self.prevent="fn"
    event ─► [target===el ?] ─► [preventDefault] ─► fn()
              (.self)            (.prevent)
  option group: { capture, once, passive } → addEventListener opts`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Event modifiers are dotted suffixes on v-on that do common DOM chores declaratively: .prevent (preventDefault), .stop (stopPropagation), .self (only when target is the element), .once/.capture/.passive (listener options), plus key/mouse filters like .enter, .esc, .ctrl, .right, and .exact. The compiler expands guard modifiers into withModifiers/withKeys wrappers and turns option modifiers into addEventListener options. They keep handlers pure, and their order matters.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Event modifiers are dotted suffixes you add to a v-on binding to handle common DOM work declaratively, so your handler stays focused on logic. The behavioral ones are .prevent, which calls event.preventDefault — the classic use is @submit.prevent to stop a form reloading the page; .stop, which calls stopPropagation to keep the event from bubbling to ancestor handlers; and .self, which runs the handler only when the event target is the element itself, not a descendant — perfect for overlay click-to-dismiss where clicking the modal content shouldn\'t close it. Then there are option modifiers: .once detaches after the first fire, .capture registers in the capture phase, and .passive promises the handler won\'t call preventDefault, which lets the browser scroll without waiting and is a real performance win for scroll and touch listeners. There are also key modifiers like @keyup.enter and @keyup.esc, system-key modifiers like .ctrl and .shift, mouse-button modifiers like .left and .right, and .exact, which requires precisely the listed modifier keys — so @click.exact fires only on a plain click, not Ctrl+click. Under the hood the compiler classifies them: guard modifiers compile into withModifiers and withKeys wrappers that run preventDefault, stopPropagation, target checks, or key checks before your handler; option modifiers are encoded into the event name and become addEventListener options. Order matters — @click.prevent.self prevents default on every click then checks self, whereas @click.self.prevent only prevents default when the target is the element itself. They don\'t throttle, so high-frequency handlers still need debouncing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarative modifiers keep handlers pure and testable, but spread interaction logic into templates; complex flows may read better in a single method.',
      '.passive boosts scroll performance but forfeits the ability to preventDefault — you must be certain the handler never needs it.',
    ],
    edgeCases: [
      'Modifier order changes behavior (.prevent.self vs .self.prevent).',
      '.self checks target===currentTarget, so it still allows the event to bubble — different from .stop.',
      'Key modifier names follow KeyboardEvent.key (kebab-cased for multi-word like page-down); legacy keyCode-based names are removed in Vue 3.',
      '.exact distinguishes a plain click from modified clicks, useful for shortcut disambiguation.',
    ],
    runtimeBehavior: [
      'Guard modifiers run synchronously before the handler; if a guard fails (wrong key/target), the handler is skipped.',
      'Option modifiers alter the addEventListener registration once, not per event.',
      '.once relies on auto-removal so the captured closure is released after firing.',
    ],
    scalability: [
      'On high-frequency events, the guard wrapper executes every fire; combine with throttling for mousemove/scroll.',
      'Custom global key modifiers (config.keyCodes-style) should be centralized to stay consistent across a large app.',
    ],
    productionConcerns: [
      'Browser warnings about non-passive touch/wheel listeners are resolved with .passive.',
      'Overuse of .stop can silently break analytics/delegated listeners higher in the tree.',
      'Accessibility: pair pointer modifiers with keyboard ones (.enter/.esc) so interactions are keyboard-reachable.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '.prevent → event.preventDefault().',
    '.stop → event.stopPropagation().',
    '.self → only when event.target is the element itself.',
    '.once → listener auto-removes after first fire.',
    '.capture → listen in capture phase.',
    '.passive → promise no preventDefault (scroll perf).',
    'Key: .enter .esc .tab .delete .space .up .down (kebab for multi-word).',
    'System: .ctrl .alt .shift .meta; mouse: .left .right .middle.',
    '.exact → exactly the listed modifier keys, nothing more.',
    'Order matters: .prevent.self ≠ .self.prevent.',
    'Modifiers guard/configure; they do NOT throttle.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Make a form that runs save() on submit without reloading the page.',
      hint: 'Use the .prevent modifier on @submit.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nfunction save() { console.log(\'saved\') }\n</script>\n\n<template>\n  <form @submit.prevent="save">\n    <button>Save</button>\n  </form>\n</template>',
        explanation: [
          '@submit.prevent calls preventDefault automatically, stopping the page reload.',
          'save stays free of any event plumbing.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add a text input that submits a message only when the user presses Enter, and clears the input after.',
      hint: 'Use @keyup.enter.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst draft = ref(\'\')\nconst sent = ref([])\nfunction send() {\n  if (!draft.value) return\n  sent.value.push(draft.value)\n  draft.value = \'\'\n}\n</script>\n\n<template>\n  <input v-model="draft" @keyup.enter="send" />\n  <ul><li v-for="(m, i) in sent" :key="i">{{ m }}</li></ul>\n</template>',
        explanation: [
          '@keyup.enter runs send only when Enter is released.',
          'Clearing draft after pushing resets the input for the next message.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a modal overlay that closes when the backdrop is clicked but NOT when the inner dialog is clicked.',
      hint: 'Use @click.self on the overlay and @click.stop on the dialog.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst open = ref(true)\n</script>\n\n<template>\n  <div v-if="open" class="overlay" @click.self="open = false">\n    <div class="dialog" @click.stop>\n      Dialog content (clicking here stays open)\n    </div>\n  </div>\n</template>',
        explanation: [
          '@click.self closes only when the backdrop itself is the click target.',
          '@click.stop on the dialog prevents inner clicks from bubbling up and triggering the overlay handler.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate the difference between @click.prevent.self and @click.self.prevent.',
      hint: 'Think about whether preventDefault runs before or after the target check.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- A: preventDefault runs for EVERY click, then checks target -->\n  <div @click.prevent.self="onA">...</div>\n\n  <!-- B: only when target IS the div does preventDefault (and handler) run -->\n  <div @click.self.prevent="onB">...</div>\n</template>',
        explanation: [
          'In A (.prevent.self), preventDefault is applied to all clicks (including those bubbling from children) before the .self check decides whether to run onA.',
          'In B (.self.prevent), the .self check comes first, so preventDefault only happens when the div itself is the target.',
          'Guards are applied in written order, which is why the behavior differs.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Modifiers show you write clean, idiomatic Vue rather than stuffing DOM plumbing into methods. They are small but signal polish, and .passive shows performance awareness.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what does .prevent/.stop do" and "how to listen for Enter". Product companies (Zoho, Flipkart, Razorpay) ask about .self for modals and .passive for scroll. FAANG-level rounds probe modifier order, the guard-vs-option compilation, and accessibility implications.',
    whatInterviewersExpect:
      'Distinguish .prevent vs .stop vs .self clearly, know key/system/mouse modifiers, explain .passive\'s performance benefit, and for senior credit explain that modifiers compile to withModifiers/withKeys wrappers or addEventListener options and that order matters.',
  },
}

export default eventModifiers
