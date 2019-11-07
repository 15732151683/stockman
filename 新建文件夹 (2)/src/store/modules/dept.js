import ajax from '@/ajax/dept'
import { Message } from 'element-ui'

const state = {
  depts: []
}
const getters = {
  depts: state => state.depts
}
const actions = {
  getDept ({commit}) {
    ajax.getDept(({code, data, message}) => {
      code === 200
        ? commit('getDept', data)
        : Message({
          message: `部门信息获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  deptSort ({commit}, payload) {
    ajax.deptSort(({code, data, message}) => {
    }, payload)
  },
  create ({commit}, {resolve, reject, payload}) {
    ajax.create(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('create', Object.assign(payload, {
        id: data
      }))
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  update ({commit}, {resolve, reject, payload}) {
    ajax.update(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('update', payload)
      code === 200 ? resolve() : reject()
    }, payload)
  },
  delete ({commit}, {resolve, reject, payload}) {
    ajax.delete(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('delete', payload)
      code === 200 ? resolve(data) : reject()
    }, payload)
  }
}
const mutations = {
  getDept (state, payload) {
    state.depts = payload
  },
  create (state, payload) {
    state.depts.push(payload)
  },
  update (state, target) {
    let index = state.depts.findIndex(child => child.id === target.id)
    index > -1 && state.depts.splice(index, 1, target)
  },
  delete (state, target) {
    let index = state.depts.findIndex(child => child.id === target.id)
    index > -1 && state.depts.splice(index, 1)
  },
  changeDeptOrder (state, {prev, next}) {
    let data = state.depts.splice(prev, 1)
    state.depts.splice(next, 0, data[0])
    state.depts.forEach((node, index) => {
      node.order_no = index + 1
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
