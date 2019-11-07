import axios from 'axios'

export default {
  getDeptUser (cb) {
    axios({
      method: 'GET',
      url: '/v1/user',
      params: {
        page: 1,
        limit: 100,
        keyword: ''
      }
    }).then(res => {
      cb(res.data)
    })
  },
  passTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('remark', payload.remark ? payload.remark : '')
    params.append('revoke', payload.revoke)
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/deptAccept/' + payload.subId,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  rejectTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('indDataIdMap', JSON.stringify(payload.ind_ids))
    params.append('subId', payload.subId)
    params.append('move', payload.move)
    params.append('remark', payload.remark ? payload.remark : '')
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/reject',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  checkPass (cb, payload) {
    const params = new URLSearchParams()
    params.append('mergeMode', payload.mode)
    params.append('nextNode', payload.nodeId)
    params.append('remark', payload.remark ? payload.remark : '')
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/checkPass',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  orgCheckPass (cb, payload) {
    const params = new URLSearchParams()
    params.append('remark', payload.remark ? payload.remark : '')
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/orgAccept',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
