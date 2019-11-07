import axios from 'axios'

export default {
  getPerformance (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeID', payload)
    axios({
      method: 'POST',
      url: '/v1/composite',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getScheme (cb) {
    axios({
      method: 'GET',
      url: '/v1/ws/dispaly'
    }).then(res => {
      cb(res.data)
    })
  },
  getCollege (cb) {
    axios({
      method: 'GET',
      url: '/v1/org'
    }).then(res => {
      cb(res.data)
    })
  }
}
