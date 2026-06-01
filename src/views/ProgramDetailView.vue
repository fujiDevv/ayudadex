<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, Star, Clock, Globe, MapPin, FileText, 
  Share2, Check, ExternalLink
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useI18n } from 'vue-i18n'
import programsData from '../data/programs.json'
import type { Program } from '../types'
import { useAyudaState } from '../composables/useAyudaState'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const { 
  savedPrograms, 
  checkedRequirements,
  toggleSaveProgram,
  toggleRequirement
} = useAyudaState()
const { t } = useI18n()

const program = computed<Program | undefined>(() => {
  return (programsData as Program[]).find(p => p.id === props.id)
})

const isSaved = computed(() => program.value ? savedPrograms.value.includes(program.value.id) : false)
const checkedList = computed(() => program.value ? (checkedRequirements.value[program.value.id] || []) : [])


const goBack = () => {
  router.push('/')
}

const showShareToast = ref(false)
const shareProgram = () => {
  if (navigator.share) {
    navigator.share({
      title: program.value ? t(`programs.${program.value.id}.name`) : '',
      text: program.value ? t(`programs.${program.value.id}.description`) : '',
      url: window.location.href
    }).catch(console.error)
  } else {
    navigator.clipboard.writeText(window.location.href)
    showShareToast.value = true
    setTimeout(() => {
      showShareToast.value = false
    }, 3000)
  }
}
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 animate-fade-in">
    
    <button @click="goBack" class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> Back to Directory
    </button>

    <div v-if="!program" class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Program Not Found</h2>
      <p class="text-slate-500 dark:text-slate-400 mt-2">The benefit you are looking for does not exist or the link is broken.</p>
      <button @click="goBack" class="mt-6 px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors cursor-pointer">Return Home</button>
    </div>

    <div v-else class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div class="space-y-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-[10px] font-bold uppercase rounded-md tracking-wider border border-blue-200/50 dark:border-blue-900/30">
              {{ program.agency }}
            </span>
            <span class="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider">
              {{ program.category }}
            </span>
          </div>
          <h1 class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
            {{ $t(`programs.${program.id}.name`) }}
          </h1>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-3 shrink-0">
          <motion.button 
            @click="shareProgram" 
            class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-400 relative cursor-pointer"
            title="Share this program"
            :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }"
          >
            <Share2 class="w-5 h-5" />
            <div v-if="showShareToast" class="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap flex items-center gap-1.5">
              <Check class="w-3 h-3" /> Link Copied
            </div>
          </motion.button>
          
          <motion.button 
            @click="toggleSaveProgram(program.id, $event)" 
            class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            :title="isSaved ? 'Remove bookmark' : 'Bookmark for later'"
            :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }"
          >
            <Star :class="isSaved ? 'text-yellow-500 fill-current scale-110' : 'text-slate-400 dark:text-slate-500'" class="w-5 h-5 transition-transform" />
          </motion.button>
        </div>
      </div>

      <p class="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">
        {{ $t(`programs.${program.id}.description`) }}
      </p>

      <div class="flex items-center flex-wrap gap-1.5 mt-6">
        <span class="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mr-1">{{ $t('filters.audience') }}:</span>
        <span 
          v-for="aud in program.target_audience" 
          :key="aud"
          class="text-xs font-medium bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800 px-2.5 py-1 rounded-md"
        >
          {{ aud }}
        </span>
      </div>

      <hr class="border-slate-100 dark:border-slate-800 my-8" />

      <!-- Quick Info Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl flex items-center gap-4">
          <Clock class="w-8 h-8 text-slate-400 dark:text-slate-500" />
          <div>
            <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Processing Time</p>
            <p class="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">{{ program.processing_time }}</p>
          </div>
        </div>

        <a 
          :href="program.official_url" 
          target="_blank" 
          class="bg-blue-50/50 dark:bg-slate-950 border border-blue-200 dark:border-blue-900/50 p-5 rounded-2xl flex items-center justify-between hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group/link"
        >
          <div class="flex items-center gap-4">
            <Globe class="w-8 h-8 text-blue-900 dark:text-blue-400" />
            <div>
              <p class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Official Portal</p>
              <p class="text-base font-bold text-blue-900 dark:text-blue-400 mt-0.5">Visit Agency Website</p>
            </div>
          </div>
          <ExternalLink class="w-5 h-5 text-blue-900 dark:text-blue-400 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      </div>

      <!-- Left-Right Grid for Steps vs Requirements Checklist -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <!-- Application Steps (Timeline) -->
        <div class="space-y-6">
          <h4 class="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin class="w-4 h-4" /> {{ $t('card.steps') }}
          </h4>
          <div class="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 space-y-8 ml-2 mt-2">
            <div 
              v-for="(step, idx) in $tm(`programs.${program.id}.steps`)" 
              :key="idx" 
              class="relative"
            >
              <span class="absolute -left-[33px] top-1 w-5 h-5 rounded-full bg-blue-900 dark:bg-blue-800 border-4 border-white dark:border-slate-900 flex items-center justify-center"></span>
              <div class="space-y-1.5">
                <p class="text-[10px] font-black text-blue-900 dark:text-blue-400 uppercase tracking-widest">Step {{ Number(idx) + 1 }}</p>
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{{ step }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Requirements Checklist -->
        <div class="space-y-5 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800/50">
          <div class="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-4">
            <h4 class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
              <FileText class="w-4 h-4" /> {{ $t('card.requirements') }}
            </h4>
            <span class="text-[10px] font-bold text-blue-900 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-md">
              {{ checkedList.length }} / {{ program.requirements.length }} Prepared
            </span>
          </div>

          <div class="space-y-4 pt-2">
            <label 
              v-for="(req, idx) in $tm(`programs.${program.id}.requirements`)" 
              :key="idx" 
              class="flex items-start gap-4 cursor-pointer group/item select-none"
            >
              <input 
                type="checkbox" 
                :checked="checkedList.includes(req)"
                @change="toggleRequirement(program.id, req)"
                class="w-5 h-5 text-blue-900 bg-white dark:bg-slate-900 rounded border-slate-300 dark:border-slate-700 focus:ring-blue-900 focus:ring-2 transition-colors cursor-pointer mt-0.5 shrink-0"
              />
              <span 
                class="text-sm font-medium transition-colors"
                :class="checkedList.includes(req) 
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
  </main>
</template>
