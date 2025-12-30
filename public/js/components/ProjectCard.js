import { html } from "https://esm.sh/htm@3/preact"

const ProjectCard = ({ project }) => {
  const { owner, repo, name, description, generated_summary, technologies, commit_count, first_commit, last_commit } = project
  const url = `https://github.com/${owner}/${repo}`
  const start = first_commit?.split("T")[0]?.slice(0, 7)
  const end = last_commit?.split("T")[0]?.slice(0, 7)

  return html`
    <a href=${url} target="_blank" rel="noopener" class="project-card">
      <div class="project-header">
        <h3 class="project-name">${name || repo}</h3>
        <span class="project-commits">${commit_count} commits</span>
      </div>
      <p class="project-desc">${generated_summary || description || "No description"}</p>
      <div class="project-meta">
        ${technologies?.slice(0, 4).map(t => html`<span class="tech-tag">${t}</span>`)}
      </div>
      <div class="project-dates">${start} → ${end}</div>
    </a>
  `
}

export { ProjectCard }
