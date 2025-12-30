import { html } from "https://esm.sh/htm@3/preact"

export default function DashboardHeader({ name, tagline }) {
  return html`
    <header class="dashboard-header">
      <h1 class="dashboard-name">${name}</h1>
      <p class="dashboard-tagline">${tagline}</p>
    </header>
  `
}
