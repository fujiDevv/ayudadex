import fs from 'fs';
import path from 'path';

const programs = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/programs.json'), 'utf8'));

const enPrograms = {};
programs.forEach(p => {
  enPrograms[p.id] = {
    name: p.name,
    description: p.description,
    steps: p.steps,
    requirements: p.requirements
  };
});

const uiStrings = {
  header: {
    title: "AyudaDex",
    subtitle: "Philippine Government Social Benefits Navigator"
  },
  nav: {
    directory: "Benefits Directory",
    wizard: "Eligibility Quiz",
    saved: "Saved",
    hotlines: "Hotlines"
  },
  filters: {
    title: "Filters",
    clearAll: "Clear All",
    search: "Search",
    searchPlaceholder: "e.g. AICS, Maternity, Loan...",
    agency: "Government Agency",
    category: "Category",
    audience: "Target Audience"
  },
  feed: {
    showing: "Showing {count} of {total} benefits",
    noMatches: "No matching programs found",
    noMatchesDesc: "Try refining your keyword search, selecting broader filter tags, or clearing filters to see all available listings.",
    resetFilters: "Reset Filters"
  },
  card: {
    bookmark: "Bookmark for later",
    removeBookmark: "Remove bookmark",
    readiness: "Readiness",
    expand: "Expand Checklist & Steps ➔",
    hide: "Hide Application Steps & Checklist",
    show: "Show Application Steps & Checklist",
    requirements: "Document Requirements",
    steps: "Application Process",
    applyNow: "Apply Now / Learn More"
  },
  wizard: {
    title: "Ayuda Finder Wizard",
    desc: "Answer a few quick questions about your demographics and current situation. Our engine will calculate compatibility scores and recommend the best government programs for you.",
    button: "Start Quiz"
  },
  shortlist: {
    title: "Your Saved Benefits",
    desc: "Review the requirements and steps for the benefits you bookmarked. All checklists and data are saved locally to your device browser.",
    noBookmarks: "No bookmarked benefits yet",
    noBookmarksDesc: "Browse the Benefits Directory and click the star icon on any program to save it here for offline reference.",
    browse: "Browse Directory"
  },
  hotlines: {
    title: "Official Agency Directory & Support",
    desc: "Direct hotlines, support emails, and inquiry channels for national social benefit providers. Keep these contact points handy when submitting claims.",
    noticeTitle: "Important Notice on Inquiries",
    noticeDesc: "Official operating times for most government hotlines are Monday to Friday, 8:00 AM to 5:00 PM (Philippine Standard Time), except for Pag-IBIG which operates 24/7. Standard local call rates apply. When contacting, ensure you have your SSS/GSIS/PhilHealth/Pag-IBIG membership ID number ready."
  },
  footer: {
    desc: "An open-source citizen initiative by betterGov.ph designed to simplify and track access to public welfare programs in the Philippines. Developed for informational guidance.",
    repo: "GitHub Repository",
    navLabel: "Navigation",
    resourcesLabel: "Resources",
    disclaimerTitle: "Official Disclaimer Notice",
    disclaimerDesc: "AyudaDex is an independent open-source navigator and is NOT affiliated with, sponsored by, or endorsed by the government of the Philippines or any of its offices (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA). Trademarks are property of their respective owners. All guidelines are for informational reference only. Always verify rules, requirements, and deadlines on official government agency portals."
  }
};

const enLocale = {
  ...uiStrings,
  programs: enPrograms
};

// Create locales dir if not exists
if (!fs.existsSync(path.join(process.cwd(), 'src/locales'))) {
  fs.mkdirSync(path.join(process.cwd(), 'src/locales'));
}

fs.writeFileSync(path.join(process.cwd(), 'src/locales/en.json'), JSON.stringify(enLocale, null, 2));

// For tl.json, we start with en.json clone
const tlLocale = JSON.parse(JSON.stringify(enLocale));

