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
export declare function SiteHeader({ navUrl, variant, logoSrc, logoAlt, brandLabel, ctaLabel, ctaHref }: SiteHeaderProps): import("react").JSX.Element;
//# sourceMappingURL=SiteHeader.d.ts.map