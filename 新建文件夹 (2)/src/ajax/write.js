
import axios from 'axios'
export default {
  getOrg (cb) {
    axios({
      method: 'GET',
      url: 'v1/org/',
      params: {
        status: -1
      }
    }).then(res => {
      cb(res.data)
    })
  },
// 新接口api
  getDataByCollege (cb, payload) {
    axios({
      method: 'GET',
      url: 'v1/org/' + payload.orgId + '/inddata',
      params: {
        'yearRange': payload.yearRange,
        'taskId': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  updateDataByCollege (cb, payload) {
    const params = new URLSearchParams()
    params.append('indDatas', JSON.stringify(payload.indDatas))
    params.append('orgId', payload.orgId)
    axios({
      method: 'POST',
      url: '/v1/inddata/org',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  getDataByInd (cb, payload) {
    axios({
      method: 'GET',
      url: 'v1/ind/' + payload.id,
      params: {
        'yearRange': payload.yearRange,
        'taskId': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  updateDataByInd (cb, payload) {
    const params = new URLSearchParams()
    params.append('orgDatas', JSON.stringify(payload.orgDatas))
    params.append('indId', payload.indId)
    params.append('taskId', payload.taskId)
    axios({
      method: 'POST',
      url: '/v1/inddata/ind',
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
//  指标详情新接口
  getAllDetail (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/inddatas/' + payload.id + '/inddetail',
      params: {
        'page': payload.page - 1,
        'size': payload.limit,
        'search': payload.keyword,
        'detailTypeId': payload.type_id,
        'taskId': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getAllYearDetail (cb, payload) {
    axios({
      method: 'GET',
      url: '/v1/inddatas/inddetail',
      params: {
        'indId': payload.indId,
        'year': payload.year,
        'page': payload.page - 1,
        'size': payload.limit,
        'search': payload.keyword,
        'taskId': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  getDetailTemplate (cb, payload) {
    axios({
      method: 'GET',
      url: 'v1/inddetailtype/' + payload
    }).then(res => {
      cb(res.data)
    })
  },
  updateIndDetail (cb, payload) {
    const params = new URLSearchParams()
    let cloneData = JSON.parse(JSON.stringify(payload.detailData))
    delete cloneData.org_ids
    params.append('indDetailData', JSON.stringify(cloneData))
    params.append('weights', JSON.stringify(payload.weights))
    params.append('detailTypeId', payload.typeId)
    params.append('taskId', payload.taskId)
    let url = '/v1/inddatas/' + payload.indId + '/inddetail'
    axios({
      method: 'POST',
      url: url,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  deleteDetail (cb, payload) {
    const params = new URLSearchParams()
    params.append('taskId', payload.taskId)
    axios({
      method: 'Delete',
      url: '/v1/inddatas/' + payload.indId + '/inddetail/' + payload.detailId,
      params: {
        'taskId': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  changeDetail (cb, payload) {
    const params = new URLSearchParams()
    params.append('year', payload.year)
    params.append('taskId', payload.taskId)
    let url = '/v1/inddatas/' + payload.ind_data_id + '/inddetail/' + payload.id
    axios({
      method: 'PATCH',
      url: url,
      data: params
    }).then(res => {
      cb(res.data)
    })
  },
  // 导出和导入明细模板
  exportModule (cb, payload) {
    axios({
      url: '/v1/inddatas/exptpl/',
      method: 'get',
      params: {
        'ind_detail_type_id': payload.id,
        'task_id': payload.taskId
      },
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
  importData (cb, payload) {
    const params = new FormData()
    params.append('uploadName', payload.file)
    params.append('isEnterIndData', payload.status)
    params.append('taskId', payload.taskId)
    axios({
      url: '/v1/inddatas/exp',
      method: 'POST',
      data: params,
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
  // 导出和导入指标数据
  exportIndData (cb, payload) {
    axios({
      url: '/v1/inddata/exp',
      method: 'get',
      params: {
        'task_id': payload.taskId
      },
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
  importIndData (cb, payload) {
    const params = new FormData()
    params.append('uploadName', payload.file)
    params.append('taskId', payload.taskId)
    axios({
      url: '/v1/inddata/exp',
      method: 'POST',
      data: params,
      responseType: 'blob'  // 二进制流
    }).then(res => {
      cb(res.data)
    })
  },
//  清空数据操作
  clearDataByCollege (cb, payload) {
    axios({
      method: 'Delete',
      url: '/v1/org/' + payload.orgId + '/inddata',
      params: {
        'year_range': payload.yearRange,
        'task_id': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  clearDetailByCollege (cb, payload) {
    axios({
      method: 'Delete',
      url: '/v1/org/' + payload.orgId + '/inddetail',
      params: {
        'year_range': payload.yearRange,
        'task_id': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  clearDataByInd (cb, payload) {
    axios({
      method: 'Delete',
      url: '/v1/ind/' + payload.indId + '/inddata',
      params: {
        'year_range': payload.yearRange,
        'task_id': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  },
  clearDetailByInd (cb, payload) {
    axios({
      method: 'Delete',
      url: '/v1/ind/' + payload.indId + '/inddetail',
      params: {
        'year_range': payload.yearRange,
        'task_id': payload.taskId
      }
    }).then(res => {
      cb(res.data)
    })
  }
}
