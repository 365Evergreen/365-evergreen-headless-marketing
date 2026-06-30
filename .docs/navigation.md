# ✅ Minimal v1 (get started quickly)

📁 `/navigation/navigation.json`

```json
{
  "global": [
    {
      "label": "Parent item 1",
      "href": "/parent-1",
      "children": [
        {
          "label": "Child item 1",
          "href": "/child-1"
        }
      ]
    },
    {
      "label": "Parent item 2",
      "href": "/parent-2",
      "children": [
        {
          "label": "Child item 2",
          "href": "/child-2"
        }
      ]
    },
    {
      "label": "Parent item 3",
      "href": "/parent-3"
    }
  ]
}
```

***

## ✅ Scalable v2 (future megamenu support)

This aligns better with your earlier design:

```json
{
  "global": [
    { "label": "Home", "href": "/" }
  ],
  "marketing": [
    {
      "label": "Services",
      "groups": [
        {
          "title": "Group 1",
          "items": [
            { "label": "Parent item 1", "href": "/parent-1" }
          ]
        }
      ]
    }
  ],
  "content": {
    "categories": [],
    "featured": []
  }
}
```

## 🔧 Transformation Rules (Critical)

In Power Automate (or any pipeline), apply this logic:

***

## ✅ 1. Ignore duplicates

Your data contains:

* Parent items
* AND child items repeated as top-level nodes

👉 Rule:

```
Only include nodes that have children OR are top-level parents
```

***

## ✅ 2. Extract ONLY usable fields

From node:

| WPGraphQL field | Use? | Notes               |
| --------------- | ---- | ------------------- |
| label           | ✅    | primary             |
| uri             | ⚠️   | needs cleaning      |
| url             | ❌    | ignore (dirty HTML) |
| childItems      | ✅    | for hierarchy       |

***

## ✅ 3. Clean URLs (important)

Your `uri` contains HTML like:


👉 You MUST:

* strip HTML
* extract href
* convert to relative path if needed

***

## ✅ 4. Build hierarchy explicitly

Your transformation should produce:

```ts
{
  label,
  href,
  children: [...]
}
```

NOT rely on:

* implicit relationships
* repeated nodes

***

# 🧩 Power Automate Design (Navigation Flow Only)

***

## ✅ Step-by-step

### 1. HTTP → get menu

POST to WPGraphQL

***

### 2. Parse JSON

Use sample payload

***

### 3. Filter only parents

Condition:

```text
length(childItems.nodes) > 0 OR no parent exists
```

***

### 4. Select (build structure)

Use **Select action**

Map:

```json
{
  "label": item()?['node']?['label'],
  "href": cleanedUri,
  "children": item()?['node']?['childItems']?['nodes']
}
```

***

### 5. Nested Select (children)

Inside each:

```json
{
  "label": child?['label'],
  "href": "/child-slug"
}
```

***

### 6. Compose final JSON

```json
{
  "global": outputs('Select')
}
```

***

### 7. Write to Blob

```
/navigation/navigation.json
```

***

# ⚠️ Important Design Call (Do This Now)

## ❌ Don’t model nav as WP Menu long-term

It works for now—but:

* menus become messy quickly
* hard to version
* hard to extend to megamenu

***

## ✅ Better (future)

Move to:

* ACF Options OR
* Navigation CPT

Where you define:

* group
* section
* link type

***

# ⚖️ Recommendation for you (now vs later)

## ✅ NOW (keep momentum)

* Use WP menu
* Transform → JSON
* Build frontend

***

## ✅ LATER (important refactor)

* Move to structured navigation model
* Drop WP menus entirely

***

# 🧠 Final Insight

What you’re doing here is:

> separating **authoring structure (WordPress)** from\
> **delivery structure (your JSON)**

That is exactly what enables:

* performance
* scalability
* frontend independence

***
