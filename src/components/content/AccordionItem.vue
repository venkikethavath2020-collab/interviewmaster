<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ id?: string }>()
const open = ref(false)
</script>

<template>
  <div :id="id" class="card scroll-mt-20 overflow-hidden">
    <button
      class="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
      @click="open = !open"
    >
      <div class="min-w-0 flex-1">
        <slot name="header" />
      </div>
      <span class="text-slate-400 transition-transform" :class="open ? 'rotate-180' : ''">▾</span>
    </button>
    <div v-if="open" class="border-t border-slate-100 px-4 py-4 dark:border-slate-800">
      <slot />
    </div>
  </div>
</template>
