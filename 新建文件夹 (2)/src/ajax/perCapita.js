
import axios from 'axios'

export default {
  getCapita (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeID', payload.id)
    params.append('year', payload.year)
    axios({
      method: 'POST',
      url: 'v1/percapitaoutput',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
