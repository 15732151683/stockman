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
            <TaskLi :key="index" :currentTask="currentTask" :listStyle="'sub'" :item="item" :taskNodes="taskNodes" @handleDetail="handleIndex(item)">
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
                <div v-else>
                  <Button
                    v-if="!item.sub_tasks[0].committed_at"
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #EBB747; border-radius: 3px; margin-top: 5px; color: #FFFFFF;"
                    @click.stop="handleWrite(item)">数据填写</Button>
                  <Button
                    v-else
                    type="primary"
                    size="mini"
                    class="button-add"
                    style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                    @click.stop="handleWrite(item)">数据查看</Button>
                </div>
              </div>
            </TaskLi>
          </template>
        </ul>
      </div>
    </div>
    <div class="task-footer">
      <TaskPage ref="taskPage"></TaskPage>
    </div>
  </div>
</template>

<script>
  import { StandTree, TogglePage } from '@/mixins'
  import { TaskLi, TaskPage, TaskSearch } from '../../widgets'
  import { Button } from 'element-ui'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'taskList',
    mixins: [ StandTree, TogglePage ],
    components: {
      TaskLi, TaskPage, TaskSearch, Button
    },
    data () {
      return {
        showList: false,
        currentTask: {
          task_node: {}
        },
        nodeTree: []
      }
    },
    mounted () {
      this.getTaskList()
      let timer = setInterval(() => {
        if (this.tasks.length > 0 && this.taskNodes.length > 0) {
          this.currentTask = this.tasks[0]
          this.showList = true
          clearInterval(timer)
        }
      }, 10)
    },
    computed: {
      ...mapGetters('task', ['tasks', 'targets', 'taskNodes'])
    },
    methods: {
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
      handleWrite (data) {
        let arr = data.sub_tasks[0].ind_ids
        this.getNodeTree(arr)
        this.setCurrentTask(data)
        this.togglePage('WriteTask')
      },
      handleView (data) {
        this.handleWrite(data)
      },
      getTaskList () {
        this.$refs.taskPage.handleFilterTask()
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
    padding: 0 8px;
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
  .task-ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
</style>
