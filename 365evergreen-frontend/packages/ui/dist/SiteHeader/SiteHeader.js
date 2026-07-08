import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import styles from "./SiteHeader.module.css";
export function SiteHeader({ navUrl, variant = "marketing", logoSrc = "https://sa365evergreenwebsite.blob.core.windows.net/media/home/365-evergreen-logo.svg", brandLabel = "365 Evergreen" }) {
    const [navigation, setNavigation] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    // ✅ Fetch navigation
    useEffect(() => {
        async function loadNav() {
            try {
                const res = await fetch(navUrl);
                if (!res.ok)
                    throw new Error();
                const data = await res.json();
                setNavigation(data);
            }
            catch {
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
    const navItems = useMemo(() => {
        if (!navigation)
            return [];
        const globalItems = navigation.global.map((item) => ({
            type: "link",
            label: item.label,
            href: item.href
        }));
        // ✅ Marketing = full nav
        if (variant === "marketing") {
            return [
                ...globalItems,
                ...navigation.marketing.map((item) => ({
                    type: "mega",
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
                        type: "mega",
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
                    type: "mega",
                    label: item.label,
                    href: item.href,
                    groups: item.groups
                }))
            ];
        }
        return globalItems;
    }, [navigation, variant]);
    return (_jsxs("header", { className: `${styles.header} ${isScrolled ? styles.scrolled : ""}`, children: [_jsxs("div", { className: styles.inner, children: [_jsxs("a", { href: "/", className: styles.brand, children: [_jsx("img", { src: logoSrc, alt: brandLabel, className: styles.logo }), _jsx("span", { children: brandLabel })] }), _jsx("nav", { className: styles.desktopNav, children: navItems.map((item) => (_jsx("div", { className: styles.navItem, children: item.type === "link" ? (_jsx("a", { href: item.href, className: styles.link, children: item.label })) : (_jsxs("div", { className: styles.megaWrapper, children: [_jsx("span", { className: styles.link, children: item.label }), _jsx("div", { className: styles.megaMenu, children: item.groups.map((group) => (_jsxs("div", { children: [_jsx("div", { className: styles.groupTitle, children: group.title }), group.items.map((sub) => (_jsx("a", { href: sub.href, className: styles.link, children: sub.label }, sub.href)))] }, group.title))) })] })) }, item.label))) }), _jsx("button", { className: styles.menuToggle, onClick: () => setIsMenuOpen((prev) => !prev), children: "\u2630" })] }), isMenuOpen && (_jsx("nav", { className: styles.mobileNav, children: navItems.map((item) => (_jsx("div", { children: item.type === "link" ? (_jsx("a", { href: item.href, className: styles.mobileLink, children: item.label })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.mobileHeading, children: item.label }), item.groups.map((group) => group.items.map((sub) => (_jsx("a", { href: sub.href, className: styles.mobileLink, children: sub.label }, sub.href))))] })) }, item.label))) }))] }));
}
