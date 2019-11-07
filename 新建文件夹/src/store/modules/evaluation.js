import ajax from '@/ajax/evaluation'
import { Message } from 'element-ui'
const state = {
  colleges: [],
  evaluations: [],
  detailEvaluation: '',
  nowEvaluation: null,
  schemes: []
}
const getters = {
  colleges: state => state.colleges,
  evaluations: state => state.evaluations,
  detailEvaluation: state => state.detailEvaluation,
  nowEvaluation: state => state.nowEvaluation,
  schemes: state => state.schemes
}
const actions = {
  getCollege ({commit}) {
    ajax.getCollege(({code, data, message}) => {
      code === 200
        ? commit('getCollege', data)
        : Message({
          message: `院系获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getEvaluations ({commit}) {
    ajax.getEvaluations(({code, data, message}) => {
      if (code === 200) {
        data.forEach(node => {
          let timer = node.updated_at
          let arr = timer.split(' ')
          node.updated_at = arr[0]
        })
        commit('getEvaluations', data)
      }
    })
  },
  getScheme ({commit}) {
    ajax.getScheme(({code, data, message}) => {
      if (code === 200) {
        // let arr = data.length > 8 ? data.slice(0, 6) : data
        commit('getScheme', data)
      }
    })
  },
  evaluationSort ({commit}, payload) {
    ajax.evaluationSort(({code, data, message}) => {
    }, payload)
  },
  deleteEvaluation ({commit}, payload) {
    ajax.deleteEvaluation(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('deleteEvaluation', payload)
    }, payload)
  },
  getEvaluationById ({commit}, payload) {
    ajax.getEvaluationById(({code, data, message}) => {
      code === 200 && commit('getEvaluationById', data)
    }, payload)
  },
  createEvaluation ({commit}, {data, resolve, reject}) {
    ajax.createEvaluation(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, data)
  },
  updateEvaluation ({commit}, {resolve, reject, payload}) {
    ajax.updateEvaluation(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  swicthPublish ({commit}, {resolve, reject, payload}) {
    ajax.swicthPublish(({code, data, message}) => {
      code === 200 && commit('swicthPublish', payload)
      code === 200 ? resolve() : reject(message)
    }, payload)
  }
}
const mutations = {
  getCollege (state, payload) {
    state.colleges = payload
  },
  getEvaluations (state, payload) {
    state.evaluations = payload
  },
  deleteEvaluation (state, target) {
    let index = state.evaluations.findIndex(node => node.id === target.id)
    state.evaluations.splice(index, 1)
  },
  changeEvaluation (state, {prev, next}) {
    let data = state.evaluations.splice(prev, 1)
    state.evaluations.splice(next, 0, data[0])
    state.evaluations.forEach((node, index) => {
      node.order_no = index + 1
    })
  },
  getEvaluationById (state, data) {
    state.detailEvaluation = data
  },
  getNowEvaluation (state, data) {
    state.nowEvaluation = data
  },
  setEvaluationById (state, data) {
    state.detailEvaluation = data
  },
  getScheme (state, payload) {
    state.schemes = payload
  },
  swicthPublish (state, row) {
    let index = state.evaluations.findIndex(node => node.id === row.id)
    row.is_published = !row.is_published
    state.evaluations.splice(index, 1, row)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
