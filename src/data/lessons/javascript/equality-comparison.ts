import type { ConceptLesson } from '../../../types/lesson'

const equalityComparison: ConceptLesson = {
  // 1. Concept Summary
  slug: 'equality-comparison',
  name: '== vs === vs Object.is',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Comparing values is something you do in nearly every line of conditional code, and choosing == vs === changes whether hidden coercion happens — getting it wrong causes silent, hard-to-find bugs.',
    'The == operator runs a surprising coercion algorithm (e.g. "" == 0 is true, null == undefined is true) that has burned countless developers.',
    'It is the single most frequently asked JavaScript interview question because a clear answer proves you understand coercion, types, and edge cases all at once.',
    'Object.is and === disagree on exactly two values (NaN and -0), and reference equality for objects trips up people expecting deep equality.',
    'Frameworks like React and Vue use reference equality (===-style) for change detection, so understanding it explains re-render and reactivity behavior.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Comparing is like checking if two lunchboxes are "the same" — and "same" can mean different things.',
    story: [
      'Imagine two kids each holding a lunchbox, and you ask: "Are these the same?"',
      'One way to answer is loose: "Eh, close enough — they both have a sandwich, sure, same." That is like ==, which is relaxed and will say yes even when the boxes are a bit different, after quietly tidying them up to match.',
      'A stricter way is: "No — only the SAME color box with the EXACT same food counts as same." That is like ===, which refuses to pretend two different things are equal.',
      'And there is an extra-careful judge, Object.is, who is almost exactly like the strict one but who notices two tiny weird cases the strict judge gets wrong. In JavaScript you usually want the strict judge.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'JavaScript has three ways to compare values for equality: == (loose), === (strict), and Object.is.',
    '== first converts the two values to the same type if they differ, THEN compares — so it can call things equal that look different, like 1 == "1".',
    '=== does NOT convert types: if the types differ it immediately says false, otherwise it compares the values directly. This is the one you should use almost always.',
    'Object.is behaves like === except for two special cases: it treats NaN as equal to NaN, and it treats +0 and -0 as different.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: '== is loose equality (compares after type coercion), === is strict equality (compares type AND value, no coercion), and Object.is is "same-value" equality (like === but with special handling of NaN and -0).',
    how: '=== checks type first; if types match it compares values (for objects, it compares references). == coerces operands to a common type using a defined algorithm and then compares. Object.is uses the SameValue algorithm internally.',
    why: 'Using === avoids surprising coercion bugs. You only reach for == intentionally (the null/undefined check) and Object.is when NaN or -0 correctness matters.',
    code: {
      label: 'The three operators side by side',
      lang: 'js',
      code: `// == coerces types:
console.log(1 == '1')        // true  (string -> number)
console.log(0 == false)      // true  (false -> 0)
console.log(null == undefined) // true (special rule)

// === requires same type AND value:
console.log(1 === '1')       // false (number vs string)
console.log(null === undefined) // false

// Object.is = === plus two fixes:
console.log(NaN === NaN)     // false
console.log(Object.is(NaN, NaN)) // true
console.log(Object.is(-0, +0))   // false (=== says true)`,
      explanation: [
        '== converts types before comparing, so 1 == "1" is true.',
        '0 == false is true because false coerces to 0.',
        '=== never coerces, so different types are always unequal.',
        'NaN === NaN is false (NaN equals nothing), but Object.is(NaN, NaN) is true.',
        'Object.is also distinguishes +0 from -0, which === considers equal.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JavaScript provides three equality semantics. Strict equality (===) uses the IsStrictlyEqual algorithm: if the operand types differ it returns false, otherwise it compares primitives by value and objects by reference — with the quirks NaN === NaN being false and +0 === -0 being true. Loose equality (==) uses IsLooselyEqual, which applies type coercion (number↔string via ToNumber, boolean→number, object→primitive via ToPrimitive) before comparison, with the special rule that null and undefined are equal to each other and nothing else. Object.is implements the SameValue algorithm, identical to === except SameValue treats NaN as equal to NaN and treats +0 and -0 as distinct.',

  // 7. Internal Working
  internalWorking: [
    'For ===, the engine first compares the Type of both operands; if they differ, the result is immediately false with no coercion.',
    'If types match: Numbers compare by value (with NaN unequal to everything and +0 equal to -0); Strings compare code unit by code unit; Booleans/null/undefined compare trivially; Objects compare by reference identity (same heap address).',
    'For ==, if both types already match the engine delegates to the same strict comparison. If they differ, it runs coercion rules: null == undefined → true; number vs string → ToNumber the string; boolean → ToNumber the boolean then re-compare; object vs primitive → ToPrimitive the object then re-compare; otherwise false.',
    'These == coercion steps can recurse (object → primitive → number) until both sides are primitives of comparable type.',
    'Object.is runs SameValue: same logic as === for non-numbers, but for numbers it uses bit-pattern-aware comparison so NaN matches NaN and +0 does not match -0.',
    'React/Vue change detection conceptually uses Object.is (React) or referential/reactive checks (Vue): a new object reference is "not equal" to the old even if structurally identical, which is why immutable updates trigger re-renders.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   COMPARE a and b
        │
   ┌────┴───────────────┐
   ▼                    ▼
  ==  (loose)         === (strict)
  types differ?       types differ? ──► FALSE (no coercion)
   │ yes -> COERCE      │ same type
   │      then compare  ▼
   ▼                  compare value (objects: by REFERENCE)
  1 == "1"  true      1 === "1"  false
  0 == false true     NaN === NaN  false
  null == undefined   +0 === -0    true
       true

   Object.is = === EXCEPT:
     Object.is(NaN, NaN) = true
     Object.is(+0, -0)   = false`,

  // 9. Memory Visualization
  memoryVisualization: [
    'For PRIMITIVES, equality compares the actual values stored in the variable slots — no heap involved.',
    'For OBJECTS, === and Object.is compare REFERENCES: do both variables point to the same heap address? Structural sameness is irrelevant.',
    'So `{a:1} === {a:1}` is false — two separate heap allocations — while `const x = {}; x === x` is true (same reference).',
    'This reference rule is why frameworks detect change by reference swap: a new array/object reference signals "something changed" without deep comparison cost.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — prefer === to avoid coercion surprises',
      lang: 'js',
      code: `console.log('' == 0)    // true  (== coerces "" -> 0)
console.log('' === 0)   // false (different types)

console.log(' \\t\\n ' == 0) // true  (whitespace -> 0)
console.log(false == '')    // true  (both -> 0)
console.log(false === '')   // false`,
      explanation: [
        '== runs coercion, so an empty/whitespace string equals 0.',
        '=== sees string vs number and returns false immediately.',
        'These loose-equality surprises are exactly why === is the default choice.',
        'The only common, intentional == use is the null/undefined check.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the one good use of == and object references',
      lang: 'js',
      code: `// Idiomatic == : catch BOTH null and undefined at once
function isMissing(v) {
  return v == null   // true ONLY for null or undefined
}
isMissing(null)      // true
isMissing(undefined) // true
isMissing(0)         // false

// Objects compare by reference, not contents:
console.log({} === {})         // false (two objects)
const a = { x: 1 }
const b = a
console.log(a === b)           // true  (same reference)`,
      explanation: [
        '`v == null` is the one widely-accepted loose-equality idiom: it matches null and undefined and nothing else.',
        'It is shorter than `v === null || v === undefined`.',
        'Object equality is reference identity: two literals are never ===.',
        'Aliasing (b = a) makes both point at the same object, so a === b is true.',
      ],
    },
    advanced: {
      label: 'Advanced — NaN and -0 require Object.is',
      lang: 'js',
      code: `console.log(NaN === NaN)          // false
console.log(Object.is(NaN, NaN))  // true
console.log(Number.isNaN(NaN))    // true (preferred NaN test)

console.log(-0 === 0)             // true
console.log(Object.is(-0, 0))     // false
console.log(Object.is(-0, -0))    // true

// Detecting -0 in practice:
function isNegZero(n) { return Object.is(n, -0) }`,
      explanation: [
        'NaN is the only value not equal to itself under === — a spec rule.',
        'Object.is(NaN, NaN) is true, useful for exact "same value" checks.',
        'For NaN detection in normal code, Number.isNaN is clearer.',
        '=== treats +0 and -0 as equal; Object.is distinguishes them.',
        'Object.is is the tool when -0 vs +0 actually matters (rare but real in math/graphics).',
      ],
    },
    realProject: {
      label: 'Real project — referential equality in React/Vue change detection',
      lang: 'js',
      code: `// React: state updates must create a NEW reference to trigger re-render
setItems(prev => [...prev, newItem])   // new array reference -> re-render
// setItems(prev => { prev.push(newItem); return prev }) // SAME ref -> no update!

// React.memo / useMemo deps use Object.is to compare:
const memoized = useMemo(() => compute(data), [data])
// re-computes only when Object.is(prevData, data) is false

// Vue reactivity tracks references too; replacing an object ref
// notifies watchers, mutating in place may not (for non-reactive copies).`,
      explanation: [
        'React compares old vs new with Object.is; a new reference signals change.',
        'Mutating in place keeps the same reference, so the UI does not update — a classic bug.',
        'useMemo/useEffect dependency arrays use Object.is per element.',
        'Vue similarly relies on reference/reactive identity for tracking.',
        'Understanding equality explains the immutability discipline these frameworks require.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between == and ===?',
      answer: '== (loose) coerces the operands to a common type before comparing, so 1 == "1" is true. === (strict) compares type and value without coercion, so 1 === "1" is false. Use === by default.',
      explanation: 'The core distinction is coercion vs no coercion; mentioning "use === by default" shows good judgment.',
    },
    {
      level: 'beginner',
      question: 'Is `null == undefined` true? Is `null === undefined` true?',
      answer: 'null == undefined is true (a special loose-equality rule), but null === undefined is false because their types differ.',
      explanation: 'A staple edge case; it also motivates the idiomatic `x == null` check.',
    },
    {
      level: 'beginner',
      question: 'Why is `NaN === NaN` false?',
      answer: 'By IEEE-754 and the spec, NaN is not equal to anything, including itself. To test for NaN use Number.isNaN, and Object.is(NaN, NaN) returns true.',
      explanation: 'Tests awareness of the most famous equality quirk and the correct detection methods.',
    },
    {
      level: 'intermediate',
      question: 'How do objects compare with === ?',
      answer: 'By reference identity, not contents. Two distinct objects are never strictly equal even if structurally identical; only two references to the same object are equal.',
      explanation: 'Connecting this to deep-equality needs and framework change detection elevates the answer.',
    },
    {
      level: 'intermediate',
      question: 'When is `==` actually acceptable to use?',
      answer: 'The widely accepted case is `x == null`, which matches both null and undefined and nothing else — a concise nullish guard. Otherwise prefer ===.',
      explanation: 'Shows you can apply nuance rather than a blanket "never use ==".',
    },
    {
      level: 'senior',
      question: 'Explain how Object.is differs from === and where frameworks rely on it.',
      answer: 'Object.is uses SameValue: identical to === except Object.is(NaN, NaN) is true and Object.is(+0, -0) is false. React uses Object.is for state and dependency comparison, so a new reference (or a genuine value change) triggers updates while NaN-to-NaN is correctly treated as unchanged.',
      explanation: 'Senior signal: precise SameValue semantics plus the practical tie to React change detection and memoization.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the coercion order in the == algorithm for number vs string vs boolean?',
    'How would you implement a deep-equality function for objects?',
    'Why does immutable state (new references) matter for React re-renders?',
    'What is the difference between Object.is and the SameValueZero algorithm used by includes/Set?',
    'Why is `[] == ![]` true?',
    'How do you correctly test whether a value is NaN?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using == everywhere out of habit.',
      why: 'Hidden coercion produces surprising matches like "" == 0 and "0" == false.',
      fix: 'Default to ===; reserve == only for the deliberate `x == null` nullish check.',
    },
    {
      mistake: 'Comparing objects with === expecting deep/structural equality.',
      why: '=== compares references; two structurally identical objects are not equal.',
      fix: 'Write or use a deep-equality utility (or compare serialized/specific fields) when you need structural comparison.',
    },
    {
      mistake: 'Testing for NaN with `x === NaN`.',
      why: 'NaN is never equal to anything, so this is always false.',
      fix: 'Use Number.isNaN(x) (or Object.is(x, NaN)).',
    },
    {
      mistake: 'Mutating React/Vue state in place and expecting an update.',
      why: 'The reference stays the same, so the equality-based change check sees no change.',
      fix: 'Create a new reference (spread/map) so the framework detects the change.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'State, props, useMemo/useEffect deps, and React.memo all compare with Object.is; immutable updates (new references) are required to trigger re-renders.' },
    { area: 'Vue', detail: 'Reactivity tracks reference/reactive identity; replacing a ref or reactive object notifies watchers, so equality semantics drive when components update.' },
    { area: 'Node.js', detail: 'Backend validation and routing rely on === for predictable type-safe checks; the `value == null` idiom is common for optional config/params.' },
    { area: 'Backend', detail: 'Caching/memoization keyed by reference uses identity equality; deduplication and Set/Map membership use SameValueZero (like === but NaN matches NaN).' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      '=== is the fastest comparison: a quick type check then a value/reference compare, with no coercion work.',
      'Reference equality on objects is O(1), which is why frameworks prefer it over deep comparison for change detection.',
    ],
    bad: [
      '== may invoke ToPrimitive/ToNumber and even recursive coercion, doing more work than ===.',
      'Deep-equality comparisons (when people reach for them instead of references) are O(n) and can dominate hot paths.',
    ],
    optimizations: [
      'Use === to keep comparisons cheap and JIT-friendly (stable, monomorphic types).',
      'Lean on reference equality plus immutability for change detection instead of deep compares.',
      'Use Set/Map (SameValueZero) for membership/dedup rather than repeated linear === scans.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Loose == comparisons on untrusted input can be exploited via crafted coercions (e.g. "0e0", arrays, or objects with custom valueOf) to bypass equality checks.',
      'Authorization or token checks using == may match unexpected values after coercion, weakening access control.',
    ],
    bestPractices: [
      'Always use === (or a constant-time compare for secrets) for security-sensitive equality checks; never rely on coercion.',
      'Validate and normalize untrusted input to a known type before comparing, and avoid comparing user-controlled objects directly.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'type-coercion', 'null-vs-undefined', 'primitive-vs-reference'],
    nextConcepts: ['typeof-instanceof', 'truthy-falsy', 'shallow-vs-deep-copy', 'ieee-754-floating-point'],
    dependencyNote:
      'Equality comparison is a direct application of type coercion (for ==) and primitive-vs-reference (for object identity). It builds on data types and null/undefined, and connects to typeof/instanceof checks and shallow-vs-deep copy/equality.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write three columns: == (loose, coerces), === (strict, no coerce), Object.is (SameValue).',
      'Under ==: 1 == "1" true, 0 == false true, null == undefined true.',
      'Under ===: same examples all false except identical types/values; objects compare by reference.',
      'Under Object.is: same as === EXCEPT NaN===NaN→false but Object.is(NaN,NaN)→true, and +0/-0.',
      'Add the rule: "primitives compare by value, objects compare by reference".',
      'Say: "Default to ===; the only good == is x == null; reach for Object.is for NaN/-0; objects need deep-equality for contents."',
    ],
    diagram: `      ==          ===          Object.is
   (coerce)    (strict)      (SameValue)
   1=="1" T    1==="1" F     same as === except:
   0==false T  0===false F     NaN,NaN  -> true
   null==      objects:        +0,-0    -> false
   undef T     by REFERENCE

   primitives -> by value ; objects -> by reference
   default: ===   ;   good ==: x == null`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    '=== compares type and value with no coercion and is the default. == coerces operands first, producing surprises like 1 == "1", "" == 0, and null == undefined all being true. Object.is is like === except it treats NaN as equal to NaN and +0 as different from -0. Primitives compare by value; objects compare by reference, so {} === {} is false. The only idiomatic == use is `x == null`. Frameworks use Object.is/reference equality for change detection.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript has three equality checks. Strict equality, ===, compares both type and value with no coercion: if the types differ it is immediately false, and for objects it compares references, not contents. This is the one you should use by default. Loose equality, ==, first coerces the operands to a common type and then compares, which produces a long list of surprises — 1 == "1" is true, 0 == false is true, "" == 0 is true, and null == undefined is true. Those coercion rules are exactly why == has a bad reputation; the one place it is genuinely idiomatic is `x == null`, which matches both null and undefined and nothing else. The third option, Object.is, uses the SameValue algorithm and behaves like === with two corrections: Object.is(NaN, NaN) is true, even though NaN === NaN is false, and Object.is treats +0 and -0 as different, even though === considers them equal. A crucial point for objects is reference identity: two structurally identical objects are never strictly equal, so {a:1} === {a:1} is false; only two references to the same object are equal. That is also why React and Vue rely on reference equality — React literally uses Object.is — so you must create new references with immutable updates to trigger re-renders. For NaN I use Number.isNaN, and for deep structural comparison I use a dedicated deep-equality helper.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Reference equality is O(1) and ideal for change detection, but forces an immutability discipline; deep equality is intuitive but O(n) and easy to misuse in hot paths.',
      '`x == null` is concise but teaches teams that == is sometimes fine, blurring the "always ===" lint rule; some teams ban == entirely for consistency.',
    ],
    edgeCases: [
      'NaN !== NaN under ===; Object.is(NaN, NaN) is true; SameValueZero (used by Array.includes, Set, Map) also treats NaN as equal but +0 as equal to -0.',
      '+0 vs -0: === and SameValueZero say equal, Object.is says different — matters in graphics/physics math.',
      '[] == ![] is true via coercion: ![] → false → 0, [] → "" → 0.',
      'Objects with custom valueOf/Symbol.toPrimitive can make == results depend on side-effecting conversions.',
    ],
    runtimeBehavior: [
      '=== short-circuits on type mismatch; == may run recursive ToPrimitive/ToNumber conversions.',
      'There are three distinct algorithms in the spec — IsStrictlyEqual, IsLooselyEqual, and SameValue — plus SameValueZero for collection membership.',
      'Object identity equality is a pointer comparison; structural equality requires explicit traversal.',
    ],
    scalability: [
      'Immutable data + reference equality scales change detection in large component trees far better than deep diffing.',
      'Set/Map membership (SameValueZero) gives O(1) dedup/lookup versus O(n) === scans across large collections.',
    ],
    productionConcerns: [
      'In-place mutation breaking React/Vue updates is a top recurring UI bug rooted in reference equality.',
      'Loose == in auth/validation paths is a real security risk via crafted coercions; enforce === with lint rules.',
      'NaN slipping through `x === NaN` checks silently disables validation — standardize on Number.isNaN.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    '=== strict: compares type AND value, no coercion — the default.',
    '== loose: coerces first, then compares — surprises galore.',
    'Object.is = SameValue: like === but NaN===NaN true and +0/-0 different.',
    'Primitives compare by VALUE; objects compare by REFERENCE.',
    '{} === {} is false; same reference === itself is true.',
    'null == undefined → true; null === undefined → false.',
    '1 == "1" true; 0 == false true; "" == 0 true.',
    'NaN === NaN is false → use Number.isNaN (or Object.is).',
    'Only idiomatic == is `x == null` (matches null + undefined).',
    'SameValueZero (includes/Set/Map): NaN equal, +0 === -0.',
    'React/Vue change detection uses reference/Object.is equality.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict each: `console.log(2 == "2", 2 === "2", null == undefined, null === undefined)`.',
      hint: 'Remember == coerces, === checks type first.',
      solution: {
        lang: 'js',
        code: `console.log(
  2 == '2',          // true  (string -> number)
  2 === '2',         // false (number vs string)
  null == undefined, // true  (special == rule)
  null === undefined // false (different types)
)`,
        explanation: [
          '== coerces "2" to 2, so 2 == "2" is true.',
          '=== sees different types and returns false.',
          'null and undefined are loosely equal by a dedicated rule.',
          'They are strictly unequal because their types differ.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write sameValue(a, b) that behaves like Object.is WITHOUT using Object.is.',
      hint: 'Handle NaN and the +0/-0 case specially; otherwise use ===.',
      solution: {
        lang: 'js',
        code: `function sameValue(a, b) {
  if (a === b) {
    // distinguish +0 from -0: 1/+0 = Infinity, 1/-0 = -Infinity
    return a !== 0 || 1 / a === 1 / b
  }
  // NaN case: only NaN is not equal to itself
  return a !== a && b !== b
}
sameValue(NaN, NaN) // true
sameValue(-0, 0)    // false
sameValue(1, 1)     // true`,
        explanation: [
          'If === is true we still must split +0 and -0 using 1/x sign.',
          'If === is false, the only "same value" case is NaN, which is the only value where a !== a.',
          'This reproduces the SameValue algorithm Object.is implements.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement deepEqual(a, b) for JSON-like values (primitives, arrays, plain objects).',
      hint: 'Recurse over keys; compare primitives with Object.is.',
      solution: {
        lang: 'js',
        code: `function deepEqual(a, b) {
  if (Object.is(a, b)) return true
  if (typeof a !== 'object' || a === null ||
      typeof b !== 'object' || b === null) return false
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  if (ka.length !== kb.length) return false
  return ka.every(k =>
    Object.prototype.hasOwnProperty.call(b, k) && deepEqual(a[k], b[k])
  )
}
deepEqual({ x: [1, 2] }, { x: [1, 2] }) // true
deepEqual({ x: 1 }, { x: 2 })           // false`,
        explanation: [
          'Object.is handles primitive (and NaN) equality at the leaves.',
          'Non-object mismatches short-circuit to false.',
          'Equal key counts plus recursive per-key comparison establish structural equality.',
          'This is the kind of helper you reach for since === only compares references.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in comments why `[] == ![]` is true, then show what `[] === ![]` returns.',
      hint: 'Evaluate the unary ! first, then run the == coercion steps.',
      solution: {
        lang: 'js',
        code: `// [] == ![]
// ![] -> [] is truthy -> ! -> false   => [] == false
// boolean side coerced: false -> 0     => [] == 0
// object side: ToPrimitive([]) -> ""    => "" == 0
// "" -> 0                                => 0 == 0 -> true
console.log([] == ![])  // true

// === does NO coercion: array (object) vs boolean
console.log([] === ![]) // false  (different types, no coercion)`,
        explanation: [
          '![] evaluates first: an array is truthy, negated to false.',
          '== then coerces false → 0 and [] → "" → 0, giving 0 == 0.',
          'So loose equality yields true through pure coercion.',
          '=== never coerces: an object compared to a boolean is simply false.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Equality is in nearly every conditional you write. A crisp == vs === vs Object.is answer signals you understand coercion, types, references, and even framework change detection — making it one of the highest-leverage topics to nail.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the == vs === definition and a few predict-the-output lines. Product companies (Zoho, Flipkart, Razorpay) probe object reference equality, the null==undefined rule, and NaN. FAANG-level rounds explore Object.is/SameValue/SameValueZero, the [] == ![] derivation, and how immutability and Object.is drive React re-renders.',
    whatInterviewersExpect:
      'They expect "use === by default", a clear explanation of == coercion with examples, the object-by-reference rule, correct NaN handling, and ideally the Object.is special cases tied to React/Vue change detection.',
  },
}

export default equalityComparison
