"use client";

import { useState } from "react";

type Page = "overview" | "read" | "canvas" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
}

const PASS_SCORE = 16;
const PASS_PCT = "80%";

const PART_META = [
  { n: "01", short: "Ownership · Scope · ROI", title: "Ownership, Scope-Timeline & ROI", time: "~17 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Product Canvas & System Thinking", title: "Product Canvas & System Thinking", time: "~17 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Ownership (3 hành vi), báo rủi ro sớm kèm phương án, scope-timeline trade-off (làm gì / KHÔNG làm), ưu tiên theo ROI/impact, tư duy MVP.", tags: ["Ownership", "Báo rủi ro sớm", "Scope trade-off", "ROI · MVP"] },
  { ...PART_META[1], desc: "Bắt đầu từ Problem không từ Solution, Product Canvas 8 mục, 6 lỗi phổ biến, AI-fit hai chiều, system thinking (hiệu ứng bậc hai · who pays the price).", tags: ["Product Canvas", "6 lỗi phổ biến", "AI-fit hai chiều", "System thinking"] },
];

const OBJECTIVES = [
  "Thể hiện ownership: chủ động cam kết deadline, báo rủi ro sớm, chịu trách nhiệm đến cùng.",
  "Áp dụng scope-timeline trade-off: quyết định làm gì / KHÔNG làm gì để đạt hiệu quả cao nhất với nguồn lực tối thiểu.",
  "Ưu tiên theo ROI/impact (dưới hướng dẫn mentor) và dùng tư duy MVP để thử nghiệm giả thuyết chi phí thấp.",
  "Lập một Product Canvas 8 mục hoàn chỉnh cho một feature thật; tránh 6 lỗi phổ biến.",
  "Dùng system thinking: lường hiệu ứng bậc hai và xác định rõ ai/bộ phận nào gánh chịu chi phí/rủi ro.",
];

