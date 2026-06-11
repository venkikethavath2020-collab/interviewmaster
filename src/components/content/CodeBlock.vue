<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ code: string; lang?: string; caption?: string }>()
const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <figure class="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
    <div class="flex items-center justify-between bg-slate-100 px-3 py-1.5 dark:bg-slate-900">
      <span class="font-mono text-xs uppercase text-slate-500">{{ lang ?? 'code' }}</span>
      <button class="text-xs text-slate-500 hover:text-accent-600" @click="copy">
        {{ copied ? 'Copied ✓' : 'Copy' }}
      </button>
    </div>
    <pre class="overflow-x-auto bg-slate-50 p-3 text-[13px] leading-relaxed dark:bg-[#0d1320]"><code class="font-mono">{{ code }}</code></pre>
    <figcaption v-if="caption" class="border-t border-slate-200 px-3 py-1.5 text-xs text-slate-500 dark:border-slate-800">
      {{ caption }}
    </figcaption>
  </figure>
</template>
