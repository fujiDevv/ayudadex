<script setup lang="ts">
import { computed } from 'vue'
import { 
  Star, FolderOpen 
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import type { Program } from '../types'

const props = defineProps<{
  program: Program
  isSaved: boolean
  isExpanded: boolean
  checkedRequirements: string[]
}>()

const emit = defineEmits<{
  (e: 'toggle-save', event: Event): void
  (e: 'toggle-requirement', requirement: string): void
  (e: 'toggle-expansion'): void
}>()

const checkedCount = computed(() => props.checkedRequirements.length)
const totalCount = computed(() => props.program.requirements.length)
const preparedPercent = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((checkedCount.value / totalCount.value) * 100)
})
</script>

<template>
  <motion.div 
    :id="`program-card-${program.id}`"
    class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700"
    :initial="{ opacity: 0, y: 15 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
    :whileHover="{ y: -3, scale: 1.005 }"
  >
    <!-- Card Header -->
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-2">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase rounded-md tracking-wider border border-blue-200/50 dark:border-blue-900/30">
            {{ program.agency }}
          </span>
          <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider">
            {{ program.category }}
          </span>
        </div>
        <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
          {{ $t(`programs.${program.id}.name`) }}
        </h3>
      </div>

      <!-- Bookmark Button -->
      <motion.button 
        @click="emit('toggle-save', $event)" 
        class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
        :title="isSaved ? $t('card.removeBookmark') : $t('card.bookmark')"
        :aria-label="isSaved ? $t('card.removeBookmark') : $t('card.bookmark')"
        :whileHover="{ scale: 1.15 }"
        :whileTap="{ scale: 0.85 }"
      >
        <Star :class="isSaved ? 'text-yellow-500 fill-current scale-110' : 'text-slate-400 dark:text-slate-500'" class="w-5 h-5 transition-transform" />
      </motion.button>
    </div>

    <!-- Card Body (Description) -->
    <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed font-normal">
      {{ $t(`programs.${program.id}.description`) }}
    </p>

    <!-- Target Audiences Tags -->
    <div class="flex items-center flex-wrap gap-1.5 mt-4">
      <span class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mr-1">For:</span>
      <span 
        v-for="aud in program.target_audience" 
        :key="aud"
        class="text-[10px] font-medium bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 px-2 py-0.5 rounded-md"
      >
        {{ aud }}
      </span>
    </div>

    <!-- Eligibility Checklist Progress Bar -->
    <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
          <FolderOpen class="w-4 h-4" /> {{ $t('card.readiness') }}
        </span>
        <span class="text-xs font-bold text-blue-900 dark:text-blue-400">
          {{ checkedCount }} / {{ totalCount }} ({{ preparedPercent }}%)
        </span>
      </div>
      <!-- Progress Line -->
      <div class="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
        <div 
          class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300" 
          :style="{ width: `${preparedPercent}%` }"
        ></div>
      </div>
    </div>

    <div class="mt-6">
      <motion.button 
        @click="emit('toggle-expansion')" 
        class="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] text-slate-700 dark:text-slate-350 cursor-pointer"
        :whileHover="{ scale: 1.01 }"
        :whileTap="{ scale: 0.99 }"
      >
        <span>{{ $t('card.expand') }}</span>
      </motion.button>
    </div>
  </motion.div>
</template>
