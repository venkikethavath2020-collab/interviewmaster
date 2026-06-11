<script setup lang="ts">
import { computed, ref } from 'vue'
import type { QuestionLevel, Technology } from '../../types/content'
import AccordionItem from '../content/AccordionItem.vue'
import LevelBadge from '../content/LevelBadge.vue'
import BookmarkButton from '../content/BookmarkButton.vue'

const props = defineProps<{ tech: Technology }>()

const levels: Array<QuestionLevel | 'all'> = ['all', 'beginner', 'intermediate', 'advanced', 'expert']
const filter = ref<QuestionLevel | 'all'>('all')

const order: Record<QuestionLevel, number> = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 }
const filtered = computed(() =>
  [...props.tech.questions]
    .filter((q) => filter.value === 'all' || q.level === filter.value)
    .sort((a, b) => order[a.level] - order[b.level]),
)
</script>

<template>
  <div class="grid gap-4">
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="l in levels"
        :key="l"
        class="btn capitalize"
        :class="filter === l ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
        @click="filter = l"
      >
        {{ l }}
      </button>
    </div>

    <AccordionItem v-for="q in filtered" :id="q.id" :key="q.id">
      <template #header>
        <div class="flex flex-wrap items-center gap-2">
          <LevelBadge :level="q.level" />
          <span class="text-sm font-medium">{{ q.question }}</span>
        </div>
      </template>
      <div class="space-y-3 text-sm leading-relaxed">
        <div class="flex justify-end">
          <BookmarkButton :tech-id="tech.id" kind="question" :item-id="q.id" :title="q.question" />
        </div>
        <p><span class="badge mr-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Expected answer</span> {{ q.answer }}</p>
        <p v-if="q.deepDive"><span class="badge mr-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Deep dive</span> {{ q.deepDive }}</p>
        <p v-if="q.realWorldExample"><span class="badge mr-1 bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">Real world</span> {{ q.realWorldExample }}</p>
        <div v-if="q.followUps.length">
          <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Follow-ups to expect</span>
          <ul class="mt-1.5 list-disc space-y-1 pl-5">
            <li v-for="(f, i) in q.followUps" :key="i">{{ f }}</li>
          </ul>
        </div>
      </div>
    </AccordionItem>
  </div>
</template>
