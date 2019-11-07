// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Axios from 'axios'
import router from '../router'
// import 'bootstrap/js/bootstrap.min.js'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import 'bootstrap/dist/js/bootstrap.min'

import Vuex from 'vuex';
import ElementUi from "element-ui";
// import 'element-ui/lib/theme-chalk/index.css';
import app from './App.vue'
Vue.use(ElementUi)
Vue.use(Vuex);
var store = new Vuex.Store({
    getters:{

    },
  state:{
      count:2
  },
    mutations:{
        add1(state,arg){
          console.log(3333);
            state.count += arg;
        }
        // add1(state){  //无参数的可以用简写形式
        //     console.log(3333);
        //     state.count ++;
        // }
    },
    actions:{
        // aa(context,arg){
        //   console.log(222);
        //   context.commit('add1',arg)
        // }
        add1({commit},arg){
            commit("add1")
        }
    }
})


Vue.prototype.$http = Axios;


Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
    store,
  components: { app },
  template: '<App/>'
})
