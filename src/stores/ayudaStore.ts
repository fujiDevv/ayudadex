import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import programsData from '../data/programs.json'
import type { Program } from '../types'

export const useAyudaStore = defineStore('ayuda', () => {
  // Shared global state using useStorage for persistence
  const savedPrograms = useStorage<string[]>('ayudadex_saved', [])
  const checkedRequirements = useStorage<Record<string, string[]>>('ayudadex_checked_reqs', {})
  const isLargeText = useStorage<boolean>('ayudadex_large_text', false)

  const toggleLargeText = () => {
    isLargeText.value = !isLargeText.value
  }

  const toggleSaveProgram = (id: string, event?: Event) => {
    if (event) event.stopPropagation()
    const idx = savedPrograms.value.indexOf(id)
    if (idx > -1) {
      savedPrograms.value.splice(idx, 1)
    } else {
      savedPrograms.value.push(id)
    }
  }

  const toggleRequirement = (programId: string, req: string) => {
    if (!checkedRequirements.value[programId]) {
      checkedRequirements.value[programId] = []
    }

    const reqList = checkedRequirements.value[programId]
    const idx = reqList.indexOf(req)
    if (idx > -1) {
      reqList.splice(idx, 1)
    } else {
      reqList.push(req)
    }

    // Clean up empty lists to keep localStorage small
    if (reqList.length === 0) {
      delete checkedRequirements.value[programId]
    }
  }

  const getCheckedCount = (programId: string) => {
    return checkedRequirements.value[programId]?.length || 0
  }

  const getPreparedPercent = (program: Program) => {
    const total = program.requirements.length
    if (total === 0) return 0
    const checked = getCheckedCount(program.id)
    return Math.round((checked / total) * 100)
  }

  const shortlistedPrograms = computed<Program[]>(() => {
    return (programsData as Program[]).filter(p => savedPrograms.value.includes(p.id))
  })

  return {
    savedPrograms,
    checkedRequirements,
    toggleSaveProgram,
    toggleRequirement,
    getCheckedCount,
    getPreparedPercent,
    shortlistedPrograms,
    isLargeText,
    toggleLargeText
  }
})
