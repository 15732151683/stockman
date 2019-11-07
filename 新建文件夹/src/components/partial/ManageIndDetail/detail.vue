<template>
  <div id="loadings2">
    <div class="search-input">
      <Input
        class="input"
        suffix-icon="el-icon-search"
        @keyup.enter.native="searchKey"
        size="small"
        v-model="keyWord" @blur="searchKey"  placeholder="请输入关键字"  />
      <Button
        @click="creat"
        type="primary"
        icon="el-icon-plus"
        size="mini"
        style="float: none; margin-left: 10px"
        class="button-add"
        v-hasPermission="'w'"
      > 新建</Button>
    </div>

    <div class="ManageIndDetail" id="ManageIndDetail" >
      <Table

        style="margin-top: 20px; text-align: center;overflow: hidden"
        :data="indDetail"
        max-height="600"
        :header-cell-style="{
          'background-color': '#1EBBA6',
          'color': 'white',
          'padding':'3px',
          'height': '12px'}"
        :cell-style="{'padding': '5px'}"
      >
        <TableColumn align="center" width="80px" type="index"  label="序号">
          <template slot-scope="scope">
            {{scope.$index + 1 + (size * yema)}}
          </template>
        </TableColumn>
        <TableColumn align="left" :show-overflow-tooltip="true" prop="name" width="180px" label="明细类别名称"></TableColumn>
        <TableColumn align="center" :show-overflow-tooltip="true" prop="remark" width="" label="备注">
          <template slot-scope="scope">
            {{scope.row.remark ? scope.row.remark : ''}}
          </template>
        </TableColumn>
        <TableColumn align="center"  prop="refIndList"  label="引用指标">
          <template slot-scope="scope">
            <Popover placement="right"
                     trigger="hover">
              <h4 style="margin-bottom: 5px">引用指标名称</h4>
              <div v-if="scope.row.refIndList.length === 0">暂无引用</div>
              <div style="padding: 2px 0px 2px 10px" v-if="scope.row.refIndList.length !== 0" v-for="item in scope.row.refIndList">
                <span>{{item}}</span>
              </div>
              <Button  class="refIndList" style="display: inline-block;outline: none;border: none" slot="reference">
                {{fieldLength[scope.$index]}}
              </Button>

            </Popover>
          </template>
        </TableColumn>
        <TableColumn align="center" prop="is_valid"  :filters="[{ text: '已发布', value: 1 }, { text: '未发布', value: 0}]" :filter-method="filterHandler" label="状态">
          <template slot-scope="scope" >
            <Switches
              :title="scope.row.editable ? '' : '只能查看其他人设置'"
              :disabled="editSave"
              v-show="!scope.row.referenced && scope.row.editable"
              @click.native="changeSwitch(scope.row)"
              v-model="scope.row.is_valid"
              active-text="已发布"
              inactive-text="未发布"
              :active-value=1
              :inactive-value=0
            ></Switches>
            <span>
                <span v-show="scope.row.referenced">已引用</span>
                <span v-show="!scope.row.editable">
                  <span v-show="!scope.row.referenced">
                  <span v-if="scope.row.is_valid === 1">已发布</span>
                  <span v-if="scope.row.is_valid === 0">未发布</span>
                </span>
                </span>
              </span>
          </template>
        </TableColumn>
        <TableColumn align="center" width="100px" label="操作">
          <template slot-scope="{ row }">
            <!--{{row.referenced}}-->
            <Button type="text" @click="view(row)" style="" v-if="row.is_valid === 1">
              <i class="el-icon-view size" ></i>
            </Button>
            <Button type="text" v-show="row.is_valid !== 1" @click="edit(row)" size="small">
              <i  class="el-icon-edit size" ></i>
            </Button>
            <Button type="text" :class="{'publish': row.is_valid === 1}" :disabled="row.is_valid === 1" style="margin-left: 10px" @click="deleteInd(row.id)" size="small">
              <i  class="el-icon-delete size" ></i>
            </Button>
          </template>
        </TableColumn>
      </Table>
    </div>
    <div class="block" style="display: flex;flex-flow: row;justify-content: center">
      <Pagination
        style="margin-top: 30px"
        background
        @size-change="handleSizeChange"
        @current-change="changPage"
        :current-page.sync="page"
        :page-sizes="pageSize"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="manageIndDetail.count">
      </Pagination>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'
  import { Button, Pagination, Input, TableColumn, Table, MessageBox, Message, Popover, Switch, Tooltip } from 'element-ui'
  import { TogglePage, ObjInstance } from '@/mixins'
  export default {
    name: 'EditUser',
    mixins: [ TogglePage, ObjInstance ],
    components: {
      Button, Input, Pagination, Table, TableColumn, Option, MessageBox, Message, Switches: Switch, Popover, Tooltip
    },
    data () {
      return {
        ManageIndDetail: '',
        editSave: false,
        keyWord: '',
        pageSize: [8, 10, 20],
        title: '',
        current: 0,
        size: 10,
        page: 0,
        tableColum: {},
        yema: 0
      }
    },
    props: ['row'],
    mounted () {
      this.getFiledType()
      this.yema = this.currentPage.yema
      this.size = this.currentPage.size
      this.page = this.yema + 1
      this.$nextTick(function () {
        this.getDetail({'search': '', 'page': this.yema, 'size': this.size})
//      :class="{'contentDiv': ManageIndDetail > 250}"
//        this.ManageIndDetail = document.getElementById('ManageIndDetail').clientHeight
//        new Promise((resolve, reject) => {
//          this.getDetail({payload: {'search': '', 'page': this.yema, 'size': this.size}, resolve, reject})
//        }).then(() => {
//        })
      })
    },
    computed: {
      ...mapGetters('manageIndDetail', ['manageIndDetail', 'fieldType', 'currentPage']),
      // 文本类型字段
      fieldTypes () {
        let a = []
        a = this.fieldType.colTypes.map(item => {
          return {label: item.name, value: item.id}
        })
        return a
      },
      // 文本长度字段
      colWidth () {
        let col = this.fieldType.colWidths.map(item => {
          return {label: item.name, value: item.id, width: item.width_val}
        })
        return col
      },
      // 总数据
      indDetail () {
        let data = []
        data = this.manageIndDetail.list
        return data
      },
      fieldLength () {
        let f = []
        if (this.manageIndDetail.list === null) {
          f = 0
        } else if (this.manageIndDetail.list) {
          f = this.manageIndDetail.list.map(item => {
            return item.refIndList.length
          })
        }
        return f
      },
      currentPages () {
        let arr = 0
        arr = this.currentPage
        return arr
      }
    },
    methods: {
      ...mapActions('manageIndDetail', ['getDetail', 'getFiledType', 'deleteDetail', 'activeState']),
      ...mapMutations('manageIndDetail', ['currentTarget', 'currentpage']),
      // 筛选发布未发布
      filterHandler (value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      // 改变条/页
      handleSizeChange (val) {
        this.size = val
        this.getDetail({'search': this.keyWord, 'page': this.yema, 'size': val})
      },
      changPage (val) {
        this.yema = val - 1
        this.getDetail({'search': this.keyWord, 'page': val - 1, 'size': this.size})
      },
      // 新建
      creat () {
        let arr = {yema: this.yema, size: this.size}
        this.currentpage(arr)
        this.togglePage('Add')
      },
      // 编辑
      edit (row) {
        var s = row || []
        this.currentTarget(s)
        let arr = {yema: this.yema, size: this.size}
        this.currentpage(arr)
        this.togglePage('Edit')
      },
      changeSwitch (val) {
        let data = {id: val.id, isValid: val.is_valid - 0}
        if (val.editable) {
          if (this.editSave === false) {
            new Promise((resolve, reject) => {
              this.editSave = true
//            console.log(this.editSave)
              this.activeState({payload: data, resolve, reject})
            }).then(() => {
              this.editSave = false
            }).catch(() => {
              val.is_valid = 0
              if (val.isValid === 1) {
                val.is_valid = 0
              }
              if (val.isValid === 0) {
                val.is_valid = 1
              }
              this.editSave = false
            })
          }
        }
      },
      // 删除
      deleteInd (val) {
        MessageBox.confirm('此操作将永久删除该明细, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.deleteDetail({payload: val, resolve, reject})
          }).then(() => {
            this.manageIndDetail.list = this.manageIndDetail.list.filter(item => {
              return item.id !== val
            })
            this.manageIndDetail.count = this.manageIndDetail.count - 1
            if (this.indDetail.length === 0) {
              this.yema = this.yema - 1
              this.getDetail({'search': this.keyWord, 'page': this.yema, 'size': this.size})
            } else {
              this.getDetail({'search': this.keyWord, 'page': this.yema, 'size': this.size})
            }
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 查看
      view (val) {
        this.currentTarget(val)
        let arr = {yema: this.yema, size: this.size}
        this.currentpage(arr)
        this.togglePage('Edit')
      },
      searchKey () {
        this.getDetail({'search': this.keyWord, 'page': '', 'size': this.size})
        this.yema = 0
      },
      clearChange () {
        this.yema = 0
        this.getDetail({'search': '', 'page': this.yema, 'size': this.size})
      }
    },
    watch: {
      manageIndDetail () {
      }
    }
  }
</script>

<style scoped>
  #loadings2{
    height: 100%;
    overflow-y:scroll
  }
  .search-input{
    width: 450px;
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    align-items: center;
  }
  .role-select {
    width: 100%;
  }
  .size{
    font-size:16px;
  }
  .publish{
    display: none;
  }
  .contentDiv{
    height: calc(50% + 20px);
    overflow: hidden;
    overflow-y: auto;
  }
</style>
