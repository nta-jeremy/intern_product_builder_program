"use client";

import { useState } from "react";

type Page = "overview" | "read" | "gate" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
}

const PASS_SCORE = 16;
const PASS_PCT = "80%";

const PART_META = [
  { n: "01", short: "Bằng chứng & Feedback", title: "Trình bày bằng chứng & Feedback là dữ liệu", time: "~14 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Iterate, Cộng tác & Đồng thuận", title: "Iterate có định hướng, Cộng tác & Đồng thuận", time: "~15 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Bảo vệ bằng 4 nhịp (bằng chứng, không kể công), feedback là dữ liệu, phân loại 3 nhóm feedback (lỗi sự thật · thiếu sót · khác quan điểm), tránh phòng thủ.", tags: ["4 nhịp bảo vệ", "Feedback là dữ liệu", "3 nhóm feedback"] },
  { ...PART_META[1], desc: "Iterate có trọng tâm, bảng before-after chứng minh delta, cộng tác & tạo đồng thuận, chủ động hỏi đúng lúc — không im lặng khi bế tắc.", tags: ["Iterate có trọng tâm", "Before-after / delta", "Cộng tác chủ động"] },
];

const OBJECTIVES = [
  "Trình bày/bảo vệ deliverable theo 4 nhịp: Bài toán → Workflow → Ai đã dùng → Giá trị đo được (kể bằng chứng, không kể công sức).",
  "Phân loại feedback thành 3 nhóm (lỗi sự thật · thiếu sót · khác quan điểm) và xử lý đúng từng nhóm, không phòng thủ.",
  "Cải tiến (iterate) có trọng tâm: chọn 1–2 điểm tác động lớn, dùng bảng before-after chứng minh delta.",
  "Cộng tác & tạo đồng thuận giữa nghiệp vụ và kỹ thuật; chủ động đặt câu hỏi, không im lặng chịu đựng khi bế tắc.",
];

const MUST_KNOW = ["Bảo vệ 4 nhịp", "3 nhóm feedback", "Iterate có trọng tâm", "Before-after / delta", "Không im lặng khi bế tắc"];
const NICE_KNOW = ["Điểm HITL (I3.1)", "Value metric (I1.2)", "Grounding (I1.2)", "Deliverable & QC (I3.2)"];

