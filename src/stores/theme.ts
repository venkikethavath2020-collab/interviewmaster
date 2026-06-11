import { defineStore } from 'pinia'
import { useDark, useToggle } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useDark({
    selector: 'html',
    storageKey: 'im-theme',
  })
  const toggle = useToggle(isDark)
  return { isDark, toggle }
})
