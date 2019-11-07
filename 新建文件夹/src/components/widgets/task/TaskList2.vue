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
      <td>指标数量：<span>{{task.ind_ids.length}}</span></td>
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
    <tr>
      <td colspan="4">
        <div class="sub-task">
          <div class="sub-task-title" @click="handleStatus">子任务列表&nbsp;&nbsp;
            <i v-if="!showList" class="el-icon-arrow-right"></i>
            <i v-else class="el-icon-arrow-down"></i>
          </div>
          <div :id="'task-list' + task.id" class="sub-task-list transition">
            <div :id="'task-list-box' +  + task.id">
              <table class="task-table sub-task-table" cellpadding="0" cellspacing="0">
                <tr v-for="sub in task.sub_tasks" :key="sub.id">
                  <td>填报人：<span>{{sub.name}}</span></td>
                  <td>指标数量：
                    <Tooltip placement="top">
                      <div slot="content">
                        <template v-for="(name, nameId) in sub.ind_names">
                          <span :key="nameId">{{name}}</span><br/>
                        </template>
                      </div>
                      <span>{{sub.ind_ids.length}}&nbsp;<i class="el-icon-question"></i></span>
                    </Tooltip>
                  </td>
                  <td>提交时间：<span>{{sub.committed_at}}</span></td>
                  <td>审核状态：
                    <span v-if="sub.dept_accepted_at">已审核</span>
                    <span v-else>未审核</span>
                  </td>
                  <td>审核通过时间：<span>{{sub.dept_accepted_at}}</span></td>
                  <td width="109px">
                    <Button
                      v-if="sub.committed_at && task.task_node.id < 5"
                      type="primary"
                      size="mini"
                      class="button-add"
                      style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                      @click.stop="handleCheck(sub)">数据审核</Button>
                    <Button
                      v-if="task.task_node.id >= 5"
                      type="primary"
                      size="mini"
                      class="button-add"
                      style="float: none; background-color: #1EBBA6; border-radius: 3px; color: #FFFFFF;"
                      @click.stop="handleCheck(sub)">数据查看</Button>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</template>

<script>
  import { Steps, Step, Collapse, CollapseItem, Button, Tooltip } from 'element-ui'
  export default {
    name: 'TaskList2',
    components: {
      Steps, Step, Collapse, CollapseItem, Button, Tooltip
    },
    props: {
      task: {
        require: true
      },
      taskNodes: {
        require: true
      }
    },
    data () {
      return {
        showList: false,
        activeId: 0,
        newTaskNodes: []
      }
    },
    mounted () {
      this.init()
    },
    computed: {
      taskNodeId () {
        return this.task.task_node.id
      }
    },
    watch: {
      taskNodeId () {
        this.init()
        // if (this.task.task_node.id === 6 && this.task.need_org_check === 0) {
        //   this.activeId = 4
        // }
      }
    },
    methods: {
      handleStatus () {
        this.showList = !this.showList
        let el = document.getElementById('task-list' + this.task.id)
        let elBox = document.getElementById('task-list-box' + this.task.id)
        if (this.showList === true) {
          el.style.height = elBox.offsetHeight + 10 + 'px'
        } else {
          el.style.height = '0'
        }
      },
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
      },
      handleCheck (item) {
        this.$emit('handleSubTask', {data: this.task, sub_data: item})
      }
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
  .sub-task-table {
    table-layout: auto;
  }
  .task-table td {
    padding: 5px 2px;
  }
  .task-table td span {
    color: #5C5C5C;
  }
  .sub-task table{
    margin-top: 10px;
    border-bottom: solid 1px #eeeeee;
  }
  .sub-task table tr>td {
    border-top: solid 1px #eeeeee;
    padding: 10px 2px;
  }
  .sub-task-title {
    text-align: center;
    line-height: 40px;
    color: #5C5C5C;
    font-weight: bold;
  }
  .sub-task-list {
    overflow: hidden;
    height: 0;
  }
  .transition {
    transition: height 0.3s linear;
  }
</style>
