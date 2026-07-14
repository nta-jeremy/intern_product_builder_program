"use client";

import { useState, type ReactNode } from "react";

type Page = "overview" | "read" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
}

const PART_META = [
  { n: "01", short: "LLM & Token", title: "LLM & Token", time: "~15 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Context Window", title: "Context Window", time: "~16 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "03", short: "Tham số & Giới hạn", title: "Tham số & Giới hạn nền tảng", time: "~18 phút", c: "var(--mint)", cDeep: "var(--mint-deep)", tint: "var(--mint-tint)" },
  { n: "04", short: "Cách tư duy AI", title: "Cách tư duy AI & Chọn cách tiếp cận", time: "~15 phút", c: "var(--rose)", cDeep: "var(--rose-deep)", tint: "var(--rose-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Cơ chế LLM đoán token tiếp theo; token = tiền · tốc độ · giới hạn. Vì sao tiếng Việt tốn token hơn tiếng Anh.", tags: ["LLM", "Token", "Hallucination"] },
  { ...PART_META[1], desc: "Bộ nhớ làm việc hữu hạn, hiện tượng lost-in-the-middle, và 3 chiến lược thiết kế quanh giới hạn.", tags: ["Context Window", "Chunking", "RAG"] },
  { ...PART_META[2], desc: "Temperature, knowledge cutoff, foundation model, embedding, fine-tuning & RLHF.", tags: ["Temperature", "Knowledge Cutoff", "Embedding"] },
  { ...PART_META[3], desc: "Zero-shot / few-shot / chain-of-thought và cây quyết định Prompt vs RAG vs Fine-tuning.", tags: ["Zero/Few-shot", "Chain-of-thought", "Decision Tree"] },
];

const OBJECTIVES = [
  "Giải thích LLM đoán token tiếp theo thế nào — và vì sao điều đó vừa tạo sức mạnh vừa tạo rủi ro bịa đặt.",
  "Nêu token, context window, temperature, knowledge cutoff ảnh hưởng ra sao đến một quyết định sản phẩm.",
  "Phân biệt zero-shot / few-shot / chain-of-thought và biết khi nào dùng cái nào.",
  "Vẽ cây quyết định: bài toán nên dùng Prompt, RAG hay Fine-tuning.",
];

const MUST_KNOW = ["LLM", "Token", "Context Window", "Prompt", "Few-shot / Zero-shot", "Chain-of-thought"];
const NICE_KNOW = ["Foundation Model", "Training Data / Knowledge Cutoff", "Temperature", "Fine-tuning", "RLHF", "Embedding"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~64 phút" },
  { k: "Giai đoạn", v: "1 · Tuần 1–4" },
  { k: "Cấp độ", v: "L1" },
  { k: "Năng lực", v: "NL4" },
  { k: "Gate riêng", v: "Không (buổi mở đầu)" },
  { k: "Cập nhật", v: "04 / 07 / 2026" },
];

const PASS_SCORE = 16;
const PASS_PCT = "80%";

const PART_LABELS = [
  "Phần 1 · LLM & Token",
  "Phần 2 · Context Window",
  "Phần 3 · Tham số & Giới hạn",
  "Phần 4 · Cách tư duy AI",
];

interface ExamQ {
  part: string;
  q: string;
  opts: string[];
  correct: number;
  why: string;
}

const EXAM: ExamQ[] = [
  { part: PART_LABELS[0], q: "Về bản chất, một LLM làm gì khi sinh câu trả lời?", opts: ["Dự đoán token tiếp theo có xác suất cao nhất dựa trên ngữ cảnh trước đó", "Tra cứu một cơ sở dữ liệu chứa sự thật rồi trả về kết quả đúng", "Tìm kiếm trên internet theo thời gian thực", "So khớp chính xác từ khóa trong câu hỏi"], correct: 0, why: "LLM dự đoán token tiếp theo theo xác suất, không tra cứu sự thật." },
  { part: PART_LABELS[0], q: "Vì sao LLM có thể \"bịa\" (hallucination) một cách rất tự tin?", opts: ["Vì nó cố tình gây nhiễu", "Vì máy chủ thiếu bộ nhớ", "Vì mục tiêu của nó là tạo văn bản hợp lý về ngôn ngữ, không phải đúng về dữ kiện", "Vì temperature luôn được đặt ở mức cao nhất"], correct: 2, why: "Mô hình tối ưu cho \"hợp lý về ngôn ngữ\" nên có thể sinh câu trôi chảy nhưng sai dữ kiện." },
  { part: PART_LABELS[0], q: "Khi dùng API của các mô hình thương mại, chi phí thường được tính theo gì?", opts: ["Số lần gọi API", "Số token đầu vào (input) cộng token đầu ra (output)", "Số giây xử lý", "Số người dùng đăng ký"], correct: 1, why: "API tính tiền theo số lượng token input + output, không theo lần gọi hay theo giây." },
  { part: PART_LABELS[0], q: "Giữa input token và output token, thông thường cái nào đắt hơn?", opts: ["Input token", "Cả hai luôn bằng nhau", "Output token không bị tính tiền", "Output token"], correct: 3, why: "Token đầu ra (output) thường đắt hơn token đầu vào (input)." },
  { part: PART_LABELS[0], q: "Vì sao xử lý review tiếng Việt thường tốn token hơn nội dung tiếng Anh tương đương?", opts: ["Vì tokenizer tối ưu cho tiếng Anh; tiếng Việt có dấu bị tách thành nhiều token hơn", "Vì người Việt viết dài dòng hơn", "Vì máy chủ đặt ở nước ngoài", "Vì temperature cho tiếng Việt cao hơn"], correct: 0, why: "Tokenizer tối ưu cho tiếng Anh; tiếng Việt có dấu bị tách nhiều token hơn." },
  { part: PART_LABELS[1], q: "Context window là gì?", opts: ["Bộ nhớ dài hạn lưu vĩnh viễn mọi hội thoại", "Tốc độ đường truyền mạng", "Số token tối đa mô hình \"nhìn\" được trong một lượt, gồm cả nội dung đưa vào lẫn câu trả lời sinh ra", "Kích thước file của mô hình"], correct: 2, why: "Context window = số token tối đa xử lý trong một lượt, tính cả input lẫn output." },
  { part: PART_LABELS[1], q: "Hiện tượng \"lost-in-the-middle\" mô tả điều gì?", opts: ["Mất kết nối mạng giữa chừng", "Mô hình có xu hướng chú ý phần đầu và cuối, lơ là thông tin nằm ở giữa một prompt dài", "Câu trả lời bị cắt cụt giữa chừng", "Token bị mất do lỗi phần cứng"], correct: 1, why: "Prompt quá dài thì phần giữa dễ bị lơ là dù vẫn nằm trong context window." },
  { part: PART_LABELS[1], q: "Nhận định nào ĐÚNG về việc đưa dữ liệu vào prompt?", opts: ["Nhồi càng nhiều dữ liệu thì kết quả càng tốt", "Context window là vô hạn nên không cần lo", "Không bao giờ cần xử lý dữ liệu trước khi đưa vào", "Nhồi nhiều dữ liệu không liên quan làm loãng thông tin quan trọng, tốn token hơn và dễ bỏ sót"], correct: 3, why: "\"Nhồi nhiều ≠ tốt hơn\": dữ liệu thừa làm loãng thông tin, tốn token, dễ sót." },
  { part: PART_LABELS[1], q: "Cần tóm tắt ~400 tin nhắn của một khách nhưng phải giữ ngữ cảnh gọn gàng. Chiến lược phù hợp nhất?", opts: ["Tóm tắt phân tầng (tóm theo từng quý + kèm vài tin gần nhất nguyên văn)", "Nhồi cả 400 tin vào một lần", "Tăng temperature để AI \"nhớ\" nhiều hơn", "Xóa ngẫu nhiên một nửa số tin"], correct: 0, why: "Tóm tắt phân tầng phù hợp tệp rất dài; temperature không liên quan tới trí nhớ." },
  { part: PART_LABELS[1], q: "Với chiến lược chunking (chia batch), \"ai trả giá\" — nhược điểm chính là gì?", opts: ["Không có nhược điểm nào", "Bắt buộc phải có Vector Database", "Phải gọi API nhiều lần hơn → tốn tiền hơn, tăng tổng latency, và cần thêm logic gộp kết quả cuối", "Luôn làm giảm độ chính xác xuống mức thấp nhất"], correct: 2, why: "Chunking bao quát tốt nhưng gọi API nhiều lần → tốn tiền, tăng latency, cần logic tổng hợp." },
  { part: PART_LABELS[2], q: "Temperature điều khiển điều gì?", opts: ["Độ thông minh của mô hình", "Mức độ ngẫu nhiên khi mô hình chọn token tiếp theo", "Tốc độ phản hồi", "Độ dài tối đa của câu trả lời"], correct: 1, why: "Temperature chỉnh độ ngẫu nhiên khi chọn token, không phải độ thông minh hay tốc độ." },
  { part: PART_LABELS[2], q: "Tác vụ \"trích số liệu chính xác từ một báo cáo\" nên đặt temperature ở mức nào?", opts: ["Cao (0.8–1.0)", "Không quan trọng, để mặc định nào cũng được", "Đặt ngẫu nhiên mỗi lần", "Thấp (0.1–0.3)"], correct: 3, why: "Tác vụ cần chính xác/nhất quán → temperature thấp (0.1–0.3)." },
  { part: PART_LABELS[2], q: "Nhận định nào ĐÚNG về temperature?", opts: ["Temperature không làm AI đúng hơn về sự thật — nó chỉ chỉnh độ biến thiên của output", "Temperature cao làm AI trả lời đúng sự thật hơn", "Temperature 0 thì AI chắc chắn không bao giờ bịa", "Đặt temperature đúng thì không cần kiểm chứng nguồn nữa"], correct: 0, why: "Temperature chỉ chỉnh độ biến thiên; temp 0 vẫn có thể bịa nhất quán → vẫn phải truy nguồn." },
  { part: PART_LABELS[2], q: "\"Knowledge cutoff\" ảnh hưởng thế nào đến cách dùng AI?", opts: ["AI luôn biết thông tin mới nhất theo thời gian thực", "AI tự cập nhật kiến thức mỗi ngày", "AI không biết chuyện xảy ra sau mốc huấn luyện, trừ khi bạn cung cấp thêm thông tin trong prompt/tool", "Chỉ ảnh hưởng đến nội dung tiếng Anh"], correct: 2, why: "AI không biết chuyện sau mốc huấn luyện trừ khi bạn cung cấp thêm trong prompt/tool." },
  { part: PART_LABELS[2], q: "Embedding (ở mức khái niệm) là gì?", opts: ["Một cách nén file để tiết kiệm dung lượng", "Biểu diễn văn bản thành vector số sao cho nội dung gần nghĩa nằm gần nhau trong không gian số", "Một loại prompt đặc biệt", "Một bộ lọc bảo mật đầu vào"], correct: 1, why: "Embedding = toạ độ ngữ nghĩa: văn bản gần nghĩa → vector gần nhau (nền của semantic search)." },
  { part: PART_LABELS[2], q: "Khi nào mới nên cân nhắc fine-tuning một mô hình?", opts: ["Ngay từ đầu, cho mọi bài toán", "Khi AI viết văn dở", "Để thay cho việc kiểm chứng nguồn dữ liệu", "Chỉ khi prompt và RAG đã đụng trần, nhu cầu lặp lại rất ổn định và có đủ dữ liệu chất lượng"], correct: 3, why: "Fine-tuning là phương án cuối: chỉ khi prompt + RAG đụng trần, nhu cầu ổn định, đủ dữ liệu." },
  { part: PART_LABELS[3], q: "Tác vụ có quy ước nhãn/định dạng riêng của bạn mà zero-shot dễ hiểu sai — nên dùng cách nào?", opts: ["Few-shot (kèm vài ví dụ mẫu để mô hình bắt đúng tiêu chí/format)", "Zero-shot", "Chỉ cần tăng temperature", "Fine-tuning ngay lập tức"], correct: 0, why: "Few-shot: vài ví dụ mẫu giúp mô hình bắt đúng nhãn/định dạng riêng." },
  { part: PART_LABELS[3], q: "Chain-of-thought (CoT) phát huy tác dụng nhất trong trường hợp nào?", opts: ["Tác vụ cực kỳ đơn giản, một bước", "Khi muốn output ngắn nhất có thể", "Bài toán nhiều ràng buộc/cần lập luận, và bạn muốn nhìn thấy mô hình sai ở bước nào", "Khi muốn tiết kiệm token tối đa"], correct: 2, why: "CoT hữu ích cho bài toán nhiều ràng buộc/cần lập luận và cho thấy mô hình sai ở bước nào." },
  { part: PART_LABELS[3], q: "Cần AI trả lời khách dựa trên chính sách đổi trả nội bộ của YODY — cách tiếp cận đúng nhất là?", opts: ["Fine-tuning mô hình bằng toàn bộ tài liệu công ty", "Dùng RAG: nạp tài liệu chính sách và truy hồi phần liên quan đưa vào context", "Chỉ cần tăng kích thước context window", "Tăng temperature để AI sáng tạo câu trả lời"], correct: 1, why: "Thông tin nội bộ (ngoài training data) → dùng RAG để nạp và truy hồi." },
  { part: PART_LABELS[3], q: "Thứ tự cân nhắc giải pháp đúng theo nguyên tắc của buổi học là?", opts: ["Fine-tuning → RAG → Prompt", "RAG → Prompt → Fine-tuning", "Luôn bắt đầu bằng fine-tuning cho chắc", "Prompt → RAG (khi thiếu kiến thức) → Fine-tuning (phương án cuối)"], correct: 3, why: "Nguyên tắc: Prompt trước → RAG khi thiếu kiến thức → Fine-tuning là phương án cuối." },
];

const chevron = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const clockIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const bookIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const listIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2">
    <path d="M4 6h16M4 12h16M4 18h10" />
  </svg>
);

