import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import styles from "./SiteHeader.module.css";
export function SiteHeader({ navUrl, variant = "marketing", logoSrc = "https://365evergreendev.com/wp-content/uploads/2026/06/Evergreen_Logo__100px.png", logoAlt = "365 Evergreen logo", brandLabel = "365 Evergreen", ctaLabel, ctaHref }) {
    const [navigation, setNavigation] = useState(null);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [loadError, setLoadError] = useState(null);
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
                const data = (await response.json());
                if (isMounted) {
                    setNavigation(data);
                    setLoadError(null);
                }
            }
            catch (error) {
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
    const navItems = useMemo(() => {
        if (!navigation) {
            return [];
        }
        const globalItems = navigation.global.map((item) => ({
            type: "link",
            label: item.label,
            href: item.href
        }));
        if (variant === "marketing") {
            const marketingItems = navigation.marketing.map((item) => ({
                type: "mega",
                label: item.label,
                href: item.href,
                groups: item.groups
            }));
            return [...globalItems, ...marketingItems];
        }
        const contentCategoryItems = navigation.content.categories;
        const contentItems = contentCategoryItems.length > 0
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
    return (_jsxs("header", { className: headerClassName, children: [_jsxs("div", { className: styles.headerInner, children: [_jsxs("a", { className: styles.brand, href: "/", "aria-label": brandLabel, children: [_jsx("img", { className: styles.logo, src: logoSrc, alt: logoAlt }), _jsx("span", { className: styles.brandText, children: brandLabel })] }), _jsx("nav", { className: styles.desktopNav, "aria-label": "Primary navigation", children: _jsx("ul", { className: styles.desktopNavList, children: navItems.map((item) => (_jsx("li", { className: styles.desktopNavItem, children: item.type === "link" ? (_jsx("a", { className: styles.desktopNavLink, href: item.href, children: item.label })) : (_jsxs(_Fragment, { children: [_jsx("a", { className: styles.desktopNavLink, href: item.href ?? "#", children: item.label }), _jsx("div", { className: styles.megaMenu, children: _jsx("div", { className: styles.megaMenuPanel, children: item.groups.map((group) => (_jsxs("section", { className: styles.megaMenuGroup, children: [_jsx("h2", { className: styles.megaMenuTitle, children: group.title }), _jsx("ul", { className: styles.megaMenuList, children: group.items.map((groupItem) => (_jsx("li", { children: _jsxs("a", { className: styles.megaMenuLink, href: groupItem.href, children: [_jsx("span", { className: styles.megaMenuLinkLabel, children: groupItem.label }), groupItem.description && (_jsx("span", { className: styles.megaMenuLinkDescription, children: groupItem.description }))] }) }, groupItem.href))) })] }, group.title))) }) })] })) }, item.label))) }) }), ctaLabel && ctaHref && (_jsx("a", { className: styles.desktopCta, href: ctaHref, children: ctaLabel })), _jsxs("button", { type: "button", className: styles.menuButton, "aria-label": isMenuOpen ? "Close navigation menu" : "Open navigation menu", "aria-expanded": isMenuOpen, "aria-controls": "mobile-navigation", onClick: () => setIsMenuOpen((current) => !current), children: [_jsx("span", { className: styles.menuButtonLine }), _jsx("span", { className: styles.menuButtonLine }), _jsx("span", { className: styles.menuButtonLine })] })] }), _jsxs("nav", { id: "mobile-navigation", className: styles.mobileNav, "aria-label": "Mobile navigation", children: [_jsxs("ul", { className: styles.mobileNavList, children: [navItems.map((item) => (_jsx("li", { className: styles.mobileNavItem, children: item.type === "link" ? (_jsx("a", { className: styles.mobileNavLink, href: item.href, onClick: () => setIsMenuOpen(false), children: item.label })) : (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.mobileNavHeading, children: item.label }), item.groups.map((group) => (_jsxs("div", { className: styles.mobileNavGroup, children: [_jsx("span", { className: styles.mobileNavGroupTitle, children: group.title }), _jsx("ul", { className: styles.mobileChildList, children: group.items.map((groupItem) => (_jsx("li", { children: _jsx("a", { className: styles.mobileChildLink, href: groupItem.href, onClick: () => setIsMenuOpen(false), children: groupItem.label }) }, groupItem.href))) })] }, group.title)))] })) }, item.label))), ctaLabel && ctaHref && (_jsx("li", { className: styles.mobileNavItem, children: _jsx("a", { className: styles.mobileCta, href: ctaHref, onClick: () => setIsMenuOpen(false), children: ctaLabel }) }))] }), loadError && (_jsx("p", { className: styles.navError, role: "status", children: "Navigation unavailable" }))] })] }));
}
