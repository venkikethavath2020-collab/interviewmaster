import type { ConceptLesson } from '../../../types/lesson'

const renderFunctions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'render-functions',
  name: 'Render Functions',
  category: 'lifecycle-rendering',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Render functions are what your templates actually compile DOWN to — understanding them demystifies the whole rendering pipeline and makes you fluent in how Vue thinks.',
    'When a template cannot express what you need (dynamic tag names, programmatic child generation, conditional wrapping), a render function gives you the full power of JavaScript.',
    'Library and design-system authors (component libraries, headless components, renderless wrappers) reach for render functions because they offer maximum flexibility with no template parsing.',
    'Interviewers use render functions to test whether you really understand the Virtual DOM, VNodes, and the h() function — not just template syntax memorization.',
    'Knowing h() and the VNode shape lets you debug confusing patch behavior and write higher-order components that template syntax simply cannot express.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A render function is like building with LEGO instructions written as code instead of a picture.',
    story: [
      'Imagine you want to build a LEGO castle. Most of the time you follow a picture book — that picture is like a Vue template, easy to read.',
      'But sometimes the picture cannot show what you want. Maybe you want a castle that grows a new tower every time someone claps.',
      'So instead of a picture, you write a list of instructions in your own words: "put a red brick here, then if it is night, add a window".',
      'A render function is exactly that — instead of drawing the page, you write step-by-step instructions in JavaScript that tell Vue what to build. Vue then reads your instructions and makes the real page.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue you usually write HTML-looking templates, and Vue secretly turns them into a JavaScript function before showing anything on screen.',
    'That hidden function is called a render function, and its job is to return a description of what the screen should look like.',
    'You can skip the template and write that function yourself using a helper called h(), which stands for "hyperscript" — it creates one piece of the screen at a time.',
    'It is more work to write by hand, but it lets you use loops, if-statements, and variables to decide exactly what to build, which is harder to do in plain templates.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A render function is a JavaScript function that returns Virtual DOM nodes (VNodes) describing the UI. It is the lower-level alternative to a <template>; in fact templates compile into render functions.',
    how: 'You import h from "vue" and call h(type, props, children) to build VNodes. The function runs whenever reactive data it reads changes, returning a fresh VNode tree that Vue diffs against the previous one.',
    why: 'It gives you full programmatic control — generate tags dynamically, build children with array methods, and express logic that template directives make awkward.',
    code: {
      label: 'A render function with h()',
      lang: 'js',
      code: 'import { h, ref } from \'vue\'\n\nexport default {\n  setup() {\n    const count = ref(0)\n    // return the render function\n    return () => h(\'button\', {\n      onClick: () => count.value++,\n    }, `Clicked ${count.value} times`)\n  },\n}',
      explanation: [
        'setup() returns a function — that returned function IS the render function.',
        'h(\'button\', props, children) creates a VNode for a <button>.',
        'The second argument is the props/attributes object; onClick maps to the click listener.',
        'The third argument is the children — here a text string interpolating count.value.',
        'Because the render function reads count.value, Vue re-runs it whenever count changes.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A render function is a function that returns a Virtual DOM tree (VNodes) representing a component\'s output. Vue\'s compiler transforms <template> blocks into render functions at build time; authoring one manually with the h() (createVNode) helper bypasses the template compiler entirely. The render function is wrapped in a reactive effect, so it re-executes when any reactive dependency it touched changes, producing a new VNode tree that the renderer diffs (patches) against the previous tree to compute minimal DOM mutations.',

  // 7. Internal Working
  internalWorking: [
    'During setup() (or via the render option), Vue obtains a render function — either authored by you or compiled from your template.',
    'Vue wraps the render function in a ReactiveEffect (the component\'s render effect). Running it records every reactive property accessed as a dependency.',
    'Calling h(type, props, children) invokes createVNode internally, producing a plain VNode object: { type, props, children, key, shapeFlag, patchFlag, ... } — a lightweight JS description, NOT real DOM.',
    'The renderer (mount on first run) walks the returned VNode tree and creates real DOM nodes, attaching listeners and setting attributes.',
    'When a tracked reactive dependency changes, the scheduler re-runs the render effect, producing a NEW VNode tree.',
    'The patch() algorithm diffs the new tree against the old, using shapeFlags and (for compiled templates) patchFlags to skip static parts, then applies the minimal set of DOM operations.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  <template>  ──compiler──►  render() { return h(...) }
                                     │
                              reactive effect wraps it
                                     │ reads count.value (tracked)
                                     ▼
                            ┌──────────────────┐
                            │  VNode tree       │  (plain JS objects)
                            │  h('div',{}, [    │
                            │    h('button',...) │
                            │  ])               │
                            └────────┬──────────┘
                                     │ patch / diff vs previous
                                     ▼
                            ┌──────────────────┐
                            │   Real DOM        │  minimal mutations
                            └──────────────────┘
        count changes ──► effect re-runs ──► new VNode tree ──► patch`,

  // 9. Memory Visualization
  memoryVisualization: [
    'VNodes are short-lived plain objects allocated on the heap on every render; the previous tree is kept just long enough to diff against, then becomes garbage.',
    'The render function closure captures the component\'s reactive state (refs, props) — these live as long as the component instance is mounted.',
    'shapeFlags and patchFlags are small integers stored on each VNode to let the renderer branch quickly without re-inspecting structure.',
    'Hand-written render functions have NO patchFlags (the optimizing compiler did not run), so they are diffed fully — slightly more work than a compiled template.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — h() with props and children',
      lang: 'js',
      code: 'import { h } from \'vue\'\n\nexport default {\n  props: { msg: String },\n  setup(props) {\n    return () => h(\'h1\', { class: \'title\' }, props.msg)\n  },\n}',
      explanation: [
        'h(type, props, children) is the core building block (createVNode).',
        'Props/attrs go in the second argument; class and style work like in templates.',
        'The third argument can be a string (text), a VNode, or an array of VNodes.',
        'Returning a function from setup() registers it as the render function.',
      ],
    },
    intermediate: {
      label: 'Intermediate — dynamic tag and list children',
      lang: 'js',
      code: 'import { h } from \'vue\'\n\nexport default {\n  props: { level: { type: Number, default: 1 }, items: Array },\n  setup(props) {\n    return () => h(\n      \'h\' + props.level,           // dynamic tag: h1..h6\n      { class: \'heading\' },\n      props.items.map((item, i) =>\n        h(\'span\', { key: i }, item)  // build children programmatically\n      )\n    )\n  },\n}',
      explanation: [
        'The tag name is computed at runtime — impossible cleanly in a template without <component :is>.',
        'Children are generated with .map(), giving full array-method power.',
        'Each child gets a key so the diff algorithm can match nodes across renders.',
        'This is the classic "dynamic heading" example showing render-function flexibility.',
      ],
    },
    advanced: {
      label: 'Advanced — render function reading slots',
      lang: 'js',
      code: 'import { h } from \'vue\'\n\nexport default {\n  setup(props, { slots }) {\n    return () => h(\'div\', { class: \'card\' }, [\n      h(\'header\', null, slots.header ? slots.header() : \'Default header\'),\n      h(\'main\', null, slots.default ? slots.default() : null),\n    ])\n  },\n}',
      explanation: [
        'slots are exposed via the setup context; calling slots.header() returns its VNodes.',
        'You decide where slot content goes — the same control <slot> gives, but in JS.',
        'Always guard with slots.x && / ternary because a slot may be undefined.',
        'Scoped slots are just functions you call with props: slots.item({ row }).',
        'This is exactly how many component libraries assemble flexible layouts.',
      ],
    },
    realProject: {
      label: 'Real project — a renderless/HOC-style wrapper',
      lang: 'js',
      code: 'import { h, ref } from \'vue\'\n\n// A reusable "Toggle" that renders whatever its slot wants,\n// passing state + a toggler down (renderless component pattern).\nexport default {\n  setup(props, { slots }) {\n    const on = ref(false)\n    const toggle = () => (on.value = !on.value)\n    return () => slots.default?.({ on: on.value, toggle })\n  },\n}\n\n// Usage in a parent template:\n// <Toggle v-slot="{ on, toggle }">\n//   <button @click="toggle">{{ on ? \'ON\' : \'OFF\' }}</button>\n// </Toggle>',
      explanation: [
        'The component itself renders no DOM — it just calls the default scoped slot with state.',
        'Render functions make renderless components trivial: return slots.default?.(state).',
        'This separates behavior (toggle logic) from presentation (the parent decides markup).',
        'Headless UI libraries (e.g. Headless UI, Radix-style ports) use this exact technique.',
        'You could not express "render only the slot, no wrapper" as cleanly in a plain template.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a render function and how does it relate to a template?',
      answer: 'A render function is a JavaScript function returning VNodes that describe the UI. Vue compiles every <template> into a render function under the hood, so templates are syntactic sugar over render functions.',
      explanation: 'A strong answer states that templates ARE render functions after compilation, and that h() is the manual way to author them.',
    },
    {
      level: 'beginner',
      question: 'What does the h() function take as arguments?',
      answer: 'h(type, props?, children?). type is a tag string or component; props is an object of attributes, class, style, and event listeners (onClick etc.); children is a string, a VNode, or an array of VNodes.',
      explanation: 'Mentioning that event listeners are camelCase on-prefixed props (onClick) shows familiarity with the VNode props shape.',
    },
    {
      level: 'intermediate',
      question: 'When would you reach for a render function instead of a template?',
      answer: 'When the markup is highly dynamic — choosing the tag at runtime, generating children programmatically, conditional wrapping, or building renderless/HOC components — where template directives become awkward or impossible.',
      explanation: 'Good candidates cite concrete cases (dynamic heading level, renderless components) rather than saying "more flexibility".',
    },
    {
      level: 'intermediate',
      question: 'Why must you provide a key when generating a list of children in a render function?',
      answer: 'Keys let the diff algorithm match VNodes between the old and new tree, so it can reuse, move, or remove existing DOM correctly instead of re-creating everything and losing state.',
      explanation: 'Connecting keys to the patch algorithm and component/DOM state preservation is the senior signal.',
    },
    {
      level: 'advanced',
      question: 'Performance-wise, how do hand-written render functions differ from compiled templates?',
      answer: 'The template compiler adds optimizations like static hoisting and patchFlags so the renderer can skip static subtrees and only diff dynamic bindings. Hand-written render functions have no patchFlags, so Vue diffs them fully — generally a little slower for static-heavy UI.',
      explanation: 'Mentioning patchFlags and static hoisting demonstrates understanding of the compiler\'s optimizing role.',
    },
    {
      level: 'senior',
      question: 'How does a render function participate in Vue\'s reactivity and update cycle?',
      answer: 'Vue wraps the render function in a render effect. Running it tracks every reactive property accessed as a dependency. When any of those change, the scheduler queues the effect to re-run, producing a new VNode tree that patch() diffs against the previous one to apply minimal DOM mutations.',
      explanation: 'The senior answer ties render functions to the ReactiveEffect, scheduler batching, and the diff/patch step — the full pipeline.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between h() and createElement from Vue 2?',
    'How do you pass a class array or style object via h()?',
    'How do scoped slots look inside a render function? (functions you call with props)',
    'What is the difference between a render function and a functional component?',
    'How would you conditionally wrap content (e.g. with a <a> only when a link exists) in a render function?',
    'Why do compiled templates outperform equivalent hand-written render functions?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Returning the VNode directly from setup() instead of returning a function.',
      why: 'setup() must return the render function so it can re-run on updates; returning a VNode runs it once and breaks reactivity.',
      fix: 'Return an arrow function: setup() { return () => h(...) }.',
    },
    {
      mistake: 'Forgetting keys when mapping arrays into children.',
      why: 'Without keys the diff cannot reliably match nodes, causing wrong DOM reuse, lost input state, or unnecessary re-creation.',
      fix: 'Give each generated child a stable, unique key in its props.',
    },
    {
      mistake: 'Using kebab-case event names like "on-click" in the props object.',
      why: 'In VNode props, listeners are camelCase, on-prefixed: onClick, onMouseenter — not on-click.',
      fix: 'Write onClick, onInput, onCustomEvent (capitalize after on).',
    },
    {
      mistake: 'Hand-writing render functions for static-heavy UI to "be faster".',
      why: 'You lose the compiler optimizations (static hoisting, patchFlags), so it is usually slower, not faster.',
      fix: 'Prefer templates for normal UI; use render functions only where dynamism truly requires them.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Headless and flexible components (tables, menus, dynamic headings) use render functions so consumers control markup; Element Plus and others use h() internally for complex composition.' },
    { area: 'Vue', detail: 'Higher-order and renderless components return slots.default?.(state) from a render function to inject behavior without dictating markup.' },
    { area: 'SSR', detail: 'Server rendering walks the same VNode tree produced by render functions to stream HTML strings, so understanding VNodes helps debug hydration mismatches.' },
    { area: 'Nuxt', detail: 'Layout and meta components occasionally use render functions to programmatically assemble head tags or wrap pages conditionally.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Render functions allow precise, programmatic output with no template-parsing overhead at runtime.',
      'For genuinely dynamic structures, a render function can be cleaner and avoid heavy v-if/v-for nesting.',
    ],
    bad: [
      'No patchFlags or static hoisting, so static-heavy hand-written render functions are diffed in full — slower than compiled templates.',
      'Allocating new VNode objects every render adds GC pressure if your tree is large and re-renders often.',
    ],
    optimizations: [
      'Reserve render functions for the parts that truly need them; keep static UI in templates.',
      'Cache stable VNodes outside the render function or use v-once-equivalent caching for unchanging subtrees.',
      'Provide stable keys so the diff reuses DOM instead of re-creating it.',
      'Avoid creating new inline objects/arrays on every render when they never change.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['virtual-dom', 'template-compilation', 'components-basics'],
    nextConcepts: ['jsx-in-vue', 'higher-order-components-vue', 'headless-components', 'reactivity-render-link'],
    dependencyNote:
      'Render functions sit directly on top of the Virtual DOM and are the target the template compiler emits. Understand the Virtual DOM and template-compilation first; render functions then unlock JSX, higher-order, and headless component patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write <template><button>Hi</button></template> on the left.',
      'Draw an arrow labelled "compiler" to render() { return h(\'button\', null, \'Hi\') } on the right.',
      'Explain that h() returns a VNode — a plain JS object describing the element.',
      'Draw the VNode being patched against the previous VNode to produce real DOM.',
      'Say: "Templates are sugar; both end up as a render function wrapped in a reactive effect that re-runs and diffs on change."',
    ],
    diagram: `  template ──compiler──► render() ──► h() ──► VNode ──patch──► DOM
                                            ▲
                                  hand-written render fns
                                  skip the compiler (no patchFlags)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A render function returns VNodes describing the UI. Templates compile into render functions, so they are just sugar. You author one manually with h(type, props, children), which builds plain VNode objects. Vue wraps it in a reactive effect; when tracked data changes it re-runs and the new VNode tree is diffed against the old to patch the DOM. Use them for dynamic tags, programmatic children, and renderless/HOC components — but know they lack the compiler optimizations (patchFlags) that templates get.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A render function is a JavaScript function that returns Virtual DOM nodes describing what a component should render. The important insight is that every Vue template is compiled into a render function at build time, so templates are just a friendlier syntax over them. You can skip the template and write the render function yourself using the h() helper, which is short for hyperscript. You call h with a type — a tag string or a component — an optional props object that holds attributes, class, style, and on-prefixed event listeners, and children, which can be a string, a VNode, or an array of VNodes. Vue wraps your render function in a reactive effect, so when it runs it tracks every reactive value it reads, and when any of those change the effect re-runs, producing a new VNode tree that the renderer diffs against the previous one to apply minimal DOM changes. You reach for render functions when templates get awkward: choosing a tag name at runtime, generating children with array methods, conditional wrapping, or building renderless and higher-order components that just call a scoped slot with some state. The trade-off is that hand-written render functions lose the template compiler\'s optimizations like static hoisting and patchFlags, so they are diffed in full and are usually slightly slower for static-heavy UI. So I default to templates and use render functions surgically where the dynamism genuinely needs them.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Flexibility vs optimization: render functions give total control but forgo compiler patchFlags/static hoisting, so they can be slower than equivalent templates.',
      'Readability vs power: complex JS-built trees are harder to scan than declarative templates, raising maintenance cost for teammates.',
    ],
    edgeCases: [
      'Returning a VNode vs returning a function from setup() — the latter is required for reactivity.',
      'Slots are functions; scoped slots take props, and a missing slot is undefined (guard with ?.).',
      'Fragments: returning an array of VNodes is allowed in Vue 3 (multiple roots), unlike Vue 2.',
      'Mixing reactive reads conditionally can change which dependencies are tracked between renders.',
    ],
    runtimeBehavior: [
      'The render function runs inside a ReactiveEffect; dependency tracking happens fresh on each run.',
      'createVNode normalizes children and computes shapeFlags so patch() can branch quickly.',
      'Without patchFlags, the diff treats all props/children as potentially dynamic.',
    ],
    scalability: [
      'For large dynamic trees re-rendering frequently, VNode allocation dominates — memoize stable subtrees.',
      'Component libraries centralize render-function complexity so app code stays declarative.',
    ],
    productionConcerns: [
      'Hydration mismatches surface as VNode-vs-server-HTML differences; understanding the VNode tree aids debugging.',
      'Keying generated children correctly is essential to avoid subtle state-loss bugs.',
      'Document why a render function was used so future maintainers do not "fix" it back to a template.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Templates compile to render functions — they are sugar.',
    'Author manually with h(type, props?, children?).',
    'h is hyperscript; createVNode under the hood.',
    'Return a FUNCTION from setup(): setup(){ return () => h(...) }.',
    'Listeners are camelCase on-prefixed props: onClick, onInput.',
    'children = string | VNode | VNode[]; arrays need keys.',
    'Slots are functions: slots.default?.(scopedProps).',
    'Vue 3 allows multiple root VNodes (fragments).',
    'No patchFlags/static hoisting → fuller diff → slower than templates for static UI.',
    'Use for dynamic tags, programmatic children, renderless/HOC components.',
    'Wrapped in a reactive effect → re-runs on dependency change → patch.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a render function (in setup) that renders a <p> with the text "Hello" and a class of "greeting".',
      hint: 'Return an arrow function calling h(\'p\', { class }, text).',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\nexport default {\n  setup() {\n    return () => h(\'p\', { class: \'greeting\' }, \'Hello\')\n  },\n}',
        explanation: ['h(\'p\', props, children) builds the VNode.', 'Returning the arrow function keeps it reactive-ready.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a component that accepts a prop `level` (1-6) and renders the matching heading tag with the default slot inside.',
      hint: 'Use a dynamic tag string \'h\' + level and pass slots.default?.().',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\nexport default {\n  props: { level: { type: Number, default: 1 } },\n  setup(props, { slots }) {\n    return () => h(\'h\' + props.level, null, slots.default?.())\n  },\n}',
        explanation: [
          'The tag is computed at runtime — the canonical render-function use case.',
          'slots.default?.() returns the child VNodes, guarded for absence.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Render a <ul> from an array prop `items` of strings, each as a keyed <li>, highlighting the item equal to prop `active` with class "active".',
      hint: 'Map items to h(\'li\', { key, class }, item).',
      solution: {
        lang: 'js',
        code: 'import { h } from \'vue\'\nexport default {\n  props: { items: { type: Array, default: () => [] }, active: String },\n  setup(props) {\n    return () => h(\'ul\', null,\n      props.items.map((item) =>\n        h(\'li\', { key: item, class: { active: item === props.active } }, item)\n      )\n    )\n  },\n}',
        explanation: [
          'Children are generated with .map(); each li gets a stable key (the item itself).',
          'class accepts an object form just like in templates: { active: condition }.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a renderless <Toggle> component that exposes { on, toggle } to its default scoped slot and renders nothing of its own.',
      hint: 'Return slots.default?.({ on: on.value, toggle }) — no wrapper element.',
      solution: {
        lang: 'js',
        code: 'import { ref } from \'vue\'\nexport default {\n  setup(props, { slots }) {\n    const on = ref(false)\n    const toggle = () => (on.value = !on.value)\n    return () => slots.default?.({ on: on.value, toggle })\n  },\n}\n// <Toggle v-slot="{ on, toggle }">\n//   <button @click="toggle">{{ on ? \'ON\' : \'OFF\' }}</button>\n// </Toggle>',
        explanation: [
          'The component renders only what the slot returns — no DOM of its own.',
          'It passes state and a mutator into the scoped slot, the renderless pattern.',
          'This is impossible to express as cleanly with a plain template.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Render functions are where the abstraction of templates falls away and you see how Vue actually works. Mastering h() and VNodes signals you understand the rendering pipeline end to end — a clear senior marker.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go beyond "what is a render function and how does it relate to a template". Product companies (Zoho, Flipkart, Razorpay) ask you to write a dynamic-heading or renderless component with h(). FAANG-level interviews probe the reactivity-to-patch pipeline, patchFlags, and why hand-written render functions can be slower.',
    whatInterviewersExpect:
      'They expect you to know templates compile to render functions, use h(type, props, children) correctly (camelCase listeners, keyed children, returning a function), and articulate when render functions are worth their performance trade-off.',
  },
}

export default renderFunctions