const examIcon = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3a2500" strokeWidth="2.2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const backIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
  </svg>
);

const arrowDownIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

const arrowRightIcon = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function TldrDark({ items }: { items: ReactNode[] }) {
  return (
    <div style={{ margin: "36px 0", padding: "26px 28px", background: "var(--bg-ink)", borderRadius: "14px" }}>
      <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Tóm tắt 3 ý</div>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "#e6e7f2", font: "16px/1.7 var(--font-body)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </div>
  );
}

function SelfCheck({ items }: { items: string[] }) {
  return (
    <>
      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 14px" }}>Tự kiểm tra</h2>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "var(--fg-2)", font: "16px/1.75 var(--font-body)", display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </>
  );
}

function Callout({ tone, label, children }: { tone: "iris" | "gold" | "rose" | "mint"; label: string; children: ReactNode }) {
  const borderVar = `var(--${tone})`;
  const colorVar = tone === "iris" ? "var(--iris-deep)" : `var(--${tone}-deep)`;
  const bgVar = `var(--${tone}-tint)`;
  return (
    <div style={{ margin: "24px 0", padding: "18px 22px", background: bgVar, borderLeft: `3px solid ${borderVar}`, borderRadius: "0 10px 10px 0" }}>
      <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: colorVar, marginBottom: "8px" }}>{label}</div>
      <div style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)" }}>{children}</div>
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I1.1">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevron}
        <span>Giai đoạn 1 · Tuần 1–4</span>
        {chevron}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I1.1</span>
      </div>

      <div className="i11-overview-grid" style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I1.1 · Năng lực NL4 · Level L1</span>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            AI Fundamentals &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>LLM Mechanics</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Buổi mở đầu chương trình. Mô hình tư duy nền tảng để không bao giờ giả định &quot;AI biết tất cả&quot; — hiểu AI hoạt động thế nào, mạnh/yếu ở đâu, và thiết kế sản phẩm <em style={{ fontStyle: "italic" }}>quanh</em> các giới hạn đó.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~64</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>4</b> phần đọc</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Khác biệt giữa <b style={{ color: "var(--fg-1)" }}>người dùng AI</b> và <b style={{ color: "var(--fg-1)" }}>Nhà phát triển sản phẩm ứng dụng AI (Product Builder)</b> nằm ở chỗ: người dùng gõ câu hỏi và tin kết quả; builder hiểu AI hoạt động thế nào, biết nó mạnh/yếu ở đâu, và thiết kế sản phẩm quanh các giới hạn đó.
            </p>
          </section>

          <section style={{ marginTop: "44px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 18px" }}>Mục tiêu — kết thúc buổi, bạn có thể…</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
              {OBJECTIVES.map((o) => (
                <div key={o} style={{ display: "flex", gap: "13px", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--mint)", flex: "none" }}>{checkIcon}</span>
                  <span style={{ font: "16px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{o}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "52px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "22px" }}>
              <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: 0 }}>Nội dung buổi học</h2>
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~64 phút</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {PARTS.map((p, i) => (
                <a
                  key={p.n}
                  href="#"
                  onClick={(e) => { e.preventDefault(); go("read", i); }}
                  className="kh-part"
                  style={{ display: "flex", gap: "22px", background: "#fff", border: "1px solid var(--fg-1)", borderRadius: "10px", padding: "24px 26px", textDecoration: "none", alignItems: "flex-start" }}
                >
                  <span style={{ font: "italic 800 40px/1 var(--font-serif)", color: p.c, flex: "none", width: "46px" }}>{p.n}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "14px", marginBottom: "8px" }}>
                      <h3 style={{ font: "700 21px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: 0 }}>{p.title}</h3>
                      <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)", whiteSpace: "nowrap" }}>{p.time}</span>
                    </div>
                    <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px", textWrap: "pretty" }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".04em", color: p.cDeep, background: p.tint, padding: "6px 10px", borderRadius: "6px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "40px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "26px 28px", display: "flex", gap: "22px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{examIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Bài test gate · làm trước khi sang I1.2</div>
                <h3 style={{ font: "700 23px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 8px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "520px" }}>
                  Làm sau khi đọc xong 4 phần (~20 phút). Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> mới nên sang buổi <b style={{ color: "var(--fg-1)" }}>I1.2 — Outcome Thinking &amp; PII</b>. Có chấm điểm &amp; giải thích ngay.
                </p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", font: "600 14px/44px var(--font-body)", textDecoration: "none", alignSelf: "center", background: "var(--gold-deep)", border: "1px solid var(--gold-deep)", color: "#fff", borderRadius: "8px", display: "inline-flex", alignItems: "center" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Phải biết</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
              {MUST_KNOW.map((t) => (
                <span key={t} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Biết thêm</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {NICE_KNOW.map((t) => (
                <span key={t} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>RAG, Embedding, Vector search chỉ giới thiệu ở mức khái niệm — học sâu kèm lab tại buổi I3.1.</p>
          </section>
        </main>

        <aside style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: "1px solid var(--fg-1)", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
            <div style={{ height: "7px", background: "var(--iris)" }} />
            <div style={{ padding: "24px" }}>
              <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "18px" }}>Thông tin buổi học</div>
              {META.map((m) => (
                <div key={m.k} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "14px", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ font: "14px/1.4 var(--font-body)", color: "var(--fg-3)" }}>{m.k}</span>
                  <span style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--fg-1)", textAlign: "right" }}>{m.v}</span>
                </div>
              ))}
              <a href="#" onClick={(e) => { e.preventDefault(); go("read", 0); }} className="cta cta-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", boxSizing: "border-box", height: "46px", font: "600 15px/1 var(--font-body)", textDecoration: "none", background: "var(--iris-deep)", border: "1px solid var(--iris-deep)", color: "#fff", borderRadius: "8px", marginTop: "20px" }}>Bắt đầu · Phần 1</a>
              <div style={{ textAlign: "center", font: "13px/1.4 var(--font-body)", color: "var(--fg-3)", marginTop: "12px" }}>Công khai · không cần đăng nhập</div>
            </div>
          </div>
          <div style={{ border: "1px dashed var(--border)", borderRadius: "12px", padding: "18px 20px", background: "var(--iris-tint)" }}>
            <div style={{ font: "700 12px/1.3 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "6px" }}>Sau khi hoàn thành</div>
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sẵn sàng cho <b style={{ color: "var(--fg-1)" }}>I1.2 — Outcome Thinking &amp; Tuân thủ PII</b> (buổi Gate 1).</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Part1View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>L</span>
        LM (Large Language Model — mô hình ngôn ngữ lớn) là mô hình được huấn luyện trên khối lượng văn bản khổng lồ để làm một việc nghe rất đơn giản: <b>dự đoán token (mảnh văn bản) tiếp theo có khả năng xuất hiện nhất</b>, dựa trên những gì đã có trước đó. Claude, ChatGPT, Gemini… đều xây trên LLM.
      </p>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>
        Với câu <i>&quot;Khách hàng phàn nàn áo bị ___&quot;</i>, mô hình không &quot;hiểu&quot; — nó tính xác suất token kế tiếp rồi sinh từng token một cho tới hết câu.
      </p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "26px 28px" }}>
          <div style={{ font: "600 15px/1.5 var(--font-body)", color: "var(--fg-2)", marginBottom: "18px" }}>
            Khách hàng phàn nàn áo bị <span style={{ borderBottom: "2px dashed var(--iris)", padding: "0 22px", color: "var(--iris-deep)", fontWeight: 700 }}>?</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "52px", font: "700 14px/1 var(--font-brand)", color: "var(--iris-deep)" }}>phai</span>
              <div style={{ flex: 1, height: "26px", borderRadius: "6px", background: "var(--iris)", width: "100%", maxWidth: "40%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "10px", boxSizing: "border-box", color: "#fff", font: "700 12px/1 var(--font-numeric)" }}>40%</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "52px", font: "600 14px/1 var(--font-brand)", color: "var(--fg-2)" }}>nhăn</span>
              <div style={{ flex: 1, maxWidth: "100%" }}>
                <div style={{ height: "26px", borderRadius: "6px", background: "var(--iris-tint)", border: "1px solid var(--iris)", width: "25%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "10px", boxSizing: "border-box", color: "var(--iris-deep)", font: "700 12px/1 var(--font-numeric)" }}>25%</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "52px", font: "600 14px/1 var(--font-brand)", color: "var(--fg-2)" }}>lỏng</span>
              <div style={{ flex: 1, maxWidth: "100%" }}>
                <div style={{ height: "26px", borderRadius: "6px", background: "var(--iris-tint)", border: "1px solid var(--iris)", width: "15%", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "10px", boxSizing: "border-box", color: "var(--iris-deep)", font: "700 12px/1 var(--font-numeric)" }}>15%</div>
              </div>
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — LLM dự đoán token tiếp theo theo xác suất, <b>không</b> tra cứu sự thật.</figcaption>
      </figure>

      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-1)", margin: "26px 0 14px" }}>
        Điều cốt lõi cần khắc sâu: <b>LLM dự đoán ngôn ngữ, không tra cứu sự thật.</b> Đây là câu giải thích được <i>cả</i> sức mạnh lẫn điểm yếu của AI:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "8px" }}>Sức mạnh</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Viết trôi chảy, tóm tắt, dịch, phân loại, lập luận theo ngôn ngữ rất tốt — vì đó đúng là thứ nó được tối ưu.</div>
        </div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>Điểm yếu</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Có thể tạo câu <i>nghe rất thuyết phục nhưng sai</i> — vì mục tiêu là &quot;hợp lý về ngôn ngữ&quot;, không phải &quot;đúng về dữ kiện&quot; (hallucination, học kỹ ở I1.2).</div>
        </div>
      </div>

      <Callout tone="iris" label="Ví dụ YODY · giả lập">
        <p style={{ margin: 0 }}>Hỏi LLM <i>&quot;Áo khoác Yody mã UW-201 có mấy màu, giá bao nhiêu?&quot;</i> — nó không truy cập hệ thống sản phẩm, không biết mã đó có thật không, nhưng vẫn trả lời rất tự tin: <i>&quot;4 màu, giá 450.000–590.000đ&quot;</i> — tất cả đều là thông tin tự tạo, không có thật (bịa đặt).</p>
      </Callout>
      <Callout tone="gold" label="Góc nhìn Product Builder">
        <p style={{ margin: 0 }}>Mọi con số, tên riêng, khẳng định do AI tạo ra phải <b>truy được nguồn</b> trước khi đưa vào quyết định sản phẩm. AI là trợ lý soạn thảo và suy luận, không phải nguồn chân lý.</p>
      </Callout>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Token — đơn vị AI thực sự &quot;nhìn thấy&quot;</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 22px" }}>
        AI không đọc theo từ hay ký tự như người, mà theo <b>token</b> — những mảnh văn bản nhỏ (&quot;áo&quot;, &quot;kho&quot; + &quot;ác&quot;, một dấu câu). Quy tắc gần đúng cho tiếng Anh: <b>1 token ≈ 4 ký tự ≈ ¾ từ</b>. Không cần đếm chính xác, chỉ cần nắm token chi phối ba thứ:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "14px", margin: "0 0 30px" }}>
        <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--iris)", marginBottom: "8px" }}>₫</div>
          <div style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--fg-1)", marginBottom: "5px" }}>Tiền</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>Tính theo token; output đắt hơn input.</div>
        </div>
        <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--gold-deep)", marginBottom: "8px" }}>⚡</div>
          <div style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--fg-1)", marginBottom: "5px" }}>Tốc độ</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>Sinh tuần tự → càng nhiều token càng chậm.</div>
        </div>
        <div style={{ padding: "20px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--rose-deep)", marginBottom: "8px" }}>▚</div>
          <div style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--fg-1)", marginBottom: "5px" }}>Giới hạn</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>Trần token mỗi lượt → context window.</div>
        </div>
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--iris-deep)", margin: "30px 0 10px" }}>Token = tiền</h3>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>
        Dùng API mô hình thương mại, bạn <b>trả tiền theo token</b>, không theo lần gọi — tính riêng <b>input</b> (prompt gửi vào) và <b>output</b> (câu trả lời, thường đắt hơn). Ở quy mô: 100.000 người dùng × 500 token/prompt → <b>50 triệu input token cho một lần chạy</b>, chưa tính output. Viết prompt ngắn gọn không phải thẩm mỹ — đó là <b>quyết định kinh tế</b>.
      </p>
      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--iris-deep)", margin: "26px 0 10px" }}>Token = tốc độ</h3>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>
        LLM sinh từng token một, tuần tự: 500 token mất khoảng gấp đôi 250 token, ảnh hưởng trực tiếp <b>độ trễ (latency)</b> người dùng cảm nhận. Tính năng &quot;AI gợi ý câu trả lời CSKH&quot; nếu luôn giải thích dài 300 từ thì nhân viên chờ lâu hơn hẳn so với 50 từ — một đánh đổi <b>tốc độ ↔ độ đầy đủ</b> bạn phải chủ động chọn.
      </p>
      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--iris-deep)", margin: "26px 0 10px" }}>Tiếng Việt &quot;đắt&quot; token hơn tiếng Anh</h3>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>
        Hầu hết tokenizer tối ưu cho tiếng Anh; tiếng Việt có dấu bị tách nhiều token hơn: &quot;shirt&quot; → có thể 1 token, còn &quot;áo sơ mi&quot; → có thể 3–4 token. <b>Hệ quả:</b> xử lý review tiếng Việt tốn token hơn đáng kể — khi ước tính chi phí cho thị trường Việt, phải nhân thêm hệ số này.
      </p>

      <TldrDark
        items={[
          <>LLM <b>dự đoán token tiếp theo</b>, không tra cứu sự thật — mạnh về ngôn ngữ nhưng có thể bịa; mọi dữ kiện phải truy nguồn.</>,
          <><b>Token</b> chi phối <b>tiền</b> (output đắt hơn input), <b>tốc độ</b> (latency theo số token) và <b>giới hạn</b>.</>,
          <><b>Tiếng Việt tốn token hơn tiếng Anh</b> — cộng hệ số này khi ước tính chi phí cho khách Việt.</>,
        ]}
      />

      <SelfCheck
        items={[
          "Vì sao \"LLM dự đoán ngôn ngữ chứ không tra cứu sự thật\" ảnh hưởng tới cách bạn dùng số liệu AI đưa ra?",
          "Feature 100.000 người dùng, mỗi lượt 500 token input — vì sao độ dài prompt trở thành quyết định kinh tế?",
          "Khi nào ưu tiên output ngắn thay vì dài, và ai được lợi từ lựa chọn đó?",
          "Vì sao cùng một ý, bản tiếng Việt tốn token hơn tiếng Anh?",
        ]}
      />
    </div>
  );
}

