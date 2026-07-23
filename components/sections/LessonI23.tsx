"use client";

import { useState, type CSSProperties } from "react";

type Page = "overview" | "read" | "gate" | "exam";

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
  { n: "01", short: "Root Cause & 5 Whys", title: "Root Cause, 5 Whys & First Principles", time: "~17 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "Hypothesis & Draft Spec", title: "Hypothesis, Data-driven & Draft Spec", time: "~17 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Cách phân biệt triệu chứng bề nổi với nguyên nhân gốc rễ; phương pháp 5 Whys và cách phòng tránh 3 cạm bẫy kinh điển; tư duy nguyên bản (First Principles) so với tư duy loại suy; cách định nghĩa đúng bài toán và sử dụng AI phân tích nguyên nhân một cách khách quan, có kỷ luật.", tags: ["Triệu chứng vs gốc rễ", "5 Whys", "First Principles"] },
  { ...PART_META[1], desc: "Cách phát biểu giả thuyết kiểm chứng được theo công thức chuẩn X/Y/Z; phân biệt rõ giả thuyết khoa học với mong muốn cảm tính; ra quyết định dựa trên dữ liệu và xác định độ mạnh của bằng chứng; lập bản đặc tả sản phẩm nháp (draft spec) và phản biện tối thiểu 3 rủi ro có dẫn chứng cụ thể.", tags: ["Giả thuyết", "Data-driven", "Draft spec"] },
];

const OBJECTIVES = [
  "Phân biệt rõ triệu chứng bề nổi với nguyên nhân gốc rễ; giải thích được vì sao chỉ tập trung xử lý triệu chứng lại gây lãng phí nguồn lực.",
  "Áp dụng thành thạo phương pháp 5 Whys và nhận diện để phòng tránh 3 cạm bẫy kinh điển: dừng lại quá sớm, đổ lỗi cho cá nhân/con người, và rẽ nhánh lan man.",
  "Vận dụng tư duy nguyên bản (First Principles) để bóc tách vấn đề phức tạp thành những sự thật nền tảng, tránh tư duy loại suy hoặc sao chép đối thủ một cách máy móc.",
  "Phát biểu giả thuyết kiểm chứng được theo công thức chuẩn; phân biệt rõ giữa giả thuyết khoa học với mong muốn chủ quan.",
  "Biết cách đặt câu hỏi phản biện một insight hoặc đặc tả sản phẩm (spec): làm rõ giả định ngầm, chất vấn độ mạnh của bằng chứng, và chỉ ra rủi ro cụ thể có kèm dẫn chứng.",
];

const MUST_KNOW = ["Triệu chứng vs gốc rễ", "5 Whys", "First Principles", "Problem solving", "Giả thuyết kiểm chứng", "Data-driven", "Evidence bar", "Draft spec"];
const NICE_KNOW = ["Pain point & insight (I2.2)", "Trung tính / sycophancy (I1.2)", "Grounding & PII (I1.2)", "Outcome / value metric (I1.2)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~34 phút" },
  { k: "Giai đoạn", v: "2 · Tuần 5–8" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL2 🔒" },
  { k: "Gate", v: "⛳ Gate 2 · Must-pass" },
  { k: "Cập nhật", v: "07 / 07 / 2026" },
];

