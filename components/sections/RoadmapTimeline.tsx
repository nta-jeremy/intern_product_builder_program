"use client";

import { useMemo } from "react";
import { ROADMAP } from "@/lib/data";
import type { RoadmapItem, Tone } from "@/lib/types";

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
function toneDeep(t: Tone): string {
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

export function RoadmapTimeline() {
  const roadmapVM = useMemo(
    () =>
      ROADMAP.map((r: RoadmapItem, i) => {
        const tone = toneVal(r.tone);
        const deep = toneDeep(r.tone);
        const isLast = i === ROADMAP.length - 1;
        const nodeBg =
          r.tone === "gold"
            ? "var(--grad-gold)"
            : i === 0
              ? "var(--grad-mint)"
              : "var(--grad-iris)";
        return {
          num: String(i + 1),
          title: r.title,
          meta: r.meta,
          gate: r.gate,
          gateLabel: r.gateLabel,
          tone,
          deep,
          grad: r.grad,
          sessions: r.sessions,
          connector: !isLast,
          nodeBg,
          gateBg: toneTint(r.tone),
          gateBrd: "var(--border-light)",
        };
      }),
    [],
  );

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          margin: "0 0 40px",
        }}
      >
        <span className="s-eyebrow iris">Lộ trình đào tạo</span>
      </header>

      <div style={{ animation: "dcFade .35s var(--ease-out)" }}>
        <h1
          style={{
            font: "700 clamp(24px,3.2vw,34px)/1.18 var(--font-impact)",
            letterSpacing: "-.02em",
            margin: "0 0 8px",
            color: "var(--fg-1)",
          }}
        >
          Bốn giai đoạn · 14 tuần — tốt nghiệp ở Level 2 <em className="em-accent">(Product Builder)</em>
        </h1>
        <p
          style={{
            maxWidth: "740px",
            color: "var(--fg-2)",
            fontSize: "15px",
            margin: "0 0 30px",
          }}
        >
          Chương trình chia 4 giai đoạn theo 14 tuần. L1–L5 là thang năng lực
          tham chiếu; chuẩn tốt nghiệp là đạt Level 2. Mỗi giai đoạn chốt bằng
          một Gate — vượt qua nhờ một sản phẩm bàn giao thực tế được duyệt, không dựa
          trên điểm số.
        </p>
        <div style={{ position: "relative", paddingLeft: "8px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {roadmapVM.map((r) => (
              <div key={r.num} style={{ display: "flex", gap: "20px", alignItems: "stretch" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flex: "none",
                    width: "52px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "15px",
                      background: r.nodeBg,
                      color: "#fff",
                      font: "800 16px var(--font-impact)",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "var(--shadow-sm)",
                      border: "1px solid transparent",
                    }}
                  >
                    {r.num}
                  </div>
                  {r.connector && (
                    <div
                      style={{
                        flex: 1,
                        width: "2px",
                        background: "var(--border)",
                        margin: "6px 0",
                        minHeight: "20px",
                      }}
                    />
                  )}
                </div>
                <div
                  className="hov-lift-sm-x-dyn"
                  style={
                    {
                      flex: 1,
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "16px",
                      boxShadow: "var(--shadow-sm)",
                      padding: "22px 24px",
                      marginBottom: "4px",
                      transition:
                        "transform .18s var(--ease-out),box-shadow .18s,border-color .3s,background-color .3s",
                      "--hov-border": r.tone,
                    } as React.CSSProperties
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span
                      style={{
                        font: "800 18px var(--font-brand)",
                        color: "var(--fg-1)",
                      }}
                    >
                      {r.title}
                    </span>
                    <span
                      style={{
                        font: "500 12.5px var(--font-mono)",
                        color: "var(--fg-3)",
                      }}
                    >
                      {r.meta}
                    </span>
                    {r.grad && (
                      <span
                        style={{
                          font: "700 10px var(--font-mono)",
                          color: "var(--gold-deep)",
                          background: "var(--gold-tint)",
                          padding: "3px 9px",
                          borderRadius: "20px",
                        }}
                      >
                        TỐT NGHIỆP L2
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "7px",
                      margin: "14px 0",
                    }}
                  >
                    {r.sessions.map((s) => (
                      <span
                        key={s}
                        style={{
                          font: "600 11.5px var(--font-mono)",
                          color: r.deep,
                          background: toneTint(ROADMAP[Number(r.num) - 1].tone),
                          padding: "5px 10px",
                          borderRadius: "8px",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "11px",
                      padding: "13px 16px",
                      background: r.gateBg,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: r.gateBrd,
                      borderRadius: "12px",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={r.tone}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ flex: "none", marginTop: "1px" }}
                    >
                      <path d="M5 21V7l8-4v18" />
                      <path d="M19 21V11l-6-4" />
                      <path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01" />
                    </svg>
                    <div>
                      <span
                        style={{
                          font: "700 12px var(--font-mono)",
                          color: r.deep,
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        {r.gateLabel}
                      </span>
                      <div
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.5,
                          color: "var(--fg-2)",
                          marginTop: "3px",
                        }}
                      >
                        {r.gate}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
