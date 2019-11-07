import ajax from '@/ajax/checkTask'
import { Message } from 'element-ui'

const state = {
  deptUsers: [],
  selectOrg: []
}
const getters = {
  deptUsers: state => state.deptUsers,
  selectOrg: state => state.selectOrg
}
const actions = {
  getDeptUser ({commit}) {
    ajax.getDeptUser(({code, data, message}) => {
      code === 200
        ? commit('getDeptUser', data)
        : Message({
          message: `部门录入人员信息获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  passTask ({commit}, {resolve, reject, payload}) {
    ajax.passTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: payload.revoke ? `取消审核通过！` : '审核通过！',
          type: 'success'
        })
        resolve()
      } else {
        Message({
          message: payload.revoke ? `取消审核通过失败， ${message}！` : `审核通过失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  rejectTask ({commit}, {resolve, reject, payload}) {
    ajax.rejectTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: payload.move ? `批回成功！` : `保存成功`,
          type: 'success'
        })
        resolve()
      } else {
        Message({
          message: payload.move ? `批回失败， ${message}！` : `保存失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  checkPass ({commit}, {resolve, reject, payload}) {
    ajax.checkPass(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: payload.nodeId === 5 ? `已提交院系审核！` : '审核通过！',
          type: 'success'
        })
        resolve(data)
      } else {
        Message({
          message: payload.nodeId === 5 ? `提交院系审核失败，${message}` : `审核失败， ${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  orgCheckPass ({commit}, {resolve, reject, payload}) {
    ajax.orgCheckPass(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `院系审核通过！`,
          type: 'success'
        })
        resolve(data)
      } else {
        Message({
          message: `院系审核失败， ${message}！`,
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
  setSelectOrg (state, payload) {
    state.selectOrg = payload
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
