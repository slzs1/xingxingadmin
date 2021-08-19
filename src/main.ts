import Vue from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/icons/components'
import { Route } from 'vue-router'
import '@/routerGuard'
import { can } from '@/utils/can'
import { currentUser } from '@/utils/currentUser'

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

Vue.config.productionTip = false

const protoInstall = {
  install: (Vue: any, options: any) => {
    Vue.prototype.$can = function(action: any, object: any) {
      return can(action, object)
    }
    Vue.prototype.$currentUser = function() {
      return currentUser()
    }
  }
}
Vue.use(protoInstall)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
