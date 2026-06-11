import type { ConceptLesson } from '../../../types/lesson'

const taggedTemplates: ConceptLesson = {
  // 1. Concept Summary
  slug: 'tagged-templates',
  name: 'Tagged Templates',
  category: 'types-coercion',
  difficulty: 'advanced',
  importance: 2,
  interviewFrequency: 1,

  // 2. Why Should I Care?
  whyCare: [
    'Tagged templates let a function intercept a template literal before it becomes a string — the basis for styled-components, lit-html, and graphql-tag.',
    'They are the safe way to interpolate untrusted values: a tag can escape each substitution, which raw template literals cannot.',
    'They give you the raw, unprocessed string parts via strings.raw — how String.raw and DSLs like regex/SQL builders work.',
    'Understanding them shows you grasp the difference between syntax sugar and a real meta-programming hook in the language.',
    'They are the mechanism behind CSS-in-JS, i18n message tags, and SQL/HTML builders you use in production.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A tagged template is handing your fill-in-the-blanks card to a helper who edits it before it is read.',
    story: [
      'Imagine you fill in the blanks of a story card, but instead of reading it yourself, you give it to a careful teacher first.',
      'The teacher gets the printed words in one pile and your hand-written answers in another pile.',
      'The teacher can fix your answers — make them neat, cross out rude words, or add color — then glue everything back together.',
      'A tag function is that teacher: it receives the fixed text and your values separately and decides how to combine them into the final result.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A normal template literal just builds a string by filling the blanks.',
    'If you put a function name right before the backticks, that function runs instead, and it gets the pieces handed to it: the plain text parts in one array and the filled-in values separately.',
    'The function can do anything with them — clean them up, change them, or return something that is not even a string.',
    'This is how special tools like styled CSS and safe HTML builders work: the tag function decides what the final result is.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A tagged template is a function call written as `tag`literal`` — the function (the "tag") receives the literal split into a static strings array plus the evaluated substitution values, and returns whatever it wants.',
    how: 'When the engine sees tag`a${x}b`, it calls tag(["a", "b"], x). The first argument is the array of static chunks (also carrying a .raw property with un-escaped text); the rest are the evaluated expressions.',
    why: 'It gives programmatic control over interpolation: escaping for safety, transforming values, building DSLs, or returning non-string results.',
    code: {
      label: 'A simple tag that uppercases interpolated values',
      lang: 'js',
      code: "function shout(strings, ...values) {\n  return strings.reduce((out, str, i) => {\n    const v = i < values.length ? String(values[i]).toUpperCase() : ''\n    return out + str + v\n  }, '')\n}\n\nconst name = 'sam'\nconsole.log(shout`hello ${name}, welcome`) // \"hello SAM, welcome\"",
      explanation: [
        'The tag function receives strings = ["hello ", ", welcome"] and values = ["sam"].',
        'strings has one more element than values (text always wraps the gaps).',
        'We rebuild the string, upper-casing each interpolated value.',
        'reduce stitches static chunk + transformed value alternately.',
        'The final returned string is what `shout`...`` evaluates to.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A tagged template is an expression of the form tag`template`, where tag is a function invoked with a template object as its first argument and the evaluated substitution expressions as the remaining arguments. The template object is a frozen array of the literal\'s cooked (escape-processed) string segments, augmented with a .raw property holding the un-escaped segments. The tag function fully controls the result and may return any value, enabling escaping, transformation, and embedded DSLs. The strings array is cached per call site for identity stability.',

  // 7. Internal Working
  internalWorking: [
    'At parse time, the literal is split into n+1 static segments around n substitution expressions.',
    'The engine builds a "template object": a frozen array of the cooked segments, with a frozen .raw array of the same segments without escape processing.',
    'This template object is cached and reused for the same call site across invocations, so its identity is stable (useful for memoization keys).',
    'Each substitution expression is evaluated left to right in the current scope.',
    'The tag function is invoked as tag(templateObject, value0, value1, ...); it is not required to return a string.',
    'For String.raw, the built-in tag joins strings.raw with the values, deliberately ignoring escape sequences so "\\n" stays literally backslash-n.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  tag`Hi ${user}! You owe $${amount}.`',
    '       │      │     │       │      │',
    '  ┌────┘      │     └───┐    │      └──┐',
    '  v           v         v    v         v',
    '  strings: ["Hi ", "! You owe $", "."]   (and strings.raw)',
    '  values:  [ user,            amount    ]',
    '',
    '  engine calls:  tag(strings, user, amount)',
    '                          │',
    '                          v',
    '              tag decides the final result (any type)',
  ].join('\n'),

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — inspect what the tag receives',
      lang: 'js',
      code: "function tag(strings, ...values) {\n  console.log(strings)      // [\"a\", \"b\", \"c\"]\n  console.log(strings.raw)  // raw versions\n  console.log(values)       // [1, 2]\n  return 'done'\n}\n\nconst x = 1, y = 2\nconsole.log(tag`a${x}b${y}c`) // logs arrays, then \"done\"",
      explanation: [
        'strings holds the static text chunks split around each ${}.',
        'strings.raw holds the same chunks without escape processing.',
        'values holds the evaluated expressions in order.',
        'The tag can return anything; here it returns the string "done".',
      ],
    },
    intermediate: {
      label: 'Intermediate — String.raw and a safe-HTML tag',
      lang: 'js',
      code: "// String.raw ignores escape sequences\nconst path = String.raw`C:\\new\\test` // backslashes kept literally\n\nconst escapeHtml = (s) => String(s)\n  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')\n\nfunction safe(strings, ...values) {\n  return strings.reduce((out, str, i) =>\n    out + str + (i < values.length ? escapeHtml(values[i]) : ''), '')\n}\n\nconst userInput = '<script>alert(1)</script>'\nconsole.log(safe`<p>${userInput}</p>`) // escaped, not executable",
      explanation: [
        'String.raw is a built-in tag that uses strings.raw, so \\n stays as backslash-n.',
        'The safe tag escapes each interpolated value before stitching.',
        'Because escaping happens per substitution, static markup is left untouched while dynamic values are neutralized.',
        'This is exactly how safe-HTML template tags defend against XSS.',
      ],
    },
    advanced: {
      label: 'Advanced — a tiny styled-components-like tag',
      lang: 'js',
      code: "function styled(tagName) {\n  return function (strings, ...fns) {\n    return function render(props) {\n      const css = strings.reduce((out, str, i) => {\n        const part = i < fns.length\n          ? (typeof fns[i] === 'function' ? fns[i](props) : fns[i])\n          : ''\n        return out + str + part\n      }, '')\n      return `<${tagName} style=\"${css}\">`\n    }\n  }\n}\n\nconst Button = styled('button')`\n  color: ${(p) => p.primary ? 'white' : 'black'};\n`\nconsole.log(Button({ primary: true }))",
      explanation: [
        'styled returns a tag function; the substitutions here are functions of props.',
        'At render time each function is called with props to resolve a dynamic CSS value.',
        'The tag stitches static CSS text with resolved dynamic parts.',
        'This curried-tag pattern (styled(tag)`...`) is the heart of CSS-in-JS libraries.',
      ],
    },
    realProject: {
      label: 'Real project — a parameterized SQL tag (React/Node backend)',
      lang: 'js',
      code: "// Build a parameterized query instead of string interpolation\nfunction sql(strings, ...values) {\n  const text = strings.reduce((acc, str, i) =>\n    acc + str + (i < values.length ? `$${i + 1}` : ''), '')\n  return { text, values }\n}\n\nconst id = 42\nconst query = sql`SELECT * FROM users WHERE id = ${id}`\n// { text: 'SELECT * FROM users WHERE id = $1', values: [42] }\n// db.query(query.text, query.values)",
      explanation: [
        'The tag turns interpolations into positional placeholders ($1, $2) and collects the values separately.',
        'This prevents SQL injection because values never become part of the query text.',
        'Many real query builders (e.g. slonik, postgres.js) use exactly this tagged-template shape.',
        'In a React/Node app this keeps data-access calls both readable and safe.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a tagged template?',
      answer: 'A function call written as tag`literal`. The tag function receives the static string parts as an array and the interpolated values as the remaining arguments, and returns whatever it wants.',
      explanation: 'The key is that the tag intercepts the literal before it becomes a string and controls the output.',
    },
    {
      level: 'intermediate',
      question: 'What are the arguments a tag function receives?',
      answer: 'The first argument is an array of the static (cooked) string segments, which also has a .raw property of un-escaped segments. The rest are the evaluated substitution expressions, in order. strings.length === values.length + 1.',
      explanation: 'Mentioning the off-by-one (n+1 strings for n values) and the .raw property shows precise understanding.',
    },
    {
      level: 'intermediate',
      question: 'What does String.raw do?',
      answer: 'It is a built-in tag that joins the raw string segments with the values, ignoring escape sequences — so "\\n" stays as backslash-n instead of a newline. Useful for regex, Windows paths, and code generation.',
      explanation: 'It directly demonstrates the purpose of strings.raw.',
    },
    {
      level: 'advanced',
      question: 'How do tagged templates help prevent XSS or SQL injection?',
      answer: 'Because the tag receives the values separately from the static text, it can escape each value (HTML) or replace it with a bound parameter placeholder (SQL) before assembling the result, so user input never becomes executable markup or query syntax.',
      explanation: 'This connects the mechanism to a real security benefit and is the strongest reason to use them.',
    },
    {
      level: 'advanced',
      question: 'Why is the strings array identity stable across calls to the same tagged literal?',
      answer: 'The engine caches the template object per call site, so the same frozen strings array is passed on every evaluation of that literal. Libraries can use it as a memoization key (e.g. to compile a query/template once).',
      explanation: 'Call-site caching is a subtle but real optimization hook that senior candidates know.',
    },
    {
      level: 'senior',
      question: 'How would you design a tagged template DSL, and what are the pitfalls?',
      answer: 'Decide on a return type (string, object, render function), process strings.raw vs cooked appropriately, escape/transform values, and consider memoizing on the cached strings identity. Pitfalls: forgetting the n+1 invariant, leaking unescaped values, and breaking minifiers/tree-shaking with dynamic tags.',
      explanation: 'Senior signal: designing the contract, caching, escaping, and tooling implications.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Why does the strings array always have one more element than the values?',
    'What is the difference between strings and strings.raw?',
    'How does styled-components use tagged templates?',
    'Can a tag function return something other than a string?',
    'How would you implement String.raw yourself?',
    'How do tagged templates relate to internationalization (i18n) message tags?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Assuming strings and values have the same length.',
      why: 'There is always one more static segment than values (text surrounds every gap).',
      fix: 'Iterate strings and only append values[i] when i < values.length.',
    },
    {
      mistake: 'Forgetting to escape interpolated values in an HTML tag.',
      why: 'A tag is only safe if it actively escapes; merely using a tag does not neutralize input.',
      fix: 'Escape every substitution inside the tag before stitching it into the output.',
    },
    {
      mistake: 'Using cooked strings when you needed raw text (or vice versa).',
      why: 'Cooked strings have escape sequences processed; raw strings do not — they behave differently for \\n, \\t, etc.',
      fix: 'Use strings.raw when you want literal backslashes (regex, paths, codegen).',
    },
    {
      mistake: 'Building a dynamic tag name that defeats minification/static analysis.',
      why: 'Tooling (e.g. babel-plugin for styled or graphql) often relies on statically analyzable tags.',
      fix: 'Keep tags as named imports used directly so build-time transforms can find them.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'React', detail: 'styled-components and emotion use tagged templates for CSS-in-JS; graphql-tag (gql`...`) parses queries; many i18n libs expose a message tag.' },
    { area: 'Vue', detail: 'CSS-in-JS solutions and html`...` template tags (lit-style) use tagged templates; some i18n/format helpers are tag-based.' },
    { area: 'Node.js', detail: 'SQL query builders (postgres.js, slonik) use a sql`...` tag to produce parameterized, injection-safe queries.' },
    { area: 'Backend', detail: 'Safe-HTML rendering, log redaction tags, and code generation use tags to escape/transform interpolated values centrally.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'The template object is cached per call site, so libraries can compile/parse once and reuse across renders.',
      'Centralized escaping in a tag avoids repeated ad-hoc escaping logic scattered through code.',
    ],
    bad: [
      'A tag function runs on every evaluation; heavy per-call work (parsing, regex) without caching adds overhead.',
      'Creating new tag closures dynamically (e.g. styled(tag) inside render) can defeat caching and add allocations.',
    ],
    optimizations: [
      'Memoize expensive work using the stable strings identity as the cache key.',
      'Hoist styled/gql tag definitions to module scope so they are created once.',
      'Keep per-substitution work minimal; precompute static parts when possible.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'A tag that does not escape values offers no safety over a plain literal — XSS/injection remain possible.',
      'Mixing cooked and raw incorrectly can reintroduce control characters you intended to neutralize.',
    ],
    bestPractices: [
      'Escape (HTML) or parameterize (SQL) every interpolated value inside the tag, never the static text.',
      'Prefer well-audited tag libraries (e.g. parameterized SQL tags) over hand-rolled escaping for security-critical paths.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-literals', 'higher-order-functions', 'type-coercion'],
    nextConcepts: ['xss', 'json-serialization', 'currying-partial-application'],
    dependencyNote:
      'Tagged templates extend template literals by handing their parts to a function, so you need template literals and higher-order/curried functions first. They unlock safe interpolation (XSS/SQLi defense) and DSL-style libraries.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write tag`a${x}b${y}c` on the board.',
      'Split it: strings = ["a","b","c"], values = [x, y]; circle the n+1 invariant.',
      'Draw the engine calling tag(strings, x, y).',
      'Show the tag reduce-stitching static + transformed value.',
      'Say: "Because values arrive separately, the tag can escape them — that is why tags are the safe way to interpolate."',
    ],
    diagram: [
      '  tag`a ${x} b ${y} c`',
      '       │     │     │',
      '  strings = ["a ", " b ", " c"]   <- n+1 parts',
      '  values  = [ x ,   y ]           <- n values',
      '',
      '  tag(strings, x, y) -> reduce(static + escape(value)) -> result',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'A tagged template is tag`literal`: the engine calls tag with the static string parts as an array (plus a .raw property) and the interpolated values as separate arguments. There is always one more string than value. Because values arrive separately, the tag can escape, transform, or replace them, returning any type. This powers String.raw, styled-components/CSS-in-JS, gql, and parameterized SQL — and it is the safe way to interpolate untrusted input.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'A tagged template is a special function call written by placing a function name directly before a template literal, like tag`a${x}b`. Instead of building a string, the engine calls the tag function with two kinds of arguments: the first is an array of the static text segments — the parts between the substitutions — and the rest are the evaluated interpolated values. Importantly, there is always one more static segment than there are values, because text surrounds every gap. That first array also carries a .raw property with the segments before escape processing, which is how String.raw keeps backslash-n literal. The big idea is that values arrive separately from the static text, so the tag has full control: it can escape each value to prevent XSS, replace each value with a positional placeholder to build a parameterized SQL query that resists injection, transform values, or even return a non-string like a render function. The engine also caches the template object per call site, so its identity is stable and libraries can compile or parse once and reuse. This mechanism is what styled-components, emotion, lit-html, graphql-tag, and SQL builders are built on. The pitfalls are forgetting the n+1 invariant and assuming a tag is safe without actually escaping values inside it.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Power vs obscurity: tags enable elegant DSLs but hide control flow; debugging a misbehaving tag is harder than plain concatenation.',
      'Build-time vs runtime tags: statically analyzable tags enable compiler plugins (styled/gql), but dynamic tags lose that and may hurt bundling.',
    ],
    edgeCases: [
      'strings.length is always values.length + 1, including empty leading/trailing segments.',
      'cooked segments can be undefined for invalid escape sequences in some tag contexts, while .raw stays defined.',
      'The cached template object is frozen — mutating it throws in strict mode.',
      'A tag can return any type, so consumers must know the contract (string vs object vs function).',
    ],
    runtimeBehavior: [
      'Substitutions are evaluated left to right before the tag is invoked.',
      'The template object is created once per call site and reused, giving stable identity across calls.',
      'String.raw uses .raw and ignores escapes; cooked segments process them.',
    ],
    scalability: [
      'Compile-once-per-site caching keyed on the strings identity scales well across many renders.',
      'Avoid allocating tags inside hot render paths; define them at module scope.',
    ],
    productionConcerns: [
      'Security depends entirely on the tag escaping/parameterizing values — audit tag implementations.',
      'Tooling (minifiers, babel plugins) may depend on tags being statically resolvable named imports.',
      'A buggy or non-caching tag in a hot path can become a performance regression.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Syntax: tag`text ${expr} more` -> tag(strings, expr, ...).',
    'strings = static parts array; values = the expressions.',
    'strings.length === values.length + 1 (always).',
    'strings.raw = un-escaped segments (String.raw uses it).',
    'Tag can return ANY type, not just a string.',
    'Template object is frozen and cached per call site.',
    'Use to escape values -> XSS-safe HTML.',
    'Use to make placeholders -> SQL-injection-safe queries.',
    'Powers styled-components, emotion, lit-html, gql.',
    'Curried form styled(tag)`...` is the CSS-in-JS pattern.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a tag function join that simply rebuilds the original interpolated string (acts like a normal template literal).',
      hint: 'Stitch strings[i] + values[i] in order.',
      solution: {
        lang: 'js',
        code: "function join(strings, ...values) {\n  return strings.reduce((out, str, i) =>\n    out + str + (i < values.length ? values[i] : ''), '')\n}\nconst a = 1, b = 2\njoin`sum ${a} + ${b}` // \"sum 1 + 2\"",
        explanation: [
          'reduce walks each static segment and appends the matching value when present.',
          'The i < values.length guard handles the final trailing segment that has no value.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a tag html that HTML-escapes every interpolated value but leaves the static markup untouched.',
      hint: 'Escape only values[i], not strings[i].',
      solution: {
        lang: 'js',
        code: "const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')\nfunction html(strings, ...values) {\n  return strings.reduce((out, str, i) =>\n    out + str + (i < values.length ? esc(values[i]) : ''), '')\n}\nhtml`<p>${'<b>hi</b>'}</p>` // \"<p>&lt;b&gt;hi&lt;/b&gt;</p>\"",
        explanation: [
          'Only the dynamic values are escaped; the trusted static <p> stays intact.',
          'This is the core of a safe-HTML template tag.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement myRaw to mimic String.raw using the raw segments.',
      hint: 'Use strings.raw, not strings.',
      solution: {
        lang: 'js',
        code: "function myRaw(strings, ...values) {\n  return strings.raw.reduce((out, str, i) =>\n    out + str + (i < values.length ? values[i] : ''), '')\n}\nmyRaw`a\\nb${1}c` // \"a\\\\nb1c\" (backslash-n stays literal)",
        explanation: [
          'Using strings.raw keeps escape sequences un-processed, so \\n stays as two characters.',
          'Otherwise the logic is identical to a normal join tag.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Write a sql tag that returns { text, values } with $1, $2 placeholders to make queries injection-safe.',
      hint: 'Replace each value with $ + (i + 1) and collect values separately.',
      solution: {
        lang: 'js',
        code: "function sql(strings, ...values) {\n  const text = strings.reduce((acc, str, i) =>\n    acc + str + (i < values.length ? `$${i + 1}` : ''), '')\n  return { text, values }\n}\nsql`SELECT * FROM u WHERE id = ${5} AND age > ${18}`\n// { text: 'SELECT * FROM u WHERE id = $1 AND age > $2', values: [5, 18] }",
        explanation: [
          'Each interpolation becomes a positional placeholder, never inline text.',
          'Values are passed separately to the driver, so they cannot alter the query structure — preventing SQL injection.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Tagged templates are the meta-programming hook behind CSS-in-JS, GraphQL clients, and safe query builders. Knowing them lets you reason about how those libraries work and how to interpolate untrusted data safely.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) rarely ask beyond "what is a tagged template". Product companies (Zoho, Flipkart, Razorpay) probe the strings/values shape and the XSS/SQL-safety angle. FAANG-level interviews ask you to implement String.raw, design a DSL tag, or explain call-site caching and the n+1 invariant.',
    whatInterviewersExpect:
      'You can write tag`...` and explain the arguments, state the n+1 invariant and .raw, implement an escaping or SQL tag, and articulate why separating values from static text makes tags the safe interpolation mechanism.',
  },
}

export default taggedTemplates
