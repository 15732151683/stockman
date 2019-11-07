import axios from '@/ajax/write'
import { Message } from 'element-ui'

const state = {
  orgs: [],
  collegeData: [],
  indData: {},
  allDetail: [],
  totalCount: 0,
  detailTemplate: []
}
const getters = {
  orgs: state => state.orgs,
  collegeData: state => state.collegeData,
  indData: state => state.indData,
  allDetail: state => state.allDetail,
  totalCount: state => state.totalCount,
  detailTemplate: state => state.detailTemplate
}
const actions = {
  getOrg ({commit}) {
    axios.getOrg(({code, data}) => {
      code === 200 && commit('getOrg', data)
    })
  },
  // 使用新的api
  getDataByCollege ({commit}, payload) {
    axios.getDataByCollege(({code, data}) => {
      code === 200 ? commit('getDataByCollege', data) : commit('getDataByCollege', [])
    }, payload)
  },
  updateDataByCollege ({commit}, {payload, resolve, reject}) {
    axios.updateDataByCollege(({code, data, message}) => {
      Message({
        message: `数据更新${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  getDataByInd ({commit}, payload) {
    axios.getDataByInd(({code, data}) => {
      code === 200 && commit('getDataByInd', data)
    }, payload)
  },
  updateDataByInd ({commit}, {payload, resolve, reject}) {
    axios.updateDataByInd(({code, data, message}) => {
      Message({
        message: `数据更新${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  // 清空数据
  clearDataByCollege ({commit}, {payload, resolve, reject}) {
    axios.clearDataByCollege(({code, data, message}) => {
      Message({
        message: `数据清空${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  clearDetailByCollege ({commit}, payload) {
    axios.clearDetailByCollege(({code, data, message}) => {
      Message({
        message: `明细清空${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
    }, payload)
  },
  clearDataByInd ({commit}, {payload, resolve, reject}) {
    axios.clearDataByInd(({code, data, message}) => {
      Message({
        message: `数据清空${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  clearDetailByInd ({commit}, payload) {
    axios.clearDetailByInd(({code, data, message}) => {
      Message({
        message: `明细清空${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
    }, payload)
  },
//  指标详情新接口
  getAllDetail ({state, commit}, {payload, orgData}) {
    axios.getAllDetail(({code, data}) => {
      if (code === 200) {
        state.totalCount = data.count
        data.list && data.list.forEach(node => {
          node.org_ids = Object.keys(node.weights).map(item => {
            let name = orgData.find(child => child.id === item * 1).name
            return {id: item * 1, weight_num: node.weights[item], name}
          })
        })
        commit('getAllDetail', data.list ? data.list : [])
      }
    }, payload)
  },
  getAllYearDetail ({state, commit}, {payload, orgData}) {
    axios.getAllYearDetail(({code, data}) => {
      if (code === 200) {
        state.totalCount = data.count
        data.list && data.list.forEach(node => {
          node.org_name = orgData.find(child => child.id === node.org_id).name
          node.org_ids = Object.keys(node.weights).map(item => {
            let name = orgData.find(child => child.id === item * 1).name
            return {id: item * 1, weight_num: node.weights[item], name}
          })
        })
        commit('getAllDetail', data.list ? data.list : [])
      }
    }, payload)
  },
  getDetailTemplate ({commit}, payload) {
    axios.getDetailTemplate(({code, data}) => {
      if (code === 200 && data.fields && data.fields.length > 0) {
        let arr = data.fields.map((node, index) => {
          let type = {}
          let width = ''
          let require = false
          switch (node.col_type.id) {
            case 1:
              type.name = 'input'
              type.type = 'textarea'
              // width = node.col_width.width_val + 10 + '%'
              width = node.col_width.width_val * 10
              break
            case 2:
              type.name = 'input'
              type.type = 'number'
              width = '80'
              break
            case 3:
              type.name = 'date'
              type.type = 'date'
              width = '100'
              break
            case 4:
              type.name = 'date'
              type.type = 'month'
              width = '100'
              break
            case 5:
              type.name = 'date'
              type.type = 'year'
              width = '80'
              break
            default:
              type.name = 'input'
              type.type = 'text'
              width = '80'
          }
          if (node.is_notnull) {
            require = true
          }
          return {
            name: node.display_text,
            index: node.col_setup.col_name,
            type,
            width,
            require,
            id: index + '-' + data.id
          }
        })
        const keepData = [
          {
            name: '原值',
            index: 'raw_value',
            type: {
              name: 'input',
              type: 'number'
            },
            width: '80',
            require: true,
            id: '65-' + data.id
          },
          {
            name: '归属院系',
            index: 'org_ids',
            type: {
              name: 'select',
              type: 'select'
            },
            width: '80',
            require: false,
            id: '66-' + data.id
          }
        ]
        arr = arr.concat(keepData)
        commit('getDetailTemplate', arr)
      } else {
        commit('getDetailTemplate', [])
      }
    }, payload)
  },
  updateIndDetail ({state, commit}, {resolve, reject, payload}) {
    axios.updateIndDetail(({code, data, message}) => {
      if (code === 200) {
        if (payload.detailData.id) {
          // let obj = payload.detailData
          // let index = state.allDetail.findIndex(node => node.id === obj.id)
          // state.allDetail.splice(index, 1, obj)
          Message({
            message: '更新成功！',
            type: 'success'
          })
        } else {
          Message({
            message: '添加成功！',
            type: 'success'
          })
        }
      } else {
        if (payload.detailData.id) {
          Message({
            message: `更新失败, ${message}！`,
            type: 'error'
          })
        } else {
          Message({
            message: `添加失败, ${message}！`,
            type: 'error'
          })
        }
      }
      code === 200 ? resolve() : reject()
    }, payload)
  },
  deleteDetail ({state, commit}, {resolve, reject, payload}) {
    axios.deleteDetail(({code, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  },
  changeDetail ({state, commit}, {resolve, reject, payload}) {
    axios.changeDetail(({code, message}) => {
      Message({
        message: `更改归属${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 ? resolve() : reject()
    }, payload)
  }
}
const mutations = {
  getOrg (state, payload) {
    state.orgs = payload
  },
  setCollegeData (state, payload) {
    state.collegeData = payload
  },
  getDataByCollege (state, payload) {
    state.collegeData = payload
  },
  getDataByInd (state, payload) {
    state.indData = payload
  },
  getAllDetail (state, payload) {
    state.allDetail = payload
  },
//  new api
  getDetailTemplate (state, data) {
    state.detailTemplate = data
  },
  setAllDetail (state, payload) {
    state.allDetail = payload
  },
  // 导出指标明细模板
  exportModule (state, payload) {
    axios.exportModule((data) => {
      if (data.type !== 'application/json') {
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
  // 导入指标明细
  importData (state, {resolve, reject, payload}) {
    axios.importData((data) => {
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
  // 导出指标数据模板
  exportIndData (state, payload) {
    axios.exportIndData((data) => {
      if (data.type !== 'application/json') {
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
  // 导入指标数据
  importIndData (state, {resolve, reject, payload}) {
    axios.importIndData((data) => {
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
