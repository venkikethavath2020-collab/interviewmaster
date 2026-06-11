import type { ConceptLesson } from '../../../types/lesson'

const truthyFalsy: ConceptLesson = {
  // 1. Concept Summary
  slug: 'truthy-falsy',
  name: 'Truthy & Falsy',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Every `if`, `while`, `&&`, `||`, and ternary in JavaScript silently coerces its condition to a boolean — so you are using truthy/falsy whether you know it or not.',
    'The single most common JS bug class is treating 0 or "" as "missing" because they are falsy, when they are actually valid values.',
    'Knowing the exact list of 8 falsy values lets you write correct guards instead of accidentally filtering out legitimate data.',
    'It is the foundation under short-circuit evaluation, default values, and conditional rendering in Vue/React.',
    'Interviewers ask it to check whether you understand implicit coercion, the difference between || and ??, and edge cases like empty arrays being truthy.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Truthy/falsy is a yes/no gate that turns every answer into just "go" or "stop".',
    story: [
      'Imagine a doorman at a gate who only understands two words: "go" and "stop".',
      'People walk up holding all sorts of things — a number, a word, an empty box, nothing at all.',
      'The doorman has a short secret list of things that mean "stop": empty-handed, the number zero, an empty word, and a few others. Everything else means "go".',
      'In JavaScript, every `if` is that doorman: it looks at your value, checks its tiny "stop" list, and decides go or stop. The "stop" things are called falsy, and everything else is truthy.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'When JavaScript needs a true/false answer (like in an if-statement), it converts whatever value you gave it into either true or false.',
    'Most values become true — these are called truthy. Only a small, fixed set of values become false — these are called falsy.',
    'The falsy values are: false, 0, "" (empty string), null, undefined, NaN, and -0 and 0n. Memorizing this short list is the whole trick.',
    'So an empty array [] or empty object {} is actually truthy, which surprises a lot of beginners.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A value is "truthy" if it coerces to true in a boolean context, and "falsy" if it coerces to false. There are exactly 8 falsy values; everything else in the language is truthy.',
    how: 'In any boolean context (if/while conditions, ternaries, logical operators), the engine applies the ToBoolean abstract operation to your value, mapping the 8 falsy values to false and all others to true.',
    why: 'It powers concise conditionals and default-value patterns, but you must know the falsy list to avoid treating valid 0 or "" as "empty".',
    code: {
      label: 'The 8 falsy values; everything else is truthy',
      lang: 'js',
      code: `// All 8 falsy values:
if (!false) {}        // false
if (!0) {}            // 0
if (!-0) {}           // -0
if (!0n) {}           // 0n (BigInt zero)
if (!'') {}           // "" empty string
if (!null) {}         // null
if (!undefined) {}    // undefined
if (!NaN) {}          // NaN

// Surprisingly TRUTHY:
if ([]) console.log('empty array is truthy')
if ({}) console.log('empty object is truthy')
if ('0') console.log('string "0" is truthy')`,
      explanation: [
        'These eight values are the complete falsy set — memorize them.',
        '!value gives true exactly when value is falsy.',
        'Empty array and empty object are objects (references), so they are truthy.',
        'The string "0" is a non-empty string, so it is truthy even though it looks like zero.',
        'Knowing this prevents the classic "treated 0 as empty" bug.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Truthiness is the result of the ToBoolean abstract operation applied implicitly in boolean contexts. ToBoolean maps a fixed set of eight values — false, +0, -0, 0n, NaN, the empty string, null, and undefined — to false, and every other value, including all objects (even empty arrays/objects) and all non-empty strings/non-zero numbers, to true. This coercion drives if/while conditions, the conditional operator, and the logical operators, where && and || short-circuit by returning one of their operands (not necessarily a boolean) based on the truthiness of the left side.',

  // 7. Internal Working
  internalWorking: [
    'When the engine evaluates a boolean context (e.g. the test of an `if`), it invokes the internal ToBoolean(value) operation on the result of the expression.',
    'ToBoolean checks the value type: Undefined and Null → false; Boolean → the value itself; Number → false if +0, -0, or NaN, else true; BigInt → false if 0n, else true; String → false if length 0, else true.',
    'For any value of type Object (including arrays, functions, wrapper objects like new Boolean(false)), ToBoolean returns true unconditionally — references are always truthy.',
    'Logical AND (&&) evaluates its left operand; if that is falsy it returns the left operand without evaluating the right; otherwise it returns the right operand. Logical OR (||) returns the left if truthy, else the right.',
    'Because of this, && and || return one of the original operands, not a coerced boolean — only the negation operator ! and Boolean() force an actual boolean.',
    'The nullish coalescing operator ?? differs: it branches on null/undefined specifically via an internal nullish check, NOT on general truthiness, so it keeps falsy-but-valid values like 0 and "".',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `              ANY VALUE
                  │
            ToBoolean()
                  │
      ┌───────────┴────────────┐
      ▼                        ▼
   FALSY (the 8)            TRUTHY (everything else)
   ─────────────           ─────────────────────────
   false                   true, 1, -1, 3.14
   0   -0                  "0", "false", " "
   0n                      []  {}  function(){}
   ""                      Infinity, new Date()
   null                    new Boolean(false) (!)
   undefined
   NaN
      │                        │
      ▼                        ▼
   if → STOP                if → GO`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — guarding with truthiness',
      lang: 'js',
      code: `function greet(name) {
  if (name) {
    return 'Hello, ' + name
  }
  return 'Hello, stranger'
}
greet('Sam')      // "Hello, Sam"
greet('')         // "Hello, stranger"  ("" is falsy)
greet(undefined)  // "Hello, stranger"`,
      explanation: [
        '`if (name)` coerces name to a boolean.',
        'A non-empty string is truthy → personalized greeting.',
        'An empty string is falsy → falls through to the default.',
        'Passing nothing makes name undefined, also falsy.',
      ],
    },
    intermediate: {
      label: 'Intermediate — the 0 / "" trap with ||',
      lang: 'js',
      code: `function setQuantity(qty) {
  // BUG: 0 is falsy, so a real 0 becomes 1
  const value = qty || 1
  return value
}
setQuantity(5)  // 5
setQuantity(0)  // 1  <-- WRONG, user wanted 0

// FIX: use ?? which only replaces null/undefined
function setQuantityFixed(qty) {
  return qty ?? 1
}
setQuantityFixed(0)  // 0  correct`,
      explanation: [
        '|| returns the right side whenever the left is FALSY, including 0.',
        'So a legitimate 0 quantity is wrongly replaced with 1.',
        '?? only falls back for null/undefined, preserving 0 and "".',
        'This is the most common real bug stemming from truthiness — choose ?? for numeric/string defaults.',
      ],
    },
    advanced: {
      label: 'Advanced — short-circuit returns the operand, not a boolean',
      lang: 'js',
      code: `const config = null
const port = config && config.port  // null (short-circuits, no crash)

const name = '' || 'anonymous'      // "anonymous"
const cached = userCache.get(id) || fetchUser(id)

// && / || return an OPERAND, not true/false:
console.log('a' && 'b')   // "b"
console.log(0 && 'b')     // 0
console.log('' || 'x')    // "x"
console.log(Boolean('' || 'x')) // true (force a boolean)`,
      explanation: [
        '&& returns its left operand if falsy, otherwise the right — handy for safe property access.',
        '|| returns the left if truthy, otherwise the right — the classic default pattern.',
        'Neither returns a real boolean unless you wrap it in Boolean() or !!.',
        'This operand-returning behavior is why `cond && <Component/>` works for conditional rendering.',
      ],
    },
    realProject: {
      label: 'Real project — conditional rendering in Vue/React',
      lang: 'js',
      code: `// React: render only when there ARE items
function List({ items }) {
  return (
    <div>
      {items.length && <Badge count={items.length} />}
      {/* BUG: items.length === 0 renders the number 0! */}
      {items.length > 0 && <Badge count={items.length} />}
      {/* FIX: force a boolean */}
    </div>
  )
}

// Vue equivalent
// <Badge v-if="items.length" :count="items.length" />`,
      explanation: [
        'In JSX, `cond && <X/>` renders X when cond is truthy.',
        'A falsy 0 from items.length is NOT rendered as nothing — React renders the literal 0!',
        'Fix by making the condition a real boolean: items.length > 0.',
        'Vue v-if coerces with truthiness too, but does not render the number, so the trap is React-specific.',
        'A daily, real-world consequence of truthiness rules.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'List all the falsy values in JavaScript.',
      answer: 'false, 0, -0, 0n (BigInt zero), "" (empty string), null, undefined, and NaN. Everything else is truthy.',
      explanation: 'Reciting the complete list of eight, including the BigInt 0n and -0, signals precision.',
    },
    {
      level: 'beginner',
      question: 'Is an empty array `[]` truthy or falsy? What about an empty object `{}`?',
      answer: 'Both are truthy. Any object reference — including empty arrays and objects — is truthy; only the eight primitive falsy values are falsy.',
      explanation: 'A frequent surprise. To check emptiness you must test `arr.length` or `Object.keys(obj).length`.',
    },
    {
      level: 'beginner',
      question: 'What does `!!value` do?',
      answer: 'It coerces value to its boolean truthiness: the first ! negates (and coerces), the second ! flips it back, yielding the real boolean equivalent.',
      explanation: 'Shows you understand the difference between a truthy value and an actual boolean.',
    },
    {
      level: 'intermediate',
      question: 'Why can `value || default` be a bug, and what fixes it?',
      answer: 'Because || falls back for ALL falsy values, so valid 0, "", or false get replaced. The nullish coalescing operator ?? fixes it by falling back only for null and undefined.',
      explanation: 'This is the headline practical consequence; mentioning ?? and which values it preserves is the key signal.',
    },
    {
      level: 'intermediate',
      question: 'What do `&&` and `||` actually return?',
      answer: 'They return one of their operands, not necessarily a boolean. && returns the left if it is falsy, else the right; || returns the left if truthy, else the right.',
      explanation: 'Understanding operand-returning short-circuit (vs returning true/false) is what enables guard and default patterns.',
    },
    {
      level: 'senior',
      question: 'Why is `new Boolean(false)` truthy even though it wraps false?',
      answer: 'Because it is an Object, and ToBoolean returns true for every object regardless of contents. The wrapped primitive false is irrelevant to truthiness.',
      explanation: 'Senior-level: shows you know ToBoolean keys off the type (Object → true), and why wrapper objects are an anti-pattern.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between || and ?? for defaults?',
    'How does truthiness make `cond && <Component/>` work in JSX, and what is the 0 trap?',
    'How do you idiomatically convert any value to a real boolean?',
    'Is NaN truthy or falsy, and how do you reliably detect NaN?',
    'Why is the string "0" truthy but the number 0 falsy?',
    'How does Array.prototype.filter(Boolean) work to remove falsy items?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using `if (value)` to check "has a value" when 0 or "" are valid.',
      why: '0 and "" are falsy, so legitimate values get treated as missing.',
      fix: 'Check explicitly: `value != null`, `value !== undefined`, or compare against the specific value you mean.',
    },
    {
      mistake: 'Using `value || default` for numeric or string defaults.',
      why: '|| replaces every falsy value, clobbering valid 0 and "".',
      fix: 'Use `value ?? default`, which only falls back for null/undefined.',
    },
    {
      mistake: 'Assuming an empty array/object is falsy.',
      why: 'All objects are truthy; emptiness has nothing to do with truthiness.',
      fix: 'Test `arr.length === 0` or `Object.keys(obj).length === 0` for emptiness.',
    },
    {
      mistake: 'Rendering `{count && <X/>}` in JSX where count can be 0.',
      why: 'React renders the literal 0 instead of nothing.',
      fix: 'Use a real boolean condition: `{count > 0 && <X/>}` or `{!!count && <X/>}`.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Conditional rendering with `cond && <X/>` and defaults with `value ?? fallback` are everywhere; the 0-render trap is a well-known footgun that truthiness explains.' },
    { area: 'Vue', detail: 'v-if and v-show coerce their expression to a boolean via truthiness; computed guards often use `!!value` or `value != null` to avoid the 0/"" pitfalls.' },
    { area: 'Node.js', detail: 'Config and environment defaults frequently use `process.env.PORT || 3000`, which is safe for strings but you must switch to ?? when 0 is a legal value.' },
    { area: 'Backend', detail: 'Validation layers normalize falsy-but-valid inputs (0 amounts, empty strings) explicitly so they are not silently dropped by truthiness-based guards.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'ToBoolean coercion is a trivial, constant-time check the engine performs extremely cheaply.',
      'Short-circuit evaluation avoids running expensive right-hand expressions when the left already decides the outcome.',
    ],
    bad: [
      'Relying on truthiness incorrectly causes logic bugs (dropped 0/"") that are far costlier than any micro-perf concern.',
      'Wrapping primitives in objects (new Boolean/new Number) to "fix" truthiness allocates heap objects and is an anti-pattern.',
    ],
    optimizations: [
      'Put the cheaper or more likely-decisive condition first in && / || chains to short-circuit sooner.',
      'Prefer explicit comparisons (`x > 0`, `x != null`) over truthiness when the falsy edge cases matter — clearer and bug-free.',
      'Use `arr.filter(Boolean)` to compactly strip falsy entries in one pass.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'null-vs-undefined'],
    nextConcepts: ['type-coercion', 'equality-comparison', 'optional-chaining-nullish', 'typeof-instanceof'],
    dependencyNote:
      'Truthy/falsy is a specific case of type coercion (ToBoolean). It depends on knowing data types and null vs undefined, and it leads directly into general coercion rules, equality comparison, and the nullish coalescing operator.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write the header "FALSY (only 8)" and list: false, 0, -0, 0n, "", null, undefined, NaN.',
      'Write "TRUTHY = everything else" and give examples: [], {}, "0", " ", function(){}, Infinity.',
      'Draw an if-box that funnels any value through ToBoolean into STOP (falsy) or GO (truthy).',
      'Add the gotcha: `value || default` falls back on ALL falsy; `value ?? default` only on null/undefined.',
      'Note that && / || return an OPERAND, not a boolean; use !! to force a real boolean.',
      'Say: "Memorize the 8 falsy values and the 0/empty-string trap and you have mastered conditionals."',
    ],
    diagram: `  FALSY (the only 8)        TRUTHY (everything else)
  ──────────────────        ────────────────────────
  false   0   -0   0n        []   {}   "0"   " "
  ""  null  undefined  NaN   1  -1  Infinity  fn(){}

  value || d  -> falls back on ANY falsy (0, "" too!)
  value ?? d  -> falls back ONLY on null/undefined
  !!value     -> real boolean`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'In any boolean context, JavaScript coerces values via ToBoolean. There are exactly 8 falsy values — false, 0, -0, 0n, "", null, undefined, NaN — and everything else is truthy, including empty arrays/objects and the string "0". && and || short-circuit and return an operand (use !! for a real boolean). The big trap: `value || default` replaces valid 0 and "", so use `value ?? default` for numeric/string defaults.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Truthiness is what happens when JavaScript needs a boolean but you give it some other value — in an if, a while, a ternary, or a logical operator. The engine runs the ToBoolean operation. There are exactly eight falsy values: false, the number 0, negative 0, the BigInt 0n, the empty string, null, undefined, and NaN. Everything else is truthy — and critically that includes empty arrays, empty objects, and the string "0", because every object reference is truthy and any non-empty string is truthy. The most important practical consequence is the default-value trap. People write `value || default`, but || falls back on any falsy value, so a legitimate 0 or empty string gets clobbered. The fix is the nullish coalescing operator, `value ?? default`, which only falls back for null and undefined. Another subtlety is that && and || do not return true or false — they return one of the original operands by short-circuiting, which is exactly why `cond && <Component/>` works for conditional rendering, though in React a falsy 0 will render the literal 0, so you guard with `count > 0`. If you actually want a boolean you write !!value. Master the eight falsy values and the 0/empty-string trap and conditionals stop surprising you.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Truthiness-based guards are terse and readable, but they conflate "absent" with "falsy-but-valid"; explicit comparisons are more verbose yet correct for 0/"" edge cases.',
      '|| is convenient for string/config defaults but unsafe for numeric defaults; ?? is safer but newer and changes short-circuit semantics — pick deliberately per field.',
    ],
    edgeCases: [
      'Wrapper objects: new Boolean(false), new Number(0), new String("") are all truthy because they are objects.',
      'document.all is a bizarre historical exception that is falsy despite being an object (legacy quirk).',
      'NaN is falsy but NaN !== NaN, so detect it with Number.isNaN, never with equality.',
      'In JSX, falsy 0 renders as "0" while false/null/undefined render nothing — an asymmetry that bites real apps.',
    ],
    runtimeBehavior: [
      'ToBoolean keys off the value TYPE, not its contents — Object → true unconditionally.',
      '&& and || return operands, enabling guard and default idioms; only !, !!, and Boolean() yield primitive booleans.',
      '?? uses an internal nullish (null/undefined) check, distinct from ToBoolean, and cannot be mixed with && / || without parentheses (a syntax error otherwise).',
    ],
    scalability: [
      'In large codebases, a lint rule banning bare `x || default` for known-numeric fields prevents a recurring data-loss bug at scale.',
      'Normalizing inputs to explicit null at boundaries lets internal code rely on ?? consistently, reducing per-call-site reasoning.',
    ],
    productionConcerns: [
      'Silent dropping of 0/"" via || is a subtle data-integrity bug that passes tests with non-zero fixtures and surfaces only with edge-case data.',
      'The JSX 0-render bug ships visible UI artifacts; code review and lint rules (react/jsx-no-leaked-render) catch it.',
      'Mixing ?? with || / && without parentheses is a parse error — tooling and formatters surface it early.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Falsy (only 8): false, 0, -0, 0n, "", null, undefined, NaN.',
    'Everything else is truthy — including [], {}, "0", " ", and functions.',
    'ToBoolean keys off TYPE: any object → true always.',
    '&& returns left if falsy else right; || returns left if truthy else right.',
    'Logical operators return an OPERAND, not a boolean.',
    '!!value or Boolean(value) → real boolean.',
    'value || default replaces ALL falsy (0, "" too) — often a bug.',
    'value ?? default replaces ONLY null/undefined — safe for numbers/strings.',
    'Empty array/object are truthy; test .length / Object.keys().length for emptiness.',
    'NaN is falsy but NaN !== NaN — use Number.isNaN.',
    'JSX: {0 && <X/>} renders "0"; use {count > 0 && <X/>}.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write toBool(v) that returns the real boolean truthiness of any value.',
      hint: 'Two characters do it.',
      solution: {
        lang: 'js',
        code: `function toBool(v) {
  return !!v
}
toBool(0)    // false
toBool('hi') // true
toBool([])   // true
toBool('')   // false`,
        explanation: [
          '!! coerces via ToBoolean then negates twice, giving a true boolean.',
          'Equivalent to Boolean(v).',
          'Note [] is true because it is an object.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write compact(arr) that removes all falsy values from an array in one line.',
      hint: 'Pass the Boolean constructor to filter.',
      solution: {
        lang: 'js',
        code: `function compact(arr) {
  return arr.filter(Boolean)
}
compact([0, 1, '', 'a', null, 2, undefined, NaN, false])
// [1, 'a', 2]`,
        explanation: [
          'filter(Boolean) calls Boolean(item) as the predicate.',
          'Items that are falsy (0, "", null, undefined, NaN, false) are removed.',
          'Truthy items survive, including [] or {} if present.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Fix this so a quantity of 0 is preserved but missing input still defaults to 1: `function norm(q){ return q || 1 }`',
      hint: 'Distinguish "missing" from "falsy-but-valid".',
      solution: {
        lang: 'js',
        code: `function norm(q) {
  return q ?? 1   // only null/undefined fall back
}
norm(5)         // 5
norm(0)         // 0  (preserved!)
norm(undefined) // 1
norm(null)      // 1`,
        explanation: [
          '|| wrongly replaces 0 because 0 is falsy.',
          '?? only triggers for null and undefined.',
          'So a legitimate 0 is kept while truly-missing values default to 1.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Without running it, write the output of: `console.log([] == false, [0], !![], {} || "x", "" ?? "y")` and explain each.',
      hint: 'Separate truthiness (ToBoolean) from loose equality (==), they are different operations.',
      solution: {
        lang: 'js',
        code: `console.log(
  [] == false,  // true  (== coerces both sides to numbers: 0 == 0)
  Boolean([0]), // true  (array is an object -> truthy)
  !![],         // true  (empty array is truthy)
  {} || 'x',    // {}    ({} is truthy, so || returns it)
  '' ?? 'y'     // ''    ("" is NOT nullish, so ?? keeps it)
)`,
        explanation: [
          '[] == false is true via loose-equality coercion to numbers, NOT via truthiness — a key distinction.',
          'Any array/object is truthy, so Boolean([0]) and !![] are true.',
          '{} is truthy, so || short-circuits and returns the object itself.',
          '?? checks nullishness, and "" is not nullish, so it is preserved.',
          'The trap: == and ToBoolean are separate mechanisms with different rules.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Every conditional you write leans on truthiness. Mastering the 8 falsy values and the 0/empty-string trap eliminates a whole category of subtle bugs and lets you read any `&&`/`||`/`??` expression at a glance.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to list the falsy values and say whether [] is truthy. Product companies (Zoho, Flipkart, Razorpay) probe the || vs ?? default bug and what && / || return. FAANG-level rounds explore wrapper-object quirks, the JSX 0-render bug, and how truthiness differs from == coercion.',
    whatInterviewersExpect:
      'They expect the precise list of eight falsy values, awareness that all objects (including empty ones) are truthy, the || vs ?? distinction with concrete examples, and that logical operators return operands rather than booleans.',
  },
}

export default truthyFalsy