const whys = [
  { tag: "VẤN ĐỀ", text: "Tỷ lệ đổi trả áo khoác tăng cao.", badge: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", weight: "700", indent: "0", arrow: true },
  { tag: "TẠI SAO 1", text: "Khách hàng nhận áo bị chật hoặc rộng (không vừa size).", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", weight: "400", indent: "22px", arrow: true },
  { tag: "TẠI SAO 2", text: "Khách hàng tự chọn sai kích cỡ khi mua sắm online.", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", weight: "400", indent: "44px", arrow: true },
  { tag: "TẠI SAO 3", text: "Bảng size của sản phẩm khó hiểu, không khớp với vóc dáng người Việt.", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", weight: "400", indent: "66px", arrow: true },
  { tag: "TẠI SAO 4", text: "Bảng quy đổi kích cỡ lấy nguyên chuẩn quốc tế, lại thiếu hướng dẫn tự đo tại nhà.", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", weight: "400", indent: "88px", arrow: true },
  { tag: "GỐC RỄ", text: "Chưa có quy trình nghiên cứu và chuẩn hóa bảng size dựa trên số liệu đổi trả thực tế của khách hàng.", badge: "var(--iris-deep)", border: "var(--iris-deep)", bg: "var(--iris-tint)", weight: "700", indent: "110px", arrow: false },
];

const pitfalls = [
  { n: "1", title: "Dừng lại quá sớm", desc: "Vội vã dừng lại ở các nguyên nhân trung gian (ví dụ: \"bảng size khó hiểu\") rồi vội vàng đưa giải pháp tạm thời khi chưa thực sự đào sâu tới gốc rễ.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badge: "var(--rose-deep)" },
  { n: "2", title: "Đổ lỗi cho cá nhân/con người", desc: "Kết luận cảm tính \"do nhân viên cẩu thả\" — trong khi nguyên nhân gốc rễ thực chất thường nằm ở lỗ hổng quy trình/hệ thống. Hãy luôn hỏi: \"Vì sao quy trình lại cho phép lỗi cá nhân này xảy ra?\".", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badge: "var(--gold-deep)" },
  { n: "3", title: "Rẽ nhánh lan man", desc: "Một triệu chứng có thể do nhiều nguyên nhân gây ra. Bạn được phép phân tích đa nhánh, nhưng phải bám sát nhánh có dữ liệu hoặc bằng chứng thực tế mạnh nhất để tránh lan man.", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", badge: "var(--iris)" },
];

const fpSteps = [
  { n: "1", text: "Xác định rõ ràng những sự thật hiển nhiên hoặc dữ liệu thực tế đã được chứng minh là đúng về vấn đề." },
  { n: "2", text: "Bóc tách và loại bỏ hoàn toàn các giả định ngầm (những điều tự suy đoán) hoặc lối mòn có sẵn." },
  { n: "3", text: "Tự lập luận và xây dựng giải pháp đi lên từ những sự thật nền tảng đó." },
];

const flow = [
  { text: "Insight / pain point (I2.2)", color: "var(--rose-deep)", bg: "var(--rose-tint)", border: "var(--rose-deep)", arrow: true },
  { text: "Đào gốc rễ (5 Whys / First Principles)", color: "var(--gold-deep)", bg: "var(--gold-tint)", border: "var(--gold-deep)", arrow: true },
  { text: "Định nghĩa vấn đề rõ ràng", color: "var(--iris-deep)", bg: "var(--iris-tint)", border: "var(--iris)", arrow: true },
  { text: "Giả thuyết & giải pháp (Phần 2)", color: "var(--mint-deep)", bg: "var(--mint-tint)", border: "var(--mint)", arrow: false },
];

const aiRules = [
  { tag: "Trung tính · I1.2", c: "var(--iris-deep)", tint: "var(--iris-tint)", text: "Tránh đặt câu hỏi mang tính định hướng trước (ví dụ: \"Có phải bảng size là nguyên nhân chính gây đổi trả đúng không?\" → dễ khiến AI phụ họa/xu nịnh). Hãy đặt câu hỏi khách quan: \"Hãy liệt kê các nguyên nhân khả dĩ và loại bằng chứng cần có để kiểm chứng từng nguyên nhân\"." },
  { tag: "Grounding · I1.2", c: "var(--gold-deep)", tint: "var(--gold-tint)", text: "Yêu cầu AI đưa ra bằng chứng thực tế để đối chiếu (grounding), tránh các suy luận mơ hồ thiếu căn cứ." },
  { tag: "Xác nhận · dữ liệu", c: "var(--mint-deep)", tint: "var(--mint-tint)", text: "AI chỉ hỗ trợ gợi ý các giả thuyết; việc xác định nguyên nhân gốc rễ cuối cùng bắt buộc phải dựa vào dữ liệu thực tế và quan sát hành vi người dùng." },
];

const compare = [
  { k: "Cấu trúc", good: "Nêu rõ hành động X, đối tượng Y, chỉ số Z; đo lường được và chấp nhận khả năng bị thực tế chứng minh là sai.", bad: "Phát biểu chung chung, cảm tính; không có chỉ số đo lường cụ thể hoặc không thể chứng minh là đúng/sai." },
  { k: "Ví dụ", good: "\"Nếu bổ sung gợi ý size (X) cho khách mua online (Y) thì tỷ lệ đơn đổi trả do sai size (Z) sẽ giảm 15%.\"", bad: "\"Chúng ta nên xây dựng tính năng gợi ý size vì tính năng này chắc chắn sẽ rất hữu ích cho khách hàng.\"" },
  { k: "Căn cứ", good: "Xuất phát từ nguyên nhân gốc rễ được tìm thấy và có số liệu thực tế hỗ trợ.", bad: "Dựa trên cảm tính cá nhân hoặc sao chép máy móc theo tư duy loại suy (\"đối thủ đang làm thì mình làm\")." },
];

const evidenceQ = [
  { icon: "🕳️", title: "Giả định ngầm ở đây là gì?", desc: "Điều gì đang được mặc định là đúng nhưng thực tế chưa hề được kiểm chứng? (Ví dụ: Giả định ngầm \"khách hàng sẵn sàng tự lấy thước dây đo cơ thể tại nhà\" là một giả định rất lớn cần kiểm chứng).", color: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)" },
  { icon: "📊", title: "Bằng chứng đã đủ thuyết phục chưa?", desc: "Dữ liệu được thu thập trên tập mẫu lớn hay nhỏ? Số liệu đó có tính đại diện cho toàn bộ nhóm khách hàng mục tiêu không, hay chỉ là phản hồi đơn lẻ? (grounding · I1.2).", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { icon: "⚠️", title: "Edge case nào bị bỏ sót?", desc: "Tình huống biên (edge case) nào có thể phá vỡ hoàn toàn giả thuyết? (Ví dụ: Khách nhập sai số đo cơ thể → hệ thống gợi ý sai kích cỡ → tỷ lệ đổi trả thậm chí còn tăng lên).", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
];

const specParts = [
  { n: "1", title: "Vấn đề & nguyên nhân gốc rễ", desc: "Kết quả phân tích logic từ Phần 1 (5 Whys / First Principles).", c: "var(--rose-deep)" },
  { n: "2", title: "Giả thuyết có thể kiểm chứng", desc: "Phát biểu đúng công thức chuẩn: hành động X cho đối tượng Y giúp chỉ số Z thay đổi theo kỳ vọng.", c: "var(--gold-deep)" },
  { n: "3", title: "Chỉ số đo lường giá trị thực tế (metric)", desc: "Chỉ số mang lại giá trị thực tế (value metric), tuyệt đối không dùng chỉ số ảo (vanity metric) để làm đẹp báo cáo.", c: "var(--iris-deep)" },
  { n: "4", title: "Phạm vi dự án (scope)", desc: "Nêu rõ những việc dự án sẽ làm và những việc KHÔNG làm để tránh tình trạng phình phạm vi (scope creep).", c: "var(--mint-deep)" },
  { n: "5", title: "Tối thiểu 3 rủi ro có dẫn chứng", desc: "Nêu rõ ít nhất 3 rủi ro kèm theo dẫn chứng hoặc lý lẽ kỹ thuật cụ thể (đây là phần phản biện then chốt để vượt qua Gate 2).", c: "var(--fg-1)" },
];

const risks = [
  { risk: "Khách hàng tự lấy số đo cơ thể sai hoặc nhập sai thông tin → hệ thống đưa ra gợi ý size không chuẩn xác.", evidence: "Biểu mẫu nhập số đo quá dài và phức tạp; thống kê tỷ lệ bỏ ngang (drop-off rate) ở các form nhập liệu tương tự hiện rất cao (40%)." },
  { risk: "Bảng size không đồng nhất giữa các mã hàng khác nhau → dẫn đến gợi ý size bị lệch.", evidence: "Kiểm tra ngẫu nhiên trên hệ thống: Cùng là size M nhưng số đo phần vai & ngực của dòng áo gió lệch đáng kể (2–3cm) so với dòng áo phao." },
  { risk: "Nguy cơ rò rỉ thông tin cá nhân của khách hàng (PII).", evidence: "Số đo cơ thể kết hợp với thông tin định danh là dữ liệu nhạy cảm (PII); việc gửi trực tiếp qua API của bên thứ ba mà chưa qua lớp ẩn danh (anonymization) sẽ vi phạm nguyên tắc bảo mật dữ liệu (I1.2)." },
];

const gateTasks = [
  { n: "1", title: "Bản phân tích 5 Whys", desc: "Truy từ triệu chứng bề nổi đến nguyên nhân gốc rễ xử lý được bằng hành động (nêu rõ câu \"Tại sao?\" và câu trả lời ở từng bước).", c: "var(--rose-deep)" },
  { n: "2", title: "Giả thuyết có thể kiểm chứng", desc: "Phát biểu đúng công thức \"Nếu [X] cho [Y] thì [metric Z] thay đổi theo hướng [kỳ vọng]\". Metric bắt buộc là value metric.", c: "var(--gold-deep)" },
  { n: "3", title: "Draft spec phản biện ≥3 rủi ro", desc: "Mỗi rủi ro phải kèm một dẫn chứng/lý do thuyết phục, tuyệt đối không nêu rủi ro chung chung.", c: "var(--iris-deep)" },
];

const rubric = [
  { title: "5 Whys chạm tới nguyên nhân gốc rễ", desc: "Phân tích logic, không dừng ở nguyên nhân trung gian; gốc rễ thuộc về quy trình/hệ thống, không đổ lỗi cho cá nhân đơn thuần." },
  { title: "Giả thuyết đúng công thức & kiểm chứng được", desc: "Rõ X (làm gì), Y (cho ai), Z (value metric đo được) và kỳ vọng cụ thể. Không phát biểu dạng mong muốn/niềm tin cảm tính." },
  { title: "Draft spec đầy đủ cấu trúc", desc: "Gồm đầy đủ: vấn đề & gốc rễ · giả thuyết · metric · phạm vi (làm gì / không làm gì)." },
  { title: "Ít nhất 3 rủi ro có dẫn chứng", desc: "Mỗi rủi ro cần đi kèm nguyên nhân/dẫn chứng cụ thể; bắt buộc có ít nhất 1 rủi ro về trường hợp biên (edge case) hoặc bảo mật dữ liệu (PII)/an toàn hệ thống." },
];

const sampleWhys = [
  { tag: "VẤN ĐỀ ·", text: "Tỷ lệ đổi trả sản phẩm tăng.", badge: "var(--rose-deep)", weight: "700" },
  { tag: "→ TẠI SAO ·", text: "Nhiều khách hàng nhận sản phẩm không vừa kích cỡ.", badge: "var(--fg-3)", weight: "400" },
  { tag: "→ TẠI SAO ·", text: "Khách chọn sai size khi đặt hàng online.", badge: "var(--fg-3)", weight: "400" },
  { tag: "→ TẠI SAO ·", text: "Bảng size trên website khó hiểu, không khớp với vóc dáng thực tế của người Việt.", badge: "var(--fg-3)", weight: "400" },
  { tag: "→ TẠI SAO ·", text: "Bảng quy đổi kích cỡ dùng chuẩn quốc tế, thiếu hình ảnh hướng dẫn tự đo tại nhà.", badge: "var(--fg-3)", weight: "400" },
  { tag: "GỐC RỄ ·", text: "Chưa có quy trình nghiên cứu và chuẩn hóa bảng size dựa trên dữ liệu đổi trả thực tế (thuộc quy trình vận hành hệ thống).", badge: "var(--iris-deep)", weight: "700" },
];

const sampleSpec = [
  { k: "Vấn đề & gốc rễ", v: "Như phân tích 5 Whys ở trên." },
  { k: "Chỉ số metric", v: "Tỷ lệ đơn đổi trả do \"sai size\" / tổng đơn giao thành công; so sánh trước–sau khi triển khai 8 tuần (value metric)." },
  { k: "Phạm vi (scope)", v: "Làm: gợi ý size tự động + bảng hướng dẫn tự đo tại trang chi tiết sản phẩm. Không làm: công nghệ thử đồ AR 3D trong giai đoạn thử nghiệm." },
  { k: "Rủi ro có dẫn chứng", v: "(1) Khách nhập số đo sai → gợi ý sai (form phức tạp, tỷ lệ bỏ ngang 40%). (2) Size lệch giữa các mã hàng (size M áo phao so với áo gió lệch 2–3cm). (3) PII: số đo + thông tin cá nhân nhạy cảm → phải ẩn danh trước khi gửi API bên thứ ba." },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Root Cause · 5 Whys · First Principles";
const B = "Phần B · Hypothesis · Data-driven · Draft Spec";
const EXAM: ExamQ[] = [
  { part: A, q: "Vì sao chỉ tập trung \"giải quyết triệu chứng bề nổi\" lại gây lãng phí nguồn lực?", opts: ["Vì tiêu tốn nhiều token của AI", "Vì AI không hỗ trợ giải quyết triệu chứng bề nổi", "Vì làm mất nhiều thời gian phỏng vấn người dùng", "Vì nguyên nhân gốc rễ vẫn còn nguyên khiến vấn đề sớm muộn sẽ lặp lại"], correct: 3, why: "Gốc rễ chưa xử lý → vấn đề chắc chắn lặp lại, còn tăng chi phí vận hành. (Phần 1)" },
  { part: A, q: "Kỹ thuật \"5 Whys\" được định nghĩa chính xác nhất là gì?", opts: ["Đặt đúng 5 câu hỏi khảo sát trực tiếp cho khách", "Viết 5 phiên bản prompt khác nhau để thử AI", "Đặt câu hỏi \"Tại sao?\" liên tiếp cho tới khi tìm ra nguyên nhân gốc rễ xử lý được bằng hành động", "Chia bài toán thành đúng 5 bước tuần tự"], correct: 2, why: "5 Whys = hỏi \"tại sao?\" liên tiếp tới nguyên nhân gốc có thể hành động. (Phần 1)" },
  { part: A, q: "Khi nào nên dừng chuỗi câu hỏi trong phương pháp 5 Whys?", opts: ["Dừng ngay khi đã hỏi đủ 5 lần \"Tại sao?\"", "Dừng khi chạm nguyên nhân cốt lõi mà nếu sửa nó, triệu chứng ban đầu biến mất hoàn toàn", "Dừng khi AI không gợi ý thêm câu \"Tại sao\" nào", "Dừng khi tìm được một cá nhân để quy trách nhiệm"], correct: 1, why: "Con số 5 chỉ gợi ý; dừng khi sửa gốc rễ thì triệu chứng biến mất hoàn toàn. (Phần 1)" },
  { part: A, q: "Tại sao \"do nhân viên tư vấn cẩu thả\" thường chưa đúng khi truy tìm nguyên nhân gốc rễ?", opts: ["Vì nguyên nhân gốc rễ thường nằm ở quy trình/hệ thống, không phải lỗi cá nhân riêng lẻ", "Vì nhân viên luôn làm đúng quy trình", "Vì quy định đào tạo cấm nhắc lỗi cá nhân", "Vì AI cấm nhận xét đổ lỗi cho con người"], correct: 0, why: "Con người là một phần của hệ thống; gốc rễ nằm ở quy trình để có giải pháp bền vững. (Phần 1)" },
  { part: A, q: "Một triệu chứng có thể xuất phát từ nhiều nguyên nhân. Bạn nên xử lý thế nào?", opts: ["Chọn ngay nguyên nhân đầu tiên nghĩ ra để giải quyết", "Bỏ qua nguyên nhân, chỉ tập trung triệu chứng bề nổi cho nhanh", "Nhờ khách chọn giúp đâu là nguyên nhân chính", "Cho phép phân tích đa nhánh, nhưng bám sát nhánh có bằng chứng thực tế mạnh nhất để tránh lan man"], correct: 3, why: "Đa nhánh được phép, nhưng bám nhánh có bằng chứng mạnh nhất. (Phần 1)" },
  { part: A, q: "Tư duy nguyên bản (First Principles) được định nghĩa là gì?", opts: ["Nghiên cứu và làm theo chính xác đối thủ mạnh nhất trên thị trường", "Giải quyết theo lối mòn vì \"từ trước đến nay vẫn làm vậy\"", "Phân tích vấn đề phức tạp về các sự thật nền tảng cốt lõi rồi xây lại lập luận từ đó", "Chọn giải pháp công nghệ phổ biến nhất đang dùng rộng rãi"], correct: 2, why: "First Principles = chẻ về sự thật nền tảng rồi xây lập luận mới. (Phần 1)" },
  { part: A, q: "\"Đối thủ ra mắt chatbot AI, ta cũng cần xây chatbot AI\" đại diện cho kiểu tư duy nào?", opts: ["Tư duy nguyên bản (First Principles)", "Tư duy loại suy (Analogy)", "Tư duy dựa trên dữ liệu (Data-driven)", "Tư duy đối chiếu thực tế (Grounding)"], correct: 1, why: "\"Đối thủ làm X nên ta làm X\" là tư duy loại suy (analogy). (Phần 1)" },
  { part: A, q: "Vì sao \"định nghĩa đúng bài toán\" rất quan trọng trước khi tìm giải pháp?", opts: ["Một bài toán định nghĩa rõ ràng đã là một nửa lời giải; giúp tránh giải sai vấn đề", "Giúp tiết kiệm token của AI khi lập trình giải pháp", "Để đáp ứng đúng tiêu chí đánh giá của mentor", "Vì AI không thể xử lý bài toán chưa định nghĩa trước"], correct: 0, why: "Định nghĩa đúng vấn đề = một nửa lời giải, tránh giải sai bài toán. (Phần 1)" },
  { part: A, q: "Khi nhờ AI liệt kê nguyên nhân tiềm ẩn, cách hỏi nào ĐÚNG (tránh định hướng trước)?", opts: ["\"Có phải bảng size khó hiểu là nguyên nhân chính gây đổi trả tăng không?\"", "\"Ý tưởng cải tiến bảng size này chắc chắn rất tốt đúng không?\"", "\"Bảng size có phải yếu tố cốt lõi gây lỗi chọn size không?\"", "\"Hãy liệt kê các nguyên nhân khả dĩ khiến tỷ lệ đổi trả tăng, kèm loại bằng chứng cần để xác nhận từng nguyên nhân\""], correct: 3, why: "Câu trung tính, yêu cầu liệt kê khách quan + bằng chứng; các câu khác định hướng/sycophancy. (Phần 1)" },
  { part: A, q: "Sau khi AI đưa danh sách nguyên nhân tiềm ẩn, bạn xác nhận đâu là gốc rễ bằng cách nào?", opts: ["Tin hoàn toàn vì lập luận AI nghe rất logic", "Dựa vào trực giác và cảm tính cá nhân", "Đối chiếu trực tiếp với dữ liệu thực tế (số liệu cụ thể, quan sát hành vi)", "Hỏi lặp lại nhiều lần cho AI để kiểm tra tính nhất quán"], correct: 2, why: "Xác nhận gốc rễ bắt buộc dựa trên dữ liệu thực tế, không chốt vì AI nghe hợp lý. (Phần 1)" },
  { part: B, q: "\"Giả thuyết\" (Hypothesis) khác biệt cơ bản với \"Mong muốn/Niềm tin cảm tính\" ở điểm nào?", opts: ["Giả thuyết là khẳng định luôn đúng và không bao giờ sai", "Giả thuyết là dự đoán có cấu trúc, có thể đúng hoặc sai và bắt buộc kiểm chứng được bằng dữ liệu", "Giả thuyết là cách phát biểu nghe chuyên nghiệp hơn mong muốn", "Giả thuyết là câu trả lời do AI tự động tạo ra"], correct: 1, why: "Giả thuyết có cấu trúc dự đoán, có thể sai, đo lường & kiểm chứng được. (Phần 2)" },
  { part: B, q: "Công thức tiêu chuẩn để phát biểu một giả thuyết kiểm chứng được là gì?", opts: ["\"Nếu [làm hành động X] cho [đối tượng người dùng Y] thì [chỉ số metric Z] sẽ thay đổi theo hướng [kỳ vọng cụ thể]\"", "\"Chúng ta nên xây tính năng X vì nó chắc chắn hiệu quả tốt\"", "\"Đối thủ đã làm X nên ta cũng cần xây X cho người dùng\"", "\"Cần triển khai X nhằm giúp khách cảm thấy hài lòng hơn\""], correct: 0, why: "Công thức: Nếu [X] cho [Y] thì [metric Z] đổi theo [kỳ vọng]. (Phần 2)" },
  { part: B, q: "Phát biểu nào chỉ dừng ở \"Mong muốn/Niềm tin cảm tính\", CHƯA đạt chuẩn giả thuyết?", opts: ["\"Nếu tích hợp gợi ý size thì tỷ lệ đổi trả do sai size sẽ giảm 10%\"", "\"Nếu rút quy trình thanh toán từ 5 bước còn 2 thì tỷ lệ hoàn tất đơn tăng 5%\"", "\"Nếu bổ sung hình hướng dẫn tự đo thì số khách chọn sai size sẽ giảm\"", "\"Tính năng gợi ý size này chắc chắn sẽ được khách yêu thích và đón nhận rất tốt\""], correct: 3, why: "\"Chắc chắn được yêu thích\" thiếu metric, không thể chứng minh sai → niềm tin. (Phần 2)" },
  { part: B, q: "\"Ra quyết định dựa trên dữ liệu\" (Data-driven) ở cấp độ L2 được hiểu là gì?", opts: ["Phải chờ tới khi có tập dữ liệu hoàn hảo, không sai số mới quyết định", "Không quan tâm số liệu, chỉ tin trực giác cá nhân", "Hiểu rõ mình đang tin vào bằng chứng nào, và bằng chứng đó mạnh tới đâu", "Phải thiết kế và chạy A/B testing quy mô lớn toàn hệ thống"], correct: 2, why: "L2: hiểu rõ chất lượng & độ mạnh bằng chứng (evidence bar), không cần A/B lớn. (Phần 2)" },
  { part: B, q: "\"Giả định ngầm\" (Assumption ẩn) trong phát triển sản phẩm là gì?", opts: ["Một chỉ số đo lường hiệu suất chính của dự án", "Những điều ta mặc định là đúng nhưng thực tế chưa được kiểm chứng cụ thể", "Một bước bắt buộc trong chuỗi câu hỏi 5 Whys", "Một định dạng structured output của AI"], correct: 1, why: "Assumption ẩn = điều mặc định đúng nhưng chưa kiểm chứng. (Phần 2)" },
  { part: B, q: "Với tính năng \"gợi ý size theo số đo cơ thể\", edge case nào có thể phá vỡ giả thuyết ban đầu?", opts: ["Khách tự đo sai hoặc cố tình nhập sai số đo → gợi ý sai size → tỷ lệ đổi trả tăng lên", "Khách tự đo và nhập chính xác 100% các chỉ số cơ thể", "Tính năng chạy mượt với tốc độ phản hồi dưới 1 giây", "Danh mục sản phẩm đa dạng về màu sắc và kiểu dáng"], correct: 0, why: "Nhập số đo sai → gợi ý sai → đổi trả có thể tăng, phá vỡ giả thuyết. (Phần 2)" },
  { part: B, q: "Draft Spec ở cấp độ L2 bắt buộc phải bao gồm những mục nào?", opts: ["Chỉ cần tên tính năng và giao diện phác thảo sơ bộ", "Toàn bộ mã nguồn chi tiết sau khi lập trình xong", "Chỉ cần bảng mã màu và bảng kích cỡ sản phẩm", "Đầy đủ: vấn đề & gốc rễ, giả thuyết, metric, phạm vi (scope) và ≥3 rủi ro có dẫn chứng cụ thể"], correct: 3, why: "Draft spec L2 gồm 5 mục: vấn đề & gốc rễ · giả thuyết · metric · scope · ≥3 rủi ro có dẫn chứng. (Phần 2)" },
  { part: B, q: "Rủi ro có \"dẫn chứng cụ thể\" khác gì so với rủi ro nêu chung chung?", opts: ["Có độ dài lớn hơn và dùng nhiều thuật ngữ tiếng Anh hơn", "Được AI trích xuất tự động, không cần con người chỉnh sửa", "Đi kèm một lý do kỹ thuật hoặc số liệu/bằng chứng thực tế, không mơ hồ như \"AI có thể bị lỗi\"", "Bắt buộc liệt kê chính xác đúng 3 rủi ro trong mọi tài liệu"], correct: 2, why: "Rủi ro có dẫn chứng = kèm lý do/số liệu thực tế cụ thể (vd tỷ lệ bỏ form 40%). (Phần 2)" },
  { part: B, q: "Chỉ số (metric) đưa vào một giả thuyết tốt nên thuộc loại nào?", opts: ["Chỉ số ảo (vanity metric) — vd tổng lượt nhấp vào nút", "Chỉ số giá trị thực tế (value metric) — vd tỷ lệ đổi trả thực tế do chọn sai size", "Tổng số câu trả lời AI đã phản hồi thành công cho khách", "Tổng số lần khách mở xem trang hướng dẫn chọn size"], correct: 1, why: "Metric tốt là value metric (tỷ lệ đổi trả thực), không phải vanity metric. (Phần 2, nối I1.2)" },
  { part: B, q: "Draft Spec tốt ở cấp độ L2 được mô tả chính xác nhất là gì?", opts: ["Trung thực về điều chưa chắc chắn, có giả thuyết đo được và thẳng thắn đối diện rủi ro có dẫn chứng", "Trình bày rất đẹp, nhiều màu sắc và hình minh họa phức tạp", "Chủ động giấu bớt rủi ro để dự án dễ được duyệt nhanh", "Cố nhồi càng nhiều tính năng phức tạp vào phạm vi càng tốt"], correct: 0, why: "Draft spec L2 tốt = trung thực về giả định, giả thuyết đo được, thẳng thắn với rủi ro. (Phần 2)" },
];

const chevR = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
);
const checkSmIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6"><path d="M20 6 9 17l-5-5" /></svg>
);
const clockIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const bookIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>
);
const listIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--iris)" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
);
const searchIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
const checklistIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--iris-deep)" strokeWidth="2.2"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
);

const navStyle = (active: boolean): CSSProperties => ({
  textDecoration: "none",
  color: active ? "var(--fg-1)" : "var(--fg-2)",
  fontWeight: active ? 600 : 500,
});

export function LessonI23() {
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

  const onCourse = state.page === "overview" || state.page === "read";

  return (
    <div
      data-surface="portal"
      style={{ fontFamily: "var(--font-body)", color: "var(--fg-1)", background: "var(--bg-warm)", minHeight: "100vh" }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "26px",
          padding: "15px 44px",
          borderBottom: "1px solid var(--fg-1)",
          position: "sticky",
          top: 0,
          background: "rgba(251,250,246,.92)",
          backdropFilter: "blur(8px)",
          zIndex: 30,
        }}
      >
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); go("overview"); }}
          style={{ font: "800 17px/1 var(--font-impact)", color: "var(--iris)", textDecoration: "none" }}
        >
          YODY<span style={{ color: "var(--fg-1)", fontWeight: 700, fontSize: "15px" }}> Học</span>
        </a>
        <nav style={{ display: "flex", gap: "22px", font: "500 14px/1 var(--font-body)" }}>
          <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={navStyle(onCourse)}>Buổi I2.3</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} style={navStyle(state.page === "gate")}>Gate 2</a>
          <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} style={navStyle(state.page === "exam")}>Final Exam</a>
        </nav>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "7px 14px",
            color: "var(--fg-3)",
            font: "13px/1 var(--font-body)",
          }}
        >
          {searchIcon}Tìm kiếm
        </div>
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

      <footer
        style={{
          padding: "40px 44px",
          textAlign: "center",
          borderTop: "1px solid var(--fg-1)",
          font: "13px/1.6 var(--font-body)",
          color: "var(--fg-3)",
          background: "var(--bg-warm)",
        }}
      >
        © 2026 YODY · Tài liệu đào tạo nội bộ · Intern Product Builder — mọi ví dụ dùng dữ liệu giả lập, không PII thật.
      </footer>
    </div>
  );
}

function OverviewScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Tổng quan I2.3">
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
        {chevR}
        <span>Giai đoạn 2 · Tuần 5–8</span>
        {chevR}
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I2.3 · Critical Thinking (Gate 2)</span>
      </div>

      <div
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
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I2.3 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Gate 2 · Must-pass</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--rose-deep)", background: "var(--rose-tint)", padding: "8px 13px", borderRadius: "999px" }}>🔒 NL2</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Critical Thinking — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>Root Cause &amp; Hypothesis</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Buổi I2.2 đã giúp bạn <b style={{ color: "var(--fg-1)" }}>xác định đúng vấn đề</b> của khách hàng. Buổi I2.3 này sẽ hướng dẫn bạn cách <b style={{ color: "var(--fg-1)" }}>đào sâu tìm kiếm nguyên nhân gốc rễ</b>, từ đó đưa ra <b style={{ color: "var(--fg-1)" }}>giả thuyết kiểm chứng được</b> thay vì phát triển sản phẩm theo cảm tính cá nhân. Đây chính là tấm khiên bảo vệ dự án khỏi hai nguồn lãng phí lớn nhất: <em style={{ fontStyle: "italic" }}>chữa triệu chứng bề nổi</em> và <em style={{ fontStyle: "italic" }}>xây dựng sản phẩm dựa trên niềm tin cảm tính</em>.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~34</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>2</b> phần đọc + Gate 2 + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Hai sai lầm gây lãng phí nguồn lực nhất của các Builder mới vào nghề là: <b style={{ color: "var(--fg-1)" }}>chỉ giải quyết triệu chứng bề nổi thay vì đi sâu vào nguyên nhân gốc rễ</b>, và <b style={{ color: "var(--fg-1)" }}>xây dựng sản phẩm dựa trên niềm tin cảm tính thay vì bằng chứng dữ liệu</b>. Ở cấp độ L2, bạn chưa cần phân tích đa chiều phức tạp (đó là việc của L3), nhưng bắt buộc phải thành thạo kỹ năng 5 Whys và biết cách ra quyết định ở quy mô nhỏ dựa trên dữ liệu thực tế. Đây là <b style={{ color: "var(--fg-1)" }}>buổi đánh giá Gate 2</b> — khép lại giai đoạn Prompt &amp; Tư duy Phân tích.
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

          <section style={{ marginTop: "40px", border: "1px solid var(--gold-deep)", borderRadius: "12px", overflow: "hidden", background: "var(--gold-tint)" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ width: "46px", height: "46px", borderRadius: "12px", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none", fontSize: "23px" }}>⛳</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "7px" }}>Bài nộp bắt buộc của buổi</div>
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>Gate 2 — 5 Whys · Giả thuyết · Draft Spec</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Một tài liệu gồm <b style={{ color: "var(--fg-1)" }}>bản phân tích 5 Whys + 1 giả thuyết kiểm chứng đúng công thức + draft spec phản biện ≥3 rủi ro có dẫn chứng</b>. Nộp cho mentor trước buổi I3.1.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--gold-deep)", color: "var(--gold-deep)" }}>Xem đề &amp; rubric →</a>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{checklistIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Điều kiện vượt Gate 2: đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> <b style={{ color: "var(--fg-1)" }}>và</b> sản phẩm Gate 2 đạt rubric → sang <b style={{ color: "var(--fg-1)" }}>I3.1 — Agentic Workflows &amp; RAG</b>.</p>
              </div>
              <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta" style={{ height: "42px", padding: "0 22px", fontSize: "14px", textDecoration: "none", alignSelf: "center", background: "#fff", border: "1px solid var(--iris)", color: "var(--iris-deep)" }}>Làm bài test →</a>
            </div>
          </section>

          {SHOW_TERMS && (
            <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
              <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 20px" }}>Thuật ngữ buổi này phủ</h2>
              <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "12px" }}>Critical Thinking (Root Cause &amp; Hypothesis)</div>
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
              <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Giả thuyết kiểm chứng sẽ được áp dụng đầy đủ trong Product Canvas ở buổi I4.1.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I2.2 (Design Thinking)</b> → là <b style={{ color: "var(--fg-1)" }}>buổi đánh giá Gate 2</b>. Vượt Gate 2 → sang <b style={{ color: "var(--fg-1)" }}>I3.1 (Agentic Workflows &amp; RAG)</b>.</p>
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
    { title: "Root Cause, 5 Whys & First Principles", open: () => go("read", 0) },
  ];
  const nextArr = [
    { title: "Hypothesis, Data-driven & Draft Spec", kicker: "SAU →", color: "var(--iris-deep)", open: () => go("read", 1) },
    { title: "Gate 2 · Bài nộp →", kicker: "HOÀN THÀNH", color: "var(--gold-deep)", open: () => go("gate") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.3
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
            <span style={{ flex: 1, font: "700 14px/1.3 var(--font-brand)", color: "var(--gold-deep)" }}>Gate 2 · Bài nộp</span>
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I2.3</a>
            {chevR}
            <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>{cur.short}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", font: "700 12px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: cur.cDeep, marginBottom: "12px" }}>
            <span>Phần {cur.n} / 2</span><span style={{ opacity: ".4" }}>·</span><span>{cur.time} đọc</span>
          </div>
          <h1 style={{ font: "800 clamp(36px,4.6vw,54px)/1.04 var(--font-impact)", letterSpacing: "-.026em", margin: "0 0 34px", color: "var(--fg-1)" }}>{cur.title}</h1>

          {state.part === 0 && <Part1 />}
          {state.part === 1 && <Part2 go={go} />}

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

