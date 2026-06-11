import type { ConceptLesson } from '../../../types/lesson'

const classStyleBindings: ConceptLesson = {
  // 1. Concept Summary
  slug: 'class-style-bindings',
  name: 'Class & Style Bindings',
  category: 'templates',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Dynamic class and style bindings are how you make UI react visually to state — active tabs, error fields, loading spinners, theme switches.',
    ':class supports object and array syntax that makes conditional styling clean and readable instead of building strings by hand.',
    'Vue intelligently MERGES bound classes/styles with the static class/style attribute, which avoids a whole category of bugs.',
    'It is the bridge between reactive state and CSS, and a frequent practical question in front-end interviews.',
    'Knowing the auto-prefixing, array-of-values fallback, and component-class-forwarding behavior separates polished Vue developers from beginners.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Class/style binding is a mood ring for your web page — it changes color and look depending on how the page is feeling (its state).',
    story: [
      'Imagine a ring that changes color based on your mood: red when angry, blue when calm, green when happy.',
      'You do not paint the ring yourself each time — it just knows your mood and shows the right color automatically.',
      'Your web page can work the same way: when something is "active" it glows, when there is an "error" it turns red, when "loading" it dims.',
      'Class and style bindings are the magic that connects your page\'s mood (its data) to how it looks, updating the colors and styles instantly as the mood changes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In HTML you style things with the class and style attributes. In Vue you can make those depend on your data using :class and :style.',
    'You can pass an object like :class="{ active: isActive }" — the "active" class is added only when isActive is true.',
    'You can pass an array to apply several classes, and styles work the same way with :style.',
    'Vue also keeps any plain static class you wrote and merges the dynamic ones in, so you do not lose your base styling.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: ':class and :style are special v-bind cases that accept not just strings but objects and arrays, letting you toggle CSS classes and inline styles based on reactive state, and they merge with any static class/style on the same element.',
    how: 'Object syntax maps name→truthiness ({ active: isActive }); array syntax lists classes/style objects to combine. Vue evaluates these on each render, computes the final class string / style object, merges it with the static attribute, and patches the DOM element\'s className / style.',
    why: 'It expresses conditional styling declaratively and reactively, removing fragile manual string concatenation and keeping appearance in sync with state.',
    code: {
      label: 'Object and array class binding',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst isActive = ref(true)\nconst hasError = ref(false)\nconst theme = ref(\'dark\')\n</script>\n\n<template>\n  <!-- object: toggle by truthiness, merged with static "btn" -->\n  <button class="btn" :class="{ active: isActive, error: hasError }">Save</button>\n\n  <!-- array: combine multiple, including a dynamic value -->\n  <div :class="[\'card\', theme, isActive ? \'open\' : \'closed\']">Box</div>\n</template>',
      explanation: [
        'Object syntax adds each class whose value is truthy; "active" applies, "error" does not.',
        'The static class="btn" is merged with the bound classes automatically.',
        'Array syntax combines a static class, a dynamic theme value, and a ternary.',
        'Both update reactively when the refs change.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    ':class and :style are enhanced bindings where v-bind accepts objects and arrays in addition to strings. For class, object syntax toggles class names by the truthiness of their values and array syntax concatenates entries (each a string, object, or nested array); the result is merged with the element\'s static class. For style, object syntax maps CSS properties (camelCase or kebab-case) to values, supports an array of style objects, auto-prefixes properties needing vendor prefixes, and accepts an array of fallback values for a property. On a component with a single root, bound classes/styles fall through and merge onto that root element.',

  // 7. Internal Working
  internalWorking: [
    'The compiler recognizes class and style as special bindings and routes their values through normalization helpers (normalizeClass / normalizeStyle) at render time.',
    'normalizeClass flattens arrays, evaluates object entries by truthiness, and joins everything into a single space-separated class string.',
    'normalizeStyle flattens style arrays/objects into one style object, normalizing property names; for properties with an array of values it tries each until the browser accepts one (graceful fallback).',
    'The patch step merges these dynamic results with the static class/style baked into the vnode at compile time, producing the final className and style to write.',
    'During DOM patch, Vue diffs the previous and next class/style and applies only the changed properties (patchClass / patchStyle) rather than rewriting the whole attribute.',
    'For properties needing vendor prefixes, Vue checks the element\'s style object and applies the supported prefixed form automatically.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   static attr        dynamic bind            final DOM
   class="btn"   +   :class="{active:T,         class="btn active"
                       error:F}"

   reactive state ─► normalizeClass ─┐
                                     ├─ merge with static ─► patchClass
   array/object   ─► normalizeStyle ─┘                        patchStyle

   :style=[{color:'red'}, {fontSize:'14px'}] ─► { color, fontSize }
   :style="{ display: ['-webkit-box','flex'] }" ─► first value the browser accepts`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The bound expression is read inside the render effect, so changes to the referenced state trigger a re-render and a re-normalization.',
    'normalizeClass/normalizeStyle produce short-lived strings/objects each render; the patch then diffs against the previous to apply minimal DOM changes.',
    'The static portion is computed once at compile time and stored on the vnode, so only the dynamic part is recomputed.',
    'Style auto-prefix lookups consult the element\'s CSSStyleDeclaration to decide which prefixed property is supported.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — conditional class and inline style',
      lang: 'vue',
      code: '<script setup>\nimport { ref } from \'vue\'\nconst active = ref(false)\nconst size = ref(16)\n</script>\n\n<template>\n  <p :class="{ active }" :style="{ fontSize: size + \'px\' }">\n    Toggle me\n  </p>\n  <button @click="active = !active">Toggle</button>\n</template>',
      explanation: [
        ':class="{ active }" is shorthand for { active: active } — adds the class when the ref is truthy.',
        ':style binds an object; fontSize is camelCase and the value includes its unit.',
        'Both update when the refs change.',
        'Numbers need explicit units appended for most CSS properties.',
      ],
    },
    intermediate: {
      label: 'Intermediate — computed class object and style array',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst status = ref(\'pending\')\nconst classes = computed(() => ({\n  badge: true,\n  \'badge--ok\': status.value === \'done\',\n  \'badge--warn\': status.value === \'pending\',\n  \'badge--err\': status.value === \'failed\',\n}))\nconst base = { padding: \'4px 8px\' }\nconst accent = ref({ color: \'white\' })\n</script>\n\n<template>\n  <span :class="classes" :style="[base, accent]">{{ status }}</span>\n</template>',
      explanation: [
        'Building the class object in a computed keeps complex conditional logic out of the template.',
        'Kebab-case class names need quoting as object keys.',
        ':style accepts an array of style objects that Vue merges into one.',
        'The computed recomputes only when status changes.',
      ],
    },
    advanced: {
      label: 'Advanced — class fallthrough to a component root',
      lang: 'vue',
      code: '<!-- BaseButton.vue (single root) -->\n<script setup>\ndefineProps([\'label\'])\n</script>\n<template>\n  <button class="base-btn">{{ label }}</button>\n</template>\n\n<!-- Parent.vue -->\n<script setup>\nimport BaseButton from \'./BaseButton.vue\'\nimport { ref } from \'vue\'\nconst primary = ref(true)\n</script>\n<template>\n  <!-- these classes MERGE onto the component\'s root <button> -->\n  <BaseButton label="Go" class="cta" :class="{ primary }" />\n</template>',
      explanation: [
        'When a component has a single root element, class/style on the usage site fall through and merge onto that root.',
        'The final button gets base-btn plus cta plus (conditionally) primary.',
        'This is why you can style library components from the outside.',
        'Multiple roots require explicit binding via $attrs since fallthrough is ambiguous.',
      ],
    },
    realProject: {
      label: 'Real project — theming and active nav links',
      lang: 'vue',
      code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst route = ref(\'/home\')\nconst dark = ref(true)\nconst links = [\n  { to: \'/home\', text: \'Home\' },\n  { to: \'/about\', text: \'About\' },\n]\nconst rootStyle = computed(() => ({\n  background: dark.value ? \'#111\' : \'#fff\',\n  color: dark.value ? \'#eee\' : \'#111\',\n}))\n</script>\n\n<template>\n  <nav :style="rootStyle">\n    <a\n      v-for="link in links"\n      :key="link.to"\n      :class="{ nav__link: true, \'is-active\': route === link.to }"\n      @click="route = link.to"\n    >{{ link.text }}</a>\n  </nav>\n</template>',
      explanation: [
        'A computed style object drives the theme, recomputing when dark toggles.',
        'Each link gets is-active only when it matches the current route — the canonical nav highlight pattern.',
        'Object class syntax keeps the active logic inline and readable.',
        'In a real app the active state usually comes from vue-router\'s route, but the binding pattern is identical.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How do you conditionally apply a CSS class in Vue?',
      answer: 'Use :class with object syntax: :class="{ active: isActive }". The class is added when the value is truthy. You can also use array syntax to combine multiple classes.',
      explanation: 'Basic but fundamental; mentioning both object and array syntax is the complete answer.',
    },
    {
      level: 'beginner',
      question: 'What happens to a static class when you also bind :class on the same element?',
      answer: 'Vue merges them — the static class and the dynamically bound classes are both applied; the static one is not overwritten.',
      explanation: 'A common surprise; knowing they merge prevents bugs where people think one replaces the other.',
    },
    {
      level: 'intermediate',
      question: 'How do you bind multiple inline styles, and how are property names written?',
      answer: 'Use :style with an object ({ fontSize: \'14px\' }) using camelCase (or quoted kebab-case), or an array of style objects that Vue merges. Numeric values usually need an explicit unit appended.',
      explanation: 'Tests the object/array forms and the camelCase + unit detail.',
    },
    {
      level: 'intermediate',
      question: 'How do classes bound on a component end up on its DOM element?',
      answer: 'If the component has a single root element, class/style fall through and merge onto that root via attribute fallthrough. With multiple roots it is ambiguous, so you must bind $attrs.class explicitly.',
      explanation: 'Connects to attribute fallthrough — a frequent follow-up.',
    },
    {
      level: 'advanced',
      question: 'What does Vue do with vendor prefixes and value fallbacks in :style?',
      answer: 'Vue auto-prefixes properties that need vendor prefixes by checking what the element supports. It also accepts an array of values for a property (e.g. display: [\'-webkit-box\', \'flex\']) and applies the last one the browser accepts, giving graceful fallback.',
      explanation: 'Lesser-known capabilities that show depth.',
    },
    {
      level: 'senior',
      question: 'How does Vue patch class/style efficiently on updates?',
      answer: 'It normalizes the dynamic class/style with normalizeClass/normalizeStyle, merges with the compile-time static part, then diffs against the previous value in patchClass/patchStyle, applying only the changed classes/properties rather than rewriting the whole attribute.',
      explanation: 'Demonstrates knowledge of the normalization + diffing pipeline.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between object and array :class syntax?',
    'Why does a bound class not replace the static class?',
    'How do you apply a class based on a computed value?',
    'How do you forward a class to a multi-root component?',
    'How does :style handle vendor prefixes?',
    'When would you prefer CSS classes over inline :style?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Building class strings by hand with template concatenation.',
      why: 'It is error-prone (extra spaces, missing toggles) and hard to read compared to object/array syntax.',
      fix: 'Use :class="{ active: isActive }" object syntax or an array.',
    },
    {
      mistake: 'Forgetting units in :style numeric values.',
      why: 'CSS properties like width/fontSize need a unit; a bare number is often ignored or invalid.',
      fix: 'Append the unit: { width: size + \'px\' }.',
    },
    {
      mistake: 'Using kebab-case JS property names without quotes in a style object.',
      why: 'font-size as an unquoted key is invalid JS (subtraction); it must be camelCase or quoted.',
      fix: 'Use fontSize, or \'font-size\' as a quoted key.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Active nav links, validation error states, loading/disabled buttons, and open/closed panels are all driven by :class object syntax.' },
    { area: 'Component library', detail: 'Components compute a class object from props (size, variant, disabled) and rely on fallthrough so consumers can add their own classes.' },
    { area: 'Theming', detail: ':style with a computed object (or CSS variables) drives runtime theme switching (light/dark, brand colors).' },
    { area: 'Tailwind/utility CSS', detail: 'Conditional utility classes are toggled with :class object/array syntax, often combined with a clsx-style helper.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Vue diffs class/style and patches only changes, so toggling one class does not rewrite the whole attribute.',
      'Static parts are precomputed at compile time, so only dynamic bits recompute.',
    ],
    bad: [
      'Large inline :style objects rebuilt every render add allocation and patch work versus a single toggled class.',
      'Heavy class-computing logic inline in the template recomputes on every render.',
    ],
    optimizations: [
      'Prefer toggling a CSS class over many inline style properties for frequently-changing UI.',
      'Compute complex class/style objects in a computed so they are cached.',
      'Use CSS variables for theming so style changes are a single property update.',
      'Avoid rebuilding identical style objects each render; hoist constants.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-bind', 'template-syntax', 'computed'],
    nextConcepts: ['attribute-fallthrough', 'custom-directives', 'vue-style-options'],
    dependencyNote:
      ':class/:style are specialized v-bind behaviors and often built with computed; they connect to attribute-fallthrough (how component classes merge onto the root) and to vue-style-options / scoped CSS for the wider styling story.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write class="btn" :class="{ active: isActive }" and show the merged result class="btn active".',
      'Show object syntax (name→truthiness) next to array syntax (list of classes).',
      'Draw the pipeline: state → normalizeClass/normalizeStyle → merge with static → patch.',
      'Show a component with one root and classes from the parent merging onto that root (fallthrough).',
      'Conclude: declarative, merged, diffed — no manual string building.',
    ],
    diagram: `  class="btn" :class="{active:T, error:F}"  ─►  class="btn active"
  :class=[a, cond ? b : c]                  ─►  array combine
  state → normalize → MERGE(static+dynamic) → patchClass/patchStyle
  <Comp class="x"/> (single root) → merges onto root element`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    ':class and :style accept strings, objects, and arrays. Object class syntax toggles by truthiness ({ active: isActive }); array syntax combines classes. :style takes a camelCase object or an array of objects, auto-prefixes, and supports value-array fallbacks. Bound classes/styles MERGE with the static class/style attribute. On a single-root component they fall through onto the root. Vue normalizes and diffs them, patching only what changed. Compute complex class objects in a computed.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Class and style bindings are special forms of v-bind that accept more than strings. For classes, the object syntax — :class="{ active: isActive, error: hasError }" — adds each class whose value is truthy, which is the cleanest way to express conditional styling. The array syntax — :class="[\'card\', theme, isActive ? \'open\' : \'closed\']" — combines several classes, including dynamic ones. A key behavior: Vue merges these dynamic classes with whatever static class you wrote on the same element, so class="btn" :class="{ active }" yields "btn active" — the static one is never lost. Style works the same way: :style takes an object with camelCase property names (or quoted kebab-case), like { fontSize: \'14px\' }, and you can pass an array of style objects to merge. Vue also auto-prefixes properties that need vendor prefixes and supports an array of values for a single property, applying the last one the browser accepts, which gives graceful fallback. On components, if the component has a single root element, bound class and style fall through and merge onto that root via attribute fallthrough — that\'s how you style a library component from outside; with multiple roots it\'s ambiguous and you bind $attrs explicitly. Performance-wise, Vue normalizes the dynamic class/style, merges with the compile-time static part, and diffs against the previous value, patching only the changed classes or properties rather than rewriting the whole attribute. For frequently changing UI, toggling a CSS class is cheaper than building a big inline style object, and complex class logic belongs in a computed so it\'s cached.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Inline :style is convenient and dynamic but bypasses CSS caching/specificity; CSS classes are more performant and themeable for frequent changes.',
      'Object class syntax is readable but heavy conditional logic inline bloats templates — move it to a computed.',
    ],
    edgeCases: [
      'kebab-case style keys must be quoted; camelCase is preferred.',
      'Numeric style values usually require explicit units; some unitless properties (lineHeight, zIndex) accept numbers.',
      'Multi-root components do not auto-merge fallthrough classes — bind $attrs.class manually.',
      'Value-array fallback in :style relies on the browser silently dropping unsupported values.',
    ],
    runtimeBehavior: [
      'normalizeClass flattens arrays/objects to a class string; normalizeStyle flattens to a style object.',
      'patchClass/patchStyle diff old vs new and apply only deltas.',
      'Auto-prefixing queries the element\'s CSSStyleDeclaration to choose a supported property name.',
    ],
    scalability: [
      'Large design systems favor variant-driven class objects computed from props over sprawling inline styles.',
      'Runtime theming scales best with CSS custom properties updated via a single :style or root variable, not per-element style objects.',
    ],
    productionConcerns: [
      'Inline styles complicate CSP (style-src) and can hurt cacheability.',
      'Specificity conflicts arise when inline :style overrides class-based design tokens unexpectedly.',
      'Forgetting fallthrough on multi-root components leads to "my class isn\'t applying" bugs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    ':class object: { name: truthy } toggles classes.',
    ':class array: [\'a\', cond ? \'b\' : \'c\'] combines classes.',
    'Bound classes MERGE with static class (not replace).',
    ':style object: { fontSize: \'14px\' } (camelCase or quoted kebab).',
    ':style array: merges multiple style objects.',
    'Numeric style values usually need units.',
    'Vue auto-prefixes vendor-prefixed properties.',
    'Value-array fallback: display: [\'-webkit-box\',\'flex\'].',
    'Single-root component: classes fall through onto root.',
    'Multi-root: bind $attrs.class explicitly.',
    'Compute complex class/style objects in a computed.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Toggle a "done" class on a list item based on a boolean ref, keeping a static "item" class.',
      hint: 'Use object :class alongside the static class.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst done = ref(false)\n</script>\n\n<template>\n  <li class="item" :class="{ done }">Task</li>\n  <button @click="done = !done">Toggle</button>\n</template>',
        explanation: [
          ':class="{ done }" adds done when the ref is truthy.',
          'The static class="item" is merged, so both can apply together.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Bind a div\'s background color and font size from reactive refs, with proper units.',
      hint: 'Use :style with an object and append units.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref } from \'vue\'\nconst bg = ref(\'#0af\')\nconst size = ref(20)\n</script>\n\n<template>\n  <div :style="{ background: bg, fontSize: size + \'px\' }">Styled</div>\n</template>',
        explanation: [
          'background takes the color string directly.',
          'fontSize needs the px unit appended to the numeric ref.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Compute a status badge class object (ok/warn/err) from a status ref using a computed, keeping a base "badge" class always on.',
      hint: 'Return an object from a computed and bind it to :class.',
      solution: {
        lang: 'vue',
        code: '<script setup>\nimport { ref, computed } from \'vue\'\nconst status = ref(\'warn\')\nconst badgeClass = computed(() => ({\n  badge: true,\n  \'badge--ok\': status.value === \'ok\',\n  \'badge--warn\': status.value === \'warn\',\n  \'badge--err\': status.value === \'err\',\n}))\n</script>\n\n<template>\n  <span :class="badgeClass">{{ status }}</span>\n</template>',
        explanation: [
          'The computed returns an object mapping class names to booleans, cached until status changes.',
          'badge: true is always applied; exactly one variant class is true based on status.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate how a class added on a custom single-root component reaches the rendered DOM element.',
      hint: 'Attribute fallthrough merges class onto the single root.',
      solution: {
        lang: 'vue',
        code: '<!-- Chip.vue (single root) -->\n<script setup>\ndefineProps([\'text\'])\n</script>\n<template>\n  <span class="chip">{{ text }}</span>\n</template>\n\n<!-- Usage -->\n<!-- <Chip text="New" class="chip--accent" /> -->\n<!-- Rendered: <span class="chip chip--accent">New</span> -->',
        explanation: [
          'Because Chip has a single root <span>, the class passed at the usage site falls through and merges onto that root.',
          'The final element has both the internal "chip" and the external "chip--accent" classes.',
          'If Chip had multiple roots, Vue could not decide where to put the class and you would bind $attrs.class manually.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Dynamic styling is in nearly every component you build, so interviewers expect you to do it cleanly. Knowing object/array syntax, merging, and fallthrough shows day-to-day Vue fluency.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "how do you add a class conditionally". Product companies (Zoho, Flipkart, Razorpay) ask about merging with static classes, computed class objects, and component class fallthrough. FAANG-level rounds probe normalization/patching internals, vendor prefixing, and inline-style vs class trade-offs.',
    whatInterviewersExpect:
      'Show object and array :class/:style syntax, explain that bound classes merge with static ones, know camelCase + units for styles, explain single-root fallthrough, and for senior credit describe the normalize-merge-diff patch pipeline.',
  },
}

export default classStyleBindings
