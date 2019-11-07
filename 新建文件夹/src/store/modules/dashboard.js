import ajax from '../../ajax/dashboard'
import { Message } from 'element-ui'

const state = {
  tagId: '',
  top: {},
  sbj0: {},
  sbj: {},
  sbj2: {},
  sbj3: {},
  sbjAll: {}
}
const getters = {
  tagId: state => state.tagId,
  top: state => state.top,
  sbj0: state => state.sbj0,
  sbj: state => state.sbj,
  sbj2: state => state.sbj2,
  sbj3: state => state.sbj3,
  sbjAll: state => state.sbjAll
}
const actions = {
  getTagId ({commit}, {resolve, reject}) {
    ajax.getTagId((data) => {
      data.data.code === 200
        ? commit('getTagId', data.data)
        : Message({
          message: `${data.data.message}`,
          type: 'error'
        })
      data.data.code === 200 ? resolve(data.data) : reject()
    })
  },
  getTop ({commit}) {
    ajax.getTop((data) => {
      data.data.code === 200
        ? commit('getTop', data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    })
  },
  getSbj0 ({commit}, payload) {
    ajax.getSbj0((data) => {
      data.data.code === 200
        ? commit('getEdu', data.data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  getSbj1 ({commit}, payload) {
    ajax.getSbj((data) => {
      data.data.code === 200
        ? commit('getSbj', data.data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  getSbj2 ({commit}, payload) {
    ajax.getSbj((data) => {
      data.data.code === 200
        ? commit('getSbj2', data.data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  getSbj3 ({commit}, payload) {
    ajax.getSbj((data) => {
      data.data.code === 200
        ? commit('getSbj3', data.data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  getSbjAll ({commit}, payload) {
    ajax.getSbjAll((data) => {
      // console.log(data)
      data[0].data.code === 200
        ? commit('getEdu', data[0].data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
      data[1].data.code === 200
        ? commit('getSbj', data[1].data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
      data[2].data.code === 200
        ? commit('getSbj2', data[2].data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
      data[3].data.code === 200
        ? commit('getSbj3', data[3].data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  updates ({commit}, {payload, resolve, reject}) {
    // console.log(payload)
    ajax.update(({ code, data, message }) => {
      // console.log(code, data)
      if (code === 200) {
        Message({
          message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve() : reject()
      } else {
        Message({
          message: `该指标已被使用`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve() : reject()
      }
    }, payload)
  }
}
const mutations = {
  getTagId (state, data) {
    state.tagId = data.data
  },
  getTop (state, data) {
    state.top = data.data
  },
  getEdu (state, data) {
    // data.dialogTableVisible = false
    // console.log(11111111111111)
    state.sbj0 = data
  },
  getSbj (state, data) {
    // s.dialogTableVisible = false
    state.sbj = data
  },
  getSbj2 (state, data) {
    state.sbj2 = data
    // data.dialogTableVisible = false
    // state.sbj2 = data
  },
  getSbj3 (state, data) {
    state.sbj3 = data
    // data.dialogTableVisible = false
    // state.sbj3 = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
