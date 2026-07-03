import type { CSSProperties } from "react";

export type TabKey =
  | "home"
  | "competencies"
  | "products"
  | "scorecards"
  | "roadmap"
  | "badges";

const base: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "9px 14px",
  borderRadius: "10px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "transparent",
  font: "600 13.5px var(--font-body)",
  cursor: "pointer",
  whiteSpace: "nowrap",
  transition: "background-color .25s, color .25s",
};

export function navStyle(active: boolean): CSSProperties {
  return active
    ? {
        ...base,
        background: "var(--brand)",
        color: "var(--fg-on-brand, #fff)",
        borderColor: "var(--brand-light)",
        boxShadow: "var(--shadow-brand)",
      }
    : {
        ...base,
        background: "transparent",
        color: "var(--fg-2)",
      };
}

export function segTab(active: boolean): CSSProperties {
  const b: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 18px",
    borderRadius: "9px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "transparent",
    font: "600 13.5px var(--font-brand)",
    cursor: "pointer",
    transition:
      "background-color .22s var(--ease-out), color .22s var(--ease-out), box-shadow .22s var(--ease-out), border-color .22s var(--ease-out), transform .18s var(--ease-out)",
    whiteSpace: "nowrap",
  };
  return active
    ? {
        ...b,
        background: "var(--card)",
        color: "var(--brand)",
        borderColor: "var(--border-light)",
        boxShadow: "0 2px 8px rgba(20,18,46,.06), 0 1px 2px rgba(20,18,46,.04)",
      }
    : {
        ...b,
        background: "transparent",
        color: "var(--fg-2)",
      };
}