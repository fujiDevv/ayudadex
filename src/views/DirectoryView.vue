<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import programsData from '../data/programs.json'
import ProgramCard from '../components/ProgramCard.vue'
import {
  SlidersHorizontal, Search, LayoutGrid, List, X,
  Coins, Heart, GraduationCap, HeartHandshake, Home, Briefcase,
  Sparkles, ArrowRight
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import type { Program } from '../types'
import { useAyudaStore } from '../stores/ayudaStore'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const store = useAyudaStore()
const { locale } = useI18n()

const searchQuery = ref('')
const selectedAgencies = ref<string[]>([])
const selectedCategories = ref<string[]>([])
const selectedAudiences = ref<string[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const isSearchFocused = ref(false)

const agenciesList = computed(() => Array.from(new Set(programsData.map(p => p.agency))).sort())
const categoriesList = computed(() => Array.from(new Set(programsData.map(p => p.category.split(' / ')).flat())).sort())
const audienceTags = ["Indigent", "Senior Citizen", "Student", "PWD", "Unemployed", "Pregnant", "Worker", "Solo Parent", "MSME"]

const visualCategories = [
  { id: 'financial', nameEn: 'Financial Aid', nameTl: 'Pinansyal na Tulong', icon: Coins, tags: ['Financial Aid', 'Cash Loan'], color: 'from-amber-500 to-yellow-500', glow: 'hover:shadow-amber-500/10' },
  { id: 'health', nameEn: 'Medical & Health', nameTl: 'Medikal at Kalusugan', icon: Heart, tags: ['Health', 'Medical'], color: 'from-emerald-500 to-teal-500', glow: 'hover:shadow-emerald-500/10' },
  { id: 'education', nameEn: 'Education', nameTl: 'Edukasyon', icon: GraduationCap, tags: ['Education', 'Scholarship'], color: 'from-blue-500 to-sky-500', glow: 'hover:shadow-blue-500/10' },
  { id: 'pension', nameEn: 'Pensions & Seniors', nameTl: 'Pension at Senior', icon: HeartHandshake, tags: ['Pension', 'Seniors'], color: 'from-purple-500 to-indigo-500', glow: 'hover:shadow-purple-500/10' },
  { id: 'housing', nameEn: 'Housing & Property', nameTl: 'Pabahay at Lupa', icon: Home, tags: ['Housing', 'Property'], color: 'from-rose-500 to-pink-500', glow: 'hover:shadow-rose-500/10' },
  { id: 'livelihood', nameEn: 'Livelihood & Jobs', nameTl: 'Kabuhayan at Trabaho', icon: Briefcase, tags: ['Employment', 'Livelihood'], color: 'from-indigo-500 to-violet-500', glow: 'hover:shadow-indigo-500/10' }
]

const getCategoryName = (vc: any) => {
  return locale.value === 'tl' ? vc.nameTl : vc.nameEn
}

const getAgencyStyles = (agency: string) => {
  const normalized = agency.toLowerCase()
  if (normalized.includes('dswd')) {
    return 'bg-gradient-to-r from-orange-500/10 to-red-500/10 text-orange-700 dark:text-orange-300 border-orange-200/50 dark:border-orange-900/30'
  }
  if (normalized.includes('sss')) {
    return 'bg-gradient-to-r from-blue-600/10 to-indigo-600/10 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/30'
  }
  if (normalized.includes('philhealth')) {
    return 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 text-green-700 dark:text-emerald-300 border-green-200/50 dark:border-green-900/30'
  }
  if (normalized.includes('pag-ibig') || normalized.includes('hdmf')) {
    return 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/30'
  }
  if (normalized.includes('gsis')) {
    return 'bg-gradient-to-r from-teal-500/10 to-cyan-500/10 text-teal-700 dark:text-teal-300 border-teal-200/50 dark:border-teal-900/30'
  }
  if (normalized.includes('dole')) {
    return 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/50 dark:border-indigo-900/30'
  }
  if (normalized.includes('doh')) {
    return 'bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-900/30'
  }
  if (normalized.includes('owwa')) {
    return 'bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 border-violet-200/50 dark:border-violet-900/30'
  }
  if (normalized.includes('ched') || normalized.includes('unifast')) {
    return 'bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 dark:text-sky-300 border-sky-200/50 dark:border-sky-900/30'
  }
  return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-800/30'
}

const toggleVisualCategory = (tags: string[]) => {
  const allSelected = tags.every(t => selectedCategories.value.includes(t))
  if (allSelected) {
    selectedCategories.value = selectedCategories.value.filter(t => !tags.includes(t))
  } else {
    tags.forEach(t => {
      if (!selectedCategories.value.includes(t)) {
        selectedCategories.value.push(t)
      }
    })
  }
}

const isVisualCategoryActive = (tags: string[]) => {
  return tags.every(t => selectedCategories.value.includes(t))
}

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

const scrollToResults = () => {
  const el = document.getElementById('listings-container')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleBlur = () => {
  setTimeout(() => {
    isSearchFocused.value = false
  }, 200)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in space-y-10">
    <!-- Premium Hero Section -->
    <motion.div
      class="relative bg-gradient-to-br from-slate-50 via-slate-100/70 to-blue-50/50 text-slate-900 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950 dark:text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-xs dark:shadow-2xl border border-slate-200 dark:border-slate-800/80"
      :initial="{ opacity: 0, y: -20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
      <!-- Dashed Bottom Left Fade Grid -->
      <div class="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-15" style="
          background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
          background-position: 0 0, 0 0;
          mask-image: 
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
            radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);
          -webkit-mask-image: 
            repeating-linear-gradient(to right, black 0px, black 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(to bottom, black 0px, black 3px, transparent 3px, transparent 8px),
            radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        " />

      <div class="relative z-10 max-w-3xl space-y-6">
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles class="w-3.5 h-3.5" /> PH Social Benefit Finder
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 dark:from-white dark:via-slate-100 dark:to-blue-200 bg-clip-text text-transparent">
          {{ $t('hero.title') }}
        </h2>

        <p
          class="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl">
          {{ $t('hero.desc') }}
        </p>

        <!-- Floating Search Box inside Hero -->
        <div class="pt-4 max-w-xl relative z-35">
          <div class="relative group">
            <input type="text" v-model="searchQuery" @focus="isSearchFocused = true" @blur="handleBlur"
              :placeholder="$t('filters.searchPlaceholder')"
              class="w-full bg-white dark:bg-slate-955/80 text-sm sm:text-base font-normal rounded-2xl border border-slate-200 dark:border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 py-4 pl-12 pr-12 focus:outline-none transition-all text-slate-900 dark:text-slate-100 shadow-lg dark:shadow-2xl placeholder-slate-400 dark:placeholder-slate-500 group-hover:border-slate-300 dark:group-hover:border-slate-700 backdrop-blur-md" />
            <Search
              class="w-5 h-5 absolute left-4 top-4.5 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-450 transition-colors" />
            <button v-if="searchQuery" @click="searchQuery = ''"
              class="absolute right-4 top-4.5 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Autocomplete Search Results Dropdown -->
          <div v-if="searchQuery && isSearchFocused"
            class="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-lg flex flex-col max-h-[360px]">
            <div
              class="p-3 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/50 text-left">
              Matching Programs ({{ filteredPrograms.length }})
            </div>

            <div class="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              <div v-for="prog in filteredPrograms.slice(0, 5)" :key="prog.id" @mousedown="goToProgram(prog.id)"
                class="p-4 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer flex flex-col gap-1.5 transition-colors text-left">
                <div class="flex items-center justify-between gap-2">
                  <span class="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1 flex-grow">
                    {{ $t(`programs.${prog.id}.name`) }}
                  </span>
                  <span :class="getAgencyStyles(prog.agency)"
                    class="px-2 py-0.5 text-[9px] font-bold uppercase rounded border shrink-0">
                    {{ prog.agency }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                  {{ $t(`programs.${prog.id}.description`) }}
                </p>
              </div>

              <!-- No results state inside dropdown -->
              <div v-if="filteredPrograms.length === 0"
                class="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No matching benefits found
              </div>
            </div>

            <!-- View all results / scroll down option -->
            <div v-if="filteredPrograms.length > 5" @mousedown="scrollToResults"
              class="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1 transition-colors">
              View all {{ filteredPrograms.length }} results below
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <!-- Dynamic Real-time Stats -->
        <div class="grid grid-cols-3 gap-4 pt-6 max-w-lg border-t border-slate-200 dark:border-slate-800/60 text-left">
          <div>
            <span class="block text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{{
              programsData.length }}</span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wide">Assistance
              Programs</span>
          </div>
          <div>
            <span class="block text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">{{
              agenciesList.length }}</span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-550 dark:text-slate-500 uppercase tracking-wide">Agencies
              Covered</span>
          </div>
          <div>
            <span class="block text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">{{
              store.savedPrograms.length }}</span>
            <span
              class="text-[10px] sm:text-xs font-bold text-slate-555 dark:text-slate-500 uppercase tracking-wide">Bookmarked</span>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- Visual Categories Selector -->
    <div class="space-y-4">
      <h3
        class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <Sparkles class="w-4 h-4 text-blue-500" /> Explore by Category
      </h3>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <motion.button v-for="vc in visualCategories" :key="vc.id" @click="toggleVisualCategory(vc.tags)"
          class="relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer select-none bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/80"
          :class="[
            isVisualCategoryActive(vc.tags)
              ? 'ring-2 ring-blue-600 dark:ring-blue-500 border-transparent shadow-md'
              : 'hover:border-slate-300 dark:hover:border-slate-700 ' + vc.glow
          ]" :whileHover="{ y: -3, scale: 1.02 }" :whileTap="{ scale: 0.98 }">
          <!-- Colored Icon Circle -->
          <div
            class="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white mb-3 shadow-md"
            :class="vc.color">
            <component :is="vc.icon" class="w-6 h-6" />
          </div>

          <span class="text-xs font-bold text-slate-900 dark:text-slate-100 block">
            {{ getCategoryName(vc) }}
          </span>
        </motion.button>
      </div>
    </div>

    <!-- Active Filters Tags (Dismissible) -->
    <div v-if="selectedAgencies.length || selectedCategories.length || selectedAudiences.length || searchQuery"
      class="flex flex-wrap gap-2 items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
      <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active
        Filters:</span>

      <!-- Search Query Tag -->
      <span v-if="searchQuery"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-100 dark:border-blue-900/30">
        "{{ searchQuery }}"
        <button @click="searchQuery = ''" class="hover:text-blue-900 dark:hover:text-blue-100 cursor-pointer">
          <X class="w-3.5 h-3.5" />
        </button>
      </span>

      <!-- Category Tags -->
      <span v-for="cat in selectedCategories" :key="cat"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/40 dark:border-slate-800">
        {{ cat }}
        <button @click="toggleCategoryFilter(cat)"
          class="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
          <X class="w-3.5 h-3.5" />
        </button>
      </span>

      <!-- Agency Tags -->
      <span v-for="agency in selectedAgencies" :key="agency"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/40 dark:border-slate-800">
        {{ agency }}
        <button @click="toggleAgencyFilter(agency)"
          class="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
          <X class="w-3.5 h-3.5" />
        </button>
      </span>

      <!-- Audience Tags -->
      <span v-for="aud in selectedAudiences" :key="aud"
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200/40 dark:border-slate-800">
        {{ aud }}
        <button @click="toggleAudienceFilter(aud)"
          class="hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer">
          <X class="w-3.5 h-3.5" />
        </button>
      </span>

      <button @click="clearFilters"
        class="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer ml-auto">
        {{ $t('filters.clearAll') }}
      </button>
    </div>

    <!-- Main Columns Grid -->
    <div id="listings-container" class="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start scroll-mt-24">
      <!-- Refinement Sidebar -->
      <motion.aside
        class="space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm backdrop-blur-md bg-white/95 dark:bg-slate-900/95 lg:sticky lg:top-24"
        :initial="{ opacity: 0, x: -15 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.35 }">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 class="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <SlidersHorizontal class="w-4.5 h-4.5 text-blue-500 animate-pulse" /> Refine Search
          </h3>
          <button v-if="selectedAgencies.length || selectedCategories.length || selectedAudiences.length || searchQuery"
            @click="clearFilters"
            class="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
            {{ $t('filters.clearAll') }}
          </button>
        </div>

        <!-- Agency Filter Group -->
        <div class="space-y-2.5">
          <label class="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-1">
            {{ $t('filters.agency') }}
          </label>
          <div class="flex flex-wrap lg:flex-col gap-1.5">
            <motion.button v-for="agency in agenciesList" :key="agency" @click="toggleAgencyFilter(agency)"
              class="px-3 py-2 lg:w-full lg:text-left text-xs font-semibold rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer border-slate-200 dark:border-slate-800/80"
              :class="selectedAgencies.includes(agency)
                ? 'bg-blue-600 dark:bg-blue-800 border-transparent text-white shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'"
              :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.99 }">
              <span>{{ agency }}</span>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full"
                :class="selectedAgencies.includes(agency) ? 'bg-blue-700 dark:bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-955 text-slate-500 dark:text-slate-400 border border-slate-200/10 dark:border-slate-800/10'">
                {{programsData.filter(p => p.agency === agency).length}}
              </span>
            </motion.button>
          </div>
        </div>

        <!-- Categories List -->
        <div class="space-y-2.5">
          <label class="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-1">
            Subcategories
          </label>
          <div class="flex flex-wrap lg:flex-col gap-1.5">
            <motion.button v-for="cat in categoriesList" :key="cat" @click="toggleCategoryFilter(cat)"
              class="px-3 py-2 lg:w-full lg:text-left text-xs font-semibold rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer border-slate-200 dark:border-slate-800/80"
              :class="selectedCategories.includes(cat)
                ? 'bg-blue-600 dark:bg-blue-800 border-transparent text-white shadow-md shadow-blue-500/10'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'"
              :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.99 }">
              <span>{{ cat }}</span>
            </motion.button>
          </div>
        </div>

        <!-- Target Audience Filter Group -->
        <div class="space-y-2.5">
          <label class="text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500 block mb-1">
            {{ $t('filters.audience') }}
          </label>
          <div class="flex flex-wrap gap-1.5">
            <motion.button v-for="aud in audienceTags" :key="aud" @click="toggleAudienceFilter(aud)"
              class="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer border-slate-200 dark:border-slate-800/80"
              :class="selectedAudiences.includes(aud)
                ? 'bg-blue-600 dark:bg-blue-800 border-transparent text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-800/40'"
              :whileHover="{ scale: 1.04 }" :whileTap="{ scale: 0.96 }">
              {{ aud }}
            </motion.button>
          </div>
        </div>
      </motion.aside>

      <!-- Program Listings Section -->
      <section class="lg:col-span-3 space-y-6">
        <!-- Feed Control Header (Total results and Layout toggle) -->
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
          <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {{ $t('feed.showing', { count: filteredPrograms.length, total: programsData.length }) }}
          </div>

          <!-- View Toggle Switcher -->
          <div
            class="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800/40 shrink-0 self-start sm:self-auto">
            <button @click="viewMode = 'grid'"
              class="p-2 rounded-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
              :class="viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-800/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'">
              <LayoutGrid class="w-4 h-4" /> Grid
            </button>
            <button @click="viewMode = 'list'"
              class="p-2 rounded-lg flex items-center gap-1 text-xs font-bold transition-all cursor-pointer"
              :class="viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/20 dark:border-slate-800/20' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'">
              <List class="w-4 h-4" /> List
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPrograms.length === 0"
          class="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl">
          <Search class="w-12 h-12 text-slate-355 dark:text-slate-700 mx-auto" />
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">{{ $t('feed.noMatches') }}</h3>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto">{{ $t('feed.noMatchesDesc') }}</p>
          <motion.button @click="clearFilters"
            class="mt-4 px-5 py-2.5 bg-blue-600 dark:bg-blue-800 hover:bg-blue-755 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
            :whileHover="{ scale: 1.04 }" :whileTap="{ scale: 0.96 }">
            {{ $t('feed.resetFilters') }}
          </motion.button>
        </div>

        <!-- Program Cards Container -->
        <div v-else :class="[viewMode === 'list' ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-6']">
          <ProgramCard v-for="program in filteredPrograms" :key="program.id" :program="program"
            :is-saved="store.savedPrograms.includes(program.id)" :is-expanded="false"
            :checked-requirements="store.checkedRequirements[program.id] || []" :view-mode="viewMode"
            @toggle-save="store.toggleSaveProgram(program.id, $event)" @toggle-expansion="goToProgram(program.id)" />
        </div>
      </section>
    </div>
  </main>
</template>
