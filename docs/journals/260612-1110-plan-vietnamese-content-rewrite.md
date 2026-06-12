---
title: "Lập kế hoạch viết lại nội dung tiếng Việt"
date: "2026-06-12"
type: "planning-journal"
---

# Lập kế hoạch viết lại nội dung tiếng Việt

## Bối cảnh

Phương án viết lại toàn diện nội dung ứng dụng chính đã được duyệt. Trang
`/intro` nằm ngoài phạm vi; mỗi thực tập sinh chỉ đảm nhận một trong bốn sản
phẩm.

## Những việc đã thực hiện

- Kiểm tra kế hoạch đang dở và xác nhận không có kế hoạch giao nhau.
- Rà soát nguồn nội dung dùng chung, chuỗi nhúng trong giao diện và hai điểm cuối
  trợ lý AI.
- Tạo kế hoạch bốn giai đoạn: kiểm kê, dữ liệu dùng chung, giao diện và AI, kiểm
  tra hồi quy.
- Xác định ranh giới tệp, hợp đồng nội dung, rủi ro và lệnh kiểm tra.

## Quyết định

- Thực hiện tuần tự vì `src/data.ts` được nhiều trang dùng chung.
- Không thêm lớp dịch thuật, thư viện hoặc bộ kiểm thử mới.
- Không đổi ID, khóa dữ liệu, route, số liệu hoặc tiêu chí nghiệp vụ.
- Bù thiếu kiểm thử tự động bằng tìm kiếm tĩnh, kiểm tra diff và rà soát trực
  quan theo danh sách trang.

## Tiếp theo

Triển khai theo
`plans/260612-1110-vietnamese-content-rewrite/plan.md`, bắt đầu từ kiểm kê và khóa
quy tắc nội dung.
