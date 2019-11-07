import axios from 'axios'

export default {
  getDept (cb) {
    axios({
      method: 'GET',
      url: 'v1/dept'
    }).then(res => {
      cb(res.data)
    })
  },
  deptSort (cb, payload) {
    const params = new URLSearchParams()
    params.append('orderData', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/dept/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('shortName', payload.short_name)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/dept',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  update (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('shortName', payload.short_name)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/dept/' + payload.id,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  delete (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/dept/' + payload.id
    }).then(res => {
      cb(res.data)
    })
  }
}
