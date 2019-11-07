<template>
    <div style="height: 100%;">
      <div class="udss-board-toolbox">
        <div style="padding-bottom: 10px">
          <input
            class="search-input"
            :placeholder="$t('element.filterText')"
            v-model="filterText" />
        </div>
        <div class="udss-tree-header"><strong>{{$t('writeInd.indicator')}}</strong></div>
        <div class="udss-tree-body target-tree">
          <Tree
            :data="checkedInds"
            expand-on-click-node
            :props="defaultProps"
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree">
            <div class="udss-tree-node" slot-scope="{ node, data }" :title="node.label">
              <div class="udss-tree-button" v-show="data.is_leaf">
                <Radio :label="data.id" v-model="radios" @change="showWrite(data)"></Radio>
              </div>
              <div :class="['udss-tree-text', 'one-line', {'is-active-line': radios === data.id}]" :title="node.label" @click="changeRadio(data)">
                {{ node.label }}
              </div>
            </div>
          </Tree>
        </div>
      </div>
      <div class="select-wrapper">
        <div class="select-name one-line"><strong>{{$t('writeInd.inputInd')}}</strong>：{{currentInd.name}}</div>
        <div class="select-name"><strong>{{$t('writeInd.unit')}}</strong>：{{currentInd.unit.name}}</div>
        <div class="select-name"><strong>{{$t('setting.average')}}</strong>：{{schemeDataByInd && (schemeDataByInd.avg_val === -25535 ? '' : schemeDataByInd.avg_val)}}</div>
        <span><strong>参照年份：</strong></span>
        <Select class="select-year" v-model="currentYear" @change="toggleYear">
          <Option
            class="college-option"
            v-for="(op, index) in yearOptions"
            :key="index"
            :value="op">{{op}}</Option>
        </Select>
        <div class="select-table" id="loadings">
          <Table
            size="mini"
            ref="radioTable"
            height="100%"
            :data="orgValue"
            tooltip-effect="dark"
            style="width: 100%">
            <TableColumn
              prop="name"
              sortable
              :sort-method="sortName"
              :label="$t('writeInd.college')">
            </TableColumn>
            <TableColumn
              :label="$t('writeInd.value')"
              sortable
              :sort-method="sortValue"
              width="170">
              <template slot-scope="scope">
                <Input style="width: 120px; line-height: 30px;" size="medium" :placeholder="$t('writeInd.value')" v-model="scope.row.value" :disabled="currentInd.ind_type_id === 2" />
              </template>
            </TableColumn>
            <TableColumn
              prop="real"
              sortable
              width="120"
              :label="$t('setting.real')"></TableColumn>
            <TableColumn
              sortable
              :sort-method="sortVal"
              width="120"
              label="比例">
              <template slot="header" slot-scope="scope">
                比例 <i title="比例=参照值/目标值" class="el-icon-question"></i>
              </template>
              <template  slot-scope="scope">
                <div v-show="scope.row.value !== 0">{{scope.row.value > 0 && scope.row.real > 0 ? ((scope.row.real / scope.row.value) * 100).toFixed(2) +'%': ''}}</div>
              </template>
            </TableColumn>
          </Table>
        </div>
      </div>
    </div>
</template>

