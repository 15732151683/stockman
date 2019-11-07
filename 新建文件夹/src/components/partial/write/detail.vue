<template>
  <div>
    <Dialog
      width="1200px"
      top="20px"
      :visible.sync="dialogDetailVisible"
      :show-close="false"
      :close-on-click-modal="true">
      <div class="detail-dialog">
        <div class="detail-title">
          <span>{{this.currentData.year}}&nbsp;&nbsp;{{this.currentCollege.name}} - {{this.currentInd.name}}明细</span>
        </div>
        <div class="detail-header">
          搜索：
          <Input
            @blur="handleSearch"
            @keyup.enter.native="handleSearch"
            class="detail-search"
            placeholder="输入名称"
            size="small"
            suffix-icon="el-icon-search"
            v-model="searchDetail" />
          <Button
            v-if="!onlyRead"
            v-hasPermission="'w'"
            class="button-confirm"
            type="primary"
            size="small"
            style="background-color: #3090E9; margin-left: 20px;"
            @click="handleAddDetail"><i class="el-icon-plus"></i>新增明细</Button>
        </div>
        <div class="detail-table ind-table inner-table" v-if="detailTemplate && detailTemplate.length > 0">
          <Table :data="allDetail" style="width: 100%" :row-class-name="tableRowClassName">
            <template  v-for="(th, index) in detailTemplate">
              <template v-if="th.type.name === 'input'">
                <template v-if="th.type.type === 'number'">
                  <TableColumn
                    :key="th.id"
                    :align="index === 0 ? 'left' : 'center'"
                    :prop="th.index"
                    :width="th.width"
                    :label="th.name">
                  </TableColumn>
                </template>
                <template v-else>
                  <TableColumn
                    :key="th.id"
                    :align="index === 0 ? 'left' : 'center'"
                    :prop="th.index"
                    :min-width="th.width"
                    :label="th.name">
                  </TableColumn>
                </template>
              </template>
              <template v-else-if="th.index === 'org_ids'">
                <TableColumn
                  align="center"
                  prop="e_value"
                  width="80"
                  label="折算值">
                </TableColumn>
                <TableColumn
                  :key="th.id"
                  align="center"
                  :prop="th.index"
                  :width="th.width"
                  :label="th.name">
                  <template slot-scope="{row}">
                    <div v-if="row[th.index].length > 1">
                      <Popover trigger="hover" placement="top">
                        <p v-for="org in row.org_ids" :key="org.id">{{org.name}}</p>
                        <div slot="reference">
                          {{row.org_ids.length}}
                          <i class="el-icon-question"></i>
                        </div>
                      </Popover>
                    </div>
                    <div v-else>1</div>
                  </template>
                </TableColumn>
              </template>
              <template v-else>
                <TableColumn
                  :key="th.id"
                  :align="index === 0 ? 'left' : 'center'"
                  :prop="th.index"
                  :width="th.width"
                  :label="th.name">
                </TableColumn>
              </template>
            </template>
            <TableColumn fixed="right" label="操作" align="center" width="100" v-if="$route.meta.permissionList.includes('w') && !onlyRead">
              <template slot-scope="scope">
                <Button @click="handleEditDetail(scope.row)" type="text" size="mini"><i title="修改" class="el-icon-edit detail-button"></i></Button>
                <Button style="margin-left: 5px;" @click="handleChangeDetail(scope.row)" type="text" size="mini"><i title="更改" class="el-icon-refresh detail-button"></i></Button>
                <Button style="margin-left: 5px;" @click="handleDeleteDetail(scope.row)" type="text" size="mini"><i title="删除" class="el-icon-delete detail-button"></i></Button>
              </template>
            </TableColumn>
          </Table>
        </div>
        <div class="detail-footer" v-if="allDetail.length > 0">
          <Pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[6, 8, 10, 16]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </Pagination>
        </div>
      </div>
    </Dialog>
    <Dialog
      top="20px"
      width="520px"
      :visible.sync="addDetailVisible"
      @close="handleCloseAdd"
      :show-close="false"
      :close-on-click-modal="true">
      <div class="detail-dialog">
        <div class="detail-title">
          <span>新增</span>
        </div>
        <div class="detail-form" v-if="Object.keys(rules).length > 0">
          <Form label-position="right" label-width="120px" :model="detailData" :rules="rules" ref="formAddDetail">
            <FormItem :label="item.name" v-for="(item, index) in detailTemplate" :key="index" :prop="item.index">
              <div v-if="item.type.name === 'input'">
                <template v-if="item.type.type === 'number'">
                  <Input v-if="item.index === 'raw_value'" :type="item.type.type" v-model.number="detailData[item.index]" />
                  <Input v-else :type="item.type.type" v-model="detailData[item.index]" />
                </template>
                <template v-else>
                  <Input :type="item.type.type" v-model="detailData[item.index]" />
                </template>
              </div>
              <div v-else-if="item.type.name === 'date'">
                <DatePicker
                  style="width: 100%;"
                  :clearable="true"
                  v-model="detailData[item.index]"
                  :type="item.type.type"
                  :value-format="item.type.type === 'year' ? 'yyyy' : 'yyyy-MM-dd'"
                  placeholder="选择时间">
                </DatePicker>
              </div>
              <div v-else-if="item.index === 'org_ids'">
                <RadioGroup v-model="detailData.is_equal">
                  <Radio :label="true">均分</Radio>
                  <Radio :label="false">自定义</Radio>
                </RadioGroup>
                <ul class="add-college-list">
                  <li v-for="child in detailData[item.index]" :key="child.id">
                    <div class="add-college-weight">
                      <span v-if="detailData.is_equal">1/{{detailData[item.index].length}}</span>
                      <input type="number" v-else v-model.number="child.weight_num" />
                    </div>
                    <div class="add-college-name one-line">
                      {{child.name}}
                    </div>
                    <div class="add-college-delete" v-if="child.id !== detailData.org_id" @click="handleDeleteCollege(child)">
                      <i class="el-icon-close"></i>
                    </div>
                  </li>
                </ul>
                <div>
                  <Select v-model="selectCollegeId" placeholder="新增归属院系" style="width: 100%;" @change="handleAddCollege">
                    <Option
                      v-for="item in selectColleges"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </Option>
                  </Select>
                </div>
              </div>
              <div v-else>
                <Input v-model="detailData[item.index]" />
              </div>
            </FormItem>
          </Form>
        </div>
        <div class="detail-footer" style="text-align: right;">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            style="background-color: #3090E9;"
            :loading="addDetailLoading"
            @click="confirmAddDetail">确 定</Button>
        </div>
      </div>
    </Dialog>
    <Dialog
      top="20px"
      width="520px"
      :visible.sync="editDetailVisible"
      :show-close="false"
      @close="handleCloseEdit"
      :close-on-click-modal="true">
      <div class="detail-dialog">
        <div class="detail-title">
          <span>修改</span>
        </div>
        <div class="detail-form" v-if="Object.keys(rules).length > 0">
          <Form label-position="right" label-width="120px" :model="detailData" :rules="rules" ref="formEditDetail">
            <FormItem :label="item.name" v-for="(item, index) in detailTemplate" :key="index" :prop="item.index">
              <div v-if="item.type.name === 'input'">
                <template v-if="item.type.type === 'number'">
                  <Input v-if="item.index === 'raw_value'" :type="item.type.type" v-model.number="detailData[item.index]" />
                  <Input v-else :type="item.type.type" v-model="detailData[item.index]" />
                </template>
                <template v-else>
                  <Input :type="item.type.type" v-model="detailData[item.index]" />
                </template>
              </div>
              <div v-else-if="item.type.name === 'date'">
                <DatePicker
                  style="width: 100%;"
                  :clearable="true"
                  v-model="detailData[item.index]"
                  :type="item.type.type"
                  :value-format="item.type.type === 'year' ? 'yyyy' : 'yyyy-MM-dd'"
                  placeholder="选择时间">
                </DatePicker>
              </div>
              <div v-else-if="item.index === 'org_ids'">
                <RadioGroup v-model="detailData.is_equal">
                  <Radio :label="true">均分</Radio>
                  <Radio :label="false">自定义</Radio>
                </RadioGroup>
                <ul class="add-college-list">
                  <li v-for="child in detailData[item.index]" :key="child.id">
                    <div class="add-college-weight">
                      <span v-if="detailData.is_equal">1/{{detailData[item.index].length}}</span>
                      <input type="number" v-else v-model.number="child.weight_num" />
                    </div>
                    <div class="add-college-name one-line">
                      {{child.name}}
                    </div>
                    <div class="add-college-delete" v-if="child.id !== detailData.org_id" @click="handleDeleteCollege(child)">
                      <i class="el-icon-close"></i>
                    </div>
                  </li>
                </ul>
                <div>
                  <Select v-model="selectCollegeId" placeholder="新增归属院系" style="width: 100%;" @change="handleAddCollege">
                    <Option
                      v-for="item in selectColleges"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </Option>
                  </Select>
                </div>
              </div>
              <div v-else>
                <Input v-model="detailData[item.index]" />
              </div>
            </FormItem>
          </Form>
        </div>
        <div class="detail-footer" style="text-align: right;">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            style="background-color: #3090E9;"
            :loading="editDetailLoading"
            @click="confirmEditDetail">确 定</Button>
        </div>
      </div>
    </Dialog>
    <Dialog
      width="400px"
      :visible.sync="changeDetailVisible"
      :show-close="false"
      @close="handleCloseChange"
      :close-on-click-modal="true">
      <div class="detail-dialog">
        <div class="detail-title">
          <span>归属年份更改</span>
        </div>
        <div class="detail-form">
          <Form label-position="right" label-width="80px" :model="changeData" ref="formChangeDetail">
            <FormItem label="归属院系">
              <div>{{changeData.org_name}}</div>
              <!--<Select v-model="changeData.org_id" placeholder="选择院系" style="width: 100%;" @change="changeDetailCollege">-->
                <!--<Option-->
                  <!--v-for="item in changeColleges"-->
                  <!--:key="item.id"-->
                  <!--:label="item.name"-->
                  <!--:value="item.id">-->
                <!--</Option>-->
              <!--</Select>-->
            </FormItem>
            <FormItem label="年份选择">
              <DatePicker
                @change="changeDetailYear"
                style="width: 100%;"
                :clearable="false"
                v-model="changeData.year"
                value-format="yyyy"
                type="year"
                placeholder="选择年">
              </DatePicker>
            </FormItem>
          </Form>
        </div>
        <div class="detail-footer" style="text-align: right;">
          <Button
            class="button-close"
            type="primary"
            size="small"
            style="background-color: #9B9B9B;"
            @click="closeChangeDetail">取消</Button>
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            style="background-color: #3090E9;"
            :disabled="!changeConfirm"
            :loading="changeDetailLoading"
            @click="confirmChangeDetail">确定</Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Dialog, Table, TableColumn, Pagination, FormItem, Form, DatePicker, MessageBox, Message, RadioGroup, Radio, Select, Option, Popover } from 'element-ui'
  export default {
    name: 'detail',
    components: {
      Input, Button, Dialog, Table, TableColumn, Pagination, FormItem, Form, DatePicker, MessageBox, Message, RadioGroup, Radio, Select, Option, Popover
    },
    props: {
      currentInd: {
        require: true
      },
      currentCollege: {
        default: {}
      },
      currentData: {
        require: true
      },
      orgData: {
        default: []
      },
      onlyRead: {
        default: false
      }
    },
    data () {
      return {
        dialogDetailVisible: false,
        addDetailVisible: false,
        editDetailVisible: false,
        changeDetailVisible: false,
        searchDetail: '',
        detailType: 3,
        detailData: {},
        changeData: {},
        currentPage: 1,
        pageSize: 8,
        memoryDetail: {},
        changeConfirm: false,
        selectColleges: [],
        changeColleges: [],
        addDetailLoading: false,
        editDetailLoading: false,
        changeDetailLoading: false,
        rules: {},
        addCollegeStatus: false,
        selectCollegeId: '',
        taskId: 0
      }
    },
    methods: {
      ...mapActions('write', ['getAllDetail', 'getDetailTemplate', 'updateIndDetail', 'deleteDetail', 'changeDetail']),
      ...mapMutations('write', ['setAllDetail']),
      changeDetailCollege () {
        if (this.memoryDetail.org_id === this.changeData.org_id && this.memoryDetail.year === this.changeData.year) {
          this.changeConfirm = false
        } else {
          this.changeConfirm = true
        }
      },
      changeDetailYear () {
        if (this.memoryDetail.org_id === this.changeData.org_id && this.memoryDetail.year === this.changeData.year) {
          this.changeConfirm = false
        } else {
          this.changeConfirm = true
        }
      },
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      tableRowClassName ({row, rowIndex}) {
        if (rowIndex % 2 === 0) {
          return 'even-row'
        } else {
          return 'odd-row'
        }
      },
      handleCloseAdd () {
        this.$refs.formAddDetail.clearValidate()
      },
      handleCloseEdit () {
        this.$refs.formEditDetail.clearValidate()
      },
      handleCloseChange () {
        this.$refs.formChangeDetail.clearValidate()
      },
      closeChangeDetail () {
        this.changeDetailVisible = false
      },
      // detail弹框出现函数
      handleDetail (id) {
        // console.log(this.currentInd, 'currentInd')
        this.taskId = id
        this.setAllDetail([])
        this.searchDetail = ''
        this.detailType = this.currentInd.detail_template_id
        this.dialogDetailVisible = true
        this.getDetailTemplate(this.detailType)
        this.currentPage = 1
        this.handleAllDetail()
      },
      // detail修改
      handleEditDetail (row) {
        this.detailData = this.clone(row)
        this.detailData.org_ids.forEach(node => {
          node.name = this.orgData.find(item => item.id === node.id).name
        })
        this.handleSelectCollege(this.detailData.org_ids.map(node => node.id))
        this.editDetailVisible = true
      },
      handleChangeDetail (row) {
        this.changeColleges = this.orgData.filter(node => {
          return row.org_ids.findIndex(item => item === node.id) < 0
        })
        this.changeConfirm = false
        this.memoryDetail = {
          year: String(this.currentData.year),
          org_id: this.currentCollege.id,
          ind_data_id: this.currentData.ind_data_id,
          id: row.id
        }
        this.changeData = {
          org_id: this.currentCollege.id,
          org_name: this.currentCollege.name,
          year: String(this.currentData.year)
        }
        this.changeDetailVisible = true
      },
      handleDeleteDetail (row) {
        MessageBox.confirm('确认删除', '提示', {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            let payload = {
              indId: this.currentData.ind_data_id,
              detailId: row.id,
              taskId: this.taskId
            }
            this.deleteDetail({resolve, reject, payload})
          }).then(() => {
            this.currentPage = this.allDetail.length > 1 ? this.currentPage : this.currentPage - 1
            this.handleAllDetail()
          })
        })
      },
      handleAddDetail () {
        this.detailData = {
          'org_ids': [{
            name: this.currentCollege.name,
            id: this.currentCollege.id,
            weight_num: 1
          }],
          'org_id': this.currentCollege.id,
          'is_equal': true
        }
        this.handleSelectCollege([this.currentCollege.id])
        this.addDetailVisible = true
      },
      // initDetail (obj) {
      //   let cloneObj = JSON.parse(JSON.stringify(obj))
      //   this.detailTemplate.forEach(node => {
      //     if (node.type.name === 'date') {
      //       let val = cloneObj[node.index]
      //       if (val === '' || val === null) {
      //         cloneObj[node.index] = ''
      //       }
      //     }
      //   })
      //   return cloneObj
      // },
      confirmAddDetail () {
        this.$refs.formAddDetail.validate((valid) => {
          if (valid) {
            let weights = {}
            this.detailData.org_ids.forEach(node => {
              weights[node.id] = node.weight_num
            })
            // let detailData = this.initDetail(this.detailData)
            let payload = {
              indId: this.currentData.ind_data_id,
              typeId: this.currentInd.detail_template_id,
              detailData: this.detailData,
              taskId: this.taskId,
              weights
            }
            new Promise((resolve, reject) => {
              this.addDetailLoading = true
              this.updateIndDetail({resolve, reject, payload})
            }).then(() => {
              this.currentPage = 1
              this.handleAllDetail()
              this.addDetailLoading = false
              this.addDetailVisible = false
              this.detailData = {
                org_ids: []
              }
            }).catch(() => {
              this.addDetailLoading = false
            })
          } else {
            return false
          }
        })
      },
      confirmEditDetail () {
        this.$refs.formEditDetail.validate((valid) => {
          if (valid) {
            let weights = {}
            this.detailData.org_ids.forEach(node => {
              weights[node.id] = node.weight_num
            })
            let payload = {
              indId: this.currentData.ind_data_id,
              typeId: this.currentInd.detail_template_id,
              detailData: this.detailData,
              taskId: this.taskId,
              weights
            }
            new Promise((resolve, reject) => {
              this.editDetailLoading = true
              this.updateIndDetail({resolve, reject, payload})
            }).then(() => {
              this.handleAllDetail()
              this.editDetailLoading = false
              this.editDetailVisible = false
              this.detailData = {
                org_ids: []
              }
            }).catch(() => {
              this.editDetailLoading = false
            })
          } else {
            return false
          }
        })
      },
      confirmChangeDetail () {
        let payload = {
          ind_data_id: this.memoryDetail.ind_data_id,
          id: this.memoryDetail.id,
          year: Number(this.changeData.year),
          org_id: this.changeData.org_id,
          taskId: this.taskId
        }
        new Promise((resolve, reject) => {
          this.changeDetailLoading = true
          this.changeDetail({resolve, reject, payload})
        }).then(() => {
          this.currentPage = 1
          this.handleAllDetail()
          this.changeDetailLoading = false
          this.changeDetailVisible = false
          this.memoryDetail = {}
          this.changeData = {}
        }).catch(() => {
          this.changeDetailLoading = false
        })
      },
      handleSizeChange (val) {
        this.pageSize = val
        this.handleAllDetail()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.handleAllDetail()
      },
      handleSearch () {
        this.handleAllDetail()
      },
      // 请求所有数据
      handleAllDetail () {
        this.getAllDetail({payload: {
          'id': this.currentData.ind_data_id,
          'type_id': this.detailType,
          'page': this.currentPage,
          'limit': this.pageSize,
          'keyword': this.searchDetail,
          'taskId': this.taskId},
          orgData: this.orgData
        })
      },
      // 处理可选择学院
      handleSelectCollege (arr) {
        let cloneData = this.clone(this.orgData)
        arr.forEach(node => {
          let index = cloneData.findIndex(item => item.id === node)
          cloneData.splice(index, 1)
        })
        this.selectColleges = cloneData
      },
      handleAddCollege () {
        let obj = this.selectColleges.find(node => node.id === this.selectCollegeId)
        this.detailData.org_ids.push(
          {
            name: obj.name,
            id: obj.id,
            weight_num: 1
          }
        )
        setTimeout(() => {
          let index = this.selectColleges.findIndex(node => node.id === this.selectCollegeId)
          this.selectColleges.splice(index, 1)
          this.selectCollegeId = ''
        }, 10)
        // this.addCollegeStatus = true
      },
      handleDeleteCollege (row) {
        let index = this.detailData.org_ids.findIndex(node => node.id === row.id)
        this.detailData.org_ids.splice(index, 1)
        this.selectColleges.push({id: row.id, name: row.name})
      },
      // 数字精度处理
      precisionNum (data) {
        let num = data * 1
        let decimal = this.currentInd.decimals
        let mul = Math.pow(10, decimal)
        return (Math.round(num * mul) / mul).toFixed(decimal) * 1
      }
    },
    watch: {
      detailTemplate () {
        this.detailTemplate.forEach(node => {
          this.rules[node.index] = [{ required: node.require, message: '请输入' + node.name, trigger: 'blur' }]
        })
      },
      allDetail () {
        if (this.allDetail && this.allDetail.length > 0) {
          this.allDetail.forEach(node => {
            node.e_value = this.precisionNum(node.e_value)
          })
        }
      }
    },
    computed: {
      ...mapGetters('write', ['allDetail', 'totalCount']),
      ...mapGetters('write', ['detailTemplate'])
    }
  }
</script>

<style scoped>
  ul, li {
    list-style: none;
  }
  .detail-dialog {
    margin: 10px 30px;
    padding-bottom: 40px;
  }
  .detail-title{
    font-size: 18px;
    color: #000;
    font-weight: 600;
    padding-bottom: 20px;
  }
  .detail-table {
    margin-top: 20px;
  }
  .detail-search {
    width: 260px;
  }
  .detail-button {
    font-size: 16px;
    color: #9B9B9B;
  }
  .detail-footer {
    margin-top: 10px;
  }
  .add-college-list li{
    line-height: 38px;
    border: solid 1px #DCDFE6;
    font-size: 14px;
    margin-bottom: 5px;
    border-radius: 4px;
    position: relative;
  }
  .add-college-delete {
    position: absolute;
    right: -20px;
    font-size: 18px;
    top: 0;
    cursor: pointer;
  }
  .add-college-weight {
    float: right;
    width: 60px;
    padding: 0px 5px;
    margin-left: 10px;
    text-align: center;
    border-left: solid 1px #DCDFE6;
    color: #3090E9;
  }
  .add-college-weight input {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    border: none;
    outline: none;
    color: #3090E9;
  }
  .add-college-name {
    text-indent: 10px;
  }
</style>
