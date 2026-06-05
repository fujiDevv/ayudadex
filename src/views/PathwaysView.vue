<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { motion } from 'motion-v'
import {
  Baby, Heart, Briefcase, ArrowLeft, ChevronRight, CheckCircle, Info, ExternalLink
} from 'lucide-vue-next'
import programsData from '../data/programs.json'

const router = useRouter()
const { t } = useI18n()

// Selected pathway: null (selection screen), 'baby', 'death', or 'job_loss'
const selectedPathway = ref<'baby' | 'death' | 'job_loss' | null>(null)

interface PathwayItem {
  programId?: string // if it points to a first-class program
  isCustom?: boolean
  name: string
  agency: string
  purpose: string
  requirements: string[]
  steps: string[]
}

// Pathway Data definition
const pathwaysData = computed<Record<'baby' | 'death' | 'job_loss', {
  titleKey: string
  descKey: string
  tipsKey: string
  icon: any
  colorClass: string
  items: PathwayItem[]
}>>(() => ({
  baby: {
    titleKey: 'pathways.babyTitle',
    descKey: 'pathways.babyDesc',
    tipsKey: 'pathways.babyTips',
    icon: Baby,
    colorClass: 'from-rose-500 to-orange-500 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40',
    items: [
      {
        programId: 'sss-maternity',
        name: t('programs.sss-maternity.name'),
        agency: 'SSS',
        purpose: 'Provides cash allowance to SSS female members who gave birth or suffered a miscarriage.',
        requirements: (programsData.find(p => p.id === 'sss-maternity')?.requirements || []),
        steps: (programsData.find(p => p.id === 'sss-maternity')?.steps || [])
      },
      {
        programId: 'philhealth-newborn',
        name: t('programs.philhealth-newborn.name'),
        agency: 'PhilHealth',
        purpose: 'Covers essential diagnostic tests, physical exams, and initial vaccines for newborns.',
        requirements: (programsData.find(p => p.id === 'philhealth-newborn')?.requirements || []),
        steps: (programsData.find(p => p.id === 'philhealth-newborn')?.steps || [])
      },
      {
        isCustom: true,
        name: 'Pag-IBIG Membership Registration',
        agency: 'Pag-IBIG',
        purpose: 'Ensures the child can be registered or parents can update their beneficiary data for housing/savings programs.',
        requirements: [
          'Valid government ID of the parent/member',
          'Child\'s birth certificate (PSA copy)',
          'Completed Member\'s Data Form (MDF)'
        ],
        steps: [
          'Visit the Virtual Pag-IBIG portal online or nearest branch.',
          'Fill out the MDF form to register or update membership records.',
          'Submit the copy of the child\'s birth certificate for beneficiary registration.'
        ]
      }
    ]
  },
  death: {
    titleKey: 'pathways.deathTitle',
    descKey: 'pathways.deathDesc',
    tipsKey: 'pathways.deathTips',
    icon: Heart,
    colorClass: 'from-slate-700 to-indigo-900 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40',
    items: [
      {
        programId: 'sss-funeral',
        name: t('programs.sss-funeral.name'),
        agency: 'SSS',
        purpose: 'Reimburses up to ₱40,000 of funeral expenses for SSS members.',
        requirements: (programsData.find(p => p.id === 'sss-funeral')?.requirements || []),
        steps: (programsData.find(p => p.id === 'sss-funeral')?.steps || [])
      },
      {
        programId: 'gsis-funeral',
        name: t('programs.gsis-funeral.name'),
        agency: 'GSIS',
        purpose: 'Provides a fixed ₱30,000 funeral grant for deceased government workers.',
        requirements: (programsData.find(p => p.id === 'gsis-funeral')?.requirements || []),
        steps: (programsData.find(p => p.id === 'gsis-funeral')?.steps || [])
      },
      {
        programId: 'dswd-aics',
        name: t('programs.dswd-aics.name') + ' (Burial Assistance)',
        agency: 'DSWD',
        purpose: 'Provides direct financial assistance or guarantee letters for indigent families to cover funeral bills.',
        requirements: (programsData.find(p => p.id === 'dswd-aics')?.requirements || []),
        steps: (programsData.find(p => p.id === 'dswd-aics')?.steps || [])
      },
      {
        isCustom: true,
        name: 'PSA Death Certificate Registration',
        agency: 'Local Civil Registry / PSA',
        purpose: 'Prerequisite document needed for all other claim processing.',
        requirements: [
          'Certified copy of the Death Certificate signed by attending doctor',
          'Informant\'s valid ID',
          'Barangay certificate of residency of the deceased'
        ],
        steps: [
          'Register the death at the Local Civil Registry Office (LCRO) of the city/municipality where it occurred.',
          'Obtain registered local copies.',
          'Request official security paper PSA Death Certificates after the LCR transmits records.'
        ]
      }
    ]
  },
  job_loss: {
    titleKey: 'pathways.jobLossTitle',
    descKey: 'pathways.jobLossDesc',
    tipsKey: 'pathways.jobLossTips',
    icon: Briefcase,
    colorClass: 'from-blue-600 to-teal-500 text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 border-teal-100 dark:border-teal-900/40',
    items: [
      {
        programId: 'sss-unemp',
        name: t('programs.sss-unemp.name'),
        agency: 'SSS',
        purpose: 'Provides temporary cash allowances for involuntarily separated SSS members.',
        requirements: (programsData.find(p => p.id === 'sss-unemp')?.requirements || []),
        steps: (programsData.find(p => p.id === 'sss-unemp')?.steps || [])
      },
      {
        programId: 'dole-tupad',
        name: t('programs.dole-tupad.name'),
        agency: 'DOLE',
        purpose: 'Offers emergency community cleaning/maintenance jobs (10-30 days) for immediate cash.',
        requirements: (programsData.find(p => p.id === 'dole-tupad')?.requirements || []),
        steps: (programsData.find(p => p.id === 'dole-tupad')?.steps || [])
      },
      {
        programId: 'tesda-training',
        name: t('programs.tesda-training.name'),
        agency: 'TESDA',
        purpose: 'Provides free vocational training courses and entrepreneurship toolkits to upskill workers.',
        requirements: (programsData.find(p => p.id === 'tesda-training')?.requirements || []),
        steps: (programsData.find(p => p.id === 'tesda-training')?.steps || [])
      }
    ]
  }
}))

