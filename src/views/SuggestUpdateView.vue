<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Mail, ExternalLink, Github, Lightbulb
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const { t } = useI18n()

const goBack = () => router.push('/')

const emailHref = 'mailto:fujidevv@duck.com?subject=AyudaDex%20Feedback%20%2F%20Suggestion'
const discordHref = 'https://discord.com/invite/mHtThpN8bT'
const githubHref = 'https://github.com/fujiDevv/ayudadex/issues/new'
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 animate-fade-in">

    <button @click="goBack"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> {{ t('suggest.backHome') }}
    </button>

    <!-- Header -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30">
            <Lightbulb class="w-5 h-5 text-blue-900 dark:text-blue-400" />
          </div>
          <span
            class="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider border border-emerald-200/50 dark:border-emerald-900/30">
            Feedback
          </span>
        </div>
        <h1
          class="text-2xl sm:text-3xl font-bold font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {{ t('suggest.title') }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ t('suggest.subtitle') }}
        </p>
      </div>

      <hr class="border-slate-100 dark:border-slate-800 my-8" />

      <!-- Three Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Email Us Card -->
        <motion.a :href="emailHref"
          class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer group"
          :whileHover="{ y: -4 }" :transition="{ duration: 0.2 }">
          <div class="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-4">
            <Mail class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2 flex items-center gap-1.5">
            {{ t('suggest.emailUs') }}
            <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
            {{ t('suggest.emailUsDesc') }}
          </p>
        </motion.a>

        <!-- Discord Community Card -->
        <motion.a :href="discordHref" target="_blank" rel="noopener noreferrer"
          class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer group"
          :whileHover="{ y: -4 }" :transition="{ duration: 0.2 }">
          <div class="p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl w-fit mb-4">
            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.075 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
            </svg>
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2 flex items-center gap-1.5">
            {{ t('suggest.discord') }}
            <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
            {{ t('suggest.discordDesc') }}
          </p>
        </motion.a>

        <!-- Report Issues Card -->
        <motion.a :href="githubHref" target="_blank" rel="noopener noreferrer"
          class="flex flex-col h-full bg-slate-50 dark:bg-slate-900/40 hover:bg-white dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-700 dark:hover:border-slate-600 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md cursor-pointer group"
          :whileHover="{ y: -4 }" :transition="{ duration: 0.2 }">
          <div class="p-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl w-fit mb-4">
            <Github class="w-6 h-6" />
          </div>
          <h3 class="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2 flex items-center gap-1.5">
            {{ t('suggest.reportIssues') }}
            <ExternalLink class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-1">
            {{ t('suggest.reportIssuesDesc') }}
          </p>
        </motion.a>

      </div>
    </div>

  </main>
</template>
