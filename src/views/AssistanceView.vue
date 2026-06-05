<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { motion } from 'motion-v'
import {
  FileText, Wand2, FileSpreadsheet, Download, Printer, CheckCircle,
  Building2, CircleDollarSign, Clock, Info, CheckSquare,
  AlertCircle, ChevronRight, MapPin
} from 'lucide-vue-next'

const { t, locale } = useI18n()

// Active View Tab: 'generator' or 'guides'
const activeTab = ref<'generator' | 'guides'>('generator')

// -------------------------------------------------------------
// DOCUMENT GENERATOR STATE & TEMPLATES
// -------------------------------------------------------------
const selectedDoc = ref<'authorization' | 'low_income' | 'request'>('authorization')

const form = ref({
  date: new Date().toISOString().substring(0, 10),
  applicantName: '',
  applicantAddress: '',
  // Authorization Letter fields
  repName: '',
  repAddress: '',
  relationship: '',
  purposeAuth: '',
  explanationAuth: '',
  // Affidavit of Low Income fields
  monthlyIncome: '',
  livelihood: '',
  dependents: '1',
  purposeAffidavit: '',
  governmentId: '',
  // Request Letter fields
  recipient: '',
  office: '',
  officeAddress: '',
  patientName: '',
  relationshipToPatient: '',
  purposeRequest: '',
  explanationRequest: ''
})

// Validation state
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  if (!form.value.applicantName.trim()) errors.value.applicantName = 'Applicant Name is required'
  if (!form.value.applicantAddress.trim()) errors.value.applicantAddress = 'Applicant Address is required'

  if (selectedDoc.value === 'authorization') {
    if (!form.value.repName.trim()) errors.value.repName = 'Representative Name is required'
    if (!form.value.repAddress.trim()) errors.value.repAddress = 'Representative Address is required'
    if (!form.value.relationship.trim()) errors.value.relationship = 'Relationship is required'
    if (!form.value.purposeAuth.trim()) errors.value.purposeAuth = 'Purpose is required'
    if (!form.value.explanationAuth.trim()) errors.value.explanationAuth = 'Reason for authorization is required'
  } else if (selectedDoc.value === 'low_income') {
    if (!form.value.monthlyIncome.trim()) errors.value.monthlyIncome = 'Monthly income is required'
    if (!form.value.livelihood.trim()) errors.value.livelihood = 'Source of livelihood is required'
    if (!form.value.purposeAffidavit.trim()) errors.value.purposeAffidavit = 'Purpose is required'
  } else if (selectedDoc.value === 'request') {
    if (!form.value.recipient.trim()) errors.value.recipient = 'Recipient name/title is required'
    if (!form.value.office.trim()) errors.value.office = 'Office name is required'
    if (!form.value.officeAddress.trim()) errors.value.officeAddress = 'Office address is required'
    if (!form.value.purposeRequest.trim()) errors.value.purposeRequest = 'Purpose is required'
    if (!form.value.explanationRequest.trim()) errors.value.explanationRequest = 'Explanation is required'
  }

  return Object.keys(errors.value).length === 0
}

// -------------------------------------------------------------
// RENDER DYNAMIC LETTER PREVIEW (HTML)
// -------------------------------------------------------------
const formatValue = (val: string, fallbackKey: string) => {
  return val.trim() ? val : `[${t(`assistance.${fallbackKey}`)}]`
}

