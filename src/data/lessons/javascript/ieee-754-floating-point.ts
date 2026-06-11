import type { ConceptLesson } from '../../../types/lesson'

const ieee754FloatingPoint: ConceptLesson = {
  // 1. Concept Summary
  slug: 'ieee-754-floating-point',
  name: 'Floating Point & Safe Integers',
  category: 'types-coercion',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Every JavaScript number is a 64-bit IEEE-754 double, which is why 0.1 + 0.2 is not 0.3 — the single most famous gotcha in programming.',
    'Money, IDs, and counters silently break: representing currency as floats loses cents, and large integer IDs beyond 2^53 collide.',
    'Comparisons and rounding behave unintuitively (===, toFixed, Math.round) unless you understand the binary representation underneath.',
    'It is an advanced interview favorite because it tests whether you understand how numbers are actually stored, not just how they print.',
    'Knowing the safe-integer limit and epsilon-based comparison lets you write correct financial and data-handling code instead of shipping rounding bugs.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Computers store numbers like a ruler with only certain marked lines — some values fall between the marks and get nudged to the nearest one.',
    story: [
      'Imagine a ruler that only has lines at certain spots, and you must always point at a printed line — you can never point exactly between two lines.',
      'If you want to point at a spot that has no line, you have to choose the closest line instead, which is a tiny bit off from what you wanted.',
      'Most of the time you do not notice, but if you add up many of these tiny "almost right" measurements, the small errors stack up.',
      'Computers store decimal numbers in binary the same way: some decimals like 0.1 have no exact line on the binary ruler, so the computer keeps the closest value. That is why 0.1 + 0.2 comes out slightly wrong.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Computers store numbers in binary (base 2), but many everyday decimals like 0.1 cannot be written exactly in binary — just like 1/3 cannot be written exactly as a decimal (0.3333...).',
    'JavaScript uses a 64-bit format called a "double" that stores a sign, an exponent, and the significant digits, giving about 15-17 decimal digits of precision.',
    'Because some decimals are stored as the nearest representable value, tiny errors appear, which is why 0.1 + 0.2 prints 0.30000000000000004.',
    'For whole numbers it is exact up to a limit (about 9 quadrillion); beyond that, integers start losing precision and you need BigInt.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'JavaScript has one numeric type: the IEEE-754 double-precision (64-bit) floating-point number. It stores values as sign + exponent + mantissa, giving finite precision, so many decimals are approximated and integers are only exact up to Number.MAX_SAFE_INTEGER (2^53 - 1).',
    how: 'Each number is packed into 64 bits: 1 sign bit, 11 exponent bits, 52 mantissa bits. Values that cannot be represented exactly are rounded to the nearest representable double, introducing small errors.',
    why: 'Understanding this explains 0.1 + 0.2 ≠ 0.3, why you must compare with an epsilon, why money should be handled in integer cents or decimals, and why huge IDs need BigInt or strings.',
    code: {
      label: 'The famous gotcha and how to compare safely',
      lang: 'js',
      code: `console.log(0.1 + 0.2)            // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3)    // false!

// Compare with a tolerance (epsilon):
function nearlyEqual(a, b, eps = Number.EPSILON) {
  return Math.abs(a - b) < eps
}
console.log(nearlyEqual(0.1 + 0.2, 0.3)) // true

// Safe integer limit:
console.log(Number.MAX_SAFE_INTEGER)     // 9007199254740991
console.log(9007199254740992 === 9007199254740993) // true (!) precision lost`,
      explanation: [
        '0.1 and 0.2 have no exact binary representation, so their sum is slightly off.',
        'Direct === fails because the stored value is 0.30000000000000004.',
        'Comparing with a small epsilon tolerance treats "close enough" as equal.',
        'Integers above 2^53 - 1 lose precision, making distinct values compare equal.',
        'Number.MAX_SAFE_INTEGER marks the boundary of exact integer math.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'All JavaScript numbers are IEEE-754 binary64 (double-precision) values: 1 sign bit, an 11-bit biased exponent, and a 52-bit fraction (mantissa) with an implicit leading 1, yielding about 15-17 significant decimal digits. Because the format is binary, decimals whose denominators are not powers of two (e.g. 0.1) cannot be represented exactly and are rounded to the nearest representable double, producing accumulation errors. Integers are exact only within ±(2^53 - 1) (Number.MAX_SAFE_INTEGER); beyond that the spacing between representable doubles exceeds 1, so consecutive integers become indistinguishable. The format also defines special values: +0/-0, ±Infinity, and NaN, with NaN being unequal to itself.',

  // 7. Internal Working
  internalWorking: [
    'A double is encoded as value = (-1)^sign × 1.mantissa × 2^(exponent - 1023), where the 52-bit mantissa carries the significant bits and the 11-bit exponent is biased by 1023.',
    'To store a decimal like 0.1, the engine converts it to binary; 0.1 in binary is the repeating fraction 0.0001100110011..., which is truncated/rounded to fit 52 mantissa bits, introducing a tiny error.',
    'Arithmetic is performed on these rounded representations and the result is again rounded to the nearest representable double (round-half-to-even by default), so errors can compound across operations.',
    'For integers, as the magnitude grows the exponent increases and the gap (ULP, unit in the last place) between representable values grows; past 2^53 the gap exceeds 1, so not every integer can be stored.',
    'Special encodings: an all-zero exponent with nonzero mantissa gives subnormals; an all-ones exponent gives Infinity (zero mantissa) or NaN (nonzero mantissa); the sign bit alone distinguishes +0 from -0.',
    'Because the radix is 2, only fractions whose denominator is a power of two are exact; everything else (including most currency decimals) is an approximation.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   64-bit IEEE-754 double:
   ┌─┬───────────┬────────────────────────────────────┐
   │S│  exponent │            mantissa (fraction)       │
   │1│   11 bits │              52 bits                 │
   └─┴───────────┴────────────────────────────────────┘
     sign  biased(−1023)   implicit leading 1.xxxxx

   value = (-1)^S × 1.mantissa × 2^(exp − 1023)

   0.1 in binary = 0.0001100110011...(repeats) → rounded
   0.1 + 0.2 → 0.30000000000000004

   integers exact up to 2^53−1 = 9007199254740991
   beyond that: gap between doubles > 1  → precision lost`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Every number occupies a fixed 64-bit slot regardless of value — there is no separate integer type at the language level.',
    'Engines (V8) optimize small integers as "Smi" (tagged 31/32-bit ints) stored inline for speed, boxing to heap doubles only when needed.',
    'Floats that escape Smi range or are non-integers may be allocated as HeapNumber objects, adding indirection.',
    'The precision loss is not a memory leak — it is inherent to the fixed-width binary representation: the exact decimal simply has no bit pattern.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — rounding errors and safe comparison',
      lang: 'js',
      code: `console.log(0.1 + 0.2)           // 0.30000000000000004
console.log(0.3 - 0.1)           // 0.19999999999999998
console.log(0.1 + 0.2 === 0.3)   // false

const EPS = Number.EPSILON       // ~2.22e-16
console.log(Math.abs((0.1 + 0.2) - 0.3) < EPS) // true`,
      explanation: [
        'Binary cannot represent 0.1/0.2/0.3 exactly, so sums drift slightly.',
        'Strict equality on floats is unreliable.',
        'Number.EPSILON is the smallest gap near 1.0, a sensible tolerance baseline.',
        'Compare the absolute difference against an epsilon instead of using ===.',
      ],
    },
    intermediate: {
      label: 'Intermediate — safe integers and the 2^53 cliff',
      lang: 'js',
      code: `console.log(Number.MAX_SAFE_INTEGER) // 9007199254740991 (2^53 - 1)
console.log(Number.isSafeInteger(2 ** 53))     // false
console.log(2 ** 53 === 2 ** 53 + 1)           // true (!) precision lost

// A 64-bit ID from a backend can silently corrupt:
const id = 9007199254740993           // parsed as JS number
console.log(id)                        // 9007199254740992  (wrong!)
// Fix: keep large IDs as strings or BigInt
console.log(BigInt('9007199254740993')) // 9007199254740993n`,
      explanation: [
        'Number.MAX_SAFE_INTEGER is 2^53 - 1, the last exactly-representable integer.',
        'Past it, consecutive integers map to the same double, so they compare equal.',
        'Large IDs from databases (Twitter/Snowflake-style) corrupt if treated as numbers.',
        'Use strings or BigInt for IDs and integers beyond the safe range.',
      ],
    },
    advanced: {
      label: 'Advanced — money in integer cents, and toFixed pitfalls',
      lang: 'js',
      code: `// WRONG: floats lose cents
let total = 0
for (let i = 0; i < 10; i++) total += 0.1
console.log(total)         // 0.9999999999999999

// RIGHT: work in integer cents
let cents = 0
for (let i = 0; i < 10; i++) cents += 10
console.log(cents / 100)   // 1

// toFixed is for DISPLAY and rounds oddly:
console.log((1.005).toFixed(2)) // "1.00" not "1.01" (1.005 stored as 1.00499..)
console.log((0.615).toFixed(2)) // "0.61"`,
      explanation: [
        'Accumulating 0.1 ten times drifts away from 1 due to repeated rounding.',
        'Storing money as integer cents (or using a decimal library) keeps it exact.',
        'toFixed formats for display but rounds based on the imprecise stored value, surprising on .005 cases.',
        'For financial correctness, compute in integers or use a decimal/bignumber library, format only at the edge.',
      ],
    },
    realProject: {
      label: 'Real project — handling money and IDs in a Node API',
      lang: 'js',
      code: `// API returns amounts in minor units (cents) as integers
// and big IDs as strings to survive JSON -> JS number coercion
const order = {
  id: '900719925474099300',   // string, not number
  amountMinor: 1999,          // 19.99 in cents
}

function formatMoney(minor, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency,
  }).format(minor / 100)
}
formatMoney(order.amountMinor) // "$19.99"

// Never JSON.parse a 64-bit numeric ID directly into a JS number.`,
      explanation: [
        'Backends send money as integer minor units to avoid float drift.',
        'Large IDs are sent as strings because JSON numbers become imprecise JS doubles.',
        'Intl.NumberFormat handles locale-correct currency display from the integer cents.',
        'This pattern (minor units + string IDs) is standard in Stripe-style APIs and most production backends.',
        'The same applies in React/Vue clients consuming such APIs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Why is 0.1 + 0.2 not exactly 0.3 in JavaScript?',
      answer: 'Because numbers are stored as binary IEEE-754 doubles, and 0.1, 0.2, and 0.3 are repeating fractions in binary that cannot be represented exactly. Each is rounded to the nearest double, so the sum is 0.30000000000000004.',
      explanation: 'The key is "binary cannot represent these decimals exactly", not "JS is buggy".',
    },
    {
      level: 'beginner',
      question: 'How do you correctly compare two floating-point numbers?',
      answer: 'Compare the absolute difference against a small tolerance (epsilon): Math.abs(a - b) < Number.EPSILON (or a domain-appropriate tolerance), rather than using ===.',
      explanation: 'Mentioning Number.EPSILON and that the tolerance may need scaling for large magnitudes shows depth.',
    },
    {
      level: 'intermediate',
      question: 'What is Number.MAX_SAFE_INTEGER and why does it matter?',
      answer: 'It is 2^53 - 1 (9007199254740991), the largest integer that can be represented exactly. Beyond it the gap between representable doubles exceeds 1, so distinct integers collide — which corrupts large IDs and counters.',
      explanation: 'Connecting it to real ID corruption (databases, Twitter snowflake IDs) elevates the answer.',
    },
    {
      level: 'intermediate',
      question: 'How should you represent money in JavaScript?',
      answer: 'Use integer minor units (cents) or a dedicated decimal/bignumber library, never raw floats. Format for display with Intl.NumberFormat or toFixed only at the boundary.',
      explanation: 'Demonstrates practical awareness that float arithmetic is unacceptable for currency.',
    },
    {
      level: 'advanced',
      question: 'Explain the bit layout of a double and how a decimal is stored.',
      answer: 'A binary64 double has 1 sign bit, an 11-bit biased exponent (bias 1023), and a 52-bit mantissa with an implicit leading 1. value = (-1)^sign × 1.mantissa × 2^(exp-1023). A decimal like 0.1 becomes a repeating binary fraction truncated to 52 bits, hence the rounding error.',
      explanation: 'Reciting the layout and the value formula is a strong advanced/senior signal.',
    },
    {
      level: 'senior',
      question: 'How do special values (NaN, ±Infinity, +0/-0) arise and behave?',
      answer: 'An all-ones exponent with zero mantissa is ±Infinity; with nonzero mantissa it is NaN, which is unequal to itself (use Number.isNaN). The sign bit alone distinguishes +0 and -0, which === treats as equal but Object.is and 1/x (±Infinity) distinguish. These come from overflow, 0/0, and signed-zero operations.',
      explanation: 'Senior signal: the IEEE-754 special encodings plus their equality and detection nuances.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is Number.EPSILON and how do you scale tolerance for large numbers?',
    'When should you use BigInt instead of Number?',
    'Why does toFixed sometimes round "wrong" (e.g. 1.005)?',
    'How do +0 and -0 differ, and how do you detect -0?',
    'How would you implement currency arithmetic without floating-point errors?',
    'Why is parseInt/Number unsafe for 64-bit database IDs?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Comparing floats with === (e.g. if (a + b === 0.3)).',
      why: 'Rounding makes the stored value slightly off, so equality fails unpredictably.',
      fix: 'Use an epsilon tolerance: Math.abs(a - b) < EPSILON, scaled to the magnitude if needed.',
    },
    {
      mistake: 'Storing money as floating-point dollars.',
      why: 'Cent fractions accumulate rounding errors, producing incorrect totals.',
      fix: 'Use integer minor units (cents) or a decimal library; format only for display.',
    },
    {
      mistake: 'Treating large IDs from APIs/databases as JS numbers.',
      why: 'IDs above 2^53 - 1 lose precision and silently change value.',
      fix: 'Transport and store big IDs as strings (or BigInt), never as Number.',
    },
    {
      mistake: 'Trusting toFixed for exact rounding.',
      why: 'toFixed rounds the already-imprecise stored value, so .005 cases round unexpectedly.',
      fix: 'Round on integer/scaled values or use a decimal library; use toFixed for display only.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Backend', detail: 'Payment systems (Stripe-style) transmit and store money as integer minor units; financial services use arbitrary-precision decimal libraries to avoid float drift entirely.' },
    { area: 'Node.js', detail: 'APIs serialize 64-bit IDs (Snowflake/BigInt DB keys) as strings so JSON.parse does not corrupt them into imprecise doubles; BigInt is used for exact large-integer math.' },
    { area: 'React', detail: 'Cart/checkout UIs compute totals in cents and format with Intl.NumberFormat; comparing computed totals uses tolerances, not ===.' },
    { area: 'Vue', detail: 'Charting/analytics components clamp and round display values carefully; large metric IDs are kept as strings in state to avoid precision loss.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Double arithmetic is hardware-accelerated and extremely fast; engines fast-path small integers (Smi) for even better speed.',
      'Keeping numbers as plain doubles (monomorphic) lets the JIT optimize hot numeric loops aggressively.',
    ],
    bad: [
      'BigInt and decimal libraries are far slower than native doubles, so overusing them for non-large values wastes performance.',
      'Boxing numbers into HeapNumber objects (escaping Smi range) and polymorphic number/string variables hurt JIT optimization.',
    ],
    optimizations: [
      'Use integer cents (plain numbers) for money where values stay within safe range — fast and exact.',
      'Reserve BigInt/decimal libraries for genuinely large or precision-critical values only.',
      'Keep numeric variables consistently typed to stay on the Smi/double fast path.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'type-coercion', 'equality-comparison'],
    nextConcepts: ['bigint', 'typed-arrays', 'json-serialization', 'null-vs-undefined'],
    dependencyNote:
      'Floating point underlies all JS numbers and ties into equality comparison (why === fails on floats), type coercion (ToNumber), and BigInt/typed-arrays (for exact and binary numeric handling). It also affects JSON serialization of large IDs.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the 64-bit box split into 1 sign + 11 exponent + 52 mantissa bits.',
      'Write value = (-1)^S × 1.mantissa × 2^(exp-1023).',
      'Show 0.1 = 0.000110011..(repeats) → truncated → tiny error → 0.1+0.2 = 0.3000...04.',
      'Write the fix: compare with epsilon, Math.abs(a-b) < Number.EPSILON.',
      'Write 2^53 - 1 = MAX_SAFE_INTEGER; beyond it integers collide → big IDs as strings/BigInt.',
      'Say: "One binary double type; decimals approximate, integers exact only to 2^53; money in cents, big IDs as strings."',
    ],
    diagram: `   [ S | exp(11) | mantissa(52) ]   = binary64 double
   value = (-1)^S × 1.mantissa × 2^(exp-1023)

   0.1 → 0.0001100110011...  (repeats) → rounded
   0.1 + 0.2 = 0.30000000000000004   (=== 0.3 is FALSE)

   exact integers: up to 2^53−1 = 9007199254740991
   beyond → collide → use string / BigInt
   compare floats: |a−b| < Number.EPSILON`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript has one number type: a 64-bit IEEE-754 double (1 sign, 11 exponent, 52 mantissa bits). Because it is binary, decimals like 0.1 are stored approximately, so 0.1 + 0.2 ≠ 0.3 — compare floats with an epsilon, not ===. Integers are exact only up to Number.MAX_SAFE_INTEGER (2^53 - 1); beyond that they collide, so transport big IDs as strings or use BigInt. Handle money in integer cents (or a decimal library), and special values are NaN, ±Infinity, and signed zeros.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript has a single numeric type, and it is the 64-bit IEEE-754 double-precision float: one sign bit, eleven exponent bits, and a fifty-two-bit mantissa, giving roughly fifteen to seventeen significant decimal digits. The crucial consequence of being binary is that decimals whose denominators are not powers of two — like 0.1 — cannot be represented exactly. 0.1 is a repeating fraction in binary, so it is rounded to the nearest representable value, and that is exactly why 0.1 + 0.2 evaluates to 0.30000000000000004 and is not strictly equal to 0.3. The fix is to compare floats with a tolerance, like Math.abs(a - b) < Number.EPSILON, rather than ===. The second big issue is integers: they are exact only up to Number.MAX_SAFE_INTEGER, which is 2^53 - 1. Past that, the spacing between representable doubles exceeds one, so 2^53 and 2^53 + 1 are literally the same value — which silently corrupts large database or Snowflake IDs. The fix is to keep big IDs as strings or use BigInt. For money I never use floats; I work in integer minor units like cents, or use a decimal library, and only format at the display edge with Intl.NumberFormat, because even toFixed rounds the already-imprecise stored value. Finally, IEEE-754 defines NaN, plus and minus Infinity, and signed zeros, with NaN unequal to itself.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Native doubles are fast and ubiquitous but imprecise for decimals; decimal/BigInt types are exact but slower and more cumbersome — choose per domain (UI math vs financial ledger).',
      'Integer-cents money is simple and fast within safe range, but multi-currency/high-precision domains may justify a full decimal library.',
    ],
    edgeCases: [
      'NaN is unequal to itself; +0 === -0 is true but Object.is and 1/x distinguish them.',
      'toFixed and Math.round operate on the imprecise stored value, so .005 boundaries round counterintuitively.',
      'Number.MAX_SAFE_INTEGER is 2^53 - 1; arithmetic above it silently loses precision without error.',
      'Subnormals and overflow to Infinity occur at the extremes of the exponent range.',
    ],
    runtimeBehavior: [
      'Rounding uses round-half-to-even (banker\'s rounding) at the bit level, then results are re-rounded to the nearest double.',
      'Engines use tagged small integers (Smi) for speed and box to HeapNumber doubles when values escape that range.',
      'Bitwise operators coerce to 32-bit signed integers, a separate quirk from the 64-bit storage.',
    ],
    scalability: [
      'In financial systems at scale, a single representation decision (minor units vs decimal type) propagates through APIs, DBs, and clients — standardize early.',
      'Serialization boundaries (JSON) must agree on string IDs to avoid precision corruption across services.',
    ],
    productionConcerns: [
      'Float money bugs cause real monetary discrepancies and audit failures — among the costliest silent bugs.',
      'Large-ID precision loss across JSON is a classic integration bug between strongly-typed backends and JS clients.',
      'Inconsistent rounding (toFixed vs explicit rounding) yields off-by-a-cent reconciliation issues; centralize rounding policy.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'All JS numbers are 64-bit IEEE-754 doubles (1 sign, 11 exp, 52 mantissa).',
    '0.1 + 0.2 = 0.30000000000000004 — binary cannot store 0.1 exactly.',
    'Compare floats with epsilon: Math.abs(a-b) < Number.EPSILON.',
    'Number.MAX_SAFE_INTEGER = 2^53 - 1 = 9007199254740991.',
    'Above safe limit, integers collide → use String or BigInt.',
    'Money → integer cents or a decimal library, never raw floats.',
    'toFixed is for display and rounds the imprecise stored value.',
    'value = (-1)^S × 1.mantissa × 2^(exp-1023).',
    'Special values: NaN (!= itself), +Infinity, -Infinity, +0/-0.',
    'Number.isSafeInteger / Number.isFinite / Number.isNaN for checks.',
    'Bitwise ops coerce to 32-bit signed ints (separate quirk).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write nearlyEqual(a, b, eps) that returns true if two floats are within eps (default Number.EPSILON).',
      hint: 'Compare the absolute difference.',
      solution: {
        lang: 'js',
        code: `function nearlyEqual(a, b, eps = Number.EPSILON) {
  return Math.abs(a - b) < eps
}
nearlyEqual(0.1 + 0.2, 0.3) // true
nearlyEqual(1, 1.5)         // false`,
        explanation: [
          'Absolute difference under a small tolerance treats rounding noise as equal.',
          'Number.EPSILON is the gap near 1.0, a reasonable default.',
          'For large magnitudes you would scale eps relative to the values.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write addMoney(a, b) that adds two dollar amounts (e.g. 0.1 + 0.2) and returns an exact result.',
      hint: 'Convert to integer cents, add, then convert back.',
      solution: {
        lang: 'js',
        code: `function addMoney(a, b) {
  const cents = Math.round(a * 100) + Math.round(b * 100)
  return cents / 100
}
addMoney(0.1, 0.2) // 0.3  (exact)
addMoney(19.99, 0.01) // 20`,
        explanation: [
          'Multiplying by 100 and rounding converts dollars to integer cents.',
          'Integer addition is exact within the safe range.',
          'Dividing back by 100 yields the correct decimal for display.',
          'The Math.round absorbs the tiny float error from the *100 step.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write isProbablyCorruptedId(value) that returns true if a number value exceeds the safe-integer range (i.e. precision may already be lost).',
      hint: 'Number.isSafeInteger tells you directly.',
      solution: {
        lang: 'js',
        code: `function isProbablyCorruptedId(value) {
  return typeof value === 'number' && !Number.isSafeInteger(value)
}
isProbablyCorruptedId(9007199254740993) // true (already corrupted)
isProbablyCorruptedId(42)               // false
isProbablyCorruptedId('9007199254740993') // false (string is safe)`,
        explanation: [
          'Number.isSafeInteger is false for non-integers and integers beyond 2^53 - 1.',
          'A numeric ID outside the safe range has likely already lost precision.',
          'String IDs are unaffected, which is why APIs send big IDs as strings.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in comments why `(2 ** 53) === (2 ** 53 + 1)` is true and how BigInt fixes it.',
      hint: 'Think about the gap (ULP) between representable doubles at that magnitude.',
      solution: {
        lang: 'js',
        code: `// At 2^53 the gap between consecutive doubles becomes 2,
// so 2^53 + 1 cannot be represented and rounds back to 2^53.
console.log(2 ** 53 === 2 ** 53 + 1) // true  (both are 9007199254740992)

// BigInt has arbitrary precision -> no gap, no collision:
console.log(2n ** 53n === 2n ** 53n + 1n) // false
console.log(2n ** 53n + 1n)               // 9007199254740993n`,
        explanation: [
          'Beyond 2^53 the unit-in-the-last-place exceeds 1, so +1 has no distinct representation.',
          'The double rounds 2^53 + 1 back down to 2^53, making them compare equal.',
          'BigInt stores integers exactly with no fixed width, so consecutive integers stay distinct.',
          'This is precisely why large integer IDs must use BigInt or strings.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Floating point is where "it works on my machine" money and ID bugs are born. Understanding the binary representation lets you write correct financial and data code and confidently explain the most famous gotcha in programming.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask why 0.1 + 0.2 ≠ 0.3 and how to compare floats. Product companies (Zoho, Flipkart, Razorpay) — especially fintech like Razorpay — probe money handling, MAX_SAFE_INTEGER, and big-ID corruption. FAANG-level rounds dig into the bit layout, ULP/precision, rounding modes, and IEEE-754 special values.',
    whatInterviewersExpect:
      'They expect you to attribute the error to binary representation (not a JS bug), propose epsilon comparison, know Number.MAX_SAFE_INTEGER and the big-ID/money fixes, and ideally sketch the sign/exponent/mantissa layout and special values.',
  },
}

export default ieee754FloatingPoint
