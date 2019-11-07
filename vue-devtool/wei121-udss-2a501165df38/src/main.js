// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'
import Vue from 'vue'
import element from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'

import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/base.css'
import './assets/js/base.js'

Vue.config.productionTip = false
Vue.use(element)

Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
