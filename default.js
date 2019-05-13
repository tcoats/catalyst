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
const cache = {}

inject('pod', (hub, exe) => {
  const load = (title) => {
    if (cache[title] !== undefined)
      return Promise.resolve(cache[title])
    const url = `https://raw.githubusercontent.com/tcoats/catalyst/master/files/${title}.md`
    return axios.get(url).then((result) => {
      const file = matter(result.data)
      if (Object.keys(file.data) == 0) return null
      file.data.content = file.content
      file.data.title = title
      cache[title] = file.data
      return file.data
    })
  }
  exe.use('files', (title) => load(title).then((file) =>
  {
    const files = {}
    const renderer = new marked.Renderer()
    const oldLink = renderer.link
    renderer.link = (href, title, text) => {
      if (href.match(/^\/[^/]+\/$/))
        files[unslugify(href.slice(1, -1))] = true
      return oldLink.call(renderer, href, title, text)
    }
    const html = marked(file.content, { renderer: renderer })
    for (let a of Object.values(file.connections))
      for (let f of a)
        files[f] = true
    delete files[file.title]
    return Promise.all(Object.keys(files).map((title) =>
        load(title).catch(() => {
          cache[title] = null
          return null
        })))
      .then((files) => {
        const result = {}
        result[file.title] = file
        for (let f of files)
          if (f != null)
            result[f.title] = f
        return result
      })
  }))
  exe.use('file', (title) => load(title))
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
      files: ql.query('files', params.title),
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
        h('ul', state.file.connections[title].map(connection =>
          h('li', {
            style: {
              'border-left-color': state.files[connection]
                ? state.files[connection].color
                : '#D9D9D9'
            }
          },
          h('a', { attrs: { href: `/${slugify(connection)}/` } }, connection))
        ))
      ])))
    ])
  }
}))
