<script setup lang="ts">
import {
  AlertTriangle, Github, Heart, ArrowUpRight
} from 'lucide-vue-next'

import { useRouter } from 'vue-router'

const router = useRouter()

const navigationItems = [
  { value: '/', label: 'Benefits Directory' },
  { value: '/wizard', label: 'Eligibility Quiz' },
  { value: '/shortlist', label: 'Saved Checklist' },
  { value: '/hotlines', label: 'Support Hotlines' }
] as const

const officialPortals = [
  { name: 'GovPH Official Portal', url: 'https://www.gov.ph' },
  { name: 'DSWD Citizen Charter', url: 'https://www.dswd.gov.ph' },
  { name: 'SSS Member Portal', url: 'https://www.sss.gov.ph' },
  { name: 'PhilHealth Benefits Portal', url: 'https://www.philhealth.gov.ph' },
  { name: 'betterGov.ph', url: 'https://bettergov.ph/' }
] as const
</script>

<template>
  <footer
    class="mt-20 border-t border-slate-200 dark:border-slate-800 pt-10 pb-8 text-xs text-slate-500 dark:text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <!-- Top Row: 3 Columns Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Column 1: Brand & Slogan -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <img src="/betterGov_Icon-Primary.svg" alt="betterGov Logo"
              class="w-7 h-7 object-contain drop-shadow-sm dark:brightness-0 dark:invert opacity-90" />
            <span class="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">AyudaDex</span>
          </div>
          <p class="leading-relaxed text-slate-500 dark:text-slate-400">
            An open-source citizen initiative designed to simplify and track access to public welfare programs in the
            Philippines. Developed for informational guidance.
          </p>

          <div class="pt-1">
            <a href="https://github.com/joshuasarmiento/ayudadex" target="_blank"
              class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 font-bold">
              <Github class="w-3.5 h-3.5" />
              <span>GitHub Repository</span>
            </a>
          </div>
        </div>

        <!-- Column 2: App Navigation Links -->
        <div class="space-y-3 md:pl-8">
          <span
            class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Navigation</span>
          <ul class="space-y-2 mt-3">
            <li v-for="tab in navigationItems" :key="tab.value">
              <button @click="router.push(tab.value)"
                class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left font-medium">
                <span>{{ tab.label }}</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Column 3: Resources & Contribution -->
        <div class="space-y-3">
          <span
            class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Resources</span>
          <ul class="space-y-2 mt-3">
            <li v-for="portal in officialPortals" :key="portal.name">
              <a :href="portal.url" target="_blank"
                class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1 font-medium">
                <span>{{ portal.name }}</span>
                <ArrowUpRight class="w-3 h-3 text-slate-400 dark:text-slate-600" />
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Divider -->
      <div class="border-t border-slate-100 dark:border-slate-900"></div>

      <!-- Disclaimer Box (Clean and Minimalist text) -->
      <div class="space-y-1.5 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500 italic">
        <p class="flex items-center gap-1.5 font-semibold text-slate-500 dark:text-slate-400 not-italic">
          <AlertTriangle class="w-3.5 h-3.5 text-amber-500" /> Official Disclaimer Notice
        </p>
        <p>
          AyudaDex is an independent open-source navigator and is NOT affiliated with, sponsored by, or endorsed by the
          government of the Philippines or any of its offices (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA).
          Trademarks are property of their respective owners. All guidelines are for informational reference only.
          Always verify rules, requirements, and deadlines on official government agency portals.
        </p>
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <span>© 2026 AyudaDex Project.</span>
        <div class="flex items-center gap-1 text-slate-400">
          <span>Made with</span>
          <Heart class="w-3 h-3 text-red-500 fill-current inline animate-pulse" />
          <span>for the Filipino Community.</span>
        </div>
      </div>

    </div>
  </footer>
</template>
