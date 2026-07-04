"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/data";
import type { Product } from "@/lib/types";

function prioStyle(p: Product): React.CSSProperties {
  return p.prio === "CAO"
    ? {
        background: "var(--gap-bg)",
        color: "var(--gap)",
        border: "1px solid rgba(239,68,68,.22)",
      }
    : {
        background: "var(--plan-bg)",
        color: "var(--gold-deep)",
        border: "1px solid rgba(245,158,11,.22)",
      };
}

function StarEls({ n }: { n: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[0, 1, 2].map((i) => {
        const on = i < n;
        return (
          <svg
            key={i}
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill={on ? "var(--gold)" : "none"}
            stroke={on ? "var(--gold)" : "var(--border-hover)"}
            strokeWidth={2}
          >
            <path d="M11.5 2.3a.5.5 0 0 1 .9 0l2.4 4.8 5.3.8a.5.5 0 0 1 .3.85l-3.8 3.7.9 5.3a.5.5 0 0 1-.77.53L12 16.6l-4.7 2.5a.5.5 0 0 1-.77-.53l.9-5.3-3.8-3.7a.5.5 0 0 1 .3-.85l5.3-.8z" />
          </svg>
        );
      })}
    </span>
  );
}

export function Products() {
  const [sel, setSel] = useState(0);
  const cp = PRODUCTS[sel];

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow iris">Thực chiến · Trải nghiệm AI-First</span>
      <h1
        style={{
          font: "700 clamp(26px,3.4vw,38px)/1.15 var(--font-impact)",
          letterSpacing: "-.02em",
          margin: "16px 0 8px",
          color: "var(--fg-1)",
        }}
      >
        Thực chiến <em className="em-accent">4 sản phẩm</em>
      </h1>
      <p
        style={{
          maxWidth: "720px",
          color: "var(--fg-2)",
          fontSize: "15.5px",
          margin: "0 0 26px",
        }}
      >
        Chọn một sản phẩm để xem mô tả, stakeholders và bảng tính năng MVP kèm
        tiêu chí nghiệm thu.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: "16px",
        }}
      >
        {PRODUCTS.map((p, i) => {
          const selected = i === sel;
          return (
            <button
              key={p.roman}
              onClick={() => setSel(i)}
              className="hov-lift-md"
              style={{
                textAlign: "left",
                background: "var(--card)",
                borderWidth: selected ? "2px" : "1px",
                borderStyle: "solid",
                borderColor: selected ? "var(--brand)" : "var(--border)",
                borderRadius: "16px",
                boxShadow: selected
                  ? "var(--shadow-md)"
                  : "var(--shadow-sm)",
                padding: selected ? "17px 19px" : "18px 20px",
                cursor: "pointer",
                transition:
                  "transform .18s var(--ease-out),box-shadow .3s,border-color .3s,background-color .3s",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}
              >
                <span className="tag" style={prioStyle(p)}>
                  UT: {p.prio}
                </span>
                <StarEls n={p.stars} />
              </div>
              <div
                style={{
                  font: "800 13px var(--font-mono)",
                  color: "var(--brand)",
                  marginTop: "16px",
                }}
              >
                DỰ ÁN {p.roman}
              </div>
              <div
                style={{
                  font: "700 17px/1.28 var(--font-brand)",
                  margin: "6px 0 4px",
                  color: "var(--fg-1)",
                  minHeight: "44px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.name}
              </div>
              <div
                style={{
                  font: "500 12px/1.4 var(--font-mono)",
                  color: "var(--fg-3)",
                  minHeight: "34px",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {p.en}
              </div>
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(280px,0.9fr) minmax(340px,1.4fr)",
          gap: "22px",
          marginTop: "26px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            boxShadow: "var(--shadow-sm)",
            padding: "26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span
              style={{
                font: "800 13px var(--font-mono)",
                color: "var(--brand)",
              }}
            >
              DỰ ÁN {cp.roman}
            </span>
            <span className="tag" style={prioStyle(cp)}>
              UT: {cp.prio}
            </span>
          </div>
          <h2
            style={{
              font: "700 22px/1.25 var(--font-brand)",
              margin: "12px 0 4px",
              color: "var(--fg-1)",
            }}
          >
            {cp.name}
          </h2>
          <div
            style={{
              font: "500 12.5px var(--font-mono)",
              color: "var(--fg-3)",
              marginBottom: "16px",
            }}
          >
            {cp.en}
          </div>
          <p
            style={{
              color: "var(--fg-2)",
              fontSize: "14.5px",
              lineHeight: 1.6,
              margin: "0 0 22px",
            }}
          >
            {cp.desc}
          </p>
          <div
            style={{
              font: "700 11px var(--font-mono)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
              marginBottom: "10px",
            }}
          >
            Người dùng chính
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {cp.stakeholders.map((sh) => (
              <div
                key={sh}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 14px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--iris)",
                    flex: "none",
                  }}
                />
                <span
                  style={{
                    font: "600 13.5px var(--font-body)",
                    color: "var(--fg-1)",
                  }}
                >
                  {sh}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            boxShadow: "var(--shadow-sm)",
            padding: "8px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "18px 18px 14px" }}>
            <div
              style={{
                font: "700 15px var(--font-brand)",
                color: "var(--fg-1)",
              }}
            >
              Bảng tính năng MVP &amp; tiêu chí nghiệm thu
            </div>
          </div>
          <div style={{ overflowX: "auto" }}>
            <div
              role="table"
              style={{
                display: "grid",
                gridTemplateColumns:
                  "minmax(120px, 1fr) minmax(150px, 1.3fr) minmax(150px, 1.3fr) minmax(150px, 1.1fr)",
                minWidth: "570px",
              }}
            >
              {(["Tính năng", "Output", "KPI / Acceptance", "Sign-off"] as const).map(
                (h, idx) => (
                  <div
                    key={h}
                    role="columnheader"
                    style={{
                      background: "var(--bg-2)",
                      textAlign: "left",
                      font: "700 10.5px var(--font-mono)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      color: "var(--fg-3)",
                      padding: "11px 10px",
                      borderTopLeftRadius: idx === 0 ? "8px" : undefined,
                      borderBottomLeftRadius: idx === 0 ? "8px" : undefined,
                      borderTopRightRadius: idx === 3 ? "8px" : undefined,
                      borderBottomRightRadius: idx === 3 ? "8px" : undefined,
                    }}
                  >
                    {h}
                  </div>
                ),
              )}
              {cp.deliverables.map((d, i) => (
                <div key={i} role="row" style={{ display: "contents" }}>
                  <div
                    role="cell"
                    style={{
                      borderTop: "1px solid var(--border-light)",
                      padding: "13px 10px",
                      display: "flex",
                      gap: "8px",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        font: "700 11px var(--font-mono)",
                        color: "var(--iris-deep)",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      style={{
                        font: "600 13px/1.35 var(--font-brand)",
                        color: "var(--fg-1)",
                      }}
                    >
                      {d.feature}
                    </div>
                  </div>
                  <div
                    role="cell"
                    style={{
                      borderTop: "1px solid var(--border-light)",
                      padding: "13px 10px",
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                      color: "var(--fg-2)",
                    }}
                  >
                    {d.output}
                  </div>
                  <div
                    role="cell"
                    style={{
                      borderTop: "1px solid var(--border-light)",
                      padding: "13px 10px",
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                      color: "var(--fg-2)",
                    }}
                  >
                    {d.kpi}
                  </div>
                  <div
                    role="cell"
                    style={{
                      borderTop: "1px solid var(--border-light)",
                      padding: "13px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "5px",
                      }}
                    >
                      {d.sign.map((s) => (
                        <span
                          key={s}
                          style={{
                            font: "600 10px var(--font-mono)",
                            color: "var(--iris-deep)",
                            background: "var(--iris-tint)",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}