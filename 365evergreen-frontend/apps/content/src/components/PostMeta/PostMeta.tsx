import styles from "./PostMeta.module.css";

type PostMetaProps = {
  uri?: string;
};

function buildBreadcrumbs(uri?: string) {
  if (!uri) return [];

  const parts = uri.split("/").filter(Boolean);

  return parts.map((part, index) => ({
    label: part.replace(/-/g, " "),
    href: "/" + parts.slice(0, index + 1).join("/")
  }));
}

export function PostMeta({ uri }: PostMetaProps) {
  const crumbs = buildBreadcrumbs(uri);

  if (crumbs.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <a href="/" className={styles.link}>Home</a>

      {crumbs.map((crumb) => (
        <span key={crumb.href} className={styles.crumb}>
          <span className={styles.separator}>/</span>
          <a href={crumb.href} className={styles.link}>
            {crumb.label}
          </a>
        </span>
      ))}
    </nav>
  );
}