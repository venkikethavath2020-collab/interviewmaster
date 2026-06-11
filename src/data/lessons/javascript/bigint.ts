import type { ConceptLesson } from '../../../types/lesson'

const bigint: ConceptLesson = {
  // 1. Concept Summary
  slug: 'bigint',
  name: 'BigInt',
  category: 'types-coercion',
  difficulty: 'intermediate',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Regular JavaScript numbers lose precision beyond 2^53 - 1, so any code dealing with huge integers — 64-bit IDs, cryptography, timestamps in nanoseconds — needs BigInt to stay correct.',
    'BigInt is the language\'s answer to the most common precision bug: large database/Snowflake IDs silently corrupting when parsed as Number.',
    'It introduces a new primitive type with its own rules (no mixing with Number, separate typeof), which interviewers use to test type-system awareness.',
    'Knowing when NOT to use it matters too: BigInt is slower and not for everyday math, so choosing it appropriately signals good judgment.',
    'It interacts with JSON, equality, and coercion in ways that cause real bugs (JSON.stringify throws on BigInt), so you must handle serialization deliberately.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'BigInt is a notebook with unlimited pages for writing huge whole numbers, instead of a tiny calculator screen that runs out of digits.',
    story: [
      'Imagine a small calculator whose screen can only show a certain number of digits. If your number is too long, the last digits get cut off or guessed.',
      'Now imagine instead you have a giant notebook where you can write a whole number as long as you want, digit by digit, and it is always exactly right.',
      'The calculator is fast and fine for everyday sums, but for gigantic whole numbers it makes mistakes; the notebook never does, though it is a bit slower to write in.',
      'In JavaScript the normal number is the calculator, and BigInt is the unlimited notebook for huge whole numbers — you add a little "n" to tell JavaScript "use the notebook".',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normal JavaScript numbers can only stay exact up to a certain size; past that, very large whole numbers start getting rounded and wrong.',
    'BigInt is a special kind of number that can hold whole numbers of ANY size without losing accuracy.',
    'You write a BigInt by putting an "n" at the end, like 123n, or by calling BigInt(123).',
    'The catch is you cannot freely mix BigInts and normal numbers in math — you have to convert one to match the other first.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'BigInt is a primitive numeric type for arbitrary-precision integers — whole numbers of unlimited size with no rounding. It is distinct from Number and is written with an n suffix (10n) or BigInt(10).',
    how: 'The engine stores BigInts as variable-length integers (not the fixed 64-bit double), performing exact integer arithmetic. typeof returns "bigint", and BigInt and Number cannot be mixed in arithmetic without explicit conversion.',
    why: 'Use it when integers exceed Number.MAX_SAFE_INTEGER (2^53 - 1): 64-bit IDs, big counters, cryptographic values, and high-precision timestamps where exactness is required.',
    code: {
      label: 'Creating BigInts and the no-mixing rule',
      lang: 'js',
      code: `const a = 9007199254740993n     // n suffix
const b = BigInt('9007199254740993') // from string
console.log(typeof a)               // "bigint"

console.log(a + 1n)                 // 9007199254740994n (exact!)

// Cannot mix BigInt and Number:
// console.log(a + 1)  // TypeError!
console.log(a + BigInt(1))          // ok, convert first
console.log(Number(a))              // 9007199254740992 (precision lost!)`,
      explanation: [
        'The n suffix or BigInt() creates a BigInt; typeof is "bigint".',
        'BigInt arithmetic stays exact no matter how large.',
        'Mixing BigInt with Number in arithmetic throws a TypeError — by design, to prevent silent precision loss.',
        'Convert explicitly with BigInt()/Number(), but Number() of a large BigInt loses precision.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'BigInt is a primitive type added in ES2020 representing integers of arbitrary magnitude with exact precision, free of the 2^53 - 1 limit imposed by IEEE-754 doubles. Literals use the n suffix (123n) and the BigInt() function converts from Number/String. typeof yields "bigint". BigInt and Number are intentionally not interoperable in arithmetic or bitwise operations (mixing throws a TypeError) to avoid silent precision loss, though they are comparable with relational and loose-equality operators (1n == 1 is true, 1n === 1 is false). BigInt is integer-only — it has no fractional part and division truncates toward zero — and it cannot be serialized by JSON.stringify, which throws.',

  // 7. Internal Working
  internalWorking: [
    'A BigInt is stored as a variable-length sequence of machine words (a sign plus an array of digits), unlike Number which is a fixed 64-bit double — so its size grows with the magnitude of the value.',
    'Arithmetic is implemented with big-integer algorithms (schoolbook or Karatsuba-style multiplication for large operands), producing exact results with no rounding.',
    'The engine forbids implicit mixing with Number because there is no safe automatic conversion: Number cannot hold large BigInts exactly, and BigInt cannot hold fractions, so the spec throws a TypeError rather than guess.',
    'Comparison operators (<, >, ==) DO allow cross-type comparison by mathematically comparing values, but === checks type first, so 1n === 1 is false.',
    'Division (/) on BigInt truncates toward zero (5n / 2n === 2n) since BigInt has no fractional representation.',
    'BigInt is not allocated as a small inline value like Smi integers; large BigInts live on the heap, and operations allocate new BigInt objects (they are immutable primitives).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   Number (double)            BigInt
   ──────────────            ──────────────
   fixed 64 bits             variable length (grows)
   exact only ≤ 2^53−1       exact for ANY integer
   has fractions             integer ONLY (/ truncates)
   1, 3.14, NaN, Infinity    1n, 9007199254740993n

   typeof 1   -> "number"    typeof 1n -> "bigint"

   MIXING:  1n + 1   -> TypeError
            1n + 1n  -> 2n      (ok)
   COMPARE: 1n == 1  -> true    (value compare)
            1n === 1 -> false   (type differs)
   JSON.stringify(1n) -> THROWS`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A BigInt is a heap-allocated, immutable object holding a sign and a digit array; its memory footprint scales with the number of digits.',
    'Every arithmetic operation produces a NEW BigInt (immutability), so heavy BigInt loops allocate many short-lived objects, pressuring the GC.',
    'Numbers, by contrast, fit in a fixed 64-bit slot (and small ints are tagged inline), so they are far cheaper to allocate and operate on.',
    'Because BigInts are not interned like small numbers, even small BigInts (e.g. 1n) may be heap objects, making them slower than their Number counterparts.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — exactness beyond the safe integer limit',
      lang: 'js',
      code: `console.log(Number.MAX_SAFE_INTEGER)      // 9007199254740991
console.log(9007199254740991 + 2)         // 9007199254740992 (wrong, +2 lost)
console.log(9007199254740991n + 2n)       // 9007199254740993n (exact)

console.log(2n ** 100n)                   // huge exact integer
console.log(typeof 2n ** 100n)            // "bigint"`,
      explanation: [
        'Adding to a Number past the safe limit silently loses precision.',
        'BigInt keeps the result exact regardless of magnitude.',
        'You can compute 2^100 exactly, impossible with Number.',
        'typeof confirms the result is still a bigint.',
      ],
    },
    intermediate: {
      label: 'Intermediate — comparisons, division, and conversion',
      lang: 'js',
      code: `console.log(10n == 10)    // true  (value compare)
console.log(10n === 10)   // false (type differs)
console.log(10n < 20)     // true  (cross-type relational ok)

console.log(7n / 2n)      // 3n   (truncates, no fraction)
console.log(7n % 2n)      // 1n

// Convert carefully:
console.log(Number(10n))  // 10
console.log(BigInt(10))   // 10n
// BigInt(10.5)           // RangeError (no fractions)`,
      explanation: [
        '== compares values across types; === requires the same type, so 10n === 10 is false.',
        'Relational operators compare BigInt and Number by mathematical value.',
        'BigInt division truncates toward zero — there is no remainder fraction.',
        'Number()/BigInt() convert explicitly; BigInt() rejects non-integer numbers.',
      ],
    },
    advanced: {
      label: 'Advanced — JSON serialization needs a custom path',
      lang: 'js',
      code: `const data = { id: 9007199254740993n }

// JSON.stringify throws on BigInt:
// JSON.stringify(data)  // TypeError: Do not know how to serialize a BigInt

// Custom serialize: convert BigInt to string
const json = JSON.stringify(data, (key, value) =>
  typeof value === 'bigint' ? value.toString() : value
)
console.log(json)  // {"id":"9007199254740993"}

// Revive: turn known fields back into BigInt
const revived = JSON.parse(json, (key, value) =>
  key === 'id' ? BigInt(value) : value
)
console.log(revived.id) // 9007199254740993n`,
      explanation: [
        'JSON.stringify has no native BigInt support and throws.',
        'A replacer function converts BigInts to strings so they survive serialization exactly.',
        'A reviver converts known fields back to BigInt on parse.',
        'This is the standard pattern for transporting BigInt IDs over JSON APIs.',
        'Without it, you risk either a crash or precision loss.',
      ],
    },
    realProject: {
      label: 'Real project — handling 64-bit IDs from a Node/Postgres backend',
      lang: 'js',
      code: `// Postgres BIGINT or Snowflake IDs exceed 2^53 - 1.
// Driver returns them as strings; convert to BigInt for exact math.
function nextId(currentId) {
  return (BigInt(currentId) + 1n).toString() // keep as string in transport
}
nextId('9007199254740993') // "9007199254740994"

// In a Vue/React store, keep the ID as a string for display/keys,
// using BigInt only when you must do arithmetic or comparison.
const a = BigInt('18446744073709551615') // max uint64
console.log(a === BigInt('18446744073709551615')) // true`,
      explanation: [
        'Database BIGINT and distributed-ID schemes exceed the safe Number range.',
        'Drivers commonly return such IDs as strings to avoid corruption.',
        'BigInt is used for exact increment/compare, then converted back to string for transport.',
        'In frontend state you usually keep IDs as strings and reach for BigInt only for arithmetic.',
        'This avoids both the crash and the silent precision loss.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is BigInt and why was it added to JavaScript?',
      answer: 'BigInt is a primitive type for arbitrary-precision integers, added in ES2020 to represent whole numbers beyond Number.MAX_SAFE_INTEGER (2^53 - 1) without losing precision — for example 64-bit IDs and cryptographic values.',
      explanation: 'Naming the precision limit it solves and a concrete use case is the key signal.',
    },
    {
      level: 'beginner',
      question: 'How do you create a BigInt and what does typeof return?',
      answer: 'Use the n suffix (123n) or the BigInt() function (BigInt(123) or BigInt("123")). typeof returns "bigint".',
      explanation: 'Basic literacy: both creation forms and the new typeof result.',
    },
    {
      level: 'intermediate',
      question: 'What happens if you do `1n + 1`? Why?',
      answer: 'It throws a TypeError. BigInt and Number cannot be mixed in arithmetic because there is no safe implicit conversion — Number cannot hold large BigInts exactly and BigInt cannot hold fractions — so the language refuses rather than silently corrupt the value.',
      explanation: 'The "why" (preventing silent precision loss) is what distinguishes a strong answer.',
    },
    {
      level: 'intermediate',
      question: 'Why does `10n === 10` return false but `10n == 10` return true?',
      answer: '=== checks type first, and bigint differs from number, so it is false. == compares mathematical value across types, so 10n == 10 is true.',
      explanation: 'Tests the equality/coercion interaction specific to BigInt.',
    },
    {
      level: 'advanced',
      question: 'How do you serialize a BigInt to JSON?',
      answer: 'JSON.stringify throws on BigInt, so you provide a replacer that converts BigInts to strings (value.toString()) and a reviver on parse that converts known fields back with BigInt(). Alternatively define a custom toJSON.',
      explanation: 'A common real-world gotcha; the replacer/reviver pattern shows production experience.',
    },
    {
      level: 'senior',
      question: 'When should you NOT use BigInt, and what are its costs?',
      answer: 'Avoid it for everyday or fractional math: it is integer-only, slower than Number, allocates heap objects, is not JSON-serializable, and cannot mix with Number. Use it only when exact integers exceed the safe range; otherwise prefer Number (or strings for IDs you only transport).',
      explanation: 'Senior signal: judgment about costs (perf, ergonomics, serialization) and choosing the right tool.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How does BigInt division differ from Number division?',
    'Why can BigInt not represent fractions, and what happens with BigInt(1.5)?',
    'How do bitwise operations behave on BigInt vs Number?',
    'What is the performance difference between BigInt and Number in a loop?',
    'How would you transport BigInt IDs through a REST/JSON API safely?',
    'Can BigInt be used as object keys or in a Set/Map?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Mixing BigInt and Number in arithmetic.',
      why: 'It throws a TypeError because there is no safe implicit conversion between the two.',
      fix: 'Convert explicitly: use BigInt(n) or Number(b) (mindful that Number() of a large BigInt loses precision).',
    },
    {
      mistake: 'Calling JSON.stringify on data containing BigInt.',
      why: 'JSON has no BigInt type, so stringify throws a TypeError.',
      fix: 'Use a replacer to convert BigInts to strings, and a reviver to restore them on parse.',
    },
    {
      mistake: 'Using BigInt for everyday math or fractional values.',
      why: 'It is slower, integer-only (BigInt(1.5) throws), and clutters code with conversions.',
      fix: 'Use Number for normal/fractional math; reserve BigInt for integers beyond the safe range.',
    },
    {
      mistake: 'Converting a large Number literal to BigInt expecting exactness.',
      why: 'BigInt(9007199254740993) takes the already-imprecise Number, so the value is wrong before conversion.',
      fix: 'Create BigInt from a STRING: BigInt("9007199254740993").',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Backends handle 64-bit DB keys (Postgres BIGINT), Snowflake/Twitter-style distributed IDs, and high-resolution timers (process.hrtime.bigint) with BigInt for exactness.' },
    { area: 'Backend', detail: 'Cryptography, hashing, and large-number protocols use BigInt for exact arbitrary-precision integer math that Number cannot provide.' },
    { area: 'React', detail: 'Clients usually keep large IDs as strings for rendering/keys and convert to BigInt only when arithmetic or precise comparison is required; JSON boundaries use string transport.' },
    { area: 'Vue', detail: 'Stores keep big IDs as strings; computed logic converts to BigInt for safe comparisons, then back to string for display and routing.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'BigInt gives exact results for arbitrarily large integers where Number simply cannot, which is correctness you cannot buy any other way.',
      'For genuinely large-integer workloads (crypto, big factorials), BigInt is the appropriate and only correct primitive.',
    ],
    bad: [
      'BigInt arithmetic is significantly slower than Number and allocates heap objects per operation, hurting hot loops.',
      'Even small BigInts (1n) are heavier than tagged small integers, so using BigInt as a default number type wastes performance.',
    ],
    optimizations: [
      'Use BigInt only past the safe-integer range; keep ordinary math on Number.',
      'Minimize conversions between BigInt and Number/string in hot paths — convert once at boundaries.',
      'For IDs you only store/transport (no arithmetic), keep them as strings to avoid BigInt allocation overhead entirely.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Converting large numeric IDs through Number before BigInt corrupts them, which can cause authorization or record-matching errors (acting on the wrong entity).',
      'Naive crypto/random use of BigInt without constant-time guarantees can leak timing information; BigInt arithmetic is not constant-time.',
    ],
    bestPractices: [
      'Always construct BigInt from strings for untrusted/large IDs, and validate ranges before use.',
      'Do not implement security-critical cryptography by hand with BigInt; use vetted libraries (WebCrypto/Node crypto) that handle timing and correctness.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'ieee-754-floating-point', 'typeof-instanceof'],
    nextConcepts: ['json-serialization', 'type-coercion', 'equality-comparison', 'symbol'],
    dependencyNote:
      'BigInt directly answers the precision limits of ieee-754-floating-point and is a new primitive checked via typeof. It interacts with type coercion and equality (the no-mixing and ==/=== rules) and with JSON serialization (which it cannot natively handle).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write Number.MAX_SAFE_INTEGER = 2^53 - 1 and show a Number losing precision past it.',
      'Introduce BigInt: literal 123n or BigInt("123"), typeof "bigint", exact for any size.',
      'Write the no-mixing rule: 1n + 1 → TypeError; convert with BigInt()/Number().',
      'Write equality: 10n == 10 true, 10n === 10 false; division 7n/2n = 3n (truncates).',
      'Note JSON.stringify throws → use a replacer to stringify BigInts.',
      'Say: "Use BigInt for exact integers beyond 2^53; it is slower, integer-only, and needs custom JSON — so do not use it for everyday math."',
    ],
    diagram: `   Number: exact ≤ 2^53−1, fast, has fractions
   BigInt: exact any size, slower, integer only

   123n / BigInt("123")   typeof -> "bigint"
   1n + 1    -> TypeError   (no mixing)
   10n == 10 -> true        10n === 10 -> false
   7n / 2n   -> 3n          (truncates)
   JSON.stringify(1n) -> THROWS (use replacer -> string)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'BigInt is a primitive for arbitrary-precision integers, written with an n suffix (123n) or BigInt(), with typeof "bigint". It exists because Number loses precision past 2^53 - 1, so BigInt handles 64-bit IDs, crypto, and huge counters exactly. You cannot mix BigInt and Number in arithmetic (TypeError); == compares by value across types but === does not; division truncates; and JSON.stringify throws so you serialize via a replacer. It is slower and integer-only, so use it only when exactness on large integers is required.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'BigInt is a primitive type added in ES2020 for arbitrary-precision integers. It exists because all regular JavaScript numbers are 64-bit IEEE-754 doubles that are only exact up to Number.MAX_SAFE_INTEGER, which is 2^53 - 1; beyond that, integers silently lose precision. BigInt has no such limit — it can represent whole numbers of any size exactly. You create one with the n suffix, like 123n, or with the BigInt function from a number or string, and typeof returns "bigint". The most important rule is that BigInt and Number cannot be mixed in arithmetic — 1n + 1 throws a TypeError. That is deliberate: there is no safe automatic conversion, because Number cannot hold a large BigInt exactly and BigInt cannot hold a fraction, so the language refuses rather than corrupt the value. Comparison is more lenient: 10n == 10 is true because it compares by value, but 10n === 10 is false because the types differ, and division truncates since BigInt is integer-only. Two practical gotchas: JSON.stringify throws on BigInt, so you serialize via a replacer that converts to strings and a reviver that converts back; and BigInt("9007199254740993") must be built from a string, not a Number literal, or the precision is already lost. The trade-off is that BigInt is slower and allocates heap objects, so I use it only for genuinely large integers — 64-bit IDs, cryptography, big counters — and keep everyday and fractional math on Number.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Exactness vs performance: BigInt removes precision limits but is markedly slower and allocates per operation, so it is wrong as a general number type.',
      'BigInt vs string for IDs: BigInt enables exact arithmetic/comparison but needs conversions and custom JSON; strings are simpler when you only store and transport IDs.',
    ],
    edgeCases: [
      'BigInt(1.5) throws a RangeError — only integer inputs are allowed.',
      'Mixing in arithmetic/bitwise throws TypeError, but relational/loose-equality comparisons across types are allowed.',
      'JSON.stringify throws on BigInt; you must supply a replacer (or toJSON).',
      'Unary plus (+1n) throws to preserve asm.js semantics, an oddity worth knowing.',
    ],
    runtimeBehavior: [
      'BigInts are stored as variable-length digit arrays; arithmetic uses big-integer algorithms with no rounding.',
      'They are immutable primitives, so each operation allocates a new value, creating GC pressure in tight loops.',
      'BigInt is not interned like small integers, so even 1n can be a heap object, slower than a tagged Number.',
    ],
    scalability: [
      'For large-integer workloads (crypto, big-number protocols) BigInt is the correct primitive; for high-throughput numeric loops, Number stays far faster.',
      'At service boundaries, standardize on string transport for big IDs and convert to BigInt only where exact math is required, keeping the hot path lean.',
    ],
    productionConcerns: [
      'JSON serialization crashes are a common BigInt integration bug — centralize a replacer/reviver in your serialization layer.',
      'Converting big IDs through Number before BigInt corrupts them, risking acting on the wrong record — enforce string-based construction.',
      'Performance regressions appear when BigInt creeps into hot numeric code; profile and confine BigInt to where exactness is mandatory.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'BigInt = arbitrary-precision integer primitive (ES2020).',
    'Create: 123n or BigInt(123) / BigInt("123").',
    'typeof 1n === "bigint".',
    'Solves Number precision loss beyond 2^53 - 1.',
    'Cannot mix with Number in arithmetic → TypeError.',
    '10n == 10 → true (value); 10n === 10 → false (type).',
    'Integer only: 7n / 2n → 3n (truncates); BigInt(1.5) throws.',
    'JSON.stringify(1n) throws → use a replacer → string.',
    'Build big IDs from STRINGS, not Number literals.',
    'Slower than Number and heap-allocated → use only for large integers.',
    'Use cases: 64-bit IDs, crypto, big counters, hrtime.bigint.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write toBigIntSafe(value) that returns a BigInt from a string or number, or null if it is not a valid integer.',
      hint: 'Wrap BigInt() in a try/catch.',
      solution: {
        lang: 'js',
        code: `function toBigIntSafe(value) {
  try {
    return BigInt(value)
  } catch {
    return null
  }
}
toBigIntSafe('123')  // 123n
toBigIntSafe(42)     // 42n
toBigIntSafe('12.5') // null (not an integer)
toBigIntSafe('abc')  // null`,
        explanation: [
          'BigInt() throws for non-integer or non-numeric inputs.',
          'A try/catch converts that into a null result for safe handling.',
          'Strings are preferred for large values to avoid pre-conversion precision loss.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write factorial(n) using BigInt so it stays exact for large n (e.g. factorial(25)).',
      hint: 'Accumulate with a BigInt and a BigInt loop counter.',
      solution: {
        lang: 'js',
        code: `function factorial(n) {
  let result = 1n
  for (let i = 2n; i <= BigInt(n); i++) {
    result *= i
  }
  return result
}
factorial(25)
// 15511210043330985984000000n (exact)`,
        explanation: [
          'Starting from 1n keeps every multiplication in BigInt space.',
          'The loop counter is also a BigInt to avoid mixing types.',
          'factorial(25) far exceeds the safe integer range yet stays exact.',
          'A Number version would lose precision well before n = 25.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write serialize(obj) and deserialize(json, bigIntKeys) that round-trip an object whose given keys are BigInt, through JSON.',
      hint: 'Use a replacer to stringify BigInts and a reviver to restore the listed keys.',
      solution: {
        lang: 'js',
        code: `function serialize(obj) {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}
function deserialize(json, bigIntKeys = []) {
  return JSON.parse(json, (key, value) =>
    bigIntKeys.includes(key) ? BigInt(value) : value
  )
}
const s = serialize({ id: 9007199254740993n, name: 'x' })
// '{"id":"9007199254740993","name":"x"}'
const o = deserialize(s, ['id'])
console.log(o.id) // 9007199254740993n`,
        explanation: [
          'The replacer converts every BigInt to its string form so JSON.stringify does not throw.',
          'The reviver restores the listed keys back to BigInt on parse.',
          'String transport preserves the exact value across the JSON boundary.',
          'This is the canonical pattern for BigInt over APIs.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in comments why `BigInt(9007199254740993) !== 9007199254740993n`, and how to fix the construction.',
      hint: 'Think about when precision is lost.',
      solution: {
        lang: 'js',
        code: `// 9007199254740993 is a NUMBER literal, already rounded to
// 9007199254740992 BEFORE BigInt sees it.
console.log(BigInt(9007199254740993))  // 9007199254740992n (wrong!)
console.log(9007199254740993n)         // 9007199254740993n (correct)

// FIX: build from a string so no Number rounding happens:
console.log(BigInt('9007199254740993')) // 9007199254740993n`,
        explanation: [
          'The Number literal is rounded to a representable double before BigInt() runs.',
          'So BigInt receives the already-corrupted value.',
          'The n literal and BigInt("...") both avoid the Number step and stay exact.',
          'Lesson: never round-trip large integers through Number.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'BigInt is the correct answer to "how do I not corrupt a 64-bit ID or compute a huge integer", a real problem in any system with distributed IDs or big numbers. Knowing its rules and when to avoid it signals mature judgment.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep — they may ask what BigInt is and how to create one. Product companies (Zoho, Flipkart, Razorpay) probe the no-mixing rule, equality results, and JSON serialization. FAANG-level rounds ask about performance trade-offs, ID handling across service boundaries, and the precision-loss-before-conversion gotcha.',
    whatInterviewersExpect:
      'They expect you to explain the 2^53 limit it solves, both creation forms and typeof, the no-mixing TypeError and why, the ==/=== difference, JSON handling, and the judgment to use it only for large integers rather than everyday math.',
  },
}

export default bigint
