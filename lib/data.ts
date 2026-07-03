import type {
  AnchorMap,
  Badge,
  Block,
  Competency,
  LadderLevel,
  Lesson,
  Product,
  QuizQuestion,
  RoadmapItem,
  ScoreEntry,
  ScoreFinal,
  Tone,
} from "./types";

export const LEVEL_LABELS: string[] = [
  "Cần hỗ trợ",
  "Đạt nền tảng",
  "Đạt kỳ vọng",
  "Vượt kỳ vọng",
];

export const LEVEL_MULT: number[] = [0, 0.6, 0.85, 1];

export const LEVEL_DESC: string[] = [
  "Chưa thể hiện được, cần người khác hỗ trợ trực tiếp.",
  "Thể hiện ở mức cơ bản, còn thiếu sót cần bổ sung.",
  "Đáp ứng đầy đủ kỳ vọng của tiêu chí.",
  "Vượt trội, chủ động mở rộng và tạo giá trị thêm.",
];

export const LADDER: LadderLevel[] = [
  {
    lv: "L1",
    role: "Học viên",
    desc: "Thực hiện công việc theo hướng dẫn chi tiết từng bước. Cần kèm cặp sát sao.",
  },
  {
    lv: "L2",
    role: "Product Builder",
    desc: "Xử lý công việc có phạm vi rõ ràng, sản phẩm cần được review. Bán tự chủ.",
    grad: true,
  },
  {
    lv: "L3",
    role: "Product Engineer",
    desc: "Làm chủ từ đầu đến cuối một tính năng. Tự chủ hoàn toàn.",
  },
  {
    lv: "L4",
    role: "Senior",
    desc: "Định hình định hướng phát triển của dòng sản phẩm. Khả năng dẫn dắt.",
  },
  {
    lv: "L5",
    role: "Principal / Staff",
    desc: "Thiết lập tiêu chuẩn chung, hướng dẫn đội ngũ. Tạo đòn bẩy lớn.",
  },
];