// Translate UI Strings
tlLocale.header.subtitle = "Gabay sa mga Benepisyo at Sosyal na Programa ng Pilipinas";
tlLocale.nav.directory = "Listahan ng Benepisyo";
tlLocale.nav.wizard = "Pagsusuri ng Pagiging Kwalipikado";
tlLocale.nav.saved = "Nai-save";
tlLocale.nav.hotlines = "Mga Hotline";
tlLocale.filters.title = "Mga Filter";
tlLocale.filters.clearAll = "Alisin Lahat";
tlLocale.filters.search = "Hanapin";
tlLocale.filters.searchPlaceholder = "hal. AICS, Maternity, Loan...";
tlLocale.filters.agency = "Ahensya ng Gobyerno";
tlLocale.filters.category = "Kategorya";
tlLocale.filters.audience = "Para Kanino";
tlLocale.feed.showing = "Nagpapakita ng {count} mula sa {total} na benepisyo";
tlLocale.feed.noMatches = "Walang nahanap na programa";
tlLocale.feed.noMatchesDesc = "Subukang palitan ang iyong paghahanap, pumili ng ibang filter, o alisin ang mga filter upang makita ang lahat ng listahan.";
tlLocale.feed.resetFilters = "I-reset ang mga Filter";
tlLocale.card.bookmark = "I-save para sa mamaya";
tlLocale.card.removeBookmark = "Alisin sa nai-save";
tlLocale.card.readiness = "Kahandaan";
tlLocale.card.expand = "Tingnan ang Listahan at Hakbang ➔";
tlLocale.card.hide = "Itago ang Proseso at Listahan";
tlLocale.card.show = "Tingnan ang Proseso at Listahan";
tlLocale.card.requirements = "Mga Kinakailangang Dokumento";
tlLocale.card.steps = "Proseso ng Aplikasyon";
tlLocale.card.applyNow = "Mag-apply Ngayon / Alamin ang Iba pa";
tlLocale.wizard.title = "Ayuda Finder Wizard";
tlLocale.wizard.desc = "Sagutan ang ilang mabilis na tanong tungkol sa iyong sitwasyon. Kakalkulahin ng aming system ang iyong compatibility at magrerekomenda ng mga pinakamahusay na programa ng gobyerno para sa iyo.";
tlLocale.wizard.button = "Simulan ang Pagsusuri";
tlLocale.shortlist.title = "Iyong Mga Nai-save na Benepisyo";
tlLocale.shortlist.desc = "Suriin ang mga kinakailangan at hakbang para sa mga benepisyong iyong nai-save. Lahat ng data ay naka-imbak nang lokal sa iyong browser.";
tlLocale.shortlist.noBookmarks = "Wala pang nai-save na benepisyo";
tlLocale.shortlist.noBookmarksDesc = "Maghanap sa Listahan ng Benepisyo at i-click ang star icon sa anumang programa upang i-save ito para mabasa kahit walang internet.";
tlLocale.shortlist.browse = "Tingnan ang Listahan";
tlLocale.hotlines.title = "Opisyal na Direktoryo at Suporta ng mga Ahensya";
tlLocale.hotlines.desc = "Mga direktang hotline, email, at channel ng pagtatanong para sa mga tagapagbigay ng benepisyo. Itabi ang mga kontact na ito kapag nag-a-apply ng claim.";
tlLocale.hotlines.noticeTitle = "Mahalagang Paunawa sa Pagtatanong";
tlLocale.hotlines.noticeDesc = "Ang opisyal na oras ng operasyon para sa karamihan ng hotline ng gobyerno ay Lunes hanggang Biyernes, 8:00 AM hanggang 5:00 PM (Philippine Standard Time), maliban sa Pag-IBIG na bukas 24/7. Siguraduhing handa ang iyong SSS/GSIS/PhilHealth/Pag-IBIG ID number kapag tatawag.";
tlLocale.footer.desc = "Isang open-source na inisyatiba ng mga mamamayan sa pamamagitan ng betterGov.ph, ginawa upang gawing simple ang paghahanap sa mga pampublikong programa sa Pilipinas. Binuo para sa impormasyonal na gabay.";
tlLocale.footer.repo = "GitHub Repository";
tlLocale.footer.navLabel = "Nabigasyon";
tlLocale.footer.resourcesLabel = "Mga Mapagkukunan";
tlLocale.footer.disclaimerTitle = "Opisyal na Paunawa ng Pagtanggi (Disclaimer)";
tlLocale.footer.disclaimerDesc = "Ang AyudaDex ay isang independiyenteng gabay at HINDI konektado, itinataguyod, o pinondohan ng gobyerno ng Pilipinas o alinman sa mga opisina nito. Ang mga trademark ay pag-aari ng kani-kanilang may-ari. Palaging kumpirmahin ang mga patakaran sa opisyal na website ng mga ahensya ng gobyerno.";

