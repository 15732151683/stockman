<template>
  <li :class="['task-li', {'task-li-active': currentTask.id === item.id}]" @click="handleDetail">
    <TaskList :task="item" :listStyle="listStyle">
      <div slot="aside">
        <template>
          <slot name="aside"></slot>
        </template>
      </div>
    </TaskList>
  </li>
</template>

<script>
  import TaskList from './TaskList.vue'
  export default {
    name: 'TaskLi',
    components: {
      TaskList
    },
    props: {
      item: {
        default: {
          task_node: {}
        }
      },
      currentTask: {
        default: {
          task_node: {}
        }
      },
      listStyle: {
        default: 'all'
      }
    },
    methods: {
      handleDetail () {
        this.$emit('handleDetail')
      }
    }
  }
</script>

<style scoped>
  .task-li {
    border-left: solid 4px #1EBBA6;
    margin-bottom: 8px;
    padding: 8px 5px 8px 8px;
    cursor: pointer;
    background-color: #FFFFFF;
    outline-color: #1EBBA6;
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
