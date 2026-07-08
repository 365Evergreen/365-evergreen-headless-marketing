import { NavLink } from "react-router-dom";
import styles from "./SecondaryNav.module.css";

type SecondaryNavItem = {
  label: string;
  href: string;
};

type SecondaryNavProps = {
  items: SecondaryNavItem[];
};

export function SecondaryNav({ items }: SecondaryNavProps) {
  return (
    <nav className={styles.nav} aria-label="Microsite section navigation">
      <div className={styles.inner}>
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ""}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}