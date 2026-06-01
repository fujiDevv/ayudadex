<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
import { useAyudaState } from './composables/useAyudaState'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const { savedPrograms } = useAyudaState()
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-900 selection:text-white pb-16 transition-colors duration-200">
    <AppHeader :saved-count="savedPrograms.length" :is-dark="isDark" @toggle-dark="toggleDark()" />

    <!-- Router View for Dashboard or Program Detail -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Footer / Disclaimer & Authenticity Section -->
    <AppFooter />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>