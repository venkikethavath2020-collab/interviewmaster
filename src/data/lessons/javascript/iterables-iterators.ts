import type { ConceptLesson } from '../../../types/lesson'

const iterablesIterators: ConceptLesson = {
  // 1. Concept Summary
  slug: 'iterables-iterators',
  name: 'Iteration Protocols',
  category: 'iteration-collections',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'The iteration protocols are the hidden contract that makes for...of, spread, destructuring, Array.from, and Map/Set iteration all work the same way.',
    'Understanding them lets you make your OWN objects iterable, build lazy/infinite sequences, and write data structures that integrate with native syntax.',
    'It explains why some things spread/iterate (arrays, strings, Maps, Sets) and others do not (plain objects) — a frequent source of confusion.',
    'Interviewers use it to separate developers who memorize for...of from those who understand the underlying Symbol.iterator and next() contract.',
    'It is the foundation for generators, async iteration (streams, paginated APIs), and lazy evaluation — high-leverage senior topics.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An iterator is a vending machine that hands you one snack each time you press the button, until it says "empty".',
    story: [
      'Imagine a vending machine full of snacks lined up in a row.',
      'You do not grab everything at once; you press a button and it drops ONE snack, then waits for you to press again.',
      'Each press it says "here is your snack, and I am NOT done yet". When the last one comes out, it says "that is the end, I am done".',
      'An iterator works just like that: you ask "give me the next one", and it hands you a value plus a little flag saying whether there are more. An iterable is anything that knows how to build you such a machine when you ask.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Some things in JavaScript can be looped over one item at a time, like arrays and strings — we call them iterable.',
    'The thing that actually hands out items one by one is called an iterator, and it has a next() method that returns the next value plus whether we are done.',
    'When you write for...of, JavaScript secretly asks the iterable for an iterator and then calls next() over and over until done is true.',
    'You can teach your own object to be iterable by giving it a special method (Symbol.iterator) that returns such an iterator — then for...of and spread work on it too.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'There are two linked protocols. The iterator protocol: an object with a next() method that returns { value, done }. The iterable protocol: an object with a [Symbol.iterator]() method that returns an iterator. Built-ins like arrays, strings, Maps, and Sets implement the iterable protocol.',
    how: 'for...of, spread (...), destructuring, Array.from, Promise.all, and yield* all call [Symbol.iterator]() to get an iterator, then repeatedly call next() until done is true, using each value in between.',
    why: 'It is a single, uniform contract so that all collections — and your own types — work with the same native syntax, and so values can be produced lazily one at a time instead of all up front.',
    code: {
      label: 'Driving an iterator by hand vs for...of',
      lang: 'js',
      code: `const arr = [10, 20, 30]\nconst it = arr[Symbol.iterator]() // get the iterator\n\nconsole.log(it.next()) // { value: 10, done: false }\nconsole.log(it.next()) // { value: 20, done: false }\nconsole.log(it.next()) // { value: 30, done: false }\nconsole.log(it.next()) // { value: undefined, done: true }\n\n// for...of does exactly this loop for you:\nfor (const x of arr) console.log(x) // 10, 20, 30`,
      explanation: [
        'arr[Symbol.iterator]() returns an iterator object — arrays are iterable.',
        'Each next() call returns { value, done }; done flips to true when exhausted.',
        'for...of is syntactic sugar over this exact next()-until-done loop.',
        'Understanding the manual version demystifies spread, destructuring, and Array.from too.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'JavaScript defines two cooperating protocols. The iterator protocol: an object is an iterator if it has a next() method returning an IteratorResult { value, done } where done is a boolean; optional return() and throw() methods allow early termination and error injection. The iterable protocol: an object is iterable if it implements a [Symbol.iterator]() method that returns an iterator. Language constructs that consume iterables (for...of, spread, array/parameter destructuring, yield*, Array.from, new Map/Set, Promise.all/race) invoke [Symbol.iterator]() once and then call next() repeatedly until done is true. Most built-in iterators are also iterable (their [Symbol.iterator]() returns themselves), so they can be used directly in for...of.',

  // 7. Internal Working
  internalWorking: [
    'A consuming construct (e.g. for...of) calls obj[Symbol.iterator]() once to obtain an iterator object.',
    'It calls iterator.next(); the returned { value, done } is inspected — if done is false, value is used (bound to the loop variable, pushed during spread, etc.).',
    'This repeats: next() is called again, advancing internal state, until a result with done: true is returned, whose value is ignored by for...of.',
    'If the loop exits early (break, throw, or return), the construct calls iterator.return() if present, letting the iterator clean up (e.g. close a file/stream) — this is the closing protocol.',
    'Built-in iterators carry their own cursor state (e.g. an array iterator holds the current index); each call mutates and advances that state, so iterators are single-use and stateful.',
    'Generators are a language-level way to produce iterators: a generator function returns an object implementing both next() and [Symbol.iterator](), with yield supplying each value lazily and pausing execution between calls.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ITERABLE                         ITERATOR
   { [Symbol.iterator]() }  ─────►  { next(): {value, done} }
        (factory)                        (cursor / state)

   for (const x of iterable) {  ...  }
        │
        ├─ 1. it = iterable[Symbol.iterator]()
        ├─ 2. r = it.next()  -> { value, done }
        ├─ 3. if (r.done) STOP
        ├─ 4. x = r.value; run body
        └─ 5. goto 2

   early exit (break/throw)  ->  it.return?.()  (cleanup)

   Iterable:   Array, String, Map, Set, arguments, NodeList, generators
   NOT iterable: plain {} objects (use Object.entries to iterate)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'An iterator is a heap object holding cursor state (e.g. the next index or a pointer into a linked structure).',
    'Because the state lives in the iterator, each [Symbol.iterator]() call produces a fresh, independent cursor — two for...of loops over the same array do not interfere.',
    'Lazy iterators (generators, infinite sequences) hold only the current state, not the whole sequence, so they can represent unbounded data in O(1) memory.',
    'An iterator is single-use: once done, it stays done; you must request a new iterator to traverse again.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — many things use the same protocol',
      lang: 'js',
      code: `const s = new Set([1, 2, 3])\n\nfor (const x of s) console.log(x)   // for...of\nconst arr = [...s]                  // spread -> [1,2,3]\nconst [first, ...rest] = s          // destructuring\nArray.from(s)                       // -> [1,2,3]\n// All four use s[Symbol.iterator]() under the hood`,
      explanation: [
        'for...of, spread, destructuring, and Array.from all consume the SAME iterable protocol.',
        'A Set is iterable, so every one of these works without special handling.',
        'This uniformity is the payoff of the protocol — one contract, many consumers.',
        'A plain object {} implements none of this, which is why it cannot be spread into an array.',
      ],
    },
    intermediate: {
      label: 'Intermediate — make a custom object iterable',
      lang: 'js',
      code: `const range = {\n  from: 1,\n  to: 4,\n  [Symbol.iterator]() {\n    let current = this.from\n    const last = this.to\n    return {\n      next() {\n        return current <= last\n          ? { value: current++, done: false }\n          : { value: undefined, done: true }\n      },\n    }\n  },\n}\n\nconsole.log([...range]) // [1, 2, 3, 4]\nfor (const n of range) console.log(n) // 1,2,3,4`,
      explanation: [
        'range implements [Symbol.iterator](), returning an iterator with cursor state (current).',
        'next() returns the current value and advances, signalling done when past the end.',
        'Because range is now iterable, spread and for...of work on it natively.',
        'This is how you integrate a custom data structure with native iteration syntax.',
      ],
    },
    advanced: {
      label: 'Advanced — lazy/infinite sequence with a generator',
      lang: 'js',
      code: `function* naturals() {\n  let n = 1\n  while (true) yield n++ // infinite, but lazy\n}\n\nfunction* take(iter, count) {\n  let i = 0\n  for (const x of iter) {\n    if (i++ >= count) return\n    yield x\n  }\n}\n\nconsole.log([...take(naturals(), 5)]) // [1,2,3,4,5]`,
      explanation: [
        'A generator function returns an iterator; yield produces one value at a time and pauses.',
        'naturals() is an infinite sequence, but nothing is precomputed — values are pulled on demand.',
        'take consumes only as many as needed, demonstrating lazy evaluation over an unbounded source.',
        'This composability (generators producing iterables consumed by other generators) is the power of the protocol.',
      ],
    },
    realProject: {
      label: 'Real project — async iteration over a paginated API (Node/fetch)',
      lang: 'js',
      code: `// Async iterator: stream pages lazily, one at a time\nasync function* fetchAllPages(url) {\n  let next = url\n  while (next) {\n    const res = await fetch(next)\n    const page = await res.json()\n    for (const item of page.items) yield item // emit each item\n    next = page.nextUrl // null when no more pages\n  }\n}\n\n// Consume with for await...of\n// for await (const item of fetchAllPages('/api/users')) { use(item) }`,
      explanation: [
        'Async generators implement the ASYNC iteration protocol ([Symbol.asyncIterator] + next() returning a Promise).',
        'for await...of consumes them, pulling one page only when the consumer is ready — natural backpressure.',
        'This streams a large paginated dataset without loading every page into memory at once.',
        'Node streams and many SDKs expose async iterables for exactly this pattern.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between an iterable and an iterator?',
      answer: 'An iterable has a [Symbol.iterator]() method that returns an iterator. An iterator is the object with next() returning { value, done }. The iterable is the factory; the iterator is the cursor.',
      explanation: 'Naming both protocols and their relationship is the core of a good answer.',
    },
    {
      level: 'beginner',
      question: 'Why can you spread an array or a Set but not a plain object into an array?',
      answer: 'Arrays and Sets implement the iterable protocol ([Symbol.iterator]); plain objects do not. Spread into an array requires an iterable, so {} fails. Use Object.entries/keys/values to iterate object properties.',
      explanation: 'Connects the protocol directly to a daily confusion point.',
    },
    {
      level: 'intermediate',
      question: 'How does for...of work under the hood?',
      answer: 'It calls obj[Symbol.iterator]() to get an iterator, then calls next() repeatedly, using value while done is false, and stops when done is true. On early exit it calls return() for cleanup.',
      explanation: 'Tests whether the candidate knows the next()-until-done loop and the closing protocol.',
    },
    {
      level: 'intermediate',
      question: 'How do you make a custom object iterable?',
      answer: 'Add a [Symbol.iterator]() method that returns an object with a next() method producing { value, done }. Often easiest to implement it as a generator method.',
      explanation: 'Implementing the protocol is a common practical task and interview ask.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between the sync and async iteration protocols?',
      answer: 'Sync uses [Symbol.iterator] and next() returning { value, done } synchronously, consumed by for...of. Async uses [Symbol.asyncIterator] and next() returning a Promise of { value, done }, consumed by for await...of — used for streams and paginated/async sources.',
      explanation: 'Senior-leaning: ties the protocol to async generators and streaming.',
    },
    {
      level: 'senior',
      question: 'What is the iterator closing protocol and why does it matter?',
      answer: 'When a for...of loop ends early (break, throw, return), it calls the iterator\'s optional return() method, letting the iterator release resources — close a file handle, abort a request, unlock state. Generators run their finally blocks at that point. Without it, lazy iterators over external resources could leak.',
      explanation: 'Senior signal: resource cleanup semantics most developers never think about.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why are most built-in iterators also iterable (return themselves)?',
    'What does yield* do?',
    'How do generators relate to iterators?',
    'What happens if next() is called after done is true?',
    'How does for await...of differ from for...of?',
    'How would you make an iterator restartable?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting for...of to work on plain objects.',
      why: 'Plain objects are not iterable (no [Symbol.iterator]).',
      fix: 'Iterate Object.keys/values/entries, or add a [Symbol.iterator] (often via a generator).',
    },
    {
      mistake: 'Reusing an exhausted iterator and expecting values.',
      why: 'Iterators are single-use and stateful; once done, next() keeps returning done: true.',
      fix: 'Call the iterable\'s [Symbol.iterator]() again to get a fresh iterator for another pass.',
    },
    {
      mistake: 'Returning a result without a done flag from a custom next().',
      why: 'Consumers rely on { value, done }; missing done is treated as undefined (falsy), so the loop never ends.',
      fix: 'Always return { value, done } with an explicit boolean done.',
    },
    {
      mistake: 'Forgetting cleanup in a lazy iterator over external resources.',
      why: 'Early break does not run cleanup unless return() (or a generator finally) is implemented.',
      fix: 'Implement return() / use a generator with try...finally to release resources on early exit.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'v-for accepts iterables; custom iterable data structures render directly. Composables can return generators for lazy sequences, and reactive Maps/Sets iterate via the protocol.' },
    { area: 'React', detail: 'Rendering maps over arrays, but any iterable can be turned into an array via spread/Array.from before mapping. Async iterables back streaming data hooks and suspense-style incremental loading.' },
    { area: 'Node.js', detail: 'Streams are async iterables — for await...of reads chunks with natural backpressure. Readline, database cursors, and paginated SDKs expose async iterators to process large data lazily.' },
    { area: 'Backend', detail: 'Database cursors and message queues are consumed as (async) iterables to process unbounded data without buffering everything in memory; generators model pipelines stage by stage.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy iteration (generators) processes one item at a time, enabling O(1) memory over huge or infinite sequences.',
      'Async iterables give natural backpressure so producers do not overwhelm consumers.',
    ],
    bad: [
      'Each next() call has function-call overhead; tight numeric loops are faster with a plain indexed for loop.',
      'Wrapping arrays in custom iterators/generators adds allocation versus direct array methods.',
    ],
    optimizations: [
      'Use indexed for loops for hot numeric paths; reserve iterators for laziness and composability.',
      'Use generators/async iterables to avoid materializing large intermediate collections.',
      'Implement return()/finally so early exits release resources promptly.',
      'Avoid re-spreading the same iterable repeatedly; materialize once if you iterate multiple times.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['symbol', 'array-methods', 'object-creation', 'data-types'],
    nextConcepts: ['generators', 'set-operations', 'map-vs-object', 'destructuring', 'default-rest-spread'],
    dependencyNote:
      'The protocols rely on Symbol (Symbol.iterator) and underpin array-like iteration; mastering them leads directly into generators (the easiest way to author iterators), spread/destructuring, and the collection types that implement them.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes: ITERABLE with [Symbol.iterator]() and ITERATOR with next() -> {value, done}.',
      'Draw an arrow: iterable[Symbol.iterator]() PRODUCES an iterator.',
      'Write the for...of loop steps: get iterator, call next, use value while !done, stop when done.',
      'Add the early-exit arrow to it.return() for cleanup.',
      'List which built-ins are iterable (array, string, Map, Set) and note {} is not.',
      'Conclude: implement [Symbol.iterator] (often as a generator) to make anything iterable.',
    ],
    diagram: `   iterable[Symbol.iterator]()  ==>  iterator
                                        │ next()
                                        ▼
                                   { value, done }
   for..of:  it=get(); while(!(r=it.next()).done){ use r.value }
   break/throw  ->  it.return?.()   (cleanup)
   iterable: Array String Map Set   |   NOT: plain {} `,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Two protocols power all iteration. An iterable has [Symbol.iterator]() that returns an iterator; an iterator has next() returning { value, done }. for...of, spread, destructuring, and Array.from all call [Symbol.iterator]() then next() until done. Arrays, strings, Maps, and Sets are iterable; plain objects are not. You make custom objects iterable by adding [Symbol.iterator] (easiest via a generator). The async variant uses [Symbol.asyncIterator] + for await...of for streams and paginated data, and early exit triggers return() for cleanup.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'JavaScript iteration is built on two cooperating protocols. The iterator protocol says an iterator is any object with a next() method that returns an object shaped like { value, done }, where done is a boolean. The iterable protocol says an object is iterable if it has a method keyed by the well-known Symbol.iterator that returns such an iterator. The reason this matters is uniformity: for...of, the spread operator, array and parameter destructuring, Array.from, yield*, and Promise.all all consume the iterable protocol the same way — they call [Symbol.iterator]() once to get an iterator, then call next() repeatedly, using each value until done becomes true. That is why arrays, strings, Maps, and Sets all just work with these constructs, while a plain object does not, because it has no Symbol.iterator. To make my own type iterable, I add a [Symbol.iterator] method, and the easiest way is to implement it as a generator, since a generator returns an object that is both an iterator and iterable. Generators also unlock laziness: I can represent an infinite sequence and only pull the values I need, which keeps memory constant. There is also an async version — [Symbol.asyncIterator] with next() returning a promise, consumed by for await...of — which is how Node streams and paginated APIs let me process unbounded data with backpressure. One subtle but important detail is the closing protocol: when a loop exits early via break or throw, it calls the iterator\'s optional return() method, so generators run their finally blocks and resources like file handles or requests get released.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Lazy iterators give memory efficiency and composability but add per-next() call overhead versus indexed loops.',
      'Custom iterators/generators integrate with native syntax but are harder to debug than plain arrays.',
      'Async iterables give clean backpressure but serialize processing; for max throughput you may need bounded concurrency instead.',
    ],
    edgeCases: [
      'Iterators are single-use; reusing an exhausted one silently does nothing.',
      'Most built-in iterators return themselves from [Symbol.iterator], so passing an iterator where an iterable is expected works — but only once.',
      'Early break must trigger return() for cleanup; a hand-written iterator without return() leaks resources.',
      'Spreading an infinite generator hangs; you must bound it (take/limit).',
    ],
    runtimeBehavior: [
      'Iterator state lives in the iterator object, so independent iterations do not interfere.',
      'Generators pause at yield and resume on next(), preserving local state across calls.',
      'Async iterators sequence awaits so the consumer controls the pull rate (backpressure).',
    ],
    scalability: [
      'Lazy/async iteration scales to unbounded streams (logs, cursors, queues) without buffering everything.',
      'Pipelines of generators compose stages with constant memory between them.',
    ],
    productionConcerns: [
      'Always implement cleanup (return()/finally) for iterators over external resources.',
      'Beware single-use iterators passed around as if reusable.',
      'For high-throughput streams, combine async iteration with bounded concurrency rather than strict one-at-a-time processing.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Iterable: has [Symbol.iterator]() -> iterator.',
    'Iterator: has next() -> { value, done }.',
    'for...of / spread / destructuring / Array.from all consume iterables.',
    'Iterable built-ins: Array, String, Map, Set, arguments, NodeList.',
    'Plain {} is NOT iterable — use Object.entries/keys/values.',
    'Iterators are single-use and stateful.',
    'Make iterable easily with a generator method.',
    'yield* delegates to another iterable.',
    'Async: [Symbol.asyncIterator] + for await...of (streams, pagination).',
    'Early exit -> iterator.return() for cleanup (generator finally).',
    'Most built-in iterators return themselves from [Symbol.iterator].',
    'Lazy generators = O(1) memory over huge/infinite sequences.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Manually iterate the string "hi" using its iterator and log each character and the done flag.',
      hint: 'Strings are iterable; get the iterator and call next().',
      solution: {
        lang: 'js',
        code: `const it = 'hi'[Symbol.iterator]()\nconsole.log(it.next()) // { value: 'h', done: false }\nconsole.log(it.next()) // { value: 'i', done: false }\nconsole.log(it.next()) // { value: undefined, done: true }`,
        explanation: [
          'Strings implement the iterable protocol, yielding code points one at a time.',
          'Each next() advances the cursor and reports done.',
          'After the last character, done becomes true with value undefined.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make a Range object with start/end iterable so [...new Range(1,3)] returns [1,2,3]. Use a generator method.',
      hint: 'Define [Symbol.iterator]() as a generator that yields from start to end.',
      solution: {
        lang: 'js',
        code: `class Range {\n  constructor(start, end) {\n    this.start = start\n    this.end = end\n  }\n  *[Symbol.iterator]() {\n    for (let i = this.start; i <= this.end; i++) yield i\n  }\n}\nconsole.log([...new Range(1, 3)]) // [1, 2, 3]`,
        explanation: [
          'A generator method (*[Symbol.iterator]) returns an iterator automatically.',
          'yield emits each value; the for loop bounds the sequence.',
          'Because Range is now iterable, spread and for...of work on instances directly.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a generic zip(a, b) that yields pairs [a[i], b[i]] from two iterables until the shorter ends.',
      hint: 'Get both iterators and call next() in lockstep.',
      solution: {
        lang: 'js',
        code: `function* zip(a, b) {\n  const ia = a[Symbol.iterator]()\n  const ib = b[Symbol.iterator]()\n  while (true) {\n    const ra = ia.next()\n    const rb = ib.next()\n    if (ra.done || rb.done) return\n    yield [ra.value, rb.value]\n  }\n}\nconsole.log([...zip([1, 2, 3], ['a', 'b'])]) // [[1,'a'],[2,'b']]`,
        explanation: [
          'We obtain an iterator from each iterable so zip works on any iterable, not just arrays.',
          'We pull from both in lockstep and stop when either is done.',
          'Being a generator, zip itself is lazy and iterable, so it composes with spread/for...of.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement an iterator with cleanup: a takeLines generator over an array of lines that runs a cleanup() in finally even if the consumer breaks early.',
      hint: 'Wrap the yield loop in try...finally; the closing protocol triggers finally on early break.',
      solution: {
        lang: 'js',
        code: `function* takeLines(lines, cleanup) {\n  try {\n    for (const line of lines) {\n      yield line\n    }\n  } finally {\n    cleanup() // runs on normal end AND on early break/throw\n  }\n}\n\nconst gen = takeLines(['a', 'b', 'c'], () => console.log('closed'))\nfor (const line of gen) {\n  console.log(line)\n  if (line === 'b') break // triggers finally -> 'closed'\n}`,
        explanation: [
          'The generator wraps iteration in try...finally.',
          'When the for...of loop breaks early, it calls the generator\'s return(), which runs the finally block.',
          'This is the closing protocol in action — guaranteeing resource cleanup even on early exit.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'The iteration protocols are the unifying mechanism behind for...of, spread, destructuring, generators, and async streams. Understanding them turns a pile of disconnected syntax into one coherent model and unlocks lazy evaluation and streaming — clear senior-level signals.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely go beyond "what is for...of". Product companies (Zoho, Flipkart, Razorpay) ask you to make an object iterable or implement a range/zip. FAANG-level interviews probe the next()/done contract, the closing protocol, sync vs async iteration, and lazy generators over infinite sequences.',
    whatInterviewersExpect:
      'They expect you to clearly distinguish iterable from iterator, explain how for...of drives next() until done, implement [Symbol.iterator] (ideally via a generator), and discuss async iteration and resource cleanup for senior-level depth.',
  },
}

export default iterablesIterators
