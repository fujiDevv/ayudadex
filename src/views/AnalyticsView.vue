<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import programsData from "../data/programs.json";
import {
  ClipboardList,
  BarChart3,
  Landmark,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Eye,
  UserCheck,
  Tag,
} from "lucide-vue-next";
import { motion } from "motion-v";

const router = useRouter();
const { locale } = useI18n();

// Active interactive state details
const activeAgency = ref<string | null>(null);
const hoveredCategory = ref<string | null>(null);
const activeAudience = ref<string | null>(null);
const activeTag = ref<string | null>(null);

const toggleAgency = (agencyName: string) => {
  activeAgency.value = activeAgency.value === agencyName ? null : agencyName;
};

const toggleAudience = (audienceName: string) => {
  activeAudience.value = activeAudience.value === audienceName ? null : audienceName;
};

const toggleTag = (tagName: string) => {
  activeTag.value = activeTag.value === tagName ? null : tagName;
};

const toggleCategory = (categoryName: string) => {
  hoveredCategory.value = hoveredCategory.value === categoryName ? null : categoryName;
};

// Agency color configuration mapping (matching theme styles)
const getAgencyTheme = (agency: string) => {
  const normalized = agency.toLowerCase();
  if (normalized.includes("dswd")) {
    return {
      barColor: "bg-orange-500 sm:bg-gradient-to-r sm:from-orange-500 sm:to-red-500",
      gradient: "linear-gradient(to right, var(--color-orange-500), var(--color-red-500))",
      textColor: "text-orange-600 dark:text-orange-400",
      borderColor: "border-orange-200 dark:border-orange-900/50",
      badgeColor: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
    };
  }
  if (normalized.includes("sss")) {
    return {
      barColor: "bg-blue-600 sm:bg-gradient-to-r sm:from-blue-600 sm:to-indigo-600",
      gradient: "linear-gradient(to right, var(--color-blue-600), var(--color-indigo-600))",
      textColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-200 dark:border-blue-900/50",
      badgeColor: "bg-blue-600/10 text-blue-700 dark:text-blue-300",
    };
  }
  if (normalized.includes("philhealth")) {
    return {
      barColor: "bg-green-500 sm:bg-gradient-to-r sm:from-green-500 sm:to-emerald-500",
      gradient: "linear-gradient(to right, var(--color-green-500), var(--color-emerald-500))",
      textColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-200 dark:border-green-900/50",
      badgeColor: "bg-green-500/10 text-green-700 dark:text-green-300",
    };
  }
  if (normalized.includes("pag-ibig") || normalized.includes("hdmf")) {
    return {
      barColor: "bg-amber-500 sm:bg-gradient-to-r sm:from-amber-500 sm:to-yellow-500",
      gradient: "linear-gradient(to right, var(--color-amber-500), var(--color-yellow-500))",
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-900/50",
      badgeColor: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    };
  }
  if (normalized.includes("gsis")) {
    return {
      barColor: "bg-teal-500 sm:bg-gradient-to-r sm:from-teal-500 sm:to-cyan-500",
      gradient: "linear-gradient(to right, var(--color-teal-500), var(--color-cyan-500))",
      textColor: "text-teal-600 dark:text-teal-400",
      borderColor: "border-teal-200 dark:border-teal-900/50",
      badgeColor: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
    };
  }
  if (normalized.includes("dole")) {
    return {
      barColor: "bg-indigo-500 sm:bg-gradient-to-r sm:from-indigo-500 sm:to-purple-500",
      gradient: "linear-gradient(to right, var(--color-indigo-500), var(--color-purple-500))",
      textColor: "text-indigo-600 dark:text-indigo-400",
      borderColor: "border-indigo-200 dark:border-indigo-900/50",
      badgeColor: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
    };
  }
  if (normalized.includes("doh")) {
    return {
      barColor: "bg-rose-500 sm:bg-gradient-to-r sm:from-rose-500 sm:to-red-500",
      gradient: "linear-gradient(to right, var(--color-rose-500), var(--color-red-500))",
      textColor: "text-rose-600 dark:text-rose-400",
      borderColor: "border-rose-200 dark:border-rose-900/50",
      badgeColor: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    };
  }
  if (normalized.includes("owwa")) {
    return {
      barColor: "bg-violet-500 sm:bg-gradient-to-r sm:from-violet-500 sm:to-fuchsia-500",
      gradient: "linear-gradient(to right, var(--color-violet-500), var(--color-fuchsia-500))",
      textColor: "text-violet-600 dark:text-violet-400",
      borderColor: "border-violet-200 dark:border-violet-900/50",
      badgeColor: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
    };
  }
  if (normalized.includes("ched") || normalized.includes("unifast")) {
    return {
      barColor: "bg-sky-500 sm:bg-gradient-to-r sm:from-sky-500 sm:to-blue-500",
      gradient: "linear-gradient(to right, var(--color-sky-500), var(--color-blue-500))",
      textColor: "text-sky-600 dark:text-sky-400",
      borderColor: "border-sky-200 dark:border-sky-900/50",
      badgeColor: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    };
  }
  return {
    barColor: "bg-slate-500 sm:bg-gradient-to-r sm:from-slate-500 sm:to-slate-600",
    gradient: "linear-gradient(to right, var(--color-slate-500), var(--color-slate-600))",
    textColor: "text-slate-600 dark:text-slate-400",
    borderColor: "border-slate-200 dark:border-slate-800",
    badgeColor: "bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-300",
  };
};

