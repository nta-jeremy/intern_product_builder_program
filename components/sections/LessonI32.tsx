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
  { n: "01", short: "Deliverable & Grounding", title: "Deliverable \"dùng được\" & Grounding", time: "~16 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "QC 5 tiêu chí, Edge case & Clinic", title: "QC 5 tiêu chí, Edge case & QC Clinic", time: "~16 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "\"Dùng được\" vs \"trông có vẻ ổn\" & phép thử, 3 loại deliverable (Spec/Prototype/Insight Report), grounding — xương sống của sản phẩm đáng tin, và quy trình AI dựng nhanh + người QC.", tags: ["Dùng được", "3 loại deliverable", "Grounding"] },
  { ...PART_META[1], desc: "Bảng QC 5 tiêu chí (Nguồn gốc · Số liệu · Edge case · Sạch PII · Giá trị), ba nhóm tình huống biên, nhận diện bias, và QC Clinic (tự QC + đánh giá chéo).", tags: ["QC 5 tiêu chí", "Edge case", "QC Clinic"] },
];

const OBJECTIVES = [
  "Phân biệt deliverable \"dùng được\" và \"trông có vẻ ổn\"; hiểu rõ các tiêu chí của một sản phẩm \"dùng được\".",
  "Chọn & xây dựng 1 trong 3 loại deliverable: Product Spec, Clickable Prototype hoặc Insight Report có AI hỗ trợ.",
  "Áp dụng bảng kiểm QC 5 tiêu chí trên chính sản phẩm của mình.",
  "Xử lý các tình huống biên (edge case), nhận diện thiên kiến (bias), và xác thực grounding.",
  "Tự QC + đánh giá chéo (QC Clinic) để phát hiện và sửa lỗi trước khi bàn giao.",
];

