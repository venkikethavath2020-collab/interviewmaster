import type { ConceptLesson } from '../../../types/lesson'

const dom: ConceptLesson = {
  // 1. Concept Summary
  slug: 'dom',
  name: 'DOM',
  category: 'browser-dom',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'The DOM (Document Object Model) is the live, in-memory tree representation of your HTML that JavaScript reads and changes — it is how the page becomes interactive.',
    'Every UI framework (Vue, React, Angular) is ultimately a sophisticated way of producing and updating the DOM; understanding it explains what frameworks do for you.',
    'DOM manipulation is a top performance hotspot: touching it incorrectly causes layout thrashing and jank, so knowing how it works directly affects how fast your apps feel.',
    'Without understanding the DOM you cannot reason about events, rendering, accessibility, or why direct manipulation conflicts with framework virtual DOMs.',
    'Interviewers ask it to check fundamentals: selecting elements, the node tree, reflow vs repaint, and the difference between the DOM and the HTML source.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The DOM is a family tree of everything on a web page that you can rearrange like building blocks.',
    story: [
      'Imagine a web page is a big house, and every part of it — the title, a paragraph, a button, a picture — is a room.',
      'The browser draws a map of all these rooms and how they connect, like a family tree: the house contains rooms, rooms contain furniture.',
      'This living map is the DOM. Because it is a map the browser keeps updated, you can use JavaScript to walk into any room and change it — repaint the walls, add a new chair, or remove a door.',
      'The moment you change the map, the browser instantly redraws the house to match. That is how clicking a button can make new things appear on the page.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When the browser loads an HTML file, it reads the tags and builds a tree of objects in memory, one object for each element.',
    'This tree is called the DOM, and each element (like a heading or button) is a "node" with a parent and possibly children.',
    'JavaScript can search this tree to find elements, read their text, change their style, add new elements, or delete them.',
    'Whenever JavaScript changes the DOM, the browser updates what you see on screen — that is how pages become interactive instead of static.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The DOM is a language-neutral, tree-structured object model of an HTML (or XML) document that the browser builds in memory; JavaScript uses the DOM API to query and mutate the page, and changes are reflected in what the user sees.',
    how: 'After parsing HTML, the browser creates a tree of Node objects (Document → Element → Element/Text...). You access it via the global `document`, select nodes with methods like `querySelector`, and change them by setting properties (`textContent`, `style`) or calling methods (`appendChild`, `remove`). Mutations trigger style/layout/paint updates.',
    why: 'It is the bridge between static HTML and dynamic behavior — it lets code respond to users, update content without a full reload, and is the foundation events and frameworks build on.',
    code: {
      label: 'Select, read, and change the DOM',
      lang: 'js',
      code: `// HTML: <ul id="list"><li>Apple</li></ul>\nconst list = document.querySelector('#list') // find a node\nconst item = document.createElement('li')     // create a node\nitem.textContent = 'Banana'                    // set its text\nlist.appendChild(item)                         // insert into the tree\nlist.children[0].style.color = 'red'           // change existing node`,
      explanation: [
        '`document.querySelector(\'#list\')` searches the DOM tree and returns the matching element node.',
        '`document.createElement(\'li\')` makes a new detached element node.',
        'Setting `textContent` defines the node\'s text safely (no HTML parsing).',
        '`appendChild` inserts the new node into the tree, so the browser renders it immediately.',
        'Changing `.style.color` updates an existing node\'s appearance.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The DOM is a platform- and language-neutral programming interface that represents a parsed HTML/XML document as a hierarchical tree of Node objects (Document, Element, Text, Comment, Attr, etc.), exposing a standardized API to traverse and mutate document structure, content, and style. The browser constructs the DOM during parsing; combined with the CSSOM it forms the render tree, and DOM mutations can invalidate computed styles and geometry, triggering style recalculation, reflow (layout), and repaint. The DOM is distinct from the HTML source string and from what the browser initially received: scripts, normalization, and dynamic changes mean the live DOM can differ substantially from the original markup.',

  // 7. Internal Working
  internalWorking: [
    'PARSE: the browser tokenizes the HTML byte stream and builds the DOM tree node by node, handling implied tags and error recovery as it goes.',
    'CSSOM: in parallel it parses CSS into the CSSOM; the DOM and CSSOM are combined into a render tree of visible nodes with computed styles.',
    'LAYOUT (reflow): the engine computes the geometry (position and size) of each render-tree node based on the box model and viewport.',
    'PAINT + COMPOSITE: it rasterizes pixels for each node and composites layers onto the screen.',
    'MUTATION: when JavaScript changes the DOM (or styles), the affected subtree is marked dirty; reading layout-dependent properties forces a synchronous reflow, while other changes are batched.',
    'EVENT INTEGRATION: the DOM also wires the event model — nodes are EventTargets, and dispatched events flow capture → target → bubble through the tree.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  HTML source ──parse──► DOM TREE (live, in memory)

            Document
               │
              html
            ┌──┴───┐
          head     body
            │     ┌──┴───┐
          title  h1     ul
                        │
                   ┌────┼────┐
                  li    li    li   ← Element nodes
                  │
               "Apple"            ← Text node

  JS: document.querySelector('ul').appendChild(newLi)
      → tree changes → style → reflow → repaint → screen updates`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: every DOM node is an object on the heap; the tree is a graph of parent/child/sibling references between these objects.',
    'JS ↔ DOM REFERENCES: a JS variable holding `document.querySelector(...)` keeps that node (and its subtree) reachable; detached nodes still referenced by JS are NOT garbage collected — a common leak.',
    'EVENT LISTENERS: a listener closure can capture the node and surrounding data; not removing it keeps the node alive even after it leaves the document.',
    'LIVE vs STATIC COLLECTIONS: `getElementsByTagName` returns a live HTMLCollection backed by the tree, while `querySelectorAll` returns a static NodeList snapshot — different memory/update semantics.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — selecting and updating elements',
      lang: 'js',
      code: `const title = document.querySelector('h1')\ntitle.textContent = 'Updated!'        // change text\ntitle.classList.add('highlight')      // add a CSS class\nconst all = document.querySelectorAll('.item') // static NodeList\nall.forEach(el => el.hidden = true)`,
      explanation: [
        '`querySelector` returns the first match; `querySelectorAll` returns a static NodeList.',
        '`textContent` updates text without parsing HTML (safe from injection).',
        '`classList.add` toggles CSS classes — the preferred way to change styling.',
        'NodeList from querySelectorAll supports `forEach` and does not auto-update if the DOM changes.',
      ],
    },
    intermediate: {
      label: 'Intermediate — creating nodes efficiently with a fragment',
      lang: 'js',
      code: `const list = document.querySelector('#list')\nconst fragment = document.createDocumentFragment() // off-DOM container\nfor (const name of ['A', 'B', 'C']) {\n  const li = document.createElement('li')\n  li.textContent = name\n  fragment.appendChild(li)   // no reflow yet (fragment not in document)\n}\nlist.appendChild(fragment)   // single insertion → one reflow`,
      explanation: [
        'A DocumentFragment is a lightweight, off-document container for building subtrees.',
        'Appending to the fragment does NOT touch the live DOM, so it triggers no reflow.',
        'Inserting the fragment once moves all its children in a single operation.',
        'This avoids the classic mistake of appending in a loop and forcing a reflow each time.',
      ],
    },
    advanced: {
      label: 'Advanced — avoiding layout thrashing (read/write batching)',
      lang: 'js',
      code: `const boxes = document.querySelectorAll('.box')\n// BAD: read-then-write in a loop forces sync reflow each iteration\n// boxes.forEach(b => { b.style.width = b.offsetWidth + 10 + 'px' })\n\n// GOOD: batch all reads, then all writes\nconst widths = [...boxes].map(b => b.offsetWidth) // reads (one layout)\nboxes.forEach((b, i) => { b.style.width = widths[i] + 10 + 'px' }) // writes`,
      explanation: [
        'Reading layout properties like `offsetWidth` forces the browser to flush pending layout (synchronous reflow).',
        'Interleaving reads and writes in a loop causes "layout thrashing" — many forced reflows.',
        'Batching all reads first, then all writes, lets the browser do a single layout pass.',
        'This is a core DOM performance technique and a frequent senior interview topic.',
      ],
    },
    realProject: {
      label: 'Real project — why frameworks use a virtual DOM',
      lang: 'js',
      code: `// Vanilla DOM: manual, imperative, easy to thrash\nfunction renderTodos(todos) {\n  const ul = document.querySelector('#todos')\n  ul.innerHTML = ''                       // wipes + recreates (costly)\n  for (const t of todos) {\n    const li = document.createElement('li')\n    li.textContent = t.text\n    ul.appendChild(li)\n  }\n}\n// Vue/React instead DIFF a virtual DOM and apply minimal real-DOM changes.`,
      explanation: [
        'Manual DOM updates are imperative: you describe every step and must optimize reflows yourself.',
        'Re-rendering by clearing `innerHTML` discards and rebuilds nodes, losing state and being slow.',
        'Frameworks keep a lightweight virtual DOM, diff old vs new, and apply only the minimal real-DOM mutations.',
        'Understanding the real DOM is what lets you reason about (and debug) what Vue/React ultimately do.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the DOM?',
      answer: 'The Document Object Model: a tree-structured, in-memory object representation of an HTML document that JavaScript can read and modify, with changes reflected on screen.',
      explanation: 'A good answer stresses it is a live object tree, not the HTML text itself.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between `textContent` and `innerHTML`?',
      answer: '`textContent` gets/sets plain text and does not parse HTML (safer). `innerHTML` parses the string as HTML and builds nodes, which can introduce XSS if the content is untrusted.',
      explanation: 'Mentioning the XSS risk of innerHTML shows security awareness.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between reflow (layout) and repaint?',
      answer: 'Reflow recomputes the geometry/position of elements (expensive, can cascade); repaint redraws pixels without changing layout (e.g. a color change). Reading layout properties can force a synchronous reflow.',
      explanation: 'This is the heart of DOM performance — interviewers want the cost distinction.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between an HTMLCollection and a NodeList?',
      answer: '`getElementsByTagName`/`getElementsByClassName` return a live HTMLCollection that auto-updates with the DOM; `querySelectorAll` returns a static NodeList snapshot. NodeList supports `forEach`; HTMLCollection does not.',
      explanation: 'Knowing live vs static collections avoids subtle iteration bugs.',
    },
    {
      level: 'advanced',
      question: 'What is layout thrashing and how do you avoid it?',
      answer: 'It is repeatedly forcing synchronous reflows by interleaving DOM reads (offsetWidth, getBoundingClientRect) and writes (style changes) in a loop. Avoid it by batching all reads first, then all writes, and using requestAnimationFrame or fragments.',
      explanation: 'Senior signal: connecting DOM API usage to the rendering pipeline cost.',
    },
    {
      level: 'senior',
      question: 'Why do frameworks use a virtual DOM, and is it always faster than direct DOM manipulation?',
      answer: 'A virtual DOM lets frameworks compute minimal updates via diffing and batch real-DOM writes, trading some CPU/memory for predictable, declarative updates. It is not always faster than hand-optimized direct manipulation, but it scales developer productivity and avoids common thrashing mistakes at scale.',
      explanation: 'Shows nuanced understanding rather than treating virtual DOM as magic.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between the DOM and the HTML source you wrote?',
    'How does event bubbling and capturing traverse the DOM tree?',
    'When would you use a DocumentFragment?',
    'What causes a DOM-related memory leak and how do you prevent it?',
    'How does the browser build the render tree from the DOM and CSSOM?',
    'How does the Shadow DOM differ from the regular (light) DOM?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using `innerHTML` with untrusted/user-provided strings.',
      why: 'It parses HTML and can execute injected scripts/handlers — an XSS vulnerability.',
      fix: 'Use `textContent` for text, or sanitize HTML and create nodes via DOM APIs / a trusted template system.',
    },
    {
      mistake: 'Appending nodes one by one inside a loop on the live DOM.',
      why: 'Each insertion can trigger a reflow, causing slow, janky updates.',
      fix: 'Build off-DOM with a DocumentFragment (or set innerHTML once) and insert in a single operation.',
    },
    {
      mistake: 'Interleaving layout reads and writes (reading offsetWidth then writing style repeatedly).',
      why: 'It forces repeated synchronous reflows (layout thrashing), tanking performance.',
      fix: 'Batch all reads, then all writes; use requestAnimationFrame for visual updates.',
    },
    {
      mistake: 'Manually manipulating the DOM inside a framework component\'s managed region.',
      why: 'It conflicts with the framework\'s virtual DOM diffing, causing inconsistencies or lost updates.',
      fix: 'Use framework refs/lifecycle hooks (Vue `ref`/`onMounted`, React `useRef`/`useEffect`) for any direct DOM access.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue compiles templates to a virtual DOM and patches the real DOM minimally; for direct access you use template `ref`s and `onMounted`, never querying the DOM behind Vue\'s back.' },
    { area: 'React', detail: 'React diffs a virtual DOM and commits batched real-DOM mutations; escape hatches (`useRef`, `useEffect`) handle measurements, focus, and third-party DOM libraries.' },
    { area: 'Node.js', detail: 'Node has no DOM; server-side rendering builds HTML strings, and tools like jsdom emulate a DOM for testing and scraping.' },
    { area: 'Backend', detail: 'SSR frameworks generate the initial HTML on the server, which the browser parses into a DOM and then hydrates with client JS to attach event listeners.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Batched DOM updates and class/style toggles are cheap when they avoid forced layout.',
      'Using fragments and minimal targeted mutations keeps reflow/repaint work small.',
    ],
    bad: [
      'Layout thrashing (read/write interleaving) forces many synchronous reflows.',
      'Large `innerHTML` rebuilds discard and recreate node trees, which is slow and loses state.',
    ],
    optimizations: [
      'Batch reads then writes; schedule visual updates with requestAnimationFrame.',
      'Build subtrees in a DocumentFragment and insert once.',
      'Toggle CSS classes instead of setting many inline styles individually.',
      'Use event delegation to avoid attaching thousands of listeners, and virtualize long lists.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Injecting untrusted data via `innerHTML`/`outerHTML`/`insertAdjacentHTML` enables DOM-based XSS.',
      'Building attributes/URLs from user input (e.g. `href`, `src`) can introduce `javascript:` and injection vectors.',
    ],
    bestPractices: [
      'Prefer `textContent` and DOM creation APIs over HTML string injection; sanitize any HTML you must insert.',
      'Set attributes with `setAttribute`/properties and validate URLs; apply a strict Content Security Policy.',
      'In frameworks, rely on default escaping and avoid `v-html`/`dangerouslySetInnerHTML` with untrusted content.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-javascript'],
    nextConcepts: ['event-system', 'event-delegation', 'browser-rendering-pipeline', 'bom', 'observers', 'list-virtualization'],
    dependencyNote:
      'The DOM is the foundation of all browser interactivity: once you understand the node tree you can learn the event-system and event-delegation, how the browser-rendering-pipeline turns DOM+CSSOM into pixels, the related bom, observers for watching changes, and list-virtualization for performance.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the tree: Document → html → head/body → elements → text nodes.',
      'Point out each box is a Node object in memory, not the HTML text.',
      'Show `document.querySelector(...)` selecting a node and changing it.',
      'Draw the pipeline arrow: DOM change → style → reflow → repaint → screen.',
      'Say: "reflow recomputes geometry (expensive); repaint just redraws pixels".',
      'Add: "frameworks diff a virtual DOM and apply minimal real-DOM changes".',
    ],
    diagram: `        Document
           │
          html
        ┌──┴──┐
       head   body
              │
             div ── "Hello" (Text node)
   JS selects a node → mutates →
   style recalc → REFLOW (layout) → REPAINT → screen
   (reflow = geometry/expensive, repaint = pixels)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The DOM is the browser\'s live, in-memory tree of objects representing your HTML — distinct from the HTML text. JavaScript uses the DOM API (via `document`) to select, read, and mutate nodes, and those changes flow through style recalculation, reflow (layout), and repaint to update the screen. Reflow recomputes geometry and is expensive; repaint just redraws pixels. Avoid layout thrashing by batching reads then writes and building with fragments. Frameworks like Vue/React diff a virtual DOM and apply minimal real-DOM changes.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The DOM, or Document Object Model, is a tree-structured, in-memory object representation of an HTML document that the browser builds while parsing. Each element, piece of text, and comment becomes a Node object with parent, child, and sibling relationships, and JavaScript accesses this tree through the global `document`. It is important to stress that the DOM is not the HTML text you wrote — it is a live object model that scripts and the browser normalize and mutate, so it can differ from the original markup. Using the DOM API, you select nodes with methods like `querySelector`, read or change content with properties like `textContent`, and add or remove nodes with `appendChild` or `remove`. When you mutate the DOM, the browser marks the affected part dirty and runs the rendering pipeline: it recalculates styles, performs layout — also called reflow — to compute geometry, then repaints pixels. Reflow is expensive and can cascade, while a repaint like a color change is cheaper. A classic performance pitfall is layout thrashing, where interleaving reads of layout properties like offsetWidth with style writes in a loop forces repeated synchronous reflows; you fix it by batching all reads first then all writes, building subtrees in a DocumentFragment, and scheduling visual work with requestAnimationFrame. Security matters too: inserting untrusted strings via innerHTML risks DOM-based XSS, so prefer textContent and DOM creation APIs. Finally, frameworks like Vue and React abstract the DOM with a virtual DOM, diffing it to apply the minimal set of real-DOM mutations — which is exactly why understanding the real DOM helps you reason about what they do.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Direct DOM manipulation (fine control, potentially fastest) vs virtual DOM (declarative, safer, scales developer effort but adds diffing overhead).',
      'innerHTML rebuilds (simple) vs targeted node mutation (faster, preserves state and focus) — convenience vs performance/correctness.',
    ],
    edgeCases: [
      'Live HTMLCollections update mid-iteration, causing infinite loops or skipped items if you mutate while looping.',
      'Reading layout properties flushes pending mutations, so the order of reads/writes silently changes performance.',
      'Detached nodes still referenced by JS or listeners leak memory even though they left the document.',
      'Shadow DOM encapsulates a subtree with its own scope, so normal `document.querySelector` cannot reach inside it.',
    ],
    runtimeBehavior: [
      'DOM mutations are typically batched; layout is computed lazily until something forces it (a layout read).',
      'Nodes are EventTargets; events propagate capture → target → bubble through the tree.',
      'The render tree includes only visible nodes, combining DOM structure with CSSOM computed styles.',
    ],
    scalability: [
      'Very large DOMs (tens of thousands of nodes) slow style/layout and increase memory — virtualize long lists.',
      'Frequent fine-grained updates benefit from batching (rAF) and minimizing reflow-triggering reads.',
    ],
    productionConcerns: [
      'Audit for DOM memory leaks: remove listeners on teardown (AbortController helps) and drop references to detached nodes.',
      'Guard against DOM-based XSS by avoiding HTML string injection and enforcing CSP.',
      'Avoid manual DOM edits inside framework-managed regions; use refs/lifecycle hooks to stay consistent with the virtual DOM.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'DOM = live, in-memory object tree of the HTML (not the text).',
    'Access via `document`; nodes have parent/child/sibling links.',
    'Select: querySelector / querySelectorAll (static NodeList).',
    'getElementsBy* returns a LIVE HTMLCollection.',
    'textContent = safe text; innerHTML = parses HTML (XSS risk).',
    'Mutations → style recalc → reflow (layout) → repaint.',
    'Reflow = geometry (expensive); repaint = pixels (cheaper).',
    'Layout thrashing = read/write interleaving → batch them.',
    'DocumentFragment builds subtrees off-DOM → one reflow.',
    'classList.toggle/add/remove for styling changes.',
    'Detached-but-referenced nodes leak memory.',
    'Frameworks diff a virtual DOM → minimal real-DOM updates.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Select the element with id "title", change its text to "Hello", and add the class "active".',
      hint: 'Use querySelector, textContent, and classList.',
      solution: {
        lang: 'js',
        code: `const title = document.querySelector('#title')\ntitle.textContent = 'Hello'\ntitle.classList.add('active')`,
        explanation: [
          '`querySelector(\'#title\')` returns the element node.',
          '`textContent` safely sets its text.',
          '`classList.add` applies the CSS class.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Render an array of 100 names into a <ul id="list"> with only ONE reflow.',
      hint: 'Build the list items in a DocumentFragment first.',
      solution: {
        lang: 'js',
        code: `function render(names) {\n  const list = document.querySelector('#list')\n  const frag = document.createDocumentFragment()\n  for (const name of names) {\n    const li = document.createElement('li')\n    li.textContent = name\n    frag.appendChild(li) // off-DOM, no reflow\n  }\n  list.appendChild(frag) // single insertion → one reflow\n}`,
        explanation: [
          'Items are appended to a fragment, which is not part of the live document.',
          'Inserting the fragment once moves all 100 nodes in a single operation.',
          'This avoids 100 separate reflows from appending in a loop.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Refactor this layout-thrashing code so the browser only does one layout pass: each box\'s new width is its current width + 20.',
      hint: 'Separate all reads from all writes.',
      solution: {
        lang: 'js',
        code: `const boxes = [...document.querySelectorAll('.box')]\nconst widths = boxes.map(b => b.offsetWidth) // ALL reads first (one layout)\nboxes.forEach((b, i) => {\n  b.style.width = widths[i] + 20 + 'px'       // THEN all writes\n})`,
        explanation: [
          'Reading offsetWidth flushes layout; doing all reads up front triggers a single layout.',
          'Performing the writes afterward avoids forcing a reflow between each iteration.',
          'This eliminates the read/write interleaving that caused thrashing.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a safe function that inserts user-provided text into a <div id="msg"> without XSS risk, and explain why innerHTML would be unsafe.',
      hint: 'Prefer textContent over innerHTML for untrusted input.',
      solution: {
        lang: 'js',
        code: `function showMessage(userText) {\n  const div = document.querySelector('#msg')\n  div.textContent = userText // safe: treated as plain text, not parsed\n}\n// UNSAFE: div.innerHTML = userText\n//   → '<img src=x onerror=alert(1)>' would execute (DOM-based XSS)`,
        explanation: [
          '`textContent` sets the literal text and does not parse HTML, so injected tags/handlers are inert.',
          '`innerHTML` parses the string as HTML, so malicious markup could execute scripts.',
          'For untrusted input always prefer textContent or sanitize before using innerHTML.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The DOM is the absolute foundation of web interactivity and every UI framework. Demonstrating that you understand the node tree, the rendering pipeline, and performance/security pitfalls shows you have real fundamentals — not just framework-level knowledge.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask what the DOM is and how to select/modify elements. Product companies (Zoho, Flipkart, Razorpay) probe reflow vs repaint, live vs static collections, and innerHTML/XSS. FAANG-level interviews dig into layout thrashing, memory leaks, the render tree, and why virtual DOMs exist.',
    whatInterviewersExpect:
      'Define the DOM as a live object tree (not HTML text), show fluency with selection and mutation APIs, explain reflow vs repaint and how to avoid thrashing, flag the innerHTML XSS risk, and connect it to how frameworks use a virtual DOM.',
  },
}

export default dom
