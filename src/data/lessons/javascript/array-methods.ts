import type { ConceptLesson } from '../../../types/lesson'

const arrayMethods: ConceptLesson = {
  // 1. Concept Summary
  slug: 'array-methods',
  name: 'Array Methods',
  category: 'iteration-collections',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Array methods (map, filter, reduce, find, some, every) are the everyday vocabulary of JavaScript — you will use them in literally every component and API handler.',
    'They let you transform data declaratively (say WHAT you want) instead of writing manual for-loops (HOW), which is shorter, clearer, and less bug-prone.',
    'Knowing which methods mutate vs return a new array is the difference between clean state management and subtle UI bugs in Vue/React.',
    'Interviewers use them to test whether you can reach for the right tool, chain transformations, and understand callbacks and immutability.',
    'Misusing reduce, forgetting that map needs a return, or mutating during iteration are extremely common bugs they probe for.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Array methods are little robots on a conveyor belt that each do one job to your row of toys.',
    story: [
      'Imagine a line of toys moving along a conveyor belt.',
      'One robot paints every toy a new colour — that robot is like map: it changes each toy and gives you a new line of painted toys.',
      'Another robot only lets red toys pass and throws the rest aside — that is like filter: it keeps the ones that match a rule.',
      'A third robot looks at the whole line and counts them into one number, like a piggy bank adding up coins — that is like reduce: it squashes the whole line into a single answer. You pick the robot that does the job you need.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'An array is an ordered list of values, and array methods are built-in functions that do something to every item or to the list as a whole.',
    'Most of them take a callback — a small function you write that decides what to do with each item.',
    'map makes a new list by transforming each item; filter makes a new list keeping only items that pass a test; reduce combines everything into one value.',
    'Some methods return a brand-new array (so the original is untouched), while a few change the original array in place — knowing which is which matters.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Array methods are built-in functions on Array.prototype that iterate or operate over an array, usually by taking a callback invoked with (element, index, array) and returning either a new array, a single value, or a boolean.',
    how: 'You call them with dot syntax on an array and pass a callback. map/filter/slice/concat return NEW arrays (non-mutating); push/pop/splice/sort/reverse change the original (mutating). reduce folds the array into one accumulated value.',
    why: 'They make data transformation declarative and chainable, eliminate manual index bookkeeping, and pair perfectly with immutable state in modern frameworks.',
    code: {
      label: 'map, filter, reduce together',
      lang: 'js',
      code: `const nums = [1, 2, 3, 4, 5]\n\nconst doubled = nums.map((n) => n * 2)        // [2,4,6,8,10]\nconst evens = nums.filter((n) => n % 2 === 0) // [2,4]\nconst sum = nums.reduce((acc, n) => acc + n, 0) // 15\n\nconsole.log(doubled, evens, sum)`,
      explanation: [
        'map runs the callback on every element and collects the returned values into a NEW array.',
        'filter keeps only elements for which the callback returns a truthy value, in a new array.',
        'reduce starts with 0 (the initial accumulator) and adds each number, producing a single total.',
        'The original `nums` is never changed — all three are non-mutating.',
        'You can chain them: nums.filter(...).map(...) reads top-to-bottom like a pipeline.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Array methods are functions defined on Array.prototype that operate over the elements of an array. Iteration methods (forEach, map, filter, reduce, some, every, find, findIndex, flatMap) accept a callback invoked with (element, index, array) and an optional thisArg. They divide into non-mutating methods that return a new array or value (map, filter, slice, concat, flat, flatMap, reduce) and mutating methods that modify the receiver in place (push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin). Iteration methods skip empty slots in sparse arrays and read length once before iterating in most engines.',

  // 7. Internal Working
  internalWorking: [
    'When you call e.g. arr.map(cb), the method reads the array length and iterates indices 0..length-1.',
    'For each index it checks whether the element exists (own property); in sparse arrays, holes are skipped by map/filter/forEach but visited by some lower-level methods.',
    'It invokes your callback with (currentValue, index, originalArray), optionally bound to a thisArg passed as the second argument.',
    'Non-mutating methods build and return a fresh array (map/filter) or accumulate a value (reduce/some/every), leaving the source untouched.',
    'Mutating methods (push, splice, sort) change the array object in place and return either the new length or the modified array; sort with no comparator coerces elements to strings and sorts lexicographically.',
    'reduce maintains an accumulator: with an initialValue it starts there at index 0; without one it uses element 0 as the seed and starts at index 1 (throwing on an empty array with no initial value).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   SOURCE:        [ 1 ,  2 ,  3 ,  4 ]
                    │    │    │    │
   map(x*2) ──────► [ 2 ,  4 ,  6 ,  8 ]   (NEW array, same length)

   filter(even) ──► [      2 ,      4   ]   (NEW array, <= length)

   reduce(+,0) ───► ((((0+1)+2)+3)+4) = 10  (ONE value)

   forEach ───────► (no return) just runs side effects

   MUTATING vs NON-MUTATING
   push/pop/splice/sort/reverse  => change original  (danger in state)
   map/filter/slice/concat/flat  => return new array (safe for state)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'An array is a heap object; a variable holds a reference to it, so passing it to a method passes the reference.',
    'map/filter ALLOCATE a new array object on the heap; the original reference is unchanged, which is why immutable updates work.',
    'Mutating methods modify the SAME heap object, so every reference to that array (including framework state) sees the change.',
    'Chaining map().filter().map() allocates one intermediate array per step — fine for small data, but worth noting for very large arrays in hot paths.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — find, some, every, includes',
      lang: 'js',
      code: `const users = [\n  { name: 'Sam', active: true },\n  { name: 'Ada', active: false },\n]\n\nusers.find((u) => u.name === 'Ada')   // { name:'Ada', active:false }\nusers.some((u) => u.active)           // true (at least one active)\nusers.every((u) => u.active)          // false (not all active)\n;[1, 2, 3].includes(2)                // true`,
      explanation: [
        'find returns the FIRST matching element (or undefined) — great for lookups.',
        'some returns true if AT LEAST one element passes the test (short-circuits early).',
        'every returns true only if ALL elements pass (also short-circuits on first failure).',
        'includes checks membership for primitives using SameValueZero (so NaN is found).',
      ],
    },
    intermediate: {
      label: 'Intermediate — chaining a data pipeline',
      lang: 'js',
      code: `const orders = [\n  { id: 1, total: 120, paid: true },\n  { id: 2, total: 40, paid: false },\n  { id: 3, total: 80, paid: true },\n]\n\nconst paidTotal = orders\n  .filter((o) => o.paid)         // keep paid orders\n  .map((o) => o.total)           // pull out totals\n  .reduce((sum, t) => sum + t, 0) // add them up\n\nconsole.log(paidTotal) // 200`,
      explanation: [
        'filter narrows the list to paid orders only.',
        'map projects each order down to just its total.',
        'reduce folds the totals into a single sum, starting at 0.',
        'Reading top-to-bottom, the chain describes the transformation as a clear pipeline — declarative over imperative.',
      ],
    },
    advanced: {
      label: 'Advanced — reduce to group and to build an object',
      lang: 'js',
      code: `const people = [\n  { name: 'Sam', team: 'A' },\n  { name: 'Ada', team: 'B' },\n  { name: 'Lee', team: 'A' },\n]\n\nconst byTeam = people.reduce((acc, p) => {\n  ;(acc[p.team] ||= []).push(p.name)\n  return acc\n}, {})\n// { A: ['Sam','Lee'], B: ['Ada'] }\n\nconst index = Object.fromEntries(people.map((p) => [p.name, p]))\n// { Sam: {...}, Ada: {...}, Lee: {...} }`,
      explanation: [
        'reduce is not just for sums — it can build any shape, here a groupBy object.',
        'The accumulator starts as {} and we append names to per-team arrays.',
        'Object.fromEntries + map is a clean way to turn an array into a keyed lookup object.',
        'Always return the accumulator from a reduce callback — forgetting to is the #1 reduce bug.',
      ],
    },
    realProject: {
      label: 'Real project — immutable list update in a Vue/React store',
      lang: 'js',
      code: `// state.todos is reactive; we must NOT mutate it in place\nfunction toggleTodo(todos, id) {\n  return todos.map((t) =>\n    t.id === id ? { ...t, done: !t.done } : t\n  )\n}\n\nfunction removeTodo(todos, id) {\n  return todos.filter((t) => t.id !== id)\n}\n\n// usage: state.todos = toggleTodo(state.todos, 3)`,
      explanation: [
        'map returns a NEW array with one item replaced by a NEW object — the original array and items are untouched.',
        'filter returns a NEW array without the removed item.',
        'This immutable pattern is exactly how React reducers and Vue/Pinia updates avoid shared-reference bugs and trigger reactivity correctly.',
        'Using splice/push here would mutate state in place and can break change detection or cause hard-to-trace bugs.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between map and forEach?',
      answer: 'map returns a NEW array of the transformed values; forEach returns undefined and is used only for side effects. Use map when you need the result, forEach when you just want to do something per element.',
      explanation: 'A classic check: candidates who use forEach and push into an array externally usually should have used map.',
    },
    {
      level: 'beginner',
      question: 'Which common array methods mutate the original array?',
      answer: 'push, pop, shift, unshift, splice, sort, reverse, fill, and copyWithin mutate in place. map, filter, slice, concat, flat, and flatMap return new arrays without mutating.',
      explanation: 'Knowing the mutating set is essential for immutable state — sort and reverse surprise people because they mutate.',
    },
    {
      level: 'intermediate',
      question: 'What does reduce do, and what happens if you omit the initial value?',
      answer: 'reduce folds an array into a single accumulated value via a callback (acc, cur). With an initialValue it starts there from index 0; without one it uses element 0 as the seed and starts at index 1, and it throws a TypeError on an empty array.',
      explanation: 'Always passing an initial value is the safe habit; the empty-array throw is a frequent gotcha.',
    },
    {
      level: 'intermediate',
      question: 'How do you remove duplicates from an array?',
      answer: 'For primitives: [...new Set(arr)]. For objects by a key: use a Map or reduce keyed by the unique field, e.g. Array.from(new Map(arr.map(o => [o.id, o])).values()).',
      explanation: 'Tests knowledge of Set for primitives and a Map-based approach for object uniqueness.',
    },
    {
      level: 'advanced',
      question: 'Why can sort give unexpected order, and how do you sort numbers correctly?',
      answer: 'Default sort converts elements to strings and compares lexicographically, so [10,2,1] sorts to [1,10,2]. Pass a comparator: arr.sort((a,b) => a - b) for ascending numbers. Also note sort mutates in place.',
      explanation: 'Both the string-coercion default and the in-place mutation are common production bugs.',
    },
    {
      level: 'senior',
      question: 'When would you avoid chaining map/filter, and what are the alternatives?',
      answer: 'On very large arrays in hot paths, each chained method allocates an intermediate array and iterates fully. A single reduce, a manual for-of loop, or a lazy approach (generators/transducers) does one pass with no intermediates. Profile first — for typical sizes chaining is clearer and fast enough.',
      explanation: 'Senior signal: balancing readability against allocation/passes, and not micro-optimizing prematurely.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What arguments does the callback receive? (element, index, array)',
    'What is the difference between flat and flatMap?',
    'How does find differ from filter when you only need one item?',
    'Why does Array.prototype.includes find NaN but indexOf does not?',
    'How would you implement your own map or filter using reduce?',
    'What is the difference between slice and splice?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting to return a value from a map or reduce callback.',
      why: 'map then fills the array with undefined; reduce loses the accumulator and yields undefined or throws.',
      fix: 'Always return the transformed value (map) or the accumulator (reduce); use an arrow with implicit return for clarity.',
    },
    {
      mistake: 'Using sort or reverse on framework state directly.',
      why: 'They mutate the original array, which can break reactivity assumptions or cause shared-reference bugs.',
      fix: 'Copy first: [...arr].sort(...) or arr.slice().sort(...) to keep the source immutable.',
    },
    {
      mistake: 'Relying on default sort for numbers.',
      why: 'Default sort compares as strings, so 10 comes before 2.',
      fix: 'Always pass a comparator: (a, b) => a - b for numbers.',
    },
    {
      mistake: 'Mutating the array while iterating it (push/splice inside forEach/map).',
      why: 'Changing length during iteration leads to skipped or repeated elements and confusing bugs.',
      fix: 'Build a new array (map/filter) instead of mutating, or iterate a copy.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Computed properties commonly filter/map/sort source arrays into derived lists for v-for; using non-mutating methods keeps reactivity predictable. Sorting is done on a copy to avoid mutating reactive state.' },
    { area: 'React', detail: 'Rendering lists uses map to produce elements; state updates use map/filter to produce new arrays so React detects the change. Mutating state arrays in place is a top cause of "UI not updating" bugs.' },
    { area: 'Node.js', detail: 'API handlers reshape DB rows with map, aggregate with reduce, and validate with every/some before responding. reduce builds lookup maps and groupings for efficient joins in memory.' },
    { area: 'Backend', detail: 'ETL and reporting pipelines chain filter/map/reduce to transform records; for very large datasets, streaming or a single reduce pass avoids large intermediate arrays.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'some/every/find short-circuit, so they stop at the first match/failure instead of scanning everything.',
      'A single reduce can do filter+map+aggregate in one pass with no intermediate arrays.',
    ],
    bad: [
      'Long chains allocate an intermediate array per step and iterate fully each time — O(n) per link.',
      'Repeated indexOf/includes inside a loop is O(n^2); a Set lookup is O(1) and much faster for membership tests.',
    ],
    optimizations: [
      'For membership checks against a large list, build a Set once and use .has() instead of includes/indexOf.',
      'Collapse filter().map() into a single reduce or for-of loop for very large arrays in hot paths.',
      'Avoid re-running heavy chains on every render — memoize derived arrays (computed in Vue, useMemo in React).',
      'Prefer find over filter()[0] when you only need the first match — it stops early.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'callbacks', 'higher-order-functions', 'arrow-functions'],
    nextConcepts: ['map-vs-object', 'set-operations', 'iterables-iterators', 'pure-functions', 'function-composition'],
    dependencyNote:
      'Array methods build directly on callbacks and higher-order functions; mastering them leads naturally into other collections (Map, Set), iteration protocols, and functional concepts like pure functions and composition.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a row of four boxes as the source array [1,2,3,4].',
      'Below it draw an arrow labelled map and a new row of the same length with each value transformed.',
      'Draw a second arrow labelled filter producing a shorter row (only items that pass).',
      'Draw a third arrow labelled reduce collapsing into a single circle (one value).',
      'Annotate which return new arrays (map/filter) and which mutate (push/sort/splice).',
      'Say: "map transforms, filter selects, reduce aggregates — and prefer non-mutating ones for state."',
    ],
    diagram: `   [1][2][3][4]   source
        │ map (x2)
        ▼
   [2][4][6][8]   new array (same length)
        │ filter (even)
        ▼
   [   ][4][   ][8] -> [4][8]  new array (shorter)
        │ reduce (+)
        ▼
        ( 12 )        single value`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Array methods transform lists declaratively. map makes a new array of transformed items, filter keeps items passing a test, reduce folds everything into one value, and find/some/every search or test. The callback gets (element, index, array). Remember the split: map/filter/slice/concat return new arrays (safe for state), while push/pop/splice/sort/reverse mutate in place. Always return from map/reduce callbacks, pass a comparator to sort numbers, and use a Set for fast membership.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Array methods are the built-in functions on Array.prototype for working with lists, and most take a callback called with the element, its index, and the array. I group them mentally by what they produce. map returns a new array of the same length with each element transformed. filter returns a new, usually shorter array keeping only elements that pass a predicate. reduce folds the whole array into a single value using an accumulator — it is the most general one and can build sums, objects, or groupings. find returns the first matching element, while some and every return booleans and short-circuit early. The most important distinction in practice is mutating versus non-mutating. map, filter, slice, concat, flat, and flatMap return brand-new arrays and leave the original alone, which is exactly what you want for immutable state in Vue or React. push, pop, splice, sort, and reverse mutate the array in place, so I copy first — like [...arr].sort() — when the source is framework state. A few gotchas I watch for: I always return a value from map and reduce callbacks, I always pass a comparator to sort numbers because the default sorts as strings, and for repeated membership checks I build a Set so lookups are O(1) instead of an O(n) includes in a loop. Chaining filter, map, and reduce reads like a clear pipeline, which I prefer for readability unless the array is huge and I need a single pass.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Readable chains (filter.map.reduce) vs a single-pass reduce/for-of: clarity versus fewer allocations and passes.',
      'Immutable updates (map/filter producing new arrays) cost extra allocations but give predictable reactivity and easier debugging.',
      'find vs filter: find is cheaper for a single result but filter is needed when you want all matches.',
    ],
    edgeCases: [
      'Sparse arrays: map/filter/forEach skip holes, so the result can differ from a manual index loop.',
      'sort is not guaranteed stable in older engines (now stable in modern V8); relying on stability across environments can bite.',
      'reduce on an empty array with no initial value throws TypeError.',
      'Comparator must return a number; returning a boolean from sort is a classic bug producing inconsistent order.',
    ],
    runtimeBehavior: [
      'Most iteration methods snapshot length before iterating, so growing the array mid-iteration does not extend the loop, but shrinking can cause skips.',
      'Callbacks receive the original array as the third argument, enabling lookbehind/lookahead within the same pass.',
      'some/every/find short-circuit; map/filter/forEach always traverse fully.',
    ],
    scalability: [
      'For millions of elements, intermediate arrays from chaining create GC pressure; prefer one pass or streaming.',
      'Membership and dedup at scale should use Set/Map (O(1)) rather than includes/indexOf (O(n)).',
    ],
    productionConcerns: [
      'Accidental mutation of shared/reactive arrays is a frequent source of stale-UI and cross-component bugs — enforce non-mutating patterns or Object.freeze in dev.',
      'Heavy derived arrays should be memoized (computed/useMemo) to avoid recomputing on every render.',
      'Be deliberate about copying depth — map with spread does a shallow copy; nested objects still share references.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Callback signature: (element, index, array).',
    'map: transform -> new array (same length).',
    'filter: select by predicate -> new array (<= length).',
    'reduce: fold -> single value; always pass an initial value.',
    'find/findIndex: first match; some/every: booleans, short-circuit.',
    'forEach: side effects only, returns undefined.',
    'NON-mutating: map, filter, slice, concat, flat, flatMap.',
    'MUTATING: push, pop, shift, unshift, splice, sort, reverse, fill.',
    'sort numbers: (a,b) => a - b; default sort is string-based.',
    'Dedup primitives: [...new Set(arr)].',
    'Fast membership: build a Set, use .has().',
    'Copy before sort/reverse on state: [...arr].sort().',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given numbers = [3, 7, 2, 9, 4], return a new array of only the numbers greater than 4, doubled.',
      hint: 'filter then map.',
      solution: {
        lang: 'js',
        code: `const numbers = [3, 7, 2, 9, 4]\nconst result = numbers.filter((n) => n > 4).map((n) => n * 2)\n// [14, 18]`,
        explanation: [
          'filter keeps 7 and 9 (the values greater than 4).',
          'map doubles each survivor, producing [14, 18].',
          'The original array is untouched because both methods return new arrays.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write groupBy(arr, keyFn) that returns an object mapping each key to the array of items with that key.',
      hint: 'Use reduce with an object accumulator.',
      solution: {
        lang: 'js',
        code: `function groupBy(arr, keyFn) {\n  return arr.reduce((acc, item) => {\n    const key = keyFn(item)\n    ;(acc[key] ||= []).push(item)\n    return acc\n  }, {})\n}\n\ngroupBy([6.1, 4.2, 6.3], Math.floor)\n// { '4': [4.2], '6': [6.1, 6.3] }`,
        explanation: [
          'reduce starts with an empty object accumulator.',
          'For each item we compute its key and push the item into that key bucket, creating the array if needed.',
          'Returning acc each iteration is essential — it carries the object forward.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Remove duplicate objects from an array by their id, keeping the first occurrence.',
      hint: 'A Map keyed by id deduplicates while preserving order.',
      solution: {
        lang: 'js',
        code: `function uniqueById(arr) {\n  const seen = new Map()\n  for (const item of arr) {\n    if (!seen.has(item.id)) seen.set(item.id, item)\n  }\n  return [...seen.values()]\n}\n\nuniqueById([{ id: 1 }, { id: 2 }, { id: 1 }])\n// [{ id: 1 }, { id: 2 }]`,
        explanation: [
          'A Map keyed by id gives O(1) lookups and preserves insertion order.',
          'We only set an id the first time we see it, so the first occurrence wins.',
          'Spreading the Map values back into an array yields the deduplicated list.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement map and filter yourself using only reduce.',
      hint: 'The accumulator is the output array; push transformed/selected items.',
      solution: {
        lang: 'js',
        code: `const myMap = (arr, fn) =>\n  arr.reduce((acc, x, i) => {\n    acc.push(fn(x, i, arr))\n    return acc\n  }, [])\n\nconst myFilter = (arr, pred) =>\n  arr.reduce((acc, x, i) => {\n    if (pred(x, i, arr)) acc.push(x)\n    return acc\n  }, [])\n\nmyMap([1, 2, 3], (x) => x * 2) // [2,4,6]\nmyFilter([1, 2, 3, 4], (x) => x % 2 === 0) // [2,4]`,
        explanation: [
          'reduce with an array accumulator can express both transformations in one pass.',
          'myMap pushes the transformed value for every element.',
          'myFilter pushes only elements that pass the predicate, demonstrating that reduce is the most general iteration method.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Array methods are the daily bread of JavaScript. Fluency here makes you faster and cleaner in every component, handler, and data transform, and it signals that you think in terms of declarative pipelines rather than fiddly index loops.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask you to differentiate map/filter/reduce and write a small transformation. Product companies (Zoho, Flipkart, Razorpay) ask for groupBy, dedup, or building a lookup with reduce. FAANG-level interviews use them as building blocks in larger problems and probe immutability, mutation pitfalls, and one-pass optimizations.',
    whatInterviewersExpect:
      'They expect you to choose the right method instantly, know the callback signature, distinguish mutating from non-mutating methods, sort numbers correctly, and write a clean reduce that always returns its accumulator — bonus points for reaching for Set/Map when membership or dedup is involved.',
  },
}

export default arrayMethods
