import type { Tone } from "@/lib/types";

export function toneDeep(t: Tone): string {
  return (
    {
      mint: "var(--mint-deep)",
      iris: "var(--iris-deep)",
      irisDeep: "var(--iris-deep)",
      rose: "var(--rose-deep)",
      brand: "var(--brand)",
      gold: "var(--gold-deep)",
    }[t] || "var(--iris-deep)"
  );
}

export function toneTint(t: Tone): string {
  return (
    {
      mint: "var(--mint-tint)",
      iris: "var(--iris-tint)",
      irisDeep: "var(--iris-tint)",
      rose: "var(--rose-tint)",
      brand: "var(--brand-tint)",
      gold: "var(--gold-tint)",
    }[t] || "var(--iris-tint)"
  );
}
