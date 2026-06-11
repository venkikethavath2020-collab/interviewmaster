import type { ConceptLesson } from '../../../types/lesson'

const declarativeRendering: ConceptLesson = {
  // 1. Concept Summary
  slug: 'declarative-rendering',
  name: 'Declarative Rendering',
  category: 'fundamentals',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Declarative rendering is the central paradigm shift Vue gives you: describe the UI for a state, not the steps to mutate the DOM.',
    'It is the reason Vue apps are less buggy than jQuery-style code — you cannot forget to update a node, because the relationship is declared once.',
    'Interviewers use "declarative vs imperative" to check whether you understand WHY frameworks exist, not just their syntax.',
    'It connects directly to reactivity and the virtual DOM — the engine that keeps your declared UI true.',
    'Every template binding ({{ }}, v-bind, v-if, v-for) is declarative rendering in action; mastering it underpins everything else.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Declarative rendering is like telling someone "the sign should always show today\'s weather" instead of running outside to repaint the sign every morning.',
    story: [
      'Imagine a sign outside a shop that shows the weather. The imperative way is: every morning you grab a brush and repaint the sign with today\'s weather. If you forget, it stays wrong.',
      'The declarative way is: you write one rule — "this sign always shows whatever the weather notepad says" — and connect them.',
      'Now you only change the notepad. The sign updates itself, and you can never forget to repaint it.',
      'Vue works the declarative way. You say once "show this text from this data", and Vue keeps the screen matching the data forever.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Declarative means you describe WHAT you want the result to be, not the step-by-step instructions to make it.',
    'In Vue you write a template that says "show this piece of data here", and you connect it to a variable.',
    'When the variable changes, Vue automatically updates the screen to match — you never write commands to change the page yourself.',
    'The opposite, imperative, is when you manually find an element and tell it exactly what to do, step by step (like plain JavaScript or jQuery).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Declarative rendering is Vue\'s model where you declare the output (the DOM) as a function of state using a template, and Vue keeps the real DOM synchronized with that declaration automatically — as opposed to imperative DOM manipulation where you issue explicit step-by-step mutation commands.',
    how: 'You bind state into the template via interpolation ({{ }}) and directives (v-bind, v-if, v-for). The template compiles to a render function that produces a virtual DOM tree from current state; when state changes, Vue re-runs it and patches only the differences into the real DOM.',
    why: 'It eliminates a whole class of bugs (stale/forgotten DOM updates), makes UI code read like a description of the result, and lets the framework optimize updates for you.',
    code: {
      label: 'Declarative vs imperative',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <!-- Declarative: describe the UI for the state once -->\n  <p>Count is {{ count }}</p>\n  <button @click="count++">+1</button>\n</template>',
      explanation: [
        'You declare that the <p> shows count — once.',
        'Clicking just changes count; you never touch the <p> directly.',
        'Vue re-renders the <p> automatically to match the new count.',
        'Compare to plain JS where you would do el.textContent = count on every click.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Declarative rendering is the paradigm in which a component\'s view is expressed as a pure function of its reactive state, written as a template (or render function). Vue compiles the template into a render function that returns a virtual DOM tree; this function runs inside a reactive effect so that reading state during render registers dependencies. When a dependency changes, the effect re-runs, producing a new VNode tree that Vue diffs against the previous one, applying the minimal set of imperative DOM mutations under the hood. Developers describe the target output; Vue derives the imperative steps.',

  // 7. Internal Working
  internalWorking: [
    'The SFC template is compiled (at build time by Vite) into a render function that returns VNodes referencing reactive state.',
    'During component setup, reactive state (ref/reactive) is created as Proxies that can track dependent effects.',
    'The render function executes inside the component\'s render effect; every reactive value it reads is recorded as a dependency.',
    'The returned VNode tree describes the desired DOM; on initial mount, Vue creates the real DOM nodes from it.',
    'When a tracked value changes, its Proxy triggers the render effect to re-run, producing a fresh VNode tree.',
    'Vue diffs new vs old VNodes (the patch algorithm) and performs only the minimal real DOM mutations — the imperative work you never write by hand.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   DECLARATIVE (Vue)                   IMPERATIVE (plain JS)
   ─────────────────                   ─────────────────────
   state ──► template ──► DOM          step 1: find node
     ▲          (declared once)        step 2: read state
     │                                 step 3: set node.textContent
   change state                        step 4: repeat on EVERY change
     │                                 (forget one → stale UI bug)
     └──► Vue re-derives DOM auto

   You say WHAT.            You say HOW, every single time.`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — interpolation and attribute binding',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst user = ref(\'Asha\')\nconst avatar = ref(\'/a.png\')\n</script>\n\n<template>\n  <img :src="avatar" :alt="user" />\n  <span>{{ user }}</span>\n</template>',
      explanation: [
        '{{ user }} declares the span text follows user.',
        ':src and :alt (v-bind) declare attributes follow avatar/user.',
        'Change user or avatar and the DOM updates with no manual code.',
        'The template is a description of the UI for the current state.',
      ],
    },
    intermediate: {
      label: 'Intermediate — conditional and list rendering',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([\'Milk\', \'Eggs\'])\nconst loading = ref(false)\n</script>\n\n<template>\n  <p v-if="loading">Loading...</p>\n  <ul v-else>\n    <li v-for="item in items" :key="item">{{ item }}</li>\n  </ul>\n</template>',
      explanation: [
        'v-if/v-else declaratively choose which UI to show for the loading state.',
        'v-for declares "one <li> per item" — Vue creates/removes nodes as items change.',
        ':key helps Vue match list items efficiently during diffing.',
        'You never push/remove DOM nodes by hand; you change the array and Vue follows.',
      ],
    },
    advanced: {
      label: 'Advanced — declarative output via a render function',
      lang: 'js',
      code: 'import { h, ref } from \'vue\'\n\nexport default {\n  setup() {\n    const open = ref(false)\n    // render() declares the VNode tree as a function of state\n    return () => h(\'div\', [\n      h(\'button\', { onClick: () => (open.value = !open.value) }, \'Toggle\'),\n      open.value ? h(\'p\', \'Now visible\') : null,\n    ])\n  },\n}',
      explanation: [
        'Templates compile to exactly this kind of render function.',
        'The function returns a VNode tree describing the UI for current state.',
        'Vue re-runs it when open changes and patches the difference.',
        'Even hand-written render functions stay declarative — you return the desired tree, not DOM commands.',
      ],
    },
    realProject: {
      label: 'Real project — a data table that mirrors fetched state',
      lang: 'vue',
      code: '<script setup>\nimport { ref, onMounted } from \'vue\'\nconst rows = ref([])\nconst error = ref(null)\nonMounted(async () => {\n  try { rows.value = await fetch(\'/api/orders\').then(r => r.json()) }\n  catch (e) { error.value = e.message }\n})\n</script>\n\n<template>\n  <p v-if="error">{{ error }}</p>\n  <table v-else>\n    <tr v-for="row in rows" :key="row.id">\n      <td>{{ row.id }}</td><td>{{ row.total }}</td>\n    </tr>\n  </table>\n</template>',
      explanation: [
        'The table is declared as a function of rows and error.',
        'Fetching only mutates state; the table re-renders to match automatically.',
        'No manual row insertion or DOM clearing on error — Vue handles it.',
        'This is the everyday shape of declarative data-driven UI in production.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is declarative rendering in Vue?',
      answer: 'It is describing the UI as a function of state in a template, so Vue automatically keeps the DOM in sync with your data, instead of you writing step-by-step DOM-mutation code.',
      explanation: 'Name "UI as a function of state" and contrast with manual DOM updates.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between declarative and imperative UI code?',
      answer: 'Declarative describes WHAT the result should be (e.g. "show count here"); imperative describes HOW to get there with explicit commands (find the node, set its text) repeated on every change. Vue is declarative; jQuery/plain DOM is imperative.',
      explanation: 'The what-vs-how framing with a jQuery contrast is the expected answer.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue actually keep the declared UI in sync with state?',
      answer: 'The template compiles to a render function that runs inside a reactive effect. Reading state during render registers dependencies; when a dependency changes, the effect re-runs to produce a new virtual DOM tree, which Vue diffs against the old and patches minimally into the real DOM.',
      explanation: 'Linking template → render function → reactive effect → vdom patch shows real understanding.',
    },
    {
      level: 'intermediate',
      question: 'Are templates required for declarative rendering, or can you use render functions?',
      answer: 'Both are declarative. Templates are syntactic sugar compiled into render functions; you can write render functions (h(...)) or JSX directly. In all cases you return a description of the desired output, and Vue derives the DOM mutations.',
      explanation: 'Clarifying that render functions are still declarative is a nice depth signal.',
    },
    {
      level: 'advanced',
      question: 'When is imperative DOM access acceptable in a declarative framework like Vue?',
      answer: 'When you need capabilities the declarative model cannot express directly — focusing an input, measuring layout, integrating a non-Vue library, or canvas/WebGL drawing — you reach for template refs to access the DOM imperatively, ideally in lifecycle hooks, while keeping app state declarative.',
      explanation: 'Knowing the escape hatch (template refs) and when it is justified shows senior judgment.',
    },
    {
      level: 'senior',
      question: 'What are the costs of the declarative + virtual DOM model, and how do you mitigate them?',
      answer: 'Re-deriving and diffing VNode trees has overhead; large lists or wide reactive dependencies can cause excessive re-renders. Mitigations: stable :key in v-for, computed caching, v-once/v-memo for static/expensive subtrees, splitting components to scope reactivity, and avoiding unnecessary reactive wrapping.',
      explanation: 'Acknowledging the cost and naming concrete mitigations is exactly the senior-level expectation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is declarative rendering related to the virtual DOM?',
    'What compiles a Vue template into a render function?',
    'How does reactivity trigger a re-render?',
    'When would you use a template ref to do imperative DOM work?',
    'Is JSX in Vue declarative or imperative?',
    'How does declarative rendering reduce bugs compared to jQuery?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mixing direct DOM manipulation (document.querySelector, innerHTML) into a Vue component.',
      why: 'It fights the declarative model; Vue may overwrite your changes on the next render, causing drift.',
      fix: 'Drive UI from reactive state and bindings; use template refs only for genuine imperative needs.',
    },
    {
      mistake: 'Treating the template as imperative — putting heavy logic/side effects in interpolations.',
      why: 'Interpolations re-run on every render; side effects there cause bugs and performance issues.',
      fix: 'Keep templates pure descriptions; move derivations to computed and side effects to watchers/handlers.',
    },
    {
      mistake: 'Omitting :key in v-for and expecting correct/efficient updates.',
      why: 'Without a stable key, Vue\'s diff may reuse the wrong nodes, breaking the declared mapping.',
      fix: 'Provide a stable unique :key so the declared list maps correctly during patching.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'All component templates are declarative; data-driven tables, forms, and lists are declared once and kept in sync by reactivity.' },
    { area: 'Component library', detail: 'UI libraries expose declarative props/slots; consumers describe state, the component renders accordingly.' },
    { area: 'Nuxt', detail: 'SSR renders the same declarative templates to HTML on the server, then hydrates them on the client.' },
    { area: 'Dashboards', detail: 'Charts and metrics declare their view from fetched reactive data, so updates flow automatically as data refreshes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Vue 3\'s compiler hoists static nodes and flags dynamic bindings, so re-renders touch only what can change.',
      'Minimal-diff patching means small state changes cause small DOM updates.',
    ],
    bad: [
      'Large unkeyed lists or wide reactive dependencies can trigger heavy re-renders/diffs.',
      'Expensive expressions in templates run on every render.',
    ],
    optimizations: [
      'Use stable :key, computed caching, and v-once/v-memo for static/expensive subtrees.',
      'Split big components so reactivity is scoped to smaller render effects.',
      'Move heavy logic out of templates into computed or methods.',
    ],
  },

  // 16. Security Considerations (omitted — see template-syntax/v-html for XSS)

  // 17. Related Concepts
  related: {
    prerequisites: ['what-is-vue', 'reactivity-fundamentals'],
    nextConcepts: ['template-syntax', 'interpolation-expressions', 'v-bind', 'virtual-dom', 'reactivity-render-link'],
    dependencyNote:
      'Declarative rendering is the paradigm that template syntax expresses and the reactivity system + virtual DOM implement. It builds on what Vue is and reactivity basics, and leads into template syntax, interpolation, v-bind, and the virtual DOM.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw "state" → "template" → "DOM" with a single arrow, labelled "declared once".',
      'Beside it draw the imperative version as a numbered list of DOM steps repeated on each change.',
      'Cross out a step in the imperative list to show "forget one → stale UI".',
      'Back on the declarative side, change state and draw Vue auto-re-deriving the DOM.',
      'Say: "Declarative = describe the result; Vue derives and applies the DOM changes for you."',
    ],
    diagram: `  Declarative:  state ─► template ─► DOM   (auto re-derive on change)
  Imperative :  1.find node 2.read state 3.set text  (repeat each change)
                              └─ forget one ⇒ BUG`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Declarative rendering means you describe the UI as a function of state in a template, and Vue keeps the DOM in sync automatically — instead of imperatively finding nodes and mutating them step by step. The template compiles to a render function that runs inside a reactive effect; when tracked state changes, the function re-runs, Vue diffs the new virtual DOM against the old, and patches only the differences. This eliminates forgotten-update bugs and lets the framework optimize. Use template refs as the imperative escape hatch only when needed.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Declarative rendering is the central paradigm of Vue. The idea is that you express your view as a function of state — you write a template that declares what the UI should look like for the current data, and Vue is responsible for keeping the real DOM matching that declaration. This contrasts with the imperative style of plain JavaScript or jQuery, where you write explicit step-by-step commands: select an element, read the current state, set its text content, and repeat those steps on every single change. The imperative style is bug-prone because if you forget to update one place, the UI silently goes stale. In the declarative style you state the relationship once — for example {{ count }} says this text always reflects count — and you can never forget, because there is no per-change code to forget. Under the hood, Vue compiles your template into a render function that returns a virtual DOM tree. That function runs inside a reactive effect, so any reactive value it reads is registered as a dependency. When one of those values changes, the effect re-runs to produce a new virtual DOM tree, and Vue diffs it against the previous tree and applies only the minimal real DOM mutations. So you describe the what, and the framework derives the how. Render functions and JSX are equally declarative — templates are just sugar compiled into them. When you genuinely need imperative DOM work — focusing an input, measuring layout, or integrating a non-Vue library — you use template refs as an escape hatch, while keeping your application state declarative. The trade-off is that diffing has a cost, so for large lists you use stable keys, computed caching, and v-once or v-memo to keep it fast.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Declarative code is clearer and less bug-prone but adds a runtime layer (diffing) absent from hand-tuned imperative DOM.',
      'The escape hatch (template refs) is necessary but, if overused, reintroduces imperative drift the model is meant to prevent.',
    ],
    edgeCases: [
      'Imperative third-party libraries (charts, maps) need careful ref-based integration so Vue and the library do not both mutate the same node.',
      'Side effects in template expressions break the "pure description" assumption and cause subtle re-render bugs.',
      'Unkeyed v-for can make the diff reuse the wrong nodes, breaking the declared mapping (e.g. input focus jumping).',
    ],
    runtimeBehavior: [
      'Each component is a render effect; only components whose dependencies changed re-render.',
      'Vue 3\'s compiler statically hoists unchanging VNodes and patch-flags dynamic bindings to skip work.',
      'Updates are batched and flushed asynchronously, so the DOM reflects final state after nextTick.',
    ],
    scalability: [
      'Scoping reactivity by splitting components limits re-render fan-out in large apps.',
      'For very large lists, virtualization plus keys keeps the declarative model performant.',
    ],
    productionConcerns: [
      'Audit any direct DOM manipulation for conflicts with Vue\'s renderer.',
      'Profile render hotspots; apply v-memo/computed where diffing dominates.',
      'Ensure SSR-rendered declarative output hydrates without mismatches.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Declarative = UI as a function of state; describe WHAT, not HOW.',
    'Imperative = explicit DOM commands repeated on every change (jQuery).',
    'Template → render function → VNode tree.',
    'Render runs in a reactive effect; reads register dependencies.',
    'State change → re-run → diff → minimal DOM patch.',
    'Templates, render functions, and JSX are all declarative.',
    'Keep templates pure: no heavy logic/side effects in expressions.',
    'Use stable :key in v-for for correct, efficient diffs.',
    'Template refs = imperative escape hatch (focus, measure, libs).',
    'Optimize with computed, v-once, v-memo, component splitting.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this imperative snippet declaratively in Vue: a paragraph showing a name that a button changes.',
      hint: 'Use ref + interpolation + @click.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst name = ref(\'Asha\')\n</script>\n\n<template>\n  <p>{{ name }}</p>\n  <button @click="name = \'Ravi\'">Rename</button>\n</template>',
        explanation: ['The <p> declares it follows name.', 'The click only changes state; Vue updates the DOM automatically.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Declaratively render a list that shows "No items" when empty, otherwise the items.',
      hint: 'Combine v-if/v-else with v-for.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst items = ref([])\n</script>\n\n<template>\n  <p v-if="items.length === 0">No items</p>\n  <ul v-else>\n    <li v-for="(it, i) in items" :key="i">{{ it }}</li>\n  </ul>\n</template>',
        explanation: ['v-if/v-else declare the empty vs filled UI.', 'v-for declares one li per item; pushing to items updates the DOM automatically.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show a render function that declaratively toggles a panel based on state, equivalent to a template with v-if.',
      hint: 'Return h(...) conditionally on a ref.',
      solution: {
        lang: 'js',
        code: 'import { h, ref } from \'vue\'\nexport default {\n  setup() {\n    const open = ref(false)\n    return () => h(\'div\', [\n      h(\'button\', { onClick: () => (open.value = !open.value) }, \'Toggle\'),\n      open.value ? h(\'section\', \'Panel content\') : null,\n    ])\n  },\n}',
        explanation: ['The render function returns the desired tree for the current state.', 'When open changes, Vue re-runs it and patches the diff — still declarative.'],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'On a whiteboard, contrast declarative and imperative UI for a live clock and explain why declarative is safer.',
      hint: 'Show the binding once vs a manual update loop.',
      solution: {
        lang: 'vue',
        code: '<!-- Declarative: bind once -->\n<script setup>\nimport { ref, onMounted } from \'vue\'\nconst now = ref(new Date().toLocaleTimeString())\nonMounted(() => setInterval(() => { now.value = new Date().toLocaleTimeString() }, 1000))\n</script>\n<template><time>{{ now }}</time></template>\n\n<!-- Imperative would be: el.textContent = ... inside the interval, -->\n<!-- repeated and easy to point at the wrong node. -->',
        explanation: [
          'Declaratively, the <time> is bound to now once; updating state updates the UI.',
          'Imperatively, you must select and set the node every tick and keep references correct.',
          'Declarative removes the chance of forgetting/targeting the wrong node — fewer bugs.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Declarative rendering is the conceptual core of Vue. Articulating "UI as a function of state" and contrasting it with imperative DOM work shows you understand why frameworks exist — the foundation interviewers build harder questions on.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the declarative-vs-imperative definition. Product companies (Zoho, Flipkart, Razorpay) ask how Vue keeps the DOM in sync and when to use refs. FAANG-level interviews probe the render-function/vdom pipeline and the performance costs of diffing.',
    whatInterviewersExpect:
      'They expect the "describe what, not how" framing, a jQuery contrast, the template→render→vdom→patch flow, and awareness of the imperative escape hatch and its trade-offs.',
  },
}

export default declarativeRendering
