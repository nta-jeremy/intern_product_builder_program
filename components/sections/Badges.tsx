"use client";

import { BADGES } from "@/lib/data";
import type { Badge, Tone } from "@/lib/types";

function toneVal(t: Tone): string {
  return (
    {
      mint: "var(--mint)",
      iris: "var(--iris)",
      irisDeep: "var(--iris-deep)",
      rose: "var(--rose)",
      brand: "var(--brand)",
      gold: "var(--gold)",
    }[t] || "var(--iris)"
  );
}
function toneTint(t: Tone): string {
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
function toneGrad(t: Tone): string {
  return (
    {
      mint: "var(--grad-mint)",
      iris: "var(--grad-iris)",
      irisDeep: "var(--grad-iris)",
      rose: "var(--grad-rose)",
      brand: "var(--grad-brand)",
      gold: "var(--grad-gold)",
    }[t] || "var(--grad-iris)"
  );
}
function toneGlow(t: Tone): string {
  const c: Record<Tone, string> = {
    mint: "16,185,129",
    iris: "124,108,245",
    irisDeep: "74,75,200",
    rose: "244,114,182",
    brand: "42,43,134",
    gold: "252,175,22",
  };
  return `0 16px 40px rgba(${c[t] || c.iris},.35)`;
}

interface BadgesProps {
  onSelect: (i: number) => void;
}

export function badgeToneHelpers() {
  return { toneVal, toneTint, toneGrad, toneGlow };
}

export function Badges({ onSelect }: BadgesProps) {
  return (
    <main
      style={{
        maxWidth: "1160px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow gold">Quy chuẩn Năng lực</span>
      <h1
        style={{
          font: "700 clamp(26px,3.4vw,38px)/1.15 var(--font-impact)",
          letterSpacing: "-.02em",
          margin: "16px 0 8px",
          color: "var(--fg-1)",
        }}
      >
        <em className="em-accent">Hành trình Product Builder</em> — Hệ Thống Huy Hiệu
      </h1>
      <p
        style={{
          maxWidth: "760px",
          color: "var(--fg-2)",
          fontSize: "15.5px",
          margin: "0 0 30px",
        }}
      >
        Huy hiệu được trao dựa trên năng lực thiết kế, thử nghiệm và tích hợp sản phẩm giải quyết vấn đề thực tế (Outcome-driven), không đánh giá theo điểm số lý thuyết trung bình. YPB1 (Mint - Định vị & Khởi tạo) · YPB2-YPB3 (Iris - Xây dựng & Tốt nghiệp) · YPB4-YPB5 (Brand/Gold - Vận hành & Kiến trúc).
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "20px",
          alignItems: "stretch",
        }}
      >
        {BADGES.map((b: Badge, i) => {
          const tone = toneVal(b.tone);
          const tint = toneTint(b.tone);
          const grad = toneGrad(b.tone);
          const glow = toneGlow(b.tone);
          return (
            <button
              key={b.code}
              onClick={() => onSelect(i)}
              className="hov-lift-lg-dyn"
              style={
                {
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  textAlign: "left",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-sm)",
                  cursor: "pointer",
                  padding: 0,
                  transition:
                    "transform .2s var(--ease-out),box-shadow .3s,border-color .3s,background-color .3s",
                  "--hov-border": tone,
                  "--hov-shadow": glow,
                } as React.CSSProperties
              }
            >
              <div style={{ height: "8px", background: grad, width: "100%" }} />
              <div
                style={{
                  padding: "26px 24px",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "16px",
                      background: tint,
                      display: "grid",
                      placeItems: "center",
                      color: tone,
                    }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                      <circle cx="12" cy="8" r="6" />
                    </svg>
                  </div>
                  <span
                    style={{
                      font: "800 13px var(--font-mono)",
                      letterSpacing: ".05em",
                      color: tone,
                      background: tint,
                      padding: "5px 11px",
                      borderRadius: "20px",
                    }}
                  >
                    {b.label}
                  </span>
                </div>
                <div
                  style={{
                    font: "700 19px/1.25 var(--font-brand)",
                    margin: "18px 0 3px",
                    color: "var(--fg-1)",
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    font: "500 12px var(--font-mono)",
                    color: "var(--fg-3)",
                  }}
                >
                  {b.en}
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.55,
                    color: "var(--fg-2)",
                    margin: "14px 0 0",
                  }}
                >
                  {b.criteria}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
}