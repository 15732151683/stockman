import axios from '@/ajax/outIn'

const state = {
  colleges: {},
  allData: [],
  converts: []
}
const getters = {
  colleges: state => state.colleges,
  allData: state => state.allData,
  converts: state => state.converts
}
const actions = {
  getCollege ({commit}) {
    axios.getCollege(({code, data}) => {
      code === 200 && commit('getCollege', data)
      // console.log(data, '--------------')
    })
  },
  getConvert ({commit}, {resolve, reject}) {
    axios.getConvert(({code, data}) => {
      code === 200 && commit('getConvert', data)
      code === 200 ? resolve() : reject()
    })
  },
  updateConvert ({commit}, { payload, resolve, reject }) {
    axios.updateConvert(({code, data, message}) => {
      // code === 200 && commit('getConvert', data)
      code === 200 ? resolve() : reject(message)
    }, payload)
  },
  getAllData ({commit}, payload) {
    axios.getAllData(({code, data}) => {
      code === 200 && commit('getAllData', data)
    }, payload)
  }
}
const mutations = {
  getCollege (state, payload) {
    state.colleges = payload
  },
  getAllData (state, payload) {
    state.allData = payload
  },
  setAllData (state, payload) {
    state.allData = payload
  },
  getConvert (state, payload) {
    state.converts = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
