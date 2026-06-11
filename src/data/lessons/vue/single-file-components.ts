import type { ConceptLesson } from '../../../types/lesson'

const singleFileComponents: ConceptLesson = {
  // 1. Concept Summary
  slug: 'single-file-components',
  name: 'Single-File Components',
  category: 'components',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'The .vue Single-File Component (SFC) is how virtually all real Vue code is written — template, logic, and styles for one component in one file.',
    'It enables scoped CSS, the <script setup> compiler macros, and per-component tooling that plain JS components cannot offer.',
    'Understanding the three blocks (<template>, <script>, <style>) and how the compiler processes them is a baseline Vue interview expectation.',
    'SFCs unlock build-time benefits: template pre-compilation, type-checking of props, hot-module replacement, and tree-shaking.',
    'Interviewers use SFC questions to check whether you understand the compile step that separates Vue from a no-build script tag.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An SFC is like a lunchbox with three compartments: one for the sandwich, one for the instructions, one for the napkin — all in one neat box.',
    story: [
      'Imagine you pack everything for one school project into a single labelled box instead of scattering pieces around your room.',
      'In that box there are three sections: what it looks like, how it works, and how it should be decorated.',
      'Because everything for that one project is together, you can grab the whole box, move it, or share it without losing any pieces.',
      'A Vue Single-File Component is that box for one piece of a web page: its looks, its logic, and its styling all live together in one .vue file.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally a web page splits into three files: HTML for structure, JavaScript for behaviour, and CSS for style. For a reusable component that scattering is annoying.',
    'A Single-File Component puts all three into one file ending in .vue, using three blocks: <template> (HTML), <script> (JS/TS), and <style> (CSS).',
    'A build tool (Vite) compiles this .vue file into a regular JavaScript component before it reaches the browser, because browsers cannot read .vue directly.',
    'The big benefits: everything for one component is co-located, the CSS can be scoped so it does not leak, and the template is compiled and checked ahead of time.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Single-File Component is a .vue file that defines one component using up to three top-level blocks: <template>, <script> (often <script setup>), and <style>.',
    how: 'A bundler plugin (e.g. @vitejs/plugin-vue) parses the .vue file, compiles the template to a render function, processes <script setup> macros, and scopes the styles, producing a standard JS component module.',
    why: 'Co-location plus compilation gives you scoped CSS, compile-time template optimisation, ergonomic <script setup> syntax, and great editor tooling — far beyond writing components by hand in plain JS.',
    code: {
      label: 'A complete Single-File Component',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst count = ref(0)\n</script>\n\n<template>\n  <button @click="count++">Clicked {{ count }} times</button>\n</template>\n\n<style scoped>\nbutton {\n  padding: 8px 16px;\n  border-radius: 6px;\n}\n</style>',
      explanation: [
        '<script setup> holds the reactive logic — a `count` ref.',
        '<template> declares the markup and binds to `count`.',
        '<style scoped> styles only this component\'s elements, not the whole page.',
        'All three blocks describe ONE component and live in ONE file.',
        'A build step compiles this into a plain JS component the browser can run.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Single-File Component (SFC) is a .vue file format that encapsulates a component\'s template, script, and styles in language-specific blocks. At build time a compiler (@vue/compiler-sfc via a bundler plugin) parses the SFC, compiles the <template> into a render function, transforms <script setup> compiler macros (defineProps, defineEmits, etc.) into a standard component options object, and rewrites scoped <style> selectors with a data attribute. The output is an ES module exporting a normal component definition.',

  // 7. Internal Working
  internalWorking: [
    'The bundler encounters an import of a .vue file and hands it to the Vue plugin, which calls @vue/compiler-sfc to parse the file into descriptor blocks (template, script, scripts, styles).',
    'The <template> block is compiled by @vue/compiler-dom into a render function, applying static hoisting and patch-flag optimisations so the runtime knows which nodes are dynamic.',
    'The <script setup> block is transformed: compiler macros like defineProps/defineEmits are stripped and converted into the component\'s props/emits options, and top-level bindings are exposed to the template.',
    'Each <style scoped> block gets a unique data-v-[hash] attribute; the compiler appends that attribute selector to every rule so styles cannot leak to other components.',
    'The plugin assembles these pieces into a single JavaScript module that exports a component object with a render function, setup function, and injected style imports.',
    'The bundler then treats that module like any other JS, enabling HMR (swapping just the changed block), tree-shaking, and TypeScript type-checking of the script.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        Button.vue (one file)
   ┌──────────────────────────────┐
   │ <template> … HTML …          │ ─┐
   │ <script setup> … JS/TS …     │ ─┼─► @vue/compiler-sfc
   │ <style scoped> … CSS …       │ ─┘        │
   └──────────────────────────────┘           ▼
                                    ┌──────────────────────┐
                                    │  compiled JS module   │
                                    │  • render() function  │
                                    │  • setup() + options  │
                                    │  • scoped style inject │
                                    └──────────────────────┘
                                               │
                                               ▼  browser runs plain JS`,

  // 9. Memory Visualization (omitted — build/compile topic, not memory graph)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the three blocks',
      lang: 'vue',
      code: '<script setup>\nconst message = \'Hello SFC\'\n</script>\n\n<template>\n  <h1>{{ message }}</h1>\n</template>\n\n<style scoped>\nh1 { color: teal; }\n</style>',
      explanation: [
        'Three top-level blocks: script, template, style.',
        '`message` declared in script is available directly in the template.',
        'The teal colour applies only to this component\'s <h1>.',
        'Order of blocks does not matter; convention is script, template, style.',
      ],
    },
    intermediate: {
      label: 'Intermediate — scoped styles vs global',
      lang: 'vue',
      code: '<script setup>\ndefineProps([\'title\'])\n</script>\n\n<template>\n  <section class="card">\n    <h2>{{ title }}</h2>\n    <slot />\n  </section>\n</template>\n\n<style scoped>\n/* only affects .card inside THIS component */\n.card { border: 1px solid #ddd; padding: 16px; }\n</style>\n\n<style>\n/* global: leaks to the whole app — use sparingly */\nbody { margin: 0; }\n</style>',
      explanation: [
        'The scoped block rewrites .card to .card[data-v-xxxx] so it cannot collide with other components.',
        'A second <style> without scoped is global and affects the whole app.',
        'You can have multiple style blocks in one SFC.',
        'Scoped styling is one of the headline reasons to use SFCs.',
      ],
    },
    advanced: {
      label: 'Advanced — TypeScript, scoped slot, and v-bind in CSS',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst theme = ref<\'light\' | \'dark\'>(\'light\')\nconst color = ref(\'#3b82f6\')\n</script>\n\n<template>\n  <div class="panel" @click="theme = theme === \'light\' ? \'dark\' : \'light\'">\n    Theme: {{ theme }}\n  </div>\n</template>\n\n<style scoped>\n.panel {\n  /* CSS v-bind() pulls a reactive value into the stylesheet */\n  background: v-bind(color);\n  cursor: pointer;\n}\n</style>',
      explanation: [
        '`lang="ts"` enables TypeScript in the script block with full type-checking.',
        'The ref type annotation constrains theme to a literal union.',
        'CSS `v-bind(color)` injects a reactive JS value into the stylesheet — an SFC-only feature.',
        'When `color` changes, Vue updates the bound CSS custom property at runtime.',
        'This shows how the SFC compiler bridges script and style blocks.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable Modal component',
      lang: 'vue',
      code: '<script setup lang="ts">\nconst props = defineProps<{ open: boolean; title: string }>()\nconst emit = defineEmits<{ close: [] }>()\n</script>\n\n<template>\n  <div v-if="props.open" class="overlay" @click.self="emit(\'close\')">\n    <div class="modal">\n      <header>{{ props.title }}</header>\n      <slot />\n      <button @click="emit(\'close\')">Close</button>\n    </div>\n  </div>\n</template>\n\n<style scoped>\n.overlay { position: fixed; inset: 0; background: rgba(0,0,0,.4); }\n.modal { background: #fff; margin: 10vh auto; max-width: 480px; padding: 24px; }\n</style>',
      explanation: [
        'One file fully describes a reusable Modal: structure, typed API, and isolated styles.',
        'Typed defineProps/defineEmits give compile-time safety on the component contract.',
        '<slot /> lets callers inject modal body content.',
        'Scoped styles guarantee .overlay/.modal never clash with other components.',
        'This single-file unit can be imported and reused across the whole app.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Single-File Component?',
      answer: 'A .vue file that defines one component using up to three blocks — <template>, <script>, and <style> — compiled by a build tool into a standard JS component.',
      explanation: 'Name the three blocks and that a build step compiles the file; that is the core of the answer.',
    },
    {
      level: 'beginner',
      question: 'What does <style scoped> do?',
      answer: 'It limits the CSS to the current component by adding a unique data attribute to its elements and matching selectors, so styles do not leak to other components.',
      explanation: 'Mentioning the data-v hash attribute mechanism shows you understand how scoping actually works.',
    },
    {
      level: 'intermediate',
      question: 'Why can\'t the browser run a .vue file directly?',
      answer: 'Browsers only understand HTML/CSS/JS. A .vue file must be compiled by @vue/compiler-sfc (via a bundler plugin) into a JS module exporting a normal component before it can run.',
      explanation: 'This tests awareness of the build step that distinguishes SFCs from CDN/no-build Vue.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between <script> and <script setup>?',
      answer: 'Plain <script> exports an options object you return values from; <script setup> is compile-time sugar where top-level bindings are auto-exposed to the template and macros like defineProps/defineEmits are used directly, with less boilerplate.',
      explanation: 'Strong answers note that <script setup> compiles to the same options object under the hood.',
    },
    {
      level: 'advanced',
      question: 'What optimisations does the SFC template compiler apply?',
      answer: 'Static hoisting of unchanging vnodes, patch flags that mark which parts of a node are dynamic, tree-flattening of static subtrees, and caching of inline handlers — so the runtime skips diffing static content.',
      explanation: 'Senior signal: connecting the compile step to runtime patch performance.',
    },
    {
      level: 'senior',
      question: 'How does HMR work with SFCs and why does it matter?',
      answer: 'The SFC compiler emits hot-update boundaries per block; when you edit only the <style> or <template>, the dev server swaps just that block and re-renders without losing component state, giving near-instant feedback.',
      explanation: 'This shows understanding of the compiler/bundler integration and developer-experience tradeoffs.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Can an SFC have multiple <style> blocks? (yes)',
    'How do you write TypeScript inside an SFC? (<script setup lang="ts">)',
    'What is the difference between scoped, module, and global styles?',
    'How does :deep() work in scoped styles?',
    'Can you use Vue without SFCs? (yes — CDN/global build with templates as strings or render functions)',
    'What does the v-bind() function in <style> do?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting scoped styles to affect child components.',
      why: 'Scoped styles only attach the data attribute to the current component\'s own elements, not deep descendants.',
      fix: 'Use the :deep() selector to intentionally pierce into a child, e.g. :deep(.child-class).',
    },
    {
      mistake: 'Trying to load .vue files directly in the browser without a build step.',
      why: 'Browsers cannot parse the SFC format; it must be compiled first.',
      fix: 'Use Vite (or another bundler) with the Vue plugin, or use string templates/render functions for no-build setups.',
    },
    {
      mistake: 'Putting global resets and many global styles in component <style> blocks.',
      why: 'Unscoped styles in components leak app-wide and create hard-to-trace cascade bugs.',
      fix: 'Keep global styles in a dedicated CSS entry file and keep component <style> scoped.',
    },
    {
      mistake: 'Forgetting lang="ts" and then writing TypeScript syntax that fails to compile.',
      why: 'Without lang="ts" the script is treated as plain JS and type annotations are invalid.',
      fix: 'Add lang="ts" to the <script setup> tag to enable TypeScript.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Essentially every component in a build-based Vue app is an .vue SFC with <script setup>, giving co-located template/logic/styles and full tooling.' },
    { area: 'Vite', detail: '@vitejs/plugin-vue compiles SFCs, enabling fast HMR, scoped CSS, and TypeScript checking during development.' },
    { area: 'Component library', detail: 'Design-system components are authored as SFCs and compiled/published; scoped styles prevent consumer style clashes.' },
    { area: 'Nuxt', detail: 'Pages, layouts, and components are all SFCs; Nuxt auto-imports them and handles SSR compilation of the same files.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Compile-time template optimisation (static hoisting, patch flags) makes SFC runtime patching faster than hand-written render logic.',
      'Scoped styles and tree-shaking keep CSS and JS payloads tight.',
    ],
    bad: [
      'Huge SFCs with massive templates produce large render functions and slow compiles.',
      'Many global style blocks increase CSS size and cascade cost.',
    ],
    optimizations: [
      'Split very large SFCs into smaller child components so each render function stays small.',
      'Prefer scoped or CSS modules over global styles to avoid shipping unused/leaking CSS.',
      'Use async components (defineAsyncComponent) so heavy SFCs are code-split out of the initial bundle.',
      'Lean on the compiler — write idiomatic templates so patch flags can do their job.',
    ],
  },

  // 16. Security Considerations (omitted — covered under v-html elsewhere)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'template-syntax'],
    nextConcepts: ['script-setup', 'props', 'class-style-bindings', 'vite-vue'],
    dependencyNote:
      'SFCs are the file format that components-basics live in. The natural next steps are script-setup (the modern script syntax inside an SFC), props/events for the component API, and vite-vue for the build pipeline that compiles SFCs.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a single rectangle and label it Button.vue.',
      'Divide it into three stacked sections: template, script, style.',
      'Draw an arrow from the box to a compiler bubble labelled @vue/compiler-sfc.',
      'From the compiler, draw an arrow to a JS module box (render fn + setup + scoped CSS).',
      'Say: "One file, three blocks, compiled at build time into a plain JS component the browser runs — that compile step is what enables scoped CSS and <script setup>."',
    ],
    diagram: `   Button.vue
   ┌───────────┐        ┌────────────┐      ┌──────────────┐
   │ template  │        │ compiler-  │      │  JS module:  │
   │ script    │  ───►  │   sfc      │ ──►  │ render+setup │
   │ style     │        └────────────┘      │ +scoped css  │
   └───────────┘                            └──────────────┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Single-File Component is a .vue file holding one component in three blocks: <template> for markup, <script> (usually <script setup>) for logic, and <style> for CSS. A build tool compiles it with @vue/compiler-sfc into a normal JS module — the template becomes an optimised render function, <script setup> macros become props/emits, and <style scoped> gets a data attribute so styles do not leak. Browsers cannot run .vue directly; the compile step unlocks scoped CSS, TypeScript, HMR, and template optimisations.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Single-File Component, or SFC, is the .vue file format that lets you define one component with everything it needs in a single file, organised into up to three top-level blocks: a <template> for the markup, a <script> — almost always <script setup> in Vue 3 — for the reactive logic, and a <style> for CSS. The key thing to understand is that this format does not run in the browser directly; it is compiled at build time by @vue/compiler-sfc, wired in through a bundler plugin like @vitejs/plugin-vue. The compiler does several jobs: it compiles the template into a render function, applying optimisations like static hoisting and patch flags so the runtime only diffs the dynamic parts; it transforms <script setup> macros such as defineProps and defineEmits into a normal component options object; and for <style scoped> it generates a unique data-v hash attribute and rewrites selectors so the styles can only match that component\'s own elements. The result is a standard ES module exporting a component definition. The payoff is huge: co-location of template, logic, and styles; scoped CSS that prevents global clashes; first-class TypeScript with lang="ts"; per-block hot-module replacement that swaps a style or template without losing state; and compile-time template optimisation. You can use Vue without SFCs through the CDN build with string templates, but for any real project the SFC plus a build tool is the standard, and it is what makes Vue\'s tooling and developer experience so strong.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Co-location (one file) improves discoverability but very large SFCs become unwieldy — there is tension between cohesion and file size.',
      'Scoped styles prevent leaks but make intentional cross-component styling harder, requiring :deep() and discipline.',
    ],
    edgeCases: [
      ':deep(), :slotted(), and :global() pseudo-selectors change how scoped styles apply and surprise newcomers.',
      'CSS v-bind() creates a runtime binding — values that change frequently update CSS custom properties on every change.',
      'Multiple <script> blocks (one plain, one setup) are allowed and run in a defined order; mixing them needs care.',
    ],
    runtimeBehavior: [
      'Static hoisting means unchanging vnodes are created once and reused, reducing per-render allocation.',
      'Patch flags emitted by the compiler let the runtime skip diffing static attributes/children.',
      'Scoped styles are injected as plain stylesheets at runtime; the data attribute is the only scoping mechanism, not true encapsulation like Shadow DOM.',
    ],
    scalability: [
      'Per-block HMR keeps large codebases fast to iterate on by swapping only the edited block.',
      'Code-splitting SFCs via async components keeps initial bundles small as the app grows.',
    ],
    productionConcerns: [
      'Scoped CSS is attribute-based, so a deeply nested or third-party widget can still be styled accidentally if you over-use :deep().',
      'Compile times grow with very large templates — keep components focused.',
      'SSR requires the same SFC compilation on the server; mismatches between server and client output cause hydration errors.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'SFC = one component in a .vue file.',
    'Three blocks: <template>, <script>/<script setup>, <style>.',
    'Compiled by @vue/compiler-sfc via a bundler plugin — not run raw in the browser.',
    'Template → optimised render function (static hoisting, patch flags).',
    '<script setup> macros → props/emits options.',
    '<style scoped> → unique data-v attribute prevents style leaks.',
    'Use :deep() to style child component internals from a scoped block.',
    'lang="ts" enables TypeScript in the script.',
    'CSS v-bind() injects a reactive JS value into styles.',
    'Multiple <style> blocks and a global <style> are allowed.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a complete SFC named Hello.vue that shows the text "Hi" in a styled <h1> (any colour) using scoped CSS.',
      hint: 'Three blocks; remember the scoped attribute on <style>.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nconst text = \'Hi\'\n</script>\n\n<template>\n  <h1>{{ text }}</h1>\n</template>\n\n<style scoped>\nh1 { color: rebeccapurple; }\n</style>',
        explanation: [
          'Script declares `text`, template renders it, style scopes the colour.',
          'scoped keeps the h1 colour from affecting other components.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Create an SFC Card.vue with a `title` prop, a default slot for body content, and scoped styling for a .card class.',
      hint: 'Use defineProps and <slot />.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps([\'title\'])\n</script>\n\n<template>\n  <div class="card">\n    <h3>{{ title }}</h3>\n    <slot />\n  </div>\n</template>\n\n<style scoped>\n.card { border: 1px solid #ccc; border-radius: 8px; padding: 16px; }\n</style>',
        explanation: [
          'defineProps declares the title shown in the header.',
          '<slot /> lets the parent inject body content.',
          'Scoped .card styling cannot collide with other cards in the app.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'In an SFC, style a child component\'s .label class from the parent\'s scoped block.',
      hint: 'Scoped styles do not pierce children by default — you need a special selector.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <ChildBadge />\n</template>\n\n<style scoped>\n/* :deep() pierces into the child component */\n:deep(.label) {\n  font-weight: bold;\n  color: crimson;\n}\n</style>',
        explanation: [
          'By default scoped styles only match the current component\'s own elements.',
          ':deep(.label) tells the compiler to omit the scope attribute on .label so it can match a child\'s element.',
          'Use sparingly — it deliberately breaks scoping isolation.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a ThemeBox.vue where clicking it toggles between two colours and the background is driven by a reactive value injected into scoped CSS.',
      hint: 'Use a ref and the v-bind() function inside <style>.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst bg = ref(\'#e0f2fe\')\nfunction toggle() {\n  bg.value = bg.value === \'#e0f2fe\' ? \'#fee2e2\' : \'#e0f2fe\'\n}\n</script>\n\n<template>\n  <div class="box" @click="toggle">Click to change theme</div>\n</template>\n\n<style scoped>\n.box {\n  background: v-bind(bg);\n  padding: 24px;\n  cursor: pointer;\n}\n</style>',
        explanation: [
          'The `bg` ref holds the current background colour.',
          'v-bind(bg) in scoped CSS binds that reactive value to a CSS custom property.',
          'Clicking toggles the ref, and Vue updates the CSS variable at runtime — no manual DOM style writes.',
          'This is an SFC-only feature bridging the script and style blocks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'SFCs are how Vue is actually written day to day. Understanding the three blocks and, crucially, the build-time compile step shows you grasp why Vue tooling works the way it does — scoped CSS, <script setup>, HMR, and TypeScript all flow from that compiler.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask you to name the three blocks and what scoped does. Product companies (Zoho, Flipkart, Razorpay) ask why .vue needs a build step and how the compiler optimises templates. FAANG-level interviews dig into patch flags, HMR boundaries, and SSR compilation of SFCs.',
    whatInterviewersExpect:
      'They expect you to describe the template/script/style blocks, explain that a compiler turns the file into a JS module, and articulate the benefits — scoped styles, compile-time optimisation, and tooling — over plain JS components.',
  },
}

export default singleFileComponents
