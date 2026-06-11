import type { ConceptLesson } from '../../../types/lesson'

const vIfVShow: ConceptLesson = {
  // 1. Concept Summary
  slug: 'v-if-v-show',
  name: 'v-if vs v-show',
  category: 'templates',
  difficulty: 'beginner',
  importance: 5,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'Conditionally showing and hiding UI is one of the most common things you do in any app — modals, tabs, loading states, permission-gated content.',
    'v-if and v-show look interchangeable but behave very differently under the hood; picking the wrong one causes performance problems or surprising state loss.',
    'This is one of the highest-frequency Vue interview questions — "what is the difference between v-if and v-show" is almost guaranteed.',
    'Understanding the difference forces you to understand mounting, the virtual DOM, and CSS display — core rendering concepts.',
    'Getting it right matters in production: v-if for rarely-shown or expensive content, v-show for frequently-toggled content, with real cost differences at scale.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'v-if is taking a toy out of the room entirely; v-show is leaving it in the room but throwing a blanket over it.',
    story: [
      'Imagine you have a toy you sometimes want to hide. You have two ways to do it.',
      'The first way (v-if): you carry the toy out of the room completely. It is gone — it takes up no space. But every time you want it back, you have to walk to the cupboard and carry it in again, which takes effort.',
      'The second way (v-show): you leave the toy right where it is and just drape a blanket over it. It is still there taking up its spot, you just cannot see it. Uncovering it is instant — you only lift the blanket.',
      'So if you almost never use the toy, carrying it out (v-if) keeps the room tidy. But if you keep covering and uncovering it all day, the blanket (v-show) is much faster.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Both v-if and v-show decide whether something appears on the page, based on a true/false value.',
    'v-if actually adds or removes the element from the page. When false, the element does not exist at all in the HTML.',
    'v-show always keeps the element in the page, but hides it with CSS (display: none) when false. It is there, just invisible.',
    'So v-if is "create/destroy" and v-show is "show/hide". Creating and destroying costs more work; showing and hiding is cheap but the element always lives in the page.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'v-if conditionally renders an element/component by adding or removing it (and its children/listeners) from the DOM and vnode tree. v-show always renders it but toggles its CSS display property. Both take a boolean expression.',
    how: 'v-if creates or destroys the element on each truthiness change, running mount/unmount lifecycle and resetting state. v-show mounts once and only flips el.style.display between its value and "none", so toggling is just a style change.',
    why: 'Use v-if when the condition rarely changes or the block is expensive (so you avoid paying for hidden content). Use v-show when you toggle often (so you avoid repeated mount/unmount cost). v-if also supports v-else/v-else-if chains.',
    code: {
      label: 'v-if vs v-show side by side',
      lang: 'vue',
      code: '<template>\n  <!-- v-if: removed from DOM entirely when false -->\n  <p v-if="loggedIn">Welcome back!</p>\n  <p v-else>Please log in</p>\n\n  <!-- v-show: stays in DOM, toggled via display:none -->\n  <div v-show="panelOpen" class="panel">Panel content</div>\n\n  <button @click="loggedIn = !loggedIn">toggle auth</button>\n  <button @click="panelOpen = !panelOpen">toggle panel</button>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst loggedIn = ref(false)\nconst panelOpen = ref(true)\n</script>',
      explanation: [
        'When loggedIn is false, the first <p> is not in the DOM at all; the v-else <p> is.',
        'The v-show div is ALWAYS in the DOM; only its display style changes.',
        'v-if supports v-else / v-else-if; v-show does not.',
        'Inspect the DOM: v-if elements appear/disappear, v-show elements just gain/lose display:none.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'v-if is a structural directive that conditionally includes or excludes an element/component from the render output. When the condition becomes falsy, the block is unmounted (its component instance destroyed, listeners removed, DOM detached); when truthy, it is freshly mounted. It supports v-else and v-else-if, and Vue compiles a contiguous if/else chain into a single conditional in the render function, using block tree fragments. v-show, by contrast, always mounts the element and reactively sets its CSS display property (toggling between the original value and none); it does not support v-else and cannot be used on <template>. v-if has higher toggle cost but zero cost when hidden; v-show has higher initial/always cost but near-zero toggle cost.',

  // 7. Internal Working
  internalWorking: [
    'The compiler turns a v-if/v-else-if/v-else chain into a single ternary/conditional expression in the render function that returns either the element\'s vnode or a comment placeholder vnode (or the else branch).',
    'On each render, if the condition is truthy Vue mounts the branch (creating the component instance and DOM, running beforeMount/mounted); if falsy it unmounts the previous branch (running beforeUnmount/unmounted) and leaves a comment node as an anchor.',
    'Because mounting resets everything, a v-if block re-created later starts with fresh state — local refs, scroll position, and component data are not preserved.',
    'v-show compiles to a built-in directive (vShow) attached to a single element that is always present in the vnode tree.',
    'The vShow directive\'s mounted/updated hooks set el.style.display: when the value is truthy it restores the element\'s original display, when falsy it sets display:none — no mount/unmount, no lifecycle re-run.',
    'Because v-show keeps the instance alive, component state, DOM measurements, and event listeners persist across toggles.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   condition = false        v-if                    v-show
                       ┌──────────────┐         ┌──────────────────┐
   DOM:                │  <!-- v-if -->│         │ <div style=       │
                       │  (comment     │         │   "display:none"> │
                       │   placeholder)│         │ ...still here...  │
                       └──────────────┘         └──────────────────┘
   condition = true ►  MOUNT (create instance,    flip display back
                       run mounted, fresh state)   (instant, state kept)

   cost:   v-if  → cheap when hidden, expensive to toggle (mount/unmount)
           v-show→ always rendered, cheap to toggle (CSS only)
   rule:   rarely toggled / expensive ► v-if   |   toggled a lot ► v-show`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — if / else-if / else chain',
      lang: 'vue',
      code: '<template>\n  <p v-if="status === \'loading\'">Loading…</p>\n  <p v-else-if="status === \'error\'">Something went wrong</p>\n  <p v-else>Ready</p>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst status = ref<\'loading\' | \'error\' | \'ready\'>(\'loading\')\n</script>',
      explanation: [
        'v-if / v-else-if / v-else form one mutually-exclusive chain.',
        'Only one branch is ever in the DOM at a time; the others do not exist.',
        'The chain must be on adjacent sibling elements with no other elements between them.',
        'v-show cannot do else chains — this is a v-if-only feature.',
      ],
    },
    intermediate: {
      label: 'Intermediate — toggling cost and state loss',
      lang: 'vue',
      code: '<template>\n  <button @click="open = !open">Toggle</button>\n\n  <!-- v-if: child remounts each time → its internal state resets -->\n  <ExpensiveChart v-if="open" />\n\n  <!-- v-show: child stays mounted → state preserved across toggles -->\n  <FilterPanel v-show="open" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nimport ExpensiveChart from \'./ExpensiveChart.vue\'\nimport FilterPanel from \'./FilterPanel.vue\'\nconst open = ref(true)\n</script>',
      explanation: [
        'With v-if, ExpensiveChart is destroyed and re-created on every toggle, re-running setup and losing local state.',
        'With v-show, FilterPanel mounts once; toggling only flips display, preserving form inputs and scroll.',
        'If a panel is opened/closed frequently, v-show avoids the repeated mount cost.',
        'If it is rarely shown and expensive, v-if avoids paying for it while hidden.',
      ],
    },
    advanced: {
      label: 'Advanced — v-if on <template> groups, and the v-if + v-for trap',
      lang: 'vue',
      code: '<template>\n  <!-- group multiple elements under one condition with <template> (v-if only) -->\n  <template v-if="isAdmin">\n    <h2>Admin tools</h2>\n    <button>Delete</button>\n  </template>\n\n  <!-- AVOID v-if and v-for on the same element -->\n  <!-- <li v-for="u in users" v-if="u.active"> ... (v-if has higher precedence in Vue 3) -->\n\n  <!-- PREFER: filter first, then loop -->\n  <li v-for="u in activeUsers" :key="u.id">{{ u.name }}</li>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst isAdmin = ref(true)\ninterface U { id: number; name: string; active: boolean }\nconst users = ref<U[]>([])\nconst activeUsers = computed(() => users.value.filter(u => u.active))\n</script>',
      explanation: [
        'v-if on a <template> conditionally renders a group of elements without an extra wrapper DOM node (v-show cannot target <template>).',
        'In Vue 3, v-if has HIGHER precedence than v-for on the same element, so u is not yet defined — a common bug.',
        'The fix is to filter into a computed and loop over that, keeping concerns separate.',
        'This precedence detail is a frequent senior-level gotcha.',
      ],
    },
    realProject: {
      label: 'Real project — a tabbed dashboard',
      lang: 'vue',
      code: '<template>\n  <nav>\n    <button v-for="t in tabs" :key="t" @click="active = t">{{ t }}</button>\n  </nav>\n\n  <!-- Heavy, rarely-all-visited reports: mount only the active one -->\n  <ReportView v-if="active === \'reports\'" />\n\n  <!-- Frequently toggled filters: keep mounted to preserve state -->\n  <div v-show="active === \'filters\'">\n    <FilterForm />\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nimport ReportView from \'./ReportView.vue\'\nimport FilterForm from \'./FilterForm.vue\'\nconst tabs = [\'reports\', \'filters\']\nconst active = ref(\'reports\')\n</script>',
      explanation: [
        'The heavy ReportView uses v-if so it is only created when its tab is active, saving memory/CPU.',
        'The frequently re-opened filters use v-show so the user\'s in-progress input survives switching tabs.',
        'Choosing per-block based on cost and toggle frequency is exactly the production decision.',
        'For caching multiple heavy tabs, <KeepAlive> is the next step beyond v-if/v-show.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is the difference between v-if and v-show?',
      answer: 'v-if conditionally adds or removes the element from the DOM (real create/destroy), while v-show always keeps it in the DOM and toggles its CSS display property. v-if has higher toggle cost but no cost when hidden; v-show toggles cheaply but always renders.',
      explanation: 'The canonical answer; bonus points for mentioning lifecycle and state implications.',
    },
    {
      level: 'beginner',
      question: 'Which should you use for content that toggles very frequently?',
      answer: 'v-show, because it only flips a CSS display property and avoids repeatedly mounting and unmounting the element and its component instance.',
      explanation: 'The frequency heuristic is exactly what interviewers want you to articulate.',
    },
    {
      level: 'intermediate',
      question: 'Does v-show support v-else, and can it be used on a <template>?',
      answer: 'No to both. v-show works only on a single real element, has no v-else, and cannot be applied to <template>. v-if supports v-else/v-else-if and can wrap a <template> group.',
      explanation: 'Knowing these structural limits shows you have used both in practice.',
    },
    {
      level: 'intermediate',
      question: 'What happens to a component\'s state when toggled with v-if vs v-show?',
      answer: 'With v-if, toggling off unmounts the component (state, refs, scroll, timers are destroyed) and toggling on re-mounts a fresh instance. With v-show, the component stays mounted, so its state and DOM are preserved across toggles.',
      explanation: 'State preservation is a major practical difference and a frequent source of bugs.',
    },
    {
      level: 'advanced',
      question: 'Why should you not put v-if and v-for on the same element in Vue 3?',
      answer: 'In Vue 3, v-if has higher precedence than v-for, so the v-if condition is evaluated before the loop variable exists, which breaks per-item conditions and is inefficient. Filter the list in a computed property and loop over that instead.',
      explanation: 'This precedence rule (reversed from Vue 2) is a classic gotcha and an explicit ESLint rule.',
    },
    {
      level: 'senior',
      question: 'How do v-if and v-show interact with performance and what about <KeepAlive>?',
      answer: 'v-if defers cost of hidden content (good for rarely-shown/expensive blocks) but pays mount/unmount on each toggle; v-show pays full render up front but toggles in O(1) CSS. For heavy components you toggle repeatedly but want cheap show/hide AND fresh-mount semantics, <KeepAlive> caches an inactive component instance so v-if-style switching preserves state without re-running setup each time.',
      explanation: 'Connecting the two to KeepAlive and explicit cost models is a strong senior signal.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What does the DOM look like for v-if false vs v-show false? (comment placeholder vs display:none)',
    'Can you use v-show on a component? (yes, but it toggles display on the root element)',
    'Why does v-if reset child component state but v-show does not?',
    'How do you group several elements under one v-if without an extra wrapper? (<template v-if>)',
    'What is the precedence of v-if vs v-for in Vue 3?',
    'When would you reach for <KeepAlive> instead of v-if/v-show?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Using v-if for content that toggles constantly (e.g. a frequently opened dropdown).',
      why: 'Each toggle mounts/unmounts the subtree, which is wasteful and loses state.',
      fix: 'Use v-show so toggling is a cheap CSS change and state is preserved.',
    },
    {
      mistake: 'Using v-show for very heavy content that is rarely displayed.',
      why: 'v-show always renders it, so you pay the full mount cost even when it is hidden.',
      fix: 'Use v-if so the expensive block is created only when actually needed.',
    },
    {
      mistake: 'Putting v-if and v-for on the same element.',
      why: 'In Vue 3, v-if runs before v-for, so the loop variable is not available and the intent breaks.',
      fix: 'Filter the array in a computed property and v-for over the filtered result, or wrap with <template>.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Loading/empty/error states use v-if chains; frequently toggled UI (dropdowns, accordions) uses v-show to keep interactions snappy and preserve input.' },
    { area: 'Component library', detail: 'Modal/tooltip components often combine v-if (to avoid rendering when closed) with <Transition>; menus may use v-show to keep measured positions and focus state.' },
    { area: 'Nuxt', detail: 'Permission-gated and route-conditional sections use v-if so server-rendered HTML excludes unauthorized content entirely rather than just hiding it with CSS.' },
    { area: 'SSR', detail: 'v-if-false content is absent from the server HTML (smaller payload, not just hidden), which matters for both performance and not leaking hidden markup to the client.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'v-if avoids rendering and lifecycle cost entirely while the condition is false.',
      'v-show toggles in O(1) via a single style change, ideal for frequent toggling.',
    ],
    bad: [
      'v-if on frequently-toggled content causes repeated mount/unmount churn and state loss.',
      'v-show on many heavy elements renders them all even when hidden, inflating initial cost and DOM size.',
    ],
    optimizations: [
      'Choose by frequency: rare/expensive → v-if; frequent → v-show.',
      'Use <KeepAlive> to cache toggled-away components and skip re-mounting cost while keeping fresh-switch semantics.',
      'Pair v-if with lazy-loaded components so the code isn\'t even downloaded until needed.',
      'Avoid v-show on large hidden subtrees; prefer v-if to keep the DOM small.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['template-syntax', 'declarative-rendering'],
    nextConcepts: ['v-for', 'keepalive', 'transition', 'lazy-loading-components'],
    dependencyNote:
      'v-if/v-show build on template-syntax and declarative-rendering. They pair with v-for (mind the precedence), lead to keepalive (caching toggled components) and transition (animating appearance), and connect to lazy-loading-components for deferring heavy v-if blocks.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a box labeled element. For v-if false, replace it with a small comment marker (removed from DOM).',
      'For v-show false, keep the box but write display:none on it (still in DOM).',
      'Note the cost: v-if pays mount/unmount on toggle; v-show pays one CSS change.',
      'Add the state note: v-if re-mount = fresh state; v-show = state preserved.',
      'Conclude with the rule: rare/expensive → v-if, frequent → v-show; and mention KeepAlive for cached toggling.',
    ],
    diagram: `  v-if=false ► <!-- comment -->     (gone, no instance)
  v-show=false ► <div style=display:none>  (present, hidden)

  toggle cost:  v-if = mount/unmount (state lost)
                v-show = CSS flip      (state kept)
  rule: rare/expensive → v-if   |   frequent → v-show`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'v-if conditionally adds/removes an element from the DOM (real mount/unmount, fresh state, supports v-else and <template>), while v-show always renders it and just toggles CSS display. v-if is cheap when hidden but expensive to toggle and loses state on re-mount; v-show is cheap to toggle and preserves state but always renders. Use v-if for rarely-shown or expensive content, v-show for frequently-toggled content. Don\'t put v-if and v-for on the same element (v-if wins precedence in Vue 3). For cached toggling, use <KeepAlive>.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'v-if and v-show both control whether something is visible based on a boolean, but they work completely differently. v-if is structural: when the condition is false, the element and any component inside it are removed from the DOM entirely — the component instance is destroyed, listeners are cleaned up, and only a comment placeholder remains. When it becomes true again, Vue mounts a brand-new instance, so any internal state, scroll position, or in-progress form input is reset. v-if also supports v-else and v-else-if chains and can wrap a group of elements with a <template>. v-show is different: the element is always mounted and present in the DOM, and Vue simply toggles its CSS display property between its normal value and none. So toggling is just a style change — there is no mount or unmount, and the component\'s state is preserved across toggles. The performance implication follows directly: v-if costs nothing while hidden, but you pay a mount/unmount on every toggle; v-show always pays the full render cost up front, but toggling is essentially free. The rule of thumb is: use v-if for content that is rarely shown or expensive to render, so you don\'t pay for it while it\'s hidden, and use v-show for content you toggle frequently, like a dropdown or an accordion, so toggling stays fast and the user\'s state survives. Two practical notes: don\'t put v-if and v-for on the same element, because in Vue 3 v-if has higher precedence and runs before the loop variable exists — filter in a computed instead. And when you have heavy components you switch between but want to keep alive and snappy, wrap them in <KeepAlive>, which caches the inactive instance so you get fresh-switch semantics without re-running setup every time.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'v-if optimizes for hidden-cost (great for expensive/rare blocks) at the price of toggle cost and state loss.',
      'v-show optimizes for toggle-cost (great for frequent toggles) at the price of always rendering and a larger DOM.',
      'KeepAlive bridges them: v-if-style switching with cached state, trading memory for skipped re-mounts.',
    ],
    edgeCases: [
      'v-show on a component toggles display on its root element only; multi-root components and Teleport content can behave unexpectedly.',
      'In Vue 3 v-if has higher precedence than v-for on the same element (reversed from Vue 2) — a subtle migration bug.',
      'v-if branches that mount on data arrival can cause layout shift; reserve space or use skeletons.',
      'Transitions need care: v-show + <Transition> animates display-toggling, while v-if + <Transition> animates mount/unmount, with different timing.',
    ],
    runtimeBehavior: [
      'v-if compiles to a conditional returning either the branch vnode or a comment vnode anchor.',
      'v-show is a runtime directive whose hooks set el.style.display; it never affects the vnode tree shape.',
      'Re-mounting via v-if re-runs setup and all child lifecycle, re-establishing watchers and effects from scratch.',
    ],
    scalability: [
      'Many v-show elements bloat the DOM and initial render; prefer v-if (plus lazy components) for large conditional regions.',
      'For tab-like UIs with several heavy panels, KeepAlive with include/max bounds memory while preserving responsiveness.',
    ],
    productionConcerns: [
      'Security/SSR: v-if-false content is absent from server HTML, so use v-if (not v-show) to avoid shipping hidden sensitive markup to the client.',
      'State-loss bugs from accidental v-if on frequently toggled inputs are common — review toggle frequency vs directive choice.',
      'Timers/listeners in a v-if block must be cleaned up in unmount hooks to avoid leaks on repeated toggling.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-if = add/remove element from DOM (real mount/unmount).',
    'v-show = always rendered, toggles CSS display.',
    'v-if hidden = comment placeholder; v-show hidden = display:none.',
    'v-if re-mount → fresh state; v-show → state preserved.',
    'v-if supports v-else / v-else-if; v-show does not.',
    'v-if can wrap <template>; v-show cannot.',
    'Rare/expensive → v-if; frequent toggling → v-show.',
    'Vue 3: v-if has HIGHER precedence than v-for (don\'t combine).',
    'Filter list in computed instead of v-for + v-if.',
    'Heavy toggled components → <KeepAlive> for cached switching.',
    'SSR: v-if-false content is absent from server HTML.',
    'v-show on a component toggles its ROOT element\'s display.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Show a "Loading…" message while loading is true and the content otherwise, using a v-if/v-else.',
      hint: 'Use v-if with a v-else sibling.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <p v-if="loading">Loading…</p>\n  <div v-else>{{ content }}</div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst loading = ref(true)\nconst content = ref(\'Done\')\n</script>',
        explanation: [
          'v-if renders the loading message only while loading is true.',
          'v-else renders the content branch when loading is false; only one exists at a time.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'A dropdown menu is opened and closed many times per session and must keep its scroll position. Choose and implement the right directive.',
      hint: 'Frequent toggling + preserve state → which one?',
      solution: {
        lang: 'vue',
        code: '<template>\n  <button @click="open = !open">Menu</button>\n  <ul v-show="open" class="menu">\n    <li v-for="i in items" :key="i">{{ i }}</li>\n  </ul>\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nconst open = ref(false)\nconst items = [\'A\', \'B\', \'C\']\n</script>',
        explanation: [
          'v-show keeps the menu mounted, so its scroll position and any internal state survive toggles.',
          'Toggling is just a display change, which is fast for frequent open/close.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Fix this buggy list that tries to render only active users: <li v-for="u in users" v-if="u.active" :key="u.id">.',
      hint: 'v-if and v-for should not share an element in Vue 3.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <li v-for="u in activeUsers" :key="u.id">{{ u.name }}</li>\n</template>\n\n<script setup lang="ts">\nimport { ref, computed } from \'vue\'\ninterface U { id: number; name: string; active: boolean }\nconst users = ref<U[]>([])\nconst activeUsers = computed(() => users.value.filter(u => u.active))\n</script>',
        explanation: [
          'In Vue 3, v-if evaluates before v-for, so u is undefined when v-if runs — the original is broken.',
          'Filtering into a computed and looping over it is correct and more efficient (the filter is cached).',
          'It also reads more clearly: derive the list, then render it.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Build a tab switcher where one tab holds an expensive chart (mount only when active) and another holds a form whose input must persist when switching away and back. Justify each directive.',
      hint: 'Mix v-if and v-show by cost/frequency, or use KeepAlive.',
      solution: {
        lang: 'vue',
        code: '<template>\n  <button @click="tab = \'chart\'">Chart</button>\n  <button @click="tab = \'form\'">Form</button>\n\n  <!-- expensive + not always visited: create only when active -->\n  <ExpensiveChart v-if="tab === \'chart\'" />\n\n  <!-- must keep input across switches: stay mounted -->\n  <FormPanel v-show="tab === \'form\'" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from \'vue\'\nimport ExpensiveChart from \'./ExpensiveChart.vue\'\nimport FormPanel from \'./FormPanel.vue\'\nconst tab = ref<\'chart\' | \'form\'>(\'chart\')\n</script>',
        explanation: [
          'v-if on the chart avoids building it unless the chart tab is active, saving CPU/memory.',
          'v-show on the form keeps it mounted so its in-progress input persists when the user switches tabs and returns.',
          'If BOTH panels were expensive and needed preserved state, <KeepAlive> around a <component :is> would be the better tool.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is one of the most-asked Vue questions and a daily decision in real apps. A crisp answer covering DOM behavior, lifecycle/state, cost model, and the v-if+v-for precedence gotcha instantly signals competence.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask the bare "difference between v-if and v-show". Product companies (Zoho, Flipkart, Razorpay) ask which to use for a given scenario and about state loss. FAANG-level interviews push into the cost model, precedence rules, SSR implications, and when to reach for KeepAlive.',
    whatInterviewersExpect:
      'They expect the DOM-removal-vs-CSS-toggle distinction, the frequency-based rule, awareness that v-if resets state while v-show preserves it, the v-if/v-for precedence rule, and ideally a mention of KeepAlive.',
  },
}

export default vIfVShow
