import component from './component'

export default component({
  name: 'notfound',
  module,
  render: (h, { props, hub, state, route, router }) =>
    h('#root', [ h('h1', 'Not found') ])
})
