import axios from 'axios'

export default {
  getCollegeTree (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeID', payload.id)
    params.append('year', payload.year)
    axios({
      method: 'POST',
      url: '/v1/completion',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getScheme (cb) {
    axios({
      method: 'GET',
      url: '/v1/ts/list'
    }).then(res => {
      cb(res.data)
    })
  }
}
