import type { Technology } from '../../types/content'

const postgresql: Technology = {
  id: 'postgresql',
  name: 'PostgreSQL',
  icon: 'Pg',
  color: '#336791',
  tagline: 'The advanced open-source RDBMS — MVCC, a cost-based planner, and extensibility all the way down.',
  category: 'database',

  overview: {
    what: 'PostgreSQL is an open-source, object-relational database with full ACID transactions, MVCC concurrency, a cost-based query optimizer, rich index types (B-tree, GIN, GiST, BRIN, Hash), native JSONB, declarative partitioning, and streaming/logical replication. It is the default relational choice for most product companies.',
    why: 'It descends from Berkeley\'s POSTGRES project (1986) and was built around correctness and extensibility: custom types, operators, and index methods are first-class. Where MySQL historically optimized for simple read-heavy workloads, Postgres optimized for complex queries and data integrity — and now does both well.',
    problemsSolved: [
      'Concurrent reads and writes without readers blocking writers — MVCC gives each transaction a consistent snapshot',
      'Complex analytical and transactional queries in one engine: window functions, CTEs, lateral joins, full-text search',
      'Schema flexibility without giving up SQL — JSONB columns with GIN indexes cover most "we need MongoDB" arguments',
      'Durability and recovery via write-ahead logging: crash-safe commits, point-in-time recovery, replication',
    ],
    whenToUse: [
      'Default choice for any transactional system of record — orders, payments, accounts, inventory',
      'Mixed workloads: OLTP plus moderate analytics (window functions, aggregations) on the same data',
      'Semi-structured data alongside relational data (JSONB) — event payloads, user preferences, API responses',
      'Geospatial (PostGIS), full-text search, time-series (with partitioning/BRIN) before reaching for a specialized store',
    ],
    whenNotToUse: [
      'Massive horizontal write scaling across many nodes — Postgres is single-primary; consider sharding layers (Citus) or distributed databases',
      'Petabyte-scale analytics with columnar scans — use a warehouse (ClickHouse, BigQuery, Snowflake)',
      'Extremely high connection counts of tiny queries without a pooler — each connection is a process with real memory cost',
      'Pure key-value caching with microsecond latency — Redis-class stores win on that single dimension',
    ],
  },

  internals: [
    {
      id: 'query-pipeline',
      title: 'Query Execution Pipeline: Parser → Rewriter → Planner → Executor',
      summary: 'Every SQL statement flows through four stages: parse into a tree, rewrite (apply rules/views), plan (choose the cheapest execution strategy via cost estimation), execute (pull rows through a tree of plan nodes).',
      details: [
        'Parser: tokenizes and validates SQL grammar, producing a parse tree. The analyzer then resolves names against the catalog (does this table exist? what type is this column?) producing a query tree.',
        'Rewriter: applies rewrite rules — most importantly, view references are expanded inline into the underlying query. This is why a view costs nothing by itself: it is macro expansion, not a stored result.',
        'Planner/optimizer: generates candidate plans (seq scan vs index scan, nested loop vs hash join vs merge join, join orders) and assigns each a cost using table statistics from pg_statistic (gathered by ANALYZE). The cheapest plan wins. This is cost-based, not rule-based — stale statistics produce bad plans.',
        'Executor: runs the chosen plan as a tree of nodes using the volcano (iterator) model — each node pulls rows from its children one at a time (or in batches). A Hash Join node pulls all rows from its inner child to build a hash table, then pulls outer rows to probe it.',
        'Prepared statements can skip parse/rewrite on re-execution, and after several executions the planner may switch to a generic plan — occasionally a performance trap when parameter values are skewed.',
      ],
      diagram: ['SQL text', 'Parser → parse tree', 'Analyzer → query tree (catalog lookup)', 'Rewriter → views/rules expanded', 'Planner → candidate plans costed', 'Cheapest plan selected', 'Executor → volcano-model node tree', 'Rows returned'],
      code: {
        lang: 'sql',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, c.name
FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.created_at > now() - interval '1 day';
-- EXPLAIN shows the plan the planner chose;
-- ANALYZE actually runs it and shows real row counts and timing.`,
        caption: 'EXPLAIN exposes the planner\'s decision; EXPLAIN ANALYZE exposes whether the decision was right.',
      },
    },
    {
      id: 'explain-cost-model',
      title: 'Reading EXPLAIN: Scans, Joins, and the Cost Model',
      summary: 'EXPLAIN output is a tree read inside-out. Costs are estimated in abstract units (sequential page read = 1.0); EXPLAIN ANALYZE adds actual times and row counts — the estimate-vs-actual gap is where the diagnosis lives.',
      details: [
        'Cost appears as cost=startup..total. Units are abstract: seq_page_cost=1.0, random_page_cost=4.0 by default (lower it to ~1.1 on SSDs), cpu_tuple_cost=0.01. The planner compares plans in these units, never in milliseconds.',
        'Seq Scan: read every page of the table. Wins when a large fraction of rows qualify — sequential I/O is cheap and there is no index round-trip per row. An index on a column the query filters by does NOT guarantee index use.',
        'Index Scan: walk the B-tree, then fetch each matching heap (table) page — random I/O per row. Wins for selective predicates. Index Only Scan skips the heap entirely when all needed columns are in the index AND the visibility map says pages are all-visible (another reason VACUUM matters).',
        'Bitmap Heap Scan: middle ground. Scan the index, build an in-memory bitmap of matching pages, then read those heap pages in physical order. Chosen for medium selectivity, and it can combine multiple indexes with BitmapAnd/BitmapOr.',
        'Join nodes: Nested Loop (good for small outer + indexed inner), Hash Join (build hash on smaller input, probe with larger — the default for big unsorted inputs), Merge Join (both inputs sorted — great when indexes provide order).',
        'The number-one diagnostic: compare rows=N (estimate) with actual rows=M. A 100x misestimate means stale or insufficient statistics — run ANALYZE, raise the column\'s statistics target, or consider extended statistics for correlated columns.',
      ],
      diagram: ['EXPLAIN ANALYZE query', 'Read tree leaf-to-root', 'Check scan types (seq / index / bitmap)', 'Check join strategies + order', 'Compare estimated vs actual rows', 'Large gap → fix statistics', 'Right plan, slow node → fix index / rewrite'],
      code: {
        lang: 'text',
        code: `Hash Join  (cost=230.47..713.98 rows=101 width=40)
           (actual time=2.616..8.492 rows=98 loops=1)
  Hash Cond: (o.customer_id = c.id)
  -> Seq Scan on orders o  (cost=0.00..445.00 rows=120 width=16)
       Filter: (created_at > ...)
       Rows Removed by Filter: 19880   <-- scanned 20k to keep 120
  -> Hash  (cost=145.00..145.00 rows=6838 width=32)
       -> Seq Scan on customers c ...
Planning Time: 0.31 ms
Execution Time: 8.61 ms`,
        caption: '"Rows Removed by Filter" screaming high on a Seq Scan is the classic missing-index signature.',
      },
    },
    {
      id: 'mvcc',
      title: 'MVCC: xmin, xmax, and Tuple Versions',
      summary: 'Postgres never updates a row in place. Every UPDATE writes a new tuple version; every tuple carries xmin (creating transaction) and xmax (deleting/expiring transaction). Visibility is computed per-transaction against a snapshot — readers never block writers.',
      details: [
        'Each tuple header stores xmin (the transaction ID that inserted it) and xmax (the transaction ID that deleted or updated it; 0 if live). An UPDATE = insert new version + set xmax on the old one. A DELETE = set xmax only.',
        'A transaction takes a snapshot: the set of transaction IDs that were committed when it started (per-statement under Read Committed, per-transaction under Repeatable Read). A tuple is visible if xmin is committed-and-in-snapshot and xmax is absent, aborted, or not yet visible.',
        'This is why readers never block writers and writers never block readers in Postgres — each sees its own consistent version. The cost: dead tuple versions accumulate in the heap.',
        'VACUUM exists to reclaim those dead versions: it removes tuples no live snapshot can see, updates the free space map (so new rows reuse the space) and the visibility map (enabling index-only scans). Plain VACUUM does not shrink the file; VACUUM FULL rewrites the table (exclusive lock — rarely appropriate in production).',
        'Bloat: when dead tuples are created faster than autovacuum reclaims them, tables and indexes grow with garbage — scans read dead pages, cache efficiency drops. Long-running transactions are the silent killer: VACUUM cannot remove anything still visible to the oldest snapshot.',
        'Autovacuum triggers per table when dead tuples exceed threshold + scale_factor * reltuples (default ~20% of the table). For large hot tables, 20% is far too lazy — tune autovacuum_vacuum_scale_factor down per table.',
        'Transaction IDs are 32-bit and wrap around. Anti-wraparound (freeze) vacuums replace old xmins with a frozen marker. If you ever block them long enough, the database refuses writes to protect itself — this is the failure mode behind several famous outages.',
      ],
      diagram: ['UPDATE row', 'New tuple version written (xmin = my txid)', 'Old version marked (xmax = my txid)', 'Other snapshots still read old version', 'All snapshots move past it → version is dead', 'VACUUM reclaims dead tuples', 'Space reused / visibility map updated'],
      code: {
        lang: 'sql',
        code: `SELECT xmin, xmax, ctid, * FROM accounts WHERE id = 1;
-- xmin: txid that created this version
-- xmax: txid that expired it (0 = live)
-- ctid: physical location (page, item) — changes on every UPDATE

SELECT relname, n_dead_tup, n_live_tup, last_autovacuum
FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 5;`,
        caption: 'You can watch MVCC happen: open two transactions and inspect xmin/xmax/ctid.',
      },
    },
    {
      id: 'indexes',
      title: 'Index Types: B-tree, GIN, GiST, BRIN, Hash',
      summary: 'B-tree is the default for equality and ranges. GIN inverts multi-valued data (JSONB, arrays, full-text). GiST handles geometric/nearest-neighbor. BRIN summarizes physically-ordered huge tables in kilobytes. Partial, composite, and covering indexes are where interview points are scored.',
      details: [
        'B-tree: sorted balanced tree; supports =, <, >, BETWEEN, ORDER BY, and prefix LIKE (\'abc%\'). The default for 95% of indexes. Unique constraints are enforced with B-trees.',
        'GIN (Generalized Inverted Index): maps each element/key to the rows containing it. The index for JSONB containment (@>), array overlap (&&), and full-text search (tsvector @@). Slower to update (mitigated by fastupdate pending lists), brilliant to query.',
        'GiST: a framework for "does this row\'s value overlap/contain/near this query value" — geometric types, ranges, KNN ordering (ORDER BY location <-> point). PostGIS lives here. Exclusion constraints (e.g., no overlapping bookings) use GiST.',
        'BRIN (Block Range Index): stores min/max per block range — tiny (KBs for TB tables) and effective only when physical order correlates with the column (append-only created_at). Useless on randomly distributed values.',
        'Hash: equality only; since PG 10 it is WAL-logged and safe, but B-tree usually matches it, so it is rarely chosen.',
        'Composite index column order matters: an index on (a, b) serves WHERE a = ? and WHERE a = ? AND b = ?, but NOT WHERE b = ? alone (efficiently). Rule: equality columns first, then the range/sort column. The index (customer_id, created_at) answers "this customer\'s recent orders" perfectly.',
        'Partial index: CREATE INDEX ... WHERE status = \'pending\' — indexes only the hot subset. Smaller, faster, cheaper to maintain; ideal for queue tables where 99% of rows are terminal-state.',
        'Covering index: INCLUDE (col) appends non-key payload columns so an Index Only Scan can satisfy the query without heap visits — provided VACUUM keeps the visibility map current.',
        'Every index taxes writes: each INSERT/UPDATE must touch every index. HOT (heap-only tuple) updates skip index maintenance only when no indexed column changed and the new version fits on the same page — a reason not to index everything.',
      ],
      diagram: ['Query predicate', 'Equality / range on scalar → B-tree', 'JSONB / array / full-text → GIN', 'Geometric / overlap / nearest → GiST', 'Huge append-only, correlated order → BRIN', 'Hot subset only → partial index', 'Avoid heap fetch → covering (INCLUDE)'],
      code: {
        lang: 'sql',
        code: `-- composite: equality column first, then range/sort
CREATE INDEX idx_orders_cust_date ON orders (customer_id, created_at DESC);

-- partial: only the 1% of rows the queue worker polls
CREATE INDEX idx_jobs_pending ON jobs (run_at) WHERE status = 'pending';

-- covering: index-only scan, no heap visit
CREATE INDEX idx_users_email ON users (email) INCLUDE (display_name);

-- JSONB containment
CREATE INDEX idx_events_payload ON events USING gin (payload jsonb_path_ops);`,
      },
    },
    {
      id: 'transactions-isolation',
      title: 'Transactions & Isolation Levels',
      summary: 'Postgres default is Read Committed: each statement sees data committed before that statement. Repeatable Read gives a transaction-wide snapshot. Serializable adds predicate-level conflict detection (SSI) and aborts transactions that would form anomalies.',
      details: [
        'Read Committed (default): every statement takes a fresh snapshot. No dirty reads ever (Postgres has no Read Uncommitted in practice — asking for it gives Read Committed). Anomalies possible: non-repeatable reads (re-read sees a newer committed value) and phantoms (re-run of a range query sees new rows).',
        'Lost-update subtlety under Read Committed: two concurrent "read value, compute, write back" transactions can silently overwrite each other unless you use SELECT FOR UPDATE or atomic updates (SET balance = balance - 100).',
        'Repeatable Read: one snapshot for the whole transaction — re-reads are stable and (in Postgres, stronger than the SQL standard) phantoms do not appear. Concurrent writes to the same row raise a serialization error ("could not serialize access due to concurrent update") — the application must retry.',
        'Serializable: Serializable Snapshot Isolation (SSI). On top of Repeatable Read, Postgres tracks read/write dependencies between transactions and aborts one if a cycle (an outcome impossible under any serial order) would form. Catches write skew — e.g., two doctors both going off-call because each read that "the other is still on-call".',
        'Serializable requires a retry loop in application code; the throughput cost is dependency tracking plus aborted-transaction retries, not locking.',
        'Choosing: Read Committed + explicit row locks or atomic updates covers most OLTP. Repeatable Read for multi-statement reports needing consistency. Serializable when invariants span multiple rows that no single constraint can protect.',
      ],
      diagram: ['Read Committed: snapshot per statement', 'Repeatable Read: snapshot per transaction', 'Serializable: RR + read/write dependency tracking', 'Dangerous cycle detected → abort one txn', 'Application retries'],
      code: {
        lang: 'sql',
        code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;  -- snapshot fixed here
-- another txn commits an update to this row, then:
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
-- ERROR: could not serialize access due to concurrent update
ROLLBACK;  -- retry the whole transaction`,
        caption: 'Above Read Committed, write conflicts become retryable errors instead of silent interleavings.',
      },
    },
    {
      id: 'locking',
      title: 'Locking: Row Locks, Table Locks, Deadlocks, SELECT FOR UPDATE',
      summary: 'MVCC removes read/write blocking; locks remain for write/write conflicts and DDL. Row locks live in tuple headers; deadlocks are detected (after deadlock_timeout) and one victim is aborted. SELECT FOR UPDATE pessimistically claims rows.',
      details: [
        'Row-level: UPDATE/DELETE take an exclusive lock on the affected rows; a second writer to the same row waits for the first transaction to commit or abort. FOR UPDATE locks rows on read; FOR SHARE allows other sharers but blocks writers; FOR NO KEY UPDATE/KEY SHARE are weaker variants foreign keys use.',
        'SELECT FOR UPDATE ... SKIP LOCKED is the canonical Postgres job-queue pattern: workers each grab a different unlocked batch without blocking each other. NOWAIT errors instead of waiting.',
        'Table-level: every statement takes some table lock — plain SELECT takes ACCESS SHARE, which conflicts only with ACCESS EXCLUSIVE (taken by DROP, TRUNCATE, many ALTER TABLE forms, VACUUM FULL). This is why an ALTER TABLE waiting behind one long query makes every later query queue behind the ALTER: lock queues are FIFO.',
        'Deadlock: txn A locks row 1 then wants row 2; txn B holds 2 and wants 1. After deadlock_timeout (1s default) the detector wakes, finds the wait-for cycle, and aborts one transaction with "deadlock detected". The database always recovers; the application must retry.',
        'Prevention: lock rows in a deterministic order (ORDER BY id in the locking SELECT), keep transactions short, avoid user interaction inside transactions, and update multiple rows in one statement (single statements lock in consistent internal order... mostly — concurrent multi-row UPDATEs can still deadlock; ordering is the real fix).',
        'Diagnostics: pg_locks joined with pg_stat_activity shows who blocks whom; pg_blocking_pids(pid) gives blockers directly; log_lock_waits = on logs waits exceeding deadlock_timeout.',
      ],
      diagram: ['Txn A: lock row 1', 'Txn B: lock row 2', 'Txn A: wants row 2 → waits', 'Txn B: wants row 1 → waits', 'deadlock_timeout elapses', 'Detector finds cycle', 'One txn aborted: "deadlock detected"', 'Application retries'],
      code: {
        lang: 'sql',
        code: `-- job queue: many workers, no contention
BEGIN;
SELECT id, payload FROM jobs
WHERE status = 'pending'
ORDER BY created_at
LIMIT 10
FOR UPDATE SKIP LOCKED;
UPDATE jobs SET status = 'running' WHERE id IN (...);
COMMIT;

-- deadlock prevention: deterministic lock order
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;`,
      },
    },
    {
      id: 'wal-replication',
      title: 'WAL, Checkpoints & Replication',
      summary: 'Every change is written to the write-ahead log and flushed before commit returns — data pages can be written lazily because the WAL can replay them. Checkpoints bound recovery time; streaming the WAL to other servers is replication.',
      details: [
        'WAL rule: log the change before the data page. On commit, only the WAL must be fsynced (sequential append — fast); modified data pages stay dirty in shared_buffers and are written later. Crash recovery = replay WAL from the last checkpoint.',
        'Checkpoint: flush all dirty pages to disk and record the position; recovery never needs WAL older than the last checkpoint. Spread over time (checkpoint_completion_target) to avoid I/O spikes. After a checkpoint, the first touch of each page writes a full-page image to WAL (torn-page protection) — why WAL volume spikes post-checkpoint.',
        'synchronous_commit = off trades a few hundred ms of possible committed-transaction loss (not corruption) for a large commit-throughput win — legitimate for ingest-style data.',
        'Streaming (physical) replication: replicas continuously replay the primary\'s WAL — byte-identical standbys, usable for read scaling (hot standby) and failover. Asynchronous by default: replicas lag; a failover can lose the lag window. synchronous_standby_names makes commits wait for replica acknowledgment.',
        'Logical replication: decodes WAL into row-level change events published per table — selective replication, cross-version upgrades, feeding CDC pipelines (Debezium-style). Does not replicate DDL.',
        'Replica reads + replication lag = the classic read-your-own-writes bug: user saves, next request hits a lagging replica, their change is "gone". Fixes: session pinning to primary after writes, or LSN-based wait (compare pg_last_wal_replay_lsn to the write\'s LSN).',
      ],
      diagram: ['Transaction modifies pages in shared_buffers', 'Change records appended to WAL buffer', 'COMMIT → WAL fsync (sequential write)', 'Commit acknowledged to client', 'Background writer flushes dirty pages later', 'Checkpoint: all dirty pages flushed, position recorded', 'WAL streamed to replicas → replayed'],
    },
    {
      id: 'connection-pooling',
      title: 'Connections & Pooling: Why PgBouncer Exists',
      summary: 'Each Postgres connection is a forked OS process with its own memory and catalog caches — hundreds are fine, thousands are not. Poolers multiplex many client connections onto few server connections.',
      details: [
        'Postgres forks one backend process per connection (not threads). Cost per connection: process memory (catalog caches, prepared statements, work_mem potentially per sort/hash node), plus contention on shared structures — even when most connections sit idle.',
        'Symptoms of too many connections: "too many clients already", high context switching, throughput dropping as connections rise. Benchmarks consistently show peak throughput at low hundreds of active connections.',
        'PgBouncer modes: session pooling (server connection held for the client session — safest, least sharing), transaction pooling (server connection borrowed per transaction — the high-leverage mode), statement pooling (per statement — breaks multi-statement transactions).',
        'Transaction pooling breaks session state: session-level prepared statements, SET (non-LOCAL), advisory locks held across transactions, LISTEN/NOTIFY. Apps must avoid these or use pooler workarounds (PgBouncer 1.21+ can track protocol-level prepared statements).',
        'Sizing intuition: needed server connections ≈ cores * a small factor for an OLTP workload, not "one per app thread". A fleet of 50 service instances * 20-connection client pools = 1000 connections — the pooler exists precisely to collapse this.',
        'Serverless/lambda environments make this acute: every cold start opens connections. Managed offerings (RDS Proxy, Supabase pooler/pgbouncer, Neon) are all the same idea.',
      ],
      diagram: ['1000s of app/client connections', 'PgBouncer (transaction mode)', 'Few dozen server connections', 'Postgres backends (1 process each)', 'Higher throughput, bounded memory'],
    },
    {
      id: 'jsonb',
      title: 'JSONB: Document Storage Inside Postgres',
      summary: 'JSONB stores parsed, binary JSON — keys deduplicated and sorted, fast to query, indexable with GIN. json (text) preserves formatting and key order; jsonb is what you actually use.',
      details: [
        'json = text with validation, re-parsed on every access, preserves whitespace/duplicate keys. jsonb = decomposed binary: slower to write (parse cost), much faster to query, supports indexing and more operators. Default to jsonb.',
        'Operators: -> returns json, ->> returns text, #>> path-to-text, @> containment ("does this document contain this sub-document"), ? key existence. jsonpath (@@, jsonb_path_query) gives full path-expression querying.',
        'GIN indexing: default jsonb_ops supports @>, ?, ?| ; jsonb_path_ops is smaller and faster but supports containment (@>) only. For one frequently filtered scalar key, a B-tree expression index — CREATE INDEX ON t ((payload->>\'status\')) — beats GIN.',
        'Updates rewrite the whole value (MVCC: new tuple version with new datum) — frequent small mutations to large documents create write amplification and TOAST churn. Large values are TOASTed (compressed, stored out of line in chunks).',
        'Schema design rule: columns for what you query/join/constrain, JSONB for genuinely variable payloads (event attributes, third-party API responses). "Everything in one JSONB column" forfeits types, constraints, statistics, and planner quality.',
      ],
      code: {
        lang: 'sql',
        code: `SELECT payload->>'user_id' AS user_id
FROM events
WHERE payload @> '{"type": "purchase"}';

CREATE INDEX idx_events_gin ON events USING gin (payload jsonb_path_ops);

-- hot scalar key: expression B-tree beats GIN
CREATE INDEX idx_events_type ON events ((payload->>'type'));`,
      },
    },
    {
      id: 'partitioning',
      title: 'Declarative Partitioning',
      summary: 'One logical table split into physical child tables by RANGE, LIST, or HASH. The planner prunes partitions that cannot match; old data is dropped by detaching a partition instead of running a million-row DELETE.',
      details: [
        'RANGE (time-series — the dominant case), LIST (by region/tenant class), HASH (spread write hotspots). Each partition is a real table with its own indexes and its own autovacuum behavior.',
        'Partition pruning: WHERE created_at >= ... lets the planner skip irrelevant partitions at plan time (or run time for parameterized values). The partition key must appear in the predicate — queries that omit it scan every partition.',
        'Retention is the killer feature: DROP/DETACH a month-old partition is instant metadata work and creates zero bloat; the equivalent DELETE writes millions of dead tuples and then needs vacuum.',
        'Costs: the partition key must be part of any unique constraint (no global unique indexes); too many partitions inflate planning time; cross-partition queries pay per-partition overhead. Partition when tables are large enough to hurt (commonly cited: 100GB+ or maintenance pain), not preemptively.',
        'Smaller per-partition indexes fit caches better, and autovacuum parallelizes naturally across partitions — bloat control is often the quiet second win.',
      ],
      diagram: ['events (partitioned parent)', 'events_2026_04 / events_2026_05 / events_2026_06', 'Query WHERE created_at in May', 'Planner prunes other partitions', 'Retention: DETACH + DROP old partition (instant)'],
    },
  ],

  keywords: [
    {
      id: 'kw-mvcc',
      term: 'MVCC',
      importance: 5,
      whyAsked: 'It is the single concept that explains Postgres concurrency, VACUUM, bloat, and why long transactions are dangerous — interviewers use it to separate users from engineers.',
      explanation: 'Multi-Version Concurrency Control: updates create new tuple versions instead of overwriting; each tuple carries xmin/xmax transaction IDs, and each transaction reads through a snapshot deciding which versions are visible. Readers never block writers and vice versa; the price is dead-tuple garbage that VACUUM must collect.',
      realWorldExample: 'A nightly analytics query reads a consistent view of orders while checkout traffic writes thousands of rows per second — no locks, no waiting, because each side sees its own versions.',
      commonMistakes: [
        'Saying "Postgres locks rows for reads" — plain reads take no row locks at all',
        'Not connecting MVCC to VACUUM — they are one mechanism, not two topics',
        'Forgetting that a long-running transaction pins old versions table-wide, not just for rows it touched',
      ],
      followUps: ['What do xmin and xmax store?', 'Why does an UPDATE change a row\'s ctid?', 'How does a long transaction cause bloat in tables it never read?'],
      diagram: ['UPDATE → new version (xmin set)', 'Old version expired (xmax set)', 'Snapshots decide visibility', 'Unreachable versions = dead', 'VACUUM reclaims'],
    },
    {
      id: 'kw-vacuum',
      term: 'VACUUM & autovacuum',
      importance: 5,
      whyAsked: 'Production Postgres pain almost always routes through vacuum: bloat, slow index-only scans, wraparound. Knowing the tuning knobs signals operational experience.',
      explanation: 'VACUUM removes dead tuple versions no snapshot can see, marks space reusable (free space map), maintains the visibility map (enabling index-only scans), and freezes old transaction IDs to prevent wraparound. Autovacuum runs it automatically when dead tuples pass threshold + scale_factor * live tuples (~20% by default). Plain VACUUM does not return disk space to the OS; VACUUM FULL rewrites the table under an exclusive lock.',
      realWorldExample: 'A 500M-row orders table with default settings only autovacuums after ~100M dead tuples accumulate — per-table autovacuum_vacuum_scale_factor = 0.01 keeps it healthy.',
      commonMistakes: [
        'Recommending VACUUM FULL casually — it takes ACCESS EXCLUSIVE and blocks everything; pg_repack is the online alternative',
        'Thinking autovacuum defaults are fine for big tables — percent-based thresholds scale terribly',
        'Blaming autovacuum for load and disabling it — the cure for autovacuum pain is almost always making it run MORE, smaller, sooner',
      ],
      followUps: ['Why can\'t VACUUM remove tuples a long transaction can still see?', 'What is the visibility map and which scan type depends on it?', 'What happens at transaction ID wraparound?'],
    },
    {
      id: 'kw-explain',
      term: 'EXPLAIN ANALYZE',
      importance: 5,
      whyAsked: 'Every "optimize this slow query" interview converges on reading a plan. Fluency here is the most practical Postgres skill that exists.',
      explanation: 'EXPLAIN prints the plan with estimated costs/rows; EXPLAIN ANALYZE executes the query and adds actual time, actual rows, and loop counts; BUFFERS adds pages read (shared hit vs read = cache vs disk). Diagnosis: read leaf-to-root, find the node where time concentrates, and compare estimated vs actual rows — large gaps mean the planner chose on bad statistics.',
      realWorldExample: 'A query estimated at rows=4 but actually returning 400,000 picked a Nested Loop that executed an inner index scan 400k times — ANALYZE on the table fixed the estimate and the plan flipped to a hash join.',
      commonMistakes: [
        'Running EXPLAIN ANALYZE on an UPDATE/DELETE in production without wrapping in BEGIN ... ROLLBACK — it really executes',
        'Reading only the top-line cost instead of finding the hot node',
        'Ignoring "Rows Removed by Filter" — the clearest missing/unused-index signal',
      ],
      followUps: ['Seq scan vs index scan vs bitmap heap scan — when does the planner pick each?', 'What does loops=N mean for a nested loop inner node?', 'What do shared hit vs read tell you in BUFFERS output?'],
    },
    {
      id: 'kw-btree',
      term: 'B-tree Index',
      importance: 5,
      whyAsked: 'The workhorse. Interviewers probe composite column order and why an existing index gets ignored — both daily production issues.',
      explanation: 'A sorted, balanced tree supporting equality, ranges, ORDER BY, and prefix LIKE. Composite (a, b) indexes serve leftmost-prefix predicates: a alone or a-and-b, not b alone. Order rule: equality-filtered columns first, then the range or sort column. The planner skips an index when the predicate matches too many rows, when statistics are stale, or when the expression doesn\'t match the indexed expression (lower(email) vs email).',
      commonMistakes: [
        'Indexing (created_at, customer_id) for "this customer\'s recent orders" — backwards; equality column first',
        'Expecting WHERE lower(email) = ... to use an index on email — needs an expression index',
        'Adding an index per column and expecting multi-column predicates to be fast — bitmap-AND helps but a composite is better',
      ],
      followUps: ['Why might the planner prefer a seq scan despite an index?', 'What is an index-only scan and what can prevent it?', 'When do you index (a, b) vs (b, a) vs both?'],
    },
    {
      id: 'kw-gin',
      term: 'GIN / GiST / BRIN',
      importance: 4,
      whyAsked: 'Knowing the non-B-tree index families signals you have used Postgres beyond ORM defaults — JSONB, search, geo, and time-series all depend on them.',
      explanation: 'GIN inverts multi-valued data: element → rows. Use for JSONB containment, arrays, full-text tsvectors. GiST is a generalized "overlap/contain/near" tree: geometric data, ranges, KNN ordering, exclusion constraints. BRIN stores per-block-range min/max summaries — kilobytes for terabytes, effective only when physical row order correlates with the column (append-only timestamps).',
      realWorldExample: 'An events table: GIN on the JSONB payload for ad-hoc filtering, BRIN on created_at for time-window scans at 1/1000th the size of a B-tree.',
      commonMistakes: [
        'Using GIN with ->> scalar equality — that needs a B-tree expression index; GIN serves @> containment',
        'Putting BRIN on a column with no physical correlation and wondering why it scans everything',
      ],
      followUps: ['jsonb_ops vs jsonb_path_ops?', 'How do exclusion constraints use GiST (no-overlapping-bookings)?', 'Why is GIN slower on writes?'],
    },
    {
      id: 'kw-isolation',
      term: 'Isolation Levels',
      importance: 5,
      whyAsked: 'Money-moving code lives or dies by this. Interviewers test whether you know the default, its anomalies, and when to escalate.',
      explanation: 'Read Committed (default): fresh snapshot per statement — no dirty reads, but non-repeatable reads, phantoms, and lost updates (without explicit locking) are possible. Repeatable Read: one snapshot per transaction; concurrent writes to rows you update raise serialization errors. Serializable: SSI tracks read/write dependencies and aborts transactions forming anomalies (catches write skew). Both upper levels require application retry loops.',
      realWorldExample: 'Write skew: two concurrent transactions each check "at least one doctor on call" and each take a different doctor off call — Repeatable Read allows it; Serializable aborts one.',
      commonMistakes: [
        'Claiming Read Committed prevents lost updates — it does not; use SELECT FOR UPDATE or atomic SET x = x - n',
        'Not mentioning retries — Serializable without a retry loop is a production incident',
        'Thinking Postgres Repeatable Read allows phantoms because the SQL standard does — Postgres\'s snapshot implementation prevents them',
      ],
      followUps: ['Demonstrate a lost update under Read Committed', 'What error code do serialization failures raise and how do you handle it?', 'What is write skew?'],
    },
    {
      id: 'kw-select-for-update',
      term: 'SELECT FOR UPDATE / SKIP LOCKED',
      importance: 4,
      whyAsked: 'The practical concurrency tool: inventory decrements, balance updates, and job queues all hinge on it.',
      explanation: 'FOR UPDATE locks the returned rows until commit, serializing read-modify-write cycles that MVCC alone would let interleave. SKIP LOCKED makes competing workers skip locked rows instead of queueing — the standard Postgres job-queue pattern. NOWAIT fails fast. FOR SHARE blocks writers but allows other readers-with-share.',
      realWorldExample: 'Ticket booking: SELECT seat FOR UPDATE, verify availability, mark sold, COMMIT — concurrent buyers of the same seat queue and re-check instead of double-selling.',
      commonMistakes: [
        'Locking rows in arbitrary order across concurrent transactions — deadlock factory; add ORDER BY id',
        'Holding FOR UPDATE locks across external API calls or user think-time',
        'Using FOR UPDATE where an atomic UPDATE ... SET stock = stock - 1 WHERE stock > 0 would do',
      ],
      followUps: ['Build a job queue with SKIP LOCKED', 'FOR UPDATE vs Serializable isolation — when each?', 'What does FOR UPDATE do to rows that a concurrent txn already updated?'],
    },
    {
      id: 'kw-wal',
      term: 'WAL (Write-Ahead Log)',
      importance: 4,
      whyAsked: 'WAL is the durability and replication backbone; understanding it explains commit latency, checkpoints, PITR, and replica lag in one stroke.',
      explanation: 'All changes are logged sequentially before data pages are written; commit only requires the WAL fsync. Crash recovery replays WAL from the last checkpoint. The same stream drives streaming replication (byte-level standbys), logical replication (row-level change events), and point-in-time recovery (base backup + archived WAL).',
      commonMistakes: [
        'Confusing checkpoint (flush dirty pages, bound recovery) with commit (fsync WAL)',
        'Thinking synchronous_commit=off risks corruption — it risks losing the last moments of commits, never consistency',
      ],
      followUps: ['What happens during crash recovery step by step?', 'Why do full-page writes spike WAL volume after a checkpoint?', 'Physical vs logical replication trade-offs?'],
      diagram: ['Change → WAL record appended', 'COMMIT → WAL fsync → ack', 'Dirty pages flushed lazily', 'Checkpoint bounds replay window', 'WAL shipped → replicas replay'],
    },
    {
      id: 'kw-pgbouncer',
      term: 'Connection Pooling / PgBouncer',
      importance: 4,
      whyAsked: 'The most common Postgres scaling bottleneck in microservice and serverless architectures — and a question that reveals whether you have run Postgres under real load.',
      explanation: 'Each connection is a forked process with meaningful memory and coordination cost; throughput peaks at low hundreds of active connections. PgBouncer multiplexes thousands of client connections onto a small server pool. Transaction-mode pooling gives the best sharing but breaks session state (session prepared statements, SET, advisory locks, LISTEN/NOTIFY).',
      realWorldExample: '50 service pods * 20-connection client pools = 1000 server connections without a pooler; with transaction-mode PgBouncer, ~40 server connections serve the same load faster.',
      commonMistakes: [
        'Raising max_connections instead of pooling — more idle processes, worse throughput',
        'Running session-state features through transaction pooling and chasing ghost bugs',
      ],
      followUps: ['Session vs transaction vs statement pooling?', 'Why processes-per-connection makes connections expensive?', 'How would you size the server-side pool?'],
    },
    {
      id: 'kw-jsonb',
      term: 'JSONB',
      importance: 4,
      whyAsked: 'Tests judgment about relational vs document modeling, plus knowledge of GIN vs expression indexes — a frequent schema-design discussion.',
      explanation: 'Binary, decomposed JSON: indexable (GIN for containment, B-tree expression indexes for hot scalar keys), rich operators (@>, ->>, jsonpath). Writes rewrite the whole value (MVCC) and large values TOAST. Use for variable payloads; keep queried/joined/constrained fields as real columns.',
      commonMistakes: [
        'json vs jsonb confusion — json is stored text, re-parsed every access',
        'GIN-indexing then filtering with ->> equality, which GIN does not serve',
        'Single-JSONB-column schemas — no constraints, weak statistics, planner blindness',
      ],
      followUps: ['When does a JSONB field deserve promotion to a real column?', 'How do you index payload->>\'status\'?', 'What is TOAST?'],
    },
    {
      id: 'kw-pg-stat-statements',
      term: 'pg_stat_statements',
      importance: 4,
      whyAsked: 'The starting point of every real optimization workflow — interviewers ask "how do you find the slow query" before "how do you fix it".',
      explanation: 'An extension aggregating execution statistics per normalized query: calls, total/mean time, rows, shared-buffer hits/reads. Sorting by total_exec_time finds where the database actually spends its life — often a 2ms query called 50,000 times/minute, not the visible 30s report.',
      realWorldExample: 'Top entry by total time: a SELECT by user_id called per request per item — an N+1 from the ORM. One batched IN query removed 95% of database call volume.',
      commonMistakes: [
        'Optimizing the slowest single query instead of the highest total-time query',
        'Forgetting it needs shared_preload_libraries and CREATE EXTENSION',
      ],
      followUps: ['mean_exec_time vs total_exec_time — which do you sort by and why?', 'How do you reset and window the stats around a deploy?'],
    },
    {
      id: 'kw-nplus1',
      term: 'N+1 Query Problem',
      importance: 4,
      whyAsked: 'The most common ORM-induced performance bug; database-side detection and fixes are fair game in any backend interview.',
      explanation: 'Fetching a list (1 query) then looping to fetch each row\'s relation (N queries). Each query is fast; the round-trip count kills latency. Database-side signature: pg_stat_statements shows enormous call counts on a trivial query. Fixes: JOIN, IN/ANY batch, JSON aggregation in one query, or ORM eager loading (includes/select_related/dataloader).',
      realWorldExample: 'An API listing 100 orders ran 1 + 100 customer lookups: 101 round trips * 1ms = visible latency. One JOIN returned the same data in 3ms.',
      commonMistakes: [
        'Calling it a database problem — the database is fine; the access pattern is broken',
        'Eager-loading everything always, creating giant cartesian joins instead',
      ],
      followUps: ['How does GraphQL make this worse and what is a dataloader?', 'How do you detect N+1 in production telemetry?'],
    },
  ],

  cheatSheets: [
    {
      id: 'cs-index-types',
      title: 'Index types: which and when',
      rows: [
        { concept: 'B-tree', description: 'Default. =, <, >, BETWEEN, ORDER BY, prefix LIKE. Unique constraints.', code: 'CREATE INDEX ON t (col);' },
        { concept: 'GIN', description: 'Inverted: JSONB @>, arrays &&, full-text @@. Slower writes, fast lookups.', code: 'USING gin (payload jsonb_path_ops)' },
        { concept: 'GiST', description: 'Overlap/contain/nearest: geometry, ranges, KNN, exclusion constraints.', code: 'USING gist (during)' },
        { concept: 'BRIN', description: 'Block-range min/max. Tiny. Only for physically correlated columns (append-only time).', code: 'USING brin (created_at)' },
        { concept: 'Hash', description: 'Equality only; rarely beats B-tree. WAL-safe since PG 10.' },
        { concept: 'Partial', description: 'Index a hot subset; small + cheap to maintain.', code: 'ON jobs (run_at) WHERE status = \'pending\'' },
        { concept: 'Composite', description: 'Leftmost-prefix rule. Equality columns first, then range/sort.', code: 'ON orders (customer_id, created_at)' },
        { concept: 'Covering', description: 'INCLUDE payload columns → index-only scans (needs fresh visibility map).', code: 'ON users (email) INCLUDE (name)' },
        { concept: 'Expression', description: 'Index a computed value; query must use the same expression.', code: 'ON users (lower(email))' },
      ],
    },
    {
      id: 'cs-isolation',
      title: 'Isolation levels & anomalies',
      rows: [
        { concept: 'Read Committed (default)', description: 'Snapshot per statement. Blocks: dirty reads. Allows: non-repeatable reads, phantoms, lost updates (without explicit locks).' },
        { concept: 'Repeatable Read', description: 'Snapshot per transaction. In PG also blocks phantoms. Concurrent write conflicts → serialization error, retry.' },
        { concept: 'Serializable', description: 'SSI: dependency tracking aborts anomaly-forming txns. Catches write skew. Requires retry loop.' },
        { concept: 'Read Uncommitted', description: 'Accepted syntactically, behaves as Read Committed — PG never shows dirty reads.' },
        { concept: 'Lost update fix', description: 'Atomic update or pessimistic lock.', code: 'UPDATE acc SET bal = bal - 100 WHERE id = 1;  -- or SELECT ... FOR UPDATE' },
        { concept: 'Serialization failure', description: 'SQLSTATE 40001 — always retry the whole transaction, not just the statement.' },
      ],
    },
    {
      id: 'cs-explain-nodes',
      title: 'EXPLAIN node decoder',
      rows: [
        { concept: 'Seq Scan', description: 'Full table read. Fine for big fractions; suspect when "Rows Removed by Filter" is huge.' },
        { concept: 'Index Scan', description: 'B-tree walk + heap fetch per row. Best for selective predicates; random I/O heavy.' },
        { concept: 'Index Only Scan', description: 'Answer from index alone. "Heap Fetches: 0" is the goal — needs VACUUM-fresh visibility map.' },
        { concept: 'Bitmap Heap Scan', description: 'Index → page bitmap → ordered heap read. Medium selectivity; can AND/OR multiple indexes.' },
        { concept: 'Nested Loop', description: 'For each outer row, run inner. Great with small outer + indexed inner; disastrous when outer estimate is wrong.' },
        { concept: 'Hash Join', description: 'Hash the smaller input, probe with larger. Default for large unsorted joins; needs work_mem.' },
        { concept: 'Merge Join', description: 'Both sides sorted; excellent when indexes already provide order.' },
        { concept: 'rows= vs actual rows=', description: 'The diagnostic gap. 100x off → ANALYZE, raise statistics target, extended statistics.' },
        { concept: 'BUFFERS', description: 'shared hit = from cache, read = from disk. High reads → working set exceeds shared_buffers.' },
      ],
    },
    {
      id: 'cs-ops',
      title: 'Operational quick reference',
      rows: [
        { concept: 'Find slow queries', description: 'Sort by total time, not just mean.', code: 'SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;' },
        { concept: 'Dead tuples / bloat check', description: 'High n_dead_tup + old last_autovacuum = tune autovacuum.', code: 'SELECT relname, n_dead_tup, last_autovacuum FROM pg_stat_user_tables;' },
        { concept: 'Who blocks whom', description: 'Lock diagnostics.', code: 'SELECT pid, pg_blocking_pids(pid), query FROM pg_stat_activity WHERE wait_event_type = \'Lock\';' },
        { concept: 'Kill a query / connection', description: 'Cancel first, terminate if needed.', code: 'SELECT pg_cancel_backend(pid); SELECT pg_terminate_backend(pid);' },
        { concept: 'Unused indexes', description: 'idx_scan = 0 over weeks → drop candidates (check replicas first).', code: 'SELECT indexrelname, idx_scan FROM pg_stat_user_indexes ORDER BY idx_scan;' },
        { concept: 'Concurrent index build', description: 'No write-block; can leave INVALID on failure — check and retry.', code: 'CREATE INDEX CONCURRENTLY ...;' },
        { concept: 'Replication lag', description: 'On replica: how far behind replay is.', code: 'SELECT now() - pg_last_xact_replay_timestamp();' },
        { concept: 'Table/index size', description: 'Includes TOAST + indexes.', code: 'SELECT pg_size_pretty(pg_total_relation_size(\'orders\'));' },
      ],
    },
  ],

  questions: [
    {
      id: 'q-pipeline',
      level: 'intermediate',
      question: 'Walk through what happens when Postgres receives a SELECT statement.',
      answer: 'Parser builds a parse tree and the analyzer resolves names/types against the catalog. The rewriter expands views and rules. The planner generates candidate plans (scan methods, join strategies, join orders), costs each using statistics from ANALYZE, and picks the cheapest. The executor runs the plan tree in the volcano model, each node pulling rows from its children, returning rows to the client.',
      deepDive: 'Worth adding: views are macro-expanded by the rewriter (zero inherent cost), the planner is cost-based so stale statistics directly cause bad plans, and prepared statements can cache plans — including the generic-plan switch after ~5 executions that occasionally regresses skewed parameters.',
      followUps: ['Where do the planner\'s row estimates come from?', 'What is the volcano/iterator model?', 'How do prepared statements interact with planning?'],
    },
    {
      id: 'q-seq-vs-index',
      level: 'beginner',
      question: 'Why might Postgres use a sequential scan even though the column has an index?',
      answer: 'The planner is cost-based: an index scan costs a random heap fetch per matching row, while a seq scan reads pages sequentially. If the predicate matches a large fraction of the table (low selectivity), the seq scan is genuinely cheaper. Other causes: stale statistics misleading the estimate, an expression mismatch (index on email, query on lower(email)), or a type cast preventing index use.',
      realWorldExample: 'WHERE status = \'active\' on a table where 90% of rows are active — a seq scan is the correct plan, and forcing the index would make it slower.',
      followUps: ['How do you verify selectivity estimates?', 'What is random_page_cost and why lower it on SSDs?'],
    },
    {
      id: 'q-explain-workflow',
      level: 'intermediate',
      question: 'A query is slow in production. Describe your end-to-end optimization workflow.',
      answer: 'First confirm it matters: pg_stat_statements sorted by total_exec_time — fix where the database spends time, which may be a fast query called too often (N+1). Then EXPLAIN (ANALYZE, BUFFERS) on the suspect: find the node where time concentrates, compare estimated vs actual rows. Bad estimates → ANALYZE / raise statistics targets. Right plan but slow node → add or fix an index (composite order, partial, covering), or rewrite the query (avoid SELECT *, push filters down, batch lookups). Verify with EXPLAIN ANALYZE again and watch pg_stat_statements post-deploy.',
      deepDive: 'Senior signals: mention checking whether the index would actually be used (selectivity), building it with CREATE INDEX CONCURRENTLY, the write-amplification cost of new indexes, and that the fix is sometimes application-side (caching, batching) rather than SQL-side.',
      followUps: ['What if estimates are fine but the query is still slow?', 'How do you safely add an index to a 500GB table?'],
    },
    {
      id: 'q-mvcc-update',
      level: 'intermediate',
      question: 'What physically happens in the heap when you UPDATE one column of one row?',
      answer: 'Postgres writes an entirely new tuple version (all columns, not just the changed one) with xmin = current transaction ID, and stamps the old version\'s xmax. The row\'s ctid changes. Indexes get new entries pointing at the new version — unless it is a HOT update (no indexed column changed and the new tuple fits on the same page), which skips index maintenance. The old version becomes dead once no snapshot can see it, and VACUUM reclaims it.',
      deepDive: 'This is why update-heavy tables bloat, why fillfactor < 100 helps HOT updates land on the same page, and why "just update a flag column" still rewrites the whole row.',
      followUps: ['What is a HOT update precisely?', 'Why does this design make readers never block writers?'],
    },
    {
      id: 'q-vacuum-why',
      level: 'beginner',
      question: 'Why does Postgres need VACUUM when other databases don\'t seem to?',
      answer: 'Because MVCC keeps old row versions in the table itself: every UPDATE/DELETE leaves a dead tuple behind for concurrent snapshots. Something must eventually reclaim them — that is VACUUM. Databases like MySQL/InnoDB move old versions to a separate undo log and purge it instead; Postgres chose heap-resident versions (cheap reads and rollbacks, but garbage collection in the table). VACUUM also maintains the visibility map (index-only scans) and freezes old transaction IDs against wraparound.',
      followUps: ['VACUUM vs VACUUM FULL?', 'What triggers autovacuum and why are defaults weak for huge tables?'],
    },
    {
      id: 'q-bloat',
      level: 'advanced',
      question: 'What is table bloat, what causes it, and how do you fix it?',
      answer: 'Bloat = dead tuples and unreusable free space inflating tables/indexes beyond their live data size; scans read garbage pages and cache hit rates fall. Causes: update/delete-heavy workloads outpacing autovacuum (default 20% scale factor is lazy for big tables), and long-running transactions/idle-in-transaction sessions pinning the oldest visible snapshot so VACUUM cannot reclaim anything newer. Fixes: tune per-table autovacuum (lower scale_factor, higher cost limit), kill snapshot-pinning sessions (idle_in_transaction_session_timeout), and for existing bloat use pg_repack online — VACUUM FULL works but takes an exclusive lock.',
      deepDive: 'Index bloat is sneakier: B-trees don\'t merge sparse pages, so churn leaves them inflated even after table vacuuming. REINDEX CONCURRENTLY rebuilds them online. Check pgstattuple or bloat-estimation queries to quantify before acting.',
      followUps: ['Why does a long transaction bloat tables it never touched?', 'pg_repack vs VACUUM FULL mechanics?'],
    },
    {
      id: 'q-isolation-default',
      level: 'intermediate',
      question: 'What is Postgres\'s default isolation level and what anomalies does it allow?',
      answer: 'Read Committed: each statement sees a snapshot of everything committed before the statement began. No dirty reads. Allowed anomalies: non-repeatable reads (the same SELECT twice in one transaction can return different data), phantoms, and — most practically dangerous — lost updates in read-modify-write code, since two transactions can both read the old value and overwrite each other. Fix lost updates with atomic updates (SET x = x - n) or SELECT FOR UPDATE.',
      followUps: ['Show a concrete lost-update interleaving', 'When would you escalate to Repeatable Read or Serializable?'],
    },
    {
      id: 'q-write-skew',
      level: 'expert',
      question: 'Explain write skew and how Serializable in Postgres prevents it.',
      answer: 'Write skew: two transactions read overlapping data, each makes a disjoint write that is valid given what it read, but the combined result violates an invariant — e.g., both doctors check "at least one of us stays on call" and both go off call. Repeatable Read permits this (they wrote different rows; no write-write conflict). Serializable (SSI) tracks read→write dependencies between concurrent transactions; when a dependency cycle implies no serial order could produce this outcome, one transaction is aborted with a serialization failure (40001) and must retry.',
      deepDive: 'SSI is optimistic — no extra blocking, just monitoring and aborts — which is why Postgres Serializable is far cheaper than the textbook two-phase-locking image. Alternatives without Serializable: materialize the conflict (a constraint or a row both transactions must write/lock, e.g., FOR UPDATE on the shift row).',
      followUps: ['How else could you prevent write skew at Read Committed?', 'Why must the retry re-run the whole transaction?'],
    },
    {
      id: 'q-deadlock',
      level: 'advanced',
      question: 'You see "deadlock detected" errors in production. What is happening and what do you do?',
      answer: 'Two (or more) transactions hold row locks the other needs — a wait-for cycle. After deadlock_timeout (1s) Postgres detects the cycle and aborts one victim; the error is the recovery, not the failure. Diagnose via the error detail (it names both queries) and log_lock_waits. Fixes: acquire locks in a deterministic order (ORDER BY id in locking SELECTs, sort items before multi-row updates), shorten transactions, replace read-then-write with single atomic statements, and add application retries since deadlocks can never be fully eliminated.',
      realWorldExample: 'Two checkout flows decrementing stock for carts [A, B] and [B, A] deadlock under load; sorting cart items by product id before the locking loop removed virtually all occurrences.',
      followUps: ['Why is lock ordering sufficient to prevent cycles?', 'How does a single multi-row UPDATE still deadlock with another?'],
    },
    {
      id: 'q-wal-crash',
      level: 'advanced',
      question: 'Postgres crashes mid-transaction with dirty pages unwritten. Why is no committed data lost?',
      answer: 'Write-ahead logging: every change was appended to the WAL, and COMMIT returned only after the WAL was fsynced. Data pages in shared_buffers may be stale on disk, but recovery replays WAL from the last checkpoint, reapplying every logged change (redo). Uncommitted transactions simply have no commit record, so their changes are invisible — MVCC tuples from aborted transactions are ignored and cleaned later. Checkpoints exist to bound how much WAL replay recovery needs.',
      deepDive: 'Full-page writes handle torn pages: the first modification of a page after a checkpoint logs the whole page image so replay starts from a consistent base. This is also why WAL volume jumps right after checkpoints.',
      followUps: ['What does synchronous_commit=off actually risk?', 'How does PITR extend this mechanism?'],
    },
    {
      id: 'q-replication-lag',
      level: 'advanced',
      question: 'You added read replicas and users now sometimes don\'t see their own writes. Why, and how do you fix it?',
      answer: 'Streaming replication is asynchronous by default: the primary acknowledges commit before replicas replay it, so a read hitting a lagging replica misses recent writes — read-your-own-writes violation. Fixes: route reads-after-writes to the primary (session pinning for N seconds after a write), or wait for the replica to reach the write\'s WAL position (capture pg_current_wal_lsn() at write, compare with pg_last_wal_replay_lsn() on the replica), or make critical commits synchronous (synchronous_standby_names) at a latency cost.',
      followUps: ['How do you monitor replication lag?', 'What does a failover lose under async replication?'],
    },
    {
      id: 'q-connections',
      level: 'intermediate',
      question: 'Why are Postgres connections expensive, and what do you do about it?',
      answer: 'Each connection is a forked OS process with its own catalog caches and memory (and work_mem potentially per sort/hash during queries), plus shared-structure coordination overhead. Throughput peaks at low hundreds of active connections; thousands of mostly-idle ones waste memory and degrade everything. Solution: pool — PgBouncer in transaction mode multiplexes thousands of client connections onto tens of server connections. Caveat: transaction pooling breaks session state (session prepared statements, SET, advisory locks, LISTEN/NOTIFY).',
      followUps: ['Session vs transaction pooling trade-offs?', 'How do serverless platforms make this worse?'],
    },
    {
      id: 'q-jsonb-vs-column',
      level: 'intermediate',
      question: 'When do you store data in a JSONB column versus normal columns?',
      answer: 'Real columns for anything you filter, join, constrain, or aggregate on — you get types, constraints, good statistics, and the best planner behavior. JSONB for genuinely variable structure: event payloads, third-party API responses, per-tenant custom fields. Index JSONB with GIN for containment queries, or a B-tree expression index for one hot scalar key. Promote a JSONB field to a real column the moment it appears in WHERE clauses regularly.',
      followUps: ['json vs jsonb?', 'Why do frequent updates to large JSONB values hurt (MVCC rewrite + TOAST)?'],
    },
    {
      id: 'q-cte-optimization',
      level: 'expert',
      question: 'How do CTEs behave in Postgres planning, and when do window functions beat self-joins?',
      answer: 'Since PG 12, plain CTEs are inlined into the main query (predicate pushdown works) unless referenced multiple times or marked MATERIALIZED; before 12 they were always optimization fences — a famous gotcha when porting old advice. Use MATERIALIZED deliberately to force one evaluation, NOT MATERIALIZED to force inlining. Window functions compute per-row analytics (running totals, rank in group, lag/lead) in one scan over sorted/partitioned data, where the self-join equivalent re-scans and explodes intermediate rows — top-N-per-group via ROW_NUMBER() is typically far cheaper than a correlated MAX subquery per row.',
      followUps: ['What is an optimization fence?', 'Show top-1-per-group with ROW_NUMBER vs the correlated-subquery version and compare plans'],
    },
    {
      id: 'q-partitioning-when',
      level: 'advanced',
      question: 'When would you partition a table, and what does it actually buy you?',
      answer: 'Partition when size causes operational pain — commonly 100GB+ time-series or log-like tables. Wins: partition pruning (queries touching one month scan one partition), instant retention (DROP/DETACH old partitions instead of mega-DELETEs that create bloat), smaller per-partition indexes that fit cache, and parallel autovacuum across partitions. Costs: the partition key must be in every unique constraint, queries omitting the key scan all partitions, and planning overhead grows with partition count. Partitioning is not a query-speed silver bullet — an index on an unpartitioned table often performs the same lookup.',
      followUps: ['RANGE vs LIST vs HASH use cases?', 'Why can\'t you have a global unique index across partitions?'],
    },
  ],

  codingQuestions: [
    {
      id: 'code-pg-topn-group',
      title: 'Latest order per customer (DISTINCT ON)',
      level: 'intermediate',
      problem: 'Return each customer\'s most recent order (customer_id, order id, created_at) from orders(id, customer_id, created_at). Show the idiomatic Postgres solution and the portable one.',
      solution: {
        lang: 'sql',
        code: `-- Postgres idiom
SELECT DISTINCT ON (customer_id)
       customer_id, id, created_at
FROM orders
ORDER BY customer_id, created_at DESC;

-- Portable: window function
SELECT customer_id, id, created_at
FROM (
  SELECT o.*,
         ROW_NUMBER() OVER (PARTITION BY customer_id
                            ORDER BY created_at DESC) AS rn
  FROM orders o
) ranked
WHERE rn = 1;`,
      },
      explanation: 'DISTINCT ON keeps the first row per group as defined by ORDER BY — the group columns must lead the ORDER BY. It is Postgres-specific but reads cleanly and pairs perfectly with an index on (customer_id, created_at DESC), which can make it nearly free. The window version is standard SQL and generalizes to top-N by changing rn = 1 to rn <= N.',
      timeComplexity: 'O(n log n) without index; near O(groups) with a matching composite index',
      spaceComplexity: 'O(1) extra with index scan; O(n) for the window sort otherwise',
      alternatives: ['LATERAL join: SELECT ... FROM customers c CROSS JOIN LATERAL (SELECT ... WHERE customer_id = c.id ORDER BY created_at DESC LIMIT 1) — excellent with the composite index', 'Correlated MAX subquery — usually the worst plan of the four'],
    },
    {
      id: 'code-pg-fix-slow-query',
      title: 'Diagnose and fix a slow filtered-sorted query',
      level: 'advanced',
      problem: 'SELECT * FROM orders WHERE customer_id = 42 AND status = \'shipped\' ORDER BY created_at DESC LIMIT 20 takes 900ms on a 50M-row table with single-column indexes on customer_id and status. Fix it and justify with the plan.',
      solution: {
        lang: 'sql',
        code: `EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE customer_id = 42 AND status = 'shipped'
ORDER BY created_at DESC LIMIT 20;
-- Plan shows: BitmapAnd of two indexes, then Sort of 30k rows, then Limit.

-- Fix: one composite index matching filter THEN sort order
CREATE INDEX CONCURRENTLY idx_orders_cust_status_date
ON orders (customer_id, status, created_at DESC);

-- New plan: Index Scan returning rows already ordered;
-- Limit stops after 20 rows. No sort node at all.`,
      },
      explanation: 'The single-column indexes force a bitmap-AND plus a full sort of every matching row before LIMIT can apply. A composite index with equality columns (customer_id, status) first and the sort column last delivers rows pre-sorted, so the executor walks the index and stops at 20 — the sort disappears from the plan. CONCURRENTLY avoids blocking writes during the build.',
      timeComplexity: 'Before: O(m log m) for m matching rows; after: O(20) index entries read',
      spaceComplexity: 'After: O(1) — no sort buffer',
      alternatives: ['Partial index WHERE status = \'shipped\' if that status dominates queries', 'INCLUDE the few selected columns instead of SELECT * to enable an index-only scan'],
    },
    {
      id: 'code-pg-upsert',
      title: 'Idempotent upsert with conflict handling',
      level: 'intermediate',
      problem: 'Maintain a daily_stats(user_id, day, views) table: insert a row or atomically increment views if (user_id, day) exists. No race conditions under concurrency.',
      solution: {
        lang: 'sql',
        code: `CREATE UNIQUE INDEX uq_daily_stats ON daily_stats (user_id, day);

INSERT INTO daily_stats (user_id, day, views)
VALUES ($1, current_date, 1)
ON CONFLICT (user_id, day)
DO UPDATE SET views = daily_stats.views + EXCLUDED.views;`,
      },
      explanation: 'ON CONFLICT requires a unique index as the arbiter; the insert-or-update decision is atomic inside the statement, so concurrent callers never race (one inserts, the other takes the update path — speculative insertion handles the window). EXCLUDED refers to the row that failed to insert. The naive SELECT-then-INSERT-or-UPDATE pattern has a TOCTOU race that this eliminates.',
      timeComplexity: 'O(log n) index probe per call',
      spaceComplexity: 'O(1)',
      alternatives: ['ON CONFLICT DO NOTHING for pure idempotent inserts', 'MERGE (PG 15+) for multi-action conditional logic', 'Bulk upsert: INSERT ... SELECT ... ON CONFLICT for batch ingestion'],
    },
    {
      id: 'code-pg-job-queue',
      title: 'Concurrent-safe job queue with SKIP LOCKED',
      level: 'advanced',
      problem: 'Multiple workers must each claim a batch of pending jobs from jobs(id, status, run_at, payload) without two workers ever processing the same job, and without workers blocking each other.',
      solution: {
        lang: 'sql',
        code: `WITH claimed AS (
  SELECT id FROM jobs
  WHERE status = 'pending' AND run_at <= now()
  ORDER BY run_at
  LIMIT 10
  FOR UPDATE SKIP LOCKED
)
UPDATE jobs j
SET status = 'running', started_at = now()
FROM claimed
WHERE j.id = claimed.id
RETURNING j.id, j.payload;

-- supporting partial index: only pending rows
CREATE INDEX idx_jobs_pending ON jobs (run_at) WHERE status = 'pending';`,
      },
      explanation: 'FOR UPDATE locks the selected rows; SKIP LOCKED makes other workers skip those rows instead of waiting, so N workers each grab a disjoint batch in parallel. Claiming and marking happen in one statement, so a crash between claim and mark is impossible — the lock simply dies with the connection and the rows become claimable again. The partial index keeps polling O(pending), not O(all jobs ever).',
      timeComplexity: 'O(batch) per claim with the partial index',
      spaceComplexity: 'O(batch)',
      alternatives: ['Add an attempts counter + visibility timeout for crash-after-claim recovery', 'LISTEN/NOTIFY to wake idle workers instead of poll loops (mind pooler compatibility)'],
    },
    {
      id: 'code-pg-keyset',
      title: 'Keyset (cursor) pagination vs OFFSET',
      level: 'intermediate',
      problem: 'Page through millions of orders sorted by created_at DESC. Show why OFFSET 100000 LIMIT 20 degrades and implement keyset pagination handling timestamp ties.',
      solution: {
        lang: 'sql',
        code: `-- OFFSET must produce and discard 100,000 rows first:
SELECT id, created_at FROM orders
ORDER BY created_at DESC OFFSET 100000 LIMIT 20;  -- gets slower per page

-- Keyset: remember the last row of the previous page
SELECT id, created_at FROM orders
WHERE (created_at, id) < ($1, $2)        -- row-value comparison handles ties
ORDER BY created_at DESC, id DESC
LIMIT 20;

CREATE INDEX idx_orders_keyset ON orders (created_at DESC, id DESC);`,
      },
      explanation: 'OFFSET is O(offset + limit): the executor walks and throws away every skipped row, so deep pages crawl and rows shift between pages under concurrent inserts. Keyset seeks directly into the index at the last-seen position — constant time per page regardless of depth, and stable under inserts. The (created_at, id) row-value comparison breaks timestamp ties deterministically; the composite index makes the seek a pure index range scan.',
      timeComplexity: 'OFFSET: O(offset + limit) per page; keyset: O(log n + limit)',
      spaceComplexity: 'O(1)',
      alternatives: ['Encode the (created_at, id) tuple as an opaque base64 cursor in the API', 'OFFSET remains acceptable for shallow, jump-to-page-N admin UIs'],
    },
    {
      id: 'code-pg-jsonb-query',
      title: 'Query and index a JSONB events table',
      level: 'intermediate',
      problem: 'events(id, payload jsonb) holds heterogeneous events. Efficiently: (1) find purchase events over amount 100, (2) count events per type. Index appropriately.',
      solution: {
        lang: 'sql',
        code: `-- 1. containment for fixed structure + numeric filter on extracted value
SELECT id, payload
FROM events
WHERE payload @> '{"type": "purchase"}'
  AND (payload->>'amount')::numeric > 100;

-- 2. aggregate on an extracted key
SELECT payload->>'type' AS event_type, count(*)
FROM events
GROUP BY payload->>'type';

-- GIN serves the @> containment
CREATE INDEX idx_events_payload ON events USING gin (payload jsonb_path_ops);
-- B-tree expression index serves equality/grouping on the hot scalar key
CREATE INDEX idx_events_type ON events ((payload->>'type'));`,
      },
      explanation: 'Two different access patterns need two different indexes: @> containment is GIN territory (jsonb_path_ops is smaller/faster when you only need containment), while ->> scalar equality and GROUP BY benefit from a B-tree expression index — GIN cannot serve ->> comparisons. The ::numeric cast on amount is applied after the GIN-indexed containment narrows candidates.',
      timeComplexity: 'GIN containment ~O(matching rows); expression-index equality O(log n + matches)',
      spaceComplexity: 'GIN index size grows with distinct keys/values',
      alternatives: ['Promote type and amount to real columns once they dominate queries', 'jsonpath: WHERE payload @@ \'$.amount > 100\' (PG 12+)'],
    },
  ],

  scenarios: [
    {
      id: 'sc-slow-query',
      title: 'A production endpoint slowed from 50ms to 3s — find and fix the query',
      situation: 'After a data backfill doubled the orders table, an order-history endpoint degraded badly. No code changed. You own the database side.',
      approach: [
        'pg_stat_statements ordered by total_exec_time: confirm which query the time actually goes to — and check calls, in case the real issue is call volume (N+1) rather than per-query time.',
        'EXPLAIN (ANALYZE, BUFFERS) the offender with real parameter values. Read leaf-to-root; find the node holding the time.',
        'Compare estimated vs actual rows. The backfill likely outran autovacuum/autoanalyze — stale statistics flipped a plan (e.g., nested loop chosen for what is now 100k rows). Run ANALYZE orders and re-check.',
        'If the plan is honest but slow: look for Seq Scan with massive "Rows Removed by Filter" (missing/wrong index) or a Sort feeding a Limit (composite index ending in the sort column removes it).',
        'Apply the fix: CREATE INDEX CONCURRENTLY with equality columns first, then sort column; or rewrite (replace correlated subquery with window function, select only needed columns to enable index-only scans).',
        'Verify: EXPLAIN ANALYZE shows the new plan; pg_stat_statements mean time drops post-deploy; check pg_stat_user_indexes later to confirm the index is used.',
      ],
      keyTakeaways: [
        'Workflow is the answer: pg_stat_statements → EXPLAIN ANALYZE → estimates vs actuals → statistics or index or rewrite → verify',
        'Bulk data loads outpace autoanalyze — ANALYZE after backfills should be part of the runbook',
        'Name CONCURRENTLY unprompted; blocking writes on a hot table to add an index is a self-inflicted incident',
      ],
    },
    {
      id: 'sc-bloat',
      title: 'A heavily-updated table is 10x its data size and getting slower',
      situation: 'A sessions table (constant UPDATEs) has grown to 200GB holding ~20GB of live data. Scans, even index-only ones, degrade weekly.',
      approach: [
        'Confirm bloat: pg_stat_user_tables n_dead_tup vs n_live_tup, last_autovacuum timestamps; pgstattuple for precise dead-space percentages on table and indexes.',
        'Find why vacuum cannot keep up. Check for snapshot pinning: long-running queries and idle-in-transaction sessions in pg_stat_activity ordered by xact_start — VACUUM cannot reclaim anything the oldest snapshot might see. Also check replication slots holding xmin.',
        'Set idle_in_transaction_session_timeout and fix the app code that holds transactions open across external calls.',
        'Tune per-table autovacuum: ALTER TABLE sessions SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_cost_limit = 2000) — the default "vacuum at 20% dead" means 40GB of garbage accumulates first.',
        'Reduce dead-tuple creation: lower fillfactor (e.g., 80) so HOT updates land on the same page and skip index maintenance; drop indexes on frequently-updated columns that disable HOT.',
        'Reclaim existing bloat online with pg_repack (VACUUM FULL would take ACCESS EXCLUSIVE for hours). REINDEX CONCURRENTLY for bloated indexes.',
      ],
      keyTakeaways: [
        'Bloat root causes are almost always autovacuum starvation or snapshot pinning — diagnose before reclaiming',
        'Plain VACUUM prevents bloat but never shrinks files; pg_repack/VACUUM FULL reclaim it; only one of those is online',
        'fillfactor + HOT updates is the senior-level lever for update-heavy tables',
      ],
    },
    {
      id: 'sc-deadlock',
      title: 'Deadlock errors spike during a flash sale',
      situation: 'Checkout throughput tripled and "deadlock detected" errors went from zero to hundreds per hour. Orders decrement stock for multi-item carts.',
      approach: [
        'Read the deadlock log entries: Postgres prints both transactions\' queries and the rows involved — the error itself is the diagnosis. Pattern: cart [A, B] and cart [B, A] lock product rows in opposite orders.',
        'Immediate mitigation: ensure the application retries serialization/deadlock errors (SQLSTATE 40P01) with jittered backoff — deadlocks abort one victim; retried, it succeeds.',
        'Real fix: impose deterministic lock order. Sort cart items by product_id before the per-item updates, or lock everything up front: SELECT id FROM products WHERE id = ANY($1) ORDER BY id FOR UPDATE.',
        'Better: collapse read-modify-write into one atomic statement — UPDATE products SET stock = stock - d.qty FROM (unnested cart) d WHERE products.id = d.product_id AND stock >= d.qty — fewer lock acquisitions, shorter window.',
        'Shrink transaction scope: no external API calls (payment gateways) inside the locking transaction; reserve stock, commit, then charge.',
        'Verify under load: log_lock_waits = on to watch residual contention; consider advisory locks or queueing for ultra-hot single rows.',
      ],
      keyTakeaways: [
        'Deadlocks are a lock-ordering bug; consistent ordering removes the cycle by construction',
        'Retry handling is mandatory regardless — Postgres resolves deadlocks by aborting, and someone must re-run the victim',
        'Holding row locks across network calls turns milliseconds of contention into seconds',
      ],
    },
    {
      id: 'sc-scale-reads',
      title: 'Read traffic is saturating the primary — scale reads safely',
      situation: 'A content platform\'s primary sits at 90% CPU; 95% of queries are reads. Leadership wants read replicas by next sprint.',
      approach: [
        'First confirm replicas are the right fix: pg_stat_statements — if the top read queries are unindexed scans or N+1 storms, an index or cache is cheaper than infrastructure. Replicas scale efficient reads; they multiply inefficient ones.',
        'Layer the cheap wins: connection pooling (transaction-mode PgBouncer) if connection count is part of the CPU story; application/CDN caching for hot, slowly-changing content.',
        'Add streaming replicas (hot standby) and split traffic at the application or proxy layer: writes and read-your-own-writes to the primary, bulk/anonymous reads to replicas.',
        'Handle replication lag explicitly: pin a user\'s reads to the primary briefly after their writes, or gate on LSN (compare the write\'s pg_current_wal_lsn with replica pg_last_wal_replay_lsn). Monitor lag and stop routing to replicas beyond a threshold.',
        'Mind replica-side query conflicts: long analytics queries on replicas can be cancelled by WAL replay (or pause replay with hot_standby_feedback, which costs primary bloat) — route heavy analytics to a dedicated replica.',
        'Plan failover while you are here: replicas double as HA; test promotion, and use synchronous replication only for the data classes that justify the commit latency.',
      ],
      keyTakeaways: [
        'Replicas are an architecture change with a consistency cost — read-your-own-writes must be designed, not hoped for',
        'Optimize before you multiply: the best first "replica" is often an index or a cache',
        'hot_standby_feedback trades primary-side bloat for replica query stability — know the trade-off by name',
      ],
    },
  ],

  mentalModels: [
    {
      id: 'mm-pipeline',
      title: 'Query Pipeline Mental Model',
      flow: ['SQL text', 'Parser: grammar → tree', 'Rewriter: views expanded inline', 'Planner: candidate plans costed via statistics', 'Cheapest plan wins', 'Executor: volcano tree pulls rows'],
      explanation: [
        'Think of it as a compiler: front-end (parse/analyze), macro expansion (rewrite), optimizer (plan), runtime (execute). Every slow-query conversation maps to one of these stages.',
        'The planner never sees your data — only statistics about it. ANALYZE is how the optimizer learns; stale statistics are lies that produce confident, terrible plans.',
        'Views are free abstractions because the rewriter inlines them; materialized views are the opposite — stored results that go stale.',
      ],
      whatBreaksWithoutIt: 'Without the pipeline model, EXPLAIN output is hieroglyphics and "why is my view slow / why did the plan change after a data load" has no handle.',
      interviewTip: 'Anchor optimization answers in the stage: "the estimate is wrong (statistics), so the planner chose badly (plan), so the executor loops 400k times (runtime)" — that narration is the senior signal.',
    },
    {
      id: 'mm-mvcc',
      title: 'MVCC as Append-Only Versions + Garbage Collector',
      flow: ['Write → new version appended (xmin)', 'Old version stamped expired (xmax)', 'Each txn reads through its snapshot', 'Versions invisible to all snapshots = dead', 'VACUUM = the garbage collector', 'GC blocked by oldest snapshot'],
      explanation: [
        'Postgres tables behave like append-only logs with a garbage collector. Updates never overwrite — they append a new version and mark the old one expired.',
        'A snapshot is a pair of glasses: each transaction wears its own and sees exactly one version of every row. Readers and writers never collide because they look at different versions.',
        'VACUUM is the GC, and like any GC it can only free what nothing references — a single forgotten open transaction is a GC root pinning garbage across the entire database.',
      ],
      whatBreaksWithoutIt: 'Without this model, VACUUM looks like optional maintenance, bloat looks mysterious, and "kill that idle-in-transaction session" sounds unrelated to disk usage.',
      interviewTip: 'Connect the trio in one breath — MVCC creates dead tuples, VACUUM collects them, long transactions block collection — most candidates know the pieces but not the chain.',
    },
    {
      id: 'mm-index-book',
      title: 'Index as a Book Index',
      flow: ['Question about the book', 'Few mentions? → use the index, jump to pages', 'Mentioned on every page? → just read the book', 'Answer printed in the index itself? → never open the book'],
      explanation: [
        'A book index is sorted terms pointing at page numbers — exactly a B-tree pointing at heap pages. Looking up "MVCC" in the index then flipping to page 412 is an Index Scan: fast for rare terms, absurd for a term on every page.',
        'That absurdity is why the planner picks Seq Scan for unselective predicates: reading the book cover-to-cover beats ten thousand index-then-flip round trips.',
        'A covering index is an index entry that already contains the answer ("MVCC: see definition — multi-version concurrency control") — no page flip needed. That is an Index Only Scan.',
        'Composite index order: an index sorted by (author, year) finds "Tolkien, 1954" instantly but is useless for "anything from 1954" — leftmost prefix, exactly like a phone book sorted by last name first.',
      ],
      whatBreaksWithoutIt: 'Without it, "the planner ignored my index" feels like a bug instead of arithmetic, and composite column order stays a memorized rule instead of an obvious consequence.',
      interviewTip: 'Use the phone-book line for composite order — "sorted by last name, first name: useless for finding everyone named James" — it lands instantly with interviewers.',
    },
    {
      id: 'mm-wal-ledger',
      title: 'WAL as the Accountant\'s Ledger',
      flow: ['Every change written to the ledger first (WAL)', 'Commit = ledger entry fsynced', 'Filing cabinets (data pages) updated lazily', 'Crash → replay ledger from last reconciliation (checkpoint)', 'Copy of ledger mailed out = replication'],
      explanation: [
        'An accountant never edits the books in place — every transaction is appended to a journal, and the account balances (data pages) are derived, updatable later, recoverable from the journal.',
        'Commit speed comes from the journal being append-only sequential writes; the expensive random-page updates are deferred and batched.',
        'A checkpoint is reconciliation day: all balances brought current, a line drawn in the journal — recovery never replays past the line. Replication is mailing the journal to a second accountant who maintains an identical set of books.',
      ],
      whatBreaksWithoutIt: 'Without the ledger model, checkpoint tuning, commit latency, PITR, and replica lag look like four unrelated topics instead of one mechanism viewed from four angles.',
      interviewTip: 'When asked about durability, derive the answer: "commit = WAL fsync, pages later, replay on crash" — deriving beats reciting, and it extends naturally into replication questions.',
    },
    {
      id: 'mm-connections',
      title: 'Connections as Hired Staff, Pooling as a Reception Desk',
      flow: ['Each connection = a full-time employee (process + memory)', '1000 clients ≠ 1000 employees', 'Reception desk (PgBouncer) takes all calls', 'Hands work to a small expert team', 'Team size ≈ what CPUs can actually run'],
      explanation: [
        'Hiring a Postgres connection is hiring a full-time employee: a whole process with a desk (memory, caches) — even if they mostly sit idle. A thousand employees do not make a 16-core kitchen faster; they crowd it.',
        'The pooler is a reception desk: thousands of callers, but each request is handed to one of a few dozen workers and the line is returned to the pool the moment the transaction ends.',
        'Transaction pooling means callers never get the same employee twice — so anything that relies on the employee remembering you (session state: SET, session prepared statements, advisory locks) silently breaks.',
      ],
      whatBreaksWithoutIt: 'Without this model, teams "fix" connection exhaustion by raising max_connections — hiring more idle staff for a kitchen that was already full.',
      interviewTip: 'Quote the sizing intuition: useful concurrency ≈ cores, not app threads — then name the transaction-pooling session-state caveats to show you have actually run one.',
    },
  ],

  revision: [
    { id: 'r-pipeline', topic: 'Query Pipeline', importance: 5, thirtySecond: 'Parser → analyzer (catalog) → rewriter (views inlined) → planner (cost-based, statistics-driven) → executor (volcano model). Stale statistics = bad plans.', twoMinute: 'The parser validates grammar; the analyzer resolves names/types. The rewriter macro-expands views — they have no inherent cost. The planner enumerates scan methods, join strategies and orders, costs them in abstract units from pg_statistic, and picks the cheapest. The executor pulls rows through the plan-node tree. Optimization work targets a stage: wrong estimates → statistics; right estimates, slow node → indexes/rewrite.', deepDive: 'Prepared statements skip parse/rewrite and may switch to a generic cached plan after ~5 executions — a trap with skewed parameters (plan_cache_mode controls it). GEQO kicks in for many-join queries. The executor can parallelize (Gather nodes) when cost thresholds are met.', followUps: ['Why are views free but materialized views not?', 'What flips a plan after a bulk load?'], whiteboard: ['SQL → parse → rewrite → plan → execute', 'cost from statistics (ANALYZE)'] },
    { id: 'r-explain', topic: 'EXPLAIN ANALYZE Reading', importance: 5, thirtySecond: 'Read the tree leaf-to-root; find where actual time concentrates; compare estimated rows vs actual rows — big gaps mean statistics problems, not index problems.', twoMinute: 'EXPLAIN = plan + estimates; ANALYZE = really run it, adding actual time/rows/loops; BUFFERS = cache hits vs disk reads. Red flags: Seq Scan with huge "Rows Removed by Filter" (missing index), Sort under a Limit (index could provide order), Nested Loop with loops=100000 (misestimate), Heap Fetches > 0 on Index Only Scan (vacuum needed).', deepDive: 'Costs are unitless (seq page 1.0, random page 4.0 — tune random_page_cost ~1.1 on SSD). Total node time = actual time * loops. EXPLAIN ANALYZE on writes really writes — wrap in BEGIN...ROLLBACK. auto_explain logs plans of slow production queries automatically.', followUps: ['Seq vs index vs bitmap — what drives the choice?', 'What does shared read vs hit imply?'], whiteboard: ['estimate vs actual rows = the diagnosis', 'Rows Removed by Filter = missing index smell'] },
    { id: 'r-mvcc', topic: 'MVCC / xmin / xmax', importance: 5, thirtySecond: 'Updates append a new tuple version (xmin = creator txid) and expire the old (xmax). Snapshots pick visible versions. Readers never block writers. Dead versions await VACUUM.', twoMinute: 'Every tuple header carries xmin/xmax; visibility = "creator committed before my snapshot, not yet expired for me". UPDATE rewrites the whole row (ctid changes); DELETE only stamps xmax. HOT updates skip index maintenance when no indexed column changed and the page has room. The cost model: read/write concurrency without locks, paid for in heap garbage.', deepDive: 'Snapshot = (xmin horizon, xmax, in-progress list). Commit status lives in CLOG; hint bits cache it on tuples (why first read after bulk load writes pages). 32-bit txids wrap — freezing replaces old xmins; blocked freezing eventually halts writes (famous outages).', followUps: ['Why does long txn bloat untouched tables?', 'What is a HOT update?'], whiteboard: ['UPDATE = INSERT new + expire old', 'visibility decided per snapshot'] },
    { id: 'r-vacuum', topic: 'VACUUM / autovacuum / bloat', importance: 5, thirtySecond: 'VACUUM reclaims dead tuples, maintains free-space + visibility maps, freezes txids. Autovacuum default fires at ~20% dead — too lazy for big tables. Bloat = garbage outpacing collection.', twoMinute: 'Plain VACUUM marks space reusable but never shrinks files; VACUUM FULL rewrites under ACCESS EXCLUSIVE (use pg_repack online instead). Visibility map enables index-only scans — "Heap Fetches" climbing means vacuum is behind. Long transactions, idle-in-transaction sessions, and stale replication slots pin the xmin horizon so nothing newer can be reclaimed. Tune per table: scale_factor 0.01 on hot large tables.', deepDive: 'Autovacuum cost-based throttling (cost_limit/cost_delay) often makes it too slow rather than too aggressive — raise limits on busy systems. Anti-wraparound vacuums ignore thresholds and cannot be skipped. Index bloat needs REINDEX CONCURRENTLY; B-trees never merge pages.', followUps: ['Why can\'t VACUUM shrink the file?', 'What pins the xmin horizon?'], whiteboard: ['dead tuples → VACUUM → reusable space', 'long txn = GC root'] },
    { id: 'r-indexes', topic: 'Index Types & Design', importance: 5, thirtySecond: 'B-tree default (=, ranges, ORDER BY). GIN: JSONB/arrays/full-text. GiST: overlap/nearest. BRIN: huge correlated tables. Composite: equality first then sort; leftmost prefix rules.', twoMinute: 'Composite (a,b) serves a and a+b, not b alone. Partial indexes cover hot subsets (WHERE status=\'pending\'). Covering (INCLUDE) enables index-only scans. Expression indexes must match the query expression exactly (lower(email)). Every index taxes every write and can disable HOT updates — index what queries need, audit pg_stat_user_indexes for idx_scan=0.', deepDive: 'GIN fastupdate batches insertions in a pending list (query-time cost until cleaned). BRIN only works when physical order correlates with values — check pg_stats.correlation. Build with CONCURRENTLY (two scans, can leave INVALID on failure). Unique constraints are B-trees; exclusion constraints are GiST.', followUps: ['(a,b) vs (b,a) — decide from queries', 'Why can adding an index slow writes meaningfully?'], whiteboard: ['equality cols → range/sort col', 'partial = small + hot', 'INCLUDE = no heap visit'] },
    { id: 'r-isolation', topic: 'Isolation Levels', importance: 5, thirtySecond: 'Default Read Committed: snapshot per statement — allows non-repeatable reads, phantoms, lost updates. Repeatable Read: snapshot per txn. Serializable: SSI aborts anomalies (write skew). Upper levels need retries.', twoMinute: 'No dirty reads at any level in PG. Lost update under RC: two read-modify-writes interleave — fix with atomic UPDATE or FOR UPDATE. RR raises serialization errors on concurrent updates to the same row and (beyond the standard) blocks phantoms. Serializable adds read/write dependency tracking; write skew (disjoint writes breaking a shared invariant) is its unique catch. Retry on SQLSTATE 40001.', deepDive: 'SSI is optimistic: predicate locks (SIReadLocks) monitor, never block; aborts happen on dangerous structures (rw-antidependency cycles). Materializing the conflict (locking a common row) is the RC-level alternative to Serializable for known invariants.', followUps: ['Concrete write-skew story', 'Why must retries re-run the whole transaction?'], whiteboard: ['RC: per-statement snapshot', 'RR: per-txn snapshot + conflict errors', 'SER: + dependency cycles → abort'] },
    { id: 'r-locking', topic: 'Locks / FOR UPDATE / Deadlocks', importance: 4, thirtySecond: 'Writes take row locks; second writer to a row waits. FOR UPDATE locks on read; SKIP LOCKED = job queues. Deadlock = lock cycle; detected after 1s, one txn aborted — prevent with consistent lock ordering.', twoMinute: 'Plain SELECT takes only ACCESS SHARE — conflicts only with ACCESS EXCLUSIVE (DROP, TRUNCATE, many ALTERs, VACUUM FULL). Lock queues are FIFO: an ALTER waiting behind a long query blocks everything behind it (use lock_timeout in migrations). Diagnose with pg_locks + pg_blocking_pids. Deadlock prevention: ORDER BY id in locking selects, short transactions, no external calls while holding locks.', deepDive: 'Row lock strengths: UPDATE/NO KEY UPDATE/SHARE/KEY SHARE — FKs take KEY SHARE, why FK churn rarely blocks updates of non-key columns. Row locks live in tuple headers (no lock-table exhaustion, unlike SQL Server escalation). Advisory locks give app-defined mutexes.', followUps: ['Why does ALTER TABLE queue everyone?', 'Design a worker queue with SKIP LOCKED'], whiteboard: ['A:1→wants 2; B:2→wants 1 = cycle', 'fix: lock in sorted order'] },
    { id: 'r-wal', topic: 'WAL & Checkpoints', importance: 4, thirtySecond: 'Log before data: commit = WAL fsync (sequential); dirty pages flushed lazily. Crash recovery replays WAL since the last checkpoint. Checkpoints bound recovery time.', twoMinute: 'WAL turns random page writes into one sequential append at commit. Checkpoint flushes all dirty pages and records the replay start point; spread by checkpoint_completion_target. First page-touch after a checkpoint logs a full-page image (torn-page safety) — WAL volume spikes post-checkpoint. synchronous_commit=off risks last-moments commit loss, never corruption. PITR = base backup + archived WAL replayed to a timestamp.', deepDive: 'LSN = byte position in WAL — the global ordering used everywhere (replication lag = LSN delta). Frequent checkpoints raise full-page-write volume; infrequent ones lengthen recovery — max_wal_size tunes the balance. wal_level=logical enables logical decoding for CDC.', followUps: ['Commit vs checkpoint?', 'Why do full-page writes exist?'], whiteboard: ['change → WAL append → commit ack', 'checkpoint = replay horizon'] },
    { id: 'r-replication', topic: 'Replication Basics', importance: 4, thirtySecond: 'Streaming replication ships WAL to byte-identical hot standbys — read scaling + failover. Async by default → lag → read-your-own-writes bugs. Logical replication = row-level events, selective, cross-version.', twoMinute: 'Physical: replica replays the primary\'s WAL; readable (hot standby); promotion = failover. Async lag means a post-write read on a replica can miss the write — pin to primary after writes or wait on LSN. Synchronous replication (synchronous_standby_names) trades commit latency for zero-loss failover. Logical: publications/subscriptions per table, no DDL replication — used for upgrades and CDC pipelines.', deepDive: 'Replica query conflicts: replay cancels long replica queries (or hot_standby_feedback delays cleanup at the cost of primary bloat). Replication slots prevent WAL removal while a consumer lags — and orphaned slots fill disks. Quorum sync (ANY 1 of N) balances safety and latency.', followUps: ['Fix read-your-own-writes over replicas', 'What can an orphaned replication slot do?'], whiteboard: ['primary WAL → replica replay', 'async = lag window'] },
    { id: 'r-pooling', topic: 'Connections & PgBouncer', importance: 4, thirtySecond: 'One connection = one forked process with real memory; throughput peaks at low hundreds. PgBouncer transaction mode multiplexes thousands of clients onto tens of server connections.', twoMinute: 'Costs per connection: process memory, catalog caches, work_mem per sort/hash during execution, shared-structure contention. Fleet math makes it explode: 50 pods * 20 conns = 1000. Transaction pooling shares hardest but breaks session state: SET (non-LOCAL), session prepared statements, advisory locks, LISTEN/NOTIFY. Size the server pool near cores * small factor, not per app thread.', deepDive: 'work_mem is per sort/hash node, not per connection — high max_connections * high work_mem is OOM math. PgBouncer 1.21+ tracks protocol-level prepared statements in transaction mode. Serverless platforms ship built-in poolers (RDS Proxy, Supabase pooler) for cold-start connection storms.', followUps: ['Session vs transaction vs statement pooling?', 'What breaks under transaction pooling?'], whiteboard: ['1000 clients → pooler → ~40 backends'] },
    { id: 'r-jsonb', topic: 'JSONB', importance: 3, thirtySecond: 'Binary JSON: indexable, fast operators (@>, ->>). json = stored text, re-parsed. GIN for containment; B-tree expression index for hot scalar keys. Columns for queried fields, JSONB for variable payloads.', twoMinute: 'Updates rewrite the whole datum (new MVCC version) — frequent small edits to big documents cause write amplification and TOAST churn. jsonb_path_ops GIN is smaller, containment-only. GIN cannot serve ->> equality — expression B-tree does. Promote JSONB fields to columns once they appear in WHERE/JOIN regularly: types, constraints, statistics all improve.', deepDive: 'TOAST stores oversized values compressed out-of-line in 2KB chunks; reading a huge JSONB detoasts it entirely. Statistics on JSONB internals are weak — planner estimates on payload predicates are guesses, another argument for promoting hot fields. jsonpath (PG 12+) gives standard path queries.', followUps: ['Index payload->>\'status\' correctly', 'Why are big-document updates expensive?'], whiteboard: ['@> → GIN', '->> equality → expression B-tree'] },
    { id: 'r-partitioning', topic: 'Partitioning', importance: 3, thirtySecond: 'One logical table, physical children by RANGE/LIST/HASH. Pruning skips irrelevant partitions; retention = instant DROP of old partitions instead of mega-DELETE bloat.', twoMinute: 'RANGE by time dominates. The partition key must appear in predicates for pruning and in every unique constraint (no global unique indexes). Each partition has its own indexes and autovacuum — bloat control parallelizes. Partition at the 100GB+/maintenance-pain threshold, not preemptively: many partitions inflate planning time.', deepDive: 'Runtime pruning handles parameterized plans; partition-wise joins/aggregates exist behind enable_* settings. DETACH CONCURRENTLY avoids blocking. Default partition catches strays but can block adding new partitions if it holds overlapping rows. pg_partman automates rolling time windows.', followUps: ['Why is DROP partition superior to DELETE?', 'What breaks with unique constraints?'], whiteboard: ['parent → monthly children', 'WHERE time → prune', 'retention = DETACH+DROP'] },
    { id: 'r-optimization-workflow', topic: 'Optimization Workflow', importance: 5, thirtySecond: 'pg_stat_statements (sort by total time) → EXPLAIN (ANALYZE, BUFFERS) → estimates vs actuals → fix statistics, index, or rewrite → verify. Watch for N+1: fast query, absurd call count.', twoMinute: 'Total time finds where the database spends its life — often a 2ms query called 50k/min, not the 30s report. In the plan, find the hot node: misestimate → ANALYZE/statistics target/extended statistics; honest plan → composite/partial/covering index, or rewrite (window function instead of correlated subquery, select fewer columns, batch IN instead of loops). Build CONCURRENTLY. Verify in pg_stat_statements after deploy.', deepDive: 'Extended statistics (CREATE STATISTICS) fix correlated-column misestimates (city+zip). auto_explain captures slow plans in production. Sometimes the answer is application-side: caching, batching, pagination strategy (keyset over OFFSET). Always check pg_stat_user_indexes later — unused indexes are pure write tax.', followUps: ['Mean vs total time — which first?', 'When is the fix not an index?'], whiteboard: ['find (pg_stat_statements)', 'explain (ANALYZE, BUFFERS)', 'fix (stats | index | rewrite)', 'verify'] },
    { id: 'r-nplus1', topic: 'N+1 Problem', importance: 4, thirtySecond: '1 list query + N per-row relation queries = N+1 round trips. Each is fast; the count kills latency. Fix: JOIN, batched IN/ANY, or ORM eager loading.', twoMinute: 'Signature in pg_stat_statements: trivial query with enormous calls. 100 orders → 1 + 100 customer lookups at ~1ms each = visible latency and connection-pool pressure. Fixes by layer: SQL (JOIN or WHERE id = ANY($1)), ORM (includes/select_related/prefetch), GraphQL (dataloader batching per request tick). Beware over-eager loading: joining three one-to-many relations multiplies rows cartesianly — sometimes two queries beat one join.', deepDive: 'json_agg in a lateral subquery returns parent+children in one round trip without row multiplication. Detection: APM span counts per request, or calls/total ratio in pg_stat_statements. The fix is access-pattern design — the database itself was never slow.', followUps: ['When do two queries beat one JOIN?', 'How does a dataloader batch?'], whiteboard: ['1 + N round trips → 1 or 2 queries'] },
  ],
}

export default postgresql
