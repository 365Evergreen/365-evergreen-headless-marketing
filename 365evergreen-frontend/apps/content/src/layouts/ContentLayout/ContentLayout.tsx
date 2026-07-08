import { SiteHeader, SiteShell } from "@evergreen/ui";
import type { ReactNode } from "react";
import styles from "./ContentLayout.module.css";

const NAV_URL =
  "https://sa365evergreenwebsite.blob.core.windows.net/content/navigation/navigation.json";

export type ContentLayoutProps = {
  children: ReactNode;
};

export function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <>
      <SiteHeader
        navUrl={NAV_URL}
        variant="content"
        logoSrc="https://sa365evergreenwebsite.blob.core.windows.net/media/home/365-evergreen-logo.svg"
        brandLabel="365 Evergreen"
      />

      <SiteShell>
        <div className={styles.container}>{children}</div>
      </SiteShell>
    </>
  );
}