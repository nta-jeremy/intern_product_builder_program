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
  { n: "01", short: "Ship vs Demo & Tài liệu", title: "Ship ≠ Demo, Tài liệu kiến trúc & Tính toàn vẹn", time: "~15 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Bảo vệ & Phản biện", title: "Bảo vệ & Phản biện trước Hội đồng", time: "~15 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Sự khác biệt cốt lõi Ship ≠ Demo (người dùng thật và hiệu quả/tác động đo lường được); 4 nguyên tắc tốt nghiệp với điều kiện cứng tính toàn vẹn ở quy mô lớn (integrity at scale); tài liệu kiến trúc & rủi ro như một phần bắt buộc của sản phẩm.", tags: ["Ship ≠ Demo", "4 nguyên tắc tốt nghiệp", "Tài liệu kiến trúc", "Integrity at scale"] },
  { ...PART_META[1], desc: "Cấu trúc buổi bảo vệ Demo Day gồm 3 phần; tinh thần \"bảo vệ là chịu trách nhiệm, không phải trình diễn\"; chuẩn bị trả lời 6 câu hỏi phản biện thường gặp & cách trả lời neo về trách nhiệm; cùng demo dự phòng (fallback).", tags: ["Cấu trúc Demo Day", "Bảo vệ = chịu trách nhiệm", "6 câu phản biện", "Demo dự phòng"] },
];

const OBJECTIVES = [
  "Phân biệt được triển khai thực tế (ship) và chạy thử (demo); trình bày được sản phẩm đã đưa vào sử dụng thực tế với kết quả (outcome) đo lường được.",
  "Trình bày được tài liệu kiến trúc & rủi ro như một phần không thể thiếu của sản phẩm.",
  "Bảo vệ là chịu trách nhiệm: trả lời được câu hỏi &quot;nếu hỏng thì sao&quot;, &quot;ai chịu trách nhiệm khi lộ dữ liệu&quot;, &quot;vì sao lựa chọn thiết kế này&quot;.",
  "Hiểu được tính toàn vẹn ở quy mô lớn (integrity at scale) là điều kiện bắt buộc — để lộ PII không kiểm soát thì vẫn KHÔNG ĐẠT.",
  "Nắm rõ tiêu chuẩn tốt nghiệp Thực tập sinh Product Builder (L2) và chuẩn bị đầy đủ bằng chứng.",
];

const MUST_KNOW = ["Ship vs Demo", "Impact / Outcome", "Tài liệu kiến trúc", "Integrity at scale", "Bảo vệ = chịu trách nhiệm", "6 câu phản biện", "Demo dự phòng (fallback)", "4 must-pass", "L2 · 7 năng lực", "Rubric 4 trục", "🔒 PII override"];
const NICE_KNOW = ["Outcome / PII (I1.2)", "Fallback (I4.2)", "Kiến trúc & trade-off (I5.1)", "Guardrail / eval / risk (I5.2)", "Ship vs demo (I4.3)"];

