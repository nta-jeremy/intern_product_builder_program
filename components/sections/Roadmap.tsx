"use client";

import { useMemo, useState } from "react";
import { LESSONS, ROADMAP } from "@/lib/data";
import type { Block, RoadmapItem, Tone } from "@/lib/types";
import { segTab } from "@/lib/nav";

type RmTab = "timeline" | "learn";

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

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return (
        <p
          style={{
            fontSize: "15px",
            lineHeight: 1.72,
            color: "var(--fg-2)",
            margin: "0 0 16px",
          }}
        >
          {b.x}
        </p>
      );
    case "h":
      return (
        <h3
          id={`sec-${b.x}`}
          style={{
            font: "700 19px/1.3 var(--font-brand)",
            color: "var(--fg-1)",
            margin: "26px 0 12px",
            scrollMarginTop: "88px",
          }}
        >
          {b.x}
        </h3>
      );
    case "ul":
      return (
        <ul
          style={{
            margin: "0 0 16px",
            padding: "0 0 0 4px",
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "9px",
          }}
        >
          {b.items.map((li, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                fontSize: "14.5px",
                lineHeight: 1.6,
                color: "var(--fg-2)",
              }}
            >
              <span
                style={{
                  color: "var(--iris)",
                  flex: "none",
                  marginTop: "2px",
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span>{li}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote
          style={{
            margin: "0 0 18px",
            padding: "14px 20px",
            borderLeft: "3px solid var(--gold)",
            background: "var(--gold-tint)",
            borderRadius: "0 12px 12px 0",
            fontSize: "15px",
            lineHeight: 1.6,
            color: "var(--fg-1)",
            fontStyle: "italic",
          }}
        >
          {b.x}
        </blockquote>
      );
    case "code":
      return (
        <pre
          style={{
            margin: "0 0 18px",
            padding: "16px 18px",
            background: "var(--bg-ink)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            overflowX: "auto",
          }}
        >
          <code
            style={{
              font: "500 12.5px/1.6 var(--font-mono)",
              color: "#c9cbff",
              whiteSpace: "pre",
            }}
          >
            {b.x}
          </code>
        </pre>
      );
  }
}

interface RoadmapProps {
  onOpenQuiz: () => void;
  onLessonChange?: (id: string) => void;
}

export function Roadmap({ onOpenQuiz, onLessonChange }: RoadmapProps) {
  const [rmTab, setRmTab] = useState<RmTab>("timeline");
  const [lessonId, setLessonId] = useState("I1.1");

  const selectLesson = (id: string) => {
    setLessonId(id);
    onLessonChange?.(id);
  };

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

  const lessonNav = useMemo(
    () =>
      ROADMAP.map((ro) => ({
        label: `${ro.code} · ${ro.title}`,
        items: LESSONS.filter((l) => l.lv === ro.code),
      })),
    [],
  );

  const cl = LESSONS.find((l) => l.id === lessonId) || LESSONS[0];
  const ro = ROADMAP.find((r) => r.code === cl.lv)!;
  const toc = cl.blocks
    .map((b, i) => (b.t === "h" ? { text: b.x, anchor: `sec-${b.x}` } : null))
    .filter(Boolean) as { text: string; anchor: string }[];

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow iris">Lộ trình &amp; Học tập</span>
      <div
        style={{
          display: "inline-flex",
          gap: "4px",
          padding: "4px",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          margin: "16px 0 26px",
        }}
      >
        <button onClick={() => setRmTab("timeline")} style={segTab(rmTab === "timeline")}>
          Lộ trình đào tạo
        </button>
        <button onClick={() => setRmTab("learn")} style={segTab(rmTab === "learn")}>
          Không gian học tập
        </button>
      </div>

      {rmTab === "timeline" && (
        <div style={{ animation: "dcFade .35s var(--ease-out)" }}>
          <h1
            style={{
              font: "700 clamp(24px,3.2vw,34px)/1.18 var(--font-impact)",
              letterSpacing: "-.02em",
              margin: "0 0 8px",
              color: "var(--fg-1)",
            }}
          >
            Bốn giai đoạn · 14 tuần — tốt nghiệp ở Level 2 (Product Builder)
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
            một Gate — vượt qua nhờ một deliverable thực tế được duyệt, không dựa
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
                        border: `1px solid ${r.gateBrd}`,
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
      )}

      {rmTab === "learn" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(220px,0.8fr) minmax(320px,2fr)",
            gap: "22px",
            alignItems: "start",
            animation: "dcFade .35s var(--ease-out)",
          }}
        >
          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-sm)",
              padding: "14px",
              position: "sticky",
              top: "88px",
              maxHeight: "calc(100vh - 108px)",
              overflowY: "auto",
            }}
          >
            {lessonNav.map((lvl) => (
              <div key={lvl.label} style={{ marginBottom: "12px" }}>
                <div
                  style={{
                    font: "700 10.5px var(--font-mono)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--fg-3)",
                    padding: "6px 10px",
                  }}
                >
                  {lvl.label}
                </div>
                {lvl.items.map((ls) => {
                  const on = ls.id === lessonId;
                  return (
                    <button
                      key={ls.id}
                      onClick={() => selectLesson(ls.id)}
                      className="hov-bg-2"
                      style={{
                        display: "flex",
                        gap: "9px",
                        alignItems: "flex-start",
                        width: "100%",
                        textAlign: "left",
                        padding: "9px 10px",
                        borderRadius: "9px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color .2s",
                        background: on ? "var(--brand-tint)" : "transparent",
                        color: on ? "var(--brand)" : "var(--fg-2)",
                        fontWeight: on ? 600 : 500,
                      }}
                    >
                      <span
                        style={{
                          font: "700 10.5px var(--font-mono)",
                          color: on ? "var(--brand)" : "var(--fg-3)",
                          flex: "none",
                        }}
                      >
                        {ls.id}
                      </span>
                      <span style={{ fontSize: "12.5px", lineHeight: 1.35 }}>
                        {ls.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-sm)",
              padding: "clamp(22px,3vw,36px)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                font: "600 12px var(--font-mono)",
                color: "var(--fg-3)",
                flexWrap: "wrap",
              }}
            >
              <span>Học</span>
              <span style={{ opacity: 0.5 }}>›</span>
              <span>{ro.code} · {ro.title}</span>
              <span style={{ opacity: 0.5 }}>›</span>
              <span style={{ color: "var(--brand)" }}>{cl.id}</span>
            </div>
            <h1
              style={{
                font: "700 clamp(23px,3vw,30px)/1.2 var(--font-impact)",
                letterSpacing: "-.02em",
                margin: "12px 0 6px",
                color: "var(--fg-1)",
              }}
            >
              {cl.title}
            </h1>
            <p
              style={{
                color: "var(--fg-2)",
                fontSize: "15px",
                margin: "0 0 20px",
              }}
            >
              {cl.sub}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 18px",
                background: "var(--iris-tint)",
                border: "1px solid var(--glass-brd)",
                borderRadius: "14px",
                flexWrap: "wrap",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--iris-deep)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ flex: "none" }}
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div
                  style={{
                    font: "700 13.5px var(--font-brand)",
                    color: "var(--iris-deep)",
                  }}
                >
                  Pre-read bắt buộc (1 phút) trước buổi live
                </div>
                <div
                  style={{
                    fontSize: "12.5px",
                    color: "var(--fg-2)",
                    marginTop: "2px",
                  }}
                >
                  Mentor sẽ hỏi quiz ở đầu buổi.
                </div>
              </div>
              <button
                className="cta cta-primary"
                style={{ height: "42px", padding: "0 22px", fontSize: "14px" }}
                onClick={onOpenQuiz}
              >
                Làm test
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                margin: "20px 0",
                font: "500 12px var(--font-mono)",
                color: "var(--fg-3)",
              }}
            >
              <span>Buổi: {cl.id}</span>
              <span>Giai đoạn: {ro.code} · {ro.title}</span>
              <span>Đọc ~{cl.read}</span>
            </div>

            <div
              style={{
                background: "var(--bg-2)",
                border: "1px solid var(--border-light)",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  font: "700 11px var(--font-mono)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  marginBottom: "8px",
                }}
              >
                Mục lục
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {toc.map((t) => (
                  <a
                    key={t.anchor}
                    href={`#${t.anchor}`}
                    className="hov-underline"
                    style={{
                      fontSize: "13.5px",
                      color: "var(--iris-deep)",
                      textDecoration: "none",
                    }}
                  >
                    {t.text}
                  </a>
                ))}
              </div>
            </div>

            <article style={{ maxWidth: "none" }}>
              {cl.blocks.map((b, i) => (
                <BlockView key={i} b={b} />
              ))}
            </article>
          </div>
        </div>
      )}
    </main>
  );
}