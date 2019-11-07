/**
 * Created by lonelydawn on 2017-11-20.
 */

import output from '../../ajax/output'
import * as types from '../types'

export default {
  namespaced: true,
  state: {
    treeScore: []
  },
  getters: {
    treeScore: state => {
      let tree = JSON.parse(JSON.stringify(state.treeScore))
      tree.forEach(item => {
        item.value[0] = (item.value[0] / 1000).toFixed(2)
        item.details.forEach(term => {
          term.value = (term.value / 1000).toFixed(2)
        })
      })
      return tree
    }
  },
  actions: {
    getTreeScore ({commit}) {
      output.getTreeScore((treeScore) => {
        commit(types.OUTPUT_SET_TREE_SCORE, {treeScore})
      })
    }
  },
  mutations: {
    [types.OUTPUT_SET_TREE_SCORE] (state, {treeScore}) {
      state.treeScore = treeScore
    }
  }
}
