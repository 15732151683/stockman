import axios from 'axios'

export default {
  getCollege (cb) {
    axios({
      method: 'GET',
      url: '/v1/org/',
      params: {
        status: -3
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getEvaluations (cb) {
    axios({
      method: 'GET',
      url: '/v1/eva'
    }).then(res => {
      cb(res.data)
    })
  },
  getScheme (cb) {
    axios({
      method: 'GET',
      url: '/v1/eva/list'
    }).then(res => {
      cb(res.data)
    })
  },
  evaluationSort (cb, payload) {
    const params = new URLSearchParams()
    params.append('order_list', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/eva/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteEvaluation (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/eva/' + payload.id,
      params: {
        userId: 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getEvaluationById (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/eva/' + payload
    }).then(res => {
      cb(res.data)
    })
  },
  createEvaluation (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('short_name', payload.short_name)
    params.append('remark', payload.remark)
    params.append('detail', JSON.stringify(payload.detail))
    params.append('univ_id', payload.univ_id)
    params.append('user_id', payload.user_id)
    axios({
      method: 'POST',
      url: '/v1/eva',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateEvaluation (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('scheme_id', payload.id)
    params.append('short_name', payload.short_name)
    params.append('remark', payload.remark)
    params.append('detail', JSON.stringify(payload.detail))
    params.append('order_no', payload.order_no)
    params.append('univ_id', payload.univ_id)
    params.append('user_id', payload.user_id)
    axios({
      method: 'PUT',
      url: '/v1/eva',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  swicthPublish (cb, payload) {
    axios({
      method: 'PATCH',
      url: '/v1/eva/' + payload.id
    }).then(res => {
      cb(res.data)
    })
  }
}
