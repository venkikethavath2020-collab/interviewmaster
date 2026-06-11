import type { ConceptLesson } from '../../../types/lesson'

const concurrencyPatterns: ConceptLesson = {
  // 1. Concept Summary
  slug: 'concurrency-patterns',
  name: 'Concurrency Patterns',
  category: 'async',
  difficulty: 'senior',
  importance: 4,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Concurrency patterns are how you control HOW MANY async operations run at once — the difference between fast, stable systems and ones that crash from resource exhaustion or run needlessly slow.',
    'JavaScript is single-threaded but concurrent (interleaved async I/O); mastering patterns like pools, batching, and rate limiting is what separates senior engineers from those who just call Promise.all.',
    'Unbounded concurrency (firing thousands of requests at once) trips rate limits, exhausts connection pools and sockets, and causes cascading failures — a real production incident pattern.',
    'Interviewers use these to probe whether you understand parallel vs sequential, backpressure, deduplication, and graceful degradation at scale.',
    'These patterns power crawlers, batch importers, data pipelines, and any system that orchestrates many async tasks against limited resources.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Concurrency patterns are like the rules at a popular ice cream shop with only three servers — you do not let all 100 kids rush the counter at once; you form lines and let three be served at a time.',
    story: [
      'Imagine an ice cream shop where 100 kids show up at the same time, but there are only three people behind the counter.',
      'If all 100 kids rush forward at once, it is chaos — nobody gets served, kids get squished, and the counter might break.',
      'So the smart rule is: only let three kids order at a time, and the moment one walks away with their cone, the next kid in line steps up.',
      'Concurrency patterns are these "how many at once" rules for a computer doing many slow tasks. Sometimes you let everyone go at once, sometimes only a few, and sometimes you say "if you ask for the exact same flavor someone already ordered, just share theirs" to save work.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A computer running JavaScript does one thing at a time, but it can JUGGLE many slow tasks (like downloads) by switching between them while it waits — that is concurrency.',
    'If you start too many slow tasks at once, you can overload the network or a server, so it is often better to limit how many run simultaneously.',
    'There are common recipes: run everything in parallel (fast but risky), run one after another (safe but slow), or run a fixed number at a time (a "pool" — the balanced choice).',
    'Other handy recipes include retrying failed tasks, slowing down to respect limits (rate limiting), and not repeating identical in-flight work (deduplication).',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Concurrency patterns are reusable strategies for orchestrating multiple asynchronous operations: running them in parallel, in sequence, or with bounded concurrency (a pool), plus supporting patterns like batching, rate limiting, retries with backoff, deduplication, and racing with timeouts. They manage the tradeoff between speed and resource limits.',
    how: 'JavaScript\'s event loop lets many async operations be in flight at once. You shape that with: Promise.all (full parallel), sequential await loops (one at a time), and a concurrency-limited pool that keeps at most N running, starting the next when one finishes. Layered on top are retries (re-run failures with exponential backoff + jitter), rate limiters (cap calls per time window), timeouts (Promise.race / AbortSignal.timeout), and deduplication (share a single in-flight Promise for identical requests).',
    why: 'The right pattern keeps systems fast without overwhelming servers, sockets, memory, or rate limits — turning brittle code that crashes under load into resilient, predictable systems.',
    code: {
      label: 'Parallel vs sequential vs bounded',
      lang: 'js',
      code: `// FULL PARALLEL — fast, but unbounded load\nconst all = await Promise.all(items.map(fetchOne))\n\n// SEQUENTIAL — safe, but slow (sum of latencies)\nconst seq = []\nfor (const item of items) seq.push(await fetchOne(item))\n\n// BOUNDED POOL — at most 5 at a time (the balanced choice)\nasync function pool(items, limit, worker) {\n  const results = []\n  const executing = new Set()\n  for (const [i, item] of items.entries()) {\n    const p = Promise.resolve(worker(item)).then(r => (results[i] = r))\n    executing.add(p)\n    p.finally(() => executing.delete(p))\n    if (executing.size >= limit) await Promise.race(executing)\n  }\n  await Promise.all(executing)\n  return results\n}`,
      explanation: [
        'Promise.all starts EVERY task immediately — fastest but can overwhelm resources.',
        'The sequential loop runs one at a time; total time is the sum of all latencies.',
        'The pool keeps at most `limit` tasks running; when full it awaits the first to finish (Promise.race) before starting more.',
        'Results are stored by index so order is preserved despite out-of-order completion.',
        'The trailing Promise.all drains the last in-flight batch.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Concurrency patterns are strategies for scheduling multiple asynchronous operations on JavaScript\'s single-threaded, event-loop-driven runtime, which provides concurrency (interleaved progress of I/O-bound tasks) but not parallelism (simultaneous CPU execution, which requires Workers). Core patterns include full parallelism (Promise.all), serialization (await in a loop), and bounded concurrency via a worker pool that maintains an active set of size N and refills it as tasks settle. These compose with rate limiting (token-bucket/leaky-bucket to cap throughput), batching/chunking, retry with exponential backoff and jitter, timeouts (Promise.race or AbortSignal), request deduplication/coalescing (sharing an in-flight Promise per key), and cancellation (AbortController), trading latency, throughput, resource utilization, and resilience.',

  // 7. Internal Working
  internalWorking: [
    'JavaScript runs on a single main thread; async I/O is offloaded to the host (browser/Node), and completions are queued as macrotasks/microtasks the event loop processes one at a time — so "concurrent" means interleaved progress, not simultaneous execution.',
    'Promise.all subscribes to all promises at once; they progress concurrently as their I/O completes, but there is no throttle — every operation is started eagerly.',
    'A bounded pool tracks an active set; it starts tasks until the set reaches the limit, then awaits Promise.race(activeSet) to learn when a slot frees, and immediately starts the next pending task — keeping utilization at the cap.',
    'Rate limiters track a budget over time (e.g. tokens refilled per interval); a task waits until a token is available, smoothing bursts to a sustainable rate independent of in-flight count.',
    'Retry wrappers catch a rejection, await a backoff delay (often 2^n * base + random jitter), and re-invoke the task, capping attempts; jitter prevents synchronized retry storms.',
    'Deduplication keeps a Map from key to in-flight Promise; concurrent callers for the same key receive the same Promise, and the entry is cleared on settlement so future calls re-fetch.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `  TASKS: [t1 t2 t3 t4 t5 t6 t7 t8]   limit = 3

  time →
  slot1: [t1----][t4----][t7--]
  slot2: [t2--][t5------][t8----]
  slot3: [t3------][t6----]
         ▲ at most 3 running; a finished task frees a slot
           for the next pending task (Promise.race(active))

  Parallel(all): all 8 at once   Sequential: 1 at a time   Pool: N at a time
  + retry/backoff   + rate limit   + timeout   + dedupe   + cancel`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — chunked batching',
      lang: 'js',
      code: `// Process in fixed-size batches: parallel within a batch, sequential across batches\nasync function inBatches(items, size, worker) {\n  const results = []\n  for (let i = 0; i < items.length; i += size) {\n    const batch = items.slice(i, i + size)\n    const batchResults = await Promise.all(batch.map(worker))\n    results.push(...batchResults)\n  }\n  return results\n}\n\n// inBatches(thousandUrls, 10, fetchJson) // 10 at a time`,
      explanation: [
        'Items are sliced into chunks of `size`.',
        'Each chunk runs in parallel via Promise.all, but chunks run one after another.',
        'This caps peak concurrency at the batch size — simple backpressure.',
        'Simpler than a sliding pool, though slightly less efficient (waits for the whole batch).',
      ],
    },
    intermediate: {
      label: 'Intermediate — retry with exponential backoff + jitter',
      lang: 'js',
      code: `const delay = ms => new Promise(r => setTimeout(r, ms))\n\nasync function withRetry(fn, { retries = 4, base = 200 } = {}) {\n  let attempt = 0\n  for (;;) {\n    try {\n      return await fn()\n    } catch (err) {\n      attempt++\n      if (attempt > retries) throw err\n      const backoff = 2 ** (attempt - 1) * base\n      const jitter = Math.random() * base\n      await delay(backoff + jitter) // e.g. ~200, ~400, ~800, ~1600ms\n    }\n  }\n}`,
      explanation: [
        'On failure it waits before retrying, doubling the delay each attempt (exponential backoff).',
        'Random jitter de-synchronizes many clients so they do not all retry at the same instant.',
        'After exceeding the retry budget it rethrows the last error.',
        'This is the canonical resilience pattern for transient failures (5xx, timeouts).',
      ],
    },
    advanced: {
      label: 'Advanced — sliding-window concurrency pool',
      lang: 'js',
      code: `async function mapPool(items, limit, worker) {\n  const results = new Array(items.length)\n  let nextIndex = 0\n  async function runner() {\n    while (nextIndex < items.length) {\n      const i = nextIndex++          // claim an index\n      results[i] = await worker(items[i], i)\n    }\n  }\n  // launch N runners that pull work until none remains\n  const runners = Array.from({ length: Math.min(limit, items.length) }, runner)\n  await Promise.all(runners)\n  return results\n}\n\n// const data = await mapPool(urls, 5, fetchJson) // never more than 5 in flight`,
      explanation: [
        'A fixed number of "runner" loops pull the next unclaimed index until the list is exhausted.',
        'Because exactly `limit` runners exist, at most `limit` workers are ever in flight — a true sliding window.',
        'It refills continuously (unlike batching, which waits for a whole batch), maximizing utilization.',
        'Results are written by index, so order is preserved.',
        'This is the shape used by libraries like p-limit / p-map.',
      ],
    },
    realProject: {
      label: 'Real project — dedupe + cache in a Node/Vue data layer',
      lang: 'js',
      code: `const inFlight = new Map() // key -> Promise (request coalescing)\nconst cache = new Map()    // key -> resolved value\n\nasync function getResource(key, signal) {\n  if (cache.has(key)) return cache.get(key)\n  if (inFlight.has(key)) return inFlight.get(key) // share the in-flight request\n\n  const promise = fetch('/api/' + key, { signal })\n    .then(r => {\n      if (!r.ok) throw new Error('HTTP ' + r.status)\n      return r.json()\n    })\n    .then(data => {\n      cache.set(key, data)\n      return data\n    })\n    .finally(() => inFlight.delete(key)) // clear on settle\n\n  inFlight.set(key, promise)\n  return promise\n}`,
      explanation: [
        'Concurrent callers for the SAME key share one in-flight Promise (request coalescing/deduplication).',
        'A resolved value is cached so future calls skip the network entirely.',
        'The inFlight entry is cleared on settle so failures can be retried later.',
        'This is the core of SWR/React Query/Pinia caching layers — dedupe + cache.',
        'The optional signal lets callers cancel via AbortController.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'Is JavaScript concurrent or parallel?',
      answer: 'JavaScript is concurrent but not (by default) parallel. It runs on a single main thread and interleaves async I/O via the event loop, so many operations make progress "at once", but CPU code runs one piece at a time. True parallelism requires Web Workers / worker threads.',
      explanation: 'The concurrency-vs-parallelism distinction is the foundational concept for this whole topic.',
    },
    {
      level: 'beginner',
      question: 'When would you run async tasks sequentially instead of with Promise.all?',
      answer: 'When each task depends on the previous result, when you must respect a strict order, or when you need to limit load (e.g. rate limits, fragile downstream). Promise.all is for independent tasks where parallelism is safe.',
      explanation: 'Recognizing dependency and load as reasons for serialization shows practical judgment.',
    },
    {
      level: 'intermediate',
      question: 'Why is unbounded Promise.all over thousands of items dangerous?',
      answer: 'It starts every operation at once, which can exhaust sockets/connection pools, trip server rate limits, spike memory, and cause cascading failures. You should bound concurrency with a pool (e.g. 5-20 at a time) instead.',
      explanation: 'Naming resource exhaustion and rate limits as concrete failure modes is the key insight.',
    },
    {
      level: 'intermediate',
      question: 'How do you limit concurrency to N at a time?',
      answer: 'Use a worker pool: launch N runner loops that each pull the next unclaimed task until none remain, or maintain an active set and await Promise.race on it before starting more. Libraries like p-limit/p-map implement this.',
      explanation: 'Being able to describe (and ideally code) a pool is the central senior skill here.',
    },
    {
      level: 'advanced',
      question: 'How do you prevent retry storms and the thundering-herd problem?',
      answer: 'Use exponential backoff with random jitter so clients do not retry in lockstep, cap the number of retries, add circuit breakers to stop hammering a failing dependency, and use request coalescing/deduplication so simultaneous identical requests share one call.',
      explanation: 'Mentioning jitter, circuit breakers, and coalescing demonstrates real distributed-systems awareness.',
    },
    {
      level: 'senior',
      question: 'How do you implement backpressure when producing work faster than it can be consumed?',
      answer: 'Bound concurrency with a pool so producers block (await a free slot) when the limit is reached; use queues with max sizes that reject or pause producers when full; for streams, respect the readable/writable backpressure signals (e.g. stream.write returning false, or async iterators that pause). The goal is to match production rate to consumption capacity.',
      explanation: 'Backpressure is the senior-most framing: matching producer rate to consumer capacity to avoid unbounded memory growth.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between concurrency and parallelism in JS?',
    'How would you add a per-second rate limit (token bucket) to a pool?',
    'What is a circuit breaker and when do you use one?',
    'How do you cancel all remaining tasks when one fails?',
    'How does request deduplication/coalescing work?',
    'When would you reach for Web Workers instead of async concurrency?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using unbounded Promise.all on large collections.',
      why: 'It floods the network/DB, trips rate limits, and can crash the process or downstream service.',
      fix: 'Bound concurrency with a pool (p-limit/p-map or a hand-rolled runner) sized to the downstream capacity.',
    },
    {
      mistake: 'Awaiting independent tasks sequentially in a loop.',
      why: 'It serializes work that could overlap, making total time the sum of latencies.',
      fix: 'Use a bounded pool or Promise.all for independent tasks; keep sequential only for dependent steps.',
    },
    {
      mistake: 'Retrying without backoff or jitter.',
      why: 'Immediate, synchronized retries create a thundering herd that worsens the outage.',
      fix: 'Use exponential backoff with jitter, cap retries, and add a circuit breaker.',
    },
    {
      mistake: 'Letting failures in one task abort an entire batch unintentionally.',
      why: 'Promise.all rejects on the first failure, discarding completed work.',
      fix: 'Use Promise.allSettled (or per-task try/catch) when partial success is acceptable.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'Batch importers, crawlers, and ETL jobs use bounded pools (p-limit/p-map) to avoid exhausting DB connections and to respect third-party rate limits; retries with backoff handle transient failures.' },
    { area: 'Backend', detail: 'Service orchestration uses fan-out with concurrency caps, timeouts on every external call, circuit breakers, and request coalescing to survive dependency slowdowns gracefully.' },
    { area: 'React', detail: 'React Query/SWR dedupe identical in-flight queries, cap parallel fetches, and retry with backoff — concurrency patterns built into the data layer.' },
    { area: 'Vue', detail: 'Pinia stores and composables fan out reads with Promise.all for a view, dedupe in-flight requests by key, and cancel superseded requests with AbortController on param changes.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Bounded pools maximize throughput while keeping resource usage predictable and within limits.',
      'Deduplication/coalescing and caching eliminate redundant work, cutting load and latency.',
    ],
    bad: [
      'Unbounded parallelism causes resource exhaustion, rate-limit rejections, and cascading failures.',
      'Over-serialization wastes time; too-low concurrency limits leave capacity unused.',
    ],
    optimizations: [
      'Tune the concurrency limit to the downstream bottleneck (DB connections, API rate limit), not an arbitrary number.',
      'Add timeouts and circuit breakers so a slow dependency cannot stall or amplify load.',
      'Use exponential backoff with jitter for retries to avoid synchronized storms.',
      'Offload CPU-bound work to Web Workers/worker threads so the event loop stays responsive.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Unbounded outbound concurrency can be turned into a self-inflicted or amplification DoS against your own or third-party services.',
      'Aggressive retries without limits can amplify attacks or accidental load spikes.',
    ],
    bestPractices: [
      'Cap concurrency and total request budgets; enforce timeouts on all external calls.',
      'Use circuit breakers and rate limiting to fail fast and avoid amplifying outages.',
      'Propagate cancellation (AbortController) so abandoned/abused requests stop consuming resources.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['promises', 'async-await', 'promise-combinators', 'event-loop'],
    nextConcepts: ['abortcontroller', 'event-loop-starvation', 'web-workers', 'async-error-handling'],
    dependencyNote:
      'Concurrency patterns sit at the top of the async spine, composing Promises, async/await, and the combinators. They depend on the event loop, use AbortController for cancellation, relate to event-loop-starvation, and hand off CPU-bound work to web-workers.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a queue of tasks and three "slots"; say "limit = 3".',
      'Show tasks filling the slots; when one finishes, the next pending task slides in.',
      'Contrast with Promise.all (all slots = N tasks at once) and sequential (one slot).',
      'Add annotations: retry+backoff, timeout, rate limit, dedupe.',
      'Say: "JS is concurrent not parallel; the senior move is bounding concurrency to the downstream limit and layering resilience — retries with jitter, timeouts, circuit breakers, and coalescing."',
    ],
    diagram: `  queue: [t1 t2 t3 t4 t5 t6 ...]
            │ pull next when a slot frees
            ▼
        [ slot1 ][ slot2 ][ slot3 ]   ← limit = 3 (sliding window)
            │
            ├─ retry(backoff+jitter)
            ├─ timeout(AbortSignal)
            ├─ rate-limit(tokens/sec)
            └─ dedupe(in-flight Map)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'JavaScript is concurrent (interleaved async I/O) but not parallel (one thread; use Workers for CPU). The core patterns are full parallel (Promise.all), sequential (await loop), and bounded concurrency (a pool of N runners that refill as tasks settle). Unbounded Promise.all over large sets exhausts resources and trips rate limits, so bound concurrency to the downstream limit. Layer resilience: retries with exponential backoff + jitter, timeouts (AbortSignal), rate limiting, request deduplication/coalescing, circuit breakers, and cancellation. The senior framing is backpressure — matching production rate to consumption capacity.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'First, the framing: JavaScript is concurrent but not parallel. It runs on one thread and interleaves async I/O through the event loop, so many operations make progress at once, but CPU work runs serially — true parallelism needs Web Workers. Given that, concurrency patterns are about controlling how many async operations run simultaneously. The three baselines are full parallelism with Promise.all, full serialization with an await loop, and the workhorse in between: bounded concurrency, a pool that keeps at most N tasks in flight and starts the next as soon as one finishes. The reason this matters is that an unbounded Promise.all over thousands of items will exhaust sockets and connection pools, trip rate limits, spike memory, and cause cascading failures — so you bound concurrency to the downstream bottleneck, like the database connection limit or an API\'s rate limit, rather than an arbitrary number. On top of the pool you layer resilience patterns: retries with exponential backoff and random jitter so clients don\'t retry in lockstep and create a thundering herd; timeouts using Promise.race or AbortSignal.timeout so a slow dependency can\'t stall you; rate limiting with a token bucket to cap throughput; request deduplication so simultaneous identical requests share one in-flight Promise; and circuit breakers to stop hammering a failing service. The senior-most concept tying it together is backpressure: ensuring you produce work no faster than the system can consume it, so memory and queues stay bounded.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Higher concurrency improves throughput until it saturates the bottleneck, after which it adds queueing, latency, and failure — the limit must be tuned to the downstream capacity, not maximized.',
      'Batching is simpler but less efficient (waits for the slowest in each batch); a sliding-window pool maximizes utilization at the cost of more bookkeeping.',
      'Aggressive retries improve success rates but risk amplifying load during an outage; backoff, caps, and circuit breakers trade some recovery speed for system stability.',
    ],
    edgeCases: [
      'Promise.all rejects on first failure and abandons completed work; use allSettled or per-task handling when partial success matters, and AbortController to cancel the rest.',
      'A pool must handle errors per task so one failure does not break the runner loop; decide fail-fast vs collect-errors explicitly.',
      'Deduplication must clear the in-flight entry on settle (including rejection) or it caches a permanent failure.',
      'CPU-bound work in any "concurrent" pattern still blocks the event loop — only Workers give real parallelism.',
    ],
    runtimeBehavior: [
      'Concurrency is interleaving on one thread; the event loop processes one task at a time, so a long synchronous task starves all others (event-loop starvation).',
      'Promise.race on an active set is the common mechanism to detect a freed slot in a pool.',
      'Rate limiters and backoff rely on timers (macrotasks), which are subject to the same event-loop scheduling and minimum-delay clamping.',
    ],
    scalability: [
      'Bounded concurrency plus circuit breakers and timeouts is what lets a service degrade gracefully under load instead of collapsing.',
      'Coalescing and caching cut redundant work dramatically under high read concurrency (cache stampede prevention).',
      'For very large pipelines, push work to a real queue/broker (BullMQ, SQS) with worker processes rather than holding it all in memory.',
    ],
    productionConcerns: [
      'Tune limits to the actual bottleneck and load-test; arbitrary limits either waste capacity or overload dependencies.',
      'Always pair concurrency with timeouts, retries-with-jitter, and cancellation so one slow/failing dependency cannot take down the system.',
      'Monitor in-flight counts, queue depth, and error/retry rates; unbounded growth in any of these is an early warning of missing backpressure.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'JS = concurrent (interleaved I/O), NOT parallel (use Workers for CPU).',
    'Parallel = Promise.all; Sequential = await loop; Bounded = pool of N.',
    'Unbounded Promise.all on big sets → resource exhaustion / rate limits.',
    'Pool: keep N in flight; start next when one settles (Promise.race / runner loops).',
    'Tune the limit to the downstream bottleneck, not a magic number.',
    'Retry: exponential backoff + JITTER + cap (avoid thundering herd).',
    'Timeout: Promise.race / AbortSignal.timeout.',
    'Rate limit: token bucket / leaky bucket.',
    'Dedupe: Map of key → in-flight Promise; clear on settle.',
    'Circuit breaker: stop hammering a failing dependency.',
    'Backpressure: match producer rate to consumer capacity.',
    'allSettled for partial success; AbortController to cancel the rest.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Process an array in batches of 5 (parallel within a batch, sequential across batches).',
      hint: 'Slice into chunks; Promise.all each chunk.',
      solution: {
        lang: 'js',
        code: `async function inBatches(items, size, worker) {\n  const out = []\n  for (let i = 0; i < items.length; i += size) {\n    const chunk = items.slice(i, i + size)\n    out.push(...(await Promise.all(chunk.map(worker))))\n  }\n  return out\n}\n\n// await inBatches(urls, 5, fetchJson)`,
        explanation: [
          'Each chunk of 5 runs in parallel via Promise.all.',
          'Chunks run one after another, capping peak concurrency at 5.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write withTimeout(promise, ms) that rejects with a timeout error if the promise does not settle in time.',
      hint: 'Race the promise against a delayed rejection.',
      solution: {
        lang: 'js',
        code: `function withTimeout(promise, ms) {\n  let timer\n  const timeout = new Promise((_, reject) => {\n    timer = setTimeout(() => reject(new Error('timeout')), ms)\n  })\n  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer))\n}`,
        explanation: [
          'Promise.race settles with whichever finishes first.',
          'If the timer wins, the result rejects with a timeout error.',
          'clearTimeout in finally avoids a dangling timer after a fast result.',
          'For true cancellation, pair this with AbortController on the underlying op.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement mapWithConcurrency(items, limit, worker) that runs at most `limit` workers at once and returns results in order.',
      hint: 'Launch `limit` runner loops that pull the next index.',
      solution: {
        lang: 'js',
        code: `async function mapWithConcurrency(items, limit, worker) {\n  const results = new Array(items.length)\n  let i = 0\n  async function runner() {\n    while (i < items.length) {\n      const idx = i++\n      results[idx] = await worker(items[idx], idx)\n    }\n  }\n  await Promise.all(\n    Array.from({ length: Math.min(limit, items.length) }, runner)\n  )\n  return results\n}`,
        explanation: [
          'Exactly `limit` runner loops are launched, so at most `limit` workers run at once.',
          'Each runner claims the next index and processes it until the list is exhausted.',
          'Writing by index preserves order despite out-of-order completion.',
          'This refills continuously, unlike batching — the standard p-map shape.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Implement a request deduplicator: dedupe(keyFn, fetchFn) returns a function that coalesces concurrent calls with the same key into a single in-flight request.',
      hint: 'Map of key → in-flight Promise; delete on settle.',
      solution: {
        lang: 'js',
        code: `function dedupe(keyFn, fetchFn) {\n  const inFlight = new Map()\n  return (...args) => {\n    const key = keyFn(...args)\n    if (inFlight.has(key)) return inFlight.get(key)\n    const p = Promise.resolve(fetchFn(...args)).finally(() => inFlight.delete(key))\n    inFlight.set(key, p)\n    return p\n  }\n}\n\n// const getUser = dedupe(id => id, id => fetch('/u/' + id).then(r => r.json()))\n// getUser(1); getUser(1) // only ONE network request`,
        explanation: [
          'keyFn derives a dedupe key from the arguments.',
          'If a request for that key is already in flight, the same Promise is returned to all callers.',
          'finally clears the entry on settle (success OR failure) so future calls re-fetch.',
          'This prevents cache stampedes and duplicate work under high read concurrency.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Concurrency patterns are where you prove senior-level judgment: anyone can call Promise.all, but knowing when to bound it, how to add backpressure, and how to make a system degrade gracefully under load is what distinguishes engineers who build resilient systems.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the concurrency-vs-parallelism distinction and parallel-vs-sequential. Product companies (Zoho, Flipkart, Razorpay) ask you to implement a concurrency-limited map, a timeout, and a retry-with-backoff. FAANG-level interviews probe backpressure, deduplication, circuit breakers, rate limiting, and tuning limits to the bottleneck under real load.',
    whatInterviewersExpect:
      'They expect you to explain that JS is concurrent not parallel, choose the right baseline (parallel/sequential/bounded), implement a concurrency pool, and discuss resilience layers — retries with jitter, timeouts, rate limiting, deduplication, circuit breakers — and backpressure at scale.',
  },
}

export default concurrencyPatterns
