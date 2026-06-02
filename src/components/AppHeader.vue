<script setup lang="ts">
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import {
  ClipboardList, Wand2, Star, Phone, Sun, Moon, Type, MoreVertical, MapPin
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useAyudaStore } from '../stores/ayudaStore'

const store = useAyudaStore()

import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
defineProps<{
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
              <h1 class="text-xl md:text-2xl font-bold tracking-tight text-blue-900 dark:text-white">AyudaDex</h1>
              <span
                class="text-[9px] md:text-[10px] font-medium tracking-wide uppercase px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 rounded-md border border-blue-200/50 dark:border-blue-900/30">BetterGov.ph</span>
            </div>
            <p class="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Philippine
              Government
              Social Benefits Navigator</p>
          </div>
        </motion.div>

        <!-- Navigation Tabs (Desktop) -->
        <nav class="hidden md:flex items-center gap-1">
          <motion.button @click="router.push('/')"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border border-transparent"
            :class="route.path === '/'
              ? 'bg-blue-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('nav.directory') }}
          </motion.button>

          <motion.button @click="router.push('/wizard')"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border border-transparent"
            :class="route.path === '/wizard'
              ? 'bg-blue-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('nav.quiz') }}
          </motion.button>

          <motion.button @click="router.push('/shortlist')"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border border-transparent"
            :class="route.path === '/shortlist'
              ? 'bg-blue-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('nav.saved') }} ({{ savedCount }})
          </motion.button>

          <motion.button @click="router.push('/hotlines')"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border border-transparent"
            :class="route.path === '/hotlines'
              ? 'bg-blue-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('nav.hotlines') }}
          </motion.button>

          <motion.button @click="router.push('/locator')"
            class="px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 border border-transparent"
            :class="route.path === '/locator'
              ? 'bg-blue-50 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-md shadow-sm'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'"
            :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            {{ $t('nav.locator') }}
          </motion.button>
        </nav>

        <!-- Actions -->
        <div class="flex items-center gap-2 w-auto">

          <!-- Desktop Inline Actions (Hidden on Mobile/Tablet) -->
          <div class="hidden lg:flex items-center gap-2">
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
                class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50 py-1">

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
              </div>
            </transition>
          </div>
        </div>

      </div>
    </header>

    <!-- Bottom Navigation Bar (Mobile First) -->
    <nav
      class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-[env(safe-area-inset-bottom)]">
      <div class="grid grid-cols-5 h-16 text-center text-[10px] sm:text-xs font-bold">
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
