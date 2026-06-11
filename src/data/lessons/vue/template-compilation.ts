import type { ConceptLesson } from '../../../types/lesson'

const templateCompilation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'template-compilation',
  name: 'Template Compilation',
  category: 'lifecycle-rendering',
  difficulty: 'advanced',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Vue templates are not interpreted at runtime — they are compiled into JavaScript render functions, and knowing this explains a huge amount of Vue\'s behavior and speed.',
    'Compilation is where Vue 3\'s famous optimizations (static hoisting, patch flags, block trees) are injected, so understanding it is the key to "why is Vue fast?".',
    'It explains build vs runtime compilers, why CDN/no-build setups are slower, and why .vue SFCs need a build step.',
    'It clarifies what the template directives actually become (v-if → ternary, v-for → list render helper, {{ }} → toDisplayString), demystifying the framework.',
    'It is a strong advanced interview differentiator: most candidates know templates exist, few can explain what they compile into.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Template compilation is like translating a recipe written in English into the exact robot instructions a kitchen machine can follow.',
    story: [
      'Imagine you wrote a recipe in plain English: "mix the eggs, then bake for ten minutes".',
      'A kitchen robot cannot read English — it needs precise step-by-step button presses and motor commands.',
      'So before the robot starts, a translator reads your recipe once and rewrites it as exact machine commands the robot understands.',
      'Vue does this with your template: it reads the HTML-looking template once and translates it into precise JavaScript instructions (a render function) that the browser can run quickly.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue template looks like HTML with special bits like {{ }} and v-if, but the browser cannot run that directly.',
    'So Vue has a compiler that reads the template and turns it into a JavaScript function called a render function.',
    'That function, when called, produces the description of what the page should look like (the vnodes).',
    'Usually this translation happens ahead of time during the build step, so the browser only ever runs the fast JavaScript, not the template.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Template compilation is the process of transforming a Vue template string into a JavaScript render function. The render function returns the vnode tree that the Virtual DOM diffs and patches.',
    how: 'The compiler parses the template into an AST, transforms it (resolving directives, hoisting static parts, attaching patch flags), and generates render-function code. With a build step (Vite + SFC), this happens at compile time; with the full runtime build it can happen in the browser.',
    why: 'Compiling ahead of time means the browser never parses templates at runtime, and the compiler can inject optimizations the runtime alone could not infer — making updates faster and bundles smaller.',
    code: {
      label: 'Template vs the render function it becomes',
      lang: 'js',
      code: '// Template:  <p>{{ msg }}</p>\n// Compiles to roughly:\nimport { toDisplayString as _toDisplayString, openBlock as _openBlock, createElementBlock as _createElementBlock } from \'vue\'\n\nfunction render(_ctx) {\n  return (_openBlock(), _createElementBlock(\'p\', null, _toDisplayString(_ctx.msg), 1 /* TEXT */))\n}\n// the "1 /* TEXT */" is a PATCH FLAG: only the text can change',
      explanation: [
        '{{ msg }} becomes a call to toDisplayString around the reactive value.',
        'The element is created via createElementBlock so it can act as a block root for optimization.',
        'The trailing 1 is a patch flag telling the runtime only the text is dynamic.',
        'You write declarative HTML; the compiler emits optimized imperative JS.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Template compilation is the multi-stage transformation of a Vue template into an executable render function. The compiler tokenizes and parses the template into an Abstract Syntax Tree (AST), runs transform passes that resolve directives, hoist static subtrees, mark dynamic nodes with patch flags, and build a block tree, then generates JavaScript source for a render function returning vnodes. In SFC/build setups this runs at build time via @vue/compiler-sfc; the runtime-only build ships without the compiler, while the full build can compile in-browser at a runtime cost.',

  // 7. Internal Working
  internalWorking: [
    'Parse: the template string is tokenized and parsed into an AST whose nodes represent elements, text, interpolations, and directives with their expressions.',
    'Transform: a series of node and directive transforms run — v-if becomes a conditional expression, v-for becomes a renderList call, v-bind/v-on become props, and {{ }} becomes toDisplayString.',
    'Optimize: static, never-changing subtrees are hoisted to module scope so the same vnode is reused across renders; dynamic nodes get patch flags encoding exactly which bindings (text, class, style, props) can change.',
    'Block tree: the compiler wraps dynamic roots in openBlock/createBlock and collects their dynamic descendants into a flat array, so at update time the runtime walks only dynamic nodes and skips static structure.',
    'Generate: a code generator walks the transformed AST and emits the render function source string (with imports of runtime helpers like createElementVNode, renderList, toDisplayString).',
    'Execute: the generated render function is wrapped in the component\'s render effect; calling it produces the vnode tree that mounting/patching consume.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  <template>  (string)
       │  PARSE
       ▼
   AST (nodes: element / text / interpolation / directive)
       │  TRANSFORM (v-if→ternary, v-for→renderList, {{}}→toDisplayString)
       ▼
   optimized AST  ── static hoisting + patch flags + block tree
       │  GENERATE
       ▼
   render(_ctx) { return (openBlock(), createElementBlock(...)) }
       │  RUN (inside render effect)
       ▼
   VNODE TREE ──► Virtual DOM diff/patch ──► real DOM`,

  // 9. Memory Visualization — omitted

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — interpolation compiles to toDisplayString',
      lang: 'js',
      code: '// Template: <h1>{{ title }}</h1>\n// Generated (simplified):\nfunction render(_ctx) {\n  return _createElementVNode(\'h1\', null, _toDisplayString(_ctx.title), 1 /* TEXT */)\n}',
      explanation: [
        'The mustache interpolation becomes a toDisplayString call around the reactive `title`.',
        'The patch flag 1 (TEXT) marks the only dynamic part as the text content.',
        'On update the runtime only re-checks the text, not the whole element.',
        'This is the compiler turning declarative syntax into targeted imperative code.',
      ],
    },
    intermediate: {
      label: 'Intermediate — v-if and v-for compile to JS constructs',
      lang: 'js',
      code: '// Template: <li v-for="t in todos" v-if="t.done">{{ t.text }}</li>  (illustrative)\n// v-for → renderList, v-if → conditional, {{}} → toDisplayString\nfunction render(_ctx) {\n  return _renderList(_ctx.todos, (t) =>\n    t.done\n      ? _createElementVNode(\'li\', null, _toDisplayString(t.text), 1 /* TEXT */)\n      : _createCommentVNode(\'v-if\', true)\n  )\n}',
      explanation: [
        'v-for compiles to a renderList helper that maps over the array to vnodes.',
        'v-if compiles to a conditional expression; the false branch becomes a comment vnode placeholder.',
        'Note: on the SAME element v-if and v-for shouldn\'t be combined — this is illustrative of the generated shapes.',
        'Seeing these reveals directives are just sugar over JavaScript expressions.',
      ],
    },
    advanced: {
      label: 'Advanced — static hoisting',
      lang: 'js',
      code: '// Template: <div><span class="static">Logo</span>{{ dynamic }}</div>\n// The static <span> is HOISTED once, reused every render:\nconst _hoisted_1 = _createElementVNode(\'span\', { class: \'static\' }, \'Logo\', -1 /* HOISTED */)\n\nfunction render(_ctx) {\n  return _createElementVNode(\'div\', null, [\n    _hoisted_1,                                  // same vnode object every render\n    _createTextVNode(_toDisplayString(_ctx.dynamic), 1 /* TEXT */),\n  ])\n}',
      explanation: [
        'The static <span> never changes, so the compiler creates its vnode once at module scope.',
        'Every render reuses _hoisted_1 instead of recreating it, cutting allocation and diff work.',
        'Only the dynamic text node carries a patch flag and is checked on update.',
        'This is a pure compile-time win the runtime could not achieve alone.',
      ],
    },
    realProject: {
      label: 'Real project — build vs runtime compiler choice',
      lang: 'js',
      code: '// vite.config.js — using SFCs means templates compile at BUILD time (runtime-only Vue, smaller bundle)\n// If you instead pass a template string at runtime, you need the FULL build:\nimport { createApp } from \'vue\' // alias to \'vue/dist/vue.esm-bundler.js\' enables runtime compile\n\ncreateApp({\n  template: \'<p>{{ now }}</p>\', // requires the in-browser compiler\n  data: () => ({ now: Date.now() }),\n}).mount(\'#app\')',
      explanation: [
        'SFCs (.vue) are compiled by @vue/compiler-sfc during the build, so the browser ships only render functions.',
        'Passing a `template` string at runtime needs the full build that bundles the compiler — larger and slower.',
        'Production apps use SFCs/build-time compilation; the runtime compiler is mainly for quick CDN demos.',
        'This trade-off (bundle size vs runtime flexibility) is a common interview point.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What happens to a Vue template — is it run directly by the browser?',
      answer: 'No. Vue compiles the template into a JavaScript render function. The browser runs that function, which returns vnodes; it never interprets the template syntax directly.',
      explanation: 'A good answer names the render function as the compiled output.',
    },
    {
      level: 'beginner',
      question: 'When does template compilation happen?',
      answer: 'Usually at build time for SFCs (via @vue/compiler-sfc), so the browser only receives compiled render functions. With the full runtime build, a template string can also be compiled in the browser at runtime, which is larger and slower.',
      explanation: 'Distinguishing build-time vs runtime compilation shows awareness of the two Vue builds.',
    },
    {
      level: 'intermediate',
      question: 'What do {{ }}, v-if, and v-for compile into?',
      answer: '{{ }} becomes toDisplayString around the expression, v-if becomes a conditional (ternary) producing either a vnode or a comment placeholder, and v-for becomes a renderList call mapping the source to vnodes.',
      explanation: 'Concrete mappings demonstrate genuine understanding of compilation output.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between the runtime-only and full Vue builds?',
      answer: 'The runtime-only build excludes the template compiler and only runs pre-compiled render functions — smaller and what you use with a build step. The full build bundles the compiler so it can compile template strings in the browser, at a size and performance cost.',
      explanation: 'Connecting builds to whether compilation is needed at runtime is the key insight.',
    },
    {
      level: 'advanced',
      question: 'How does compilation make Vue 3 faster than a naive Virtual DOM?',
      answer: 'During the optimize stage the compiler hoists static subtrees (reused vnode objects), attaches patch flags marking exactly which bindings are dynamic, and builds a block tree so the runtime walks only dynamic nodes. This lets the diff skip static content entirely.',
      explanation: 'Naming static hoisting, patch flags, and block trees is the strong advanced signal.',
    },
    {
      level: 'senior',
      question: 'Walk through the compiler stages from template string to render function.',
      answer: 'Parse the template into an AST; run transform passes that resolve directives and expressions; optimize via static hoisting, patch flags, and block-tree construction; then generate JavaScript source for the render function with imported runtime helpers. The function is wrapped in the render effect and produces vnodes on each run.',
      explanation: 'A clean parse → transform → optimize → generate pipeline description is a senior-level answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is an AST and why does the compiler build one?',
    'What are patch flags and how do they speed up updates?',
    'What is static hoisting and what does it save?',
    'Why do .vue SFCs require a build step?',
    'When would you write a render function instead of a template?',
    'What is a block tree and how does it relate to dynamic nodes?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Shipping the full (compiler-included) build to production unnecessarily.',
      why: 'It bundles the entire template compiler and compiles at runtime, bloating the bundle and slowing startup.',
      fix: 'Use SFCs with a build step so templates compile ahead of time and you ship the runtime-only build.',
    },
    {
      mistake: 'Putting complex logic/expressions in templates.',
      why: 'They compile to inline render code that runs every render and is hard to optimize or test.',
      fix: 'Move logic into computed properties or methods so the compiled render stays lean.',
    },
    {
      mistake: 'Combining v-if and v-for on the same element.',
      why: 'Their compiled precedence is confusing and inefficient; v-if ends up evaluated per iteration in Vue 2 or precedence flips in Vue 3.',
      fix: 'Filter with a computed property, or wrap with a <template v-for> and put v-if inside.',
    },
    {
      mistake: 'Assuming directives are interpreted at runtime by name.',
      why: 'Most built-in directives are compiled away into JS constructs, not looked up at runtime.',
      fix: 'Understand v-if/v-for/v-bind compile to expressions/helpers; only custom directives are runtime objects.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every SFC template is compiled by @vue/compiler-sfc at build time into a render function plus scoped-style and script transforms.' },
    { area: 'Vite', detail: '@vitejs/plugin-vue invokes the SFC compiler during the build/dev pipeline, enabling HMR and shipping the runtime-only Vue build.' },
    { area: 'Nuxt', detail: 'Compiles templates server-side and client-side as part of SSR; compiler optimizations reduce hydration and update cost.' },
    { area: 'Component library', detail: 'Libraries publish pre-compiled render functions so consumers don\'t need the compiler, keeping their apps on the runtime-only build.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Ahead-of-time compilation means zero template-parsing cost in the browser at runtime.',
      'Static hoisting and patch flags let updates touch only dynamic nodes, making diffs very cheap.',
    ],
    bad: [
      'The full runtime-compiler build adds significant bundle size and per-template compile cost in the browser.',
      'Heavy inline template expressions generate render code that runs on every update.',
    ],
    optimizations: [
      'Use SFCs + a build step so you ship the smaller runtime-only build with pre-compiled templates.',
      'Keep templates declarative; push logic into computed properties so the compiler can hoist more.',
      'Prefer static markup where possible so the compiler can hoist it out of the render function.',
      'Use v-once for content that should compile to a one-time render.',
    ],
  },

  // 16. Security — omitted

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'virtual-dom', 'declarative-rendering'],
    nextConcepts: ['render-functions', 'reactivity-render-link', 'vite-vue', 'jsx-in-vue'],
    dependencyNote:
      'Template compilation turns template syntax into the render functions that feed the Virtual DOM. It builds on template-syntax and the vnode model, and it leads into render functions/JSX (the manual form of its output), the reactivity-render link, and the Vite tooling that runs the SFC compiler.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the template string at the top: <p>{{ msg }}</p>.',
      'Draw an arrow labeled PARSE to an AST box (element node with a text-interpolation child).',
      'Arrow labeled TRANSFORM/OPTIMIZE: note {{}}→toDisplayString, static hoisting, patch flags.',
      'Arrow labeled GENERATE to a render(_ctx) function returning createElementBlock(...).',
      'Say: "The browser never sees the template — it runs this generated render function inside the render effect to produce vnodes."',
    ],
    diagram: `  <p>{{ msg }}</p>
        │ parse
        ▼
   AST → transform/optimize (toDisplayString, hoist, patch flags)
        │ generate
        ▼
   render(_ctx){ return createElementBlock('p',null,
                   toDisplayString(_ctx.msg), 1/*TEXT*/) }`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue templates are not run directly — they are compiled into JavaScript render functions. The compiler parses the template into an AST, transforms directives ({{}}→toDisplayString, v-if→ternary, v-for→renderList), optimizes with static hoisting, patch flags, and block trees, then generates render-function code. For SFCs this happens at build time, so the browser ships only fast render functions. Those run inside the render effect to produce vnodes for the Virtual DOM. The full build can compile in-browser but is bigger and slower.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Vue template looks like HTML, but the browser can\'t execute that directly — Vue compiles it into a JavaScript render function. The compilation pipeline has four stages. First, parse: the template string is tokenized and parsed into an abstract syntax tree whose nodes represent elements, text, interpolations, and directives. Second, transform: the compiler rewrites directives into JavaScript — a mustache {{ x }} becomes a toDisplayString call, v-if becomes a conditional that yields either a vnode or a comment placeholder, and v-for becomes a renderList call. Third, optimize: this is where Vue 3 gets its speed. Static subtrees that never change are hoisted to module scope so the same vnode object is reused on every render; dynamic nodes get patch flags that encode exactly which bindings — text, class, style, props — can change; and a block tree is built so the runtime can walk only the dynamic nodes and skip static structure during diffing. Fourth, generate: a code generator emits the render-function source, importing runtime helpers like createElementVNode and renderList. That function is wrapped in the component\'s render effect and produces the vnode tree on each run. Crucially, for single-file components this all happens at build time via @vue/compiler-sfc, so the browser ships and runs only the compiled render functions on the smaller runtime-only build. The full build bundles the compiler so you can pass template strings at runtime, but that costs bundle size and per-template compile time, so production apps use the build-time path.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Build-time compilation (smaller runtime, faster startup, more optimization) vs runtime compilation (flexible template strings, but larger bundle and slower).',
      'Templates (statically analyzable → hoisting/patch flags) vs render functions/JSX (flexible but the compiler can\'t optimize them).',
    ],
    edgeCases: [
      'Dynamic component/slot content limits static hoisting because structure isn\'t known at compile time.',
      'v-if + v-for on one element produces confusing compiled precedence — avoid it.',
      'Inline expressions with side effects run every render and can\'t be cached.',
      'Custom directives remain runtime objects and aren\'t compiled away like built-ins.',
    ],
    runtimeBehavior: [
      'Patch flags let the runtime check only flagged dynamic bindings instead of full prop diffing.',
      'Hoisted vnodes are identical objects across renders, so the diff can fast-path them.',
      'Block trees flatten dynamic descendants so update traversal is proportional to dynamic nodes, not total nodes.',
    ],
    scalability: [
      'Compiler optimizations keep per-update cost tied to the number of dynamic bindings, not template size.',
      'Pre-compiling library components keeps consumer apps on the lean runtime-only build.',
    ],
    productionConcerns: [
      'Accidentally shipping the full build inflates bundle size — verify the alias points to the runtime-only build.',
      'SSR requires compiler output to match between server and client to avoid hydration mismatches.',
      'Overly clever inline template logic hurts both readability and the compiler\'s ability to optimize.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Templates compile to JS render functions; the browser never runs raw templates.',
    'Pipeline: parse → transform → optimize → generate.',
    '{{ }} → toDisplayString; v-if → ternary/comment; v-for → renderList.',
    'Optimize stage: static hoisting, patch flags, block trees.',
    'Patch flag = bitmask of which bindings on a vnode are dynamic.',
    'Static hoisting = reuse the same vnode object across renders.',
    'SFCs compile at BUILD time via @vue/compiler-sfc.',
    'Runtime-only build = no compiler (smaller); full build = bundles compiler.',
    'Render functions/JSX are the manual form of compiler output.',
    'Keep logic in computed; keep templates declarative for best optimization.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'State what {{ user.name }} in a template compiles into.',
      hint: 'Think about the helper that stringifies an expression.',
      solution: {
        lang: 'js',
        code: '// <span>{{ user.name }}</span> compiles to:\n// _createElementVNode(\'span\', null, _toDisplayString(_ctx.user.name), 1 /* TEXT */)',
        explanation: [
          'The interpolation becomes a toDisplayString call around the expression.',
          'The patch flag 1 (TEXT) marks the text as the only dynamic part.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Refactor a heavy inline template expression so the compiler can keep render lean.',
      hint: 'Move the computation into a computed property.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst items = ref([1, 2, 3])\n// BAD in template: {{ items.filter(x => x > 1).map(x => x * 2).join(\',\') }}\nconst processed = computed(() => items.value.filter(x => x > 1).map(x => x * 2).join(\',\'))\n</script>\n<template>\n  <p>{{ processed }}</p>\n</template>',
        explanation: [
          'Inline logic compiles into render code that runs every render.',
          'A computed is cached and only recomputes when its dependencies change.',
          'The compiled render now just reads a value via toDisplayString.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why this static markup benefits from hoisting and how you\'d keep it hoistable.',
      hint: 'Static = no bindings; avoid making it dynamic.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <header>\n    <!-- fully static: the compiler hoists this <h1> vnode once and reuses it -->\n    <h1 class="brand">FrameDrops</h1>\n    <p>{{ subtitle }}</p>  <!-- dynamic: kept in render with a patch flag -->\n  </header>\n</template>',
        explanation: [
          'The <h1> has no bindings, so the compiler creates its vnode once and reuses it every render.',
          'Adding any dynamic binding (e.g. :class) would prevent hoisting.',
          'Only the dynamic <p> is rechecked on update.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A teammate ships the full Vue build to production "to support runtime templates". Explain the cost and the fix.',
      hint: 'Compiler in the bundle + runtime compile cost vs SFC build-time compilation.',
      solution: {
        lang: 'js',
        code: '// Cost: full build bundles the template compiler (~larger) and compiles template strings\n// in the browser on every app start.\n// Fix: use SFCs (.vue) + @vitejs/plugin-vue so templates compile at BUILD time;\n// ship the runtime-only build:\n//   import { createApp } from \'vue\' // resolves to vue/dist/vue.runtime.esm-bundler.js\n// Replace any runtime `template: \'...\'` options with SFC <template> blocks or render functions.',
        explanation: [
          'The full build pays for the compiler in bundle size and at startup.',
          'Build-time SFC compilation removes the compiler from the shipped bundle.',
          'Converting runtime template strings to SFCs/render functions enables the runtime-only build.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Template compilation is the hidden machinery that makes Vue both ergonomic and fast. Understanding it lets you answer "why is Vue fast?", choose the right build, write compiler-friendly templates, and reason about render functions and SSR with confidence.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask whether templates are run directly and what they become. Product companies (Zoho, Flipkart, Razorpay) ask the build-vs-runtime compiler trade-off and what directives compile into. FAANG-level interviews probe the parse→transform→optimize→generate pipeline and patch flags/static hoisting/block trees.',
    whatInterviewersExpect:
      'They expect you to say templates compile to render functions, describe the four-stage pipeline, give concrete directive mappings, explain build-time vs runtime compilation, and name Vue 3\'s compile-time optimizations.',
  },
}

export default templateCompilation
