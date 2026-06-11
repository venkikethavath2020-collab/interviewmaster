<script setup lang="ts">
import type { Technology } from '../../types/content'
import FlowDiagram from '../content/FlowDiagram.vue'
import BookmarkButton from '../content/BookmarkButton.vue'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-5">
    <p class="text-sm text-slate-500">
      Intuition over memorization: what happens internally, why, and what would break without it. Walk the diagram out loud — that IS the interview answer.
    </p>
    <article v-for="m in tech.mentalModels" :id="m.id" :key="m.id" class="card scroll-mt-20 p-5">
      <div class="mb-3 flex items-start justify-between gap-3">
        <h2 class="text-lg font-semibold">{{ m.title }}</h2>
        <BookmarkButton :tech-id="tech.id" kind="mental-model" :item-id="m.id" :title="m.title" />
      </div>
      <div class="grid gap-5 lg:grid-cols-[260px_1fr]">
        <FlowDiagram :steps="m.flow" :color="tech.color" />
        <div class="space-y-3 text-sm leading-relaxed">
          <p v-for="(e, i) in m.explanation" :key="i">{{ e }}</p>
          <div class="rounded-lg bg-rose-50 p-3 dark:bg-rose-900/20">
            <p class="text-xs font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-300">What would break without it</p>
            <p class="mt-1">{{ m.whatBreaksWithoutIt }}</p>
          </div>
          <div class="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
            <p class="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">How to use it in the interview</p>
            <p class="mt-1">{{ m.interviewTip }}</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>
