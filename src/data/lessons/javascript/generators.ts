import type { ConceptLesson } from '../../../types/lesson'

const generators: ConceptLesson = {
  // 1. Concept Summary
  slug: 'generators',
  name: 'Generators',
  category: 'functions',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Generators let a function pause and resume, producing a sequence of values lazily — only computing the next one when asked.',
    'They make infinite or huge sequences (ID streams, paginated APIs, ranges) memory-efficient because values are produced on demand.',
    'They are the foundation of custom iterables/iterators and historically powered async control flow (redux-saga, co) before async/await.',
    'Interviewers use them to test understanding of lazy evaluation, the iterator protocol, and two-way communication via yield.',
    'Without generators you must precompute whole collections or hand-build iterator objects with next()/done bookkeeping.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A generator is a Pez candy dispenser: it gives you one candy each time you press it, and it pauses in between — it does not dump them all at once.',
    story: [
      'Imagine a Pez dispenser full of candies. You do not get all the candy at once.',
      'Each time you press the top, exactly one candy pops out, and then it waits.',
      'It remembers how many are left and where it is, so the next press gives you the next candy.',
      'A generator function is just like that: each time you ask for the next value, it runs a little, hands you ONE value, and then pauses — remembering exactly where it stopped so it can continue later from that spot.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal function runs from start to finish in one go and gives back one answer.',
    'A generator function (written with function*) can pause in the middle using the keyword yield, hand back a value, and then continue from that exact point next time you ask.',
    'You get values one at a time by calling .next() on the generator, which returns the next yielded value and whether it is done.',
    'This is useful when you want values produced lazily — one when you need it — instead of building a whole list up front.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A generator is a special function (declared with function*) that can pause at yield expressions and resume later, producing a sequence of values lazily. Calling it returns a generator object that conforms to the iterator protocol (has a next() method) and is also iterable.',
    how: 'Inside the function you use yield to emit a value and suspend execution; calling .next() resumes until the next yield (or the end), returning { value, done }. Because it is iterable, you can use for...of, spread, and destructuring on it.',
    why: 'It lets you produce values on demand — ideal for infinite sequences, lazy pipelines, and custom iterables — without precomputing or manually managing iterator state.',
    code: {
      label: 'A basic generator',
      lang: 'js',
      code: `function* countUp() {\n  yield 1            // pause here, hand back 1\n  yield 2            // resume here next time, hand back 2\n  yield 3\n}\nconst gen = countUp()\ngen.next() // { value: 1, done: false }\ngen.next() // { value: 2, done: false }\ngen.next() // { value: 3, done: false }\ngen.next() // { value: undefined, done: true }\n\n[...countUp()] // [1, 2, 3]  — it is iterable`,
      explanation: [
        'function* declares a generator; calling it does NOT run the body, it returns a generator object.',
        'Each .next() runs until the next yield and returns { value, done }.',
        'After the last yield, done becomes true and value is undefined.',
        'Because generators are iterable, spread and for...of work directly.',
        'Execution is paused between calls — state is preserved automatically.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A generator is a function declared with function* that returns a generator object implementing both the iterator protocol (a next(value) method returning { value, done }) and the iterable protocol (Symbol.iterator returning itself). Execution is suspended at each yield expression and resumed on the next next() call, preserving the entire local execution state (variables, position) on the heap. yield can also receive a value passed into next(), enabling two-way communication; yield* delegates to another iterable; and return/throw can finalize or inject an error. Generators enable lazy evaluation, custom iterables, and were the substrate for early coroutine-style async control flow.',

  // 7. Internal Working
  internalWorking: [
    'Calling a generator function does not execute its body; it creates and returns a generator object with its execution context suspended at the top.',
    'The first next() runs the body until the first yield, returns { value: yielded, done: false }, and suspends — saving all local state.',
    'Each subsequent next(arg) resumes right after the last yield; the arg becomes the value of that yield expression, enabling input into the generator.',
    'When execution reaches a return or the end, next() returns { value: returnValue, done: true } and the generator is exhausted.',
    'Because the generator can be suspended indefinitely, its local variables live on the heap (not a transient stack frame) for as long as the generator object is reachable.',
    'yield* delegates iteration to another iterable/generator, forwarding values and the final return value; gen.throw() injects an exception at the suspension point, and gen.return() finalizes early (running finally blocks).',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  function* g(){ yield A; yield B; return C }

  call g() ─► generator object (suspended at top)
     │ next() ─► runs to yield A ─► {value:A, done:false}  (PAUSE)
     │ next() ─► resumes, runs to yield B ─► {value:B, done:false} (PAUSE)
     │ next() ─► resumes, hits return ─► {value:C, done:true}
     └ next() ─► {value:undefined, done:true}  (exhausted)

  yield = bookmark; state is saved between calls.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'HEAP: the generator object and its suspended execution state (locals, instruction pointer) live on the heap, since it must survive between next() calls.',
    'LAZY: values are produced one at a time, so an infinite or huge sequence never materializes fully in memory.',
    'REFERENCE: as long as you hold the generator object, its saved state is retained; dropping the reference makes it collectable.',
    'CONTRAST: returning a full array allocates all values at once; a generator allocates essentially one value at a time.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — a bounded range generator',
      lang: 'js',
      code: `function* range(start, end, step = 1) {\n  for (let i = start; i < end; i += step) {\n    yield i\n  }\n}\nfor (const n of range(0, 5)) console.log(n) // 0 1 2 3 4\n[...range(0, 10, 2)] // [0, 2, 4, 6, 8]`,
      explanation: [
        'yield inside a loop emits each value lazily.',
        'for...of drives the generator, calling next() until done.',
        'No array is built until you spread it; iteration is on demand.',
        'This is a clean, reusable lazy range without precomputing.',
      ],
    },
    intermediate: {
      label: 'Intermediate — an infinite ID generator (lazy)',
      lang: 'js',
      code: `function* idMaker() {\n  let id = 1\n  while (true) {        // infinite — safe because it is lazy\n    yield id++\n  }\n}\nconst ids = idMaker()\nids.next().value // 1\nids.next().value // 2\nids.next().value // 3`,
      explanation: [
        'An infinite while(true) loop is fine because values are produced only on demand.',
        'Each next() advances the saved state (id) by one.',
        'You never compute "all" IDs — you pull as many as you need.',
        'This is impossible to express as a plain returned array.',
      ],
    },
    advanced: {
      label: 'Advanced — two-way communication and yield*',
      lang: 'js',
      code: `function* conversation() {\n  const name = yield 'What is your name?'   // next(value) supplies name\n  const color = yield \`Hi \${name}, favorite color?\`\n  return \`\${name} likes \${color}\`\n}\nconst c = conversation()\nc.next()            // { value: 'What is your name?', done: false }\nc.next('Ada')       // { value: 'Hi Ada, favorite color?', done: false }\nc.next('blue')      // { value: 'Ada likes blue', done: true }\n\nfunction* both() { yield* [1, 2]; yield* [3, 4] }  // delegation\n[...both()] // [1, 2, 3, 4]`,
      explanation: [
        'yield is an expression: the value passed to next() becomes its result, enabling input.',
        'The first next() runs to the first yield; later next(value) calls feed data back in.',
        'yield* delegates to another iterable, flattening its values into this generator.',
        'This two-way channel is why generators powered coroutine-style async libraries.',
      ],
    },
    realProject: {
      label: 'Real project — lazily paginate an API in Node',
      lang: 'js',
      code: `async function* fetchAllPages(url) {\n  let next = url\n  while (next) {\n    const res = await fetch(next)\n    const page = await res.json()\n    for (const item of page.items) yield item   // emit one item at a time\n    next = page.nextUrl                          // null ends the loop\n  }\n}\n\n// for await (const item of fetchAllPages('/api/items')) process(item)`,
      explanation: [
        'An async generator (async function*) yields items as pages arrive.',
        'Consumers use for await...of to process items lazily without buffering all pages.',
        'Memory stays low even for huge paginated datasets.',
        'This is a common pattern for streaming/cursoring through APIs and databases.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a generator and how do you create one?',
      answer: 'A function declared with function* that can pause at yield and resume later, producing values lazily. Calling it returns a generator object whose next() runs until the next yield.',
      explanation: 'A good answer names function*, yield, pause/resume, and the returned generator object.',
    },
    {
      level: 'beginner',
      question: 'What does calling a generator function return?',
      answer: 'It returns a generator object (an iterator that is also iterable); the body does not run until you call next() or iterate it.',
      explanation: 'A common gotcha — calling it does not execute the body immediately.',
    },
    {
      level: 'intermediate',
      question: 'How do generators relate to the iterator protocol?',
      answer: 'A generator object implements the iterator protocol via next() returning { value, done }, and the iterable protocol via Symbol.iterator returning itself, so it works with for...of, spread, and destructuring.',
      explanation: 'Tests understanding that generators are a convenient way to make iterables.',
    },
    {
      level: 'intermediate',
      question: 'What is yield* and when is it useful?',
      answer: 'yield* delegates iteration to another iterable or generator, yielding all its values and capturing its return value — useful for composing generators or flattening sequences.',
      explanation: 'Shows knowledge beyond basic yield.',
    },
    {
      level: 'advanced',
      question: 'How can generators communicate two ways?',
      answer: 'yield is an expression: the value passed to gen.next(value) becomes the result of the paused yield. This lets the consumer feed data back into the generator, the basis of coroutine-style control flow.',
      explanation: 'The two-way channel is a senior-leaning insight many candidates miss.',
    },
    {
      level: 'senior',
      question: 'When would you use generators versus async/await or plain arrays in production?',
      answer: 'Use generators for lazy/infinite sequences, streaming large data, and custom iterables; use async generators (for await...of) for paginated/streamed async sources. Prefer async/await for ordinary async flow — generators-as-async (co/saga) are largely superseded except where you need cancellation/effect interception (redux-saga).',
      explanation: 'Senior signal: knowing the right tool and that generator-based async is mostly legacy now.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you make an object iterable using a generator and Symbol.iterator?',
    'What is the difference between an iterable and an iterator?',
    'How do async generators and for await...of work?',
    'What do gen.return() and gen.throw() do?',
    'Why were generators used for async control flow before async/await?',
    'How do generators help process infinite or very large sequences?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting the generator body to run when you call the function.',
      why: 'Calling g() only creates the generator object; nothing runs until next()/iteration.',
      fix: 'Drive it with next(), for...of, or spread to actually execute the body.',
    },
    {
      mistake: 'Spreading or for...of-ing an infinite generator.',
      why: 'It never reaches done, so it loops forever and hangs (or runs out of memory).',
      fix: 'Take a bounded slice (e.g. a take(n) helper) before materializing.',
    },
    {
      mistake: 'Confusing the value supplied to the first next() with input.',
      why: 'The first next() runs to the first yield; any argument to it is ignored.',
      fix: 'Send input on the SECOND and later next(value) calls, after the first yield is reached.',
    },
    {
      mistake: 'Forgetting to handle cleanup (finally) when a consumer stops early.',
      why: 'Breaking out of a for...of calls gen.return(), which runs finally — but manual loops may skip cleanup.',
      fix: 'Put resource cleanup in a finally block so early termination still releases resources.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Less common in components, but generators back custom iterables used in utilities, and Vue 2 used a generator-friendly reactivity flow in some tooling; mostly used in shared JS utilities.' },
    { area: 'React', detail: 'redux-saga uses generators to model side effects as yielded "effects" that the middleware interprets, enabling cancellation and testability of async flows.' },
    { area: 'Node.js', detail: 'Async generators stream paginated APIs, database cursors, and file/line processing with for await...of, keeping memory bounded over large datasets.' },
    { area: 'Backend', detail: 'Lazy data pipelines and ETL over huge sources; producing IDs/tokens; implementing custom iterables for domain collections.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Lazy production avoids allocating entire collections, keeping memory bounded for huge/infinite sequences.',
      'Streaming with async generators processes data incrementally instead of buffering everything.',
    ],
    bad: [
      'Per-yield resumption has overhead; for small tight numeric loops a plain loop/array is faster.',
      'Suspended generator state lives on the heap and is kept alive while the generator object is referenced.',
    ],
    optimizations: [
      'Use generators for laziness/streaming, not for hot inner numeric loops where arrays win.',
      'Provide bounded consumers (take/limit) so infinite generators terminate.',
      'Prefer async generators for I/O streaming to avoid buffering large payloads.',
      'Release generator references when done so their saved state is collected.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['iterables-iterators', 'closure', 'function-declaration-vs-expression', 'scope'],
    nextConcepts: ['async-await', 'top-level-await', 'array-methods', 'function-composition'],
    dependencyNote:
      'Generators build on the iterator/iterable protocols and on closures (saved local state). They are a stepping stone to async iteration (for await...of) and were the historical foundation for async/await-style control flow.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write function* g(){ yield A; yield B } and note calling it returns a paused generator.',
      'Draw a timeline with PAUSE markers at each yield.',
      'Show next() advancing to the next yield and returning { value, done }.',
      'Add an arrow for next(value) feeding input back into a yield expression.',
      'Say: "A generator pauses at yield and resumes on next(), producing values lazily. It implements the iterator protocol, so for...of and spread work, and yield is two-way — next(value) feeds data back in."',
    ],
    diagram: `  g() ─► [paused]
   next() → ...yield A... → {A,false} [pause]
   next() → ...yield B... → {B,false} [pause]
   next() → end/return    → {C,true}
  yield = bookmark; state saved on the heap`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A generator (function*) can pause at yield and resume on next(), producing values lazily one at a time. Calling it returns a generator object that is both an iterator (next() → {value, done}) and iterable (works with for...of/spread). yield is two-way: next(value) feeds data back in; yield* delegates to another iterable. Generators shine for infinite/huge/streamed sequences and custom iterables; async generators stream I/O via for await...of. They powered pre-async/await control flow (co, redux-saga).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A generator is a special function declared with function* that can pause its execution at yield expressions and resume later, producing a sequence of values lazily. The key behaviors: calling a generator function does not run its body — it returns a generator object whose execution is suspended at the top. Each call to next() resumes execution until the next yield, returning an object { value, done }; when the function returns or ends, done becomes true. Because the generator object implements both the iterator protocol (next) and the iterable protocol (Symbol.iterator returning itself), you can drive it with for...of, spread, and destructuring. Two things make generators powerful. First, laziness: values are produced only when requested, so you can model infinite sequences like an ID stream with while(true), or stream a huge dataset, without ever materializing it all in memory. Second, two-way communication: yield is an expression, and the value you pass to next(value) becomes the result of the paused yield, which lets the consumer feed data back into the generator — that is exactly what coroutine-style async libraries like co and redux-saga used before async/await existed. There is also yield* for delegating to another iterable, and gen.return()/gen.throw() for finalizing or injecting errors, with finally blocks running on early termination. In modern code I reach for generators for lazy or infinite sequences, custom iterables, and streaming — and async generators with for await...of for paginated or streamed I/O — while using plain async/await for ordinary asynchronous flow.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Laziness and bounded memory vs per-yield resumption overhead — generators lose to plain arrays/loops in tight hot paths.',
      'Generator-based async (saga/co) gives cancellation and effect interception but is more complex than async/await.',
    ],
    edgeCases: [
      'The argument to the first next() is discarded; input begins on the second next().',
      'Spreading/iterating an infinite generator hangs — consumers must bound it.',
      'Early loop break triggers gen.return() and runs finally; manual consumers may skip cleanup.',
      'Throwing into a generator (gen.throw()) raises at the current yield, where it can be caught.',
    ],
    runtimeBehavior: [
      'Suspended local state lives on the heap and persists while the generator object is reachable.',
      'next/throw/return are the three ways to resume; each advances or finalizes the saved state.',
      'Async generators interleave await and yield; for await...of awaits each produced promise.',
    ],
    scalability: [
      'Streaming with async generators keeps memory bounded over arbitrarily large sources (DB cursors, paginated APIs).',
      'Backpressure is implicit: the consumer pulls the next value, so production matches consumption rate.',
    ],
    productionConcerns: [
      'Ensure finally-based cleanup so early termination releases connections/handles.',
      'Avoid generators in performance-critical numeric loops; reserve them for laziness and streaming.',
      'Generator-based async control flow is largely legacy; prefer async/await unless you need saga-style effects.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'function* + yield = pausable function producing values lazily.',
    'Calling it returns a generator object; body runs on next()/iteration.',
    'next() → { value, done }; done true when finished.',
    'Generator object is both iterator and iterable (for...of, spread).',
    'yield is two-way: next(value) supplies the yield result.',
    'First next() argument is ignored; send input from the 2nd onward.',
    'yield* delegates to another iterable/generator.',
    'gen.return()/gen.throw() finalize or inject errors; finally runs.',
    'Great for infinite/huge/streamed sequences and custom iterables.',
    'async function* + for await...of streams async data with bounded memory.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a generator range(n) that yields 0..n-1.',
      hint: 'Loop and yield each index.',
      solution: {
        lang: 'js',
        code: `function* range(n) {\n  for (let i = 0; i < n; i++) yield i\n}\n[...range(4)] // [0, 1, 2, 3]`,
        explanation: ['yield emits each value lazily inside the loop.', 'Spreading drives next() until done.'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Make a plain object iterable using a generator as [Symbol.iterator].',
      hint: 'Define a *[Symbol.iterator]() method that yields the values.',
      solution: {
        lang: 'js',
        code: `const collection = {\n  items: ['a', 'b', 'c'],\n  *[Symbol.iterator]() {\n    for (const item of this.items) yield item\n  },\n}\n[...collection] // ['a', 'b', 'c']\nfor (const x of collection) console.log(x)`,
        explanation: ['A generator method satisfies the iterable protocol.', 'Now for...of and spread work on the object directly.'],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write take(gen, n) that yields only the first n values from a (possibly infinite) generator.',
      hint: 'Iterate and stop after n values.',
      solution: {
        lang: 'js',
        code: `function* take(iterable, n) {\n  let count = 0\n  for (const value of iterable) {\n    if (count++ >= n) return\n    yield value\n  }\n}\nfunction* naturals() { let i = 1; while (true) yield i++ }\n[...take(naturals(), 5)] // [1, 2, 3, 4, 5]`,
        explanation: [
          'take bounds an infinite generator so it terminates.',
          'It yields values until the count reaches n, then returns.',
          'This is how you safely consume infinite lazy sequences.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement an async generator that yields lines from an array of "pages" fetched lazily, simulating pagination.',
      hint: 'async function*; await each page, then yield its items one at a time.',
      solution: {
        lang: 'js',
        code: `const fakeFetch = (page) =>\n  Promise.resolve(page < 3 ? { items: [page * 10, page * 10 + 1], next: page + 1 } : null)\n\nasync function* paginate() {\n  let page = 0\n  while (true) {\n    const res = await fakeFetch(page)\n    if (!res) return\n    for (const item of res.items) yield item\n    page = res.next\n  }\n}\n// for await (const x of paginate()) console.log(x) → 0,1,10,11,20,21`,
        explanation: [
          'async function* combines await (for I/O) with yield (for lazy emission).',
          'Each page is fetched only when the consumer asks for more items.',
          'for await...of drives it, keeping memory bounded regardless of total pages.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Generators tie together iteration, laziness, and coroutine-style control flow — concepts that make you fluent with the iterator protocol, streaming, and the history behind async/await. They are a strong "I understand the language deeply" signal.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) rarely go deep — they ask what function*/yield do. Product companies (Zoho, Flipkart, Razorpay) ask you to write a range/infinite generator or make an object iterable. FAANG-level interviews probe lazy evaluation, two-way yield, async generators, and when to choose generators over async/await or arrays.',
    whatInterviewersExpect:
      'They expect you to explain function*/yield, that calling returns a paused generator object, the iterator/iterable connection, laziness for infinite sequences, two-way communication via next(value), and practical uses like streaming and custom iterables.',
  },
}

export default generators
