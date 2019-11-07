// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import 'babel-polyfill'
import Vue from 'vue'
// import element from 'element-ui'
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'

import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import './assets/css/base.css'
// import './assets/js/base.js'
import i18n from './lang'
import './assets/iconfont/iconfont.css'
Vue.config.productionTip = false
// Vue.use(element)

Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

router.beforeEach((to, from, next) => {
  let status = window.sessionStorage.getItem('udss_token')
  if (to.path === '/login') { // 当路由为login时就直接下一步操作
    next()
  } else { // 否则就需要判断
    if (status) {  // 如果有用户名就进行下一步操作
      next()
    } else {
      next({path: '/login'})
    }
  }
})

Vue.directive('hasPermission', {
  bind (el, binding, vnode) {
    let permissionList = vnode.context.$route.meta.permissionList
    if (permissionList && permissionList.length && !permissionList.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
