<template>
  <div class="data-table-container ind-table" v-if="tabThs.length > 0">
    <Table :data="tabData" style="width: 100%" height="100%" :row-class-name="tableRowClassName">
      <TableColumn
        :fixed="thId === 0"
        :label="th.name"
        :min-width="th.width"
        v-for="(th, thId) in tabThs"
        :align="thId === 0 ? 'left': 'center'"
        :key="thId">
        <template slot-scope="scope">
          <template v-if="currentInd.unit.id !== 10 && currentInd.unit.id !== 23 && scope.$index === 0">
            <div v-if="thId === 0" class="data-table-td">
              <span style="font-weight: bold;">{{ scope.row[th.index] }}</span>
            </div>
            <div v-else-if="thId === 1" class="data-table-td">
              <span class="data-total-style">
                {{ scope.row[th.index].year ?  scope.row[th.index].ind_val : scope.row[th.index] }}
              </span>
            </div>
            <div v-else :class="['data-table-td', {'table-td-right': currentInd.has_detail}, 'data-total-style']">
              <span class="data-left-icon" v-if="currentInd.mark">&nbsp;</span>
              <span>{{ scope.row[th.index].ind_val }}</span>
              <span class="menu-icon-box" v-if="currentInd.has_detail" style="margin-left: 10px;">
                <i @click="handleAllDetail(scope.row[th.index], th.index)"
                   class="data-menu-icon"
                   v-show="scope.row[th.index].ind_val">
                </i>
              </span>
            </div>
          </template>
          <template v-else>
            <div v-if="thId === 0" class="data-table-td">
              <span>{{ scope.row[th.index] }}</span>
            </div>
            <template v-else-if="currentInd.unit.id === 10 || currentInd.unit.id === 23">
              <div :class="['data-table-td', {'table-td-right': currentInd.has_detail}]">
                <span v-if="currentInd.mark"
                      :title="scope.row[th.index].text"
                      :class="['data-left-icon', {'data-error-img': scope.row[th.index].remark}]"
                      @click="handleIconReMark(scope.row[th.index])">
                  &nbsp;
                </span>
                <span v-if="onlyRead || disabled"
                  :class="['table-center-span', {'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}]"
                  :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                  <template v-if="currentInd.unit.id === 10">
                    {{ precisionPercentNum(scope.row[th.index].ind_val) }}
                  </template>
                  <template v-else>
                    {{scope.row[th.index].ind_val}}
                  </template>
                </span>
                <span v-else @click="handleRemark(scope.row[th.index])"
                      :class="['table-center-box', {'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}, {'table-center-error': scope.row[th.index].remark}]"
                      :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                  <template v-if="currentInd.unit.id === 10">
                    {{ precisionPercentNum(scope.row[th.index].ind_val) }}
                  </template>
                  <template v-else>
                    {{scope.row[th.index].ind_val}}
                  </template>
                </span>
                <span class="menu-icon-box" v-if="currentInd.has_detail">
                  <i @click="handleDetail(scope.row[th.index], scope.row)"
                     class="data-menu-icon"
                     v-show="scope.row[th.index].ind_val">
                  </i>
                </span>
              </div>
            </template>
            <template v-else>
              <div v-if="thId === 1" class="data-table-td">
                <span class="data-total-style">
                  {{ scope.row[th.index].year ?  scope.row[th.index].ind_val : scope.row[th.index]}}
                </span>
              </div>
              <div v-else :class="['data-table-td', {'table-td-right': currentInd.has_detail}]">
                <span v-if="currentInd.mark" :title="scope.row[th.index].text" :class="['data-left-icon', {'data-error-img': scope.row[th.index].remark}]" @click="handleIconReMark(scope.row[th.index])">
                  &nbsp;
                </span>
                <span v-if="onlyRead || disabled"
                      :class="['table-center-span', {'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}]"
                      :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                  {{ scope.row[th.index].ind_val }}
                </span>
                <span v-else
                      @click="handleRemark(scope.row[th.index])"
                      :class="['table-center-box', {'redRemark': currentInd.has_detail && !scope.row[th.index].is_full}, {'table-center-error': scope.row[th.index].remark}]"
                      :style="{color: scope.row[th.index].ind_val * 1 === 0 ? '#CECECE' : '#000000'}">
                  {{ scope.row[th.index].ind_val }}
                </span>
                <span class="menu-icon-box" v-if="currentInd.has_detail">
                  <i @click="handleDetail(scope.row[th.index], scope.row)"
                     class="data-menu-icon"
                     v-show="scope.row[th.index].ind_val">
                  </i>
                </span>
              </div>
            </template>
          </template>
        </template>
      </TableColumn>
    </Table>
    <template v-if="!allDetailMode">
      <Detail
        ref="detailDialog"
        :currentCollege="currentCollege"
        :currentData="currentData"
        :onlyRead="onlyRead"
        :orgData="orgData"
        :currentInd = "currentInd">
      </Detail>
    </template>
    <template v-else>
      <AllDetail
        ref="allDetailDialog"
        :onlyRead="onlyRead"
        :currentData="currentData"
        :orgData="orgData"
        :currentInd = "currentInd">
      </AllDetail>
    </template>
    <!--备注弹框-->
    <Dialog
      width="400px"
      :visible.sync="remarkVisible"
      :show-close="false"
      title="备注"
      :close-on-click-modal="true">
      <div class="data-remark-body">
        <Input
          type="textarea"
          :rows="4"
          placeholder="请输入备注"
          v-model="errorRemark" />
      </div>
      <div class="data-remark-footer">
        <Button
          v-if="!onlyRead"
          type="primary"
          size="mini"
          class="button-add"
          @click="confirmIconRemark">保存</Button>
        <Button
          v-if="!onlyRead"
          type="primary"
          size="mini"
          style="float: right;"
          class="button-add"
          @click="cancelIconRemark">取消</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import {Table, TableColumn, Dialog, Input, Button} from 'element-ui'
  import Detail from '../../partial/write/detail.vue'
  import AllDetail from '../../partial/write/allDetail.vue'
  export default {
    name: 'DataByInd',
    components: {
      Detail, AllDetail, Table, TableColumn, Dialog, Input, Button
    },
    data () {
      return {
        allDetailMode: false,
        currentCollege: {},
        currentData: {},
        remarkVisible: false,
        errorRemark: ''
      }
    },
    props: {
      tabData: {
        default: []
      },
      tabThs: {
        default: []
      },
      currentInd: {
        default: {
          'name': '',
          'unit': {
            'name': '',
            'id': ''
          }
        }
      },
      currentTask: {
        default: {}
      },
      onlyRead: {
        default: false
      },
      orgData: {
        default: []
      },
      disabled: {
        default: false
      }
    },
    methods: {
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      // 明细操作
      handleDetail (row, data) {
        this.currentCollege = data
        this.currentData = row
        this.allDetailMode = false
        setTimeout(() => {
          this.$refs.detailDialog.handleDetail(this.currentTask.id) // 方法2
        }, 10)
      },
      handleAllDetail (row, data) {
        this.currentData = {
          year: data * 1
        }
        this.allDetailMode = true
        setTimeout(() => {
          this.$refs.allDetailDialog.handleDetail(this.currentTask.id) // 方法2
        }, 10)
      },
      // 处理百分数
      precisionPercentNum (data) {
        if (data === '') {
          return ''
        } else {
          let num = data * 100
          let decimal = this.currentInd.decimals
          let mul = Math.pow(10, decimal)
          return (Math.round(num * mul) / mul).toFixed(decimal) + '%'
        }
      },
      // 错误数据备注
      handleRemark (data) {
        data.remark = !data.remark
        this.$emit('handleMark', data)
        // this.tabData[index][data.year].remark = !this.tabData[index][data.year].remark
      },
      handleIconReMark (item) {
        if (item.remark && !this.disabled) {
          this.errorRemark = item.text
          this.currentData = item
          this.remarkVisible = true
        }
      },
      confirmIconRemark () {
        this.currentData.text = this.errorRemark
        this.$emit('confirmMark', {data: this.currentData, remark: this.errorRemark})
        this.remarkVisible = false
      },
      cancelIconRemark () {
        this.remarkVisible = false
        this.errorRemark = ''
      }
    }
  }
