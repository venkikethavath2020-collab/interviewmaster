<script setup lang="ts">
import type { QuestionLevel } from '../../types/content'

defineProps<{ level: QuestionLevel }>()

const cls: Record<QuestionLevel, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  advanced: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  expert: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}
</script>

<template>
  <span class="badge capitalize" :class="cls[level]">{{ level }}</span>
</template>
