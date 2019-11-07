<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import TaskList from './partial/checkTaskDept/taskList.vue'
  import CheckSubTask from './partial/checkTaskDept/checkSubTask.vue'
  import CheckAllTask from './partial/checkTaskDept/checkAllTask.vue'
  import { Container } from './widgets'
  import { StandTree, TogglePage } from '@/mixins'
  import { mapActions, mapMutations } from 'vuex'
  export default {
    name: 'CheckTask',
    mixins: [ StandTree, TogglePage ],
    components: {
      Container,
      TaskList,
      CheckSubTask,
      CheckAllTask
    },
    data () {
      return {
        title: '',
        view: 'TaskList',
        showDownload: [false, false, true]
      }
    },
    created () {
      this.setTask([])
      this.setPageInfo({page: 1, size: 10})
      this.setSearchCondition({})
    },
    mounted () {
      this.$nextTick(() => {
        this.getDeptUser()
        this.getTarget()
      })
    },
    methods: {
      ...mapActions('task', ['getTarget']),
      ...mapActions('checkTask', ['getDeptUser']),
      ...mapMutations('task', ['setPageInfo', 'setSearchCondition', 'setTask'])
    }
  }
</script>

<style scoped >

</style>
