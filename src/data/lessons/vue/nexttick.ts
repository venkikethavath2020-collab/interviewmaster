import type { ConceptLesson } from '../../../types/lesson'

const nextTick: ConceptLesson = {
  // 1. Concept Summary
  slug: 'nexttick',
  name: 'nextTick',
  category: 'lifecycle-rendering',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Vue updates the DOM asynchronously and in batches — nextTick is the official way to run code AFTER those DOM updates have flushed, so you read accurate post-update measurements.',
    'It is the fix for the classic "I changed the data but the DOM still shows the old value" bug when you try to read the DOM immediately after a state change.',
    'Real tasks depend on it: focusing a newly rendered input, measuring an element\'s height after content changes, scrolling to a freshly added item.',
    'It directly tests whether you understand Vue\'s batched, asynchronous update queue — a very common intermediate interview topic.',
    'Misusing it (or not knowing it exists) leads to flaky UI code full of setTimeout(0) hacks that work by accident.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'nextTick is like waiting for the paint to dry before you touch the wall.',
    story: [
      'Imagine you tell a painter to repaint your wall a new color. You shout the instruction, but the painter does not paint instantly — they finish what they are doing and then do all the repainting at once.',
      'If you touch the wall right after shouting, it is still the old color and maybe wet — you get the wrong result.',
      'So you wait until the painter says "done!" and then you touch the wall, now correctly painted.',
      'nextTick is you saying "tell me the moment the painting is finished", so you only act after the wall really shows the new color.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you change data in Vue, Vue does not immediately update the web page. It waits a tiny moment to collect all the changes and update them together — this is faster.',
    'That means if you change something and then look at the page in the very next line of code, the page might still show the old thing.',
    'nextTick is a function that says "run my code after Vue has finished updating the page". You give it a function, and Vue runs it once the DOM is fresh.',
    'You use it whenever you need to look at or measure the page right after changing data, like focusing a box that just appeared.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'nextTick is a Vue utility that returns a Promise (and also accepts a callback) which resolves after Vue has flushed its pending reactive updates to the DOM. It lets you run code with the guarantee that the DOM reflects the latest state.',
    how: 'Vue batches reactive changes and schedules a single DOM flush as a microtask. nextTick queues your callback after that flush, so when it runs the DOM is up to date. You can await nextTick() or pass a callback.',
    why: 'Because Vue updates the DOM asynchronously, reading the DOM right after a state change gives stale values. nextTick is the supported way to wait for the update.',
    code: {
      label: 'Reading the DOM after an update',
      lang: 'js',
      code: 'import { ref, nextTick } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    const text = ref(null) // template ref to a <span>\n\n    async function increment() {\n      count.value++\n      // DOM not updated yet here:\n      console.log(text.value.textContent) // old value\n      await nextTick()\n      // now the DOM reflects the new count:\n      console.log(text.value.textContent) // new value\n    }\n    return { count, text, increment }\n  },\n}',
      explanation: [
        'Changing count.value only schedules an update; the DOM is not patched synchronously.',
        'Immediately after, text.textContent still shows the old number.',
        'await nextTick() pauses until Vue flushes the update to the DOM.',
        'After the await, reading the DOM returns the updated value.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'nextTick is a utility that defers a callback until after the next DOM update cycle. When reactive state changes, Vue does not patch the DOM synchronously; it queues the affected component render effects and flushes them once per tick via the scheduler, using a microtask (Promise.then). nextTick registers its callback to run after that flush completes, so the DOM is guaranteed to reflect the latest state. It returns a Promise, enabling await nextTick() in async functions, and the resolution is tied to the same microtask queue used for the update flush.',

  // 7. Internal Working
  internalWorking: [
    'A reactive mutation triggers the component\'s render effect, but instead of running immediately it is pushed into the scheduler\'s job queue (deduplicated by component).',
    'The scheduler schedules a single flush as a microtask via Promise.resolve().then(flushJobs), so multiple synchronous mutations coalesce into one update.',
    'When the microtask runs, flushJobs executes the queued render effects in order, patching the DOM (the diff/patch step).',
    'nextTick attaches its callback (or resolves its Promise) onto the SAME microtask chain, scheduled after the flush, so it runs once the DOM has been updated.',
    'If called with no pending flush, nextTick still resolves on the next microtask, guaranteeing a consistent "after current sync work" timing.',
    'Because it uses microtasks (not setTimeout), the callback runs before the browser paints and before any macrotasks, keeping UI logic tight and synchronous-feeling.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Synchronous code:
    count.value++   count.value++   count.value++
        │               │               │
        └──── all queue ONE render job (deduped) ────┐
                                                     ▼
  ───────────── current call stack ends ─────────────
                       │
              microtask: flushJobs()  ← patches DOM
                       │
              microtask: nextTick callbacks  ← DOM is fresh here
                       │
                  browser paint`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The scheduler holds a small queue of pending jobs (render effects) plus a flag indicating a flush is already scheduled, so repeated mutations do not schedule extra flushes.',
    'nextTick callbacks attach to a resolved-Promise microtask; they are transient and released after running.',
    'No timers or heap-heavy structures are involved — it leverages the JS microtask queue, which is cheap.',
    'Because deduplication coalesces N synchronous mutations into one render, memory churn from repeated patches is avoided.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — await nextTick after a change',
      lang: 'js',
      code: 'import { ref, nextTick } from \'vue\'\n\nconst show = ref(false)\nasync function reveal() {\n  show.value = true\n  await nextTick()\n  // element rendered by v-if now exists in the DOM\n}',
      explanation: [
        'Setting show.value = true schedules the v-if element to render.',
        'await nextTick() waits for that render to flush.',
        'After the await, the conditionally rendered element exists in the DOM.',
        'This is the canonical pattern for acting on newly rendered nodes.',
      ],
    },
    intermediate: {
      label: 'Intermediate — focus a newly shown input',
      lang: 'vue',
      code: '<script setup>\nimport { ref, nextTick } from \'vue\'\nconst editing = ref(false)\nconst inputEl = ref(null)\n\nasync function startEdit() {\n  editing.value = true\n  await nextTick()        // wait for <input> to be rendered\n  inputEl.value?.focus()  // now the ref is populated\n}\n</script>\n\n<template>\n  <button v-if="!editing" @click="startEdit">Edit</button>\n  <input v-else ref="inputEl" />\n</template>',
      explanation: [
        'The <input> only exists after editing becomes true and Vue re-renders.',
        'Without nextTick, inputEl.value is still null and focus() would throw.',
        'await nextTick() guarantees the template ref is populated.',
        'Focusing a just-rendered input is the most common real-world use of nextTick.',
      ],
    },
    advanced: {
      label: 'Advanced — measuring after a data-driven layout change',
      lang: 'js',
      code: 'import { ref, nextTick, watch } from \'vue\'\n\nconst items = ref([])\nconst listEl = ref(null)\n\nwatch(items, async () => {\n  await nextTick()                 // DOM now has the new items\n  const h = listEl.value.scrollHeight\n  listEl.value.scrollTop = h       // scroll to bottom after items added\n})',
      explanation: [
        'Adding items changes the DOM height, but only after the flush.',
        'await nextTick() inside the watcher ensures scrollHeight is accurate.',
        'You then scroll to the bottom — a chat/log auto-scroll pattern.',
        'Reading scrollHeight before nextTick would use stale, pre-update dimensions.',
        'The watcher itself runs in the pre-render phase by default, so nextTick is needed.',
      ],
    },
    realProject: {
      label: 'Real project — auto-scroll a chat window on new message',
      lang: 'vue',
      code: '<script setup>\nimport { ref, nextTick, watch } from \'vue\'\nconst messages = ref([])\nconst scroller = ref(null)\n\nwatch(\n  () => messages.value.length,\n  async () => {\n    await nextTick()              // wait for the new bubble to render\n    const el = scroller.value\n    if (el) el.scrollTop = el.scrollHeight\n  }\n)\n\nfunction send(text) {\n  messages.value.push({ id: Date.now(), text })\n}\n</script>\n\n<template>\n  <div ref="scroller" class="chat">\n    <div v-for="m in messages" :key="m.id">{{ m.text }}</div>\n  </div>\n</template>',
      explanation: [
        'Pushing a message re-renders the list, but the new bubble is not in the DOM synchronously.',
        'await nextTick() inside the watcher waits for the bubble to render.',
        'Only then is scrollHeight correct, so the auto-scroll lands at the true bottom.',
        'This exact pattern powers chat apps, log viewers, and notification feeds.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is nextTick and why does it exist?',
      answer: 'nextTick defers a callback (or resolves a Promise) until after Vue has flushed pending reactive updates to the DOM. It exists because Vue updates the DOM asynchronously in batches, so the DOM is not current immediately after a state change.',
      explanation: 'The key phrase is "asynchronous, batched DOM updates" — that is why nextTick is needed at all.',
    },
    {
      level: 'beginner',
      question: 'Why does the DOM not update immediately when I change a ref?',
      answer: 'Vue queues the affected render effects and flushes them once per tick as a microtask, coalescing multiple synchronous changes into a single DOM update for performance.',
      explanation: 'Mentioning batching/deduplication for performance shows you understand the motivation, not just the symptom.',
    },
    {
      level: 'intermediate',
      question: 'Both callback and Promise forms exist — how do you use them?',
      answer: 'You can pass a callback: nextTick(() => {...}); or await the returned Promise: await nextTick(). In <script setup>/async functions the await form is cleaner.',
      explanation: 'Knowing it returns a Promise (awaitable) is the modern idiom and a common follow-up.',
    },
    {
      level: 'intermediate',
      question: 'What is a real scenario where you must use nextTick?',
      answer: 'Focusing an input that was just shown via v-if, measuring an element\'s size after content changed, or auto-scrolling a list to the bottom after adding items — anything that reads the DOM after a reactive change.',
      explanation: 'Concrete DOM-reading examples demonstrate practical understanding.',
    },
    {
      level: 'advanced',
      question: 'Does nextTick use setTimeout? Why does the mechanism matter?',
      answer: 'No — it uses microtasks (Promise.then), the same queue Vue uses to flush updates. Microtasks run after the current synchronous code but before the next paint and before macrotasks, so nextTick fires right after the DOM patch and before the browser repaints.',
      explanation: 'Distinguishing microtasks from setTimeout (macrotask) and tying it to paint timing is the senior signal.',
    },
    {
      level: 'senior',
      question: 'How does nextTick relate to Vue\'s scheduler and watcher flush timing?',
      answer: 'The scheduler queues render effects and flushes them in a microtask; nextTick attaches after that flush. Watchers default to pre-render (flush: \'pre\'), so the DOM is stale inside them — you await nextTick to read post-update DOM, or use flush: \'post\' watchers which already run after the DOM update.',
      explanation: 'Connecting nextTick to flush: \'pre\'/\'post\' watcher timing shows deep mastery of the update cycle.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between nextTick and setTimeout(fn, 0)?',
    'Does nextTick return a Promise? (yes)',
    'How does nextTick relate to flush: \'post\' watchers?',
    'Why does Vue batch DOM updates instead of applying them synchronously?',
    'What happens if you mutate state inside a nextTick callback?',
    'Is nextTick a microtask or a macrotask?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Reading the DOM (or a template ref to a v-if element) immediately after changing state.',
      why: 'The DOM update is queued, not synchronous, so you read stale values or a null ref.',
      fix: 'await nextTick() (or use a callback) before reading/measuring the DOM.',
    },
    {
      mistake: 'Using setTimeout(fn, 0) instead of nextTick.',
      why: 'setTimeout is a macrotask that runs after paint and is less precise; it works "by accident" and can cause flicker.',
      fix: 'Use nextTick, which is a microtask tied to the actual update flush.',
    },
    {
      mistake: 'Calling nextTick before changing the state.',
      why: 'If there is nothing queued, the callback runs without the change applied.',
      fix: 'Mutate the reactive state first, THEN await nextTick().',
    },
    {
      mistake: 'Assuming a default watcher sees the updated DOM.',
      why: 'Watchers default to flush: \'pre\', running before the DOM patch, so the DOM is stale inside them.',
      fix: 'await nextTick() inside the watcher, or declare it with flush: \'post\'.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Focus management: focusing an input/modal that appears via v-if requires awaiting nextTick so the element exists.' },
    { area: 'Vue', detail: 'Chat/log/feed auto-scroll: await nextTick after pushing items, then set scrollTop = scrollHeight.' },
    { area: 'Component library', detail: 'Components that measure their own size (tooltips, popovers, virtual lists) await nextTick before reading getBoundingClientRect.' },
    { area: 'Nuxt', detail: 'On client navigation, awaiting nextTick before triggering scroll/focus ensures the new view is rendered (paired with flush: \'post\' patterns).' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Batching (the reason nextTick exists) coalesces many synchronous mutations into one DOM update, avoiding redundant patches.',
      'Microtask-based timing is cheaper and tighter than timers, with no extra event-loop turn.',
    ],
    bad: [
      'Doing heavy DOM reads (layout-thrashing) inside nextTick callbacks can force synchronous reflows.',
      'Chaining many nextTicks to "wait long enough" is a code smell that adds latency and fragility.',
    ],
    optimizations: [
      'Batch DOM reads then writes to avoid layout thrashing inside nextTick callbacks.',
      'Prefer flush: \'post\' watchers when you always need post-update DOM, avoiding manual nextTick.',
      'Avoid nesting multiple nextTicks; restructure so a single await suffices.',
      'Only read what you need from the DOM to minimize forced reflows.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'reactivity-render-link', 'template-refs'],
    nextConcepts: ['watch', 'watch-vs-watcheffect', 'lifecycle-hooks-composition'],
    dependencyNote:
      'nextTick only makes sense once you understand that reactivity drives renders asynchronously (reactivity-render-link). It pairs with template-refs (the things you read after an update) and with watcher flush timing.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write three count++ lines and note they all queue ONE render job.',
      'Draw "current call stack ends" then a microtask flushJobs() that patches the DOM.',
      'Draw a second microtask: the nextTick callback, AFTER the patch.',
      'Mark "browser paint" after both microtasks.',
      'Say: "The DOM is only current after the flush microtask, so nextTick runs after it — that is why we await it before reading the DOM."',
    ],
    diagram: `  change state ──► render job queued (deduped)
       sync ends
          │ microtask 1: flush → patch DOM
          │ microtask 2: nextTick cb (DOM fresh)
          ▼ paint`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue updates the DOM asynchronously: reactive changes queue render effects that flush once per tick as a microtask, coalescing many changes into one patch. So the DOM is stale right after a state change. nextTick defers your callback (or resolves its Promise) until after that flush, so the DOM is current. Use it to focus a just-shown input, measure an element, or auto-scroll after adding items. It is a microtask (Promise.then), not setTimeout, so it runs after the patch but before paint.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'nextTick exists because Vue does not update the DOM synchronously. When you mutate reactive state, Vue does not immediately re-render; it pushes the affected component render effects into a scheduler queue, deduplicates them, and schedules a single flush as a microtask using Promise.then. This batching means that if you change a ref three times in a row, Vue patches the DOM once, which is great for performance. The consequence is that immediately after a state change, the DOM still shows the old value, and a template ref to an element created by v-if may still be null. nextTick is the supported way to wait: it attaches your callback onto the same microtask chain, scheduled after the flush, so by the time it runs the DOM reflects the latest state. It returns a Promise, so the modern idiom is await nextTick() inside an async function, though you can also pass a callback. Typical uses are focusing an input that just appeared, measuring an element\'s height after its content changed, and auto-scrolling a chat or log to the bottom after pushing a new item. An important detail is that it uses microtasks, not setTimeout — microtasks run after the current synchronous code but before the next browser paint and before macrotasks, so nextTick fires right after the DOM patch and before the user sees a flicker, which is why setTimeout(0) is an inferior hack. Finally, it connects to watcher timing: watchers default to flush pre, meaning they run before the DOM patch, so the DOM is stale inside them; you either await nextTick there or declare the watcher with flush post, which already runs after the update.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Batching improves performance but introduces the async gap that nextTick fills — you trade synchronous predictability for fewer patches.',
      'Manual nextTick vs flush: \'post\' watchers: the latter is cleaner when you always need post-DOM state, the former is ad hoc.',
    ],
    edgeCases: [
      'Calling nextTick with no pending update still resolves on the next microtask — useful but can surprise.',
      'Mutating state inside a nextTick callback schedules another flush (another tick).',
      'Default (pre) watchers see stale DOM; post watchers and onMounted see updated DOM.',
      'SSR: nextTick resolves but there is no DOM, so DOM-reading code must be client-guarded.',
    ],
    runtimeBehavior: [
      'Uses the microtask queue (Promise.then), running before paint and before macrotasks/timers.',
      'The scheduler dedupes jobs per component so repeated mutations cause one render.',
      'nextTick promise resolution is sequenced after the flush job within the same tick.',
    ],
    scalability: [
      'Heavy synchronous DOM reads in nextTick callbacks can cause layout thrashing on large trees — batch reads/writes.',
      'Chains of nextTick to wait for multi-stage renders are fragile; prefer explicit post watchers or lifecycle hooks.',
    ],
    productionConcerns: [
      'Auto-scroll/focus bugs are usually missing nextTick awaits — a common review catch.',
      'Tests often must await nextTick (or flushPromises) before asserting DOM, a frequent flaky-test cause.',
      'Avoid setTimeout hacks; standardize on nextTick or post watchers for post-update DOM logic.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Vue updates the DOM async, batched, once per tick (microtask).',
    'DOM is stale immediately after a state change.',
    'nextTick runs your code AFTER the DOM flush.',
    'Returns a Promise → await nextTick(); also accepts a callback.',
    'It is a microtask (Promise.then), NOT setTimeout.',
    'Mutate state FIRST, then await nextTick().',
    'Use for: focus, measure, auto-scroll after a change.',
    'Default watchers (flush: pre) see stale DOM.',
    'flush: \'post\' watchers run after the DOM update (no manual nextTick).',
    'Multiple sync mutations coalesce into one render (dedup).',
    'In tests, await nextTick before asserting DOM.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'In setup(), increment a ref `n`, then log the updated text content of a span (template ref `el`) only after the DOM updates.',
      hint: 'await nextTick() between the mutation and the read.',
      solution: {
        lang: 'js',
        code: 'import { ref, nextTick } from \'vue\'\nexport default {\n  setup() {\n    const n = ref(0)\n    const el = ref(null)\n    async function inc() {\n      n.value++\n      await nextTick()\n      console.log(el.value.textContent)\n    }\n    return { n, el, inc }\n  },\n}',
        explanation: ['await nextTick() waits for the DOM patch.', 'After it, el.textContent shows the new value.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Toggle `editing` to true and focus a newly rendered <input ref="box"> after it appears.',
      hint: 'The input only exists after the re-render; await nextTick before focus.',
      solution: {
        lang: 'js',
        code: 'import { ref, nextTick } from \'vue\'\nexport default {\n  setup() {\n    const editing = ref(false)\n    const box = ref(null)\n    async function edit() {\n      editing.value = true\n      await nextTick()\n      box.value?.focus()\n    }\n    return { editing, box, edit }\n  },\n}',
        explanation: [
          'Without nextTick, box.value is null because the input is not yet rendered.',
          'After awaiting, the ref is populated and focus() works.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a watcher on `messages.length` that auto-scrolls a container (ref `scroller`) to the bottom after a new message renders.',
      hint: 'await nextTick inside the watcher, then set scrollTop = scrollHeight.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch, nextTick } from \'vue\'\nexport default {\n  setup() {\n    const messages = ref([])\n    const scroller = ref(null)\n    watch(() => messages.value.length, async () => {\n      await nextTick()\n      const el = scroller.value\n      if (el) el.scrollTop = el.scrollHeight\n    })\n    return { messages, scroller }\n  },\n}',
        explanation: [
          'Default watchers run before the DOM patch, so scrollHeight would be stale.',
          'await nextTick makes scrollHeight reflect the newly rendered message.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain (with a tiny snippet) why count.value++ ten times in a loop causes only one render, and how to read the final DOM value.',
      hint: 'Mention scheduler dedup; await nextTick to read after flush.',
      solution: {
        lang: 'js',
        code: 'import { ref, nextTick } from \'vue\'\nexport default {\n  setup() {\n    const count = ref(0)\n    const el = ref(null)\n    async function bump() {\n      for (let i = 0; i < 10; i++) count.value++ // schedules ONE render (deduped)\n      // DOM still shows old value here\n      await nextTick()                            // flush happens\n      return el.value.textContent                 // shows 10\n    }\n    return { count, el, bump }\n  },\n}',
        explanation: [
          'All ten mutations queue the same render effect, which the scheduler dedupes to a single flush.',
          'The DOM only reflects 10 after the microtask flush, so we await nextTick to read it.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'nextTick is a high-frequency interview topic because it reveals whether you truly understand Vue\'s asynchronous, batched update model. Getting it right also eliminates a whole class of flaky DOM-timing bugs in real apps.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is nextTick and when do you use it". Product companies (Zoho, Flipkart, Razorpay) ask why the DOM is not updated synchronously and to write a focus/auto-scroll snippet. FAANG-level interviews probe microtask vs macrotask timing and how nextTick relates to the scheduler and flush: \'post\' watchers.',
    whatInterviewersExpect:
      'They expect you to explain batched async updates, use await nextTick() correctly (mutate then await then read), distinguish it from setTimeout (microtask vs macrotask), and connect it to watcher flush timing.',
  },
}

export default nextTick
