"use client";

import { useState, type ReactNode } from "react";

type Page = "overview" | "read" | "gate" | "exam";

interface LessonState {
  page: Page;
  part: number;
  answers: Record<number, number>;
  submitted: boolean;
  cards: Record<number, boolean>;
  cardsRevealed: boolean;
}

const PART_META = [
  { n: "01", short: "Output vs Outcome", title: "Output vs Outcome & Metric", time: "~18 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "PII & Tuân thủ", title: "PII & Tuân thủ dữ liệu khi dùng AI", time: "~17 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "03", short: "Hallucination & Diligence", title: "Hallucination, Bias & Diligence", time: "~15 phút", c: "var(--rose)", cDeep: "var(--rose-deep)", tint: "var(--rose-tint)" },
];

const PASS_SCORE = 18;
const PASS_PCT = "82%";

const OBJECTIVES = [
  "Phân biệt rõ output và outcome; giải thích một feature phục vụ outcome nào.",
  "Chọn được metric đo kết quả cho một công việc, phân biệt value metric với vanity metric.",
  "Vẽ được chuỗi Feature → Outcome → Metric cho một tình huống thật tại YODY.",
  "Nêu đúng PII là gì, ranh giới cứng khi dùng AI, và biết ẩn danh hoá dữ liệu (theo Luật 91/2025/QH15).",
  "Nhận diện hallucination & bias như ràng buộc độ tin cậy; hiểu diligence thuộc về builder.",
];

