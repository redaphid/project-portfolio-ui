import { html } from "https://esm.sh/htm@3/preact"
import { renderMarkdown } from "../lib/markdown.js"

export default function DashboardSkills({ skills, onSkillClick }) {
  if (!skills || skills.length === 0) return null

  return html`
    <section class="dashboard-skills">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skills.map(category => {
          if (!category?.category) return null
          return html`
            <div class="skill-category" key=${category.category}>
              <h3 class="category-title">${category.category}</h3>
              <div class="skill-items">
                ${category.items?.map(skill => {
                  if (!skill?.name) return null
                  const level = skill.level ?? 0
                  return html`
                    <div class="skill-item" key=${skill.name}>
                      <div class="skill-header">
                        <button
                          class="skill-name"
                          onClick=${() => onSkillClick?.(skill.name)}
                        >
                          ${skill.name}
                        </button>
                        <span class="skill-level">${level}%</span>
                      </div>
                      <div class="skill-bar">
                        <div class="skill-fill" style=${{ width: `${level}%` }}></div>
                      </div>
                      ${typeof skill.evidence === "string" && html`
                        <p class="skill-evidence"
                           dangerouslySetInnerHTML=${{ __html: renderMarkdown(skill.evidence) }} />
                      `}
                    </div>
                  `
                })}
              </div>
            </div>
          `
        })}
      </div>
    </section>
  `
}
