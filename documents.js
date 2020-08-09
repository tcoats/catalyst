import inject from 'seacreature/lib/inject'

inject('store', {
  name: 'documents',
  namespaced: true,
  state: {
    documents: {}
  },
  mutations: {
    add_document: (state, document) => {
      state.documents[document.title] = document
    }
  },
  actions: {
    async load({ commit, state }, title) {
      if (state.documents[title]) return

      const res = await fetch(`./files/${title}.md`)
      const content = await res.text()

      // const file = matter(result.data)
      console.log(content)

      // axios
      // commit('add_document', document)
    }
  }
})
