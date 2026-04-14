---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js code; when working on data fetching, bundle size, SSR/RSC, hydration, rendering performance, re-render optimization, or general performance improvements.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
  source: https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md
---

# Vercel React Best Practices

React / Next.js 效能最佳化規範（Vercel Engineering），用來在撰寫、審閱、重構程式碼時，快速找出高影響的效能問題並給出具體修正方向。

## When to Apply

在以下情境優先套用本 Skill：

- 撰寫或重構 React component、Hook、Context、state 管理
- Next.js App Router / Pages Router 的 rendering、data fetching、SSR/RSC、hydration
- 效能需求：bundle size、TTFB、LCP/INP、re-render 次數、長列表 rendering、事件監聽與主執行緒負載
- 使用者明確提到：慢、卡、載入久、bundle 太大、渲染抖動、waterfall、hydration mismatch

## How to Use (Agent Workflow)

1. **先判斷瓶頸類型**：waterfall / bundle / server / client fetching / re-render / rendering / JS perf / advanced。
2. **以高優先級規則先做**：先套用 CRITICAL → HIGH → MEDIUM 的規則；不要先做低影響微調。
3. **提出可執行的修正**：
   - 指出「哪裡」與「為什麼」慢（避免空泛）
   - 給出具體改法（例如：改成 `Promise.all`、把 `await` 延後、拆分 component、避免 barrel imports、動態載入重元件）
4. **最小改動原則**：優先選擇低風險、可逐步落地的變更；必要時列出替代方案與取捨。
5. **輸出格式固定**（建議）：
   - **Findings**：3–8 點（每點包含：規則代號 → 觀察 → 影響）
   - **Fix plan**：按優先級排序的步驟
   - **Code changes**：如果要改碼，優先給出小範圍、可驗證的 patch

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

## Quick Reference

完整規則清單請見 [`reference.md`](reference.md)（與上游來源一致）。

