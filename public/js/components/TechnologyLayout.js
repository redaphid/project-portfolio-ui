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

export default function TechnologyLayout({ data }) {
  const handleProjectClick = (e, projectName) => {
    e.preventDefault()
    sendChat(`Tell me more about the ${projectName} project`)
  }

  const handleRelatedClick = (e, tech) => {
    e.preventDefault()
    sendChat(`Show me ${tech} expertise`)
  }

  return html`
    <main class="portfolio technology-layout">
      <${DashboardHeader}
        name=${data.header?.name}
        tagline=${data.header?.tagline}
      />

      <section class="expertise-summary">
        <div class="expertise-badge ${data.expertise?.level?.toLowerCase()}">
          ${data.expertise?.level}
        </div>
        <div class="expertise-stats">
          <span class="stat">${data.expertise?.commitCount || 0} commits</span>
          <span class="stat">${data.expertise?.projectCount || 0} projects</span>
        </div>
        <p class="expertise-text">${data.expertise?.summary}</p>
      </section>

      <section class="key-projects">
        <h2>Key ${data.technology} Projects</h2>
        <div class="project-grid">
          ${(data.keyProjects || []).map(project => html`
            <div class="project-card ${project.role}">
              <h3>
                <a href="#" onClick=${(e) => handleProjectClick(e, project.name)}>
                  ${project.name}
                </a>
              </h3>
              <span class="role-badge">${project.role}</span>
              <p>${renderMarkdownLinks(project.description)}</p>
              <a href=${project.url} target="_blank" class="github-link">View on GitHub</a>
            </div>
          `)}
        </div>
      </section>

      <section class="notable-commits">
        <h2>Notable Contributions</h2>
        <div class="commit-list">
          ${(data.notableCommits || []).map(commit => html`
            <div class="commit-item ${commit.impact?.toLowerCase()}">
              <span class="impact-badge">${commit.impact}</span>
              <span class="commit-date">${commit.date}</span>
              <p class="commit-summary">${renderMarkdownLinks(commit.summary)}</p>
            </div>
          `)}
        </div>
      </section>

      ${data.relatedSkills?.length > 0 && html`
        <section class="related-skills">
          <h2>Related Technologies</h2>
          <div class="skill-tags">
            ${data.relatedSkills.map(skill => html`
              <button class="skill-tag" onClick=${(e) => handleRelatedClick(e, skill)}>
                ${skill}
              </button>
            `)}
          </div>
        </section>
      `}
    </main>
  `
}