// Checked checklists state
const checkedItems = ref<Record<string, boolean>>({})

const toggleItem = (key: string) => {
  checkedItems.value[key] = !checkedItems.value[key]
  localStorage.setItem('ayuda_pathways_progress', JSON.stringify(checkedItems.value))
}

const loadProgress = () => {
  const saved = localStorage.getItem('ayuda_pathways_progress')
  if (saved) {
    try {
      checkedItems.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to parse progress', e)
    }
  }
}

// Progress metrics for active pathway
const currentPathwayProgress = computed(() => {
  if (!selectedPathway.value) return { total: 0, checked: 0, percentage: 0 }
  const pathway = pathwaysData.value[selectedPathway.value]
  let total = 0
  let checked = 0

  pathway.items.forEach((item, itemIdx) => {
    item.requirements.forEach((_, reqIdx) => {
      total++
      const key = `${selectedPathway.value}_item_${itemIdx}_req_${reqIdx}`
      if (checkedItems.value[key]) checked++
    })
    item.steps.forEach((_, stepIdx) => {
      total++
      const key = `${selectedPathway.value}_item_${itemIdx}_step_${stepIdx}`
      if (checkedItems.value[key]) checked++
    })
  })

  return {
    total,
    checked,
    percentage: total === 0 ? 0 : Math.round((checked / total) * 100)
  }
})

const goBackToSelection = () => {
  selectedPathway.value = null
}

const viewProgram = (id: string) => {
  router.push(`/program/${id}`)
}

onMounted(() => {
  loadProgress()
})
</script>

