import { jsx as _jsx } from "react/jsx-runtime";
import styles from "./SiteShell.module.css";
export function SiteShell({ children }) {
    return _jsx("main", { className: styles.siteShell, children: children });
}
