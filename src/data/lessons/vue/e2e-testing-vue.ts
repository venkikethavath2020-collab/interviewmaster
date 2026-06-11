import type { ConceptLesson } from '../../../types/lesson'

const e2eTestingVue: ConceptLesson = {
  // 1. Concept Summary
  slug: 'e2e-testing-vue',
  name: 'E2E Testing',
  category: 'testing',
  difficulty: 'intermediate',
  importance: 2,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'End-to-end tests are the only tests that exercise your real, built app in a real browser the way a user actually does — they catch integration bugs that unit and component tests structurally cannot.',
    'They protect the business-critical journeys (login, checkout, signup) where a regression directly loses money or users.',
    'E2E is also the easiest test to do badly: slow, flaky suites that nobody trusts. Knowing how to keep them stable (few tests, stable selectors, no arbitrary sleeps) is the real skill.',
    'Modern runners (Cypress, Playwright) are ubiquitous, and interviewers expect you to know when to reach for E2E versus pushing logic down the pyramid.',
    'E2E is where you verify cross-cutting concerns — routing, real network or stubs, auth, third-party widgets — that only manifest in a fully assembled app.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'E2E testing is a robot pretending to be a real customer, walking through your whole shop from front door to checkout.',
    story: [
      'Imagine you built a toy shop. You already checked that each toy works and that each shelf is built correctly.',
      'But you still want to know: can a real customer walk in the front door, pick a toy, carry it to the register, pay, and leave happy?',
      'So you hire a friendly robot to pretend to be a customer. It opens the door, clicks on a toy, goes to the counter, types in pretend money, and checks that it gets a receipt.',
      'That robot is an end-to-end test. It does not care how the shop is built inside — it only checks that the whole journey works from start to finish, just like a real person would experience it.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Unit and component tests check small pieces. End-to-end (E2E) tests check the WHOLE app working together by driving a real browser.',
    'A tool like Cypress or Playwright opens your running app, then automatically visits pages, clicks buttons, types in fields, and checks what appears — exactly like a human tester, but automatic and repeatable.',
    'Because it runs the real app and a real browser, it is the most realistic test, but also the slowest and the most likely to be flaky, so you only write a few for the most important user journeys.',
    'To stop tests breaking when you restyle things, you select elements by special data-test attributes instead of fragile CSS classes or text.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'End-to-end testing drives the fully-built Vue application in a real browser to verify complete user journeys — routing, forms, network, and rendering all working together — from the user\'s perspective.',
    how: 'You use Cypress or Playwright. The runner launches a browser, visits your app\'s URL, then issues commands to find elements, click and type, and assert on what is visible. Network can be real or stubbed; selectors target stable data-test attributes.',
    why: 'It is the highest-confidence test that the app actually works as assembled, catching integration and routing bugs that isolated tests miss — at the cost of speed and stability, so you keep them few and focused on critical paths.',
    code: {
      label: 'A Playwright login journey',
      lang: 'js',
      code: 'import { test, expect } from \'@playwright/test\'\n\ntest(\'user can log in and see the dashboard\', async ({ page }) => {\n  await page.goto(\'/login\')\n  await page.getByTestId(\'email\').fill(\'user@example.com\')\n  await page.getByTestId(\'password\').fill(\'secret\')\n  await page.getByRole(\'button\', { name: \'Sign in\' }).click()\n\n  await expect(page).toHaveURL(\'/dashboard\')\n  await expect(page.getByTestId(\'welcome\')).toContainText(\'Welcome\')\n})',
      explanation: [
        'page.goto loads the real running app at the route under test.',
        'getByTestId targets stable data-testid selectors that survive restyling.',
        'fill and click drive the form like a user; Playwright auto-waits for elements to be ready.',
        'toHaveURL asserts the routing actually navigated to the dashboard.',
        'The final assertion confirms post-login content rendered — the full journey end to end.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'End-to-end testing executes the fully built application in an automated real browser, scripting user-level interactions (navigation, clicks, typing) and asserting on observable UI and URL state. Cypress runs in the browser alongside the app with its own command/retry model; Playwright drives browsers out-of-process via the DevTools/automation protocols with built-in auto-waiting and parallelism across Chromium, Firefox, and WebKit. Both verify the integrated system — routing, state, real or intercepted network, and rendering — from the user\'s perspective. Because they sit at the slow, brittle top of the testing pyramid, they are reserved for a small set of high-value journeys and rely on stable selectors (data-test attributes), web-first assertions with auto-retry, network interception for determinism, and explicit waiting on conditions rather than arbitrary sleeps.',

  // 7. Internal Working
  internalWorking: [
    'The runner builds and serves your app (or you start a dev/preview server) and launches a real browser instance pointed at it — a true rendering engine, not jsdom.',
    'Commands like click/fill are translated into browser automation protocol calls (Chrome DevTools Protocol for Playwright/Cypress) that dispatch real input events to the page.',
    'Web-first assertions auto-retry: Playwright\'s expect and Cypress\'s commands poll the DOM for a timeout window until the condition is met, which absorbs Vue\'s async rendering without manual nextTick handling.',
    'Network interception (cy.intercept / page.route) lets the test stub or assert on HTTP calls so the journey is deterministic and does not depend on a live backend.',
    'The runner waits for actionability — element attached, visible, stable, enabled — before interacting, which is how auto-waiting reduces flakiness compared to fixed sleeps.',
    'Artifacts (screenshots, videos, traces) are captured on failure so you can debug a flow that broke in CI without re-running locally.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   TEST RUNNER (Cypress / Playwright)
        │ launch + control
        ▼
   ┌─────────────── REAL BROWSER ───────────────┐
   │   visits  →  /login → /dashboard            │
   │   real DOM, real routing, real rendering    │
   │      ▲ click/fill (real input events)       │
   │      │                                      │
   │   YOUR BUILT VUE APP                         │
   │      │ HTTP                                  │
   │      ▼                                       │
   │   network ── real backend OR intercepted ──►│ (stub for determinism)
   └─────────────────────────────────────────────┘
        assert on URL + visible UI (auto-retry until ready)
        select by data-test • few tests • critical journeys only`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — visit and assert visible content (Cypress)',
      lang: 'js',
      code: '// e2e/home.cy.js\ndescribe(\'Home page\', () => {\n  it(\'shows the hero headline\', () => {\n    cy.visit(\'/\')\n    cy.get(\'[data-test=hero-title]\').should(\'be.visible\')\n    cy.contains(\'Get started\').should(\'exist\')\n  })\n})',
      explanation: [
        'cy.visit loads the real app at the root route.',
        'cy.get with a data-test selector finds an element reliably across restyles.',
        'should(\'be.visible\') auto-retries until the element renders — no manual wait.',
        'This is a smoke test: the page boots and renders its key content.',
      ],
    },
    intermediate: {
      label: 'Intermediate — form submission with network stubbing',
      lang: 'js',
      code: 'import { test, expect } from \'@playwright/test\'\n\ntest(\'submitting the contact form shows success\', async ({ page }) => {\n  // stub the API so the test is deterministic\n  await page.route(\'**/api/contact\', (route) =>\n    route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) })\n  )\n\n  await page.goto(\'/contact\')\n  await page.getByTestId(\'name\').fill(\'Ada\')\n  await page.getByTestId(\'message\').fill(\'Hello\')\n  await page.getByRole(\'button\', { name: \'Send\' }).click()\n\n  await expect(page.getByTestId(\'toast\')).toContainText(\'Thanks\')\n})',
      explanation: [
        'page.route intercepts the API call so the test does not depend on a live server.',
        'route.fulfill returns a controlled response, making the outcome deterministic.',
        'The form is filled and submitted via user-level actions.',
        'The success toast assertion auto-waits until it appears after the (stubbed) request.',
        'Stubbing the boundary is what separates a stable E2E test from a flaky one tied to backend state.',
      ],
    },
    advanced: {
      label: 'Advanced — auth setup and resilient selectors',
      lang: 'js',
      code: 'import { test, expect } from \'@playwright/test\'\n\n// Reuse a logged-in state instead of logging in via UI every test\ntest.use({ storageState: \'auth.json\' })\n\ntest(\'an authed user can open settings\', async ({ page }) => {\n  await page.goto(\'/settings\')\n  // role/label selectors are resilient AND accessible\n  await page.getByRole(\'tab\', { name: \'Profile\' }).click()\n  await page.getByLabel(\'Display name\').fill(\'Ada L.\')\n  await page.getByRole(\'button\', { name: \'Save\' }).click()\n  await expect(page.getByText(\'Saved\')).toBeVisible()\n})',
      explanation: [
        'storageState restores a pre-authenticated session, so tests skip the slow login UI each time.',
        'getByRole and getByLabel select by accessibility semantics — resilient and they double as a11y checks.',
        'Reusing auth state cuts runtime and removes a common flaky step (logging in repeatedly).',
        'Web-first assertions (toBeVisible) auto-retry, handling Vue\'s async updates.',
        'This pattern keeps a journey focused on the feature, not the boilerplate around it.',
      ],
    },
    realProject: {
      label: 'Real project — the checkout revenue path',
      lang: 'js',
      code: 'import { test, expect } from \'@playwright/test\'\n\ntest(\'add to cart through to order confirmation\', async ({ page }) => {\n  await page.route(\'**/api/checkout\', (r) =>\n    r.fulfill({ status: 200, body: JSON.stringify({ orderId: \'A123\' }) })\n  )\n\n  await page.goto(\'/products\')\n  await page.getByTestId(\'product-1\').getByRole(\'button\', { name: \'Add to cart\' }).click()\n  await expect(page.getByTestId(\'cart-count\')).toHaveText(\'1\')\n\n  await page.goto(\'/checkout\')\n  await page.getByTestId(\'email\').fill(\'buyer@example.com\')\n  await page.getByRole(\'button\', { name: \'Place order\' }).click()\n\n  await expect(page.getByTestId(\'confirmation\')).toContainText(\'A123\')\n})',
      explanation: [
        'This covers the single most valuable journey: browse → add → checkout → confirmation.',
        'The checkout API is stubbed so the test is deterministic and offline.',
        'Routing across pages (/products → /checkout) is exercised end to end.',
        'Assertions check both intermediate state (cart count) and the final outcome (order id).',
        'A team keeps a handful of these critical-path tests rather than testing every screen via E2E.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is end-to-end testing and how does it differ from component testing?',
      answer: 'E2E testing drives the fully-built app in a real browser through complete user journeys, while component testing mounts a single component in a simulated DOM (jsdom). E2E is more realistic but slower and more brittle.',
      explanation: 'The key contrast is real browser + full app vs isolated component + jsdom.',
    },
    {
      level: 'beginner',
      question: 'Name two E2E tools for Vue and one advantage of each.',
      answer: 'Cypress runs in the browser with a great interactive debugging experience and time-travel. Playwright drives multiple browser engines (Chromium/Firefox/WebKit) out of process with strong auto-waiting and parallelism.',
      explanation: 'Mentioning Playwright\'s cross-browser/parallelism and Cypress\'s DX shows real familiarity.',
    },
    {
      level: 'intermediate',
      question: 'How do you make E2E tests less flaky?',
      answer: 'Use stable selectors (data-test/role/label), rely on web-first auto-retrying assertions instead of fixed sleeps, stub the network for determinism, reuse authentication state, and reset/seed data per run. Keep tests independent and few.',
      explanation: 'Flakiness control is THE E2E skill — listing concrete techniques is what interviewers want.',
    },
    {
      level: 'intermediate',
      question: 'Why select elements by data-test attributes instead of CSS classes or text?',
      answer: 'Classes change with styling and text changes with copy/i18n, breaking tests that should still pass. data-test attributes are decoupled from presentation, so they remain stable across refactors.',
      explanation: 'Shows you design for test stability rather than reaching for whatever selector is handy.',
    },
    {
      level: 'advanced',
      question: 'How do you handle the network in E2E tests, and what are the trade-offs?',
      answer: 'You can hit a real backend (most realistic, but slow and dependent on seeded state) or intercept/stub requests (deterministic and fast, but you might miss real integration issues). A common strategy is stubbing for most journeys and a few full-stack smoke tests against a real environment.',
      explanation: 'Weighing realism vs determinism, and proposing a mixed strategy, is a senior answer.',
    },
    {
      level: 'senior',
      question: 'Where does E2E fit in your overall test strategy, and how do you keep the suite valuable?',
      answer: 'E2E is the small top of the pyramid: a few high-value journeys (auth, checkout) that would lose money if broken. I keep value high by pushing logic into unit/component tests, limiting E2E count, ensuring each test is independent and deterministic (stubbed network, seeded data), running them in CI rather than on every save, and capturing traces/videos to debug failures fast.',
      explanation: 'Senior signal: treating E2E as a budgeted, ROI-driven layer, not a catch-all.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between Cypress and Playwright in architecture?',
    'How do you seed or reset test data between E2E runs?',
    'How do you test flows that depend on authentication?',
    'What is auto-waiting and why does it reduce flakiness?',
    'How do component tests in Cypress/Playwright differ from E2E?',
    'How do you run E2E reliably in CI (parallelism, retries, artifacts)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using arbitrary fixed waits (cy.wait(2000) / page.waitForTimeout) to fix timing.',
      why: 'They are slow and still flaky — too short fails, too long wastes time, and neither reflects the actual condition.',
      fix: 'Use web-first auto-retrying assertions and wait on specific conditions (element visible, request completed).',
    },
    {
      mistake: 'Selecting by CSS classes or visible text.',
      why: 'Styling and copy/i18n changes break tests even when behavior is unchanged.',
      fix: 'Add and select by data-test attributes (or accessibility roles/labels).',
    },
    {
      mistake: 'Writing too many E2E tests for things unit/component tests could cover.',
      why: 'It makes CI slow and flaky and duplicates coverage, so the team starts ignoring failures.',
      fix: 'Push logic down the pyramid; reserve E2E for a few critical journeys.',
    },
    {
      mistake: 'Tests that depend on shared mutable backend state or on each other.',
      why: 'Order-dependence and leftover data cause non-deterministic failures.',
      fix: 'Stub the network or seed/reset data per test, and keep each test fully independent.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Vue apps commonly use Cypress or Playwright for E2E; the official Vue create scaffolding offers both as options.' },
    { area: 'Nuxt', detail: 'Nuxt uses Playwright via @nuxt/test-utils to build, serve, and drive the real app for end-to-end coverage of pages and server routes.' },
    { area: 'CI/CD', detail: 'E2E suites run in CI with parallel sharding, retries on known-flaky specs, and screenshot/video/trace artifacts uploaded for debugging failures.' },
    { area: 'SSR', detail: 'E2E is the practical way to verify SSR/hydration in a real browser — that server HTML appears fast and becomes interactive without mismatches.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Highest confidence per test: one passing journey verifies the whole integrated stack.',
      'Auto-waiting (vs sleeps) keeps each step as fast as the app actually is.',
    ],
    bad: [
      'Each test launches a real browser and the full app, so suites are slow — minutes, not milliseconds.',
      'They are the most flake-prone layer; instability erodes trust and wastes CI time.',
    ],
    optimizations: [
      'Keep E2E count small and focused on critical journeys.',
      'Stub the network and reuse auth state to remove slow, flaky steps.',
      'Parallelize/shard across CI machines and run against a built preview, not a dev server.',
      'Retry only known-flaky specs and capture traces so failures are debugged once, not re-run blindly.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'E2E test files often contain credentials or tokens for test accounts that can leak if committed or logged.',
      'Running E2E against production with real accounts can mutate or expose live data.',
    ],
    bestPractices: [
      'Keep test credentials in CI secrets/env vars, never hard-coded in committed specs.',
      'Run E2E against isolated staging/seeded environments, not production, and use dedicated throwaway test accounts.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['testing-overview', 'component-testing', 'vue-router-basics'],
    nextConcepts: ['ssr-hydration', 'data-fetching-patterns', 'error-handling-vue'],
    dependencyNote:
      'E2E sits at the top of the pyramid established in the testing overview and complements component testing below it. It depends on understanding routing (journeys cross routes) and pairs naturally with verifying SSR/hydration and real data-fetching/error flows in a true browser.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw the runner controlling a real browser that loads the BUILT app.',
      'Trace a journey across routes: /login → /dashboard, with click/fill on the way.',
      'Show the network line and mark it "intercept/stub for determinism".',
      'Write the stability rules: data-test selectors, auto-retry assertions, no fixed sleeps.',
      'Place this at the small TOP of the pyramid: few tests, critical journeys only.',
      'Mention CI: parallel shards, retries for flakes, screenshots/videos/traces on failure.',
    ],
    diagram: `   runner → REAL browser → BUILT app
        journey: /login → click/fill → /dashboard ✓
        network: ── stub ──► deterministic
        rules: data-test • auto-retry • no sleeps
        place: TOP of pyramid (few, critical)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'E2E testing drives the fully built Vue app in a real browser (Cypress or Playwright) through critical user journeys like login and checkout — the most realistic but slowest, most flake-prone tests. Keep them few and at the top of the pyramid. Stay stable by selecting with data-test/role attributes, using auto-retrying web-first assertions instead of fixed sleeps, stubbing the network for determinism, and reusing auth state. Run in CI with parallelism and capture traces on failure.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'End-to-end testing is the layer where I drive the fully built application in a real browser, exactly as a user would, to verify complete journeys — things like logging in, adding to cart and checking out. I use Cypress or Playwright; Playwright I like for cross-browser coverage, out-of-process control, and strong auto-waiting and parallelism, while Cypress has an excellent interactive debugging experience. Unlike component tests, which mount one component in jsdom, E2E exercises the real rendering engine, real routing, real or stubbed network, and the whole assembled app, so it catches integration bugs the lower layers structurally cannot. The trade-off is that it is the slowest and most flake-prone layer, so it belongs at the small top of the testing pyramid: I keep a handful of high-value journeys, the ones that would lose money or users if they broke, and I push everything else down into faster unit and component tests. The bulk of the skill is keeping the suite stable. I select elements by data-test attributes or accessibility roles and labels rather than CSS classes or visible text, because those change with styling and copy. I lean on web-first, auto-retrying assertions instead of arbitrary sleeps, which both removes flakiness and keeps each step as fast as the app actually is. I stub the network with route interception so journeys are deterministic and do not depend on backend state, and I reuse a saved authenticated session instead of logging in through the UI every test. I make each test independent — seeding or resetting data per run — so there is no order-dependence. In CI I run them in parallel shards against a built preview rather than a dev server, retry only known-flaky specs, and capture screenshots, video, and traces on failure so I can debug a CI-only failure without re-running it locally. That combination is what makes E2E a trusted safety net rather than a slow, ignored, red suite.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Cypress (in-browser, great DX, single-tab model historically) vs Playwright (out-of-process, multi-browser, multi-context, strong parallelism) — pick based on cross-browser needs and CI scale.',
      'Real backend (max realism, catches integration bugs) vs stubbed network (deterministic, fast) — usually stub most journeys and keep a few real full-stack smoke tests.',
      'More E2E coverage (confidence) vs suite speed/stability (developer trust) — the ROI curve flattens fast, so cap the count.',
    ],
    edgeCases: [
      'Auth flows: logging in via UI every test is slow and flaky; reuse storageState/session.',
      'Time/animation: transitions and timers can race assertions; control time or wait on end-state.',
      'Third-party iframes/widgets (payments, maps) are hard to drive; stub or test boundaries around them.',
      'SSR/hydration timing: assert on interactivity, not just presence, to catch hydration gaps.',
    ],
    runtimeBehavior: [
      'Auto-waiting polls for actionability (attached, visible, stable, enabled) before acting, absorbing Vue\'s async rendering.',
      'Web-first assertions retry within a timeout window, so a single assertion handles eventual consistency without manual waits.',
      'Network interception sits at the browser layer, so it stubs regardless of how the app fetches.',
    ],
    scalability: [
      'Shard specs across CI machines and run browsers in parallel to keep wall-clock time bounded as journeys grow.',
      'Share setup (auth, seed data) via fixtures/global setup to avoid per-test boilerplate cost.',
      'Quarantine flaky specs rather than blanket-retrying, so flakiness is fixed instead of masked.',
    ],
    productionConcerns: [
      'Flaky E2E is the fastest way to lose a team\'s trust in tests — invest in stability or the suite gets disabled.',
      'Run against isolated, seeded environments; never against production with real user data.',
      'Capture and triage traces/videos on failure so CI-only failures are debuggable.',
      'Gate E2E to pre-merge/CI rather than every local save to preserve fast inner-loop feedback.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'E2E = real browser + fully built app + real user journeys.',
    'Tools: Cypress (great DX) and Playwright (multi-browser, parallel, auto-wait).',
    'Top of the pyramid: FEW tests, critical journeys (login, checkout).',
    'Select by data-test / role / label, never CSS classes or text.',
    'Use auto-retrying web-first assertions; NO fixed sleeps.',
    'Stub the network (cy.intercept / page.route) for determinism.',
    'Reuse auth state (storageState) instead of logging in each test.',
    'Keep tests independent: seed/reset data per run.',
    'Run in CI with parallel sharding; retry only known flakes.',
    'Capture screenshots/video/traces on failure for debugging.',
    'Keep test credentials in CI secrets, run against staging not prod.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write a Cypress test that visits /about and asserts a heading with data-test="about-title" is visible.',
      hint: 'cy.visit + cy.get + should(\'be.visible\').',
      solution: {
        lang: 'js',
        code: 'describe(\'About page\', () => {\n  it(\'renders the title\', () => {\n    cy.visit(\'/about\')\n    cy.get(\'[data-test=about-title]\').should(\'be.visible\')\n  })\n})',
        explanation: [
          'cy.visit loads the real route.',
          'should(\'be.visible\') auto-retries until the heading renders.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a Playwright test that fills a search box (data-testid="q"), submits, and asserts a results list appears.',
      hint: 'getByTestId + fill + press Enter, then assert visibility.',
      solution: {
        lang: 'js',
        code: 'import { test, expect } from \'@playwright/test\'\n\ntest(\'search shows results\', async ({ page }) => {\n  await page.goto(\'/search\')\n  await page.getByTestId(\'q\').fill(\'vue\')\n  await page.getByTestId(\'q\').press(\'Enter\')\n  await expect(page.getByTestId(\'results\')).toBeVisible()\n})',
        explanation: [
          'fill and press drive the search like a user.',
          'toBeVisible auto-waits for the async results to render.',
          'data-testid selectors keep it stable across restyles.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a Playwright test that stubs GET /api/items to return two items and asserts both render.',
      hint: 'Use page.route + route.fulfill before goto.',
      solution: {
        lang: 'js',
        code: 'import { test, expect } from \'@playwright/test\'\n\ntest(\'renders items from a stubbed API\', async ({ page }) => {\n  await page.route(\'**/api/items\', (route) =>\n    route.fulfill({ status: 200, body: JSON.stringify([{ id: 1 }, { id: 2 }]) })\n  )\n  await page.goto(\'/items\')\n  await expect(page.getByTestId(\'item\')).toHaveCount(2)\n})',
        explanation: [
          'page.route intercepts the request before navigation so the response is controlled.',
          'route.fulfill returns deterministic data, removing backend dependence.',
          'toHaveCount asserts the list rendered exactly the stubbed items.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'You have a flaky 30-minute E2E suite. Outline the changes you would make and show one refactored test.',
      hint: 'Stub network, stable selectors, auth reuse, remove sleeps, cut count.',
      solution: {
        lang: 'js',
        code: 'import { test, expect } from \'@playwright/test\'\n\n// Reuse auth instead of logging in each test; stub the network; no sleeps.\ntest.use({ storageState: \'auth.json\' })\n\ntest(\'dashboard loads with stubbed data\', async ({ page }) => {\n  await page.route(\'**/api/summary\', (r) =>\n    r.fulfill({ status: 200, body: JSON.stringify({ total: 5 }) })\n  )\n  await page.goto(\'/dashboard\')\n  await expect(page.getByTestId(\'total\')).toHaveText(\'5\') // auto-retry, no wait\n})',
        explanation: [
          'Reusing storageState removes the slow, flaky repeated login.',
          'Stubbing the network makes the outcome deterministic.',
          'Auto-retrying assertions replace fixed sleeps; data-test selectors add stability.',
          'Alongside this, cut the suite to critical journeys and push other coverage down the pyramid.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'E2E is the proof your app actually works end to end, protecting the journeys the business cares about most. Knowing when to use it and how to keep it stable shows mature test judgment, which is exactly what senior interviews probe.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the definition and to name a tool. Product companies (Zoho, Flipkart, Razorpay) ask you to script a critical journey and discuss flakiness control. FAANG-level interviews probe suite ROI, network strategy, auth reuse, CI parallelism, and when E2E is the wrong choice.',
    whatInterviewersExpect:
      'They expect you to drive a real browser through a journey, select with data-test/role, use auto-retry assertions instead of sleeps, stub the network for determinism, reuse auth state, keep tests independent and few, and place E2E correctly at the top of the pyramid.',
  },
}

export default e2eTestingVue
