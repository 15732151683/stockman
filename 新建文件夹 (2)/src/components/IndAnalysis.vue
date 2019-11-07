<template>
  <Container :title="title" :showDownload="downButton" @downDataA="downCurrentData">
    <template slot="header"></template>
    <template slot="main">
      <div  class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <div class="udss-board-toolbox transition" :style="{width: tabShow ? '300px' : '50px'}">
              <div @click="changeTab" :class="['button-sider', {'is-active': !tabShow}]"></div>
              <transition name="slide-fade">
                <div style="height: calc(100% - 60px);margin-top: 25px" v-show="tabShow">
                  <div class="tab-change">
                    <button :class="['tab-button', {'is-actives': activeTab === 1}]" @click="activeTab = 1">指标</button>
                    <button :class="['tab-button', {'is-actives': activeTab === 2}]" @click="activeTab = 2">院系</button>
                  </div>
                  <div v-show="activeTab === 1" style="margin-top: 10px; height: calc(100% - 20px)">
                    <div class="udss-tree-header"><strong>{{$t('writeInd.indicator')}}</strong></div>
                    <input
                      class="search-input"
                      :placeholder="$t('element.filterText')"
                      v-model="filterText" />
                    <div class="udss-tree-body target-tree" @mousewheel.stop="">
                      <Tree
                        :data="checkedInds"
                        :default-expanded-keys="expandedArray"
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
                  <div v-show="activeTab === 2" style="margin-top: 10px;height: calc(100% - 20px)">
                    <SideTable2
                      @handleChange="checkedChange"
                      :colleges="colleges"
                      :collegeTag="collegeTag"
                      :allData="table"
                    >
                    </SideTable2>
                  </div>
                </div>
              </transition>
            </div>
            <div class="main-box">
              <div style="overflow: hidden">
                <button :class="['chart-type',{'chart-type-active': this.chartType === 1}]" @click="changeType(1)">{{$t('output.chartA')}}</button>
                <button :class="['chart-type',{'chart-type-active': this.chartType === 2}]" @click="changeType(2)">{{$t('output.chartB')}}</button>
                <DatePicker
                  :clearable="false"
                  v-model="selectYear"
                  type="year"
                  style="width: 100px;"
                  placeholder="选择年"
                  @change="changeYear"
                  value-format="yyyy">
                </DatePicker>
              </div>
              <div class="graph-box">
                <graph v-if="chartType === 2" ref="graph" @highlight="highlight" @unhighlight="unhighlight"></graph>
                <graph2 v-if="chartType === 1" ref="graph2"></graph2>
              </div>
            </div>
          </div>
          <div class="swiper-slide" v-for="(tds, index) in pages" :key="index">
            <table class="table-container" cellspacing="0" cellpadding="0">
              <tr class="table-header">
                <th v-for="(th, thIndex) in ths" :key="th.id" :class="{'col-rank-label': !th.id}">
                  <span v-if="thIndex === 5" v-show="!currentInfo.is_ratio && !currentInfo.is_percent" class="th-name" @click="sortChange(th)">{{th.name}}</span>
                  <span v-if="thIndex === 6" v-show="!currentInfo.is_ratio && !currentInfo.is_percent" class="th-name" @click="sortChange(th)">{{th.name}}</span>
                  <span v-if="thIndex !== 5 && thIndex !== 6" class="th-name" @click="sortChange(th)">{{th.name}}</span>
                  <div class="sort-wrapper" v-show="!currentInfo.is_ratio && !currentInfo.is_percent" v-if="thIndex === 5">
                    <i v-show="th.sort"
                       class="fa fa-caret-up sort-icon"
                       :class="{active: th.sort === 2}"
                       :title="$t('output.sortA')"
                       @click="sortTable(th, 2)"></i>
                    <i v-show="th.sort"
                       class="fa fa-caret-down sort-icon"
                       :class="{active: th.sort === 3}"
                       :title="$t('output.sortB')"
                       @click="sortTable(th, 3)"></i>
                  </div>
                  <div class="sort-wrapper" v-show="!currentInfo.is_ratio && !currentInfo.is_percent" v-else-if="thIndex === 6">
                    <i v-show="th.sort"
                       class="fa fa-caret-up sort-icon"
                       :class="{active: th.sort === 2}"
                       :title="$t('output.sortA')"
                       @click="sortTable(th, 2)"></i>
                    <i v-show="th.sort"
                       class="fa fa-caret-down sort-icon"
                       :class="{active: th.sort === 3}"
                       :title="$t('output.sortB')"
                       @click="sortTable(th, 3)"></i>
                  </div>
                  <div class="sort-wrapper" v-else>
                    <i v-show="th.sort"
                       class="fa fa-caret-up sort-icon"
                       :class="{active: th.sort === 2}"
                       :title="$t('output.sortA')"
                       @click="sortTable(th, 2)"></i>
                    <i v-show="th.sort"
                       class="fa fa-caret-down sort-icon"
                       :class="{active: th.sort === 3}"
                       :title="$t('output.sortB')"
                       @click="sortTable(th, 3)"></i>
                  </div>
                </th>
              </tr>
              <tr class="table-body" v-for="(row, index) in tds" :key="index">
                <td
                  v-for="(col, idx) in row"
                  :key="idx"
                  class="col-common"
                  :class="{'col-name': idx === 0}">
                  <div v-if="idx === 0">
                    <span class="table-name">{{col.split('-')[0]}} </span>
                  </div>
                  <div v-else-if="idx === 2" class="col-weighted">
                    <span class="list-item-number">{{col.toLocaleString()}}</span>
                  </div>
                  <div
                    class="col-weighted"
                    v-else-if="idx === 3">
                    <span class="fixed-width-total">{{col.toLocaleString()}}</span>
                  </div>
                  <div v-else-if="idx === 5" v-show="!currentInfo.is_ratio && !currentInfo.is_percent">
                    <span  class="fixed-width-target">{{col.toLocaleString()}}</span>
                  </div>
                  <div v-else-if="idx === 6" v-show="!currentInfo.is_ratio && !currentInfo.is_percent">
                    <span  class="fixed-width-target">{{col.toLocaleString()}}</span>
                  </div>
                  <div v-else-if="idx === 1">
                    <span v-if="currentInfo.is_percent" class="fixed-width-target">{{(col * 100).toLocaleString() + '%'}}</span>
                    <span v-else class="fixed-width-target">{{col.toLocaleString()}}</span>
                  </div>
                  <div v-else>
                    <span class="fixed-width-target">{{col.toLocaleString()}}</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio, DatePicker } from 'element-ui'
  import { Container, SideTable2 } from './widgets'
  import Graph from './partial/indAnalysis/Graph.vue'
  import Graph2 from './partial/indAnalysis/Graph2.vue'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'

  export default {
    name: 'IndAnalysis',
    components: {
      Graph, Graph2, Container, Input, Button, Select, Option, Tree, Dialog, Table, TableColumn, Radio, DatePicker, SideTable2
    },
    data () {
      return {
        title: '',
        hoverOne: {
          value: [],
          details: []
        },
        tabShow: true,
        filterText: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        activeTab: 1,
        radios: '',
        currentInd: 1185,
        chartType: 1,
        hoverIndex: -1,
        hoverOneShow: false,
        ths: [],
        tds: [],
        pages: [],
        pageSize: Math.floor((window.innerHeight - 250) / 50),
//        标识上一排序字段
        lastTh: {},
        selectYear: '',
        expandedArray: [],
        downButton: [true, true, false],
        requestCount: 0
      }
    },
    created () {
      this.setAnalysisData([])
      this.setTagCheck([])
    },
    computed: {
      ...mapGetters('output', ['treeScore', 'performance']),
      ...mapGetters('target', ['checkedInds']),
      ...mapGetters('indAnalysis', ['analysisData', 'currentInfo']),
      table () {
        return this.analysisData
      },
      collegeTag () {
        let arr = []
        this.analysisData.forEach(node => {
          if (node.tags && node.tags.length > 0) {
            node.tags.forEach(tag => {
              arr.findIndex(child => child.id === tag.id) < 0 && arr.push(tag)
            })
          }
        })
        arr.forEach(node => {
          this.$set(node, 'active', true)
        })
        arr.sort((a, b) => {
          return a.id - b.id
        })
        return arr
      },
      colleges () {
        let arr = []
        arr = this.analysisData
        return arr
      }
    },
    methods: {
      ...mapActions('output', ['getTreeScore', 'getPerformance']),
      ...mapActions('indAnalysis', ['getAnalysisData']),
      ...mapMutations('config', ['exportDataA']),
      ...mapMutations('indAnalysis', ['setAnalysisData', 'setTagCheck']),
      ...mapActions('target', ['getCheckedInds']),
      // 数据下载
      downCurrentData () {
        if (this.currentInd) {
          this.exportDataA({'name': '指标分析', 'url': 'v1/ind/' + this.currentInd + '/excdata?year=' + this.selectYear})
        }
      },
      checkedChange (val) {
        this.setTagCheck(val)
      },
      changeYear () {
        this.getAnalysisData({'id': this.currentInd, 'year': Number(this.selectYear)})
      },
      changeTab () {
        this.tabShow = !this.tabShow
        setTimeout(() => {
          this.resize()
        }, 400)
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      showWrite (data) {
        this.expandedArray = []
        this.currentInd = data.id
        this.getAnalysisData({'id': this.currentInd, 'year': Number(this.selectYear)})
      },
      // 点击tree文字触发事件
      changeRadio (data) {
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite(data)
        }
      },
      // 更改标题
      toggleTitle (item) {
        let unit = item.unit === '无' ? '' : ' (' + item.unit + ') '
        this.title = this.$t('analysis.title') + (item ? ' - ' + item.name : '') + unit
      },
      changeType (id) {
        this.chartType = id
      },
      // 组建表格标题名称以及是否有排序，sort为1就有排序
      setThs () {
        this.ths = [
          {
            id: 0,
            name: this.$t('analysis.college'),
            value: 'name',
            sort: 1
          },
          {
            id: 1,
            name: this.$t('analysis.data'),
            value: 'val',
            sort: 1
          },
          {
            id: 2,
            name: this.$t('analysis.rank'),
            value: 'rank',
            sort: 1
          },
          {
            id: 3,
            name: this.$t('analysis.year'),
            value: 'year',
            sort: 1
          },
          {
            id: 4,
            name: this.$t('analysis.number'),
            value: 'number',
            sort: 1
          },
          {
            id: 5,
            name: this.$t('analysis.ave'),
            value: 'ave',
            sort: 1
          },
          {
            id: 6,
            name: this.$t('analysis.aveRank'),
            value: 'aveRank',
            sort: 1
          }
        ]
      },
      // 组建所有td数据
      setTds () {
        let tds = []
        this.table.forEach((item, index) => {
          tds.push([item.org_name + '-' + item.org_pinyin, item.ind_val, item.org_rank, this.selectYear, item.teacher_data[0].teacher, item.teacher_data[0].teacher_avg, item.teacher_data[0].teacher_avg_rank])
        })
        this.tds = tds
      },
      // 根据pagesize设置table分成多少页，屏幕大小改变页数会变化
      setPages () {
        let pages = []
        for (let i = 0; i < Math.ceil(this.tds.length / this.pageSize); i++) {
          pages.push(this.tds.slice(i * this.pageSize, (i + 1) * this.pageSize))
        }
        this.pages = pages
      },
      // 初始化表格显示数据，分页完成
      set () {
        this.setThs()
        this.setTds()
        this.setPages()
      },
      // 设置排序
      sortTds (index, method) {
        this.tds.sort(function (a, b) {
          if (index === 0) {
            return {
              2: a[index].split('-')[1] > b[index].split('-')[1] ? 1 : -1,
              3: b[index].split('-')[1] > a[index].split('-')[1] ? 1 : -1
            }[method]
          } else {
            return {
              2: a[index] - b[index],
              3: b[index] - a[index]
            }[method]
          }
        })
        // this.tds.forEach((item, index) => {
        //   item[0] = index + 1
        // })
      },
      //      0:none; 1:normal; 2:up; 3:down;
      sortTable (th, method) {
        if (th.sort === method) {
          th.sort = 1
          this.setTds()
        } else {
          this.lastTh.sort = 1
          th.sort = method
          this.lastTh = th
          this.sortTds(th.id, method)
        }
        this.setPages()
      },
      sortChange (th) {
        if (th.sort === 3) {
          th.sort = 1
          this.setTds()
        } else {
          this.lastTh.sort = th.sort
          th.sort = th.sort + 1
          this.lastTh = th
          this.sortTds(th.id, th.sort)
        }
        this.setPages()
      },
      highlight (index) {
//        高亮滑动项
        this.hoverIndex = index
      },
      unhighlight () {
        this.hoverIndex = -1
      },
      resize () {
        if (this.chartType === 1) {
          this.$refs.graph2.resize()
        } else {
          this.$refs.graph.resize()
        }
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      },
      analysisData () {
        if (this.analysisData && this.analysisData.length > 0) {
          this.selectYear = this.currentInfo.year ? this.currentInfo.year + '' : ''
          this.set()
        } else {
          this.selectYear = this.currentInfo.year ? this.currentInfo.year + '' : ''
          this.pages = []
        }
        this.selectYear = this.currentInfo.year ? this.currentInfo.year + '' : ''
        this.requestCount !== 0 && this.toggleTitle(this.currentInfo)
        this.requestCount += 1
      }
    },
    mounted () {
      this.title = this.$route.meta.title
      this.$nextTick(function () {
        let info = JSON.parse(window.sessionStorage.getItem('udssInfo'))
        this.radios = info.analysis_def_ind
        this.currentInd = info.analysis_def_ind
        this.expandedArray = [info.analysis_def_ind]
        this.getCheckedInds()
        this.getAnalysisData({'id': this.radios, 'year': -1})
        if (this.analysisData.length > 0) {
          this.set()
        }
        setTimeout(() => {
          return new Swiper('.swiper-container', {
            direction: 'vertical',
            slidesPerView: 1,
            speed: 1000,
            spaceBetween: 30,
            observer: true,
            observeParents: true,
            mousewheelControl: true,
            pagination: '.swiper-pagination',
            paginationClickable: true
//                paginationType: 'fraction',
//            paginationBulletRender: function (swiper, index, className) {
//              return '<span class="' + className + '">' + (index + 1) + '</span>'
//            }
          })
        }, 300)
        this.$emit('mounted')
      })
    }
  }
