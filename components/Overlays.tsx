"use client";

import { useEffect, useMemo, useState } from "react";
import { ANCHORS, BADGES, COMPS, LADDER, LESSONS } from "@/lib/data";
import type { Competency, Tone } from "@/lib/types";

const checkIcon = (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3.2}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const dotsIcon = (
  <svg
    width={12}
    height={12}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    strokeLinecap="round"
  >
    <path d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
);

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

interface QuizState {
  id: string;
  started: boolean;
  answers: Record<number, number>;
  submitted: boolean;
}

interface OverlaysProps {
  compCode: string | null;
  onCloseDrawer: () => void;
  badgeIdx: number | null;
  onCloseBadge: () => void;
  quizLessonId: string | null;
  onCloseQuiz: () => void;
}

export function Overlays({
  compCode,
  onCloseDrawer,
  badgeIdx,
  onCloseBadge,
  quizLessonId,
  onCloseQuiz,
}: OverlaysProps) {
  const stop = (e: React.MouseEvent) => e.stopPropagation();

  const drawer = useMemo(() => {
    if (!compCode) return null;
    const c = COMPS.find((x: Competency) => x.code === compCode);
    if (!c) return null;
    const accent =
      c.group === "mindset" ? "var(--brand)" : "var(--iris-deep)";
    const anchors = ANCHORS[c.code] || [];
    const tagStyle =
      c.group === "mindset"
        ? {
            background: "var(--brand-tint)",
            color: "var(--brand)",
            border: "1px solid var(--border)",
          }
        : {
            background: "var(--iris-tint)",
            color: "var(--iris-deep)",
            border: "1px solid var(--glass-brd)",
          };
    const ladder = LADDER.map((l, idx) => {
      const isL2 = l.lv === "L2";
      const locked = isL2 && c.lock;
      return {
        lv: l.lv,
        role: l.role,
        desc: anchors[idx] || l.desc,
        bg: isL2 ? "var(--gold-tint)" : "var(--bg-2)",
        brd: isL2 ? "rgba(252,175,22,.4)" : "var(--border-light)",
        lvCol: isL2 ? "var(--gold-deep)" : accent,
        badgeEl: isL2 ? (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              font: "700 9.5px var(--font-mono)",
              color: "var(--gold-deep)",
              background: "#fff6df",
              padding: "2px 7px",
              borderRadius: "20px",
            }}
          >
            {locked ? "TỐT NGHIỆP · BẮT BUỘC" : "CHUẨN TỐT NGHIỆP"}
          </span>
        ) : null,
      };
    });
    return {
      code: c.code,
      name: c.name,
      en: c.en,
      accent,
      group: c.group === "mindset" ? "Product Mindset" : "Engineering",
      tagStyle,
      points: c.points,
      ladder,
    };
  }, [compCode]);

  const badgeSel = useMemo(() => {
    if (badgeIdx == null) return null;
    const b = BADGES[badgeIdx];
    return {
      label: b.label,
      title: b.title,
      en: b.en,
      criteria: b.criteria,
      tone: toneVal(b.tone),
      tint: toneTint(b.tone),
      grad: toneGrad(b.tone),
      glow: toneGlow(b.tone),
    };
  }, [badgeIdx]);

  // Quiz state
  const [quiz, setQuiz] = useState<QuizState | null>(null);
  useEffect(() => {
    if (quizLessonId) {
      setQuiz({ id: quizLessonId, started: false, answers: {}, submitted: false });
    } else {
      setQuiz(null);
    }
  }, [quizLessonId]);

  const quizVM = useMemo(() => {
    if (!quiz) return null;
    const l = LESSONS.find((x) => x.id === quiz.id) || LESSONS[0];
    const ans = quiz.answers;
    const sub = quiz.submitted;
    const correct = l.quiz.reduce(
      (n, qq, qi) => n + (ans[qi] === qq.a ? 1 : 0),
      0,
    );
    const answeredAll = Object.keys(ans).length === l.quiz.length;
    const pass = correct >= 2;
    const qs = l.quiz.map((qq, qi) => ({
      n: qi + 1,
      q: qq.q,
      opts: qq.opts.map((o, oi) => {
        const chosen = ans[qi] === oi;
        const showCorrect = sub && qq.a === oi;
        const showWrong = sub && chosen && qq.a !== oi;
        let bg = "var(--bg-2)",
          brd = "var(--border-light)",
          dot = "var(--border-hover)",
          dotBg = "transparent",
          mark = null as React.ReactNode;
        if (chosen) {
          brd = "var(--iris)";
          dot = "var(--iris)";
          dotBg = "var(--iris)";
        }
        if (showCorrect) {
          bg = "var(--mint-tint)";
          brd = "var(--mint)";
          dot = "var(--mint)";
          dotBg = "var(--mint)";
          mark = checkIcon;
        }
        if (showWrong) {
          bg = "var(--gap-bg)";
          brd = "var(--gap)";
          dot = "var(--gap)";
          dotBg = "var(--gap)";
        }
        return {
          o,
          mark,
          dot,
          dotBg,
          style: {
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textAlign: "left",
            width: "100%",
            padding: "12px 14px",
            borderRadius: "11px",
            cursor: sub ? "default" : "pointer",
            transition: "all .2s",
            background: bg,
            border: `1.5px solid ${brd}`,
          } as React.CSSProperties,
        };
      }),
    }));
    return {
      title: l.title,
      intro: !quiz.started,
      started: quiz.started,
      tldr: l.tldr.map((x, i) => ({ n: i + 1, x })),
      qs,
      showResult: sub,
      canSubmit: answeredAll && !sub,
      correct,
      total: l.quiz.length,
      resultStyle: {
        marginTop: "20px",
        padding: "16px 18px",
        borderRadius: "14px",
        background: pass ? "var(--mint-tint)" : "var(--gap-bg)",
        border: pass
          ? "1px solid rgba(16,185,129,.3)"
          : "1px solid rgba(239,68,68,.25)",
      } as React.CSSProperties,
      resultIcon: pass ? checkIcon : dotsIcon,
      resultIconBg: pass ? "var(--mint)" : "var(--gap)",
      resultFg: pass ? "var(--mint-deep)" : "var(--gap)",
      resultTitle: pass ? "Đạt — đã mở khoá" : "Chưa đạt",
      resultNote: pass
        ? "Bạn đã sẵn sàng vào buổi live."
        : "Cần đúng tối thiểu 2/3 câu, thử lại nhé.",
    };
  }, [quiz]);

  const answerQuiz = (qi: number, oi: number) =>
    setQuiz((s) =>
      s && !s.submitted
        ? { ...s, answers: { ...s.answers, [qi]: oi } }
        : s,
    );
  const startQuiz = () => setQuiz((s) => (s ? { ...s, started: true } : s));
  const submitQuiz = () => setQuiz((s) => (s ? { ...s, submitted: true } : s));
  const retryQuiz = () =>
    setQuiz((s) => (s ? { ...s, answers: {}, submitted: false } : s));

  return (
    <>
      {drawer && (
        <>
          <div
            onClick={onCloseDrawer}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 80,
              background: "rgba(10,11,20,.5)",
              backdropFilter: "blur(3px)",
              animation: "dcOverlay .25s var(--ease-out)",
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              zIndex: 81,
              width: "min(500px,94vw)",
              background: "var(--card)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)",
              overflowY: "auto",
              animation: "dcDrawer .3s var(--ease-out)",
            }}
          >
            <div style={{ padding: "28px 30px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "14px",
                }}
              >
                <div>
                  <span className="tag tag-lg" style={drawer.tagStyle}>
                    {drawer.group}
                  </span>
                  <div
                    style={{
                      font: "700 11px var(--font-mono)",
                      letterSpacing: ".08em",
                      color: drawer.accent,
                      marginTop: "14px",
                    }}
                  >
                    {drawer.code}
                  </div>
                  <h2
                    style={{
                      font: "700 23px/1.25 var(--font-brand)",
                      margin: "5px 0 3px",
                      color: "var(--fg-1)",
                    }}
                  >
                    {drawer.name}
                  </h2>
                  <div
                    style={{
                      font: "500 12.5px var(--font-mono)",
                      color: "var(--fg-3)",
                    }}
                  >
                    {drawer.en}
                  </div>
                </div>
                <button
                  onClick={onCloseDrawer}
                  className="hov-border"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "11px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-2)",
                    color: "var(--fg-2)",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                    flex: "none",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div
                style={{
                  font: "700 11px var(--font-mono)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  margin: "26px 0 12px",
                }}
              >
                Biểu hiện chính
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {drawer.points.map((pt) => (
                  <div
                    key={pt}
                    style={{
                      display: "flex",
                      gap: "11px",
                      padding: "12px 15px",
                      background: "var(--bg-2)",
                      border: "1px solid var(--border-light)",
                      borderRadius: "12px",
                    }}
                  >
                    <span
                      style={{
                        color: drawer.accent,
                        flex: "none",
                        marginTop: "1px",
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
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
                    <span
                      style={{
                        fontSize: "13.5px",
                        lineHeight: 1.5,
                        color: "var(--fg-1)",
                      }}
                    >
                      {pt}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  font: "700 11px var(--font-mono)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  margin: "26px 0 12px",
                }}
              >
                Biểu hiện hành vi theo cấp độ
              </div>
              <p
                style={{
                  fontSize: "11.5px",
                  lineHeight: 1.5,
                  color: "var(--fg-3)",
                  margin: "-4px 0 12px",
                }}
              >
                L1–L2 là trọng tâm đào tạo; L3–L5 là khung tham chiếu sự nghiệp
                (career ladder). Chuẩn tốt nghiệp = đạt L2.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {drawer.ladder.map((l) => (
                  <div
                    key={l.lv}
                    style={{
                      display: "flex",
                      gap: "14px",
                      padding: "15px 16px",
                      background: l.bg,
                      border: `1px solid ${l.brd}`,
                      borderRadius: "14px",
                    }}
                  >
                    <div
                      style={{
                        font: "800 15px var(--font-impact)",
                        color: l.lvCol,
                        flex: "none",
                        width: "30px",
                      }}
                    >
                      {l.lv}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            font: "700 13.5px var(--font-brand)",
                            color: "var(--fg-1)",
                          }}
                        >
                          {l.role}
                        </span>
                        {l.badgeEl}
                      </div>
                      <div
                        style={{
                          fontSize: "12.5px",
                          lineHeight: 1.5,
                          color: "var(--fg-2)",
                          marginTop: "4px",
                        }}
                      >
                        {l.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {badgeSel && (
        <div
          onClick={onCloseBadge}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "rgba(10,11,20,.55)",
            backdropFilter: "blur(4px)",
            animation: "dcOverlay .25s var(--ease-out)",
          }}
        >
          <div
            onClick={stop}
            style={{
              width: "min(460px,100%)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              animation: "dcPop .3s var(--ease-out)",
            }}
          >
            <div style={{ height: "10px", background: badgeSel.grad }} />
            <div style={{ padding: "30px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "18px",
                    background: badgeSel.tint,
                    display: "grid",
                    placeItems: "center",
                    color: badgeSel.tone,
                    boxShadow: badgeSel.glow,
                  }}
                >
                  <svg
                    width="32"
                    height="32"
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
                <button
                  onClick={onCloseBadge}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border: "1px solid var(--border)",
                    background: "var(--bg-2)",
                    color: "var(--fg-2)",
                    cursor: "pointer",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.2}
                    strokeLinecap="round"
                  >
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <span
                style={{
                  font: "800 12px var(--font-mono)",
                  color: badgeSel.tone,
                  background: badgeSel.tint,
                  padding: "4px 10px",
                  borderRadius: "20px",
                  display: "inline-block",
                  marginTop: "18px",
                }}
              >
                {badgeSel.label}
              </span>
              <h2
                style={{
                  font: "700 22px/1.25 var(--font-brand)",
                  margin: "12px 0 3px",
                  color: "var(--fg-1)",
                }}
              >
                {badgeSel.title}
              </h2>
              <div
                style={{
                  font: "500 12.5px var(--font-mono)",
                  color: "var(--fg-3)",
                }}
              >
                {badgeSel.en}
              </div>
              <div
                style={{
                  font: "700 11px var(--font-mono)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--fg-3)",
                  margin: "22px 0 8px",
                }}
              >
                Tiêu chuẩn nghiệm thu
              </div>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--fg-2)",
                  margin: "0 0 20px",
                }}
              >
                {badgeSel.criteria}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "12px 15px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--border-light)",
                  borderRadius: "12px",
                  font: "500 12.5px var(--font-mono)",
                  color: "var(--iris-deep)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                </svg>
                Tài liệu tham chiếu: progression_ladder.md
              </div>
            </div>
          </div>
        </div>
      )}

      {quizVM && (
        <div
          onClick={onCloseQuiz}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 90,
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background: "rgba(10,11,20,.6)",
            backdropFilter: "blur(5px)",
            animation: "dcOverlay .25s var(--ease-out)",
            overflowY: "auto",
          }}
        >
          <div
            onClick={stop}
            style={{
              width: "min(600px,100%)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "22px",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              animation: "dcPop .3s var(--ease-out)",
              margin: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 26px",
                borderBottom: "1px solid var(--border-light)",
              }}
            >
              <div>
                <div
                  style={{
                    font: "700 11px var(--font-mono)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--iris-deep)",
                  }}
                >
                  Làm test pre-read
                </div>
                <div
                  style={{
                    font: "700 16px var(--font-brand)",
                    color: "var(--fg-1)",
                    marginTop: "3px",
                  }}
                >
                  {quizVM.title}
                </div>
              </div>
              <button
                onClick={onCloseQuiz}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-2)",
                  color: "var(--fg-2)",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center",
                  flex: "none",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ padding: "26px", maxHeight: "70vh", overflowY: "auto" }}>
              {quizVM.intro && (
                <div style={{ animation: "dcFade .3s var(--ease-out)" }}>
                  <div
                    style={{
                      font: "700 12px var(--font-mono)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "var(--fg-1)",
                      marginBottom: "14px",
                    }}
                  >
                    TL;DR — 5 điểm cốt lõi cần nhớ
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      marginBottom: "22px",
                    }}
                  >
                    {quizVM.tldr.map((t) => (
                      <div
                        key={t.n}
                        style={{ display: "flex", gap: "13px", alignItems: "flex-start" }}
                      >
                        <span
                          style={{
                            width: "26px",
                            height: "26px",
                            borderRadius: "50%",
                            background: "var(--iris)",
                            color: "#fff",
                            font: "800 13px var(--font-impact)",
                            display: "grid",
                            placeItems: "center",
                            flex: "none",
                          }}
                        >
                          {t.n}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            lineHeight: 1.55,
                            color: "var(--fg-2)",
                            paddingTop: "2px",
                          }}
                        >
                          {t.x}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "15px 18px",
                      background: "var(--iris-tint)",
                      border: "1px solid var(--glass-brd)",
                      borderRadius: "14px",
                      marginBottom: "22px",
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
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    <span
                      style={{
                        fontSize: "13.5px",
                        lineHeight: 1.5,
                        color: "var(--iris-deep)",
                      }}
                    >
                      <b>Quiz khởi động (10 câu)</b> — Trả lời đúng tối thiểu 2/3
                      câu để mở khóa.
                    </span>
                  </div>
                  <button
                    className="cta cta-primary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={startQuiz}
                  >
                    Bắt đầu làm quiz
                  </button>
                </div>
              )}

              {quizVM.started && (
                <div style={{ animation: "dcFade .3s var(--ease-out)" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {quizVM.qs.map((q) => (
                      <div key={q.n}>
                        <div
                          style={{
                            font: "600 14.5px/1.4 var(--font-brand)",
                            color: "var(--fg-1)",
                            marginBottom: "12px",
                          }}
                        >
                          <span style={{ color: "var(--iris-deep)" }}>
                            Câu {q.n}.
                          </span>{" "}
                          {q.q}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          {q.opts.map((o, oi) => (
                            <button
                              key={oi}
                              onClick={() => answerQuiz(q.n - 1, oi)}
                              className="hov-iris"
                              style={o.style}
                            >
                              <span
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  borderRadius: "50%",
                                  border: `2px solid ${o.dot}`,
                                  background: o.dotBg,
                                  display: "grid",
                                  placeItems: "center",
                                  flex: "none",
                                  color: "#fff",
                                }}
                              >
                                {o.mark}
                              </span>
                              <span
                                style={{
                                  fontSize: "13.5px",
                                  lineHeight: 1.45,
                                  color: "var(--fg-1)",
                                }}
                              >
                                {o.o}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {quizVM.showResult && (
                    <div style={quizVM.resultStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            background: quizVM.resultIconBg,
                            color: "#fff",
                            display: "grid",
                            placeItems: "center",
                            flex: "none",
                          }}
                        >
                          {quizVM.resultIcon}
                        </span>
                        <div>
                          <div
                            style={{
                              font: "800 18px var(--font-impact)",
                              color: quizVM.resultFg,
                            }}
                          >
                            {quizVM.resultTitle}
                          </div>
                          <div style={{ fontSize: "13px", color: "var(--fg-2)" }}>
                            Đúng {quizVM.correct}/{quizVM.total} câu —{" "}
                            {quizVM.resultNote}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
                    {quizVM.canSubmit && (
                      <button
                        className="cta cta-primary"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={submitQuiz}
                      >
                        Nộp bài
                      </button>
                    )}
                    {quizVM.showResult && (
                      <button
                        className="cta cta-secondary"
                        style={{ flex: 1, justifyContent: "center" }}
                        onClick={retryQuiz}
                      >
                        Làm lại
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}