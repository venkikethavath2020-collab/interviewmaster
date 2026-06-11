<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue'
import type { Keyword, RevisionItem, Technology } from '../types/content'
import { loadAllTech, techMetas } from '../data'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const techs = shallowRef<Technology[]>([])
const techFilter = ref<string>('all')
const expanded = ref<string | null>(null)

onMounted(async () => {
  techs.value = await loadAllTech()
})

const scoped = computed(() =>
  techFilter.value === 'all' ? techs.value : techs.value.filter((t) => t.id === techFilter.value),
)

/** ⭐⭐⭐⭐⭐ keywords across the selected scope — the most-asked concepts. */
const topKeywords = computed<Array<Keyword & { techId: string; techName: string }>>(() =>
  scoped.value
    .flatMap((t) => t.keywords.map((k) => ({ ...k, techId: t.id, techName: t.name })))
    .filter((k) => k.importance === 5)
    .slice(0, 20),
)

/** Top revision items (importance 5) as the "Top 20 questions" stand-in with layered answers. */
const topRevision = computed<Array<RevisionItem & { techId: string; techName: string }>>(() =>
  scoped.value
    .flatMap((t) => t.revision.map((r) => ({ ...r, techId: t.id, techName: t.name })))
    .filter((r) => r.importance >= 5)
    .slice(0, 20),
)

const weak = computed(() =>
  user.weakAreas.filter((b) => techFilter.value === 'all' || b.techId === techFilter.value),
)
</script>

<template>
  <div>
    <div class="mb-5 flex flex-wrap items-center gap-3">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">🔥 Last 30 Minutes</h1>
        <p class="text-sm text-slate-500">Maximum recall, minimum time. Highest-frequency concepts + your weak areas, one screen.</p>
      </div>
      <div class="flex-1" />
      <select v-model="techFilter" class="input max-w-52">
        <option value="all">All technologies</option>
        <option v-for="t in techMetas" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
    </div>

    <div class="grid gap-5 lg:grid-cols-3">
      <!-- Weak areas -->
      <section class="card border-l-4 !border-l-rose-500 p-4">
        <h2 class="mb-2 font-semibold text-rose-700 dark:text-rose-400">Your weak areas</h2>
        <p v-if="weak.length === 0" class="text-sm text-slate-400">None marked. While studying, set bookmarks to “Weak Area” and they surface here.</p>
        <ul class="space-y-1.5">
          <li v-for="b in weak.slice(0, 12)" :key="b.ref">
            <RouterLink :to="`/tech/${b.techId}/overview`" class="text-sm hover:text-accent-600">
              <span class="font-medium">{{ b.title }}</span>
              <span class="text-xs text-slate-400"> · {{ b.techId }}</span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <!-- Confidence notes -->
      <section class="card border-l-4 !border-l-emerald-500 p-4">
        <h2 class="mb-2 font-semibold text-emerald-700 dark:text-emerald-400">Confidence boosters</h2>
        <ul class="space-y-2 text-sm leading-relaxed">
          <li>You don't need to know everything — you need to explain what you know <em>clearly</em>.</li>
          <li>Structure every answer: definition → why it exists → real example → tradeoff.</li>
          <li>"I'd verify that with a quick test" is a senior answer, not a weakness.</li>
          <li>If stuck, narrate your mental model — interviewers grade thinking, not recall.</li>
          <li>Slow down. A 5-second pause reads as thoughtful, not unprepared.</li>
        </ul>
      </section>

      <!-- Recent learnings / forgotten -->
      <section class="card border-l-4 !border-l-amber-500 p-4">
        <h2 class="mb-2 font-semibold text-amber-700 dark:text-amber-400">Your notes & frequent misses</h2>
        <p v-if="user.notes.length === 0" class="text-sm text-slate-400">Notes tagged “Keep Forgetting” or “Mistake Made” show up here.</p>
        <ul class="space-y-1.5">
          <li v-for="n in user.notes.filter(n => n.tag === 'forgotten' || n.tag === 'mistake').slice(0, 8)" :key="n.id" class="text-sm">
            <span class="font-medium">{{ n.title }}</span>
            <p class="text-xs text-slate-500">{{ n.body.slice(0, 100) }}</p>
          </li>
        </ul>
      </section>
    </div>

    <!-- Top concepts -->
    <h2 class="section-title mt-7">⭐⭐⭐⭐⭐ Most-asked concepts — tap to recall, tap to verify</h2>
    <div class="grid gap-2 sm:grid-cols-2">
      <div v-for="k in topKeywords" :key="`${k.techId}-${k.id}`" class="card overflow-hidden">
        <button class="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left" @click="expanded = expanded === `${k.techId}-${k.id}` ? null : `${k.techId}-${k.id}`">
          <span class="badge shrink-0 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ k.techName }}</span>
          <span class="flex-1 text-sm font-semibold">{{ k.term }}</span>
          <span class="text-slate-400">{{ expanded === `${k.techId}-${k.id}` ? '−' : '+' }}</span>
        </button>
        <p v-if="expanded === `${k.techId}-${k.id}`" class="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed dark:border-slate-800">
          {{ k.explanation }}
        </p>
      </div>
    </div>

    <h2 class="section-title mt-7">Top rapid-fire answers (30-second versions)</h2>
    <div class="grid gap-2 sm:grid-cols-2">
      <div v-for="r in topRevision" :key="`${r.techId}-${r.id}`" class="card overflow-hidden">
        <button class="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left" @click="expanded = expanded === `r-${r.techId}-${r.id}` ? null : `r-${r.techId}-${r.id}`">
          <span class="badge shrink-0 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ r.techName }}</span>
          <span class="flex-1 text-sm font-semibold">{{ r.topic }}</span>
          <span class="text-slate-400">{{ expanded === `r-${r.techId}-${r.id}` ? '−' : '+' }}</span>
        </button>
        <p v-if="expanded === `r-${r.techId}-${r.id}`" class="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed dark:border-slate-800">
          {{ r.thirtySecond }}
        </p>
      </div>
    </div>
  </div>
</template>
