<template>
  <div style="height: 100%;">
    <div class="select-wrapper">
      <div class="select-wrapper-year">
        <span>参照年份</span>
        <Select class="select-year" v-model="currentYear" @change="toggleYear">
          <Option
            v-for="(op, index) in yearOptions"
            :key="index"
            :value="op">{{op}}</Option>
        </Select>
      </div>
      <div class="select-table">
        <Table
          size="mini"
          ref="radioTable"
          :data="collegeOrg"
          height="100%"
          tooltip-effect="dark">
          <TableColumn :label="$t('writeInd.college')">
            <template slot-scope="scope">
              <Radio :label="scope.row.id" v-model="collegeRow" @change="toggleCollege(scope)"><span :class="[{'college-active': scope.row.active}]" style="font-size: 12px;">{{scope.row.name}}</span></Radio>
            </template>
          </TableColumn>
        </Table>
      </div>
    </div>
    <div class="left-box">
      <div class="header">
        <!--tab标题按钮-->
        <ul class="tab-list">
          <li
            class="tab-list-item"
            :class="{'is-active': branch[0].active}"
            v-for="branch in indTree"
            :key="branch[0].id"
            @click="toggleTab(branch)">
            <strong>{{branch[0].name}}</strong>
          </li>
        </ul>
      </div>
      <!--表格标题内容-->
      <div class="wrapper-box-top" v-if="currentBranch && currentBranch.length > 0">
        <div class="branch-node header">
          <div class="leaf-node-input">
            <div class="leaf-node-input-left" style="line-height: 60px"><strong>{{$t('setting.target')}}</strong></div>
            <div class="leaf-node-input-right" style="line-height: 60px"><strong>{{$t('setting.real')}}</strong></div>
            <div class="leaf-node-input-right" style="line-height: 60px"><strong>{{$t('setting.average')}}</strong></div>
            <div class="leaf-node-input-right" style="line-height: 60px"><strong>{{$t('setting.completion')}} <i :title="'比例=参照值/目标值'" style="cursor: pointer" class="el-icon-question"></i></strong></div>
          </div>
          <div class="branch-node-label" :title="currentBranch[0].name" style="line-height: 60px; text-indent: 10px;"><strong>{{currentBranch[0].name}}</strong></div>
        </div>
      </div>
      <!--表格正文树状图-->
      <div id="loadings" class="tab-content">
        <div class="wrapper-box inner" v-if="index !== 0" v-for="(node, index) in currentBranch" :key="node.id">
          <div class="branch-node" v-if="node.level === 2">
            <div class="branch-node-input" v-if="node.is_leaf">
              <div class="leaf-node-input-left">
                <input
                  class="line-input"
                  type="text"
                  v-model="node.target.toLocaleString(222)"
                  placeholder=""/>
              </div>
              <div class="leaf-node-input-right">{{node.realVal}}&nbsp;</div>
              <div class="leaf-node-input-right">{{node.average}}&nbsp;</div>
              <div class="leaf-node-input-right">{{node.target > 0 && node.realVal > 0 ? ((node.realVal / node.target) * 100).toFixed(2) +'%': ''}}</div>
            </div>
            <div class="leaf-node-label level1" :title="node.name">{{node.name}}</div>
          </div>
          <div v-if="node.level !== 2" class="wrapper-box">
            <div class="leaf-node">
              <div class="leaf-node-input" v-if="node.is_leaf">
                <div class="leaf-node-input-left">
                  <input
                    class="line-input"
                    type="text"
                    v-model="node.target"
                    placeholder=""/>
                  <span>{{node.unit.name | supplyUnit}}</span>
                </div>
                <div class="leaf-node-input-right">{{node.realVal}}&nbsp;</div>
                <div class="leaf-node-input-right">{{node.average}}</div>
                <div class="leaf-node-input-right">{{node.realVal > 0 ? node.target > 0 && node.realVal > 0 ? ((node.realVal / node.target) * 100).toFixed(2) + '%': '0%' : ''}}</div>
              </div>
              <div :class="['leaf-node-label',`level${node.level - 2}`]" :title="node.name">{{node.name}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
  import { TogglePage, StandTree } from '@/mixins'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Radio, Tree, Table, TableColumn, Checkbox } from 'element-ui'
  export default {
    name: 'writeByCollege',
    mixins: [ TogglePage, StandTree ],
    components: {
      Input, Button, Select, Option, Radio, Tree, Table, TableColumn, Checkbox
    },
    data () {
      return {
        all: [],
        indTree: [],
        collegeRow: '',
        currentBranch: {},
        indicators: [],
        schemeName: '',
        schemeId: -1,
        writeType: 1,
        currentYear: 2018,
        currentTab: ''
      }
    },
    created () {
      this.setSchemeData([])
    },
    mounted () {
      this.$nextTick(function () {
        this.indTree = this.checkedInds.map(node => this.flatten([node]))
        this.toggleTab(this.indTree[0])
        this.initValue()
        this.schemeYear(this.currentYear)
      })
    },
    computed: {
      ...mapGetters('target', ['checkedInds']),
      ...mapGetters('write', ['orgs']),
      ...mapGetters('setting', ['schemeData', 'nowSchemeId', 'activeOrg', 'nowScheme']),
      ...mapGetters('config', ['yearOptions']),
      collegeOrg () {
        let collegeOrg = this.orgs.map(node => {
          node.active = false
          return node
        })
        collegeOrg.forEach(node => {
          if (this.activeOrg.findIndex(id => id === node.id) > -1) {
            node.active = true
          }
        })
        return collegeOrg
      }
    },
    watch: {
      schemeData () {
        this.initValue()
//        this.toggleTab(this.indTree[1])
//        this.toggleTab(this.indTree[0])
      }
    },
    methods: {
      ...mapActions('setting', ['getSchemeData', 'createScheme', 'updateScheme', 'setActiveOrg', 'createBaseScheme', 'updateBaseScheme']),
      ...mapMutations('setting', ['setSchemeData', 'schemeYear']),
      // 根据点击事件，给当前选项赋值active：true属性，其他为false
      toggleYear () {
        if (this.collegeRow) {
          new Promise((resolve, reject) => {
            let payload = {'orgId': this.collegeRow, 'year': this.currentYear, 'schemeId': this.nowSchemeId}
            this.getSchemeData({resolve, reject, payload})
          }).then(() => {
            this.indTree = this.checkedInds.map(node => this.flatten([node]))
            this.schemeYear(this.currentYear)
          }).catch(() => {
          })
        }
      },
      toggleTab (branch) {
        this.currentBranch = branch
        for (let [idx, item] of this.indTree.entries()) {
          item[0].active = item[0].id === branch[0].id
          if (item[0].active) {
            this.currentTab = idx
          }
        }
      },
      toggleCollege (data) {
        new Promise((resolve, reject) => {
          let payload = {'orgId': this.collegeRow, 'year': this.currentYear, 'schemeId': this.nowSchemeId}
          this.getSchemeData({resolve, reject, payload})
        }).then(() => {
          this.indTree = this.checkedInds.map(node => this.flatten([node]))
          this.toggleTab(this.indTree[this.currentTab])
        }).catch(() => {
        })
      },
      test () {
        let arr = []
        this.indTree.forEach(node => {
          node.forEach(item => {
            if (item.target) {
              arr.push({'org_id': this.collegeRow, 'ind_id': item.id, 'val': Number(item.target)})
            }
          })
        })
        this.indicators = arr
      },
      handleConfirm (data1, data2, data3) {
//        console.log(33)
        this.test()
        if (this.nowSchemeId === -1) {
          this.collegeRow ? this.createScheme({'schemeName': data1, 'indData': this.indicators, 'remark': data2, 'short_name': data3}) : this.createBaseScheme({'schemeName': data1, 'remark': data2, 'short_name': data3})
        } else {
          this.collegeRow ? this.updateScheme({'schemeId': this.nowSchemeId, 'schemeName': data1, 'indData': this.indicators, 'remark': data2, 'short_name': data3, 'orgId': this.collegeRow}) : this.updateBaseScheme({'schemeId': this.nowSchemeId, 'schemeName': data1, 'remark': data2, 'short_name': data3})
        }
      },
      initValue () {
        this.indTree.forEach(node => {
          node.forEach(item => {
            let index = []
            this.schemeData ? index = this.schemeData.find(data => data.indicator_id === item.id) : index = []
            if (index) {
              this.$set(item, 'target', index.target_val === -25535 ? '' : index.target_val)
              item.realVal = (index.real_val === -25535 ? '' : index.real_val)
              item.average = (index.avg_val === -25535 ? '' : index.avg_val)
            } else {
              this.$set(item, 'target', '')
              item.realVal = ''
              item.average = ''
            }
          })
        })
      }
    },
    filters: {
      supplyUnit (value) {
        return value === '无' || value === '未知' || value === 'None' ? '' : '(' + value + ')'
      }
    }
  }
