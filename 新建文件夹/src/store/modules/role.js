import ajax from '@/ajax/role'
import {Message} from 'element-ui'

const state = {
  roleTree: [],
  roleList: [],
  roleDetail: '',
  nowRole: ''
}
const getters = {
  roleTree: state => state.roleTree,
  roleList: state => state.roleList,
  roleDetail: state => state.roleDetail,
  nowRole: state => state.nowRole
}
const actions = {
  getRoleTree ({commit}) {
    ajax.getRoleTree(({code, data}) => {
      code === 200 && commit('getRoleTree', data)
    })
  },
  getRoleList ({commit}) {
    ajax.getRoleList(({code, data}) => {
      code === 200 && commit('getRoleList', data)
    })
  },
  getRoleDetail ({commit}, payload) {
    ajax.getRoleDetail(({code, data}) => {
      code === 200 && commit('getRoleDetail', data)
    }, payload)
  },
  createRole ({commit}, {resolve, reject, obj}) {
    ajax.createRole(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, obj)
  },
  updateRole ({commit}, {resolve, reject, payload}) {
    ajax.updateRole(({code, data, message}) => {
      // code === 200 && commit('getRoleDetail', data)
      Message({
        message: `更新${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  deleteRole ({commit}, payload) {
    ajax.deleteRole(({code, data, message}) => {
      code === 200 && commit('deleteRole', payload)
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
    }, payload)
  }
}
const mutations = {
  getRoleTree (state, data) {
    state.roleTree = data
  },
  getRoleList (state, data) {
    state.roleList = data
  },
  getRoleDetail (state, data) {
    state.roleDetail = data
  },
  deleteRole (state, id) {
    let index = state.roleList.findIndex(node => node.role_id === id)
    state.roleList.splice(index, 1)
  },
  setNowRole (state, data) {
    state.nowRole = data
  },
  setRoleDetail (state, data) {
    state.roleDetail = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
