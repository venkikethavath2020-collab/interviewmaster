import type { ConceptLesson } from '../../../types/lesson'

const customEvents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'custom-events',
  name: 'Custom Events & EventTarget',
  category: 'browser-dom',
  difficulty: 'intermediate',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Custom events let components communicate without tight coupling — a child can announce "something happened" and any listener can react, the foundation of decoupled UI.',
    'They power Web Components and framework component events (Vue\'s `$emit`, native custom elements), so understanding them demystifies how component messaging actually works.',
    '`EventTarget` is now a standard base class you can extend or instantiate, giving you a built-in, spec-compliant pub/sub system without a library.',
    'Without them you reach for shared globals or prop-drilling callbacks everywhere; custom events keep messaging explicit and observable.',
    'Interviewers use them to check whether you understand the difference between DOM events and Node\'s EventEmitter, and how data travels via `event.detail`.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A custom event is like ringing your own special doorbell that you invented, and anyone listening for that bell comes running.',
    story: [
      'Imagine you build a brand-new doorbell with a special tune that only your house uses.',
      'You can press it whenever you want, and you can even attach a little note to it, like "pizza arrived".',
      'Anyone who decided to listen for your special bell hears it ring and reads your note, then does something — maybe they come to get pizza.',
      'A custom event is exactly that: a signal you create and ring on purpose, optionally carrying a note (the data), and listeners react to it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'The browser already fires events like "click" and "keydown". But you can also invent your own event names, like "cart-updated".',
    'You create one with `new CustomEvent(name, { detail })` where `detail` is any data you want to send along.',
    'Then you "ring" it on an element using `element.dispatchEvent(event)`, and any code that did `addEventListener("cart-updated", ...)` on that element will run.',
    'This lets different parts of your code talk to each other by sending named messages, instead of calling each other directly.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A custom event is a developer-defined DOM event created with the `CustomEvent` constructor, optionally carrying arbitrary data in its `detail` property, dispatched via `EventTarget.dispatchEvent`. `EventTarget` is the base interface (which DOM nodes implement and which you can instantiate or subclass) providing `addEventListener`, `removeEventListener`, and `dispatchEvent`.',
    how: 'You build the event with `new CustomEvent("name", { detail, bubbles, cancelable })`, attach listeners with `addEventListener("name", handler)`, and fire it with `target.dispatchEvent(event)`. The handler reads payload data from `event.detail`. Any object that is an `EventTarget` (including `new EventTarget()`) can be the bus.',
    why: 'It provides a standard, decoupled publish/subscribe mechanism: emitters do not need to know who listens, and the same propagation/bubbling rules as native events apply on DOM elements.',
    code: {
      label: 'Create, dispatch, and listen',
      lang: 'js',
      code: `const cart = document.getElementById('cart')\n\n// 1) Listen for our custom event\ncart.addEventListener('item-added', (e) => {\n  console.log('Added:', e.detail.name, 'qty', e.detail.qty)\n})\n\n// 2) Create the event with a payload\nconst event = new CustomEvent('item-added', {\n  detail: { name: 'Book', qty: 2 },\n  bubbles: true,\n})\n\n// 3) Dispatch (fire) it\ncart.dispatchEvent(event)\n// logs: Added: Book qty 2`,
      explanation: [
        '`addEventListener("item-added", ...)` subscribes to a custom event name we invented.',
        '`new CustomEvent` builds the event; the `detail` object is the data payload.',
        '`bubbles: true` lets it propagate up the DOM like a click, so ancestors can listen too.',
        '`dispatchEvent` synchronously fires the event, running all matching listeners immediately.',
        '`e.detail` is the standard place to read custom data.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A CustomEvent is an Event subclass created via `new CustomEvent(type, { detail, bubbles, cancelable, composed })`, where `detail` carries an arbitrary payload. Events are delivered through `EventTarget`, the base interface exposing `addEventListener`, `removeEventListener`, and `dispatchEvent`; all DOM nodes implement it, and `EventTarget` is itself constructible (`new EventTarget()`) and subclassable. `dispatchEvent` invokes listeners synchronously following the standard capture/target/bubble propagation algorithm (bubbling only when `bubbles` is true), and returns `false` if the event was cancelable and `preventDefault` was called.',

  // 7. Internal Working
  internalWorking: [
    '`new CustomEvent(type, init)` constructs an Event object with the given `type`, copying `detail`, `bubbles`, `cancelable`, and `composed` from the init dictionary onto the immutable event.',
    'Listeners registered via `addEventListener(type, fn, options)` are stored on the target keyed by event type and phase (capture vs bubble).',
    '`target.dispatchEvent(event)` computes the propagation path (if `bubbles`) and synchronously invokes matching listeners in capture, target, then bubble order — the same algorithm as native events.',
    'Each invoked listener receives the event; `event.detail` exposes the payload and `event.target`/`currentTarget` are set per phase.',
    'If the event was created `cancelable: true` and a listener calls `preventDefault`, `dispatchEvent` returns `false`, letting the emitter detect a veto.',
    'Because dispatch is synchronous, all listeners finish before `dispatchEvent` returns — unlike Node\'s EventEmitter which is also synchronous by default but is a flat (non-tree) model.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   EMITTER                         LISTENERS
   ───────                         ─────────
   new CustomEvent('item-added',   addEventListener('item-added', h1)
     { detail:{...}, bubbles })    addEventListener('item-added', h2)
            │                              ▲
            ▼                              │ (synchronous)
   target.dispatchEvent(event) ───────────┘
            │
            ▼ (if bubbles: true)
   bubbles up the DOM tree → ancestors with the same listener also fire
   payload travels in event.detail`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a simple notification event',
      lang: 'js',
      code: `document.addEventListener('toast', (e) => {\n  showToast(e.detail.message, e.detail.type)\n})\n\nfunction notify(message, type = 'info') {\n  document.dispatchEvent(new CustomEvent('toast', {\n    detail: { message, type },\n  }))\n}\n\nnotify('Saved!', 'success')`,
      explanation: [
        'A single document-level listener handles all toast notifications.',
        '`notify` is a tiny API that any module can call to show a toast without importing the toast component.',
        'The `detail` carries the message and type — decoupling sender from receiver.',
        'This is a clean app-wide messaging pattern with zero dependencies.',
      ],
    },
    intermediate: {
      label: 'Intermediate — cancelable events (veto pattern)',
      lang: 'js',
      code: `const form = document.getElementById('form')\n\nform.addEventListener('before-submit', (e) => {\n  if (!isValid()) e.preventDefault() // veto the submit\n})\n\nfunction trySubmit() {\n  const ev = new CustomEvent('before-submit', { cancelable: true })\n  const allowed = form.dispatchEvent(ev) // false if preventDefault was called\n  if (allowed) doSubmit()\n}`,
      explanation: [
        'The event is created `cancelable: true`, allowing listeners to veto.',
        'A listener calls `preventDefault()` to block the action.',
        '`dispatchEvent` returns `false` when prevented, so the emitter can branch on it.',
        'This mirrors how native events like form `submit` allow cancellation.',
      ],
    },
    advanced: {
      label: 'Advanced — a standalone EventTarget pub/sub bus',
      lang: 'js',
      code: `// A framework-agnostic event bus using the built-in EventTarget\nclass EventBus extends EventTarget {\n  emit(type, detail) {\n    this.dispatchEvent(new CustomEvent(type, { detail }))\n  }\n  on(type, handler) {\n    this.addEventListener(type, handler)\n    return () => this.removeEventListener(type, handler)\n  }\n}\n\nconst bus = new EventBus()\nconst off = bus.on('user:login', (e) => console.log(e.detail.userId))\nbus.emit('user:login', { userId: 42 }) // logs 42\noff() // unsubscribe`,
      explanation: [
        '`EventTarget` is constructible and subclassable, so you get pub/sub with no library.',
        '`emit` wraps `dispatchEvent` + `CustomEvent`; `on` wraps `addEventListener` and returns an unsubscribe.',
        'No DOM is involved — this works anywhere `EventTarget` exists (browsers, Deno, modern Node).',
        'It is a clean alternative to Node\'s EventEmitter with the same synchronous semantics.',
      ],
    },
    realProject: {
      label: 'Real project — Web Component / Vue child-to-parent events',
      lang: 'js',
      code: `// A native Web Component emitting a custom event\nclass StarRating extends HTMLElement {\n  setRating(value) {\n    this.dispatchEvent(new CustomEvent('rate', {\n      detail: { value },\n      bubbles: true,    // so parents can listen\n      composed: true,   // so it escapes the shadow DOM\n    }))\n  }\n}\ncustomElements.define('star-rating', StarRating)\n\n// parent listens like any DOM event\ndocument.querySelector('star-rating')\n  .addEventListener('rate', (e) => save(e.detail.value))`,
      explanation: [
        'Web Components emit custom events to talk to their parents — the standard pattern.',
        '`bubbles: true` lets the event travel up to ancestor listeners.',
        '`composed: true` is required for the event to cross the shadow DOM boundary.',
        'Vue\'s `$emit("rate", value)` and React\'s callback props are higher-level versions of this same child-to-parent messaging.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you create and dispatch a custom event?',
      answer: 'Create it with `new CustomEvent("name", { detail: payload })`, then fire it with `target.dispatchEvent(event)`. Listen with `target.addEventListener("name", handler)` and read data from `event.detail`.',
      explanation: 'Naming the constructor, `detail`, and `dispatchEvent` covers the core mechanics.',
    },
    {
      level: 'beginner',
      question: 'How do you pass data with a custom event?',
      answer: 'Put it in the `detail` property of the init object: `new CustomEvent("x", { detail: { foo: 1 } })`, then read `event.detail.foo` in the listener.',
      explanation: '`detail` is the standardized payload channel — knowing the exact property name matters.',
    },
    {
      level: 'intermediate',
      question: 'What is `EventTarget` and why is it useful on its own?',
      answer: 'It is the base interface providing `addEventListener`, `removeEventListener`, and `dispatchEvent`. Every DOM node implements it, and it is constructible (`new EventTarget()`) and subclassable, so you can build a standards-based pub/sub bus without any library.',
      explanation: 'Recognizing EventTarget as a standalone, extensible primitive is a strong intermediate signal.',
    },
    {
      level: 'intermediate',
      question: 'Are custom events synchronous or asynchronous?',
      answer: 'Synchronous. `dispatchEvent` invokes all matching listeners immediately and only returns after they complete, unlike a `setTimeout`-deferred callback.',
      explanation: 'This catches people who assume event dispatch is queued like a macrotask.',
    },
    {
      level: 'advanced',
      question: 'How do `bubbles` and `composed` affect a custom event?',
      answer: '`bubbles: true` makes the event travel up the DOM tree so ancestors can listen (enabling delegation). `composed: true` lets the event cross shadow DOM boundaries; without it, the event is retargeted and stays within the shadow tree.',
      explanation: 'Shadow DOM crossing via `composed` is a Web Components nuance many miss.',
    },
    {
      level: 'senior',
      question: 'How do DOM custom events differ from Node\'s EventEmitter, and when would you choose each?',
      answer: 'DOM events propagate through a tree (capture/target/bubble), support cancellation/preventDefault, and require an EventTarget. EventEmitter is a flat, in-process pub/sub with arbitrary argument lists, `once`, and listener-count introspection, but no propagation. Use DOM custom events for UI/component messaging and Web Components; use EventEmitter for Node service/internal eventing where tree semantics are irrelevant.',
      explanation: 'Contrasting tree-based vs flat models and naming the right context is exactly the senior expectation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why use `event.detail` instead of attaching custom properties to the event?',
    'How do custom events interact with event delegation and bubbling?',
    'What does `composed: true` do for shadow DOM?',
    'How is this different from a global state store (Pinia/Redux) for cross-component messaging?',
    'How do you make a custom event cancelable and detect cancellation?',
    'How would you build a typed event bus in TypeScript on top of EventTarget?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting `bubbles: true` and expecting ancestors to receive the event.',
      why: 'By default custom events do not bubble, so only listeners on the exact dispatch target fire.',
      fix: 'Pass `{ bubbles: true }` when you want propagation/delegation to work.',
    },
    {
      mistake: 'Attaching payload data as ad-hoc properties on the event object.',
      why: 'Non-standard; tooling and other listeners expect data in `detail`, and some properties are read-only.',
      fix: 'Always put custom data in the `detail` field of the init dictionary.',
    },
    {
      mistake: 'Expecting custom-event listeners to be async/deferred.',
      why: '`dispatchEvent` is synchronous; long listener work blocks the dispatcher.',
      fix: 'If you need async behavior, defer inside the listener (e.g. `queueMicrotask`/`setTimeout`) or design listeners to be fast.',
    },
    {
      mistake: 'Custom event from a Web Component not reaching the parent.',
      why: 'Without `composed: true`, the event is retargeted and cannot cross the shadow DOM boundary.',
      fix: 'Set `{ bubbles: true, composed: true }` for events meant to be heard outside the shadow root.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Component events (`$emit`) are a higher-level abstraction over the same emit/listen idea; native custom elements built with Vue dispatch real CustomEvents that parents bind with `@event`.' },
    { area: 'React', detail: 'React uses callback props rather than native custom events, but interop with Web Components requires manually adding `addEventListener` for custom events since React doesn\'t bind unknown event names declaratively.' },
    { area: 'Node.js', detail: 'Modern Node exposes a global `EventTarget` and `CustomEvent`, but most Node code uses `EventEmitter` (flat pub/sub). The contrast — tree vs flat — is a frequent interview point.' },
    { area: 'Backend', detail: 'Standards-based `EventTarget` buses are used in isomorphic libraries so the same pub/sub code runs in browser and server without an EventEmitter dependency.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Decoupling via events avoids tightly-coupled call chains, keeping modules independent and easy to refactor.',
      'A single bubbling custom event plus delegation can replace many direct subscriptions.',
    ],
    bad: [
      'Synchronous dispatch means a slow listener blocks the emitter and the main thread.',
      'Over-using a global event bus makes data flow hard to trace and can cause accidental fan-out to many listeners.',
    ],
    optimizations: [
      'Keep listener bodies cheap; offload heavy work to microtasks or workers.',
      'Remove listeners on teardown to prevent leaks and stale handlers (return an unsubscribe).',
      'Prefer targeted dispatch over document-wide bubbling when only one consumer needs it.',
      'Use a typed wrapper to avoid stringly-typed event names and payload mismatches.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A bubbling custom event with sensitive data in `detail` can be observed by any ancestor listener, including third-party scripts on the page.',
      'Untrusted code on the same page can dispatch forged custom events to trigger your handlers.',
    ],
    bestPractices: [
      'Do not put secrets/tokens in `event.detail`; treat the page as a shared environment.',
      'Validate `event.detail` shape in handlers rather than trusting it blindly.',
      'Scope dispatch to the narrowest target and avoid bubbling for sensitive internal messaging.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'event-system'],
    nextConcepts: ['event-emitter', 'observer-pattern', 'event-delegation'],
    dependencyNote:
      'Custom events build on event-system (propagation) and are the DOM-native form of the observer-pattern; the EventTarget API parallels Node\'s event-emitter, making them natural next concepts.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write `new CustomEvent("item-added", { detail, bubbles })` on the left as the emitter.',
      'Draw `target.dispatchEvent(event)` firing it.',
      'On the right list two `addEventListener("item-added", ...)` listeners.',
      'Draw a synchronous arrow from dispatch to both listeners.',
      'If bubbles, draw the event traveling up to an ancestor listener too.',
      'Say: "EventTarget gives any object addEventListener/dispatchEvent; data rides in detail; dispatch is synchronous; bubbles enables delegation."',
    ],
    diagram: `  new CustomEvent('x', {detail, bubbles:true})
          │ dispatchEvent
          ▼
   listeners(x): h1 ─ h2   (run synchronously)
          │ (bubbles)
          ▼
   ancestor listener(x) also fires`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Custom events are developer-defined events: `new CustomEvent("name", { detail })` carries a payload, `target.dispatchEvent(event)` fires it synchronously, and `addEventListener("name", h)` subscribes, reading data from `event.detail`. They follow the same capture/target/bubble propagation as native events when `bubbles: true`. `EventTarget` is the constructible base interface, so you can build a standards-based pub/sub bus with no library. For Web Components, add `composed: true` to cross shadow DOM. The Node contrast is EventEmitter — flat, no tree propagation.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Custom events let you define and dispatch your own named DOM events. You build one with the `CustomEvent` constructor, passing an init object whose `detail` property carries any payload you want, plus flags like `bubbles` and `cancelable`. You fire it by calling `dispatchEvent` on any `EventTarget` — and `EventTarget` is the base interface every DOM node implements, exposing `addEventListener`, `removeEventListener`, and `dispatchEvent`. Listeners subscribe with `addEventListener("name", handler)` and read the payload from `event.detail`. Importantly, dispatch is synchronous: all matching listeners run before `dispatchEvent` returns. If you set `bubbles: true`, the event propagates up the tree exactly like a native click, so you can delegate it; if it\'s `cancelable`, a listener can call `preventDefault` and `dispatchEvent` returns false so the emitter knows it was vetoed. A neat modern point is that `EventTarget` is constructible and subclassable, so you can build a tiny, dependency-free pub/sub bus right on top of it. This is how Web Components talk to their parents — they emit custom events, adding `composed: true` so the event can escape the shadow DOM. The classic interview contrast is with Node\'s EventEmitter: DOM custom events propagate through a tree and support cancellation, whereas EventEmitter is a flat, in-process pub/sub with no propagation.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Event-bus decoupling improves modularity but makes control flow implicit and harder to trace than direct calls or a typed store.',
      'DOM custom events give tree propagation and cancellation but require an EventTarget; a plain EventEmitter is simpler when you don\'t need a tree.',
    ],
    edgeCases: [
      'Default `bubbles: false` surprises people expecting delegation to work.',
      'Shadow DOM retargets events; `composed: true` is required to cross the boundary and `composedPath()` reveals the internal path.',
      'Re-dispatching the same Event object can throw or behave unexpectedly; create a fresh event per dispatch.',
      'Listeners added during dispatch may or may not be invoked for the in-flight event depending on phase.',
    ],
    runtimeBehavior: [
      'Dispatch is synchronous and follows capture/target/bubble; a throwing listener does not stop other listeners but surfaces as an uncaught error.',
      '`preventDefault` only matters if the event was created `cancelable: true`.',
      'Memory: listeners hold references; un-removed listeners on long-lived targets leak.',
    ],
    scalability: [
      'A global bus can fan out to many listeners; for large apps prefer scoped buses or a typed event registry to avoid name collisions.',
      'For high-frequency signals, batching or debouncing dispatch prevents listener storms.',
    ],
    productionConcerns: [
      'Always provide and use an unsubscribe path; orphaned listeners are a top leak source in SPAs.',
      'Stringly-typed event names cause silent mismatches; wrap EventTarget in a typed API in TypeScript.',
      'Sensitive data in `detail` is observable by other scripts on the page — keep secrets out of events.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '`new CustomEvent(type, { detail, bubbles, cancelable, composed })`.',
    'Fire with `target.dispatchEvent(event)`; subscribe with `addEventListener`.',
    'Payload lives in `event.detail`.',
    'Dispatch is SYNCHRONOUS.',
    'Default `bubbles` is false — set true for propagation/delegation.',
    '`cancelable: true` + `preventDefault()` lets listeners veto; dispatch returns false.',
    '`composed: true` needed to cross shadow DOM.',
    '`EventTarget` is constructible/subclassable → DIY pub/sub bus.',
    'Web Components emit custom events to talk to parents.',
    'Node contrast: EventEmitter = flat pub/sub, no tree propagation.',
    'Always remove listeners on teardown (return an unsubscribe).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Dispatch a custom event "ping" on `document` carrying `{ at: Date.now() }`, and log the timestamp in a listener.',
      hint: 'Use CustomEvent detail and dispatchEvent.',
      solution: {
        lang: 'js',
        code: `document.addEventListener('ping', (e) => {\n  console.log('ping at', e.detail.at)\n})\ndocument.dispatchEvent(new CustomEvent('ping', { detail: { at: Date.now() } }))`,
        explanation: [
          'The listener reads the payload from `e.detail`.',
          '`new CustomEvent` carries `{ at }` in `detail`.',
          '`dispatchEvent` fires it synchronously.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build an `EventBus` class extending `EventTarget` with `emit(type, detail)` and `on(type, handler)` that returns an unsubscribe function.',
      hint: 'Wrap dispatchEvent/addEventListener.',
      solution: {
        lang: 'js',
        code: `class EventBus extends EventTarget {\n  emit(type, detail) {\n    this.dispatchEvent(new CustomEvent(type, { detail }))\n  }\n  on(type, handler) {\n    this.addEventListener(type, handler)\n    return () => this.removeEventListener(type, handler)\n  }\n}`,
        explanation: [
          'Extending `EventTarget` gives addEventListener/dispatchEvent for free.',
          '`emit` wraps the CustomEvent creation and dispatch.',
          '`on` returns a cleanup closure so callers can unsubscribe.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make a cancelable "before-close" event; if any listener calls preventDefault, do NOT close. Write `requestClose()`.',
      hint: 'dispatchEvent returns false when prevented.',
      solution: {
        lang: 'js',
        code: `function requestClose(el, doClose) {\n  const ev = new CustomEvent('before-close', { cancelable: true })\n  const allowed = el.dispatchEvent(ev)\n  if (allowed) doClose()\n}\n\n// a listener can veto:\n// el.addEventListener('before-close', e => { if (hasUnsaved()) e.preventDefault() })`,
        explanation: [
          'The event is `cancelable: true`, so `preventDefault` is meaningful.',
          '`dispatchEvent` returns `false` when a listener prevented default.',
          'We only close when the dispatch was allowed.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a Web Component `<toggle-switch>` that dispatches a bubbling, composed "toggle" event with `{ on: boolean }` when clicked.',
      hint: 'Use HTMLElement + CustomEvent with bubbles and composed.',
      solution: {
        lang: 'js',
        code: `class ToggleSwitch extends HTMLElement {\n  connectedCallback() {\n    this.on = false\n    this.addEventListener('click', () => {\n      this.on = !this.on\n      this.dispatchEvent(new CustomEvent('toggle', {\n        detail: { on: this.on },\n        bubbles: true,\n        composed: true,\n      }))\n    })\n  }\n}\ncustomElements.define('toggle-switch', ToggleSwitch)\n\n// parent\ndocument.querySelector('toggle-switch')\n  .addEventListener('toggle', (e) => console.log(e.detail.on))`,
        explanation: [
          'The component flips its state on click and emits a `toggle` custom event.',
          '`bubbles: true` lets ancestors listen via delegation.',
          '`composed: true` allows the event to escape the shadow DOM boundary.',
          'The parent reads the new state from `e.detail.on` — clean child-to-parent messaging.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Custom events and EventTarget are how decoupled, component-based UIs communicate at the platform level. Knowing them lets you build dependency-free pub/sub, integrate Web Components, and reason about framework event systems.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "how do you create and dispatch a custom event" and "what is event.detail". Product companies (Zoho, Flipkart, Razorpay) ask you to build a small event bus or wire up component communication. FAANG-level interviews probe bubbling/composed, shadow DOM, cancellation, and the EventTarget-vs-EventEmitter contrast.',
    whatInterviewersExpect:
      'They expect the CustomEvent + detail + dispatchEvent mechanics, awareness that dispatch is synchronous, the role of `bubbles`/`composed`, and the ability to build a pub/sub bus on EventTarget — bonus for contrasting it with Node\'s EventEmitter.',
  },
}

export default customEvents