// Translations for category data in charts
const translateCategory = (cat: string) => {
  if (locale.value !== "tl") return cat;
  const translations: Record<string, string> = {
    Financial: "Pinansyal",
    Education: "Edukasyon",
    Pension: "Pensyon",
    "Cash Allowance": "Allowance sa Cash",
    Burial: "Pagpapalibing",
    Medical: "Medikal",
    Healthcare: "Pangangalagang Pangkalusugan",
    Livelihood: "Kabuhayan",
    Loan: "Pautang",
    Retirement: "Pagreretiro",
    Family: "Pamilya",
    Seniors: "Senior Citizen",
    Sickness: "Pagkakasakit",
    Maternity: "Maternity",
    Newborn: "Bagong Silang",
    Housing: "Pabahay",
    Property: "Lupa",
    Scholarship: "Scholarship",
    Subsidy: "Subsidy",
    Preventive: "Pang-iwas na Lunas",
    "Medical Assistance": "Tulong Medikal",
    Others: "Iba pang Kategorya",
  };
  return translations[cat] || cat;
};

// Translations for target audience list
const translateAudience = (aud: string) => {
  if (locale.value !== "tl") return aud;
  const translations: Record<string, string> = {
    Seniors: "Senior Citizen",
    Indigent: "Mahirap (Indigent)",
    "Low Income": "Mababang Kita",
    Retirees: "Retirado (Retirees)",
    "SSS Members": "Miyembro ng SSS",
    Students: "Mag-aaral",
    College: "Kolehiyo",
    "Solo Parents": "Solo Parents",
    Families: "Mga Pamilya",
    "Crisis Victims": "Biktima ng Krisis",
    Unemployed: "Walang Trabaho",
    "All Citizens": "Lahat ng Mamamayan",
    "PhilHealth Members": "Miyembro ng PhilHealth",
    Employed: "May Trabaho",
    "Pag-IBIG Members": "Miyembro ng Pag-IBIG",
    Mothers: "Mga Ina",
    Pregnant: "Buntis",
    Underemployed: "Kulang sa Trabaho",
    "Medical Patients": "Pasyenteng Medikal",
    "Self-Employed": "Nagtatrabaho sa Sarili",
    "Government Employees": "Empleyado ng Gobyerno",
    "OFW Dependents": "Dependent ng OFW",
    Newborns: "Bagong Silang",
    "Burial Claimants": "Nag-aapply sa Libing",
    OFWs: "Mga OFW",
  };
  return translations[aud] || aud;
};

