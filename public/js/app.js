import { html, render } from "https://esm.sh/htm@3/preact"
import { useEffect } from "https://esm.sh/preact@10/hooks"
import { generatePortfolio, sendChat, getQueryPrompt, DEFAULT_PROMPT } from "./lib/api.js"
import Chat from "./components/Chat.js"
import Portfolio from "./components/Portfolio.js"

const App = () => {
  useEffect(() => {
    generatePortfolio()

    const handlePopState = () => {
      const prompt = getQueryPrompt() || DEFAULT_PROMPT
      sendChat(prompt, false)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  return html`
    <div class="app-layout">
      <${Chat} />
      <${Portfolio} />
    </div>
  `
}

render(html`<${App} />`, document.getElementById("app"))
