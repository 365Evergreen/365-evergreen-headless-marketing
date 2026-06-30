# 365 Evergreen – Headless WordPress Frontend

A high-performance, CDN-first frontend architecture using:

- WordPress (editor only)
- JSON content (Azure Blob Storage)
- Azure Static Web Apps (frontend hosting)
- Cloudflare (CDN + routing)
- pnpm monorepo (shared architecture)

---

## 🧱 Architecture Overview

This repository uses a **multi-app monorepo**:

- **Marketing App** → Astro (static-first, minimal JS)
- **Content App** → React (dynamic blog UI)
- **Shared Packages** → design system, components, config

```
User → Cloudflare CDN → SWA apps
                       ↓
                JSON (Azure Blob)
                       ↓
                  WordPress CMS
```

---

## 📁 Repository Structure

```
.
├── apps/
│   ├── marketing/
│   └── content/
│
├── packages/
│   ├── design-tokens/
│   ├── ui/
│   ├── navigation/
│   │
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── README.md
```

---

## ⚙️ Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 📦 Root package.json

```json
{
  "name": "365evergreen-frontend",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "pnpm -r --parallel dev",
    "build": "pnpm -r build",
    "lint": "pnpm -r lint"
  }
}
```

---

## 🧩 Shared Design System

### tokens.css

```css
:root {
  --color-blue-500: #2563eb;
  --color-gray-900: #111827;

  --color-text-primary: var(--color-gray-900);
  --color-brand-primary: var(--color-blue-500);

  --space-md: 1rem;
  --radius-md: 8px;
}
```

---

## 🧱 Shared UI Components

### Button.tsx

```tsx
export const Button = ({ children }) => {
  return <button>{children}</button>;
};
```

---

## 🌐 Marketing App

```json
{
  "name": "marketing",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build"
  }
}
```

---

## 📚 Content App

```json
{
  "name": "content",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```

---

## 🚀 Scripts

```bash
pnpm install
pnpm dev
pnpm build
```

---

## 🧠 Design Principles

- WordPress is not in runtime path
- JSON is source of truth
- CDN-first delivery
- Shared UI for consistency

---

## 📄 Licence

MIT
