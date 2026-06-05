import fs from 'fs';
import path from 'path';

// Resolve paths
const enPath = path.join(process.cwd(), 'src/locales/en.json');
const tlPath = path.join(process.cwd(), 'src/locales/tl.json');
const programsPath = path.join(process.cwd(), 'src/data/programs.json');

// Read programs from programs.json
const programs = JSON.parse(fs.readFileSync(programsPath, 'utf8'));

// Rebuild enPrograms from programs.json
const enPrograms = {};
programs.forEach(p => {
  enPrograms[p.id] = {
    name: p.name,
    description: p.description,
    steps: p.steps,
    requirements: p.requirements
  };
});

// Read existing en.json and tl.json to keep non-program UI keys intact
let enLocale = {};
if (fs.existsSync(enPath)) {
  enLocale = JSON.parse(fs.readFileSync(enPath, 'utf8'));
} else {
  // If en.json doesn't exist, try backup or initialize
  const backupPath = path.join(process.cwd(), 'en_backup.json');
  if (fs.existsSync(backupPath)) {
    enLocale = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  }
}

let tlLocale = {};
if (fs.existsSync(tlPath)) {
  tlLocale = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
} else {
  const backupPath = path.join(process.cwd(), 'tl_backup.json');
  if (fs.existsSync(backupPath)) {
    tlLocale = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
  }
}

// Update the English programs
enLocale.programs = enPrograms;

// Build tlPrograms by copying the enPrograms structures as a base
const tlPrograms = JSON.parse(JSON.stringify(enPrograms));

// Preserve existing Tagalog program translations from tlLocale if they exist
const existingTlPrograms = tlLocale.programs || {};
Object.keys(existingTlPrograms).forEach(pid => {
  if (tlPrograms[pid]) {
    const newProg = tlPrograms[pid];
    const oldTlProg = existingTlPrograms[pid];
    
    // Copy name and description if they were translated
    if (oldTlProg.name) newProg.name = oldTlProg.name;
    if (oldTlProg.description) newProg.description = oldTlProg.description;
    
    // Only copy steps and requirements if the number of entries matches to avoid structural drift
    if (oldTlProg.steps && oldTlProg.steps.length === newProg.steps.length) {
      newProg.steps = oldTlProg.steps;
    }
    if (oldTlProg.requirements && oldTlProg.requirements.length === newProg.requirements.length) {
      newProg.requirements = oldTlProg.requirements;
    }
  }
});

