import type { ConceptLesson } from '../../../types/lesson'

const virtualDom: ConceptLesson = {
  // 1. Concept Summary
  slug: 'virtual-dom',
  name: 'Virtual DOM',
  category: 'lifecycle-rendering',
  difficulty: 'advanced',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'The Virtual DOM is the core idea that lets you write declarative templates while Vue figures out the minimal real DOM changes for you.',
    'It is the single most common "how does Vue actually update the page?" interview question — knowing it separates framework users from framework understanders.',
    'It explains why keys matter in v-for, why direct DOM mutation breaks things, and why some updates are surprisingly cheap or expensive.',
    'Understanding the diff/patch process is the basis for performance work: v-memo, keys, freezing data, and avoiding unnecessary re-renders.',
    'Vue 3\'s compiler-informed Virtual DOM (block tree, patch flags) is a favorite advanced topic that shows you know what makes Vue fast.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'The Virtual DOM is a rough pencil sketch you compare against the real painting before changing only the bits that differ.',
    story: [
      'Imagine you painted a big picture on a wall, and now you want to change a few things in it.',
      'Instead of repainting the whole wall (slow and messy), you first make a quick new pencil sketch of how you want it to look.',
      'Then you lay the new sketch next to your old sketch and circle only the spots that are different — maybe the sun moved and a cloud is now grey.',
      'Now you only touch those few spots on the real wall. Vue does this: it sketches your page in memory, compares the new sketch to the old one, and changes only the real parts that actually differ.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'The real DOM (the actual page elements) is slow to change a lot of at once, and rebuilding all of it every time data changes would be wasteful.',
    'So Vue keeps a lightweight copy of the page as plain JavaScript objects — this is the Virtual DOM.',
    'When data changes, Vue builds a new Virtual DOM and compares it to the previous one to see exactly what changed.',
    'Then it makes only those specific changes to the real DOM, which is much faster than rebuilding everything.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'The Virtual DOM is an in-memory tree of plain JavaScript objects (vnodes) that describe what the real DOM should look like. Vue renders to this tree, diffs the new tree against the previous one, and applies only the differences to the real DOM.',
    how: 'Your template compiles into a render function that returns vnodes. On each update Vue runs render again to get a new vnode tree, then the patch algorithm compares old vs new node-by-node and performs the minimal set of real DOM operations.',
    why: 'Direct, manual DOM updates are error-prone and touching the real DOM is expensive. The Virtual DOM lets you describe the end state declaratively and trust Vue to compute and apply the minimal change set.',
    code: {
      label: 'A vnode is just an object',
      lang: 'js',
      code: 'import { h } from \'vue\'\n\n// h(type, props, children) creates a vnode — a plain JS object\nconst vnode = h(\'button\', { class: \'btn\', onClick: () => {} }, \'Save\')\n\nconsole.log(vnode.type)     // \'button\'\nconsole.log(vnode.props)    // { class: \'btn\', onClick: fn }\nconsole.log(vnode.children) // \'Save\'\n// This object describes a <button> — no real DOM created yet.',
      explanation: [
        'h() is the render helper that creates a vnode; templates compile down to calls like this.',
        'A vnode is a cheap plain object describing type, props, and children — not a real element.',
        'Vue creates real DOM from vnodes during mount, and diffs vnodes during updates.',
        'Because vnodes are just objects, building and comparing them is fast.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'The Virtual DOM is an abstraction in which the UI is represented as a tree of vnodes — lightweight JavaScript objects describing element type, props, and children — rather than mutating the real DOM directly. A component render function produces a vnode tree; on update Vue produces a new tree and runs a reconciliation (diff/patch) algorithm that compares the new tree against the previous one and issues the minimal set of imperative DOM operations to reconcile them. Vue 3 augments this with compile-time information (patch flags, block trees, static hoisting) so the runtime diff can skip static content and only check the parts that can change.',

  // 7. Internal Working
  internalWorking: [
    'The template compiler turns your template into a render function; calling it produces a vnode tree (each vnode records type, props, children, and a key/shapeFlag/patchFlag).',
    'On first render (mount), the patch function has no previous tree, so it creates real DOM nodes from the vnodes and inserts them.',
    'When reactive state changes, the component\'s render effect re-runs, producing a NEW vnode tree for the same component.',
    'The patch function diffs new vs old at the same position: if node types differ it replaces; if they match it patches props (add/update/remove attributes, listeners) and then recurses into children.',
    'Child lists are reconciled with a keyed algorithm (Vue 3 uses an optimized two-ended + longest-increasing-subsequence approach) to move/reuse nodes instead of recreating them — which is why stable keys matter.',
    'Vue 3 optimizations cut work: static nodes are hoisted out of the render function and reused, patch flags mark exactly which dynamic bindings a vnode has (e.g. only its text or only its class), and block trees collect dynamic descendants so the diff skips fully static subtrees entirely.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  state changes
       │
       ▼  render() runs again
  ┌─────────────────┐        ┌─────────────────┐
  │ OLD vnode tree  │        │ NEW vnode tree  │
  │   <ul>          │        │   <ul>          │
  │    <li>A</li>   │        │    <li>A</li>   │  same → keep
  │    <li>B</li>   │  diff  │    <li>X</li>   │  text differs → patch text
  │    <li>C</li>   │ ─────► │    <li>C</li>   │  same → keep
  └─────────────────┘        └─────────────────┘
       │
       ▼  minimal real DOM ops
  REAL DOM: only the 2nd <li> text is updated (not the whole list)`,

  // 9. Memory Visualization — omitted

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — template compiles to vnodes',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <!-- compiles to roughly: h(\'button\', { onClick: () => count.value++ }, count.value) -->\n  <button @click="count++">{{ count }}</button>\n</template>',
      explanation: [
        'You write a declarative template; Vue compiles it into a render function returning vnodes.',
        'Clicking changes the reactive count, which re-runs render and produces a new vnode tree.',
        'Vue diffs and updates only the button\'s text node, not the whole button.',
        'You never touch the real DOM yourself — that is the point of the Virtual DOM.',
      ],
    },
    intermediate: {
      label: 'Intermediate — why keys change the diff',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([{ id: 1, t: \'A\' }, { id: 2, t: \'B\' }])\nfunction prepend() { items.value.unshift({ id: 0, t: \'Z\' }) }\n</script>\n\n<template>\n  <button @click="prepend">Prepend</button>\n  <!-- with :key the diff MOVES nodes; without it, it would patch every li -->\n  <li v-for="i in items" :key="i.id">{{ i.t }}</li>\n</template>',
      explanation: [
        'With a stable :key, Vue\'s keyed diff recognizes existing nodes and just inserts the new one at the front.',
        'Without a key, Vue matches by index, so prepending makes it patch the text of every <li> instead.',
        'Keys let the diff reuse and move DOM nodes rather than mutating them in place.',
        'This is the practical reason "always use :key with v-for" is a rule.',
      ],
    },
    advanced: {
      label: 'Advanced — hand-written render function (vnodes directly)',
      lang: 'js',
      code: 'import { h, defineComponent, ref } from \'vue\'\n\nexport default defineComponent({\n  setup() {\n    const open = ref(false)\n    return () =>\n      h(\'div\', { class: \'panel\' }, [\n        h(\'button\', { onClick: () => (open.value = !open.value) }, \'Toggle\'),\n        open.value ? h(\'p\', \'Now visible\') : null,\n      ])\n  },\n})',
      explanation: [
        'Render functions let you build the vnode tree imperatively — useful for highly dynamic UI.',
        'The returned function is the render: it re-runs when `open` changes, producing a new tree.',
        'Returning null conditionally adds/removes the <p> vnode, so the patch adds or removes that node.',
        'This is exactly what templates compile into; seeing it demystifies the Virtual DOM.',
      ],
    },
    realProject: {
      label: 'Real project — a virtualized list relies on minimal patching',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst all = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, t: `Row ${i}` })))\nconst start = ref(0)\nconst visible = computed(() => all.value.slice(start.value, start.value + 30))\n</script>\n\n<template>\n  <div @scroll="onScroll" class="viewport">\n    <div v-for="row in visible" :key="row.id">{{ row.t }}</div>\n  </div>\n</template>',
      explanation: [
        'Only ~30 vnodes exist at a time, so the diff and patch stay tiny no matter how big the data is.',
        'As you scroll, the visible slice changes and Vue patches the small set of rows by key.',
        'Stable keys let Vue reuse row DOM nodes instead of recreating them on each scroll.',
        'This pattern (virtualization) leans entirely on the Virtual DOM\'s minimal-update guarantee for smoothness.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the Virtual DOM?',
      answer: 'An in-memory tree of plain JavaScript objects (vnodes) describing the UI. Vue renders to this tree, diffs the new version against the old, and applies only the differences to the real DOM.',
      explanation: 'A solid answer names both the representation (vnodes) and the purpose (minimal real DOM updates via diffing).',
    },
    {
      level: 'beginner',
      question: 'Why use a Virtual DOM instead of updating the real DOM directly?',
      answer: 'Real DOM operations are expensive and manual updates are error-prone. The Virtual DOM lets you describe the desired end state declaratively, and Vue computes the minimal set of real DOM changes to reach it.',
      explanation: 'Good answers stress declarative authoring plus minimal, batched, computed updates.',
    },
    {
      level: 'intermediate',
      question: 'Why do keys matter in the diffing algorithm?',
      answer: 'Keys give each child vnode a stable identity so the diff can match, reuse, and move existing DOM nodes between renders instead of patching by index. Without keys, reordering or inserting causes Vue to patch many nodes unnecessarily or lose component state.',
      explanation: 'Connecting keys to the children reconciliation algorithm shows real diff understanding.',
    },
    {
      level: 'intermediate',
      question: 'Walk through what happens when a reactive value used in the template changes.',
      answer: 'The change triggers the component\'s render effect to re-run, producing a new vnode tree. The patch function diffs it against the previous tree at each position, patches changed props and text, reconciles keyed children, and issues the minimal real DOM operations.',
      explanation: 'This links reactivity to the Virtual DOM update path — a frequent combined question.',
    },
    {
      level: 'advanced',
      question: 'How does Vue 3 make its Virtual DOM faster than a naive one?',
      answer: 'The compiler adds optimizations: static nodes are hoisted and reused, patch flags annotate exactly which dynamic bindings a vnode has so the runtime checks only those, and block trees collect dynamic descendants so fully static subtrees are skipped entirely during diffing.',
      explanation: 'Mentioning patch flags, static hoisting, and block trees is a strong Vue 3 internals signal.',
    },
    {
      level: 'senior',
      question: 'Is the Virtual DOM always faster than direct DOM manipulation?',
      answer: 'No. For a single known mutation, direct DOM is faster — the Virtual DOM adds diff overhead. Its value is in developer ergonomics and in efficiently handling many/unknown updates declaratively. Vue 3\'s compiler optimizations narrow the gap by skipping static work, and for hot paths you can use v-memo, v-once, or even direct refs.',
      explanation: 'Senior signal: not treating VDOM as magically fast and knowing when its overhead matters.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is a vnode and what fields does it contain (type, props, children, key)?',
    'How is reconciliation done for lists with and without keys?',
    'What are patch flags and static hoisting in Vue 3?',
    'How does the render effect connect reactivity to the Virtual DOM?',
    'When would you use a render function or JSX instead of a template?',
    'What is the difference between Vue\'s and React\'s diffing approach?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using index as :key in dynamic v-for lists.',
      why: 'Index keys are unstable on reorder/insert, so the diff reuses the wrong nodes and corrupts component/input state.',
      fix: 'Use a stable unique id from the data as the key.',
    },
    {
      mistake: 'Mutating the real DOM directly (e.g. via querySelector) alongside Vue.',
      why: 'Vue\'s diff assumes it owns the DOM; manual changes get overwritten or cause inconsistencies on the next patch.',
      fix: 'Let Vue render the state; use refs/onMounted only for third-party integration, not for content Vue manages.',
    },
    {
      mistake: 'Believing the Virtual DOM is always faster.',
      why: 'For a single targeted change, the diff is pure overhead compared to one direct DOM write.',
      fix: 'Understand it optimizes for declarative, many/unknown updates; use v-memo/v-once for known-static hot paths.',
    },
    {
      mistake: 'Forcing re-renders of huge trees by changing top-level state unnecessarily.',
      why: 'Even with optimizations, large vnode trees take time to diff each update.',
      fix: 'Split components, freeze static data, use shallowRef, and isolate the changing subtree.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'All templates compile to render functions returning vnodes; the runtime diff/patch is what applies your reactive state changes to the page.' },
    { area: 'Component library', detail: 'Libraries often hand-write render functions or JSX for highly dynamic components (tables, virtualized lists) where templates are too rigid.' },
    { area: 'Pinia', detail: 'Store state changes propagate through component render effects; the Virtual DOM ensures only the components reading changed state re-render and patch.' },
    { area: 'SSR', detail: 'On the server vnodes are rendered to an HTML string; on the client, hydration reuses that DOM instead of recreating it, but the same vnode model drives both.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Minimal, computed DOM updates instead of full re-renders keep most UI updates cheap.',
      'Vue 3 patch flags and static hoisting let the runtime skip static content, making diffs near-O(dynamic-parts).',
    ],
    bad: [
      'Very large vnode trees still cost time to diff on every update.',
      'Missing/index keys cause excessive patching and can drop DOM/component state.',
    ],
    optimizations: [
      'Always use stable keys in v-for so the keyed diff can move and reuse nodes.',
      'Use v-once for one-time content and v-memo to skip re-diffing unchanged subtrees.',
      'Use shallowRef / markRaw / Object.freeze for large data that should not be deeply tracked or diffed.',
      'Split big components so only the subtree whose state changed re-renders.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['reactivity-fundamentals', 'template-compilation', 'declarative-rendering'],
    nextConcepts: ['render-functions', 'reactivity-render-link', 'v-for-key', 'v-once-v-memo'],
    dependencyNote:
      'The Virtual DOM sits between template compilation (which produces render functions) and the real DOM. It depends on understanding reactivity and compilation, and it leads into render functions, the reactivity-to-render link, keyed list diffing, and the v-once/v-memo optimizations.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two trees side by side labeled OLD and NEW vnode trees.',
      'Mark one leaf node whose text changed and a couple of identical siblings.',
      'Draw a "diff" arrow between the trees and circle only the differing node.',
      'Below, draw the REAL DOM and show a single arrow touching only the changed element.',
      'Say: "Vue renders to vnodes, diffs new vs old, and patches only the differences — keys give children stable identity so it moves nodes instead of rebuilding them."',
    ],
    diagram: `  OLD            NEW
  <ul>           <ul>
   li:A           li:A     same → skip
   li:B   diff→   li:X     text changed → patch
   li:C           li:C     same → skip
        │
        ▼
  REAL DOM: update one <li> text only`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'The Virtual DOM is an in-memory tree of vnodes (plain objects describing type, props, children) that Vue renders to. When state changes, the render effect produces a new tree; Vue diffs it against the old one and applies only the minimal real DOM operations. Keys give children stable identity so the diff moves/reuses nodes. Vue 3 makes it fast with patch flags, static hoisting, and block trees that skip static content. It optimizes declarative, many/unknown updates — not single known mutations.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'The Virtual DOM is how Vue lets you write declarative templates without touching the real DOM yourself. Instead of mutating elements directly, Vue represents your UI as a tree of vnodes — lightweight JavaScript objects that record an element\'s type, its props, and its children. Your template compiles into a render function that returns this tree. On the first render, since there is no previous tree, Vue creates real DOM nodes from the vnodes and inserts them — that is mounting. When a reactive value used in the template changes, the component\'s render effect re-runs and produces a brand-new vnode tree. Now the patch algorithm diffs new against old at each position: if the node type differs it replaces the element; if it matches it patches the changed props, attributes, and listeners, then recurses into children. Child lists are reconciled with a keyed algorithm, which is why stable keys matter — they let Vue move and reuse existing DOM nodes instead of patching everything by index. The result is that only the parts that actually changed touch the real DOM. Vue 3 goes further with compile-time help: static nodes are hoisted and reused, patch flags mark exactly which bindings on a vnode are dynamic so the runtime only checks those, and block trees let it skip entirely static subtrees. One nuance worth stating: the Virtual DOM is not magically faster than a single direct DOM write — for one known mutation, direct is faster. Its value is ergonomics and efficiently handling many or unknown updates declaratively, and Vue 3\'s optimizations shrink the diff overhead dramatically.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarative ergonomics and safe minimal updates vs the per-update diff overhead a hand-tuned direct DOM update would avoid.',
      'Templates (statically analyzable, faster runtime) vs render functions/JSX (maximally flexible but opaque to compiler optimizations).',
    ],
    edgeCases: [
      'Index keys break state when lists reorder; non-unique keys cause subtle node reuse bugs.',
      'Replacing a node type (div→span) discards the element and its state rather than patching.',
      'Stateful child components keyed by index can swap their internal state when the list changes.',
      'Very deep trees can hit diff cost even when only a leaf changed (mitigated by block trees).',
    ],
    runtimeBehavior: [
      'Patch flags let the runtime check only dynamic bindings instead of full prop diffing.',
      'Static hoisting reuses the same vnode object across renders for unchanging markup.',
      'Keyed children reconciliation uses a two-ended scan plus longest-increasing-subsequence to minimize moves.',
    ],
    scalability: [
      'Bounding the number of mounted/diffed vnodes (virtualization, pagination) keeps update cost flat regardless of data size.',
      'Component splitting localizes re-renders so unrelated subtrees are not re-diffed.',
    ],
    productionConcerns: [
      'Hydration relies on the server and client producing identical vnode output; mismatches break interactivity.',
      'Over-deep reactivity on huge data inflates both tracking and diff cost — use shallowRef/markRaw.',
      'Mixing manual DOM mutation with Vue\'s rendering leads to nodes being overwritten on the next patch.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Virtual DOM = in-memory tree of vnodes (plain objects: type, props, children, key).',
    'Templates compile to render functions that return vnodes.',
    'Update flow: state change → render effect re-runs → new tree → diff vs old → minimal real DOM ops.',
    'Mount = no previous tree, so create real nodes; update = diff against previous.',
    'Keys give children stable identity → move/reuse nodes instead of index patching.',
    'Vue 3 speedups: patch flags, static hoisting, block trees.',
    'Not always faster than direct DOM — optimizes declarative/many updates.',
    'Use stable :key in v-for, always.',
    'v-once / v-memo skip re-diffing static or unchanged subtrees.',
    'Never manually mutate DOM that Vue renders — it gets overwritten.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a vnode for a <span class="tag"> with text "new" using the h() helper.',
      hint: 'h(type, props, children).',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\nconst vnode = h(\'span\', { class: \'tag\' }, \'new\')\n// vnode.type === \'span\', vnode.children === \'new\'',
        explanation: [
          'h() builds a plain object describing the element, not a real DOM node.',
          'Props go in the second argument, children in the third.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Show a v-for list with a stable key and explain in a comment why it beats index keys when prepending.',
      hint: 'Use a unique id field for :key.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- stable id key: prepend inserts ONE node; index key would patch all -->\n  <li v-for="item in items" :key="item.id">{{ item.label }}</li>\n</template>',
        explanation: [
          'A stable key lets the keyed diff recognize existing nodes and just insert the new one.',
          'With index keys, prepending shifts every index, forcing Vue to patch every item.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a render function component that toggles a paragraph in and out, demonstrating add/remove of a vnode.',
      hint: 'Return null conditionally for the paragraph child.',
      solution: {
        lang: 'js',
        code: 'import { h, defineComponent, ref } from \'vue\'\n\nexport default defineComponent({\n  setup() {\n    const show = ref(true)\n    return () =>\n      h(\'div\', [\n        h(\'button\', { onClick: () => (show.value = !show.value) }, \'Toggle\'),\n        show.value ? h(\'p\', \'visible\') : null,\n      ])\n  },\n})',
        explanation: [
          'When show flips, render returns a tree with or without the <p> vnode.',
          'The patch algorithm adds or removes only that node in the real DOM.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, with a code comment, why this list loses checkbox state on reorder and fix it.',
      hint: 'The bug is the key; checkbox state lives in the DOM tied to node identity.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst rows = ref([{ id: 1 }, { id: 2 }, { id: 3 }])\n</script>\n<template>\n  <!-- BUG: :key="i" (index) → reorder reuses wrong DOM, checkbox state sticks to position -->\n  <!-- FIX: key by stable id so the diff moves the actual node + its checkbox -->\n  <div v-for="row in rows" :key="row.id">\n    <input type="checkbox" /> Row {{ row.id }}\n  </div>\n</template>',
        explanation: [
          'Checkbox checked state lives in the real DOM node, not in Vue data.',
          'Index keys tie nodes to positions, so reordering keeps the checkbox with the position, not the row.',
          'A stable id key makes the diff move the actual node, preserving its checkbox state.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The Virtual DOM is THE mental model for how Vue turns your reactive data into screen updates. Internalize it and keys, performance tuning, render functions, and SSR hydration all become obvious rather than mysterious.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is the Virtual DOM and why use it". Product companies (Zoho, Flipkart, Razorpay) ask about keys, the diff process, and when it is NOT faster. FAANG-level interviews probe Vue 3\'s patch flags, block trees, and the keyed reconciliation algorithm.',
    whatInterviewersExpect:
      'They expect you to define vnodes, describe the render → diff → patch flow, explain why keys matter, acknowledge the diff has overhead (not always faster), and ideally mention Vue 3\'s compiler-driven optimizations.',
  },
}

export default virtualDom
