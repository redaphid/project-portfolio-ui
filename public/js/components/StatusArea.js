import { html } from "https://esm.sh/htm@3/preact"
import { useState } from "https://esm.sh/preact@10/hooks"
import { statusMessage, toolCalls } from "../lib/store.js"

const getStatusIcon = (status) => {
  if (status === "in_progress") return "⏳"
  if (status === "completed") return "✓"
  if (status === "failed") return "✗"
  return "•"
}

const formatArgs = (args) => {
  if (!args) return null
  return Object.entries(args)
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join(", ")
}

const ToolCallItem = ({ call }) => {
  const [expanded, setExpanded] = useState(false)
  const hasDetails = call.arguments || call.result

  const toggle = () => {
    if (hasDetails) setExpanded(!expanded)
  }

  return html`
    <div class="tool-call ${call.status} ${expanded ? "expanded" : ""}">
      <div class="tool-call-header" onClick=${toggle}>
        <span class="tool-icon">${getStatusIcon(call.status)}</span>
        <span class="tool-name">${call.name}</span>
        ${hasDetails && html`<span class="tool-expand">${expanded ? "▼" : "▶"}</span>`}
      </div>
      ${expanded && html`
        <div class="tool-call-details">
          ${call.arguments && html`
            <div class="tool-args">
              <strong>Arguments:</strong>
              <code>${formatArgs(call.arguments)}</code>
            </div>
          `}
          ${call.result && html`
            <div class="tool-result">
              <strong>Result:</strong>
              <pre>${call.result.slice(0, 500)}${call.result.length > 500 ? "..." : ""}</pre>
            </div>
          `}
        </div>
      `}
    </div>
  `
}

export default function StatusArea() {
  const [collapsed, setCollapsed] = useState(false)
  const message = statusMessage.value
  const calls = toolCalls.value

  if (!message && calls.length === 0) return null

  const completedCount = calls.filter(c => c.status === "completed").length
  const inProgressCount = calls.filter(c => c.status === "in_progress").length
  const summary = inProgressCount > 0
    ? `${inProgressCount} tool${inProgressCount > 1 ? "s" : ""} running...`
    : `${completedCount} tool${completedCount !== 1 ? "s" : ""} completed`

  return html`
    <div class="status-banner ${collapsed ? "collapsed" : ""}">
      <div class="status-banner-header" onClick=${() => setCollapsed(!collapsed)}>
        <span class="status-banner-icon">${inProgressCount > 0 ? "⚡" : "✓"}</span>
        <span class="status-banner-summary">${message || summary}</span>
        <span class="status-banner-toggle">${collapsed ? "▶" : "▼"}</span>
      </div>
      ${!collapsed && calls.length > 0 && html`
        <div class="status-banner-content">
          ${calls.map(call => html`<${ToolCallItem} call=${call} />`)}
        </div>
      `}
    </div>
  `
}
