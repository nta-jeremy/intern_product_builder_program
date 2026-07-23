"use client";

import { useState } from "react";

type Page = "overview" | "read" | "product" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
}

const PASS_SCORE = 16;
const PASS_PCT = "80%";

const PART_META = [
  { n: "01", short: "Kiến trúc = trade-off & Pattern", title: "Kiến trúc là chuỗi quyết định đánh đổi (Trade-off) & Lựa chọn Pattern", time: "~16 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Latency · Cost · Accuracy", title: "Latency – Cost – Accuracy & Kỹ thuật tối ưu", time: "~16 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "03", short: "Monitoring · Eval · Harness", title: "Monitoring, Eval & Harness", time: "~14 phút", c: "var(--mint)", cDeep: "var(--mint-deep)", tint: "var(--mint-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Kiến trúc là chuỗi quyết định đánh đổi (trade-off), không phải sơ đồ đẹp; quy tắc vàng nêu rõ yếu tố phải đánh đổi; 6 thành phần của giải pháp production; chọn pattern Prompt / RAG / Agent theo bài toán; Single-agent vs Multi-agent.", tags: ["Trade-off", "6 thành phần", "Prompt / RAG / Agent", "Single vs Multi-agent"] },
  { ...PART_META[1], desc: "Ba trục đánh đổi Latency – Cost – Accuracy thường xuyên xung đột; chi phí token là ràng buộc thiết kế ngay từ đầu; sai lầm \"chạy ngon khi demo\" & cách tính tải thực; 3 kỹ thuật tối ưu: Cache, Trim và Routing.", tags: ["Latency–Cost–Accuracy", "Token cost", "Tính tải thực", "Cache · Trim · Routing"] },
  { ...PART_META[2], desc: "Hệ thống giám sát (monitoring) song hành cùng kiến trúc & trả lời 3 câu hỏi (đo gì, log gì không PII, cảnh báo khi nào); đánh giá (eval) chống hồi quy; khung kiểm thử (harness) chạy & chấm tự động; gói lại thành tài liệu kiến trúc Capstone.", tags: ["Monitoring · 3 câu hỏi", "Eval & hồi quy", "Harness", "Tài liệu kiến trúc"] },
];

const OBJECTIVES = [
  "Giải thích được khái niệm kiến trúc là chuỗi quyết định đánh đổi (trade-off); mô tả được 6 thành phần của một giải pháp AI production.",
  "Lựa chọn được mẫu kiến trúc phù hợp (Prompt đơn / RAG / Agent; Single-agent vs Multi-agent) dựa trên bài toán thực tế, không chạy theo xu hướng.",
  "Cân bằng được ba trục Latency – Cost – Accuracy; áp dụng được các kỹ thuật Cache, Context trimming và Model routing để tối ưu hóa.",
  "Thiết kế được hệ thống giám sát (monitoring) đi kèm kiến trúc: xác định đo lường chỉ số gì, ghi nhật ký (log) gì (không chứa PII) và cảnh báo khi nào.",
  "Giải thích được quy trình đánh giá (eval) và khung kiểm thử (harness) để kiểm tra xem các thay đổi có gây lỗi hồi quy (regression) hay không.",
];

const MUST_KNOW = ["Kiến trúc = trade-off", "6 thành phần", "Prompt / RAG / Agent", "Single vs Multi-agent", "Latency–Cost–Accuracy", "Token cost", "Cache · Trim · Routing", "Monitoring", "Eval", "Harness", "Tài liệu kiến trúc"];
const NICE_KNOW = ["5 lớp & trust layer (I4.2)", "RAG / agent / MCP (I3.1)", "Token & context (I1.1)", "Cây quyết định Prompt/RAG/FT (I1.1)", "Unit test (I4.2)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~46 phút" },
  { k: "Giai đoạn", v: "4 · Tuần 12–14" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL6 · NL7" },
  { k: "Gate", v: "Capstone · tích lũy" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — 6 thành phần + pattern cards
const SIX_COMPONENTS = [
  { n: "1", name: "Input", text: "nhận & xác thực đầu vào.", border: "var(--border)", bg: "#fff", badgeBg: "var(--bg-muted)", badgeFg: "var(--fg-2)" },
  { n: "2", name: "Tiền xử lý (Pre-processing)", text: "làm sạch, ẩn PII, chuẩn hoá (I4.2).", border: "var(--border)", bg: "#fff", badgeBg: "var(--bg-muted)", badgeFg: "var(--fg-2)" },
  { n: "3", name: "Xử lý cốt lõi (Core Processing)", text: "lõi: prompt / RAG / agent gọi mô hình.", border: "var(--border)", bg: "#fff", badgeBg: "var(--bg-muted)", badgeFg: "var(--fg-2)" },
  { n: "4", name: "Hậu xử lý (Post-processing)", text: "kiểm chứng đầu ra, định dạng, kiểm tra an toàn.", border: "var(--border)", bg: "#fff", badgeBg: "var(--bg-muted)", badgeFg: "var(--fg-2)" },
  { n: "5", name: "Output", text: "trả kết quả + fallback.", border: "var(--border)", bg: "#fff", badgeBg: "var(--bg-muted)", badgeFg: "var(--fg-2)" },
  { n: "6", name: "Giám sát (Monitoring)", text: "đo chất lượng, tỷ lệ lỗi, chi phí khi vận hành thật — quan trọng nhất nhưng dễ bị bỏ quên nhất.", border: "var(--iris)", bg: "var(--iris-tint)", badgeBg: "var(--iris)", badgeFg: "#fff" },
];
const PATTERN_CARDS = [
  { name: "Prompt đơn (Single Prompt)", badge: "RẺ · NHANH", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", when: "tác vụ rõ ràng, chỉ cần năng lực ngôn ngữ / lập luận (viết lách, phân loại, tóm tắt).", trade: "chi phí thấp, phản hồi nhanh; nhưng không có nguồn kiến thức bổ trợ bên ngoài." },
  { name: "RAG", badge: "CẦN VECTOR DB", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", when: "cần kiến thức bổ trợ bên ngoài hoặc thông tin nội bộ liên tục cập nhật (chính sách, kho sản phẩm).", trade: "tăng độ chính xác; yêu cầu vector DB và kiến trúc phức tạp hơn (I3.1)." },
  { name: "Agent", badge: "ĐẮT · KHÓ KIỂM", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", when: "cần xử lý nhiều bước phức tạp, tương tác nhiều công cụ, tự quyết định hành động tiếp theo.", trade: "năng lực mạnh nhất nhưng chi phí cao và khó kiểm soát — chỉ dùng khi thực sự cần thiết." },
];

// Phần 2 — trade axes + opt techniques
const TRADE_AXES = [
  { name: "Latency (độ trễ)", text: "người dùng chờ bao lâu? Mô hình lớn, nhiều bước, CoT → chậm hơn.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { name: "Cost (chi phí)", text: "tốn bao nhiêu ngân sách? Tính trên token; gọi nhiều lần / context lớn → đắt hơn.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { name: "Accuracy (độ chính xác)", text: "chính xác & đáng tin đến mức nào? Mô hình mạnh + RAG + validation → chính xác hơn nhưng đắt & chậm.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];
const OPT_TECHNIQUES = [
  { icon: "⚡", name: "Bộ nhớ đệm (Cache)", how: "lưu câu trả lời cho truy vấn lặp lại; lần sau lấy ngay từ đệm.", gain: "giảm mạnh chi phí + độ trễ cho câu hỏi phổ biến." },
  { icon: "✂", name: "Rút gọn ngữ cảnh (Context trimming)", how: "chỉ đưa phần dữ liệu thực sự cần vào prompt (nối RAG/chunking I3.1).", gain: "giảm token → tiết kiệm, nhanh hơn, tránh lost-in-the-middle." },
  { icon: "⇄", name: "Định tuyến mô hình (Model routing)", how: "câu đơn giản → mô hình nhỏ / rẻ; câu phức tạp → mô hình lớn / mạnh.", gain: "cân accuracy nơi cần, tiết kiệm chi phí nơi không cần." },
];

// Phần 3 — monitoring questions
const MONITOR_QS = [
  { name: "Đo lường gì?", text: "chất lượng đầu ra, tỷ lệ lỗi / fallback, độ trễ (latency), chi phí theo token." },
  { name: "Log gì?", text: "đủ để chẩn đoán khi có sự cố — nhưng tuyệt đối KHÔNG log PII (ranh giới I1.2)." },
  { name: "Cảnh báo khi nào?", text: "ngưỡng nào phát cảnh báo (VD: tỷ lệ lỗi vượt X%, chi phí vượt ngân sách)." },
];

// Product — architecture doc
const DOC_PARTS = [
  { n: "1", name: "Sơ đồ 6 thành phần có chú thích", text: "vẽ input → tiền xử lý → xử lý cốt lõi → hậu xử lý → output → giám sát; mỗi nút quyết định gắn chú thích (annotation) nêu rõ ai trả giá.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", badgeBg: "var(--iris)" },
  { n: "2", name: "Pattern đã chọn + lý do", text: "nêu rõ chọn Prompt đơn / RAG / Agent (single vs multi-agent) cho lõi xử lý, kèm lý do dựa trên bài toán thực tế.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badgeBg: "var(--gold-deep)" },
  { n: "3", name: "Bảng phân tích đánh đổi (trade-off)", text: "mỗi quyết định làm rõ đánh đổi trên latency / cost / accuracy — không chỉ dừng ở sơ đồ trang trí.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", badgeBg: "var(--mint)" },
  { n: "4", name: "Phác thảo monitoring & eval", text: "đo lường những gì (chất lượng / lỗi / latency / cost), log gì (không PII), cảnh báo khi nào; bộ eval gồm bao nhiêu kịch bản.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badgeBg: "var(--rose-deep)" },
];
const DOC_CHECKLIST = [
  "Sơ đồ 6 thành phần rõ ràng, mỗi thành phần nói được vai trò của nó trong luồng xử lý.",
  "Mỗi nút quyết định có chú thích nêu rõ yếu tố phải đánh đổi (cost / latency / trust / monitoring).",
  "Pattern lõi (Prompt / RAG / Agent) được chọn kèm lý do dựa trên bài toán, không theo trend.",
  "Bảng trade-off phân tích thực chất trên latency / cost / accuracy cho ít nhất 3–4 quyết định.",
  "Phương án monitoring: liệt kê rõ đo gì · log gì (khẳng định không log PII) · ngưỡng cảnh báo.",
  "Phương án eval: mô tả bộ kịch bản kiểm thử (số ca + tiêu chí) để chống hồi quy khi thay đổi.",
];
const TRADE_TABLE = [
  { decision: "Dùng RAG cho trợ lý chính sách", trade: "accuracy ↑ nhưng cost & latency ↑ (thêm bước truy hồi + vector DB)", why: "câu trả lời phải bám tài liệu nội bộ luôn cập nhật → độ tin cậy quan trọng hơn tốc độ", rowBg: "#fff" },
  { decision: "Cache cho 80% câu lặp lại", trade: "cost & latency ↓ mạnh; rủi ro trả lời cũ nếu chính sách đổi → cần cơ chế làm mới cache", why: "\"giờ mở cửa\", \"phí ship\" lặp lại rất nhiều → phản hồi tức thì, gần như không tốn phí", rowBg: "var(--iris-tint)" },
  { decision: "Model routing theo độ khó", trade: "cost ↓ cho câu dễ; thêm độ phức tạp phân loại câu hỏi (một bước routing)", why: "câu đơn giản không cần mô hình mạnh → giữ mô hình lớn cho 10% ca khó", rowBg: "#fff" },
  { decision: "Single-agent có checkpoint (không multi-agent)", trade: "dễ kiểm soát & rẻ hơn; kém linh hoạt hơn phối hợp nhiều agent", why: "ở L2 chưa cần phân chia vai trò phức tạp → tránh tăng gấp bội chi phí & độ khó kiểm soát", rowBg: "var(--iris-tint)" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Kiến trúc & Pattern", B = "Phần B · Latency · Cost · Accuracy", C = "Phần C · Monitoring · Eval · Harness";
const EXAM: ExamQ[] = [
  { part: A, q: "\"Kiến trúc giải pháp AI\" đúng nghĩa là gì?", opts: ["Một sơ đồ nhiều hộp và mũi tên cho đẹp", "Một bản vẽ trang trí", "Một chuỗi quyết định đánh đổi (trade-off), mỗi lựa chọn đều đi kèm với chi phí phải đánh đổi", "Một danh sách tính năng"], correct: 2, why: "Kiến trúc là chuỗi quyết định đánh đổi (trade-off), mỗi lựa chọn đều đi kèm cái giá phải trả. (Phần 1)" },
  { part: A, q: "\"Quy tắc vàng\" khi ra quyết định kiến trúc là gì?", opts: ["Chọn công nghệ mới nhất", "Vẽ sơ đồ càng chi tiết càng tốt", "Luôn dùng agent", "Với mọi quyết định, nêu rõ \"yếu tố phải đánh đổi\" (chi phí / độ trễ / độ tin cậy / khả năng giám sát)"], correct: 3, why: "Quy tắc vàng: nêu rõ \"yếu tố phải đánh đổi\" cho mọi quyết định kiến trúc. (Phần 1)" },
  { part: A, q: "Một giải pháp AI production có 6 thành phần; thành phần \"dễ bị bỏ quên nhất\" là?", opts: ["Monitoring (Giám sát)", "Input", "Output", "Pre-processing (Tiền xử lý)"], correct: 0, why: "Giám sát (Monitoring) là thành phần dễ bị bỏ quên nhất. (Phần 1)" },
  { part: A, q: "Pattern \"Prompt đơn\" phù hợp khi nào?", opts: ["Cần kiến thức nội bộ cập nhật", "Tác vụ rõ ràng, chỉ cần khả năng ngôn ngữ / lập luận (viết, phân loại, tóm tắt)", "Cần nhiều bước & nhiều công cụ", "Cần tra cứu tài liệu chính sách"], correct: 1, why: "Prompt đơn: tác vụ rõ, chỉ cần ngôn ngữ / lập luận. (Phần 1)" },
  { part: A, q: "Pattern \"RAG\" phù hợp khi nào?", opts: ["Tác vụ chỉ cần viết văn", "Khi không có dữ liệu nào", "Cần kiến thức ngoài / nội bộ, cập nhật (chính sách, kho sản phẩm)", "Chỉ cần đổi màu giao diện"], correct: 2, why: "RAG: cần kiến thức ngoài / nội bộ, liên tục cập nhật. (Phần 1)" },
  { part: A, q: "Pattern \"Agent\" có đặc điểm gì cần lưu ý?", opts: ["Rẻ nhất, đơn giản nhất", "Không cần công cụ", "Luôn nên dùng cho mọi bài toán", "Khả năng xử lý mạnh nhất nhưng chi phí cao và khó kiểm soát — chỉ nên dùng khi thực sự cần thiết"], correct: 3, why: "Agent mạnh nhất nhưng chi phí cao và khó kiểm soát — chỉ dùng khi thực sự cần. (Phần 1)" },
  { part: A, q: "Ở cấp độ L2, bạn nên dùng loại agent nào?", opts: ["Single-agent (một agent vận hành theo quy trình có điểm kiểm soát - checkpoint)", "Multi-agent phức tạp cho mọi bài toán", "Không dùng pattern nào", "Càng nhiều agent càng tốt"], correct: 0, why: "L2 dùng single-agent (có checkpoint); multi-agent là từ L3 trở lên. (Phần 1)" },
  { part: A, q: "Nên chọn mẫu kiến trúc (Prompt / RAG / Agent) dựa trên điều gì?", opts: ["Theo trend / đối thủ", "Theo bài toán (nhu cầu thực tế của tác vụ)", "Theo cái nghe \"xịn\" nhất", "Theo cái AI gợi ý đầu tiên"], correct: 1, why: "Chọn mẫu kiến trúc theo bài toán thực tế, không chạy theo xu hướng. (Phần 1)" },
  { part: B, q: "Ba trục trade-off kiến trúc chính là gì?", opts: ["Token · Prompt · Schema", "Problem · User · Metric", "Latency · Cost · Accuracy", "Git · Test · Deploy"], correct: 2, why: "Ba trục đánh đổi: Latency (độ trễ) · Cost (chi phí) · Accuracy (độ chính xác). (Phần 2)" },
  { part: B, q: "Nhận định nào ĐÚNG về latency / cost / accuracy?", opts: ["Luôn có một cấu hình tốt nhất tuyệt đối", "Ba trục độc lập, không ảnh hưởng nhau", "Tăng accuracy luôn miễn phí", "Chúng thường xung đột lẫn nhau; chỉ có cấu hình phù hợp với ràng buộc của sản phẩm và nêu rõ yếu tố phải đánh đổi"], correct: 3, why: "Ba yếu tố thường xung đột; chỉ có cấu hình phù hợp ràng buộc + nêu rõ yếu tố phải đánh đổi. (Phần 2)" },
  { part: B, q: "Vì sao \"token cost là quyết định thiết kế\"?", opts: ["Ở quy mô lớn, chi phí token tăng lên rất nhanh (VD: 100.000 lượt × 500 token) → phải tính toán từ đầu, không để tính sau", "Vì token miễn phí", "Vì token không liên quan chi phí", "Vì chỉ demo mới tốn token"], correct: 0, why: "Ở quy mô lớn chi phí token tăng rất nhanh → là quyết định thiết kế cốt lõi, tính từ đầu. (Phần 2, kết hợp I1.1)" },
  { part: B, q: "Sai lầm \"chạy ngon khi demo\" là gì?", opts: ["Demo thì luôn sai", "Demo vài request thì rẻ và nhanh, nhưng khi vận hành thực tế với tải lớn (tải thực) cùng thiết kế đó có thể tốn chi phí gấp hàng ngàn lần và hệ thống bị nghẽn", "Demo không cần token", "Demo luôn đúng ở quy mô lớn"], correct: 1, why: "\"Chạy tốt khi demo\": dưới tải thực cùng thiết kế đó có thể tốn gấp hàng ngàn lần và bị nghẽn. (Phần 2)" },
  { part: B, q: "Kỹ thuật \"cache\" giúp gì?", opts: ["Tăng độ chính xác cho câu khó", "Ẩn PII", "Lưu trữ đệm câu trả lời cho các truy vấn lặp lại → giảm chi phí (cost) và độ trễ (latency)", "Tạo commit tự động"], correct: 2, why: "Cache lưu đệm câu trả lời cho câu hỏi lặp lại → giảm chi phí và độ trễ. (Phần 2)" },
  { part: B, q: "\"Model routing\" nghĩa là gì?", opts: ["Luôn dùng model lớn nhất", "Luôn dùng model nhỏ nhất", "Chọn model một cách ngẫu nhiên", "Câu hỏi đơn giản → mô hình nhỏ / rẻ; câu hỏi phức tạp → mô hình mạnh (cân bằng độ chính xác vs chi phí)"], correct: 3, why: "Model routing: câu dễ → mô hình nhỏ, câu khó → mô hình mạnh (cân accuracy vs cost). (Phần 2)" },
  { part: C, q: "Vì sao monitoring phải \"sinh ra cùng kiến trúc\"?", opts: ["Vì tích hợp sau thì thường đã muộn — thiếu dữ liệu để đánh giá tính năng hoạt động tốt hay đang âm thầm gặp lỗi", "Vì monitoring tốn token", "Vì mentor yêu cầu", "Vì monitoring làm code đẹp hơn"], correct: 0, why: "Thiết kế monitoring muộn thì đã trễ — không có dữ liệu để biết feature chạy tốt hay âm thầm lỗi. (Phần 3)" },
  { part: C, q: "Ba câu hỏi của monitoring là gì?", opts: ["Vai trò · Format · Ràng buộc", "Đo lường gì · Lưu nhật ký (log) gì (không PII) · Cảnh báo khi nào", "Problem · User · Metric", "Input · AI · Output"], correct: 1, why: "Ba câu hỏi của monitoring: đo gì · log gì (không PII) · cảnh báo khi nào. (Phần 3)" },
  { part: C, q: "\"Eval\" cho một hệ thống AI là gì?", opts: ["Một loại prompt", "Một mô hình mới", "Một bộ các kịch bản kiểm thử kèm tiêu chí đánh giá, chạy trước và sau thay đổi để phát hiện lỗi hồi quy (regression)", "Một lệnh Git"], correct: 2, why: "Eval = bộ kịch bản kiểm thử + tiêu chí, chạy trước & sau thay đổi để phát hiện hồi quy. (Phần 3)" },
  { part: C, q: "Nhận định nào ĐÚNG về eval?", opts: ["Eval không cần thiết nếu AI đủ mạnh", "Cảm giác là đủ để biết hệ thống tốt lên hay tệ đi", "Eval chỉ dùng cho demo", "Không có eval đồng nghĩa với việc triển khai mù quáng (không biết thay đổi giúp hệ thống tốt hơn hay tệ đi)"], correct: 3, why: "Không có eval = ship mù (không biết thay đổi giúp tốt hơn hay tệ đi). (Phần 3)" },
  { part: C, q: "\"Harness\" là gì?", opts: ["Hệ thống hạ tầng giúp chạy và chấm điểm bộ đánh giá một cách tự động, lặp lại được", "Một bộ ca kiểm thử", "Một loại vector database", "Một mô hình AI"], correct: 0, why: "Harness = khung chạy & chấm eval tự động, nhất quán, lặp lại được. (Phần 3)" },
  { part: C, q: "\"Tài liệu kiến trúc\" cho Capstone nên gồm những gì?", opts: ["Chỉ một sơ đồ đẹp", "Sơ đồ có chú thích (annotation) + mẫu kiến trúc (pattern) đã chọn (kèm lý do) + bảng đánh đổi (trade-off) + phác thảo phương án giám sát / đánh giá (monitoring / eval)", "Toàn bộ mã nguồn", "Chỉ danh sách tính năng"], correct: 1, why: "Tài liệu kiến trúc: sơ đồ có annotation + pattern (kèm lý do) + bảng trade-off + phương án monitoring/eval. (Phần 3)" },
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
const chartIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 3v18h18" /><rect x="7" y="9" width="3" height="8" /><rect x="12" y="5" width="3" height="12" /><rect x="17" y="12" width="3" height="5" /></svg>
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

export function LessonI51() {
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
      {state.page === "product" && <ProductScreen go={go} />}
      {state.page === "exam" && (
        <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />
      )}
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I5.1">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 4 · Tuần 12–14 · Capstone</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I5.1 · Kiến trúc giải pháp AI</span>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I5.1 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL6 · NL7</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "8px 13px", borderRadius: "999px" }}>Mở đầu Capstone</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Kiến trúc <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>giải pháp AI</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Tới Capstone, bạn không còn làm một tính năng đơn lẻ mà <b style={{ color: "var(--fg-1)" }}>thiết kế cả một giải pháp AI</b>. Cốt lõi: <b style={{ color: "var(--fg-1)" }}>kiến trúc không phải một sơ đồ đẹp, mà là một chuỗi quyết định đánh đổi (trade-off)</b> — mỗi quyết định đều đi kèm cái giá phải trả về <em style={{ fontStyle: "italic" }}>độ trễ · chi phí · độ tin cậy · khả năng giám sát</em>. Buổi này dạy bạn chọn <em style={{ fontStyle: "italic" }}>pattern</em> đúng, cân <em style={{ fontStyle: "italic" }}>latency–cost–accuracy</em>, và cài <em style={{ fontStyle: "italic" }}>monitoring &amp; eval</em> ngay từ đầu.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~46</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>3</b> phần đọc + Tài liệu kiến trúc + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Thiết kế kiến trúc không đơn thuần là vẽ một sơ đồ đẹp, mà là việc đưa ra <b style={{ color: "var(--fg-1)" }}>một chuỗi quyết định đánh đổi</b>, trong đó mỗi quyết định đều đi kèm chi phí (độ trễ, ngân sách, độ tin cậy, khả năng giám sát). Buổi này dạy bạn chọn <b style={{ color: "var(--fg-1)" }}>mẫu kiến trúc (Prompt / RAG / Agent)</b> đúng, cân bằng <b style={{ color: "var(--fg-1)" }}>độ trễ – chi phí – độ chính xác</b>, và tích hợp <b style={{ color: "var(--fg-1)" }}>giám sát &amp; đánh giá</b> ngay từ đầu — nền tảng để triển khai một sản phẩm đáng tin cậy ở <b style={{ color: "var(--fg-1)" }}>I5.2 / I5.3</b>.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~46 phút</span>
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
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--iris)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff" }}>{chartIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "7px" }}>Sản phẩm buổi học · bắt buộc</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Tài liệu kiến trúc cho giải pháp Capstone</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Một tài liệu gồm <b style={{ color: "var(--fg-1)" }}>sơ đồ 6 thành phần có chú thích</b> + <b style={{ color: "var(--fg-1)" }}>pattern đã chọn kèm lý do</b> + <b style={{ color: "var(--fg-1)" }}>bảng phân tích đánh đổi</b> + <b style={{ color: "var(--fg-1)" }}>phác thảo monitoring &amp; eval</b>. Đây là minh chứng bắt buộc mang sang buổi bảo vệ tốt nghiệp <b style={{ color: "var(--fg-1)" }}>I5.3</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Xem yêu cầu →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--gold-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang buổi I5.2. Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I5.2 — Bảo mật, Eval &amp; Vận hành</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--gold-deep)", color: "var(--gold-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Kiến trúc &amp; Ops · phải biết</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
              {MUST_KNOW.map((t, i) => (
                <span key={i} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Nối buổi trước · ôn lại</div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {NICE_KNOW.map((t, i) => (
                <span key={i} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
              ))}
            </div>
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Buổi mở đầu <b>Giai đoạn 4 (Capstone)</b>. Không có cổng gate riêng — buổi này tích lũy; tài liệu kiến trúc bạn tạo là bằng chứng bắt buộc cho buổi bảo vệ tốt nghiệp I5.3.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I4.3 (Tích hợp &amp; Đo kết quả)</b> → buổi <b style={{ color: "var(--fg-1)" }}>I5.1 (Kiến trúc giải pháp AI · Capstone)</b> → sang <b style={{ color: "var(--fg-1)" }}>I5.2 (Bảo mật, Eval &amp; Vận hành)</b>.</p>
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
    { title: "Kiến trúc = trade-off & Pattern", open: () => go("read", 0) },
    { title: "Latency – Cost – Accuracy", open: () => go("read", 1) },
  ];
  const nextArr = [
    { title: "Latency – Cost – Accuracy", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Monitoring, Eval & Harness", kicker: "SAU →", color: "var(--mint-deep)", open: () => go("read", 2) },
    { title: "Tài liệu kiến trúc →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("product") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.1
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{chartIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Tài liệu kiến trúc · sản phẩm</span>
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I5.1</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>N</span>hiều người lầm tưởng &quot;kiến trúc&quot; chỉ là vẽ một sơ đồ nhiều hộp và mũi tên cho đẹp. Trên thực tế, <b>kiến trúc là một chuỗi quyết định đánh đổi (trade-off)</b> — mỗi lựa chọn (dùng RAG hay không, cache hay không, mô hình lớn hay nhỏ, đồng bộ hay bất đồng bộ) đều mang lợi ích nhưng cũng đi kèm cái giá phải trả.
      </p>

      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Quy tắc vàng của buổi</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Với mọi quyết định kiến trúc, nêu rõ <b>&quot;yếu tố phải đánh đổi là gì&quot;</b> — chi phí (cost) · độ trễ (latency) · độ tin cậy (trust) · khả năng giám sát (monitoring). Một sơ đồ dù đẹp nhưng không chỉ ra các điểm đánh đổi thì chỉ mang tính trang trí.</p>
      </div>

      <figure style={{ margin: "0 0 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--fg-3)", marginBottom: "12px" }}>SƠ ĐỒ ĐẸP — TRANG TRÍ</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Nhiều hộp &amp; mũi tên bắt mắt, nhưng <b>không nói ai trả giá</b> cho từng quyết định.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--border)", paddingTop: "10px" }}>Chỉ chứng minh &quot;trông có vẻ hợp lý&quot;.</div>
          </div>
          <div style={{ border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--iris-deep)", marginBottom: "12px" }}>KIẾN TRÚC THẬT — CHUỖI TRADE-OFF</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Mỗi nút quyết định gắn một thẻ đánh đổi: <b>ai trả giá? (cost / latency / trust / monitoring)</b>.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--iris)", paddingTop: "10px" }}>Chứng minh bạn <b>thiết kế có chủ đích</b>.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Kiến trúc = chuỗi quyết định trade-off, không phải sơ đồ trang trí.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Sáu thành phần của một giải pháp AI production</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Ở I4.2 bạn học <b>5 lớp</b> của một tính năng. Ở cấp giải pháp vận hành thực tế, mô hình mở rộng thành <b>6 thành phần</b> — yếu tố mới quan trọng nhất là <b>Giám sát (Monitoring)</b>.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {SIX_COMPONENTS.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: `1px solid ${c.border}`, borderRadius: "11px", background: c.bg, padding: "13px 16px" }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "8px", background: c.badgeBg, color: c.badgeFg, font: "700 14px/28px var(--font-numeric)", textAlign: "center" }}>{c.n}</span>
              <div style={{ font: "14.5px/1.55 var(--font-body)", color: "var(--fg-1)" }}><b>{c.name} — </b>{c.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Thành phần 6 (Giám sát) phân biệt hệ thống &quot;chạy lúc demo&quot; với &quot;vận hành thật&quot;.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Chọn pattern: Prompt đơn / RAG / Agent</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Phần xử lý cốt lõi (thành phần 3) có ba mẫu kiến trúc chính. <b>Chọn theo bài toán thực tế, không chạy theo xu hướng</b> (nối cây quyết định ở I1.1):</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {PATTERN_CARDS.map((p, i) => (
            <div key={i} style={{ border: `1px solid ${p.border}`, borderRadius: "12px", background: p.bg, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                <span style={{ font: "700 16px/1.2 var(--font-brand)", color: p.color }}>{p.name}</span>
                <span style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".04em", color: p.color, background: "#fff", border: `1px solid ${p.border}`, padding: "5px 9px", borderRadius: "6px" }}>{p.badge}</span>
              </div>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginBottom: "6px" }}><b>Khi nào dùng: </b>{p.when}</div>
              <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)", borderTop: `1px dashed ${p.border}`, paddingTop: "8px" }}><b>Đánh đổi: </b>{p.trade}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Chọn pattern theo bài toán, không theo trend.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Single-agent (L2) vs Multi-agent (L3+):</b> ở L2 dùng <b>single-agent</b> (một agent vận hành theo quy trình có checkpoint). <b>Multi-agent</b> chỉ cân nhắc khi bài toán thực sự cần phân chia vai trò rõ ràng — làm tăng gấp nhiều lần chi phí và độ khó kiểm soát.
      </div>

      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>&quot;Viết mô tả sản phẩm&quot; → <b>Prompt đơn</b>. &nbsp;·&nbsp; &quot;Trợ lý trả lời dựa trên chính sách đổi/trả nội bộ&quot; → <b>RAG</b>. &nbsp;·&nbsp; &quot;Đọc đơn → kiểm tồn kho → soạn phản hồi → tạo phiếu đổi&quot; (nhiều bước, nhiều công cụ) → cân nhắc <b>Agent</b>, kèm bước xác nhận con người (HITL) trước hành động không thể hoàn tác.</p>
      </div>

      <TldrDark items={[
        "<b>Kiến trúc là chuỗi quyết định đánh đổi (trade-off)</b>, không đơn thuần là sơ đồ đẹp; mọi quyết định phải chỉ rõ <b>yếu tố phải đánh đổi</b>.",
        "Một giải pháp AI production gồm <b>6 thành phần</b> (input · tiền xử lý · xử lý cốt lõi · hậu xử lý · output · <b>giám sát</b>) — giám sát dễ bị bỏ quên nhất.",
        "<b>Chọn pattern theo bài toán</b>: Prompt đơn (rẻ/nhanh) · RAG (cần kiến thức ngoài) · Agent (nhiều bước, chi phí cao &amp; khó kiểm soát); ở L2 ưu tiên single-agent.",
      ]} />

      <SelfCheck items={[
        "Vì sao &quot;sơ đồ đẹp&quot; chưa phải kiến trúc? Kiến trúc thật khác ở điểm gì?",
        "Kể 6 thành phần của một giải pháp AI production; thành phần nào hay bị bỏ quên?",
        "Cho 3 bài toán YODY, mỗi bài nên dùng Prompt đơn / RAG / Agent? Vì sao?",
        "Khi nào mới cân nhắc multi-agent thay vì single-agent?",
      ]} />
    </div>
  );
}

function Part2View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>M</span>ỗi quyết định kiến trúc kéo theo đánh đổi trên ba trục: <b>độ trễ (latency) – chi phí (cost) – độ chính xác (accuracy)</b>. Ba yếu tố này <b>thường xung đột lẫn nhau</b> — nâng độ chính xác thường kéo theo chi phí và độ trễ cao hơn.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Ba trục đánh đổi</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {TRADE_AXES.map((a, i) => (
            <div key={i} style={{ border: `1px solid ${a.border}`, borderRadius: "12px", background: a.bg, padding: "16px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
              <div style={{ font: "700 15px/1.2 var(--font-brand)", color: a.color }}>{a.name}</div>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{a.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Latency · Cost · Accuracy thường xung đột; kéo trục này ảnh hưởng trục kia.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Không có cấu hình <b>&quot;tốt nhất tuyệt đối&quot;</b> — chỉ có cấu hình <b>phù hợp nhất với các ràng buộc của sản phẩm</b>, và bạn phải chỉ rõ mình đang đánh đổi yếu tố nào.</div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Chatbot CSKH cần phản hồi <b>nhanh</b> → ưu tiên latency, dùng mô hình nhỏ cho yêu cầu đơn giản. Ngược lại, báo cáo phân tích chạy nền qua đêm → ưu tiên <b>accuracy</b>, không bận tâm độ trễ.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Token cost là ràng buộc sản phẩm</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Nhắc lại I1.1: chi phí tính trên mỗi <b>token</b> (input + output, output đắt hơn). Ở quy mô lớn, con số tăng rất nhanh:</p>
      <div style={{ border: "1px solid var(--iris)", borderRadius: "14px", background: "#fff", padding: "20px 22px", margin: "0 0 20px", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap", justifyContent: "center", textAlign: "center" }}>
        <div><div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--iris)" }}>100.000</div><div style={{ font: "12px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: "4px" }}>lượt/ngày</div></div>
        <span style={{ font: "700 20px/1 var(--font-body)", color: "var(--fg-3)" }}>×</span>
        <div><div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--iris)" }}>500</div><div style={{ font: "12px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: "4px" }}>token/prompt</div></div>
        <span style={{ font: "700 20px/1 var(--font-body)", color: "var(--fg-3)" }}>=</span>
        <div><div style={{ font: "italic 800 30px/1 var(--font-serif)", color: "var(--gold-deep)" }}>50 triệu</div><div style={{ font: "12px/1.4 var(--font-mono)", color: "var(--fg-3)", marginTop: "4px" }}>token/ngày · chỉ tính input</div></div>
      </div>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Vì thế <b>tối ưu chi phí phải là tiêu chí thiết kế ngay từ đầu</b>, không phải chuyện &quot;để tính sau&quot;.</p>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Sai lầm &quot;chạy tốt khi demo&quot;:</b> thử vài request thì nhanh &amp; rẻ; nhưng dưới tải thực, chính thiết kế đó có thể tốn chi phí gấp hàng ngàn lần và bị nghẽn. Bắt buộc <b>ước lượng tải thực</b> trước khi thiết kế: số request/ngày × token trung bình/request.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Ba kỹ thuật tối ưu cost &amp; latency</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {OPT_TECHNIQUES.map((o, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "15px 18px" }}>
              <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "8px", background: "var(--mint)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{o.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>{o.name}</div>
                <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)" }}><b>Cách làm: </b>{o.how} &nbsp;·&nbsp; <b>Lợi ích: </b>{o.gain}</div>
              </div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Tối ưu cost &amp; latency: cache · trim · routing.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>80% câu hỏi lặp lại (&quot;giờ mở cửa&quot;, &quot;phí vận chuyển&quot;) → dùng <b>cache</b> để trả tức thì, gần như không tốn phí; chỉ câu phức tạp mới <b>routing</b> sang mô hình lớn. Kết quả: tiết kiệm tối đa mà khách vẫn được phục vụ nhanh.</p>
      </div>

      <TldrDark items={[
        "<b>Latency – Cost – Accuracy</b> thường xung đột; không có cấu hình tốt nhất tuyệt đối, chỉ có cấu hình phù hợp ràng buộc + nêu rõ <b>yếu tố phải đánh đổi</b>.",
        "<b>Token cost là tiêu chí thiết kế ngay từ đầu</b>; &quot;chạy tốt khi demo&quot; dễ gây nhầm lẫn — bắt buộc <b>ước lượng tải thực</b> trước khi thiết kế.",
        "Ba kỹ thuật tối ưu: <b>cache</b> (câu lặp lại) · <b>context trimming</b> (chỉ giữ phần cần) · <b>model routing</b> (câu dễ → mô hình nhỏ, câu khó → mô hình mạnh).",
      ]} />

      <SelfCheck items={[
        "Cho một feature, giải thích một quyết định tăng accuracy nhưng phải trả giá bằng cost/latency.",
        "Vì sao &quot;chạy ngon khi demo&quot; là sai lầm nguy hiểm? Bạn tính tải thực thế nào?",
        "Feature CSKH có 80% câu hỏi lặp lại — bạn dùng kỹ thuật tối ưu nào và vì sao?",
        "Model routing giúp cân accuracy vs cost ra sao?",
      ]} />
    </div>
  );
}

function Part3View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--mint-deep)", padding: "6px 12px 0 0" }}>G</span>iám sát (monitoring) giúp bạn <b>biết hệ thống đang vận hành thật ra sao</b>. Sai lầm phổ biến: build xong, ship rồi mới nghĩ &quot;giờ đo gì&quot;. Khi đó thường đã muộn — thiếu dữ liệu để biết feature chạy tốt hay đang âm thầm lỗi.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Monitoring song hành cùng kiến trúc</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Vì thế <b>giám sát phải được thiết kế song hành cùng kiến trúc</b> (chính là thành phần 6 ở Phần 1). Ba câu hỏi cần trả lời ngay từ bước thiết kế:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {MONITOR_QS.map((q, i) => (
            <div key={i} style={{ border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
              <div style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--iris-deep)" }}>{q.name}</div>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{q.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Monitoring sinh ra cùng kiến trúc, không gắn sau.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Ranh giới nghiêm ngặt:</b> log đủ để chẩn đoán khi có sự cố, nhưng <b>tuyệt đối KHÔNG log thông tin cá nhân nhạy cảm (PII)</b> (đã học ở I1.2).
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Eval — biết thay đổi làm hệ thống tốt hay tệ đi</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Khi bạn (hoặc AI) chỉnh prompt, đổi mô hình, hoặc tinh chỉnh RAG, không thể chỉ dựa vào cảm tính. <b>Đánh giá (Eval)</b> là câu trả lời:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "15px 18px", font: "14.5px/1.65 var(--font-body)", color: "var(--fg-1)" }}><b>Eval = bộ kịch bản kiểm thử (test cases) kèm tiêu chí.</b> Mỗi kịch bản gồm một đầu vào + kết quả mong đợi (hoặc tiêu chí đạt chuẩn).</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "15px 18px", font: "14.5px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Chạy eval <b>trước và sau khi thay đổi</b> → phát hiện ngay thay đổi có gây <b>lỗi hồi quy (regression)</b> — làm suy giảm phần vốn đang chạy đúng — hay không.</div>
      </div>
      <div style={{ margin: "0 0 20px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--iris-deep)" }}>Liên hệ I4.2:</b> eval là &quot;unit test cho hệ thống AI&quot; ở cấp giải pháp. <b>Không có eval = ship mù</b> (không biết thay đổi giúp hệ thống tốt hơn hay tệ đi).
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Trợ lý chính sách đổi/trả có eval gồm 20 câu hỏi thực tế kèm đáp án chuẩn. Sau khi đổi prompt, chạy lại 20 kịch bản: nếu số ca đúng giảm từ <b>19 → 16</b> → thay đổi đã gây hồi quy, <b>không được triển khai</b>.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Harness — khung chạy &amp; chấm lặp lại được</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}><b>Harness</b> là hạ tầng chạy bộ eval <b>tự động và nhất quán</b>: nạp kịch bản → chạy hệ thống → so tiêu chí → tổng hợp điểm → cảnh báo nếu kém hơn lần trước.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center", border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "20px 18px" }}>
          <div style={{ border: "1.5px solid var(--iris)", background: "var(--iris-tint)", borderRadius: "11px", padding: "13px 15px", width: "150px", textAlign: "center" }}><div style={{ font: "700 13px/1.3 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "4px" }}>Eval set</div><div style={{ font: "11.5px/1.45 var(--font-body)", color: "var(--fg-2)" }}>các ca: input + kỳ vọng</div></div>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <div style={{ border: "1.5px solid var(--gold-deep)", background: "var(--gold-tint)", borderRadius: "11px", padding: "13px 15px", width: "150px", textAlign: "center" }}><div style={{ font: "700 13px/1.3 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "4px" }}>Harness</div><div style={{ font: "11.5px/1.45 var(--font-body)", color: "var(--fg-2)" }}>chạy · so tiêu chí · chấm</div></div>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <div style={{ border: "1.5px solid var(--mint)", background: "var(--mint-tint)", borderRadius: "11px", padding: "13px 15px", width: "170px", textAlign: "center" }}><div style={{ font: "italic 800 24px/1 var(--font-serif)", color: "var(--mint-deep)" }}>18/20 đạt</div><div style={{ font: "11.5px/1.45 var(--font-body)", color: "var(--rose-deep)", marginTop: "4px" }}>lần trước 19/20 → CẢNH BÁO hồi quy</div></div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Eval = bộ ca + tiêu chí · Harness = khung chạy &amp; chấm lặp lại. Không có eval = ship mù.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Ở L2 chưa cần harness phức tạp — chỉ cần một script đơn giản: tự chạy eval, in số ca đạt và so với lần chạy trước. Cốt lõi là <b>biến kiểm định chất lượng thành hoạt động lặp lại nhất quán</b>.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Gói lại thành tài liệu kiến trúc</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Sản phẩm của buổi này là một <b>tài liệu kiến trúc</b> cho Capstone: sơ đồ 6 thành phần có chú thích + <b>pattern đã chọn</b> kèm lý do + <b>bảng phân tích đánh đổi</b> (latency/cost/accuracy cho mỗi quyết định) + <b>phác thảo monitoring &amp; eval</b>. Đây là minh chứng bạn <em>thiết kế hệ thống có chủ đích</em>, và là đầu vào cho I5.2 (guardrails, siết eval) và I5.3 (bảo vệ tốt nghiệp).</p>
      <div style={{ margin: "0 0 30px", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đến lúc dựng tài liệu kiến trúc</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Xem đầy đủ 4 phần bắt buộc, checklist đạt chuẩn và mẫu bảng trade-off.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Xem yêu cầu tài liệu →</a>
      </div>

      <TldrDark items={[
        "<b>Monitoring phải thiết kế song hành cùng kiến trúc</b>; trả lời sớm ba câu hỏi: <b>đo gì / log gì (không PII) / cảnh báo khi nào</b>.",
        "<b>Eval</b> = bộ kịch bản + tiêu chí, chạy trước &amp; sau mỗi thay đổi để phát hiện <b>hồi quy</b>; không có eval = <b>ship mù</b> (&quot;unit test cho hệ thống AI&quot;).",
        "<b>Harness</b> = khung chạy &amp; chấm eval tự động; tất cả đóng gói thành <b>tài liệu kiến trúc</b> (sơ đồ + pattern + bảng trade-off + monitoring/eval) cho Capstone.",
      ]} />

      <SelfCheck items={[
        "Vì sao monitoring không thể &quot;gắn sau&quot;? Ba câu hỏi của monitoring là gì?",
        "Eval giúp phát hiện điều gì khi bạn đổi prompt/model? Cho ví dụ hồi quy.",
        "Phân biệt eval và harness.",
        "Liệt kê các phần của một tài liệu kiến trúc cho Capstone.",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--gold-deep)", marginBottom: "4px" }}>Hoàn thành phần đọc I5.1 ✓</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu) trước khi sang I5.2, và dựng <b style={{ color: "var(--fg-1)" }}>tài liệu kiến trúc</b> cho Capstone.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Làm Final Exam →</a>
      </div>
    </div>
  );
}

function ProductScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tài liệu kiến trúc" style={{ maxWidth: "900px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Sản phẩm buổi học · bắt buộc</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Tài liệu <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>kiến trúc</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "660px" }}>Kết thúc buổi, bạn nộp một <b style={{ color: "var(--fg-1)" }}>tài liệu kiến trúc</b> cho giải pháp Capstone. Tài liệu này chứng minh bạn <b style={{ color: "var(--fg-1)" }}>thiết kế có chủ đích</b> — không dừng ở việc lắp ghép tạm bợ cho hệ thống chạy được — và là <b style={{ color: "var(--fg-1)" }}>minh chứng bắt buộc</b> mang sang buổi bảo vệ tốt nghiệp <b style={{ color: "var(--fg-1)" }}>I5.3</b>.</p>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Bốn phần bắt buộc của tài liệu</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Đủ 4 phần dưới đây là một tài liệu kiến trúc hoàn chỉnh cấp L2.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 36px" }}>
        {DOC_PARTS.map((d, i) => (
          <div key={i} style={{ border: `1px solid ${d.border}`, borderRadius: "14px", background: d.bg, padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ width: "30px", height: "30px", flex: "none", borderRadius: "9px", background: d.badgeBg, color: "#fff", font: "700 14px/30px var(--font-numeric)", textAlign: "center" }}>{d.n}</span>
              <div style={{ font: "700 16px/1.2 var(--font-brand)", color: d.color }}>{d.name}</div>
            </div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>{d.text}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Checklist tài liệu đạt chuẩn</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Rà đủ 6 mục trước khi mang sang I5.3.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 36px" }}>
        {DOC_CHECKLIST.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "14px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{q}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Mẫu bảng phân tích đánh đổi</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Ví dụ giả lập — trợ lý CSKH của YODY. Mỗi quyết định nêu rõ đánh đổi trên latency / cost / accuracy.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1.4fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Quyết định</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Đánh đổi (ai trả giá)</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Lý do chọn</div>
          {TRADE_TABLE.map((r, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", background: r.rowBg, font: "700 13px/1.4 var(--font-brand)", color: "var(--fg-1)" }}>{r.decision}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.trade}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.why}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none" }}>Làm Final Exam →</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 2); }} className="cta" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)" }}>Đọc lại Phần 3</a>
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20 → sẵn sàng sang I5.2 — Bảo mật, Eval & Vận hành. Đừng quên dựng tài liệu kiến trúc cho Capstone (bằng chứng bắt buộc ở I5.3).`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–8 → đọc lại Phần 1 (Kiến trúc & Pattern); 9–14 → Phần 2 (Latency–Cost–Accuracy); 15–20 → Phần 3 (Monitoring · Eval · Harness).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I5.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · làm trước khi sang I5.2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I5.1</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "620px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Kiến trúc &amp; Pattern (1–8) · Latency–Cost–Accuracy (9–14) · Monitoring/Eval/Harness (15–20). Chọn xong bấm &quot;Nộp bài&quot; để chấm &amp; xem giải thích.</p>

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