function Part2View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>C</span>
        ontext window là lượng token tối đa mô hình &quot;nhìn&quot; được cùng lúc trong một lần gọi — gồm <i>cả</i> nội dung bạn đưa vào <i>lẫn</i> câu trả lời nó sinh ra. Hãy hình dung một <b>mặt bàn làm việc</b> kích thước cố định: đặt thêm giấy mới thì giấy cũ bị đẩy khỏi mép bàn.
      </p>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>
        Một mô hình context window 128.000 token xử lý được khoảng 100.000 từ tiếng Anh mỗi lượt (ít hơn với tiếng Việt). Nghe nhiều, nhưng vẫn dễ không đủ trong nhiều tình huống thực tế.
      </p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "26px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "110px" }}>
            <div style={{ flex: "none", width: "40px", height: 0 }} />
            <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: "6px", border: "2px solid var(--fg-1)", borderRadius: "10px", padding: "12px", height: "100%", boxSizing: "border-box", position: "relative" }}>
              <span style={{ position: "absolute", top: "-11px", left: "14px", background: "#fff", padding: "0 8px", font: "700 10px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--fg-3)" }}>Context window · mặt bàn cố định</span>
              <div style={{ flex: 1, background: "var(--iris-tint)", border: "1px solid var(--iris)", borderRadius: "5px", height: "70%" }} />
              <div style={{ flex: 1, background: "var(--iris-tint)", border: "1px solid var(--iris)", borderRadius: "5px", height: "82%" }} />
              <div style={{ flex: 1, background: "#f0f0f4", border: "1px dashed var(--fg-3)", borderRadius: "5px", height: "60%", opacity: ".5" }} />
              <div style={{ flex: 1, background: "#f0f0f4", border: "1px dashed var(--fg-3)", borderRadius: "5px", height: "66%", opacity: ".5" }} />
              <div style={{ flex: 1, background: "var(--iris-tint)", border: "1px solid var(--iris)", borderRadius: "5px", height: "90%" }} />
              <div style={{ flex: 1, background: "var(--gold-tint)", border: "1px solid var(--gold)", borderRadius: "5px", height: "78%" }} />
            </div>
            <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", color: "var(--fg-3)" }}>
              {arrowRightIcon}
              <span style={{ font: "600 9px/1 var(--font-mono)" }}>token mới</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", font: "500 12px/1.4 var(--font-body)", color: "var(--fg-3)" }}>
            <span>◀ token cũ bị đẩy ra</span>
            <span style={{ color: "var(--fg-3)", opacity: ".7" }}>giữa bị lơ là</span>
            <span>đầu &amp; cuối được chú ý ▶</span>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Context window = bộ nhớ làm việc có hạn; nhồi nhiều <b>không</b> tốt hơn.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Lost-in-the-middle: nhồi nhiều ≠ tốt hơn</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        Người mới hay nghĩ <i>&quot;cho AI càng nhiều thông tin càng tốt&quot;</i>. Đây là quan niệm <b>sai và nguy hiểm</b> khi thiết kế sản phẩm. Thực tế, khi prompt quá dài, mô hình chú ý nhiều hơn vào <b>phần đầu và phần cuối, lơ là phần giữa</b> — hiện tượng <b>mất tập trung ở giữa (lost-in-the-middle)</b>. Thông tin quan trọng nằm giữa có thể bị bỏ qua <i>dù vẫn nằm trong context window</i>.
      </p>
      <Callout tone="gold" label="Ví dụ YODY · giả lập">
        <p style={{ margin: 0 }}>Bạn dán 30 review + một đoạn mô tả sản phẩm dài, yêu cầu &quot;liệt kê mọi vấn đề khách than&quot;. AI tóm tốt các review ở cuối, nhưng <b>bỏ sót vài review ở đầu</b> (khóa kéo kẹt, size lệch). Không phải lỗi phần mềm — đây là đặc tính kiến trúc mô hình.</p>
      </Callout>
      <p style={{ font: "italic 600 18px/1.6 var(--font-body)", color: "var(--fg-1)", margin: "0 0 8px", borderLeft: "3px solid var(--fg-1)", paddingLeft: "16px" }}>Nhồi nhiều dữ liệu không liên quan làm loãng thông tin quan trọng, tốn token hơn, chậm hơn, và dễ sót.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Ba chiến lược thiết kế <i>quanh</i> context window</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px" }}>
            <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris)", padding: "5px 9px", borderRadius: "6px" }}>01</span>
            <h3 style={{ font: "700 18px/1.2 var(--font-brand)", color: "var(--fg-1)", margin: 0 }}>Chia nhỏ dữ liệu (Chunking) theo đợt</h3>
          </div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 12px" }}>Chia dữ liệu thành phần vừa phải, xử lý từng phần rồi gộp. Ví dụ: 30 review → 3 đợt × 10 → tóm từng đợt → gộp theo tần suất.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Lợi:</b> bao quát toàn bộ, không sót; dễ triển khai.</div>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Ai trả giá:</b> gọi API nhiều lần → tốn tiền, tăng latency, cần logic tổng hợp.</div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px" }}>
            <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "5px 9px", borderRadius: "6px" }}>02</span>
            <h3 style={{ font: "700 18px/1.2 var(--font-brand)", color: "var(--fg-1)", margin: 0 }}>Tóm tắt phân tầng</h3>
          </div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 12px" }}>Tóm từng phần trước, rồi đưa các bản tóm vào bước sau (nhân viên → tổ trưởng → trưởng phòng). Ví dụ: chat 2 năm → tóm theo quý + 10 tin gần nhất nguyên văn.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Lợi:</b> tiết kiệm context, hợp dữ liệu rất dài.</div>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Ai trả giá:</b> có thể mất chi tiết/sắc thái; thêm khâu tiền xử lý.</div>
          </div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "10px" }}>
            <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--rose-deep)", padding: "5px 9px", borderRadius: "6px" }}>03</span>
            <h3 style={{ font: "700 18px/1.2 var(--font-brand)", color: "var(--fg-1)", margin: 0 }}>Truy hồi nâng cao (RAG)</h3>
          </div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 12px" }}>Thay vì nhồi tất cả, hệ thống <b>tìm và kéo ra chỉ phần liên quan</b> rồi mới đưa vào context. Ví dụ: khách hỏi &quot;đổi trả&quot; → chỉ kéo các đoạn chat về đổi trả.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Lợi:</b> chính xác cao, tiết kiệm token, scale tốt.</div>
            <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "9px 12px", borderRadius: "8px" }}><b>Ai trả giá:</b> phức tạp; cần Vector Database; chi phí vận hành cao hơn.</div>
          </div>
        </div>
      </div>
      <div style={{ margin: "20px 0", padding: "14px 18px", background: "var(--iris-tint)", borderRadius: "10px", font: "14px/1.6 var(--font-body)", color: "var(--iris-deep)" }}>
        <b>Ở I1.1 chỉ cần nắm ý tưởng.</b> Cơ chế RAG, embedding và vector search học sâu (kèm lab) ở <b>I3.1 — Agentic Workflows &amp; RAG</b>.
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--gold-deep)", margin: "30px 0 12px" }}>Khi nào dùng chiến lược nào</h3>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 8px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", background: "var(--bg-ink)" }}>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Tình huống</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Chiến lược</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
          <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Dữ liệu vừa phải, cần xử lý trọn vẹn</span>
          <span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: "var(--iris-deep)" }}>Chunking</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
          <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Tài liệu quá dài, không cần chi tiết vụn</span>
          <span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: "var(--gold-deep)" }}>Tóm tắt phân tầng</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
          <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Kho lớn, cần chính xác cao, có đội kỹ thuật</span>
          <span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: "var(--rose-deep)" }}>RAG</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
          <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Nội bộ, đơn giản, ngân sách hạn chế</span>
          <span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: "var(--fg-2)" }}>Chunking + Tóm tắt phân tầng</span>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "16px 0 0" }}>Điều quan trọng: <b style={{ color: "var(--fg-1)" }}>chọn chiến lược nào là một quyết định thiết kế sản phẩm</b>, không tự động xảy ra.</p>

      <TldrDark
        items={[
          <><b>Context window</b> là bộ nhớ làm việc hữu hạn; nhồi quá thì phần cũ/giữa bị &quot;trôi&quot; hoặc lơ là (<b>lost-in-the-middle</b>).</>,
          <>Ba cách thiết kế quanh giới hạn: <b>chunking</b>, <b>tóm tắt phân tầng</b>, <b>RAG</b> — mỗi cách có cái giá riêng.</>,
          <>Chọn chiến lược là <b>quyết định thiết kế sản phẩm</b> có chủ đích; chi tiết RAG để dành cho I3.1.</>,
        ]}
      />

      <SelfCheck
        items={[
          "Giải thích lost-in-the-middle và vì sao \"nhồi nhiều ≠ tốt hơn\".",
          "Với bài toán tóm tắt 400 tin chat/khách, bạn chọn chiến lược nào? Ai trả giá?",
          "Vì sao RAG chính xác và tiết kiệm token nhưng không phải mặc định ở giai đoạn intern?",
          "Cho một feature bạn đang nghĩ tới — nó đụng context window ở đâu, thiết kế quanh thế nào?",
        ]}
      />
    </div>
  );
}

