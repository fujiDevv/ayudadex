<script setup lang="ts">
import {
  AlertTriangle, Github, Heart, ArrowUpRight,
  ClipboardList, Wand2, Star, Phone, Mail, CheckCircle2
} from 'lucide-vue-next'
import { motion } from 'motion-v'

const activeTab = defineModel<'directory' | 'wizard' | 'shortlist' | 'hotlines'>({ required: true })

const navigationItems = [
  { value: 'directory', label: 'Benefits Directory', icon: ClipboardList },
  { value: 'wizard', label: 'Eligibility Quiz', icon: Wand2 },
  { value: 'shortlist', label: 'Saved Checklist', icon: Star },
  { value: 'hotlines', label: 'Support Hotlines', icon: Phone }
] as const

const officialPortals = [
  { name: 'GovPH Official Portal', url: 'https://www.gov.ph' },
  { name: 'DSWD Citizen Charter', url: 'https://www.dswd.gov.ph' },
  { name: 'SSS Member Portal', url: 'https://www.sss.gov.ph' },
  { name: 'PhilHealth Benefits Portal', url: 'https://www.philhealth.gov.ph' },
  { name: 'Pag-IBIG Fund Portal', url: 'https://www.pagibigfund.gov.ph' }
] as const
</script>

<template>
  <footer class="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      <!-- Premium Main Footer Card -->
      <div
        class="bg-linear-to-b from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-200 relative overflow-hidden">
        <!-- Subtle Top Accent Gradient Line -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-900 via-indigo-700 to-blue-900">
        </div>

        <!-- Upper Section: Dashboard Stats & Newsletter -->
        <div
          class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start pb-8 border-b border-slate-200/60 dark:border-slate-800/60">

          <!-- Left side: Slogan, Status & Stats -->
          <div class="space-y-6">
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <div
                  class="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
                  AD
                </div>
                <span class="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight">AyudaDex</span>
              </div>
              <p class="text-xs text-slate-505 dark:text-slate-400 leading-relaxed font-normal max-w-lg">
                An open-source citizen initiative designed to simplify, navigate, and track access to public welfare
                programs and social benefits in the Philippines.
              </p>
            </div>

            <!-- Dashboard Stats Grid -->
            <div class="grid grid-cols-3 gap-3 max-w-sm">
              <div
                class="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-center shadow-xs">
                <span class="block text-base font-extrabold text-blue-900 dark:text-blue-400">12</span>
                <span
                  class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Programs</span>
              </div>
              <div
                class="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-center shadow-xs">
                <span class="block text-base font-extrabold text-blue-900 dark:text-blue-400">8</span>
                <span
                  class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Agencies</span>
              </div>
              <div
                class="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800/60 text-center shadow-xs">
                <span
                  class="block text-base font-extrabold text-emerald-600 dark:text-emerald-500 flex items-center justify-center gap-0.5">
                  <CheckCircle2 class="w-3.5 h-3.5" /> 100%
                </span>
                <span
                  class="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">Verified</span>
              </div>
            </div>
          </div>

          <!-- Right side: Updates Subscription Card -->
          <div
            class="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-4 shadow-xs">
            <div>
              <h4 class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Mail class="w-4 h-4 text-blue-900 dark:text-blue-400" /> Stay Updated
              </h4>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-1">
                Receive notifications when government welfare guidelines, processing steps, or requirements are updated.
              </p>
            </div>

            <div class="flex gap-2">
              <input type="email" placeholder="Enter your email address"
                class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 w-full" />
              <motion.button
                class="px-4 py-2 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
                Get Updates
              </motion.button>
            </div>
          </div>

        </div>

        <!-- Middle Section: Navigation & Portals -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 items-start pt-8">

          <!-- Column 1: App Navigation -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">App
              Navigation</h4>
            <ul class="space-y-2.5">
              <li v-for="tab in navigationItems" :key="tab.value">
                <button @click="activeTab = tab.value"
                  class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-2 cursor-pointer group">
                  <component :is="tab.icon"
                    class="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors" />
                  <span>{{ tab.label }}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 2: Official Portals Links -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">
              Official Portals</h4>
            <ul class="space-y-2.5">
              <li v-for="portal in officialPortals" :key="portal.name">
                <a :href="portal.url" target="_blank"
                  class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center justify-between group/link">
                  <span>{{ portal.name }}</span>
                  <ArrowUpRight
                    class="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Developer & Support Actions -->
          <div class="space-y-4">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">
              Contribution & Feedback</h4>
            <div class="space-y-2 max-w-xs">
              <a href="https://github.com/joshuasarmiento/ayudadex" target="_blank"
                class="flex items-center justify-between p-3 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all group">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Github class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>GitHub Repository</span>
                </div>
                <ArrowUpRight
                  class="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <a href="mailto:support@ayudadex.example.com"
                class="flex items-center justify-between p-3 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl transition-all group">
                <div class="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Mail class="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>Report Inaccurate Data</span>
                </div>
                <ArrowUpRight
                  class="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        <!-- Lower Section: Disclaimer Alert Box -->
        <div
          class="mt-10 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-5 rounded-2xl flex items-start gap-4 transition-colors">
          <AlertTriangle class="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div class="space-y-1">
            <h5 class="font-bold text-amber-800 dark:text-amber-400 text-xs sm:text-sm">Official Civic Disclaimer Notice
            </h5>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal italic">
              AyudaDex is an independent open-source navigator and is <strong>not affiliated, sponsored, or endorsed by
                the Philippine government</strong> or any of its departments (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG,
              DOLE, DOH, OWWA). Trademarks are properties of their respective holders. All information is provided "as
              is" for general reference only. Operating guidelines, requirements, and rules change frequently. Always
              verify details directly with official agency portals before submitting welfare claims.
            </p>
          </div>
        </div>

      </div>

      <!-- Bottom Copyright Bar -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <span class="flex items-center gap-1 text-slate-400">
          © 2026 AyudaDex Project. Released under public open-source license.
        </span>
        <div class="flex items-center gap-1.5 text-slate-400">
          <span>Made with</span>
          <Heart class="w-3 h-3 text-red-500 fill-current inline animate-pulse" />
          <span>for the Filipino Community.</span>
        </div>
      </div>

    </div>
  </footer>
</template>
