"use client";

import { useMemo, useState } from "react";
import {
  FINAL_SEGS,
  GATE_TEXT,
  LEVEL_DESC,
  LEVEL_LABELS,
  LEVEL_MULT,
  SC_ENTRY,
  SC_FINAL,
} from "@/lib/data";
import type { ScoreFinal } from "@/lib/types";
import { segTab } from "@/lib/nav";

type ScTab = "entry" | "final";
type Grades = Record<number, number | undefined>;
type Evidence = Record<number, string>;
type OpenMap = Record<number, boolean>;
type Gates = Record<number, boolean>;

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

export function Scorecard() {
  const [scTab, setScTab] = useState<ScTab>("entry");
  const [scores, setScores] = useState<{ entry: Grades; final: Grades }>({
    entry: {},
    final: {},
  });
  const [evidence, setEvidence] = useState<{ entry: Evidence; final: Evidence }>(
    { entry: {}, final: {} },
  );
  const [open, setOpen] = useState<{ entry: OpenMap; final: OpenMap }>({
    entry: {},
    final: {},
  });
  const [gates, setGates] = useState<Gates>({});

  const crits = scTab === "entry" ? SC_ENTRY : SC_FINAL;
  const chosen = scores[scTab];
  const openMap = open[scTab];

  const computed = useMemo(() => {
    let total = 0;
    let graded = 0;
    const critVM = crits.map((c) => {
      const sel = chosen[c.id];
      const has = sel != null;
      if (has) graded++;
      const sc = has ? Math.round(LEVEL_MULT[sel - 1] * c.max) : 0;
      total += sc;
      const isOpen = !!openMap[c.id];
      const levels = [1, 2, 3, 4].map((i) => {
        const on = sel === i;
        const pts =
          i === 1 ? "0đ" : Math.round(LEVEL_MULT[i - 1] * c.max) + "đ";
        return {
          i,
          label: LEVEL_LABELS[i - 1],
          desc: LEVEL_DESC[i - 1],
          pts,
          on,
          style: {
            textAlign: "left",
            background: on ? "var(--iris-tint)" : "var(--bg-2)",
            borderWidth: on ? "1.5px" : "1px",
            borderStyle: "solid",
            borderColor: on ? "var(--iris)" : "var(--border-light)",
            borderRadius: "11px",
            padding: "11px 13px",
            cursor: "pointer",
            transition: "all .2s",
          } as React.CSSProperties,
          dot: on ? "var(--iris)" : "var(--border-hover)",
          dotBg: on ? "var(--iris)" : "transparent",
          ptsCol: on ? "var(--iris-deep)" : "var(--fg-3)",
        };
      });
      return {
        id: c.id,
        name: c.name,
        kpi: c.kpi,
        max: c.max,
        seg: (c as ScoreFinal).seg,
        nl: (c as ScoreFinal).nl,
        open: isOpen,
        levels,
        scoreLabel: has ? sc + "đ" : "—",
        scoreCol: has ? "var(--brand)" : "var(--fg-3)",
        borderCol: isOpen ? "var(--iris)" : "var(--border)",
        numBg: has ? "var(--brand)" : "var(--bg-muted)",
        numFg: has ? "#fff" : "var(--fg-3)",
        chevron: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        evidence: evidence[scTab][c.id] || "",
      };
    });
    let scSegs;
    if (scTab === "entry") {
      scSegs = [{ title: null as string | null, crits: critVM }];
    } else {
      scSegs = FINAL_SEGS.map((t, si) => ({
        title: t,
        crits: critVM.filter((c) => c.seg === si),
      }));
    }
    const scCount = crits.length;
    const scPct = Math.round((graded / scCount) * 100) + "%";
    const done = graded === scCount;
    return { critVM, scSegs, total, graded, scCount, scPct, done };
  }, [crits, chosen, openMap, evidence, scTab]);

  const gatesVM = useMemo(() => {
    const gate5auto = [7, 8, 9, 10].every(
      (id) => (chosen[id] || 0) >= 3,
    );
    return GATE_TEXT.map((txt, i) => {
      const auto = i === 4;
      const on = auto ? gate5auto : !!gates[i];
      return {
        text: txt,
        tagText:
          i === 4 ? "(NL1·NL3·NL5·NL7 · tự động)" : "",
        toggle: auto ? () => {} : () => setGates((g) => ({ ...g, [i]: !g[i] })),
        cursor: auto ? "default" : "pointer",
        brd: on ? (auto ? "var(--mint)" : "var(--iris)") : "var(--border-hover)",
        bg: on ? (auto ? "var(--mint)" : "var(--iris)") : "transparent",
        textCol: on ? "var(--fg-1)" : "var(--fg-2)",
        check: on ? checkIcon : null,
      };
    });
  }, [chosen, gates]);

  const pickLevel = (id: number, i: number) =>
    setScores((s) => ({
      ...s,
      [scTab]: { ...s[scTab], [id]: i },
    }));
  const setEv = (id: number, v: string) =>
    setEvidence((s) => ({
      ...s,
      [scTab]: { ...s[scTab], [id]: v },
    }));
  const toggleCrit = (id: number) =>
    setOpen((s) => ({
      ...s,
      [scTab]: { ...s[scTab], [id]: !s[scTab][id] },
    }));

  const { scSegs, total, graded, scCount, scPct, done } = computed;
  const scStatusStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "14px",
    padding: "12px 14px",
    borderRadius: "12px",
    background: done ? "var(--mint-tint)" : "var(--bg-muted)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: done
      ? "rgba(16,185,129,.3)"
      : "var(--border-light)",
  } as React.CSSProperties;
  const scStatusFg = done ? "var(--mint-deep)" : "var(--fg-2)";
  const scStatusIconBg = done ? "var(--mint)" : "var(--fg-3)";

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "48px 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <span className="s-eyebrow iris">Scorecard đánh giá</span>
      <h1
        style={{
          font: "700 clamp(26px,3.4vw,38px)/1.15 var(--font-impact)",
          letterSpacing: "-.02em",
          margin: "16px 0 8px",
          color: "var(--fg-1)",
        }}
      >
        Đánh giá theo từng giai đoạn
      </h1>
      <p
        style={{
          maxWidth: "760px",
          color: "var(--fg-2)",
          fontSize: "15.5px",
          margin: "0 0 20px",
        }}
      >
        Scorecard đầu vào đánh giá tiềm năng trước chương trình, Scorecard cuối kỳ
        đánh giá một prototype và quá trình tạo ra kết quả. Tất cả đều là thông tin đầu vào
        cho Hội Đồng tham khảo và đánh giá.
      </p>

      <div
        style={{
          display: "inline-flex",
          gap: "4px",
          padding: "4px",
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: "12px",
          marginBottom: "24px",
        }}
      >
        <button onClick={() => setScTab("entry")} style={segTab(scTab === "entry")}>
          Đánh giá đầu vào
        </button>
        <button onClick={() => setScTab("final")} style={segTab(scTab === "final")}>
          Đánh giá cuối kỳ
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(320px,1.7fr) minmax(260px,0.9fr)",
          gap: "22px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {scSegs.map((seg, si) => (
            <div key={si}>
              {seg.title && (
                <div
                  style={{
                    font: "700 12px var(--font-mono)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--brand)",
                    marginBottom: "12px",
                  }}
                >
                  {seg.title}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {seg.crits.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      background: "var(--card)",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: c.borderCol,
                      borderRadius: "14px",
                      boxShadow: "var(--shadow-sm)",
                      overflow: "hidden",
                    }}
                  >
                    <button
                      onClick={() => toggleCrit(c.id)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "16px 18px",
                        cursor: "pointer",
                        background: "transparent",
                        border: "none",
                      }}
                    >
                      <span
                        style={{
                          width: "26px",
                          height: "26px",
                          borderRadius: "8px",
                          background: c.numBg,
                          color: c.numFg,
                          font: "700 12px var(--font-mono)",
                          display: "grid",
                          placeItems: "center",
                          flex: "none",
                        }}
                      >
                        {c.id}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span
                          style={{
                            font: "600 14.5px/1.3 var(--font-brand)",
                            color: "var(--fg-1)",
                          }}
                        >
                          {c.name}
                        </span>
                        <span style={{ display: "inline-flex", gap: "6px", marginLeft: "8px" }}>
                          {c.nl && (
                            <span
                              style={{
                                font: "700 9.5px var(--font-mono)",
                                color: "var(--iris-deep)",
                                background: "var(--iris-tint)",
                                padding: "2px 6px",
                                borderRadius: "5px",
                              }}
                            >
                              {c.nl}
                            </span>
                          )}
                        </span>
                      </span>
                      <span
                        style={{
                          font: "700 14px var(--font-brand)",
                          color: c.scoreCol,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.scoreLabel}
                      </span>
                      <span
                        style={{
                          transform: c.chevron,
                          transition: "transform .25s var(--ease-out)",
                          color: "var(--fg-3)",
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
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </button>
                    {c.open && (
                      <div
                        style={{
                          padding: "0 18px 18px",
                          borderTop: "1px solid var(--border-light)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "13px",
                            lineHeight: 1.55,
                            color: "var(--fg-2)",
                            margin: "14px 0 4px",
                          }}
                        >
                          {c.kpi}
                        </p>
                        <div
                          style={{
                            font: "600 11px var(--font-mono)",
                            color: "var(--fg-3)",
                            marginBottom: "10px",
                          }}
                        >
                          Điểm tối đa: {c.max}đ
                        </div>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                            gap: "8px",
                          }}
                        >
                          {c.levels.map((lv) => (
                            <button
                              key={lv.i}
                              onClick={() => pickLevel(c.id, lv.i)}
                              className="hov-iris"
                              style={lv.style}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  gap: "6px",
                                }}
                              >
                                <span
                                  style={{
                                    font: "700 12px var(--font-brand)",
                                    color: "var(--fg-1)",
                                  }}
                                >
                                  {lv.label}
                                </span>
                                <span
                                  style={{
                                    width: "15px",
                                    height: "15px",
                                    borderRadius: "50%",
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    borderColor: lv.dot,
                                    background: lv.dotBg,
                                    flex: "none",
                                  }}
                                />
                              </div>
                              <div
                                style={{
                                  font: "700 12px var(--font-mono)",
                                  color: lv.ptsCol,
                                  marginTop: "6px",
                                }}
                              >
                                {lv.pts}
                              </div>
                              <div
                                style={{
                                  fontSize: "11px",
                                  lineHeight: 1.4,
                                  color: "var(--fg-3)",
                                  marginTop: "5px",
                                }}
                              >
                                {lv.desc}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap",
                            marginTop: "14px",
                            alignItems: "center",
                          }}
                        >
                          <div style={{ flex: 1, minWidth: "200px" }}>
                            <input
                              value={c.evidence}
                              onChange={(e) => setEv(c.id, e.target.value)}
                              placeholder="Dán link bằng chứng (evidence)…"
                              style={{
                                width: "100%",
                                height: "38px",
                                padding: "0 12px",
                                border: "1px solid var(--border)",
                                borderRadius: "9px",
                                background: "var(--bg-2)",
                                color: "var(--fg-1)",
                                font: "400 13px var(--font-body)",
                                outline: "none",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              font: "700 13px var(--font-brand)",
                              color: c.scoreCol,
                              whiteSpace: "nowrap",
                            }}
                          >
                            Điểm: {c.scoreLabel}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "sticky",
            top: "88px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "18px",
            boxShadow: "var(--shadow-md)",
            padding: "24px",
          }}
        >
          <div
            style={{
              font: "700 11px var(--font-mono)",
              letterSpacing: ".12em",
              textTransform: "uppercase",
              color: "var(--fg-3)",
            }}
          >
            Bảng điểm tạm tính
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "8px",
              margin: "10px 0 4px",
            }}
          >
            <span
              style={{
                font: "800 clamp(40px,6vw,56px)/1 var(--font-impact)",
                letterSpacing: "-.03em",
                color: "var(--brand)",
              }}
            >
              {total}
            </span>
            <span
              style={{
                font: "700 20px var(--font-impact)",
                color: "var(--fg-3)",
              }}
            >
              / 100
            </span>
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--fg-3)", marginBottom: "16px" }}>
            Đã chấm {graded} / {scCount} tiêu chí
          </div>
          <div
            style={{
              height: "10px",
              borderRadius: "6px",
              background: "var(--bg-muted)",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                height: "100%",
                width: scPct,
                background: "linear-gradient(90deg,var(--brand),var(--iris))",
                borderRadius: "6px",
                transition: "width .4s var(--ease-out)",
              }}
            />
          </div>

          <div style={scStatusStyle}>
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: scStatusIconBg,
                color: "#fff",
                flex: "none",
              }}
            >
              {done ? checkIcon : dotsIcon}
            </span>
            <span
              style={{
                font: "600 13px var(--font-brand)",
                color: scStatusFg,
              }}
            >
              {done ? "Đã đủ điều kiện kết luận" : "Chưa đủ điều kiện kết luận"}
            </span>
          </div>

          {scTab === "final" && (
            <div
              style={{
                marginTop: "22px",
                paddingTop: "20px",
                borderTop: "1px solid var(--border-light)",
              }}
            >
              <div
                style={{
                  font: "700 11px var(--font-mono)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "var(--gold-deep)",
                  marginBottom: "12px",
                }}
              >
                5 điều kiện bắt buộc
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {gatesVM.map((g, i) => (
                  <button
                    key={i}
                    onClick={g.toggle}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      textAlign: "left",
                      background: "transparent",
                      border: "none",
                      cursor: g.cursor,
                      padding: "2px 0",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "6px",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        borderColor: g.brd,
                        background: g.bg,
                        display: "grid",
                        placeItems: "center",
                        flex: "none",
                        marginTop: "1px",
                        color: "#fff",
                      }}
                    >
                      {g.check}
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        lineHeight: 1.45,
                        color: g.textCol,
                      }}
                    >
                      {g.text}{" "}
                      <span
                        style={{
                          font: "600 10px var(--font-mono)",
                          color: "var(--fg-3)",
                        }}
                      >
                        {g.tagText}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}