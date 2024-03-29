
import axios from 'axios'

export default {
  getAnalysisData (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/ind/' + payload.id + '/data',
      params: {
        year: payload.year
      }
    }).then(res => {
      cb(res.data)
    })
  }
}
