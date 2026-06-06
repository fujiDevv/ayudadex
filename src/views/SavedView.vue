<script setup lang="ts">
import { useRouter } from "vue-router";
import { Star } from "lucide-vue-next";
import { motion } from "motion-v";
import { useAyudaStore } from "../stores/ayudaStore";
import ProgramCard from "../components/ProgramCard.vue";

const router = useRouter();
const store = useAyudaStore();

const goToProgram = (id: string) => router.push(`/program/${id}`);
const browseDirectory = () => router.push("/");
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6">
      <div class="text-left mb-8 max-w-2xl">
        <h2
          class="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2"
        >
          <Star class="w-8 h-8 text-yellow-500 fill-current" /> {{ $t("shortlist.title") }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          {{ $t("shortlist.desc") }}
        </p>
      </div>

      <div
        v-if="store.shortlistedPrograms.length === 0"
        class="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mt-8"
      >
        <Star class="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
        <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4">
          {{ $t("shortlist.noBookmarks") }}
        </h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-md mx-auto px-4">
          {{ $t("shortlist.noBookmarksDesc") }}
        </p>
        <motion.button
          @click="browseDirectory"
          class="mt-4 px-5 py-2.5 bg-blue-900 dark:bg-blue-800 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
          :whileHover="{ scale: 1.04 }"
          :whileTap="{ scale: 0.96 }"
        >
          {{ $t("shortlist.browse") }}
        </motion.button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProgramCard
          v-for="program in store.shortlistedPrograms"
          :key="program.id"
          :program="program"
          :is-saved="true"
          :is-expanded="false"
          :checked-requirements="store.checkedRequirements[program.id] || []"
          @toggle-save="store.toggleSaveProgram(program.id, $event)"
          @toggle-expansion="goToProgram(program.id)"
        />
      </div>
    </div>
  </main>
</template>
