<script setup lang="ts">
import { computed, nextTick, onMounted, ref, shallowRef } from 'vue'
import type { Technology } from '../../types/content'
import type { ConceptLevel, ConceptMap, ConceptNode } from '../../types/knowledge'
import { loadConceptMap } from '../../data/knowledge'
import { lessonSlugs } from '../../data/lessons'
import ImportanceStars from '../content/ImportanceStars.vue'
import BookmarkButton from '../content/BookmarkButton.vue'

const props = defineProps<{ tech: Technology }>()

const map = shallowRef<ConceptMap | null>(null)
const loading = ref(true)
const withLessons = lessonSlugs(props.tech.id)
const levelFilter = ref<ConceptLevel | 'all'>('all')
const mustKnowOnly = ref(false)
const overlookedOnly = ref(false)
const query = ref('')
const expanded = ref<Set<string>>(new Set())

const levels: Array<{ key: ConceptLevel | 'all'; label: string }> = [
  { key: 'all', label: 'All levels' },
  { key: 'beginner', label: 'Beginner' },
  { key: 'intermediate', label: 'Intermediate' },
  { key: 'advanced', label: 'Advanced' },
  { key: 'senior', label: 'Senior' },
  { key: 'expert', label: 'Expert' },
]

const levelCls: Record<ConceptLevel, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  advanced: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  senior: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  expert: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

onMounted(async () => {
  map.value = await loadConceptMap(props.tech.id)
  loading.value = false
  // Deep link: /tech/javascript/knowledge#closure
  const hash = decodeURIComponent(window.location.hash.replace('#', ''))
  if (hash) await openConcept(hash)
})

const bySlug = computed(() => {
  const m = new Map<string, ConceptNode>()
  for (const c of map.value?.concepts ?? []) m.set(c.slug, c)
  return m
})

function matches(c: ConceptNode): boolean {
  if (levelFilter.value !== 'all' && c.level !== levelFilter.value) return false
  if (mustKnowOnly.value && c.interviewFrequency < 4) return false
  if (overlookedOnly.value && !c.overlooked) return false
  const q = query.value.trim().toLowerCase()
  if (q && !c.name.toLowerCase().includes(q) && !c.slug.includes(q) && !c.definition.toLowerCase().includes(q)) return false
  return true
}

const grouped = computed(() => {
  if (!map.value) return []
  return [...map.value.categories]
    .sort((a, b) => a.order - b.order)
    .map((cat) => ({
      ...cat,
      concepts: map.value!.concepts.filter((c) => c.category === cat.slug && matches(c)),
      total: map.value!.concepts.filter((c) => c.category === cat.slug).length,
    }))
    .filter((cat) => cat.concepts.length > 0)
})

const totalShown = computed(() => grouped.value.reduce((n, g) => n + g.concepts.length, 0))
const totalAll = computed(() => map.value?.concepts.length ?? 0)

function toggle(slug: string) {
  const next = new Set(expanded.value)
  if (next.has(slug)) next.delete(slug)
  else next.add(slug)
  expanded.value = next
}

