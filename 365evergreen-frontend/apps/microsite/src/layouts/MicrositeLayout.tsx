import { Outlet } from "react-router-dom";
import { SecondaryNav } from "../components/SecondaryNav";
import styles from "./MicrositeLayout.module.css";

const secondaryNavItems = [
  { label: "Digital Workplace Discovery", href: "/form" },
  { label: "Solutions Gallery", href: "/solution-gallery" },
  { label: "Copilot", href: "/copilot" },
  { label: "Power Apps", href: "/power-apps" },
  { label: "Power Automate", href: "/power-automate" },
  { label: "SharePoint", href: "/sharepoint" }
];

export function MicrositeLayout() {
  return (
    <div className={styles.shell}>
      <SecondaryNav items={secondaryNavItems} />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}