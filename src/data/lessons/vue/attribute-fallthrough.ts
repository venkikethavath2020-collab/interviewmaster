import type { ConceptLesson } from '../../../types/lesson'

const attributeFallthrough: ConceptLesson = {
  // 1. Concept Summary
  slug: 'attribute-fallthrough',
  name: 'Attribute Fallthrough',
  category: 'components',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Fallthrough is why you can write <MyButton class="primary" @click="save" /> and have the class and listener land on the real <button> without declaring them as props.',
    'It is the secret behind reusable wrapper components and design-system primitives — pass-through of class, style, id, aria-* and DOM events "just works".',
    'When you misunderstand it you get duplicated attributes, a class on the wrong element, or "my @click does nothing" bugs in component libraries.',
    'Interviewers use it to check whether you really understand the boundary between props and the rest of the attributes a parent passes.',
    'Knowing inheritAttrs:false + v-bind="$attrs" is the standard way to forward attributes onto an inner element in multi-root or wrapper components.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Fallthrough is like handing a present to a kid who passes anything they were not told to keep straight to their little brother.',
    story: [
      'Imagine you give your friend a bag with a sandwich, a sticker, and a toy car.',
      'You told your friend "the sandwich is for you" — that is the part they keep.',
      'You never said anything about the sticker and the toy car, so your friend automatically passes them along to their little brother sitting behind them.',
      'A Vue component does the same: the props you declared, it keeps. Anything extra the parent handed it — like a class or a click — it quietly passes through onto the element inside it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a parent uses a component, it can pass two kinds of things: declared props (which the component asked for by name) and everything else.',
    'That "everything else" — class, style, id, regular HTML attributes, and v-on listeners that are not declared as emits — is called fallthrough attributes.',
    'By default Vue takes those leftover attributes and applies them to the single root element the component renders. This is called attribute inheritance or fallthrough.',
    'You can turn it off with inheritAttrs:false and instead place them wherever you want with v-bind="$attrs".',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Attribute fallthrough (a.k.a. attribute inheritance) is Vue automatically applying any attribute, class, style, or event listener passed by the parent — that is NOT a declared prop or emit — onto the component\'s root element.',
    how: 'During render Vue collects the parent-passed bindings, removes the ones that match declared props/emits, and merges the rest (the $attrs object) onto the root node. class and style are merged with the root\'s own class/style rather than overwritten.',
    why: 'It lets you build thin wrapper components that behave like native elements: a parent can style them, give them an id, or attach a click without you forwarding every attribute by hand.',
    code: {
      label: 'class and @click fall through to the button',
      lang: 'vue',
      code: '<!-- MyButton.vue -->\n<script setup lang="ts">\ndefineProps<{ label: string }>()\n</script>\n\n<template>\n  <button>{{ label }}</button>\n</template>\n\n<!-- Parent.vue -->\n<template>\n  <MyButton label="Save" class="primary" @click="onSave" />\n</template>\n\n<!-- Renders: <button class="primary">Save</button> with a working click -->',
      explanation: [
        '`label` is a declared prop, so the component keeps it.',
        '`class="primary"` and `@click` were NOT declared, so they fall through onto the <button> root.',
        'You never wrote @click on the button, yet it works — that is fallthrough.',
        'class merges with any class the root already had instead of replacing it.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Attribute fallthrough is Vue 3\'s mechanism whereby non-prop, non-emit bindings passed to a component (collected in the $attrs object: class, style, id, native event listeners, ARIA and data attributes) are automatically inherited by the component\'s single root element during render. class and style are merged with the root element\'s existing values; everything else is applied as-is. The behaviour is controlled by the inheritAttrs option (default true) and can be redirected with explicit v-bind="$attrs". Components with multiple root nodes do not auto-inherit and must bind $attrs manually.',

  // 7. Internal Working
  internalWorking: [
    'When the parent compiles, all bindings on the child component tag are split by the runtime into props (matching the component\'s resolved props options) and the remaining "attrs".',
    'The component instance exposes those leftovers reactively as instance.attrs, surfaced in <script setup> via useAttrs() and in the template/render as $attrs.',
    'At render time, if inheritAttrs is true (default) and the component has exactly one root vnode, Vue merges $attrs onto that root vnode\'s props during the patch — mergeProps handles class/style concatenation and event listener combination.',
    'If inheritAttrs is false, Vue skips that automatic merge; $attrs is still available so you can v-bind it onto the element of your choice.',
    'For multi-root (fragment) components Vue cannot guess a target, so it emits a dev warning and does NOT auto-apply $attrs unless you bind it explicitly.',
    'Because $attrs is reactive, updates to fallthrough attributes from the parent re-trigger the child\'s render and re-merge onto the target element.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  Parent passes:  label="Save"  class="primary"  id="x"  @click=...
                      │            │             │        │
            declared prop?  ──────►│             │        │
                  yes  ─► kept as props.label    │        │
                      │            │             │        │
                  no  ─► everything else ──► $attrs = { class, id, onClick }
                                                  │
                       inheritAttrs: true (default)
                                                  ▼
                              ┌──────────────────────────────┐
                              │  single root <button>         │ ◄─ $attrs merged here
                              │  class merged, onClick added  │
                              └──────────────────────────────┘`,

  // 9. Memory Visualization
  memoryVisualization: undefined,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — default inheritance onto root',
      lang: 'vue',
      code: '<!-- Card.vue -->\n<template>\n  <div class="card">\n    <slot />\n  </div>\n</template>\n\n<!-- usage -->\n<Card class="shadow" data-test="card" />\n<!-- => <div class="card shadow" data-test="card"> -->',
      explanation: [
        'No props declared, so class and data-test are fallthrough attrs.',
        'They land on the single root <div>.',
        'class="shadow" is MERGED with the existing class="card", not replaced.',
        'data-test is added verbatim — handy for test selectors.',
      ],
    },
    intermediate: {
      label: 'Intermediate — redirect attrs onto an inner element',
      lang: 'vue',
      code: '<!-- LabeledInput.vue -->\n<script setup lang="ts">\ndefineProps<{ label: string }>()\ndefineOptions({ inheritAttrs: false })\n</script>\n\n<template>\n  <label class="field">\n    <span>{{ label }}</span>\n    <input v-bind="$attrs" />\n  </label>\n</template>\n\n<!-- usage -->\n<LabeledInput label="Email" type="email" placeholder="you@site.com" @blur="validate" />',
      explanation: [
        'inheritAttrs:false stops attrs from landing on the outer <label>.',
        'v-bind="$attrs" forwards type, placeholder and @blur onto the real <input>.',
        'This is the canonical pattern for form-field wrapper components.',
        'Without it, type/placeholder would wrongly sit on the <label> wrapper.',
      ],
    },
    advanced: {
      label: 'Advanced — splitting class/style from the rest',
      lang: 'vue',
      code: '<!-- IconButton.vue -->\n<script setup lang="ts">\nimport { useAttrs, computed } from \'vue\'\ndefineOptions({ inheritAttrs: false })\nconst attrs = useAttrs()\n// keep class/style on the wrapper, listeners on the button\nconst listeners = computed(() =>\n  Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith(\'on\')))\n)\n</script>\n\n<template>\n  <div :class="$attrs.class" class="icon-btn-wrap">\n    <button v-bind="listeners"><slot /></button>\n  </div>\n</template>',
      explanation: [
        'useAttrs() gives programmatic access to fallthrough attrs in script.',
        'Listener keys are prefixed with `on` (onClick, onBlur) in $attrs.',
        'Here class stays on the wrapper while events go to the inner button.',
        'Splitting attrs is needed when a wrapper has distinct styling vs interactive parts.',
      ],
    },
    realProject: {
      label: 'Real project — design-system BaseButton',
      lang: 'vue',
      code: '<!-- BaseButton.vue (design system) -->\n<script setup lang="ts">\nwithDefaults(defineProps<{ variant?: \'primary\' | \'ghost\'; loading?: boolean }>(), {\n  variant: \'primary\',\n})\n</script>\n\n<template>\n  <button :class="[\'btn\', `btn--${variant}`]" :disabled="loading">\n    <Spinner v-if="loading" />\n    <slot />\n  </button>\n</template>\n\n<!-- product code -->\n<BaseButton variant="ghost" type="submit" aria-label="Save form" @click="save">\n  Save\n</BaseButton>',
      explanation: [
        'variant/loading are component-owned props; type, aria-label, @click fall through.',
        'The single <button> root inherits type="submit", aria-label and the click listener automatically.',
        'The component focuses on its own concerns (variant styling, loading) while staying a drop-in for a native button.',
        'This pattern keeps a design system thin and accessible without re-declaring every native attribute.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is attribute fallthrough in Vue 3?',
      answer: 'It is Vue automatically applying any attribute, class, style or event listener passed by the parent that is not a declared prop or emit onto the component\'s root element.',
      explanation: 'A solid answer names the leftover set (class/style/listeners/attrs collected as $attrs) and that they target the single root by default.',
    },
    {
      level: 'beginner',
      question: 'How are class and style fallthrough handled differently from other attributes?',
      answer: 'class and style are merged with the root element\'s own class/style, whereas other attributes are applied as-is (and would overwrite a duplicate).',
      explanation: 'This merge behaviour is a frequent gotcha — candidates often assume class replaces rather than concatenates.',
    },
    {
      level: 'intermediate',
      question: 'How do you stop attributes from landing on the root and put them somewhere else?',
      answer: 'Set inheritAttrs:false (via defineOptions in <script setup>) and bind them yourself with v-bind="$attrs" on the desired inner element.',
      explanation: 'This is the standard wrapper/form-field pattern; mentioning useAttrs() for script access is a bonus.',
    },
    {
      level: 'intermediate',
      question: 'What happens to fallthrough on a component with multiple root nodes?',
      answer: 'Nothing automatic — Vue cannot pick a target, warns in dev, and you must bind v-bind="$attrs" explicitly on one element.',
      explanation: 'Tests understanding that auto-inheritance requires a single root vnode.',
    },
    {
      level: 'advanced',
      question: 'How do event listeners appear inside $attrs?',
      answer: 'As properties prefixed with `on` and PascalCased, e.g. @click becomes onClick, @update:model-value becomes onUpdate:modelValue in $attrs.',
      explanation: 'Shows knowledge of the runtime representation, which matters when filtering or forwarding listeners programmatically.',
    },
    {
      level: 'senior',
      question: 'When would inheritAttrs:false plus manual $attrs binding be a correctness, not just a styling, decision?',
      answer: 'When the visual root differs from the interactive/semantic element — e.g. a wrapper <div> around an <input>: type, autocomplete, aria-* and listeners must land on the input, not the div, or accessibility and behaviour break.',
      explanation: 'Senior signal: connecting fallthrough to accessibility and DOM semantics rather than treating it as cosmetic.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between props and $attrs?',
    'How do you access fallthrough attributes inside <script setup>? (useAttrs())',
    'Are $attrs reactive? Can you destructure them safely? (reactive; destructuring loses reactivity)',
    'How does v-model interact with fallthrough on a custom component?',
    'How do you forward attrs to multiple child elements selectively?',
    'Why does class on a component merge but a custom attribute overwrite?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Declaring something as a prop AND expecting it to also fall through.',
      why: 'Once an attribute matches a declared prop it is removed from $attrs and will NOT appear on the root element.',
      fix: 'Decide per attribute: declare it as a prop OR let it fall through; if you need both, re-bind it manually.',
    },
    {
      mistake: 'Forgetting inheritAttrs:false on a wrapper, so attrs land on the wrong (outer) element.',
      why: 'By default everything goes to the single root, which may be a styling wrapper, not the semantic element.',
      fix: 'Set inheritAttrs:false and v-bind="$attrs" onto the correct inner element.',
    },
    {
      mistake: 'Multi-root component silently dropping passed attributes.',
      why: 'Fragments have no single root, so Vue does not auto-inherit and only warns in dev.',
      fix: 'Explicitly bind v-bind="$attrs" on the intended element, or give the component a single root.',
    },
    {
      mistake: 'Destructuring useAttrs() and losing reactivity.',
      why: '$attrs is a reactive object; pulling individual values out at setup time freezes them.',
      fix: 'Access attrs.foo inside a computed/template, or keep the attrs object intact when binding.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Base/atomic components (BaseButton, BaseInput, BaseLink) rely on fallthrough so consumers can pass native attributes, aria-*, and listeners without the library re-declaring them.' },
    { area: 'Vue', detail: 'Form-field wrappers use inheritAttrs:false + v-bind="$attrs" on the inner <input> so type, placeholder, and validation listeners reach the actual control.' },
    { area: 'Nuxt', detail: 'NuxtLink and similar wrappers forward attrs/listeners to the underlying anchor so prefetch, target, and rel behave like a normal link.' },
    { area: 'SSR', detail: 'Fallthrough preserves data- and aria- attributes during server render so hydration matches and accessibility metadata is present in the initial HTML.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Fallthrough is resolved during the normal render/patch with negligible overhead — it is just a prop merge.',
      'It avoids verbose manual forwarding code, keeping wrapper components small and cache-friendly.',
    ],
    bad: [
      'A reactive $attrs change re-renders the child; passing volatile inline objects/handlers as attrs can cause extra renders.',
      'Over-spreading v-bind="$attrs" onto many elements duplicates work and can attach listeners in unexpected places.',
    ],
    optimizations: [
      'Declare frequently-changing values as explicit props so they are typed and intentional rather than anonymous attrs.',
      'Use inheritAttrs:false to target exactly one element instead of relying on accidental root inheritance.',
      'Hoist stable event handlers in the parent so each render does not create a fresh listener in $attrs.',
    ],
  },

  // 16. Security Considerations — omitted (no real security angle)

  // 17. Related Concepts
  related: {
    prerequisites: ['components-basics', 'props', 'component-events'],
    nextConcepts: ['v-model-components', 'slots', 'component-registration'],
    dependencyNote:
      'Fallthrough sits on top of the props/emits boundary: you must understand what props ARE before you can grasp what counts as a leftover attribute. It then underpins wrapper patterns, custom v-model, and slot-based composition in component libraries.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a component tag with three bindings: a declared prop, a class, and an @click.',
      'Draw an arrow taking the declared prop into the component as props.',
      'Bundle the remaining class + @click into a box labelled $attrs.',
      'Draw $attrs flowing onto the single root element; note class is MERGED.',
      'Then flip a switch labelled inheritAttrs:false and redraw $attrs landing on an inner element via v-bind="$attrs".',
    ],
    diagram: `  <MyInput label="Email" type="email" @blur=... />
        │            │           │
   declared      ┌───┴───────────┴──┐
   prop.label    │  $attrs           │
                 │  { type, onBlur } │
                 └────────┬──────────┘
   inheritAttrs:false ►───┘
                          ▼
                  <input v-bind="$attrs" />  (correct target)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Attribute fallthrough is Vue applying any parent-passed attribute, class, style, or listener that is NOT a declared prop or emit onto the component\'s single root element. class and style merge; the rest are applied as-is. Those leftovers live in $attrs. Turn off the automatic root inheritance with inheritAttrs:false and place them yourself with v-bind="$attrs" — the standard pattern for wrapper and form-field components. Multi-root components do not auto-inherit and must bind $attrs manually.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'When a parent uses a component it can pass two kinds of bindings: the props the component explicitly declared, and everything else — a class, a style, an id, data- and aria- attributes, and native event listeners. Vue collects that "everything else" into an object called $attrs. By default, if the component renders a single root element, Vue automatically merges $attrs onto that root. This is attribute fallthrough. The nuance is that class and style are merged with whatever the root already had rather than overwriting it, while other attributes are applied directly. This is what lets you build a thin BaseButton that you can pass type="submit", aria-label, and @click to, and have them all land on the real button without re-declaring them. The control point is the inheritAttrs option. If you set inheritAttrs:false — usually via defineOptions in script setup — Vue stops the automatic merge, and you instead bind v-bind="$attrs" on whatever element you choose. That matters for wrappers: a labeled input has an outer label but the type, placeholder, and listeners must go on the inner input, not the wrapper, both for behaviour and accessibility. One edge case: a component with multiple root nodes has no obvious target, so Vue does not auto-inherit and warns you in dev — you must bind $attrs explicitly. In script you read these via useAttrs(), and listeners appear there prefixed with on, like onClick.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Convenience vs explicitness: fallthrough keeps wrappers terse but makes the contract implicit — readers cannot tell from the template which attributes are supported.',
      'Single-root simplicity vs multi-root flexibility: keeping one root buys free inheritance but constrains markup; fragments need manual $attrs wiring.',
    ],
    edgeCases: [
      'Multi-root/fragment components: no auto-inherit, dev warning, manual v-bind="$attrs" required.',
      'A binding that matches a declared prop is removed from $attrs entirely — you cannot have it in both places automatically.',
      'Listeners are namespaced as onXxx in $attrs, so filtering by the `on` prefix is how you separate events from plain attributes.',
      'class/style merge semantics differ from plain attrs, which can surprise when a wrapper expects a clean override.',
    ],
    runtimeBehavior: [
      '$attrs is reactive; parent attribute changes re-trigger the child render and re-merge onto the target.',
      'Merging is done by mergeProps, which concatenates class/style and chains event handlers rather than replacing them.',
      'inheritAttrs only affects the AUTOMATIC merge; $attrs remains populated regardless so manual binding always works.',
    ],
    scalability: [
      'In large design systems, consistent inheritAttrs:false + explicit $attrs targeting prevents "attribute on wrong element" regressions across hundreds of components.',
      'Typing $attrs is limited compared to props, so heavily fallthrough-driven APIs trade IDE assistance for flexibility.',
    ],
    productionConcerns: [
      'Accessibility correctness depends on aria-*/role falling through onto the semantic element, not a styling wrapper.',
      'SSR/hydration relies on the same attributes being applied server and client; conditional fallthrough logic can cause mismatch warnings.',
      'Audit wrapper components for accidental double-binding of listeners when forwarding $attrs to multiple elements.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Fallthrough = non-prop, non-emit bindings auto-applied to the root element.',
    'Leftovers live in $attrs (script: useAttrs()).',
    'class & style MERGE with the root; other attrs apply as-is.',
    'Default inheritAttrs:true → single root inherits automatically.',
    'inheritAttrs:false → manual v-bind="$attrs" on chosen element.',
    'Multi-root components do NOT auto-inherit (dev warning).',
    'Listeners appear as onClick, onBlur, onUpdate:modelValue in $attrs.',
    'Declared props are stripped out of $attrs.',
    'Form-field wrappers: inheritAttrs:false + v-bind="$attrs" on the input.',
    '$attrs is reactive; do not destructure if you need reactivity.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a Badge component with one prop `text` such that a parent-passed class merges onto the root <span>.',
      hint: 'Just declare the prop and render a single root; class falls through automatically.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ndefineProps<{ text: string }>()\n</script>\n\n<template>\n  <span class="badge">{{ text }}</span>\n</template>\n\n<!-- <Badge text="New" class="badge--green" /> => class="badge badge--green" -->',
        explanation: ['text is a declared prop, kept by the component.', 'class is fallthrough and merges with the root span\'s existing class.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Build a FormField wrapper where the label sits on an outer <label> but type/placeholder/@input fall onto the inner <input>.',
      hint: 'Use inheritAttrs:false and v-bind="$attrs" on the input.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ndefineProps<{ label: string }>()\ndefineOptions({ inheritAttrs: false })\n</script>\n\n<template>\n  <label class="form-field">\n    <span>{{ label }}</span>\n    <input v-bind="$attrs" />\n  </label>\n</template>',
        explanation: [
          'inheritAttrs:false stops attrs landing on the <label>.',
          'v-bind="$attrs" forwards type, placeholder and the @input listener to the real input.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'In an IconButton, keep class/style on the wrapper div but forward only event listeners to the inner button.',
      hint: 'Filter useAttrs() entries whose keys start with "on".',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { useAttrs, computed } from \'vue\'\ndefineOptions({ inheritAttrs: false })\nconst attrs = useAttrs()\nconst listeners = computed(() =>\n  Object.fromEntries(Object.entries(attrs).filter(([k]) => k.startsWith(\'on\')))\n)\n</script>\n\n<template>\n  <div :class="attrs.class as any" class="icon-btn">\n    <button v-bind="listeners"><slot /></button>\n  </div>\n</template>',
        explanation: [
          'Listeners are detected by the `on` prefix Vue uses in $attrs.',
          'class stays on the wrapper while events go to the interactive button.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and demonstrate why a multi-root component drops a passed @click, and fix it.',
      hint: 'Fragments have no single root; bind $attrs explicitly.',
      solution: {
        lang: 'vue',
        code: '<!-- BROKEN: two roots, @click is dropped with a dev warning -->\n<template>\n  <header>Title</header>\n  <section><slot /></section>\n</template>\n\n<!-- FIXED: choose a target for the inherited attrs -->\n<script setup lang="ts">\ndefineOptions({ inheritAttrs: false })\n</script>\n<template>\n  <header>Title</header>\n  <section v-bind="$attrs"><slot /></section>\n</template>',
        explanation: [
          'With multiple roots Vue cannot pick where to put $attrs, so it auto-inherits nothing.',
          'Binding v-bind="$attrs" on the chosen element restores the click and other attrs.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Fallthrough is the glue that makes component libraries feel like native elements. Understanding it cleanly separates props from attrs in your mental model, which is exactly the boundary senior reviewers care about when approving reusable components.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask for the definition and the class-merge nuance. Product companies (Zoho, Flipkart, Razorpay) ask you to build a form-field wrapper with inheritAttrs:false on the spot. FAANG-level interviews probe the multi-root edge case, the onXxx listener representation, and accessibility implications of targeting the wrong element.',
    whatInterviewersExpect:
      'Define $attrs precisely, explain class/style merging vs plain replacement, show inheritAttrs:false + v-bind="$attrs", and connect the choice of target element to behaviour and accessibility rather than treating it as cosmetic.',
  },
}

export default attributeFallthrough
