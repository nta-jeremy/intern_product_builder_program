"use client";

import { useState } from "react";

type Page = "overview" | "read" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
}

const PASS_SCORE = 16;
const PASS_PCT = "80%";

const PART_META = [
  { n: "01", short: "System Prompt & Output", title: "System Prompt & Structured Output", time: "~18 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Kỹ thuật prompt & Iterate", title: "Kỹ thuật prompt & Iterate có chẩn đoán", time: "~18 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "03", short: "Multimodal, Tool Use & API", title: "Multimodal, Tool Use & API", time: "~15 phút", c: "var(--rose)", cDeep: "var(--rose-deep)", tint: "var(--rose-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Prompt là artifact kỹ thuật; system prompt (vai trò · định dạng · ràng buộc); structured output (bảng/JSON/template) để output dùng được ngay.", tags: ["Artifact", "System prompt", "Structured output"] },
  { ...PART_META[1], desc: "Zero/few-shot, chain-of-thought, task decomposition, context injection và iterate có chẩn đoán + cheat sheet 4 mẫu prompt.", tags: ["CoT", "Decomposition", "Iterate"] },
  { ...PART_META[2], desc: "Multimodal (văn bản + hình ảnh), tool use / function calling, API là gì và khi nào cần tool/API thay vì chỉ prompt.", tags: ["Multimodal", "Tool use", "API"] },
];

const OBJECTIVES = [
  "Thiết kế system prompt có cấu trúc: vai trò, định dạng đầu ra, ràng buộc kỹ thuật để output ổn định.",
  "Yêu cầu structured output (bảng/JSON/template) để kết quả dùng được ngay và dễ QC.",
  "Áp dụng linh hoạt zero/few-shot, chain-of-thought, task decomposition, context injection cho bài toán thật.",
  "Iterate có chẩn đoán: khi output sai, xác định đúng nguyên nhân và sửa đúng chỗ trong ≤2 lần.",
  "Kết hợp multimodal (văn bản + hình ảnh), hiểu tool use / function calling và API — biết khi nào nên dùng.",
];

const MUST_KNOW = ["Prompt Engineering", "System Prompt", "Zero/Few-shot", "Chain-of-thought", "Structured output", "Tool Use / Function Calling", "Multimodal"];
const NICE_KNOW = ["API", "MCP (chỉ nhắc tên)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~51 phút" },
  { k: "Giai đoạn", v: "1 · Tuần 1–4" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL5 🔒" },
  { k: "Gate", v: "— (tích lũy L2)" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

const clockIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const bookIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);
const listIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
);
const checkSmIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
);
const checklistIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--iris-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
);
const chevR = (size = 14) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);

const PIPELINE = ["Bước 1", "Bước 2", "Bước 3", "Bước 4", "Bước 5"];

const ITER_TABLE = [
  { s: "Chung chung, không sát YODY, như sách giáo khoa", c: "Thiếu context injection", f: "Thêm đối tượng, ràng buộc, mục tiêu, giọng" },
  { s: "Bỏ sót yêu cầu, lẫn lộn các phần, làm sơ sài", c: "Nhồi yêu cầu trong 1 lượt, thiếu phân rã", f: "Chẻ thành chuỗi bước có input/output" },
  { s: "Số liệu/logic sai nhưng \"nghe hợp lý\", không rõ sai đâu", c: "Thiếu CoT hoặc không đọc chuỗi suy luận", f: "Thêm \"trình bày từng bước\" + đọc kỹ" },
  { s: "Mỗi lần một định dạng, khó QC/so sánh", c: "Thiếu structured output", f: "Khai báo schema, yêu cầu bỏ lời dẫn thừa" },
];

const CHEAT = [
  { t: "Chain-of-Thought", k: "\"Trình bày suy luận từng bước trước khi kết luận.\"" },
  { t: "Task Decomposition", k: "\"Làm theo bước: Bước 1… → Bước 2… → Bước N…; hiện kết quả từng bước.\"" },
  { t: "Context Injection", k: "\"Bối cảnh YODY: đối tượng khách hàng… · ràng buộc… · mục tiêu… · giọng…\"" },
  { t: "Structured Output", k: "\"Trả về đúng bảng/JSON sau, yêu cầu lược bỏ hoàn toàn lời dẫn thừa: …\"" },
];

