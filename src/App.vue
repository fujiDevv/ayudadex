<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import programsData from './data/programs.json'
import AyudaFinder from './components/AyudaFinder.vue'
import ProgramCard from './components/ProgramCard.vue'
import { 
  ClipboardList, Wand2, Star, Phone, Settings, Search, 
  FileText, Sparkles, AlertTriangle, Sun, Moon
} from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
import { motion } from 'motion-v'
import type { Program } from './types'
import { hotlines, audienceTags } from './constants'

const isDark = useDark()
const toggleDark = useToggle(isDark)

// Tabs
type Tab = 'directory' | 'wizard' | 'shortlist' | 'hotlines'
const activeTab = ref<Tab>('directory')

// Search & Advanced Filters State
const searchQuery = ref('')
const selectedAgencies = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const selectedAudiences = ref<string[]>([])

// Expanded cards (holds program.id)
const expandedProgramId = ref<string | null>(null)

// Persistence States (saved in localStorage)
const savedPrograms = ref<string[]>([])
const checkedRequirements = ref<Record<string, string[]>>({})

// Load state from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem('ayudadex_saved')
  if (saved) savedPrograms.value = JSON.parse(saved)

  const checked = localStorage.getItem('ayudadex_checked_reqs')
  if (checked) checkedRequirements.value = JSON.parse(checked)
})

// Extracted Filter Options
const agenciesList = computed(() => {
  return Array.from(new Set(programsData.map(p => p.agency))).sort()
})

const categoriesList = computed(() => {
  return Array.from(new Set(programsData.map(p => p.category.split(' / ')).flat())).sort()
})

// Filter Toggles
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

// Filter Logic
const filteredPrograms = computed<Program[]>(() => {
  return (programsData as Program[]).filter(program => {
    // Search Query Match (fuzzy match name, description, tags, agency)
    const query = searchQuery.value.toLowerCase().trim()
    const matchesSearch = !query || 
      program.name.toLowerCase().includes(query) ||
      program.description.toLowerCase().includes(query) ||
      program.agency.toLowerCase().includes(query) ||
      program.category.toLowerCase().includes(query) ||
      program.requirements.some(r => r.toLowerCase().includes(query)) ||
      program.tags.some(t => t.toLowerCase().includes(query))

    // Agency Filter
    const matchesAgency = selectedAgencies.value.length === 0 || 
      selectedAgencies.value.includes(program.agency)

    // Category Filter (match any selected category component)
    const matchesCategory = selectedCategories.value.length === 0 ||
      program.category.split(' / ').some(cat => selectedCategories.value.includes(cat))

    // Audience Filter
    const matchesAudience = selectedAudiences.value.length === 0 ||
      program.target_audience.some(aud => selectedAudiences.value.includes(aud))

    return matchesSearch && matchesAgency && matchesCategory && matchesAudience
  })
})

// Shortlist computed list
const shortlistedPrograms = computed<Program[]>(() => {
  return (programsData as Program[]).filter(p => savedPrograms.value.includes(p.id))
})

// Toggle Saved / Bookmarked state
const toggleSaveProgram = (id: string, event?: Event) => {
  if (event) event.stopPropagation()
  const idx = savedPrograms.value.indexOf(id)
  if (idx > -1) {
    savedPrograms.value.splice(idx, 1)
  } else {
    savedPrograms.value.push(id)
  }
  localStorage.setItem('ayudadex_saved', JSON.stringify(savedPrograms.value))
}

// Checkbox Requirements Tracking
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
  
  // Clean up empty lists
  if (reqList.length === 0) {
    delete checkedRequirements.value[programId]
  }

  localStorage.setItem('ayudadex_checked_reqs', JSON.stringify(checkedRequirements.value))
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

const toggleCardExpansion = (id: string) => {
  if (expandedProgramId.value === id) {
    expandedProgramId.value = null
  } else {
    expandedProgramId.value = id
  }
}

