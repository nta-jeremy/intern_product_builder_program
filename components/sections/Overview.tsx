"use client";

import type { TabKey } from "@/lib/nav";

interface OverviewProps {
  onStartLearning: () => void;
  onGoComp: () => void;
  go: (t: TabKey) => void;
}

const stats = [
  {
    big: "14",
    color: "var(--brand)",
    title: "Buổi học",
    sub: "Độc lập, tích hợp lý thuyết & thực hành",
  },
  {
    big: "3",
    color: "var(--brand)",
    title: "Tháng thực chiến",
    sub: "Phát triển 4 dòng sản phẩm cốt lõi",
  },
  {
    big: "5",
    color: "var(--iris-deep)",
    title: "Cấp độ năng lực",
    sub: "Thang tham chiếu L1–L5; tốt nghiệp đạt L2",
  },
  {
    big: "L2",
    color: "var(--gold-deep)",
    title: "Cổng tốt nghiệp",
    sub: "Chuẩn đầu ra chính thức của Product Builder",
  },
];

export function Overview({ onStartLearning, onGoComp }: OverviewProps) {
  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(40px,6vw,80px) 26px 90px",
        animation: "dcFade .4s var(--ease-out)",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "860px", margin: "0 auto" }}>
        <span className="s-eyebrow iris">Chương trình thực tập · AI-Native</span>
        <h1
          style={{
            font: "800 clamp(38px,5.4vw,60px)/1.06 var(--font-impact)",
            letterSpacing: "-.028em",
            margin: "22px 0 0",
            color: "var(--fg-1)",
          }}
        >
          Chương trình thực tập Intern Product Builder —{" "}
          <em className="em-accent">Định vị AI-Native</em>
        </h1>
        <p
          style={{
            font: "400 clamp(17px,2vw,20px)/1.6 var(--font-body)",
            color: "var(--fg-2)",
            margin: "22px auto 0",
            maxWidth: "760px",
          }}
        >
          Chương trình thực tập 3 tháng rèn luyện thực chiến, tích hợp sâu sắc 3
          tư duy cốt lõi (Outcome, Critical, Design Thinking) và năng lực làm chủ
          công nghệ AI-native để thiết kế, xây dựng các giải pháp giải quyết bài
          toán nghiệp vụ thực tế tại YODY.
        </p>
        <div
          style={{
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: "34px",
          }}
        >
          <button className="cta cta-gold" onClick={onStartLearning}>
            Bắt đầu học ngay
            <svg
              width="18"
              height="18"
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
          <button className="cta cta-secondary" onClick={onGoComp}>
            Xem khung năng lực
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "16px",
          marginTop: "64px",
        }}
      >
        {stats.map((st) => (
          <div
            key={st.title}
            className="hov-lift-md-border"
            style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "18px",
              boxShadow: "var(--shadow-sm)",
              padding: "26px 24px",
              transition:
                "transform .2s var(--ease-out),box-shadow .2s var(--ease-out),background-color .3s,border-color .3s",
            }}
          >
            <div
              style={{
                font: "800 clamp(34px,4vw,44px)/1 var(--font-impact)",
                letterSpacing: "-.03em",
                color: "var(--brand)",
              }}
              data-om-raster="false"
            >
              <span style={{ color: st.color }}>{st.big}</span>
            </div>
            <div
              style={{
                font: "700 14px/1.35 var(--font-brand)",
                marginTop: "14px",
                color: "var(--fg-1)",
              }}
            >
              {st.title}
            </div>
            <div
              style={{
                font: "400 13px/1.5 var(--font-body)",
                color: "var(--fg-3)",
                marginTop: "5px",
              }}
            >
              {st.sub}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: "22px",
          boxShadow: "var(--shadow-sm)",
          padding: "clamp(26px,4vw,44px)",
          marginTop: "26px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "clamp(28px,4vw,48px)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "190px",
              height: "190px",
              borderRadius: "50%",
              background:
                "conic-gradient(var(--brand) 0 43%, var(--iris) 43% 100%)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "26px",
                borderRadius: "50%",
                background: "var(--card)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    font: "800 30px/1 var(--font-impact)",
                    color: "var(--fg-1)",
                  }}
                >
                  100%
                </div>
                <div
                  style={{
                    font: "600 11px/1.3 var(--font-mono)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    color: "var(--fg-3)",
                    marginTop: "6px",
                  }}
                >
                  Cân bằng
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <span className="s-eyebrow">Triết lý đào tạo</span>
          <h2
            style={{
              font: "700 clamp(24px,3vw,32px)/1.2 var(--font-impact)",
              letterSpacing: "-.02em",
              margin: "16px 0 10px",
              color: "var(--fg-1)",
            }}
          >
            Mô hình cân bằng Product &amp; Engineering
          </h2>
          <p
            style={{
              margin: "0 0 22px",
              color: "var(--fg-2)",
              fontSize: "15.5px",
              lineHeight: 1.6,
            }}
          >
            Product Builder không chọn giữa tư duy sản phẩm và kỹ thuật — chương
            trình rèn cả hai theo tỷ trọng cố định.
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "14px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "4px",
                    background: "var(--brand)",
                  }}
                />
                <span
                  style={{
                    font: "800 22px var(--font-impact)",
                    color: "var(--brand)",
                  }}
                >
                  43%
                </span>
              </div>
              <div
                style={{
                  font: "600 13px var(--font-brand)",
                  marginTop: "4px",
                  color: "var(--fg-1)",
                }}
              >
                Product Mindset
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--fg-3)" }}>
                3 năng lực nền tảng
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "150px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "4px",
                    background: "var(--iris)",
                  }}
                />
                <span
                  style={{
                    font: "800 22px var(--font-impact)",
                    color: "var(--iris-deep)",
                  }}
                >
                  57%
                </span>
              </div>
              <div
                style={{
                  font: "600 13px var(--font-brand)",
                  marginTop: "4px",
                  color: "var(--fg-1)",
                }}
              >
                Engineering
              </div>
              <div style={{ fontSize: "12.5px", color: "var(--fg-3)" }}>
                4 năng lực kỹ thuật ứng dụng
              </div>
            </div>
          </div>
          <div
            style={{
              height: "18px",
              borderRadius: "9px",
              overflow: "hidden",
              display: "flex",
              boxShadow: "inset 0 0 0 1px var(--border)",
            }}
          >
            <div style={{ width: "43%", background: "var(--brand)" }} />
            <div style={{ width: "57%", background: "var(--iris)" }} />
          </div>
        </div>
      </div>
    </main>
  );
}