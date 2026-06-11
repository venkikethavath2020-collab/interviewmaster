import type { ConceptLesson } from '../../../types/lesson'

const vueStyleOptions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'vue-style-options',
  name: 'Component Styling Options',
  category: 'ecosystem',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Styling is half of building a UI — knowing scoped styles, CSS Modules, and global CSS lets you avoid the #1 frontend bug: styles leaking and overriding each other.',
    'Vue SFCs give you several styling strategies in one file, and choosing the wrong one causes either bleed (global pollution) or specificity wars.',
    'Scoped styles use a clever data-attribute trick that interviewers love to ask about — understanding it shows you know how Vue actually compiles your component.',
    'Real teams pick a styling approach (scoped + design tokens, Tailwind, CSS Modules) as an architectural decision; you will be expected to justify the tradeoffs.',
    'CSS features unique to Vue — :deep(), :slotted(), :global(), v-bind() in CSS — only make sense once you understand how scoping works.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Scoped styles are like writing your name on your own crayons so nobody else can use them by accident.',
    story: [
      'Imagine a classroom where everyone shares one big box of crayons. If you color your drawing red, someone else might grab that same red and your colors get mixed up.',
      'Now imagine each kid gets a special sticker that only sticks to THEIR crayons. When you reach for red, you only get YOUR red, and nobody can mess up your picture.',
      'In Vue, a component is like one kid. When you write "scoped" styles, Vue secretly puts a tiny invisible sticker on all your elements and on your color rules.',
      'That way your blue button stays blue, and the button in another part of the app keeps its own color. The stickers keep everyone\'s styles from getting tangled together.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue Single-File Component (SFC) has three blocks: <template> for HTML, <script> for logic, and <style> for CSS — all in one .vue file.',
    'Normally CSS is global: a rule like ".title { color: red }" turns EVERY element with class "title" red, anywhere in the app.',
    'Vue lets you add the word "scoped" to the <style> block so those rules only apply to that one component, not the whole page.',
    'You can also use plain global styles, CSS Modules (where class names become a JS object), or utility frameworks like Tailwind — each is a different way to keep styles organized and conflict-free.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue SFCs support multiple <style> strategies: plain global CSS, <style scoped> (styles isolated to the component), <style module> (CSS Modules exposed as a JS object), and integrations like Tailwind or CSS-in-JS. Scoped is the most common default.',
    how: 'With <style scoped>, the compiler adds a unique data attribute (e.g. data-v-7ba5bd90) to every element in the template and rewrites each selector to include a matching [data-v-7ba5bd90] attribute selector, so rules only match that component\'s elements.',
    why: 'It prevents styles from one component leaking into another, which is the root cause of countless hard-to-debug CSS conflicts in large apps.',
    code: {
      label: 'A scoped style in an SFC',
      lang: 'vue',
      code: '<template>\n  <button class="btn">Save</button>\n</template>\n\n<script setup lang="ts">\n// no logic needed for this example\n</script>\n\n<style scoped>\n.btn {\n  background: #2563eb;\n  color: white;\n  padding: 8px 16px;\n}\n</style>',
      explanation: [
        'The <style scoped> block isolates .btn to THIS component only.',
        'At build time Vue adds a data-v-xxxx attribute to the <button> and rewrites .btn to .btn[data-v-xxxx].',
        'A .btn class in any other component will not be affected by these rules.',
        'No naming convention like BEM is required to avoid collisions — scoping handles it for you.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue SFC styling refers to the set of strategies a .vue file supports inside one or more <style> blocks: global CSS (default), scoped CSS via the scoped attribute (compiler-injected data-attribute selectors that isolate rules to the component instance), CSS Modules via the module attribute (locally-hashed class names exposed as a $style/useCssModule object), preprocessor support via lang (scss, less, stylus), reactive CSS via v-bind() in <style>, and deep-selector escape hatches (:deep(), :slotted(), :global()). The compiler transforms each strategy at build time so styling is statically analyzable and tree-shakeable.',

  // 7. Internal Working
  internalWorking: [
    'The SFC compiler (@vue/compiler-sfc) parses the .vue file into descriptor blocks: template, script, and one or more style blocks, each with its own attributes (scoped, module, lang, src).',
    'For a scoped block, the compiler generates a unique scope id hashed from the file (e.g. data-v-7ba5bd90) and passes it to the template compiler so every rendered element receives that attribute.',
    'The style compiler rewrites each selector to append the matching attribute selector ([data-v-7ba5bd90]); the LAST element of a compound selector gets the attribute, so .a .b becomes .a .b[data-v-...].',
    'For module blocks, class names are hashed (e.g. .btn → .btn_a1b2c) and a mapping object is generated and injected so the script can reference $style.btn at runtime.',
    'For v-bind() in CSS, the compiler emits a CSS custom property (e.g. --7ba5bd90-color) bound to a reactive expression; the runtime updates that variable inline on the element when the value changes.',
    'Preprocessor langs (scss/less) are handled by feeding the raw style through the corresponding tool before scoping/module transforms run, so the output is plain CSS by the time it ships.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  <style scoped>            COMPILER                 OUTPUT
  .btn { color: blue } ──────────────────► .btn[data-v-7ba5bd90]{color:blue}
                              │
  <template>                  │ inject scope id
  <button class="btn">  ──────┴───────────► <button class="btn" data-v-7ba5bd90>
  </template>

  ┌──────────────── Component A (data-v-AAAA) ───────────────┐
  │  .btn[data-v-AAAA] { color: blue }   ← only matches A     │
  └───────────────────────────────────────────────────────────┘
  ┌──────────────── Component B (data-v-BBBB) ───────────────┐
  │  .btn[data-v-BBBB] { color: red }    ← only matches B     │
  └───────────────────────────────────────────────────────────┘
        same ".btn" name, ZERO collision`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — scoped vs global',
      lang: 'vue',
      code: '<template>\n  <h1 class="title">Hello</h1>\n</template>\n\n<style>\n/* GLOBAL: affects every .page everywhere */\n.page { margin: 0 auto; }\n</style>\n\n<style scoped>\n/* SCOPED: only this component\'s .title */\n.title { color: teal; }\n</style>',
      explanation: [
        'A single SFC can have multiple <style> blocks.',
        'The block without scoped is global; the one with scoped is isolated.',
        'Mixing them is common: global resets/tokens plus scoped component styles.',
        '.title here will not touch any other .title in the app.',
      ],
    },
    intermediate: {
      label: 'Intermediate — CSS Modules',
      lang: 'vue',
      code: '<template>\n  <button :class="$style.btn">Click</button>\n</template>\n\n<script setup lang="ts">\n// $style is auto-injected for <style module>\n</script>\n\n<style module>\n.btn {\n  background: #16a34a;\n  border-radius: 6px;\n}\n</style>',
      explanation: [
        '<style module> exposes class names as a $style object inside the template.',
        'The real class name is hashed (e.g. btn_x7f9), so collisions are impossible.',
        'You reference classes by JS property, which gives autocomplete and catches typos.',
        'Use useCssModule() in <script setup> if you need the object in logic.',
      ],
    },
    advanced: {
      label: 'Advanced — :deep(), v-bind() in CSS, and slotted',
      lang: 'vue',
      code: '<template>\n  <div class="card">\n    <ChildList />\n    <slot />\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nimport ChildList from \'./ChildList.vue\'\nconst accent = ref(\'#7c3aed\')\n</script>\n\n<style scoped>\n.card { border: 1px solid #eee; }\n/* reach into a child component\'s element */\n.card :deep(.list-item) { padding: 4px; }\n/* style content passed via <slot/> */\n.card :slotted(p) { margin: 0; }\n/* reactive CSS bound to a ref */\n.card { color: v-bind(accent); }\n</style>',
      explanation: [
        ':deep(.list-item) lets a scoped style pierce into a child component\'s DOM (the scope id moves to the inner selector).',
        ':slotted(p) targets DOM that arrived through a <slot>, which scoped styles otherwise ignore.',
        'v-bind(accent) compiles to a CSS custom property updated reactively when accent changes.',
        'These escape hatches exist precisely because scoping is strict by default.',
      ],
    },
    realProject: {
      label: 'Real project — design tokens + scoped + Tailwind in a dashboard',
      lang: 'vue',
      code: '<template>\n  <article class="stat-card flex items-center gap-3">\n    <span class="stat-card__value">{{ value }}</span>\n    <span class="text-gray-500">{{ label }}</span>\n  </article>\n</template>\n\n<script setup lang="ts">\ndefineProps<{ value: string; label: string }>()\n</script>\n\n<style scoped>\n.stat-card {\n  padding: var(--space-4);\n  border-radius: var(--radius-md);\n  background: var(--surface);\n}\n.stat-card__value {\n  font-size: var(--text-2xl);\n  font-weight: 700;\n}\n</style>',
      explanation: [
        'A common production blend: Tailwind utilities (flex, gap-3) for layout plus a scoped block for component-specific structure.',
        'CSS custom properties (--space-4, --surface) are global design tokens defined once and reused — they intentionally cross the scope boundary because custom properties are inherited, not selector-matched.',
        'Scoped + BEM-ish naming (stat-card__value) gives both isolation and readable DevTools output.',
        'This keeps each card self-contained while staying consistent with the design system.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does the "scoped" attribute on a <style> block do?',
      answer: 'It limits the CSS rules in that block to only the current component, so they do not leak to or override other components.',
      explanation: 'A strong answer adds HOW: the compiler adds a unique data attribute to the component\'s elements and rewrites selectors to include it.',
    },
    {
      level: 'beginner',
      question: 'What styling options does a Vue SFC support?',
      answer: 'Global CSS (plain <style>), scoped CSS (<style scoped>), CSS Modules (<style module>), preprocessors via lang (scss/less/stylus), and integration with utility frameworks like Tailwind.',
      explanation: 'Listing the menu and naming when you would pick each shows practical breadth.',
    },
    {
      level: 'intermediate',
      question: 'How do scoped styles actually isolate CSS under the hood?',
      answer: 'The compiler generates a scope id (data-v-hash), stamps it on every element rendered by the component, and rewrites each selector to include a matching [data-v-hash] attribute selector, so rules only match that component\'s elements.',
      explanation: 'Mentioning the attribute selector and that the id is per-file (shared across instances of the same component) is the key signal.',
    },
    {
      level: 'intermediate',
      question: 'Why might a scoped style fail to style a child component, and how do you fix it?',
      answer: 'Scoped selectors only carry the parent\'s scope id, which does not match the child\'s root/inner elements. Use :deep(.selector) to push the scope id onto the inner part so it can target child DOM.',
      explanation: 'This is a real daily pain point; knowing :deep() (and historically /deep/ or >>>) is expected.',
    },
    {
      level: 'advanced',
      question: 'What is v-bind() in <style> and how does it work?',
      answer: 'It lets CSS values be driven by reactive component state. The compiler emits a CSS custom property bound to the expression and the runtime updates that variable inline on the element when the value changes.',
      explanation: 'Senior signal: noting it is a CSS variable under the hood, so it is performant (no re-render of styles, just a variable update).',
    },
    {
      level: 'senior',
      question: 'How would you decide between scoped CSS, CSS Modules, and Tailwind for a large app?',
      answer: 'Scoped is the lowest-friction default and great for component-local styles. CSS Modules give explicit, JS-referenced class names with strong tooling and are good when you want guaranteed uniqueness and shared composition. Tailwind trades readability for speed, consistency, and zero unused CSS, and pairs well with a design system. Most large apps combine a token layer + utilities for layout + scoped for component internals.',
      explanation: 'They want a reasoned tradeoff (DX, bundle size, team conventions, theming) rather than a single dogmatic answer.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Does each instance of a component get its own scope id, or do they share one? (shared per component definition)',
    'How do scoped styles interact with content passed through slots? (:slotted())',
    'What is the difference between :deep() and a global style block?',
    'How do CSS Modules differ from scoped styles in collision strategy?',
    'How does v-bind() in CSS keep styles reactive without re-rendering?',
    'When would you use a global <style> block in a component, and what are the risks?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting scoped styles to style a child component\'s internal elements.',
      why: 'Scoped selectors only match elements carrying the parent\'s scope id; child internals have a different id.',
      fix: 'Use :deep(.child-selector) to pierce scoping, or expose styling hooks (props/classes/CSS variables) from the child.',
    },
    {
      mistake: 'Putting heavy global styles in a component\'s plain <style> block.',
      why: 'Global blocks leak app-wide and reintroduce the exact collisions scoping was meant to prevent.',
      fix: 'Keep global resets/tokens in a dedicated global stylesheet; use scoped/module for component-specific rules.',
    },
    {
      mistake: 'Relying on high-specificity selectors to "win" instead of scoping/modules.',
      why: 'Specificity wars are brittle and break when markup changes; they signal a missing isolation strategy.',
      fix: 'Adopt scoped or CSS Modules so uniqueness is structural, not a specificity arms race.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Component libraries ship scoped styles or CSS Modules so consumers can use components without worrying about CSS bleed; :deep() and CSS-variable theming hooks are exposed for customization.' },
    { area: 'Nuxt', detail: 'Nuxt apps commonly combine a global CSS/token layer (configured in nuxt.config) with scoped SFC styles, and frequently add Tailwind via a module for utility-first layout.' },
    { area: 'Component library', detail: 'Design systems lean on CSS custom properties (which cross the scope boundary) for theming, plus scoped styles for internal structure, giving themeable yet isolated components.' },
    { area: 'SSR', detail: 'Vue collects critical scoped CSS during server rendering so the correct styles are inlined in the initial HTML, avoiding a flash of unstyled content during hydration.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Scoped styles are compiled to plain attribute selectors — no runtime cost beyond a tiny extra attribute on elements.',
      'CSS Modules and Tailwind enable aggressive dead-code elimination, shipping less unused CSS.',
    ],
    bad: [
      'Overusing :deep() can defeat scoping benefits and create fragile cross-component coupling.',
      'Very deep scoped selectors add attribute-selector matching cost, though it is usually negligible.',
    ],
    optimizations: [
      'Keep selectors shallow; scoping already guarantees isolation, so you rarely need long descendant chains.',
      'Use CSS custom properties for theming instead of duplicating values across many scoped blocks.',
      'Prefer Tailwind/utility purging or CSS Modules to drop unused styles from the production bundle.',
      'Use v-bind() in CSS for dynamic values instead of re-rendering or inline-style churn.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['single-file-components', 'class-style-bindings'],
    nextConcepts: ['class-style-bindings', 'custom-directives', 'typescript-with-vue'],
    dependencyNote:
      'Styling builds directly on single-file-components (the .vue block structure) and complements class-style-bindings (dynamic classes/styles in templates). Together they cover how a Vue component looks and how that look stays isolated.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a simple .btn rule in a <style scoped> block.',
      'Draw the compiler turning it into .btn[data-v-7ba5bd90].',
      'Draw the matching data-v-7ba5bd90 attribute being stamped onto the <button> element.',
      'Draw a second component with a different id (data-v-BBBB) and the same .btn name — show no overlap.',
      'Conclude: "Scoping is just attribute selectors injected at build time; same name, zero collision. To reach into children, you use :deep()."',
    ],
    diagram: `  scoped CSS         compiled            DOM
  .btn{...}  ───►  .btn[data-v-AA]  ◄── <button data-v-AA>
                                              ▲
                                    only matches THIS component`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue SFCs support several styling strategies: global <style>, <style scoped> (isolated to the component), <style module> (CSS Modules with hashed class names), preprocessors via lang, and Tailwind/CSS-in-JS. Scoped works by stamping a unique data-v attribute on the component\'s elements and rewriting selectors to include it, so styles cannot leak. Escape hatches like :deep(), :slotted(), :global(), and reactive v-bind() in CSS handle the edge cases. Most real apps blend global tokens + utilities + scoped component styles.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Vue Single-File Component bundles template, script, and style in one file, and the style block can use several strategies. The default is global CSS, which behaves like any stylesheet. The most common is <style scoped>: the compiler generates a unique scope id, stamps it as a data attribute on every element the component renders, and rewrites each selector to include a matching attribute selector. So a .btn rule becomes .btn[data-v-hash], which only matches that component\'s button — two components can both have a .btn class with zero collision. Then there are CSS Modules via <style module>, where class names are hashed and exposed as a $style object you reference in the template, giving JS-level safety and autocomplete. You can also set lang to scss or less for preprocessors, and many teams add Tailwind for utility-first layout. Vue adds a few Vue-specific powers: :deep() lets a scoped style reach into a child component\'s DOM, :slotted() styles slotted content, :global() opts a rule out of scoping, and v-bind() in CSS binds a value to reactive state by emitting a CSS custom property the runtime updates. The way I choose: global stylesheet for resets and design tokens, Tailwind or utilities for layout, and scoped styles for the component\'s own structure — that gives isolation without specificity wars.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Scoped CSS: minimal friction and great defaults, but :deep() coupling and harder cross-component theming without tokens.',
      'CSS Modules: explicit, tool-friendly, composable, but more verbose ($style.x everywhere) and less ergonomic for quick prototyping.',
      'Tailwind: fastest iteration and tiny purged bundles, but markup gets noisy and design-system discipline is required.',
    ],
    edgeCases: [
      'Scope ids are per component definition, not per instance — all instances share the same data-v id.',
      'Slotted content keeps the PARENT\'s scope, so scoped child styles miss it unless you use :slotted().',
      'Dynamically created DOM (e.g. teleported content or third-party widgets) may not receive the scope id, so scoped styles silently miss them.',
      'v-bind() in CSS string-interpolates values; passing untrusted content can in theory inject into the style attribute.',
    ],
    runtimeBehavior: [
      'Scoped/module transforms happen at build time, so the runtime cost is just an extra attribute and standard CSS matching.',
      'v-bind() in CSS updates a CSS custom property inline on the element via a runtime effect — cheaper than re-rendering.',
      'In SSR, the framework tracks which scoped styles a render touched so critical CSS can be inlined.',
    ],
    scalability: [
      'In large apps, a shared design-token layer (CSS custom properties) is essential so scoped components stay themeable without duplication.',
      'CSS Modules or Tailwind purging keep the shipped CSS proportional to what is actually used, not the codebase size.',
    ],
    productionConcerns: [
      'Avoid :deep() chains that hard-couple a parent to a child\'s internal DOM — expose styling props/CSS variables instead.',
      'Watch for FOUC in SSR if critical CSS is not inlined for above-the-fold components.',
      'Standardize one approach per project; mixing scoped + modules + Tailwind ad hoc hurts maintainability.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'SFC = <template> + <script> + <style> in one .vue file.',
    'Plain <style> = global; <style scoped> = isolated to component.',
    'Scoped works via injected data-v-hash attribute + rewritten selectors.',
    'Scope id is shared by all instances of the same component.',
    '<style module> = CSS Modules → reference via $style.className.',
    ':deep(sel) pierces into child component DOM.',
    ':slotted(sel) styles content passed through a <slot>.',
    ':global(sel) opts a rule out of scoping.',
    'v-bind(expr) in CSS = reactive value via CSS custom property.',
    'lang="scss"/"less" enables preprocessors.',
    'Use CSS custom properties for theming across scope boundaries.',
    'Blend: global tokens + utilities (Tailwind) + scoped component styles.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write an SFC with a scoped style that makes a paragraph blue, and explain why it will not affect paragraphs in other components.',
      hint: 'Add the scoped attribute to the <style> block.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <p class="note">Scoped text</p>\n</template>\n\n<style scoped>\n.note { color: blue; }\n</style>',
        explanation: [
          'The compiler rewrites .note to .note[data-v-hash] and stamps that attribute on this <p>.',
          'Other components have a different scope id, so their .note paragraphs are unaffected.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert a component to use CSS Modules instead of scoped styles for a .card class.',
      hint: 'Use <style module> and bind the class via $style.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <div :class="$style.card">Content</div>\n</template>\n\n<style module>\n.card {\n  padding: 12px;\n  border-radius: 8px;\n}\n</style>',
        explanation: [
          '<style module> hashes .card to a unique name and exposes it on the $style object.',
          'Binding :class="$style.card" applies the real hashed class, guaranteeing no collision.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A parent uses a scoped style trying to set padding on a child component\'s .row element, but nothing applies. Fix it.',
      hint: 'Scoped selectors do not reach child internals by default.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <ChildTable />\n</template>\n\n<script setup lang="ts">\nimport ChildTable from \'./ChildTable.vue\'\n</script>\n\n<style scoped>\n/* before: .row { padding: 8px } — did nothing */\n:deep(.row) { padding: 8px; }\n</style>',
        explanation: [
          'A plain scoped .row only matches the parent\'s own elements, which do not include the child\'s .row.',
          ':deep(.row) moves the scope id so it can match the child\'s inner element.',
          'Use sparingly to avoid hard-coupling to a child\'s internal structure.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Make a card whose accent color is driven by a reactive ref, changing live when the ref updates, without re-rendering for the style change.',
      hint: 'Use v-bind() inside <style>.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <div class="card">\n    <button @click="accent = \'#ef4444\'">Make red</button>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst accent = ref(\'#2563eb\')\n</script>\n\n<style scoped>\n.card {\n  border: 2px solid v-bind(accent);\n}\n</style>',
        explanation: [
          'v-bind(accent) compiles to a CSS custom property bound to the ref.',
          'Updating accent updates that variable inline on the element — no template re-render needed for the color.',
          'This is the idiomatic Vue 3 way to do reactive, state-driven styling.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Styling isolation is where beginner Vue apps break first — once you understand scoped styles, CSS Modules, and the :deep()/v-bind() escape hatches, you can build maintainable UIs and explain the architecture confidently.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what does scoped do" and "scoped vs global". Product companies (Zoho, Flipkart, Razorpay) probe :deep(), CSS Modules, and how you organize styles in a design system. FAANG-level interviews dig into the compile-time mechanism, SSR critical CSS, and theming strategy at scale.',
    whatInterviewersExpect:
      'They expect you to list the styling options, explain the scoped data-attribute mechanism precisely, know the child-styling pitfall and its :deep() fix, and reason about which strategy to use for a large, themeable app.',
  },
}

export default vueStyleOptions
