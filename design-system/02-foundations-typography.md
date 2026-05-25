# Typography — Foundations

> Hệ thống typography của YODY ITDX EA Portal — type scale, heading patterns, và nguyên tắc bilingual text.

---

## Font Stack

Portal sử dụng Tailwind CSS defaults với system font stack, có thể có custom web font load qua Next.js. Inferred từ visual styling:

```css
/* Heading / Display */
font-family: var(--font-heading); /* likely a geometric/modern sans */

/* Body / Prose */
font-family: var(--font-body); /* readable sans-serif */

/* Code / Technical */
font-family: ui-monospace, SFMono-Regular, 'SF Mono', Consolas, monospace;
```

---

## Type Scale

| Level | Element | Size (est.) | Weight | Usage |
|-------|---------|-------------|--------|-------|
| Display | Hero H1 | 3–4rem | 700–900 | Page hero titles |
| H1 | Section title | 2–3rem | 700 | `# Title` in markdown, `<h1>` |
| H2 | Section header | 1.5–2rem | 600–700 | `## Title` pattern |
| H3 | Sub-header | 1.25rem | 600 | Product names, card titles |
| Body Large | Lead paragraph | 1.125rem | 400 | First paragraph under H1/H2 |
| Body | Prose | 1rem | 400 | Explanatory text, description |
| Small | Labels, metadata | 0.875rem | 400–500 | Tags, badges, captions |
| Micro | Footnotes, legal | 0.75rem | 400 | Version info, citations |

---

## Heading Patterns

### H1 — Hero Title Pattern
H1 thường xuất hiện ở đầu mỗi trang, theo pattern:

```
# Từ khoá chính  
*từ được nhấn mạnh*
```

**Ví dụ thực tế:**
```markdown
# Hành trình  đến năm 2030
# Value Stream *và* Platforms
# Sức khỏe *DMI* Health Dashboard
# 5 chặng dẫn lối tới IPO 2030
```

**Pattern rules:**
- Dòng đầu: keyword chính bằng tiếng Việt
- Từ được italicize (`*...*`) là từ nhấn mạnh semantic — thường là thuật ngữ kỹ thuật hoặc từ quan trọng
- Line break giữa heading tạo breathing room visual
- Mixed Vi/En trong cùng một heading là bình thường

### H2 — Section Title Pattern
```
## [Tên section] *[từ emphasized]*
```

**Ví dụ:**
```markdown
## Cam kết với 5 mục tiêu *chiến lược*
## Mỗi đồng đầu tư · *~2.4× trở lại*
## YODY ưu tiên BUILD ở core fashion-retail, BUY commodity
## Mỗi platform có những phần mềm gì, làm gì, và thiếu gì tới 2030
```

### H3 — Product/Component Title
```
### [Product Name hoặc Component Name]
```

**Ví dụ:**
```markdown
### YODY PLM
### APS
### AI-Native
### Build vs Buy
```

H3 thường đi kèm subtitle/tagline ngay dưới:
```markdown
### APS
Advanced Planning System + Pricing & Markdown Engine
```

---

## Text Emphasis Patterns

### Bold — Key metrics & terms
```markdown
**tinh thần** craftsmanship
**5 mục tiêu chiến lược**
**2.800 tỷ**
**DMI** — Chỉ số trưởng thành về số hoá
```
Bold dùng cho: số liệu quan trọng, thuật ngữ định nghĩa lần đầu, key phrases.

### Italic — Inline emphasis
```markdown
*AI-Native*
*đỉnh*
*~2.4× trở lại*
```
Italic trong heading = visual emphasis. Trong body = gentle emphasis.

### Mixed Bold + Italic (hiếm)
```markdown
***ROI công nghệ (dự phóng)***
```
Dùng cho label của footnote/disclaimer quan trọng.

---

## Special Characters & Symbols

| Symbol | Unicode | Usage |
|--------|---------|-------|
| `·` | U+00B7 | Section separator, subtitle divider |
| `→` | U+2192 | Navigation CTA, "go to" links |
| `←` | U+2190 | Back navigation |
| `↑` | U+2191 | "Back to top" |
| `↗` | U+2197 | External link indicator |
| `★` | U+2605 | Featured/flagship item |
| `⚠` | U+26A0 | Warning/GAP indicator |
| `●` | U+25CF | Filled circle — GAP status |
| `○` | U+25CB | Outline circle — PLAN status |
| `◇` | U+25C7 | Diamond — VENDOR/external |
| `▾` | U+25BE | Chevron — expandable/accordion |
| `—` | U+2014 | Em dash — subtitle separator |
| `×` | U+00D7 | Multiplication — "8 stages × 6 platforms" |

---

## Separator Patterns

```
·        Middle dot — inline separator trong labels và titles
—        Em dash — separates chapter theme from section name
×        In cross-product descriptions: "8 stage × 6 platform"
─────    Horizontal rule — timeline bar, visual dividers
/        Slash — ratios, alternative options: "6-12%"
```

---

## Number & Metric Typography

| Pattern | Example | Usage |
|---------|---------|-------|
| Large metric + unit | `5.806 tỷ` | KPI cards, hero stats |
| Percentage | `+20%/năm`, `34%` | Growth rates, proportions |
| Range | `6–12%`, `2026–2030` | Range values (en dash) |
| Multiplier | `~2.4×` | ROI, multipliers |
| Ratio | `86/100`, `41/86` | Scores, counts |
| Approximation | `~865 tỷ`, `60+` | Estimated values |
| Ordinal | `Q1.2027`, `Q3.2026` | Quarter + year |

---

## Chapter Label Pattern

Mỗi trang bắt đầu bằng chapter breadcrumb:

```
Chương [XX] · [Theme] — [Section Title]
```

**Ví dụ:**
- `Chương 01 · AI-native × Craftsmanship`
- `Chương 02 · Bức tranh — Value Stream & Platforms`
- `Chương 04 · Hành trình — Sức khoẻ`

Typography của chapter label: small, muted, uppercase or tracking — distinct từ main H1.

---

## Section Roman Numeral Dividers

Mỗi section trong trang được đánh số La Mã (I, II, III, IV, V, VI...):

```
I
[Tên section ngắn]

II
[Tên section ngắn]
```

Typography: large display, very muted/subtle, acts as decorative divider.

---

## List & Bullet Patterns

### Bullet points — lead paragraph breakdown
```markdown
- **Sáu nền tảng** vận hành **tám giai đoạn kinh doanh** — từ thiết kế đến tay khách hàng.
- Mỗi nền tảng có một đội chuyên trách.
```

### Numbered roadmap items
```markdown
1. PLAN · 3Design · 3Source · 3Execute · 4▾ 13 modules
2. Phase 1 Q3.2026 → Phase 2 Q2.2027 → Phase 3 2028
```

### Footnotes pattern
```markdown
* **DMI** — Chỉ số trưởng thành về số hoá của tổ chức. [Xem cách tính chi tiết↗](url)
```

---

## Bilingual Typography Rules

1. **Tiếng Việt** cho narrative, context, và emotional copy
2. **Tiếng Anh** cho: platform names, product names, technical terms, acronyms
3. **Không dịch**: PLM, OMS, CDP, DMI, RACI, API, CI/CD, SIEM, SOC, GRC, IPO, ROI
4. **Code-switching trong câu** là bình thường: "Nền tảng dữ liệu · ATLAS" hay "Theme 2028 Personalized CX"
5. **Technical tags** luôn tiếng Anh: `BUILD`, `BUY`, `HYBRID`, `LIVE`, `DEV`, `PLAN`, `GAP`