const MUST_KNOW = ["Output vs Outcome", "Value / Vanity metric", "Feature→Outcome→Metric", "PII", "Ẩn danh hoá", "Luật 91/2025/QH15", "Grounding"];
const NICE_KNOW = ["ROI", "Quasi-identifier", "Sycophancy", "Bias", "Human-in-the-loop", "Trust layer"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~50 phút" },
  { k: "Giai đoạn", v: "1 · Tuần 1–4" },
  { k: "Cấp độ", v: "L1 → L2" },
  { k: "Năng lực", v: "NL1 · NL7 🔒" },
  { k: "Gate", v: "⛳ Gate 1 (L1→L2)" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

const PARTS = [
  { ...PART_META[0], desc: "Output vs outcome, ROI, value/vanity metric và chuỗi Feature → Outcome → Metric — xương sống của deliverable Gate 1.", tags: ["Outcome", "ROI", "Value metric"] },
  { ...PART_META[1], desc: "PII là gì, Luật 91/2025/QH15, ranh giới cứng, quasi-identifier và ẩn danh hoá dữ liệu trước khi dùng AI.", tags: ["PII", "Luật 91/2025", "Ẩn danh hoá"] },
  { ...PART_META[2], desc: "Hallucination như ràng buộc độ tin cậy, grounding, sycophancy, bias và diligence của builder.", tags: ["Hallucination", "Grounding", "Diligence"] },
];

const CHAIN = [
  { f: "Chatbot tư vấn size", o: "Khách chọn đúng size ngay lần đầu → ít đổi trả", m: "Tỉ lệ đổi trả do sai size (trước/sau)" },
  { f: "AI tóm tắt review theo chủ đề", o: "Đội sản phẩm nắm nhanh vấn đề nổi cộm → sửa đúng chỗ", m: "Thời gian từ \"có review\" đến \"ra quyết định cải tiến\"" },
  { f: "AI gợi ý câu trả lời cho CSKH", o: "Nhân viên trả lời nhanh & nhất quán hơn", m: "Thời gian xử lý trung bình một ticket" },
];

const ALLOW = [
  "Brief viết nội dung (mô tả sản phẩm, caption)",
  "Mô tả luồng nghiệp vụ chung (quy trình đổi trả)",
  "Dữ liệu đã ẩn danh / tổng hợp, làm tròn, không gắn cá nhân",
  "Câu hỏi kiến thức chung (SEO, phân tích đối thủ)",
  "Review đã xóa hết trường định danh",
];

const DENY = [
  "Tên + SĐT + địa chỉ khách hàng",
  "Ảnh / số CCCD, giấy tờ tùy thân",
  "Bảng lương, thu nhập nhân sự",
  "Doanh thu / tồn kho nội bộ chưa công bố (bí mật KD)",
  "Lịch sử chat / đơn hàng kèm thông tin định danh",
];

const RISKS = [
  { risk: "Hallucination", c: "var(--rose-deep)", what: "AI bịa \"có căn cứ giả\" khi thiếu dữ liệu", guard: "Grounding: chỉ trả lời từ dữ liệu được cấp; không có thì nói \"không biết\"" },
  { risk: "Sycophancy", c: "var(--gold-deep)", what: "AI đồng tình theo cách bạn hỏi mớm", guard: "Hỏi trung tính: yêu cầu phản biện, nêu rủi ro/điểm yếu" },
  { risk: "PII / bí mật KD leakage", c: "var(--iris-deep)", what: "Dữ liệu nhập vào AI ngoài có thể bị lưu/huấn luyện", guard: "Redaction/ẩn danh trước khi gọi; ưu tiên tool đã duyệt" },
  { risk: "Over-reliance", c: "var(--fg-1)", what: "Tin output vì nó \"nói trơn tru\", bỏ qua kiểm chứng", guard: "Human-in-the-loop: người kiểm trước khi output ra dưới tên sản phẩm" },
];

interface CardItem {
  label: string;
  ans: boolean;
  why: string;
}

const CARD_DATA: CardItem[] = [
  { label: "Danh sách SĐT 200 khách VIP", ans: false, why: "PII trực tiếp (SĐT); thêm nữa là dữ liệu nhạy cảm thương mại." },
  { label: "Brief viết content cho áo khoác đông", ans: true, why: "Không PII, không phải bí mật kinh doanh." },
  { label: "Bảng lương phòng Marketing", ans: false, why: "Thu nhập + tên nhân sự = dữ liệu cá nhân nhạy cảm + mật nội bộ." },
  { label: "Mô tả chung về luồng đổi/trả hàng", ans: true, why: "Mô tả quy trình chung, không định danh ai." },
  { label: "File Excel doanh thu theo cửa hàng (chưa công bố)", ans: false, why: "Không phải PII nhưng là bí mật kinh doanh (tài chính chưa công bố)." },
  { label: "30 review đã xóa hết trường định danh", ans: true, why: "Đã ẩn danh; nội dung review vốn công khai." },
  { label: "Ảnh CCCD nhân viên để \"nhờ AI đọc số\"", ans: false, why: "PII đặc biệt nhạy cảm — số CCCD; cấm tuyệt đối." },
  { label: "Câu hỏi \"cách viết mô tả SEO cho áo thun\"", ans: true, why: "Câu hỏi kiến thức chung." },
  { label: "Lịch sử chat 1 khách kèm tên + SĐT", ans: false, why: "PII rõ ràng — phải ẩn cả tổ hợp (tên + SĐT) trước khi dùng." },
  { label: "Số tồn kho tổng hợp theo nhóm hàng, đã làm tròn, không gắn cửa hàng", ans: true, why: "Vùng xám: đã tổng hợp + ẩn danh đủ. Nếu gắn tên cửa hàng cụ thể & chưa công bố → ❌ (bí mật KD)." },
];

const BRIEF = [
  { n: "1", c: "var(--iris)", title: "Outcome", desc: "Tính năng tạo ra thay đổi thực tế gì, cho ai? (Không mô tả \"làm gì\" mà mô tả \"thay đổi gì\".)" },
  { n: "2", c: "var(--gold-deep)", title: "Metric", desc: "Đo outcome bằng chỉ số nào? Nêu rõ là value metric (không vanity) và có mốc so sánh (trước/sau hoặc so nhóm)." },
  { n: "3", c: "var(--mint-deep)", title: "Giới hạn AI cần biết trước khi build", desc: "Tính năng đụng giới hạn nào (context window, hallucination, knowledge cutoff, bias) và thiết kế quanh nó ra sao (grounding, HITL…)." },
  { n: "4", c: "var(--rose-deep)", title: "Dữ liệu KHÔNG được dùng (PII)", desc: "Liệt kê loại dữ liệu không được đưa vào AI, và nếu cần xử lý thì ẩn danh hoá thế nào." },
];

const RUBRIC = [
  { t: "Outcome rõ ràng", d: "mô tả thay đổi thực tế cho một đối tượng cụ thể, không nhầm với output (\"đã build xong\")." },
  { t: "Metric đo được & là value metric", d: "gắn hành vi/giá trị thật, đo được bằng dữ liệu thực tế, có mốc so sánh. Không dùng vanity metric." },
  { t: "Nêu đúng ≥1 giới hạn AI", d: "liên quan tới tính năng và cách thiết kế quanh nó." },
  { t: "PII đúng", d: "liệt kê chính xác dữ liệu không được đưa vào AI công cộng + cách ẩn danh hoá. Không đề xuất nào vi phạm ranh giới cứng." },
];

interface ExamQ {
  part: string;
  q: string;
  opts: string[];
  correct: number;
  why: string;
}

const EXAM: ExamQ[] = [
  { part: "Phần A · Outcome & Metric", q: "\"Outcome\" khác \"output\" ở chỗ nào?", opts: ["Outcome là thay đổi thực tế tính năng tạo ra; output là thứ được làm ra", "Outcome là số dòng code, output là tính năng", "Chúng giống hệt nhau", "Output luôn quan trọng hơn outcome"], correct: 0, why: "Outcome = thay đổi thực tế; output = thứ được làm ra." },
  { part: "Phần A · Outcome & Metric", q: "Đội build xong chatbot tư vấn size nhưng sau 1 tháng tỉ lệ đổi trả không đổi. Kết luận đúng?", opts: ["Tính năng thành công vì đã chạy được", "Có output nhưng outcome = 0 (chưa tạo ra thay đổi thực tế)", "Đây là một ví dụ về vanity metric", "Cần tăng temperature của chatbot"], correct: 1, why: "Chatbot đã chạy (có output) nhưng không thay đổi tỉ lệ đổi trả → outcome = 0." },
  { part: "Phần A · Outcome & Metric", q: "ROI ở góc nhìn product nên được hiểu là?", opts: ["Chỉ là số tiền lãi tuyệt đối", "Số lượng tính năng đã hoàn thành", "Giá trị thu lại so với công sức/chi phí bỏ ra", "Số người dùng đăng ký"], correct: 2, why: "ROI = giá trị thu lại so với chi phí/công sức bỏ ra (không chỉ là tiền)." },
  { part: "Phần A · Outcome & Metric", q: "Đâu là VALUE metric cho tính năng \"gợi ý sản phẩm phối cùng\"?", opts: ["Số gợi ý AI hiển thị mỗi ngày", "Số lần khách nhìn thấy widget gợi ý", "Số câu AI đã sinh", "Tỉ lệ đơn có ≥2 sản phẩm nhờ gợi ý (hoặc thay đổi AOV)"], correct: 3, why: "\"Tỉ lệ đơn ≥2 sản phẩm / AOV\" gắn giá trị thật; còn lại là vanity." },
  { part: "Phần A · Outcome & Metric", q: "Câu hỏi nào giúp lọc ra một vanity metric?", opts: ["\"Nếu chỉ số này tăng mà mọi thứ khác giữ nguyên, YODY có thật sự tốt lên không?\"", "\"Chỉ số này có dễ đo không?\"", "\"Chỉ số này nghe có ấn tượng khi báo cáo không?\"", "\"Đối thủ có dùng chỉ số này không?\""], correct: 0, why: "Câu hỏi \"tăng thì YODY có thật sự tốt lên không?\" lọc được vanity metric." },
  { part: "Phần A · Outcome & Metric", q: "Đặc điểm của một metric tốt là gì?", opts: ["Con số càng lớn càng tốt, bất kể ý nghĩa", "Đo được bằng dữ liệu thật, gắn hành vi thật, có mốc so sánh", "Không cần mốc so sánh", "Chỉ cần trông ấn tượng khi trình bày"], correct: 1, why: "Metric tốt: đo được bằng dữ liệu thật, gắn hành vi thật, có mốc so sánh." },
  { part: "Phần A · Outcome & Metric", q: "Bạn không điền được cột Metric trong chuỗi Feature → Outcome → Metric. Điều đó báo hiệu gì?", opts: ["Tính năng chắc chắn tốt", "Nên build ngay rồi tính sau", "Outcome còn mơ hồ, cần làm rõ trước khi build", "Cần đổi sang một mô hình AI khác"], correct: 2, why: "Không điền được Metric = outcome còn mơ hồ, phải làm rõ trước khi build." },
  { part: "Phần A · Outcome & Metric", q: "Đâu là một OUTPUT (không phải outcome)?", opts: ["Tỉ lệ đổi trả giảm 15%", "Thời gian xử lý ticket rút ngắn", "Khách tìm được sản phẩm nhanh hơn", "\"Đã ra mắt tính năng gợi ý size\""], correct: 3, why: "\"Đã ra mắt tính năng\" là output; còn lại là outcome (thay đổi thực tế)." },
  { part: "Phần B · PII & Tuân thủ", q: "PII (thông tin định danh cá nhân) là gì?", opts: ["Bất kỳ thông tin nào giúp chỉ ra đúng một người cụ thể, trực tiếp hoặc khi kết hợp", "Chỉ gồm số CCCD", "Chỉ là dữ liệu đã công khai trên mạng", "Thông tin mô tả sản phẩm"], correct: 0, why: "PII là mọi thông tin chỉ ra được một người cụ thể, trực tiếp hoặc khi kết hợp." },
  { part: "Phần B · PII & Tuân thủ", q: "Vì sao dán dữ liệu vào AI công cộng lại rủi ro với PII?", opts: ["Vì AI công cộng luôn miễn phí", "Vì dữ liệu có thể bị lưu trên máy chủ, dùng để huấn luyện, hoặc bị truy cập ngoài tầm kiểm soát", "Vì AI công cộng chạy chậm", "Vì nó tốn nhiều token hơn"], correct: 1, why: "AI công cộng có thể lưu/huấn luyện/để nhân viên truy cập → dữ liệu ra ngoài tầm kiểm soát." },
  { part: "Phần B · PII & Tuân thủ", q: "Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15) có hiệu lực từ khi nào?", opts: ["01/07/2025", "01/01/2025", "01/01/2026", "Chưa có hiệu lực"], correct: 2, why: "Luật 91/2025/QH15 hiệu lực 01/01/2026 (cùng NĐ 356/2025/NĐ-CP)." },
  { part: "Phần B · PII & Tuân thủ", q: "Quy tắc nào ĐÚNG khi dùng AI với dữ liệu khách hàng?", opts: ["Được dán chat CSKH thật vào ChatGPT nếu đang vội", "Được đưa PII nếu chỉ dùng trong nội bộ nhóm", "Được đưa PII miễn là xóa sau khi dùng", "Không dán PII thật vào AI công cộng; nếu buộc phải xử lý thì ẩn danh hoá trước"], correct: 3, why: "Không dán PII thật vào AI công cộng; nếu buộc phải xử lý thì ẩn danh hoá trước." },
  { part: "Phần B · PII & Tuân thủ", q: "\"Ẩn danh hoá\" (anonymization) trước khi đưa dữ liệu vào AI nghĩa là gì?", opts: ["Thay/xóa tên, SĐT, địa chỉ, mã định danh bằng placeholder, chỉ giữ nội dung vấn đề", "Dịch dữ liệu sang tiếng Anh", "Nén file cho nhỏ lại", "Tăng temperature để AI \"quên\" dữ liệu"], correct: 0, why: "Ẩn danh hoá = thay/xóa PII bằng placeholder, giữ lại nội dung vấn đề để phân tích." },
  { part: "Phần B · PII & Tuân thủ", q: "Đâu là một nguyên tắc cốt lõi của Luật 91/2025/QH15 liên quan tới việc dùng AI?", opts: ["Được xử lý mọi dữ liệu miễn là có ích cho công ty", "Chỉ xử lý dữ liệu cá nhân khi có sự đồng ý và đúng mục đích đã đồng ý", "Dữ liệu cá nhân không cần bảo vệ nếu khách đã mua hàng", "Chỉ áp dụng cho công ty nước ngoài"], correct: 1, why: "Nguyên tắc cốt lõi: chỉ xử lý dữ liệu cá nhân khi có đồng ý và đúng mục đích." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "Vì sao hallucination được coi là \"hệ quả cấu trúc\" của LLM?", opts: ["Vì máy chủ quá tải", "Vì người dùng hỏi sai cách", "Vì LLM dự đoán ngôn ngữ theo xác suất, không tra cứu sự thật", "Vì temperature luôn được đặt cao"], correct: 2, why: "LLM dự đoán ngôn ngữ theo xác suất, không tra cứu sự thật → hallucination là hệ quả cấu trúc." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "AI trả về \"doanh số tăng 23%\" dù bạn chưa đưa số liệu nào vào. Bạn nên làm gì?", opts: ["Đưa luôn vào báo cáo vì nghe hợp lý", "Tăng temperature để kiểm tra lại", "Tin vì AI thường đúng", "Coi là giả định/bịa, đối chiếu nguồn thật trước khi dùng (grounding)"], correct: 3, why: "Không có nguồn = giả định/bịa; phải grounding (đối chiếu nguồn thật) trước khi dùng." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "Để tránh AI \"chiều ý\" (sycophancy), bạn nên hỏi thế nào?", opts: ["Hỏi trung tính, buộc AI nêu rủi ro và lý do có thể thất bại", "Hỏi \"ý tưởng này hay đúng không?\"", "Khen AI trước rồi mới hỏi", "Yêu cầu AI chỉ trả lời \"có\" hoặc \"không\""], correct: 0, why: "Hỏi trung tính, buộc AI nêu rủi ro để tránh sycophancy (AI chiều ý)." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "Ví dụ nào là bias (thiên kiến) trong output của AI?", opts: ["AI trả lời chậm hơn bình thường", "AI mặc định gợi ý kiểu dáng theo giới tính một cách rập khuôn", "AI dùng nhiều token hơn cho tiếng Việt", "AI trả lời bằng tiếng Anh"], correct: 1, why: "Gợi ý rập khuôn theo giới tính là bias; còn lại là hiệu năng/ngôn ngữ." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "Một feature AI đưa thông tin sai cho khách. Ai chịu trách nhiệm?", opts: ["Nhà cung cấp mô hình", "Không ai cả, \"tại AI\"", "Đội sản phẩm đưa AI vào feature — diligence thuộc về builder", "Khách hàng"], correct: 2, why: "Diligence thuộc về builder: đội đưa AI vào feature chịu trách nhiệm, không đổ \"tại AI\"." },
  { part: "Phần C · Hallucination/Bias/Diligence", q: "\"Điểm human-in-the-loop (HITL)\" nên được đặt ở đâu?", opts: ["Sau khi output đã tới tay khách hàng", "Không cần thiết nếu AI đủ mạnh", "Chỉ đặt khi đã có khách phàn nàn", "Trước hành động rủi ro cao/không thể hoàn tác (vd trước khi gửi email hàng loạt, đăng nội dung)"], correct: 3, why: "Đặt HITL trước hành động rủi ro cao/không thể hoàn tác." },
  { part: "Phần B+ · Bổ sung PII", q: "Đâu là dữ liệu KHÔNG phải PII nhưng vẫn KHÔNG được đưa vào AI công cộng?", opts: ["Tên + số điện thoại khách hàng", "Ảnh CCCD của nhân viên", "Câu hỏi \"cách viết mô tả SEO cho áo thun\"", "File doanh thu theo cửa hàng chưa công bố"], correct: 3, why: "Doanh thu theo cửa hàng chưa công bố không phải PII nhưng là bí mật kinh doanh → vẫn cấm." },
  { part: "Phần B+ · Bổ sung PII", q: "Một đoạn dữ liệu đã xóa tên nhưng vẫn còn số điện thoại + địa chỉ + mã đơn. Nhận định nào ĐÚNG?", opts: ["Vẫn định danh được một người (quasi-identifier) → chưa an toàn, phải ẩn cả tổ hợp", "Đã an toàn vì không còn tên", "Chỉ cần xóa thêm email là đủ an toàn", "Không còn được coi là PII nữa"], correct: 0, why: "SĐT + địa chỉ + mã đơn là quasi-identifier, vẫn định danh được dù đã bỏ tên → phải ẩn cả tổ hợp." },
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
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--iris-deep)" strokeWidth="2.2">
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </svg>
);

const backIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m15 18-6-6 6-6" />
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

function Part1View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>Đ</span>
        ây là phân biệt nền tảng của tư duy sản phẩm — và cũng là câu khiến nhiều intern trượt: <b>làm xong một tính năng không có nghĩa là tạo ra giá trị.</b> Output chỉ là điều kiện cần; outcome mới là cái đích.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "26px 0" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>Output · Kết quả đầu ra</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Thứ bạn trực tiếp <i>làm ra</i>: &quot;đã xây xong chatbot&quot;, &quot;đã ra mắt gợi ý size&quot;, &quot;đã viết 50 mô tả&quot;. Đo bằng trạng thái <b>đã xong hay chưa</b>.</div>
        </div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "8px" }}>Outcome · Tác động thực tế</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}><i>Sự thay đổi có giá trị</i> output tạo ra: &quot;tỉ lệ đổi trả do sai size <b>giảm 15%</b>&quot;, &quot;thời gian khách tìm được sản phẩm <b>rút ngắn</b>&quot;.</div>
        </div>
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "26px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "7px 11px", borderRadius: "6px", whiteSpace: "nowrap" }}>OUTPUT</span>
              <span style={{ font: "14px/1.4 var(--font-body)", color: "var(--fg-2)" }}>✔ Đã build xong tính năng</span>
              <span style={{ flex: 1, height: "2px", background: "repeating-linear-gradient(90deg,var(--border) 0 6px,transparent 6px 12px)", minWidth: "30px" }} />
              <span style={{ font: "600 13px/1 var(--font-body)", color: "var(--fg-3)" }}>🏁 Hết. Dừng ở cột mốc.</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "7px 11px", borderRadius: "6px", whiteSpace: "nowrap" }}>OUTCOME</span>
              <span style={{ font: "14px/1.4 var(--font-body)", color: "var(--fg-2)" }}>Cùng tính năng → thay đổi thực tế</span>
              <span style={{ flex: 1, height: "2px", background: "var(--mint)", minWidth: "30px" }} />
              <span style={{ font: "700 13px/1 var(--font-body)", color: "var(--mint-deep)", whiteSpace: "nowrap" }}>↑ tỉ lệ đổi trả GIẢM 15%</span>
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — <b>Làm xong ≠ tạo ra giá trị.</b> Output dừng ở cột mốc; outcome mới đo bằng thay đổi thực tế.</figcaption>
      </figure>

      <Callout tone="iris" label="Ví dụ YODY · giả lập">
        <p style={{ margin: 0 }}>Đội build xong &quot;chatbot tư vấn size&quot; — đó là <b>output</b>. Nhưng sau 1 tháng, tỉ lệ đổi trả do sai size <i>không đổi</i>, khách vẫn nhắn CSKH hỏi size như cũ → <b>outcome = 0</b>. Tính năng &quot;chạy được&quot; nhưng không giải quyết vấn đề nào.</p>
      </Callout>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>ROI — giá trị thực so với chi phí bỏ ra</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>ROI (Return on Investment — tỷ suất hoàn vốn)</b> ở góc nhìn sản phẩm không nhất thiết là tiền, mà là <b>giá trị thu lại so với công sức/chi phí bỏ ra</b>. Không cần con số hoàn hảo — cần <b>thói quen hỏi &quot;có đáng không&quot;</b> trước khi lao vào build.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "6px" }}>Giá trị kỳ vọng</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Giảm chi phí vận hành, tăng chuyển đổi, giảm đổi trả, tiết kiệm thời gian nhân sự…</div>
        </div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "6px" }}>Chi phí bỏ ra</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Công build, chi phí token/API khi chạy thật, rủi ro, chi phí bảo trì.</div>
        </div>
      </div>
      <Callout tone="gold" label="Ví dụ YODY · giả lập">
        <p style={{ margin: 0 }}>&quot;AI tự sinh mô tả cho 5.000 sản phẩm&quot; — tiết kiệm ~200 giờ biên tập + nhất quán brand voice → <b>ROI cao</b>. Nhưng &quot;AI đổi màu nền ảnh theo mùa&quot; tốn công mà gần như không ảnh hưởng chuyển đổi → <b>ROI thấp, nên hoãn</b>.</p>
      </Callout>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Metric — đo outcome bằng gì</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 22px" }}>Một outcome chỉ có ý nghĩa khi <b>đo được</b>. Nhưng không phải metric nào cũng bằng nhau:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "8px" }}>Value metric · chỉ số giá trị</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Phản ánh giá trị thật: tỉ lệ đổi trả do sai size, tỉ lệ khách tìm được sản phẩm phù hợp, thời gian xử lý một ticket CSKH.</div>
        </div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>Vanity metric · chỉ số phù phiếm</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Trông đẹp nhưng không phản ánh giá trị: &quot;số lượt click chatbot&quot;, &quot;số câu AI đã trả lời&quot;. Click nhiều có thể vì nó <i>gây khó chịu</i>.</div>
        </div>
      </div>
      <p style={{ font: "italic 600 18px/1.6 var(--font-body)", color: "var(--fg-1)", margin: "0 0 18px", borderLeft: "3px solid var(--fg-1)", paddingLeft: "16px" }}>Câu hỏi lọc: &quot;Nếu chỉ số này tăng mà mọi thứ khác giữ nguyên, YODY có thật sự tốt lên không?&quot; Không chắc → nhiều khả năng là vanity metric.</p>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff" }}>
        <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "10px" }}>Một metric tốt cần 3 điều</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", padding: "10px 12px", borderRadius: "8px" }}><b>1. Đo được</b> bằng dữ liệu bạn thực sự có.</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", padding: "10px 12px", borderRadius: "8px" }}><b>2. Gắn hành vi thật</b>, không dễ &quot;làm đẹp&quot;.</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", padding: "10px 12px", borderRadius: "8px" }}><b>3. Có mốc so sánh</b> (trước/sau, hoặc so nhóm).</div>
        </div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Chuỗi Feature → Outcome → Metric</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Công cụ tư duy trung tâm của buổi, và cũng là xương sống của deliverable Gate 1. Với mọi tính năng, điền đủ ba mắt xích:</p>
      <div style={{ display: "flex", alignItems: "stretch", gap: "10px", margin: "0 0 22px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "140px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "6px" }}>FEATURE</div>
          <div style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Làm gì</div>
        </div>
        <div style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "22px" }}>→</div>
        <div style={{ flex: 1, minWidth: "140px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "6px" }}>OUTCOME</div>
          <div style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Thay đổi gì, cho ai</div>
        </div>
        <div style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "22px" }}>→</div>
        <div style={{ flex: 1, minWidth: "140px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "6px" }}>METRIC</div>
          <div style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Đo bằng chỉ số nào</div>
        </div>
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", background: "var(--bg-ink)" }}>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Feature</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Outcome (cho ai)</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Metric (value)</span>
        </div>
        {CHAIN.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
            <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", fontWeight: 600 }}>{r.f}</span>
            <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.o}</span>
            <span style={{ padding: "12px 16px", font: "14px/1.5 var(--font-body)", color: "var(--iris-deep)" }}>{r.m}</span>
          </div>
        ))}
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "16px 0 0" }}>Không điền được cột <b style={{ color: "var(--fg-1)" }}>Metric</b> = tín hiệu outcome còn mơ hồ, cần làm rõ trước khi build. Nếu Metric bạn điền là vanity → hỏi lại &quot;tăng lên thì YODY có thật sự tốt hơn không&quot;.</p>

      <TldrDark
        items={[
          <><b>Output</b> là thứ làm ra; <b>Outcome</b> là thay đổi thực tế nó tạo ra. Làm xong tính năng ≠ tạo ra giá trị.</>,
          <>Luôn ước lượng <b>ROI</b> (giá trị so với chi phí) và chọn <b>value metric</b> thay vì vanity metric.</>,
          <>Với mọi tính năng, điền đủ chuỗi <b>Feature → Outcome → Metric</b>; không điền được Metric nghĩa là outcome còn mơ hồ.</>,
        ]}
      />

      <SelfCheck
        items={[
          "Cho một tính năng bạn biết ở YODY: đâu là output, đâu là outcome?",
          "Phân biệt một value metric và một vanity metric cho tính năng \"chatbot tư vấn size\".",
          "Vì sao \"số lượt click vào chatbot\" có thể là vanity metric?",
          "Điền chuỗi Feature → Outcome → Metric cho một tính năng bạn tự nghĩ ra.",
        ]}
      />
    </div>
  );
}

