<template>
  <div style="height: 100%; width: 100%;">
    <!--顶部内容-->
    <div :disabled="confirmShow">
      <!--<Tooltip effect="light" :content="confirmShow ? '新建方案保存后才能下载' : '导入目标数据'" placement="bottom-start">-->
        <Button
          :title="confirmShow ? '新建方案保存后才能下载' : '导入目标数据'"
          :disabled="confirmShow"
          @click="operatingVisible = true"
          style="width: 105px; float: right"
          class="button-add"
          type="primary"
          size="mini">
          导入目标数据
        </Button>
      </Tooltip>
    </div>
    <Dialog
      width="460px"
      :visible.sync="operatingVisible"
      :show-close="false"
      :close-on-click-modal="true">
      <div class="detail-dialog">
        <div class="detail-dialog-close" @click="operatingVisible = false">
          <i class="el-icon-close"></i>
        </div>
        <div class="detail-operator">
          <span>目标方案数据操作</span>
        </div>
        <div class="detail-list">
          <button
            @click="handleExportIndData"
            class="export-button">
            <div class="detail-list-icon detail-icon-export"></div>
            导出方案模板
          </button>
          <div style="display: block" class="import-box">
            <input
              :style="{display: exportStatus ? 'none' : 'block'}"
              class="import-cover-input"
              type="file"
              v-if="fileShow"
              accept=".xlsx"
              @change="handleFile($event)" />
            <button
              v-hasPermission="'w'"
              :disabled="exportStatus"
              class="import-button">
              <div class="detail-list-icon detail-icon-import"></div>
              <i class="el-icon-loading" v-show="exportStatus"></i>导入方案数据
            </button>
          </div>
          <!--<button-->
          <!--v-hasPermission="'w'"-->
          <!--class="clear-button"-->
          <!--@click="handleClearData">-->
          <!--<div class="detail-list-icon detail-icon-clear"></div>-->
          <!--清空指标数据-->
          <!--</button>-->
        </div>
      </div>
    </Dialog>
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div class="scheme-header">
        名称&nbsp;&nbsp;<input style="width: 325px;" :class="['scheme-input',{'err-msg': nameError}]" type="text" placeholder="方案名称" v-model="schemeName">
        &nbsp;&nbsp;简称&nbsp;&nbsp;<input :class="['scheme-input', {'err-msg': lenError}]" type="text" placeholder="不超过6字符" v-model="schemeAbbr">
      </div>
      <div class="scheme-remark">
        备注&nbsp;&nbsp;
        <Input
          class="scheme-textarea"
          type="textarea"
          :rows="2"
          placeholder="备注信息"
          v-model="remark" />
      </div>
    </div>
    <div style="overflow: hidden; margin-bottom: 10px;">
      <div class="scheme-button">
        <button :class="['write-type-button', {'is-active': writeType === 1}]" @click="changeType(1)">{{$t('setting.typeA')}}</button>
        <button :class="['write-type-button', {'is-active': writeType === 2}]"  @click="changeType(2)">{{$t('setting.typeB')}}</button>
      </div>
      <Button
        class="button-close"
        type="primary"
        size="small"
        style="float: right;"
        @click="close">{{$t('element.buttonClose')}}</Button>
      <Button
        class="button-confirm"
        type="primary"
        size="small"
        @click="confirm"
        :loading="confirmLoading"
        v-if="$route.meta.permissionList.includes('w') && !nowScheme.is_published"
        style="background-color: #3090E9; float: right; margin-right: 20px;">{{$t('element.save')}}</Button>
    </div>
    <div class="view-box">
      <component ref="child" :is="views"></component>
    </div>
  </div>
</template>

