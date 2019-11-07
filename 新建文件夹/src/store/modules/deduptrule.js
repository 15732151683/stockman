import axios from '@/ajax/deduptrule'
import { Message } from 'element-ui'
const state = {
  deduptrule: [],
  newCreate: 2222,
  upCreate: {},
  dedIndex: [],
  DetailIndex: [],
  checkedInds: []
}
const getters = {
  dedIndex: state => state.dedIndex,
  deduptrule: state => state.deduptrule,
  newCreate: state => state.newCreate,
  upCreate: state => state.upCreate,
  DetailIndex: state => state.DetailIndex,
  checkedInds: state => state.checkedInds
}
const actions = {
  getCheckedInds ({commit}) {
    axios.getTargets(({code, data, message}) => {
      if (code === 200) {
        commit('getCheckedInds', data)
      }
    })
  },
  getDeduptrule ({state, commit}, {resolve, reject}) {
    axios.getDeduptrules(({code, data, message}) => {
      if (code === 200) {
        commit('deduptIndex', data)
        resolve(data)
      } else {
        Message({
          message: `${message}`,
          type: 'error'
        })
        reject(message)
      }
    })
  },
  getDedupDetail ({state, commit}, {resolve, reject, payload}) {
    axios.getDedupDetail(({code, data, message}) => {
      if (code === 200) {
        commit('DetailIndex', data)
        resolve(data)
      } else {
        Message({
          message: `${message}`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  creatDeduptrule ({state, commit}, {resolve, reject, payload}) {
    axios.creatDeduptrule(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve(data) : reject()
        code === 200 && commit('setNewCreate', Object.assign(payload, {
          id: data, ind: []
        }))
      } else {
        Message({
          message: `${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  updateDeduptrule ({state, commit}, {resolve, reject, payload}) {
    axios.updateDeduptrule(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve(data) : reject()
        code === 200 && commit('updateNewCreate', payload)
      } else {
        Message({
          message: `${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  updateDeduptruleSort ({state, commit}, payload) {
    axios.updateDeduptruleSort(({code, data, message}) => {
      if (code === 200) {
        // Message({
        //   message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
        //   type: code === 200 ? 'success' : 'error'
        // })
      } else {
        Message({
          message: `${message}！`,
          type: 'error'
        })
      }
    }, payload)
  },
  deleteDeduptrule ({state, commit}, {resolve, reject, payload}) {
    axios.deleteDeduptrule(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
          type: code === 200 ? 'success' : 'error'
        })
        code === 200 ? resolve(payload) : reject()
        // code === 200 && commit('', payload)
      } else {
        Message({
          message: `${message}！`,
          type: 'error'
        })
      }
    }, payload)
  },
  getDetail ({state, commit}, {resolve, reject, payload}) {
    axios.getDetail(({code, data, message}) => {
      if (code === 200) {
        code === 200 ? resolve(data) : reject()
        // code === 200 && commit('setNewCreate', payload)
      } else {
        Message({
          message: `${message}！`,
          type: 'error'
        })
      }
    }, payload)
  }
}
const mutations = {
  getCheckedInds (state, payload) {
    state.checkedInds = payload
  },
  deduptIndex (state, payload) {
    state.dedIndex = payload
  },
  DetailIndex (state, payload) {
    state.DetailIndex = payload
  },
  setNewCreate (state, payload) {
    state.newCreate = payload
  },
  updateNewCreate (state, payload) {
    state.upCreate = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
