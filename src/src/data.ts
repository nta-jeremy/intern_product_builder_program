import { SuccessProfileItem, ProductDetail, CoachingPhase, ScorecardCriterion, JournalTemplate } from './types';

export const SUCCESS_PROFILE_DATA: SuccessProfileItem[] = [
  {
    key: 'builder-mindset',
    dimension: 'Builder Mindset',
    description: 'Ship 4 sản phẩm thực từ ý tưởng đến tay người dùng. Không sợ lặp lại. Embrace iteration.',
    goodBehaviors: [
      'Ship đều đặn, có feedback loop liên tục',
      'Sẵn sàng xoay trục (pivot) khi nhận phản hồi thực tế',
      'Tập trung vào "working software" có giá trị trực tiếp cho user'
    ],
    badBehaviors: [
      'Chờ đợi sự hoàn hảo mới chịu deploy/ship',
      'Over-engineer hệ thống quá phức tạp so với nhu cầu MVP',
      'Sợ sai lầm và ngại thay đổi thiết kế ban đầu'
    ]
  },
  {
    key: 'ai-first',
    dimension: 'AI-First Thinking',
    description: 'Sử dụng AI tools thành thạo: Claude, Cursor, n8n... làm đòn bẩy, không phải làm thay.',
    goodBehaviors: [
      'Trên 70% các tính năng được phát triển có sự hỗ trợ thông minh từ AI',
      'Viết prompt chất lượng cao, hiểu bản chất dòng code AI viết ra',
      'Ứng dụng AI để tăng tốc độ phát triển lên gấp 3-4 lần thông thường'
    ],
    badBehaviors: [
      'Chỉ dùng AI như công cụ tìm kiếm thay cho Google',
      'Copy-paste code từ AI một cách mù quáng không hiểu luồng',
      'Phát triển sản phẩm hoàn toàn thủ công không tận dụng sức mạnh AI'
    ]
  },
  {
    key: 'business-thinking',
    dimension: 'Business Thinking',
    description: 'Trả lời được WHY (tại sao làm?), WHO (ai dùng?), HOW MUCH (đo được gì?) cho mỗi sản phẩm.',
    goodBehaviors: [
      'Mọi tính năng được xây dựng đều gắn với một bài toán nghiệp vụ rõ ràng',
      'Xác định đúng nhóm đối tượng người dùng cuối và lắng nghe nhu cầu thực',
      'Biết từ chối "scope creep" (phình chướng tính năng không quan trọng)'
    ],
    badBehaviors: [
      'Tập trung nghiên cứu và xây dựng vì thấy giải pháp "hay ho"',
      'Mơ hồ về người dùng cuối và cách họ sẽ thao tác sản phẩm',
      'Nhồi nhét mọi thứ vào MVP khiến phát triển chậm trễ'
    ]
  },
  {
    key: 'learning-agility',
    dimension: 'Learning Agility',
    description: 'Tự học công cụ mới trong 1-2 tuần. Không cần spoon-feed từng bước. Doc-driven learning.',
    goodBehaviors: [
      'Chủ động nghiên cứu tài liệu gốc, thử nghiệm nhanh và rút kinh nghiệm',
      'Đọc tài liệu chính thức (doc-driven learning) để nắm bắt công nghệ mới',
      'Đặt câu hỏi thông minh khi gặp khó sau khi đã chủ động tự cứu'
    ],
    badBehaviors: [
      'Chờ đợi các khóa học hoặc bài hướng dẫn cụ thể từng bước chân',
      'Ngại đọc tài liệu kỹ thuật dài, hỏi trước khi tự tay thử nghiệm',
      'Bị bế tắc quá lâu mà không nâng cao phương pháp tự tìm kiếm giải pháp'
    ]
  },
  {
    key: 'ownership',
    dimension: 'Ownership',
    description: 'Chủ động next step mà không cần hỏi. Raise blocker sớm. Đề xuất giải pháp, không chỉ nêu vấn đề.',
    goodBehaviors: [
      'Tự định vị bước tiếp theo cần thực hiện và tự quản lý khối lượng công việc',
      'Báo cáo và cập nhật tiến độ chủ động (proactive reporting)',
      'Phát hiện sớm rào cản (blocker) và đề xuất phương án giải quyết đi kèm trước khi xin ý kiến'
    ],
    badBehaviors: [
      'Cần được nhắc nhở, phân việc chi tiết từng đầu công việc hàng ngày',
      'Biến mất khi gặp khó khăn, không thông báo cho quản lý trực tiếp',
      'Chỉ nêu ra vấn đề bị kẹt và chờ mentor đưa giải pháp có sẵn'
    ]
  }
];

