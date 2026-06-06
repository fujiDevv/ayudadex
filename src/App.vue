<script setup lang="ts">
import { watchEffect } from "vue";
import { useDark, useToggle } from "@vueuse/core";
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import { useAyudaStore } from "./stores/ayudaStore";

const isDark = useDark({ initialValue: "light" });
const toggleDark = useToggle(isDark);

const store = useAyudaStore();

watchEffect(() => {
  if (store.isLargeText) {
    document.documentElement.classList.add("large-text");
  } else {
    document.documentElement.classList.remove("large-text");
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-900 selection:text-white pb-16 transition-colors duration-200"
  >
    <AppHeader
      class="print:hidden"
      :saved-count="store.savedPrograms.length"
      :is-dark="isDark"
      @toggle-dark="toggleDark()"
    />

    <!-- Router View for Dashboard or Program Detail -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Footer / Disclaimer & Authenticity Section -->
    <AppFooter class="print:hidden" />
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