const letterPreviewHTML = computed(() => {
  const isEn = locale.value === 'en'
  const appName = formatValue(form.value.applicantName, 'applicantName')
  const appAddr = formatValue(form.value.applicantAddress, 'applicantAddress')
  const dateStr = form.value.date ? new Date(form.value.date).toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' }) : `[${t('assistance.date')}]`

  if (selectedDoc.value === 'authorization') {
    const repName = formatValue(form.value.repName, 'repName')
    const repAddr = formatValue(form.value.repAddress, 'repAddress')
    const rel = formatValue(form.value.relationship, 'relationship')
    const purp = formatValue(form.value.purposeAuth, 'purpose')
    const exp = formatValue(form.value.explanationAuth, 'explanation')

    if (isEn) {
      return `
        <div class="space-y-4">
          <p class="text-right font-medium">${dateStr}</p>
          <div class="space-y-1">
            <p class="font-bold">TO WHOM IT MAY CONCERN</p>
          </div>
          <p class="font-bold border-b pb-1 text-center text-md tracking-wider">LETTER OF AUTHORIZATION</p>
          <p>Dear Sir/Madam,</p>
          <p class="indent-8 text-justify leading-relaxed">
            I, <strong>${appName}</strong>, residing at <strong>${appAddr}</strong>, hereby authorize <strong>${repName}</strong>, my <strong>${rel}</strong> who resides at <strong>${repAddr}</strong>, to act as my official representative to <strong>${purp}</strong> on my behalf.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            I am granting this authority because I am unable to perform this task in person due to the following reason: <strong>${exp}</strong>.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Please accept this letter along with a copy of my valid identification card and my representative's identification card for verification purposes.
          </p>
          <p>Thank you for your cooperation and understanding.</p>
          <div class="pt-8 flex justify-between gap-8">
            <div class="w-1/2">
              <p>Sincerely,</p>
              <div class="mt-12 border-t border-black pt-1 w-full text-center">
                <p class="font-bold uppercase">${appName}</p>
                <p class="text-xs text-slate-500 font-medium">Authorizing Person / Grantor</p>
              </div>
            </div>
            <div class="w-1/2 flex flex-col justify-end">
              <div class="mt-12 border-t border-black pt-1 w-full text-center">
                <p class="font-bold uppercase">${repName}</p>
                <p class="text-xs text-slate-500 font-medium">Authorized Representative</p>
              </div>
            </div>
          </div>
        </div>
      `
    } else {
      return `
        <div class="space-y-4">
          <p class="text-right font-medium">${dateStr}</p>
          <div class="space-y-1">
            <p class="font-bold">SA KINAUUKULAN,</p>
          </div>
          <p class="font-bold border-b pb-1 text-center text-md tracking-wider">SULAT NG PAGPAPAHINTULOT (AUTHORIZATION LETTER)</p>
          <p>Mahal na Ginoo / Ginang,</p>
          <p class="indent-8 text-justify leading-relaxed">
            Ako si <strong>${appName}</strong>, na naninirahan sa <strong>${appAddr}</strong>, ay nagbibigay-pahintulot kay <strong>${repName}</strong>, na aking <strong>${rel}</strong> at naninirahan sa <strong>${repAddr}</strong>, na maging aking opisyal na kinatawan upang <strong>${purp}</strong> para sa akin.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Iginagawad ko ang pahintulot na ito dahil hindi ko ito magagawa nang personal dahil sa sumusunod na dahilan: <strong>${exp}</strong>.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Sana ay tanggapin ninyo ang sulat na ito kasama ang photocopy ng aking valid ID at valid ID ng aking kinatawan para sa pagpapatunay.
          </p>
          <p>Maraming salamat po sa inyong tulong at pag-unawa.</p>
          <div class="pt-8 flex justify-between gap-8">
            <div class="w-1/2">
              <p>Gumagalang,</p>
              <div class="mt-12 border-t border-black pt-1 w-full text-center">
                <p class="font-bold uppercase">${appName}</p>
                <p class="text-xs text-slate-500 font-medium">Nagpapahintulot</p>
              </div>
            </div>
            <div class="w-1/2 flex flex-col justify-end">
              <div class="mt-12 border-t border-black pt-1 w-full text-center">
                <p class="font-bold uppercase">${repName}</p>
                <p class="text-xs text-slate-500 font-medium">Kinatawan</p>
              </div>
            </div>
          </div>
        </div>
      `
    }
  } else if (selectedDoc.value === 'low_income') {
    const income = formatValue(form.value.monthlyIncome, 'monthlyIncome')
    const livelihood = formatValue(form.value.livelihood, 'livelihood')
    const dependents = form.value.dependents
    const purpose = formatValue(form.value.purposeAffidavit, 'purpose')
    const govId = form.value.governmentId.trim() ? form.value.governmentId : '____________________'

    if (isEn) {
      return `
        <div class="space-y-4 text-sm font-serif">
          <div class="text-center font-bold uppercase space-y-1">
            <p>REPUBLIC OF THE PHILIPPINES</p>
            <p>CITY/MUNICIPALITY OF ____________________ ) S.S.</p>
            <p class="pt-4 text-md border-b-2 border-double border-black inline-block px-4">AFFIDAVIT OF LOW INCOME</p>
          </div>
          <p class="pt-4">
            I, <strong>${appName}</strong>, of legal age, Filipino, residing at <strong>${appAddr}</strong>, after having been duly sworn to in accordance with law, hereby depose and state that:
          </p>
          <ol class="list-decimal pl-6 space-y-2 text-justify">
            <li>I am a resident of the aforementioned address and belong to a low-income family;</li>
            <li>My household has an average monthly income of only <strong>${income}</strong>, derived primarily from my work/livelihood as a <strong>${livelihood}</strong>;</li>
            <li>I have <strong>${dependents}</strong> dependent(s) who rely on me for their daily sustenance, nutrition, and educational needs;</li>
            <li>Due to our limited financial capacity, we struggle to make ends meet and cope with special administrative or medical needs;</li>
            <li>I am executing this affidavit to attest to the truth of the foregoing facts and for the purpose of applying for <strong>${purpose}</strong>, and for whatever legal purpose this may serve.</li>
          </ol>
          <p class="pt-2">IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of ________________, 20___ at ________________________, Philippines.</p>
          <div class="pt-4 flex justify-end">
            <div class="w-1/2 text-center">
              <div class="mt-12 border-t border-black pt-1 w-full">
                <p class="font-bold uppercase">${appName}</p>
                <p class="text-xs text-slate-500 font-medium">Affiant / Declarant</p>
              </div>
            </div>
          </div>
          <div class="mt-8 border-t border-dashed pt-4 text-xs space-y-2">
            <p class="font-bold text-center">JURAT (NOTARY PUBLIC AREA)</p>
            <p class="text-justify leading-relaxed">
              SUBSCRIBED AND SWORN to before me this _____ day of _______________, 20___ at ________________________, Philippines, affiant exhibiting to me their Government Issued ID card: <strong>${govId}</strong>.
            </p>
            <div class="flex justify-between pt-4 text-[10px]">
              <div>
                <p>Doc. No. ______;</p>
                <p>Page. No. ______;</p>
                <p>Book. No. ______;</p>
                <p>Series of 20____.</p>
              </div>
              <div class="w-48 text-center border-t border-black mt-8 pt-1">
                <p>Notary Public</p>
              </div>
            </div>
          </div>
        </div>
      `
    } else {
      return `
        <div class="space-y-4 text-sm font-serif">
          <div class="text-center font-bold uppercase space-y-1">
            <p>REPUBLIKA NG PILIPINAS</p>
            <p>LUNGSOD/MUNISIPYO NG ____________________ ) S.S.</p>
            <p class="pt-4 text-md border-b-2 border-double border-black inline-block px-4">SINUMPAANG SALAYSAY NG PAGIGING KAPOS SA KITA</p>
          </div>
          <p class="pt-4">
            Ako si <strong>${appName}</strong>, sapat ang gulang, Pilipino, at kasalukuyang naninirahan sa <strong>${appAddr}</strong>, matapos makapanumpa nang naaayon sa batas, ay malayang nagsasalaysay ng mga sumusunod:
          </p>
          <ol class="list-decimal pl-6 space-y-2 text-justify">
            <li>Ako ay residente sa nabanggit na tirahan at kabilang sa isang pamilyang may mababang kita;</li>
            <li>Ang aming pamilya ay may tinatayang buwanang kita na <strong>${income}</strong>, na nagmumula sa aking paghahanapbuhay bilang <strong>${livelihood}</strong>;</li>
            <li>Mayroon akong <strong>${dependents}</strong> dependent(s) na umaasa sa aking pang-araw-araw na suporta para sa pagkain, kalusugan, at pag-aaral;</li>
            <li>Dahil sa aming limitadong kakayahang pinansyal, labis kaming nahihirapan na tustusan ang iba pang mga biglaang gastusin;</li>
            <li>Ginagawa ko ang salaysay na ito upang patunayan ang katotohanan ng mga nakasaad sa itaas at para sa layunin ng aking aplikasyon sa <strong>${purpose}</strong>, at para sa iba pang legal na layunin.</li>
          </ol>
          <p class="pt-2">BILANG PATUNAY, nilagdaan ko ito ngayong ika-_____ ng ________________, 20___ sa ________________________, Pilipinas.</p>
          <div class="pt-4 flex justify-end">
            <div class="w-1/2 text-center">
              <div class="mt-12 border-t border-black pt-1 w-full">
                <p class="font-bold uppercase">${appName}</p>
                <p class="text-xs text-slate-500 font-medium">Nagsasalaysay (Affiant)</p>
              </div>
            </div>
          </div>
          <div class="mt-8 border-t border-dashed pt-4 text-xs space-y-2">
            <p class="font-bold text-center">JURAT (NOTARY PUBLIC AREA)</p>
            <p class="text-justify leading-relaxed">
              NILAGDAAN AT SINUMPAAN sa harap ko ngayong ika-_____ ng _______________, 20___ sa ________________________, Pilipinas, matapos ipakita ng nagsasalaysay ang kanyang Government ID card: <strong>${govId}</strong>.
            </p>
            <div class="flex justify-between pt-4 text-[10px]">
              <div>
                <p>Kasulatan Blg. ______;</p>
                <p>Dahon Blg. ______;</p>
                <p>Aklat Blg. ______;</p>
                <p>Taon ng 20____.</p>
              </div>
              <div class="w-48 text-center border-t border-black mt-8 pt-1">
                <p>Notaryo Publiko</p>
              </div>
            </div>
          </div>
        </div>
      `
    }
  } else {
    // Request Letter
    const recipient = formatValue(form.value.recipient, 'recipient')
    const office = formatValue(form.value.office, 'office')
    const officeAddress = formatValue(form.value.officeAddress, 'officeAddress')
    const patientName = form.value.patientName.trim()
    const relToPatient = form.value.relationshipToPatient.trim()
    const purpose = formatValue(form.value.purposeRequest, 'purpose')
    const explanation = formatValue(form.value.explanationRequest, 'explanation')

    const requestSubject = patientName
      ? (isEn ? `REQUEST FOR ASSISTANCE FOR MY ${relToPatient.toUpperCase()}, ${patientName.toUpperCase()}` : `HILING PARA SA TULONG SA AKING ${relToPatient.toUpperCase()} NA SI ${patientName.toUpperCase()}`)
      : (isEn ? `REQUEST FOR FINANCIAL/MEDICAL ASSISTANCE` : `HILING PARA SA TULONG PINANSYAL / MEDIKAL`)

    if (isEn) {
      return `
        <div class="space-y-4">
          <p class="text-right font-medium">${dateStr}</p>
          <div class="space-y-1 font-medium">
            <p class="font-bold">${recipient}</p>
            <p>${office}</p>
            <p>${officeAddress}</p>
          </div>
          <p class="pt-2 font-bold uppercase border-b pb-1">SUBJECT: ${requestSubject}</p>
          <p>Dear Sir/Madam,</p>
          <p class="indent-8 text-justify leading-relaxed">
            I am writing this letter to respectfully request financial and welfare support from your office. I am <strong>${appName}</strong>, residing at <strong>${appAddr}</strong>.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            I am seeking assistance for <strong>${purpose}</strong>${patientName ? ` on behalf of my <strong>${relToPatient}</strong>, <strong>${patientName}</strong>` : ''}.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Our household is currently facing deep financial difficulties due to the following circumstances: <strong>${explanation}</strong>. We are struggling to secure the full amount to cover these essential expenses.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Any assistance that your honorable office can extend to us will be deeply appreciated and will provide major relief to our family in this trying time.
          </p>
          <p>Thank you very much, and I hope for your favorable consideration of this request.</p>
          <div class="pt-8">
            <p>Respectfully yours,</p>
            <div class="mt-12 border-t border-black pt-1 w-64 text-center">
              <p class="font-bold uppercase">${appName}</p>
              <p class="text-xs text-slate-500 font-medium">Applicant</p>
            </div>
          </div>
        </div>
      `
    } else {
      return `
        <div class="space-y-4">
          <p class="text-right font-medium">${dateStr}</p>
          <div class="space-y-1 font-medium">
            <p class="font-bold">${recipient}</p>
            <p>${office}</p>
            <p>${officeAddress}</p>
          </div>
          <p class="pt-2 font-bold uppercase border-b pb-1">PAKSA: ${requestSubject}</p>
          <p>Mahal na Ginoo / Ginang,</p>
          <p class="indent-8 text-justify leading-relaxed">
            Magalang akong sumusulat sa inyong tanggapan upang humingi ng tulong pinansyal at suporta. Ako si <strong>${appName}</strong>, na naninirahan sa <strong>${appAddr}</strong>.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Humihingi ako ng tulong para sa <strong>${purpose}</strong>${patientName ? ` para sa aking <strong>${relToPatient}</strong> na si <strong>${patientName}</strong>` : ''}.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Sa kasalukuyan, ang aming pamilya ay nakakaranas ng matinding kahirapang pinansyal dahil sa sumusunod na sitwasyon: <strong>${explanation}</strong>. Kami po ay nahihirapang mangalap ng sapat na pondo para tustusan ang mga gastusing ito.
          </p>
          <p class="indent-8 text-justify leading-relaxed">
            Ang anumang tulong na inyong maipapaabot sa aming pamilya ay tatanawin naming malaking utang na loob at magdudulot ng malaking kaginhawaan sa amin sa gitna ng pagsubok na ito.
          </p>
          <p>Maraming salamat po, at umaasa ako sa inyong mabuting pagsasaalang-alang sa hiling na ito.</p>
          <div class="pt-8">
            <p>Tapat na sumasainyo,</p>
            <div class="mt-12 border-t border-black pt-1 w-64 text-center">
              <p class="font-bold uppercase">${appName}</p>
              <p class="text-xs text-slate-500 font-medium">Aplikante</p>
            </div>
          </div>
        </div>
      `
    }
  }
})

