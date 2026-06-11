import type { ConceptLesson } from '../../../types/lesson'

const templateLiterals: ConceptLesson = {
  // 1. Concept Summary
  slug: 'template-literals',
  name: 'Template Literals',
  category: 'types-coercion',
  difficulty: 'beginner',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'Template literals are the modern way to build strings — they replace fragile "+" concatenation that is error-prone and hard to read.',
    'They give you real multi-line strings without "\\n" soup, which matters for HTML snippets, SQL, and logging.',
    'String interpolation with ${...} lets you embed any expression directly, keeping templates readable and reducing off-by-one quoting bugs.',
    'Almost every framework template, GraphQL query, styled-components CSS, and log message you write uses them — fluency signals everyday JS competence.',
    'They are the gateway to tagged templates, which power libraries like styled-components, lit-html, and SQL builders.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A template literal is a fill-in-the-blanks story card.',
    story: [
      'Imagine a birthday card that already has the words printed, but with blank lines: "Happy Birthday, ____! You are ____ years old today!"',
      'You just write the name and the age into the blanks, and the card reads perfectly without you copying the whole sentence by hand.',
      'In JavaScript, the backtick string is that card, and the ${ } blanks are where you drop in names, numbers, or anything you want.',
      'You never have to glue pieces together with plus signs and worry about missing spaces — the card already has the spaces in the right places.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A template literal is a string written with backticks instead of normal quotes.',
    'Inside it, you can put ${ } and JavaScript will replace that with whatever value the code inside produces.',
    'You can also press Enter inside a backtick string to make it span several lines, which normal quotes do not allow.',
    'So instead of joining text and variables with +, you write one neat string and let the blanks fill themselves in.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'A template literal is a string delimited by backticks that supports embedded expressions via ${expression} and spans multiple lines literally.',
    how: 'At parse time the engine splits the literal into static text chunks and the expressions between them. Each expression is evaluated, coerced to a string, and spliced between the static chunks to produce the final string.',
    why: 'It makes string building readable and safe: no manual concatenation, real newlines, and any expression (math, function calls, ternaries) can be inlined.',
    code: {
      label: 'Interpolation and multi-line',
      lang: 'js',
      code: "const name = 'Sam'\nconst items = 3\n\nconst msg = `Hello, ${name}! You have ${items} item${items === 1 ? '' : 's'}.`\nconsole.log(msg) // \"Hello, Sam! You have 3 items.\"\n\nconst block = `Line one\nLine two`\nconsole.log(block) // prints across two lines",
      explanation: [
        'Backticks start and end the template literal instead of single or double quotes.',
        '${name} and ${items} are interpolations — the expression inside is evaluated and inserted.',
        'You can put a full expression in ${...}: here a ternary chooses between "" and "s" for correct pluralization.',
        'The second literal contains a real line break, so it prints on two lines without "\\n".',
        'Each interpolated value is coerced to a string the same way String(value) would.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'A template literal is a string literal enclosed in backticks that supports multi-line text and expression interpolation using the ${ } substitution syntax. At evaluation, each substitution expression is computed, converted to a string via the abstract ToString operation, and concatenated with the surrounding literal portions. The result is an ordinary primitive string; template literals add no runtime type, only nicer syntax (and, with a tag, programmatic access to the raw parts).',

  // 7. Internal Working
  internalWorking: [
    'The parser tokenizes the backtick literal into alternating "template strings" (static text) and "substitutions" (the ${...} expressions).',
    'Line terminators inside the literal are kept verbatim, which is how multi-line works; escape sequences like \\n and \\t are still processed.',
    'When evaluated, each substitution expression is run in the current scope to produce a value.',
    'Each value undergoes ToString coercion (objects call their toString/Symbol.toPrimitive, numbers/booleans convert directly).',
    'The engine concatenates: staticChunk[0] + str(expr[0]) + staticChunk[1] + str(expr[1]) + ... producing a single primitive string.',
    'For a tagged template, instead of concatenating, the engine passes a frozen strings array (with a .raw property) plus the evaluated expressions to the tag function.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: [
    '  `Hello, ${name}! You have ${count} items`',
    '   └──┬──┘   └─┬─┘  └────┬─────┘   └─┬─┘',
    '   static    expr      static       expr',
    '      0        0          1           1',
    '',
    '  evaluate exprs -> coerce to string -> splice between static parts',
    '',
    '  "Hello, " + String(name) + "! You have " + String(count) + " items"',
    '                        |',
    '                        v',
    '              one primitive string',
  ].join('\n'),

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — interpolation vs concatenation',
      lang: 'js',
      code: "const user = 'Mia'\nconst age = 9\n\n// old way\nconst a = 'User ' + user + ' is ' + age + ' years old'\n// template literal\nconst b = `User ${user} is ${age} years old`\nconsole.log(a === b) // true",
      explanation: [
        'Both produce the same string, but the template literal reads like the final sentence.',
        'No risk of forgetting a space or a + between fragments.',
        'The expressions are evaluated left to right and coerced to strings.',
      ],
    },
    intermediate: {
      label: 'Intermediate — expressions, calls, multi-line HTML',
      lang: 'js',
      code: "const price = 1299.5\nconst fmt = (n) => '$' + n.toFixed(2)\n\nconst card = `\n  <article>\n    <h2>${'Pro Plan'.toUpperCase()}</h2>\n    <p>${fmt(price)} / month</p>\n  </article>`\nconsole.log(card)",
      explanation: [
        'Any expression works inside ${...}: method calls, arithmetic, function calls.',
        'fmt(price) is invoked and its return value is interpolated.',
        'The literal spans multiple lines, making the HTML structure readable.',
        'Note the leading newline becomes part of the string — trim() if you do not want it.',
      ],
    },
    advanced: {
      label: 'Advanced — nesting and list rendering',
      lang: 'js',
      code: "const items = ['Pen', 'Pad', 'Ink']\n\nconst list = `<ul>${items\n  .map((i) => `<li>${i}</li>`)\n  .join('')}</ul>`\n\nconsole.log(list) // <ul><li>Pen</li><li>Pad</li><li>Ink</li></ul>",
      explanation: [
        'Template literals nest: the inner `<li>${i}</li>` is itself a template literal inside the map.',
        'items.map(...).join("") builds the inner markup, then it is interpolated into the outer literal.',
        'This is the core idea behind tag-template HTML libraries, done manually here.',
        'Avoid this pattern for untrusted data — interpolating user input into HTML is an XSS risk.',
      ],
    },
    realProject: {
      label: 'Real project — log line and a GraphQL query in Node',
      lang: 'js',
      code: "function logRequest(req, ms) {\n  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - ${ms}ms`)\n}\n\nconst userId = 42\nconst query = `\n  query {\n    user(id: ${userId}) { name email }\n  }`",
      explanation: [
        'Structured log lines are far cleaner as a single interpolated template than with concatenation.',
        'new Date().toISOString() is an inline expression evaluated at log time.',
        'The multi-line GraphQL query reads exactly like the query you would write by hand.',
        'In React/Vue you see the same pattern for class names and dynamic strings; for real GraphQL prefer parameterized variables over interpolation to avoid injection.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is a template literal and how does it differ from a normal string?',
      answer: 'It is a string written with backticks that supports ${ } interpolation and real multi-line text, instead of relying on + concatenation and \\n.',
      explanation: 'A good answer names both features — interpolation and multi-line — and notes the result is still a plain primitive string.',
    },
    {
      level: 'beginner',
      question: 'How do you embed a variable inside a template literal?',
      answer: 'Use ${expression} inside the backticks, e.g. `Hello, ${name}`. Any expression is allowed, not just variables.',
      explanation: 'Interviewers want to see that ${} takes a full expression, so calls and ternaries also work.',
    },
    {
      level: 'intermediate',
      question: 'How are values inside ${} converted to strings?',
      answer: 'Each expression is evaluated and then coerced to a string using ToString (the same as String(value)) before being concatenated with the static parts.',
      explanation: 'Mentioning ToString/Symbol.toPrimitive shows you understand the coercion step, not just the syntax.',
    },
    {
      level: 'intermediate',
      question: 'Can you nest template literals, and when would you?',
      answer: 'Yes — you can put a template literal inside a ${} of another. Common when mapping arrays to markup, e.g. building <li> elements inside a <ul> literal.',
      explanation: 'A practical example (list rendering) demonstrates real usage beyond toy strings.',
    },
    {
      level: 'advanced',
      question: 'What risks come with interpolating values into HTML or SQL via template literals?',
      answer: 'Directly interpolating untrusted input creates XSS (HTML) or injection (SQL), because the value becomes part of the executable markup/query. Use escaping/sanitization for HTML and parameterized queries for SQL.',
      explanation: 'A strong answer connects a syntax feature to a real security consequence and the correct mitigation.',
    },
    {
      level: 'senior',
      question: 'What does a template literal desugar to, and how does a tag change that?',
      answer: 'A plain literal desugars to concatenation of static parts and ToString-coerced expressions. A tagged template instead calls tag(strings, ...exprs) where strings is a frozen array with a .raw property, giving the function programmatic access to raw text and values.',
      explanation: 'Connecting plain vs tagged templates and mentioning strings.raw signals deeper understanding.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'How would you escape a literal backtick or a literal ${ inside a template literal?',
    'What is the difference between a template literal and a tagged template?',
    'Do template literals affect performance versus concatenation?',
    'How do escape sequences like \\n behave inside backticks vs the multi-line newline?',
    'How would you safely interpolate user content into HTML?',
    'What is strings.raw and when is it useful?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using quotes instead of backticks and expecting interpolation to work.',
      why: '${} only has special meaning inside backtick strings; in regular quotes it is literal text.',
      fix: 'Always use backticks for any string that interpolates or spans multiple lines.',
    },
    {
      mistake: 'Interpolating untrusted user input directly into HTML.',
      why: 'The input becomes live markup, enabling XSS.',
      fix: 'Escape/sanitize the value or use framework binding (textContent, Vue/React text) instead of raw HTML interpolation.',
    },
    {
      mistake: 'Forgetting that indentation/leading newlines become part of the string.',
      why: 'Template literals preserve all whitespace literally, including the line break right after the opening backtick.',
      fix: 'Trim or use a dedent helper, or structure the literal so unwanted whitespace is not included.',
    },
    {
      mistake: 'Assuming objects interpolate usefully.',
      why: 'An object is coerced via toString, usually yielding "[object Object]".',
      fix: 'Interpolate a specific property or JSON.stringify the object explicitly.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Dynamic class strings, aria labels, and computed text are built with template literals; styled/CSS-in-JS approaches use tagged templates built on this syntax.' },
    { area: 'React', detail: 'className composition (`btn ${active ? "on" : ""}`), styled-components CSS, and dynamic strings rely on template literals; map+template literal is a common ad-hoc markup builder.' },
    { area: 'Node.js', detail: 'Structured log lines, file paths, shell command strings, and GraphQL/SQL query text are commonly written as multi-line template literals.' },
    { area: 'Backend', detail: 'Email/HTML templates and config strings; note that SQL should use parameterized queries, not interpolation, to avoid injection.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Template literals are optimized by modern engines and are effectively as fast as concatenation for typical use.',
      'They reduce bugs (and thus rework) by making string assembly readable and explicit.',
    ],
    bad: [
      'Building huge strings in a hot loop via many interpolations still allocates intermediate strings and can pressure GC.',
      'Heavy nested template construction on every render (e.g. building large HTML manually) can be slower than using a virtual DOM diff.',
    ],
    optimizations: [
      'For very large output, build an array and join("") once rather than repeatedly concatenating.',
      'Hoist static template parts out of loops so only the dynamic bits are recomputed.',
      'Prefer framework rendering (Vue/React) over hand-built HTML strings for large dynamic content.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Interpolating untrusted data into HTML strings causes XSS.',
      'Interpolating into SQL/shell command strings causes injection (SQLi, command injection).',
    ],
    bestPractices: [
      'Never build HTML for untrusted content via interpolation; use textContent or framework text bindings, or escape with a trusted sanitizer.',
      'Use parameterized/prepared statements for SQL and argument arrays for child processes instead of interpolated command strings.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['data-types', 'type-coercion'],
    nextConcepts: ['tagged-templates', 'json-serialization', 'xss'],
    dependencyNote:
      'Template literals build on the string data type and ToString coercion. They lead directly into tagged templates (programmatic access to the parts) and into XSS awareness once you start interpolating into the DOM.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write a backtick string with two ${ } blanks in it.',
      'Underline the static text chunks and circle the expressions.',
      'Show the evaluation arrow: each circled expression -> String(value).',
      'Write the equivalent concatenation underneath to prove they produce the same primitive string.',
      'Say: "Backticks add interpolation and multi-line; the output is still a normal string."',
    ],
    diagram: [
      '  `Hi ${user}, you have ${n} msgs`',
      '   ───  ──────  ─────────  ───',
      '   static expr   static   expr',
      '',
      ' = "Hi " + String(user) + ", you have " + String(n) + " msgs"',
    ].join('\n'),
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Template literals are backtick strings that support ${ } interpolation and real multi-line text. Each expression inside ${ } is evaluated and ToString-coerced, then spliced between the static parts to produce one ordinary primitive string. They replace + concatenation, make HTML/SQL/log strings readable, and are the basis for tagged templates. Watch out for XSS/injection when interpolating untrusted input.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Template literals are strings written with backticks rather than quotes, and they add two big features. First, interpolation: anywhere inside the string you can write ${expression}, and the engine evaluates that expression, coerces the result to a string with ToString, and splices it between the static text. Because it accepts any expression, you can inline arithmetic, function calls, or ternaries — for example a pluralization ternary. Second, they support real multi-line strings, so HTML snippets, SQL, and log lines read exactly as written instead of being glued together with plus signs and escaped newlines. Under the hood a plain template literal just desugars to concatenation of the static chunks and the coerced expressions, so the result is an ordinary primitive string — there is no new type. They also nest, which is handy when mapping an array to markup. The main caveat is security: if you interpolate untrusted user input into HTML you create an XSS hole, and into SQL an injection hole, so you escape or use parameterized queries. Finally, they are the foundation for tagged templates, where a function receives the static parts plus the values and can process them — that is how libraries like styled-components and lit-html work.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Readability vs control: interpolation is clean but hides the coercion step, which can surprise you with "[object Object]" or unexpected number formatting.',
      'Hand-built template strings vs framework rendering: manual literals are fine for small fragments but lose escaping, diffing, and reactivity for large dynamic UI.',
    ],
    edgeCases: [
      'Leading newline/indentation after the opening backtick is included in the string.',
      'Objects interpolate via toString, so you usually need an explicit property or JSON.stringify.',
      'Escape sequences (\\n, \\t, \\u..) are still processed inside backticks unless you use a raw tag.',
      'NaN, null, and undefined interpolate as the strings "NaN", "null", "undefined".',
    ],
    runtimeBehavior: [
      'Each substitution is evaluated once, left to right, in the surrounding scope.',
      'The coercion uses ToString/ToPrimitive, calling Symbol.toPrimitive or toString as applicable.',
      'A tagged template additionally builds a cached, frozen strings array with a .raw property for raw text access.',
    ],
    scalability: [
      'For high-volume string assembly (log pipelines, large reports), array + join or streaming output beats repeated concatenation.',
      'For UI at scale, prefer the framework renderer over manually concatenated HTML strings to keep escaping and diffing correct.',
    ],
    productionConcerns: [
      'Untrusted interpolation is a leading source of XSS/injection — enforce escaping and parameterization in code review.',
      'Whitespace/dedent surprises can break exact-match output (e.g. snapshot tests, generated files).',
      'Number/date formatting via interpolation is locale-naive; use Intl for user-facing values.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Backticks instead of quotes.',
    'Interpolate with ${ expression } — any expression, not just variables.',
    'Multi-line is literal: line breaks and indentation are kept.',
    'Result is a normal primitive string; no new type.',
    'Each expr is evaluated left-to-right and ToString-coerced.',
    'Desugars to concatenation of static parts + coerced expressions.',
    'Nests freely — great for map(...).join("") markup.',
    'Objects become "[object Object]" unless you pick a property / JSON.stringify.',
    'Untrusted HTML interpolation = XSS; untrusted SQL = injection.',
    'Tagged templates: tag(strings, ...exprs) with strings.raw for raw text.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Given const name = "Ana" and const age = 30, build the string "Ana is 30" using a template literal.',
      hint: 'Use backticks and two ${} blanks.',
      solution: {
        lang: 'js',
        code: "const name = 'Ana'\nconst age = 30\nconst s = `${name} is ${age}`\nconsole.log(s) // \"Ana is 30\"",
        explanation: ['Backticks enable interpolation.', 'Each ${} is replaced by its coerced value, joined by the literal " is ".'],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a function summary(items) that returns "You have N items: a, b, c" with correct singular/plural for 1 item.',
      hint: 'Use a ternary inside ${} and items.join(", ").',
      solution: {
        lang: 'js',
        code: "function summary(items) {\n  const n = items.length\n  return `You have ${n} item${n === 1 ? '' : 's'}: ${items.join(', ')}`\n}\nsummary(['pen']) // \"You have 1 item: pen\"\nsummary(['a', 'b']) // \"You have 2 items: a, b\"",
        explanation: [
          'The ternary inside ${} handles pluralization inline.',
          'items.join(", ") is an expression evaluated and interpolated.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Build an HTML <ul> string from const fruits = ["Apple","Pear"] producing <ul><li>Apple</li><li>Pear</li></ul> using nested template literals.',
      hint: 'map each fruit to a `<li>${f}</li>` literal, then join.',
      solution: {
        lang: 'js',
        code: "const fruits = ['Apple', 'Pear']\nconst html = `<ul>${fruits.map((f) => `<li>${f}</li>`).join('')}</ul>`\nconsole.log(html)",
        explanation: [
          'The inner `<li>${f}</li>` is a nested template literal inside map.',
          'join("") collapses the array into the inner markup, then it is interpolated into the outer <ul>.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain in code why `${user}` is unsafe for untrusted HTML and show a safer alternative using textContent.',
      hint: 'Show that markup in user breaks out; assign via textContent instead.',
      solution: {
        lang: 'js',
        code: "const user = '<img src=x onerror=alert(1)>'\n\n// UNSAFE: injects live markup\nel.innerHTML = `<p>${user}</p>`\n\n// SAFE: treated as text, not markup\nconst p = document.createElement('p')\np.textContent = user\nel.replaceChildren(p)",
        explanation: [
          'innerHTML parses the interpolated string as HTML, so the onerror handler runs — that is XSS.',
          'textContent assigns the value as plain text, so the tags are shown literally, never executed.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Template literals are everyday syntax: clean string building, multi-line templates, and the foundation for tagged-template libraries. Fluency here removes a whole class of concatenation bugs and signals you write modern, readable JavaScript.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) may simply ask the difference from concatenation and how interpolation works. Product companies (Zoho, Flipkart, Razorpay) ask you to build dynamic markup/log strings and probe the XSS risk. FAANG-level interviews push into desugaring, ToString coercion, and tagged templates / strings.raw.',
    whatInterviewersExpect:
      'You can define them (backticks, interpolation, multi-line), explain the coercion step, build nested/conditional strings, and articulate the security risk of interpolating untrusted input plus the correct mitigation.',
  },
}

export default templateLiterals
