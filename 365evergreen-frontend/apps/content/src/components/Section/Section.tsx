import type { ReactNode } from "react";
import styles from "./Section.module.css";

export type SectionProps = {
  children: ReactNode;
  variant?: "default" | "muted";
};

export function Section({ children, variant = "default" }: SectionProps) {
  return (
    <section className={`${styles.section} ${styles[variant]}`}>
      {children}
    </section>
  );
}