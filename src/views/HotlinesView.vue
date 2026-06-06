<script setup lang="ts">
import { AlertTriangle, Phone, Mail } from "lucide-vue-next";
import { motion } from "motion-v";
import { hotlines } from "../constants";

function getDialableNumber(text: string) {
  // For dial string, take everything before ' to ' or ' or '
  let clean = text.split(/\s+(?:to|or)\s+/i)[0].trim();
  // Strip prefixes like "Smart:", "Globe:", "Toll-Free:", "Hotline:", etc.
  clean = clean.replace(/^(Smart|Globe|Toll-Free|Hotline|Toll-Free Hotline)[:\s-]+\s*/i, "").trim();
  // Remove parentheticals
  clean = clean.replace(/\(.*?\)/g, "").trim();
  // Keep only digits, +, and *
  return clean.replace(/[^\d+*]/g, "");
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6 max-w-4xl mx-auto">
      <div class="text-left mb-8">
        <h2
          class="text-3xl font-bold text-slate-900 dark:text-slate-200 tracking-tight flex items-center gap-2"
        >
          {{ $t("hotlines.title") }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          {{ $t("hotlines.desc") }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          v-for="(contact, idx) in hotlines"
          :key="contact.agency"
          class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3"
          :initial="{ opacity: 0, y: 15 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.3, delay: idx * 0.04 }"
          :whileHover="{ y: -3, scale: 1.005 }"
        >
          <div>
            <h3
              class="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug"
            >
              {{ contact.agency }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {{ contact.purpose }}
            </p>
          </div>

          <div
            class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2"
          >
            <!-- Phone Numbers -->
            <div class="flex items-start gap-2 text-xs font-semibold">
              <Phone class="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
              <div class="flex flex-col gap-1.5 flex-grow">
                <a
                  v-for="phone in contact.numbers"
                  :key="phone"
                  :href="`tel:${getDialableNumber(phone)}`"
                  class="text-blue-600 dark:text-blue-400 hover:underline inline-block break-all leading-normal"
                >
                  {{ phone }}
                </a>
              </div>
            </div>
            <!-- Emails -->
            <div
              class="flex items-start gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400"
            >
              <Mail class="w-4 h-4 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
              <div class="flex flex-col gap-1.5 flex-grow">
                <a
                  v-for="email in contact.emails"
                  :key="email"
                  :href="`mailto:${email}`"
                  class="hover:underline text-slate-600 dark:text-slate-300 inline-block break-all leading-normal"
                >
                  {{ email }}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/50 p-5 rounded-2xl mt-8 flex items-start gap-4"
        :initial="{ opacity: 0, scale: 0.95 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.3 }"
      >
        <AlertTriangle class="w-8 h-8 text-blue-900 dark:text-blue-400 shrink-0" />
        <div>
          <h4 class="font-bold text-blue-900 dark:text-blue-400 text-sm">
            {{ $t("hotlines.noticeTitle") }}
          </h4>
          <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed mt-1 font-normal">
            {{ $t("hotlines.noticeDesc") }}
          </p>
        </div>
      </motion.div>
    </div>
  </main>
</template>
