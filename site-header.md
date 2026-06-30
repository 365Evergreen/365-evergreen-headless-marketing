# Site header

## Summary

* fixed at the top
* full-width on desktop
* logo and brand on the left
* desktop navigation on the right
* hamburger menu on small screens
* transparent when the page loads
* white background after scroll
* suitable for both the Astro marketing app and React content app


```txt
packages/ui/src/SiteHeader/
├── SiteHeader.tsx
├── SiteHeader.module.css
└── index.ts
```

***

# `packages/ui/src/SiteHeader/SiteHeader.tsx`

```tsx
import { useEffect, useState } from "react";
import styles from "./SiteHeader.module.css";

export type SiteHeaderNavItem = {
  label: string;
  href: string;
  children?: SiteHeaderNavItem[];
};

export type SiteHeaderProps = {
  logoSrc?: string;
  logoAlt?: string;
  brandLabel?: string;
  navItems: SiteHeaderNavItem[];
  ctaLabel?: string;
  ctaHref?: string;
};

export function SiteHeader({
  logoSrc = "/logo.svg",
  logoAlt = "365 Evergreen logo",
  brandLabel = "365 Evergreen",
  navItems,
  ctaLabel,
  ctaHref
}: SiteHeaderProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 12);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const headerClassName = [
    styles.siteHeader,
    hasScrolled ? styles.siteHeaderScrolled : "",
    isMenuOpen ? styles.siteHeaderMenuOpen : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className={styles.siteHeaderInner}>
        /
          {logoSrc}
          <span className={styles.brandText}>{brandLabel}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.desktopNavList}>
            {navItems.map((item) => (
              <li key={item.href} className={styles.desktopNavItem}>
                {item.href}
                  {item.label}
                </a>

                {item.children && item.children.length > 0 && (
                  <div className={styles.megaMenu}>
                    <div className={styles.megaMenuInner}>
                      {item.children.map((child) => (
                        {child.href}
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {ctaLabel && ctaHref && (
          {ctaHref}
            {ctaLabel}
          </a>
        )}

        <button
          type="button"
          className={styles.menuButton}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span className={styles.menuButtonLine} />
          <span className={styles.menuButtonLine} />
          <span className={styles.menuButtonLine} />
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={styles.mobileNav}
        aria-label="Mobile navigation"
      >
        <ul className={styles.mobileNavList}>
          {navItems.map((item) => (
            <li key={item.href} className={styles.mobileNavItem}>
              {item.href} => setIsMenuOpen(false)}
              >
                {item.label}
              </a>

              {item.children && item.children.length > 0 && (
                <ul className={styles.mobileChildList}>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      {child.href} => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}

          {ctaLabel && ctaHref && (
            <li className={styles.mobileNavItem}>
              {ctaHref} => setIsMenuOpen(false)}
              >
                {ctaLabel}
              </a>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
```

***

# `packages/ui/src/SiteHeader/SiteHeader.module.css`