// -------------------------------------------------------------
// PDF GENERATION LOGIC
// -------------------------------------------------------------
const downloadPDF = () => {
  if (!validateForm()) return

  const { jsPDF } = (window as any).jspdf || {}
  if (!jsPDF) {
    alert('PDF library is still loading. Please try again in a few seconds.')
    return
  }

  const isEn = locale.value === 'en'
  const appName = form.value.applicantName.trim()
  const appAddr = form.value.applicantAddress.trim()
  const dateStr = form.value.date ? new Date(form.value.date).toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  // Create an A4 PDF in mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Set standard serif times font
  doc.setFont('times', 'normal')
  doc.setFontSize(12)

  let y = 25
  const marginX = 20
  const widthLimit = 170 // 210mm A4 width - 40mm margins

  const drawParagraph = (text: string, spaceAfter = 6) => {
    const splitLines = doc.splitTextToSize(text, widthLimit)
    doc.text(splitLines, marginX, y)
    y += (splitLines.length * 6) + spaceAfter
  }

  if (selectedDoc.value === 'authorization') {
    const repName = form.value.repName.trim()
    const repAddr = form.value.repAddress.trim()
    const rel = form.value.relationship.trim()
    const purp = form.value.purposeAuth.trim()
    const exp = form.value.explanationAuth.trim()

    // Date
    doc.text(dateStr, 210 - marginX - doc.getTextWidth(dateStr), y)
    y += 15

    // Recipient
    doc.setFont('times', 'bold')
    doc.text('TO WHOM IT MAY CONCERN,', marginX, y)
    y += 12

    // Subject
    doc.setFontSize(13)
    doc.text('LETTER OF AUTHORIZATION', 105, y, { align: 'center' })
    doc.line(marginX + 35, y + 1.5, 210 - marginX - 35, y + 1.5)
    y += 12

    // Reset font
    doc.setFont('times', 'normal')
    doc.setFontSize(12)

    doc.text('Dear Sir/Madam,', marginX, y)
    y += 10

    const p1 = isEn
      ? `I, ${appName}, residing at ${appAddr}, hereby authorize ${repName}, who is my ${rel} and resides at ${repAddr}, to act as my official representative to ${purp} on my behalf.`
      : `Ako si ${appName}, na naninirahan sa ${appAddr}, ay nagbibigay-pahintulot kay ${repName}, na aking ${rel} at naninirahan sa ${repAddr}, na maging aking opisyal na kinatawan upang ${purp} para sa akin.`
    drawParagraph(p1, 6)

    const p2 = isEn
      ? `I am granting this authority because I am unable to perform this task in person due to the following reason: ${exp}.`
      : `Iginagawad ko ang pahintulot na ito dahil hindi ko ito magagawa nang personal dahil sa sumusunod na dahilan: ${exp}.`
    drawParagraph(p2, 6)

    const p3 = isEn
      ? `Please accept this letter along with photocopy of my valid identification card and my representative's identification card for verification purposes.`
      : `Sana ay tanggapin ninyo ang sulat na ito kasama ang photocopy ng aking valid ID at valid ID ng aking kinatawan para sa pagpapatunay.`
    drawParagraph(p3, 6)

    const p4 = isEn
      ? `Thank you for your cooperation and understanding.`
      : `Maraming salamat po sa inyong tulong at pag-unawa.`
    drawParagraph(p4, 15)

    // Signatures
    doc.text(isEn ? 'Sincerely,' : 'Gumagalang,', marginX, y)
    y += 20

    doc.setFont('times', 'bold')
    doc.text(appName.toUpperCase(), marginX, y)
    doc.text(repName.toUpperCase(), 110, y)

    doc.setFont('times', 'normal')
    doc.setFontSize(10)
    doc.text(isEn ? 'Authorizing Person / Grantor' : 'Nagpapahintulot', marginX, y + 4.5)
    doc.text(isEn ? 'Authorized Representative' : 'Kinatawan', 110, y + 4.5)

    // Download PDF
    doc.save(`Authorization_Letter_${appName.replace(/\s+/g, '_')}.pdf`)

  } else if (selectedDoc.value === 'low_income') {
    const income = form.value.monthlyIncome.trim()
    const livelihood = form.value.livelihood.trim()
    const dependents = form.value.dependents.trim()
    const purpose = form.value.purposeAffidavit.trim()
    const govId = form.value.governmentId.trim() ? form.value.governmentId.trim() : '____________________'

    // Header
    doc.setFont('times', 'bold')
    doc.text('REPUBLIC OF THE PHILIPPINES', 105, y, { align: 'center' })
    y += 6
    doc.text('CITY/MUNICIPALITY OF ____________________ ) S.S.', 105, y, { align: 'center' })
    y += 12

    doc.setFontSize(13)
    doc.text(isEn ? 'AFFIDAVIT OF LOW INCOME' : 'SINUMPAANG SALAYSAY NG PAGIGING KAPOS SA KITA', 105, y, { align: 'center' })
    doc.line(marginX + 20, y + 1.5, 210 - marginX - 20, y + 1.5)
    y += 12

    doc.setFont('times', 'normal')
    doc.setFontSize(12)

    const introText = isEn
      ? `I, ${appName}, of legal age, Filipino, residing at ${appAddr}, after having been duly sworn to in accordance with law, hereby depose and state that:`
      : `Ako si ${appName}, sapat ang gulang, Pilipino, at kasalukuyang naninirahan sa ${appAddr}, matapos makapanumpa nang naaayon sa batas, ay malayang nagsasalaysay ng mga sumusunod:`
    drawParagraph(introText, 8)

    // Numbered paragraphs
    const pts = isEn ? [
      `I am a resident of the aforementioned address and belong to a low-income family;`,
      `My household has an average monthly income of only ${income}, derived primarily from my work/livelihood as a ${livelihood};`,
      `I have ${dependents} dependent(s) who rely on me for their daily sustenance, nutrition, and educational needs;`,
      `Due to our limited financial capacity, we struggle to make ends meet and cope with special administrative or medical needs;`,
      `I am executing this affidavit to attest to the truth of the foregoing facts and for the purpose of applying for ${purpose}, and for whatever legal purpose this may serve.`
    ] : [
      `Ako ay residente sa nabanggit na tirahan at kabilang sa isang pamilyang may mababang kita;`,
      `Ang aming pamilya ay may tinatayang buwanang kita na ${income}, na nagmumula sa aking paghahanapbuhay bilang ${livelihood};`,
      `Mayroon akong ${dependents} dependent(s) na umaasa sa aking pang-araw-araw na suporta para sa pagkain, kalusugan, at pag-aaral;`,
      `Dahil sa aming limitadong kakayahang pinansyal, labis kaming nahihirapan na tustusan ang iba pang mga biglaang gastusin;`,
      `Ginagawa ko ang salaysay na ito upang patunayan ang katotohanan ng mga nakasaad sa itaas at para sa layunin ng aking aplikasyon sa ${purpose}, at para sa iba pang legal na layunin.`
    ]

    pts.forEach((pt, index) => {
      const bullet = `${index + 1}.  `
      doc.setFont('times', 'bold')
      doc.text(bullet, marginX, y)

      doc.setFont('times', 'normal')
      const paraWidth = widthLimit - doc.getTextWidth(bullet)
      const lines = doc.splitTextToSize(pt, paraWidth)
      doc.text(lines, marginX + 6, y)
      y += (lines.length * 6) + 4
    })

    y += 4
    const signText = isEn
      ? `IN WITNESS WHEREOF, I have hereunto set my hand this _____ day of ________________, 20___ at ________________________, Philippines.`
      : `BILANG PATUNAY, nilagdaan ko ito ngayong ika-_____ ng ________________, 20___ sa ________________________, Pilipinas.`
    drawParagraph(signText, 15)

    // Affiant Signature
    doc.setFont('times', 'bold')
    const affiantName = appName.toUpperCase()
    doc.text(affiantName, 210 - marginX - 60, y, { align: 'center' })
    doc.line(210 - marginX - 85, y + 1, 210 - marginX - 35, y + 1)

    doc.setFont('times', 'normal')
    doc.setFontSize(10)
    doc.text(isEn ? 'Affiant / Declarant' : 'Nagsasalaysay (Affiant)', 210 - marginX - 60, y + 5, { align: 'center' })
    y += 20

    // Jurat
    doc.line(marginX, y, 210 - marginX, y, 'FD') // divider line
    y += 8

    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    doc.text('JURAT (NOTARY PUBLIC AREA)', 105, y, { align: 'center' })
    y += 6

    doc.setFont('times', 'normal')
    doc.setFontSize(10)
    const juratText = isEn
      ? `SUBSCRIBED AND SWORN to before me this _____ day of _______________, 20___ at ________________________, Philippines, affiant exhibiting to me their Government Issued ID card: ${govId}.`
      : `NILAGDAAN AT SINUMPAAN sa harap ko ngayong ika-_____ ng _______________, 20___ sa ________________________, Pilipinas, matapos ipakita ng nagsasalaysay ang kanyang Government ID card: ${govId}.`

    const juratLines = doc.splitTextToSize(juratText, widthLimit)
    doc.text(juratLines, marginX, y)
    y += (juratLines.length * 4.5) + 8

    // Jurat numbers and Notary signature
    doc.text('Doc. No. ______;', marginX, y)
    doc.text('Page. No. ______;', marginX, y + 4.5)
    doc.text('Book. No. ______;', marginX, y + 9)
    doc.text('Series of 20____.', marginX, y + 13.5)

    doc.setFont('times', 'bold')
    doc.text('NOTARY PUBLIC', 210 - marginX - 40, y + 9, { align: 'center' })
    doc.line(210 - marginX - 65, y + 8, 210 - marginX - 15, y + 8)

    doc.save(`Affidavit_of_Low_Income_${appName.replace(/\s+/g, '_')}.pdf`)

  } else {
    // Request Letter
    const recipient = form.value.recipient.trim()
    const office = form.value.office.trim()
    const officeAddress = form.value.officeAddress.trim()
    const patientName = form.value.patientName.trim()
    const relToPatient = form.value.relationshipToPatient.trim()
    const purpose = form.value.purposeRequest.trim()
    const explanation = form.value.explanationRequest.trim()

    const requestSubject = patientName
      ? (isEn ? `REQUEST FOR ASSISTANCE FOR MY ${relToPatient.toUpperCase()}, ${patientName.toUpperCase()}` : `HILING PARA SA TULONG SA AKING ${relToPatient.toUpperCase()} NA SI ${patientName.toUpperCase()}`)
      : (isEn ? `REQUEST FOR FINANCIAL/MEDICAL ASSISTANCE` : `HILING PARA SA TULONG PINANSYAL / MEDIKAL`)

    // Date
    doc.text(dateStr, 210 - marginX - doc.getTextWidth(dateStr), y)
    y += 12

    // Recipient Address Block
    doc.setFont('times', 'bold')
    doc.text(recipient.toUpperCase(), marginX, y)
    y += 5.5
    doc.setFont('times', 'normal')
    doc.text(office, marginX, y)
    y += 5.5
    doc.text(officeAddress, marginX, y)
    y += 12

    // Subject
    doc.setFont('times', 'bold')
    doc.text(isEn ? `SUBJECT: ${requestSubject}` : `PAKSA: ${requestSubject}`, marginX, y)
    doc.line(marginX, y + 1.5, marginX + doc.getTextWidth(isEn ? `SUBJECT: ${requestSubject}` : `PAKSA: ${requestSubject}`), y + 1.5)
    y += 12

    doc.setFont('times', 'normal')
    doc.text('Dear Sir/Madam,', marginX, y)
    y += 10

    const p1 = isEn
      ? `I am writing this letter to respectfully request financial and welfare support from your good office. I am ${appName}, residing at ${appAddr}.`
      : `Magalang akong sumusulat sa inyong tanggapan upang humingi ng tulong pinansyal at suporta. Ako si ${appName}, na naninirahan sa ${appAddr}.`
    drawParagraph(p1, 6)

    const p2 = isEn
      ? `I am seeking assistance for ${purpose}${patientName ? ` on behalf of my ${relToPatient}, ${patientName}` : ''}.`
      : `Humihingi ako ng tulong para sa ${purpose}${patientName ? ` para sa aking ${relToPatient} na si ${patientName}` : ''}.`
    drawParagraph(p2, 6)

    const p3 = isEn
      ? `Our household is currently facing deep financial difficulties due to the following circumstances: ${explanation}. We are struggling to secure the full amount to cover these essential expenses.`
      : `Sa kasalukuyan, ang aming pamilya ay nakakaranas ng matinding kahirapang pinansyal dahil sa sumusunod na sitwasyon: ${explanation}. Kami po ay nahihirapang mangalap ng sapat na pondo para tustusan ang mga gastusing ito.`
    drawParagraph(p3, 6)

    const p4 = isEn
      ? `Any assistance that your honorable office can extend to us will be deeply appreciated and will provide major relief to our family in this trying time.`
      : `Ang anumang tulong na inyong maipapaabot sa aming pamilya ay tatanawin naming malaking utang na loob at magdudulot ng malaking kaginhawaan sa amin sa gitna ng pagsubok na ito.`
    drawParagraph(p4, 6)

    const p5 = isEn
      ? `Thank you very much, and I hope for your favorable consideration of this request.`
      : `Maraming salamat po, at umaasa ako sa inyong mabuting pagsasaalang-alang sa hiling na ito.`
    drawParagraph(p5, 15)

    // Valediction & Signature
    doc.text(isEn ? 'Respectfully yours,' : 'Tapat na sumasainyo,', marginX, y)
    y += 20

    doc.setFont('times', 'bold')
    doc.text(appName.toUpperCase(), marginX, y)
    doc.line(marginX, y + 1, marginX + 60, y + 1)

    doc.setFont('times', 'normal')
    doc.setFontSize(10)
    doc.text(isEn ? 'Applicant' : 'Aplikante', marginX, y + 5)

    doc.save(`Request_Letter_${appName.replace(/\s+/g, '_')}.pdf`)
  }
}

