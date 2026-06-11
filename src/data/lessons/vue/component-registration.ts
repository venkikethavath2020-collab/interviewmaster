import type { ConceptLesson } from '../../../types/lesson'

const componentRegistration: ConceptLesson = {
  // 1. Concept Summary
  slug: 'component-registration',
  name: 'Component Registration',
  category: 'components',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Before you can use a component in a template, Vue needs to know it exists — registration is the bridge between defining a component and rendering it.',
    'Choosing global vs local registration affects bundle size, tree-shaking, and how easy your app is to reason about.',
    'With <script setup>, registration becomes implicit (just import it), which trips up developers coming from the Options API — knowing both is important.',
    'Mis-registration is the cause of the very common "Failed to resolve component" warning, so understanding it saves debugging time.',
    'Interviewers use it to check you understand the component resolution model, naming conventions (PascalCase vs kebab-case), and the cost of global registration.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Registering a component is like adding a contact to your phone so you can call them by name instead of typing the whole number every time.',
    story: [
      'Imagine you have a friend named Sam. If Sam is not saved in your phone, you cannot just tap "Sam" to call — the phone has no idea who that is.',
      'Once you save Sam as a contact, you can call him by name anytime, easily.',
      'Some contacts you save just for one group chat (local) — only that chat knows them. Others you pin so every app on your phone can reach them (global).',
      'In Vue, before you can write <MyButton> in a page, you have to "save" it — either just for that one page (local) or for the whole app (global) — so Vue knows what <MyButton> means.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue component is just an object/file describing a piece of UI. But you cannot use <SomeComponent> in a template until Vue knows the name maps to that object.',
    'Telling Vue about it is called registration. There are two kinds: local (the component is available only in the file that registered it) and global (available everywhere in the app).',
    'Global registration is done once on the app (app.component(...)). Local registration means importing the component and using it in just that one component.',
    'With modern <script setup>, you do not even write a registration line — importing the component is enough; Vue picks it up automatically.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Component registration is how you make a component usable by name in a template. Local registration scopes it to one component (in <script setup>, just importing is enough; in the Options API you list it in components: {}). Global registration via app.component(name, Component) makes it available in every template in the app.',
    how: 'Local registration adds the component to the current component\'s resolution scope. Global registration adds it to the app\'s global component registry, which every component falls back to when resolving a tag. At render, Vue resolves a tag name first against local components, then globals.',
    why: 'Local keeps dependencies explicit and tree-shakeable (only bundled where used). Global is convenient for ubiquitous components (icons, base UI) but bundles them always and hides where they come from.',
    code: {
      label: 'Local (script setup) vs global registration',
      lang: 'vue',
      code: '<!-- Local: just import — registration is automatic in <script setup> -->\n<script setup lang="ts">\nimport BaseButton from \'./BaseButton.vue\'\n</script>\n<template>\n  <BaseButton>Click</BaseButton>\n</template>\n\n<!-- Global: register once in main.ts -->\n<!--\nimport { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport BaseIcon from \'./BaseIcon.vue\'\nconst app = createApp(App)\napp.component(\'BaseIcon\', BaseIcon) // now <BaseIcon> works everywhere\napp.mount(\'#app\')\n-->',
      explanation: [
        'In <script setup>, importing BaseButton is all you need — no components: {} block.',
        'Local registration means BaseButton is only usable in this file.',
        'app.component(name, Component) registers globally; <BaseIcon> then works in any template.',
        'Global avoids repeated imports but always ships the component, even if unused on some pages.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Component registration maps a tag name to a component definition so the renderer can resolve it. Local registration scopes a component to the registering component\'s render context: in the Options API via the components option, and in <script setup> implicitly by importing it (the compiler exposes imported components to the template). Global registration via app.component(name, def) adds the component to the app instance\'s global component registry. At render, resolveComponent looks up a tag first in the local components, then in the global registry; an unresolved name renders as a literal element and emits a "Failed to resolve component" warning in dev. Vue normalizes names so PascalCase and kebab-case are interchangeable. Global registration prevents tree-shaking of unused components, whereas local registration keeps them dead-code-eliminable.',

  // 7. Internal Working
  internalWorking: [
    'createApp(App) creates an app instance with a context object that includes a components registry (initially empty for globals).',
    'app.component(name, def) writes the definition into that global registry under the (normalized) name; calling it without a def reads it back.',
    'For local registration, the Options API stores components on the component\'s own options; in <script setup>, the SFC compiler binds imported identifiers so the template-generated render function references them directly.',
    'When the template compiler encounters a non-native tag, it emits a resolveComponent("Name") call (or a direct reference for <script setup> imports).',
    'resolveComponent checks the current instance\'s local components first, then the app\'s global registry; on a hit it returns the definition used to create the child vnode.',
    'On a miss (dev mode), Vue logs "Failed to resolve component" and renders the tag as a plain custom element; in production the warning is stripped.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   <MyButton/> in template
          │
          ▼
   resolveComponent('MyButton')
          │  1) check LOCAL components (this component's scope)
          │        └─ <script setup> import / components:{} option
          │  2) fall back to GLOBAL registry (app.component)
          ▼
   found ─► create child vnode from definition
   miss  ─► render as literal tag + warn "Failed to resolve component"

   LOCAL: scoped + tree-shakeable      GLOBAL: everywhere + always bundled
   names: PascalCase  ≡  kebab-case  (Vue normalizes)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — local registration with <script setup>',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport UserCard from \'./UserCard.vue\'\nimport UserAvatar from \'./UserAvatar.vue\'\n</script>\n\n<template>\n  <UserCard>\n    <UserAvatar />\n  </UserCard>\n</template>',
      explanation: [
        'Importing the components is the entire registration step in <script setup>.',
        'Both are local: usable only in this file.',
        'You can write them as PascalCase (<UserCard>) — the recommended convention in SFCs.',
        'No components: {} object is needed (that is the Options API form).',
      ],
    },
    intermediate: {
      label: 'Intermediate — Options API local + global registration',
      lang: 'ts',
      code: '// Options API local registration\nimport { defineComponent } from \'vue\'\nimport BaseInput from \'./BaseInput.vue\'\n\nexport default defineComponent({\n  components: { BaseInput }, // local: available only here\n  template: \'<BaseInput />\',\n})\n\n// Global registration in main.ts\nimport { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport BaseButton from \'./BaseButton.vue\'\nimport BaseIcon from \'./BaseIcon.vue\'\n\nconst app = createApp(App)\napp.component(\'BaseButton\', BaseButton)\napp.component(\'BaseIcon\', BaseIcon)\napp.mount(\'#app\')',
      explanation: [
        'In the Options API, local registration is the components: {} option.',
        'app.component(name, def) registers globally and returns the app, so calls can be chained.',
        'Globally registered BaseButton/BaseIcon are now resolvable in every template without import.',
        'Convention: prefix ubiquitous base components with "Base" (BaseButton, BaseIcon).',
      ],
    },
    advanced: {
      label: 'Advanced — auto-global registration (batch) and naming',
      lang: 'ts',
      code: '// Register every Base*.vue globally (e.g. via a Vite glob)\nimport { createApp, type Component } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\n\nconst modules = import.meta.glob(\'./components/Base*.vue\', { eager: true }) as Record<string, { default: Component }>\nfor (const path in modules) {\n  // derive PascalCase name from the file name\n  const name = path.split(\'/\').pop()!.replace(/\\.vue$/, \'\')\n  app.component(name, modules[path].default)\n}\n\napp.mount(\'#app\')',
      explanation: [
        'A Vite import.meta.glob eagerly imports all Base*.vue files for batch global registration.',
        'The component name is derived from the file name in PascalCase.',
        'Convenient for design-system base components used on nearly every page.',
        'Tradeoff: everything globbed is bundled and not tree-shaken, so reserve this for truly ubiquitous components.',
      ],
    },
    realProject: {
      label: 'Real project — dynamic component resolution by registered name',
      lang: 'vue',
      code: '<template>\n  <!-- pick a registered component by name at runtime -->\n  <component :is="widgetFor(block.type)" v-bind="block.props" />\n</template>\n\n<script setup lang="ts">\nimport TextBlock from \'./TextBlock.vue\'\nimport ImageBlock from \'./ImageBlock.vue\'\nimport type { Component } from \'vue\'\n\nconst props = defineProps<{ block: { type: string; props: Record<string, unknown> } }>()\nconst registry: Record<string, Component> = { text: TextBlock, image: ImageBlock }\nfunction widgetFor(type: string) {\n  return registry[type] ?? TextBlock\n}\n</script>',
      explanation: [
        '<component :is> renders a component chosen at runtime — common for CMS/page-builder blocks.',
        'A local registry object maps a string type to an imported component (local registration via import).',
        ':is can take a component definition directly (as here) or a globally-registered name string.',
        'This pattern powers dynamic dashboards, form renderers, and content blocks.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is component registration and why is it needed?',
      answer: 'It maps a tag name to a component definition so Vue can resolve <MyComponent> in a template to the right object. Without it, Vue does not know what the tag means and warns "Failed to resolve component".',
      explanation: 'Framing it as name-to-definition resolution is the core idea.',
    },
    {
      level: 'beginner',
      question: 'How do you register a component locally in <script setup>?',
      answer: 'Just import it. In <script setup>, any imported component is automatically available in that file\'s template — no components: {} block needed.',
      explanation: 'This simplicity is the big difference from the Options API and a frequent point of confusion.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between global and local registration, and the tradeoffs?',
      answer: 'Global (app.component) makes a component usable in every template app-wide but always bundles it and can\'t be tree-shaken; it also hides where the component comes from. Local (import / components option) scopes it to one component, keeps dependencies explicit, and stays tree-shakeable.',
      explanation: 'The bundle-size/tree-shaking and explicitness tradeoff is the key senior-leaning point.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue resolve a component tag at render time?',
      answer: 'resolveComponent looks up the name in the current component\'s local components first, then falls back to the app\'s global registry. A hit creates a child vnode from the definition; a miss renders a literal tag and warns in dev.',
      explanation: 'Naming the local-then-global lookup order shows real understanding of resolution.',
    },
    {
      level: 'advanced',
      question: 'Do PascalCase and kebab-case names matter for registration?',
      answer: 'Vue normalizes names, so a component registered as PascalCase (MyButton) can be used as <MyButton> or <my-button>. In SFC templates PascalCase is recommended; in-DOM templates require kebab-case because HTML is case-insensitive.',
      explanation: 'The in-DOM-template caveat is the detail that distinguishes a thorough answer.',
    },
    {
      level: 'senior',
      question: 'When would you choose global registration despite the tree-shaking cost?',
      answer: 'For a small set of truly ubiquitous components used on nearly every page — base UI primitives (BaseButton, BaseIcon, BaseInput) — where the convenience of no repeated imports outweighs bundling them everywhere (they\'d be in the common chunk anyway). For everything else, prefer local so unused components are eliminated and dependencies stay explicit.',
      explanation: 'A nuanced "global for ubiquitous, local for the rest" answer signals real architectural judgment.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does <script setup> not need a components: {} block?',
    'What causes the "Failed to resolve component" warning?',
    'How does global registration affect tree-shaking and bundle size?',
    'Can you use kebab-case and PascalCase interchangeably? Any exceptions? (in-DOM templates)',
    'How do you register many base components globally at once?',
    'How does <component :is> resolve a component by name vs by definition?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a component in a template without importing/registering it.',
      why: 'Vue cannot resolve the tag, so it renders as a literal element and warns "Failed to resolve component".',
      fix: 'Import it in <script setup> (local) or register it globally with app.component.',
    },
    {
      mistake: 'Globally registering many rarely-used components for convenience.',
      why: 'Global registration disables tree-shaking, so all of them ship even when unused.',
      fix: 'Register globally only ubiquitous base components; import the rest locally.',
    },
    {
      mistake: 'Using PascalCase tags in an in-DOM (non-SFC) template.',
      why: 'The browser lowercases HTML, so <MyButton> in real DOM becomes <mybutton> and fails to resolve.',
      fix: 'Use kebab-case (<my-button>) for in-DOM templates, or use SFCs where PascalCase works.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Most app components are locally registered via imports in <script setup>, keeping each file\'s dependencies explicit and the bundle tree-shakeable.' },
    { area: 'Component library', detail: 'Libraries expose components for local import, and often provide an install plugin that globally registers all components for users who prefer convenience over tree-shaking.' },
    { area: 'Nuxt', detail: 'Nuxt auto-imports components from the components/ directory, effectively giving local-style registration without manual import lines, with naming derived from the file path.' },
    { area: 'Vue', detail: 'Design-system base primitives (BaseButton, BaseIcon) are sometimes globally registered in main.ts since they appear on nearly every page.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Local registration keeps unused components out of the bundle via tree-shaking.',
      'Explicit imports make code-splitting and lazy loading (defineAsyncComponent) straightforward.',
    ],
    bad: [
      'Global registration prevents tree-shaking, so every globally registered component is always shipped.',
      'Over-globalizing inflates the initial bundle and the app\'s startup cost.',
    ],
    optimizations: [
      'Globally register only a small set of ubiquitous base components.',
      'Use local imports + defineAsyncComponent for heavy or rarely-used components to lazy-load them.',
      'In Nuxt, rely on auto-import (local-equivalent) rather than mass global registration.',
      'Audit the global registry periodically to remove components that aren\'t truly app-wide.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'single-file-components'],
    nextConcepts: ['script-setup', 'dynamic-components', 'async-components'],
    dependencyNote:
      'Component registration builds directly on components-basics and single-file-components (you register what you define). It connects to script-setup (where local registration becomes implicit), dynamic-components (<component :is> resolves registered names/definitions), and async-components (lazy-loaded registration).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write <MyButton/> and draw resolveComponent("MyButton") underneath.',
      'Draw two boxes: LOCAL (this component) checked first, then GLOBAL (app registry).',
      'Show a hit creating a child vnode; show a miss → literal tag + "Failed to resolve" warning.',
      'Note: <script setup> import = automatic local; app.component = global (no tree-shaking).',
      'Conclude with the rule: local by default, global only for ubiquitous base components.',
    ],
    diagram: `  <MyButton/> ──► resolveComponent('MyButton')
                       │
              1) LOCAL (import / components:{})  ── hit ─► child vnode
                       │ miss
              2) GLOBAL (app.component)          ── hit ─► child vnode
                       │ miss
                  literal tag + "Failed to resolve" (dev warn)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Component registration maps a tag name to a component definition so Vue can render it. Local registration scopes a component to one file — in <script setup> just importing it is enough; in the Options API you use the components option. Global registration via app.component(name, def) makes it usable app-wide. At render, Vue resolves a tag locally first, then globally, warning "Failed to resolve component" on a miss. Names normalize between PascalCase and kebab-case. Prefer local (tree-shakeable, explicit); reserve global for ubiquitous base components.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Component registration is how you make a component usable by name inside a template — it maps a tag like <MyButton> to the actual component definition so Vue\'s renderer can resolve it. There are two flavors. Local registration scopes a component to the file that registers it. In the Options API that means listing it in the components option, but in modern <script setup> you don\'t write any registration line at all — simply importing the component makes it available to that file\'s template, because the SFC compiler wires the imported identifier into the generated render function. Global registration is done once on the app instance with app.component(name, definition), and after that the component is resolvable in every template across the whole app without importing it. At render time, when Vue hits a non-native tag it calls resolveComponent, which checks the current component\'s local components first and then falls back to the app\'s global registry; if nothing matches, in development you get the familiar "Failed to resolve component" warning and the tag is rendered as a literal element. Vue normalizes names, so a component registered in PascalCase can be used as either PascalCase or kebab-case — with one caveat: in-DOM templates must use kebab-case because the browser lowercases HTML. The important tradeoff is bundling: global registration disables tree-shaking, so every globally registered component is always shipped, whereas local registration keeps unused components out of the bundle and makes each file\'s dependencies explicit. So the practical rule is: register locally by default, and reserve global registration for a small set of truly ubiquitous base components — things like BaseButton or BaseIcon that appear on nearly every page — where the convenience outweighs the cost. In Nuxt, auto-import gives you the ergonomics of no import lines while keeping local-style behavior.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Global registration: maximum convenience (no imports) but no tree-shaking and hidden provenance.',
      'Local registration: explicit, tree-shakeable, easy to lazy-load, at the cost of an import line per use.',
      'Auto-import (Nuxt/unplugin): best of both for DX but adds build-tooling magic that can obscure where components come from.',
    ],
    edgeCases: [
      'In-DOM templates require kebab-case names; PascalCase silently fails because HTML is case-insensitive.',
      'A locally registered component shadows a global one with the same name within that component.',
      '<component :is> can take either a globally-registered name string or a component definition directly.',
      'Recursive components must have a name (or use the file name) to reference themselves during resolution.',
    ],
    runtimeBehavior: [
      'resolveComponent walks local-then-global; unresolved names render literally and warn only in dev (stripped in prod).',
      '<script setup> imports are direct references, so there is no name-resolution step at all for them — slightly faster and statically analyzable.',
      'app.component writes into the app context\'s registry shared by all components mounted under that app.',
    ],
    scalability: [
      'Mass global registration becomes a bundle-size liability as the design system grows; local + async scales better.',
      'Auto-import tooling keeps large apps ergonomic without the global-registry tree-shaking penalty.',
    ],
    productionConcerns: [
      '"Failed to resolve component" warnings are dev-only; in prod a typo silently renders an empty custom element — lint/typecheck templates.',
      'Heavy globally-registered components inflate the entry chunk and hurt first load; prefer async local registration.',
      'Consistent naming conventions (PascalCase in SFCs, Base* prefix for globals) reduce confusion across teams.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Registration maps a tag name → component definition.',
    'Local: scoped to one component; tree-shakeable.',
    '<script setup>: import = automatic local registration.',
    'Options API local: components: { Foo } option.',
    'Global: app.component(name, def) — usable app-wide.',
    'Global = NOT tree-shaken (always bundled).',
    'Resolution order: local first, then global.',
    'Miss → "Failed to resolve component" (dev warning only).',
    'Names normalize: PascalCase ≡ kebab-case.',
    'In-DOM templates must use kebab-case.',
    'Rule: local by default, global for ubiquitous base components.',
    '<component :is> resolves a name string or a definition.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Register and use a UserBadge component locally in a <script setup> component.',
      hint: 'Just import it.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport UserBadge from \'./UserBadge.vue\'\n</script>\n<template>\n  <UserBadge />\n</template>',
        explanation: [
          'Importing UserBadge in <script setup> registers it locally.',
          'It can now be used as <UserBadge> in this file\'s template, with no components: {} block.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Globally register two base components (BaseButton, BaseIcon) so they can be used anywhere without importing.',
      hint: 'Use app.component in main.ts.',
      solution: {
        lang: 'ts',
        code: 'import { createApp } from \'vue\'\nimport App from \'./App.vue\'\nimport BaseButton from \'./components/BaseButton.vue\'\nimport BaseIcon from \'./components/BaseIcon.vue\'\n\nconst app = createApp(App)\napp.component(\'BaseButton\', BaseButton)\napp.component(\'BaseIcon\', BaseIcon)\napp.mount(\'#app\')',
        explanation: [
          'app.component(name, def) registers each component in the global registry.',
          'Now <BaseButton> and <BaseIcon> resolve in any template without an import.',
          'Reserve this for components used nearly everywhere, since globals aren\'t tree-shaken.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A page-builder needs to render a component chosen at runtime from a string "type". Implement it with <component :is> and a local registry.',
      hint: 'Map type strings to imported components.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <component :is="resolve(block.type)" v-bind="block.props" />\n</template>\n\n<script setup lang="ts">\nimport Heading from \'./Heading.vue\'\nimport Paragraph from \'./Paragraph.vue\'\nimport type { Component } from \'vue\'\nconst props = defineProps<{ block: { type: string; props: Record<string, unknown> } }>()\nconst map: Record<string, Component> = { heading: Heading, paragraph: Paragraph }\nfunction resolve(type: string): Component { return map[type] ?? Paragraph }\n</script>',
        explanation: [
          'The components are locally registered via import and stored in a map keyed by type.',
          '<component :is> takes the resolved definition and renders it dynamically.',
          'A fallback (Paragraph) guards against unknown types — robust for CMS-driven content.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Auto-register every Base*.vue component globally and explain the tree-shaking tradeoff you are accepting.',
      hint: 'Use import.meta.glob (Vite) and app.component in a loop.',
      solution: {
        lang: 'ts',
        code: 'import { createApp, type Component } from \'vue\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\nconst comps = import.meta.glob(\'./components/Base*.vue\', { eager: true }) as Record<string, { default: Component }>\nfor (const path in comps) {\n  const name = path.split(\'/\').pop()!.replace(/\\.vue$/, \'\')\n  app.component(name, comps[path].default)\n}\napp.mount(\'#app\')',
        explanation: [
          'import.meta.glob eagerly imports all Base*.vue files; each is registered globally by its PascalCase file name.',
          'Tradeoff: every globbed component is bundled regardless of use, since global registration defeats tree-shaking.',
          'This is acceptable only because Base* components are intended to be ubiquitous; non-base components should stay local.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Registration is the first thing every Vue developer does, and explaining local vs global, the resolution order, and the tree-shaking tradeoff shows you understand both ergonomics and bundle performance — not just how to make a tag work.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how do you use one component inside another" and global vs local. Product companies (Zoho, Flipkart, Razorpay) ask about tree-shaking implications and dynamic <component :is>. FAANG-level interviews probe resolution internals, naming caveats, and bundle-size strategy.',
    whatInterviewersExpect:
      'They expect you to explain that registration maps a name to a definition, that <script setup> imports register locally, that app.component registers globally (no tree-shaking), the local-then-global resolution order, and the rule to prefer local with global reserved for ubiquitous base components.',
  },
}

export default componentRegistration
