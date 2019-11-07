<template>
  <div class="input-box">
    <Button
      v-if="!hidden"
      :disabled="currentInd.ind_type_id === 2"
      type="primary"
      size="mini"
      style="margin-left: 20px; background-color: #4A90E2; float: none; padding: 10px 15px;"
      class="button-add"
      @click="handleInputData">录入指标数据</Button>
    <!--数据录入弹框-->
    <Dialog
      width="1000px"
      :visible.sync="inputDialogVisible"
      :show-close="false"
      :close-on-click-modal="false">
      <div class="input-table-box ind-table inner-table">
        <div class="input-dialog-top">
          <span>录入指标名称：{{this.currentInd.name}}</span><span>单位：{{this.currentInd.unit.name}}</span>
        </div>
        <Table
          :data="cloneTabData"
          style="width: 100%"
          height="100%"
          :row-class-name="tableRowClassName">
          <TableColumn
            :fixed="thId === 0"
            :label="th.name"
            :min-width="th.width"
            v-for="(th, thId) in dialogTabThs"
            :align="thId === 0 ? 'left': 'center'"
            :key="thId">
            <template slot-scope="scope">
              <div v-if="thId === 0" class="input-table-td">
                <span>{{ scope.row[th.index] }}</span>
              </div>
              <div v-else class="input-table-td">
                <input :class="[{'redBorder': scope.row[th.index].remark}]" @change="valueChange(scope.row[th.index], scope.row.id)" type="text" v-model="scope.row[th.index].ind_val" class="input-table-input">
              </div>
            </template>
          </TableColumn>
        </Table>
      </div>
      <div slot="footer" class="input-dialog-footer">
        <Button
          class="button-close"
          type="primary"
          size="small"
          style="float: left; background-color: #9B9B9B;"
          @click="initAllData">空值补零</Button>
        <Button
          class="button-confirm"
          type="primary"
          size="small"
          style="background-color: #3090E9;"
          :loading="indSaveLoading"
          @click="confirmInputData">确 定</Button>
        <Button
          class="button-close"
          type="primary"
          size="small"
          @click="inputDialogVisible = false">{{$t('element.buttonClose')}}</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { Dialog, Button, TableColumn, Table } from 'element-ui'
  import {mapActions} from 'vuex'
  export default {
    name: 'InputData',
    components: {
      Dialog, Button, TableColumn, Table
    },
    data () {
      return {
        dialogTabThs: [],
        cloneTabData: [],
        orgDatas: [],
        indSaveLoading: false,
        inputDialogVisible: false
      }
    },
    props: {
      currentInd: {
        default: {}
      },
      yearRange: {
        default: ''
      },
      hidden: {
        default: false
      },
      currentTask: {
        default: {}
      },
      tabThs: {
        default: []
      },
      tabData: {
        default: []
      }
    },
    methods: {
      ...mapActions('write', ['updateDataByInd']),
      // table样式
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      clone (obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      handleInputData () {
        this.orgDatas = []
        this.inputDialogVisible = true
        if (this.currentInd.unit.id === 10 || this.currentInd.unit.id === 23) {
          this.dialogTabThs = this.clone(this.tabThs)
          this.cloneTabData = this.clone(this.tabData)
        } else {
          this.dialogTabThs = this.clone(this.tabThs)
          this.dialogTabThs.splice(1, 1)
          this.cloneTabData = this.clone(this.tabData).slice(1)
        }
      },
      confirmInputData () {
        if (this.orgDatas.length === 0) {
          this.inputDialogVisible = false
        } else {
          return new Promise((resolve, reject) => {
            this.indSaveLoading = true
            let payload = {
              'orgDatas': this.orgDatas,
              'id': 1,
              'indId': this.currentInd.id,
              'taskId': this.currentTask.id
            }
            this.updateDataByInd({payload, resolve, reject})
          }).then((res) => {
            // 数据录入后处理逻辑
            this.$emit('updateData', res)
            // res.forEach(node => {
            //   if (node.ind_val === -25535) {
            //     node.ind_val = ''
            //   } else {
            //     node.ind_val = this.precisionNum(node.ind_val)
            //   }
            //   let error = this.errorList.find(err => err.id === node.ind_id)
            //   if (error) {
            //     if (error.data.findIndex(err => err.id === node.ind_data_id) < 0) {
            //       this.$set(node, 'remark', false)
            //     } else {
            //       this.$set(node, 'remark', true)
            //     }
            //   }
            //   this.tabData.find(item => item.id === node.org_id)[node.year] = node
            // })
            this.inputDialogVisible = false
            this.indSaveLoading = false
            this.cloneTabData = []
          }).catch(() => {
            this.indSaveLoading = false
          })
        }
      },
      // 指标输入框值改变触发
      valueChange (value, row) {
        let orgId = row
        let val = value.ind_val ? Number(value.ind_val) : -25535
        let year = value.year
        let dataId = value.ind_data_id ? Number(value.ind_data_id) : -25535
        if (this.orgDatas.length > 0) {
          let index = this.orgDatas.findIndex(node => node.year === year && node.org_id === orgId)
          index < 0 ? this.orgDatas.push({'org_id': orgId, 'ind_val': val, year, 'ind_data_id': dataId}) : this.orgDatas[index].ind_val = val
        } else {
          this.orgDatas.push({'org_id': orgId, 'ind_val': val, year, 'ind_data_id': dataId})
        }
      },
      // 空值补零
      initAllData () {
        let reg = /^0/
        this.cloneTabData.forEach(node => {
          Object.keys(node).forEach(key => {
            let obj = node[key]
            if (typeof obj === 'object') {
              if (!obj.ind_val && !reg.test(obj.ind_val)) {
                obj.ind_val = '0'
                let index = this.orgDatas.findIndex(node => node.year === obj.year && node.org_id === obj.org_id)
                let dataId = obj.ind_data_id ? obj.ind_data_id : -25535
                index < 0 ? this.orgDatas.push({'org_id': obj.org_id, 'ind_val': 0, 'year': obj.year, 'ind_data_id': dataId}) : this.orgDatas[index].ind_val = 0
              }
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
  .input-box {
    display: inline-block;
  }
  .input-table-box{
    margin: 20px 30px;
    height: 600px;
  }
  .input-dialog-top{
    font-size: 18px;
    color: #000;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .input-dialog-top span{
    margin-right: 20px;
  }
  .input-dialog-footer{
    margin-top: 20px;
  }
  .input-table-td {
    color: #000000;
  }
  .input-table-td span{
    display: inline-block;
  }
  .input-table-input{
    width: 95%;
    height: 28px;
    border: solid 1px #ECECEC;
    outline: none;
    text-align: center;
  }
  .redBorder {
    border-color: #D96A49;
  }
</style>
