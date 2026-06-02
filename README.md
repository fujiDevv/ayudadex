# AyudaDex

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-4fc08d?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)


**AyudaDex** is an open-source citizen initiative designed to simplify, navigate, and track access to public welfare programs and social benefits in the Philippines. 

Built with a premium modern design, it helps Filipinos search through benefits from **DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA**, calculate their eligibility via a smart wizard, and track required documents offline.

*Note: AyudaDex is an unofficial navigator and is not affiliated with the Philippine Government.*

---

## Features

* **Offline Support (PWA)**: Installable as a Progressive Web App. Browse programs, access your saved checklist, and view requirements even without an active internet connection.
* **Localization (English & Tagalog)**: Fully accessible bilingual interface allowing users to switch between English and Tagalog for easier comprehension.
* **Shareable Direct Links**: Send direct, shareable links for specific benefit pages to family and friends via Messenger or social media.
* **Benefits Directory**: A unified repository of national welfare schemes, searchable by keywords and filterable by agency, benefit category, and target audience.
* **Eligibility Quiz (Ayuda Finder)**: An interactive 3-step wizard that scores and recommends government programs tailored to a user's employment status, needs, and demographics.
* **Print Checklist to PDF**: Generate clean, ink-saving A4-ready layouts by stripping out UI elements using native `@media print` CSS.
* **Interactive Requirement Checklists**: Dynamic checklist tracking for application documents with a visual readiness progress bar (e.g. `2 / 5 (40% Ready)`).
* **Accessibility (a11y) Optimized**: WCAG-friendly contrast ratios, full screen reader ARIA support, and a dedicated "Large Text" mode for seniors and PWDs.
* **Bookmarks & Shortlist**: Save matching benefits to a personal dashboard, fully persisted locally in the browser via Pinia and `localStorage`.
* **Official Hotlines**: Contact numbers, email addresses, and support guidelines for government assistance centers.
* **Branch Locator**: Interactive map powered by OpenStreetMap & Overpass API to find nearby DSWD, PhilHealth, Pag-IBIG, and SSS offices. Filter by agency and search by region/province with automatic geocoding.
* **Community Suggestions**: An elder-friendly crowdsourcing form that lets any user suggest corrections, new programs, or report outdated info — submittable via email, messaging apps (Viber, Messenger, SMS), clipboard, or GitHub Issues for developers.
* **Dark Mode Switcher**: Modern responsive dashboard styling with premium dark and light theme options.

---

## Tech Stack

* **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>` with TypeScript)
* **Routing & State**: [Vue Router v4](https://router.vuejs.org/) and [Pinia v3](https://pinia.vuejs.org/)
* **Localization**: [Vue I18n](https://vue-i18n.intlify.dev/)
* **Offline / PWA**: `vite-plugin-pwa` with Workbox
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Runtime / Package Manager**: [Bun](https://bun.sh/)

---

## Getting Started

To run the application locally on your computer, ensure you have [Bun](https://bun.sh/) installed, and follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/fujiDevv/ayudadex.git
cd AyudaDex
```

### 2. Install dependencies
```bash
bun install
```

### 3. Start development server
```bash
bun run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### 4. Build for production
Verify typescript compiler diagnostics and bundle the distribution:
```bash
bun run build
```

---

## Project Structure

```text
├── index.html              # Entry HTML with typography and SEO tags
├── vite.config.ts          # Vite compilation configs with Tailwind plugin
├── src/
│   ├── main.ts             # App bootstrapping and style imports
│   ├── App.vue             # Main dashboard layout, filtering, and tab states
│   ├── style.css           # Global stylesheets & Tailwind imports
│   ├── constants.ts        # Static datasets (hotlines, audience tags)
│   ├── types.ts            # Shared TypeScript interface definitions
│   ├── stores/             # Global Pinia state management (e.g., ayudaStore.ts)
│   ├── locales/            # i18n translation files (en.json, tl.json)
│   ├── views/              # Vue Router page components
│   │   ├── DirectoryView.vue
│   │   ├── ProgramDetailView.vue
│   │   ├── WizardView.vue
│   │   ├── SavedView.vue
│   │   ├── HotlinesView.vue
│   │   ├── BranchLocatorView.vue  # Interactive map for finding agency offices
│   │   └── SuggestUpdateView.vue  # Community crowdsourcing suggestion form
│   ├── components/
│   │   ├── AppHeader.vue   # Brand logo, tab navigation, and dark switcher
│   │   ├── AppFooter.vue   # Redesigned civic footer, portals, and disclaimer
│   │   ├── AyudaFinder.vue # Smart matching quiz wizard component
│   │   └── ProgramCard.vue # Reusable benefits program card component
│   └── data/
│       └── programs.json   # JSON Database containing government programs
```

---

## Contributing Guidelines

We welcome contributions from developers, researchers, designers, and policy advocates! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for detailed instructions on how to add or update government programs, and how to submit Pull Requests.

---

## Disclaimer

AyudaDex is an independent open-source initiative and is **not affiliated, associated, authorized, endorsed by, or in any way officially connected with the government of the Philippines** or any of its offices. All official names (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA) and trademarks belong to their respective holders.

The data presented is for general educational and informational purposes only. Information is provided "as is" and can change at any time without notice. Always verify rules, requirements, and deadlines on official government agency portals.