export const COMPS: Competency[] = [
  {
    code: "NL1",
    group: "mindset",
    name: "Tư duy Hướng kết quả",
    en: "Outcome Thinking",
    lock: true,
    points: [
      "Tập trung vào giá trị (ROI)",
      "Ưu tiên thực tế",
      "Cam kết bàn giao & Ownership",
    ],
  },
  {
    code: "NL2",
    group: "mindset",
    name: "Tư duy Phản biện & Kiểm chứng",
    en: "Critical Thinking",
    lock: false,
    points: [
      "Tìm gốc rễ vấn đề (5 Whys)",
      "Đặt & Kiểm chứng giả thuyết",
      "Quyết định dựa trên dữ liệu",
    ],
  },
  {
    code: "NL3",
    group: "mindset",
    name: "Tư duy Thiết kế & Thấu cảm",
    en: "Design Thinking",
    lock: true,
    points: [
      "Khai thác Insight người dùng",
      "Học hỏi & Cải tiến liên tục",
      "Cộng tác & Tạo sự đồng thuận",
    ],
  },
  {
    code: "NL4",
    group: "eng",
    name: "Thấu hiểu Nền tảng AI",
    en: "AI Fundamentals & LLM Mechanics",
    lock: false,
    points: [
      "Cơ chế hoạt động của LLM",
      "Hiểu hành vi & Giới hạn",
      "Phương thức tư duy của AI (Zero/Few-shot, CoT)",
    ],
  },
  {
    code: "NL5",
    group: "eng",
    name: "Kỹ năng Prompt & Ứng dụng Công cụ",
    en: "Prompt Engineering & Tool Use",
    lock: true,
    points: [
      "Thiết kế Prompt cấu trúc (System Prompt)",
      "Tương tác Đa phương thức (Multimodal)",
      "Tích hợp công cụ (APIs, DB, MCP)",
      "Kỹ năng lập trình cơ bản (Git, debug, test)",
    ],
  },
  {
    code: "NL6",
    group: "eng",
    name: "Thiết kế Luồng Tự động hóa & Tri thức",
    en: "Agentic Workflows & RAG",
    lock: false,
    points: [
      "Thiết kế luồng Agentic (Single/Multi-Agent)",
      "RAG tri thức doanh nghiệp",
      "Kiểm soát vòng lặp (HITL/Self-correction)",
    ],
  },
  {
    code: "NL7",
    group: "eng",
    name: "Kiểm soát An toàn & Vận hành Giải pháp",
    en: "AI Guardrails & Operations",
    lock: true,
    points: [
      "Thiết lập Guardrails & PII Compliance",
      "Đánh giá (Eval set) & Tối ưu",
      "Đóng gói & Vận hành (Docker)",
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    roman: "I",
    name: "Hệ thống ATS",
    en: "Applicant Tracking System",
    prio: "CAO",
    stars: 3,
    desc: "Quản lý quy trình tuyển dụng ứng viên tại YODY. Quản lý pipeline từ đăng tin, nhận CV, phân loại đến gửi Offer/Reject.",
    stakeholders: ["Phòng Nhân sự (HR)", "Hiring Manager"],
    deliverables: [
      {
        feature: "Problem Discovery & User Flow",
        output:
          "Tài liệu Problem Brief, User Flow diagram, Wireframe",
        kpi: "HR Lead phê duyệt luồng nghiệp vụ",
        sign: ["HR Lead", "PO"],
      },
      {
        feature: "User Stories & DB Schema",
        output:
          "15 User Stories, DB Schema Diagram, Đề xuất Tech Stack",
        kpi: "Tech Lead phê duyệt cơ sở dữ liệu và kiến trúc",
        sign: ["Tech Lead", "PO"],
      },
      {
        feature: "Auth + Dashboard UI",
        output:
          "Trang đăng nhập bảo mật, APIs Doc, Dashboard skeleton",
        kpi:
          "Xác thực hoạt động ổn định, giao diện hoàn thiện đồng bộ",
        sign: ["Tech Lead"],
      },
      {
        feature: "CRUD Candidates + CV Upload",
        output:
          "Danh sách ứng viên, Form CRUD, Tải lên CV, Trạng thái pipeline",
        kpi: "Chuyển trạng thái mượt mà, lưu trữ CV an toàn",
        sign: ["Tech Lead", "QA"],
      },
      {
        feature: "Search, Filter, Notifications",
        output:
          "Bộ lọc nâng cao, tìm kiếm thông minh, Email cập nhật tự động",
        kpi: "Hiển thị kết quả tìm kiếm đúng dưới 3 giây",
        sign: ["HR Lead", "QA"],
      },
      {
        feature: "Analytics + Export",
        output:
          "Dashboard báo cáo, đo Time-to-hire, Trích xuất Excel/CSV",
        kpi: "Số liệu tổng hợp tự động, file Excel định dạng đẹp",
        sign: ["HR Lead"],
      },
    ],
  },
  {
    roman: "II",
    name: "Agent QC cho Website YODY",
    en: "Automated Quality Control Agent",
    prio: "CAO",
    stars: 3,
    desc: "Xây dựng một Agent AI tự động chạy định kỳ rà soát lỗi chất lượng (UI, broken links, responsive, load time, SEO basics) trên yody.vn và cảnh báo qua Slack/Email.",
    stakeholders: [
      "Phòng Đảm bảo chất lượng (QA Team)",
      "Đội ngũ Vận hành / Technical Team",
    ],
    deliverables: [
      {
        feature: "QC Checklist & Pain Point Analysis",
        output:
          "Tài liệu QC Checklist, phân tích lỗi nghiêm trọng, chọn 5–10 kịch bản tự động hóa",
        kpi: "QA Lead ký duyệt danh sách",
        sign: ["QA Lead"],
      },
      {
        feature: "Agent Framework + 5 Test Cases",
        output:
          "Mã nguồn khung Agent, Browser automation tool, 5 kịch bản đầu tiên",
        kpi:
          "Chạy tự động chuẩn xác, không cảnh báo sai (False positive)",
        sign: ["Tech Lead"],
      },
      {
        feature: "Mở rộng 10+ Test Cases + Slack",
        output:
          "Tích hợp > 10 kịch bản test, Báo cáo trực quan, Slack Webhook",
        kpi:
          "Độ phủ test ≥ 50% checklist, nhận cảnh báo tức thời khi có lỗi",
        sign: ["QA Lead", "Tech Lead"],
      },
      {
        feature: "Schedule + UAT + Training",
        output:
          "Cron job scheduler, tài liệu phân tích báo cáo, hướng dẫn vận hành QA",
        kpi:
          "Hệ thống chạy tự động 2 lần/tuần, QA team tự chủ vận hành",
        sign: ["QA Director"],
      },
    ],
  },
  {
    roman: "III",
    name: "Thiết kế & Thẩm định Quy trình",
    en: "Internal Compliance Verification Agent",
    prio: "CAO",
    stars: 3,
    desc: "Xây dựng Agent AI thông hiểu quy trình nội bộ YODY (phiếu điều chỉnh giá, duyệt ngân sách, nhập/xuất kho), tự động so sánh tính logic của dữ liệu đầu vào chống thất thoát và cảnh báo sai lệch quy trình.",
    stakeholders: [
      "Ban Pháp chế & Kiểm soát nội bộ",
      "Các Phòng ban nghiệp vụ",
    ],
    deliverables: [
      {
        feature: "Thu thập & Chuẩn hóa Template",
        output:
          "Bộ dữ liệu 3–5 biểu mẫu thực tế, luật thẩm định, rule mapping doc",
        kpi: "Compliance Lead xác thực tập luật đúng 100%",
        sign: ["Compliance Lead"],
      },
      {
        feature: "Build Agent đọc Template #1",
        output:
          "Mã nguồn Agent đọc hiểu biểu mẫu đầu tiên, chạy thử trên 20 hồ sơ mẫu",
        kpi:
          "Nhận dạng chính xác lỗi sai sót > 80% trên 20 tập dữ liệu",
        sign: ["Tech Lead"],
      },
      {
        feature: "Build Agent #2, #3 + Alert",
        output:
          "Agent cho biểu mẫu 2 và 3, workflow diagrams, Email alert",
        kpi:
          "Kiểm soát đồng thời 3 loại biểu mẫu, gửi cảnh báo đúng thẩm quyền dưới 2 phút",
        sign: ["Compliance Lead"],
      },
      {
        feature: "Dashboard + Integration + UAT",
        output:
          "Bảng thống kê kết quả thẩm định, mã nguồn integration test, tài liệu",
        kpi:
          "UAT thành công, chuyên viên kiểm soát nội bộ dùng thuần thục",
        sign: ["Compliance Director"],
      },
    ],
  },
  {
    roman: "IV",
    name: "Agent Quản lý Công việc & Báo cáo",
    en: "Personal Productivity and Reporting Agent",
    prio: "TRUNG BÌNH",
    stars: 2,
    desc: "Agent AI đắc lực hỗ trợ từng cá nhân quản lý công việc, nhắc nhở deadline và tự động tổng hợp báo cáo công tác tuần/tháng qua API của nền tảng quản lý dự án YODY.",
    stakeholders: ["Cá nhân Intern", "Quản lý trực tiếp (Manager)"],
    deliverables: [
      {
        feature: "Study API & Define Metrics",
        output:
          "Tài liệu tích hợp APIs, định nghĩa chỉ số báo cáo, Wireframe báo cáo",
        kpi:
          "Product Owner phê duyệt bộ chỉ số và cấu trúc báo cáo",
        sign: ["PO"],
      },
      {
        feature: "Build Agent Pull Data + Metrics",
        output:
          "Mã nguồn kết nối lấy dữ liệu, bộ xử lý tính số liệu, mẫu báo cáo text",
        kpi: "Lấy đúng và đủ dữ liệu, thuật toán tính KPI chuẩn xác",
        sign: ["Tech Lead"],
      },
      {
        feature: "HTML Report + Charts + Schedule",
        output:
          "Giao diện báo cáo HTML, biểu đồ (Chart.js), cấu hình Scheduler",
        kpi:
          "Biểu đồ trực quan trên nền HTML, bộ lên lịch chạy ổn định",
        sign: ["PO"],
      },
      {
        feature: "Email + Filter + Dashboard + UAT",
        output:
          "Đấu nối Email service, bộ lọc báo cáo, Mini Dashboard, tập huấn",
        kpi:
          "Nhận báo cáo tổng kết tức thì qua email khi gửi yêu cầu on-demand",
        sign: ["HOD", "PO"],
      },
    ],
  },
];

export const SC_ENTRY: ScoreEntry[] = [
  {
    id: 1,
    max: 15,
    name: "Hiểu vai trò và đầu ra chương trình",
    kpi: "Nêu rõ prototype, phản hồi người dùng, acceptance criteria và trách nhiệm.",
  },
  {
    id: 2,
    max: 15,
    name: "Hiểu và cấu trúc vấn đề",
    kpi: "Cấu trúc rõ người dùng, vấn đề, dữ kiện và giả định cần kiểm chứng.",
  },
  {
    id: 3,
    max: 15,
    name: "Tư duy prototype và thử nghiệm",
    kpi: "Đề xuất prototype vừa đủ, tiêu chí nghiệm thu và cách lấy phản hồi.",
  },
  {
    id: 4,
    max: 20,
    name: "Sử dụng AI có trách nhiệm",
    kpi: "Mô tả cách cung cấp ngữ cảnh, kiểm thử đầu ra và tránh dữ liệu nhạy cảm.",
  },
  {
    id: 5,
    max: 15,
    name: "Chủ động học và cam kết",
    kpi: "Có ví dụ cụ thể về tự học, quản lý cam kết và xin hỗ trợ đúng lúc.",
  },
  {
    id: 6,
    max: 20,
    name: "Hợp tác và tin cậy",
    kpi: "Lắng nghe, làm rõ, phản hồi trung thực và thống nhất bước tiếp theo.",
  },
];

export const SC_FINAL: ScoreFinal[] = [
  {
    id: 1,
    seg: 0,
    max: 10,
    name: "Hiểu vấn đề cần giải quyết",
    kpi: "Xác định đúng người dùng, bài toán và giá trị kỳ vọng.",
  },
  {
    id: 2,
    seg: 0,
    max: 15,
    name: "Đạt acceptance criteria",
    kpi: "Prototype đáp ứng các tiêu chí nghiệm thu đã thống nhất.",
  },
  {
    id: 3,
    seg: 0,
    max: 10,
    name: "Feedback và cải tiến",
    kpi: "Có vòng phản hồi và bằng chứng cải tiến từ phản hồi đó.",
  },
  {
    id: 4,
    seg: 0,
    max: 10,
    name: "Demo, tài liệu và bàn giao",
    kpi: "Demo được, tài liệu đủ để người khác tiếp nhận và vận hành.",
  },
  {
    id: 5,
    seg: 1,
    max: 8,
    name: "Hiểu người dùng và bài toán",
    kpi: "Thể hiện insight người dùng và khung hóa vấn đề rõ ràng.",
  },
  {
    id: 6,
    seg: 1,
    max: 8,
    name: "Tư duy sản phẩm và thử nghiệm",
    kpi: "Ưu tiên đúng, thử nghiệm có mục tiêu và học từ kết quả.",
  },
  {
    id: 7,
    seg: 1,
    max: 7,
    name: "Thực thi cùng AI",
    kpi: "Sử dụng AI hiệu quả, kiểm thử đầu ra và tích hợp công cụ.",
    nl: "NL5",
  },
  {
    id: 8,
    seg: 1,
    max: 6,
    name: "Học hỏi và ownership",
    kpi: "Chủ động học, cam kết bàn giao và chịu trách nhiệm kết quả.",
    nl: "NL1",
  },
  {
    id: 9,
    seg: 1,
    max: 6,
    name: "Hợp tác và tin cậy",
    kpi: "Cộng tác, tạo đồng thuận và giao tiếp trung thực.",
    nl: "NL3",
  },
  {
    id: 10,
    seg: 2,
    max: 8,
    name: "Journal và bằng chứng",
    kpi:
      "Ghi nhật ký làm việc và lưu bằng chứng trung thực, an toàn dữ liệu.",
    nl: "NL7",
  },
  {
    id: 11,
    seg: 2,
    max: 6,
    name: "Giao tiếp và blocker",
    kpi: "Nêu blocker kịp thời và giao tiếp tiến độ minh bạch.",
  },
  {
    id: 12,
    seg: 2,
    max: 6,
    name: "Tiếp nhận feedback và tự phản tư",
    kpi: "Đón nhận phản hồi và tự phản tư để cải thiện.",
  },
];

export const FINAL_SEGS: string[] = [
  "Phân đoạn 01 · Kết quả prototype (45đ)",
  "Phân đoạn 02 · Năng lực cốt lõi (35đ)",
  "Phân đoạn 03 · Quá trình và bằng chứng (20đ)",
];

export const GATE_TEXT: string[] = [
  "Có một prototype truy cập hoặc demo được.",
  "Acceptance criteria đã thống nhất và có bằng chứng đạt.",
  "Có tối thiểu hai vòng feedback hoặc một stakeholder xác nhận.",
  "Bằng chứng trung thực và dữ liệu sử dụng an toàn (PII compliance).",
  "Đạt Level 2 trở lên ở các năng lực cốt lõi (NL1, NL3, NL5, NL7).",
];

export const ROADMAP: RoadmapItem[] = [
  {
    code: "GĐ1",
    meta: "Giai đoạn 1 · Tuần 1–4 · Mục tiêu L1",
    title: "Nền tảng AI & Tư duy Outcome",
    sessions: ["I1.1", "I1.2", "I2.1", "I2.2"],
    gateLabel: "⛳ Gate 1 · Tuần 4 — Nhập môn & Nền tảng (L1 → L2 Foundation)",
    gate:
      "Viết 1 trang: một feature có AI — outcome gì, đo bằng metric nào, giới hạn AI nào cần biết, dữ liệu nào không được dùng (tuân thủ PII).",
    tone: "mint",
  },
  {
    code: "GĐ2",
    meta: "Giai đoạn 2 · Tuần 5–8 · Mục tiêu L1 → L2",
    title: "Prompt & Tư duy Phân tích",
    sessions: ["I2.3", "I3.1", "I3.2", "I3.3"],
    gateLabel: "⛳ Gate 2 · Tuần 8 — Prompt & Tư duy Phân tích (L2 Practice)",
    gate:
      "Spec draft + bản phân tích nguyên nhân gốc rễ (5 Whys) và giả thuyết kiểm chứng được — Trainer duyệt.",
    tone: "iris",
  },
  {
    code: "GĐ3",
    meta: "Giai đoạn 3 · Tuần 9–11 · Mục tiêu L2",
    title: "Workflow & Độc lập Phát triển",
    sessions: ["I4.1", "I4.2", "I4.3"],
    gateLabel: "⛳ Gate 3 · Tuần 11 — Workflow & Tự chủ (L2 Autonomy)",
    gate:
      "Deliverable v2 + sơ đồ workflow chạy được + giải thích điểm HITL + code review pass. Stretch: case iterate ≥ 2 vòng với bằng chứng feedback thật + metric trước/sau (cổng tốt nghiệp sớm).",
    tone: "iris",
  },
  {
    code: "GĐ4",
    meta: "Giai đoạn 4 · Tuần 12–14 · Tốt nghiệp L2 & Stretch L3",
    title: "Capstone Project & Vận hành Thực tế",
    sessions: ["I5.1", "I5.2", "I5.3"],
    gateLabel: "⛳ Cổng tốt nghiệp — Gate L2 Graduation",
    gate:
      "Sản phẩm Capstone chạy được + tài liệu kiến trúc + slide bảo vệ (outcome, rủi ro, trade-off), bảo vệ trước Hội đồng Product Builder.",
    tone: "gold",
    grad: true,
  },
];

export const ANCHORS: AnchorMap = {
  NL1: [
    "Phân biệt output vs outcome trên lý thuyết; hiểu tính năng mình xây phục vụ mục tiêu nào khi được hướng dẫn; hoàn thành đầu việc trong backlog.",
    "Tự xác định metric cho công việc được giao; ưu tiên đầu việc trong phạm vi feature theo impact khi có hướng dẫn; chủ động cam kết deadline, báo rủi ro sớm và chịu trách nhiệm đến cùng (ownership là trọng tâm xét tốt nghiệp).",
    "Tự xây outcome metric end-to-end cho một tính năng; tinh giảm scope để đạt hiệu quả cao nhất với nguồn lực tối thiểu; đàm phán scope-timeline trade-off.",
    "Thiết kế hệ đo lường cho cả dòng sản phẩm; ưu tiên roadmap theo ROI giữa các tính năng; từ chối đầu ra không tạo giá trị.",
    "Thiết lập chuẩn outcome thinking toàn tổ chức; đào tạo đội ngũ phân biệt value metrics vs vanity metrics.",
  ],
  NL2: [
    "Đặt câu hỏi \"tại sao\" ở mức cơ bản; nhận biết giả định nhưng chưa tự kiểm chứng; đọc và dùng được số liệu có sẵn.",
    "Tìm nguyên nhân gốc rễ bằng khung có sẵn (5 Whys); phát biểu giả thuyết kiểm chứng được; ra quyết định phạm vi nhỏ dựa trên dữ liệu (phân tích sâu là yêu cầu của L3).",
    "Tự phân tích đa chiều tìm gốc rễ trước khi thiết kế giải pháp; thiết kế MVP/thử nghiệm chi phí tối ưu; chọn giải pháp theo evidence và tự nhận diện bias.",
    "Xây khung phân tích cho bài toán phức tạp/cross-domain; thiết kế A/B, phân tích cohort quy mô lớn; phản biện chiến lược bằng số liệu thuyết phục.",
    "Xây văn hóa hypothesis-driven cho tổ chức; thiết lập evidence bar trước khi phê duyệt đầu tư lớn.",
  ],
  NL3: [
    "Phân biệt \"điều người dùng nói muốn\" và \"nhu cầu thực\"; lắng nghe và tiếp nhận feedback; truyền đạt rõ ràng trong nhóm nhỏ.",
    "Tham gia phỏng vấn/quan sát người dùng dưới hướng dẫn; thực hiện một chu kỳ iterate theo feedback; chủ động đặt câu hỏi đúng lúc, phối hợp nghiệp vụ–kỹ thuật, không im lặng khi bế tắc (cộng tác tích cực là trọng tâm bắt buộc).",
    "Chủ động khai thác insight tìm pain point cốt lõi; xây feedback loop fail-fast; làm cầu nối nghiệp vụ–kỹ thuật để đạt đồng thuận.",
    "Định hình chiến lược nghiên cứu người dùng cho dòng sản phẩm; thiết lập research ops; điều phối đồng thuận giữa stakeholder xung đột.",
    "Xây năng lực user-centricity toàn tổ chức; đào tạo và dẫn dắt đội ngũ khai thác insight đắt giá.",
  ],
  NL4: [
    "Nắm khái niệm nền tảng (token, context window, temperature, knowledge cutoff) ở mức định nghĩa; nhận diện hallucination khi được chỉ; hiểu zero-shot & few-shot cơ bản.",
    "Giải thích tác động của temperature/context window và tự điều chỉnh theo nhiệm vụ; chủ động kiểm chứng thông tin dễ hallucinate; chọn zero-shot/few-shot/CoT cho tác vụ quen thuộc.",
    "Tự cân đối latency/cost/accuracy khi chọn model & cấu hình; xử lý bias/hallucination ở cấp hệ thống; thiết kế prompting strategy cho bài toán mới.",
    "Thiết lập guideline chọn model & cấu hình cho dòng sản phẩm; đánh giá và quyết định adoption model AI mới.",
    "Thiết lập chuẩn & giới hạn dùng LLM toàn doanh nghiệp; định hình kiến trúc mô hình AI dài hạn.",
  ],
  NL5: [
    "Viết prompt cơ bản từ mẫu; chạy thử tool use/function calling đơn giản; xử lý input văn bản ở mức cơ bản.",
    "Thiết kế system prompt có cấu trúc (vai trò, định dạng, ràng buộc) cho kết quả ổn định; kết hợp input đa phương thức cơ bản (text+image); cấu hình & tích hợp một tool/API/MCP theo hướng dẫn; thành thạo Git cơ bản, đọc hiểu & debug mã do AI sinh, phát hiện lỗi AI để tiếp quản sửa (bắt buộc để tốt nghiệp).",
    "Thiết kế prompt + tool chain end-to-end cho một tính năng; tích hợp nhiều tool/DB/MCP & xử lý lỗi gọi tool; xây multimodal pipeline; viết unit test cơ bản.",
    "Chuẩn hóa prompt patterns & quy chuẩn tích hợp cho dòng sản phẩm; thiết kế tool/MCP tái sử dụng; tối ưu độ tin cậy tool calling ở quy mô lớn.",
    "Ban hành chuẩn sử dụng & định hình thư viện prompt/tool dùng chung toàn doanh nghiệp.",
  ],
  NL6: [
    "Hiểu định nghĩa & sơ đồ Agent, RAG, HITL; vận hành được quy trình mẫu có sẵn.",
    "Thiết lập single-agent flow từ mẫu; triển khai RAG cơ bản (nạp tài liệu, truy hồi); đặt HITL checkpoint khi được hướng dẫn (yêu cầu tối thiểu để nắm khái niệm, không áp lực nâng điểm tốt nghiệp).",
    "Tự thiết kế agentic (kể cả multi-agent đơn giản); tối ưu RAG bằng chunking & retrieval; thiết lập self-correction kết hợp HITL có chủ đích.",
    "Định hình kiến trúc agentic/RAG cho dòng sản phẩm; quyết định single vs multi-agent; tối ưu truy hồi quy mô lớn.",
    "Thiết lập chuẩn mực & dẫn dắt định hướng kiến trúc hệ thống Agent toàn tổ chức.",
  ],
  NL7: [
    "Hiểu định nghĩa guardrail, PII, eval, Docker; nhận diện rủi ro rò rỉ PII / prompt injection khi được chỉ trực tiếp.",
    "Áp dụng guardrails cơ bản & tuân thủ nghiêm ngặt quy định PII trong phạm vi công việc (chuẩn bắt buộc theo Data Governance của YODY); dùng eval set có sẵn đo accuracy; đóng gói ứng dụng đơn giản bằng Docker theo hướng dẫn.",
    "Tự thiết kế guardrail chống prompt injection; xây eval set riêng; theo dõi token cost & latency; triển khai vận hành độc lập end-to-end.",
    "Định hình chuẩn bảo mật & quy trình eval cho dòng sản phẩm; thiết lập observability & cost governance quy mô lớn.",
    "Thiết lập toàn bộ chuẩn an toàn & vận hành cho doanh nghiệp; định hướng compliance gắn mục tiêu lớn của YODY.",
  ],
};

export const BADGES: Badge[] = [
  {
    code: "L1",
    label: "L1",
    title: "Huy hiệu L1 Aware",
    en: "Aware · Nền tảng AI",
    tone: "mint",
    criteria:
      "Cấp khi hoàn thành I1.1, I1.2 và nộp Diligence Statement.",
  },
  {
    code: "L2",
    label: "L2",
    title: "Huy hiệu L2 Operator",
    en: "Operator · Prompt & Evaluate",
    tone: "iris",
    criteria:
      "Cấp khi vượt Gate L1 → L2 (nộp Deliverable I1.2 + Trainer duyệt).",
  },
  {
    code: "L3",
    label: "L3",
    title: "Huy hiệu L3 Builder",
    en: "Builder · Workflow & Deliverable",
    tone: "irisDeep",
    criteria:
      "Cấp khi vượt Gate L2 → L3 (nộp Deliverable I2.3 + Trainer/Lead duyệt).",
  },
  {
    code: "L4",
    label: "L4",
    title: "Huy hiệu L4 Integrator",
    en: "Integrator · Tích hợp & Vận hành",
    tone: "brand",
    criteria:
      "Cấp khi vượt Gate L3 → L4 (trình bày workflow demo I3.3 + user evidence + Mentor duyệt).",
  },
  {
    code: "L5",
    label: "L5 · TỐT NGHIỆP",
    title: "Huy hiệu L5 Architect",
    en: "Architect · Ship & Capstone",
    tone: "gold",
    criteria:
      "Cấp khi vượt Gate tốt nghiệp L5 (bảo vệ Capstone I5.3 trước Hội đồng).",
  },
];

// ── Lesson block helpers (ported verbatim from x-dc; behavior preserved) ──
export const P = (x: string): Block => ({ t: "p", x });
const H = (x: string): Block => ({ t: "h", x });
const U = (...items: string[]): Block => ({ t: "ul", items });
const Q = (x: string): Block => ({ t: "quote", x });
const C = (x: string): Block => ({ t: "code", x });
export const q = (question: string, opts: string[], a: number): QuizQuestion => ({
  q: question,
  opts,
  a,
});

function L(
  id: string,
  lv: string,
  title: string,
  sub: string,
  read: string,
  blocks: Block[],
  tldr: string[],
  quiz: QuizQuestion[],
): Lesson {
  return { id, lv, title, sub, read, blocks, tldr, quiz };
}

export const LESSONS: Lesson[] = [
  L(
    "I1.1",
    "GĐ1",
    "AI Fundamentals & LLM Mechanics",
    "Nền tảng cách một mô hình ngôn ngữ lớn (LLM) hoạt động và vì sao nó không phải cỗ máy tra cứu.",
    "8 phút",
    [
      P("Buổi này xây nền tảng tư duy: LLM không \"biết\" sự thật mà dự đoán token tiếp theo dựa trên xác suất. Hiểu điều này giúp bạn dùng AI đúng cách và không tin mù quáng vào đầu ra."),
      H("LLM dự đoán token, không tra cứu"),
      P("Mô hình sinh văn bản bằng cách chọn token có xác suất cao nhất dựa trên ngữ cảnh trước đó. Nó không có cơ sở dữ liệu sự thật cố định."),
      U(
        "Kết quả phụ thuộc mạnh vào ngữ cảnh (context) bạn cung cấp",
        "Cùng một câu hỏi có thể cho câu trả lời khác nhau",
        "Mô hình có thể \"bịa\" (hallucination) một cách tự tin",
      ),
      Q("AI là cộng sự tư duy, không phải nguồn chân lý — luôn kiểm chứng đầu ra quan trọng."),
      H("Vì sao Product Builder cần hiểu điều này"),
      P("Khi thiết kế giải pháp, bạn phải giả định đầu ra có thể sai và thiết kế bước kiểm chứng ngay từ đầu."),
      U(
        "Xác định đâu là tác vụ AI làm tốt (tóm tắt, phân loại, sinh nháp)",
        "Xác định đâu là tác vụ rủi ro (số liệu, quyết định pháp lý)",
      ),
    ],
    [
      "LLM dự đoán token tiếp theo theo xác suất, không tra cứu sự thật.",
      "Context bạn cấp quyết định phần lớn chất lượng đầu ra.",
      "Hallucination là bản chất, không phải lỗi hiếm gặp.",
      "AI mạnh ở tóm tắt/phân loại/sinh nháp, yếu ở số liệu chính xác.",
      "Luôn thiết kế bước kiểm chứng cho đầu ra quan trọng.",
    ],
    [
      q(
        "LLM sinh văn bản chủ yếu bằng cách nào?",
        [
          "Tra cứu một cơ sở dữ liệu sự thật",
          "Dự đoán token tiếp theo theo xác suất",
          "Sao chép nguyên văn từ Internet",
          "Hỏi một con người",
        ],
        1,
      ),
      q(
        "\"Hallucination\" nghĩa là gì?",
        [
          "Mô hình từ chối trả lời",
          "Mô hình bịa thông tin sai một cách tự tin",
          "Mô hình chạy chậm",
          "Mô hình bị lỗi mạng",
        ],
        1,
      ),
      q(
        "Tác vụ nào AI thường làm KÉM tin cậy nhất?",
        [
          "Tóm tắt văn bản",
          "Sinh bản nháp",
          "Tính toán số liệu chính xác tuyệt đối",
          "Phân loại cảm xúc",
        ],
        2,
      ),
    ],
  ),
  L(
    "I1.2",
    "GĐ1",
    "Outcome Thinking & Tuân thủ PII",
    "Phân biệt output vs outcome, xác định ROI & metric đo lường; và tuân thủ bảo vệ dữ liệu cá nhân (PII) theo Luật 91/2025/QH15.",
    "9 phút",
    [
      P("Buổi này ghép hai nền tảng: tư duy hướng kết quả (đo giá trị thật, không chỉ đếm tính năng) và ranh giới tuân thủ dữ liệu cá nhân (PII) — điều kiện bắt buộc khi làm việc với AI tại YODY."),
      H("Output vs Outcome"),
      P("Output là thứ bạn tạo ra (một tính năng, một báo cáo); outcome là thay đổi thực tế nó mang lại cho kinh doanh. Product Builder cam kết với outcome."),
      U(
        "Gắn mỗi feature với một outcome và một metric đo được",
        "Ưu tiên việc theo mức tác động (impact) với nguồn lực tối giản",
        "Cam kết deadline, báo rủi ro sớm và chịu trách nhiệm đến cùng",
      ),
      Q("Hoàn thành tính năng chưa phải thành công — thay đổi được chỉ số kết quả mới là."),
      H("Tuân thủ dữ liệu cá nhân (PII)"),
      P("Trước khi đưa dữ liệu cho AI, phân loại và ẩn danh thông tin nhạy cảm theo quy tắc PII của YODY (Luật 91/2025/QH15)."),
      U(
        "Không dán dữ liệu khách hàng, lương, hay bí mật kinh doanh vào công cụ AI công cộng",
        "Ẩn danh hoá dữ liệu cá nhân trước khi xử lý",
        "Ghi lại nguồn dữ liệu để truy vết",
      ),
    ],
    [
      "Outcome (giá trị thật) quan trọng hơn output (số tính năng).",
      "Mỗi feature cần gắn với một metric đo được.",
      "Ưu tiên theo impact, cam kết deadline và ownership.",
      "Không đưa PII/bí mật kinh doanh vào công cụ AI công cộng.",
      "Ẩn danh & truy vết dữ liệu là yêu cầu tuân thủ (Luật 91/2025/QH15).",
    ],
    [
      q(
        "Đâu là \"outcome\" chứ không phải \"output\"?",
        [
          "Số tính năng đã ship",
          "Thời gian tuyển dụng giảm 20%",
          "Số dòng code viết ra",
          "Số cuộc họp",
        ],
        1,
      ),
      q(
        "PII là gì?",
        ["Chỉ số hiệu suất", "Thông tin định danh cá nhân", "Một loại prompt", "Giao thức mạng"],
        1,
      ),
      q(
        "Việc nào an toàn khi dùng AI công cộng?",
        [
          "Dán bảng lương nhân viên",
          "Dán số CCCD khách hàng",
          "Xử lý dữ liệu đã ẩn danh",
          "Dán hợp đồng bí mật",
        ],
        2,
      ),
    ],
  ),
  L(
    "I2.1",
    "GĐ1",
    "Prompt Engineering & Tool Use",
    "Kỹ thuật prompt nâng cao: cấu trúc, few-shot, chain-of-thought (bao gồm I2.1.1 & I2.1.2).",
    "12 phút",
    [
      P("Prompt tốt là một bản thiết kế: có vai trò, ngữ cảnh, nhiệm vụ, ràng buộc và định dạng đầu ra rõ ràng."),
      H("Cấu trúc một prompt mạnh"),
      U(
        "Vai trò (role) và mục tiêu",
        "Ngữ cảnh và dữ liệu đầu vào",
        "Nhiệm vụ cụ thể + ràng buộc",
        "Định dạng đầu ra mong muốn",
      ),
      C("Bạn là chuyên viên QA của YODY.\nNgữ cảnh: [dán checklist]\nNhiệm vụ: liệt kê 5 rủi ro nghiêm trọng nhất.\nĐịnh dạng: bảng | Rủi ro | Mức độ | Đề xuất |"),
      H("Zero-shot, Few-shot và CoT"),
      P("Few-shot đưa ví dụ mẫu; Chain-of-Thought yêu cầu mô hình lập luận từng bước để tăng độ chính xác cho bài toán phức tạp."),
      U(
        "Zero-shot: nhanh, cho tác vụ đơn giản",
        "Few-shot: đưa 2–3 ví dụ để định hướng phong cách",
        "CoT: \"hãy suy nghĩ từng bước\" cho bài toán suy luận",
      ),
    ],
    [
      "Prompt mạnh có vai trò, ngữ cảnh, nhiệm vụ, ràng buộc, định dạng.",
      "Zero-shot cho tác vụ đơn giản.",
      "Few-shot dùng ví dụ mẫu để định hướng.",
      "Chain-of-Thought giúp bài toán suy luận chính xác hơn.",
      "Chỉ định rõ định dạng đầu ra để dễ dùng lại.",
    ],
    [
      q(
        "Few-shot prompting là gì?",
        ["Prompt không có ví dụ", "Đưa vài ví dụ mẫu vào prompt", "Hỏi nhiều lần", "Prompt siêu ngắn"],
        1,
      ),
      q(
        "Chain-of-Thought phù hợp nhất cho?",
        ["Bài toán suy luận nhiều bước", "Chào hỏi", "Dịch một từ", "Đổi màu chữ"],
        0,
      ),
      q(
        "Thành phần KHÔNG thuộc prompt mạnh?",
        ["Vai trò", "Định dạng đầu ra", "Màu sắc giao diện", "Ràng buộc"],
        2,
      ),
    ],
  ),
  L(
    "I2.2",
    "GĐ1",
    "Design Thinking — Thấu cảm & Ý tưởng",
    "Phân biệt \"nhu cầu thực\" và \"điều người dùng nói\", khai thác insight qua phỏng vấn/quan sát và brainstorm HMW.",
    "8 phút",
    [
      P("Design Thinking bắt đầu bằng thấu cảm: hiểu điểm đau thật của người dùng trước khi nghĩ tới giải pháp. Dùng AI để tăng tốc phân tích, nhưng phán đoán vẫn là của bạn."),
      H("Nhu cầu thực vs điều người dùng nói"),
      P("Người dùng thường mô tả giải pháp họ tưởng tượng, không phải vấn đề gốc. Việc của bạn là đào sâu tới nhu cầu thực."),
      U(
        "Khai thác insight qua phỏng vấn và quan sát hành vi",
        "Vẽ empathy map và user journey để nhìn toàn cảnh",
        "Phân cụm phản hồi để tìm pain point lặp lại",
      ),
      Q("Người dùng nói muốn con ngựa nhanh hơn — nhu cầu thực là đi lại nhanh hơn."),
      H("Brainstorm với How-Might-We (HMW)"),
      P("Từ pain point, phát biểu HMW để mở hướng giải pháp, rồi lọc còn vài ý có thể kiểm chứng."),
      U(
        "Brainstorm ≥ 10 ý HMW từ một pain point",
        "Lọc còn 3 ý có tiêu chí kiểm chứng cụ thể",
        "Dùng AI (Claude…) để tổng hợp và phân cụm feedback nhanh",
      ),
    ],
    [
      "Design Thinking khởi đầu từ thấu cảm, không từ giải pháp.",
      "Phân biệt \"điều người dùng nói\" và \"nhu cầu thực\".",
      "Empathy map & user journey giúp nhìn toàn cảnh.",
      "HMW mở hướng giải pháp từ pain point.",
      "Lọc ý tưởng còn vài ý kiểm chứng được.",
    ],
    [
      q(
        "Thấu cảm người dùng nghĩa là?",
        ["Làm đúng điều họ yêu cầu", "Hiểu nhu cầu thực đằng sau lời nói", "Bỏ qua phản hồi", "Chỉ nhìn số liệu"],
        1,
      ),
      q(
        "\"HMW\" dùng để làm gì?",
        ["Đo hiệu năng", "Mở hướng giải pháp từ pain point", "Đặt tên sản phẩm", "Tính chi phí"],
        1,
      ),
      q(
        "Sau brainstorm nên?",
        ["Giữ mọi ý", "Lọc còn vài ý kiểm chứng được", "Chọn ý đầu tiên", "Bỏ hết"],
        1,
      ),
    ],
  ),
  L(
    "I2.3",
    "GĐ2",
    "Critical Thinking — Gốc rễ & Giả thuyết",
    "Phân tích nguyên nhân gốc rễ bằng 5 Whys, phát biểu giả thuyết kiểm chứng được và ra quyết định dựa trên dữ liệu.",
    "10 phút",
    [
      P("Tư duy phản biện giúp bạn không lao vào giải pháp khi chưa hiểu vấn đề. Trước khi thiết kế, hãy tìm nguyên nhân gốc rễ và phát biểu giả thuyết có thể kiểm chứng."),
      H("Tìm nguyên nhân gốc rễ (5 Whys)"),
      P("Hỏi \"tại sao\" liên tiếp để đi từ triệu chứng bề mặt xuống nguyên nhân cốt lõi trước khi bàn giải pháp."),
      U(
        "Tách assumption ẩn khỏi bằng chứng thực tế",
        "Kiểm tra evidence đã đủ chưa, edge case nào bị bỏ sót",
        "Không dừng ở triệu chứng — đào tới gốc rễ",
      ),
      Q("Giải pháp cho sai vấn đề vẫn là một thất bại đắt giá."),
      H("Giả thuyết & quyết định dựa trên dữ liệu"),
      P("Phát biểu giả thuyết rõ ràng, kiểm chứng được, rồi ra quyết định dựa trên dữ liệu chứ không phải cảm tính."),
      U(
        "Phát biểu giả thuyết định lượng, có thể bác bỏ",
        "Thiết kế cách kiểm chứng với chi phí thấp",
        "Draft spec phản biện ≥ 3 rủi ro kèm dẫn chứng",
      ),
    ],
    [
      "Tìm nguyên nhân gốc rễ trước khi thiết kế giải pháp.",
      "5 Whys giúp đi từ triệu chứng xuống gốc rễ.",
      "Tách assumption ẩn khỏi bằng chứng thực tế.",
      "Giả thuyết phải rõ ràng và kiểm chứng được.",
      "Quyết định dựa trên dữ liệu, không cảm tính.",
    ],
    [
      q(
        "Kỹ thuật 5 Whys dùng để?",
        ["Đặt tên tính năng", "Tìm nguyên nhân gốc rễ", "Tính chi phí token", "Vẽ giao diện"],
        1,
      ),
      q(
        "Một giả thuyết tốt phải?",
        ["Không thể kiểm chứng", "Rõ ràng và kiểm chứng được", "Dựa trên cảm tính", "Càng mơ hồ càng tốt"],
        1,
      ),
      q(
        "Ra quyết định nên dựa vào?",
        ["Cảm tính cá nhân", "Dữ liệu & bằng chứng", "Ý kiến to tiếng nhất", "Thói quen"],
        1,
      ),
    ],
  ),
  L(
    "I3.1",
    "GĐ2",
    "Agentic Workflows & RAG",
    "Thiết kế luồng agentic đơn lẻ (single-agent), tích hợp tri thức doanh nghiệp bằng RAG và đặt điểm kiểm soát con người (HITL).",
    "10 phút",
    [
      P("Ở giai đoạn này bạn thiết kế luồng tự động hóa: chia việc giữa con người và AI, đưa tri thức doanh nghiệp vào ngữ cảnh và đặt điểm kiểm soát để đảm bảo tin cậy."),
      H("Single-agent flow & HITL"),
      U(
        "Map luồng: input → bước AI → output → review",
        "Xác định bước nào AI làm, bước nào người duyệt",
        "Đặt điểm kiểm soát Human-in-the-loop (HITL) đúng chỗ",
      ),
      Q("Tự động hoá không có điểm kiểm soát là tự động hoá rủi ro."),
      H("RAG — đưa tri thức doanh nghiệp vào ngữ cảnh"),
      P("RAG (Retrieval-Augmented Generation) nạp tài liệu nghiệp vụ và truy hồi thông tin liên quan để AI trả lời đúng thực tế thay vì bịa."),
      U(
        "Nạp tài liệu nghiệp vụ vào kho tri thức",
        "Truy hồi đoạn liên quan để đưa vào ngữ cảnh",
        "Giải thích rõ điểm nào cần human review và vì sao",
      ),
    ],
    [
      "Thiết kế single-agent flow: input → AI → output → review.",
      "Đặt điểm kiểm soát Human-in-the-loop đúng chỗ.",
      "RAG đưa tri thức doanh nghiệp vào ngữ cảnh của LLM.",
      "RAG giúp AI trả lời đúng thực tế, giảm bịa.",
      "Tự động hoá cần điểm kiểm soát chất lượng.",
    ],
    [
      q(
        "HITL nghĩa là?",
        ["Human-in-the-loop", "High-Intensity Training", "Một loại API", "Ngôn ngữ lập trình"],
        0,
      ),
      q(
        "RAG dùng để?",
        ["Tăng tốc mạng", "Đưa tri thức doanh nghiệp vào ngữ cảnh", "Nén ảnh", "Đổi giao diện"],
        1,
      ),
      q(
        "Vì sao cần điểm kiểm soát trong luồng?",
        ["Để chạy nhanh hơn", "Để kiểm soát chất lượng và rủi ro", "Để tốn token", "Không cần"],
        1,
      ),
    ],
  ),
  L(
    "I3.2",
    "GĐ2",
    "Build Deliverable & Quality Control",
    "Xây dựng một deliverable thực tế đạt tiêu chí nghiệm thu đã thống nhất.",
    "8 phút",
    [
      P("Deliverable là sản phẩm cụ thể có thể demo và bàn giao — không phải bản mô tả."),
      H("Từ spec đến sản phẩm"),
      U(
        "Bám sát acceptance criteria đã chốt",
        "Ưu tiên phần lõi tạo giá trị trước",
        "Kiểm thử đầu ra so với tiêu chí",
      ),
      H("Chuẩn bị bàn giao"),
      P("Deliverable tốt kèm hướng dẫn để người khác tiếp nhận và vận hành được."),
      Q("Chưa demo được thì chưa gọi là deliverable."),
    ],
    [
      "Deliverable phải demo và bàn giao được.",
      "Bám sát acceptance criteria đã chốt.",
      "Ưu tiên phần lõi tạo giá trị trước.",
      "Kiểm thử đầu ra so với tiêu chí nghiệm thu.",
      "Kèm hướng dẫn để người khác tiếp nhận.",
    ],
    [
      q(
        "Deliverable tốt phải?",
        ["Chỉ là ý tưởng", "Demo và bàn giao được", "Chỉ có tài liệu mô tả", "Bí mật tuyệt đối"],
        1,
      ),
      q(
        "Nên ưu tiên xây gì trước?",
        ["Phần trang trí", "Phần lõi tạo giá trị", "Phần ít dùng", "Phần khó nhất không liên quan"],
        1,
      ),
      q(
        "Bàn giao tốt cần?",
        ["Không tài liệu", "Hướng dẫn tiếp nhận/vận hành", "Chỉ mã nguồn rối", "Xoá mọi ghi chú"],
        1,
      ),
    ],
  ),
  L(
    "I3.3",
    "GĐ2",
    "Design Thinking — Cộng tác & Cải tiến",
    "Quy trình review với mentor và vòng lặp cải tiến dựa trên phản hồi thực.",
    "7 phút",
    [
      P("Review không phải để chấm điểm mà để cải thiện. Chuẩn bị bằng chứng và câu hỏi cụ thể."),
      H("Chuẩn bị buổi review"),
      U(
        "Nêu rõ mục tiêu và acceptance criteria",
        "Trình bày bằng chứng đạt/chưa đạt",
        "Đặt câu hỏi cụ thể cần mentor định hướng",
      ),
      H("Vòng lặp cải tiến"),
      P("Ghi lại phản hồi, phân loại theo mức ưu tiên và thực hiện vòng cải tiến tiếp theo."),
      Q("Feedback chỉ có giá trị khi nó dẫn tới một thay đổi cụ thể."),
    ],
    [
      "Review để cải thiện, không phải để chấm điểm.",
      "Chuẩn bị bằng chứng đạt/chưa đạt trước buổi.",
      "Đặt câu hỏi cụ thể cần định hướng.",
      "Ghi lại và phân loại phản hồi theo ưu tiên.",
      "Mỗi vòng feedback phải dẫn tới thay đổi cụ thể.",
    ],
    [
      q(
        "Mục đích chính của review là?",
        ["Chấm điểm", "Cải thiện sản phẩm", "Phê bình cá nhân", "Kéo dài thời gian"],
        1,
      ),
      q(
        "Nên mang gì tới buổi review?",
        ["Không gì cả", "Bằng chứng và câu hỏi cụ thể", "Chỉ lời hứa", "Một câu chuyện dài"],
        1,
      ),
      q(
        "Feedback có giá trị khi?",
        ["Được ghi nhớ trong đầu", "Dẫn tới thay đổi cụ thể", "Bị bỏ qua", "Chỉ để khen"],
        1,
      ),
    ],
  ),
  L(
    "I4.1",
    "GĐ3",
    "Advanced Product Mindset & Ownership",
    "Định hình hướng phát triển sản phẩm và văn hoá cải tiến liên tục.",
    "8 phút",
    [
      P("Ở cấp Integrator, bạn không chỉ làm tính năng mà định hình hướng đi của dòng sản phẩm."),
      H("Tư duy hướng kết quả"),
      U(
        "Gắn mỗi tính năng với một kết quả kinh doanh",
        "Đo lường tác động sau khi ship",
        "Ngừng làm việc không tạo giá trị",
      ),
      H("Cải tiến liên tục"),
      P("Thiết lập vòng lặp học hỏi: đo — học — điều chỉnh."),
      Q("Ship là bắt đầu của việc học, không phải kết thúc."),
    ],
    [
      "Integrator định hình hướng đi của dòng sản phẩm.",
      "Gắn mỗi tính năng với một kết quả kinh doanh.",
      "Đo lường tác động sau khi ship.",
      "Ngừng làm việc không tạo giá trị.",
      "Thiết lập vòng lặp đo–học–điều chỉnh.",
    ],
    [
      q(
        "Integrator tập trung vào?",
        ["Chỉ code", "Hướng đi dòng sản phẩm", "Chỉ giao diện", "Chỉ họp"],
        1,
      ),
      q(
        "Sau khi ship nên?",
        ["Quên nó đi", "Đo lường tác động", "Không làm gì", "Xoá dữ liệu"],
        1,
      ),
      q(
        "Tư duy cải tiến liên tục là?",
        ["Đo–học–điều chỉnh", "Làm một lần rồi thôi", "Không đo lường", "Chỉ thêm tính năng"],
        0,
      ),
    ],
  ),
  L(
    "I4.2",
    "GĐ3",
    "Kỹ năng Lập trình Cơ bản (Dev Craft)",
    "Xây dựng AI có trách nhiệm và làm chủ công cụ lập trình hỗ trợ AI.",
    "11 phút",
    [
      P("Buổi kỹ thuật: dùng công cụ lập trình AI để tăng tốc, đồng thời đảm bảo trách nhiệm và an toàn."),
      H("Làm chủ công cụ code AI"),
      U(
        "Đưa ngữ cảnh repo rõ ràng cho công cụ",
        "Review kỹ mã do AI sinh trước khi commit",
        "Viết test để bảo vệ hành vi đúng",
      ),
      C("# Quy trình an toàn\n1. Mô tả yêu cầu + ràng buộc\n2. Sinh code khung\n3. Review + viết test\n4. Chạy test, sửa, commit"),
      H("AI có trách nhiệm"),
      P("Thiết lập guardrails, kiểm soát PII và ghi lại quyết định thiết kế."),
    ],
    [
      "Công cụ code AI tăng tốc nhưng cần review kỹ.",
      "Đưa ngữ cảnh repo rõ ràng cho công cụ.",
      "Luôn viết test bảo vệ hành vi đúng.",
      "Thiết lập guardrails và kiểm soát PII.",
      "Ghi lại quyết định thiết kế để truy vết.",
    ],
    [
      q(
        "Trước khi commit mã do AI sinh, nên?",
        ["Commit ngay", "Review và viết test", "Xoá test", "Bỏ qua ngữ cảnh"],
        1,
      ),
      q(
        "Guardrails dùng để?",
        ["Tăng token", "Kiểm soát an toàn/hành vi", "Đổi màu", "Chạy nhanh hơn"],
        1,
      ),
      q(
        "Cách giúp công cụ code AI hiệu quả?",
        ["Giấu ngữ cảnh repo", "Cung cấp ngữ cảnh rõ ràng", "Không mô tả yêu cầu", "Không ràng buộc"],
        1,
      ),
    ],
  ),
  L(
    "I4.3",
    "GĐ3",
    "Tích hợp Initiative & Đánh giá kết quả",
    "Tích hợp giải pháp vào hệ thống thật và vận hành cải tiến.",
    "7 phút",
    [
      P("Tích hợp là bước biến prototype thành giải pháp chạy được trong môi trường thật."),
      H("Tích hợp an toàn"),
      U(
        "Kết nối API/DB có kiểm soát lỗi",
        "Thử nghiệm trên môi trường staging trước",
        "Giám sát sau khi tích hợp",
      ),
      H("Vận hành cải tiến"),
      P("Thu thập tín hiệu vận hành để đề xuất cải tiến vòng sau."),
      Q("Tích hợp không giám sát là rủi ro tiềm ẩn."),
    ],
    [
      "Tích hợp biến prototype thành giải pháp chạy thật.",
      "Kết nối API/DB phải kiểm soát lỗi.",
      "Thử trên staging trước khi production.",
      "Giám sát sau khi tích hợp.",
      "Dùng tín hiệu vận hành để cải tiến vòng sau.",
    ],
    [
      q(
        "Nên thử tích hợp ở đâu trước?",
        ["Production ngay", "Staging", "Máy khách hàng", "Không thử"],
        1,
      ),
      q(
        "Sau tích hợp cần?",
        ["Giám sát", "Quên nó", "Xoá log", "Tắt cảnh báo"],
        0,
      ),
      q(
        "Tích hợp an toàn cần?",
        ["Bỏ qua lỗi", "Kiểm soát lỗi API/DB", "Không test", "Không giám sát"],
        1,
      ),
    ],
  ),
  L(
    "I5.1",
    "GĐ4",
    "Kiến trúc Giải pháp AI",
    "Thiết kế kiến trúc giải pháp AI: agentic workflow, RAG và tích hợp hệ thống.",
    "12 phút",
    [
      P("Ở cấp Architect, bạn thiết kế kiến trúc tổng thể: cách các agent, tri thức và công cụ phối hợp."),
      H("Agentic & RAG"),
      U(
        "Single vs Multi-Agent theo độ phức tạp",
        "RAG để đưa tri thức doanh nghiệp vào ngữ cảnh",
        "Kiểm soát vòng lặp (self-correction)",
      ),
      C("User → Retriever (RAG) → Agent (plan) → Tools (API/DB) → Verify → Output"),
      H("Nguyên tắc kiến trúc"),
      P("Đơn giản trước, chỉ thêm agent khi thực sự cần; luôn có bước xác minh đầu ra."),
    ],
    [
      "Architect thiết kế kiến trúc tổng thể của giải pháp.",
      "Chọn Single/Multi-Agent theo độ phức tạp.",
      "RAG đưa tri thức doanh nghiệp vào ngữ cảnh.",
      "Kiểm soát vòng lặp bằng self-correction.",
      "Ưu tiên đơn giản, luôn có bước xác minh đầu ra.",
    ],
    [
      q(
        "RAG dùng để?",
        ["Đổi giao diện", "Đưa tri thức vào ngữ cảnh", "Tăng tốc mạng", "Nén ảnh"],
        1,
      ),
      q(
        "Khi nào dùng Multi-Agent?",
        ["Luôn luôn", "Khi độ phức tạp thực sự cần", "Không bao giờ", "Khi muốn tốn token"],
        1,
      ),
      q(
        "Nguyên tắc kiến trúc tốt?",
        ["Càng phức tạp càng tốt", "Đơn giản trước, có xác minh", "Bỏ bước verify", "Không tài liệu"],
        1,
      ),
    ],
  ),
  L(
    "I5.2",
    "GĐ4",
    "Bảo mật, Eval & Vận hành AI",
    "Chuẩn bị vận hành production: guardrails, eval, đóng gói và giám sát.",
    "10 phút",
    [
      P("Trước khi ship, giải pháp phải sẵn sàng production: an toàn, đo được và đóng gói được."),
      H("Guardrails & Eval"),
      U(
        "Thiết lập guardrails và PII compliance",
        "Xây eval set để đo chất lượng ổn định",
        "Tối ưu chi phí và độ trễ",
      ),
      H("Đóng gói & Vận hành"),
      P("Đóng gói (Docker) và thiết lập giám sát, cảnh báo khi có sự cố."),
      Q("Không có eval set thì không biết mình đang tốt lên hay xấu đi."),
    ],
    [
      "Production-ready = an toàn, đo được, đóng gói được.",
      "Thiết lập guardrails và PII compliance.",
      "Xây eval set để đo chất lượng ổn định.",
      "Tối ưu chi phí và độ trễ.",
      "Đóng gói (Docker) + giám sát và cảnh báo.",
    ],
    [
      q(
        "Eval set dùng để?",
        ["Trang trí", "Đo chất lượng ổn định", "Tăng token", "Đổi màu"],
        1,
      ),
      q(
        "Guardrails + PII compliance là?",
        ["Tuỳ chọn", "Tiêu chuẩn bắt buộc", "Không cần", "Chỉ cho marketing"],
        1,
      ),
      q(
        "Công cụ đóng gói phổ biến?",
        ["Docker", "Photoshop", "Excel", "Slack"],
        0,
      ),
    ],
  ),
  L(
    "I5.3",
    "GĐ4",
    "Ship & Bảo vệ Capstone",
    "Đưa giải pháp lên chạy thật và bảo vệ đồ án Capstone trước Hội đồng.",
    "9 phút",
    [
      P("Đỉnh của chương trình: ship giải pháp chạy ổn định và trình bày thuyết phục trước Hội đồng."),
      H("Chuẩn bị bảo vệ"),
      U(
        "Kể câu chuyện vấn đề → giải pháp → kết quả",
        "Trình bày bằng chứng và chỉ số giá trị",
        "Sẵn sàng trả lời câu hỏi phản biện",
      ),
      H("Sau khi ship"),
      P("Bàn giao đầy đủ tài liệu và kế hoạch vận hành tiếp theo."),
      Q("Bảo vệ tốt là khi Hội đồng thấy rõ giá trị và tin vào bằng chứng."),
    ],
    [
      "Capstone: ship chạy thật + bảo vệ trước Hội đồng.",
      "Kể câu chuyện vấn đề → giải pháp → kết quả.",
      "Trình bày bằng chứng và chỉ số giá trị.",
      "Sẵn sàng cho câu hỏi phản biện.",
      "Bàn giao tài liệu và kế hoạch vận hành.",
    ],
    [
      q(
        "Capstone yêu cầu?",
        ["Chỉ slide đẹp", "Ship thật + bảo vệ", "Không cần bằng chứng", "Chỉ ý tưởng"],
        1,
      ),
      q(
        "Cấu trúc kể chuyện tốt?",
        ["Vấn đề → giải pháp → kết quả", "Kết quả → không gì", "Chỉ giải pháp", "Không cấu trúc"],
        0,
      ),
      q(
        "Sau khi ship cần?",
        ["Biến mất", "Bàn giao tài liệu & vận hành", "Xoá repo", "Không hỗ trợ"],
        1,
      ),
    ],
  ),
];