function Part2View() {
  return (
    <div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", display: "flex", gap: "14px", alignItems: "flex-start" }}>
        <span style={{ color: "var(--rose-deep)", flex: "none", fontSize: "20px" }}>⚠️</span>
        <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>
          <b>Quy tắc tuân thủ bắt buộc (NL7 — must-pass).</b> Nội dung dưới đây tóm tắt tinh thần quy định để áp dụng trong công việc, <b>không thay thế tư vấn pháp lý</b>; tình huống phức tạp phải hỏi bộ phận dữ liệu/pháp chế YODY.
        </p>
      </div>

      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>K</span>
        hi bạn dán một đoạn văn bản vào công cụ AI <b>công cộng</b> (ChatGPT, Claude.ai, Gemini bản web…), dữ liệu đó <b>rời khỏi tầm kiểm soát của YODY</b>. Tùy điều khoản dịch vụ, nó có thể bị:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", margin: "0 0 26px" }}>
        <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--rose-deep)", marginBottom: "6px" }}>☁</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Lưu trên <b>máy chủ</b> nhà cung cấp ở nước ngoài</div>
        </div>
        <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--rose-deep)", marginBottom: "6px" }}>⟳</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>Dùng để <b>huấn luyện</b> mô hình tương lai</div>
        </div>
        <div style={{ padding: "16px", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", textAlign: "center" }}>
          <div style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--rose-deep)", marginBottom: "6px" }}>👁</div>
          <div style={{ font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}><b>Nhân viên</b> nhà cung cấp truy cập trong một số điều kiện</div>
        </div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>PII là gì</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>
        <b>PII (Personally Identifiable Information — thông tin định danh cá nhân)</b> là bất kỳ thông tin nào gắn liền hoặc giúp xác định <i>một con người cụ thể</i>, trực tiếp hoặc khi kết hợp lại.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>Trực tiếp</div>
          <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Họ tên, số điện thoại, email, số CCCD/hộ chiếu, địa chỉ nhà, số tài khoản ngân hàng, khuôn mặt trong ảnh.</div>
        </div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "8px" }}>Gián tiếp / khi kết hợp</div>
          <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Mã đơn + ngày mua + địa chỉ giao; lịch sử chat kèm tên; dữ liệu vị trí. Nhạy cảm hơn: sức khỏe, tôn giáo, dữ liệu trẻ em.</div>
        </div>
      </div>
      <p style={{ font: "italic 600 18px/1.6 var(--font-body)", color: "var(--fg-1)", margin: "0 0 26px", borderLeft: "3px solid var(--fg-1)", paddingLeft: "16px" }}>
        Nhận diện nhanh: nếu một mẩu dữ liệu có thể giúp ai đó <i>chỉ ra đúng một người</i>, hãy coi đó là PII.
      </p>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--rose-deep)", margin: "30px 0 12px" }}>Chỉ ẩn họ tên là CHƯA đủ — định danh gián tiếp (quasi-identifier)</h3>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>
        Lỗi phổ biến nhất: nghĩ rằng xóa tên là an toàn. Sai. Một <b>tổ hợp</b> các trường tưởng vô hại vẫn định danh được một người:
      </p>
      <div style={{ margin: "0 0 16px", padding: "16px 20px", background: "#fff", border: "1px solid var(--rose-deep)", borderRadius: "12px", font: "14px/1.7 var(--font-mono)", color: "var(--fg-1)" }}>
        &quot;0912 345 xxx · Số 5 ngõ 10 Kim Mã · đơn YD2026-08841 · <span style={{ color: "var(--rose-deep)" }}>l***@gmail.com</span>&quot;
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>
        Không có tên, nhưng tổ hợp <b>SĐT + địa chỉ + mã đơn + email</b> chỉ khớp đúng một người khi đối chiếu hệ thống. Quy tắc bắt buộc: <b style={{ color: "var(--fg-1)" }}>phải ẩn toàn bộ tổ hợp trường có khả năng liên kết nhận diện</b>, tuyệt đối không chỉ ẩn mỗi họ tên.
      </p>

      <Callout tone="gold" label="Bí mật kinh doanh ≠ PII — nhưng cũng CẤM">
        <p style={{ margin: 0 }}>
          <b>Doanh thu, tồn kho, lương, tài chính nội bộ chưa công bố</b> <i>không phải</i> PII, nhưng là <b>bí mật kinh doanh</b> — cũng không được đưa vào AI công cộng. Câu hỏi lọc kép: &quot;Dữ liệu này có chỉ ra được một người không? Hoặc có phải số liệu mật của YODY không?&quot; — dính một trong hai thì không đưa vào khi chưa xử lý.
        </p>
      </Callout>

      <figure style={{ margin: "30px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "140px", border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "14px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "8px" }}>DỮ LIỆU KHÁCH</div>
            <div style={{ font: "12px/1.7 var(--font-body)", color: "var(--fg-1)" }}>họ tên · SĐT<br />địa chỉ · mã đơn</div>
          </div>
          <div style={{ flex: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "4px", height: "64px", background: "var(--rose-deep)", borderRadius: "2px" }} />
            <span style={{ font: "700 9px/1.2 var(--font-mono)", color: "var(--rose-deep)", textAlign: "center", maxWidth: "70px" }}>RANH GIỚI CỨNG<br />⛔ KHÔNG vượt</span>
          </div>
          <div style={{ flex: 1, minWidth: "120px", border: "1px dashed var(--fg-3)", borderRadius: "10px", background: "var(--bg-warm)", padding: "14px 16px", textAlign: "center" }}>
            <div style={{ font: "26px/1 var(--font-body)", marginBottom: "6px" }}>☁</div>
            <div style={{ font: "700 13px/1.3 var(--font-body)", color: "var(--fg-2)" }}>AI công cộng</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Không đưa PII/bí mật KD thật vào công cụ AI công cộng.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Khung pháp lý tại Việt Nam</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        Từ <b>01/01/2026</b>, <b>Luật Bảo vệ dữ liệu cá nhân (Luật 91/2025/QH15)</b> và <b>Nghị định 356/2025/NĐ-CP</b> có hiệu lực. Ba nguyên tắc cốt lõi liên quan trực tiếp tới việc bạn dùng AI:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>1</span>
          <div>
            <b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>Có sự đồng ý &amp; đúng mục đích</b>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Dữ liệu cá nhân chỉ được xử lý khi chủ thể đồng ý, và chỉ dùng đúng mục đích đã đồng ý.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>2</span>
          <div>
            <b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>Không chuyển giao trái phép</b>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Dán vào AI công cộng nước ngoài có thể bị xem là chuyển giao dữ liệu trái phép.</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
          <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--rose-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>3</span>
          <div>
            <b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>Trách nhiệm giải trình</b>
            <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>Tổ chức phải kiểm soát và chứng minh được mình xử lý dữ liệu đúng quy định.</div>
          </div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-3)", margin: "0 0 8px", fontStyle: "italic" }}>
        Vai trò intern: không cần thuộc điều luật, nhưng <b style={{ color: "var(--fg-2)" }}>phải nắm ranh giới hành vi</b> ở phần dưới.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Ranh giới cứng &amp; 4 quy tắc thực hành</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 24px" }}>
        <div style={{ border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "4px" }}>Quy tắc 1 — Dữ liệu học tập là giả lập</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Toàn bộ dữ liệu trong bài tập/lab/demo của chương trình là giả lập, không phải dữ liệu thật của YODY.</div>
        </div>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "4px" }}>Quy tắc 2 — Không đưa PII thật lên AI công cộng</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Tuyệt đối cấm dán review chứa tên khách, ảnh CCCD/hộ chiếu, chat CSKH thật kèm thông tin cá nhân, file đơn hàng có họ tên/địa chỉ vào ChatGPT/Claude.ai/Gemini bản công cộng.</div>
        </div>
        <div style={{ border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "4px" }}>Quy tắc 3 — Ẩn danh hoá trước khi dùng</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Nếu buộc phải xử lý dữ liệu có PII bằng AI, phải ẩn danh hoá trước: xóa/thay tên, SĐT, địa chỉ, mã định danh bằng placeholder. Chỉ đưa vào phần đã sạch PII.</div>
        </div>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "4px" }}>Quy tắc 4 — Ưu tiên công cụ nội bộ được duyệt</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Với hệ thống AI nội bộ/được phê duyệt, tuân thủ hướng dẫn riêng về loại dữ liệu được phép. Khi nghi ngờ, hỏi trước khi dán.</div>
        </div>
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--fg-1)", margin: "30px 0 12px" }}>Bảng nhanh: được / không được đưa vào AI công cộng</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "11px 16px", background: "var(--mint-tint)", font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)" }}>✅ Được đưa vào</div>
          <div style={{ padding: "6px 0" }}>
            {ALLOW.map((x, i) => (
              <div key={i} style={{ padding: "9px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>{x}</div>
            ))}
          </div>
        </div>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ padding: "11px 16px", background: "var(--rose-tint)", font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)" }}>❌ Không được đưa vào</div>
          <div style={{ padding: "6px 0" }}>
            {DENY.map((x, i) => (
              <div key={i} style={{ padding: "9px 16px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", borderTop: i === 0 ? "none" : "1px solid var(--border)" }}>{x}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--bg-warm)", border: "1px dashed var(--fg-3)", borderRadius: "12px", font: "14px/1.7 var(--font-body)", color: "var(--fg-2)" }}>
        <b style={{ color: "var(--fg-1)" }}>Vùng xám cần tư duy:</b> &quot;số tồn kho tổng hợp theo nhóm hàng, đã làm tròn, không gắn cửa hàng&quot; → ✅ được. Gắn tên cửa hàng cụ thể &amp; chưa công bố → ❌ (bí mật KD). Điều kiện &quot;đã tổng hợp/ẩn danh&quot; biến dữ liệu từ cấm sang an toàn.
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--fg-1)", margin: "30px 0 12px" }}>Ẩn danh hoá trông như thế nào (giả lập)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "10px" }}>TRƯỚC · có PII (không dán)</div>
          <div style={{ font: "14px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
            &quot;Chị <span style={{ background: "#fff", borderRadius: "3px", padding: "0 3px" }}>Nguyễn Thị Lan</span>, <span style={{ background: "#fff", borderRadius: "3px", padding: "0 3px" }}>0901234567</span>, nhà ở <span style={{ background: "#fff", borderRadius: "3px", padding: "0 3px" }}>12 Lê Lợi</span>, phàn nàn áo lỗi khóa kéo, đơn <span style={{ background: "#fff", borderRadius: "3px", padding: "0 3px" }}>#YD88231</span>.&quot;
          </div>
        </div>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "10px" }}>SAU · đã ẩn danh (an toàn)</div>
          <div style={{ font: "14px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
            &quot;Khách hàng <b>[KH_01]</b> phàn nàn áo giao bị lỗi khóa kéo, đơn <b>[ĐƠN_A]</b>.&quot;
          </div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}>
        Nội dung vấn đề (lỗi khóa kéo) được giữ để phân tích; danh tính bị loại bỏ. Bạn vẫn rút được insight mà không đụng ranh giới cứng.
      </p>

      <TldrDark
        items={[
          <>Dán dữ liệu vào <b>AI công cộng</b> = dữ liệu có thể bị lưu/huấn luyện/truy cập ngoài tầm kiểm soát → rủi ro lộ PII.</>,
          <>Chặn <b>hai loại</b>: <b>PII</b> (định danh con người) và <b>bí mật kinh doanh</b>. Luật 91/2025/QH15 (hiệu lực 01/01/2026) yêu cầu đồng ý, đúng mục đích, không chuyển giao trái phép.</>,
          <>Ranh giới cứng: không dán PII/bí mật KD thật; nếu buộc phải xử lý, <b>ẩn danh hoá cả tổ hợp trường định danh</b> — không chỉ ẩn tên.</>,
        ]}
      />

      <SelfCheck
        items={[
          "Kể 5 loại thông tin được coi là PII.",
          "Vì sao dán chat CSKH thật (có tên, SĐT khách) vào ChatGPT công cộng là vi phạm ranh giới cứng?",
          "Cho một đoạn dữ liệu có PII, viết lại bản đã ẩn danh hoá vẫn giữ được nội dung vấn đề.",
          "Ba nguyên tắc cốt lõi của Luật 91/2025/QH15 liên quan tới việc bạn dùng AI là gì?",
          "File Excel doanh thu theo cửa hàng (chưa công bố) có phải PII không? Có được đưa vào ChatGPT công cộng không? Vì sao?",
          "Vì sao \"chỉ ẩn tên\" là chưa đủ? Cho một ví dụ tổ hợp trường vẫn định danh được dù đã bỏ tên.",
        ]}
      />
    </div>
  );
}

function Part3View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--rose-deep)", padding: "6px 12px 0 0" }}>Ở</span>
        buổi I1.1 bạn đã biết AI có thể &quot;bịa&quot; (hallucination). Phần này chuyển hiểu biết đó thành <b>quy tắc hành nghề</b>: coi giới hạn độ tin cậy của AI như một ràng buộc thiết kế, và hiểu rằng trách nhiệm kiểm chứng cuối cùng luôn thuộc về <b>người xây dựng sản phẩm (builder)</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>Hallucination — ràng buộc độ tin cậy, không phải lỗi ngẫu nhiên</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>Ảo giác (Hallucination)</b> là việc AI tạo ra nội dung nghe rất logic, thuyết phục nhưng <b>hoàn toàn sai sự thật</b> — bịa số liệu, bịa tên sản phẩm, trích nguồn không tồn tại. Gốc rễ từ I1.1: AI <i>chỉ dự đoán ngôn ngữ theo xác suất</i>, không tự tra cứu thực tế → đây là <b>hệ quả từ bản chất cấu trúc của LLM</b>, không phải sự cố ngẫu nhiên. Nó luôn tồn tại ở mức độ nào đó.
      </p>
      <Callout tone="iris" label="Nguyên tắc Grounding — truy xuất nguồn gốc">
        <p style={{ margin: 0 }}>Mọi nhận định/số liệu quan trọng do AI tạo ra phải <b>truy được về nguồn gốc</b> (dữ liệu thật, tài liệu chính thức) trước khi dùng cho quyết định. Nếu một khẳng định <i>không truy được nguồn</i> → coi là <b>giả định</b>, không phải sự thật.</p>
      </Callout>
      <Callout tone="gold" label="Ví dụ YODY · giả lập">
        <p style={{ margin: 0 }}>Nhờ AI &quot;tóm tắt doanh số áo khoác quý này&quot;. AI trả về <i>&quot;tăng 23% so với quý trước&quot;</i> — nghe gọn. Nhưng nếu bạn <i>không hề đưa số liệu vào</i>, con số 23% gần như chắc chắn là bịa. Không bao giờ đưa loại số này vào báo cáo mà chưa đối chiếu nguồn thật.</p>
      </Callout>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--rose-deep)", margin: "30px 0 12px" }}>Hallucination trong ngành thời trang — không phải chuyện học thuật</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 24px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>Gán chứng nhận kỹ thuật không có thật</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Nhờ AI viết mô tả áo polo, nó tự tin thêm <i>&quot;đạt chuẩn chống tia UV UPF 50+&quot;</i>. Nếu áo không có chứng nhận đó và bạn đăng lên web → <b>quảng cáo sai sự thật</b>, rủi ro pháp lý thuộc về đội product, không phải AI.</div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 20px" }}>
          <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>&quot;Insight ma&quot;</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Nhờ AI tóm tắt 30 review, nó viết <i>&quot;khách rất hài lòng với khóa kéo&quot;</i> — nhưng không review nào nhắc khóa kéo. Nếu bạn dựa vào đó để giữ nguyên thiết kế mùa sau, quyết định đứng trên một insight không tồn tại.</div>
        </div>
      </div>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--fg-1)", margin: "30px 0 12px" }}>Demo grounding: cùng câu hỏi, hai cách hỏi</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "10px" }}>Cách 1 — không cấp dữ liệu</div>
          <div style={{ font: "13px/1.7 var(--font-mono)", color: "var(--fg-1)", background: "#fff", borderRadius: "8px", padding: "11px 13px", marginBottom: "8px" }}>&quot;T5/2026 Yody Cầu Giấy bán bao nhiêu áo polo, tăng giảm thế nào?&quot;</div>
          <div style={{ font: "13px/1.6 var(--font-body)", color: "var(--rose-deep)" }}>→ &quot;…bán <b>1.247 áo, tăng 18%</b>…&quot; — con số <b>bịa hoàn toàn</b>.</div>
        </div>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "10px" }}>Cách 2 — cấp dữ liệu + buộc bám nguồn</div>
          <div style={{ font: "13px/1.7 var(--font-mono)", color: "var(--fg-1)", background: "#fff", borderRadius: "8px", padding: "11px 13px", marginBottom: "8px" }}>&quot;CHỈ trả lời dựa trên bảng sau. Không có thì trả lời &apos;Dữ liệu không có&apos;… Cầu Giấy: T4 280 · T5 312&quot;</div>
          <div style={{ font: "13px/1.6 var(--font-body)", color: "var(--mint-deep)" }}>→ &quot;Cầu Giấy: T5 312, T4 280, <b>tăng ~11,4%</b>.&quot; Hỏi cửa hàng không có → &quot;Dữ liệu không có.&quot;</div>
        </div>
      </div>
      <p style={{ font: "italic 600 18px/1.6 var(--font-body)", color: "var(--fg-1)", margin: "0 0 8px", borderLeft: "3px solid var(--fg-1)", paddingLeft: "16px" }}>
        Cùng một mô hình — lần đầu bịa, lần sau đúng. Khác biệt duy nhất: bạn cấp dữ liệu và buộc AI bám nguồn. Đó là grounding, và đó là trách nhiệm của builder.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Sycophancy — AI đồng thuận vô điều kiện</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        AI thường <b>đồng tình với cách bạn đặt câu hỏi</b>. Hỏi mớm — &quot;Tính năng này hay đúng không?&quot; — nó dễ trả về lời khen rỗng, củng cố điều bạn <i>muốn nghe</i> thay vì sự thật. Cách của builder: <b>hỏi trung tính và buộc AI phản biện.</b>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "8px" }}>✕ Hỏi mớm</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Ý tưởng này tốt chứ?&quot;</div>
        </div>
        <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
          <div style={{ font: "700 12px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "8px" }}>✓ Hỏi trung tính</div>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Nêu 3 rủi ro và 3 lý do ý tưởng này có thể thất bại.&quot; Yêu cầu AI đưa bằng chứng, không chỉ kết luận.</div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}>
        Đừng để AI hoạt động như một <b>buồng vọng âm (echo chamber)</b> — chỉ lặp lại và đồng tình sáo rỗng với giả định ban đầu của bạn. (Đào sâu ở I2.3 — Critical Thinking.)
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Bias — thiên kiến trong dữ liệu và đầu ra</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>Thiên kiến (Bias)</b> là hiện tượng output của AI bị lệch một cách có hệ thống, thường vì dữ liệu huấn luyện phản ánh thiên kiến của con người/xã hội. Ví dụ: AI mặc định gợi ý kiểu dáng theo giới tính một cách rập khuôn. Ở mức này cần nhận diện được:
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Output có đang <b>áp đặt giả định rập khuôn</b> (giới tính, vùng miền, độ tuổi) không?</div>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
          <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Dữ liệu bạn đưa vào có <b>đại diện đủ</b> cho tập khách hàng thật của YODY không, hay chỉ một nhóm?</div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-3)", margin: "0 0 8px", fontStyle: "italic" }}>
        Chưa cần xử lý bias ở cấp hệ thống (đó là L3+), nhưng <b style={{ color: "var(--fg-2)" }}>phải nêu được rủi ro bias</b> khi nó xuất hiện trong sản phẩm mình làm.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>Diligence — trách nhiệm cuối cùng thuộc về Builder</h2>
      <p style={{ font: "italic 600 22px/1.5 var(--font-serif)", color: "var(--fg-1)", margin: "0 0 18px" }}>
        Nếu output được phát hành dưới danh nghĩa sản phẩm, đội đó chịu hoàn toàn trách nhiệm — không thể đổ lỗi &quot;tại AI&quot;.
      </p>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>
        Diligence ở mức thực hành gồm: <b>kiểm số liệu &amp; nguồn</b> (grounding); thiết lập <b>chốt kiểm duyệt bởi con người (Human-in-the-loop — HITL)</b> tại điểm chạm rủi ro cao (trước khi gửi email hàng loạt, đăng nội dung); và giữ <b>sạch PII</b> — không đánh đổi để lấy tốc độ. Lớp kiểm soát bao quanh AI này gọi là <b>trust layer</b> (thiết lập cụ thể ở I4.2).
      </p>

      <h3 style={{ font: "700 20px/1.3 var(--font-brand)", color: "var(--fg-1)", margin: "30px 0 12px" }}>4 rủi ro → 4 hàng rào kiểm soát</h3>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 26px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.4fr", background: "var(--bg-ink)" }}>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Rủi ro</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Bản chất</span>
          <span style={{ padding: "11px 16px", font: "700 12px/1.3 var(--font-mono)", color: "#cdd0ee" }}>Hàng rào kiểm soát</span>
        </div>
        {RISKS.map((r, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr 1.4fr", borderTop: "1px solid var(--border)", background: "#fff" }}>
            <span style={{ padding: "12px 16px", font: "600 14px/1.5 var(--font-body)", color: r.c }}>{r.risk}</span>
            <span style={{ padding: "12px 16px", font: "13px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.what}</span>
            <span style={{ padding: "12px 16px", font: "13px/1.5 var(--font-body)", color: "var(--fg-1)" }}>{r.guard}</span>
          </div>
        ))}
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 13px/1.3 var(--font-body)", color: "var(--fg-2)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "10px 14px", borderRadius: "10px" }}>AI sinh output</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 13px/1.3 var(--font-body)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "10px 14px", borderRadius: "10px", textAlign: "center" }}>
            👤 Người kiểm (HITL)
            <br />
            <span style={{ font: "400 11px/1.4 var(--font-body)", color: "var(--fg-2)" }}>đúng số liệu? · có nguồn? · sạch PII?</span>
          </span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 13px/1.3 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "10px 14px", borderRadius: "10px" }}>Tới khách hàng</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — AI không gánh trách nhiệm thay bạn; builder chịu trách nhiệm cuối.</figcaption>
      </figure>

      <TldrDark
        items={[
          <><b>Hallucination</b> là hệ quả cấu trúc của LLM → mọi dữ kiện quan trọng phải <b>grounding (truy nguồn)</b>; không có nguồn = giả định.</>,
          <><b>Sycophancy</b> khiến AI chiều ý bạn → hỏi trung tính, buộc AI phản biện; <b>bias</b> cần được nhận diện và nêu rủi ro.</>,
          <><b>Diligence</b> thuộc về builder: kiểm nguồn, đặt điểm human-in-the-loop, giữ sạch PII — AI không gánh trách nhiệm thay bạn.</>,
        ]}
      />

      <div style={{ margin: "0 0 30px", padding: "22px 26px", border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--gold-deep)", marginBottom: "4px" }}>Đã nắm NL1 (Outcome) + NL7 (PII) ⛳</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Hoàn tất buổi bằng bài nộp Gate 1 và Final Exam 22 câu.</div>
        </div>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); go("gate"); }}
          className="cta cta-primary"
          style={{ height: "44px", padding: "0 24px", font: "600 14px/44px var(--font-body)", textDecoration: "none", background: "var(--gold-deep)", border: "1px solid var(--gold-deep)", color: "#fff", borderRadius: "8px", display: "inline-flex", alignItems: "center" }}
        >
          Sang Gate 1 →
        </a>
      </div>

      <SelfCheck
        items={[
          "Vì sao hallucination là \"hệ quả cấu trúc\" chứ không phải lỗi ngẫu nhiên?",
          "Viết lại câu hỏi mớm \"Ý tưởng chatbot này hay chứ?\" thành một câu hỏi trung tính buộc AI phản biện.",
          "Cho một ví dụ bias có thể xuất hiện khi AI gợi ý sản phẩm cho khách YODY.",
          "\"Diligence thuộc về builder\" nghĩa là gì khi một feature AI đưa ra thông tin sai cho khách?",
        ]}
      />
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I1.2">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevron}
        <span>Giai đoạn 1 · Tuần 1–4</span>
        {chevron}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I1.2 · Gate 1</span>
      </div>

      <div className="i12-overview-grid" style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I1.2 · Level L1 → L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Buổi Gate 1</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Outcome Thinking &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Tuân thủ PII</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            I1.1 dạy bạn AI <em style={{ fontStyle: "italic" }}>hoạt động</em> thế nào. I1.2 dạy hai thứ quyết định bạn có phải một Product Builder đáng tin hay không: <b style={{ color: "var(--fg-1)" }}>làm đúng việc đáng làm</b> (output vs outcome) và <b style={{ color: "var(--fg-1)" }}>làm an toàn</b> (không lộ dữ liệu cá nhân). Cả NL1 và NL7 đều là tiêu chí bắt buộc để tốt nghiệp.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~50</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>3</b> phần đọc + Gate</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Đây là hai lý do khiến một tính năng dù <b style={{ color: "var(--fg-1)" }}>"chạy tốt" về kỹ thuật vẫn có thể bị đánh giá trượt</b> tại YODY: hoặc vì nó không tạo ra giá trị thực tế đo lường được, hoặc vì nó vi phạm quy định bảo mật dữ liệu. Buổi này biến hai ranh giới đó thành thói quen làm việc.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~50 phút</span>
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
              <div style={{ width: "52px", height: "52px", borderRadius: "12px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: "26px" }}>⛳</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Bài nộp bắt buộc · đánh giá NL1 + NL7</div>
                <h3 style={{ font: "700 23px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 8px" }}>Gate 1 — Deliverable cuối chặng Nền tảng</h3>
                <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>
                  Viết 1 trang cho một tính năng AI: Outcome · Metric · Giới hạn AI · Dữ liệu PII không được dùng. Kèm bài drill phân loại 10 thẻ dữ liệu &amp; bài mẫu đạt rubric. Qua Gate cần deliverable <b style={{ color: "var(--fg-1)" }}>đạt rubric</b> và Final Exam <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/22</b>.
                </p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); go("gate"); }}
                className="cta cta-primary"
                style={{ height: "44px", padding: "0 24px", font: "600 14px/44px var(--font-body)", textDecoration: "none", alignSelf: "center", background: "var(--gold-deep)", border: "1px solid var(--gold-deep)", color: "#fff", borderRadius: "8px", display: "inline-flex", alignItems: "center" }}
              >
                Xem đề Gate 1 →
              </a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{examIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 22 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang I2.1 (~22 phút). Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/22 ({PASS_PCT})</b> kết hợp Gate 1 đạt → qua Gate 1.</p>
              </div>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); go("exam"); }}
                className="cta"
                style={{ height: "42px", padding: "0 22px", font: "600 14px/42px var(--font-body)", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)", borderRadius: "8px", display: "inline-flex", alignItems: "center" }}
              >
                Làm bài test →
              </a>
            </div>
          </section>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Phải biết (must-pass)</div>
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
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Trust layer &amp; thiết lập human-in-the-loop chi tiết học ở I4.2; sycophancy &amp; critical thinking đào sâu ở I2.3.</p>
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
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); go("read", 0); }}
                className="cta cta-primary"
                style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", boxSizing: "border-box", height: "46px", font: "600 15px/1 var(--font-body)", textDecoration: "none", background: "var(--iris-deep)", border: "1px solid var(--iris-deep)", color: "#fff", borderRadius: "8px", marginTop: "20px" }}
              >
                Bắt đầu · Phần 1
              </a>
              <div style={{ textAlign: "center", font: "13px/1.4 var(--font-body)", color: "var(--fg-3)", marginTop: "12px" }}>Công khai · không cần đăng nhập</div>
            </div>
          </div>
          <div style={{ border: "1px dashed var(--border)", borderRadius: "12px", padding: "18px 20px", background: "var(--gold-tint)" }}>
            <div style={{ font: "700 12px/1.3 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "6px" }}>Điều kiện qua Gate 1</div>
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Deliverable Gate 1 <b style={{ color: "var(--fg-1)" }}>đạt rubric</b> + Final Exam <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/22</b> → sang <b style={{ color: "var(--fg-1)" }}>I2.1 — Prompt Engineering</b>.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ReadScreen({ state, go }: { state: LessonState; go: (p: Page, part?: number) => void }) {
  const cur = PART_META[state.part];

  const toc = PART_META.map((m, i) => ({
    n: m.n,
    title: m.short,
    time: m.time,
    c: m.c,
    active: i === state.part,
  }));

  const prevArr: { title: string; open: () => void }[] = [
    { title: "Tổng quan buổi", open: () => go("overview") },
    { title: "Output vs Outcome & Metric", open: () => go("read", 0) },
    { title: "PII & Tuân thủ dữ liệu", open: () => go("read", 1) },
  ];
  const nextArr: { title: string; kicker: string; color: string; open: () => void }[] = [
    { title: "PII & Tuân thủ dữ liệu", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 1) },
    { title: "Hallucination & Diligence", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 2) },
    { title: "Gate 1 — Bài nộp →", kicker: "HOÀN THÀNH · GATE", color: "var(--gold-deep)", open: () => go("gate") },
  ];

  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i12-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i12-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          {backIcon}Tổng quan buổi I1.2
        </a>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "14px" }}>Nội dung · 3 phần</div>
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--gold-deep)", background: "var(--gold-tint)" }}>
            <span style={{ color: "var(--gold-deep)", flex: "none", fontSize: "15px" }}>⛳</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Gate 1 — Bài nộp</span>
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{examIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Final Exam · 22 câu</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I1.2</a>
            {chevron}
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{cur.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "700 12px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: cur.cDeep, marginBottom: "12px" }}>
            <span>Phần {cur.n} / 3</span>
            <span style={{ opacity: ".4" }}>·</span>
            <span>{cur.time} đọc</span>
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

function GateScreen({ state, go, pickCard, toggleCards }: { state: LessonState; go: (p: Page, part?: number) => void; pickCard: (ci: number, val: boolean) => void; toggleCards: () => void }) {
  const cardsScore = CARD_DATA.reduce((acc, c, i) => acc + (state.cards[i] === c.ans ? 1 : 0), 0);
  const cursor = state.cardsRevealed ? "default" : "pointer";

  return (
    <div data-screen-label="Gate 1 · Bài nộp" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        {backIcon}Tổng quan buổi I1.2
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Bài nộp bắt buộc · NL1 + NL7</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>
        Gate 1 — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--gold-deep)" }}>Bài nộp</span> cuối chặng Nền tảng
      </h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px", maxWidth: "640px" }}>
        Qua Gate 1 cần: (a) deliverable này <b style={{ color: "var(--fg-1)" }}>đạt rubric</b>, và (b) Final Exam <b style={{ color: "var(--fg-1)" }}>đạt ≥{PASS_SCORE}/22</b>. Nộp cho mentor trước buổi I2.1.
      </p>

      <section style={{ marginTop: "36px", borderTop: "2px solid var(--fg-1)", paddingTop: "28px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", marginBottom: "8px" }}>
          <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: 0 }}>Khởi động — phân loại 10 thẻ dữ liệu</h2>
          <button onClick={toggleCards} className="cta" style={{ height: "38px", padding: "0 16px", font: "600 13px/38px var(--font-body)", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)", cursor: "pointer", borderRadius: "8px" }}>
            {state.cardsRevealed ? "Ẩn đáp án" : "Hiện đáp án"}
          </button>
        </div>
        <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px", maxWidth: "620px" }}>
          Với mỗi thẻ, chọn <b>✅ được</b> hay <b>❌ không được</b> đưa vào AI công cộng. Bấm "Hiện đáp án" để đối chiếu — thẻ vùng xám có ghi rõ điều kiện.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {CARD_DATA.map((c, i) => {
            const sel = state.cards[i];
            let border = "var(--border)";
            let bg = "#fff";
            let mark = "";
            let markColor = "transparent";
            let yesBg = "#fff";
            let yesBorder = "var(--border)";
            let yesFg = "var(--fg-2)";
            let noBg = "#fff";
            let noBorder = "var(--border)";
            let noFg = "var(--fg-2)";

            if (!state.cardsRevealed) {
              if (sel === true) { yesBg = "var(--iris-tint)"; yesBorder = "var(--iris)"; yesFg = "var(--iris-deep)"; }
              if (sel === false) { noBg = "var(--iris-tint)"; noBorder = "var(--iris)"; noFg = "var(--iris-deep)"; }
            } else {
              const ok = sel === c.ans;
              if (sel !== undefined) { mark = ok ? "✓" : "✕"; markColor = ok ? "var(--mint-deep)" : "var(--rose-deep)"; }
              border = ok ? "var(--mint)" : (sel !== undefined ? "var(--rose-deep)" : "var(--border)");
              bg = ok ? "var(--mint-tint)" : (sel !== undefined ? "var(--rose-tint)" : "#fff");
              if (c.ans === true) { yesBg = "var(--mint-tint)"; yesBorder = "var(--mint)"; yesFg = "var(--mint-deep)"; }
              else { noBg = "var(--mint-tint)"; noBorder = "var(--mint)"; noFg = "var(--mint-deep)"; }
            }

            return (
              <div key={i} style={{ border: `1.5px solid ${border}`, borderRadius: "12px", background: bg, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                  <span style={{ font: "italic 800 20px/1 var(--font-serif)", color: "var(--fg-3)", width: "26px", flex: "none" }}>{i + 1}</span>
                  <span style={{ flex: 1, minWidth: "180px", font: "15px/1.45 var(--font-body)", color: "var(--fg-1)" }}>{c.label}</span>
                  <div style={{ display: "flex", gap: "7px", flex: "none" }}>
                    <button
                      onClick={(e) => { e.preventDefault(); pickCard(i, true); }}
                      className="kh-opt"
                      style={{ height: "34px", padding: "0 13px", borderRadius: "8px", border: `1.5px solid ${yesBorder}`, background: yesBg, color: yesFg, font: "700 13px/1 var(--font-body)", cursor }}
                    >
                      ✅ Được
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); pickCard(i, false); }}
                      className="kh-opt"
                      style={{ height: "34px", padding: "0 13px", borderRadius: "8px", border: `1.5px solid ${noBorder}`, background: noBg, color: noFg, font: "700 13px/1 var(--font-body)", cursor }}
                    >
                      ❌ Không
                    </button>
                  </div>
                  <span style={{ font: "800 16px/1 var(--font-body)", color: markColor, flex: "none", width: "16px" }}>{mark}</span>
                </div>
                {state.cardsRevealed && (
                  <div style={{ marginTop: "11px", padding: "10px 13px", background: "var(--bg-warm)", borderRadius: "8px", font: "13px/1.6 var(--font-body)", color: "var(--fg-2)" }}>
                    <b style={{ color: c.ans ? "var(--mint-deep)" : "var(--rose-deep)" }}>{c.ans ? "✅ Được" : "❌ Không được"}</b> · {c.why}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {state.cardsRevealed && (
          <div style={{ marginTop: "14px", padding: "14px 18px", background: "var(--iris-tint)", borderRadius: "10px", font: "14px/1.7 var(--font-body)", color: "var(--iris-deep)" }}>
            Bạn đúng <b style={{ fontFamily: "var(--font-numeric)" }}>{cardsScore}</b>/10. <b>Điểm mấu chốt:</b> thẻ 5 dạy "bí mật kinh doanh ≠ PII nhưng vẫn cấm"; thẻ 10 dạy điều kiện "đã tổng hợp/ẩn danh" biến dữ liệu từ cấm sang an toàn.
          </div>
        )}
      </section>

      <section style={{ marginTop: "52px" }}>
        <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Đề bài</h2>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Chọn <b style={{ color: "var(--fg-1)" }}>một tính năng có dùng AI</b> — thật hoặc giả lập ở bối cảnh YODY. Viết <b style={{ color: "var(--fg-1)" }}>1 trang (~300–500 từ)</b> trả lời đủ 4 phần:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {BRIEF.map((b) => (
            <div key={b.n} style={{ display: "flex", gap: "16px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "18px 20px" }}>
              <span style={{ font: "italic 800 30px/1 var(--font-serif)", color: b.c, flex: "none", width: "34px" }}>{b.n}</span>
              <div>
                <div style={{ font: "700 17px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>{b.title}</div>
                <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "44px" }}>
        <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Rubric ĐẠT</h2>
        <p style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Bài <b style={{ color: "var(--fg-1)" }}>ĐẠT</b> khi có đủ <b>cả 4</b> mục; thiếu bất kỳ mục nào là <b>chưa đạt</b> (đặc biệt mục 4 — PII là ranh giới cứng).</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {RUBRIC.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "14px 18px" }}>
              <span style={{ color: "var(--mint-deep)", flex: "none" }}>{checkIcon}</span>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>{r.t}</b> — {r.d}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "14px", padding: "14px 18px", background: "var(--iris-tint)", borderRadius: "10px", font: "14px/1.6 var(--font-body)", color: "var(--iris-deep)" }}>
          <b>Mức tốt (stretch):</b> chuỗi Feature → Outcome → Metric mạch lạc, ROI được cân nhắc (đáng làm hay không), và điểm human-in-the-loop được chỉ rõ.
        </div>
      </section>

      <section style={{ marginTop: "44px" }}>
        <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Bài mẫu (giả lập · mức ĐẠT)</h2>
        <div style={{ border: "1px solid var(--fg-1)", borderRadius: "14px", background: "#fff", overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", background: "var(--bg-ink)", font: "700 14px/1.3 var(--font-brand)", color: "#fff" }}>Tính năng: Chatbot tư vấn chọn size trên trang sản phẩm YODY</div>
          <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "6px" }}>1 · OUTCOME</div>
              <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Giúp khách chọn đúng size ngay lần đầu, giảm số đơn bị đổi/trả vì sai size — lợi cho cả khách (đỡ phiền) và YODY (giảm chi phí logistics đổi trả).</div>
            </div>
            <div>
              <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "6px" }}>2 · METRIC</div>
              <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Tỉ lệ đổi/trả do "sai size" trên tổng đơn, đo <b>trước và sau</b> khi bật chatbot trong 8 tuần. Là value metric (gắn chi phí thật), không phải "số lượt mở chatbot".</div>
            </div>
            <div>
              <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "6px" }}>3 · GIỚI HẠN AI</div>
              <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>(a) <i>Hallucination</i> — chatbot có thể bịa bảng size → <b>grounding</b>: chỉ trả lời dựa trên bảng size chính thức nạp vào. (b) <i>Knowledge cutoff</i> — model không biết size sản phẩm mới → bơm dữ liệu sản phẩm hiện hành vào context.</div>
            </div>
            <div>
              <div style={{ font: "700 13px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "6px" }}>4 · DỮ LIỆU KHÔNG ĐƯỢC DÙNG (PII)</div>
              <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Không đưa số đo cơ thể thật kèm tên/SĐT khách vào AI công cộng. Nếu phân tích lịch sử tư vấn để cải tiến, phải <b>ẩn danh hoá</b> (thay tên/SĐT bằng [KH_01]) trước; chỉ giữ dữ liệu size ẩn danh.</div>
            </div>
          </div>
          <div style={{ padding: "14px 22px", background: "var(--mint-tint)", borderTop: "1px solid var(--mint)", font: "14px/1.6 var(--font-body)", color: "var(--mint-deep)" }}>Đủ 4 mục → <b>ĐẠT</b>. Nếu mục 2 ghi "đo bằng số lượt khách bấm chatbot" thì <b>chưa đạt</b> (vanity metric).</div>
        </div>
      </section>

      <div style={{ display: "flex", gap: "16px", marginTop: "44px", borderTop: "2px solid var(--fg-1)", paddingTop: "22px" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 2); }} className="kh-nav" style={{ flex: 1, textDecoration: "none" }}>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "5px" }}>← TRƯỚC</div>
          <div style={{ font: "700 16px/1.25 var(--font-impact)", color: "var(--fg-1)" }}>Phần 3 — Hallucination &amp; Diligence</div>
        </a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-nav" style={{ flex: 1, textAlign: "right", textDecoration: "none" }}>
          <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", marginBottom: "5px" }}>TIẾP THEO →</div>
          <div style={{ font: "700 16px/1.25 var(--font-impact)", color: "var(--iris-deep)" }}>Final Exam · 22 câu</div>
        </a>
      </div>
    </div>
  );
}

function ExamScreen({ state, go, pick, submit, reset }: { state: LessonState; go: (p: Page) => void; pick: (qi: number, oi: number) => void; submit: () => void; reset: () => void }) {
  const score = EXAM.reduce((acc, Q, qi) => acc + (state.answers[qi] === Q.correct ? 1 : 0), 0);
  const passed = score >= PASS_SCORE;
  const answered = Object.keys(state.answers).length;
  const cursor = state.submitted ? "default" : "pointer";

  const result = passed
    ? { title: "Đạt — sẵn sàng sang I2.1 🎉", msg: `Bạn đạt ngưỡng ${PASS_SCORE}/22. Kết hợp deliverable Gate 1 đạt rubric → qua Gate 1, sang I2.1 — Prompt Engineering.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/22. Sai nhiều câu PII (9–14, 21–22) là tín hiệu rủi ro tuân thủ — đọc lại rồi làm lại.`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        {backIcon}Tổng quan buổi I1.2
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test gate · trước khi sang I2.1</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>
        Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I1.2</span>
      </h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>
        22 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/22 ({PASS_PCT})</b>. Chọn xong bấm "Nộp bài" để chấm và xem giải thích.
      </p>

      {state.submitted && (
        <div style={{ border: `2px solid ${result.border}`, background: result.bg, borderRadius: "16px", padding: "26px 30px", marginBottom: "34px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ font: "italic 800 64px/1 var(--font-serif)", color: result.color }}>
            {score}<span style={{ font: "800 26px/1 var(--font-impact)", color: "var(--fg-3)" }}>/22</span>
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
            Đã trả lời <b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>{answered}</b> / 22 câu
          </span>
        </div>
      )}
    </div>
  );
}

export function LessonI12() {
  const [state, setState] = useState<LessonState>({
    page: "overview",
    part: 0,
    answers: {},
    submitted: false,
    cards: {},
    cardsRevealed: false,
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

  const pickCard = (ci: number, val: boolean) => {
    if (state.cardsRevealed) return;
    setState((s) => ({ ...s, cards: { ...s.cards, [ci]: val } }));
  };

  const toggleCards = () => {
    setState((s) => ({ ...s, cardsRevealed: !s.cardsRevealed }));
  };

  return (
    <div style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)" }}>
      {state.page === "overview" && <OverviewScreen go={go} />}
      {state.page === "read" && <ReadScreen state={state} go={go} />}
      {state.page === "gate" && <GateScreen state={state} go={go} pickCard={pickCard} toggleCards={toggleCards} />}
      {state.page === "exam" && <ExamScreen state={state} go={go} pick={pick} submit={submit} reset={reset} />}
    </div>
  );
}
