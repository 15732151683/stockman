
import axios from 'axios'

export default {
  getRoles (cb) {
    axios({
      method: 'GET',
      url: 'v1/role'
    }).then(res => {
      cb(res.data)
    })
  },
  getDataTypes (cb) {
    axios({
      method: 'GET',
      url: 'v1/comm/datatype'
    }).then(res => {
      cb(res.data)
    })
  },
  getDataType (cb) {
    axios({
      method: 'GET',
      url: 'v1/comm/datatype'
    }).then(res => {
      cb(res.data)
    })
  },
  getIndType (cb) {
    axios({
      method: 'GET',
      url: 'v1/comm/indtype'
    }).then(res => {
      cb(res.data)
    })
  },
  getIndDetail (cb, id) {
    axios({
      method: 'GET',
      url: 'v1/inddetailtype/',
      params: {
        'isValid': 1,
        'size': -1,
        'page': 0,
        'name': '',
        'simple': true,
        'taskId': id
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getUnitType (cb) {
    axios({
      method: 'GET',
      url: 'v1/comm/unittype'
    }).then(res => {
      cb(res.data)
    })
  },
  exportDataA (cb, payload) {
    axios({
      url: payload.url,
      method: 'get',
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
  exportDataB (cb, payload) {
    if (payload.type === 'query') {
      axios({
        url: payload.url,
        method: 'get',
        params: payload.params,
        responseType: 'blob'  // 二进制流
      }).then(res => {
        cb(res.data)
      })
    } else {
      axios({
        url: payload.url,
        method: 'get',
        responseType: 'blob'  // 二进制流
      }).then(res => {
        cb(res.data)
      })
    }
  }
}
