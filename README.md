# Xingwei Wang (王兴伟)

Personal academic homepage of **Xingwei Wang**, PhD student at Beihang University. Research focuses on AIoT, smartphone-based healthcare sensing, and AI-augmented audio perception.

Adapted from [PRISM](https://github.com/xyjoey/PRISM) and built with Next.js, Tailwind CSS, and TypeScript.

🌐 [xibrer.github.io](https://xibrer.github.io)

## 🚀 Local Development

### Prerequisites

*   Node.js 22 or later
*   npm

### Setup

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 🛠️ Content Management

All content lives in the `content/` directory. No code changes needed for content updates.

### Global Site Config (`content/config.toml`)
Site title, author details, social links, navigation menu.

### Publications (`content/publications.bib`)
Export from Google Scholar, Zotero, or Mendeley. Supports `selected`, `preview`, `description` keys. PDF links are configured in `content/publications.toml` under `[pdfs]`.

### Adding Pages
Create a TOML file in `content/` and add it to `navigation` in `content/config.toml`.

Supported types:
*   `text` — Renders Markdown (CV, Bio)
*   `card` — Card list (Projects, Awards)
*   `publication` — Full publications list with filters

### Bilingual Support (`content_<locale>/`)
*   Default: `content/`
*   Chinese: `content_zh/`
*   Missing localized files fall back to `content/`

## 📦 Deploy

```bash
npm run build
```

Static `out/` directory is generated. GitHub Actions auto-deploys on push to `main`.

Before pushing a content or code change, run:

```bash
npm run validate
npm run lint
npm run typecheck
npm test
npm run build
```

See [docs/deployment.md](docs/deployment.md) for details.

## 📂 Project Structure

```
├── content/              # User-editable content (TOML, BibTeX, MD)
├── content_zh/           # Chinese translations
├── public/               # Static assets (images, PDFs)
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React components
│   ├── lib/              # Utility functions
│   └── types/            # TypeScript definitions
├── next.config.ts        # Next.js configuration
└── .github/workflows/    # CI/CD (GitHub Pages deploy)
```
