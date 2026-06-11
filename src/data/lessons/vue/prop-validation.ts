import type { ConceptLesson } from '../../../types/lesson'

const propValidation: ConceptLesson = {
  // 1. Concept Summary
  slug: 'prop-validation',
  name: 'Prop Validation',
  category: 'components',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Prop validation is the runtime contract that catches wrong data at the component boundary before it causes confusing downstream bugs.',
    'It documents a component\'s API in code — anyone reading the component instantly knows the expected types, required props, and allowed values.',
    'In team and library codebases, validation turns silent failures into clear, early warnings during development.',
    'Interviewers use it to gauge whether you build robust, self-documenting components or just throw data around.',
    'Combined with TypeScript, it gives both compile-time and runtime safety on the most-used data path in Vue.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Prop validation is like the bouncer at a party checking the guest list before letting anyone in.',
    story: [
      'Imagine a party where only certain people are invited, and everyone must wear the right colour wristband.',
      'A bouncer stands at the door. If you have no invitation, or the wrong wristband, the bouncer stops you and says exactly what is wrong.',
      'This keeps the party safe and predictable — no random strangers wander in and break things.',
      'A component\'s prop validation is that bouncer: it checks that incoming data has the right type, is present when required, and matches allowed values, warning loudly if something is off.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When a parent passes data to a child via props, the child can state rules about what it expects: what type each prop should be, whether it is required, and what default to use if missing.',
    'Vue checks these rules while you develop. If the parent passes a number where a string was expected, Vue prints a warning in the console pointing at the problem.',
    'You can even write a custom validator function for finer rules, like "this prop must be one of red, green, or blue".',
    'These checks run only during development to help you catch mistakes; they are removed in the production build so they do not slow the app.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Prop validation is declaring rules on a component\'s props — type, required, default, and custom validator — so Vue can verify incoming values and warn on mismatches during development.',
    how: 'Use the object syntax of defineProps where each prop maps to a descriptor: { type, required, default, validator }. Vue runs these checks when resolving props for each instance.',
    why: 'It catches bad data early, documents the component contract, and prevents subtle bugs from wrong types or missing values.',
    code: {
      label: 'Validated props with type, required, default, and validator',
      lang: 'vue',
      code: '<script setup>\ndefineProps({\n  title: { type: String, required: true },\n  count: { type: Number, default: 0 },\n  status: {\n    type: String,\n    default: \'active\',\n    validator: (v) => [\'active\', \'paused\', \'archived\'].includes(v),\n  },\n})\n</script>\n<template>\n  <h2>{{ title }} ({{ status }}): {{ count }}</h2>\n</template>',
      explanation: [
        '`title` is a required String — omitting it warns in dev.',
        '`count` is a Number defaulting to 0.',
        '`status` has a validator restricting it to three allowed strings.',
        'A bad value (e.g. status="deleted") logs a console warning during development.',
        'All of this self-documents the component\'s expected inputs.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Prop validation is the declarative specification of constraints on a component\'s props using the object form of defineProps. Each prop descriptor may include a type (constructor or array of constructors), a required flag, a default value (a factory for reference types), and a validator function. During prop resolution Vue checks each value against these constraints and emits development-only warnings on type mismatch, missing required props, or failed validators; the checks are stripped from production builds.',

  // 7. Internal Working
  internalWorking: [
    'When the component is defined, Vue normalises the props option into an internal map of name → { type, required, default, validator }.',
    'On each instance creation, Vue resolves raw props from the parent vnode and merges in declared defaults (invoking factories for object/array defaults).',
    'For each declared prop, in development Vue runs assertType against the declared constructor(s), checking via typeof or instanceof as appropriate.',
    'If a required prop is absent, or a type check fails, or a validator returns false, Vue calls warn() with a descriptive message pointing to the component and prop.',
    'Boolean props get special casting: an empty/no value becomes true, and string "true"/"false" handling follows documented rules.',
    'In a production build, the validation branches are tree-shaken out so prop resolution does only the work needed to populate values.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   parent passes :status="value"
                 │
                 ▼
   ┌─────────────────────────────────┐
   │  Prop resolver (per instance)   │
   │  1. apply default if missing    │
   │  2. check required              │
   │  3. assertType(value, type)     │
   │  4. validator(value) === true ? │
   └───────────────┬─────────────────┘
            pass ✓ │        ✗ fail (dev only)
                   ▼               │
            child reads prop       └──► console.warn(...)`,

  // 9. Memory Visualization (omitted)

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — type and required',
      lang: 'vue',
      code: '<script setup>\ndefineProps({\n  id: { type: Number, required: true },\n  label: { type: String, required: true },\n})\n</script>\n<template>\n  <option :value="id">{{ label }}</option>\n</template>',
      explanation: [
        'Both props declare a type and required: true.',
        'Passing a string id or omitting label warns in development.',
        'The declaration doubles as documentation of the contract.',
        'Production strips the checks for zero overhead.',
      ],
    },
    intermediate: {
      label: 'Intermediate — multiple types and reference default',
      lang: 'vue',
      code: '<script setup>\ndefineProps({\n  size: { type: [String, Number], default: \'md\' },\n  tags: { type: Array, default: () => [] },\n  config: { type: Object, default: () => ({ open: false }) },\n})\n</script>\n<template>\n  <div :data-size="size">{{ tags.length }} tags</div>\n</template>',
      explanation: [
        '`size` accepts either a String or a Number via an array of constructors.',
        '`tags` and `config` use FACTORY defaults — required for reference types.',
        'A plain object/array default would be shared across instances and leak mutations.',
        'Each instance gets its own fresh default array/object.',
      ],
    },
    advanced: {
      label: 'Advanced — custom validator with helpful message',
      lang: 'vue',
      code: '<script setup>\nconst ALLOWED = [\'sm\', \'md\', \'lg\']\ndefineProps({\n  variant: {\n    type: String,\n    default: \'md\',\n    validator(value) {\n      const ok = ALLOWED.includes(value)\n      if (!ok) console.warn(`variant must be one of ${ALLOWED.join(\', \')}, got \"${value}\"`)\n      return ok\n    },\n  },\n})\n</script>\n<template>\n  <button :class="`btn-${variant}`">Click</button>\n</template>',
      explanation: [
        'The validator enforces an allow-list of variant values.',
        'It logs a precise message so the developer sees exactly what was wrong.',
        'Returning false also triggers Vue\'s own validation warning in dev.',
        'Validators run per instance during prop resolution.',
        'This pattern documents and guards enum-like props.',
      ],
    },
    realProject: {
      label: 'Real project — runtime validation + TypeScript together',
      lang: 'vue',
      code: '<script setup lang="ts">\n// Compile-time type safety for internal callers...\ninterface Props {\n  amount: number\n  currency?: string\n}\nconst props = defineProps<Props>()\n// ...plus a runtime guard for untyped/external data (e.g. CMS):\nif (import.meta.env.DEV && typeof props.amount !== \'number\') {\n  console.warn(\'amount prop received non-number at runtime\')\n}\n</script>\n<template>\n  <span>{{ props.currency ?? \'USD\' }} {{ props.amount }}</span>\n</template>',
      explanation: [
        'TypeScript checks callers at compile time.',
        'A dev-only runtime guard catches bad data from untyped sources like a CMS or API.',
        'Combining both gives defence in depth on the component boundary.',
        'The guard is gated behind DEV so it is stripped in production.',
        'Real apps often need both layers because not all data is typed at the source.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What can you specify when validating a prop?',
      answer: 'A type (or array of types), whether it is required, a default value, and a custom validator function.',
      explanation: 'Listing all four descriptor keys shows you know the full object syntax.',
    },
    {
      level: 'beginner',
      question: 'When do prop validation warnings appear?',
      answer: 'Only during development. Vue strips validation from production builds for performance, so you must rely on dev to catch issues.',
      explanation: 'The dev-only nature is a common gotcha — production silently accepts bad data.',
    },
    {
      level: 'intermediate',
      question: 'Why must object and array defaults be returned from a factory function?',
      answer: 'Because reference types would otherwise be shared across all instances; a factory ensures each instance gets a fresh copy, preventing cross-instance mutation bugs.',
      explanation: 'This is the single most common prop-validation interview catch.',
    },
    {
      level: 'intermediate',
      question: 'How does a custom validator work and what should it return?',
      answer: 'It is a function receiving the prop value (and in newer Vue, the full props object); it returns true if valid, false otherwise. A false return triggers a dev warning.',
      explanation: 'Mentioning the boolean return and dev warning shows precise understanding.',
    },
    {
      level: 'advanced',
      question: 'How does prop validation relate to TypeScript prop typing?',
      answer: 'TypeScript checks types at compile time for typed callers; runtime validation catches bad data from untyped sources (APIs, CMS, dynamic components). They are complementary — type-only defineProps gives no runtime check.',
      explanation: 'Recognising that TS is compile-time only and runtime validation fills the gap is the senior-leaning insight.',
    },
    {
      level: 'senior',
      question: 'What are the limitations of Vue\'s built-in prop validation for complex shapes?',
      answer: 'It checks constructor type, presence, and a single validator boolean — it cannot deeply validate nested object shapes or give structured errors. For complex contracts you add a schema validator (e.g. zod) in the validator or at the boundary.',
      explanation: 'Knowing the limits and the escape hatch to schema validation is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is prop validation different from TypeScript prop types?',
    'Does prop validation run in production? (no)',
    'How do you validate an enum-like prop? (validator with includes)',
    'What is the factory-default rule and why does it exist?',
    'How do Boolean props get cast?',
    'Where would you put deep schema validation (zod) for props?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Relying on prop validation to protect production.',
      why: 'Validation is stripped from production builds, so it only helps during development.',
      fix: 'Use TypeScript for compile-time safety and add explicit runtime guards or schema validation for untrusted data.',
    },
    {
      mistake: 'Using a plain object/array literal as a default.',
      why: 'The same reference is shared across all instances, causing cross-instance state leaks.',
      fix: 'Return it from a factory: default: () => ([]) or () => ({}).',
    },
    {
      mistake: 'Expecting the validator to deeply validate nested object structure.',
      why: 'Built-in validation only checks the top-level type and a single boolean validator result.',
      fix: 'Validate nested shapes with a schema library inside the validator or at the data boundary.',
    },
    {
      mistake: 'Setting required: true AND a default on the same prop.',
      why: 'It is contradictory — if it is required the default never applies, signalling confused intent.',
      fix: 'Choose one: required for mandatory props, default for optional ones.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Component library', detail: 'Public components validate props strictly so consumers get clear dev warnings when they misuse the API.' },
    { area: 'Vue', detail: 'App components validate enum-like props (size/variant/status) with validators to enforce design-system constraints.' },
    { area: 'Nuxt', detail: 'Components fed by CMS or API data add runtime validation because the source is untyped at runtime.' },
    { area: 'TypeScript', detail: 'Teams pair type-only defineProps for compile-time safety with targeted runtime checks at untyped boundaries.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Validation is dev-only and stripped in production, so it adds no runtime cost to shipped apps.',
      'Catching bad data early avoids expensive debugging and downstream re-render bugs.',
    ],
    bad: [
      'Heavy validators (e.g. deep schema parsing) running on every prop change can slow development hot paths.',
      'Overly granular validated props increase boilerplate without proportional benefit.',
    ],
    optimizations: [
      'Keep validators cheap (membership checks, typeof) and avoid deep parsing per render.',
      'Validate untrusted data once at the boundary rather than repeatedly in every component.',
      'Prefer TypeScript for typed call sites and reserve runtime validation for untyped sources.',
      'Gate expensive runtime guards behind import.meta.env.DEV.',
    ],
  },

  // 16. Security Considerations (omitted)

  // 17. Related Concepts
  related: {
    prerequisites: ['props', 'components-basics'],
    nextConcepts: ['typescript-with-vue', 'component-events', 'attribute-fallthrough'],
    dependencyNote:
      'Prop validation extends props with a runtime contract. It pairs with typescript-with-vue (compile-time typing) and underpins robust component-events APIs in shared component libraries.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a prop descriptor object on the board: { type, required, default, validator }.',
      'Draw an incoming value hitting a "resolver" box.',
      'List the four checks in order: default → required → type → validator.',
      'Branch the output into "pass → child reads" and "fail → dev warning".',
      'Say: "Validation is a dev-time contract; it documents the API and warns on bad data but is stripped in production, so TypeScript and boundary guards cover the rest."',
    ],
    diagram: `   { type, required, default, validator }
                │
                ▼
        [ resolve + check ]
          /            \\
      pass            fail (DEV only)
        │                │
   child reads      console.warn`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Prop validation uses the object form of defineProps to declare type, required, default, and a custom validator per prop. Vue checks incoming values and warns in development on mismatches, missing required props, or failed validators. Object/array defaults must come from a factory to avoid shared references. Validation is dev-only and stripped from production, so pair it with TypeScript for compile-time safety and add runtime guards or schema validation for untyped data. It both guards and documents the component contract.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Prop validation is how a Vue component declares a runtime contract for its inputs. Using the object form of defineProps, each prop becomes a descriptor that can specify a type — a constructor or an array of constructors — whether it is required, a default value, and a custom validator function. When Vue resolves props for an instance, it applies defaults, checks required props, asserts the declared type, and runs the validator; if anything fails it emits a descriptive console warning. The crucial caveat is that these checks run only in development — Vue strips them from production builds for performance — so validation is a developer aid and self-documentation tool, not production protection. There are a couple of important rules. Object and array defaults must be returned from a factory function, default: () => ([]), because a plain reference would be shared across every instance and cause mutations to leak between them. And the built-in validator only checks the top-level type plus a single boolean result; it cannot deeply validate a nested object shape, so for complex contracts you reach for a schema library like zod, either inside the validator or, better, at the data boundary where untyped API or CMS data enters. In a modern TypeScript codebase, prop validation and types are complementary: type-only defineProps gives compile-time safety for typed callers but no runtime check, while runtime validation catches bad data from untyped sources. The combination — types for internal call sites, runtime guards at untrusted boundaries — gives defence in depth on the most heavily used data path in a Vue app.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Runtime validation gives clear dev warnings but adds boilerplate and is absent in production; TypeScript is compile-time only — you often need both.',
      'Strict validators improve robustness but can become brittle as the design system evolves; balance enforcement with flexibility.',
    ],
    edgeCases: [
      'Reference-type default sharing without a factory.',
      'Boolean prop casting rules (presence = true, string "false" pitfalls).',
      'required: true combined with default is contradictory.',
      'Validators cannot deeply inspect nested shapes — only a single boolean is returned.',
    ],
    runtimeBehavior: [
      'Validation branches execute only in development and are tree-shaken from production.',
      'Defaults (including factories) are applied before the child reads the prop and before validators run.',
      'A failing validator returns false, triggering Vue\'s warn() with component/prop context.',
    ],
    scalability: [
      'In large component libraries, consistent validation is the documented public contract teams depend on.',
      'Validating untrusted data once at the boundary scales better than re-validating in every consuming component.',
    ],
    productionConcerns: [
      'Because validation is dev-only, untyped production data can silently flow in — guard external inputs explicitly.',
      'Expensive validators in hot paths slow dev iteration; keep them cheap.',
      'Inconsistent validation across components erodes the contract; enforce conventions via lint rules or a base component layer.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Object syntax: { type, required, default, validator }.',
    'type = constructor or array of constructors ([String, Number]).',
    'Object/array default MUST be a factory: () => ([]).',
    'Validator returns true/false; false → dev warning.',
    'Validation runs in DEV only, stripped in production.',
    'required: true and default together is contradictory.',
    'Boolean props: presence implies true.',
    'TypeScript types = compile-time; validation = runtime; use both.',
    'Built-in validation is shallow — use zod for deep shapes.',
    'Validate untrusted data once at the boundary.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Declare a prop `email` that is a required String.',
      hint: 'Object syntax with type and required.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps({\n  email: { type: String, required: true },\n})\n</script>',
        explanation: [
          'type String enforces a string in development.',
          'required: true warns if the parent omits it.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Declare a prop `items` that is an Array defaulting to an empty array, correctly.',
      hint: 'Reference defaults need a factory.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps({\n  items: { type: Array, default: () => [] },\n})\n</script>',
        explanation: [
          'The factory () => [] gives each instance its own array.',
          'A plain [] default would be shared across instances and leak mutations.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Add a validator to a `level` prop so only "low", "medium", or "high" are accepted, defaulting to "medium".',
      hint: 'Use includes in the validator.',
      solution: {
        lang: 'vue',
        code: '<script setup>\ndefineProps({\n  level: {\n    type: String,\n    default: \'medium\',\n    validator: (v) => [\'low\', \'medium\', \'high\'].includes(v),\n  },\n})\n</script>',
        explanation: [
          'The validator restricts level to an allow-list.',
          'An invalid value triggers a development warning.',
          'The default applies when level is omitted.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A component receives `user` from an untyped API. Add both TypeScript typing and a DEV-only runtime guard ensuring user.id is a number.',
      hint: 'Type-only defineProps + a guard behind import.meta.env.DEV.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\ninterface User { id: number; name: string }\nconst props = defineProps<{ user: User }>()\nif (import.meta.env.DEV && typeof props.user?.id !== \'number\') {\n  console.warn(\'user.id should be a number at runtime\')\n}\n</script>\n<template>\n  <span>#{{ props.user.id }} {{ props.user.name }}</span>\n</template>',
        explanation: [
          'TypeScript types the prop for internal callers at compile time.',
          'The DEV-gated guard catches malformed runtime data from the untyped API.',
          'The guard is stripped from production by the bundler.',
          'This is defence in depth: compile-time types plus a runtime boundary check.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Prop validation shows you build robust, self-documenting components. It is the difference between components that fail loudly and early versus ones that pass bad data silently into production. Understanding its dev-only nature and how it complements TypeScript marks you as someone who thinks about contracts.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask what you can validate and how. Product companies (Zoho, Flipkart, Razorpay) ask about the factory-default rule and validators for enum props. FAANG-level interviews probe the limits of built-in validation, its dev-only stripping, and where schema validation belongs.',
    whatInterviewersExpect:
      'They expect you to use the object syntax confidently, know that validation is dev-only, apply factory defaults for reference types, and explain how validation and TypeScript combine for full coverage.',
  },
}

export default propValidation
