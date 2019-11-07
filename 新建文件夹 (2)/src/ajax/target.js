
import axios from 'axios'

export default {
  getTargets (cb) {
    axios({
      method: 'GET',
      url: '/v1/ind'
    }).then(res => {
      cb(res.data)
    })
  },
  create (cb, payload) {
    const params = new URLSearchParams()
    params.append('pid', payload.pid)
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('indTypeId', payload.ind_type_id)
    params.append('unitId', payload.unit.id)
    params.append('dataTypeId', payload.data_type_id)
    params.append('tagIds', JSON.stringify(payload.tagIds))
    params.append('orderNo', payload.order_no)
    params.append('isLeaf', payload.is_leaf)
    params.append('hasDetail', payload.has_detail)
    params.append('detailTemplateId', payload.detail_template_id)
    params.append('formula', payload.formula)
    params.append('formulaInd', payload.formula_ind)
    params.append('decimals', payload.decimals)
    params.append('isCalc', payload.is_calc)
    params.append('opUserId', 1)
    axios({
      method: 'POST',
      url: '/v1/ind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  update (cb, payload) {
    const params = new URLSearchParams()
    params.append('indId', payload.id)
    params.append('pid', payload.pid)
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('indTypeId', payload.ind_type_id)
    params.append('unitId', payload.unit.id)
    params.append('dataTypeId', payload.data_type_id)
    params.append('tagIds', JSON.stringify(payload.tagIds))
    params.append('orderNo', payload.order_no)
    params.append('isLeaf', payload.is_leaf)
    params.append('hasDetail', payload.has_detail)
    params.append('detailTemplateId', payload.detail_template_id)
    params.append('formula', payload.formula)
    params.append('formulaInd', payload.formula_ind)
    params.append('decimals', payload.decimals)
    params.append('isCalc', payload.is_calc)
    params.append('opUserId', 1)
    axios({
      method: 'PUT',
      url: '/v1/ind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  delete (cb, payload) {
    axios({
      method: 'DELETE',
      url: '/v1/ind/' + payload.id,
      params: {
        'userId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  changeOrder (cb, payload) {
    const params = new URLSearchParams()
    params.append('inds', JSON.stringify(payload))
    axios({
      method: 'PUT',
      url: '/v1/ind/order',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getTagTypes (cb) {
    axios({
      method: 'GET',
      url: '/v1/tagtype'
    }).then(res => {
      cb(res.data)
    })
  },
  getTags (cb) {
    axios({
      method: 'GET',
      url: '/v1/tag',
      params: {
        'tagTypeId': 1
      }
    }).then(res => {
      cb(res.data)
    })
  },
  createTag (cb, payload) {
    const params = new URLSearchParams()
    params.append('user_id', 1)
    params.append('name', payload.name)
    params.append('tag_type_id', 1)
    params.append('opUserId', 1)
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
    params.append('tag_type_id', 1)
    params.append('name', payload.name)
    params.append('opUserId', 1)
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
  getDetailStatus (cb, id) {
    axios({
      method: 'GET',
      url: '/v1/ind/' + id + '/isdetail'
    }).then(res => {
      cb(res.data)
    })
  }
}
