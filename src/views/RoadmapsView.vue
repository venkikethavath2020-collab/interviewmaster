<script setup lang="ts">
import { computed, ref } from 'vue'
import { roadmaps } from '../data/roadmaps'

const activeId = ref(roadmaps[0]?.id ?? '')
const active = computed(() => roadmaps.find((r) => r.id === activeId.value))

const levels = [
  { key: 'beginner', label: 'Beginner', cls: 'border-l-emerald-500', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  { key: 'intermediate', label: 'Intermediate', cls: 'border-l-sky-500', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
  { key: 'advanced', label: 'Advanced', cls: 'border-l-violet-500', badge: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { key: 'expert', label: 'Expert', cls: 'border-l-rose-500', badge: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300' },
] as const
</script>

<template>
  <div>
    <h1 class="mb-1 text-2xl font-bold tracking-tight">Roadmaps</h1>
    <p class="mb-5 text-sm text-slate-500">Ordered learning paths from beginner to expert for every track.</p>

    <div class="mb-6 flex flex-wrap gap-1.5">
      <button
        v-for="r in roadmaps"
        :key="r.id"
        class="btn"
        :class="activeId === r.id ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
        @click="activeId = r.id"
      >
        {{ r.title }}
      </button>
    </div>

    <div v-if="active" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <section v-for="l in levels" :key="l.key" class="card border-l-4 p-4" :class="l.cls">
        <span class="badge mb-3" :class="l.badge">{{ l.label }}</span>
        <ol class="space-y-2">
          <li v-for="(topic, i) in active.levels[l.key]" :key="i" class="flex gap-2 text-sm leading-relaxed">
            <span class="shrink-0 font-mono text-xs text-slate-400">{{ i + 1 }}.</span>
            {{ topic }}
          </li>
        </ol>
      </section>
    </div>
  </div>
</template>
