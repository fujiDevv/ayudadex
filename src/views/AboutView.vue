<script setup lang="ts">
import { useRouter } from "vue-router";
import { ArrowLeft, Target, ShieldCheck, Heart, Eye, Github, Compass } from "lucide-vue-next";
import { motion } from "motion-v";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const goBack = () => router.push("/");
const githubRepoHref = "https://github.com/fujiDevv/ayuda";
</script>

<template>
  <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 animate-fade-in">
    <!-- Back button -->
    <button
      @click="goBack"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer"
    >
      <ArrowLeft class="w-4 h-4" /> {{ t("contact.backHome") }}
    </button>

    <!-- Hero Header -->
    <div
      class="bg-blue-900 dark:bg-slate-900 md:bg-gradient-to-br md:from-blue-900 md:to-indigo-950 md:dark:from-slate-900 md:dark:to-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-md mb-8 text-white relative overflow-hidden"
    >
      <!-- Decorative background glow -->
      <div class="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div class="space-y-4 relative z-10">
        <div class="flex items-center gap-2">
          <span
            class="px-2.5 py-0.5 bg-blue-500/30 text-blue-100 text-[10px] font-bold uppercase rounded-md tracking-wider border border-white/10"
          >
            Initiative
          </span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {{ t("about.title") }}
        </h1>
        <p class="text-base sm:text-lg text-blue-100/90 max-w-2xl leading-relaxed">
          {{ t("about.subtitle") }}
        </p>
      </div>
    </div>

    <!-- Mission & Vision Section -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-8"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold">
          <Target class="w-5 h-5" />
          <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {{ t("about.missionTitle") }}
          </h2>
        </div>
        <p class="text-slate-600 dark:text-slate-350 leading-relaxed text-base">
          {{ t("about.missionDesc") }}
        </p>
      </div>
    </div>

    <!-- Core Values Section -->
    <h3 class="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">
      {{ t("about.valuesTitle") }}
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Radical Transparency -->
      <motion.div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
        :whileHover="{ y: -4 }"
        :transition="{ duration: 0.2 }"
      >
        <div
          class="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-4"
        >
          <Eye class="w-5 h-5" />
        </div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">
          {{ t("about.values.transparency") }}
        </h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {{ t("about.values.transparencyDesc") }}
        </p>
      </motion.div>

      <!-- Privacy-First -->
      <motion.div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
        :whileHover="{ y: -4 }"
        :transition="{ duration: 0.2 }"
      >
        <div
          class="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl w-fit mb-4"
        >
          <ShieldCheck class="w-5 h-5" />
        </div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">
          {{ t("about.values.privacy") }}
        </h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {{ t("about.values.privacyDesc") }}
        </p>
      </motion.div>

      <!-- Accessibility -->
      <motion.div
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
        :whileHover="{ y: -4 }"
        :transition="{ duration: 0.2 }"
      >
        <div
          class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 rounded-xl w-fit mb-4"
        >
          <Heart class="w-5 h-5" />
        </div>
        <h4 class="text-base font-bold text-slate-900 dark:text-white mb-2">
          {{ t("about.values.accessibility") }}
        </h4>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {{ t("about.values.accessibilityDesc") }}
        </p>
      </motion.div>
    </div>

    <!-- Initiative Info -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-8"
    >
      <div class="space-y-4">
        <h2 class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ t("about.initiativeTitle") }}
        </h2>
        <p
          class="text-slate-600 dark:text-slate-350 leading-relaxed text-base"
          v-html="t('about.initiativeDesc')"
        ></p>
      </div>
    </div>

    <!-- GitHub Contribution CTA -->
    <div
      class="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 text-center"
    >
      <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
        {{ t("about.openSourceTitle") }}
      </h3>
      <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-6 leading-relaxed">
        {{ t("about.openSourceDesc") }}
      </p>
      <motion.a
        :href="githubRepoHref"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold rounded-xl shadow-sm hover:shadow-md cursor-pointer text-sm transition-all"
        :whileHover="{ scale: 1.03 }"
        :whileTap="{ scale: 0.97 }"
      >
        <Github class="w-5 h-5" />
        <span>{{ t("about.contribButton") }}</span>
      </motion.a>
    </div>
  </main>
</template>
