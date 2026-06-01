<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import programsData from '../data/programs.json'
import {
  Briefcase, Building2, Ban, GraduationCap, User, Plane,
  Hospital, Coins, Home, BookOpen, HeartHandshake, AlertTriangle, Baby, Accessibility,
  HelpCircle, ArrowLeft, ArrowRight
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useI18n } from 'vue-i18n'
import type { Program } from '../types'

const emit = defineEmits<{
  (e: 'select-program', programId: string): void
}>()

const step = ref(1)
const totalSteps = 3

// Form State
const status = ref('')
const need = ref('')
const demographics = ref<string[]>([])

const { t } = useI18n()

// Options
const statusOptions = computed(() => [
  { value: 'Employed', label: t('finder.status.employed'), icon: markRaw(Briefcase) },
  { value: 'Government Employees', label: t('finder.status.gov'), icon: markRaw(Building2) },
  { value: 'Unemployed', label: t('finder.status.unemployed'), icon: markRaw(Ban) },
  { value: 'Students', label: t('finder.status.student'), icon: markRaw(GraduationCap) },
  { value: 'Seniors', label: t('finder.status.senior'), icon: markRaw(User) },
  { value: 'OFW', label: t('finder.status.ofw'), icon: markRaw(Plane) }
])

const needOptions = computed(() => [
  { value: 'medical', label: t('finder.needs.medical'), icon: markRaw(Hospital) },
  { value: 'financial', label: t('finder.needs.financial'), icon: markRaw(Coins) },
  { value: 'housing', label: t('finder.needs.housing'), icon: markRaw(Home) },
  { value: 'education', label: t('finder.needs.education'), icon: markRaw(BookOpen) }
])

const demographicOptions = computed(() => [
  { value: 'Indigent', label: t('finder.demographics.indigent'), icon: markRaw(HeartHandshake) },
  { value: 'Crisis Victims', label: t('finder.demographics.crisis'), icon: markRaw(AlertTriangle) },
  { value: 'Pregnant', label: t('finder.demographics.pregnant'), icon: markRaw(Baby) },
  { value: 'PWD', label: t('finder.demographics.pwd'), icon: markRaw(Accessibility) }
])

const toggleDemographic = (val: string) => {
  const idx = demographics.value.indexOf(val)
  if (idx > -1) {
    demographics.value.splice(idx, 1)
  } else {
    demographics.value.push(val)
  }
}

const nextStep = () => {
  if (step.value < totalSteps) {
    step.value++
  }
}

const prevStep = () => {
  if (step.value > 1) {
    step.value--
  }
}

const resetQuiz = () => {
  step.value = 1
  status.value = ''
  need.value = ''
  demographics.value = []
}

// Simple recommendation engine
const recommendedPrograms = computed<Program[]>(() => {
  if (step.value !== 3 || !status.value || !need.value) return []

  const scored = (programsData as Program[]).map(program => {
    let score = 0

    // Match status/employment
    const statusLower = status.value.toLowerCase()
    const matchStatus = program.target_audience.some(aud =>
      aud.toLowerCase().includes(statusLower) ||
      statusLower.includes(aud.toLowerCase())
    ) || program.tags.some(t => t.toLowerCase() === statusLower)

    if (matchStatus) score += 4

    // Special fallback for SSS members
    if (status.value === 'Employed' && program.target_audience.includes('SSS Members')) {
      score += 3
    }
    // Special fallback for GSIS members
    if (status.value === 'Government Employees' && program.target_audience.includes('Government Employees')) {
      score += 4
    }

    // Match needs
    if (program.tags.includes(need.value) || program.category.toLowerCase().includes(need.value)) {
      score += 5
    }

    // Match demographics
    demographics.value.forEach(dem => {
      const demLower = dem.toLowerCase()
      const matchDem = program.target_audience.some(aud =>
        aud.toLowerCase().includes(demLower) ||
        demLower.includes(aud.toLowerCase())
      ) || program.tags.some(t => t.toLowerCase() === demLower)

      if (matchDem) score += 3
    })

    // General "All" or "All Citizens" tag match
    if (program.target_audience.includes('All Citizens')) {
      score += 1
    }

    return { program, score }
  })

  // Filter out zero or low matching scores, sort descending
  return scored
    .filter(item => item.score > 2)
    .sort((a, b) => b.score - a.score)
    .map(item => item.program)
})
</script>

