# Content Patterns

> Writing patterns, bilingual conventions, content structure, và voice/tone của YODY ITDX EA Portal.

---

## Voice & Tone

### Persona
Portal nói chuyện với **ban lãnh đạo YODY** (C-suite, Board) và **team ITDX** nội bộ — không phải end-users hay external audience.

**Giọng văn:**
- Authoritative nhưng không arrogant
- Data-driven — mọi claim có số
- Strategic — luôn kết nối tới IPO 2030
- Transparent về gaps — không che giấu thực trạng

### Tone per section type:
| Section | Tone |
|---------|------|
| Vision/Hero | Aspirational, momentum |
| Data/Status | Factual, precise |
| Analysis/Insight | Confident, evidence-based |
| GAP/Risk | Transparent, solution-focused |
| CTA | Action-oriented |

---

## Bilingual Convention

### Rule 1: Vietnamese for narrative
```
Hành trình AI-native, nơi ITDX truyền tinh thần craftsmanship 
để mỗi cá nhân là một kỹ sư công nghệ tự chuyển đổi số chính phòng ban của mình.
```

### Rule 2: English for technical terms (never translate)
```
❌ "Quản lý vòng đời sản phẩm"  
✅ "PLM — Product Lifecycle Management"

❌ "Hệ thống quản lý thông tin tổng thể"
✅ "ERP (SAP, Oracle)"

❌ "Mô hình trưởng thành hóa số"
✅ "DMI — Digital Maturity Index"
```

### Rule 3: Code-switching is natural
```
Platform tự xây in-house theo chuẩn industry.
Theme 2028 Personalized CX (design-AI cho fast-fashion).
```

### Rule 4: Platform/product names stay English
```
PHOENIX · UNICORN · IRIS · GLAUX · ATLAS · AEGIS
PLM · OMS · CDP · APS · WMS · TMS · GRC · SIEM
```

### Rule 5: Vietnamese labels for UI, English for code
```
Đội: SIGMA          ← Vietnamese label
Squad: SIGMA        ← Both acceptable
squad name: SIGMA   ← In code context
```

---

## Heading Content Patterns

### H1 — "What + Why" structure
```
# [What we're looking at]
*[why it matters or key insight]*
```

Examples:
- `# Hành trình đến năm 2030` — what
- `# Value Stream *và* Platforms` — what + emphasis
- `# Sức khỏe *DMI* Health Dashboard` — what + metric name

### H2 — "Claim + Evidence" structure
```
## [Specific claim or description]
```

Often bold-emphasizes the key metric or insight:
```
## Mỗi đồng đầu tư · *~2.4× trở lại*
## Cam kết với 5 mục tiêu *chiến lược*
## YODY ưu tiên BUILD ở core fashion-retail, BUY commodity
```

---

## Lead Paragraph Pattern

Sau H1 hoặc H2, lead paragraph thường dùng bullet list với **first bullet as summary**:

```markdown
- **[Bold summary claim]** — further context.
- [Supporting point 2]
```

Ví dụ:
```markdown
- Chương 04 trả lời câu hỏi **"Khi nào? Đi đến đâu rồi? Lấy gì làm bằng chứng?"** — phần proof-of-progress của portal...
- **Sáu nền tảng** vận hành **tám giai đoạn kinh doanh** — từ thiết kế đến tay khách hàng.
```

---

## Metric + Context Pattern

Khi đưa ra số liệu, luôn kèm:
1. Số chính (bold)
2. Đơn vị
3. Context/timeframe
4. Source hoặc methodology (footnote)

```
Đầu tư CN&CĐS / năm: **1.6 – 1.8%** đạt chuẩn đầu tư Fashion global 
(McKinsey 2022) · dẫn trước ngành Bán lẻ VN ~5 năm
```

```
ROI luỹ kế / Đầu tư · 2026-2030: **~2.4×**
```

---

## Proof Pattern (3P Framework)

Trong các section về principles, mỗi principle kèm "Proof":

```
### AI-Native
Mọi nền tảng được thiết kế ưu tiên AI/ML ngay từ đầu...

Proof: ATLAS đã phân phối insights cho 800 người dùng nội bộ. [→ chi tiết]
```

```
### Build vs Buy
Tự xây các năng lực cốt lõi...

Proof: 0/6 platform thuần BUY · 78 products · BUILD/HYBRID chiếm ~78% ở core. [→ bức tranh hiện trạng]
```

Pattern: Bold "Proof:" label + 1 sentence evidence + link.

---

## Competitor Comparison Pattern

