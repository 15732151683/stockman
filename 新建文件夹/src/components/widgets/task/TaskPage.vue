<template>
  <div class="page-container">
    <Pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      :page-size="pageSizes"
      :page-sizes="[6, 10, 14, 20]"
      :current-page.sync="pageIndex"
      @size-change="handleSizeChange"
      @current-change="handleChange"></Pagination>
  </div>
</template>

<script>
  import { Pagination } from 'element-ui'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  export default {
    name: 'TaskPage',
    components: {
      Pagination
    },
    data () {
      return {
        pageSizes: 10,
        pageIndex: 1
      }
    },
    props: {
      check: {
        default: false
      }
    },
    computed: {
      ...mapGetters('task', ['tasks', 'pageInfo', 'totalCount', 'searchCondition']),
      total () {
        return this.totalCount
      }
    },
    mounted () {
      this.pageSizes = this.pageInfo.size
      this.pageIndex = this.pageInfo.page
    },
    watch: {
      pageInfo () {
        this.pageSizes = this.pageInfo.size
        this.pageIndex = this.pageInfo.page
      }
    },
    methods: {
      ...mapActions('task', ['getTask']),
      ...mapMutations('task', ['setPageInfo']),
      handleChange (val) {
        this.pageIndex = val
        this.handleSetPageInfo()
        this.handleFilterTask()
      },
      handleSizeChange (val) {
        this.pageSizes = val
        this.handleSetPageInfo()
        this.handleFilterTask()
      },
      handleSetPageInfo () {
        this.setPageInfo(
          {
            page: this.pageIndex,
            size: this.pageSizes
          }
        )
      },
      handleFilterTask () {
        let payload = {
          check: this.check
        }
        Object.assign(payload, this.pageInfo)
        payload.page = payload.page - 1
        if (this.searchCondition.advance) {
          Object.assign(payload, this.searchCondition)
          payload.years && (payload.years = payload.years.split('-').join(','))
          payload.createdAt && (payload.createdAt = payload.createdAt.join(','))
          payload.deadline && (payload.deadline = payload.deadline.join(','))
          payload.deptIds && (payload.deptIds = payload.deptIds.join(','))
          payload.nodeId && (payload.nodeId = payload.nodeId.join(','))
          payload.publishedAt && (payload.publishedAt = payload.publishedAt.join(','))
          payload.indIds && (payload.indIds = payload.indIds.join(','))
        } else {
          payload.timeId = this.searchCondition.timeId
        }
        this.getTask(payload)
      }
    }
  }
</script>

<style scoped>
  .page-container {
    text-align: center;
  }
</style>
