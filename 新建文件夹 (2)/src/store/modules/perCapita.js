import axios from '@/ajax/perCapita'
// import { Message } from 'element-ui'

// 设置颜色
const setColor = function (tree) {
  tree.forEach((item, index) => {
    if (index < 23) {
      item.id = index
    } else {
      item.id = 22
    }
  })
}
const state = {
  perCapita: []
}
const getters = {
  perCapita: state => state.perCapita
}
const actions = {
  getCapita ({commit}, payload) {
    axios.getCapita(({code, data}) => {
      if (code === 200) {
        data.sort((a, b) => {
          return b.ratio - a.ratio
        })
        setColor(data)
        commit('getCapita', data)
      }
    }, payload)
  }
}
const mutations = {
  getCapita (state, data) {
    state.perCapita = data
  },
  setCapita (state, data) {
    state.perCapita = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
