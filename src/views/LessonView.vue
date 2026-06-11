<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { ConceptLesson, LessonCode } from '../types/lesson'
import { loadLesson } from '../data/lessons'
import { getTechMeta } from '../data'
import CodeBlock from '../components/content/CodeBlock.vue'
import LevelBadge from '../components/content/LevelBadge.vue'
import ImportanceStars from '../components/content/ImportanceStars.vue'
import BookmarkButton from '../components/content/BookmarkButton.vue'

const route = useRoute()
const lesson = shallowRef<ConceptLesson | null>(null)
const loading = shallowRef(true)
const notFound = shallowRef(false)

const techId = computed(() => String(route.params.tech))
const slug = computed(() => String(route.params.slug))
const meta = computed(() => getTechMeta(techId.value))

watch(
  [techId, slug],
  async () => {
    loading.value = true
    notFound.value = false
    const l = await loadLesson(techId.value, slug.value)
    lesson.value = l
    notFound.value = !l
    loading.value = false
    if (l) document.title = `${l.name} — Full Lesson · InterviewMaster`
  },
  { immediate: true },
)

// Section registry drives both the sticky nav and rendering order.
const sections = [
  { id: 'summary', label: '1 · Summary' },
  { id: 'why-care', label: '2 · Why Care' },
  { id: 'child', label: '3 · Age 10' },
  { id: 'school', label: '4 · School' },
  { id: 'beginner', label: '5 · Beginner Dev' },
  { id: 'technical', label: '6 · Technical' },
  { id: 'internal', label: '7 · Internals' },
  { id: 'mental-model', label: '8 · Mental Model' },
  { id: 'memory', label: '9 · Memory' },
  { id: 'examples', label: '10 · Examples' },
  { id: 'questions', label: '11 · Questions' },
  { id: 'followups', label: '12 · Follow-ups' },
  { id: 'mistakes', label: '13 · Mistakes' },
  { id: 'production', label: '14 · Production' },
  { id: 'performance', label: '15 · Performance' },
  { id: 'security', label: '16 · Security' },
  { id: 'related', label: '17 · Related' },
  { id: 'whiteboard', label: '18 · Whiteboard' },
  { id: 'thirty', label: '19 · 30s Revision' },
  { id: 'two-min', label: '20 · 2-min Answer' },
  { id: 'senior', label: '21 · Senior Deep Dive' },
  { id: 'cheatsheet', label: '22 · Cheat Sheet' },
  { id: 'exercises', label: '23 · Exercises' },
  { id: 'confidence', label: '24 · Confidence' },
]

function conceptLink(s: string) {
  return `/tech/${techId.value}/knowledge#${s}`
}

/** Mobile section jump (the desktop side-nav is hidden below lg). */
function jumpToSection(e: Event) {
  const id = (e.target as HTMLSelectElement).value
  if (!id) return
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  ;(e.target as HTMLSelectElement).selectedIndex = 0
}

const exerciseCls: Record<LessonCode extends never ? never : string, string> = {}
const diffCls: Record<string, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  hard: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  interview: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}
void exerciseCls
</script>

