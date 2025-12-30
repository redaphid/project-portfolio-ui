import { marked } from "https://esm.sh/marked@15"
import hljs from "https://esm.sh/highlight.js@11/lib/core"
import javascript from "https://esm.sh/highlight.js@11/lib/languages/javascript"
import typescript from "https://esm.sh/highlight.js@11/lib/languages/typescript"
import json from "https://esm.sh/highlight.js@11/lib/languages/json"
import bash from "https://esm.sh/highlight.js@11/lib/languages/bash"
import css from "https://esm.sh/highlight.js@11/lib/languages/css"

hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("json", json)
hljs.registerLanguage("bash", bash)
hljs.registerLanguage("css", css)
hljs.registerLanguage("js", javascript)
hljs.registerLanguage("ts", typescript)

marked.setOptions({
  highlight: (code, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

const renderMarkdown = (text) => marked.parse(text)

export { renderMarkdown }
