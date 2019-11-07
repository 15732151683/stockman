import ajax from '../../ajax/manageIndDetail'
import { Message } from 'element-ui'

const state = {
  manageIndDetail: {},
  postIndDetail: {},
  fieldType: {},
  currentTargets: {},
  currentPage: {yema: 0, size: 10}
}
const getters = {
  manageIndDetail: state => state.manageIndDetail,
  postIndDetail: state => state.postIndDetail,
  fieldType: state => state.fieldType,
  currentTargets: state => state.currentTargets,
  currentPage: state => state.currentPage
}
const actions = {
  getDetail ({commit}, payload) {
    // console.log(payload)
    ajax.getIndDetail((data) => {
      data.code === 200
        ? commit('getDetail', data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    }, payload)
  },
  postDetail ({commit}, {payload, resolve, reject}) {
    // console.log(payload)
    ajax.postIndDetail(({ code, data, message }) => {
      // console.log(code, data)
      if (code === 200) {
        Message({
          message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve(data) : reject()
      } else {
        Message({
          message: `${code === 200 ? '保存成功' : message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve() : reject()
      }
    }, payload)
  },
  deleteDetail ({commit}, {payload, resolve, reject}) {
    // console.log(payload)
    ajax.deleteIndDetail(({ code, data, message }) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  deleteDetailType ({commit}, {payload, resolve, reject}) {
    // console.log(payload)
    ajax.deleteInddetailtype(({ code, data, message }) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  getFiledType ({commit}) {
    ajax.fieldType((data) => {
      data.code === 200
        ? commit('getFieldType', data.data)
        : Message({
          message: `data error`,
          type: 'error'
        })
    })
  },
  activeState ({commit}, {payload, resolve, reject}) {
    // console.log(payload)
    ajax.activatedState(({ code, data, message }) => {
      Message({
        message: `更改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  }
}
const mutations = {
  getDetail (state, data) {
    state.manageIndDetail = data
  },
  postDetail (state, data) {
    state.postIndDetail = data.data
  },
  getFieldType (state, data) {
    state.fieldType = data
  },
  deleteDetail (state, data) {
    // state.deleteDetail = data
  },
  currentTarget (state, data) {
    state.currentTargets = data
    // console.log(state.currentTargets)
  },
  currentpage (state, data) {
    // console.log(data)
    state.currentPage = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
