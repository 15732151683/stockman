<template>
    <div id="container" >
      <div class="udss-input">
        <div class="field-input">
          <div class="udss-remark">
            <span >名称：</span>
            <Input
              clearable
              style="width: 80%;"
              size="mini"
              v-model="dissertation"
              placeholder="明细类别名称，必填项" />
          </div>
          <div class="udss-remark" style="margin-top: 10px; align-items: flex-start">
            <span >备注：</span>
            <Input
              type="textarea"
              clearable style="width: 80%;"
              size="mini" v-model="mark"
              placeholder="可选填" />
          </div>
        </div>
        <div class="switch">
          <div style="float: right">
            <Button
              :autofocus="false"
              :loading="isLoading"
              :disabled="!sort"
              :class="['saveButton',{'saveButton-active': !sort}]"
              size="small"
              @click="save">保存</Button>
            <Button
              class="udss-add-back"
              @click="back"
              size="small">返回</Button>
          </div>
        </div>
      </div>
      <table class="scheme-table-header">
        <tr>
          <th
            :width="th.width"
            style="height: 30px;font-size: 14px;"
            v-for="(th, index) in tableTh"
            :key="index">
            <span>{{th.name}}</span>
          </th>
        </tr>
      </table>
      <div id="draggableDiv" style="width: 100%" :class="{'draggableDiv': Draggable > 250}">
        <table class="scheme-table-header0">
        <tr>
          <!--<th :width="th.width" style="height: 30px;font-size: 14px;" v-for="(th, index) in tableTh" :key="index"><span>{{th.name}}</span></th>-->
        </tr>
        <tr
          v-for="(item, index) in base"
          class="udss-table-base" >
          <td
            :width="td.width"
            v-for="(td, idx) in tableTd"
            :key="idx" >
            <span :style="{color: idx === 4 ? (item.is_multi_org === '是' ? 'red' : '') : ''}">{{item[td.name]}}</span>
          </td>
          <td></td>
        </tr>
      </table>
        <Draggable id="Draggable" class="scheme-table-body"
                   :options="Options"
                   element="table"
                   v-model="userDetail"
                   :move="onMove"
                   @update="datadragEnd"
                   @start="isDragging=true"
                   @end="onEnd">
          <tr
            v-for="(item, index) in userDetail"
            style="font-size:14px;"
            :key="index"
            :class="[userDetail[index].is_notnull === true ? 'isNecessary' : 'noNecessary']">
            <td
              style="text-align: center"
              v-for="(td, idx) in tableTd"
              :key="idx"
              v-if="idx === 0">
              <Input
                :class="[item.edit === true ? 'class1' : 'class2']"
                type="text"
                :disabled="item.edit"
                placeholder="添加名称"
                v-model="item[td.name]" />
              <span
                :class="[item.edit ? 'class2' : 'class1']">
                <span style="text-align: left">{{item[td.name]}}</span>
              </span>
            </td>
            <td
              v-for="(td, idx) in tableTd"
              :key="idx"
              v-if="idx === 1">
              <Select
                style="padding-left: 15px"
                :class="[item.edit === true ? 'class1' : 'class2']"
                v-model="item[td.name]"
                placeholder="请选择">
                <Option
                  v-for="items in fieldTypes"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value">
                </Option>
              </Select>
              <span
                v-for="val in fieldTypes"
                v-if="item[td.name] === val.value"
                :class="[item.edit ? 'class2' : 'class1']">{{val.label}}</span>
            </td>
            <td
              v-for="(td, idx) in tableTd"
              :key="idx"
              v-if="idx === 2">
              <Select v-if="userDetail[index].col_type === 1" style="padding-left: 15px"  :class="[item.edit === true ? 'class1' : 'class2']" v-model="item[td.name]" placeholder="请选择">
                <Option
                  v-for="items in colWidth"
                  :key="items.value"
                  :label="items.label"
                  :value="items.value">
                </Option>
              </Select>
              <span
                v-for="val in colWidth"
                v-if="item[td.name] === val.value"
                :class="[item.edit ? 'class2' : 'class1']">
                <span v-if="userDetail[index].col_type === 1">{{val.label}}</span>
              </span>
            </td>
            <td
              v-for="(td, idx) in tableTd"
              :key="idx" v-if="idx === 3">
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
                <span :style="{color: item[td.name] === true ? 'red' : '' }">
                  {{item[td.name] === true ? '是' : '否'}}
                </span>
              </span>
              <div v-for="val in item[td.name]">
                <span></span>
              </div>
            </td>
            <td >
              <div
                :class="[item.edit ? 'class2' : 'class1']">
                <Button
                  class="operator-button"
                  @click="edit(index, item)"
                  :key="index" size="small"
                  type="text">
                  <i :class="['el-icon-edit', {'editColor' : !isEdit}]" ></i>
                </Button>
                <Button
                  class="operator-button"
                  type="text"
                  @click="deleteTr(index)"
                  size="small">
                  <i :class="['el-icon-delete', {'editColor' : !isEdit}, {'add': item.is_multi_org === true}]" ></i>
                </Button>
              </div>
              <div :class="[item.edit ? 'class1' : 'class2']">
                <Button
                  class="operator-button"
                  @click="editSave(index, item)"
                  :key="index" size="small"
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
            </td>
          </tr>
        </Draggable>
      </div>
      <div style="margin-top: 15px">
        <div class="udss-add-button" @click="add">+添加自定义字段</div>
      </div>
      <div class="templet">
        <span class="udss-add-preview">明细录入样式预览</span>
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
        itemVal: {},
        changeIndex: 1,
        itemValSave: false,
        isEdit: true,
        sort: true,
        radio: 1,
        tableTh: [{'name': '字段名称', 'width': ''},
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
        title: '指标详情',
        userDetail: []
//        isBack: true
      }
    },
    mounted () {
//      this.getFiledType()
    },
    watch: {
    },
    computed: {
      ...mapGetters('manageIndDetail', ['fieldType', 'postIndDetail']),
      fieldTypes () {
//        console.log(this.fieldType.colTypes)
        return this.fieldType.colTypes.map(item => {
          return {label: item.name, value: item.id}
        })
      },
      colWidth () {
//        console.log(this.fieldType.colWidths)
        return this.fieldType.colWidths.map(item => {
          return {label: item.name, value: item.id, width: item.width_val}
        })
      },
      Options () {
        return {
          animation: 0,
          group: {
            name: 'description',
            pull: 'clone'
          },
          scroll: true,
          sort: this.sort,
          disabled: !this.sort,
          ghostClass: 'ghost'
        }
      }
    },
    methods: {
      ...mapActions('manageIndDetail', ['postDetail', 'getFiledType']),
      add () {
        if (this.isEdit) {
          this.changeIndex = 2
          this.sort = !this.sort
          var s = {'display_text': '', 'col_type': 1, 'col_width': 2, 'is_notnull': true, 'is_multi_org': false, 'edit': false}
          this.userDetail.push(s)
        }
        this.isEdit = false
        this.Draggable = document.getElementById('Draggable').clientHeight
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
        }
        this.isEdit = false
//        if (this.divHeight === 295) {
//        }
      },
      // 保存编辑
      editSave (index, scope) {
        var reg = /^\s*$/g
        var repeat = this.userDetail.filter(item => {
          if (item.display_text === scope.display_text) {
            return item
          }
        })
        var ascription = this.userDetail.filter(item => {
          return item.is_multi_org === true
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
        } else if (ascription.length < 1) {
          Message({
            message: `归属校验至少有一个`,
            type: 'error'
          })
        } else {
          this.userDetail[index].edit = !this.userDetail[index].edit
          this.sort = !this.sort
          this.isEdit = true
        }
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
      deleteTr (index) {
        if (this.isEdit) {
          MessageBox.confirm('是否删除', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.userDetail.splice(index, 1)
            Message({
              type: 'success',
              message: '删除成功!'
            })
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
//        console.log(length.length)
        if (this.dissertation.length === 0 || reg.test(this.dissertation)) {
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
              'display_text': item.display_text,
              'col_type': {id: item.col_type},
              'col_width': {id: item.col_width},
              'is_notnull': item.is_notnull,
              'is_multi_org': item.is_multi_org
            }
          })
          new Promise((resolve, reject) => {
            this.postDetail({payload: {name: this.dissertation, remark: this.mark, fields: JSON.stringify(field)}, resolve, reject})
          }).then(() => {
            this.isLoading = false
            this.togglePage('Detail')
          }).catch(() => {
            this.isLoading = false
          })
        }
      },
      back () {
        if (this.userDetail.length > 0) {
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
      }
    }
  }