const WHEN_TABLE = [
  { sit: "Viết, tóm tắt, phân loại, brainstorm trên dữ liệu bạn dán vào", how: "Chỉ cần prompt", c: "var(--iris-deep)" },
  { sit: "Cần dữ liệu thật/cập nhật (tồn kho, đơn hàng, doanh số)", how: "Tool use / function calling", c: "var(--gold-deep)" },
  { sit: "Cần AI chạy tự động trong một feature/sản phẩm, quy mô lớn", how: "Gọi qua API", c: "var(--mint-deep)" },
  { sit: "Cần AI dùng kho tài liệu nội bộ để trả lời", how: "RAG + MCP → học ở I3.1", c: "var(--rose-deep)" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · System Prompt & Output";
const B = "Phần B · Kỹ thuật & Iterate";
const C = "Phần C · Multimodal/Tool/API";
const EXAM: ExamQ[] = [
  { part: A, q: "Builder coi một prompt là gì?", opts: ["Một câu nói tuỳ hứng, sai thì nói lại kiểu khác", "Một sản phẩm kỹ thuật (artifact) như một hàm: đầu vào → bước xử lý → đầu ra theo schema", "Một đoạn mã lập trình chạy trực tiếp", "Một tài liệu pháp lý"], correct: 1, why: "Builder coi prompt là artifact kỹ thuật (input → xử lý → output schema), không phải câu nói thông thường." },
  { part: A, q: "Một system prompt tốt xác định rõ ba trục nào?", opts: ["Vai trò · định dạng đầu ra · ràng buộc", "Nhiệt độ · token · chi phí", "Màu sắc · font · bố cục", "Tên · tuổi · địa chỉ"], correct: 0, why: "System prompt tốt xác định: vai trò · định dạng đầu ra · ràng buộc." },
  { part: A, q: "Vì sao nên tách system prompt khỏi user prompt?", opts: ["Để tiêu thụ ít token hơn", "Để AI trả lời nhanh hơn", "Đặt khung ổn định dùng lại nhiều lượt → kết quả nhất quán khi chạy cùng tác vụ nhiều lần", "Để giấu prompt khỏi người dùng"], correct: 2, why: "Tách system prompt tạo khung làm việc ổn định dùng lại → kết quả nhất quán qua nhiều lượt." },
  { part: A, q: "Structured output là gì?", opts: ["Viết prompt thật dài", "Tăng tham số ngẫu nhiên (temperature) để đa dạng", "Để AI tự chọn cách trình bày", "Ép AI trả về theo schema định sẵn (bảng/JSON/template)"], correct: 3, why: "Structured output = ép trả về theo schema định sẵn (bảng/JSON/template)." },
  { part: A, q: "Lợi ích chính của structured output?", opts: ["Làm nội dung sáng tạo hơn", "Output cắm thẳng vào quy trình, QC nhanh, so sánh được qua nhiều lần", "Loại bỏ hoàn toàn lỗi ảo tưởng (hallucination)", "Không cần phải tự mình đọc và kiểm duyệt lại kết quả"], correct: 1, why: "Lợi ích: cắm thẳng vào quy trình, QC nhanh, so sánh được (không loại bỏ hallucination)." },
  { part: A, q: "Mẹo nào ĐÚNG khi dùng structured output?", opts: ["Khai báo schema TRƯỚC khi đặt yêu cầu + thêm \"không thêm lời dẫn ngoài schema\"", "Khai báo schema sau khi AI đã trả lời", "Để AI tự quyết định số cột", "Luôn dùng văn xuôi dài cho đẹp"], correct: 0, why: "Khai báo schema trước + \"yêu cầu lược bỏ hoàn toàn lời dẫn thừa\"." },
  { part: B, q: "Few-shot nên dùng khi nào?", opts: ["Khi muốn output ngắn nhất có thể", "Khi cần AI trả lời nhanh", "Khi tác vụ có quy ước nhãn/định dạng riêng mà zero-shot dễ hiểu sai", "Khi không có dữ liệu nào"], correct: 2, why: "Few-shot dùng khi có quy ước nhãn/format riêng mà zero-shot dễ hiểu sai." },
  { part: B, q: "Chain-of-Thought (CoT) là gì?", opts: ["Cho AI trả đáp số ngay lập tức", "Tăng số token tối đa của mô hình", "Kèm thật nhiều ví dụ mẫu", "Buộc AI trình bày các bước suy luận trước khi kết luận"], correct: 3, why: "CoT = buộc AI trình bày các bước suy luận trước khi kết luận." },
  { part: B, q: "Lợi ích quan trọng nhất của CoT với builder là gì?", opts: ["Làm output ngắn hơn", "Nhìn thấy AI sai ở bước nào để sửa đúng chỗ", "Giảm chi phí token", "Cho phép bỏ qua việc kiểm chứng"], correct: 1, why: "Lợi ích lớn với builder: thấy AI sai ở bước nào để sửa đúng chỗ." },
  { part: B, q: "\"CoT mượt mà không có nghĩa là đúng\" — quy tắc L2 là gì?", opts: ["Đọc chuỗi suy luận, không chỉ đọc đáp số, đặc biệt các bước có con số", "Tin AI vì nó viết mạch lạc", "Chỉ cần đọc bảng kết quả cuối", "Tăng tham số ngẫu nhiên (temperature) để tăng độ chính xác"], correct: 0, why: "Quy tắc L2: đọc chuỗi suy luận, không chỉ đọc đáp số (nhất là bước có số)." },
  { part: B, q: "Task decomposition giải quyết vấn đề gì của prompt \"nhồi 1-lượt\"?", opts: ["Output quá ngắn", "AI trả lời quá chậm", "AI làm sơ sài, bỏ sót yêu cầu (nhất là ở giữa), lẫn lộn các phần", "Tốn quá ít token"], correct: 2, why: "Nhồi 1-lượt khiến AI sơ sài, bỏ sót (nhất là yêu cầu giữa), lẫn lộn → cần phân rã." },
  { part: B, q: "Nguyên tắc phân rã (decomposition) đúng là gì?", opts: ["Càng nhiều bước càng tốt", "Luôn chẻ thành đúng 10 bước", "Không bao giờ nên phân rã", "Phân rã đủ để kiểm soát, không vụn quá; nếu chỉ cần kết quả cuối thì không tách"], correct: 3, why: "Phân rã đủ để kiểm soát, không vụn; chỉ cần kết quả cuối thì không tách." },
  { part: B, q: "Output \"chung chung, nghe như sách giáo khoa\" là triệu chứng thiếu gì?", opts: ["Thiếu structured output", "Thiếu context injection", "Thiếu chain-of-thought", "Mô hình bị giới hạn số lượng token"], correct: 1, why: "Output chung chung như sách giáo khoa = thiếu truyền ngữ cảnh (context injection)." },
  { part: B, q: "Context injection gồm bốn trục nào?", opts: ["Đối tượng · ràng buộc vận hành · mục tiêu · giọng thương hiệu", "Token · temperature · cửa sổ ngữ cảnh · chi phí", "Vai trò · JSON · bảng · template", "Tên · SĐT · địa chỉ · email"], correct: 0, why: "Context injection: đối tượng · ràng buộc vận hành · mục tiêu · giọng thương hiệu." },
  { part: B, q: "Chuẩn iterate của Level 2 là gì?", opts: ["Sửa mò đến khi nào được thì thôi", "Viết lại toàn bộ prompt mỗi lần", "Chẩn đoán nguyên nhân → sửa đúng chỗ → đạt trong ≤2 lần; lưu lại v1/v2", "Không cần iterate, chạy 1 lần là xong"], correct: 2, why: "Chuẩn L2: chẩn đoán → sửa đúng chỗ → ≤2 lần; lưu v1/v2 (nguyên liệu Gate 2)." },
  { part: C, q: "Multimodal nghĩa là gì?", opts: ["Dùng nhiều mô hình AI cùng lúc", "Trả lời được nhiều ngôn ngữ", "Chạy trên nhiều máy chủ", "Mô hình xử lý được nhiều loại đầu vào — phổ biến nhất là văn bản + hình ảnh"], correct: 3, why: "Multimodal = xử lý nhiều loại đầu vào, phổ biến là văn bản + hình ảnh." },
  { part: C, q: "Khi đưa ảnh screenshot review (có thông tin khách) cho AI phân loại, việc cần làm TRƯỚC là gì?", opts: ["Tăng tham số ngẫu nhiên (temperature)", "Ẩn PII trong ảnh trước khi đưa vào AI", "Dịch review sang tiếng Anh", "Không cần làm gì"], correct: 1, why: "Ảnh có thông tin khách → ẩn PII trong ảnh trước khi đưa vào AI (nhắc lại I1.2)." },
  { part: C, q: "Tool Use / Function Calling giúp gì?", opts: ["Cho AI gọi công cụ/hàm để lấy dữ liệu thật thay vì bịa → giảm lỗi ảo tưởng số liệu", "Làm AI viết văn hay hơn", "Cửa sổ ngữ cảnh (context window) lớn hơn", "Luôn luôn giảm chi phí token"], correct: 0, why: "Tool use/function calling cho AI gọi công cụ lấy số thật → giảm hallucination số liệu." },
  { part: C, q: "API là gì trong việc build một feature AI?", opts: ["Một loại prompt đặc biệt", "Một mô hình AI mới", "Cổng kết nối giúp phần mềm gọi mô hình tự động (gửi prompt, nhận kết quả), chi phí tính theo số lượng token", "Một bộ lọc PII"], correct: 2, why: "API = cổng kết nối giúp phần mềm gọi mô hình tự động, chi phí tính theo token." },
  { part: C, q: "Khi nào cần tool use thay vì chỉ dùng prompt?", opts: ["Khi viết mô tả sản phẩm từ thông số cho sẵn", "Khi tóm tắt các review đã dán vào prompt", "Khi brainstorm tên bộ sưu tập", "Khi cần dữ liệu thật/cập nhật (tồn kho, đơn hàng, doanh số)"], correct: 3, why: "Cần tool use khi phải lấy dữ liệu thật/cập nhật; các tác vụ khác chỉ cần prompt." },
];

function TldrDark({ items }: { items: string[] }) {
  return (
    <div style={{ margin: "36px 0", padding: "26px 28px", background: "var(--bg-ink)", borderRadius: "14px" }}>
      <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Tóm tắt 3 ý</div>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "#e6e7f2", font: "16px/1.7 var(--font-body)", display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}
      </ol>
    </div>
  );
}

function SelfCheck({ items }: { items: string[] }) {
  return (
    <>
      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 14px" }}>Tự kiểm tra</h2>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "var(--fg-2)", font: "16px/1.75 var(--font-body)", display: "flex", flexDirection: "column", gap: "8px" }}>
        {items.map((it, i) => <li key={i} dangerouslySetInnerHTML={{ __html: it }} />)}
      </ol>
    </>
  );
}

export function LessonI21() {
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
    <div
      data-surface="portal"
      style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)" }}
    >
      {state.page === "overview" && <OverviewScreen go={go} />}
      {state.page === "read" && <ReadScreen state={state} go={go} />}
      {state.page === "exam" && (
        <ExamScreen
          state={state}
          go={go}
          pick={pick}
          submit={submit}
          reset={reset}
        />
      )}
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I2.1">
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "20px 44px 0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          font: "500 13px/1 var(--font-body)",
          color: "var(--fg-3)",
          flexWrap: "wrap",
        }}
      >
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 1 · Tuần 1–4</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I2.1 · Mở đầu L2</span>
      </div>

      <div
        className="i21-overview-grid"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding: "14px 44px 96px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "56px",
          alignItems: "start",
        }}
      >
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I2.1 · Level L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>🔒 NL5 · Must-pass</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Prompt Engineering &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Tool Use</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Đây là buổi bạn chuyển từ <b style={{ color: "var(--fg-1)" }}>người dùng AI</b> (gõ một câu rồi hy vọng) sang <b style={{ color: "var(--fg-1)" }}>người xây dựng điều khiển AI</b> (thiết kế prompt như một sản phẩm kỹ thuật kiểm soát được). NL5 là năng lực thực thi nền tảng nhất của một vibe coder — và là <em style={{ fontStyle: "italic" }}>tiêu chí bắt buộc để tốt nghiệp</em>.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~51</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>3</b> phần đọc + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              NL5 là kỹ năng thực thi nền tảng nhất của một lập trình viên tối ưu hiệu suất (vibe coder) và là <b style={{ color: "var(--fg-1)" }}>tiêu chí bắt buộc đạt (must-pass)</b>. Nếu prompt của bạn hoạt động không ổn định hoặc không thể tái tạo kết quả, thì mọi thứ xây dựng trên nó đều sẽ lung lay. Buổi này biến prompt từ "câu nói" thành một artifact có thể kiểm soát, kiểm thử và tái sử dụng.
            </p>
          </section>

          <section style={{ marginTop: "44px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 18px" }}>Mục tiêu — kết thúc buổi, bạn có thể…</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
              {OBJECTIVES.map((o, i) => (
                <div key={i} style={{ display: "flex", gap: "13px", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--mint)", flex: "none" }}>{checkSmIcon}</span>
                  <span style={{ font: "16px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{o}</span>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "52px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "22px" }}>
              <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: 0 }}>Nội dung buổi học</h2>
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~51 phút</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {PARTS.map((p, i) => (
                <a
                  key={i}
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
                      {p.tags.map((t, ti) => (
                        <span key={ti} style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".04em", color: p.cDeep, background: p.tint, padding: "6px 10px", borderRadius: "6px" }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "40px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{checklistIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang I2.2 (~20 phút). Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I2.2 — Design Thinking</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: "23px" }}>📚</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "7px" }}>Chuẩn bị cho Gate 2 · I2.3</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Lưu prompt library cá nhân</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Toàn bộ prompt bạn viết và cải thiện (iterate) ở buổi này nên lưu vào một tệp thư viện prompt cá nhân — đây là nguyên liệu trực tiếp cho <b style={{ color: "var(--fg-1)" }}>Gate 2 ở I2.3</b>. Ghi cả v1/v2 kèm lý do sửa.</p>
              </div>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Phải biết (must-pass)</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
              {MUST_KNOW.map((t, i) => (
                <span key={i} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Biết thêm</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {NICE_KNOW.map((t, i) => (
                <span key={i} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>MCP chỉ nhắc tên ở buổi này — cơ chế và thực hành học sâu ở I3.1.</p>
          </section>
        </main>

        <aside style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: "1px solid var(--fg-1)", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
            <div style={{ height: "7px", background: "var(--iris)" }} />
            <div style={{ padding: "24px" }}>
              <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "18px" }}>Thông tin buổi học</div>
              {META.map((m, i) => (
                <div key={i} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "14px", padding: "11px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ font: "14px/1.4 var(--font-body)", color: "var(--fg-3)" }}>{m.k}</span>
                  <span style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--fg-1)", textAlign: "right" }}>{m.v}</span>
                </div>
              ))}
              <a href="#" onClick={(e) => { e.preventDefault(); go("read", 0); }} className="cta cta-primary" style={{ width: "100%", boxSizing: "border-box", justifyContent: "center", height: "46px", fontSize: "15px", textDecoration: "none", marginTop: "20px" }}>Bắt đầu · Phần 1</a>
              <div style={{ textAlign: "center", font: "13px/1.4 var(--font-body)", color: "var(--fg-3)", marginTop: "12px" }}>Công khai · không cần đăng nhập</div>
            </div>
          </div>
          <div style={{ border: "1px dashed var(--border)", borderRadius: "12px", padding: "18px 20px", background: "var(--iris-tint)" }}>
            <div style={{ font: "700 12px/1.3 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "6px" }}>Vị trí lộ trình</div>
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I1.2 (đã qua Gate 1)</b> → trước <b style={{ color: "var(--fg-1)" }}>I2.2 — Design Thinking</b>. Buổi tích lũy mở đầu cấp độ L2.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReadScreen({
  state,
  go,
}: {
  state: LessonState;
  go: (p: Page, part?: number) => void;
}) {
  const cur = PART_META[state.part];
  const prevArr = [
    { title: "Tổng quan buổi", open: () => go("overview") },
    { title: "System Prompt & Structured Output", open: () => go("read", 0) },
    { title: "Kỹ thuật prompt & Iterate", open: () => go("read", 1) },
  ];
  const nextArr = [
    { title: "Kỹ thuật prompt & Iterate", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 1) },
    { title: "Multimodal, Tool Use & API", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 2) },
    { title: "Final Exam · 20 câu →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("exam") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i21-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i21-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.1
        </a>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "14px" }}>Nội dung · 3 phần</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
          {PART_META.map((m, i) => {
            const active = i === state.part;
            return (
              <a key={i} href="#" onClick={(e) => { e.preventDefault(); go("read", i); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "baseline", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", background: active ? "#fff" : "transparent" }}>
                <span style={{ font: "italic 800 17px/1 var(--font-serif)", color: m.c, width: "24px", flex: "none" }}>{m.n}</span>
                <span style={{ flex: 1, font: `${active ? "700" : "500"} 14px/1.35 var(--font-body)`, color: active ? "var(--fg-1)" : "var(--fg-2)" }}>{m.short}</span>
                <span style={{ font: "500 11px/1 var(--font-mono)", color: "var(--fg-3)", whiteSpace: "nowrap" }}>{m.time}</span>
              </a>
            );
          })}
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{checklistIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Final Exam · 20 câu</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I2.1</a>
            {chevR()}
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{cur.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "700 12px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: cur.cDeep, marginBottom: "12px" }}>
            <span>Phần {cur.n} / 3</span><span style={{ opacity: ".4" }}>·</span><span>{cur.time} đọc</span>
          </div>
          <h1 style={{ font: "800 clamp(36px,4.6vw,54px)/1.04 var(--font-impact)", letterSpacing: "-.026em", margin: "0 0 34px", color: "var(--fg-1)" }}>{cur.title}</h1>

          {state.part === 0 && <Part1View />}
          {state.part === 1 && <Part2View />}
          {state.part === 2 && <Part3View go={go} />}

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

function Part1View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>Ở</span> I1.1 ta định nghĩa <b>prompt</b> là toàn bộ nội dung bạn đưa vào mô hình cho một lượt. Buổi này nâng cấp cách nhìn: prompt không phải một <i>câu nói</i> tuỳ hứng, mà là một <b>sản phẩm kỹ thuật (artifact)</b> — như một hàm trong lập trình.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "26px 0" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>Người dùng AI · một câu nói</div><div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Gõ đại, nếu sai thì nói lại kiểu khác rồi hy vọng. <b>Không kiểm soát được sai ở đâu</b>, không lưu lại để dùng lại được.</div></div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>Builder · một artifact</div><div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Như một <b>hàm</b>: đầu vào rõ ràng → các bước xử lý kiểm soát được → đầu ra đúng schema. Sai ở đâu <b>biết chính xác</b> để sửa đúng chỗ.</div></div>
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "26px 28px", display: "flex", alignItems: "stretch", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "130px", border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "6px" }}>ĐẦU VÀO</div><div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>dữ liệu · bối cảnh · ràng buộc</div></div>
          <div style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "22px" }}>→</div>
          <div style={{ flex: 1, minWidth: "130px", border: "1px solid var(--gold-deep)", borderRadius: "10px", background: "var(--gold-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "6px" }}>BƯỚC XỬ LÝ</div><div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>kiểm soát được từng bước</div></div>
          <div style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "22px" }}>→</div>
          <div style={{ flex: 1, minWidth: "130px", border: "1px solid var(--mint)", borderRadius: "10px", background: "var(--mint-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "6px" }}>ĐẦU RA</div><div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>đúng schema cố định</div></div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Prompt là sản phẩm kỹ thuật, không phải câu nói. Tư duy xuyên suốt: viết → kiểm tra → sửa có hệ thống → lưu lại → tái sử dụng.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>System Prompt — thiết lập quy tắc hoạt động</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}><b>System prompt</b> là phần chỉ dẫn hệ thống định hình <i>cách AI hành xử xuyên suốt</i>, trước cả nội dung yêu cầu cụ thể. Một system prompt tốt trả lời rõ ba câu hỏi:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 22px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>1</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Vai trò (role) — AI đóng vai gì?</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>"Bạn là trợ lý biên tập nội dung sản phẩm của YODY, viết cho khách trẻ đô thị." → chọn đúng giọng, đúng góc nhìn, đúng mức chuyên môn.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>2</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Định dạng đầu ra (output format) — trả về dạng gì?</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>"Luôn trả về đúng bảng 3 cột: Tên mục · Nội dung · Ghi chú. Không viết câu dẫn chuyện." → đầu ra cắm thẳng vào bước sau, không xử lý thủ công.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--rose-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>3</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--rose-deep)" }}>Ràng buộc (constraints) — phải/không được làm gì?</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>"Không bịa số liệu; thiếu dữ liệu thì ghi 'chưa có dữ liệu'. Mỗi mô tả ≤60 chữ." → nơi cắm quy tắc chất lượng, grounding và bảo mật PII.</div></div></div>
      </div>

      <div style={{ margin: "24px 0", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập · system prompt gọn</div>
        <p style={{ font: "15px/1.7 var(--font-mono)", color: "var(--fg-1)", margin: 0, background: "#fff", borderRadius: "8px", padding: "13px 15px" }}>"Vai trò: trợ lý viết mô tả sản phẩm YODY cho khách 22–30 tuổi. Ràng buộc: ≤60 chữ, giọng trẻ trung thực dụng, không dùng 'cao cấp/đẳng cấp', không bịa thông số. Định dạng: 1 đoạn mô tả + 3 gạch đầu dòng điểm mạnh."</p>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}><b style={{ color: "var(--fg-1)" }}>Khác biệt với prompt thường:</b> system prompt đặt <i>khung làm việc ổn định</i> dùng lại cho nhiều lượt; prompt yêu cầu (user prompt) là nội dung thay đổi từng lần. Tách hai lớp này giúp kết quả nhất quán khi chạy cùng tác vụ nhiều lần.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Structured Output — dùng được ngay</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}><b>Structured Output</b> là yêu cầu AI trả về kết quả theo đúng <b>schema</b> (cấu trúc dữ liệu định sẵn) thay vì để AI tự do trình bày. Ba dạng schema hay dùng:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", margin: "0 0 24px" }}>
        <div style={{ padding: "16px 18px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "6px" }}>Bảng (table)</div><div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Khi cần so sánh theo dòng/cột hoặc nhập vào Excel.</div></div>
        <div style={{ padding: "16px 18px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "6px" }}>JSON</div><div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Khi output sẽ được xử lý bằng code hoặc cần cấu trúc phân cấp.</div></div>
        <div style={{ padding: "16px 18px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "6px" }}>Template điền mục</div><div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Khi output là tài liệu (brief/report/spec) cần đủ mọi mục.</div></div>
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "14px", alignItems: "center" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "8px" }}>VĂN XUÔI TỰ DO</div><div style={{ font: "12px/1.6 var(--font-body)", color: "var(--fg-1)" }}>6 đoạn văn phải đọc hết để nhặt số · mỗi lần một kiểu · khó QC</div></div>
          <div style={{ color: "var(--fg-3)", fontSize: "22px", textAlign: "center" }}>vs</div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "10px", background: "var(--mint-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "8px" }}>SCHEMA CỐ ĐỊNH</div><div style={{ font: "12px/1.6 var(--font-mono)", color: "var(--fg-1)" }}>| Cửa hàng | Phân bổ | Lý do |</div><div style={{ font: "12px/1.6 var(--font-body)", color: "var(--mint-deep)", marginTop: "6px" }}>→ cắm thẳng vào quy trình, QC trong 10 giây</div></div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Structured output = dùng được ngay, không cần dọn tay.</figcaption>
      </figure>

      <div style={{ margin: "24px 0", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Thay vì hỏi "phân bổ 500 áo khoác cho 5 cửa hàng và giải thích" (nhận 6 đoạn văn phải đọc để nhặt số), hãy yêu cầu: <i>"Trả về đúng bảng sau, không thêm lời dẫn: | Cửa hàng | Nhu cầu ròng | Phân bổ cuối | Lý do (1 câu) |"</i> → nhận bảng sạch, kiểm tổng cột "Phân bổ cuối" = 500 chỉ mất 10 giây.</p>
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--fg-1)", margin: "30px 0 12px" }}>Bốn mẹo dùng Structured Output</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 26px" }}>
        {[
          "<b>Khai báo schema TRƯỚC khi đặt yêu cầu</b> — để AI \"lên kế hoạch\" ngay từ đầu.",
          "Thêm <b>\"yêu cầu lược bỏ hoàn toàn lời dẫn thừa\"</b> để tránh AI viết thừa văn xuôi.",
          "Nếu cần tính toán trung gian, <b>kết hợp chain-of-thought</b> (Phần 2): \"trình bày tính toán, sau đó trả về bảng theo schema…\".",
          "Schema ràng buộc <b>định dạng</b>, không ràng buộc <b>nội dung</b> — AI vẫn tự do viết lý do hay, chỉ cần đặt đúng cột.",
        ].map((t, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "baseline", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "13px 16px" }}><span style={{ font: "italic 800 18px/1 var(--font-serif)", color: "var(--iris)", flex: "none" }}>{i + 1}</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: t }} /></div>
        ))}
      </div>

      <TldrDark items={[
        "Coi <b>prompt là artifact kỹ thuật</b> (như một hàm: input → bước xử lý → output schema), không phải câu nói tuỳ hứng.",
        "<b>System prompt</b> thiết lập quy tắc hoạt động ổn định qua ba trục: <b>vai trò · định dạng đầu ra · ràng buộc</b>.",
        "<b>Structured output</b> (bảng/JSON/template) làm kết quả dùng được ngay và dễ QC; khai báo schema trước, yêu cầu lược bỏ hoàn toàn lời dẫn thừa.",
      ]} />

      <SelfCheck items={[
        "Viết một system prompt 3 dòng (vai trò · định dạng · ràng buộc) cho tác vụ \"tóm tắt review sản phẩm YODY\".",
        "Vì sao tách system prompt khỏi user prompt giúp kết quả nhất quán hơn khi chạy nhiều lần?",
        "Cho tác vụ \"phân bổ tồn kho\", hãy khai báo một schema bảng phù hợp để output cắm thẳng vào Excel.",
        "Structured output ràng buộc định dạng hay ràng buộc nội dung? Điều đó có làm giảm chất lượng nội dung không?",
      ]} />
    </div>
  );
}

function Part2View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>Đ</span>ây là phần cốt lõi của NL5. Bốn kỹ thuật và kỹ năng cải tiến (iterate) prompt dưới đây sẽ biến bạn từ một người "gõ đại" thành một <b>nhà thiết kế prompt chuyên nghiệp</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>1 · Zero-shot / Few-shot — kèm ví dụ hay không</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>Zero-shot</div><div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Ra yêu cầu trực tiếp, không ví dụ. Hợp tác vụ đơn giản, phổ biến ("phân loại review này tích cực hay tiêu cực").</div></div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "8px" }}>Few-shot</div><div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Kèm vài ví dụ mẫu để AI bắt đúng <i>nhãn / định dạng / tiêu chí</i> của bạn. Dùng khi tác vụ có quy ước riêng mà zero-shot dễ hiểu sai.</div></div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", font: "14px/1.7 var(--font-mono)", color: "var(--fg-1)" }}><b style={{ fontFamily: "var(--font-brand)", color: "var(--gold-deep)" }}>Ví dụ few-shot · giả lập</b><br />"'Vải mát, đáng tiền' → Tích cực · 'Chờ 2 tuần chưa nhận' → Tiêu cực · Phân loại: 'Áo đẹp nhưng giao chậm' →"</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Chain-of-Thought (CoT) — buộc AI "nghĩ ra giấy"</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}><b>CoT</b> yêu cầu AI <i>trình bày các bước suy luận trước khi kết luận</i>. Kích hoạt đơn giản: thêm <i>"Trình bày suy luận từng bước trước khi kết luận; với mỗi bước có tính toán, ghi rõ phép tính."</i> Hai lợi ích: <b>(1) giảm lỗi</b> ở bài nhiều ràng buộc/nhiều bước; <b>(2) dễ phát hiện AI sai từ bước nào</b> để sửa đúng chỗ.</p>
      <div style={{ margin: "20px 0", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>"Phân bổ 500 áo khoác cho 5 cửa hàng" — hỏi thẳng thì AI trả bảng số không kiểm được. Thêm CoT: <i>"Bước 1 tính tốc độ bán/tuần · Bước 2 ước cầu 6 tuần · Bước 3 trừ tồn · Bước 4 +15% cho cửa hàng mới · Bước 5 chuẩn hoá tổng = 500"</i> → AI viết ra từng phép tính, bạn dò được nếu Bước 4 áp nhầm hệ số.</p>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <span style={{ color: "var(--rose-deep)", flex: "none", fontSize: "20px" }}>⚠️</span>
        <p style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)", margin: 0 }}><b>Bẫy:</b> CoT mượt mà <i>không</i> đồng nghĩa CoT đúng — AI có thể sai một bước mà kết luận vẫn "nghe hợp lý". <b>Quy tắc L2: phải kiểm tra chuỗi suy luận, không chỉ nhìn đáp số cuối</b> — đặc biệt các bước có con số. (CoT tốn nhiều token hơn và tăng độ trễ — chỉ dùng khi thực sự cần.)</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Task Decomposition — chẻ việc lớn thành chuỗi bước</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Khi một việc gồm nhiều giai đoạn <i>khác bản chất</i> (trích xuất → gom nhóm → suy luận → xếp hạng), nhồi tất cả vào một prompt khiến AI làm sơ sài, bỏ sót (nhất là yêu cầu ở giữa) hoặc lẫn lộn các phần. <b>Task decomposition</b> tách thành chuỗi prompt nối tiếp, mỗi bước có input/output rõ; output bước trước là input bước sau.</p>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}><b style={{ color: "var(--fg-1)" }}>Lợi ích:</b> kiểm từng bước riêng (sai Bước 1 sửa Bước 1, không chạy lại toàn bộ), tái sử dụng kết quả trung gian, cải thiện từng phần. <b style={{ color: "var(--fg-1)" }}>Nguyên tắc:</b> phân rã <i>đủ để kiểm soát</i>, tránh vụn vặt. Tự hỏi "nếu bước này sai, tôi có cần biết riêng không?" — chỉ cần kết quả cuối thì không tách.</p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
            <span style={{ font: "700 11px/1.3 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 12px", borderRadius: "9px" }}>Context<br />Injection</span>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            {PIPELINE.map((s, i) => (
              <span key={i} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ font: "700 11px/1.3 var(--font-mono)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "8px 10px", borderRadius: "8px", textAlign: "center" }}>{s}</span>
                <span style={{ font: "400 9px/1 var(--font-body)", color: "var(--fg-2)", marginTop: "2px" }}>CoT</span>
              </span>
            ))}
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            <span style={{ font: "700 11px/1.3 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "9px 12px", borderRadius: "9px" }}>Structured<br />Output · bảng</span>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — 4 kỹ thuật không rời rạc: chúng ghép vào nhau thành một pipeline.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Context Injection — hết chung chung</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Hỏi mà không cấp ngữ cảnh, AI trả lời "phù hợp với tất cả mọi người" — tức không hợp với ai, nghe rập khuôn như sách giáo khoa. <b>Context injection</b> là chủ động chèn bối cảnh trước khi đặt yêu cầu, theo bốn trục:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><b style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Đối tượng</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Khách của bạn là ai (tuổi, nghề, vấn đề)?</div></div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><b style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Ràng buộc vận hành</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Giới hạn, quy tắc, điều kiện thực tế.</div></div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><b style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--mint-deep)" }}>Mục tiêu</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Output này dùng để làm gì, ở bước nào?</div></div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><b style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--rose-deep)" }}>Giọng / thương hiệu</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Tone phù hợp (YODY: trẻ trung, thực dụng, không hoa mỹ).</div></div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>"Viết mô tả áo khoác gió" → văn sáo rỗng. Thêm context (<i>"khách đi xe máy đô thị 22–30 tuổi · ≤60 chữ · không dùng 'cao cấp' · đọc trên app, 5 giây quyết định"</i>) → mô tả sắc bén, sát sản phẩm, đúng giọng thương hiệu. Context injection chính là cách bạn <b>cấp sự thật cụ thể của mình</b> để AI khỏi phải đoán.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Iterate có chẩn đoán — kỹ năng cốt lõi L2</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Khi output sai, người mới thường sửa mò theo cảm tính. Builder L2 <b>chẩn đoán nguyên nhân trước khi sửa</b> để tác động đúng chỗ. Chuẩn L2: đạt kết quả mong muốn chỉ sau <b>tối đa 2 lần</b> tinh chỉnh.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr", background: "var(--bg-ink)" }}><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Triệu chứng output</span><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Nguyên nhân</span><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Cách sửa</span></div>
        {ITER_TABLE.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1.2fr", borderTop: "1px solid var(--border)", background: "#fff" }}><span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.s}</span><span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--rose-deep)", fontWeight: 600 }}>{r.c}</span><span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.f}</span></div>
        ))}
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 22px" }}><b style={{ color: "var(--fg-1)" }}>Quy trình 3 bước:</b> (1) <i>Chẩn đoán</i> — triệu chứng thuộc loại nào? (2) <i>Sửa đúng chỗ</i> — chỉ chỉnh phần tương ứng, không sửa lan man. (3) <i>Ghi lại</i> — lưu prompt v1, v2 + lý do (nguyên liệu Gate 2).</p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 13px/1.3 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", border: "1px solid var(--rose-deep)", padding: "10px 14px", borderRadius: "10px" }}>Output sai</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 13px/1.3 var(--font-body)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "10px 14px", borderRadius: "10px", textAlign: "center" }}>🔍 Chẩn đoán<br /><span style={{ font: "400 11px/1.4 var(--font-body)", color: "var(--fg-2)" }}>thiếu context? · nhồi 1-lượt? · thiếu ràng buộc?</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 13px/1.3 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "10px 14px", borderRadius: "10px", textAlign: "center" }}>Sửa đúng chỗ<br /><span style={{ font: "700 10px/1 var(--font-mono)", color: "var(--mint-deep)" }}>≤ 2 lần</span></span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Chẩn đoán trước khi sửa, không sửa mò.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>6 · Cheat sheet — 4 mẫu prompt tái dùng</h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 26px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.6fr", background: "var(--bg-ink)" }}><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Kỹ thuật</span><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Kích hoạt nhanh</span></div>
        {CHEAT.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "0.8fr 1.6fr", borderTop: "1px solid var(--border)", background: "#fff" }}><span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: "var(--iris-deep)" }}>{r.t}</span><span style={{ padding: "12px 16px", font: "13px/1.55 var(--font-mono)", color: "var(--fg-1)" }}>{r.k}</span></div>
        ))}
      </div>

      <TldrDark items={[
        "<b>Zero/few-shot, CoT, task decomposition, context injection</b> là bốn công cụ điều khiển AI; chúng ghép được vào nhau trong một pipeline nối tiếp.",
        "<b>CoT giúp thấy AI sai ở đâu</b> nhưng CoT mượt ≠ đúng — luôn đọc chuỗi suy luận, nhất là bước có số liệu.",
        "<b>Iterate có chẩn đoán</b>: xác định nguyên nhân → sửa đúng chỗ → đạt trong ≤2 lần; luôn lưu v1/v2 làm prompt library.",
      ]} />

      <SelfCheck items={[
        "Cho bài \"phân tích 40 review áo khoác\": viết prompt phân rã ≥4 bước, có CoT ở bước rút insight, có structured output.",
        "Output mô tả sản phẩm \"nghe như sách giáo khoa\" — bạn chẩn đoán thiếu gì và sửa thế nào?",
        "Vì sao \"CoT mượt mà không có nghĩa là đúng\"? Bạn kiểm bằng cách nào?",
        "Viết lại một prompt bạn từng dùng theo cheat sheet (chọn ≥2 kỹ thuật) và ghi lý do.",
      ]} />
    </div>
  );
}

