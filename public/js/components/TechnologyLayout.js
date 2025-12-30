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

export default function TechnologyLayout({ data = {} }) {
  const handleProjectClick = (projectName) => {
    sendChat(`Tell me more about the ${projectName} project`)
  }

  const handleRelatedClick = (tech) => {
    sendChat(`Show me ${tech} expertise`)
  }

  const handleCommitsClick = () => {
    const count = data.expertise?.commitCount || 0
    sendChat(`Show me notable ${data.technology || ''} commits from across all ${count} commits. Include commits from multiple projects to show breadth.`)
  }

  const handleProjectsClick = () => {
    const count = data.expertise?.projectCount || 0
    sendChat(`List all ${count} ${data.technology || ''} projects with brief descriptions of how ${data.technology || 'this technology'} is used in each.`)
  }

  const keyProjects = data.keyProjects || []
  const notableCommits = data.notableCommits || []
  const relatedSkills = data.relatedSkills || []

  return html`
    <main class="portfolio technology-layout">
      <${DashboardHeader}
        name=${data.header?.name || ''}
        tagline=${data.header?.tagline || ''}
      />

      <section class="expertise-summary">
        <div class="expertise-stats">
          <button class="stat-btn" onClick=${handleCommitsClick}>
            <span class="stat-value">${data.expertise?.commitCount || 0}</span>
            <span class="stat-label">commits</span>
          </button>
          <button class="stat-btn" onClick=${handleProjectsClick}>
            <span class="stat-value">${data.expertise?.projectCount || 0}</span>
            <span class="stat-label">projects</span>
          </button>
        </div>
        <p class="expertise-text">${data.expertise?.summary || ''}</p>
      </section>

      <section class="key-projects">
        <h2>Key ${data.technology || ''} Projects</h2>
        <div class="project-grid">
          ${keyProjects.map((project, i) => html`
            <div class="project-card" key=${project.name || i}>
              <h3>
                <button class="project-link" onClick=${() => handleProjectClick(project.name)}>
                  ${project.name || ''}
                </button>
              </h3>
              <p>${renderMarkdownLinks(project.description)}</p>
              ${project.url && html`
                <a href=${project.url} target="_blank" class="github-link">View on GitHub</a>
              `}
            </div>
          `)}
        </div>
      </section>

      <section class="notable-commits">
        <h2>Notable Contributions</h2>
        <div class="commit-list">
          ${notableCommits.map((commit, i) => html`
            <div class="commit-item" key=${commit.date || i}>
              <span class="commit-date">${commit.date || ''}</span>
              <p class="commit-summary">${renderMarkdownLinks(commit.summary)}</p>
            </div>
          `)}
        </div>
      </section>

      ${relatedSkills.length > 0 && html`
        <section class="related-skills">
          <h2>Related Technologies</h2>
          <div class="skill-tags">
            ${relatedSkills.map((skill, i) => html`
              <button class="skill-tag" key=${skill || i} onClick=${() => handleRelatedClick(skill)}>
                ${skill}
              </button>
            `)}
          </div>
        </section>
      `}
    </main>
  `
}