const META = [
  { k: "Thời lượng live", v: "90 phút" },
  { k: "Thời gian đọc", v: "~29 phút" },
  { k: "Giai đoạn", v: "2 · Tuần 5–8" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL3 🔒 · Collab & Iterate" },
  { k: "Gate", v: "⛳ Gate 3 · Must-pass" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — 4 beats, 3 feedback groups
const BEATS = [
  { n: "1", name: "Bài toán", q: "Giải quyết vấn đề gì, cho ai?", content: "Pain point + nguyên nhân gốc (I2.2/I2.3).", color: "var(--iris)" },
  { n: "2", name: "Workflow", q: "Giải pháp hoạt động thế nào?", content: "Sơ đồ workflow 4 ô + điểm HITL (I3.1).", color: "var(--gold-deep)" },
  { n: "3", name: "Ai đã dùng", q: "Có người thật dùng chưa?", content: "Bằng chứng người dùng/review thật đã chạm vào.", color: "var(--mint-deep)" },
  { n: "4", name: "Giá trị đo được", q: "Tạo ra thay đổi gì, đo bằng gì?", content: "Value metric + delta trước/sau (I1.2).", color: "var(--rose-deep)" },
];
const FB_GROUPS = [
  { n: "1", name: "Lỗi sự thật", what: "Số liệu sai, nguồn sai, khẳng định sai.", action: "Sửa ngay — không tranh luận với sự thật.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
  { n: "2", name: "Thiếu sót", what: "Bỏ quên edge case, thiếu nguồn, thiếu một góc nhìn quan trọng.", action: "Đánh giá tác động rồi bổ sung nếu quan trọng.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { n: "3", name: "Khác quan điểm", what: "Người review muốn hướng khác, không phải sai.", action: "Ghi nhận, cân nhắc — giải thích lựa chọn bằng bằng chứng.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
];

// Phần 2 — before-after, collab
const BEFORE_AFTER = [
  { point: "Nguồn cho insight khóa kéo", v1: "Không có dẫn chứng", v2: "Trích 3 review gốc (#2, #11, #27)", delta: "Từ insight vô căn cứ (\"insight ma\") → truy được nguồn" },
  { point: "Edge case review lẫn ngôn ngữ", v1: "Bỏ qua", v2: "Gắn nhãn \"cần người xem\"", delta: "Không còn phân loại sai âm thầm" },
];
const COLLAB = [
  { n: "1", text: "Truyền đạt súc tích, đúng đối tượng: nói với nghiệp vụ bằng ngôn ngữ giá trị/khách hàng; nói với kỹ thuật bằng ngôn ngữ ràng buộc công nghệ & luồng xử lý." },
  { n: "2", text: "Tạo đồng thuận dựa trên bằng chứng người dùng, không dựa trên \"ai to tiếng hơn\"." },
  { n: "3", text: "Phối hợp nhịp nhàng trong phạm vi được giao — biết khi nào cần hỏi nghiệp vụ, khi nào cần hỏi kỹ thuật." },
];

// Gate 3
const GATE_TASKS = [
  { n: "1", title: "Bảo vệ theo 4 nhịp", desc: "Bài toán → Workflow → Ai đã dùng → Giá trị đo được — kể bằng chứng, không kể công sức. Có giải thích điểm HITL trong workflow (I3.1).", c: "var(--iris)" },
  { n: "2", title: "Nhận feedback từ mentor", desc: "Phân loại 3 nhóm (lỗi sự thật / thiếu sót / khác quan điểm), phản hồi không phòng thủ.", c: "var(--gold-deep)" },
  { n: "3", title: "Iterate ngay 1 vòng", desc: "Chọn 1–2 điểm tác động lớn, sửa, và nộp bảng before-after (v1 → v2) với delta đo được.", c: "var(--mint-deep)" },
];
const RUBRIC = [
  { title: "Bằng chứng thực tế", desc: "Bảo vệ theo 4 nhịp; có người thật đã dùng/review deliverable; giá trị đo được (metric + delta), không kể công sức." },
  { title: "Đón feedback không phòng thủ", desc: "Phân loại đúng 3 nhóm feedback; sửa nhóm \"lỗi sự thật\" không tranh cãi; giải thích lựa chọn cho nhóm \"khác quan điểm\" bằng bằng chứng." },
  { title: "Iterate có trọng tâm", desc: "Chọn 1–2 điểm tác động lớn; before-after chứng minh v2 tốt hơn v1 (có delta), không sửa lan man." },
  { title: "Cộng tác chủ động", desc: "Thể hiện đã chủ động hỏi đúng lúc khi bế tắc (không im lặng); giải thích được điểm HITL phục vụ ai." },
];
const SAMPLE_BEATS = [
  { tag: "(1) BÀI TOÁN", text: "Đổi trả tăng do sai size." },
  { tag: "(2) WORKFLOW", text: "AI gán nhãn lý do đổi/trả → bước mentor kiểm duyệt (HITL) → bảng tần suất." },
  { tag: "(3) AI ĐÃ DÙNG", text: "Đội sản phẩm đã dùng report để họp ưu tiên." },
  { tag: "(4) GIÁ TRỊ", text: "Nhờ report, đội chọn đúng vấn đề \"size\" để xử lý trước." },
];
const SAMPLE_FB = [
  { quote: "Số 18 review khóa kéo lấy ở đâu?", group: "Lỗi sự thật/nguồn", fix: "bổ sung trích #2, #11, #27.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
  { quote: "Chưa xét review lẫn tiếng Anh", group: "Thiếu sót", fix: "thêm nhãn \"cần người xem\".", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { quote: "Nên gom \"giá\" và \"giá trị\" làm một", group: "Khác quan điểm", fix: "giữ tách, giải thích vì hai nhóm hành động khác nhau.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
];
const SAMPLE_BA = [
  { point: "Nguồn insight khóa kéo", v1: "Không dẫn chứng", v2: "Trích 3 review gốc", delta: "Hết \"insight ma\"" },
  { point: "Review lẫn ngôn ngữ", v1: "Bỏ qua", v2: "Gắn nhãn \"cần người xem\"", delta: "Không còn phân loại sai âm thầm" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Bằng chứng · Feedback", B = "Phần B · Iterate · Cộng tác";
const EXAM: ExamQ[] = [
  { part: A, q: "Cách bảo vệ deliverable mạnh nhất là gì?", opts: ["Kể câu chuyện bằng chứng (bài toán, người dùng, giá trị đo được)", "Kể em đã bỏ bao nhiêu giờ và thử bao nhiêu prompt", "Trình bày thật dài và chi tiết", "Nói mình đã cố gắng hết sức"], correct: 0, why: "Bảo vệ mạnh = kể câu chuyện bằng chứng (người dùng, giá trị đo được), không kể công sức. (File 1)" },
  { part: A, q: "Cấu trúc trình bày 4 nhịp gồm?", opts: ["Token → Cost → Latency → Accuracy", "Bài toán → Workflow → Ai đã dùng → Giá trị đo được", "Input → AI → Output → Review", "Nói → Nghĩ → Làm → Cảm"], correct: 1, why: "4 nhịp: Bài toán → Workflow → Ai đã dùng → Giá trị đo được. (File 1)" },
  { part: A, q: "\"Em đã thử 30 prompt, mất 2 ngày\" là kiểu trình bày gì?", opts: ["Trình bày bằng chứng, rất mạnh", "Trình bày giá trị đo được", "Trình bày công sức — yếu, vì mentor không chỉ đánh giá dựa trên nỗ lực đơn thuần", "Trình bày workflow"], correct: 2, why: "\"Thử 30 prompt, mất 2 ngày\" là trình bày công sức — yếu, vì mentor không chỉ đánh giá dựa trên nỗ lực đơn thuần. (File 1)" },
  { part: A, q: "Nên coi feedback từ mentor là gì?", opts: ["Sự công kích cá nhân", "Điều nên tranh luận lại ngay", "Thứ nên bỏ qua nếu mình tự tin", "Dữ liệu miễn phí về sản phẩm để cải thiện"], correct: 3, why: "Feedback là dữ liệu miễn phí về sản phẩm, không phải công kích. (File 1)" },
  { part: A, q: "Vì sao phòng thủ khi nhận feedback lại có hại?", opts: ["Nó khiến bạn bỏ lỡ các phản hồi giá trị để cải tiến", "Nó tốn token", "Nó làm mentor vui", "Nó không có hại gì"], correct: 0, why: "Phòng thủ khiến bạn bỏ lỡ các phản hồi giá trị để cải tiến. (File 1)" },
  { part: A, q: "Ba nhóm feedback để phân loại là gì?", opts: ["Tốt · Xấu · Trung bình", "Lỗi sự thật · Thiếu sót · Khác quan điểm", "Nguồn · Số liệu · Edge case", "A · B · C"], correct: 1, why: "3 nhóm: Lỗi sự thật · Thiếu sót · Khác quan điểm. (File 1)" },
  { part: A, q: "Với feedback nhóm \"lỗi sự thật\" (số liệu/nguồn sai), nên làm gì?", opts: ["Tranh luận để bảo vệ", "Ghi nhận rồi để đó", "Sửa ngay, không tranh cãi với sự thật", "Coi như khác quan điểm"], correct: 2, why: "Lỗi sự thật → sửa ngay, không tranh cãi với sự thật. (File 1)" },
  { part: A, q: "Với feedback nhóm \"khác quan điểm\" (không phải sai), nên làm gì?", opts: ["Bắt buộc phải đổi theo", "Bỏ qua hoàn toàn", "Phòng thủ và bác bỏ", "Ghi nhận, cân nhắc; có thể giữ lựa chọn nếu giải thích được bằng bằng chứng"], correct: 3, why: "Khác quan điểm → ghi nhận, cân nhắc; có thể giữ lựa chọn nếu giải thích bằng bằng chứng. (File 1)" },
  { part: A, q: "Nhịp \"Ai đã dùng\" trong bảo vệ nhằm chứng minh điều gì?", opts: ["Có người thật đã dùng/review deliverable (tín hiệu thực tế)", "Số giờ đã bỏ ra", "Số prompt đã thử", "Deliverable trình bày đẹp"], correct: 0, why: "Nhịp \"Ai đã dùng\" chứng minh có người thật đã dùng/review (tín hiệu thực tế). (File 1)" },
  { part: A, q: "Mentor xét deliverable dựa trên điều gì là chính?", opts: ["Nỗ lực và số giờ làm", "Tín hiệu thực tế: bài toán thật, người dùng, giá trị đo được", "Độ dài của tài liệu", "Số lượng tính năng"], correct: 1, why: "Mentor xét tín hiệu thực tế: bài toán thật, người dùng, giá trị đo được. (File 1)" },
  { part: B, q: "\"Iterate có trọng tâm\" nghĩa là gì?", opts: ["Sửa tất cả feedback cùng lúc", "Không sửa gì cả", "Chọn 1–2 điểm tác động lớn nhất, sửa đúng chỗ, chứng minh tốt hơn", "Viết lại toàn bộ từ đầu"], correct: 2, why: "Iterate có trọng tâm = chọn 1–2 điểm tác động lớn, sửa đúng chỗ, chứng minh tốt hơn. (File 2)" },
  { part: B, q: "Vì sao không nên \"sửa tất cả cùng lúc\"?", opts: ["Vì tốn token", "Vì mentor cấm", "Vì AI không cho phép", "Vì tốn công dàn trải và nếu tốt hơn cũng không biết nhờ đâu"], correct: 3, why: "Sửa tất cả cùng lúc: tốn công dàn trải và không biết cải thiện nhờ đâu. (File 2)" },
  { part: B, q: "Bảng before-after dùng để làm gì?", opts: ["Chứng minh delta cải thiện (cái gì tốt hơn, bao nhiêu) giữa v1 và v2", "Liệt kê mọi tính năng", "Tính chi phí token", "Ghi lại toàn bộ prompt đã dùng"], correct: 0, why: "Before-after chứng minh delta cải thiện giữa v1 và v2. (File 2)" },
  { part: B, q: "Một vòng iterate đúng gồm các bước nào?", opts: ["Sửa mò → hy vọng tốt hơn", "Feedback → chọn điểm sửa → sửa → đo lại", "Đứng bánh chờ chỉ dẫn", "Xóa hết rồi làm lại"], correct: 1, why: "Một vòng iterate: feedback → chọn điểm sửa → sửa → đo lại. (File 2)" },
  { part: B, q: "Khi nghiệp vụ và kỹ thuật bất đồng, nên tạo đồng thuận dựa trên?", opts: ["Ai to tiếng hơn", "Ý kiến của người cấp cao nhất", "Bằng chứng người dùng / câu hỏi \"điều này phục vụ khách & outcome thế nào?\"", "Bỏ phiếu ngẫu nhiên"], correct: 2, why: "Tạo đồng thuận dựa trên bằng chứng người dùng / câu hỏi phục vụ khách & outcome. (File 2)" },
  { part: B, q: "Khi gặp bế tắc, hành vi ĐÚNG (must-pass) là gì?", opts: ["Im lặng tự xoay vài ngày rồi báo trễ", "Bỏ việc đó sang một bên", "Chờ mentor tự hỏi mình", "Chủ động hỏi sớm, hỏi có chuẩn bị (đã thử gì, kẹt ở đâu, cần gì)"], correct: 3, why: "Bế tắc: chủ động hỏi sớm, hỏi có chuẩn bị (must-pass). (File 2)" },
  { part: B, q: "\"Hỏi có chuẩn bị\" khi bế tắc nghĩa là gì?", opts: ["Nêu rõ mình đã thử gì, kẹt ở đâu, cần gì — không hỏi kiểu \"em không làm được\"", "Hỏi mọi câu vừa nghĩ ra", "Chỉ nói \"em bí rồi\"", "Đợi tới hạn chót mới hỏi"], correct: 0, why: "Hỏi có chuẩn bị = nêu đã thử gì, kẹt ở đâu, cần gì. (File 2)" },
  { part: B, q: "Vì sao \"im lặng nhưng cuối cùng tự xoay được\" vẫn là tín hiệu xấu với mentor?", opts: ["Vì kết quả chắc chắn sai", "Vì nó tạo rủi ro tiến độ và cho thấy thiếu tinh thần chịu trách nhiệm (ownership)", "Vì mentor không thích bạn", "Vì nó tốn token"], correct: 1, why: "Im lặng tự xoay tạo rủi ro tiến độ + thiếu ownership → tín hiệu xấu. (File 2)" },
  { part: B, q: "Bạn qua Gate 3 khi nào?", opts: ["Khi đạt một con số điểm cao", "Khi trình bày thật dài và đẹp", "Khi chứng minh đủ hành vi (workflow chạy + người dùng + giá trị đo được + iterate có bằng chứng + cộng tác chủ động)", "Khi mentor thấy bạn cố gắng nhiều"], correct: 2, why: "Qua gate khi chứng minh đủ hành vi (workflow + người dùng + giá trị đo được + iterate + cộng tác). (File 2)" },
  { part: B, q: "Nếu chưa đạt Gate 3 thì sao?", opts: ["Bị loại khỏi chương trình", "Phải làm lại từ buổi I1.1", "Điểm bị trừ vĩnh viễn", "Được kèm thêm và bảo vệ lại — gate đo năng lực thực tế, không phải là bài thi lý thuyết suông"], correct: 3, why: "Chưa đạt → được kèm thêm và bảo vệ lại; gate đo năng lực thực tế. (File 2)" },
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

export function LessonI33() {
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
    <div data-surface="portal" style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)" }}>
      {state.page === "overview" && <OverviewScreen go={go} />}
      {state.page === "read" && <ReadScreen state={state} go={go} />}
      {state.page === "gate" && <GateScreen go={go} />}
      {state.page === "exam" && (
        <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />
      )}
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I3.3">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 2 · Tuần 5–8</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I3.3 · Mentor Review &amp; Iterate (Gate 3)</span>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I3.3 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Gate 3 · Must-pass</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL3 🔒 · Collaboration &amp; Iteration</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Mentor Review &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Iterate</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Bạn đã có một deliverable &quot;dùng được&quot; (I3.2). Nhưng Product Builder <b style={{ color: "var(--fg-1)" }}>không làm việc một mình</b> — sản phẩm phải được người khác review và cải thiện qua từng vòng. Buổi Gate 3 rèn ba hành vi quyết định: <em style={{ fontStyle: "italic" }}>trình bày bằng chứng thay vì kể công sức</em>, <em style={{ fontStyle: "italic" }}>đón feedback như dữ liệu thay vì phòng thủ</em>, và <em style={{ fontStyle: "italic" }}>cải tiến (iterate) có trọng tâm</em>.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>90</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~29</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Gate 3 + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Đây là <b style={{ color: "var(--fg-1)" }}>buổi Gate 3</b>, khép lại giai đoạn Workflow &amp; Deliverable. Bạn mang deliverable đã QC ở <b style={{ color: "var(--fg-1)" }}>I3.2</b> đi bảo vệ trực tiếp trước mentor. Buổi này rèn ba hành vi quyết định thành bại ở giai đoạn mới vào nghề: <b style={{ color: "var(--fg-1)" }}>trình bày bằng chứng</b> (không kể công sức), <b style={{ color: "var(--fg-1)" }}>đón feedback như dữ liệu</b> (không phòng thủ), và <b style={{ color: "var(--fg-1)" }}>iterate có trọng tâm</b> để chứng minh phiên bản sau tốt hơn. Đây cũng là hành vi cộng tác mà mentor xét kỹ nhất — <b style={{ color: "var(--fg-1)" }}>tiêu chí bắt buộc để tốt nghiệp</b>.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~29 phút</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {PARTS.map((p, i) => (
                <a key={i} href="#" onClick={(e) => { e.preventDefault(); go("read", i); }} className="kh-part" style={{ display: "flex", gap: "22px", background: "#fff", border: "1px solid var(--fg-1)", borderRadius: "10px", padding: "24px 26px", textDecoration: "none", alignItems: "flex-start" }}>
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

          <section style={{ marginTop: "40px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--gold-deep)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff", fontSize: "22px" }}>⛳</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "7px" }}>Buổi đánh giá Gate — bài nộp bắt buộc</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Gate 3 — Bảo vệ v1 → Iterate v2 + before-after</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Lấy deliverable đã QC ở I3.2, <b style={{ color: "var(--fg-1)" }}>bảo vệ theo 4 nhịp</b>, nhận &amp; phân loại feedback, rồi <b style={{ color: "var(--fg-1)" }}>iterate ngay 1 vòng</b> với bảng before-after (v1 → v2). Xem đề + rubric ĐẠT + bài mẫu ở trang Gate 3.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--gold-deep)", color: "var(--gold-deep)" }}>Xem đề Gate 3 →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{checklistIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Điều kiện vượt Gate 3: đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> <b style={{ color: "var(--fg-1)" }}>và</b> phần bảo vệ + deliverable v2 đạt rubric → sang <b style={{ color: "var(--fg-1)" }}>I4.1 — Advanced Product Mindset</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Phải biết</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
              {MUST_KNOW.map((t, i) => (
                <span key={i} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Biết thêm · ôn nối buổi trước</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {NICE_KNOW.map((t, i) => (
                <span key={i} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Hành vi &quot;chủ động hỏi khi bế tắc, không im lặng&quot; là trọng tâm bắt buộc của NL3 — mentor quan sát trực tiếp trong buổi, không chỉ qua điểm thi.</p>
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
          <div style={{ border: "1px dashed var(--border)", borderRadius: "12px", padding: "18px 20px", background: "var(--gold-tint)" }}>
            <div style={{ font: "700 12px/1.3 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "6px" }}>Vị trí lộ trình</div>
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I3.2 (Build Deliverable &amp; QC)</b> → buổi <b style={{ color: "var(--fg-1)" }}>Gate 3 (NL3 🔒)</b> khép giai đoạn Workflow &amp; Deliverable → sang <b style={{ color: "var(--fg-1)" }}>I4.1 (Advanced Product Mindset &amp; Ownership)</b>.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReadScreen({ state, go }: { state: LessonState; go: (p: Page, part?: number) => void }) {
  const cur = PART_META[state.part];
  const prevArr = [
    { title: "Tổng quan buổi", open: () => go("overview") },
    { title: "Trình bày bằng chứng & Feedback", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "Iterate, Cộng tác & Đồng thuận", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Gate 3 · Bài nộp →", kicker: "HOÀN THÀNH", color: "var(--gold-deep)", open: () => go("gate") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.3
        </a>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "14px" }}>Nội dung · 2 phần</div>
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--gold-deep)", background: "var(--gold-tint)" }}>
            <span style={{ color: "var(--gold-deep)", flex: "none", fontSize: "15px" }}>⛳</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Gate 3 · Bài nộp</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{checklistIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Final Exam · 20 câu</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I3.3</a>
            {chevR()}
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{cur.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "700 12px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: cur.cDeep, marginBottom: "12px" }}>
            <span>Phần {cur.n} / 2</span><span style={{ opacity: ".4" }}>·</span><span>{cur.time} đọc</span>
          </div>
          <h1 style={{ font: "800 clamp(36px,4.6vw,54px)/1.04 var(--font-impact)", letterSpacing: "-.026em", margin: "0 0 34px", color: "var(--fg-1)" }}>{cur.title}</h1>

          {state.part === 0 && <Part1View />}
          {state.part === 1 && <Part2View go={go} />}

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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>S</span>ai lầm phổ biến khi bảo vệ deliverable: kể <i>&quot;em đã làm rất nhiều&quot;</i> — số giờ bỏ ra, số prompt đã thử, số đêm thức. Mentor <b>không chỉ đánh giá dựa trên nỗ lực đơn thuần</b>; mentor cần thấy <b>tín hiệu thực tế</b>: bài toán có thật, giải pháp có người dùng, giá trị đo được.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Bảo vệ = kể câu chuyện bằng chứng, không kể công sức</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "20px 22px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--rose-deep)", marginBottom: "12px" }}>✕ KỂ CÔNG SỨC — YẾU</div>
            <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>&quot;Em thử 30 prompt, mất 2 ngày, thức mấy đêm.&quot;</div>
            <div style={{ font: "13.5px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--rose-deep)", paddingTop: "10px" }}>Không nói được sản phẩm có ai dùng, tạo giá trị gì.</div>
          </div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "20px 22px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>✓ KỂ BẰNG CHỨNG — MẠNH</div>
            <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>&quot;Workflow này đã được 3 nhân viên CSKH dùng, thời gian xử lý ticket giảm ~20%.&quot;</div>
            <div style={{ font: "13.5px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--mint)", paddingTop: "10px" }}>Có người thật dùng + giá trị đo được (delta).</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Kể câu chuyện bằng chứng, không kể công sức.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Cấu trúc trình bày 4 nhịp</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Bảo vệ ngắn gọn theo đúng 4 nhịp — mỗi nhịp trả lời một câu hỏi:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1.1fr 1.3fr" }}>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Nhịp</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Câu hỏi</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Nội dung</div>
            {BEATS.map((b, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", background: "#fff" }}>
                  <span style={{ font: "italic 800 20px/1 var(--font-serif)", color: b.color }}>{b.n}</span>
                  <div style={{ font: "700 13.5px/1.3 var(--font-brand)", color: "var(--fg-1)", marginTop: "5px" }}>{b.name}</div>
                </div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{b.q}</div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{b.content}</div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Bốn nhịp bảo vệ: Bài toán → Workflow → Ai đã dùng → Giá trị đo được.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>&quot;(1) Khách hay chọn sai size khi mua online → đổi trả tăng. (2) Workflow: AI gợi ý size từ số đo, có checkpoint nhân viên duyệt (HITL). (3) 3 nhân viên CSKH đã dùng thử 1 tuần. (4) Tỉ lệ đổi trả do sai size trong nhóm thử giảm từ 12% xuống 9%.&quot; — bốn nhịp, toàn bằng chứng.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Feedback là dữ liệu, không phải công kích</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Khi mentor/đồng nghiệp chỉ ra điểm yếu, phản xạ tự nhiên là <b>phòng thủ</b> (giải thích, bào chữa, khó chịu). Đây là sai lầm lớn nhất: thái độ phòng thủ khiến bạn <b>bỏ lỡ những phản hồi giá trị để cải tiến sản phẩm</b>. Hãy coi feedback là <b>dữ liệu miễn phí về sản phẩm</b> — không phải phán xét về con người bạn.</p>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Đổi tư duy</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Thay vì nghe <i>&quot;cái này chưa ổn&quot;</i> và thấy bị chê, hãy nghe nó như <i>&quot;đây là một điểm dữ liệu giúp mình biết chỗ nào cải thiện được&quot;</i>.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Phân loại 3 nhóm feedback để xử lý đúng</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Không phải feedback nào cũng xử lý giống nhau. <b>Phân loại trước, rồi mới hành động:</b></p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {FB_GROUPS.map((g, i) => (
            <div key={i} style={{ border: `1px solid ${g.border}`, borderRadius: "12px", background: g.bg, padding: "16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "8px", background: g.color, color: "#fff", font: "700 13px/28px var(--font-numeric)", textAlign: "center" }}>{g.n}</span>
              <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)" }}>{g.name}</div>
              <div style={{ font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{g.what}</div>
              <div style={{ font: "11px/1.4 var(--font-mono)", color: g.color, borderTop: "1px dashed var(--border)", paddingTop: "7px", marginTop: "auto" }}>CÁCH XỬ LÝ</div>
              <div style={{ font: "12.5px/1.45 var(--font-body)", color: "var(--fg-1)", fontWeight: 600 }}>{g.action}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Ba nhóm feedback: phân loại trước, rồi mới hành động.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Phân biệt nhóm 1 với nhóm 3:</b> <b>lỗi sự thật</b> thì sửa không bàn cãi; <b>khác quan điểm</b> thì bạn được quyền giữ lựa chọn <i>nếu</i> có bằng chứng — nhưng phải trình bày lý do, không phòng thủ cảm tính.
      </div>

      <TldrDark items={[
        "Bảo vệ deliverable = <b>kể câu chuyện bằng chứng, không kể công sức</b>; theo 4 nhịp: Bài toán → Workflow → Ai đã dùng → Giá trị đo được.",
        "<b>Feedback là dữ liệu</b>, không phải công kích — phòng thủ làm mất tín hiệu cần để tiến lên.",
        "Phân loại <b>3 nhóm feedback</b> (lỗi sự thật → sửa ngay · thiếu sót → đánh giá &amp; bổ sung · khác quan điểm → cân nhắc, giải thích bằng bằng chứng).",
      ]} />

      <SelfCheck items={[
        "Viết một câu trình bày bằng chứng thay cho &quot;em đã thử rất nhiều prompt&quot;.",
        "Trình bày nhanh 4 nhịp cho một deliverable bạn từng làm.",
        "Mentor nói &quot;số 20% này lấy ở đâu?&quot; và &quot;sao không xét khách lớn tuổi?&quot; — mỗi câu thuộc nhóm feedback nào, xử lý ra sao?",
        "Vì sao phòng thủ khi nhận feedback lại có hại cho chính bạn?",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>S</span>au khi nhận feedback, cám dỗ là <b>sửa tất cả cùng lúc</b>. Đó là cách iterate kém: bạn tiêu tốn công sức dàn trải, và nếu kết quả tốt hơn cũng <b>không biết nhờ đâu</b>. Iterate kiểu builder: <b>chọn 1–2 điểm tác động lớn nhất</b>, sửa đúng chỗ đó, rồi <i>chứng minh</i> phiên bản sau tốt hơn.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Iterate có trọng tâm, không sửa lan man</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Cách chọn điểm sửa: ưu tiên <b>lỗi sự thật</b> (nhóm 1 — phải sửa) và <b>thiếu sót tác động lớn</b> (nhóm 2 — ảnh hưởng nhiều tới giá trị/độ tin cậy). Đừng để &quot;khác quan điểm&quot; (nhóm 3) kéo bạn đi sửa những thứ không cần.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--fg-2)", background: "var(--bg-warm)", border: "1px solid var(--border)", padding: "12px 15px", borderRadius: "9px", textAlign: "center", maxWidth: "170px" }}>Nhiều feedback nhận về</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 12px/1.3 var(--font-brand)", color: "#fff", background: "var(--iris)", padding: "12px 15px", borderRadius: "9px", textAlign: "center", maxWidth: "150px" }}>🔎 Lọc: chọn 1–2 điểm tác động lớn</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "12px 15px", borderRadius: "9px", textAlign: "center", maxWidth: "160px" }}>Sửa đúng chỗ + chứng minh delta</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Iterate có trọng tâm: chọn điểm tác động lớn, không sửa lan man.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Bảng before-after — chứng minh delta cải thiện</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Iterate chỉ có giá trị khi <b>đo được cái gì tốt hơn, bao nhiêu</b>. Công cụ: <b>bảng before-after (trước–sau)</b>.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1.2fr" }}>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Điểm sửa</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Trước (v1)</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Sau (v2)</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Delta / vì sao tốt hơn</div>
            {BEFORE_AFTER.map((r, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", background: "#fff", font: "700 13px/1.4 var(--font-brand)", color: "var(--fg-1)" }}>{r.point}</div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "var(--rose-tint)", font: "12.5px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.v1}</div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "var(--mint-tint)", font: "12.5px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.v2}</div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "12.5px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.delta}</div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Bảng before-after (v1 → v2) với delta đo được.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Nguyên tắc</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Mỗi vòng cải tiến (iterate) = <b>feedback → chọn điểm sửa → sửa → đo lại</b>. Không dậm chân tại chỗ khi kết quả chưa như kỳ vọng, cũng không sửa theo cảm tính. Đây là hành vi khởi đầu cho L4 (build → feedback → iterate).</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Cộng tác &amp; tạo đồng thuận giữa nghiệp vụ và kỹ thuật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Một Product Builder đóng vai trò <b>cầu nối</b> giữa người hiểu nghiệp vụ (khách cần gì) và người làm kỹ thuật (build thế nào). Ở L2, hành vi cộng tác được kỳ vọng:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {COLLAB.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ width: "26px", height: "26px", flex: "none", borderRadius: "7px", background: "var(--iris-tint)", color: "var(--iris-deep)", font: "700 13px/26px var(--font-numeric)", textAlign: "center" }}>{c.n}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{c.text}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Khi hai bên bất đồng, kéo về câu hỏi <b>&quot;điều này phục vụ khách/outcome thế nào?&quot;</b> — tạo đồng thuận dựa trên bằng chứng người dùng, không dựa trên &quot;ai to tiếng hơn&quot;.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Chủ động đặt câu hỏi — không im lặng khi bế tắc</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Đây là hành vi <b>trọng tâm bắt buộc để tốt nghiệp (NL3 🔒)</b>. Yếu tố quyết định thành bại của người mới không phải &quot;biết hết&quot;, mà là <b>biết hỏi đúng lúc</b>:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--rose-deep)", marginBottom: "12px" }}>✕ SAI — IM LẶNG CHỊU ĐỰNG</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Ngồi im vài ngày, tự vá tạm, tới hạn mới báo là chưa xong. Tạo rủi ro tiến độ &amp; thiếu ownership.</div>
          </div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>✓ ĐÚNG — HỎI CÓ CHUẨN BỊ</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Hỏi sớm, nêu rõ: đã thử gì, kẹt ở đâu, cần gì — không hỏi kiểu &quot;em không làm được&quot;.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Không im lặng khi bế tắc: hỏi sớm, hỏi có chuẩn bị.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Kẹt vì bảng size các mã hàng không đồng nhất. <b>Đúng:</b> nhắn mentor <i>&quot;Em đang làm gợi ý size, kẹt ở chỗ bảng size 3 mã khác chuẩn nhau — em định gộp theo cách A/B, anh thấy hướng nào ổn?&quot;</i>. <b>Sai:</b> im lặng, tự vá tạm, tới hạn mới báo chưa xong.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Vượt Gate = chứng minh hành vi thực tế, không chạy theo điểm số</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Bạn vượt Gate 3 khi <b>chứng minh đủ hành vi</b> (workflow chạy được + có người dùng + giá trị đo được + iterate có bằng chứng + cộng tác chủ động), không phải khi &quot;đạt một con số&quot;. Nếu chưa đạt, đó không phải thất bại — bạn được <b>kèm thêm và bảo vệ lại</b>. Gate đo <b>năng lực thực tế</b>, không đo khả năng học tủ/đối phó thi cử.</p>

      <TldrDark items={[
        "<b>Iterate có trọng tâm</b>: chọn 1–2 điểm tác động lớn, dùng <b>bảng before-after</b> chứng minh delta; không sửa lan man, không đứng bánh.",
        "<b>Cộng tác &amp; tạo đồng thuận</b> dựa trên bằng chứng người dùng; đứng ở cầu nối nghiệp vụ–kỹ thuật.",
        "<b>Chủ động hỏi đúng lúc, không im lặng khi bế tắc</b> (hành vi must-pass); gate đo <b>hành vi thực tế</b>, không phải điểm số.",
      ]} />

      <SelfCheck items={[
        "Nhận 5 feedback, bạn chọn điểm nào để iterate và vì sao? Bỏ điểm nào?",
        "Lập một bảng before-after (v1→v2) cho một cải tiến, ghi rõ delta.",
        "Viết một tin nhắn &quot;hỏi có chuẩn bị&quot; gửi mentor khi bạn đang bế tắc.",
        "Vì sao &quot;im lặng tự xoay được&quot; vẫn là tín hiệu xấu với mentor?",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--gold-deep)", marginBottom: "4px" }}>Đã nắm Collaboration &amp; Iteration 🎯</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Giờ hoàn tất buổi bằng <b style={{ color: "var(--fg-1)" }}>Gate 3</b> (bảo vệ v1 → iterate v2 + before-after) và <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu).</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none", background: "var(--gold-deep)", borderColor: "var(--gold-deep)" }}>Xem đề Gate 3 →</a>
      </div>
    </div>
  );
}

function GateScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Gate 3" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Gate 3 · Bài nộp bắt buộc</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Gate 3 — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--gold-deep)" }}>Bảo vệ &amp; Iterate</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 24px", maxWidth: "640px" }}>Buổi bảo vệ trực tiếp trước mentor, khép lại giai đoạn Workflow &amp; Deliverable. Đánh giá NL3 (Collaboration &amp; Iteration) + nối NL1/NL5/NL6. <b style={{ color: "var(--fg-1)" }}>Mang theo deliverable đã QC từ I3.2.</b></p>

      <div style={{ border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", padding: "20px 24px", margin: "0 0 34px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "10px" }}>Hai điều kiện vượt Gate 3</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}><span style={{ font: "700 13px/1.5 var(--font-mono)", color: "var(--gold-deep)", flex: "none" }}>a.</span><span>Phần bảo vệ + deliverable <b>v2</b> được đánh giá <b>Đạt</b> theo rubric.</span></div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}><span style={{ font: "700 13px/1.5 var(--font-mono)", color: "var(--gold-deep)", flex: "none" }}>b.</span><span>Final Exam đạt tối thiểu <b>16/20</b>.</span></div>
        </div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Đề bài</h2>
      <p style={{ font: "400 17px/1.75 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Lấy <b style={{ color: "var(--fg-1)" }}>deliverable bạn đã dựng &amp; QC ở I3.2</b> (spec / prototype / insight report). Trong buổi thực hiện 3 việc:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "0 0 22px" }}>
        {GATE_TASKS.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: "18px", background: "#fff", border: "1px solid var(--fg-1)", borderRadius: "12px", padding: "20px 22px", alignItems: "flex-start" }}>
            <span style={{ font: "italic 800 40px/1 var(--font-serif)", color: t.c, flex: "none", width: "44px" }}>{t.n}</span>
            <div style={{ flex: 1 }}><h3 style={{ font: "700 18px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>{t.title}</h3><p style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>{t.desc}</p></div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 40px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Hồ sơ nộp</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Deliverable <b>v2</b> + bảng before-after + sơ đồ workflow có đánh dấu điểm <b>HITL</b> + ghi chú &quot;feedback nào đã xử lý, thuộc nhóm nào&quot;.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Tiêu chí đánh giá ĐẠT (Rubric — 4 trục)</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Bài ĐẠT khi có đủ cả 4 trục:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {RUBRIC.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--mint-deep)" }}>{r.title}</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{r.desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 40px", padding: "18px 22px", background: "var(--gold-tint)", border: "1px dashed var(--gold-deep)", borderRadius: "12px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>⭐ Mức tốt (Stretch)</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Delta cải thiện đo bằng <b>con số rõ ràng</b>; nêu được <b>vòng iterate tiếp theo</b> sẽ ưu tiên gì.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 16px" }}>Bài làm mẫu tham khảo <span style={{ font: "600 14px/1 var(--font-mono)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "6px 10px", borderRadius: "6px", verticalAlign: "middle" }}>Mức ĐẠT · giả lập</span></h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ background: "var(--bg-ink)", padding: "16px 22px" }}>
          <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "5px" }}>Deliverable</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "#e6e7f2" }}>Insight report về đổi/trả áo khoác (từ I3.2).</div>
        </div>
        <div style={{ padding: "22px 24px" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "12px" }}>1 · Bảo vệ 4 nhịp</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "0 0 22px" }}>
            {SAMPLE_BEATS.map((b, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "baseline", font: "14px/1.55 var(--font-body)", color: "var(--fg-1)" }}>
                <span style={{ font: "700 10px/1.4 var(--font-mono)", color: "var(--iris-deep)", flex: "none", whiteSpace: "nowrap" }}>{b.tag}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "12px" }}>2 · Feedback nhận được &amp; phân loại</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", margin: "0 0 22px" }}>
            {SAMPLE_FB.map((f, i) => (
              <div key={i} style={{ border: `1px solid ${f.border}`, borderRadius: "9px", background: f.bg, padding: "11px 14px" }}>
                <div style={{ font: "13.5px/1.5 var(--font-body)", color: "var(--fg-1)" }}>&quot;{f.quote}&quot;</div>
                <div style={{ font: "11.5px/1.4 var(--font-mono)", color: f.color, marginTop: "5px" }}>→ {f.group} · {f.fix}</div>
              </div>
            ))}
          </div>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "12px" }}>3 · Before-after (v1 → v2)</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", margin: "0 0 18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.1fr" }}>
              <div style={{ background: "var(--bg-warm)", padding: "9px 12px", font: "700 10px/1.3 var(--font-mono)", color: "var(--fg-2)" }}>Điểm sửa</div>
              <div style={{ background: "var(--bg-warm)", padding: "9px 12px", font: "700 10px/1.3 var(--font-mono)", color: "var(--fg-2)", borderLeft: "1px solid var(--border)" }}>v1</div>
              <div style={{ background: "var(--bg-warm)", padding: "9px 12px", font: "700 10px/1.3 var(--font-mono)", color: "var(--fg-2)", borderLeft: "1px solid var(--border)" }}>v2</div>
              <div style={{ background: "var(--bg-warm)", padding: "9px 12px", font: "700 10px/1.3 var(--font-mono)", color: "var(--fg-2)", borderLeft: "1px solid var(--border)" }}>Delta</div>
              {SAMPLE_BA.map((r, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", font: "12px/1.45 var(--font-body)", color: "var(--fg-1)", fontWeight: 600 }}>{r.point}</div>
                  <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", font: "12px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{r.v1}</div>
                  <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", font: "12px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{r.v2}</div>
                  <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", font: "12px/1.45 var(--font-body)", color: "var(--mint-deep)" }}>{r.delta}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>4 · Cộng tác</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Đã chủ động nhắn mentor khi kẹt bảng size 3 mã (kèm phương án A/B), không ngồi im.</div>
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: "var(--mint-tint)", borderLeft: "3px solid var(--mint)", borderRadius: "0 10px 10px 0", font: "14px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--mint-deep)" }}>Nhận xét:</b> đủ 4 trục (bằng chứng + đón feedback + iterate có delta + cộng tác chủ động) → <b>ĐẠT</b>. Nếu chỉ trình bày &quot;em đã làm nhiều&quot; mà không có người dùng/delta → <b style={{ color: "var(--rose-deep)" }}>CHƯA ĐẠT</b>.
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "34px", flexWrap: "wrap" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none" }}>Làm Final Exam →</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 0); }} className="cta" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)" }}>Đọc lại Phần 1</a>
      </div>
    </div>
  );
}

function ExamScreen({
  state, go, pick, submit, reset,
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20. Kết hợp với phần bảo vệ + deliverable v2 đạt rubric → vượt Gate 3, sang I4.1 — Advanced Product Mindset & Ownership.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–10 → đọc lại Phần 1 (Bằng chứng & Feedback); 11–20 → Phần 2 (Iterate, Cộng tác & Đồng thuận).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · điều kiện vượt Gate 3</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I3.3</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Trình bày bằng chứng &amp; Feedback (1–10) · Iterate, Cộng tác &amp; Đồng thuận (11–20). Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.</p>

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