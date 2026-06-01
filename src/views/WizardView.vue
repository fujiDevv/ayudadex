<script setup lang="ts">
import { useRouter } from 'vue-router'
import AyudaFinder from '../components/AyudaFinder.vue'

const router = useRouter()

const selectProgramFromWizard = (programId: string) => {
  router.push(`/program/${programId}`)
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in">
    <div class="space-y-6 max-w-3xl mx-auto">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-blue-900 dark:text-white mt-3">Ayuda Finder Wizard</h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          Answer a few quick questions about your demographics and current situation. Our engine will calculate
          compatibility scores and recommend the best government programs for you.
        </p>
      </div>
      <AyudaFinder @select-program="selectProgramFromWizard" />
    </div>
  </main>
</template>
