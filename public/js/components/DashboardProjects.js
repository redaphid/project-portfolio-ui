import { html } from "https://esm.sh/htm@3/preact"
import { renderMarkdown } from "../lib/markdown.js"

export default function DashboardProjects({ projects, onProjectClick, onTechClick }) {
  if (!projects || projects.length === 0) return null

  return html`
    <section class="dashboard-projects">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${projects.map(project => html`
          <article class="project-card" key=${project.name}>
            <div class="project-header">
              <button
                class="project-name"
                onClick=${() => onProjectClick?.(project.name)}
              >
                ${project.name}
              </button>
              <span class="project-commits">${project.commits} commits</span>
            </div>
            ${project.description && html`
              <p class="project-description"
                 dangerouslySetInnerHTML=${{ __html: renderMarkdown(project.description) }} />
            `}
            <div class="project-technologies">
              ${project.technologies?.map(tech => html`
                <button
                  class="tech-tag"
                  key=${tech}
                  onClick=${() => onTechClick?.(tech)}
                >
                  ${tech}
                </button>
              `)}
            </div>
            <a href=${project.url} target="_blank" rel="noopener" class="project-link">
              View on GitHub →
            </a>
          </article>
        `)}
      </div>
    </section>
  `
}
