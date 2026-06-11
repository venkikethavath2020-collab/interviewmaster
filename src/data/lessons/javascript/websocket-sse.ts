import type { ConceptLesson } from '../../../types/lesson'

const websocketSse: ConceptLesson = {
  // 1. Concept Summary
  slug: 'websocket-sse',
  name: 'WebSocket & SSE',
  category: 'browser-dom',
  difficulty: 'advanced',
  importance: 3,
  interviewFrequency: 3,

  // 2. Why Should I Care?
  whyCare: [
    'They are how the web does REAL-TIME: chat, live notifications, collaborative editing, trading tickers, dashboards, multiplayer — none of which work with plain request/response.',
    'Before them, the only option was polling (asking the server "anything new?" over and over), which wastes bandwidth, adds latency, and hammers the server; WebSocket/SSE replace that with a persistent push channel.',
    'Interviewers ask them to see whether you can pick the RIGHT transport: full-duplex WebSocket vs one-way SSE vs long-polling — choosing wrong adds cost, complexity, or bugs.',
    'Getting them wrong in production means silent disconnects, message loss, memory leaks from un-closed sockets, and thundering-herd reconnect storms after an outage.',
    'They expose deep systems concepts — connection lifecycle, backpressure, heartbeats, scaling stateful connections across servers — that separate mid from senior engineers.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A normal web request is mailing a letter and waiting for a reply; a WebSocket is an open phone line, and SSE is a radio station you tune into.',
    story: [
      'Imagine you want to talk to your friend across town. With letters, you write, mail it, and wait days for a reply — then repeat. That is slow and you only hear back when YOU ask.',
      'A WebSocket is like calling your friend on the phone and leaving the line open: either of you can talk any time, instantly, both ways.',
      'SSE (Server-Sent Events) is like a radio station: the station keeps broadcasting news to you the moment it happens, but you can only listen — you cannot talk back on the radio.',
      'So when a new message, score, or notification happens, the server can shout it down the phone or over the radio right away, instead of you having to keep mailing "anything new yet?" letters.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Normally the browser asks the server for something and the server answers once, then the connection closes. To get fresh data you have to ask again and again.',
    'A WebSocket opens a connection that STAYS open, and both the browser and the server can send messages whenever they want — that is called full-duplex (two-way).',
    'SSE also keeps a connection open, but only the server sends messages to the browser; the browser just listens. It is one-way and runs over normal HTTP.',
    'Use WebSocket when both sides need to talk a lot (like chat or games). Use SSE when the server just needs to push updates one way (like a live feed), because it is simpler and reconnects automatically.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'WebSocket is a persistent, full-duplex (two-way) connection between browser and server over a single TCP connection. SSE (Server-Sent Events) is a one-way stream where the server pushes text events to the browser over a long-lived HTTP response, exposed via the EventSource API.',
    how: 'WebSocket starts as an HTTP request that "upgrades" the connection to the ws/wss protocol; after that, you call socket.send() and listen to onmessage. SSE just opens an EventSource(url); the browser keeps the HTTP response open, parses text/event-stream chunks, and fires message events — and auto-reconnects if dropped.',
    why: 'Both replace inefficient polling with server push, giving low-latency real-time updates. WebSocket when you need two-way/binary, SSE when one-way text push is enough and you want HTTP simplicity and free reconnection.',
    code: {
      label: 'WebSocket vs SSE — minimal client',
      lang: 'js',
      code: `// WebSocket: two-way\nconst ws = new WebSocket('wss://example.com/chat')\nws.onopen = () => ws.send(JSON.stringify({ join: 'room-1' }))\nws.onmessage = (e) => console.log('msg:', e.data)\nws.onclose = () => console.log('closed')\n\n// SSE: one-way, server -> client only\nconst es = new EventSource('/api/stream')\nes.onmessage = (e) => console.log('event:', e.data)\nes.addEventListener('price', (e) => console.log('price', e.data))\nes.onerror = () => console.log('will auto-reconnect')`,
      explanation: [
        'new WebSocket(wss://...) opens the connection; once onopen fires you can send() in BOTH directions.',
        'ws.onmessage receives whatever the server pushes — text or binary — at any time.',
        'new EventSource(url) opens an SSE stream; the server keeps an HTTP response open and writes events.',
        'SSE supports named events ("price") via addEventListener, and the browser AUTO-reconnects on drop (you get that for free).',
        'WebSocket has no built-in reconnection — you implement it yourself.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'WebSocket (RFC 6455) is a full-duplex, bidirectional messaging protocol layered over a single TCP connection, established by an HTTP Upgrade handshake (101 Switching Protocols) and then framed independently of HTTP; it carries text or binary frames in both directions with low overhead. Server-Sent Events is a unidirectional server-to-client streaming protocol over a long-lived HTTP response with content-type text/event-stream, consumed via the EventSource interface, which automatically reconnects, supports Last-Event-ID resumption, named event types, and runs entirely within HTTP semantics (proxies, auth headers via the same origin).',

  // 7. Internal Working
  internalWorking: [
    'WebSocket handshake: the client sends an HTTP GET with Upgrade: websocket and a Sec-WebSocket-Key; the server replies 101 Switching Protocols with the hashed Sec-WebSocket-Accept, after which the same TCP socket switches to the WebSocket framing protocol.',
    'After upgrade, data travels as frames (opcode, mask, payload length, payload). Either side may send at any time; control frames (ping/pong/close) manage liveness and shutdown — there is no request/response coupling.',
    'SSE: the client issues a normal GET; the server responds with content-type text/event-stream and keeps the response body open, writing UTF-8 text blocks of the form "data: ...\\n\\n", optionally with event:, id:, and retry: fields.',
    'The EventSource parses each "\\n\\n"-terminated block into a message; an id: line is remembered and re-sent as the Last-Event-ID header on reconnect so the server can resume.',
    'On connection loss, EventSource waits the retry interval and reconnects automatically; WebSocket simply fires onclose and the application must reconnect with its own backoff logic.',
    'Both keep a connection open on the server, consuming a file descriptor/socket and (for HTTP/1.1 SSE) a connection slot, which is why scaling to many concurrent connections needs careful resource and load-balancer planning.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   POLLING (old)            SSE (one-way)           WEBSOCKET (two-way)

   client → server         client → server         client ⇄ server
   "new?"  ← "no"          (open HTTP stream)      (HTTP upgrade → ws)
   client → server          server → client         client → server
   "new?"  ← "yes!"         server → client         server → client
   (repeat forever)         server → client         client → server
                            (auto-reconnect)        (you reconnect)

   wasteful, laggy          simple, server push     full-duplex, binary OK`,

  // 9. Memory Visualization
  memoryVisualization: [
    'Each open connection holds an OS socket / file descriptor on the server plus per-connection buffers — thousands of idle sockets still cost memory, so unbounded fan-out is a real capacity limit.',
    'On the client, the WebSocket/EventSource object and its event listeners are GC roots; if you never close them on component unmount, they (and everything they capture) leak.',
    'Outgoing WebSocket frames queue in a send buffer; if the peer is slow to read (backpressure), bufferedAmount grows and unmonitored producers can exhaust memory.',
    'SSE buffers the open HTTP response on the server; behind a proxy that buffers responses, events can pile up undelivered, so disabling proxy buffering is required.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — SSE server (Node) + client',
      lang: 'js',
      code: `// Node server\napp.get('/api/clock', (req, res) => {\n  res.writeHead(200, {\n    'Content-Type': 'text/event-stream',\n    'Cache-Control': 'no-cache',\n    Connection: 'keep-alive',\n  })\n  const timer = setInterval(() => {\n    res.write('data: ' + new Date().toISOString() + '\\n\\n')\n  }, 1000)\n  req.on('close', () => clearInterval(timer)) // cleanup!\n})\n\n// Browser\nconst es = new EventSource('/api/clock')\nes.onmessage = (e) => console.log(e.data)`,
      explanation: [
        'The text/event-stream content-type and an open response body are what make it SSE.',
        'Each event is "data: ...\\n\\n" — the double newline terminates one event.',
        'req.on("close") clears the interval when the client disconnects — without this you leak timers per connection.',
        'The browser EventSource parses each block into an onmessage event and reconnects automatically if dropped.',
      ],
    },
    intermediate: {
      label: 'Intermediate — WebSocket with JSON protocol + heartbeat',
      lang: 'js',
      code: `const ws = new WebSocket('wss://example.com/ws')\n\nws.onopen = () => {\n  ws.send(JSON.stringify({ type: 'subscribe', channel: 'orders' }))\n}\nws.onmessage = (e) => {\n  const msg = JSON.parse(e.data)\n  if (msg.type === 'ping') return ws.send(JSON.stringify({ type: 'pong' }))\n  handle(msg)\n}\n\n// app-level heartbeat to detect dead connections\nlet alive = true\nconst hb = setInterval(() => {\n  if (!alive) { ws.close(); return }\n  alive = false\n  ws.send(JSON.stringify({ type: 'ping' }))\n}, 30000)\nws.addEventListener('message', () => { alive = true })\nws.onclose = () => clearInterval(hb)`,
      explanation: [
        'A small JSON envelope ({ type, ... }) is the typical app-level protocol on top of raw frames.',
        'Heartbeats matter because TCP can silently die (NAT timeout, sleep) without firing onclose; pings detect it.',
        'If no traffic arrives between beats we assume the socket is dead and close it to trigger reconnection.',
        'onclose clears the heartbeat timer so we do not leak it.',
        'Many WS servers also use protocol-level ping/pong frames; here we show an app-level one for clarity.',
      ],
    },
    advanced: {
      label: 'Advanced — WebSocket with reconnect + exponential backoff',
      lang: 'js',
      code: `function createSocket(url, onMessage) {\n  let ws, attempts = 0, closedByUs = false\n  function connect() {\n    ws = new WebSocket(url)\n    ws.onopen = () => { attempts = 0 }\n    ws.onmessage = (e) => onMessage(JSON.parse(e.data))\n    ws.onclose = () => {\n      if (closedByUs) return\n      const delay = Math.min(1000 * 2 ** attempts, 30000)\n      const jitter = Math.random() * 300\n      attempts++\n      setTimeout(connect, delay + jitter)\n    }\n  }\n  connect()\n  return {\n    send: (m) => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify(m)),\n    close: () => { closedByUs = true; ws.close() },\n  }\n}`,
      explanation: [
        'WebSocket has no built-in reconnect, so we rebuild it on close.',
        'Exponential backoff (2 ** attempts) avoids hammering a recovering server; the cap prevents very long waits.',
        'Jitter (random offset) prevents a "thundering herd" where every client reconnects at the same instant after an outage.',
        'closedByUs distinguishes intentional close (no reconnect) from a network drop (reconnect).',
        'send guards on readyState so we never call send on a CONNECTING/CLOSED socket (which throws).',
      ],
    },
    realProject: {
      label: 'Real project — Vue composable for live notifications',
      lang: 'js',
      code: `import { ref, onUnmounted } from 'vue'\n\nexport function useNotifications(url) {\n  const items = ref([])\n  const connected = ref(false)\n  const es = new EventSource(url) // SSE: server push, auto-reconnect\n\n  es.onopen = () => (connected.value = true)\n  es.addEventListener('notification', (e) => {\n    items.value.unshift(JSON.parse(e.data))\n  })\n  es.onerror = () => (connected.value = false) // EventSource will retry itself\n\n  onUnmounted(() => es.close()) // CRITICAL: release the connection\n\n  return { items, connected }\n}`,
      explanation: [
        'SSE fits notifications perfectly: one-way server push, free auto-reconnect, plain HTTP (auth cookies just work).',
        'Named events ("notification") let the server multiplex multiple event types on one stream.',
        'connected reflects connection state for UI badges; onerror flips it while EventSource retries on its own.',
        'onUnmounted(() => es.close()) is essential — without it the connection and listeners leak when the component is destroyed.',
        'In React the equivalent is creating the EventSource in useEffect and returning () => es.close() as cleanup.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What problem do WebSocket and SSE solve that normal HTTP requests do not?',
      answer: 'They enable the server to push data to the client in real time over a persistent connection, instead of the client repeatedly polling. This gives low-latency updates for chat, notifications, and live feeds without wasteful repeated requests.',
      explanation: 'The signal is "server push / real-time / no polling" — naming the inefficiency of polling shows understanding of why they exist.',
    },
    {
      level: 'beginner',
      question: 'What is the main difference between WebSocket and SSE?',
      answer: 'WebSocket is full-duplex (both client and server can send, supports binary) and uses the ws/wss protocol after an HTTP upgrade. SSE is one-way (server-to-client only, text), runs over plain HTTP via EventSource, and reconnects automatically.',
      explanation: 'Two-way vs one-way and "SSE auto-reconnects, WebSocket does not" are the discriminating facts.',
    },
    {
      level: 'intermediate',
      question: 'When would you choose SSE over WebSocket?',
      answer: 'When you only need server-to-client updates (notifications, feeds, progress, live dashboards), want automatic reconnection and Last-Event-ID resumption for free, and want to stay within HTTP (cookies/auth, proxies, simpler infra). SSE is simpler and lighter for one-way push.',
      explanation: 'Good answers tie the choice to the communication direction and to operational simplicity, not just "SSE is older".',
    },
    {
      level: 'intermediate',
      question: 'Why do you need heartbeats/pings on a WebSocket?',
      answer: 'TCP connections can die silently — NAT timeouts, laptop sleep, network changes — without firing onclose. Periodic ping/pong detects a dead peer so you can close and reconnect, and keeps intermediaries from idling out the connection.',
      explanation: 'Mentioning silent death and intermediary timeouts shows real production experience, not just spec reading.',
    },
    {
      level: 'advanced',
      question: 'How do you implement reconnection without causing a thundering herd?',
      answer: 'Use exponential backoff with a cap and random jitter. After each failure, wait min(base * 2^attempts, max) plus a random offset, and reset on successful open. The jitter spreads reconnect attempts so thousands of clients do not all hit a recovering server simultaneously.',
      explanation: 'Exponential backoff + jitter + reset-on-open is the canonical resilient-reconnect answer; jitter is the senior detail.',
    },
    {
      level: 'senior',
      question: 'How do you scale WebSocket/SSE connections across multiple server instances?',
      answer: 'Connections are stateful and pinned to one instance, so you need sticky sessions or a connection layer, plus a pub/sub backplane (Redis, NATS, Kafka) so a message produced anywhere reaches the instance holding a given client. Track connection counts, use horizontal autoscaling, and watch file-descriptor limits, load-balancer idle timeouts, and backpressure.',
      explanation: 'Senior signal: recognizing the statefulness, the pub/sub backplane, sticky routing, and resource limits — the hard part of real-time at scale.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does WebSocket start as an HTTP request? (the Upgrade handshake)',
    'How does Last-Event-ID let SSE resume after a drop?',
    'What is backpressure and how do you handle a slow consumer? (monitor bufferedAmount, pause producers)',
    'How do you authenticate a WebSocket connection? (cookie/token at handshake; ws cannot set custom headers from the browser)',
    'What are the limits of SSE over HTTP/1.1 vs HTTP/2? (per-domain connection cap)',
    'When is plain long-polling still the right choice?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Never closing the socket/EventSource on component unmount.',
      why: 'The connection, its listeners, and everything they capture stay alive — a leak that also burns a server socket.',
      fix: 'Close in onUnmounted (Vue) / useEffect cleanup (React); use AbortController where supported.',
    },
    {
      mistake: 'Assuming the connection stays up forever and not handling reconnection (WebSocket).',
      why: 'Networks drop; WebSocket does not auto-reconnect, so the feature silently dies after the first blip.',
      fix: 'Implement reconnection with exponential backoff + jitter, and re-subscribe/resume state on reconnect.',
    },
    {
      mistake: 'Using SSE through a proxy/server that buffers responses.',
      why: 'Buffering holds events instead of streaming them, so the client gets nothing until the buffer flushes.',
      fix: 'Disable proxy buffering (e.g. X-Accel-Buffering: no on Nginx), set no-cache, and flush after each write.',
    },
    {
      mistake: 'Ignoring backpressure — pushing faster than the client can consume.',
      why: 'The send buffer (bufferedAmount) grows unbounded and can crash the tab or exhaust server memory.',
      fix: 'Monitor bufferedAmount/stream writable state, coalesce or drop stale updates, and throttle producers.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Composables (useWebSocket/useSSE) wrap the connection lifecycle, expose reactive connection state and messages, and close on onUnmounted; libraries like VueUse provide useWebSocket/useEventSource with reconnect built in.' },
    { area: 'React', detail: 'Connections live in useEffect with a cleanup that closes them; messages flow into state or a store (Redux/Zustand). Stale-closure care is needed so handlers read current state, often via refs.' },
    { area: 'Node.js', detail: 'ws or Socket.IO host WebSocket servers; SSE is a plain res.write loop with text/event-stream. A Redis/NATS pub/sub backplane fans messages across instances; heartbeats prune dead sockets.' },
    { area: 'Backend', detail: 'Real-time features — chat, presence, trading tickers, live dashboards, collaborative editing (CRDT/OT sync), and build/deploy log streaming — choose WebSocket for two-way and SSE for one-way push.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Eliminates polling overhead: one persistent connection instead of thousands of repeated requests/headers, cutting latency and bandwidth.',
      'WebSocket frames have tiny overhead vs full HTTP requests, ideal for high-frequency small messages (ticks, cursor positions).',
    ],
    bad: [
      'Each connection is stateful and holds server resources (sockets/FDs/memory); fan-out to many clients is a capacity ceiling.',
      'A slow consumer causes backpressure; unbounded send buffers can exhaust memory on either side.',
    ],
    optimizations: [
      'Batch/coalesce updates and drop superseded ones (e.g. only the latest price) to reduce message volume.',
      'Compress payloads (per-message-deflate for WS) and use binary framing for large/structured data.',
      'Throttle producers and monitor bufferedAmount to respect the consumer’s rate.',
      'For SSE, prefer HTTP/2 to avoid the per-domain HTTP/1.1 connection cap and reuse one connection for many streams.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'WebSocket is not bound by CORS — any origin can open a ws connection (Cross-Site WebSocket Hijacking) if you rely only on cookies and skip origin checks.',
      'Browsers cannot set custom headers on WebSocket/EventSource handshakes, so naive token-in-header auth does not work and people leak tokens in the URL.',
      'Unencrypted ws:// exposes messages to eavesdropping/tampering; missing input validation on incoming messages enables injection into other clients.',
    ],
    bestPractices: [
      'Always validate the Origin header on the WebSocket handshake and use a CSRF-style token, not cookies alone.',
      'Use wss:// (TLS) and https for SSE; never send ws:// in production.',
      'Authenticate at the handshake (signed token via subprotocol or a short-lived ticket fetched over HTTPS), re-authorize per channel, and validate/sanitize every inbound message before broadcasting.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['fetch-api', 'event-system', 'promises', 'async-await'],
    nextConcepts: ['abortcontroller', 'concurrency-patterns', 'service-workers', 'observer-pattern'],
    dependencyNote:
      'WebSocket/SSE build on the event system (onmessage/onopen/onclose) and the async model; AbortController and reconnection logic manage their lifecycle, and the observer/event-emitter patterns model how messages fan out to subscribers in your app.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw three columns: Polling, SSE, WebSocket.',
      'Polling: client repeatedly asks "new?" — label it wasteful/laggy.',
      'SSE: one arrow client→server to open, then many arrows server→client; note "auto-reconnect, one-way, HTTP".',
      'WebSocket: HTTP "upgrade" arrow, then arrows in BOTH directions; note "full-duplex, binary, you reconnect".',
      'Say: "Pick SSE for one-way push, WebSocket for two-way; both replace polling with a persistent push channel."',
      'Add a note: heartbeats detect silent death; backoff+jitter for reconnect; pub/sub backplane to scale.',
    ],
    diagram: `  SSE                         WEBSOCKET
  client ─open HTTP─► server   client ─HTTP upgrade─► server
        ◄── event ──            ◄────── msg ──────
        ◄── event ──            ─────── msg ─────►
        ◄── event ──            ◄────── msg ──────
  one-way, auto-reconnect       two-way, binary OK`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'WebSocket and SSE replace polling with a persistent server-push channel. WebSocket is full-duplex (two-way, binary, ws/wss after an HTTP upgrade) but you must reconnect yourself. SSE is one-way server→client text over plain HTTP via EventSource and auto-reconnects with Last-Event-ID resume. Choose SSE for one-way feeds/notifications, WebSocket for chat/games/two-way. Production essentials: heartbeats for silent death, backoff+jitter reconnect, close on unmount, and a pub/sub backplane plus sticky routing to scale stateful connections.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Both WebSocket and SSE solve the same core problem: getting real-time data from the server to the client without inefficient polling. The difference is direction and protocol. WebSocket starts as an HTTP request with an Upgrade header; the server responds 101 Switching Protocols and the same TCP socket becomes a full-duplex WebSocket channel where either side can send text or binary frames at any time. That makes it ideal for chat, multiplayer, and collaborative editing. SSE is one-way: the server holds an HTTP response open with content-type text/event-stream and writes "data:" blocks; the browser’s EventSource parses them, fires events, and crucially auto-reconnects and resumes with Last-Event-ID. So I reach for SSE when I only need server push — notifications, live feeds, progress, dashboards — because it is simpler, plays nicely with HTTP auth and proxies, and reconnection is free. I reach for WebSocket when I need two-way or binary. In production the hard parts are the same: connections are stateful, so I add heartbeats to detect silently-dead sockets, reconnection with exponential backoff plus jitter to avoid a thundering herd, and I always close the connection on component unmount to avoid leaks. To scale across instances I need sticky routing and a pub/sub backplane like Redis so a message produced on any server reaches the instance holding the right client, while watching file-descriptor limits and backpressure.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'WebSocket (two-way, binary, low overhead) vs SSE (one-way, text, free reconnect/resume, HTTP-native) vs long-polling (works everywhere, higher latency/overhead).',
      'Stateful persistent connections give low latency but break stateless-scaling assumptions, forcing sticky sessions + a backplane.',
      'Protocol-level vs app-level heartbeats; binary protocols (protobuf) vs JSON for throughput vs debuggability.',
    ],
    edgeCases: [
      'Silent TCP death (NAT/sleep) without onclose — only heartbeats catch it.',
      'HTTP/1.1 per-domain connection cap throttles many SSE streams; HTTP/2 multiplexing fixes it.',
      'WebSocket ignores CORS — cross-site hijacking if you trust cookies without origin checks.',
      'Browser cannot set custom handshake headers, complicating bearer-token auth (use subprotocol/ticket).',
      'bfcache/page restore can resurrect a page with a dead connection object.',
    ],
    runtimeBehavior: [
      'send() on a CONNECTING/CLOSED WebSocket throws; always guard on readyState === OPEN.',
      'Outbound frames queue in bufferedAmount; a slow peer creates backpressure you must monitor.',
      'EventSource retries on the server-provided retry interval and re-sends Last-Event-ID automatically.',
      'Proxies that buffer responses stall SSE until flush — must disable buffering and flush per event.',
    ],
    scalability: [
      'Millions of idle connections cost FDs/memory; size kernel limits (ulimit, somaxconn) and use efficient event loops.',
      'A pub/sub backplane (Redis/NATS/Kafka) decouples message production from the instance holding each client.',
      'Coalesce/drop stale updates and shard by room/topic to bound fan-out cost.',
    ],
    productionConcerns: [
      'Load-balancer and proxy idle timeouts will kill quiet connections — heartbeats keep them alive and detect death.',
      'Reconnect storms after an outage need backoff + jitter or you DoS your own recovering servers.',
      'Observability is hard: instrument connection counts, message rates, reconnect rates, and bufferedAmount; cap and shed load gracefully.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'WebSocket = full-duplex (two-way), binary OK, ws/wss after HTTP upgrade.',
    'SSE = one-way server→client, text, plain HTTP via EventSource.',
    'SSE auto-reconnects + resumes with Last-Event-ID; WebSocket does NOT.',
    'Choose SSE for feeds/notifications; WebSocket for chat/games/two-way.',
    'Heartbeats detect silently-dead TCP connections.',
    'Reconnect = exponential backoff + jitter, reset on open.',
    'Always close() on unmount or you leak connection + listeners.',
    'Guard ws.send on readyState === OPEN (else it throws).',
    'Watch bufferedAmount = backpressure from a slow consumer.',
    'Scale = sticky routing + pub/sub backplane (Redis/NATS).',
    'WebSocket ignores CORS → validate Origin + token (CSWSH risk).',
    'Use wss:// / https; SSE needs proxy buffering disabled.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Open an EventSource to /events, log every message, and make sure it is closed when you call stop().',
      hint: 'EventSource auto-reconnects; you only need onmessage and a close() call.',
      solution: {
        lang: 'js',
        code: `function startStream() {\n  const es = new EventSource('/events')\n  es.onmessage = (e) => console.log('event:', e.data)\n  es.onerror = () => console.log('disconnected (will retry)')\n  return function stop() { es.close() }\n}\nconst stop = startStream()\n// later: stop()`,
        explanation: [
          'EventSource opens a one-way stream and fires onmessage for each "data:" block.',
          'onerror fires on a drop, but EventSource reconnects on its own — no code needed.',
          'Returning a stop() closure lets the caller close the connection and stop reconnection.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Wrap a WebSocket so callers can send objects safely even before it is open, and queue messages until the connection is ready.',
      hint: 'Buffer sends while readyState !== OPEN, flush on onopen.',
      solution: {
        lang: 'js',
        code: `function makeWs(url) {\n  const ws = new WebSocket(url)\n  const queue = []\n  ws.onopen = () => { queue.splice(0).forEach((m) => ws.send(m)) }\n  return {\n    send(obj) {\n      const data = JSON.stringify(obj)\n      if (ws.readyState === WebSocket.OPEN) ws.send(data)\n      else queue.push(data)\n    },\n    close: () => ws.close(),\n    raw: ws,\n  }\n}`,
        explanation: [
          'Calling send before onopen would throw; we queue messages while CONNECTING.',
          'On open we flush the queue in order (splice(0) drains it).',
          'JSON.stringify gives a simple object protocol over the raw text frames.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement reconnect with exponential backoff and jitter, resetting the delay after a successful connection.',
      hint: 'Track an attempts counter; delay = min(base * 2^attempts, cap) + random jitter; reset attempts in onopen.',
      solution: {
        lang: 'js',
        code: `function reconnecting(url, onMsg) {\n  let ws, attempts = 0, stopped = false\n  function open() {\n    ws = new WebSocket(url)\n    ws.onopen = () => { attempts = 0 }\n    ws.onmessage = (e) => onMsg(e.data)\n    ws.onclose = () => {\n      if (stopped) return\n      const delay = Math.min(500 * 2 ** attempts, 30000) + Math.random() * 500\n      attempts++\n      setTimeout(open, delay)\n    }\n  }\n  open()\n  return () => { stopped = true; ws.close() }\n}`,
        explanation: [
          'On close we schedule a retry with delay growing as 2^attempts, capped at 30s.',
          'Random jitter spreads many clients’ reconnects so they do not stampede a recovering server.',
          'attempts resets to 0 on a successful open so the next outage starts from the base delay.',
          'The returned function sets stopped and closes, preventing further reconnection.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Design a Vue composable useLiveFeed(url) that exposes reactive messages and a connected flag using SSE, with proper cleanup.',
      hint: 'Create the EventSource, push into a ref, flip connected on open/error, and close on onUnmounted.',
      solution: {
        lang: 'js',
        code: `import { ref, onUnmounted } from 'vue'\n\nexport function useLiveFeed(url) {\n  const messages = ref([])\n  const connected = ref(false)\n  const es = new EventSource(url)\n\n  es.onopen = () => (connected.value = true)\n  es.onmessage = (e) => {\n    messages.value.push(JSON.parse(e.data))\n    if (messages.value.length > 500) messages.value.shift() // bound memory\n  }\n  es.onerror = () => (connected.value = false)\n\n  onUnmounted(() => es.close())\n  return { messages, connected }\n}`,
        explanation: [
          'SSE is the right transport for a one-way live feed: server push plus free auto-reconnect.',
          'messages and connected are reactive, so the template updates automatically.',
          'We cap the buffer to 500 to avoid unbounded heap growth in long sessions.',
          'onUnmounted(() => es.close()) releases the connection and listeners — without it, this leaks.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Real-time features are everywhere now — knowing when to pick WebSocket vs SSE vs polling, and how to keep connections alive and scalable, marks you as someone who can build chat, dashboards, and collaborative tools, not just CRUD pages.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the WebSocket-vs-SSE difference and a basic chat sketch. Product companies (Zoho, Flipkart, Razorpay) ask you to build a reconnecting client and discuss heartbeats and backpressure. FAANG-level interviews probe scaling stateful connections — sticky routing, pub/sub backplanes, FD limits, and backoff/jitter to avoid reconnect storms.',
    whatInterviewersExpect:
      'They expect you to explain server-push vs polling, contrast full-duplex WebSocket with one-way auto-reconnecting SSE, justify a transport choice by communication direction, and cover production realities: heartbeats, reconnection with backoff+jitter, cleanup, and scaling with a backplane.',
  },
}

export default websocketSse
