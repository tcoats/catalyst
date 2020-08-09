import inject from 'seacreature/lib/inject'
import { unslugify } from './lib/slug'

inject('route', {
  path: '/',
  component: () => import('./document.vue'),
  props: { title: 'Index' }
})

inject('route', {
  path: '/:title',
  component: () => import('./document.vue'),
  props: route => ({ title: unslugify(route.params.title) })
})
inject('route', { path: '/notfound', component: () => import('./notfound.vue')})
inject('route', { path: '/*', redirect: '/notfound' })
