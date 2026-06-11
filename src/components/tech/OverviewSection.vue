<script setup lang="ts">
import type { Technology } from '../../types/content'

defineProps<{ tech: Technology }>()
</script>

<template>
  <div class="grid gap-4">
    <div class="card p-5">
      <h2 class="section-title">What is it?</h2>
      <p class="text-sm leading-relaxed">{{ tech.overview.what }}</p>
      <h2 class="section-title mt-5">Why was it created?</h2>
      <p class="text-sm leading-relaxed">{{ tech.overview.why }}</p>
    </div>

    <div class="card p-5">
      <h2 class="section-title">Problems it solves</h2>
      <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
        <li v-for="(p, i) in tech.overview.problemsSolved" :key="i">{{ p }}</li>
      </ul>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="card border-l-4 !border-l-emerald-500 p-5">
        <h2 class="section-title text-emerald-700 dark:text-emerald-400">When to use</h2>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li v-for="(p, i) in tech.overview.whenToUse" :key="i">{{ p }}</li>
        </ul>
      </div>
      <div class="card border-l-4 !border-l-rose-500 p-5">
        <h2 class="section-title text-rose-700 dark:text-rose-400">When NOT to use</h2>
        <ul class="list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
          <li v-for="(p, i) in tech.overview.whenNotToUse" :key="i">{{ p }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
