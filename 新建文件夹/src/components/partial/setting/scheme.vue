<template>
  <div class="udss-board-body">
    <div class="udss-board-toolbox">
      <input
        class="search-input"
        :placeholder="$t('setting.filter')"
        v-model="filterText" />
      <Button
        v-hasPermission="'w'"
        @click="handCreate"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        style="float: none;"
        class="button-add">{{$t('setting.new')}}</Button>
    </div>
    <div class="scheme-table-box">
      <DragTable
        :tableTh="tableThs"
        :tableTd="tableTds"
        :dragStatus="editable"
        :lists="filterAllScheme"
        @dragChange="dragEnd"
        @triggerDelete="handleDelete"
        @triggerSwitch="handleSwitch"
        @triggerEdit="handleEdit">
      </DragTable>
    </div>
  </div>
</template>

<script>
  import { TogglePage } from '@/mixins'
  import {MessageBox, Message, Button, Table, TableColumn, Tag, Upload, Dialog} from 'element-ui'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { DragTable } from '../../widgets'
  export default {
    name: 'scheme',
    mixins: [ TogglePage ],
    components: {
      MessageBox, Button, Table, TableColumn, Tag, DragTable, Upload, Dialog
    },
    data () {
      return {
        exportStatus: false,
        fileShow: true,
        indFileShow: true,
        indExportStatus: false,
        operatingVisible: false,
        filterText: '',
        showChange: true,
        sortState: false,
        editable: true,
        filterAllScheme: [],
        tableThs: [
          {'name': '方案名称', 'width': ''},
          {'name': '简称', 'width': 100},
          {'name': '创建人', 'width': 100},
          {'name': '最近更新时间', 'width': 100},
          {'name': '备注', 'width': ''},
          {'name': '状态', 'width': 150},
          {'name': '操作', 'width': 80}
        ],
        tableTds: [
          {'name': 'name', 'width': ''},
          {'name': 'short_name', 'width': 100},
          {'name': 'created_user', 'width': 100},
          {'name': 'created_at', 'width': 100},
          {'name': 'remark', 'width': ''},
          {'name': 'is_published', 'width': 150}
        ]
      }
    },
    mounted () {
      this.getScheme()
    },
    computed: {
      ...mapGetters('setting', ['allScheme'])
    },
    methods: {
      ...mapActions('setting', ['getScheme', 'deleteScheme', 'schemeSort', 'swicthPublish']),
      ...mapMutations('setting', ['setActiveOrg', 'setNowSchemeId', 'clearActiveOrg', 'setNowScheme', 'getSchemeData', 'changeScheme', 'exp', 'importData', 'confirmShowCard']),
      // 处理文件
      handleFile (event) {
//        console.log(event)
        let payload = {}
        payload.file = event.target.files[0]
        let size = event.target.files[0].size / 1024 / 1024
        if (size > 1) {
          Message({
            message: '文件上传过大！',
            type: 'warning'
          })
        } else {
          this.fileShow = false
          setTimeout(() => {
            this.fileShow = true
          }, 10)
          this.confirmImportFile(payload)
        }
      },
      // 导入操作
      confirmImportFile (payload) {
        new Promise((resolve, reject) => {
          this.exportStatus = true
          this.importData({resolve, reject, payload})
        }).then(() => {
          Message({
            message: '数据上传成功！',
            type: 'success'
          })
          this.exportStatus = false
        }).catch(() => {
          Message({
            message: '数据上传失败，excel数据格式有误',
            type: 'error'
          })
          this.exportStatus = false
        })
      },
      handleExportIndData () {
        let payload = {
          name: '目标方案数据录入模板'
        }
        this.exp(payload)
      },
      // 拖拽结束处理
      dragEnd (data) {
        this.sortState = true
        this.changeScheme(data)
      },
      handCreate () {
        this.confirmShowCard(true)
        this.getSchemeData([])
        this.clearActiveOrg()
        this.setNowScheme([])
        this.setNowSchemeId(-1)
        this.togglePage('Write')
      },
      handleEdit (row) {
        this.confirmShowCard(false)
        this.clearActiveOrg()
        this.setActiveOrg(row.org_list)
        this.setNowSchemeId(row.id)
        this.getSchemeData([])
        this.setNowScheme(row)
        this.togglePage('Write')
      },
      handleDelete (row) {
        MessageBox.confirm(this.$t('element.confirm'), this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.deleteScheme(row)
        }).catch(() => {
          Message({
            type: 'info',
            message: this.$t('element.cancel')
          })
        })
      },
      handleSwitch (row) {
        if (row.org_list.length === 0) {
          Message({
            type: 'warning',
            message: '该方案未设定目标值，不能发布！'
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
      }
    },
    watch: {
      filterText () {
        if ((this.filterText.length === 0) && this.allScheme && (this.allScheme.length > 1)) {
          this.editable = true
        } else {
          this.editable = false
        }
        this.filterAllScheme = this.allScheme.filter(node => node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
      },
      allScheme () {
        if (this.allScheme && this.allScheme.length > 0) {
          this.filterAllScheme = this.allScheme.filter(node => node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
        }
      }
    },
    beforeDestroy () {
      if (this.sortState) {
        let data = this.allScheme.map(node => {
          return {
            id: node.id,
            order_no: node.order_no
          }
        })
        this.schemeSort(data)
      }
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
  .detail-icon-import {
    background-image: url('../../../assets/img/import.svg');
    border-right-color: #19B29E;
  }
</style>