// Jump from Wizard suggestion directly to detail card
const selectProgramFromWizard = (programId: string) => {
  activeTab.value = 'directory'
  expandedProgramId.value = programId
  // Wait for rendering and scroll smoothly to element
  setTimeout(() => {
    const el = document.getElementById(`program-card-${programId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 100)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-900 selection:text-white pb-16 transition-colors duration-200">
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
            <Star class="w-4 h-4" /> Saved ({{ savedPrograms.length }})
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
            @click="toggleDark()" 
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
          <span>Saved ({{ savedPrograms.length }})</span>
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

    <!-- Main Content Shell -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
      
      <!-- VIEW 1: BENEFITS DIRECTORY -->
      <div v-if="activeTab === 'directory'" class="space-y-6">
        
        <!-- Welcome Hero/Tagline -->
        <motion.div 
          class="text-left mb-8 max-w-2xl"
          :initial="{ opacity: 0, y: -10 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.4 }"
        >
          <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Explore Philippine Welfare & Benefits
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-base font-normal leading-relaxed">
            Search, filter, and track requirements for national assistance schemes. Bookmark programs to save your document checklists offline.
          </p>
        </motion.div>

        <!-- Layout Grid: Left Sidebar Filters, Right Content Feed -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          <!-- Filters Column -->
          <motion.aside 
            class="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm"
            :initial="{ opacity: 0, x: -15 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.35 }"
          >
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 class="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Settings class="w-5 h-5" /> Filters
              </h3>
              <motion.button 
                v-if="selectedAgencies.length || selectedCategories.length || selectedAudiences.length || searchQuery" 
                @click="clearFilters" 
                class="text-xs text-blue-900 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                :whileHover="{ scale: 1.03 }"
                :whileTap="{ scale: 0.97 }"
              >
                Clear All
              </motion.button>
            </div>

            <!-- Search Field -->
            <div class="space-y-2">
              <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400">Search</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="e.g. AICS, Maternity, Loan..." 
                  class="w-full bg-white dark:bg-slate-950 text-sm font-normal rounded-xl border border-slate-200 dark:border-slate-800 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 dark:text-slate-100 shadow-sm"
                />
                <Search class="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <!-- Agency Filter List -->
            <div class="space-y-2">
              <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Government Agency</label>
              <div class="flex flex-wrap lg:flex-col gap-1.5">
                <motion.button 
                  v-for="agency in agenciesList" 
                  :key="agency"
                  @click="toggleAgencyFilter(agency)"
                  class="px-3 py-1.5 lg:w-full lg:text-left text-xs font-medium rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer"
                  :class="selectedAgencies.includes(agency)
                    ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'"
                  :whileHover="{ scale: 1.01 }"
                  :whileTap="{ scale: 0.99 }"
                >
                  <span>{{ agency }}</span>
                  <span 
                    class="text-[9px] px-1.5 py-0.5 rounded-full" 
                    :class="selectedAgencies.includes(agency) ? 'bg-blue-800 dark:bg-blue-950 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'"
                  >
                    {{ programsData.filter(p => p.agency === agency).length }}
                  </span>
                </motion.button>
              </div>
            </div>

            <!-- Category Filter List -->
            <div class="space-y-2">
              <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Category</label>
              <div class="flex flex-wrap lg:flex-col gap-1.5">
                <motion.button 
                  v-for="cat in categoriesList" 
                  :key="cat"
                  @click="toggleCategoryFilter(cat)"
                  class="px-3 py-1.5 lg:w-full lg:text-left text-xs font-medium rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer"
                  :class="selectedCategories.includes(cat)
                    ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-350 dark:hover:border-slate-700'"
                  :whileHover="{ scale: 1.01 }"
                  :whileTap="{ scale: 0.99 }"
                >
                  <span>{{ cat }}</span>
                </motion.button>
              </div>
            </div>

            <!-- Target Demographics / Audience Filter -->
            <div class="space-y-2">
              <label class="text-xs font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400 block mb-1">Target Audience</label>
              <div class="flex flex-wrap gap-1">
                <motion.button 
                  v-for="aud in audienceTags" 
                  :key="aud"
                  @click="toggleAudienceFilter(aud)"
                  class="px-2 py-1 text-[10px] font-medium rounded-md border transition-all cursor-pointer"
                  :class="selectedAudiences.includes(aud)
                    ? 'bg-blue-900 dark:bg-blue-800 border-blue-900 dark:border-blue-800 text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'"
                  :whileHover="{ scale: 1.04 }"
                  :whileTap="{ scale: 0.96 }"
                >
                  {{ aud }}
                </motion.button>
              </div>
            </div>

          </motion.aside>

          <!-- Feed Column -->
          <section class="lg:col-span-3 space-y-6">
            
            <!-- Filter summary stats -->
            <div class="flex justify-between items-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <span>Showing {{ filteredPrograms.length }} of {{ programsData.length }} benefits</span>
            </div>

            <!-- Empty Results -->
            <div v-if="filteredPrograms.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl">
              <Search class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
              <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">No matching programs found</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto">Try refining your keyword search, selecting broader filter tags, or clearing filters to see all available listings.</p>
              <motion.button 
                @click="clearFilters" 
                class="mt-4 px-4 py-2 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                :whileHover="{ scale: 1.04 }"
                :whileTap="{ scale: 0.96 }"
              >
                Reset Filters
              </motion.button>
            </div>

            <!-- Program Cards -->
            <ProgramCard
              v-for="program in filteredPrograms"
              :key="program.id"
              :program="program"
              :is-saved="savedPrograms.includes(program.id)"
              :is-expanded="expandedProgramId === program.id"
              :checked-requirements="checkedRequirements[program.id] || []"
              @toggle-save="toggleSaveProgram(program.id, $event)"
              @toggle-requirement="toggleRequirement(program.id, $event)"
              @toggle-expansion="toggleCardExpansion(program.id)"
            />
          </section>

        </div>
      </div>

      <!-- VIEW 2: ELIGIBILITY FINDER QUIZ -->
      <div v-if="activeTab === 'wizard'" class="space-y-6 max-w-3xl mx-auto animate-fade-in">
        <div class="text-center mb-8">
          <Sparkles class="w-12 h-12 text-blue-900 dark:text-blue-400 mx-auto" />
          <h2 class="text-3xl font-bold text-blue-900 dark:text-blue-400 mt-3">Ayuda Finder Wizard</h2>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
            Answer a few quick questions about your demographics and current situation. Our engine will calculate compatibility scores and recommend the best government programs for you.
          </p>
        </div>

        <AyudaFinder @select-program="selectProgramFromWizard" />
      </div>

      <!-- VIEW 3: SAVED SHORTLIST -->
      <div v-if="activeTab === 'shortlist'" class="space-y-6 animate-fade-in">
        
        <div class="text-left mb-8 max-w-2xl">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Star class="w-8 h-8 text-yellow-500 fill-current" /> Your Saved Benefits
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
            Review the requirements and steps for the benefits you bookmarked. All checklists and data are saved locally to your device browser.
          </p>
        </div>

        <!-- No Saved Items -->
        <div v-if="shortlistedPrograms.length === 0" class="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl max-w-2xl mx-auto">
          <Star class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">No bookmarked benefits yet</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto px-4">Browse the Benefits Directory and click the star icon on any program to save it here for offline reference.</p>
          <motion.button 
            @click="activeTab = 'directory'" 
            class="mt-4 px-5 py-2.5 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            :whileHover="{ scale: 1.04 }"
            :whileTap="{ scale: 0.96 }"
          >
            Browse Directory
          </motion.button>
        </div>

        <!-- Saved Listings -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            v-for="program in shortlistedPrograms" 
            :key="program.id"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative transition-all duration-300 hover:shadow-sm"
            :initial="{ opacity: 0, y: 15 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3 }"
            :whileHover="{ y: -3, scale: 1.005 }"
          >
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 text-[9px] font-bold uppercase rounded-md tracking-wider border border-blue-200/50 dark:border-blue-900/30">
                  {{ program.agency }}
                </span>
                <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">{{ program.name }}</h3>
              </div>
              <motion.button 
                @click="toggleSaveProgram(program.id, $event)" 
                class="hover:text-slate-400 dark:hover:text-slate-500 transition-colors p-1 cursor-pointer"
                title="Remove from shortlist"
                :whileHover="{ scale: 1.2 }"
                :whileTap="{ scale: 0.8 }"
              >
                <Star class="w-5 h-5 text-yellow-500 fill-current" />
              </motion.button>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">{{ program.description }}</p>

            <!-- Shortlist Progress Line -->
            <div class="mt-4">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">Readiness</span>
                <span class="text-[10px] font-bold text-blue-900 dark:text-blue-400">
                  {{ getCheckedCount(program.id) }} / {{ program.requirements.length }} ({{ getPreparedPercent(program) }}%)
                </span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
                <div 
                  class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300" 
                  :style="{ width: `${getPreparedPercent(program)}%` }"
                ></div>
              </div>
            </div>

            <!-- View details button -->
            <motion.button 
              @click="selectProgramFromWizard(program.id)" 
              class="w-full mt-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              :whileHover="{ scale: 1.02 }"
              :whileTap="{ scale: 0.98 }"
            >
              Expand Checklist & Steps ➔
            </motion.button>
          </motion.div>
        </div>

      </div>

      <!-- VIEW 4: DIRECTORY HOTLINES -->
      <div v-if="activeTab === 'hotlines'" class="space-y-6 max-w-4xl mx-auto animate-fade-in">
        <div class="text-left mb-8">
          <h2 class="text-3xl font-bold text-blue-900 dark:text-blue-400 tracking-tight flex items-center gap-2">
            <Phone class="w-8 h-8 text-blue-900 dark:text-blue-400" /> Official Agency Directory & Support
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
            Direct hotlines, support emails, and inquiry channels for national social benefit providers. Keep these contact points handy when submitting claims.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            v-for="(contact, idx) in hotlines" 
            :key="contact.agency"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            :initial="{ opacity: 0, y: 15 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.3, delay: idx * 0.04 }"
            :whileHover="{ y: -3, scale: 1.005 }"
          >
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">{{ contact.agency }}</h3>
              <p class="text-xs text-slate-400 dark:text-slate-400 font-medium mt-0.5">{{ contact.purpose }}</p>
            </div>

            <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2 text-xs font-semibold">
                <Phone class="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <a :href="`tel:${contact.number.split('/')[0].trim()}`" class="text-blue-900 dark:text-blue-400 hover:underline">
                  {{ contact.number }}
                </a>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <FileText class="w-4 h-4 text-slate-400 dark:text-slate-500" />
                <a :href="`mailto:${contact.email}`" class="hover:underline">
                  {{ contact.email }}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Call center warning advice -->
        <motion.div 
          class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-5 rounded-2xl mt-8 flex items-start gap-4"
          :initial="{ opacity: 0, scale: 0.95 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.3 }"
        >
          <AlertTriangle class="w-8 h-8 text-blue-900 dark:text-blue-400 shrink-0" />
          <div>
            <h4 class="font-bold text-blue-900 dark:text-blue-400 text-sm">Important Notice on Inquiries</h4>
            <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 font-normal">
              Official operating times for most government hotlines are Monday to Friday, 8:00 AM to 5:00 PM (Philippine Standard Time), except for Pag-IBIG which operates 24/7. Standard local call rates apply. When contacting, ensure you have your SSS/GSIS/PhilHealth/Pag-IBIG membership ID number ready.
            </p>
          </div>
        </motion.div>
      </div>

    </main>

    <!-- Footer / Disclaimer & Authenticity Section -->
    <footer class="mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-start text-xs text-slate-500 dark:text-slate-400">
        
        <!-- About & Version -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <span class="font-extrabold text-sm text-slate-900 dark:text-slate-100">AyudaDex</span>
            <span class="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 text-[9px] font-bold rounded">v1.2</span>
          </div>
          <p class="leading-relaxed">
            An open-source citizen initiative designed to simplify access to public welfare programs in the Philippines. Developed for informational guidance.
          </p>
        </div>

        <!-- Data Authenticity Protocol -->
        <div class="space-y-2">
          <span class="font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">Data Authenticity Protocol</span>
          <p class="leading-relaxed">
            Every benefit listed on AyudaDex features a direct link to its <strong>Official Portal</strong>. We cross-reference guidelines with published government Citizen's Charters. Last verified database update: <span class="font-semibold text-blue-900 dark:text-blue-400">May 2026</span>.
          </p>
        </div>

        <!-- Legal Disclaimer -->
        <div class="space-y-2">
          <span class="font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px] flex items-center gap-1">
            <AlertTriangle class="w-3 h-3 text-red-500" /> Official Disclaimer
          </span>
          <p class="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400 italic">
            <strong>Legal Notice:</strong> AyudaDex is NOT affiliated with, sponsored by, or endorsed by the Philippine government or any of its departments (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA). All information is provided "as is" for reference only. Government policies, links, requirements, and processing times can change at any time without notice. Always verify details with official portals.
          </p>
        </div>

      </div>

      <!-- Copyright bar -->
      <div class="mt-8 border-t border-slate-100 dark:border-slate-800 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500">
        <span>© 2026 AyudaDex Project. Released under public open-source license.</span>
        <div class="flex items-center gap-4">
          <a href="https://www.gov.ph" target="_blank" class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">Official GovPH Portal</a>
          <span>•</span>
          <a href="mailto:support@ayudadex.example.com" class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors">Report Inaccurate Data</a>
        </div>
      </div>
    </footer>
  </div>
</template>