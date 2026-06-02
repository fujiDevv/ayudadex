<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeft, Mail, Share2, Check, Lightbulb,
  AlertCircle, ExternalLink, PenLine, PlusCircle, Clock,
  PartyPopper, Github, ChevronDown, Copy, MessageCircle
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { useI18n } from 'vue-i18n'
import programsData from '../data/programs.json'
import type { Program } from '../types'

const router = useRouter()
const route = useRoute()
const { t } = useI18n()

const programs = programsData as Program[]

// Form state
type UpdateType = 'correct' | 'new' | 'outdated'

const updateType = ref<UpdateType>('correct')
const selectedProgramId = ref('')
const newProgramName = ref('')
const suggestion = ref('')
const sourceUrl = ref('')
const contact = ref('')

// UI state
const submitted = ref(false)
const showCopiedToast = ref(false)
const showValidation = ref(false)
const isSelectOpen = ref(false)
const submittedVia = ref<'email' | 'share' | 'copy' | 'github'>('email')

// Pre-fill from query param
onMounted(() => {
  const programId = route.query.program as string
  if (programId) {
    const found = programs.find(p => p.id === programId)
    if (found) {
      selectedProgramId.value = programId
      updateType.value = 'correct'
    }
  }
})

const selectedProgram = computed(() => {
  return programs.find(p => p.id === selectedProgramId.value)
})

const programName = computed(() => {
  if (updateType.value === 'new') return newProgramName.value
  return selectedProgram.value ? t(`programs.${selectedProgram.value.id}.name`) : ''
})

const isValid = computed(() => {
  const hasProgram = updateType.value === 'new'
    ? newProgramName.value.trim().length > 0
    : selectedProgramId.value.length > 0
  return hasProgram && suggestion.value.trim().length > 0
})

const canShare = computed(() => !!navigator.share)

// Build the issue content
const typeLabels: Record<UpdateType, string> = {
  correct: '🔧 Correction',
  new: '✨ New Program',
  outdated: '⏰ Outdated Info'
}

function buildIssueTitle(): string {
  const typeLabel = typeLabels[updateType.value]
  return `[Community] ${typeLabel}: ${programName.value}`
}

function buildIssueBody(): string {
  const lines: string[] = []
  lines.push(`## ${typeLabels[updateType.value]}`)
  lines.push('')
  lines.push(`**Program:** ${programName.value}`)
  if (selectedProgram.value) {
    lines.push(`**Program ID:** \`${selectedProgram.value.id}\``)
    lines.push(`**Agency:** ${selectedProgram.value.agency}`)
  }
  lines.push('')
  lines.push('## Suggested Update')
  lines.push('')
  lines.push(suggestion.value)
  lines.push('')
  if (sourceUrl.value.trim()) {
    lines.push(`## Source / Reference`)
    lines.push('')
    lines.push(sourceUrl.value.trim())
    lines.push('')
  }
  if (contact.value.trim()) {
    lines.push(`## Submitter Contact`)
    lines.push('')
    lines.push(contact.value.trim())
    lines.push('')
  }
  lines.push('---')
  lines.push('*Submitted via AyudaDex "Suggest an Update" form*')
  return lines.join('\n')
}

function buildPlainText(): string {
  const lines: string[] = []
  lines.push(`=== AyudaDex Suggestion ===`)
  lines.push('')
  lines.push(`Type: ${typeLabels[updateType.value]}`)
  lines.push(`Program: ${programName.value}`)
  if (selectedProgram.value) {
    lines.push(`Agency: ${selectedProgram.value.agency}`)
  }
  lines.push('')
  lines.push(`--- Suggestion ---`)
  lines.push(suggestion.value)
  lines.push('')
  if (sourceUrl.value.trim()) {
    lines.push(`Source: ${sourceUrl.value.trim()}`)
    lines.push('')
  }
  if (contact.value.trim()) {
    lines.push(`Contact: ${contact.value.trim()}`)
    lines.push('')
  }
  lines.push('---')
  lines.push('Sent via AyudaDex')
  return lines.join('\n')
}

// ─── Primary: Send via Email ───
function sendViaEmail() {
  showValidation.value = true
  if (!isValid.value) return

  const subject = encodeURIComponent(buildIssueTitle())
  const body = encodeURIComponent(buildPlainText())
  const mailtoUrl = `mailto:fujidevv@duck.com?subject=${subject}&body=${body}`

  window.location.href = mailtoUrl
  submittedVia.value = 'email'
  submitted.value = true
}

