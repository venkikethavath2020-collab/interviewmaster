import type { ConceptLesson } from '../../../types/lesson'

const eventDelegation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'event-delegation',
  name: 'Event Delegation',
  category: 'browser-dom',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Event delegation lets you handle events for many (even thousands of) elements with a SINGLE listener on a common ancestor — a huge memory and performance win.',
    'It automatically handles dynamically added/removed children: you never re-bind listeners when the list changes, which eliminates a whole class of bugs.',
    'It is one of the most asked intermediate front-end questions because it proves you understand event bubbling and can apply it pragmatically.',
    'Without it, large lists, tables, and grids attach a listener per row, bloating memory and slowing teardown — and break when rows are added later.',
    'Frameworks use delegation internally (React attaches at a root, libraries delegate too), so understanding it demystifies framework event behavior.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Instead of giving every kid in class their own teacher, one teacher at the front watches the whole class and answers whoever raises a hand.',
    story: [
      'Imagine a classroom with 30 students. You could hire 30 helpers, one per student, to listen for each question — that is wasteful.',
      'Instead, one teacher stands at the front and listens to the whole room. When any student raises a hand, the teacher looks to see WHO it was and helps that student.',
      'If a new student joins the class later, you do not need a new helper — the same teacher already listens to everyone.',
      'Event delegation is that one teacher: a single listener on the parent that figures out which child the event came from.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you click something on a page, the click "bubbles" upward through all the parent elements.',
    'Because of that, a parent element can hear clicks that actually happened on its children.',
    'So instead of attaching a click handler to every single button or list item, you attach ONE handler to the parent and check which child was clicked.',
    'This saves memory, and it keeps working even when you add new children later, because the parent was listening the whole time.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Event delegation is a pattern where you attach a single event listener to a common ancestor element and use event bubbling plus `event.target` to handle events that originate from its descendants — instead of attaching a listener to each descendant.',
    how: 'You bind one listener to the parent. Inside it, you inspect `event.target` (the element actually clicked) and use `target.closest(selector)` or `target.matches(selector)` to determine whether it is an element you care about, then act on it.',
    why: 'It reduces the number of listeners (less memory, faster setup/teardown), and it transparently handles elements added or removed after binding, because the parent listener never changes.',
    code: {
      label: 'One listener for a whole list',
      lang: 'js',
      code: `// HTML: <ul id="todos"><li data-id="1">Buy milk</li>...</ul>\nconst list = document.getElementById('todos')\n\nlist.addEventListener('click', (e) => {\n  const li = e.target.closest('li')\n  if (!li) return            // clicked the gap, ignore\n  console.log('Toggled todo', li.dataset.id)\n  li.classList.toggle('done')\n})\n\n// Adding a new item later needs NO new listener:\nlist.insertAdjacentHTML('beforeend', '<li data-id=\"99\">New task</li>')`,
      explanation: [
        'A single `click` listener is bound to the `<ul>`, not to each `<li>`.',
        'Clicks on any `<li>` bubble up to the `<ul>`, where the handler runs.',
        '`e.target.closest(\'li\')` finds the list item even if the user clicked an inner element (like a span or icon).',
        'The early `return` ignores clicks that did not hit a list item.',
        'The newly inserted `<li>` works immediately — no re-binding needed, which is delegation\'s superpower.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Event delegation is a DOM event-handling technique that leverages the bubbling phase of event propagation: a single listener is registered on an ancestor element, and events dispatched on its descendants bubble up to it. The handler uses `event.target` together with selector matching (`Element.matches` / `Element.closest`) to identify the originating element and dispatch logic accordingly. It trades per-element listener registration for a single listener plus runtime target resolution, improving memory usage and enabling handling of dynamically inserted nodes without re-binding.',

  // 7. Internal Working
  internalWorking: [
    'A single listener is attached to an ancestor (often the nearest stable container, sometimes `document`).',
    'When a descendant is interacted with, the browser dispatches the event and it bubbles up the path from the target toward the root.',
    'When bubbling reaches the ancestor with the delegated listener, that listener is invoked with `event.currentTarget` = the ancestor and `event.target` = the original descendant.',
    'The handler calls `event.target.closest(selector)` which walks from the target up the ancestor chain to find the nearest element matching the intended pattern (handling clicks on nested children/icons).',
    'If a match within the container is found, the handler executes the relevant logic, often reading `data-*` attributes to identify the item.',
    'Because the listener lives on the container, descendants added after binding automatically participate — their future events still bubble to the same listener.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Without delegation            With delegation
   ─────────────────            ────────────────
   <ul>  (no listener)          <ul> ◄── ONE listener
    ├ <li> [listener]            ├ <li>
    ├ <li> [listener]            ├ <li>        click bubbles
    ├ <li> [listener]            ├ <li>   ▲    up to <ul>,
    └ <li> [listener]            └ <li> ──┘    handler reads
   N listeners, re-bind on add   1 listener,   e.target.closest('li')
                                 works for new items too`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — delegated button clicks',
      lang: 'js',
      code: `// HTML: <div id="toolbar"><button data-action="save">Save</button>\n//        <button data-action="delete">Delete</button></div>\nconst toolbar = document.getElementById('toolbar')\n\ntoolbar.addEventListener('click', (e) => {\n  const btn = e.target.closest('button')\n  if (!btn) return\n  const action = btn.dataset.action\n  if (action === 'save') save()\n  else if (action === 'delete') remove()\n})`,
      explanation: [
        'One listener on the toolbar handles every button.',
        '`closest(\'button\')` resolves the clicked button even if it contains an icon span.',
        'The `data-action` attribute carries the intent, keeping logic data-driven.',
        'Adding a new toolbar button later requires no new listener.',
      ],
    },
    intermediate: {
      label: 'Intermediate — distinguishing actions within a row',
      lang: 'js',
      code: `// HTML: <table id="users"><tr data-id="7">\n//   <td>Asha</td><td><button class="edit">Edit</button>\n//   <button class="del">Delete</button></td></tr>...</table>\nconst table = document.getElementById('users')\n\ntable.addEventListener('click', (e) => {\n  const row = e.target.closest('tr')\n  if (!row) return\n  const id = row.dataset.id\n  if (e.target.matches('.edit')) editUser(id)\n  else if (e.target.matches('.del')) deleteUser(id)\n})`,
      explanation: [
        'One listener handles an entire table of rows and their action buttons.',
        '`closest(\'tr\')` finds the row to extract its `data-id`.',
        '`matches(\'.edit\')` / `matches(\'.del\')` distinguishes WHICH action button was clicked.',
        'This scales to thousands of rows with a single listener and survives pagination/sorting that re-renders rows.',
      ],
    },
    advanced: {
      label: 'Advanced — a reusable delegate() utility',
      lang: 'js',
      code: `function delegate(root, selector, type, handler) {\n  function listener(e) {\n    const match = e.target.closest(selector)\n    if (match && root.contains(match)) handler.call(match, e)\n  }\n  root.addEventListener(type, listener)\n  return () => root.removeEventListener(type, listener)\n}\n\n// usage\nconst off = delegate(document.body, '[data-modal-open]', 'click', function () {\n  openModal(this.dataset.modalOpen)\n})\n// later: off()  // remove the single listener`,
      explanation: [
        'A generic helper that delegates any event `type` and `selector` from a `root`.',
        '`closest(selector)` plus a `root.contains` check ensures we only handle matches inside the intended subtree.',
        '`handler.call(match, e)` binds `this` to the matched element, mimicking a directly-attached listener.',
        'Returning an unbind function makes cleanup a one-liner — important for SPA teardown.',
      ],
    },
    realProject: {
      label: 'Real project — delegated list in Node-served + Vue/React app',
      lang: 'js',
      code: `// React idiom: delegate within a component instead of mapping handlers per item\nfunction TodoList({ todos, onToggle }) {\n  function handleClick(e) {\n    const li = e.target.closest('li[data-id]')\n    if (li) onToggle(li.dataset.id)\n  }\n  return (\n    <ul onClick={handleClick}>\n      {todos.map(t => <li key={t.id} data-id={t.id}>{t.text}</li>)}\n    </ul>\n  )\n}`,
      explanation: [
        'Instead of giving each `<li>` its own `onClick`, one handler on the `<ul>` covers all items.',
        'This avoids creating a new closure per item on every render — a real performance concern in large lists.',
        '`data-id` carries the identity so the parent handler knows which item was clicked.',
        'The same pattern in Vue uses a single `@click` on the container; both rely on native bubbling.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is event delegation?',
      answer: 'It is attaching a single event listener to a parent element and using event bubbling plus `event.target` to handle events from its children, instead of attaching a listener to each child.',
      explanation: 'A complete answer names bubbling as the enabling mechanism and `target` as how you identify the source.',
    },
    {
      level: 'beginner',
      question: 'Why use event delegation instead of attaching a listener to each element?',
      answer: 'It uses fewer listeners (less memory, faster setup/teardown) and automatically handles elements added or removed after binding, since the parent listener never changes.',
      explanation: 'The two headline benefits are performance and handling dynamic content.',
    },
    {
      level: 'intermediate',
      question: 'Why use `event.target.closest(selector)` instead of just checking `event.target`?',
      answer: 'Because the user may click a nested element (an icon or span inside a button), so `event.target` could be the inner element. `closest(selector)` walks up to find the nearest matching ancestor, giving you the logical element you meant to handle.',
      explanation: 'This is the single most common practical pitfall; mentioning nested children shows real experience.',
    },
    {
      level: 'intermediate',
      question: 'What kinds of events can and cannot be delegated?',
      answer: 'Bubbling events (click, input, keydown, change) delegate well. Non-bubbling events like `focus` and `blur` cannot be delegated directly — use their bubbling counterparts `focusin`/`focusout`. `mouseenter`/`mouseleave` don\'t bubble either; use `mouseover`/`mouseout`.',
      explanation: 'Knowing the exceptions and their bubbling alternatives demonstrates depth.',
    },
    {
      level: 'advanced',
      question: 'What are the downsides or limits of event delegation?',
      answer: 'Target resolution runs on every event (slightly more per-event work), `stopPropagation` in a child can prevent the delegated handler from firing, very high-frequency events (mousemove) can be costly, and delegating too high (document) means every event in the app hits your handler.',
      explanation: 'Senior-leaning candidates acknowledge the trade-offs, not just the benefits.',
    },
    {
      level: 'senior',
      question: 'How do frameworks like React use delegation, and what pitfalls arise?',
      answer: 'React attaches listeners at a root container (the app root since React 17, previously `document`) and synthesizes bubbling. This means native `stopPropagation` may not stop React handlers and vice versa, and a native listener on `document` can fire before/after React handlers depending on phase — so mixing native and synthetic delegation requires care about ordering.',
      explanation: 'Connecting delegation to framework internals and cross-system event ordering is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does delegation rely on event propagation / bubbling?',
    'What is the difference between `matches` and `closest`?',
    'How do you delegate focus events given focus does not bubble?',
    'When would attaching individual listeners actually be better?',
    'How can `stopPropagation` in a child break a delegated handler?',
    'How does delegation help with infinite-scroll or virtualized lists?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Checking `event.target` directly instead of `closest`.',
      why: 'A click on an inner icon/span makes `target` the inner element, so the check fails.',
      fix: 'Use `event.target.closest(selector)` to resolve the logical element regardless of the inner click point.',
    },
    {
      mistake: 'Delegating non-bubbling events like `focus`/`blur`/`mouseenter`.',
      why: 'These do not bubble, so the parent listener never receives them.',
      fix: 'Use `focusin`/`focusout` and `mouseover`/`mouseout`, which bubble.',
    },
    {
      mistake: 'Delegating on `document` for everything.',
      why: 'Every event in the app then runs through your handler, hurting performance and risking conflicts.',
      fix: 'Delegate to the nearest stable container, not the document, unless you truly need global scope.',
    },
    {
      mistake: 'Forgetting that a child\'s `stopPropagation` blocks delegation.',
      why: 'If a child handler stops propagation, the event never bubbles to your delegated listener.',
      fix: 'Avoid unnecessary `stopPropagation`; if needed, reconsider where logic lives or use the capture phase.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'A single `@click` on a list container plus a `data-id` lookup replaces per-item handlers; Vue\'s `.self` modifier helps ensure only direct-target clicks act, complementing delegation patterns.' },
    { area: 'React', detail: 'React itself delegates at the app root. Within components, using one `onClick` on a list parent with `e.target.closest` avoids allocating a new handler closure per item per render — a measurable win in large/virtualized lists.' },
    { area: 'Node.js', detail: 'No DOM, but the same principle appears in routing/middleware: a single dispatcher matches incoming requests to handlers by pattern rather than registering a listener per resource — conceptually delegation.' },
    { area: 'Backend', detail: 'Server-rendered pages (Express + templating) commonly ship one delegated client listener so progressively-enhanced, dynamically-loaded fragments work without re-binding.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'One listener instead of N: lower memory and faster initial render for large lists/tables.',
      'No re-binding when items are added/removed — cheaper updates and fewer leaks.',
    ],
    bad: [
      'Target resolution (`closest`) runs on every event; for very high-frequency events this adds up.',
      'Delegating too high (document) makes unrelated events traverse your handler.',
    ],
    optimizations: [
      'Delegate to the nearest stable container, not the whole document.',
      'Exit early (`if (!match) return`) before doing any work.',
      'For high-frequency events (mousemove/scroll), throttle/debounce or use passive listeners.',
      'Use `data-*` attributes for cheap identity lookups instead of complex DOM traversal.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['dom', 'event-system'],
    nextConcepts: ['custom-events', 'list-virtualization', 'debounce', 'throttle'],
    dependencyNote:
      'Event delegation is a direct application of event-system (bubbling); it pairs with list-virtualization for large lists and with debounce/throttle for high-frequency delegated events.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a `<ul>` with several `<li>` children.',
      'Put ONE listener box on the `<ul>` (not the children).',
      'Click an `<li>` and draw an arrow bubbling up to the `<ul>`.',
      'Write `e.target.closest("li")` next to the listener.',
      'Add a new `<li>` and show it needs no new listener.',
      'Say: "One listener, bubbling brings the event up, closest resolves the item — scales and handles dynamic children for free."',
    ],
    diagram: `   <ul> ◄── 1 listener   e.target.closest('li')
    ├ <li>  ▲
    ├ <li>  │ click bubbles up
    ├ <li> ─┘
    └ <li(new)>  works without re-binding`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Event delegation attaches one listener to a parent and relies on bubbling to handle events from any child. Inside the handler you use `event.target.closest(selector)` to find the logical element (handling clicks on nested icons) and often read a `data-id`. Benefits: far fewer listeners (memory + speed) and automatic support for dynamically added children. Watch-outs: it only works for bubbling events (not focus/blur — use focusin/focusout), and a child\'s `stopPropagation` will break it.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Event delegation is a pattern that takes advantage of event bubbling: instead of attaching a listener to every child element, you attach a single listener to a common ancestor. When a user interacts with a child, the event bubbles up to that ancestor, and inside the handler you inspect `event.target` to find out which child it came from — typically using `event.target.closest(selector)` so that clicks on nested elements like an icon inside a button still resolve to the right logical element. There are two big wins. First, performance: one listener instead of potentially thousands means less memory and faster setup and teardown. Second, dynamic content: because the listener lives on the parent, any children added later automatically work without re-binding — that\'s huge for lists that paginate, sort, or stream in. I usually carry the item identity on a `data-id` attribute so the handler stays data-driven. The main caveats: it only works for events that bubble, so for `focus`/`blur` I use the bubbling versions `focusin`/`focusout`, and for hover I use `mouseover`/`mouseout` rather than `mouseenter`. I also avoid delegating everything to `document` since that routes every event through one handler, and I keep in mind that a child calling `stopPropagation` will prevent my delegated handler from ever firing.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Fewer listeners and dynamic-content support vs per-event target resolution cost and centralized logic that can be harder to trace.',
      'Delegating high (document) maximizes coverage but increases handler invocations and conflict risk; delegating to the nearest container is the sweet spot.',
    ],
    edgeCases: [
      'Non-bubbling events (focus/blur, mouseenter/leave) cannot be delegated directly.',
      'A descendant calling `stopPropagation` silently disables the delegated handler.',
      'Shadow DOM retargets `target`; you may need `composedPath()` to find the real element.',
      'Clicks on whitespace/gaps return no match — always guard with an early return.',
    ],
    runtimeBehavior: [
      'The delegated handler runs once per event during the bubbling phase, with `currentTarget` = container and `target` = origin.',
      '`closest` walks the ancestor chain, so deep DOM means more traversal per event.',
      'Listeners on the same container fire in registration order; passive listeners can\'t preventDefault.',
    ],
    scalability: [
      'For grids/tables/feeds with thousands of rows, delegation is the standard scalable approach and pairs naturally with virtualization.',
      'In SPAs, a small set of container-level delegated listeners is far easier to manage and clean up than thousands of per-element bindings.',
    ],
    productionConcerns: [
      'Mixing native delegated listeners with framework synthetic events can produce confusing ordering and stopPropagation behavior.',
      'Document-level delegated listeners that are never removed cause subtle leaks across route changes.',
      'Selector drift: if markup changes, the `closest(selector)` may silently stop matching — keep selectors and data-attributes intentional and tested.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Delegation = one listener on a parent + bubbling.',
    'Use `event.target.closest(selector)` to resolve the logical element.',
    'Carry identity in `data-*` attributes.',
    'Benefits: fewer listeners (memory/speed) + handles dynamic children.',
    'Only works for BUBBLING events.',
    'focus/blur → use focusin/focusout; mouseenter/leave → mouseover/mouseout.',
    'A child\'s `stopPropagation` breaks delegation.',
    'Delegate to the NEAREST stable container, not document, when possible.',
    'Early-return on no match to keep handlers cheap.',
    '`matches` = test the element itself; `closest` = walk up to a match.',
    'React/Vue use delegation internally; one parent `onClick` beats per-item handlers.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Attach a single click handler to `#menu` that logs the `data-id` of whichever `<li>` was clicked.',
      hint: 'Use closest to find the li.',
      solution: {
        lang: 'js',
        code: `const menu = document.getElementById('menu')\nmenu.addEventListener('click', (e) => {\n  const li = e.target.closest('li')\n  if (li) console.log(li.dataset.id)\n})`,
        explanation: [
          'One listener on `#menu` covers all list items via bubbling.',
          '`closest(\'li\')` works even if the click hit an inner element.',
          'The guard ignores clicks outside any `<li>`.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'In a table, delegate clicks so `.edit` buttons call `editRow(id)` and `.del` buttons call `deleteRow(id)`, where id is on the parent `<tr>`.',
      hint: 'Find the row with closest, then branch on matches.',
      solution: {
        lang: 'js',
        code: `table.addEventListener('click', (e) => {\n  const row = e.target.closest('tr')\n  if (!row) return\n  const id = row.dataset.id\n  if (e.target.matches('.edit')) editRow(id)\n  else if (e.target.matches('.del')) deleteRow(id)\n})`,
        explanation: [
          '`closest(\'tr\')` locates the row to read its `data-id`.',
          '`matches` distinguishes which action button was clicked.',
          'A single listener handles the whole table and any future rows.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain and fix: a delegated `focus` handler on a form does not fire for inputs. Rewrite to delegate focus correctly.',
      hint: 'focus does not bubble; use focusin.',
      solution: {
        lang: 'js',
        code: `// focus does NOT bubble, so this never fires for children:\n// form.addEventListener('focus', handler)\n\n// focusin DOES bubble:\nform.addEventListener('focusin', (e) => {\n  if (e.target.matches('input, textarea')) {\n    e.target.classList.add('active')\n  }\n})`,
        explanation: [
          '`focus` is non-bubbling, so delegation fails.',
          '`focusin` bubbles and is the correct event for delegated focus handling.',
          'The `matches` check scopes the behavior to form fields.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `delegate(root, selector, type, handler)` returning an unbind function; `handler` runs with `this` = matched element only for descendants of `root`.',
      hint: 'Use closest + root.contains, and handler.call.',
      solution: {
        lang: 'js',
        code: `function delegate(root, selector, type, handler) {\n  function listener(e) {\n    const match = e.target.closest(selector)\n    if (match && root.contains(match)) {\n      handler.call(match, e)\n    }\n  }\n  root.addEventListener(type, listener)\n  return () => root.removeEventListener(type, listener)\n}`,
        explanation: [
          'One listener on `root` handles all matching descendants via bubbling.',
          '`closest(selector)` resolves nested click targets; `root.contains(match)` confirms scope.',
          '`handler.call(match, e)` sets `this` to the matched element, like a direct binding.',
          'Returning the remover makes cleanup trivial and prevents leaks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Event delegation is the practical payoff of understanding bubbling, and it appears constantly in real UIs — lists, tables, menus, toolbars. Demonstrating it cleanly signals you can write efficient, maintainable DOM code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "what is event delegation and why use it". Product companies (Zoho, Flipkart, Razorpay) ask you to implement a delegated list/table handler or a generic `delegate()` utility live. FAANG-level interviews probe trade-offs, non-bubbling events, and how framework synthetic events delegate.',
    whatInterviewersExpect:
      'They expect you to tie delegation to bubbling, use `event.target.closest(selector)` (not bare `target`), state the two benefits (fewer listeners + dynamic children), and name the non-bubbling-event caveat with the focusin/focusout fix.',
  },
}

export default eventDelegation
