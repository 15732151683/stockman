import axios from '@/ajax/trendAnalysis'
const state = {
  trend: [],
  trendName: '',
  getInfo: ''
}
const getters = {
  trend: state => state.trend,
  trendName: state => state.trendName,
  getInfo: state => state.getInfo
}
const actions = {
  getTrend ({commit}, {payload, resolve, reject}) {
    axios.trend(({code, data}) => {
      code === 200 && commit('getTrend', data)
      code === 200 ? resolve(data) : reject()
    }, payload)
  }
}
const mutations = {
  getTrend (state, data) {
    state.trend = data.trend_data ? data.trend_data : []
    state.trendName = data.unit === '无' ? data.ind_name : data.ind_name + ' (' + data.unit + ')'
    state.getInfo = {is_ratio: data.is_ratio, decimal: data.decimal}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
