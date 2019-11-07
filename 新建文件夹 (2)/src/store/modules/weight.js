import ajax from '@/ajax/weight'
import { Message } from 'element-ui'

const state = {
  allWeight: [],
  nowWeight: '',
  nowWeightInfo: ''
}
const getters = {
  allWeight: state => state.allWeight,
  nowWeight: state => state.nowWeight,
  nowWeightInfo: state => state.nowWeightInfo
}
const actions = {
  getAllWeight ({commit}) {
    ajax.getAllWeight(({ code, data }) => {
      code === 200 && commit('getAllWeight', data)
    })
  },
  getNowWeight ({commit}, id) {
    ajax.getNowWeight(({ code, data }) => {
      code === 200 && commit('getNowWeight', data)
    }, id)
  },
  createWeight ({commit}, { payload, resolve, reject }) {
    ajax.createWeight(({code, data, message}) => {
      // Message({
      //   message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
      //   type: code === 200 ? 'success' : 'error'
      // })
      code === 200 ? resolve() : reject(message)
    }, payload)
  },
  updateWeight ({commit}, { payload, resolve, reject }) {
    ajax.updateWeight(({code, data, message}) => {
      // Message({
      //   message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
      //   type: code === 200 ? 'success' : 'error'
      // })
      code === 200 ? resolve() : reject(message)
    }, payload)
  },
  deletWeight ({commit}, { id, resolve, reject }) {
    ajax.deletWeight(({code, data, message}) => {
      code === 200 ? resolve() : reject(message)
    }, id)
  },
  weightSwicth ({commit, state}, {resolve, reject, id}) {
    ajax.weightSwicth(({code, data, message}) => {
      code === 200 ? resolve() : reject(message)
      if (code === 200) {
        state.nowWeightInfo.is_published = !state.nowWeightInfo.is_published
      }
    }, id)
  },
  updateOrders ({commit}, { payload, resolve, reject }) {
    ajax.updateOrder(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  }
}
const mutations = {
  getAllWeight (state, weight) {
    state.allWeight = weight
  },
  getNowWeight (state, weight) {
    state.nowWeight = weight
  },
  getNowWeightInfo (state, data) {
    state.nowWeightInfo = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
