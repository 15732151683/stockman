<template>
  <div id="container" style="position: relative">
    <div class="udss-input">
      <div class="field-input">
        <div class="beizhu" >
          <span >名称：</span>
          <Input
            style="width: 80%;"
            :disabled="currentData.is_valid === 1"
            size="mini"
            v-model="currentData.name"
            placeholder="指标名称，必填项" />
        </div>
        <div
          class="beizhu"
          style="margin-top: 10px; align-items: flex-start">
          <span>备注：</span>
          <Input
            type="textarea"
            style="width: 80%;"
            size="mini"
            v-model="currentData.remark"
            placeholder="可选填" />
        </div>
      </div>
      <div class="switch">
        <div style="float: right">
          <Button
            v-show="currentData.editable"
            :autofocus="false"
            :disabled="!sort"
            :class="['saveButton',{'saveButton-active': !sort}]"
            size="small"
            :loading="isLoading"
            @click="save">
            保存
          </Button>
          <Button @click="back" style="background: #4A90E2;color: white" size="small">返回</Button>
        </div>
      </div>
    </div>
    <table class="scheme-table-header" >
      <tr>
        <th
          class="scheme-table-header-th"
          :width="th.width"
          v-for="(th, index) in tableTh"
          :key="index">
          <span>
            <span style="text-align: left;width: 80%">{{th.name}}</span>
          </span>
        </th>
      </tr>
    </table>
    <div
      id="draggableDiv"
      :class="{'draggableDiv': Draggable > 250}">
    <table class="scheme-table-header" style="margin-top: 0">
      <tr>
        <!--<th :width="th.width"   style="height: 30px;font-size: 14px;text-align: center" v-for="(th, index) in tableTh" :key="index"><span><span style="text-align: left;width: 80%">{{th.name}}</span></span></th>-->
      </tr>
      <tr
        v-for="(item, index) in base"
        class="base" >
        <td
          :width="td.width"
          v-if="index !== 5"
          :style="{color: idx === 4 ? (item.is_multi_org === '是' ? 'red' : '') : ''}"
          v-for="(td, idx) in tableTd"
          :key="idx" >
          {{item[td.name]}}
        </td>
        <!--这个td撑开一个空间不能删除-->
        <td></td>
      </tr>
    </table>
      <Draggable style="overflow: hidden" id="Draggable" class="scheme-table-body"
                 :options="Options"
                 element="table"
                 v-model="userDetail"
                 :move="onMove"
                 @update="datadragEnd"
                 @start="isDragging=true"
                 @end="onEnd">
        <tr
          v-for="(item, index) in userDetail"
          :class="[userDetail[index].is_notnull === true ? 'isNecessary' : 'noNecessary']"
          style="font-size:14px;"
          :key="index">
          <td
            v-for="(td, idx) in tableTd"
            :key="idx"
            v-if="idx === 0">
            <Input
              :class="[item.edit === true ? 'class1' : 'class2']"
              type="text"
              :disabled="item.edit"
              placeholder="添加名称"
              v-model="item[td.name]"/>
            <span :class="[item.edit ? 'class2' : 'class1']">
              <span>{{item[td.name]}}</span>
            </span>
          </td>
          <td
            v-for="(td, idx) in tableTd"
            :key="idx"
            v-if="idx === 1">
            <Select
              style="padding-left: 15px"
              :class="[item.edit === true ? 'class1' : 'class2']"
              v-model="item[td.name].id"
              placeholder="请选择">
              <Option
                v-for="items in field"
                :key="items.value"
                :label="items.label"
                :value="items.value">
              </Option>
            </Select>
            <span
              v-for="val in field"
              v-if="item[td.name].id === val.value"
              :class="[item.edit ? 'class2' : 'class1']">
              {{val.label}}
            </span>
          </td>
          <td
            v-for="(td, idx) in tableTd"
            :key="idx"
            v-if="idx === 2 ">
            <!--{{item[td.name]}}-->
            <div v-if="item.old && currentData.is_valid === 1">
              <Select
                size="mini"
                align="center"
                v-if="userDetail[index].col_type.id === 1"
                style="padding-left: 15px"
                :class="[item.editL === true ? 'class1' : 'class2']"
                v-model="item[td.name].id"
                placeholder="请选择">
                <Option
                  v-for="items in colWidths"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value">
                </Option>
              </Select>
              <span
                v-for="val in colWidths"
                v-if="val.value === item[td.name].id"
                :class="[item.editL ? 'class2' : 'class1']">
                <span  v-if="userDetail[index].col_type.id === 1 ">{{val.label}}</span>
              </span>
            </div>
            <div v-else="currentData.is_valid === 0">
              <Select
                size="mini"
                align="center"
                v-if="userDetail[index].col_type.id === 1"
                style="padding-left: 15px"
                :class="[item.edit === true ? 'class1' : 'class2']"
                v-model="item[td.name].id"
                placeholder="请选择">
                <Option
                  v-for="items in colWidths"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value">
                </Option>
              </Select>
              <span
                v-for="val in colWidths"
                v-if="val.value === item[td.name].id && userDetail[index].col_type.id === 1"
                :class="[item.edit ? 'class2' : 'class1']">
                {{val.label}}
              </span>
            </div>
          </td>
          <td
            v-for="(td, idx) in tableTd"
            :key="idx"
            v-if="idx === 3">
            <div :class="[item.edit === true ? 'class1' : 'class2']">
              <Radio v-model="item[td.name]" :label="true">是</Radio>
              <Radio v-model="item[td.name]" :label="false">否</Radio>
            </div>
            <span :class="[item.edit ? 'class2' : 'class1']">{{item[td.name] === true ? '是' : '否'}}</span>
            <div v-for="val in item[td.name]">
              <span></span>
            </div>
          </td>
          <td  v-for="(td, idx) in tableTd" :key="idx" v-if="idx === 4">
            <div :class="[item.edit === true ? 'class1' : 'class2']">
              <Radio v-model="item[td.name]" :label="true">是</Radio>
              <Radio v-model="item[td.name]" :label="false">否</Radio>
            </div>
            <span :class="[item.edit ? 'class2' : 'class1']">
              <span :style="{color: item[td.name] === true ? 'red' : '' }">{{item[td.name] === true ? '是' : '否'}}</span>
            </span>
            <div v-for="val in item[td.name]">
              <span></span>
            </div>
          </td>
          <td >
            <div
              v-show="currentData.editable"
              :class="[currentData.is_valid === 1 && item.old ? 'edit' : 'add']">
              <div :class="[item.editL ? 'class3' : 'class4']">
                  <Button
                    :class="['operator-button', {'add': item.col_type.id !== 1}]"
                    @click="editLength(index, item)"
                    :key="index"
                    size="small"
                    type="text">
                <i style="color: purple" :class="['el-icon-edit', {'editColor' : !isEdit}]" ></i>
              </Button>
              </div>
              <div :class="[item.editL ? 'class4' : 'class3']">
                <Button
                  class="operator-button"
                  @click="editSave2(index, item)"
                  :key="index" size="small"
                  type="text">
                  <i class="el-icon-check" ></i>
                </Button>
                <Button
                  v-show="changeIndex === 1"
                  class="operator-button"
                  @click="noSave(index)"
                  type="text" size="small">
                  <i class="el-icon-close"></i>
                </Button>
                <Button
                  v-show="changeIndex === 2"
                  class="operator-button"
                  @click="noSave(index)"
                  type="text"
                  size="small">
                  <i class="el-icon-close"  ></i>
                </Button>
              </div>
            </div>
            <div v-show="currentData.editable" :class="[{'add': currentData.is_valid === 1 && item.old}]">
              <div >
                <div :class="[item.edit ? 'class2' : 'class1']">
                  <Button
                    class="operator-button"
                    @click="edit(index, item)"
                    :key="index"
                    size="small"
                    type="text">
                    <i  :class="['el-icon-edit', {'editColor' : !isEdit}]" ></i>
                  </Button>
                  <Button
                    :class="['operator-button', {'add': item.is_multi_org === true}]"
                    type="text"
                    @click="deleteTr(index, item)"
                    size="small">
                    <i :class="['el-icon-delete', {'editColor' : !isEdit}]" ></i>
                  </Button>
                </div>
                <div :class="[item.edit ? 'class1' : 'class2']">
                  <Button
                    class="operator-button"
                    @click="editSave(index, item)"
                    :key="index"
                    size="small"
                    type="text">
                    <i class="el-icon-check" ></i>
                  </Button>
                  <Button
                    v-show="changeIndex === 1"
                    class="operator-button"
                    @click="noSave(index)"
                    type="text"
                    size="small">
                    <i class="el-icon-close"  ></i>
                  </Button>
                  <Button
                    v-show="changeIndex === 2"
                    class="operator-button"
                    @click="noSave(index)"
                    type="text"
                    size="small">
                    <i class="el-icon-close"  ></i>
                  </Button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      </Draggable>
    </div>
    <div style="width: 100%"></div>
    <div style="margin-top: 15px;text-align: center">
      <Button
        class="udss-edit-add"
        align="center"
        :disabled="!currentData.editable"
        @click="add">+添加自定义字段</Button>
    </div>
    <div class="templet">
      <span style="color: #9B9B9B; font-weight: bold;font-size:16px;">明细录入样式预览</span>
      <table class="table" cellspacing="0">
        <tr class="tr">
          <td border="1" class="td"  v-for="(item,index) in base"><span>*</span>{{item.display_text}}</td>
          <td border="1" class="td"  v-for="(item,index) in userDetail"><span v-if="userDetail[index].is_notnull === true">*</span>{{item.display_text}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import Draggable from 'vuedraggable'
  import { Button, Switch, Input, Radio, Select, Option, Message, MessageBox } from 'element-ui'
  import { TogglePage, ObjInstance } from '@/mixins'
  export default {
    name: 'EditUser',
    mixins: [ TogglePage, ObjInstance ],
    components: {
      Button, Input, SwitchS: Switch, Option, Draggable, Radio, Select, Message
    },
    data () {
      return {
        Draggable: '',
        base: [{'display_text': '指标名称', 'col_type': '文本', 'col_width': '适中', 'is_notnull': '是', 'is_multi_org': '是', 'edit': false}, {'display_text': '归属院系', 'col_type': '文本', 'col_width': '适中', 'is_notnull': '是', 'is_multi_org': '否', 'edit': false}, {'display_text': '数据年份', 'col_type': '日期（年）', 'col_width': '', 'is_notnull': '是', 'is_multi_org': '是', 'edit': false}],
        isLoading: false,
        options: [],
        isBack: true,
        itemVal: {},
        changeIndex: 1,
        isEdit: true,
        sort: true,
        tableTh: [
          {'name': '字段名称', 'width': ''},
          {'name': '字段类型', 'width': ''},
          {'name': '字段长度', 'width': ''},
          {'name': '是否必填', 'width': ''},
          {'name': '归属校验', 'width': ''},
          {'name': '操作', 'width': ''}],
        tableTd: [
          {'name': 'display_text', 'width': 100},
          {'name': 'col_type', 'width': 100},
          {'name': 'col_width', 'width': 100},
          {'name': 'is_notnull', 'width': 100},
          {'name': 'is_multi_org', 'width': 100}
        ],
        dissertation: '',
        mark: '',
        userDetail: []
      }
    },
    mounted () {
      this.Draggable = document.getElementById('Draggable').clientHeight
//      console.log(this.Draggable)
    },
    computed: {
      ...mapGetters('manageIndDetail', ['fieldType', 'postIndDetail', 'currentTargets']),
      fieldTypes () {
      },
      field () {
        let field = []
        field = this.fieldType.colTypes.map(item => {
          return {label: item.name, value: item.id}
        })
        return field
      },
      colWidths () {
        let colWidth = []
        colWidth = this.colWidth = this.fieldType.colWidths.map(item => {
          return {label: item.name, value: item.id, width: item.width_val}
        })
        return colWidth
      },
      currentData () {
        let a = this.currentTargets.fields.map(item => {
          item['edit'] = !item['edit']
          item.old = true
          item.editL = !item.editL
          return item
        })
        this.userDetail = a
//        console.log(this.currentTargets)
        return this.currentTargets
      },
      Options () {
        return {
          animation: 0,
          group: {
            name: 'description',
            pull: 'clone'
          },
          sort: this.sort,
          disabled: !this.sort,
          ghostClass: 'ghost',
          scroll: true,
          scrollFn: function (offsetX, offsetY, originalEvent, touchEvt, hoverTargetEl) {
          }
        }
      }
    },
    methods: {
      ...mapActions('manageIndDetail', ['postDetail', 'getFiledType', 'deleteDetailType']),
      add () {
        if (this.isEdit) {
          this.changeIndex = 2
          this.sort = !this.sort
          var s = {'display_text': '', 'col_type': {id: 1}, 'col_width': {id: 1}, 'is_notnull': true, 'is_multi_org': false, 'edit': false, 'old': false, 'editL': false}
          this.userDetail.push(s)
        }
        this.Draggable = document.getElementById('Draggable').clientHeight
        this.isEdit = false
        this.isBack = true
      },
      onMove ({relatedContext, draggedContext}) {
        return true
      },
      datadragEnd (val) {
      },
      onEnd (options) {
      },
      // 编辑td
      edit (index, val) {
        if (this.isEdit) {
          this.changeIndex = 1
          this.itemVal = JSON.parse(JSON.stringify(this.userDetail[index]))
          // 更改拖拽状态
          this.sort = !this.sort
          this.userDetail[index].edit = !this.userDetail[index].edit
//          console.log(this.userDetail[index].edit)
        }
        this.isEdit = false
      },
      editLength (index, val) {
        if (this.isEdit) {
          this.changeIndex = 1
          this.itemVal = JSON.parse(JSON.stringify(this.userDetail[index]))
          // 更改拖拽状态
          this.sort = !this.sort
          this.userDetail[index].editL = !this.userDetail[index].editL
//          console.log(this.userDetail[index].edit)
        }
        this.isEdit = false
      },
      // 保存编辑
      editSave (index, scope) {
        var reg = /^\s*$/g
        var repeat = this.userDetail.filter(item => {
          if (item.display_text === scope.display_text) {
            return item
          }
        })
        if (repeat.length > 1) {
          Message({
            message: `字段名称不可重复`,
            type: 'error'
          })
        } else if (scope.display_text.length === 0 || reg.test(scope.display_text)) {
          Message({
            message: `字段名称和字段类型不能为空`,
            type: 'error'
          })
        } else {
//          if (this.currentData.is_valid === 1) {
//            this.userDetail.forEach(item => {
//              if (item.old === true && item.is_multi_org === true) {
//                if (this.userDetail[index].is_multi_org === true) {
//                  Message({
//                    message: `发布状态下无法修改归属校验标记`,
//                    type: 'warning'
//                  })
//                  this.userDetail[index].is_multi_org = false
//                }
//              }
//            })
//          }
          this.userDetail[index].edit = !this.userDetail[index].edit
          this.sort = !this.sort
          this.isEdit = true
        }
      },
      editSave2 (index) {
        this.userDetail[index].editL = !this.userDetail[index].editL
        this.sort = !this.sort
        this.isEdit = true
      },
      // 不保存
      noSave (index) {
        this.isEdit = true
        this.sort = !this.sort
        if (this.changeIndex === 1) {
          this.userDetail[index].edit = !this.userDetail[index].edit
          this.userDetail[index] = this.itemVal
        } else if (this.changeIndex === 2) {
          this.userDetail.splice(index, 1)
        }
      },
      // 删除行
      deleteTr (index, val) {
        if (val.old === true) {
          MessageBox.confirm('此操作将永久删除该字段, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let data = {typeId: this.currentData.id, id: val.id}
            new Promise((resolve, reject) => {
              this.deleteDetailType({payload: data, resolve, reject})
            }).then(() => {
              Message({
                type: 'success',
                message: '删除成功!'
              })
              this.userDetail.splice(index, 1)
            })
          }).catch(() => {
            Message({
              type: 'info',
              message: '已取消删除'
            })
          })
        } else {
          MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Message({
              type: 'success',
              message: '删除成功!'
            })
            this.userDetail.splice(index, 1)
          }).catch(() => {
            Message({
              type: 'info',
              message: '已取消删除'
            })
          })
        }
      },
      save () {
        this.isLoading = true
        var reg = /^\s*$/g
        var length = this.userDetail.filter(obj => obj.is_multi_org === true)
        if (this.currentData.name.length === 0 || reg.test(this.currentData.name)) {
          Message({
            message: `指标名称不能为空`,
            type: 'error'
          })
          this.isLoading = false
        } else if (this.userDetail.length === 0) {
          Message({
            message: `请添加自定义字段`,
            type: 'error'
          })
          this.isLoading = false
        } else if (length.length === 0) {
          Message({
            message: `归属校验至少有一个`,
            type: 'error'
          })
          this.isLoading = false
        } else {
          var field = JSON.parse(JSON.stringify(this.userDetail)).map(item => {
            return {
              'id': item.id,
              'display_text': item.display_text,
              'col_type': {id: item.col_type.id},
              'col_width': {id: item.col_width.id},
              'is_notnull': item.is_notnull,
              'is_multi_org': item.is_multi_org
            }
          })
          new Promise((resolve, reject) => {
            this.postDetail({payload: {id: this.currentData.id, name: this.currentData.name, remark: this.currentData.remark, fields: JSON.stringify(field)}, resolve, reject})
          }).then((data) => {
            var ids = data.ids
            this.userDetail.forEach((item, index) => {
              item.old = true
              item.editL = true
              item.id = ids[index]
            })
            this.isLoading = false
            this.isBack = false
          }).catch(() => {
            this.isLoading = false
          })
        }
      },
      back () {
        if (this.isBack) {
          if (this.userDetail.length > this.currentTargets.fields.length) {
            MessageBox.confirm('文件尚未保存, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.togglePage('Detail')
            }).catch(() => {
            })
          } else {
            this.togglePage('Detail')
          }
        } else {
          this.togglePage('Detail')
        }
      }
    }
  }
