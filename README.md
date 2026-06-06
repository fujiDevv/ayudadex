# Ayuda

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-4fc08d?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)

**Ayuda** is an open-source citizen initiative designed to simplify, navigate, and track access to public welfare programs and social benefits in the Philippines.

Built with a premium modern design, it helps Filipinos search through benefits from **DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA**, calculate eligibility via a smart wizard, and track required documents offline.

> [!NOTE]
> _Ayuda is an unofficial navigator and is not affiliated with the Philippine Government._

---

## Core Features

- **Unified Benefits Directory**: A searchable and filterable database of national welfare schemes, filterable by agency, benefit category, and target audience.
- **Smart Eligibility Wizard**: An interactive quiz that evaluates demographic and employment status to match users with qualifying programs.
- **Integrated Life Event Pathways**: Group related government assistance and custom local requirements into structured, trackable timelines for major milestones (such as _Having a Baby_, _Loss of a Family Member_, _Job Loss_, _Retirement & Senior Care_, _Entering College / Training_, and _Solo Parents & Family Care_).
- **Checklist & Requirement Tracker**: Save matching programs to a personal shortlist and track required application documents offline.
- **Interactive Branch Locator**: An integrated map powered by OpenStreetMap and cached Overpass API queries to find nearby agency branches instantly.
- **Document Prep & Generator**: Draft formal letters (Authorization Letters, Affidavits of Low Income, and Request Letters) in real-time with an interactive, draggable A4 sheet preview, printable and downloadable directly as a PDF.
- **Prerequisite Certificate Guides**: Interactive checklists, procedures, and tips to secure foundational documents such as Barangay Certificates of Indigency and BIR Certificates of No Income, saving applicants time and money.
- **Interactive Benefits Analytics**: Live dashboard showing statistical insights into welfare program distributions. Track key metrics such as total programs per agency, average requirements, processing steps, top target audiences, and categories through responsive charts (donut and bar charts) with live bilingual drill-downs.
- **Progressive Web App (PWA)**: Full offline support via service workers, making directory contents and checklists accessible without internet.
- **Elder & Senior Friendly**: Offers bilingual English & Tagalog translations, dynamic large-text mode, high-contrast dark mode, and ink-saving print-to-PDF styles.

---

## Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) (Composition API with TypeScript)
- **Routing & State**: [Vue Router v4](https://router.vuejs.org/) and [Pinia v3](https://pinia.vuejs.org/)
- **Localization**: [Vue I18n](https://vue-i18n.intlify.dev/)
- **Offline / PWA**: `vite-plugin-pwa` with Workbox
- **Build Tool & Toolchain**: [Vite+ (Vite++)](https://viteplus.dev/) — a unified development toolchain wrapping Vite, Rolldown, Vitest, tsdown, Oxlint, and Oxfmt under a single `vp` CLI.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Runtime / Package Manager**: [Bun](https://bun.sh/)
- **Hosting / Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) with [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

## Getting Started & Vite+ (Vite++) Toolchain

This project uses **Vite+** (also known as Vite++), a unified web toolchain. All development, check, and test scripts run through the `vp` CLI.

Ensure you have [Bun](https://bun.sh/) installed locally, then follow these steps:

### 1. Clone the repository

```bash
git clone https://github.com/fujiDevv/ayuda.git
cd Ayuda
```

### 2. Install dependencies

Install dependencies through Vite+ (which delegates to Bun as configured by `packageManager`):

```bash
vp install
```

### 3. Start development server

Run the local development server:

```bash
vp dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Code Quality & Formatting

Vite+ integrates Oxlint and Oxfmt for super-fast linting and formatting. Run check and automatically fix any code quality or formatting issues:

```bash
vp check
vp check --fix
```

### 5. Running Tests

Run the test suite powered by Vitest through Vite+:

```bash
vp test
```

### 6. Build & Preview Locally

Compile the production bundle and start a local Wrangler environment to preview:

```bash
bun run preview
```

### 7. Deploy to Cloudflare Pages

Deploy directly to Cloudflare Pages:

```bash
bun run deploy
```

### 8. Compile Program Data & Locales

If you add or update programs in `src/data/programs.json`, run the sync script to compile new schemas and merge translations:

```bash
node generate-locales.js
```

---

## Project Structure

```text
├── wrangler.jsonc          # Cloudflare Pages deployment configuration
├── index.html              # Entry HTML with typography and SEO tags
├── vite.config.ts          # Vite compilation config and plugins
├── src/
│   ├── main.ts             # App bootstrapping and imports
│   ├── App.vue             # Main dashboard layout
│   ├── style.css           # Global stylesheets & Tailwind imports
│   ├── constants.ts        # Static datasets (hotlines, audience tags)
│   ├── types.ts            # Shared TypeScript interface definitions
│   ├── stores/             # Global Pinia state management
│   ├── locales/            # i18n translation files (en.json, tl.json)
│   ├── views/              # Page components (Directory, Finder, Locator, etc.)
│   └── components/         # Reusable UI components
```

---

## Contributing

We welcome contributions from developers, researchers, designers, and policy advocates! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on proposing program updates or submitting code changes.

---

## Disclaimer

Ayuda is an independent open-source initiative and is **not affiliated, associated, authorized, endorsed by, or in any way officially connected with the government of the Philippines** or any of its offices. All official names (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA) and trademarks belong to their respective holders.

The data presented is for general educational and informational purposes only. Rules, requirements, and deadlines should always be verified on official government portals.
