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
const SHOW_TERMS = true;

const PART_META = [
  { n: "01", short: "Thấu cảm & Empathy Map", title: "Thấu cảm, Insight & Empathy Map", time: "~18 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Journey, HMW & Ideation", title: "User Journey, How-Might-We & Ideation", time: "~16 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Say-do gap, phỏng vấn & quan sát đúng cách, phân biệt insight với tóm tắt (\"so what\"), bản đồ thấu cảm 4 ô, dùng AI để rút insight có kỷ luật.", tags: ["Say-do gap", "Empathy map", "Grounding & PII"] },
  { ...PART_META[1], desc: "Bản đồ hành trình người dùng, How-Might-We, ideation phân kỳ–hội tụ, hai tiêu chí lọc ý (đáng làm · kiểm chứng), và Báo cáo Insight Người dùng.", tags: ["User journey", "How-Might-We", "Ideation"] },
];

const OBJECTIVES = [
  "Phân biệt \"điều người dùng nói\" với \"nhu cầu thực tế\" (say-do gap) và giải thích vì sao có sự khác biệt.",
  "Khai thác insight qua phỏng vấn và quan sát đúng cách (sử dụng câu hỏi mở, tập trung vào hành vi thực tế, tránh câu hỏi mang tính gợi ý/định hướng).",
  "Lập bản đồ thấu cảm (empathy map) và bản đồ hành trình người dùng (user journey map) cho một tình huống thực tế tại YODY.",
  "Viết How-Might-We (HMW) từ pain point, brainstorm ý tưởng và lọc ra các ý tưởng có thể kiểm chứng được.",
  "Dùng AI (kết nối với buổi I2.1) để phân tích phản hồi của khách hàng — đảm bảo tính đối chiếu thực tế (grounding) và bảo mật thông tin cá nhân (PII) (kết nối với buổi I1.2).",
];

