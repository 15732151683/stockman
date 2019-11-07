<template>
  <table class="task-table" cellpadding="0" cellspacing="0">
    <tr>
      <td rowspan="4" width="20%" style="padding-left: 40px;"><span><strong>{{task.name}}</strong></span></td>
      <td width="30%">指标年份：<span>{{task.yearRange}}</span></td>
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
      <td>任务类型：<span>{{task.orgTypeA.name}}</span></td>
      <td>指标数量：
        <span v-if="listStyle === 'all'">{{task.indIds.length}}</span>
        <span v-else>{{task.sub_tasks[0].indIds.length}}</span>
      </td>
    </tr>
    <tr>
      <td>创建日期：<span>{{task.createdAt}}</span></td>
      <td>任务状态：<span v-if="!task.terminatedAt">进行中</span><span v-else>已终止</span></td>
    </tr>
    <tr>
      <td>发布日期：<span>{{task.publishedAt}}</span></td>
      <td>
        <div class="one-line">任务说明：<span :title="task.remark">{{task.remark}}</span></div>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'TaskList',
    props: {
      task: {
        require: true
      },
      listStyle: {
        default: 'all'
      }
    },
    data () {
      return {
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
  .task-table td {
    padding: 5px 2px;
  }
  .task-table td span {
    color: #5C5C5C;
  }
</style>
