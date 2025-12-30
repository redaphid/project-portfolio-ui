import { portfolioData, portfolioLoading, streamingContent, messages, statusMessage, toolCalls } from "./store.js"
import { MCP_BACKEND_HOST } from "./config.js"

const INITIAL_PROMPT = "Generate a professional developer portfolio. Focus on the most interesting and actively developed projects. Highlight unique technical expertise."

let ws = null
let sessionId = null
let pendingResolve = null

const getSessionId = () => {
  if (sessionId) return sessionId
  sessionId = `session-${Date.now()}-${Math.random().toString(36).slice(2)}`
  return sessionId
}

const getWsUrl = () => `wss://${MCP_BACKEND_HOST}/agents/chat-agent/${getSessionId()}`

const connect = () => {
  if (ws && ws.readyState === WebSocket.OPEN) return Promise.resolve(ws)

  return new Promise((resolve, reject) => {
    ws = new WebSocket(getWsUrl())

    ws.onopen = () => {
      console.log("WebSocket connected")
      resolve(ws)
    }

    ws.onerror = (err) => {
      console.error("WebSocket error:", err)
      reject(err)
    }

    ws.onclose = () => {
      console.log("WebSocket closed")
      ws = null
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleMessage(data)
    }
  })
}

const handleMessage = (data) => {
  if (data.type === "status") {
    statusMessage.value = data.message
    return
  }

  if (data.type === "mcp_list_tools") {
    if (data.status === "in_progress") {
      toolCalls.value = [...toolCalls.value, { name: "Discovering tools", status: "in_progress" }]
    }
    if (data.status === "completed") {
      toolCalls.value = toolCalls.value.map(t =>
        t.name === "Discovering tools" ? { ...t, status: "completed" } : t
      )
    }
    return
  }

  if (data.type === "mcp_call") {
    if (data.status === "in_progress") {
      toolCalls.value = [...toolCalls.value, {
        name: data.name,
        status: "in_progress",
        itemId: data.itemId,
        arguments: data.arguments
      }]
    }
    if (data.status === "completed" || data.status === "failed") {
      toolCalls.value = toolCalls.value.map(t =>
        t.itemId === data.itemId ? { ...t, status: data.status, result: data.result } : t
      )
    }
    return
  }

  // Stream content as it arrives
  if (data.type === "content_delta") {
    streamingContent.value += data.delta
    return
  }

  if (data.type === "content_done" || data.type === "assistant_message") {
    const content = data.content || data.portfolio
    if (content) {
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          portfolioData.value = JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.error("Failed to parse portfolio JSON:", e)
      }
    }
    portfolioLoading.value = false
    streamingContent.value = ""
    statusMessage.value = ""
    toolCalls.value = []
    if (pendingResolve) {
      pendingResolve(content)
      pendingResolve = null
    }
    return
  }

  if (data.type === "error") {
    console.error("Agent error:", data.message)
    portfolioLoading.value = false
    streamingContent.value = ""
    statusMessage.value = `Error: ${data.message}`
    if (pendingResolve) {
      pendingResolve(null)
      pendingResolve = null
    }
  }
}

const sendChat = async (content) => {
  // Add user message to chat history immediately
  messages.value = [...messages.value, { role: "user", content }]

  portfolioLoading.value = true
  streamingContent.value = ""
  statusMessage.value = "Connecting..."
  toolCalls.value = []

  await connect()

  return new Promise((resolve) => {
    pendingResolve = resolve
    ws.send(JSON.stringify({
      type: "chat",
      content,
      origin: `https://${MCP_BACKEND_HOST}`
    }))
  })
}

const generatePortfolio = (prompt = INITIAL_PROMPT) => sendChat(prompt)

export { generatePortfolio, sendChat, INITIAL_PROMPT }
