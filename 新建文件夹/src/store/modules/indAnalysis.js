
import axios from '@/ajax/indAnalysis'
const setColorIndex = function (tree) {
  tree.forEach(item => {
    item.value = item.ind_val // 必须设定value值
    item.name = item.org_name  // 设定name值，面包屑路径显示读取是name值
    let index = item.org_rank - 1
    if (index === -1) {
      item.idx = 22
      item.id = 23
    } else if (index < 23) {
      item.id = index + 1
      item.idx = index
    } else {
      item.id = 23
      item.idx = 22
    }
  })
}
const state = {
  analysisData: [],
  currentInfo: {},
  tagCheck: []
}
const getters = {
  analysisData: state => state.analysisData,
  currentInfo: state => state.currentInfo,
  tagCheck: state => state.tagCheck
}
const actions = {
  getAnalysisData ({commit}, payload) {
    axios.getAnalysisData(({code, data, message}) => {
      if (code === 200) {
        let arr = data.vals
        arr.sort((a, b) => {
          return a.org_rank - b.org_rank
        })
        setColorIndex(arr)
        let info = {
          name: data.ind_name,
          teacher_year: data.teacherYear,
          unit: data.unit,
          year: data.year,
          decimal: data.decimal,
          is_ratio: data.is_ratio,
          is_percent: data.is_percent
        }
        commit('setInfo', info)
        commit('getAnalysisData', arr)
        commit('setTagCheck', arr)
      }
    }, payload)
  }
}
const mutations = {
  getAnalysisData (state, data) {
    state.analysisData = data
  },
  setAnalysisData (state, data) {
    state.analysisData = data
  },
  setInfo (state, data) {
    state.currentInfo = data
  },
  setTagCheck (state, data) {
    state.tagCheck = data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
