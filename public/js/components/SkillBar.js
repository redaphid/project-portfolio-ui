import { html } from "https://esm.sh/htm@3/preact"

const SkillBar = ({ name, commits, maxCommits }) => {
  const pct = Math.round((commits / maxCommits) * 100)

  return html`
    <div class="skill-bar">
      <div class="skill-info">
        <span class="skill-name">${name}</span>
        <span class="skill-count">${commits}</span>
      </div>
      <div class="skill-track">
        <div class="skill-fill" style="width: ${pct}%"></div>
      </div>
    </div>
  `
}

export { SkillBar }
