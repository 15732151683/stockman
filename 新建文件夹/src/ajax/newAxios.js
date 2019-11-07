import axios from 'axios'
// import router from '../router'
import {Message} from 'element-ui'
// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
axios.interceptors.request.use(
  config => {
    let token = window.sessionStorage.getItem('udss_token')
    config.headers.Authorization = token
    return config
  }
)
axios.interceptors.response.use(
  config => {
    if (config.data.code === 401) {
      Message({
        message: `登录超时，请重新登录！`,
        center: true,
        type: 'error'
      })
      // router.push('/login')
      window.sessionStorage.clear()
      window.location.href = '/login'
      return Promise.reject(config.data.code)
      // Promise.reject(error)
    } else {
      return config
    }
  }
)

export default axios
