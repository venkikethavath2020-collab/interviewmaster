import type { ConceptLesson } from '../../../types/lesson'

const interpolationExpressions: ConceptLesson = {
  // 1. Concept Summary
  slug: 'interpolation-expressions',
  name: 'Interpolation & Expressions',
  category: 'templates',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Interpolation ({{ }}) is the very first thing you do in a Vue template — putting dynamic data on the screen — so getting the rules right is foundational.',
    'Knowing that bindings accept a single JavaScript EXPRESSION (not statements) explains why some code works in templates and some doesn\'t, a frequent beginner confusion.',
    'Interpolation auto-escapes its output, which is your first line of defense against XSS — understanding this vs v-html is a real security concern.',
    'Expressions also power attribute bindings and directives, so the same rules apply everywhere; learning them once pays off across the whole template.',
    'Interviewers test this to check you understand the template scope, reactivity tracking, and why heavy logic belongs in computed properties instead of inline expressions.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Interpolation is like a digital scoreboard that copies the number from a counter and shows it on the big screen.',
    story: [
      'Imagine a basketball game with a counter in the back room that knows the score. Up on the wall there is a big screen.',
      'You connect the screen to the counter so it always shows the current score. You do not run to the wall to write the new number — it copies itself.',
      'In Vue, the {{ }} is that connection. You write {{ score }} on your page, and Vue shows whatever the score counter currently holds.',
      'The moment someone scores and the counter changes, the screen updates by itself. You never repaint it — the connection does the work.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In a Vue template you show data by wrapping it in double curly braces: {{ message }}. This is called interpolation.',
    'Inside the braces you can put a small calculation called an expression — like {{ price * 2 }} or {{ user.name }} or {{ isOpen ? "Open" : "Closed" }}.',
    'You can NOT put a whole block of code there, like an if-statement or a loop or a variable declaration — only a single thing that produces a value.',
    'Whatever the expression evaluates to gets shown as plain, safe text. If your data has HTML in it, Vue shows it as literal characters instead of running it, which keeps the page safe.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Interpolation is the {{ }} syntax that renders the result of a single JavaScript expression as escaped text in the DOM. The same kind of expression (not statements) is also what you put inside directive bindings like :prop and @event handlers.',
    how: 'The compiler turns {{ expr }} into a call that converts expr to a string and inserts it as a text node. Because the expression reads reactive state, the render effect tracks it as a dependency and re-renders the text when it changes. Output is HTML-escaped automatically.',
    why: 'It is the simplest, safest way to bind state to the UI. The expression-only rule keeps templates declarative and predictable, and escaping protects against XSS by default.',
    code: {
      label: 'Interpolation and inline expressions',
      lang: 'vue',
      code: '<template>\n  <p>{{ message }}</p>\n  <p>{{ count + 1 }}</p>\n  <p>{{ user.isAdmin ? \'Admin\' : \'User\' }}</p>\n  <p>{{ items.length }} item(s)</p>\n  <p>{{ formatDate(createdAt) }}</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst message = ref(\'Hello\')\nconst count = ref(0)\nconst user = ref({ isAdmin: true })\nconst items = ref([1, 2, 3])\nconst createdAt = ref(Date.now())\nconst formatDate = (t: number) => new Date(t).toLocaleDateString()\n</script>',
      explanation: [
        '{{ message }} renders a reactive value as text.',
        '{{ count + 1 }} shows you can do arithmetic — it is an expression.',
        '{{ user.isAdmin ? ... }} uses a ternary, which is allowed (it returns a value).',
        '{{ formatDate(createdAt) }} calls a method — also allowed, since it evaluates to a value.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Interpolation in Vue is text binding via the mustache syntax {{ expression }}, where expression is exactly one JavaScript expression evaluated in the component\'s render scope and coerced to a string. The rendered text is HTML-escaped, preventing markup injection. The same expression grammar governs directive values (v-bind, v-on handlers, etc.). Statements, declarations, control flow, and (by default) most globals are disallowed; only a small allowlist of globals (e.g. Math, Date) plus component-exposed bindings are accessible. Each expression\'s reactive reads are tracked by the render effect, so the bound text updates automatically when dependencies change.',

  // 7. Internal Working
  internalWorking: [
    'The template compiler parses {{ expr }} into an interpolation node and wraps it as toDisplayString(expr) in the generated render function.',
    'It validates that expr is a single expression; statements (if/for/let) produce a compile error because the generated code would be invalid in expression position.',
    'Identifiers in the expression are resolved against the render scope: component setup bindings, props, and a small global allowlist (Math, Date, etc.) — not arbitrary window globals.',
    'When the render function runs inside its reactive effect, reading reactive sources in the expression registers them as dependencies (Proxy get traps call track).',
    'toDisplayString stringifies the value (objects via JSON, null/undefined to empty) and the runtime inserts it as a text node, HTML-escaped, so embedded markup is shown literally.',
    'On dependency change, the effect re-runs and the patch step updates only that text node (a patch-flagged dynamic text), not the whole element.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   {{ price * qty }}        COMPILER              RUNTIME
        │            ──► toDisplayString(price * qty)
        │                      │ reads price, qty (tracked)
        ▼                      ▼
   render scope:         text node in DOM (escaped)
   { price, qty, Math,        ▲
     Date, ...allowlist }     │ price changes ──► effect re-runs
                              └── updates ONLY this text node

   ALLOWED: {{ a + b }}  {{ cond ? x : y }}  {{ fn(x) }}  {{ obj.prop }}
   NOT:     {{ let x=1 }}  {{ if(a){} }}  {{ for(...) }}  (statements)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — text vs expression',
      lang: 'vue',
      code: '<template>\n  <h2>{{ title }}</h2>\n  <p>Total: {{ price * quantity }}</p>\n  <p>{{ greeting.toUpperCase() }}</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst title = ref(\'Cart\')\nconst price = ref(50)\nconst quantity = ref(3)\nconst greeting = ref(\'hello\')\n</script>',
      explanation: [
        '{{ title }} is a plain value reference.',
        '{{ price * quantity }} computes a value inline — a valid expression.',
        '{{ greeting.toUpperCase() }} calls a string method, which returns a value.',
        'All three are expressions; each updates automatically when its data changes.',
      ],
    },
    intermediate: {
      label: 'Intermediate — expressions in attributes and the allowlist',
      lang: 'vue',
      code: '<template>\n  <!-- expressions also live inside bindings -->\n  <progress :value="done" :max="total"></progress>\n  <span>{{ Math.round((done / total) * 100) }}%</span>\n  <time :datetime="iso">{{ new Date(iso).toLocaleString() }}</time>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst done = ref(40)\nconst total = ref(100)\nconst iso = ref(\'2026-06-11T10:00:00Z\')\n</script>',
      explanation: [
        'The same expression grammar applies inside :value, :max, and {{ }}.',
        'Math and Date are on Vue\'s global allowlist, so Math.round and new Date work.',
        'Arbitrary globals (e.g. window, fetch) are NOT available by default in expressions.',
        'This keeps templates portable and avoids accidental coupling to environment globals.',
      ],
    },
    advanced: {
      label: 'Advanced — why heavy logic should move to computed',
      lang: 'vue',
      code: '<template>\n  <!-- AVOID: complex/expensive logic inline; runs every render -->\n  <!-- <li v-for="u in users.filter(u => u.active).sort(byName)"> ... -->\n\n  <!-- PREFER: precompute with computed -->\n  <li v-for="u in activeSorted" :key="u.id">{{ u.name }}</li>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\ninterface User { id: number; name: string; active: boolean }\nconst users = ref<User[]>([])\nconst activeSorted = computed(() =>\n  users.value.filter(u => u.active).sort((a, b) => a.name.localeCompare(b.name))\n)\n</script>',
      explanation: [
        'You CAN write filter/sort inline, but it re-runs on every render with no caching.',
        'A computed property caches the result and recomputes only when users changes.',
        'Templates should read derived values, not derive them — keeps rendering cheap and readable.',
        'This is the single biggest expression-related performance lesson.',
      ],
    },
    realProject: {
      label: 'Real project — an order summary line',
      lang: 'vue',
      code: '<template>\n  <div class="order">\n    <span>{{ order.customer.name }}</span>\n    <span>{{ order.items.length }} items</span>\n    <span>{{ currency(order.total) }}</span>\n    <span :class="statusClass">{{ order.status.toUpperCase() }}</span>\n    <small>{{ order.paid ? \'Paid\' : \'Pending — \' + daysLeft + \'d\' }}</small>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { computed } from \'vue\'\nconst props = defineProps<{ order: { customer: { name: string }; items: unknown[]; total: number; status: string; paid: boolean; dueInDays: number } }>()\nconst currency = (n: number) => new Intl.NumberFormat(\'en-IN\', { style: \'currency\', currency: \'INR\' }).format(n)\nconst daysLeft = computed(() => Math.max(0, props.order.dueInDays))\nconst statusClass = computed(() => \'status--\' + props.order.status)\n</script>',
      explanation: [
        'Realistic templates mix property access, method calls, ternaries, and string concatenation — all expressions.',
        'Formatting (currency) and derived values (daysLeft, statusClass) are pulled into helpers/computed.',
        'Interpolation auto-escapes, so even a malicious customer name renders as safe text.',
        'This is exactly how a typical dashboard/order row is written in production Vue.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What can you put inside {{ }} in a Vue template?',
      answer: 'A single JavaScript expression — something that evaluates to a value: property access, arithmetic, ternaries, method calls, template-allowed globals like Math/Date. You cannot put statements like if, for, or variable declarations.',
      explanation: 'The expression-vs-statement distinction is the heart of the question.',
    },
    {
      level: 'beginner',
      question: 'Is interpolation output safe from HTML injection?',
      answer: 'Yes. {{ }} HTML-escapes its output, so any markup in the data is rendered as literal text, not executed. To render raw HTML you must explicitly use v-html (which is unsafe with untrusted input).',
      explanation: 'Connecting interpolation safety to the v-html risk shows security awareness.',
    },
    {
      level: 'intermediate',
      question: 'Can you access window or arbitrary globals inside a template expression?',
      answer: 'No. Template expressions only see the component\'s exposed bindings (setup state, props) plus a small allowlist of globals such as Math and Date. Arbitrary globals like window or fetch are not available by default.',
      explanation: 'This shows you understand the sandboxed render scope, not just syntax.',
    },
    {
      level: 'intermediate',
      question: 'Why is calling a method inside {{ }} sometimes a performance concern?',
      answer: 'Because the expression re-runs on every render of that component, with no caching. If the method is expensive, you pay that cost each time. A computed property caches and only recomputes when its reactive dependencies change.',
      explanation: 'The computed-vs-method-in-template tradeoff is a classic.',
    },
    {
      level: 'advanced',
      question: 'How does Vue know to update an interpolation when data changes?',
      answer: 'The render function runs inside a reactive effect. When the interpolation expression reads a reactive value, the Proxy get trap records that value as a dependency of the effect. When the value changes, its setter triggers the effect to re-run, and the patch step updates just that text node.',
      explanation: 'Tying interpolation to track/trigger and patch flags is a strong reactivity signal.',
    },
    {
      level: 'senior',
      question: 'What are the failure modes of complex inline expressions, and how do you design around them?',
      answer: 'Complex inline expressions hurt readability, re-run every render (no memoization), are hard to test, and can hide side effects. The design principle is "templates declare, logic lives in computed/methods/composables." Push derivation into computed (cached, testable), keep templates to simple value reads and presentational ternaries.',
      explanation: 'Senior signal: framing it as a separation-of-concerns and testability/perf design rule, not just style.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between {{ }} and v-html?',
    'Why can\'t you use an if-statement inside {{ }}? (statements aren\'t expressions)',
    'Which globals are available inside template expressions?',
    'When should logic move from a template expression into a computed property?',
    'How does interpolation get re-rendered reactively?',
    'How are objects/arrays rendered when interpolated directly?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Trying to use statements (if/for/let/assignment) inside {{ }} or a binding.',
      why: 'Templates allow only a single expression; statements produce a compile error or unexpected behavior.',
      fix: 'Use ternaries or logical operators for simple branching, and move real control flow into computed/methods or v-if/v-for.',
    },
    {
      mistake: 'Doing expensive filtering/sorting/formatting inline in the template.',
      why: 'The expression re-runs on every render with no caching, hurting performance.',
      fix: 'Move it into a computed property so it caches and recomputes only when dependencies change.',
    },
    {
      mistake: 'Assuming window/global functions are available in expressions.',
      why: 'Template expressions are sandboxed to component bindings plus a small allowlist (Math, Date).',
      fix: 'Expose what you need from setup (a method or computed) and reference that instead.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Interpolation is in virtually every component to display state; teams keep expressions simple and push formatting/derivation into computed properties or composables.' },
    { area: 'Nuxt', detail: 'Server-rendered pages interpolate data into the initial HTML; deterministic expressions are required so client hydration matches the server output.' },
    { area: 'Component library', detail: 'Libraries expose formatted output via slots/props and avoid heavy inline expressions so consumers get predictable, testable rendering.' },
    { area: 'SSR', detail: 'Because interpolation auto-escapes, server-rendered user content is safe by default; v-html must be sanitized to keep SSR output safe.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Interpolation compiles to a patch-flagged dynamic text node, so updates touch only that node.',
      'Auto-escaping is cheap and avoids manual sanitization code paths.',
    ],
    bad: [
      'Expensive method calls or filter/sort/map inline re-run on every render.',
      'Interpolating large objects/arrays (stringified) can produce big DOM text and re-stringify each render.',
    ],
    optimizations: [
      'Move derivations into computed properties for caching.',
      'Format/transform data once in computed, then interpolate the result.',
      'Avoid creating new objects/arrays inside expressions on hot paths.',
      'Use v-once for interpolations that never change after first render.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Switching from {{ }} to v-html to render formatted content reintroduces XSS because v-html does not escape.',
      'Interpolating into URL/attribute contexts via bindings (e.g. :href) can allow javascript: URLs if values are untrusted.',
    ],
    bestPractices: [
      'Default to {{ }} for any user-controlled text — it escapes automatically.',
      'Only use v-html with trusted or sanitized HTML; never with raw user input.',
      'Validate URL schemes before binding them to href/src.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'declarative-rendering'],
    nextConcepts: ['v-bind', 'computed', 'class-style-bindings'],
    dependencyNote:
      'Interpolation and expressions are the entry point of template-syntax and declarative-rendering. The same expression grammar underlies v-bind and class-style-bindings, and the natural next step is computed, where heavy expression logic belongs.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write {{ price * qty }} on the board and label it "single expression".',
      'Next to it write {{ if (x) {...} }} and cross it out — "statements not allowed".',
      'Draw the compiled form: toDisplayString(price * qty) inside render().',
      'Show price/qty being tracked as dependencies; when price changes, only this text node updates.',
      'Conclude: "Interpolation is escaped text from one expression, tracked reactively; heavy logic goes to computed."',
    ],
    diagram: `  {{ price * qty }} ──► toDisplayString(price * qty)  (escaped text node)
                              │ tracks price, qty
  {{ if(x){} }}  ✗  statement (compile error)
  price changes ──► re-run ──► patch ONLY this text node`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Interpolation is the {{ }} syntax that renders a single JavaScript expression as escaped text. Expressions — not statements — are also what go inside directive bindings. The render scope is sandboxed to component bindings plus a small global allowlist (Math, Date). Reads are tracked reactively, so the text updates when data changes, and output is auto-escaped (safe vs XSS, unlike v-html). Keep expressions simple; move expensive or complex logic into computed properties so it caches.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Interpolation is Vue\'s most basic binding: you wrap a value in double mustaches, {{ expression }}, and Vue renders it as text. The crucial rule is that what goes inside is a single JavaScript expression — something that produces a value — not a statement. So property access, arithmetic, ternaries, logical operators, and method calls are fine; if-statements, for-loops, and variable declarations are not, because the compiler emits the expression in a position where statements would be invalid. The same expression grammar applies to directive values like :prop and @event handlers, so once you learn it for interpolation, it carries everywhere. Two important properties: first, the expression runs in a sandboxed render scope — it can see your component\'s setup bindings and props plus a small allowlist of globals like Math and Date, but not arbitrary globals like window. Second, interpolation auto-escapes its output, so any HTML inside the data is rendered as literal text. That makes {{ }} safe against XSS by default, which is exactly why v-html — which does not escape — is the dangerous alternative you only use with trusted, sanitized content. Reactively, the render function runs inside an effect, so reading a reactive value in the expression tracks it as a dependency; when it changes, the effect re-runs and Vue patches just that text node. The main performance pitfall is putting expensive logic — filtering, sorting, formatting — directly in an expression, because it re-runs every render with no caching. The fix and the design principle is: templates declare, logic lives in computed properties or methods. Push derivations into computed, which caches and only recomputes when its dependencies change, and keep the template to simple, readable value reads.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Inline expressions are convenient but uncached and untestable; computed properties are cached and testable — prefer computed for anything non-trivial.',
      'Auto-escaping is safe-by-default but means you must deliberately opt into v-html for rich content, accepting its risk.',
      'A restricted render scope improves portability/safety at the cost of not being able to reach arbitrary globals.',
    ],
    edgeCases: [
      'Interpolating an object renders it via JSON-like stringification, which is rarely what you want.',
      'null/undefined render as empty strings, which can mask missing data.',
      'Optional chaining and nullish coalescing are supported in expressions and are the idiomatic way to guard nested access.',
      'In-DOM templates may mangle expressions due to HTML attribute parsing; SFC templates avoid this.',
    ],
    runtimeBehavior: [
      'Only the reactive values actually read by an expression become dependencies — unrelated state changes don\'t re-run it.',
      'Interpolation nodes are patch-flagged as dynamic text, so the diff updates only the text content.',
      'Method calls in expressions are re-evaluated each render because Vue can\'t know they are pure.',
    ],
    scalability: [
      'In large templates, pushing logic into computed/composables keeps re-render cost proportional to actual dynamic data.',
      'For lists, precomputing a derived array once (computed) beats per-row inline transforms that run for every item every render.',
    ],
    productionConcerns: [
      'SSR requires expressions to be deterministic; non-deterministic ones (Date.now in a way that differs server/client) cause hydration mismatches.',
      'XSS regressions appear when developers swap {{ }} for v-html to get formatting — enforce sanitization and lint rules.',
      'Hard-to-read mega-expressions are a maintainability and bug risk; code review for "logic in template".',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '{{ expr }} = render one JS expression as escaped text.',
    'Expression = produces a value; statements (if/for/let) are NOT allowed.',
    'Allowed: arithmetic, ternary, logical ops, property access, method calls.',
    'Render scope = component bindings + small global allowlist (Math, Date).',
    'No arbitrary globals (window, fetch) in expressions.',
    'Output is HTML-escaped → safe vs XSS (unlike v-html).',
    'Same expression rules apply to :bindings and @handlers.',
    'Reactive reads are tracked → text auto-updates on change.',
    'Expensive inline logic re-runs every render → use computed.',
    'Objects interpolate as JSON-ish; null/undefined → empty string.',
    'Use optional chaining / ?? to guard nested values.',
    'Rule: templates declare, computed/methods compute.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Display a price multiplied by quantity, and a label that says "Free" when the result is 0, otherwise the number.',
      hint: 'Use arithmetic and a ternary inside {{ }}.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <p>{{ price * qty === 0 ? \'Free\' : price * qty }}</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst price = ref(0)\nconst qty = ref(2)\n</script>',
        explanation: [
          'price * qty is an arithmetic expression.',
          'The ternary chooses between "Free" and the computed total — both are values.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Refactor a template that calls a heavy fullName() method in three places into a single cached value.',
      hint: 'Use computed once and reference it.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <h1>{{ fullName }}</h1>\n  <meta :content="fullName" />\n  <title>{{ fullName }}</title>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst first = ref(\'Ada\')\nconst last = ref(\'Lovelace\')\nconst fullName = computed(() => first.value + \' \' + last.value)\n</script>',
        explanation: [
          'A method called in three spots would run three times per render.',
          'computed caches the result and recomputes only when first/last change.',
          'All three usages now read the same cached value.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'A nested property crashes the template when data is still loading (user is null). Make the interpolation safe.',
      hint: 'Use optional chaining and a fallback.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <p>{{ user?.profile?.city ?? \'Loading…\' }}</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst user = ref<null | { profile: { city: string } }>(null)\n</script>',
        explanation: [
          'Optional chaining (?.) avoids throwing when user or profile is null/undefined.',
          'Nullish coalescing (??) supplies a "Loading…" fallback for the empty case.',
          'These operators are valid template expressions and the idiomatic guard.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why {{ comment }} is safe but v-html="comment" is dangerous for user-submitted content.',
      hint: 'One escapes, one does not.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <!-- SAFE: escaped, script shown as text -->\n  <p>{{ comment }}</p>\n\n  <!-- DANGEROUS with user input: executes injected markup -->\n  <!-- <div v-html="comment"></div> -->\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst comment = ref(\'<img src=x onerror=alert(1)>\')\n</script>',
        explanation: [
          'With {{ comment }}, the markup is escaped and rendered as harmless literal text.',
          'With v-html, the same string would be parsed as HTML and the onerror handler would execute — an XSS.',
          'Therefore use interpolation for user content and only v-html for sanitized/trusted HTML.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Interpolation is the first Vue feature you ever use and one you use constantly. Knowing the expression-only rule, the sandboxed scope, auto-escaping, and the computed-vs-inline tradeoff shows you understand the template/reactivity model, not just syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what can go in {{ }}" and "is it safe". Product companies (Zoho, Flipkart, Razorpay) ask about method-in-template performance and optional chaining for loading states. FAANG-level interviews probe the render-effect tracking and the security difference vs v-html.',
    whatInterviewersExpect:
      'They expect you to state that {{ }} renders a single escaped expression, that statements are disallowed, that the scope is sandboxed, that it is XSS-safe unlike v-html, and that expensive logic belongs in computed properties.',
  },
}

export default interpolationExpressions
