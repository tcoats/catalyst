import inject from 'seacreature/lib/inject'
import matter from 'gray-matter'
import marked from 'marked'
import { unslugify, classify } from './lib/slug'

const load = async title => {
  const res = await fetch(`./files/${title}.md`)
  if (!res.ok) throw '404'
  const { data, content } = matter(await res.text())
  return { title, data, content }
}

const render = content => {
  const files = new Set()
  const renderer = new marked.Renderer()
  const oldLink = renderer.link
  renderer.link = (href, title, text) => {
    const html = oldLink.call(renderer, href, title, text)
    if (href.match(/^[^/]+$/)) {
      const name = unslugify(href)
      files.add(name)
      return `${html.slice(0, 2)} class="${classify(name)}" ${html.slice(3)}`
    }
    return html
  }
  const html = marked(content, { renderer })
  return { html, files }
}

const set_document_style = (() => {
  const style = document.createElement('style')
  document.head.appendChild(style)
  const colors = new Map()
  return d => {
    if (!d.data.color) return
    colors.set(classify(d.title), d.data.color)
    style.innerHTML = Array.from(colors, ([classname, color]) => `
      article .content a.${classname} {
        border-color: ${color};
      }
      article .content.${classname} {
        border-left-color: ${color};
      }
      nav li.${classname} {
        border-left-color: ${color};
      }
      `).join('\n')
  }
})()

inject('store', {
  name: 'documents',
  namespaced: true,
  state: {
    documents: {}
  },
  mutations: {
    add_document: (state, document) => {
      state.documents[document.title] = document
      set_document_style(document)
    }
  },
  actions: {
    async load({ commit, state }, title) {
      if (state.documents[title]) return
      try {
        const { data, content } = await load(title)
        const { files, html } = render(content)
        Object.values(data.connections).forEach(a => a.forEach(f => files.add(f)))
        files.delete(title)
        commit('add_document', { title, data, content, files, html })
      }
      // ignore errors, probably 404s
      catch (e) {
        if (e != '404') console.error(e)
      }
    }
  }
})
