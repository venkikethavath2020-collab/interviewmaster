import type { ConceptLesson } from '../../../types/lesson'

const typedArrays: ConceptLesson = {
  // 1. Concept Summary
  slug: 'typed-arrays',
  name: 'TypedArrays & ArrayBuffer',
  category: 'iteration-collections',
  difficulty: 'expert',
  importance: 2,
  interviewFrequency: 1,

  // 2. Why Should I Care?
  whyCare: [
    'Typed arrays are how JavaScript handles raw binary data — images, audio, network protocols, WebGL, WebAssembly memory, file bytes — efficiently and predictably.',
    'They give compact, fixed-type, contiguous memory (unlike the boxed, polymorphic elements of a normal array), which is essential for performance-critical and interop code.',
    'They are the only way to read/write binary formats correctly, control byte order (endianness), and share memory between threads (SharedArrayBuffer).',
    'Interviewers (mostly at product/systems companies) use them to test whether you understand memory layout, views, and the difference between a buffer and its views.',
    'Misusing them causes subtle bugs: detached buffers after transfer, alignment errors, and endianness mismatches in protocols.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'An ArrayBuffer is a long strip of empty mailbox slots; a TypedArray is a label that says how to read those slots — one big number each, or many small numbers each.',
    story: [
      'Imagine a very long row of tiny mailbox slots, all empty, just raw space — that is the ArrayBuffer.',
      'The slots by themselves do not know what they hold; you need a label that says how to group and read them.',
      'One label might say "read these slots eight-at-a-time as big numbers", another might say "read them one-at-a-time as small numbers". Those labels are TypedArrays.',
      'The cool part: two labels can point at the SAME row of slots, so a change through one label is instantly seen through the other — same mailboxes, different ways of reading them.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normal JavaScript arrays can hold anything and grow or shrink, which is flexible but uses more memory and is slower for pure numbers.',
    'A TypedArray holds only numbers of one specific size and type (like 8-bit or 32-bit), packed tightly together in memory.',
    'The actual bytes live in an ArrayBuffer, and a TypedArray is a "view" that tells the computer how to interpret those bytes.',
    'This is how programs handle binary data like images and sound, where every byte matters and speed is important.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'An ArrayBuffer is a fixed-length block of raw binary memory. A TypedArray (Uint8Array, Int32Array, Float64Array, etc.) is a typed view over an ArrayBuffer that lets you read/write its bytes as numbers of a specific element type. DataView is a flexible view for reading mixed types with explicit endianness.',
    how: 'Create a buffer (new ArrayBuffer(bytes)) and a view (new Uint8Array(buffer)), or create a TypedArray directly (new Float64Array(length)) which allocates its own buffer. Index it like an array; values are coerced to the element type. Multiple views can share one buffer.',
    why: 'For binary protocols, file/image/audio processing, WebGL/WebAssembly, and any numeric-heavy workload, typed arrays give compact, fast, predictable memory and correct byte-level control that normal arrays cannot.',
    code: {
      label: 'Buffer + views sharing memory',
      lang: 'js',
      code: `const buffer = new ArrayBuffer(8) // 8 raw bytes\n\nconst u8 = new Uint8Array(buffer)   // view as 8 unsigned bytes\nconst u32 = new Uint32Array(buffer) // view as 2 unsigned 32-bit ints\n\nu32[0] = 0x01020304\nconsole.log(u8[0], u8[1], u8[2], u8[3])\n// On little-endian: 4 3 2 1  (same bytes, different interpretation)\nconsole.log(u8.length, u32.length) // 8  2`,
      explanation: [
        'The ArrayBuffer is 8 raw bytes with no type meaning on its own.',
        'u8 views it as 8 single bytes; u32 views the SAME bytes as 2 four-byte integers.',
        'Writing through u32 changes the underlying bytes, instantly visible through u8.',
        'Byte order (endianness) determines how u8 sees the integer u32 wrote — a key binary-data concept.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'An ArrayBuffer is a fixed-length, contiguous block of raw bytes in the heap with no element type. TypedArrays (the %TypedArray% family: Int8/Uint8/Uint8Clamped/Int16/Uint16/Int32/Uint32/Float32/Float64/BigInt64/BigUint64Array) are array-like views that interpret a region of an ArrayBuffer as elements of a fixed numeric type, with a byteOffset, length, and BYTES_PER_ELEMENT, using the platform\'s native endianness. DataView is a non-typed view exposing get/set methods (getInt32, setFloat64, etc.) with an explicit littleEndian flag for reading heterogeneous, byte-aligned data. Buffers can be detached (e.g. transferred to a worker), after which their views throw or read as empty. SharedArrayBuffer enables shared memory across agents, coordinated with Atomics.',

  // 7. Internal Working
  internalWorking: [
    'Allocating an ArrayBuffer reserves a contiguous, fixed-size byte region; unlike a normal array it cannot grow (except resizable ArrayBuffers) and stores raw bytes only.',
    'A TypedArray view stores three things: a reference to the backing buffer, a byteOffset where it starts, and a length in elements; element access computes byteOffset + index * BYTES_PER_ELEMENT.',
    'Reading element i reinterprets BYTES_PER_ELEMENT bytes at that address as the view\'s type using native endianness; writing coerces the value to that type (e.g. Uint8Array wraps mod 256, Uint8ClampedArray clamps to 0..255).',
    'Multiple views over one buffer alias the same bytes, so a write through one is observable through all overlapping views — no copy is made.',
    'DataView ignores the platform endianness by default for its getters/setters, requiring you to pass littleEndian explicitly, which is how protocols enforce a canonical byte order.',
    'Transferring a buffer (postMessage transfer list) detaches it: ownership moves to the receiver and the sender\'s views become detached, throwing on access — this enables zero-copy hand-off between threads.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   ArrayBuffer (8 raw bytes, no type)
   ┌────┬────┬────┬────┬────┬────┬────┬────┐
   │ b0 │ b1 │ b2 │ b3 │ b4 │ b5 │ b6 │ b7 │
   └────┴────┴────┴────┴────┴────┴────┴────┘
     │    │    │    │    │    │    │    │
   Uint8Array:  [0][1][2][3][4][5][6][7]   (8 elements, 1 byte each)
   Uint32Array: [   0    ][   1    ]        (2 elements, 4 bytes each)
   Float64Array:[        0         ]        (1 element, 8 bytes)

   Views SHARE the buffer -> write via one, read via another (no copy).
   DataView: read any type at any offset with explicit endianness.
   transfer() -> buffer DETACHED -> old views throw.`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The ArrayBuffer is a single contiguous heap allocation of raw bytes — cache-friendly and compact, with no per-element object headers.',
    'A normal Array of numbers may box values and store references, costing far more memory and indirection than a TypedArray of the same numbers.',
    'Views hold only metadata (buffer ref, offset, length); creating another view is cheap and does NOT copy the bytes.',
    'subarray() returns a new view sharing the same buffer (no copy); slice() copies bytes into a new buffer (independent). Transfer detaches the source buffer, freeing it from the sender.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — create, fill, and inspect a typed array',
      lang: 'js',
      code: `const arr = new Int16Array(4) // 4 elements, zero-initialized\narr[0] = 300\narr[1] = -5\nconsole.log(arr.length)          // 4\nconsole.log(arr.BYTES_PER_ELEMENT) // 2 (16 bits)\nconsole.log(arr.byteLength)      // 8 (4 * 2)\nconsole.log([...arr])            // [300, -5, 0, 0]`,
      explanation: [
        'new Int16Array(4) allocates its own 8-byte buffer, all zeros.',
        'Elements are signed 16-bit integers; assignment coerces to that type.',
        'BYTES_PER_ELEMENT and byteLength expose the memory layout.',
        'Typed arrays are array-like and iterable, so spread works.',
      ],
    },
    intermediate: {
      label: 'Intermediate — type coercion: wrap vs clamp',
      lang: 'js',
      code: `const u8 = new Uint8Array(1)\nu8[0] = 300\nconsole.log(u8[0]) // 44  (300 mod 256, wraps around)\n\nconst clamped = new Uint8ClampedArray(1)\nclamped[0] = 300\nconsole.log(clamped[0]) // 255 (clamped to max)\nclamped[0] = -5\nconsole.log(clamped[0]) // 0   (clamped to min)`,
      explanation: [
        'Uint8Array stores values mod 256, so 300 wraps to 44.',
        'Uint8ClampedArray clamps out-of-range values to 0..255 instead of wrapping.',
        'Clamped arrays are used for image pixel data (Canvas ImageData) where clamping is the correct behavior.',
        'Choosing the right typed-array kind prevents silent numeric corruption.',
      ],
    },
    advanced: {
      label: 'Advanced — parse a binary header with DataView (endianness)',
      lang: 'js',
      code: `// A 6-byte header: 4-byte magic (BE), 2-byte version (BE)\nconst buf = new ArrayBuffer(6)\nconst dv = new DataView(buf)\ndv.setUint32(0, 0xcafebabe, false) // false = big-endian\ndv.setUint16(4, 1, false)\n\n// Read it back with explicit endianness\nconst magic = dv.getUint32(0, false).toString(16) // 'cafebabe'\nconst version = dv.getUint16(4, false)            // 1\nconsole.log(magic, version)`,
      explanation: [
        'DataView lets you read/write mixed types at chosen byte offsets.',
        'The explicit endianness flag (false = big-endian) makes byte order deterministic across machines.',
        'This is exactly how you parse network protocols and file formats where byte order is part of the spec.',
        'Plain typed arrays use native endianness, which is why DataView is preferred for portable binary parsing.',
      ],
    },
    realProject: {
      label: 'Real project — zero-copy transfer to a Web Worker (browser/Node)',
      lang: 'js',
      code: `// main thread: hand a big buffer to a worker WITHOUT copying\nconst pixels = new Uint8ClampedArray(width * height * 4)\n// ... fill pixels ...\nworker.postMessage({ pixels, width, height }, [pixels.buffer])\n// 'pixels.buffer' is in the transfer list -> ownership moves\nconsole.log(pixels.byteLength) // 0 -> buffer is DETACHED here now\n\n// worker.js: receives the same memory, no copy made\n// self.onmessage = ({ data }) => { process(data.pixels) }`,
      explanation: [
        'Large binary data (image pixels, audio) is expensive to clone between threads.',
        'Listing pixels.buffer in the transfer list moves ownership to the worker with zero copy.',
        'After transfer the buffer is DETACHED on the main thread — its views read as empty/throw.',
        'This is the standard pattern to offload heavy binary work (image filters, decoding) without blocking the main thread or copying megabytes.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between an ArrayBuffer and a TypedArray?',
      answer: 'An ArrayBuffer is raw, untyped, fixed-length binary memory. A TypedArray is a typed view over an ArrayBuffer that interprets those bytes as numbers of a specific type (e.g. Uint8, Float64) and lets you index them.',
      explanation: 'The buffer-vs-view distinction is the foundational concept.',
    },
    {
      level: 'beginner',
      question: 'Why use a TypedArray instead of a normal array for numbers?',
      answer: 'TypedArrays store fixed-type numbers in contiguous, compact memory with no boxing, giving lower memory use and faster, more predictable numeric access — essential for binary data, graphics, and large numeric workloads.',
      explanation: 'Tests understanding of memory layout and performance motivation.',
    },
    {
      level: 'intermediate',
      question: 'What happens when you assign 300 to a Uint8Array element, and how does Uint8ClampedArray differ?',
      answer: 'Uint8Array wraps modulo 256, so 300 becomes 44. Uint8ClampedArray clamps to the 0..255 range, so 300 becomes 255 and negatives become 0 — used for canvas pixel data.',
      explanation: 'Reveals knowledge of coercion semantics per typed-array kind.',
    },
    {
      level: 'intermediate',
      question: 'What is endianness and how do you control it?',
      answer: 'Endianness is the byte order used to store multi-byte numbers (little-endian = least significant byte first). Plain TypedArrays use the platform\'s native order; DataView lets you specify littleEndian explicitly in its get/set methods for portable binary parsing.',
      explanation: 'Endianness + DataView is the standard binary-protocol question.',
    },
    {
      level: 'advanced',
      question: 'What does it mean for an ArrayBuffer to be detached, and when does it happen?',
      answer: 'A detached buffer has had its memory transferred away (e.g. via postMessage transfer list) so it no longer owns any bytes; its views have length 0 and accessing them throws or reads empty. Detaching enables zero-copy transfer of large data between threads.',
      explanation: 'Senior/expert signal: ownership transfer and the resulting detached state.',
    },
    {
      level: 'senior',
      question: 'How do SharedArrayBuffer and Atomics enable multithreaded JavaScript, and what are the pitfalls?',
      answer: 'A SharedArrayBuffer is shared (not transferred) memory visible to multiple agents (workers); Atomics provides atomic read/modify/write and wait/notify so threads coordinate without data races and respect memory ordering. Pitfalls: race conditions, the need for atomic operations on shared counters, security mitigations (COOP/COEP headers required post-Spectre), and complexity of correct synchronization.',
      explanation: 'Expert depth: true shared memory, atomics, memory model, and the security/header requirements.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between subarray() and slice() on a typed array?',
    'How does Node\'s Buffer relate to Uint8Array?',
    'When would you use a DataView over a typed array?',
    'How do typed arrays interact with WebAssembly memory?',
    'What are BigInt64Array/BigUint64Array for?',
    'How do you convert a string to bytes and back? (TextEncoder/TextDecoder)',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using a typed array after transferring its buffer to a worker.',
      why: 'Transfer detaches the buffer; the source view becomes empty/throws.',
      fix: 'Do not reuse a transferred buffer; copy first if you still need it on the sender, or use SharedArrayBuffer for shared access.',
    },
    {
      mistake: 'Assuming a fixed byte order across machines with plain typed arrays.',
      why: 'TypedArrays use the platform\'s native endianness, which varies.',
      fix: 'Use DataView with an explicit littleEndian flag for portable binary formats and protocols.',
    },
    {
      mistake: 'Expecting wrap-around behavior to validate input (e.g. Uint8Array as a 0..255 clamp).',
      why: 'Uint8Array wraps (300 -> 44), it does not clamp; only Uint8ClampedArray clamps.',
      fix: 'Validate/clamp explicitly, or use Uint8ClampedArray when clamping is desired (pixels).',
    },
    {
      mistake: 'Treating subarray() as an independent copy.',
      why: 'subarray() shares the same buffer, so mutations affect the original.',
      fix: 'Use slice() (or set into a fresh buffer) when you need an independent copy.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Canvas-based visualizations and image editors in Vue components read/write pixel data via Uint8ClampedArray (ImageData); audio waveforms use Float32Array from the Web Audio API.' },
    { area: 'React', detail: 'WebGL/Three.js scenes pass vertex and color data as Float32Array/Uint16Array buffers; file uploads read bytes via FileReader/arrayBuffer() into Uint8Array for parsing or hashing.' },
    { area: 'Node.js', detail: 'Node Buffer extends Uint8Array; network sockets, file I/O, crypto, and streams operate on Buffers/typed arrays. DataView parses binary protocols; zlib and image libs work over raw buffers.' },
    { area: 'Backend', detail: 'Binary protocol parsers (protobuf, custom framing), WebAssembly memory bridges, and high-throughput numeric pipelines use typed arrays for compact, fast, copy-free data handling.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Contiguous, unboxed numeric storage is cache-friendly and far more compact than a normal array of numbers.',
      'Transfer/SharedArrayBuffer enable zero-copy hand-off and true shared memory, avoiding expensive serialization.',
    ],
    bad: [
      'Fixed length and single type reduce flexibility; resizing requires allocating a new buffer and copying.',
      'Misuse (frequent slice copies, accidental detaches, DataView per-element calls) can erase the performance benefit.',
    ],
    optimizations: [
      'Reuse a single buffer/view across operations instead of allocating per call.',
      'Use subarray (view, no copy) instead of slice (copy) when you only need a window.',
      'Transfer large buffers to workers (zero copy) rather than cloning via structured clone.',
      'Batch DataView reads or use a typed-array view when endianness allows, to avoid per-element method overhead.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'SharedArrayBuffer was restricted after Spectre; it requires cross-origin isolation (COOP/COEP) headers and can expose timing side channels if misused.',
      'Parsing untrusted binary data without bounds/length checks can cause out-of-range reads, crashes, or logic errors.',
      'Detached-buffer access bugs can leak stale data or throw unexpectedly, creating denial-of-service surfaces.',
    ],
    bestPractices: [
      'Only enable SharedArrayBuffer behind proper COOP/COEP isolation and minimize its exposure.',
      'Validate lengths and offsets before reading untrusted buffers; never trust attacker-controlled sizes.',
      'Use DataView with explicit endianness and guard against detached buffers when handling external data.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'stack-vs-heap', 'array-methods', 'ieee-754-floating-point'],
    nextConcepts: ['web-workers', 'memory-profiling', 'fetch-api', 'garbage-collection'],
    dependencyNote:
      'Typed arrays build on data types and heap memory layout and relate to IEEE-754 for float views; mastery connects to web workers (transfer/SharedArrayBuffer), fetch (arrayBuffer responses), and memory profiling for binary-heavy workloads.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a long strip of byte cells labelled ArrayBuffer (raw, no type).',
      'Above it draw two bracket groupings: Uint8 (1 byte each) and Uint32 (4 bytes each) over the SAME cells.',
      'Write a value through Uint32 and show the bytes it sets, then read them via Uint8 to illustrate aliasing and endianness.',
      'Note BYTES_PER_ELEMENT, byteOffset, and length as the view metadata.',
      'Add a DataView note: explicit endianness for portable parsing; and transfer() -> detached.',
      'Conclude: buffer = bytes, view = interpretation; multiple views share, no copy.',
    ],
    diagram: `   ArrayBuffer:  [ b0 b1 b2 b3 b4 b5 b6 b7 ]   (raw bytes)
   Uint8Array :  [b0][b1][b2][b3][b4][b5][b6][b7]
   Uint32Array:  [  word0   ][  word1   ]
   DataView   :  getUint32(off, littleEndian?)  <- portable

   write via u32[0]  ->  bytes change  ->  visible via u8 (alias)
   buffer.transfer() / postMessage transfer  ->  DETACHED`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'An ArrayBuffer is fixed-length raw binary memory; a TypedArray (Uint8Array, Float64Array, etc.) is a typed view that interprets those bytes as numbers of one type, with compact contiguous storage. Multiple views can share one buffer, so writes alias. Uint8Array wraps, Uint8ClampedArray clamps (pixels). DataView reads mixed types with explicit endianness for portable binary parsing. Transferring a buffer to a worker is zero-copy but detaches the source; SharedArrayBuffer + Atomics give true shared memory. Use them for binary protocols, images/audio, WebGL/WASM, and high-performance numeric work.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Typed arrays are JavaScript\'s mechanism for working with raw binary data efficiently. The core idea is a separation between storage and interpretation. An ArrayBuffer is a fixed-length, contiguous block of raw bytes with no type — just memory. A TypedArray, like Uint8Array or Float64Array, is a view over that buffer that interprets the bytes as elements of a specific numeric type, packed tightly with no boxing, which makes it compact and fast and cache-friendly compared with a normal array of numbers. A powerful consequence is that multiple views can point at the same buffer, so writing through a Uint32Array view is instantly visible through a Uint8Array view of the same bytes — and how those bytes line up depends on endianness. The element type also defines coercion: Uint8Array wraps modulo 256, while Uint8ClampedArray clamps to 0 to 255, which is exactly what canvas pixel data needs. When I need to parse a binary format or network protocol portably, I use a DataView, because it lets me read and write specific types at specific offsets with an explicit endianness flag, instead of depending on the platform\'s native byte order. These show up everywhere binary matters: images and audio, WebGL and WebAssembly memory, file parsing, and Node\'s Buffer which is a Uint8Array subclass. Two advanced points I always mention: transferring an ArrayBuffer to a Web Worker is zero-copy but detaches the original so its views become empty; and SharedArrayBuffer with Atomics enables genuine shared memory between threads, gated behind cross-origin isolation headers after Spectre.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Typed arrays trade flexibility (fixed type/length, no holes, numeric only) for compactness, speed, and binary correctness.',
      'subarray (shared view, cheap) vs slice (copy, independent): performance versus isolation.',
      'Transfer (zero copy, detaches source) vs SharedArrayBuffer (shared, needs Atomics + isolation): hand-off versus shared mutation.',
    ],
    edgeCases: [
      'Detached buffers after transfer make all views empty/throw — a common cross-thread bug.',
      'Endianness mismatches silently corrupt multi-byte values when using native-order typed arrays for protocols.',
      'Unaligned access via DataView is allowed but typed-array views require type-aligned offsets.',
      'NaN canonicalization and float bit patterns can surprise when reinterpreting Float views as integer views.',
    ],
    runtimeBehavior: [
      'Element access computes byteOffset + index*BYTES_PER_ELEMENT and reinterprets bytes in native endianness.',
      'Engines store buffers off the regular JS object heap; large buffers count against separate memory limits.',
      'Atomics enforce memory ordering and atomicity over SharedArrayBuffer regions across agents.',
    ],
    scalability: [
      'For large numeric/binary workloads, typed arrays + workers + transfer/shared memory scale far past normal arrays.',
      'Reusing buffers (object pools) avoids GC churn in high-throughput pipelines (audio, video, networking).',
    ],
    productionConcerns: [
      'Guard against detached buffers and validate untrusted lengths/offsets to avoid crashes and DoS.',
      'SharedArrayBuffer needs COOP/COEP isolation; plan deployment headers accordingly.',
      'Pick the correct view type (wrap vs clamp, signed vs unsigned, float vs int) to avoid silent numeric corruption.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'ArrayBuffer = raw fixed-length bytes; no type.',
    'TypedArray = typed view over a buffer (Uint8/Int32/Float64...).',
    'Multiple views share one buffer -> writes alias (no copy).',
    'BYTES_PER_ELEMENT, byteOffset, byteLength describe layout.',
    'Uint8Array wraps mod 256; Uint8ClampedArray clamps 0..255 (pixels).',
    'DataView: get/set with explicit endianness -> portable parsing.',
    'subarray() = shared view (no copy); slice() = independent copy.',
    'transfer/postMessage transfer = zero-copy, DETACHES source.',
    'SharedArrayBuffer + Atomics = shared memory across threads.',
    'Node Buffer extends Uint8Array.',
    'TextEncoder/TextDecoder convert string <-> bytes.',
    'SharedArrayBuffer needs COOP/COEP (post-Spectre).',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Create an ArrayBuffer of 4 bytes and two views (Uint8Array and Uint16Array) over it. Set a 16-bit value and observe the bytes.',
      hint: 'Two views over one buffer alias the same memory.',
      solution: {
        lang: 'js',
        code: `const buf = new ArrayBuffer(4)\nconst u8 = new Uint8Array(buf)\nconst u16 = new Uint16Array(buf)\nu16[0] = 0x0102\nconsole.log(u8[0], u8[1]) // little-endian: 2 1\nconsole.log(u16.length, u8.length) // 2 4`,
        explanation: [
          'One 4-byte buffer is viewed both as 4 bytes and as 2 sixteen-bit integers.',
          'Writing 0x0102 through u16 sets the underlying bytes, visible via u8.',
          'On a little-endian platform the low byte (0x02) comes first.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert the string "Hi" to its UTF-8 bytes and back using TextEncoder/TextDecoder.',
      hint: 'TextEncoder.encode returns a Uint8Array.',
      solution: {
        lang: 'js',
        code: `const bytes = new TextEncoder().encode('Hi')\nconsole.log([...bytes]) // [72, 105]\nconst text = new TextDecoder().decode(bytes)\nconsole.log(text) // 'Hi'`,
        explanation: [
          'TextEncoder.encode produces a Uint8Array of UTF-8 bytes.',
          '72 and 105 are the code points for H and i.',
          'TextDecoder.decode reverses it back to the original string.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a function readU32BE(bytes, offset) that reads a big-endian unsigned 32-bit integer from a Uint8Array using a DataView.',
      hint: 'Wrap the underlying buffer in a DataView and call getUint32 with littleEndian=false.',
      solution: {
        lang: 'js',
        code: `function readU32BE(bytes, offset) {\n  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)\n  return dv.getUint32(offset, false) // big-endian\n}\n\nconst b = new Uint8Array([0x00, 0xff, 0x00, 0x01])\nconsole.log(readU32BE(b, 0)) // 16711681 (0x00ff0001)`,
        explanation: [
          'We build a DataView over the same buffer, respecting the array\'s byteOffset/length.',
          'getUint32(offset, false) reads four bytes in big-endian order.',
          'Passing the explicit endianness makes the result deterministic across platforms.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Pack three RGB color channels (0-255) and an alpha into a single Uint32Array element, then unpack them.',
      hint: 'Use bit shifts and masks; or write four Uint8 values aliasing the same buffer.',
      solution: {
        lang: 'js',
        code: `function packRGBA(r, g, b, a) {\n  // pack into one 32-bit value (a<<24 | b<<16 | g<<8 | r), unsigned\n  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0\n}\nfunction unpackRGBA(px) {\n  return {\n    r: px & 0xff,\n    g: (px >>> 8) & 0xff,\n    b: (px >>> 16) & 0xff,\n    a: (px >>> 24) & 0xff,\n  }\n}\n\nconst pixels = new Uint32Array(1)\npixels[0] = packRGBA(10, 20, 30, 255)\nconsole.log(unpackRGBA(pixels[0])) // { r:10, g:20, b:30, a:255 }`,
        explanation: [
          'Each channel occupies one byte within a 32-bit integer via shifts and masks.',
          '>>> 0 forces an unsigned 32-bit result so the alpha bit does not make it negative.',
          'Storing pixels as a Uint32Array is how image buffers pack RGBA compactly — exactly the canvas/WebGL representation.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Typed arrays are where JavaScript meets the metal — binary protocols, graphics, audio, WASM, and high-performance data. Even if rarely asked, demonstrating fluency here signals systems-level understanding of memory and interop that few candidates have.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) almost never ask this. Product and systems companies (Razorpay, Flipkart infra, gaming/media firms) ask buffer-vs-view, endianness, and image/pixel handling. FAANG-level interviews probe detached buffers, SharedArrayBuffer/Atomics, zero-copy transfer, and WebAssembly memory interop.',
    whatInterviewersExpect:
      'They expect you to cleanly separate buffer (bytes) from view (interpretation), explain wrap vs clamp and endianness, use DataView for portable parsing, and at senior/expert level discuss transfer/detach, shared memory with Atomics, and the security headers they require.',
  },
}

export default typedArrays
