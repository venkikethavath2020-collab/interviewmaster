import type { ConceptLesson } from '../../../types/lesson'

const reactivityTransform: ConceptLesson = {
  // 1. Concept Summary
  slug: 'reactivity-transform',
  name: 'Reactivity Transform',
  category: 'reactivity',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Reactivity Transform was Vue 3\'s experiment to remove the .value boilerplate from refs — knowing its story shows you understand WHY refs need .value in the first place.',
    'It was deprecated and removed from core, which is itself a great interview lesson about API design and the cost of "magic" compiler transforms.',
    'Understanding it sharpens your grasp of the difference between a ref (a reactive container) and a plain variable (a snapshot) — the single most confusing thing for Vue beginners.',
    'You will still see $ref()/$() in older codebases and blog posts; recognizing it prevents confusion when reading legacy code.',
    'The reasons it was dropped (hidden reactivity, harder mental model, tooling cost) are exactly the kinds of tradeoffs senior engineers are asked to reason about.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Reactivity Transform was a magic pen that auto-wrote ".value" for you — until everyone agreed the magic made things more confusing, not less.',
    story: [
      'Imagine in Vue you have a special magic box. To look inside or change what is in the box, you always have to say the magic word ".value".',
      'Some people got tired of saying ".value" all the time, so they invented a magic pen: you just write the box\'s name and the pen secretly adds ".value" for you behind the scenes.',
      'It felt nice at first — less typing! But then people got confused, because now you could not tell from looking at the code whether something was a magic box or a normal thing.',
      'The Vue team decided the confusion was worse than the typing, so they put the magic pen away. Now everyone writes ".value" again, on purpose, so the code is honest about what is reactive.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In Vue 3, a ref is a reactive container. To read or write its value in JavaScript you use .value (templates auto-unwrap it for you).',
    'Reactivity Transform was an experimental compiler feature that let you write $ref(0) and then use the variable directly — count++ instead of count.value++.',
    'The compiler would silently rewrite your code to add .value back in, so it was purely a convenience layer; the runtime still used normal refs.',
    'Because it hid which variables were reactive and added compiler complexity, the Vue team marked it experimental and then removed it from core in 2023. Today the recommended approach is plain refs with .value.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Reactivity Transform was a compile-time syntax sugar (macros like $ref, $computed, $(), $$()) that let you use reactive variables without writing .value. It is deprecated and removed from Vue core — the modern, supported way is normal refs with explicit .value.',
    how: 'At build time, the compiler detected the $ macros and rewrote references: $ref(0) became a real ref, and every plain use of the variable was rewritten to add .value. $$() was used to pass the underlying ref itself when you needed the container, not the value.',
    why: 'The goal was less boilerplate and a more JS-like feel. It was abandoned because it obscured what was reactive, complicated tooling, and weakened the mental model — clarity won over brevity.',
    code: {
      label: 'Then (transform) vs now (plain refs)',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\n\n// MODERN, SUPPORTED — explicit .value\nconst count = ref(0)\nfunction inc() {\n  count.value++\n}\n\n/* OLD experimental Reactivity Transform (removed):\n   let count = $ref(0)\n   function inc() { count++ }   // compiler added .value for you\n*/\n</script>\n\n<template>\n  <button @click="inc">{{ count }}</button>\n</template>',
      explanation: [
        'The supported pattern is const count = ref(0) and count.value++ in script.',
        'In the template, refs auto-unwrap, so you write {{ count }} without .value.',
        'The commented block shows the old $ref()/count++ sugar that the transform provided.',
        'Use the explicit form today; the transform is no longer in core.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Reactivity Transform was an experimental, opt-in compile-time transformation in Vue 3 that introduced macros ($ref, $computed, $shallowRef, $toRef, $() and $$()) to let developers work with reactive variables as if they were plain bindings, eliminating explicit .value access. The compiler statically rewrote these declarations into real ref/computed calls and inserted .value at every read/write site, while $$() escaped a transformed variable back to its underlying ref. It was deprecated in Vue 3.3 and removed from core (extracted to an external, unmaintained plugin) because it introduced implicit reactivity, hurt readability and tooling, and conflicted with the explicitness goals of the Composition API.',

  // 7. Internal Working
  internalWorking: [
    'The transform ran as a compiler pass (in @vue/reactivity-transform / the SFC compiler) over <script setup> before the normal compilation.',
    'It scanned for macro calls like $ref(x) and replaced the declaration with a real ref(x), tracking which local bindings were now "reactive variables".',
    'For every read of a tracked variable it appended .value; for every write it rewrote assignment to .value = ... — so count++ became count.value++.',
    'Destructuring via $() (e.g. const { x, y } = $(props)) was rewritten into toRefs-style access so each destructured name stayed reactive instead of becoming a static snapshot.',
    '$$(foo) compiled to the raw ref (no .value appended), allowing you to pass the container into functions or return it without losing reactivity.',
    'Because all of this was purely syntactic, the runtime saw ordinary refs — there was zero new runtime reactivity mechanism, only generated code.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SOURCE (with transform)        COMPILER REWRITE         RUNTIME SEES
   let count = $ref(0)    ──────► const count = ref(0)  ──► normal ref
   count++               ──────► count.value++         ──► track/trigger
   return { count }      ──────► return { count }       (auto-unwrapped)
   pass $$(count)        ──────► pass count (the ref)

   Why removed:
   ┌───────────────────────────────────────────────┐
   │  let a = 1            ← plain? snapshot?         │
   │  let b = $ref(1)      ← reactive (hidden)        │
   │  a++  vs  b++         ← look identical!          │
   │  ⇒ you cannot SEE what is reactive  ⇒ confusion  │
   └───────────────────────────────────────────────┘`,

  // 9. Memory Visualization
  memoryVisualization: [
    'No new runtime memory model: $ref produced an ordinary ref object on the heap (a { value } container wrapped in a reactive effect-tracking proxy), identical to ref().',
    'The only difference lived at compile time — the generated JS had .value access inserted, so the in-memory graph (dep → effect subscriptions) was exactly the same as with plain refs.',
    'Because the underlying object was a normal ref, garbage collection and dependency tracking behaved identically; nothing about the transform changed lifetimes or retention.',
    'This is precisely why it could be removed cleanly: dropping it changes only the syntax you write, not the runtime objects in memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the boilerplate it tried to remove',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref } from \'vue\'\nconst count = ref(0)\nconst double = () => count.value * 2\nconst inc = () => { count.value++ }\n</script>',
      explanation: [
        'Every script access needs .value — count.value++, count.value * 2.',
        'This repetition is exactly what Reactivity Transform aimed to delete.',
        'Templates already auto-unwrap, so the friction was only in <script>.',
        'The modern stance: this explicitness is a feature, not a bug.',
      ],
    },
    intermediate: {
      label: 'Intermediate — old transform syntax (for recognition)',
      lang: 'vue',
      code: '<script setup lang="ts">\n/* DEPRECATED / REMOVED — shown only to recognize legacy code */\n// let count = $ref(0)\n// const double = $computed(() => count * 2)\n// function inc() { count++ }       // compiled to count.value++\n\n// modern equivalent:\nimport { ref, computed } from \'vue\'\nconst count = ref(0)\nconst double = computed(() => count.value * 2)\nfunction inc() { count.value++ }\n</script>',
      explanation: [
        '$ref/$computed declared reactive variables you could use without .value.',
        'The commented lines are NOT valid in current Vue — they require the removed transform.',
        'The modern block below is the supported, equivalent code.',
        'Recognizing the $ macros helps when reading old tutorials or codebases.',
      ],
    },
    advanced: {
      label: 'Advanced — the $$() escape hatch and why it was needed',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, watch, type Ref } from \'vue\'\n\nconst count = ref(0)\n\n// A helper that needs the REF (the container), not a number snapshot:\nfunction track(r: Ref<number>) {\n  watch(r, (v) => console.log(\'changed to\', v))\n}\ntrack(count) // pass the ref directly\n\n/* With the old transform you wrote $ref and the variable looked like a number,\n   so you needed $$() to pass the underlying ref:\n     let count = $ref(0)\n     track($$(count))   // $$() = give me the real ref, not count.value\n*/\n</script>',
      explanation: [
        'A function that wants to react to changes must receive the ref itself, not its current value.',
        'With plain refs you simply pass count (it IS the ref).',
        'Under the transform, count looked like a plain number, so $$() was required to recover the container — extra cognitive load.',
        'This $$() friction was one of the practical arguments against the transform.',
      ],
    },
    realProject: {
      label: 'Real project — migrating a composable off the transform',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\n\n// A counter composable written the modern way after migration:\nfunction useCounter(start = 0) {\n  const count = ref(start)\n  const isEven = computed(() => count.value % 2 === 0)\n  const inc = () => { count.value++ }\n  return { count, isEven, inc }\n}\n\nconst { count, isEven, inc } = useCounter(10)\n// Old transform version returned $$()-wrapped refs to keep reactivity on destructure.\n</script>\n\n<template>\n  <button @click="inc">{{ count }} ({{ isEven ? \'even\' : \'odd\' }})</button>\n</template>',
      explanation: [
        'A real migration: composables return plain refs/computed; consumers destructure them and reactivity survives because they are refs.',
        'No $$() or $() is needed — returning refs from a composable is the canonical pattern.',
        'In the template, count and isEven auto-unwrap.',
        'This is what most teams did when the transform was removed: a mechanical find-and-replace back to explicit refs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What was Reactivity Transform in Vue 3?',
      answer: 'An experimental compile-time feature that let you use reactive variables ($ref, $computed) without writing .value; the compiler inserted .value for you. It has since been deprecated and removed from Vue core.',
      explanation: 'The key facts are: compile-time sugar, removed .value, experimental, and now removed.',
    },
    {
      level: 'beginner',
      question: 'Why do refs need .value at all?',
      answer: 'Because JavaScript cannot intercept reassignment of a primitive variable. Wrapping the value in an object with a .value property gives Vue a stable reference whose access can be tracked via a getter/setter.',
      explanation: 'This is the root reason the transform existed — and why removing the syntax sugar does not remove the underlying need.',
    },
    {
      level: 'intermediate',
      question: 'Why was Reactivity Transform deprecated and removed?',
      answer: 'It introduced implicit reactivity (you could not tell a reactive variable from a plain one), required a non-trivial compiler transform, complicated tooling and type inference, and pulled against the Composition API\'s value of explicitness. The maintainers judged the small ergonomic win not worth the conceptual cost.',
      explanation: 'A strong answer frames it as a deliberate API-design tradeoff, not a technical failure.',
    },
    {
      level: 'intermediate',
      question: 'What did $$() do and when was it needed?',
      answer: 'It returned the underlying ref of a transformed variable instead of its .value, so you could pass the actual ref into functions, return it, or watch it without losing reactivity.',
      explanation: 'Mentioning that the need for $$() was itself friction (you had to remember when a "variable" was secretly a ref) shows depth.',
    },
    {
      level: 'advanced',
      question: 'If you find $ref() in a codebase today, how do you migrate it?',
      answer: 'Replace let x = $ref(v) with const x = ref(v), add .value to every read/write of x in script, replace $computed with computed, and remove $$() wrappers since the variable is now already the ref. Templates need no change because they auto-unwrap.',
      explanation: 'This is a practical task; knowing the mechanical mapping signals real-world readiness.',
    },
    {
      level: 'senior',
      question: 'What general lesson about framework API design does Reactivity Transform illustrate?',
      answer: 'That removing boilerplate via implicit, "magic" transforms can cost more than it saves: it harms readability, debuggability, tooling, and the user\'s mental model. Explicitness — even slightly verbose — often scales better across teams and is easier to teach, type, and reason about.',
      explanation: 'Senior signal: connecting it to broader principles (least surprise, explicit over implicit, total cost of ownership) rather than just the feature itself.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why can\'t Vue make a plain primitive variable reactive without a wrapper? (no reassignment interception in JS)',
    'How do templates avoid needing .value? (compiler auto-unwraps top-level refs)',
    'What is the difference between $() and toRefs?',
    'Is there any supported replacement for the transform today? (no — use explicit refs)',
    'How did the transform interact with TypeScript type inference?',
    'What other "magic" features have frameworks rolled back for similar reasons?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Trying to use $ref()/$() in a current Vue project and expecting it to work.',
      why: 'Reactivity Transform was removed from core; the macros no longer exist without an unmaintained external plugin.',
      fix: 'Use ref()/computed() with explicit .value, which is the supported, future-proof approach.',
    },
    {
      mistake: 'Thinking the transform changed how reactivity works at runtime.',
      why: 'It was pure compile-time sugar; the runtime always used ordinary refs.',
      fix: 'Understand that only the syntax changed — refs, deps, and effects were identical underneath.',
    },
    {
      mistake: 'Destructuring transformed variables (or props) expecting reactivity without the right macro.',
      why: 'Plain destructuring snapshots values and breaks reactivity; the transform needed $() to preserve it.',
      fix: 'Today, use toRefs()/toRef() to keep destructured reactive references live.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Some apps adopted the transform during the experimental window (Vue 3.2-3.3) and later had to migrate back to explicit refs when it was removed — a real maintenance episode many teams went through.' },
    { area: 'Nuxt', detail: 'Nuxt briefly experimented with enabling the transform via config; it was disabled/removed once core deprecated it, so modern Nuxt code uses plain refs.' },
    { area: 'Component library', detail: 'Library authors generally avoided the transform because shipping code that depended on an experimental, opt-in compiler feature would have hurt downstream consumers.' },
    { area: 'Vue', detail: 'The episode reinforced the official guidance: explicit refs with .value are the canonical Composition API style, and tooling (Volar, ESLint) is tuned for that.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Zero runtime cost difference from plain refs — the transform was compile-time only.',
      'Slightly smaller authored source (less .value), though generated output was equivalent.',
    ],
    bad: [
      'Added a compiler pass and tooling burden (type inference, ESLint, Volar support) for a marginal gain.',
      'Implicit reactivity made debugging harder, an indirect cost to developer productivity.',
    ],
    optimizations: [
      'Use explicit refs; the perceived verbosity has no runtime penalty and improves readability.',
      'Lean on the template auto-unwrap so .value friction only exists in script, where explicitness helps.',
      'Use toRefs/toRef for reactive destructuring instead of relying on removed macros.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactivity-fundamentals', 'reactivity-caveats'],
    nextConcepts: ['ref-vs-reactive', 'toref-torefs', 'script-setup'],
    dependencyNote:
      'Reactivity Transform only makes sense once you understand ref and why .value exists (reactivity-fundamentals, reactivity-caveats). It connects forward to toref-torefs (the supported way to keep destructured reactivity) and script-setup (where the macros lived).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write let count = $ref(0) and count++ on the board.',
      'Draw an arrow to the compiled output: const count = ref(0); count.value++.',
      'Below it, write two variables: let a = 1 and let b = $ref(1), then a++ and b++ side by side.',
      'Circle that they look identical but one is reactive — the hidden reactivity problem.',
      'Conclude: "It was compile-time sugar over normal refs; removed because hiding what is reactive cost more than the .value it saved."',
    ],
    diagram: `  $ref(0)  ──compile──►  ref(0)
  count++  ──compile──►  count.value++

  a++  (plain)   b++  ($ref)   ← look the same, behave differently
        └── ambiguity = why it was removed ──┘`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Reactivity Transform was an experimental Vue 3 compile-time feature using $ref/$computed/$()/$$() so you could use reactive variables without .value — the compiler inserted .value for you. It changed only syntax; the runtime used normal refs. It was deprecated in 3.3 and removed from core because it hid which variables were reactive, complicated tooling, and clashed with the Composition API\'s explicitness. Today you write plain refs with .value, and use toRefs for reactive destructuring.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Reactivity Transform was an experimental, opt-in compile-time feature in Vue 3 meant to remove the .value boilerplate from refs. You would write let count = $ref(0) and then just count++, and the compiler would rewrite that to a real ref and insert count.value++ everywhere. There were companion macros: $computed for computed values, $() for reactive destructuring, and $$() to recover the underlying ref when you needed to pass the container into a function rather than its current value. Importantly, it was pure syntactic sugar — at runtime it produced ordinary refs, so the reactivity system itself was unchanged. It was marked experimental, deprecated in Vue 3.3, and then removed from core, extracted into an external plugin that is effectively unmaintained. The reasons are a great API-design lesson: it introduced implicit reactivity, so you couldn\'t tell a reactive variable from a plain one just by reading the code; it required a non-trivial compiler transform with knock-on costs for TypeScript inference, ESLint, and Volar; and it pulled against the Composition API\'s core value of being explicit. The maintainers decided the small ergonomic win wasn\'t worth the conceptual and tooling cost. So today the supported style is plain const count = ref(0) with explicit .value in script — templates still auto-unwrap — and toRefs or toRef when you need to destructure reactive state without losing reactivity. If I find $ref in an old codebase, migrating it is mechanical: swap to ref/computed, add .value, and drop the $$() wrappers.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Brevity vs explicitness: the transform saved keystrokes but hid which bindings were reactive — the maintainers chose explicitness.',
      'Authoring ergonomics vs tooling cost: pleasant to write, but expensive to support across the type system, linters, and editor tooling.',
      'Innovation vs stability: shipping it as experimental let the community test it, and the data justified pulling it — a healthy process, not a failure.',
    ],
    edgeCases: [
      'Destructuring a transformed variable without $() silently lost reactivity, a subtle footgun.',
      'Passing a transformed variable to a function that expected a ref required remembering $$(), or you\'d pass a snapshot.',
      'Mixed files (some refs, some $refs) made reasoning about a module harder.',
      'Type inference for the macros required special compiler/Volar support that ordinary refs don\'t.',
    ],
    runtimeBehavior: [
      'No runtime difference whatsoever — the output was standard ref/computed code.',
      'Dependency tracking, effect scheduling, and template auto-unwrapping behaved exactly as with explicit refs.',
      'Removing it is purely a source-level migration, never a behavioral regression.',
    ],
    scalability: [
      'On large teams, implicit reactivity scales poorly: new contributors couldn\'t see reactivity from the code, raising onboarding cost.',
      'Explicit .value scales better because it is locally obvious and uniformly supported by tooling.',
    ],
    productionConcerns: [
      'Codebases that adopted it incurred a forced migration when it was removed — a cautionary tale about depending on experimental features.',
      'Avoid building on opt-in, experimental compiler magic for production unless you accept future migration risk.',
      'Standardize on explicit refs and let ESLint enforce consistency.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Reactivity Transform = compile-time sugar to drop .value.',
    'Macros: $ref, $computed, $shallowRef, $toRef, $(), $$().',
    '$ref(0) → ref(0); count++ → count.value++ (compiler-inserted).',
    '$$(x) = recover the underlying ref (no .value appended).',
    'Pure syntax — runtime used ordinary refs.',
    'Experimental in 3.2, deprecated 3.3, REMOVED from core.',
    'Removed because it hid what was reactive + tooling cost.',
    'Modern supported style: plain ref() with explicit .value.',
    'Use toRefs/toRef for reactive destructuring (not $()).',
    'Recognize $ref/$$() = legacy/old-tutorial code.',
    'Lesson: explicit > implicit for framework APIs.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Rewrite this old transform code into modern, supported Vue: `let count = $ref(0); function inc() { count++ }`.',
      hint: 'Use ref() and explicit .value.',
      solution: {
        lang: 'ts',
        code: 'import { ref } from \'vue\'\nconst count = ref(0)\nfunction inc() {\n  count.value++\n}',
        explanation: [
          '$ref(0) becomes ref(0).',
          'count++ becomes count.value++ because count is now a ref container.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert `const double = $computed(() => count * 2)` to modern syntax, given count is a ref.',
      hint: 'Use computed() and add .value to count.',
      solution: {
        lang: 'ts',
        code: 'import { ref, computed } from \'vue\'\nconst count = ref(1)\nconst double = computed(() => count.value * 2)',
        explanation: [
          '$computed becomes computed().',
          'Inside, count must be read as count.value since the transform no longer inserts it.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Old code passed a transformed variable to a watcher with $$(): `track($$(count))`. Rewrite the whole thing with plain refs.',
      hint: 'With plain refs, count already IS the ref, so no $$() is needed.',
      solution: {
        lang: 'ts',
        code: 'import { ref, watch, type Ref } from \'vue\'\nconst count = ref(0)\nfunction track(r: Ref<number>) {\n  watch(r, (v) => console.log(v))\n}\ntrack(count) // pass the ref directly — no $$()',
        explanation: [
          'Because count is a real ref, you pass it directly; the watcher reacts to its changes.',
          '$$() existed only to recover the ref from a transformed variable that looked like a primitive.',
          'Removing the transform makes this code simpler and more honest.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why the transform was confusing: show two variables that look identical but behave differently, then the unambiguous modern version.',
      hint: 'One plain variable, one $ref, both with ++.',
      solution: {
        lang: 'ts',
        code: '// Transform-era ambiguity (NOT valid today):\n// let a = 1          // plain number — a++ is a one-off\n// let b = $ref(1)     // reactive — b++ triggers effects\n// a++; b++            // look identical, behave differently!\n\n// Modern, unambiguous:\nimport { ref } from \'vue\'\nlet a = 1            // clearly plain\nconst b = ref(1)     // clearly reactive\na++\nb.value++            // the .value SHOWS it is a reactive container',
        explanation: [
          'Under the transform, a++ and b++ were visually identical but semantically different — hidden reactivity.',
          'With explicit refs, b.value++ makes the reactivity visible at the call site.',
          'This visibility is exactly the readability the maintainers chose to preserve.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This topic is a rare interview gem: explaining it well proves you understand both why refs need .value and how framework teams weigh ergonomics against clarity — a senior-level perspective even though the feature itself is gone.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely ask it. Product companies (Zoho, Flipkart, Razorpay) may ask "what was $ref and why is it gone" to test reactivity depth. FAANG-level interviews use it as a springboard into API-design tradeoffs and the cost of implicit "magic".',
    whatInterviewersExpect:
      'They expect you to say it was compile-time sugar over normal refs, name the macros, explain it was removed for hiding reactivity and tooling cost, and articulate the broader lesson that explicit beats implicit for framework APIs.',
  },
}

export default reactivityTransform
