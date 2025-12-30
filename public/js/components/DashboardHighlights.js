import { html } from "https://esm.sh/htm@3/preact"
import { renderMarkdown } from "../lib/markdown.js"

export default function DashboardHighlights({ highlights }) {
  if (!highlights || highlights.length === 0) return null

  return html`
    <section class="dashboard-highlights">
      <h2 class="section-title">Highlights</h2>
      <ul class="highlights-list">
        ${highlights.map((highlight, i) => {
          if (typeof highlight !== "string") return null
          return html`
            <li key=${i} class="highlight-item"
                dangerouslySetInnerHTML=${{ __html: renderMarkdown(highlight) }} />
          `
        })}
      </ul>
    </section>
  `
}
