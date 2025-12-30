import { html } from "https://esm.sh/htm@3/preact"
import { useMemo, useRef, useEffect } from "https://esm.sh/preact@10/hooks"
import { portfolioData, portfolioLoading, streamingContent, toolCalls } from "../lib/store.js"
import { sendChat } from "../lib/api.js"
import { parsePartialJson } from "../lib/partial-json.js"
import DashboardHeader from "./DashboardHeader.js"
import DashboardStats from "./DashboardStats.js"
import DashboardSkills from "./DashboardSkills.js"
import DashboardProjects from "./DashboardProjects.js"
import DashboardHighlights from "./DashboardHighlights.js"
import StatusArea from "./StatusArea.js"
import TechnologyLayout from "./TechnologyLayout.js"
import ProjectLayout from "./ProjectLayout.js"
import {
  HeaderSkeleton,
  StatsSkeleton,
  SkillsSkeleton,
  ProjectsSkeleton,
  HighlightsSkeleton
} from "./Skeleton.js"

/**
 * Progressive Portfolio Renderer
 * Parses streaming JSON and renders sections as they become available
 */
export default function Portfolio() {
  const isLoading = portfolioLoading.value
  const finalData = portfolioData.value
  const streaming = streamingContent.value

  const handleSkillClick = (skill) => sendChat(`Show me ${skill} expertise`)
  const handleTechClick = (tech) => sendChat(`Show me ${tech} expertise`)
  const handleProjectClick = (project) => sendChat(`Tell me more about the ${project} project`)

  // Parse streaming content into partial data
  const streamingData = useMemo(() => {
    if (!streaming) return null
    return parsePartialJson(streaming)
  }, [streaming])

  // Track last valid streaming data to prevent flickering back to old data
  const lastValidStreaming = useRef(null)

  // Update ref when we get valid streaming data
  if (streamingData) {
    lastValidStreaming.current = streamingData
  }

  // Reset ref when loading completes (ready for next query)
  useEffect(() => {
    if (!isLoading) {
      lastValidStreaming.current = null
    }
  }, [isLoading])

  // Logic:
  // - While loading: use last valid streaming data if we have any, otherwise show old data
  // - Once streaming produces valid data, stick with it (no flicker back to old)
  // - When done loading: use final data
  const data = isLoading
    ? (lastValidStreaming.current || finalData)
    : finalData

  // If we have no data at all and not loading, show empty state
  if (!isLoading && !data) {
    return html`
      <main class="portfolio">
        <div class="loading-portfolio">
          <p>No portfolio data. Start a conversation to generate one.</p>
        </div>
      </main>
    `
  }

  // Determine which layout to use
  const layout = data?.layout || "general"

  // Check if we should show the status area (when loading or has tool call history)
  const hasToolCalls = toolCalls.value.length > 0

  // For non-general layouts, render progressively with partial data
  if (layout === "technology") {
    return html`
      <main class="portfolio">
        <${StatusArea} />
        <${TechnologyLayout} data=${data} key="tech-layout" />
      </main>
    `
  }

  if (layout === "project") {
    return html`
      <main class="portfolio">
        <${StatusArea} />
        <${ProjectLayout} data=${data} key="project-layout" />
      </main>
    `
  }

  // Check if we have any actual data (not just loading)
  // Only show skeletons when we have no data at all
  const hasAnyData = data && Object.keys(data).length > 0

  // Progressive general layout
  return html`
    <main class="portfolio dashboard ${isLoading ? 'streaming' : 'complete'}">
      <${StatusArea} />

      <${ProgressiveHeader} data=${data} isLoading=${isLoading} hasAnyData=${hasAnyData} />
      <${ProgressiveStats} data=${data} isLoading=${isLoading} hasAnyData=${hasAnyData} />
      <${ProgressiveSkills}
        data=${data}
        isLoading=${isLoading}
        hasAnyData=${hasAnyData}
        onSkillClick=${handleSkillClick}
      />
      <${ProgressiveProjects}
        data=${data}
        isLoading=${isLoading}
        hasAnyData=${hasAnyData}
        onProjectClick=${handleProjectClick}
        onTechClick=${handleTechClick}
      />
      <${ProgressiveHighlights} data=${data} isLoading=${isLoading} hasAnyData=${hasAnyData} />
    </main>
  `
}

/**
 * Progressive Header - shows skeleton only when no data at all
 */
const ProgressiveHeader = ({ data, isLoading, hasAnyData }) => {
  const hasHeader = data?.header?.name || data?.header?.tagline

  // Only show skeleton when loading AND we have no data yet
  if (!hasHeader && isLoading && !hasAnyData) {
    return html`<${HeaderSkeleton} />`
  }

  if (!hasHeader) return null

  return html`
    <div class="fade-in">
      <${DashboardHeader}
        name=${data.header?.name}
        tagline=${data.header?.tagline}
      />
    </div>
  `
}

/**
 * Progressive Stats - shows skeleton only when no data at all
 */
