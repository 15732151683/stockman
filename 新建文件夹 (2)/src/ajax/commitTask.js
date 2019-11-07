import axios from 'axios'

export default {
  // getDept (cb) {
  //   axios({
  //     method: 'GET',
  //     url: 'v1/dept'
  //   }).then(res => {
  //     cb(res.data)
  //   })
  // },
  getSubTaskError (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/task/' + payload.id + '/rejectedIndData',
      params: {
        subId: payload.subId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  commitTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('remark', payload.remark ? payload.remark : '')
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/commit/' + payload.subId,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getTaskLog (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/task/' + payload.id + '/remarks',
      params: {
        subId: payload.subId
      }
    }).then(res => {
      cb(res.data)
    })
  }
}