const META = [
  { k: "Thời lượng live", v: "90 phút · demo day" },
  { k: "Thời gian đọc", v: "~30 phút" },
  { k: "Giai đoạn", v: "4 · Tuần 12–14" },
  { k: "Cấp độ", v: "L2 · tốt nghiệp" },
  { k: "Năng lực", v: "Tổng hợp NL1–NL7" },
  { k: "Gate", v: "🎓 Tốt nghiệp L2" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Part 1 — Ship vs Demo
const SHIP_VS_DEMO = [
  { name: "Demo — chạy thử cho Hội đồng xem", color: "var(--fg-2)", border: "var(--border)", bg: "#fff", text: "phiên bản chạy thử trên môi trường dựng sẵn với dữ liệu mẫu. Mục đích chỉ để chứng minh sản phẩm CÓ THỂ chạy — chưa phải bằng chứng tốt nghiệp." },
  { name: "Ship — triển khai thực tế", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", text: "sản phẩm thật được người dùng thật sử dụng để làm việc hằng ngày, trên dữ liệu thật, và ĐO LƯỜNG ĐƯỢC hiệu quả/tác động (impact). Đây mới là bằng chứng tốt nghiệp." },
];
const GRAD_PRINCIPLES = [
  { n: "1", name: "Ship ≠ Demo", text: "bằng chứng tốt nghiệp phải là người dùng thật + kết quả đo lường được (impact), không phải một bản chạy thử nghiệm.", border: "var(--iris)", borderW: "1px", bg: "var(--iris-tint)", badgeBg: "var(--iris)", nameColor: "var(--fg-1)" },
  { n: "2", name: "Tài liệu kiến trúc là một phần của sản phẩm", text: "người khác đọc tài liệu phải hiểu: hệ thống làm gì · rủi ro ở đâu · kiểm soát thế nào · phương án scale ra sao. Không có tài liệu = không thể bàn giao và bảo trì.", border: "var(--iris)", borderW: "1px", bg: "var(--iris-tint)", badgeBg: "var(--iris)", nameColor: "var(--fg-1)" },
  { n: "3", name: "Bảo vệ là chịu trách nhiệm, không phải trình diễn", text: "bạn xuất hiện để chịu trách nhiệm hoàn toàn về sản phẩm — sẵn sàng trả lời &quot;nếu hệ thống hỏng thì sao&quot;, &quot;ai chịu khi lộ dữ liệu&quot;, &quot;vì sao chọn thiết kế này&quot;.", border: "var(--iris)", borderW: "1px", bg: "var(--iris-tint)", badgeBg: "var(--iris)", nameColor: "var(--fg-1)" },
  { n: "4", name: "Tính toàn vẹn ở quy mô lớn (Integrity at scale) — ĐIỀU KIỆN CỨNG", text: "tiêu chí phủ quyết mọi yếu tố khác: một giải pháp dù thông minh, đẹp đến đâu nhưng để lộ PII không kiểm soát thì vẫn KHÔNG ĐẠT — bất kể phần khác tốt tới đâu.", border: "var(--rose-deep)", borderW: "2px", bg: "var(--rose-tint)", badgeBg: "var(--rose-deep)", nameColor: "var(--rose-deep)" },
];
const DOC_PARTS = [
  { n: "1", name: "Kiến trúc", text: "sơ đồ 6 thành phần kèm chú thích (annotation) + mô hình thiết kế đã chọn (Prompt / RAG / Agent) cùng lý do lựa chọn (I5.1).", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", badgeBg: "var(--iris)" },
  { n: "2", name: "Đánh đổi (Trade-off)", text: "bảng phân tích &quot;ai trả giá&quot; trên latency / cost / accuracy cho các quyết định kiến trúc chính (I5.1).", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badgeBg: "var(--gold-deep)" },
  { n: "3", name: "An toàn & vận hành", text: "guardrail spec + PII redaction tự động tại 3 vị trí + kết quả eval suite + risk register có người chịu trách nhiệm rõ ràng (I5.2).", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badgeBg: "var(--rose-deep)" },
  { n: "4", name: "Kết quả (Outcome)", text: "chỉ số đo lường (metric value) + mức độ thay đổi (delta) trước / sau khi triển khai (I1.2 / I4.3).", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", badgeBg: "var(--mint)" },
];

// Part 2 — Defense
const DEFENSE_STRUCTURE = [
  { n: "1", name: "Demo sản phẩm thật", time: "5–7′", text: "cho Hội đồng thấy sản phẩm đã ship chạy trên môi trường thực tế + bằng chứng về người dùng thật." },
  { n: "2", name: "Bảo vệ kiến trúc & rủi ro", time: "~5′", text: "trình bày kiến trúc giải pháp, kết quả thực tế vs giả thuyết ban đầu (outcome vs hypothesis), các đánh đổi (trade-off), rủi ro & cách kiểm soát." },
  { n: "3", name: "Phản biện từ Hội đồng", time: "~5′", text: "trả lời câu hỏi phản biện từ Hội đồng (6 câu hỏi thường gặp ở mục 3)." },
];
const DEFENSE_PRINCIPLES = [
  { name: "Đưa bằng chứng thay vì kể lể công sức (I3.3)", text: "minh chứng rõ ràng về người dùng thật và kết quả đo lường được (outcome), thay vì nói &quot;em đã làm rất nhiều&quot;.", color: "var(--iris-deep)", bg: "var(--iris-tint)" },
  { name: "Trung thực về các giới hạn", text: "nói thẳng những điều chưa làm được, rủi ro còn tồn tại và kế hoạch xử lý tiếp theo — sự trung thực mang lại độ tin cậy cao hơn giả vờ hoàn hảo.", color: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { name: "Gắn mọi câu trả lời với &quot;ai trả giá / ai chịu trách nhiệm&quot;", text: "đây là dấu hiệu thể hiện tư duy làm chủ của một builder trưởng thành.", color: "var(--mint-deep)", bg: "var(--mint-tint)" },
];
const QA_ROWS = [
  { n: "1", q: "&quot;Người dùng thật&quot; của bạn là ai?", a: "Nêu nhóm cụ thể + bằng chứng họ đã dùng (đã ẩn PII), không nói chung chung kiểu &quot;mọi khách hàng&quot;.", rowBg: "#fff" },
  { n: "2", q: "Nếu sản phẩm hỏng thì sao?", a: "Trình bày phương án dự phòng fallback (I4.2): khi kết quả AI sai / rỗng / timeout thì giao diện hiển thị gì; đảm bảo không lỗi ngầm (vỡ âm thầm).", rowBg: "var(--iris-tint)" },
  { n: "3", q: "Lộ PII thì ai chịu?", a: "Đã dựng PII redaction tại 3 vị trí (I5.2) + ghi rõ người chịu trách nhiệm trong risk register; tuân thủ Luật số 91/2025/QH15.", rowBg: "#fff" },
  { n: "4", q: "Vì sao chọn thiết kế này?", a: "Nêu rõ trade-off: mô hình thiết kế đã chọn (Prompt / RAG / Agent) + ai trả giá trên latency / cost / accuracy (I5.1).", rowBg: "var(--iris-tint)" },
  { n: "5", q: "Scale lên 10 lần thì sao?", a: "Trình bày tối ưu token cost, cơ chế cache / trim / routing (I5.1), cùng hệ thống monitoring & các ngưỡng cảnh báo.", rowBg: "#fff" },
  { n: "6", q: "Làm sao biết bản này không tệ hơn tuần trước?", a: "Chạy eval suite trước và sau khi cập nhật để phát hiện hồi quy (regression) (I5.1 / I5.2).", rowBg: "var(--iris-tint)" },
];

// Gate — graduation criteria
const MUST_PASS = [
  { n: "1", nl: "NL5 — Prompt & Tool Use", req: "≥ L2", trained: "I2.1 · I3.2 · I4.2", rowBg: "#fff" },
  { n: "2", nl: "NL1 — Outcome Thinking / Ownership", req: "≥ L2", trained: "I1.2 · I4.1 · I4.3", rowBg: "var(--iris-tint)" },
  { n: "3", nl: "NL3 — Design Thinking / Cộng tác", req: "≥ L2", trained: "I2.2 · I3.3", rowBg: "#fff" },
  { n: "4", nl: "NL7 — Quy tắc bảo vệ PII", req: "Đạt", trained: "I1.2 · I5.2", rowBg: "var(--rose-tint)" },
];
const EXIT_CRITERIA = [
  "Sản phẩm AI cuối khóa đã triển khai thực tế (SHIP) cho người dùng thật — không phải chỉ chạy thử.",
  "Bằng chứng người dùng đã sử dụng (đã ẩn PII) — ai dùng, dùng như thế nào.",
  "Kết quả thực tế đo lường được (Outcome): metric value + delta trước / sau khi triển khai.",
  "Bộ kiểm thử vượt qua (eval suite PASS) trên phiên bản hiện tại (≥10 ca, 3 loại khác nhau — I5.2).",
  "Rào chắn bảo vệ (guardrail cho cả input và output) thực sự chạy trên môi trường thực tế (I5.2).",
  "Cơ chế tự động ẩn PII (PII redaction) hoạt động thực tế, kiểm soát được cả log (I5.2).",
  "Tài liệu kiến trúc & rủi ro đầy đủ (sơ đồ kiến trúc + trade-off + risk register — I5.1 / I5.2).",
  "Demo dự phòng (bản ghi) đã chuẩn bị.",
  "Slide / bằng chứng đã rà PII (không lộ dữ liệu khi trình bày).",
];
const RUBRIC = [
  { n: "1", name: "Bằng chứng người dùng thật", text: "Có người thật đã dùng + outcome đo được (không phải demo).", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", badgeBg: "var(--iris)" },
  { n: "2", name: "Độ đầy đủ của tài liệu", text: "Kiến trúc, trade-off, rủi ro, outcome — người khác hiểu & bàn giao được.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badgeBg: "var(--gold-deep)" },
  { n: "3", name: "Cơ chế kiểm soát chạy thật", text: "Guardrail + PII redaction + eval thực sự chạy, không chỉ nói.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badgeBg: "var(--rose-deep)" },
  { n: "4", name: "Chất lượng bảo vệ", text: "Trả lời phản biện: chịu trách nhiệm, neo &quot;ai trả giá / ai chịu&quot;, trung thực về giới hạn.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", badgeBg: "var(--mint)" },
];
const SAMPLE_PROFILE = [
  { k: "Sản phẩm", v: "Trợ lý gợi ý kích cỡ (size) trên trang sản phẩm YODY — RAG bảng kích cỡ + gợi ý theo số đo cơ thể." },
  { k: "Ship", v: "Triển khai thực tế cho khách hàng trong 2 tuần + 3 nhân viên CSKH sử dụng để hỗ trợ tư vấn." },
  { k: "Kết quả (Outcome)", v: "Tỉ lệ đổi trả do sai kích cỡ giảm từ 12% xuống 9%." },
  { k: "Kiểm soát chạy thật", v: "Guardrail input/output; PII redaction tại 3 nơi (input + log + nguồn RAG); eval 12 ca PASS 11/12, ca lỗi đã khắc phục." },
  { k: "Tài liệu", v: "Sơ đồ 6 thành phần + bảng trade-off (ai trả giá) + risk register 4 rủi ro, mỗi rủi ro có người chịu trách nhiệm rõ ràng." },
  { k: "Bảo vệ", v: "Trả lời tốt phản biện: &quot;nếu hỏng → fallback cần người hỗ trợ&quot;, &quot;lộ PII → redaction 3 nơi + owner&quot;, &quot;scale 10x → cache + routing&quot;, &quot;chống hồi quy → eval&quot;." },
];

// Exam
interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Ship/Demo & Nguyên tắc", B = "Phần B · Bảo vệ & Phản biện", C = "Phần C · Chuẩn tốt nghiệp";
const EXAM: ExamQ[] = [
  { part: A, q: "&quot;Ship&quot; khác &quot;demo&quot; ở chỗ nào?", opts: ["Ship = có người dùng thật sử dụng thực tế để làm việc và đo lường được hiệu quả (impact); demo = phiên bản chạy thử trên môi trường giả lập để hội đồng đánh giá", "Ship đẹp hơn demo", "Ship dùng dữ liệu giả, demo dùng dữ liệu thật", "Chúng giống hệt nhau"], correct: 0, why: "Ship (triển khai thực tế) = người dùng thật sử dụng + hiệu quả đo lường được (impact); demo = bản chạy thử trên môi trường giả lập. (Phần 1)" },
  { part: A, q: "Hội đồng tốt nghiệp chấm chủ yếu dựa trên?", opts: ["Bản demo đẹp", "Một thứ đã ship: có người dùng thật + số đo", "Số giờ đã làm", "Số lượng tính năng"], correct: 1, why: "Hội đồng chấm sản phẩm đã triển khai (ship), có người dùng thật và số liệu đo lường, không chấm demo đẹp. (Phần 1)" },
  { part: A, q: "&quot;Tài liệu kiến trúc là một phần của sản phẩm&quot; nghĩa là gì?", opts: ["Tài liệu chỉ để cho đẹp", "Chỉ cần khi mentor hỏi", "Người khác đọc tài liệu phải hiểu được: hệ thống làm gì, rủi ro ở đâu, cách kiểm soát và phương án mở rộng (scale) thế nào", "Không cần tài liệu nếu sản phẩm chạy được"], correct: 2, why: "Người khác đọc tài liệu phải hiểu hệ thống làm gì · rủi ro ở đâu · cách kiểm soát · phương án scale. (Phần 1)" },
  { part: A, q: "&quot;Bảo vệ là chịu trách nhiệm, không phải trình diễn&quot; nghĩa là gì?", opts: ["Nói càng hay càng tốt", "Khoe càng nhiều tính năng càng tốt", "Trình bày thật dài", "Đứng sau sản phẩm: trả lời được &quot;nếu hỏng thì sao&quot;, &quot;lộ dữ liệu ai chịu&quot;, &quot;vì sao thiết kế này&quot;"], correct: 3, why: "Bảo vệ = chịu trách nhiệm: trả lời được &quot;nếu hỏng&quot;, &quot;lộ dữ liệu ai chịu&quot;, &quot;vì sao thiết kế này&quot;. (Phần 1)" },
  { part: A, q: "Một giải pháp thông minh nhưng để lộ / không kiểm soát PII thì kết quả tốt nghiệp là gì?", opts: ["KHÔNG ĐẠT — Tính toàn vẹn ở quy mô lớn (integrity at scale) là điều kiện bắt buộc, phủ quyết mọi yếu tố khác", "Vẫn đạt nếu các phần khác tốt", "Đạt nếu trình bày hay", "Tùy cảm tính hội đồng"], correct: 0, why: "Không kiểm soát PII = KHÔNG ĐẠT (integrity at scale là điều kiện bắt buộc, phủ quyết mọi thứ). (Phần 1)" },
  { part: A, q: "Tài liệu kiến trúc & rủi ro nên gồm gì?", opts: ["Chỉ một sơ đồ đẹp", "Sơ đồ kiến trúc + bảng đánh đổi (trade-off) + kế hoạch an toàn/vận hành (guardrail, PII redaction, eval, risk register) + kết quả thực tế (outcome)", "Toàn bộ mã nguồn", "Chỉ danh sách tính năng"], correct: 1, why: "Gồm sơ đồ kiến trúc + trade-off + an toàn/vận hành (guardrail, redaction, eval, risk register) + outcome. (Phần 1)" },
  { part: A, q: "Đâu là bằng chứng &quot;đã ship&quot; (không phải demo)?", opts: ["&quot;Chạy mượt khi em bấm thử&quot;", "&quot;Em thử 30 lần đều ổn&quot;", "&quot;Bật cho khách 2 tuần, 3 CSKH dùng, đổi trả do sai size giảm 12%→9%&quot;", "&quot;Giao diện rất đẹp&quot;"], correct: 2, why: "Bằng chứng ship: có người dùng thật sử dụng thực tế + có thay đổi chỉ số (delta) đo lường được. (Phần 1)" },
  { part: A, q: "Nguyên tắc nào là &quot;điều kiện cứng phủ quyết mọi thứ&quot;?", opts: ["Ship khác demo", "Tài liệu là một phần sản phẩm", "Bảo vệ là chịu trách nhiệm", "Tính toàn vẹn ở quy mô lớn / Integrity at scale (không kiểm soát được PII = KHÔNG ĐẠT)"], correct: 3, why: "Integrity at scale (bảo vệ PII) là điều kiện cứng phủ quyết mọi thứ. (Phần 1)" },
  { part: B, q: "Buổi bảo vệ (~15′) gồm ba phần nào?", opts: ["Demo sản phẩm thật · Bảo vệ kiến trúc & rủi ro · Phản biện hội đồng", "Mở đầu · Thân bài · Kết luận", "Prompt · RAG · Agent", "Input · AI · Output"], correct: 0, why: "Cấu trúc Demo Day 3 phần: demo sản phẩm thật · bảo vệ kiến trúc & rủi ro · phản biện Hội đồng. (Phần 2)" },
  { part: B, q: "Vì sao cần chuẩn bị &quot;demo dự phòng (bản ghi)&quot;?", opts: ["Để tiết kiệm thời gian", "Phòng trường hợp chạy thử trực tiếp (live demo) bị lỗi mạng hoặc dịch vụ thì vẫn có tư duy dự phòng (fallback) để bảo vệ sản phẩm", "Để trình bày dài hơn", "Vì hội đồng yêu cầu quay phim"], correct: 1, why: "Demo dự phòng = fallback phòng khi live demo gặp lỗi mạng/dịch vụ, vẫn có tư liệu bảo vệ. (Phần 2)" },
  { part: B, q: "Nguyên tắc đúng khi bảo vệ trước hội đồng là gì?", opts: ["Giả vờ sản phẩm hoàn hảo, giấu giới hạn", "Kể càng nhiều công sức càng tốt", "Trình bày bằng chứng thực tế, trung thực về giới hạn, và gắn trách nhiệm với quyết định đánh đổi (&quot;ai trả giá / ai chịu trách nhiệm&quot;)", "Tránh nói về rủi ro"], correct: 2, why: "Kể bằng chứng thực tế, trung thực về giới hạn, neo về trách nhiệm (&quot;ai trả giá/ai chịu&quot;). (Phần 2)" },
  { part: B, q: "Hội đồng hỏi &quot;Nếu sản phẩm hỏng thì sao?&quot; — nên trả lời dựa trên?", opts: ["&quot;Sản phẩm em không bao giờ hỏng&quot;", "Đổ lỗi cho AI", "Xin thêm thời gian", "Trình bày phương án dự phòng (fallback): khi AI trả về kết quả sai, rỗng hoặc quá thời gian (timeout) thì người dùng thấy gì, đảm bảo không lỗi ngầm (vỡ âm thầm)"], correct: 3, why: "&quot;Nếu hỏng&quot; → trình bày fallback: khi AI sai/rỗng/timeout thì người dùng thấy gì để không lỗi ngầm. (Phần 2)" },
  { part: B, q: "Câu &quot;Lộ PII thì ai chịu?&quot; nên trả lời thế nào?", opts: ["Nêu rõ cơ chế tự động ẩn thông tin cá nhân (PII redaction) tại 3 nơi + người chịu trách nhiệm trong danh mục rủi ro (risk register) + tuân thủ Luật số 91/2025", "&quot;Tại AI, không phải em&quot;", "&quot;Chắc không lộ đâu&quot;", "&quot;Em chưa nghĩ tới&quot;"], correct: 0, why: "PII redaction tại 3 nơi + người chịu trách nhiệm trong risk register + tuân thủ Luật 91/2025. (Phần 2)" },
  { part: B, q: "Với câu phản biện bạn CHƯA xử lý được, cách tốt nhất là gì?", opts: ["Chống chế cho qua", "Nói thẳng &quot;đây là giới hạn hiện tại, em sẽ xử lý bằng X&quot; — thể hiện biết mình thiếu gì", "Im lặng", "Đổi sang chủ đề khác"], correct: 1, why: "Nói thẳng giới hạn hiện tại + kế hoạch cải tiến, không chống chế. (Phần 2)" },
  { part: C, q: "Bốn tiêu chí bắt buộc (must-pass) để tốt nghiệp là gì?", opts: ["NL4 · NL5 · NL6 · NL7", "Tất cả 7 năng lực ở L3", "Năng lực 5 (NL5 - Prompt & Tool) · Năng lực 1 (NL1 - Ownership) · Năng lực 3 (NL3 - Cộng tác) · Năng lực 7 (NL7 - Bảo vệ PII)", "Chỉ cần NL5"], correct: 2, why: "4 must-pass: NL5 · NL1 · NL3 · NL7 (PII). (Trang Gate tốt nghiệp)" },
  { part: C, q: "Ngoài 4 must-pass, điều kiện điểm tổng để tốt nghiệp là gì?", opts: ["Đạt L3 cả 7 năng lực", "Chỉ cần đạt 4 must-pass", "Đạt L5 Architect", "Đạt tối thiểu L2 ở cả 7/7 năng lực"], correct: 3, why: "Điểm tổng: đạt tối thiểu L2 ở cả 7/7 năng lực. (Trang Gate tốt nghiệp)" },
  { part: C, q: "Mục đầu tiên trong checklist bằng chứng tốt nghiệp là gì?", opts: ["Sản phẩm AI cuối khóa đã SHIP cho người dùng thật (không phải chỉ demo)", "Slide thật đẹp", "Có thật nhiều tính năng", "Code thật dài"], correct: 0, why: "Checklist đầu tiên: sản phẩm đã SHIP cho người dùng thật. (Trang Gate tốt nghiệp)" },
  { part: C, q: "Rubric hội đồng gồm 4 trục nào?", opts: ["Token · Cost · Latency · Accuracy", "Bằng chứng người dùng thật · Độ đầy đủ tài liệu · Cơ chế kiểm soát chạy thật · Chất lượng bảo vệ", "Problem · User · Metric · Risk", "Git · Test · Deploy · Log"], correct: 1, why: "Rubric 4 trục: bằng chứng người dùng · độ đầy đủ tài liệu · cơ chế kiểm soát chạy thật · chất lượng bảo vệ. (Trang Gate tốt nghiệp)" },
  { part: C, q: "&quot;Stretch&quot; (không bắt buộc) khi tốt nghiệp là gì?", opts: ["Đạt L2 cả 7 năng lực", "Ship được sản phẩm", "Đạt L3 ở 1–2 năng lực thế mạnh → cân nhắc thăng tiến sớm (Product Engineer)", "Làm nhiều tính năng nhất lớp"], correct: 2, why: "Stretch: đạt L3 ở 1–2 năng lực thế mạnh → cơ sở thăng tiến sớm (Product Engineer). (Trang Gate tốt nghiệp)" },
  { part: C, q: "Sau khi tốt nghiệp Product Builder (L2), chặng tiếp theo trên career ladder là gì?", opts: ["Nghỉ chương trình", "Quay lại L1", "Principal / Staff", "Product Engineer (L3) — làm chủ toàn trình (end-to-end) một tính năng với sự tự chủ hoàn toàn"], correct: 3, why: "Chặng tiếp theo: Product Engineer (L3) — làm chủ end-to-end, tự chủ hoàn toàn. (Trang Gate tốt nghiệp)" },
];

// Icons
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

export function LessonI53() {
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

  const navCourseActive = state.page === "overview" || state.page === "read";

  return (
    <div data-surface="portal" style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)" }}>
      {/* SUB-HEADER (lesson-scoped nav) */}
      <header style={{ display: "flex", alignItems: "center", gap: "22px", padding: "13px 44px", borderBottom: "1px solid var(--fg-1)", position: "sticky", top: 0, background: "rgba(251,250,246,.92)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 30 }}>
        <span style={{ font: "800 17px/1 var(--font-impact)", color: "var(--iris)" }}>
          Buổi <span style={{ color: "var(--fg-1)", fontWeight: 700, fontSize: "15px" }}>I5.3</span>
        </span>
        <nav style={{ display: "flex", gap: "22px", font: "500 14px/1 var(--font-body)" }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); go("overview"); }}
            style={{ textDecoration: "none", color: navCourseActive ? "var(--fg-1)" : "var(--fg-2)", fontWeight: navCourseActive ? 600 : 500 }}
          >
            Buổi I5.3
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); go("gate"); }}
            style={{ textDecoration: "none", color: state.page === "gate" ? "var(--fg-1)" : "var(--fg-2)", fontWeight: state.page === "gate" ? 600 : 500 }}
          >
            Gate tốt nghiệp
          </a>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); go("exam"); }}
            style={{ textDecoration: "none", color: state.page === "exam" ? "var(--fg-1)" : "var(--fg-2)", fontWeight: state.page === "exam" ? 600 : 500 }}
          >
            Final Exam
          </a>
        </nav>
        <div style={{ flex: 1 }} />
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); go("read", 0); }}
          className="cta cta-primary"
          style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none" }}
        >
          Bắt đầu học
        </a>
      </header>

      {state.page === "overview" && <OverviewScreen go={go} />}
      {state.page === "read" && <ReadScreen state={state} go={go} />}
      {state.page === "gate" && <GateScreen go={go} />}
      {state.page === "exam" && (
        <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />
      )}

      <footer style={{ padding: "40px 44px", textAlign: "center", borderTop: "1px solid var(--fg-1)", font: "13px/1.6 var(--font-body)", color: "var(--fg-3)", background: "var(--bg-warm)" }}>
        © 2026 YODY · Tài liệu đào tạo nội bộ · Intern Product Builder — buổi tốt nghiệp · mọi bằng chứng phải đã rà PII; không hardcode secret.
      </footer>
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I5.3">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 4 · Tuần 12–14 · Capstone</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I5.3 · Ship &amp; Bảo vệ Capstone</span>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I5.3 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>🎓 Gate tốt nghiệp</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>Tổng hợp NL1–NL7</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Ship &amp; Bảo vệ <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Capstone</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Buổi <b style={{ color: "var(--fg-1)" }}>cuối cùng</b> của chương trình — bảo vệ tốt nghiệp trước <b style={{ color: "var(--fg-1)" }}>Hội đồng Product Builder</b>. Bạn <em style={{ fontStyle: "italic" }}>triển khai thực tế (ship)</em> sản phẩm AI cuối khóa cho người dùng thật, rồi <em style={{ fontStyle: "italic" }}>bảo vệ</em> kiến trúc, kết quả thực tế (outcome) và rủi ro. Hội đồng không chấm một bản <em style={{ fontStyle: "italic" }}>chạy thử (demo)</em> đẹp — họ chấm thứ đã <b style={{ color: "var(--fg-1)" }}>ship</b>, có người dùng thật và số liệu đo được.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>90</b> phút live · demo day</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~30</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Gate tốt nghiệp + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Đây là nơi mọi thứ hội tụ: kỹ thuật prompt, tư duy thiết kế &amp; phản biện, quy trình/RAG, QC/bàn giao, tinh thần làm chủ, kỹ năng lập trình, tích hợp/đo kết quả, kiến trúc, an toàn/vận hành. Bạn chứng minh mình là một <b style={{ color: "var(--fg-1)" }}>Product Builder (L2)</b>: không chỉ <em style={{ fontStyle: "italic" }}>làm được</em>, mà <b style={{ color: "var(--fg-1)" }}>triển khai thực tế (ship) an toàn, đo lường được, có tài liệu đầy đủ, và dám chịu trách nhiệm</b>.
            </p>
          </section>

          <section style={{ marginTop: "44px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 18px" }}>Mục tiêu — kết thúc buổi, bạn có thể…</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 36px" }}>
              {OBJECTIVES.map((o, i) => (
                <div key={i} style={{ display: "flex", gap: "13px", alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ color: "var(--mint)", flex: "none" }}>{checkSmIcon}</span>
                  <span style={{ font: "16px/1.55 var(--font-body)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: o }} />
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: "52px" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", marginBottom: "22px" }}>
              <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: 0 }}>Nội dung buổi học</h2>
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~30 phút</span>
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

          {/* Gate CTA — gold climax */}
          <section style={{ marginTop: "40px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--gold-deep)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff", fontSize: "24px" }}>🎓</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "7px" }}>Cổng cuối · tốt nghiệp Product Builder</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Gate tốt nghiệp — Product Builder (L2)</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Chuẩn tốt nghiệp gồm <b style={{ color: "var(--fg-1)" }}>4 tiêu chí bắt buộc (must-pass)</b> + đạt <b style={{ color: "var(--fg-1)" }}>L2 ở cả 7/7 năng lực</b>, checklist bằng chứng cần nộp, rubric 4 trục của Hội đồng và <b style={{ color: "var(--fg-1)" }}>điều kiện cứng PII (override)</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--gold-deep)", color: "var(--gold-deep)" }}>Xem chuẩn tốt nghiệp →</a>
            </div>
          </section>

          {/* Exam CTA */}
          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--iris-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Ôn trước buổi bảo vệ. Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> + bảo vệ Capstone đạt rubric → <b style={{ color: "var(--fg-1)" }}>🎓 Tốt nghiệp Product Builder</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Tốt nghiệp · phải biết</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
              {MUST_KNOW.map((t, i) => (
                <span key={i} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Nối toàn khóa · ôn lại</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {NICE_KNOW.map((t, i) => (
                <span key={i} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Buổi <b>cuối cùng</b> của <b>Giai đoạn 4 (Capstone)</b> và của cả chương trình. Đây là <b>cổng gate tốt nghiệp</b> — bộ bằng chứng bạn tích lũy từ I5.1 &amp; I5.2 (kiến trúc · guardrail · eval · risk register · Docker) cùng sản phẩm đã ship là minh chứng bảo vệ trước Hội đồng.</p>
          </section>
        </main>

        <aside style={{ position: "sticky", top: "96px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ border: "1px solid var(--fg-1)", borderRadius: "12px", background: "#fff", overflow: "hidden" }}>
            <div style={{ height: "7px", background: "var(--gold-deep)" }} />
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I5.2 (Bảo mật, Eval &amp; Vận hành)</b> → buổi <b style={{ color: "var(--fg-1)" }}>I5.3 (Ship &amp; Bảo vệ Capstone)</b> → <b style={{ color: "var(--fg-1)" }}>🎓 Kết thúc chương trình — tốt nghiệp Product Builder (L2)</b>.</p>
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
    { title: "Ship vs Demo & Tài liệu", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "Bảo vệ & Phản biện", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Gate tốt nghiệp →", kicker: "HOÀN THÀNH", color: "var(--gold-deep)", open: () => go("gate") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.3
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
            <span style={{ color: "var(--gold-deep)", flex: "none", display: "flex", fontSize: "16px" }}>🎓</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Gate tốt nghiệp · chuẩn ĐẠT</span>
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I5.3</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>R</span>anh giới cuối cùng của chương trình: <b>Demo</b> chỉ chứng minh sản phẩm <em style={{ fontStyle: "italic" }}>có thể chạy</em>; <b>Ship (triển khai thực tế)</b> là sản phẩm được người dùng thật dùng hằng ngày, trên dữ liệu thật, và <b>đo lường được hiệu quả (impact)</b>. Đây mới là bằng chứng tốt nghiệp.
      </p>

      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Quy tắc vàng của buổi</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Hội đồng <b>không chấm một bản chạy thử (demo) đẹp</b> — họ đánh giá sản phẩm thực tế đã triển khai (ship), có người dùng thật và có số liệu đo lường rõ ràng.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Ship ≠ Demo</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {SHIP_VS_DEMO.map((g, i) => (
            <div key={i} style={{ border: `1px solid ${g.border}`, borderRadius: "12px", background: g.bg, padding: "18px 20px" }}>
              <div style={{ font: "700 15px/1.2 var(--font-brand)", color: g.color, marginBottom: "10px" }}>{g.name}</div>
              <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>{g.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Hội đồng chấm thứ đã SHIP, không phải demo đẹp.</figcaption>
      </figure>

      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--gold-deep)" }}>Ví dụ YODY · giả lập:</b> &quot;Chatbot gợi ý kích cỡ chạy trơn tru khi chạy thử&quot; = <b>demo</b>. &quot;Tính năng đã bật cho khách 2 tuần, 3 CSKH dùng tư vấn trực tiếp, tỉ lệ đổi trả do sai cỡ giảm từ <b>12% xuống 9%</b>&quot; = <b>ship</b>, có bằng chứng thực tế.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Bốn nguyên tắc tốt nghiệp</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {GRAD_PRINCIPLES.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `${l.borderW} solid ${l.border}`, borderRadius: "12px", background: l.bg, padding: "15px 18px" }}>
              <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "8px", background: l.badgeBg, color: "#fff", font: "700 15px/30px var(--font-numeric)", textAlign: "center" }}>{l.n}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 15px/1.3 var(--font-brand)", color: l.nameColor, marginBottom: "4px" }}>{l.name}</div>
                <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)" }} dangerouslySetInnerHTML={{ __html: l.text }} />
              </div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Bốn nguyên tắc; nguyên tắc 4 phủ quyết mọi thứ.</figcaption>
      </figure>

      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>🔒 Điều kiện cứng (override):</b> một giải pháp dù thông minh, đẹp mắt đến đâu, nhưng để xảy ra <b>rủi ro lộ thông tin cá nhân (PII) không kiểm soát</b> thì vẫn <b>KHÔNG ĐẠT</b> — bất kể các phần khác tốt tới đâu. Tuân thủ Luật số 91/2025/QH15 là ranh giới không thể thương lượng.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Tài liệu kiến trúc &amp; rủi ro — gồm gì</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Gói lại từ I5.1 và I5.2, tài liệu bàn giao gồm bốn phần — minh chứng bạn <b>thiết kế hệ thống có chủ đích</b> và <b>kiểm soát được rủi ro</b>, không chỉ &quot;ghép các mảnh cho chạy&quot;:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DOC_PARTS.map((d, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${d.border}`, borderRadius: "12px", background: d.bg, padding: "15px 18px" }}>
              <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "8px", background: d.badgeBg, color: "#fff", font: "700 13px/30px var(--font-numeric)", textAlign: "center" }}>{d.n}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 15px/1.3 var(--font-brand)", color: d.color, marginBottom: "4px" }}>{d.name}</div>
                <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)" }} dangerouslySetInnerHTML={{ __html: d.text }} />
              </div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Tài liệu kiến trúc &amp; rủi ro là một phần của sản phẩm.</figcaption>
      </figure>

      <TldrDark items={[
        "<b>Ship ≠ Demo</b>: để tốt nghiệp cần <b>người dùng thật + kết quả đo lường được (impact)</b>, không phải một bản chạy thử đẹp mắt.",
        "<b>Bốn nguyên tắc tốt nghiệp</b>: ship ≠ demo · tài liệu kiến trúc là một phần sản phẩm · bảo vệ = chịu trách nhiệm · <b>integrity ở quy mô lớn là điều kiện bắt buộc</b> (lộ PII không kiểm soát = KHÔNG ĐẠT).",
        "<b>Tài liệu kiến trúc &amp; rủi ro</b> (sơ đồ kiến trúc + phân tích trade-off + kế hoạch an toàn/vận hành + kết quả thực tế) là phần bắt buộc khi bàn giao.",
      ]} />

      <SelfCheck items={[
        "Phân biệt ship và demo cho sản phẩm Capstone của bạn — bằng chứng &quot;ship&quot; gồm gì?",
        "Vì sao &quot;tài liệu kiến trúc là một phần của sản phẩm&quot;? Người đọc cần hiểu được điều gì qua nó?",
        "Một giải pháp rất thông minh nhưng để lộ PII — vì sao vẫn KHÔNG ĐẠT?",
        "Liệt kê các phần của tài liệu kiến trúc &amp; rủi ro cần nộp.",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>H</span>ội đồng không tìm người &quot;nói hay&quot; — họ tìm người <b>đứng sau sản phẩm của mình và dám nhận trách nhiệm</b>. Buổi bảo vệ (~15 phút) có ba phần rõ ràng; tập duyệt trước để không cháy giờ.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Cấu trúc buổi bảo vệ (Demo Day)</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {DEFENSE_STRUCTURE.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "15px 18px" }}>
              <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "8px", background: "var(--iris)", color: "#fff", font: "700 15px/30px var(--font-numeric)", textAlign: "center" }}>{s.n}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>{s.name}</span>
                  <span style={{ font: "600 12px/1 var(--font-mono)", color: "var(--iris-deep)", whiteSpace: "nowrap" }}>{s.time}</span>
                </div>
                <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Cấu trúc buổi bảo vệ tốt nghiệp ~15 phút.</figcaption>
      </figure>

      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--mint-tint)", borderLeft: "3px solid var(--mint-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--mint-deep)" }}>Demo dự phòng (bắt buộc):</b> chuẩn bị sẵn <b>video quay màn hình</b> sản phẩm đang chạy thực tế. Nếu live demo gặp lỗi mạng/dịch vụ, bạn vẫn có tư liệu để bảo vệ — chính là áp dụng tư duy dự phòng (fallback) từ I4.2 vào thực tế.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Nguyên tắc khi bảo vệ: chịu trách nhiệm, không trình diễn</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
          {DEFENSE_PRINCIPLES.map((p, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${p.color}`, background: p.bg, borderRadius: "0 10px 10px 0", padding: "14px 18px" }}>
              <div style={{ font: "700 15px/1.3 var(--font-brand)", color: p.color, marginBottom: "4px" }}>{p.name}</div>
              <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: p.text }} />
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Neo mọi câu trả lời về &quot;ai trả giá / ai chịu trách nhiệm&quot;.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Sáu câu hỏi phản biện thường gặp</h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1.4fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>#</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Câu hỏi</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Cách trả lời đúng hướng</div>
          {QA_ROWS.map((r, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", background: r.rowBg, font: "italic 800 20px/1 var(--font-serif)", color: "var(--gold-deep)" }}>{r.n}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "700 13px/1.5 var(--font-brand)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: r.q }} />
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.55 var(--font-body)", color: "var(--fg-2)" }} dangerouslySetInnerHTML={{ __html: r.a }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--gold-deep)" }}>Mẹo:</b> với câu hỏi về vấn đề bạn <em style={{ fontStyle: "italic" }}>chưa</em> kịp xử lý, đừng bao biện. Hãy nói thẳng <em style={{ fontStyle: "italic" }}>&quot;đây là giới hạn hiện tại của sản phẩm, em dự kiến xử lý bằng phương án X&quot;</em> — thể hiện bạn nhìn rõ thiếu sót và có kế hoạch cải tiến.
      </div>

      <TldrDark items={[
        "<b>Buổi bảo vệ ~15′</b> gồm demo sản phẩm thật · bảo vệ kiến trúc &amp; rủi ro · phản biện; luôn có <b>demo dự phòng (bản ghi)</b> làm fallback.",
        "<b>Bảo vệ = chịu trách nhiệm, không trình diễn</b>: kể bằng chứng, trung thực về giới hạn, neo về &quot;ai trả giá / ai chịu trách nhiệm&quot;.",
        "Chuẩn bị <b>6 câu hỏi phản biện</b> (người dùng thật · nếu hỏng · lộ PII · vì sao thiết kế · scale 10x · chống hồi quy); câu chưa xử lý được thì nói thẳng giới hạn + kế hoạch.",
      ]} />

      <SelfCheck items={[
        "Phân bổ thời gian 15 phút bảo vệ của bạn cho 3 phần thế nào?",
        "Vì sao cần chuẩn bị demo dự phòng (bản ghi)? Nó là biểu hiện của tư duy gì?",
        "Trả lời thử câu &quot;Nếu sản phẩm hỏng thì sao?&quot; cho Capstone của bạn.",
        "Trả lời thử câu &quot;Lộ PII thì ai chịu?&quot; — nối cơ chế nào bạn đã dựng?",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--gold-deep)", marginBottom: "4px" }}>Hoàn thành phần đọc I5.3 ✓</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Xem <b style={{ color: "var(--fg-1)" }}>Gate tốt nghiệp</b> để chốt checklist bằng chứng &amp; chuẩn ĐẠT, rồi làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu).</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Xem Gate tốt nghiệp →</a>
      </div>
    </div>
  );
}

function GateScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Gate tốt nghiệp" style={{ maxWidth: "900px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Cổng cuối · tốt nghiệp Product Builder (L2)</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>
        Gate <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>tốt nghiệp</span>
      </h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 32px", maxWidth: "660px" }}>Đây là <b style={{ color: "var(--fg-1)" }}>cổng đánh giá cuối cùng</b>. Vượt qua = <b style={{ color: "var(--fg-1)" }}>tốt nghiệp Thực tập sinh Product Builder</b>. Nộp hồ sơ bằng chứng + bảo vệ trước Hội đồng Product Builder.</p>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>1 · Chuẩn tốt nghiệp</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Tốt nghiệp cần đồng thời <b style={{ color: "var(--fg-1)" }}>cả hai</b> điều kiện (a) và (b).</p>
      <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", margin: "0 0 10px" }}>(a) Bốn tiêu chí bắt buộc (must-pass) — thiếu bất kỳ tiêu chí nào → không thể tốt nghiệp</div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 18px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1.6fr auto 1fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>#</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Năng lực</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Yêu cầu</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Đã rèn ở</div>
          {MUST_PASS.map((r, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", background: r.rowBg, font: "italic 800 18px/1 var(--font-serif)", color: "var(--iris)" }}>{r.n}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "700 13px/1.45 var(--font-brand)", color: "var(--fg-1)" }}>{r.nl}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "600 13px/1.45 var(--font-body)", color: "var(--iris-deep)", whiteSpace: "nowrap" }}>{r.req}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.5 var(--font-mono)", color: "var(--fg-2)" }}>{r.trained}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>(b) Điểm tổng</div>
          <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Đạt tối thiểu <b>L2 ở cả 7/7 năng lực</b> (NL6 chỉ cần L2 tối thiểu).</div>
        </div>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--mint-deep)", marginBottom: "8px" }}>Stretch · không bắt buộc</div>
          <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Đạt <b>L3 ở 1–2 năng lực thế mạnh</b> → cơ sở cân nhắc thăng tiến sớm lên <b>Product Engineer</b>.</div>
        </div>
      </div>

      <div style={{ margin: "0 0 40px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>🔒 Điều kiện cứng phủ quyết mọi thứ (override):</b> để xảy ra <b>lộ hoặc không kiểm soát được PII</b> → <b>KHÔNG ĐẠT</b>, bất kể các phần khác tốt thế nào (Tính toàn vẹn ở quy mô lớn — I5.3 Phần 1).
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>2 · Checklist bằng chứng cần nộp (Exit Criteria)</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Rà đủ trước buổi bảo vệ.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 40px" }}>
        {EXIT_CRITERIA.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "14px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{q}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>3 · Rubric Hội đồng — 4 trục</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Bốn trục chấm; vi phạm PII phủ quyết tất cả.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", margin: "0 0 40px" }}>
        {RUBRIC.map((r, i) => (
          <div key={i} style={{ border: `1px solid ${r.border}`, borderRadius: "12px", background: r.bg, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "8px", background: r.badgeBg, color: "#fff", font: "700 14px/28px var(--font-numeric)", textAlign: "center" }}>{r.n}</span>
              <div style={{ font: "700 15px/1.2 var(--font-brand)", color: r.color }}>{r.name}</div>
            </div>
            <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: r.text }} />
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>4 · Bài mẫu tóm tắt hồ sơ ĐẠT (giả lập)</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Ví dụ giả lập một hồ sơ tốt nghiệp đạt chuẩn.</p>
      <div style={{ border: "1px solid var(--iris)", borderRadius: "16px", overflow: "hidden", background: "#fff", margin: "0 0 40px" }}>
        <div style={{ background: "var(--iris)", padding: "16px 22px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px" }}>🎓</span>
          <div style={{ font: "700 16px/1.3 var(--font-impact)", color: "#fff" }}>Trợ lý gợi ý kích cỡ (size) — trang sản phẩm YODY</div>
        </div>
        <div style={{ padding: "8px 22px 18px" }}>
          {SAMPLE_PROFILE.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "baseline", padding: "13px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ font: "700 12px/1.4 var(--font-mono)", letterSpacing: ".06em", textTransform: "uppercase", color: "var(--iris-deep)", width: "140px", flex: "none" }}>{s.k}</span>
              <span style={{ flex: 1, font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }} dangerouslySetInnerHTML={{ __html: s.v }} />
            </div>
          ))}
          <div style={{ marginTop: "16px", padding: "14px 18px", background: "var(--mint-tint)", borderRadius: "10px", font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>
            <b style={{ color: "var(--mint-deep)" }}>→ Kết luận:</b> Đủ 4 must-pass + L2 cả 7 năng lực + không vi phạm PII → <b style={{ color: "var(--mint-deep)" }}>ĐẠT (tốt nghiệp Product Builder)</b>.
          </div>
        </div>
      </div>

      <div style={{ padding: "24px 28px", border: "1px solid var(--gold-deep)", borderRadius: "16px", background: "var(--gold-tint)", margin: "0 0 34px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "10px" }}>🎓 Kết thúc chương trình</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Qua Gate này, bạn tốt nghiệp <b>Product Builder (L2)</b> — người <b>ship an toàn, đo được, có tài liệu, và dám chịu trách nhiệm</b>. Chặng tiếp theo trên career ladder là <b>Product Engineer (L3)</b>: làm chủ end-to-end một tính năng với tự chủ hoàn toàn.</p>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none" }}>Làm Final Exam →</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 1); }} className="cta" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)" }}>Đọc lại Phần 2 — Bảo vệ</a>
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
    ? { title: "Đạt ngưỡng Final Exam 🎓", msg: `Bạn đạt ${score}/20 → đủ điều kiện thi. Kết hợp bảo vệ Capstone đạt rubric + 4 must-pass + L2 cả 7 NL + không vi phạm PII → tốt nghiệp Product Builder.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–8 → đọc lại Phần 1 (Ship vs Demo & Tài liệu); 9–14 → Phần 2 (Bảo vệ & Phản biện); 15–20 → Gate tốt nghiệp. Lưu ý cứng: sai câu PII (5, 8, 13) là tín hiệu điều kiện override.`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test tốt nghiệp · 20 câu</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>
        Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I5.3</span>
      </h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "640px" }}>
        20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Ship/Demo &amp; Nguyên tắc (1–8) · Bảo vệ &amp; Phản biện (9–14) · Chuẩn tốt nghiệp (15–20). Đạt <b style={{ color: "var(--fg-1)" }}>+ bảo vệ Capstone đạt rubric</b> → tốt nghiệp.
      </p>

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
              <p style={{ font: "600 17px/1.5 var(--font-body)", color: "var(--fg-1)", margin: "0 0 16px" }} dangerouslySetInnerHTML={{ __html: Q.q }} />
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
                      <span style={{ flex: 1, font: "15px/1.5 var(--font-body)", color: fg }} dangerouslySetInnerHTML={{ __html: text }} />
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
