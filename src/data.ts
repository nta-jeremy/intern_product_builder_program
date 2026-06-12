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
  { level: 1, label: 'Cần hỗ trợ', description: 'Chưa thể hiện ổn định và cần người hướng dẫn hỗ trợ trực tiếp.' },
  { level: 2, label: 'Đạt nền tảng', description: 'Thực hiện được với phạm vi rõ và một phần hỗ trợ.' },
  { level: 3, label: 'Đạt kỳ vọng thực tập sinh', description: 'Thực hiện độc lập trong phạm vi chương trình và có bằng chứng.' },
  { level: 4, label: 'Vượt kỳ vọng thực tập sinh', description: 'Thực hiện nhất quán, biết cải tiến và chia sẻ cách làm.' },
];

export const SUCCESS_PROFILE_DATA: SuccessProfileItem[] = [
  {
    key: 'user-problem-understanding',
    dimension: 'Hiểu người dùng và bài toán',
    description: 'Xác định đúng người dùng, vấn đề và kết quả cần tạo ra trước khi chọn giải pháp.',
    whyItMatters: 'Một sản phẩm mẫu chỉ có giá trị khi giải quyết được nhu cầu đã được kiểm chứng, thay vì dựa trên phỏng đoán.',
    observableBehaviors: [
      'Trao đổi với người dùng hoặc người liên quan để hiểu bối cảnh thực tế.',
      'Viết được bản mô tả vấn đề, nhóm người dùng và kết quả mong đợi.',
      'Phân biệt dữ kiện đã xác nhận với giả định cần kiểm chứng.',
    ],
    supportSignals: [
      'Mô tả giải pháp nhưng chưa nói rõ ai gặp vấn đề gì.',
      'Dùng ý kiến cá nhân thay cho phản hồi hoặc dữ liệu.',
      'Chưa thống nhất tiêu chí nghiệm thu với người hướng dẫn hoặc người liên quan.',
    ],
    evidenceTemplateIds: ['problem-brief', 'user-feedback'],
  },
  {
    key: 'product-experimentation',
    dimension: 'Tư duy sản phẩm và thử nghiệm',
    description: 'Chia nhỏ giả định, làm sản phẩm mẫu vừa đủ và cải tiến dựa trên phản hồi.',
    whyItMatters: 'Thử nghiệm nhỏ giúp học nhanh, kiểm soát phạm vi và giảm thời gian làm những tính năng chưa cần thiết.',
    observableBehaviors: [
      'Chọn phạm vi sản phẩm mẫu gắn với tiêu chí nghiệm thu rõ ràng.',
      'Trình bày sản phẩm hoặc thử nghiệm để nhận phản hồi sớm.',
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
      'Không đưa mật khẩu, khóa API hoặc dữ liệu cá nhân nhạy cảm vào yêu cầu gửi AI.',
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
    description: 'Tự quản lý bước tiếp theo, báo vướng mắc sớm và biến phản hồi thành hành động.',
    whyItMatters: 'Chương trình cần thực tập sinh tiến bộ qua từng vòng làm việc, đồng thời giúp người hướng dẫn hỗ trợ đúng lúc.',
    observableBehaviors: [
      'Lập kế hoạch ngắn, cập nhật tiến độ và nêu rõ bước tiếp theo.',
      'Tự thử các hướng hợp lý trước khi xin hỗ trợ.',
      'Báo vướng mắc sớm kèm điều đã thử và hỗ trợ đang cần.',
    ],
    supportSignals: [
      'Không rõ ưu tiên hoặc bước tiếp theo.',
      'Giữ vướng mắc quá lâu mà không trao đổi.',
      'Nhận phản hồi nhưng chưa chuyển thành hành động cụ thể.',
    ],
    evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
  },
  {
    key: 'collaboration-trust',
    dimension: 'Hợp tác và tin cậy',
    description: 'Giao tiếp rõ, tiếp nhận phản hồi và trung thực về tiến độ, giới hạn và bằng chứng.',
    whyItMatters: 'Sản phẩm mẫu là kết quả phối hợp; Hội đồng cần tin rằng bằng chứng phản ánh đúng quá trình và kết quả thực tế.',
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
    subtitle: 'Hệ thống theo dõi ứng viên',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Quản lý toàn bộ quy trình tuyển dụng tại YODY. Hệ thống giúp HR đăng tin, nhận và lưu trữ CV, phân loại ứng viên, gửi lời mời nhận việc hoặc từ chối ứng viên.',
    primaryUsers: [
      'Phòng Nhân sự (HR) - Trực tiếp quản lý quy trình tuyển dụng và thông tin ứng viên',
      'Quản lý tuyển dụng - Xem, đánh giá và quyết định trạng thái ứng viên của phòng ban phụ trách'
    ],
    deliverables: [
      {
        feature: 'Tìm hiểu vấn đề và luồng người dùng',
        output: 'Bản mô tả vấn đề, sơ đồ luồng người dùng và bản phác thảo giao diện (PDF)',
        kpi: 'HR Lead phê duyệt và ký nhận luồng nghiệp vụ trước khi bắt đầu viết mã',
        signOff: 'HR Lead + Product Owner (PO)'
      },
      {
        feature: 'Câu chuyện người dùng và cấu trúc cơ sở dữ liệu',
        output: '15 câu chuyện người dùng có tiêu chí nghiệm thu cụ thể, sơ đồ cấu trúc cơ sở dữ liệu và đề xuất công nghệ',
        kpi: 'Tech Lead phê duyệt cấu trúc cơ sở dữ liệu và kiến trúc hệ thống',
        signOff: 'Tech Lead + PO'
      },
      {
        feature: 'Xác thực và giao diện bảng tổng quan',
        output: 'Trang đăng nhập bảo mật, tài liệu API và khung giao diện bảng tổng quan',
        kpi: 'Chức năng xác thực hoạt động ổn định, giao diện hoàn thiện và đồng bộ đúng bản thiết kế',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Quản lý ứng viên và tải CV',
        output: 'Danh sách ứng viên, biểu mẫu thêm/sửa, công cụ tải CV và luồng trạng thái (Đã ứng tuyển → Đã phỏng vấn → Mời nhận việc/Từ chối)',
        kpi: 'Thay đổi trạng thái ứng viên thuận tiện, lưu trữ CV an toàn và truy xuất chính xác',
        signOff: 'Tech Lead + QA'
      },
      {
        feature: 'Tìm kiếm, bộ lọc và thông báo',
        output: 'Bộ lọc nâng cao, tìm kiếm nhanh, thao tác hàng loạt và email tự động cập nhật trạng thái',
        kpi: 'Tìm và hiển thị đúng ứng viên trong thời gian dưới 3 giây',
        signOff: 'HR Lead + QA'
      },
      {
        feature: 'Phân tích và xuất báo cáo',
        output: 'Bảng tổng quan chỉ số tuyển dụng, biểu đồ thời gian tuyển dụng và báo cáo Excel/CSV',
        kpi: 'Số liệu được tổng hợp tự động; tệp Excel có định dạng rõ ràng và đầy đủ thông tin',
        signOff: 'HR Lead'
      },
      {
        feature: 'UAT và triển khai chính thức',
        output: 'Tài liệu bàn giao và đào tạo, biên bản UAT và bản triển khai trên môi trường chính thức',
        kpi: 'Tỷ lệ UAT đạt trên 80% từ phía HR và không còn lỗi nghiêm trọng',
        signOff: 'HR Director'
      }
    ]
  },
  {
    id: 'agent-qc',
    title: 'Trợ lý AI kiểm soát chất lượng trang web YODY',
    subtitle: 'Trợ lý kiểm soát chất lượng tự động',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Xây dựng một trợ lý AI chạy định kỳ để rà soát chất lượng trang web bán hàng YODY (yody.vn). Trợ lý kiểm tra lỗi giao diện, liên kết hỏng, khả năng tương thích trên thiết bị di động, tốc độ tải trang và các tiêu chuẩn SEO cốt lõi, sau đó tự động cảnh báo qua Slack hoặc email.',
    primaryUsers: [
      'Phòng Đảm bảo chất lượng (QA) - Nhận báo cáo tự động về chất lượng trang web',
      'Đội Vận hành và Kỹ thuật - Nhận cảnh báo tức thời để khắc phục sự cố'
    ],
    deliverables: [
      {
        feature: 'Danh sách kiểm tra QC và phân tích vấn đề',
        output: 'Danh sách kịch bản kiểm tra QC, phân tích các lỗi nghiêm trọng thường gặp và 5-10 kịch bản ưu tiên tự động hóa',
        kpi: 'QA Lead ký duyệt danh sách các kịch bản kiểm thử tự động',
        signOff: 'QA Lead'
      },
      {
        feature: 'Khung trợ lý AI và 5 kịch bản kiểm thử',
        output: 'Mã nguồn khung trợ lý AI, công cụ tự động hóa trình duyệt và 5 kịch bản kiểm thử đầu tiên hoạt động ổn định',
        kpi: 'Kịch bản chạy tự động chính xác, không phát cảnh báo sai',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Mở rộng hơn 10 kịch bản kiểm thử và tích hợp Slack',
        output: 'Hơn 10 kịch bản kiểm thử, mẫu báo cáo trực quan và tích hợp cảnh báo qua Slack Webhook',
        kpi: 'Độ phủ kiểm thử đạt tối thiểu 50% danh sách kiểm tra QC và có cảnh báo tức thời khi trang web gặp lỗi',
        signOff: 'QA Lead + Tech Lead'
      },
      {
        feature: 'Lập lịch, UAT và đào tạo',
        output: 'Cấu hình lịch chạy tự động, tài liệu đọc báo cáo, tài liệu hướng dẫn và tập huấn vận hành cho đội QA',
        kpi: 'Hệ thống tự động chạy đều đặn 2 lần/tuần; đội QA hoàn toàn tự chủ quản lý và mở rộng kịch bản khi cần',
        signOff: 'QA Director'
      }
    ]
  },
  {
    id: 'agent-compliance',
    title: 'Thiết kế và thẩm định quy trình',
    subtitle: 'Trợ lý thẩm định tuân thủ nội bộ',
    priority: 'CAO',
    priorityStars: 3,
    description: 'Xây dựng một trợ lý AI được hướng dẫn theo các biểu mẫu quy trình nội bộ chính thức tại YODY, như phiếu điều chỉnh giá bán, phiếu đề nghị phê duyệt ngân sách và phiếu nhập/xuất kho. Trợ lý hiểu cấu trúc biểu mẫu, tự động kiểm tra tính hợp lý của dữ liệu đầu vào, phát hiện sai lệch quy trình và gửi báo cáo khẩn cho Ban Kiểm soát.',
    primaryUsers: [
      'Ban Pháp chế và Kiểm soát nội bộ - Giảm việc rà soát thủ công hồ sơ phê duyệt',
      'Các phòng ban nghiệp vụ - Đảm bảo điền đúng thông tin theo quy định trước khi trình duyệt'
    ],
    approaches: [
      'Thu thập 3-5 biểu mẫu đang được sử dụng tại YODY',
      'Xác định bộ quy tắc kiểm tra chính xác cho từng trường dữ liệu',
      'Hướng dẫn trợ lý AI đọc và phân tích biểu mẫu → phát hiện sai lệch → gửi cảnh báo',
      'Tích hợp vào công cụ làm việc hằng ngày của nhân viên như Slack và email mà không làm xáo trộn quy trình'
    ],
    deliverables: [
      {
        feature: 'Thu thập và chuẩn hóa biểu mẫu',
        output: 'Bộ dữ liệu gồm 3-5 biểu mẫu thực tế, quy tắc thẩm định chi tiết và tài liệu ánh xạ quy tắc',
        kpi: 'Compliance Lead xác nhận bộ quy tắc nghiệp vụ phản ánh đúng 100% quy trình thực tế',
        signOff: 'Compliance Lead'
      },
      {
        feature: 'Xây dựng trợ lý đọc biểu mẫu số 1',
        output: 'Mã nguồn cốt lõi để trợ lý đọc biểu mẫu đầu tiên và kết quả thẩm định thử trên 20 bộ hồ sơ mẫu',
        kpi: 'Tỷ lệ thẩm định nhận dạng chính xác lỗi sai sót đạt trên 80% với tối thiểu 20 tập dữ liệu mẫu',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Xây dựng trợ lý cho biểu mẫu số 2, số 3 và cảnh báo',
        output: 'Trợ lý thẩm định biểu mẫu số 2 và số 3, sơ đồ quy trình làm việc tự động và tích hợp email cảnh báo',
        kpi: 'Kiểm soát đồng thời 3 loại biểu mẫu chính, hệ thống gửi email cảnh báo đúng người thẩm quyền trong vòng dưới 2 phút từ lúc nhận thông tin',
        signOff: 'Compliance Lead'
      },
      {
        feature: 'Bảng tổng quan, tích hợp và UAT',
        output: 'Bảng tổng quan kết quả thẩm định, mã nguồn kiểm thử tích hợp và tài liệu hướng dẫn sử dụng',
        kpi: 'UAT hoàn tất thành công, chuyên viên kiểm soát nội bộ sử dụng thuần thục mà không cần thao tác kỹ thuật bổ sung',
        signOff: 'Compliance Director'
      }
    ]
  },
  {
    id: 'agent-personal',
    title: 'Trợ lý quản lý công việc và báo cáo cá nhân',
    subtitle: 'Trợ lý năng suất và báo cáo cá nhân',
    priority: 'TRUNG BÌNH',
    priorityStars: 2,
    description: 'Xây dựng trợ lý AI giúp từng thực tập sinh hoặc quản lý theo dõi công việc cá nhân. Trợ lý tự động nhắc việc sắp đến hạn và tổng hợp báo cáo tuần/tháng theo yêu cầu thông qua API của nền tảng quản lý dự án đang dùng tại YODY.',
    primaryUsers: [
      'Thực tập sinh - Tự theo dõi tiến độ và tạo nhanh báo cáo thực tập hằng tuần',
      'Quản lý trực tiếp - Nhận báo cáo công việc được tạo tự động cho từng thành viên'
    ],
    deliverables: [
      {
        feature: 'Tìm hiểu API và xác định chỉ số',
        output: 'Tài liệu tích hợp API của công cụ quản lý nhiệm vụ, danh sách chỉ số báo cáo theo vai trò và bản thiết kế báo cáo cá nhân',
        kpi: 'Product Owner phê duyệt bộ chỉ số đánh giá và cấu trúc báo cáo hiển thị tối ưu cho người dùng',
        signOff: 'PO'
      },
      {
        feature: 'Xây dựng trợ lý lấy dữ liệu và tính chỉ số',
        output: 'Mã nguồn trợ lý kết nối và lấy dữ liệu, bộ xử lý tính toán số liệu tự động và báo cáo văn bản mẫu',
        kpi: 'API tương tác trơn tru, lấy đúng và đủ dữ liệu công việc cá nhân được phân công; các phép tính KPI hoạt động chính xác',
        signOff: 'Tech Lead'
      },
      {
        feature: 'Báo cáo HTML, biểu đồ và lịch chạy',
        output: 'Mẫu báo cáo HTML, biểu đồ trực quan hóa dữ liệu và cấu hình lịch chạy tự động',
        kpi: 'Biểu đồ và báo cáo HTML hiển thị rõ ràng; lịch gửi báo cáo chạy ổn định không lỗi',
        signOff: 'PO'
      },
      {
        feature: 'Email, bộ lọc, bảng tổng quan và UAT',
        output: 'Tích hợp dịch vụ gửi email, bộ lọc báo cáo theo thời gian, cá nhân hoặc phòng ban, bảng tổng quan thu gọn và tập huấn sử dụng',
        kpi: 'Mọi nhân sự đều có thể yêu cầu và nhận ngay báo cáo tổng kết tiến độ qua email cá nhân',
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
    summary: 'Tháng 1 ưu tiên hiểu đúng bài toán, làm sản phẩm mẫu nhỏ đầu tiên và tạo thói quen ghi lại bằng chứng có thể đối chiếu.',
    steps: [
      {
        id: 'discover',
        title: 'Tìm hiểu',
        question: 'Ai đang gặp vấn đề gì và dữ kiện nào xác nhận điều đó?',
        actions: [
          'Chốt một bản mô tả vấn đề ngắn, nêu rõ người dùng, bối cảnh và kết quả mong đợi.',
          'Phân biệt điều đã xác nhận với giả định còn cần kiểm chứng.',
          'Thống nhất tiêu chí nghiệm thu đủ nhỏ cho vòng thử đầu tiên.',
        ],
        competencyIds: ['user-problem-understanding', 'product-experimentation'],
        evidenceTemplateIds: ['problem-brief', 'user-feedback'],
      },
      {
        id: 'build',
        title: 'Xây dựng',
        question: 'Phiên bản nhỏ nhất nào giúp kiểm chứng giả định nhanh nhất?',
        actions: [
          'Dựng sản phẩm mẫu hoặc luồng tối thiểu thay vì làm đầy đủ tính năng.',
          'Chọn phần việc phù hợp để AI hỗ trợ nhưng vẫn tự đọc lại đầu ra.',
          'Giữ phạm vi đủ hẹp để có thể trình bày sản phẩm trong tuần.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution'],
        evidenceTemplateIds: ['problem-brief', 'weekly-checkin', 'experiment-log'],
      },
      {
        id: 'validate',
        title: 'Kiểm chứng',
        question: 'Kết quả nào đạt, chưa đạt và vì sao?',
        actions: [
          'Chạy thử với dữ liệu hoặc luồng sử dụng gần thực tế.',
          'Ghi rõ lỗi, điểm chưa đạt và điều cần người hướng dẫn hỗ trợ.',
          'Đối chiếu trực tiếp với tiêu chí nghiệm thu đã chốt.',
        ],
        competencyIds: ['product-experimentation', 'learning-ownership'],
        evidenceTemplateIds: ['experiment-log', 'weekly-checkin'],
      },
      {
        id: 'ship',
        title: 'Đưa vào sử dụng',
        question: 'Ai có thể xem, dùng thử hoặc tiếp tục với đầu ra hiện tại?',
        actions: [
          'Chuẩn bị liên kết bản dùng thử hoặc bản trình bày để người khác có thể tự xem.',
          'Ghi lại hướng dẫn truy cập và phạm vi hiện tại.',
          'Nêu trung thực điều chưa làm, chưa ổn hoặc còn đang giả lập.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['weekly-checkin', 'final-handover'],
      },
      {
        id: 'learn',
        title: 'Rút kinh nghiệm',
        question: 'Sau vòng đầu tiên, cách hiểu và cách làm của bạn đã thay đổi gì?',
        actions: [
          'Viết ngắn điều đã học, điều cần bỏ và điều sẽ thử tiếp.',
          'Biến phản hồi thành một quyết định rõ ràng cho vòng tháng sau.',
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
        focus: 'Thu hẹp phạm vi sản phẩm mẫu và xác định tiêu chí nghiệm thu có thể kiểm tra.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 2,
        focus: 'Dùng AI để tăng tốc tác vụ nhỏ nhưng luôn đọc lại và tự kiểm chứng.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 2,
        focus: 'Báo tiến độ, vướng mắc và bước tiếp theo đúng lúc thay vì chờ được hỏi.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 2,
        focus: 'Giao tiếp rõ phạm vi, giới hạn và nguồn bằng chứng với người hướng dẫn hoặc người liên quan.',
      },
    ],
    coachingCadence: [
      'Trao đổi đầu tuần để chốt phạm vi sản phẩm mẫu và điều cần xác nhận.',
      'Trình bày ngắn giữa tuần để nhận phản hồi sớm khi phạm vi vẫn còn nhỏ.',
      'Nhìn lại cuối tuần, tập trung vào điều học được và vướng mắc cần hỗ trợ.',
    ],
    monthlyGate: [
      'Có một bản mô tả vấn đề và tiêu chí nghiệm thu đã thống nhất.',
      'Trình bày được sản phẩm mẫu của vòng đầu tiên với bằng chứng tối thiểu trong sổ tay thực tập.',
      'Nêu rõ điều đã học và bước tiếp theo cho tháng 2.',
    ],
  },
  {
    id: 'month-2',
    month: 2,
    title: 'Làm chủ vòng lặp',
    autonomy: 'Chủ động hơn trong phạm vi đã rõ, tự chạy nhiều vòng thử và dùng phản hồi để ưu tiên.',
    targetLevel: 3,
    summary: 'Tháng 2 không chỉ hoàn thành một vòng mà cần lặp lại chu trình Tìm hiểu → Rút kinh nghiệm nhiều lần với chất lượng bằng chứng tốt hơn.',
    steps: [
      {
        id: 'discover',
        title: 'Tìm hiểu',
        question: 'Sau vòng đầu tiên, đâu là giả định quan trọng nhất còn lại?',
        actions: [
          'Đọc lại phản hồi và chọn một giả định đem lại giá trị học hỏi cao nhất.',
          'Ưu tiên vấn đề theo tác động thay vì làm mọi yêu cầu cùng lúc.',
          'Chốt câu hỏi kiểm chứng rõ cho vòng thử tiếp theo.',
        ],
        competencyIds: ['user-problem-understanding', 'product-experimentation'],
        evidenceTemplateIds: ['user-feedback', 'experiment-log'],
      },
      {
        id: 'build',
        title: 'Xây dựng',
        question: 'Bạn cần thay đổi điều gì để kiểm chứng giả định tiếp theo nhanh hơn?',
        actions: [
          'Cắt bỏ phần chưa cần thiết và chỉ giữ thay đổi phục vụ câu hỏi hiện tại.',
          'Dùng AI như một công cụ hỗ trợ để tăng tốc phân tích, viết thử và tạo kịch bản kiểm thử.',
          'Giữ luồng trình bày ổn định để người dùng phản hồi đúng phần trọng tâm.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution'],
        evidenceTemplateIds: ['weekly-checkin', 'experiment-log'],
      },
      {
        id: 'validate',
        title: 'Kiểm chứng',
        question: 'Phản hồi mới xác nhận điều gì và bác bỏ điều gì?',
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
        title: 'Đưa vào sử dụng',
        question: 'Ai cần được cập nhật để tiếp tục tin tưởng và hỗ trợ vòng tiếp theo?',
        actions: [
          'Chia sẻ bản dùng thử đang chạy và trạng thái đạt hoặc chưa đạt của từng tiêu chí.',
          'Thống nhất lại kỳ vọng với người hướng dẫn hoặc người liên quan trước khi mở rộng phạm vi.',
          'Ghi chú cách truy cập, dữ liệu mẫu và giới hạn hiện tại.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['weekly-checkin', 'final-handover'],
      },
      {
        id: 'learn',
        title: 'Rút kinh nghiệm',
        question: 'Bạn đã thay đổi cách ra quyết định sản phẩm như thế nào sau nhiều vòng thử?',
        actions: [
          'Tóm tắt các mẫu phản hồi lặp lại và bài học quan trọng nhất.',
          'Chỉ ra một cách làm hiệu quả hơn mà bạn sẽ lặp lại ở tháng 3.',
          'Cập nhật năng lực nào đã tiến gần mức 3 và năng lực nào còn cần cải thiện.',
        ],
        competencyIds: ['learning-ownership', 'product-experimentation'],
        evidenceTemplateIds: ['weekly-checkin', 'experiment-log', 'final-handover'],
      },
    ],
    competencyTargets: [
      {
        competencyId: 'user-problem-understanding',
        targetLevel: 3,
        focus: 'Chủ động xác nhận lại vấn đề sau mỗi vòng phản hồi và phân biệt được tín hiệu mạnh, yếu.',
      },
      {
        competencyId: 'product-experimentation',
        targetLevel: 3,
        focus: 'Thiết kế vòng thử có mục tiêu rõ, biết cân nhắc giữa tốc độ và giá trị học hỏi.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 3,
        focus: 'Biết giao đúng việc cho AI, kiểm tra đầu ra và giữ chất lượng sản phẩm mẫu ổn định.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 3,
        focus: 'Quản lý được cam kết cá nhân, vướng mắc và nhịp cải tiến mà không chờ nhắc.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 3,
        focus: 'Cập nhật trung thực tiến độ, rủi ro và bằng chứng để tạo niềm tin khi phối hợp.',
      },
    ],
    coachingCadence: [
      'Trao đổi hằng tuần, tập trung vào giả định ưu tiên và cách đo kết quả.',
      'Có một buổi nhận phản hồi từ người dùng hoặc người liên quan cho mỗi vòng thử quan trọng.',
      'Rà soát cuối tuần để so sánh thay đổi giữa các vòng và chốt hướng đi tiếp.',
    ],
    monthlyGate: [
      'Có ít nhất một vòng phản hồi hoặc kiểm chứng mới dẫn tới thay đổi rõ trong sản phẩm mẫu.',
      'Năng lực mục tiêu chính đã tiến gần mức 3 với bằng chứng cụ thể.',
      'Mọi cập nhật phạm vi đều có lý do dựa trên dữ liệu hoặc phản hồi.',
    ],
  },
  {
    id: 'month-3',
    month: 3,
    title: 'Tạo tác động và bàn giao',
    autonomy: 'Chịu trách nhiệm rõ hơn với đầu ra, phần trình bày, việc bàn giao và tác động của quyết định sản phẩm.',
    targetLevel: 3,
    summary: 'Tháng 3 hướng tới chuẩn hoàn thành của thực tập sinh: sản phẩm mẫu thể hiện rõ giá trị, có bằng chứng kiểm chứng, có thể trình bày và bàn giao, đồng thời bắt đầu xuất hiện tín hiệu mức 4.',
    steps: [
      {
        id: 'discover',
        title: 'Tìm hiểu',
        question: 'Điều gì quan trọng nhất để sản phẩm mẫu tạo tác động ở vòng cuối?',
        actions: [
          'Chốt vấn đề ưu tiên cuối cùng dựa trên bằng chứng đã tích lũy.',
          'Làm rõ ai sẽ dùng, đánh giá hoặc tiếp tục với đầu ra này.',
          'Xác định tiêu chí nghiệm thu cuối và các giới hạn phải nói rõ.',
        ],
        competencyIds: ['user-problem-understanding', 'collaboration-trust'],
        evidenceTemplateIds: ['problem-brief', 'user-feedback', 'final-handover'],
      },
      {
        id: 'build',
        title: 'Xây dựng',
        question: 'Phiên bản nào đủ tốt để người khác dùng thử hoặc đánh giá nghiêm túc?',
        actions: [
          'Ổn định luồng chính và loại bớt phần gây nhiễu cho buổi trình bày cuối.',
          'Dùng AI để tăng tốc việc viết tài liệu, tạo kịch bản kiểm thử hoặc dọn mã có kiểm soát.',
          'Giữ mọi quyết định về phạm vi bám sát giá trị và bằng chứng.',
        ],
        competencyIds: ['product-experimentation', 'ai-assisted-execution', 'learning-ownership'],
        evidenceTemplateIds: ['experiment-log', 'weekly-checkin', 'final-handover'],
      },
      {
        id: 'validate',
        title: 'Kiểm chứng',
        question: 'Sản phẩm mẫu đã thực sự đạt tiêu chí nghiệm thu và đáp ứng phản hồi cuối chưa?',
        actions: [
          'Đối chiếu lại từng tiêu chí nghiệm thu với bằng chứng hiện có.',
          'Tổng hợp phản hồi cuối cùng cùng các giới hạn hoặc rủi ro còn lại.',
          'Kiểm tra khả năng truy cập, tính rõ ràng và mức sẵn sàng bàn giao.',
        ],
        competencyIds: ['product-experimentation', 'collaboration-trust'],
        evidenceTemplateIds: ['user-feedback', 'experiment-log', 'final-handover'],
      },
      {
        id: 'ship',
        title: 'Đưa vào sử dụng',
        question: 'Người khác có thể xem, hiểu và tiếp tục với kết quả của bạn không?',
        actions: [
          'Chuẩn bị phần trình bày, hướng dẫn truy cập và ghi chú bàn giao ngắn gọn.',
          'Nêu rõ điều đã đạt, chưa đạt và phần cần tiếp tục sau chương trình.',
          'Đảm bảo bằng chứng và thông tin bàn giao trung thực, dễ kiểm tra.',
        ],
        competencyIds: ['collaboration-trust', 'learning-ownership'],
        evidenceTemplateIds: ['final-handover', 'weekly-checkin'],
      },
      {
        id: 'learn',
        title: 'Rút kinh nghiệm',
        question: 'Bạn đã trở thành người xây dựng sản phẩm tốt hơn ở điểm nào sau ba tháng?',
        actions: [
          'Kết nối bài học từ cả ba tháng thành một câu chuyện phát triển rõ ràng.',
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
        focus: 'Ra quyết định dựa trên bằng chứng tích lũy và biết chỉ ra vấn đề nào tạo tác động thực sự.',
      },
      {
        competencyId: 'product-experimentation',
        targetLevel: 3,
        focus: 'Khóa được phạm vi cuối và chứng minh kết quả bằng tiêu chí nghiệm thu cùng phản hồi thật.',
      },
      {
        competencyId: 'ai-assisted-execution',
        targetLevel: 3,
        focus: 'Dùng AI có phán đoán, giải thích được quyết định và tự kiểm tra chất lượng đầu ra.',
      },
      {
        competencyId: 'learning-ownership',
        targetLevel: 3,
        focus: 'Chủ động quản lý tiến độ, việc bàn giao và các bước tiếp theo sau chương trình.',
      },
      {
        competencyId: 'collaboration-trust',
        targetLevel: 3,
        focus: 'Tạo niềm tin qua phần trình bày rõ ràng, bằng chứng kiểm tra được và giao tiếp trung thực.',
      },
    ],
    coachingCadence: [
      'Rà soát đầu tuần để khóa mục tiêu trình bày và phần bằng chứng còn thiếu.',
      'Chạy thử giữa tuần cho phần trình bày, bàn giao và câu chuyện phát triển qua ba tháng.',
      'Tổng kết cuối tháng, đối chiếu bảng đánh giá, bằng chứng và bước phát triển tiếp theo.',
    ],
    monthlyGate: [
      'Sản phẩm mẫu có thể trình bày và có bằng chứng đối chiếu tiêu chí nghiệm thu.',
      'Thông tin bàn giao đủ rõ để người khác truy cập, hiểu giới hạn và tiếp tục công việc.',
      'Xuất hiện tín hiệu mức 4 ở ít nhất một vài hành vi, nhưng điều kiện chính vẫn là chuẩn mức 3 của thực tập sinh.',
    ],
    futureSignals: [
      'Biết đề xuất phương án cân bằng giữa tác động kinh doanh và chi phí thực thi.',
      'Tự tổ chức nhịp làm việc, phản tư và điều chỉnh cách phối hợp với người liên quan.',
      'Chia sẻ lại cách làm hiệu quả cho người khác thay vì chỉ hoàn thành phần việc của mình.',
    ],
  },
];

export const ENTRY_SCORECARD_DATA: ScorecardDefinition = {
  id: 'entry',
  title: 'Bảng đánh giá đầu vào',
  description: 'Đánh giá tiềm năng học tập, khả năng làm sản phẩm mẫu và mức phù hợp với cách làm việc của chương trình.',
  audienceNote: 'Đây là khuyến nghị cho Hội đồng tuyển chọn, không phải quyết định tự động.',
  categories: [
    {
      id: 'entry-role-outcome', name: 'Hiểu vai trò và đầu ra chương trình', description: 'Ứng viên hiểu phạm vi của thực tập sinh xây dựng sản phẩm và tiêu chuẩn của một sản phẩm mẫu.', points: 15,
      criteria: [
        {
          id: 'entry-role-clarity', name: 'Hiểu vai trò và đầu ra', description: 'Diễn giải được mục tiêu chương trình, vai trò của phản hồi và tiêu chí nghiệm thu.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['problem-brief'], levels: {
            1: 'Chưa mô tả được đầu ra hoặc kỳ vọng của chương trình.',
            2: 'Hiểu cần làm sản phẩm mẫu nhưng còn mơ hồ về người dùng và bằng chứng.',
            3: 'Nêu rõ một sản phẩm mẫu, phản hồi người dùng, tiêu chí nghiệm thu và trách nhiệm của thực tập sinh.',
            4: 'Ngoài mức 3, biết đề xuất cách chia giai đoạn học và kiểm chứng kết quả.',
          }
        },
      ],
    },
    {
      id: 'entry-problem-prototype', name: 'Giải quyết vấn đề và làm sản phẩm mẫu', description: 'Quan sát cách ứng viên hiểu vấn đề, thu hẹp phạm vi và thử giải pháp.', points: 30,
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
          id: 'entry-prototype-thinking', name: 'Tư duy sản phẩm mẫu và thử nghiệm', description: 'Chọn một cách thử nhỏ để học trước khi mở rộng.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['experiment-log'], levels: {
            1: 'Đề xuất phạm vi lớn nhưng chưa có cách kiểm tra.',
            2: 'Có ý tưởng sản phẩm mẫu nhưng tiêu chí nghiệm thu còn chung chung.',
            3: 'Đề xuất sản phẩm mẫu vừa đủ, tiêu chí nghiệm thu và cách lấy phản hồi.',
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
          id: 'entry-learning-ownership', name: 'Chủ động học và cam kết', description: 'Có ví dụ về tự học, xử lý vướng mắc và duy trì cam kết.', points: 15, competencyIds: ['learning-ownership'], evidenceTemplateIds: ['weekly-checkin'], levels: {
            1: 'Chưa có ví dụ cụ thể hoặc phụ thuộc hoàn toàn vào hướng dẫn.',
            2: 'Có nỗ lực học nhưng kế hoạch và cách báo vướng mắc chưa rõ.',
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
  title: 'Bảng đánh giá cuối kỳ',
  description: 'Đối chiếu kết quả một sản phẩm mẫu, năm năng lực cốt lõi và bằng chứng trong suốt chương trình.',
  audienceNote: 'Bảng đánh giá là đầu vào cho quyết định của Hội đồng, không tự động quyết định tuyển dụng.',
  categories: [
    {
      id: 'final-prototype', name: 'Kết quả sản phẩm mẫu', description: 'Chất lượng đầu ra và mức kiểm chứng với người dùng.', points: 45,
      criteria: [
        { id: 'final-problem', name: 'Hiểu vấn đề cần giải quyết', description: 'Bài toán, người dùng và phạm vi được xác nhận.', points: 10, competencyIds: ['user-problem-understanding'], evidenceTemplateIds: ['problem-brief', 'user-feedback'], levels: { 1: 'Bài toán còn mơ hồ hoặc dựa chủ yếu trên phỏng đoán.', 2: 'Có mô tả người dùng và vấn đề nhưng bằng chứng còn hạn chế.', 3: 'Bài toán, người dùng, phạm vi và giả định được xác nhận bằng bằng chứng.', 4: 'Ngoài mức 3, chỉ ra được thay đổi trong hiểu biết sau các vòng phản hồi.' } },
        { id: 'final-acceptance', name: 'Đạt tiêu chí nghiệm thu', description: 'Sản phẩm mẫu đáp ứng tiêu chí đã thống nhất và có thể trình bày.', points: 15, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['problem-brief', 'experiment-log'], levels: { 1: 'Không có tiêu chí rõ hoặc chưa thể trình bày sản phẩm mẫu.', 2: 'Trình bày được một phần nhưng còn tiêu chí quan trọng chưa đạt.', 3: 'Đạt các tiêu chí nghiệm thu đã thống nhất và có bằng chứng kiểm tra.', 4: 'Ngoài mức 3, xử lý tốt trường hợp biên và giải thích các quyết định phạm vi.' } },
        { id: 'final-feedback', name: 'Phản hồi và cải tiến', description: 'Thu phản hồi thật và dùng phản hồi để cải tiến sản phẩm mẫu.', points: 10, competencyIds: ['user-problem-understanding', 'product-experimentation'], evidenceTemplateIds: ['user-feedback', 'experiment-log'], levels: { 1: 'Chưa có phản hồi từ người dùng hoặc người liên quan.', 2: 'Có phản hồi nhưng chưa thể hiện thay đổi hoặc quyết định tiếp theo.', 3: 'Có ít nhất hai vòng phản hồi hoặc xác nhận của người liên quan và cải tiến tương ứng.', 4: 'Ngoài mức 3, phân tích được mẫu phản hồi và ưu tiên thay đổi có lý do.' } },
        { id: 'final-handover', name: 'Trình bày, tài liệu và bàn giao', description: 'Người khác có thể hiểu, truy cập và tiếp tục làm việc với sản phẩm mẫu.', points: 10, competencyIds: ['collaboration-trust'], evidenceTemplateIds: ['final-handover'], levels: { 1: 'Thiếu phần trình bày hoặc thông tin bàn giao thiết yếu.', 2: 'Có phần trình bày và hướng dẫn cơ bản nhưng còn phụ thuộc vào giải thích trực tiếp.', 3: 'Trình bày rõ; tài liệu đủ để truy cập, kiểm thử và hiểu giới hạn.', 4: 'Ngoài mức 3, tài liệu súc tích, dễ tiếp tục và nêu rõ đề xuất tiếp theo.' } },
      ],
    },
    {
      id: 'final-competencies', name: 'Năng lực cốt lõi', description: 'Năm năng lực được quan sát qua quá trình làm sản phẩm.', points: 35,
      criteria: [
        { id: 'final-user-understanding', name: 'Hiểu người dùng và bài toán', description: 'Làm việc dựa trên nhu cầu và dữ kiện.', points: 8, competencyIds: ['user-problem-understanding'], evidenceTemplateIds: ['problem-brief', 'user-feedback'], levels: { 1: 'Cần người hướng dẫn xác định hầu hết vấn đề và người dùng.', 2: 'Hiểu nền tảng khi có câu hỏi định hướng.', 3: 'Chủ động xác nhận vấn đề và phân biệt dữ kiện với giả định.', 4: 'Nhất quán cập nhật hiểu biết và giúp nhóm ra quyết định dựa trên bằng chứng.' } },
        { id: 'final-experimentation', name: 'Tư duy sản phẩm và thử nghiệm', description: 'Thu hẹp phạm vi, thử và học có hệ thống.', points: 8, competencyIds: ['product-experimentation'], evidenceTemplateIds: ['experiment-log'], levels: { 1: 'Cần hỗ trợ nhiều để chọn phạm vi và cách thử.', 2: 'Thực hiện được thử nghiệm khi phạm vi đã rõ.', 3: 'Chủ động thiết kế vòng thử, đo kết quả và cải tiến.', 4: 'Nhất quán chọn thử nghiệm có giá trị học hỏi cao và giải thích được phương án cân bằng.' } },
        { id: 'final-ai-execution', name: 'Thực thi cùng AI', description: 'Dùng AI hiệu quả, kiểm chứng và an toàn.', points: 7, competencyIds: ['ai-assisted-execution'], evidenceTemplateIds: ['weekly-checkin', 'experiment-log'], levels: { 1: 'Dùng đầu ra AI nhưng chưa kiểm chứng hoặc chưa hiểu phần quan trọng.', 2: 'Kiểm tra được các đầu ra cơ bản khi có hướng dẫn.', 3: 'Chọn đúng việc, kiểm thử đầu ra và bảo vệ dữ liệu.', 4: 'Ngoài mức 3, so sánh phương án và ghi lại giới hạn để cải thiện cách làm.' } },
        { id: 'final-ownership', name: 'Chủ động học hỏi và chịu trách nhiệm', description: 'Quản lý tiến độ, vướng mắc và phản hồi.', points: 6, competencyIds: ['learning-ownership'], evidenceTemplateIds: ['weekly-checkin', 'final-handover'], levels: { 1: 'Thường chờ phân việc hoặc báo vướng mắc muộn.', 2: 'Hoàn thành việc có phạm vi rõ và báo cáo khi được hỏi.', 3: 'Chủ động bước tiếp theo, báo vướng mắc sớm và chuyển phản hồi thành hành động.', 4: 'Nhất quán tự điều chỉnh kế hoạch và chia sẻ bài học hữu ích.' } },
        { id: 'final-collaboration', name: 'Hợp tác và tin cậy', description: 'Giao tiếp trung thực, rõ ràng và có trách nhiệm.', points: 6, competencyIds: ['collaboration-trust'], evidenceTemplateIds: ['user-feedback', 'final-handover'], levels: { 1: 'Thông tin thiếu hoặc không nhất quán làm cản trở phối hợp.', 2: 'Phối hợp được trong nhịp làm việc đã có cấu trúc.', 3: 'Cập nhật đúng lúc, tiếp nhận phản hồi và nêu rõ giới hạn.', 4: 'Tạo được niềm tin qua bằng chứng rõ và hỗ trợ phối hợp hiệu quả.' } },
      ],
    },
    {
      id: 'final-process', name: 'Quá trình và bằng chứng', description: 'Chất lượng sổ tay thực tập, giao tiếp và tự phản tư.', points: 20,
      criteria: [
        { id: 'final-journal', name: 'Sổ tay thực tập và bằng chứng', description: 'Các biểu mẫu cần thiết được điền bằng dữ kiện có thể đối chiếu.', points: 8, competencyIds: ['learning-ownership', 'collaboration-trust'], evidenceTemplateIds: ['problem-brief', 'weekly-checkin', 'user-feedback', 'experiment-log', 'final-handover'], levels: { 1: 'Sổ tay thực tập thiếu phần lớn nội dung hoặc chỉ có nhận định chung.', 2: 'Có ghi chép cơ bản nhưng thiếu liên kết, kết quả hoặc nguồn phản hồi.', 3: 'Sổ tay thực tập đầy đủ phần cần thiết và có bằng chứng đối chiếu được.', 4: 'Ngoài mức 3, ghi chép súc tích và cho thấy rõ tiến trình học qua thời gian.' } },
        { id: 'final-communication', name: 'Giao tiếp và vướng mắc', description: 'Tiến độ, rủi ro và nhu cầu hỗ trợ được thông báo đúng lúc.', points: 6, competencyIds: ['learning-ownership', 'collaboration-trust'], evidenceTemplateIds: ['weekly-checkin'], levels: { 1: 'Vướng mắc hoặc thay đổi quan trọng không được cập nhật kịp thời.', 2: 'Có cập nhật theo lịch nhưng đôi lúc thiếu bước tiếp theo.', 3: 'Cập nhật rõ tiến độ, vướng mắc, điều đã thử và hỗ trợ cần thiết.', 4: 'Ngoài mức 3, chủ động điều chỉnh cách giao tiếp theo người liên quan.' } },
        { id: 'final-reflection', name: 'Tiếp nhận phản hồi và tự phản tư', description: 'Biến phản hồi thành thay đổi cụ thể và rút ra bài học.', points: 6, competencyIds: ['product-experimentation', 'learning-ownership'], evidenceTemplateIds: ['user-feedback', 'experiment-log', 'final-handover'], levels: { 1: 'Khó chỉ ra phản hồi đã nhận hoặc thay đổi sau phản hồi.', 2: 'Tiếp nhận phản hồi nhưng hành động cải tiến còn chung chung.', 3: 'Nêu rõ phản hồi, quyết định, thay đổi và điều học được.', 4: 'Ngoài mức 3, nhận ra mẫu lặp lại và điều chỉnh phương pháp làm việc.' } },
      ],
    },
  ],
  resultBands: [
    { minScore: 80, label: 'Vượt kỳ vọng thực tập sinh', description: 'Kết quả và quá trình vượt chuẩn chương trình.' },
    { minScore: 65, label: 'Đạt chương trình', description: 'Đáp ứng chuẩn đầu ra của thực tập sinh xây dựng sản phẩm.' },
    { minScore: 50, label: 'Chưa đạt, cần kế hoạch bổ sung', description: 'Cần bổ sung bằng chứng hoặc cải thiện các tiêu chí còn thiếu.' },
    { minScore: 0, label: 'Không đạt', description: 'Chưa đáp ứng chuẩn đầu ra hiện tại.' },
  ],
};

export const FINAL_SCORECARD_GATES: FinalScorecardGate[] = [
  { id: 'prototype-accessible', label: 'Có một sản phẩm mẫu truy cập hoặc trình bày được', description: 'Hội đồng có thể mở hoặc xem phần trình bày luồng chính.' },
  { id: 'acceptance-evidence', label: 'Tiêu chí nghiệm thu đã thống nhất và có bằng chứng đạt', description: 'Kết quả kiểm tra được đối chiếu với tiêu chí đã chốt.' },
  { id: 'feedback-evidence', label: 'Có tối thiểu hai vòng phản hồi hoặc một người liên quan xác nhận', description: 'Phản hồi có nguồn và thể hiện tác động tới sản phẩm.' },
  { id: 'integrity-safety', label: 'Bằng chứng trung thực và dữ liệu được sử dụng an toàn', description: 'Không làm giả kết quả, che giấu lỗi hoặc dùng dữ liệu trái quy định.' },
  { id: 'council-confirmed', label: 'Hội đồng xác nhận kết quả đạt', description: 'Kết luận cuối cùng cần được Hội đồng đối chiếu và xác nhận.' },
];

export const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'problem-brief', title: '01. Bản mô tả vấn đề và kết quả', description: 'Chốt người dùng, vấn đề, phạm vi sản phẩm mẫu và cách xác định kết quả đã đạt.', whenToUse: 'Điền ở đầu chương trình và cập nhật khi hiểu biết về bài toán thay đổi.', minimumEvidence: ['Nguồn xác nhận vấn đề', 'Tiêu chí nghiệm thu đã thống nhất', 'Liên kết tài liệu hoặc sản phẩm mẫu nếu có'], competencyIds: ['user-problem-understanding', 'product-experimentation'],
    fields: [
      { key: 'productName', label: 'Tên sản phẩm mẫu', type: 'text', placeholder: 'Ví dụ: Công cụ tổng hợp phản hồi cửa hàng', required: true },
      { key: 'problem', label: 'Người dùng đang gặp vấn đề gì?', type: 'textarea', placeholder: 'Mô tả người dùng, bối cảnh và vấn đề đã quan sát...', required: true },
      { key: 'evidence', label: 'Bằng chứng ban đầu', type: 'textarea', placeholder: 'Nguồn phỏng vấn, dữ liệu, liên kết hoặc ghi chú xác nhận...', required: true },
      { key: 'outcome', label: 'Kết quả mong đợi', type: 'textarea', placeholder: 'Điều gì sẽ tốt hơn cho người dùng nếu sản phẩm mẫu có ích?', required: true },
      { key: 'acceptanceCriteria', label: 'Tiêu chí nghiệm thu', type: 'textarea', placeholder: 'Liệt kê 2-4 tiêu chí có thể kiểm tra...', required: true },
      { key: 'scope', label: 'Phạm vi làm và chưa làm', type: 'textarea', placeholder: 'Nêu phạm vi sản phẩm mẫu và phần chủ động chưa thực hiện...', required: true },
    ],
  },
  {
    id: 'weekly-checkin', title: '02. Kế hoạch và trao đổi hằng tuần', description: 'Theo dõi cam kết ngắn hạn, tiến độ, vướng mắc và nhu cầu hỗ trợ.', whenToUse: 'Điền đầu tuần và cập nhật trước buổi trao đổi với người hướng dẫn.', minimumEvidence: ['Liên kết công việc hoặc bản dùng thử', 'Trạng thái cam kết', 'Vướng mắc và điều đã thử'], competencyIds: ['ai-assisted-execution', 'learning-ownership', 'collaboration-trust'],
    fields: [
      { key: 'period', label: 'Tuần và khoảng thời gian', type: 'text', placeholder: 'Ví dụ: Tuần 3, 15/06-19/06', required: true },
      { key: 'commitments', label: 'Cam kết và kết quả mong đợi', type: 'textarea', placeholder: 'Tối đa ba kết quả cụ thể của tuần...', required: true },
      { key: 'progress', label: 'Tiến độ và bằng chứng', type: 'textarea', placeholder: 'Đã hoàn thành gì? Kèm liên kết hoặc kết quả kiểm tra...', required: true },
      { key: 'blockers', label: 'Vướng mắc, điều đã thử và hỗ trợ cần thiết', type: 'textarea', placeholder: 'Nêu rõ vướng mắc, cách đã thử và người có thể hỗ trợ...', required: true },
      { key: 'aiUsage', label: 'AI đã hỗ trợ gì và bạn kiểm chứng ra sao?', type: 'textarea', placeholder: 'Nêu tác vụ, cách kiểm tra và giới hạn nhận thấy...', required: true },
      { key: 'nextStep', label: 'Bước tiếp theo', type: 'textarea', placeholder: 'Hành động cụ thể tiếp theo và thời điểm dự kiến...', required: true },
    ],
  },
  {
    id: 'user-feedback', title: '03. Ghi chú phỏng vấn và phản hồi người dùng', description: 'Lưu phản hồi có nguồn để kiểm chứng vấn đề và cải tiến sản phẩm mẫu.', whenToUse: 'Điền sau mỗi buổi phỏng vấn, trình bày sản phẩm hoặc nhận phản hồi từ người liên quan.', minimumEvidence: ['Vai trò người phản hồi hoặc nguồn ẩn danh', 'Ghi chú phản hồi', 'Quyết định sau phản hồi'], competencyIds: ['user-problem-understanding', 'product-experimentation', 'collaboration-trust'],
    fields: [
      { key: 'session', label: 'Thời điểm và nguồn phản hồi', type: 'text', placeholder: 'Ví dụ: Trình bày ngày 18/06 với đại diện vận hành; không ghi dữ liệu nhạy cảm', required: true },
      { key: 'context', label: 'Bối cảnh và mục tiêu buổi trao đổi', type: 'textarea', placeholder: 'Bạn muốn kiểm chứng điều gì?', required: true },
      { key: 'feedback', label: 'Phản hồi quan sát được', type: 'textarea', placeholder: 'Ghi ý chính, hành vi hoặc câu nói đã được ẩn danh...', required: true },
      { key: 'insight', label: 'Điều học được', type: 'textarea', placeholder: 'Phản hồi xác nhận hoặc bác bỏ giả định nào?', required: true },
      { key: 'decision', label: 'Quyết định và thay đổi tiếp theo', type: 'textarea', placeholder: 'Giữ, đổi hoặc chưa làm gì? Vì sao?', required: true },
      { key: 'evidenceLink', label: 'Liên kết bằng chứng', type: 'text', placeholder: 'Liên kết ghi chú, ảnh trình bày hoặc phiếu công việc được phép chia sẻ', required: true },
    ],
  },
  {
    id: 'experiment-log', title: '04. Nhật ký thử nghiệm và trình bày sản phẩm', description: 'Ghi lại giả định, cách thử, kết quả thật và quyết định sau mỗi vòng.', whenToUse: 'Điền khi thử một giả định quan trọng, trình bày sản phẩm mẫu hoặc kiểm tra tiêu chí nghiệm thu.', minimumEvidence: ['Kết quả kiểm thử hoặc trình bày', 'Liên kết phiên bản sản phẩm mẫu', 'Quyết định dựa trên kết quả'], competencyIds: ['product-experimentation', 'ai-assisted-execution', 'learning-ownership'],
    fields: [
      { key: 'experiment', label: 'Giả định hoặc câu hỏi cần kiểm chứng', type: 'textarea', placeholder: 'Ví dụ: Người dùng có thể hoàn thành luồng tạo báo cáo trong 3 phút', required: true },
      { key: 'method', label: 'Cách thử và tiêu chí đạt', type: 'textarea', placeholder: 'Ai thử, thử luồng nào và kết quả nào được tính là đạt?', required: true },
      { key: 'result', label: 'Kết quả và bằng chứng', type: 'textarea', placeholder: 'Số liệu, lỗi quan sát, liên kết bản dùng thử hoặc ảnh kết quả...', required: true },
      { key: 'learning', label: 'Điều học được', type: 'textarea', placeholder: 'Điều gì đúng, sai hoặc còn chưa chắc?', required: true },
      { key: 'decision', label: 'Quyết định tiếp theo', type: 'textarea', placeholder: 'Giữ, sửa, bỏ hoặc thử tiếp điều gì?', required: true },
      { key: 'aiCheck', label: 'Phần AI hỗ trợ và cách kiểm chứng', type: 'textarea', placeholder: 'Nêu phần AI tạo, phép kiểm thử đã chạy và giới hạn còn lại...', required: true },
    ],
  },
  {
    id: 'final-handover', title: '05. Tổng kết và bàn giao cuối kỳ', description: 'Tổng kết kết quả, bài học và thông tin đủ để người khác tiếp tục với sản phẩm mẫu.', whenToUse: 'Điền trong giai đoạn chuẩn bị trình bày và đánh giá cuối kỳ.', minimumEvidence: ['Liên kết sản phẩm mẫu hoặc bản trình bày', 'Kết quả tiêu chí nghiệm thu', 'Giới hạn và bước tiếp theo'], competencyIds: ['ai-assisted-execution', 'learning-ownership', 'collaboration-trust'],
    fields: [
      { key: 'prototypeLink', label: 'Liên kết sản phẩm mẫu hoặc bản trình bày', type: 'text', placeholder: 'Đường dẫn truy cập hoặc liên kết video trình bày', required: true },
      { key: 'outcomes', label: 'Kết quả so với tiêu chí nghiệm thu', type: 'textarea', placeholder: 'Tiêu chí nào đạt, chưa đạt và bằng chứng tương ứng...', required: true },
      { key: 'feedbackSummary', label: 'Phản hồi đã nhận và thay đổi đã thực hiện', type: 'textarea', placeholder: 'Tóm tắt các vòng phản hồi và tác động tới sản phẩm mẫu...', required: true },
      { key: 'setup', label: 'Cách truy cập, chạy thử hoặc tiếp tục', type: 'textarea', placeholder: 'Hướng dẫn vừa đủ; không ghi mật khẩu, khóa API hoặc thông tin đăng nhập thật', required: true },
      { key: 'limitations', label: 'Giới hạn, lỗi còn lại và lưu ý an toàn', type: 'textarea', placeholder: 'Nêu trung thực điều chưa hoàn thiện và rủi ro cần biết...', required: true },
      { key: 'reflection', label: 'Bài học và bước tiếp theo', type: 'textarea', placeholder: 'Bạn đã thay đổi cách hiểu hoặc cách làm như thế nào?', required: true },
    ],
  },
];
