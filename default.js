const h = require('snabbdom/h').default
const ql = require('odoql2')
const inject = require('injectinto')
const route = require('odo-route')
const page = require('page')
const matter = require('gray-matter')
const marked = require('marked')

inject('pod', (hub, exe) => {
})

route('/', (p) => {
  return { page: 'default' }
})

inject('page:default', ql.component({
  query: (state, params) => {
    return { }
  },
  render: (state, params, hub) => {
    const data = `---
title: Business Analysis
color: '#98C892'
connections:
  Next work skill:
  - Profit and loss

  Important thinking styles:
  - Analytical
  - Curiousity
  - Methodical

  Job titles:
  - Business Analyst

  Experiences:
  - Implementing a CRM
---
# Business Analysis

Business analysis is the practice of enabling change in an organizational context, by defining needs and recommending solutions that deliver value to stakeholders.

It is usually performed by [Business Analysts](/Business+Analyst/).

https://google.com/`

    const file = matter(data)
    const content = marked(file.content)

    return h('div.wrapper', [
      h('header', [
        h('h1', 'Mind Catalyst')
      ]),
      h('div.caption', file.data.title),
      h('article', {
        props: { innerHTML: content },
        style: { 'border-left-color': file.data.color }
      }),
      h('nav', [
        
      ])
    ])
  }
}))
