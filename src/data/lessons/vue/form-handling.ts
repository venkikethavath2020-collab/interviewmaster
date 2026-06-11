import type { ConceptLesson } from '../../../types/lesson'

const formHandling: ConceptLesson = {
  // 1. Concept Summary
  slug: 'form-handling',
  name: 'Form Handling',
  category: 'forms-async',
  difficulty: 'beginner',
  importance: 4,
  interviewFrequency: 4,

  // 2. Why Should I Care?
  whyCare: [
    'Almost every real app is mostly forms — login, signup, checkout, settings, search — so form handling is a daily skill, not an edge case.',
    'Vue\'s v-model makes two-way binding effortless, but you still need to handle validation, submission, errors, and edge cases correctly.',
    'Interviewers use forms to test v-model fundamentals, controlled inputs, validation strategy, and how you prevent default browser submission.',
    'Form bugs are highly visible to users: lost input, double submits, broken validation, and accessibility failures all hurt trust.',
    'Good form architecture (composables, schema validation) is a strong signal of real Vue experience versus tutorial knowledge.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'A form is like a worksheet: you write answers in the boxes, the app instantly reads your answers, checks them, and only lets you hand it in when everything is filled correctly.',
    story: [
      'Imagine a worksheet with blanks for your name, age, and favorite color. As you write, a helpful robot reads each blank the moment you fill it.',
      'If you write your age as "banana", the robot gently says "that should be a number" before you even hand it in.',
      'When every blank is correct, the robot lets you press the big "Submit" button to hand the worksheet to the teacher.',
      'In Vue, v-model is the robot that instantly reads what you type into each box, and validation is the robot checking your answers before you submit.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'A form collects input from the user — text, checkboxes, dropdowns — and usually sends it somewhere when submitted.',
    'In Vue, v-model connects an input to a piece of reactive data so they stay in sync automatically: type in the box and the variable updates; change the variable and the box updates.',
    'When the user submits, you normally stop the browser\'s default page reload (with .prevent), validate the data, and then send it (often to a server).',
    'Good forms also show clear error messages, disable the submit button while sending, and handle success and failure gracefully.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Form handling in Vue is binding inputs to reactive state with v-model, validating that state, and handling submission (prevent default, send data, manage loading/error/success).',
    how: 'v-model creates two-way binding by combining a value binding with an input event handler. You group fields in a reactive object, validate on input/blur/submit, use @submit.prevent to stop the page reload, and call your API in the submit handler.',
    why: 'It centralizes form state, gives instant feedback, and ensures only valid data is submitted — all with minimal boilerplate compared to manual event wiring.',
    code: {
      label: 'Basic form with v-model and prevented submit',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { reactive } from \'vue\'\nconst form = reactive({ name: \'\', email: \'\' })\n\nfunction onSubmit() {\n  console.log(\'submitting\', { ...form })\n}\n</script>\n\n<template>\n  <form @submit.prevent="onSubmit">\n    <input v-model="form.name" placeholder="Name" />\n    <input v-model="form.email" type="email" placeholder="Email" />\n    <button type="submit">Save</button>\n  </form>\n</template>',
      explanation: [
        'reactive groups the fields into one form object.',
        'v-model keeps each input in sync with form.name / form.email.',
        '@submit.prevent stops the browser from reloading the page on submit.',
        'onSubmit receives the current form values to send or process.',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Form handling in Vue 3 is the pattern of binding form controls to reactive state via v-model — which desugars to a :value (or :checked/:modelValue) binding plus an input/change handler — and orchestrating validation and submission around that state. Submission is handled with @submit.prevent to suppress the native navigation, after which the validated state is sent (typically an async API call) with explicit loading, error, and success handling. Robust forms model fields in a reactive object (or per-field refs), validate on appropriate events (input/blur/submit), surface field-level and form-level errors, guard against double submission, and remain accessible (labels, aria, focus management).',

  // 7. Internal Working
  internalWorking: [
    'v-model on a native input compiles to a :value binding plus an @input listener that assigns event.target.value back to the bound state (for checkboxes it uses :checked/@change, for selects @change).',
    'When the user types, the input event fires, Vue updates the reactive state, which triggers any dependent computeds (e.g. validation) and re-renders the affected nodes.',
    'The reactive form object tracks each field; reading fields in a computed (validation) subscribes that computed so errors recompute as the user types.',
    'On submit, @submit.prevent calls event.preventDefault() so the browser does not reload/navigate, then invokes your handler with current state.',
    'The handler typically validates, sets a loading flag (disabling the button), performs an async request, and on resolution sets success state or maps server errors back onto fields.',
    'Vue\'s async scheduler batches the state changes from typing/validation into efficient single re-renders per tick.',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   user types ──► input event ──► v-model writes to reactive form
        │                                   │
        │                            ┌──────┴───────┐
        │                            ▼              ▼
        │                     computed errors   re-render fields
        │
   click Submit ──► @submit.prevent ──► validate
                                          │ valid?
                              ┌───────────┴───────────┐
                             no                       yes
                              │                        │
                       show errors            loading=true ─► API call
                                                       │
                                          success ◄────┴────► error
                                          (reset/redirect)  (map to fields)`,

  // 9. Memory Visualization
  memoryVisualization: [
    'The reactive form object lives on the heap for the component\'s lifetime, holding each field value and tracking dependencies.',
    'Validation computeds keep dependency links to the fields they read, recomputing only when those fields change.',
    'Loading/error/success flags are small refs that gate the UI and prevent duplicate submissions.',
    'On unmount, the form state and its computed effects are released along with the component scope.',
  ],

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — various input types with v-model',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { reactive } from \'vue\'\nconst form = reactive({\n  name: \'\',\n  agree: false,\n  role: \'user\',\n  bio: \'\',\n})\n</script>\n\n<template>\n  <input v-model.trim="form.name" />\n  <input type="checkbox" v-model="form.agree" />\n  <select v-model="form.role">\n    <option value="user">User</option>\n    <option value="admin">Admin</option>\n  </select>\n  <textarea v-model="form.bio"></textarea>\n</template>',
      explanation: [
        'v-model works across text, checkbox, select, and textarea.',
        'For checkboxes it binds a boolean; for selects it binds the chosen value.',
        '.trim is a v-model modifier that strips whitespace automatically.',
        'All fields stay in one reactive object for easy submission.',
      ],
    },
    intermediate: {
      label: 'Intermediate — validation with computed errors',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { reactive, computed, ref } from \'vue\'\nconst form = reactive({ email: \'\', password: \'\' })\nconst submitted = ref(false)\n\nconst errors = computed(() => ({\n  email: !form.email ? \'Email required\' : !form.email.includes(\'@\') ? \'Invalid email\' : \'\',\n  password: form.password.length < 8 ? \'Min 8 characters\' : \'\',\n}))\nconst isValid = computed(() => !errors.value.email && !errors.value.password)\n\nfunction onSubmit() {\n  submitted.value = true\n  if (!isValid.value) return\n  // proceed to send\n}\n</script>\n\n<template>\n  <form @submit.prevent="onSubmit">\n    <input v-model.trim="form.email" />\n    <p v-if="submitted && errors.email">{{ errors.email }}</p>\n    <input type="password" v-model="form.password" />\n    <p v-if="submitted && errors.password">{{ errors.password }}</p>\n    <button :disabled="submitted && !isValid">Login</button>\n  </form>\n</template>',
      explanation: [
        'errors is a cached computed that recalculates as fields change.',
        'Errors are only shown after the user attempts submit (submitted flag) for nicer UX.',
        'isValid derives overall validity for gating submission and the button.',
        'No external library needed for simple rules — pure reactivity.',
      ],
    },
    advanced: {
      label: 'Advanced — async submit with loading, error, and double-submit guard',
      lang: 'vue',
      code: '<script setup lang="ts">\nimport { reactive, ref } from \'vue\'\nconst form = reactive({ title: \'\', body: \'\' })\nconst loading = ref(false)\nconst serverError = ref(\'\')\n\nasync function onSubmit() {\n  if (loading.value) return // guard double submit\n  loading.value = true\n  serverError.value = \'\'\n  try {\n    const res = await fetch(\'/api/posts\', {\n      method: \'POST\',\n      headers: { \'Content-Type\': \'application/json\' },\n      body: JSON.stringify(form),\n    })\n    if (!res.ok) throw new Error(`Failed: ${res.status}`)\n    // success: reset or redirect\n    form.title = \'\'\n    form.body = \'\'\n  } catch (e) {\n    serverError.value = (e as Error).message\n  } finally {\n    loading.value = false\n  }\n}\n</script>\n\n<template>\n  <form @submit.prevent="onSubmit">\n    <input v-model="form.title" />\n    <textarea v-model="form.body"></textarea>\n    <p v-if="serverError">{{ serverError }}</p>\n    <button :disabled="loading">{{ loading ? \'Saving...\' : \'Save\' }}</button>\n  </form>\n</template>',
      explanation: [
        'The loading guard prevents duplicate submissions while a request is in flight.',
        'The button is disabled and labeled during submission for clear feedback.',
        'try/catch/finally cleanly maps success vs failure and always clears loading.',
        'Server errors surface to the user instead of failing silently.',
      ],
    },
    realProject: {
      label: 'Real project — reusable form composable with schema validation',
      lang: 'ts',
      code: 'import { reactive, computed } from \'vue\'\nimport { z } from \'zod\'\n\nexport function useForm<T extends Record<string, unknown>>(\n  initial: T,\n  schema: z.ZodType<T>,\n) {\n  const values = reactive({ ...initial }) as T\n  const errors = computed<Record<string, string>>(() => {\n    const r = schema.safeParse(values)\n    if (r.success) return {}\n    const out: Record<string, string> = {}\n    for (const issue of r.error.issues) out[issue.path.join(\'.\')] = issue.message\n    return out\n  })\n  const isValid = computed(() => Object.keys(errors.value).length === 0)\n  return { values, errors, isValid }\n}',
      explanation: [
        'A composable centralizes form state, schema validation, and validity.',
        'zod (or yup/valibot) declares rules once and maps issues to field errors.',
        'errors and isValid are cached computeds driven by the reactive values.',
        'This is the production-grade pattern: reusable, typed, and decoupled from any single component.',
        'Components consume it and only handle layout + submission.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'beginner',
      question: 'How does v-model work on a form input?',
      answer: 'v-model is two-way binding: it desugars to a value binding plus an event listener. For a text input it is :value plus @input that writes event.target.value back to the bound state, so the input and the data stay in sync.',
      explanation: 'The expected detail is the value + event-listener desugaring, not just "two-way binding".',
    },
    {
      level: 'beginner',
      question: 'Why do you use @submit.prevent on a form?',
      answer: 'To stop the browser\'s default form submission, which would reload or navigate the page. .prevent calls event.preventDefault() so you can handle submission in JavaScript instead.',
      explanation: 'A core gotcha — forgetting .prevent causes a full page reload.',
    },
    {
      level: 'intermediate',
      question: 'How would you validate a form in Vue without a library?',
      answer: 'Model fields in a reactive object and derive an errors computed that returns messages per field based on the current values. Gate submission with an isValid computed, and typically only show errors after a submit attempt or on blur.',
      explanation: 'Tests using computeds for derived validation state and good UX around when to show errors.',
    },
    {
      level: 'intermediate',
      question: 'How do you prevent double submission of a form?',
      answer: 'Keep a loading ref; set it true at the start of the async submit, return early if it is already true, disable the submit button while loading, and reset it in finally.',
      explanation: 'Double-submit is a classic real-world bug; the loading-guard pattern is expected.',
    },
    {
      level: 'advanced',
      question: 'How would you build a reusable, type-safe form abstraction?',
      answer: 'A composable that takes initial values and a schema (zod/yup), stores values in reactive state, exposes errors and isValid as computeds derived from validating the schema, and returns helpers for submit/reset. Components just bind fields and render errors.',
      explanation: 'Senior signal: schema-driven validation, composable reuse, and TypeScript typing of values.',
    },
    {
      level: 'senior',
      question: 'What are the trade-offs between validating on input, on blur, and on submit?',
      answer: 'On input gives instant feedback but can feel naggy and trigger frequent (possibly async) checks; on blur validates a field once the user leaves it, which is calmer; on submit validates everything at once. The common production approach is hybrid: validate on submit, then switch a touched field to validate on input so corrections show live. Async validation (e.g. unique email) should be debounced.',
      explanation: 'Senior signal: balancing UX, performance, and async validation timing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What do the v-model modifiers .lazy, .number, and .trim do?',
    'How do you bind a group of checkboxes to an array with v-model?',
    'How do you implement custom v-model on a child component?',
    'How would you debounce async validation like checking if a username is taken?',
    'How do you map server-side validation errors back onto fields?',
    'How do you make a form accessible (labels, aria-invalid, focus on error)?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Forgetting @submit.prevent on the form.',
      why: 'The browser performs its default submission and reloads/navigates the page, wiping app state.',
      fix: 'Use <form @submit.prevent="onSubmit"> and handle submission in JS.',
    },
    {
      mistake: 'Allowing double submission while a request is in flight.',
      why: 'Rapid clicks fire multiple API calls, creating duplicate records or race conditions.',
      fix: 'Guard with a loading ref and disable the submit button until the request resolves.',
    },
    {
      mistake: 'Showing all validation errors immediately on first render.',
      why: 'A pristine form lit up with red errors is hostile UX and confuses users.',
      fix: 'Show errors after a submit attempt or once a field is touched/blurred.',
    },
    {
      mistake: 'Treating v-model.number/.trim as automatic type safety.',
      why: 'Modifiers help but do not validate; users can still submit invalid or empty values.',
      fix: 'Always validate explicitly (rules or a schema) regardless of modifiers.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Vue', detail: 'v-model and its modifiers are the built-in mechanism for binding all native form controls and custom components to reactive state.' },
    { area: 'Component library', detail: 'Form libraries (VeeValidate, FormKit) and UI kits (Vuetify, Element Plus) provide field components, validation, and error display built on v-model and composables.' },
    { area: 'Pinia', detail: 'Multi-step or persisted forms keep draft state in a store so navigation does not lose progress, with the submit action calling the API.' },
    { area: 'Nuxt', detail: 'Server routes/actions receive validated payloads; the same schema (zod) can validate on both client and server for consistency.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'Reactive form state + computed validation only recomputes errors for changed fields.',
      'A loading guard prevents wasteful duplicate network requests.',
    ],
    bad: [
      'Per-keystroke async validation without debounce floods the network and re-renders.',
      'Huge forms re-validating everything on every input can cause noticeable lag.',
    ],
    optimizations: [
      'Debounce expensive/async validation (e.g. uniqueness checks).',
      'Validate per-field or only touched fields rather than the whole schema on every keystroke.',
      'Disable submit during in-flight requests to avoid duplicates.',
      'For very large forms, split into steps/sections so only the active part is reactive/validated.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['v-model', 'v-on-events', 'event-modifiers', 'reactive'],
    nextConcepts: ['v-model-components', 'data-fetching-patterns', 'error-handling-vue', 'composables'],
    dependencyNote:
      'Form handling builds directly on v-model, event handling, and event modifiers (.prevent), plus reactive state. It leads into custom component v-model, data-fetching patterns for submission, and error handling, and is commonly refactored into composables.',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a reactive form object with fields, each bound to an input by v-model.',
      'Show typing → input event → v-model writes to the field → validation computed recalculates.',
      'Draw the <form> with @submit.prevent calling onSubmit (no page reload).',
      'In onSubmit, branch: invalid → show errors; valid → set loading, call API, handle success/error.',
      'Conclude: "v-model binds state, computed validates, prevent stops reload, loading guards double submit."',
    ],
    diagram: `  form{ } ──v-model──► inputs
     │
   type → input event → write field → computed errors → isValid
     │
  @submit.prevent → onSubmit
     ├ invalid → show errors
     └ valid → loading=true → API → success | error (clear loading)`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Vue form handling binds inputs to reactive state with v-model (which is a value binding plus an input listener), validates that state with computeds, and submits with @submit.prevent to stop the page reload. Derive an errors computed and an isValid flag, show errors only after submit or on blur, guard against double submission with a loading ref, and handle async success and failure explicitly. For real apps, wrap it in a composable with schema validation (zod/yup) for reuse and type safety.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Form handling in Vue centers on v-model, validation, and submission. v-model gives you two-way binding: under the hood it desugars to a value binding plus an event listener — for a text input that is :value with an @input handler that writes the value back to your reactive state. So you typically model all your fields in one reactive object, and each input binds to a field. As the user types, the input event updates state, which re-runs any validation computeds and re-renders. For validation without a library, I derive an errors computed that returns a message per field from the current values, plus an isValid computed to gate submission. A good UX detail is to only show errors after a submit attempt or once a field is touched, so a fresh form isn\'t covered in red. For submission, the form uses @submit.prevent, which calls preventDefault so the browser doesn\'t reload the page, then runs my handler. In the handler I guard against double submission with a loading ref — return early if already loading, set it true, disable the button — then make the async request in a try/catch/finally, mapping success to a reset or redirect and failure to a visible error, always clearing loading in finally. For real applications I extract all of this into a composable that takes initial values and a schema like zod, stores values reactively, and exposes errors and isValid as computeds from validating the schema. That gives reuse, type safety, and lets me share the same schema between client and server. The senior nuances are validation timing — hybrid on-submit then on-input for touched fields — and debouncing async checks like "is this email taken" so I\'m not hitting the server on every keystroke.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Roll-your-own validation is simple and dependency-free but reinvents rules; schema libraries (zod/yup) add weight but give reuse, typing, and server sharing.',
      'Validating on input is responsive but can be naggy and costly; on submit is calm but delays feedback — hybrid balances both.',
      'Storing form state in a component is simple; a store enables persistence/multi-step but adds coupling.',
    ],
    edgeCases: [
      'Checkbox groups bind to an array via v-model; single checkboxes bind to a boolean — easy to mix up.',
      'v-model.number can yield NaN on empty/invalid input; handle it explicitly.',
      'Async validation can race (older response arriving later) — track the latest request or debounce.',
      'Server-side validation errors must be mapped back onto the right fields, including non-field/form-level errors.',
    ],
    runtimeBehavior: [
      'v-model updates fire on input (or change for lazy/checkbox/select), batched by Vue\'s scheduler.',
      'Validation computeds recompute only when their referenced fields change.',
      'Disabling the submit button during loading both signals state and structurally prevents re-entry.',
    ],
    scalability: [
      'Large/multi-step forms benefit from per-step reactive state and lazy validation of only the active step.',
      'A shared schema validated on client and server keeps a growing form consistent and reduces duplicated rules.',
    ],
    productionConcerns: [
      'Accessibility: associate labels, set aria-invalid/aria-describedby, and move focus to the first error on submit.',
      'Prevent data loss: warn on unsaved changes / persist drafts for long forms.',
      'Handle network failure and partial server errors gracefully; never leave the form stuck in loading.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'v-model = :value + @input (two-way binding).',
    'Modifiers: .lazy (on change), .number (cast), .trim (strip spaces).',
    '@submit.prevent stops the page reload.',
    'Group fields in a reactive object.',
    'Derive errors + isValid as computeds.',
    'Show errors after submit or on blur, not immediately.',
    'Guard double submit with a loading ref + disabled button.',
    'try/catch/finally around async submit; clear loading in finally.',
    'Checkbox group → array; single checkbox → boolean.',
    'Debounce async validation (e.g. unique checks).',
    'Extract reusable forms into a composable + schema (zod/yup).',
    'Accessibility: labels, aria-invalid, focus first error.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Build a name + email form that logs the values on submit without reloading the page.',
      hint: 'reactive form + @submit.prevent.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { reactive } from \'vue\'\nconst form = reactive({ name: \'\', email: \'\' })\nfunction submit() { console.log({ ...form }) }\n</script>\n\n<template>\n  <form @submit.prevent="submit">\n    <input v-model.trim="form.name" />\n    <input v-model.trim="form.email" type="email" />\n    <button>Send</button>\n  </form>\n</template>',
        explanation: [
          'reactive holds both fields.',
          'v-model keeps them in sync.',
          '@submit.prevent stops the reload so submit() runs.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Add validation: email must contain @ and password must be at least 8 chars; disable submit until valid.',
      hint: 'errors computed + isValid computed.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { reactive, computed } from \'vue\'\nconst form = reactive({ email: \'\', password: \'\' })\nconst errors = computed(() => ({\n  email: form.email.includes(\'@\') ? \'\' : \'Invalid email\',\n  password: form.password.length >= 8 ? \'\' : \'Too short\',\n}))\nconst isValid = computed(() => !errors.value.email && !errors.value.password)\n</script>\n\n<template>\n  <form @submit.prevent>\n    <input v-model="form.email" />\n    <input v-model="form.password" type="password" />\n    <button :disabled="!isValid">Login</button>\n  </form>\n</template>',
        explanation: [
          'errors recomputes as fields change.',
          'isValid gates the button.',
          'No library needed for simple rules.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Implement an async submit that prevents double-submit and shows a server error on failure.',
      hint: 'loading ref guard + try/catch/finally.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { reactive, ref } from \'vue\'\nconst form = reactive({ msg: \'\' })\nconst loading = ref(false)\nconst error = ref(\'\')\nasync function submit() {\n  if (loading.value) return\n  loading.value = true; error.value = \'\'\n  try {\n    const r = await fetch(\'/api/msg\', { method: \'POST\', body: JSON.stringify(form) })\n    if (!r.ok) throw new Error(\'Failed\')\n    form.msg = \'\'\n  } catch (e) { error.value = (e as Error).message }\n  finally { loading.value = false }\n}\n</script>\n\n<template>\n  <form @submit.prevent="submit">\n    <input v-model="form.msg" />\n    <p v-if="error">{{ error }}</p>\n    <button :disabled="loading">{{ loading ? \'...\' : \'Send\' }}</button>\n  </form>\n</template>',
        explanation: [
          'The loading guard blocks re-entry while in flight.',
          'finally always resets loading.',
          'Server errors are surfaced to the user.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'Bind a group of interest checkboxes to a single array with v-model and require at least one.',
      hint: 'Multiple checkboxes with the same v-model array and shared value attributes.',
      solution: {
        lang: 'vue',
        code: '<script setup lang="ts">\nimport { ref, computed } from \'vue\'\nconst interests = ref<string[]>([])\nconst error = computed(() => interests.value.length ? \'\' : \'Pick at least one\')\n</script>\n\n<template>\n  <label><input type="checkbox" value="vue" v-model="interests" /> Vue</label>\n  <label><input type="checkbox" value="react" v-model="interests" /> React</label>\n  <label><input type="checkbox" value="svelte" v-model="interests" /> Svelte</label>\n  <p v-if="error">{{ error }}</p>\n</template>',
        explanation: [
          'Multiple checkboxes sharing one v-model array push/remove their value.',
          'interests becomes the list of checked values.',
          'A computed enforces the at-least-one rule.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Forms are the backbone of real apps, so confident form handling shows you can build the features companies actually need — login, checkout, settings — correctly and accessibly.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask how v-model works and why .prevent is needed. Product companies (Zoho, Flipkart, Razorpay) ask you to build a validated form with async submit and double-submit protection. FAANG-level interviews probe validation timing, schema-driven reusable forms, accessibility, and async-validation races.',
    whatInterviewersExpect:
      'Explain v-model\'s value+event desugaring, use @submit.prevent, derive validation with computeds, guard double submission with loading, handle async success/failure, and ideally describe a reusable composable + schema approach with good UX and accessibility.',
  },
}

export default formHandling
