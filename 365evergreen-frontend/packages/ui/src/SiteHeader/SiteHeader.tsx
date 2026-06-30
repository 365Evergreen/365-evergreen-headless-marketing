import { useEffect, useMemo, useState } from "react";
import styles from "./SiteHeader.module.css";

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type MegaMenuItem = {
  label: string;
  href?: string;
  groups: NavGroup[];
};

export type NavigationSchema = {
  global: NavItem[];
  marketing: MegaMenuItem[];
  content: {
    categories: NavItem[];
    featured: NavItem[];
  };
};

export type SiteHeaderVariant = "marketing" | "content";

export type SiteHeaderProps = {
  navUrl: string;
  variant?: SiteHeaderVariant;
  logoSrc?: string;
  logoAlt?: string;
  brandLabel?: string;
  ctaLabel?: string;
  ctaHref?: string;
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

export function SiteHeader({
  navUrl,
  variant = "marketing",
  logoSrc = "https://365evergreendev.com/wp-content/uploads/2026/06/Evergreen_Logo__100px.png",
  logoAlt = "365 Evergreen logo",
  brandLabel = "365 Evergreen",
  ctaLabel,
  ctaHref
}: SiteHeaderProps) {
  const [navigation, setNavigation] = useState<NavigationSchema | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadNavigation() {
      try {
        const response = await fetch(navUrl, {
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Navigation request failed: ${response.status}`);
        }

        const data = (await response.json()) as NavigationSchema;

        if (isMounted) {
          setNavigation(data);
          setLoadError(null);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(error instanceof Error ? error.message : "Navigation failed to load");
        }
      }
    }

    loadNavigation();

    return () => {
      isMounted = false;
    };
  }, [navUrl]);

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

  const navItems = useMemo<HeaderNavItem[]>(() => {
    if (!navigation) {
      return [];
    }

    const globalItems: HeaderNavItem[] = navigation.global.map((item) => ({
      type: "link",
      label: item.label,
      href: item.href
    }));

    if (variant === "marketing") {
      const marketingItems: HeaderNavItem[] = navigation.marketing.map((item) => ({
        type: "mega",
        label: item.label,
        href: item.href,
        groups: item.groups
      }));

      return [...globalItems, ...marketingItems];
    }

    const contentCategoryItems = navigation.content.categories;

    const contentItems: HeaderNavItem[] =
      contentCategoryItems.length > 0
        ? [
            {
              type: "mega",
              label: "Topics",
              groups: [
                {
                  title: "Categories",
                  items: contentCategoryItems
                }
              ]
            }
          ]
        : [];

    return [...globalItems, ...contentItems];
  }, [navigation, variant]);

  const headerClassName = [
    styles.siteHeader,
    hasScrolled ? styles.siteHeaderScrolled : "",
    isMenuOpen ? styles.siteHeaderMenuOpen : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClassName}>
      <div className={styles.headerInner}>
        <a className={styles.brand} href="/" aria-label={brandLabel}>
          <img className={styles.logo} src={logoSrc} alt={logoAlt} />
          <span className={styles.brandText}>{brandLabel}</span>
        </a>

        <nav className={styles.desktopNav} aria-label="Primary navigation">
          <ul className={styles.desktopNavList}>
            {navItems.map((item) => (
              <li key={item.label} className={styles.desktopNavItem}>
                {item.type === "link" ? (
                  <a className={styles.desktopNavLink} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <>
                    <a className={styles.desktopNavLink} href={item.href ?? "#"}>
                      {item.label}
                    </a>

                    <div className={styles.megaMenu}>
                      <div className={styles.megaMenuPanel}>
                        {item.groups.map((group) => (
                          <section key={group.title} className={styles.megaMenuGroup}>
                            <h2 className={styles.megaMenuTitle}>{group.title}</h2>

                            <ul className={styles.megaMenuList}>
                              {group.items.map((groupItem) => (
                                <li key={groupItem.href}>
                                  <a className={styles.megaMenuLink} href={groupItem.href}>
                                    <span className={styles.megaMenuLinkLabel}>
                                      {groupItem.label}
                                    </span>

                                    {groupItem.description && (
                                      <span className={styles.megaMenuLinkDescription}>
                                        {groupItem.description}
                                      </span>
                                    )}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </section>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {ctaLabel && ctaHref && (
          <a className={styles.desktopCta} href={ctaHref}>
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
            <li key={item.label} className={styles.mobileNavItem}>
              {item.type === "link" ? (
                <a
                  className={styles.mobileNavLink}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <>
                  <span className={styles.mobileNavHeading}>{item.label}</span>

                  {item.groups.map((group) => (
                    <div key={group.title} className={styles.mobileNavGroup}>
                      <span className={styles.mobileNavGroupTitle}>{group.title}</span>

                      <ul className={styles.mobileChildList}>
                        {group.items.map((groupItem) => (
                          <li key={groupItem.href}>
                            <a
                              className={styles.mobileChildLink}
                              href={groupItem.href}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              {groupItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </>
              )}
            </li>
          ))}

          {ctaLabel && ctaHref && (
            <li className={styles.mobileNavItem}>
              <a
                className={styles.mobileCta}
                href={ctaHref}
                onClick={() => setIsMenuOpen(false)}
              >
                {ctaLabel}
              </a>
            </li>
          )}
        </ul>

        {loadError && (
          <p className={styles.navError} role="status">
            Navigation unavailable
          </p>
        )}
      </nav>
    </header>
  );
}