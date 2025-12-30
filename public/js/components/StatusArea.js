import { html } from "https://esm.sh/htm@3/preact"
import { useState } from "https://esm.sh/preact@10/hooks"
import { statusMessage, toolCalls, toolCallHistory } from "../lib/store.js"

const getStatusIcon = (status) => {
  if (status === "in_progress") return "◐"
  if (status === "completed") return "✓"
  if (status === "failed") return "✗"
  return "○"
}

const formatArgs = (args) => {
  if (!args) return null
  try {
    return JSON.stringify(args, null, 2)
  } catch {
    return String(args)
  }
}

const ToolCallItem = ({ call }) => {
  const [expanded, setExpanded] = useState(false)
  const hasDetails = call.arguments || call.result

  return html`
    <div class="tool-item ${call.status}">
      <div class="tool-row" onClick=${() => hasDetails && setExpanded(!expanded)}>
        <span class="tool-status">${getStatusIcon(call.status)}</span>
        <span class="tool-name">${call.name}</span>
        ${hasDetails && html`<span class="tool-chevron">${expanded ? "−" : "+"}</span>`}
      </div>
      ${expanded && html`
        <div class="tool-details">
          ${call.arguments && html`
            <div class="tool-section">
              <span class="tool-label">args</span>
              <pre class="tool-code">${formatArgs(call.arguments)}</pre>
            </div>
          `}
          ${call.result && html`
            <div class="tool-section">
              <span class="tool-label">result</span>
              <pre class="tool-code">${call.result.slice(0, 300)}${call.result.length > 300 ? "…" : ""}</pre>
            </div>
          `}
        </div>
      `}
    </div>
  `
}

export default function StatusArea() {
  const [collapsed, setCollapsed] = useState(true)
  const message = statusMessage.value
  const calls = toolCalls.value
  const history = toolCallHistory.value

  // Show nothing if no calls and no history
  if (!message && calls.length === 0 && history.length === 0) return null

  const inProgress = calls.filter(c => c.status === "in_progress")
  const completed = calls.filter(c => c.status === "completed")
  const isActive = inProgress.length > 0 || message

  // When not active, show the most recent tool calls from history
  const displayCalls = calls.length > 0 ? calls : (history[history.length - 1] || [])
  const displayCompleted = displayCalls.filter(c => c.status === "completed")

  const currentOp = isActive
    ? (inProgress[0]?.name || message || "Processing...")
    : `${displayCompleted.length} tools used`

  return html`
    <div class="tool-panel sticky ${collapsed ? "collapsed" : ""} ${isActive ? "active" : "idle"}">
      <div class="tool-header" onClick=${() => setCollapsed(!collapsed)}>
        <span class="tool-indicator ${isActive ? "active" : "done"}"></span>
        <code class="tool-current">${currentOp}</code>
        ${isActive && html`<span class="tool-count">${completed.length}/${calls.length}</span>`}
        <span class="tool-toggle">${collapsed ? "▸" : "▾"}</span>
      </div>
      ${!collapsed && html`
        <div class="tool-list">
          ${displayCalls.map(call => html`<${ToolCallItem} call=${call} />`)}
        </div>
      `}
    </div>
  `
}
