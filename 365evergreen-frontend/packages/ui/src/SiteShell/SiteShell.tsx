import type { ReactNode } from "react";
import styles from "./SiteShell.module.css";

export type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return <main className={styles.siteShell}>{children}</main>;
}