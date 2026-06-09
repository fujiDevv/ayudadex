<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, LayoutGrid, FileText, Settings } from "lucide-vue-next";
import { motion } from "motion-v";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const goBack = () => router.push("/");

const coreTools = [
  { path: "/", titleKey: "nav.directory", descKey: "hero.desc" },
  { path: "/wizard", titleKey: "nav.quiz", descKey: "wizard.desc" },
  { path: "/pathways", titleKey: "nav.pathways", descKey: "pathways.desc" },
  { path: "/assistance", titleKey: "nav.assistance", descKey: "assistance.desc" },
  { path: "/shortlist", titleKey: "nav.saved", descKey: "shortlist.desc" },
];

const resourceTools = [
  { path: "/hotlines", titleKey: "nav.hotlines", descKey: "hotlines.desc" },
  { path: "/locator", titleKey: "nav.locator", descKey: "locator.desc" },
  { path: "/analytics", titleKey: "nav.analytics", descKey: "analytics.subtitle" },
];

const metaTools = [
  { path: "/about", titleKey: "nav.about", descKey: "about.subtitle" },
  { path: "/faqs", titleKey: "nav.faqs", descKey: "faqs.subtitle" },
  { path: "/contact", titleKey: "contact.title", descKey: "contact.subtitle" },
];
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 animate-fade-in">
    <!-- Back button -->
    <button @click="goBack"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> {{ t("contact.backHome") }}
    </button>

    <!-- Header -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-8">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span
            class="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider border border-emerald-200/50 dark:border-emerald-900/30">
            Navigation Map
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {{ t("sitemap.title") }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-350 leading-relaxed">
          {{ t("sitemap.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Sitemap Sections Grid -->
    <div class="space-y-8">
      <!-- Section 1: Core Navigation -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold px-1">
          <LayoutGrid class="w-5 h-5" />
          <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t("sitemap.coreTools") }}
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
          {{ t("sitemap.coreToolsDesc") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div v-for="item in coreTools" :key="item.path"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
            @click="router.push(item.path)" :whileHover="{ y: -2 }" :transition="{ duration: 0.15 }">
            <div class="space-y-2">
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {{ t(item.titleKey) }}
              </h3>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t(item.descKey) }}
              </p>
            </div>
            <div class="text-xs font-bold text-blue-600 dark:text-blue-400 mt-4 flex items-center gap-1">
              Go to page ➔
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Section 2: Resources & Contacts -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold px-1">
          <FileText class="w-5 h-5" />
          <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t("sitemap.resources") }}
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
          {{ t("sitemap.resourcesDesc") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div v-for="item in resourceTools" :key="item.path"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer flex flex-col justify-between"
            @click="router.push(item.path)" :whileHover="{ y: -2 }" :transition="{ duration: 0.15 }">
            <div class="space-y-2">
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {{ t(item.titleKey) }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t(item.descKey) }}
              </p>
            </div>
            <div class="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-4 flex items-center gap-1">
              Go to page ➔
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Section 3: About & Project Info -->
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-bold px-1">
          <Settings class="w-5 h-5" />
          <h2 class="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t("sitemap.meta") }}
          </h2>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 px-1">
          {{ t("sitemap.metaDesc") }}
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div v-for="item in metaTools" :key="item.path"
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-md hover:border-slate-650 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
            @click="router.push(item.path)" :whileHover="{ y: -2 }" :transition="{ duration: 0.15 }">
            <div class="space-y-2">
              <h3 class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                {{ t(item.titleKey) }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {{ t(item.descKey) }}
              </p>
            </div>
            <div class="text-xs font-bold text-slate-600 dark:text-slate-400 mt-4 flex items-center gap-1">
              Go to page ➔
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </main>
</template>
