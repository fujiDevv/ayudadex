<script setup lang="ts">
import { Phone, FileText, AlertTriangle } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { hotlines } from '../constants'
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="text-left mb-8">
        <h2 class="text-3xl font-bold text-blue-900 dark:text-white tracking-tight flex items-center gap-2">
          <Phone class="w-8 h-8 text-blue-900 dark:text-white" /> Official Agency Directory & Support
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          Direct hotlines, support emails, and inquiry channels for national social benefit providers. Keep these contact points handy when submitting claims.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div v-for="(contact, idx) in hotlines" :key="contact.agency" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
          :initial="{ opacity: 0, y: 15 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.3, delay: idx * 0.04 }" :whileHover="{ y: -3, scale: 1.005 }">
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

      <motion.div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-5 rounded-2xl mt-8 flex items-start gap-4"
        :initial="{ opacity: 0, scale: 0.95 }" :animate="{ opacity: 1, scale: 1 }" :transition="{ duration: 0.3 }">
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
</template>
