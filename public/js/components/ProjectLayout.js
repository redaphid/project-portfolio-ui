import { html } from "https://esm.sh/htm@3/preact"
import { sendChat } from "../lib/api.js"
import DashboardHeader from "./DashboardHeader.js"

const renderMarkdownLinks = (text) => {
  if (!text) return text
  const parts = []
  let lastIndex = 0
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  let match

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [, linkText, url] = match
    parts.push(html`<a href=${url} target="_blank" rel="noopener">${linkText}</a>`)
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

const getTypeIcon = (type) => {
  if (type === "feature") return "+"
  if (type === "fix") return "×"
  if (type === "refactor") return "↻"
  return "•"
}

export default function ProjectLayout({ data = {} }) {
  const handleTechClick = (tech) => {
    sendChat(`Show me ${tech} expertise`)
  }

  const techStack = data.techStack || []
  const keyContributions = data.keyContributions || []
  const timeline = data.timeline || []

  return html`
    <main class="portfolio project-layout">
      <${DashboardHeader}
        name=${data.header?.name || ''}
        tagline=${data.header?.tagline || ''}
      />

      <section class="project-overview">
        <div class="overview-header">
          <span class="commit-count">${data.overview?.commitCount || 0} commits</span>
        </div>
        <p class="overview-description">${data.overview?.description || ''}</p>
        ${data.overview?.url && html`
          <a href=${data.overview.url} target="_blank" class="github-link">View on GitHub</a>
        `}
      </section>

      ${techStack.length > 0 && html`
        <section class="tech-stack">
          <h2>Tech Stack</h2>
          <div class="tech-tags">
            ${techStack.map((tech, i) => html`
              <button class="tech-tag" key=${tech || i} onClick=${() => handleTechClick(tech)}>
                ${tech}
              </button>
            `)}
          </div>
        </section>
      `}

      ${keyContributions.length > 0 && html`
        <section class="key-contributions">
          <h2>Key Contributions</h2>
          <div class="contribution-list">
            ${keyContributions.map((contrib, i) => html`
              <div class="contribution-item ${contrib.type || ''}" key=${contrib.title || i}>
                <span class="type-icon">${getTypeIcon(contrib.type)}</span>
                <div class="contribution-content">
                  <h3>${contrib.title || ''}</h3>
                  <p>${renderMarkdownLinks(contrib.description)}</p>
                </div>
              </div>
            `)}
          </div>
        </section>
      `}

      ${timeline.length > 0 && html`
        <section class="project-timeline">
          <h2>Timeline</h2>
          <div class="timeline">
            ${timeline.map((event, i) => html`
              <div class="timeline-item" key=${event.date || i}>
                <span class="timeline-date">${event.date || ''}</span>
                <p class="timeline-event">${renderMarkdownLinks(event.event)}</p>
              </div>
            `)}
          </div>
        </section>
      `}
    </main>
  `
}
