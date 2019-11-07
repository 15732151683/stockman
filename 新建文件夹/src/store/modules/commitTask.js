import ajax from '@/ajax/commitTask'
import { Message } from 'element-ui'

const state = {
  nodeTree: [],
  currentTask: {},
  subTaskError: [],
  taskLog: []
}
const getters = {
  nodeTree: state => state.nodeTree,
  currentTask: state => state.currentTask,
  subTaskError: state => state.subTaskError,
  taskLog: state => state.taskLog
}
const actions = {
  getSubTaskError ({commit}, {resolve, reject, payload}) {
    ajax.getSubTaskError(({code, data, message}) => {
      if (code === 200) {
        let arr = []
        Object.keys(data).forEach(id => {
          arr.push({
            id: +id,
            data: data[id]
          })
        })
        commit('getSubTaskError', arr)
        resolve()
      } else {
        Message({
          message: `获取信息失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  commitTask ({commit}, {resolve, reject, payload}) {
    ajax.commitTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `任务提交成功！`,
          type: 'success'
        })
        resolve(data)
      } else {
        Message({
          message: `任务提交失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  getTaskLog ({commit}, {resolve, reject, payload}) {
    ajax.getTaskLog(({code, data, message}) => {
      code === 200
        ? commit('getTaskLog', data)
        : Message({
          message: `获取任务日志失败， ${message}！`,
          type: 'error'
        })
      code === 200 ? resolve(data.current) : reject()
    }, payload)
  }
}
const mutations = {
  setNodeTree (state, tree) {
    state.nodeTree = tree
  },
  setCurrentTask (state, tree) {
    state.currentTask = tree
  },
  getSubTaskError (state, data) {
    state.subTaskError = data
  },
  getTaskLog (state, data) {
    state.taskLog = data.history
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
