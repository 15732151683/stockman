<template>
  <Container :title="title"  @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <!--右边搜索页面-->
      <div v-if="schemes.length > 0" class="container-right transition" :style="{width: tabShow ? '300px' : '50px'}">
        <div @click="changeShow" :class="['button-sider', {'is-active': !tabShow}]"></div>
        <transition name="slide-fade">
          <div v-show="tabShow" class="show-box">
            <div class="tab-change">
              <button :class="['tab-button', {'is-active': activeTab === 1}]" @click="changeTab(1)">{{$t('completion.college')}}</button>
              <button :class="['tab-button', {'is-active': activeTab === 2}]" @click="changeTab(2)">{{$t('completion.indicator')}}</button>
            </div>
            <div class="tab-box" v-show="activeTab == 1">
              <Table
                size="mini"
                :data="orgs"
                height="100%"
                :show-header="false"
                @row-click="clickTable"
                :row-style="tableRowStyle"
                style="width: 100%">
                <TableColumn
                  :label="$t('completion.college')">
                  <template slot-scope="scope">
                    <div class="tab-box-td">{{ scope.row.abridge }} - {{ scope.row.name }}</div>
                  </template>
                </TableColumn>
              </Table>
            </div>
            <div class="tab-box"  v-show="activeTab == 2">
              <Input
                class="search-input"
                :placeholder="$t('element.filterText')"
                v-model="filterText" />
              <div class="udss-tree-body target-tree">
                <Tree
                  :data="checkedInds"
                  :expand-on-click-node="true"
                  :props="defaultProps"
                  node-key="id"
                  :filter-node-method="filterNode"
                  ref="treeTarget">
                  <div class="udss-tree-node" slot-scope="{ node, data }" :title="node.label">
                    <div class="udss-tree-button" v-show="data.is_leaf && forbid.findIndex(node => node === data.id) > -1">
                      <Radio :label="data.id" v-model="radios" @change="showWrite(data)"></Radio>
                    </div>
                    <div :class="['udss-tree-text', 'one-line', {'is-active-line': radios === data.id}]" :title="node.label" @click="changeRadio(data)">
                      {{ node.label }}
                    </div>
                  </div>
                </Tree>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <div class="completion-left">
        <div class="completion-tool" v-if="schemes.length > 0">
          <span>目标方案</span>
          <button :title="node.name" :key="node.id" @click="changeScheme(node.id)" v-for="node in schemes" :class="['type-button', {'is-active': node.id === activeScheme}]">{{node.short_name}}</button>
          <span> &nbsp;&nbsp;&nbsp;&nbsp;评估年份&nbsp;</span>
          <DatePicker
            :clearable="false"
            v-model="selectYear"
            size="small"
            type="year"
            style="width: 100px;"
            placeholder="选择年"
            @change="changeYear"
            value-format="yyyy">
          </DatePicker>
        </div>
        <div class="completion-main" v-show="collegeTree.length > 0">
          <!--左边数据显示-->
          <div class="container-left">
            <div class="content-header">
              <!--切换算法方案-->
              <!--<div>
                <div style="float: left; margin-left: 100px;" v-show="currentView === 'home'">
                  <Button size="medium" :class="['method-type',{'method-type-active': this.methodType === 1}]" @click="changeType(1)">算法一</Button>
                  <Button size="medium" :class="['method-type',{'method-type-active': this.methodType === 2}]" @click="changeType(2)">算法二</Button>
                </div>
                <div style="float: left; font-size: 14px; margin-left: 20px;" v-show="currentView === 'home'">
                  <span v-show="this.methodType === 1">算法一：(指标完成度之和) / (指标个数)</span>
                  <span v-show="this.methodType === 2">算法二：(指标实际值之和) / (指标目标值之和)</span>
                </div>
              </div>-->
            </div>
            <div class="content-body">
              <div style="width: 100%; overflow: hidden;">
                <Button
                  plain
                  class="btn-return"
                  v-show="currentView !== 'home'"
                  @click="onNodeSelected('home', -1)" icon="fa fa-home">
                </Button>
                <div class="sort-wrapper" v-if="currentView !== 'dept'">
                  <ButtonGroup class="sort-group">
                    <Button
                      v-for="btn in sorts"
                      :key="btn.id"
                      class="btn-sort"
                      :class="{'is-select': btn.selected}"
                      size="small" @click="toggleSort(btn)"
                      :title="btn.title">
                      <span v-if="btn.id === 0">A-Z</span>
                      <span v-else class="fa" :class="btn.class"></span>
                    </Button>
                  </ButtonGroup>
                </div>
              </div>
              <div class="component-box">
                <component ref="comp" :is="currentView" :methodType="methodType" @childMethod="parentEvent"></component>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Container>
</template>

