<script setup lang="ts">
import { computed } from 'vue'
import { 
  Star, FolderOpen, Heart, Coins, GraduationCap, Home, Briefcase, Users, CheckCircle2
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import type { Program } from '../types'

const props = defineProps<{
  program: Program
  isSaved: boolean
  isExpanded: boolean
  checkedRequirements: string[]
  viewMode?: 'grid' | 'list'
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

const viewMode = computed(() => props.viewMode || 'grid')

const getAgencyStyles = (agency: string) => {
  const normalized = agency.toLowerCase()
  if (normalized.includes('dswd')) {
    return 'bg-orange-500/10 sm:bg-gradient-to-r sm:from-orange-500/10 sm:to-red-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-900/30'
  }
  if (normalized.includes('sss')) {
    return 'bg-blue-600/10 sm:bg-gradient-to-r sm:from-blue-600/10 sm:to-indigo-600/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30'
  }
  if (normalized.includes('philhealth')) {
    return 'bg-green-500/10 sm:bg-gradient-to-r sm:from-green-500/10 sm:to-emerald-500/10 text-green-700 dark:text-emerald-300 border-green-200/50 dark:border-green-900/30'
  }
  if (normalized.includes('pag-ibig') || normalized.includes('hdmf')) {
    return 'bg-amber-500/10 sm:bg-gradient-to-r sm:from-amber-500/10 sm:to-yellow-500/10 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30'
  }
  if (normalized.includes('gsis')) {
    return 'bg-teal-500/10 sm:bg-gradient-to-r sm:from-teal-500/10 sm:to-cyan-500/10 text-teal-700 dark:text-teal-300 border-teal-200/50 dark:border-teal-900/30'
  }
  if (normalized.includes('dole')) {
    return 'bg-indigo-500/10 sm:bg-gradient-to-r sm:from-indigo-500/10 sm:to-purple-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/30'
  }
  if (normalized.includes('doh')) {
    return 'bg-rose-500/10 sm:bg-gradient-to-r sm:from-rose-500/10 sm:to-red-500/10 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-900/30'
  }
  if (normalized.includes('owwa')) {
    return 'bg-violet-500/10 sm:bg-gradient-to-r sm:from-violet-500/10 sm:to-fuchsia-500/10 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-900/30'
  }
  if (normalized.includes('ched') || normalized.includes('unifast')) {
    return 'bg-sky-500/10 sm:bg-gradient-to-r sm:from-sky-500/10 sm:to-blue-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-900/30'
  }
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
}

const getCategoryIcon = (category: string) => {
  const norm = category.toLowerCase()
  if (norm.includes('health') || norm.includes('medical') || norm.includes('doh')) return Heart
  if (norm.includes('financial') || norm.includes('cash') || norm.includes('loan') || norm.includes('pension')) return Coins
  if (norm.includes('education') || norm.includes('scholarship') || norm.includes('student')) return GraduationCap
  if (norm.includes('housing') || norm.includes('property')) return Home
  if (norm.includes('employment') || norm.includes('livelihood') || norm.includes('work')) return Briefcase
  return Users
}
</script>

<template>
  <motion.div 
    :id="`program-card-${program.id}`"
    class="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-2xl"
    :class="[
      viewMode === 'list' 
        ? 'flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 dark:hover:border-slate-700' 
        : 'flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)]'
    ]"
    :initial="{ opacity: 0, y: 15 }"
    :animate="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.3 }"
    :whileHover="{ y: -4, scale: 1.008 }"
  >
    <!-- List Layout -->
    <div v-if="viewMode === 'list'" class="flex flex-col md:flex-row md:items-center justify-between w-full gap-4 sm:gap-6">
      <div class="space-y-3 flex-grow md:max-w-[65%]">
        <div class="flex items-center gap-2 flex-wrap">
          <span :class="getAgencyStyles(program.agency)" class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border">
            {{ program.agency }}
          </span>
          <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1">
            <component :is="getCategoryIcon(program.category)" class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            {{ program.category }}
          </span>
        </div>
        
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
          {{ $t(`programs.${program.id}.name`) }}
        </h3>
        
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {{ $t(`programs.${program.id}.description`) }}
        </p>

        <!-- Target Audiences Tags -->
        <div class="flex items-center flex-wrap gap-1.5 pt-1">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mr-1">For:</span>
          <span 
            v-for="aud in program.target_audience" 
            :key="aud"
            class="text-[9px] font-semibold bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/80 px-2 py-0.5 rounded-md"
          >
            {{ aud }}
          </span>
        </div>
      </div>

      <!-- Right Column: Progress and Button -->
      <div class="flex flex-col items-stretch gap-3 w-full md:w-[220px] shrink-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800/80 md:pl-6">
        <!-- Bookmark & Readiness Count -->
        <div class="flex items-center justify-between gap-4 w-full">
          <div class="flex flex-col text-left">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{{ $t('card.readiness') }}</span>
            <span class="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 v-if="preparedPercent === 100" class="w-3.5 h-3.5 text-emerald-500" />
              {{ checkedCount }} / {{ totalCount }} ({{ preparedPercent }}%)
            </span>
          </div>

          <motion.button 
            @click="emit('toggle-save', $event)" 
            class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
            :title="isSaved ? $t('card.removeBookmark') : $t('card.bookmark')"
            :aria-label="(isSaved ? $t('card.removeBookmark') : $t('card.bookmark')) + ' ' + $t(`programs.${program.id}.name`)"
            :aria-pressed="isSaved"
            :whileHover="{ scale: 1.1 }"
            :whileTap="{ scale: 0.9 }"
          >
            <Star :class="isSaved ? 'text-yellow-500 fill-current' : 'text-slate-400 dark:text-slate-500'" class="w-4 h-4" />
          </motion.button>
        </div>

        <!-- Progress Line -->
        <div class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-800/30">
          <div 
            class="h-full transition-all duration-300"
            :class="[preparedPercent === 100 ? 'bg-emerald-500 sm:bg-gradient-to-r sm:from-emerald-500 sm:to-teal-500' : 'bg-blue-600 sm:bg-gradient-to-r sm:from-blue-600 sm:to-indigo-600']"
            :style="{ width: `${preparedPercent}%` }"
          ></div>
        </div>

        <motion.button 
          @click="emit('toggle-expansion')" 
          :aria-expanded="isExpanded"
          class="w-full py-2.5 bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-blue-500/10"
          :whileHover="{ scale: 1.01 }"
          :whileTap="{ scale: 0.99 }"
        >
          <span>{{ $t('card.expand') }}</span>
        </motion.button>
      </div>
    </div>

    <!-- Grid Layout -->
    <div v-else class="flex flex-col h-full justify-between gap-5 w-full">
      <div class="space-y-4">
        <!-- Tags & Bookmark -->
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-center gap-2 flex-wrap">
            <span :class="getAgencyStyles(program.agency)" class="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md tracking-wider border">
              {{ program.agency }}
            </span>
            <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider flex items-center gap-1">
              <component :is="getCategoryIcon(program.category)" class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              {{ program.category }}
            </span>
          </div>

          <motion.button 
            @click="emit('toggle-save', $event)" 
            class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 cursor-pointer"
            :title="isSaved ? $t('card.removeBookmark') : $t('card.bookmark')"
            :aria-label="(isSaved ? $t('card.removeBookmark') : $t('card.bookmark')) + ' ' + $t(`programs.${program.id}.name`)"
            :aria-pressed="isSaved"
            :whileHover="{ scale: 1.15 }"
            :whileTap="{ scale: 0.85 }"
          >
            <Star :class="isSaved ? 'text-yellow-500 fill-current scale-110' : 'text-slate-400 dark:text-slate-500'" class="w-4.5 h-4.5 transition-transform" />
          </motion.button>
        </div>

        <!-- Title -->
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight text-left">
          {{ $t(`programs.${program.id}.name`) }}
        </h3>

        <!-- Description -->
        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-3 text-left">
          {{ $t(`programs.${program.id}.description`) }}
        </p>

        <!-- Target Audiences Tags -->
        <div class="flex items-center flex-wrap gap-1.5 pt-1">
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mr-1">For:</span>
          <span 
            v-for="aud in program.target_audience" 
            :key="aud"
            class="text-[9px] font-semibold bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800 px-2 py-0.5 rounded-md"
          >
            {{ aud }}
          </span>
        </div>
      </div>

      <!-- Eligibility Check Progress Bar -->
      <div class="space-y-4 border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto">
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide flex items-center gap-1">
              <FolderOpen class="w-3.5 h-3.5" /> {{ $t('card.readiness') }}
            </span>
            <span class="text-xs font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <CheckCircle2 v-if="preparedPercent === 100" class="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              {{ checkedCount }} / {{ totalCount }} ({{ preparedPercent }}%)
            </span>
          </div>
          <!-- Progress Line -->
          <div class="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200/30 dark:border-slate-800/30">
            <div 
              class="h-full transition-all duration-300" 
              :class="[preparedPercent === 100 ? 'bg-emerald-500 sm:bg-gradient-to-r sm:from-emerald-500 sm:to-teal-500' : 'bg-blue-600 sm:bg-gradient-to-r sm:from-blue-600 sm:to-indigo-600']"
              :style="{ width: `${preparedPercent}%` }"
            ></div>
          </div>
        </div>

        <motion.button 
          @click="emit('toggle-expansion')" 
          :aria-expanded="isExpanded"
          class="w-full py-2.5 bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-sm shadow-blue-500/10"
          :whileHover="{ scale: 1.01 }"
          :whileTap="{ scale: 0.99 }"
        >
          <span>{{ $t('card.expand') }}</span>
        </motion.button>
      </div>
    </div>
  </motion.div>
</template>

