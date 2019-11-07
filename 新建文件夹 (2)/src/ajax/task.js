import axios from 'axios'

export default {
  getDept (cb) {
    axios({
      method: 'GET',
      url: 'v1/dept'
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
  getTaskNode (cb) {
    axios({
      method: 'GET',
      url: '/v1/tasknode'
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
    params.append('endDate', payload.deadline)
    params.append('yearRange', payload.year_range)
    params.append('indIds', payload.ind_ids)
    params.append('deptId', payload.dept_id)
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
    params.append('endDate', payload.deadline)
    params.append('yearRange', payload.year_range)
    params.append('indIds', payload.ind_ids)
    params.append('deptId', payload.dept_id)
    params.append('remark', payload.remark)
    axios({
      method: 'PUT',
      url: '/v1/task/' + payload.id,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  publishTask (cb, id) {
    axios({
      method: 'PATCH',
      url: '/v1/task/' + id
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
      url: '/v1/task/' + id + '/status'
    }).then(res => {
      cb(res.data)
    })
  }
}
