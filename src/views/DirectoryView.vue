<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import programsData from '../data/programs.json'
import ProgramCard from '../components/ProgramCard.vue'
import { Settings, Search } from 'lucide-vue-next'
import { motion } from 'motion-v'
import type { Program } from '../types'
import { useAyudaState } from '../composables/useAyudaState'

const router = useRouter()
const { savedPrograms, checkedRequirements, toggleSaveProgram, toggleRequirement } = useAyudaState()

const searchQuery = ref('')
const selectedAgencies = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const selectedAudiences = ref<string[]>([])

const agenciesList = computed(() => Array.from(new Set(programsData.map(p => p.agency))).sort())
const categoriesList = computed(() => Array.from(new Set(programsData.map(p => p.category.split(' / ')).flat())).sort())
const audienceTags = ["Indigent", "Senior Citizen", "Student", "PWD", "Unemployed", "Pregnant", "Worker", "Solo Parent", "MSME"]

const toggleAgencyFilter = (agency: string) => {
  const idx = selectedAgencies.value.indexOf(agency)
  if (idx > -1) selectedAgencies.value.splice(idx, 1)
  else selectedAgencies.value.push(agency)
}

const toggleCategoryFilter = (cat: string) => {
  const idx = selectedCategories.value.indexOf(cat)
  if (idx > -1) selectedCategories.value.splice(idx, 1)
  else selectedCategories.value.push(cat)
}

const toggleAudienceFilter = (aud: string) => {
  const idx = selectedAudiences.value.indexOf(aud)
  if (idx > -1) selectedAudiences.value.splice(idx, 1)
  else selectedAudiences.value.push(aud)
}

const clearFilters = () => {
  selectedAgencies.value = []
  selectedCategories.value = []
  selectedAudiences.value = []
  searchQuery.value = ''
}

const filteredPrograms = computed<Program[]>(() => {
  return (programsData as Program[]).filter(program => {
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query ||
      program.name.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query) ||
      program.agency.toLowerCase().includes(query) ||
      program.category.toLowerCase().includes(query) ||
      program.requirements.some(r => r.toLowerCase().includes(query)) ||
      program.tags.some(t => t.toLowerCase().includes(query))

    const matchesAgency = selectedAgencies.value.length === 0 ||
      selectedAgencies.value.includes(program.agency)

    const matchesCategory = selectedCategories.value.length === 0 ||
      program.category.split(' / ').some(cat => selectedCategories.value.includes(cat))

    const matchesAudience = selectedAudiences.value.length === 0 ||
      program.target_audience.some(aud => selectedAudiences.value.includes(aud))

    return matchesSearch && matchesAgency && matchesCategory && matchesAudience
  })
})

const goToProgram = (id: string) => router.push(`/program/${id}`)
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6">
      <motion.div class="text-left mb-8 max-w-2xl" :initial="{ opacity: 0, y: -10 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Explore Philippine Welfare & Benefits</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-base font-normal leading-relaxed">
          Search, filter, and track requirements for national assistance schemes. Bookmark programs to save your document checklists offline.
        </p>
      </motion.div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <motion.aside class="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
          :initial="{ opacity: 0, x: -15 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.35 }">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 class="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Settings class="w-5 h-5" /> Filters
            </h3>
            <motion.button v-if="selectedAgencies.length || selectedCategories.length || selectedAudiences.length || searchQuery"
              @click="clearFilters" class="text-xs text-blue-900 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
              Clear All
            </motion.button>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400">Search</label>
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="e.g. AICS, Maternity, Loan..."
                class="w-full bg-white dark:bg-slate-950 text-sm font-normal rounded-xl border border-slate-200 dark:border-slate-800 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm" />
              <Search class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Government Agency</label>
            <div class="flex flex-wrap lg:flex-col gap-1.5">
              <motion.button v-for="agency in agenciesList" :key="agency" @click="toggleAgencyFilter(agency)"
                class="px-3 py-1.5 lg:w-full lg:text-left text-xs font-medium rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer"
                :class="selectedAgencies.includes(agency) ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'"
                :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.99 }">
                <span>{{ agency }}</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded-full" :class="selectedAgencies.includes(agency) ? 'bg-blue-800 dark:bg-blue-950 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'">
                  {{ programsData.filter(p => p.agency === agency).length }}
                </span>
              </motion.button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Category</label>
            <div class="flex flex-wrap lg:flex-col gap-1.5">
              <motion.button v-for="cat in categoriesList" :key="cat" @click="toggleCategoryFilter(cat)"
                class="px-3 py-1.5 lg:w-full lg:text-left text-xs font-medium rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer"
                :class="selectedCategories.includes(cat) ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'"
                :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.99 }">
                <span>{{ cat }}</span>
              </motion.button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Target Audience</label>
            <div class="flex flex-wrap gap-1">
              <motion.button v-for="aud in audienceTags" :key="aud" @click="toggleAudienceFilter(aud)"
                class="px-2 py-1 text-[10px] font-medium rounded-md border transition-all cursor-pointer"
                :class="selectedAudiences.includes(aud) ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900'"
                :whileHover="{ scale: 1.04 }" :whileTap="{ scale: 0.96 }">
                {{ aud }}
              </motion.button>
            </div>
          </div>
        </motion.aside>

        <section class="lg:col-span-3 space-y-6">
          <div class="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <span>Showing {{ filteredPrograms.length }} of {{ programsData.length }} benefits</span>
          </div>

          <div v-if="filteredPrograms.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl">
            <Search class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
            <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">No matching programs found</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto">Try refining your keyword search, selecting broader filter tags, or clearing filters to see all available listings.</p>
            <motion.button @click="clearFilters" class="mt-4 px-4 py-2 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              :whileHover="{ scale: 1.04 }" :whileTap="{ scale: 0.96 }">
              Reset Filters
            </motion.button>
          </div>

          <ProgramCard v-for="program in filteredPrograms" :key="program.id" :program="program"
            :is-saved="savedPrograms.includes(program.id)" :is-expanded="false"
            :checked-requirements="checkedRequirements[program.id] || []"
            @toggle-save="toggleSaveProgram(program.id, $event)"
            @toggle-requirement="toggleRequirement(program.id, $event)"
            @toggle-expansion="goToProgram(program.id)" />
        </section>
      </div>
    </div>
  </main>
</template>
