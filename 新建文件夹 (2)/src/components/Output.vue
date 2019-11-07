<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-if="showScheme.length > 0">
            <div class="left-button">
              <div :class="['chart-type',{'chart-type-active': this.chartType === 1}]" @click="changeType(1)">{{$t('output.chartA')}}</div>
              <div :class="['chart-type',{'chart-type-active': this.chartType === 2}]" @click="changeType(2)">{{$t('output.chartB')}}</div>
            </div>
            <div class="right-box">
              <graph v-if="chartType === 2" ref="graph" @highlight="highlight" @unhighlight="unhighlight"></graph>
              <graph2 v-if="chartType === 1" ref="graph2"></graph2>
            </div>
          </div>
          <div class="swiper-slide" v-for="(tds, index) in pages" :key="index">
            <table class="table-container" cellspacing="0" cellpadding="0">
              <tr class="table-header">
                <th v-for="th in ths" :key="th.id" :class="{'col-rank-label': th.id === 1}">
                  <span class="th-name" @click="sortChange(th)">{{th.name}}</span>
                  <div class="sort-wrapper">
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
                  :class="{'col-name': idx === 1}">
                  <div v-if="idx === 1">
                    <span class="table-name">{{col.split('-')[0]}}</span>
                  </div>
                  <div v-else-if="idx === 3" class="col-weighted">
                    <span class="list-item-number">{{col}}</span>%
                  </div>
                  <div
                    class="col-weighted"
                    v-else-if="idx === 0">
                    <span>{{col.toLocaleString()}}</span>
                  </div>
                  <div
                    class="col-weighted"
                    v-else-if="idx === 3">
                    <span class="fixed-width-total">{{col.toLocaleString()}}</span>
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
  import { Button } from 'element-ui'
  import { Container } from './widgets'
  import Graph from './partial/output/Graph.vue'
  import Graph2 from './partial/output/Graph2.vue'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.css'

  export default {
    name: 'Output',
    components: {
      Graph, Graph2, Button, Container
    },
    data () {
      return {
        title: '',
        chartType: 1,
        hoverIndex: -1,
        ths: [],
        tds: [],
        pages: [],
        pageSize: Math.floor((window.innerHeight - 250) / 50),
//        标识上一排序字段
        lastTh: {},
        downButton: []
      }
    },
    created () {
      this.setPerformance([])
      this.setActive(-1)
    },
    computed: {
      ...mapGetters('output', ['performance', 'activeScheme']),
      ...mapGetters('evaluation', ['schemes']),
      showScheme () {
        return this.schemes
      },
      table () {
        return this.performance
      }
    },
    methods: {
      ...mapActions('output', ['getPerformance']),
      ...mapActions('evaluation', ['getScheme']),
      ...mapMutations('output', ['setPerformance', 'setActive']),
      ...mapMutations('config', ['config', 'exportDataA', 'exportDataB']),
      // 数据下载
      downCurrentData () {
        let name = this.schemes.find(node => node.id === this.activeScheme).name
        this.exportDataA({'name': '综合绩效-' + name, 'url': '/v1/composite/exp/' + this.activeScheme})
      },
      downAllData () {
        let arr = this.schemes.map(node => node.id).join(',')
        let params = {'ids': arr}
        this.exportDataB({'name': '综合绩效', 'url': '/v1/composite/exp/', 'type': 'query', 'params': params})
      },
      changePage () {
        this.$router.push('/weight')
      },
      changeType (id) {
        this.chartType = id
      },
      // 组建表格标题名称以及是否有排序，sort为1就有排序
      setThs () {
        this.ths = [
          {
            id: 0,
            name: this.$t('output.rank'),
            sort: 1
          },
          {
            id: 1,
            name: this.$t('output.college'),
            sort: 1
          },
          {
            id: 2,
            name: this.$t('output.score'),
            sort: 1
          },
          {
            id: 3,
            name: this.$t('output.ratio'),
            sort: 1
          }
        ]
        this.ths = this.ths.concat(this.table[0].details.map((item, index) => {
          return {
            id: 4 + index,
            name: item.indicator_name,
            sort: 1
          }
        }))
      },
      // 组建所有td数据
      setTds () {
        let tds = []
        this.table.forEach((item, index) => {
          tds.push([item.rank, item.org_name + '-' + item.pinyin, item.val, item.ratio].concat(item.details.map(child => child.value)))
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
          if (index === 1) {
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
    mounted () {
      this.$nextTick(function () {
        this.getScheme()
        this.getPerformance(-1)
        let timer = setInterval(() => {
          if (this.performance.length > 0 && this.showScheme.length > 0) {
            this.setActive(this.showScheme[0].id)
            this.set()
            this.downButton = [true, true, false]
            clearInterval(timer)
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
//                paginationType: 'custom',
//                paginationType: 'fraction',
//                paginationBulletRender: function (swiper, index, className) {
//                  return '<span class="' + className + '">' + (index + 1) + '</span>'
//                }
              })
            }, 300)
          }
        }, 20)
        this.$emit('mounted')
      })
    },
    watch: {
      table () {
        if (this.table && this.table.length > 0) {
          this.set()
        } else {
          this.pages = []
        }
      }
    }
  }
</script>

<style scoped>
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
  .swiper-pagination-bullet{
    display: block;
    width: 40px;
    height: 40px;
    background: red;
  }
  .left-button {
    width: 30px;
    height: 100%;
    border-right: solid 3px #EEEEEE;
    overflow: hidden;
    float: left;
  }
  .right-box {
    width: auto;
    height: 100%;
    overflow: hidden;
    margin-left: 50px;
  }
  .swiper-container.swiper-container-vertical .swiper-pagination-bullet{
    display: inline-block;
    width: 50px;
    height: 50px;
    background: red;
  }
  .chart-type {
    background-color: #FFFFFF;
    font-size: 14px;
    border: none;
    outline: none;
    padding: 15px 5px;
    writing-mode: vertical-lr;
    -webkit-writing-mode: vertical-lr;
    writing-mode: vertical-lr;
    *writing-mode: vertical-lr;
    -moz-box-shadow:2px 1px 6px #333333;
    -webkit-box-shadow:2px 1px 6px #333333;
    box-shadow:2px 1px 6px #333333;
    cursor: pointer;
  }
  .chart-type-active{
    background-color: #4A90E2;
    color: #ffffff;
  }
  .list-item-number {
    width: 40px;
    display: inline-block;
    text-align: right;
  }
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
    vertical-align: middle;
    cursor: pointer;
  }
  .sort-wrapper {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    min-height: 24px;
  }
  .sort-icon {
    display: block;
    font-size: 16px;
    height: 10px;
    color: #bcbcbc;
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
    min-width: 150px;
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
    text-align: left;
    min-width: 40px;
  }
  .fixed-width-total,
  .fixed-width-target {
    display: inline-block;
    text-align: right;
  }
  .fixed-width-total {
    width: 70px;
  }
  .fixed-width-target {
    width: 60px;
  }
  @media screen and (min-width: 1440px) {
  }
</style>