function Part3View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--mint-deep)", padding: "6px 12px 0 0" }}>Ở</span>
        mỗi bước đoán token, mô hình có danh sách token khả dĩ kèm xác suất. <b>Temperature</b> quyết định nó chọn &quot;chắc ăn&quot; hay &quot;phiêu&quot; — một <i>núm điều chỉnh độ ngẫu nhiên</i>, không phải núm thông minh.
      </p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "28px 28px 22px" }}>
          <div style={{ height: "12px", borderRadius: "999px", background: "linear-gradient(90deg, var(--mint) 0%, var(--gold) 55%, var(--rose) 100%)", position: "relative", margin: "0 6px 14px" }}>
            <span style={{ position: "absolute", left: 0, top: "50%", transform: "translate(-50%,-50%)", width: "22px", height: "22px", borderRadius: "50%", background: "#fff", border: "3px solid var(--mint-deep)" }} />
            <span style={{ position: "absolute", right: 0, top: "50%", transform: "translate(50%,-50%)", width: "22px", height: "22px", borderRadius: "50%", background: "#fff", border: "3px solid var(--rose-deep)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ maxWidth: "46%" }}>
              <div style={{ font: "700 14px/1.2 var(--font-brand)", color: "var(--mint-deep)" }}>Thấp · 0–0.3</div>
              <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Ổn định, lặp lại, dễ dự đoán. Trích số liệu, viết spec, phân loại.</div>
            </div>
            <div style={{ maxWidth: "46%", textAlign: "right" }}>
              <div style={{ font: "700 14px/1.2 var(--font-brand)", color: "var(--rose-deep)" }}>Cao · 0.7–1.0</div>
              <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Đa dạng, sáng tạo, kém nhất quán. Brainstorm tên, ý tưởng.</div>
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Temperature: không phải núm thông minh, là núm <b>độ ngẫu nhiên</b>.</figcaption>
      </figure>

      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 22px" }}>
        <b style={{ color: "var(--fg-1)" }}>Lưu ý quan trọng:</b> temperature <b>không</b> làm AI thông minh hay đúng hơn về sự thật — nó chỉ chỉnh độ biến thiên. Temperature 0 vẫn có thể bịa một cách rất nhất quán.
      </p>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--mint-deep)", margin: "30px 0 12px" }}>Ví dụ đối chứng: cùng prompt, hai temperature</h3>
      <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 14px" }}>Prompt: <i>&quot;Đề xuất 5 tên cho dòng áo khoác gió đô thị của Yody.&quot;</i> (giả lập)</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "10px" }}>Temp ≈ 0.2 · chạy 2 lần</div>
          <div style={{ font: "13px/1.7 var(--font-mono)", color: "var(--fg-1)" }}>L1 — Urban Shield · City Wind · Metro Layer<br />L2 — Urban Shield · City Wind · Urban Layer</div>
          <div style={{ font: "italic 13px/1.5 var(--font-body)", color: "var(--fg-2)", marginTop: "8px" }}>→ Gần giống nhau, an toàn, hơi nhàm.</div>
        </div>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "10px" }}>Temp ≈ 0.9 · chạy 2 lần</div>
          <div style={{ font: "13px/1.7 var(--font-mono)", color: "var(--fg-1)" }}>L1 — Mây Đô Thị · WindRider · Phố Gió<br />L2 — NightBreeze · Gió Sài Gòn · MetroWrap</div>
          <div style={{ font: "italic 13px/1.5 var(--font-body)", color: "var(--fg-2)", marginTop: "8px" }}>→ Rất khác nhau, sáng tạo, có tên &quot;lạ&quot; cần lọc.</div>
        </div>
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--mint-deep)", margin: "26px 0 12px" }}>Chọn temperature theo tác vụ</h3>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 26px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr .9fr", background: "var(--bg-ink)" }}>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Loại tác vụ</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Temperature</span>
        </div>
        {[
          ["Trích xuất thông tin từ văn bản", "Thấp · 0.1–0.3", "var(--mint-deep)"],
          ["Viết mô tả sản phẩm chuẩn", "Thấp · 0.2–0.4", "var(--mint-deep)"],
          ["Phân loại review khách hàng", "Thấp · 0.1–0.2", "var(--mint-deep)"],
          ["Gợi ý câu trả lời CSKH", "TB · 0.3–0.5", "var(--gold-deep)"],
          ["Viết content marketing", "TB-cao · 0.5–0.8", "var(--gold-deep)"],
          ["Brainstorm tên sản phẩm", "Cao · 0.7–1.0", "var(--rose-deep)"],
        ].map(([label, temp, color]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "1.5fr .9fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
            <span style={{ padding: "11px 16px", font: "14px/1.4 var(--font-body)", color: "var(--fg-1)" }}>{label}</span>
            <span style={{ padding: "11px 16px", font: "600 14px/1.4 var(--font-body)", color: color as string }}>{temp}</span>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 14px" }}>Knowledge Cutoff &amp; Training Data</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>
        <b>Dữ liệu huấn luyện</b> là kho văn bản dùng để huấn luyện mô hình. <b>Mốc giới hạn kiến thức (knowledge cutoff)</b> là thời điểm dữ liệu dừng lại — mô hình &quot;không biết&quot; chuyện sau mốc đó, trừ khi bạn cung cấp thêm trong prompt hoặc qua công cụ. Muốn AI làm việc với thông tin <i>mới</i> hoặc <i>nội bộ YODY</i>, bạn phải <b>đưa dữ liệu đó vào</b> — qua prompt, RAG, hoặc tool. (Đây chính là lý do RAG tồn tại.)
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "36px 0 14px" }}>Foundation Model &amp; Embedding</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>
        <b>Mô hình nền tảng</b> là mô hình lớn, đa năng (Claude, GPT, Gemini, Llama…) làm nền cho nhiều tác vụ. Thông điệp cho builder: <b>bạn hiếm khi cần tự huấn luyện</b> — bạn <i>điều hướng</i> một foundation model mạnh bằng prompt, dữ liệu và công cụ. <b>Embedding</b> biểu diễn văn bản thành vector số sao cho <i>nội dung gần nghĩa nằm gần nhau</i>.
      </p>

      <figure style={{ margin: "20px 0 26px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px", position: "relative", height: "200px" }}>
          <span style={{ position: "absolute", top: "12px", left: "16px", font: "700 10px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--fg-3)" }}>Không gian ngữ nghĩa</span>
          <div style={{ position: "absolute", left: "16%", top: "34%", background: "var(--iris)", color: "#fff", font: "600 12px/1 var(--font-body)", padding: "7px 11px", borderRadius: "999px" }}>áo chống nắng</div>
          <div style={{ position: "absolute", left: "26%", top: "56%", background: "var(--iris)", color: "#fff", font: "600 12px/1 var(--font-body)", padding: "7px 11px", borderRadius: "999px" }}>áo chống tia UV</div>
          <div style={{ position: "absolute", left: "12%", top: "72%", background: "var(--iris)", color: "#fff", font: "600 12px/1 var(--font-body)", padding: "7px 11px", borderRadius: "999px" }}>áo che nắng</div>
          <div style={{ position: "absolute", right: "12%", top: "24%", background: "var(--rose-deep)", color: "#fff", font: "600 12px/1 var(--font-body)", padding: "7px 11px", borderRadius: "999px" }}>khóa kéo bị kẹt</div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Embedding = toạ độ ý nghĩa; gần nghĩa thì nằm gần nhau, khác chủ đề thì xa.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "36px 0 14px" }}>Fine-tuning &amp; RLHF — khi nào mới &quot;dạy thêm&quot;</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>
        <b>Fine-tuning:</b> huấn luyện thêm foundation model trên dữ liệu chuyên biệt để quen một <i>phong cách/định dạng</i> nhất định — tốn dữ liệu, tốn công, chỉ đáng khi nhu cầu lặp lại rất ổn định và prompt không đủ. <b>RLHF:</b> dùng đánh giá của con người để &quot;nắn&quot; mô hình trả lời hữu ích và an toàn hơn — lý do các trợ lý như Claude phản hồi lịch sự, bám yêu cầu.
      </p>
      <Callout tone="iris" label="Quy tắc ngón tay cái">
        <p style={{ margin: 0 }}><b>Prompt trước → RAG khi cần kiến thức ngoài/nội bộ → Fine-tuning chỉ khi hai cái trên đã đụng trần.</b></p>
      </Callout>

      <TldrDark
        items={[
          <><b>Temperature</b> chỉnh độ ngẫu nhiên (thấp = chính xác/ổn định, cao = sáng tạo) — không làm AI đúng hơn; chọn theo tác vụ.</>,
          <><b>Knowledge cutoff</b> nghĩa là AI không biết chuyện mới/nội bộ — muốn dùng phải tự đưa vào (nền của RAG).</>,
          <>Ta xây <i>trên</i> <b>foundation model</b>; <b>embedding</b> là toạ độ ngữ nghĩa; <b>fine-tuning/RLHF</b> là lựa chọn cuối.</>,
        ]}
      />

      <SelfCheck
        items={[
          "Temperature bao nhiêu khi trích số liệu? Còn khi nghĩ tên bộ sưu tập? Vì sao?",
          "Nhìn ví dụ 2 lần chạy ở temp 0.2 vs 0.9 — rút ra điều gì về \"độ tin cậy để lặp lại\"?",
          "Một bạn hỏi AI \"chính sách đổi trả mới nhất của YODY\" và dùng luôn. Rủi ro liên quan knowledge cutoff là gì?",
          "Khi nào cân nhắc RAG thay vì chỉ prompt? Khi nào mới nghĩ tới fine-tuning?",
        ]}
      />
    </div>
  );
}

