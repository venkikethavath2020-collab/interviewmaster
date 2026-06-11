import type { ConceptLesson } from '../../../types/lesson'

const vFor: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-for',
  name: 'v-for',
  category: 'templates',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Almost every real UI is a list: a feed, a table, a menu, a cart. v-for is how Vue turns an array of data into repeated DOM without you writing the loop by hand.',
    'It is the bridge between your reactive state and the rendered list — change the array and the DOM updates automatically.',
    'Getting v-for wrong (missing keys, mutating the array badly, iterating objects incorrectly) is one of the most common sources of subtle list-rendering bugs in production.',
    'It is a guaranteed interview topic for any Vue role because it forces you to talk about keys, reactivity, and diffing in one breath.',
    'Understanding v-for deeply unlocks list performance work — virtualization, stable keys, and avoiding unnecessary re-renders.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-for is a cookie cutter that stamps out one cookie for every name on your party list.',
    story: [
      'Imagine you are throwing a party and you have a list of friends coming: Sam, Mia, and Leo.',
      'Instead of writing three name-tags by hand, you have a magic stamp. You feed it the list, and it stamps out one name-tag for each friend automatically.',
      'If a new friend joins the list, the stamp instantly makes one more tag. If someone cancels, their tag disappears.',
      'v-for is that magic stamp for a web page: you give it a list of things, and it makes one piece of the page for each thing, keeping them in sync as the list changes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue you can repeat a chunk of HTML once for every item in a list using the v-for directive, written like v-for="item in items".',
    'It works on arrays, objects, numbers, and even strings — anything you can loop over.',
    'You usually also give each repeated piece a special key so Vue can tell them apart when the list changes.',
    'Because the list is reactive, when you add or remove items from the array, Vue updates the page for you without a manual refresh.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-for is a built-in Vue directive that renders an element (and its children) once for each item in a source — an array, object, integer range, or string — using the syntax v-for="(item, index) in items".',
    how: 'You attach v-for to the element you want repeated. Vue evaluates the source expression, creates a render scope per item exposing the alias variables (item, index, or key/value for objects), and produces one vnode per iteration. Because the source is usually reactive, re-running render after a change re-derives the list.',
    why: 'It declaratively maps data to DOM so you never imperatively create or destroy nodes yourself, and it stays in sync with reactive state automatically.',
    code: {
      label: 'Rendering a list of users',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\n\nconst users = ref([\n  { id: 1, name: \'Sam\' },\n  { id: 2, name: \'Mia\' },\n  { id: 3, name: \'Leo\' },\n])\n</script>\n\n<template>\n  <ul>\n    <li v-for="user in users" :key="user.id">\n      {{ user.name }}\n    </li>\n  </ul>\n</template>',
      explanation: [
        'users is a reactive ref holding an array of objects.',
        'v-for="user in users" repeats the <li> once per user, exposing each element as user.',
        ':key="user.id" gives every item a stable, unique identity so Vue can track it across updates.',
        '{{ user.name }} reads from the per-iteration scope variable.',
        'Push or splice users.value and the rendered list updates automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-for is a structural template directive that the Vue compiler transforms into a call to the renderList helper, producing an array of vnodes — one per item in the iterated source. It supports arrays, plain objects (key/value/index), integer ranges, and strings, and exposes per-iteration aliases through a fresh render scope. Paired with a :key, it lets the runtime diff the keyed children efficiently during patching; without a stable key, Vue falls back to an in-place patch strategy that can produce incorrect results for stateful components.',

  // 7. Internal Working
  internalWorking: [
    'At compile time, the template compiler detects the v-for directive and rewrites the element into a renderList(source, (item, index) => createVNode(...)) expression inside the render function.',
    'When the render function runs, renderList iterates the source. For arrays it loops indices; for plain objects it loops Object.keys; for a number N it produces 1..N; for strings it iterates characters.',
    'Each iteration invokes the per-item render callback with the alias bindings, returning one vnode (or a fragment of vnodes) carrying the key you supplied.',
    'The resulting vnode array becomes the children of the parent vnode. On the next render after a reactive change, Vue produces a new children array.',
    'During patch, if children are keyed, the runtime runs its keyed diff (patchKeyedChildren) — matching old and new vnodes by key, reusing DOM nodes, and moving rather than recreating them.',
    'If no key (or a non-unique key) is present, Vue uses an unkeyed in-place patch that reuses nodes by index, which is fast but can carry stale local state into the wrong row.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   reactive source array                 rendered DOM
   ┌──────────────────┐                  ┌─────────────────┐
   │ [ {id:1,Sam},    │   v-for          │ <li> Sam  </li> │
   │   {id:2,Mia},    │ ───renderList──► │ <li> Mia  </li> │
   │   {id:3,Leo} ]   │                  │ <li> Leo  </li> │
   └──────────────────┘                  └─────────────────┘
            │                                     ▲
            │ push / splice / replace             │ keyed diff
            └─────────► re-render ────────────────┘
                       (one vnode per item, tagged with :key)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The source array lives in the reactive heap as a Proxy; v-for reads it inside the render effect, so the render is tracked as a dependency of the array (and its length).',
    'Each iteration allocates one vnode object holding the key, props, and children — these are short-lived and replaced on the next render.',
    'The actual DOM <li> elements are long-lived and reused across renders when keys match; only added/removed keys cause node creation/teardown.',
    'Mutating the array via push/splice triggers the array Proxy traps, which notify the render effect to re-run and produce a fresh vnode list.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — array with index',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst fruits = ref([\'apple\', \'banana\', \'cherry\'])\n</script>\n\n<template>\n  <ol>\n    <li v-for="(fruit, index) in fruits" :key="fruit">\n      {{ index + 1 }}. {{ fruit }}\n    </li>\n  </ol>\n</template>',
      explanation: [
        'The second alias index gives you the zero-based position in the array.',
        'Here the fruit string itself is unique, so it serves as a valid :key.',
        'index + 1 turns the position into a human-friendly 1-based number.',
        'Changing fruits.value re-renders the ordered list.',
      ],
    },
    intermediate: {
      label: 'Intermediate — iterating an object and a range',
      lang: 'vue',
      code: '<script setup>\nimport { reactive } from \'vue\'\nconst profile = reactive({ name: \'Ada\', role: \'Engineer\', city: \'Pune\' })\n</script>\n\n<template>\n  <!-- object: value, key, index -->\n  <dl>\n    <template v-for="(value, key) in profile" :key="key">\n      <dt>{{ key }}</dt>\n      <dd>{{ value }}</dd>\n    </template>\n  </dl>\n\n  <!-- numeric range starts at 1 -->\n  <span v-for="n in 5" :key="n">Star {{ n }} </span>\n</template>',
      explanation: [
        'For objects the alias order is (value, key, index) — value comes first, which trips people up.',
        'v-for on a <template> tag repeats multiple sibling elements (dt + dd) without an extra wrapper.',
        'The key goes on the <template> when v-for is on it.',
        'v-for="n in 5" produces n = 1,2,3,4,5 — ranges are 1-based, not 0-based.',
      ],
    },
    advanced: {
      label: 'Advanced — derived list, no mutation during iteration',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\n\nconst todos = ref([\n  { id: 1, text: \'Ship\', done: true },\n  { id: 2, text: \'Test\', done: false },\n  { id: 3, text: \'Docs\', done: false },\n])\nconst query = ref(\'\')\n\n// Derive the rendered list with computed, do NOT filter inline repeatedly\nconst visible = computed(() =>\n  todos.value.filter((t) => t.text.toLowerCase().includes(query.value.toLowerCase()))\n)\n</script>\n\n<template>\n  <input v-model="query" placeholder="filter" />\n  <ul>\n    <li v-for="todo in visible" :key="todo.id" :class="{ done: todo.done }">\n      {{ todo.text }}\n    </li>\n  </ul>\n</template>',
      explanation: [
        'Filtering/sorting is done in a computed, not inline in v-for, so it is cached and recomputed only when dependencies change.',
        ':key="todo.id" stays stable even as the filtered set changes, so Vue reuses the right rows.',
        'A class binding per row reacts to each todo.done independently.',
        'Avoid calling array methods that mutate (sort/reverse) directly on the source inside the template — derive a copy instead.',
      ],
    },
    realProject: {
      label: 'Real project — a data table with row actions',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\n\nconst orders = ref([\n  { id: \'A-1001\', customer: \'Mia\', total: 4200, status: \'paid\' },\n  { id: \'A-1002\', customer: \'Leo\', total: 980, status: \'pending\' },\n])\n\nfunction cancel(id) {\n  orders.value = orders.value.filter((o) => o.id !== id)\n}\n</script>\n\n<template>\n  <table>\n    <tbody>\n      <tr v-for="order in orders" :key="order.id">\n        <td>{{ order.id }}</td>\n        <td>{{ order.customer }}</td>\n        <td>{{ order.total }}</td>\n        <td>{{ order.status }}</td>\n        <td><button @click="cancel(order.id)">Cancel</button></td>\n      </tr>\n    </tbody>\n  </table>\n</template>',
      explanation: [
        'A keyed v-for over <tr> is the canonical way to render database-backed tables.',
        'The business id (order.id) is the natural stable key — never the loop index here.',
        'cancel replaces the array immutably via filter, which triggers a clean keyed re-render that removes exactly one row.',
        'Each row keeps its own action button wired to its own id, made possible by the per-iteration scope.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is v-for and what can you iterate over with it?',
      answer: 'v-for is a directive that renders an element once per item in a source. You can iterate arrays, plain objects (value, key, index), an integer range (1..N), and strings.',
      explanation: 'A complete answer names all four iterable sources and the alias order, especially that objects expose value first.',
    },
    {
      level: 'beginner',
      question: 'What aliases does v-for expose for an array versus an object?',
      answer: 'For arrays: (item, index). For objects: (value, key, index). Ranges and strings expose a single value.',
      explanation: 'The object order catching people out — value precedes key — is a classic gotcha interviewers like.',
    },
    {
      level: 'intermediate',
      question: 'Why should you not use v-if and v-for on the same element?',
      answer: 'In Vue 3, v-if has higher priority than v-for, so the condition cannot access the loop variable, and even when it works it re-evaluates the condition for every item. Prefer a computed that filters the list, or move v-if to an inner wrapper.',
      explanation: 'Shows awareness of directive precedence (which flipped between Vue 2 and Vue 3) and of cleaner filtering with computed.',
    },
    {
      level: 'intermediate',
      question: 'How do you repeat multiple sibling elements without adding a wrapper node?',
      answer: 'Put v-for on a <template> tag and place the key on the <template>. The template renders its children for each iteration without producing a wrapper DOM element.',
      explanation: 'Demonstrates knowledge of fragment-style rendering, useful for tables (dt/dd, multiple cells).',
    },
    {
      level: 'advanced',
      question: 'Can Vue detect array index assignment or length changes, and how do you update an item reactively?',
      answer: 'In Vue 3, the reactive Proxy intercepts index assignment and length changes, so arr[i] = x and arr.length = n ARE reactive (unlike Vue 2, which needed Vue.set / splice). Still, replacing or splicing is clearest and keeps keys stable.',
      explanation: 'Highlights the Vue 2 vs Vue 3 reactivity difference — a frequent senior follow-up.',
    },
    {
      level: 'senior',
      question: 'What happens at render time when a v-for list changes, and how does keying affect it?',
      answer: 'The render function calls renderList to produce a new vnode array. During patch, keyed children go through patchKeyedChildren which matches by key and moves/reuses DOM nodes; unkeyed children are patched in place by index, which can keep stale component state in the wrong position.',
      explanation: 'Connects v-for to the compiler output (renderList) and the runtime diff, plus the practical consequence of missing keys.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between v-for and a manual render function loop?',
    'Why is the loop index a poor key for a reorderable or filterable list?',
    'How does v-for behave on a component versus a plain element?',
    'How would you render a very large list performantly (virtualization)?',
    'What is the alias order when iterating a plain object?',
    'Why does Vue 3 not need Vue.set for array index updates anymore?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Omitting :key, or using the array index as the key on a list that reorders or filters.',
      why: 'Without a stable key Vue patches in place by position, so component state and DOM can attach to the wrong item after reordering.',
      fix: 'Use a stable unique identifier (a database id) as the key; only use index for static, never-reordered lists.',
    },
    {
      mistake: 'Putting v-if and v-for on the same element.',
      why: 'In Vue 3 v-if runs first and cannot see the loop variable, and it re-checks per item; it is also flagged as an anti-pattern by the style guide.',
      fix: 'Filter with a computed property, or wrap the v-if on an inner element/template.',
    },
    {
      mistake: 'Mutating the source array while iterating it (e.g. splicing inside a render-driven loop).',
      why: 'It can desync the rendered list from the data and cause skipped or duplicated items.',
      fix: 'Derive a new array (filter/map) and assign it, or mutate outside the render path in an event handler.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every list, table, dropdown, tab bar, and card grid is a v-for over reactive state, typically keyed by a domain id.' },
    { area: 'Component library', detail: 'Generic <List>, <Table>, and <Menu> components accept an items prop and v-for over it, exposing each row via a scoped slot so consumers control rendering.' },
    { area: 'Nuxt', detail: 'Server-rendered pages render lists with v-for during SSR; stable keys are critical so hydration matches the server-generated DOM exactly.' },
    { area: 'Pinia', detail: 'Lists are rendered from store getters (e.g. filtered/sorted collections), with v-for reading the derived array so the UI tracks store changes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Keyed v-for lets Vue reuse and move DOM nodes instead of recreating them, minimizing layout work on reorder.',
      'Deriving filtered/sorted lists in computed caches the result so v-for only re-renders when inputs actually change.',
    ],
    bad: [
      'Index keys on dynamic lists force unnecessary node teardown/rebuild and can corrupt local component state.',
      'Rendering thousands of rows at once blows up the DOM node count and slows every subsequent patch.',
    ],
    optimizations: [
      'Always provide a stable unique :key.',
      'Virtualize long lists (vue-virtual-scroller) so only visible rows are in the DOM.',
      'Move expensive filtering/sorting into computed instead of inline expressions in the template.',
      'Use v-memo on rarely-changing rows to skip re-rendering them.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'v-bind', 'reactivity-fundamentals'],
    nextConcepts: ['v-for-key', 'list-rendering-performance', 'v-if-v-show', 'v-once-v-memo'],
    dependencyNote:
      'v-for builds on template syntax and reactivity; its single most important companion is v-for-key (stable keys), and mastering both leads into list-rendering-performance work like v-memo and virtualization.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a reactive array of objects on the left, each with an id.',
      'Draw an arrow labeled renderList pointing to a column of DOM nodes, one per item.',
      'On each DOM node write its :key (the id), showing identity is preserved.',
      'Show a mutation (remove item id=2) and how the keyed diff removes exactly that node, leaving others reused.',
      'Conclude: v-for maps data → vnodes → DOM, and the key is what makes the diff correct and cheap.',
    ],
    diagram: `  data            v-for / renderList         DOM (keyed)
  [id1] ───────────────────────────────────► <node key=1>
  [id2] ──(removed)──► diff drops only this ─► (gone)
  [id3] ───────────────────────────────────► <node key=3> (reused)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-for repeats an element once per item in an array, object, range, or string, using v-for="(item, index) in items". Arrays expose (item, index); objects expose (value, key, index). Always pair it with a stable :key so Vue diffs keyed children correctly and reuses DOM nodes. Avoid index keys on reorderable lists, avoid v-if on the same element, and derive filtered lists in computed. The compiler turns it into a renderList call producing one vnode per item.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-for is Vue\'s list-rendering directive. You write v-for="item in items" on the element you want repeated, and Vue renders one copy per item. It iterates four kinds of sources: arrays — where the aliases are (item, index); plain objects — where the order is (value, key, index), with value first which surprises people; an integer N, giving a 1-based range 1..N; and strings, character by character. You almost always pair it with a :key bound to a stable unique identifier like a database id. The key matters because of how Vue patches: the compiler turns v-for into a renderList call that produces an array of vnodes, and at patch time keyed children go through a keyed diff that matches by key, so Vue can move and reuse existing DOM nodes instead of recreating them. If you use the array index as the key on a list that reorders or filters, the diff attaches DOM and component state to the wrong row, which is a real bug source. Two more rules: don\'t put v-if and v-for on the same element — in Vue 3 v-if has higher priority and can\'t see the loop variable, so filter with a computed instead; and derive sorted or filtered lists in a computed so they\'re cached. For very large lists, virtualize so only visible rows hit the DOM.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Keyed diffing reuses nodes and preserves state but costs a key lookup per item; for huge static lists an unkeyed in-place patch can be marginally faster, at the cost of correctness on reorder.',
      'Filtering in computed caches results but adds a reactive dependency layer; inline filtering is simpler but recomputes every render.',
    ],
    edgeCases: [
      'Iterating a plain object uses Object.keys order, which is insertion order for string keys but numeric-like keys are visited in ascending numeric order — surprising for maps of ids.',
      'v-for on a component passes nothing automatically; you must bind props per item and key by a stable id, or stale state leaks across positions.',
      'Reactive arrays: index assignment and length changes ARE reactive in Vue 3, but were not in Vue 2 — code ported from Vue 2 may have unnecessary Vue.set calls.',
      'Nested v-for shares parent scope variables; shadowing the same alias name across levels causes confusing bugs.',
    ],
    runtimeBehavior: [
      'renderList allocates a fresh vnode array each render; the diff then reconciles it against the previous one.',
      'patchKeyedChildren uses a longest-increasing-subsequence algorithm to minimize DOM moves on reorder.',
      'Without keys, patchUnkeyedChildren reuses nodes by index and patches in place, which is why local <input> state can appear on the wrong row.',
    ],
    scalability: [
      'DOM node count is the real ceiling; 10k+ rows demand virtualization regardless of how good the diff is.',
      'Server-rendered lists must produce identical keyed markup on server and client or hydration mismatches occur.',
    ],
    productionConcerns: [
      'Index-key bugs are the top v-for incident: forms inside list rows submit the wrong data after sort/filter.',
      'Unbounded lists from paginated APIs that append forever cause memory growth — cap or virtualize.',
      'Hydration mismatches from non-deterministic ordering (e.g. Date.now keys) break SSR.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Syntax: v-for="(item, index) in items".',
    'Arrays → (item, index). Objects → (value, key, index). value comes FIRST.',
    'v-for="n in 5" → n = 1..5 (1-based range).',
    'Always add a stable, unique :key.',
    'Index keys are fine ONLY for static, non-reordering lists.',
    'Put v-for on <template> to repeat siblings without a wrapper.',
    'Never put v-if and v-for on the same element — filter with computed.',
    'Vue 3: arr[i]=x and arr.length=n are reactive (no Vue.set needed).',
    'Compiles to renderList(source, callback) producing one vnode per item.',
    'Keyed diff (LIS) reuses/moves nodes; unkeyed patches in place.',
    'Virtualize lists over a few thousand rows.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render an unordered list of the strings [\'Red\', \'Green\', \'Blue\'], showing each color as a <li>. Use a proper key.',
      hint: 'The strings are unique, so each color can be its own key.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst colors = ref([\'Red\', \'Green\', \'Blue\'])\n</script>\n\n<template>\n  <ul>\n    <li v-for="color in colors" :key="color">{{ color }}</li>\n  </ul>\n</template>',
        explanation: [
          'v-for="color in colors" repeats the <li> per string.',
          ':key="color" works because each color value is unique.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Given a reactive object person = { name: \'Ada\', city: \'Pune\' }, render a definition list (dt/dd) of its keys and values without an extra wrapper element.',
      hint: 'Iterate with (value, key) and put v-for on a <template>.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { reactive } from \'vue\'\nconst person = reactive({ name: \'Ada\', city: \'Pune\' })\n</script>\n\n<template>\n  <dl>\n    <template v-for="(value, key) in person" :key="key">\n      <dt>{{ key }}</dt>\n      <dd>{{ value }}</dd>\n    </template>\n  </dl>\n</template>',
        explanation: [
          'Object iteration uses (value, key) order — value first.',
          'v-for on <template> emits dt + dd per entry with no wrapper node; key sits on the template.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'You have items with ids and a search query. Render only items whose name matches the query, keep keys stable, and do the filtering efficiently (not inline).',
      hint: 'Use a computed for the filtered list and :key on the id.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst items = ref([\n  { id: 1, name: \'Apple\' },\n  { id: 2, name: \'Banana\' },\n  { id: 3, name: \'Avocado\' },\n])\nconst q = ref(\'\')\nconst filtered = computed(() =>\n  items.value.filter((i) => i.name.toLowerCase().includes(q.value.toLowerCase()))\n)\n</script>\n\n<template>\n  <input v-model="q" />\n  <ul>\n    <li v-for="item in filtered" :key="item.id">{{ item.name }}</li>\n  </ul>\n</template>',
        explanation: [
          'Filtering lives in a computed, so it is cached and only recomputes when items or q change.',
          ':key="item.id" stays stable across filter changes, so Vue reuses the correct rows.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why using the index as :key breaks a list of checkboxes when an item is removed from the top, and show the fix.',
      hint: 'The index shifts when you remove the first item; bind the key to a stable id instead.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst tasks = ref([\n  { id: \'a\', label: \'One\' },\n  { id: \'b\', label: \'Two\' },\n  { id: \'c\', label: \'Three\' },\n])\nfunction removeFirst() { tasks.value.shift() }\n</script>\n\n<template>\n  <!-- WRONG: :key="index" — after shift, checked state moves to wrong row -->\n  <!-- RIGHT: stable id key keeps each checkbox glued to its task -->\n  <label v-for="task in tasks" :key="task.id">\n    <input type="checkbox" /> {{ task.label }}\n  </label>\n  <button @click="removeFirst">Remove first</button>\n</template>',
        explanation: [
          'With :key="index", removing the first item shifts every index down, so Vue patches in place and the checked DOM state stays at the old positions — now attached to the wrong tasks.',
          'With :key="task.id", each row keeps a stable identity, so removing one row tears down exactly that node and the remaining checkboxes keep their correct state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'v-for is unavoidable — you cannot build a non-trivial Vue app without it, and interviewers know it instantly exposes whether you understand keys, reactivity, and diffing. Nailing it signals you write correct, performant list UIs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Wipro) ask the syntax, the alias order, and "why do we need a key". Product companies (Zoho, Flipkart, Razorpay) ask you to fix the index-key bug and explain v-if/v-for precedence. FAANG-level rounds probe the compiler output (renderList), the keyed diff (LIS), and SSR hydration implications of unstable keys.',
    whatInterviewersExpect:
      'Define v-for and its iterables precisely, give a keyed example, explain WHY a stable key matters with a concrete reorder/remove scenario, and connect it to performance (computed-derived lists, virtualization) for senior credit.',
  },
}

export default vFor
