import type { ConceptLesson } from '../../../types/lesson'

const jsxInVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'jsx-in-vue',
  name: 'JSX in Vue',
  category: 'lifecycle-rendering',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'JSX is a familiar, ergonomic way to write render functions — it gives you the full power of JavaScript with a syntax that looks like HTML, without manually calling h() everywhere.',
    'Teams coming from React adopt JSX in Vue to share mental models and reuse a JS-first authoring style for highly dynamic components.',
    'It is the most readable way to express render-function-level logic: conditional wrapping, computed tag names, and complex child composition.',
    'Knowing JSX in Vue rounds out your understanding of the rendering pipeline — JSX, templates, and h() all compile to the same VNodes.',
    'Interviewers sometimes ask how Vue JSX differs from React JSX (class vs className, v-model handling, slots as functions) to test depth beyond surface syntax.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'JSX is like writing a story where you can drop little drawings right into the sentences.',
    story: [
      'Imagine you are writing a story, but in the middle of a sentence you want to glue a small picture of a cat.',
      'Normally pictures and words go in separate places, but JSX lets you mix them: you write words and pictures together in one flow.',
      'In code, the "words" are JavaScript like loops and if-statements, and the "pictures" are HTML-looking pieces.',
      'JSX lets you write the HTML-looking part right inside your JavaScript, so building a page feels like writing one smooth story instead of two separate things.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Vue usually separates your HTML (the template) from your JavaScript (the script). JSX lets you write HTML-looking tags directly inside JavaScript.',
    'A build tool (Babel or a Vite plugin) reads that JSX and turns each tag into a call to Vue\'s h() function, which makes a Virtual DOM node.',
    'So JSX is not really HTML — it is a shortcut that gets translated into the same render functions Vue uses internally.',
    'Because it is plain JavaScript, you can freely use variables, if-statements, and array methods inside it, which is harder to do in templates.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JSX is an XML-like syntax extension to JavaScript that compiles to h()/createVNode calls. In Vue you enable it with the @vitejs/plugin-vue-jsx (or Babel) plugin and write JSX inside a render function or setup return.',
    how: 'You write <div class="x">{value}</div> inside JS; the plugin transforms it to h(\'div\', { class: \'x\' }, value). Expressions go in curly braces, and the result is a VNode tree just like a template would produce.',
    why: 'It blends HTML-like readability with full JavaScript control, which is ideal for dynamic, programmatic UIs and for developers who prefer a JS-first workflow.',
    code: {
      label: 'A component written with Vue JSX',
      lang: 'jsx',
      code: 'import { ref, defineComponent } from \'vue\'\n\nexport default defineComponent({\n  setup() {\n    const count = ref(0)\n    return () => (\n      <button onClick={() => count.value++}>\n        Clicked {count.value} times\n      </button>\n    )\n  },\n})',
      explanation: [
        'setup() returns a function whose body is JSX — that function is the render function.',
        'onClick is a camelCase prop, like React, and maps to the click listener.',
        'Curly braces embed JavaScript expressions, here count.value.',
        'The JSX compiles to h(\'button\', { onClick }, [...]) producing the same VNode a template would.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JSX in Vue is a compile-time syntax extension, enabled via @vue/babel-plugin-jsx (used by @vitejs/plugin-vue-jsx), that transforms XML-like markup into Vue createVNode (h) calls. Each JSX element becomes a VNode; attributes become the props object, children become the children argument, and {expressions} are evaluated as JavaScript. Vue\'s JSX transform has Vue-specific semantics — class instead of className, listeners as on-prefixed props, v-model and v-show support via the plugin, and slots passed as functions — but ultimately produces the same Virtual DOM tree as templates or hand-written render functions.',

  // 7. Internal Working
  internalWorking: [
    'The build tool (Vite + @vitejs/plugin-vue-jsx, or Babel) parses .jsx/.tsx files and detects JSX expressions.',
    '@vue/babel-plugin-jsx transforms each JSX element into a createVNode/h call: tag → type, attributes → props object, nested elements/text → children.',
    'Vue-specific transforms are applied: v-model expands to a value prop plus an onUpdate handler, class/style merge correctly, and event handlers become onXxx props.',
    'The resulting render function is wrapped in the component\'s reactive effect exactly like a compiled template.',
    'On render, the VNodes are produced and patched against the previous tree to compute minimal DOM mutations.',
    'Because JSX is compiled, not interpreted at runtime, there is no separate template parser at runtime — the cost is identical to a hand-written render function (no template patchFlags optimization).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   .tsx file
   <button onClick={inc}>{n}</button>
            │ @vue/babel-plugin-jsx (build time)
            ▼
   h('button', { onClick: inc }, [n])
            │  (same as template / h())
            ▼
        VNode tree ──patch──► Real DOM

   class  (NOT className)     listeners: onClick
   {expr} = JS expression     children = array`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Like all render output, JSX produces VNode objects on the heap each render; the prior tree is retained only for diffing.',
    'JSX has no runtime footprint beyond the generated h() calls — the transform happens at build time.',
    'Because the optimizing template compiler did not run, the VNodes carry no patchFlags, so the diff is full (same cost profile as manual render functions).',
    'Closures inside JSX (event handlers) capture component reactive state and live as long as the render output that references them.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — props, class, and expressions',
      lang: 'jsx',
      code: 'import { defineComponent } from \'vue\'\n\nexport default defineComponent({\n  props: { msg: String },\n  setup(props) {\n    return () => <h1 class="title">{props.msg}</h1>\n  },\n})',
      explanation: [
        'Use class, NOT className — Vue JSX keeps Vue attribute names.',
        '{props.msg} embeds a JavaScript expression as the child.',
        'The element compiles to h(\'h1\', { class: \'title\' }, props.msg).',
        'defineComponent gives proper TypeScript inference for props.',
      ],
    },
    intermediate: {
      label: 'Intermediate — conditionals and lists in JSX',
      lang: 'jsx',
      code: 'import { defineComponent } from \'vue\'\n\nexport default defineComponent({\n  props: { items: { type: Array, default: () => [] } },\n  setup(props) {\n    return () => (\n      <ul>\n        {props.items.length === 0\n          ? <li>No items</li>\n          : props.items.map((it) => <li key={it.id}>{it.name}</li>)}\n      </ul>\n    )\n  },\n})',
      explanation: [
        'Conditionals use the ternary operator instead of v-if — plain JS.',
        'Lists use .map() instead of v-for; remember the key prop.',
        'No special directive syntax — it is all JavaScript inside braces.',
        'This shows why JSX shines for branching, programmatic UI.',
      ],
    },
    advanced: {
      label: 'Advanced — v-model and slots in JSX',
      lang: 'jsx',
      code: 'import { defineComponent, ref } from \'vue\'\nimport MyInput from \'./MyInput\'\n\nexport default defineComponent({\n  setup() {\n    const name = ref(\'\')\n    return () => (\n      <div>\n        {/* v-model works via the JSX plugin */}\n        <MyInput v-model={name.value} />\n        {/* slots are passed as an object of functions */}\n        <Card>{{\n          header: () => <h2>Title</h2>,\n          default: () => <p>{name.value}</p>,\n        }}</Card>\n      </div>\n    )\n  },\n})\nconst Card = defineComponent({\n  setup(_, { slots }) {\n    return () => <section>{slots.header?.()}{slots.default?.()}</section>\n  },\n})',
      explanation: [
        'The JSX plugin supports v-model={name.value}, expanding to value + onUpdate.',
        'Named slots are passed as an object of functions in the children position.',
        'Each slot function returns VNodes, exactly the render-function slot model.',
        'This mirrors template named slots but expressed in JavaScript.',
        'Scoped slots take props: default: ({ row }) => <td>{row}</td>.',
      ],
    },
    realProject: {
      label: 'Real project — a flexible Table column renderer',
      lang: 'jsx',
      code: 'import { defineComponent } from \'vue\'\n\n// Columns can supply a custom render function — JSX makes this natural.\nexport default defineComponent({\n  props: {\n    rows: { type: Array, default: () => [] },\n    columns: { type: Array, default: () => [] }, // [{ key, label, render? }]\n  },\n  setup(props) {\n    return () => (\n      <table>\n        <thead>\n          <tr>{props.columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr>\n        </thead>\n        <tbody>\n          {props.rows.map((row, i) => (\n            <tr key={i}>\n              {props.columns.map((c) => (\n                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>\n              ))}\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    )\n  },\n})',
      explanation: [
        'Each column can carry a render(row) callback returning JSX — fully programmatic cells.',
        'Nested .map() builds the grid; keys are provided at every level.',
        'Expressing per-column custom renderers is far cleaner in JSX than in a template with many scoped slots.',
        'Data-grid and dashboard libraries use this column-render pattern heavily.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is JSX in Vue and how do you enable it?',
      answer: 'JSX is an XML-like syntax that compiles to Vue h()/createVNode calls. You enable it with @vitejs/plugin-vue-jsx (or @vue/babel-plugin-jsx) and write JSX inside a render function or setup return.',
      explanation: 'A good answer mentions it compiles to the same VNodes as templates and requires a build plugin.',
    },
    {
      level: 'beginner',
      question: 'How is Vue JSX different from React JSX?',
      answer: 'Vue uses class (not className), event listeners as onClick-style props, and supports Vue directives like v-model and v-show through the plugin. Slots are passed as an object of functions rather than children components.',
      explanation: 'Naming class vs className and v-model support shows you understand Vue-specific JSX semantics.',
    },
    {
      level: 'intermediate',
      question: 'How do you render a list and a conditional in Vue JSX?',
      answer: 'Use plain JavaScript: array.map() for lists (with a key prop) and a ternary or && for conditionals, instead of v-for and v-if.',
      explanation: 'The point is that JSX has no directives — control flow is just JavaScript expressions.',
    },
    {
      level: 'intermediate',
      question: 'How are named and scoped slots expressed in JSX?',
      answer: 'Pass an object of functions as the children: <Comp>{{ header: () => <h1/>, default: (props) => <p>{props.x}</p> }}</Comp>. Each function returns VNodes and scoped slots receive props.',
      explanation: 'Knowing slots are functions in JSX connects directly to render-function fundamentals.',
    },
    {
      level: 'advanced',
      question: 'Does JSX in Vue benefit from the template compiler optimizations?',
      answer: 'No. JSX compiles straight to h() calls without patchFlags or static hoisting, so it is diffed in full — the same performance profile as hand-written render functions, generally a bit slower than equivalent templates for static UI.',
      explanation: 'Mentioning the missing patchFlags/static hoisting is the key senior distinction.',
    },
    {
      level: 'senior',
      question: 'When would you choose JSX over templates in a Vue codebase, and what are the trade-offs?',
      answer: 'Choose JSX for highly dynamic components — programmatic children, per-item custom renderers, conditional wrapping — or to share a JS-first style with a React-experienced team. Trade-offs are losing template compiler optimizations, weaker tooling/linting in some setups, and reduced readability for teammates used to templates.',
      explanation: 'A senior answer weighs ergonomics and team familiarity against optimization loss and maintainability.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What plugin transforms Vue JSX, and at build time or runtime?',
    'Why is it class and not className in Vue JSX?',
    'How does v-model compile in JSX? (value prop + onUpdate handler)',
    'How do you pass scoped slot props in JSX?',
    'Why might JSX be slower than an equivalent template?',
    'Can you mix JSX and templates in the same project? (yes, per-file)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using className instead of class.',
      why: 'Vue JSX keeps Vue attribute names; className is React-specific and will not apply the class correctly.',
      fix: 'Use class (and style as an object) exactly like in Vue templates.',
    },
    {
      mistake: 'Forgetting the build plugin and expecting JSX to "just work".',
      why: 'JSX is a compile-time transform; without @vitejs/plugin-vue-jsx the build fails or produces wrong output.',
      fix: 'Add the plugin to vite.config and name files .jsx/.tsx as needed.',
    },
    {
      mistake: 'Omitting key when mapping arrays to elements.',
      why: 'The diff cannot match nodes reliably, causing wrong DOM reuse and lost state — same rule as render functions.',
      fix: 'Add a stable, unique key prop to each mapped element.',
    },
    {
      mistake: 'Expecting template compiler speedups (patchFlags) in JSX.',
      why: 'JSX skips that optimization layer, so static-heavy JSX is diffed fully.',
      fix: 'Use templates for static-heavy UI; reserve JSX for dynamic parts.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Data grids and components with per-cell custom renderers use JSX so consumers can pass render(row) callbacks returning markup.' },
    { area: 'Vue', detail: 'Teams migrating from React or wanting JS-first authoring use JSX in setup() for dynamic components while keeping templates for the rest.' },
    { area: 'Nuxt', detail: 'JSX is supported via the same plugin; used selectively for programmatic layout/wrapper components.' },
    { area: 'Component library', detail: 'TSX gives strong typing for render-heavy components, pairing JSX ergonomics with TypeScript inference via defineComponent.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'JSX is compiled at build time, so there is no runtime template parsing cost.',
      'For dynamic, branch-heavy UI it can be cleaner and avoid awkward nested directives.',
    ],
    bad: [
      'No patchFlags or static hoisting — static-heavy JSX is diffed in full, slower than templates.',
      'New VNode allocations every render add GC pressure for large trees.',
    ],
    optimizations: [
      'Keep static/large UI in templates; use JSX only where dynamism warrants it.',
      'Provide stable keys for mapped elements so the diff reuses DOM.',
      'Hoist or memoize stable subtrees and avoid recreating inline objects each render.',
      'Use defineComponent for typing and to keep components optimizable by Vue.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['render-functions', 'virtual-dom', 'template-compilation'],
    nextConcepts: ['headless-components', 'higher-order-components-vue', 'typescript-with-vue'],
    dependencyNote:
      'JSX is a syntactic layer over render functions, so understand render-functions and the Virtual DOM first. It pairs naturally with TypeScript (TSX) and advanced component patterns like headless and higher-order components.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write <button onClick={inc}>{n}</button> inside a setup return.',
      'Draw an arrow labelled "@vue/babel-plugin-jsx (build time)".',
      'Show it becoming h(\'button\', { onClick: inc }, [n]).',
      'Note class (not className) and onXxx listeners as the Vue-specific bits.',
      'Say: "JSX, templates, and h() all converge on the same VNode tree — JSX is just an ergonomic JS-first syntax."',
    ],
    diagram: `  JSX  ──build-time transform──►  h() / createVNode  ──►  VNode  ──►  DOM
   class (not className)
   onClick listener
   {expr} = JS, .map() = list, ?: = condition`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JSX in Vue is an XML-like syntax that the @vitejs/plugin-vue-jsx transform compiles into h()/createVNode calls at build time, producing the same VNodes as templates. It gives JavaScript-first ergonomics: use .map() for lists, ternaries for conditionals, class (not className), onClick listeners, and slots as objects of functions. The trade-off is no template patchFlags optimization, so it has the same cost profile as hand-written render functions — great for dynamic components, less ideal for static-heavy UI.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JSX in Vue is an XML-like syntax extension for JavaScript that lets you write render-function-style markup ergonomically. You enable it with a build plugin — @vitejs/plugin-vue-jsx, which wraps @vue/babel-plugin-jsx — and then you can write JSX inside a setup return or render function. At build time, every JSX element is transformed into a Vue h() or createVNode call: the tag becomes the type, attributes become the props object, and children become the children argument, with curly braces embedding plain JavaScript expressions. So JSX, templates, and hand-written render functions all converge on the exact same Virtual DOM tree. The Vue-specific semantics matter in interviews: you use class, not className like React; event listeners are on-prefixed props such as onClick; the plugin supports Vue directives like v-model, which expands to a value prop plus an onUpdate handler, and v-show; and slots are passed as an object of functions, with scoped slots receiving props. Because it is just JavaScript, you express lists with array.map and conditionals with ternaries instead of v-for and v-if, which makes JSX especially clean for dynamic, programmatic UI like data-grid cells with custom per-column renderers. The main trade-off is that JSX skips the template compiler\'s optimizations — there are no patchFlags or static hoisting — so it has the same performance profile as manual render functions and is diffed in full, which can be slightly slower for static-heavy UI. So I tend to keep most components as templates and reach for JSX where the dynamism genuinely benefits, or when a React-experienced team prefers a JS-first style.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Ergonomics/familiarity vs optimization: JSX is readable and JS-native but forfeits template patchFlags/static hoisting.',
      'Team consistency: mixing JSX and templates can fragment a codebase; pick a convention per layer (e.g. JSX only for libraries).',
    ],
    edgeCases: [
      'v-model in JSX expands to value + onUpdate; custom components need matching update events.',
      'Slots are objects of functions; scoped slots receive props as the function argument.',
      'class accepts string/array/object forms; do not use className.',
      'Fragments: returning an array or wrapping in a Fragment is allowed (Vue 3 multi-root).',
    ],
    runtimeBehavior: [
      'Transform is purely compile-time; runtime cost equals the emitted h() calls.',
      'No patchFlags means the renderer treats props/children as potentially dynamic and diffs fully.',
      'Handlers defined inline in JSX allocate new closures each render unless hoisted.',
    ],
    scalability: [
      'For large static trees, JSX loses to templates; profile before converting big components.',
      'Per-item custom renderers (grids) scale well in JSX where templates would need many scoped slots.',
    ],
    productionConcerns: [
      'Tooling/linting for Vue JSX is less mature than for templates; ensure ESLint and TS configs match.',
      'Document why JSX was chosen so maintainers do not refactor it blindly.',
      'Watch hydration: JSX output must match SSR HTML just like templates.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'JSX compiles to h()/createVNode at build time.',
    'Enable with @vitejs/plugin-vue-jsx (uses @vue/babel-plugin-jsx).',
    'Use class, NOT className.',
    'Listeners are onClick-style props.',
    'Lists = .map() with key; conditionals = ternary/&&.',
    'v-model works via the plugin (value + onUpdate).',
    'Slots = object of functions; scoped slots get props.',
    'Same VNode output as templates; no patchFlags/static hoisting.',
    'Performance profile = hand-written render functions.',
    'Great for dynamic UI; templates better for static-heavy UI.',
    'Use defineComponent for TS inference (TSX).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a Vue JSX component that renders a <span> with class "tag" displaying a prop `text`.',
      hint: 'Return () => <span class="tag">{props.text}</span> from setup.',
      solution: {
        lang: 'jsx',
        code: 'import { defineComponent } from \'vue\'\nexport default defineComponent({\n  props: { text: String },\n  setup(props) {\n    return () => <span class="tag">{props.text}</span>\n  },\n})',
        explanation: ['class (not className) sets the CSS class.', '{props.text} embeds the prop as the child.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Render a list of `users` (array of { id, name }) as <li> items, showing "No users" when empty.',
      hint: 'Use a ternary on users.length and .map() with key.',
      solution: {
        lang: 'jsx',
        code: 'import { defineComponent } from \'vue\'\nexport default defineComponent({\n  props: { users: { type: Array, default: () => [] } },\n  setup(props) {\n    return () => (\n      <ul>\n        {props.users.length === 0\n          ? <li>No users</li>\n          : props.users.map((u) => <li key={u.id}>{u.name}</li>)}\n      </ul>\n    )\n  },\n})',
        explanation: [
          'Conditional rendering uses a ternary, not v-if.',
          'The list uses .map() with a stable key, not v-for.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a <Wrapper> that wraps the default slot in an <a href> only when an `href` prop is provided, otherwise renders the slot bare.',
      hint: 'Conditionally choose the tag/structure inside the render function.',
      solution: {
        lang: 'jsx',
        code: 'import { defineComponent } from \'vue\'\nexport default defineComponent({\n  props: { href: String },\n  setup(props, { slots }) {\n    return () =>\n      props.href\n        ? <a href={props.href}>{slots.default?.()}</a>\n        : <>{slots.default?.()}</>\n  },\n})',
        explanation: [
          'Conditional wrapping is trivial in JSX — just branch in JavaScript.',
          'A Fragment <>...</> renders children without an extra element when there is no href.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a <Table> that takes `rows` and `columns` ([{ key, label, render? }]) and uses each column\'s render(row) callback when present.',
      hint: 'Nested .map(): columns for headers, rows then columns for cells; call c.render(row).',
      solution: {
        lang: 'jsx',
        code: 'import { defineComponent } from \'vue\'\nexport default defineComponent({\n  props: {\n    rows: { type: Array, default: () => [] },\n    columns: { type: Array, default: () => [] },\n  },\n  setup(props) {\n    return () => (\n      <table>\n        <thead><tr>{props.columns.map((c) => <th key={c.key}>{c.label}</th>)}</tr></thead>\n        <tbody>\n          {props.rows.map((row, i) => (\n            <tr key={i}>\n              {props.columns.map((c) => (\n                <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>\n              ))}\n            </tr>\n          ))}\n        </tbody>\n      </table>\n    )\n  },\n})',
        explanation: [
          'Custom per-column renderers are a render(row) callback returning JSX.',
          'Nested maps build the grid with keys at each level.',
          'This is far cleaner in JSX than equivalent templates with many scoped slots.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'JSX shows you understand that templates are just one front-end to the same VNode pipeline. Even if you rarely use it, being able to read and reason about Vue JSX marks you as someone who understands rendering end to end.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) seldom test JSX. Product companies (Zoho, Flipkart, Razorpay) may ask how Vue JSX differs from React JSX or to write a dynamic component with it. FAANG-level interviews probe why JSX skips template optimizations and when that trade-off is acceptable.',
    whatInterviewersExpect:
      'They expect you to know JSX compiles to h() at build time, cite Vue-specific semantics (class not className, onClick listeners, v-model, slots as functions), and articulate the performance trade-off versus templates.',
  },
}

export default jsxInVue
