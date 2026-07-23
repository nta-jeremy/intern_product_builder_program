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
  { n: "01", short: "Tích hợp thực tế vs Demo & AI-fit", title: "Tích hợp thực tế vs Demo & Đánh giá lại AI-fit", time: "~15 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Feedback · Iterate · Delta", title: "Feedback có cấu trúc, Iterate & Đo lường Delta Outcome", time: "~15 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Cách phân biệt giữa tích hợp thực tế và bản demo chạy thử; 3 câu hỏi bắt buộc khi tích hợp (điểm chạm, luồng dữ liệu, đối tượng sử dụng đầu ra); phương án đánh giá lại AI-fit sau vận hành (giữ AI hay thay bằng rule); và các nguyên tắc bảo mật khi chạm dữ liệu thật (PII, lớp kiểm soát trust layer, đối chiếu nguồn grounding).", tags: ["Integration vs Demo", "3 câu hỏi tích hợp", "Xét lại AI-fit", "An toàn dữ liệu thật"] },
  { ...PART_META[1], desc: "Quy trình thu thập phản hồi (feedback) có cấu trúc (Hỏi ai - Hỏi gì - Đo gì); cách phân tách tín hiệu (signal) khỏi nhiễu (noise); phương pháp cải tiến (iterate) dựa trên bằng chứng và cách tránh 3 sai lầm phổ biến; đo lường delta outcome dựa trên value metric; kỹ năng phối hợp liên phòng ban (cross-team); và phân tích case study cải tiến thực tế v1 → v2.", tags: ["Feedback có cấu trúc", "Signal vs Noise", "Iterate + 3 sai lầm", "Delta · Cross-team"] },
];

const OBJECTIVES = [
  "Phân biệt rõ ràng giữa tích hợp thực tế (integration) và demo thử nghiệm; từ đó xác định chính xác điểm chạm (touchpoint), luồng dữ liệu và đối tượng sử dụng kết quả đầu ra.",
  "Biết cách thu thập phản hồi có cấu trúc (xác định rõ Hỏi ai / Hỏi gì / Đo chỉ số nào); và phân tách được tín hiệu giá trị (signal) khỏi các thông tin nhiễu (noise).",
  "Thực hiện cải tiến sản phẩm (iterate) hoàn toàn dựa trên bằng chứng: tiếp nhận phản hồi → đưa ra quyết định thay đổi → đo lường lại delta cải thiện; đồng thời tránh được 3 sai lầm thường gặp khi iterate.",
  "Đánh giá lại mức độ phù hợp AI (AI-fit) sau một thời gian vận hành thực tế: giữ AI ở những khâu tạo giá trị cốt lõi, thay thế bằng quy tắc logic (rule-based) cố định ở những khâu đơn giản để tối ưu chi phí.",
  "Chủ động phối hợp liên phòng ban (cross-team): đưa giải pháp đến các bên liên quan ngoài bộ phận của mình để thu thập phản hồi thực tế và tạo đồng thuận.",
];

