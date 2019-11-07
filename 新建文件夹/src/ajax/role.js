
import axios from 'axios'

export default {
  getRoleTree (cb) {
    axios({
      method: 'GET',
      url: '/v1/permission/items'
    }).then(res => {
      cb(res.data)
    })
  },
  getRoleList (cb) {
    axios({
      method: 'GET',
      url: '/v1/role/pms'
    }).then(res => {
      cb(res.data)
    })
  },
  getRoleDetail (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/role/' + payload + '/pms'
    }).then(res => {
      cb(res.data)
    })
  },
  createRole (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('permission', JSON.stringify(payload.permission))
    params.append('remark', '')
    axios({
      method: 'POST',
      url: '/v1/role',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateRole (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('permission', JSON.stringify(payload.permission))
    axios({
      method: 'PUT',
      url: '/v1/role/' + payload.id + '/pms',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteRole (cb, id) {
    axios({
      method: 'DELETE',
      url: '/v1/role/' + id
    }).then(res => {
      cb(res.data)
    })
  }
}