</script>

<style scoped>
  .button-sider {
    margin-bottom: 1px;
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
  .swiper-container {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  .swiper-wrapper {
    height: 100%;
  }
  .swiper-slide {
    height: 100%;
    box-sizing: border-box;
  }
  .main-box {
    width: auto;
    overflow: hidden;
    height: 100%;
  }
  .graph-box {
    height: calc(100% - 40px);
    overflow: hidden;
  }
  .chart-type {
    background-color: #E3E3E3;
    border: none;
    outline: none;
    padding: 10px 20px;
  }
  .chart-type:hover{
    background-color: #1EBBA6;
    color: #ffffff;
  }
  .chart-type-active{
    background-color: #1EBBA6;
    color: #ffffff;
  }
  /*-------------*/
  .udss-board-toolbox {
    padding-left: 20px;
    height: 100%;
    float: right;
    overflow: hidden;
    font-size: 14px;
  }
  .udss-tree-header {
    height: 40px;
    line-height: 40px;
    color: #000000;
    text-indent: 45px;
    background-color: #F2F2F2;
  }
  .search-input {
    border-radius: 4px;
    width: calc(100% - 2px);
    height: 38px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 48px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 8px right 20px;
  }
  .udss-tree-node {
    flex: 1;
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-tree-body {
    height: calc(100% - 80px);
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
  .tab-button{
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
  .is-actives{
    background: #F3F3F3;
  }
  .udss-tree-button {
    line-height: 40px;
    float: right;
    margin-right: 20px;
    color: red;
    width: 20px;
    overflow: hidden;
  }
  /*table表格格式*/
  .table-container {
    width: 100%;
    font-size: 14px;
  }
  .table-container td{
    border-bottom: solid #DBDBDB 1px;
    color: #787878;
  }
  .table-header>th {
    font-weight: 700;
    height: 60px;
    background-color: #F2F2F2;
    border-bottom: solid 1px #DBDBDB;
  }
  .th-name {
    display: inline-block;
    cursor: pointer;
    vertical-align: middle;
  }
  .sort-wrapper {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    min-height: 24px;
  }
  .sort-icon {
    display: block;
    height: 10px;
    color: #bcbcbc;
    font-size: 16px;
    cursor: pointer;
  }
  .fa.active {
    color: #409EFF;
  }
  .table-body {
    height: 50px;
  }
  .table-body:nth-child(odd) {
    background-color: #F7F7F7;
  }
  .table-img-wrapper>img {
    margin: 5px 20px;
    height: 50px;
  }
  .table-name {
    width: calc(100% - 30px);
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .col-common {
    text-align: center;
  }
  .col-weighted {
    font-weight: 600;
  }
  .col-name>div {
    min-width: 200px;
    text-align: left;
    height: 20px;
    text-indent: 10px;
    line-height: 20px;
  }
  .col-name>div>span {
    display: inline-block;
    vertical-align: top;
  }
  .col-rank-label {
    padding-left: 20px;
    min-width: 40px;
    text-align: left;
  }
  .tab-change{
    height: 40px;
  }
  .fixed-width-total,
  .fixed-width-target {
    display: inline-block;
    text-align: center;
  }
  .fixed-width-total {
    width: 70px;
  }
  .fixed-width-target {
    width: 60px;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
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
</style>
