
import axios from '@/ajax/output'

const setColorIndex = function (tree) {
  tree.forEach(item => {
    item.value = item.val
    let index = item.rank - 1
    if (index === -1) {
      item.idx = 22
      item.id = 23
    } else if (index < 23) {
      item.idx = index
      item.id = index + 1
    } else {
      item.idx = 22
      item.id = 23
    }
  })
}
const state = {
  performance: [],
  scheme: [],
  activeScheme: -1
}
const getters = {
  performance: state => state.performance,
  scheme: state => state.scheme,
  activeScheme: state => state.activeScheme
}
const actions = {
  getPerformance ({commit}, payload) {
    axios.getPerformance(({code, data, message}) => {
      if (code === 200) {
        data ? data.sort((a, b) => {
          return b.val - a.val
        }) : data = []
        setColorIndex(data)
        commit('getPerformance', data)
      }
    }, payload)
  },
  getScheme ({commit}) {
    axios.getScheme(({code, data, message}) => {
      code === 200 && commit('getScheme', data)
    })
  }
}
const mutations = {
  getPerformance (state, data) {
    state.performance = data
  },
  getScheme (state, data) {
    state.scheme = data
  },
  setPerformance (state, data) {
    state.performance = data
  },
  setActive (state, data) {
    state.activeScheme = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
