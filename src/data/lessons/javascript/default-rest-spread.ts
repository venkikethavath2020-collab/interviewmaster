import type { ConceptLesson } from '../../../types/lesson'

const defaultRestSpread: ConceptLesson = {
  // 1. Concept Summary
  slug: 'default-rest-spread',
  name: 'Default, Rest & Spread',
  category: 'functions',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Default parameters replace the fragile `x = x || fallback` idiom, which silently breaks for valid falsy values like 0 or empty string.',
    'Rest parameters give a real array of variadic arguments, finally retiring the awkward array-like `arguments` object (which arrow functions do not even have).',
    'Spread makes copying and merging arrays/objects, and passing arrays as arguments, concise and immutable-friendly — the backbone of React/Redux state updates.',
    'These three (all using ... except defaults) appear constantly in modern code, so interviewers expect you to know the difference and the shallow-copy caveat.',
    'Confusing rest (gathering into an array) with spread (expanding an iterable) is a classic beginner trip-up worth nailing.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Default is a backup snack if you forgot yours; rest is one big bag that collects all the leftover toys; spread is dumping that bag out so each toy is separate again.',
    story: [
      'Imagine going on a trip. If you forget to bring a snack, the teacher gives you a default backup snack so you are never empty-handed.',
      'At cleanup time, you sweep ALL the loose toys into one big bag — that bag "collecting the rest" is like rest parameters.',
      'Later, you turn the bag upside down and every toy spills out one by one onto the table — that spilling-out is like spread.',
      'So one ... can either scoop many things into a single bag (rest) or pour a bag back out into many separate things (spread), depending on where you use it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A default parameter is a fallback value a function uses when you do not pass that argument.',
    'A rest parameter uses ... before the last parameter name to collect any extra arguments into a normal array.',
    'The spread operator also uses ..., but it does the opposite: it takes an array (or object) and spreads its items out individually.',
    'The trick: ... in a function definition or on the left side gathers (rest), while ... in a call or literal expands (spread).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Default parameters provide fallback values when an argument is undefined. Rest parameters (...name) collect remaining arguments into a real array. The spread syntax (...iterable) expands an iterable/object into individual elements or properties. Rest gathers; spread expands — same ... token, opposite directions.',
    how: 'Defaults are evaluated when the argument is undefined (not just missing). Rest must be the last parameter and produces an Array. Spread works in array literals, function calls, and object literals (object spread copies own enumerable properties).',
    why: 'They make variadic functions, copying/merging, and immutable updates concise and safe — avoiding the falsy-value bug of `||` defaults and the array-like clumsiness of `arguments`.',
    code: {
      label: 'All three in one place',
      lang: 'js',
      code: `function order(item, qty = 1, ...extras) {  // default + rest\n  return { item, qty, extras }\n}\norder('tea')                 // { item:'tea', qty:1, extras:[] }\norder('tea', 2, 'hot', 'big') // { item:'tea', qty:2, extras:['hot','big'] }\n\nconst nums = [3, 1, 2]\nMath.max(...nums)            // 3 — spread expands array into args\nconst copy = [...nums, 4]    // [3,1,2,4] — spread to clone + add`,
      explanation: [
        '`qty = 1` is a default: used only when qty is undefined (not when it is 0).',
        '`...extras` is a rest parameter: it collects all remaining args into a real array.',
        '`Math.max(...nums)` uses spread to expand the array into individual arguments.',
        '`[...nums, 4]` uses spread to shallow-copy the array and append — an immutable update.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Default parameters supply a fallback expression evaluated when the corresponding argument is undefined; they are initialized left to right within a parameter scope subject to the Temporal Dead Zone. Rest parameters (...identifier), which must be the final formal parameter, collect all remaining positional arguments into a genuine Array. Spread syntax (...iterable) expands any iterable into discrete elements in array literals and call argument lists, while object spread copies own enumerable properties into a new object. Both rest and spread perform shallow operations: nested objects/arrays are copied by reference.',

  // 7. Internal Working
  internalWorking: [
    'When a function is invoked, the engine binds each formal parameter; if an argument is undefined and a default exists, the default expression is evaluated and assigned.',
    'Default parameters are evaluated left to right in their own scope, so a later parameter referencing an earlier one works, but referencing a not-yet-initialized one throws (TDZ).',
    'A rest parameter collects all positional arguments beyond the named ones by creating a new Array and copying those argument values into it.',
    'Spread in a call iterates the iterable (via its iterator protocol) and pushes each yielded value as a separate argument.',
    'Spread in an array literal iterates and copies element references into the new array; object spread reads own enumerable keys and assigns them onto the target (later keys overriding earlier ones).',
    'All of these are shallow: only the top level is copied; nested references are shared, which is the source of accidental-mutation bugs.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  SAME ...  TWO DIRECTIONS
  ─────────────────────────
  REST (gather)                       SPREAD (expand)
  function f(a, ...rest) {}            f(...arr)
       args: 1,2,3,4                     arr = [1,2,3]
       a=1, rest=[2,3,4]                 -> f(1,2,3)

   many ─────►  [ one array ]        [ one array ] ─────► many
                  (collect)                              (spill)

  DEFAULT (fallback)
  function g(x = 10) {}   g()      -> x = 10 (only if x is undefined)
                          g(0)     -> x = 0  (0 is a real value!)`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — default vs the || pitfall',
      lang: 'js',
      code: `function setVolume(level = 5) { return level }\nsetVolume()      // 5 (default)\nsetVolume(0)     // 0 — correct! default not applied\n\n// the old way breaks for 0:\nfunction old(level) { level = level || 5; return level }\nold(0)           // 5 — WRONG, treated 0 as missing`,
      explanation: [
        'A default parameter only kicks in when the argument is undefined.',
        '`setVolume(0)` correctly keeps 0 because 0 is a real, provided value.',
        'The old `level || 5` idiom wrongly replaces falsy values like 0 or "" with the fallback.',
        'This is the main reason to prefer default parameters over `||`.',
      ],
    },
    intermediate: {
      label: 'Intermediate — rest gathers, spread expands',
      lang: 'js',
      code: `function sum(...nums) {                 // rest: array of all args\n  return nums.reduce((a, b) => a + b, 0)\n}\nsum(1, 2, 3, 4) // 10\n\nconst a = [1, 2], b = [3, 4]\nconst merged = [...a, ...b]   // spread: [1,2,3,4]\nconst max = Math.max(...merged) // spread into args: 4`,
      explanation: [
        '`...nums` (rest) collects every argument into a real array you can call array methods on.',
        '`[...a, ...b]` (spread) expands both arrays into a new merged array.',
        '`Math.max(...merged)` spreads the array into individual arguments.',
        'Same ... token: gather in the parameter list, expand in literals/calls.',
      ],
    },
    advanced: {
      label: 'Advanced — object spread, overrides, and the shallow-copy trap',
      lang: 'js',
      code: `const base = { theme: 'dark', nested: { size: 'm' } }\nconst next = { ...base, theme: 'light' } // override theme\n// next = { theme:'light', nested: { size:'m' } }\n\nnext.nested.size = 'L'        // MUTATES base.nested too! (shared ref)\nconsole.log(base.nested.size) // 'L' — shallow copy gotcha`,
      explanation: [
        'Object spread copies own enumerable properties; later keys override earlier ones (theme -> light).',
        'It is SHALLOW: `nested` is copied by reference, not cloned.',
        'Mutating next.nested also changes base.nested because they share the same object.',
        'For deep updates, spread each nested level or use structuredClone / a deep-copy utility.',
      ],
    },
    realProject: {
      label: 'Real project — immutable state updates (React/Redux/Vue)',
      lang: 'js',
      code: `// React setState with object spread (immutability)\nsetUser((prev) => ({ ...prev, name: 'Sam' }))\n\n// add to a list immutably\nsetItems((prev) => [...prev, newItem])\n\n// merge config with defaults (rest for extras)\nfunction createClient({ baseURL = '/api', timeout = 5000, ...opts } = {}) {\n  return { baseURL, timeout, ...opts }\n}`,
      explanation: [
        'Object spread creates a new state object instead of mutating, which React/Redux require to detect changes.',
        'Array spread appends to a list immutably for predictable re-renders.',
        'Destructuring with defaults + a rest captures known options and gathers the rest.',
        'These patterns are everywhere in modern front-end state management.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between rest and spread?',
      answer: 'They use the same ... syntax but opposite directions. Rest (in a function parameter list or destructuring) gathers multiple values into a single array/object. Spread (in calls, array literals, object literals) expands an iterable/object into individual elements/properties.',
      explanation: 'The gather-vs-expand framing is exactly what interviewers want.',
    },
    {
      level: 'beginner',
      question: 'Why prefer default parameters over `value = value || fallback`?',
      answer: 'Because `||` replaces ANY falsy value (0, "", false, NaN) with the fallback, which is often wrong. A default parameter only applies when the argument is undefined, preserving valid falsy values.',
      explanation: 'Tests awareness of the falsy-value bug.',
    },
    {
      level: 'intermediate',
      question: 'Is object/array spread a deep or shallow copy?',
      answer: 'Shallow. Only the top level is copied; nested objects/arrays are copied by reference, so mutating a nested value affects the original. Use deep-clone (structuredClone) or nested spreads for deep copies.',
      explanation: 'The shallow-copy caveat is a frequent follow-up and a real bug source.',
    },
    {
      level: 'intermediate',
      question: 'Where must a rest parameter appear, and how is it different from arguments?',
      answer: 'A rest parameter must be the last parameter. Unlike the array-like `arguments` object, it is a real Array (so map/filter/reduce work), it only contains the args beyond the named ones, and it is available in arrow functions (which have no arguments).',
      explanation: 'Shows the practical advantages of rest over arguments.',
    },
    {
      level: 'advanced',
      question: 'How do default parameters interact with the Temporal Dead Zone?',
      answer: 'Parameters initialize left to right in their own scope. A default that references a parameter declared later throws a ReferenceError because the later one is still in its TDZ; referencing an earlier, already-initialized parameter works.',
      explanation: 'A subtle, senior-flavored evaluation-order detail.',
    },
    {
      level: 'senior',
      question: 'What does spread iterate over, and what are the performance and correctness implications at scale?',
      answer: 'Array/call spread uses the iterator protocol (so it works on any iterable: arrays, Sets, Maps, strings), while object spread copies own enumerable properties. At scale, spread allocates a new collection each time (O(n) copy), so spreading in hot loops or large reductions causes quadratic behavior and GC church; prefer push/Object.assign or builder patterns, and remember shallow semantics for correctness.',
      explanation: 'Senior signal: iterator protocol, allocation cost, accidental O(n^2), and shallow-copy correctness.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'When is a default parameter applied — on missing args or also on null?',
    'Can spread copy non-enumerable or inherited properties? (no — own enumerable only for objects)',
    'How do you deep-copy when spread is shallow?',
    'What iterables can you spread besides arrays? (Set, Map, string, generators)',
    'Why can rest only be the last parameter?',
    'How do default + rest combine in destructuring?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using x = x || default and breaking for valid falsy values.',
      why: '|| treats 0, "", false, NaN as missing and overrides them.',
      fix: 'Use a default parameter (applies only on undefined) or the nullish operator (?? for null/undefined).',
    },
    {
      mistake: 'Assuming spread makes a deep copy.',
      why: 'Spread is shallow; nested objects/arrays remain shared references.',
      fix: 'Spread each nested level explicitly or use structuredClone for true deep copies.',
    },
    {
      mistake: 'Putting a rest parameter before other parameters.',
      why: 'Rest must be last; otherwise it is a syntax error.',
      fix: 'Place ...rest as the final parameter only.',
    },
    {
      mistake: 'Spreading large arrays/objects inside hot loops or reduce accumulators.',
      why: 'Each spread allocates a new copy (O(n)), turning loops into O(n^2) with heavy GC.',
      fix: 'Mutate a single accumulator (push / Object.assign) and produce the immutable copy once at the end.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Object/array spread powers immutable state updates ({ ...prev, key } and [...prev, item]); rest collects extra props for prop forwarding (const { className, ...rest } = props).' },
    { area: 'Vue', detail: 'Spread merges reactive state and props; default params set composable option fallbacks; rest gathers variadic event payloads.' },
    { area: 'Node.js', detail: 'Rest params build variadic logging/util functions; spread forwards args (fn(...args)) and merges config objects with defaults.' },
    { area: 'Backend', detail: 'Spread merges request options with server defaults; rest collects middleware arguments; default params provide safe API option fallbacks.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Defaults and rest add negligible overhead and replace error-prone manual idioms.',
      'Spread expresses immutable updates clearly, enabling cheap change-detection in frameworks.',
    ],
    bad: [
      'Each spread allocates a fresh array/object (O(n)); spreading inside loops or reducers can become O(n^2) with GC pressure.',
      'Object spread copies all own enumerable keys even when you only change one, which adds up for very large objects.',
    ],
    optimizations: [
      'Build with a mutable accumulator (push / Object.assign) inside loops, then create one immutable copy at the end.',
      'Avoid spreading large objects repeatedly; structure data so updates touch smaller slices.',
      'Use spread for clarity at boundaries, not in the hottest inner loops.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['array-methods', 'function-declaration-vs-expression', 'truthy-falsy'],
    nextConcepts: ['destructuring', 'arrow-functions', 'shallow-vs-deep-copy', 'object-immutability'],
    dependencyNote:
      'These features build on arrays/iterables and truthy/falsy understanding (for defaults); they pair tightly with destructuring and underpin shallow-vs-deep-copy and object-immutability patterns used in state management.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write one ... and draw two arrows: "gather" (rest) and "expand" (spread).',
      'Show function f(a, ...rest){} with args 1,2,3 -> a=1, rest=[2,3].',
      'Show f(...[1,2,3]) -> expands into f(1,2,3).',
      'Write g(x = 5); g() -> 5, g(0) -> 0, and contrast with x || 5 breaking on 0.',
      'Warn: object/array spread is SHALLOW — draw a nested object shared by both copies.',
    ],
    diagram: `  REST   function f(a, ...r){}    args 1,2,3 -> a=1, r=[2,3]
  SPREAD f(...[1,2,3])           -> f(1,2,3)

  DEFAULT g(x = 5)   g()->5   g(0)->0   (x||5 would give 5 - wrong)

  SHALLOW: { ...base }  copies top level;
           base.nested  ◄── shared ──► copy.nested`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Same ... token, opposite jobs: rest GATHERS leftover arguments/properties into an array/object (must be last), spread EXPANDS an iterable/object into individual elements/properties. Default parameters give a fallback applied only when the argument is undefined — safer than `|| fallback`, which breaks on 0 or "". Spread (array and object) is a SHALLOW copy, so nested values stay shared; deep-clone when needed. These power immutable state updates and variadic functions in modern code.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'These are three modern parameter and data features, and two of them share the ... token in opposite directions. Default parameters let you give a parameter a fallback value, and crucially the default is applied only when the argument is undefined — not for other falsy values. That is why they replaced the old value = value || fallback idiom, which incorrectly overrides legitimate values like 0 or an empty string. Rest parameters use ... before the last parameter to collect all remaining arguments into a real Array; this finally retired the array-like arguments object, which was clumsy and does not even exist in arrow functions. Spread also uses ... but does the reverse — it expands an iterable into individual elements, whether you are spreading into a function call like Math.max(...arr), into an array literal to clone and merge, or with object spread to copy own enumerable properties into a new object. So the rule of thumb is: ... in a parameter list or destructuring target gathers, while ... in a call or literal expands. The most important caveat for interviews is that array and object spread are shallow copies — only the top level is duplicated, and nested objects are shared by reference, which is a classic accidental-mutation bug. These features are the backbone of immutable updates in React, Redux, and Vue, where you spread previous state into a new object instead of mutating it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Immutability via spread gives predictable change detection but costs an O(n) copy each update — fine at component scale, costly in tight loops.',
      'Defaults/rest improve clarity and safety but can hide complexity (default expressions can run arbitrary code, evaluated per call when undefined).',
    ],
    edgeCases: [
      'Defaults apply only on undefined, NOT on null — passing null skips the default.',
      'Default parameters have a TDZ: referencing a later parameter throws.',
      'Object spread copies only own enumerable properties (not inherited or non-enumerable, and getters are evaluated to their value).',
      'Spread relies on the iterator protocol, so it works on Set/Map/string/generators, not just arrays.',
    ],
    runtimeBehavior: [
      'Rest builds a fresh Array; spread iterates and copies references (shallow) into a new collection.',
      'Default expressions are evaluated lazily, only when the argument is undefined, in left-to-right parameter order.',
      'Object spread later keys override earlier ones, enabling override-with-defaults patterns.',
    ],
    scalability: [
      'Spreading inside reduce/loops creates quadratic copying and GC churn; prefer mutate-then-freeze or builder patterns for large datasets.',
      'For very large objects, spreading to change one field copies everything; consider normalized state or immutable libraries (Immer/structural sharing).',
    ],
    productionConcerns: [
      'Shallow-copy mutation bugs (mutating a shared nested object) are a common, subtle production defect — enforce deep updates or immutability tooling.',
      'Accidental O(n^2) from spread in hot paths can degrade performance under load; profile reducers.',
      'null vs undefined behavior with defaults can cause unexpected values from APIs that send null — pair with ?? where appropriate.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Same ...: REST gathers, SPREAD expands.',
    'Rest: ...name in params/destructuring -> a real Array; must be LAST.',
    'Spread: ...iterable in calls/array literals; ...obj in object literals.',
    'Default param applies ONLY when arg is undefined (not null, not 0).',
    'Prefer default params over `|| fallback` (which breaks on falsy).',
    'Spread (array & object) is SHALLOW — nested refs are shared.',
    'Object spread: own enumerable props; later keys override earlier.',
    'Spread uses the iterator protocol (Set, Map, string, generators).',
    'Rest is a real array; arguments is array-like and absent in arrows.',
    'Defaults have a TDZ and evaluate left to right.',
    'Avoid spread in hot loops/reducers -> O(n^2) + GC churn.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write greet(name, greeting = "Hello") returning "Hello, Sam" or a custom greeting.',
      hint: 'Use a default parameter for greeting.',
      solution: {
        lang: 'js',
        code: `function greet(name, greeting = 'Hello') {\n  return greeting + ', ' + name\n}\ngreet('Sam')          // "Hello, Sam"\ngreet('Sam', 'Hi')    // "Hi, Sam"`,
        explanation: [
          'The default "Hello" is used only when greeting is undefined.',
          'Passing a custom greeting overrides it normally.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write average(...nums) that returns the mean, and call it by spreading an array.',
      hint: 'Rest to gather, spread to pass.',
      solution: {
        lang: 'js',
        code: `const average = (...nums) =>\n  nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0\n\naverage(2, 4, 6)            // 4\nconst data = [10, 20, 30]\naverage(...data)            // 20 (spread into args)`,
        explanation: [
          'Rest gathers all arguments into the array `nums`.',
          'reduce sums them; we divide by length (guarding empty input).',
          'Spreading `data` expands the array into individual arguments.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Show that object spread is shallow, then fix a nested update immutably.',
      hint: 'Spread the nested level too.',
      solution: {
        lang: 'js',
        code: `const state = { user: { name: 'Sam' }, count: 0 }\n\n// shallow: this mutates the original nested object\nconst bad = { ...state }\nbad.user.name = 'Eve'\n// state.user.name is now 'Eve' too!\n\n// fix: spread the nested level\nconst good = { ...state, user: { ...state.user, name: 'Eve' } }\n// state.user.name stays 'Sam'`,
        explanation: [
          'A single spread copies `user` by reference, so mutating bad.user changes state.user.',
          'Spreading the nested object (...state.user) creates a new inner object.',
          'Now updating name does not touch the original state — a correct immutable update.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement merge(defaults, overrides) using spread, preserving falsy overrides like 0.',
      hint: 'Spread defaults first, then overrides.',
      solution: {
        lang: 'js',
        code: `function merge(defaults, overrides = {}) {\n  return { ...defaults, ...overrides }\n}\nmerge({ volume: 5, mute: false }, { volume: 0 })\n// { volume: 0, mute: false } — 0 correctly overrides 5`,
        explanation: [
          'Spreading defaults then overrides means later keys (overrides) win.',
          'Because object spread copies the actual value, falsy overrides like 0 are preserved (unlike `||`).',
          'This is the standard config-merge pattern; note it is shallow for nested config.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Default, rest, and spread are everyday tools, and explaining gather-vs-expand plus the shallow-copy caveat signals you write clean, bug-free modern JavaScript. They underpin immutable state updates that every React/Vue/Redux app depends on.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask "difference between rest and spread" and basic default usage. Product companies (Zoho, Flipkart, Razorpay) probe the shallow-copy gotcha and immutable updates. FAANG interviews dig into the iterator protocol, default-parameter TDZ, and the O(n^2) spread-in-loop performance trap.',
    whatInterviewersExpect:
      'They expect the gather-vs-expand distinction, why defaults beat `|| fallback`, the shallow-copy caveat with a deep-update fix, and awareness of where spread hurts performance at scale.',
  },
}

export default defaultRestSpread
