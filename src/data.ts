import {
  CoachingMonth,
  CompetencyLevelDefinition,
  FinalScorecardGate,
  JournalTemplate,
  ProductDetail,
  ScorecardDefinition,
  SuccessProfileItem,
} from './types';

export const COMPETENCY_LEVELS: CompetencyLevelDefinition[] = [
  { level: 1, label: 'Cần hỗ trợ', description: 'Chưa thể hiện ổn định và cần mentor hướng dẫn trực tiếp.' },
  { level: 2, label: 'Đạt nền tảng', description: 'Thực hiện được với phạm vi rõ và một phần hỗ trợ.' },
  { level: 3, label: 'Đạt kỳ vọng Intern', description: 'Thực hiện độc lập trong phạm vi chương trình và có bằng chứng.' },
  { level: 4, label: 'Vượt kỳ vọng Intern', description: 'Thực hiện nhất quán, biết cải tiến và chia sẻ cách làm.' },
];

export const SUCCESS_PROFILE_DATA: SuccessProfileItem[] = [
  {
    key: 'user-problem-understanding',
    dimension: 'Hiểu người dùng và bài toán',
    description: 'Xác định đúng người dùng, vấn đề và kết quả cần tạo ra trước khi chọn giải pháp.',
    whyItMatters: 'Một prototype chỉ có giá trị khi giải quyết được nhu cầu đã được kiểm chứng, thay vì dựa trên phỏng đoán.',
    observableBehaviors: [
      'Trao đổi với người dùng hoặc stakeholder để hiểu bối cảnh thực tế.',
      'Viết được problem statement, nhóm người dùng và kết quả mong đợi.',
      'Phân biệt dữ kiện đã xác nhận với giả định cần kiểm chứng.',
    ],
    supportSignals: [
      'Mô tả giải pháp nhưng chưa nói rõ ai gặp vấn đề gì.',
      'Dùng ý kiến cá nhân thay cho phản hồi hoặc dữ liệu.',
      'Chưa thống nhất acceptance criteria với mentor hoặc stakeholder.',
    ],
    evidenceTemplateIds: ['problem-brief', 'user-feedback'],
  },
  {
    key: 'product-experimentation',
    dimension: 'Tư duy sản phẩm và thử nghiệm',
    description: 'Chia nhỏ giả định, làm prototype vừa đủ và cải tiến dựa trên phản hồi.',
    whyItMatters: 'Thử nghiệm nhỏ giúp học nhanh, kiểm soát phạm vi và giảm thời gian làm những tính năng chưa cần thiết.',
    observableBehaviors: [
      'Chọn phạm vi prototype gắn với acceptance criteria rõ ràng.',
      'Tổ chức demo hoặc thử nghiệm để nhận phản hồi sớm.',
      'Ghi lại điều đã học và thay đổi tiếp theo sau mỗi vòng thử.',
    ],
    supportSignals: [
      'Phạm vi tăng liên tục nhưng chưa có ưu tiên.',
      'Đợi sản phẩm hoàn chỉnh mới xin phản hồi.',
      'Thay đổi giải pháp mà không ghi lại lý do hoặc kết quả thử nghiệm.',
    ],
    evidenceTemplateIds: ['problem-brief', 'experiment-log', 'user-feedback'],
  },
  {
    key: 'ai-assisted-execution',
    dimension: 'Thực thi cùng AI',
    description: 'Dùng AI để tăng tốc nhưng vẫn kiểm chứng đầu ra, hiểu quyết định và bảo vệ dữ liệu.',
    whyItMatters: 'AI hữu ích khi người dùng chịu trách nhiệm về tính đúng đắn, bảo mật và khả năng giải thích của kết quả.',
    observableBehaviors: [
      'Chọn công việc phù hợp để AI hỗ trợ và cung cấp ngữ cảnh vừa đủ.',
      'Đọc, chạy thử và kiểm chứng nội dung hoặc mã do AI tạo.',
      'Không đưa mật khẩu, API key hoặc dữ liệu cá nhân nhạy cảm vào prompt.',
    ],
    supportSignals: [
      'Sử dụng đầu ra AI mà chưa kiểm tra.',
      'Không giải thích được phần quan trọng do AI đề xuất.',
      'Đưa dữ liệu thật vào công cụ AI khi chưa được phép.',
    ],
    evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
  },
  {
    key: 'learning-ownership',
    dimension: 'Chủ động học hỏi và chịu trách nhiệm',
    description: 'Tự quản lý bước tiếp theo, báo blocker sớm và biến phản hồi thành hành động.',
    whyItMatters: 'Chương trình cần Intern tiến bộ qua từng vòng làm việc, đồng thời để mentor hỗ trợ đúng lúc.',
    observableBehaviors: [
      'Lập kế hoạch ngắn, cập nhật tiến độ và nêu rõ bước tiếp theo.',
      'Tự thử các hướng hợp lý trước khi xin hỗ trợ.',
      'Báo blocker sớm kèm điều đã thử và hỗ trợ đang cần.',
    ],
    supportSignals: [
      'Không rõ ưu tiên hoặc bước tiếp theo.',
      'Giữ blocker quá lâu mà không trao đổi.',
      'Nhận phản hồi nhưng chưa chuyển thành hành động cụ thể.',
    ],
    evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
  },
  {
    key: 'collaboration-trust',
    dimension: 'Hợp tác và tin cậy',
    description: 'Giao tiếp rõ, tiếp nhận phản hồi và trung thực về tiến độ, giới hạn và bằng chứng.',
    whyItMatters: 'Prototype là kết quả phối hợp; Hội đồng cần tin rằng bằng chứng phản ánh đúng quá trình và kết quả thực tế.',
    observableBehaviors: [
      'Cập nhật ngắn gọn, đúng thời điểm cho người liên quan.',
      'Lắng nghe phản hồi, xác nhận điều đã hiểu và phản hồi bằng hành động.',
      'Ghi rõ giới hạn, lỗi còn lại và nguồn của bằng chứng.',
    ],
    supportSignals: [
      'Cập nhật muộn khiến người khác không thể hỗ trợ.',
      'Trình bày kết quả tích cực nhưng bỏ qua lỗi hoặc giới hạn.',
      'Phản hồi chưa được ghi nhận hoặc chưa có người chịu trách nhiệm tiếp theo.',
    ],
    evidenceTemplateIds: ['weekly-checkin', 'user-feedback', 'final-handover'],
  },
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

export const COACHING_LIFECYCLE_DATA: CoachingMonth[] = [
  {
    id: 'month-1',
    month: 1,
    title: 'Xây nền tảng',
    autonomy: 'Làm có hướng dẫn rõ và học cách khép kín vòng đầu tiên bằng bằng chứng thật.',
    targetLevel: 2,
    summary: 'Tháng 1 ưu tiên hiểu đúng bài toán, làm prototype nhỏ đầu tiên và tạo thói quen ghi lại evidence có thể đối chiếu.',
    steps: [
      {
        id: 'discover',
        title: 'Discover',
        question: 'Ai đang gặp vấn đề gì và dữ kiện nào xác nhận điều đó?',
        actions: [
          'Chốt một problem brief ngắn với người dùng, bối cảnh và kết quả mong đợi.',
          'Phân biệt điều đã xác nhận với giả định còn cần kiểm chứng.',
          'Thống nhất acceptance criteria đủ nhỏ cho vòng thử đầu tiên.',
        ],
        competencyIds: ['user-problem-understanding', 'product-experimentation'],
        evidenceTemplateIds: ['problem-brief', 'user-feedback'],
      },
      {
        id: 'build',
        title: 'Build',
        question: 'Phiên bản nhỏ nhất nào giúp kiểm chứng giả định nhanh nhất?',
        actions: [
          'Dựng prototype hoặc flow tối thiểu thay vì làm đầy đủ tính năng.',
          'Chọn phần việc phù hợp để AI hỗ trợ nhưng vẫn tự đọc lại đầu ra.',
          'Giữ scope đủ hẹp để có thể demo trong tuần.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution'],
        evidenceTemplateIds: ['problem-brief', 'weekly-checkin', 'experiment-log'],
      },
      {
        id: 'validate',
        title: 'Validate',
        question: 'Kết quả nào đạt, chưa đạt và vì sao?',
        actions: [
          'Chạy thử với dữ liệu hoặc luồng sử dụng gần thực tế.',
          'Ghi rõ lỗi, điểm chưa đạt và điều gì cần mentor hỗ trợ.',
          'Đối chiếu trực tiếp với acceptance criteria đã chốt.',
        ],
        competencyIds: ['product-experimentation', 'learning-ownership'],
        evidenceTemplateIds: ['experiment-log', 'weekly-checkin'],
      },
      {
        id: 'ship',
        title: 'Ship',
        question: 'Ai có thể xem, dùng thử hoặc tiếp tục với đầu ra hiện tại?',
        actions: [
          'Chuẩn bị link demo hoặc bản trình bày đủ để người khác tự xem.',
          'Ghi lại hướng dẫn truy cập và phạm vi hiện tại.',
          'Nêu trung thực điều chưa làm, chưa ổn hoặc còn đang giả lập.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['weekly-checkin', 'final-handover'],
      },
      {
        id: 'learn',
        title: 'Learn',
        question: 'Sau vòng đầu tiên, cách hiểu và cách làm của bạn đã thay đổi gì?',
        actions: [
          'Viết ngắn điều đã học, điều cần bỏ và điều sẽ thử tiếp.',
          'Biến feedback thành một quyết định rõ cho vòng tháng sau.',
          'Xác định năng lực nào còn cần hỗ trợ nhiều nhất.',
        ],
        competencyIds: ['learning-ownership', 'collaboration-trust'],
        evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
      },
    ],
    competencyTargets: [
      {
        competencyId: 'user-problem-understanding',
        targetLevel: 2,
        focus: 'Mô tả được người dùng, vấn đề và bằng chứng nền tảng thay vì bắt đầu từ giải pháp.',
      },
      {
        competencyId: 'product-experimentation',
        targetLevel: 2,
        focus: 'Thu hẹp phạm vi prototype và xác định acceptance criteria có thể kiểm tra.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 2,
        focus: 'Dùng AI để tăng tốc tác vụ nhỏ nhưng luôn đọc lại và tự kiểm chứng.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 2,
        focus: 'Báo tiến độ, blocker và bước tiếp theo đúng lúc thay vì chờ được hỏi.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 2,
        focus: 'Giao tiếp rõ phạm vi, giới hạn và nguồn bằng chứng với mentor hoặc stakeholder.',
      },
    ],
    coachingCadence: [
      'Check-in đầu tuần để chốt phạm vi prototype và điều cần xác nhận.',
      'Demo ngắn giữa tuần để nhận phản hồi sớm khi scope vẫn còn nhỏ.',
      'Retro cuối tuần tập trung vào điều học được và blocker cần hỗ trợ.',
    ],
    monthlyGate: [
      'Có một problem brief và acceptance criteria đã thống nhất.',
      'Demo được vòng đầu tiên với evidence tối thiểu trong Journal.',
      'Nêu rõ điều đã học và bước tiếp theo cho tháng 2.',
    ],
  },
  {
    id: 'month-2',
    month: 2,
    title: 'Làm chủ vòng lặp',
    autonomy: 'Chủ động hơn trong phạm vi đã rõ, tự chạy nhiều vòng thử và dùng feedback để ưu tiên.',
    targetLevel: 3,
    summary: 'Tháng 2 không còn chỉ hoàn thành một vòng, mà cần lặp lại chu trình Discover → Learn nhiều lần với chất lượng bằng chứng tốt hơn.',
    steps: [
      {
        id: 'discover',
        title: 'Discover',
        question: 'Sau vòng đầu tiên, đâu là giả định quan trọng nhất còn lại?',
        actions: [
          'Đọc lại feedback và chọn một giả định có giá trị học cao nhất.',
          'Ưu tiên vấn đề theo tác động thay vì làm mọi yêu cầu cùng lúc.',
          'Chốt câu hỏi kiểm chứng rõ cho vòng thử tiếp theo.',
        ],
        competencyIds: ['user-problem-understanding', 'product-experimentation'],
        evidenceTemplateIds: ['user-feedback', 'experiment-log'],
      },
      {
        id: 'build',
        title: 'Build',
        question: 'Bạn cần thay đổi điều gì để kiểm chứng giả định tiếp theo nhanh hơn?',
        actions: [
          'Cắt bỏ phần chưa cần thiết và chỉ giữ thay đổi phục vụ câu hỏi hiện tại.',
          'Dùng AI như cộng sự để tăng tốc phân tích, viết thử và tạo test case.',
          'Giữ luồng demo ổn định để người dùng phản hồi đúng phần trọng tâm.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution'],
        evidenceTemplateIds: ['weekly-checkin', 'experiment-log'],
      },
      {
        id: 'validate',
        title: 'Validate',
        question: 'Feedback mới xác nhận điều gì và bác bỏ điều gì?',
        actions: [
          'Thu ít nhất một vòng phản hồi có nguồn rõ hoặc dữ liệu kiểm thử cụ thể.',
          'So sánh kết quả mới với kết quả của vòng trước.',
          'Nêu rõ vì sao giữ nguyên, sửa tiếp hoặc dừng một hướng làm.',
        ],
        competencyIds: ['user-problem-understanding', 'product-experimentation', 'collaboration-trust'],
        evidenceTemplateIds: ['user-feedback', 'experiment-log'],
      },
      {
        id: 'ship',
        title: 'Ship',
        question: 'Ai cần được cập nhật để tiếp tục tin tưởng và hỗ trợ vòng tiếp theo?',
        actions: [
          'Chia sẻ bản demo đang chạy và trạng thái đạt hoặc chưa đạt của từng tiêu chí.',
          'Đồng bộ lại kỳ vọng với mentor hoặc stakeholder trước khi mở rộng scope.',
          'Ghi chú cách truy cập, dữ liệu mẫu và giới hạn hiện tại.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['weekly-checkin', 'final-handover'],
      },
      {
        id: 'learn',
        title: 'Learn',
        question: 'Bạn đã thay đổi cách ra quyết định sản phẩm như thế nào sau nhiều vòng thử?',
        actions: [
          'Tóm tắt pattern feedback lặp lại và bài học quan trọng nhất.',
          'Chỉ ra một cách làm hiệu quả hơn mà bạn sẽ lặp lại ở tháng 3.',
          'Cập nhật năng lực nào đã tiến gần Level 3 và năng lực nào còn cần đẩy tiếp.',
        ],
        competencyIds: ['learning-ownership', 'product-experimentation'],
        evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
      },
    ],
    competencyTargets: [
      {
        competencyId: 'user-problem-understanding',
        targetLevel: 3,
        focus: 'Chủ động xác nhận lại vấn đề sau mỗi vòng feedback và phân biệt được tín hiệu mạnh yếu.',
      },
      {
        competencyId: 'product-experimentation',
        targetLevel: 3,
        focus: 'Thiết kế vòng thử có mục tiêu rõ, biết chọn tradeoff giữa tốc độ và giá trị học.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 3,
        focus: 'Biết giao đúng việc cho AI, kiểm tra đầu ra và giữ chất lượng prototype ổn định.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 3,
        focus: 'Quản lý được cam kết cá nhân, blocker và nhịp cải tiến mà không chờ nhắc.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 3,
        focus: 'Cập nhật trung thực tiến độ, rủi ro và bằng chứng để tạo niềm tin khi phối hợp.',
      },
    ],
    coachingCadence: [
      'Weekly check-in tập trung vào giả định ưu tiên và cách đo kết quả.',
      'Một buổi feedback có người dùng hoặc stakeholder cho mỗi vòng thử quan trọng.',
      'Review cuối tuần so sánh thay đổi giữa các vòng và chốt hướng đi tiếp.',
    ],
    monthlyGate: [
      'Có ít nhất một vòng feedback hoặc kiểm chứng mới dẫn tới thay đổi rõ trong prototype.',
      'Competency target chính đã tiến gần Level 3 với bằng chứng cụ thể.',
      'Mọi cập nhật phạm vi đều có lý do dựa trên dữ liệu hoặc phản hồi.',
    ],
  },
  {
    id: 'month-3',
    month: 3,
    title: 'Tạo impact và bàn giao',
    autonomy: 'Chịu trách nhiệm rõ hơn với đầu ra, demo, handover và tác động của quyết định sản phẩm.',
    targetLevel: 3,
    summary: 'Tháng 3 hướng tới mức hoàn thành chuẩn Intern: prototype rõ giá trị, có bằng chứng kiểm chứng, có thể demo và bàn giao, đồng thời bắt đầu xuất hiện tín hiệu Level 4.',
    steps: [
      {
        id: 'discover',
        title: 'Discover',
        question: 'Điều gì là quan trọng nhất để prototype tạo impact ở vòng cuối?',
        actions: [
          'Chốt vấn đề ưu tiên cuối cùng dựa trên evidence đã tích lũy.',
          'Làm rõ ai sẽ dùng, đánh giá hoặc tiếp tục với đầu ra này.',
          'Xác định tiêu chí nghiệm thu cuối và các giới hạn phải nói rõ.',
        ],
        competencyIds: ['user-problem-understanding', 'collaboration-trust'],
        evidenceTemplateIds: ['problem-brief', 'user-feedback', 'final-handover'],
      },
      {
        id: 'build',
        title: 'Build',
        question: 'Phiên bản nào đủ tốt để người khác dùng thử hoặc review nghiêm túc?',
        actions: [
          'Ổn định luồng chính và loại bớt phần gây nhiễu cho demo cuối.',
          'Dùng AI để tăng tốc tài liệu hóa, test case hoặc cleanup có kiểm soát.',
          'Giữ mọi quyết định scope bám sát giá trị và bằng chứng.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution', 'learning-ownership'],
        evidenceTemplateIds: ['experiment-log', 'weekly-checkin', 'final-handover'],
      },
      {
        id: 'validate',
        title: 'Validate',
        question: 'Prototype đã thực sự đạt acceptance criteria và phản hồi cuối chưa?',
        actions: [
          'Đối chiếu lại từng acceptance criterion với bằng chứng hiện có.',
          'Tổng hợp feedback cuối cùng cùng các giới hạn hoặc rủi ro còn lại.',
          'Kiểm tra khả năng truy cập, tính rõ ràng và mức sẵn sàng bàn giao.',
        ],
        competencyIds: ['product-experimentation', 'collaboration-trust'],
        evidenceTemplateIds: ['user-feedback', 'experiment-log', 'final-handover'],
      },
      {
        id: 'ship',
        title: 'Ship',
        question: 'Người khác có thể xem, hiểu và tiếp tục với kết quả của bạn không?',
        actions: [
          'Chuẩn bị demo, hướng dẫn truy cập và note handover ngắn gọn.',
          'Nêu rõ điều đã đạt, chưa đạt và phần cần tiếp tục sau chương trình.',
          'Đảm bảo bằng chứng và thông tin bàn giao trung thực, dễ kiểm tra.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['final-handover', 'weekly-checkin'],
      },
      {
        id: 'learn',
        title: 'Learn',
        question: 'Bạn đã trở thành Product Builder tốt hơn ở điểm nào sau ba tháng?',
        actions: [
          'Kết nối bài học từ cả ba tháng thành một narrative phát triển rõ ràng.',
          'Chỉ ra thói quen hoặc cách làm mới mà bạn muốn giữ lâu dài.',
          'Nhận diện tín hiệu vượt kỳ vọng để tiếp tục phát triển sau chương trình.',
        ],
        competencyIds: ['learning-ownership', 'collaboration-trust', 'ai-assisted-execution'],
        evidenceTemplateIds: ['final-handover', 'experiment-log'],
      },
    ],
    competencyTargets: [
      {
        competencyId: 'user-problem-understanding',
        targetLevel: 3,
        focus: 'Ra quyết định dựa trên bằng chứng tích lũy và biết chỉ ra vấn đề nào tạo impact thực sự.',
      },
      {
        competencyId: 'product-experimentation',
        targetLevel: 3,
        focus: 'Khóa được phạm vi cuối, chứng minh kết quả với acceptance criteria và phản hồi thật.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 3,
        focus: 'Dùng AI có phán đoán, giải thích được quyết định và tự kiểm tra chất lượng đầu ra.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 3,
        focus: 'Chủ động quản lý timeline, handover và các bước tiếp theo sau chương trình.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 3,
        focus: 'Tạo niềm tin qua demo rõ ràng, bằng chứng kiểm tra được và giao tiếp trung thực.',
      },
    ],
    coachingCadence: [
      'Review đầu tuần để khóa mục tiêu demo và phần evidence còn thiếu.',
      'Dry run giữa tuần cho demo, handover và câu chuyện phát triển qua ba tháng.',
      'Buổi tổng kết cuối tháng đối chiếu scorecard, evidence và bước phát triển tiếp theo.',
    ],
    monthlyGate: [
      'Prototype demo được, có bằng chứng đối chiếu acceptance criteria.',
      'Handover đủ rõ để người khác truy cập, hiểu giới hạn và tiếp tục được.',
      'Xuất hiện tín hiệu Level 4 ở ít nhất một vài hành vi, nhưng gate chính vẫn là chuẩn Level 3 của Intern.',
    ],
    futureSignals: [
      'Biết đề xuất tradeoff giữa tác động kinh doanh và chi phí thực thi.',
      'Tự tổ chức nhịp làm việc, phản tư và điều chỉnh cách phối hợp với stakeholder.',
      'Chia sẻ lại cách làm hiệu quả cho người khác thay vì chỉ hoàn thành phần việc của mình.',
    ],
  },
];

export const ENTRY_SCORECARD_DATA: ScorecardDefinition = {
  id: 'entry',
  title: 'Scorecard đánh giá đầu vào',
  description: 'Đánh giá tiềm năng học tập, khả năng làm prototype và mức phù hợp với cách làm việc của chương trình.',
  audienceNote: 'Đây là khuyến nghị cho Hội đồng tuyển chọn, không phải quyết định tự động.',
  categories: [
    {
      id: 'entry-role-outcome', name: 'Hiểu vai trò và đầu ra chương trình', description: 'Ứng viên hiểu phạm vi Intern Product Builder và chuẩn một prototype.', points: 15,
      criteria: [
        {
          id: 'entry-role-clarity', name: 'Hiểu vai trò và đầu ra', description: 'Diễn giải được mục tiêu chương trình, vai trò của feedback và acceptance criteria.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['problem-brief'], levels: {
            1: 'Chưa mô tả được đầu ra hoặc kỳ vọng của chương trình.',
            2: 'Hiểu cần làm prototype nhưng còn mơ hồ về người dùng và bằng chứng.',
            3: 'Nêu rõ một prototype, phản hồi người dùng, acceptance criteria và trách nhiệm của Intern.',
            4: 'Ngoài mức 3, biết đề xuất cách chia giai đoạn học và kiểm chứng kết quả.',
          }
        },
      ],
    },
    {
      id: 'entry-problem-prototype', name: 'Giải quyết vấn đề và làm prototype', description: 'Quan sát cách ứng viên hiểu vấn đề, thu hẹp phạm vi và thử giải pháp.', points: 30,
      criteria: [
        {
          id: 'entry-problem-framing', name: 'Hiểu và cấu trúc vấn đề', description: 'Xác định người dùng, nhu cầu và giả định cần kiểm chứng.', points: 15, competencyIds: ['user-problem-understanding'], evidenceTemplateIds: ['problem-brief', 'user-feedback'], levels: {
            1: 'Bắt đầu từ giải pháp và chưa xác định người dùng cụ thể.',
            2: 'Nêu được vấn đề cơ bản nhưng bằng chứng và phạm vi còn chưa rõ.',
            3: 'Cấu trúc được người dùng, vấn đề, dữ kiện và giả định cần kiểm chứng.',
            4: 'Ngoài mức 3, biết ưu tiên vấn đề theo tác động và khả năng kiểm chứng.',
          }
        },
        {
          id: 'entry-prototype-thinking', name: 'Tư duy prototype và thử nghiệm', description: 'Chọn một cách thử nhỏ để học trước khi mở rộng.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['experiment-log'], levels: {
            1: 'Đề xuất phạm vi lớn nhưng chưa có cách kiểm tra.',
            2: 'Có ý tưởng prototype nhưng acceptance criteria còn chung chung.',
            3: 'Đề xuất prototype vừa đủ, tiêu chí nghiệm thu và cách lấy phản hồi.',
            4: 'Ngoài mức 3, dự đoán rủi ro và thiết kế vòng lặp cải tiến hợp lý.',
          }
        },
      ],
    },
    {
      id: 'entry-ai-learning', name: 'Học và sử dụng AI có kiểm soát', description: 'Đánh giá khả năng học công cụ và kiểm chứng đầu ra AI.', points: 20,
      criteria: [
        {
          id: 'entry-ai-judgment', name: 'Sử dụng AI có trách nhiệm', description: 'Biết chọn việc phù hợp cho AI, kiểm tra kết quả và bảo vệ dữ liệu.', points: 20, competencyIds: ['ai-assisted-execution'], evidenceTemplateIds: ['weekly-checkin', 'experiment-log'], levels: {
            1: 'Phụ thuộc vào đầu ra AI và chưa nêu cách kiểm chứng.',
            2: 'Biết cần kiểm tra nhưng cách kiểm tra hoặc bảo vệ dữ liệu còn hạn chế.',
            3: 'Mô tả rõ cách cung cấp ngữ cảnh, kiểm thử đầu ra và tránh dữ liệu nhạy cảm.',
            4: 'Ngoài mức 3, biết so sánh phương án và ghi lại giới hạn của AI.',
          }
        },
      ],
    },
    {
      id: 'entry-motivation', name: 'Động lực và cam kết', description: 'Quan sát cách ứng viên tự học, quản lý thời gian và tìm hỗ trợ.', points: 15,
      criteria: [
        {
          id: 'entry-learning-ownership', name: 'Chủ động học và cam kết', description: 'Có ví dụ về tự học, xử lý blocker và duy trì cam kết.', points: 15, competencyIds: ['learning-ownership'], evidenceTemplateIds: ['weekly-checkin'], levels: {
            1: 'Chưa có ví dụ cụ thể hoặc phụ thuộc hoàn toàn vào hướng dẫn.',
            2: 'Có nỗ lực học nhưng kế hoạch và cách báo blocker chưa rõ.',
            3: 'Có ví dụ cụ thể về tự học, quản lý cam kết và xin hỗ trợ đúng lúc.',
            4: 'Ngoài mức 3, biết tự phản tư và điều chỉnh cách học sau phản hồi.',
          }
        },
      ],
    },
    {
      id: 'entry-core-fit', name: 'Phù hợp năng lực cốt lõi YODY', description: 'Đánh giá hợp tác, trung thực và tiếp nhận phản hồi.', points: 20,
      criteria: [
        {
          id: 'entry-collaboration', name: 'Hợp tác và tin cậy', description: 'Giao tiếp rõ, tôn trọng bằng chứng và phản hồi xây dựng.', points: 20, competencyIds: ['collaboration-trust'], evidenceTemplateIds: ['user-feedback', 'weekly-checkin'], levels: {
            1: 'Khó tiếp nhận phản hồi hoặc trình bày thiếu nhất quán.',
            2: 'Hợp tác được khi có hướng dẫn nhưng phản hồi còn thụ động.',
            3: 'Lắng nghe, làm rõ, phản hồi trung thực và thống nhất bước tiếp theo.',
            4: 'Ngoài mức 3, giúp cuộc trao đổi tập trung vào vấn đề và bằng chứng.',
          }
        },
      ],
    },
  ],
  resultBands: [
    { minScore: 80, label: 'Phù hợp rõ', description: 'Có đủ tín hiệu để đề xuất vào chương trình.' },
    { minScore: 65, label: 'Phù hợp, cần làm rõ thêm', description: 'Cần làm rõ một số điểm trong phỏng vấn hoặc bài thử.' },
    { minScore: 50, label: 'Chưa đủ bằng chứng', description: 'Cần bài thử hoặc vòng đánh giá bổ sung.' },
    { minScore: 0, label: 'Chưa phù hợp với kỳ vọng hiện tại', description: 'Bằng chứng hiện tại chưa đáp ứng yêu cầu đầu vào.' },
  ],
};

export const FINAL_SCORECARD_DATA: ScorecardDefinition = {
  id: 'final',
  title: 'Scorecard đánh giá cuối kỳ',
  description: 'Đối chiếu kết quả một prototype, năm năng lực cốt lõi và bằng chứng trong suốt chương trình.',
  audienceNote: 'Scorecard là đầu vào cho quyết định của Hội đồng, không tự động quyết định tuyển dụng.',
  categories: [
    {
      id: 'final-prototype', name: 'Kết quả prototype', description: 'Chất lượng đầu ra và mức kiểm chứng với người dùng.', points: 45,
      criteria: [
        { id: 'final-problem', name: 'Hiểu vấn đề cần giải quyết', description: 'Bài toán, người dùng và phạm vi được xác nhận.', points: 10, competencyIds: ['user-problem-understanding'], evidenceTemplateIds: ['problem-brief', 'user-feedback'], levels: { 1: 'Bài toán còn mơ hồ hoặc dựa chủ yếu trên phỏng đoán.', 2: 'Có mô tả người dùng và vấn đề nhưng bằng chứng còn hạn chế.', 3: 'Bài toán, người dùng, phạm vi và giả định được xác nhận bằng bằng chứng.', 4: 'Ngoài mức 3, chỉ ra được thay đổi trong hiểu biết sau các vòng phản hồi.' } },
        { id: 'final-acceptance', name: 'Đạt acceptance criteria', description: 'Prototype đáp ứng tiêu chí đã thống nhất và demo được.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['problem-brief', 'experiment-log'], levels: { 1: 'Không có tiêu chí rõ hoặc prototype chưa demo được.', 2: 'Demo được một phần nhưng còn tiêu chí quan trọng chưa đạt.', 3: 'Đạt các acceptance criteria đã thống nhất và có bằng chứng kiểm tra.', 4: 'Ngoài mức 3, xử lý tốt trường hợp biên và giải thích các quyết định phạm vi.' } },
        { id: 'final-feedback', name: 'Feedback và cải tiến', description: 'Thu phản hồi thật và dùng phản hồi để cải tiến prototype.', points: 10, competencyIds: ['user-problem-understanding', 'product-experimentation'], evidenceTemplateIds: ['user-feedback', 'experiment-log'], levels: { 1: 'Chưa có phản hồi từ người dùng hoặc stakeholder.', 2: 'Có phản hồi nhưng chưa thể hiện thay đổi hoặc quyết định tiếp theo.', 3: 'Có ít nhất hai vòng phản hồi hoặc xác nhận stakeholder và cải tiến tương ứng.', 4: 'Ngoài mức 3, phân tích được mẫu phản hồi và ưu tiên thay đổi có lý do.' } },
        { id: 'final-handover', name: 'Demo, tài liệu và bàn giao', description: 'Người khác có thể hiểu, truy cập và tiếp tục làm việc với prototype.', points: 10, competencyIds: ['collaboration-trust'], evidenceTemplateIds: ['final-handover'], levels: { 1: 'Thiếu demo hoặc thông tin bàn giao thiết yếu.', 2: 'Có demo và hướng dẫn cơ bản nhưng còn phụ thuộc giải thích trực tiếp.', 3: 'Demo rõ, tài liệu đủ để truy cập, kiểm thử và hiểu giới hạn.', 4: 'Ngoài mức 3, tài liệu súc tích, dễ tiếp tục và nêu rõ đề xuất tiếp theo.' } },
      ],
    },
    {
      id: 'final-competencies', name: 'Năng lực cốt lõi', description: 'Năm năng lực được quan sát qua quá trình làm sản phẩm.', points: 35,
      criteria: [
        { id: 'final-user-understanding', name: 'Hiểu người dùng và bài toán', description: 'Làm việc dựa trên nhu cầu và dữ kiện.', points: 8, competencyIds: ['user-problem-understanding'], evidenceTemplateIds: ['problem-brief', 'user-feedback'], levels: { 1: 'Cần mentor xác định hầu hết vấn đề và người dùng.', 2: 'Hiểu nền tảng khi có câu hỏi định hướng.', 3: 'Chủ động xác nhận vấn đề và phân biệt dữ kiện với giả định.', 4: 'Nhất quán cập nhật hiểu biết và giúp nhóm ra quyết định dựa trên bằng chứng.' } },
        { id: 'final-experimentation', name: 'Tư duy sản phẩm và thử nghiệm', description: 'Thu hẹp phạm vi, thử và học có hệ thống.', points: 8, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['experiment-log'], levels: { 1: 'Cần hỗ trợ nhiều để chọn phạm vi và cách thử.', 2: 'Thực hiện được thử nghiệm khi phạm vi đã rõ.', 3: 'Chủ động thiết kế vòng thử, đo kết quả và cải tiến.', 4: 'Nhất quán chọn thử nghiệm có giá trị học cao và giải thích được tradeoff.' } },
        { id: 'final-ai-execution', name: 'Thực thi cùng AI', description: 'Dùng AI hiệu quả, kiểm chứng và an toàn.', points: 7, competencyIds: ['ai-assisted-execution'], evidenceTemplateIds: ['weekly-checkin', 'experiment-log'], levels: { 1: 'Dùng đầu ra AI nhưng chưa kiểm chứng hoặc chưa hiểu phần quan trọng.', 2: 'Kiểm tra được các đầu ra cơ bản khi có hướng dẫn.', 3: 'Chọn đúng việc, kiểm thử đầu ra và bảo vệ dữ liệu.', 4: 'Ngoài mức 3, so sánh phương án và ghi lại giới hạn để cải thiện cách làm.' } },
        { id: 'final-ownership', name: 'Học hỏi và ownership', description: 'Quản lý tiến độ, blocker và phản hồi.', points: 6, competencyIds: ['learning-ownership'], evidenceTemplateIds: ['weekly-checkin', 'final-handover'], levels: { 1: 'Thường chờ phân việc hoặc báo blocker muộn.', 2: 'Hoàn thành việc rõ phạm vi và báo cáo khi được hỏi.', 3: 'Chủ động bước tiếp theo, báo blocker sớm và chuyển phản hồi thành hành động.', 4: 'Nhất quán tự điều chỉnh kế hoạch và chia sẻ bài học hữu ích.' } },
        { id: 'final-collaboration', name: 'Hợp tác và tin cậy', description: 'Giao tiếp trung thực, rõ ràng và có trách nhiệm.', points: 6, competencyIds: ['collaboration-trust'], evidenceTemplateIds: ['user-feedback', 'final-handover'], levels: { 1: 'Thông tin thiếu hoặc không nhất quán làm cản trở phối hợp.', 2: 'Phối hợp được trong nhịp làm việc đã có cấu trúc.', 3: 'Cập nhật đúng lúc, tiếp nhận phản hồi và nêu rõ giới hạn.', 4: 'Tạo được niềm tin qua bằng chứng rõ và hỗ trợ phối hợp hiệu quả.' } },
      ],
    },
    {
      id: 'final-process', name: 'Quá trình và bằng chứng', description: 'Chất lượng Journal, giao tiếp và tự phản tư.', points: 20,
      criteria: [
        { id: 'final-journal', name: 'Journal và bằng chứng', description: 'Các template cần thiết được điền bằng dữ kiện có thể đối chiếu.', points: 8, competencyIds: ['learning-ownership', 'collaboration-trust'], evidenceTemplateIds: ['problem-brief', 'weekly-checkin', 'user-feedback', 'experiment-log', 'final-handover'], levels: { 1: 'Journal thiếu phần lớn nội dung hoặc chỉ có nhận định chung.', 2: 'Có ghi chép cơ bản nhưng thiếu link, kết quả hoặc nguồn phản hồi.', 3: 'Journal đầy đủ phần cần thiết và có bằng chứng đối chiếu được.', 4: 'Ngoài mức 3, ghi chép súc tích và cho thấy rõ tiến trình học qua thời gian.' } },
        { id: 'final-communication', name: 'Giao tiếp và blocker', description: 'Tiến độ, rủi ro và nhu cầu hỗ trợ được thông báo đúng lúc.', points: 6, competencyIds: ['learning-ownership', 'collaboration-trust'], evidenceTemplateIds: ['weekly-checkin'], levels: { 1: 'Blocker hoặc thay đổi quan trọng không được cập nhật kịp thời.', 2: 'Có cập nhật theo lịch nhưng đôi lúc thiếu bước tiếp theo.', 3: 'Cập nhật rõ tiến độ, blocker, điều đã thử và hỗ trợ cần thiết.', 4: 'Ngoài mức 3, chủ động điều chỉnh cách giao tiếp theo người liên quan.' } },
        { id: 'final-reflection', name: 'Tiếp nhận feedback và tự phản tư', description: 'Biến phản hồi thành thay đổi cụ thể và rút ra bài học.', points: 6, competencyIds: ['product-experimentation', 'learning-ownership'], evidenceTemplateIds: ['user-feedback', 'experiment-log', 'final-handover'], levels: { 1: 'Khó chỉ ra phản hồi đã nhận hoặc thay đổi sau phản hồi.', 2: 'Tiếp nhận phản hồi nhưng hành động cải tiến còn chung chung.', 3: 'Nêu rõ phản hồi, quyết định, thay đổi và điều học được.', 4: 'Ngoài mức 3, nhận ra mẫu lặp lại và điều chỉnh phương pháp làm việc.' } },
      ],
    },
  ],
  resultBands: [
    { minScore: 80, label: 'Vượt kỳ vọng Intern', description: 'Kết quả và quá trình vượt chuẩn chương trình.' },
    { minScore: 65, label: 'Đạt chương trình', description: 'Đáp ứng chuẩn đầu ra của Intern Product Builder.' },
    { minScore: 50, label: 'Chưa đạt, cần kế hoạch bổ sung', description: 'Cần bổ sung bằng chứng hoặc cải thiện các tiêu chí còn thiếu.' },
    { minScore: 0, label: 'Không đạt', description: 'Chưa đáp ứng chuẩn đầu ra hiện tại.' },
  ],
};

export const FINAL_SCORECARD_GATES: FinalScorecardGate[] = [
  { id: 'prototype-accessible', label: 'Có một prototype truy cập hoặc demo được', description: 'Hội đồng có thể mở hoặc xem demo luồng chính.' },
  { id: 'acceptance-evidence', label: 'Acceptance criteria đã thống nhất và có bằng chứng đạt', description: 'Kết quả kiểm tra được đối chiếu với tiêu chí đã chốt.' },
  { id: 'feedback-evidence', label: 'Có tối thiểu hai vòng feedback hoặc một stakeholder xác nhận', description: 'Phản hồi có nguồn và thể hiện tác động tới sản phẩm.' },
  { id: 'integrity-safety', label: 'Bằng chứng trung thực và dữ liệu được sử dụng an toàn', description: 'Không làm giả kết quả, che giấu lỗi hoặc dùng dữ liệu trái quy định.' },
  { id: 'council-confirmed', label: 'Hội đồng xác nhận kết quả đạt', description: 'Kết luận cuối cùng cần được Hội đồng đối chiếu và xác nhận.' },
];

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'problem-brief', title: '01. Problem & Outcome Brief', description: 'Chốt người dùng, vấn đề, phạm vi prototype và cách biết kết quả đã đạt.', whenToUse: 'Điền ở đầu chương trình và cập nhật khi hiểu biết về bài toán thay đổi.', minimumEvidence: ['Nguồn xác nhận vấn đề', 'Acceptance criteria đã thống nhất', 'Link tài liệu hoặc prototype nếu có'], competencyIds: ['user-problem-understanding', 'product-experimentation'],
    fields: [
      { key: 'productName', label: 'Tên prototype', type: 'text', placeholder: 'Ví dụ: Công cụ tổng hợp phản hồi cửa hàng', required: true },
      { key: 'problem', label: 'Người dùng đang gặp vấn đề gì?', type: 'textarea', placeholder: 'Mô tả người dùng, bối cảnh và vấn đề đã quan sát...', required: true },
      { key: 'evidence', label: 'Bằng chứng ban đầu', type: 'textarea', placeholder: 'Nguồn phỏng vấn, dữ liệu, link hoặc ghi chú xác nhận...', required: true },
      { key: 'outcome', label: 'Kết quả mong đợi', type: 'textarea', placeholder: 'Điều gì sẽ tốt hơn cho người dùng nếu prototype có ích?', required: true },
      { key: 'acceptanceCriteria', label: 'Acceptance criteria', type: 'textarea', placeholder: 'Liệt kê 2-4 tiêu chí có thể kiểm tra...', required: true },
      { key: 'scope', label: 'Phạm vi làm và chưa làm', type: 'textarea', placeholder: 'Nêu phạm vi prototype và phần chủ động để ngoài scope...', required: true },
    ],
  },
  {
    id: 'weekly-checkin', title: '02. Weekly Plan & Check-in', description: 'Theo dõi cam kết ngắn hạn, tiến độ, blocker và nhu cầu hỗ trợ.', whenToUse: 'Điền đầu tuần và cập nhật trước buổi check-in với mentor.', minimumEvidence: ['Link công việc hoặc bản demo', 'Trạng thái cam kết', 'Blocker và điều đã thử'], competencyIds: ['ai-assisted-execution', 'learning-ownership', 'collaboration-trust'],
    fields: [
      { key: 'period', label: 'Tuần và khoảng thời gian', type: 'text', placeholder: 'Ví dụ: Tuần 3, 15/06-19/06', required: true },
      { key: 'commitments', label: 'Cam kết và kết quả mong đợi', type: 'textarea', placeholder: 'Tối đa ba kết quả cụ thể của tuần...', required: true },
      { key: 'progress', label: 'Tiến độ và bằng chứng', type: 'textarea', placeholder: 'Đã hoàn thành gì? Kèm link hoặc kết quả kiểm tra...', required: true },
      { key: 'blockers', label: 'Blocker, điều đã thử và hỗ trợ cần thiết', type: 'textarea', placeholder: 'Nêu rõ blocker, cách đã thử và ai có thể hỗ trợ...', required: true },
      { key: 'aiUsage', label: 'AI đã hỗ trợ gì và bạn kiểm chứng ra sao?', type: 'textarea', placeholder: 'Nêu tác vụ, cách kiểm tra và giới hạn nhận thấy...', required: true },
      { key: 'nextStep', label: 'Bước tiếp theo', type: 'textarea', placeholder: 'Hành động cụ thể tiếp theo và thời điểm dự kiến...', required: true },
    ],
  },
  {
    id: 'user-feedback', title: '03. User Interview & Feedback Notes', description: 'Lưu phản hồi có nguồn để kiểm chứng vấn đề và cải tiến prototype.', whenToUse: 'Điền sau mỗi buổi phỏng vấn, demo hoặc nhận phản hồi từ stakeholder.', minimumEvidence: ['Vai trò người phản hồi hoặc nguồn ẩn danh', 'Ghi chú phản hồi', 'Quyết định sau phản hồi'], competencyIds: ['user-problem-understanding', 'product-experimentation', 'collaboration-trust'],
    fields: [
      { key: 'session', label: 'Thời điểm và nguồn phản hồi', type: 'text', placeholder: 'Ví dụ: Demo 18/06 với đại diện vận hành; không ghi dữ liệu nhạy cảm', required: true },
      { key: 'context', label: 'Bối cảnh và mục tiêu buổi trao đổi', type: 'textarea', placeholder: 'Bạn muốn kiểm chứng điều gì?', required: true },
      { key: 'feedback', label: 'Phản hồi quan sát được', type: 'textarea', placeholder: 'Ghi ý chính, hành vi hoặc câu nói đã được ẩn danh...', required: true },
      { key: 'insight', label: 'Điều học được', type: 'textarea', placeholder: 'Phản hồi xác nhận hoặc bác bỏ giả định nào?', required: true },
      { key: 'decision', label: 'Quyết định và thay đổi tiếp theo', type: 'textarea', placeholder: 'Giữ, đổi hoặc chưa làm gì? Vì sao?', required: true },
      { key: 'evidenceLink', label: 'Link bằng chứng', type: 'text', placeholder: 'Link ghi chú, ảnh demo hoặc ticket đã được phép chia sẻ', required: true },
    ],
  },
  {
    id: 'experiment-log', title: '04. Experiment & Demo Log', description: 'Ghi lại giả định, cách thử, kết quả thật và quyết định sau mỗi vòng.', whenToUse: 'Điền khi thử một giả định quan trọng, demo prototype hoặc kiểm tra acceptance criteria.', minimumEvidence: ['Kết quả test hoặc demo', 'Link phiên bản prototype', 'Quyết định dựa trên kết quả'], competencyIds: ['product-experimentation', 'ai-assisted-execution', 'learning-ownership'],
    fields: [
      { key: 'experiment', label: 'Giả định hoặc câu hỏi cần kiểm chứng', type: 'textarea', placeholder: 'Ví dụ: Người dùng có thể hoàn thành luồng tạo báo cáo trong 3 phút', required: true },
      { key: 'method', label: 'Cách thử và tiêu chí đạt', type: 'textarea', placeholder: 'Ai thử, thử luồng nào và kết quả nào được tính là đạt?', required: true },
      { key: 'result', label: 'Kết quả và bằng chứng', type: 'textarea', placeholder: 'Số liệu, lỗi quan sát, link demo hoặc ảnh kết quả...', required: true },
      { key: 'learning', label: 'Điều học được', type: 'textarea', placeholder: 'Điều gì đúng, sai hoặc còn chưa chắc?', required: true },
      { key: 'decision', label: 'Quyết định tiếp theo', type: 'textarea', placeholder: 'Giữ, sửa, bỏ hoặc thử tiếp điều gì?', required: true },
      { key: 'aiCheck', label: 'Phần AI hỗ trợ và cách kiểm chứng', type: 'textarea', placeholder: 'Nêu phần AI tạo, test đã chạy và giới hạn còn lại...', required: true },
    ],
  },
  {
    id: 'final-handover', title: '05. Final Reflection & Handover', description: 'Tổng kết kết quả, bài học và thông tin đủ để người khác tiếp tục với prototype.', whenToUse: 'Điền trong giai đoạn chuẩn bị demo và đánh giá cuối kỳ.', minimumEvidence: ['Link prototype hoặc demo', 'Kết quả acceptance criteria', 'Giới hạn và bước tiếp theo'], competencyIds: ['ai-assisted-execution', 'learning-ownership', 'collaboration-trust'],
    fields: [
      { key: 'prototypeLink', label: 'Link prototype hoặc demo', type: 'text', placeholder: 'URL truy cập hoặc link video demo', required: true },
      { key: 'outcomes', label: 'Kết quả so với acceptance criteria', type: 'textarea', placeholder: 'Tiêu chí nào đạt, chưa đạt và bằng chứng tương ứng...', required: true },
      { key: 'feedbackSummary', label: 'Feedback đã nhận và thay đổi đã làm', type: 'textarea', placeholder: 'Tóm tắt các vòng phản hồi và tác động tới prototype...', required: true },
      { key: 'setup', label: 'Cách truy cập, chạy thử hoặc tiếp tục', type: 'textarea', placeholder: 'Hướng dẫn vừa đủ; không ghi password, API key hoặc credential thật', required: true },
      { key: 'limitations', label: 'Giới hạn, lỗi còn lại và lưu ý an toàn', type: 'textarea', placeholder: 'Nêu trung thực điều chưa hoàn thiện và rủi ro cần biết...', required: true },
      { key: 'reflection', label: 'Bài học và bước tiếp theo', type: 'textarea', placeholder: 'Bạn đã thay đổi cách hiểu hoặc cách làm như thế nào?', required: true },
    ],
  },
];
