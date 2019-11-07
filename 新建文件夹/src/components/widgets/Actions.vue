<template>
  <div class="action-box">
    <Button
      v-if="!hidden"
      :disabled="currentInd.ind_type_id === 2"
      type="primary"
      size="mini"
      style="float: none"
      class="button-add action-button"
      @click="handleAction">数据与明细操作</Button>
    <!--操作弹框-->
    <Dialog
      width="460px"
      :visible.sync="actionVisible"
      :show-close="false"
      :close-on-click-modal="true">
      <div class="action-dialog">
        <div class="action-dialog-close" @click="actionVisible = false">
          <i class="el-icon-close"></i>
        </div>
        <div class="action-name">
          <span>指标数据操作</span>
        </div>
        <div class="action-list">
          <button
            @click="handleExportIndData"
            class="action-export-button">
            <div class="action-list-icon action-icon-export"></div>
            导出数据模板
          </button>
          <div class="action-import-box">
            <input
              :style="{display: indExportStatus ? 'none' : 'block'}"
              class="import-cover-input"
              type="file"
              v-if="indFileShow"
              accept=".xlsx"
              @change="handleImportIndData($event)" />
            <button
              :disabled="indExportStatus"
              class="action-import-button">
              <div class="action-list-icon action-icon-import"></div>
              <i class="el-icon-loading" v-show="indExportStatus"></i>导入指标数据
            </button>
          </div>
          <button
            :disabled="currentInd.ind_type_id === 2"
            class="action-clear-button"
            @click="handleClearData">
            <div class="action-list-icon action-icon-clear"></div>
            清空指标数据
          </button>
        </div>
        <div style="width: 100%; height: 1px; background-color: #F5F5F5;"></div>
        <div class="action-name">
          <span>指标明细操作</span>
        </div>
        <div class="action-list" style="padding-bottom: 0px;">
          <button
            @click="handleExportModule"
            class="action-export-button">
            <div class="action-list-icon action-icon-export"></div>
            导出明细模板
          </button>
          <div class="action-import-box">
            <input
              :style="{display: exportStatus ? 'none' : 'block'}"
              class="import-cover-input"
              type="file"
              v-if="fileShow"
              accept=".xlsx"
              @change="handleFile($event)" />
            <button
              :disabled="exportStatus"
              class="action-import-button">
              <div class="action-list-icon action-icon-import"></div>
              <i class="el-icon-loading" v-show="exportStatus"></i>导入明细数据
            </button>
          </div>
          <button
            :disabled="currentInd.ind_type_id === 2"
            class="action-clear-button"
            @click="handleClearDetail">
            <div class="action-list-icon action-icon-clear"></div>
            清空明细数据
          </button>
        </div>
      </div>
    </Dialog>
    <!--明细弹框-->
    <Dialog
      width="400px"
      :visible.sync="exportVisible"
      :show-close="false"
      :close-on-click-modal="true">
      <div class="action-dialog">
        <div class="action-title">
          <span>明细模板导出</span>
        </div>
        <div>
          <Select v-model="selectDetailModule" placeholder="请选择" style="width: 100%;">
            <Option
              v-for="item in detailModule"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </Option>
          </Select>
        </div>
        <div class="action-footer" style="text-align: right;">
          <Button
            class="button-close"
            type="primary"
            size="small"
            style="background-color: #9B9B9B;"
            @click="exportVisible = false">取消</Button>
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            @click="confirmExportModule"
            :disabled="selectDetailModule === ''"
            style="background-color: #3090E9;">导出</Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import {Dialog, Button, Message, MessageBox, Select, Option} from 'element-ui'
  import { mapMutations, mapActions } from 'vuex'
  export default {
    name: 'Actions',
    components: {
      Dialog, Button, Message, MessageBox, Select, Option
    },
    data () {
      return {
        actionVisible: false,
        indExportStatus: false,
        exportStatus: false,
        indFileShow: true,
        fileShow: true,
        exportVisible: false,
        selectDetailModule: ''
      }
    },
    props: {
      currentInd: {
        default: {}
      },
      hidden: {
        default: false
      },
      detailModule: {
        default: []
      },
      yearRange: {
        default: ''
      },
      currentTask: {
        default: {}
      }
    },
    methods: {
      ...mapActions('write', ['clearDataByInd', 'clearDetailByInd']),
      ...mapMutations('write', ['exportModule', 'importData', 'exportIndData', 'importIndData']),
      handleAction () {
        this.actionVisible = true
      },
      // 清空数据
      handleClearData () {
        let msg = '确认清空：' + this.currentInd.name + '，' + this.yearRange + '年所有院系数据及其相关明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.clearDataByInd({resolve, reject, payload: {indId: this.currentInd.id, yearRange: this.yearRange, taskId: this.currentTask.id}})
          }).then(() => {
            // 清空数据操作（页面数据要清除）
            this.$emit('clearAllData')
          }).catch(() => {})
        }).catch(() => {
        })
      },
      handleClearDetail () {
        let msg = '确认清空：' + this.currentInd.name + '，' + this.yearRange + '年所有院系明细数据？'
        MessageBox.confirm(msg, this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.clearDetailByInd({indId: this.currentInd.id, yearRange: this.yearRange, taskId: this.currentTask.id})
        }).catch(() => {})
      },
      // 明细导入和导出 start
      handleExportModule () {
        this.exportVisible = true
      },
      confirmExportModule () {
        let obj = this.detailModule.find(node => node.id === this.selectDetailModule)
        obj.taskId = this.currentTask.id
        this.exportModule(obj)
        this.exportVisible = false
      },
      handleFile (event) {
        let payload = {}
        payload.file = event.target.files[0]
        payload.taskId = this.currentTask.id
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
          MessageBox.confirm('是否同步指标数据？', this.$t('element.warming'), {
            confirmButtonText: '是',
            cancelButtonText: '否',
            type: 'warning'
          }).then(() => {
            payload.status = true
            this.confirmImportFile(payload)
          }).catch(() => {
            payload.status = false
            this.confirmImportFile(payload)
          })
        }
      },
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
      // 明细导入和导出 end
      // 指标数据导入和导出
      handleExportIndData () {
        let payload = {
          name: '指标数据录入模板',
          taskId: this.currentTask.id
        }
        this.exportIndData(payload)
      },
      handleImportIndData () {
        let file = event.target.files[0]
        let payload = {
          file: file,
          taskId: this.currentTask.id
        }
        let size = event.target.files[0].size / 1024 / 1024
        if (size > 1) {
          Message({
            message: '文件上传过大！',
            type: 'warning'
          })
        } else {
          this.indFileShow = false
          setTimeout(() => {
            this.indFileShow = true
          }, 10)
          new Promise((resolve, reject) => {
            this.indExportStatus = true
            this.importIndData({resolve, reject, payload})
          }).then(() => {
            Message({
              message: '数据上传成功！',
              type: 'success'
            })
            this.indExportStatus = false
          }).catch(() => {
            Message({
              message: '数据上传失败，excel数据格式有误',
              type: 'error'
            })
            this.indExportStatus = false
          })
        }
      }
    }
  }
