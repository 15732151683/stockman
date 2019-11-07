<template>
  <div class="udss-board-body">
    <div class="udss-board-toolbox">
      <input
        class="search-input"
        placeholder="评价方案名"
        v-model="filterText" />
      <Button
        v-hasPermission="'w'"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        style="float: none;"
        class="button-add"
        @click="handleAppend">新建方案</Button>
    </div>
    <div class="scheme-table-box">
      <DragTable
        :tableTh="tableThs"
        :tableTd="tableTds"
        :dragStatus="editable"
        :lists="filterEvaluations"
        @dragChange="dragEnd"
        @triggerDelete="handleDelete"
        @triggerSwitch="handleSwitch"
        @triggerEdit="handleEdit">
      </DragTable>
    </div>
  </div>
</template>

<script>
  import { StandTree, TogglePage } from '@/mixins'
  import { Button, Table, TableColumn, MessageBox, Message } from 'element-ui'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { DragTable } from '../../widgets'
  import draggable from 'vuedraggable'
  export default {
    name: 'scheme',
    mixins: [ StandTree, TogglePage ],
    components: {
      Button, Table, TableColumn, MessageBox, draggable, DragTable, Message
    },
    data () {
      return {
        filterText: '',
        sortState: false,
        editable: true,
        filterEvaluations: [],
        tableThs: [
          {'name': '方案名称', 'width': ''},
          {'name': '简称', 'width': 100},
          {'name': '创建人', 'width': 100},
          {'name': '权重数量', 'width': 80},
          {'name': '院系数量', 'width': 100},
          {'name': '最近更新时间', 'width': 100},
          {'name': '备注', 'width': ''},
          {'name': '状态', 'width': 150},
          {'name': '操作', 'width': 80}
        ],
        tableTds: [
          {'name': 'name', 'width': ''},
          {'name': 'short_name', 'width': 100},
          {'name': 'created_user', 'width': 100},
          {'name': 'weight_count', 'width': 80},
          {'name': 'org_count', 'width': 100},
          {'name': 'updated_at', 'width': 100},
          {'name': 'remark', 'width': ''},
          {'name': 'is_published', 'width': 150}
        ]
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getEvaluations()
      })
    },
    methods: {
      ...mapActions('evaluation', ['getEvaluations', 'evaluationSort', 'deleteEvaluation', 'getEvaluationById', 'swicthPublish']),
      ...mapMutations('evaluation', ['getNowEvaluation', 'changeEvaluation']),
      ...mapMutations('config', ['config', 'exportDataB']),
      downloadDataA () {
        // console.log('download current data')
      },
      downloadDataB () {
        this.exportDataB({'name': '评价方案', 'url': '/v1/eva/exp'})
      },
      handleSwitch (row) {
        if (row.org_count === 0) {
          Message({
            type: 'warning',
            message: '该方案没有院系信息,无法发布！'
          })
        } else {
          new Promise((resolve, reject) => {
            this.swicthPublish({resolve, reject, payload: row})
          }).then(() => {
            Message({
              type: 'success',
              message: row.is_published ? '发布成功！' : '取消发布！'
            })
          }).catch((error) => {
            Message({
              type: 'error',
              message: '操作失败！' + error
            })
          })
        }
      },
      // 拖拽结束处理
      dragEnd (data) {
        this.sortState = true
        this.changeEvaluation(data)
      },
      handleAppend () {
        this.getEvaluationById(-1)
        this.togglePage('Write')
      },
      handleEdit (row) {
        this.getNowEvaluation(row)
        this.getEvaluationById(row.id)
        this.togglePage('Edit')
      },
      handleDelete (row) {
        MessageBox.confirm('确认删除？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.deleteEvaluation(row)
        }).catch(() => {
        })
      }
    },
    watch: {
      filterText () {
        if ((this.filterText.length === 0) && this.evaluations && (this.evaluations.length > 1)) {
          this.editable = true
        } else {
          this.editable = false
        }
        this.filterEvaluations = this.evaluations.filter(node => node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
      },
      evaluations () {
        if (this.evaluations && this.evaluations.length > 0) {
          this.filterEvaluations = this.evaluations.filter(node => node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
        }
      }
    },
    // filters: {
    //   filterScheme (value, text) {
    //     if (text) {
    //       return value.filter(node => {
    //         return node.name.toLowerCase().indexOf(text.toLowerCase()) !== -1
    //       })
    //     } else {
    //       return value
    //     }
    //   }
    // },
    beforeDestroy () {
      if (this.sortState) {
        let data = this.evaluations.map(node => {
          return {
            id: node.id,
            order_no: node.order_no
          }
        })
        this.evaluationSort(data)
      }
    },
    computed: {
      ...mapGetters('evaluation', ['evaluations'])
    }
  }
</script>

<style scoped>
  .udss-board-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
  }
  .udss-board-toolbox {
    overflow: hidden;
  }
  .search-input {
    margin-right: 30px;
    border-radius: 4px;
    width: 350px;
    height: 35px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 48px;
    text-indent: 10px;
    background: url('../../../assets/img/search.png') no-repeat;
    background-position: top 10px right 18px;
  }
  .scheme-table-box{
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 70px);
    overflow: hidden;
  }
</style>
