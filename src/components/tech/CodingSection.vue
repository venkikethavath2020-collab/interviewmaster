<script setup lang="ts">
import type { Technology } from '../../types/content'
import AccordionItem from '../content/AccordionItem.vue'
import LevelBadge from '../content/LevelBadge.vue'
import CodeBlock from '../content/CodeBlock.vue'
import BookmarkButton from '../content/BookmarkButton.vue'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-4">
    <p class="text-sm text-slate-500">Try solving before expanding — the problem statement is the question you'd get on a shared editor.</p>
    <AccordionItem v-for="q in tech.codingQuestions" :id="q.id" :key="q.id">
      <template #header>
        <div class="flex flex-wrap items-center gap-2">
          <LevelBadge :level="q.level" />
          <span class="text-sm font-semibold">{{ q.title }}</span>
        </div>
        <p class="mt-1 text-xs leading-relaxed text-slate-500">{{ q.problem }}</p>
      </template>
      <div class="space-y-3 text-sm leading-relaxed">
        <div class="flex justify-end">
          <BookmarkButton :tech-id="tech.id" kind="coding" :item-id="q.id" :title="q.title" />
        </div>
        <CodeBlock :code="q.solution.code" :lang="q.solution.lang" :caption="q.solution.caption" />
        <p>{{ q.explanation }}</p>
        <div class="flex flex-wrap gap-2">
          <span class="badge bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Time: {{ q.timeComplexity }}</span>
          <span class="badge bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Space: {{ q.spaceComplexity }}</span>
        </div>
        <div v-if="q.alternatives?.length">
          <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Alternative approaches</span>
          <ul class="mt-1.5 list-disc space-y-1 pl-5">
            <li v-for="(a, i) in q.alternatives" :key="i">{{ a }}</li>
          </ul>
        </div>
      </div>
    </AccordionItem>
  </div>
</template>
