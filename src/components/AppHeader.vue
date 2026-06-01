<script setup lang="ts">
import { 
  ClipboardList, Wand2, Star, Phone, Sun, Moon 
} from 'lucide-vue-next'
import { motion } from 'motion-v'

const activeTab = defineModel<'directory' | 'wizard' | 'shortlist' | 'hotlines'>({ required: true })

defineProps<{
  savedCount: number
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-dark'): void
}>()
</script>

<template>
  <div>
    <!-- Navbar / Premium Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo and Slogan -->
        <motion.div 
          class="flex items-center gap-3"
          :initial="{ opacity: 0, x: -15 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 20 }"
        >
          <div class="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-lg">
            AD
          </div>
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-400">AyudaDex</h1>
              <span class="text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 rounded-md border border-blue-200/50 dark:border-blue-900/30">CIVIC V1.2</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Philippine Government Social Benefits Navigator</p>
          </div>
        </motion.div>

        <!-- Navigation Tabs (Desktop) -->
        <nav class="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <motion.button 
            @click="activeTab = 'directory'" 
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            :class="activeTab === 'directory' 
              ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-350 hover:text-blue-900 dark:hover:text-blue-400'"
            :whileHover="{ scale: 1.05 }"
            :whileTap="{ scale: 0.95 }"
          >
            <ClipboardList class="w-4 h-4 inline-block mr-1" /> Benefits Directory
          </motion.button>
          <motion.button 
            @click="activeTab = 'wizard'" 
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            :class="activeTab === 'wizard' 
              ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-350 hover:text-blue-900 dark:hover:text-blue-400'"
            :whileHover="{ scale: 1.05 }"
            :whileTap="{ scale: 0.95 }"
          >
            <Wand2 class="w-4 h-4 inline-block mr-1" /> Eligibility Quiz
          </motion.button>
          <motion.button 
            @click="activeTab = 'shortlist'" 
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            :class="activeTab === 'shortlist' 
              ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-350 hover:text-blue-900 dark:hover:text-blue-400'"
            :whileHover="{ scale: 1.05 }"
            :whileTap="{ scale: 0.95 }"
          >
            <Star class="w-4 h-4" /> Saved ({{ savedCount }})
          </motion.button>
          <motion.button 
            @click="activeTab = 'hotlines'" 
            class="px-4 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
            :class="activeTab === 'hotlines' 
              ? 'bg-white dark:bg-slate-900 text-blue-900 dark:text-blue-400 shadow-sm' 
              : 'text-slate-600 dark:text-slate-350 hover:text-blue-900 dark:hover:text-blue-400'"
            :whileHover="{ scale: 1.05 }"
            :whileTap="{ scale: 0.95 }"
          >
            <Phone class="w-4 h-4 inline-block mr-1" /> Hotlines
          </motion.button>
        </nav>

        <!-- Dark Mode Toggle -->
        <div class="w-10">
          <motion.button 
            @click="emit('toggle-dark')" 
            aria-label="Toggle Dark Mode"
            class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            :whileHover="{ scale: 1.12, rotate: 12 }"
            :whileTap="{ scale: 0.88 }"
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </motion.button>
        </div>

      </div>
    </header>

    <!-- Sub-navbar for Mobile Navigation -->
    <div class="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-30">
      <div class="grid grid-cols-4 text-center text-xs font-bold divide-x divide-slate-100 dark:divide-slate-800">
        <motion.button 
          @click="activeTab = 'directory'" 
          class="py-3 flex flex-col items-center gap-1 cursor-pointer"
          :class="activeTab === 'directory' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400'"
          :whileTap="{ scale: 0.95 }"
        >
          <ClipboardList class="w-5 h-5" />
          <span>Directory</span>
        </motion.button>
        <motion.button 
          @click="activeTab = 'wizard'" 
          class="py-3 flex flex-col items-center gap-1 cursor-pointer"
          :class="activeTab === 'wizard' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400'"
          :whileTap="{ scale: 0.95 }"
        >
          <Wand2 class="w-5 h-5" />
          <span>Quiz</span>
        </motion.button>
        <motion.button 
          @click="activeTab = 'shortlist'" 
          class="py-3 flex flex-col items-center gap-1 cursor-pointer"
          :class="activeTab === 'shortlist' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400'"
          :whileTap="{ scale: 0.95 }"
        >
          <Star class="w-5 h-5" />
          <span>Saved ({{ savedCount }})</span>
        </motion.button>
        <motion.button 
          @click="activeTab = 'hotlines'" 
          class="py-3 flex flex-col items-center gap-1 cursor-pointer"
          :class="activeTab === 'hotlines' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400'"
          :whileTap="{ scale: 0.95 }"
        >
          <Phone class="w-5 h-5" />
          <span>Hotlines</span>
        </motion.button>
      </div>
    </div>
  </div>
</template>
