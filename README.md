# 🇵🇭 AyudaDex

**AyudaDex** is an open-source citizen initiative designed to simplify, navigate, and track access to public welfare programs and social benefits in the Philippines. 

Built with a premium modern design, it helps Filipinos search through benefits from **DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, and OWWA**, calculate their eligibility via a smart wizard, and track required documents offline.

*Note: AyudaDex is an unofficial navigator and is not affiliated with the Philippine Government.*

---

## ✨ Features

* **📋 Benefits Directory**: A unified repository of national welfare schemes, searchable by keywords and filterable by agency, benefit category, and target audience.
* **🔮 Eligibility Quiz (Ayuda Finder)**: An interactive 3-step wizard that scores and recommends government programs tailored to a user's employment status, needs, and demographics.
* **📝 Interactive Requirement Checklists**: Dynamic checklist tracking for application documents with a visual readiness progress bar (e.g. `2 / 5 (40% Ready)`).
* **⭐️ Bookmarks & Shortlist**: Save matching benefits to a personal dashboard, fully persisted locally in the browser via `localStorage`.
* **📞 Official Hotlines**: Contact numbers, email addresses, and support guidelines for government assistance centers.
* **🌙 Dark Mode Switcher**: Modern responsive dashboard styling with premium dark and light theme options.

---

## 🛠️ Tech Stack

* **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>` with TypeScript)
* **Build Tool**: [Vite](https://vite.dev/)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Runtime / Package Manager**: [Bun](https://bun.sh/)

---

## 🚀 Getting Started

To run the application locally on your computer, ensure you have [Bun](https://bun.sh/) installed, and follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/joshuasarmiento/ayudadex.git
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

## 📁 Project Structure

```text
├── index.html              # Entry HTML with typography and SEO tags
├── vite.config.ts          # Vite compilation configs with Tailwind plugin
├── src/
│   ├── main.ts             # App bootstrapping and style imports
│   ├── App.vue             # Main dashboard layout, filtering, and tab states
│   ├── style.css           # Global stylesheets & Tailwind imports
│   ├── components/
│   │   └── AyudaFinder.vue # Smart matching quiz wizard component
│   └── data/
│       └── programs.json   # JSON Database containing government programs
```

---

## 🤝 Contributing Guidelines

We welcome contributions from developers, researchers, designers, and policy advocates! Here is how you can help:

### 1. Adding or Updating Government Programs
The database of programs is stored in [src/data/programs.json](file:///Users/joshuasarmiento/Documents/Github/AyudaDex/src/data/programs.json). To add a new benefit or correct outdated requirements, make edits to this JSON file adhering to the schema below:

```json
{
  "id": "agency-benefit-slug",
  "agency": "DSWD",
  "name": "Full Name of the Program (Acronym)",
  "category": "Healthcare / Financial / Loan",
  "description": "Clear description of the program and who it is for in plain language.",
  "target_audience": ["Indigent", "Low Income", "Employed", "Seniors"],
  "processing_time": "Estimated processing duration (e.g. '1-3 working days')",
  "official_url": "https://official-government-agency-link.gov.ph",
  "steps": [
    "Step 1: Description of step 1...",
    "Step 2: Description of step 2..."
  ],
  "requirements": [
    "Required Document 1",
    "Required Document 2"
  ],
  "tags": ["medical", "financial", "crisis"]
}
```

* **Important Data Authenticity Rule:** Every added or modified benefit **must** contain accurate information sourced from the official agency website or published Citizen's Charters. Always double-check documents and step workflows.

### 2. Submitting Pull Requests
1. Fork this repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes: `git commit -m 'Add SSS sickness benefit guide'`.
3. Verify that the build completes with zero TypeScript/Vue compiler errors:
   ```bash
   bun run build
   ```
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request. Provide references (official government links) if you are introducing new benefits or altering existing claims steps.

---

## ⚖️ Disclaimer

AyudaDex is an independent open-source initiative and is **not affiliated, associated, authorized, endorsed by, or in any way officially connected with the government of the Philippines** or any of its offices. All official names (DSWD, SSS, GSIS, PhilHealth, Pag-IBIG, DOLE, DOH, OWWA) and trademarks belong to their respective holders.

The data presented is for general educational and informational purposes only. Information is provided "as is" and can change at any time without notice. Always verify rules, requirements, and deadlines on official government agency portals.
