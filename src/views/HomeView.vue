<script setup lang="ts">
import { techMetas } from '../data'
import { useUserStore } from '../stores/user'

const user = useUserStore()

const modes = [
  { to: '/revision', icon: '⏱', title: 'Revision Mode', desc: '5 / 15 / 30 / 60-minute passes per technology, layered 30s → deep-dive.' },
  { to: '/flashcards', icon: '🃏', title: 'Flashcards', desc: 'Quick recall drills built from every keyword and revision item.' },
  { to: '/mock', icon: '🎤', title: 'Mock Interview', desc: 'Role + difficulty based question drills with self-scoring and follow-ups.' },
  { to: '/last-30', icon: '🔥', title: 'Last 30 Minutes', desc: 'One screen: top questions, weak areas, 5-star concepts. Interview-day mode.' },
  { to: '/companies', icon: '🏢', title: 'Company Bank', desc: 'TCS to FAANG — what each company actually asks, round by round.' },
  { to: '/roadmaps', icon: '🗺', title: 'Roadmaps', desc: 'Beginner → expert paths for frontend, backend, database, AWS and more.' },
]
</script>

<template>
  <div>
    <section class="card mb-8 bg-gradient-to-br from-accent-600 to-violet-600 p-8 text-white dark:from-accent-700 dark:to-violet-800">
      <h1 class="text-3xl font-bold tracking-tight">Revise an entire technology in 15 minutes.</h1>
      <p class="mt-2 max-w-2xl text-sm text-white/85">
        Deep internals, mental models, cheat sheets, real production scenarios and company-specific question banks —
        built for experienced developers walking into product-company interviews.
      </p>
      <div class="mt-4 flex flex-wrap gap-2">
        <RouterLink to="/tech/javascript/overview" class="btn bg-white text-accent-700 hover:bg-slate-100">Start with JavaScript</RouterLink>
        <RouterLink to="/last-30" class="btn bg-white/15 text-white hover:bg-white/25">🔥 Interview today? Last-30 mode</RouterLink>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="section-title">Prep modes</h2>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink v-for="m in modes" :key="m.to" :to="m.to" class="card p-4 transition-shadow hover:shadow-md">
          <p class="text-xl">{{ m.icon }}</p>
          <p class="mt-1 font-semibold">{{ m.title }}</p>
          <p class="mt-1 text-sm text-slate-500">{{ m.desc }}</p>
        </RouterLink>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="section-title">Technologies</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <RouterLink
          v-for="t in techMetas"
          :key="t.id"
          :to="`/tech/${t.id}/overview`"
          class="card flex items-center gap-3 p-3 transition-shadow hover:shadow-md"
        >
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" :style="{ backgroundColor: t.color }">{{ t.icon }}</span>
          <span class="text-sm font-medium">{{ t.name }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="grid gap-4 sm:grid-cols-3">
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.completedCount }}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Topics completed</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.totalRevisions }}</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Revision passes</p>
      </div>
      <div class="card p-4 text-center">
        <p class="text-2xl font-bold text-accent-600">{{ user.accuracy }}%</p>
        <p class="text-xs uppercase tracking-wide text-slate-400">Flashcard accuracy</p>
      </div>
    </section>
  </div>
</template>
