import Vue from 'vue'
import Hub from 'seacreature/lib/hub'
import app from './app.vue'

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


import Vuex from 'vuex'
Vue.use(Vuex)
import documents from './documents'
import params from './params'

// launch Vue
const props = { }
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    [documents.name]: documents,
    params
  }
})
const scene = new Vue({
  hub,
  store,
  render: h => h(app)
})

// Unidirectional data flow
hub.on('update', p => store.commit('params/update', p))

scene.$mount('#root')
