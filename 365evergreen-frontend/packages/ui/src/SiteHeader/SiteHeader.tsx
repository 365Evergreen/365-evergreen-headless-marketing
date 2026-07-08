import { useEffect, useMemo, useState } from "react";
import styles from "./SiteHeader.module.css";

type NavItem = {
  label: string;
  href: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

type MegaMenuItem = {
  label: string;
  href?: string;
  groups: NavGroup[];
};

type NavigationSchema = {
  global: NavItem[];
  marketing: MegaMenuItem[];
  content: {
    categories: NavItem[];
    featured: NavItem[];
  };
};

type HeaderNavItem =
  | {
      type: "link";
      label: string;
      href: string;
    }
  | {
      type: "mega";
      label: string;
      href?: string;
      groups: NavGroup[];
    };

export type SiteHeaderProps = {
  navUrl: string;
  variant?: "marketing" | "content";
  logoSrc?: string;
  brandLabel?: string;
};

export function SiteHeader({
  navUrl,
  variant = "marketing",
  logoSrc = "https://sa365evergreenwebsite.blob.core.windows.net/media/home/365-evergreen-logo.svg",
  brandLabel = "365 Evergreen"
}: SiteHeaderProps) {
  const [navigation, setNavigation] = useState<NavigationSchema | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ Fetch navigation
  useEffect(() => {
    async function loadNav() {
      try {
        const res = await fetch(navUrl);

        if (!res.ok) throw new Error();

        const data = await res.json();
        setNavigation(data);
      } catch {
        console.error("Failed to load navigation");
      }
    }

    loadNav();
  }, [navUrl]);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 0);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  // ✅ Map navigation safely
  const navItems = useMemo<HeaderNavItem[]>(() => {
    if (!navigation) return [];

    const globalItems: HeaderNavItem[] = navigation.global.map((item) => ({
      type: "link",
      label: item.label,
      href: item.href
    }));

    // ✅ Marketing = full nav
    if (variant === "marketing") {
      return [
        ...globalItems,
        ...navigation.marketing.map((item) => ({
          type: "mega" as const,
          label: item.label,
          href: item.href,
          groups: item.groups
        }))
      ];
    }

    // ✅ ✅ Content = fallback to marketing nav if no categories
    if (variant === "content") {
      if (navigation.content?.categories?.length > 0) {
        return [
          ...globalItems,
          {
            type: "mega" as const,
            label: "Topics",
            href: "/topics",
            groups: [
              {
                title: "Categories",
                items: navigation.content.categories
              }
            ]
          }
        ];
      }

      // ✅ fallback so nav always renders
      return [
        ...globalItems,
        ...navigation.marketing.map((item) => ({
          type: "mega" as const,
          label: item.label,
          href: item.href,
          groups: item.groups
        }))
      ];
    }

    return globalItems;
  }, [navigation, variant]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        {/* Logo */}
        <a href="/" className={styles.brand}>
          <img src={logoSrc} alt={brandLabel} className={styles.logo} />
          <span>{brandLabel}</span>
        </a>

        {/* Desktop nav */}
        <nav className={styles.desktopNav}>
          {navItems.map((item) => (
            <div key={item.label} className={styles.navItem}>
              {item.type === "link" ? (
                <a href={item.href} className={styles.link}>
                  {item.label}
                </a>
              ) : (
                <div className={styles.megaWrapper}>
                  <span className={styles.link}>{item.label}</span>

                  <div className={styles.megaMenu}>
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        <div className={styles.groupTitle}>
                          {group.title}
                        </div>

                        {group.items.map((sub) => (
                          <a key={sub.href} href={sub.href} className={styles.link}>
                            {sub.label}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          ☰
        </button>
      </div>

      {/* Mobile nav */}
      {isMenuOpen && (
        <nav className={styles.mobileNav}>
          {navItems.map((item) => (
            <div key={item.label}>
              {item.type === "link" ? (
                <a href={item.href} className={styles.mobileLink}>
                  {item.label}
                </a>
              ) : (
                <>
                  <div className={styles.mobileHeading}>{item.label}</div>

                  {item.groups.map((group) =>
                    group.items.map((sub) => (
                      <a
                        key={sub.href}
                        href={sub.href}
                        className={styles.mobileLink}
                      >
                        {sub.label}
                      </a>
                    ))
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
}