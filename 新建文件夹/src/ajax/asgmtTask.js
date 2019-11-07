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
  getTaskDetail (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/task/' + payload + '/sub'
    }).then(res => {
      cb(res.data)
    })
  },
  updateTaskDetail (cb, payload) {
    const params = new URLSearchParams()
    params.append('subTasks', JSON.stringify(payload.subTasks))
    params.append('dispatch', payload.dispatch)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/assign',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  publishTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('subTasks', JSON.stringify(payload.subTasks))
    params.append('dispatch', payload.dispatch)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/task/' + payload.id + '/assign',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
