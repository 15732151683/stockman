import * as types from '../types'
import ajax from '@/ajax/user'
import {Message} from 'element-ui'

const state = {
  users: [],
  total: 0,
  pageSize: 8,
  currentUser: {},
  currentPage: {pageIndex: 1, pageSize: 8},
  colleges: []
}
const getters = {
  users: state => state.users,
  total: state => state.total,
  currentUser: state => state.currentUser,
  currentPage: state => state.currentPage,
  colleges: state => state.colleges
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
  getUsers ({commit}, payload) {
    ajax.getUsers(({code, data, count, message}) => {
      code === 200
        ? commit(types.SET_USERS, data.map(item => {
          // 规范化数据
          return Object.assign({}, {
            id: item.user_id || item.id,
            username: item.login_name || '',
            name: item.user_name || '',
            password: '********',
            email: item.email || '',
            remark: item.remark || '',
            role: item.role[0],
            role_name: item.role[0] ? item.role[0].role_name : '',
            departments: item.departments,
            dept_name: item.departments.map(child => child.name).join(','),
            org: item.org,
            org_name: item.org.map(child => child.short_name_cn).join(','),
            is_login: item.is_login
          })
        }))
        : Message({
          message: `用户列表获取失败， ${message}！`,
          type: 'error'
        })
      code === 200 && commit(types.SET_USERS_COUNT, count)
      commit(types.SET_USERS_PAGESIZE, payload.pageSize || 8)
    }, payload)
  },
  create ({commit}, { payload, resolve, reject }) {
    ajax.create(({ code, data, message }) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  update ({commit}, {resolve, reject, payload}) {
    ajax.update(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.UPDATE_USER, payload)
      code === 200 ? resolve() : reject()
    }, payload)
  },
  delete ({commit}, {resolve, reject, payload}) {
    ajax.delete(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.DELETE_USER, payload)
      code === 200 ? resolve() : reject()
    }, payload)
  },
  resetPass ({commit}, id) {
    ajax.resetPass(({code, data, message}) => {
      Message({
        message: `重置密码${code === 200 ? ('成功! ' + data) : ('失败,' + message)}`,
        type: code === 200 ? 'success' : 'error'
      })
    }, id)
  }
}
const mutations = {
  [types.SET_USERS] (state, users) {
    state.users = users
  },
  getCollege (state, users) {
    state.colleges = users
  },
  setUser (state, users) {
    state.users = users
  },
  [types.SET_USERS_COUNT] (state, total) {
    state.total = total
  },
  [types.SET_USERS_PAGESIZE] (state, pageSize) {
    state.pageSize = pageSize
  },
  [types.UPDATE_USER] (state, user) {
    user.id && state.users.forEach(item => {
      if (item.id === user.id) {
        Object.assign(item, user)
      }
    })
  },
  [types.DELETE_USER] (state, id) {
    let index = state.users.findIndex(user => user.id === id)
    index > -1 && state.users.splice(index, 1)
  },
  setCurrentUser (state, currentUser) {
    state.currentUser = currentUser
  },
  currentpage (state, data) {
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
