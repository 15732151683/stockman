import axios from 'axios'
export default {
  trend (cb, payload) {
    const params = new URLSearchParams()
    params.append('indicatorId', payload.ID)
    params.append('startYear', payload.startYear)
    params.append('endYear', payload.endYear)
    axios({
      method: 'POST',
      url: '/v1/trend',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
