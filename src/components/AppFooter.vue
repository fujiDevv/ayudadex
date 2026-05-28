<script setup lang="ts">
import { 
  AlertTriangle, Github, Heart, ShieldCheck, ArrowUpRight,
  ClipboardList, Wand2, Star, Phone
} from 'lucide-vue-next'

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
  { name: 'PhilHealth Benefits Portal', url: 'https://www.philhealth.gov.ph' }
] as const
</script>

<template>
  <footer class="mt-20 border-t border-slate-200 dark:border-slate-800 pt-12 pb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      <!-- Premium Main Footer Card -->
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm transition-colors duration-200 relative overflow-hidden">
        <!-- Subtle Top Accent Gradient Line -->
        <div class="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-900 via-indigo-700 to-blue-900"></div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
          
          <!-- Column 1: Brand & Slogan -->
          <div class="space-y-4 lg:col-span-1">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-extrabold text-sm">
                AD
              </div>
              <span class="font-extrabold text-lg text-slate-900 dark:text-slate-100 tracking-tight">AyudaDex</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
              An open-source citizen initiative designed to simplify, navigate, and track access to public welfare programs and social benefits in the Philippines.
            </p>
            
            <!-- Live Status Authenticity Widget -->
            <div class="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-500 inline" /> Database Verified: May 2026
              </span>
            </div>
          </div>

          <!-- Column 2: Navigation Tab Shortcuts -->
          <div class="space-y-3.5">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">App Navigation</h4>
            <ul class="space-y-2">
              <li v-for="tab in navigationItems" :key="tab.value">
                <button 
                  @click="activeTab = tab.value" 
                  class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <component :is="tab.icon" class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{{ tab.label }}</span>
                </button>
              </li>
            </ul>
          </div>

          <!-- Column 3: Official GovPH Resources -->
          <div class="space-y-3.5">
            <h4 class="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-widest text-[10px]">Official Portals</h4>
            <ul class="space-y-2">
              <li v-for="portal in officialPortals" :key="portal.name">
                <a 
                  :href="portal.url" 
                  target="_blank" 
                  class="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center justify-between group/link"
                >
                  <span>{{ portal.name }}</span>
                  <ArrowUpRight class="w-3 h-3 text-slate-400 dark:text-slate-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Feedback & Github Contribution Card -->
          <div class="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 lg:col-span-1">
            <h5 class="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Github class="w-4 h-4 text-slate-700 dark:text-slate-300" /> Open Source Code
            </h5>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-normal">
              AyudaDex is built by citizens for citizens. Help add new benefits or verify official requirements on GitHub.
            </p>
            <div class="pt-1.5 flex flex-col gap-2">
              <a 
                href="https://github.com/joshuasarmiento/ayudadex" 
                target="_blank" 
                class="w-full py-2 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 dark:hover:bg-blue-700 text-white text-[10px] font-bold rounded-xl text-center shadow-sm transition-all"
              >
                Contribute on GitHub
              </a>
              <a 
                href="mailto:support@ayudadex.example.com" 
                class="w-full py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-xl text-center transition-all"
              >
                Report Inaccurate Data
              </a>
            </div>
          </div>

        </div>

        <!-- Disclaimer Alert Box -->
        <div class="mt-8 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/30 p-5 rounded-2xl flex items-start gap-4 transition-colors">
          <AlertTriangle class="w-6 h-6 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
          <div class="space-y-1">
            <h5 class="font-bold text-amber-800 dark:text-amber-400 text-xs sm:text-sm">Official Civic Disclaimer Notice</h5>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal italic">
              AyudaDex is an independent open-source navigator and is <strong>not affiliated, sponsored, or endorsed by the Philippine government</strong> or any of its departments (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA). Trademarks are properties of their respective holders. All information is provided "as is" for general reference only. Operating guidelines, requirements, and rules change frequently. Always verify details directly with official agency portals before submitting welfare claims.
            </p>
          </div>
        </div>

      </div>

      <!-- Bottom Bar -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
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