function Part1() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>S</span>
        ai lầm gây lãng phí nguồn lực lớn nhất của người mới bắt đầu là: <b>chỉ tập trung giải quyết triệu chứng bề nổi thay vì đi tìm nguyên nhân gốc rễ</b>. Việc chỉ chữa triệu chứng bề nổi chỉ tạo ra cảm giác giả tạo rằng bạn đang giải quyết được vấn đề — thực tế, vấn đề đó sẽ sớm muộn lặp lại vì nguyên nhân gốc rễ sâu xa vẫn chưa được xử lý triệt để.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Triệu chứng vs nguyên nhân gốc rễ</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>TRIỆU CHỨNG (bề nổi)</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>&quot;Tỷ lệ đổi trả tăng.&quot; → phản xạ: cho đổi trả dễ hơn. Chỉ xoa dịu, còn tăng chi phí kho vận (logistics).</div>
        </div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>NGUYÊN NHÂN GỐC RỄ</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Khách chọn sai size vì <b>bảng size khó hiểu</b> → giải pháp đúng: chuẩn hóa bảng size + hướng dẫn tự đo.</div>
        </div>
      </div>

      <figure style={{ margin: "26px 0" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 26px" }}>
          <div style={{ border: "1px dashed var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "13px 16px", textAlign: "center" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "5px" }}>🩹 TRIỆU CHỨNG NỔI</div>
            <div style={{ font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>&quot;tỷ lệ đổi trả tăng&quot;</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "var(--fg-3)", padding: "4px 0" }}>
            <span style={{ fontSize: "11px", letterSpacing: ".14em", fontFamily: "var(--font-mono)" }}>— mặt nước —</span>
            <span style={{ fontSize: "20px" }}>↓</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <div style={{ border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "11px 16px", textAlign: "center", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>khách chọn sai size</div>
            <div style={{ textAlign: "center", color: "var(--fg-3)", fontSize: "15px" }}>↓</div>
            <div style={{ border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "11px 16px", textAlign: "center", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)" }}>bảng size khó hiểu</div>
            <div style={{ textAlign: "center", color: "var(--fg-3)", fontSize: "15px" }}>↓</div>
            <div style={{ border: "1.5px solid var(--iris-deep)", borderRadius: "10px", background: "#fff", padding: "14px 16px", textAlign: "center" }}>
              <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--iris-deep)", marginBottom: "5px" }}>🧊 GỐC RỄ (ẩn dưới)</div>
              <div style={{ font: "15px/1.5 var(--font-body)", color: "var(--fg-1)", fontWeight: 600 }}>chưa chuẩn hóa bảng size theo dữ liệu thực tế</div>
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Đào xuống nguyên nhân gốc, đừng dán băng cá nhân lên triệu chứng bề nổi.</figcaption>
      </figure>

      <div style={{ margin: "24px 0", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Câu hỏi phản biện cốt lõi</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0, fontStyle: "italic" }}>&quot;Hiện tượng tôi đang quan sát là triệu chứng bề nổi hay nguyên nhân gốc rễ? Nếu tôi giải quyết hiện tượng này, vấn đề thực sự có biến mất hoàn toàn không?&quot;</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · 5 Whys — bộ khung truy tìm nguyên nhân gốc rễ</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>
        <b>5 Whys</b> là một kỹ thuật đơn giản nhưng vô cùng mạnh mẽ: liên tục đặt câu hỏi <b style={{ color: "var(--fg-1)" }}>&quot;Tại sao?&quot;</b> (thường khoảng 5 lần) cho đến khi tìm ra nguyên nhân gốc rễ <b style={{ color: "var(--fg-1)" }}>có thể tác động và giải quyết được bằng hành động cụ thể</b>. Con số 5 chỉ mang tính chất gợi ý — bạn hãy dừng lại khi nhận thấy việc khắc phục nguyên nhân đó sẽ làm triệu chứng ban đầu biến mất hoàn toàn.
      </p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px" }}>
          {whys.map((w, i) => (
            <div key={i} style={{ marginLeft: w.indent }}>
              <div style={{ display: "flex", alignItems: "center", gap: "11px", border: `1px solid ${w.border}`, borderRadius: "10px", background: w.bg, padding: "12px 15px" }}>
                <span style={{ font: "700 10px/1.3 var(--font-mono)", color: "#fff", background: w.badge, padding: "5px 8px", borderRadius: "5px", flex: "none", whiteSpace: "nowrap" }}>{w.tag}</span>
                <span style={{ font: `${w.weight} 14px/1.5 var(--font-body)`, color: "var(--fg-1)" }}>{w.text}</span>
              </div>
              {w.arrow && <div style={{ font: "600 11px/1 var(--font-mono)", color: "var(--fg-3)", padding: "5px 0 5px 16px" }}>↳ Tại sao?</div>}
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Mỗi bậc hỏi &quot;tại sao?&quot; cho tới nguyên nhân gốc có thể hành động.</figcaption>
      </figure>

      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}><b style={{ color: "var(--fg-1)" }}>Ba cạm bẫy lớn khi dùng 5 Whys:</b></p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 26px" }}>
        {pitfalls.map((p, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${p.border}`, borderRadius: "12px", background: p.bg, padding: "16px 18px" }}>
            <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: p.badge, padding: "6px 10px", borderRadius: "6px", flex: "none" }}>{p.n}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: p.color }}>{p.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · First Principles — phân tích về sự thật nền tảng</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>Tư duy nguyên bản (First Principles)</b> là phương pháp bóc tách một vấn đề phức tạp thành những <b style={{ color: "var(--fg-1)" }}>sự thật nền tảng cốt lõi nhất, không thể bàn cãi</b>, rồi từ đó tự xây dựng lập luận và giải pháp mới — hoàn toàn đối lập với <b style={{ color: "var(--fg-1)" }}>tư duy loại suy (analogy)</b> (tư duy sao chép lối mòn: *&quot;đối thủ làm chatbot AI thì mình cũng phải làm chatbot AI&quot;*).
      </p>
      <figure style={{ margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "14px", alignItems: "center" }}>
          <div style={{ border: "1px solid var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "14px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "8px" }}>LOẠI SUY (analogy)</div>
            <div style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-1)" }}>&quot;Đối thủ tích hợp chatbot AI → ta cũng phải làm chatbot AI.&quot; → sao chép theo lối mòn.</div>
          </div>
          <div style={{ color: "var(--fg-3)", fontSize: "22px", textAlign: "center" }}>vs</div>
          <div style={{ border: "1px solid var(--mint)", borderRadius: "10px", background: "var(--mint-tint)", padding: "14px 16px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "8px" }}>FIRST PRINCIPLES</div>
            <div style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-1)" }}>Sự thật gốc: <b>80% câu hỏi khách chỉ xoay quanh size &amp; đổi trả</b> → gợi ý size tự động + FAQ động, chưa chắc cần chatbot phức tạp.</div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Xây giải pháp từ sự thật cốt lõi, tránh &quot;nghe có vẻ hợp thời&quot;.</figcaption>
      </figure>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 26px" }}>
        {fpSteps.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ font: "italic 800 24px/1 var(--font-serif)", color: "var(--iris)", flex: "none", width: "26px" }}>{s.n}</span>
            <span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{s.text}</span>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Định nghĩa đúng vấn đề trước khi tìm giải pháp</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Tư duy phản biện (Critical Thinking) gắn kết chặt chẽ với tư duy thiết kế Design Thinking (I2.2): Trước khi đi tìm giải pháp, hãy chắc chắn rằng bạn <b style={{ color: "var(--fg-1)" }}>đang giải quyết đúng bài toán</b>. Một vấn đề được định nghĩa rõ ràng, chính xác đã là một nửa lời giải.</p>
      <figure style={{ margin: "0 0 26px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {flow.map((f, i) => (
            <span key={i} style={{ display: "inline-flex", font: "600 12px/1.3 var(--font-body)", color: f.color, background: f.bg, border: `1px solid ${f.border}`, padding: "11px 13px", borderRadius: "9px", textAlign: "center", maxWidth: "150px" }}>
              {f.text}
              {f.arrow && <span style={{ color: "var(--fg-3)", fontSize: "18px", marginLeft: "8px" }}>→</span>}
            </span>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 4 — Trình tự chuẩn: từ insight (I2.2) đến giả thuyết &amp; giải pháp.</figcaption>
      </figure>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Dùng AI phân tích nguyên nhân — có kỷ luật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>AI giúp liệt kê các nhánh nguyên nhân khả dĩ và gợi ý câu hỏi &quot;Tại sao&quot; tiếp theo — nhưng phải tuân thủ:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {aiRules.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "10px", background: "#fff", padding: "14px 16px" }}>
            <span style={{ font: "700 11px/1.3 var(--font-mono)", color: r.c, background: r.tint, border: `1px solid ${r.c}`, padding: "6px 9px", borderRadius: "6px", flex: "none", whiteSpace: "nowrap" }}>{r.tag}</span>
            <span style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)" }}>{r.text}</span>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--rose-deep)" }}>Lưu ý:</b> AI chỉ <i>gợi ý giả thuyết về nguyên nhân</i>. Việc <b>xác nhận nguyên nhân gốc rễ</b> bắt buộc dựa trên dữ liệu thực tế (số liệu đổi trả, quan sát hành vi) — không chốt chỉ vì lập luận AI nghe hợp lý.
      </div>

      <div style={{ margin: "36px 0", padding: "26px 28px", background: "var(--bg-ink)", borderRadius: "14px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Tóm tắt 3 ý</div>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#e6e7f2", font: "16px/1.7 var(--font-body)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <li><b>Triệu chứng vs gốc rễ:</b> chỉ sửa triệu chứng là lãng phí vì vấn đề chắc chắn quay lại.</li>
          <li><b>5 Whys</b> truy tìm gốc rễ (tránh dừng sớm, đổ lỗi con người, rẽ nhánh lan man); <b>First Principles</b> phân tích về sự thật cốt lõi, tránh lối mòn loại suy.</li>
          <li><b>Định nghĩa đúng bài toán trước khi tìm giải pháp;</b> AI hỗ trợ tìm nguyên nhân nhưng phải hỏi trung tính, grounding &amp; xác nhận bằng dữ liệu thực tế.</li>
        </ol>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 14px" }}>Tự kiểm tra</h2>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "var(--fg-2)", font: "16px/1.75 var(--font-body)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <li>Với triệu chứng &quot;khách thường bỏ giỏ hàng ở bước thanh toán&quot; — áp dụng 5 Whys để tìm một nguyên nhân gốc rễ xử lý được bằng hành động.</li>
        <li>Vì sao kết luận &quot;do lỗi nhân viên cẩu thả&quot; thường sai/chưa đủ khi truy tìm nguyên nhân gốc rễ?</li>
        <li>Cho một ví dụ tại YODY để phân biệt tư duy loại suy (sao chép) và First Principles.</li>
        <li>Viết lại một prompt nhờ AI liệt kê nguyên nhân tiềm ẩn của việc tỷ lệ hủy đơn tăng — đảm bảo trung tính, không định hướng trước.</li>
      </ol>
    </div>
  );
}

function Part2({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        Khi đã xác định được nguyên nhân gốc rễ, bước đi tiếp theo <b>tuyệt đối không phải là bắt tay vào xây dựng ngay</b> — mà bạn cần xây dựng một <b>giả thuyết có thể kiểm chứng</b> và nghiêm túc <b>phản biện giả thuyết đó bằng dữ liệu</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 16px" }}>1 · Giả thuyết có thể kiểm chứng</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>Giả thuyết (Hypothesis)</b> là một phát biểu mang tính dự đoán có cấu trúc, <b style={{ color: "var(--fg-1)" }}>có thể đúng hoặc sai, và bắt buộc phải kiểm chứng được bằng dữ liệu</b>. Giả thuyết hoàn toàn khác với một mong muốn cảm tính chủ quan (*&quot;làm để khách hài lòng hơn&quot;*), cũng không phải là một kế hoạch hành động đơn thuần (*&quot;chúng ta sẽ xây tính năng X&quot;*).
      </p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1.5px solid var(--iris-deep)", borderRadius: "14px", background: "var(--iris-tint)", padding: "24px 26px", textAlign: "center" }}>
          <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "14px" }}>Công thức chuẩn hóa</div>
          <div style={{ font: "600 19px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
            Nếu <span style={{ background: "#fff", border: "1px solid var(--iris)", borderRadius: "6px", padding: "2px 9px" }}>làm hành động X</span> cho <span style={{ background: "#fff", border: "1px solid var(--gold-deep)", borderRadius: "6px", padding: "2px 9px" }}>đối tượng Y</span> thì <span style={{ background: "#fff", border: "1px solid var(--mint)", borderRadius: "6px", padding: "2px 9px" }}>metric Z</span> sẽ thay đổi theo hướng <span style={{ background: "#fff", border: "1px solid var(--fg-3)", borderRadius: "6px", padding: "2px 9px" }}>kỳ vọng cụ thể</span>.
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Đo được và có thể sai = giả thuyết. Nhất quán với Product Canvas (I4.1).</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>
          <i>&quot;Nếu <b>bổ sung hướng dẫn tự đo + gợi ý size tự động theo chiều cao &amp; cân nặng</b> cho <b>khách mua áo khoác online lần đầu</b> thì <b>tỷ lệ đổi trả do sai kích cỡ</b> sẽ giảm.&quot;</i> — gắn với gốc rễ ở Phần 1 và hoàn toàn đo lường được.
        </p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Giả thuyết vs mong muốn / niềm tin cảm tính</h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "13px 15px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Tiêu chí</div>
          <div style={{ background: "var(--mint-tint)", padding: "13px 15px", font: "700 13px/1.3 var(--font-brand)", color: "var(--mint-deep)", borderLeft: "1px solid var(--border)" }}>Giả thuyết (đạt)</div>
          <div style={{ background: "var(--rose-tint)", padding: "13px 15px", font: "700 13px/1.3 var(--font-brand)", color: "var(--rose-deep)", borderLeft: "1px solid var(--border)" }}>Mong muốn (chưa đạt)</div>
          {compare.map((c, i) => (
            <Row3 key={i} c={c} />
          ))}
        </div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--gold-deep)" }}>Nối buổi trước:</b> ý không kiểm chứng được (I2.2) chỉ là niềm tin cảm tính; metric trong giả thuyết phải là <b>chỉ số giá trị thực tế (value metric)</b>, không dùng chỉ số ảo (vanity metric) để làm đẹp báo cáo (I1.2).
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Ra quyết định dựa trên dữ liệu — ngưỡng bằng chứng</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>
        <b>Tư duy dựa trên dữ liệu (Data-driven)</b> không có nghĩa là bạn ngồi thụ động chờ đợi một tập dữ liệu hoàn hảo không sai số (điều đó không bao giờ có trong thực tế). Bản chất của nó là việc bạn <b style={{ color: "var(--fg-1)" }}>thấu hiểu rõ mình đang tin vào bằng chứng nào, và bằng chứng đó có độ tin cậy mạnh tới đâu</b> để ra quyết định. Ba câu hỏi phản biện cốt lõi:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 20px" }}>
        {evidenceQ.map((q, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${q.border}`, borderRadius: "12px", background: q.bg, padding: "16px 18px" }}>
            <span style={{ fontSize: "22px", flex: "none", lineHeight: "1.2" }}>{q.icon}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: q.color }}>{q.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{q.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        Ở L2 bạn <b>chưa</b> cần chạy A/B testing quy mô lớn (đó là L4). Nhưng bắt buộc <b>nêu rõ &amp; trả lời được</b> ba câu hỏi trên trước khi đề xuất phát triển bất kỳ tính năng nào.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Bản đặc tả nháp (Draft Spec) &amp; phản biện rủi ro</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>Tài liệu đặc tả sản phẩm (Spec)</b> là một tài liệu ngắn mô tả rõ <i>chúng ta làm gì và vì sao lại làm</i>, giúp các bên dễ dàng đánh giá và tham gia phản biện. Một bản đặc tả sản phẩm nháp (Draft Spec) tinh gọn ở cấp độ L2 bắt buộc phải gồm 5 mục:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 22px" }}>
        {specParts.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: "1px solid var(--border)", borderRadius: "12px", background: "#fff", padding: "16px 18px" }}>
            <span style={{ font: "italic 800 26px/1 var(--font-serif)", color: s.c, flex: "none", width: "30px" }}>{s.n}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--fg-1)" }}>{s.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--rose-deep)", marginBottom: "12px" }}>3 rủi ro có dẫn chứng cụ thể · ví dụ giả lập</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {risks.map((r, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid var(--rose-deep)", borderRadius: "9px", padding: "12px 14px" }}>
              <b style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--fg-1)" }}>{r.risk}</b>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-2)", marginTop: "3px" }}><b style={{ color: "var(--rose-deep)" }}>Dẫn chứng:</b> {r.evidence}</div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Draft spec tốt ở L2 <b>không</b> cần vẽ bức tranh hoàn hảo — quan trọng nhất là <b style={{ color: "var(--fg-1)" }}>trung thực thừa nhận điểm chưa chắc chắn</b>, có giả thuyết đo được, và thẳng thắn đối diện rủi ro.</p>

      <div style={{ margin: "36px 0", padding: "26px 28px", background: "var(--bg-ink)", borderRadius: "14px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Tóm tắt 3 ý</div>
        <ol style={{ margin: 0, paddingLeft: "20px", color: "#e6e7f2", font: "16px/1.7 var(--font-body)", display: "flex", flexDirection: "column", gap: "10px" }}>
          <li>Sau khi tìm gốc rễ, chuyển sang <b>giả thuyết kiểm chứng được</b> theo công thức &quot;Nếu [X] cho [Y] thì [metric Z]…&quot;; phân biệt rõ với mong muốn cảm tính.</li>
          <li><b>Data-driven = hiểu rõ chất lượng bằng chứng:</b> soi giả định ngầm, hỏi tính đại diện của dữ liệu, tìm edge case có thể phá vỡ giả thuyết.</li>
          <li><b>Draft spec L2</b> gồm: vấn đề &amp; gốc rễ · giả thuyết · metric thực tế · phạm vi (scope) · <b>≥3 rủi ro có dẫn chứng</b> (kèm edge case/bảo mật).</li>
        </ol>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "40px 0 14px" }}>Tự kiểm tra</h2>
      <ol style={{ margin: 0, paddingLeft: "20px", color: "var(--fg-2)", font: "16px/1.75 var(--font-body)", display: "flex", flexDirection: "column", gap: "8px" }}>
        <li>Xây một giả thuyết kiểm chứng được (đúng công thức X/Y/Z) cho một pain point khách hàng bạn tự chọn.</li>
        <li>Với một đề xuất tính năng: chỉ ra 1 giả định ngầm lớn nhất và đề xuất cách kiểm chứng rẻ nhất.</li>
        <li>Vì sao &quot;chắc chắn cần gợi ý size vì nó rất hữu ích&quot; chưa đạt chuẩn giả thuyết? Sửa lại cho đúng công thức.</li>
        <li>Đưa 3 rủi ro có dẫn chứng cụ thể cho đề xuất &quot;push notification cá nhân hóa nhắc hoàn tất giỏ hàng&quot;.</li>
      </ol>

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--gold-deep)", marginBottom: "4px" }}>Đã nắm nền tảng Critical Thinking 🎯</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Hoàn tất buổi bằng <b style={{ color: "var(--fg-1)" }}>Sản phẩm thực hành Gate 2</b> và <b style={{ color: "var(--fg-1)" }}>Final Exam</b> để vượt Gate 2.</div>
        </div>
        <a href="#" onClick={(e) => { e.preventDefault(); go("gate"); }} className="cta cta-primary" style={{ height: "44px", padding: "0 24px", fontSize: "14px", textDecoration: "none", background: "var(--gold-deep)", borderColor: "var(--gold-deep)" }}>Sang Gate 2 →</a>
      </div>
    </div>
  );
}

function Row3({ c }: { c: { k: string; good: string; bad: string } }) {
  return (
    <>
      <div style={{ padding: "14px 15px", font: "600 13px/1.5 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", background: "#fff" }}>{c.k}</div>
      <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{c.good}</div>
      <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{c.bad}</div>
    </>
  );
}

function GateScreen({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div data-screen-label="Gate 2" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>⛳ Gate 2 · Bài nộp bắt buộc</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Gate 2 — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--gold-deep)" }}>Bài nộp cuối giai đoạn</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 24px", maxWidth: "640px" }}>Đánh giá NL2 (Critical Thinking) + liên kết NL5 (prompt) &amp; NL1 (metric). Nộp bài cho mentor <b style={{ color: "var(--fg-1)" }}>trước buổi I3.1</b>.</p>

      <div style={{ border: "1px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", padding: "20px 24px", margin: "0 0 34px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "10px" }}>Hai điều kiện vượt Gate 2</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>
            <span style={{ font: "700 13px/1.5 var(--font-mono)", color: "var(--gold-deep)", flex: "none" }}>a.</span>
            <span>Sản phẩm thực hành (deliverable) được đánh giá <b>Đạt</b> theo rubric.</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>
            <span style={{ font: "700 13px/1.5 var(--font-mono)", color: "var(--gold-deep)", flex: "none" }}>b.</span>
            <span>Final Exam đạt tối thiểu <b>16/20</b>.</span>
          </div>
        </div>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Đề bài</h2>
      <p style={{ font: "400 17px/1.75 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Chọn <b style={{ color: "var(--fg-1)" }}>một vấn đề thực tế/giả lập của khách hàng tại YODY</b> (gợi ý: dùng chính pain point từ Báo cáo Insight Người dùng ở I2.2). Nộp một tài liệu gồm <b style={{ color: "var(--fg-1)" }}>3 phần</b>:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", margin: "0 0 22px" }}>
        {gateTasks.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: "18px", background: "#fff", border: "1px solid var(--fg-1)", borderRadius: "12px", padding: "20px 22px", alignItems: "flex-start" }}>
            <span style={{ font: "italic 800 40px/1 var(--font-serif)", color: t.c, flex: "none", width: "44px" }}>{t.n}</span>
            <div style={{ flex: 1 }}>
              <h3 style={{ font: "700 18px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>{t.title}</h3>
              <p style={{ font: "14px/1.65 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 40px", padding: "16px 20px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--iris-deep)" }}>Mẹo:</b> được khuyến khích dùng AI hỗ trợ (gợi ý phân nhánh nguyên nhân, soát rủi ro) — nhưng bắt buộc <b>đặt câu hỏi trung tính</b> và <b>đối chiếu thực tế (grounding)</b>. Ghi rõ những điểm bạn đã tự kiểm chứng lại.
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 8px" }}>Tiêu chí đánh giá ĐẠT (Rubric)</h2>
      <p style={{ font: "400 15px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "0 0 18px" }}>Bài ĐẠT khi đáp ứng đầy đủ cả 4 tiêu chí:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", margin: "0 0 20px" }}>
        {rubric.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "13px", alignItems: "flex-start", border: "1px solid var(--mint)", borderRadius: "12px", background: "var(--mint-tint)", padding: "16px 18px" }}>
            <span style={{ color: "var(--mint-deep)", flex: "none", marginTop: "1px" }}>{checkSmIcon}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: "var(--mint-deep)" }}>{r.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 40px", padding: "18px 22px", background: "var(--gold-tint)", border: "1px dashed var(--gold-deep)", borderRadius: "12px" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>⭐ Mức xuất sắc (Stretch goal)</div>
        <p style={{ font: "15px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Nhận diện được <b>giả định ngầm lớn nhất</b> và đề xuất cách kiểm chứng chi phí thấp nhất; phân biệt rõ điều <b>đã có bằng chứng</b> với điều hiện vẫn <b>chỉ là giả định</b>.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 16px" }}>Bài làm mẫu tham khảo <span style={{ font: "600 14px/1 var(--font-mono)", color: "var(--mint-deep)", background: "var(--mint-tint)", border: "1px solid var(--mint)", padding: "6px 10px", borderRadius: "6px", verticalAlign: "middle" }}>Mức ĐẠT · giả lập</span></h2>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ background: "var(--bg-ink)", padding: "16px 22px" }}>
          <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "5px" }}>Vấn đề ban đầu</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "#e6e7f2" }}>Tỷ lệ đơn hàng đổi trả áo khoác mua online tăng cao trong quý vừa qua.</div>
        </div>
        <div style={{ padding: "22px 24px" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "12px" }}>1 · Phân tích 5 Whys</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", margin: "0 0 22px" }}>
            {sampleWhys.map((w, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", alignItems: "baseline", font: "14px/1.55 var(--font-body)", color: "var(--fg-1)" }}>
                <span style={{ font: "700 10px/1.4 var(--font-mono)", color: w.badge, flex: "none", whiteSpace: "nowrap" }}>{w.tag}</span>
                <span style={{ fontWeight: w.weight === "700" ? 700 : 400 }}>{w.text}</span>
              </div>
            ))}
          </div>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "10px" }}>2 · Giả thuyết có thể kiểm chứng</div>
          <div style={{ border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "14px 16px", font: "italic 15px/1.65 var(--font-body)", color: "var(--fg-1)", margin: "0 0 22px" }}>
            &quot;Nếu <b>bổ sung hướng dẫn tự đo + gợi ý size tự động theo chiều cao &amp; cân nặng</b> cho <b>khách mua áo khoác online lần đầu</b> thì <b>tỷ lệ đơn hàng đổi trả do sai kích cỡ</b> sẽ giảm.&quot;
          </div>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--mint-deep)", marginBottom: "12px" }}>3 · Draft spec</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {sampleSpec.map((s, i) => (
              <div key={i} style={{ borderLeft: "2px solid var(--border)", padding: "2px 0 2px 14px" }}>
                <b style={{ font: "600 14px/1.4 var(--font-body)", color: "var(--fg-1)" }}>{s.k}</b>
                <div style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", marginTop: "2px" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 20px", background: "var(--mint-tint)", borderLeft: "3px solid var(--mint)", borderRadius: "0 10px 10px 0", font: "14px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--mint-deep)" }}>Nhận xét:</b> đáp ứng đủ 4 tiêu chí, giả thuyết đo được, rủi ro có dẫn chứng (cả edge case &amp; PII) → <b>ĐẠT</b>. Nếu phần 2 ghi mơ hồ <i>&quot;làm gợi ý size cho khách dễ chọn&quot;</i> (thiếu metric, không thể chứng minh sai) → <b style={{ color: "var(--rose-deep)" }}>CHƯA ĐẠT</b>.
      </div>

      <div style={{ display: "flex", gap: "14px", marginTop: "34px", flexWrap: "wrap" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("exam"); }} className="cta cta-primary" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none" }}>Làm Final Exam →</a>
        <a href="#" onClick={(e) => { e.preventDefault(); go("read", 0); }} className="cta" style={{ height: "46px", padding: "0 26px", fontSize: "15px", textDecoration: "none", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)" }}>Đọc lại Phần 1</a>
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
  go: (p: Page, part?: number) => void;
  pick: (qi: number, oi: number) => void;
  submit: () => void;
  reset: () => void;
}) {
  const { answers, submitted } = state;
  let score = 0;
  EXAM.forEach((Q, qi) => { if (answers[qi] === Q.correct) score++; });
  const passed = score >= PASS_SCORE;
  const result = passed
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20. Kết hợp với sản phẩm Gate 2 đạt rubric → vượt Gate 2, sang I3.1 — Agentic Workflows & RAG.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–10 → đọc lại Phần 1 (Root Cause/5 Whys); sai nhiều câu 11–20 → đọc lại Phần 2 (Hypothesis/Draft Spec).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const answered = Object.keys(answers).length;
  const cursor = submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I2.3
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · điều kiện vượt Gate 2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I2.3</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Chọn xong bấm &quot;Nộp bài&quot; để chấm và xem giải thích.</p>

      {submitted && (
        <div style={{ border: `2px solid ${result.border}`, background: result.bg, borderRadius: "16px", padding: "26px 30px", marginBottom: "34px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
          <div style={{ font: "italic 800 64px/1 var(--font-serif)", color: result.color }}>{score}<span style={{ font: "800 26px/1 var(--font-impact)", color: "var(--fg-3)" }}>/20</span></div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ font: "700 22px/1.2 var(--font-impact)", color: result.color, marginBottom: "6px" }}>{result.title}</div>
            <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>{result.msg}</div>
          </div>
          <button onClick={reset} className="cta" style={{ height: "44px", padding: "0 22px", fontSize: "14px", background: "#fff", border: "1px solid var(--fg-1)", color: "var(--fg-1)", cursor: "pointer" }}>Làm lại</button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {EXAM.map((Q, qi) => {
          const sel = answers[qi];
          return (
            <div key={qi} style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "24px 26px" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "14px" }}>
                <span style={{ font: "italic 800 22px/1 var(--font-serif)", color: "var(--iris)" }}>{qi + 1}</span>
                <span style={{ font: "600 11px/1 var(--font-mono)", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--fg-3)" }}>{Q.part}</span>
              </div>
              <p style={{ font: "600 17px/1.5 var(--font-body)", color: "var(--fg-1)", margin: "0 0 16px" }}>{Q.q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
                {Q.opts.map((text, oi) => {
                  const letter = "ABCD"[oi];
                  let bg = "#fff", border = "var(--border)", fg = "var(--fg-1)", mark = "", markColor = "transparent", badgeBg = "var(--bg-muted)", badgeFg = "var(--fg-2)";
                  if (submitted) {
                    if (oi === Q.correct) { bg = "var(--mint-tint)"; border = "var(--mint)"; fg = "var(--mint-deep)"; mark = "✓"; markColor = "var(--mint-deep)"; badgeBg = "var(--mint)"; badgeFg = "#fff"; }
                    else if (oi === sel) { bg = "var(--rose-tint)"; border = "var(--rose-deep)"; fg = "var(--rose-deep)"; mark = "✕"; markColor = "var(--rose-deep)"; badgeBg = "var(--rose-deep)"; badgeFg = "#fff"; }
                    else { fg = "var(--fg-3)"; }
                  } else if (oi === sel) { bg = "var(--iris-tint)"; border = "var(--iris)"; fg = "var(--iris-deep)"; badgeBg = "var(--iris)"; badgeFg = "#fff"; }
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
              {submitted && (
                <div style={{ marginTop: "13px", padding: "12px 15px", background: "var(--bg-warm)", borderRadius: "9px", font: "14px/1.6 var(--font-body)", color: "var(--fg-2)" }}>
                  <b style={{ color: "var(--fg-1)" }}>Vì sao:</b> {Q.why}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <div style={{ position: "sticky", bottom: 0, marginTop: "26px", padding: "18px 0", background: "linear-gradient(to top, var(--bg-warm) 60%, transparent)", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
          <button onClick={submit} className="cta cta-primary" style={{ height: "48px", padding: "0 30px", fontSize: "15px", cursor: "pointer" }}>Nộp bài &amp; chấm điểm</button>
          <span style={{ font: "500 14px/1.4 var(--font-body)", color: "var(--fg-3)" }}>Đã trả lời <b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>{answered}</b> / 20 câu</span>
        </div>
      )}
    </div>
  );
}