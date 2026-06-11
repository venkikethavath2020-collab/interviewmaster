import type { ConceptLesson } from '../../../types/lesson'

const eventSystem: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-system',
  name: 'Event Propagation',
  category: 'browser-dom',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Event propagation is the rule that decides WHICH handlers fire and in WHAT order when you click an element — without it, nested clickable UI would be chaos.',
    'It is the foundation of event delegation: catching events on a parent instead of attaching hundreds of listeners, which is how high-performance lists and tables work.',
    'Misunderstanding capturing vs bubbling causes real bugs: handlers firing in the wrong order, modals that close when they should not, and `stopPropagation` that breaks unrelated features.',
    'Interviewers love it because it tests whether you understand the DOM as a tree and how the browser dispatches a single event through three phases.',
    'Frameworks (Vue `@click`, React synthetic events) and libraries all build on these phases, so debugging framework event quirks requires knowing the underlying model.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An event is like a note dropped at your desk that travels down to you, then back up through everyone above you.',
    story: [
      'Imagine a school with the principal at the top, then a teacher, then you at your desk — like boxes inside boxes.',
      'When something happens at your desk, a messenger first walks DOWN from the principal, past the teacher, to reach you. That trip down is called "capturing".',
      'The moment the messenger reaches your desk, that is the "target".',
      'Then the messenger walks back UP — past the teacher, then the principal — telling each of them what happened. That trip up is called "bubbling". Anyone along the way can react, and anyone can even tell the messenger to stop and go no further.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'HTML elements are nested inside each other like boxes within boxes. A button sits inside a div, which sits inside the body.',
    'When you click the button, the browser does not just tell the button. It sends the event on a journey through all the boxes.',
    'First it travels from the outermost box down to the clicked element (capturing phase), then it travels back up from the element to the outermost box (bubbling phase).',
    'Any box on that path can have a listener that reacts. Most code listens during the upward bubbling trip, which is why a click on a child can be handled by its parent.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Event propagation is the three-phase process by which a dispatched DOM event travels through the document tree: the capturing phase (root → target), the target phase (at the element), and the bubbling phase (target → root). Listeners can run in the capturing or bubbling phase.',
    how: 'You attach listeners with `addEventListener(type, handler, options)`. By default the handler runs during bubbling; pass `{ capture: true }` (or `true`) to run it during capturing. `event.target` is what was clicked; `event.currentTarget` is the element the handler is attached to.',
    why: 'Propagation lets a single parent handle events from many children (delegation), lets layered UI coordinate, and gives you control points (`stopPropagation`, `preventDefault`) to shape behavior.',
    code: {
      label: 'Watching the three phases',
      lang: 'js',
      code: `// HTML: <div id="outer"><button id="btn">Click</button></div>\nconst outer = document.getElementById('outer')\nconst btn = document.getElementById('btn')\n\nouter.addEventListener('click', () => console.log('outer CAPTURE'), true)\nbtn.addEventListener('click', () => console.log('button TARGET'))\nouter.addEventListener('click', () => console.log('outer BUBBLE'))\n\n// Clicking the button logs:\n// outer CAPTURE\n// button TARGET\n// outer BUBBLE`,
      explanation: [
        'The third argument `true` registers the outer handler for the CAPTURING phase, so it runs first on the way down.',
        'The button handler runs at the TARGET phase when the event reaches the clicked element.',
        'The second outer handler (default options) runs during BUBBLING on the way back up.',
        'The fixed order — capture, target, bubble — is what "propagation" means.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Event propagation is the DOM event-flow algorithm in which a single dispatched event is delivered to listeners along the path between the document root and the event target. It proceeds in three phases: capturing (from the root down to the target\'s parent), at-target (the target itself), and bubbling (from the target back up to the root). Each listener is invoked according to the phase it registered for via the `capture` option. `event.stopPropagation()` halts traversal to further nodes, `event.stopImmediatePropagation()` also prevents remaining listeners on the same node, and `event.preventDefault()` cancels the default action without affecting propagation. Not all events bubble (e.g. `focus`, `blur`).',

  // 7. Internal Working
  internalWorking: [
    'When an event is dispatched (by user action or `dispatchEvent`), the browser computes the event path: the ordered list of ancestors from the document/window down to the target.',
    'Phase 1 — Capturing: the browser walks the path top-down (root → target parent), invoking any listeners registered with `capture: true` on each node.',
    'Phase 2 — At target: listeners on the target node fire; here capturing and bubbling listeners both run (registration order on the node decides relative order).',
    'Phase 3 — Bubbling: the browser walks the path bottom-up (target → root), invoking default (non-capturing) listeners on each node — but only if the event type bubbles.',
    'During any phase, `event.eventPhase`, `event.target` (origin), and `event.currentTarget` (current node) are set so handlers know context; `stopPropagation()` sets a flag that stops visiting subsequent nodes.',
    '`preventDefault()` sets a separate "canceled" flag; after propagation completes, the browser performs the default action (navigation, form submit, checkbox toggle) only if it was not canceled.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        document
           │   ▲
  CAPTURE  │   │  BUBBLE
  (down)   ▼   │  (up)
         <html>
           │   ▲
           ▼   │
         <div id="outer">
           │   ▲
           ▼   │
        <button id="btn">   ◄── TARGET (clicked here)

  Phase order:  CAPTURE (root→target) → TARGET → BUBBLE (target→root)
  stopPropagation() ✂ cuts the journey at the current node`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — target vs currentTarget',
      lang: 'js',
      code: `// HTML: <ul id="list"><li>A</li><li>B</li></ul>\nconst list = document.getElementById('list')\nlist.addEventListener('click', (e) => {\n  console.log('currentTarget:', e.currentTarget.id) // 'list' (always)\n  console.log('target:', e.target.textContent)      // 'A' or 'B' (what was clicked)\n})`,
      explanation: [
        '`currentTarget` is the element the listener is bound to — here always the `<ul>`.',
        '`target` is the actual element the user clicked — the specific `<li>`.',
        'Because clicks on `<li>` bubble up to `<ul>`, one listener handles all items.',
        'This target/currentTarget distinction is the heart of event delegation.',
      ],
    },
    intermediate: {
      label: 'Intermediate — stopPropagation and a click-outside modal',
      lang: 'js',
      code: `const modal = document.getElementById('modal')\nconst panel = document.getElementById('panel')\n\n// Clicks inside the panel must NOT close the modal\npanel.addEventListener('click', (e) => e.stopPropagation())\n\n// Clicks on the backdrop (which bubble up to modal) close it\nmodal.addEventListener('click', () => {\n  modal.style.display = 'none'\n})`,
      explanation: [
        'A click inside the panel calls `stopPropagation`, so the event never bubbles to the modal backdrop handler.',
        'A click on the backdrop reaches the modal handler and closes it.',
        'This is the canonical "click outside to close" pattern, powered entirely by bubbling.',
        'Overusing `stopPropagation` can silently break other features that rely on the event reaching the document, so use it deliberately.',
      ],
    },
    advanced: {
      label: 'Advanced — capturing phase to intercept before children',
      lang: 'js',
      code: `// Track all clicks app-wide BEFORE any component handles them\ndocument.addEventListener('click', (e) => {\n  analytics.track('click', { tag: e.target.tagName })\n}, { capture: true })\n\n// A child can still stop bubbling, but the capture listener already ran\ndocument.getElementById('secret')\n  .addEventListener('click', (e) => e.stopPropagation())`,
      explanation: [
        'Registering on `document` with `capture: true` runs during the downward phase, before any target/bubble handlers.',
        'This guarantees analytics sees the click even if a child later calls `stopPropagation` during bubbling.',
        'Capturing is rarer than bubbling but ideal for global interceptors and instrumentation.',
        'Note `stopPropagation` in capture phase would prevent the event from ever reaching the target.',
      ],
    },
    realProject: {
      label: 'Real project — Vue/React click-outside directive',
      lang: 'js',
      code: `// A reusable click-outside helper (Vue directive style)\nfunction onClickOutside(el, callback) {\n  function handler(e) {\n    if (!el.contains(e.target)) callback(e)\n  }\n  // listen on document during bubbling\n  document.addEventListener('click', handler)\n  return () => document.removeEventListener('click', handler)\n}\n\n// usage: close a dropdown when clicking anywhere outside it\nconst cleanup = onClickOutside(dropdownEl, () => closeDropdown())`,
      explanation: [
        'Clicks anywhere bubble up to `document`; the handler checks whether the click `target` is inside the element.',
        '`el.contains(e.target)` distinguishes inside vs outside clicks using the event path implicitly.',
        'Returning a cleanup function (remove the listener) prevents leaks — essential in component teardown (`onUnmounted`/`useEffect` cleanup).',
        'Vue\'s `v-click-outside` directives and React click-outside hooks implement exactly this.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between event bubbling and capturing?',
      answer: 'Capturing is the phase where the event travels from the document root down to the target; bubbling is the phase where it travels from the target back up to the root. By default listeners run during bubbling; pass `{capture:true}` to run during capturing.',
      explanation: 'Naming both directions and the default (bubbling) is the core expected answer.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between `event.target` and `event.currentTarget`?',
      answer: '`target` is the element where the event originated (what the user actually clicked); `currentTarget` is the element whose listener is currently running. In a delegated handler on a parent, `currentTarget` is the parent and `target` is the child.',
      explanation: 'This distinction is what makes delegation work and is a very common follow-up.',
    },
    {
      level: 'intermediate',
      question: 'What does `stopPropagation` do, and how is it different from `preventDefault`?',
      answer: '`stopPropagation` halts the event from traveling to further nodes in the propagation path, but the default action still happens. `preventDefault` cancels the browser\'s default action (like following a link or submitting a form) but does not stop propagation. They are independent.',
      explanation: 'Conflating these two is a classic mistake; strong candidates keep them separate.',
    },
    {
      level: 'intermediate',
      question: 'Do all events bubble?',
      answer: 'No. Most UI events (click, input, keydown) bubble, but some do not — `focus`, `blur`, and the load/error events on certain elements. The bubbling versions `focusin`/`focusout` exist when you need delegation for focus.',
      explanation: 'Knowing the exceptions and the focusin/focusout workaround shows depth.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between `stopPropagation` and `stopImmediatePropagation`?',
      answer: '`stopPropagation` prevents the event from reaching other nodes but still runs the remaining listeners on the current node. `stopImmediatePropagation` also prevents any other listeners on the same node from running.',
      explanation: 'This tests fine-grained understanding of how multiple listeners on one element are handled.',
    },
    {
      level: 'senior',
      question: 'How do framework synthetic event systems relate to native propagation?',
      answer: 'React historically attached a single root listener and re-implemented bubbling via a synthetic event system (delegation at the root). React 17+ attaches to the root container rather than document. This means `stopPropagation` on a native event may not stop React handlers and vice versa — mixing native and synthetic listeners requires care about which tree the event traverses.',
      explanation: 'Senior signal: connecting native propagation to framework delegation and the cross-system stopPropagation pitfalls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does event delegation use propagation? (parent listener + target check)',
    'Why might `stopPropagation` break analytics or click-outside handlers elsewhere?',
    'How do you delegate focus events given that `focus` does not bubble? (focusin/focusout)',
    'What is `event.composedPath()` and how does it relate to shadow DOM?',
    'In what order do multiple listeners on the same element fire?',
    'How does `{ once: true }` interact with propagation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Confusing `stopPropagation` with `preventDefault`.',
      why: 'They solve different problems — one stops the event traveling, the other cancels the default browser action.',
      fix: 'Use `preventDefault` to stop a link/form action; use `stopPropagation` only when you truly must keep ancestors from reacting.',
    },
    {
      mistake: 'Calling `stopPropagation` defensively/everywhere.',
      why: 'It silently breaks delegated handlers, analytics, and click-outside logic that rely on events reaching the document.',
      fix: 'Prefer checking `event.target` in the ancestor handler over stopping propagation in the child.',
    },
    {
      mistake: 'Expecting `focus`/`blur` to work with delegation.',
      why: 'Those events do not bubble, so a parent listener never sees them.',
      fix: 'Use the bubbling counterparts `focusin`/`focusout` for delegated focus handling.',
    },
    {
      mistake: 'Using `event.target` when you meant the bound element.',
      why: '`target` changes per click (the clicked child), so styling/logic based on it misfires in delegation.',
      fix: 'Use `event.currentTarget` for the bound element, or `event.target.closest(selector)` to find the intended item.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue compiles `@click` to native listeners and offers modifiers: `.stop` (stopPropagation), `.prevent` (preventDefault), `.capture` (capture phase), `.self` (only if target === currentTarget) — direct mappings to the propagation model.' },
    { area: 'React', detail: 'React delegates events at the root container and synthesizes bubbling; `e.stopPropagation()` works within the synthetic tree. Mixing `addEventListener` and React handlers can cause surprising ordering because they live in different propagation systems.' },
    { area: 'Node.js', detail: 'Node\'s EventEmitter is a flat pub/sub model with NO bubbling/capturing — a common interview contrast point: DOM events propagate through a tree, EventEmitter events do not.' },
    { area: 'Backend', detail: 'The mental model of phased propagation maps to middleware/interceptor chains (e.g. Express middleware) where a request flows through ordered handlers that can short-circuit — analogous to stopPropagation.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Delegation via bubbling lets one listener serve thousands of children, drastically cutting listener count and memory.',
      'Propagation lets you instrument globally with a single capturing listener instead of many.',
    ],
    bad: [
      'Very deep DOM trees mean each event traverses many nodes; expensive handlers on ancestors run for every descendant event.',
      'Attaching heavy logic in a high-frequency event (mousemove/scroll) on a bubbling path multiplies work.',
    ],
    optimizations: [
      'Delegate to the nearest stable ancestor rather than the deepest individual children.',
      'Keep handlers cheap; debounce/throttle high-frequency events.',
      'Use `event.target.closest(selector)` to filter quickly inside a delegated handler.',
      'Use passive listeners (`{ passive: true }`) for scroll/touch to avoid blocking the compositor.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'event-delegation'],
    nextConcepts: ['event-delegation', 'custom-events', 'debounce', 'throttle'],
    dependencyNote:
      'Event propagation is the mechanism that makes event-delegation possible and underlies custom-events dispatch; understanding the DOM tree is a prerequisite, and debounce/throttle commonly wrap propagating events.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw nested boxes: document → div → button, with the button as the clicked target.',
      'Draw a down arrow on the left labeled "CAPTURE (root → target)".',
      'Mark the button as "TARGET".',
      'Draw an up arrow on the right labeled "BUBBLE (target → root)".',
      'Add a scissors at one node to show `stopPropagation` cutting the path.',
      'Say: "One event, three phases. Default listeners run on the way up. target = clicked, currentTarget = bound element."',
    ],
    diagram: `   document ─┐ capture (down)   ▲ bubble (up)
     div    ─┤                   │
    button  ─▼  TARGET  ─────────┘
            ✂ stopPropagation cuts here`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A DOM event travels in three phases: capturing from the root down to the target, the target phase, then bubbling from the target back up to the root. Listeners run during bubbling by default; pass `{capture:true}` for capturing. `target` is what was clicked, `currentTarget` is where the listener sits — the basis of delegation. `stopPropagation` halts the journey (default action still runs); `preventDefault` cancels the default action (propagation continues). Some events like `focus`/`blur` do not bubble.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Event propagation describes how a single DOM event is delivered through the document tree. When you click an element, the browser first computes the path from the document root to the clicked target, then dispatches the event in three phases. The capturing phase goes top-down from the root to the target\'s parent; the target phase fires on the element itself; and the bubbling phase goes bottom-up from the target back to the root. By default `addEventListener` registers a bubbling-phase listener, so a click on a child can be handled by an ancestor — that\'s exactly what event delegation exploits, attaching one listener to a parent and using `event.target` to know which child was clicked, while `event.currentTarget` is the bound element. You control flow with two independent tools: `preventDefault` cancels the browser\'s default action like following a link, without stopping the event; `stopPropagation` halts travel to further nodes but does not cancel the default action. I use `stopPropagation` sparingly because it can break delegated handlers, analytics, and click-outside logic. Two gotchas worth mentioning: not all events bubble — `focus` and `blur` don\'t, so I use `focusin`/`focusout` for delegation — and framework synthetic events delegate at a root container, so native and synthetic `stopPropagation` don\'t always cross over.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Delegation (bubbling) reduces listeners and memory but centralizes logic, making it harder to reason about which child triggered what without `target` checks.',
      'Capturing interceptors are powerful for global instrumentation but can surprise other code if they cancel or alter events before targets see them.',
    ],
    edgeCases: [
      'Non-bubbling events (focus/blur, and historically scroll on elements) break naive delegation; use focusin/focusout.',
      'Shadow DOM retargets events; `event.target` is the host while `event.composedPath()` reveals the real internal path.',
      '`stopImmediatePropagation` blocks sibling listeners on the same node — subtle when multiple features bind to one element.',
      'Programmatically dispatched events via `dispatchEvent` follow the same phases but only bubble if `bubbles: true` was set.',
    ],
    runtimeBehavior: [
      'Listeners on the same node fire in registration order; capture and bubble listeners on the target both run during the target phase.',
      'Passive listeners cannot call `preventDefault`; the browser optimizes scrolling by not waiting on them.',
      '`stopPropagation` only stops further nodes — remaining listeners on the current node still run.',
    ],
    scalability: [
      'For large lists/tables/grids, a single delegated listener scales far better than per-row listeners and survives dynamic content without re-binding.',
      'Global capture listeners should be minimal and fast since they run for every event in the app.',
    ],
    productionConcerns: [
      'Over-eager `stopPropagation` is a common cause of "feature B broke when feature A shipped" bugs — audit it.',
      'Mixing native `addEventListener` with framework synthetic handlers leads to ordering/stopPropagation confusion.',
      'Leaked document-level listeners (click-outside, drag) cause memory growth; always remove on teardown.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Three phases: CAPTURE (root→target) → TARGET → BUBBLE (target→root).',
    'Default listeners run in the BUBBLE phase; `{capture:true}` for capture.',
    '`target` = element clicked; `currentTarget` = element listener is on.',
    '`stopPropagation` = stop travel to other nodes (default action still runs).',
    '`stopImmediatePropagation` = also stop other listeners on the same node.',
    '`preventDefault` = cancel default action (propagation continues).',
    'Not all events bubble: focus/blur don\'t → use focusin/focusout.',
    'Delegation = one parent listener + `target.closest(selector)`.',
    'Listeners on one node fire in registration order.',
    'Use `{passive:true}` for scroll/touch performance.',
    'Vue modifiers: .stop .prevent .capture .self map to these directly.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the console output when the button is clicked, given a capture listener on `outer`, a target listener on `btn`, and a bubble listener on `outer`.',
      hint: 'Order is capture, target, bubble.',
      solution: {
        lang: 'js',
        code: `outer.addEventListener('click', () => console.log('A'), true) // capture\nbtn.addEventListener('click', () => console.log('B'))          // target\nouter.addEventListener('click', () => console.log('C'))        // bubble\n// Output on click of btn:\n// A\n// B\n// C`,
        explanation: [
          'Capture (`true`) runs first on the way down → A.',
          'Target listener runs next → B.',
          'Bubble (default) runs last on the way up → C.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Implement a "click outside to close" for an element `box` that calls `onClose` only when clicking outside it.',
      hint: 'Listen on document and use box.contains(e.target).',
      solution: {
        lang: 'js',
        code: `function bindClickOutside(box, onClose) {\n  function handler(e) {\n    if (!box.contains(e.target)) onClose()\n  }\n  document.addEventListener('click', handler)\n  return () => document.removeEventListener('click', handler)\n}`,
        explanation: [
          'Every click bubbles to `document`, so the handler sees all clicks.',
          '`box.contains(e.target)` tells inside from outside without stopPropagation.',
          'Returning a cleanup function avoids leaking the listener.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Why does `focus` delegation fail and how do you fix it? Write a delegated handler that logs when any input inside a form gains focus.',
      hint: 'focus does not bubble; use focusin.',
      solution: {
        lang: 'js',
        code: `// WRONG: focus does not bubble, this never fires for children\n// form.addEventListener('focus', e => log(e.target))\n\n// RIGHT: focusin bubbles\nform.addEventListener('focusin', (e) => {\n  if (e.target.matches('input')) console.log('focused', e.target.name)\n})`,
        explanation: [
          '`focus` is non-bubbling, so a parent listener never receives it from children.',
          '`focusin` is the bubbling counterpart, enabling delegation.',
          'The `matches` check filters to inputs only.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build `delegate(parent, selector, type, handler)` that runs handler with `this` = matched element when an event of `type` from a descendant matching `selector` bubbles to `parent`.',
      hint: 'Use target.closest(selector) and confirm it is within parent.',
      solution: {
        lang: 'js',
        code: `function delegate(parent, selector, type, handler) {\n  function listener(e) {\n    const match = e.target.closest(selector)\n    if (match && parent.contains(match)) {\n      handler.call(match, e)\n    }\n  }\n  parent.addEventListener(type, listener)\n  return () => parent.removeEventListener(type, listener)\n}\n\n// usage\ndelegate(document.getElementById('list'), 'li', 'click', function (e) {\n  console.log('clicked', this.textContent)\n})`,
        explanation: [
          'A single listener on `parent` catches bubbled events from all descendants.',
          '`e.target.closest(selector)` finds the nearest matching ancestor of the actual click target (handles clicks on inner spans/icons).',
          'Confirming `parent.contains(match)` guards against matches outside the intended subtree.',
          'Calling `handler.call(match, e)` sets `this` to the matched element, mimicking direct binding while scaling to dynamic content.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Event propagation is the backbone of all DOM interactivity. Master it and delegation, click-outside, modals, drag-and-drop, and framework event quirks all become straightforward to reason about and debug.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "bubbling vs capturing" and "stopPropagation vs preventDefault". Product companies (Zoho, Flipkart, Razorpay) ask you to implement delegation or click-outside from scratch. FAANG-level interviews probe non-bubbling events, shadow DOM retargeting, and framework synthetic-event interactions.',
    whatInterviewersExpect:
      'They expect the three phases named in order, a clear `target` vs `currentTarget` distinction, the independence of `stopPropagation` and `preventDefault`, and a real example like delegation or a click-outside handler — bonus for noting non-bubbling events.',
  },
}

export default eventSystem
