import inject from 'seacreature/lib/inject'
import matter from 'gray-matter'
import marked from 'marked'
const unslugify = title => title.replace(/\-/g, ' ')

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
    if (href.match(/^\/[^/]+\/$/))
      files.add(unslugify(href.slice(1, -1)))
    return oldLink.call(renderer, href, title, text)
  }
  const html = marked(content, { renderer })
  return { html, files }
}

inject('store', {
  name: 'documents',
  namespaced: true,
  state: {
    documents: {}
  },
  mutations: {
    add_document: (state, document) => state.documents[document.title] = document
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
      catch (e) { return }
    }
  }
})
