<script setup lang="ts">
defineProps<{ steps: string[]; color?: string }>()
</script>

<template>
  <div class="flex flex-col items-stretch gap-0">
    <template v-for="(step, i) in steps" :key="i">
      <div
        class="rounded-lg border px-3 py-2 text-center text-sm font-medium"
        :style="{
          borderColor: (color ?? '#3b82f6') + '55',
          backgroundColor: (color ?? '#3b82f6') + '14',
        }"
      >
        {{ step }}
      </div>
      <div v-if="i < steps.length - 1" class="flex justify-center py-0.5 text-slate-400">↓</div>
    </template>
  </div>
</template>
