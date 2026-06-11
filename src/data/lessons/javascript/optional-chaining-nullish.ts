import type { ConceptLesson } from '../../../types/lesson'

const optionalChainingNullish: ConceptLesson = {
  // 1. Concept Summary
  slug: 'optional-chaining-nullish',
  name: 'Optional Chaining & Nullish Coalescing',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Optional chaining (?.) eliminates the most common runtime crash in JS: "Cannot read properties of undefined" when reading deep/optional data.',
    'Nullish coalescing (??) lets you supply defaults only for null/undefined, fixing the classic bug where || wrongly overrides 0, "" or false.',
    'Together they replace verbose && guards and ternaries, making access to API responses and nested config concise and safe.',
    'They are everyday tools in Vue/React components reading possibly-absent props, store state, and fetched data.',
    'Interviewers use them to check whether you understand the difference between "missing" (null/undefined) and "falsy" — a frequent source of bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Optional chaining is asking "is it there?" before reaching in; nullish coalescing is a backup snack only used if the box is truly empty.',
    story: [
      'Imagine you reach into a lunchbox inside a bag inside a locker. If the bag is not even there, your hand would hit nothing and you would get hurt.',
      'Optional chaining is gently checking each layer: "Is the locker there? Is the bag there?" If something is missing, you just stop and say "nothing" instead of crashing.',
      'Nullish coalescing is having a backup apple — but you only eat it if your lunchbox is actually empty (missing), not just because you brought zero cookies.',
      'So you safely reach as far as you can, and only grab the backup when there was truly nothing there.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes data has missing pieces — like user.address.city when the user has no address yet.',
    'Optional chaining (?.) checks each step: if the thing before ?. is null or undefined, it stops and gives undefined instead of throwing an error.',
    'Nullish coalescing (??) gives a fallback value, but only when the left side is null or undefined — not when it is 0 or an empty string.',
    'Using them together, you can read deep data safely and only fall back to a default when something is genuinely absent.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Optional chaining (?.) short-circuits a property access, method call, or index when the operand is null or undefined, yielding undefined instead of throwing. Nullish coalescing (??) returns its right operand only when the left is null or undefined.',
    how: '?. evaluates the left side; if it is null/undefined the whole chain short-circuits to undefined and the rest is not evaluated. ?? checks left == null (i.e. null or undefined) and returns right only then; otherwise it returns left unchanged.',
    why: 'They make reading uncertain data safe and concise, and give correct defaults that respect valid falsy values like 0 and "".',
    code: {
      label: 'Safe access plus correct defaults',
      lang: 'js',
      code: "const user = { name: 'Mia', settings: { volume: 0 } }\n\n// optional chaining: no crash if address is missing\nconst city = user.address?.city\nconsole.log(city) // undefined (not a crash)\n\n// nullish coalescing keeps a valid 0\nconst vol = user.settings.volume ?? 5\nconsole.log(vol) // 0  (?? does NOT replace 0)\n\n// compare with || which WOULD replace 0\nconsole.log(user.settings.volume || 5) // 5  (bug if 0 is valid)",
      explanation: [
        'user.address is undefined, so address?.city short-circuits to undefined instead of throwing.',
        '?? returns 5 only if volume is null/undefined; volume is 0, so it keeps 0.',
        '|| treats 0 as falsy and wrongly returns 5 — the classic bug ?? fixes.',
        'Use ?. for safe access and ?? for "default only when truly absent".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Optional chaining (?.) is a short-circuiting access operator: if the value to its left is null or undefined, the entire access expression evaluates to undefined and subsequent property accesses, calls, or index operations are skipped. Nullish coalescing (??) is a binary operator that returns its right operand only when the left operand is null or undefined (a "nullish" check using the loose-equals-to-null semantics), and otherwise returns the left operand. They differ from && / || which branch on truthiness, so ?? correctly preserves falsy-but-valid values such as 0, "", NaN, and false.',

  // 7. Internal Working
  internalWorking: [
    'For a?.b, the engine evaluates a; if a is null or undefined, it immediately produces undefined and short-circuits the remaining chain links (b, further ?., calls, indexing).',
    'Short-circuiting means side effects further down the chain (like a function call a?.fn()) do not run when the head is nullish.',
    'The check is specifically for null or undefined (the two nullish values), not for general falsiness.',
    'For a ?? b, the engine evaluates a; if a is null or undefined it evaluates and returns b, otherwise it returns a without evaluating b (short-circuit).',
    'The grammar forbids mixing ?? directly with && or || without parentheses, preventing ambiguous precedence at parse time.',
    'Optional call a?.() and optional index a?.[i] follow the same short-circuit rule on their left operand.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  user?.address?.city',
    '    │       │       │',
    '    │       │       └─ read city',
    '    │       └─ address null/undefined? -> stop, whole chain = undefined',
    '    └─ user null/undefined? -> stop, whole chain = undefined',
    '',
    '  value ?? fallback',
    '    │        │',
    '    └─ value is null/undefined ? ──yes──> fallback',
    '                                └──no───> value (even if 0, "", false)',
  ].join('\n'),

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — avoid the undefined crash',
      lang: 'js',
      code: "const data = {}\n\n// crashes: Cannot read properties of undefined (reading 'name')\n// const n = data.user.name\n\n// safe\nconst n = data.user?.name\nconsole.log(n) // undefined",
      explanation: [
        'data.user is undefined, so data.user.name would throw.',
        'data.user?.name short-circuits to undefined instead of throwing.',
        'This is the single most common use: safely reading possibly-absent data.',
      ],
    },
    intermediate: {
      label: 'Intermediate — ?? vs || with valid falsy values',
      lang: 'js',
      code: "function getVolume(config) {\n  // wrong: 0 becomes 50\n  const wrong = config.volume || 50\n  // right: only null/undefined becomes 50\n  const right = config.volume ?? 50\n  return { wrong, right }\n}\n\nconsole.log(getVolume({ volume: 0 }))   // { wrong: 50, right: 0 }\nconsole.log(getVolume({}))              // { wrong: 50, right: 50 }",
      explanation: [
        '|| replaces any falsy value, so a deliberate 0 is lost.',
        '?? only replaces null/undefined, preserving 0 as a real setting.',
        'When the absent case is missing data (not "falsy input"), ?? is correct.',
        'This distinction is a favorite interview gotcha.',
      ],
    },
    advanced: {
      label: 'Advanced — optional calls, indexes, and chaining with ??',
      lang: 'js',
      code: "const api = {\n  user: { getName: () => 'Ada' },\n}\n\n// optional method call: no crash if getName is absent\nconst name = api.user?.getName?.() ?? 'Guest'\nconsole.log(name) // 'Ada'\n\nconst missing = api.admin?.getName?.() ?? 'Guest'\nconsole.log(missing) // 'Guest'\n\nconst arr = null\nconsole.log(arr?.[0] ?? 'empty') // 'empty'",
      explanation: [
        '?.() calls the method only if it exists, otherwise short-circuits to undefined.',
        'Combining ?. with ?? gives "safe read, then default" in one line.',
        '?.[i] safely indexes even when the container is nullish.',
        'Note you must parenthesize if combining ?? with && or || in the same expression.',
      ],
    },
    realProject: {
      label: 'Real project — rendering optional API data in Vue/React',
      lang: 'js',
      code: "// Component receives a possibly-incomplete user from an API\nfunction displayName(user) {\n  return user?.profile?.displayName ?? user?.email ?? 'Anonymous'\n}\n\n// In a Vue template: {{ user?.profile?.avatarUrl ?? defaultAvatar }}\n// In React JSX:    {user?.profile?.bio ?? 'No bio yet'}\nconsole.log(displayName({ email: 'a@b.com' })) // 'a@b.com'\nconsole.log(displayName(null))                 // 'Anonymous'",
      explanation: [
        'API responses are often partial; ?. avoids crashes on missing nested fields.',
        'A chain of ?? expresses a clean fallback priority: displayName, then email, then a default.',
        'This exact pattern appears constantly in Vue templates and React JSX rendering fetched data.',
        '?? preserves an empty-string bio only if you intend "" to be valid; otherwise treat it explicitly.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What does optional chaining (?.) do?',
      answer: 'If the value before ?. is null or undefined, the whole access expression short-circuits to undefined instead of throwing a TypeError. Otherwise it accesses the property/call/index normally.',
      explanation: 'The core idea is safe access with short-circuit to undefined, not a general "if exists" for any falsy value.',
    },
    {
      level: 'beginner',
      question: 'What is the difference between ?? and ||?',
      answer: '|| returns the right side when the left is falsy (0, "", false, NaN, null, undefined). ?? returns the right side only when the left is null or undefined, so it preserves valid falsy values.',
      explanation: 'The 0/""/false case is the key distinction interviewers look for.',
    },
    {
      level: 'intermediate',
      question: 'Does a?.b() still call b if a is null?',
      answer: 'No. Optional chaining short-circuits: if a is null/undefined, the entire chain stops and returns undefined, so b() is never invoked and its side effects do not run.',
      explanation: 'Short-circuit semantics (skipping side effects) is the subtle but important part.',
    },
    {
      level: 'intermediate',
      question: 'Why can you not write a ?? b || c without parentheses?',
      answer: 'The language grammar forbids mixing ?? with && or || without explicit parentheses to avoid ambiguous precedence. You must write (a ?? b) || c or a ?? (b || c).',
      explanation: 'Knowing this is a syntax error (not a runtime one) shows familiarity with the spec.',
    },
    {
      level: 'advanced',
      question: 'What exactly is "nullish", and how is the check implemented?',
      answer: 'Nullish means null or undefined only. The check is equivalent to value === null || value === undefined (i.e. value == null). It deliberately excludes other falsy values.',
      explanation: 'Precise definition of nullish vs falsy separates strong candidates.',
    },
    {
      level: 'senior',
      question: 'How do ?. and ?? interact with TypeScript and what pitfalls arise?',
      answer: 'TS narrows the result of a?.b to include undefined, so downstream code must handle it; ?? then provides a typed default. Pitfalls: over-chaining masks real bugs (silently undefined), and ?? on a value typed as possibly empty-string can keep "" when you expected a default.',
      explanation: 'Connecting to TS narrowing and the "silent undefined" anti-pattern is a senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between null and undefined for the purposes of ??',
    'Does ?. work for function calls and array indexing too?',
    'Why is mixing ?? with || a syntax error?',
    'When would || actually be the correct choice over ???',
    'How does optional chaining affect side effects in a chain?',
    'How does TypeScript type the result of an optional chain?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using || to set defaults for numbers or strings.',
      why: '|| replaces valid falsy values like 0 and "", causing subtle bugs (e.g. a 0 quantity becomes the default).',
      fix: 'Use ?? when only null/undefined should trigger the default.',
    },
    {
      mistake: 'Over-using ?. so real bugs become silent undefined.',
      why: 'If a value should always exist, ?. hides the missing-data bug and pushes the failure further away.',
      fix: 'Use ?. only where absence is genuinely expected; otherwise assert/validate the data.',
    },
    {
      mistake: 'Mixing ?? with && or || without parentheses.',
      why: 'It is a syntax error by design to avoid ambiguous precedence.',
      fix: 'Add explicit parentheses: (a ?? b) || c.',
    },
    {
      mistake: 'Assuming a?.b assigns or creates b.',
      why: 'Optional chaining is read/call only; you cannot use it on the left of an assignment.',
      fix: 'Guard before assigning, or ensure the object exists first.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Templates read possibly-absent fetched data with user?.profile?.name and provide defaults via ?? without crashing during loading states.' },
    { area: 'React', detail: 'JSX renders optional API fields (data?.items?.length ?? 0); ?? avoids the 0-becomes-default bug common with ||.' },
    { area: 'Node.js', detail: 'Reading nested config/env and request bodies safely (req.body?.user?.id), with ?? to apply defaults only when keys are truly missing.' },
    { area: 'Backend', detail: 'Defensive parsing of third-party API responses where schema fields are optional; chained ?? expresses fallback priorities.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Short-circuiting avoids evaluating the rest of the chain when the head is nullish, skipping unnecessary work.',
      'Replaces verbose && guard chains with one expression, reducing code and branch mistakes.',
    ],
    bad: [
      'Negligible runtime cost, but excessive defensive chaining can hide bugs that surface as harder-to-trace failures later.',
      'Deeply chained optional access on hot paths is fine performance-wise but can signal a data model that should be normalized.',
    ],
    optimizations: [
      'Validate/normalize data at the boundary so deep optional chains are not needed everywhere.',
      'Destructure with defaults for repeatedly accessed shapes instead of repeating long ?. chains.',
      'Prefer ?? over || for numeric/string defaults to avoid correctness bugs (which are the real cost).',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['null-vs-undefined', 'truthy-falsy', 'data-types'],
    nextConcepts: ['destructuring', 'type-coercion', 'equality-comparison'],
    dependencyNote:
      'These operators build directly on understanding null vs undefined and truthy/falsy. They pair with destructuring (defaults) and equality semantics; misusing || vs ?? is rooted in the truthy/falsy concept.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write user.address.city and show it throws when address is undefined.',
      'Rewrite as user?.address?.city and explain the short-circuit to undefined.',
      'Write config.volume || 50 with volume = 0 and show it wrongly yields 50.',
      'Change to config.volume ?? 50 and show it correctly yields 0.',
      'Say: "?. = safe access; ?? = default only for null/undefined; that is the falsy-vs-nullish distinction."',
    ],
    diagram: [
      '  a?.b?.c        a ?? b',
      '   │   │          │',
      '  null/undef?    null/undef? -> b',
      '   -> undefined  else        -> a (keeps 0, "", false)',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Optional chaining ?. short-circuits a property access, call, or index to undefined when the left side is null or undefined, preventing "cannot read property of undefined" crashes. Nullish coalescing ?? returns its fallback only when the left side is null or undefined, unlike || which replaces all falsy values — so ?? correctly preserves 0, "", and false. They are commonly combined: a?.b ?? default. You cannot mix ?? with && / || without parentheses.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Optional chaining and nullish coalescing are two ES2020 operators that make working with uncertain data both safe and correct. Optional chaining, written with ?. before a property, call, or index, evaluates the left side and, if it is null or undefined, short-circuits the whole expression to undefined instead of throwing the classic "cannot read properties of undefined" error. Because it short-circuits, anything further down the chain — including method calls and their side effects — is skipped. Nullish coalescing, written ??, provides a default, but only when the left operand is null or undefined. That is the crucial difference from logical OR: || treats every falsy value as "missing", so a valid 0, empty string, or false gets wrongly replaced, whereas ?? respects those as real values. In practice you combine them, like user?.profile?.name ?? "Anonymous", which is everywhere in Vue templates and React JSX rendering fetched data that may be partial during loading. One gotcha: the grammar forbids mixing ?? directly with && or || without parentheses, to avoid ambiguous precedence. And a design caution: over-using ?. can hide genuine bugs by turning them into silent undefined, so I reserve it for places where absence is genuinely expected and validate data at the boundary otherwise.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Safety vs masking bugs: ?. prevents crashes but can silently swallow data-shape errors that should be surfaced.',
      '?? correctness vs habit: ?? is right for null/undefined defaults, but || is still correct when you truly want any falsy value to fall back (e.g. empty search string -> show all).',
    ],
    edgeCases: [
      'a?.b is read/call only — it cannot appear on the left of an assignment.',
      'Mixing ?? with && / || without parentheses is a SyntaxError, not a runtime error.',
      '?? treats only null and undefined as nullish; NaN, 0, "", false are kept.',
      'Optional chaining short-circuits side effects: a?.fn() does not call fn when a is nullish.',
    ],
    runtimeBehavior: [
      'Short-circuit propagates through the entire chain once a nullish head is hit.',
      'The result of a short-circuited chain is undefined specifically (never null).',
      '?? evaluates the right side lazily, only when the left is nullish.',
    ],
    scalability: [
      'Deep ?. chains hint at an un-normalized data model; normalizing at the API boundary scales better.',
      'In large codebases, lint rules can enforce ?? for defaults to prevent the 0/"" bug class at scale.',
    ],
    productionConcerns: [
      'Silent undefined from over-chaining can produce hard-to-trace downstream failures; pair with schema validation.',
      'TypeScript narrows ?. results to include undefined, so handle or default it to keep types sound.',
      'Babel/transpilation for older targets expands ?. into guarded temp variables — verify output size on hot paths.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '?. = safe access: null/undefined head -> whole chain = undefined.',
    'Works for property (a?.b), call (a?.()), index (a?.[i]).',
    'Short-circuits: skips side effects further down the chain.',
    'Result of a short-circuit is undefined (never null).',
    '?? = default only when left is null OR undefined.',
    '|| = default when left is ANY falsy (0, "", false, NaN, null, undefined).',
    'Use ?? for numeric/string defaults to keep valid 0 / "".',
    'Cannot mix ?? with && or || without parentheses (SyntaxError).',
    'Cannot use ?. on the left side of an assignment.',
    'Common combo: a?.b?.c ?? fallback.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Safely read order.customer.address.zip and return undefined if any part is missing.',
      hint: 'Chain ?. at each uncertain step.',
      solution: {
        lang: 'js',
        code: "function getZip(order) {\n  return order?.customer?.address?.zip\n}\ngetZip({}) // undefined (no crash)\ngetZip({ customer: { address: { zip: '90001' } } }) // '90001'",
        explanation: [
          'Each ?. guards the next access against null/undefined.',
          'If any link is nullish the whole expression yields undefined instead of throwing.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write withDefault(config) returning config.retries unless it is null/undefined, in which case 3 — but keep a configured 0.',
      hint: 'Use ?? not ||.',
      solution: {
        lang: 'js',
        code: "function withDefault(config) {\n  return config.retries ?? 3\n}\nwithDefault({ retries: 0 })  // 0  (kept)\nwithDefault({})              // 3  (default)",
        explanation: [
          '?? only falls back on null/undefined, so a deliberate 0 retries is preserved.',
          'Using || here would wrongly turn 0 into 3.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Given possibly-missing api.user.getRoles(), return its result or [] without crashing, and explain why ?. is needed twice.',
      hint: 'Guard both the object and the method with ?.',
      solution: {
        lang: 'js',
        code: "const api = { user: {} }\nconst roles = api.user?.getRoles?.() ?? []\nconsole.log(roles) // []\n\n// user?. guards a missing user; getRoles?.() guards a missing method.",
        explanation: [
          'api.user?. handles a missing user object.',
          'getRoles?.() handles user existing but the method not, avoiding "is not a function".',
          '?? [] converts the resulting undefined into a safe empty array.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain and fix: const port = process.env.PORT || 3000 fails when PORT="0". Then show why parentheses are needed if combining ?? with ||.',
      hint: 'Switch to ?? for the port; parenthesize mixed operators.',
      solution: {
        lang: 'js',
        code: "// Bug: PORT=\"0\" is a valid (if unusual) value but || drops it\nconst portWrong = process.env.PORT || 3000\n\n// Fix: only fall back when truly unset\nconst port = process.env.PORT ?? 3000\n\n// Mixing requires parentheses (otherwise SyntaxError):\nconst level = (process.env.LEVEL ?? 'info') || 'info'",
        explanation: [
          'process.env values are strings; "0" is truthy actually, but the principle holds for numeric configs where 0 is meaningful — ?? preserves intentional empties.',
          'The last line shows you must parenthesize when ?? is combined with || to avoid the grammar-level SyntaxError.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'These operators prevent the most common crash in JS apps and the most common defaulting bug. Using them correctly is a daily signal of careful, modern coding, especially when handling API data and config.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and the ?? vs || difference. Product companies (Zoho, Flipkart, Razorpay) give a snippet where || breaks on 0/"" and ask you to spot and fix it. FAANG-level interviews probe short-circuit side effects, the nullish-vs-falsy spec detail, and the parentheses syntax rule.',
    whatInterviewersExpect:
      'You can define both operators precisely, explain nullish (null/undefined) vs falsy, demonstrate the 0/"" bug with || and the ?? fix, and note the short-circuit behavior and the no-mixing-without-parentheses rule.',
  },
}

export default optionalChainingNullish
