import type { ConceptLesson } from '../../../types/lesson'

const watcheffect: ConceptLesson = {
  // 1. Concept Summary
  slug: 'watcheffect',
  name: 'watchEffect',
  category: 'reactivity',
  difficulty: 'intermediate',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'watchEffect is the concise way to run a side effect that automatically re-runs whenever any reactive value it uses changes — no explicit dependency list.',
    'It runs immediately on setup, making it ideal for "do this now and keep it in sync" logic like syncing to localStorage or applying a DOM attribute.',
    'Understanding it (and how it differs from watch) is a common Vue 3 reactivity interview question.',
    'Its automatic dependency collection is powerful but a footgun: conditional reads can add/drop dependencies between runs, causing subtle behavior.',
    'It shares the onCleanup, flush, and stop semantics with watch, so mastering it deepens your grasp of the whole effect system.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'watchEffect is a helper who watches everything you touch and redoes the job whenever any of those things change.',
    story: [
      'Imagine a helper who watches you make a sandwich. He notices you used bread, cheese, and ham.',
      'You did not have to tell him "watch the bread, watch the cheese". He just paid attention to whatever you actually reached for.',
      'Now whenever the bread, cheese, OR ham changes, he automatically remakes the sandwich for you — instantly.',
      'watchEffect is that helper. You write a function; it watches whatever reactive things your function reads, and re-runs it whenever any of them change. And it runs once right away to make the first sandwich.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Sometimes you want some code to run now AND every time the data it uses changes, without listing each piece of data.',
    'watchEffect takes a function and runs it immediately. While running, it notices every reactive value the function reads.',
    'It then re-runs the function whenever any of those values change. You never write a dependency list — it figures it out.',
    'This is great for side effects that simply depend on "whatever I read", but it does not give you the old value, and the watched set can change between runs depending on which branches you take.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'watchEffect(fn) immediately runs fn, tracking every reactive dependency it reads, and re-runs fn whenever any of those dependencies change. There is no explicit source and no old value.',
    how: 'It wraps fn in an eager reactive effect. On each run it re-collects dependencies (so the tracked set reflects exactly what was read this time) and registers the effect in those deps. An onCleanup callback can dispose previous work before the next run.',
    why: 'It is the most concise tool when a side effect depends on multiple reactive values and you do not need the previous value or precise source control — e.g. keeping something in sync with current state.',
    code: {
      label: 'Auto-sync to localStorage',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst theme = ref(\'light\')\nconst fontSize = ref(16)\n\nwatchEffect(() => {\n  // runs now, and again whenever theme OR fontSize changes\n  localStorage.setItem(\'prefs\', JSON.stringify({ theme: theme.value, fontSize: fontSize.value }))\n})\n</script>\n\n<template>\n  <button @click="theme = theme === \'light\' ? \'dark\' : \'light\'">Toggle</button>\n  <input type="number" v-model.number="fontSize" />\n</template>',
      explanation: [
        'watchEffect runs the function immediately on setup, writing the initial prefs.',
        'Inside, it reads theme.value and fontSize.value, so both become dependencies automatically.',
        'Changing either re-runs the function and re-persists — no dependency list needed.',
        'There is no old value here; watchEffect only gives you the current state.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'watchEffect(effect, options?) registers an eager reactive effect that runs immediately and automatically re-runs whenever any reactive dependency accessed during its execution changes. Dependencies are collected dynamically on every run, so the tracked set can vary between invocations. It supports an onCleanup callback (the first argument to the effect) for disposing prior work, and options flush (\'pre\' | \'post\' | \'sync\') and onTrack/onTrigger debug hooks. It returns a stop handle. Unlike watch, it has no explicit source and provides no old value. watchPostEffect and watchSyncEffect are flush-preset aliases.',

  // 7. Internal Working
  internalWorking: [
    'watchEffect creates a ReactiveEffect that is NOT lazy: it runs the effect function immediately during registration.',
    'During each run, Vue sets the effect as the active effect, so every reactive read (ref .value, reactive property) calls track and links this effect to that dependency.',
    'Before running, Vue cleans up the effect\'s previous dependency links, so the tracked set is rebuilt fresh each time — this is why conditional reads change the dependency set.',
    'Any registered onCleanup callback from the previous run is invoked before the next run (and on stop), enabling cancellation of stale async work.',
    'When any tracked dependency triggers, the effect\'s scheduler queues a re-run; default flush:\'pre\' batches it before the next render in the tick, deduplicated.',
    'On component unmount (or stop()), the effect is removed from all dep Sets and the final cleanup runs, preventing leaks.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   watchEffect((onCleanup) => { ...reads reactive values... })

   FIRST RUN (immediate) ─► reads theme,fontSize ─► track both
        │
   theme OR fontSize changes ─► scheduler queues re-run
        │
   run prev onCleanup() ─► clear old deps ─► run effect again
        │ (re-collect deps — may differ if branches change)
        ▼
   unmount/stop ─► detach from deps + final cleanup`,

  // 9. Memory Visualization
  memoryVisualization: [
    'EFFECT: a ReactiveEffect object holding the user function, its current deps array, and a scheduler.',
    'DYNAMIC DEPS: after each run, deps reflect exactly what was read; a branch not taken means that dependency is dropped until read again.',
    'CLEANUP: onCleanup stores a teardown closure invoked before the next run/stop (e.g. clearTimeout, AbortController.abort).',
    'SCOPE BINDING: created within the component effect scope so it is auto-stopped on unmount; the returned stop handle allows early disposal.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — runs immediately and on change',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst count = ref(0)\nwatchEffect(() => {\n  document.title = `Count: ${count.value}`\n})\n</script>\n\n<template><button @click="count++">+1</button></template>',
      explanation: [
        'watchEffect runs immediately, setting the initial title.',
        'It reads count.value, so count becomes a dependency automatically.',
        'Each increment re-runs the function and updates the title.',
        'No source argument and no old value — just "read deps, re-run".',
      ],
    },
    intermediate: {
      label: 'Intermediate — onCleanup to cancel a timer/request',
      lang: 'vue',
      code: '<script setup>\nimport { ref, watchEffect } from \'vue\'\nconst id = ref(1)\nconst data = ref(null)\n\nwatchEffect((onCleanup) => {\n  const ctrl = new AbortController()\n  onCleanup(() => ctrl.abort())   // cancel previous request\n  fetch(`/api/${id.value}`, { signal: ctrl.signal })\n    .then(r => r.json())\n    .then(d => { data.value = d })\n    .catch(e => { if (e.name !== \'AbortError\') throw e })\n})\n</script>',
      explanation: [
        'The effect reads id.value, so it re-runs when id changes.',
        'onCleanup aborts the previous fetch before the next run, preventing a stale overwrite.',
        'onCleanup is the FIRST argument of the effect function in watchEffect.',
        'This is the race-safe fetching pattern, mirroring watch\'s onCleanup.',
      ],
    },
    advanced: {
      label: 'Advanced — dynamic dependencies from conditional reads',
      lang: 'js',
      code: 'import { ref, watchEffect } from \'vue\'\nconst showDetails = ref(false)\nconst name = ref(\'Ada\')\nconst bio = ref(\'Pioneer\')\n\nwatchEffect(() => {\n  // Always depends on showDetails and name.\n  // Depends on bio ONLY when showDetails is true (branch taken).\n  if (showDetails.value) {\n    console.log(name.value, bio.value)\n  } else {\n    console.log(name.value)\n  }\n})\n// While showDetails is false, changing bio does NOT re-run the effect,\n// because bio was never read this run.',
      explanation: [
        'watchEffect re-collects dependencies every run based on what is actually read.',
        'When showDetails is false, bio is never read, so it is not a dependency.',
        'Changing bio then does nothing until showDetails becomes true and bio is read.',
        'This dynamic dependency behavior is powerful but can surprise — a key interview point.',
      ],
    },
    realProject: {
      label: 'Real project — sync a derived URL/query to history',
      lang: 'vue',
      code: '<script setup>\nimport { reactive, watchEffect } from \'vue\'\nimport { useRouter } from \'vue-router\'\nconst router = useRouter()\nconst filters = reactive({ q: \'\', page: 1, sort: \'name\' })\n\nwatchEffect(() => {\n  // Whenever any filter changes, reflect it in the URL query.\n  router.replace({ query: { q: filters.q, page: filters.page, sort: filters.sort } })\n})\n</script>',
      explanation: [
        'The effect reads all three filter properties, so it depends on each.',
        'Any filter change re-runs it and updates the URL query in place.',
        'It runs once immediately, establishing the initial URL state.',
        'watchEffect shines here: multiple sources, no need for old values or an explicit list.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'What is watchEffect and how is it different from watch?',
      answer: 'watchEffect runs a function immediately and re-runs it whenever any reactive value it reads changes, with automatic dependency collection and no old value. watch takes an explicit source, is lazy by default, and gives you both new and old values.',
      explanation: 'The four axes: immediacy, auto vs explicit deps, old value, laziness.',
    },
    {
      level: 'beginner',
      question: 'Does watchEffect run immediately?',
      answer: 'Yes. It runs its function once on registration to perform the side effect and to collect its initial dependencies, then re-runs on subsequent changes.',
      explanation: 'Immediacy is a defining trait, equivalent to watch with immediate:true (but without an old value).',
    },
    {
      level: 'intermediate',
      question: 'How does watchEffect know what to re-run on?',
      answer: 'It collects dependencies automatically: while the function runs, every reactive read registers that value as a dependency. It re-collects on each run, so the dependency set reflects exactly what was read that time.',
      explanation: 'Dynamic, per-run dependency collection is the key mechanism.',
    },
    {
      level: 'intermediate',
      question: 'Can conditional logic change which dependencies watchEffect tracks?',
      answer: 'Yes. If a reactive value is only read inside a branch that did not execute, it is not tracked that run. Changing it will not re-run the effect until a run actually reads it. This is the dynamic dependency behavior.',
      explanation: 'Tests deep understanding of per-run collection and its surprising consequences.',
    },
    {
      level: 'advanced',
      question: 'How do you cancel stale async work in watchEffect?',
      answer: 'Use the onCleanup callback, which is the first argument of the effect function. Register a teardown (e.g. AbortController.abort or clearTimeout); it runs before the next re-run and on stop, preventing races and leaks.',
      explanation: 'Senior signal: onCleanup placement (first arg) and the race-safety pattern.',
    },
    {
      level: 'senior',
      question: 'When would you prefer watch over watchEffect, and vice versa?',
      answer: 'Prefer watchEffect for concise side effects that depend on multiple values where you do not need the old value and want it to run immediately. Prefer watch when you need the previous value, want to control the exact source, need lazy behavior, or want to avoid accidental over-tracking from broad reads. watch is also clearer when the async logic should only run on actual change, not on setup.',
      explanation: 'Demonstrates judgment about correctness, clarity, and the over-tracking risk of automatic collection.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'watch vs watchEffect vs computed — when each?',
    'Where does onCleanup go in watchEffect? (first argument of the effect)',
    'Does watchEffect give you the old value? (no)',
    'What are watchPostEffect and watchSyncEffect?',
    'How can conditional reads change the tracked dependency set?',
    'How do you stop a watchEffect, and when is it auto-stopped?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Expecting an old value from watchEffect.',
      why: 'watchEffect does not provide previous values; it only reflects current state.',
      fix: 'Use watch(source, (n, o) => ...) when you need the old value.',
    },
    {
      mistake: 'Assuming a value is always tracked even when read conditionally.',
      why: 'Dependencies are collected per run; an unread branch drops that dependency.',
      fix: 'Read the value unconditionally if it must always be a dependency, or use watch with an explicit source.',
    },
    {
      mistake: 'Putting onCleanup in the wrong place or forgetting it for async work.',
      why: 'Without cleanup, stale fetches/timers can overwrite newer state or leak.',
      fix: 'Accept onCleanup as the first arg and register an AbortController/clearTimeout teardown.',
    },
    {
      mistake: 'Using watchEffect for over-broad reads that accidentally track too much.',
      why: 'Reading a whole reactive object or many values can cause unexpected re-runs.',
      fix: 'Read only what you need, or switch to watch with a precise getter source.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'Syncing derived state to localStorage, document.title, URL query, or imperative DOM attributes that depend on several reactive values.' },
    { area: 'Composables', detail: 'A useXxx that immediately applies and keeps in sync an effect (e.g. useTitle, useDark) based on current reactive inputs.' },
    { area: 'Vue Router', detail: 'Reflecting reactive filters into router query with router.replace inside a watchEffect.' },
    { area: 'Component library', detail: 'Applying computed styles/attributes to a template-ref element with watchPostEffect after DOM updates.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Concise and runs immediately, avoiding duplicate "init then watch" code.',
      'Batched (flush:\'pre\') so multiple synchronous changes coalesce into one re-run.',
    ],
    bad: [
      'Automatic collection can over-track if the function reads broadly, causing extra re-runs.',
      'Dynamic dependency changes can make re-run timing harder to reason about and profile.',
    ],
    optimizations: [
      'Read only the specific reactive values you need to minimize tracked deps.',
      'Use onCleanup to cancel obsolete async/timers instead of letting them complete.',
      'Use watchPostEffect only when DOM access is required; otherwise default pre.',
      'Prefer watch with a narrow getter when you need precise, stable dependencies.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['ref', 'reactive', 'watch'],
    nextConcepts: ['watch-vs-watcheffect', 'computed', 'composables', 'data-fetching-patterns'],
    dependencyNote:
      'watchEffect builds on the same reactive-effect machinery as watch and ref/reactive. It leads directly into the watch-vs-watchEffect comparison, complements computed (side effect vs cached value), and is a common building block inside composables and data-fetching-patterns.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Write watchEffect((onCleanup) => { ...reads reactive values... }).',
      'Say "runs immediately, auto-collects deps from what it reads".',
      'Draw re-collection each run: a branch not taken drops that dependency.',
      'Show onCleanup (first arg) running before re-run to cancel stale async.',
      'Contrast with watch (explicit source, lazy, old value) and computed (cached value, no side effects).',
    ],
    diagram: `   watchEffect((onCleanup) => read a,b)
     immediate run → track a,b
     a or b changes → onCleanup() → re-run → re-collect deps
     (conditional read ⇒ tracked set can change run-to-run)
     unmount/stop → detach + final cleanup
   --------------------------------------------------------
   watch: explicit source + old value + lazy
   computed: cached derived VALUE, no side effects`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'watchEffect runs a function immediately and re-runs it whenever any reactive value it read changes, collecting dependencies automatically with no explicit source and no old value. Dependencies are re-collected each run, so conditional reads can change the tracked set. It supports onCleanup (first arg) for cancelling stale async, plus flush and stop like watch. Use it for concise multi-dependency side effects; use watch when you need the old value, lazy behavior, or precise source control.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'watchEffect is a reactive side-effect runner that figures out its own dependencies. You pass it a function; it runs that function immediately, and while it runs it tracks every reactive value the function reads. From then on, whenever any of those values change, it re-runs the function. There is no explicit source argument and no old value — that is the main contrast with watch. Internally it is an eager (non-lazy) reactive effect: it runs once at registration both to perform the side effect and to collect its initial dependencies, and crucially it re-collects dependencies on every run. That gives it dynamic dependency behavior: if a reactive value is only read inside a branch that did not execute this time, it is not tracked, so changing it will not trigger a re-run until a run actually reads it. That is powerful but a known footgun, because the set of things that re-trigger the effect can change run to run. For async work it supports onCleanup, which is passed as the first argument of the effect function; you register a teardown like AbortController.abort, and it runs before the next re-run and on stop, which is how you avoid stale-response races and leaks. It shares the flush option with watch — pre by default, post for reading updated DOM, sync for synchronous timing — and there are presets watchPostEffect and watchSyncEffect. It is auto-stopped when the component unmounts and returns a stop handle for manual disposal. My rule for choosing: watchEffect when a side effect depends on several reactive values, I want it to run immediately, and I do not need the previous value; watch when I need the old value, lazy-on-change behavior, or precise control over the source to avoid accidentally over-tracking with automatic collection.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Conciseness vs control: watchEffect avoids dependency boilerplate but trades away the old value and precise source selection.',
      'Automatic collection can over-track or under-track depending on branches, where watch\'s explicit source is predictable.',
    ],
    edgeCases: [
      'Conditional reads change the tracked dependency set between runs — a value behind an unexecuted branch is not a dependency.',
      'Reading the same reactive value asynchronously (after an await) is NOT tracked, because tracking only happens during the synchronous portion of the run.',
      'flush:\'sync\' can re-enter if the effect mutates a value it reads.',
      'Effects created outside a component (module-scope composable) must be stopped manually or scoped via effectScope.',
    ],
    runtimeBehavior: [
      'Dependencies are cleaned and rebuilt each run, so stale deps never persist.',
      'Default pre flush batches and dedupes re-runs per tick; post runs after DOM patch.',
      'onCleanup runs before each subsequent run and on stop, in registration order.',
    ],
    scalability: [
      'For high-frequency or broad-read effects, prefer narrow reads or watch to limit re-runs.',
      'Group related effects in an effectScope so they can be stopped together in long-lived contexts.',
    ],
    productionConcerns: [
      'Async-after-await reads silently not tracked is a subtle bug source — collect deps synchronously first.',
      'Over-tracking from broad reads causes excess re-runs and wasted work; profile with onTrack/onTrigger.',
      'Forgotten stops in module-level usage leak effects; bind to a scope or stop explicitly.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'watchEffect(fn): runs immediately + re-runs on any read reactive dep.',
    'Auto dependency collection — no explicit source.',
    'No old value (use watch for that).',
    'Re-collects deps each run → conditional reads change tracked set.',
    'Only SYNC reads are tracked; reads after await are NOT.',
    'onCleanup is the FIRST argument of the effect function.',
    'flush: pre (default) | post (after DOM) | sync.',
    'Aliases: watchPostEffect, watchSyncEffect.',
    'Auto-stopped on unmount; returns a stop() handle.',
    'Use it for concise multi-dep side effects; watch for old value/precision.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Use watchEffect to keep document.title in sync with a count ref.',
      hint: 'Read count.value inside the effect.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst count = ref(0)\nwatchEffect(() => { document.title = `Count: ${count.value}` })\n// runs now; re-runs whenever count changes',
        explanation: [
          'The effect runs immediately, setting the initial title.',
          'Reading count.value tracks it, so changes re-run the effect.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add onCleanup to a watchEffect that polls an endpoint, clearing the interval on re-run/stop.',
      hint: 'onCleanup is the first arg.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst url = ref(\'/api/a\')\nconst data = ref(null)\nwatchEffect((onCleanup) => {\n  const u = url.value\n  const t = setInterval(async () => {\n    data.value = await fetch(u).then(r => r.json())\n  }, 5000)\n  onCleanup(() => clearInterval(t))\n})',
        explanation: [
          'onCleanup clears the previous interval before re-running (when url changes) and on stop.',
          'This prevents stacking multiple intervals or polling a stale URL.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Predict behavior: while flag is false, does changing y re-run this effect? watchEffect(() => flag.value ? log(y.value) : log(x.value)).',
      hint: 'Dependencies are per-run from actual reads.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst flag = ref(false)\nconst x = ref(1)\nconst y = ref(2)\nwatchEffect(() => { flag.value ? console.log(y.value) : console.log(x.value) })\n// flag=false: reads flag and x only → changing y does NOT re-run.\n// Set flag=true → effect reads flag and y → now y changes DO re-run it.',
        explanation: [
          'When flag is false, only flag and x are read, so only they are tracked.',
          'y is not a dependency until a run actually reads it (flag true).',
          'This is the dynamic dependency collection behavior in action.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Explain why this fetch is not tracked reactively and fix it: watchEffect(async () => { const r = await fetch(`/api/${id.value}`); ... }).',
      hint: 'Tracking only happens during synchronous execution.',
      solution: {
        lang: 'js',
        code: 'import { ref, watchEffect } from \'vue\'\nconst id = ref(1)\nconst data = ref(null)\n\n// PROBLEM: id.value is read AFTER the function suspends? No — here it is\n// read synchronously in the template string, so it IS tracked. The real\n// trap is reading a reactive value AFTER an await:\nwatchEffect(async (onCleanup) => {\n  const currentId = id.value // read sync → tracked\n  const ctrl = new AbortController()\n  onCleanup(() => ctrl.abort())\n  data.value = await fetch(`/api/${currentId}`, { signal: ctrl.signal }).then(r => r.json())\n  // Do NOT read another ref here expecting tracking — post-await reads are not tracked.\n})',
        explanation: [
          'Only reads during the synchronous part of the run are tracked.',
          'Capture reactive values into locals BEFORE the first await so dependencies are registered.',
          'Pair with onCleanup/AbortController to cancel stale requests on re-run.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'watchEffect rounds out the reactivity toolkit, and the watch-vs-watchEffect distinction is a frequent interview question. Explaining automatic per-run dependency collection, the no-old-value tradeoff, and the post-await tracking trap signals genuine depth.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys) ask "what is watchEffect / how is it different from watch". Product companies (Zoho, Flipkart, Razorpay) ask about automatic dependency collection and onCleanup races. FAANG-level interviews probe dynamic dependencies, the post-await tracking gotcha, and flush/scope semantics.',
    whatInterviewersExpect:
      'The immediate-run + auto-collection model, the no-old-value contrast with watch, awareness that only synchronous reads are tracked and that conditional reads change the dependency set, and the onCleanup pattern for async safety.',
  },
}

export default watcheffect
