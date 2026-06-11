import type { ConceptLesson } from '../../../types/lesson'

const transitionGroup: ConceptLesson = {
  // 1. Concept Summary
  slug: 'transition-group',
  name: 'TransitionGroup',
  category: 'built-in',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    '<TransitionGroup> is how you animate a LIST — items entering, leaving, AND smoothly sliding to new positions when the list reorders.',
    'It is the only built-in that gives you "FLIP" move animations for free: when an item changes index, Vue animates it gliding to its new spot instead of jumping.',
    'Real apps use it everywhere a list mutates: sortable task boards, filtered product grids, chat message lists, notification stacks, leaderboards.',
    'Interviewers use it to test whether you understand v-for keys deeply — TransitionGroup is unusable without correct, stable keys.',
    'Without it, list changes are abrupt and disorienting; with it, additions, removals, and sorts feel continuous and trackable to the eye.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: '<TransitionGroup> is like a row of kids in a class photo who shuffle to new spots smoothly when someone joins or leaves, instead of teleporting.',
    story: [
      'Imagine a line of toy cars on a shelf. You add a new car, and another one is taken away.',
      'If the cars instantly jump to fill the gaps, it is hard for your eyes to follow what moved where.',
      'Now imagine each car gently slides to its new place, the new one fades in, and the leaving one fades out. You can easily see what happened.',
      '<TransitionGroup> does this for a list of things on a web page. When the list changes, it makes each item slide, fade in, or fade out smoothly so the change is easy to follow.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue you often render a list with v-for. When you add or remove items, the list normally just snaps to its new state.',
    'If you wrap that v-for in a <TransitionGroup>, Vue animates each item entering and leaving — like a <Transition> but for many elements at once.',
    'Its special power is the *-move class: when items change order, Vue uses a technique called FLIP to smoothly animate each item gliding from its old position to its new one.',
    'For this to work, every item needs a unique, stable key so Vue can track which element is which across changes.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: '<TransitionGroup> is a built-in component that applies enter/leave transitions to MULTIPLE elements rendered by v-for, and additionally animates position changes (moves) of existing items using a *-move class via the FLIP technique.',
    how: 'You render a v-for inside <TransitionGroup>, giving each item a unique key. On enter/leave it applies the same six classes as <Transition>. When the order changes, it records each item\'s old position, lets the DOM reflow, computes the new position, and applies a transform plus the *-move transition so items animate to their new spots.',
    why: 'It makes list mutations legible and pleasant — additions, removals, filtering, and sorting all animate continuously, which improves perceived quality and helps users track changes.',
    code: {
      label: 'An animated, reorderable list',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([1, 2, 3, 4, 5])\nfunction shuffle() {\n  items.value = items.value.slice().sort(() => Math.random() - 0.5)\n}\n</script>\n\n<template>\n  <button @click="shuffle">Shuffle</button>\n  <TransitionGroup name="list" tag="ul">\n    <li v-for="n in items" :key="n">Item {{ n }}</li>\n  </TransitionGroup>\n</template>\n\n<style>\n.list-move { transition: transform 0.4s ease; }\n.list-enter-active, .list-leave-active { transition: all 0.4s ease; }\n.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }\n</style>',
      explanation: [
        'tag="ul" tells TransitionGroup to render a real <ul> wrapper (Transition renders no wrapper; TransitionGroup renders one by default).',
        'Each <li> has a unique :key — required so Vue tracks identity across reorders.',
        'The .list-move class with a transform transition is what animates items sliding to new positions when shuffled.',
        'enter/leave classes fade and slide items added or removed from the array.',
        'On shuffle, items glide to their new spots instead of jumping — that is FLIP.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    '<TransitionGroup> is a built-in component that orchestrates enter, leave, and move transitions for a list of elements rendered by v-for. Unlike <Transition>, it supports multiple children, renders a real container element (configurable via the tag prop, default a fragment in Vue 3), and adds a *-move class. To animate reordering it uses the FLIP technique: it records each child\'s First position, lets the DOM update to its Last position, applies an Inverting transform so children appear unmoved, then Plays the transition by removing the transform — producing smooth movement. Stable, unique keys are mandatory so Vue can match old and new vnodes.',

  // 7. Internal Working
  internalWorking: [
    'During render, <TransitionGroup> diffs the keyed children of the v-for against the previous render to classify each as entering, leaving, or moving.',
    'Entering and leaving children get the standard *-enter-* and *-leave-* classes, identical to <Transition>; leaving nodes are kept in the DOM until their leave transition completes.',
    'For move detection it implements FLIP: BEFORE the DOM updates it records each existing child\'s bounding box (First). It then lets Vue patch the DOM into the new order (Last).',
    'It computes the delta between old and new positions and applies an Inverse transform (translate) so each child visually stays where it was, then on the next frame adds the *-move class and removes the transform, so the browser animates (Play) the child to its true position.',
    'Leaving elements are taken out of normal document flow (Vue sets position implicitly via the *-leave-active class you provide, typically position:absolute) so remaining items can move into the freed space without waiting.',
    'Because matching relies entirely on keys, an unstable or index-based key breaks identity tracking and causes wrong or skipped animations.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  list = [A, B, C]   ──shuffle──►  [C, A, B]

  FLIP move animation per item:
  ┌───────────────────────────────────────────────┐
  │ F (First):  record old box  A@x=0  B@x=80 ...   │
  │ L (Last):   DOM reorders    C@x=0  A@x=80 ...    │
  │ I (Invert): translate each item BACK to old box │
  │             → looks like nothing moved (frame 0) │
  │ P (Play):   add .list-move, remove transform     │
  │             → browser animates to true position  │
  └───────────────────────────────────────────────┘

  enter:  *-enter-from ─► *-enter-to      (new key appears)
  leave:  *-leave-from ─► *-leave-to      (key removed; absolute)
  move :  *-move transition on transform  (existing key reorders)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — fade items in and out',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst todos = ref([\'Buy milk\', \'Walk dog\'])\nfunction add() { todos.value.push(\'Task \' + (todos.value.length + 1)) }\n</script>\n<template>\n  <button @click="add">Add</button>\n  <TransitionGroup name="fade" tag="ul">\n    <li v-for="t in todos" :key="t">{{ t }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .3s; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
      explanation: [
        'Multiple <li> children are allowed — that is the key difference from <Transition>.',
        'tag="ul" renders a wrapping <ul>; each new item fades in on push.',
        'Keys are the item strings (assumed unique here) so Vue tracks identity.',
        'No move animation is defined yet, so reordering would snap — only enter/leave animate.',
      ],
    },
    intermediate: {
      label: 'Intermediate — add move animation (FLIP)',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst nums = ref([1, 2, 3, 4, 5])\nfunction shuffle() { nums.value = nums.value.slice().sort(() => Math.random() - 0.5) }\n</script>\n<template>\n  <button @click="shuffle">Shuffle</button>\n  <TransitionGroup name="flip" tag="ul">\n    <li v-for="n in nums" :key="n">{{ n }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.flip-move { transition: transform .5s ease; }\n</style>',
      explanation: [
        'Adding the .flip-move class with a transform transition unlocks position animation.',
        'On shuffle, Vue records old positions, reorders the DOM, then animates each item to its new spot.',
        'Keys must be the stable values (n), not the array index, or FLIP breaks.',
        'No enter/leave classes here because the set of items never changes — only their order.',
      ],
    },
    advanced: {
      label: 'Advanced — leave with position:absolute so others flow smoothly',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\'a\', \'b\', \'c\', \'d\'])\nfunction remove(x) { items.value = items.value.filter(i => i !== x) }\n</script>\n<template>\n  <TransitionGroup name="lst" tag="ul" class="wrap">\n    <li v-for="i in items" :key="i" @click="remove(i)">{{ i }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.lst-move, .lst-enter-active, .lst-leave-active { transition: all .4s ease; }\n.lst-enter-from, .lst-leave-to { opacity: 0; transform: scale(.6); }\n.lst-leave-active { position: absolute; }\n</style>',
      explanation: [
        'position:absolute on the leaving item removes it from flow so remaining items can FLIP into the gap immediately, instead of waiting for the leave to finish.',
        'Without the absolute trick, sibling items would jump only after the leave completes, looking abrupt.',
        'Combining *-move with *-leave-active gives the polished "remove and reflow" effect.',
        'A class on TransitionGroup (class="wrap") styles the container; tag="ul" defines its element.',
      ],
    },
    realProject: {
      label: 'Real project — a live notification/toast stack',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\ninterface Toast { id: number; msg: string }\nconst toasts = ref<Toast[]>([])\nlet id = 0\nfunction notify(msg: string) {\n  const t = { id: id++, msg }\n  toasts.value.push(t)\n  setTimeout(() => { toasts.value = toasts.value.filter(x => x.id !== t.id) }, 3000)\n}\ndefineExpose({ notify })\n</script>\n<template>\n  <TransitionGroup name="toast" tag="div" class="toast-stack">\n    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.msg }}</div>\n  </TransitionGroup>\n</template>\n<style>\n.toast-move, .toast-enter-active, .toast-leave-active { transition: all .35s ease; }\n.toast-enter-from { opacity: 0; transform: translateX(100%); }\n.toast-leave-to { opacity: 0; transform: translateX(100%); }\n.toast-leave-active { position: absolute; }\n</style>',
      explanation: [
        'Each toast has a stable numeric id key, never the index, so auto-removal animates the correct toast.',
        'New toasts slide in from the right (enter), auto-dismiss after 3s (leave), and remaining toasts slide up via FLIP (*-move).',
        'position:absolute on leave lets the stack collapse smoothly as toasts disappear.',
        'This is the canonical real-world TransitionGroup pattern: a dynamic, self-mutating list.',
        'defineExpose lets a parent call notify() to push messages onto the stack.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How is <TransitionGroup> different from <Transition>?',
      answer: '<Transition> animates a single element entering/leaving. <TransitionGroup> animates a list of multiple elements (from v-for), supports a *-move class for reordering, and renders a real wrapper element via the tag prop.',
      explanation: 'The two big differences interviewers want: multiple children + the move/FLIP capability that <Transition> lacks.',
    },
    {
      level: 'beginner',
      question: 'Why does <TransitionGroup> require keys on its children?',
      answer: 'Because it matches old and new vnodes by key to decide which items are entering, leaving, or moving. Without unique stable keys it cannot track identity, so enter/leave/move animations are wrong or skipped.',
      explanation: 'This ties directly to v-for key correctness — using the array index as a key breaks TransitionGroup on reorder.',
    },
    {
      level: 'intermediate',
      question: 'What is the FLIP technique and how does the *-move class use it?',
      answer: 'FLIP = First, Last, Invert, Play. Vue records each item\'s First position, lets the DOM update to its Last position, applies an Invert transform so items appear unmoved, then Plays by adding *-move (a transform transition) and removing the transform, animating items to their true positions.',
      explanation: 'Naming FLIP and explaining the transform-based trick is a strong intermediate/advanced signal — it shows you understand why moves are GPU-cheap.',
    },
    {
      level: 'intermediate',
      question: 'Why do you often set position:absolute on the *-leave-active class?',
      answer: 'So a leaving element is removed from normal document flow immediately, letting the remaining items FLIP into the freed space right away instead of waiting for the leave animation to complete. Otherwise siblings jump after the leave finishes.',
      explanation: 'This is the classic "leaving items collapse smoothly" trick that separates a polished list from a janky one.',
    },
    {
      level: 'advanced',
      question: 'Your shuffle animation does not work even though enter/leave do. What is likely wrong?',
      answer: 'Either there is no *-move class with a transform transition, or the keys are unstable (e.g. array index) so Vue cannot match items across the reorder. Move animation needs both a defined *-move transition AND stable identity keys.',
      explanation: 'Tests the two independent requirements for move animation; many candidates know enter/leave but miss that *-move plus keys are separately required.',
    },
    {
      level: 'senior',
      question: 'What are the performance characteristics and limits of TransitionGroup with large lists?',
      answer: 'FLIP reads layout (getBoundingClientRect) for every tracked child before the patch, which forces synchronous reflow and scales linearly with list size — large lists (hundreds+) can cause measurable jank. It also keeps leaving nodes in the DOM until their transition completes. For big or virtualized lists, animate only a window of items, debounce reorders, or skip move animation.',
      explanation: 'Senior signal: knowing FLIP requires layout reads per item, that this is O(n) and reflow-heavy, and how to mitigate on large/virtualized lists.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does the tag prop do and what is rendered if you omit it?',
    'How does TransitionGroup interact with v-for and the key requirement?',
    'Can you stagger item animations (delay each item)? (via JS hooks or per-index CSS delay)',
    'Why must leaving items often be position:absolute?',
    'How would you animate a virtualized/very large list without killing performance?',
    'Does TransitionGroup support mode (out-in/in-out)? (no — modes are a <Transition> feature)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using the array index as the :key.',
      why: 'On reorder the index stays attached to a position, not an item, so Vue mismatches identity and the move/enter/leave animations break or animate the wrong elements.',
      fix: 'Use a stable unique id from the data (item.id) as the key.',
    },
    {
      mistake: 'Expecting reordering to animate without a *-move class.',
      why: 'Move animation only happens when a *-move (or named) class with a transform transition exists; enter/leave classes do not cover repositioning.',
      fix: 'Add .name-move { transition: transform .4s; }.',
    },
    {
      mistake: 'Forgetting position:absolute on leaving items.',
      why: 'A leaving item stays in flow until its transition ends, so siblings only collapse afterward — looking like a delayed jump.',
      fix: 'Set position: absolute on the *-leave-active class so remaining items reflow immediately.',
    },
    {
      mistake: 'Treating <TransitionGroup> like <Transition> and expecting a mode prop.',
      why: 'TransitionGroup has no in-out/out-in mode; multiple children transition concurrently by design.',
      fix: 'Coordinate timing with CSS delays or JS hooks; use <Transition> mode only for single-element swaps.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Animated lists everywhere: todo apps, filterable product grids, sortable tables, and notification/toast stacks use TransitionGroup for enter/leave/move.' },
    { area: 'Component library', detail: 'Toast/notification systems and tag-input chips in libraries wrap their dynamic lists in TransitionGroup so adding/removing items animates consistently.' },
    { area: 'Pinia', detail: 'When a store holds a reactive collection (cart items, messages), the rendering component wraps the v-for in TransitionGroup so store mutations produce smooth visual transitions.' },
    { area: 'Vue', detail: 'Drag-and-drop boards (Kanban) combine TransitionGroup move animations with libraries like vuedraggable so cards glide to their dropped positions.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Move animations use transform, which is GPU-compositable and does not trigger per-frame layout.',
      'Enter/leave are CSS-driven with no JS animation loop, keeping the main thread free.',
    ],
    bad: [
      'FLIP reads getBoundingClientRect for every tracked child each update — synchronous reflow that scales linearly and hurts on large lists.',
      'Leaving nodes remain in the DOM until their transition completes, briefly increasing node count.',
    ],
    optimizations: [
      'Use stable keys so Vue patches minimally and FLIP matches correctly.',
      'Animate only transform/opacity; avoid layout-affecting properties in move/enter/leave classes.',
      'For very large or virtualized lists, animate only the visible window or disable move animation.',
      'Debounce rapid reorders so FLIP measurement does not run every keystroke/frame.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['transition', 'v-for', 'v-for-key'],
    nextConcepts: ['list-rendering-performance', 'lazy-loading-components', 'component-design-patterns'],
    dependencyNote:
      'TransitionGroup is Transition applied to lists, so you need Transition first; and because it matches items by key, a solid grasp of v-for and v-for-key is essential. It leads into list-rendering performance, where FLIP\'s layout-read cost becomes a real concern.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a v-for list of keyed boxes inside a <TransitionGroup tag="ul"> wrapper.',
      'Show three change types with arrows: a new key (enter), a removed key (leave), and a reordered key (move).',
      'For move, write the four FLIP letters: First (record old box), Last (DOM updates), Invert (translate back), Play (transition to true spot).',
      'Note "leaving items go position:absolute so the rest reflow immediately".',
      'Say: "Keys give identity, the *-move class plus a transform transition give the FLIP glide, and absolute-positioned leavers keep the layout smooth."',
    ],
    diagram: `  <TransitionGroup name="x" tag="ul">  v-for :key="item.id"
     ┌────┐ ┌────┐ ┌────┐
     │ A  │ │ B  │ │ C  │   ── reorder ──►  C  A  B
     └────┘ └────┘ └────┘
   enter:  new key      → x-enter-from → x-enter-to
   leave:  removed key   → x-leave-* (position:absolute)
   move :  same key, new index → FLIP via .x-move (transform)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '<TransitionGroup> animates a list rendered by v-for: items entering, leaving, and — uniquely — moving to new positions. Moves use the FLIP technique driven by a *-move class with a transform transition. It supports multiple children and renders a wrapper via the tag prop. Every child needs a stable unique key so Vue tracks identity across changes; index keys break it. Set position:absolute on leaving items so the rest reflow smoothly. It powers toast stacks, sortable lists, and filtered grids.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    '<TransitionGroup> is the list version of <Transition>. Where <Transition> animates a single element entering or leaving, TransitionGroup animates many elements from a v-for, and it adds a third capability the single one lacks: animating items moving to new positions when the list reorders. It allows multiple children and, unlike <Transition>, renders a real wrapper element which you choose with the tag prop. The enter and leave behavior is identical — the same six classes — but the headline feature is the *-move class. When the list reorders, Vue uses the FLIP technique: it records each item\'s First position, lets the DOM update to its Last position, applies an Invert transform so each item visually appears unmoved, then Plays the animation by adding the *-move class and removing the transform, so items glide to their true positions using a GPU-cheap transform transition. For this to work, every child must have a stable unique key, because TransitionGroup matches old and new items by key — using the array index breaks identity and the animations go wrong. A common refinement is setting position:absolute on the leave-active class so a departing item leaves the document flow immediately, letting the remaining items reflow smoothly instead of jumping after the leave finishes. The main performance caveat is that FLIP reads layout for every tracked item on each update, which is reflow-heavy and scales linearly, so for very large or virtualized lists you animate only the visible window. In production it drives toast stacks, sortable lists, and filtered grids.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'FLIP gives buttery move animations but requires synchronous layout reads per item — smoothness vs reflow cost on large lists.',
      'Rendering a real wrapper (tag) is convenient but couples your animation to a specific container element; sometimes you want a fragment and must pick tag carefully.',
    ],
    edgeCases: [
      'Index keys silently break move/enter/leave matching even though the list "looks" right on first render.',
      'Leaving items without position:absolute delay sibling reflow until the leave finishes, causing a perceptible jump.',
      'Staggered animations need per-item transition-delay (CSS nth-child or data-index) or JS hooks — there is no built-in stagger.',
      'Combining with virtualization is tricky: items entering/leaving the virtual window are real DOM mounts/unmounts that may trigger unwanted animations.',
    ],
    runtimeBehavior: [
      'FLIP calls getBoundingClientRect before the patch and after, forcing layout flushes; the Invert transform is set before the next paint to avoid a flash.',
      'Leaving vnodes are retained in the children list until transitionend, so child count temporarily exceeds the data length.',
      'There is no out-in/in-out mode; all transitions in the group run concurrently.',
    ],
    scalability: [
      'O(n) layout reads per update mean hundreds of animated items can drop frames; cap animated items or disable move on big lists.',
      'For drag-and-drop boards, pair with a dedicated DnD library and let TransitionGroup only handle the drop-settle move animation.',
    ],
    productionConcerns: [
      'Respect prefers-reduced-motion — gate list move/enter animations for accessibility.',
      'Ensure keys come from durable data ids; client-generated indices or random keys cause re-mounts and wasted animations.',
      'SSR renders the static list; animations are client-only, so avoid relying on appear in ways that cause hydration mismatch.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'TransitionGroup = Transition for LISTS (multiple children).',
    'Adds the *-move class → animates reordering via FLIP.',
    'FLIP = First, Last, Invert, Play (transform-based glide).',
    'Renders a real wrapper element — set it with tag="ul"/"div".',
    'Every child needs a STABLE UNIQUE key (never the index).',
    'Enter/leave classes are the same six as <Transition>.',
    'Add .name-move { transition: transform .4s } to animate moves.',
    'position:absolute on *-leave-active → others reflow immediately.',
    'No mode prop — children transition concurrently.',
    'Animate transform/opacity; avoid layout props for smoothness.',
    'FLIP reads layout per item → costly on large lists.',
    'Great for toasts, sortable lists, filtered grids, Kanban.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render a list of strings with v-for inside a <TransitionGroup tag="ul"> named "fade" so added/removed items fade.',
      hint: 'Each item needs a unique :key; define fade-enter-active/leave-active and fade-enter-from/leave-to.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\'a\', \'b\'])\n</script>\n<template>\n  <TransitionGroup name="fade" tag="ul">\n    <li v-for="i in items" :key="i">{{ i }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.fade-enter-active, .fade-leave-active { transition: opacity .3s; }\n.fade-enter-from, .fade-leave-to { opacity: 0; }\n</style>',
        explanation: [
          'Multiple <li> children are allowed and each is keyed by its value.',
          'tag="ul" renders the wrapping list element; enter/leave fade items in and out.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make a shuffle button animate items gliding to new positions (move animation).',
      hint: 'You need a *-move class with a transform transition and stable keys.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst nums = ref([1, 2, 3, 4])\nfunction shuffle() { nums.value = nums.value.slice().sort(() => Math.random() - 0.5) }\n</script>\n<template>\n  <button @click="shuffle">Shuffle</button>\n  <TransitionGroup name="m" tag="ul">\n    <li v-for="n in nums" :key="n">{{ n }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.m-move { transition: transform .5s ease; }\n</style>',
        explanation: [
          'The .m-move class with a transform transition triggers FLIP on reorder.',
          'Keys are the stable values n, so Vue matches items across the shuffle.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Make removing an item collapse the remaining items smoothly (no jump after the leave finishes).',
      hint: 'Take the leaving item out of flow.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\'a\', \'b\', \'c\'])\nfunction remove(x) { items.value = items.value.filter(i => i !== x) }\n</script>\n<template>\n  <TransitionGroup name="r" tag="ul">\n    <li v-for="i in items" :key="i" @click="remove(i)">{{ i }}</li>\n  </TransitionGroup>\n</template>\n<style>\n.r-move, .r-enter-active, .r-leave-active { transition: all .4s ease; }\n.r-enter-from, .r-leave-to { opacity: 0; }\n.r-leave-active { position: absolute; }\n</style>',
        explanation: [
          'position:absolute on .r-leave-active removes the leaving item from flow.',
          'The .r-move transition then animates the remaining items into the freed space immediately.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a toast stack where toasts slide in from the right, auto-dismiss after 3s, and remaining toasts slide up smoothly. Use stable ids.',
      hint: 'Push objects with a unique id; remove by id after a timeout; combine enter/leave/move and absolute leave.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst toasts = ref<{ id: number; msg: string }[]>([])\nlet id = 0\nfunction notify(msg: string) {\n  const t = { id: id++, msg }\n  toasts.value.push(t)\n  setTimeout(() => { toasts.value = toasts.value.filter(x => x.id !== t.id) }, 3000)\n}\ndefineExpose({ notify })\n</script>\n<template>\n  <TransitionGroup name="t" tag="div">\n    <div v-for="t in toasts" :key="t.id" class="toast">{{ t.msg }}</div>\n  </TransitionGroup>\n</template>\n<style>\n.t-move, .t-enter-active, .t-leave-active { transition: all .35s ease; }\n.t-enter-from, .t-leave-to { opacity: 0; transform: translateX(100%); }\n.t-leave-active { position: absolute; }\n</style>',
        explanation: [
          'Each toast has a stable numeric id key so timeouts remove and animate the correct one.',
          'enter slides from the right, leave slides out, and .t-move glides the survivors up.',
          'position:absolute on leave lets the stack collapse without a jump.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Animating list mutations well is a clear sign of frontend craft, and TransitionGroup is the only built-in that gives you reorder (FLIP) animations for free. Mastering it also forces a deep understanding of v-for keys — a topic interviewers love.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) mainly ask how it differs from <Transition>. Product companies (Zoho, Flipkart, Razorpay) ask you to build an animated todo or toast list and explain why keys matter. FAANG-level interviews probe the FLIP algorithm, its layout-read cost, and how you would animate a virtualized list.',
    whatInterviewersExpect:
      'They expect you to explain the move/FLIP capability, the mandatory stable keys, the position:absolute leave trick, and the performance implications of per-item layout reads — plus when to reach for it versus a single <Transition>.',
  },
}

export default transitionGroup
