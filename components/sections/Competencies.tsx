"use client";

import { COMPS } from "@/lib/data";
import type { Competency } from "@/lib/types";

interface CompetenciesProps {
  onOpen: (code: string) => void;
}

const compAccent = (c: Competency) =>
  c.group === "mindset" ? "var(--brand)" : "var(--iris-deep)";

const groups = [
  {
    tag: "Product Mindset · 43%",
    meta: "3 năng lực nền tảng",
    tagStyle: {
      background: "var(--brand-tint)",
      color: "var(--brand)",
      border: "1px solid var(--border)",
    } as React.CSSProperties,
    items: COMPS.filter((c) => c.group === "mindset"),
  },
  {
    tag: "Engineering · 57%",
    meta: "4 năng lực kỹ thuật",
    tagStyle: {
      background: "var(--iris-tint)",
      color: "var(--iris-deep)",
      border: "1px solid var(--glass-brd)",
    } as React.CSSProperties,
    items: COMPS.filter((c) => c.group === "eng"),
  },
];

export function Competencies({ onOpen }: CompetenciesProps) {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow iris">Khung năng lực · Phiên bản 2.0</span>
      <h1
        style={{
          font: "700 clamp(26px,3.4vw,38px)/1.15 var(--font-impact)",
          letterSpacing: "-.02em",
          margin: "16px 0 8px",
          color: "var(--fg-1)",
        }}
      >
        Khung năng lực cốt lõi — <em className="em-accent">Product Builder</em>
      </h1>
      <p
        style={{
          maxWidth: "720px",
          color: "var(--fg-2)",
          fontSize: "15.5px",
          margin: "0 0 12px",
        }}
      >
        Bảy năng lực chia hai nhóm. Nhấp vào từng năng lực để xem biểu hiện hành
        vi theo 5 cấp độ L1–L5. Biểu tượng khóa cho biết tiêu chí bắt buộc phải
        đạt ở L2 để tốt nghiệp.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "24px",
          marginTop: "26px",
        }}
      >
        {groups.map((grp) => (
          <div key={grp.tag}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "14px",
              }}
            >
              <span className="tag tag-lg" style={grp.tagStyle}>
                {grp.tag}
              </span>
              <span
                style={{
                  font: "600 13px var(--font-mono)",
                  color: "var(--fg-3)",
                }}
              >
                {grp.meta}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {grp.items.map((c) => {
                const accent = compAccent(c);
                return (
                  <button
                    key={c.code}
                    onClick={() => onOpen(c.code)}
                    className="hov-lift-md-dyn"
                    style={
                      {
                        textAlign: "left",
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "16px",
                        boxShadow: "var(--shadow-sm)",
                        padding: "18px 20px",
                        cursor: "pointer",
                        transition:
                          "transform .18s var(--ease-out),box-shadow .18s,border-color .3s,background-color .3s",
                        display: "block",
                        width: "100%",
                        "--hov-border": accent,
                      } as React.CSSProperties
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          font: "700 11px var(--font-mono)",
                          letterSpacing: ".08em",
                          color: accent,
                        }}
                      >
                        {c.code}
                      </span>
                      {c.lock && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            font: "700 10px var(--font-mono)",
                            color: "var(--gold-deep)",
                            background: "var(--gold-tint)",
                            padding: "3px 8px",
                            borderRadius: "20px",
                          }}
                        >
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                          >
                            <rect width="18" height="11" x="3" y="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          BẮT BUỘC L2
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        font: "700 17px/1.3 var(--font-brand)",
                        margin: "10px 0 3px",
                        color: "var(--fg-1)",
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        font: "500 12.5px var(--font-mono)",
                        color: "var(--fg-3)",
                      }}
                    >
                      {c.en}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        marginTop: "14px",
                        font: "600 12.5px var(--font-body)",
                        color: accent,
                      }}
                    >
                      Xem biểu hiện L1–L5
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}