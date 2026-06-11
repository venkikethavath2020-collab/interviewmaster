import type { Technology } from '../../types/content'

const sql: Technology = {
  id: 'sql',
  name: 'SQL',
  icon: 'Sq',
  color: '#e38c00',
  tagline: 'The declarative language of relational data — you state what, the engine decides how.',
  category: 'database',

  overview: {
    what: 'SQL (Structured Query Language) is the declarative standard for defining, querying, and manipulating relational data. You describe the result you want; a query optimizer decides the access paths, join order, and algorithms. Core sublanguages: DQL (SELECT), DML (INSERT/UPDATE/DELETE), DDL (CREATE/ALTER/DROP), DCL (GRANT/REVOKE), TCL (COMMIT/ROLLBACK).',
    why: 'Born from Codd\'s relational model (1970) and IBM\'s System R, standardized since 1986. Fifty years later it remains the lingua franca of data because the relational model — sets of rows, joined by values, protected by constraints — matches how businesses actually reason about data.',
    problemsSolved: [
      'Ad-hoc querying of structured data without writing imperative traversal code',
      'Data integrity enforced by the engine: keys, constraints, transactions — not by every application re-implementing the rules',
      'A portable skill and language: the same JOIN works (mostly) on Postgres, MySQL, SQL Server, Oracle, SQLite',
      'Set-based operations: one statement updates a million rows; the optimizer parallelizes and indexes for you',
    ],
    whenToUse: [
      'Structured data with relationships — orders/customers/products — which is most business data',
      'Anywhere correctness matters: constraints and ACID transactions catch bugs applications miss',
      'Reporting and analytics: aggregation, window functions, and joins are the native vocabulary',
      'As the interface to warehouses (BigQuery, Snowflake, Redshift) — SQL outlived the NoSQL detour',
    ],
    whenNotToUse: [
      'Genuinely schema-less or rapidly mutating structures where rows/columns fight you (though JSONB columns close much of this gap)',
      'Graph traversals of unbounded depth — recursive CTEs work but graph databases express it better',
      'Pure key-value access at cache latencies',
      'Full-text relevance ranking at search-engine scale — dedicated engines (Elasticsearch) outclass LIKE and basic FTS',
    ],
  },

  internals: [
    {
      id: 'logical-order',
      title: 'Logical Query Processing Order',
      summary: 'SQL is written SELECT-first but evaluated FROM-first: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. This single fact explains most "why doesn\'t this work" SQL errors.',
      details: [
        'FROM (and JOINs) builds the working row set first. WHERE filters individual rows — before any grouping, so aggregates cannot appear in WHERE.',
        'GROUP BY collapses rows into groups; HAVING filters those groups — this is why HAVING can use aggregates and WHERE cannot.',
        'SELECT runs after grouping: only group keys and aggregates are legal in the select list of a grouped query. Column aliases are born here — which is why WHERE alias = ... fails (WHERE ran earlier) but ORDER BY alias works (ORDER BY runs later).',
        'ORDER BY sorts the nearly-final result; LIMIT/OFFSET (or FETCH FIRST) trims it last. Without ORDER BY, LIMIT returns an arbitrary, non-deterministic subset.',
        'Window functions evaluate with SELECT — after WHERE/GROUP BY/HAVING — so you cannot filter on a window function directly; wrap it in a subquery or CTE and filter outside.',
        'This is the LOGICAL order — the standard\'s definition of meaning. Optimizers reorder physical execution freely (predicate pushdown, join reordering) as long as the result matches.',
      ],
      diagram: ['FROM + JOIN: build row set', 'WHERE: filter rows', 'GROUP BY: collapse to groups', 'HAVING: filter groups', 'SELECT: project, aliases, window functions', 'DISTINCT', 'ORDER BY: sort', 'LIMIT / OFFSET: trim'],
      code: {
        lang: 'sql',
        code: `SELECT department, AVG(salary) AS avg_sal     -- 5th
FROM employees                                 -- 1st
WHERE hire_date > '2020-01-01'                 -- 2nd (no aggregates here)
GROUP BY department                            -- 3rd
HAVING AVG(salary) > 50000                     -- 4th (aggregates OK)
ORDER BY avg_sal DESC                          -- 6th (alias visible now)
LIMIT 5;                                       -- 7th`,
        caption: 'Each clause\'s rules (no aggregates in WHERE, no aliases in WHERE, aliases in ORDER BY) fall straight out of the order.',
      },
    },
    {
      id: 'joins',
      title: 'JOINs: All Types and Their Semantics',
      summary: 'A join matches rows between tables by a predicate. INNER keeps matches only; LEFT/RIGHT keep all rows from one side (NULL-padding the other); FULL keeps both; CROSS pairs everything; a self-join joins a table to itself.',
      details: [
        'INNER JOIN: only rows with a match on both sides. The default meaning of bare JOIN.',
        'LEFT (OUTER) JOIN: every left row survives; unmatched ones get NULLs for right-side columns. "All customers, with their orders if any." The unmatched-rows idiom: LEFT JOIN ... WHERE right.id IS NULL finds left rows with no match (anti-join).',
        'RIGHT JOIN: mirror of LEFT — rarely written in practice; swap table order and use LEFT for readability.',
        'FULL (OUTER) JOIN: all rows from both sides, matched where possible, NULL-padded otherwise. Reconciliation queries: "what is in A, in B, in both." (MySQL lacks it — emulate with LEFT UNION RIGHT.)',
        'CROSS JOIN: Cartesian product — every left row paired with every right row. Deliberate uses: generating combinations (all dates x all products for gap-filling reports).',
        'Self-join: a table aliased twice, joined to itself — employees to their managers, events to previous events. The aliases are mandatory; conceptually it is two copies.',
        'The classic trap: a condition on the RIGHT table in WHERE turns a LEFT JOIN into an INNER JOIN, because WHERE filters after the join and NULL fails almost every comparison. Put right-table conditions in the ON clause to keep the outer semantics.',
        'Joining one-to-many multiplies rows: a customer with 3 orders appears 3 times. Aggregating after such a join without care double-counts — aggregate before joining, or use COUNT(DISTINCT ...).',
      ],
      diagram: ['INNER: intersection only', 'LEFT: all left + matches', 'RIGHT: all right + matches', 'FULL: everything, NULL-padded', 'CROSS: every pair', 'SELF: same table, two aliases'],
      code: {
        lang: 'sql',
        code: `-- customers with no orders (anti-join idiom)
SELECT c.id, c.name
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;

-- trap: this WHERE turns the LEFT JOIN into an INNER JOIN
SELECT c.name, o.total
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.status = 'paid';          -- NULL status rows eliminated!

-- fix: keep the filter in ON to preserve all customers
LEFT JOIN orders o ON o.customer_id = c.id AND o.status = 'paid'`,
      },
    },
    {
      id: 'grouping',
      title: 'GROUP BY, Aggregates & HAVING vs WHERE',
      summary: 'GROUP BY partitions rows by key values; aggregates (COUNT, SUM, AVG, MIN, MAX) compute one value per group. WHERE filters rows before grouping; HAVING filters groups after.',
      details: [
        'After GROUP BY, each group becomes one output row. The select list may contain only the grouping columns and aggregates — anything else is ambiguous (which row\'s value?). MySQL historically allowed it (picking arbitrary values); standard engines reject it.',
        'WHERE vs HAVING is an efficiency question too: WHERE prunes rows before the expensive grouping; a condition that does not involve aggregates belongs in WHERE even though HAVING would accept it.',
        'COUNT(*) counts rows; COUNT(col) counts non-NULL values of col; COUNT(DISTINCT col) counts unique non-NULL values. The difference is a stock interview question.',
        'Aggregates ignore NULLs (except COUNT(*)): AVG(salary) averages only non-NULL salaries — which can silently skew metrics. SUM over an empty set is NULL, not 0 (wrap in COALESCE).',
        'FILTER clause (standard, supported by Postgres): COUNT(*) FILTER (WHERE status = \'failed\') — conditional aggregation without CASE gymnastics; the portable form is SUM(CASE WHEN ... THEN 1 ELSE 0 END).',
        'GROUPING SETS / ROLLUP / CUBE compute multiple grouping levels in one pass — subtotals and grand totals without UNIONing three queries.',
      ],
      code: {
        lang: 'sql',
        code: `SELECT department,
       COUNT(*)                                   AS headcount,
       COUNT(manager_id)                          AS with_manager,  -- NULLs skipped
       AVG(salary)                                AS avg_salary,
       COUNT(*) FILTER (WHERE salary > 100000)    AS high_earners
FROM employees
WHERE active                       -- row filter: BEFORE grouping
GROUP BY department
HAVING COUNT(*) >= 5;              -- group filter: AFTER aggregation`,
      },
    },
    {
      id: 'subqueries-ctes',
      title: 'Subqueries, Correlated Subqueries & CTEs',
      summary: 'A subquery nests a query inside another; a correlated subquery references the outer row and conceptually re-executes per row; a CTE (WITH) names a subquery for readability and reuse — and can recurse.',
      details: [
        'Scalar subquery: returns one value — usable anywhere an expression goes. Errors at runtime if it returns more than one row.',
        'IN / EXISTS subqueries: membership tests in WHERE. Derived table: a subquery in FROM, queried like a table (must be aliased).',
        'Correlated subquery: references outer-query columns (WHERE e.dept_id = outer.dept_id) — logically evaluated once per outer row. Optimizers often decorrelate into joins, but when they cannot, it is O(n) subquery executions: the classic hidden performance cliff.',
        'CTE: WITH name AS (...) — a named, readable building block; can be referenced multiple times; required form for recursion. Multiple CTEs chain: WITH a AS (...), b AS (SELECT ... FROM a).',
        'Recursive CTE: WITH RECURSIVE walks hierarchies — anchor member UNION ALL recursive member referencing itself; iterates until the recursive member returns no rows. Org charts, category trees, graph reachability, number/date series.',
        'Materialization caveat: some engines (Postgres pre-12 always; later versions when referenced twice or marked MATERIALIZED) compute the CTE once into a buffer, blocking predicate pushdown — a CTE is not automatically free abstraction.',
      ],
      diagram: ['Scalar subquery → one value', 'IN / EXISTS → membership test', 'Derived table → subquery in FROM', 'Correlated → re-runs per outer row', 'CTE → named block, chainable', 'Recursive CTE → anchor UNION ALL self-reference'],
      code: {
        lang: 'sql',
        code: `-- recursive CTE: an org chart from one root
WITH RECURSIVE chain AS (
  SELECT id, name, manager_id, 1 AS depth
  FROM employees WHERE id = 1                 -- anchor
  UNION ALL
  SELECT e.id, e.name, e.manager_id, c.depth + 1
  FROM employees e
  JOIN chain c ON e.manager_id = c.id         -- recursive step
)
SELECT * FROM chain ORDER BY depth;`,
      },
    },
    {
      id: 'window-functions',
      title: 'Window Functions: OVER, PARTITION BY, Frames',
      summary: 'Window functions compute a value per row over a related set of rows ("window") without collapsing them — ranking, running totals, and neighbor access (LAG/LEAD) in one scan.',
      details: [
        'OVER (PARTITION BY x ORDER BY y) defines the window: PARTITION BY restarts the calculation per group (like GROUP BY but rows survive); ORDER BY defines sequence within the partition.',
        'Ranking trio: ROW_NUMBER() — unique sequence regardless of ties (1,2,3,4); RANK() — ties share a rank and create gaps (1,2,2,4); DENSE_RANK() — ties share, no gaps (1,2,2,3). Choosing the right one for "Nth highest" is the interview point: DENSE_RANK for "Nth distinct value".',
        'LAG(col, n) / LEAD(col, n) read the previous/next row\'s value within the partition — period-over-period deltas, gap detection, sessionization, all without self-joins.',
        'Aggregates as windows: SUM(amount) OVER (PARTITION BY user ORDER BY day) = running total. NTILE(n) buckets rows; FIRST_VALUE/LAST_VALUE read window edges (LAST_VALUE needs an explicit frame to mean what you expect).',
        'Frames: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW vs RANGE ... — the default frame with ORDER BY is RANGE up to current row, which includes ALL peer rows of a tie; ROWS counts physical rows. Moving averages: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW.',
        'Windows evaluate during SELECT — to filter on one (rn = 1), wrap the query in a subquery/CTE and filter outside. Some engines offer QUALIFY as a shortcut.',
      ],
      diagram: ['Rows partitioned by key', 'Ordered within partition', 'Frame selects rows around current', 'Function computes per row', 'All rows preserved (no collapse)'],
      code: {
        lang: 'sql',
        code: `SELECT day, amount,
  SUM(amount)  OVER (ORDER BY day)                          AS running_total,
  AVG(amount)  OVER (ORDER BY day
                     ROWS BETWEEN 6 PRECEDING
                              AND CURRENT ROW)              AS week_moving_avg,
  LAG(amount)  OVER (ORDER BY day)                          AS prev_day,
  amount - LAG(amount) OVER (ORDER BY day)                  AS day_over_day
FROM daily_sales;`,
        caption: 'GROUP BY answers "one row per group"; window functions answer "every row, with group context".',
      },
    },
    {
      id: 'null-logic',
      title: 'NULL & Three-Valued Logic',
      summary: 'NULL means "unknown", not zero or empty. Comparisons with NULL yield UNKNOWN, and WHERE keeps only TRUE — the root of SQL\'s most reliable bug family.',
      details: [
        'NULL = NULL is UNKNOWN, not TRUE; so is NULL <> 5. Test with IS NULL / IS NULL — never = NULL (always filters everything out).',
        'WHERE discards UNKNOWN rows. The deadly pattern: WHERE col <> \'x\' silently drops rows where col IS NULL — they are neither equal nor unequal, they are unknown.',
        'NOT IN with a NULL in the list returns no rows at all: x NOT IN (1, NULL) expands to x <> 1 AND x <> NULL — the second term is UNKNOWN, poisoning the conjunction. This is THE reason to prefer NOT EXISTS.',
        'Aggregates skip NULLs (COUNT(col), AVG, SUM); COUNT(*) does not. NULL in expressions propagates: 5 + NULL = NULL, \'a\' || NULL = NULL (engine-dependent for concat).',
        'Sorting: NULLs sort first or last depending on engine (Postgres: last for ASC); NULLS FIRST/LAST overrides. UNIQUE constraints typically allow multiple NULLs (not equal to each other); GROUP BY and DISTINCT treat NULLs as one group (distinctness ≠ equality).',
        'Tools: COALESCE(a, b, ...) first non-NULL; NULLIF(a, b) NULL if equal (divide-by-zero guard: x / NULLIF(y, 0)); IS DISTINCT FROM — NULL-safe comparison that treats two NULLs as equal.',
      ],
      diagram: ['Comparison touches NULL', 'Result = UNKNOWN (not TRUE/FALSE)', 'WHERE keeps TRUE only', 'Row silently dropped', 'Fix: IS NULL / COALESCE / NOT EXISTS / IS DISTINCT FROM'],
      code: {
        lang: 'sql',
        code: `-- looks correct, loses every row where status IS NULL
SELECT * FROM tasks WHERE status <> 'done';

-- intent-preserving version
SELECT * FROM tasks WHERE status <> 'done' OR status IS NULL;
-- or: WHERE status IS DISTINCT FROM 'done'

-- NOT IN poisoned by NULL: returns ZERO rows if any manager_id is NULL
SELECT * FROM employees
WHERE id NOT IN (SELECT manager_id FROM employees);
-- safe form:
SELECT e.* FROM employees e
WHERE NOT EXISTS (SELECT 1 FROM employees m WHERE m.manager_id = e.id);`,
      },
    },
    {
      id: 'normalization-keys',
      title: 'Normalization, Keys & Constraints',
      summary: '1NF–3NF remove redundancy by making every non-key column depend on the key, the whole key, and nothing but the key. Keys and constraints make the engine enforce business rules. Denormalize deliberately, for measured read performance.',
      details: [
        '1NF: atomic values, no repeating groups — no comma-separated phone lists in one column; one value per cell, rows unique.',
        '2NF: 1NF + no partial dependency — every non-key column depends on the WHOLE composite key, not part of it. In order_items(order_id, product_id, product_name): product_name depends only on product_id → move it out.',
        '3NF: 2NF + no transitive dependency — non-key columns must not depend on other non-key columns. employee → department_id → department_name: department_name belongs in a departments table. Mnemonic: "the key, the whole key, and nothing but the key."',
        'Why: redundancy causes update anomalies (change a department name in 5,000 rows, miss 3), insert anomalies (cannot add a department with no employees), delete anomalies (deleting the last employee erases the department).',
        'Denormalization is a conscious trade: duplicate or pre-aggregate to cut joins for read-heavy paths (reporting tables, counter caches, warehouse star schemas) — accepting that the application/jobs must now keep copies consistent. Normalize first; denormalize from evidence.',
        'Keys: primary (unique + not null, one per table), candidate (could have been primary), foreign (references a parent; blocks orphans; ON DELETE CASCADE/SET NULL/RESTRICT decide child fate), natural vs surrogate (emails change — surrogate ids are stable). Constraints: UNIQUE, NOT NULL, CHECK (price > 0), DEFAULT — every rule the engine enforces is a class of bug applications cannot write.',
      ],
      code: {
        lang: 'sql',
        code: `CREATE TABLE orders (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status      TEXT   NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending','paid','shipped','cancelled')),
  total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, idempotency_key)
);`,
        caption: 'Constraints are executable documentation: the schema states the business rules and the engine enforces them.',
      },
    },
  ],

  keywords: [
    {
      id: 'kw-joins',
      term: 'JOIN types',
      importance: 5,
      whyAsked: 'Joins are the heart of relational querying; the LEFT-JOIN-plus-WHERE trap and the anti-join idiom separate practitioners from syntax memorizers.',
      explanation: 'INNER keeps matched rows only; LEFT keeps all left rows NULL-padding unmatched; RIGHT mirrors; FULL keeps both sides; CROSS produces every pair; self-join aliases one table twice. Filters on the outer side\'s opposite table belong in ON, not WHERE, or the outer join silently degrades to inner.',
      realWorldExample: '"Customers who never ordered" = LEFT JOIN orders ... WHERE orders.id IS NULL — the anti-join idiom asked in some form at nearly every company.',
      commonMistakes: [
        'Right-table predicate in WHERE after a LEFT JOIN — kills the NULL-padded rows',
        'Forgetting one-to-many joins multiply rows, then double-counting in SUM/COUNT',
        'Writing RIGHT JOIN where reordering to LEFT would read naturally',
      ],
      followUps: ['ON vs WHERE in an outer join?', 'Find rows in A not in B — three ways (LEFT...IS NULL, NOT EXISTS, EXCEPT)', 'What does joining on a non-unique key do to row counts?'],
      diagram: ['INNER = intersection', 'LEFT = all left + matched right', 'FULL = union, NULL-padded', 'CROSS = Cartesian product'],
    },
    {
      id: 'kw-order-execution',
      term: 'Logical Query Order',
      importance: 5,
      whyAsked: 'One fact that explains a dozen rules — interviewers use it to check whether your SQL knowledge is principled or pattern-matched.',
      explanation: 'FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. Consequences: no aggregates in WHERE (groups don\'t exist yet), no SELECT aliases in WHERE (not projected yet), aliases fine in ORDER BY, window functions not filterable without a wrapper, LIMIT without ORDER BY is non-deterministic.',
      commonMistakes: [
        'WHERE row_num = 1 on a window function — needs a subquery/CTE wrapper',
        'Assuming written order = execution order',
        'Treating logical order as physical: optimizers reorder freely, semantics stay fixed',
      ],
      followUps: ['Why can HAVING use aggregates but WHERE cannot?', 'Why does WHERE alias = 1 fail but ORDER BY alias work?'],
      diagram: ['FROM', 'WHERE', 'GROUP BY', 'HAVING', 'SELECT', 'ORDER BY', 'LIMIT'],
    },
    {
      id: 'kw-window',
      term: 'Window Functions',
      importance: 5,
      whyAsked: 'The modern dividing line in SQL interviews: top-N per group, running totals, and deltas are nearly impossible to write cleanly without them.',
      explanation: 'Compute per-row values over a partition without collapsing rows: ROW_NUMBER/RANK/DENSE_RANK for ranking (ties: unique/gaps/no-gaps), LAG/LEAD for neighbors, aggregates OVER for running totals. PARTITION BY restarts per group; ORDER BY sequences; frames (ROWS BETWEEN ...) bound the calculation window.',
      realWorldExample: 'Top 3 products per category, day-over-day revenue change, deduplication keeping the newest row — all one-scan window queries.',
      commonMistakes: [
        'RANK vs DENSE_RANK for "Nth highest distinct salary" — RANK\'s gaps skip values',
        'Filtering a window function in the same SELECT\'s WHERE',
        'LAST_VALUE without an explicit frame (default frame ends at current row)',
      ],
      followUps: ['ROW_NUMBER vs RANK vs DENSE_RANK on ties?', 'ROWS vs RANGE frames?', 'Rewrite a greatest-per-group correlated subquery as a window query'],
    },
    {
      id: 'kw-null',
      term: 'NULL / Three-Valued Logic',
      importance: 5,
      whyAsked: 'NULL traps produce silently wrong results, not errors — exactly the bug class senior engineers are paid to prevent.',
      explanation: 'NULL is "unknown": any comparison with it yields UNKNOWN, and WHERE keeps only TRUE. col <> \'x\' drops NULL rows; NOT IN with a NULL in the subquery returns nothing; aggregates skip NULLs (but COUNT(*) doesn\'t). Tools: IS NULL, COALESCE, NULLIF, IS DISTINCT FROM, NOT EXISTS instead of NOT IN.',
      realWorldExample: 'A churn report using WHERE plan <> \'enterprise\' silently excluded every customer with a NULL plan — thousands of rows missing, no error, discovered months later.',
      commonMistakes: [
        '= NULL instead of IS NULL',
        'NOT IN against a nullable column',
        'COUNT(col) where COUNT(*) was meant (or vice versa)',
      ],
      followUps: ['Why does NOT IN with NULL return zero rows — expand the predicate', 'How do UNIQUE constraints treat NULLs?', 'What is IS DISTINCT FROM?'],
    },
    {
      id: 'kw-group-having',
      term: 'GROUP BY & HAVING',
      importance: 4,
      whyAsked: 'Aggregation is the bread and butter of business queries; WHERE-vs-HAVING placement tests both correctness and efficiency instincts.',
      explanation: 'GROUP BY collapses rows sharing key values into one row each; only group keys and aggregates may be selected. WHERE filters rows before grouping (cheaper, no aggregates allowed); HAVING filters the resulting groups (aggregates allowed). COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col) differ on NULLs and uniqueness.',
      commonMistakes: [
        'Selecting a non-grouped, non-aggregated column',
        'Putting row-level conditions in HAVING — correct result, wasted work',
        'Forgetting SUM/AVG ignore NULLs and SUM of no rows is NULL',
      ],
      followUps: ['Conditional aggregation: pivot counts per status in one query', 'GROUPING SETS / ROLLUP for subtotals?'],
    },
    {
      id: 'kw-exists-in',
      term: 'EXISTS vs IN',
      importance: 4,
      whyAsked: 'A classic correctness-plus-performance comparison with a NULL landmine attached.',
      explanation: 'IN tests membership in a value list/subquery result; EXISTS tests whether the correlated subquery returns any row (short-circuits on first match, projected columns irrelevant — SELECT 1). Semantics diverge on NULLs: NOT IN with any NULL yields no rows; NOT EXISTS behaves intuitively. Modern optimizers usually plan IN and EXISTS identically (semi-join); NOT EXISTS vs NOT IN can differ in both plan and meaning.',
      commonMistakes: [
        'NOT IN on a nullable subquery — the headline bug',
        'Believing EXISTS is always faster — engines convert both to semi-joins',
      ],
      followUps: ['What is a semi-join / anti-join?', 'When does IN (literal list) beat a join?'],
    },
    {
      id: 'kw-union',
      term: 'UNION vs UNION ALL',
      importance: 3,
      whyAsked: 'A two-second answer that reveals whether you know the hidden cost of implicit deduplication.',
      explanation: 'UNION concatenates result sets AND removes duplicate rows — requiring a sort or hash over the whole combined set. UNION ALL just concatenates: no dedup, no sort, much faster. Columns must match in count and compatible types. INTERSECT and EXCEPT complete the set-operation family (also with ALL variants).',
      commonMistakes: [
        'Defaulting to UNION when duplicates are impossible — paying dedup cost for nothing',
        'Relying on UNION to dedup as a side effect instead of stating intent',
      ],
      followUps: ['How would EXCEPT find rows in A missing from B?', 'Why must UNION branches have compatible types?'],
    },
    {
      id: 'kw-keys-constraints',
      term: 'Keys & Constraints',
      importance: 4,
      whyAsked: 'Schema-design judgment: what the engine enforces, applications cannot break — interviewers probe whether you push integrity into the database.',
      explanation: 'Primary key: unique + not null row identity. Foreign key: child references parent; ON DELETE CASCADE/SET NULL/RESTRICT define orphan policy. UNIQUE, NOT NULL, CHECK, DEFAULT round out declarative rules. Natural keys (email, SSN) look attractive but change; surrogate keys (identity/UUID) are stable. Composite keys are common in junction tables.',
      realWorldExample: 'A UNIQUE (user_id, idempotency_key) constraint is what actually prevents double-charging when a payment request retries — application checks alone race.',
      commonMistakes: [
        'No foreign keys "for performance" and accumulating orphans',
        'Natural primary keys that later change (emails, usernames)',
        'CASCADE everywhere — one parent delete silently wiping fact tables',
      ],
      followUps: ['Natural vs surrogate keys — trade-offs?', 'When is ON DELETE CASCADE appropriate vs dangerous?', 'How do unique constraints handle NULLs?'],
    },
    {
      id: 'kw-normalization',
      term: 'Normalization & Denormalization',
      importance: 4,
      whyAsked: 'Tests data-modeling fundamentals plus the maturity to break the rules deliberately for read performance.',
      explanation: '1NF atomic values; 2NF no partial dependence on a composite key; 3NF no transitive dependence between non-key columns — "the key, the whole key, nothing but the key." Normalization kills update/insert/delete anomalies. Denormalize consciously for read-heavy paths: counter caches, reporting tables, star schemas — accepting the consistency burden you just created.',
      commonMistakes: [
        'Reciting forms without naming the anomalies they prevent',
        'Premature denormalization "for speed" before any measurement',
        'Treating warehouse star schemas (intentionally denormalized) and OLTP rules as one context',
      ],
      followUps: ['Give a concrete 2NF vs 3NF violation', 'When did you denormalize and how did you keep copies consistent?'],
    },
    {
      id: 'kw-views',
      term: 'Views & Materialized Views',
      importance: 3,
      whyAsked: 'Distinguishes abstraction (view) from caching (materialized view) — and whether you know the staleness trade.',
      explanation: 'A view is a stored query expanded inline at execution — always current, no storage, pure abstraction/security layer (expose limited columns). A materialized view stores the result: fast reads of expensive aggregations, but stale until refreshed (REFRESH MATERIALIZED VIEW; CONCURRENTLY in Postgres to avoid blocking readers, requires a unique index).',
      commonMistakes: [
        'Expecting views to speed anything up — they are macro expansion',
        'Forgetting materialized views go stale; no auto-refresh in vanilla Postgres',
        'Stacking views on views until plans become unreadable',
      ],
      followUps: ['When is a materialized view better than a summary table maintained by triggers/jobs?', 'What are updatable views?'],
    },
    {
      id: 'kw-delete-truncate',
      term: 'DELETE vs TRUNCATE vs DROP',
      importance: 3,
      whyAsked: 'Quick screening question with real operational stakes — the differences are about logging, triggers, rollback, and speed.',
      explanation: 'DELETE: row-by-row DML, supports WHERE, fires row triggers, fully logged, rollback-able, leaves dead rows (vacuum/bloat in MVCC engines). TRUNCATE: DDL-ish instant table emptying — deallocates pages, no WHERE, typically resets identity, skips row triggers, much faster (transactional in Postgres, not in MySQL/Oracle). DROP: removes the table itself — data, structure, indexes, permissions.',
      commonMistakes: [
        'Mass DELETE on a huge table where TRUNCATE (or partition drop) was intended — hours of WAL and bloat',
        'Assuming TRUNCATE is rollback-able everywhere (Postgres yes; MySQL implicit commit)',
      ],
      followUps: ['Why is TRUNCATE so much faster?', 'How do you delete 100M of 500M rows safely? (batched deletes / copy-and-swap / partitioning)'],
    },
    {
      id: 'kw-procedures',
      term: 'Stored Procedures vs Functions',
      importance: 3,
      whyAsked: 'Standard comparison question, plus a judgment probe about how much logic belongs inside the database.',
      explanation: 'Functions return a value, are callable inside queries (SELECT fn(x)), and generally cannot manage transactions. Procedures (CALL) are invoked standalone, return nothing (or via OUT params), and in modern engines may COMMIT/ROLLBACK internally. Benefits: data-adjacent logic, one round trip for multi-step operations, privilege encapsulation. Costs: harder versioning/testing/debugging than application code, vendor lock-in.',
      commonMistakes: [
        'Claiming procedures are "always faster" — the win is round-trip elimination, not magic',
        'Burying business logic in procedures until no one can find or test it',
      ],
      followUps: ['Where do you draw the line between DB logic and app logic?', 'What is a trigger and when do triggers bite back?'],
    },
    {
      id: 'kw-indexes-sql',
      term: 'Indexes (SQL side)',
      importance: 4,
      whyAsked: 'Even in pure-SQL interviews, "how would you make this query fast" follows every query you write.',
      explanation: 'An index is a sorted (or hashed) auxiliary structure mapping column values to rows — turning full scans into O(log n) seeks for selective predicates, joins, and ORDER BY. Composite indexes follow the leftmost-prefix rule; order columns equality-first, then range/sort. Indexes cost write overhead and space; functions applied to a column in the predicate (WHERE YEAR(date) = 2026) defeat the index — rewrite as a range (sargable form).',
      commonMistakes: [
        'Wrapping indexed columns in functions and losing the index — non-sargable predicates',
        'Indexing every column "to be safe" — write amplification with no read benefit',
        'Leading wildcard LIKE \'%term\' expecting index use',
      ],
      followUps: ['What does "sargable" mean?', 'Index (a,b): which WHERE clauses can use it?', 'Why do low-cardinality columns make poor single-column indexes?'],
    },
  ],

  cheatSheets: [
    {
      id: 'cs-joins',
      title: 'JOIN reference',
      rows: [
        { concept: 'INNER JOIN', description: 'Matches only; rows without a partner vanish.', code: 'FROM a JOIN b ON b.a_id = a.id' },
        { concept: 'LEFT JOIN', description: 'All left rows; right side NULL-padded when unmatched.', code: 'FROM a LEFT JOIN b ON b.a_id = a.id' },
        { concept: 'Anti-join idiom', description: 'Left rows with NO match.', code: 'LEFT JOIN b ... WHERE b.id IS NULL' },
        { concept: 'RIGHT JOIN', description: 'Mirror of LEFT; conventionally rewritten as LEFT for readability.' },
        { concept: 'FULL OUTER JOIN', description: 'Both sides, NULL-padded — reconciliation queries. (MySQL: emulate via LEFT UNION RIGHT.)' },
        { concept: 'CROSS JOIN', description: 'Cartesian product — combination generation (dates x products).', code: 'FROM dates CROSS JOIN products' },
        { concept: 'Self-join', description: 'Same table, two aliases — employee→manager, row→previous row.', code: 'FROM emp e JOIN emp m ON m.id = e.manager_id' },
        { concept: 'ON vs WHERE (outer joins)', description: 'Right-table filter in ON keeps outer semantics; in WHERE it becomes an INNER join.' },
        { concept: 'Row multiplication', description: 'Joining one-to-many repeats the one side — aggregate before joining or COUNT(DISTINCT).' },
      ],
    },
    {
      id: 'cs-window',
      title: 'Window functions reference',
      rows: [
        { concept: 'ROW_NUMBER()', description: 'Unique sequence, ties broken arbitrarily: 1,2,3,4. Dedup + top-N per group.', code: 'ROW_NUMBER() OVER (PARTITION BY grp ORDER BY val DESC)' },
        { concept: 'RANK()', description: 'Ties share rank, gaps follow: 1,2,2,4.' },
        { concept: 'DENSE_RANK()', description: 'Ties share rank, no gaps: 1,2,2,3 — "Nth highest DISTINCT value".' },
        { concept: 'LAG / LEAD', description: 'Previous / next row\'s value in the partition.', code: 'val - LAG(val) OVER (ORDER BY day) AS delta' },
        { concept: 'Running total', description: 'Aggregate over ordered window.', code: 'SUM(amt) OVER (PARTITION BY user_id ORDER BY day)' },
        { concept: 'Moving average', description: 'Explicit ROWS frame.', code: 'AVG(amt) OVER (ORDER BY day ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)' },
        { concept: 'ROWS vs RANGE', description: 'ROWS counts physical rows; RANGE includes all ties (the default with ORDER BY — surprises with LAST_VALUE).' },
        { concept: 'NTILE(n)', description: 'Splits partition into n near-equal buckets — quartiles, percentile bands.' },
        { concept: 'Filtering a window', description: 'Wrap in subquery/CTE; window evaluates at SELECT, after WHERE.', code: 'SELECT * FROM (...) t WHERE rn = 1' },
      ],
    },
    {
      id: 'cs-exec-order',
      title: 'Logical order of execution',
      rows: [
        { concept: '1. FROM / JOIN', description: 'Assemble the working set. Join filters live in ON.' },
        { concept: '2. WHERE', description: 'Row filter. No aggregates, no SELECT aliases.' },
        { concept: '3. GROUP BY', description: 'Collapse to groups; only keys + aggregates survive to SELECT.' },
        { concept: '4. HAVING', description: 'Group filter — aggregates allowed here.' },
        { concept: '5. SELECT', description: 'Projection; aliases born; window functions evaluate.' },
        { concept: '6. DISTINCT', description: 'Dedup the projected rows.' },
        { concept: '7. ORDER BY', description: 'Sort — aliases usable now.' },
        { concept: '8. LIMIT / OFFSET', description: 'Trim last. Without ORDER BY the subset is non-deterministic.' },
      ],
    },
    {
      id: 'cs-comparisons',
      title: 'Classic comparisons',
      rows: [
        { concept: 'WHERE vs HAVING', description: 'Rows before grouping vs groups after aggregation. Non-aggregate conditions belong in WHERE.' },
        { concept: 'UNION vs UNION ALL', description: 'Dedup (sort/hash cost) vs plain concat. Prefer ALL when duplicates are impossible or wanted.' },
        { concept: 'IN vs EXISTS', description: 'Usually same plan (semi-join). NOT IN + NULL = zero rows; NOT EXISTS is the safe anti-join.' },
        { concept: 'DELETE vs TRUNCATE vs DROP', description: 'Row DML with WHERE/triggers vs instant page deallocation vs remove the table itself.' },
        { concept: 'View vs Materialized View', description: 'Inline macro, always fresh vs stored result, fast but stale until REFRESH.' },
        { concept: 'Procedure vs Function', description: 'CALLed, may control transactions vs returns value, usable inside queries.' },
        { concept: 'COUNT(*) vs COUNT(col)', description: 'All rows vs non-NULL values of col; COUNT(DISTINCT col) unique non-NULLs.' },
        { concept: 'ROW_NUMBER vs RANK vs DENSE_RANK', description: '1,2,3,4 vs 1,2,2,4 vs 1,2,2,3 on a tie at second place.' },
        { concept: 'Subquery vs CTE', description: 'Same power; CTE adds naming, reuse, recursion — and (engine-dependent) possible materialization fences.' },
        { concept: 'NULL comparisons', description: '= NULL never true; use IS NULL, COALESCE, IS DISTINCT FROM.' },
      ],
    },
  ],

  questions: [
    {
      id: 'q-exec-order',
      level: 'beginner',
      question: 'In what order are the clauses of a SELECT statement logically processed, and why does it matter?',
      answer: 'FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. It matters because the rules fall out of it: WHERE cannot use aggregates (groups don\'t exist yet) or SELECT aliases (projection hasn\'t happened), HAVING can use aggregates, ORDER BY can use aliases, and window functions cannot be filtered without wrapping the query.',
      deepDive: 'Distinguish logical from physical: the optimizer reorders execution aggressively (filter pushdown, join reordering) but must preserve the semantics this order defines.',
      followUps: ['Why does WHERE alias = 1 fail?', 'Where do window functions evaluate?'],
    },
    {
      id: 'q-where-having',
      level: 'beginner',
      question: 'What is the difference between WHERE and HAVING?',
      answer: 'WHERE filters individual rows before grouping and may not contain aggregates. HAVING filters groups after GROUP BY and aggregation, so it can reference COUNT/SUM/AVG. Efficiency corollary: any condition not involving an aggregate belongs in WHERE so rows are discarded before the grouping work.',
      realWorldExample: '"Departments with at least 5 employees hired since 2020": hire_date filter in WHERE, COUNT(*) >= 5 in HAVING.',
      followUps: ['Can you use a SELECT alias in HAVING?', 'What happens if you put a row-level filter in HAVING?'],
    },
    {
      id: 'q-join-where-trap',
      level: 'intermediate',
      question: 'Why does adding WHERE b.status = \'active\' after LEFT JOIN b change the results, and how do you fix it?',
      answer: 'The LEFT JOIN preserves unmatched left rows with NULLs in b\'s columns. WHERE runs after the join, and NULL = \'active\' is UNKNOWN — so all the NULL-padded rows are discarded, silently converting the LEFT JOIN into an INNER JOIN. Fix: move the condition into the ON clause (LEFT JOIN b ON ... AND b.status = \'active\') to filter b\'s rows while preserving all left rows, or explicitly allow NULL in WHERE.',
      followUps: ['Does the same apply to the LEFT table\'s conditions? (No — those belong in WHERE)', 'How does this interact with the anti-join idiom?'],
    },
    {
      id: 'q-not-in-null',
      level: 'advanced',
      question: 'SELECT * FROM a WHERE id NOT IN (SELECT a_id FROM b) returns zero rows even though unmatched rows clearly exist. Why?',
      answer: 'Some b.a_id is NULL. NOT IN expands to id <> v1 AND id <> v2 AND ... AND id <> NULL; the last comparison is UNKNOWN, which poisons the whole AND chain to UNKNOWN, and WHERE keeps only TRUE — so every row is dropped. Fixes: filter NULLs in the subquery (WHERE a_id IS NOT NULL) or, better, use NOT EXISTS, whose per-row existence test handles NULLs intuitively.',
      deepDive: 'This is three-valued logic\'s flagship bug: no error, plausible-looking query, empty result. NOT EXISTS also typically optimizes to a clean anti-join. The positive IN is safe with NULLs (it can only lose the NULL itself).',
      followUps: ['Expand the predicate by hand to show the UNKNOWN', 'Compare anti-join strategies: NOT EXISTS vs LEFT JOIN ... IS NULL vs EXCEPT'],
    },
    {
      id: 'q-rank-vs-dense',
      level: 'intermediate',
      question: 'Salaries are 90, 80, 80, 70. What do ROW_NUMBER, RANK, and DENSE_RANK assign, and which finds the "3rd highest salary"?',
      answer: 'ROW_NUMBER: 1,2,3,4 (ties broken arbitrarily). RANK: 1,2,2,4 (ties share, gap follows). DENSE_RANK: 1,2,2,3 (ties share, no gap). "3rd highest salary" almost always means 3rd highest DISTINCT value (70) — that is DENSE_RANK = 3. RANK = 3 matches nothing here; ROW_NUMBER = 3 returns a duplicate 80.',
      followUps: ['When would ROW_NUMBER be exactly what you want? (dedup, pagination)', 'Write Nth-highest with DENSE_RANK'],
    },
    {
      id: 'q-correlated',
      level: 'intermediate',
      question: 'What is a correlated subquery, and why can it be a performance problem?',
      answer: 'A subquery that references columns of the outer query — e.g., WHERE salary > (SELECT AVG(salary) FROM emp e2 WHERE e2.dept = e1.dept). Logically it re-executes once per outer row, so a million-row outer table implies a million subquery evaluations. Modern optimizers often decorrelate into a join or use caching, but when they cannot, it is the classic hidden O(n*m). Rewrite as a join against a grouped derived table, or as a window function (AVG(salary) OVER (PARTITION BY dept)) — one scan.',
      followUps: ['Rewrite the example both ways', 'How would you confirm decorrelation in a query plan?'],
    },
    {
      id: 'q-union',
      level: 'beginner',
      question: 'UNION vs UNION ALL — difference and when does it matter?',
      answer: 'Both concatenate compatible result sets; UNION additionally removes duplicate rows, which requires sorting or hashing the entire combined result. UNION ALL skips dedup and is therefore much cheaper. Use UNION ALL whenever duplicates cannot occur (disjoint sources) or are wanted; reserve UNION for when dedup is the actual requirement.',
      followUps: ['INTERSECT and EXCEPT?', 'Why might UNION change row order unexpectedly?'],
    },
    {
      id: 'q-normalization',
      level: 'intermediate',
      question: 'Explain 1NF, 2NF, and 3NF with a violation example of each. When would you denormalize?',
      answer: '1NF: atomic values — a phones column holding "555-1,555-2" violates it; split into rows/table. 2NF: no partial dependency on a composite key — order_items(order_id, product_id, product_name): product_name depends only on product_id; move to products. 3NF: no transitive dependency — employees(dept_id, dept_name): dept_name depends on dept_id, a non-key; move to departments. These prevent update/insert/delete anomalies. Denormalize deliberately for measured read-path wins: counter caches, reporting/star schemas, avoiding hot 6-way joins — accepting that you now own keeping the copies consistent.',
      followUps: ['Name the three anomaly types concretely', 'How do warehouses justify star schemas?'],
    },
    {
      id: 'q-delete-truncate',
      level: 'beginner',
      question: 'Compare DELETE, TRUNCATE, and DROP.',
      answer: 'DELETE is DML: removes rows matching WHERE, fires row triggers, fully logged, transactional everywhere — slow for whole big tables and leaves dead-row cleanup behind. TRUNCATE empties the table by deallocating pages: no WHERE, near-instant, usually resets identity counters, skips row triggers; transactional in Postgres, auto-committing in MySQL/Oracle. DROP removes the table itself — definition, data, indexes, grants.',
      followUps: ['How do you remove 100M of 500M rows without an outage?', 'Why does TRUNCATE need stronger locks than DELETE?'],
    },
    {
      id: 'q-views',
      level: 'intermediate',
      question: 'When would you use a view vs a materialized view?',
      answer: 'View: a named query expanded inline at execution — zero storage, always current; use for abstraction (hide join complexity), security (expose a column subset), and stable interfaces over evolving schemas. Materialized view: a stored query result — use when the underlying query is expensive (large aggregations) and staleness is acceptable; reads are fast but you must refresh (REFRESH MATERIALIZED VIEW, CONCURRENTLY in Postgres to keep it readable, needing a unique index). A view never speeds up anything; a matview is a cache with cache problems.',
      followUps: ['Matview vs an aggregate table maintained by jobs?', 'What makes a view updatable?'],
    },
    {
      id: 'q-second-highest-approaches',
      level: 'intermediate',
      question: 'How many ways can you find the 2nd highest salary, and what are the trade-offs?',
      answer: 'Main approaches: (1) scalar subquery — MAX below MAX: handles "no 2nd value" by returning NULL naturally; (2) OFFSET — SELECT DISTINCT salary ORDER BY DESC LIMIT 1 OFFSET 1: shortest, but returns no row (vs NULL) when absent, and generalizing to ties needs DISTINCT; (3) DENSE_RANK = 2 in a wrapped query: generalizes instantly to Nth and to "per department" by adding PARTITION BY. The window version is what scales to real interview follow-ups.',
      deepDive: 'Mention determinism and ties explicitly — interviewers escalate with "what if two people share the top salary?" DISTINCT or DENSE_RANK handles it; ROW_NUMBER does not.',
      followUps: ['Nth highest per department?', 'Return NULL when there is no 2nd salary — which approaches do?'],
    },
    {
      id: 'q-sargable',
      level: 'advanced',
      question: 'The query WHERE YEAR(created_at) = 2026 ignores the index on created_at. Why, and what is the fix?',
      answer: 'Applying a function to the column makes the predicate non-sargable: the index stores created_at values in order, not YEAR(created_at) results, so the engine must evaluate the function per row — a full scan. Rewrite as a range over the raw column: WHERE created_at >= \'2026-01-01\' AND created_at < \'2027-01-01\' — same semantics, index-friendly. Same disease: LIKE \'%term\' (leading wildcard), implicit type casts (string column compared to number), arithmetic on the column (salary * 12 > x).',
      followUps: ['What does sargable stand for?', 'How else could you index the expression itself? (function-based/expression indexes)'],
    },
    {
      id: 'q-design-orders',
      level: 'expert',
      question: 'Design the schema for an e-commerce orders system and defend your key/constraint choices.',
      answer: 'Tables: customers(id PK), products(id PK, price_cents CHECK >= 0), orders(id PK, customer_id FK NOT NULL, status constrained by CHECK or enum, created_at), order_items(order_id FK, product_id FK, PRIMARY KEY(order_id, product_id), quantity CHECK > 0, unit_price_cents — price COPIED at purchase time, deliberately denormalized because historical orders must not change when catalog prices do). Surrogate keys throughout (emails change). FKs RESTRICT on customers/products (no silent cascade wiping order history); UNIQUE (customer_id, idempotency_key) on orders to make payment retries safe. Money in integer cents, never float.',
      deepDive: 'The unit_price copy is the interview gold: it shows you know normalization rules AND when the business domain (immutable historical facts) overrides them. Status as CHECK-constrained text keeps the state machine visible in the schema.',
      followUps: ['Where would totals live — computed or stored?', 'How do you evolve the status set safely?', 'Soft delete vs hard delete for customers with orders?'],
    },
  ],

  codingQuestions: [
    {
      id: 'code-nth-salary',
      title: 'Nth highest salary — three ways',
      level: 'intermediate',
      problem: 'Given employees(id, name, salary), return the 2nd highest salary (then generalize to Nth). Handle duplicates (ties) and the case where no Nth salary exists.',
      solution: {
        lang: 'sql',
        code: `-- 1) Subquery (MAX below MAX): returns NULL if absent — often desired
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- 2) DISTINCT + OFFSET: shortest; returns NO ROW (not NULL) if absent
SELECT DISTINCT salary
FROM employees
ORDER BY salary DESC
LIMIT 1 OFFSET 1;          -- Nth: OFFSET n-1

-- 3) DENSE_RANK: the generalizable form (Nth, per-group, ties correct)
SELECT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2
LIMIT 1;`,
      },
      explanation: 'Approach 1 nests MAX exclusions — elegant for 2nd, unwieldy for 5th. Approach 2 relies on DISTINCT to collapse ties before OFFSET; without DISTINCT, two people sharing the top salary would make OFFSET 1 return the duplicate top value. Approach 3 uses DENSE_RANK (not RANK — gaps would skip values; not ROW_NUMBER — ties would break it) and extends to "Nth highest per department" by adding PARTITION BY department.',
      timeComplexity: 'All O(n log n) worst case (sort/rank); approach 1 is two scans O(n)',
      spaceComplexity: 'O(distinct salaries) for sort/dedup structures',
      alternatives: ['Wrap approach 2 in a scalar subquery position to convert "no row" into NULL', 'Per-department Nth: DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC)'],
    },
    {
      id: 'code-find-duplicates',
      title: 'Find duplicate rows',
      level: 'beginner',
      problem: 'users(id, email) contains duplicate emails. Return each duplicated email with its count, then return the full rows of all duplicates.',
      solution: {
        lang: 'sql',
        code: `-- which values are duplicated, and how often
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- full rows of every duplicate (window version, one scan)
SELECT id, email
FROM (
  SELECT id, email, COUNT(*) OVER (PARTITION BY email) AS cnt
  FROM users
) t
WHERE cnt > 1;`,
      },
      explanation: 'GROUP BY ... HAVING COUNT(*) > 1 is the canonical duplicate detector — HAVING is required because the condition is an aggregate. The window variant answers the follow-up "now show me the whole rows": COUNT(*) OVER preserves every row while attaching its group size, then the outer filter keeps members of oversized groups.',
      timeComplexity: 'O(n) with hash aggregation; O(n log n) if sorted',
      spaceComplexity: 'O(distinct emails)',
      alternatives: ['JOIN the duplicated-values list back to the table (pre-window-function style)', 'EXISTS (SELECT 1 FROM users u2 WHERE u2.email = u.email AND u2.id <> u.id)'],
    },
    {
      id: 'code-delete-duplicates',
      title: 'Delete duplicates, keep one row',
      level: 'intermediate',
      problem: 'Delete duplicate users by email, keeping the row with the lowest id from each duplicate set.',
      solution: {
        lang: 'sql',
        code: `-- Window-based (portable to Postgres/SQL Server/etc.)
DELETE FROM users
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY email ORDER BY id) AS rn
    FROM users
  ) t
  WHERE rn > 1
);

-- Self-join formulation: delete any row with a same-email, lower-id twin
DELETE FROM users a
USING users b
WHERE a.email = b.email
  AND a.id > b.id;        -- Postgres syntax; MySQL: DELETE a FROM users a JOIN users b ...`,
      },
      explanation: 'ROW_NUMBER partitioned by the duplicate key and ordered by the keep-criterion stamps 1 on the keeper and 2..n on victims; deleting rn > 1 removes exactly the surplus. The self-join version expresses the same set declaratively: "rows for which a better twin exists." ROW_NUMBER (never RANK) is essential — ties would mark multiple rows as rn = 1 and under-delete.',
      timeComplexity: 'O(n log n) for the window sort; self-join O(n) with an email index',
      spaceComplexity: 'O(n) for the ranked set',
      alternatives: ['Keep newest instead: ORDER BY created_at DESC in the window', 'Prevent recurrence: add UNIQUE(email) after cleanup', 'Massive tables: INSERT DISTINCT into a new table and swap, instead of deleting most rows in place'],
    },
    {
      id: 'code-top-n-per-group',
      title: 'Top N per group',
      level: 'intermediate',
      problem: 'From employees(id, name, department, salary), return the top 3 earners in EACH department, highest first.',
      solution: {
        lang: 'sql',
        code: `SELECT department, name, salary
FROM (
  SELECT department, name, salary,
         DENSE_RANK() OVER (PARTITION BY department
                            ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk <= 3
ORDER BY department, salary DESC;`,
      },
      explanation: 'PARTITION BY restarts ranking per department; the wrapper subquery exists because window results cannot be filtered in their own SELECT (they evaluate after WHERE). Rank-function choice changes the contract: DENSE_RANK = top 3 salary VALUES (ties all included, possibly >3 rows); ROW_NUMBER = exactly 3 rows (ties cut arbitrarily); RANK = top 3 ranks with gap semantics. Interviewers expect you to ask which "top 3" is meant.',
      timeComplexity: 'O(n log n) — sort within partitions',
      spaceComplexity: 'O(n)',
      alternatives: ['LATERAL/CROSS APPLY per department with ORDER BY ... LIMIT 3 — efficient with a (department, salary DESC) index', 'Pre-window era: correlated COUNT(*) of higher salaries < 3'],
    },
    {
      id: 'code-emp-vs-manager',
      title: 'Employees earning more than their manager',
      level: 'beginner',
      problem: 'employees(id, name, salary, manager_id) — manager_id references employees.id. Return employees whose salary exceeds their manager\'s.',
      solution: {
        lang: 'sql',
        code: `SELECT e.name AS employee,
       e.salary AS employee_salary,
       m.name AS manager,
       m.salary AS manager_salary
FROM employees e
JOIN employees m ON m.id = e.manager_id
WHERE e.salary > m.salary;`,
      },
      explanation: 'The canonical self-join: the table participates twice under aliases e (as employee) and m (as manager), joined through the hierarchy column. INNER JOIN automatically excludes the CEO-style rows with NULL manager_id (no match) — which is the desired semantics here; a LEFT JOIN would keep them with NULL manager columns. The aliases are not optional: without them the column references are ambiguous.',
      timeComplexity: 'O(n) with a hash join (or index on id)',
      spaceComplexity: 'O(n) hash table',
      alternatives: ['Correlated subquery: WHERE salary > (SELECT salary FROM employees m WHERE m.id = e.manager_id) — same result, often the same plan', 'Extension: employees earning more than their department average → window AVG OVER (PARTITION BY dept)'],
    },
    {
      id: 'code-consecutive-days',
      title: 'Consecutive days (gaps and islands)',
      level: 'advanced',
      problem: 'logins(user_id, login_date) — one row per user per day. Find users with 3 or more CONSECUTIVE login days.',
      solution: {
        lang: 'sql',
        code: `WITH grouped AS (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (
             PARTITION BY user_id ORDER BY login_date
         ))::int * INTERVAL '1 day' AS grp_anchor
  FROM logins
),
streaks AS (
  SELECT user_id, grp_anchor,
         COUNT(*) AS streak_len,
         MIN(login_date) AS streak_start
  FROM grouped
  GROUP BY user_id, grp_anchor
)
SELECT DISTINCT user_id, streak_len, streak_start
FROM streaks
WHERE streak_len >= 3;`,
      },
      explanation: 'The gaps-and-islands trick: within a user, ROW_NUMBER increases by exactly 1 per row, and so does the date when days are consecutive — so date minus row_number is CONSTANT across a consecutive run and jumps at every gap. Grouping by that constant identifies each streak; COUNT(*) is its length. This one technique solves consecutive logins, sequence gaps, and "merge adjacent ranges" — name it explicitly.',
      timeComplexity: 'O(n log n) — sort per user for the window',
      spaceComplexity: 'O(n)',
      alternatives: ['Fixed N (exactly 3): self-join or LAG twice — l.date = prev + 1 AND prev = prev2 + 1 — simpler but does not generalize to arbitrary streak lengths', 'LAG-based: flag breaks (date <> prev + 1), running SUM of flags as group id — same idea, two windows'],
    },
    {
      id: 'code-pivot',
      title: 'Pivot rows to columns (conditional aggregation)',
      level: 'intermediate',
      problem: 'sales(product, quarter, amount) with quarters Q1–Q4 as rows. Produce one row per product with columns q1, q2, q3, q4 and a total.',
      solution: {
        lang: 'sql',
        code: `SELECT product,
       SUM(CASE WHEN quarter = 'Q1' THEN amount ELSE 0 END) AS q1,
       SUM(CASE WHEN quarter = 'Q2' THEN amount ELSE 0 END) AS q2,
       SUM(CASE WHEN quarter = 'Q3' THEN amount ELSE 0 END) AS q3,
       SUM(CASE WHEN quarter = 'Q4' THEN amount ELSE 0 END) AS q4,
       SUM(amount) AS total
FROM sales
GROUP BY product;

-- Postgres flavor: FILTER reads cleaner
-- SUM(amount) FILTER (WHERE quarter = 'Q1') AS q1   (NULL, not 0, when absent)`,
      },
      explanation: 'Conditional aggregation is the portable pivot: each CASE routes a row\'s amount into exactly one column\'s SUM, and GROUP BY collapses to one row per product. ELSE 0 yields zeros for missing quarters; FILTER (or omitting ELSE) yields NULLs — know which the report wants. The column set is static by nature of SQL: dynamic pivots require generating the SQL (or engine extensions like crosstab/PIVOT).',
      timeComplexity: 'O(n) single scan with hash aggregation',
      spaceComplexity: 'O(products)',
      alternatives: ['SQL Server/Oracle PIVOT operator; Postgres crosstab()', 'Unpivot (reverse): one SELECT per column UNION ALL, or LATERAL VALUES'],
    },
    {
      id: 'code-dept-max',
      title: 'Highest-paid employee(s) per department',
      level: 'intermediate',
      problem: 'employees(id, name, salary, department_id), departments(id, name). Return each department with its highest-paid employee(s) — include ALL ties.',
      solution: {
        lang: 'sql',
        code: `-- Window version (include ties via RANK/DENSE_RANK, not ROW_NUMBER)
SELECT department, employee, salary
FROM (
  SELECT d.name AS department, e.name AS employee, e.salary,
         RANK() OVER (PARTITION BY e.department_id
                      ORDER BY e.salary DESC) AS rnk
  FROM employees e
  JOIN departments d ON d.id = e.department_id
) t
WHERE rnk = 1;

-- Classic version: join back to per-group MAX
SELECT d.name AS department, e.name AS employee, e.salary
FROM employees e
JOIN departments d ON d.id = e.department_id
JOIN (
  SELECT department_id, MAX(salary) AS max_salary
  FROM employees
  GROUP BY department_id
) mx ON mx.department_id = e.department_id
    AND mx.max_salary = e.salary;`,
      },
      explanation: 'The tie requirement dictates the rank function: RANK (or DENSE_RANK — identical at position 1) gives every max-salary employee rnk = 1, while ROW_NUMBER would arbitrarily drop co-leaders. The MAX-join version is the pre-window classic: compute each department\'s max in a derived table, then join back on both keys — naturally tie-inclusive. Mention that the window form is one scan while the join form scans twice (though optimizers may converge).',
      timeComplexity: 'Window: O(n log n); MAX-join: O(n) aggregation + O(n) probe',
      spaceComplexity: 'O(n)',
      alternatives: ['Correlated: WHERE e.salary = (SELECT MAX(salary) FROM employees x WHERE x.department_id = e.department_id)', 'Departments with NO employees too? Switch the join to departments LEFT JOIN'],
    },
  ],

  scenarios: [
    {
      id: 'sc-report-discrepancy',
      title: 'Two reports disagree on revenue — find the SQL bug',
      situation: 'Finance\'s revenue total differs 4% from the analytics dashboard. Both query the same orders and refunds tables. You must reconcile them.',
      approach: [
        'Diff the two queries\' shapes first: join types, filters, grouping. The usual suspects are join multiplication, NULL handling, and dedup semantics — not the arithmetic.',
        'Check for row multiplication: one query joins orders to refunds (one-to-many) and SUMs order.total — an order with 2 partial refunds counts its total twice. Fix: aggregate refunds per order in a derived table/CTE before joining.',
        'Check NULL semantics: WHERE region <> \'test\' drops NULL-region rows entirely in one query while the other uses COALESCE(region, \'unknown\'). Also COUNT(col) vs COUNT(*) discrepancies.',
        'Check outer-join degradation: a LEFT JOIN with a right-table condition in WHERE became an INNER join in one report, dropping orders with no refunds from the base set.',
        'Check dedup: UNION (deduping legitimately distinct rows that happen to match) vs UNION ALL, and DISTINCT applied at different levels.',
        'Build a reconciliation query: FULL OUTER JOIN the two result sets on the grouping keys and surface rows where totals differ — turns hand-checking into a query.',
      ],
      keyTakeaways: [
        'Aggregate-then-join beats join-then-aggregate whenever the join is one-to-many — fan-out double-counting is the #1 reporting bug',
        'NULL filtering (<> drops NULLs) is the #2 — silently, with no error',
        'Reconciliation itself is a SQL skill: FULL OUTER JOIN the two answers and query the disagreement',
      ],
    },
    {
      id: 'sc-slow-report',
      title: 'A nightly report query takes 40 minutes — rewrite it',
      situation: 'A per-customer metrics report uses correlated subqueries for each metric (last order date, lifetime total, order count) and has crossed its batch window.',
      approach: [
        'Read the query for re-execution patterns: three correlated subqueries against orders mean the orders table is logically probed three times per customer row.',
        'Collapse them into one pass: a single derived table — SELECT customer_id, MAX(created_at), SUM(total), COUNT(*) FROM orders GROUP BY customer_id — LEFT JOINed to customers. Three correlated probes become one scan + one join.',
        'Replace any per-row "rank within group" correlated logic with window functions — one sort instead of n subqueries.',
        'Make predicates sargable: date filters as ranges, not function-wrapped columns; confirm the join/filter columns are indexed.',
        'Check the plan (EXPLAIN or the engine\'s equivalent) before/after: the win should show as the disappearance of repeated subplan executions.',
        'If the aggregation is inherently heavy and the data tolerates staleness, materialize: a matview or summary table refreshed before the report, turning 40 minutes of compute into a refresh plus a join.',
      ],
      keyTakeaways: [
        'Correlated subqueries per metric = the most common report anti-pattern; one GROUP BY derived table replaces them all',
        'Set-based thinking: make the engine do one big pass, not a million tiny ones',
        'Materialization (matview/summary table) is the legitimate last resort once the query is already clean',
      ],
    },
    {
      id: 'sc-schema-review',
      title: 'Review a junior\'s schema before launch',
      situation: 'A teammate proposes: users(id, name, emails TEXT "a,b,c"), orders(id, user_email TEXT, status TEXT free-form, total FLOAT, product_names TEXT "x;y;z"). You have one review meeting before launch.',
      approach: [
        'Comma-separated emails and product_names violate 1NF: impossible to index, join, or constrain. Split into user_emails(user_id, email UNIQUE) and order_items(order_id, product_id, quantity) junction tables.',
        'orders.user_email as the link is a natural-key trap: emails change, breaking history, and typos create orphans. Use user_id BIGINT REFERENCES users(id) — surrogate key, FK-enforced.',
        'FLOAT for money guarantees rounding bugs (0.1 + 0.2 problems compounding over millions of rows): integer cents or NUMERIC.',
        'Free-form status invites \'Paid\', \'paid\', \'PAID \' chaos: CHECK constraint or enum, making the state machine explicit and queryable.',
        'Add the integrity layer: NOT NULLs by default, CHECK (total_cents >= 0), UNIQUE where business rules demand it (one pending order per cart, idempotency keys), created_at TIMESTAMPTZ defaults.',
        'Frame the review constructively: every constraint added is a class of production bug deleted — the database is the last line of defense that no buggy deploy can bypass.',
      ],
      keyTakeaways: [
        'Comma-separated values in a column is the 1NF red flag interviewers plant deliberately',
        'Money: never float. Links: surrogate FKs, not natural text keys. States: constrained, not free-form',
        'Constraints are executable specs — the engine enforcing rules beats every code-review promise',
      ],
    },
  ],

  mentalModels: [
    {
      id: 'mm-pipeline-funnel',
      title: 'The Query as a Funnel',
      flow: ['FROM: pour in all joined rows', 'WHERE: row sieve', 'GROUP BY: pour into buckets', 'HAVING: discard whole buckets', 'SELECT: label what flows out', 'ORDER BY + LIMIT: arrange the last drops'],
      explanation: [
        'Picture data falling through a funnel of stages. Each clause only sees what the previous stage let through — that single image generates every rule.',
        'WHERE sieves individual rows before bucketing, so it cannot ask bucket-level questions (aggregates). HAVING stands below the buckets, so it can.',
        'Labels (aliases) are stuck on at the SELECT stage — stages above it (WHERE) have never seen them; stages below (ORDER BY) have.',
      ],
      whatBreaksWithoutIt: 'Without the funnel, SQL\'s rules are arbitrary trivia — why aliases work here but not there, why aggregates are banned in WHERE — instead of consequences of one picture.',
      interviewTip: 'When stuck on "why doesn\'t this clause accept X", place the clause in the funnel and ask what exists at that depth. Narrating that placement IS the strong answer.',
    },
    {
      id: 'mm-join-deck',
      title: 'Joins as Matching Card Decks',
      flow: ['Two decks of cards (tables)', 'Matching rule (ON)', 'INNER: keep matched pairs only', 'LEFT: keep all left cards, blank partners', 'FULL: keep everything, blanks both ways', 'CROSS: every card paired with every card'],
      explanation: [
        'Lay out two decks and pair cards by the ON rule. The join type only decides what happens to cards that found no partner: discard (INNER), keep with a blank partner (LEFT/RIGHT/FULL).',
        'The blanks are NULLs — which is why filtering on the right deck\'s face value in WHERE throws away exactly the blank-partner rows you asked LEFT JOIN to keep.',
        'A card with three partners gets laid out three times — joins multiply rows; they do not merge them. Every double-counting bug is this picture forgotten.',
      ],
      whatBreaksWithoutIt: 'Without it, the LEFT-JOIN-WHERE trap and join fan-out double-counting remain recurring surprises instead of visible mechanics.',
      interviewTip: 'Before answering any join question, say what happens to unmatched rows on each side — that framing covers inner/outer/anti-join in one breath and impresses immediately.',
    },
    {
      id: 'mm-window-spotlight',
      title: 'Window Functions as a Spotlight Over Standing Rows',
      flow: ['Rows line up in partitions', 'Sorted within each line', 'Spotlight (frame) shines around the current row', 'Function computes over the lit rows', 'Row keeps its place — nothing collapses'],
      explanation: [
        'GROUP BY marches rows into a meat grinder — one output per group, individuals gone. A window function instead walks down the line with a spotlight: every row stays standing and receives a value computed from whoever the light touches.',
        'PARTITION BY decides where one line ends and the next begins; ORDER BY arranges each line; the frame (ROWS BETWEEN ...) sets the spotlight\'s width — everything before me (running total), six rows back (moving average), the whole line (group total on every row).',
        'LAG/LEAD are the spotlight pointed exactly one position back or forward.',
      ],
      whatBreaksWithoutIt: 'Without it, people reach for self-joins and correlated subqueries to ask "how does this row compare to its group" — slow, convoluted, and the #1 thing window functions exist to delete.',
      interviewTip: 'Open with the contrast: "GROUP BY collapses; OVER preserves." Then name PARTITION/ORDER/frame as the three dials. That structure sounds senior before you write a line.',
    },
    {
      id: 'mm-null-unknown',
      title: 'NULL as a Sealed Envelope',
      flow: ['NULL = a sealed envelope, contents unknown', 'Compare anything to it → "cannot say" (UNKNOWN)', 'WHERE admits only definite YES', 'Sealed-envelope rows quietly excluded', 'One envelope in NOT IN poisons the whole test'],
      explanation: [
        'NULL is not zero or empty — it is a sealed envelope. "Is the envelope equal to 5?" Cannot say. "Is it different from 5?" Also cannot say. That is three-valued logic in one image.',
        'WHERE is a bouncer who admits only definite YES: both NO and CANNOT-SAY are turned away. So col <> \'x\' turns away the envelopes too — the silent row loss behind countless wrong reports.',
        'NOT IN (1, 2, NULL) asks "are you different from ALL of these?" — different from 1, different from 2, and different from a sealed envelope? Cannot say. Nobody gets in. NOT EXISTS asks a different question ("does a match exist?") and never opens the envelope.',
      ],
      whatBreaksWithoutIt: 'Without it, every NULL rule is memorized separately and the NOT IN bug keeps shipping — it produces zero errors, only missing data.',
      interviewTip: 'Walk the NOT IN expansion aloud (x <> 1 AND x <> NULL → UNKNOWN → dropped). Demonstrating the mechanism beats stating the rule, and it is a known senior-filter question.',
    },
  ],

  revision: [
    { id: 'r-exec-order', topic: 'Logical Execution Order', importance: 5, thirtySecond: 'FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT. Explains every clause rule: no aggregates/aliases in WHERE, aliases OK in ORDER BY, window functions need a wrapper to filter.', twoMinute: 'Each clause consumes the previous stage\'s output. WHERE sees raw rows (no groups, no aliases); HAVING sees groups (aggregates legal); SELECT projects and births aliases and window values; ORDER BY sees the projection; LIMIT trims last — and without ORDER BY returns an arbitrary subset. This is logical semantics; optimizers reorder physical work freely underneath.', deepDive: 'Window functions evaluating at SELECT is why QUALIFY exists in some engines as sugar for the wrap-and-filter pattern. JOIN ON conditions evaluate during FROM — which is exactly why outer-join filters behave differently in ON vs WHERE. DISTINCT after SELECT explains why DISTINCT ON expression results works.', followUps: ['Why can ORDER BY use aliases?', 'Where do JOIN ON filters fit?'], whiteboard: ['FROM→WHERE→GROUP→HAVING→SELECT→ORDER→LIMIT'] },
    { id: 'r-joins', topic: 'JOIN Types', importance: 5, thirtySecond: 'INNER: matches only. LEFT: all left + NULL-padded. FULL: both sides. CROSS: all pairs. Self-join: one table, two aliases. Unmatched-row handling is the whole difference.', twoMinute: 'Anti-join: LEFT JOIN ... WHERE right.id IS NULL (or NOT EXISTS). The trap: right-table predicate in WHERE after LEFT JOIN kills NULL rows → silently INNER; keep it in ON. One-to-many joins multiply rows — aggregate before joining or COUNT(DISTINCT) to avoid double-counting. RIGHT JOIN: rewrite as LEFT. FULL: reconciliations; MySQL lacks it.', deepDive: 'Engines execute joins as nested loop / hash / merge regardless of join TYPE — type is semantics, algorithm is the optimizer\'s choice. Semi-join (EXISTS) and anti-join (NOT EXISTS) return left rows at most once — unlike JOIN which duplicates per match: the correct tool when you only need existence.', followUps: ['ON vs WHERE demo', 'Three anti-join spellings'], whiteboard: ['LEFT + WHERE right.col = x ⇒ INNER (trap)', 'anti-join: ... WHERE right.id IS NULL'] },
    { id: 'r-group', topic: 'GROUP BY / HAVING', importance: 4, thirtySecond: 'GROUP BY collapses rows per key; select list = keys + aggregates only. WHERE filters rows before grouping; HAVING filters groups after. COUNT(*) counts rows; COUNT(col) skips NULLs.', twoMinute: 'Non-aggregate conditions belong in WHERE — earlier filtering, less grouping work. Aggregates ignore NULLs (AVG can mislead); SUM over zero rows is NULL (COALESCE it). Conditional aggregation — SUM(CASE WHEN...) or FILTER — is the pivot tool. GROUPING SETS/ROLLUP produce subtotal levels in one pass.', deepDive: 'Engines hash-aggregate or sort-aggregate; grouping on expressions blocks some index use. "Every selected column must be in GROUP BY or an aggregate" — MySQL\'s historical laxity (ONLY_FULL_GROUP_BY off) picked arbitrary values and hid real bugs. Functional dependency exception: grouping by a PK lets you select other columns of that table.', followUps: ['Pivot statuses to columns in one query', 'Why is SUM of nothing NULL?'], whiteboard: ['WHERE = rows before; HAVING = groups after'] },
    { id: 'r-window', topic: 'Window Functions', importance: 5, thirtySecond: 'Per-row values over a partition, no collapsing. ROW_NUMBER 1,2,3,4 / RANK 1,2,2,4 / DENSE_RANK 1,2,2,3. LAG/LEAD = neighbors. SUM OVER (ORDER BY) = running total. Filter via wrapper.', twoMinute: 'OVER (PARTITION BY g ORDER BY v) — restart per group, sequence within. Nth highest distinct = DENSE_RANK; dedup/pagination = ROW_NUMBER; ties-inclusive top spot = RANK. Frames: ROWS BETWEEN 6 PRECEDING AND CURRENT ROW = moving average; default RANGE frame includes ties — the LAST_VALUE gotcha. Windows evaluate at SELECT: WHERE rn = 1 needs a subquery/CTE wrapper.', deepDive: 'Each distinct window ordering may add a sort — consolidate OVER clauses (or use WINDOW w AS (...)) for performance. Gaps-and-islands: date - ROW_NUMBER constant per consecutive run — the consecutive-days solver. Window aggregates vs GROUP BY: "every row with its group context" vs "one row per group" — the choosing criterion.', followUps: ['Solve top-3-per-group and name the rank choice', 'ROWS vs RANGE difference'], whiteboard: ['ties: RN 1,2,3,4 | RANK 1,2,2,4 | DENSE 1,2,2,3'] },
    { id: 'r-null', topic: 'NULL Three-Valued Logic', importance: 5, thirtySecond: 'NULL = unknown. Comparisons yield UNKNOWN; WHERE keeps TRUE only — so col <> \'x\' drops NULL rows and NOT IN with a NULL returns nothing. Use IS NULL, COALESCE, NOT EXISTS.', twoMinute: 'x NOT IN (1, NULL) ⇒ x<>1 AND x<>NULL ⇒ UNKNOWN ⇒ row dropped — the flagship silent bug. COUNT(*) vs COUNT(col): rows vs non-NULL values. Aggregates skip NULLs. UNIQUE usually allows many NULLs; GROUP BY/DISTINCT bucket NULLs together. NULLIF(y,0) guards division; IS DISTINCT FROM compares NULL-safely.', deepDive: 'Three-valued logic tables: UNKNOWN AND TRUE = UNKNOWN, UNKNOWN OR TRUE = TRUE — why OR conditions sometimes "save" NULL rows unexpectedly. CHECK constraints pass on UNKNOWN (only FALSE rejects) — opposite of WHERE. Sort position of NULLs is engine-specific; NULLS FIRST/LAST pins it.', followUps: ['Expand the NOT IN poisoning', 'Why does CHECK accept NULL but WHERE rejects it?'], whiteboard: ['NULL = sealed envelope', 'WHERE admits TRUE only'] },
    { id: 'r-subqueries', topic: 'Subqueries / Correlated / CTEs', importance: 4, thirtySecond: 'Scalar (one value), IN/EXISTS (membership), derived table (FROM). Correlated = references outer row, logically per-row re-execution. CTE = named block; WITH RECURSIVE walks hierarchies.', twoMinute: 'Correlated subqueries are the hidden O(n*m) — optimizers often decorrelate to joins, but rewrite proactively: grouped derived table + join, or a window function. Recursive CTE = anchor UNION ALL self-referencing step, iterating to empty — org charts, trees, series. CTEs chain readably; beware engines that materialize them as optimization fences (Postgres pre-12, or when referenced twice).', deepDive: 'Scalar subquery returning >1 row is a runtime error — a latent production bomb. EXISTS short-circuits on first match; SELECT 1 inside is convention. UNION ALL (not UNION) in recursive CTEs avoids per-iteration dedup cost; infinite recursion guards: depth column or cycle detection (CYCLE clause in newer Postgres).', followUps: ['Rewrite a correlated AVG comparison two ways', 'Write an org-chart recursive CTE'], whiteboard: ['correlated = per-row re-run → decorrelate'] },
    { id: 'r-normalization', topic: 'Normalization 1NF–3NF', importance: 4, thirtySecond: '1NF atomic values; 2NF whole-key dependence; 3NF no non-key→non-key dependence. "The key, the whole key, nothing but the key." Prevents update/insert/delete anomalies. Denormalize from evidence, not habit.', twoMinute: 'Violations: CSV-in-a-column (1NF); product_name in order_items keyed by (order_id, product_id) (2NF); dept_name beside dept_id in employees (3NF). Anomalies: update (change in N places), insert (cannot add parent without child), delete (losing last child erases parent facts). Denormalization targets: counter caches, reporting tables, star schemas — each one a consistency obligation you now own.', deepDive: 'BCNF tightens 3NF for keys with overlapping candidates — rarely interview-critical beyond naming it. The legitimate denormalization in OLTP: copying immutable facts (unit price at purchase time) — history must not change when the catalog does; that is not redundancy, it is a snapshot.', followUps: ['2NF vs 3NF concrete pair', 'Defend price-copy in order_items'], whiteboard: ['key / whole key / nothing but the key'] },
    { id: 'r-keys', topic: 'Keys & Constraints', importance: 4, thirtySecond: 'PK = unique + not null identity. FK = parent reference with ON DELETE policy. UNIQUE / NOT NULL / CHECK / DEFAULT push business rules into the engine. Surrogate over natural keys — natural ones change.', twoMinute: 'ON DELETE: RESTRICT (block), CASCADE (delete children — dangerous on fact tables), SET NULL (orphan but keep). Junction tables: composite PK (a_id, b_id). UNIQUE allows multiple NULLs (engine-typical). Idempotency via UNIQUE (user_id, key) beats application checks — constraints cannot race. Every enforced constraint deletes a class of bug application code might write.', deepDive: 'FK columns usually need indexes (most engines do not auto-create them; lock/scan costs on parent deletes otherwise). Deferred constraints (Postgres) check at COMMIT — circular references, bulk reorder. UUID vs sequence keys: locality and size trade-offs; UUIDv7 fixes index locality.', followUps: ['When is CASCADE right?', 'Why index FK columns?'], whiteboard: ['retry-safe = UNIQUE(user, idem_key)'] },
    { id: 'r-set-ops', topic: 'UNION / EXISTS / IN', importance: 3, thirtySecond: 'UNION dedups (sort/hash cost); UNION ALL just concatenates — default to ALL. IN vs EXISTS: usually same plan; NOT IN + NULL = zero rows, NOT EXISTS is the safe anti-join.', twoMinute: 'Set family: UNION, INTERSECT, EXCEPT (+ALL variants) — EXCEPT is a tidy "in A not in B". EXISTS short-circuits; its select list is irrelevant. Semi-join (EXISTS) returns left rows at most once — JOIN would duplicate per match. Choose by intent: existence test ⇒ EXISTS; small literal set ⇒ IN; difference of result sets ⇒ EXCEPT.', deepDive: 'Optimizers normalize IN/EXISTS to semi-joins; the real divergence is NOT IN\'s NULL semantics, which forces a different (often slower, always riskier) plan shape. UNION branches must be type-compatible positionally — implicit casts here are a subtle bug source.', followUps: ['Three spellings of anti-join', 'Why is NOT EXISTS preferred over NOT IN?'], whiteboard: ['NOT IN + NULL ⇒ ∅; use NOT EXISTS'] },
    { id: 'r-ddl-dml', topic: 'DELETE / TRUNCATE / DROP & Views', importance: 3, thirtySecond: 'DELETE: row DML, WHERE, triggers, slow at scale. TRUNCATE: instant page deallocation, resets identity, no row triggers. DROP: removes the object. View = inline macro; matview = stored, stale-until-refresh.', twoMinute: 'TRUNCATE is transactional in Postgres, auto-commits in MySQL/Oracle — a portability landmine. Mass deletion strategies: batched DELETEs (bounded locks/log), copy-keepers-and-swap, or partition drops. Views: abstraction + security (column subsetting), zero performance effect. Matviews: cache expensive aggregations; REFRESH ... CONCURRENTLY (needs unique index) keeps readers unblocked.', deepDive: 'DELETE leaves dead tuples (MVCC vacuum debt); TRUNCATE resets the relation — also why TRUNCATE needs an exclusive lock and DELETE does not. Updatable views need a single-table, no-aggregate shape; INSTEAD OF triggers generalize. Stacked views hide costs — inline-expanded complexity still executes.', followUps: ['Delete 100M of 500M rows — plan?', 'Matview vs summary table?'], whiteboard: ['DELETE=rows, TRUNCATE=pages, DROP=object'] },
    { id: 'r-procs', topic: 'Procedures vs Functions', importance: 2, thirtySecond: 'Functions return values, run inside queries, no transaction control. Procedures are CALLed, can COMMIT/ROLLBACK (modern engines), return via OUT params. Win = fewer round trips; cost = logic hidden from app tooling.', twoMinute: 'Use DB-side logic for data-adjacent multi-step atomic operations and privilege encapsulation (EXECUTE rights without table rights). Avoid burying core business rules: versioning, testing, and debugging lag application code. Triggers are the riskier sibling — implicit execution on DML, great for audit columns, dangerous for cascading business logic.', deepDive: 'Postgres: functions in SQL/PLpgSQL/etc., procedures since v11 with in-proc transaction control. Function volatility labels (IMMUTABLE/STABLE/VOLATILE) gate optimization and index usability of expression results. Set-returning functions blur the function/table line.', followUps: ['Where do you draw the app/DB logic line?', 'A trigger horror story and the lesson'], whiteboard: ['function ⊂ query; procedure = CALLed script'] },
    { id: 'r-classics', topic: 'Classic Query Patterns', importance: 5, thirtySecond: 'Nth salary: DENSE_RANK (or MAX-below-MAX, or DISTINCT+OFFSET). Duplicates: GROUP BY HAVING count>1; delete keepers via ROW_NUMBER>1. Top-N per group: rank in window, filter wrapper. Hierarchy compare: self-join.', twoMinute: 'Consecutive days: date - ROW_NUMBER() constant per streak (gaps-and-islands), group by it, COUNT(*) ≥ N. Pivot: SUM(CASE WHEN ...) per column under GROUP BY. Department max with ties: RANK = 1, not ROW_NUMBER. Employees > manager: self-join e.manager_id = m.id. Each classic has a "which rank function and why" follow-up — prepare the ties story.', deepDive: 'Meta-pattern: pre-window solutions (correlated subqueries, self-joins, MAX-join-back) vs window solutions — knowing both eras lets you adapt to any engine and explain WHY windows win (one scan vs per-row probes). The wrapper-subquery requirement (windows filter outside) appears in every single one.', followUps: ['Whiteboard all 8 classics in 20 minutes', 'Gaps-and-islands from scratch'], whiteboard: ['date - ROW_NUMBER = streak id', 'rank in window → filter in wrapper'] },
  ],
}

export default sql
