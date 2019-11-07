<template>
  <div style="width: 100%; height: 100%;">
    <div class="task-header">
      <TaskSearch @getTask="getTaskList">
      </TaskSearch>
    </div>
    <div class="task-container">
      <div class="task-container-box">
        <ul class="task-ul" v-if="showList">
          <template v-for="(item, index) in tasks">
            <TaskLi :key="index" :currentTask="currentTask" :item="item" :taskNodes="taskNodes" @handleDetail="handleIndex(item)">
              <div slot="aside">
                <Button
                  v-if="item.terminated_at"
                  type="primary"
                  size="mini"
                  class="button-add"
                  style="float: none; background-color: #E58B6F; border-radius: 3px; color: #FFFFFF;">
                  已终止
                </Button>
                <Button
                  v-else-if="item.own_org_checked > 0 || item.task_node.id > 5"
                  type="primary"
                  size="mini"
                  class="button-add"
                  style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                  @click="handleCheckTask(item)"
                >数据查看</Button>
                <Button
                  v-else
                  type="primary"
                  size="mini"
                  class="button-add"
                  style="float: none; background-color: #EBB747; border-radius: 3px; color: #FFFFFF;"
                  @click="handleCheckTask(item)"
                >数据审核</Button>
              </div>
            </TaskLi>
          </template>
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
  import { TaskLi, TaskSearch, TaskPage } from '../../widgets'
  import { Button } from 'element-ui'
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'taskList',
    mixins: [ StandTree, TogglePage ],
    components: {
      TaskLi, TaskSearch, TaskPage, Button
    },
    data () {
      return {
        showList: false,
        currentTask: {
          task_node: {}
        },
        nodeTree: [],
        commitLoading: false
      }
    },
    computed: {
      ...mapGetters('task', ['tasks', 'targets', 'taskNodes'])
    },
    methods: {
      ...mapActions('checkTask', ['checkPass']),
      ...mapMutations('commitTask', ['setNodeTree', 'setCurrentTask']),
      ...mapMutations('checkTask', ['setSelectOrg']),
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
      handleCheckTask (data) {
        let arr = data.ind_ids
        this.getNodeTree(arr)
        let current = JSON.parse(JSON.stringify(data))
        this.setCurrentTask(current)
        this.togglePage('ReadTask')
      },
      getTaskList () {
        this.$refs.taskPage.handleFilterTask()
      }
    },
    mounted () {
      this.getTaskList()
      let orgs = JSON.parse(window.sessionStorage.getItem('udssInfo')).org
      this.setSelectOrg(orgs)
    },
    watch: {
      tasks () {
        if (this.tasks.length > 0) {
          if (this.taskNodes.length > 0) {
            this.currentTask = this.tasks[0]
            this.showList = true
          } else {
            let timer = setInterval(() => {
              if (this.taskNodes.length > 0) {
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
    height: 100%;
    overflow: hidden;
    overflow-y: auto;
    padding: 0 8px;
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
  .task-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
