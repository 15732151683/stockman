import CryptoJS from 'crypto-js'
import { Message } from 'element-ui'
import axios from '@/ajax/login'
// 设置cookie
const setCookie = function (name, val, exdays) {
  let exdate = new Date() // 获取时间
  exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays) // 保存的天数
  if (name === 'udss_key') {
    // 对密码Encrypt加密
    let secretPass = CryptoJS.AES.encrypt(val, 'secretkey@655622').toString()
    window.document.cookie = name + '=' + secretPass + ';path=/;expires=' + exdate.toGMTString()
  } else {
    // 字符串拼接cookie
    window.document.cookie = name + '=' + val + ';path=/;expires=' + exdate.toGMTString()
  }
}

// 读取cookie
const getCookie = function (name) {
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  let arr = document.cookie.match(reg)
  if (arr) {
    if (name === 'udss_key') {
      // 对密码进行Decrypt 解密
      let bytes = CryptoJS.AES.decrypt(arr[2], 'secretkey@655622')
      let pass = bytes.toString(CryptoJS.enc.Utf8)
      return pass
    } else {
      return arr[2]
    }
  } else {
    return false
  }
}
// 删除cookie
const deleteCookie = function (name) {
  setCookie(name, '', -1)
}

const mergeMenu = function (tree) {
  let arr = []
  tree.forEach(node => {
    let obj = {
      id: node.id,
      title: node.name,
      path: node.url,
      icon: node.icon
    }
    obj.children = node.children ? mergeMenu(node.children) : null
    arr.push(obj)
  })
  return arr
}
const mergeRoute = function (tree) {
  let arr = []
  tree.forEach(node => {
    if (node.is_router === 1) {
      let obj = {
        path: node.url,
        name: node.component,
        meta: {
          permissionList: node.permissions,
          title: node.name
        }
      }
      arr.push(obj)
    }
    if (node.children) {
      arr.push(...mergeRoute(node.children))
    }
  })
  return arr
}

const state = {
  username: '',
  password: '',
  loginInfo: []
}
const getters = {
  username: state => state.username,
  password: state => state.password,
  loginInfo: state => state.loginInfo
}
const actions = {
  checkLogin ({state, commit}, {resolve, reject, payload}) {
    axios.checkLogin(({code, data, message}) => {
      if (code === 200) {
        if (payload.save) {
          let save = getCookie('udss_name')
          if (!save) {
            setCookie('udss_name', payload.username, 7)
            setCookie('udss_key', payload.password, 7)
          }
        } else {
          deleteCookie('udss_name')
          deleteCookie('udss_key')
        }
        data.univ.role = data.role
        data.univ.org = data.org
        window.sessionStorage.setItem('udss_token', data.token)
        let menuList = mergeMenu(data.permission_items)
        let routeList = mergeRoute(data.permission_items)
        window.sessionStorage.setItem('menuList', JSON.stringify(menuList))
        window.sessionStorage.setItem('routeList', JSON.stringify(routeList))
        window.sessionStorage.setItem('udssInfo', JSON.stringify(data.univ))
        window.sessionStorage.setItem('user_name', JSON.stringify(data.user_name))
        resolve()
      } else {
        Message({
          message: `${message}`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  updatePwd ({commit}, {payload, router}) {
    axios.updatePwd(({code, data, message}) => {
      if (code === 200) {
        console.log('密码修改成功')
        deleteCookie('udss_name')
        deleteCookie('udss_key')
        window.sessionStorage.clear()
        router.push('/login')
      } else {
        Message({
          message: `${message}`,
          type: 'error'
        })
      }
    }, payload)
  },
  getLoginCookie ({commit}) {
    if (window.document.cookie.length > 0) {
      window.sessionStorage.clear()
      let param1 = getCookie('udss_name')
      let param2 = getCookie('udss_key')
      commit('setLoginInfo', [param1, param2])
    } else {
      commit('setLoginInfo', [])
    }
  }
  // checkCookie ({state, commit}) {
  //   let data = window.sessionStorage.getItem('udss_token')
  //   if (data) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }
}
const mutations = {
  setUser (state, payload) {
    state.username = payload
  },
  setLoginInfo (state, payload) {
    state.loginInfo = payload
  },
  handleQuit (state, router) {
    window.sessionStorage.clear()
    // router.push('/login')
    window.location.href = '/login'
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
