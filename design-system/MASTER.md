# My Timeline — 個人履歷 / 作品集 / 時間軸網站設計系統（Source of Truth）

此文件定義全站一致的視覺與互動規範：色彩、字體、間距、元件、狀態、可近用性（a11y）與交付前檢核。

---

## 目標與風格定位

- **定位**：專業、清爽、有質感、可讀性高的個人網站（CV / Portfolio / Timeline）
- **視覺策略**：中性底色 + 清晰文字層級 + 少量藍色強調（CTA / Link / Focus）
- **互動策略**：低干擾微動效、清楚的 hover/focus、尊重 `prefers-reduced-motion`
- **可近用性**：WCAG AA 對比、鍵盤可操作、明顯 focus、語意化結構

---

## 版型（IA / Layout Pattern）

### 全站共用

- **Header（固定）**
  - 左側：姓名/Logo（可點回首頁）
  - 右側：主導覽（Home / CV / Portfolio / Timeline / Contact）
  - 導覽需標示當前頁（`aria-current="page"`）
- **Main**
  - 進入頁面第一個可聚焦元素為「跳到主要內容」（Skip link）
  - 內容寬度：最大 `1200px`，左右留白依螢幕自適應
- **Footer（可選）**
  - 社群連結、Email、版權（若不做 footer，至少在 Contact 有清楚 CTA）

### 各頁結構建議

- **Home**：Hero（姓名/一句話定位/主要連結）→ 精選區塊（興趣/亮點）→ 次要內容
- **CV**：左側摘要（聯絡、技能）→ 右側主內容（經歷/專案/教育）
- **Portfolio**：簡介 → Grid（Projects）→ Empty/Error states
- **Timeline**：標題/說明 → 篩選器 → Timeline items（可讀性第一）
- **Contact**：聯絡資訊（可複製）→ 社群連結（外部新分頁）→ 圖像（可選）

---

## 色彩（Tokens）

### Core

| Token | 用途 | 值 |
|---|---|---|
| `--bg` | 頁面底色 | `#FAFAFA` |
| `--surface` | 卡片/容器底色 | `#FFFFFF` |
| `--text` | 主要文字 | `#0B0F19` |
| `--muted` | 次要文字 | `#475569` |
| `--border` | 邊框/分隔線 | `#E5E7EB` |
| `--brand` | 品牌/強調（CTA/Link/Focus） | `#2563EB` |
| `--brand-ink` | brand 上的文字 | `#FFFFFF` |
| `--shadow` | 陰影 | `rgba(2, 6, 23, 0.10)` |

### 狀態色（輕量）

| Token | 用途 | 值 |
|---|---|---|
| `--success` | 成功 | `#16A34A` |
| `--warning` | 警告 | `#D97706` |
| `--danger` | 錯誤 | `#DC2626` |

---

## 字體（Typography）

- **Heading**：`Archivo`（英數標題清晰）
- **Body**：`Noto Sans TC`（繁中可讀性優先）+ `Space Grotesk`（英數輔助）
- **字級階層（建議）**
  - `h1`：32–44（依 viewport clamp）
  - `h2`：24–32
  - `h3`：18–22
  - Body：16
  - Small：14
- **行高**：正文 1.7、標題 1.2–1.35

---

## 間距與圓角（Spacing / Radius）

- **容器左右 padding**：`16px`（mobile）/ `24px`（tablet+）
- **區塊 vertical gap**：`24–48px`
- **卡片 padding**：`16–24px`
- **圓角**：卡片 `16px`，小元件 `12px`，圓角按鈕 `999px`

---

## 元件規範（Components）

### Link

- 預設使用 `--brand`，hover 改深（或加底線）
- 外部連結一律加：`target="_blank" rel="noopener"`

### Button / Pill（篩選器）

- 可點元素需有 `cursor: pointer`
- hover/focus 狀態一致，不用誇張位移（避免 layout shift）

### Card

- 白底 + 細邊框 + 柔和陰影
- hover：陰影稍加深（不要縮放造成抖動）

### Timeline item

- 文字層級清晰（標題 > 時間 > 內容 > 分類）
- mobile：單欄、時間軸靠左，點位固定

---

## 互動與動效（Motion）

- **預設 transition**：150–250ms（顏色、陰影、transform）
- **reduced motion**：若 `prefers-reduced-motion: reduce`，關閉 entrance/scroll 動畫

---

## 可近用性（A11y）

- **Skip link**：鍵盤 Tab 第一個可聚焦元素
- **Focus 可見**：使用 `:focus-visible` 顯示 2px–3px 外框
- **對比**：正文對比至少 4.5:1
- **Iframe**：必須有 `title`
- **語意化**：`header/nav/main`、標題層級不跳級
- **ARIA current**：導覽當前頁用 `aria-current="page"`

---

## 交付前檢核（Pre-delivery）

- [ ] 全站導航樣式一致；當前頁清楚標示
- [ ] 鍵盤可操作：Tab 順序合理、focus 明顯、無陷阱
- [ ] `prefers-reduced-motion` 生效（動畫可被關閉）
- [ ] 文字對比足夠；小字仍可讀
- [ ] 外部連結皆有 `rel="noopener"`；iframe 皆有 `title`
- [ ] 行動版無水平捲動；375/768/1024/1440 檢查通過

