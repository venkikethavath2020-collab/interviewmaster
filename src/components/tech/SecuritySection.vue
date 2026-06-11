<script setup lang="ts">
import type { Technology } from '../../types/content'
import BookmarkButton from '../content/BookmarkButton.vue'
import FlowDiagram from '../content/FlowDiagram.vue'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-5">
    <p class="text-sm text-slate-500">
      For every attack: how it works, what it costs, and how you defend. Interviews reward naming the mitigation header/API precisely.
    </p>
    <article v-for="s in tech.securityTopics ?? []" :id="s.id" :key="s.id" class="card scroll-mt-20 p-5">
      <div class="mb-3 flex items-start justify-between gap-3">
        <h2 class="text-lg font-semibold">{{ s.title }}</h2>
        <BookmarkButton :tech-id="tech.id" kind="security" :item-id="s.id" :title="s.title" />
      </div>

      <div class="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div class="space-y-3 text-sm leading-relaxed">
          <p>
            <span class="badge mr-1 bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Attack example</span>
            {{ s.attackExample }}
          </p>
          <p>
            <span class="badge mr-1 bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">Impact</span>
            {{ s.impact }}
          </p>
          <div>
            <span class="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Mitigation</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(m, i) in s.mitigation" :key="i">{{ m }}</li>
            </ul>
          </div>
          <div>
            <span class="badge bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Best practices</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(b, i) in s.bestPractices" :key="i">{{ b }}</li>
            </ul>
          </div>
          <div>
            <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Interview questions</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(q, i) in s.questions" :key="i">{{ q }}</li>
            </ul>
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">How the attack works</p>
          <FlowDiagram :steps="s.howItWorks" color="#e11d48" />
        </div>
      </div>
    </article>
  </div>
</template>