const triggerPrint = () => {
  if (!validateForm()) return
  window.print()
}

// -------------------------------------------------------------
// PREREQUISITE GUIDES STATE & INTERACTIVE CHECKLISTS
// -------------------------------------------------------------
const selectedGuide = ref<'indigency' | 'no_income'>('indigency')

// Checkbox lists (saved to localStorage for persistence)
const checkedItems = ref<Record<string, boolean>>({})

const toggleCheckItem = (id: string) => {
  checkedItems.value[id] = !checkedItems.value[id]
  localStorage.setItem('ayuda_guide_checked', JSON.stringify(checkedItems.value))
}

onMounted(() => {
  const saved = localStorage.getItem('ayuda_guide_checked')
  if (saved) {
    try {
      checkedItems.value = JSON.parse(saved)
    } catch (e) {
      checkedItems.value = {}
    }
  }
})

// Guide Details Data
const guidesData = computed(() => {
  const isEn = locale.value === 'en'

  return {
    indigency: {
      title: t('assistance.barangayIndigency'),
      where: isEn ? 'Your local Barangay Hall (Must have at least 6 months of residency)' : 'Sa Barangay Hall ng iyong nasasakupan (Dapat residente nang kahit 6 na buwan)',
      timeline: isEn ? 'Within the day (usually 10 to 30 minutes)' : 'Sa loob ng araw na iyon (karaniwang 10 hanggang 30 minuto)',
      fees: isEn
        ? 'FREE (Under RA 11261 for first-time jobseekers, or waived for indigent welfare programs in most barangays. Otherwise, a minimal processing fee of ₱20 to ₱50 may apply).'
        : 'LIBRE (Sa ilalim ng RA 11261 para sa naghahanap ng unang trabaho, o libre para sa may krisis sa karamihan ng barangay. Kung hindi, minimal na singil na ₱20 hanggang ₱50).',
      requirements: [
        { id: 'ind_req1', text: isEn ? 'At least 1 Valid Government ID proving residence' : 'Kahit 1 Valid Government ID na nagpapatunay ng iyong address' },
        { id: 'ind_req2', text: isEn ? 'Proof of Residency (e.g. Utility bill under applicant name, land contract, or certification from landlord)' : 'Patunay ng Pagkatira (hal. Bill ng kuryente/tubig sa pangalan mo, o sertipikasyon mula sa may-ari ng bahay)' },
        { id: 'ind_req3', text: isEn ? 'Community Tax Certificate (Cedula) - usually purchased at the Barangay Hall for ₱5 to ₱30' : 'Cedula (Community Tax Certificate) - karaniwang binibili sa Barangay Hall sa halagang ₱5 hanggang ₱30' },
        { id: 'ind_req4', text: isEn ? 'First Time Jobseeker Oath (Optional, if applying for jobs to waive all fees)' : 'Panunumpa bilang First Time Jobseeker (Opsyonal, kung gagamitin sa paghahanap ng trabaho upang maging libre)' }
      ],
      steps: [
        { id: 'ind_step1', title: isEn ? 'Visit the Barangay Hall' : 'Pumunta sa Barangay Hall', desc: isEn ? 'Go to the Barangay Hall of your residence. Bring your own black ballpoint pen and photocopies of your valid ID.' : 'Magtungo sa Barangay Hall ng inyong komunidad. Magdala ng sariling itim na ballpen at kopya ng iyong valid ID.' },
        { id: 'ind_step2', title: isEn ? 'Secure a Cedula' : 'Kumuha ng Cedula', desc: isEn ? 'If you do not have a Cedula for the current calendar year, request one at the cashier/assessment desk. Pay the minor fee based on your income (or declare no income for minimal fee).' : 'Kung wala ka pang Cedula para sa kasalukuyang taon, kumuha muna sa cashier. Magbayad ng kaunting halaga base sa iyong kita (sabihing walang trabaho kung walang kita).' },
        { id: 'ind_step3', title: isEn ? 'Fill out the Request Form' : 'Punan ang Request Form', desc: isEn ? 'Ask the desk officer for a Request Form for Certificate of Indigency. Clearly write the purpose of your application (e.g., "DSWD AICS Aid", "BIR Tax Exemption", "Hospitalization Malasakit").' : 'Humingi ng Request Form para sa Certificate of Indigency. Isulat nang malinaw ang layunin (hal., "Tulong mula sa DSWD", "BIR Tax Exemption", "Malasakit Center sa Ospital").' },
        { id: 'ind_step4', title: isEn ? 'Assessment and Verification' : 'Pagsusuri at Pagpapatunay', desc: isEn ? 'The barangay secretary will check if you are registered in their local resident listing. They may ask brief questions about your housing status or job situation.' : 'Susuriin ng Barangay Secretary kung ikaw ay nakalista bilang residente sa kanilang barangay record. Maaari silang magtanong ukol sa iyong trabaho.' },
        { id: 'ind_step5', title: isEn ? 'Document Release' : 'Paglabas ng Dokumento', desc: isEn ? 'Wait for the Barangay Chairman or authorized officer to sign the certificate. Once stamped with the official seal, it will be released to you. Double-check spelling before leaving.' : 'Maghintay na mapirmahan ng Barangay Chairman ang iyong dokumento. Kapag naselyohan na, ibibigay na ito sa iyo. Suriin ang spelling bago umalis.' }
      ],
      tips: [
        isEn ? 'Always request the document for "Welfare Assistance" or "Medical Aid" so they can waive the fees entirely.' : 'Palaging sabihing gagamitin sa "Tulong Medikal" o "Crisis Assistance" upang alisin ang anumang bayarin sa barangay.',
        isEn ? 'If you are applying for jobs, present a First-Time Jobseeker certification to invoke Republic Act 11261 for 100% free release.' : 'Kung ikaw ay mag-aapply ng trabaho sa unang pagkakataon, gamitin ang Barangay Certification para sa First-Time Jobseeker sa ilalim ng RA 11261 para maging libre.',
        isEn ? 'Bring extra photocopies of your IDs. Many government counters will require them, and internet cafes charge a premium for xerox copies.' : 'Magdala ng ekstrang photocopy ng iyong mga ID upang hindi na magbayad ng mahal sa mga xerox machine sa labas.'
      ]
    },
    no_income: {
      title: t('assistance.birNoIncome'),
      where: isEn
        ? 'BIR Revenue District Office (RDO) that holds jurisdiction over your municipality of residence.'
        : 'BIR Revenue District Office (RDO) na sumasakop sa iyong munisipalidad o lungsod.',
      timeline: isEn ? 'Within the day (usually 1 to 2 hours, depending on RDO queue lines)' : 'Sa loob ng araw na iyon (karaniwang 1 hanggang 2 oras depende sa haba ng pila)',
      fees: isEn ? 'FREE or minor Documentary Stamp Tax (approx. ₱30).' : 'LIBRE o kaunting Documentary Stamp Tax (humigit-kumulang ₱30).',
      requirements: [
        { id: 'inc_req1', text: isEn ? 'Barangay Certificate of Indigency (Prerequisite! Must specify BIR as the purpose)' : 'Barangay Certificate of Indigency (Unang kailangan! Dapat BIR ang nakalagay na layunin)' },
        { id: 'inc_req2', text: isEn ? 'Notarized Affidavit of Low Income or No Income (You can generate this in our Document Generator tab!)' : 'Notarized Affidavit of Low Income o No Income (Maaari mong gawin ito sa tab ng Paggawa ng Dokumento!)' },
        { id: 'inc_req3', text: isEn ? 'Photocopy of 2 Valid Government-Issued IDs (e.g. UMID, Voters ID, PhilHealth, Barangay ID)' : 'Photocopy ng 2 Valid Government-Issued ID (hal. UMID, Voters ID, PhilHealth, Barangay ID)' },
        { id: 'inc_req4', text: isEn ? 'Completed BIR Form 1917 (Application for Tax Exemption Certificate)' : 'Pinalagdaang BIR Form 1917 (Application for Tax Exemption Certificate)' }
      ],
      steps: [
        { id: 'inc_step1', title: isEn ? 'Acquire Barangay Certificate of Indigency' : 'Kumuha muna ng Barangay Certificate of Indigency', desc: isEn ? 'Get your Barangay Indigency Certificate first. Ensure the purpose listed is "For BIR Certificate of No Income" or "For Tax Exemption Certificate".' : 'Kumuha muna ng Barangay Certificate of Indigency. Tiyaking ang nakalagay na purpose ay para sa BIR.' },
        { id: 'inc_step2', title: isEn ? 'Prepare Affidavit of Low Income' : 'Ihanda ang Affidavit of Low Income', desc: isEn ? 'Fill out and print the Affidavit of Low Income using our generator. Have it notarized by a notary public (often free/discounted for indigents at Public Attorney\'s Office - PAO) or signed by your Barangay Captain.' : 'Ihanda at i-print ang Affidavit of Low Income. Ipa-notaryo ito sa pinakamalapit na notaryo o magtanong sa PAO para sa libreng serbisyo.' },
        { id: 'inc_step3', title: isEn ? 'Locate your jurisdiction BIR RDO' : 'Hanapin ang iyong nakatalagang BIR RDO', desc: isEn ? 'Find out which BIR Revenue District Office (RDO) covers your hometown. You must apply at this specific branch.' : 'Alamin kung aling tanggapan ng BIR RDO ang sumasaklaw sa inyong lugar. Dapat sa sangay na iyon ka mag-apply.' },
        { id: 'inc_step4', title: isEn ? 'Submit and File at BIR RDO' : 'Isumite ang mga papeles sa BIR RDO', desc: isEn ? 'Go to the taxpayer assistance unit at the RDO. Ask for BIR Form 1917, fill it out, and submit all requirements (Indigency, Affidavit, ID copies).' : 'Magtungo sa taxpayer assistance unit sa RDO. Humingi ng BIR Form 1917, punan ito, at ipasa ang mga dokumento (Indigency, Affidavit, ID copies).' },
        { id: 'inc_step5', title: isEn ? 'Receive Certificate of Tax Exemption' : 'Tanggapin ang Tax Exemption Certificate', desc: isEn ? 'Wait for the officer to verify that you have no record of tax filing. Once cleared, the Certificate of Tax Exemption (No Income) will be signed and handed to you.' : 'Maghintay na ma-verify ng opisyal na wala kang rekord ng pagbabayad ng buwis. Kapag okay na, ibibigay na ang Certificate of Tax Exemption (No Income).' }
      ],
      tips: [
        isEn ? 'If the BIR RDO is far, check if your local municipal social welfare office (MSWD) will accept just the Barangay Certificate of Indigency as sufficient proof of low income. Many programs are lenient during emergencies.' : 'Kung malayo ang tanggapan ng BIR RDO, itanong sa DSWD o MSWD kung tatanggapin na muna ang Barangay Certificate of Indigency bilang sapat na patunay. Maraming programa ang pumapayag dito sa panahon ng krisis.',
        isEn ? 'To avoid notary fees, look for the Public Attorney\'s Office (PAO) near the municipal hall, which offers free notary services for qualified indigent clients.' : 'Upang makaiwas sa bayad sa notaryo, maghanap ng tanggapan ng Public Attorney\'s Office (PAO) na malapit sa munisipyo, na nagbibigay ng libreng notaryo para sa mga indigent.',
        isEn ? 'Ensure you bring your own black ink pen as writing instruments are rarely shared at government security counters.' : 'Magdala ng sariling itim na bolpen dahil madalas ay walang mahihiramang panulat sa mga counter ng gobyerno.'
      ]
    }
  }
})

