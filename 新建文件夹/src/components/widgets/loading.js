import axios from 'axios'
import { Loading } from 'element-ui'
// import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
let loading
let countReq = 0
let countRuq = 0
function startLoading (dom) {    // 使用Element loading-start 方法
  loading = Loading.service({
    spinner: '',
    target: dom,
    // text: 'loading',
    background: 'rgba(255, 255, 255, 0)'
  })
}

function endLoading () {    // 使用Element loading-close 方法
  loading.close()
}

export default {
  addInterceptors (dom) {
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      // console.log('请求开始')
      // config.headers.Authorization = 'testTokenSAdkasdj56623'
      countReq++
      if (countReq === 1) {
        startLoading(dom)
        // nProgress.start()
      }
      return config
    }, function (error) {
      // Do something with request error
      // console.log('请求失败')
      return Promise.reject(error)
    })
    axios.interceptors.response.use(function (config) {
      // console.log('请求结束')
      countRuq++
      if (countRuq === countReq) {
        // setTimeout(() => endLoading(), 1000)
        endLoading()
        // nProgress.done()
        countReq = 0
        countRuq = 0
      }
      return config
    }, function (error) {
      // Do something with request error
      // console.log('响应出错')
      endLoading()
      // nProgress.done()
      return Promise.reject(error)
    })
  }
}
