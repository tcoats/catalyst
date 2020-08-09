import Vue from 'vue'

const isObject = item =>
  item
  && typeof item === 'object'
  && !Array.isArray(item)

const deepCopy = (...sources) => {
  const output = {}
  for (const source of sources) {
    if (!isObject(source)) continue
    Object.keys(source).forEach(key => {
      output[key] = isObject(source[key])
        ? deepCopy(source[key])
        : source[key]
    })
  }
  return output
}

export default {
  name: 'params',
  namespaced: true,
  state: {},
  mutations: {
    update: (state, changes) => {
      for (const key of Object.keys(changes)) {
        Vue.set(state, key, deepCopy(state[key], changes[key]))
      }
    }
  },
  actions: { }
}
