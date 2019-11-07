<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import TaskList from './partial/checkTaskOrg/taskList.vue'
  import ReadTask from './partial/checkTaskOrg/checkTask.vue'
  import { Container } from './widgets'
  import { StandTree, TogglePage } from '@/mixins'
  import { mapActions, mapMutations } from 'vuex'
  export default {
    name: 'CheckTaskOrg',
    mixins: [ StandTree, TogglePage ],
    components: {
      Container,
      TaskList,
      ReadTask
    },
    data () {
      return {
        title: '院系数据审核',
        view: 'TaskList',
        showDownload: [false, false, true]
      }
    },
    created () {
      this.setPageInfo({page: 1, size: 10})
      this.setSearchCondition({})
    },
    mounted () {
      this.$nextTick(() => {
        this.getTarget()
      })
    },
    methods: {
      ...mapActions('task', ['getTarget']),
      ...mapMutations('task', ['setPageInfo', 'setSearchCondition'])
    }
  }
</script>

<style scoped >

</style>