const MUST_KNOW = ["Ownership", "Báo rủi ro sớm", "Scope-timeline trade-off", "Ưu tiên ROI/impact", "MVP", "Product Canvas 8 mục", "System Thinking", "AI-fit hai chiều"];
const NICE_KNOW = ["Output vs outcome (I1.2)", "Value metric (I1.2)", "Hypothesis (I2.3)", "Pain point / user (I2.2)", "Edge case (I3.2)", "AI-fit / cây quyết định (I1.1)", "Báo rủi ro (I3.3)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~34 phút" },
  { k: "Giai đoạn", v: "3 · Tuần 9–11" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL1 🔒 · Ownership" },
  { k: "Gate", v: "Không · buổi tích lũy" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — Ownership, Scope, ROI, MVP
const OWNERSHIP = [
  { n: "1", name: "Chủ động cam kết", what: "Cam kết kết quả & thời hạn — không chờ bị giao từng bước.", color: "var(--iris)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { n: "2", name: "Báo rủi ro sớm", what: "Thấy nguy cơ trễ/vướng → báo ngay kèm phương án, không giấu tới phút chót (nối I3.3).", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { n: "3", name: "Chịu trách nhiệm đến cùng", what: "Không bỏ dở; output dưới tên mình thì mình lo tới khi xong (nối diligence I1.2).", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];
const RISK_STEPS = [
  { n: "1", name: "Phát hiện sớm", text: "ngay khi ước tính thấy khả năng trễ tiến độ hoặc gặp trở ngại, coi đó là rủi ro cần báo — tránh chờ đến sát hạn." },
  { n: "2", name: "Báo kèm giải pháp", text: "thay vì chỉ \u201cem sợ trễ\u201d, đề xuất cụ thể: tinh giản scope phần Y, hoặc xin hỗ trợ nguồn lực Z." },
  { n: "3", name: "Đúng người, đúng lúc", text: "người có thể ra quyết định, sớm khi còn kịp xoay." },
];
const SCOPE_DO = ["Gợi ý size từ chiều cao/cân nặng", "Hướng dẫn đo cơ bản", "Áp dụng cho 1 dòng áo khoác"];
const SCOPE_DONT = ["AR thử đồ 3D", "Gợi ý cho toàn bộ danh mục", "Cá nhân hoá theo lịch sử mua"];

// Phần 2 — Product Canvas & System Thinking
const CANVAS_CELLS = [
  { n: "1", name: "Problem", q: "Ai đang vướng mắc, vấn đề gì?", link: "I2.2" },
  { n: "2", name: "User", q: "Cụ thể là ai (người dùng cuối)?", link: "I2.2" },
  { n: "3", name: "Hypothesis", q: "\u201cNếu [X] cho [Y] thì [metric Z]…\u201d", link: "I2.3" },
  { n: "4", name: "Solution", q: "Giải pháp đề xuất là gì?", link: "—" },
  { n: "5", name: "Build Scope", q: "Làm gì / KHÔNG làm gì?", link: "I4.1" },
  { n: "6", name: "Success Metric", q: "Đo giá trị thật bằng gì (value, không vanity)?", link: "I1.2" },
  { n: "7", name: "Edge Case", q: "Tình huống biên nào phá giải pháp?", link: "I3.2" },
  { n: "8", name: "AI-fit", q: "Bước nào NÊN / KHÔNG NÊN dùng AI?", link: "I1.1" },
];
const SIX_ERRORS = [
  { n: "1", wrong: "Nhảy thẳng vào Solution, bỏ qua Problem", fix: "Bắt đầu từ problem + nguyên nhân gốc" },
  { n: "2", wrong: "User quá rộng (\u201cmọi khách hàng\u201d)", fix: "Thu hẹp về nhóm cụ thể có pain point rõ" },
  { n: "3", wrong: "Hypothesis không đo được", fix: "Dùng công thức \u201cNếu X cho Y thì metric Z…\u201d" },
  { n: "4", wrong: "Chọn vanity metric (click, lượt dùng)", fix: "Chọn value metric phản ánh giá trị thật" },
  { n: "5", wrong: "Quên edge case, chỉ nghĩ luồng thuận lợi", fix: "Liệt kê edge case trước khi bắt tay build" },
  { n: "6", wrong: "AI-fit một chiều (chỉ liệt kê chỗ dùng AI)", fix: "Nêu cả chỗ KHÔNG nên dùng AI" },
];
const SYSTEM_Q = [
  { name: "Hiệu ứng bậc hai (second-order)", q: "Feature giải quyết vấn đề A, nhưng có vô tình tạo vấn đề B ở bộ phận khác không?", ex: "VD: gợi ý size giảm đổi trả, nhưng có làm tăng ticket CSKH hỏi lại về gợi ý không?", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { name: "Ai gánh chịu chi phí/rủi ro (Who pays the price?)", q: "Lợi ích thu được đánh đổi bằng gì, đối tượng nào phải gánh chi phí/rủi ro phát sinh?", ex: "Khách hàng, bộ phận CSKH, đội kỹ thuật hay chi phí vận hành hệ thống?", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { name: "Tương tác", q: "Feature này ảnh hưởng / được ảnh hưởng bởi feature nào khác?", ex: "Nối với các feature, quy trình vận hành và tổ chức xung quanh.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];

// Product Canvas page
const CANVAS_SAMPLE = [
  { n: "1", name: "Problem", val: "Khách mua online hay chọn sai size → tỉ lệ đổi/trả cao." },
  { n: "2", name: "User", val: "Khách mua áo khoác online lần đầu, chưa biết cách quy đổi size của YODY." },
  { n: "3", name: "Hypothesis", val: "Nếu gợi ý size từ chiều cao/cân nặng cho khách mua áo khoác thì tỉ lệ đổi/trả do sai size sẽ giảm." },
  { n: "4", name: "Solution", val: "Widget gợi ý size từ số đo + hướng dẫn đo, cho 1 dòng áo khoác." },
  { n: "5", name: "Build Scope", val: "LÀM: gợi ý size + hướng dẫn đo (1 dòng). KHÔNG (lần này): AR 3D, toàn danh mục, cá nhân hoá theo lịch sử mua." },
  { n: "6", name: "Success Metric", val: "Tỉ lệ đổi/trả do sai size trong 2 tuần (value) — không phải lượt bấm widget (vanity)." },
  { n: "7", name: "Edge Case", val: "Số đo bất thường / ngoài bảng size; khách bỏ trống số đo; bảng size 3 mã khác chuẩn nhau." },
  { n: "8", name: "AI-fit", val: "NÊN: ước lượng size từ số đo còn mơ hồ. KHÔNG NÊN: quy đổi cố định đã có bảng rule rõ ràng." },
];
const QC_CHECKLIST = [
  "Đã bắt đầu từ Problem (ai đau ở đâu) chứ chưa nhảy vào Solution?",
  "User đã thu hẹp về một nhóm cụ thể có pain point rõ, không phải \u201cmọi khách hàng\u201d?",
  "Hypothesis viết theo công thức \u201cNếu X cho Y thì metric Z…\u201d và đo được?",
  "Success Metric là value metric (giá trị thật), không phải vanity (click/lượt dùng)?",
  "Đã liệt kê Edge Case trước khi build, không chỉ nghĩ luồng thuận lợi?",
  "AI-fit hai chiều — nêu cả chỗ NÊN và chỗ KHÔNG NÊN dùng AI?",
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Ownership · Scope · ROI", B = "Phần B · Canvas · System Thinking";
const EXAM: ExamQ[] = [
  { part: A, q: "\u201cOwnership\u201d đúng nghĩa là gì?", opts: ["Làm thật nhiều giờ", "Nhận nhiều task nhất có thể", "Không bao giờ phải hỏi ai", "Chủ động cam kết + báo rủi ro sớm + chịu trách nhiệm đến cùng, không bỏ dở"], correct: 3, why: "Ownership = chủ động cam kết + báo rủi ro sớm + chịu trách nhiệm đến cùng, không bỏ dở. (File 1)" },
  { part: A, q: "\u201cBáo rủi ro sớm\u201d nên được thực hiện thế nào?", opts: ["Báo ngay khi thấy khả năng trễ/kẹt, kèm phương án, đúng người ra quyết định", "Đợi tới hạn chót rồi báo \u201cchưa xong\u201d", "Giấu để tự mình xoay", "Chỉ báo nếu được hỏi tới"], correct: 0, why: "Báo rủi ro sớm: ngay khi thấy khả năng trễ, kèm phương án, đúng người ra quyết định. (File 1)" },
  { part: A, q: "Báo rủi ro sớm là dấu hiệu của điều gì?", opts: ["Yếu kém", "Chuyên nghiệp và đáng tin", "Thiếu tự tin", "Đùn đẩy trách nhiệm"], correct: 1, why: "Báo rủi ro sớm là dấu hiệu chuyên nghiệp & đáng tin; giấu rủi ro mới đáng sợ. (File 1)" },
  { part: A, q: "\u201cScope-timeline trade-off\u201d nghĩa là gì?", opts: ["Làm càng nhiều tính năng càng tốt", "Kéo dài deadline vô hạn", "Tinh giản phạm vi: chọn phần giá trị nhất, cắt/hoãn phần ít giá trị để giao đúng hạn", "Không bao giờ cắt scope"], correct: 2, why: "Scope-timeline trade-off = tinh giản phạm vi, chọn phần giá trị nhất, cắt/hoãn phần ít giá trị. (File 1)" },
  { part: A, q: "Cắt scope (\u201ckhông làm phần Y lần này\u201d) có phải là làm ẩu không?", opts: ["Đúng, luôn là làm ẩu", "Đúng, vì bỏ mất tính năng", "Không rõ ràng", "Không — đó là giao đúng phần chứng minh được giả thuyết trong thời gian có"], correct: 3, why: "Cắt scope không phải làm ẩu; đó là giao đúng phần chứng minh giả thuyết trong thời gian có. (File 1)" },
  { part: A, q: "Ưu tiên theo ROI/impact nghĩa là ưu tiên phần nào trước?", opts: ["Tác động cao, công sức thấp", "Công sức cao nhất", "Tính năng mới lạ nhất", "Phần đối thủ đang làm"], correct: 0, why: "Ưu tiên tác động cao / công sức thấp trước. (File 1)" },
  { part: A, q: "\u201cTác động (impact)\u201d nên đo bằng loại metric nào?", opts: ["Vanity metric (lượt click)", "Value metric phản ánh giá trị thật", "Số dòng code", "Số lượng tính năng"], correct: 1, why: "Impact đo bằng value metric, không phải vanity. (File 1, nối I1.2)" },
  { part: A, q: "MVP (Minimum Viable Product) là gì?", opts: ["Sản phẩm hoàn chỉnh nhất", "Bản demo cho đẹp", "Bản nhỏ nhất đủ để kiểm chứng giả thuyết", "Bản có nhiều tính năng nhất"], correct: 2, why: "MVP = bản nhỏ nhất đủ để kiểm chứng giả thuyết. (File 1)" },
  { part: A, q: "Vì sao nên dùng tư duy MVP?", opts: ["Để trông chuyên nghiệp", "Để dùng nhiều token hơn", "Để làm hài lòng mentor", "Để tiêu ít nguồn lực nhất, học nhanh nhất, không đổ công vào thứ chưa chắc đúng"], correct: 3, why: "MVP giúp tiêu ít nguồn lực, học nhanh, không đổ công vào thứ chưa chắc đúng. (File 1)" },
  { part: A, q: "Đâu là biểu hiện THIẾU ownership?", opts: ["Nhận việc rồi im lặng, tới hạn mới báo \u201cchưa xong\u201d, đẩy \u201ctại AI\u201d", "Chủ động báo rủi ro kèm phương án", "Cam kết deadline rõ ràng", "Chịu trách nhiệm tới khi xong"], correct: 0, why: "Thiếu ownership: im lặng, báo trễ, đẩy \u201ctại AI\u201d. (File 1)" },
  { part: B, q: "Product Builder nên bắt đầu một feature từ đâu?", opts: ["Từ giải pháp/công nghệ mới nhất", "Từ problem: \u201cai đang đau ở đâu, tới mức nào?\u201d", "Từ việc đối thủ đang làm gì", "Từ tính năng dễ build nhất"], correct: 1, why: "Bắt đầu từ problem (\u201cai đau ở đâu, tới mức nào\u201d). (File 2)" },
  { part: B, q: "\u201cGắn AI vào cho có\u201d là lỗi gì?", opts: ["Chọn problem trước solution", "Đo bằng value metric", "Chọn giải pháp (AI) trước khi hiểu vấn đề", "Cắt scope hợp lý"], correct: 2, why: "\u201cGắn AI cho có\u201d = chọn giải pháp AI trước khi hiểu vấn đề. (File 2)" },
  { part: B, q: "Product Canvas 8 mục gồm những gì?", opts: ["Token · Cost · Latency · Accuracy (chỉ số kỹ thuật)", "Nói · Nghĩ · Làm · Cảm", "Input · AI · Output · Review", "Problem · User · Hypothesis · Solution · Build Scope · Success Metric · Edge Case · AI-fit"], correct: 3, why: "Canvas 8 mục: Problem · User · Hypothesis · Solution · Build Scope · Success Metric · Edge Case · AI-fit. (File 2)" },
  { part: B, q: "\u201cAI-fit là quyết định hai chiều\u201d nghĩa là gì?", opts: ["Nêu cả chỗ NÊN và chỗ KHÔNG NÊN dùng AI", "Chỉ liệt kê chỗ dùng AI", "Luôn dùng AI cho mọi bước", "Không bao giờ dùng AI"], correct: 0, why: "AI-fit hai chiều = nêu cả chỗ NÊN và KHÔNG NÊN dùng AI. (File 2)" },
  { part: B, q: "Khi nào AI KHÔNG đáng dùng cho một bước?", opts: ["Khi bài toán mơ hồ, ngôn ngữ tự nhiên", "Khi logic xác định / rule-based đã đủ, hoặc chi phí latency-cost cao hơn giá trị thêm", "Khi cần cá nhân hoá quy mô lớn", "Khi cần tóm tắt văn bản"], correct: 1, why: "AI không đáng khi logic xác định/rule-based đã đủ, hoặc latency-cost > giá trị thêm. (File 2, nối I1.1)" },
  { part: B, q: "\u201cUser quá rộng\u201d (ví dụ \u2018mọi khách hàng\u2019) là lỗi vì?", opts: ["Không phải là lỗi", "Vì tốn token", "Vì không thu hẹp về nhóm cụ thể có pain point rõ → khó thiết kế đúng", "Vì AI không hiểu được"], correct: 2, why: "User quá rộng → không thu hẹp về nhóm có pain point rõ → khó thiết kế đúng. (File 2)" },
  { part: B, q: "Danh sách \u201c6 lỗi phổ biến\u201d khi làm canvas nên được dùng thế nào?", opts: ["Bỏ qua vì ai cũng biết", "Chỉ đọc cho vui", "Chỉ mentor dùng", "Như checklist QC nhanh cho canvas trước khi mang đi review"], correct: 3, why: "6 lỗi phổ biến dùng như checklist QC nhanh cho canvas trước khi review. (File 2)" },
  { part: B, q: "\u201cSystem thinking\u201d nghĩa là gì?", opts: ["Nhìn nhận tính năng trong hệ thống lớn hơn: lường trước hiệu ứng bậc hai & xác định đối tượng gánh chịu chi phí/rủi ro", "Chỉ tập trung vào một feature trước mắt", "Thiết kế hệ thống máy chủ", "Dùng nhiều mô hình AI cùng lúc"], correct: 0, why: "System thinking = nhìn tính năng trong hệ thống lớn, lường hiệu ứng bậc hai & đối tượng gánh chịu chi phí/rủi ro. (File 2)" },
  { part: B, q: "\u201cHiệu ứng bậc hai (second-order)\u201d là gì?", opts: ["Lợi ích trực tiếp của feature", "Feature giải quyết A nhưng có thể tạo vấn đề B ở nơi khác", "Phiên bản thứ hai của feature", "Một lỗi trong code"], correct: 1, why: "Hiệu ứng bậc hai: giải quyết A nhưng có thể tạo vấn đề B ở nơi khác. (File 2)" },
  { part: B, q: "Câu hỏi \u201cWho pays the price?\u201d trong system thinking nhằm làm gì?", opts: ["Tính giá bán sản phẩm", "Tìm người để đổ lỗi", "Xác định lợi ích thu được đánh đổi bằng gì, ai/bộ phận nào sẽ gánh chịu chi phí/rủi ro phát sinh", "Tính lương nhân viên"], correct: 2, why: "\u201cWho pays the price?\u201d = xác định lợi ích đánh đổi bằng gì, ai sẽ gánh chịu chi phí/rủi ro. (File 2)" },
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
const canvasIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
);
const checklistIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
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

export function LessonI41() {
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
      {state.page === "canvas" && <CanvasScreen go={go} />}
      {state.page === "exam" && (
        <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />
      )}
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I4.1">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 3 · Tuần 9–11</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I4.1 · Advanced Product Mindset &amp; Ownership</span>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I4.1 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL1 🔒 · Outcome &amp; Ownership</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Mở đầu Giai đoạn 3</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Advanced Product Mindset &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Ownership</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Ở I1.2 bạn học output vs outcome. Buổi này nâng lên mức <b style={{ color: "var(--fg-1)" }}>làm chủ (ownership)</b> — yếu tố thực tập sinh thiếu nhất và mentor xét kỹ nhất khi tốt nghiệp. Bạn học <em style={{ fontStyle: "italic" }}>tinh giản phạm vi (scope)</em>, <em style={{ fontStyle: "italic" }}>ưu tiên theo tác động (ROI)</em>, rồi gộp tất cả vào một <em style={{ fontStyle: "italic" }}>Product Canvas</em> — khung tư duy tích hợp mọi thứ đã học từ I1 đến I3.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~34</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Product Canvas + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Đây là buổi <b style={{ color: "var(--fg-1)" }}>mở đầu Giai đoạn 3 — &quot;Workflow &amp; Độc lập phát triển&quot;</b>. Ownership không phải &quot;làm nhiều&quot;, mà là <b style={{ color: "var(--fg-1)" }}>chủ động cam kết, báo rủi ro sớm, và chịu trách nhiệm đến cùng — không bỏ dở</b>. Đồng thời bạn học cách <b style={{ color: "var(--fg-1)" }}>tinh giản scope</b> và <b style={{ color: "var(--fg-1)" }}>ưu tiên theo ROI</b> để tạo nhiều giá trị nhất với nguồn lực tối thiểu. Ownership là <b style={{ color: "var(--fg-1)" }}>tiêu chí bắt buộc để tốt nghiệp (NL1 🔒)</b> — mentor xét qua hành vi thực tế, không chỉ qua điểm thi.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~34 phút</span>
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

          <section style={{ marginTop: "40px", border: "1px solid var(--iris)", borderRadius: "12px", overflow: "hidden", background: "var(--iris-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--iris)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff" }}>{canvasIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "7px" }}>Sản phẩm của buổi</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Product Canvas 8 mục cho một feature thật</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Một Product Canvas đầy đủ (vấn đề · giả thuyết · chỉ số thành công · mức độ phù hợp AI · trường hợp biên · rủi ro) — nguyên liệu cho các buổi build tiếp theo. Xem khung + bài mẫu + checklist 6 lỗi ở trang Product Canvas.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("canvas"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Xem Product Canvas →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--gold-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang buổi I4.2. Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I4.2 — Dev Craft (Git, đọc/debug code AI, test)</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--gold-deep)", color: "var(--gold-deep)" }}>Làm bài test →</a>
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
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Ownership (chủ động cam kết · báo rủi ro sớm · chịu trách nhiệm đến cùng) là trọng tâm bắt buộc của NL1 — mentor quan sát hành vi thực tế, không chỉ qua điểm thi.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I3.3 (đã qua Gate 3)</b> → buổi <b style={{ color: "var(--fg-1)" }}>I4.1 (mở đầu Giai đoạn 3, NL1 🔒)</b> → sang <b style={{ color: "var(--fg-1)" }}>I4.2 (Dev Craft — Git, đọc/debug code AI, test)</b>.</p>
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
    { title: "Ownership, Scope-Timeline & ROI", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "Product Canvas & System Thinking", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Product Canvas · Sản phẩm buổi →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("canvas") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.1
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("canvas"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{canvasIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Product Canvas · Sản phẩm buổi</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", border: "1px dashed var(--gold-deep)", background: "var(--gold-tint)" }}>
            <span style={{ color: "var(--gold-deep)", flex: "none", display: "flex" }}>{checklistIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Final Exam · 20 câu</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I4.1</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>O</span>wnership là yếu tố mentor xét kỹ nhất khi tốt nghiệp, và là thứ thực tập sinh <b>thiếu nhất</b>. Ownership <b>không phải</b> &quot;làm thật nhiều giờ&quot; — nó là <b>làm chủ kết quả</b>: chủ động cam kết, báo rủi ro sớm, và chịu trách nhiệm đến cùng.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Ownership = ba hành vi, không phải nhiều giờ</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {OWNERSHIP.map((g, i) => (
            <div key={i} style={{ border: `1px solid ${g.border}`, borderRadius: "12px", background: g.bg, padding: "16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "8px", background: g.color, color: "#fff", font: "700 13px/28px var(--font-numeric)", textAlign: "center" }}>{g.n}</span>
              <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)" }}>{g.name}</div>
              <div style={{ font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{g.what}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Ownership = làm chủ kết quả, không chỉ làm nhiều.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Đối lập:</b> người thiếu ownership nhận việc rồi im lặng, tới hạn mới báo &quot;chưa xong&quot;, hoặc đẩy trách nhiệm (&quot;tại AI&quot;, &quot;tại chưa ai bảo&quot;). Người có ownership coi kết quả là <i>của mình</i>.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Báo rủi ro sớm — cơ chế cụ thể</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Báo rủi ro sớm là hành vi ownership <b>đo được</b>. Ba bước:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {RISK_STEPS.map((c, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ width: "26px", height: "26px", flex: "none", borderRadius: "7px", background: "var(--iris-tint)", color: "var(--iris-deep)", font: "700 13px/26px var(--font-numeric)", textAlign: "center" }}>{c.n}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>{c.name} — </b>{c.text}</div>
          </div>
        ))}
      </div>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--rose-deep)", marginBottom: "12px" }}>✕ CHỈ NÊU LO LẮNG — YẾU</div>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Em sợ không kịp deadline.&quot;</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--rose-deep)", paddingTop: "10px" }}>Không có phương án — mentor không biết xoay thế nào.</div>
          </div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>✓ KÈM PHƯƠNG ÁN — MẠNH</div>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Rủi ro X có thể làm trễ 2 ngày; em đề xuất cắt phần Y hoặc xin thêm nguồn lực Z — anh/chị chọn phương án nào?&quot;</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--mint)", paddingTop: "10px" }}>Báo sớm, kèm phương án, đúng người ra quyết định.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Báo rủi ro sớm là dấu hiệu chuyên nghiệp &amp; đáng tin, không phải yếu kém.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Scope-Timeline trade-off — làm gì và KHÔNG làm gì</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Nguồn lực luôn hữu hạn. Ownership đi kèm khả năng <b>tinh giản phạm vi (scope)</b>: tập trung vào phần giá trị lớn nhất, chủ động cắt/hoãn phần ít giá trị. Cách làm: liệt kê rõ <b>&quot;Việc cần làm&quot; vs &quot;Việc KHÔNG làm (lần này)&quot;</b>.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>✓ LÀM (lần này)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SCOPE_DO.map((s, i) => (
                <div key={i} style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", display: "flex", gap: "8px" }}><span style={{ color: "var(--mint-deep)" }}>•</span>{s}</div>
              ))}
            </div>
          </div>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--rose-deep)", marginBottom: "12px" }}>✕ KHÔNG LÀM (lần này)</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {SCOPE_DONT.map((s, i) => (
                <div key={i} style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", display: "flex", gap: "8px" }}><span style={{ color: "var(--rose-deep)" }}>•</span>{s}</div>
              ))}
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Feature gợi ý size, deadline 2 tuần (YODY · giả lập).</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Tinh giản scope <b>không phải làm cẩu thả</b> — mà là bàn giao đúng phần cốt lõi để <b>kiểm chứng giả thuyết</b> trong khung thời gian cho phép.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Ưu tiên theo ROI/impact</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Khi có nhiều đầu việc, ưu tiên phần <b>tác động cao, công sức thấp</b> trước. Ở L2, bạn làm việc này <i>dưới sự hướng dẫn của mentor</i>. Nhớ nối với Outcome Thinking (I1.2): tác động đo bằng <b>value metric</b>, không phải <b>vanity metric</b>.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "20px 22px" }}>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", textAlign: "center", marginBottom: "10px", letterSpacing: ".1em", textTransform: "uppercase" }}>▲ Tác động (impact)</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div style={{ border: "2px solid var(--mint)", background: "var(--mint-tint)", borderRadius: "10px", padding: "16px", textAlign: "center" }}><div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--mint-deep)" }}>Tác động cao · công sức thấp</div><div style={{ font: "800 12px/1 var(--font-mono)", color: "var(--mint-deep)", marginTop: "8px", letterSpacing: ".1em" }}>⭐ ƯU TIÊN TRƯỚC</div></div>
            <div style={{ border: "1px solid var(--border)", background: "var(--bg-warm)", borderRadius: "10px", padding: "16px", textAlign: "center" }}><div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--fg-2)" }}>Tác động cao · công sức cao</div><div style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--fg-3)", marginTop: "8px" }}>Lên kế hoạch / chia nhỏ</div></div>
            <div style={{ border: "1px solid var(--border)", background: "var(--bg-warm)", borderRadius: "10px", padding: "16px", textAlign: "center" }}><div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--fg-2)" }}>Tác động thấp · công sức thấp</div><div style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--fg-3)", marginTop: "8px" }}>Làm sau nếu rảnh</div></div>
            <div style={{ border: "1px solid var(--rose-deep)", background: "var(--rose-tint)", borderRadius: "10px", padding: "16px", textAlign: "center" }}><div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--rose-deep)" }}>Tác động thấp · công sức cao</div><div style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--rose-deep)", marginTop: "8px" }}>✕ Tránh / bỏ</div></div>
          </div>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", textAlign: "right", marginTop: "10px", letterSpacing: ".1em", textTransform: "uppercase" }}>Công sức (effort) ▶</div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 4 — Lưới ưu tiên tác động × công sức: ưu tiên góc tác động cao / công sức thấp.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · MVP — bản nhỏ nhất chứng minh giả thuyết</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>MVP (Minimum Viable Product)</b> là phiên bản <i>tối giản nhất đủ để kiểm chứng giả thuyết</i> (nối I2.3). Thay vì xây toàn bộ rồi mới biết đúng/sai, triển khai phần cốt lõi trước, đo kết quả, rồi mới mở rộng. Đó là ownership thông minh: <b>không lãng phí công sức vào những thứ chưa chắc chắn</b>.</p>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Thay vì build hệ gợi ý size cho toàn danh mục, MVP = gợi ý cho <b>một dòng áo khoác</b>, đo tỉ lệ đổi/trả trong 2 tuần. Đúng hướng thì mở rộng; sai thì đã tiết kiệm được rất nhiều công sức.</p>
      </div>

      <TldrDark items={[
        "<b>Ownership</b> (must-pass) = chủ động cam kết + <b>báo rủi ro sớm kèm phương án</b> + chịu trách nhiệm đến cùng; không giấu rủi ro, không bỏ dở.",
        "<b>Scope-timeline trade-off</b>: tinh giản phạm vi, làm rõ việc làm / KHÔNG làm lần này, ưu tiên theo tác động thực (ROI) đo bằng value metric.",
        "<b>MVP</b> = bản tối giản nhất để kiểm chứng giả thuyết → tiết kiệm nguồn lực, học nhanh; không đổ công vào thứ chưa chắc đúng.",
      ]} />

      <SelfCheck items={[
        "Nêu 3 hành vi cụ thể thể hiện ownership với một task bạn đang đảm nhận.",
        "Viết thử một tin nhắn &quot;báo rủi ro sớm kèm phương án&quot; gửi mentor khi gặp trễ tiến độ.",
        "Chọn một feature với deadline 2 tuần: liệt kê rõ &quot;Việc cần làm / Việc KHÔNG làm (lần này)&quot;.",
        "Định nghĩa MVP cho một ý tưởng của bạn và nêu bạn sẽ đo gì để biết đúng/sai.",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>C</span>ạm bẫy kinh điển: <i>&quot;Tích hợp AI cho hợp xu hướng&quot;</i> — chọn giải pháp trước khi hiểu vấn đề. Product Builder bắt đầu bằng câu hỏi <b>&quot;ai đang đau ở đâu, đau tới mức nào?&quot;</b> (nối I2.2/I2.3). Feature chỉ là <b>giả thuyết</b> về cách giải quyết nỗi đau, không phải đích đến.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Bắt đầu từ Problem, không từ Solution</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "700 12px/1.3 var(--font-brand)", color: "#fff", background: "var(--iris)", padding: "12px 15px", borderRadius: "9px", textAlign: "center" }}>Problem<br /><span style={{ font: "400 11px/1.3 var(--font-body)", opacity: .85 }}>ai đau ở đâu?</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "12px 15px", borderRadius: "9px", textAlign: "center" }}>Hypothesis<br /><span style={{ font: "400 11px/1.3 var(--font-body)" }}>feature là giả thuyết</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "12px 15px", borderRadius: "9px", textAlign: "center" }}>Metric<br /><span style={{ font: "400 11px/1.3 var(--font-body)" }}>đo giá trị thật</span></span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Luồng tư duy: Problem → Hypothesis → Metric, không nhảy thẳng vào Solution.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Product Canvas 8 mục — khung tích hợp</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Khung <b>gộp mọi thứ đã học từ I1 đến I3</b> thành một trang, để suy nghĩ đầy đủ trước khi build:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.3fr 1.6fr 0.7fr" }}>
            <div style={{ background: "var(--bg-ink)", padding: "12px 12px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>#</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Mục</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Câu hỏi cốt lõi</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Nối buổi</div>
            {CANVAS_CELLS.map((c, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ padding: "13px 12px", borderTop: "1px solid var(--border)", background: "#fff" }}><span style={{ font: "italic 800 20px/1 var(--font-serif)", color: "var(--iris)" }}>{c.n}</span></div>
                <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "700 13.5px/1.35 var(--font-brand)", color: "var(--fg-1)" }}>{c.name}</div>
                <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{c.q}</div>
                <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "11px/1.4 var(--font-mono)", color: "var(--iris-deep)" }}>{c.link}</div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Product Canvas 8 mục: gộp mọi thứ đã học thành 1 trang trước khi build.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>AI-fit là quyết định hai chiều</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Không chỉ &quot;nơi nào NÊN dùng AI&quot; mà cả &quot;nơi nào KHÔNG NÊN&quot;. AI đáng dùng khi: bài toán mơ hồ, xử lý ngôn ngữ tự nhiên, cá nhân hóa quy mô lớn. AI <b>không</b> đáng khi: logic đã rõ ràng, rule-based đã đủ, hoặc chi phí latency/cost lớn hơn giá trị AI mang lại (nối cây quyết định I1.1).</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Sáu lỗi phổ biến khi làm canvas</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Đây cũng là <b>checklist QC nhanh</b> cho canvas của bạn trước khi mang đi review:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.4fr 1.3fr 1.3fr" }}>
            <div style={{ background: "var(--bg-ink)", padding: "12px 12px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>#</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Lỗi</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Sửa</div>
            {SIX_ERRORS.map((e, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ padding: "13px 12px", borderTop: "1px solid var(--border)", background: "#fff" }}><span style={{ width: "24px", height: "24px", display: "inline-block", borderRadius: "6px", background: "var(--rose-tint)", color: "var(--rose-deep)", font: "700 12px/24px var(--font-numeric)", textAlign: "center" }}>{e.n}</span></div>
                <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{e.wrong}</div>
                <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.5 var(--font-body)", color: "var(--mint-deep)", fontWeight: 600 }}>{e.fix}</div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Sáu lỗi phổ biến &amp; cách sửa — dùng như checklist QC.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · System Thinking — nhìn feature trong hệ thống lớn hơn</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Một feature không hoạt động đơn lẻ; nó nằm trong một <b>hệ thống</b> gồm người dùng, quy trình vận hành, các feature khác, và tổ chức. Tư duy hệ thống là thói quen đặt ba câu hỏi:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 20px" }}>
        {SYSTEM_Q.map((s, i) => (
          <div key={i} style={{ border: `1px solid ${s.border}`, borderRadius: "12px", background: s.bg, padding: "16px 18px" }}>
            <div style={{ font: "700 14px/1.3 var(--font-brand)", color: s.color, marginBottom: "6px" }}>{s.name}</div>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{s.q}</div>
            <div style={{ font: "italic 13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "8px", borderTop: `1px dashed ${s.border}`, paddingTop: "8px" }}>{s.ex}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Ở L2 chưa cần thiết kế hệ thống lớn (đó là L4–L5), nhưng <b>phải tập thói quen</b> nhìn xa hơn feature trước mắt — chỉ ra được hiệu ứng bậc hai &amp; đối tượng gánh chịu chi phí/rủi ro là dấu hiệu tư duy hệ thống đang hình thành.</div>

      <TldrDark items={[
        "<b>Bắt đầu từ Problem, không từ Solution</b>; feature chỉ là giả thuyết về cách giải quyết nỗi đau.",
        "<b>Product Canvas 8 mục</b> (Problem · User · Hypothesis · Solution · Build Scope · Metric · Edge Case · AI-fit) gộp mọi thứ đã học; tránh 6 lỗi phổ biến; <b>AI-fit là quyết định hai chiều</b>.",
        "<b>System thinking</b>: nhìn feature trong hệ thống tổng thể — lường trước hiệu ứng bậc hai &amp; xác định rõ đối tượng gánh chịu chi phí/rủi ro.",
      ]} />

      <SelfCheck items={[
        "Điền nhanh 8 mục Product Canvas cho một feature YODY bạn chọn.",
        "Trong 6 lỗi phổ biến, bạn dễ mắc lỗi nào nhất? Cách bạn tự chặn?",
        "Cho &quot;AI-fit hai chiều&quot;: nêu 1 bước NÊN và 1 bước KHÔNG NÊN dùng AI trong feature đó.",
        "Với &quot;gợi ý size&quot;: nêu 1 hiệu ứng bậc hai và đối tượng gánh chịu chi phí/rủi ro tương ứng.",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã nắm Product Mindset &amp; Ownership 🎯</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Giờ hoàn thiện <b style={{ color: "var(--fg-1)" }}>Product Canvas</b> cho một feature thật và làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu) trước khi sang I4.2.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("canvas"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Xem Product Canvas →</a>
      </div>
    </div>
  );
}

function CanvasScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Product Canvas" style={{ maxWidth: "900px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Sản phẩm của buổi · Product Canvas</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Product Canvas <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>8 mục</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "640px" }}>Lập một Product Canvas đầy đủ cho <b style={{ color: "var(--fg-1)" }}>một feature thật của YODY</b> — khung tư duy tích hợp mọi thứ đã học từ I1 đến I3, và là nguyên liệu cho các buổi build tiếp theo.</p>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Khung điền — 8 ô</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Điền tuần tự; luôn bắt đầu từ Problem, không từ Solution.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "0 0 34px" }}>
        {CANVAS_CELLS.map((c, i) => (
          <div key={i} style={{ border: "1px solid var(--fg-1)", borderRadius: "12px", background: "#fff", padding: "16px 18px", minHeight: "96px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <span style={{ width: "24px", height: "24px", flex: "none", borderRadius: "7px", background: "var(--iris)", color: "#fff", font: "700 12px/24px var(--font-numeric)", textAlign: "center" }}>{c.n}</span>
              <span style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--fg-1)" }}>{c.name}</span>
              <span style={{ marginLeft: "auto", font: "600 10px/1 var(--font-mono)", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "4px 7px", borderRadius: "5px" }}>{c.link}</span>
            </div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)" }}>{c.q}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 16px" }}>Bài mẫu tham khảo <span style={{ font: "600 14px/1 var(--font-mono)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "6px 10px", borderRadius: "6px", verticalAlign: "middle" }}>Feature &quot;Gợi ý size&quot; · giả lập</span></h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ background: "var(--bg-ink)", padding: "16px 22px" }}>
          <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "5px" }}>Feature</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "#e6e7f2" }}>Widget gợi ý size áo khoác từ chiều cao/cân nặng — MVP cho 1 dòng sản phẩm.</div>
        </div>
        <div style={{ padding: "8px 8px" }}>
          {CANVAS_SAMPLE.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", padding: "13px 14px", borderBottom: "1px solid var(--border)", alignItems: "flex-start" }}>
              <span style={{ width: "26px", height: "26px", flex: "none", borderRadius: "7px", background: "var(--iris-tint)", color: "var(--iris-deep)", font: "700 13px/26px var(--font-numeric)", textAlign: "center" }}>{c.n}</span>
              <div style={{ flex: "none", width: "118px", font: "700 13.5px/1.35 var(--font-brand)", color: "var(--fg-1)", paddingTop: "3px" }}>{c.name}</div>
              <div style={{ flex: 1, font: "13.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{c.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: "var(--mint-tint)", borderLeft: "3px solid var(--mint)", borderRadius: "0 10px 10px 0", font: "14px/1.7 var(--font-body)", color: "var(--fg-1)", margin: "0 0 40px" }}>
        <b style={{ color: "var(--mint-deep)" }}>Vì sao đạt:</b> bắt đầu từ Problem thật · User cụ thể · Hypothesis đo được · Scope có &quot;KHÔNG làm&quot; · Metric là value (không vanity) · có Edge Case · AI-fit hai chiều (nêu cả chỗ KHÔNG dùng AI).
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Checklist QC — chặn 6 lỗi trước khi review</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Rà lại canvas của bạn qua 6 câu hỏi này:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 34px" }}>
        {QC_CHECKLIST.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "14px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{q}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20. Kết hợp với Product Canvas hoàn chỉnh → sẵn sàng sang I4.2 — Dev Craft (Git, đọc/debug code AI, test).`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–10 → đọc lại Phần 1 (Ownership · Scope · ROI); 11–20 → Phần 2 (Product Canvas & System Thinking).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · làm trước khi sang I4.2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I4.1</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Ownership · Scope · ROI · MVP (1–10) · Product Canvas &amp; System Thinking (11–20). Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.</p>

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