</script>

<style scoped>
  .add{
    display: none;
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
  #container{
    height: 100%;
    margin: 0 auto;
    padding: 0 100px;
    overflow-y:scroll
  }
  .switch{
    overflow: hidden;
  }
  .udss-input{
    display: flex;
    flex-flow: row;
    justify-content: space-between
  }
   .name{
    display: flex;
     flex-flow: row;
     justify-content: flex-start;
     align-items: center
  }
  .name{
    color: #727375;
  }
  .udss-remark{
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
  }
  .udss-remark span{
    float: left;
    font-size:14px;
    color: #5D5D5E
  }
  .templet{
    margin-top: 50px;
  }
  .udss-add-back{
    background: #4A90E2;
    color: white
  }
  .isNecessary{
    font-weight: bold;
    font-size:20px;
    color: #1EBBA6
  }
  .noNecessary{
  }
  .draggableDiv{
    height: calc(50% + 20px);
    overflow: hidden;
    overflow-y: auto;
  }
  .udss-table-base{
    font-weight: bold;
    color: #1EBBA6;
    font-size:14px;
    border-bottom: 1px solid #EBEEF5;
    height: 36px;
    text-align: center;
    background: #B4FCF2
  }
  .scheme-table-header, .scheme-table-header0{
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-header{
    margin-top: 15px;
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
    height: 10%;
    overflow: hidden;
    overflow-y: scroll;
    color: #606266;
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
  }
  .scheme-table-body td{
    height: 30px;
    border-bottom: solid 1px #EBEEF5;
    /*color: #606266;*/
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
  .class1{
    display: none;
  }
  .class2{
    display: block;
    /*margin-left: 3px;*/
    /*color: red;*/
  }
  .udss-add-button{
    text-align: center;
    cursor: pointer;
    color: #90A4FF;
    font-size: 15px;
  }
  .udss-add-preview{
    color: #9B9B9B;
    font-weight: bold;
    font-size:20px;
  }
  .el-icon-edit,.el-icon-delete,.el-icon-check,.el-icon-close {
    font-size:16px;
  }
  .editColor{
    color: lightslategray;
  }
  .saveButton{
    background: #1EBBA6;
    color: white
  }
  .saveButton-active{
    background: gray;
    color: white;
  }
</style>
