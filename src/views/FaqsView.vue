<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Search, HelpCircle, ChevronDown, MessageSquare } from "lucide-vue-next";
import { useI18n } from "vue-i18n";

const router = useRouter();
const { t } = useI18n();

const goBack = () => router.push("/");

// Selected category filter
const selectedCategory = ref("all");
const searchQuery = ref("");
const activeFaqId = ref<number | null>(null);

const faqCategories = [
  { id: "all", labelKey: "faqs.catAll" },
  { id: "general", labelKey: "faqs.catGeneral" },
  { id: "privacy", labelKey: "faqs.catPrivacy" },
  { id: "data", labelKey: "faqs.catData" },
  { id: "contrib", labelKey: "faqs.catContrib" },
];

const faqItems = [
  { id: 1, category: "general", qKey: "faqs.q1", aKey: "faqs.a1" },
  { id: 2, category: "general", qKey: "faqs.q2", aKey: "faqs.a2" },
  { id: 3, category: "privacy", qKey: "faqs.q3", aKey: "faqs.a3" },
  { id: 4, category: "data", qKey: "faqs.q4", aKey: "faqs.a4" },
  { id: 5, category: "data", qKey: "faqs.q5", aKey: "faqs.a5" },
  { id: 6, category: "contrib", qKey: "faqs.q6", aKey: "faqs.a6" },
];

const toggleFaq = (id: number) => {
  if (activeFaqId.value === id) {
    activeFaqId.value = null;
  } else {
    activeFaqId.value = id;
  }
};

// Filtered FAQs based on Category and Search Query
const filteredFaqs = computed(() => {
  return faqItems.filter((item) => {
    // Category match
    const categoryMatches =
      selectedCategory.value === "all" || item.category === selectedCategory.value;

    // Search match (checks both question and answer translations)
    const questionText = t(item.qKey).toLowerCase();
    const answerText = t(item.aKey).toLowerCase();
    const query = searchQuery.value.toLowerCase().trim();
    const searchMatches = !query || questionText.includes(query) || answerText.includes(query);

    return categoryMatches && searchMatches;
  });
});
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

    <!-- Header Card -->
    <div
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 mb-8"
    >
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <div
            class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30 text-blue-900 dark:text-blue-400"
          >
            <HelpCircle class="w-5 h-5" />
          </div>
          <span
            class="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase rounded-md tracking-wider border border-indigo-200/50 dark:border-indigo-900/30"
          >
            Help Center
          </span>
        </div>
        <h1
          class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-tight"
        >
          {{ t("faqs.title") }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-350 leading-relaxed">
          {{ t("faqs.subtitle") }}
        </p>
      </div>

      <hr class="border-slate-100 dark:border-slate-800/80 my-6" />

      <!-- Search Input -->
      <div class="relative w-full max-w-lg">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4.5 w-4.5 text-slate-400 dark:text-slate-500" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('faqs.searchPlaceholder')"
          class="block w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white dark:bg-slate-800 dark:hover:bg-slate-800/70 dark:focus:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl text-sm font-medium text-slate-950 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 transition-colors focus:outline-none"
        />
      </div>
    </div>

    <!-- Category Tabs -->
    <div
      class="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6 scrollbar-hide border-b border-slate-200/50 dark:border-slate-800"
    >
      <button
        v-for="cat in faqCategories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
        :class="
          selectedCategory === cat.id
            ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-slate-950 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-250 bg-slate-100/60 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
        "
      >
        {{ t(cat.labelKey) }}
      </button>
    </div>

    <!-- Accordion FAQ list -->
    <div v-if="filteredFaqs.length > 0" class="space-y-4">
      <div
        v-for="faq in filteredFaqs"
        :key="faq.id"
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
      >
        <button
          @click="toggleFaq(faq.id)"
          class="w-full px-6 py-4.5 text-left flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
        >
          <span class="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
            {{ t(faq.qKey) }}
          </span>
          <ChevronDown
            class="w-5 h-5 text-slate-400 dark:text-slate-500 transition-transform duration-200 shrink-0 mt-0.5"
            :class="{ 'rotate-180 text-blue-600 dark:text-blue-400': activeFaqId === faq.id }"
          />
        </button>

        <!-- Slide accordion content -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          leave-active-class="transition-all duration-200 ease-in"
          enter-from-class="max-h-0 opacity-0"
          enter-to-class="max-h-[300px] opacity-100"
          leave-from-class="max-h-[300px] opacity-100"
          leave-to-class="max-h-0 opacity-0"
        >
          <div
            v-if="activeFaqId === faq.id"
            class="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/10"
          >
            <div
              class="px-6 py-4.5 text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed"
            >
              {{ t(faq.aKey) }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- No Results State -->
    <div
      v-else
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center"
    >
      <div
        class="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-slate-400 dark:text-slate-500 rounded-full w-fit mx-auto mb-4"
      >
        <MessageSquare class="w-8 h-8" />
      </div>
      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">
        {{ t("faqs.noResults") }}
      </h3>
    </div>
  </main>
</template>
