<template>
  <div style="width: 100%; height: 100%;">
    <div class="task-header">
      <TaskSearch @getTask="getTaskList">
      </TaskSearch>
    </div>
    <div class="task-container">
      <div class="task-container-box">
        <ul class="task-ul" v-if="showList">
          <li :class="['task-li', 'task-li-' + item.task_node.status_type, {'task-li-active': currentTask.id === item.id}]" v-for="(item, index) in tasks" :key="index" @click="handleIndex(item)">
            <TaskList2 :task="item" :taskNodes="taskNodes" @handleSubTask="handleCheckNode">
              <div slot="aside">
                <div v-if="item.terminated_at">
                  <Button
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #E58B6F; border-radius: 3px; color: #FFFFFF;">
                    已终止
                  </Button>
                </div>
                <div v-else-if="item.next_step">
                  <Button
                    v-if="item.task_node.id === 3 || item.task_node.id === 4"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleCheckTask(item)">部门审核</Button>
                  <Button
                    v-else-if="item.task_node.id >= 5"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleCheckTask(item)">数据查看</Button>
                </div>
              </div>
            </TaskList2>
          </li>
        </ul>
      </div>
    </div>
    <div class="task-footer">
      <TaskPage :check="true" ref="taskPage"></TaskPage>
    </div>
  </div>
</template>

<script>
  import { StandTree, TogglePage } from '@/mixins'
  import { TaskList2, TaskSearch, TaskPage } from '../../widgets'
  import { Button, MessageBox, Message } from 'element-ui'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'taskList',
    mixins: [ StandTree, TogglePage ],
    components: {
      TaskList2, TaskSearch, TaskPage, Button, MessageBox, Message
    },
    data () {
      return {
        showList: false,
        currentTask: {
          task_node: {}
        },
        nodeTree: [],
        commitLoading: false,
        roleType: 0
      }
    },
    computed: {
      ...mapGetters('task', ['tasks', 'targets', 'taskNodes']),
      ...mapGetters('checkTask', ['deptUsers'])
    },
    methods: {
      ...mapActions('checkTask', ['checkPass']),
      ...mapMutations('commitTask', ['setNodeTree', 'setCurrentTask']),
      // 根据id过滤符合节点树结构
      filterTree (tree, nodes) {
        let cuts = []
        tree.forEach((node) => {
          if (node.is_leaf) {
            nodes.indexOf(node.id) < 0 && cuts.push(node.id)
          } else {
            if (node.children && node.children.length > 0) {
              let child = this.filterTree(node.children, nodes)
              child && child.length === 0 && cuts.push(node.id)
            } else {
              cuts.push(node.id)
            }
          }
        })
        cuts.forEach(item => {
          let idx = tree.findIndex(child => child.id === item)
          idx > -1 && tree.splice(idx, 1)
        })
        return tree
      },
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      // 获取任务包含的指标树结构
      getNodeTree (nodes) {
        let cloneTree = this.clone(this.targets)
        let nodeTree = this.filterTree(cloneTree, nodes)
        this.setNodeTree(nodeTree)
      },
      // 点击当前任务
      handleIndex (data) {
        this.currentTask = data
      },
      handleCheckNode (data) {
        let arr = data.sub_data.ind_ids
        this.getNodeTree(arr)
        let current = JSON.parse(JSON.stringify(data.data))
        current.sub_tasks = data.sub_data
        this.setCurrentTask(current)
        this.togglePage('CheckSubTask')
      },
      handleCheckTask (data) {
        let arr = data.ind_ids
        this.getNodeTree(arr)
        let current = JSON.parse(JSON.stringify(data))
        this.setCurrentTask(current)
        this.togglePage('CheckAllTask')
      },
      handleSubmit (data) {
        MessageBox.confirm(
          '确认审核通过?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          new Promise((resolve, reject) => {
            this.checkPass({resolve, reject, payload: {id: data.id}})
          }).then((res) => {
            data.task_node = res
          }).catch(() => {})
        }).catch(() => {})
      },
      getTaskList () {
        this.$refs.taskPage.handleFilterTask()
      }
    },
    mounted () {
      this.getTaskList()
      this.roleType = JSON.parse(window.sessionStorage.getItem('udssInfo')).role[0].type_id
      if (this.taskNodes.length > 0 && this.deptUsers.length > 0) {
        this.tasks.forEach(node => {
          node.sub_tasks.forEach(item => {
            let user = this.deptUsers.find(user => user.user_id === item.input_user_id)
            item.name = user ? user.user_name : ''
          })
        })
        this.currentTask = this.tasks[0]
        this.showList = true
      }
    },
    watch: {
      tasks () {
        if (this.tasks.length > 0) {
          if (this.taskNodes.length > 0 && this.deptUsers.length > 0) {
            this.tasks.forEach(node => {
              node.sub_tasks.forEach(item => {
                let user = this.deptUsers.find(user => user.user_id === item.input_user_id)
                item.name = user ? user.user_name : ''
              })
            })
            this.currentTask = this.tasks[0]
            this.showList = true
          } else {
            let timer = setInterval(() => {
              if (this.taskNodes.length > 0 && this.deptUsers.length > 0) {
                this.tasks.forEach(node => {
                  node.sub_tasks.forEach(item => {
                    let user = this.deptUsers.find(user => user.user_id === item.input_user_id)
                    item.name = user ? user.user_name : ''
                  })
                })
                this.currentTask = this.tasks[0]
                this.showList = true
                clearInterval(timer)
              }
            }, 10)
          }
        }
      }
    }
  }
</script>

<style scoped>
  .task-header {
    overflow: hidden;
    height: 40px;
  }
  .task-container {
    width: 100%;
    padding-top: 8px;
    padding-bottom: 8px;
    margin-top: 5px;
    height: calc(100% - 108px);
    background-color: #EFF3F6;
    overflow: hidden;
  }
  .task-container-box {
    padding: 0 8px;
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
  }
  .task-footer {
    margin-top: 10px;
  }
  .task-header-text {
    display: inline-block;
    line-height: 40px;
    margin-left: 10px;
    color: #636363;
    font-size: 14px;
  }
  .task-ul, .task-li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .task-li {
    border-left: solid 4px #1EBBA6;
    margin-bottom: 8px;
    padding: 8px 5px 8px 8px;
    cursor: pointer;
    background-color: #FFFFFF;
  }
  .task-li-1 {
    border-color: #57C5FE !important;
    outline-color: #57C5FE;
  }
  .task-li-2 {
    border-color: #ff6f60 !important;
    outline-color: #ff6f60;
  }
  .task-li-3 {
    border-color: #EBB747 !important;
    outline-color: #EBB747;
  }
  .task-li-4 {
    border-color: #1EBBA6 !important;
    outline-color: #1EBBA6;
  }
  .task-li-active {
    outline-style: solid;
    outline-width: 2px;
    outline-offset: -2px;
    background-color: #FBFBFB;
  }
</style>
