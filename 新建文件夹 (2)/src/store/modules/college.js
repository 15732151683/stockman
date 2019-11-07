/**
 * Created by lonelydawn on 2018-04-27.
 */

import * as types from '@/store/types'
import ajax from '@/ajax/college'
import { Message } from 'element-ui'

// 降维
const flatten = function (tree) {
  return tree.reduce((arr, current) => {
    arr.push(current)
    if (current.children && current.children.length) {
      flatten(current.children).forEach(node => {
        arr.push(node)
      })
    }
    return arr
  }, [])
}
const fNodes = function () {
  return flatten(state.colleges)
}
const minusProps = function (obj, tarKeys) {
  let result = {}
  Object.keys(obj).forEach(key => {
    tarKeys.indexOf(key) === -1 && (result[key] = obj[key])
  })
  return result
}
const childismTree = function (tree) { // 初始设置children以便Vue将属性加入响应式系统
  flatten(tree).forEach(node => {
    node.children === undefined && (node.children = null)
  })
  return tree
}

const state = {
  colleges: [],
  BasicColleges: [],
  tagTypes: [],
  tags: [],
  collegeName: []
}
const getters = {
  colleges: state => state.colleges,
  BasicColleges: state => state.BasicColleges,
  tagTypes: state => state.tagTypes,
  tags: state => state.tags,
  collegeName: state => state.collegeName
}
const actions = {
  // 参与计算的学院
  getCollege ({commit}) {
    ajax.getCollege(({code, data, message}) => {
      code === 200
        ? commit(types.SET_COLLEGE, data[0] ? childismTree(data) : [])
        : Message({
          message: `院系获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getCollege2 ({commit}) {
    ajax.getCollege2(({code, data, message}) => {
      code === 200
        ? commit('calColleges', data)
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
      // code === 200 && commit('sortCollegeById', payload.pid, payload.level)
    }, payload)
  },
  updates ({commit}, {resolve, reject, payload}) {
    ajax.updates(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.UPDATE_COLLEGE, payload)
      // code === 200 && commit('sortCollegeById', {pid: payload.pid, level: payload.level})
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
      // payload.node.tags = payload.tags
      // console.log(payload.node, payload.tags)
      // code === 200 && console.log('success add tag')
    }, payload)
  },
  collegeSort ({commit}, payload) {
    ajax.collegeSort(({code, data, message}) => {
      // Message({
      //   message: `排序更新${code === 200 ? '成功' : '失败,' + message}！`,
      //   type: code === 200 ? 'success' : 'error'
      // })
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
  getCollegeName ({commit}) {
    ajax.getName(({code, data, message}) => {
      code === 200
         ? commit('getCollegeName', data)
         : Message({
           message: `名称获取失败，${message}`
         })
    })
  }
}
const mutations = {
  [types.SET_COLLEGE] (state, colleges) {
    colleges.forEach(item => {
      if (item.org_ids !== '') {
        item.org_ids = item.org_ids.split(',').map(e => {
          return e - 0
        })
      }
    })
    state.colleges = colleges
  },
  [types.CREATE_COLLEGE] (state, target) {
    let parent = fNodes().find(node => node.id === target.pid)
    // console.log(parent, 'parent data')
    Object.assign(target, {
      level: parent && parent.level ? parent.level + 1 : 1,
      children: null
    })
    parent ? (parent.children
      ? parent.children.push(target) : parent.children = [target])
      : state.colleges.push(target)
    // state.mutations.sortCollegeById(target.pid, target.level)
  },
  [types.UPDATE_COLLEGE] (state, target) {
    let oldParent = fNodes().find(node => node.children && node.children.find(child => child.id === target.id))
    let parent = fNodes().find(node => node.id === target.pid)
    let self = fNodes().find(node => node.id === target.id)
    if (oldParent && parent && oldParent.id !== parent.id) {
      let oldIndex = oldParent ? oldParent.children.findIndex(child => child.id === target.id) : -1
      oldIndex > -1 && oldParent.children.splice(oldIndex, 1)
      let node = Object.assign(minusProps(target, ['$treeNodeId']), {
        level: parent && parent.level ? parent.level + 1 : 1
      })
      parent ? (parent.children
        ? parent.children.push(node) : parent.children = [node])
        : state.colleges.push(node)
    } else {
      // 修改采用先删除再增加方式，若直接更改属性，tree排序无法实时更改
      let index = 0
      if (parent) {
        index = parent.children.indexOf(self)
        parent.children.splice(index, 1)
        parent.children.splice(index, 0, target)
      } else {
        index = state.colleges.indexOf(self)
        state.colleges.splice(index, 1)
        state.colleges.splice(index, 0, target)
      }
      // 直接修改属性
      // Object.assign(self, target)
    }
  },
  [types.DELETE_COLLEGE] (state, target) {
    let pChilds = target.level > 1 ? ((fNodes().find(node => node.id === target.pid) || {}).children) || [] : state.colleges
    let index = pChilds.findIndex(child => child.id === target.id)
    index > -1 && pChilds.splice(index, 1)
  },
  calColleges (state, data) {
    state.BasicColleges = data
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
  getCollegeName (state, data) {
    state.collegeName = data
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
  sortCollegeById (state, {pid, level}, data) {
    if (level === 1) {
      state.colleges.sort((a, b) => {
        if (a.order_by < b.order_by) {
          return -1
        } else if (a.order_by > b.order_by) {
          return 1
        } else {
          if (a.id < b.id) {
            return -1
          } else if (a.id > b.id) {
            return 1
          }
        }
      })
    } else {
      let parent = fNodes().find(node => node.id === pid)
      console.log(parent)
      parent.children.sort((a, b) => {
        if (a.order_by < b.order_by) {
          return -1
        } else if (a.order_by > b.order_by) {
          return 1
        } else {
          if (a.id < b.id) {
            return -1
          } else if (a.id > b.id) {
            return 1
          }
        }
      })
    }
  },
  getTags (state, data) {
    state.tags = data
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
