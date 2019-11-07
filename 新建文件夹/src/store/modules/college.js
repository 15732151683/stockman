
import * as types from '@/store/types'
import ajax from '@/ajax/college'
import { Message } from 'element-ui'
const state = {
  colleges: [],
  tags: [],
  typeA: [],
  typeB: []
}
const getters = {
  colleges: state => state.colleges,
  tags: state => state.tags,
  typeA: state => state.typeA,
  typeB: state => state.typeB
}
const actions = {
  getCollege ({commit}) {
    ajax.getCollege(({code, data, message}) => {
      code === 200
        ? commit(types.SET_COLLEGE, data[0] ? data : [])
        : Message({
          message: `院系获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  create ({commit}, {resolve, reject, payload}) {
    ajax.create(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.CREATE_COLLEGE, Object.assign(payload, {
        id: data.id
      }))
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  updates ({commit}, {resolve, reject, payload}) {
    ajax.updates(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.UPDATE_COLLEGE, payload)
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  createTag ({commit}, payload) {
    ajax.createTag(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      let obj = {'name': payload.name, 'id': data}
      code === 200 && commit('createTag', obj)
    }, payload)
  },
  delete ({commit}, {resolve, reject, payload}) {
    ajax.delete(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.DELETE_COLLEGE, payload)
      code === 200 ? resolve(data) : reject()
    }, payload)
  },
  collegeAddTag ({commit}, payload) {
    ajax.collegeAddTag(({code, data, message}) => {
      Message({
        message: `更新标签${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
    }, payload)
  },
  collegeSort ({commit}, payload) {
    ajax.collegeSort(({code, data, message}) => {
    }, payload)
  },
  getTags ({commit}) {
    ajax.getTags(({code, data, message}) => {
      code === 200 && commit('getTags', data.tags)
    })
  },
  editTag ({commit}, payload) {
    ajax.editTag(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('editTag', payload)
      code === 200 && commit('collegeEditTag', payload)
      // console.log(payload, 'payload tags')
    }, payload)
  },
  deleteTag ({commit}, payload) {
    ajax.deleteTag(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('deleteTag', payload)
      code === 200 && commit('collegeDeleteTag', payload)
    }, payload)
  },
  getTypeA ({commit}) {
    ajax.getTypeA(({code, data, message}) => {
      code === 200
        ? commit('getTypeA', data)
        : Message({
          message: `获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getTypeB ({commit}) {
    ajax.getTypeB(({code, data, message}) => {
      code === 200
        ? commit('getTypeB', data)
        : Message({
          message: `获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  createTypeB ({commit}, payload) {
    ajax.createTypeB(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      let obj = {'name': payload.name, 'id': data}
      code === 200 && commit('createTypeB', obj)
    }, payload)
  },
  editTypeB ({commit}, payload) {
    ajax.editTypeB(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('editTypeB', payload)
    }, payload)
  },
  deleteTypeB ({commit}, payload) {
    ajax.deleteTypeB(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('deleteTypeB', payload)
    }, payload)
  },
  changeTypeB ({commit}, payload) {
    ajax.changeTypeB(({code, data, message}) => {
      // Message({
      //   message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
      //   type: code === 200 ? 'success' : 'error'
      // })
      // code === 200 && commit('deleteTypeB', payload)
    }, payload)
  }
}
const mutations = {
  [types.SET_COLLEGE] (state, colleges) {
    colleges.forEach(item => {
      item.typeA_id = item.typeA.id
      item.typeB_id = item.typeB.id
    })
    state.colleges = colleges
  },
  [types.CREATE_COLLEGE] (state, target) {
    state.colleges.push(target)
    let idx = state.typeB.findIndex(node => node.id === target.typeB_id)
    if (state.typeB[idx].orgs) {
      state.typeB[idx].orgs.push(target)
    } else {
      state.typeB[idx].orgs = []
      state.typeB[idx].orgs.push(target)
    }
  },
  [types.UPDATE_COLLEGE] (state, target) {
    let index = state.colleges.findIndex(col => col.id === target.id)
    if (state.colleges[index].typeB_id !== target.typeB_id) {
      let idx = state.typeB.findIndex(node => node.id === target.typeB_id)
      let old = state.typeB.findIndex(node => node.id === state.colleges[index].typeB_id)
      let ord = state.typeB[old].orgs.findIndex(org => org.id === state.colleges[index].id)
      state.typeB[idx].orgs ? state.typeB[idx].orgs.push(target) : (state.typeB[idx].orgs = [target])
      state.typeB[old].orgs.splice(ord, 1)
    }
    state.colleges.splice(index, 1)
    state.colleges.splice(index, 0, target)
  },
  [types.DELETE_COLLEGE] (state, target) {
    let index = state.colleges.findIndex(col => col.id === target.id)
    index > -1 && state.colleges.splice(index, 1)
    let idx = state.typeB.findIndex(node => node.id === target.typeB_id)
    let ord = state.typeB[idx].orgs.findIndex(org => org.id === target.id)
    state.typeB[idx].orgs.splice(ord, 1)
  },
  collegeEditTag (state, tag) {
    state.colleges.forEach(node => {
      if (node.tags && node.tags.length > 0) {
        let index = node.tags.findIndex(item => item.id === tag.id)
        if (index > -1) {
          node.tags.splice(index, 1)
          node.tags.splice(index, 0, tag)
        }
      }
    })
  },
  collegeDeleteTag (state, tag) {
    state.colleges.forEach(node => {
      if (node.tags && node.tags.length > 0) {
        let index = node.tags.findIndex(item => item.id === tag.id)
        if (index > -1) {
          node.tags.splice(index, 1)
        }
      }
    })
  },
  getTags (state, data) {
    state.tags = data
  },
  getTypeA (state, data) {
    state.typeA = !data ? [] : data
  },
  getTypeB (state, data) {
    state.typeB = !data ? [] : data
  },
  createTag (state, data) {
    state.tags.push(data)
  },
  editTag (state, data) {
    state.tags.forEach(node => {
      if (node.id === data.id) {
        node.name = data.name
      }
    })
  },
  deleteTag (state, data) {
    state.tags.splice(state.tags.indexOf(data), 1)
  },
  createTypeB (state, data) {
    state.typeB.push(data)
  },
  editTypeB (state, data) {
    // let index = state.typeB.findIndex(type => type.id === data.id)
    // state.typeB.splice(index, 1)
    // state.typeB.splice(index, 0, data)
    state.typeB.forEach(node => {
      if (node.id === data.id) {
        node.name = data.name
      }
    })
    state.colleges.forEach(col => {
      if (col.typeB_id === data.id) {
        col.typeB.name = data.name
      }
    })
  },
  deleteTypeB (state, data) {
    state.typeB.splice(state.typeB.indexOf(data), 1)
  },
  changeLabelOrder (state, {prev, next}) {
    let data = state.typeB.splice(prev, 1)
    state.typeB.splice(next, 0, data[0])
    state.typeB.forEach((node, index) => {
      node.orderNo = index + 1
    })
  },
  changeCollegeOrder (state, {prev, next}) {
    let data = state.colleges.splice(prev, 1)
    state.colleges.splice(next, 0, data[0])
    state.colleges.forEach((node, index) => {
      node.order_by = index + 1
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
