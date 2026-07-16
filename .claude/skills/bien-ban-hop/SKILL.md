---
name: bien-ban-hop
description: Tổng hợp ghi chú/transcript cuộc họp thành biên bản gọn kèm danh
  sách việc cần làm. Dùng khi người dùng dán nội dung họp và muốn tóm tắt hoặc
  trích các đầu việc, người phụ trách, hạn chót.
---

# Tổng hợp biên bản cuộc họp

## Khi nào dùng
Khi người dùng dán ghi chú hoặc transcript cuộc họp và muốn:
- Một biên bản gọn, dễ đọc, hoặc
- Một danh sách việc cần làm (ai làm, làm gì, hạn nào).

## Quy trình
1. Đọc kỹ nội dung, xác định: chủ đề cuộc họp, người tham dự, các quyết định chính.
2. Trình bày kết quả theo đúng mẫu trong `assets/mau-bien-ban.md`.
3. Trích mọi đầu việc thành bảng: Việc | Người phụ trách | Hạn chót.
4. Nếu thiếu người phụ trách hoặc hạn chót → ghi "cần làm rõ", KHÔNG tự bịa.
5. Nếu có vấn đề chưa chốt → đưa vào mục "Vấn đề còn treo".
6. Hỏi người dùng: "Gửi biên bản lên Telegram không?".
   - Nếu KHÔNG → kết thúc.
   - Nếu CÓ:
     a. Sinh phiên bản HTML từ biên bản: tiêu đề → `<b>`, nhấn mạnh → `<i>`, bảng → bọc trong `<pre>`. Thoát mọi `< > &` trong nội dung chữ.
     b. Ghi vào `/tmp/bienban-hop.html`.
     c. Chạy: `bash .claude/skills/bien-ban-hop/scripts/send-telegram.sh /tmp/bienban-hop.html` (phải chạy từ root repo — nơi chứa `.env`; nếu CWD khác thì `cd` về root trước).
     d. Đọc response: `ok=true` → báo "đã gửi"; `ok=false` → in lỗi + mô tả cho người dùng.
     e. Nếu thiếu token (script báo thiếu env) → hướng dẫn tạo `.env` ở root theo mục **Gửi lên Telegram** phía dưới, rồi thử lại.

## Nguyên tắc
- Ngắn gọn, đúng sự thật trong ghi chú; không thêm thông tin không có.
- Giữ tên riêng, số liệu, ngày tháng đúng như nguồn.
- Ngôn ngữ đầu ra theo ngôn ngữ của ghi chú (mặc định tiếng Việt).

## Gửi lên Telegram (tùy chọn)
Script `.claude/skills/bien-ban-hop/scripts/send-telegram.sh` chỉ vận chuyển.
Cần `.env` ở root repo (đã gitignored) chứa:

```
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

Định dạng gửi: HTML (`parse_mode=HTML`). Chỉ thoát `< > &`; tag cho phép: `b i u s a code pre`.
Luôn hỏi người dùng trước khi gửi.