// Translations for program tags
const translateTag = (tag: string) => {
  if (locale.value !== "tl") return tag;
  const translations: Record<string, string> = {
    pension: "pensyon",
    seniors: "seniors",
    financial: "pinansyal",
    retirement: "pagreretiro",
    education: "edukasyon",
    students: "mag-aaral",
    family: "pamilya",
    discounts: "diskuwento",
    crisis: "krisis",
    medical: "medikal",
    unemployed: "walang trabaho",
    preventive: "iwas-sakit",
    loans: "pautang",
    maternity: "maternity",
    livelihood: "kabuhayan",
    housing: "pabahay",
    newborn: "bagong silang",
    burial: "libing",
  };
  return translations[tag] || tag;
};

// ----------------- DATA COMPUTATIONS -----------------

// 1. KPI Counts
const agenciesList = computed(() => Array.from(new Set(programsData.map((p) => p.agency))).sort());
const totalRequirements = computed(() =>
  programsData.reduce((sum, p) => sum + p.requirements.length, 0),
);
const totalSteps = computed(() => programsData.reduce((sum, p) => sum + p.steps.length, 0));
const avgRequirements = computed(() => (totalRequirements.value / programsData.length).toFixed(1));
const avgSteps = computed(() => (totalSteps.value / programsData.length).toFixed(1));