</script>

<style scoped>
  .action-box {
    display: inline-block;
  }
  .action-button {
    padding: 10px 20px;
    margin-left: 20px;
    color: #ffffff;
    background-color: #E4AD59 !important;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B) !important;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B)) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0) !important;
  }
  .action-dialog {
    margin: 0px 30px;
    padding-bottom: 40px;
  }
  .action-title{
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding-bottom: 20px;
  }
  .action-footer {
    margin-top: 10px;
  }
  .action-dialog-close {
    color: #9B9B9B;
    font-size: 18px;
    text-align: right;
    margin-top: -25px;
  }
  .action-dialog-close i {
    font-weight: 600;
    cursor: pointer;
  }
  .action-name {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-top: 20px;
  }
  .action-import-box {
    position: relative;
  }
  .import-cover-input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 55;
    cursor: pointer;
    opacity: 0;
  }
  .action-list-icon {
    display: inline-block;
    vertical-align:middle;
    width: 14px;
    height: 32px;
    line-height: 32px;
    padding-right: 5px;
    margin-right: 3px;
    border-right: solid 1px;
    background-size: 12px auto;
    background-position: 2px 9px;
    background-repeat: no-repeat;
  }
  .action-icon-export {
    background-image: url('../../assets/img/export.svg');
    border-right-color: #247BCA;
  }
  .action-icon-import {
    background-image: url('../../assets/img/import.svg');
    border-right-color: #19B29E;
  }
  .action-icon-clear {
    background-image: url('../../assets/img/clear.svg');
    border-right-color: #CB6243;
  }
  .action-list {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    margin-top: 26px;
    padding-bottom: 26px;
  }
  .action-list button{
    display: block;
    border: none;
    outline: none;
    border-radius: 3px;
    height: 32px;
    line-height: 32px;
    overflow: hidden;
    padding: 0 5px;
    color: #FFFFFF;
    cursor: pointer;
  }
  .action-export-button {
    background-color: #3090E9;
  }
  .action-import-button {
    background-color: #1EBBA6;
  }
  .action-clear-button {
    background-color: #D96A49;
  }
</style>
