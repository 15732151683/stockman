
/* eslint-disable */
import * as types from '../types'
import axios from '../../ajax/completion'
import {Message} from 'element-ui'

export default {
  namespaced: true,
  state: {
    target: [],
    college: {},
    collegeTree: [],
    collegeData: [],
    // 标识学院指标树 展开的节点
    collegeTargetExpanded: [],
    sortMode: 1,
    schemes: []
  },
  getters: {
    target: state => state.target,
    college: state => state.college,
    collegeTree: state => state.collegeTree,
    collegeData: state => state.collegeData,
    sortMode: state => state.sortMode,
    schemes: state => state.schemes
  },
  actions: {
    getCompletionByCollege ({commit, state}, collegeId) {
      let tree = state.collegeTree.find(item => item.id === collegeId)
      commit(types.COMPLETION_SET_COLLEGE, tree)
    },
    // 根据指标初始化学院数据，算法1
    getCompletionByTarget ({commit, state}, id) {
      let results = state.collegeTree.map(item => {
        let completion = 0
        let noLabel = true
        let data = item.data
        let target = item.target
        if (id === -1) {
          let sum = 0
          let counter = 0
          data.forEach((term, index) => {
            let cplt = term.val * 100 / target[index].val
            if (!isNaN(cplt) && cplt !== Infinity) {
              sum += cplt
              counter++
            }
          })
          if (counter > 0) {
            completion = Number((sum / counter).toFixed(0))
            noLabel = 1
          }
          return {
            type: item.type,
            name: item.name,
            id: item.id,
            abridge: item.abridge,
            spell: item.pin_yin,
            noLabel,
            completion
          }
        } else {
          let theData = data.find(item => item.indicator_id === id)
          let theTarget = target.find(item => item.indicator_id === id)
          if (theData && theTarget) {
            let cplt = theData.val * 100 / theTarget.val
            if (!isNaN(cplt) && cplt !== Infinity) {
              completion = Number((cplt).toFixed(0))
              noLabel = 1
            }
          }
          return {
            type: item.type,
            name: item.name,
            id: item.id,
            abridge: item.abridge,
            spell: item.pin_yin,
            noLabel,
            target: theTarget ? theTarget.val : '',
            real: theData ? theData.val : '',
            completion
          }
        }
      })
      commit(types.COMPLETION_SET_TARGET, results)
      commit('sortTarget')
    },
    getCollegeTree ({commit}, payload) {
      axios.getCollegeTree(({code, data}) => {
        if (code === 200) {
          data ? commit(types.COMPLETION_SET_COLLEGE_TREE, data) : commit(types.COMPLETION_SET_COLLEGE_TREE, [])
        }
      }, payload)
    },
    getScheme ({commit}) {
      axios.getScheme(({code, data}) => {
        if (code === 200) {
          if (data) {
            commit('getScheme', data)
          } else {
            commit('getScheme', [])
          }
        }
        // if (code === 200) {
        //   let arr = data.slice(0, 4)
        //   commit('getScheme', arr)
        // }
      })
    }
  },
  mutations: {
    [types.COMPLETION_SET_COLLEGE] (state, college) {
      state.college = college
    },
    [types.COMPLETION_SET_TARGET] (state, target) {
      state.target = target
    },
    [types.COMPLETION_SET_COLLEGE_TREE] (state, tree) {
      state.collegeTree = tree
    },
    getScheme (state, data) {
      state.schemes = data
    },
    setSortMode (state, mode) {
      state.sortMode = mode
    },
    sortTarget (state) {
      switch (state.sortMode) {
        case 0:
          state.target.sort((a, b) => {
            return a.spell > b.spell ? 1 : -1
          })
          break
        case 1:
          state.target.sort((a, b) => {
            return b.completion - a.completion
          })
          break;
        case 2:
          state.target.sort((a, b) => {
            return a.completion - b.completion
          })
          break;
      }
    }
  }
}
