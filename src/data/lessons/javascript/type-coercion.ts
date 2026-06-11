import type { ConceptLesson } from '../../../types/lesson'

const typeCoercion: ConceptLesson = {
  // 1. Concept Summary
  slug: 'type-coercion',
  name: 'Type Coercion',
  category: 'types-coercion',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'JavaScript constantly converts types behind your back, and those silent conversions produce the famously weird results (`[] + {}`, `"5" - 1`, `1 + "1"`) that interviewers love to test.',
    'Most "WAT" bugs and the entire reputation of JS being "quirky" come from misunderstanding implicit coercion — knowing the rules turns chaos into predictability.',
    'Form inputs, query strings, env vars, and JSON all arrive as strings, so you coerce to numbers/booleans every day; doing it wrong corrupts data.',
    'It is the engine behind truthy/falsy, == comparisons, and template literals — understanding it unlocks all three at once.',
    'Interviewers use coercion puzzles to separate developers who guess from those who can mentally run ToPrimitive / ToNumber / ToString step by step.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Coercion is a translator who silently rewrites your words so two people can talk.',
    story: [
      'Imagine a French speaker and an English speaker trying to talk, with a translator standing between them.',
      'Whenever one says something the other cannot understand, the translator quietly converts it into a language the other side accepts — without anyone asking.',
      'Sometimes the translation is perfect, but sometimes it changes the meaning a little in surprising ways.',
      'JavaScript has a translator like this built in. When you mix a number and a word, or ask if two different things are equal, JS quietly converts one into the other type so the operation can happen — and just like a hurried translator, it sometimes gives results that surprise you.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Type coercion is when JavaScript automatically changes a value from one type to another, like turning the text "5" into the number 5, so an operation can work.',
    'It happens implicitly (automatically, when you use + or ==) or explicitly (when you write Number(x) or String(x) yourself).',
    'The tricky part is that the + operator prefers strings (it glues things together) while operators like - and * prefer numbers.',
    'Because the rules differ per operator, the same-looking expression can give very different answers, which is why coercion has a reputation for being confusing.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Type coercion is the automatic or manual conversion of a value from one type to another. Implicit coercion is triggered by operators and contexts (+, ==, if), while explicit coercion is when you call Number(), String(), or Boolean() yourself.',
    how: 'The engine applies abstract operations — ToPrimitive, ToNumber, ToString, ToBoolean — depending on the operator. + with any string concatenates (converts to string); arithmetic operators convert to numbers; conditions convert to boolean.',
    why: 'Real-world data (form fields, JSON, URLs) is mostly strings, so you must convert deliberately. Knowing the implicit rules prevents the classic "1" + 1 === "11" surprises.',
    code: {
      label: 'Implicit vs explicit, and the + trap',
      lang: 'js',
      code: `// Implicit (engine decides):
console.log(1 + '1')   // "11"  (+ with a string concatenates)
console.log('5' - 1)   // 4     (- forces numbers)
console.log('5' * '2') // 10    (* forces numbers)
console.log(1 + true)  // 2     (true -> 1)

// Explicit (you decide — preferred):
console.log(Number('5'))   // 5
console.log(String(5))     // "5"
console.log(Boolean(''))   // false`,
      explanation: [
        '+ is special: if EITHER operand is a string, it concatenates, converting the other to a string.',
        '- * / % have no string mode, so they always convert operands to numbers.',
        'Booleans coerce to numbers as true→1, false→0.',
        'Explicit conversions (Number/String/Boolean) make your intent obvious and avoid surprises.',
        'Prefer explicit coercion in real code; understand implicit coercion for interviews and debugging.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Type coercion is the implicit or explicit conversion of a value to another primitive type, governed by abstract operations in the spec: ToPrimitive, ToNumber, ToString, ToBoolean, and ToBigInt. Implicit coercion is invoked by operators and language contexts — the + operator calls ToPrimitive with no hint and concatenates if either side is a string, while -, *, /, %, and unary + call ToNumber; relational and == comparisons apply their own coercion algorithms; if/while/?: call ToBoolean. ToPrimitive on objects invokes Symbol.toPrimitive, then valueOf/toString (order depending on the hint), which explains object-to-primitive surprises.',

  // 7. Internal Working
  internalWorking: [
    'When an operator receives operands, the engine first reduces any objects to primitives via ToPrimitive(value, hint), where hint is "number", "string", or "default" depending on the operator.',
    'ToPrimitive consults Symbol.toPrimitive if present; otherwise for hint "string" it tries toString() then valueOf(), and for "number"/"default" it tries valueOf() then toString().',
    'For the + operator, both operands are converted with hint "default"; then if EITHER resulting primitive is a string, both are coerced via ToString and concatenated; otherwise both go through ToNumber and are added.',
    'For -, *, /, %, **, and unary +, the engine applies ToNumber to each operand: strings are parsed (empty string → 0, non-numeric → NaN), true→1, false→0, null→0, undefined→NaN.',
    'For boolean contexts, ToBoolean maps the eight falsy values to false and everything else to true; the engine never throws here, it just classifies.',
    'For == (loose equality), a dedicated algorithm coerces across types (e.g. number vs string → string ToNumber; boolean → number; object → primitive), which is why == has many special cases that === avoids.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   OPERATOR decides the conversion
   ───────────────────────────────
        +  (with any string)
        │  ToPrimitive(default) -> if either is string:
        ▼          ToString both, then CONCATENATE
     "1" + 1  -> "11"

     -  *  /  %  unary+
        │  ToNumber both
        ▼
     "5" - 1  -> 4      "" * 1 -> 0      "x" - 1 -> NaN

     if / while / ?:        ==
        │ ToBoolean         │ cross-type coerce
        ▼                   ▼
     if ("") {}          1 == "1"  -> true

   OBJECT -> primitive:  Symbol.toPrimitive
                         -> valueOf() / toString()`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Coercion produces NEW primitive values; it never mutates the original operand (primitives are immutable).',
    'Converting an object to a primitive may allocate a short-lived string (via toString) on the heap, then discard it after the operation.',
    'Number("123") creates a new number value; the original string remains untouched in its own slot.',
    'Repeated string concatenation in a loop allocates many intermediate strings — a real GC/perf concern at scale.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the + operator vs other arithmetic',
      lang: 'js',
      code: `console.log(1 + '2')    // "12"  (concatenate)
console.log('3' - 1)    // 2     (subtract -> numbers)
console.log('6' / '2')  // 3
console.log(+'42')      // 42    (unary + -> ToNumber)
console.log('' + 42)    // "42"  (concatenate to string)`,
      explanation: [
        '+ concatenates when either operand is a string.',
        '- / and * have no string mode, so operands become numbers.',
        'Unary + is a concise ToNumber.',
        '"" + value is a quick (if cryptic) ToString.',
      ],
    },
    intermediate: {
      label: 'Intermediate — object-to-primitive via valueOf/toString',
      lang: 'js',
      code: `const money = {
  amount: 50,
  valueOf() { return this.amount },     // used for number hint
  toString() { return '$' + this.amount } // used for string hint
}

console.log(money + 10)        // 60   (+ default -> valueOf -> 50)
console.log(\`Total: \${money}\`) // "Total: $50" (string hint -> toString)
console.log(money * 2)         // 100  (number hint -> valueOf)`,
      explanation: [
        'ToPrimitive picks valueOf or toString based on the hint the operator gives.',
        'Arithmetic and + (default) prefer valueOf; template literals use the string hint → toString.',
        'This is exactly how Date objects coerce: + Date gives a number, string context gives text.',
        'Defining these methods lets your objects participate in coercion predictably.',
      ],
    },
    advanced: {
      label: 'Advanced — explaining the classic puzzles',
      lang: 'js',
      code: `console.log([] + [])   // ""     (both arrays -> "" + "" )
console.log([] + {})   // "[object Object]"
console.log([1,2] + [3]) // "1,23" (arrays toString join with comma)
console.log(1 + null)   // 1   (null -> 0)
console.log(1 + undefined) // NaN (undefined -> NaN)
console.log(true + true) // 2  (1 + 1)`,
      explanation: [
        'Arrays ToPrimitive via toString → comma-joined string; [] → "".',
        '{} ToString is "[object Object]", so [] + {} concatenates to that.',
        'null coerces to 0 under ToNumber, undefined coerces to NaN.',
        'Booleans coerce to 1/0; true + true is 2.',
        'Every "WAT" example is just these rules applied mechanically — not randomness.',
      ],
    },
    realProject: {
      label: 'Real project — coercing form/query input in a Node API',
      lang: 'js',
      code: `// Express: query params arrive as STRINGS
app.get('/items', (req, res) => {
  // BAD: '10' + 5 -> "105"; comparisons go wrong
  const page = req.query.page          // "2"

  // GOOD: explicit, validated coercion
  const pageNum = Number(req.query.page)
  const safePage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1

  const active = req.query.active === 'true' // never trust truthiness of "false"
  res.json({ page: safePage, active })
})`,
      explanation: [
        'HTTP query/form values are always strings, so arithmetic without conversion concatenates.',
        'Explicit Number() plus validation (Number.isInteger) avoids NaN and injection of bad values.',
        'Never coerce "false" with Boolean() — the non-empty string is truthy; compare to "true" instead.',
        'Vue/React forms hit the same issue: input.value is a string even on type="number".',
        'Deliberate coercion at the boundary keeps the rest of the app type-safe.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between implicit and explicit coercion?',
      answer: 'Implicit coercion is automatic conversion triggered by operators or contexts (e.g. 1 + "1", if(x)); explicit coercion is when you convert deliberately with Number(), String(), or Boolean().',
      explanation: 'Naming the trigger (operator/context vs explicit call) and giving one example of each shows clear understanding.',
    },
    {
      level: 'beginner',
      question: 'Why is `1 + "1"` "11" but `"5" - 1` is 4?',
      answer: 'The + operator concatenates if either operand is a string, so 1 becomes "1" → "11". The - operator has no string mode, so it coerces both to numbers → 5 - 1 = 4.',
      explanation: 'The key insight is that + is the only arithmetic operator with a string concatenation mode.',
    },
    {
      level: 'intermediate',
      question: 'How does an object get converted to a primitive?',
      answer: 'Via ToPrimitive: the engine checks Symbol.toPrimitive first; otherwise for a string hint it calls toString() then valueOf(), and for number/default hints it calls valueOf() then toString(). The operator supplies the hint.',
      explanation: 'Mentioning the hint and the valueOf/toString order, plus Symbol.toPrimitive, is the senior-leaning signal at the intermediate level.',
    },
    {
      level: 'intermediate',
      question: 'What does `Number(value)` return for "", "  ", "12px", null, undefined, and []?',
      answer: 'Number("") is 0, Number("  ") is 0 (whitespace trims to empty), Number("12px") is NaN, Number(null) is 0, Number(undefined) is NaN, and Number([]) is 0 (empty array → "" → 0).',
      explanation: 'Tests precise knowledge of ToNumber edge cases that cause real bugs in input parsing.',
    },
    {
      level: 'advanced',
      question: 'Explain step by step why `[] + {}` is "[object Object]".',
      answer: 'Both are objects, so + applies ToPrimitive(default): [].toString() is "" and {}.toString() is "[object Object]". Since one side is a string, + concatenates: "" + "[object Object]" → "[object Object]".',
      explanation: 'Walking the ToPrimitive → ToString → concatenate path mechanically proves you understand the algorithm, not just memorized the answer.',
    },
    {
      level: 'senior',
      question: 'How can implicit coercion cause production bugs, and how do you defend against it?',
      answer: 'String inputs silently concatenate in arithmetic, NaN propagates through calculations corrupting totals, and == cross-type coercion creates false matches. Defend by coercing explicitly and validating at boundaries, using === everywhere, and enabling strict typing (TypeScript) to surface mismatches at compile time.',
      explanation: 'Senior signal: connecting coercion to data integrity, NaN propagation, boundary validation, and type-system mitigation.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Number(x), parseInt(x), and +x?',
    'How does Symbol.toPrimitive let you control object coercion?',
    'Why does NaN spread through arithmetic, and how do you detect it?',
    'How does == coercion differ from the ToBoolean used in if-statements?',
    'Why does `[] == ![]` evaluate to true?',
    'How does coercion relate to template literal interpolation?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Doing arithmetic on values from forms/JSON/URLs without converting.',
      why: 'They are strings, so + concatenates and comparisons sort lexicographically.',
      fix: 'Coerce explicitly with Number() (and validate with Number.isFinite/isInteger) at the boundary.',
    },
    {
      mistake: 'Using Boolean("false") or relying on truthiness of a string flag.',
      why: 'Any non-empty string is truthy, so "false" is true.',
      fix: 'Compare explicitly: `value === "true"` for string flags.',
    },
    {
      mistake: 'Using parseInt without a radix or interchangeably with Number.',
      why: 'parseInt("08") historically varied, and parseInt parses prefixes ("12px" → 12) while Number returns NaN.',
      fix: 'Use Number() for full-string numeric values; use parseInt(str, 10) only when intentionally parsing a prefix.',
    },
    {
      mistake: 'Letting NaN flow through calculations unchecked.',
      why: 'Any arithmetic with NaN yields NaN, silently corrupting downstream results.',
      fix: 'Validate inputs and guard with Number.isNaN/Number.isFinite before computing.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Query strings, route params, env vars (process.env) are all strings; backends explicitly coerce and validate them (often with zod/joi) before use to avoid concatenation and NaN bugs.' },
    { area: 'Vue', detail: 'v-model on <input type="number"> still yields strings unless you use the .number modifier; computed properties often coerce explicitly to keep math correct.' },
    { area: 'React', detail: 'Controlled inputs deliver string values; handlers do Number(e.target.value) and guard NaN before storing in state.' },
    { area: 'Backend', detail: 'Serialization layers rely on ToString/JSON coercion; logging and template rendering coerce objects via toString, so custom toString/Symbol.toPrimitive shape output.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Primitive coercions (ToNumber/ToString on simple values) are extremely cheap, single-operation conversions.',
      'Explicit coercion lets the JIT keep variables monomorphic (always a number), enabling better optimization than mixed-type variables.',
    ],
    bad: [
      'Repeated string concatenation in loops allocates many intermediate strings, pressuring the GC.',
      'Polymorphic variables that flip between string and number defeat inline caches and slow hot paths.',
    ],
    optimizations: [
      'Coerce once at the boundary and keep variables a single type thereafter (helps the JIT and your sanity).',
      'Build large strings with array join or template parts rather than += in tight loops.',
      'Prefer Number()/parseInt over implicit unary tricks in hot code for clarity and predictable typing.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Coercing untrusted input loosely (e.g. == comparisons, Boolean on strings) can let crafted values bypass checks, such as "0e0" or array tricks matching unexpectedly.',
      'Treating string flags or numeric IDs without validation can enable type-confusion bugs and parameter tampering.',
    ],
    bestPractices: [
      'Always validate AND coerce untrusted input explicitly at trust boundaries; use a schema validator (zod/joi) rather than ad-hoc coercion.',
      'Use === and explicit Number()/parseInt with bounds checks; never authorize based on loosely-coerced values.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'primitive-vs-reference', 'truthy-falsy'],
    nextConcepts: ['equality-comparison', 'typeof-instanceof', 'template-literals', 'ieee-754-floating-point'],
    dependencyNote:
      'Type coercion underlies truthy/falsy (ToBoolean) and equality comparison (== coercion). It depends on understanding data types and primitives, and leads into == vs ===, typeof/instanceof, and template literals (which use ToString).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the rule: "+ with any string → concatenate (ToString); -, *, /, % → numbers (ToNumber)".',
      'Show 1 + "1" = "11" and "5" - 1 = 4 side by side to anchor the + special case.',
      'Draw the object path: object → ToPrimitive → Symbol.toPrimitive → valueOf/toString (order by hint).',
      'List ToNumber edge cases: "" → 0, "x" → NaN, null → 0, undefined → NaN, true → 1.',
      'Walk one puzzle, e.g. [] + {}: both objects → "" + "[object Object]".',
      'Say: "Implicit coercion is per-operator and deterministic — prefer explicit Number/String/Boolean in real code."',
    ],
    diagram: `   +  (string present) ──► ToString ──► concatenate
   - * / % unary+      ──► ToNumber  ──► arithmetic
   if/while/?:         ──► ToBoolean
   ==                  ──► cross-type coerce

   object ──ToPrimitive(hint)──► valueOf() / toString()

   ToNumber: ""->0  "x"->NaN  null->0  undefined->NaN  true->1`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Type coercion is JS converting values between types — implicitly via operators/contexts or explicitly via Number/String/Boolean. The + operator concatenates if either side is a string; -, *, /, % force numbers; conditions use ToBoolean; == cross-coerces. Objects become primitives via ToPrimitive (Symbol.toPrimitive, then valueOf/toString by hint). All the "WAT" puzzles are just these rules applied mechanically. In real code, coerce explicitly and validate at boundaries.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Type coercion is JavaScript automatically converting a value from one type to another. It comes in two flavors: implicit, triggered by operators and contexts, and explicit, when you call Number(), String(), or Boolean() yourself. The behavior is per-operator and fully deterministic. The plus operator is special: if either operand is a string it concatenates, converting the other side to a string, which is why 1 + "1" is "11". Every other arithmetic operator — minus, times, divide, modulo, and unary plus — has no string mode, so it converts operands to numbers; that is why "5" - 1 is 4. Conditions use ToBoolean, and loose equality has its own cross-type coercion algorithm. Objects are reduced to primitives by ToPrimitive, which checks Symbol.toPrimitive first, then valueOf and toString in an order chosen by the operator hint — that is exactly how Date or a money object coerces differently in arithmetic versus a template literal. All the infamous puzzles like [] + {} being "[object Object]" are just these rules applied step by step, not randomness. In production, the takeaway is to coerce explicitly and validate at boundaries, because form fields, query strings, JSON, and env vars all arrive as strings, and silent concatenation or NaN propagation corrupts data. I use === everywhere, Number() with validation for inputs, and TypeScript to catch mismatches at compile time.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Implicit coercion is terse and idiomatic for simple cases but obscures intent and invites edge-case bugs; explicit coercion is verbose but auditable.',
      'Defining valueOf/Symbol.toPrimitive makes objects ergonomic in expressions but can surprise readers who do not expect an object to behave like a number.',
    ],
    edgeCases: [
      'Number("") and Number("  ") are 0, but Number("12px") is NaN — whitespace trims, trailing junk does not.',
      '[] == ![] is true: ![] is false → 0, [] → "" → 0, so 0 == 0.',
      'null == undefined is true but null == 0 is false — == has special-cased rules that defy ToNumber intuition.',
      'Date is the rare built-in whose default ToPrimitive hint is "string" (via toString), unlike most objects.',
    ],
    runtimeBehavior: [
      'ToPrimitive ordering depends on hint: "number"/"default" → valueOf then toString; "string" → toString then valueOf.',
      'NaN is contagious: any arithmetic involving it yields NaN, and NaN !== NaN, requiring Number.isNaN to detect.',
      'Mixed-type variables make the value polymorphic, degrading JIT inline caches relative to monomorphic numeric variables.',
    ],
    scalability: [
      'Centralizing coercion in validated boundary layers (DTO/schema parsing) keeps the type chaos out of the core domain in large systems.',
      'String-building hot paths should use buffers/joins; naive concatenation coercion in loops becomes a GC bottleneck at scale.',
    ],
    productionConcerns: [
      'Silent NaN from bad input can propagate into stored aggregates (totals, metrics) before anyone notices — guard and alert on NaN.',
      'Loose == coercion in auth/permission checks is a security risk via crafted values; mandate === and schema validation.',
      'Custom valueOf/toString affect logging, serialization, and template output — review them when objects render unexpectedly.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Coercion = converting between types; implicit (operators) or explicit (Number/String/Boolean).',
    '+ with any string → concatenate (ToString); else add.',
    '- * / % ** unary+ → ToNumber on both operands.',
    'if/while/?: → ToBoolean; == → cross-type coercion.',
    'Object → primitive via ToPrimitive: Symbol.toPrimitive, then valueOf/toString (order by hint).',
    'ToNumber: "" → 0, "  " → 0, "12px" → NaN, null → 0, undefined → NaN, true → 1.',
    '[] → "" , {} → "[object Object]" under ToString.',
    'NaN is contagious and NaN !== NaN → use Number.isNaN.',
    'Boolean("false") is true (non-empty string) — compare === "true" for flags.',
    'Prefer explicit coercion + validation at boundaries; use === in real code.',
    'parseInt parses prefixes ("12px"→12); Number needs the whole string numeric.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Predict the output: `console.log(2 + "2", "6" / 2, 1 + true, "" + null)`.',
      hint: 'Apply the per-operator rule: + concatenates with a string; / forces numbers.',
      solution: {
        lang: 'js',
        code: `console.log(
  2 + '2',  // "22"  (+ with string -> concatenate)
  '6' / 2,  // 3     (/ -> ToNumber both)
  1 + true, // 2     (true -> 1)
  '' + null // "null" (+ with string -> String(null))
)`,
        explanation: [
          '2 + "2" concatenates because a string is present.',
          '"6" / 2 coerces "6" to 6, giving 3.',
          'true becomes 1 under ToNumber.',
          'String(null) is "null", so "" + null is "null".',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write toNumberSafe(v) that returns a finite number or null (never NaN) for any input.',
      hint: 'Coerce with Number, then check Number.isFinite.',
      solution: {
        lang: 'js',
        code: `function toNumberSafe(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
toNumberSafe('42')   // 42
toNumberSafe('12px') // null
toNumberSafe('')     // 0
toNumberSafe(null)   // 0
toNumberSafe(undefined) // null`,
        explanation: [
          'Number() performs ToNumber on any value.',
          'Number.isFinite rejects NaN and Infinity without coercing again.',
          'Returning null instead of NaN stops NaN from propagating into calculations.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Create an object Temperature(c) that yields its Celsius number in arithmetic but a formatted string in template literals.',
      hint: 'Implement Symbol.toPrimitive and branch on the hint.',
      solution: {
        lang: 'js',
        code: `function Temperature(c) {
  return {
    [Symbol.toPrimitive](hint) {
      if (hint === 'string') return c + '°C'
      return c  // number / default -> raw value
    }
  }
}
const t = Temperature(20)
console.log(t + 5)        // 25
console.log(\`Now: \${t}\`)  // "Now: 20°C"`,
        explanation: [
          'Symbol.toPrimitive fully controls object coercion and receives the hint.',
          'Arithmetic and + use the number/default branch → raw Celsius.',
          'Template literals use the string hint → formatted output.',
          'This is the clean, modern way to make an object coerce predictably.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain, step by step in comments, why `[] == ![]` is true.',
      hint: 'Evaluate ![] first, then apply the == algorithm.',
      solution: {
        lang: 'js',
        code: `const result = [] == ![]
// Step 1: ![] -> [] is truthy (object) -> ! makes it false
//         so expression becomes  [] == false
// Step 2: == with boolean -> ToNumber(false) = 0  ->  [] == 0
// Step 3: object vs number -> ToPrimitive([]) -> "" -> ToNumber("") = 0
//         so  0 == 0
// Step 4: 0 == 0 -> true
console.log(result) // true`,
        explanation: [
          'The unary ! coerces [] via ToBoolean (object → true) then negates to false.',
          'Loose equality converts the boolean to a number: false → 0.',
          'The array is converted to a primitive "" then to the number 0.',
          'Finally 0 == 0 is true — a mechanical, not magical, result.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Coercion is the root of JavaScript\'s "weird" reputation. Once you can mentally run ToPrimitive/ToNumber/ToString, every puzzle becomes trivial and you stop shipping the concatenation and NaN bugs that plague form and API code.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask why 1 + "1" differs from "5" - 1 and to predict simple outputs. Product companies (Zoho, Flipkart, Razorpay) hand you puzzle expressions and ask you to walk the steps. FAANG-level rounds probe ToPrimitive hints, Symbol.toPrimitive, and how coercion threatens data integrity and security.',
    whatInterviewersExpect:
      'They expect you to state the per-operator rules, explain object-to-primitive via valueOf/toString with hints, mechanically derive a puzzle\'s answer, and advocate explicit coercion plus === and boundary validation in production code.',
  },
}

export default typeCoercion
