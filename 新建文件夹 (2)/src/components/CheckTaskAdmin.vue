<template>
  <Container :title="title" :showDownload="[false, false, false]">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import TaskList from './partial/checkTaskAdmin/taskList.vue'
  import ReadTask from './partial/checkTaskAdmin/checkTask.vue'
  import { Container } from './widgets'
  import { StandTree, TogglePage } from '@/mixins'
  import { mapActions, mapMutations } from 'vuex'
  export default {
    name: 'CheckTaskAdmin',
    mixins: [ StandTree, TogglePage ],
    components: {
      Container,
      TaskList,
      ReadTask
    },
    data () {
      return {
        title: '',
        view: 'TaskList',
        showDownload: [true, false, true]
      }
    },
    created () {
      this.setTask([])
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
      ...mapMutations('task', ['setSearchCondition', 'setPageInfo', 'setTask'])
    }
  }
</script>

<style scoped >

</style>