// 2. Programs by Agency distribution
const agencyData = computed(() => {
  const counts: Record<string, number> = {};
  programsData.forEach((p) => {
    counts[p.agency] = (counts[p.agency] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
});

// Get programs matching an agency
const getProgramsForAgency = (agencyName: string) => {
  return programsData.filter((p) => p.agency === agencyName);
};

// 3. Programs by Category (split category values)
const categoryData = computed(() => {
  const counts: Record<string, number> = {};
  programsData.forEach((p) => {
    const cats = p.category.split(" / ").map((c) => c.trim());
    cats.forEach((c) => {
      counts[c] = (counts[c] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
});

// Top categories aggregated for donut visual chart
const donutCategories = computed(() => {
  const all = categoryData.value;
  if (all.length <= 7) return all;
  const top = all.slice(0, 6);
  const remaining = all.slice(6);
  const othersCount = remaining.reduce((sum, item) => sum + item.count, 0);
  return [...top, { name: "Others", count: othersCount }];
});

// Donut segment geometries
const donutSegments = computed(() => {
  const data = donutCategories.value;
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let accumulatedPercent = 0;

  const colors = [
    "stroke-amber-500 dark:stroke-amber-400",
    "stroke-blue-500 dark:stroke-blue-400",
    "stroke-purple-500 dark:stroke-purple-400",
    "stroke-indigo-500 dark:stroke-indigo-400",
    "stroke-rose-500 dark:stroke-rose-400",
    "stroke-emerald-500 dark:stroke-emerald-400",
    "stroke-teal-500 dark:stroke-teal-400",
    "stroke-slate-400 dark:stroke-slate-500",
  ];

  const fills = [
    "bg-amber-500 dark:bg-amber-400",
    "bg-blue-500 dark:bg-blue-400",
    "bg-purple-500 dark:bg-purple-400",
    "bg-indigo-500 dark:bg-indigo-400",
    "bg-rose-500 dark:bg-rose-400",
    "bg-emerald-500 dark:bg-emerald-400",
    "bg-teal-500 dark:bg-teal-400",
    "bg-slate-400 dark:bg-slate-500",
  ];

  const r = 70;
  const circumference = 2 * Math.PI * r; // ~439.82

  return data.map((item, index) => {
    const percent = item.count / total;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - percent);
    const strokeRotation = accumulatedPercent * 360 - 90;

    accumulatedPercent += percent;

    return {
      name: item.name,
      count: item.count,
      percent: Math.round(percent * 100),
      strokeDasharray,
      strokeDashoffset,
      strokeRotation,
      colorClass: colors[index % colors.length],
      fillClass: fills[index % fills.length],
    };
  });
});

// Get programs matching a category
const getProgramsForCategory = (categoryName: string) => {
  if (categoryName === "Others") {
    const topNames = donutCategories.value.slice(0, 6).map((c) => c.name);
    return programsData.filter((p) => {
      const cats = p.category.split(" / ").map((c) => c.trim());
      return cats.some((c) => !topNames.includes(c));
    });
  }
  return programsData.filter((p) => {
    const cats = p.category.split(" / ").map((c) => c.trim());
    return cats.includes(categoryName);
  });
};

// 4. Target Audiences (Top 15)
const audienceData = computed(() => {
  const counts: Record<string, number> = {};
  programsData.forEach((p) => {
    p.target_audience.forEach((a) => {
      counts[a] = (counts[a] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 15);
});

// Get programs matching an audience
const getProgramsForAudience = (audienceName: string) => {
  return programsData.filter((p) => p.target_audience.includes(audienceName));
};

// 5. Program Tags (Top 15)
const tagData = computed(() => {
  const counts: Record<string, number> = {};
  programsData.forEach((p) => {
    p.tags.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 15);
});

// Get programs matching a tag
const getProgramsForTag = (tagName: string) => {
  return programsData.filter((p) => p.tags.includes(tagName));
};

// Helper to navigate to program detail
const viewProgramDetail = (id: string) => {
  router.push(`/program/${id}`);
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in space-y-10 pb-20">
    <!-- Premium Hero Section -->
    <motion.div
      class="relative bg-slate-100 dark:bg-slate-900 sm:bg-gradient-to-br sm:from-slate-50 sm:via-slate-100/70 sm:to-blue-50/50 text-slate-900 sm:dark:from-slate-900 sm:dark:via-slate-950 sm:dark:to-blue-950 dark:text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-xs dark:shadow-2xl border border-slate-200 dark:border-slate-800/80"
      :initial="{ opacity: 0, y: -20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
    >
      <!-- Logo Watermark -->
      <img
        src="/betterGov_Icon.svg"
        alt="betterGov Logo"
        class="hidden sm:block absolute right-30 bottom-30 md:right-12 md:bottom-12 w-28 h-28 md:w-80 md:h-80 object-contain opacity-10 dark:opacity-[0.07] pointer-events-none select-none z-0 dark:brightness-0 dark:invert"
      />

      <!-- Dashed Bottom Left Fade Grid -->
      <div
        class="hidden sm:block absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-15"
        style="
          background-image:
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
          background-size: 20px 20px;
          background-position:
            0 0,
            0 0;
          mask-image:
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);
          -webkit-mask-image:
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%);
          mask-composite: intersect;
          -webkit-mask-composite: source-in;
        "
      />

      <div class="relative z-10 max-w-3xl space-y-6">
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider"
        >
          <BarChart3 class="w-3.5 h-3.5 animate-pulse" /> {{ $t("analytics.title") }}
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-none text-slate-900 dark:text-white sm:text-transparent sm:bg-clip-text sm:bg-gradient-to-r sm:from-slate-900 sm:via-slate-800 sm:to-blue-900 sm:dark:from-white sm:dark:via-slate-100 sm:dark:to-blue-200"
        >
          {{ $t("analytics.title") }}
        </h2>

        <p
          class="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-lg font-normal leading-relaxed max-w-2xl"
        >
          {{ $t("analytics.subtitle") }}
        </p>

        <!-- Dynamic Real-time Stats Grid -->
        <div
          class="grid grid-cols-2 md:grid-cols-5 gap-4 pt-6 max-w-4xl border-t border-slate-200 dark:border-slate-800/60 text-left"
        >
          <div
            class="p-3 bg-white/45 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/20 backdrop-blur-xs"
          >
            <span class="block text-2xl font-extrabold text-blue-600 dark:text-blue-400">{{
              programsData.length
            }}</span>
            <span
              class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
            >
              {{ $t("analytics.kpiTotalPrograms") }}
            </span>
          </div>
          <div
            class="p-3 bg-white/45 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/20 backdrop-blur-xs"
          >
            <span class="block text-2xl font-extrabold text-teal-600 dark:text-teal-400">{{
              agenciesList.length
            }}</span>
            <span
              class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
            >
              {{ $t("analytics.kpiAgencies") }}
            </span>
          </div>
          <div
            class="p-3 bg-white/45 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/20 backdrop-blur-xs"
          >
            <span class="block text-2xl font-extrabold text-amber-600 dark:text-amber-400">{{
              categoryData.length
            }}</span>
            <span
              class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
            >
              {{ $t("analytics.kpiCategories") }}
            </span>
          </div>
          <div
            class="p-3 bg-white/45 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/20 backdrop-blur-xs"
          >
            <span class="block text-2xl font-extrabold text-purple-600 dark:text-purple-400">{{
              avgRequirements
            }}</span>
            <span
              class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
            >
              {{ $t("analytics.kpiAvgRequirements") }}
            </span>
          </div>
          <div
            class="p-3 bg-white/45 dark:bg-slate-950/20 rounded-xl border border-slate-200/50 dark:border-slate-800/20 backdrop-blur-xs col-span-2 md:col-span-1"
          >
            <span class="block text-2xl font-extrabold text-rose-600 dark:text-rose-400">{{
              avgSteps
            }}</span>
            <span
              class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide"
            >
              {{ $t("analytics.kpiAvgSteps") }}
            </span>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- Executive Summary Section (Takeaways) -->
    <section
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs"
    >
      <div
        class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-4 mb-6"
      >
        <Sparkles class="w-5 h-5 text-amber-500" />
        <h3 class="font-bold text-lg text-slate-900 dark:text-white">
          {{ $t("analytics.executiveSummary") }}
        </h3>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Takeaway 1 -->
        <div
          class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col gap-3"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold"
            >
              1
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">
              {{ $t("analytics.takeaway1Title") }}
            </h4>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {{ $t("analytics.takeaway1Desc") }}
          </p>
        </div>

        <!-- Takeaway 2 -->
        <div
          class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col gap-3"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-xl bg-blue-550/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold"
            >
              2
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">
              {{ $t("analytics.takeaway2Title") }}
            </h4>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {{ $t("analytics.takeaway2Desc") }}
          </p>
        </div>

        <!-- Takeaway 3 -->
        <div
          class="p-5 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/30 flex flex-col gap-3"
        >
          <div class="flex items-center gap-2.5">
            <div
              class="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold"
            >
              3
            </div>
            <h4 class="font-bold text-sm text-slate-900 dark:text-white">
              {{ $t("analytics.takeaway3Title") }}
            </h4>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            {{ $t("analytics.takeaway3Desc") }}
          </p>
        </div>
      </div>
    </section>

    <!-- Main Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Chart 1: Programs by Agency -->
      <section
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6"
          >
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark class="w-4.5 h-4.5 text-blue-500" />
              {{ $t("analytics.chartAgenciesTitle") }}
            </h3>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              {{ agenciesList.length }} Agencies
            </span>
          </div>

          <!-- Agency Horizontal Bar Chart List -->
          <div class="space-y-4.5">
            <div
              v-for="item in agencyData"
              :key="item.name"
              @click="toggleAgency(item.name)"
              class="relative group cursor-pointer select-none"
              :class="activeAgency === item.name ? 'z-30' : 'z-10'"
            >
              <div class="flex justify-between items-center text-xs font-bold mb-1.5 z-10 relative">
                <span
                  class="text-slate-800 dark:text-slate-200 hover:text-blue-650 transition-colors"
                >
                  {{ item.name }}
                </span>
                <div class="flex items-center gap-2">
                  <span class="text-slate-500 dark:text-slate-400">
                    {{ item.count }} {{ $t("analytics.chartTooltipPrograms") }} ({{
                      Math.round((item.count / programsData.length) * 100)
                    }}%)
                  </span>
                  <button
                    class="px-2 py-0.5 text-[10px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-md border border-blue-150/20 dark:border-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-950/60 cursor-pointer transition-colors"
                  >
                    {{ activeAgency === item.name ? "Hide" : "View" }}
                  </button>
                </div>
              </div>
              <div
                class="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden relative border border-slate-200/20 dark:border-slate-800/10 shadow-inner"
              >
                <div
                  class="h-full rounded-full transition-all duration-500 origin-left"
                  :class="[activeAgency === item.name ? 'scale-y-110 shadow-md' : '']"
                  :style="{
                    width: `${(item.count / 5) * 100}%`,
                    background: getAgencyTheme(item.name).gradient,
                  }"
                ></div>
              </div>

              <!-- Inline Interactive Dropdown displaying matching Programs -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform scale-y-95 opacity-0 -translate-y-2"
                enter-to-class="transform scale-y-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="transform scale-y-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-y-95 opacity-0 -translate-y-2"
              >
                <div
                  v-if="activeAgency === item.name"
                  class="absolute left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-35 space-y-2 text-left"
                >
                  <div
                    class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800"
                  >
                    {{ item.name }} {{ $t("analytics.chartTooltipPrograms") }} ({{ item.count }})
                  </div>
                  <div
                    class="max-h-48 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50"
                  >
                    <div
                      v-for="p in getProgramsForAgency(item.name)"
                      :key="p.id"
                      @click.stop="viewProgramDetail(p.id)"
                      class="py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer group"
                    >
                      <span
                        class="line-clamp-1 flex-grow font-semibold text-slate-800 dark:text-slate-200 group-hover:translate-x-1 transition-transform"
                      >
                        {{ $t(`programs.${p.id}.name`) }}
                      </span>
                      <span
                        class="flex items-center gap-1 shrink-0 ml-2 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {{ $t("detail.viewDetails") }}
                        <ArrowRight class="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div
          class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2"
        >
          <AlertCircle class="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>Click on an agency bar or its 'View' button to inspect its program list.</span>
        </div>
      </section>

      <!-- Chart 2: Programs by Category -->
      <section
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6"
          >
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <ClipboardList class="w-4.5 h-4.5 text-purple-500" />
              {{ $t("analytics.chartCategoriesTitle") }}
            </h3>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              {{ categoryData.length }} Subcategories
            </span>
          </div>

          <!-- SVG Donut Chart Layout -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div class="relative w-44 h-44 shrink-0">
              <svg viewBox="0 0 200 200" class="w-full h-full transform -rotate-90">
                <circle
                  v-for="(seg, idx) in donutSegments"
                  :key="idx"
                  cx="100"
                  cy="100"
                  r="70"
                  fill="transparent"
                  stroke-width="18"
                  :class="[seg.colorClass, hoveredCategory === seg.name ? 'stroke-[24px]' : '']"
                  :stroke-dasharray="seg.strokeDasharray"
                  :stroke-dashoffset="seg.strokeDashoffset"
                  :transform="`rotate(${seg.strokeRotation} 100 100)`"
                  class="transition-all duration-300 cursor-pointer stroke-linecap-round"
                  @mouseenter="hoveredCategory = seg.name"
                  @mouseleave="hoveredCategory = null"
                  @click="toggleCategory(seg.name)"
                />
              </svg>
              <!-- Center details card -->
              <div
                class="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none select-none"
              >
                <span class="text-2xl font-black text-slate-850 dark:text-white">
                  {{ programsData.length }}
                </span>
                <span
                  class="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest"
                >
                  Programs
                </span>
              </div>
            </div>

            <!-- Legends list -->
            <div class="flex-grow space-y-2 text-left w-full sm:w-auto">
              <div
                v-for="seg in donutSegments"
                :key="seg.name"
                @mouseenter="hoveredCategory = seg.name"
                @mouseleave="hoveredCategory = null"
                @click="toggleCategory(seg.name)"
                class="flex items-center justify-between gap-3 p-1.5 rounded-lg transition-colors cursor-pointer select-none"
                :class="hoveredCategory === seg.name ? 'bg-slate-50 dark:bg-slate-800' : ''"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <span class="w-3 h-3 rounded-full shrink-0" :class="seg.fillClass"></span>
                  <span class="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {{ translateCategory(seg.name) }}
                  </span>
                </div>
                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                  {{ seg.count }} ({{ seg.percent }}%)
                </span>
              </div>
            </div>
          </div>

          <!-- Hover Info for category details -->
          <div class="mt-6 relative min-h-[90px]">
            <transition name="fade" mode="out-in">
              <div
                v-if="hoveredCategory"
                class="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-105 dark:border-slate-800/80 text-left"
              >
                <div
                  class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-1.5"
                >
                  {{ translateCategory(hoveredCategory) }} Programs List
                </div>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="p in getProgramsForCategory(hoveredCategory)"
                    :key="p.id"
                    @click="viewProgramDetail(p.id)"
                    class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:hover:text-blue-400 cursor-pointer shadow-xs hover:border-blue-500 transition-colors"
                  >
                    {{ $t(`programs.${p.id}.name`).split("(")[0].trim() }}
                    <ArrowRight class="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
              <div
                v-else
                class="h-full flex items-center justify-center py-6 text-center text-slate-400 dark:text-slate-500 text-xs italic"
              >
                Hover or click on legend rows or donut slices to browse programs in that category.
              </div>
            </transition>
          </div>
        </div>
      </section>
    </div>

    <!-- Bottom Grids: Target Audiences and Program Tags -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Target Audiences -->
      <section
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs"
      >
        <div
          class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6"
        >
          <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck class="w-4.5 h-4.5 text-emerald-500" />
            {{ $t("analytics.chartAudiencesTitle") }}
          </h3>
          <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
            {{ audienceData.length }} Audiences
          </span>
        </div>

        <div class="space-y-4">
          <div
            v-for="item in audienceData"
            :key="item.name"
            @click="toggleAudience(item.name)"
            class="relative group cursor-pointer select-none"
            :class="activeAudience === item.name ? 'z-30' : 'z-10'"
          >
            <div class="flex items-center justify-between text-xs font-bold mb-1.5">
              <span class="text-slate-700 dark:text-slate-350">
                {{ translateAudience(item.name) }}
              </span>
              <div class="flex items-center gap-2">
                <span
                  class="text-slate-500 dark:text-slate-450 font-bold bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded-md text-[10px]"
                >
                  {{ item.count }} Programs
                </span>
                <button
                  class="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-150/20 dark:border-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 cursor-pointer transition-colors"
                >
                  {{ activeAudience === item.name ? "Hide" : "View" }}
                </button>
              </div>
            </div>
            <!-- Progress Fill Bar -->
            <div class="w-full bg-slate-100 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
              <div
                class="h-full bg-emerald-500 dark:bg-emerald-600 rounded-full transition-all duration-300"
                :style="{ width: `${(item.count / 9) * 100}%` }"
              ></div>
            </div>

            <!-- Dropdown Details on Click -->
            <transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="transform scale-y-95 opacity-0 -translate-y-1"
              enter-to-class="transform scale-y-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-y-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-y-95 opacity-0 -translate-y-1"
            >
              <div
                v-if="activeAudience === item.name"
                class="absolute left-0 right-0 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-35 space-y-2 text-left"
              >
                <div
                  class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800"
                >
                  Targeted Programs: {{ translateAudience(item.name) }} ({{ item.count }})
                </div>
                <div
                  class="max-h-40 overflow-y-auto divide-y divide-slate-150/40 dark:divide-slate-800/50"
                >
                  <div
                    v-for="p in getProgramsForAudience(item.name)"
                    :key="p.id"
                    @click.stop="viewProgramDetail(p.id)"
                    class="py-2 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-emerald-500 cursor-pointer group"
                  >
                    <span
                      class="truncate flex-grow font-semibold text-slate-800 dark:text-slate-200 group-hover:translate-x-1 transition-transform"
                    >
                      {{ $t(`programs.${p.id}.name`) }}
                    </span>
                    <span
                      class="flex items-center gap-0.5 shrink-0 ml-2 text-[10px] text-emerald-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {{ $t("detail.viewDetails") }}
                      <ArrowRight class="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </section>

      <!-- Program Tags -->
      <section
        class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div
            class="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-6"
          >
            <h3 class="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Tag class="w-4.5 h-4.5 text-blue-500" />
              {{ $t("analytics.chartTagsTitle") }}
            </h3>
            <span class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
              15 Frequent Tags
            </span>
          </div>

          <!-- Dynamic Badge Density Grid -->
          <div class="flex flex-wrap gap-2.5 py-4">
            <div
              v-for="item in tagData"
              :key="item.name"
              class="relative"
              :class="activeTag === item.name ? 'z-30' : 'z-10'"
            >
              <button
                @click="toggleTag(item.name)"
                class="inline-flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer select-none"
                :class="[
                  activeTag === item.name
                    ? 'bg-blue-600 border-transparent text-white shadow-sm shadow-blue-500/10 ring-2 ring-blue-550/30'
                    : item.count >= 6
                      ? 'bg-blue-500/10 border-blue-200 dark:border-blue-900/30 text-blue-750 dark:text-blue-300 hover:bg-blue-500/20'
                      : item.count >= 3
                        ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200/40 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100/40'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200/60 dark:border-slate-800/80 text-slate-655 dark:text-slate-400 hover:bg-slate-100',
                ]"
              >
                #{{ translateTag(item.name) }}
                <span
                  class="text-[9px] font-black rounded-full px-1.5 py-0.5 border"
                  :class="[
                    activeTag === item.name
                      ? 'bg-blue-700 border-blue-500/10 text-white'
                      : 'bg-white/90 dark:bg-slate-900/90 text-slate-500 dark:text-slate-400 border-slate-200/10',
                  ]"
                >
                  {{ item.count }}
                </span>
              </button>

              <!-- Click Dropdown overlay listing programs -->
              <transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="transform scale-y-95 opacity-0 -translate-y-1"
                enter-to-class="transform scale-y-100 opacity-100 translate-y-0"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="transform scale-y-100 opacity-100 translate-y-0"
                leave-to-class="transform scale-y-95 opacity-0 -translate-y-1"
              >
                <div
                  v-if="activeTag === item.name"
                  class="absolute left-0 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-35 space-y-2 text-left w-72"
                >
                  <div
                    class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-100 dark:border-slate-800"
                  >
                    Programs tagged #{{ translateTag(item.name) }} ({{ item.count }})
                  </div>
                  <div
                    class="max-h-40 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/50"
                  >
                    <div
                      v-for="p in getProgramsForTag(item.name)"
                      :key="p.id"
                      @click.stop="viewProgramDetail(p.id)"
                      class="py-2 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-355 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer group"
                    >
                      <span
                        class="truncate flex-grow font-semibold text-slate-850 dark:text-slate-200 group-hover:translate-x-1 transition-transform"
                      >
                        {{ $t(`programs.${p.id}.name`) }}
                      </span>
                      <span
                        class="flex items-center gap-0.5 shrink-0 ml-2 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye class="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>

        <div
          class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 text-xs text-slate-500 dark:text-slate-450 text-left"
        >
          Interactive pills: click tags to discover matching social assistance options.
        </div>
      </section>
    </div>
    <!-- Tailwind CSS Safelist Dummy Div to prevent purging of dynamic agency classes -->
    <div
      class="hidden bg-orange-500 bg-blue-600 bg-green-500 bg-amber-500 bg-teal-500 bg-indigo-500 bg-rose-500 bg-violet-500 bg-sky-500 bg-slate-500 sm:from-orange-500 sm:from-blue-600 sm:from-green-500 sm:from-amber-500 sm:from-teal-500 sm:from-indigo-500 sm:from-rose-500 sm:from-violet-500 sm:from-sky-500 sm:from-slate-500 sm:to-red-500 sm:to-indigo-600 sm:to-emerald-500 sm:to-yellow-500 sm:to-cyan-500 sm:to-purple-500 sm:to-red-500 sm:to-fuchsia-500 sm:to-blue-500 sm:to-slate-600 border-orange-200 border-blue-200 border-green-200 border-amber-200 border-teal-200 border-indigo-200 border-rose-200 border-violet-200 border-sky-200 border-slate-200"
    ></div>
  </main>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
