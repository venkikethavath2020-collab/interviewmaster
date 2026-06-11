<script setup lang="ts">
import type { Technology } from '../../types/content'
import BookmarkButton from '../content/BookmarkButton.vue'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-5">
    <p class="text-sm text-slate-500">
      Real production problems — interviewers love these. Answer with a structured, step-by-step process, not a single tool name.
    </p>
    <article v-for="s in tech.scenarios" :id="s.id" :key="s.id" class="card scroll-mt-20 p-5">
      <div class="mb-1 flex items-start justify-between gap-3">
        <h2 class="text-lg font-semibold">{{ s.title }}</h2>
        <BookmarkButton :tech-id="tech.id" kind="scenario" :item-id="s.id" :title="s.title" />
      </div>
      <p class="mb-4 text-sm italic text-slate-500">{{ s.situation }}</p>
      <ol class="space-y-2 text-sm leading-relaxed">
        <li v-for="(step, i) in s.approach" :key="i" class="flex gap-3">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-100 text-xs font-bold text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">{{ i + 1 }}</span>
          <span>{{ step }}</span>
        </li>
      </ol>
      <div class="mt-4 rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
        <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">Key takeaways</p>
        <ul class="list-disc space-y-1 pl-5 text-sm">
          <li v-for="(k, i) in s.keyTakeaways" :key="i">{{ k }}</li>
        </ul>
      </div>
    </article>
  </div>
</template>
