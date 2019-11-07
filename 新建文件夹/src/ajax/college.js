
import axios from 'axios'

export default {
  getCollege (cb) {
    axios({
      method: 'GET',
      url: 'v1/org/?status=-3'
    }).then(res => {
      cb(res.data)
    })
  },
  getTypeA (cb) {
    axios({
      method: 'GET',
      url: 'v1/orgtype/a'
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    const params = new URLSearchParams()
    params.append('orgPid', payload.pid)
    params.append('orgTypeAId', payload.typeA_id)
    params.append('orgTypeBId', payload.typeB_id)
    params.append('name', payload.name)
    params.append('shortNameCn', payload.short_name_cn)
    params.append('nameEn', payload.name_en)
    params.append('shortNameEn', payload.short_name_en)
    params.append('website', payload.website)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/org',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updates (cb, payload) {
    const params = new URLSearchParams()
    params.append('orgId', payload.id)
    params.append('orgPid', payload.pid)
    params.append('orgTypeAId', payload.typeA_id)
    params.append('orgTypeBId', payload.typeB_id)
    params.append('name', payload.name)
    params.append('shortNameCn', payload.short_name_cn)
    params.append('nameEn', payload.name_en)
    params.append('shortNameEn', payload.short_name_en)
    params.append('website', payload.website)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/org',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  delete (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/org/' + payload.id,
      params: {
        userId: 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  collegeAddTag (cb, payload) {
    const params = new URLSearchParams()
    params.append('orgTag', JSON.stringify(payload.data))
    axios({
      method: 'POST',
      url: '/v1/org/tag',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  collegeSort (cb, payload) {
    const params = new URLSearchParams()
    params.append('orgs', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/org/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getTags (cb) {
    axios({
      method: 'GET',
      url: '/v1/tag',
      params: {
        'tagTypeId': 2
      }
    }).then(res => {
      cb(res.data)
    })
  },
  createTag (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('tag_type_id', 2)
    axios({
      method: 'POST',
      url: '/v1/tag',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  editTag (cb, payload) {
    const params = new URLSearchParams()
    params.append('tag_id', payload.id)
    params.append('tag_type_id', 2)
    params.append('name', payload.name)
    // params.append('opUserId', 1)
    axios({
      method: 'PUT',
      url: '/v1/tag',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteTag (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/tag/' + payload.id,
      params: {
        'userId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getTypeB (cb) {
    axios({
      method: 'GET',
      url: 'v1/orgtype/b'
    }).then(res => {
      cb(res.data)
    })
  },
  createTypeB (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    axios({
      method: 'POST',
      url: '/v1/orgtype/b',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  editTypeB (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    axios({
      method: 'PUT',
      url: '/v1/orgtype/b/' + payload.id,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteTypeB (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/orgtype/b/' + payload.id
    }).then(res => {
      cb(res.data)
    })
  },
  changeTypeB (cb, payload) {
    const params = new URLSearchParams()
    params.append('orderData', payload)
    axios({
      method: 'PUT',
      url: '/v1/orgtype/b/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  }
}
