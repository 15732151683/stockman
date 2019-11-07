import ajax from '@/ajax/task'
import { Message } from 'element-ui'

const state = {
  depts: [],
  targets: [],
  tasks: [],
  taskNodes: [],
  pageInfo: {},
  searchCondition: {},
  totalCount: 0
}
const getters = {
  depts: state => state.depts,
  targets: state => state.targets,
  tasks: state => state.tasks,
  taskNodes: state => state.taskNodes,
  pageInfo: state => state.pageInfo,
  searchCondition: state => state.searchCondition,
  totalCount: state => state.totalCount
}
const actions = {
  getDept ({commit}) {
    ajax.getDept(({code, data, message}) => {
      code === 200
        ? commit('getDept', data)
        : Message({
          message: `部门信息获取失败， ${message}！`,
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
  getTaskNode ({commit}) {
    ajax.getTaskNode(({code, data, message}) => {
      if (code === 200) {
        window.sessionStorage.setItem('taskNodes', JSON.stringify(data))
        commit('getTaskNode', data)
      } else {
        Message({
          message: `获取流程节点失败， ${message}！`,
          type: 'error'
        })
      }
    })
  },
  getTask ({state, commit}, payload) {
    ajax.getTask(({code, data, message}) => {
      if (code === 200) {
        state.totalCount = data.count
        let lists = data.list
        lists && lists.forEach(node => {
          let ids = node.ind_ids.split(',').map(id => id * 1)
          node.ind_ids = ids
          node.year = node.year + ''
          node.dept_id = node.dept.id
          node.task_node = state.taskNodes.find(nod => nod.id === node.task_node.id)
          node.sub_tasks && node.sub_tasks.forEach(sub => {
            let subIds = sub.ind_ids.split(',').map(id => id * 1)
            sub.ind_ids = subIds
          })
          if (payload.check && node.sub_tasks) {
            let status = true
            for (let i = 0; i < node.sub_tasks.length; i++) {
              if (!node.sub_tasks[i].dept_accepted_at) {
                status = false
                break
              }
            }
            node.next_step = status
          }
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
        if (data.ind_err_message) {
          let tds = data.ind_err_message.map(node => {
            return '<tr><td>' + node.task_name + '</td><td>' + node.ind_names + '</td></tr>'
          }).join('')
          Message({
            dangerouslyUseHTMLString: true,
            message: `
                    <div class="error-message">创建失败，其它任务含有相同指标！</div>
                    <div class="error-table" cellspacing="0" cellpadding="0">
                      <table>
                        <tr><th>任务名</th><th>重复指标</th></tr>
                        ${tds}
                      </table>
                    </div>
                  `,
            type: 'error'
          })
          reject()
        } else {
          Message({
            message: `创建成功！`,
            type: 'success'
          })
          // commit('createTask', data)
          // data.ind_ids = data.ind_ids.split(',').map(node => node * 1)
          // data.dept_id = data.dept.id
          resolve()
        }
      } else {
        Message({
          message: `创建失败，${message}！`,
          type: 'error'
        })
        reject()
      }
    }, payload)
  },
  updateTask ({commit}, {resolve, reject, payload}) {
    ajax.updateTask(({code, data, message}) => {
      if (code === 200) {
        if (data.ind_err_message) {
          let tds = data.ind_err_message.map(node => {
            return '<tr><td>' + node.task_name + '</td><td>' + node.ind_names + '</td></tr>'
          }).join('')
          Message({
            dangerouslyUseHTMLString: true,
            message: `
                    <div class="error-message">修改失败，其它任务含有相同指标！</div>
                    <div class="error-table" cellspacing="0" cellpadding="0">
                      <table>
                        <tr><th>任务名</th><th>重复指标</th></tr>
                        ${tds}
                      </table>
                    </div>
                  `,
            type: 'error'
          })
          reject()
        } else {
          Message({
            message: `修改成功！`,
            type: 'success'
          })
          commit('updateTask', payload)
          resolve()
        }
      } else {
        Message({
          message: `修改失败，${message}！`,
          type: 'error'
        })
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
  getDept (state, payload) {
    state.depts = payload
  },
  getTarget (state, payload) {
    state.targets = payload
  },
  getTaskNode (state, payload) {
    state.taskNodes = payload
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
    payload.ind_ids = payload.ind_ids.split(',').map(node => node * 1)
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
