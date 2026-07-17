#!/usr/bin/env bash
set -euo pipefail

[ -f .env ] && { set -a; . ./.env; set +a; }

: "${TELEGRAM_BOT_TOKEN:?Thiếu TELEGRAM_BOT_TOKEN trong .env}"
: "${TELEGRAM_CHAT_ID:?Thiếu TELEGRAM_CHAT_ID trong .env}"

[ "$#" -ge 1 ] || { echo "Cách dùng: send-telegram.sh <file.html>"; exit 1; }

[ -r "$1" ] || { echo "Lỗi: không đọc được file '$1'" >&2; exit 1; }

curl -sS "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="$TELEGRAM_CHAT_ID" \
  --data-urlencode "text=$(cat "$1")" \
  -d parse_mode=HTML \
  -d disable_web_page_preview=true