<template>
  <motion.div
    class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm transition-all duration-300"
    :initial="{ opacity: 0, y: 15 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }">

    <!-- Header and progress indicator -->
    <div class="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
      <div>
        <h3 class="text-xs uppercase font-medium tracking-wide text-slate-900 dark:text-slate-200">{{ $t('finder.title')
          }}</h3>
        <p class="text-xl font-bold text-slate-900 dark:text-slate-200 mt-0.5">{{ $t('finder.subtitle') }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-slate-600 dark:text-slate-400">{{ $t('finder.step', {
          step: step, total:
            totalSteps
        }) }}</span>
        <div
          class="w-20 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
          <div class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300"
            :style="{ width: `${(step / totalSteps) * 100}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div class="min-h-[280px] flex flex-col justify-between">

      <!-- Step 1: Employment / Status -->
      <div v-if="step === 1" class="space-y-4 animate-fade-in">
        <h4 id="q1-title" class="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">{{ $t('finder.q1') }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3" role="group" aria-labelledby="q1-title">
          <motion.button v-for="opt in statusOptions" :key="opt.value" @click="status = opt.value; nextStep()"
            class="flex items-center gap-4 p-4 text-left rounded-xl border transition-all duration-205 group active:scale-[0.98] cursor-pointer"
            :class="status === opt.value
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-900 dark:border-blue-800 text-blue-900 dark:text-blue-400 shadow-sm'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'"
            :whileHover="{ scale: 1.02, y: -2 }" :whileTap="{ scale: 0.98 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 15 }">
            <span
              class="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg transition-transform group-hover:scale-105">
              <component :is="opt.icon" class="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </span>
            <span class="font-medium text-sm md:text-base">{{ opt.label }}</span>
          </motion.button>
        </div>
      </div>

      <!-- Step 2: Main Area of Need -->
      <div v-if="step === 2" class="space-y-4 animate-fade-in">
        <h4 id="q2-title" class="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">{{ $t('finder.q2') }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3" role="group" aria-labelledby="q2-title">
          <motion.button v-for="opt in needOptions" :key="opt.value" @click="need = opt.value; nextStep()"
            class="flex items-center gap-4 p-4 text-left rounded-xl border transition-all duration-205 group active:scale-[0.98] cursor-pointer"
            :class="need === opt.value
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-900 dark:border-blue-800 text-blue-900 dark:text-blue-400 shadow-sm'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'"
            :whileHover="{ scale: 1.02, y: -2 }" :whileTap="{ scale: 0.98 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 15 }">
            <span
              class="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg transition-transform group-hover:scale-105">
              <component :is="opt.icon" class="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </span>
            <span class="font-medium text-sm md:text-base">{{ opt.label }}</span>
          </motion.button>
        </div>
      </div>

      <!-- Step 3: Demographics & Special conditions -->
      <div v-if="step === 3" class="space-y-4 animate-fade-in">
        <h4 id="q3-title" class="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">{{ $t('finder.q3') }}</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6" role="group" aria-labelledby="q3-title">
          <motion.button v-for="opt in demographicOptions" :key="opt.value" @click="toggleDemographic(opt.value)"
            class="flex items-center gap-4 p-4 text-left rounded-xl border transition-all duration-205 group active:scale-[0.98] cursor-pointer"
            :class="demographics.includes(opt.value)
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-900 dark:border-blue-800 text-blue-900 dark:text-blue-400 shadow-sm'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'"
            :whileHover="{ scale: 1.02, y: -2 }" :whileTap="{ scale: 0.98 }"
            :transition="{ type: 'spring', stiffness: 300, damping: 15 }">
            <span
              class="p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg transition-transform group-hover:scale-105">
              <component :is="opt.icon" class="w-6 h-6 text-blue-900 dark:text-blue-400" />
            </span>
            <span class="font-medium text-sm md:text-base">{{ opt.label }}</span>
          </motion.button>
        </div>

        <!-- Recommendations Result Panel -->
        <div class="mt-6 border-t border-slate-200 dark:border-slate-800 pt-6">
          <h5 class="text-sm font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
            <Briefcase class="w-4 h-4" />
            {{ $t('finder.recommendations') }} ({{ recommendedPrograms.length }})
          </h5>

          <div v-if="recommendedPrograms.length === 0"
            class="text-center py-8 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <HelpCircle class="w-8 h-8 text-slate-400 dark:text-slate-600 mx-auto" />
            <p class="text-slate-600 dark:text-slate-300 font-medium mt-2">{{ $t('finder.noMatchTitle') }}</p>
            <p class="text-slate-600 dark:text-slate-300 text-xs mt-1">{{ $t('finder.noMatchDesc') }}</p>
          </div>

          <div v-else class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
            <motion.div v-for="prog in recommendedPrograms" :key="prog.id"
              class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 rounded-xl transition-all duration-200"
              :initial="{ opacity: 0, x: 10 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.25 }">
              <div class="flex-1 pr-4">
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    class="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 rounded text-[10px] uppercase font-bold tracking-wider border border-blue-200/50 dark:border-blue-900/30">{{
                      prog.agency }}</span>
                  <span class="text-[10px] text-slate-500 dark:text-slate-400 font-medium">{{ prog.category }}</span>
                </div>
                <h6 class="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">{{ prog.name }}</h6>
              </div>
              <motion.button @click="emit('select-program', prog.id)"
                class="px-3 py-1.5 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 active:scale-95 cursor-pointer"
                :whileHover="{ scale: 1.05 }" :whileTap="{ scale: 0.95 }">
                <span>{{ $t('finder.viewDetails') }}</span>
                <ArrowRight class="w-3 h-3" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      <!-- Navigation buttons -->
      <div class="flex items-center justify-between mt-8 border-t border-slate-200 dark:border-slate-800 pt-4">
        <motion.button v-if="step > 1" @click="prevStep"
          class="px-4 py-2 text-slate-600 dark:text-slate-350 hover:text-blue-900 dark:hover:text-blue-400 text-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
          :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
          <ArrowLeft class="w-4 h-4" /> {{ $t('finder.back') }}
        </motion.button>
        <div v-else></div>

        <motion.button v-if="step === totalSteps" @click="resetQuiz"
          class="px-5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold rounded-xl text-sm transition-all duration-200 cursor-pointer"
          :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
          {{ $t('finder.reset') }}
        </motion.button>
      </div>

    </div>
  </motion.div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