// Progress percentage calculations
const guideProgress = computed(() => {
  const data = guidesData.value[selectedGuide.value]
  const total = data.requirements.length + data.steps.length
  if (total === 0) return 0

  let checked = 0
  data.requirements.forEach(r => {
    if (checkedItems.value[r.id]) checked++
  })
  data.steps.forEach(s => {
    if (checkedItems.value[s.id]) checked++
  })

  return Math.round((checked / total) * 100)
})
</script>

<template>
  <div>
    <!-- Hidden Print-Only Container -->
    <div class="hidden print:block print:p-12 text-black bg-white font-serif text-sm leading-relaxed min-h-screen">
      <div v-html="letterPreviewHTML" class="print-document"></div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-8 pb-20 animate-fade-in print:hidden">
      <!-- Header Hero -->
      <div class="mb-8 text-center max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          {{ $t('assistance.title') }}
        </h2>
        <p class="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base font-normal">
          {{ $t('assistance.desc') }}
        </p>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex justify-center mb-8">
        <div
          class="inline-flex bg-slate-200/60 dark:bg-slate-900 border border-slate-300/50 dark:border-slate-800 p-1 rounded-xl shadow-sm">
          <button @click="activeTab = 'generator'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer"
            :class="activeTab === 'generator'
              ? 'bg-blue-900 dark:bg-blue-800 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
            <FileSpreadsheet class="w-4 h-4" />
            <span>{{ $t('assistance.tabGenerator') }}</span>
          </button>
          <button @click="activeTab = 'guides'"
            class="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer"
            :class="activeTab === 'guides'
              ? 'bg-blue-900 dark:bg-blue-800 text-white shadow'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'">
            <Wand2 class="w-4 h-4" />
            <span>{{ $t('assistance.tabGuides') }}</span>
          </button>
        </div>
      </div>

      <!-- TAB 1: DOCUMENT GENERATOR -->
      <div v-if="activeTab === 'generator'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Input Form Column -->
        <div class="lg:col-span-5 space-y-6">
          <div
            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div class="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <FileText class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
                {{ $t('assistance.formTitle') }}
              </h3>
            </div>

            <form @submit.prevent class="space-y-4">
              <!-- Document Type Selection -->
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {{ $t('assistance.docType') }}
                </label>
                <select v-model="selectedDoc"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                  <option value="authorization">{{ $t('assistance.authLetter') }}</option>
                  <option value="low_income">{{ $t('assistance.affidavitLowIncome') }}</option>
                  <option value="request">{{ $t('assistance.requestLetter') }}</option>
                </select>
              </div>

              <!-- Date -->
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {{ $t('assistance.date') }}
                </label>
                <input type="date" v-model="form.date"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <!-- Common Fields: Applicant Name & Address -->
              <div>
                <label
                  class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {{ $t('assistance.applicantName') }}
                </label>
                <input type="text" v-model="form.applicantName" placeholder="e.g. Juan dela Cruz"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-rose-500 dark:border-rose-500': errors.applicantName }" />
                <p v-if="errors.applicantName" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.applicantName
                  }}
                </p>
              </div>

              <div>
                <label
                  class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  {{ $t('assistance.applicantAddress') }}
                </label>
                <input type="text" v-model="form.applicantAddress" placeholder="e.g. 123 Rizal St., Barangay 4, Manila"
                  class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  :class="{ 'border-rose-500 dark:border-rose-500': errors.applicantAddress }" />
                <p v-if="errors.applicantAddress" class="text-rose-500 text-xs mt-1 font-semibold">{{
                  errors.applicantAddress }}</p>
              </div>

              <!-- Dynamic Form Fields: AUTHORIZATION LETTER -->
              <div v-if="selectedDoc === 'authorization'"
                class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {{ $t('assistance.repName') }}
                  </label>
                  <input type="text" v-model="form.repName" placeholder="e.g. Maria dela Cruz"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.repName }" />
                  <p v-if="errors.repName" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.repName }}</p>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {{ $t('assistance.repAddress') }}
                  </label>
                  <input type="text" v-model="form.repAddress" placeholder="e.g. 123 Rizal St., Barangay 4, Manila"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.repAddress }" />
                  <p v-if="errors.repAddress" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.repAddress }}
                  </p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.relationship') }}
                    </label>
                    <input type="text" v-model="form.relationship" placeholder="e.g. Spouse, Daughter"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.relationship }" />
                    <p v-if="errors.relationship" class="text-rose-500 text-xs mt-1 font-semibold">{{
                      errors.relationship
                      }}</p>
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.purpose') }}
                    </label>
                    <input type="text" v-model="form.purposeAuth" placeholder="e.g. claim my AICS cash aid"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.purposeAuth }" />
                    <p v-if="errors.purposeAuth" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.purposeAuth
                      }}
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Reason for Authorization
                  </label>
                  <input type="text" v-model="form.explanationAuth"
                    placeholder="e.g. I am currently admitted in the hospital"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.explanationAuth }" />
                  <p v-if="errors.explanationAuth" class="text-rose-500 text-xs mt-1 font-semibold">{{
                    errors.explanationAuth }}</p>
                </div>
              </div>

              <!-- Dynamic Form Fields: AFFIDAVIT OF LOW INCOME -->
              <div v-if="selectedDoc === 'low_income'"
                class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.monthlyIncome') }}
                    </label>
                    <input type="text" v-model="form.monthlyIncome" placeholder="e.g. ₱5,000"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.monthlyIncome }" />
                    <p v-if="errors.monthlyIncome" class="text-rose-500 text-xs mt-1 font-semibold">{{
                      errors.monthlyIncome }}</p>
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.livelihood') }}
                    </label>
                    <input type="text" v-model="form.livelihood" placeholder="e.g. Tricycle Driver"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.livelihood }" />
                    <p v-if="errors.livelihood" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.livelihood }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.dependents') }}
                    </label>
                    <select v-model="form.dependents"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                      <option v-for="n in 10" :key="n" :value="String(n)">{{ n }}</option>
                    </select>
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Government ID / Details
                    </label>
                    <input type="text" v-model="form.governmentId" placeholder="e.g. UMID 12-34567-8"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Application Purpose
                  </label>
                  <input type="text" v-model="form.purposeAffidavit"
                    placeholder="e.g. DSWD Cash Assistance / Scholarship"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.purposeAffidavit }" />
                  <p v-if="errors.purposeAffidavit" class="text-rose-500 text-xs mt-1 font-semibold">{{
                    errors.purposeAffidavit }}</p>
                </div>
              </div>

              <!-- Dynamic Form Fields: REQUEST LETTER -->
              <div v-if="selectedDoc === 'request'"
                class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {{ $t('assistance.recipient') }}
                  </label>
                  <input type="text" v-model="form.recipient" placeholder="e.g. Hon. Mayor Juan dela Cruz"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.recipient }" />
                  <p v-if="errors.recipient" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.recipient }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.office') }}
                    </label>
                    <input type="text" v-model="form.office" placeholder="e.g. Office of the Mayor"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.office }" />
                    <p v-if="errors.office" class="text-rose-500 text-xs mt-1 font-semibold">{{ errors.office }}</p>
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.officeAddress') }}
                    </label>
                    <input type="text" v-model="form.officeAddress" placeholder="e.g. City Hall, Manila"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      :class="{ 'border-rose-500 dark:border-rose-500': errors.officeAddress }" />
                    <p v-if="errors.officeAddress" class="text-rose-500 text-xs mt-1 font-semibold">{{
                      errors.officeAddress }}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      {{ $t('assistance.patientName') }} (Optional)
                    </label>
                    <input type="text" v-model="form.patientName" placeholder="e.g. Pedro dela Cruz"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Relationship to Patient
                    </label>
                    <input type="text" v-model="form.relationshipToPatient" placeholder="e.g. Father, Spouse"
                      class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Request Assistance For
                  </label>
                  <input type="text" v-model="form.purposeRequest"
                    placeholder="e.g. financial assistance for chemo drugs"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.purposeRequest }" />
                  <p v-if="errors.purposeRequest" class="text-rose-500 text-xs mt-1 font-semibold">{{
                    errors.purposeRequest }}</p>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    {{ $t('assistance.explanation') }}
                  </label>
                  <textarea v-model="form.explanationRequest" rows="3"
                    placeholder="e.g. my spouse was laid off last month and our hospital bills have reached ₱50,000"
                    class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    :class="{ 'border-rose-500 dark:border-rose-500': errors.explanationRequest }"></textarea>
                  <p v-if="errors.explanationRequest" class="text-rose-500 text-xs mt-1 font-semibold">{{
                    errors.explanationRequest }}</p>
                </div>
              </div>

              <!-- Download and Print Actions -->
              <div class="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <motion.button @click="downloadPDF"
                  class="bg-blue-900 hover:bg-blue-800 dark:bg-blue-800 dark:hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                  :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
                  <Download class="w-4 h-4" />
                  <span>{{ $t('assistance.downloadPdf') }}</span>
                </motion.button>
                <motion.button @click="triggerPrint"
                  class="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 font-bold py-2.5 px-4 rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  :whileHover="{ scale: 1.02 }" :whileTap="{ scale: 0.98 }">
                  <Printer class="w-4 h-4" />
                  <span>{{ $t('assistance.print') }}</span>
                </motion.button>
              </div>
            </form>
          </div>
        </div>

        <!-- Live Preview Column -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between px-2">
            <span
              class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info class="w-3.5 h-3.5" />
              <span>{{ $t('assistance.previewTitle') }}</span>
            </span>
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              A4 Standard Sheet
            </span>
          </div>

          <!-- Sheet Preview Wrapper -->
          <div
            class="bg-slate-200/50 dark:bg-slate-900 border border-slate-300/60 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-inner max-h-[85vh] overflow-y-auto">
            <!-- The Actual Paper Sheet (Draggable) -->
            <motion.div drag :drag-snap-to-origin="true"
              class="paper-sheet bg-white text-slate-900 rounded shadow-lg mx-auto w-full max-w-[210mm] min-h-[297mm] h-auto font-serif text-sm leading-relaxed border border-slate-300 selection:bg-blue-100 relative cursor-grab active:cursor-grabbing select-none">
              <!-- Paper Header Watermark -->
              <div
                class="absolute top-1 right-4 text-[10px] text-slate-300 font-sans tracking-wide uppercase pointer-events-none select-none">
                Ayuda Template Preview
              </div>

              <!-- Dynamic content injected -->
              <div v-html="letterPreviewHTML" class="preview-document text-justify whitespace-pre-line"></div>
            </motion.div>
          </div>
        </div>
      </div>

      <!-- TAB 2: PREREQUISITE GUIDES (MINI-WIZARD) -->
      <div v-if="activeTab === 'guides'" class="max-w-4xl mx-auto space-y-6">
        <!-- Guide Selector Header -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5 mb-5">
            <div class="space-y-1">
              <h3 class="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{{ $t('assistance.guideTitle') }}</span>
              </h3>
              <p class="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                {{ $t('assistance.guideDesc') }}
              </p>
            </div>

            <!-- Selector -->
            <div class="relative w-full md:w-90">
              <select v-model="selectedGuide"
                class="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="indigency">{{ $t('assistance.barangayIndigency') }}</option>
                <option value="no_income">{{ $t('assistance.birNoIncome') }}</option>
              </select>
            </div>
          </div>

          <!-- Guide Overview Dashboard (Vibrant Cards) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              class="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/50 dark:border-blue-900/30 p-4 rounded-xl flex gap-3">
              <span
                class="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg text-blue-800 dark:text-blue-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <MapPin class="w-5 h-5" />
              </span>
              <div>
                <p class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {{ $t('assistance.whereToGet') }}
                </p>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-normal">
                  {{ guidesData[selectedGuide].where }}
                </p>
              </div>
            </div>

            <div
              class="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 p-4 rounded-xl flex gap-3">
              <span
                class="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-800 dark:text-amber-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <Clock class="w-5 h-5" />
              </span>
              <div>
                <p class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {{ $t('assistance.timeline') }}
                </p>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-normal">
                  {{ guidesData[selectedGuide].timeline }}
                </p>
              </div>
            </div>

            <div
              class="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 p-4 rounded-xl flex gap-3">
              <span
                class="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-800 dark:text-emerald-400 h-10 w-10 flex items-center justify-center flex-shrink-0">
                <CircleDollarSign class="w-5 h-5" />
              </span>
              <div>
                <p class="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  {{ $t('assistance.fees') }}
                </p>
                <p class="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 leading-normal">
                  {{ guidesData[selectedGuide].fees }}
                </p>
              </div>
            </div>
          </div>

          <!-- Progress Tracker Bar -->
          <div class="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-bold text-slate-650 dark:text-slate-350 flex items-center gap-1.5">
                <CheckSquare class="w-4 h-4 text-blue-900 dark:text-blue-400" />
                <span>{{ $t('assistance.progress') }}</span>
              </span>
              <span class="text-xs font-extrabold text-blue-900 dark:text-blue-400">
                {{ guideProgress }}%
              </span>
            </div>
            <div
              class="w-full bg-slate-100 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <div class="bg-blue-900 dark:bg-blue-800 h-full transition-all duration-300"
                :style="{ width: `${guideProgress}%` }"></div>
            </div>
            <p class="text-[10px] text-slate-400 mt-1.5 font-medium">
              {{ $t('assistance.saveProgress') }}
            </p>
          </div>
        </div>

        <!-- Two Column Layout: Requirements & Procedure -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          <!-- Prerequisites Checklist Card -->
          <div
            class="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h4
              class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
              {{ $t('assistance.requirements') }}
            </h4>

            <div class="space-y-3">
              <div v-for="req in guidesData[selectedGuide].requirements" :key="req.id" @click="toggleCheckItem(req.id)"
                class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl cursor-pointer hover:border-blue-300 dark:hover:border-blue-900 transition-colors"
                :class="checkedItems[req.id] ? 'border-emerald-250 dark:border-emerald-900/60 bg-emerald-50/10 dark:bg-emerald-950/5' : 'border-slate-200 dark:border-slate-800/80'">
                <div class="mt-0.5">
                  <CheckCircle class="w-4.5 h-4.5 transition-colors"
                    :class="checkedItems[req.id] ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950/50' : 'text-slate-300'" />
                </div>
                <span class="text-xs leading-relaxed font-semibold transition-all"
                  :class="checkedItems[req.id] ? 'text-slate-500 dark:text-slate-450 line-through' : 'text-slate-700 dark:text-slate-350'">
                  {{ req.text }}
                </span>
              </div>
            </div>
          </div>

          <!-- Step-by-Step Procedure Card -->
          <div
            class="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h4
                class="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
                {{ $t('assistance.steps') }}
              </h4>

              <div class="space-y-4">
                <div v-for="(step, idx) in guidesData[selectedGuide].steps" :key="step.id"
                  @click="toggleCheckItem(step.id)"
                  class="flex gap-4 items-start p-3 hover:bg-slate-50/60 dark:hover:bg-slate-950/30 rounded-xl transition-all border border-transparent cursor-pointer"
                  :class="checkedItems[step.id] ? 'opacity-60' : ''">
                  <!-- Numeric Step Badge -->
                  <span
                    class="w-7 h-7 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 border transition-all"
                    :class="checkedItems[step.id]
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400'
                      : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/20 dark:border-blue-800 dark:text-blue-400'">
                    <CheckCircle v-if="checkedItems[step.id]" class="w-4.5 h-4.5" />
                    <span v-else>{{ idx + 1 }}</span>
                  </span>

                  <!-- Text content -->
                  <div class="space-y-1">
                    <h5 class="text-sm font-extrabold text-slate-900 dark:text-white"
                      :class="checkedItems[step.id] ? 'line-through text-slate-500' : ''">
                      {{ step.title }}
                    </h5>
                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {{ step.desc }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Applicant Tips (Premium Alert/Collapsible) -->
            <div class="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
              <h4
                class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <AlertCircle class="w-4 h-4 text-amber-500" />
                <span>{{ $t('assistance.tips') }}</span>
              </h4>

              <div
                class="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-2xl p-4 space-y-2.5">
                <div v-for="(tip, idx) in guidesData[selectedGuide].tips" :key="idx"
                  class="flex gap-2 text-xs leading-relaxed text-slate-700 dark:text-slate-350 font-medium align-top">
                  <ChevronRight class="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p>{{ tip }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.indent-8 {
  text-indent: 2rem;
}