// ─── Secondary: Share via messaging apps ───
async function shareViaNative() {
  showValidation.value = true
  if (!isValid.value) return

  try {
    await navigator.share({
      title: buildIssueTitle(),
      text: buildPlainText()
    })
    submittedVia.value = 'share'
    submitted.value = true
  } catch (err: any) {
    // User cancelled share — do nothing
    if (err.name !== 'AbortError') {
      // Fallback: copy to clipboard
      copyToClipboard()
    }
  }
}

// ─── Fallback: Copy to clipboard ───
function copyToClipboard() {
  showValidation.value = true
  if (!isValid.value) return

  const text = buildPlainText()
  navigator.clipboard.writeText(text).then(() => {
    showCopiedToast.value = true
    submittedVia.value = 'copy'
    submitted.value = true
    setTimeout(() => {
      showCopiedToast.value = false
    }, 4000)
  })
}

// ─── Tertiary: Open GitHub Issue (for devs) ───
function openGithubIssue() {
  showValidation.value = true
  if (!isValid.value) return

  const title = encodeURIComponent(buildIssueTitle())
  const body = encodeURIComponent(buildIssueBody())
  const labels = encodeURIComponent('community-suggestion')
  const url = `https://github.com/fujiDevv/ayudadex/issues/new?title=${title}&body=${body}&labels=${labels}`

  window.open(url, '_blank')
  submittedVia.value = 'github'
  submitted.value = true
}

function resetForm() {
  updateType.value = 'correct'
  selectedProgramId.value = ''
  newProgramName.value = ''
  suggestion.value = ''
  sourceUrl.value = ''
  contact.value = ''
  submitted.value = false
  showValidation.value = false
}

const goBack = () => router.push('/')

const updateTypes: { value: UpdateType; icon: typeof PenLine; key: string }[] = [
  { value: 'correct', icon: PenLine, key: 'typeCorrect' },
  { value: 'new', icon: PlusCircle, key: 'typeNew' },
  { value: 'outdated', icon: Clock, key: 'typeOutdated' }
]
</script>

