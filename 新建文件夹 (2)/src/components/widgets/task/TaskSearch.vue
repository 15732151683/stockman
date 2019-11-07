<template>
  <div class="search-container">
    <div class="search-common">
      <Select v-model="selectTime" placeholder="请选择" @change="changeTime">
        <Option
          v-for="item in timeOptions"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </Option>
      </Select>
      <Button
        type="primary"
        icon="el-icon-search"
        size="mini"
        style="float: none; border-radius: 2px; margin-top: 4px; margin-left: 20px; background-color: #1EBBA6;"
        class="button-add"
        @click="handleAdvancedSearch">高级搜索</Button>
      <span class="search-task-length">
        {{tasks.length}}个任务
      </span>
      <span class="search-task-slot">
        <slot name="button"></slot>
      </span>
    </div>
    <!--备注弹框-->
    <Dialog
      width="800px"
      :visible.sync="advancedVisible"
      :show-close="false"
      title="高级搜索"
      @close="handleClose"
      :close-on-click-modal="true">
      <div class="search-dialog-body">
        <div class="search-dialog-left">
          <Form
            :model="searchInfo"
            ref="searchForm"
            label-width="100px"
            class="search-dialog-form">
            <FormItem label="任务名称" prop="name">
              <Input placeholder="任务名称" v-model="searchInfo.name" type="text" />
            </FormItem>
            <FormItem label="任务年份" prop="years">
              <PickerDate
                v-if="RouterAlive"
                @rangeChange="yearChange"
                :width="'100%'"
                :height="'100%'"
                :size="''"
                :range="searchInfo.years">
              </PickerDate>
            </FormItem>
            <FormItem label="创建日期" prop="createdAt">
              <DatePicker
                style="width: 100%;"
                v-model="searchInfo.createdAt"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </DatePicker>
            </FormItem>
            <FormItem label="发布日期" prop="publishedAt">
              <DatePicker
                style="width: 100%;"
                v-model="searchInfo.publishedAt"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </DatePicker>
            </FormItem>
            <FormItem label="截止日期" prop="deadline">
              <DatePicker
                style="width: 100%;"
                v-model="searchInfo.deadline"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </DatePicker>
            </FormItem>
            <FormItem label="填报部门" prop="deptIds">
              <Select v-model="searchInfo.deptIds" placeholder="请选择部门（可多选）" style="width: 100%;" multiple>
                <Option
                  v-for="item in depts"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="任务状态" prop="nodeId">
              <Select v-model="searchInfo.nodeId" placeholder="请选择状态（可多选）" style="width: 100%;" multiple>
                <Option
                  v-for="item in taskNodes"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="是否终止" prop="terminated">
              <Radio v-model="searchInfo.terminated" :label="false">否</Radio>
              <Radio v-model="searchInfo.terminated" :label="true">是</Radio>
            </FormItem>
          </Form>
        </div>
        <div class="search-dialog-right">
          <Input
            size="small"
            suffix-icon="el-icon-search"
            placeholder="输入关键字"
            v-model="findText" />
          <div class="task-form-right task-tree-box target-tree" v-if="RouterAlive">
            <Tree
              :default-checked-keys="searchInfo.indIds"
              :data="targets"
              node-key="id"
              ref="addTree"
              :props="defaultProps"
              :filter-node-method="filterNode"
              show-checkbox>
              <div class="search-task-tree one-line" slot-scope="{ node, data }">
                <div class="one-line" :title="data.name">{{data.name}}</div>
              </div>
            </Tree>
          </div>
        </div>
      </div>
      <div class="search-dialog-footer">
        <Button
          type="primary"
          size="mini"
          class="button-add"
          @click="confirmAdvancedSearch">确定</Button>
        <Button
          type="primary"
          size="mini"
          class="button-add"
          @click="handleResetSearch">重置</Button>
        <Button
          type="primary"
          size="mini"
          style="float: right;"
          class="button-add"
          @click="cancelAdvancedSearch">取消</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import { Select, Option, Input, Dialog, Button, Form, FormItem, DatePicker, Tree, Radio } from 'element-ui'
  import PickerDate from '../PickerDate'
  export default {
    name: 'TaskSearch',
    components: {
      Select, Option, Input, Dialog, Button, Form, FormItem, DatePicker, PickerDate, Tree, Radio
    },
    // props: {
    //   checked: {
    //     default: false
    //   }
    // },
    data () {
      return {
        RouterAlive: true,
        selectTime: 1,
        timeOptions: [
          {
            id: 1,
            name: '最近一周'
          },
          {
            id: 2,
            name: '最近一个月'
          },
          {
            id: 3,
            name: '最近三个月'
          },
          {
            id: 4,
            name: '最近一年'
          },
          {
            id: 5,
            name: '全部'
          }
        ],
        advancedVisible: false,
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        findText: '',
        searchInfo: {
          timeId: 5,
          name: '',
          years: '',
          deptIds: [],
          createdAt: '',
          publishedAt: '',
          deadline: '',
          indIds: [],
          nodeId: [],
          advance: true,
          terminated: false
        },
        memorySearch: {}
      }
    },
    mounted () {
      this.getDept()
      if (Object.keys(this.searchCondition).length > 0) {
        this.searchInfo = this.searchCondition
        if (this.searchInfo.advance) {
          this.selectTime = 5
        } else {
          this.selectTime = this.searchInfo.timeId
        }
      }
    },
    methods: {
      ...mapActions('task', ['getDept']),
      ...mapMutations('task', ['setSearchCondition', 'setPageInfo']),
      clone (data) {
        return JSON.parse(JSON.stringify(data))
      },
      // 重新渲染
      reload () {
        this.RouterAlive = false
        this.$nextTick(() => {
          this.RouterAlive = true
        })
      },
      yearChange (data) {
        this.searchInfo.years = data
      },
      changeTime () {
        this.handleFilterTask(true)
      },
      handleAdvancedSearch () {
        this.advancedVisible = true
        this.memorySearch = this.clone(this.searchInfo)
      },
      confirmAdvancedSearch () {
        this.selectTime = 5
        let indId = this.$refs.addTree.getCheckedNodes().filter(node => node.is_leaf).map(node => node.id)
        this.searchInfo.indIds = indId
        this.memorySearch = this.clone(this.searchInfo)
        this.handleFilterTask()
      },
      handleResetSearch () {
        this.searchInfo = {
          timeId: 5,
          name: '',
          years: '',
          deptIds: [],
          createdAt: '',
          publishedAt: '',
          deadline: '',
          indIds: [],
          nodeId: [],
          advance: true,
          terminated: false
        }
        this.reload()
      },
      cancelAdvancedSearch () {
        this.advancedVisible = false
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      handleClose () {
        this.searchInfo = this.memorySearch
      },
      handleFilterTask (bool) {
        if (bool) {
          this.searchInfo.timeId = this.selectTime
          this.searchInfo.advance = false
          this.setSearchCondition(this.searchInfo)
        } else {
          this.searchInfo.timeId = 5
          this.searchInfo.advance = true
          this.setSearchCondition(this.searchInfo)
        }
        this.setPageInfo({
          page: 1,
          size: this.pageInfo.size
        })
        this.$emit('getTask')
        this.advancedVisible = false
      }
    },
    computed: {
      ...mapGetters('task', ['tasks', 'taskNodes', 'depts', 'targets', 'searchCondition', 'pageInfo'])
    },
    watch: {
      findText (val) {
        this.$refs.addTree.filter(val)
      }
    }
  }
</script>

<style scoped>
  .search-container {
    height: 40px;
    overflow: hidden;
  }
  .search-common {
    height: 100%;
  }
  .search-task-length {
    display: inline-block;
    line-height: 40px;
    margin-left: 10px;
    color: #636363;
    font-size: 14px;
  }
  .search-task-slot {
    display: inline-block;
  }
  .search-dialog-body {
    margin: 20px 20px;
    height: 420px;
    overflow: hidden;
  }
  .search-dialog-left {
    height: 100%;
    width: 400px;
    overflow: hidden;
    border-right: solid 1px #DCDFE6;
    margin-right: 10px;
    padding-right: 10px;
    float: left;
  }
  .search-dialog-right {
    height: 100%;
    overflow: hidden;
  }
  .search-dialog-footer {
    border-top: solid 1px #DCDFE6;
    margin: 10px 20px;
    padding: 10px 0px;
    overflow: hidden;
    text-align: right;
  }
  .task-tree-box {
    height: calc(100% - 40px);
    margin-top: 8px;
    overflow-y: auto;
  }
  .search-task-tree {
    font-size: 14px;
    display: inline-block;
  }
</style>