const MUST_KNOW = ["Say-do gap", "User insight", "Phỏng vấn / quan sát", "Empathy map", "User journey", "How-Might-We", "Ideation & lọc ý"];
const NICE_KNOW = ["Grounding & PII (I1.2)", "Prompting & Multimodal (I2.1)", "Outcome / testable (I1.2)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~34 phút" },
  { k: "Giai đoạn", v: "1 · Tuần 1–4" },
  { k: "Cấp độ", v: "L1 → L2" },
  { k: "Năng lực", v: "NL3 🔒" },
  { k: "Gate", v: "— (tích lũy)" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

const empathy = [
  { label: "NÓI (Says)", icon: "💬", q: "Họ nói gì (nguyên văn)?", ex: "\"Áo mặc bị nóng\", \"màu sắc nhạt hơn trên ảnh quảng cáo\"", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { label: "NGHĨ (Thinks)", icon: "💭", q: "Họ nghĩ/lo gì mà không nói ra?", ex: "\"Không biết mặc lên dáng có hợp không\", \"lo ngại mua hàng trực tuyến bị sai kích cỡ (size)\"", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { label: "LÀM (Does)", icon: "🖐️", q: "Họ hành động thế nào?", ex: "Kiểm tra kỹ nhãn size, hỏi ý kiến bạn bè, đọc các bài đánh giá (review) trước khi quyết định mua", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
  { label: "CẢM (Feels)", icon: "❤️", q: "Họ cảm thấy gì?", ex: "Cảm thấy bối rối khi chọn kích cỡ, cảm giác phiền hà khi phải thực hiện đổi trả hàng", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
];

const aiRules = [
  { tag: "Prompting · I2.1", c: "var(--iris-deep)", tint: "var(--iris-tint)", text: "Phân tích (gán nhãn → gom cụm → rút ra insight có giải nghĩa \"so what\") + yêu cầu định dạng đầu ra chuẩn (structured output) để điền vào bản đồ thấu cảm." },
  { tag: "Grounding · I1.2", c: "var(--gold-deep)", tint: "var(--gold-tint)", text: "Yêu cầu AI trích dẫn nguyên văn phản hồi gốc để làm minh chứng cho từng insight; nếu không trích dẫn được nguồn cụ thể, đó là \"insight không căn cứ\" và phải loại bỏ." },
  { tag: "PII · I1.2", c: "var(--rose-deep)", tint: "var(--rose-tint)", text: "Che/ẩn tên, số điện thoại hoặc các thông tin cá nhân nhạy cảm trong phản hồi trước khi đưa vào các mô hình AI công cộng." },
  { tag: "Multimodal · I2.1", c: "var(--mint-deep)", tint: "var(--mint-tint)", text: "Nếu phản hồi là ảnh chụp màn hình, bạn có thể tải ảnh lên — nhưng hãy nhớ che/ẩn thông tin cá nhân (PII) trên ảnh trước." },
];

const journey = [
  { stage: "Biết đến", action: "Thấy quảng cáo, lướt app", pain: "Chưa rõ áo phù hợp cho dịp/hoàn cảnh nào", emotion: "Tò mò", emo: "🤔", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", dipH: "14px", dipColor: "var(--mint)" },
  { stage: "Cân nhắc", action: "Xem ảnh, đọc mô tả, review", pain: "Màu sắc sản phẩm trên ảnh khác với thực tế; phân vân khi chọn kích cỡ (size)", emotion: "Bối rối", emo: "😕", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", dipH: "26px", dipColor: "var(--gold)" },
  { stage: "Mua", action: "Chọn size, thanh toán", pain: "Lo lắng chọn sai kích cỡ, thiếu sự tư vấn trực tiếp", emotion: "Lo lắng", emo: "😰", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", dipH: "48px", dipColor: "var(--rose-deep)" },
  { stage: "Nhận & dùng", action: "Mặc thử", pain: "Sản phẩm bị sai kích cỡ hoặc màu sắc lệch so với kỳ vọng", emotion: "Thất vọng", emo: "😞", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", dipH: "44px", dipColor: "var(--rose-deep)" },
  { stage: "Sau bán", action: "Đổi trả, phản hồi", pain: "Quy trình đổi trả hàng phức tạp, rườm rà", emotion: "Ngại/mệt", emo: "😮‍💨", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", dipH: "30px", dipColor: "var(--gold)" },
];

const hmw = [
  { n: "1", title: "Không quá rộng", desc: "\"Làm sao để khách hàng hài lòng?\" — câu hỏi này không mang lại giá trị thực tế vì quá chung chung.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badge: "var(--rose-deep)" },
  { n: "2", title: "Không quá hẹp (tránh đưa sẵn giải pháp)", desc: "\"Làm sao để thêm nút gợi ý size bằng AI?\" — câu hỏi này đã định hình sẵn giải pháp cụ thể, làm hạn chế các ý tưởng sáng tạo khác.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badge: "var(--gold-deep)" },
  { n: "3", title: "Tập trung đúng pain point cốt lõi", desc: "Rút từ empathy map/journey, duy trì ở mức độ \"vừa đủ rộng để kích hoạt tính sáng tạo, đồng thời đủ hẹp để có thể triển khai hành động\".", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", badge: "var(--iris)" },
];

const ideas = [
  { idea: "Gợi ý kích cỡ (size) dựa trên chiều cao/cân nặng", measure: "Đo lường sự thay đổi của tỉ lệ đổi trả hàng do sai kích cỡ trước và sau khi áp dụng tính năng.", tag: "✓ Testable", badge: "var(--mint-deep)", border: "var(--mint)" },
  { idea: "Bảng quy đổi kích cỡ trực quan hơn", measure: "Thử nghiệm A/B để đo lường tỉ lệ hoàn tất đơn hàng.", tag: "✓ Testable", badge: "var(--mint-deep)", border: "var(--mint)" },
  { idea: "Tính năng hiển thị \"Hình ảnh thực tế từ khách hàng có cùng vóc dáng\"", measure: "Đo lường tỉ lệ người dùng bấm xem và tỉ lệ chuyển đổi mua hàng tương ứng.", tag: "✓ Testable", badge: "var(--mint-deep)", border: "var(--mint)" },
  { idea: "Tạm thời hoãn ý tưởng \"xây dựng ứng dụng AR thử đồ 3D\" ở giai đoạn này", measure: "Mặc dù đây là ý tưởng hấp dẫn (desirable) nhưng chi phí thiết lập và kiểm chứng thực tế quá cao so với phạm vi dự án (scope) của intern.", tag: "⏸ Hoãn", badge: "var(--fg-3)", border: "var(--border)" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Thấu cảm & Empathy Map";
const B = "Phần B · Journey · HMW · Ideation";
const EXAM: ExamQ[] = [
  { part: A, q: "Khoảng cách giữa lời nói và hành động (\"Say-do gap\") trong Design Thinking được hiểu là gì?", opts: ["Khách luôn nói dối", "AI hiểu sai câu hỏi", "Điều khách *nói* họ muốn thường khác với *nhu cầu thực* của họ", "Khoảng cách giữa hai phiên bản sản phẩm"], correct: 2, why: "Say-do gap: Điều khách hàng nói thường khác với nhu cầu thực tế. (Phần 1)" },
  { part: A, q: "Vì sao khách hàng thường phản hồi \"hãy bán thêm nhiều màu sắc mới\" thay vì mô tả điểm khó khăn thực tế của họ?", opts: ["Con người khó tự diễn đạt các nhu cầu sâu kín và thường có xu hướng đề xuất ngay giải pháp thay vì mô tả vấn đề thực tế", "Khách cố tình gây khó", "Vì họ không thực sự quan tâm đến sản phẩm", "Vì AI gợi ý sai cho họ"], correct: 0, why: "Con người thường khó tự diễn đạt các nhu cầu sâu kín, có xu hướng đề xuất ngay giải pháp thay vì mô tả rõ vấn đề. (Phần 1)" },
  { part: A, q: "Câu hỏi phỏng vấn nào hiệu quả nhất để khai thác insight thực tế?", opts: ["\"Bạn có thích mua online không?\"", "\"Tính năng gợi ý size tiện đúng không?\"", "\"Bạn sẽ dùng tính năng mới này chứ?\"", "\"Kể cho tôi nghe lần gần nhất bạn chọn kích cỡ (size) khi mua hàng trực tuyến.\""], correct: 3, why: "Hỏi về hành vi thực tế đã diễn ra trong quá khứ (\"Kể cho tôi nghe lần gần nhất...\"); các lựa chọn còn lại đều sử dụng câu hỏi Có/Không hoặc câu hỏi giả định. (Phần 1)" },
  { part: A, q: "Việc đặt câu hỏi mớm/gợi ý (\"Tính năng này tiện lợi đúng không?\") trong phỏng vấn tương tự như hiện tượng nào của AI đã học?", opts: ["Hallucination", "Sycophancy (xu hướng đồng thuận/chiều ý)", "Bias dữ liệu", "Knowledge cutoff"], correct: 1, why: "Hỏi mớm/gợi ý tương đương với hiện tượng sycophancy (xu hướng đồng thuận) phiên bản con người: Khách hàng thường đồng ý xã giao cho qua chuyện. (Phần 1)" },
  { part: A, q: "Vì sao việc quan sát hành vi thực tế thường đáng tin cậy hơn lời nói?", opts: ["Vì quan sát nhanh hơn phỏng vấn", "Vì khách không biết mình bị quan sát nên nói thật hơn", "Vì hành vi phản ánh thói quen tự nhiên và không bị \"chỉnh sửa\" theo hướng xã giao như lời nói", "Vì quan sát không cần xin phép"], correct: 2, why: "Hành vi phản ánh thói quen tự nhiên và không bị \"chỉnh sửa\" theo hướng xã giao như lời nói → Phương pháp quan sát mang lại thông tin đáng tin cậy hơn. (Phần 1)" },
  { part: A, q: "Nhận định nào sau đây là một insight thực sự (không phải câu tóm tắt)?", opts: ["\"Khóa kéo dễ hỏng làm khách hàng mất niềm tin vào độ bền sản phẩm → ảnh hưởng trực tiếp đến quyết định mua lại lần sau\"", "\"30% đánh giá (review) có đề cập đến vấn đề khóa kéo\"", "\"Có 12 đánh giá về khóa kéo và 8 đánh giá về kích cỡ\"", "\"Khách hàng phản hồi khá nhiều về khóa kéo\""], correct: 0, why: "Insight chất lượng phải trả lời được câu hỏi \"so what\" (nêu rõ ý nghĩa thực tiễn và định hướng hành động); các lựa chọn khác chỉ dừng lại ở mức đếm số liệu hoặc tóm tắt thông tin. (Phần 1)" },
  { part: A, q: "Bản đồ thấu cảm (Empathy map) bao gồm bốn nội dung chính nào?", opts: ["Problem · User · Metric · Risk", "Input · Process · Output · Schema", "Biết đến · Cân nhắc · Mua · Chăm sóc sau bán hàng", "Nói · Nghĩ · Làm · Cảm (Says - Thinks - Does - Feels)"], correct: 3, why: "Bản đồ thấu cảm (Empathy map) gồm: Nói - Nghĩ - Làm - Cảm. (Lựa chọn C mô tả các giai đoạn của hành trình khách hàng chứ không phải bản đồ thấu cảm). (Phần 1)" },
  { part: A, q: "Khi sử dụng AI phân tích các đánh giá của khách hàng để rút ra insight, nguyên tắc nào sau đây là bắt buộc?", opts: ["Tăng temperature để insight đa dạng", "Yêu cầu AI trích dẫn nguyên văn phản hồi gốc để đối chiếu (grounding) và ẩn thông tin cá nhân (PII) trước khi tải lên", "Tin tưởng hoàn toàn các insight do AI đề xuất vì tốc độ xử lý nhanh", "Chỉ tin cậy vào kết quả của AI và bỏ qua dữ liệu gốc"], correct: 1, why: "Nguyên tắc bắt buộc: Phải đối chiếu thực tế (grounding) bằng cách trích dẫn nguyên văn phản hồi gốc và bảo mật thông tin cá nhân (PII) trước khi tải lên các mô hình AI công cộng. (Phần 1)" },
  { part: A, q: "Đâu là vai trò đúng đắn của AI trong quá trình thấu cảm người dùng?", opts: ["Thay thế hoàn toàn việc phỏng vấn/quan sát", "Ra quyết định sản phẩm thay bạn", "Tăng tốc quá trình phân nhóm & rút trích insight, nhưng người dùng vẫn phải kiểm chứng lại bằng dữ liệu gốc hoặc quan sát thực tế", "Không dùng được cho thấu cảm"], correct: 2, why: "AI giúp tăng tốc quá trình thấu cảm nhưng không thể thay thế con người; bạn vẫn cần đối chiếu và kiểm chứng bằng dữ liệu gốc hoặc quan sát thực tế. (Phần 1)" },
  { part: A, q: "Việc đặt câu hỏi lý do (tại sao) ở nhiều mức độ khác nhau khi khách hàng nêu vấn đề nhằm mục đích gì?", opts: ["Tìm ra nhu cầu gốc rễ ẩn sau lời phàn nàn ở bề mặt", "Kéo dài buổi phỏng vấn", "Làm khách hàng bối rối để thu thập thêm thông tin", "Thu thập thêm thông tin cá nhân (PII)"], correct: 0, why: "Hỏi sâu lý do (tại sao) để tìm hiểu nhu cầu gốc rễ ẩn sau những lời phàn nàn ở bề mặt. (Phần 1)" },
  { part: B, q: "Bản đồ hành trình người dùng (User journey map) mang lại lợi ích gì?", opts: ["Liệt kê mọi tính năng của sản phẩm", "Tính chi phí token", "Thay thế hoàn toàn empathy map", "Liên kết điểm khó chịu (pain point) và trạng thái cảm xúc vào từng giai đoạn trải nghiệm để xác định nơi cần tập trung tối ưu"], correct: 3, why: "Bản đồ hành trình (Journey map) kết hợp các điểm khó chịu (pain point) và trạng thái cảm xúc theo từng giai đoạn → Giúp xác định rõ giai đoạn cần tập trung tối ưu. (Phần 2)" },
  { part: B, q: "HMW (How-Might-We) được định nghĩa là gì?", opts: ["Một loại metric đo lường", "Câu hỏi gợi mở cơ hội, biến điểm khó chịu (pain point) thành hướng khám phá mới mà không đưa sẵn giải pháp", "Một khung phỏng vấn", "Một dạng structured output"], correct: 1, why: "HMW là dạng câu hỏi gợi mở cơ hội và không đưa sẵn giải pháp cụ thể. (Phần 2)" },
  { part: B, q: "Câu hỏi HMW nào sau đây mắc lỗi \"quá hẹp — định hướng sẵn giải pháp\"?", opts: ["\"Làm thế nào để giúp khách hàng tự tin chọn đúng kích cỡ (size)?\"", "\"Làm thế nào để giảm bớt lo lắng khi chọn kích cỡ lúc mua hàng trực tuyến?\"", "\"Làm thế nào để xây dựng tính năng gợi ý kích cỡ bằng AI?\"", "\"Làm thế nào để giúp khách hàng cảm thấy yên tâm hơn khi mua hàng trực tuyến?\""], correct: 2, why: "Ý tưởng \"Xây dựng tính năng gợi ý kích cỡ bằng AI\" đã định hình sẵn giải pháp cụ thể nên bị coi là quá hẹp. (Phần 2)" },
  { part: B, q: "Câu hỏi HMW nào sau đây mắc lỗi \"quá rộng — không mang lại giá trị thực tiễn\"?", opts: ["\"Làm thế nào để giúp khách hàng cảm thấy hài lòng?\"", "\"Làm thế nào để giúp khách hàng tự tin chọn đúng kích cỡ?\"", "\"Làm thế nào để giảm thiểu tỉ lệ đổi trả hàng do sai kích cỡ?\"", "\"Làm thế nào để giúp khách hàng hiểu rõ hơn về bảng quy đổi kích cỡ?\""], correct: 0, why: "Câu hỏi \"Làm sao để khách hàng hài lòng?\" quá chung chung, không thể chuyển hóa thành các hành động cụ thể. (Phần 2)" },
  { part: B, q: "Giai đoạn \"phân kỳ\" (diverge) trong quá trình phát triển ý tưởng (ideation) được hiểu là gì?", opts: ["Lọc ngay ý tốt nhất", "Chỉ giữ đúng 1 ý duy nhất", "Phán xét từng ý ngay khi vừa nghĩ ra", "Đưa ra tối đa số lượng ý tưởng, tạm thời hoãn việc đánh giá hay phán xét"], correct: 3, why: "Giai đoạn phân kỳ (Diverge) là việc đưa ra tối đa số lượng ý tưởng và tạm thời hoãn việc đánh giá hay phán xét. (Phần 2)" },
  { part: B, q: "Hai tiêu chí lọc ý tưởng thực tế cho intern là gì?", opts: ["Đẹp mắt & nhiều tính năng", "Tính đáng làm (giải quyết đúng nhu cầu thực tế) và Tính kiểm chứng được (có thể thử nghiệm với chi phí thấp)", "Triển khai với chi phí thấp nhất và thời gian nhanh nhất", "Được cấp trên ủng hộ và đối thủ cạnh tranh chưa thực hiện"], correct: 1, why: "Hai tiêu chí lọc ý tưởng chính: Tính đáng làm (desirability) và Tính kiểm chứng được (testability). (Phần 2)" },
  { part: B, q: "Vì sao \"tính kiểm chứng được\" là một tiêu chí lựa chọn quan trọng?", opts: ["Vì ý kiểm chứng được luôn rẻ nhất", "Vì nó làm ý tưởng nghe hay hơn", "Vì một ý tưởng không thể kiểm chứng chỉ dừng lại ở mức độ giả định chủ quan (niềm tin), chứ không phải một giả thuyết khoa học (kết nối với Tư duy hướng kết quả - Outcome Thinking)", "Vì nó giúp tiết kiệm token"], correct: 2, why: "Những ý tưởng không thể kiểm chứng chỉ dừng lại ở mức giả định chủ quan (niềm tin), chứ không phải một giả thuyết khoa học (kết nối trực tiếp với Tư duy hướng kết quả - Outcome Thinking ở buổi I1.2). (Phần 2)" },
  { part: B, q: "Ý tưởng \"xây dựng ứng dụng AR thử đồ 3D\" bị tạm hoãn ở giai đoạn intern chủ yếu vì lý do gì?", opts: ["Chi phí thiết lập và kiểm chứng quá cao so với phạm vi dự án của intern (mặc dù đây là một ý tưởng hấp dẫn)", "Nó không liên quan pain point nào", "Khách chắc chắn sẽ ghét nó", "AI hoàn toàn không làm được"], correct: 0, why: "Tính năng AR thử đồ 3D có thể là một ý tưởng hấp dẫn nhưng chi phí thiết lập và kiểm chứng thực tế quá cao so với phạm vi dự án của intern. (Phần 2)" },
  { part: B, q: "\"Báo cáo Insight Người dùng (User Insight Report)\" của buổi này bao gồm những nội dung gì?", opts: ["Toàn bộ mã nguồn của feature", "Bảng lương và doanh thu nội bộ", "Danh sách 10 tính năng đã build", "1 vấn đề rõ ràng của khách hàng + 3 câu hỏi HMW + tối thiểu 2 ý tưởng kèm tiêu chí kiểm chứng"], correct: 3, why: "Báo cáo Insight (Insight report) tiêu chuẩn gồm: 1 vấn đề khách hàng rõ ràng + 3 câu hỏi HMW + tối thiểu 2 ý tưởng có thể kiểm chứng được. (Phần 2)" },
  { part: B, q: "Bản đồ hành trình người dùng giúp chuyển đổi \"các phản hồi phàn nàn rời rạc\" thành sản phẩm nào sau đây?", opts: ["Một bảng giá sản phẩm", "Một bản đồ xác định cụ thể các giai đoạn cần can thiệp hoặc tối ưu trong hành trình trải nghiệm", "Một danh sách PII", "Một prompt hoàn chỉnh"], correct: 1, why: "Bản đồ hành trình giúp hệ thống hóa các phản hồi phàn nàn rời rạc thành bản đồ chỉ rõ các điểm cần can thiệp hoặc tối ưu. (Phần 2)" },
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

export function LessonI22() {
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
    <div data-screen-label="Tổng quan I2.2">
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
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I2.2 · Design Thinking</span>
      </div>

      <div
        className="i22-overview-grid"
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
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I2.2 · L1 → L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>🔒 NL3 · Must-pass</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Design Thinking — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Empathy &amp; Ideation</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Ở I1.2 bạn học &quot;làm đúng việc đáng làm&quot;. Nhưng làm sao biết việc gì <b style={{ color: "var(--fg-1)" }}>đáng làm</b>? Câu trả lời bắt đầu từ <b style={{ color: "var(--fg-1)" }}>người dùng</b> — và cái bẫy lớn nhất là xây thứ khách <em style={{ fontStyle: "italic" }}>nói</em> họ muốn thay vì thứ họ <em style={{ fontStyle: "italic" }}>thực sự cần</em>. Đây là nửa &quot;thấu cảm&quot; của một Product Builder.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~34</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Cái bẫy lớn nhất khi làm sản phẩm là <b style={{ color: "var(--fg-1)" }}>xây những gì khách hàng nói họ muốn thay vì những gì họ thực sự cần</b>. Buổi này cung cấp công cụ giúp bạn khai thác đúng nhu cầu thực tế, rồi biến nó thành ý tưởng kiểm chứng được. NL3 là <b style={{ color: "var(--fg-1)" }}>tiêu chí bắt buộc để tốt nghiệp</b> — không có nó, prompt giỏi đến mấy cũng chỉ giải sai bài toán một cách hiệu quả.
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
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang I2.3 (~20 phút). Đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I2.3 — Critical Thinking (Gate 2)</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: "23px" }}>📝</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "7px" }}>Sản phẩm gợi ý của buổi</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Báo cáo Insight Người dùng</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Một tài liệu ngắn: <b style={{ color: "var(--fg-1)" }}>1 vấn đề rõ ràng của khách hàng + 3 câu hỏi HMW + tối thiểu 2 ý tưởng có tiêu chí kiểm chứng</b> — nguyên liệu đầu vào trực tiếp cho I2.3 (phản biện giả thuyết) và I4.1 (Product Canvas).</p>
              </div>
            </div>
          </section>

          {SHOW_TERMS && (
            <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
              <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
              <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Design Thinking (Empathy &amp; Ideation)</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "26px" }}>
                {MUST_KNOW.map((t, i) => (
                  <span key={i} style={{ font: "600 14px/1 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
                ))}
              </div>
              <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--fg-3)", marginBottom: "12px" }}>Nối buổi trước</div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {NICE_KNOW.map((t, i) => (
                  <span key={i} style={{ font: "500 14px/1 var(--font-body)", color: "var(--fg-2)", background: "#fff", border: "1px solid var(--border)", padding: "9px 14px", borderRadius: "999px" }}>{t}</span>
                ))}
              </div>
              <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Nửa &quot;Collaboration &amp; Iteration&quot; của NL3 học ở buổi I3.3.</p>
            </section>
          )}
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I2.1 (Prompt Engineering)</b> → trước <b style={{ color: "var(--fg-1)" }}>I2.3 (Critical Thinking — Gate 2)</b>. Buổi tích lũy, NL3 lên cấp độ L2.</p>
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
    { title: "Thấu cảm, Insight & Empathy Map", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "User Journey, HMW & Ideation", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 1) },
    { title: "Final Exam · 20 câu →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("exam") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i22-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i22-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.2
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I2.2</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>N</span>guyên tắc gốc của Design Thinking: <b>những gì khách hàng nói họ muốn thường không phải là thứ họ thực sự cần.</b> Không phải vì họ nói dối, mà vì con người thường khó tự diễn đạt các nhu cầu sâu kín, và có xu hướng đề xuất ngay giải pháp thay vì mô tả vấn đề.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Khoảng cách Say-Do — điều nói ra khác nhu cầu thực</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>Khách NÓI</div><div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>&quot;Hãy cho tôi xem thêm nhiều màu áo khác.&quot; → nếu làm theo câu chữ: sản xuất thêm nhiều màu sắc mới gây tăng tồn kho.</div></div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>Nhu cầu THỰC</div><div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>&quot;Tôi không tự tin chọn màu sắc phù hợp với mình.&quot; → giải pháp phù hợp: <b>gợi ý phối màu theo vóc dáng</b>.</div></div>
      </div>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}>Khoảng cách giữa &quot;điều nói ra&quot; và &quot;điều thực sự cần&quot; gọi là <b style={{ color: "var(--fg-1)" }}>khoảng cách Say-Do (Say-Do gap)</b>. Việc thấu cảm đòi hỏi chúng ta phải đi sâu hơn những lời nói bề ngoài để tìm ra nhu cầu thực tế và điểm khó khăn (pain point) cốt lõi.</p>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 26px" }}>
          <div style={{ border: "1px dashed var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "13px 16px", textAlign: "center" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "5px" }}>💬 ĐIỀU KHÁCH NÓI</div><div style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>&quot;cho thêm nhiều màu&quot;</div></div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "var(--fg-3)", padding: "4px 0" }}><span style={{ fontSize: "11px", letterSpacing: ".14em", fontFamily: "var(--font-mono)" }}>— mặt nước —</span><span style={{ fontSize: "20px" }}>↓</span></div>
          <div style={{ border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "18px 16px", textAlign: "center" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "5px" }}>🧊 NHU CẦU THỰC (ẩn dưới)</div><div style={{ font: "600 16px/1.5 var(--font-body)", color: "var(--fg-1)" }}>&quot;không tự tin chọn màu hợp mình&quot;</div></div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Say-do gap: phần lớn nhu cầu nằm chìm dưới câu chữ, phải đào xuống.</figcaption>
      </figure>

      <div style={{ margin: "24px 0", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Nhiều khách hàng phản hồi <i>&quot;áo bị nóng&quot;</i>. Nếu chỉ dựa vào câu chữ, bạn sẽ thay đổi chất liệu vải. Nhưng khi đi sâu tìm hiểu ngữ cảnh (họ mặc khi nào, ở đâu), bạn sẽ thấy họ thường mặc áo khi đi xe máy giữa trưa nắng tại Sài Gòn — nhu cầu thực tế lúc này là <b>chất vải thoáng khí khi vận động dưới trời nắng nóng</b>, chứ không đơn thuần là &quot;vải mỏng hơn&quot;.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Phỏng vấn &amp; quan sát — khai thác insight đúng cách</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Hai nguồn insight chính bao gồm: <b>Hỏi</b> (phỏng vấn) và <b>Nhìn</b> (quan sát hành vi thực tế). Việc quan sát hành vi thường mang lại thông tin chính xác hơn vì hành vi phản ánh thói quen tự nhiên và không bị &quot;chỉnh sửa&quot; theo hướng xã giao như lời nói.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 22px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--iris)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>1</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--iris-deep)" }}>Hỏi mở, không hỏi Có/Không</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>&quot;Kể cho tôi nghe lần gần nhất bạn mua áo khoác online&quot; thay vì &quot;Bạn có thích mua hàng online không?&quot;.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--gold-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>2</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Hỏi hành vi quá khứ, không hỏi giả định tương lai</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>&quot;Lần trước bạn chọn size thế nào?&quot; thay vì &quot;Bạn có dùng tính năng gợi ý size không?&quot; — các câu hỏi giả định thường chỉ nhận được câu trả lời xã giao, không thực chất.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--rose-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>3</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--rose-deep)" }}>Đừng hỏi mớm/gợi ý (leading question)</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>Đây chính là hiện tượng <i>sycophancy (xu hướng đồng thuận) phiên bản con người</i> (đã học ở buổi I1.2): Câu hỏi &quot;Tính năng này tiện lợi đúng không?&quot; sẽ khiến khách hàng gật đầu đồng ý cho qua chuyện. Hãy dùng câu hỏi trung tính: &quot;Bạn trải nghiệm bước này như thế nào?&quot;.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: "var(--mint-deep)", padding: "6px 10px", borderRadius: "6px", flex: "none" }}>4</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--mint-deep)" }}>Hỏi lý do (tại sao) ở nhiều mức độ</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>Khi khách hàng nêu một vấn đề, hãy hỏi tiếp &quot;tại sao điều đó lại gây phiền toái?&quot; để tìm ra nhu cầu gốc rễ (đây là tiền đề cho mô hình 5 Whys ở buổi I2.3).</div></div></div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--gold-deep)" }}>Quan sát tại YODY (giả lập):</b> đứng tại cửa hàng quan sát khách hàng thử đồ — nếu nhiều người cầm áo lên, kiểm tra nhãn size rồi đặt xuống, đó chính là tín hiệu hành vi phản ánh sự bối rối khi chọn size. Thông tin này có giá trị thực tế hơn nhiều so với việc họ tự nhận định &quot;tôi thấy chọn size cũng ổn&quot;.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Insight không phải là tóm tắt — phải trả lời &quot;so what&quot;</h2>
      <figure style={{ margin: "20px 0 26px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "14px", alignItems: "center" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "8px" }}>TÓM TẮT</div><div style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;30% đánh giá (review) phàn nàn về khóa kéo.&quot; → chỉ liệt kê lại điều khách nói.</div></div>
          <div style={{ color: "var(--fg-3)", fontSize: "22px", textAlign: "center" }}>→</div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "10px", background: "var(--mint-tint)", padding: "14px 16px" }}><div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "8px" }}>INSIGHT</div><div style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Khóa kéo dễ hỏng làm khách hàng mất niềm tin vào độ bền của sản phẩm → ảnh hưởng trực tiếp đến quyết định <b>mua lại lần sau</b>, chứ không chỉ đơn thuần là một lỗi nhỏ.&quot; → có &quot;so what&quot;.</div></div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Insight bắt buộc trả lời &quot;vậy thì sao?&quot; và gợi hướng hành động.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 8px" }}>Một insight chất lượng thường: <b style={{ color: "var(--fg-1)" }}>(a)</b> chỉ ra quy luật (pattern) lặp lại trong dữ liệu, <b style={{ color: "var(--fg-1)" }}>(b)</b> làm rõ nguyên nhân/động cơ thực tế phía sau, và <b style={{ color: "var(--fg-1)" }}>(c)</b> gợi mở hướng hành động cụ thể. Nếu câu phân tích của bạn không trả lời được câu hỏi &quot;vậy thì sao?&quot;, đó mới chỉ dừng lại ở mức tóm tắt.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Bản đồ thấu cảm (Empathy Map) — hiểu khách đa chiều</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>Bản đồ thấu cảm (Empathy map)</b> là khung 4 ô giúp tổng hợp thông tin về một nhóm khách hàng, giúp bạn có góc nhìn đa chiều thay vì chỉ liệt kê các phản hồi tiêu cực.</p>
      <figure style={{ margin: "0 0 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {empathy.map((e, i) => (
            <div key={i} style={{ border: `1px solid ${e.border}`, borderRadius: "12px", background: e.bg, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}><span style={{ fontSize: "18px" }}>{e.icon}</span><b style={{ font: "700 15px/1 var(--font-brand)", color: e.color }}>{e.label}</b></div>
              <div style={{ font: "12px/1.4 var(--font-mono)", color: "var(--fg-3)", marginBottom: "6px" }}>{e.q}</div>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{e.ex}</div>
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "12px", textAlign: "center" }}>Hình 3 — Empathy map 4 ô: Nói · Nghĩ · Làm · Cảm (ví dụ YODY giả lập).</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Từ bản đồ thấu cảm, các pain point cốt lõi hiển lộ rõ (vd &quot;lo lắng khi chọn size online&quot;) — đây là <b>đầu vào</b> cho user journey map và câu hỏi HMW ở Phần 2.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Dùng AI phân tích feedback — tốc độ đi đôi với kỷ luật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Khi đối mặt với hàng trăm lượt đánh giá, AI (Claude/ChatGPT) giúp phân nhóm và rút ra insight rất nhanh. Hãy áp dụng đúng các nguyên tắc đã học:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {aiRules.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}><span style={{ font: "700 11px/1.3 var(--font-mono)", color: r.c, background: r.tint, border: `1px solid ${r.c}`, padding: "6px 9px", borderRadius: "6px", flex: "none", whiteSpace: "nowrap" }}>{r.tag}</span><span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{r.text}</span></div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--rose-deep)" }}>Lưu ý quan trọng:</b> AI chỉ hỗ trợ tăng tốc quá trình thấu cảm chứ không thể thay thế con người. Các insight do AI đề xuất vẫn cần được bạn kiểm chứng lại bằng dữ liệu gốc và lý tưởng nhất là qua phỏng vấn hoặc quan sát thực tế.</div>

      <TldrDark items={[
        "<b>Say-do gap:</b> Điều khách hàng nói thường khác với nhu cầu thực tế; thấu cảm là đi sâu hơn những lời nói bề ngoài để tìm ra điểm khó khăn (pain point) gốc rễ.",
        "<b>Phỏng vấn đúng cách:</b> Sử dụng câu hỏi mở, hỏi về hành vi thực tế trong quá khứ, tránh câu hỏi gợi ý/định hướng, đi sâu tìm hiểu nguyên nhân (tại sao); quan sát hành vi thực tế đáng tin cậy hơn lời nói xã giao.",
        "<b>Insight khác biệt với tóm tắt:</b> (phải trả lời được &quot;so what&quot;); sử dụng bản đồ thấu cảm (Nói - Nghĩ - Làm - Cảm) để thấu hiểu khách hàng đa chiều; dùng AI để tăng tốc phân tích nhưng luôn phải đối chiếu (grounding) và bảo mật thông tin cá nhân (PII).",
      ]} />

      <SelfCheck items={[
        "Khách hàng nói &quot;hãy bán thêm nhiều màu sắc mới&quot;. Hãy đặt 2 câu hỏi đi sâu để tìm ra nhu cầu thực tế phía sau.",
        "Viết lại câu hỏi mớm gợi ý &quot;Tính năng gợi ý size này tiện lợi đúng không?&quot; thành một câu hỏi trung tính, tập trung vào hành vi thực tế.",
        "Từ nhận định &quot;30% phản hồi phàn nàn về khóa kéo&quot; — hãy chuyển đổi nó thành một insight có ý nghĩa rõ ràng (trả lời câu hỏi &quot;so what&quot;).",
        "Hoàn thành nhanh 4 ô của bản đồ thấu cảm cho nhóm đối tượng &quot;khách hàng mua áo khoác trực tuyến lần đầu&quot;.",
      ]} />
    </div>
  );
}

