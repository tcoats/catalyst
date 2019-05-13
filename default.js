const h = require('snabbdom/h').default
const ql = require('odoql2')
const inject = require('injectinto')
const route = require('odo-route')
const page = require('page')
const matter = require('gray-matter')
const marked = require('marked')
const axios = require('axios')
const slugify = (title) => title.replace(/ /g, '+')
const unslugify = (title) => title.replace(/\+/g, ' ')

inject('pod', (hub, exe) => {
  let files = { }
  const load = (title) => {
    // let url = location.href
    // if (location.hash.length > 0) url = url.slice(0, -location.hash.length)
    const url = `https://raw.githubusercontent.com/tcoats/catalyst/master/files/${title}.md`
    return axios.get(url).then((result) => {
      const file = matter(result.data)
      if (Object.keys(file.data) == 0) return null
      file.data.content = file.content
      if (!files[title]) files[title] = file.data
      return file.data
    })
  }
  exe.use('files', () => Promise.resolve(files))
  exe.use('file', (title) => load(title))
  hub.on('unknown file', (params) => {

  })
})

route('/', (p) => {
  return { page: 'default', title: 'Index' }
})
route('/:title/', (p) => {
  return { page: 'default', title: p.params.title }
})

inject('page:default', ql.component({
  query: (state, params) => {
    return {
      files: ql.query('files'),
      file: ql.query('file', params.title)
    }
  },
  render: (state, params, hub) => {
    if (!state.file)
      return inject.one('page:error')(state, {
        message: `/${params.title}/ not found`
      })

    const html = marked(state.file.content)

    return h('div.wrapper', [
      h('header', [
        h('h1.logo', 'Mind Catalyst')
      ]),
      h('article', [
        h('h1', params.title),
        h('div.content', {
          props: { innerHTML: html },
          style: { 'border-left-color': state.file.color }
        })
      ]),
      h('nav', Object.keys(state.file.connections).map(title => h('div', [
        h('h2', title),
        h('ul', state.file.connections[title].map(connection => {
          if (!state.files[connection]) hub.emit('unknown file', connection)
          return h('li', {
            style: {
              'border-left-color': state.files[connection]
                ? state.files[connection].color
                : '#D9D9D9'
            }
          },
          h('a', { attrs: { href: `/${slugify(connection)}/` } }, connection))
        }))
      ])))
    ])
  }
}))
