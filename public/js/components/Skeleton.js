import { html } from "https://esm.sh/htm@3/preact"

/**
 * Base skeleton component with shimmer animation
 */
export const Skeleton = ({ width = "100%", height = "1em", className = "" }) => html`
  <div
    class="skeleton ${className}"
    style="width: ${width}; height: ${height};"
  />
`

/**
 * Skeleton for the header section
 */
export const HeaderSkeleton = () => html`
  <header class="dashboard-header skeleton-container">
    <${Skeleton} width="60%" height="2.5rem" className="skeleton-title" />
    <${Skeleton} width="80%" height="1.2rem" className="skeleton-subtitle" />
  </header>
`

/**
 * Skeleton for stats cards
 */
export const StatsSkeleton = ({ count = 4 }) => html`
  <section class="dashboard-stats skeleton-container">
    ${Array(count).fill(0).map((_, i) => html`
      <div class="stat-card skeleton-stat" key=${i}>
        <${Skeleton} width="60%" height="2rem" />
        <${Skeleton} width="80%" height="0.9rem" />
      </div>
    `)}
  </section>
`

/**
 * Skeleton for skills section
 */
export const SkillsSkeleton = ({ categories = 3, itemsPerCategory = 4 }) => html`
  <section class="dashboard-skills skeleton-container">
    <${Skeleton} width="120px" height="1.5rem" className="skeleton-section-title" />
    <div class="skills-categories">
      ${Array(categories).fill(0).map((_, i) => html`
        <div class="skill-category" key=${i}>
          <${Skeleton} width="100px" height="1.2rem" />
          <div class="skill-items">
            ${Array(itemsPerCategory).fill(0).map((_, j) => html`
              <div class="skill-item" key=${j}>
                <${Skeleton} width="80px" height="1rem" />
                <${Skeleton} width="100%" height="8px" className="skeleton-bar" />
              </div>
            `)}
          </div>
        </div>
      `)}
    </div>
  </section>
`

/**
 * Skeleton for a single project card
 */
export const ProjectCardSkeleton = () => html`
  <article class="project-card skeleton-project">
    <div class="project-header">
      <${Skeleton} width="150px" height="1.3rem" />
      <${Skeleton} width="80px" height="1rem" />
    </div>
    <${Skeleton} width="100%" height="3rem" />
    <div class="project-technologies">
      ${Array(3).fill(0).map((_, i) => html`
        <${Skeleton} key=${i} width="60px" height="1.5rem" className="skeleton-tag" />
      `)}
    </div>
    <${Skeleton} width="120px" height="1rem" />
  </article>
`

/**
 * Skeleton for projects section
 */
export const ProjectsSkeleton = ({ count = 4 }) => html`
  <section class="dashboard-projects skeleton-container">
    <${Skeleton} width="100px" height="1.5rem" className="skeleton-section-title" />
    <div class="projects-grid">
      ${Array(count).fill(0).map((_, i) => html`
        <${ProjectCardSkeleton} key=${i} />
      `)}
    </div>
  </section>
`

/**
 * Skeleton for highlights section
 */
export const HighlightsSkeleton = ({ count = 3 }) => html`
  <section class="dashboard-highlights skeleton-container">
    <${Skeleton} width="120px" height="1.5rem" className="skeleton-section-title" />
    <ul class="highlights-list">
      ${Array(count).fill(0).map((_, i) => html`
        <li class="highlight-item" key=${i}>
          <${Skeleton} width="95%" height="1.2rem" />
        </li>
      `)}
    </ul>
  </section>
`

/**
 * Full portfolio skeleton
 */
export const PortfolioSkeleton = () => html`
  <main class="portfolio dashboard skeleton-portfolio">
    <${HeaderSkeleton} />
    <${StatsSkeleton} />
    <${SkillsSkeleton} />
    <${ProjectsSkeleton} />
    <${HighlightsSkeleton} />
  </main>
`

export default Skeleton