<script>
  import { Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio } from 'element-ui'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    name: 'writeByInd',
    components: {
      Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio
    },
    data () {
      return {
        filterText: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        radios: '',
        currentInd: {
          'name': '',
          'unit': {
            'name': ''
          }
        },
        orgValue: [],
        currentYear: 2018,
        nowOrgVal: {
          'orgs': []
        }
      }
    },
    created () {
      this.setSchemeDataByInd()
    },
    mounted () {
      this.$nextTick(function () {
        this.initValue()
        this.schemeYear(this.currentYear)
      })
    },
    computed: {
      ...mapGetters('target', ['checkedInds']),
      ...mapGetters('write', ['orgs']),
      ...mapGetters('config', ['yearOptions']),
      ...mapGetters('setting', ['schemeData', 'nowSchemeId', 'nowScheme', 'schemeDataByInd']),
      indicators () {
        return this.orgValue.filter(node => node.value).map(item => {
          return {
            'org_id': item.id,
            'val': Number(item.value)
          }
        })
      }
    },
    methods: {
      ...mapActions('setting', ['createSchemeByInd', 'updateSchemeByInd', 'getSchemeDataByInd', 'createBaseScheme', 'updateBaseScheme']),
      ...mapMutations('setting', ['setSchemeDataByInd', 'schemeYear']),
//      orders (h, { column, $index }) {
//        return h('span', [
//          h('span', ['比例']),
//          h('i', {'class': 'el-icon-question', 'title': '比例=参照值/目标值'})
//        ])
//      },
      sortVal (a, b) {
        let aValue = a.value === '' || a.real === '' ? -1 : Number(a.real) / Number(a.value)
        let bValue = b.value === '' || b.real === '' ? -1 : Number(b.real) / Number(b.value)
        if (aValue > bValue) {
          return 1
        } else if (aValue < bValue) {
          return -1
        } else {
          return 0
        }
      },
      sortValue (a, b) {
        let aValue = a.value === undefined ? -1 : Number(a.value)
        let bValue = b.value === undefined ? -1 : Number(b.value)
        if (aValue > bValue) {
          return 1
        } else if (aValue < bValue) {
          return -1
        } else {
          return 0
        }
      },
      sortName (a, b) {
        return a.pinyin.toLowerCase() > b.pinyin.toLowerCase() ? 1 : -1
      },
      toggleYear () {
        if (this.currentInd.id) {
          this.getSchemeDataByInd({'schemeId': this.nowSchemeId, 'indId': this.currentInd.id, 'year': this.currentYear})
        }
        this.schemeYear(this.currentYear)
      },
      initValue () {
        this.orgValue = this.orgs.map(node => {
          let index
          this.schemeDataByInd && this.schemeDataByInd.org_data ? index = this.schemeDataByInd.org_data.find(item => item.org_id === node.id) : index = []
          if (index) {
            return {
              'name': node.name,
              'id': node.id,
              'pinyin': node.pinyin,
              'value': index.target_val === -25535 ? '' : index.target_val,
              'real': index.real_val === -25535 ? '' : index.real_val
            }
          } else {
            return {
              'name': node.name,
              'id': node.id,
              'pinyin': node.pinyin,
              'value': '',
              'real': ''
            }
          }
        })
      },
      handleConfirm (data1, data2, data3) {
        if (this.nowSchemeId === -1) {
          this.currentInd.id ? this.createSchemeByInd({'schemeName': data1, 'orgData': this.indicators, 'remark': data2, 'indId': this.currentInd.id, 'short_name': data3}) : this.createBaseScheme({'schemeName': data1, 'remark': data2, 'short_name': data3})
        } else {
          this.currentInd.id ? this.updateSchemeByInd({'schemeId': this.nowSchemeId, 'schemeName': data1, 'orgData': this.indicators, 'remark': data2, 'indId': this.currentInd.id, 'short_name': data3}) : this.updateBaseScheme({'schemeId': this.nowSchemeId, 'schemeName': data1, 'remark': data2, 'short_name': data3})
        }
      },
      showWrite (data) {
        this.currentInd = data
        this.getSchemeDataByInd({'schemeId': this.nowSchemeId, 'indId': this.currentInd.id, 'year': this.currentYear})
      },
      // 点击tree文字触发事件
      changeRadio (data) {
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite(data)
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      },
      schemeDataByInd () {
        this.initValue()
      }
    }
  }
</script>

<style scoped>
  .select-wrapper {
    font-size: 14px;
    width: auto;
    height: 100%;
    overflow: hidden;
  }
  .select-table {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 100px);
    background-color: #ffffff;
    overflow-x: hidden;
    overflow-y: scroll;
    font-size: 12px !important;
  }
  .select-year{
    width: 80px;
  }
  .select-name{
    float: left;
    margin-right: 20px;
    height: 40px;
    line-height: 40px;
    max-width: 100%;
  }
  .college-option {
    font-size: 12px;
  }
  .udss-board-toolbox {
    height: 100%;
    width: 380px;
    float: right;
    margin-left: 20px;
    overflow: hidden;
    font-size: 14px;
  }
  .udss-tree-header {
    height: 60px;
    line-height: 60px;
    color: #000000;
    text-indent: 45px;
    background-color: #F2F2F2;
  }
  .search-input {
    border-radius: 4px;
    width: calc(100% - 2px);
    height: 30px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: normal;
    text-indent: 10px;
    background: url('../../../assets/img/search.png') no-repeat;
    background-position: top 7px right 20px;
  }
  .udss-tree-node {
    flex: 1;
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-tree-body {
    height: calc(100% - 120px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .udss-tree-text {
    margin-right: 55px;
    line-height: 40px;
  }
  .is-active-line{
    color: #409EFF;
  }
  .udss-tree-button {
    line-height: 40px;
    float: right;
    margin-right: 20px;
    color: red;
    width: 20px;
    overflow: hidden;
  }
</style>
