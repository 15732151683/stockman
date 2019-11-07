import axios from './newAxios'

export default {
  checkLogin (cb, payload) {
    axios({
      method: 'POST',
      url: '/v1/login/',
      params: {
        login_name: payload.username,
        password: payload.password
      }
    }).then(res => {
      cb(res.data)
    })
  },
  updatePwd (cb, payload) {
    const params = new URLSearchParams()
    params.append('oldPsw', payload.oldPass)
    params.append('newPsw', payload.newPass)
    axios({
      method: 'PATCH',
      url: '/v1/user/0/psw',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
