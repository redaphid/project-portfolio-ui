import { html } from "https://esm.sh/htm@3/preact"
import { useState, useRef, useEffect } from "https://esm.sh/preact@10/hooks"
import { messages, chatLoading, portfolioLoading } from "../lib/store.js"
import { sendChat } from "../lib/api.js"

export default function Chat() {
  const [input, setInput] = useState("")
  const chatMessagesRef = useRef(null)

  const scrollToBottom = () => {
    // Scroll within chat container only, not the whole page
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }

  useEffect(scrollToBottom, [messages.value])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || portfolioLoading.value) return
    await sendChat(input.trim())
    setInput("")
  }

  const handleSuggestionClick = async (suggestion) => {
    if (portfolioLoading.value) return
    setInput(suggestion)
    await sendChat(suggestion)
    setInput("")
  }

  const suggestions = [
    "Generate a resume for a frontend role",
    "Show my most interesting projects",
    "Create a resume focused on audio/DSP work",
    "Highlight my Rust expertise"
  ]

  return html`
    <aside class="chat-sidebar">
      <div class="chat-header">
        <h2>Portfolio Generator</h2>
      </div>

      <div class="chat-messages" ref=${chatMessagesRef}>
        ${messages.value.length === 0 && html`
          <div class="chat-welcome">
            <p>Tell me what kind of portfolio or resume you want to generate.</p>
            <div class="suggestions">
              ${suggestions.map(s => html`
                <button
                  class="suggestion"
                  onClick=${() => handleSuggestionClick(s)}
                  disabled=${portfolioLoading.value}
                >${s}</button>
              `)}
            </div>
          </div>
        `}

        ${messages.value.map((m, i) => html`
          <div key=${i} class="chat-message ${m.role}">
            <div class="message-content">${m.content}</div>
          </div>
        `)}

        ${portfolioLoading.value && html`
          <div class="chat-message assistant">
            <div class="message-content loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        `}
      </div>

      <form class="chat-input-form" onSubmit=${handleSubmit}>
        <input
          type="text"
          value=${input}
          onInput=${(e) => setInput(e.target.value)}
          placeholder="Describe the portfolio you want..."
          disabled=${portfolioLoading.value}
        />
        <button type="submit" disabled=${portfolioLoading.value || !input.trim()}>
          Generate
        </button>
      </form>
    </aside>
  `
}