/* Print specific adjustments inside screen layout */
.print-document {
  color: black;
  background-color: white;
}

/* Custom shadow / background values */
.border-emerald-250 {
  border-color: rgba(16, 185, 129, 0.4);
}

/* Letter Document Typography & Spacing Overrides */
.preview-document,
.print-document {
  font-family: 'Times New Roman', Times, Baskerville, Georgia, serif !important;
  font-size: 13.5px !important;
  line-height: 1.65 !important;
  color: #000000 !important;
}

.preview-document p,
.print-document p {
  margin-top: 0 !important;
  margin-bottom: 1.25rem !important;
  /* Restores padding/margin between paragraphs */
}

.preview-document .indent-8,
.print-document .indent-8 {
  text-indent: 2.25rem !important;
  /* Restores paragraph indentation */
}

.preview-document .text-justify,
.print-document .text-justify {
  text-align: justify !important;
}

.preview-document .text-right,
.print-document .text-right {
  text-align: right !important;
  margin-bottom: 2rem !important;
}

.preview-document .text-center,
.print-document .text-center {
  text-align: center !important;
}

.preview-document .font-bold,
.print-document .font-bold {
  font-weight: 700 !important;
}

.preview-document .uppercase,
.print-document .uppercase {
  text-transform: uppercase !important;
}

