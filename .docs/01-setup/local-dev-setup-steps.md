<style>
a {
 text-decoration: none;
 color: #464feb;
}
tr th, tr td {
 border: 1px solid #e6e6e6;
}
tr th {
 background-color: #f5f5f5;
}
</style>

Great timing—this is exactly the point where getting a **clean, repeatable setup process** will save you a tonne of rework later.

I’ve added a new section below that you can drop straight into your current page. It covers:

- ✅ Local dev setup (monorepo + apps)
- ✅ First-time project creation (Astro + Vite)
- ✅ Running everything locally
- ✅ Azure CLI + SWA CLI creation flow for *two apps* (your chosen architecture)

---

# 🧑‍💻 10. Local Development Setup (From Scratch)

## ✅ Prerequisites

Install:

- Node.js (v20+ recommended)
- pnpm (via Corepack)
- Azure CLI
- SWA CLI

corepack enable

npm install -g @azure/static-web-apps-cli

az login

👉 Astro requires a modern Node version and is scaffolded via CLI wizard [[docs.astro.build]](https://docs.astro.build/en/install-and-setup/)

---

## 📁 Step 1 — Create the Monorepo

mkdir 365evergreen-frontend

cd 365evergreen-frontend

pnpm init

Create:

touch pnpm-workspace.yaml

mkdir apps packages

---

## 📦 Step 2 — Initialise Marketing App (Astro)

cd apps

pnpm create astro@latest marketing

cd marketing

pnpm install

👉 This runs the Astro CLI wizard to scaffold the project [[docs.astro.build]](https://docs.astro.build/en/install-and-setup/)

Then go back:

cd ../../

---

## ⚛️ Step 3 — Initialise Content App (Vite + React)

cd apps

pnpm create vite@latest content -- --template react-ts

cd content

pnpm install

👉 Vite provides a fast dev server + build pipeline for modern apps [[vite.dev]](https://vite.dev/guide/)

---

## 🧩 Step 4 — Create Shared Packages

cd ../../packages

mkdir designTokens
mkdir ui
mkdir navigation

Add `package.json` to each:

{

  "name": "@evergreen/<package-name>",

  "version": "1.0.0",

  "private": true

}

---

## 🔗 Step 5 — Install Workspace Dependencies

From root:

pnpm install

pnpm will:

- link apps + packages automatically
- share dependencies efficiently across the repo [[medium.com]](https://medium.com/@hibamalhiss/ultimate-guide-how-to-set-up-a-frontend-monorepo-with-vite-pnpm-and-shared-ui-libraries-4081585c069e)

---

## ▶️ Step 6 — Run Locally (All Apps)

From root:

pnpm dev

This runs:

- Astro dev server → marketing site
- Vite dev server → content app

---

## 🧪 Optional — Run Individually

pnpm --filter marketing dev

pnpm --filter content dev

---

# ☁️ 11. Azure Setup (CLI-Based, No Pipelines)

You’ll create **two Static Web Apps**:

- `evergreen-marketing`
- `evergreen-content`

---

## ✅ Step 1 — Create Resource Group

az group create </span>

  --name rg-evergreen-swa </span>

  --location australiaeast

👉 This creates the container for both apps [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-cli)

---

## ✅ Step 2 — Create Marketing App

az staticwebapp create </span>

  --name evergreen-marketing </span>

  --resource-group rg-evergreen-swa </span>

  --location australiaeast

---

## ✅ Step 3 — Create Content App

az staticwebapp create </span>

  --name evergreen-content </span>

  --resource-group rg-evergreen-swa </span>

  --location australiaeast

👉 `az staticwebapp create` provisions the Static Web App resource [[learn.microsoft.com]](https://learn.microsoft.com/en-us/cli/azure/staticwebapp?view=azure-cli-latest)

---

# 🚀 12. First Deployment (SWA CLI)

## ✅ Authenticate CLI

swa login

👉 This connects your local environment to Azure

---

## ✅ Build Apps

pnpm build

---

## ✅ Deploy Marketing

swa deploy ./apps/marketing/dist </span>

  --app-name evergreen-marketing </span>

  --resource-group rg-evergreen-swa

---

## ✅ Deploy Content

swa deploy ./apps/content/dist </span>

  --app-name evergreen-content </span>

  --resource-group rg-evergreen-swa

👉 `swa deploy` publishes built static files to Azure SWA [[learn.microsoft.com]](https://learn.microsoft.com/en-us/azure/static-web-apps/static-web-apps-cli-deploy)

---

# 🧠 Important Implementation Decisions

## ✅ Separate SWA apps (recommended)

Why this is correct for your architecture:

- independent scaling
- independent deployments
- clean routing via Cloudflare
- avoids build coupling

---

## ✅ Alternative (you can do later)

Single SWA with routing:

- `/` → marketing
- `/blog/*` → content

👉 SWA supports multiple app locations under one service if needed [[headlesshostman.com]](https://headlesshostman.com/introducing-cache-everything-our-fastest-cloudflare-cdn-integration-yet/)

---

# ⚖️ Dev Workflow (What You Now Have)

### Local

```
pnpm dev
→ both apps running
→ shared packages updating live
```

---

### Deploy

```
pnpm build
swa deploy (x2)
```

---

# ✅ Final Outcome

You now have:

- Fully initialised monorepo ✅
- Both apps scaffolded ✅
- Shared packages wired ✅
- Local dev running ✅
- Two SWA apps created ✅
- CLI-based deployment (no pipelines) ✅

---

# 💡 One high-value next step

Now that setup is complete:

👉 The next thing that will *massively accelerate you* is:

**automating the build + deploy commands into a single script (pnpm command)** that handles both apps and environments cleanly.

If you want, I can add:

- `pnpm deploy:dev` / `pnpm deploy:prod`
- environment config
- SWA token handling (clean + secure)

This is where your workflow becomes *production-grade*.
