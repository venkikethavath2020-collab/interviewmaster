import type { ConceptLesson } from '../../../types/lesson'

const vForKey: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-for-key',
  name: 'v-for key',
  category: 'templates',
  difficulty: 'intermediate',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The :key on a v-for is the single most consequential attribute in Vue list rendering — get it wrong and forms, checkboxes, and component state silently attach to the wrong row.',
    'It is what lets Vue\'s diffing algorithm identify which items moved, stayed, or were removed, so it can reuse DOM instead of rebuilding it.',
    'The "why not use index as key" question appears in almost every Vue interview, and a precise answer instantly marks you as someone who has debugged real list bugs.',
    'Stable keys are essential for SSR hydration: a mismatch between server and client keys causes hydration errors.',
    'Understanding keys generalizes — React has the exact same concept, so the mental model transfers across frameworks.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A key is the name tag on each kid in a line — it tells the teacher who is who even when they shuffle around.',
    story: [
      'Imagine a class lining up, and each kid wears a name tag: Sam, Mia, Leo.',
      'If two kids swap places, the teacher does not get confused — she reads the name tags and knows exactly who moved where.',
      'But if instead of names the kids only wore numbers based on their spot in line — "1st, 2nd, 3rd" — then when they swap, the labels stay in place and the teacher thinks the wrong kid is in the wrong spot.',
      'A key in Vue is the name tag. Give each item a real, unchanging name (an id) and Vue always knows who is who, even when the list shuffles.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When you repeat elements with v-for, Vue needs a way to tell each repeated item apart when the list changes.',
    'You give it that identity with :key, a special attribute set to something unique and unchanging for each item — usually a database id.',
    'With good keys, Vue can reuse the existing DOM pieces and just move them around when items reorder.',
    'If you use the position number (index) as the key, Vue gets confused when items are added, removed, or reordered, because the position changes even though the item is the same.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The :key is a special attribute bound on a v-for element that gives each rendered item a stable, unique identity, letting Vue\'s virtual DOM diff match old and new vnodes correctly across re-renders.',
    how: 'During patch, Vue compares the old child vnode list to the new one. If keys are present, it builds a key→vnode map and matches by key — reusing, moving, mounting, or unmounting nodes precisely. If keys are absent or duplicated, it falls back to an index-based in-place patch.',
    why: 'It preserves per-item DOM and component state (input values, focus, animation, scroll) across list mutations, and it minimizes DOM operations on reorder.',
    code: {
      label: 'A stable key vs a fragile index key',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst users = ref([\n  { id: 101, name: \'Ada\' },\n  { id: 102, name: \'Lin\' },\n])\n</script>\n\n<template>\n  <!-- GOOD: stable business id -->\n  <li v-for="u in users" :key="u.id">{{ u.name }}</li>\n\n  <!-- RISKY: index changes when the list mutates -->\n  <!-- <li v-for="(u, i) in users" :key="i">{{ u.name }}</li> -->\n</template>',
      explanation: [
        ':key="u.id" binds each row to a permanent identity from the data.',
        'If a user is removed from the top, only that row is unmounted; the rest are reused.',
        'Using :key="i" (index) would re-label every row after a removal, breaking per-row state.',
        'The key expression must be a primitive (string/number), not an object.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The key is a hint to Vue\'s patching algorithm that uniquely identifies each vnode in a keyed children list. When children are keyed, the runtime uses patchKeyedChildren, which trims matching prefixes/suffixes and then builds a key-to-newIndex map to reconcile the middle, computing a longest-increasing-subsequence of stable positions to perform the minimum number of DOM moves. Keys must be unique among siblings and stable across renders; without them Vue uses an in-place index patch that mutates existing nodes by position, which can leak local state into the wrong item.',

  // 7. Internal Working
  internalWorking: [
    'When the compiler sees :key on a v-for element, it attaches the key to each generated vnode so the runtime can treat the children as keyed.',
    'On patch, Vue first synchronizes the common prefix (matching keys from the start) and common suffix (matching keys from the end) of the old and new child arrays.',
    'For the remaining "middle" section, it builds a Map from key to the new vnode index.',
    'It walks the old middle vnodes; for each, it looks up its key in the map to find where it now belongs, patches it in place, and records its new index — or unmounts it if its key disappeared.',
    'It computes the longest increasing subsequence of the new indices to find which nodes are already in relative order and need no DOM move; everything else is moved with insertBefore.',
    'New keys that had no old match are freshly mounted. The net effect is the minimum set of create/move/remove DOM operations.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  OLD (keyed)        NEW (keyed)         action
  ┌──────┐           ┌──────┐
  │ A:1  │──match───►│ A:1  │  reuse (no move)
  │ B:2  │──removed─►│      │  unmount B
  │ C:3  │──match───►│ C:3  │  reuse
  │      │           │ D:9  │  mount new D
  └──────┘           └──────┘
   keys let Vue map old→new by identity, not position
   ⇒ minimum DOM ops (LIS keeps stable nodes in place)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each child vnode stores its key alongside its props and element reference; the key is just a primitive held on the vnode object in the heap.',
    'During patch Vue allocates a temporary Map (key → new index) and a small array for the LIS computation — short-lived, freed after the patch.',
    'DOM element references are reused when keys match: the same HTMLElement instance is moved rather than recreated, so attached state (focus, uncontrolled input value) survives.',
    'When a key disappears, its component instance is torn down and its reactive effects are stopped, releasing that subtree from memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — keying by id',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst products = ref([\n  { sku: \'P-1\', name: \'Pen\' },\n  { sku: \'P-2\', name: \'Pad\' },\n])\n</script>\n\n<template>\n  <ul>\n    <li v-for="p in products" :key="p.sku">{{ p.name }}</li>\n  </ul>\n</template>',
      explanation: [
        'The SKU is a stable unique identifier — an ideal key.',
        'Keys must be unique among siblings, not globally.',
        'Reordering products now moves nodes instead of recreating them.',
        'The key is bound with : because it is a dynamic expression.',
      ],
    },
    intermediate: {
      label: 'Intermediate — key on <template> and forcing remount',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst rows = ref([{ id: 1 }, { id: 2 }])\nconst editorKey = ref(0)\nfunction resetEditor() { editorKey.value++ }\n</script>\n\n<template>\n  <!-- key on the template when v-for is on it -->\n  <template v-for="row in rows" :key="row.id">\n    <tr><td>{{ row.id }}</td></tr>\n  </template>\n\n  <!-- changing a key forces a full remount of a single element -->\n  <RichEditor :key="editorKey" />\n  <button @click="resetEditor">Reset editor</button>\n</template>',
      explanation: [
        'When v-for is on <template>, the :key goes on the template, not the inner element.',
        'Keys also work outside v-for: changing a component\'s :key tears it down and mounts a fresh instance.',
        'This "key change to remount" pattern is how you fully reset a component\'s internal state.',
        'It is heavier than prop updates, so reserve it for genuine reset semantics.',
      ],
    },
    advanced: {
      label: 'Advanced — why index keys corrupt stateful rows',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\n  { id: \'a\', label: \'Alpha\' },\n  { id: \'b\', label: \'Beta\' },\n  { id: \'c\', label: \'Gamma\' },\n])\nfunction removeTop() { items.value.shift() }\n</script>\n\n<template>\n  <!-- Each row owns an uncontrolled <input>. -->\n  <div v-for="item in items" :key="item.id">\n    <input :placeholder="item.label" />\n  </div>\n  <button @click="removeTop">Remove top</button>\n</template>',
      explanation: [
        'With the stable item.id key, removing the top row unmounts exactly that DOM node and shifts the rest up — their input contents stay glued to the right item.',
        'Had we keyed by index, removing the top would re-map index 0 to Beta while the DOM node (with Alpha\'s typed text) stays put — text now appears on the wrong row.',
        'Uncontrolled DOM state (typed text, focus, scroll) is exactly what index keys silently break.',
        'The fix is always a stable identity key.',
      ],
    },
    realProject: {
      label: 'Real project — keyed list synced to an API',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst comments = ref([])\nasync function load() {\n  const res = await fetch(\'/api/comments\')\n  comments.value = await res.json() // each has a unique _id\n}\nfunction optimisticAdd(text) {\n  comments.value.unshift({ _id: \'tmp-\' + Date.now(), text, pending: true })\n}\nonMounted(load)\n</script>\n\n<template>\n  <ul>\n    <li v-for="c in comments" :key="c._id" :class="{ pending: c.pending }">\n      {{ c.text }}\n    </li>\n  </ul>\n</template>',
      explanation: [
        'Server records carry a unique _id — the natural stable key.',
        'Optimistic inserts use a temporary unique key (tmp-timestamp) so they render immediately and don\'t collide.',
        'When the real id arrives, replacing the temp item swaps its key — Vue unmounts the temp node and mounts the confirmed one cleanly.',
        'Stable keys here keep scroll position and any per-comment UI intact during refreshes.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the purpose of :key in v-for?',
      answer: 'It gives each rendered item a stable unique identity so Vue\'s diffing algorithm can match items across re-renders and reuse DOM rather than recreating it.',
      explanation: 'A good answer ties the key to identity and to the diff, not just "Vue needs it".',
    },
    {
      level: 'beginner',
      question: 'What makes a good key value?',
      answer: 'A primitive (string or number) that is unique among siblings and stable across renders — typically a database id or a natural unique field, never a random value generated on each render.',
      explanation: 'Mentioning "stable" and "unique among siblings" (not global) shows precision.',
    },
    {
      level: 'intermediate',
      question: 'Why is the array index usually a bad key?',
      answer: 'Because the index reflects position, not identity. When items are inserted, removed, or reordered, indices shift, so Vue reuses the wrong DOM/component instances and per-item state (input text, focus, checkbox) lands on the wrong item.',
      explanation: 'The classic question — the strong answer gives the concrete state-leak scenario, not just "it changes".',
    },
    {
      level: 'intermediate',
      question: 'Is using the index ever acceptable as a key?',
      answer: 'Yes, for a purely presentational list that never reorders, filters, or has stateful children — the index is then effectively stable. But a stable id is always safer.',
      explanation: 'Shows nuance rather than dogma; interviewers like the conditional answer.',
    },
    {
      level: 'advanced',
      question: 'How does changing a key cause a remount, and when would you use that?',
      answer: 'A key change makes the diff see a different identity, so the old vnode is unmounted and a new one mounted — destroying and recreating component state. You use it to force-reset a component, e.g. resetting a form by bumping its :key when switching the entity being edited.',
      explanation: 'Demonstrates the key works beyond v-for and a real reset pattern.',
    },
    {
      level: 'senior',
      question: 'Walk through the keyed diff algorithm Vue uses.',
      answer: 'patchKeyedChildren syncs the common prefix and suffix by key, then for the remaining middle builds a key→newIndex map, patches surviving old nodes in place, unmounts vanished keys, computes the longest increasing subsequence of new positions to determine which nodes need no move, and mounts/moves the rest — producing the minimum DOM operations.',
      explanation: 'Naming prefix/suffix trimming, the key map, and the LIS optimization is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What happens if two siblings share the same key?',
    'Can you use an object as a key? Why not?',
    'How do keys affect <transition-group> animations?',
    'Why do unstable keys break SSR hydration?',
    'How does Vue\'s keyed diff compare to React\'s reconciliation?',
    'What is the longest-increasing-subsequence step doing in the diff?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using the loop index as the key on a list that can reorder, filter, or insert.',
      why: 'Indices track position not identity, so DOM and component state attach to the wrong items after a mutation.',
      fix: 'Bind :key to a stable unique id from the data.',
    },
    {
      mistake: 'Generating keys with Math.random() or Date.now() inside the template.',
      why: 'The key changes every render, so Vue unmounts and remounts every item each time — destroying state and tanking performance.',
      fix: 'Use a value that persists with the item (assign an id once when the item is created).',
    },
    {
      mistake: 'Duplicate keys among siblings.',
      why: 'The key→vnode map collides, so the diff mismatches nodes and Vue logs a warning while rendering incorrectly.',
      fix: 'Ensure keys are unique within the same v-for; combine fields if needed (e.g. type + id).',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every keyed v-for in the app uses a domain id; switching a route param often bumps a component :key to force a clean remount of the page.' },
    { area: 'Component library', detail: 'List/Table components require consumers to pass a row-key (like Element Plus / Naive UI) precisely so internal v-for diffing stays correct.' },
    { area: 'SSR', detail: 'Server and client must emit identical keys; non-deterministic keys cause hydration mismatch warnings and re-renders.' },
    { area: 'Vue', detail: '<transition-group> relies on keys to know which elements entered, moved, or left so it can run FLIP animations.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Stable keys let Vue move existing DOM nodes (insertBefore) instead of recreating subtrees, drastically cutting DOM work on reorder.',
      'Correct keys preserve component instances, avoiding repeated mount/unmount cost and re-running of setup.',
    ],
    bad: [
      'Unstable keys (random/timestamp per render) force a full remount of the entire list every render — worst case for performance.',
      'Index keys can cause extra patches when only an insert at the top happened, since every following index changed.',
    ],
    optimizations: [
      'Assign ids at data-creation time so keys never need to be generated during render.',
      'For composite identity, build the key once (e.g. `${type}-${id}`) rather than per render in a complex expression.',
      'Pair stable keys with v-memo to skip patching unchanged rows entirely.',
      'Use stable keys with virtualization so recycled rows map predictably.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-for', 'virtual-dom', 'reactivity-fundamentals'],
    nextConcepts: ['list-rendering-performance', 'transition-group', 'v-once-v-memo', 'reactivity-render-link'],
    dependencyNote:
      'Keys are the correctness layer on top of v-for and only make sense once you understand the virtual DOM diff; mastering them leads into list-rendering-performance, transition-group animations, and v-memo.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: OLD vnodes and NEW vnodes, each tagged with a key.',
      'Draw arrows matching old to new by key (not by position).',
      'Show one key missing in NEW (unmount) and one new key (mount).',
      'Circle the nodes that stayed in relative order — label them "LIS, no move".',
      'Conclude: keys map identity, so Vue does minimum create/move/remove ops and preserves state.',
    ],
    diagram: `  OLD            NEW
  [A:1]──────────[A:1]   reuse
  [B:2]──x        (B gone) unmount
  [C:3]──────────[C:3]   reuse
                 [D:9]    mount
  matched by KEY, not index → minimal DOM ops`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The :key on a v-for gives each item a stable unique identity (usually a database id) so Vue\'s keyed diff can match old and new vnodes by identity, not position. That reuses and moves DOM instead of rebuilding it and keeps per-row state correct. Index keys break reorder/insert/remove because position shifts; random keys force full remounts. Keys must be primitives, unique among siblings, and stable across renders. Changing a key intentionally remounts a component — a useful reset trick.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The key in a v-for is how Vue identifies each rendered item across re-renders. When the list changes, Vue diffs the old child vnodes against the new ones; if they\'re keyed, it uses patchKeyedChildren, which matches items by key rather than by position. That lets it reuse and move the existing DOM nodes, and crucially it preserves per-item state — typed input text, focus, checkbox state, component instances — by attaching it to the right item. A good key is a primitive that is unique among siblings and stable across renders, almost always a database id. The classic mistake is using the array index: the index is position, not identity, so when you insert at the top, remove an item, or reorder, every following index shifts, Vue reuses the wrong nodes, and state leaks onto the wrong rows. Index keys are only safe for a static, never-reordered, stateless list. Another mistake is generating keys with Math.random or Date.now in the template — they change every render, so Vue remounts the whole list each time, which is the worst case. Internally the diff trims the common prefix and suffix, builds a key-to-index map for the middle, and computes a longest-increasing-subsequence to move the fewest nodes. Keys also matter beyond v-for: changing a component\'s :key remounts it, which is a clean way to reset its internal state, and stable keys are required for SSR hydration to match.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Stable id keys are always correct but require ids to exist; for ad-hoc lists you may have to synthesize ids once, adding a tiny data-modeling cost.',
      'Force-remount-via-key gives a clean reset but throws away DOM/state and re-runs setup — heavier than prop-driven updates; choose based on whether a true reset is intended.',
    ],
    edgeCases: [
      'Duplicate keys: Vue warns and the diff misbehaves; composite keys solve lists merged from multiple sources.',
      'Keys must be primitives — objects are compared by reference and effectively never match, defeating reuse.',
      'transition-group uses keys to detect enter/leave/move; index keys make move animations jump to the wrong elements.',
      'Optimistic UI: temporary keys must be swapped to real ids carefully, or a brief remount flash occurs.',
    ],
    runtimeBehavior: [
      'The LIS step ensures only nodes that broke relative order are physically moved in the DOM.',
      'Unkeyed children skip the map/LIS entirely and patch by index — faster per patch but unsafe for stateful or reorderable lists.',
      'A changed key on any node short-circuits patching that node and triggers unmount+mount of its whole subtree.',
    ],
    scalability: [
      'For large lists, correct keys keep DOM moves minimal, but DOM node count still dominates — combine with virtualization.',
      'In SSR at scale, deterministic keys prevent hydration mismatches that would otherwise cause expensive client re-renders.',
    ],
    productionConcerns: [
      'Index-key state-leak bugs are notoriously hard to reproduce because they only surface after specific reorders/removals.',
      'Hydration warnings in production logs frequently trace back to non-deterministic keys (timestamps, random).',
      'Animations breaking on reorder usually mean keys are positional rather than identity-based.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Key = stable, unique, primitive identity per item.',
    'Almost always a database id; never the index for dynamic lists.',
    'Unique among SIBLINGS, not globally.',
    'Never Math.random()/Date.now() per render → full remount.',
    'Index key OK only for static, stateless, non-reordering lists.',
    'Objects as keys do not work (reference compared).',
    'Changing a :key remounts the element/component (reset trick).',
    'Keyed diff: trim prefix/suffix → key map → LIS → min DOM moves.',
    'Unkeyed diff patches in place by index → state can leak.',
    'transition-group and SSR hydration both depend on stable keys.',
    'Composite keys (type-id) resolve duplicates from merged sources.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render a list of books where each book has an isbn and a title. Use the correct stable key.',
      hint: 'The ISBN is unique per book.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst books = ref([\n  { isbn: \'978-1\', title: \'A\' },\n  { isbn: \'978-2\', title: \'B\' },\n])\n</script>\n\n<template>\n  <li v-for="b in books" :key="b.isbn">{{ b.title }}</li>\n</template>',
        explanation: [
          'ISBN is a stable, unique primitive — an ideal key.',
          'Binding with :key makes it a dynamic expression read from each book.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'You merge two arrays (active and archived tasks) into one list to render. Each array has ids starting from 1, so ids collide. Produce unique keys.',
      hint: 'Prefix the key with the source so collisions disappear.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst active = ref([{ id: 1, t: \'A\' }])\nconst archived = ref([{ id: 1, t: \'Z\' }])\nconst all = computed(() => [\n  ...active.value.map((x) => ({ ...x, key: \'active-\' + x.id })),\n  ...archived.value.map((x) => ({ ...x, key: \'archived-\' + x.id })),\n])\n</script>\n\n<template>\n  <li v-for="item in all" :key="item.key">{{ item.t }}</li>\n</template>',
        explanation: [
          'Prefixing with the source name makes a composite key that is unique across both arrays.',
          'The key is computed once in the derived list, not generated per render.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a "reset form when the selected user changes" pattern using a key change to remount the form component.',
      hint: 'Bind :key on the form to the selected user id.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nimport UserForm from \'./UserForm.vue\'\nconst selectedId = ref(1)\n</script>\n\n<template>\n  <select v-model="selectedId">\n    <option :value="1">User 1</option>\n    <option :value="2">User 2</option>\n  </select>\n\n  <!-- Changing selectedId changes the key → UserForm fully remounts/resets -->\n  <UserForm :key="selectedId" :user-id="selectedId" />\n</template>',
        explanation: [
          'When selectedId changes, the :key changes, so Vue unmounts the old UserForm and mounts a fresh one.',
          'This guarantees the form\'s internal draft state is reset for each user, without manual reset logic.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain with code why typing into per-row inputs then deleting the first row "moves" text to the wrong row under index keys, and show the corrected version.',
      hint: 'Compare :key="i" against :key="row.id" when shift() is called.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst rows = ref([\n  { id: \'r1\' }, { id: \'r2\' }, { id: \'r3\' },\n])\nfunction deleteFirst() { rows.value.shift() }\n</script>\n\n<template>\n  <!-- BROKEN: :key="i" — after shift, DOM input at index 0 (old r1 text) stays,\n       but is now reused for r2, so r1\'s typed text appears on r2 -->\n  <!-- <div v-for="(row, i) in rows" :key="i"><input /></div> -->\n\n  <!-- FIXED: :key="row.id" — deleting r1 unmounts its exact input node,\n       remaining inputs keep their own typed text -->\n  <div v-for="row in rows" :key="row.id"><input /></div>\n  <button @click="deleteFirst">Delete first</button>\n</template>',
        explanation: [
          'Under index keys, Vue patches in place by position; the first DOM input (holding r1\'s text) is reused for r2 after the shift, so the text appears to jump rows.',
          'Under stable id keys, the diff unmounts exactly the r1 node and its input, and r2/r3 keep their own preserved DOM state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The :key question separates developers who copy snippets from those who understand the virtual DOM. A crisp answer with a concrete state-leak example is one of the fastest ways to earn credibility in a Vue interview.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "why do we need a key and why not the index". Product companies (Zoho, Flipkart, Razorpay) hand you a buggy list and ask you to fix the index-key issue and explain it. FAANG-level rounds dig into patchKeyedChildren, the LIS optimization, and SSR hydration consequences.',
    whatInterviewersExpect:
      'Define the key\'s role in identity and diffing, state the rules (primitive, unique among siblings, stable), explain WHY index keys break with a real scenario, and ideally describe the keyed diff algorithm and the remount-via-key trick for senior credit.',
  },
}

export default vForKey
