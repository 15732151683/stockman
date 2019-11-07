
import ajax from '@/ajax/config'
import * as types from '@/store/types'
import { Message } from 'element-ui'
const formateDate = function () {
  let data = new Date()
  let y = data.getFullYear() + ''
  let mo = data.getMonth() + 1 + ''
  let d = data.getDate() + ''
  let h = data.getHours() + ''
  let mi = data.getMinutes() + ''
  return y + (mo.length === 1 ? ('0' + mo) : mo) + (d.length === 1 ? ('0' + d) : d) + (h.length === 1 ? ('0' + h) : h) + (mi.length === 0 ? ('0' + mi) : mi)
}
const state = {
  roles: [],
  dataTypes: [],
  timeTypes: [],
  dataType: [],
  indType: [],
  indDetail: [],
  unitType: [],
  colors: ['#17A589', '#2E86C1', '#D68910', '#884EA0', '#CB4335', '#D4AC0D', '#808B96', '#1ABC9C', '#34AEDB', '#F39C12', '#B659A9', '#EC7063', '#EECA3C', '#98A2A5', '#73C6B6', '#54A4C7', '#F8C471', '#C39BD3', '#F1948A', '#F7DC6F', '#ADB3BE', '#D0D0D7', '#E4E7E7'],
  loadingStatus: false
}
const getters = {
  roles: state => state.roles,
  dataTypes: state => state.dataTypes,
  timeTypes: state => state.timeTypes,
  dataType: state => state.dataType,
  indType: state => state.indType,
  indDetail: state => state.indDetail,
  unitType: state => state.unitType,
  colors: state => state.colors,
  loadingStatus: state => state.loadingStatus,
  yearOptions () {
    let data = new Date()
    let base = data.getFullYear()
    let options = []
    for (let i = -30; i < 30; i++) {
      options.push(base + i)
    }
    return options
  }
}
const actions = {
  getRoles ({ commit }) {
    ajax.getRoles(({ code, data, message }) => {
      code === 200
        ? commit(types.SET_ROLE_TYPES, data)
        : Message({
          message: `数据获取失败， ${message}！`, // 角色类型获取失败
          type: 'error'
        })
    })
  },
  getDataTypes ({ commit }) {
    ajax.getDataTypes(({ code, data, message }) => {
      code === 200
        ? commit(types.SET_DATA_TYPES, data)
        : Message({
          message: `数据获取失败， ${message}！`, // 数据类型获取失败
          type: 'error'
        })
    })
  },
  getTimeTypes ({ commit }) {
    ajax.getTimeTypes(({ code, data, message }) => {
      code === 200
        ? commit(types.SET_TIME_TYPES, data)
        : Message({
          message: `数据获取失败， ${message}！`, // 时间类型获取失败
          type: 'error'
        })
    })
  },
  getDataType ({ commit }) {
    ajax.getDataType(({ code, data, message }) => {
      code === 200
        ? commit('getDateType', data)
        : Message({
          message: `数据获取失败， ${message}！`, // 数据类型获取失败
          type: 'error'
        })
    })
  },
  getIndType ({ commit }) {
    ajax.getIndType(({ code, data, message }) => {
      code === 200
        ? commit('getIndType', data)
        : Message({
          message: `数据获取失败， ${message}！`, // 指标数据类型获取失败
          type: 'error'
        })
    })
  },
  getIndDetail ({ commit }, id) {
    ajax.getIndDetail(({ code, data, message }) => {
      code === 200
        ? commit('getIndDetail', data.list ? data.list : [])
        : Message({
          message: `数据获取失败， ${message}！`, // 指标数据类型获取失败
          type: 'error'
        })
    }, id)
  },
  getUnitType ({ commit }) {
    ajax.getUnitType(({ code, data, message }) => {
      code === 200
        ? commit('getUnitType', data)
        : Message({
          message: `数据获取失败， ${message}！`, // 单位数据类型获取失败
          type: 'error'
        })
    })
  }
}
const mutations = {
  [types.SET_ROLE_TYPES] (state, roles) {
    state.roles = roles
  },
  [types.SET_DATA_TYPES] (state, dataTypes) {
    state.dataTypes = dataTypes
  },
  [types.SET_TIME_TYPES] (state, timeTypes) {
    state.timeTypes = timeTypes
  },
  getDateType (state, dataType) {
    state.dataType = dataType
  },
  getIndType (state, dataType) {
    state.indType = dataType
  },
  getIndDetail (state, dataType) {
    state.indDetail = dataType
  },
  getUnitType (state, dataType) {
    state.unitType = dataType
  },
  exportDataA (state, payload) {
    ajax.exportDataA((data) => {
      if (data.type !== 'application/json') {
        let timer = formateDate()
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let downName = payload.name + '_' + timer + '.xlsx'
        link.setAttribute('download', downName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
        state.loadingStatus = false
      } else {
        // blob转JSON数据
        let reader = new FileReader()
        reader.onload = e => {
          let msg = JSON.parse(e.target.result)
          Message({
            message: `无法下载， ${msg.message}！`,
            type: 'error'
          })
          state.loadingStatus = false
        }
        reader.readAsText(data)
      }
    }, payload)
  },
  exportDataB (state, payload) {
    ajax.exportDataB((data) => {
      if (data.type !== 'application/json') {
        let timer = formateDate()
        let url = window.URL.createObjectURL(new Blob([data]))
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        let downName = payload.name + '_' + timer + '.xlsx'
        link.setAttribute('download', downName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
        state.loadingStatus = false
      } else {
        // blob转JSON数据
        let reader = new FileReader()
        reader.onload = e => {
          let msg = JSON.parse(e.target.result)
          Message({
            message: `无法下载， ${msg.message}！`,
            type: 'error'
          })
          state.loadingStatus = false
        }
        reader.readAsText(data)
      }
    }, payload)
  },
  setLoading (state, payload) {
    state.loadingStatus = payload
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