```css
.siteHeader {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: 1000;
  width: 100%;
  background: transparent;
  color: var(--color-text-primary, #111827);
  transition:
    background-color 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.siteHeader::before {
  content: "";
  position: absolute;
  inset-block-start: 0;
  inset-inline: 0;
  height: 3px;
  background: var(--color-brand-primary, #7cad3e);
}

.siteHeaderScrolled,
.siteHeaderMenuOpen {
  background: var(--color-surface-header, #ffffff);
  box-shadow: 0 8px 28px rgb(15 23 42 / 0.08);
}

.siteHeaderInner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 76px;
  padding: 0 clamp(1rem, 4vw, 4rem);
  gap: 2rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  color: inherit;
  text-decoration: none;
}

.logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  flex: 0 0 auto;
}

.brandText {
  margin-inline-start: 0.85rem;
  font-size: clamp(1.35rem, 2vw, 2rem);
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1;
}

.desktopNav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}

.desktopNavList {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: clamp(1rem, 2.5vw, 2.25rem);
  margin: 0;
  padding: 0;
  list-style: none;
}

.desktopNavItem {
  position: relative;
}

.desktopNavLink {
  display: inline-flex;
  align-items: center;
  min-height: 76px;
  color: inherit;
  text-decoration: none;
  font-size: 0.98rem;
  font-weight: 650;
  letter-spacing: -0.01em;
  opacity: 0.86;
  transition:
    opacity 160ms ease,
    color 160ms ease;
}

.desktopNavLink:hover,
.desktopNavLink:focus-visible {
  opacity: 1;
  color: var(--color-brand-primary, #5f8f2f);
  outline: none;
}

.megaMenu {
  position: absolute;
  inset-block-start: 100%;
  inset-inline-start: 50%;
  min-width: 240px;
  padding-block-start: 0.25rem;
  opacity: 0;
  visibility: hidden;
  transform: translate(-50%, 8px);
  transition:
    opacity 160ms ease,
    transform 160ms ease,
    visibility 160ms ease;
}

.desktopNavItem:hover .megaMenu,
.desktopNavItem:focus-within .megaMenu {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, 0);
}

.megaMenuInner {
  display: grid;
  gap: 0.25rem;
  padding: 0.75rem;
  background: #ffffff;
  border: 1px solid rgb(15 23 42 / 0.08);
  border-radius: 18px;
  box-shadow: 0 20px 60px rgb(15 23 42 / 0.16);
}

.megaMenuLink {
  display: block;
  padding: 0.7rem 0.8rem;
  color: #111827;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.megaMenuLink:hover,
.megaMenuLink:focus-visible {
  background: rgb(124 173 62 / 0.1);
  color: var(--color-brand-primary, #5f8f2f);
  outline: none;
}

.desktopCta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 1.1rem;
  color: #ffffff;
  background: var(--color-brand-primary, #7cad3e);
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    background-color 160ms ease;
}

.desktopCta:hover,
.desktopCta:focus-visible {
  transform: translateY(-1px);
  background: var(--color-brand-primary-strong, #5f8f2f);
  outline: none;
}

.menuButton {
  display: none;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.72);
  cursor: pointer;
}

.menuButtonLine {
  width: 21px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
  transition:
    transform 180ms ease,
    opacity 180ms ease;
}

.siteHeaderMenuOpen .menuButtonLine:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.siteHeaderMenuOpen .menuButtonLine:nth-child(2) {
  opacity: 0;
}

.siteHeaderMenuOpen .menuButtonLine:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.mobileNav {
  display: none;
}

.mobileNavList {
  margin: 0;
  padding: 1rem;
  list-style: none;
}

.mobileNavItem + .mobileNavItem {
  border-top: 1px solid rgb(15 23 42 / 0.08);
}

.mobileNavLink {
  display: flex;
  align-items: center;
  min-height: 54px;
  color: #111827;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 750;
}

.mobileChildList {
  margin: 0 0 0.75rem;
  padding: 0 0 0 1rem;
  list-style: none;
}

.mobileChildLink {
  display: flex;
  align-items: center;
  min-height: 42px;
  color: #374151;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
}

.mobileCta {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  margin-block-start: 1rem;
  color: #ffffff;
  background: var(--color-brand-primary, #7cad3e);
  border-radius: 999px;
  text-decoration: none;
  font-weight: 750;
}

@media (max-width: 900px) {
  .siteHeaderInner {
    min-height: 68px;
    padding-inline: 1rem;
  }

  .logo {
    width: 42px;
    height: 42px;
  }

  .brandText {
    font-size: 1.35rem;
  }

  .desktopNav,
  .desktopCta {
    display: none;
  }

  .menuButton {
    display: inline-flex;
  }

  .mobileNav {
    display: block;
    max-height: 0;
    overflow: hidden;
    background: #ffffff;
    transition: max-height 220ms ease;
  }

  .siteHeaderMenuOpen .mobileNav {
    max-height: calc(100vh - 68px);
    overflow-y: auto;
    border-top: 1px solid rgb(15 23 42 / 0.08);
  }
}

@media (prefers-reduced-motion: reduce) {
  .siteHeader,
  .desktopNavLink,
  .desktopCta,
  .megaMenu,
  .menuButtonLine,
  .mobileNav {
    transition: none;
  }
}
```

***

# `packages/ui/src/SiteHeader/index.ts`

```ts
export * from "./SiteHeader";
```

***

# Update `packages/ui/src/index.ts`

```ts
export * from "./SiteHeader";
```

***

# Example usage in React content app

```tsx
import { SiteHeader } from "@evergreen/ui";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      { label: "SharePoint", href: "/blog/sharepoint" },
      { label: "Power Platform", href: "/blog/power-platform" }
    ]
  }
];

export default function App() {
  return (
    <>
      <SiteHeader
        logoSrc="/logo.svg"
        brandLabel="365 Evergreen"
        navItems={navItems}
        ctaLabel="Contact"
        ctaHref="/contact"
      />

      <main style={{ minHeight: "200vh", paddingTop: "96px" }}>
        <h1>Content app</h1>
      </main>
    </>
  );
}
```

***

# Example usage in Astro marketing app

If you want to use this React shared component inside Astro, add the React integration to the marketing app:

```bash
pnpm --filter marketing astro add react
```

Then in Astro:

```astro
---
import { SiteHeader } from "@evergreen/ui";

const navItems = [
  { label: "Services", href: "/services" },
  { label: "Insights", href: "/blog" },
  { label: "About", href: "/about" }
];
---

<SiteHeader
  client:load
  logoSrc="/logo.svg"
  brandLabel="365 Evergreen"
  navItems={navItems}
  ctaLabel="Contact"
  ctaHref="/contact"
/>
```

Because the header uses scroll state and mobile menu state, it needs hydration in Astro. `client:load` is the simplest starting point.

***

# Notes for your design system tokens

You may want to add these to `packages/designTokens/src/tokens.css`:

```css
:root {
  --color-brand-primary: #7cad3e;
  --color-brand-primary-strong: #5f8f2f;
  --color-text-primary: #111827;
  --color-surface-header: #ffffff;
}
```


