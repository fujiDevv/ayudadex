<script setup lang="ts">
import { computed } from 'vue'
import { 
  Star, Clock, Globe, ArrowRight, MapPin, FileText, 
  ChevronUp, ChevronDown, FolderOpen 
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

    <!-- Collapsed / Expanded Content Toggle -->
    <div class="mt-6">
      <motion.button 
        @click="emit('toggle-expansion')" 
        class="w-full py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all active:scale-[0.99] text-slate-700 dark:text-slate-350 cursor-pointer"
        :whileHover="{ scale: 1.01 }"
        :whileTap="{ scale: 0.99 }"
      >
        <span>{{ isExpanded ? $t('card.hide') : $t('card.show') }}</span>
        <ChevronUp v-if="isExpanded" class="w-4 h-4" />
        <ChevronDown v-else class="w-4 h-4" />
      </motion.button>
    </div>

    <!-- Expanded Details Drawer -->
    <div v-if="isExpanded" class="mt-6 space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6 animate-slide-down">
      
      <!-- Quick Info Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 p-4 rounded-xl flex items-center gap-3">
          <Clock class="w-6 h-6 text-slate-400 dark:text-slate-500" />
          <div>
            <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Processing Time</p>
            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">{{ program.processing_time }}</p>
          </div>
        </div>

        <motion.a 
          :href="program.official_url" 
          target="_blank" 
          class="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/50 p-4 rounded-xl flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-colors group/link"
          :whileHover="{ scale: 1.02 }"
          :whileTap="{ scale: 0.98 }"
        >
          <div class="flex items-center gap-3">
            <Globe class="w-6 h-6 text-blue-900 dark:text-blue-400" />
            <div>
              <p class="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">Official Portal</p>
              <p class="text-sm font-bold text-blue-900 dark:text-blue-400">Go to Website</p>
            </div>
          </div>
          <ArrowRight class="w-4 h-4 text-blue-900 dark:text-blue-400 group-hover/link:translate-x-1 transition-transform" />
        </motion.a>
      </div>

      <!-- Left-Right Grid for Steps vs Requirements Checklist -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Application Steps (Timeline) -->
        <div class="space-y-4">
          <h4 class="text-sm font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wide flex items-center gap-2">
            <MapPin class="w-4 h-4" /> {{ $t('card.steps') }}
          </h4>
          <div class="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-5 ml-2 mt-2">
            <div 
              v-for="(step, idx) in $tm(`programs.${program.id}.steps`)" 
              :key="idx" 
              class="relative"
            >
              <!-- Circle Indicator -->
              <span class="absolute -left-[31px] top-0.5 w-4.5 h-4.5 rounded-full bg-blue-900 dark:bg-blue-800 border-4 border-white dark:border-slate-900 flex items-center justify-center"></span>
              <div class="space-y-1">
                <p class="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wide">Step {{ Number(idx) + 1 }}</p>
                <p class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Requirements Checklist -->
        <div class="space-y-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
          <h4 class="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-2 mb-2">
            <FileText class="w-4 h-4" /> {{ $t('card.requirements') }}
          </h4>
          <div class="space-y-3">
            <label 
              v-for="(req, idx) in $tm(`programs.${program.id}.requirements`)" 
              :key="idx" 
              class="flex items-start gap-3 cursor-pointer group/item select-none"
            >
              <input 
                type="checkbox" 
                :checked="checkedRequirements.includes(req)"
                @change="emit('toggle-requirement', req)"
                class="w-5 h-5 text-blue-900 bg-white dark:bg-slate-900 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-900 focus:ring-2 transition-colors cursor-pointer mt-0.5"
              />
              <span 
                class="text-xs sm:text-sm font-medium transition-colors"
                :class="checkedRequirements.includes(req) 
                  ? 'text-slate-400 dark:text-slate-500 line-through' 
                  : 'text-slate-700 dark:text-slate-300 group-hover/item:text-blue-900 dark:group-hover/item:text-blue-400'"
              >
                {{ req }}
              </span>
            </label>
          </div>
        </div>

      </div>

    </div>
  </motion.div>
</template>
