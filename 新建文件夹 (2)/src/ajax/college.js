
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
  getCollege2 (cb) {
    axios({
      method: 'GET',
      url: 'v1/org/?status=-1'
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    let orgIds = ''
    if (payload.org_ids !== '') {
      orgIds = payload.org_ids.join(',')
    } else {
      orgIds = ''
    }
    const params = new URLSearchParams()
    params.append('user_id', 1)
    params.append('pid', payload.pid)
    params.append('org_type_id', payload.org_type_id)
    params.append('org_ids', orgIds)
    params.append('name', payload.name)
    params.append('short_name_cn', payload.short_name_cn)
    params.append('name_en', payload.name_en)
    params.append('short_name_en', payload.short_name_en)
    params.append('website', payload.website)
    params.append('orderby', payload.order_by)
    params.append('remark', payload.remark)
    params.append('is_leaf', payload.is_leaf)
    params.append('is_count', payload.make_part)
    axios({
      method: 'POST',
      url: '/v1/org',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updates (cb, payload) {
    let orgIds = payload.org_ids.toString()
    const params = new URLSearchParams()
    params.append('org_id', payload.id)
    params.append('pid', payload.pid)
    params.append('org_ids', orgIds)
    params.append('name', payload.name)
    params.append('short_name_cn', payload.short_name_cn)
    params.append('name_en', payload.name_en)
    params.append('short_name_en', payload.short_name_en)
    params.append('website', payload.website)
    params.append('orderby', payload.order_by)
    params.append('remark', payload.remark)
    params.append('is_leaf', payload.is_leaf)
    params.append('user_id', 1)
    params.append('is_count', payload.make_part)
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
    params.append('user_id', 1)
    params.append('name', payload.name)
    params.append('tag_type_id', 2)
    // params.append('opUserId', 1)
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
    params.append('user_id', 1)
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
  getName (cb) {
    axios({
      method: 'GET',
      url: 'v1/orgtype'
    }).then(res => {
      cb(res.data)
    })
  }
}