// Define Tagalog translation overrides for new, renamed, or updated programs
const tlOverrides = {
  'philhealth-yakap': {
    name: "YAKAP (Yaman ng Kalusugan Program)",
    description: "Isang pinahusay na pakete ng benepisyo sa pangunahing pangangalaga (na pumapalit sa dating Konsulta Package) na nagbibigay ng holistic na pangangalagang pangkalusugan kabilang ang libreng konsultasyong medikal, pinalawak na laboratoryo at cancer screening tests, at mga pangunahing gamot.",
    steps: [
      "Tiyaking aktibo ang iyong membership sa PhilHealth at magparehistro online o sa lokal na opisina.",
      "Pumili at magparehistro sa isang itinalagang PhilHealth YAKAP accredited provider (klinika/ospital).",
      "Mag-iskedyul ng appointment para sa libreng konsultasyon at diagnostic testing.",
      "Kunin ang mga niresetang gamot sa botika ng provider ng libre."
    ],
    requirements: [
      "Kopya ng Member Data Record (MDR)",
      "Registration form para sa PhilHealth YAKAP Provider",
      "Kahit 1 valid government ID"
    ]
  },
  'philhealth-newborn': {
    name: "Pakete ng Pangangalaga sa Bagong Silang (Newborn Care Package)",
    description: "Nagbibigay ng mga pangunahing serbisyong pangkalusugan para sa mga bagong silang na sanggol kabilang ang physical examination, eye prophylaxis, pagbibigay ng vitamin K, bakunang BCG, unang dosis ng bakuna sa hepatitis B, at newborn screening test.",
    steps: [
      "Tiyaking aktibo ang membership sa PhilHealth bago manganak.",
      "Isumite ang kopya ng Member Data Record (MDR) at valid ID sa billing section ng ospital.",
      "Punan ang PhilHealth Claim Form 1 (CF-1) at Claim Form 2 (CF-2) sa ospital.",
      "Ang Newborn Care Package ay awtomatikong ibabawas mula sa bill sa ospital para sa parehong ina at anak."
    ],
    requirements: [
      "Aktibong membership sa PhilHealth o pagpaparehistro ng dependent",
      "Kumpletong PhilHealth Claim Form 1 (CF1)",
      "Kumpletong PhilHealth Claim Form 2 (CF2)",
      "Kopya ng Member Data Record (MDR)",
      "Valid government ID ng miyembrong magulang"
    ]
  },
  'sss-funeral': {
    name: "Benepisyo sa Pagpapalibing (Funeral Benefit)",
    description: "Isang benepisyong cash mula sa fixed na ₱12,000 (para sa 1-35 kontribusyon) hanggang ₱20,000 - ₱60,000 (para sa 36 o higit pang kontribusyon) na ibinibigay sa sinumang nagbayad ng gastusin sa pagpapalibing ng yumaong miyembro ng SSS.",
    steps: [
      "Kumuha ng Certified True Copy ng Death Certificate mula sa lokal na civil registry o PSA.",
      "Kunin ang opisyal na resibo mula sa funeral parlor na nagpapakita ng pangalan ng aplikante bilang nagbayad.",
      "Mag-log in sa My.SSS Portal (E-Services tab) at piliin ang 'Apply for Funeral Benefit Claim'.",
      "Punan ang online application at i-upload ang Death Certificate, Resibo ng Punerarya, at ID ng aplikante.",
      "Maghintay ng pag-apruba at direktang pag-credit sa nakarehistrong bank account ng aplikante."
    ],
    requirements: [
      "Death Certificate ng yumaong miyembro (PSA copy o Certified True Copy)",
      "Opisyal na Resibo ng gastusin sa libing na nakapangalan sa aplikante",
      "Valid ID ng aplikante (Orihinal at Photocopy)",
      "Pagpaparehistro ng Disbursement Account (DAEM) ng aplikante",
      "Katibayan ng mga kontribusyon ng yumaong miyembro (kahit 1 kontribusyon)"
    ]
  },
  'gsis-funeral': {
    name: "Benepisyo sa Pagpapalibing (Funeral Benefit)",
    description: "Isang benepisyong cash na nagkakahalaga ng ₱30,000 na ibinibigay sa nabubuhay na asawa, mga anak, o kung sino man ang nagbayad ng gastusin sa pagpapalibing ng yumaong miyembro o retirado ng GSIS.",
    steps: [
      "I-download at punan ang GSIS Application Form para sa Funeral Benefit.",
      "Kumuha ng certified photocopy ng Death Certificate.",
      "Isumite ang aplikasyon sa pamamagitan ng GSIS Wireless Kiosk (GW@PS), GSIS Touch app, o i-email sa regional branch.",
      "Isumite ang opisyal na resibo ng gastusin sa libing kung ang aplikante ay hindi ang nabubuhay na asawa.",
      "Maghintay ng pag-credit sa eCard o bank account ng aplikante."
    ],
    requirements: [
      "Kumpletong GSIS Funeral Benefit Application Form",
      "Death Certificate ng yumaong miyembro ng GSIS (PSA o Certified Local Copy)",
      "Marriage Contract (PSA copy) kung ang nabubuhay na asawa ang aplikante",
      "Opisyal na Resibo ng gastusin sa libing kung ang aplikante ay hindi asawa",
      "Valid ID ng aplikante"
    ]
  },
  'tesda-training': {
    name: "Libreng Pagsasanay sa Kasanayan at Scholarship (Free Skills Training & Scholarship)",
    description: "Nagbibigay ng libreng pagsasanay sa bokasyonal, assessment, at mga toolkit para sa pangkabuhayan sa ilalim ng mga programa tulad ng TWSP, STEP, at PESFA upang matulungan ang mga mamamayan na makahanap ng bagong trabaho.",
    steps: [
      "Maghanap ng mga magagamit na kurso sa pagsasanay sa mga lokal na paaralang accredited ng TESDA o mga opisina nito.",
      "Isumite ang mga application form kasama ang mga kinakailangang dokumento sa akademiko at demograpiko.",
      "Dumalo sa screening o selection interview sa training center.",
      "Kumpletuhin ang itinalagang oras ng pagsasanay sa silid-aralan at praktikal na aplikasyon.",
      "Kumuha ng National Assessment upang matanggap ang National Certificate (NC I o NC II) pati ang toolkit o allowance."
    ],
    requirements: [
      "Kumpletong TESDA Enrollment Form",
      "Barangay Clearance o Certificate of Indigency",
      "Report card ng kahit High School Graduate o ALS Certificate",
      "Form 137 o Transcript ng mga Rekord (Transcript of Records)",
      "4 na kopya ng passport size na larawan (white background, may kwelyo, at may name tag)"
    ]
  }
};

// Apply overrides for new/updated programs
Object.keys(tlOverrides).forEach(pid => {
  if (tlPrograms[pid]) {
    tlPrograms[pid] = tlOverrides[pid];
  }
});

tlLocale.programs = tlPrograms;

// Create locales directory if it does not exist
if (!fs.existsSync(path.dirname(enPath))) {
  fs.mkdirSync(path.dirname(enPath), { recursive: true });
}

// Write the updated locale files back
fs.writeFileSync(enPath, JSON.stringify(enLocale, null, 2));
fs.writeFileSync(tlPath, JSON.stringify(tlLocale, null, 2));

console.log('Successfully generated locales');
