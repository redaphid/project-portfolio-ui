import { signal } from "https://esm.sh/@preact/signals@1"

const portfolioData = signal(null)
const portfolioLoading = signal(true)
const streamingContent = signal("")
const messages = signal([])
const chatLoading = signal(false)
const statusMessage = signal("")
const toolCalls = signal([])

export { portfolioData, portfolioLoading, streamingContent, messages, chatLoading, statusMessage, toolCalls }
