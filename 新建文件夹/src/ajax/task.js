import axios from 'axios'

export default {
  getTypeA (cb) {
    axios({
      method: 'GET',
      url: 'v1/orgtype/a'
    }).then(res => {
      cb(res.data)
    })
  },
  getSchools (cb) {
    axios({
      method: 'GET',
      url: 'v1/org/?status=-3'
    }).then(res => {
      cb(res.data)
    })
  },
  getTarget (cb) {
    axios({
      method: 'GET',
      url: '/v1/ind'
    }).then(res => {
      cb(res.data)
    })
  },
  getTask (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/task',
      params: {
        timeId: payload.timeId,
        name: payload.name,
        years: payload.years,
        deptIds: payload.deptIds,
        createdAt: payload.createdAt,
        publishedAt: payload.publishedAt,
        deadline: payload.deadline,
        indIds: payload.indIds,
        nodeIds: payload.nodeId,
        advance: payload.advance,
        page: payload.page,
        size: payload.size,
        check: payload.check,
        terminated: payload.terminated
      }
    }).then(res => {
      cb(res.data)
    })
  },
  createTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('orgTypeAId', payload.typeAId)
    params.append('yearRange', payload.yearRange)
    params.append('indIds', payload.indIds)
    params.append('orgIds', payload.orgIds)
    params.append('deadline', payload.deadline)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/task',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  updateTask (cb, payload) {
    const params = new URLSearchParams()
    params.append('name', payload.name)
    params.append('id', payload.id)
    params.append('orgTypeAId', payload.typeAId)
    params.append('yearRange', payload.yearRange)
    params.append('indIds', payload.indIds)
    params.append('orgIds', payload.orgIds)
    params.append('deadline', payload.deadline)
    params.append('remark', payload.remark)
    axios({
      method: 'POST',
      url: '/v1/task',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  publishTask (cb, id) {
    axios({
      method: 'PATCH',
      url: '/v1/task/' + id + '/pub'
    }).then(res => {
      cb(res.data)
    })
  },
  deleteTask (cb, id) {
    axios({
      method: 'DELETE',
      url: '/v1/task/' + id
    }).then(res => {
      cb(res.data)
    })
  },
  endTask (cb, id) {
    axios({
      method: 'PATCH',
      url: '/v1/task/' + id + '/kill'
    }).then(res => {
      cb(res.data)
    })
  }
}
