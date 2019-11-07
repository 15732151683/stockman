
import axios from 'axios'

export default {
  getRealDept (cb) {
    axios({
      method: 'GET',
      url: 'v1/dept',
      params: {
        status: -1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getCollege (cb) {
    axios({
      method: 'GET',
      url: 'v1/org/?status=-4'
    }).then(res => {
      cb(res.data)
    })
  },
  getUsers (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/user',
      params: {
        page: payload.pageIndex,
        limit: payload.pageSize,
        keyword: payload.keyword
      }
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    const params = new URLSearchParams()
    params.append('login_name', payload.username)
    params.append('user_name', payload.name)
    params.append('password', payload.password)
    params.append('role_id', payload.role_id)
    params.append('dept_id', payload.dept_id)
    params.append('email', payload.email)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/user',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  update (cb, payload) {
    const params = new URLSearchParams()
    params.append('update_user_id', payload.id)
    params.append('login_name', payload.username)
    params.append('user_name', payload.name)
    params.append('password', payload.password)
    params.append('role_id', payload.role_id)
    params.append('dept_id', payload.dept_id)
    params.append('email', payload.email)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/user',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  delete (cb, id) {
    axios({
      method: 'DELETE',
      url: '/v1/user/' + id,
      params: {
        'userId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  resetPass (cb, id) {
    axios({
      method: 'PATCH',
      url: '/v1/user/' + id + '/pswreset'
    }).then(res => {
      cb(res.data)
    })
  }
}
