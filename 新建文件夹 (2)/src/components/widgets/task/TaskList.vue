<template>
  <table class="task-table" cellpadding="0" cellspacing="0">
    <tr>
      <td rowspan="4" width="20%" style="padding-left: 40px;"><span><strong>{{task.name}}</strong></span></td>
      <td width="30%">指标年份：<span>{{task.year_range}}</span></td>
      <td width="30%">截止日期：<span>{{task.deadline}}</span></td>
      <td width="100px" rowspan="4">
        <div>
          <aside>
            <slot name="aside"></slot>
          </aside>
        </div>
      </td>
    </tr>
    <tr>
      <td>填报部门：<span>{{task.dept.name}}</span></td>
      <td>指标数量：
        <span v-if="listStyle === 'all'">{{task.ind_ids.length}}</span>
        <span v-else>{{task.sub_tasks[0].ind_ids.length}}</span>
      </td>
    </tr>
    <tr>
      <td>创建日期：<span>{{task.created_at}}</span></td>
      <td>任务状态：<span v-if="!task.terminated_at">{{task.task_node.task_status}}</span><span v-else>已终止</span></td>
    </tr>
    <tr>
      <td>发布日期：<span>{{task.published_at}}</span></td>
      <td>
        <div class="one-line">任务说明：<span :title="task.remark">{{task.remark}}</span></div>
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <div class="task-step">
          <Steps :active="activeId" align-center>
            <Step v-for="(child, index) in newTaskNodes" :key="index">
              <div class="task-step-title" slot="title">{{child.name}}</div>
            </Step>
          </Steps>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
  import { Steps, Step } from 'element-ui'
  export default {
    name: 'TaskList',
    components: {
      Steps, Step
    },
    props: {
      task: {
        require: true
      },
      taskNodes: {
        require: true
      },
      listStyle: {
        default: 'all'
      }
    },
    data () {
      return {
        activeId: 0,
        newTaskNodes: []
      }
    },
    methods: {
      init () {
        let check = this.task.need_org_check === 1
        let taskId = this.task.task_node.id
        let newTaskNodes = JSON.parse(JSON.stringify(this.taskNodes))
        this.newTaskNodes = []
        if (check) {
          newTaskNodes.splice(4, 0, this.taskNodes[5])
          this.newTaskNodes = newTaskNodes
          if (taskId === 6) {
            this.activeId = 6
          } else {
            this.activeId = this.newTaskNodes.findIndex(node => node.id === this.task.task_node.id)
          }
        } else {
          newTaskNodes.splice(4, 1)
          this.newTaskNodes = newTaskNodes
          this.activeId = this.newTaskNodes.findIndex(node => node.id === this.task.task_node.id)
        }
      }
    },
    computed: {
      taskId () {
        return this.task.task_node.id
      }
    },
    watch: {
      taskId () {
        this.init()
      }
    },
    mounted () {
      this.init()
    }
  }
</script>

<style scoped>
  .task-table {
    width: 100%;
    font-size: 14px;
    table-layout: fixed;
    color: #A3A8AA;
  }
  .task-table td {
    padding: 5px 2px;
  }
  .task-table td span {
    color: #5C5C5C;
  }
</style>
