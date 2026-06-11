import type { ConceptLesson } from '../../../types/lesson'

const vBind: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-bind',
  name: 'v-bind',
  category: 'templates',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'v-bind is how you connect any HTML attribute, DOM property, or component prop to your reactive data — without it, your UI would be static.',
    'It is one of the two most-used directives (with v-on), so fluency with it and its colon shorthand is table stakes for any Vue role.',
    'Understanding v-bind explains attributes vs DOM properties, boolean attributes, class/style binding, object spreading with v-bind="obj", and dynamic arguments :[key].',
    'Getting v-bind right prevents real bugs: stale attributes, broken boolean attributes, and accidental security holes when binding URLs or HTML attributes from user input.',
    'Interviewers use v-bind to probe whether you understand one-way data flow, the : shorthand, and how Vue decides between setting an attribute vs a property.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-bind is like a wire that connects a light switch to a bulb so the bulb always shows whatever the switch says.',
    story: [
      'Imagine a picture frame on the wall, and a photo box on your desk. You want the frame to always show whatever photo is in the box.',
      'Instead of printing the photo and taping it to the frame, you run a magic wire from the box to the frame.',
      'Now whenever you change the photo in the box, the frame instantly shows the new one. You never touch the frame again.',
      'v-bind is that wire. You write :src on an image to wire its picture to a data box, and whenever the box changes, the picture changes too — automatically.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally an HTML attribute is a fixed string, like <img src="cat.png">. v-bind lets the value come from your data instead.',
    'You write v-bind:src="photo", or use the shorthand :src="photo". Now the image source equals whatever the photo variable holds.',
    'It works one way: data flows from your component into the attribute. When the data changes, Vue updates the attribute for you.',
    'You can bind almost anything: :href, :class, :style, :disabled, and component props. There is even a shortcut :class="{ active: isOn }" to toggle classes based on conditions.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-bind dynamically binds an HTML attribute, DOM property, or component prop to a JavaScript expression. The shorthand is a colon (:attr="expr"). It is one-way: data flows from component state to the DOM/child.',
    how: 'The compiler turns :attr="expr" into code that evaluates expr and applies it during patch. Vue decides whether to set it as a DOM property or an HTML attribute, handles boolean attributes (omitting them when falsy), and special-cases class and style for merging.',
    why: 'It is the core mechanism for making markup reactive — connecting state to attributes, passing props to child components, and conditionally applying classes/styles.',
    code: {
      label: 'Common v-bind usages',
      lang: 'vue',
      code: '<template>\n  <img :src="photo" :alt="caption" />\n  <a :href="url" :title="caption">Link</a>\n  <button :disabled="isBusy">Save</button>\n  <input :value="text" />\n  <ChildCard :title="caption" :count="items.length" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nimport ChildCard from \'./ChildCard.vue\'\nconst photo = ref(\'/cat.png\')\nconst caption = ref(\'A cat\')\nconst url = ref(\'/profile\')\nconst isBusy = ref(false)\nconst text = ref(\'hello\')\nconst items = ref([1, 2, 3])\n</script>',
      explanation: [
        ':src and :alt bind attributes to reactive values (shorthand for v-bind:).',
        ':disabled binds a boolean attribute — Vue omits the attribute entirely when isBusy is false.',
        ':value sets the input value as a DOM property (one-way; pair with @input or v-model for two-way).',
        ':title and :count pass PROPS to a child component — same syntax, props instead of attributes.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-bind is a Vue directive that reactively binds one or more attributes, DOM properties, or component props to JavaScript expressions, with the colon (:) shorthand. It supports a single argument (:href="x"), dynamic arguments (:[name]="x"), object binding (v-bind="{ id, class: c }") to apply multiple bindings at once, and the .prop/.attr/.camel modifiers. The runtime resolves whether to assign a DOM property or set an attribute, special-cases class and style (merging strings, arrays, and objects), and treats boolean attributes by presence/absence. Binding is one-way (component → DOM/child); it is the foundation of one-way data flow and prop passing.',

  // 7. Internal Working
  internalWorking: [
    'The compiler parses :attr="expr" (or v-bind:attr) into a props object entry in the generated vnode, with a patch flag marking which props are dynamic.',
    'During render the expression is evaluated in the component scope; reactive reads register dependencies so the binding updates when they change.',
    'At patch time, patchProp inspects the key: it checks shouldSetAsProp to decide between el[key] = value (DOM property) and el.setAttribute(key, value) (attribute), based on element type and key.',
    'Boolean attributes (disabled, checked, etc.) are set/removed by truthiness; binding null/false removes the attribute entirely rather than rendering attr="false".',
    'class and style are special-cased: the runtime normalizes strings/arrays/objects and merges them (including with static class/style on the same element) before writing.',
    'For v-bind="object", each key/value is spread into the props object; for components, keys matching declared props become props and the rest fall through as attributes (attribute fallthrough).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   :src="photo"            COMPILER            PATCH (runtime)
        │          ──► props: { src: photo } ──► shouldSetAsProp?
        │                    │ (patch flag: PROPS)      ├─ yes ► el.src = photo
   reactive read            ▼                           └─ no  ► el.setAttribute
   (photo tracked)    photo changes ──► re-render ──► patch updates src

   class/style are SPECIAL (merged):
     static class="card" + :class="{ active }"  ──► "card active"

   one-way only:  component state ───────────────► attribute / prop
                  (DOM does NOT write back; use v-model for two-way)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — attribute and boolean binding',
      lang: 'vue',
      code: '<template>\n  <img :src="avatar" :alt="name" />\n  <button :disabled="!canSubmit">Submit</button>\n  <input :placeholder="hint" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst avatar = ref(\'/me.png\')\nconst name = ref(\'Lee\')\nconst canSubmit = ref(false)\nconst hint = ref(\'Enter name\')\n</script>',
      explanation: [
        ':src binds a normal attribute to a reactive value.',
        ':disabled is a boolean attribute — when !canSubmit is false, Vue removes the attribute entirely.',
        ':placeholder shows the colon shorthand replacing v-bind:placeholder.',
        'All update automatically when their bound data changes.',
      ],
    },
    intermediate: {
      label: 'Intermediate — class and style binding',
      lang: 'vue',
      code: '<template>\n  <div\n    class="card"\n    :class="{ active: isActive, \'card--error\': hasError }"\n    :style="{ color: textColor, fontSize: size + \'px\' }"\n  >\n    Bound classes and styles\n  </div>\n  <div :class="[base, isActive ? \'on\' : \'off\']"></div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst isActive = ref(true)\nconst hasError = ref(false)\nconst textColor = ref(\'#16a34a\')\nconst size = ref(16)\nconst base = ref(\'box\')\n</script>',
      explanation: [
        'Object syntax for :class toggles classes by truthiness; static class="card" is merged in automatically.',
        ':style with an object maps CSS properties (camelCase) to reactive values.',
        'Array syntax for :class lets you combine static and conditional classes.',
        'Class/style binding is the most common real-world use of v-bind after props.',
      ],
    },
    advanced: {
      label: 'Advanced — dynamic args, object binding, and modifiers',
      lang: 'vue',
      code: '<template>\n  <!-- bind multiple attrs at once -->\n  <a v-bind="linkAttrs">Profile</a>\n\n  <!-- dynamic argument: attribute name from data -->\n  <input :[fieldAttr]="fieldValue" />\n\n  <!-- force DOM property with .prop, force attribute with .attr -->\n  <div :innerHTML.prop="safeHtml"></div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst linkAttrs = ref({ href: \'/me\', title: \'My profile\', target: \'_blank\', rel: \'noopener\' })\nconst fieldAttr = ref(\'placeholder\')\nconst fieldValue = ref(\'Type here\')\nconst safeHtml = ref(\'<b>ok</b>\')\n</script>',
      explanation: [
        'v-bind="linkAttrs" spreads an object so every key becomes a binding — great for forwarding attributes.',
        ':[fieldAttr] is a dynamic argument: the attribute being bound is itself computed at runtime.',
        '.prop forces assignment as a DOM property; .attr forces an attribute — useful when Vue\'s default heuristic isn\'t what you need.',
        'rel="noopener" with target="_blank" is the safe pattern to avoid reverse-tabnabbing.',
      ],
    },
    realProject: {
      label: 'Real project — a reusable button forwarding attributes and props',
      lang: 'vue',
      code: '<template>\n  <button\n    class="btn"\n    :class="[`btn--${variant}`, { \'btn--loading\': loading }]"\n    :disabled="disabled || loading"\n    :aria-busy="loading"\n    v-bind="$attrs"\n  >\n    <slot />\n  </button>\n</template>\n\n<script setup lang="ts">\nwithDefaults(defineProps<{ variant?: string; disabled?: boolean; loading?: boolean }>(), {\n  variant: \'primary\',\n  disabled: false,\n  loading: false,\n})\n</script>',
      explanation: [
        ':class combines a dynamic variant class with a conditional loading class.',
        ':disabled binds a boolean computed from two props; :aria-busy improves accessibility.',
        'v-bind="$attrs" forwards leftover attributes (like @click, id, data-*) onto the real button — the key reusable-component pattern.',
        'This exact shape is how design-system buttons forward native attributes to the underlying element.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does v-bind do and what is its shorthand?',
      answer: 'v-bind dynamically binds an attribute, DOM property, or component prop to a JavaScript expression, so it updates when the data changes. The shorthand is a colon: :attr="expr" instead of v-bind:attr="expr".',
      explanation: 'A complete answer mentions all three targets (attribute/property/prop) and that it is one-way.',
    },
    {
      level: 'beginner',
      question: 'How do you conditionally apply a CSS class with v-bind?',
      answer: 'Use object syntax: :class="{ active: isActive }" applies the "active" class when isActive is truthy. You can also use an array: :class="[base, isOn ? \'on\' : \'off\']". Static class and :class are merged automatically.',
      explanation: 'Class/style binding is the single most common v-bind use; knowing object and array syntax is expected.',
    },
    {
      level: 'intermediate',
      question: 'How does Vue decide whether to set a DOM property or an HTML attribute?',
      answer: 'At patch time it checks the element and key via a heuristic (shouldSetAsProp): for known DOM properties on the element it assigns el[key] = value, otherwise it uses setAttribute. You can force either with the .prop or .attr modifier.',
      explanation: 'This attribute-vs-property nuance separates beginners from people who understand the runtime.',
    },
    {
      level: 'intermediate',
      question: 'What happens when you bind a boolean attribute like :disabled to false?',
      answer: 'Vue removes the attribute entirely rather than rendering disabled="false". Boolean attributes are present/absent based on truthiness; null, undefined, and false all remove them.',
      explanation: 'A frequent gotcha — people expect disabled="false" to mean enabled in plain HTML, which it does not.',
    },
    {
      level: 'advanced',
      question: 'What is v-bind="object" and when do you use it?',
      answer: 'It spreads an object so each key/value becomes a separate binding on the element/component in one go. It is used to forward many attributes at once — e.g. v-bind="$attrs" to pass through fallthrough attributes, or binding a config object of props.',
      explanation: 'Mentioning $attrs and attribute fallthrough shows real component-design knowledge.',
    },
    {
      level: 'senior',
      question: 'What are the security considerations when using v-bind?',
      answer: 'Binding untrusted data into URL attributes (:href, :src) can allow javascript: or data: URL injection; binding into :innerHTML.prop reintroduces XSS; and target="_blank" without rel="noopener" enables reverse-tabnabbing. Validate URL schemes, never bind unsanitized HTML, and always pair _blank with noopener.',
      explanation: 'Senior signal: connecting v-bind to concrete XSS/tabnabbing vectors and the mitigations.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between an attribute and a DOM property?',
    'How do :class object syntax and array syntax differ?',
    'What does v-bind="$attrs" do and how does fallthrough work?',
    'Why does :disabled="false" remove the attribute instead of keeping it?',
    'What do the .prop, .attr, and .camel modifiers do?',
    'How is v-bind one-way, and how do you get two-way binding? (v-model)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Writing a static attribute when you meant to bind, e.g. src="photo" instead of :src="photo".',
      why: 'Without the colon, "photo" is the literal string, not the variable\'s value.',
      fix: 'Add the colon (or v-bind:) to bind to the expression.',
    },
    {
      mistake: 'Expecting :disabled="false" to render disabled="false".',
      why: 'Boolean attributes are present/absent; false removes the attribute (which is correct HTML semantics).',
      fix: 'Trust the boolean: false = enabled, true = disabled; no need for a string.',
    },
    {
      mistake: 'Binding untrusted user input to :href, :src, or :innerHTML.prop.',
      why: 'It can enable javascript: URLs or XSS injection.',
      fix: 'Validate/whitelist URL schemes, sanitize HTML, and avoid binding raw HTML from users.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Every dynamic attribute and prop in an app uses v-bind; class/style binding and v-bind="$attrs" forwarding are everyday patterns in component design.' },
    { area: 'Component library', detail: 'Reusable components forward native attributes via v-bind="$attrs" onto their root element and bind dynamic variant classes via :class, so consumers can pass id, data-*, and aria-* transparently.' },
    { area: 'Nuxt', detail: 'Nuxt components bind meta/SEO attributes and links dynamically (e.g. :href, :to), and use v-bind to pass through route and layout props.' },
    { area: 'SSR', detail: 'Bound attributes are serialized into the server-rendered HTML; deterministic bindings are required so the client hydration matches and boolean attributes serialize correctly.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Bound props are patch-flagged, so updates touch only the changed attributes/props, not the whole element.',
      'Class/style merging is handled efficiently in the runtime without manual DOM thrash.',
    ],
    bad: [
      'Creating new objects/arrays inline for :class/:style on hot paths allocates each render and defeats some caching.',
      'v-bind="bigObject" where the object identity changes every render forces re-diffing all keys.',
    ],
    optimizations: [
      'Hoist or memoize stable class/style objects with computed instead of inline literals.',
      'Bind only what changes; avoid spreading huge objects that re-create each render.',
      'Use the array :class form to combine static + conditional without rebuilding strings.',
      'Prefer static class for unchanging classes and reserve :class for the dynamic parts.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Binding untrusted values to :href/:src can allow javascript:/data: URL injection (XSS).',
      'Using :innerHTML.prop (or v-html) with user content executes injected markup.',
      'target="_blank" without rel="noopener" exposes the opener window to the linked page (reverse tabnabbing).',
    ],
    bestPractices: [
      'Validate and whitelist URL schemes (http/https/mailto) before binding to href/src.',
      'Never bind unsanitized HTML; prefer text interpolation for user content.',
      'Always add rel="noopener noreferrer" when binding target="_blank".',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'interpolation-expressions'],
    nextConcepts: ['class-style-bindings', 'v-model', 'props', 'attribute-fallthrough'],
    dependencyNote:
      'v-bind builds on template-syntax and interpolation-expressions (same expression grammar). It leads into class-style-bindings (its most common specialization), props/attribute-fallthrough (binding to components), and v-model (which is sugar over a v-bind + v-on pair).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write :src="photo" and note the colon is shorthand for v-bind:.',
      'Draw an arrow to the vnode props { src: photo } with a PROPS patch flag.',
      'At patch, draw the shouldSetAsProp decision: el.src = photo vs setAttribute.',
      'Show photo changing → re-render → only the src updates.',
      'Add :class="{ active }" and note class/style are merged specially; conclude v-bind is one-way state→DOM/prop.',
    ],
    diagram: `  :src="photo" ──► props{ src: photo } ──► shouldSetAsProp?
                                              ├ yes ► el.src = photo
                                              └ no  ► setAttribute
  :class="{active}" + class="card" ──► merged "card active"
  (one-way: state ───► DOM/prop)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-bind reactively binds an attribute, DOM property, or component prop to an expression; the shorthand is a colon (:attr). It is one-way (state → DOM/child). Vue decides property vs attribute at patch time, removes boolean attributes when falsy, and specially merges class and style (string/array/object). Advanced forms: v-bind="object" to spread many bindings (e.g. $attrs), dynamic args :[name], and .prop/.attr/.camel modifiers. Watch security: validate URLs, never bind raw HTML, add rel="noopener" with _blank.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-bind is the directive that makes markup dynamic by binding an attribute, a DOM property, or a component prop to a JavaScript expression, and its shorthand is the colon — so :src="photo" is the same as v-bind:src="photo". It is one-way: data flows from your component state into the DOM or into a child component, and when the state changes, Vue updates the binding. A few mechanics worth knowing. First, Vue decides at patch time whether to set the value as a real DOM property or via setAttribute, using a heuristic based on the element and key; you can override it with the .prop or .attr modifiers. Second, boolean attributes like disabled or checked are present-or-absent based on truthiness — binding false removes the attribute entirely rather than rendering disabled="false". Third, class and style are special-cased: you can pass strings, arrays, or objects, and Vue merges them, including with any static class on the same element, so :class="{ active: isActive }" toggles a class by truthiness. Beyond single bindings, you can write v-bind="someObject" to spread every key as a binding at once — the classic use is v-bind="$attrs" to forward fallthrough attributes like id and data-* onto a component\'s real root element. You can also use dynamic arguments, :[name]="value", where the attribute name itself is computed. Finally, security: because v-bind can write URLs and even innerHTML, you should validate URL schemes before binding to href or src, never bind unsanitized HTML, and always add rel="noopener" when you bind target="_blank". For two-way binding you don\'t use v-bind alone — you use v-model, which is essentially a v-bind plus a v-on event pair.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Letting Vue auto-decide property vs attribute is convenient but occasionally wrong for custom elements — .prop/.attr give explicit control.',
      'v-bind="object" is powerful for forwarding but can obscure exactly what is bound and re-diff everything if the object identity changes each render.',
      'Inline :class/:style objects are readable but allocate per render; computed/static trade a little verbosity for stability.',
    ],
    edgeCases: [
      'Binding to custom elements: by default Vue sets properties for objects/arrays and attributes for primitives, which can surprise — use modifiers.',
      'Dynamic args must resolve to a string or null (null removes the binding); in-DOM templates lowercase them, breaking camelCase.',
      'Order matters with $attrs and inheritAttrs:false — manual v-bind="$attrs" is required to place fallthrough attrs on the right element.',
      'Binding the same attribute statically and dynamically: the dynamic one wins, except class/style which merge.',
    ],
    runtimeBehavior: [
      'Bound props carry patch flags so the diff only re-applies dynamic bindings, skipping static attributes.',
      'Class/style normalization (string/array/object → final string) happens every patch but is cheap relative to layout.',
      'null/undefined/false on boolean attributes triggers removeAttribute, not assignment.',
    ],
    scalability: [
      'On large lists, stable, hoisted class/style objects reduce per-row allocation and GC churn.',
      'Forwarding via $attrs keeps wrapper components thin and scalable instead of redeclaring dozens of pass-through props.',
    ],
    productionConcerns: [
      'URL-binding XSS and _blank tabnabbing are real incident classes — enforce sanitization and rel="noopener" in lint/review.',
      'Attribute fallthrough mistakes (attrs landing on the wrong element) cause subtle a11y/event bugs in design systems.',
      'SSR: ensure boolean and aria attributes serialize deterministically to avoid hydration mismatches.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-bind binds attribute / DOM property / component prop to an expression.',
    'Shorthand: :attr="expr" (= v-bind:attr).',
    'One-way: state → DOM/child (use v-model for two-way).',
    'Boolean attrs: false/null/undefined REMOVE the attribute.',
    ':class object → toggle by truthiness; array → combine; merges with static class.',
    ':style object uses camelCase CSS keys.',
    'v-bind="object" spreads many bindings (e.g. v-bind="$attrs").',
    'Dynamic arg: :[name]="value" (name computed at runtime).',
    'Modifiers: .prop (force property), .attr (force attribute), .camel.',
    'Property vs attribute decided by shouldSetAsProp heuristic.',
    'Security: validate :href/:src URLs, no raw HTML, rel="noopener" with _blank.',
    'Patch-flagged → only changed bindings update.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Bind an image source and alt text to reactive variables, and disable a button while a "saving" flag is true.',
      hint: 'Use :src, :alt, and :disabled.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <img :src="src" :alt="alt" />\n  <button :disabled="saving">Save</button>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst src = ref(\'/img.png\')\nconst alt = ref(\'An image\')\nconst saving = ref(false)\n</script>',
        explanation: [
          ':src and :alt bind attributes to reactive refs.',
          ':disabled binds a boolean — when saving is false, the attribute is removed.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Apply a base class always, an "active" class when selected, and a red text color from a reactive variable.',
      hint: 'Combine static class, :class object, and :style.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <div class="tab" :class="{ active: selected }" :style="{ color }">Tab</div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst selected = ref(true)\nconst color = ref(\'#dc2626\')\n</script>',
        explanation: [
          'Static class="tab" stays applied and merges with :class.',
          ':class="{ active: selected }" toggles "active" by truthiness.',
          ':style binds a reactive CSS color.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build a wrapper <BaseInput> that forwards all native attributes (placeholder, type, etc.) onto its inner <input>.',
      hint: 'Disable automatic inheritance and bind $attrs manually.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <label class="field">\n    <span>{{ label }}</span>\n    <input v-bind="$attrs" />\n  </label>\n</template>\n\n<script setup lang="ts">\ndefineOptions({ inheritAttrs: false })\ndefineProps<{ label: string }>()\n</script>',
        explanation: [
          'inheritAttrs:false stops Vue from auto-placing fallthrough attrs on the root <label>.',
          'v-bind="$attrs" forwards placeholder, type, value, listeners, etc. onto the inner <input>.',
          'This is the standard pattern for transparent wrapper components.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Render a list of user-provided links safely: only allow http/https URLs, and open external links in a new tab without the tabnabbing risk.',
      hint: 'Validate the scheme; add rel="noopener noreferrer".',
      solution: {
        lang: 'vue',
        code: '<template>\n  <a\n    v-for="l in links"\n    :key="l.id"\n    :href="safeHref(l.url)"\n    target="_blank"\n    rel="noopener noreferrer"\n  >{{ l.title }}</a>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst links = ref([{ id: 1, title: \'Site\', url: \'https://example.com\' }])\nfunction safeHref(url: string) {\n  return /^https?:\\/\\//i.test(url) ? url : \'#\'\n}\n</script>',
        explanation: [
          'safeHref whitelists http/https, blocking javascript: and data: URL injection.',
          'rel="noopener noreferrer" with target="_blank" prevents reverse-tabnabbing.',
          'Binding user-controlled URLs always needs validation — never bind raw input directly.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'v-bind is one of the two directives you use constantly. Demonstrating attribute-vs-property nuance, class/style binding, $attrs forwarding, and the security angle marks you as someone who truly understands Vue rendering, not just syntax.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the shorthand and conditional class binding. Product companies (Zoho, Flipkart, Razorpay) ask about $attrs forwarding, boolean attributes, and dynamic args. FAANG-level interviews probe property-vs-attribute resolution and URL/innerHTML security.',
    whatInterviewersExpect:
      'They expect you to bind attributes/props fluently with the colon shorthand, explain object/array class binding, know boolean-attribute behavior, use v-bind="$attrs" for forwarding, and call out the URL/HTML/tabnabbing security pitfalls.',
  },
}

export default vBind
