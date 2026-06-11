import type { ConceptLesson } from '../../../types/lesson'

const destructuring: ConceptLesson = {
  // 1. Concept Summary
  slug: 'destructuring',
  name: 'Destructuring',
  category: 'objects-prototypes',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Destructuring is the most common syntax you will read and write daily — pulling props, state, and API fields out of objects and arrays cleanly.',
    'It removes repetitive `const x = obj.x` boilerplate, makes function signatures self-documenting, and enables defaults and renaming in one line.',
    'Frameworks lean on it heavily: React props/hooks (`const [count, setCount] = useState`), Vue composables, and Node module imports all destructure.',
    'Getting it wrong causes real bugs — destructuring `undefined`, default values that do not fire, or accidentally sharing nested references.',
    'Interviewers use it to check ES6 fluency and whether you understand defaults, swapping, nested patterns, and the rest/spread relationship.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Destructuring is unpacking a labeled gift box and taking out exactly the toys you want by their names.',
    story: [
      'Imagine a gift box with compartments labeled "car", "robot", and "ball".',
      'Instead of reaching in over and over saying "give me the box\'s car, give me the box\'s robot", you lay out three little dishes labeled the same and tip the box so each toy lands in its matching dish.',
      'Now you have car, robot, and ball sitting right in front of you, ready to use, without keeping the whole box on the table.',
      'Destructuring does exactly that for objects and lists in code: it unpacks the pieces you care about into their own named variables in one quick move.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Objects hold values under keys, and arrays hold values in order. Destructuring is a short way to copy those values into separate variables.',
    'For objects you match by key name: `const { age } = person` takes person.age into a variable called age.',
    'For arrays you match by position: `const [first, second] = list` takes the first two items in order.',
    'You can also give a default value (used if the piece is missing) and rename a key, all in the same line — which is why it makes code shorter and clearer.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Destructuring is syntax that unpacks values from arrays (by position) or objects (by key) into distinct variables, with support for defaults, renaming, nesting, and rest patterns.',
    how: 'On the left of `=` you write a pattern shaped like the data: `{}` for objects (keys), `[]` for arrays (positions). The engine reads the right side and assigns matching pieces to the named variables.',
    why: 'It replaces repetitive property access, makes function parameters readable, lets you set defaults inline, and is the idiomatic way to consume props/state in modern JS.',
    code: {
      label: 'Object and array destructuring with defaults',
      lang: 'js',
      code: `const user = { name: 'Sam', role: 'admin' }
const { name, role, active = true } = user
// name='Sam', role='admin', active=true (default used)

const scores = [90, 80]
const [math, science, art = 0] = scores
// math=90, science=80, art=0 (default used)`,
      explanation: [
        '`{ name, role }` matches by key, copying user.name and user.role into variables.',
        '`active = true` supplies a default because `user` has no `active` key.',
        '`[math, science]` matches by position from the array.',
        '`art = 0` defaults because there is no third element.',
        'Defaults fire ONLY when the value is `undefined`, not for null or other falsy values.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Destructuring assignment is a syntactic feature that binds variables to values extracted from iterables (array/iterable destructuring, position-based via the iterator protocol) or from object properties (object destructuring, key-based). It supports default values that apply only when the resolved value is undefined, property renaming via `key: alias`, arbitrary nesting, computed keys, and a rest element (`...rest`) that collects remaining array elements or own enumerable object properties. It is purely an assignment pattern — it does not mutate the source — and is widely used in parameter lists, where the parameter itself can be a destructuring pattern with its own defaults.',

  // 7. Internal Working
  internalWorking: [
    'For array/iterable destructuring, the engine obtains an iterator from the source (Symbol.iterator) and pulls values one at a time in order, assigning each to the corresponding target.',
    'A rest element `...rest` continues pulling from the iterator until it is exhausted, collecting the remaining values into a new array.',
    'For object destructuring, the engine performs ordinary property GETs by key (which can trigger getters and walk the prototype chain), assigning each result to the target variable or alias.',
    'For each target, if the resolved value is exactly `undefined` and a default is provided, the default expression is evaluated and used; defaults are evaluated lazily, left to right.',
    'Nested patterns recurse: a nested `{}` or `[]` is itself destructured against the value found at that position/key.',
    'Because array destructuring uses the iterator protocol, it works on any iterable (strings, Sets, Maps, generators), not just arrays.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  OBJECT (match by KEY)              ARRAY (match by POSITION)
  source: { a: 1, b: 2, c: 3 }       source: [10, 20, 30, 40]
            │   │                              0   1   2   3
            ▼   ▼                              │   │   └────rest───┐
  const { a, b } = source            const [x, y, ...rest] = source
          a=1  b=2                           x=10 y=20  rest=[30,40]

  default fires only when value === undefined:
  const { z = 99 } = source   →   z = 99  (no key 'z')`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Destructuring creates NEW bindings (variables) that hold copies of references/primitives from the source — it does not move or delete anything from the source object/array.',
    'For object/array VALUES that are themselves objects, the new variable holds the same reference, so mutating through it mutates the original nested object (shallow).',
    'A rest pattern allocates a NEW array (array rest) or NEW object (object rest) on the heap containing the leftover items/own properties.',
    'Default expressions only allocate/evaluate when actually needed (the value was undefined), so unused defaults cost nothing.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — swap two variables',
      lang: 'js',
      code: `let a = 1, b = 2
;[a, b] = [b, a]
console.log(a, b)  // 2 1`,
      explanation: [
        'The right side `[b, a]` builds a temporary array `[2, 1]`.',
        'Array destructuring on the left assigns position 0 to `a`, position 1 to `b`.',
        'This swaps without a temp variable — a classic interview one-liner.',
        'The leading semicolon avoids accidental concatenation with a previous line.',
      ],
    },
    intermediate: {
      label: 'Intermediate — destructuring function parameters with defaults',
      lang: 'js',
      code: `function createUser({ name, role = 'user', active = true } = {}) {
  return { name, role, active }
}
createUser({ name: 'Lee' })
// { name: 'Lee', role: 'user', active: true }
createUser()
// { name: undefined, role: 'user', active: true } — no crash`,
      explanation: [
        'The parameter is itself an object pattern, so callers pass a config object.',
        'Inner defaults (`role`, `active`) fill missing keys.',
        'The `= {}` outer default lets you call `createUser()` with no argument without throwing.',
        'This "options object" pattern is everywhere in libraries and APIs.',
      ],
    },
    advanced: {
      label: 'Advanced — nested + rest + rename',
      lang: 'js',
      code: `const response = {
  data: { user: { id: 7, name: 'Mo' }, token: 'abc' },
  meta: { page: 1, total: 50 },
}
const {
  data: { user: { id: userId, name }, ...restData },
  meta: { total },
} = response
// userId=7, name='Mo', restData={ token:'abc' }, total=50`,
      explanation: [
        'Nested patterns dig into response.data.user without intermediate variables.',
        '`id: userId` renames the extracted value to `userId`.',
        '`...restData` collects the remaining own properties of `data` (just `token`) into a new object.',
        'This shape is exactly how you unpack API responses in real apps.',
      ],
    },
    realProject: {
      label: 'Real project — React/Vue props and Node imports',
      lang: 'js',
      code: `// React: destructure props and hook tuple
function Profile({ user, onSave }) {
  const [editing, setEditing] = useState(false)
  return null
}

// Node: destructure named exports + a config payload
const { readFile, writeFile } = require('fs/promises')
async function load({ path, encoding = 'utf8' }) {
  return readFile(path, encoding)
}`,
      explanation: [
        '`{ user, onSave }` destructures the props object in the parameter list — idiomatic React.',
        '`const [editing, setEditing] = useState(false)` is array destructuring of the hook’s returned tuple.',
        '`const { readFile, writeFile } = require(...)` pulls named functions from a module object.',
        '`{ path, encoding = "utf8" }` gives the loader an options object with a default — the standard Node pattern.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is destructuring and what can you destructure?',
      answer: 'It is syntax to unpack values from arrays (by position) or objects (by key) into variables. You can destructure any iterable (arrays, strings, Sets) and any object, including in function parameters.',
      explanation: 'A good answer distinguishes position-based array destructuring from key-based object destructuring.',
    },
    {
      level: 'beginner',
      question: 'When does a destructuring default value actually get used?',
      answer: 'Only when the resolved value is exactly `undefined` — for example a missing key or a missing array index. It does NOT apply for null, 0, empty string, or false.',
      explanation: 'The undefined-only rule is a frequent gotcha; null will NOT trigger the default.',
    },
    {
      level: 'intermediate',
      question: 'How do you rename a property while destructuring, and how do you set a default at the same time?',
      answer: 'Use `const { key: alias = defaultValue } = obj`. It reads `obj.key`, defaults to defaultValue if undefined, and binds the result to a variable named `alias`.',
      explanation: 'Combining rename and default in one pattern is a common practical question.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between array rest and object rest?',
      answer: 'Array rest collects remaining iterated elements into a new array (`[a, ...rest]`); object rest collects remaining own enumerable properties into a new object (`{ a, ...rest }`). Both must be last in the pattern.',
      explanation: 'Mentioning that rest must be the final element and that both create new collections shows precision.',
    },
    {
      level: 'advanced',
      question: 'Why does destructuring `const { a } = null` throw, and how do you guard it?',
      answer: 'Destructuring null/undefined throws a TypeError because the engine tries to read properties of null. Guard with a default on the whole source: `const { a } = obj ?? {}` or a parameter default `= {}`.',
      explanation: 'Strong answers note that object destructuring coerces the source and accessing properties of null/undefined is the failure point.',
    },
    {
      level: 'senior',
      question: 'How does array destructuring relate to the iterator protocol, and what are the performance implications?',
      answer: 'Array destructuring consumes the source via Symbol.iterator, pulling values lazily; it therefore works on any iterable (generators, Maps). For large arrays where you only need the first few items, it stops early. Object destructuring instead does property GETs, which can trigger getters and prototype-chain lookups.',
      explanation: 'Senior signal: connecting destructuring to iterators, getters, and the cost of triggering accessors or walking the prototype chain.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How is destructuring different from the spread operator?',
    'Can you destructure in a for...of loop? (yes — `for (const [k, v] of map)`)',
    'What happens when you destructure more array elements than exist?',
    'How do you destructure with computed/dynamic keys?',
    'Does destructuring deep-copy nested objects? (no — references are shared)',
    'How does object rest interact with prototype properties? (only own enumerable props)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting the default to apply for null.',
      why: 'Defaults only fire for `undefined`; `null` is a real value and passes through.',
      fix: 'Normalize with nullish coalescing first (`value ?? fallback`) if null should also use the fallback.',
    },
    {
      mistake: 'Destructuring a possibly null/undefined source directly.',
      why: 'Reading properties of null/undefined throws a TypeError and crashes the function.',
      fix: 'Add a source default or coalesce: `const { x } = obj ?? {}` or parameter `= {}`.',
    },
    {
      mistake: 'Forgetting the leading semicolon before `[a, b] = ...` on its own line.',
      why: 'The previous line without a semicolon can merge, treating `[` as indexing and breaking ASI.',
      fix: 'Prefix the line with a semicolon, or always terminate statements with semicolons.',
    },
    {
      mistake: 'Assuming object rest copies inherited properties.',
      why: 'Object rest only gathers OWN enumerable properties; inherited/prototype properties are excluded.',
      fix: 'If you need inherited members, copy them explicitly; object rest is for own enumerable data.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'Props and hook tuples are destructured constantly (`function C({a, b})`, `const [s, setS] = useState()`); destructuring props in the signature documents the component’s API.' },
    { area: 'Vue', detail: 'Composables return objects that callers destructure (`const { count, increment } = useCounter()`); note you must keep refs (not destructure their .value) to preserve reactivity.' },
    { area: 'Node.js', detail: 'Destructuring named exports from modules (`const { readFile } = require(...)`) and unpacking req params/body, plus options-object parameters with defaults.' },
    { area: 'Backend', detail: 'Unpacking validated request payloads, environment config, and database row results; combined with defaults for resilient handlers.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Array destructuring consumes an iterator lazily, so taking the first N items from a large iterable stops early.',
      'Reduces repeated property access (`obj.a; obj.b`) into a single readable pattern with no meaningful runtime cost.',
    ],
    bad: [
      'Object destructuring triggers getters and prototype-chain lookups per key, which can be costly if accessors are expensive.',
      'Rest patterns allocate a new array/object every time, adding GC pressure in hot loops.',
    ],
    optimizations: [
      'Avoid `...rest` in hot paths where you do not need the leftovers — destructure only what you use.',
      'Destructure once at the top of a function rather than repeatedly inside loops.',
      'Be mindful that destructuring objects with getters re-invokes them; cache the value if reused.',
      'For very large arrays where you need only a few items, prefer destructuring over copying the whole array.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['object-creation', 'data-types', 'array-methods'],
    nextConcepts: ['default-rest-spread', 'optional-chaining-nullish', 'iterables-iterators', 'es6-classes'],
    dependencyNote:
      'Destructuring builds on object creation and array basics, and pairs tightly with default/rest/spread and optional chaining; together they form the modern syntax for consuming data structures.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write an object `{ a:1, b:2 }` and show `const { a, b } = obj` mapping by key.',
      'Write an array `[10, 20, 30]` and show `const [x, , z] = arr` mapping by position (note the skipped slot).',
      'Add a default: `const { c = 9 } = obj` and say it only fires when the value is undefined.',
      'Add a rest: `const [first, ...rest] = arr` and circle the new array `rest` holds.',
      'Say: "Object = match by name, array = match by position, defaults fire only on undefined, rest collects the leftovers into a new collection."',
    ],
    diagram: `  const { a, b = 5 } = { a: 1 }     // a=1, b=5 (default)
  const [x, , z] = [10, 20, 30]    // x=10, z=30 (skip 20)
  const [head, ...tail] = [1,2,3]  // head=1, tail=[2,3]
  match:  OBJECT→by key    ARRAY→by position`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Destructuring unpacks values from objects (by key) or arrays/iterables (by position) into variables in one line. It supports renaming (`key: alias`), defaults that fire only when the value is undefined, nesting, and a rest element that collects leftovers into a new array or object. It powers React props/hooks, Vue composables, and Node imports. Watch out: destructuring null/undefined throws, defaults do not fire for null, and rest only takes own enumerable properties. It never mutates the source.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Destructuring is ES6 syntax for unpacking values out of objects and arrays into individual variables. Object destructuring matches by key, so `const { name, role } = user` pulls those properties; array destructuring matches by position, so `const [first, second] = list` takes them in order, and because it uses the iterator protocol it works on any iterable, not just arrays. It supports three things I rely on daily: defaults, which fire only when the value is exactly undefined — not null, not zero; renaming with `key: alias`; and a rest element that collects the leftovers into a brand-new array or object. It is especially powerful in function parameters: I can accept an options object like `function f({ path, encoding = "utf8" } = {})`, which is self-documenting and resilient to missing arguments. The classic traps are destructuring something that might be null or undefined, which throws a TypeError, so I coalesce the source with `?? {}`; and expecting the default to kick in for null, which it won’t. It is purely an assignment pattern — it never mutates the source — and for nested objects the unpacked variable still holds the same reference, so it is shallow.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Destructuring improves readability but can hide that you are triggering getters or deep property access; explicit access is sometimes clearer for expensive accessors.',
      'Parameter destructuring documents an API but couples the function to a specific object shape, which can be harder to evolve than positional params.',
    ],
    edgeCases: [
      'Destructuring null/undefined throws; missing keys yield undefined (and defaults fire).',
      'Defaults are evaluated lazily and left-to-right, so a later default can reference an earlier destructured variable.',
      'Object rest excludes inherited and non-enumerable properties; array rest exhausts the iterator.',
      'Destructuring in Vue breaks reactivity if you pull `.value` out of a ref instead of keeping the ref.',
    ],
    runtimeBehavior: [
      'Array destructuring invokes Symbol.iterator and calls next() repeatedly, so infinite generators can be partially consumed safely with a fixed pattern.',
      'Object destructuring performs GETs that can run getters and walk the prototype chain.',
      'Rest creates a fresh heap allocation each time.',
    ],
    scalability: [
      'In hot loops, avoid rest patterns and repeated re-destructuring to limit allocations.',
      'For huge iterables, destructuring the first few items is efficient because it stops pulling early.',
    ],
    productionConcerns: [
      'Reactivity loss in Vue/Solid when destructuring reactive sources is a common production bug — destructure refs/stores carefully or use toRefs.',
      'Destructuring API responses without validation propagates undefined deep into the app; combine with schema validation.',
      'Default-only-on-undefined semantics cause subtle bugs when backends send null — normalize at the boundary.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Object = match by key; array/iterable = match by position.',
    'Rename: const { key: alias } = obj.',
    'Default: const { x = 5 } = obj — fires ONLY when value is undefined.',
    'null does NOT trigger the default.',
    'Rest: [a, ...rest] (new array) / { a, ...rest } (new object) — must be last.',
    'Object rest = own enumerable props only (no inherited).',
    'Destructuring null/undefined throws → guard with ?? {}.',
    'Swap: [a, b] = [b, a].',
    'Works in params: function f({ a = 1 } = {}).',
    'Array destructuring uses Symbol.iterator (works on strings, Sets, generators).',
    'Skip array slots with commas: [a, , c].',
    'Shallow — nested variables still share references.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given `const point = { x: 3, y: 7 }`, destructure x and y into variables and log their sum.',
      hint: 'Use object destructuring matching the keys.',
      solution: {
        lang: 'js',
        code: `const point = { x: 3, y: 7 }
const { x, y } = point
console.log(x + y)  // 10`,
        explanation: [
          'The pattern `{ x, y }` matches keys in the object.',
          'It binds point.x to x and point.y to y.',
          'The source object is unchanged.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write `head` and `tail` from an array using one destructuring statement: head is the first element, tail is an array of the rest. Test on [1,2,3,4].',
      hint: 'Use a rest element.',
      solution: {
        lang: 'js',
        code: `const [head, ...tail] = [1, 2, 3, 4]
console.log(head)  // 1
console.log(tail)  // [2, 3, 4]`,
        explanation: [
          '`head` takes position 0.',
          '`...tail` collects all remaining elements into a new array.',
          'The rest element must come last in the pattern.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Given a possibly-missing config, write `getPort(config)` that returns config.server.port, defaulting to 8080 if config, server, or port is missing — without throwing.',
      hint: 'Combine nested destructuring with defaults at each level, or use a safe source default.',
      solution: {
        lang: 'js',
        code: `function getPort(config) {
  const { server: { port = 8080 } = {} } = config ?? {}
  return port
}
getPort({ server: { port: 3000 } })  // 3000
getPort({})                          // 8080
getPort(undefined)                   // 8080`,
        explanation: [
          '`config ?? {}` guards against null/undefined config.',
          '`server: { ... } = {}` defaults the nested object so it is never null when destructured.',
          '`port = 8080` supplies the final default when the key is absent.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement `pick(obj, keys)` that returns a new object containing only the given keys, using destructuring concepts (rest/computed keys allowed).',
      hint: 'Iterate the keys and copy only those present, or build via reduce.',
      solution: {
        lang: 'js',
        code: `function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (key in obj) {
      const { [key]: value } = obj   // computed-key destructuring
      acc[key] = value
    }
    return acc
  }, {})
}
pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])  // { a: 1, c: 3 }`,
        explanation: [
          '`{ [key]: value } = obj` uses a computed key to destructure a dynamic property.',
          'We only copy keys that exist via `key in obj`.',
          'reduce accumulates a fresh object, leaving the original untouched.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Destructuring is in almost every modern JS file you will read or write. Fluency signals you are comfortable with ES6 and with consuming props, state, and API data idiomatically — and it prevents a whole class of undefined-related bugs.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask for the syntax, the swap trick, and the default rule. Product companies (Zoho, Flipkart, Razorpay) ask you to destructure nested API payloads and implement pick/omit. FAANG-level interviews probe the iterator protocol behind array destructuring and reactivity pitfalls in frameworks.',
    whatInterviewersExpect:
      'They expect correct object vs array semantics, the undefined-only default rule, comfort with rename/nesting/rest, and awareness of the null/undefined crash — ideally tied to how you destructure props or config in a real codebase.',
  },
}

export default destructuring
