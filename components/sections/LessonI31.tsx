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
  { n: "01", short: "Agent, Workflow & HITL", title: "Agent, Agentic Workflow & Human-in-the-loop", time: "~17 phút", c: "var(--iris)", cDeep: "var(--iris-deep)", tint: "var(--iris-tint)" },
  { n: "02", short: "RAG, Embedding & Vector", title: "RAG, Embedding & Vector Search", time: "~18 phút", c: "var(--gold)", cDeep: "var(--gold-deep)", tint: "var(--gold-tint)" },
  { n: "03", short: "MCP, Tool & Skills", title: "MCP, Tool & Skills", time: "~13 phút", c: "var(--mint)", cDeep: "var(--mint-deep)", tint: "var(--mint-tint)" },
];

const PARTS = [
  { ...PART_META[0], desc: "Agent vs hỏi–đáp một lượt, single-agent flow (L2), khung workflow 4 ô bắt buộc, Cowork task loop, và đặt HITL đúng hai \"vị trí vàng\".", tags: ["Agent / Agentic", "Workflow 4 ô", "HITL"] },
  { ...PART_META[1], desc: "Vấn đề RAG giải quyết, pipeline 4 bước, embedding & vector search, nguyên nhân retrieval trúng/trật, và vị trí RAG trong cây quyết định giải pháp.", tags: ["RAG", "Embedding", "Vector search"] },
  { ...PART_META[2], desc: "Từ Tool Use đến MCP (ổ cắm chuẩn), phân biệt Skill vs Plugin, và ba kỷ luật an toàn khi kết nối AI với nguồn dữ liệu thật.", tags: ["MCP", "Skill vs Plugin", "An toàn"] },
];

const OBJECTIVES = [
  "Giải thích khác biệt giữa agent/agentic AI và hỏi–đáp một lượt; mô tả cấu trúc một single-agent flow từ mẫu có sẵn.",
  "Thiết kế một workflow AI theo mô hình 4 bước: Input → AI làm gì → Output đi đâu → Human review ở đâu.",
  "Đặt điểm kiểm soát con người (HITL) vào đúng các \"vị trí vàng\".",
  "Giải thích nguyên lý RAG; vai trò của embedding & vector search; nguyên nhân retrieval trúng/trật.",
  "Giải thích khái niệm MCP và khi nào cần dùng để kết nối AI với công cụ hoặc nguồn dữ liệu doanh nghiệp.",
];

const MUST_KNOW = ["RAG", "Agent / Agentic AI", "Tool Use (I2.1)", "Human-in-the-loop"];
const NICE_KNOW = ["MCP", "Embedding (ôn I1.1)", "Vector search", "Grounding & PII (I1.2)", "Multi-agent (chỉ giới thiệu)"];

const META = [
  { k: "Thời lượng live", v: "120 phút" },
  { k: "Thời gian đọc", v: "~48 phút" },
  { k: "Giai đoạn", v: "2 · Tuần 5–8" },
  { k: "Cấp độ", v: "L2" },
  { k: "Năng lực", v: "NL6" },
  { k: "Gate", v: "Không · buổi tích lũy" },
  { k: "Cập nhật", v: "05 / 07 / 2026" },
];

