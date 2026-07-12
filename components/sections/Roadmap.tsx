"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
            font: "italic 800 17px/1.6 var(--font-serif)",
            color: "var(--fg-1)",
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
  const [activeIdx, setActiveIdx] = useState(0);

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
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "20px",
          margin: "0 0 40px",
        }}
      >
        <span className="s-eyebrow iris">Lộ trình &amp; Học tập</span>
        <div
          role="tablist"
          aria-label="Lộ trình & Kiến thức tập"
          style={{
            display: "inline-flex",
            gap: "6px",
            padding: "6px",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: "14px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <button
            role="tab"
            aria-selected={rmTab === "timeline"}
            onClick={() => setRmTab("timeline")}
            style={segTab(rmTab === "timeline")}
          >
            {rmTab === "timeline" && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 6h16M4 12h10M4 18h7" />
              </svg>
            )}
            Lộ trình đào tạo
          </button>
          <button
            role="tab"
            aria-selected={rmTab === "learn"}
            onClick={() => setRmTab("learn")}
            style={segTab(rmTab === "learn")}
          >
            {rmTab === "learn" && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9.5 12 4l9 5.5-9 5.5L3 9.5Z" />
                <path d="M7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5" />
              </svg>
            )}
            Không gian học tập
          </button>
        </div>
      </header>

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
      )}

      {rmTab === "learn" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            gap: "32px",
            animation: "dcFade .35s var(--ease-out)",
          }}
        >
          {/* Card Giới thiệu lớn từ UI trước đó */}
          <div
            style={{
              width: "100%",
              background: "linear-gradient(135deg, var(--card) 0%, var(--bg-2) 100%)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-sm)",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-50px",
                right: "-50px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "var(--brand-tint)",
                filter: "blur(60px)",
                opacity: 0.5,
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <span className="s-eyebrow iris" style={{ marginBottom: "12px", display: "inline-block" }}>
                Coming Soon
              </span>
              <h2
                style={{
                  font: "700 clamp(24px, 3.5vw, 36px)/1.15 var(--font-impact)",
                  letterSpacing: "-.02em",
                  color: "var(--fg-1)",
                  margin: "0 0 12px",
                }}
              >
                Không gian học tập &amp; Thực hành
              </h2>
              <p
                style={{
                  color: "var(--fg-2)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  maxWidth: "600px",
                  margin: 0,
                }}
              >
                Tích hợp bài giảng, nội dung lý thuyết và bài tập thực hành.
              </p>
            </div>
          </div>

          {/* Tiêu đề phần Lộ trình bài học */}
          <div style={{ textAlign: "center", marginTop: "12px" }}>
            <span
              style={{
                font: "700 10px var(--font-mono)",
                color: "var(--brand)",
                background: "var(--brand-tint)",
                padding: "3px 10px",
                borderRadius: "20px",
                textTransform: "uppercase",
                letterSpacing: ".08em",
                display: "inline-block",
                marginBottom: "8px",
              }}
            >
              Xem trước lộ trình
            </span>
            <h3 style={{ font: "700 20px var(--font-brand)", color: "var(--fg-1)", margin: 0 }}>
              Nội dung các buổi đào tạo sắp tới
            </h3>
          </div>

          {/* Slider Container */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "310px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              perspective: "1000px",
            }}
          >
            {/* Nút điều hướng Trái */}
            <button
              onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
              disabled={activeIdx === 0}
              className="hov-bg-2"
              style={{
                position: "absolute",
                left: "clamp(10px, 4vw, 40px)",
                zIndex: 20,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg-2)",
                display: "grid",
                placeItems: "center",
                cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                opacity: activeIdx === 0 ? 0.3 : 0.8,
                transition: "all 0.2s",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* List Cards */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transformStyle: "preserve-3d",
              }}
            >
              {LESSONS.map((ls, idx) => {
                const diff = idx - activeIdx;
                const absDiff = Math.abs(diff);

                // Chỉ hiển thị các thẻ trong khoảng cách 2 để tối ưu hóa DOM
                if (absDiff > 2) return null;

                let transform = "";
                let opacity = 0;
                let zIndex = 1;
                let pointerEvents: "auto" | "none" = "none";

                if (diff === 0) {
                  transform = "translate3d(0, 0, 0) scale(1) rotateY(0deg)";
                  opacity = 1;
                  zIndex = 10;
                  pointerEvents = "auto";
                } else if (diff === -1) {
                  transform = "translate3d(-55%, 0, -100px) scale(0.83) rotateY(24deg)";
                  opacity = 0.45;
                  zIndex = 5;
                } else if (diff === 1) {
                  transform = "translate3d(55%, 0, -100px) scale(0.83) rotateY(-24deg)";
                  opacity = 0.45;
                  zIndex = 5;
                } else if (diff === -2) {
                  transform = "translate3d(-95%, 0, -200px) scale(0.68) rotateY(38deg)";
                  opacity = 0.12;
                  zIndex = 3;
                } else if (diff === 2) {
                  transform = "translate3d(95%, 0, -200px) scale(0.68) rotateY(-38deg)";
                  opacity = 0.12;
                  zIndex = 3;
                }

                // Tìm thông tin GĐ từ code (GĐ1, GĐ2...) để lấy màu sắc
                const roadmapItem = ROADMAP.find((r) => r.code === ls.lv);
                const tone = roadmapItem ? roadmapItem.tone : "iris";
                const badgeColor = toneDeep(tone);
                const bgTint = toneTint(tone);

                return (
                  <div
                    key={ls.id}
                    style={{
                      position: "absolute",
                      width: "min(400px, 85%)",
                      height: "210px",
                      background: "var(--card)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: diff === 0 ? "var(--brand)" : "var(--border)",
                      borderRadius: "20px",
                      boxShadow: diff === 0 ? "0 12px 36px var(--brand-tint)" : "var(--shadow-sm)",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transform,
                      opacity,
                      zIndex,
                      pointerEvents,
                      transition: "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.45s, border-color 0.3s, box-shadow 0.3s",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <div>
                      {/* Giai đoạn & ID buổi đào tạo */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span
                          style={{
                            font: "700 10.5px var(--font-mono)",
                            color: badgeColor,
                            background: bgTint,
                            padding: "3px 10px",
                            borderRadius: "20px",
                            textTransform: "uppercase",
                            letterSpacing: ".05em",
                          }}
                        >
                          {roadmapItem?.title ? `${ls.lv} · ${roadmapItem.title.split(" & ")[0]}` : ls.lv}
                        </span>
                      </div>

                      {/* Tiêu đề & Sub bài học */}
                      <h3
                        style={{
                          font: "700 17px var(--font-brand)",
                          color: "var(--fg-1)",
                          margin: "14px 0 8px",
                          lineHeight: 1.3,
                        }}
                      >
                        {ls.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.45,
                          color: "var(--fg-2)",
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {ls.sub}
                      </p>
                    </div>

                    {/* Nút Vào học - chỉ hiển thị trên card active */}
                    {diff === 0 && (
                      <Link
                        href={`/learn/${ls.id}`}
                        className="hov-lift-sm"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          marginTop: "14px",
                          padding: "11px 16px",
                          borderRadius: "10px",
                          background: "var(--brand)",
                          color: "#fff",
                          font: "700 13.5px var(--font-brand)",
                          textDecoration: "none",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px var(--brand-tint)",
                          transition: "transform .18s var(--ease-out), box-shadow .18s",
                        }}
                      >
                        Vào học buổi này
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Nút điều hướng Phải */}
            <button
              onClick={() => setActiveIdx((prev) => Math.min(LESSONS.length - 1, prev + 1))}
              disabled={activeIdx === LESSONS.length - 1}
              className="hov-bg-2"
              style={{
                position: "absolute",
                right: "clamp(10px, 4vw, 40px)",
                zIndex: 20,
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                background: "var(--card)",
                color: "var(--fg-2)",
                display: "grid",
                placeItems: "center",
                cursor: activeIdx === LESSONS.length - 1 ? "not-allowed" : "pointer",
                opacity: activeIdx === LESSONS.length - 1 ? 0.3 : 0.8,
                transition: "all 0.2s",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>

          {/* Dots Pagination */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "80%",
              padding: "4px 0",
            }}
          >
            {LESSONS.map((_, idx) => {
              const on = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  style={{
                    width: on ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: on ? "var(--brand)" : "var(--border)",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                    padding: 0,
                  }}
                  title={`Buổi ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      )}
    </main>
  );
}