.preview-document .border-b,
.print-document .border-b {
  border-bottom: 1px solid #000000 !important;
}

.preview-document .border-t,
.print-document .border-t {
  border-top: 1px solid #000000 !important;
}

.preview-document .border-double,
.print-document .border-double {
  border-bottom: 3px double #000000 !important;
}

.preview-document .border-dashed,
.print-document .border-dashed {
  border-top: 1px dashed #666666 !important;
  margin-top: 2.5rem !important;
  padding-top: 1.5rem !important;
}

.preview-document .pt-8,
.print-document .pt-8 {
  padding-top: 2.5rem !important;
}

.preview-document .pb-1,
.print-document .pb-1 {
  padding-bottom: 0.25rem !important;
}

.preview-document .pt-4,
.print-document .pt-4 {
  padding-top: 1rem !important;
}

.preview-document .mt-12,
.print-document .mt-12 {
  margin-top: 3.5rem !important;
}

.preview-document .mt-8,
.print-document .mt-8 {
  margin-top: 2rem !important;
}

.preview-document .pt-1,
.print-document .pt-1 {
  padding-top: 0.25rem !important;
}

.preview-document .flex,
.print-document .flex {
  display: flex !important;
}

.preview-document .justify-between,
.print-document .justify-between {
  justify-content: space-between !important;
}

