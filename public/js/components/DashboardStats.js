import { html } from "https://esm.sh/htm@3/preact"

const formatNumber = (num) => {
  if (num == null) return "—"
  if (num >= 1000) return `${(num / 1000).toFixed(1)}k`
  return num.toString()
}

export default function DashboardStats({ stats }) {
  if (!stats || stats.length === 0) return null

  return html`
    <section class="dashboard-stats">
      ${stats.map(stat => html`
        <div class="stat-card" key=${stat.label}>
          <div class="stat-value">${formatNumber(stat.value)}</div>
          <div class="stat-label">${stat.label}</div>
        </div>
      `)}
    </section>
  `
}
