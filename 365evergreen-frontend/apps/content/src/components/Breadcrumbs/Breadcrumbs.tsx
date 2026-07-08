import styles from "./Breadcrumbs.module.css";

type Crumb = {
  label: string;
  href: string;
};

type BreadcrumbsProps = {
  items: Crumb[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className={styles.breadcrumbs}>
      <a href="/" className={styles.link}>Home</a>

      {items.map((item) => (
        <span key={item.href}>
          <span className={styles.separator}>/</span>
          <a href={item.href} className={styles.link}>
            {item.label}
          </a>
        </span>
      ))}
    </nav>
  );
}
``