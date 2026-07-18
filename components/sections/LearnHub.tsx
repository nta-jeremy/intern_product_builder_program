"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LESSONS, ROADMAP } from "@/lib/data";
import { toneDeep, toneTint } from "@/lib/tone";
import { LearnHubCalendar } from "./LearnHubCalendar";

const LESSON_IDS = LESSONS.map((l) => l.id);
const DEFAULT_LESSON_ID = LESSON_IDS[0];

type LearnMode = "carousel" | "calendar";

export function LearnHub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardParam = searchParams.get("card");
  const initialIdx = Math.max(0, LESSON_IDS.indexOf(cardParam ?? ""));
  const [activeIdx, setActiveIdx] = useState(initialIdx);
  const [mode, setMode] = useState<LearnMode>("carousel");

  useEffect(() => {
    const idx = LESSON_IDS.indexOf(cardParam ?? "");
    setActiveIdx(idx >= 0 ? idx : 0);
  }, [cardParam]);

  useEffect(() => {
    const currentCard = searchParams.get("card");
    const desiredCard = LESSON_IDS[activeIdx] === DEFAULT_LESSON_ID ? null : LESSON_IDS[activeIdx];
    if (currentCard === desiredCard) return;
    const params = new URLSearchParams(searchParams.toString());
    if (desiredCard) params.set("card", desiredCard);
    else params.delete("card");
    const qs = params.toString();
    router.replace(qs ? `/learn-hub?${qs}` : "/learn-hub", { scroll: false });
  }, [activeIdx, router, searchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (mode !== "carousel") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIdx((prev) => Math.min(LESSONS.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode]);

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
        <span className="s-eyebrow iris">Không gian học tập &amp; Thực hành</span>
      </header>

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

        <div
          role="tablist"
          aria-label="Chọn cách xem lộ trình"
          style={{
            display: "inline-flex",
            background: "var(--bg-2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "4px",
            gap: "2px",
          }}
        >
          {(["carousel", "calendar"] as const).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={active ? "true" : "false"}
                onClick={() => setMode(m)}
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  font: "700 12.5px var(--font-brand)",
                  letterSpacing: ".01em",
                  background: active ? "var(--card)" : "transparent",
                  color: active ? "var(--fg-1)" : "var(--fg-2)",
                  boxShadow: active ? "var(--shadow-sm)" : "none",
                  transition: "background .18s var(--ease-out), color .18s, box-shadow .18s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {m === "carousel" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="7" width="18" height="10" rx="2" />
                    <path d="M7 7v10M17 7v10" opacity=".4" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <rect x="3" y="4" width="18" height="17" rx="2" />
                    <path d="M3 9h18M8 2v4M16 2v4" />
                  </svg>
                )}
                {m === "carousel" ? "Carousel" : "Calendar"}
              </button>
            );
          })}
        </div>

        {mode === "calendar" ? (
          <LearnHubCalendar
            lessons={LESSONS}
            roadmap={ROADMAP}
            activeId={LESSON_IDS[activeIdx]}
            onSelect={(id) => {
              const idx = LESSON_IDS.indexOf(id);
              if (idx < 0) return;
              setActiveIdx(idx);
              router.push(`/learn/${id}`);
            }}
          />
        ) : (
          <>
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
          <button
            onClick={() => setActiveIdx((prev) => Math.max(0, prev - 1))}
            disabled={activeIdx === 0}
            aria-label="Buổi trước"
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
                opacity = 0.85;
                zIndex = 5;
                pointerEvents = "auto";
              } else if (diff === 1) {
                transform = "translate3d(55%, 0, -100px) scale(0.83) rotateY(-24deg)";
                opacity = 0.85;
                zIndex = 5;
                pointerEvents = "auto";
              } else if (diff === -2) {
                transform = "translate3d(-95%, 0, -200px) scale(0.68) rotateY(38deg)";
                opacity = 0.12;
                zIndex = 3;
              } else if (diff === 2) {
                transform = "translate3d(95%, 0, -200px) scale(0.68) rotateY(-38deg)";
                opacity = 0.12;
                zIndex = 3;
              }

              const roadmapItem = ROADMAP.find((r) => r.code === ls.lv);
              const tone = roadmapItem ? roadmapItem.tone : "iris";
              const badgeColor = toneDeep(tone);
              const bgTint = toneTint(tone);

              return (
                <div
                  key={ls.id}
                  className="lc-card"
                  data-active={diff === 0 ? "true" : "false"}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("a[href^='/learn/']")) return;
                    if (diff !== 0) setActiveIdx(idx);
                  }}
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
                    cursor: diff === 0 ? "default" : "pointer",
                  }}
                >
                  <div>
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


          <button
            onClick={() => setActiveIdx((prev) => Math.min(LESSONS.length - 1, prev + 1))}
            disabled={activeIdx === LESSONS.length - 1}
            aria-label="Buổi tiếp theo"
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

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              maxWidth: "80%",
              alignItems: "center",
            }}
          >
            {LESSONS.map((_, idx) => {
              const on = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Buổi ${idx + 1}`}
                  aria-current={on ? "true" : undefined}
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
          <span
            style={{
              font: "500 11px var(--font-mono)",
              color: "var(--fg-2)",
              opacity: 0.6,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            ← / → để chuyển buổi
          </span>
        </div>
          </>
        )}
      </div>
    </main>
  );
}