function Part2View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>P</span>hần 1 giúp bạn thấu hiểu khách hàng. Phần 2 hướng dẫn cách chuyển hóa sự thấu hiểu đó thành các <b>cơ hội</b> và <b>ý tưởng có thể kiểm chứng</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>1 · Bản đồ hành trình người dùng (User Journey Map) — Xác định vị trí của pain point trong hành trình khách hàng</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Khách hàng không trải nghiệm sản phẩm tại một thời điểm duy nhất, mà trải qua <b>một hành trình gồm nhiều giai đoạn khác nhau</b>. <b>User journey map (Bản đồ hành trình người dùng)</b> sẽ mô phỏng lại hành trình này, kết hợp với các yếu tố cảm xúc và các điểm khó chịu (pain point) ở từng giai đoạn — giúp bạn nhận diện rõ nét nơi khách hàng gặp nhiều khó khăn nhất.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "20px", overflowX: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(150px,1fr))", gap: "10px", minWidth: "760px" }}>
            {journey.map((j, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ borderRadius: "10px", padding: "12px 13px", background: j.bg, border: `1px solid ${j.border}`, minHeight: "150px" }}>
                  <div style={{ font: "700 12px/1.2 var(--font-brand)", color: j.color, marginBottom: "8px" }}>{j.stage}</div>
                  <div style={{ font: "12px/1.5 var(--font-body)", color: "var(--fg-2)", marginBottom: "8px" }}>{j.action}</div>
                  <div style={{ font: "11px/1.45 var(--font-body)", color: "var(--fg-1)", borderTop: `1px dashed ${j.border}`, paddingTop: "7px" }}>⚠ {j.pain}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "22px", lineHeight: 1 }}>{j.emo}</div>
                  <div style={{ font: "600 11px/1.3 var(--font-mono)", color: j.color, marginTop: "3px" }}>{j.emotion}</div>
                  <div style={{ height: j.dipH, width: "8px", margin: "5px auto 0", borderRadius: "99px", background: j.dipColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Đường cảm xúc dip sâu nhất ở &quot;Mua&quot; &amp; &quot;Nhận &amp; dùng&quot; — đó là nơi nên can thiệp.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>Nhìn vào toàn bộ hành trình, bạn có thể nhận thấy các điểm khó chịu (pain point) tập trung nhiều nhất ở giai đoạn <b style={{ color: "var(--fg-1)" }}>&quot;Cân nhắc → Mua&quot;</b> (do tâm lý lo ngại khi chọn size/màu) — đây chính là nơi một tính năng được thiết kế đúng đắn sẽ mang lại kết quả (outcome) rõ rệt nhất. Bản đồ hành trình giúp chuyển đổi &quot;những lời than phiền rời rạc&quot; thành &quot;bản đồ xác định các điểm cần can thiệp/tối ưu&quot;.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · How-Might-We (HMW) — Chuyển hóa điểm khó chịu (pain point) thành cơ hội</h2>
      <figure style={{ margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", border: "1px solid var(--rose-deep)", padding: "12px 15px", borderRadius: "10px", maxWidth: "230px" }}>Pain point: &quot;Khách hàng lo sợ chọn sai kích cỡ (size) khi mua hàng trực tuyến.&quot;</span>
          <span style={{ color: "var(--fg-3)", fontSize: "22px" }}>→</span>
          <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "12px 15px", borderRadius: "10px", maxWidth: "260px" }}>HMW: &quot;Làm thế nào để chúng ta giúp khách hàng tự tin chọn đúng kích cỡ ngay trong lần mua đầu tiên?&quot;</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — HMW chuyển câu <i>phàn nàn</i> thành câu hỏi <i>gợi mở cơ hội</i>.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}>Ba nguyên tắc để viết câu hỏi HMW hiệu quả:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 20px" }}>
        {hmw.map((h, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${h.border}`, borderRadius: "12px", background: h.bg, padding: "16px 18px" }}><span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: h.badge, padding: "6px 10px", borderRadius: "6px", flex: "none" }}>{h.n}</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: h.color }}>{h.title}</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{h.desc}</div></div></div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--gold-deep)" }}>Mẹo thực hành:</b> Hãy viết thử 2–3 câu hỏi HMW cho cùng một pain point dưới nhiều góc nhìn khác nhau (giảm thiểu nỗi sợ hãi / tăng cường thông tin / cho phép trải nghiệm thử trước) rồi lựa chọn câu hỏi mở ra nhiều hướng giải quyết nhất.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Phát triển ý tưởng (Ideation) — Giai đoạn phân kỳ và hội tụ</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Ý tưởng chất lượng thường đến từ việc <b>ưu tiên số lượng trước, sau đó mới tiến hành chọn lọc</b> — đây là hai giai đoạn hoàn toàn riêng biệt:</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        <div style={{ padding: "18px 20px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>↔ Phân kỳ (diverge)</div><div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Đưa ra càng nhiều ý tưởng càng tốt cho mỗi câu hỏi HMW, <b>tạm thời hoãn việc đánh giá hay phán xét</b>. Đôi khi, một &quot;ý tưởng có vẻ phi thực tế&quot; lại là cầu nối kích hoạt một &quot;ý tưởng xuất sắc&quot; tiếp theo. Mục tiêu tối thiểu cần đạt là <b>10 ý tưởng</b>.</div></div>
        <div style={{ padding: "18px 20px", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "8px" }}>→◦ Hội tụ (converge)</div><div style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Sàng lọc các ý tưởng dựa trên những tiêu chí rõ ràng.</div></div>
      </div>

      <figure style={{ margin: "20px 0 24px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--rose-deep)", background: "var(--rose-tint)", border: "1px solid var(--rose-deep)", padding: "10px 12px", borderRadius: "9px", textAlign: "center" }}>Pain point<br />&quot;Sợ sai size&quot;</span>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--iris-deep)", background: "var(--iris-tint)", border: "1px solid var(--iris)", padding: "10px 12px", borderRadius: "9px", textAlign: "center" }}>HMW</span>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--gold-deep)", background: "var(--gold-tint)", border: "1px solid var(--gold-deep)", padding: "10px 12px", borderRadius: "9px", textAlign: "center" }}>✦✦✦ Nhiều ý<br /><span style={{ font: "400 10px/1 var(--font-body)" }}>diverge · ≥10</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <span style={{ font: "700 12px/1.3 var(--font-mono)", color: "var(--fg-1)", background: "var(--bg-warm)", border: "1px solid var(--fg-3)", padding: "10px 12px", borderRadius: "9px", textAlign: "center" }}>Lọc<br /><span style={{ font: "400 10px/1.3 var(--font-body)", color: "var(--fg-2)" }}>Đáng làm? · Kiểm chứng?</span></span>
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
          <span style={{ font: "600 12px/1.3 var(--font-body)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "10px 12px", borderRadius: "9px", textAlign: "center" }}>2–3 ý<br /><span style={{ font: "400 10px/1 var(--font-body)" }}>converge</span></span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Phân kỳ rồi hội tụ: giữ lại ý kiểm chứng được.</figcaption>
      </figure>

      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}><b style={{ color: "var(--fg-1)" }}>Hai tiêu chí lọc ý tưởng thực tế cho intern:</b></p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 20px" }}>
        <div style={{ padding: "16px 18px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "6px" }}>1 · Tính đáng làm (Desirability)</div><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Ý tưởng đó có giải quyết đúng điểm khó chịu (pain point) cốt lõi và nhu cầu thực tế của khách hàng không?</div></div>
        <div style={{ padding: "16px 18px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}><div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "6px" }}>2 · Tính kiểm chứng được (Testability)</div><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Chúng ta có thể thử nghiệm nhanh với chi phí thấp để xác định tính đúng/sai của ý tưởng hay không? (nối Outcome Thinking · I1.2)</div></div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Tiêu chí thứ hai liên kết trực tiếp với <b>Tư duy hướng kết quả (Outcome Thinking - buổi I1.2)</b>: Một ý tưởng chỉ thực sự có giá trị tiếp tục phát triển nếu bạn xác định được <b>cách thức đo lường</b> hiệu quả của nó. Những ý tưởng không thể kiểm chứng được chỉ dừng lại ở mức độ giả định cảm tính, chứ không phải một giả thuyết khoa học.</p>

      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Ví dụ YODY · giả lập · HMW &quot;giúp khách tự tin chọn đúng size&quot;</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {ideas.map((it, i) => (
            <div key={i} style={{ display: "flex", gap: "11px", alignItems: "flex-start", background: "#fff", border: `1px solid ${it.border}`, borderRadius: "9px", padding: "12px 14px" }}>
              <span style={{ font: "700 11px/1.3 var(--font-mono)", color: "#fff", background: it.badge, padding: "5px 8px", borderRadius: "5px", flex: "none", whiteSpace: "nowrap" }}>{it.tag}</span>
              <div><b style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--fg-1)" }}>{it.idea}</b><div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "2px" }}>{it.measure}</div></div>
            </div>
          ))}
        </div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Báo cáo Insight Người dùng (User Insight Report)</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Hãy tổng hợp kết quả của buổi học thành một tài liệu ngắn gọn và có tính ứng dụng cao:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 26px" }}>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}><span style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--rose-deep)", flex: "none", width: "30px" }}>1</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>1 vấn đề rõ ràng của khách hàng</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>xác định rõ điểm khó chịu (pain point) cốt lõi kèm theo bằng chứng cụ thể (trích dẫn từ số liệu hoặc kết quả quan sát).</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}><span style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--gold-deep)", flex: "none", width: "30px" }}>2</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>3 câu hỏi HMW</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>tiếp cận cơ hội giải quyết từ 3 góc độ khác nhau dựa trên pain point đó.</div></div></div>
        <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}><span style={{ font: "italic 800 26px/1 var(--font-serif)", color: "var(--mint-deep)", flex: "none", width: "30px" }}>3</span><div><b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>≥2 ý tưởng có tiêu chí kiểm chứng</b><div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>mỗi ý tưởng bắt buộc phải đi kèm phương án &quot;đo lường bằng chỉ số nào để xác định tính hiệu quả&quot;.</div></div></div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Báo cáo này sẽ là tài liệu đầu vào quan trọng cho buổi I2.3 (phản biện giả thuyết) và buổi I4.1 (Product Canvas). Hãy giữ tài liệu ngắn gọn, tập trung vào bằng chứng thực tế và tránh đưa vào các ý tưởng thiếu cơ sở thực tiễn.</p>

      <TldrDark items={[
        "<b>User journey map</b> (Bản đồ hành trình người dùng) liên kết điểm khó chịu (pain point) và trạng thái cảm xúc vào từng giai đoạn trải nghiệm → giúp xác định rõ &quot;nơi khách hàng gặp khó khăn nhất&quot; để tập trung can thiệp.",
        "<b>How-Might-We</b> biến điểm khó chịu thành một câu hỏi gợi mở cơ hội — đảm bảo không quá rộng và không đưa sẵn giải pháp cụ thể vào câu hỏi.",
        "<b>Ideation = phân kỳ rồi hội tụ</b>; sàng lọc ý tưởng dựa trên tính &quot;đáng làm&quot; và &quot;có thể kiểm chứng&quot; (kết nối với Tư duy hướng kết quả); sản phẩm đầu ra là một Báo cáo Insight Người dùng ngắn gọn.",
      ]} />

      <SelfCheck items={[
        "Phác thảo nhanh 4 giai đoạn trong hành trình mua áo online và xác định giai đoạn có điểm khó chịu (pain point) tập trung nhiều nhất.",
        "Chuyển đổi điểm khó chịu &quot;quy trình đổi trả hàng phức tạp/rườm rà&quot; thành một câu hỏi HMW đạt yêu cầu (không quá chung chung và không định hướng sẵn giải pháp).",
        "Với một câu hỏi HMW, hãy đưa ra tối thiểu 5 ý tưởng, sau đó sàng lọc để giữ lại 2 ý tưởng có thể kiểm chứng được — nêu rõ phương án đo lường cho từng ý tưởng được chọn.",
        "Vì sao một ý tưởng &quot;không thể kiểm chứng&quot; chỉ được xem là giả định mang tính chủ quan (niềm tin) chứ không phải là một giả thuyết khoa học?",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}><div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã nắm Empathy &amp; Ideation của NL3 🎯</div><div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Làm Final Exam 20 câu và hoàn thiện một <b style={{ color: "var(--fg-1)" }}>Báo cáo Insight Người dùng</b> ngắn trước khi sang I2.3.</div></div>
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
    ? { title: "Đạt — sẵn sàng sang I2.3 🎉", msg: `Bạn đạt ngưỡng ${PASS_SCORE}/20. Hoàn thiện Báo cáo Insight Người dùng rồi sang I2.3 — Critical Thinking (Gate 2).`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–10 → đọc lại Phần 1 (Thấu cảm); sai nhiều câu 11–20 → đọc lại Phần 2 (Journey/HMW/Ideation).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.2
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · trước khi sang I2.3</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I2.2</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.</p>

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
