import type { ConceptLesson } from '../../../types/lesson'

const webWorkers: ConceptLesson = {
  // 1. Concept Summary
  slug: 'web-workers',
  name: 'Web Workers',
  category: 'performance',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'Web Workers are the only way to run JavaScript in true parallel on a background thread, keeping heavy computation off the main thread so the UI stays responsive.',
    'JavaScript is single-threaded on the main thread; without workers, any long task (parsing a huge file, image processing, crypto, sorting millions of rows) freezes the page — clicks and scroll stop working.',
    'Interviewers ask them to test whether you understand the single-threaded model, the message-passing concurrency model (no shared mutable state by default), and when offloading is worth the cost.',
    'They power real features: spreadsheet recalculation, in-browser code editors, video/image filters, encryption, and data crunching in analytics dashboards.',
    'Getting them wrong (expecting DOM access, sending huge data by copy, leaking workers) causes errors, slow message passing, and memory bloat in production.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A Web Worker is like hiring a helper in another room: you slide notes under the door to give them work, and they slide finished work back.',
    story: [
      'Imagine you are at the front desk taking customers, but someone also asks you to count a giant jar of coins. If you stop to count, the line of customers freezes.',
      'So you hire a helper and put them in a back room. You slide the jar and a note saying "count these" under the door.',
      'You keep serving customers while the helper counts. When they finish, they slide a note back: "There are 4,213 coins."',
      'The helper cannot reach out and touch your front desk (the page) directly — they only communicate by passing notes (messages). A Web Worker is that back-room helper doing the heavy counting so your desk never freezes.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A web page runs its JavaScript on one main thread, which also handles clicks, scrolling, and drawing. If that thread is busy doing a big calculation, the page freezes.',
    'A Web Worker runs JavaScript on a separate background thread, so heavy work can happen there while the main thread stays free for the user.',
    'The worker and the page cannot share variables directly; they talk by sending messages with postMessage and listening with onmessage.',
    'A worker also cannot touch the page (no DOM) — it just computes and sends results back, which the main thread then uses to update the screen.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A Web Worker is a script that runs on a separate OS thread, parallel to the main thread, communicating via asynchronous message passing (postMessage/onmessage). It has no access to the DOM or window, but can do computation, fetch, and use many Web APIs.',
    how: 'You create one with new Worker("worker.js"). The page posts messages to it; the worker listens with self.onmessage, does work, and posts results back. Data is copied (structured clone) between threads unless you use transferable objects or SharedArrayBuffer.',
    why: 'It moves CPU-heavy work off the main thread so the UI never freezes — scrolling, clicking, and animation stay smooth while a worker crunches numbers in the background.',
    code: {
      label: 'Main thread + worker',
      lang: 'js',
      code: `// main.js\nconst worker = new Worker('worker.js')\nworker.postMessage({ numbers: [5, 3, 8, 1] }) // send work (data is copied)\nworker.onmessage = (e) => console.log('sorted:', e.data) // receive result\n\n// worker.js\nself.onmessage = (e) => {\n  const sorted = e.data.numbers.sort((a, b) => a - b) // heavy work, off main thread\n  self.postMessage(sorted) // send result back\n}`,
      explanation: [
        'new Worker("worker.js") spins up a separate thread running that script.',
        'postMessage sends data to the worker; the data is structured-cloned (copied), not shared.',
        'Inside the worker, self.onmessage receives the message and does the work without blocking the page.',
        'self.postMessage sends the result back; the main thread’s worker.onmessage receives it.',
        'The worker has no DOM — it computes and returns data; the main thread updates the UI.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A Web Worker is a background execution context running on a separate thread with its own global scope (DedicatedWorkerGlobalScope), event loop, and memory heap, isolated from the main thread and the DOM. Communication is via asynchronous message passing using postMessage; payloads are deep-copied with the structured clone algorithm unless transferred (Transferable objects move ownership with zero copy) or shared (SharedArrayBuffer + Atomics for true shared memory). Dedicated workers serve one page; SharedWorkers serve multiple same-origin contexts. Workers enable parallelism for CPU-bound tasks while preserving JavaScript’s no-shared-mutable-state-by-default safety model.',

  // 7. Internal Working
  internalWorking: [
    'new Worker(url) instructs the browser to fetch and compile the script and start a new thread with its own global scope and event loop, independent of the main thread.',
    'postMessage enqueues a message; the data is serialized via the structured clone algorithm (a deep copy) and placed on the receiver thread’s message queue.',
    'The receiving thread’s event loop dequeues the message and dispatches a message event, so handling is asynchronous and never blocks the sender.',
    'Because the two threads have separate heaps and no shared variables, there are no data races by default — the cost is the copy on each message.',
    'Transferable objects (ArrayBuffer, MessagePort, ImageBitmap, OffscreenCanvas) can be moved instead of copied: ownership transfers to the receiver and the sender’s reference becomes neutered, giving zero-copy hand-off.',
    'SharedArrayBuffer creates memory both threads can read/write; safe coordination then requires Atomics (compare-and-swap, wait/notify) to avoid races — this is the only true shared-memory path.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   MAIN THREAD (has DOM)            WORKER THREAD (no DOM)
   ┌──────────────────┐            ┌──────────────────┐
   │ UI, events, paint│            │ heavy computation│
   │                  │            │                  │
   │ worker.postMessage(data) ───► │ onmessage → work │
   │                  │  (copied)  │                  │
   │ onmessage ◄────── postMessage(result)            │
   └──────────────────┘            └──────────────────┘
        separate heap                  separate heap
   no shared variables (copy) — unless Transferable / SharedArrayBuffer`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each worker has its OWN heap; objects sent via postMessage are deep-copied, so both sides hold separate copies (double the memory for that data briefly).',
    'Transferable objects (ArrayBuffer) are MOVED — the sender’s buffer is neutered (becomes unusable), so only one copy exists; ideal for large binary data.',
    'SharedArrayBuffer is a single block of memory mapped into both heaps — no copy, but requires Atomics for safe access.',
    'A worker that is never terminate()d keeps its thread and heap alive; spawning workers without cleanup leaks threads and memory.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — offload a heavy computation',
      lang: 'js',
      code: `// main.js\nconst w = new Worker('fib.js')\nw.postMessage(45)\nw.onmessage = (e) => console.log('fib(45) =', e.data) // UI never froze\n\n// fib.js\nfunction fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2) }\nself.onmessage = (e) => self.postMessage(fib(e.data))`,
      explanation: [
        'fib(45) is intentionally expensive; running it on the main thread would freeze the page for seconds.',
        'The worker computes it on a background thread, so clicks and scroll keep working.',
        'postMessage(45) sends the input; the result comes back via onmessage.',
        'This is the canonical use: a pure CPU-bound function offloaded.',
      ],
    },
    intermediate: {
      label: 'Intermediate — request/response with ids + module worker',
      lang: 'js',
      code: `// main.js (module worker keeps things tidy)\nconst worker = new Worker(new URL('./calc.js', import.meta.url), { type: 'module' })\nfunction run(task) {\n  return new Promise((resolve) => {\n    const id = crypto.randomUUID()\n    const onMsg = (e) => {\n      if (e.data.id !== id) return\n      worker.removeEventListener('message', onMsg)\n      resolve(e.data.result)\n    }\n    worker.addEventListener('message', onMsg)\n    worker.postMessage({ id, task })\n  })\n}\nconst sum = await run({ op: 'sum', nums: [1, 2, 3] })`,
      explanation: [
        'Wrapping postMessage in a Promise gives an async/await API over the worker.',
        'A unique id correlates each response to its request — essential when many tasks are in flight.',
        'We remove the listener once the matching response arrives to avoid leaks and cross-talk.',
        'type: "module" lets the worker use import/export; new URL(..., import.meta.url) is the bundler-friendly way to reference it.',
        'This pattern is the basis of worker pools and libraries like Comlink.',
      ],
    },
    advanced: {
      label: 'Advanced — zero-copy transfer of a large buffer',
      lang: 'js',
      code: `// main.js\nconst buffer = new ArrayBuffer(50 * 1024 * 1024) // 50MB\n// transfer ownership instead of copying (huge perf win)\nworker.postMessage({ buffer }, [buffer])\nconsole.log(buffer.byteLength) // 0 — neutered after transfer!\n\n// worker.js\nself.onmessage = (e) => {\n  const view = new Uint8Array(e.data.buffer) // owns it now, no copy happened\n  // ...process view...\n  self.postMessage({ done: true })\n}`,
      explanation: [
        'The second argument to postMessage is the transfer list — those objects are MOVED, not copied.',
        'After transfer the sender’s buffer is neutered (byteLength 0); only the worker holds it now.',
        'For a 50MB buffer this avoids a 50MB copy — transfer is near-instant regardless of size.',
        'Use this for large binary data (images, audio, file contents) to keep message passing cheap.',
        'If you need both sides to access it simultaneously, use SharedArrayBuffer + Atomics instead.',
      ],
    },
    realProject: {
      label: 'Real project — offload parsing in a Vue component',
      lang: 'js',
      code: `import { ref, onUnmounted } from 'vue'\n\nexport function useCsvParser() {\n  const rows = ref([])\n  const parsing = ref(false)\n  const worker = new Worker(new URL('./csv.worker.js', import.meta.url), { type: 'module' })\n  worker.onmessage = (e) => { rows.value = e.data; parsing.value = false }\n\n  function parse(text) {\n    parsing.value = true\n    worker.postMessage(text) // big CSV parsed off the main thread\n  }\n  onUnmounted(() => worker.terminate()) // CRITICAL: free the thread\n  return { rows, parsing, parse }\n}`,
      explanation: [
        'Parsing a large CSV on the main thread would freeze the UI; the worker does it in parallel.',
        'parsing is a reactive flag so the UI can show a spinner while work happens.',
        'Results flow back via onmessage and update reactive state, re-rendering the table.',
        'onUnmounted(() => worker.terminate()) frees the worker thread and heap — without it you leak a thread per mounted component.',
        'In React this is created in useEffect with worker.terminate() in the cleanup; libraries like comlink-loader or workerize-loader streamline it.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a Web Worker and what problem does it solve?',
      answer: 'A Web Worker runs JavaScript on a separate background thread, parallel to the main thread. It solves the freezing-UI problem: heavy computation runs in the worker so the main thread stays free to handle clicks, scrolling, and rendering.',
      explanation: 'The signal is "separate thread for heavy work so the UI does not freeze" — naming the single-threaded main-thread problem.',
    },
    {
      level: 'beginner',
      question: 'How do the main thread and a worker communicate, and what are a worker’s limitations?',
      answer: 'They communicate by asynchronous message passing: postMessage to send, onmessage to receive. A worker cannot access the DOM, window, or parent variables directly; it has its own global scope and only a subset of Web APIs.',
      explanation: 'Message passing + no DOM/no shared variables are the two facts they want.',
    },
    {
      level: 'intermediate',
      question: 'What happens to data passed via postMessage, and how can you avoid the copy cost?',
      answer: 'By default data is deep-copied using the structured clone algorithm, which is expensive for large payloads. To avoid copying, use Transferable objects (ArrayBuffer, etc.) in the transfer list to MOVE ownership with zero copy, or SharedArrayBuffer for true shared memory.',
      explanation: 'Structured clone vs transfer vs shared memory is the key intermediate distinction.',
    },
    {
      level: 'intermediate',
      question: 'When should you NOT use a Web Worker?',
      answer: 'For light or DOM-bound work, or when the data transfer cost exceeds the compute savings. Workers add startup latency, message-passing overhead, and complexity; for short tasks or things needing the DOM, do it on the main thread (or chunk it / use idle scheduling).',
      explanation: 'Knowing the overhead and when offloading is NOT worth it shows judgment, not just mechanics.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between a Dedicated Worker, a SharedWorker, and a Service Worker?',
      answer: 'A Dedicated Worker serves a single page for computation. A SharedWorker is shared across multiple same-origin tabs/windows via ports, useful for shared state/connections. A Service Worker is a network proxy for caching/offline/push, with its own lifecycle — not for general computation.',
      explanation: 'Distinguishing the three worker types and their purposes is a strong advanced signal.',
    },
    {
      level: 'senior',
      question: 'How do SharedArrayBuffer and Atomics enable true shared-memory parallelism, and what are the risks?',
      answer: 'SharedArrayBuffer maps one memory block into multiple threads with no copy; Atomics provides lock-free primitives (compare-and-swap, wait/notify) to coordinate access safely. The risks are classic concurrency hazards — data races, deadlocks — plus security: it requires cross-origin isolation (COOP/COEP headers) because of Spectre-class side-channel attacks.',
      explanation: 'Senior signal: understanding lock-free coordination, race hazards, and the cross-origin-isolation security requirement.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How do you terminate a worker, and why does it matter? (terminate() frees the thread)',
    'What is the structured clone algorithm, and what can it not clone? (functions, DOM nodes)',
    'How do transferable objects differ from cloning?',
    'How would you build a worker pool to parallelize many tasks?',
    'Why does SharedArrayBuffer require cross-origin isolation headers?',
    'How does a worker bundle/import other modules? (importScripts or type: "module")',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting DOM/window access inside a worker.',
      why: 'Workers have no DOM and no window; touching document throws — they are compute-only.',
      fix: 'Do computation in the worker, send results back, and let the main thread update the DOM.',
    },
    {
      mistake: 'Sending huge objects by default (structured clone) and wondering why it is slow.',
      why: 'Every postMessage deep-copies the payload; large data means a big, blocking serialization cost.',
      fix: 'Transfer ArrayBuffers (zero-copy) or use SharedArrayBuffer; send only what is needed.',
    },
    {
      mistake: 'Never terminating workers (or spawning one per call).',
      why: 'Each worker is a real thread + heap; leaking them exhausts memory and degrades performance.',
      fix: 'Reuse a worker (or a pool), and call terminate() on unmount/cleanup.',
    },
    {
      mistake: 'Using a worker for trivial or DOM-bound work.',
      why: 'Startup and message overhead can exceed the compute saved, making it slower and more complex.',
      fix: 'Offload only genuinely CPU-bound tasks; otherwise chunk work or use idle scheduling on the main thread.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Workers parse large files, run search/filter over big datasets, or do image/crypto work off the main thread; composables create the worker, expose reactive results, and terminate on scope dispose. Vite supports ?worker imports.' },
    { area: 'React', detail: 'Workers created in useEffect (terminated in cleanup) power spreadsheet recalc, code editors, and chart data prep; Comlink exposes the worker as an async-callable object, hiding postMessage plumbing.' },
    { area: 'Node.js', detail: 'The analogous primitive is worker_threads (true threads with SharedArrayBuffer/MessagePort), used to parallelize CPU-bound work — image processing, compression, crypto — without blocking the event loop.' },
    { area: 'Backend', detail: 'OffscreenCanvas in a worker renders charts/graphics off-main-thread; service-side, worker pools fan out CPU-bound jobs and a queue balances load across threads.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Keeps the main thread responsive: heavy compute runs in parallel without freezing the UI.',
      'Uses additional CPU cores, so multiple workers can process data concurrently.',
      'Transferable objects and SharedArrayBuffer move/share large data with minimal copy cost.',
    ],
    bad: [
      'Worker startup has latency and memory cost; spawning many is expensive.',
      'Structured-clone message passing copies data, so chatty or large messages add overhead.',
      'Over-engineering: offloading trivial work nets a slowdown plus added complexity.',
    ],
    optimizations: [
      'Reuse a long-lived worker or a worker pool sized to navigator.hardwareConcurrency.',
      'Transfer ArrayBuffers instead of cloning; batch messages to reduce round-trips.',
      'Use SharedArrayBuffer + Atomics for hot shared data (with cross-origin isolation).',
      'Terminate idle workers and offload only genuinely CPU-bound tasks.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'SharedArrayBuffer enables Spectre-class timing side-channel attacks, so it is gated behind cross-origin isolation.',
      'A worker loaded from an untrusted/CDN source runs arbitrary code with fetch/network access — a supply-chain risk.',
      'Sending sensitive data across threads still keeps it in client memory, inspectable via DevTools.',
    ],
    bestPractices: [
      'Enable cross-origin isolation (COOP: same-origin, COEP: require-corp) before using SharedArrayBuffer.',
      'Load worker scripts only from your own origin / trusted bundler output; apply a strict CSP (worker-src).',
      'Validate any data the worker receives or fetches; never trust message payloads blindly.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['event-loop', 'concurrency-patterns', 'promises', 'sync-vs-async'],
    nextConcepts: ['service-workers', 'long-task-scheduling', 'typed-arrays', 'requestanimationframe'],
    dependencyNote:
      'Web Workers extend the single-threaded event-loop model into real parallelism via message passing, so understand the event loop and async first. They share roots with service workers (a specialized worker), use typed arrays/transferables for efficient data, and complement long-task scheduling for keeping the main thread free.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two boxes: Main thread (with DOM) and Worker thread (no DOM), each its own heap.',
      'Draw postMessage(data) from main to worker, labelled "copied (structured clone)".',
      'Draw postMessage(result) back; main updates the DOM.',
      'Say: "No shared variables by default — they pass messages; the worker cannot touch the DOM."',
      'Add an arrow labelled "Transferable / SharedArrayBuffer" for zero-copy / shared memory.',
      'End with: use it for CPU-bound work, reuse/terminate workers, and weigh transfer cost vs compute saved.',
    ],
    diagram: `  MAIN (DOM)                    WORKER (no DOM)
    postMessage(data) ──copy──►  onmessage → heavy compute
    onmessage ◄──── postMessage(result)
    separate heaps, no shared vars
    [ArrayBuffer]  ──transfer (move, 0-copy)──►
    [SharedArrayBuffer] ── shared memory + Atomics ──`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A Web Worker runs JavaScript on a separate background thread so heavy CPU work does not freeze the UI. The page and worker communicate by asynchronous message passing (postMessage/onmessage); data is deep-copied via structured clone unless you transfer an ArrayBuffer (zero-copy move) or share one with SharedArrayBuffer + Atomics. Workers have no DOM access. Use them for genuinely CPU-bound tasks (parsing, image/crypto, big-data crunching), reuse or pool them, and terminate() on cleanup. Don’t use them for trivial or DOM work where overhead outweighs the gain.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A Web Worker lets me run JavaScript on a real background thread, in parallel with the main thread. That matters because the main thread is single-threaded and also handles events, layout, and painting — so any long computation freezes the page. With a worker I create one via new Worker(url), send it work with postMessage, and get results back through onmessage, all asynchronously, so the UI stays responsive. The concurrency model is message passing with no shared mutable state by default: the worker has its own global scope and heap, and crucially no DOM access — it computes and returns data, and the main thread updates the UI. The catch is that postMessage deep-copies the payload using the structured clone algorithm, which is costly for large data. So for big binary data I use Transferable objects — passing an ArrayBuffer in the transfer list moves ownership with zero copy, neutering the sender’s reference. And when both threads need the same memory I use SharedArrayBuffer with Atomics for lock-free coordination, though that requires cross-origin isolation for Spectre safety. In practice I reuse a long-lived worker or a pool sized to hardwareConcurrency rather than spawning one per task, wrap postMessage in promises with request ids for an async API, and always terminate() on unmount to free the thread. The judgment call is when to offload: workers add startup and message overhead, so I only use them for genuinely CPU-bound work — parsing large files, image filters, encryption — not for trivial or DOM-bound tasks.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Parallelism and responsiveness vs message-passing/copy overhead and added complexity.',
      'Structured clone (simple, copies) vs Transferable (zero-copy move, sender loses access) vs SharedArrayBuffer (shared, needs Atomics + isolation).',
      'Dedicated worker (per-page compute) vs SharedWorker (cross-tab shared state) vs main-thread chunking/idle scheduling for lighter work.',
    ],
    edgeCases: [
      'Structured clone cannot copy functions, DOM nodes, or class prototypes — only data.',
      'A transferred buffer is neutered on the sender; using it afterward throws.',
      'Errors in a worker surface via the worker.onerror event, not a try/catch on the main thread.',
      'SharedArrayBuffer is unavailable without COOP/COEP cross-origin isolation headers.',
    ],
    runtimeBehavior: [
      'Each worker has its own event loop and microtask queue; its async behaves independently of the main thread.',
      'Message delivery is asynchronous and queued; ordering per channel is preserved but interleaving across workers is not.',
      'Atomics.wait can block a worker thread (never the main thread) for true synchronization primitives.',
    ],
    scalability: [
      'Size pools to navigator.hardwareConcurrency; more workers than cores adds context-switching, not throughput.',
      'A task queue + worker pool load-balances many jobs and bounds concurrency.',
      'Prefer transfer/shared memory as data volume grows so copy cost does not dominate.',
    ],
    productionConcerns: [
      'Always terminate workers on unmount/teardown to avoid leaking threads and heaps.',
      'Handle worker errors and unexpected termination; add timeouts and restart logic for pools.',
      'Bundle worker code correctly (Vite ?worker / new URL(import.meta.url)) and serve from your origin with a strict worker-src CSP.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Web Worker = JS on a separate background thread (true parallelism).',
    'Communicate via postMessage / onmessage (async message passing).',
    'No DOM, no window, own global scope + heap.',
    'Data is deep-copied (structured clone) by default.',
    'Transferable (ArrayBuffer) = zero-copy MOVE; sender ref neutered.',
    'SharedArrayBuffer + Atomics = true shared memory (needs COOP/COEP).',
    'Types: Dedicated (compute), Shared (cross-tab), Service (network proxy).',
    'Reuse/pool workers; size to hardwareConcurrency.',
    'Wrap postMessage in promises + ids for an async API (Comlink).',
    'terminate() on cleanup or you leak threads.',
    'Use for CPU-bound work, NOT trivial/DOM tasks.',
    'Node analog: worker_threads.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create a worker that receives a number n and returns n squared, and log the result on the main thread.',
      hint: 'postMessage to send, self.onmessage in the worker, worker.onmessage to receive.',
      solution: {
        lang: 'js',
        code: `// main.js\nconst w = new Worker('sq.js')\nw.postMessage(9)\nw.onmessage = (e) => console.log('squared:', e.data) // 81\n\n// sq.js\nself.onmessage = (e) => self.postMessage(e.data * e.data)`,
        explanation: [
          'postMessage(9) sends the input to the worker (copied).',
          'self.onmessage in the worker computes and posts the result back.',
          'worker.onmessage on the main thread receives 81 asynchronously.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Wrap a worker call in a Promise so you can `await` the result, using a message id to correlate.',
      hint: 'Generate an id, listen for the matching response, resolve, and remove the listener.',
      solution: {
        lang: 'js',
        code: `function call(worker, payload) {\n  return new Promise((resolve) => {\n    const id = Math.random().toString(36).slice(2)\n    function handler(e) {\n      if (e.data.id !== id) return\n      worker.removeEventListener('message', handler)\n      resolve(e.data.result)\n    }\n    worker.addEventListener('message', handler)\n    worker.postMessage({ id, payload })\n  })\n}\n// worker: self.onmessage = (e) => self.postMessage({ id: e.data.id, result: doWork(e.data.payload) })`,
        explanation: [
          'A unique id ties each response to its request, allowing many concurrent calls.',
          'We remove the listener once the matching message arrives to prevent leaks and cross-talk.',
          'The Promise resolves with the worker’s result, giving a clean async/await API.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Transfer a large ArrayBuffer to a worker without copying, and confirm the sender’s buffer is neutered.',
      hint: 'Pass the buffer in the transfer list (second argument to postMessage).',
      solution: {
        lang: 'js',
        code: `// main.js\nconst buf = new ArrayBuffer(10 * 1024 * 1024)\nworker.postMessage({ buf }, [buf]) // transfer list = zero-copy move\nconsole.log(buf.byteLength) // 0 → neutered, ownership moved\n\n// worker.js\nself.onmessage = (e) => {\n  const bytes = new Uint8Array(e.data.buf) // worker owns it now\n  // process bytes...\n  self.postMessage({ ok: true })\n}`,
        explanation: [
          'The second argument [buf] is the transfer list; the buffer is moved, not copied.',
          'After transfer the main thread’s buf is neutered (byteLength 0) and unusable.',
          'For large binary data this is dramatically faster than structured-clone copying.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a worker pool that runs an array of tasks across N workers (N = hardware concurrency) and resolves with all results in order.',
      hint: 'Keep a queue and a list of idle workers; assign next task as each worker finishes; track results by index.',
      solution: {
        lang: 'js',
        code: `function runPool(workerUrl, tasks, size = navigator.hardwareConcurrency || 4) {\n  return new Promise((resolve) => {\n    const results = new Array(tasks.length)\n    let next = 0, done = 0\n    const workers = Array.from({ length: Math.min(size, tasks.length) }, () => new Worker(workerUrl))\n    function assign(worker) {\n      if (next >= tasks.length) { worker.terminate(); return }\n      const index = next++\n      worker.onmessage = (e) => {\n        results[index] = e.data\n        if (++done === tasks.length) resolve(results)\n        else assign(worker) // give this worker the next task\n      }\n      worker.postMessage(tasks[index])\n    }\n    workers.forEach(assign)\n  })\n}`,
        explanation: [
          'We spawn up to hardwareConcurrency workers — more than cores would not add throughput.',
          'Each worker pulls the next task when it finishes, keeping all workers busy (work-stealing style).',
          'Results are stored by index so the final array preserves input order.',
          'Workers terminate when the queue drains; the Promise resolves once every task is done.',
          'This bounds concurrency and is the core of real worker-pool libraries.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Web Workers prove you understand JavaScript’s single-threaded model and the message-passing concurrency model. Knowing when and how to offload — and the copy/transfer/shared-memory tradeoffs — marks you as someone who can keep complex apps responsive under heavy load.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is a Web Worker / why is JS single-threaded." Product companies (Zoho, Flipkart, Razorpay) ask you to offload a computation and discuss message-passing costs and when not to use one. FAANG-level interviews probe transferables vs SharedArrayBuffer, Atomics, worker pools, and the cross-origin-isolation security model.',
    whatInterviewersExpect:
      'They expect you to explain the separate-thread, no-DOM, message-passing model, contrast structured clone with transferables and shared memory, distinguish dedicated/shared/service workers, and show judgment about when offloading is worth the overhead plus cleanup with terminate().',
  },
}

export default webWorkers