<template>
  <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-8">

    <!-- Hero Header (Shows only when on selection screen) -->
    <div v-if="!selectedPathway" class="mb-12">
      <motion.div class="max-w-3xl" :initial="{ opacity: 0, y: 15 }" :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4 }">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight sm:text-4xl">
          {{ t('pathways.title') }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-base font-normal leading-relaxed">
          {{ t('pathways.desc') }}
        </p>
      </motion.div>
    </div>

    <!-- Selection Cards (when selectedPathway is null) -->
    <div v-if="!selectedPathway" class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <!-- Having a Baby (Panganganak) Card -->
      <motion.div @click="selectedPathway = 'baby'"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group overflow-hidden relative"
        :whileHover="{ y: -4, scale: 1.01 }" :whileTap="{ scale: 0.99 }">
        <div class="space-y-4">
          <div class="inline-flex p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
            <Baby class="w-6 h-6" />
          </div>
          <h3
            class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {{ t('pathways.babyTitle') }}
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-normal">
            {{ t('pathways.babyDesc') }}
          </p>
        </div>
        <div
          class="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
          <span>3 programs / checklists</span>
          <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>

      <!-- Loss of a Family Member (Kamatayan) Card -->
      <motion.div @click="selectedPathway = 'death'"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group overflow-hidden relative"
        :whileHover="{ y: -4, scale: 1.01 }" :whileTap="{ scale: 0.99 }">
        <div class="space-y-4">
          <div
            class="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400">
            <Heart class="w-6 h-6" />
          </div>
          <h3
            class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {{ t('pathways.deathTitle') }}
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-normal">
            {{ t('pathways.deathDesc') }}
          </p>
        </div>
        <div
          class="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          <span>4 programs / checklists</span>
          <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>

      <!-- Job Loss (Pagkawala ng Trabaho) Card -->
      <motion.div @click="selectedPathway = 'job_loss'"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between group overflow-hidden relative"
        :whileHover="{ y: -4, scale: 1.01 }" :whileTap="{ scale: 0.99 }">
        <div class="space-y-4">
          <div class="inline-flex p-3 rounded-2xl bg-teal-50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400">
            <Briefcase class="w-6 h-6" />
          </div>
          <h3
            class="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {{ t('pathways.jobLossTitle') }}
          </h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-normal">
            {{ t('pathways.jobLossDesc') }}
          </p>
        </div>
        <div
          class="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          <span>3 programs / checklists</span>
          <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </motion.div>

    </div>

    <!-- Active Pathway detail wizard -->
    <div v-else class="space-y-6">

      <!-- Back navigation button -->
      <button @click="goBackToSelection"
        class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer">
        <ArrowLeft class="w-4 h-4" /> {{ t('pathways.selectEvent') }}
      </button>

      <!-- Pathway Title and Header -->
      <motion.div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
        :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.3 }">
        <div class="space-y-2 max-w-xl">
          <div class="flex items-center gap-2.5">
            <div
              :class="`p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 ${pathwaysData[selectedPathway].colorClass.split(' ').slice(1).join(' ')}`">
              <component :is="pathwaysData[selectedPathway].icon" class="w-6 h-6" />
            </div>
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Life-Event Bundle</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">
            {{ t(pathwaysData[selectedPathway].titleKey) }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed">
            {{ t(pathwaysData[selectedPathway].descKey) }}
          </p>
        </div>

        <!-- Progress Metrics -->
        <div
          class="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-100 dark:border-slate-900 w-full md:w-56 shrink-0 space-y-3">
          <div
            class="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <span>{{ t('pathways.progress') }}</span>
            <span class="text-slate-950 dark:text-slate-200">{{ currentPathwayProgress.checked }} / {{
              currentPathwayProgress.total }}</span>
          </div>
          <!-- Progress Line -->
          <div class="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300"
              :style="{ width: `${currentPathwayProgress.percentage}%` }"></div>
          </div>
          <div class="text-[10px] font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider text-right">
            {{ currentPathwayProgress.percentage }}% Completed
          </div>
        </div>
      </motion.div>

      <!-- Coordination Pro-Tips Panel -->
      <motion.div
        class="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/60 dark:border-amber-900/30 rounded-3xl p-6"
        :initial="{ opacity: 0, y: 10 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.3, delay: 0.1 }">
        <h3 class="text-base font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2">
          <Info class="w-5 h-5 shrink-0" />
          {{ t('pathways.coordinationTips') }}
        </h3>
        <ul class="mt-4 space-y-2.5 text-sm text-amber-900/80 dark:text-amber-300/80 leading-relaxed font-normal">
          <li v-for="(tip, idx) in t(pathwaysData[selectedPathway].tipsKey).split('. ')" :key="idx" class="flex gap-2">
            <span>•</span>
            <span>{{ tip }}</span>
          </li>
        </ul>
      </motion.div>

      <!-- Included Programs Checklists -->
      <div class="space-y-6">
        <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {{ t('pathways.bundleIncludes') }}
        </h3>

        <motion.div v-for="(item, itemIdx) in pathwaysData[selectedPathway].items" :key="itemIdx"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
          :initial="{ opacity: 0, y: 15 }" :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.3, delay: 0.15 + itemIdx * 0.05 }">
          <!-- Program Card Header -->
          <div
            class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span
                  class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold uppercase rounded-md tracking-wider border border-slate-200/50 dark:border-slate-700/50">
                  {{ item.agency }}
                </span>
              </div>
              <h4 class="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {{ item.name }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {{ item.purpose }}
              </p>
            </div>

            <!-- View Program Link -->
            <button v-if="item.programId" @click="viewProgram(item.programId)"
              class="shrink-0 flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer">
              <span>Full Details</span>
              <ExternalLink class="w-3.5 h-3.5" />
            </button>
          </div>

          <!-- Requirements Checklist -->
          <div class="space-y-3">
            <h5 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Documents & Prerequisites
            </h5>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label v-for="(req, reqIdx) in item.requirements" :key="reqIdx"
                class="flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none"
                :class="checkedItems[`${selectedPathway}_item_${itemIdx}_req_${reqIdx}`]
                  ? 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/60'
                  : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'">
                <input type="checkbox" :checked="checkedItems[`${selectedPathway}_item_${itemIdx}_req_${reqIdx}`]"
                  @change="toggleItem(`${selectedPathway}_item_${itemIdx}_req_${reqIdx}`)"
                  class="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-blue-900 focus:ring-blue-500 mt-0.5" />
                <span class="text-xs font-medium" :class="checkedItems[`${selectedPathway}_item_${itemIdx}_req_${reqIdx}`]
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-700 dark:text-slate-200'">
                  {{ req }}
                </span>
              </label>
            </div>
          </div>

          <!-- Application Steps -->
          <div class="space-y-3 pt-2">
            <h5 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Application Steps
            </h5>
            <div class="space-y-2.5">
              <div v-for="(step, stepIdx) in item.steps" :key="stepIdx"
                @click="toggleItem(`${selectedPathway}_item_${itemIdx}_step_${stepIdx}`)"
                class="flex items-start gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none"
                :class="checkedItems[`${selectedPathway}_item_${itemIdx}_step_${stepIdx}`]
                  ? 'bg-blue-50/20 dark:bg-blue-950/10 border-blue-200 dark:border-blue-900/60'
                  : 'bg-slate-50/40 dark:bg-slate-900/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'">
                <div class="mt-0.5 shrink-0">
                  <CheckCircle class="w-4 h-4" :class="checkedItems[`${selectedPathway}_item_${itemIdx}_step_${stepIdx}`]
                    ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950/20'
                    : 'text-slate-300 dark:text-slate-700'" />
                </div>
                <div class="space-y-0.5">
                  <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Step {{ stepIdx + 1
                  }}</span>
                  <p class="text-xs font-medium leading-relaxed" :class="checkedItems[`${selectedPathway}_item_${itemIdx}_step_${stepIdx}`]
                    ? 'text-slate-400 dark:text-slate-500 line-through'
                    : 'text-slate-700 dark:text-slate-200'">
                    {{ step }}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </motion.div>
      </div>

    </div>

  </main>
</template>