function Part4View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 24px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--rose-deep)", padding: "6px 12px 0 0" }}>C</span>
       ùng một mô hình, cách bạn <i>đặt đề</i> thay đổi hẳn chất lượng kết quả. Ba kiểu nền tảng: zero-shot, few-shot và chain-of-thought.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ font: "700 17px/1.2 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "6px" }}>Zero-shot — học không ví dụ</div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 10px" }}>Ra yêu cầu trực tiếp, không kèm ví dụ. Nhanh, gọn; hợp tác vụ đơn giản, phổ biến mô hình đã quen.</p>
          <div style={{ font: "13px/1.6 var(--font-mono)", color: "var(--fg-1)", background: "var(--bg-warm)", borderRadius: "8px", padding: "11px 14px" }}>&quot;Phân loại review sau là tích cực hay tiêu cực: &apos;Áo đẹp nhưng giao hơi chậm&apos;.&quot;</div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ font: "700 17px/1.2 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "6px" }}>Few-shot — học kèm vài ví dụ</div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 10px" }}>Kèm vài ví dụ mẫu để mô hình bắt đúng <i>định dạng</i> và <i>tiêu chí</i>. Dùng khi tác vụ có quy ước riêng mà zero-shot dễ hiểu sai.</p>
          <div style={{ font: "13px/1.6 var(--font-mono)", color: "var(--fg-1)", background: "var(--bg-warm)", borderRadius: "8px", padding: "11px 14px" }}>&apos;Vải mát, đáng tiền&apos; → Tích cực<br />&apos;Chờ 2 tuần chưa nhận&apos; → Tiêu cực<br />Giờ phân loại: &apos;Áo đẹp nhưng giao hơi chậm&apos; →</div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ font: "700 17px/1.2 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "6px" }}>Chain-of-thought — chuỗi suy luận</div>
          <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 10px" }}>Yêu cầu mô hình <i>trình bày các bước suy luận</i> trước khi kết luận. Hữu ích cho bài toán nhiều ràng buộc — giảm lỗi &amp; cho bạn thấy nó sai ở bước nào.</p>
          <div style={{ font: "13px/1.6 var(--font-mono)", color: "var(--fg-1)", background: "var(--bg-warm)", borderRadius: "8px", padding: "11px 14px" }}>&quot;…phân loại và giải thích ngắn vì sao, rồi mới đưa nhãn cuối.&quot;</div>
        </div>
      </div>
      <div style={{ margin: "20px 0 30px", padding: "14px 18px", background: "var(--rose-tint)", borderRadius: "10px", font: "15px/1.6 var(--font-body)", color: "var(--rose-deep)" }}>
        <b>Chọn nhanh:</b> quen &amp; đơn giản → zero-shot · cần đúng format/tiêu chí riêng → few-shot · cần lập luận nhiều bước → chain-of-thought.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>Cây quyết định: Prompt vs RAG vs Fine-tuning</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 22px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "18px 20px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>1</span>
          <div>
            <div style={{ font: "700 16px/1.3 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "4px" }}>Chỉ cần ngôn ngữ/lập luận chung? → PROMPT</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Viết, tóm tắt, phân loại, trích xuất. Dùng zero/few-shot/CoT. Dừng ở đây nếu đủ.</div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "var(--fg-3)" }}>{arrowDownIcon}</div>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--gold)", borderRadius: "12px", background: "var(--gold-tint)", padding: "18px 20px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>2</span>
          <div>
            <div style={{ font: "700 16px/1.3 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "4px" }}>Cần thông tin NGOÀI training data? → thêm RAG</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Tài liệu nội bộ YODY, dữ liệu mới, kho sản phẩm. Nạp tài liệu + truy hồi đúng mảnh vào context. Prompt vẫn là lõi.</div>
          </div>
        </div>
        <div style={{ textAlign: "center", color: "var(--fg-3)" }}>{arrowDownIcon}</div>
        <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "18px 20px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--rose-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>3</span>
          <div>
            <div style={{ font: "700 16px/1.3 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "4px" }}>Cần phong cách/định dạng cực ổn định, prompt + RAG vẫn chưa đạt? → cân nhắc FINE-TUNING</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Đắt, chậm, ít khi cần ở giai đoạn intern. Chỉ khi có đủ dữ liệu chất lượng.</div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "0 0 26px" }}>
        <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}><b style={{ color: "var(--fg-1)" }}>1. Luôn thử Prompt trước.</b> Rẻ nhất, nhanh nhất, đủ cho phần lớn bài toán.</div>
        <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}><b style={{ color: "var(--fg-1)" }}>2. RAG giải quyết vấn đề kiến thức, không phải kỹ năng.</b> AI viết dở thì RAG không cứu; AI thiếu thông tin thì RAG mới đúng thuốc.</div>
        <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}><b style={{ color: "var(--fg-1)" }}>3. Fine-tuning là phương án cuối.</b> Trước đó hãy chắc đã tối ưu prompt và thử RAG.</div>
      </div>
      <Callout tone="iris" label="Ví dụ YODY · giả lập">
        <div style={{ font: "15px/1.8 var(--font-body)", color: "var(--fg-1)" }}>
          • &quot;Viết mô tả sản phẩm từ thông số cho sẵn&quot; → <b>Prompt</b>.<br />
          • &quot;Trả lời khách dựa trên chính sách đổi trả nội bộ&quot; → <b>RAG</b>.<br />
          • &quot;Sinh hàng loạt caption đúng giọng thương hiệu, ổn định tuyệt đối ở quy mô nghìn/ngày&quot; → <i>cân nhắc</i> <b>fine-tuning</b> (thử few-shot kỹ trước).
        </div>
      </Callout>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>Chốt lại tư duy nền của buổi I1.1</h2>
      <p style={{ font: "italic 600 22px/1.5 var(--font-serif)", color: "var(--fg-1)", margin: "0 0 18px" }}>AI là hạ tầng có ràng buộc, không phải phép màu vô hạn.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", margin: "0 0 8px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px", textAlign: "center" }}>
          <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "8px" }}>DATABASE</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>giới hạn dung lượng · tốc độ</div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px", textAlign: "center" }}>
          <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "8px" }}>API</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>rate limit · latency</div>
        </div>
        <div style={{ border: "2px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px", textAlign: "center" }}>
          <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "8px" }}>AI</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>độ tin cậy · ngữ cảnh · chi phí · độ trễ</div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "16px 0 0" }}>
        Product Builder giỏi là người <i>thiết kế quanh</i> các giới hạn đó — biết chọn cách ra đề, biết khi nào cần RAG, luôn truy nguồn cho dữ kiện. Đó là nền để sang <b>I1.2</b> nói về hallucination, an toàn dữ liệu (PII) và tư duy đo lường kết quả.
      </p>

      <TldrDark
        items={[
          <><b>Zero / few-shot / chain-of-thought</b>: đơn giản → zero, cần format/tiêu chí riêng → few, cần lập luận → CoT.</>,
          <>Thứ tự giải pháp: <b>Prompt → RAG (khi thiếu kiến thức) → Fine-tuning (phương án cuối)</b>.</>,
          <>AI là <b>hạ tầng có ràng buộc</b>; giá trị của builder nằm ở thiết kế quanh giới hạn và luôn truy nguồn.</>,
        ]}
      />

      <div style={{ margin: "0 0 30px", padding: "22px 26px", border: "1px solid var(--mint)", borderRadius: "14px", background: "var(--mint-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--mint-deep)", marginBottom: "4px" }}>Bạn đã hoàn thành nền tảng NL4 🎉</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Làm Final Exam để chốt gate trước khi sang I1.2.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", font: "600 14px/44px var(--font-body)", textDecoration: "none", background: "var(--mint-deep)", border: "1px solid var(--mint-deep)", color: "#fff", borderRadius: "8px", display: "inline-flex", alignItems: "center" }}>Làm Final Exam →</a>
      </div>

      <SelfCheck
        items={[
          "Cho ba tác vụ ở YODY, mỗi tác vụ nên dùng zero-shot, few-shot hay CoT? Giải thích.",
          "Một bạn định fine-tuning để \"AI trả lời đúng chính sách đổi trả\". Bạn phản biện thế nào?",
          "Vẽ lại (bằng lời) cây quyết định Prompt / RAG / Fine-tuning cho một bài toán bạn tự nghĩ ra.",
          "\"AI là hạ tầng có ràng buộc\" — nêu 2 giới hạn cụ thể và cách bạn thiết kế quanh chúng.",
        ]}
      />
    </div>
  );
}