<script>
  import { TogglePage, StandTree } from '@/mixins'
  import { mapGetters, mapMutations } from 'vuex'
  import { Checkbox, Input, Button, Dialog, Message, Tooltip } from 'element-ui'
  import writeByInd from './writeByInd'
  import writeByCollege from './writeByCollege'
  export default {
    name: 'write',
    mixins: [ TogglePage, StandTree ],
    components: {
      Checkbox, writeByInd, writeByCollege, Input, Button, Dialog, Tooltip
    },
    props: ['subTitle'],
    data () {
      return {
        able: false,
        fileShow: true,
        exportStatus: false,
        operatingVisible: false,
        views: 'writeByCollege',
        title: '目标设定',
        schemeName: '',
        schemeAbbr: '',
        schemeId: -1,
        remark: '',
        writeType: 1,
        lenError: '',
        nameError: '',
        nowName: ''
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.setConfirmLoading(false)
        if (this.nowSchemeId > -1) {
          this.remark = this.nowScheme.remark
          this.schemeName = this.nowScheme.name
          this.nowName = this.nowScheme.name
          this.schemeAbbr = this.nowScheme.short_name
          this.downStatus([true, true, false])
        }
      })
    },
    computed: {
      ...mapGetters('setting', ['schemeData', 'nowSchemeId', 'activeOrg', 'currentYear', 'nowScheme', 'confirmLoading', 'confirmShow', 'nowSchemeName'])
    },
    methods: {
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      ...mapMutations('setting', ['setConfirmLoading', 'importData', 'downStatus', 'confirmShowCard', 'exp']),
      handleExportIndData () {
        let payload = {
          name: '目标方案-' + this.nowSchemeName + '数据录入模板',
          id: this.nowSchemeId
        }
        this.exp(payload)
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
      downloadDataA () {
        this.exportDataA({'name': '目标方案-' + this.nowScheme.name, 'url': '/v1/ts/exc/' + this.nowSchemeId + '?year=' + this.currentYear})
      },
      downloadDataB () {
      },
      close () {
        this.downStatus([false, false, false])
        this.togglePage('scheme')
      },
      changeType (id) {
        if (this.writeType !== id) {
          this.writeType = id
          if (id === 1) {
            this.views = 'writeByCollege'
          } else {
            this.views = 'writeByInd'
          }
        }
      },
      // 验证字符串长度
      lenValid () {
        this.schemeAbbr.length > 0 && this.schemeAbbr.length < 7 ? this.lenError = false : this.lenError = true
        this.schemeName ? this.nameError = false : this.nameError = true
      },
      confirm () {
        this.lenValid()
        if (!this.lenError && !this.nameError) {
          this.setConfirmLoading(true)
//          this.confirmShowCard(true)
          this.$refs.child.handleConfirm(this.schemeName, this.remark, this.schemeAbbr)
        }
      }
    },
    watch: {
    }
  }
</script>

<style scoped>
  .scheme-header {
    overflow: hidden;
    font-size: 14px;
  }
  .detail-dialog {
    margin: 0px 30px;
    padding-bottom: 40px;
  }
  .detail-dialog-close {
    color: #9B9B9B;
    font-size: 18px;
    text-align: right;
    margin-top: -25px;
  }
  .detail-operator {
    font-size: 16px;
    color: #000;
    font-weight: 600;
    margin-top: 20px;
  }
  .detail-list {
    overflow: hidden;
    display: flex;
    justify-content: space-around;
    margin-top: 26px;
    padding-bottom: 26px;
  }
  .detail-list-icon {
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
  .detail-list button{
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
  .export-button {
    background-color: #3090E9;
  }
  .import-cover-input {
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 55;
    cursor: pointer;
    opacity: 0;
  }
  .detail-icon-export {
    background-image: url('../../../assets/img/export.svg');
    border-right-color: #247BCA;
  }
  .import-box {
    position: relative;
  }
  .detail-icon-import {
    background-image: url('../../../assets/img/import.svg');
    border-right-color: #19B29E;
  }
  .scheme-input{
    outline: none;
    border: solid 1px #EAEAEA;
    border-radius: 3px;
    margin-right: 20px;
    line-height: 30px;
    text-indent: 10px;
    color: #4E4E4E;
  }
  .scheme-remark{
    display: flex;
    flex-flow: row;
    align-items: flex-start;
    font-size: 14px;
    line-height: 50px;
  }
  .scheme-textarea{
    width: calc(100% - 50px);
    font-size: 14px;
  }
  .err-msg{
    border-color: red;
  }
  .scheme-name {
    width: 400px;
    line-height: 30px;
    padding: 5px 10px;
    font-size: 16px;
    border: none;
    outline: none;
    color: #9D9D9D;
    float: left;
    background-color: #F3F3F3;
  }
  .scheme-textarea{
    margin-top: 10px;
    color: #9D9D9D;
  }
  .import-button {
    background-color: #1EBBA6;
  }
  .scheme-button{
    float: left;
  }
  .write-type-button {
    padding: 8px 12px;
    float: left;
    outline: none;
    color: #fff;
    background-color: #D3D4D6;
    border: none;
    cursor: pointer;
    margin-right: 20px;
  }
  .write-type-button.is-active{
    background-color: #4A90E2;
  }
  .view-box {
    width: 100%;
    height: calc(100% - 160px);
  }
</style>
