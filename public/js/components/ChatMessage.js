import { html } from "https://esm.sh/htm@3/preact"
import { useEffect, useRef } from "https://esm.sh/preact@10/hooks"
import { renderMarkdown } from "../lib/markdown.js"

const ChatMessage = ({ role, content }) => {
  const ref = useRef(null)
  const isUser = role === "user"

  useEffect(() => {
    if (ref.current && !isUser) {
      ref.current.innerHTML = renderMarkdown(content)
    }
  }, [content, isUser])

  if (isUser) {
    return html`
      <div class="chat-message user">
        <div class="message-content">${content}</div>
      </div>
    `
  }

  return html`
    <div class="chat-message assistant">
      <div class="message-content markdown-body" ref=${ref}></div>
    </div>
  `
}

export { ChatMessage }
