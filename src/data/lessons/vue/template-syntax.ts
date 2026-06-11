import type { ConceptLesson } from '../../../types/lesson'

const templateSyntax: ConceptLesson = {
  // 1. Concept Summary
  slug: 'template-syntax',
  name: 'Template Syntax',
  category: 'templates',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Templates are how you describe what the UI should look like — almost every Vue component you write lives or dies by its template.',
    'Vue templates are not just HTML: they are a declarative, compiled DSL with interpolation, directives, and bindings that map straight to the reactivity system.',
    'Understanding that templates compile to render functions explains performance, why some expressions are allowed and others aren\'t, and how reactivity hooks into the DOM.',
    'Interviewers use template questions to check you know directives (v-bind, v-on, v-if, v-for, v-model), the mustache syntax, and the difference between attributes and bindings.',
    'Clean, correct template syntax prevents a whole class of bugs: missing keys, wrong binding shorthands, side effects in templates, and accidental XSS via v-html.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Vue template is like a fill-in-the-blanks story where the blanks magically update themselves.',
    story: [
      'Imagine you write a story on a poster: "My favorite color is ____ and I have ____ stickers."',
      'Instead of writing in the blanks with a pen, you connect each blank to a little box on your desk. One box says "blue", another says "5".',
      'Whenever you change what is in a box — say you swap "blue" for "green" — the poster instantly updates itself to read "green". You never touch the poster again.',
      'A Vue template works the same way: you write HTML with special blanks (the mustache {{ }} and directives), connect them to your data boxes, and Vue keeps the page in sync whenever the data changes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Vue template looks like HTML but has extra powers. You put {{ }} (mustaches) where you want to show a piece of data, like {{ name }}.',
    'Special attributes called directives start with "v-": v-if shows or hides things, v-for repeats things for a list, v-bind connects an attribute to data, and v-on listens for events like clicks.',
    'Vue does not run your template as-is. It compiles it into a JavaScript function that builds the page, and re-runs the parts that depend on data when that data changes.',
    'This is "declarative" rendering: you describe WHAT the UI should look like for the current data, and Vue figures out HOW to update the real page.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Vue\'s template syntax is an HTML-based, declarative DSL: you write markup augmented with text interpolation ({{ }}), directives (v-bind, v-on, v-if, v-for, v-model, v-html, etc.), and binding shorthands (:, @, #). The compiler turns it into a render function tied to the reactivity system.',
    how: 'At build time the template compiler parses the markup into an AST, then generates a render function. When reactive data changes, the render function re-runs, produces a new virtual DOM tree, and Vue diffs/patches the real DOM.',
    why: 'It gives you a familiar, readable, statically-analyzable way to bind UI to state, with strong compile-time optimizations (hoisting static nodes, patch flags) that hand-written DOM code rarely matches.',
    code: {
      label: 'A small but complete template',
      lang: 'vue',
      code: '<template>\n  <div>\n    <h1>{{ title }}</h1>\n    <img :src="logo" :alt="title" />\n    <button @click="count++">Clicked {{ count }} times</button>\n    <p v-if="count > 0">You started clicking!</p>\n    <ul>\n      <li v-for="item in items" :key="item.id">{{ item.label }}</li>\n    </ul>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst title = ref(\'Dashboard\')\nconst logo = ref(\'/logo.png\')\nconst count = ref(0)\nconst items = ref([{ id: 1, label: \'A\' }, { id: 2, label: \'B\' }])\n</script>',
      explanation: [
        '{{ title }} is text interpolation — it shows the value of the reactive title.',
        ':src and :alt are v-bind shorthands binding attributes to data.',
        '@click is the v-on shorthand listening for clicks and running an expression.',
        'v-if conditionally renders, and v-for repeats with a required :key.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Vue template syntax is a declarative, HTML-superset DSL compiled ahead of time into a render function. It supports text interpolation via mustaches ({{ expression }}), one-way attribute binding via v-bind (shorthand :), event binding via v-on (shorthand @), two-way binding via v-model, structural directives v-if/v-else/v-show and v-for (with :key), raw HTML via v-html, and one-time/one-render via v-once/v-pre. Bindings accept single JavaScript expressions (not statements) evaluated in the component\'s render scope. The compiler produces an AST, applies optimizations (static hoisting, patch flags, cached event handlers, block tree), and emits a render function whose reactive dependencies trigger virtual-DOM diff-and-patch on change.',

  // 7. Internal Working
  internalWorking: [
    'The SFC/template compiler parses the template string into an AST of element, directive, interpolation, and text nodes.',
    'It performs a transform pass that resolves directives, marks static vs dynamic nodes, and attaches patch flags describing exactly what can change (class, style, text, props).',
    'It generates a render function returning virtual DOM (vnodes) via h()/createElementVNode; static subtrees are hoisted out so they are created once and reused.',
    'At runtime, the render function runs inside a reactive effect, so any reactive value it reads (e.g. count.value) is tracked as a dependency.',
    'When a tracked dependency changes, the effect schedules a re-run; the new vnode tree is produced and the diff algorithm uses the patch flags + block tree to skip static parts and update only changed bindings.',
    'Interpolations and bound attributes are written to the DOM during patch; v-html sets innerHTML directly (bypassing text escaping), which is why it is a known XSS vector.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   TEMPLATE (you write)                COMPILER              RUNTIME
   <h1>{{ title }}</h1>     ─────►  render() {            ─────► vnode tree
   <button @click="inc">             return h('h1', title)         │
   <li v-for=...>                  }                                ▼
                                       │                      diff + patch
        reactive reads (title)  ───────┘  tracked as deps  ──►  real DOM

   data changes ──► effect re-runs ──► new vnodes ──► patch only what changed
                    (static parts hoisted & skipped)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — interpolation and attribute binding',
      lang: 'vue',
      code: '<template>\n  <p>Hello, {{ user.name }}!</p>\n  <a :href="user.profileUrl">View profile</a>\n  <span>{{ user.age >= 18 ? \'Adult\' : \'Minor\' }}</span>\n</template>\n\n<script setup lang="ts">\nimport { reactive } from \'vue\'\nconst user = reactive({ name: \'Mia\', age: 20, profileUrl: \'/u/mia\' })\n</script>',
      explanation: [
        '{{ user.name }} interpolates a reactive value into text.',
        ':href binds an attribute to data instead of a static string.',
        'Mustaches accept a single JS EXPRESSION (a ternary here), not statements.',
        'Changing user.name later automatically updates the rendered text.',
      ],
    },
    intermediate: {
      label: 'Intermediate — directives together (v-if, v-for, v-on, v-model)',
      lang: 'vue',
      code: '<template>\n  <input v-model="query" placeholder="Search" />\n  <p v-if="query">Searching for: {{ query }}</p>\n  <p v-else>Type to search</p>\n  <ul>\n    <li v-for="r in results" :key="r.id" @click="select(r)">\n      {{ r.title }}\n    </li>\n  </ul>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst query = ref(\'\')\nconst results = ref([{ id: 1, title: \'Vue\' }, { id: 2, title: \'Vite\' }])\nfunction select(r: { id: number; title: string }) {\n  console.log(\'picked\', r.title)\n}\n</script>',
      explanation: [
        'v-model two-way binds the input value to query.',
        'v-if/v-else conditionally render based on query being truthy.',
        'v-for must have a :key (here r.id) for correct, efficient list patching.',
        '@click="select(r)" passes the current item to a method.',
      ],
    },
    advanced: {
      label: 'Advanced — dynamic args, modifiers, and v-html caution',
      lang: 'vue',
      code: '<template>\n  <!-- dynamic directive argument -->\n  <a :[attrName]="attrValue">Dynamic attr</a>\n\n  <!-- event modifiers chain -->\n  <form @submit.prevent="onSubmit">\n    <input @keyup.enter="onSubmit" />\n  </form>\n\n  <!-- raw HTML: only with trusted content -->\n  <div v-html="trustedHtml"></div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst attrName = ref(\'title\')\nconst attrValue = ref(\'tooltip text\')\nconst trustedHtml = ref(\'<strong>Safe</strong>\')\nfunction onSubmit() { /* ... */ }\n</script>',
      explanation: [
        ':[attrName] is a dynamic argument: the attribute being bound is itself computed.',
        '@submit.prevent applies event modifiers (here calling preventDefault automatically).',
        '@keyup.enter is a key modifier firing only on the Enter key.',
        'v-html injects raw HTML and bypasses escaping — never use it with user input (XSS risk).',
      ],
    },
    realProject: {
      label: 'Real project — a product card list in an e-commerce grid',
      lang: 'vue',
      code: '<template>\n  <section class="grid">\n    <article\n      v-for="p in products"\n      :key="p.id"\n      class="card"\n      :class="{ \'card--sale\': p.onSale }"\n    >\n      <img :src="p.image" :alt="p.name" loading="lazy" />\n      <h3>{{ p.name }}</h3>\n      <p class="price">{{ formatPrice(p.price) }}</p>\n      <button :disabled="!p.inStock" @click="addToCart(p)">\n        {{ p.inStock ? \'Add to cart\' : \'Sold out\' }}\n      </button>\n    </article>\n  </section>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\ninterface Product { id: number; name: string; price: number; image: string; inStock: boolean; onSale: boolean }\nconst products = ref<Product[]>([])\nconst formatPrice = (n: number) => new Intl.NumberFormat(\'en-IN\', { style: \'currency\', currency: \'INR\' }).format(n)\nfunction addToCart(p: Product) { /* dispatch to store */ }\n</script>',
      explanation: [
        'A realistic grid combines v-for + :key, dynamic :class, attribute binding, interpolation, and event handling.',
        ':class="{ \'card--sale\': p.onSale }" conditionally applies a class object-style.',
        ':disabled binds a boolean attribute; the button text uses a ternary expression.',
        'This is the bread-and-butter template pattern in nearly every product app.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the mustache syntax in Vue, and what can go inside it?',
      answer: 'The mustache {{ }} is text interpolation: it renders the value of a single JavaScript EXPRESSION as text. You can use ternaries, method calls, and property access, but not statements like if/for or variable declarations.',
      explanation: 'The key nuance interviewers want: single expression, not statements; and it outputs escaped text (safe from HTML injection).',
    },
    {
      level: 'beginner',
      question: 'What is a directive? Name a few common ones.',
      answer: 'A directive is a special v-prefixed attribute that applies reactive behavior to the DOM: v-bind (attribute binding), v-on (events), v-model (two-way binding), v-if/v-show (conditional), v-for (lists), v-html (raw HTML).',
      explanation: 'Knowing the shorthands (: for v-bind, @ for v-on, # for v-slot) is a common follow-up.',
    },
    {
      level: 'intermediate',
      question: 'What happens to a Vue template at build time?',
      answer: 'The compiler parses it into an AST and generates a render function returning virtual DOM. It applies optimizations like static hoisting and patch flags so runtime updates only touch dynamic parts.',
      explanation: 'Connecting templates to render functions and patch flags shows you understand templates are compiled, not interpreted.',
    },
    {
      level: 'intermediate',
      question: 'Why does v-for require a :key?',
      answer: 'The key gives each item a stable identity so the diff algorithm can match old and new vnodes correctly across reorders/insertions, preserving component state and DOM, and avoiding subtle bugs and unnecessary re-renders.',
      explanation: 'Mentioning that index-as-key breaks on reorder/insert is the senior-leaning detail.',
    },
    {
      level: 'advanced',
      question: 'What is a dynamic directive argument and when is it useful?',
      answer: 'Syntax like :[name]="value" or @[event]="handler" lets the argument (the attribute or event name) be a runtime expression. It is useful for generic/configurable components that bind or listen based on props.',
      explanation: 'Senior signal: noting the argument must evaluate to a string or null, and lowercasing caveats in in-DOM templates.',
    },
    {
      level: 'senior',
      question: 'Why are templates restricted to single expressions, and why avoid side effects in them?',
      answer: 'Templates run inside a reactive render effect that may re-run many times. Restricting to expressions keeps rendering declarative and predictable; side effects (mutating state, calling APIs) inside the template would fire on every render, cause infinite loops or unpredictable behavior, and break the mental model of render-as-a-pure-function-of-state.',
      explanation: 'This reveals deep understanding of the render-effect model and why heavy logic belongs in computed/methods, not the template.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What are the shorthands for v-bind, v-on, and v-slot? (: , @ , #)',
    'How does {{ }} differ from v-html in terms of safety?',
    'Can you use statements inside {{ }}? (no — expressions only)',
    'What is the difference between an attribute and a bound attribute (:attr)?',
    'How do patch flags make template updates fast?',
    'What is v-pre and v-once used for?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Putting statements or side effects inside {{ }} or directive expressions.',
      why: 'Templates allow only single expressions and re-run on every render; side effects cause bugs and performance issues.',
      fix: 'Move logic into computed properties or methods and reference them in the template.',
    },
    {
      mistake: 'Using v-html with user-provided content.',
      why: 'v-html sets innerHTML directly, bypassing escaping — it is a direct XSS vector.',
      fix: 'Use {{ }} (escaped) for user content, and only use v-html with sanitized/trusted HTML.',
    },
    {
      mistake: 'Omitting :key on v-for or using the array index as key when the list reorders.',
      why: 'Without a stable key, Vue may reuse the wrong DOM/state, causing visual glitches and lost input state.',
      fix: 'Use a stable unique id as :key.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every SFC component\'s <template> block is template syntax; the compiler optimizations (hoisting, patch flags) make Vue templates fast by default in production builds.' },
    { area: 'Nuxt', detail: 'Nuxt pages/layouts are templates compiled the same way, and can be statically generated or server-rendered, with the template producing the initial HTML for hydration.' },
    { area: 'Component library', detail: 'Library components expose props/slots and use template directives internally; clean template syntax (no side effects, proper keys) keeps them reliable across consumers.' },
    { area: 'SSR', detail: 'On the server the same template render function produces an HTML string; the client reuses the markup during hydration, so correct, deterministic templates are essential to avoid hydration mismatches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Compiled templates get static hoisting and patch flags, so re-renders only touch dynamic nodes.',
      'Declarative bindings let Vue batch DOM updates efficiently instead of imperative thrash.',
    ],
    bad: [
      'Heavy computations or method calls directly in templates run on every render and can slow things down.',
      'Large v-for lists without virtualization render every node, hurting performance.',
    ],
    optimizations: [
      'Move expensive derivations into computed properties so they cache and re-run only when deps change.',
      'Use stable :key on v-for and consider list virtualization for very long lists.',
      'Use v-once/v-memo for static or rarely-changing subtrees.',
      'Avoid creating new objects/arrays inline in bindings on hot paths.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'v-html renders raw HTML without escaping; using it with untrusted input enables cross-site scripting (XSS).',
      'Dynamic attribute binding to URLs (e.g. :href) with user input can enable javascript: URL injection if not validated.',
    ],
    bestPractices: [
      'Prefer {{ }} text interpolation, which auto-escapes, for any user-controlled content.',
      'If v-html is unavoidable, sanitize the HTML with a vetted library and never trust client input.',
      'Validate/whitelist URL schemes before binding them to href/src.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['declarative-rendering', 'interpolation-expressions'],
    nextConcepts: ['v-bind', 'v-on-events', 'v-if-v-show', 'v-for', 'v-model'],
    dependencyNote:
      'Template syntax is the umbrella concept built on declarative-rendering and interpolation-expressions; it branches into the specific directives (v-bind, v-on, v-if-v-show, v-for, v-model) you learn next. Mastering it unlocks every component template you will write.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a tiny template: <h1>{{ title }}</h1> and <button @click="inc">.',
      'Draw an arrow to a render() function the compiler produces.',
      'Show that reading title inside render() registers it as a reactive dependency.',
      'When title changes, draw the effect re-running → new vnodes → diff/patch → DOM.',
      'Conclude: "Templates are declarative sugar over a render function; they describe WHAT the UI is, and Vue computes HOW to update it."',
    ],
    diagram: `  <h1>{{ title }}</h1>  ──compile──►  render(){ return h('h1', title) }
        @click="inc"                         │ reads title (tracked)
                                             ▼
            title changes ──► effect re-runs ──► diff/patch ──► DOM`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue template syntax is declarative HTML with superpowers: {{ }} interpolation for text, directives (v-bind/:, v-on/@, v-model, v-if/v-show, v-for, v-html) for behavior, and binding shorthands. Bindings accept single JS expressions, not statements. The compiler turns the template into a render function with optimizations like static hoisting and patch flags; at runtime it runs in a reactive effect, so changing data re-renders and patches only the dynamic parts. Avoid side effects in templates and never v-html untrusted content.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Vue\'s template syntax is a declarative, HTML-based DSL for describing the UI as a function of state. The two core pieces are text interpolation with double mustaches — {{ expression }} — which renders an escaped string of a single JavaScript expression, and directives, which are special v-prefixed attributes. The common directives are v-bind for one-way attribute binding with the colon shorthand, v-on for events with the at shorthand, v-model for two-way binding, v-if and v-show for conditional rendering, v-for for lists (which needs a stable :key), and v-html for raw HTML. Bindings only accept expressions, not statements, and you should never put side effects in them because the template runs inside a reactive render effect that can re-run often. Under the hood, templates are compiled, not interpreted: the compiler parses the template into an AST and generates a render function that returns virtual DOM. It applies optimizations — it hoists static nodes so they\'re created once, and attaches patch flags marking exactly which bindings can change. At runtime the render function executes inside a reactive effect, so any reactive value it reads is tracked as a dependency; when that value changes, the effect re-runs, produces a new vnode tree, and Vue diffs and patches only the parts that actually changed. Two important caveats: prefer {{ }} over v-html because v-html bypasses escaping and is an XSS risk, and always give v-for a stable key so list diffing preserves the right DOM and component state. This compile-time-plus-reactivity model is what makes Vue templates both readable and fast.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Templates (compiled, optimizable, statically analyzable) vs render functions/JSX (maximum flexibility, less optimization) — templates win for the common case.',
      'Restricting to expressions keeps templates declarative and safe but pushes complex logic into computed/methods, which is the intended design.',
      'Auto-escaping in {{ }} is safe-by-default; v-html trades safety for flexibility and must be used carefully.',
    ],
    edgeCases: [
      'Dynamic arguments (:[name]) must resolve to a string or null; in-DOM templates lowercase attribute names, breaking camelCase args.',
      'In-DOM (non-SFC) templates are subject to HTML parsing rules (e.g. <table> child restrictions, self-closing tags ignored).',
      'v-for and v-if on the same element: v-if has higher precedence in Vue 3, which can be surprising — prefer a <template> wrapper.',
      'Whitespace handling and text vs element interpolation differ between compiler options.',
    ],
    runtimeBehavior: [
      'The render function is a reactive effect; only the reactive values actually read become dependencies, so unrelated state changes don\'t re-render it.',
      'Patch flags and the block tree let the diff skip static subtrees entirely, making most updates O(dynamic nodes), not O(total nodes).',
      'Cached event handlers (compiler cacheHandlers) avoid re-creating inline handler functions each render.',
    ],
    scalability: [
      'For very large lists, even optimized templates need virtualization; the compiler can\'t avoid creating thousands of vnodes.',
      'Keeping templates free of heavy inline logic keeps re-render cost predictable as components grow.',
    ],
    productionConcerns: [
      'SSR requires deterministic templates; non-deterministic expressions cause hydration mismatches.',
      'XSS via v-html is a real production incident class — enforce sanitization and lint against unsafe v-html.',
      'Index-as-key bugs in dynamic lists are a frequent source of state-leak issues; code review for stable keys.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '{{ }} = text interpolation, single expression, auto-escaped.',
    'Directives are v-prefixed: v-bind, v-on, v-model, v-if, v-show, v-for, v-html.',
    'Shorthands: : = v-bind, @ = v-on, # = v-slot.',
    'Bindings take EXPRESSIONS, not statements; no side effects.',
    'Templates compile to render functions (virtual DOM).',
    'Optimizations: static hoisting, patch flags, cached handlers.',
    'v-for needs a stable :key (not the index for reorderable lists).',
    'Dynamic args: :[name] / @[event].',
    'Modifiers: @submit.prevent, @keyup.enter, :class binding objects.',
    'v-html = raw HTML, XSS risk — only trusted/sanitized content.',
    'Use computed/methods for logic; keep templates declarative.',
    'v-once / v-memo for static or rarely-changing subtrees.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a template that shows a greeting using interpolation and binds an image src to a reactive variable.',
      hint: 'Use {{ }} and :src.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <p>Hi, {{ name }}!</p>\n  <img :src="avatar" :alt="name" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst name = ref(\'Sam\')\nconst avatar = ref(\'/sam.png\')\n</script>',
        explanation: [
          '{{ name }} interpolates the reactive name into text.',
          ':src and :alt bind attributes to reactive values.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Render a list with v-for, only show it when it is non-empty using v-if, and handle a click per item.',
      hint: 'Combine v-if, v-for with :key, and @click.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <ul v-if="items.length">\n    <li v-for="i in items" :key="i.id" @click="pick(i)">{{ i.label }}</li>\n  </ul>\n  <p v-else>No items</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst items = ref([{ id: 1, label: \'One\' }])\nfunction pick(i: { id: number; label: string }) { console.log(i.label) }\n</script>',
        explanation: [
          'v-if on the <ul> guards against rendering an empty list.',
          'v-for has a stable :key and an @click passing the current item.',
          'v-else provides the empty-state fallback.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A template re-renders slowly because it calls an expensive format function in {{ }} for every item. Refactor it.',
      hint: 'Precompute a derived array with computed.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <li v-for="row in formattedRows" :key="row.id">{{ row.display }}</li>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst rows = ref([{ id: 1, value: 1234.5 }])\nconst formattedRows = computed(() =>\n  rows.value.map(r => ({ id: r.id, display: expensiveFormat(r.value) }))\n)\nfunction expensiveFormat(n: number) { return n.toFixed(2) }\n</script>',
        explanation: [
          'Calling expensiveFormat inside {{ }} runs on every render for every row.',
          'A computed property caches the formatted result and only recomputes when rows change.',
          'The template now references precomputed row.display, keeping rendering cheap.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a comment renderer that shows user comment text safely, but renders an admin "announcement" HTML banner. Explain the security difference.',
      hint: 'User text via {{ }}; trusted announcement via sanitized v-html.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- announcement is server-controlled / sanitized -->\n  <div v-html="sanitizedAnnouncement"></div>\n\n  <!-- user comments must be escaped -->\n  <p v-for="c in comments" :key="c.id">{{ c.text }}</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst sanitizedAnnouncement = ref(\'<strong>System maintenance tonight</strong>\')\nconst comments = ref([{ id: 1, text: \'<script>alert(1)<\\/script> nice post\' }])\n</script>',
        explanation: [
          'User comment text uses {{ }}, so the <script> in it is rendered as harmless escaped text, not executed.',
          'The admin announcement uses v-html, which is acceptable only because it is server-controlled and sanitized.',
          'The core rule: never v-html untrusted input; always escape user content with interpolation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Template syntax is the most-used Vue skill — you write it in every component. Explaining that templates compile to render functions tied to reactivity separates people who copy snippets from those who understand Vue.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask you to list directives and explain {{ }}. Product companies (Zoho, Flipkart, Razorpay) ask about v-for keys, dynamic bindings, and v-html XSS. FAANG-level interviews probe the compile-to-render-function pipeline, patch flags, and why side effects in templates are wrong.',
    whatInterviewersExpect:
      'They expect fluent directive knowledge, the expressions-not-statements rule, awareness of the v-html XSS risk, the v-for key requirement, and a clear explanation that templates are compiled into reactive render functions.',
  },
}

export default templateSyntax