// Phần 1 — workflow 4 ô + task loop
const WF4 = [
  { n: "1 · INPUT", title: "Đầu vào", q: "Dữ liệu gì, từ nguồn nào?", ex: "200 phản hồi đổi/trả trong tuần (đã ẩn PII)", badge: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", exColor: "var(--rose-deep)", arrow: true },
  { n: "2 · AI LÀM GÌ", title: "Hành động cụ thể", q: "Động từ kiểm được?", ex: "Gán nhãn lý do đổi/trả theo 6 nhóm định sẵn", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", exColor: "var(--gold-deep)", arrow: true },
  { n: "3 · OUTPUT", title: "Đầu ra đi đâu", q: "Ai dùng, để làm gì?", ex: "Bảng tần suất lỗi gửi đội sản phẩm để ưu tiên xử lý", badge: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", exColor: "var(--iris-deep)", arrow: true },
  { n: "4 · HUMAN", title: "Con người duyệt", q: "Kiểm ở bước nào?", ex: "Mentor phê duyệt bảng phân loại trước khi làm báo cáo", badge: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", exColor: "var(--mint-deep)", arrow: false },
];
const LOOP = [
  { text: "Bạn giao việc + yêu cầu & giới hạn", color: "var(--iris-deep)", bg: "var(--iris-tint)", border: "var(--iris)", arrow: true },
  { text: "AI tự thực thi chuỗi bước + gọi công cụ", color: "var(--gold-deep)", bg: "var(--gold-tint)", border: "var(--gold-deep)", arrow: true },
  { text: "Bạn kiểm kết quả tại checkpoint", color: "var(--mint-deep)", bg: "var(--mint-tint)", border: "var(--mint)", arrow: true },
  { text: "Lặp hoặc điều chỉnh nếu cần", color: "var(--fg-2)", bg: "#fff", border: "var(--border)", arrow: false },
];

// Phần 2 — RAG pipeline + retrieval table + approach
const RAG_STEPS = [
  { n: "1", title: "Thu thập & chia nhỏ", desc: "Cắt tài liệu gốc thành các chunk ngắn vừa đủ.", badge: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", arrow: true },
  { n: "2", title: "Nhúng (Embed)", desc: "Số hóa mỗi chunk thành vector → lưu vào vector database.", badge: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", arrow: true },
  { n: "3", title: "Truy xuất (Retrieve)", desc: "Câu hỏi → vector; tìm các đoạn gần nghĩa nhất.", badge: "var(--iris-deep)", border: "var(--iris)", bg: "var(--iris-tint)", arrow: true },
  { n: "4", title: "Tạo câu trả lời", desc: "AI trả lời grounded trên các đoạn tìm được.", badge: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", arrow: false },
];
const RETRIEVAL = [
  { k: "Chunk chưa hợp lý", sign: "Quá dài → loãng nghĩa; quá ngắn → mất ngữ cảnh xung quanh.", fix: "Chia nhỏ theo từng ý / đoạn văn trọn vẹn." },
  { k: "Câu hỏi thiếu rõ ràng", sign: "Câu hỏi quá ngắn/thiếu ngữ cảnh → vector không phản ánh đúng ý đồ.", fix: "Làm rõ câu hỏi hoặc tự bổ sung ngữ cảnh trước khi tìm." },
  { k: "Nguồn thiếu / lỗi thời", sign: "Kho không có thông tin cần tìm hoặc tài liệu chưa cập nhật.", fix: "Rà soát, bổ sung, cập nhật kho tài liệu nội bộ thường xuyên." },
  { k: "Số đoạn chưa tối ưu", sign: "Lấy quá ít → thiếu thông tin; quá nhiều → nhiễu AI, tốn token.", fix: "Điều chỉnh tham số top-k ở mức vừa đủ." },
];
const APPROACH = [
  { order: "ƯU TIÊN 1", title: "Tối ưu prompt", desc: "Giải quyết trước bằng prompt tốt (I2.1).", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)", arrow: true },
  { order: "ƯU TIÊN 2", title: "RAG", desc: "Khi AI cần nạp thêm kiến thức bên ngoài / dữ liệu nội bộ.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", arrow: true },
  { order: "CUỐI CÙNG", title: "Fine-tuning", desc: "Giải pháp kỹ thuật cuối cùng được cân nhắc.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", arrow: false },
];

// Phần 3 — MCP / Skill vs Plugin / safety
const MCP_SOURCES = ["Kho sản phẩm", "Hệ thống đơn hàng", "Tài liệu nội bộ", "Công cụ tra cứu"];
const SKILL_PLUGIN = [
  { k: "Bản chất", skill: "Quy trình xử lý công việc được cấu trúc hóa để tái sử dụng.", plugin: "Cổng kết nối kỹ thuật đến công cụ hoặc hệ thống bên ngoài." },
  { k: "Mục đích", skill: "Chuẩn hóa quy trình thực hiện một nhiệm vụ cụ thể của AI.", plugin: "Cho AI truy xuất dữ liệu thực tế hoặc thực hiện hành động trên hệ thống khác." },
  { k: "Ví dụ YODY (giả lập)", skill: "Kỹ năng \"Phân loại đánh giá khách hàng theo 6 nhãn chuẩn\".", plugin: "Trình cắm kết nối hệ thống ERP để tra cứu tồn kho sản phẩm." },
];
const SAFETY_RULES = [
  { n: "1", title: "Chọn công cụ sát bài toán — tránh kích hoạt tất cả", desc: "Cung cấp thừa công cụ làm AI phân tâm (nhiễu), tăng rủi ro bảo mật và tốn token không đáng có.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)", badge: "var(--rose-deep)" },
  { n: "2", title: "Chỉ liên kết với nguồn & công cụ đã duyệt an toàn", desc: "Đặc biệt khi tiếp xúc dữ liệu thật (PII khách hàng, bí mật kinh doanh) — ranh giới đỏ không được vi phạm (I1.2).", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)", badge: "var(--gold-deep)" },
];
const SAFETY_3 = [
  { icon: "🛑", title: "Kiểm soát bởi con người (HITL · Phần 1)", desc: "Bắt buộc có chốt kiểm duyệt trước khi AI thực thi bất kỳ hành động không thể hoàn tác nào qua công cụ.", color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" },
  { icon: "🔒", title: "Bảo vệ dữ liệu nhạy cảm (PII & bí mật · I1.2)", desc: "Phân quyền rõ, mã hóa/ẩn PII; tuyệt đối không nối AI công cộng với nguồn dữ liệu cá nhân chưa xử lý.", color: "var(--gold-deep)", border: "var(--gold-deep)", bg: "var(--gold-tint)" },
  { icon: "✅", title: "Đảm bảo tính xác thực (Grounding · I1.2)", desc: "Dùng kết quả công cụ trả về làm căn cứ thực tế duy nhất; vẫn kiểm duyệt output kỹ trước khi gửi người dùng cuối.", color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" },
];

interface ExamQ { part: string; q: string; opts: string[]; correct: number; why: string; }
const A = "Phần A · Agent · Workflow · HITL", B = "Phần B · RAG · Embedding · Vector", C = "Phần C · MCP · Tool · Skills";
const EXAM: ExamQ[] = [
  { part: A, q: "Mô hình \"Tác nhân thông minh (Agent / Agentic AI)\" khác biệt thế nào so với hỏi – đáp (chat) thông thường một lượt?", opts: ["AI tự thực hiện một chuỗi bước nhằm đạt mục tiêu, biết gọi công cụ ngoài và tự quyết định bước tiếp theo trong phạm vi được phân quyền", "AI chỉ trả ra câu trả lời dài và chi tiết hơn", "AI luôn tiêu tốn lượng token lớn hơn", "AI luôn chỉ phản hồi duy nhất một câu trả lời rồi dừng lại"], correct: 0, why: "Agent thực hiện chuỗi bước hướng mục tiêu + gọi công cụ + tự quyết định bước tiếp theo trong phạm vi được giao. (Phần 1)" },
  { part: A, q: "Ở cấp độ năng lực L2, bạn cần tập trung vào thiết kế và áp dụng loại quy trình nào?", opts: ["Quy trình đa tác nhân (Multi-agent) phức tạp", "Quy trình đơn tác nhân (Single-agent flow) dựa trên các mẫu có sẵn", "Không sử dụng bất kỳ cơ chế agent nào", "Chỉ thực hiện hỏi – đáp một lượt thông thường"], correct: 1, why: "L2 tập trung single-agent flow từ mẫu có sẵn; multi-agent là L3+. (Phần 1)" },
  { part: A, q: "Một quy trình AI (workflow) hoàn chỉnh bắt buộc phải xác định rõ 4 yếu tố nào?", opts: ["Số lượng token, Temperature, Chi phí, Độ trễ", "Vai trò, Định dạng, Ràng buộc, Ví dụ minh họa", "Đầu vào (Input) → AI làm gì → Đầu ra (Output) gửi đi đâu → Con người duyệt (Human review) ở đâu", "Vấn đề, Người dùng, Chỉ số đo lường, Rủi ro"], correct: 2, why: "4 ô bắt buộc: Input → AI làm gì → Output đi đâu → Human review ở đâu. (Phần 1)" },
  { part: A, q: "Tại sao mô tả bước là \"AI xử lý dữ liệu\" bị coi là lỗi thiết kế quy trình?", opts: ["Vì câu mô tả này quá dài dòng", "Vì thực tế AI không thể xử lý được dữ liệu", "Vì mô tả này làm tiêu tốn nhiều token không cần thiết", "Vì đó là mô tả mơ hồ, không kiểm tra được kết quả đúng/sai; thiết kế quy trình cần động từ hành động cụ thể"], correct: 3, why: "\"AI xử lý dữ liệu\" mơ hồ, không đo được; phải dùng động từ hành động cụ thể. (Phần 1)" },
  { part: A, q: "Vòng lặp nhiệm vụ (task loop) trên Cowork khác gì hỏi – đáp chat thông thường?", opts: ["Bạn chỉ thiết lập khung yêu cầu và duyệt kết quả tại checkpoint, AI tự động thực thi chuỗi bước và dùng công cụ — thay vì thao tác thủ công từng bước", "AI phản hồi thông tin với tốc độ nhanh hơn nhiều lần", "Quy trình được tự động hóa hoàn toàn và không cần con người can thiệp", "Hệ thống AI chỉ thực thi duy nhất một bước rồi tự dừng"], correct: 0, why: "Task loop: bạn định khung & duyệt tại chốt, AI tự chạy chuỗi hành động + gọi công cụ. (Phần 1)" },
  { part: A, q: "Đâu là một \"vị trí vàng\" bắt buộc đặt điểm kiểm soát con người (HITL)?", opts: ["Ngay sau khi output đã được gửi trực tiếp đến khách hàng", "Ngay sau bước AI dễ mắc lỗi (suy luận phức tạp hoặc tổng hợp dữ liệu dễ sinh ảo tưởng)", "Chỉ thiết lập sau khi khách hàng phản hồi khiếu nại", "Không cần thiết lập nếu mô hình AI rất mạnh"], correct: 1, why: "Vị trí vàng 1: ngay sau bước AI dễ sai (suy luận phức tạp / tổng hợp số liệu → hallucination). (Phần 1)" },
  { part: A, q: "Vị trí vàng thứ hai để thiết lập chốt HITL trong quy trình là gì?", opts: ["Ngay tại bước tiếp nhận dữ liệu đầu vào đầu tiên", "Sau tất cả mọi bước thực thi mà không ngoại trừ bước nào", "Ngay trước khi hệ thống thực hiện một hành động không thể hoàn tác (gửi email hàng loạt, đăng nội dung công khai)", "Sau khi hệ thống đã hoàn tất gửi thông tin đến khách hàng"], correct: 2, why: "Vị trí vàng 2: ngay trước hành động không thể hoàn tác. (Phần 1)" },
  { part: A, q: "Tại sao KHÔNG nên đặt chốt HITL để con người kiểm duyệt ở tất cả các bước?", opts: ["Vì tỷ lệ sai sót của con người cao hơn AI", "Vì mô hình AI hoạt động kém hiệu quả hơn khi bị kiểm duyệt liên tục", "Vì việc này tiêu hao nhiều tài nguyên điện năng của hệ thống", "Vì duyệt mọi bước sẽ triệt tiêu giá trị tự động hóa; mục tiêu là giảm rủi ro lớn nhất với chi phí công sức tối ưu"], correct: 3, why: "Duyệt mọi bước làm mất giá trị tự động hóa; tối ưu rủi ro/chi phí. (Phần 1)" },
  { part: B, q: "Phương pháp RAG được dùng nhằm giải quyết vấn đề cốt lõi nào của mô hình ngôn ngữ?", opts: ["Giúp AI truy xuất & trả lời chính xác dựa trên dữ liệu nội bộ hoặc thông tin mới mà mô hình chưa được huấn luyện (khắc phục knowledge cutoff)", "Giúp AI cải thiện kỹ năng hành văn và diễn đạt mượt mà hơn", "Tăng chỉ số ngẫu nhiên (temperature) khi tạo văn bản", "Hạn chế lượng token tối đa mô hình được tiêu thụ"], correct: 0, why: "RAG khắc phục điểm yếu kiến thức: nạp dữ liệu nội bộ/mới, vượt knowledge cutoff. (Phần 2)" },
  { part: B, q: "Thứ tự thực thi chuẩn xác của một pipeline RAG là gì?", opts: ["Generate → Retrieve → Embed → Ingest", "Thu thập & chia nhỏ (Ingest & Chunk) → Nhúng & lưu trữ (Embed) → Truy xuất đoạn liên quan (Retrieve) → Tạo câu trả lời (Generate)", "Embed → Generate → Ingest → Retrieve", "Retrieve → Ingest → Generate → Embed"], correct: 1, why: "Pipeline: Ingest & Chunk → Embed → Retrieve → Generate. (Phần 2)" },
  { part: B, q: "Vai trò cốt lõi của tìm kiếm vector (vector search) trong RAG là gì?", opts: ["Nén kích thước dung lượng của tài liệu gốc cho nhỏ gọn lại", "Tối ưu và tăng tốc độ truyền tải dữ liệu qua mạng", "Tìm các đoạn tài liệu tương đồng về ý nghĩa với câu hỏi (thay vì chỉ khớp từ khóa chính xác)", "Tự động phát hiện và loại bỏ thông tin cá nhân (PII)"], correct: 2, why: "Vector search tìm theo tương đồng ý nghĩa, không phụ thuộc khớp từ khóa. (Phần 2)" },
  { part: B, q: "Khách hỏi \"Áo này mặc có bị nóng không?\" nhưng tài liệu ghi \"Độ thoáng khí tốt\". Vì sao vector search vẫn trích được phân đoạn này?", opts: ["Vì hệ thống phát hiện trùng khớp từ khóa chính xác giữa câu hỏi và tài liệu", "Vì AI tự động đoán và đưa ra kết quả ngẫu nhiên", "Vì trong văn bản tài liệu thực chất đã chứa sẵn từ khóa \"nóng\"", "Vì hai cụm từ mang ý nghĩa tương đồng nên vector của chúng nằm gần nhau trong không gian ngữ nghĩa"], correct: 3, why: "Hai khái niệm gần nghĩa → vector nằm gần nhau trong không gian ngữ nghĩa. (Phần 2)" },
  { part: B, q: "Khi hệ thống RAG trả lời thiếu chính xác hoặc sai lệch, việc đầu tiên cần kiểm tra là gì?", opts: ["Hệ thống có truy xuất đúng phân đoạn tài liệu chứa câu trả lời không (xác định truy hồi trúng hay trật)", "Tăng temperature của mô hình lên mức tối đa", "Ngay lập tức thay bằng một mô hình có kích thước lớn hơn", "Bỏ qua quy trình tự động và tự viết lại câu trả lời thủ công"], correct: 0, why: "Kiểm tra khâu truy xuất trước: có lấy đúng phân đoạn chứa câu trả lời không. (Phần 2)" },
  { part: B, q: "Yếu tố nào là nguyên nhân phổ biến khiến truy xuất tài liệu thất bại (truy hồi trật)?", opts: ["Người dùng đặt câu hỏi quá chi tiết và rõ ràng ngữ cảnh", "Phân đoạn (chunk) bị cắt quá lớn (loãng nghĩa) hoặc quá nhỏ (mất ngữ cảnh xung quanh)", "Kho tài liệu lưu trữ thông tin đầy đủ và cập nhật mới liên tục", "Hệ thống thiết lập truy xuất đúng số lượng phân đoạn cần thiết"], correct: 1, why: "Chunk quá to (loãng nghĩa) hoặc quá nhỏ (mất ngữ cảnh) gây truy hồi trật. (Phần 2)" },
  { part: B, q: "Dựa trên cây quyết định giải pháp AI (I1.1), RAG tập trung giải quyết nhóm vấn đề nào?", opts: ["Giải quyết điểm yếu kỹ năng (diễn đạt kém, viết sai định dạng)", "Giải quyết sự cố về tốc độ truyền tải mạng của hệ thống", "Giải quyết điểm yếu kiến thức (AI thiếu thông tin thực tế) — ưu tiên trước khi cân nhắc fine-tuning", "Tối ưu lượng điện năng tiêu thụ khi vận hành hệ thống AI"], correct: 2, why: "RAG giải quyết vấn đề kiến thức, ưu tiên trước fine-tuning. (Phần 2)" },
  { part: C, q: "Giao thức MCP (Model Context Protocol) được định nghĩa là gì?", opts: ["Một dòng mô hình trí tuệ nhân tạo thế hệ mới", "Một cấu trúc câu lệnh prompt đặc thù dành cho chuyên gia", "Một giải pháp phần mềm chuyên biệt dùng để lọc thông tin cá nhân (PII)", "Một tiêu chuẩn kết nối chung giúp AI truy cập công cụ hỗ trợ và nguồn dữ liệu doanh nghiệp một cách đồng bộ, nhất quán"], correct: 3, why: "MCP = tiêu chuẩn kết nối chung (\"ổ cắm đa năng\") cho AI truy cập công cụ & nguồn dữ liệu. (Phần 3)" },
  { part: C, q: "Khái niệm \"Kỹ năng (Skill)\" trong mở rộng năng lực cho AI được hiểu là gì?", opts: ["Một quy trình công việc đã được chuẩn hóa và đóng gói để AI dễ dàng tái sử dụng nhiều lần", "Một đường kết nối kỹ thuật trực tiếp tới cơ sở dữ liệu bên ngoài", "Một mô hình ngôn ngữ lớn chuyên dụng", "Một hệ thống cơ sở dữ liệu vector chuyên dụng"], correct: 0, why: "Skill = quy trình đóng gói, chuẩn hóa để tái sử dụng nhiều lần. (Phần 3)" },
  { part: C, q: "Điểm khác biệt cơ bản giữa \"Trình cắm (Plugin)\" và \"Kỹ năng (Skill)\" là gì?", opts: ["Plugin thực chất chỉ là một định dạng viết prompt nâng cao", "Plugin là cổng kết nối đến công cụ/nguồn dữ liệu ngoài để giúp AI thu thập thông tin hoặc thực hiện hành động trên hệ thống khác", "Plugin là phần mở rộng chỉ hoạt động ở chế độ ngoại tuyến (offline)", "Plugin được thiết kế để thay thế hoàn toàn vai trò của mô hình AI"], correct: 1, why: "Plugin = cổng kết nối kỹ thuật đến công cụ/nguồn ngoài. (Phần 3)" },
  { part: C, q: "Khi tích hợp skill và plugin cho AI, nguyên tắc nào cần tuân thủ nghiêm ngặt?", opts: ["Kích hoạt toàn bộ tất cả kỹ năng và trình cắm có sẵn để đảm bảo hiệu quả", "Sử dụng bất kỳ nguồn kết nối nào kể cả chưa được kiểm duyệt để đẩy nhanh tiến độ", "Lựa chọn công cụ phù hợp với từng bài toán cụ thể, chỉ dùng nguồn kết nối & công cụ đã được phê duyệt an toàn", "Tích hợp càng nhiều trình cắm vào hệ thống AI càng tốt"], correct: 2, why: "Chọn công cụ sát bài toán, chỉ dùng nguồn đã duyệt an toàn. (Phần 3)" },
  { part: C, q: "Khi kết nối AI với cơ sở dữ liệu thật của công ty qua MCP/plugin, cần tuân thủ kỷ luật an toàn nào?", opts: ["Bỏ qua chốt kiểm duyệt của con người (HITL) để quy trình chạy nhanh nhất", "Truyền trực tiếp toàn bộ dữ liệu cá nhân (PII) chưa xử lý vào các mô hình AI công cộng", "Hoàn toàn tin cậy AI và không cần kiểm soát output trước khi gửi khách hàng", "Thiết lập HITL trước hành động không thể hoàn tác, ẩn PII/bí mật kinh doanh, và đảm bảo câu trả lời có căn cứ xác thực (grounding)"], correct: 3, why: "Kết nối nguồn thật: HITL trước hành động không hoàn tác + ẩn PII/bí mật + grounding. (Phần 3, nối I1.2)" },
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

export function LessonI31() {
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
    <div data-screen-label="Tổng quan I3.1">
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
        <span style={{ color: "var(--fg-1)", fontWeight: 600 }}>Buổi I3.1 · Agentic Workflows &amp; RAG</span>
      </div>

      <div
        className="i31-overview-grid"
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
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Buổi I3.1 · L2</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--mint-deep)", background: "var(--mint-tint)", padding: "8px 13px", borderRadius: "999px" }}>✦ Buổi tích lũy · không Gate</span>
            <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", background: "var(--gold-tint)", padding: "8px 13px", borderRadius: "999px" }}>NL6</span>
          </div>
          <h1 style={{ font: "800 clamp(40px,5vw,64px)/1.03 var(--font-impact)", letterSpacing: "-.028em", margin: "22px 0 0", color: "var(--fg-1)" }}>
            Agentic Workflows &amp; <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>RAG</span>
          </h1>
          <p style={{ font: "400 21px/1.6 var(--font-body)", color: "var(--fg-2)", maxWidth: "640px", margin: "24px 0 0", textWrap: "pretty" }}>
            Một prompt đơn lẻ chỉ giải quyết được <b style={{ color: "var(--fg-1)" }}>một bước</b>. Sản phẩm thực tế cần <b style={{ color: "var(--fg-1)" }}>quy trình nhiều bước</b> (agentic workflow) và AI phải <b style={{ color: "var(--fg-1)" }}>tiếp cận được dữ liệu nội bộ</b> của YODY. Hai mảnh ghép cốt lõi: <em style={{ fontStyle: "italic" }}>Agentic Workflow</em> và <em style={{ fontStyle: "italic" }}>RAG</em> — cùng cách đặt <em style={{ fontStyle: "italic" }}>điểm kiểm soát con người (HITL)</em> đúng chỗ.
          </p>

          <div style={{ display: "flex", gap: "26px", marginTop: "30px", flexWrap: "wrap", font: "500 13px/1 var(--font-body)", color: "var(--fg-3)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{clockIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>120</b> phút live</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{bookIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>~48</b> phút đọc</span>
            <span style={{ opacity: ".35" }}>·</span>
            <span style={{ display: "flex", alignItems: "center", gap: "7px" }}>{listIcon}<b style={{ color: "var(--fg-1)", fontFamily: "var(--font-numeric)" }}>3</b> phần đọc + Final Exam</span>
          </div>

          <section style={{ marginTop: "52px", borderTop: "2px solid var(--fg-1)", paddingTop: "30px" }}>
            <h2 style={{ font: "700 26px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "0 0 14px" }}>Vì sao buổi này quan trọng</h2>
            <p style={{ font: "400 18px/1.75 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "660px", textWrap: "pretty" }}>
              Bạn đã biết viết prompt hiệu quả (I2.1). Nhưng một prompt đơn lẻ chỉ giải quyết một bước — sản phẩm thực tế cần <b style={{ color: "var(--fg-1)" }}>quy trình nhiều bước liên tiếp</b> và cần AI truy cập <b style={{ color: "var(--fg-1)" }}>dữ liệu nội bộ hoặc thông tin mới của YODY</b> (thứ mô hình không có sẵn — nhớ <em>knowledge cutoff</em> ở I1.1). Đây là nơi bạn học <b style={{ color: "var(--fg-1)" }}>Agentic Workflow + RAG</b> và cách đặt <b style={{ color: "var(--fg-1)" }}>điểm kiểm soát con người (HITL)</b> để tự động hóa không tự ý gây thiệt hại. NL6 chỉ cần đạt <b style={{ color: "var(--fg-1)" }}>mức L2 tối thiểu</b> để tốt nghiệp — mục tiêu là nắm chắc khái niệm và vận hành được quy trình mẫu.
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
              <span style={{ font: "600 13px/1 var(--font-mono)", color: "var(--fg-3)" }}>Đọc tuần tự · ~48 phút</span>
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
                <h3 style={{ font: "700 19px/1.25 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 6px" }}>NL6 chỉ cần đạt mức L2 tối thiểu để tốt nghiệp</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0, maxWidth: "560px" }}>Khác I2.3, buổi này <b style={{ color: "var(--fg-1)" }}>không phải buổi đánh giá Gate</b>. Bạn chỉ cần <b style={{ color: "var(--fg-1)" }}>nắm chắc khái niệm và vận hành được quy trình mẫu</b> (chưa yêu cầu tối ưu nâng cao như L3). Hoàn tất bằng Final Exam trước khi sang I3.2.</p>
              </div>
            </div>
          </section>

          <section style={{ marginTop: "16px", border: "1px dashed var(--iris)", borderRadius: "12px", overflow: "hidden", background: "#fff" }}>
            <div style={{ padding: "22px 28px", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--iris-tint)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>{checklistIcon}</div>
              <div style={{ flex: 1, minWidth: 220 }}>
                <h3 style={{ font: "700 20px/1.2 var(--font-impact)", color: "var(--fg-1)", margin: "0 0 5px" }}>Final Exam — 20 câu trắc nghiệm</h3>
                <p style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Làm trước khi sang buổi tiếp theo: đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b> → sẵn sàng sang <b style={{ color: "var(--fg-1)" }}>I3.2 — Build Deliverable &amp; Quality Control</b>.</p>
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
            <p style={{ font: "italic 400 14px/1.6 var(--font-body)", color: "var(--fg-3)", margin: "22px 0 0" }}>Multi-agent chỉ giới thiệu đối lập với single-agent — tối ưu multi-agent là L3+.</p>
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
            <p style={{ font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", margin: 0 }}>Sau <b style={{ color: "var(--fg-1)" }}>I2.3 (đã vượt Gate 2)</b> → buổi tích lũy <b style={{ color: "var(--fg-1)" }}>NL6 (không Gate)</b> → sang <b style={{ color: "var(--fg-1)" }}>I3.2 (Build Deliverable &amp; Quality Control)</b>.</p>
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
    { title: "Agent, Workflow & HITL", open: () => go("read", 0) },
    { title: "RAG, Embedding & Vector", open: () => go("read", 1) },
  ];
  const nextArr = [
    { title: "RAG, Embedding & Vector Search", kicker: "SAU →", color: "var(--gold-deep)", open: () => go("read", 1) },
    { title: "MCP, Tool & Skills", kicker: "SAU →", color: "var(--mint-deep)", open: () => go("read", 2) },
    { title: "Final Exam · 20 câu →", kicker: "HOÀN THÀNH", color: "var(--iris-deep)", open: () => go("exam") },
  ];
  const prev = prevArr[state.part];
  const next = nextArr[state.part];

  return (
    <div data-screen-label="Đọc bài" className="i31-read-layout" style={{ display: "flex", alignItems: "flex-start" }}>
      <aside className="i31-read-toc" style={{ width: "290px", flex: "none", borderRight: "1px solid var(--border)", padding: "28px 18px", position: "sticky", top: "73px", maxHeight: "calc(100vh - 73px)", overflow: "auto", background: "var(--bg-warm)" }}>
        <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "22px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.1
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
            <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ textDecoration: "none", color: "var(--fg-3)" }}>Buổi I3.1</a>
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
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--iris)", padding: "6px 12px 0 0" }}>M</span>ột prompt tốt (học ở I2.1) chỉ giải quyết được <b>một bước đơn lẻ</b>. Thực tế công việc gồm nhiều bước liên tiếp: đọc dữ liệu → phân tích → tạo kết quả → gửi báo cáo. Chat thủ công từng bước, bạn chỉ là "người vận hành AI bằng tay". <b>Builder thực thụ thiết kế cả quy trình tự động (workflow)</b> để hệ thống chạy nhất quán, dễ kiểm soát, tái sử dụng.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Agent / Agentic AI là gì</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--rose-deep)", borderRadius: "12px", background: "var(--rose-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--rose-deep)", marginBottom: "8px" }}>HỎI – ĐÁP MỘT LƯỢT</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Bạn hỏi → AI trả lời → kết thúc. Mọi bước tiếp theo bạn phải tự làm bằng tay.</div>
        </div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>TÁC NHÂN THÔNG MINH (AGENT)</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>AI thực hiện <b>chuỗi bước hướng mục tiêu</b>, tự <b>gọi công cụ</b> (tool use · I2.1) và tự quyết định bước tiếp theo trong phạm vi được giao.</div>
        </div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>
        <b style={{ color: "var(--gold-deep)" }}>L2 tập trung:</b> <b>Quy trình đơn tác nhân (single-agent flow)</b> — AI như một "trợ lý" chạy theo quy trình thiết kế sẵn với các checkpoint rõ ràng. Hệ thống <b>đa tác nhân (multi-agent)</b> là L3+: tốn chi phí, khó kiểm soát hơn, chỉ dùng khi thực sự cần.
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Nguyên tắc</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0, fontStyle: "italic" }}>Không dùng agent phức tạp cho việc mà một prompt tốt hoặc quy trình đơn giản đã giải quyết hiệu quả. Tránh phức tạp hóa vấn đề không cần thiết.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Khung xương mọi workflow: 4 ô bắt buộc</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>Mỗi workflow AI phải xác định rõ <b style={{ color: "var(--fg-1)" }}>4 yếu tố cốt lõi</b>. Thiếu bất kỳ yếu tố nào đều dẫn đến thiết kế lỗi:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "stretch", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {WF4.map((w, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ flex: 1, minWidth: 130, maxWidth: 160, border: `1px solid ${w.border}`, borderRadius: "11px", background: w.bg, padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ font: "700 10px/1.3 var(--font-mono)", color: "#fff", background: w.badge, padding: "5px 8px", borderRadius: "5px", alignSelf: "flex-start" }}>{w.n}</span>
                <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)" }}>{w.title}</div>
                <div style={{ font: "12px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{w.q}</div>
                <div style={{ font: "italic 12px/1.4 var(--font-body)", color: w.exColor, borderTop: "1px dashed var(--border)", paddingTop: "6px", marginTop: "auto" }}>{w.ex}</div>
              </div>
              {w.arrow && <span style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "20px" }}>→</span>}
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — Mọi workflow AI phải trả lời đủ 4 ô. Ví dụ giả lập tại YODY.</figcaption>
      </figure>
      <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ background: "var(--rose-tint)", padding: "15px 18px", borderRight: "1px solid var(--border)" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "8px" }}>✕ MƠ HỒ (không đo được)</div>
            <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>"AI phân tích phản hồi của khách hàng."</div>
          </div>
          <div style={{ background: "var(--mint-tint)", padding: "15px 18px" }}>
            <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--mint-deep)", marginBottom: "8px" }}>✓ CỤ THỂ (kiểm được)</div>
            <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-1)" }}>"AI <b>phân loại</b> từng phản hồi vào 1 trong 6 nhãn định sẵn, rồi <b>thống kê tần suất</b> mỗi nhãn."</div>
          </div>
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}><b style={{ color: "var(--fg-1)" }}>"AI làm gì" phải dùng động từ hành động cụ thể</b> — <i>gán nhãn, trích xuất, tóm tắt theo nhóm, xếp hạng, soạn thảo văn bản nháp</i> — để bạn có thể đối chiếu và kiểm tra độ chính xác của AI ngay lập tức.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Cowork Task Loop — khác gì chat thường</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Trên nền tảng tự động hóa công việc (như <b>Cowork</b>), AI hoạt động theo <b style={{ color: "var(--fg-1)" }}>vòng lặp nhiệm vụ (task loop)</b>:</p>
      <figure style={{ margin: "0 0 20px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {LOOP.map((l, i) => (
            <div key={i} style={{ display: "contents" }}>
              <span style={{ font: "600 13px/1.4 var(--font-body)", color: l.color, background: l.bg, border: `1px solid ${l.border}`, padding: "12px 14px", borderRadius: "9px", textAlign: "center", maxWidth: "160px" }}>{l.text}</span>
              {l.arrow && <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>}
            </div>
          ))}
          <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>↺</span>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Bạn định hình khung &amp; duyệt tại chốt, AI tự chạy chuỗi hành động.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>Vai trò của bạn dịch chuyển từ <b style={{ color: "var(--fg-1)" }}>"người gõ lệnh chat"</b> thành <b style={{ color: "var(--fg-1)" }}>"người thiết kế và giám sát quy trình"</b> — chỉ định hình khung và duyệt kết quả tại các chốt kiểm soát, thay vì can thiệp thủ công từng bước nhỏ.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · Human-in-the-loop (HITL) — hai "vị trí vàng"</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>HITL</b> là điểm chốt con người xem xét &amp; phê duyệt <i>trước khi</i> quy trình tự động tiếp tục. Thiết kế để <b style={{ color: "var(--fg-1)" }}>giảm rủi ro lớn nhất với chi phí công sức tối ưu</b> — đừng bắt duyệt mọi bước, vì sẽ mất giá trị của tự động hóa.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--fg-2)", background: "var(--bg-muted)", border: "1px solid var(--border)", padding: "11px 13px", borderRadius: "9px" }}>AI suy luận / tổng hợp số liệu</span>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            <span style={{ font: "700 12px/1.3 var(--font-brand)", color: "#fff", background: "var(--gold-deep)", padding: "11px 13px", borderRadius: "9px" }}>🛑 CHỐT A</span>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--fg-2)", background: "var(--bg-muted)", border: "1px solid var(--border)", padding: "11px 13px", borderRadius: "9px" }}>Soạn nội dung</span>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            <span style={{ font: "700 12px/1.3 var(--font-brand)", color: "#fff", background: "var(--rose-deep)", padding: "11px 13px", borderRadius: "9px" }}>🛑 CHỐT B</span>
            <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>
            <span style={{ font: "600 13px/1.4 var(--font-body)", color: "var(--fg-2)", background: "var(--bg-muted)", border: "1px solid var(--border)", padding: "11px 13px", borderRadius: "9px" }}>Gửi email / đăng nội dung</span>
          </div>
          <div style={{ display: "flex", gap: "14px", marginTop: "16px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200, border: "1px solid var(--gold-deep)", borderRadius: "10px", background: "var(--gold-tint)", padding: "13px 15px" }}>
              <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--gold-deep)", marginBottom: "5px" }}>CHỐT A · sau bước AI dễ sai</div>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Bước suy luận phức tạp / tự tổng hợp số liệu dễ sinh ảo tưởng (hallucination · I1.2) → người kiểm lại độ xác thực.</div>
            </div>
            <div style={{ flex: 1, minWidth: 200, border: "1px solid var(--rose-deep)", borderRadius: "10px", background: "var(--rose-tint)", padding: "13px 15px" }}>
              <div style={{ font: "700 11px/1 var(--font-mono)", color: "var(--rose-deep)", marginBottom: "5px" }}>CHỐT B · trước hành động không thể hoàn tác</div>
              <div style={{ font: "13px/1.55 var(--font-body)", color: "var(--fg-1)" }}>Gửi email hàng loạt, đăng mạng xã hội, ghi thẳng vào hệ thống — đã chạy là không rút lại được.</div>
            </div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Không duyệt mọi bước, chỉ chặn hai vị trí rủi ro lớn nhất.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Quy trình "AI tự soạn phản hồi khiếu nại &amp; gửi khách" — HITL bắt buộc <b>ngay trước bước gửi email</b>. Nhân viên CSKH đọc lại, chỉnh câu từ rồi mới bấm gửi. Bỏ chốt này để "chạy cho nhanh" là mầm mống sự cố dịch vụ nghiêm trọng trên quy mô lớn.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>5 · Workflow phục vụ người dùng cuối, không phục vụ AI</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Lỗi thường gặp: tối ưu để <i>AI chạy mượt nhất</i> nhưng quên <i>sản phẩm đầu ra tác động đến ai</i>. Luôn tự hỏi: <b style={{ color: "var(--fg-1)" }}>kết quả cuối cùng ảnh hưởng đến khách hàng / đồng nghiệp thế nào?</b> Quy trình chạy nhanh nhưng trải nghiệm tệ là thiết kế thất bại (tư duy Customer-Centric — sẽ sâu ở L3).</p>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--rose-deep)" }}>Ranh giới bảo mật (I1.2):</b> luôn ẩn PII trước khi gửi dữ liệu cho AI, tuyệt đối không chia sẻ bí mật kinh doanh lên công cụ AI công cộng.</div>

      <TldrDark items={[
        "<b>Agent/Agentic AI</b> thực hiện chuỗi bước hướng mục tiêu &amp; biết gọi công cụ, khác hỏi–đáp một lượt. L2 chỉ cần làm chủ <b>single-agent flow</b> từ mẫu có sẵn.",
        "Mọi workflow phải rõ <b>4 yếu tố</b>: Input → AI làm gì (động từ cụ thể) → Output đi đâu → Con người duyệt ở đâu.",
        "Đặt <b>HITL đúng vị trí vàng</b>: ngay sau bước AI dễ sai &amp; ngay trước hành động không thể hoàn tác. Thiết kế hướng người dùng cuối và bảo vệ PII.",
      ]} />

      <SelfCheck items={[
        "Trình bày điểm khác biệt giữa \"hỏi – đáp một lượt\" và \"quy trình tác nhân tự động\" qua một ví dụ cụ thể tại YODY.",
        "Viết lại yêu cầu chung chung \"AI phân tích đánh giá của khách hàng\" thành mô tả hành động cụ thể, đo lường được.",
        "Với quy trình \"AI tự soạn &amp; gửi email cảm ơn khách hàng\", bạn đặt chốt HITL ở bước nào? Vì sao?",
        "Thiết lập đầy đủ mô hình 4 ô cho một workflow AI mà bạn tự chọn.",
      ]} />
    </div>
  );
}

function Part2View() {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--gold-deep)", padding: "6px 12px 0 0" }}>L</span>LM chỉ biết thông tin tới thời điểm <b>knowledge cutoff</b> (I1.1) và không tự tra cứu bên ngoài. Vậy làm sao AI trả lời chính xác về <b>chính sách đổi trả</b>, <b>tồn kho thực tế</b> hay <b>tài liệu mới</b> của YODY? Hai cách sai phổ biến: (a) để AI tự suy luận → <b>bịa (hallucination)</b>; (b) nhồi cả tài liệu vào prompt → quá tải context, tốn token, <em>lost-in-the-middle</em>. Lời giải đúng là <b>RAG</b>.
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · RAG là gì — pipeline 4 bước</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}><b>RAG (Retrieval-Augmented Generation)</b>: trước khi trả lời, hệ thống tự <b style={{ color: "var(--fg-1)" }}>tìm &amp; trích đúng phân đoạn tài liệu liên quan</b>, đưa vào context để AI biên soạn câu trả lời <b>dựa trên tài liệu đó</b>.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "stretch", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {RAG_STEPS.map((s, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ flex: 1, minWidth: 130, maxWidth: 160, border: `1px solid ${s.border}`, borderRadius: "11px", background: s.bg, padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ font: "700 10px/1.3 var(--font-mono)", color: "#fff", background: s.badge, padding: "5px 8px", borderRadius: "5px", alignSelf: "flex-start" }}>{s.n}</span>
                <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)" }}>{s.title}</div>
                <div style={{ font: "12px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{s.desc}</div>
              </div>
              {s.arrow && <span style={{ alignSelf: "center", color: "var(--fg-3)", fontSize: "20px" }}>→</span>}
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — RAG: kéo đúng tài liệu liên quan vào context rồi mới trả lời.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--gold-tint)", borderLeft: "3px solid var(--gold)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "8px" }}>Ví dụ YODY · giả lập</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Khách hỏi <i>"áo bị lỗi vải thì có được đổi không, thời hạn bao lâu?"</i> → RAG truy đúng phân đoạn về lỗi vải trong <b>Chính sách đổi trả</b> → AI trả lời theo chính sách thật, thay vì bịa "24 giờ" hay "12 tháng".</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Embedding &amp; Vector Search — trái tim của "truy hồi"</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>Embedding</b> (I1.1) mã hóa văn bản thành vector số sao cho <i>nội dung tương đồng nghĩa nằm gần nhau</i>. <b>Vector search</b> số hóa câu hỏi thành vector rồi tìm các đoạn có vector gần nhất — tức tìm theo <b style={{ color: "var(--fg-1)" }}>sự tương đồng ý nghĩa</b>, không phụ thuộc khớp từ khóa chính xác.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1.5px solid var(--gold-deep)", borderRadius: "14px", background: "var(--gold-tint)", padding: "22px 26px" }}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ border: "1px solid var(--gold-deep)", borderRadius: "10px", background: "#fff", padding: "12px 15px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", maxWidth: "210px" }}>Câu hỏi: <b>"áo mặc có bị nóng không?"</b></div>
            <span style={{ font: "700 13px/1 var(--font-mono)", color: "var(--gold-deep)" }}>≈ gần nghĩa ≈</span>
            <div style={{ border: "1px solid var(--mint)", borderRadius: "10px", background: "#fff", padding: "12px 15px", font: "14px/1.5 var(--font-body)", color: "var(--fg-1)", maxWidth: "210px" }}>Tài liệu: <b>"chất liệu có độ thoáng khí cao"</b></div>
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 2 — Khớp từ khóa sẽ bỏ sót; vector search vẫn phát hiện vì hai khái niệm gần nghĩa.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 26px" }}>Chất lượng đầu ra của RAG phụ thuộc phần lớn vào việc bước truy xuất này <b style={{ color: "var(--fg-1)" }}>có lấy đúng phân đoạn cần thiết hay không</b>.</p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · Vì sao retrieval trúng hoặc trật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Bốn nguyên nhân phổ biến khiến <b style={{ color: "var(--fg-1)" }}>truy hồi trật</b> — giúp bạn chẩn đoán lỗi:</p>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "13px 15px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Nguyên nhân trật</div>
          <div style={{ background: "var(--rose-tint)", padding: "13px 15px", font: "700 12px/1.3 var(--font-brand)", color: "var(--rose-deep)", borderLeft: "1px solid var(--border)" }}>Biểu hiện</div>
          <div style={{ background: "var(--mint-tint)", padding: "13px 15px", font: "700 12px/1.3 var(--font-brand)", color: "var(--mint-deep)", borderLeft: "1px solid var(--border)" }}>Khắc phục</div>
          {RETRIEVAL.map((r, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "14px 15px", font: "600 13px/1.5 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", background: "#fff" }}>{r.k}</div>
              <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-2)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{r.sign}</div>
              <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{r.fix}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0" }}>
        <div style={{ font: "700 11px/1 var(--font-mono)", letterSpacing: ".14em", textTransform: "uppercase", color: "var(--iris-deep)", marginBottom: "8px" }}>Tư duy chẩn đoán của Builder</div>
        <p style={{ font: "16px/1.7 var(--font-body)", color: "var(--fg-1)", margin: 0 }}>Khi RAG trả lời sai/thiếu, câu hỏi đầu tiên: <b>"Hệ thống có truy xuất đúng phân đoạn chứa câu trả lời không?"</b> Nếu phân đoạn đúng còn không được đưa vào context → lỗi ở khâu <b>truy xuất</b> (chunk, câu hỏi, kho tài liệu), không phải năng lực ngôn ngữ của AI.</p>
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>4 · RAG trong bức tranh chọn cách tiếp cận</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Nhìn lại sơ đồ quyết định ở I1.1:</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "22px 24px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {APPROACH.map((a, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ flex: 1, minWidth: 150, maxWidth: 200, border: `1px solid ${a.border}`, borderRadius: "11px", background: a.bg, padding: "14px" }}>
                <div style={{ font: "700 11px/1.2 var(--font-mono)", color: a.color, marginBottom: "6px" }}>{a.order}</div>
                <div style={{ font: "700 14px/1.25 var(--font-brand)", color: "var(--fg-1)", marginBottom: "4px" }}>{a.title}</div>
                <div style={{ font: "12px/1.45 var(--font-body)", color: "var(--fg-2)" }}>{a.desc}</div>
              </div>
              {a.arrow && <span style={{ color: "var(--fg-3)", fontSize: "18px" }}>→</span>}
            </div>
          ))}
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 3 — Ưu tiên prompt → RAG khi cần thêm kiến thức → fine-tuning là giải pháp cuối.</figcaption>
      </figure>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 20px" }}>RAG giải quyết vấn đề <b style={{ color: "var(--fg-1)" }}>kiến thức</b> (AI thiếu thông tin), không giải quyết vấn đề <b>kỹ năng</b> (AI diễn đạt kém). Đây cũng là phương thuốc tốt nhất hạn chế <b>hallucination</b>: bắt AI trả lời dựa trên căn cứ tài liệu thật (grounding · I1.2).</p>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--rose-tint)", borderLeft: "3px solid var(--rose-deep)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--rose-deep)" }}>An toàn bảo mật:</b> kho tài liệu RAG có thể chứa dữ liệu kinh doanh nhạy cảm hoặc PII → phân quyền chặt, ẩn PII ngay từ nguồn. Guardrails chi tiết học ở <b>I5.2</b>.</div>

      <TldrDark items={[
        "<b>RAG</b> giúp AI trả lời chính xác dựa trên tài liệu nội bộ/thông tin mới bằng pipeline: Thu thập &amp; chia nhỏ → Nhúng → Truy xuất → Tạo câu trả lời.",
        "<b>Embedding &amp; Vector Search</b> tìm theo tương đồng ý nghĩa thay vì khớp từ khóa — trái tim của khâu truy xuất.",
        "Hiệu quả RAG phụ thuộc <b>truy hồi trúng/trật</b> (chunk, độ rõ câu hỏi, độ đầy đủ tài liệu, số đoạn top-k). RAG khắc phục thiếu kiến thức &amp; hạn chế ảo tưởng nhờ grounding.",
      ]} />

      <SelfCheck items={[
        "Vì sao không nên để AI tự suy luận trả lời câu hỏi về chính sách nội bộ YODY? RAG khắc phục thế nào?",
        "Trình bày ngắn gọn 4 bước cốt lõi của một pipeline RAG tiêu chuẩn.",
        "Khách hỏi \"áo mặc có bị nóng không\" nhưng tài liệu ghi \"độ thoáng khí cao\" — vì sao vector search vẫn lấy được?",
        "Khi RAG trả lời thiếu thông tin, bạn kiểm tra yếu tố nào đầu tiên để biết lỗi ở khâu truy xuất hay do AI?",
      ]} />
    </div>
  );
}

