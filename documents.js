export default {
  name: 'documents',
  namespaced: true,
  state: {
    documents: {}
  },
  mutations: {
    add_document: (state, document) => {
      state.documents[document.filename] = document
    }
  },
  actions: {
    async load_document({ commit, state }, filename) {
      if (state.document[filename]) return
      // axios
      // commit('add_document', document)
    }
  }
}
