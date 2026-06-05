# Contributing to Ayuda

We welcome contributions from developers, researchers, designers, and policy advocates! Here is how you can help:

## 1. Adding or Updating Government Programs
The database of programs is stored in `src/data/programs.json`. To add a new benefit or correct outdated requirements, make edits to this JSON file adhering to the schema below:

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

## 2. Submitting Pull Requests
1. Fork this repository and create your feature branch: `git checkout -b feature/amazing-feature`.
2. Commit your changes: `git commit -m 'Add SSS sickness benefit guide'`.
3. Verify that the build completes with zero TypeScript/Vue compiler errors:
   ```bash
   bun run build
   ```
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request. Provide references (official government links) if you are introducing new benefits or altering existing claims steps.

## Code of Conduct

By participating in this project, you are expected to uphold a welcoming, respectful, and inclusive environment.
