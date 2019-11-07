/**
 * Created by lonelydawn on 2017-11-20.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import output from './modules/output'
import completion from './modules/completion'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    output,
    completion
  }
})