</script>

<style scoped>
  .left-box {
    height: 100%;
    overflow: hidden;
  }
  .tab-list {
    width: auto;
    list-style: none;
    border: 1px solid #e4e7ed;
    height: calc(100% - 120px);
  }
  .select-wrapper {
    width: 300px;
    height: 100%;
    margin-left: 20px;
    float: right;
    overflow: hidden;
  }
  .select-wrapper-year{
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 10px;
  }
  .select-wrapper-year span {
    font-size: 14px;
    font-weight: 700;
  }
  .select-table {
    height: calc(100% - 50px);
    overflow-y: scroll;
  }
  .college-active {
    color: #449D44;
  }
  .select-year {
    width: 70%;
    /*margin-bottom: 10px;*/
  }
  .tab-list-item {
    padding: 4px 10px;
    height: 40px;
    line-height: 40px;
    display: inline-block;
    font-size: 14px;
    color: #909399;
    cursor: pointer;
  }
  .tab-list-item:hover {
    color: #1ebba6;
  }
  .tab-list-item.is-active {
    color: #1ebba6;
    background-color: #f5f7fa;
  }
  .wrapper-box {
    background-color: #f0f2f5;
  }
  .wrapper-box-top {
    height: 60px;
    line-height: 60px;
    background-color: #f0f2f5;
  }
  .wrapper-box:nth-child(1) {
    margin-top: 4px;
  }
  .branch-node,
  .leaf-node {
    height: 30px;
    line-height: 30px;
  }
  .branch-node.header {
    font-size: 14px;
  }
  .tab-content {
    height: calc(100% - 120px);
    font-size: 12px;
    color: #30373d;
    overflow-y: scroll;
  }
  .wrapper-box.inner {
    margin: 2px 0px;
  }
  .branch-node-label,
  .leaf-node-label {
    font-size: 14px;
    white-space: nowrap;
    -ms-word-wrap: break-word;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .leaf-node-label.level1  {
    color: #000;
    padding-left: 20px;
    background-color: #d3d4d6;
  }
  .leaf-node-label.level2 {
    padding-left: 40px;
  }
  .leaf-node-label.level3 {
    padding-left: 60px;
  }
  .leaf-node-label.level4 {
    padding-left: 80px;
  }
  .leaf-node-label.level5 {
    padding-left: 100px;
  }
  .leaf-node-label.level6 {
    padding-left: 120px;
  }
  .leaf-node-label.level7 {
    padding-left: 140px;
  }
  .leaf-node-label.level8 {
    padding-left: 160px;
  }
  .leaf-node-label.level9 {
    padding-left: 180px;
  }
  .leaf-node-label.level10 {
    padding-left: 200px;
  }
  .branch-node-input,
  .leaf-node-input {
    width: 440px;
    float: right;
    overflow: hidden;
  }
  .leaf-node-input-left {
    overflow: hidden;
    float: left;
    width: 170px;
  }
  .leaf-node-input-right{
    text-align: center;
    width: 90px;
    float: left;
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .branch-node-input {
    background-color: #D3D4D6;
  }
  .line-input {
    width: 100px;
    outline: none;
    border: 1px solid #d5d5d5;
    padding: 4px 3px;
    border-radius: 3px;
    transition: all 150ms linear;
    color: #606266;
  }
  .line-input:focus {
    color: #555;
    border-color: #409EFF;
  }
  .line-input:disabled {
    background-color: #eee;
  }
  .line-input::placeholder {
    color: #ccc;
  }
</style>
