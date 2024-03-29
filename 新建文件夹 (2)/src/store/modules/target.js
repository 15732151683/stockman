
import * as types from '@/store/types'
import ajax from '@/ajax/target'
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
  return flatten(state.targets)
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
  targets: [],
  tagTypes: [],
  tags: [],
  checkedInds: [],
  detailStatus: true
}
const getters = {
  targets: state => state.targets,
  tagTypes: state => state.tagTypes,
  tags: state => state.tags,
  checkedInds: state => state.checkedInds,
  detailStatus: state => state.detailStatus
}
const actions = {
  getTargets ({commit}) {
    ajax.getTargets(({code, data, message}) => {
      code === 200
        ? commit(types.SET_TARGETS, data ? childismTree(data) : [])
        : Message({
          message: `指标数据错误， ${message}！`, // 指标数据获取错误
          type: 'error'
        })
    })
  },
  getCheckedInds ({commit}) {
    ajax.getTargets(({code, data, message}) => {
      if (code === 200) {
        let obj = data.length > 1 ? data[0] : {'children': []}
        let arr = obj.children
        commit('getCheckedInds', arr)
      }
    })
  },
  getTagTypes ({commit}) {
    ajax.getTagTypes(({code, data, message}) => {
      code === 200
        ? commit('getTagTypes', data)
        : Message({
          message: `标签类型数据错误， ${message}！`,
          type: 'error'
        })
    })
  },
  getTags ({commit}) {
    ajax.getTags(({code, data, message}) => {
      code === 200
        ? commit('getTags', data)
        : Message({
          message: `标签数据错误， ${message}！`,
          type: 'error'
        })
    })
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
  create ({commit}, {resolve, reject, payload}) {
    ajax.create(({code, data, message}) => {
      Message({
        message: `创建${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      if (code === 200) {
        commit(types.CREATE_TARGET, Object.assign(payload, {
          id: data
        }))
        commit('sortTargetById', payload.pid)
        resolve()
      } else {
        reject()
      }
    }, payload)
  },
  update ({commit}, {resolve, reject, payload}) {
    ajax.update(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      if (code === 200) {
        commit(types.UPDATE_TARGET, payload)
        commit('sortTargetById', payload.pid)
        resolve()
      } else {
        reject()
      }
    }, payload)
  },
  changeOrder ({commit}, payload) {
    ajax.changeOrder((data) => {
    }, payload)
  },
  delete ({commit}, {payload, resolve, reject}) {
    ajax.delete(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit(types.DELETE_TARGET, payload)
      code === 200 ? resolve() : reject()
    }, payload)
  },
  editTag ({commit}, payload) {
    ajax.editTag(({code, data, message}) => {
      Message({
        message: `修改${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('editTag', payload)
    }, payload)
  },
  deleteTag ({commit}, payload) {
    ajax.deleteTag(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('deleteTag', payload)
    }, payload)
    // commit('deleteTag', payload)
  },
  getDetailStatus ({commit}, payload) {
    ajax.getDetailStatus(({code, data, message}) => {
      code === 200 && commit('setDetailStatus', data)
    }, payload)
  }
}
const mutations = {
  [types.SET_TARGETS] (state, targets) {
    state.targets = targets
  },
  getTarget (state, targets) {
    state.targets = targets
  },
  getTags (state, tags) {
    state.tags = tags
  },
  getTagTypes (state, types) {
    state.tagTypes = types
  },
  getCheckedInds (state, types) {
    state.checkedInds = types
  },
  [types.CREATE_TARGET] (state, target) {
    let parent = fNodes().find(node => node.id === target.pid)
    Object.assign(target, {
      level: parent && parent.level ? parent.level + 1 : 1,
      children: null
    })
    parent ? (parent.children
      ? parent.children.push(target) : parent.children = [target])
      : state.targets.push(target)
  },
  [types.UPDATE_TARGET] (state, target) {
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
        : state.targets.push(node)
    } else {
      // 修改采用先删除再增加方式，若直接更改属性，tree排序无法实时更改
      let index = 0
      if (parent) {
        index = parent.children.indexOf(self)
        parent.children.splice(index, 1)
        parent.children.splice(index, 0, target)
      } else {
        index = state.targets.indexOf(self)
        state.targets.splice(index, 1)
        state.targets.splice(index, 0, target)
      }
      // 直接修改属性
      // Object.assign(self, target)
    }
  },
  [types.DELETE_TARGET] (state, target) {
    let pChilds = target.pid > 0 ? ((fNodes().find(node => node.id === target.pid) || {}).children) || [] : state.targets
    let index = pChilds.findIndex(child => child.id === target.id)
    index > -1 && pChilds.splice(index, 1)
  },
  sortTargetById (state, pid) {
    if (pid === 0) {
      state.targets.sort((a, b) => {
        if (a.order_no < b.order_no) {
          return -1
        } else if (a.order_no > b.order_no) {
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
      parent.children.sort((a, b) => {
        if (a.order_no < b.order_no) {
          return -1
        } else if (a.order_no > b.order_no) {
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
  createTag (state, data) {
    state.tags.tags.push(data)
  },
  editTag (state, data) {
    state.tags.tags.forEach(node => {
      if (node.id === data.id) {
        node.name = data.name
      }
    })
  },
  deleteTag (state, data) {
    state.tags.tags.splice(state.tags.tags.indexOf(data), 1)
  },
  setDetailStatus (state, data) {
    state.detailStatus = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