function Part3View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--rose-deep)", padding: "6px 12px 0 0" }}>V</span>iết prompt (Prompt Engineering) mới chỉ là một nửa chặng đường. Nửa còn lại của NL5 là biết AI có thể <b>nhận nhiều loại đầu vào</b> và <b>gọi ra công cụ bên ngoài</b> — và khi nào nên dùng.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>1 · Multimodal — không chỉ văn bản</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>Multimodal</b> nghĩa là mô hình xử lý được nhiều loại dữ liệu đầu vào, không chỉ văn bản — phổ biến nhất với builder là <b>văn bản + hình ảnh</b>. Bạn đưa ảnh kèm câu hỏi, và AI "đọc" được nội dung ảnh. Ứng dụng ở YODY (giả lập):</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}><span style={{ color: "var(--rose)", flex: "none", fontSize: "17px" }}>🖼️</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Đưa <b>ảnh sản phẩm</b> + yêu cầu "viết mô tả dựa trên những gì thấy trong ảnh" (màu, kiểu dáng, chi tiết).</span></div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}><span style={{ color: "var(--rose)", flex: "none", fontSize: "17px" }}>📋</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Đưa <b>ảnh bảng size / tem sản phẩm</b> để AI trích thông tin ra dạng bảng.</span></div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}><span style={{ color: "var(--rose)", flex: "none", fontSize: "17px" }}>💬</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Đưa <b>ảnh chụp màn hình đánh giá</b> để phân loại — nhưng nhớ ẩn PII trong ảnh trước (nhắc lại I1.2).</span></div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--rose-deep)" }}>Vẫn áp dụng mọi nguyên tắc đã học:</b> structured output (bắt AI trả bảng), grounding (chỉ mô tả cái <b>thấy</b> trong ảnh, không bịa thông số), và ràng buộc định dạng. Multimodal mở rộng <i>đầu vào</i>, không thay đổi nguyên tắc thiết kế prompt.</div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "10px 13px", borderRadius: "10px", textAlign: "center" }}>🖼️ Ảnh sản phẩm</span>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "10px 13px", borderRadius: "10px", textAlign: "center" }}>📝 Yêu cầu</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 12px/1.3 var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", border: "1px solid var(--fg-3)", padding: "10px 13px", borderRadius: "10px" }}>AI</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 12px/1.4 var(--font-mono)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "10px 13px", borderRadius: "10px", textAlign: "center" }}>Màu · Kiểu dáng · Chi tiết</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Multimodal: chỉ mô tả cái NHÌN THẤY, không bịa thông số.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Tool Use / Function Calling</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Bản thân LLM chỉ dự đoán và xử lý ngôn ngữ — nó không tự nắm doanh số hôm nay, không tra tồn kho thật, không tự gửi email. <b>Tool Use / Function Calling</b> là cơ chế cho phép mô hình <b>yêu cầu chạy một công cụ / hàm bên ngoài</b> để lấy dữ liệu thật hoặc thực hiện hành động, rồi dùng kết quả đó hoàn thiện câu trả lời.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>1</span><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Bạn khai báo cho AI biết có những "tool" nào (vd <span style={{ fontFamily: "var(--font-mono)" }}>tra_ton_kho(mã_SP)</span>, <span style={{ fontFamily: "var(--font-mono)" }}>tra_doanh_so(cửa_hàng, tháng)</span>).</div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>2</span><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Khi câu hỏi cần dữ liệu thật, AI <b>không tự bịa</b> mà <i>gọi tool</i> với tham số phù hợp.</div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "15px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--mint-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>3</span><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Hệ thống chạy tool, trả kết quả thật về; AI dùng kết quả đó soạn câu trả lời.</div></div>
      </div>
      <div style={{ margin: "0 0 22px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Vì sao builder quan tâm</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Đây là <b>giải pháp triệt để cho lỗi ảo tưởng (hallucination) số liệu</b>. Thay vì để AI đoán "doanh số tăng 23%", bạn cho nó gọi tool lấy con số thật. Tool use biến AI từ "người kể chuyện trôi chảy" thành "trợ lý biết tra cứu".</p>
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", border: "1px solid var(--fg-3)", padding: "10px 13px", borderRadius: "10px" }}>"Đơn của tôi tới đâu?"</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 12px/1.3 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "10px 13px", borderRadius: "10px" }}>AI</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>⇄</span>
          <span style={{ font: "600 12px/1.4 var(--font-mono)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "10px 13px", borderRadius: "10px", textAlign: "center" }}>tra_trang_thai_don()<br /><span style={{ font: "400 10px/1.3 var(--font-body)", color: "var(--fg-2)" }}>→ dữ liệu thật</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "10px 13px", borderRadius: "10px" }}>Trả lời có căn cứ</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Tool use = AI gọi công cụ lấy số thật, không bịa.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · API — cổng kết nối tự động</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>API (Application Programming Interface)</b> là giao diện lập trình ứng dụng, làm cổng để phần mềm của bạn tương tác với mô hình AI <i>một cách tự động</i>, thay vì nhập tay trên giao diện chat. Khi bạn build một tính năng AI thật (chatbot, tự sinh mô tả hàng loạt…), tính năng đó <b>gọi API</b>: gửi prompt vào, nhận kết quả ra.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 26px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "13px 16px" }}><span style={{ color: "var(--iris)", flex: "none", fontSize: "16px" }}>💰</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Gọi API là nơi các khái niệm ở I1.1 thành <i>tiền thật</i>: bạn chi trả theo <b>số lượng token tiêu thụ</b> (input + output), chọn <b>model</b> theo cân đối tốc độ/chi phí/độ chính xác (đào sâu ở I5.1).</span></div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "13px 16px" }}><span style={{ color: "var(--gold-deep)", flex: "none", fontSize: "16px" }}>🔧</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Tool use / function calling thường được cấu hình <i>qua API</i>.</span></div>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "13px 16px" }}><span style={{ color: "var(--mint-deep)", flex: "none", fontSize: "16px" }}>🔌</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>MCP (Model Context Protocol)</b> là chuẩn kết nối AI với công cụ/nguồn dữ liệu doanh nghiệp — chỉ cần <b>biết tên</b> ở đây; học sâu ở I3.1.</span></div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Khi nào chỉ cần prompt, khi nào cần tool/API</h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", background: "var(--bg-ink)" }}><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Tình huống</span><span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Cách làm</span></div>
        {WHEN_TABLE.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}><span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.sit}</span><span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: r.c, fontWeight: 600 }}>{r.how}</span></div>
        ))}
      </div>
      <p style={{ font: "italic 600 18px/1.6 var(--font-body)", color: "var(--fg-1)", margin: "0 0 8px", borderLeft: "3px solid var(--fg-1)", paddingLeft: "16px" }}>Nguyên tắc nối tiếp I1.1: thử prompt trước; chỉ thêm tool/API/RAG khi bài toán thực sự cần dữ liệu thật hoặc tự động hoá.</p>

      <TldrDark items={[
        "<b>Multimodal</b> mở rộng đầu vào (văn bản + hình ảnh) nhưng vẫn giữ nguyên tắc thiết kế prompt (structured output, grounding, ẩn PII trong ảnh).",
        "<b>Tool Use / Function Calling</b> cho AI gọi công cụ lấy <b>dữ liệu thật</b> — giải pháp triệt để cho hallucination số liệu.",
        "<b>API</b> là cổng kết nối tự động giữa ứng dụng và mô hình (chi trả theo token); MCP chỉ nhắc tên, học sâu ở I3.1.",
      ]} />

      <div style={{ margin: "0 0 30px", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}><div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã nắm NL5 nền tảng 🎯</div><div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Làm Final Exam 20 câu và lưu <b style={{ color: "var(--fg-1)" }}>prompt library cá nhân</b> cho Gate 2 (I2.3).</div></div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Làm Final Exam →</a>
      </div>

      <SelfCheck items={[
        "Cho một tác vụ ở YODY dùng được <b>multimodal</b> — mô tả input ảnh + yêu cầu + schema output.",
        "Vì sao tool use / function calling giúp giảm hallucination số liệu? Cho một ví dụ.",
        "Phân biệt \"dùng prompt\" và \"dùng tool use\" — cho hai tình huống YODY tương ứng.",
        "API liên quan gì tới chi phí token đã học ở I1.1?",
      ]} />
    </div>
  );
}