</script>

<style scoped>
  .data-table-container {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
  .data-table-td{
    color: #000000;
  }
  .data-table-td span{
    display: inline-block;
  }
  .data-total-style {
    color: #1EBBA6;
    font-weight: bold;
  }
  .data-left-icon {
    width: 20px;
    display: inline-block;
  }
  .data-error-img {
    background: url('../../../assets/img/warn.svg') no-repeat center center;
    color: red;
    cursor: pointer;
  }
  .table-center-box {
    cursor: pointer;
    padding: 0 10px;
    border-radius: 2px;
  }
  .table-center-span {
    padding: 0 10px;
  }
  .table-center-box:hover {
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('../../../assets/img/warn.svg');
    background-repeat: no-repeat;
    background-position: center center;
  }
  .table-center-error:hover {
    background-color: rgba(0, 0, 0, 0.5);
    background-image: url('../../../assets/img/right.svg');
    background-repeat: no-repeat;
    background-position: center center;
  }
  .menu-icon-box {
    display: inline-block;
    width: 16px;
    height: 0px;
  }
  .data-menu-icon{
    display: inline-block;
    width: 14px;
    height: 2px;
    border-top: 2px solid #CECECE;
    border-bottom: 2px solid #CECECE;
    background-color: #CECECE;
    padding: 2px 0;
    background-clip:content-box;
    cursor: pointer;
  }
  .data-remark-body {
    margin: 10px 20px;
  }
  .data-remark-footer {
    padding: 10px 20px;
    overflow: hidden;
    text-align: right;
  }
  .redRemark{
    color: red !important;
  }
  .table-td-right{
    text-align: right;
  }
</style>
