# AyudaDex

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-4fc08d?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Bun](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white)](https://bun.sh/)

**AyudaDex** is an open-source citizen initiative designed to simplify, navigate, and track access to public welfare programs and social benefits in the Philippines.

Built with a premium modern design, it helps Filipinos search through benefits from **DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA**, calculate eligibility via a smart wizard, and track required documents offline.

> [!NOTE]
> *AyudaDex is an unofficial navigator and is not affiliated with the Philippine Government.*

---

## Core Features

* **Unified Benefits Directory**: A searchable and filterable database of national welfare schemes, filterable by agency, benefit category, and target audience.
* **Smart Eligibility Wizard**: An interactive quiz that evaluates demographic and employment status to match users with qualifying programs.
* **Checklist & Requirement Tracker**: Save matching programs to a personal shortlist and track required application documents offline.
* **Interactive Branch Locator**: An integrated map powered by OpenStreetMap and cached Overpass API queries to find nearby agency branches instantly.
* **Progressive Web App (PWA)**: Full offline support via service workers, making directory contents and checklists accessible without internet.
* **Elder & Senior Friendly**: Offers bilingual English & Tagalog translations, dynamic large-text mode, high-contrast dark mode, and ink-saving print-to-PDF styles.

---

## Tech Stack

* **Framework**: [Vue 3](https://vuejs.org/) (Composition API with TypeScript)
* **Routing & State**: [Vue Router v4](https://router.vuejs.org/) and [Pinia v3](https://pinia.vuejs.org/)
* **Localization**: [Vue I18n](https://vue-i18n.intlify.dev/)
* **Offline / PWA**: `vite-plugin-pwa` with Workbox
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Runtime / Package Manager**: [Bun](https://bun.sh/)
* **Hosting / Deployment**: [Cloudflare Pages](https://pages.cloudflare.com/) with [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

---

## Getting Started

Ensure you have [Bun](https://bun.sh/) installed locally, then follow these steps:

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
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build & Preview Locally
Compile the production bundle and start a local Wrangler environment to preview:
```bash
bun run preview
```

### 5. Deploy to Cloudflare Pages
Deploy directly to Cloudflare Pages:
```bash
bun run deploy
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

AyudaDex is an independent open-source initiative and is **not affiliated, associated, authorized, endorsed by, or in any way officially connected with the government of the Philippines** or any of its offices. All official names (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA) and trademarks belong to their respective holders.

The data presented is for general educational and informational purposes only. Rules, requirements, and deadlines should always be verified on official government portals.