/** Open a concept from a prerequisite/leads-to chip: clear filters if it's hidden, expand, scroll. */
async function openConcept(slug: string) {
  if (!bySlug.value.has(slug)) return
  const c = bySlug.value.get(slug)!
  if (!matches(c)) {
    levelFilter.value = 'all'
    mustKnowOnly.value = false
    overlookedOnly.value = false
    query.value = ''
  }
  expanded.value = new Set(expanded.value).add(slug)
  await nextTick()
  document.getElementById(`concept-${slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}
</script>

<template>
  <div v-if="loading" class="py-16 text-center text-slate-400">Loading knowledge map…</div>

  <div v-else-if="map" class="grid gap-5">
    <div class="card p-4">
      <div class="flex flex-wrap items-center gap-2">
        <input v-model="query" class="input max-w-60" placeholder="Filter concepts…" />
        <div class="flex flex-wrap gap-1">
          <button
            v-for="l in levels"
            :key="l.key"
            class="btn"
            :class="levelFilter === l.key ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
            @click="levelFilter = l.key"
          >
            {{ l.label }}
          </button>
        </div>
        <div class="flex-1" />
        <button
          class="btn"
          :class="mustKnowOnly ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
          @click="mustKnowOnly = !mustKnowOnly"
        >
          ★ Must-know
        </button>
        <button
          class="btn"
          :class="overlookedOnly ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'"
          @click="overlookedOnly = !overlookedOnly"
        >
          💎 Overlooked
        </button>
      </div>
      <p class="mt-2 text-xs text-slate-400">
        {{ totalShown }} of {{ totalAll }} concepts · stars = how often interviewers ask · 💎 = high senior-signal topics most candidates miss
      </p>
    </div>

    <section v-for="cat in grouped" :key="cat.slug" class="card overflow-hidden">
      <div class="border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <div class="flex items-baseline justify-between gap-3">
          <h2 class="font-semibold">{{ cat.title }}</h2>
          <span class="shrink-0 text-xs text-slate-400">{{ cat.concepts.length }}/{{ cat.total }}</span>
        </div>
        <p class="text-xs text-slate-500">{{ cat.description }}</p>
      </div>

      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="c in cat.concepts" :id="`concept-${c.slug}`" :key="c.slug" class="scroll-mt-24">
          <button class="flex w-full cursor-pointer items-center gap-2.5 px-5 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40" @click="toggle(c.slug)">
            <span class="badge capitalize" :class="levelCls[c.level]">{{ c.level }}</span>
            <span class="text-sm font-medium">{{ c.name }}</span>
            <ImportanceStars :value="c.interviewFrequency" />
            <span v-if="c.overlooked" title="Overlooked — high senior signal">💎</span>
            <a
              v-if="withLessons.has(c.slug)"
              :href="`/${tech.id}/${c.slug}`"
              target="_blank"
              rel="noopener"
              class="badge bg-accent-100 text-accent-700 hover:bg-accent-200 dark:bg-accent-900/40 dark:text-accent-300"
              title="Open full mentor lesson in a new tab"
              @click.stop
            >📖 Lesson ↗</a>
            <span class="flex-1" />
            <span class="text-slate-400 transition-transform" :class="expanded.has(c.slug) ? 'rotate-180' : ''">▾</span>
          </button>

          <div v-if="expanded.has(c.slug)" class="border-t border-slate-100 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/30">
            <div class="mb-2 flex items-start justify-between gap-3">
              <p class="text-sm font-medium text-accent-700 dark:text-accent-300">{{ c.definition }}</p>
              <BookmarkButton :tech-id="tech.id" kind="concept" :item-id="c.slug" :title="c.name" />
            </div>

            <a
              v-if="withLessons.has(c.slug)"
              :href="`/${tech.id}/${c.slug}`"
              target="_blank"
              rel="noopener"
              class="btn-primary mb-3"
            >
              📖 Open full lesson in new tab — child-level to senior mastery ↗
            </a>

            <div class="space-y-2 text-sm leading-relaxed">
              <p v-for="(e, i) in c.explanation" :key="i">{{ e }}</p>
            </div>

            <div class="mt-3 flex flex-wrap gap-2 text-xs">
              <span class="badge bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Importance {{ c.importance }}/5</span>
              <span class="badge bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Interview {{ c.interviewFrequency }}/5</span>
              <span class="badge bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Real-world {{ c.realWorldUsage }}/5</span>
            </div>

            <div v-if="c.prerequisites.length" class="mt-3">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Learn first</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="p in c.prerequisites"
                  :key="p"
                  class="badge cursor-pointer bg-sky-100 text-sky-700 hover:bg-sky-200 dark:bg-sky-900/40 dark:text-sky-300"
                  @click="openConcept(p)"
                >
                  ← {{ bySlug.get(p)?.name ?? p }}
                </button>
              </div>
            </div>

            <div v-if="c.leadsTo.length" class="mt-2">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Unlocks</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="l in c.leadsTo"
                  :key="l"
                  class="badge cursor-pointer bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300"
                  @click="openConcept(l)"
                >
                  {{ bySlug.get(l)?.name ?? l }} →
                </button>
              </div>
            </div>

            <div v-if="c.questions.length" class="mt-3 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Interview questions</p>
              <ul class="list-disc space-y-1 pl-5 text-sm">
                <li v-for="(q, i) in c.questions" :key="i">{{ q }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
