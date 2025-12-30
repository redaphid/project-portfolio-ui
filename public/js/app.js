import { html, render } from "https://esm.sh/htm@3/preact"
import { useEffect } from "https://esm.sh/preact@10/hooks"
import { generatePortfolio } from "./lib/api.js"
import Chat from "./components/Chat.js"
import Portfolio from "./components/Portfolio.js"

const App = () => {
  useEffect(() => {
    generatePortfolio()
  }, [])

  return html`
    <div class="app-layout">
      <${Chat} />
      <${Portfolio} />
    </div>
  `
}

render(html`<${App} />`, document.getElementById("app"))