function ReadScreen({ state, go }: { state: LessonState; go: (p: Page, part?: number) => void }) {
  const cur = PART_META[state.part];

  const toc = PART_META.map((m, i) => ({
    n: m.n,
    title: m.title,
    time: m.time,
    c: m.c,
    active: i === state.part,
  }));

  const prevArr: { title: string; open: () => void }[] = [
    { title: "Tổng quan buổi", open: () => go("overview") },
    { title: "LLM & Token", open: () => go("read", 0) },
    { title: "Context Window", open: () => go("read", 1) },
    { title: "Tham số & Giới hạn", open: () => go("read", 2) },
  ];
  const nextArr: { title: string; kicker: string; color: string; open: () => void }[] = [
    { title: "Context Window", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 1) },
    { title: "Tham số & Giới hạn", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 2) },
    { title: "Cách tư duy AI", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 3) },
    { title: "Làm Final Exam →", kicker: "HOÀN THÀNH · GATE", color: "var(--gold-deep)", open: () => go("exam") },
  ];

  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i11-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i11-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          {backIcon}Tổng quan buổi I1.1
        </a>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "14px" }}>Nội dung · 4 phần</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {toc.map((t, i) => (
            <a
              key={t.n}
              href="#"
              onClick={(e) => { e.preventDefault(); go("read", i); }}
              className="kh-toc"
              style={{ display: "flex", gap: "12px", alignItems: "baseline", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", background: t.active ? "#fff" : "transparent" }}
            >
              <span style={{ font: "italic 800 17px/1 var(--font-serif)", color: t.c, width: "24px", flex: "none" }}>{t.n}</span>
              <span style={{ flex: 1, font: t.active ? "700 14px/1.35 var(--font-body)" : "500 14px/1.35 var(--font-body)", color: t.active ? "var(--fg-1)" : "var(--fg-2)" }}>{t.title}</span>
              <span style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)", whiteSpace: "nowrap" }}>{t.time}</span>
            </a>
          ))}
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--gold-deep)", background: "var(--gold-tint)" }}>
            <span style={{ color: "var(--gold-deep)", flex: "none", display: "flex" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Final Exam</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I1.1</a>
            {chevron}
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{cur.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "700 12px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: cur.cDeep, marginBottom: "12px" }}>
            <span>Phần {cur.n} / 4</span>
            <span style={{ opacity: ".4" }}>·</span>
            <span>{cur.time} đọc</span>
          </div>
          <h1 style={{ font: "800 clamp(36px,4.6vw,54px)/1.04 var(--font-impact)", letterSpacing: "-.026em", margin: "0 0 34px", color: "var(--fg-1)" }}>{cur.title}</h1>

          {state.part === 0 && <Part1View />}
          {state.part === 1 && <Part2View />}
          {state.part === 2 && <Part3View />}
          {state.part === 3 && <Part4View go={go} />}

          <div style={{ display: "flex", gap: "16px", marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); prev.open(); }} className="kh-nav" style={{ flex: 1, textDecoration: "none" }}>
              <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "5px" }}>← TRƯỚC</div>
              <div style={{ font: "700 16px/1.25 var(--font-impact)", color: "var(--fg-1)" }}>{prev.title}</div>
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); next.open(); }} className="kh-nav" style={{ flex: 1, textAlign: "right", textDecoration: "none" }}>
              <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "5px" }}>{next.kicker}</div>
              <div style={{ font: "700 16px/1.25 var(--font-impact)", color: next.color }}>{next.title}</div>
            </a>
          </div>
        </article>
      </main>
    </div>
  );
}