// Translate 3 programs
tlLocale.programs['dswd-aics'].name = "AICS (Tulong para sa mga Indibidwal na nasa Krisis)";
tlLocale.programs['dswd-aics'].description = "Nagbibigay ng agarang tulong medikal, pagpapalibing, edukasyon, transportasyon, pagkain, o pinansyal sa mga indibidwal at pamilyang nakakaranas ng hindi inaasahang krisis sa buhay.";
tlLocale.programs['dswd-aics'].steps = [
  "Ipakita ang mga kinakailangang dokumento sa DSWD Crisis Intervention Unit (CIU) o satellite office.",
  "Sumailalim sa screening at interview kasama ang isang DSWD Social Worker.",
  "Maghintay para sa paghahanda ng Social Case Study Report o Certificate of Eligibility.",
  "Tanggapin ang tulong pinansyal o Guarantee Letter (GL) para sa ospital/punerarya."
];
tlLocale.programs['dswd-aics'].requirements = [
  "Valid ID ng aplikante (Orihinal at Photocopy)",
  "Barangay Certificate of Indigency o Residency",
  "Medical Certificate / Abstract (para sa tulong medikal) o Death Certificate (para sa tulong pagpapalibing)",
  "Hospital Bill, Laboratory Request, o Funeral Contract",
  "Referral Letter (kung naaangkop)"
];

tlLocale.programs['sss-unemp'].name = "Benepisyo sa Kawalan ng Trabaho";
tlLocale.programs['sss-unemp'].description = "Isang benepisyong cash na ibinibigay sa mga miyembrong empleyado (kabilang ang mga OFW at Kasambahay) na nawalan ng trabaho dahil sa retrenchment, redundancy, o pagsasara ng negosyo.";
tlLocale.programs['sss-unemp'].steps = [
  "Kumuha ng DOLE Certification of Involuntary Separation.",
  "Mag-log in sa iyong SSS Member Portal (My.SSS) online.",
  "Pumunta sa 'Apply for Unemployment Benefit Claim' sa ilalim ng E-Services tab.",
  "Punan ang mga detalye ng aplikasyon at i-upload ang DOLE Certification at valid ID.",
  "Maghintay ng pag-apruba at pag-credit sa iyong nakarehistrong bank account."
];
tlLocale.programs['sss-unemp'].requirements = [
  "DOLE Certification of Involuntary Separation",
  "Notice of Termination mula sa Employer O Notarized Affidavit of Termination",
  "Kahit 36 buwanang kontribusyon sa SSS (12 dito ay dapat nasa loob ng 18 buwan bago ang pagkawala ng trabaho)",
  "Nakarehistrong bank account sa SSS Disbursement Account Enrollment Module (DAEM)",
  "Wala pang 60 taong gulang sa panahon ng pagkawala ng trabaho"
];

tlLocale.programs['philhealth-konsulta'].name = "Konsulta Package";
tlLocale.programs['philhealth-konsulta'].description = "Isang komprehensibong pakete ng benepisyo sa pangunahing pangangalaga na nagbibigay ng libreng konsultasyon, health risk screening, laboratory tests, at mahahalagang gamot.";
tlLocale.programs['philhealth-konsulta'].steps = [
  "Tiyaking aktibo ang iyong membership sa PhilHealth at magparehistro online o sa lokal na opisina.",
  "Pumili at magparehistro sa isang itinalagang PhilHealth Konsulta accredited provider (klinika/ospital).",
  "Mag-iskedyul ng appointment para sa libreng konsultasyon at diagnostic testing.",
  "Kunin ang mga niresetang gamot sa botika ng provider ng libre."
];
tlLocale.programs['philhealth-konsulta'].requirements = [
  "Kopya ng Member Data Record (MDR)",
  "Registration form para sa PhilHealth Konsulta Provider",
  "Kahit 1 valid government ID"
];

fs.writeFileSync(path.join(process.cwd(), 'src/locales/tl.json'), JSON.stringify(tlLocale, null, 2));

console.log('Successfully generated locales');
