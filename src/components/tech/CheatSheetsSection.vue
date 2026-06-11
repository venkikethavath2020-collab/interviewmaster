<script setup lang="ts">
import type { Technology } from '../../types/content'
import BookmarkButton from '../content/BookmarkButton.vue'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-5">
    <p class="text-sm text-slate-500">One-page quick revision tables. Skim these the morning of the interview.</p>
    <section v-for="sheet in tech.cheatSheets" :id="sheet.id" :key="sheet.id" class="card scroll-mt-20 overflow-hidden">
      <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3 dark:border-slate-800">
        <h2 class="font-semibold">{{ sheet.title }}</h2>
        <BookmarkButton :tech-id="tech.id" kind="cheat-sheet" :item-id="sheet.id" :title="sheet.title" />
      </div>
      <div class="divide-y divide-slate-100 dark:divide-slate-800">
        <div v-for="(row, i) in sheet.rows" :key="i" class="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr]">
          <div class="font-mono text-[13px] font-semibold text-accent-700 dark:text-accent-300">{{ row.concept }}</div>
          <div class="text-sm leading-relaxed">
            {{ row.description }}
            <code v-if="row.code" class="mt-1 block rounded bg-slate-100 px-2 py-1 font-mono text-xs dark:bg-slate-800">{{ row.code }}</code>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