```
Đối thủ cần: [time estimate]
```

Always at the end of competitive advantage cards. Frames the advantage in time-to-replicate terms:
```
Tốc độ ra mắt         → Đối thủ cần: 3-6 tháng
Năng lực tự xây       → Đối thủ cần: 1-2 năm
Đòn bẩy AI · dữ liệu → Đối thủ cần: 3-5 năm
Hấp dẫn nhân tài      → Đối thủ cần: khó tái tạo
Niềm tin đầu tư       → Đối thủ cần: rất khó copy
```

---

## Product Description Structure

Product cards follow a consistent structure:

```
[Status] [★ if flagship]

### [Product Name]
[Product type / category in English]

[1-2 sentence description in Vietnamese with English technical terms inline]

[Module list if complex: Phase1 · Phase2 · etc.]

[BUILD/BUY/HYBRID] · [Team] → [Timeline]
[Theme context] · [Optional POC/strategy note]
```

Example:
```
DEV ★

### APS
Advanced Planning System + Pricing & Markdown Engine

Lập kế hoạch sản xuất, tồn kho mùa vụ, dự báo nhu cầu, 
allocation cross-store, pricing & markdown optimization...

Planning core (P1 Q3.2026) · Demand & Allocation (P2 Q2.2027) · 
Pricing & Markdown (P3 2028) · 11 modules

BUILD · P. Cung ứng, P. Vận hành Hàng hóa → Q3.2026 (P1)
Theme 2026 SC E2E (P1 Planning) → Theme 2027 Data/AI
```

---

## Blocker/GAP Description Pattern

```
● GAP

[System Name]
[System description in English]

[Vietnamese explanation — why it's a gap, what's missing]

[IPO context label] → [Timeline]
[Action note — e.g., "chờ BoD approve ngân sách", "Strategic defer"]
```

Example:
```
● GAP

DLP (Data Loss Prevention)

Chống thất thoát dữ liệu trên endpoint + cloud + email — 
chưa có hệ thống, chưa có plan + ngân sách triển khai. 
Yêu cầu ITGC trước IPO.

IPO 2030 Readiness → TBD — chờ BoD approve ngân sách
```

---

## Section Transition Pattern

Từ section này sang section khác, thường có transition sentence:

```
Kết luận

**2028 là điểm đòn bẩy**: sau 2 năm đầu tư nền tảng, 
công nghệ bắt đầu sinh lời...
```

Kết luận sections: bold key phrase + 1-2 sentence synthesis.

---

## Citation Pattern

External sources cited with arrow:
```
McKinsey 2022 · BCG 2023 · Bain 2024
```

In footnotes:
```
* **ROI công nghệ (dự phóng)** = tiết kiệm vận hành nhờ tự động hoá + doanh thu tăng 
nhờ công nghệ (giảm bớt 50% so với benchmark ngành cho dự phóng thận trọng — 
McKinsey 2024, BCG 2023, Bain 2024).
```

---

## Numbers Style Guide

| Format | Example | Rule |
|--------|---------|------|
| Revenue (tỷ VND) | `2.800 tỷ`, `5.806 tỷ` | Period as thousands separator |
| Percentage | `+20%/năm`, `61%` | No space between number and % |
| Range | `6–12%`, `2026–2030` | En dash, no spaces |
| Approximate | `~2.4×`, `~865 tỷ` | Tilde prefix |
| Quarter | `Q3.2026`, `Q1.2027` | Q + number + dot + year |
| Count | `60+`, `800` | Plus for "at least" |
| Ratio | `18/86`, `41/86` | Slash format |
| DMI | `32 DMI`, `65 DMI` | Number + space + "DMI" |

---

## Vietnamese-specific Patterns

### Formal address
Tài liệu dùng ngôi thứ ba ("YODY", "ITDX") thay vì "chúng tôi" trong hầu hết contexts.

### Section intro phrases
```
"Khám phá..." (Explore)
"Tìm hiểu..." (Learn)
"Đi sâu vào..." (Deep dive)
```

### Milestone language
```
"★ 2030 · IPO" — star marks the ultimate milestone
"IPO 2030 Readiness" — readiness label
"Điểm hoà vốn" — breakeven point
"Điểm đòn bẩy" — leverage/inflection point
```

### Team references
```
"3 BP · 7 squad" — abbreviated org reference
"P. Sản phẩm" → "Phòng Sản phẩm" → squad DELTA (context-dependent)
"HOD: [Name]" — Head of Department format
"TBP: [Name]" — Technical Business Partner
```
