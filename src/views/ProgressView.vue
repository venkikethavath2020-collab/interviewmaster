<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue'
import type { Technology } from '../types/content'
import { loadAllTech, techMetas } from '../data'
import { useUserStore } from '../stores/user'

const user = useUserStore()
const techs = shallowRef<Technology[]>([])

onMounted(async () => {
  techs.value = await loadAllTech()
})

/** Per-tech completion: read refs vs total trackable items (internals + revision). */
const perTech = computed(() =>
  techs.value.map((t) => {
    const total = t.internals.length + t.revision.length
    const done = Object.keys(user.readTopics).filter((ref) => ref.startsWith(`${t.id}/`)).length
    return {
      id: t.id,
      name: t.name,
      color: techMetas.find((m) => m.id === t.id)?.color ?? '#64748b',
      total,
      done: Math.min(done, total),
      pct: total === 0 ? 0 : Math.round((Math.min(done, total) / total) * 100),
      revisions: user.revisionCounts[t.id] ?? 0,
    }
  }),
)
</script>

<template>
  <div>
    <h1 class="mb-1 text-2xl font-bold tracking-tight">Progress</h1>
    <p class="mb-6 text-sm text-slate-500">All stored locally in your browser — no account needed.</p>

    <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.completedCount }}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Topics completed</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.totalRevisions }}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Revision passes</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.mockResults.length }}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Mock interviews</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.mockAccuracy }}%</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Mock accuracy</p>
      </div>
    </div>

    <h2 class="section-title">By technology</h2>
    <div class="grid gap-3">
      <div v-for="t in perTech" :key="t.id" class="card flex items-center gap-4 px-4 py-3">
        <RouterLink :to="`/tech/${t.id}/overview`" class="w-32 shrink-0 text-sm font-medium hover:text-accent-600">{{ t.name }}</RouterLink>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div class="h-full rounded-full transition-all" :style="{ width: `${t.pct}%`, backgroundColor: t.color }" />
        </div>
        <span class="w-20 shrink-0 text-right text-xs text-slate-500">{{ t.done }}/{{ t.total }} · {{ t.pct }}%</span>
        <span class="w-24 shrink-0 text-right text-xs text-slate-400">{{ t.revisions }} revisions</span>
      </div>
    </div>

    <h2 class="section-title mt-8">Recent mock interviews</h2>
    <p v-if="user.mockResults.length === 0" class="card p-6 text-center text-sm text-slate-400">No mock interviews yet — try the 🎤 Mock Interview mode.</p>
    <div v-else class="grid gap-2">
      <div v-for="m in user.mockResults.slice(0, 10)" :key="m.id" class="card flex items-center gap-3 px-4 py-2.5 text-sm">
        <span class="font-medium">{{ m.role }}</span>
        <span class="badge bg-slate-100 capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ m.level }}</span>
        <div class="flex-1" />
        <span class="text-emerald-600">{{ m.correct }} ✓</span>
        <span class="text-amber-600">{{ m.partial }} ~</span>
        <span class="text-rose-600">{{ m.total - m.correct - m.partial }} ✗</span>
        <span class="text-xs text-slate-400">{{ new Date(m.finishedAt).toLocaleDateString() }}</span>
      </div>
    </div>
  </div>
</template>
