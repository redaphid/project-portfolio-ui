import { signal } from "https://esm.sh/@preact/signals@1"

const portfolioData = signal(null)
const portfolioLoading = signal(true)
const streamingContent = signal("")
const messages = signal([])  // Each message: { role, content, portfolioSnapshot? }
const chatLoading = signal(false)
const statusMessage = signal("")
const toolCalls = signal([])
const toolCallHistory = signal([])  // Stores tool calls for each message for revert
const suggestedFollowups = signal([])

// Revert to a specific message's portfolio state
const revertToMessage = (messageIndex) => {
  const msg = messages.value[messageIndex]
  if (msg?.portfolioSnapshot) {
    portfolioData.value = msg.portfolioSnapshot
  }
}

export {
  portfolioData,
  portfolioLoading,
  streamingContent,
  messages,
  chatLoading,
  statusMessage,
  toolCalls,
  toolCallHistory,
  suggestedFollowups,
  revertToMessage
}