const MUST_KNOW = ["Integration vs Demo", "Touchpoint", "Data Flow", "Xét lại AI-fit", "Feedback có cấu trúc", "Signal vs Noise", "Iterate", "Delta Outcome", "Value metric", "Cross-team"];
const NICE_KNOW = ["Value metric & outcome (I1.2)", "Cải tiến trước–sau (I3.3)", "AI-fit / AI Canvas (I4.1)", "Trust layer & PII (I4.2/I1.2)", "Thiên kiến/sycophancy (I2.2)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~30 phút" },
  { k: "Giai đoạn", v: "3 · Tuần 9–11" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL1 🔒 · NL3 🔒" },
  { k: "Gate", v: "Stretch · tốt nghiệp sớm" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — Tích hợp vs Demo & AI-fit
const INTEGRATE_QS = [
  { n: "1", name: "Điểm chạm (Touchpoint)", text: "Giải pháp sẽ được nhúng hoặc kết nối vào vị trí cụ thể nào trong hệ thống hoặc quy trình hiện có? (Ví dụ: Ngay tại bước chọn size trên trang chi tiết sản phẩm của website)." },
  { n: "2", name: "Luồng dữ liệu (Data Flow)", text: "Dữ liệu đầu vào lấy từ nguồn nào, đầu ra được trả về đâu, và bộ phận nào sẽ chịu trách nhiệm quản lý nguồn dữ liệu đó? (Đảm bảo tuân thủ nghiêm ngặt nguyên tắc bảo mật thông tin cá nhân PII)." },
  { n: "3", name: "Đối tượng sử dụng đầu ra", text: "Ai thực sự là người dùng cuối của tính năng này và họ sẽ thực hiện hành động tiếp theo gì dựa trên kết quả đầu ra? (Nếu không làm rõ đối tượng sử dụng, việc tích hợp sẽ trở nên vô nghĩa)." },
];
const AIFIT_DECISION = [
  { head: "GIỮ NGUYÊN AI", text: "Áp dụng cho những khâu mà AI mang lại giá trị vượt trội rõ rệt, không thể giải quyết bằng các quy tắc logic cố định (Ví dụ: xử lý ngôn ngữ tự nhiên, cá nhân hóa nội dung hiển thị).", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
  { head: "THAY BẰNG RULE", text: "Áp dụng cho những khâu thực chất chỉ là logic xác định (deterministic), hoặc khi AI hoạt động kém ổn định, tốn kém hơn nhiều so với giá trị thực tế mang lại → cần chủ động thay thế bằng quy tắc logic (rule-based) hoặc loại bỏ.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
];
const SAFETY_RULES = [
  { name: "Bảo vệ PII & bí mật kinh doanh (I1.2)", text: "Che ẩn hoặc mã hóa thông tin cá nhân (PII), phân quyền truy cập nghiêm ngặt trước khi gửi dữ liệu sang hệ thống AI; tuyệt đối không gửi dữ liệu nhạy cảm lên các công cụ AI công cộng không cam kết bảo mật." },
  { name: "Lớp kiểm soát tin cậy (Trust Layer) (I4.2)", text: "Thiết lập quy trình kiểm chứng (validate) đầu vào/đầu ra và xây dựng sẵn cơ chế dự phòng (fallback); áp dụng cơ chế phê duyệt thủ công (Human-in-the-loop - HITL) trước khi thực hiện các hành động không thể hoàn tác." },
  { name: "Kiểm chứng thực tế (Grounding) (I1.2)", text: "Mọi kết quả đầu ra ảnh hưởng trực tiếp đến trải nghiệm của khách hàng thật phải được liên kết rõ ràng với nguồn dữ liệu đáng tin cậy để có thể đối chiếu và kiểm tra chéo bất cứ lúc nào." },
];

// Phần 2 — Feedback · Iterate · Delta
const FEEDBACK_FRAME = [
  { name: "Hỏi ai", text: "Tìm đến và tiếp cận đúng nhóm người dùng thực tế của giải pháp; tránh đi khảo sát những người không liên quan chỉ vì họ đang rảnh rỗi." },
  { name: "Hỏi gì", text: "Đặt các câu hỏi mang tính khách quan (trung tính), tập trung khai thác hành vi sử dụng thực tế; tuyệt đối tránh các câu hỏi gợi ý hoặc định hướng người trả lời (tránh lỗi thiên kiến - I1.2/I2.2)." },
  { name: "Đo gì", text: "Xác định rõ ràng từ trước chỉ số nào sẽ được thay đổi (gắn liền với value metric ở buổi I1.2) để định lượng hóa và thống kê các phản hồi nhận được." },
];
const ITERATE_MISTAKES = [
  { name: "Cải tiến cảm tính", text: "Thực hiện thay đổi sản phẩm chỉ dựa trên cảm quan cá nhân rằng \"thế này sẽ tốt hơn\", không dựa trên bất kỳ tín hiệu thực tế nào và không tiến hành đo lường lại kết quả sau khi chỉnh sửa." },
  { name: "Chững lại / Đứng bánh (stalling)", text: "Khi kết quả vận hành ban đầu chưa đạt kỳ vọng thì lập tức nản lòng và từ bỏ ý tưởng, thay vì kiên trì phân tích sâu dữ liệu để tìm ra hướng cải tiến có định hướng rõ ràng." },
  { name: "Thay đổi quá nhiều cùng lúc", text: "Thay đổi quá nhiều yếu tố cùng một lúc khiến bạn không thể xác định được hành động cụ thể nào đã tạo ra sự cải thiện (kế thừa nguyên tắc \"cải tiến có trọng tâm\" ở buổi I3.3)." },
];
const CASE_STEPS = [
  { tag: "v1 · ban đầu", metric: "12%", title: "Tích hợp ban đầu", text: "Hệ thống gợi ý size dựa trên chiều cao và cân nặng do khách hàng tự cung cấp. Sau 2 tuần vận hành: Tỷ lệ đổi trả do sai size là 12%. Phản hồi lặp lại nhiều nhất là: \"Tôi không hiểu tại sao hệ thống lại gợi ý size này cho tôi\".", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
  { tag: "vòng 1", metric: "10%", title: "Tăng tính minh bạch", text: "Hiển thị thêm lý do gợi ý cụ thể (Ví dụ: \"Gợi ý size M vì chiều cao và cân nặng của bạn tương đồng với 85% khách hàng đã mua và mặc vừa vặn sản phẩm này\") — đây là bước grounding (đối chiếu thực tế) giúp khách hàng an tâm và tin tưởng hơn.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { tag: "vòng 2", metric: "9%", title: "Xử lý edge case", text: "Với các trường hợp khách nhập số đo bất thường, hệ thống không cố gợi ý bừa mà kích hoạt cơ chế fallback: Hiện thông báo \"Số đo của bạn cần nhân viên tư vấn trực tiếp hỗ trợ\" kèm nút liên hệ nhanh → giúp triệt tiêu hoàn toàn các ca chọn sai size nghiêm trọng.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];

// Stretch page
const ITERATE_LOOP = [
  { n: "1", name: "Thu tín hiệu thực tế", hint: "phản hồi lặp lại + gắn hành vi; lọc khỏi nhiễu", border: "var(--iris)", bg: "var(--iris-tint)", badgeBg: "var(--iris)", badgeFg: "#fff", arrow: "→" },
  { n: "2", name: "Thay đổi có chủ đích", hint: "quyết định thay đổi 1-2 điểm mấu chốt", border: "var(--gold-deep)", bg: "var(--gold-tint)", badgeBg: "var(--gold-deep)", badgeFg: "#fff", arrow: "→" },
  { n: "3", name: "Đo lường delta", hint: "so value metric trước/sau; lặp lại vòng", border: "var(--mint)", bg: "var(--mint-tint)", badgeBg: "var(--mint)", badgeFg: "#fff", arrow: "↺" },
];
const STRETCH_REQS = [
  "Một giải pháp đã được tích hợp thực tế (không dừng lại ở demo) — có người dùng thật, hoạt động trên quy trình nghiệp vụ thật với dữ liệu thật.",
  "Trình bày tối thiểu 2 chu kỳ cải tiến (iterate), mỗi vòng cần làm rõ: Tín hiệu đầu vào → Hành động thay đổi cụ thể → Kết quả đo lường lại (delta).",
  "Đưa ra minh chứng cụ thể về phản hồi thực tế (signal): trích dẫn lại các phản hồi có tính lặp lại từ phía người dùng, thống kê tần suất xuất hiện và gắn liền với hành vi thực tế của họ.",
  "Đo lường mức độ chênh lệch (delta) trực tiếp trên value metric: chỉ ra số liệu cụ thể trước và sau mỗi vòng cải tiến (Ví dụ: Tỷ lệ đổi trả hàng do sai size giảm từ 12% → 10% → 9%).",
  "Thể hiện tinh thần phối hợp liên phòng ban (cross-team): có ít nhất một bên liên quan ngoài bộ phận phát triển (như phòng Vận hành, CSKH hoặc Kinh doanh) trực tiếp dùng thử hoặc phê duyệt giải pháp.",
  "Đưa ra quyết định AI-fit sau khi vận hành thực tế: chỉ rõ khâu nào tiếp tục duy trì AI, khâu nào thay thế bằng quy tắc logic (rule-based) kèm theo lý do thuyết phục dựa trên dữ liệu.",
];
const CASE_REF = [
  { round: "v1", signal: "\"Tôi không hiểu vì sao hệ thống lại gợi ý size này cho tôi\" & tỷ lệ đổi trả hàng cao.", change: "Tích hợp phiên bản v1 — gợi ý size tự động theo chiều cao và cân nặng.", metric: "12%", color: "var(--rose-deep)", rowBg: "#fff" },
  { round: "Vòng 1", signal: "Nhận phản hồi lặp lại về việc gợi ý size thiếu minh bạch, khách hàng không tin tưởng.", change: "Bổ sung dòng giải thích trực quan lý do hệ thống đưa ra gợi ý size (áp dụng grounding).", metric: "10%", color: "var(--gold-deep)", rowBg: "var(--gold-tint)" },
  { round: "Vòng 2", signal: "Khách có số đo bất thường vẫn cố nhập và nhận gợi ý size sai lệch nghiêm trọng.", change: "Cài đặt cơ chế fallback cho các ca edge case (số đo bất thường) → chuyển hướng sang nút nhờ nhân viên tư vấn trực tiếp.", metric: "9%", color: "var(--mint-deep)", rowBg: "var(--mint-tint)" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Tích hợp vs Demo & AI-fit", B = "Phần B · Feedback · Iterate · Delta · Cross-team";
const EXAM: ExamQ[] = [
  { part: A, q: "Tích hợp thực tế (Integration) khác biệt cơ bản so với Demo ở điểm nào?", opts: ["Tích hợp có giao diện đẹp và bắt mắt hơn", "Tích hợp thực tế là đưa giải pháp vào vận hành để người dùng thật làm việc thật trên quy trình và dữ liệu thật; trong khi Demo chỉ nhằm trình diễn khả năng hoạt động trong môi trường giả lập được thiết lập sẵn", "Demo bắt buộc dùng dữ liệu thực tế, còn Tích hợp chỉ dùng dữ liệu mẫu", "Hai khái niệm này hoàn toàn tương đồng về mặt kỹ thuật và vận hành"], correct: 1, why: "Integration = đưa vào vận hành thật để người khác dùng (dữ liệu/quy trình thật); Demo chỉ trình diễn khả năng vận hành. (File 1)" },
  { part: A, q: "Mục tiêu lớn nhất của việc trình diễn thử (Demo) là gì?", opts: ["Tạo ra giá trị thực tế đo lường được cho khách hàng", "Kết nối giải pháp trực tiếp vào quy trình làm việc thực tế của doanh nghiệp", "Chứng minh giải pháp có khả năng hoạt động tốt (chạy được) trong một môi trường giả lập được sắp đặt trước", "Thu nhập phản hồi thực tế từ người dùng cuối"], correct: 2, why: "Demo nhằm chứng minh giải pháp có khả năng vận hành trong môi trường giả lập được sắp đặt trước. (File 1)" },
  { part: A, q: "Khi tích hợp một giải pháp vào hệ thống thực tế, ba câu hỏi bắt buộc phải trả lời là gì?", opts: ["Số token tiêu thụ · Chi phí vận hành · Thời gian phản hồi (Latency)", "Vai trò của AI · Định dạng đầu ra · Ràng buộc kỹ thuật", "Vấn đề cần giải quyết · Người dùng cuối · Chỉ số đo lường hiệu quả", "Điểm chạm (Touchpoint) · Luồng dữ liệu (Data Flow) · Đối tượng sử dụng đầu ra"], correct: 3, why: "Ba câu hỏi khi tích hợp: Touchpoint · Data Flow · Đối tượng sử dụng đầu ra. (File 1)" },
  { part: A, q: "Nếu không xác định rõ \u201cđối tượng sử dụng đầu ra và cách thức sử dụng\u201d, việc tích hợp sẽ như thế nào?", opts: ["Việc tích hợp trở nên vô nghĩa — bắt buộc phải làm rõ đối tượng sử dụng trước khi triển khai", "Vẫn có thể tiến hành tích hợp bình thường mà không ảnh hưởng đến hiệu quả", "Để hệ thống AI tự động đưa ra quyết định thay cho người dùng", "Đây là yếu tố phụ, không ảnh hưởng đến kết quả cuối cùng"], correct: 0, why: "Không rõ đối tượng sử dụng đầu ra → tích hợp vô nghĩa, phải làm rõ trước. (File 1)" },
  { part: A, q: "Việc \u201cđánh giá lại mức độ phù hợp AI (AI-fit) sau vận hành thực tế\u201d được hiểu như thế nào?", opts: ["Luôn bắt buộc duy trì và áp dụng AI ở tất cả các khâu của quy trình", "Dùng dữ liệu vận hành thực tế để quyết định giữ AI ở khâu tạo giá trị, hoặc thay bằng quy tắc logic (rule) ở khâu logic cố định nhằm tối ưu chi phí", "Loại bỏ hoàn toàn công nghệ AI ra khỏi hệ thống để giảm chi phí", "Tăng thông số Temperature của mô hình AI để hệ thống phản hồi chính xác hơn"], correct: 1, why: "Xét lại AI-fit = dùng dữ liệu vận hành thật để quyết giữ AI hay thay bằng rule nhằm tối ưu chi phí. (File 1)" },
  { part: A, q: "Dữ liệu cho thấy 90% ca chọn size chỉ cần bảng quy đổi theo rule, chỉ 10% ca đặc biệt cần AI. Quyết định tối ưu nhất?", opts: ["Tiếp tục dùng AI tư vấn size cho 100% các trường hợp", "Loại bỏ hoàn toàn tính năng gợi ý size để đơn giản hóa hệ thống", "Thiết lập quy tắc logic (rule) xử lý 90% các ca cơ bản, chỉ gọi AI hỗ trợ cho 10% các ca đặc biệt, phức tạp → giúp tối ưu chi phí và nâng cao độ ổn định hệ thống", "Yêu cầu CSKH liên hệ trực tiếp với từng khách hàng để tư vấn"], correct: 2, why: "Rule xử lý 90% ca cơ bản, AI hỗ trợ 10% ca khó → tối ưu chi phí, tăng độ ổn định. (File 1)" },
  { part: A, q: "Quyết định đánh giá lại AI-fit nên dựa trên cơ sở nào?", opts: ["Cảm tính cá nhân của người xây dựng giải pháp (Builder)", "Ý kiến của người có tiếng nói lớn nhất trong cuộc họp (HiPPO/Loudest Voice Bias)", "Cách thức triển khai của các đối thủ cạnh tranh trên thị trường", "Dữ liệu vận hành thực tế thu thập được từ người dùng"], correct: 3, why: "Quyết định AI-fit dựa trên dữ liệu vận hành thực tế, không cảm tính. (File 1)" },
  { part: A, q: "Khi chuyển từ demo (dữ liệu giả lập) sang tích hợp thật (dữ liệu thật), nguyên tắc cốt lõi nào cần tuân thủ?", opts: ["Tuân thủ bảo mật thông tin cá nhân (PII), phân quyền truy cập chặt chẽ, xây dựng lớp kiểm soát tin cậy (trust layer với validate/fallback), cơ chế phê duyệt thủ công (HITL) và đối chiếu nguồn dữ liệu thực tế (grounding)", "Loại bỏ bớt lớp kiểm soát tin cậy (trust layer) để hệ thống chạy nhanh hơn", "Đưa dữ liệu cá nhân (PII) thô của khách vào các mô hình AI công cộng để xử lý trực tiếp", "Tin tưởng tuyệt đối vào kết quả đầu ra của AI mà không cần kiểm chứng"], correct: 0, why: "Chạm dữ liệu thật: PII · phân quyền · trust layer · HITL · grounding. (File 1, nối I1.2/I4.2)" },
  { part: A, q: "Vì sao một demo hoạt động tốt trong môi trường thử nghiệm chưa chắc tích hợp thành công vào thực tế?", opts: ["Vì các bản demo luôn chứa lỗi lập trình hệ thống", "Vì các bản demo thường bỏ qua hoặc chưa phải giải quyết các bài toán vận hành thực tế như: dữ liệu thật lấy từ nguồn nào, ai sử dụng đầu ra và giải pháp được nhúng vào bước nào trong quy trình", "Vì việc chạy demo tiêu tốn quá nhiều tài nguyên token của hệ thống", "Vì giao diện của bản demo thường không có màu sắc và hình ảnh trực quan"], correct: 1, why: "Demo bỏ qua các bài toán thực tế: dữ liệu thật lấy từ đâu, ai dùng, gắn vào bước nào. (File 1)" },
  { part: B, q: "Trước khi thu thập phản hồi (feedback) về giải pháp, cần xác định trước 3 yếu tố nào?", opts: ["Số token tiêu thụ · Chi phí vận hành · Thời gian phản hồi", "Vai trò của AI · Định dạng đầu ra · Ràng buộc kỹ thuật", "Khảo sát ai (Hỏi ai) · Khảo sát nội dung gì (Hỏi gì) · Đo lường chỉ số nào (Đo gì)", "Vấn đề cần giải quyết · Giải pháp đề xuất · Chỉ số đo lường hiệu quả"], correct: 2, why: "Feedback có cấu trúc: chốt trước hỏi ai · hỏi gì · đo chỉ số nào. (File 2)" },
  { part: B, q: "\u201cTín hiệu (Signal)\u201d trong các phản hồi thu thập được là gì?", opts: ["Những ý kiến đóng góp mang tính cá nhân, xuất hiện ngẫu nhiên một lần", "Phản hồi của người có tiếng nói lớn nhất hoặc vị trí cao nhất trong phòng ban", "Các góp ý xoay quanh sở thích thẩm mỹ cá nhân của người dùng", "Những phản hồi có tính lặp lại từ nhiều người dùng và gắn liền với hành vi thực tế của họ"], correct: 3, why: "Tín hiệu = phản hồi lặp lại và gắn hành vi thực tế của người dùng. (File 2)" },
  { part: B, q: "Cạm bẫy lớn nhất khi xử lý các phản hồi (feedback) từ người dùng là gì?", opts: ["Vội vàng thay đổi sản phẩm theo ý người nói to nhất (Loudest Voice Bias) thay vì dựa trên phản hồi có tần suất lặp lại cao nhất", "Thống kê và đếm tần suất xuất hiện của các loại phản hồi khác nhau", "Liên kết phản hồi của người dùng với hành vi thực tế của họ trên hệ thống", "Phân loại rõ ràng phản hồi nào là tín hiệu (signal), phản hồi nào là nhiễu (noise)"], correct: 0, why: "Cạm bẫy: chạy theo người nói to nhất thay vì dựa trên tín hiệu có tần suất lặp lại cao nhất. (File 2)" },
  { part: B, q: "Một chu kỳ cải tiến sản phẩm (vòng iterate) chuẩn xác gồm các bước nào?", opts: ["Liên tục sửa các lỗi kỹ thuật (bug) cho đến khi hệ thống không còn báo lỗi", "Tiếp nhận phản hồi (Tín hiệu) → Quyết định thay đổi có mục tiêu → Đo lường lại hiệu quả (Delta)", "Thay đổi đồng thời tất cả các yếu tố của sản phẩm trong một phiên bản mới", "Từ bỏ ý tưởng ban đầu ngay lập tức nếu kết quả vận hành thử nghiệm chưa đạt kỳ vọng"], correct: 1, why: "Vòng iterate: tiếp nhận tín hiệu → quyết định thay đổi → đo lại delta. (File 2)" },
  { part: B, q: "Đâu là một trong ba sai lầm phổ biến nhất khi thực hiện cải tiến sản phẩm (iterate)?", opts: ["Đo lường sự chênh lệch hiệu quả (delta) trước và sau khi cải tiến", "Tập trung nguồn lực cải tiến 1-2 điểm mấu chốt có tác động lớn nhất", "Thực hiện thay đổi theo cảm tính (không dựa trên tín hiệu thực tế và không đo lại kết quả)", "Đưa ra quyết định cải tiến dựa trên các phản hồi có tính lặp lại từ người dùng"], correct: 2, why: "Một sai lầm khi iterate: cải tiến theo cảm tính (không dựa tín hiệu, không đo lại). (File 2)" },
  { part: B, q: "Hoạt động \u201cđo lường sự thay đổi kết quả (Delta Outcome)\u201d nghĩa là gì?", opts: ["Đếm tổng số lượng tính năng được phát triển mới trong một phiên bản", "Đo lường số lượt bấm chuột của người dùng trên toàn bộ giao diện sản phẩm", "Thống kê tổng số giờ làm việc của đội ngũ phát triển sản phẩm", "So sánh chỉ số giá trị (value metric) trước và sau chu kỳ cải tiến để chứng minh hiệu quả thực tế (VD: tỉ lệ đổi trả giảm từ 12% xuống 9%)"], correct: 3, why: "Đo delta = so sánh value metric trước và sau chu kỳ cải tiến. (File 2)" },
  { part: B, q: "Sự thay đổi (Delta) cần được đo lường dựa trên loại chỉ số (metric) nào?", opts: ["Chỉ số giá trị thực tế (Value metric — VD: tỉ lệ đổi trả hàng do chọn sai kích cỡ)", "Chỉ số ảo mang tính hình thức (Vanity metric — VD: số lượt click vào giao diện gợi ý)", "Tổng số lượt phản hồi mà hệ thống AI đã tạo ra trong ngày", "Tổng số lượt cập nhật mã nguồn (commit) của lập trình viên"], correct: 0, why: "Delta đo trên value metric, không phải vanity metric. (File 2, nối I1.2)" },
  { part: B, q: "\u201cCộng tác liên phòng ban (Cross-team collaboration)\u201d ở bài học này được hiểu như thế nào?", opts: ["Chỉ tập trung tối ưu hóa quy trình làm việc trong nội bộ phòng ban của mình", "Đưa giải pháp tới các bên liên quan ngoài bộ phận (Vận hành, CSKH, Kinh doanh) để họ dùng thử, thu phản hồi thực tế và tạo đồng thuận chung", "Tự quyết định mọi thay đổi về quy trình mà không cần tham khảo các phòng ban khác", "Chỉ làm việc và thu thập phản hồi từ người hướng dẫn (mentor)"], correct: 1, why: "Cross-team: đưa giải pháp tới các bên liên quan ngoài bộ phận để thu phản hồi và tạo đồng thuận. (File 2)" },
  { part: B, q: "Vì sao \u201ccó nhân sự ở phòng ban khác thực sự sử dụng hoặc phê duyệt giải pháp\u201d là minh chứng mạnh mẽ cho sự thành công?", opts: ["Vì giải pháp của bạn đã thu hút được số lượng lớn người tham gia", "Vì quy trình này giúp hệ thống tiết kiệm được tài nguyên token của AI", "Vì nó chứng minh giải pháp đã đi vào vận hành thực tế và giải quyết vấn đề của doanh nghiệp, không chỉ dừng ở ý tưởng lý thuyết", "Vì đây là yêu cầu bắt buộc của người hướng dẫn (mentor) để vượt qua bài kiểm tra"], correct: 2, why: "Có nhân sự phòng ban khác dùng/phê duyệt → chứng minh giải pháp đã đi vào vận hành thực tế. (File 2)" },
  { part: B, q: "Trong tình huống cải tiến gợi ý size từ v1 lên v2, điều gì chứng minh chu kỳ cải tiến đã có hiệu quả thực tế?", opts: ["Giao diện người dùng được thiết kế đẹp mắt và hiện đại hơn phiên bản cũ", "Hệ thống được bổ sung thêm nhiều tính năng phụ trợ phức tạp hơn", "Tài liệu mô tả kỹ thuật của sản phẩm được viết chi tiết và dài hơn", "Tỉ lệ đổi trả hàng do sai kích cỡ giảm dần qua từng vòng cải tiến (từ 12% xuống 10% rồi còn 9%)"], correct: 3, why: "Case v1→v2: tỉ lệ đổi trả giảm 12%→10%→9% chứng minh cải tiến có hiệu quả thực tế. (File 2)" },
  { part: B, q: "Lỗi \u201cChững lại/Đứng bánh\u201d (stalling) khi cải tiến sản phẩm (iterate) được hiểu như thế nào?", opts: ["Từ bỏ ngay khi kết quả ban đầu chưa đạt kỳ vọng, thay vì tiếp tục phân tích tín hiệu để cải tiến có định hướng", "Kiên trì thực hiện cải tiến có định hướng rõ ràng dựa trên tín hiệu thực tế", "Thực hiện đo lường sự thay đổi chỉ số (delta) trước và sau khi cập nhật phiên bản mới", "Đưa giải pháp chạy thử trên nhiều phòng ban khác nhau để thu thập dữ liệu chéo"], correct: 0, why: "\u201cĐứng bánh\u201d (stalling) = từ bỏ ngay khi chưa đạt kỳ vọng thay vì tiếp tục cải tiến có định hướng. (File 2)" },
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
const boltIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const checklistIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
);
const lockIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const xSmIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6 6 18M6 6l12 12" /></svg>
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

export function LessonI43() {
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
    <div data-screen-label="Tổng quan I4.3">
      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "20px 44px 0", display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", flexWrap: "wrap" }}>
        <span>Khóa học</span>
        {chevR()}
        <span>Giai đoạn 3 · Tuần 9–11</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I4.3 · Tích hợp Initiative &amp; Đo kết quả</span>
      </div>

      <div style={{ maxWidth: "1180px", margin: "0 auto", padding: "14px 44px 96px", display: "grid", gridTemplateColumns: "1fr 340px", gap: "56px", alignItems: "start" }}>
        <main style={{ minWidth: 0 }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I4.3 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL1 🔒 · NL3 🔒</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Stretch · tốt nghiệp sớm</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Tích hợp Initiative &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Đo kết quả</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Đây là bước đưa giải pháp <b style={{ color: "var(--fg-1)" }}>từ môi trường thử nghiệm ra thực tế</b>: chuyển từ <em style={{ fontStyle: "italic" }}>chạy thử (demo)</em> sang <em style={{ fontStyle: "italic" }}>tích hợp thực tế (integration)</em> để người khác dùng, rồi <b style={{ color: "var(--fg-1)" }}>đo xem nó có tạo ra thay đổi thật không</b>. Hai kỹ năng quyết định: <em style={{ fontStyle: "italic" }}>thu feedback có cấu trúc</em> và <em style={{ fontStyle: "italic" }}>cải tiến liên tục dựa trên delta thực tế</em>, phối hợp qua <em style={{ fontStyle: "italic" }}>nhiều phòng ban</em>.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~30</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Thử thách Stretch + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Một bản demo &quot;trông rất mượt&quot; chưa chắc <b style={{ color: "var(--fg-1)" }}>tích hợp được vào hệ thống thật</b>. Buổi này buộc bạn trả lời những câu hỏi hóc búa mà demo bỏ qua — dữ liệu thật lấy từ đâu, ai dùng đầu ra, gắn vào bước nào của quy trình — rồi <b style={{ color: "var(--fg-1)" }}>thu feedback có cấu trúc</b>, lọc tín hiệu khỏi nhiễu, và <b style={{ color: "var(--fg-1)" }}>cải tiến dựa trên bằng chứng</b> (đo delta trước/sau). Đây là nơi <b style={{ color: "var(--fg-1)" }}>Outcome Thinking (I1.2)</b> và <b style={{ color: "var(--fg-1)" }}>Collaboration (I3.3)</b> gặp thực tế vận hành — cấp độ <b style={{ color: "var(--fg-1)" }}>L2 của NL1 &amp; NL3 🔒</b>.
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

          <section style={{ marginTop: "40px", border: "1px solid var(--iris)", borderRadius: "12px", overflow: "hidden", background: "var(--iris-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--iris)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff" }}>{boltIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "7px" }}>Thử thách Stretch · không bắt buộc</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Case study cải tiến (iterate) tối thiểu 2 vòng có delta thật</h3>
                <p style={{ font: "14px/1.6/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Nếu muốn được cân nhắc lộ trình thăng tiến sớm (Product Engineer), nộp một báo cáo cải tiến ≥2 vòng: kèm minh chứng từ <b style={{ color: "var(--fg-1)" }}>phản hồi thực tế</b> và <b style={{ color: "var(--fg-1)" }}>sự thay đổi chỉ số (metric trước/sau)</b> của giải pháp bạn đã tích hợp. Đây là minh chứng mạnh mẽ về năng lực L3.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Xem Thử thách →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--gold-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg></div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang buổi I5.1. Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I5.1 — Kiến trúc giải pháp AI</b> (bắt đầu Capstone).</p>
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
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Buổi khép lại giai đoạn &quot;Workflow &amp; Độc lập phát triển&quot;. Có cổng tốt nghiệp sớm với thử thách vượt ngưỡng (stretch) — không bắt buộc, dùng để nhận diện ứng viên xuất sắc sẵn sàng lên Product Engineer.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I4.2 (Dev Craft)</b> → buổi <b style={{ color: "var(--fg-1)" }}>I4.3 (Tích hợp Initiative &amp; Đo kết quả)</b> → sang <b style={{ color: "var(--fg-1)" }}>I5.1 (Kiến trúc giải pháp AI · Capstone)</b>.</p>
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
    { title: "Tích hợp vs Demo & AI-fit", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "Feedback, Iterate & Delta Outcome", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Thử thách Stretch →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("product") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.3
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{boltIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Thử thách Stretch · iterate</span>
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I4.3</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>R</span>anh giới quyết định của buổi học này là: Một bản demo chạy thử &quot;trông rất mượt mà&quot; chưa chắc đã <b>tích hợp thành công vào hệ thống thực tế</b>. Việc tích hợp thực tế buộc bạn phải trả lời và giải quyết triệt để những câu hỏi hóc búa mà bản demo có thể dễ dàng bỏ qua — như dữ liệu thật lấy từ nguồn nào, ai là người dùng đầu ra và giải pháp được gắn vào bước nào trong quy trình nghiệp vụ.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Phân biệt Tích hợp (Integration) và Demo</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--gold-deep)", marginBottom: "12px" }}>DEMO — CHO XEM</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Trình diễn giải pháp <b>hoạt động thế nào</b> trong một môi trường giả lập (đã được sắp đặt trước), sử dụng dữ liệu mẫu và thuyết trình trước hội đồng hoặc mentor.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--gold-deep)", paddingTop: "10px" }}>Mục tiêu duy nhất: chứng minh giải pháp <b>CÓ THỂ chạy</b>.</div>
          </div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>INTEGRATION — ĐỂ DỰA VÀO</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Đưa giải pháp vào vận hành thực tế để <b>người dùng thật làm việc thật trên quy trình nghiệp vụ thật và dữ liệu thật</b>.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--mint)", paddingTop: "10px" }}>Mục tiêu lớn nhất: tạo <b>GIÁ TRỊ đo lường được</b>.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Demo cho xem · Integration để người khác dựa vào làm việc thật.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}><b>Demo chạy thử:</b> Trình diễn tính năng &quot;AI gợi ý size&quot; trên 5 sản phẩm mẫu giả lập cho mentor xem. &nbsp;·&nbsp; <b>Tích hợp thực tế:</b> Đưa tính năng này lên trang chi tiết sản phẩm chính thức trên website để <b>khách hàng thật trực tiếp sử dụng khi mua sắm</b>, nhúng khớp vào luồng chọn size sẵn có.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Ba câu hỏi phải trả lời khi tích hợp</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {INTEGRATE_QS.map((q, i) => (
            <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "14px 16px" }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "8px", background: "var(--iris-tint)", color: "var(--iris-deep)", font: "700 14px/28px var(--font-numeric)", textAlign: "center" }}>{q.n}</span>
              <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>{q.name} — </b>{q.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Điểm chạm · luồng dữ liệu · đối tượng sử dụng đầu ra: chốt trước khi đưa vào thật.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Không rõ ai dùng đầu ra = tích hợp vô nghĩa.</b> Nếu không xác định rõ người dùng cuối và họ sẽ thực hiện hành động tiếp theo gì dựa trên kết quả đầu ra, việc tích hợp không tạo ra giá trị nào.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Đánh giá lại AI-fit sau khi vận hành thực tế</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 16px" }}>Quyết định AI-fit (I1.1/I4.1) sẽ rõ hơn nhiều <b>sau khi có dữ liệu vận hành thật</b>: bạn biết chính xác khâu nào AI tạo giá trị cao, khâu nào nên thay bằng quy tắc logic (rule) để tối ưu.</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        {AIFIT_DECISION.map((a, i) => (
          <div key={i} style={{ border: `1px solid ${a.border}`, borderRadius: "12px", background: a.bg, padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".08em", color: a.color, marginBottom: "10px" }}>{a.head}</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>{a.text}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Sau một thời gian đưa tính năng gợi ý size vào vận hành thực tế, dữ liệu cho thấy: <b>90%</b> trường hợp khách hàng chỉ cần bảng quy đổi size thông thường (dùng rule); chỉ <b>10%</b> trường hợp có số đo đặc biệt hoặc phân vân giữa 2 size mới cần AI tư vấn. Quyết định tối ưu ở đây là: <b>Cài đặt rule-based xử lý 90% ca cơ bản để hệ thống chạy tức thì, và chỉ gọi API AI cho 10% ca khó</b> → giúp tiết kiệm chi phí token và tăng độ ổn định tuyệt đối cho hệ thống. Đây chính là việc đánh giá lại AI-fit <b>dựa hoàn toàn trên dữ liệu vận hành thực tế</b>, chứ không dựa trên cảm tính.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · An toàn dữ liệu khi vận hành thật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Demo dùng dữ liệu giả; tích hợp thật <b>chạm trực tiếp dữ liệu thật</b> → rủi ro bảo mật &amp; vận hành tăng cao. Bắt buộc tuân thủ các nguyên tắc an toàn đã học:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {SAFETY_RULES.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--rose-deep)", borderRadius: "11px", background: "var(--rose-tint)", padding: "14px 16px" }}>
            <span style={{ color: "var(--rose-deep)", flex: "none", marginTop: "1px" }}>{lockIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>{s.name} — </b>{s.text}</div>
          </div>
        ))}
      </div>

      <TldrDark items={[
        "<b>Demo</b> chỉ trình diễn (dữ liệu mẫu, môi trường giả lập). <b>Tích hợp (Integration)</b> đưa vào vận hành thật để người khác dùng làm việc (dữ liệu thật, quy trình thật) nhằm tạo giá trị đo lường được.",
        "Khi tích hợp, bắt buộc làm rõ 3 yếu tố: <b>Điểm chạm (Touchpoint)</b> · <b>Luồng dữ liệu (Data Flow)</b> · <b>Đối tượng sử dụng đầu ra</b>.",
        "<b>Xét lại AI-fit sau vận hành</b> bằng dữ liệu thật (giữ AI ở nơi tạo giá trị, thay rule ở nơi logic cố định); luôn đảm bảo <b>PII · trust layer · grounding</b> khi xử lý dữ liệu thật.",
      ]} />

      <SelfCheck items={[
        "Phân biệt Demo và Tích hợp thực tế đối với tính năng &quot;AI gợi ý size&quot; bằng ví dụ cụ thể.",
        "Nêu 3 câu hỏi bắt buộc phải trả lời khi tích hợp một giải pháp vào hệ thống thực tế.",
        "Vì sao &quot;xét lại AI-fit sau vận hành&quot; cho quyết định tối ưu hơn đánh giá trước khi xây?",
        "Khi chuyển từ dữ liệu giả lập sang dữ liệu thật, bạn cần tuân thủ những nguyên tắc an toàn nào?",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>T</span>hu phản hồi cảm tính, không định hướng → chỉ nhận về dữ liệu lộn xộn. Cải tiến sản phẩm thực thụ phải là <b>sự thay đổi dựa trên bằng chứng rõ ràng</b>: tiếp nhận tín hiệu → quyết định thay đổi có trọng tâm → đo lường lại delta cải thiện, và chủ động phối hợp liên phòng ban (cross-team).
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Thu feedback có cấu trúc — chốt trước 3 yếu tố</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {FEEDBACK_FRAME.map((f, i) => (
            <div key={i} style={{ border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 16px", display: "flex", flexDirection: "column", gap: "7px" }}>
              <div style={{ font: "700 15px/1.2 var(--font-brand)", color: "var(--iris-deep)" }}>{f.name}</div>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{f.text}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Bộ khung biến phản hồi rời rạc thành dữ liệu phục vụ ra quyết định.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Phân tách Tín hiệu (Signal) khỏi Nhiễu (Noise)</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Không phải phản hồi nào cũng cần xử lý ngay. Phân loại:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>TÍN HIỆU (SIGNAL) → ĐÁNG SỬA</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Phản hồi <b>lặp lại từ nhiều người</b> và <b>gắn hành vi thực tế</b> → ưu tiên cải tiến.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--mint)", paddingTop: "10px" }}>VD: 15/50 khách &quot;không hiểu cách xem bảng size gợi ý&quot; → ảnh hưởng trực tiếp hành vi mua.</div>
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "18px 20px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--fg-3)", marginBottom: "12px" }}>NHIỄU (NOISE) → GHI NHẬN</div>
            <div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Ý kiến <b>cá nhân đơn lẻ</b>, ngẫu nhiên một lần hoặc thuộc sở thích cá nhân → ghi nhận, chưa hành động ngay.</div>
            <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "12px", borderTop: "1px dashed var(--border)", paddingTop: "10px" }}>VD: 1 khách &quot;màu nút bấm không đẹp lắm&quot; → thẩm mỹ cá nhân, chưa ưu tiên.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Lọc tín hiệu khỏi nhiễu: đếm tần suất + gắn hành vi thật.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Cạm bẫy lớn nhất — Chạy theo ý kiến của &quot;người nói to nhất&quot; (Loudest Voice Bias):</b> Đó là vội vàng thay đổi sản phẩm theo ý kiến của một stakeholder có vị trí cao nhưng không đại diện cho số đông khách hàng, thay việc dựa trên các tín hiệu phản hồi có tần suất lặp lại cao nhất. Hãy luôn thống kê tần suất phản hồi và liên kết chúng với hành vi sử dụng thực tế của khách hàng.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Iterate là thay đổi dựa trên bằng chứng — 3 sai lầm cần tránh</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Một vòng iterate chuẩn: <b>tiếp nhận tín hiệu → quyết định thay đổi có mục tiêu → đo lại delta</b>. Cải tiến không chỉ là sửa bug — đó là thay đổi có chủ đích và <b>bắt buộc đo được mức cải thiện</b>. Ba sai lầm phổ biến:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 24px" }}>
        {ITERATE_MISTAKES.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--rose-deep)", borderRadius: "11px", background: "var(--rose-tint)", padding: "14px 16px" }}>
            <span style={{ color: "var(--rose-deep)", flex: "none", marginTop: "1px" }}>{xSmIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}><b>{m.name} — </b>{m.text}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Đo lường sự thay đổi (Delta Outcome) trước &amp; sau</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Cải tiến chỉ có giá trị khi <b>đo được delta</b>: so sánh chỉ số <b>trước</b> và <b>sau</b> khi thay đổi. Theo Outcome Thinking (I1.2), delta phải đo trên <b>chỉ số giá trị (value metric)</b>, không phải chỉ số ảo (vanity metric).</p>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Tỷ lệ đổi trả hàng do sai size <b>trước khi sửa (v1)</b> là 12%, <b>sau một vòng cải tiến (v2)</b> giảm xuống còn 9% → mức delta đạt được là <b>giảm 3 điểm phần trăm</b>. Đây là minh chứng thuyết phục nhất, đập tan mọi nhận định cảm tính kiểu &quot;em cảm thấy giao diện mới trực quan và tốt hơn nhiều&quot;.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Phối hợp liên phòng ban (Cross-team)</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Giải pháp thực tế hiếm khi vận hành độc lập trong một phòng ban. <b>Cross-team collaboration</b> là đưa giải pháp tới các bên liên quan khác (Vận hành, CSKH, Kinh doanh) để họ dùng thử, thu phản hồi thật và tạo đồng thuận chung (nối I3.3).</p>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--iris-deep)" }}>Minh chứng thuyết phục nhất:</b> Khi &quot;có nhân sự ở phòng ban khác thực sự sử dụng trong công việc hàng ngày hoặc chính thức phê duyệt giải pháp&quot;. Điều này chứng minh giải pháp của bạn đã đi vào vận hành thực tế và giải quyết được bài toán doanh nghiệp, chứ không chỉ là một ý tưởng đẹp nằm trên giấy.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>6 · Case study — cải tiến gợi ý size v1 → v2</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {CASE_STEPS.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: "16px", alignItems: "stretch", border: `1px solid ${c.border}`, borderRadius: "12px", background: c.bg, padding: "16px 18px" }}>
              <div style={{ flex: "none", width: "96px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "2px", borderRight: `1px dashed ${c.border}`, paddingRight: "14px" }}>
                <div style={{ font: "700 11px/1.2 var(--font-mono)", color: c.color, textAlign: "center" }}>{c.tag}</div>
                <div style={{ font: "italic 800 30px/1 var(--font-serif)", color: c.color }}>{c.metric}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "5px" }}>{c.title}</div>
                <div style={{ font: "13.5px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{c.text}</div>
              </div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Iterate có bằng chứng: mỗi vòng tín hiệu → thay đổi → đo delta trên value metric (12% → 10% → 9%).</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.75 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}>Mỗi chu kỳ cải tiến đều phải tuân thủ nghiêm ngặt luồng: <b>Tiếp nhận tín hiệu thực tế → Thực hiện thay đổi có chủ đích → Đo lường lại delta cải thiện</b>. Đây chính là tư duy nâng cấp sản phẩm chuẩn mực của một Product Builder chuyên nghiệp.</p>

      <TldrDark items={[
        "<b>Feedback có cấu trúc</b>: chốt trước hỏi ai · hỏi gì · đo gì; tách <b>tín hiệu</b> (lặp lại + gắn hành vi) khỏi <b>nhiễu</b> (ý kiến lẻ, cảm tính) — đừng chạy theo người nói to nhất.",
        "<b>Iterate</b> là thay đổi dựa trên bằng chứng (tín hiệu → thay đổi → đo delta trên value metric); tránh 3 lỗi: cải tiến cảm tính · đứng bánh (stalling) · thay đổi quá nhiều cùng lúc.",
        "<b>Cross-team</b>: có bên liên quan ngoài bộ phận dùng thật/phê duyệt là minh chứng giá trị thực. Case v1→v2 (12%→10%→9%) cho thấy hiệu quả rõ rệt của việc đo delta qua từng vòng.",
      ]} />

      <SelfCheck items={[
        "Xác định 3 yếu tố (hỏi ai · hỏi gì · đo chỉ số nào) cho một giải pháp bạn tự chọn.",
        "Đưa 3 ví dụ phản hồi, phân loại &quot;tín hiệu&quot;/&quot;nhiễu&quot; và giải thích lý do.",
        "Mô tả một vòng iterate hoàn chỉnh (tín hiệu → thay đổi → đo delta) kèm số liệu trước/sau.",
        "Vì sao &quot;stakeholders ngoài phòng ban dùng/phê duyệt giải pháp&quot; là minh chứng mạnh cho thành công?",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã khép lại giai đoạn phát triển độc lập ✓</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu) trước khi sang I5.1. Muốn tốt nghiệp sớm? Chuẩn bị <b style={{ color: "var(--fg-1)" }}>case study iterate ≥2 vòng có delta thật</b>.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("product"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Xem Thử thách Stretch →</a>
      </div>
    </div>
  );
}

function ProductScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Thử thách Stretch" style={{ maxWidth: "900px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Thử thách Stretch · không bắt buộc</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Cổng tốt nghiệp <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>sớm</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "660px" }}>Nếu bạn muốn được cân nhắc lộ trình thăng tiến sớm (lên vai trò Product Engineer), hãy thực hiện thử thách này bằng cách nộp một <b style={{ color: "var(--fg-1)" }}>báo cáo cải tiến (case study iterate) tối thiểu 2 vòng</b>. Báo cáo cần đi kèm minh chứng cụ thể từ phản hồi thực tế của người dùng và số liệu chênh lệch (metric trước/sau) của giải pháp sau khi tích hợp. Đây là minh chứng rõ ràng nhất về năng lực L3 của bạn, và thử thách này là <b style={{ color: "var(--fg-1)" }}>không bắt buộc</b> để tốt nghiệp.</p>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Vòng iterate mỗi báo cáo phải thể hiện</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Lặp lại vòng này ≥2 lần, mỗi vòng ghi rõ 3 bước.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 20px", margin: "0 0 34px", display: "flex", alignItems: "stretch", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {ITERATE_LOOP.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ border: `1.5px solid ${p.border}`, background: p.bg, borderRadius: "11px", padding: "14px 15px", width: "160px", boxSizing: "border-box", textAlign: "center" }}>
              <div style={{ width: "26px", height: "26px", margin: "0 auto 8px", borderRadius: "8px", background: p.badgeBg, color: p.badgeFg, font: "700 13px/26px var(--font-numeric)" }}>{p.n}</div>
              <div style={{ font: "700 13px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ font: "11.5px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{p.hint}</div>
            </div>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>{p.arrow}</span>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Checklist báo cáo đạt chuẩn L3</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Đủ 6 mục dưới đây là một case study stretch thuyết phục.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 34px" }}>
        {STRETCH_REQS.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "14px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{q}</div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Mẫu tham khảo — case study gợi ý size v1 → v2</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 16px" }}>Đo delta trên value metric (tỉ lệ đổi trả do sai size) qua từng vòng.</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "0.5fr 1.2fr 1.6fr 0.7fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "12px 12px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Vòng</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Tín hiệu</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Thay đổi có chủ đích</div>
          <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Delta</div>
          {CASE_REF.map((r, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "13px 12px", borderTop: "1px solid var(--border)", background: r.rowBg, font: "700 12px/1.3 var(--font-brand)", color: r.color }}>{r.round}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.signal}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{r.change}</div>
              <div style={{ padding: "13px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: r.rowBg, font: "italic 800 20px/1 var(--font-serif)", color: r.color }}>{r.metric}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none" }}>Làm Final Exam →</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 1); }} className="cta" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)" }}>Đọc lại Phần 2</a>
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20 → sẵn sàng sang I5.1 — Kiến trúc giải pháp AI (bắt đầu Capstone). Muốn tốt nghiệp sớm? Nộp thêm case study iterate ≥2 vòng có delta thật.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Bạn cần đạt tối thiểu từ ${PASS_SCORE}/20 câu trở lên. Nếu sai nhiều câu 1–9 → đọc lại Phần 1 (Tích hợp vs Demo & AI-fit); từ 10–20 → Phần 2 (Feedback · Iterate · Delta · Cross-team).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I4.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · làm trước khi sang I5.1</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I4.3</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "620px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Tích hợp vs Demo &amp; AI-fit (1–9) · Feedback/Iterate/Delta/Cross-team (10–20). Chọn xong bấm &quot;Nộp bài&quot; để chấm &amp; xem giải thích.</p>

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