function ExamScreen({
  state,
  go,
  pick,
  submit,
  reset,
}: {
  state: LessonState;
  go: (p: Page) => void;
  pick: (qi: number, oi: number) => void;
  submit: () => void;
  reset: () => void;
}) {
  let score = 0;
  EXAM.forEach((Q, qi) => { if (state.answers[qi] === Q.correct) score++; });
  const answered = Object.keys(state.answers).length;
  const passed = score >= PASS_SCORE;
  const result = passed
    ? { title: "Đạt — sẵn sàng sang I2.2 🎉", msg: `Bạn đạt ngưỡng ${PASS_SCORE}/20. Lưu prompt library cá nhân rồi sang I2.2 — Design Thinking (Empathy & Ideation).`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 7–15 (kỹ thuật prompt & iterate — trái tim NL5) là tín hiệu cần đọc lại Phần 2 rồi làm lại.`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · trước khi sang I2.2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I2.1</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Chọn xong bấm "Nộp bài" để chấm và xem giải thích.</p>

      {state.submitted && (
        <div style={{ border: `2px solid ${result.border}`, background: result.bg, borderRadius: "16px", padding: "26px 30px", marginBottom: "34px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ font: "italic 800 64px/1 var(--font-serif)", color: result.color }}>{score}<span style={{ font: "800 26px/1 var(--font-impact)", color: "var(--fg-3)" }}>/20</span></div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ font: "700 22px/1.2 var(--font-impact)", color: result.color, marginBottom: "6px" }}>{result.title}</div>
            <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{result.msg}</div>
          </div>
          <button onClick={() => reset()} className="cta" style={{ height: "44px", padding: "0 22px", fontSize: "14px", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)", cursor: "pointer" }}>Làm lại</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {EXAM.map((Q, qi) => {
          const sel = state.answers[qi];
          return (
            <div key={qi} style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
                <span style={{ font: "italic 800 22px/1 var(--font-serif)", color: "var(--iris)" }}>{qi + 1}</span>
                <span style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-3)" }}>{Q.part}</span>
              </div>
              <p style={{ font: "600 17px/1.5 var(--font-body)", color: "var(--fg-1)", margin: "0 0 16px" }}>{Q.q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {Q.opts.map((text, oi) => {
                  let bg = "#fff", border = "var(--border)", fg = "var(--fg-1)", mark = "", markColor = "transparent", badgeBg = "var(--bg-muted)", badgeFg = "var(--fg-2)";
                  if (state.submitted) {
                    if (oi === Q.correct) { bg = "var(--mint-tint)"; border = "var(--mint)"; fg = "var(--mint-deep)"; mark = "✓"; markColor = "var(--mint-deep)"; badgeBg = "var(--mint)"; badgeFg = "#fff"; }
                    else if (oi === sel) { bg = "var(--rose-tint)"; border = "var(--rose-deep)"; fg = "var(--rose-deep)"; mark = "✕"; markColor = "var(--rose-deep)"; badgeBg = "var(--rose-deep)"; badgeFg = "#fff"; }
                    else { fg = "var(--fg-3)"; }
                  } else if (oi === sel) { bg = "var(--iris-tint)"; border = "var(--iris)"; fg = "var(--iris-deep)"; badgeBg = "var(--iris)"; badgeFg = "#fff"; }
                  return (
                    <button key={oi} onClick={() => pick(qi, oi)} className="kh-opt" style={{ display: "flex", alignItems: "flex-start", gap: "13px", textAlign: "left", width: "100%", boxSizing: "border-box", padding: "13px 15px", borderRadius: "10px", border: `1.5px solid ${border}`, background: bg, cursor, fontFamily: "var(--font-body)" }}>
                      <span style={{ width: "24px", height: "24px", flex: "none", borderRadius: "6px", background: badgeBg, color: badgeFg, font: "700 12px/24px var(--font-numeric)", textAlign: "center" }}>{"ABCD"[oi]}</span>
                      <span style={{ flex: 1, font: "15px/1.5 var(--font-body)", color: fg }}>{text}</span>
                      <span style={{ font: "800 15px/1.6 var(--font-body)", color: markColor }}>{mark}</span>
                    </button>
                  );
                })}
              </div>
              {state.submitted && (
                <div style={{ marginTop: "13px", padding: "12px 15px", background: "var(--bg-warm)", borderRadius: "9px", font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}><b style={{ color: "var(--fg-1)" }}>Vì sao:</b> {Q.why}</div>
              )}
            </div>
          );
        })}
      </div>

      {!state.submitted && (
        <div style={{ position: "sticky", bottom: 0, marginTop: "26px", padding: "18px 0", background: "linear-gradient(to top, var(--bg-warm) 60%, transparent)", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <button onClick={() => submit()} className="cta cta-primary" style={{ height: "48px", padding: "0 30px", fontSize: "15px", cursor: "pointer" }}>Nộp bài &amp; chấm điểm</button>
          <span style={{ font: "500 14px/1.4 var(--font-body)", color: "var(--fg-3)" }}>Đã trả lời <b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>{answered}</b> / 20 câu</span>
        </div>
      )}
    </div>
  );
}
