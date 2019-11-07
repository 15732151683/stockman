import axios from './newAxios'

export default {
  getTargets (cb) {
    axios({
      method: 'GET',
      url: '/v1/ind'
    }).then(res => {
      cb(res.data)
    })
  },
  getDeduptrules (cb) {
    axios({
      method: 'GET',
      url: '/v1/deduptrule/'
    }).then(res => {
      cb(res.data)
    })
  },
  getDedupDetail (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/deduptrule/' + payload
    }).then(res => {
      cb(res.data)
    })
  },
  creatDeduptrule (cb, payload) {
    let detail = payload.dedupeRuleDetails.map((item, idx) => {
      return {
        'ind_id': item.id,
        'ind_priority': idx + 1
      }
    })
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('detail', JSON.stringify(detail))
    axios({
      method: 'POST',
      url: '/v1/deduptrule/',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateDeduptrule (cb, payload) {
    let detail = payload.dedupeRuleDetails.map((item, idx) => {
      return {
        'ind_id': item.id,
        'ind_priority': idx + 1
      }
    })
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('detail', JSON.stringify(detail))
    axios({
      method: 'PUT',
      url: '/v1/deduptrule/' + payload.id,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteDeduptrule (cb, payload) {
    axios({
      method: 'DELETE',
      url: 'v1/deduptrule/' + payload
    }).then(res => {
      cb(res.data)
    })
  },
  updateDeduptruleSort (cb, payload) {
    const params = new URLSearchParams()
    params.append('orderData', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: 'v1/deduptrule/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
