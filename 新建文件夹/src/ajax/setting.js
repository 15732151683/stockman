
import axios from 'axios'

export default {
  getScheme (cb) {
    axios({
      method: 'GET',
      url: '/v1/ts'
    }).then(res => {
      cb(res.data)
    })
  },
  createScheme (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.schemeName)
    params.append('indDataTarget', JSON.stringify(payload.indData))
    params.append('remark', payload.remark)
    params.append('short_name', payload.short_name)
    axios({
      method: 'POST',
      url: '/v1/ts',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  createBaseScheme (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.schemeName)
    params.append('remark', payload.remark)
    params.append('short_name', payload.short_name)
    axios({
      method: 'POST',
      url: '/v1/ts/basic',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  createSchemeByInd (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.schemeName)
    params.append('orgData', JSON.stringify(payload.orgData))
    params.append('short_name', payload.short_name)
    params.append('remark', payload.remark)
    params.append('indId', payload.indId)
    axios({
      method: 'POST',
      url: '/v1/ts/byind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateScheme (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeId', payload.schemeId)
    params.append('name', payload.schemeName)
    params.append('indDataTarget', JSON.stringify(payload.indData))
    params.append('short_name', payload.short_name)
    params.append('orgId', payload.orgId)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/ts',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateBaseScheme (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeId', payload.schemeId)
    params.append('name', payload.schemeName)
    params.append('short_name', payload.short_name)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/ts/basic',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateSchemeByInd (cb, payload) {
    const params = new URLSearchParams()
    params.append('schemeId', payload.schemeId)
    params.append('name', payload.schemeName)
    params.append('short_name', payload.short_name)
    params.append('orgData', JSON.stringify(payload.orgData))
    params.append('indId', JSON.stringify(payload.indId))
    params.append('isDefault', payload.is_default)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/ts/byind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteScheme (cb, id) {
    axios({
      method: 'DELETE',
      url: '/v1/ts/' + id
    }).then(res => {
      cb(res.data)
    })
  },
  schemeSort (cb, payload) {
    const params = new URLSearchParams()
    params.append('order_list', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/ts/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getSchemeData (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/ts/' + payload.schemeId + '/detail/' + payload.orgId,
      params: {
        year: payload.year
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getSchemeDataByInd (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/ts/' + payload.schemeId + '/ind/' + payload.indId + '/year/' + payload.year
    }).then(res => {
      cb(res.data)
    })
  },
  swicthPublish (cb, payload) {
    axios({
      method: 'PATCH',
      url: '/v1/ts/' + payload.id
    }).then(res => {
      cb(res.data)
    })
  },
  importData (cb, payload) {
    const params = new FormData()
    params.append('uploadName', payload.file)
    // console.log(payload)
    axios({
      url: '/v1/ts/exp',
      method: 'POST',
      data: params,
      headers: {'Content-Type': 'multipart/form-data'},
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
  exportData (cb, payload) {
    axios({
      url: '/v1/ts/exp?id=' + payload.id,
      method: 'get',
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  }
}
