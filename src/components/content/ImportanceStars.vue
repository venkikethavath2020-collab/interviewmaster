<script setup lang="ts">
defineProps<{ value: number }>()
</script>

<template>
  <span class="text-xs tracking-tight text-amber-500" :title="`Importance ${value}/5`">
    <span v-for="i in 5" :key="i" :class="i > value ? 'opacity-25' : ''">★</span>
  </span>
</template>
