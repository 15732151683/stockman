import axios from 'axios'

export default {
  getCollege (cb) {
    axios({
      method: 'GET',
      url: '/v1/org'
    }).then(res => {
      cb(res.data)
    })
  },
  getConvert (cb) {
    axios({
      method: 'GET',
      url: '/v1/convert'
    }).then(res => {
      cb(res.data)
    })
  },
  updateConvert (cb, payload) {
    const params = new URLSearchParams()
    params.append('val', payload.convert_param)
    params.append('id', payload.indicator_id)
    axios({
      method: 'PUT',
      url: '/v1/convert',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getAllData (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeId', payload.id)
    params.append('inds', JSON.stringify(payload.inds))
    axios({
      method: 'post',
      url: '/v1/ior',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
