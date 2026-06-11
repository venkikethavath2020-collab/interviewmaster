<script setup lang="ts">
import { computed } from 'vue'
import type { Technology } from '../../types/content'
import ImportanceStars from '../content/ImportanceStars.vue'
import FlowDiagram from '../content/FlowDiagram.vue'
import BookmarkButton from '../content/BookmarkButton.vue'

const props = defineProps<{ tech: Technology }>()

const sorted = computed(() => [...props.tech.keywords].sort((a, b) => b.importance - a.importance))
</script>

<template>
  <div class="grid gap-5">
    <p class="text-sm text-slate-500">
      Must-know terms, sorted by how often interviewers probe them. ⭐⭐⭐⭐⭐ = asked in nearly every interview.
    </p>
    <article v-for="k in sorted" :id="k.id" :key="k.id" class="card scroll-mt-20 p-5">
      <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-3">
          <h2 class="text-lg font-semibold">{{ k.term }}</h2>
          <ImportanceStars :value="k.importance" />
        </div>
        <BookmarkButton :tech-id="tech.id" kind="keyword" :item-id="k.id" :title="k.term" />
      </div>

      <div class="grid gap-4" :class="k.diagram ? 'lg:grid-cols-[1fr_240px]' : ''">
        <div class="space-y-3 text-sm leading-relaxed">
          <p>
            <span class="badge mr-1 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Why interviewers ask</span>
            {{ k.whyAsked }}
          </p>
          <p>
            <span class="badge mr-1 bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">Explanation</span>
            {{ k.explanation }}
          </p>
          <p v-if="k.realWorldExample">
            <span class="badge mr-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">Real world</span>
            {{ k.realWorldExample }}
          </p>
          <div v-if="k.commonMistakes?.length">
            <span class="badge bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">Common mistakes</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(m, i) in k.commonMistakes" :key="i">{{ m }}</li>
            </ul>
          </div>
          <div v-if="k.followUps.length">
            <span class="badge bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Likely follow-ups</span>
            <ul class="mt-1.5 list-disc space-y-1 pl-5">
              <li v-for="(f, i) in k.followUps" :key="i">{{ f }}</li>
            </ul>
          </div>
        </div>
        <FlowDiagram v-if="k.diagram" :steps="k.diagram" :color="tech.color" />
      </div>
    </article>
  </div>
</template>