export const PRODUCTS_DATA: ProductDetail[] = [
  {
    id: 'ats',
    title: 'Hệ thống ATS',
    subtitle: 'Applicant Tracking System',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Quản lý toàn bộ quy trình tuyển dụng ứng viên tại YODY. Hệ thống cho phép HR quản lý toàn bộ pipeline từ đăng tin, nhận CV, lưu trữ, phân loại ứng viên cho đến lúc gửi lời mời nhận việc (Offer) hoặc bỏ qua (Reject).',
    primaryUsers: [
      'Phòng Nhân sự (HR) - Trực tiếp quản lý pipeline tuyển dụng và thông tin ứng viên',
      'Hiring Manager - Xem, đánh giá và quyết định trạng thái ứng viên theo phòng ban phụ trách'
    ],
    deliverables: [
      {
        feature: 'Problem Discovery & User Flow',
        output: 'Tài liệu Problem Brief, Biểu đồ luồng người dùng (User Flow diagram), Wireframe giao diện (PDF)',
        kpi: 'HR Lead phê duyệt và ký nhận luồng nghiệp vụ trước khi tiến hành viết code',
        signOff: 'HR Lead + Product Owner (PO)'
      },
      {
        feature: 'User Stories & DB Schema',
        output: '15 câu chuyện người dùng (User Stories) có điều kiện nghiệm thu cụ thể, Biểu đồ cấu trúc cơ sở dữ liệu (DB Schema Diagram), Đề xuất Tech Stack',
        kpi: 'Tech Lead phê duyệt cấu trúc cơ sở dữ liệu và kiến trúc hệ thống',
        signOff: 'Tech Lead + PO'
      },
      {
        feature: 'Auth + Dashboard UI',
        output: 'Trang đăng nhập bảo mật, Tài liệu APIs, Khung giao diện bảng điều khiển (Dashboard skeleton)',
        kpi: 'Chức năng xác thực hoạt động ổn định, giao diện hoàn thiện đồng bộ theo đúng bản vẽ mẫu',
        signOff: 'Tech Lead'
      },
      {
        feature: 'CRUD Candidates + CV Upload',
        output: 'Danh sách ứng viên, Form thêm/sửa, Công cụ tải lên CV trực tiếp, Quản lý dòng trạng thái (Applied → Interviewed → Offer/Reject)',
        kpi: 'Thay đổi trạng thái ứng viên mượt mà, lưu trữ CV an toàn và truy xuất chuẩn xác',
        signOff: 'Tech Lead + QA'
      },
      {
        feature: 'Search, Filter, Notifications',
        output: 'Bộ lọc nâng cao, tìm kiếm nhanh thông minh, giao diện hành động hàng loạt, tự động kích hoạt gửi Email cập nhật trạng thái',
        kpi: 'Truy xuất và hiển thị kết quả tìm kiếm đúng ứng viên bất kỳ trong thời gian dưới 3 giây',
        signOff: 'HR Lead + QA'
      },
      {
        feature: 'Analytics + Export',
        output: 'Dashboard báo cáo chỉ số tuyển dụng, biểu đồ hiệu suất thời gian tuyển dụng (Time-to-hire), Trích xuất báo cáo Excel/CSV',
        kpi: 'Số liệu tổng hợp tự động, đầu ra tệp Excel định dạng đẹp và chứa đầy đủ thông tin chuẩn',
        signOff: 'HR Lead'
      },
      {
        feature: 'UAT + Deploy Production',
        output: 'Bộ tài liệu hướng dẫn bàn giao và đào tạo, Biên bản kiểm nghiệm UAT, Triển khai lên môi trường Live Production',
        kpi: 'Tỷ lệ nghiệm thu người dùng (UAT pass rate) đạt trên 80% từ phía HR, không tồn dư lỗi nghiêm trọng (Zero Critical bug)',
        signOff: 'HR Director'
      }
    ]
  },
  {
    id: 'agent-qc',
    title: 'Agent QC cho Website YODY',
    subtitle: 'Automated Quality Control Agent',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Xây dựng một Agent AI tự động chạy định kỳ để rà soát lỗi chất lượng trên website bán hàng YODY (yody.vn). Agent sẽ kiểm tra lỗi phá vỡ giao diện (UI errors), liên kết bị hỏng (broken links), kiểm tra độ tương thích di động (responsive testing), đo lường tốc độ tải trang (load time) và kiểm tra các tiêu chuẩn SEO cốt lõi (SEO basics) sau đó tự động phát tín hiệu cảnh báo qua Slack/Email.',
    primaryUsers: [
      'Phòng Đảm bảo chất lượng (QA Team) - Nhận báo cáo tự động rà soát chất lượng website',
      'Đội ngũ Vận hành / Technical Team - Nhận cảnh báo tức thời để khắc phục sự cố'
    ],
    deliverables: [
      {
        feature: 'QC Checklist & Pain Point Analysis',
        output: 'Tài liệu chi tiết các kịch bản kiểm tra (QC Checklist), Phân tích các lỗi nghiêm trọng hay gặp, Lựa chọn 5-10 kịch bản ưu tiên tự động hóa',
        kpi: 'QA Lead ký duyệt danh sách các kịch bản kiểm thử tự động',
        signOff: 'QA Lead'
      },
      {
        feature: 'Agent Framework + 5 Test Cases',
        output: 'Mã nguồn xây dựng khung Agent, Công cụ tự động hóa trình duyệt (Browser automation), Kích hoạt ổn định 5 kịch bản kiểm thử đầu tiên',
        kpi: 'Kịch bản chạy tự động chuẩn xác, không xảy ra hiện tượng cảnh báo sai hoặc lỗi giả (False positive)',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Mở rộng 10+ Test Cases + Slack',
        output: 'Tích hợp mở rộng hơn 10 kịch bản kiểm thử, Mẫu báo cáo kết xuất trực quan, Đấu nối bộ nhận diện cảnh báo Slack Webhook',
        kpi: 'Độ phủ kiểm thử tối thiểu đạt 50% theo danh mục QC Checklist danh nghĩa, nhận tin nhắn cảnh báo tức thời ngay khi website gặp lỗi',
        signOff: 'QA Lead + Tech Lead'
      },
      {
        feature: 'Schedule + UAT + Training',
        output: 'Cấu hình Scheduler tự động (Cron job block), Tài liệu phân tích báo cáo, Bộ tài liệu hướng dẫn và tập huấn cách vận hành cho QA team',
        kpi: 'Hệ thống tự động vận hành đều đặn 2 lần/tuần, QA team hoàn toàn tự chủ quản lý và mở rộng kịch bản khi cần thiết',
        signOff: 'QA Director'
      }
    ]
  },
  {
    id: 'agent-compliance',
    title: 'Thiết kế và Thẩm định Quy trình',
    subtitle: 'Internal Compliance Verification Agent',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Xây dựng một Agent AI được tập huấn theo các biểu mẫu quy trình nội bộ chính thức tại YODY (như phiếu điều chỉnh giá bán hàng, phiếu xin phê duyệt ngân sách, phiếu nhập/xuất kho...). Agent có khả năng thông hiểu cấu trúc biểu mẫu nhập liệu, tự động rà soát và so sánh tính logic của dữ liệu đầu vào chống thất thoát, phát hiện các điểm sai lệch quy trình (flag deviations) và gửi báo cáo khẩn trực tiếp cho Ban kiểm soát.',
    primaryUsers: [
      'Ban Pháp chế & Kiểm soát nội bộ (Compliance Team) - Giảm thiểu việc rà soát thủ công các giấy tờ phê duyệt',
      'Các Phòng ban nghiệp vụ - Đảm bảo điền đúng thông tin quy chuẩn trước khi trình ký duyệt'
    ],
    approaches: [
      'Thu thập 3-5 mẫu biểu đang lưu hành chạy trực tiếp tại YODY',
      'Định nghĩa các tập luật tự động (criteria rules) chuẩn xác cho từng ô dữ liệu',
      'Tập huấn Agent AI đọc hiểu phân tích mẫu → phát hiện sai lệch → báo động trực tiếp',
      'Tích hợp tự nhiên vào công cụ làm việc hàng ngày của nhân viên (Slack/Email), không gây xáo trộn quy trình'
    ],
    deliverables: [
      {
        feature: 'Thu thập & Chuẩn hóa Template',
        output: 'Xây dựng bộ dữ liệu của 3-5 biểu mẫu thực tế, Khớp luật thẩm định chi tiết, Tài liệu mô phỏng quy tắc ánh xạ luật (rule mapping doc)',
        kpi: 'Compliance Lead xác thực các tập luật nghiệp vụ mô phỏng đúng 100% quy trình thực tế',
        signOff: 'Compliance Lead'
      },
      {
        feature: 'Build Agent đọc Template #1',
        output: 'Mã nguồn cốt lõi Agent đọc hiểu biểu mẫu đầu tiên, Kết quả thẩm định thử nghiệm chạy trên 20 bộ hồ sơ mẫu',
        kpi: 'Tỷ lệ thẩm định nhận dạng chính xác lỗi sai sót đạt trên 80% với tối thiểu 20 tập dữ liệu mẫu',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Build Agent #2, #3 + Alert',
        output: 'Hoàn thiện thêm các dòng Agent thẩm định biểu mẫu 2 và 3, Luồng biểu diễn nghiệp vụ tự động (workflow diagrams), Đấu nối thư điện tử cảnh báo',
        kpi: 'Kiểm soát đồng thời 3 loại biểu mẫu chính, hệ thống gửi email cảnh báo đúng người thẩm quyền trong vòng dưới 2 phút từ lúc nhận thông tin',
        signOff: 'Compliance Lead'
      },
      {
        feature: 'Dashboard + Integration + UAT',
        output: 'Xây dựng Bảng thống kê kết quả thẩm định tổng, Mã nguồn kiểm thử tích hợp (Integration test), Sách hướng dẫn chi tiết cho người sử dụng',
        kpi: 'UAT hoàn tất thành công, chuyên viên kiểm soát nội bộ sử dụng thuần thục mà không cần thao tác kỹ thuật bổ sung',
        signOff: 'Compliance Director'
      }
    ]
  },
  {
    id: 'agent-personal',
    title: 'Agent Quản lý Công việc & Báo cáo Cá nhân',
    subtitle: 'Personal Productivity and Reporting Agent',
    priority: 'TRUNG BÌNH',
    priorityStars: 2,
    description: 'Agent AI đắc lực hỗ trợ trực tiếp từng cá nhân (Intern hoặc Manager) tự động quản lý, theo dõi sát sao tất cả danh sách công việc của mình. Trợ lý này có khả năng tự động nhắc nhở khi sắp đến hạn hoàn thành (deadline alarm) và tổng hợp báo cáo công tác tuần/tháng theo yêu cầu (on-demand reporting) thông qua kết nối API với nền tảng quản lý dự án hiện có tại YODY.',
    primaryUsers: [
      'Cá nhân Intern - Tự theo dõi tiến trình thực hiện của bản thân và sinh nhanh báo cáo thực tập hàng tuần',
      'Quản lý trực tiếp (Manager) - Nhận báo cáo công việc chất lượng cao của từng thành viên tự động sinh ra'
    ],
    deliverables: [
      {
        feature: 'Study API & Define Metrics',
        output: 'Tài liệu tích hợp APIs các công cụ nhiệm vụ, Định nghĩa danh sách các chỉ số báo cáo cho từng vai trò, Bản vẽ giao diện mẫu của báo cáo cá nhân',
        kpi: 'Product Owner phê duyệt bộ chỉ số đánh giá và cấu trúc báo cáo hiển thị tối ưu cho người dùng',
        signOff: 'PO'
      },
      {
        feature: 'Build Agent Pull Data + Metrics',
        output: 'Mã nguồn Agent kết nối cổng lấy dữ liệu, Bộ xử lý tính toán số liệu tự động, Kết xuất mẫu báo cáo bằng văn bản thông thường',
        kpi: 'Tương tác API trơn tru lấy đúng và đủ dữ liệu công việc cá nhân được phân bổ, các thuật toán đo đếm kpi hoạt động chuẩn xác',
        signOff: 'Tech Lead'
      },
      {
        feature: 'HTML Report + Charts + Schedule',
        output: 'Giao diện mẫu báo cáo HTML đẹp, Trực quan hóa dữ liệu bằng các biểu đồ sinh động, Cài đặt lịch trình tự động chạy (Scheduler configuration)',
        kpi: 'Biểu đồ trực quan và báo cáo hiển thị trực quan sinh động trên nền HTML, bộ lên lịch gửi báo cáo chạy ổn định không lỗi',
        signOff: 'PO'
      },
      {
        feature: 'Email + Filter + Dashboard + UAT',
        output: 'Đấu nối hoàn chỉnh dịch vụ gửi Email, Bộ lọc báo cáo theo dòng thời gian, cá nhân hoặc phòng ban, Bản vẽ tổng quan (Mini Dashboard), Tập huấn sử dụng',
        kpi: 'Bất kỳ nhân sự nào cũng có thể gửi yêu cầu on-demand nhận báo cáo tổng kết tiến độ tức thì gửi thẳng vào hòm thư điện tử cá nhân',
        signOff: 'HOD + PO'
      }
    ]
  }
];

