<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
  ClipboardList, Wand2, Star, Phone, Sun, Moon, Type, MoreVertical, MapPin,
  Github, Lightbulb, Globe, ChevronDown, FileText
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useAyudaStore } from '../stores/ayudaStore'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const store = useAyudaStore()
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const props = defineProps<{
  savedCount: number
  isDark: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-dark'): void
}>()

const isMenuOpen = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false
  }
})

// Navigation Dropdown State & Handlers
const isNavDropdownOpen = ref(false)
const navDropdownRef = ref(null)

onClickOutside(navDropdownRef, () => {
  if (isNavDropdownOpen.value) {
    isNavDropdownOpen.value = false
  }
})

const navItems = computed(() => [
  { path: '/', label: t('nav.directory'), icon: ClipboardList },
  { path: '/wizard', label: t('nav.quiz'), icon: Wand2 },
  { path: '/assistance', label: t('nav.assistance'), icon: FileText },
  { path: '/shortlist', label: t('nav.saved') + ` (${props.savedCount})`, icon: Star },
  { path: '/hotlines', label: t('nav.hotlines'), icon: Phone },
  { path: '/locator', label: t('nav.locator'), icon: MapPin }
])

const currentNavItem = computed(() => {
  if (route.path.startsWith('/program/')) {
    return { path: '/', label: t('nav.directory'), icon: ClipboardList }
  }
  return navItems.value.find(item => item.path === route.path) || { path: '/', label: t('nav.directory'), icon: ClipboardList }
})

const navigate = (path: string) => {
  router.push(path)
  isNavDropdownOpen.value = false
}
</script>

