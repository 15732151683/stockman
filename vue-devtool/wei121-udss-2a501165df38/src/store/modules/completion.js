/**
 * Created by lonelydawn on 2017-11-20.
 */

/* eslint-disable */
import * as types from '../types'
import completion from '../../ajax/completion'

export default {
  namespaced: true,
  state: {
    target: [],
    college: {},
    targetTree: [],
    collegeTree: [],
    // 标识学院指标树 展开的节点
    collegeTargetExpanded: [],
    sortMode: -1
  },
  getters: {
    target: state => state.target,
    college: state => {
      const thorough = function (tree) {
        for (let node of tree) {
          if (node.id && state.collegeTargetExpanded.find(id => node.id === id)) {
            node.expand = true
          }
          if (node.children) {
            thorough(node.children)
          }
        }
      }
      Object.keys(state.college).length > 0 && state.college.target.length > 0 && thorough(state.college.target)
      return state.college
    },
    collegeTree: state => state.collegeTree,
    targetTree: state => state.targetTree,
    sortMode: state => state.sortMode
  },
  actions: {
    getCompletionByCollege ({commit}, collegeId) {
      completion.getCompletionByCollege((tree) => commit(types.COMPLETION_SET_COLLEGE, tree), collegeId)
    },
    getCompletionByTarget ({commit}, target) {
      completion.getCompletionByTarget((target) => {
        commit(types.COMPLETION_SET_TARGET, target)
        commit('sortTarget')
      }, target)
    },
    getTargetTree ({commit}) {
      completion.getTargetTree((tree) => commit(types.COMPLETION_SET_TARGET_TREE, tree))
    },
    getCollegeTree ({commit}) {
      completion.getCollegeTree((tree) => commit(types.COMPLETION_SET_COLLEGE_TREE, tree))
    }
  },
  mutations: {
    [types.COMPLETION_SET_COLLEGE] (state, college) {
      state.college = college
    },
    [types.COMPLETION_SET_TARGET] (state, target) {
      state.target = target
    },
    [types.COMPLETION_SET_TARGET_TREE] (state, tree) {
      state.targetTree = tree
    },
    [types.COMPLETION_SET_COLLEGE_TREE] (state, tree) {
      state.collegeTree = tree
    },
    setSortMode (state, mode) {
      state.sortMode = mode
    },
    sortTarget (state) {
      switch (state.sortMode) {
        case 0:
          state.target.sort((a, b) => {
            return a.name > b.name ? 1 : -1
          })
          break
        case 1:
          state.target.sort((a, b) => {
            return a.completion - b.completion
          })
          break;
        case 2:
          state.target.sort((a, b) => {
            return b.completion - a.completion
          })
          break;
      }
    },
    toggleDeptGlobalExpand (state, id) {
      let index = state.collegeTargetExpanded.indexOf(id)
      index > -1 ? state.collegeTargetExpanded.splice(index, 1) : state.collegeTargetExpanded.push(id)
    }
  }
}
