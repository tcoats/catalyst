const h = require('snabbdom/h').default
const ql = require('odoql2')
const inject = require('injectinto')
const route = require('odo-route')
const page = require('page')

inject('pod', (hub, exe) => {
})

route('/', (p) => {
  return { page: 'default' }
})

route('/catalyst/', (p) => {
  return { page: 'default' }
})

inject('page:default', ql.component({
  query: (state, params) => {
    return { }
  },
  render: (state, params, hub) => {
    return h('div.wrapper', h('article', [
      h('h1', 'Hello'),
      h('p', 'Things')
    ]))
  }
}))