function Part3View({ go }: { go: (p: Page, part?: number) => void }) {
  return (
    <div>
      <p style={{ font: "400 19px/1.85 var(--font-body)", color: "var(--fg-1)", margin: "0 0 20px" }}>
        <span style={{ float: "left", font: "italic 900 74px/.72 var(--font-serif)", color: "var(--mint-deep)", padding: "6px 12px 0 0" }}>Đ</span>ể quy trình tự động (Phần 1) hoạt động hiệu quả, AI cần <b>kết nối với thế giới bên ngoài</b> nhằm thu thập dữ liệu hoặc thực thi hành động. Phần này giới thiệu các phương thức kết nối cốt lõi: <b>MCP</b>, công cụ (tools), kỹ năng (skills) và trình cắm (plugins).
      </p>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>1 · Từ Tool Use đến MCP</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Nhớ lại I2.1: <b>Tool Use / Function Calling</b> cho AI gọi hàm/công cụ ngoài để lấy thông tin thực tế (kiểm tồn kho, tra trạng thái đơn) thay vì tự đoán. Nhưng nếu mỗi hệ thống dùng một giao thức riêng, mọi thứ trở nên cực phức tạp và khó tái sử dụng.</p>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}><b>MCP (Model Context Protocol)</b> là <b style={{ color: "var(--fg-1)" }}>tiêu chuẩn kết nối chung</b> — hãy hình dung như một <b>"ổ cắm đa năng tiêu chuẩn"</b>: mọi công cụ &amp; nguồn dữ liệu cắm chung một chuẩn, AI dễ dàng gọi và dùng thống nhất.</p>
      <figure style={{ margin: "0 0 22px" }}>
        <div style={{ border: "1px solid var(--border)", borderRadius: "14px", background: "#fff", padding: "26px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
          <div style={{ font: "700 13px/1.3 var(--font-brand)", color: "#fff", background: "var(--iris)", padding: "14px 22px", borderRadius: "12px" }}>AI · Trợ lý</div>
          <div style={{ height: "14px", width: "2px", background: "var(--fg-3)" }}></div>
          <div style={{ font: "700 12px/1 var(--font-mono)", letterSpacing: ".16em", color: "#fff", background: "var(--mint-deep)", padding: "9px 18px", borderRadius: "999px" }}>◗ MCP · ổ cắm chuẩn ◖</div>
          <div style={{ height: "14px", width: "80%", borderTop: "2px solid var(--fg-3)", borderLeft: "2px solid var(--fg-3)", borderRight: "2px solid var(--fg-3)", borderRadius: "8px 8px 0 0", marginTop: "8px" }}></div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center", marginTop: "-2px" }}>
            {MCP_SOURCES.map((s, i) => (
              <div key={i} style={{ border: "1px solid var(--iris)", borderRadius: "10px", background: "var(--iris-tint)", padding: "12px 15px", font: "600 13px/1.3 var(--font-body)", color: "var(--iris-deep)", textAlign: "center", minWidth: "120px" }}>{s}</div>
            ))}
          </div>
        </div>
        <figcaption style={{ font: "italic 400 14px/1.5 var(--font-body)", color: "var(--fg-3)", marginTop: "10px", textAlign: "center" }}>Hình 1 — MCP = ổ cắm chuẩn để AI kết nối công cụ &amp; nguồn dữ liệu doanh nghiệp.</figcaption>
      </figure>
      <div style={{ margin: "0 0 26px", padding: "16px 20px", background: "var(--mint-tint)", borderLeft: "3px solid var(--mint)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}><b style={{ color: "var(--mint-deep)" }}>Vì sao Builder cần quan tâm:</b> MCP cho AI truy cập <b>hệ thống dữ liệu cốt lõi của YODY</b> (kho sản phẩm, đơn hàng, tài liệu nội bộ) theo cách chuẩn hóa &amp; tái sử dụng cao — nền tảng để dựng agentic workflow trong thực tế.</div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>2 · Skills &amp; Plugins — mở rộng năng lực đúng cách</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", margin: "0 0 22px" }}>
        <div style={{ padding: "20px 22px", border: "1px solid var(--gold-deep)", borderRadius: "12px", background: "var(--gold-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--gold-deep)", marginBottom: "8px" }}>🎁 KỸ NĂNG (SKILL)</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Quy trình xử lý công việc <b>đóng gói để tái sử dụng</b> (vd "phân loại review khách thành 6 nhóm chuẩn") → AI gọi lại &amp; làm nhất quán nhiều lần.</div>
        </div>
        <div style={{ padding: "20px 22px", border: "1px solid var(--iris)", borderRadius: "12px", background: "var(--iris-tint)" }}>
          <div style={{ font: "700 13px/1 var(--font-brand)", color: "var(--iris-deep)", marginBottom: "8px" }}>🔌 TRÌNH CẮM (PLUGIN)</div>
          <div style={{ font: "15px/1.65 var(--font-body)", color: "var(--fg-1)" }}>Cổng <b>kết nối kỹ thuật đến công cụ/nguồn ngoài</b> (database, dịch vụ bên thứ ba). Thường vận hành trên chuẩn như MCP.</div>
        </div>
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden", margin: "0 0 22px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr" }}>
          <div style={{ background: "var(--bg-ink)", padding: "13px 15px", font: "700 11px/1.3 var(--font-mono)", color: "#fff" }}>Phân biệt</div>
          <div style={{ background: "var(--gold-tint)", padding: "13px 15px", font: "700 12px/1.3 var(--font-brand)", color: "var(--gold-deep)", borderLeft: "1px solid var(--border)" }}>Kỹ năng (Skill)</div>
          <div style={{ background: "var(--iris-tint)", padding: "13px 15px", font: "700 12px/1.3 var(--font-brand)", color: "var(--iris-deep)", borderLeft: "1px solid var(--border)" }}>Trình cắm (Plugin)</div>
          {SKILL_PLUGIN.map((c, i) => (
            <div key={i} style={{ display: "contents" }}>
              <div style={{ padding: "14px 15px", font: "600 13px/1.5 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", background: "#fff" }}>{c.k}</div>
              <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{c.skill}</div>
              <div style={{ padding: "14px 15px", font: "13px/1.6 var(--font-body)", color: "var(--fg-1)", borderTop: "1px solid var(--border)", borderLeft: "1px solid var(--border)", background: "#fff" }}>{c.plugin}</div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ font: "400 16px/1.7 var(--font-body)", color: "var(--fg-2)", margin: "0 0 14px" }}><b style={{ color: "var(--fg-1)" }}>Hai nguyên tắc an toàn nghiêm ngặt:</b></p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 26px" }}>
        {SAFETY_RULES.map((r, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${r.border}`, borderRadius: "12px", background: r.bg, padding: "16px 18px" }}>
            <span style={{ font: "700 12px/1 var(--font-mono)", color: "#fff", background: r.badge, padding: "6px 10px", borderRadius: "6px", flex: "none" }}>{r.n}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: r.color }}>{r.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{r.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <h2 style={{ font: "700 27px/1.2 var(--font-impact)", letterSpacing: "-.012em", color: "var(--fg-1)", margin: "44px 0 16px" }}>3 · An toàn khi kết nối nguồn thật</h2>
      <p style={{ font: "400 18px/1.8 var(--font-body)", color: "var(--fg-2)", margin: "0 0 18px" }}>Nối AI với hệ thống thật qua MCP/Plugin làm rủi ro bảo mật tăng: AI có thể vô tình đọc thông tin nhạy cảm hoặc tự thực hiện hành động gây lỗi. Áp dụng nghiêm ngặt ba kỷ luật:</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "0 0 22px" }}>
        {SAFETY_3.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start", border: `1px solid ${s.border}`, borderRadius: "12px", background: s.bg, padding: "16px 18px" }}>
            <span style={{ fontSize: "22px", flex: "none", lineHeight: "1.2" }}>{s.icon}</span>
            <div>
              <b style={{ font: "700 15px/1.3 var(--font-brand)", color: s.color }}>{s.title}</b>
              <div style={{ font: "14px/1.6 var(--font-body)", color: "var(--fg-1)", marginTop: "3px" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ margin: "0 0 26px", padding: "18px 22px", background: "var(--iris-tint)", borderLeft: "3px solid var(--iris)", borderRadius: "0 10px 10px 0", font: "15px/1.7 var(--font-body)", color: "var(--fg-1)" }}>Guardrails &amp; chống prompt injection qua dữ liệu công cụ học kỹ ở <b>I5.2</b>. Ở I3.1 chỉ cần nhớ nguyên tắc cốt lõi: <b style={{ color: "var(--iris-deep)" }}>AI kết nối càng sâu, kiểm soát của con người càng phải chặt.</b></div>

      <TldrDark items={[
        "<b>MCP</b> là chuẩn kết nối chung (\"ổ cắm đa năng\") để AI truy cập công cụ &amp; nguồn dữ liệu doanh nghiệp một cách đồng bộ, tái sử dụng cao.",
        "<b>Skill</b> chuẩn hóa &amp; đóng gói CÁCH LÀM; <b>Plugin</b> mở rộng KẾT NỐI kỹ thuật ngoài — luôn chọn công cụ sát bài toán, chỉ dùng nguồn đã duyệt an toàn.",
        "Nguyên tắc vàng: kết nối càng sâu, kiểm soát càng chặt. Luôn kết hợp <b>HITL + Bảo vệ dữ liệu (PII &amp; bí mật kinh doanh) + Grounding</b>.",
      ]} />

      <SelfCheck items={[
        "Giải thích MCP cho đồng nghiệp không thuộc kỹ thuật bằng ẩn dụ \"ổ cắm điện đa năng tiêu chuẩn\".",
        "Phân biệt Skill và Plugin qua một ví dụ thực tiễn trong công việc tại YODY.",
        "Vì sao \"cứ kích hoạt tất cả kỹ năng &amp; trình cắm cho chắc\" lại là sai lầm nghiêm trọng?",
        "Khi nối trợ lý AI với hệ thống quản lý đơn hàng thật, bạn cần tuân thủ những kỷ luật an toàn nào?",
      ]} />

      <div style={{ margin: "30px 0 0", padding: "22px 26px", border: "1px solid var(--iris)", borderRadius: "14px", background: "var(--iris-tint)", display: "flex", gap: "18px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ font: "700 18px/1.3 var(--font-impact)", color: "var(--iris-deep)", marginBottom: "4px" }}>Đã nắm NL6 nền tảng 🎯</div>
          <div style={{ font: "15px/1.6 var(--font-body)", color: "var(--fg-2)" }}>Agentic workflow + RAG + kết nối. Giờ làm <b style={{ color: "var(--fg-1)" }}>Final Exam</b> (20 câu) trước khi sang I3.2 — Build Deliverable &amp; Quality Control.</div>
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
    ? { title: "Đạt ngưỡng Final Exam 🎉", msg: `Bạn đạt ${score}/20 → nắm chắc NL6 nền tảng, sẵn sàng sang I3.2 — Build Deliverable & Quality Control.`, color: "var(--mint-deep)", border: "var(--mint)", bg: "var(--mint-tint)" }
    : { title: "Chưa đạt ngưỡng", msg: `Cần ≥${PASS_SCORE}/20. Sai nhiều câu 1–8 → đọc lại Phần 1 (Agent/Workflow/HITL); 9–15 → Phần 2 (RAG); 16–20 → Phần 3 (MCP/Tool/Skills).`, color: "var(--rose-deep)", border: "var(--rose-deep)", bg: "var(--rose-tint)" };
  const cursor = state.submitted ? "default" : "pointer";

  return (
    <div data-screen-label="Final Exam" style={{ maxWidth: "820px", margin: "0 auto", padding: "52px 44px 96px" }}>
      <a href="#" onClick={(e) => { e.preventDefault(); go("overview"); }} style={{ display: "inline-flex", alignItems: "center", gap: "7px", font: "600 13px/1 var(--font-body)", color: "var(--fg-3)", textDecoration: "none", marginBottom: "20px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6" /></svg>Tổng quan buổi I3.1
      </a>
      <span style={{ display: "inline-block", font: "700 12px/1 var(--font-mono)", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--iris-deep)", background: "var(--iris-tint)", padding: "8px 13px", borderRadius: "999px" }}>Bài test · làm trước khi sang I3.2</span>
      <h1 style={{ font: "800 clamp(36px,4.6vw,56px)/1.03 var(--font-impact)", letterSpacing: "-.026em", margin: "20px 0 12px", color: "var(--fg-1)" }}>Final Exam — <span style={{ font: "italic 800 1em/1 var(--font-serif)", color: "var(--iris)" }}>I3.1</span></h1>
      <p style={{ font: "400 18px/1.6 var(--font-body)", color: "var(--fg-2)", margin: "0 0 28px", maxWidth: "600px" }}>20 câu trắc nghiệm, mỗi câu chọn một đáp án đúng nhất. Ngưỡng đạt <b style={{ color: "var(--fg-1)" }}>≥{PASS_SCORE}/20 ({PASS_PCT})</b>. Phủ: Agent/Workflow/HITL (1–8) · RAG/Embedding/Vector (9–15) · MCP/Tool/Skills (16–20). Chọn xong bấm "Nộp bài" để chấm và xem giải thích.</p>

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
