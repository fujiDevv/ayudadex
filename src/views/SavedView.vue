<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Star } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useAyudaState } from '../composables/useAyudaState'

const router = useRouter()
const { shortlistedPrograms, getCheckedCount, getPreparedPercent, toggleSaveProgram } = useAyudaState()

const goToProgram = (id: string) => router.push(`/program/${id}`)
const browseDirectory = () => router.push('/')
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6">
      <div class="text-left mb-8 max-w-2xl">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
          <Star class="w-8 h-8 text-yellow-500 fill-current" /> {{ $t('shortlist.title') }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          {{ $t('shortlist.desc') }}
        </p>
      </div>

      <div v-if="shortlistedPrograms.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl max-w-2xl mx-auto">
        <Star class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">{{ $t('shortlist.noBookmarks') }}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto px-4">{{ $t('shortlist.noBookmarksDesc') }}</p>
        <motion.button @click="browseDirectory" class="mt-4 px-5 py-2.5 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          :whileHover="{ scale: 1.04 }" :whileTap="{ scale: 0.96 }">
          {{ $t('shortlist.browse') }}
        </motion.button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div v-for="program in shortlistedPrograms" :key="program.id"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative transition-all duration-300 hover:shadow-sm"
          :initial="{ opacity: 0, y: 15 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.3 }" :whileHover="{ y: -3, scale: 1.005 }">
          <div class="flex items-start justify-between gap-4">
            <div>
              <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 text-[9px] font-bold uppercase rounded-md tracking-wider border border-blue-200/50 dark:border-blue-900/30">
                {{ program.agency }}
              </span>
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{{ program.name }}</h3>
            </div>
            <motion.button @click="toggleSaveProgram(program.id, $event)" class="hover:text-slate-400 dark:hover:text-slate-500 transition-colors p-1 cursor-pointer"
              :title="$t('card.removeBookmark')" :whileHover="{ scale: 1.2 }" :whileTap="{ scale: 0.8 }">
              <Star class="w-5 h-5 text-yellow-500 fill-current" />
            </motion.button>
          </div>

          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{{ program.description }}</p>

          <div class="mt-4">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{{ $t('card.readiness') }}</span>
              <span class="text-[10px] font-bold text-blue-900 dark:text-blue-400">
                {{ getCheckedCount(program.id) }} / {{ program.requirements.length }} ({{ getPreparedPercent(program) }}%)
              </span>
            </div>
            <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <div class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300" :style="{ width: `${getPreparedPercent(program)}%` }"></div>
            </div>
          </div>

          <motion.button @click="goToProgram(program.id)" class="w-full mt-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('card.expand') }}
          </motion.button>
        </motion.div>
      </div>
    </div>
  </main>
</template>