</script>

<style scoped>
  .widt{
    width: calc(100% - 10px);
  }
  #container{
    height:100%;
  }
  .edit{
    display: block;
  }
  .table{
    width: 100%;
    margin-top: 15px;
    background: #9B9B9B;
    color: white;
  }
  .tr{
    margin: 0 auto;
    width: 100%;
    text-align: center;
  }
  .td{
    padding: 5px 10px;
    font-size:14px;
    text-align: center;
    border-left: 1px solid;
  }
  .base{
    text-align: center;
    background: #B4FCF2;
    font-weight: bold;
    color: #1EBBA6;
    font-size:14px;
    border-bottom: 1px solid #EBEEF5;
    height: 36px;
  }
  #container{
    height: 100%;
    margin: 0 auto;
    padding: 0 70px;
    overflow-y:scroll
  }
  .udss-input{
    display: flex;flex-flow: row;justify-content: space-between
  }
  .switch{
    overflow: hidden;
  }
  .beizhu{
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
  }
.beizhu span {
  float: left;
  font-size:14px;
  color: #5D5D5E
}
  .templet{
    margin: 0 auto;
    margin-top: 50px;
  }
  #draggableDiv::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  #draggableDiv::-webkit-scrollbar-track { /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px #ffffff;
    border-radius: 0;
    background: #ffffff;
  }

  .scheme-table-header{
    overflow: hidden;
    margin-top: 15px;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-header-th{
    height: 30px;
    font-size: 14px;
    text-align: center
  }
  .scheme-table-header tr th:nth-child(1) {
    /*padding-left: 20px;*/
    text-align: center;
  }
  .field-input{
    width: 60%;
    margin-top: 15px;
  }
  .scheme-table-header th{
    height: 50px;
    background-color: #1EBBA6;
    color: #ffffff;
  }
  .scheme-table-body{
    color: #606266;
    table-layout: fixed;
    width: 100%;
    overflow-y: auto;
    border-collapse: collapse;
  }
  .scheme-table-body td{
    height: 30px;
    border-bottom: solid 1px #EBEEF5;
    text-align: center;
    word-break: break-all;
  }
  .scheme-table-body td:nth-child(1){
    /*padding-left: 40px;*/
  }
  .scheme-table-body tr:nth-child(even) {
    background-color: #F7F7F7;
  }
  .scheme-table-body tr td:nth-child(1) {
    text-align: center;
  }
  #draggableDiv{
    text-overflow:ellipsis;
    width: auto;
    scrollbar-base-color: transparent;
    scrollbar-darkshadow-color: transparent;
    scrollbar-highlight-color: transparent;
    scrollbar-face-color: transparent;
  }
  .draggableDiv{
    width: 100%;
    height: calc(50% + 20px);
    overflow: hidden;
    overflow-y: auto;
  }
  .class1{
    display: none;
  }
  .class3{
    display: block;
    width: 70%;
    text-align: center;
    margin: 0 auto;
  }
  .class4{
    display: none;
  }
  .class2{
    display: block;
    width: 70%;
    text-align: center;
    margin: 0 auto;
  }
  .isNecessary{
    font-weight: bold;
    font-size:16px;
    color: #1EBBA6
  }
  .noNecessary{
    /*font-weight: normal;*/
  }
  .el-icon-edit,.el-icon-delete,.el-icon-check,.el-icon-close {
    font-size:16px;
  }
  .el-icon-edit2{
    font-size:16px;
    color: purple;
  }
  .editColor{
    color: lightslategray;
  }
  .saveButton{
    background: #1EBBA6;
    color: white
  }
  .add{
    display: none;
  }
  .saveButton-active{
    background: gray;
    color: white;
  }
  .udss-edit-add{
    text-align: center;
    margin: 0 auto;
    cursor: pointer;
    color: #90A4FF;
    font-size: 15px;
  }
  .template{
    font-size: 14px;
    box-sizing: border-box;
    /*border: 1px solid;*/
  }
</style>