const ProgressiveStats = ({ data, isLoading, hasAnyData }) => {
  const hasStats = data?.stats?.length > 0

  if (!hasStats && isLoading && !hasAnyData) {
    return html`<${StatsSkeleton} count=${4} />`
  }

  if (!hasStats) return null

  return html`
    <div class="fade-in">
      <${DashboardStats} stats=${data.stats} />
    </div>
  `
}

/**
 * Progressive Skills - shows skeleton only when no data at all
 */
const ProgressiveSkills = ({ data, isLoading, hasAnyData, onSkillClick }) => {
  const hasSkills = data?.skills?.length > 0

  if (!hasSkills && isLoading && !hasAnyData) {
    return html`<${SkillsSkeleton} categories=${3} itemsPerCategory=${4} />`
  }

  if (!hasSkills) return null

  return html`
    <div class="fade-in">
      <${DashboardSkills}
        skills=${data.skills}
        onSkillClick=${onSkillClick}
      />
    </div>
  `
}

/**
 * Progressive Projects - shows skeleton only when no data at all
 */
const ProgressiveProjects = ({ data, isLoading, hasAnyData, onProjectClick, onTechClick }) => {
  const projects = data?.projects || []
  const hasProjects = projects.length > 0

  if (!hasProjects && isLoading && !hasAnyData) {
    return html`<${ProjectsSkeleton} count=${4} />`
  }

  if (!hasProjects) return null

  // Show projects as they stream in
  return html`
    <section class="dashboard-projects fade-in">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${projects.map((project, index) => html`
          <div class="project-appear" style="--delay: ${index * 0.05}s" key=${project.name || index}>
            <${ProjectCard}
              project=${project}
              onProjectClick=${onProjectClick}
              onTechClick=${onTechClick}
            />
          </div>
        `)}
      </div>
    </section>
  `
}

/**
 * Individual project card (extracted for reuse)
 */
import { renderMarkdown } from "../lib/markdown.js"

const ProjectCard = ({ project, onProjectClick, onTechClick }) => html`
  <article class="project-card">
    <div class="project-header">
      <button
        class="project-name"
        onClick=${() => onProjectClick?.(project.name)}
      >
        ${project.name || "Untitled Project"}
      </button>
      ${project.commits != null && html`
        <span class="project-commits">${project.commits} commits</span>
      `}
    </div>
    ${typeof project.description === "string" && html`
      <p class="project-description"
         dangerouslySetInnerHTML=${{ __html: renderMarkdown(project.description) }} />
    `}
    ${project.technologies?.length > 0 && html`
      <div class="project-technologies">
        ${project.technologies.map(tech => {
          if (typeof tech !== "string") return null
          return html`
            <button
              class="tech-tag"
              key=${tech}
              onClick=${() => onTechClick?.(tech)}
            >
              ${tech}
            </button>
          `
        })}
      </div>
    `}
    ${typeof project.url === "string" && html`
      <a href=${project.url} target="_blank" rel="noopener" class="project-link">
        View on GitHub →
      </a>
    `}
  </article>
`

/**
 * Skeleton for project card (imported here to avoid circular deps)
 */
const ProjectCardSkeleton = () => html`
  <article class="project-card skeleton-project">
    <div class="skeleton" style="width: 150px; height: 1.3rem;" />
    <div class="skeleton" style="width: 100%; height: 3rem; margin-top: 8px;" />
    <div style="display: flex; gap: 8px; margin-top: 8px;">
      <div class="skeleton" style="width: 60px; height: 1.5rem; border-radius: 4px;" />
      <div class="skeleton" style="width: 60px; height: 1.5rem; border-radius: 4px;" />
    </div>
  </article>
`

/**
 * Progressive Highlights - shows skeleton only when no data at all
 */
const ProgressiveHighlights = ({ data, isLoading, hasAnyData }) => {
  const hasHighlights = data?.highlights?.length > 0

  if (!hasHighlights && isLoading && !hasAnyData) {
    return html`<${HighlightsSkeleton} count=${3} />`
  }

  if (!hasHighlights) return null

  return html`
    <div class="fade-in">
      <${DashboardHighlights} highlights=${data.highlights} />
    </div>
  `
}

/**
 * Progressive Technology Layout skeleton
 * Only shows skeleton while loading - avoids re-rendering partial data
 */
const ProgressiveTechnologyLayout = ({ data, isLoading }) => {
  // Always show skeleton while loading to avoid layout thrashing
  return html`
    <div class="technology-layout skeleton-container">
      <${HeaderSkeleton} />
      <div class="skeleton" style="width: 100%; height: 200px; margin: 20px 0;" />
      <${ProjectsSkeleton} count=${3} />
    </div>
  `
}

/**
 * Progressive Project Layout skeleton
 * Only shows skeleton while loading - avoids re-rendering partial data
 */
const ProgressiveProjectLayout = ({ data, isLoading }) => {
  // Always show skeleton while loading to avoid layout thrashing
  return html`
    <div class="project-layout skeleton-container">
      <${HeaderSkeleton} />
      <div class="skeleton" style="width: 100%; height: 150px; margin: 20px 0;" />
      <div class="skeleton" style="width: 100%; height: 300px; margin: 20px 0;" />
    </div>
  `
}
