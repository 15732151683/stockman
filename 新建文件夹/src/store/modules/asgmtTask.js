import ajax from '@/ajax/asgmtTask'
import { Message } from 'element-ui'

const state = {
  deptUsers: [],
  taskDetail: []
}
const getters = {
  deptUsers: state => state.deptUsers,
  taskDetail: state => state.taskDetail
}
const actions = {
  getDeptUser ({commit}) {
    ajax.getDeptUser(({code, data, message}) => {
      code === 200
        ? commit('getDeptUser', data)
        : Message({
          message: `获取部门用户失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getTaskDetail ({commit}, {resolve, reject, id}) {
    ajax.getTaskDetail(({code, data, message}) => {
      if (code === 200) {
        commit('getTaskDetail', data)
        resolve(data)
      } else {
        Message({
          message: `获取任务详情失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, id)
  },
  updateTaskDetail ({commit}, {resolve, reject, payload}) {
    ajax.updateTaskDetail(({code, data, message}) => {
      if (code === 200) {
        // commit('updateTaskDetail', data)
        Message({
          message: `任务保存成功！`,
          type: 'success'
        })
        resolve(data)
      } else {
        Message({
          message: `任务保存失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  publishTask ({commit}, {resolve, reject, payload}) {
    ajax.publishTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `任务发布成功！`,
          type: 'success'
        })
        resolve({id: payload.id, data})
      } else {
        Message({
          message: `任务发布失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  }
}
const mutations = {
  getDeptUser (state, payload) {
    state.deptUsers = payload
  },
  getTaskDetail (state, payload) {
    state.taskDetail = payload
  }
  // publishTask (state, payload) {
  //   console.log(payload, state.tasks)
  //   let index = state.tasks.findIndex(node => node.id === payload.id)
  //   state.tasks[index].task_node = payload.data
  // }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
