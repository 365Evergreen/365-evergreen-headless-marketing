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

Great—this is where your architecture *really becomes differentiated*. I’ll break this into three parts:

1. ✅ **Container structure (Blob)**
2. ✅ **Media strategy (WordPress vs Azure CDN vs Cloudflare)**
3. ✅ **Power Automate flow (step-by-step, production-ready)**

---

# 🗂️ 1. Azure Blob Container Structure (Recommended)

Use a **single container** (e.g. `content`) and structure it like a static filesystem:

```
/content
│
├── navigation/
│   └── navigation.json
│
├── posts/
│   ├── index.json
│   ├── recent.json
│   ├── post-1.json
│   ├── post-2.json
│   └── ...
│
├── categories/
│   ├── index.json
│   ├── power-platform.json
│   └── sharepoint.json
│
├── search/
│   └── index.json
│
├── pages/
│   ├── home.json
│   ├── services.json
│   └── about.json
│
└── media/   (optional – see next section)
    ├── images/
    └── thumbnails/
```

---

## ✅ Key Design Principles

- **Flat + predictable paths** (critical for CDN caching)
- **No nested GraphQL-style structures**
- **Each file independently cacheable**
- **Easy invalidation (overwrite specific blobs)**

---

# 🖼️ 2. Media Strategy (Important Decision)

## You proposed:

> Can WordPress serve media directly and skip Cloudflare?

### ✅ Short answer:

👉 **Yes — you can skip Cloudflare initially**, but with a caveat.

---

## ✅ Option A — Media from WordPress (simplest)

### Flow:

```
Frontend → JSON (Blob) → image URL → WordPress
```

### ✅ Pros

- Zero duplication
- No extra storage costs
- Simple pipeline (no download/upload step)

### ❌ Cons

- Slower globally (origin-bound)
- No optimisation (resizing, WebP, etc.)
- Higher WordPress load

---

## ✅ Option B — Media copied to Azure Blob (recommended later)

### Flow:

```
WordPress → Power Automate → Blob storage
Frontend → Blob CDN
```

### ✅ Pros

- Fast global delivery (especially with CDN)
- Full control
- Can optimise images
- Removes WordPress from runtime path

### ❌ Cons

- More pipeline complexity
- Storage duplication

---

## ✅ Option C — Hybrid (BEST for you)

👉 I strongly recommend this:

### 🔹 Phase 1 (now)

- Use WordPress media URLs
- Get pipeline working
- Keep things simple

### 🔹 Phase 2 (later optimisation)

- Copy only:
  - featured images
  - thumbnails
- Store in `/media/`
- Rewrite URLs in JSON

---

## 🚫 When Cloudflare is actually needed

You don’t need it if:

- Using Azure Blob static hosting
- Using SWA CDN layer
- Traffic is moderate

👉 Cloudflare becomes useful only if:

- global high traffic
- edge caching rules
- image optimisation needed

---

# ⚙️ 3. Power Automate Flow (Step-by-Step)

We’ll **bypass the WordPress connector** (good choice).

👉 Use HTTP + GraphQL → transform → Blob

---

# 🔁 FLOW OVERVIEW

```
Trigger
 → Get posts list (GraphQL)
 → Create posts index.json
 → Loop posts
    → Get full post
    → Transform
    → Save post-slug.json
 → (optional) create categories / search
```

---

# 🧩 FLOW DESIGN (Detailed)

---

## ✅ Step 1 — Trigger

### Option A (recommended)

**When HTTP request received**

- called by WordPress webhook

### Option B

Manual / scheduled (for testing)

---

## ✅ Step 2 — HTTP → Get Posts List

**Action:** HTTP

Method:

```
POST
```

URL:

```
https://yourwordpress.com/graphql
```

Body:

{

  "query": "query PostsList { posts { edges { node { id slug title uri excerpt featuredImage { node { sourceUrl(size: THUMBNAIL) } } } } } }"

}

``

---

## ✅ Step 3 — Parse JSON

Use **Parse JSON action**

👉 Use sample output from WPGraphQL

---

## ✅ Step 4 — Compose Registry

Use **Select (Data Operation)**

Map fields:

| Output  | From                              |
| ------- | --------------------------------- |
| id      | node.id                           |
| slug    | node.slug                         |
| title   | node.title                        |
| image   | node.featuredImage.node.sourceUrl |
| excerpt | node.excerpt                      |

---

## ✅ Step 5 — Create posts/index.json

**Action:** Azure Blob Storage → Create blob

- Container: `content`
- Path: `/posts/index.json`
- Content: output of Select

---

## ✅ Step 6 — Loop Posts

**Apply to each**

Input:

```
posts.edges
```

---

## ✅ Step 7 — Get Individual Post

Inside loop:

**HTTP action**

{

  "query": "query PostBySlug($slug: ID!) { post(id: $slug, idType: SLUG) { id title slug content featuredImage { node { sourceUrl } } } }",

  "variables": {

    "slug": "@{items('Apply_to_each')?['node']['slug']}"

  }

}

---

## ✅ Step 8 — Transform Post

Use **Compose**

{

  "id": "...",

  "title": "...",

  "slug": "...",

  "content": "...",

  "image": "..."

}

``

---

## ✅ Step 9 — Save Post JSON

**Azure Blob → Create blob**

Path:

```
/posts/@{slug}.json
```

---

# 🧠 Important Optimisations (Do These Early)

---

## ✅ 1. Don’t hammer WordPress

Add:

- **Concurrency control** in loop (set to 1–3)
- Prevent overload

---

## ✅ 2. Avoid full rebuilds

Later:

- Only update changed post
- trigger via WP webhook

---

## ✅ 3. Add small indexes

Create:

```
/posts/recent.json
/search/index.json
/categories/index.json
```

---

## ✅ 4. Use clean JSON (critical)

ALWAYS flatten:

❌ GraphQL format:

edges → node → node

✅ Yours:

{ id, title, slug

---

# ⚖️ Final Architecture Recommendation

## ✅ Keep it simple initially

- JSON in Blob ✅
- WordPress media ✅
- No Cloudflare ✅
- SWA for frontend ✅

---

## ✅ Optimise later

- Move images to Blob ✅
- Add CDN if needed ✅
- Add caching rules ✅

---

# 🚀 Final Insight

What you’ve designed is:

> A **custom static content platform powered by WordPress**

Not:

- a headless API system
- not a runtime CMS

👉 This is why:

- splitting index vs detail ✅
- JSON blobs ✅
- Power Automate pipeline ✅

…works so well.

---


