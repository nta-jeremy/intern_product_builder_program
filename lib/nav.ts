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
  border: "1px solid transparent",
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
    padding: "9px 18px",
    borderRadius: "9px",
    border: "none",
    font: "600 13.5px var(--font-brand)",
    cursor: "pointer",
    transition: "all .25s",
    whiteSpace: "nowrap",
  };
  return active
    ? {
        ...b,
        background: "var(--card)",
        color: "var(--brand)",
        boxShadow: "var(--shadow-sm)",
      }
    : {
        ...b,
        background: "transparent",
        color: "var(--fg-2)",
      };
}