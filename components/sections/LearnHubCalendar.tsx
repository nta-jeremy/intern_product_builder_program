"use client";

import type { CSSProperties } from "react";
import type { Lesson, RoadmapItem } from "@/lib/types";
import { toneDeep, toneTint } from "@/lib/tone";

type WeekEntry = { week: number; month: 1 | 2 | 3; lessonId: string };

const WEEK_MAP: WeekEntry[] = [
  { week: 1, month: 1, lessonId: "I1.1" },
  { week: 2, month: 1, lessonId: "I1.2" },
  { week: 3, month: 1, lessonId: "I2.1" },
  { week: 4, month: 1, lessonId: "I2.2" },
  { week: 5, month: 2, lessonId: "I2.3" },
  { week: 6, month: 2, lessonId: "I3.1" },
  { week: 7, month: 2, lessonId: "I3.2" },
  { week: 8, month: 2, lessonId: "I3.3" },
  { week: 9, month: 3, lessonId: "I4.1" },
  { week: 10, month: 3, lessonId: "I4.2" },
  { week: 11, month: 3, lessonId: "I4.3" },
  { week: 12, month: 3, lessonId: "I5.1" },
  { week: 13, month: 3, lessonId: "I5.2" },
  { week: 14, month: 3, lessonId: "I5.3" },
];

type GateKind = "gate" | "grad";
type GateMeta = { label: string; kind: GateKind };

const GATE_MAP: Record<string, GateMeta> = {
  "I1.2": { label: "Gate 1", kind: "gate" },
  "I2.3": { label: "Gate 2", kind: "gate" },
  "I3.3": { label: "Gate 3", kind: "gate" },
  "I5.3": { label: "L2", kind: "grad" },
};

const MONTH_META = [
  { month: 1 as const, title: "Tháng 7", meta: "GĐ1 · Nền tảng" },
  { month: 2 as const, title: "Tháng 8", meta: "GĐ2 · Phân tích" },
  { month: 3 as const, title: "Tháng 9", meta: "GĐ3-GĐ4 · Capstone" },
];

interface LearnHubCalendarProps {
  lessons: Lesson[];
  roadmap: RoadmapItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function LearnHubCalendar({
  lessons,
  roadmap,
  activeId,
  onSelect,
}: LearnHubCalendarProps) {
  const lessonById = new Map(lessons.map((l) => [l.id, l]));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "20px",
        width: "100%",
        animation: "dcFade .35s var(--ease-out)",
      }}
    >
      {MONTH_META.map((m) => {
        const weeks = WEEK_MAP.filter((w) => w.month === m.month);
        return (
          <section
            key={m.month}
            style={{
              background: "var(--bg-2)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              minHeight: "100%",
            }}
          >
            <header
              style={{
                paddingBottom: "10px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              <span
                style={{
                  font: "700 14px var(--font-brand)",
                  color: "var(--fg-1)",
                }}
              >
                {m.title}
              </span>
              <span
                style={{
                  font: "500 10px var(--font-mono)",
                  color: "var(--fg-2)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {m.meta}
              </span>
            </header>

            {weeks.map((w) => {
              const ls = lessonById.get(w.lessonId);
              if (!ls) return <div key={w.week} style={{ height: "88px" }} />;
              const roadmapItem = roadmap.find((r) => r.code === ls.lv);
              const tone = roadmapItem ? roadmapItem.tone : "iris";
              const dot = toneDeep(tone);
              const gate = GATE_MAP[ls.id];
              const isActive = ls.id === activeId;
              const titlePadRight = gate ? "28px" : "0";

              return (
                <div
                  key={w.week}
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      flexShrink: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2px",
                    }}
                  >
                    <span
                      style={{
                        font: "700 14px var(--font-brand)",
                        color: "var(--fg-1)",
                        lineHeight: 1,
                      }}
                    >
                      W{w.week}
                    </span>
                    <span
                      style={{
                        font: "500 8px var(--font-mono)",
                        color: "var(--fg-2)",
                        opacity: 0.7,
                        textTransform: "uppercase",
                        letterSpacing: ".08em",
                      }}
                    >
                      T{m.month}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelect(ls.id)}
                    className="lc-cal-card"
                    data-active={isActive ? "true" : "false"}
                    aria-current={isActive ? "true" : undefined}
                    style={{
                      flex: 1,
                      textAlign: "left",
                      background: "var(--card)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: isActive ? "var(--brand)" : "var(--border)",
                      borderRadius: "10px",
                      boxShadow: isActive
                        ? "0 8px 24px var(--brand-tint)"
                        : "none",
                      padding: "12px",
                      minHeight: "88px",
                      cursor: "pointer",
                      transition:
                        "transform .18s var(--ease-out), border-color .18s, box-shadow .18s",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        aria-hidden
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: dot,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          font: "700 10px var(--font-mono)",
                          color: "var(--fg-2)",
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        {ls.id}
                      </span>
                    </div>

                    <h4
                      style={{
                        font: "700 12.5px var(--font-brand)",
                        color: "var(--fg-1)",
                        margin: 0,
                        lineHeight: 1.3,
                        paddingRight: titlePadRight,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ls.title}
                    </h4>

                    <p
                      style={{
                        font: "400 10.5px var(--font-body)",
                        color: "var(--fg-2)",
                        margin: 0,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ls.sub}
                    </p>

                    {gate && (
                      <span
                        style={
                          {
                            position: "absolute",
                            top: "8px",
                            right: "8px",
                            font: "700 9px var(--font-mono)",
                            padding: "2px 6px",
                            borderRadius: "6px",
                            textTransform: "uppercase",
                            letterSpacing: ".04em",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "2px",
                            ...(gate.kind === "grad"
                              ? {
                                  background: "var(--brand)",
                                  color: "#fff",
                                }
                              : {
                                  background: toneTint("gold"),
                                  color: toneDeep("gold"),
                                }),
                          } as CSSProperties
                        }
                      >
                        {gate.kind === "grad" ? "🎓 " : "⛳ "}
                        {gate.label}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}
