import { html } from "https://esm.sh/htm@3/preact"

const StatBox = ({ label, value }) => html`
  <div class="stat-box">
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>
`

const Stats = ({ stats }) => {
  if (!stats) return null

  return html`
    <section class="stats-section">
      <${StatBox} label="Repositories" value=${stats.repos} />
      <${StatBox} label="Commits" value=${stats.commits?.toLocaleString()} />
      <${StatBox} label="Years Active" value=${stats.yearsActive} />
    </section>
  `
}

export { Stats }