.preview-document .justify-end,
.print-document .justify-end {
  justify-content: flex-end !important;
}

.preview-document .gap-8,
.print-document .gap-8 {
  gap: 2rem !important;
}

.preview-document .w-1\/2,
.print-document .w-1\/2 {
  width: 50% !important;
}

.preview-document .w-full,
.print-document .w-full {
  width: 100% !important;
}

.preview-document .w-64,
.print-document .w-64 {
  width: 16rem !important;
}

.preview-document .w-48,
.print-document .w-48 {
  width: 12rem !important;
}

.preview-document ol,
.print-document ol {
  list-style-type: decimal !important;
  padding-left: 2rem !important;
  margin-top: 0.5rem !important;
  margin-bottom: 1.5rem !important;
}

.preview-document li,
.print-document li {
  margin-bottom: 0.75rem !important;
  padding-left: 0.25rem !important;
  display: list-item !important;
  /* Ensure lists render bullets/numbers correctly */
}

.preview-document .text-xs,
.print-document .text-xs {
  font-size: 11px !important;
}

.preview-document .text-slate-500,
.print-document .text-slate-500 {
  color: #555555 !important;
}
</style>

<style>
/* Global rules targeting the third-party Motion components */
.paper-sheet {
  padding: 3rem !important;
  /* Standard A4 layout margins */
  box-sizing: border-box !important;
}

@media (max-width: 768px) {
  .paper-sheet {
    padding: 1.5rem !important;
    /* Mobile layout margins */
  }
}
</style>
