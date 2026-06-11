import type { ConceptLesson } from '../../../types/lesson'

const setOperations: ConceptLesson = {
  // 1. Concept Summary
  slug: 'set-operations',
  name: 'Set',
  category: 'iteration-collections',
  difficulty: 'intermediate',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Set is the right tool for uniqueness and fast membership — it turns O(n) includes checks into O(1) has checks, which fixes accidental O(n^2) algorithms.',
    'Deduplication, "have I seen this before?", and presence tracking are everyday tasks that Set solves in one line where arrays are clumsy and slow.',
    'Set-theory operations (union, intersection, difference) model real problems: shared tags, permission overlaps, diffing selections.',
    'Interviewers use Set to test whether you can spot a membership/uniqueness problem and reach for the O(1) structure instead of nested loops.',
    'Modern engines (and the new Set methods like intersection/union) make Set a first-class collection worth knowing well.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Set is a sticker collection where you are only allowed ONE of each sticker.',
    story: [
      'Imagine you collect stickers, but you have a special album with a strict rule: you can never have two of the same sticker.',
      'Every time you try to add a sticker you already own, the album just shrugs and keeps only the one — no duplicates ever.',
      'Because each sticker has its own spot, you can instantly flip to it and check "do I have this one?" without flipping through the whole album.',
      'A Set works exactly like that album: it stores only unique things and can tell you super fast whether something is already inside.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A Set is a collection that stores only unique values — if you add the same value twice, it is kept only once.',
    'You add with set.add(value), check with set.has(value), and remove with set.delete(value); set.size tells you how many it holds.',
    'Checking membership in a Set is very fast, much faster than scanning a whole array to see if a value is there.',
    'Sets are great for removing duplicates and for math-like operations such as finding what two groups have in common (intersection) or combining them (union).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Set is a built-in collection of unique values (any type), with O(1) average add/has/delete, that preserves insertion order and is iterable. It is ideal for membership tests and deduplication.',
    how: 'Create with new Set(iterable); use add, has, delete, clear, and the size property; iterate with for...of, forEach, or spread. Convert an array to unique values with [...new Set(arr)].',
    why: 'Arrays use O(n) includes/indexOf to test membership; a Set tests in O(1), so it eliminates duplicate-detection and "seen" bugs and speeds up algorithms that would otherwise be quadratic.',
    code: {
      label: 'Dedup and fast membership',
      lang: 'js',
      code: `const nums = [1, 2, 2, 3, 3, 3]\nconst unique = [...new Set(nums)] // [1, 2, 3]\n\nconst seen = new Set()\nseen.add('a')\nconsole.log(seen.has('a')) // true (O(1))\nconsole.log(seen.has('b')) // false\nconsole.log(seen.size)     // 1`,
      explanation: [
        'new Set(nums) drops duplicates automatically; spreading it back gives a unique array.',
        'add inserts a value; adding an existing value is a no-op (still unique).',
        'has answers membership in O(1) average time, unlike array.includes which is O(n).',
        'size reports the count directly, like Map.size.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Set is a built-in keyed collection (ES2015) of unique values where uniqueness is determined by SameValueZero equality (so NaN is considered equal to NaN, and +0/-0 are the same). It maintains insertion order, offers amortized O(1) add/has/delete and an O(1) size accessor, and is iterable (values/keys/entries all yield the values). Recent ECMAScript adds set-algebra methods (union, intersection, difference, symmetricDifference, isSubsetOf, isSupersetOf, isDisjointFrom). WeakSet is the variant holding objects weakly for collectable membership tracking.',

  // 7. Internal Working
  internalWorking: [
    'A Set is backed by a hash table keyed by SameValueZero equality; each value is its own key, so lookups are amortized O(1).',
    'On add, the engine hashes the value; if an equal value already exists, nothing changes (uniqueness invariant), otherwise it inserts and records insertion order.',
    'has computes the hash and probes the table in roughly constant time, independent of size.',
    'Iteration follows recorded insertion order, yielding each unique value exactly once.',
    'Object values are stored by reference, so two distinct objects with identical contents are two different members; identity, not structural equality, decides uniqueness.',
    'A regular Set holds its members strongly (keeping objects alive); a WeakSet holds object members weakly so they can be garbage-collected.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ADD sequence: 1, 2, 2, 3, 1
        │
        ▼
   ┌───────────────────────────┐
   │  Set { 1, 2, 3 }           │  duplicates ignored
   └───────────────────────────┘
        insertion order preserved

   MEMBERSHIP:  arr.includes(x)  -> O(n) scan
                set.has(x)       -> O(1) hash probe

   SET ALGEBRA (A = {1,2,3}, B = {2,3,4})
     union        A ∪ B = {1,2,3,4}
     intersection A ∩ B = {2,3}
     difference   A \\ B = {1}
     symmetric    A △ B = {1,4}`,

  // 9. Memory Visualization
  memoryVisualization: [
    'A Set lives on the heap; a variable holds a reference to the Set object.',
    'Primitive members are stored by value in the hash table; object members are stored by reference.',
    'Holding object members strongly keeps them alive, so a long-lived Set of objects is a potential leak — WeakSet holds them weakly to allow collection.',
    'Building [...new Set(arr)] allocates a Set plus a new array; for one-off dedup this is fine, but avoid recreating it repeatedly in hot loops.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — core operations',
      lang: 'js',
      code: `const s = new Set()\ns.add(1).add(2).add(2) // chainable; 2 added once\nconsole.log(s.size)    // 2\nconsole.log(s.has(2))  // true\ns.delete(1)\nconsole.log([...s])    // [2]\ns.clear()\nconsole.log(s.size)    // 0`,
      explanation: [
        'add returns the Set, so calls are chainable; duplicate adds are ignored.',
        'has and delete are O(1); size is read directly.',
        'Spreading yields members in insertion order.',
        'clear empties the Set entirely.',
      ],
    },
    intermediate: {
      label: 'Intermediate — fixing an O(n^2) membership check',
      lang: 'js',
      code: `// Slow: includes inside a loop is O(n*m)\nfunction commonSlow(a, b) {\n  return a.filter((x) => b.includes(x))\n}\n\n// Fast: build a Set once, then O(1) lookups -> O(n+m)\nfunction commonFast(a, b) {\n  const bSet = new Set(b)\n  return a.filter((x) => bSet.has(x))\n}\n\ncommonFast([1, 2, 3], [2, 3, 4]) // [2, 3]`,
      explanation: [
        'commonSlow calls includes for every element, scanning b each time — quadratic.',
        'commonFast builds a Set of b once, turning each membership test into O(1).',
        'Total complexity drops from O(n*m) to O(n+m) — the canonical Set optimization.',
        'This pattern fixes many accidental quadratic bugs in interview and production code.',
      ],
    },
    advanced: {
      label: 'Advanced — set algebra (union/intersection/difference)',
      lang: 'js',
      code: `const A = new Set([1, 2, 3])\nconst B = new Set([2, 3, 4])\n\nconst union = new Set([...A, ...B])                 // {1,2,3,4}\nconst intersection = new Set([...A].filter((x) => B.has(x))) // {2,3}\nconst difference = new Set([...A].filter((x) => !B.has(x)))  // {1}\n\n// Modern engines also support methods directly:\n// A.union(B), A.intersection(B), A.difference(B)\nconsole.log([...union], [...intersection], [...difference])`,
      explanation: [
        'union spreads both Sets into one Set, deduplicating automatically.',
        'intersection keeps A-members that are also in B, using O(1) has.',
        'difference keeps A-members not in B.',
        'Newer ECMAScript provides built-in union/intersection/difference methods that do the same more directly.',
      ],
    },
    realProject: {
      label: 'Real project — tracking selected ids in a Vue/React UI',
      lang: 'js',
      code: `// A multi-select list: track chosen row ids in a Set\nconst selected = new Set()\n\nfunction toggle(id) {\n  if (selected.has(id)) selected.delete(id)\n  else selected.add(id)\n}\n\nfunction isSelected(id) {\n  return selected.has(id) // O(1) per row, even with thousands of rows\n}\n\n// In React/Vue you typically replace the Set to trigger reactivity:\n// setSelected(new Set(selected)) after a toggle\n`,
      explanation: [
        'A Set of ids is the natural model for multi-select: each id is present at most once.',
        'toggle adds or removes in O(1); isSelected checks in O(1), so rendering thousands of rows stays fast.',
        'In React you create a NEW Set to trigger re-render; in Vue, reactive(new Set()) tracks mutations through add/delete.',
        'An array here would force O(n) includes per row and clumsy splice removals.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Set and how do you remove duplicates from an array with it?',
      answer: 'A Set stores only unique values. To dedupe an array: [...new Set(arr)] — the Set drops duplicates and spreading converts it back to an array, preserving insertion order.',
      explanation: 'The dedupe one-liner is the most common practical use and a guaranteed talking point.',
    },
    {
      level: 'beginner',
      question: 'Which operations does a Set provide and what is their complexity?',
      answer: 'add, has, delete (all O(1) average), clear, the size property, and iteration. has is the key advantage over array.includes which is O(n).',
      explanation: 'Knowing the O(1) membership is the whole reason to choose a Set.',
    },
    {
      level: 'intermediate',
      question: 'How does a Set decide whether two values are equal?',
      answer: 'It uses SameValueZero: like ===, but NaN equals NaN and +0/-0 are treated as the same. Objects are compared by reference, so two distinct objects with the same contents are both kept.',
      explanation: 'The NaN behavior and reference-equality for objects are the gotchas interviewers like.',
    },
    {
      level: 'intermediate',
      question: 'How would you compute the intersection of two arrays efficiently?',
      answer: 'Put one array in a Set, then filter the other by set.has, giving O(n+m). Avoid nested includes which is O(n*m).',
      explanation: 'Tests the ability to convert a quadratic approach into linear using a Set.',
    },
    {
      level: 'advanced',
      question: 'Why might a Set of objects cause a memory leak, and what fixes it?',
      answer: 'A regular Set holds its members strongly, so object members cannot be garbage-collected while the Set is alive. A WeakSet holds objects weakly, letting them be collected when no other references remain — useful for tracking "seen" objects without retaining them.',
      explanation: 'Senior-leaning: strong vs weak references and the WeakSet remedy.',
    },
    {
      level: 'senior',
      question: 'Set vs array for a large, frequently-checked membership collection — what are the tradeoffs?',
      answer: 'Set gives O(1) has and add/delete and dedupes automatically, ideal for large dynamic membership. Arrays give index access, ordering by position, cheap iteration, and JSON serialization. For pure membership at scale, Set wins; for ordered, serializable, index-addressable data, arrays win. Sets also carry per-entry hash overhead.',
      explanation: 'Senior signal: weighing complexity, serialization, and memory rather than declaring one always better.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between a Set and a WeakSet?',
    'How do you intersect or union two Sets?',
    'Why does new Set([NaN, NaN]) have size 1?',
    'How do you serialize a Set to JSON?',
    'Can a Set hold objects, and how is uniqueness decided for them?',
    'How would you dedupe an array of objects by a property?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting a Set to dedupe objects by their contents.',
      why: 'Objects are compared by reference, so two structurally identical objects are both kept.',
      fix: 'Dedupe by a key with a Map keyed on the unique field, or by serializing a canonical form.',
    },
    {
      mistake: 'Calling JSON.stringify on a Set and expecting an array.',
      why: 'JSON.stringify(set) returns {} because a Set has no enumerable own properties.',
      fix: 'Convert first: JSON.stringify([...set]).',
    },
    {
      mistake: 'Rebuilding new Set(arr) inside a hot loop for repeated membership checks.',
      why: 'Each rebuild is O(n), erasing the O(1) lookup benefit.',
      fix: 'Build the Set once outside the loop and reuse it.',
    },
    {
      mistake: 'Mutating a Set in framework state and expecting re-render.',
      why: 'React compares references; mutating the same Set does not change its reference.',
      fix: 'Create a new Set (new Set(prev)) for state updates, or use Vue reactivity that tracks add/delete.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Track selected ids, expanded rows, or visited nodes in a reactive Set; mutations via add/delete are tracked by Vue 3 reactivity. Set powers O(1) per-row selection checks in large tables.' },
    { area: 'React', detail: 'Selection state and "seen" tracking use Sets, replaced with a new Set on update to trigger renders. Sets back deduplication in derived data and visited-node guards in tree/graph traversals.' },
    { area: 'Node.js', detail: 'Sets deduplicate ids, track active connections/subscriptions, and implement allow/deny lists with O(1) membership. WeakSets mark processed objects without retaining them.' },
    { area: 'Backend', detail: 'Graph and crawler code uses Sets for visited nodes to avoid cycles; rate-limiters and feature flags use Sets for fast membership against id lists.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'O(1) average has/add/delete turns quadratic membership algorithms into linear ones.',
      'Automatic deduplication avoids manual scans and keeps "seen" logic simple and fast.',
    ],
    bad: [
      'Per-entry hashing adds memory overhead versus a plain array of primitives.',
      'No index access or direct slicing; converting to an array for those costs O(n).',
    ],
    optimizations: [
      'Build the Set once and reuse it for repeated membership checks instead of rebuilding.',
      'Use a Set for visited-node tracking in traversals to avoid revisits and infinite loops.',
      'Use WeakSet when tracking objects you do not want to keep alive.',
      'For dedup-by-key on objects, use a Map keyed by the field rather than a Set.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['array-methods', 'data-types', 'primitive-vs-reference', 'equality-comparison'],
    nextConcepts: ['map-vs-object', 'weakmap-weakset', 'iterables-iterators', 'json-serialization'],
    dependencyNote:
      'Set builds on array iteration and equality semantics (SameValueZero); it pairs with Map as the other keyed collection, leads into WeakSet for weak references, and relies on the iteration protocols for spread and for...of.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labelled Set and add values 1, 2, 2, 3 — cross out the duplicate 2 to show uniqueness.',
      'Write the operations add/has/delete with "O(1)" next to them and contrast array.includes "O(n)".',
      'Show the dedupe one-liner [...new Set(arr)].',
      'Draw two overlapping circles for set algebra: union, intersection, difference.',
      'Mention WeakSet for object members that should be collectable.',
      'Conclude: reach for a Set when the problem is uniqueness or membership.',
    ],
    diagram: `   add: 1,2,2,3  ->  Set { 1, 2, 3 }   (dups ignored)

   has(x):  O(1)   vs  arr.includes(x): O(n)

      A ( 1  2  3 )      B ( 2  3  4 )
            \\   2 3   /
             intersection = {2,3}
   union={1,2,3,4}   A\\B={1}`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Set stores unique values with O(1) add/has/delete, preserves insertion order, and uses SameValueZero equality (so NaN matches NaN; objects compare by reference). Its killer use is dedup ([...new Set(arr)]) and fast membership — replacing O(n) includes with O(1) has to fix quadratic algorithms. Set algebra (union/intersection/difference) models overlaps. Use WeakSet for object members you do not want to keep alive, and remember Sets do not JSON-serialize directly (spread to an array first).',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Set is a built-in collection of unique values. Adding a value that already exists is a no-op, so it dedupes automatically, and it preserves insertion order. The API is small and fast: add, has, and delete are all amortized O(1), plus a size property and iteration. The reason I reach for it is membership. Checking whether an array contains a value with includes is O(n), so doing that inside a loop is accidentally O(n squared); converting one side to a Set turns each check into O(1) and the whole algorithm into linear time. The classic one-liner [...new Set(array)] removes duplicates while keeping order. Equality is SameValueZero, which is like triple-equals except NaN equals NaN and plus and minus zero are unified — so a Set can actually dedupe NaN. The catch is that objects are compared by reference, so two structurally identical objects are both stored; if I need to dedupe objects by a field I use a Map keyed on that field instead. Sets also support set algebra — union, intersection, difference — either by spreading and filtering with has, or with the newer built-in methods. Two production notes: a regular Set holds object members strongly, which can leak, so I use a WeakSet when I just want to track "have I seen this object" without retaining it; and Sets do not JSON-stringify directly, so I spread to an array first. In React I create a new Set to trigger re-renders, while Vue tracks add and delete reactively.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Set gives O(1) membership and auto-dedup but loses index access, positional ordering control, and direct JSON serialization.',
      'Set vs Map: Set tracks presence; Map associates a value — choose by whether you need a payload per key.',
      'WeakSet enables collectable object membership but is not iterable and has no size.',
    ],
    edgeCases: [
      'SameValueZero: NaN is dedupable, +0/-0 unify — different from strict equality.',
      'Objects dedupe by identity, not structure, surprising people expecting value equality.',
      'Iterating while adding/deleting can yield or skip values depending on timing; snapshot if you mutate during iteration.',
      'JSON.stringify(set) is {}; needs explicit array conversion and a reviver to restore.',
    ],
    runtimeBehavior: [
      'Hash-table backing gives amortized O(1) operations and maintained size.',
      'Insertion order is preserved and observable through all iterators.',
      'Object members are held strongly in Set, weakly in WeakSet (affecting GC).',
    ],
    scalability: [
      'For large, dynamic membership/visited sets, Set scales far better than array scans.',
      'For massive primitive sets, memory overhead per entry matters; typed arrays + sorting may beat a Set for some numeric workloads.',
    ],
    productionConcerns: [
      'Build the Set once; rebuilding per check defeats the purpose.',
      'Watch object-member retention in long-lived Sets; prefer WeakSet for transient tracking.',
      'For framework state, replace the Set reference (React) or use reactive Set APIs (Vue) so changes are detected.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Set = unique values, insertion order, iterable.',
    'add/has/delete: O(1) average; size is a property.',
    'Dedup array: [...new Set(arr)].',
    'Equality: SameValueZero (NaN matches NaN).',
    'Objects compared by reference, not contents.',
    'Membership: set.has(x) O(1) beats arr.includes O(n).',
    'Set algebra: union/intersection/difference (spread+filter or built-in methods).',
    'WeakSet: object members, weakly held, not iterable, no size.',
    'JSON: spread to array first ([...set]).',
    'Dedup objects by key -> use a Map, not a Set.',
    'Build the Set once; reuse for repeated checks.',
    'State updates: new Set(prev) for React reactivity.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Remove duplicates from [1, 1, 2, 3, 3, 3] and return a sorted unique array.',
      hint: 'Set to dedupe, then sort.',
      solution: {
        lang: 'js',
        code: `const arr = [1, 1, 2, 3, 3, 3]\nconst result = [...new Set(arr)].sort((a, b) => a - b)\n// [1, 2, 3]`,
        explanation: [
          'new Set drops duplicates.',
          'Spreading converts it back to an array.',
          'sort with a numeric comparator orders the unique values correctly.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write firstNonRepeating(arr) returning the first value that appears exactly once.',
      hint: 'Track seen values; a Set of duplicates helps.',
      solution: {
        lang: 'js',
        code: `function firstNonRepeating(arr) {\n  const seen = new Set()\n  const dupes = new Set()\n  for (const x of arr) {\n    if (seen.has(x)) dupes.add(x)\n    seen.add(x)\n  }\n  return arr.find((x) => !dupes.has(x))\n}\nfirstNonRepeating([2, 3, 2, 4, 3]) // 4`,
        explanation: [
          'First pass records which values are seen more than once (duplicates).',
          'Second pass uses find to return the first value not in the duplicates Set.',
          'Both Sets give O(1) membership, keeping the whole thing linear.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Compute the symmetric difference of two arrays (values in exactly one of them).',
      hint: 'Build Sets, then keep elements not present in the other.',
      solution: {
        lang: 'js',
        code: `function symmetricDifference(a, b) {\n  const setA = new Set(a)\n  const setB = new Set(b)\n  const result = []\n  for (const x of setA) if (!setB.has(x)) result.push(x)\n  for (const x of setB) if (!setA.has(x)) result.push(x)\n  return result\n}\nsymmetricDifference([1, 2, 3], [2, 3, 4]) // [1, 4]`,
        explanation: [
          'Build a Set from each array for O(1) lookups.',
          'Keep A-only values, then B-only values.',
          'The result contains values present in exactly one set — the symmetric difference.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Detect whether an array has a cycle of duplicate-free uniqueness violated: write hasDuplicate(arr) that returns true as soon as it sees a repeat, in one pass.',
      hint: 'Add to a Set and check has before adding.',
      solution: {
        lang: 'js',
        code: `function hasDuplicate(arr) {\n  const seen = new Set()\n  for (const x of arr) {\n    if (seen.has(x)) return true // repeat found, stop early\n    seen.add(x)\n  }\n  return false\n}\nhasDuplicate([1, 2, 3, 2]) // true\nhasDuplicate([1, 2, 3])    // false`,
        explanation: [
          'We check has BEFORE adding, so the first repeat returns true immediately.',
          'This is a single O(n) pass with O(1) membership checks.',
          'Compared to nested loops (O(n^2)) or sorting (O(n log n)), the Set approach is the fastest and clearest.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Set is the quiet hero of clean, fast code. Recognizing a uniqueness or membership problem and reaching for a Set instantly improves both clarity and complexity — exactly the instinct interviewers reward.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the dedupe one-liner and basic operations. Product companies (Zoho, Flipkart, Razorpay) ask for intersection/first-non-repeating/duplicate-detection using Sets. FAANG-level interviews expect Set as a default tool inside larger problems (visited sets in graph traversal) and probe SameValueZero, reference equality, and WeakSet semantics.',
    whatInterviewersExpect:
      'They expect you to know the O(1) operations, use Set to eliminate quadratic membership checks, explain SameValueZero and reference-based object uniqueness, perform set algebra, and mention WeakSet and the JSON-serialization caveat where relevant.',
  },
}

export default setOperations