<script>
  import Dept from './partial/completion/Dept.vue'
  import Home from './partial/completion/Home.vue'
  import Target from './partial/completion/Target.vue'
  import { Container } from './widgets'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Button, ButtonGroup, Tree, Table, TableColumn, Input, Radio, DatePicker } from 'element-ui'

  export default {
    name: 'Completion',
    components: {
      Dept, Home, Target, Button, ButtonGroup, Tree, Table, TableColumn, Input, Container, Radio, DatePicker
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        activeScheme: -1,
        tabShow: true,
        radios: '',
        activeTab: 1,
        forbid: [],
        methodType: 1,
        filterText: '',
        title: '',
        currentView: 'home',
        isHome: true,
        search: '',
        sorts: [
          {
            id: 0,
            name: 'char',
            class: '',
            selected: false,
            title: this.$t('output.sortC')
          },
          {
            id: 1,
            name: 'asc',
            class: 'fa-sort-amount-asc icon-rotate',
            selected: true,
            title: this.$t('output.sortA')
          },
          {
            id: 2,
            name: 'desc',
            class: 'fa-sort-amount-asc',
            selected: false,
            title: this.$t('output.sortB')
          }
        ],
        selectYear: '2017',
        downButton: []
      }
    },
    created () {
      this.setSortMode(1)
    },
    mounted () {
      this.$nextTick(function () {
        this.selectYear = new Date().getFullYear() - 1 + ''
        this.getScheme()
        this.getCheckedInds()
        this.getCollegeTree({'id': -1, 'year': Number(this.selectYear)})
        // let timer = setInterval(() => {
        //   if (this.checkedInds.length > 0 && this.collegeTree.length > 0) {
        //     clearInterval(timer)
        //   }
        // }, 10)
        // this.$emit('mounted')
      })
    },
    methods: {
      ...mapActions('completion', ['getCollegeTree', 'getCompletionByCollege', 'getScheme', 'getCompletionByTarget', 'getCompletionByTarget2']),
      ...mapMutations('completion', ['sortTarget', 'setSortMode']),
      ...mapActions('target', ['getCheckedInds']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      // 数据下载
      downCurrentData () {
        let params = {'ids': this.activeScheme, 'year': Number(this.selectYear)}
        this.exportDataB({'name': '目标达成', 'url': '/v1/completion/exp/', 'type': 'query', 'params': params})
      },
      downAllData () {
        let arr = this.schemes.map(node => node.id).join(',')
        let params = {'ids': arr, 'year': Number(this.selectYear)}
        this.exportDataB({'name': '目标达成', 'url': '/v1/completion/exp/', 'type': 'query', 'params': params})
      },
      changeYear () {
        this.getCollegeTree({'id': this.activeScheme, 'year': Number(this.selectYear)})
      },
      changeScheme (id) {
        this.activeScheme = id
        this.getCollegeTree({'id': id, 'year': Number(this.selectYear)})
      },
      changeShow () {
        this.tabShow = !this.tabShow
      },
      tableRowStyle ({row, rowIndex}) {
        if ((rowIndex % 2) === 0) {
          return {backgroundColor: '#FFFFFF'}
        } else {
          return {backgroundColor: '#F7F7F7'}
        }
      },
      clickTable (row) {
        this.toggleTitle(row)
        this.togglePage('dept', row)
      },
      parentEvent (param, type) {
        if (type === 'dept') {
          this.toggleTitle(param)
          this.togglePage('dept', param)
        } else {
          this.toggleTitle(param)
          this.togglePage('target', param)
        }
      },
      showWrite (data) {
        this.onNodeSelected('target', data)
      },
      changeRadio (data) {
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite(data)
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      changeTab (id) {
        this.activeTab = id
      },
      // 更改标题
      toggleTitle (item) {
        this.title = this.$t('completion.title') + (item ? ' - ' + item.name : '')
      },
      // 切换显示组件
      togglePage (page, item) {
        if (page === 'home') {
          if (this.methodType === 1) {
            this.getCompletionByTarget(-1)
          }
        } else if (page === 'dept') {
          this.getCompletionByCollege(item.id)
        } else if (page === 'target') {
          this.getCompletionByTarget(item.id)
        }
        this.currentView = page
      },
      onNodeSelected (page, item) {
        if (this.forbid.findIndex(node => node === item.id) > -1) {
          this.toggleTitle(item)
          this.togglePage(page, item)
        } else if (item === -1) {
          this.toggleTitle()
          this.togglePage(page, -1)
        }
      },
      // 排序
      toggleSort ({id}) {
        for (let item of this.sorts) {
          item.selected = item.id === id
        }
        this.setSortMode(id)
        this.sortTarget()
      },
      resize () {}
    },
    computed: {
      ...mapGetters('completion', ['collegeTree', 'collegeData', 'schemes']),
      ...mapGetters('target', ['checkedInds']),
      orgs () {
        return this.collegeTree
      }
    },
    watch: {
      filterText (val) {
        this.$refs.treeTarget.filter(val)
      },
      collegeTree () {
        if (this.collegeTree.length > 0) {
          this.getCompletionByTarget(-1)
          this.currentView = 'home'
          let arr = []
          this.collegeTree.forEach(node => {
            let childArr = node.target.filter(item => item.val !== 0).map(child => child.indicator_id)
            arr = arr.concat(childArr)
          })
          this.forbid = Array.from(new Set(arr))
        } else {
          this.forbid = []
        }
      },
      schemes () {
        if (this.schemes.length > 0) {
          this.activeScheme = this.schemes[0].id
          this.downButton = [true, true, false]
        }
      }
    }
  }
</script>

<style scoped>
  .completion-left {
    width: auto;
    height: 100%;
  }
  .completion-tool{
    overflow: hidden;
    padding-bottom: 10px;
  }
  .completion-tool span {
    color: #ADADAD;
    font-size: 14px;
  }
  .completion-main{
    height: calc(100% - 60px);
  }
  .container-left {
    padding-right: 20px;
    overflow: hidden;
    height: 100%;
    min-height: 100%;
  }
  .container-right {
    width: 450px;
    float: right;
    height: 100%;
    min-height: 100%;
    background-color: #fff;
  }
  .show-box {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 40px);
  }
  .button-sider {
    cursor: pointer;
    width: 18px;
    height: 18px;
    float: right;
    background: url(../assets/img/detail.png) no-repeat;
  }
  .button-sider.is-active {
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    transform: rotate(180deg);
    filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=2);
  }
  .tab-change {
    clear: both;
    height: 40px;
    width: 100%;
  }
  .tab-button {
    float: left;
    cursor: pointer;
    width: 50%;
    line-height: 40px;
    font-size: 16px;
    color: #767474;
    outline: none;
    border: none;
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F2F2F2, #D6D6D6);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F2F2F2), color-stop(1,#D6D6D6));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F2F2F2', endColorstr='#D6D6D6', GradientType =0);
  }
  .tab-button.is-active {
    color: #000000;
    background-image: -moz-linear-gradient(top, #F4F4F4, #F4F4F4);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F4F4F4), color-stop(1,#F4F4F4));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F4F4F4', endColorstr='#F4F4F4', GradientType =0);
  }
  .tab-box {
    width: 100%;
    height: calc(100% - 40px);
    overflow: hidden;
  }
  .tab-box td {
    width: 12px;
  }
  .tab-box-td {
    cursor: pointer;
  }
  .search-input {
    margin-top: 5px;
    width: 100%;
  }
  .udss-tree-body {
    height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .udss-tree-node {
    flex: 1;
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-tree-text {
    margin-right: 55px;
    line-height: 40px;
    font-size: 14px;
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
  .content-header,
  .content-body{
    background-color: #fff;
  }
  .content-body {
    overflow: hidden;
    height: 100%;
  }
  .component-box {
    height: calc(100% - 50px);
    overflow-y: scroll;
  }
  .content-header {
    display: none;
    height: 40px;
    line-height: 40px;
  }
  .method-type:hover{
    background-color: #1EBBA6;
    border: #1EBBA6;
    color: #ffffff;
  }
  .method-type-active{
    background-color: #1EBBA6;
    border: #1EBBA6;
    color: #ffffff;
  }
  .btn-return {
    width: 50px;
    height: 34px;
    padding: 4px 13px;
    float: left;
    vertical-align: top;
    color: #1EBBA6;
    font-size: 24px;
  }
  .sort-wrapper {
    float: right;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
  }
  .sort-group {
    float: right;
  }
  .btn-sort.is-active {
    color: #3a8ee6;
  }
  .btn-sort {
    width: 60px;
    height: 34px;
    border: 1px solid #ebeef0;
    display: inline-block;
    vertical-align: top;
    cursor: pointer;
    transition: all 300ms ease;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .btn-sort:hover {
    color: #606266;
    background-color: #fff;
  }
  .btn-sort.is-select {
    border-color: #e5e5e5;
    color: #70c0ac;
    background-color: #ecf5ff;
  }
  .icon-rotate {
    transform: rotateX(180deg)
  }
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-leave-active {
    transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .transition {
    transition: all 400ms linear;
  }
  .type-button {
    cursor: pointer;
    line-height: 18px;
    font-size: 14px;
    padding: 8px 20px;
    color: #767474;
    outline: none;
    border: none;
    margin: 0 4px;
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F5F5F5, #D8D8D8);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F5F5F5), color-stop(1,#D8D8D8));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F5F5F5', endColorstr='#D8D8D8', GradientType =0);
  }
  .type-button.is-active {
    color: #ffffff;
    background-image: -moz-linear-gradient(top, #EBB747, #DBA26F);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DBA26F));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DBA26F', GradientType =0);
  }
</style>
