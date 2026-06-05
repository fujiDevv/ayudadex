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
  },
  'dswd-spisc': {
    name: "Sosyal na Pension para sa mga Mahihirap na Senior Citizen (Social Pension for Indigent Senior Citizens)",
    description: "Isang buwanang allowance na ₱1,000 (ipinamamahagi bilang ₱3,000 quarterly) na ibinibigay sa mga mahihirap na senior citizen upang madagdagan ang kailangang pang-araw-araw na pagkain at medikal na gastusin.",
    steps: [
      "Makipag-ugnayan sa Office for Senior Citizens Affairs (OSCA) sa inyong lokal na pamahalaan (LGU).",
      "Isumite ang mga kinakailangang dokumento para sa pagsusuri.",
      "Sumailalim sa validation ng mga social worker ng DSWD at LGU gamit ang data ng Community-Based Monitoring System (CBMS).",
      "Kapag naaprubahan, maghintay para sa anunsyo ng nakaiskedyul na quarterly na payout."
    ],
    requirements: [
      "Dapat ay 60 taong gulang pataas",
      "Mahina, may sakit, o may kapansanan",
      "Walang regular na pinagkukunan ng kita o pinansyal na suporta mula sa pamilya",
      "Hindi tumatanggap ng anumang pension mula sa SSS, GSIS, PVAO, o iba pang ahensya ng gobyerno",
      "Valid na Senior Citizen ID"
    ]
  },
  'sss-retirement': {
    name: "Benepisyo sa Pagreretiro (Retirement Benefit)",
    description: "Isang benepisyong cash na ibinibigay sa miyembro ng SSS na hindi na makapagtrabaho dahil sa katandaan, na ipinagkakaloob bilang panghabambuhay na buwanang pension o lump sum.",
    steps: [
      "Tiyaking mayroon kang naaprubahang bank account sa SSS Disbursement Account Enrollment Module (DAEM).",
      "Mag-log in sa iyong My.SSS online portal.",
      "Pumunta sa E-Services at i-file ang Retirement Claim Application online.",
      "I-upload ang anumang kinakailangang sumusuportang dokumento (hal. Certificate of Separation).",
      "Maghintay ng pag-apruba at ng unang pension sa inyong bank account."
    ],
    requirements: [
      "Dapat ay hindi bababa sa 60 taong gulang (opsyonal) o 65 taong gulang (teknikal na pagreretiro)",
      "Dapat ay hiwalay na sa trabaho o huminto na sa self-employment (para sa opsyonal na pagreretiro sa edad na 60)",
      "Hindi bababa sa 120 buwanang kontribusyon bago ang semestre ng pagreretiro (upang maging kwalipikado para sa buwanang pension)",
      "Retirement Claim Application (SSS Form DDR-1)",
      "UMID Card o dalawang valid government ID"
    ]
  },
  'ched-tes': {
    name: "Subsidy sa Tersyaryong Edukasyon (Tertiary Education Subsidy - TES)",
    description: "Isang programa ng tulong-pinansyal na nagbibigay ng suporta sa mga kwalipikadong estudyanteng Pilipino na naka-enroll sa mga pampubliko at pribadong kolehiyo upang makatalong sa mga gastusin sa edukasyon.",
    steps: [
      "Mag-enroll sa isang kwalipikadong higher education institution (State Universities, Local Universities, o mga pribadong HEI na kinikilala ng CHED).",
      "Isumite ang iyong aplikasyon at mga kinakailangan sa itinalagang TES Focal Person ng inyong paaralan.",
      "Ie-encode at isusumite ng paaralan ang iyong profile sa UniFAST portal.",
      "Maghintay para sa validation ng CHED/UniFAST at sa opisyal na pagpapalabas ng listahan ng mga iskolar (master list of grantees).",
      "Kunin ang subsidy disbursement sa pamamagitan ng inyong paaralan o partner na institusyong pinansyal."
    ],
    requirements: [
      "Dapat ay naka-enroll sa isang kinikilalang undergraduate program",
      "Sertipiko ng Rehistrasyon/Enrollment para sa kasalukuyang semestre",
      "Priyoridad ang mga mag-aaral na nasa DSWD Listahanan (Pantawid Pamilya) o nakatira sa mga lugar na walang pampublikong unibersidad",
      "Certificate of Indigency (kung hindi kasama sa Listahanan)",
      "Dapat mapanatili ang mga pasadong marka sa mga asignaturang akademiko"
    ]
  },
  'lgu-soloparent': {
    name: "Pinalawak na mga Benepisyo para sa Solo Parent (Expanded Solo Parents Benefits)",
    description: "Nagbibigay ng ipinag-uutos na pinansyal at panlipunang suporta sa mga solo parent, kabilang ang ₱1,000 buwanang subsidy para sa mga minimum wage earner, 10% discount sa mga pangunahing pangangailangan ng bata, at bayad na parental leave.",
    steps: [
      "Bisitahin ang Solo Parent Office o City/Municipal Social Welfare and Development Office (C/MSWDO) sa inyong lokal na pamahalaan (LGU).",
      "Dumalo sa oryentasyon tungkol sa iyong mga karapatan at benepisyo sa ilalim ng RA 11861.",
      "Isumite ang mga dokumentong kailangan at sumailalim sa isang interview kasama ang isang social worker.",
      "Kapag napatunayan na, kunin ang iyong Solo Parent Identification Card (SPIC) at Certificate of Eligibility."
    ],
    requirements: [
      "Dapat ay solong nag-aaruga at nagtataguyod sa anak/mga anak nang walang kinakasama o cohabitation",
      "Birth certificate ng mga dependent (sakop hanggang 22 taong gulang kung walang asawa, walang trabaho, at nag-aaral)",
      "Barangay certificate ng residency",
      "Katibayan ng katayuan bilang solo parent (hal. death certificate ng asawa, deklarasyon ng nullity ng kasal, o medical certificate ng kapansanan ng asawa)",
      "Income Tax Return o Certificate of Indigency"
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