function ExamScreen({ state, go, pick, submit, reset }: { state: LessonState; go: (p: Page) => void; pick: (qi: number, oi: number) => void; submit: () => void; reset: () => void }) {
  const score = EXAM.reduce((acc, Q, qi) => acc + (state.answers[qi] === Q.correct ? 1 : 0), 0);
  const passed = score >= PASS_SCORE;
  const answered = Object.keys(state.answers).length;
  const cursor = state.submitted ? "default" : "pointer";

  const result = passed
    ? { title: "Đạt — sẵn sàng sang I1.2 🎉", msg: `Bạn đạt ngưỡng ${PASS_SCORE}/20. Có thể tiếp tục buổi I1.2 — Outcome Thinking & PII.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Đọc lại phần tương ứng câu sai (xem giải thích bên dưới) rồi làm lại.`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        {backIcon}Tổng quan buổi I1.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test gate · trước khi sang I1.2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>
        Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I1.1</span>
      </h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>
        20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.
      </p>

      {state.submitted && (
        <div style={{ border: `2px solid ${result.border}`, background: result.bg, borderRadius: "16px", padding: "26px 30px", marginBottom: "34px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ font: "italic 800 64px/1 var(--font-serif)", color: result.color }}>
            {score}<span style={{ font: "800 26px/1 var(--font-impact)", color: "var(--fg-3)" }}>/20</span>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ font: "700 22px/1.2 var(--font-impact)", color: result.color, marginBottom: "6px" }}>{result.title}</div>
            <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{result.msg}</div>
          </div>
          <button onClick={reset} className="cta" style={{ height: "44px", padding: "0 22px", fontSize: "14px", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)", cursor: "pointer", borderRadius: "8px", font: "600 14px/44px var(--font-body)" }}>Làm lại</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {EXAM.map((Q, qi) => (
          <div key={qi} style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
              <span style={{ font: "italic 800 22px/1 var(--font-serif)", color: "var(--iris)" }}>{qi + 1}</span>
              <span style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-3)" }}>{Q.part}</span>
            </div>
            <p style={{ font: "600 17px/1.5 var(--font-body)", color: "var(--fg-1)", margin: "0 0 16px" }}>{Q.q}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
              {Q.opts.map((text, oi) => {
                const letter = "ABCD"[oi];
                const sel = state.answers[qi];
                let bg = "#fff";
                let border = "var(--border)";
                let fg = "var(--fg-1)";
                let mark = "";
                let markColor = "transparent";
                let badgeBg = "var(--bg-muted)";
                let badgeFg = "var(--fg-2)";

                if (state.submitted) {
                  if (oi === Q.correct) {
                    bg = "var(--mint-tint)"; border = "var(--mint)"; fg = "var(--mint-deep)"; mark = "✓"; markColor = "var(--mint-deep)"; badgeBg = "var(--mint)"; badgeFg = "#fff";
                  } else if (oi === sel) {
                    bg = "var(--rose-tint)"; border = "var(--rose-deep)"; fg = "var(--rose-deep)"; mark = "✕"; markColor = "var(--rose-deep)"; badgeBg = "var(--rose-deep)"; badgeFg = "#fff";
                  } else {
                    fg = "var(--fg-3)";
                  }
                } else if (oi === sel) {
                  bg = "var(--iris-tint)"; border = "var(--iris)"; fg = "var(--iris-deep)"; badgeBg = "var(--iris)"; badgeFg = "#fff";
                }

                return (
                  <button
                    key={oi}
                    onClick={() => pick(qi, oi)}
                    className="kh-opt"
                    style={{ display: "flex", alignItems: "flex-start", gap: "13px", textAlign: "left", width: "100%", boxSizing: "border-box", padding: "13px 15px", borderRadius: "10px", border: `1.5px solid ${border}`, background: bg, cursor, fontFamily: "var(--font-body)" }}
                  >
                    <span style={{ width: "24px", height: "24px", flex: "none", borderRadius: "6px", background: badgeBg, color: badgeFg, font: "700 12px/24px var(--font-numeric)", textAlign: "center" }}>{letter}</span>
                    <span style={{ flex: 1, font: "15px/1.5 var(--font-body)", color: fg }}>{text}</span>
                    <span style={{ font: "800 15px/1.6 var(--font-body)", color: markColor }}>{mark}</span>
                  </button>
                );
              })}
            </div>
            {state.submitted && (
              <div style={{ marginTop: "13px", padding: "12px 15px", background: "var(--bg-warm)", borderRadius: "9px", font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>
                <b style={{ color: "var(--fg-1)" }}>Vì sao:</b> {Q.why}
              </div>
            )}
          </div>
        ))}
      </div>

      {!state.submitted && (
        <div style={{ position: "sticky", bottom: 0, marginTop: "26px", padding: "18px 0", background: "linear-gradient(to top, var(--bg-warm) 60%, transparent)", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <button onClick={submit} className="cta cta-primary" style={{ height: "48px", padding: "0 30px", fontSize: "15px", cursor: "pointer", background: "var(--iris-deep)", border: "1px solid var(--iris-deep)", color: "#fff", borderRadius: "8px", font: "600 15px/48px var(--font-body)" }}>Nộp bài &amp; chấm điểm</button>
          <span style={{ font: "500 14px/1.4 var(--font-body)", color: "var(--fg-3)" }}>
            Đã trả lời <b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>{answered}</b> / 20 câu
          </span>
        </div>
      )}
    </div>
  );
}

export function LessonI11() {
  const [state, setState] = useState<LessonState>({
    page: "overview",
    part: 0,
    answers: {},
    submitted: false,
  });

  const go = (page: Page, part?: number) => {
    setState((s) => ({
      ...s,
      page,
      part: typeof part === "number" ? part : s.part,
    }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const pick = (qi: number, oi: number) => {
    if (state.submitted) return;
    setState((s) => ({ ...s, answers: { ...s.answers, [qi]: oi } }));
  };

  const submit = () => {
    setState((s) => ({ ...s, submitted: true }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const reset = () => {
    setState((s) => ({ ...s, answers: {}, submitted: false }));
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)" }}>
      {state.page === "overview" && <OverviewScreen go={go} />}
      {state.page === "read" && <ReadScreen state={state} go={go} />}
      {state.page === "exam" && <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />}
    </div>
  );
}