const MUST_KNOW = ["Deliverable \"dùng được\"", "QC 5 tiêu chí", "Edge case", "Grounding"];
const NICE_KNOW = ["3 loại deliverable", "Bias (ôn I1.2)", "PII (I1.2)", "Structured output (I2.1)", "QC Clinic"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~32 phút" },
  { k: "Giai đoạn", v: "2 · Tuần 5–8" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL5 🔒 · NL7" },
  { k: "Gate", v: "Không · chuẩn bị Gate 3" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — usable vs looks-ok, deliverable types, grounding
const LOOKS_OK = [
  "Không rõ nguồn gốc số liệu lấy từ đâu.",
  "Chưa tính đến các tình huống biên (edge case).",
  "Có nguy cơ chứa thông tin ảo/bịa (hallucination) từ AI.",
];
const USABLE = [
  "Mọi nhận định đều có nguồn dẫn chứng rõ ràng.",
  "Số liệu kiểm chứng được, tự tính lại chính xác.",
  "Định dạng chuẩn để áp dụng ngay; đã xử lý edge case.",
  "Đã loại bỏ thông tin cá nhân (sạch PII).",
];
const DELIVER_TYPES = [
  { icon: "📄", name: "Product Spec", what: "Bản đặc tả rút gọn: vấn đề → giả thuyết → metric → scope → rủi ro.", when: "Cần thống nhất sẽ làm gì & vì sao trước khi build.", ex: "Spec cho tính năng gợi ý size.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { icon: "📱", name: "Clickable Prototype", what: "Bản thiết kế tương tác (mockup bấm được) mô phỏng luồng thao tác.", when: "Cần thấy & thử trải nghiệm trước khi code.", ex: "Prototype luồng chọn size trên app.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { icon: "📊", name: "Insight Report", what: "Báo cáo insight từ dữ liệu thực tế (có AI trợ giúp).", when: "Cần hiểu vấn đề của khách hàng để ra quyết định.", ex: "Báo cáo phân tích 200 review đổi/trả.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];
const GROUND_RULES = [
  { n: "1", text: "Mỗi insight (nhận định) phải đi kèm bằng chứng cụ thể — trích dẫn phản hồi gốc, số liệu thực tế." },
  { n: "2", text: "Mỗi con số phải ghi rõ nguồn gốc xuất xứ — lấy từ báo cáo nào, cơ sở dữ liệu nào." },
  { n: "3", text: "Nhận định nào không đối chiếu được nguồn rõ ràng → lược bỏ, hoặc ghi chú rõ là giả định/suy đoán." },
];

// Phần 2 — QC 5, edge groups, bias, clinic
const QC5 = [
  { n: "1", name: "Nguồn gốc", check: "Mọi nhận định/kết luận có gắn dẫn chứng hoặc nguồn cụ thể không?", pass: "Mọi insight gắn liền với dẫn chứng gốc.", color: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "2", name: "Số liệu", check: "Số liệu có thể đối chiếu & tự tính lại để xác minh không?", pass: "Số liệu có nguồn thực; tự cộng/đối chiếu lại chính xác.", color: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "3", name: "Edge case", check: "Đã tính đến & có phương án xử lý các tình huống biên chưa?", pass: "Nêu rõ & có phương án xử lý các trường hợp biên chính.", color: "var(--rose-deep)", tint: "var(--rose-tint)" },
  { n: "4", name: "Sạch PII", check: "Đã loại bỏ hoàn toàn PII & thông tin kinh doanh nhạy cảm chưa?", pass: "Không còn PII thật; số liệu mật không đưa ra ngoài.", color: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "5", name: "Giá trị", check: "Đối tượng dùng & mục đích đã rõ chưa? Giá trị thực tế gì?", pass: "Rõ đối tượng tiếp nhận & giá trị thực tế mang lại.", color: "var(--mint-deep)", tint: "var(--mint-tint)" },
];
const EDGE_GROUPS = [
  { icon: "📥", title: "Dữ liệu đầu vào thiếu / bất thường", desc: "Đánh giá trống, nội dung trộn nhiều ngôn ngữ, dữ liệu bị khuyết trường.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
  { icon: "👆", title: "Người dùng thao tác sai thiết kế", desc: "Nhập sai định dạng, bỏ dở giữa chừng, hoặc dùng sai mục đích.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { icon: "⚠️", title: "Hệ thống phát sinh lỗi", desc: "Phản hồi AI rỗng/sai định dạng, mất kết nối hoặc phản hồi chậm (timeout).", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
];
const BIAS_CHECKS = [
  "Dữ liệu đầu vào đã đủ tính đại diện chưa, hay chỉ tập trung vào một nhóm đối tượng? (VD: chỉ thu thập đánh giá 1 sao → kết quả lệch tiêu cực — thiên kiến dữ liệu.)",
  "Nhận định đưa ra có bị ảnh hưởng bởi định kiến xã hội hoặc rập khuôn (giới tính, vùng miền, độ tuổi) không?",
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Deliverable · Grounding", B = "Phần B · QC · Edge case · Clinic";
const EXAM: ExamQ[] = [
  { part: A, q: "Sản phẩm bàn giao \"dùng được\" khác sản phẩm \"trông có vẻ ổn\" ở điểm nào?", opts: ["Trình bày đẹp mắt và nhiều màu sắc hơn", "Người khác tin tưởng để đưa ra quyết định (có dẫn chứng nguồn gốc, kiểm chứng được số liệu, đã tính đến tình huống biên, và bảo mật thông tin cá nhân/PII)", "Có dung lượng dài hơn", "Được tạo nhanh hơn bằng các công cụ AI"], correct: 1, why: "Dùng được = người khác tin tưởng để quyết định: có dẫn chứng, kiểm được số liệu, đã tính edge case, sạch PII. (File 1)" },
  { part: A, q: "\"Phép thử dùng được\" là gì?", opts: ["Đọc lại một lượt thấy xuôi", "Đếm số trang", "Hỏi đồng nghiệp \"bạn có dám dựa vào cái này để quyết định không?\"", "Kiểm tra chính tả"], correct: 2, why: "Phép thử: hỏi đồng nghiệp \"bạn có dám quyết định dựa trên tài liệu này không?\". (File 1)" },
  { part: A, q: "Ba loại sản phẩm bàn giao (deliverable) chính ở giai đoạn này gồm những gì?", opts: ["Email · Slide · Poster truyền thông", "Mã nguồn (Code) · Kịch bản kiểm thử (Test) · Container Docker", "Prompt · Skill · Plugin tích hợp", "Bản đặc tả sản phẩm (Product Spec) · Bản thiết kế tương tác (Clickable Prototype) · Báo cáo phân tích insight (Insight Report)"], correct: 3, why: "Ba loại: Product Spec · Clickable Prototype · Insight Report. (File 1)" },
  { part: A, q: "Trong trường hợp nào bạn nên chọn xây dựng sản phẩm bàn giao kiểu \"clickable prototype\"?", opts: ["Khi cần mô phỏng trực quan và trải nghiệm thử luồng thao tác trước khi lập trình (code)", "Khi cần thống nhất kế hoạch \"sẽ làm gì\" dưới dạng văn bản đặc tả", "Khi cần phân tích tổng hợp insight từ 200 đánh giá của khách hàng", "Khi cần viết mã nguồn chạy thực tế trên hệ thống (production)"], correct: 0, why: "Prototype dùng khi cần thấy & thử luồng thao tác trước khi code. (File 1)" },
  { part: A, q: "Khái niệm \"Grounding\" (đối chiếu thực tế) trong một sản phẩm bàn giao nghĩa là gì?", opts: ["Trình bày định dạng tài liệu thật đẹp mắt và gọn gàng", "Mọi nhận định và số liệu đưa ra phải được đối chiếu, có nguồn dẫn chứng hoặc dữ liệu thực tế rõ ràng", "Sử dụng tối đa các biểu đồ trực quan để minh họa", "Viết nội dung càng ngắn gọn càng tốt"], correct: 1, why: "Grounding = mọi nhận định/số liệu phải có nguồn dẫn chứng hoặc dữ liệu thực tế rõ ràng. (File 1)" },
  { part: A, q: "Một insight không kèm dẫn chứng nên xử lý thế nào?", opts: ["Giữ nguyên vì nghe hợp lý", "Tô đậm cho nổi bật", "Gỡ ra hoặc đánh dấu rõ là giả định", "Nhờ AI viết thêm cho dài"], correct: 2, why: "Insight không rõ nguồn → lược bỏ hoặc ghi chú rõ là giả định/suy đoán. (File 1)" },
  { part: A, q: "Thuật ngữ \"Insight ma\" (insight ảo) dùng để chỉ điều gì?", opts: ["Một nhận định phân tích vô cùng sâu sắc và bất ngờ", "Đánh giá trực tiếp do chính khách hàng ghi lại", "Nhận định có chứa rất nhiều số liệu thống kê đi kèm", "Nhận định do AI tự suy diễn hoặc bịa ra mà không có căn cứ trong dữ liệu gốc (không đối chiếu được nguồn)"], correct: 3, why: "Insight ma = nhận định AI tự suy diễn/bịa, không có căn cứ trong dữ liệu gốc. (File 1)" },
  { part: A, q: "Quy trình làm việc hiệu quả và an toàn khi xây dựng sản phẩm bàn giao có sự hỗ trợ của AI là gì?", opts: ["Dùng AI dựng nhanh bản thảo ban đầu → Con người kiểm định (QC) kỹ lưỡng bằng tay trước khi bàn giao", "Ngay khi AI vừa dựng xong bản thảo thì thực hiện bàn giao ngay lập tức", "Tuyệt đối không được phép sử dụng bất kỳ công cụ AI nào để hỗ trợ công việc", "Chỉ thực hiện kiểm tra chất lượng (QC) khi nhận được phản hồi phàn nàn từ người dùng"], correct: 0, why: "Quy trình an toàn: AI dựng nhanh bản thảo → con người QC kỹ bằng tay trước khi bàn giao. (File 1)" },
  { part: A, q: "Vì sao sản phẩm bàn giao dưới tên bạn hoặc đội ngũ của bạn bắt buộc phải đảm bảo tính đáng tin cậy (tinh thần diligence)?", opts: ["Vì đó là sở thích cá nhân của người chấm bài (mentor)", "Vì bạn và đội ngũ của mình phải chịu trách nhiệm hoàn toàn về độ chính xác và tính an toàn của sản phẩm, không thể đổ lỗi cho AI", "Vì đây là tiêu chí để bạn nhận được điểm số cao trong buổi học", "Vì các công cụ AI yêu cầu người dùng phải tuân thủ điều đó"], correct: 1, why: "Diligence: bạn chịu trách nhiệm hoàn toàn về độ chính xác & an toàn của sản phẩm, không đổ lỗi cho AI. (File 1, nối I1.2)" },
  { part: B, q: "Quy trình kiểm soát chất lượng cấp sản phẩm (Product QC) đúng nghĩa là gì?", opts: ["Đọc lướt qua một lượt thấy trôi chảy là đạt yêu cầu", "Sử dụng các công cụ AI để tự động kiểm tra toàn bộ chất lượng", "Đối chiếu nghiêm ngặt theo một bảng tiêu chí cố định và xác minh từng mục có dẫn chứng đi kèm", "Chỉ tập trung kiểm tra lỗi chính tả và định dạng văn bản"], correct: 2, why: "Product QC = đối chiếu nghiêm ngặt theo bảng tiêu chí cố định, xác minh từng mục có dẫn chứng. (File 2)" },
  { part: B, q: "Bảng kiểm QC 5 tiêu chí để đảm bảo chất lượng sản phẩm bao gồm những gì?", opts: ["Token · Chi phí (Cost) · Độ trễ (Latency) · Độ chính xác (Accuracy) · Thiên kiến (Bias)", "Vai trò (Role) · Định dạng (Format) · Ràng buộc · Ví dụ · Định dạng mẫu (Schema)", "Đầu vào (Input) · AI · Đầu ra (Output) · Đánh giá (Review) · Vòng lặp (Loop)", "Nguồn gốc · Số liệu · Tình huống biên (Edge case) · Bảo mật thông tin (Sạch PII) · Giá trị thực tế"], correct: 3, why: "5 tiêu chí: Nguồn gốc · Số liệu · Edge case · Sạch PII · Giá trị thực tế. (File 2)" },
  { part: B, q: "Nếu một sản phẩm bàn giao (deliverable) thiếu 1 trong 5 tiêu chí QC thì sao?", opts: ["Chưa đạt — phải vá rồi kiểm lại", "Vẫn đạt nếu 4 mục kia tốt", "Đạt nếu trình bày đẹp", "Tùy cảm tính người review"], correct: 0, why: "Thiếu bất kỳ tiêu chí nào = chưa đạt, bắt buộc vá lỗi và kiểm lại. (File 2)" },
  { part: B, q: "\"Edge case\" là gì?", opts: ["Trường hợp phổ biến nhất", "Các tình huống ngoài luồng thuận — nơi deliverable dễ sai nhất", "Một loại metric", "Một bước trong RAG"], correct: 1, why: "Edge case = tình huống ngoài luồng vận hành lý tưởng, nơi sản phẩm dễ bị lỗi nhất. (File 2)" },
  { part: B, q: "Với insight report từ 200 review, đâu là một edge case cần xử lý?", opts: ["Các review 5 sao rõ ràng", "Review viết đúng chính tả", "Review lẫn tiếng Việt–Anh hoặc chỉ có emoji → AI phân loại thế nào?", "Review có đầy đủ thông tin"], correct: 2, why: "Review trộn nhiều ngôn ngữ hoặc chỉ chứa emoji là edge case thực tế cần nêu cách xử lý. (File 2)" },
  { part: B, q: "Hành động \"chỉ lấy các đánh giá 1 sao của khách hàng để phân tích chất lượng dịch vụ\" sẽ tạo ra vấn đề gì?", opts: ["Giúp tiết kiệm lượng tài nguyên xử lý (token) của AI", "Tăng tính chính xác cho các giải pháp cải tiến chất lượng", "Không gây ra bất kỳ vấn đề gì ảnh hưởng đến kết quả", "Thiên kiến (Bias) — Đưa ra bức tranh phiến diện (lệch sang hướng tiêu cực) do dữ liệu thu thập không có tính đại diện"], correct: 3, why: "Chỉ lấy đánh giá 1 sao → bias vì dữ liệu không có tính đại diện, lệch tiêu cực. (File 2, nối I1.2)" },
  { part: B, q: "Ở cấp độ năng lực L2, bạn cần làm gì đối với thiên kiến (bias) trong sản phẩm bàn giao?", opts: ["Nhận diện và nêu rõ được các rủi ro thiên kiến khi chúng xuất hiện", "Thiết kế thuật toán tự động khử thiên kiến ở cấp độ hệ thống", "Bỏ qua vì đây là nhiệm vụ của nhân sự cấp độ L4 trở lên", "Tăng tham số ngẫu nhiên (temperature) của AI để tự động giảm thiên kiến"], correct: 0, why: "Ở L2: chỉ cần nhận diện & nêu rõ rủi ro bias; khử ở cấp hệ thống là của L4. (File 2)" },
  { part: B, q: "\"QC Clinic\" gồm những bước nào?", opts: ["Chỉ tự đọc lại một mình", "Tự QC theo 5 tiêu chí, rồi nhờ một người khác đánh giá chéo (peer review)", "Nhờ AI chấm điểm", "Gửi thẳng cho khách để họ góp ý"], correct: 1, why: "QC Clinic = tự QC theo 5 tiêu chí trước, rồi nhờ đồng nghiệp đánh giá chéo. (File 2)" },
  { part: B, q: "Tại sao quy trình đánh giá chéo (peer review) lại giúp phát hiện ra các lỗi sai mà bản thân người tự QC dễ dàng bỏ sót?", opts: ["Vì người đánh giá chéo luôn có trình độ giỏi hơn tác giả sản phẩm", "Vì người đánh giá chéo có nhiều quỹ thời gian hơn để nghiên cứu tài liệu", "Vì người đánh giá độc lập sẽ xem xét dưới góc nhìn khách quan của người dùng thực tế, phát hiện lỗi mà tác giả vô tình bỏ sót do quá quen thuộc với tài liệu", "Vì người đánh giá chéo sử dụng các công cụ kiểm tra tự động khác biệt"], correct: 2, why: "Người đánh giá độc lập nhìn khách quan như người dùng thực, bắt lỗi tác giả bỏ sót do quá quen. (File 2)" },
  { part: B, q: "Trước khi chia sẻ sản phẩm bàn giao, bạn phải đảm bảo yêu cầu nào dưới đây về vấn đề bảo mật thông tin (PII)?", opts: ["Tài liệu chứa thật nhiều số liệu thống kê chi tiết", "Hình thức trình bày của tài liệu phải thật đẹp mắt và chuyên nghiệp", "Nội dung tài liệu bắt buộc phải được dịch viết hoàn toàn bằng tiếng Anh", "Đã loại bỏ hoàn toàn thông tin cá nhân (PII) thực tế; số liệu mật hoặc bí mật kinh doanh của doanh nghiệp không bị rò rỉ ra ngoài"], correct: 3, why: "PII: đã loại bỏ hoàn toàn PII thật; số liệu mật/bí mật kinh doanh không rò rỉ ra ngoài. (File 2, nối I1.2)" },
  { part: B, q: "Sản phẩm bàn giao đã qua QC của buổi này dùng để làm gì tiếp theo?", opts: ["Mang đi bảo vệ & cải tiến liên tục (iterate) trước mentor ở Gate 3 (I3.3)", "Xóa đi làm lại từ đầu", "Nộp thẳng cho khách hàng ngay", "Lưu trữ và không dùng nữa"], correct: 0, why: "Deliverable đã qua QC dùng để bảo vệ & cải tiến liên tục trước mentor ở Gate 3 (I3.3). (File 2)" },
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

export function LessonI32() {
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
    <div data-screen-label="Tổng quan I3.2">
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
        <span>Giai đoạn 2 · Tuần 5–8</span>
        {chevR()}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I3.2 · Build Deliverable &amp; Quality Control</span>
      </div>

      <div
        className="i32-overview-grid"
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
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I3.2 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "8px 13px", borderRadius: "999px" }}>✦ Buổi tích lũy · chuẩn bị Gate 3</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL5 🔒 · NL7</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Build Deliverable &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Quality Control</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Đây là buổi bạn <b style={{ color: "var(--fg-1)" }}>tạo ra một sản phẩm bàn giao thật</b> — không còn là bài tập lẻ. Ranh giới quyết định: một deliverable <em style={{ fontStyle: "italic" }}>&quot;dùng được&quot;</em> (người khác dám tin cậy) khác hẳn thứ <em style={{ fontStyle: "italic" }}>&quot;trông có vẻ ổn&quot;</em>. Kỹ năng cốt lõi: <em style={{ fontStyle: "italic" }}>kiểm soát chất lượng cấp sản phẩm (Product QC)</em> — một quy trình có hệ thống, không phải đọc lướt.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~32</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Bạn đã biết dựng quy trình nhiều bước (I3.1). Giờ bạn dùng <b style={{ color: "var(--fg-1)" }}>NL5 (prompt &amp; tool)</b> để <b style={{ color: "var(--fg-1)" }}>tạo ra một sản phẩm bàn giao thật</b>, và <b style={{ color: "var(--fg-1)" }}>NL7 (QC/an toàn)</b> để <b style={{ color: "var(--fg-1)" }}>kiểm soát chất lượng</b> trước khi bàn giao. Một sản phẩm &quot;dùng được&quot; là thứ người khác <b style={{ color: "var(--fg-1)" }}>dám tin cậy để ra quyết định</b> — có dẫn chứng, số liệu kiểm được, đã tính đến tình huống biên và sạch PII. Sản phẩm của buổi này chính là <b style={{ color: "var(--fg-1)" }}>tư liệu bạn mang đi bảo vệ ở Gate 3 (I3.3)</b>.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~32 phút</span>
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

          <section style={{ marginTop: "40px", border: "1px solid var(--mint)", borderRadius: "12px", overflow: "hidden", background: "var(--mint-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--mint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", color: "#fff" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
              </div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--mint-deep)", marginBottom: "7px" }}>Buổi tích lũy — không có Gate</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Sản phẩm của buổi = tư liệu bảo vệ ở Gate 3</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Buổi này <b style={{ color: "var(--fg-1)" }}>không phải buổi đánh giá Gate</b>, nhưng bạn phải hoàn thiện <b style={{ color: "var(--fg-1)" }}>một deliverable đã qua QC 5 tiêu chí + hồ sơ chứng minh</b> để mang đi bảo vệ ở <b style={{ color: "var(--fg-1)" }}>I3.3 — Mentor Review (Gate 3)</b>. Hoàn tất bằng Final Exam trước khi sang I3.3.</p>
              </div>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{checklistIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang buổi tiếp theo: đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I3.3 — Mentor Review &amp; Iterate (Gate 3)</b>.</p>
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
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Ở L2 chỉ cần nhận diện &amp; nêu rõ rủi ro bias; khử bias ở cấp hệ thống là L4+.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I3.1 (Agentic Workflows &amp; RAG)</b> → buổi tích lũy <b style={{ color: "var(--fg-1)" }}>NL5 🔒 · NL7</b> → sang <b style={{ color: "var(--fg-1)" }}>I3.3 (Mentor Review — Gate 3)</b>.</p>
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
    { title: "Deliverable \"dùng được\" & Grounding", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "QC 5 tiêu chí, Edge case & Clinic", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "Final Exam · 20 câu →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("exam") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i32-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i32-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.2
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
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="kh-toc" style={{ display: "flex", gap: "12px", alignItems: "center", padding: "11px 12px", borderRadius: "9px", textDecoration: "none", marginTop: "6px", border: "1px dashed var(--iris)", background: "var(--iris-tint)" }}>
            <span style={{ color: "var(--iris-deep)", flex: "none", display: "flex" }}>{checklistIcon}</span>
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Final Exam · 20 câu</span>
          </a>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <article style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 48px 96px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)", marginBottom: "22px" }}>
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I3.2</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>M</span>ột sản phẩm bàn giao được AI hỗ trợ rất dễ <b>tạo cảm giác &quot;ổn&quot;</b>: trình bày đẹp, câu chữ trôi chảy, số liệu đầy đủ. Nhưng &quot;trông ổn&quot; và &quot;dùng được&quot; là hai chuyện hoàn toàn khác. Đây là chuẩn của một Product Builder: sản phẩm dưới tên bạn phải <b>đáng tin cậy để người khác dùng &amp; đánh giá</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · &quot;Dùng được&quot; khác &quot;trông có vẻ ổn&quot;</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "20px 22px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--rose-deep)", marginBottom: "12px" }}>✕ TRÔNG CÓ VẺ ỔN</div>
            <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)", marginBottom: "14px" }}>Đọc lướt thấy trôi chảy, nhưng <b>không ai dám dựa vào để quyết định</b>.</div>
            {LOOKS_OK.map((x, i) => (
              <div key={i} style={{ display: "flex", gap: "9px", alignItems: "baseline", padding: "6px 0", font: "13.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>
                <span style={{ color: "var(--rose-deep)", flex: "none", fontWeight: 800 }}>✕</span>
                <span>{x}</span>
              </div>
            ))}
          </div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "20px 22px" }}>
            <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".1em", color: "var(--mint-deep)", marginBottom: "12px" }}>✓ DÙNG ĐƯỢC</div>
            <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)", marginBottom: "14px" }}>Người khác <b>tin tưởng để sử dụng &amp; đánh giá</b> — mọi nhận định có căn cứ.</div>
            {USABLE.map((x, i) => (
              <div key={i} style={{ display: "flex", gap: "9px", alignItems: "baseline", padding: "6px 0", font: "13.5px/1.5 var(--font-body)", color: "var(--fg-1)" }}>
                <span style={{ color: "var(--mint-deep)", flex: "none", fontWeight: 800 }}>✓</span>
                <span>{x}</span>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — &quot;Dùng được&quot; = người khác DÁM dựa vào để quyết định.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Phép thử &quot;dùng được&quot;</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Gửi sản phẩm cho một đồng nghiệp và hỏi: <i>&quot;Bạn có dám quyết định dựa trên tài liệu này không?&quot;</i>. Nếu họ ngần ngại vì <i>&quot;không rõ số liệu này lấy từ đâu&quot;</i> — sản phẩm mới chỉ dừng ở mức &quot;trông ổn&quot;. Đây là tinh thần cẩn trọng (diligence) đã học ở I1.2.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Ba loại deliverable ở giai đoạn này</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Bạn chọn <b style={{ color: "var(--fg-1)" }}>một</b> loại phù hợp với bài toán. Cả ba đều xây trên những gì đã học (prompt &amp; structured output · I2.1; grounding &amp; PII · I1.2; workflow · I3.1) — và loại nào cũng phải đạt chuẩn &quot;dùng được&quot;.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {DELIVER_TYPES.map((d, i) => (
            <div key={i} style={{ border: `1px solid ${d.border}`, borderRadius: "12px", background: d.bg, padding: "16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ font: "700 22px/1 var(--font-serif)", fontStyle: "italic", color: d.color }}>{d.icon}</span>
              <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)" }}>{d.name}</div>
              <div style={{ font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{d.what}</div>
              <div style={{ font: "11px/1.4 var(--font-mono)", color: d.color, borderTop: "1px dashed var(--border)", paddingTop: "7px", marginTop: "auto" }}>DÙNG KHI</div>
              <div style={{ font: "12px/1.45 var(--font-body)", color: "var(--fg-1)" }}>{d.when}</div>
              <div style={{ font: "italic 11.5px/1.45 var(--font-body)", color: "var(--fg-3)", borderTop: "1px dashed var(--border)", paddingTop: "7px" }}>VD YODY: {d.ex}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "12px", border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "12px 16px", font: "13.5px/1.55 var(--font-body)", color: "var(--iris-deep)", textAlign: "center" }}>Loại nào cũng phải <b>&quot;dùng được&quot;</b> — có nguồn, kiểm được số liệu, sạch PII.</div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Chọn 1 trong 3 loại deliverable theo bài toán thực tế.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Grounding — xương sống của sản phẩm đáng tin</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Nhắc lại I1.2 và I2.3: <b>grounding (đối chiếu thực tế)</b> nghĩa là mọi nhận định hoặc số liệu đều phải được xác thực bằng nguồn dữ liệu cụ thể. Trong sản phẩm bàn giao:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 22px" }}>
        {GROUND_RULES.map((g, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ width: "26px", height: "26px", flex: "none", borderRadius: "7px", background: "var(--iris-tint)", color: "var(--iris-deep)", font: "700 13px/26px var(--font-numeric)", textAlign: "center" }}>{g.n}</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{g.text}</div>
          </div>
        ))}
      </div>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "20px 22px", display: "flex", alignItems: "stretch", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 220, border: "1px solid var(--gold-deep)", borderRadius: "11px", background: "var(--gold-tint)", padding: "14px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "7px" }}>NHẬN ĐỊNH</div>
            <div style={{ font: "14px/1.55 var(--font-body)", color: "var(--fg-1)" }}>&quot;Khách hàng bận tâm nhất về độ bền của khóa kéo.&quot;</div>
          </div>
          <span style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "22px" }}>+</span>
          <div style={{ flex: 1, minWidth: 220, border: "1px solid var(--mint)", borderRadius: "11px", background: "var(--mint-tint)", padding: "14px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "7px" }}>BẰNG CHỨNG GỐC</div>
            <div style={{ font: "14px/1.55 var(--font-body)", color: "var(--fg-1)" }}>&quot;18/200 đánh giá nhắc khóa kéo hỏng sớm — ví dụ #2, #11, #27…&quot;</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Thiếu dẫn chứng thực tế đi kèm → chỉ là &quot;insight ma&quot; (insight ảo).</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>Grounding chính là yếu tố biến sản phẩm từ &quot;trông có vẻ ổn&quot; thành &quot;dùng được&quot;: người đánh giá tự lần theo nguồn để đối chứng nên họ <b style={{ color: "var(--fg-1)" }}>tin tưởng</b>.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · AI dựng bản thảo nhanh, người QC kỹ lưỡng</h2>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "12px 15px", borderRadius: "9px", textAlign: "center", maxWidth: "200px" }}>AI dựng bản thảo theo schema có sẵn cột &quot;nguồn gốc&quot;</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "700 12px/1.3 var(--font-brand)", color: "#fff", background: "var(--gold-deep)", padding: "12px 15px", borderRadius: "9px" }}>🛑 CON NGƯỜI QC</span>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "12px 15px", borderRadius: "9px", textAlign: "center", maxWidth: "180px" }}>Bàn giao sản phẩm &quot;dùng được&quot;</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 4 — AI đẩy nhanh bản thảo; con người chịu trách nhiệm QC cuối cùng.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Không bao giờ bàn giao ngay:</b> dùng prompt có cấu trúc (I2.1) để AI xuất bản thảo đúng schema có cột dẫn chứng, rồi <b>bắt buộc</b> chạy quy trình QC (Phần 2) trước khi bàn giao.
      </div>

      <TldrDark items={[
        "<b>&quot;Dùng được&quot; ≠ &quot;Trông có vẻ ổn&quot;</b>: dùng được là khi người khác tin cậy để quyết định — có dẫn chứng, kiểm được số liệu, đã tính edge case, sạch PII.",
        "Ba loại deliverable — <b>Product Spec · Clickable Prototype · Insight Report</b> — chọn theo bài toán, nhưng loại nào cũng phải đạt chuẩn &quot;dùng được&quot;.",
        "<b>Grounding</b> (mọi nhận định/số liệu có nguồn rõ ràng) là xương sống của sản phẩm đáng tin; AI dựng nhanh bản thảo, con người thực hiện QC.",
      ]} />

      <SelfCheck items={[
        "Áp dụng &quot;phép thử dùng được&quot;: nêu 2 câu hỏi bạn sẽ hỏi đồng nghiệp để biết sản phẩm đã &quot;dùng được&quot; thực sự chưa.",
        "Với một bài toán thực tế tại YODY, bạn chọn loại deliverable nào trong 3 loại? Giải thích lý do.",
        "Khi phát hiện một insight không có dẫn chứng đi kèm, bạn xử lý thế nào?",
        "Vì sao quy trình &quot;dựng bản thảo bằng AI rồi bàn giao ngay&quot; lại tiềm ẩn rủi ro lớn?",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>N</span>hiều người mới &quot;kiểm tra chất lượng&quot; bằng cách đọc lướt một lượt thấy trôi chảy là xong. Đó không phải QC thực sự. <b>QC ở cấp độ sản phẩm (Product QC)</b> đòi hỏi đối chiếu nghiêm ngặt theo một <b>bảng tiêu chí cố định</b> và xác minh từng mục có dẫn chứng — chỉ cần thiếu một tiêu chí là <b>chưa đạt</b>, bắt buộc vá lỗi và kiểm lại.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Bảng QC 5 tiêu chí</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Chạy đủ 5 tiêu chí này trên mọi deliverable trước khi bàn giao:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "34px 1fr 1.2fr" }}>
            <div style={{ background: "var(--bg-ink)", padding: "12px 10px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>#</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Tiêu chí · câu hỏi kiểm</div>
            <div style={{ background: "var(--bg-ink)", padding: "12px 14px", font: "700 11px/1.3 var(--font-mono)", color: "#fff", borderLeft: "1px solid rgba(255,255,255,.14)" }}>Đạt khi</div>
            {QC5.map((c, i) => (
              <div key={i} style={{ display: "contents" }}>
                <div style={{ padding: "14px 10px", borderTop: "1px solid var(--border)", background: "#fff", textAlign: "center" }}>
                  <span style={{ width: "24px", height: "24px", display: "inline-block", borderRadius: "6px", background: c.tint, color: c.color, font: "700 12px/24px var(--font-numeric)" }}>{c.n}</span>
                </div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>
                  <div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--fg-1)", marginBottom: "3px" }}>{c.name}</div>
                  <div style={{ font: "12.5px/1.5 var(--font-body)", color: "var(--fg-2)" }}>{c.check}</div>
                </div>
                <div style={{ padding: "14px 14px", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff", font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>{c.pass}</div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — QC là chạy bảng tiêu chí, không phải đọc lướt.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rose-deep)", marginBottom: "8px" }}>Nguyên tắc</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Thiếu <b>bất kỳ</b> mục nào = <b>CHƯA ĐẠT</b>. QC không phải thủ tục hình thức — nó là chốt chặn cuối cùng bảo vệ chất lượng công việc của bạn trước khi bàn giao.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Edge case — nơi sản phẩm dễ bị lỗi nhất</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>Edge case (tình huống biên)</b> là các kịch bản nằm ngoài luồng vận hành lý tưởng (luồng thuận) — nơi sản phẩm hoặc nhận định phân tích dễ bị lỗi nhất. AI (và người mới) thường chỉ tập trung vào luồng thuận, nên đây là khu vực người làm QC phải soi cực kỹ. Ba nhóm phổ biến:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          {EDGE_GROUPS.map((e, i) => (
            <div key={i} style={{ border: `1px solid ${e.border}`, borderRadius: "12px", background: e.bg, padding: "16px 16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "24px", lineHeight: "1" }}>{e.icon}</span>
              <div style={{ font: "700 14px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>{e.title}</div>
              <div style={{ font: "12.5px/1.55 var(--font-body)", color: "var(--fg-2)" }}>{e.desc}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Ba nhóm tình huống biên cần soi khi làm QC.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Báo cáo insight từ 200 review: nếu có 30 phản hồi trộn lẫn tiếng Anh–Việt, hoặc 10 phản hồi chỉ chứa emoji — AI phân loại thế nào? Sản phẩm &quot;dùng được&quot; phải nêu rõ phương án xử lý (loại bỏ, xếp nhóm &quot;không xác định&quot;, hoặc gắn cờ cho con người xử lý thủ công).</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Nhận diện thiên kiến (bias)</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Nhắc lại I1.2: <b>bias</b> có thể xuất hiện từ khâu thu thập dữ liệu đầu vào hoặc qua cách AI diễn giải. Khi làm QC, hãy tự vấn:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {BIAS_CHECKS.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "11px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ color: "var(--gold-deep)", flex: "none", fontSize: "18px", lineHeight: "1.3" }}>?</span>
            <div style={{ font: "14.5px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{b}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--gold-deep)" }}>Ở cấp độ L2:</b> bạn chưa cần thiết kế thuật toán tự động khử bias ở cấp hệ thống (việc của L4+), nhưng <b>bắt buộc phải nhận diện và nêu rõ các rủi ro thiên kiến</b> này trong báo cáo.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · QC Clinic — tự kiểm định &amp; đánh giá chéo</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Chúng ta thường khó tự phát hiện lỗi của chính mình do thói quen. <b>QC Clinic</b> là quy trình đánh giá kết hợp:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: 1, minWidth: 200, border: "1px solid var(--iris)", borderRadius: "11px", background: "var(--iris-tint)", padding: "15px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "6px" }}>BƯỚC 1 · TỰ QC</div>
            <div style={{ font: "13.5px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Tác giả tự kiểm định theo bảng 5 tiêu chí &amp; chủ động vá lỗi phát hiện được.</div>
          </div>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>→</span>
          <div style={{ flex: 1, minWidth: 200, border: "1px solid var(--mint)", borderRadius: "11px", background: "var(--mint-tint)", padding: "15px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "6px" }}>BƯỚC 2 · ĐÁNH GIÁ CHÉO</div>
            <div style={{ font: "13.5px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Đồng nghiệp review chéo cùng hệ tiêu chí, bắt lỗi thiếu dẫn chứng / edge case bị bỏ quên.</div>
          </div>
          <span style={{ color: "var(--fg-3)", fontSize: "20px" }}>↺</span>
          <div style={{ flex: 1, minWidth: 160, border: "1px dashed var(--gold-deep)", borderRadius: "11px", background: "var(--gold-tint)", padding: "15px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "6px" }}>VÁ LỖI</div>
            <div style={{ font: "13.5px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Sửa theo phản hồi rồi kiểm lại đến khi đạt cả 5 tiêu chí.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — QC Clinic: tự QC rồi nhờ người khác soi chéo.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        Đây là bước tập dượt quan trọng cho <b style={{ color: "var(--iris-deep)" }}>I3.3 (Mentor Review — Gate 3)</b>: bạn sẽ bảo vệ sản phẩm trước mentor và cải tiến liên tục (iterate) theo phản hồi. Hãy coi phản hồi là <b>nguồn dữ liệu quý</b> giúp hoàn thiện sản phẩm, thay vì là sự chỉ trích cá nhân.
      </div>

      <TldrDark items={[
        "<b>Product QC = đối chiếu theo bảng 5 tiêu chí</b> (Nguồn gốc · Số liệu · Edge case · Sạch PII · Giá trị); thiếu bất kỳ tiêu chí nào đều tính chưa đạt.",
        "<b>Edge case</b> (thiếu dữ liệu, thao tác sai thiết kế, lỗi hệ thống) là nơi sản phẩm dễ lỗi nhất — phải xác định &amp; xử lý; đồng thời nhận diện <b>bias</b> trong dữ liệu &amp; phân tích.",
        "<b>QC Clinic</b>: tự QC trước rồi nhờ đồng nghiệp đánh giá chéo — bắt các lỗi tác giả bỏ sót do đã quá quen, chuẩn bị tốt cho Gate 3.",
      ]} />

      <SelfCheck items={[
        "Liệt kê 5 tiêu chí Product QC và nêu một câu hỏi kiểm tương ứng cho từng tiêu chí.",
        "Với báo cáo insight từ 200 phản hồi, chỉ ra 2 edge case có thể gặp và đề xuất cách xử lý.",
        "Việc &quot;chỉ chọn các đánh giá 1 sao để phân tích&quot; sẽ tạo ra loại bias nào?",
        "Giải thích vì sao đánh giá chéo giúp phát hiện các lỗi mà người tự QC dễ bỏ sót.",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã có công cụ tạo &amp; kiểm deliverable 🎯</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Giờ làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu) và hoàn thiện deliverable đã qua QC để mang sang <b style={{ color: "var(--fg-1)" }}>I3.3 (Gate 3)</b>.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none" }}>Làm Final Exam →</a>
      </div>
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20 → nắm chắc NL5 & NL7, sẵn sàng sang I3.3 — Mentor Review & Iterate (Gate 3).`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–9 → đọc lại Phần 1 (Deliverable & Grounding); 10–20 → Phần 2 (QC 5 tiêu chí, Edge case & Clinic).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.2
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · làm trước khi sang I3.3</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I3.2</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Deliverable &quot;dùng được&quot; &amp; Grounding (1–9) · QC 5 tiêu chí, Edge case &amp; QC Clinic (10–20). Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.</p>

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
