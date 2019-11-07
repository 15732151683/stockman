
import axios from 'axios'

export default {
  getIndDetail (cb, payload) {
    const params = new URLSearchParams()
    params.append('search', payload.search)
    params.append('page', payload.page)
    params.append('size', payload.size)
    axios({
      method: 'GET',
      url: 'v1/inddetailtype/?search=' + payload.search + '&page=' + payload.page + '&size=' + payload.size,
      data: payload
    }).then(res => {
      cb(res.data)
    })
  },
  postIndDetail (cb, payload) {
    const params = new URLSearchParams()
    params.append('id', payload.id)
    params.append('name', payload.name)
    params.append('remark', payload.remark)
    params.append('fields', payload.fields)
    axios({
      method: 'POST',
      url: 'v1/inddetailtype/',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteIndDetail (cb, payload) {
    axios({
      method: 'DELETE',
      url: 'v1/inddetailtype/' + payload,
      data: payload
    }).then(res => {
      cb(res.data)
    })
  },
  deleteInddetailtype (cb, payload) {
    axios({
      method: 'DELETE',
      url: 'v1/inddetailtype/' + payload.typeId + '/fields/' + payload.id,
      data: payload
    }).then(res => {
      cb(res.data)
    })
  },
  activatedState (cb, payload) {
    const params = new URLSearchParams()
    params.append('id', payload.id)
    params.append('isValid', payload.isValid)
    axios({
      method: 'PATCH',
      url: 'v1/inddetailtype/' + payload.id,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  fieldType (cb) {
    axios({
      method: 'GET',
      url: 'v1/inddetailtype/dicts'
    }).then(res => {
      cb(res.data)
    })
  }
}