<template>
  <div>
    <!-- Navbar / Premium Header -->
    <header
      class="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">

        <!-- Logo and Slogan -->
        <motion.div class="flex items-center gap-2 md:gap-3" :initial="{ opacity: 0, x: -15 }"
          :animate="{ opacity: 1, x: 0 }" :transition="{ type: 'spring', stiffness: 300, damping: 20 }">
          <img src="/betterGov_Icon.svg" alt="betterGov Logo"
            class="w-8 h-8 md:w-10 md:h-10 object-contain drop-shadow-md drop-shadow-sm dark:brightness-0 dark:invert opacity-90" />
          <div>
            <div class="flex items-center gap-1.5">
              <h1 class="text-xl md:text-2xl font-bold tracking-tight text-blue-900 dark:text-white">Ayuda</h1>
            </div>
            <p class="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Philippine
              Government
              Social Benefits Navigator</p>
          </div>
        </motion.div>

        <!-- Actions -->
        <div class="flex items-center gap-2 w-auto">

          <!-- Navigation Dropdown (Desktop) -->
          <div class="hidden md:flex items-center">
            <div ref="navDropdownRef" class="relative">
              <motion.button @click="isNavDropdownOpen = !isNavDropdownOpen"
                class="px-2.5 py-1.5 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white"
                :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }" aria-label="Navigation menu"
                :aria-expanded="isNavDropdownOpen">
                <component :is="currentNavItem.icon" class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>{{ currentNavItem.label }}</span>
                <ChevronDown class="w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform duration-200"
                  :class="{ 'rotate-180': isNavDropdownOpen }" />
              </motion.button>

              <!-- Dropdown Menu -->
              <transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-95 -translate-y-2 opacity-0"
                enter-to-class="transform scale-100 translate-y-0 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-100 translate-y-0 opacity-100"
                leave-to-class="transform scale-95 -translate-y-2 opacity-0">
                <div v-if="isNavDropdownOpen"
                  class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1.5">
                  <button v-for="item in navItems" :key="item.path" @click="navigate(item.path)"
                    class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                    :class="route.path === item.path ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-900 dark:text-blue-200' : ''">
                    <component :is="item.icon" class="w-4 h-4 text-slate-400"
                      :class="route.path === item.path ? 'text-blue-600 dark:text-blue-400' : ''" />
                    <span class="text-sm">{{ item.label }}</span>
                  </button>
                </div>
              </transition>
            </div>
          </div>

          <!-- Desktop Inline Actions (Hidden on Mobile/Tablet) -->
          <div class="hidden lg:flex items-center gap-2">
            <!-- Suggest Update Button -->
            <motion.button @click="router.push('/suggest')"
              class="px-2 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              :class="route.path === '/suggest'
                ? 'text-amber-600 dark:text-amber-400 font-extrabold'
                : 'text-slate-600 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400'"
              :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
              <Lightbulb class="w-4 h-4 text-amber-500" />
              <span>{{ $t('detail.suggestUpdate') }}</span>
            </motion.button>

            <!-- BetterGov.ph Link -->
            <a href="https://bettergov.ph/" target="_blank" rel="noopener noreferrer"
              class="px-2 py-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all flex items-center gap-1.5 cursor-pointer">
              <Globe class="w-4 h-4 text-blue-500" />
              <span>BetterGov.ph</span>
            </a>

            <!-- GitHub Link -->
            <a href="https://github.com/fujiDevv/ayuda" target="_blank" rel="noopener noreferrer"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer"
              title="GitHub Repository">
              <Github class="w-5 h-5" />
            </a>

            <!-- Divider -->
            <div class="w-[1px] h-5 bg-slate-200 dark:bg-slate-700 mx-1"></div>

            <!-- Language Switcher -->
            <div class="relative flex items-center">
              <select v-model="$i18n.locale"
                class="appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="en">EN</option>
                <option value="tl">TL</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <!-- Large Text Toggle -->
            <motion.button @click="store.toggleLargeText()" :aria-label="$t('nav.largeText') || 'Toggle Large Text'"
              :aria-pressed="store.isLargeText"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              :class="store.isLargeText ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-slate-800' : ''"
              :whileHover="{ scale: 1.12 }" :whileTap="{ scale: 0.88 }">
              <Type class="w-5 h-5" />
            </motion.button>

            <!-- Dark Mode Toggle -->
            <motion.button @click="emit('toggle-dark')" :aria-label="$t('nav.darkMode') || 'Toggle Dark Mode'"
              :aria-pressed="isDark"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              :whileHover="{ scale: 1.12, rotate: 12 }" :whileTap="{ scale: 0.88 }">
              <Sun v-if="isDark" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </motion.button>
          </div>

          <!-- Mobile & Tablet Settings Dropdown -->
          <div ref="dropdownRef" class="relative flex items-center w-auto lg:hidden">
            <motion.button @click="isMenuOpen = !isMenuOpen" aria-label="Menu options"
              class="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              :class="isMenuOpen ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : ''"
              :whileHover="{ scale: 1.12 }" :whileTap="{ scale: 0.88 }">
              <MoreVertical class="w-5 h-5" />
            </motion.button>

            <!-- Dropdown Menu -->
            <transition enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0">
              <div v-if="isMenuOpen"
                class="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1">

                <!-- Language -->
                <div
                  class="px-4 py-2 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">Language</span>
                  <div class="relative flex items-center">
                    <select v-model="$i18n.locale"
                      class="appearance-none bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg pl-2 pr-6 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      <option value="en">EN</option>
                      <option value="tl">TL</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-500">
                      <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Large Text Toggle -->
                <button @click="store.toggleLargeText(); isMenuOpen = false"
                  class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <Type class="w-4 h-4 text-slate-500"
                    :class="store.isLargeText ? 'text-blue-600 dark:text-blue-400' : ''" />
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300"
                    :class="store.isLargeText ? 'text-blue-600 dark:text-blue-400' : ''">
                    {{ store.isLargeText ? 'Normal Text' : 'Large Text' }}
                  </span>
                </button>

                <!-- Dark Mode Toggle -->
                <button @click="emit('toggle-dark'); isMenuOpen = false"
                  class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <Sun v-if="isDark" class="w-4 h-4 text-slate-500" />
                  <Moon v-else class="w-4 h-4 text-slate-500" />
                  <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {{ isDark ? 'Light Mode' : 'Dark Mode' }}
                  </span>
                </button>

                <!-- Divider -->
                <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>

                <!-- Suggest Update -->
                <button @click="router.push('/suggest'); isMenuOpen = false"
                  class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                  :class="route.path === '/suggest' ? 'bg-blue-50/50 dark:bg-blue-950/20 font-bold text-blue-900 dark:text-blue-200' : ''">
                  <Lightbulb class="w-4 h-4 text-slate-500"
                    :class="route.path === '/suggest' ? 'text-blue-600 dark:text-blue-400' : ''" />
                  <span class="text-sm font-medium">{{ $t('detail.suggestUpdate') }}</span>
                </button>

                <!-- BetterGov.ph Link -->
                <a href="https://bettergov.ph/" target="_blank" rel="noopener noreferrer" @click="isMenuOpen = false"
                  class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                  <Globe class="w-4 h-4 text-slate-500" />
                  <span class="text-sm font-medium">BetterGov.ph</span>
                </a>

                <!-- GitHub Link -->
                <a href="https://github.com/fujiDevv/ayuda" target="_blank" rel="noopener noreferrer"
                  @click="isMenuOpen = false"
                  class="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer text-slate-700 dark:text-slate-300 font-medium">
                  <Github class="w-4 h-4 text-slate-500" />
                  <span class="text-sm font-medium">GitHub</span>
                </a>
              </div>
            </transition>
          </div>
        </div>

      </div>
    </header>

    <!-- Bottom Navigation Bar (Mobile First) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div class="grid grid-cols-6 h-16 text-center text-[10px] sm:text-xs font-bold">
        <motion.button @click="router.push('/')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <ClipboardList class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.directory') }}</span>
        </motion.button>
        <motion.button @click="router.push('/wizard')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/wizard' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <Wand2 class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/wizard' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.quiz') }}</span>
        </motion.button>
        <motion.button @click="router.push('/assistance')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/assistance' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <FileText class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/assistance' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.assistance') }}</span>
        </motion.button>
        <motion.button @click="router.push('/shortlist')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/shortlist' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <Star class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/shortlist' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.saved') }} ({{ savedCount }})</span>
        </motion.button>
        <motion.button @click="router.push('/hotlines')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/hotlines' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <Phone class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/hotlines' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.hotlines') }}</span>
        </motion.button>
        <motion.button @click="router.push('/locator')"
          class="flex flex-col items-center justify-center gap-0 sm:gap-1 cursor-pointer transition-colors"
          :class="route.path === '/locator' ? 'text-blue-900 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'"
          :whileTap="{ scale: 0.95 }">
          <MapPin class="w-6 h-6 sm:w-5 sm:h-5"
            :class="route.path === '/locator' ? 'text-blue-600 dark:text-blue-400' : ''" />
          <span class="hidden sm:block truncate w-full px-1">{{ $t('nav.locator') }}</span>
        </motion.button>
      </div>
    </nav>
  </div>
</template>
