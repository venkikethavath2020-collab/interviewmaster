<script setup lang="ts">
import { computed, ref } from 'vue'
import { companies } from '../data/companies'
import AccordionItem from '../components/content/AccordionItem.vue'

const filter = ref<'all' | 'service' | 'product' | 'startup' | 'faang'>('all')

const cats = [
  { value: 'all', label: 'All' },
  { value: 'service', label: 'Service (TCS, Infosys…)' },
  { value: 'product', label: 'Product (Zoho, Flipkart…)' },
  { value: 'faang', label: 'FAANG' },
  { value: 'startup', label: 'Startups' },
] as const

const filtered = computed(() =>
  companies.filter((c) => filter.value === 'all' || c.category === filter.value),
)
</script>

<template>
  <div>
    <h1 class="mb-1 text-2xl font-bold tracking-tight">Company Question Bank</h1>
    <p class="mb-5 text-sm text-slate-500">What each company actually asks — technical, coding, HR and managerial rounds, with difficulty.</p>

    <div class="mb-5 flex flex-wrap gap-1.5">
      <button
        v-for="c in cats"
        :key="c.value"
        class="btn"
        :class="filter === c.value ? 'bg-accent-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'"
        @click="filter = c.value"
      >
        {{ c.label }}
      </button>
    </div>

    <div class="grid gap-3">
      <AccordionItem v-for="c in filtered" :key="c.id" :id="c.id">
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <span class="font-semibold">{{ c.name }}</span>
            <span class="badge bg-slate-100 capitalize text-slate-500 dark:bg-slate-800 dark:text-slate-400">{{ c.category }}</span>
            <span class="text-xs text-amber-500" :title="`Difficulty ${c.difficulty}/5`">
              <span v-for="i in 5" :key="i" :class="i > c.difficulty ? 'opacity-25' : ''">★</span>
            </span>
          </div>
          <p class="mt-1 text-xs text-slate-500">{{ c.notes }}</p>
        </template>

        <div class="grid gap-4 text-sm leading-relaxed md:grid-cols-2">
          <div>
            <p class="badge mb-1.5 bg-accent-100 text-accent-700 dark:bg-accent-900/40 dark:text-accent-300">Technical questions</p>
            <ul class="list-disc space-y-1 pl-5">
              <li v-for="(q, i) in c.technicalQuestions" :key="i">{{ q }}</li>
            </ul>
          </div>
          <div class="space-y-4">
            <div>
              <p class="badge mb-1.5 bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">Coding rounds</p>
              <ul class="list-disc space-y-1 pl-5">
                <li v-for="(q, i) in c.codingQuestions" :key="i">{{ q }}</li>
              </ul>
            </div>
            <div>
              <p class="badge mb-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">HR round</p>
              <ul class="list-disc space-y-1 pl-5">
                <li v-for="(q, i) in c.hrQuestions" :key="i">{{ q }}</li>
              </ul>
            </div>
            <div>
              <p class="badge mb-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Managerial round</p>
              <ul class="list-disc space-y-1 pl-5">
                <li v-for="(q, i) in c.managerialQuestions" :key="i">{{ q }}</li>
              </ul>
            </div>
          </div>
        </div>
      </AccordionItem>
    </div>
  </div>
</template>
