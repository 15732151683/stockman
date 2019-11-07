import ajax from '@/ajax/task'
import { Message } from 'element-ui'

const initTime = function (time) {
  return String(time).split('T')[0]
}
const state = {
  typeA: [],
  schools: [],
  targets: [],
  tasks: [],
  pageInfo: {},
  searchCondition: {},
  totalCount: 0
}
const getters = {
  typeA: state => state.typeA,
  schools: state => state.schools,
  targets: state => state.targets,
  tasks: state => state.tasks,
  pageInfo: state => state.pageInfo,
  searchCondition: state => state.searchCondition,
  totalCount: state => state.totalCount
}
const actions = {
  getTypeA ({commit}) {
    ajax.getTypeA(({code, data, message}) => {
      code === 200
        ? commit('getTypeA', data)
        : Message({
          message: `类型A获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getSchools ({commit}) {
    ajax.getSchools(({code, data, message}) => {
      code === 200
        ? commit('getSchools', data)
        : Message({
          message: `学校列表获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getTarget ({commit}) {
    ajax.getTarget(({code, data, message}) => {
      code === 200
        ? commit('getTarget', data)
        : Message({
          message: `指标获取失败， ${message}！`,
          type: 'error'
        })
    })
  },
  getTask ({state, commit}, payload) {
    ajax.getTask(({code, data, message, count}) => {
      if (code === 200) {
        state.totalCount = count
        let lists = data
        lists && lists.forEach(node => {
          let ids = node.indIds ? node.indIds.split(',').map(id => id * 1) : []
          let orgIds = node.orgIds ? node.orgIds.split(',').map(id => id * 1) : []
          node.indIds = ids
          node.typeAId = node.orgTypeA.id
          node.orgIds = orgIds
          node.yearRange = node.yearStart + '-' + node.yearEnd
          node.createdAt = node.createdAt ? initTime(node.createdAt) : ''
          node.deadline = node.deadline ? initTime(node.deadline) : ''
          node.publishedAt = node.publishedAt ? initTime(node.publishedAt) : ''
          node.terminatedAt = node.terminatedAt ? initTime(node.terminatedAt) : ''
        })
        commit('getTask', lists)
      } else {
        Message({
          message: `获取指标任务失败， ${message}！`,
          type: 'error'
        })
      }
    }, payload)
  },
  createTask ({commit}, {resolve, reject, payload}) {
    ajax.createTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `创建成功！`,
          type: 'success'
        })
        // commit('createTask', data)
        // data.ind_ids = data.ind_ids.split(',').map(node => node * 1)
        // data.dept_id = data.dept.id
        resolve()
      } else {
        if (data && data.length > 0) {
          let tds = data.map(node => {
            return '<tr><td>' + node.TaskName + '</td><td>' + node.OrgName + '</td><td>' + node.IndNames + '</td></tr>'
          }).join('')
          Message({
            dangerouslyUseHTMLString: true,
            message: `
                    <div class="error-message">创建失败，其它任务含有相同指标！</div>
                    <div class="error-table" cellspacing="0" cellpadding="0">
                      <table>
                        <tr><th>任务名</th><th>重复学校</th><th>重复指标</th></tr>
                        ${tds}
                      </table>
                    </div>
                  `,
            type: 'error'
          })
          reject()
        } else {
          Message({
            message: `创建失败，${message}！`,
            type: 'error'
          })
        }
        reject()
      }
    }, payload)
  },
  updateTask ({commit}, {resolve, reject, payload}) {
    ajax.updateTask(({code, data, message}) => {
      if (code === 200) {
        Message({
          message: `修改成功！`,
          type: 'success'
        })
        commit('updateTask', payload)
        resolve()
      } else {
        if (data && data.length > 0) {
          let tds = data.map(node => {
            return '<tr><td>' + node.TaskName + '</td><td>' + node.OrgName + '</td><td>' + node.IndNames + '</td></tr>'
          }).join('')
          Message({
            dangerouslyUseHTMLString: true,
            message: `
                    <div class="error-message">修改失败，其它任务含有相同指标！</div>
                    <div class="error-table" cellspacing="0" cellpadding="0">
                      <table>
                        <tr><th>任务名</th><th>重复学校</th><th>重复指标</th></tr>
                        ${tds}
                      </table>
                    </div>
                  `,
            type: 'error'
          })
          reject()
        } else {
          Message({
            message: `修改失败，${message}！`,
            type: 'error'
          })
        }
        reject()
      }
    }, payload)
  },
  publishTask ({commit}, {resolve, reject, id}) {
    ajax.publishTask(({code, data, message}) => {
      Message({
        message: `发布${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      code === 200 && commit('publishTask', data)
      code === 200 ? resolve(data) : reject()
    }, id)
  },
  deleteTask ({commit}, {resolve, reject, id}) {
    ajax.deleteTask(({code, data, message}) => {
      Message({
        message: `删除${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      // code === 200 && commit('deleteTask', id)
      code === 200 ? resolve() : reject()
    }, id)
  },
  endTask ({commit}, {resolve, reject, id}) {
    ajax.endTask(({code, data, message}) => {
      Message({
        message: `终止任务${code === 200 ? '成功' : '失败,' + message}！`,
        type: code === 200 ? 'success' : 'error'
      })
      // code === 200 && commit('deleteTask', id)
      code === 200 ? resolve() : reject()
    }, id)
  }
}
const mutations = {
  getTypeA (state, payload) {
    state.typeA = payload
  },
  getSchools (state, payload) {
    state.schools = payload
  },
  getTarget (state, payload) {
    state.targets = payload
  },
  getTask (state, payload) {
    state.tasks = payload
  },
  setTask (state, payload) {
    state.tasks = payload
  },
  // createTask (state, payload) {
  //   payload.ind_ids = payload.ind_ids.split(',').map(node => node * 1)
  //   payload.dept_id = payload.dept.id
  //   state.tasks.unshift(payload)
  // },
  updateTask (state, payload) {
    let index = state.tasks.findIndex(node => node.id === payload.id)
    state.tasks.splice(index, 1, payload)
  },
  publishTask (state, payload) {
    console.log(payload, 'payload')
    payload.indIds = payload.indIds.split(',').map(node => node * 1)
    let index = state.tasks.findIndex(node => node.id === payload.id)
    state.tasks.splice(index, 1, payload)
  },
  // deleteTask (state, id) {
  //   let index = state.tasks.findIndex(node => node.id === id)
  //   state.tasks.splice(index, 1)
  // },
  setPageInfo (state, data) {
    state.pageInfo = data
  },
  setSearchCondition (state, data) {
    state.searchCondition = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
