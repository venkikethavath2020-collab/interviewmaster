import type { ConceptLesson } from '../../../types/lesson'

const watchVsWatcheffect: ConceptLesson = {
  // 1. Concept Summary
  slug: 'watch-vs-watcheffect',
  name: 'watch vs watchEffect',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 5,

  // 2. Why Should I Care?
  whyCare: [
    'This is one of the most asked Vue 3 reactivity comparison questions — interviewers use it to check whether you understand effect timing, dependency collection, and side-effect design.',
    'Choosing the wrong one leads to bugs: missing old values, accidental over-tracking, or effects that run (or do not run) at the wrong time.',
    'It forces you to articulate four distinct axes — explicit vs automatic deps, lazy vs immediate, old value or not, source control — that recur across all of Vue reactivity.',
    'Both share onCleanup, flush, and stop semantics, so understanding the comparison cements your grasp of the whole effect system.',
    'In real apps the choice shapes data fetching, persistence, and DOM-sync code — getting it right keeps components predictable.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'watch is a guard told exactly which door to watch and what it was before; watchEffect is a helper who watches everything you touch and redoes the job.',
    story: [
      'Imagine two helpers in your house.',
      'The first, watch, you tell precisely: "watch the front door". He waits, does nothing until it changes, and when it does he tells you "it WAS closed, now it is open".',
      'The second, watchEffect, you just hand a job: "keep my desk tidy". He watches whatever you touch on the desk and re-tidies the moment anything moves — and he tidies once right away. But he never tells you how it looked before.',
      'So you pick the first when you need to know exactly what changed and what it used to be, and the second when you just want something kept in sync automatically.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Both watch and watchEffect run code when reactive data changes, but they differ in how you set them up and what they give you.',
    'watch needs you to name the source (a ref, object, or getter), is lazy (does not run until a change), and hands you the new AND old values.',
    'watchEffect needs no source — it watches whatever reactive things its function reads — runs immediately, and gives you only the current values, no old value.',
    'Rule of thumb: watch when you need the previous value or precise control; watchEffect when you want concise auto-tracking that runs right away.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'watch and watchEffect both run side effects in response to reactive changes. watch(source, cb) takes an explicit source, is lazy, and passes (new, old, onCleanup). watchEffect(fn) takes no source, runs immediately, auto-collects dependencies from what fn reads, and passes only (onCleanup).',
    how: 'watch creates a lazy effect whose getter reads the explicit source to track it, then calls your callback on change with old/new. watchEffect creates an eager effect that runs your function immediately, tracking whatever it reads and re-running on any of those changes.',
    why: 'They cover two needs: precise, change-driven reactions where you compare old vs new (watch), and concise, immediate, multi-dependency sync where you do not need the old value (watchEffect).',
    code: {
      label: 'Same goal, two tools',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watch, watchEffect } from \'vue\'\nconst userId = ref(1)\n\n// watch: explicit source, lazy, has old value\nwatch(userId, (newId, oldId) => {\n  console.log(`watch: ${oldId} -> ${newId}`)\n})\n\n// watchEffect: auto-tracks userId, runs immediately, no old value\nwatchEffect(() => {\n  console.log(`watchEffect: now ${userId.value}`)\n})\n</script>',
      explanation: [
        'watch(userId, cb) names userId explicitly and fires only on change (lazy).',
        'Its callback gets both newId and oldId for diffing.',
        'watchEffect reads userId.value, auto-tracking it; it runs immediately and on change.',
        'watchEffect has no old value — only the current state.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'watch and watchEffect are two reactive-effect APIs that differ on four axes. watch(source, callback, options) observes an explicitly specified source (ref / reactive / getter / array), is lazy by default (runs only on change unless immediate:true), and invokes the callback with (newValue, oldValue, onCleanup). watchEffect(effect, options) runs its function immediately, collects dependencies automatically by tracking every reactive read during execution (re-collected each run, so the set is dynamic), and provides only onCleanup (no old value). Both support flush (\'pre\'|\'post\'|\'sync\'), onCleanup-based teardown, and return a stop handle; both are bound to the component effect scope and auto-stop on unmount.',

  // 7. Internal Working
  internalWorking: [
    'Both wrap a ReactiveEffect; the difference begins at registration — watch is lazy (runs the source getter to collect deps and capture the old value, but defers the callback), watchEffect is eager (runs immediately).',
    'watch\'s getter reads only the explicit source, so its dependency set is determined by what the source touches; for a reactive object or deep:true it traverses nested keys.',
    'watchEffect tracks every reactive read in the function body, re-collecting on each run, so a value behind an unexecuted branch is not tracked that run.',
    'On trigger, both queue through the same scheduler with flush timing (pre/post/sync), batched and deduplicated per tick.',
    'watch invokes the callback with the freshly re-read new value and the stored old value; watchEffect simply re-runs the function (no value arguments).',
    'Both run any prior onCleanup before the next invocation and on stop, and detach from all dep Sets when the scope disposes or stop() is called.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `                 watch                     watchEffect
 source        explicit (ref/getter)       implicit (auto from reads)
 first run     lazy (immediate:true opt)    runs immediately
 args          (new, old, onCleanup)        (onCleanup) only
 deps          fixed by the source          dynamic, re-collected per run
 deep          opt-in (or reactive obj)     whatever it reads
 best for      old value / precise control  concise multi-dep sync

  watch:        change ─► cb(new, old)
  watchEffect:  run now ─► read deps ─► re-run on any change`,

  // 9. Memory Visualization
  memoryVisualization: [
    'BOTH: a ReactiveEffect object with deps array, scheduler, and cleanup slot, registered in the dep Sets of tracked keys.',
    'watch: stores the previous value to pass as oldValue; deps come from the source getter (narrow) or deep traversal (wide).',
    'watchEffect: no stored old value; deps rebuilt every run from actual reads, so the deps array can shrink/grow between runs.',
    'BOTH: bound to the current component effect scope for auto-stop; a stop handle allows early teardown to free the deps.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — the four differences side by side',
      lang: 'js',
      code: 'import { ref, watch, watchEffect } from \'vue\'\nconst a = ref(1)\nconst b = ref(2)\n\n// watch: explicit source(s), lazy, old value\nwatch([a, b], ([na, nb], [oa, ob]) => {\n  console.log(\'watch\', oa, ob, \'->\', na, nb)\n})\n\n// watchEffect: implicit deps, immediate, no old value\nwatchEffect(() => {\n  console.log(\'watchEffect\', a.value, b.value)\n})',
      explanation: [
        'watch names [a, b]; watchEffect just reads a.value/b.value.',
        'watch is lazy (fires on change); watchEffect runs once immediately.',
        'watch gives arrays of new and old values; watchEffect gives nothing but current reads.',
        'Both re-run when a or b changes.',
      ],
    },
    intermediate: {
      label: 'Intermediate — when old value forces watch',
      lang: 'js',
      code: 'import { ref, watch } from \'vue\'\nconst price = ref(100)\n\n// Need the old value to compute a delta → watch is required\nwatch(price, (next, prev) => {\n  const delta = next - prev\n  console.log(delta > 0 ? `up ${delta}` : `down ${-delta}`)\n})\n// watchEffect could not do this — it has no previous value.',
      explanation: [
        'Computing a delta needs both new and old values.',
        'watch provides prev; watchEffect cannot, so it is the wrong tool here.',
        'Whenever you must diff against the previous state, choose watch.',
        'This is a frequent interview discriminator.',
      ],
    },
    advanced: {
      label: 'Advanced — over-tracking risk pushes you to watch',
      lang: 'js',
      code: 'import { reactive, watch, watchEffect } from \'vue\'\nconst state = reactive({ a: 1, b: 2, big: { /* large */ } })\n\n// watchEffect would track EVERYTHING it reads — easy to over-track\nwatchEffect(() => { doWork(state.a) /* but also touches state.big somewhere */ })\n\n// watch with a precise getter tracks ONLY state.a — predictable\nwatch(() => state.a, (a) => doWork(a))\n\nfunction doWork(x) { return x }',
      explanation: [
        'watchEffect tracks every reactive read, so a stray read of state.big adds an unwanted dependency.',
        'A watch getter pins exactly one dependency, avoiding accidental re-runs.',
        'When precise, stable dependencies matter, watch is safer.',
        'This trade — conciseness vs control — is the heart of the comparison.',
      ],
    },
    realProject: {
      label: 'Real project — choosing per use case in a component',
      lang: 'vue',
      code: '<script setup>\nimport { ref, reactive, watch, watchEffect } from \'vue\'\nimport { useRoute } from \'vue-router\'\nconst route = useRoute()\nconst prefs = reactive({ theme: \'light\', density: \'cosy\' })\nconst post = ref(null)\n\n// watchEffect: keep prefs synced to storage immediately + on any change\nwatchEffect(() => localStorage.setItem(\'prefs\', JSON.stringify(prefs)))\n\n// watch: refetch only when the id changes; want immediate + onCleanup\nwatch(\n  () => route.params.id,\n  async (id, _old, onCleanup) => {\n    const ctrl = new AbortController(); onCleanup(() => ctrl.abort())\n    post.value = await fetch(`/api/posts/${id}`, { signal: ctrl.signal }).then(r => r.json())\n  },\n  { immediate: true },\n)\n</script>',
      explanation: [
        'Persisting prefs is a multi-property sync with no old value needed → watchEffect.',
        'Refetching on a specific param with cancellation → watch with a precise getter.',
        'watch\'s immediate:true covers the first load explicitly.',
        'Using each for its strength keeps the component clear and correct.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What are the main differences between watch and watchEffect?',
      answer: 'watch takes an explicit source, is lazy, and gives new and old values; watchEffect takes no source, runs immediately, auto-collects dependencies from what it reads, and gives no old value. Both support onCleanup, flush, and stop.',
      explanation: 'A clean four-axis answer: source, timing, old value, dependency collection.',
    },
    {
      level: 'beginner',
      question: 'Which one runs immediately on setup?',
      answer: 'watchEffect runs immediately by default. watch is lazy and only runs on change unless you pass immediate:true.',
      explanation: 'Timing is a core distinction and a quick discriminator.',
    },
    {
      level: 'intermediate',
      question: 'When must you use watch instead of watchEffect?',
      answer: 'When you need the previous value (e.g. to compute a delta or compare old vs new), when you want lazy on-change behavior, or when you need precise control of the source to avoid accidental over-tracking from automatic collection.',
      explanation: 'Old value and over-tracking are the two strongest reasons.',
    },
    {
      level: 'intermediate',
      question: 'When is watchEffect the better choice?',
      answer: 'When a side effect depends on several reactive values, you want it to run immediately, and you do not need the old value — it removes dependency boilerplate and keeps the code concise.',
      explanation: 'Conciseness and immediacy for multi-dep sync are watchEffect\'s sweet spot.',
    },
    {
      level: 'advanced',
      question: 'How does dependency collection differ between the two?',
      answer: 'watch tracks only what its explicit source reads (fixed unless deep). watchEffect tracks every reactive read in its function and re-collects on each run, so its dependency set is dynamic and can change based on conditional branches.',
      explanation: 'Fixed vs dynamic dependency sets is the deeper mechanism behind the choice.',
    },
    {
      level: 'senior',
      question: 'Do watch and watchEffect share any semantics, and what subtle traps apply to both?',
      answer: 'Both support onCleanup for cancelling stale async, the flush option (pre/post/sync) for timing, and a stop handle; both auto-stop with the component scope. Subtle traps: only synchronous reads are tracked (reads after await are not), reactive-object sources/effects can over-track, and effects created at module scope must be stopped manually to avoid leaks.',
      explanation: 'Senior signal: shared machinery plus the post-await tracking and leak pitfalls.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'Which gives you the old value? (watch)',
    'Which runs immediately? (watchEffect; watch needs immediate:true)',
    'How do dependencies get collected in each?',
    'When does automatic collection cause over-tracking?',
    'Do both support onCleanup and flush? (yes)',
    'How does each compare to computed?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Reaching for watchEffect when you need the previous value.',
      why: 'watchEffect provides no old value, so delta/diff logic is impossible.',
      fix: 'Use watch(source, (n, o) => ...).',
    },
    {
      mistake: 'Using watchEffect with broad reads and getting unexpected re-runs.',
      why: 'It tracks every reactive value read, including incidental ones.',
      fix: 'Use watch with a precise getter, or read only what you need.',
    },
    {
      mistake: 'Forgetting watch is lazy and expecting it to run on mount.',
      why: 'watch does not fire on setup by default.',
      fix: 'Pass { immediate: true } if you need an initial run.',
    },
    {
      mistake: 'Assuming reads after await are tracked in either API.',
      why: 'Dependency tracking happens only during synchronous execution.',
      fix: 'Capture reactive values into locals before the first await.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'watch for change-driven fetches and diffs (route params, ids); watchEffect for immediate multi-value sync (storage, title, URL query).' },
    { area: 'Composables', detail: 'watchEffect to apply-and-keep-in-sync an effect; watch when the composable must react to a specific input and compare old/new.' },
    { area: 'Vue Router', detail: 'watch route.params to reload on navigation (need precise source); watchEffect to reflect filters into the query.' },
    { area: 'Component library', detail: 'watch a prop with old value to migrate state on change; watchPostEffect to apply DOM measurements after updates.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'watch\'s explicit source avoids over-tracking, minimizing unnecessary re-runs.',
      'watchEffect removes init-then-watch duplication and batches re-runs per tick.',
    ],
    bad: [
      'watchEffect can over-track from broad reads, causing extra re-runs.',
      'watch with deep:true on large objects is expensive due to full traversal.',
    ],
    optimizations: [
      'Prefer narrow watch getters when dependencies must be stable and minimal.',
      'Use watchEffect for genuinely multi-dependency sync to avoid boilerplate.',
      'Use onCleanup/AbortController in both to cancel stale async work.',
      'Pick flush:\'post\' only when reading updated DOM; default otherwise.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['watch', 'watcheffect', 'computed'],
    nextConcepts: ['data-fetching-patterns', 'composables', 'reactivity-render-link', 'lifecycle-hooks-composition'],
    dependencyNote:
      'This comparison assumes you know watch and watchEffect individually and how computed differs (derived value vs side effect). It directly informs data-fetching-patterns and composable design, and relates to the reactivity-render-link and lifecycle timing for flush options.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw two columns: watch and watchEffect.',
      'Row 1 Source: explicit (ref/getter/array) vs implicit (auto from reads).',
      'Row 2 Timing: lazy (immediate:true opt) vs runs immediately.',
      'Row 3 Args: (new, old, onCleanup) vs (onCleanup) only.',
      'Row 4 Deps: fixed by source vs dynamic per-run; conclude with "watch for old value/precision, watchEffect for concise immediate multi-dep sync; both share onCleanup/flush/stop".',
    ],
    diagram: `            watch                 watchEffect
 source     explicit              implicit (auto)
 timing     lazy (opt immediate)  immediate
 args       (new, old, clean)     (clean) only
 deps       fixed by source       dynamic per run
 deep       opt-in                whatever read
 shared     onCleanup • flush • stop • auto-stop on unmount`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'watch takes an explicit source, is lazy, and gives you new and old values; watchEffect takes no source, runs immediately, auto-collects dependencies from what it reads, and gives no old value. Use watch when you need the previous value, lazy on-change behavior, or precise control to avoid over-tracking; use watchEffect for concise, immediate, multi-dependency sync. Both share onCleanup for async cancellation, the flush option for timing, a stop handle, and auto-stop on unmount. Only synchronous reads are tracked in either.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'watch and watchEffect both run side effects in response to reactive changes, and I think about the choice along four axes. First, the source: watch takes an explicit source — a ref, a reactive object, a getter, or an array of those — while watchEffect has no source and instead automatically tracks every reactive value its function reads. Second, timing: watchEffect runs immediately on setup, whereas watch is lazy and only fires when the source changes, unless you pass immediate:true. Third, arguments: watch\'s callback receives the new value, the old value, and onCleanup, while watchEffect only gets onCleanup — it has no old value. Fourth, dependency collection: watch\'s dependencies are fixed by what the source reads, while watchEffect re-collects dependencies on every run, so its tracked set is dynamic and can change with conditional branches. Those differences drive the choice. I reach for watch when I need the previous value — say to compute a delta — when I want lazy on-change behavior, or when I need precise control to avoid the over-tracking that automatic collection can cause if the function reads broadly. I reach for watchEffect when a side effect depends on several reactive values, I want it to run immediately, and I do not need the old value, because it removes dependency boilerplate and reads cleanly. Importantly they share a lot of machinery: both support onCleanup for cancelling stale async work like aborting a fetch, both support the flush option — pre by default, post for reading updated DOM, sync for synchronous timing — both return a stop handle, and both auto-stop with the component scope. And both have the same subtle trap: only synchronous reads are tracked, so a reactive value read after an await is not a dependency. In practice I mix them: watchEffect for immediate multi-value syncs like persisting preferences, and watch with a precise getter for change-driven fetches where I want the old value or cancellation.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Control vs conciseness: watch gives explicit, stable dependencies and the old value; watchEffect is terser but can over-track and lacks the previous value.',
      'Lazy vs immediate: watch separates setup from reaction; watchEffect couples them, which is convenient but blurs initialization with ongoing sync.',
    ],
    edgeCases: [
      'Both: reads after await are not tracked — capture deps synchronously.',
      'watch on a reactive object yields the same mutated reference as new and old, defeating comparison; use getters for diffable values.',
      'watchEffect dependency set changes with branches, so a value may stop being tracked between runs.',
      'Module-scope usage of either leaks unless stopped or wrapped in effectScope.',
    ],
    runtimeBehavior: [
      'Both batch and dedupe through the scheduler per tick with flush:\'pre\'.',
      'onCleanup runs before each subsequent run and on stop, in registration order.',
      'watch re-evaluates the source to produce the fresh new value at callback time; watchEffect simply re-executes.',
    ],
    scalability: [
      'For many reactive sources, watchEffect reduces boilerplate but watch with targeted getters scales better when re-run frequency matters.',
      'Group related effects in an effectScope for bulk teardown in long-lived contexts.',
    ],
    productionConcerns: [
      'Stale-response races affect both — wire onCleanup/AbortController regardless of which you pick.',
      'Over-tracking in watchEffect causes wasted re-renders; profile with onTrack/onTrigger.',
      'Choosing watchEffect where an old value is later needed forces a risky refactor — anticipate diffing needs.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'watch: explicit source, lazy, (new, old, onCleanup).',
    'watchEffect: no source, immediate, auto deps, (onCleanup) only.',
    'Need old value → watch. Need immediate multi-dep sync → watchEffect.',
    'watch deps fixed by source; watchEffect deps dynamic per run.',
    'watch deep is opt-in; watchEffect tracks whatever it reads.',
    'Both: onCleanup, flush (pre/post/sync), stop handle, auto-stop on unmount.',
    'Both: only SYNC reads tracked (post-await reads are not).',
    'watch lazy → use immediate:true for an initial run.',
    'watchEffect can over-track from broad reads → prefer watch getter for precision.',
    'computed = derived VALUE; these two = side EFFECTS.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'State which API to use to log the previous and current value of a ref, and write it.',
      hint: 'Old value → watch.',
      solution: {
        lang: 'js',
        code: 'import { ref, watch } from \'vue\'\nconst n = ref(0)\nwatch(n, (next, prev) => console.log(prev, \'->\', next))\n// watchEffect cannot do this (no old value).',
        explanation: [
          'Needing the previous value mandates watch.',
          'The callback receives both next and prev.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Convert this init-then-watch pair into a single watchEffect: applyTheme(theme.value); watch(theme, applyTheme).',
      hint: 'watchEffect runs immediately AND on change.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst theme = ref(\'light\')\nfunction applyTheme(t) { document.documentElement.dataset.theme = t }\nwatchEffect(() => applyTheme(theme.value))\n// immediate run replaces the manual init; re-runs on change.',
        explanation: [
          'watchEffect runs once immediately, replacing the manual initial call.',
          'It re-runs whenever theme changes, replacing the explicit watch.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Explain why this watchEffect over-tracks and rewrite with watch to track only state.id.',
      hint: 'Every reactive read becomes a dependency.',
      solution: {
        lang: 'js',
        code: 'import { reactive, watch } from \'vue\'\nconst state = reactive({ id: 1, meta: { huge: true } })\n\n// over-tracks: reads state.id AND incidentally state.meta\n// watchEffect(() => { load(state.id); log(state.meta) })\n\n// precise: only state.id triggers the effect\nwatch(() => state.id, (id) => load(id))\nfunction load(id) { return id }',
        explanation: [
          'watchEffect tracks every reactive read, so reading state.meta makes it a dependency.',
          'A watch getter () => state.id pins exactly one dependency.',
          'This avoids re-running the loader when unrelated meta changes.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Give a decision rule and apply it: you must persist three settings immediately and on change, AND separately refetch when only the userId changes with cancellation. Which API for each?',
      hint: 'Match needs to axes.',
      solution: {
        lang: 'js',
        code: 'import { reactive, ref, watch, watchEffect } from \'vue\'\nconst settings = reactive({ a: 1, b: 2, c: 3 })\nconst userId = ref(1)\nconst data = ref(null)\n\n// 3 settings, immediate + on change, no old value → watchEffect\nwatchEffect(() => localStorage.setItem(\'settings\', JSON.stringify(settings)))\n\n// specific source, cancellation → watch with getter + onCleanup\nwatch(userId, async (id, _old, onCleanup) => {\n  const ctrl = new AbortController(); onCleanup(() => ctrl.abort())\n  data.value = await fetch(`/api/${id}`, { signal: ctrl.signal }).then(r => r.json())\n}, { immediate: true })',
        explanation: [
          'Persisting several values immediately with no old value fits watchEffect.',
          'Refetching on one precise source with cancellation fits watch + onCleanup.',
          'Matching the use case to the four axes yields the right tool each time.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'This is a top Vue 3 reactivity interview question. A crisp four-axis comparison plus the shared semantics (onCleanup/flush/stop) and the post-await tracking trap shows you truly understand the effect system, not just the API names.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "difference between watch and watchEffect". Product companies (Zoho, Flipkart, Razorpay) ask when to use each and to refactor between them. FAANG-level interviews probe dependency-collection mechanics, over-tracking, and shared scheduler/cleanup semantics.',
    whatInterviewersExpect:
      'The four-axis distinction (source, timing, old value, dependency collection), strong reasons for choosing each, awareness of shared onCleanup/flush/stop and the sync-only tracking rule, and a decision rule applied to a concrete scenario.',
  },
}

export default watchVsWatcheffect
