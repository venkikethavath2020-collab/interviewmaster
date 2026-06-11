import type { ConceptLesson } from '../../../types/lesson'

const nullVsUndefined: ConceptLesson = {
  // 1. Concept Summary
  slug: 'null-vs-undefined',
  name: 'null vs undefined',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript is the rare language with TWO "empty" values, and confusing them produces the most common runtime crash you will ever see: "Cannot read properties of undefined".',
    'Knowing the difference tells you WHY something is empty — undefined usually means "the engine never gave it a value", while null means "a developer deliberately said: nothing here".',
    'Almost every defensive check, default value, optional chaining, and API contract decision hinges on getting these two right.',
    'Interviewers use it as a fast litmus test: a precise answer signals you understand how the engine initializes variables, parameters, and missing properties.',
    'Choosing the wrong one in a public API or database schema leaks ambiguity into every consumer of your code.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'undefined is a cup nobody filled yet; null is a cup someone emptied on purpose.',
    story: [
      'Imagine you have a row of cups on a shelf and you are supposed to pour juice into them.',
      'Some cups are still completely untouched — nobody has even looked at them yet. Those are like undefined: the system just has not given them anything.',
      'Now imagine one cup that someone picked up, looked at, and poured out, saying "I want this one to be empty." That on-purpose-empty cup is like null.',
      'Both cups have no juice, but the STORY is different: one was never filled, the other was deliberately emptied. In JavaScript that difference matters a lot.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'In JavaScript, a box (variable) that exists but has not been given a value automatically holds the special value undefined.',
    'null is a value YOU put into a box on purpose to say "this is intentionally empty right now".',
    'So undefined usually means "the computer left it blank", and null usually means "a programmer set it blank".',
    'They look similar and both feel "empty", but they answer two different questions: was a value ever assigned, and did someone choose to clear it.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'undefined is the default value JavaScript assigns to anything that exists but has no value yet (uninitialized variables, missing object properties, missing function arguments, functions with no return). null is a value a developer assigns deliberately to represent the intentional absence of any object.',
    how: 'The engine auto-fills undefined when it cannot find a value; you write `null` yourself when you want to signal "empty on purpose". Both are primitives, but they behave differently under typeof and equality checks.',
    why: 'Distinguishing them lets you tell "this was never set" apart from "this was cleared", which drives default values, validation, and API contracts.',
    code: {
      label: 'Where each one shows up',
      lang: 'js',
      code: `let a               // declared but not assigned
console.log(a)      // undefined (engine filled it)

const user = { name: 'Sam' }
console.log(user.age)   // undefined (missing property)

function greet(name) { return 'hi ' + name }
console.log(greet())    // "hi undefined" (missing argument)

let selected = null     // YOU said: nothing selected yet
console.log(selected)   // null`,
      explanation: [
        '`a` exists but was never assigned, so the engine gives it undefined.',
        'Reading a property that does not exist on an object yields undefined, not an error.',
        'A function parameter you do not pass is undefined inside the function.',
        '`selected = null` is a deliberate choice — you are saying "intentionally empty".',
        'The pattern: undefined = engine-supplied blank, null = developer-supplied blank.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'undefined and null are both primitive values representing absence, but with distinct semantics. undefined is the default value for unitialized bindings, absent object properties, missing arguments, and the implicit return of value-less functions; it is the sole value of the Undefined type. null is the sole value of the Null type and denotes the intentional absence of any object value. They are loosely equal (null == undefined is true) but strictly unequal (null === undefined is false), and a long-standing language bug makes typeof null return "object" while typeof undefined returns "undefined".',

  // 7. Internal Working
  internalWorking: [
    'During the creation phase of an execution context, the engine hoists `var` declarations and initializes them to undefined; `let`/`const` bindings are created but left uninitialized (in the temporal dead zone) until evaluated.',
    'When code reads a variable that holds no assigned value, the binding still maps to the primitive undefined — no error is thrown for the read itself.',
    'Property access (obj.x) performs a prototype-chain lookup; if no own or inherited property is found, the [[Get]] internal operation returns undefined rather than throwing.',
    'A function called with fewer arguments than parameters binds the missing parameters to undefined; a function that reaches its end with no return statement evaluates to undefined.',
    'null must be produced explicitly by literal or by an operation that is specified to return it (e.g. a failed RegExp#exec returns null, document.getElementById of a missing node returns null).',
    'typeof null returning "object" is a historical artifact: in the original implementation values were tagged by type bits, and null was the all-zero pointer that collided with the object tag — never fixed for backward compatibility.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `        IS THE VALUE ABSENT?
                 │
        ┌────────┴─────────┐
        ▼                  ▼
   "engine left it"   "I cleared it"
     undefined            null
        │                  │
   ┌────┴─────┐       ┌────┴──────┐
   │ no assign │       │ explicit  │
   │ missing   │       │ null = ...│
   │ prop/arg  │       │ reset/clear│
   │ no return │       └───────────┘
   └──────────┘
   typeof → "undefined"   typeof → "object" (bug)
   null == undefined  → true
   null === undefined → false`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Both undefined and null are PRIMITIVES — they are stored directly in the variable slot (on the stack / inline in the binding), not as heap objects.',
    'There is exactly one undefined value and one null value in the entire runtime; assigning them does not allocate anything new.',
    'Setting an object variable to null is a common way to drop the last reference to a heap object so the garbage collector can reclaim it.',
    'Reading an undefined property does not create or store anything — it simply returns the singleton undefined value from the failed lookup.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the two empties side by side',
      lang: 'js',
      code: `let notAssigned
let cleared = null

console.log(notAssigned) // undefined
console.log(cleared)     // null

console.log(typeof notAssigned) // "undefined"
console.log(typeof cleared)     // "object"  (famous bug)`,
      explanation: [
        '`notAssigned` was declared but never given a value, so it is undefined.',
        '`cleared` was deliberately set to null.',
        'typeof distinguishes them, but typeof null is the misleading "object".',
        'Visually both are "empty", yet they carry different intent.',
      ],
    },
    intermediate: {
      label: 'Intermediate — defaults treat them differently',
      lang: 'js',
      code: `function show(value = 'fallback') {
  return value
}
console.log(show(undefined)) // "fallback"  (default kicks in)
console.log(show(null))      // null         (null is a real value!)

// nullish coalescing treats BOTH as "missing"
const a = undefined ?? 'x'   // "x"
const b = null ?? 'y'        // "y"
const c = 0 ?? 'z'           // 0  (0 is NOT nullish)`,
      explanation: [
        'Default parameters trigger ONLY for undefined, never for null — a classic trap.',
        'Passing null skips the default and the function receives null.',
        'The ?? operator treats null and undefined alike (both "nullish") and only those.',
        '0 and "" are NOT nullish, so ?? keeps them, unlike the looser || operator.',
      ],
    },
    advanced: {
      label: 'Advanced — distinguishing "missing" from "explicitly null"',
      lang: 'js',
      code: `const patch = { nickname: null } // user cleared their nickname

function applyPatch(profile, patch) {
  for (const key in patch) {
    // key EXISTS in patch, value may be null on purpose
    profile[key] = patch[key]
  }
  return profile
}

// We must use 'in' / hasOwnProperty to tell
// "field omitted" (undefined) from "field set to null".
console.log('nickname' in patch)     // true  -> intentional
console.log('age' in patch)          // false -> omitted/undefined`,
      explanation: [
        'In a PATCH/merge API, undefined typically means "do not touch this field".',
        'null typically means "set this field to empty / clear it".',
        'Using the `in` operator (or hasOwnProperty) detects presence, not value.',
        'Collapsing the two loses the user intent — keep them distinct in update logic.',
        'This exact distinction underlies JSON Merge Patch and most REST update endpoints.',
      ],
    },
    realProject: {
      label: 'Real project — Vue ref initialized as null until loaded',
      lang: 'js',
      code: `import { ref, onMounted } from 'vue'

// null = "no user yet, on purpose"; not undefined
const user = ref(null)
const error = ref(null)

onMounted(async () => {
  try {
    const res = await fetch('/api/me')
    user.value = await res.json()
  } catch (e) {
    error.value = e
  }
})

// template: v-if="user" works because null is falsy`,
      explanation: [
        'Initializing the ref to null communicates "intentionally empty, loading".',
        'undefined would work too, but null reads as a deliberate placeholder for an object.',
        'v-if="user" relies on null being falsy to show a loading state.',
        'React does the same: useState(null) for "not loaded yet" is idiomatic.',
        'Choosing null here makes the contract explicit to other developers.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between null and undefined?',
      answer: 'undefined means a variable has been declared but not assigned a value (the engine supplies it); null is a value a developer assigns intentionally to represent the deliberate absence of an object.',
      explanation: 'A good answer captures the INTENT difference (engine-supplied vs developer-supplied), not just "both are empty".',
    },
    {
      level: 'beginner',
      question: 'What does typeof null return and why?',
      answer: 'It returns "object", which is a long-standing bug from the original JS implementation where null shared the type tag of objects. It was never fixed for backward compatibility.',
      explanation: 'Knowing this trivia AND that typeof undefined is "undefined" shows attention to the language quirks interviewers love.',
    },
    {
      level: 'beginner',
      question: 'Is `null == undefined` true? Is `null === undefined` true?',
      answer: 'null == undefined is true (loose equality treats them as equal); null === undefined is false (strict equality checks type, and they are different types).',
      explanation: 'This demonstrates understanding that == applies coercion rules while === does not.',
    },
    {
      level: 'intermediate',
      question: 'When does a default parameter value actually apply — for null, undefined, or both?',
      answer: 'Only for undefined. If you pass null explicitly, the default is skipped and the parameter receives null.',
      explanation: 'A frequent real-world bug. Connecting it to ?? (which treats both as nullish) shows depth.',
    },
    {
      level: 'intermediate',
      question: 'How would you check that a variable is "neither null nor undefined"?',
      answer: 'Use `value != null` (loose), which is true for everything except null and undefined, or use the nullish check `value ?? fallback`. Avoid `value !== undefined` alone because it misses null.',
      explanation: 'Shows command of the idiomatic, terse nullish check and why == null is acceptable here.',
    },
    {
      level: 'senior',
      question: 'In an API or database, when should a field be null vs undefined vs absent?',
      answer: 'Use null to mean "explicitly no value" (a known empty), absence/undefined to mean "not provided / do not change". In JSON, undefined is not serializable, so omitting a key represents "unknown" and null represents "known empty"; PATCH semantics depend on this distinction.',
      explanation: 'Senior signal: tying the primitive distinction to data contracts, serialization, and merge-patch semantics.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does JSON.stringify drop undefined but keep null?',
    'What is the difference between || and ?? for defaults?',
    'How does optional chaining (?.) interact with null and undefined?',
    'Why might you prefer `== null` over `=== null` in a guard?',
    'What is the temporal dead zone and how does it relate to undefined?',
    'How do you tell "property missing" from "property set to undefined"?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Passing null and expecting a default parameter to apply.',
      why: 'Default parameters only fire for undefined, so null overrides the default.',
      fix: 'Pass undefined (or nothing) to get the default, or use `value ?? defaultValue` inside the function.',
    },
    {
      mistake: 'Using `=== undefined` to detect "empty" and missing the null case.',
      why: 'A value can be null instead of undefined, slipping past the check.',
      fix: 'Use `value == null` or `value ?? fallback` to cover both nullish values at once.',
    },
    {
      mistake: 'Assuming typeof null === "null".',
      why: 'typeof null is the historical "object", which breaks naive type checks.',
      fix: 'Check null explicitly with `value === null` before using typeof for object detection.',
    },
    {
      mistake: 'Expecting JSON.stringify to preserve undefined.',
      why: 'undefined keys are dropped from objects and become null inside arrays.',
      fix: 'Use null for values you want serialized, and understand that omission means "absent".',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'refs are commonly initialized to null for "not loaded yet" object data; v-if relies on null/undefined being falsy. Props with no default arrive as undefined.' },
    { area: 'React', detail: 'useState(null) is the idiomatic "no data yet" placeholder; controlled inputs distinguish "" (empty string) from undefined (uncontrolled) to avoid the controlled/uncontrolled warning.' },
    { area: 'Node.js', detail: 'Database drivers map SQL NULL to JS null; callbacks follow the error-first pattern where the error argument is null on success. Missing query params are undefined.' },
    { area: 'Backend', detail: 'REST PATCH endpoints use null = "clear this field" and absence = "leave unchanged"; JSON Schema validation often forbids undefined since it cannot be serialized.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Both are singleton primitives — assigning or comparing them is essentially free with no allocation.',
      'Setting a variable to null to drop a heap reference helps the garbage collector reclaim memory promptly.',
    ],
    bad: [
      'Over-defensive deep null checks scattered everywhere add noise and tiny branching overhead, and hint at an unclear data contract.',
      'Relying on typeof null === "object" for branching can route values into wrong code paths, causing slow fallbacks or crashes.',
    ],
    optimizations: [
      'Normalize empty values at boundaries (parse/serialize) so internal code deals with one consistent representation.',
      'Use optional chaining and nullish coalescing for concise, fast guards instead of nested if-checks.',
      'Prefer `== null` to collapse both nullish values in one comparison rather than two separate checks.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'var-let-const', 'primitive-vs-reference'],
    nextConcepts: ['truthy-falsy', 'equality-comparison', 'optional-chaining-nullish', 'typeof-instanceof', 'type-coercion'],
    dependencyNote:
      'null vs undefined builds on the basic data types and feeds directly into truthy/falsy, equality comparison, and optional chaining/nullish coalescing — the everyday tools for handling absent values safely.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two empty cups side by side, labeling one "undefined" and one "null".',
      'Over the undefined cup write "engine left it blank: no assign / missing prop / missing arg / no return".',
      'Over the null cup write "developer set it on purpose: reset / cleared / not-yet-an-object".',
      'Below, write the three facts: typeof undefined = "undefined", typeof null = "object" (bug).',
      'Then: null == undefined is true, null === undefined is false.',
      'Say: "Same emptiness, different intent — and defaults/?? treat them as a pair while === treats them apart."',
    ],
    diagram: `   undefined                  null
   ┌───────┐                ┌───────┐
   │  (∅)  │                │  (∅)  │
   └───────┘                └───────┘
   engine-supplied          developer-supplied
   typeof "undefined"       typeof "object" (bug)

   null == undefined  → true
   null === undefined → false
   default param fires only for undefined`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'undefined is the value JavaScript gives anything that exists but was never assigned — uninitialized variables, missing properties, missing arguments, value-less returns. null is a value YOU assign on purpose to mean "intentionally empty / no object". They are loosely equal (==) but strictly unequal (===), typeof undefined is "undefined" while typeof null is "object" (a historic bug), default parameters apply only to undefined, and ?? treats both as nullish.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript is unusual in having two empty values. undefined is the default the engine supplies: a declared-but-unassigned variable, a property that does not exist, a function argument you did not pass, or a function that returns nothing — all evaluate to undefined. null is different: it is a value a developer assigns deliberately to say "this is intentionally empty, there is no object here". So the key distinction is intent — engine-supplied absence versus programmer-declared absence. They behave differently in several ways. typeof undefined is "undefined", but typeof null is "object", which is a famous bug kept for backward compatibility. Loose equality says null == undefined is true, but strict equality says null === undefined is false because they are different types. Default parameters apply only when an argument is undefined, so passing null skips the default — a real source of bugs. The nullish coalescing operator ?? treats both as missing, unlike ||, which also triggers on 0 and empty string. In practice I initialize "not loaded yet" state to null, I use == null or ?? to guard against both at once, and in APIs I keep null meaning "explicitly cleared" distinct from absence meaning "do not change", because JSON cannot even serialize undefined.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Using null for "empty object slot" is explicit but adds a value developers must remember to handle; using undefined leans on the engine but blurs intent.',
      'Collapsing both with ?? / == null simplifies guards but discards the missing-vs-cleared distinction that PATCH and merge logic may need.',
    ],
    edgeCases: [
      'JSON.stringify drops undefined object properties entirely but converts undefined array elements to null — asymmetric and surprising.',
      'document.getElementById and RegExp#exec return null on miss, while map lookups and property reads return undefined — know your API contracts.',
      'A property explicitly set to undefined still exists (the `in` operator returns true), unlike an absent property.',
      'void 0 reliably yields undefined even in environments where undefined could historically be shadowed.',
    ],
    runtimeBehavior: [
      'Reading an undefined property is a successful [[Get]] returning the undefined singleton; reading a property OF undefined/null throws a TypeError.',
      'Loose equality has a special-case rule: null and undefined are equal to each other and to nothing else (not even 0 or "").',
      'Default parameters are specified to trigger strictly on the undefined value, evaluated lazily per call.',
    ],
    scalability: [
      'Consistent boundary normalization (DB null ↔ app null, undefined never persisted) keeps large codebases from drowning in ad-hoc null checks.',
      'In typed codebases, modeling absence with a discriminated union or Option type beats sprinkling null/undefined, reducing whole classes of "cannot read property of undefined" incidents.',
    ],
    productionConcerns: [
      '"Cannot read properties of undefined" is one of the most frequent production JS errors; structured null handling and optional chaining materially cut incident rates.',
      'Serialization boundaries (JSON APIs, caches, logs) silently change undefined to null or drop it — verify round-trips for fields where the distinction matters.',
      'TypeScript distinguishes the two; misconfigured strictNullChecks lets both slip through and reintroduces runtime crashes.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'undefined = engine-supplied absence (no assign / missing prop / missing arg / no return).',
    'null = developer-supplied absence (intentional empty / no object).',
    'typeof undefined === "undefined"; typeof null === "object" (historic bug).',
    'null == undefined → true; null === undefined → false.',
    'Default params fire ONLY for undefined, never for null.',
    '?? treats null AND undefined as missing; || also triggers on 0, "", false.',
    'Use `value == null` to catch both nullish values in one check.',
    'JSON.stringify drops undefined keys; array undefined → null.',
    'Reading prop OF null/undefined throws; reading a MISSING prop returns undefined.',
    'Initialize "not loaded yet" object state to null for clear intent.',
    'void 0 always yields the real undefined.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a function isNullish(v) that returns true only for null or undefined and false for everything else (including 0, "", false).',
      hint: 'A single loose comparison can do it.',
      solution: {
        lang: 'js',
        code: `function isNullish(v) {
  return v == null   // true for null AND undefined only
}
isNullish(null)      // true
isNullish(undefined) // true
isNullish(0)         // false
isNullish('')        // false`,
        explanation: [
          '`v == null` is the idiomatic nullish check.',
          'Loose equality matches both null and undefined and nothing else.',
          '0, "", and false are NOT nullish, so they return false.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write withDefault(value, fallback) that returns fallback only when value is null or undefined — but keeps 0 and "".',
      hint: 'Use the nullish coalescing operator.',
      solution: {
        lang: 'js',
        code: `function withDefault(value, fallback) {
  return value ?? fallback
}
withDefault(undefined, 'x') // "x"
withDefault(null, 'x')      // "x"
withDefault(0, 'x')         // 0  (kept!)
withDefault('', 'x')        // "" (kept!)`,
        explanation: [
          '?? returns the right side only for null/undefined.',
          'Using || here would wrongly replace 0 and "" because they are falsy.',
          'This is the safe way to apply defaults to numbers and strings.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write mergePatch(target, patch): for each key in patch, if the value is null DELETE the key from target, otherwise set it. Keys absent from patch must stay untouched.',
      hint: 'Iterate own keys of patch; null means delete, anything else means assign.',
      solution: {
        lang: 'js',
        code: `function mergePatch(target, patch) {
  for (const key of Object.keys(patch)) {
    if (patch[key] === null) {
      delete target[key]      // explicit clear
    } else {
      target[key] = patch[key]
    }
  }
  return target
}
mergePatch({ a: 1, b: 2 }, { b: null, c: 3 }) // { a: 1, c: 3 }`,
        explanation: [
          'Only keys present in patch are considered — absence means "leave unchanged".',
          'A null value is the JSON Merge Patch signal to remove the field.',
          'Any other value (including 0 or "") overwrites the target field.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why `JSON.stringify({ a: undefined, b: null, c: [undefined] })` produces what it does, and write the expected output as a comment.',
      hint: 'Think about object keys vs array elements.',
      solution: {
        lang: 'js',
        code: `const out = JSON.stringify({ a: undefined, b: null, c: [undefined] })
// "{"b":null,"c":[null]}"
// - a: undefined OBJECT property is dropped entirely
// - b: null is serialized as null
// - c: undefined ARRAY element becomes null (positions must be kept)
console.log(out)`,
        explanation: [
          'undefined object properties are omitted from the output string.',
          'null serializes literally to null.',
          'undefined inside arrays becomes null so array length/index positions are preserved.',
          'This asymmetry is a classic interview gotcha about the two empties.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Handling absent values correctly is the difference between an app that gracefully shows a loading state and one that crashes with "cannot read property of undefined". It is the most practically useful piece of JS trivia you will use every single day.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the plain definition plus typeof null. Product companies (Zoho, Flipkart, Razorpay) probe the == vs === result, default-parameter behavior, and JSON.stringify quirks. FAANG-level rounds connect it to API/data contracts, merge-patch semantics, and TypeScript null handling.',
    whatInterviewersExpect:
      'They expect you to articulate the intent difference (engine-supplied vs developer-supplied), recall the typeof and equality results precisely, know that defaults and ?? treat them differently, and ideally tie the distinction to real serialization or API design decisions.',
  },
}

export default nullVsUndefined
