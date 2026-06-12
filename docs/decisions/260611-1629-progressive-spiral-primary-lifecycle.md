---
title: "Progressive Spiral làm Coaching Lifecycle chính"
status: accepted
date: "2026-06-11"
scope: "Coaching Lifecycle routes and UI"
---

# Progressive Spiral làm Coaching Lifecycle chính

## Context

`/lifecycle` hiện ưu tiên tra cứu nội dung đầy đủ. `/lifecycle-concept-c` kể câu
chuyện phát triển tốt hơn nhưng 15 card đặt bằng tọa độ tuyệt đối gây chồng chéo
và làm người dùng khó tìm thông tin.

Mục tiêu mới: dùng spiral làm trải nghiệm chính, vẫn giữ bản nội dung đầy đủ
trong một click.

## Decision

Chọn **Progressive Spiral**:

- `/lifecycle` là trang Coaching Lifecycle chính.
- `/lifecycle-detail` chứa nội dung đầy đủ hiện có.
- `/lifecycle-concept-c` redirect sang `/lifecycle` để giữ link cũ.
- Spiral chỉ hiển thị card cho 5 bước của tháng đang chọn.
- Hai tháng còn lại chỉ hiển thị vòng và marker nhỏ, không có card text.
- Month selector nằm trên spiral; node detail nằm cạnh spiral trên desktop.
- Mobile/tablet dùng stacked loop cards, không thu nhỏ spiral desktop.
- Hai trang có liên kết qua lại dễ thấy.

## Rationale

- Giữ điểm mạnh storytelling của concept C.
- Loại bỏ nguyên nhân collision thay vì tiếp tục tinh chỉnh 15 tọa độ.
- Giảm mật độ thị giác và số control trong tab order.
- Giữ bản detail để người dùng tra cứu competency, evidence và monthly gate.
- Không fork dữ liệu; cả hai trang tiếp tục dùng `COACHING_LIFECYCLE_DATA`.

## Consequences

### Positive

- Người dùng hiểu mô hình ba vòng nhanh hơn.
- Spiral ổn định hơn tại nhiều chiều rộng.
- Bản chi tiết luôn truy cập được trong một click.
- Chi phí bảo trì geometry giảm.

### Trade-offs

- Không còn thấy tên đủ 15 node cùng lúc.
- So sánh chi tiết giữa ba tháng diễn ra tại `/lifecycle-detail`.
- Cần kiểm chứng route redirect, keyboard, mobile và dark mode.

## Scope Boundary

- Không sửa nội dung hoặc schema trong `src/data.ts` và `src/types.ts`.
- Không sửa Profile, Journal hoặc Scorecard.
- Không thêm dependency, backend, analytics hoặc chart library.

## Acceptance Criteria

- Không có node/card chồng chéo tại `1024px`, `1280px`, `1440px`.
- Chỉ 5 node của tháng active hiển thị card text.
- `/lifecycle-detail` truy cập được từ spiral trong một click.
- `/lifecycle-concept-c` redirect ổn định sang `/lifecycle`.
- Mobile không horizontal scroll; keyboard, focus, dark mode và reduced motion đạt.

## Alternatives Considered

- Hiển thị đủ 15 card: loại bỏ vì tiếp tục gây collision và quá tải thị giác.
- Spiral + step filter: hoãn vì thêm tầng điều khiển chưa cần thiết.
- Spiral toàn màn hình + detail drawer: loại bỏ vì ẩn nội dung và tăng thao tác.
