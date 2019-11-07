
import axios from 'axios'

export default {
  getTagId (cb) {
    axios({
      method: 'GET',
      url: 'v1/rank/inds'
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getTop (cb) {
    const params = new URLSearchParams()
    params.append('schemeID', -1)
    axios({
      method: 'GET',
      url: '/v1/rank/top'
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getSbj0 (cb, payload) {
    const params1 = new URLSearchParams()
    params1.append('indId', payload.indId)
    params1.append('year', payload.year)
    axios({
      method: 'GET',
      url: 'v1/rank/sbj?indId=' + payload.indId + '&year=' + payload.year,
      data: params1
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getSbj (cb, payload) {
    const params1 = new URLSearchParams()
    params1.append('indId', payload.indId)
    params1.append('year', payload.year)
    axios({
      method: 'GET',
      url: 'v1/rank/sbj?indId=' + payload.indId + '&year=' + payload.year,
      data: params1
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getSbj2 (cb, payload) {
    const params1 = new URLSearchParams()
    params1.append('indId', payload.indId)
    params1.append('year', payload.year)
    axios({
      method: 'GET',
      url: 'v1/rank/sbj?indId=' + payload.indId + '&year=' + payload.year,
      data: params1
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getSbj3 (cb, payload) {
    const params1 = new URLSearchParams()
    params1.append('indId', payload.indId)
    params1.append('year', payload.year)
    axios({
      method: 'GET',
      url: 'v1/rank/sbj?indId=' + payload.indId + '&year=' + payload.year,
      data: params1
    }).then((userResp) => {
      cb(userResp)
    })
  },
  getSbjAll (cb, payload) {
    axios.all([
      axios({
        method: 'GET',
        url: 'v1/rank/sbj?indId=' + payload.indId[0] + '&year=' + payload.year,
        data: [{'indId': payload.indId[0]}, {'year': payload.year}]
      }),
      axios({
        method: 'GET',
        url: 'v1/rank/sbj?indId=' + payload.indId[1] + '&year=' + payload.year,
        data: [{'indId': payload.indId[1]}, {'year': payload.year}]
      }),
      axios({
        method: 'GET',
        url: 'v1/rank/sbj?indId=' + payload.indId[2] + '&year=' + payload.year,
        data: [{'indId': payload.indId[2]}, {'year': payload.year}]
      }),
      axios({
        method: 'GET',
        url: 'v1/rank/sbj?indId=' + payload.indId[3] + '&year=' + payload.year,
        data: [{'indId': payload.indId[3]}, {'year': payload.year}]
      })
    ]).then((userResp) => {
      cb(userResp)
    })
  },
  update (cb, payload) {
    const params1 = new URLSearchParams()
    var data = payload.map(item => item.id)
    params1.append('inds', data.join(','))
    axios({
      method: 'PUT',
      url: 'v1/rank/inds',
      data: params1
    }).then((userResp) => {
      cb(userResp.data)
    })
  }
}