export const COACHING_LIFECYCLE_DATA: CoachingPhase[] = [
  {
    phase: 'PHASE 1',
    title: 'DISCOVER (Khám Phá)',
    time: 'Tháng 1 • Tuần 1-4',
    objectives: [
      'Hiểu sâu sắc bài toán nghiệp vụ cốt lõi của từng sản phẩm - trực tiếp phỏng vấn stakeholder không phỏng đoán cảm tính',
      'Phác thảo sơ đồ luồng người dùng (User Flow), viết tài liệu Problem Brief và bóc tách danh sách User Stories rõ ràng',
      'Thiết kế cấu trúc cơ sở dữ liệu (DB Schema) và các điểm API trước khi viết dòng code phát triển nào',
      'Đạt sự đồng thuận (align) cao độ với PO và Tech Lead về hướng giải quyết bài toán'
    ],
    coachingFocus: [
      'Product Owner (PO) hỗ trợ: Tư duy bóc tách vấn đề (problem thinking), thấu cảm người dùng (user empathy) và cấu trúc giới hạn kiểm thử (scope definition)',
      'Tech Lead hỗ trợ: Quyết định lựa chọn kiến trúc (architecture decision), phân tích lý do chọn lựa Stack công nghệ tối ưu'
    ],
    checkpoints: [
      'Hoàn thiện tài liệu Problem Brief cho cả 4 sản phẩm chính thức',
      'Vẽ thành công sơ đồ luồng nghiệp vụ (User Flow) rành mạch và Bản vẽ bộ khung giao diện nháp (Wireframe draft) cho hệ thống ATS',
      'Báo cáo quyết định kiến trúc và công nghệ được Tech Lead ký duyệt'
    ]
  },
  {
    phase: 'PHASE 2',
    title: 'BUILD (Xây Dựng)',
    time: 'Tháng 2 • Tuần 5-8',
    objectives: [
      'Triết lý "Ship early, ship often" - Ưu tiên duy trì phần mềm chạy ổn định (working software) hơn là mã nguồn hoàn hảo',
      'Xây dựng các tính năng theo đúng mức độ phân cấp ưu tiên (priority rating) đã vạch ra trong User Stories',
      'Tổ chức demo chạy thử phần mềm nội bộ (internal demo) định kỳ mỗi 2 tuần để hứng chịu phản hồi sớm',
      'Ứng dụng tối đa các công cụ AI trợ giúp (Claude, Cursor...), đồng thời ghi chép đầy đủ tỷ lệ AI assist ratio của từng tính năng'
    ],
    coachingFocus: [
      'PO hỗ trợ: Sắp xếp thứ tự ưu tiên các tính năng bám sát thực tế, kiểm soát phạm phát phình tính năng (scope management), phân tích feedback',
      'Tech Lead hỗ trợ: Đánh giá mã nguồn chất lượng cao (code review), kiểm soát cấu trúc và tư duy tinh gọn khi dùng AI gõ code, phương án gỡ lỗi'
    ],
    checkpoints: [
      'Tổ chức buổi Demo giữa kỳ cho PO, Tech Lead và đại diện phòng ban vận hành thực tế',
      'Sản phẩm cốt lõi ATS đạt trên 70% tiến độ phát triển, 3 sản phẩm AI Agents còn lại đạt trạng thái kiểm thử tối thiểu là 50%',
      'Tự soi chiếu và hoàn thành Journal tự đánh giá Sprint Retrospective'
    ]
  },
  {
    phase: 'PHASE 3',
    title: 'VALIDATE (Kiểm Thử Thực Tế)',
    time: 'Tháng 2.5 • Tuần 9-10',
    objectives: [
      'Thực hiện quy trình UAT trực tiếp với người sử dụng thực tế trong môi trường thật - Nói KHÔNG với việc chỉ demo trong phòng Lab đóng kín',
      'Thu thập có hệ thống các phản hồi từ người dùng thực tế, phân loại định danh thứ tự lỗi (P0 - Chí mạng, P1 - Nghiêm trọng, P2 - Đề xuất)',
      'Sửa lỗi quyết liệt theo thứ tự ưu tiên cao nhất, đóng băng (freeze) toàn bộ việc phát sinh thêm tính năng mới',
      'Hoàn thành danh mục kiểm duyệt kỹ thuật (Deployment Checklist) và chuẩn bị kế hoạch go-live sản phẩm'
    ],
    coachingFocus: [
      'PO hỗ trợ: Tổng hợp thông tin phản hồi từ người sử dụng, thẩm định quyết định chính thức cho phép triển khai (go/no-go selection)',
      'Tech Lead hỗ trợ: Sắp xếp phân hạng xử lý lỗi kỹ thuật (bug triage), rà soát hiệu năng xử lý của mã nguồn (performance tuning)'
    ],
    checkpoints: [
      'Ký nhận thành công tài liệu bàn giao kiểm duyệt UAT (UAT Sign-off) từ phía các stakeholder người dùng cuối của từng sản phẩm',
      'Danh mục lỗi đạt chuẩn xuất xưởng: Sạch bóng lỗi P0 (zero P0), số lỗi P1 nhỏ hơn 5 chỉ số'
    ]
  },
  {
    phase: 'PHASE 4',
    title: 'SHIP (Triển Khai & Bàn Giao)',
    time: 'Tháng 3 • Tuần 11-12',
    objectives: [
      'Triển khai toàn diện sản phẩm lên môi trường hạ tầng thực tế (Live Production), theo dõi hiệu suất, xử lý dứt điểm các lỗi phát sinh ban đầu',
      'Đào tạo và chuyển tải kiến thức cho người dùng thực thụ để họ có khả năng hoàn toàn tự vận hành trơn tru',
      'Soạn thảo tài liệu bàn giao kỹ thuật (Handover Document) chi tiết, rành mạch để bất kỳ kỹ sư kế thừa nào cũng nắm bắt ngay lập tức',
      'Tổng duyệt và chuẩn bị cho buổi phản biện chính thức trước Hội đồng thẩm định độc lập'
    ],
    coachingFocus: [
      'PO hỗ trợ: Đánh giá độ hoàn mỹ của tài liệu bàn giao, tư duy giao tiếp thuyết phục với BoD và các HODs',
      'Tech Lead hỗ trợ: Thẩm định độ an toàn bảo mật trên môi trường Production, chấm điểm chất lượng và độ mạch lạc của tài liệu kỹ thuật'
    ],
    checkpoints: [
      'Sản phẩm hoạt động thực tế trên hạ tầng của YODY, người dùng cuối đang tương tác hàng ngày',
      'Hoàn thiện cuốn cẩm nang bàn giao hệ thống (Handover Document) trọn vẹn',
      'Nhận bảng điểm tổng sắp chính thức từ Hội đồng thẩm định độc lập thông qua công cụ ScoreCard đánh giá'
    ]
  }
];

