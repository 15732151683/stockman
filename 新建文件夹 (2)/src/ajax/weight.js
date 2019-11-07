import axios from 'axios'

export default {
  getAllWeight (cb) {
    axios({
      method: 'GET',
      url: '/v1/ws'
    }).then(res => {
      cb(res.data)
    })
  },
  getNowWeight (cb, id) {
    axios({
      method: 'GET',
      url: '/v1/ws/' + id
    }).then(res => {
      cb(res.data)
    })
  },
  createWeight (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.weightName)
    params.append('indIdAndWeight', JSON.stringify(payload.indicators))
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/ws',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateWeight (cb, payload) {
    const params = new URLSearchParams()
    params.append('weightId', payload.weightId)
    params.append('name', payload.weightName)
    params.append('indIdAndWeight', JSON.stringify(payload.indicators))
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/ws',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deletWeight (cb, id) {
    axios({
      method: 'DELETE',
      url: '/v1/ws/' + id,
      params: {
        'userId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  weightSwicth (cb, id) {
    axios({
      method: 'PATCH',
      url: '/v1/ws/' + id
    }).then(res => {
      cb(res.data)
    })
  },
  updateOrder (cb, payload) {
    const params = new URLSearchParams()
    params.append('weights', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/ws/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
