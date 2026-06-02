<script setup lang="ts">
import {
  AlertTriangle, Github, Heart, ArrowUpRight, Lightbulb
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { useRouter } from 'vue-router'

const router = useRouter()
const { t } = useI18n()

const navigationItems = [
  { value: '/', key: 'directory' },
  { value: '/wizard', key: 'quiz' },
  { value: '/shortlist', key: 'saved' },
  { value: '/hotlines', key: 'hotlines' }
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
    class="mt-20 border-t border-slate-200 dark:border-slate-800 pt-10 pb-8 text-xs text-slate-600 dark:text-slate-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <!-- Top Row: 3 Columns Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Column 1: Brand & Slogan -->
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <img src="/betterGov_Icon.svg" alt="betterGov Logo"
              class="w-7 h-7 object-contain drop-shadow-sm dark:brightness-0 dark:invert opacity-90" />
            <span class="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">{{
              t('header.title') }}</span>
          </div>
          <p class="leading-relaxed text-slate-600 dark:text-slate-400" v-html="t('footer.desc')"></p>

          <div class="pt-1">
            <a href="https://github.com/fujiDevv/ayudadex" target="_blank"
              class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 font-bold">
              <Github class="w-3.5 h-3.5" />
              <span>{{ t('footer.repo') }}</span>
            </a>
          </div>
        </div>

        <!-- Column 2: App Navigation Links -->
        <div class="space-y-3 md:pl-8">
          <span class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">{{
            t('footer.navLabel') }}</span>
          <ul class="space-y-2 mt-3">
            <li v-for="tab in navigationItems" :key="tab.value">
              <button @click="router.push(tab.value)"
                class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left font-medium">
                <span>{{ t(`nav.${tab.key}`) }}</span>
              </button>
            </li>
            <li>
              <button @click="router.push('/suggest')"
                class="hover:text-blue-900 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-pointer text-left font-medium">
                <Lightbulb class="w-3 h-3" />
                <span>{{ t('suggest.title') }}</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- Column 3: Resources & Contribution -->
        <div class="space-y-3">
          <span class="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">{{
            t('footer.resourcesLabel') }}</span>
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

      <!-- Disclaimer Box -->
      <div class="space-y-1.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 italic">
        <p class="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 not-italic">
          <AlertTriangle class="w-3.5 h-3.5 text-amber-500" /> {{ t('footer.disclaimerTitle') }}
        </p>
        <p>{{ t('footer.disclaimerDesc') }}</p>
      </div>

      <!-- Bottom Bar -->
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-900 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
        <span>© 2026 {{ t('header.title') }} Project.</span>
        <div class="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <span>Made with</span>
          <Heart class="w-3 h-3 text-red-500 fill-current inline animate-pulse" />
          <span>for the Filipino Community.</span>
        </div>
      </div>

    </div>
  </footer>
</template>
