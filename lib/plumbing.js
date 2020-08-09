import Vue from 'vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import Hub from 'seacreature/lib/hub'
import inject from 'seacreature/lib/inject'

Vue.config.devtools = false
Vue.config.productionTip = false

// Setup event bus hub
const hub = Hub()
Vue.use({
  install: (Vue, options) => {
    Vue.mixin({
      beforeCreate: function () {
        const options = this.$options
        if (options.hub)
          this.$hub = options.hub
        else if (options.parent && options.parent.$hub)
          this.$hub = options.parent.$hub
      }
    })
  }
})

// Store
import Vuex from 'vuex'
Vue.use(Vuex)
import params from './params'
const modules = { params }
for (let module of inject.many('store')) modules[module.name] = module
const store = new Vuex.Store({ modules, strict: process.env.NODE_ENV !== 'production' })

// Routes
Vue.use(Router)
const router = new Router({
  mode: 'history',
  scrollBehaviour: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition
    return { x: 0, y: 0 }
  },
  base: process.env.BASE_URL
})
router.addRoutes(inject.many('route'))

// Sync Store to Router
sync(store, router)

const scene = new Vue({
  router, store, hub, render: h => h('router-view')
})

// Unidirectional data flow
hub.on('update', p => store.commit('params/update', p))

scene.$mount('#root')