<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16 animate-fade-in">

    <button @click="goBack"
      class="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-6 cursor-pointer">
      <ArrowLeft class="w-4 h-4" /> {{ $t('suggest.backHome') }}
    </button>

    <!-- Success State -->
    <motion.div v-if="submitted" :initial="{ opacity: 0, scale: 0.9, y: 20 }" :animate="{ opacity: 1, scale: 1, y: 0 }"
      :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm text-center">
      <div
        class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/30 mb-6">
        <PartyPopper class="w-10 h-10 text-emerald-500" />
      </div>

      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
        {{ $t('suggest.thankYou') }}
      </h2>
      <p class="text-slate-600 dark:text-slate-300 mt-3 max-w-md mx-auto leading-relaxed">
        {{ $t('suggest.thankYouDesc') }}
      </p>

      <!-- Email follow-up hint -->
      <div v-if="submittedVia === 'email'"
        class="mt-4 inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 text-sm font-bold px-4 py-2.5 rounded-xl border border-blue-200 dark:border-blue-800/50">
        <Mail class="w-4 h-4" />
        {{ $t('suggest.emailSentHint') }}
      </div>

      <!-- Copied Toast inline -->
      <div v-if="showCopiedToast"
        class="mt-4 inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-bold px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
        <Check class="w-4 h-4" />
        {{ $t('suggest.copied') }}
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
        <motion.button @click="resetForm"
          class="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors cursor-pointer flex items-center gap-2"
          :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
          <PlusCircle class="w-4 h-4" />
          {{ $t('suggest.another') }}
        </motion.button>
        <motion.button @click="goBack"
          class="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          :whileHover="{ scale: 1.03 }" :whileTap="{ scale: 0.97 }">
          {{ $t('suggest.backHome') }}
        </motion.button>
      </div>
    </motion.div>

    <!-- Form -->
    <motion.div v-else :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }"
      :transition="{ type: 'spring', stiffness: 250, damping: 22 }"
      class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm">
      <!-- Header -->
      <div class="space-y-3 mb-8">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/30">
            <Lightbulb class="w-5 h-5 text-blue-900 dark:text-blue-400" />
          </div>
          <span
            class="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase rounded-md tracking-wider border border-emerald-200/50 dark:border-emerald-900/30">
            Community
          </span>
        </div>
        <h1
          class="text-2xl sm:text-3xl font-bold font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
          {{ $t('suggest.title') }}
        </h1>
        <p class="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {{ $t('suggest.subtitle') }}
        </p>
      </div>

      <hr class="border-slate-100 dark:border-slate-800 mb-8" />

      <!-- Update Type Selection -->
      <div class="space-y-3 mb-8">
        <label class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
          {{ $t('suggest.typeLabel') }}
        </label>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
          <motion.button v-for="ut in updateTypes" :key="ut.value" @click="updateType = ut.value"
            class="p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3"
            :class="updateType === ut.value
              ? 'border-blue-900 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50'" :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
            <div class="p-1.5 rounded-lg shrink-0 mt-0.5" :class="updateType === ut.value
              ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'">
              <component :is="ut.icon" class="w-4 h-4" />
            </div>
            <span class="text-sm font-bold leading-snug" :class="updateType === ut.value
              ? 'text-blue-900 dark:text-blue-300'
              : 'text-slate-700 dark:text-slate-300'">
              {{ $t(`suggest.${ut.key}`) }}
            </span>
          </motion.button>
        </div>
      </div>

      <!-- Program Selection -->
      <div class="space-y-2 mb-6">
        <label
          class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
          {{ $t('suggest.programLabel') }}
          <span class="text-red-500 text-xs">*</span>
        </label>

        <!-- Dropdown for existing programs -->
        <div v-if="updateType !== 'new'" class="relative">
          <button @click="isSelectOpen = !isSelectOpen" type="button"
            class="w-full text-left bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm font-medium transition-colors cursor-pointer flex items-center justify-between"
            :class="[
              showValidation && !selectedProgramId ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-800 focus:border-blue-500',
              selectedProgramId ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'
            ]">
            <span>{{ selectedProgram ? $t(`programs.${selectedProgram.id}.name`) : $t('suggest.programPlaceholder')
            }}</span>
            <ChevronDown class="w-4 h-4 text-slate-400 transition-transform"
              :class="isSelectOpen ? 'rotate-180' : ''" />
          </button>

          <transition enter-active-class="transition duration-150 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isSelectOpen"
              class="absolute z-20 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl max-h-64 overflow-y-auto py-1">
              <button v-for="prog in programs" :key="prog.id" @click="selectedProgramId = prog.id; isSelectOpen = false"
                class="w-full text-left px-4 py-3 text-sm transition-colors cursor-pointer flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                :class="selectedProgramId === prog.id ? 'bg-blue-50 dark:bg-blue-950/30' : ''">
                <span class="px-2 py-0.5 text-[9px] font-bold uppercase rounded tracking-wider shrink-0" :class="selectedProgramId === prog.id
                  ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'">
                  {{ prog.agency }}
                </span>
                <span class="font-medium truncate" :class="selectedProgramId === prog.id
                  ? 'text-blue-900 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300'">
                  {{ $t(`programs.${prog.id}.name`) }}
                </span>
                <Check v-if="selectedProgramId === prog.id"
                  class="w-4 h-4 text-blue-600 dark:text-blue-400 ml-auto shrink-0" />
              </button>
            </div>
          </transition>

          <!-- Click-outside to close -->
          <div v-if="isSelectOpen" class="fixed inset-0 z-10" @click="isSelectOpen = false"></div>
        </div>

        <!-- Text input for new programs -->
        <input v-else v-model="newProgramName" type="text" :placeholder="$t('suggest.programNewPlaceholder')"
          class="w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors"
          :class="showValidation && !newProgramName.trim() ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-800'" />

        <p v-if="showValidation && ((updateType === 'new' && !newProgramName.trim()) || (updateType !== 'new' && !selectedProgramId))"
          class="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-1">
          <AlertCircle class="w-3 h-3" />
          {{ $t('suggest.requiredField') }}
        </p>
      </div>

      <!-- Suggestion Textarea -->
      <div class="space-y-2 mb-6">
        <label
          class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest flex items-center gap-2">
          {{ $t('suggest.suggestionLabel') }}
          <span class="text-red-500 text-xs">*</span>
        </label>
        <textarea v-model="suggestion" :placeholder="$t('suggest.suggestionPlaceholder')" rows="5"
          class="w-full bg-slate-50 dark:bg-slate-950 border rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors resize-none leading-relaxed"
          :class="showValidation && !suggestion.trim() ? 'border-red-400 dark:border-red-500' : 'border-slate-200 dark:border-slate-800'"></textarea>
        <p v-if="showValidation && !suggestion.trim()"
          class="text-red-500 text-xs font-semibold flex items-center gap-1.5 mt-1">
          <AlertCircle class="w-3 h-3" />
          {{ $t('suggest.requiredField') }}
        </p>
      </div>

      <!-- Source URL -->
      <div class="space-y-2 mb-6">
        <label class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
          {{ $t('suggest.sourceLabel') }}
        </label>
        <input v-model="sourceUrl" type="url" :placeholder="$t('suggest.sourcePlaceholder')"
          class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors" />
      </div>

      <!-- Contact -->
      <div class="space-y-2 mb-8">
        <label class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
          {{ $t('suggest.contactLabel') }}
        </label>
        <input v-model="contact" type="text" :placeholder="$t('suggest.contactPlaceholder')"
          class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-colors" />
      </div>

      <hr class="border-slate-100 dark:border-slate-800 mb-6" />

      <!-- ═══════════════════════════════════════════ -->
      <!-- HOW TO SUBMIT — Elder-friendly card layout -->
      <!-- ═══════════════════════════════════════════ -->
      <div class="space-y-3 mb-6">
        <p class="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
          {{ $t('suggest.howToSubmit') }}
        </p>
        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
          {{ $t('suggest.howToSubmitDesc') }}
        </p>
      </div>

      <!-- Primary: Send via Email -->
      <motion.button @click="sendViaEmail"
        class="w-full px-6 py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-4 mb-3 shadow-sm"
        :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.98 }">
        <div class="p-2.5 bg-white/15 rounded-xl shrink-0">
          <Mail class="w-5 h-5" />
        </div>
        <div class="text-left flex-1 min-w-0">
          <span class="block text-sm font-extrabold">{{ $t('suggest.submitEmail') }}</span>
          <span class="block text-[11px] text-blue-200 font-medium mt-0.5">{{ $t('suggest.submitEmailDesc') }}</span>
        </div>
        <ExternalLink class="w-4 h-4 opacity-50 shrink-0" />
      </motion.button>

      <!-- Secondary: Share via Viber/Messenger/SMS -->
      <motion.button v-if="canShare" @click="shareViaNative"
        class="w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-colors cursor-pointer flex items-center gap-4 mb-3 shadow-sm"
        :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.98 }">
        <div class="p-2.5 bg-white/15 rounded-xl shrink-0">
          <MessageCircle class="w-5 h-5" />
        </div>
        <div class="text-left flex-1 min-w-0">
          <span class="block text-sm font-extrabold">{{ $t('suggest.submitShare') }}</span>
          <span class="block text-[11px] text-emerald-200 font-medium mt-0.5">{{ $t('suggest.submitShareDesc') }}</span>
        </div>
        <Share2 class="w-4 h-4 opacity-50 shrink-0" />
      </motion.button>

      <!-- Tertiary: Copy to Clipboard -->
      <motion.button @click="copyToClipboard"
        class="w-full px-6 py-3.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-4 mb-4"
        :whileHover="{ scale: 1.01 }" :whileTap="{ scale: 0.98 }">
        <div class="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
          <Copy class="w-4 h-4 text-slate-500 dark:text-slate-400" />
        </div>
        <div class="text-left flex-1 min-w-0">
          <span class="block text-sm font-bold">{{ $t('suggest.submitCopy') }}</span>
          <span class="block text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{{
            $t('suggest.submitCopyDesc') }}</span>
        </div>
      </motion.button>

      <!-- Dev-only: GitHub Issue link -->
      <div class="flex items-center justify-center pt-2 pb-1">
        <button @click="openGithubIssue"
          class="inline-flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer font-medium">
          <Github class="w-3.5 h-3.5" />
          {{ $t('suggest.submitGithub') }}
          <ExternalLink class="w-3 h-3 opacity-50" />
        </button>
      </div>

    </motion.div>
  </main>
</template>