<template>
  <div v-if="loading" class="py-20 text-center text-slate-400">Loading lesson…</div>

  <div v-else-if="notFound" class="py-20 text-center">
    <p class="text-lg font-semibold">No full lesson for “{{ slug }}” yet.</p>
    <RouterLink :to="conceptLink(slug)" class="btn-primary mt-4">View it in the Knowledge Map</RouterLink>
  </div>

  <div v-else-if="lesson">
    <!-- Mobile section jump (desktop side-nav is hidden below lg) -->
    <div class="sticky top-0 z-20 -mx-4 mb-5 flex items-center gap-2 border-b border-slate-200 bg-surface-light/90 px-4 py-2 backdrop-blur dark:border-slate-800 dark:bg-surface-dark/90 lg:hidden">
      <RouterLink :to="`/tech/${techId}/knowledge`" class="shrink-0 text-xs text-slate-400 hover:text-accent-600">← Map</RouterLink>
      <select class="input py-1 text-sm" aria-label="Jump to section" @change="jumpToSection">
        <option value="">Jump to section…</option>
        <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.label }}</option>
      </select>
    </div>

    <div class="lg:grid lg:grid-cols-[200px_1fr] lg:gap-6">
    <!-- Sticky section nav (desktop) -->
    <nav class="hidden lg:block">
      <div class="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        <RouterLink :to="`/tech/${techId}/knowledge`" class="mb-3 block text-xs text-slate-400 hover:text-accent-600">← Knowledge Map</RouterLink>
        <a
          v-for="s in sections"
          :key="s.id"
          :href="`#${s.id}`"
          class="block rounded px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-accent-600 dark:hover:bg-slate-800"
        >
          {{ s.label }}
        </a>
      </div>
    </nav>

    <article class="min-w-0 space-y-8">
      <!-- 1. Summary -->
      <header id="summary" class="scroll-mt-20">
        <div class="mb-2 flex items-center gap-2">
          <RouterLink :to="`/tech/${techId}/knowledge`" class="text-sm text-slate-400 hover:text-accent-600">{{ meta?.name }} Knowledge Map</RouterLink>
          <span class="text-slate-300">/</span>
          <span class="text-sm font-medium">Full lesson</span>
        </div>
        <div class="flex items-start justify-between gap-3">
          <h1 class="text-3xl font-bold tracking-tight">{{ lesson.name }}</h1>
          <BookmarkButton :tech-id="techId" kind="concept" :item-id="lesson.slug" :title="lesson.name" />
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <LevelBadge :level="lesson.difficulty === 'senior' || lesson.difficulty === 'expert' ? 'expert' : lesson.difficulty" />
          <span class="badge bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ lesson.category }}</span>
          <span class="badge bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">Importance {{ lesson.importance }}/5</span>
          <span class="flex items-center gap-1"><ImportanceStars :value="lesson.interviewFrequency" /><span class="text-xs text-slate-400">interview</span></span>
        </div>
      </header>

      <!-- 2. Why Care -->
      <section id="why-care" class="card scroll-mt-20 border-l-4 !border-l-accent-500 p-5">
        <h2 class="section-title">Why should I care?</h2>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li v-for="(p, i) in lesson.whyCare" :key="i">{{ p }}</li>
        </ul>
      </section>

      <!-- 3. Child -->
      <section id="child" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🧒 Explain like I'm 10</h2>
        <p class="mb-3 rounded-lg bg-amber-50 p-3 text-sm font-semibold dark:bg-amber-900/20">{{ lesson.childExplanation.analogy }}</p>
        <div class="space-y-2 text-sm leading-relaxed">
          <p v-for="(p, i) in lesson.childExplanation.story" :key="i">{{ p }}</p>
        </div>
      </section>

      <!-- 4. School -->
      <section id="school" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🎒 School-student level</h2>
        <div class="space-y-2 text-sm leading-relaxed">
          <p v-for="(p, i) in lesson.schoolExplanation" :key="i">{{ p }}</p>
        </div>
      </section>

      <!-- 5. Beginner Dev -->
      <section id="beginner" class="card scroll-mt-20 p-5">
        <h2 class="section-title">👩‍💻 Beginner developer</h2>
        <p class="mb-1 text-sm"><strong>What:</strong> {{ lesson.beginnerExplanation.what }}</p>
        <p class="mb-1 text-sm"><strong>How:</strong> {{ lesson.beginnerExplanation.how }}</p>
        <p class="mb-3 text-sm"><strong>Why useful:</strong> {{ lesson.beginnerExplanation.why }}</p>
        <CodeBlock v-if="lesson.beginnerExplanation.code" :code="lesson.beginnerExplanation.code.code" :lang="lesson.beginnerExplanation.code.lang" :caption="lesson.beginnerExplanation.code.label" />
        <ul v-if="lesson.beginnerExplanation.code" class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
          <li v-for="(e, i) in lesson.beginnerExplanation.code.explanation" :key="i">{{ e }}</li>
        </ul>
      </section>

      <!-- 6. Technical -->
      <section id="technical" class="card scroll-mt-20 p-5">
        <h2 class="section-title">📐 Technical definition</h2>
        <p class="rounded-lg bg-accent-50 p-3 text-sm leading-relaxed dark:bg-accent-900/20">{{ lesson.technicalDefinition }}</p>
      </section>

      <!-- 7. Internal Working -->
      <section id="internal" class="card scroll-mt-20 p-5">
        <h2 class="section-title">⚙️ Internal working — step by step</h2>
        <ol class="space-y-2 text-sm leading-relaxed">
          <li v-for="(step, i) in lesson.internalWorking" :key="i" class="flex gap-3">
            <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">{{ i + 1 }}</span>
            <span>{{ step }}</span>
          </li>
        </ol>
      </section>

      <!-- 8. Mental Model -->
      <section id="mental-model" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🧠 Visual mental model</h2>
        <pre class="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-emerald-300">{{ lesson.mentalModelDiagram }}</pre>
      </section>

      <!-- 9. Memory -->
      <section v-if="lesson.memoryVisualization" id="memory" class="card scroll-mt-20 p-5">
        <h2 class="section-title">💾 Memory visualization</h2>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li v-for="(m, i) in lesson.memoryVisualization" :key="i">{{ m }}</li>
        </ul>
      </section>

      <!-- 10. Examples -->
      <section id="examples" class="card scroll-mt-20 p-5">
        <h2 class="section-title">💡 Code examples</h2>
        <div class="space-y-5">
          <div v-for="ex in [lesson.examples.basic, lesson.examples.intermediate, lesson.examples.advanced, lesson.examples.realProject]" :key="ex.label">
            <CodeBlock :code="ex.code" :lang="ex.lang" :caption="ex.label" />
            <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
              <li v-for="(e, i) in ex.explanation" :key="i">{{ e }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 11. Questions -->
      <section id="questions" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🎤 Common interview questions</h2>
        <div class="space-y-4">
          <div v-for="(q, i) in lesson.interviewQuestions" :key="i" class="border-l-2 border-slate-200 pl-3 dark:border-slate-700">
            <div class="mb-1 flex items-center gap-2">
              <LevelBadge :level="q.level === 'senior' ? 'expert' : q.level" />
              <p class="text-sm font-semibold">{{ q.question }}</p>
            </div>
            <p class="text-sm leading-relaxed"><span class="font-medium text-emerald-700 dark:text-emerald-400">Answer:</span> {{ q.answer }}</p>
            <p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400"><span class="font-medium">Why:</span> {{ q.explanation }}</p>
          </div>
        </div>
      </section>

      <!-- 12. Follow-ups -->
      <section id="followups" class="card scroll-mt-20 p-5">
        <h2 class="section-title">↪️ Likely follow-up questions</h2>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li v-for="(f, i) in lesson.followUps" :key="i">{{ f }}</li>
        </ul>
      </section>

      <!-- 13. Mistakes -->
      <section id="mistakes" class="card scroll-mt-20 p-5">
        <h2 class="section-title">⚠️ Common mistakes</h2>
        <div class="space-y-3">
          <div v-for="(m, i) in lesson.commonMistakes" :key="i" class="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
            <p class="text-sm font-semibold text-rose-700 dark:text-rose-300">{{ m.mistake }}</p>
            <p class="mt-1 text-sm"><span class="font-medium">Why:</span> {{ m.why }}</p>
            <p class="text-sm"><span class="font-medium text-emerald-700 dark:text-emerald-400">Fix:</span> {{ m.fix }}</p>
          </div>
        </div>
      </section>

      <!-- 14. Production -->
      <section id="production" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🏭 Real production usage</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div v-for="(u, i) in lesson.productionUsage" :key="i" class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <p class="text-sm font-semibold text-accent-700 dark:text-accent-300">{{ u.area }}</p>
            <p class="mt-1 text-sm leading-relaxed">{{ u.detail }}</p>
          </div>
        </div>
      </section>

      <!-- 15. Performance -->
      <section id="performance" class="card scroll-mt-20 p-5">
        <h2 class="section-title">⚡ Performance impact</h2>
        <div class="grid gap-3 md:grid-cols-3">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Good practices</p>
            <ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(p, i) in lesson.performance.good" :key="i">{{ p }}</li></ul>
          </div>
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-600">Bad practices</p>
            <ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(p, i) in lesson.performance.bad" :key="i">{{ p }}</li></ul>
          </div>
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-600">Optimizations</p>
            <ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(p, i) in lesson.performance.optimizations" :key="i">{{ p }}</li></ul>
          </div>
        </div>
      </section>

      <!-- 16. Security -->
      <section v-if="lesson.security" id="security" class="card scroll-mt-20 border-l-4 !border-l-rose-500 p-5">
        <h2 class="section-title">🔒 Security considerations</h2>
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-600">Risks</p>
        <ul class="mb-3 list-disc space-y-1 pl-5 text-sm"><li v-for="(r, i) in lesson.security.risks" :key="i">{{ r }}</li></ul>
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Best practices</p>
        <ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(b, i) in lesson.security.bestPractices" :key="i">{{ b }}</li></ul>
      </section>

      <!-- 17. Related -->
      <section id="related" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🔗 Related concepts</h2>
        <p class="mb-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ lesson.related.dependencyNote }}</p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-sky-600">Learn first</p>
            <div class="flex flex-wrap gap-1.5">
              <RouterLink v-for="p in lesson.related.prerequisites" :key="p" :to="conceptLink(p)" class="badge bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300">← {{ p }}</RouterLink>
            </div>
          </div>
          <div>
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">Next concepts</p>
            <div class="flex flex-wrap gap-1.5">
              <RouterLink v-for="n in lesson.related.nextConcepts" :key="n" :to="conceptLink(n)" class="badge bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300">{{ n }} →</RouterLink>
            </div>
          </div>
        </div>
      </section>

      <!-- 18. Whiteboard -->
      <section id="whiteboard" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🖊️ Whiteboard version (under 2 min)</h2>
        <ol class="mb-3 space-y-1.5 text-sm leading-relaxed">
          <li v-for="(s, i) in lesson.whiteboard.script" :key="i" class="flex gap-2"><span class="font-mono text-xs text-slate-400">{{ i + 1 }}.</span>{{ s }}</li>
        </ol>
        <pre class="overflow-x-auto rounded-lg bg-slate-900 p-4 font-mono text-xs leading-relaxed text-sky-300">{{ lesson.whiteboard.diagram }}</pre>
      </section>

      <!-- 19. 30s -->
      <section id="thirty" class="card scroll-mt-20 border-l-4 !border-l-emerald-500 p-5">
        <h2 class="section-title">⏱️ 30-second revision</h2>
        <p class="text-sm leading-relaxed">{{ lesson.thirtySecond }}</p>
      </section>

      <!-- 20. 2-min -->
      <section id="two-min" class="card scroll-mt-20 border-l-4 !border-l-accent-500 p-5">
        <h2 class="section-title">🗣️ 2-minute interview answer</h2>
        <p class="text-sm leading-relaxed">{{ lesson.twoMinute }}</p>
      </section>

      <!-- 21. Senior -->
      <section id="senior" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🧗 Senior engineer deep dive</h2>
        <div class="grid gap-4 sm:grid-cols-2">
          <div><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Tradeoffs</p><ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(x, i) in lesson.seniorDeepDive.tradeoffs" :key="i">{{ x }}</li></ul></div>
          <div><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Edge cases</p><ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(x, i) in lesson.seniorDeepDive.edgeCases" :key="i">{{ x }}</li></ul></div>
          <div><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Runtime behavior</p><ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(x, i) in lesson.seniorDeepDive.runtimeBehavior" :key="i">{{ x }}</li></ul></div>
          <div><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Scalability</p><ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(x, i) in lesson.seniorDeepDive.scalability" :key="i">{{ x }}</li></ul></div>
          <div class="sm:col-span-2"><p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Production concerns</p><ul class="list-disc space-y-1 pl-5 text-sm"><li v-for="(x, i) in lesson.seniorDeepDive.productionConcerns" :key="i">{{ x }}</li></ul></div>
        </div>
      </section>

      <!-- 22. Cheat Sheet -->
      <section id="cheatsheet" class="card scroll-mt-20 bg-slate-50 p-5 dark:bg-slate-900/40">
        <h2 class="section-title">📋 Cheat sheet</h2>
        <ul class="grid gap-1.5 text-sm sm:grid-cols-2">
          <li v-for="(c, i) in lesson.cheatSheet" :key="i" class="flex gap-2"><span class="text-accent-500">▸</span>{{ c }}</li>
        </ul>
      </section>

      <!-- 23. Exercises -->
      <section id="exercises" class="card scroll-mt-20 p-5">
        <h2 class="section-title">🏋️ Coding exercises</h2>
        <div class="space-y-4">
          <details v-for="(ex, i) in lesson.exercises" :key="i" class="rounded-lg border border-slate-200 p-3 dark:border-slate-800">
            <summary class="cursor-pointer">
              <span class="badge mr-2 capitalize" :class="diffCls[ex.difficulty]">{{ ex.difficulty }}</span>
              <span class="text-sm font-medium">{{ ex.prompt }}</span>
            </summary>
            <p v-if="ex.hint" class="mt-2 text-xs italic text-slate-500">Hint: {{ ex.hint }}</p>
            <div class="mt-2">
              <CodeBlock :code="ex.solution.code" :lang="ex.solution.lang" />
              <ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300"><li v-for="(e, j) in ex.solution.explanation" :key="j">{{ e }}</li></ul>
            </div>
          </details>
        </div>
      </section>

      <!-- 24. Confidence -->
      <section id="confidence" class="card scroll-mt-20 bg-gradient-to-br from-accent-600 to-violet-600 p-5 text-white">
        <h2 class="mb-3 text-lg font-semibold">💪 Confidence booster</h2>
        <p class="mb-2 text-sm leading-relaxed"><strong>Why it matters:</strong> {{ lesson.confidenceBooster.whyImportant }}</p>
        <p class="mb-2 text-sm leading-relaxed"><strong>How companies ask it:</strong> {{ lesson.confidenceBooster.howCompaniesAsk }}</p>
        <p class="text-sm leading-relaxed"><strong>What interviewers expect:</strong> {{ lesson.confidenceBooster.whatInterviewersExpect }}</p>
      </section>
    </article>
    </div>
  </div>
</template>
