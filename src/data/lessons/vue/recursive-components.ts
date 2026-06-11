import type { ConceptLesson } from '../../../types/lesson'

const recursiveComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'recursive-components',
  name: 'Recursive Components',
  category: 'components',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Trees, nested menus, comment threads, file explorers, and org charts are all naturally recursive — recursive components are the idiomatic way to render them.',
    'They demonstrate that a component can render itself, which forces you to understand component naming, registration, and base cases.',
    'Without a base case (a v-if guard) a recursive component infinitely renders and crashes the tab — a classic interview trap.',
    'Knowing how to pass depth down and emit events up across recursion levels shows real mastery of props/events flow.',
    'It is the simplest way to handle data of arbitrary, unknown depth without writing N hard-coded layers.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A recursive component is like two mirrors facing each other — each reflection contains a smaller copy of itself, again and again.',
    story: [
      'Imagine you draw a box, and inside that box you draw a smaller version of the very same box.',
      'Inside that smaller box you draw an even smaller one, and you keep going.',
      'You must promise yourself a rule: "stop when the box is too tiny to fit anything." That rule is what keeps you from drawing forever.',
      'A recursive component does this: it shows a little picture and, if there is more stuff inside, it asks a copy of itself to draw that inner stuff — stopping when there is nothing left.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A recursive component is a component that uses itself inside its own template.',
    'This is useful when your data is a tree — a list where each item can contain a list of more items, to any depth.',
    'Each level of the component renders one node and then asks a copy of itself to render that node\'s children.',
    'There must be a stopping condition (a base case) — usually "only render children if there are any" — otherwise it would call itself forever and freeze.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A recursive component is a component that references itself in its own template to render nested, tree-shaped data of arbitrary depth.',
    how: 'A single-file component is automatically registered under its filename, so a TreeNode.vue can use <TreeNode> inside its own <template>. It passes each child node back into itself as a prop, guarded by a v-if/v-for so it stops when there are no more children.',
    why: 'It lets you render structures whose depth you do not know in advance — comment threads, folder trees, nested menus — with one small component instead of hand-coding each level.',
    code: {
      label: 'A self-rendering tree node',
      lang: 'vue',
      code: '<!-- TreeNode.vue -->\n<script setup lang="ts">\ninterface Node { label: string; children?: Node[] }\ndefineProps<{ node: Node }>()\n</script>\n\n<template>\n  <li>\n    {{ node.label }}\n    <ul v-if="node.children?.length">\n      <TreeNode v-for="child in node.children" :key="child.label" :node="child" />\n    </ul>\n  </li>\n</template>',
      explanation: [
        'The component uses <TreeNode> inside its own template — that is the recursion.',
        'The v-if="node.children?.length" is the base case: leaf nodes render no inner <ul>.',
        'Each child is passed back into a fresh TreeNode via the :node prop.',
        'The filename TreeNode.vue auto-registers the name so self-reference resolves.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A recursive component is a component whose render output includes an instance of itself, used to render hierarchically nested data. Resolution depends on the component having a name: single-file components infer their name from the filename (or you set it via the name option / defineOptions), allowing self-reference in the template. The recursion is bounded by a conditional (v-if/v-for over children) that terminates when leaf nodes are reached. Each recursion level is an independent component instance with its own props, reactive state, and lifecycle, forming a render tree that mirrors the data tree.',

  // 7. Internal Working
  internalWorking: [
    'The template compiler turns the self-referencing tag into a render call that resolves the component by name; for SFCs the name is inferred from the filename, so the reference exists even before full registration.',
    'When mounted, the root TreeNode renders its own node and, for each child, creates a child TreeNode vnode with that child as a prop.',
    'Vue mounts each child instance, which repeats the process — producing a render tree one level deeper per recursion, mirroring the data tree.',
    'The v-if guard on children is the base case: when node.children is empty/undefined, no further child instances are created and recursion stops.',
    'Each instance is fully independent — its own props, setup state, and lifecycle hooks — so reactivity at one node does not force siblings to re-render unless their props change.',
    'On data updates, Vue diffs the render tree; adding/removing a child node mounts/unmounts exactly one subtree rather than re-rendering the whole structure.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   data:  A ─┬─ B ─── D
             └─ C

   render tree (each box = one TreeNode instance):
   ┌── TreeNode(node=A) ─────────────────────────┐
   │   "A"                                        │
   │   ┌── TreeNode(node=B) ──┐  ┌── TreeNode(C) ┐│
   │   │ "B"                  │  │ "C" (leaf)    ││
   │   │ ┌─ TreeNode(node=D) ┐│  └───────────────┘│
   │   │ │ "D" (leaf)        ││                    │
   │   │ └───────────────────┘│                    │
   │   └──────────────────────┘                    │
   └───────────────────────────────────────────────┘
   v-if="children?.length"  ← base case stops the recursion at leaves`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — minimal recursive list',
      lang: 'vue',
      code: '<!-- MenuItem.vue -->\n<script setup lang="ts">\ninterface Item { title: string; items?: Item[] }\ndefineProps<{ item: Item }>()\n</script>\n\n<template>\n  <li>\n    {{ item.title }}\n    <ul v-if="item.items?.length">\n      <MenuItem v-for="sub in item.items" :key="sub.title" :item="sub" />\n    </ul>\n  </li>\n</template>',
      explanation: [
        'MenuItem renders itself for each sub-item.',
        'v-if guards against rendering an empty <ul> and stops recursion at leaves.',
        'Each level is a separate MenuItem instance with its own item prop.',
        'Works for menus of any depth without extra code.',
      ],
    },
    intermediate: {
      label: 'Intermediate — passing depth down',
      lang: 'vue',
      code: '<!-- TreeNode.vue -->\n<script setup lang="ts">\ninterface Node { label: string; children?: Node[] }\nwithDefaults(defineProps<{ node: Node; depth?: number }>(), { depth: 0 })\n</script>\n\n<template>\n  <li :style="{ paddingLeft: depth * 16 + \'px\' }">\n    {{ node.label }}\n    <ul v-if="node.children?.length">\n      <TreeNode\n        v-for="child in node.children"\n        :key="child.label"\n        :node="child"\n        :depth="depth + 1"\n      />\n    </ul>\n  </li>\n</template>',
      explanation: [
        'depth is incremented as we descend, driving indentation.',
        'withDefaults gives the root a depth of 0 so callers do not pass it.',
        'Each instance knows its own level — useful for styling and max-depth limits.',
        'This is the standard way to convey level-specific context downward.',
      ],
    },
    advanced: {
      label: 'Advanced — bubbling an event up across levels',
      lang: 'vue',
      code: '<!-- TreeNode.vue -->\n<script setup lang="ts">\ninterface Node { id: number; label: string; children?: Node[] }\ndefineProps<{ node: Node }>()\nconst emit = defineEmits<{ select: [id: number] }>()\n</script>\n\n<template>\n  <li>\n    <span @click="emit(\'select\', node.id)">{{ node.label }}</span>\n    <ul v-if="node.children?.length">\n      <TreeNode\n        v-for="child in node.children"\n        :key="child.id"\n        :node="child"\n        @select="emit(\'select\', $event)"\n      />\n    </ul>\n  </li>\n</template>',
      explanation: [
        'A leaf click emits select; intermediate nodes re-emit the child event upward.',
        'The event bubbles level by level until the top-level consumer handles it.',
        'Alternatively, provide/inject avoids re-emitting at every level (see realProject).',
        'Shows both downward props and upward events working through recursion.',
      ],
    },
    realProject: {
      label: 'Real project — comment thread with provide/inject for callbacks',
      lang: 'vue',
      code: '<!-- CommentThread.vue (root) -->\n<script setup lang="ts">\nimport { provide } from \'vue\'\ninterface Comment { id: number; text: string; replies?: Comment[] }\ndefineProps<{ comments: Comment[] }>()\nconst emit = defineEmits<{ reply: [id: number] }>()\nprovide(\'onReply\', (id: number) => emit(\'reply\', id))\n</script>\n\n<template>\n  <Comment v-for="c in comments" :key="c.id" :comment="c" />\n</template>\n\n<!-- Comment.vue (recursive) -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\ninterface Comment { id: number; text: string; replies?: Comment[] }\ndefineProps<{ comment: Comment }>()\nconst onReply = inject<(id: number) => void>(\'onReply\')\n</script>\n\n<template>\n  <div class="comment">\n    <p>{{ comment.text }}</p>\n    <button @click="onReply?.(comment.id)">Reply</button>\n    <div class="replies" v-if="comment.replies?.length">\n      <Comment v-for="r in comment.replies" :key="r.id" :comment="r" />\n    </div>\n  </div>\n</template>',
      explanation: [
        'provide/inject shares the reply callback so deep comments call it directly — no per-level re-emit.',
        'Comment.vue is recursive: it renders itself for each reply.',
        'This is exactly how nested comment systems (Reddit/HN style) are built.',
        'Avoids prop-drilling and event-relaying through every intermediate level.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a recursive component and when do you use one?',
      answer: 'A component that renders itself, used to display tree-shaped data of arbitrary depth such as nested menus, file trees, or comment threads.',
      explanation: 'A good answer pairs the definition with a concrete tree use case and mentions the need for a stopping condition.',
    },
    {
      level: 'beginner',
      question: 'How does a single-file component reference itself?',
      answer: 'An SFC infers its name from its filename, so TreeNode.vue can use <TreeNode> in its own template. You can also set the name explicitly via the name option or defineOptions.',
      explanation: 'Tests knowledge that self-reference requires the component to have a resolvable name.',
    },
    {
      level: 'intermediate',
      question: 'What stops a recursive component from rendering forever?',
      answer: 'A base case — typically a v-if/v-for that only renders children when they exist, so leaf nodes produce no further instances.',
      explanation: 'The infinite-recursion crash is the classic gotcha; the guard is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'How do you pass each node\'s depth/level down the recursion?',
      answer: 'Add a depth prop and pass :depth="depth + 1" on each child; give the root a default of 0 via withDefaults.',
      explanation: 'Shows understanding that each instance is independent and context flows via props.',
    },
    {
      level: 'advanced',
      question: 'How do you handle an event from a deeply nested node without re-emitting at every level?',
      answer: 'Use provide/inject to share a callback from the root; deep nodes inject and call it directly instead of bubbling through each intermediate component.',
      explanation: 'Senior-ish: avoiding event relay/prop-drilling across recursion is a real architectural decision.',
    },
    {
      level: 'senior',
      question: 'What performance and stability concerns arise with large recursive trees, and how do you mitigate them?',
      answer: 'Deep trees can hit the call-stack/render cost and create many instances. Mitigate with a max-depth guard, lazy expansion (render children only when expanded), virtualization for huge flat-rendered lists, and stable :key per node so diffing mounts/unmounts only changed subtrees.',
      explanation: 'Senior signal: connecting recursion to instance count, lazy rendering, virtualization, and keyed reconciliation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you set a component\'s name when not relying on the filename? (name option / defineOptions)',
    'When would you prefer a flat render with computed depth over true recursion?',
    'How do provide/inject and recursive components combine?',
    'How do you implement lazy/expand-on-demand rendering for big trees?',
    'How does keyed diffing behave when reordering nodes in a recursive list?',
    'How would you cap recursion depth defensively?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting the base case, causing infinite recursion.',
      why: 'Without a v-if guard the component always renders another copy of itself and the stack/render loop never terminates.',
      fix: 'Always guard children with v-if="node.children?.length" so leaves stop the recursion.',
    },
    {
      mistake: 'Self-referencing a component that has no resolvable name.',
      why: 'If the name is not inferred (e.g. anonymous default export in some setups) the self-reference cannot be resolved.',
      fix: 'Rely on the filename, or set the name explicitly with defineOptions({ name: \'TreeNode\' }).',
    },
    {
      mistake: 'Re-emitting events through every level by hand.',
      why: 'It is verbose and error-prone; one missed relay breaks the chain from a deep node.',
      fix: 'Provide a callback at the root with provide/inject and inject it where the event originates.',
    },
    {
      mistake: 'Using array index or unstable values as :key in recursive lists.',
      why: 'Reordering/removing nodes then reuses the wrong instances, causing state and DOM glitches.',
      fix: 'Use a stable unique id per node as the key.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'File/folder explorers and nested side-menus are built as a single recursive node component that expands children on demand.' },
    { area: 'Component library', detail: 'Tree-view and TreeSelect widgets expose a recursive node internally while presenting a flat data prop to consumers.' },
    { area: 'Nuxt', detail: 'Docs sites render recursive navigation from a nested content structure, with depth controlling indentation and active-route highlighting.' },
    { area: 'Vue', detail: 'Comment/discussion threads (replies within replies) use a recursive comment component plus provide/inject for reply/like callbacks.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'One small component renders trees of any depth — minimal code, easy to maintain.',
      'Keyed diffing mounts/unmounts only the changed subtree on updates, not the whole tree.',
    ],
    bad: [
      'Very deep or very wide trees create many component instances and can be costly to render eagerly.',
      'Re-emitting events through every level adds overhead and re-render churn on intermediate nodes.',
    ],
    optimizations: [
      'Render children lazily — only when a node is expanded — to cap instance count.',
      'Virtualize when flattening a huge tree into a long visible list.',
      'Use provide/inject for shared callbacks to avoid per-level event relaying.',
      'Apply a max-depth guard for defensive termination on untrusted/cyclic data.',
    ],
  },

  // 16. Security Considerations — omitted (no specific security angle beyond general v-html caution covered elsewhere)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'v-for', 'props'],
    nextConcepts: ['provide-inject', 'component-events', 'dynamic-components'],
    dependencyNote:
      'Recursive components build on components-basics, v-for, and props: you render children with v-for and pass each node down as a prop. They commonly pair with provide/inject to share callbacks across levels and with dynamic-components when node types vary.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a data tree: a root node with two children, one of which has a grandchild.',
      'Draw a box labelled TreeNode and show it taking a `node` prop.',
      'Inside the box, draw a v-for that creates more TreeNode boxes for each child.',
      'Circle the v-if="children?.length" and label it "base case — stops at leaves".',
      'Say: "Each box is its own instance; recursion mirrors the data tree and terminates at leaf nodes."',
    ],
    diagram: `  TreeNode(node)
     ├─ render node.label
     └─ v-if children?  ── no ─► STOP (leaf)
                       └ yes ─► v-for child:
                                  TreeNode(node=child)  ← recurse`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A recursive component renders itself to display tree-shaped data of unknown depth — menus, file trees, comment threads. An SFC self-references via its filename-inferred name. The essential rule is a base case: a v-if/v-for over children so leaf nodes stop the recursion, otherwise it renders forever and crashes. Pass depth down via props, and bubble events up either by re-emitting per level or, better, via a provide/inject callback. Use stable keys and lazy/virtualized rendering for big trees.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A recursive component is one that uses itself inside its own template, which is the natural way to render hierarchical data whose depth you do not know ahead of time — think file explorers, nested navigation menus, or comment threads with replies inside replies. In a single-file component this works because Vue infers the component name from the filename, so TreeNode.vue can write <TreeNode> in its own template; if the name is not inferred you can set it explicitly with defineOptions. Each recursion level is a fully independent component instance with its own props and state, and you typically pass each child node back into the component as a prop using v-for. The single most important detail is the base case: you must guard the children with something like v-if="node.children?.length" so that leaf nodes do not render any more instances. Without that guard the component renders itself endlessly and freezes the page — a classic interview trap. Context flows downward through props, for example an incrementing depth used for indentation or a max-depth limit. Events flow upward, and here you have a choice: you can re-emit the event at every level until it reaches the top, which is simple but verbose, or you can provide a callback at the root with provide/inject and have deep nodes inject and call it directly, which avoids relaying through every intermediate node. For large trees I would render children lazily on expand, virtualize long flattened lists, and use a stable unique id as the key so Vue\'s diffing mounts and unmounts only the subtrees that actually changed.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'True recursion vs flattened render with computed depth: recursion is cleaner but creates more instances; flattening can virtualize more easily.',
      'Event relay vs provide/inject: relaying keeps components decoupled but is verbose; injected callbacks are concise but introduce an implicit dependency.',
    ],
    edgeCases: [
      'Missing base case → infinite recursion and a frozen tab.',
      'Cyclic data (a node referencing an ancestor) → infinite recursion even with a child guard; needs a visited-set or max depth.',
      'Anonymous/un-named components cannot self-reference.',
      'Unstable keys cause instance reuse glitches when reordering nodes.',
    ],
    runtimeBehavior: [
      'Each level is a distinct instance with isolated reactivity; a change at one node re-renders only that node and props-changed descendants.',
      'Adding/removing a node mounts/unmounts a single subtree thanks to keyed diffing.',
      'Self-reference is resolved by name at render time, which is why naming matters.',
    ],
    scalability: [
      'Deep trees risk render cost and many instances; lazy expansion bounds active instances to what is visible.',
      'For thousands of visible nodes, combine recursion with virtualization or switch to a flattened virtual list.',
    ],
    productionConcerns: [
      'Untrusted/server data may be deeper or cyclic than expected — add defensive max-depth and cycle detection.',
      'Accessibility for tree widgets (role="tree"/"treeitem", aria-expanded) must be wired per level.',
      'Profiling: a slow recursive tree is often eager rendering of collapsed branches — render on expand.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Recursive component = renders itself for tree-shaped data.',
    'SFC self-reference works via filename-inferred name.',
    'ALWAYS need a base case: v-if="node.children?.length".',
    'No base case → infinite recursion → crash.',
    'Pass depth/level down via props (:depth="depth + 1").',
    'Events up: re-emit per level OR provide/inject a callback.',
    'Use a stable unique id as :key, never index.',
    'Lazy-render children on expand for big trees.',
    'Virtualize when flattening huge trees.',
    'Guard against cyclic data with max depth / visited set.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a NestedList component that renders an array of items, each possibly having a `children` array, to any depth.',
      hint: 'Render itself for each child, guarded by v-if.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ninterface Item { label: string; children?: Item[] }\ndefineProps<{ item: Item }>()\n</script>\n\n<template>\n  <li>\n    {{ item.label }}\n    <ul v-if="item.children?.length">\n      <NestedList v-for="c in item.children" :key="c.label" :item="c" />\n    </ul>\n  </li>\n</template>',
        explanation: ['NestedList renders itself for each child.', 'v-if stops recursion at leaves.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add indentation based on depth without the caller passing a depth.',
      hint: 'Use withDefaults to default depth to 0 and increment per level.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ninterface Item { label: string; children?: Item[] }\nwithDefaults(defineProps<{ item: Item; depth?: number }>(), { depth: 0 })\n</script>\n\n<template>\n  <li :style="{ paddingLeft: depth * 16 + \'px\' }">\n    {{ item.label }}\n    <ul v-if="item.children?.length">\n      <NestedList v-for="c in item.children" :key="c.label" :item="c" :depth="depth + 1" />\n    </ul>\n  </li>\n</template>',
        explanation: ['Root gets depth 0 by default.', 'Each level passes depth + 1, driving indentation.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make a deep node emit a "select" with its id reaching the root WITHOUT re-emitting at each level.',
      hint: 'Provide a callback at the root and inject it in the node.',
      solution: {
        lang: 'vue',
        code: '<!-- root -->\n<script setup lang="ts">\nimport { provide } from \'vue\'\nconst emit = defineEmits<{ select: [id: number] }>()\nprovide(\'onSelect\', (id: number) => emit(\'select\', id))\n</script>\n\n<!-- recursive node -->\n<script setup lang="ts">\nimport { inject } from \'vue\'\ninterface Node { id: number; label: string; children?: Node[] }\ndefineProps<{ node: Node }>()\nconst onSelect = inject<(id: number) => void>(\'onSelect\')\n</script>\n<template>\n  <li>\n    <span @click="onSelect?.(node.id)">{{ node.label }}</span>\n    <ul v-if="node.children?.length">\n      <TreeNode v-for="c in node.children" :key="c.id" :node="c" />\n    </ul>\n  </li>\n</template>',
        explanation: [
          'The root provides a callback once.',
          'Any depth injects and calls it directly — no per-level relay.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Given possibly-cyclic data, prevent infinite recursion defensively.',
      hint: 'Pass a max depth (or visited set) down and stop when exceeded.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ninterface Node { label: string; children?: Node[] }\nwithDefaults(defineProps<{ node: Node; depth?: number; max?: number }>(), {\n  depth: 0,\n  max: 50,\n})\n</script>\n\n<template>\n  <li>\n    {{ node.label }}\n    <ul v-if="node.children?.length && depth < max">\n      <TreeNode\n        v-for="c in node.children"\n        :key="c.label"\n        :node="c"\n        :depth="depth + 1"\n        :max="max"\n      />\n    </ul>\n  </li>\n</template>',
        explanation: [
          'A max-depth guard terminates recursion even if data is cyclic or unexpectedly deep.',
          'depth < max is checked alongside the normal children guard.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Recursive components prove you understand component identity, naming, props/events flow, and termination. They turn "render arbitrary trees" from a scary problem into a five-line component, which is exactly the kind of clean solution interviewers reward.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and "how do you avoid infinite recursion". Product companies (Zoho, Flipkart, Razorpay) ask you to build a file tree or comment thread live. FAANG-level interviews push on performance for huge trees, cyclic data, lazy expansion, and provide/inject vs event relay.',
    whatInterviewersExpect:
      'Show a self-referencing component with a clear base case, pass depth down via props, handle events up sensibly (ideally provide/inject for deep nodes), use stable keys, and discuss lazy rendering/max-depth for scale and safety.',
  },
}

export default recursiveComponents