export const SCORECARD_DATA: ScorecardCriterion[] = [
  {
    category: 'Product Delivery (Năng lực Bàn giao Sản phẩm)',
    maxScore: 40,
    items: [
      {
        name: 'Mức độ hoàn thành sản phẩm (Trọng số 15đ)',
        points: 15,
        unmet: 'Hoàn thành < 50% tính năng cam kết ban đầu, sản phẩm lỗi nhiều không vận hành được',
        met: 'Hoàn thành từ 50-70% tính năng đề ra, demo được luồng nghiệp vụ cơ bản',
        good: 'Hoàn thành từ 70-90% tính năng cam kết, sẵn sàng triển khai trên môi trường thử nghiệm (staging)',
        excellent: 'Hoàn thành xuất sắc trên 90% tính năng, triển khai hoạt động thực tế trên production'
      },
      {
        name: 'Chất lượng trải nghiệm & UAT (Trọng số 10đ)',
        points: 10,
        unmet: 'Tỷ lệ lỗi khi người dùng thẩm định UAT > 30%, hệ thống thường xuyên đổ bể',
        met: 'Tỷ lệ lỗi UAT dao động 20-30%, các lỗi chí mạng (P0) đã được khắc phục thủ công',
        good: 'Tỷ lệ lỗi UAT dưới 10%, sạch bóng lỗi chí mạng (Zero P0 bug), sản phẩm chạy mượt',
        excellent: 'Tỷ lệ lỗi cực thấp dưới 5%, hệ thống tối ưu hóa hoàn toàn, vận hành cực kỳ ổn định'
      },
      {
        name: 'Sự hài lòng của Stakeholder (Trọng số 10đ)',
        points: 10,
        unmet: 'Điểm đánh giá trải nghiệm thực tế từ người dùng dưới mức trung bình (< 3/5 sao)',
        met: 'Người dùng đánh giá ở mức chấp nhận được, giải quyết được nhu cầu tối thiểu (3/5 sao)',
        good: 'Stakeholder phản hồi tích cực, yêu thích giao diện và hiệu năng (3.5/5 sao)',
        excellent: 'Chinh phục hoàn toàn người dùng thực thụ, đánh giá tối hảo với hiệu quả vượt bậc (≥ 4/5 sao)'
      },
      {
        name: 'Triển khai & Sẵn sàng Vận hành (Trọng số 5đ)',
        points: 5,
        unmet: 'Chỉ dừng lại ở dạng mô phỏng ý tưởng (prototype), không có khả năng triển khai thực tế',
        met: 'Triển khai thành công trên môi trường Staging thử nghiệm cho nội bộ xem xét',
        good: 'Hệ thống sẵn sàng vận chuyển lên Production, có đi kèm tài liệu hướng dẫn bàn giao cơ bản',
        excellent: 'Sản phẩm hoạt động trực tiếp trên hạ tầng thật, có trang bị đo lường chi tiết (monitored)'
      }
    ]
  },
  {
    category: 'Personal Growth (Độ Phát triển Cá nhân)',
    maxScore: 40,
    items: [
      {
        name: 'Tư duy phát triển AI-First (Trọng số 10đ)',
        points: 10,
        unmet: 'Dưới 50% dự án có sự tham gia của AI, phát triển thủ công chậm chạm',
        met: 'Có thói quen dùng AI giải quyết từ 50-70% công việc nhưng chỉ dừng ở mức nhờ viết code thô sơ',
        good: 'Mức độ ứng dụng đạt từ 70-85%, biết tận dụng cấu trúc prompt tốt để giải quyết bài toán phức tạp',
        excellent: 'Ứng dụng xuất sắc trên 85% các cấu phần, làm việc phối hợp nhịp nhàng với AI như đồng nghiệp thực sự'
      },
      {
        name: 'Tinh thần sáng tạo Builder & Tần suất Ship (Trọng số 10đ)',
        points: 10,
        unmet: 'Tần suất cập nhật sản phẩm quá chậm (> 3 tuần một lần cập nhật), thụ động chờ chỉ đạo',
        met: 'Duy trì tiến độ cập nhật sản phẩm đều đặn 2 tuần một lần bám sát lịch trình Sprint',
        good: 'Tự chủ và quyết đoán, ship đều đặn hàng tuần, liên tục cải tiến hệ thống theo feedback nhanh',
        excellent: 'Phát triển với tốc độ thần tốc, ship cập nhật sản phẩm cứ 2-3 ngày một lần, làm chủ hoàn toàn các vòng lặp nâng cấp'
      },
      {
        name: 'Tư duy Đứng từ góc độ Business (Trọng số 10đ)',
        points: 10,
        unmet: 'Chỉ biết cắm đầu viết code kỹ thuật, hoàn toàn lơ mơ không chỉ ra được WHY hay WHO sử dụng',
        met: 'Hiểu và trả lời được ở mức cơ bản các câu hỏi về giá trị sử dụng khi được mentor gợi ý mở lời',
        good: 'Tự tin thuyết trình rành mạch các giá trị WHY + WHO + cách đo lường cụ thể cho từng tính năng',
        excellent: 'Đứng vững từ góc nhìn kinh tế của doanh nghiệp để thiết kế, dũng cảm từ chối các tính năng phát sinh không đem lại hiệu quả thực chất'
      },
      {
        name: 'Chủ động nhận trách nhiệm & Ownership (Trọng số 10đ)',
        points: 10,
        unmet: 'Bị động hoàn toàn, chỉ biết làm theo hướng dẫn cầm tay chỉ việc chi tiết',
        met: 'Có phản hồi và trả lời tiến độ khi được hỏi dồn, hoàn thành vừa đủ việc được giao',
        good: 'Có khả năng tự định hướng công việc (self-directed), phát hiện blocker và raise cảnh báo sớm lên cấp trên',
        excellent: 'Dẫn dắt luồng giải quyết chủ động, đề xuất giải pháp đột phá và kiêm nhiệm hỗ trợ định hướng cho đồng đội'
      }
    ]
  },
  {
    category: 'Process Quality (Chất lượng Quy trình Phối hợp)',
    maxScore: 20,
    items: [
      {
        name: 'Tính hoàn thiện tài liệu nhật ký báo cáo (Trọng số 10đ)',
        points: 10,
        unmet: 'Dưới 50% số lượng các template nhật ký làm việc (Working Journal) được hoàn tất rành mạch',
        met: 'Hoàn tất đủ thông tin cơ bản cho từ 50-80% số lượng các template quy định',
        good: 'Chép nhật ký và hoàn thiện đầy đủ từ 80-95% nội dung với câu chữ minh triết rõ lý do',
        excellent: 'Đạt độ hoàn hảo 100%, bổ sung thêm nhiều kiến thức tự chứng nghiệm sâu sắc từ thực tế dự án'
      },
      {
        name: 'Chất lượng thông tin liên lạc giao tiếp (Trọng số 5đ)',
        points: 5,
        unmet: 'Chỉ báo cáo và nói chuyện khi bị hối thúc hỏi han hoặc biến mất đột ngột',
        met: 'Thực hiện cập nhật báo cáo đều đặn hàng tuần bám sát lịch giao ban chính thức',
        good: 'Duy trì liên lạc chất lượng cao tối thiểu 2 lần/tuần, cảnh báo khẩn các điểm tắc nghẽn tức thời',
        excellent: 'Giao tiếp thông thái chủ động, cực kỳ chuyên nghiệp trong việc viết tài liệu async cho toàn đội ngũ phối hợp nhịp nhàng'
      },
      {
        name: 'Khả năng tự học nghiên cứu Learning Agility (Trọng số 5đ)',
        points: 5,
        unmet: 'Mất rất nhiều thời gian (> 3 tuần) nhưng vẫn loay hoay không tiếp thu nổi kỹ thuật/công cụ mới',
        met: 'Học và làm quen được các thư viện phát triển mới trong khoảng 2-3 tuần nhưng cần mentor kèm cặp nhiều',
        good: 'Làm quen thuần thục mọi công nghệ hay công cụ chỉ sau 1-2 tuần tự mình tìm hiểu và thực hành trực tiếp',
        excellent: 'Không ngại công nghệ lạ, tự học cực tốc dưới 1 tuần và lập tức biên soạn cẩm nang chia sẻ cho cộng đồng kỹ sư'
      }
    ]
  }
];

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'brief',
    title: '[TEMPLATE 01] PRODUCT BRIEF',
    description: 'Bản mô tả tóm tắt định nghĩa bài toán sản phẩm và phạm vi phát triển. Cần được điền trọn vẹn và thông qua sự phê duyệt của Product Owner trước khi bắt đầu triển khai viết code.',
    fields: [
      { key: 'productName', label: 'Tên sản phẩm & Phiên bản (Version)', type: 'text', placeholder: 'Ví dụ: Hệ thống tuyển dụng ATS - v1.0.0-beta' },
      { key: 'problem', label: 'Bài toán cốt lõi (Problem Statement) - Ai đang gặp vấn đề gì cụ thể?', type: 'textarea', placeholder: 'Mô tả rõ rệt các nỗi đau hiện có của HR hoặc kiểm soát nội bộ khi thao tác thủ công...' },
      { key: 'targetUsers', label: 'Đối tượng người dùng mục tiêu (Who) - Phác họa 1-2 chân dung người dùng', type: 'textarea', placeholder: 'Ví dụ: HR Recruiter (Chị Lan, 28 tuổi, bận rộn xử lý 50 CV mỗi ngày...) và Hiring Manager (Anh Minh, Tech Lead, muốn xem CV ứng viên được chọn lọc kỹ...)' },
      { key: 'whyNow', label: 'Tại sao cần tập trung giải quyết ngay bây giờ (Why Now)?', type: 'textarea', placeholder: 'Nếu không làm thì ảnh hưởng thế nào đến năng suất, chi phí hay cơ hội của YODY?' },
      { key: 'solutionOverview', label: 'Sơ lược giải pháp đề xuất (Solution Overview)', type: 'textarea', placeholder: 'Cách tiếp cận cấu trúc hệ thống, dòng chạy tự động AI Agent giúp loại bỏ thao tác dư thừa ra sao...' },
      { key: 'scopeIn', label: 'Phạm vi bàn giao (Scope IN) - Các chức năng bắt buộc phải có trong MVP', type: 'textarea', placeholder: 'Liệt kê danh sách các tính năng thiết yếu sẽ trực tiếp xây dựng...' },
      { key: 'scopeOut', label: 'Phạm vi từ chối (Scope OUT) - Các chức năng sẽ tạm hoãn chưa làm', type: 'textarea', placeholder: 'Ghi rõ các tính năng nâng cao hoặc tích hợp rườm rà sẽ xử lý ở các phiên bản sau để tránh trễ hạn...' },
      { key: 'successMetrics', label: 'Chỉ số đo lường sự thành công (How Much)?', type: 'textarea', placeholder: 'Ví dụ: Giảm thời gian xử lý CV ứng viên từ 5 ngày xuống dưới 1 ngày; Điểm hài lòng của HR đạt 4.5/5...' },
      { key: 'techStack', label: 'Hệ công nghệ lựa chọn triển khai và lý do', type: 'textarea', placeholder: 'Sử dụng React, Tailwind CSS vì xây giao diện nhanh; Tích hợp Cursor và API Claude để viết code thần tốc...' }
    ]
  },
  {
    id: 'retro',
    title: '[TEMPLATE 02] SPRINT RETROSPECTIVE',
    description: 'Nhật ký tự soi chiếu sâu sắc được chép định kỳ 2 tuần một lần. Giúp Intern rèn luyện tư duy cải tiến, nhận thức blocker và tối ưu hóa việc sử dụng các đòn bẩy AI hiệu quả hơn.',
    fields: [
      { key: 'sprintNumber', label: 'Sprint số mấy & Khoảng thời gian thực hiện', type: 'text', placeholder: 'Ví dụ: Sprint #03 - Từ ngày 15/06 đến 29/06' },
      { key: 'shipped', label: 'Những thành tích/tính năng đã đóng gói (shipped) bàn giao thành công', type: 'textarea', placeholder: 'Liệt kê rành mạch các mã nguồn đã đưa lên staging hay tính năng chạy mượt...' },
      { key: 'unshipped', label: 'Những tính năng bị chậm trễ chưa bàn giao hoặc chưa đạt và nguyên nhân', type: 'textarea', placeholder: 'Thẳng thắn nhìn nhận những mục tiêu bị trượt hạn và phân tích sâu lý do thực sự...' },
      { key: 'blockers', label: 'Các điểm tắc nghẽn (Blockers) gặp phải - Đã giải quyết thế nào hay cần hỗ trợ?', type: 'textarea', placeholder: 'Rào cản về công nghệ lạ, sự không thống nhất yêu cầu, hay lỗi API sinh ra...' },
      { key: 'aiRatio', label: 'Tỷ lệ ứng dụng AI đòn bẩy (%) - Bao nhiêu % các chức năng được sinh ra từ AI assist?', type: 'text', placeholder: 'Sử dụng bao nhiêu % (Ví dụ: 80% nhờ code assisted bởi Cursor và Claude)' },
      { key: 'learnings', label: 'Bài học tri thức mới mẻ tự rút ra sau 2 tuần công tác', type: 'textarea', placeholder: 'Bài học sâu sắc về cách đặt prompt, cách thiết kế cơ sở dữ liệu hay kỹ năng thấu cảm stakeholder...' },
      { key: 'improvements', label: 'Hành động cụ thể sẽ thay đổi để làm tốt hơn ở Sprint tiếp theo là gì?', type: 'textarea', placeholder: 'Ví dụ: Trực tiếp thảo luận với Tech Lead sớm hơn; Chia nhỏ công việc để tránh over-engineer...' }
    ]
  },
  {
    id: 'interview',
    title: '[TEMPLATE 03] STAKEHOLDER INTERVIEW NOTES',
    description: 'Biên bản ghi chép chi tiết kết quả phỏng vấn lắng nghe nhu cầu thực từ người dùng cuối. Đây là dữ liệu thô vô cùng quý giá chống việc tự phỏng đoán cảm tính của lập trình viên.',
    fields: [
      { key: 'interviewerDate', label: 'Người thực hiện phỏng vấn & Ngày giờ phỏng vấn', type: 'text', placeholder: 'Ví dụ: Nguyễn Văn A - 10:00 sáng, 02/06/2026' },
      { key: 'stakeholderInfo', label: 'Thông tin Stakeholder: Họ tên, Chức vụ, Phòng ban phụ trách', type: 'text', placeholder: 'Ví dụ: Chị Nguyễn Hương Lan - Trưởng nhóm Tuyển dụng Công nghệ - Phòng HR' },
      { key: 'currentProcess', label: 'Bối cảnh hiện tại - Người dùng đang phải làm thủ công cụ thể như thế nào?', type: 'textarea', placeholder: 'Chi tiết luồng công tác cũ, tải file CV bằng tay, lọc file Excel rườm rà, dễ thất thoát...' },
      { key: 'painPoints', label: 'Nỗi đau nghiêm trọng hay gặp nhất (Pain points) - Ghi lại câu trích dẫn trực tiếp', type: 'textarea', placeholder: 'Ví dụ: "Tôi mất cả buổi chiều chỉ để copy thông tin ứng viên từ email vào file Excel quản lý chung..."' },
      { key: 'expectations', label: 'Kỳ vọng cốt lõi của họ đối với sản phẩm công nghệ mới', type: 'textarea', placeholder: 'Những tính năng giúp họ trực tiếp rũ bỏ gánh nặng lặp đi lặp lại...' },
      { key: 'constraints', label: 'Những quy tắc hoặc rào cản bắt buộc KHÔNG ĐƯỢC phép thay đổi', type: 'textarea', placeholder: 'Ví dụ: Quy trình phỏng vấn phải trải qua đầy đủ 3 vòng duyệt bắt buộc theo quy định chung...' },
      { key: 'insights', label: 'Điểm thấu hiểu bất ngờ nhất (Insight) bạn vỡ lẽ ra sau cuộc phỏng vấn', type: 'textarea', placeholder: 'Những phát hiện thực chất từ thực tế mà trước khi phỏng vấn bạn hoàn toàn chưa từng nghĩ đến...' }
    ]
  },
  {
    id: 'uat',
    title: '[TEMPLATE 04] UAT SIGN-OFF CHECKLIST',
    description: 'Biên bản thử nghiệm thực tế ký nhận chất lượng giữa Intern và người dùng cuối. Xác lập sản phẩm đã chạy thực tế an toàn sạch lỗi và sẵn sàng phục vụ quy trình thật.',
    fields: [
      { key: 'productPhase', label: 'Tên sản phẩm & Giai đoạn UAT (Kiểm duyệt lần 1 / Lần 2 / Tổng duyệt hay Bàn giao)', type: 'text', placeholder: 'Ví dụ: Hệ thống ATS - UAT Lần 2 (Chạy thử dòng kiểm tra hồ sơ)' },
      { key: 'uatDateParticipants', label: 'Ngày giờ tiến hành UAT & Danh sách các Stakeholders trực tiếp tham gia', type: 'text', placeholder: 'Ví dụ: 14:00 ngày 25/07 - Chị Lan (HR Lead), Anh Hoàng (Tech Lead)' },
      { key: 'testScenarios', label: 'Kịch bản kiểm thử đã chuẩn bị hành động cụ thể', type: 'textarea', placeholder: 'Ví dụ: 1. Đăng ký tài khoản HR; 2. Nộp CV ứng tuyển thử; 3. Thay đổi trạng thái ứng viên và kiểm tra thông báo...' },
      { key: 'bugList', label: 'Danh sách lỗi phát sinh trong buổi UAT (Phân rõ lỗi chí mạng P0, lỗi nặng P1, lỗi hiển thị P2)', type: 'textarea', placeholder: 'Ví dụ: Lỗi P0: Không tải lên được file CV định dạng docx lớn; Lỗi P2: Lệch font chữ nút Xác nhận...' },
      { key: 'fixedBugs', label: 'Tất cả các lỗi đã được sửa chữa triệt để trước khi người dùng đồng ý ký nhận', type: 'textarea', placeholder: 'Báo cáo chi tiết các lỗi P0, P1 đã được vá dứt điểm và kiểm thử lại mượt mà...' },
      { key: 'knownIssues', label: 'Các vấn đề nhỏ được phép chấp nhận bảo lưu để sửa chữa sau (nếu có)', type: 'textarea', placeholder: 'Ví dụ: Tính năng gửi email thông báo tự động phản hồi mất 30 giây để kích hoạt, sẽ tối ưu vào tuần sau...' }
    ]
  },
  {
    id: 'handover',
    title: '[TEMPLATE 05] HANDOVER DOCUMENT',
    description: 'Cuốn cẩm nang di sản bàn giao chuẩn chuyên nghiệp. Đảm bảo toàn bộ tri thức kỹ thuật, kiến trúc mã nguồn và luồng vận hành được ghi chép chỉn chu nhất để người kế tiếp tiếp quản lập tức mà không cần hỏi thêm bất kỳ câu nào.',
    fields: [
      { key: 'prodUrl', label: 'Tên sản phẩm chính thức & Đường dẫn phục vụ thực tế (Production URL)', type: 'text', placeholder: 'Ví dụ: YODY Recruiter ATS - https://recruit.yody.vn' },
      { key: 'architecture', label: 'Mô tả tổng quan kiến trúc kỹ thuật & Sơ đồ luồng xử lý chính', type: 'textarea', placeholder: 'Giải thích tầng dữ liệu Frontend React kết nối API Nodejs qua Fetch; Luồng Agent xử lý dữ liệu qua API như thế nào...' },
      { key: 'credentials', label: 'Cơ chế phân quyền & Cách thức truy cập quản lý tối cao (Tuyệt đối không chép password thật)', type: 'textarea', placeholder: 'Cách phân tài khoản quản trị Admin, cách xin cấp quyền truy cập Firebase hay GCP qua phân hệ an toàn...' },
      { key: 'maintenance', label: 'Hướng dẫn cụ thể các thao tác vận hành và kiểm tra lỗi hàng ngày (Step-by-Step)', type: 'textarea', placeholder: 'Quy trình khởi động dịch vụ, cách kết xuất log lỗi, cách sao lưu dữ liệu dự phòng rủi ro...' },
      { key: 'knownErrors', label: 'Các lỗi nghiệp vụ thường xảy ra bất ngờ và cách khôi phục nhanh nhất', type: 'textarea', placeholder: 'Ví dụ: Lỗi mất kết nối API Agent QC → Cách xử lý: Gửi lệnh reload container; Lỗi định dạng tệp tin → Gợi ý user lưu lại PDF...' },
      { key: 'techDebt', label: 'Các điểm nợ công nghệ (Tech debt) hoặc cải tiến dốc lực cần xử lý tiếp theo', type: 'textarea', placeholder: 'Các đoạn mã cần ghi đè tối ưu hiệu năng, cấu trúc cơ sở dữ liệu cần mở rộng trong tương lai...' },
      { key: 'contacts', label: 'Thông tin danh sách người liên hệ khẩn cấp khi hệ thống gặp sự cố', type: 'text', placeholder: 'Ví dụ: Nguyễn Văn A (Lập trình viên - SĐT: 0987.xxx.xxx); Trần Văn B (Ủy viên vận hành Cloud - SĐT: 0912.xxx.xxx)' }
    ]
  }
];
