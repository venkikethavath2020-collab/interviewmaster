import type { ConceptLesson } from '../../../types/lesson'

const builtInSpecialAttributes: ConceptLesson = {
  // 1. Concept Summary
  slug: 'built-in-special-attributes',
  name: 'Built-in Special Attributes',
  category: 'built-in',
  difficulty: 'beginner',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Special attributes like key, ref, and is are reserved by Vue and change how it renders — using them wrong causes subtle list bugs and null refs.',
    'key is the single most important one: it drives the Virtual DOM diff and fixes the classic "wrong item state after reorder" bug.',
    'ref is how you reach real DOM elements and child component instances — essential for focus, measurement, and library integration.',
    'is enables dynamic components and the native-element workaround for in-DOM template parsing limits.',
    'They are beginner-level but high-leverage: knowing them prevents a whole category of everyday Vue mistakes.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Special attributes are like the magic words on a form that the office treats differently from everything else you write.',
    story: [
      'Imagine filling out a form where most boxes are just plain info, but a few boxes have special meaning to the office computer.',
      'One box is a "name tag" so the computer can always find your form again even if the stack gets shuffled — that is like key.',
      'Another box is a "call me back" sticker so a worker can reach the exact form later — that is like ref.',
      'Vue templates have a few words like this: they look like normal attributes, but Vue treats them specially to keep track of things and find them later.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Most attributes you put on an element in a Vue template are just passed to the HTML, but a handful are reserved words Vue handles itself.',
    'key gives each item in a list a unique identity so Vue can tell items apart when the list changes.',
    'ref lets you grab the real element or child component so you can use it in JavaScript (like focusing an input).',
    'is lets you choose which component to render dynamically, and helps when a template lives directly in the HTML page.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Built-in special attributes are reserved template attributes that Vue interprets specially rather than rendering as plain HTML. The core ones are key (vnode identity for diffing), ref (access to elements/child instances), and is (dynamic component / native element resolution).',
    how: 'You add them in templates: :key on v-for items, ref="name" (paired with a ref() in setup), and :is on <component> to pick the component. Vue\'s compiler/runtime treats them as instructions, not attributes to pass through.',
    why: 'They let Vue track list items efficiently, give you escape hatches to the real DOM, and enable dynamic rendering — capabilities plain attributes can\'t provide.',
    code: {
      label: 'key, ref, and is in one template',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport Foo from \'./Foo.vue\'\nconst inputEl = ref(null)        // pairs with ref="inputEl"\nconst current = ref(Foo)\nconst items = ref([{ id: 1, t: \'A\' }, { id: 2, t: \'B\' }])\n</script>\n\n<template>\n  <input ref="inputEl" />                          <!-- ref: reach the DOM node -->\n  <li v-for="i in items" :key="i.id">{{ i.t }}</li> <!-- key: stable identity -->\n  <component :is="current" />                       <!-- is: dynamic component -->\n</template>',
      explanation: [
        'ref="inputEl" links the element to the matching inputEl ref so you can access it in JS.',
        ':key="i.id" gives each list item a stable identity for correct diffing.',
        ':is="current" tells <component> which component to render.',
        'All three look like attributes but are special instructions to Vue.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Built-in special attributes are reserved attributes in Vue templates that the compiler and runtime interpret as rendering directives rather than passing through to the DOM. key sets a vnode\'s identity used by the keyed children-reconciliation algorithm; ref registers a template ref so the corresponding ref()/$refs entry receives the mounted element or child component instance; is resolves which component (or native element, via the vue:-prefixed form) a tag renders, enabling <component :is>. Related special bindings include the v-on/v-bind shorthands and the slot directive, but key/ref/is are the canonical "special attributes".',

  // 7. Internal Working
  internalWorking: [
    'During compilation, special attributes are extracted from the regular props of a vnode and placed on dedicated vnode fields (e.g. vnode.key, vnode.ref) or used to resolve the component type (is).',
    'key is read by the patch algorithm when reconciling a list of children: it builds a key→index map of the old children so it can match, reuse, and move existing DOM nodes instead of patching by position.',
    'ref is processed after mount/patch: the runtime sets the resolved value (the DOM element for native tags, the exposed instance for components) onto the ref/$refs entry, and resets it to null on unmount.',
    'is on a <component> tag is resolved each render to a component definition (or a string for native elements); changing it swaps the rendered component, integrating with KeepAlive and async components.',
    'Because these are interpreted by Vue, they are NOT forwarded to the real DOM as HTML attributes (e.g. key never appears on the element), unlike normal attributes which fall through.',
    'For in-DOM templates (writing Vue directly in index.html), :is with the vue: prefix or the is="vue:..." form works around HTML parsing restrictions on which tags may nest where.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  TEMPLATE attribute ── is it reserved by Vue?
        │
        ├─ NO  → passed through to the real DOM element (fallthrough)
        │
        └─ YES → interpreted as an instruction
                  ├─ key  → vnode.key  → keyed diff identity
                  ├─ ref  → vnode.ref  → after mount, fills ref()/$refs
                  └─ is   → resolve <component> type each render
  (special attrs do NOT appear on the rendered DOM element)`,

  // 9. Memory Visualization — omitted

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — key on a list',
      lang: 'vue',
      code: '<template>\n  <!-- stable :key lets Vue track each row identity across updates -->\n  <li v-for="user in users" :key="user.id">{{ user.name }}</li>\n</template>',
      explanation: [
        ':key gives each <li> a stable identity tied to user.id.',
        'On reorder/insert, Vue moves and reuses the right DOM nodes.',
        'Without it, Vue diffs by index and may corrupt per-item DOM state.',
        'key never appears as an attribute on the rendered <li>.',
      ],
    },
    intermediate: {
      label: 'Intermediate — ref to a DOM element vs a child component',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nimport Child from \'./Child.vue\'\nconst boxEl = ref(null)   // DOM element\nconst childRef = ref(null) // child component instance\nonMounted(() => {\n  boxEl.value.scrollIntoView()        // real element API\n  childRef.value?.someExposedMethod?.() // exposed child method\n})\n</script>\n\n<template>\n  <div ref="boxEl">box</div>\n  <Child ref="childRef" />\n</template>',
      explanation: [
        'On a native element, ref resolves to the real DOM node.',
        'On a component, ref resolves to its public instance (what it exposes via defineExpose).',
        'Refs are null until mounted, so access them in onMounted.',
        'The ref name must match the ref() variable.',
      ],
    },
    advanced: {
      label: 'Advanced — is for dynamic components and native-element workaround',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport Tab1 from \'./Tab1.vue\'\nimport Tab2 from \'./Tab2.vue\'\nconst view = ref(Tab1)\n</script>\n\n<template>\n  <component :is="view" />            <!-- dynamic component -->\n\n  <!-- in-DOM template workaround: render a component where only <tr> is valid -->\n  <table>\n    <tr is="vue:my-row" />\n  </table>\n</template>',
      explanation: [
        ':is on <component> renders whichever component `view` holds and can switch reactively.',
        'is="vue:my-row" tells Vue to render a component in a spot where HTML only allows <tr>.',
        'The vue: prefix distinguishes a Vue component from a native customized built-in.',
        'This matters only for in-DOM templates, not SFCs.',
      ],
    },
    realProject: {
      label: 'Real project — keyed dynamic component with KeepAlive',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nimport Editor from \'./Editor.vue\'\nimport Preview from \'./Preview.vue\'\nconst mode = ref(\'editor\')\nconst comp = { editor: Editor, preview: Preview }\n</script>\n\n<template>\n  <KeepAlive>\n    <!-- :is selects the component; :key forces a fresh instance if needed -->\n    <component :is="comp[mode]" :key="mode" />\n  </KeepAlive>\n</template>',
      explanation: [
        ':is drives which view renders based on mode.',
        ':key on the dynamic component controls instance identity — changing the key remounts it.',
        'KeepAlive caches the inactive view so switching preserves state.',
        'This combines three special-attribute-related features in one real pattern.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are special attributes in Vue, and name a few.',
      answer: 'They are reserved template attributes Vue interprets specially instead of rendering as HTML. The main ones are key (vnode identity for diffing), ref (access to elements/child instances), and is (dynamic component resolution).',
      explanation: 'Naming key/ref/is and that they are interpreted (not passed through) is the core answer.',
    },
    {
      level: 'beginner',
      question: 'What does the key attribute do?',
      answer: 'It gives each item in a list a stable, unique identity so Vue\'s keyed diff can match, reuse, and move the correct DOM nodes across re-renders instead of patching by index.',
      explanation: 'Connecting key to the diff and to avoiding the reorder/state bug shows real understanding.',
    },
    {
      level: 'beginner',
      question: 'How do you access a DOM element with ref in <script setup>?',
      answer: 'Declare a ref() with the same name as the template ref attribute (e.g. const el = ref(null) and ref="el"), then access el.value in onMounted once the element is mounted.',
      explanation: 'The name-matching and null-until-mounted points are the practical essentials.',
    },
    {
      level: 'intermediate',
      question: 'What does ref resolve to on a component vs a native element?',
      answer: 'On a native element it resolves to the real DOM node. On a component it resolves to the component\'s public instance — in <script setup> that means only what the child exposes via defineExpose.',
      explanation: 'The defineExpose nuance for script-setup components is a common follow-up.',
    },
    {
      level: 'intermediate',
      question: 'When would you use is, and what is the vue: prefix for?',
      answer: 'Use :is on <component> to render a component dynamically. The vue:/is="vue:..." form is for in-DOM templates, letting you render a component in a spot where HTML parsing only allows specific native tags (e.g. a row inside a table).',
      explanation: 'Distinguishing dynamic components from the in-DOM parsing workaround is the key point.',
    },
    {
      level: 'advanced',
      question: 'Are special attributes rendered onto the real DOM element?',
      answer: 'No. Vue extracts and interprets them (key→vnode.key, ref→vnode.ref, is→component resolution), so they don\'t appear as HTML attributes on the element — unlike normal attributes, which fall through.',
      explanation: 'Knowing they are stripped/interpreted rather than forwarded shows understanding of the compiler/runtime.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why are index keys problematic in dynamic lists?',
    'How do you get a ref to a v-for list of elements?',
    'What does defineExpose do for component refs in <script setup>?',
    'How does :is interact with KeepAlive and async components?',
    'When do you need is="vue:...", and why only for in-DOM templates?',
    'Which other directives (v-bind, v-on, slot) have special handling?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using array index as :key in dynamic lists.',
      why: 'Index keys are unstable on insert/reorder, so Vue reuses the wrong nodes and corrupts per-item DOM state.',
      fix: 'Use a stable unique id from the data as the key.',
    },
    {
      mistake: 'Accessing a ref in setup() before mount.',
      why: 'Template refs are null until the component is mounted.',
      fix: 'Access ref.value in onMounted (or watch the ref).',
    },
    {
      mistake: 'Expecting full access to a <script setup> child via ref.',
      why: 'script-setup components are closed by default; a parent ref only sees what is exposed.',
      fix: 'Use defineExpose in the child to expose the intended methods/properties.',
    },
    {
      mistake: 'Putting special attributes expecting them on the rendered element.',
      why: 'Vue interprets key/ref/is and does not forward them as HTML attributes.',
      fix: 'Use normal attributes (e.g. data-*) when you actually need them in the DOM.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'key is used on every v-for list and to force-remount components by changing identity; ref is the standard escape hatch to the DOM and to child instances.' },
    { area: 'Component library', detail: 'Libraries use :is for polymorphic components (render as button or anchor) and ref + defineExpose to offer imperative APIs (open(), focus()).' },
    { area: 'Vue', detail: 'Dynamic dashboards/tab systems use <component :is> with KeepAlive and key to switch and cache views.' },
    { area: 'SSR', detail: 'key stability keeps server and client vnode trees aligned, reducing hydration mismatches in lists.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Stable keys let the keyed diff move/reuse DOM nodes, minimizing DOM operations on list changes.',
      'Special attributes are resolved at compile/patch time with negligible per-render cost.',
    ],
    bad: [
      'Bad/index keys force excessive patching and can drop DOM/component state.',
      'Overusing refs for state you could keep reactive leads to imperative, harder-to-optimize code.',
    ],
    optimizations: [
      'Always use a stable unique :key in v-for.',
      'Change :key deliberately to force a clean remount instead of complex manual resets.',
      'Prefer reactive data over reading DOM via refs where possible.',
      'Expose only what is needed via defineExpose to keep component APIs small.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'v-for', 'components-basics'],
    nextConcepts: ['v-for-key', 'template-refs', 'dynamic-components', 'attribute-fallthrough'],
    dependencyNote:
      'Special attributes build on template syntax, v-for, and component basics. key deepens into v-for-key, ref into template-refs, and is into dynamic-components; their "not forwarded to DOM" behavior contrasts with attribute-fallthrough.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a template attribute and a decision: "reserved by Vue?"',
      'No branch → forwarded to the DOM (fallthrough).',
      'Yes branch → list key→vnode.key (diff identity), ref→fills ref()/$refs after mount, is→resolves component.',
      'Show a small list with :key and note it lets the diff move nodes correctly.',
      'Say: "key, ref, and is look like attributes but are instructions to Vue — and they don\'t appear on the rendered element."',
    ],
    diagram: `  attr on element
     │ reserved?
     ├─ no → DOM attribute (fallthrough)
     └─ yes
         key → vnode.key  (keyed diff)
         ref → vnode.ref  → ref()/$refs after mount
         is  → <component> type resolution
   (none of these render onto the real element)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Built-in special attributes are reserved template attributes Vue interprets instead of rendering as HTML. The big three: key gives list items stable identity for the keyed diff (fixing reorder bugs), ref gives you the real DOM element or a child\'s exposed instance (null until mounted), and is on <component> selects which component to render dynamically (plus the vue: prefix for in-DOM template parsing). They are stripped/interpreted, so they never appear on the rendered element.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Built-in special attributes are a small set of reserved attributes that look like normal HTML attributes in a Vue template but are actually instructions Vue\'s compiler and runtime interpret, rather than passing through to the DOM. The three you must know are key, ref, and is. key is the most important: you put it on v-for items, and it gives each vnode a stable identity that the keyed reconciliation algorithm uses to match, reuse, and move existing DOM nodes between renders. With a stable id key, reordering or inserting an item just moves the right node; with index keys or no key, Vue diffs by position and can corrupt per-item DOM state like checkbox checked status or input focus. ref is your escape hatch to the real world: you write ref="something" on an element or component and pair it with a ref() of the same name in setup. After mount, Vue fills it in — for a native element it becomes the actual DOM node, and for a component it becomes that component\'s public instance, which for a <script setup> child means only what it exposes via defineExpose. Crucially refs are null until the component is mounted, so you read them in onMounted. is is used on the <component> tag to choose which component to render dynamically, so :is="current" can switch views reactively and works with KeepAlive and async components. There\'s also a special form, is="vue:...", used only for in-DOM templates to render a component in places where HTML parsing restricts which tags can appear, like a row inside a table. One detail interviewers like: because Vue interprets these, they don\'t show up as attributes on the rendered element — key never appears on the <li>. That\'s the opposite of normal attributes, which fall through to the root element.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Changing :key to force a remount is simple but throws away state and re-runs setup — clean but potentially expensive.',
      'Refs give imperative power (focus, measure, library APIs) but pull you away from declarative, reactive code that is easier to test.',
    ],
    edgeCases: [
      'Index keys break per-item DOM state on reorder; non-unique keys cause silent node-reuse bugs.',
      'A ref inside v-for must be handled as a collection (function ref or array) to capture all elements.',
      'Component refs only expose what defineExpose declares in <script setup>.',
      'is="vue:..." is only relevant for in-DOM templates, not SFC builds.',
    ],
    runtimeBehavior: [
      'Special attributes are moved onto vnode fields (key, ref) or used to resolve the component type, not kept as props.',
      'ref values are assigned after patch and reset to null on unmount.',
      'is is re-resolved each render, enabling reactive component switching.',
    ],
    scalability: [
      'Stable keys keep large-list updates O(changes) by enabling node reuse and minimal moves.',
      'Using key to remount a heavy subtree should be deliberate; prefer targeted state resets at scale.',
    ],
    productionConcerns: [
      'Hydration mismatches in SSR lists often trace back to unstable keys.',
      'Over-reliance on refs for state makes components imperative and harder to reason about.',
      'Exposing too much via defineExpose creates brittle public component APIs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Special attributes are interpreted by Vue, not rendered as HTML.',
    'The big three: key, ref, is.',
    'key = stable vnode identity for the keyed diff (use unique ids).',
    'ref = access DOM element or child instance; null until mounted.',
    'Component ref in <script setup> only sees defineExpose-d members.',
    'is = dynamic <component> selection; reactive and works with KeepAlive.',
    'is="vue:..." = in-DOM template parsing workaround only.',
    'Changing :key force-remounts a component (fresh setup).',
    'For v-for refs, use a function/array ref to capture all elements.',
    'These never appear on the rendered element (unlike fallthrough attrs).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Render a list of users with a stable key.',
      hint: 'Use a unique id field.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <li v-for="u in users" :key="u.id">{{ u.name }}</li>\n</template>',
        explanation: [
          ':key="u.id" gives each row a stable identity.',
          'The keyed diff can then move/reuse nodes correctly on changes.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Focus an input via a template ref after mount.',
      hint: 'Match ref name to a ref() and use onMounted.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst input = ref(null)\nonMounted(() => input.value.focus())\n</script>\n<template>\n  <input ref="input" />\n</template>',
        explanation: [
          'ref="input" links the element to the input ref.',
          'It is null until mounted, so focus() runs in onMounted.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Switch dynamically between two components and force a fresh instance when switching using key.',
      hint: 'Use <component :is> with :key bound to the mode.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nimport A from \'./A.vue\'\nimport B from \'./B.vue\'\nconst mode = ref(\'A\')\nconst map = { A, B }\n</script>\n<template>\n  <button @click="mode = mode === \'A\' ? \'B\' : \'A\'">swap</button>\n  <component :is="map[mode]" :key="mode" />\n</template>',
        explanation: [
          ':is selects the component from the map by mode.',
          ':key="mode" changes identity on switch, forcing a clean remount.',
          'Without the key, Vue might reuse the instance and keep stale state.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Capture refs for every item in a v-for list and log how many were collected.',
      hint: 'Use a function ref to push into an array.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst items = ref([1, 2, 3])\nconst els = ref([])\nfunction setRef(el) { if (el) els.value.push(el) }\nonMounted(() => console.log(\'collected:\', els.value.length))\n</script>\n<template>\n  <div v-for="n in items" :key="n" :ref="setRef">{{ n }}</div>\n</template>',
        explanation: [
          'A single ref name would be overwritten, so a function ref collects each element.',
          'setRef pushes each mounted element into the els array.',
          'By onMounted all elements are collected; logging shows the count.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'These small attributes punch above their weight: key prevents a whole class of list bugs, ref unlocks DOM/library integration, and is enables dynamic UIs. Knowing them cleanly signals you write correct, idiomatic Vue templates.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what key/ref do. Product companies (Zoho, Flipkart, Razorpay) ask why index keys are bad, how component refs expose methods, and how :is + KeepAlive combine. FAANG-level interviews probe that special attrs aren\'t forwarded to the DOM and the keyed reconciliation implications.',
    whatInterviewersExpect:
      'They expect you to name key/ref/is, explain key\'s role in diffing, how ref resolves (element vs exposed instance, null until mounted), what :is does plus the vue: prefix, and that these are interpreted rather than rendered onto the element.',
  },
}

export default builtInSpecialAttributes
