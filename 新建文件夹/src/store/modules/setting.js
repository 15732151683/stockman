import ajax from '@/ajax/setting'
import { Message } from 'element-ui'

const state = {
  currentYear: -1,
  allScheme: [],
  schemeData: [],
  schemeDataByInd: [],
  nowSchemeId: -1,
  activeOrg: [],
  nowScheme: '',
  confirmLoading: false,
  confirmShow: false,
  buttonShow: [false, true, false],
  getStatus: '',
  nowSchemeName: ''
}
const getters = {
  allScheme: state => state.allScheme,
  schemeData: state => state.schemeData,
  schemeDataByInd: state => state.schemeDataByInd,
  nowSchemeId: state => state.nowSchemeId,
  nowSchemeName: state => state.nowSchemeName,
  activeOrg: state => state.activeOrg,
  nowScheme: state => state.nowScheme,
  confirmLoading: state => state.confirmLoading,
  confirmShow: state => state.confirmShow,
  buttonShow: state => state.buttonShow,
  currentYear: state => state.currentYear,
  getStatus: state => state.getStatus
}
const actions = {
  getScheme ({commit}) {
    ajax.getScheme(({code, data, message}) => {
      if (code === 200) {
        data.forEach(node => {
          let timer = node.created_at
          let arr = timer.split(' ')
          node.created_at = arr[0]
        })
        commit('getScheme', data)
      }
    })
  },
  createScheme ({commit}, payload) {
    ajax.createScheme(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('setNowSchemeId', data)
      code === 200 && commit('updateActiveOrg', payload)
      commit('setConfirmLoading', false)
      code === 200 && commit('confirmShowCard', true)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
    }, payload)
  },
  createBaseScheme ({commit}, payload) {
    ajax.createBaseScheme(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('setNowSchemeId', data)
      commit('setConfirmLoading', false)
      code === 200 && commit('confirmShowCard', false)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
    }, payload)
  },
  createSchemeByInd ({commit}, payload) {
    ajax.createSchemeByInd(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('setNowSchemeId', data)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
      commit('setConfirmLoading', false)
    }, payload)
  },
  updateScheme ({commit}, payload) {
    ajax.updateScheme(({code, data, message}) => {
      Message({
        message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('updateActiveOrg', payload)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
      commit('setConfirmLoading', false)
      commit('confirmShowCard', false)
    }, payload)
  },
  updateBaseScheme ({commit}, payload) {
    ajax.updateBaseScheme(({code, data, message}) => {
      Message({
        message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      commit('setConfirmLoading', false)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
    }, payload)
  },
  updateSchemeByInd ({commit}, payload) {
    ajax.updateSchemeByInd(({code, data, message}) => {
      Message({
        message: `保存${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      commit('setConfirmLoading', false)
      code === 200 && commit('setNowSchemeName', payload.schemeName)
    }, payload)
  },
  deleteScheme ({commit}, payload) {
    // commit('deleteScheme', index)
    ajax.deleteScheme(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('deleteScheme', payload)
    }, payload.id)
  },
  schemeSort ({commit}, payload) {
    ajax.schemeSort(({code, data, message}) => {
    }, payload)
  },
  getSchemeData ({commit}, {resolve, reject, payload}) {
    ajax.getSchemeData(({code, data, message}) => {
      code === 200
        ? commit('getSchemeData', data.ind_data)
        : Message({
          message: `数据错误， ${message}！`,
          type: 'error'
        })
      code === 200 && resolve()
    }, payload)
  },
  getSchemeDataByInd ({commit}, payload) {
    ajax.getSchemeDataByInd(({code, data, message}) => {
      code === 200
        ? commit('getSchemeDataByInd', data)
        : Message({
          message: `数据错误， ${message}！`,
          type: 'error'
        })
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
  // 导入
  importData (state, {resolve, reject, payload}) {
    ajax.importData((data) => {
      if (data.type !== 'application/json') {
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let downName = payload.file.name
        link.setAttribute('download', downName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
        state.loadingStatus = false
        reject()
      } else {
        resolve()
      }
    }, payload)
  },
  // 导出
  exp (state, payload) {
    ajax.exportData((data) => {
      let url = window.URL.createObjectURL(new Blob([data]))
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      let downName = payload.name + '.xlsx'
      link.setAttribute('download', downName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) // 下载完成移除元素
      window.URL.revokeObjectURL(url) // 释放掉blob对象
      state.loadingStatus = false
    }, payload)
  },
  setStatus (state, data) {
    state.getStatus = data
  },
  downStatus (state, data) {
    state.buttonShow = data
  },
  getScheme (state, data) {
    state.allScheme = data
  },
  schemeYear (state, data) {
    state.currentYear = data
  },
  setNowSchemeId (state, data) {
    state.nowSchemeId = data
  },
  setNowSchemeName (state, data) {
    state.nowSchemeName = data
  },
  setNowScheme (state, data) {
    state.nowScheme = data
    state.nowSchemeName = data.name
  },
  clearActiveOrg () {
    state.activeOrg = []
  },
  setActiveOrg (state, data) {
    state.activeOrg = state.activeOrg.concat(data)
  },
  updateActiveOrg (state, data) {
    let index = state.activeOrg.findIndex(node => node === data.orgId)
    if (data.indData.length > 0) {
      index < 0 && state.activeOrg.push(data.orgId)
    } else {
      index > -1 && state.activeOrg.splice(index, 1)
    }
  },
  confirmShowCard (state, data) {
    state.confirmShow = data
  },
  deleteScheme (state, target) {
    let index = state.allScheme.findIndex(node => node.id === target.id)
    state.allScheme.splice(index, 1)
  },
  getSchemeData (state, data) {
    state.schemeData = data
  },
  setSchemeData (state, data) {
    state.schemeData = data
  },
  getSchemeDataByInd (state, data) {
    state.schemeDataByInd = data
  },
  setSchemeDataByInd (state, data) {
    state.schemeDataByInd = data
  },
  setConfirmLoading (state, data) {
    state.confirmLoading = data
  },
  changeScheme (state, {prev, next}) {
    let data = state.allScheme.splice(prev, 1)
    state.allScheme.splice(next, 0, data[0])
    state.allScheme.forEach((node, index) => {
      node.order_no = index + 1
    })
  },
  swicthPublish (state, row) {
    let index = state.allScheme.findIndex(node => node.id === row.id)
    row.is_published = !row.is_published
    state.allScheme.splice(index, 1, row)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
