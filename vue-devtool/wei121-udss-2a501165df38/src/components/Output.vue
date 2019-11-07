<template>
  <div  class="swiper-container" style="height: 100%;">
    <div class="swiper-wrapper">
      <!--&lt;!&ndash;-->
      <div class="swiper-slide">
        <div class="container">
          <div class="container-header">
            <h2>Output</h2>
          </div>
          <div class="container-body">
            <graph ref="graph" @highlight="highlight" @unhighlight="unhighlight"></graph>
          </div>
        </div>
      </div>
      <!--&ndash;&gt;-->
      <div class="swiper-slide" v-for="tds in pages">
        <div class="container">
          <table class="table-container">
            <tr class="table-header">
              <th v-for="th in ths" :key="th.id" :class="{'col-rank-label': !th.id}">
                <!--{{th.name.substr(0, 3)}}-->
                <span v-if="th.id === 3">
                  Contribution<br/>
                  Ratio
                </span>
                <span v-else-if="th.id === 4">
                  Weighted<br/>
                  Score
                </span>
                <span v-else-if="th.id === 9">
                  International-<br/>
                  isation<br/>
                  <span class="color-light-grey">(score)</span>
                </span>
                <span v-else-if="th.id > 4">
                  {{th.name}}<br/>
                  <span class="color-light-grey">(score)</span>
                </span>
                <span v-else>
                  {{th.name}}
                </span>
                <div class="sort-wrapper">
                  <i v-show="th.sort"
                    class="fa fa-caret-up sort-icon"
                    :class="{active: th.sort === 2}"
                    title="Ascending order."
                    @click="sortTable(th, 2)"></i>
                  <i v-show="th.sort"
                    class="fa fa-caret-down sort-icon"
                    :class="{active: th.sort === 3}"
                    title="Descending order."
                    @click="sortTable(th, 3)"></i>
                </div>
              </th>
            </tr>
            <tr class="table-body" v-for="(row, index) in tds" :key="index">
              <td
                v-for="(col, idx) in row"
                :key="idx"
                class="col-common"
                :class="{'col-name': idx === 2}">
                <div v-if="idx === 1" class="table-img-wrapper">
                  <img :src="col">
                </div>
                <div v-else-if="idx === 2">
                  <span class="table-name-icon" :class="'icon-' + col.split('-')[1]"></span>&nbsp;
                  <span class="table-name">{{col.split('-')[0]}}</span>
                </div>
                <div v-else-if="idx === 3" class="col-weighted">
                  <span class="list-item-number">{{col}}</span>%
                </div>
                <div
                  class="col-weighted"
                  v-else-if="idx === 0">
                  <span>{{col}}</span>
                </div>
                <div
                  class="col-weighted"
                  v-else-if="idx === 4">
                  <span>{{col | thousandium}}</span>
                </div>
                <div v-else>
                  <span>{{col | thousandium}}</span>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Graph from './partial/output/Graph.vue'
  import Swiper from 'swiper'

  export default {
    name: 'Output',
    components: {
      Graph
    },
    data () {
      return {
        hoverOne: {
          value: [],
          details: []
        },
        hoverIndex: -1,
        hoverOneShow: false,
        table: [],
        ths: [],
        tds: [],
        pages: [],
        pageSize: Math.floor((window.innerHeight - 220) / 70),
//        标识上一排序字段
        lastTh: {}
      }
    },
    computed: {
      ...mapGetters('output', ['treeScore'])
    },
    methods: {
      ...mapActions('output', ['getTreeScore']),
      initTable () {
        const doubleBit = function (number) {
          return number >= 0 && number < 10 ? '0' + number : number
        }
        this.table = JSON.parse(JSON.stringify(this.treeScore))
        this.table.forEach((item, index) => {
          item.path = 'static/img/thumbnail' + (index < 12 ? doubleBit(index + 1) : '_common') + '.png'
        })
      },
      setThs () {
        this.ths = [
          {
            id: 0,
            name: '#RANK',
            sort: 0
          },
          {
            id: 1,
            name: '',
            sort: 0
          },
          {
            id: 2,
            name: 'ACADEMIC UNIT',
            sort: 0
          },
          {
            id: 3,
            name: 'Contribution Ratio',
            sort: 1
          },
          {
            id: 4,
            name: 'Weighted Score',
            sort: 0
          }
        ].concat(this.table[0].details.map((item, index) => {
          return {
            id: 5 + index,
            name: item.name,
            sort: 1
          }
        }))
      },
      setTds () {
        let tds = []
        this.table.forEach((item, index) => {
          tds.push([index + 1, item.path, item.abridge + '-' + item.type, item.value[1], item.value[0]]
            .concat(item.details.map(item => item.value)))
        })
        this.tds = tds
      },
      setPages () {
        let pages = []
        for (let i = 0; i < Math.ceil(this.tds.length / this.pageSize); i++) {
          pages.push(this.tds.slice(i * this.pageSize, (i + 1) * this.pageSize))
        }
        this.pages = pages
      },
      set () {
        this.setThs()
        this.setTds()
        this.setPages()
      },
      mouseOverListItem (index) {
        this.hoverOneShow = true
        this.hoverOne = this.treeScore[index]
        this.$refs.hoverOne.style.bottom = this.treeScore.length * 20 - 15 * (index - 14) - 360 + 'px'
        this.highlight(index)
      },
      mouseOutListItem (index) {
        this.hoverOneShow = false
        this.unhighlight()
      },
      sortTds (index, method) {
        this.tds.sort(function (a, b) {
          return {
            2: a[index] - b[index],
            3: b[index] - a[index]
          }[method]
        })
        this.tds.forEach((item, index) => {
          item[0] = index + 1
        })
      },
      highlight (index) {
//        高亮滑动项
        this.hoverIndex = index
      },
      unhighlight () {
        this.hoverIndex = -1
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
      resize () {
        this.$refs.graph.resize()
      }
    },
    mounted () {
      this.$nextTick(function () {
//        this.$refs.table.style.height = window.innerHeight - 310 + 'px'
        this.getTreeScore()
        let timer = setInterval(() => {
          if (this.treeScore.length > 0) {
            this.initTable()
            this.set()
            clearInterval(timer)
            setTimeout(() => {
              console.log(new Swiper('.swiper-container', {
                direction: 'vertical',
                slidesPerView: 1,
                speed: 1000,
                paginationClickable: true,
                spaceBetween: 30,
                mousewheelControl: true
              }))
            }, 300)
          }
        }, 10)
        this.$emit('mounted')
      })
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
  .swiper-slide {
    box-sizing: border-box;
  }
  .container {
    height: calc(100% - 30px);
    margin: 15px;
    user-select: none;
    cursor: default;
    overflow: hidden;
    background-color: #fff;
  }
  .container-header,
  .container-body{
    padding: 15px;
    background-color: #fff;
  }
  .container-header {
    height: 40px;
    line-height: 40px;
  }
  .container-header>h2 {
    color: #32373d;
  }
  .container-header>p {
    color: #1ebba6;
    margin: 10px 0;
  }
  .container-body {
    height: calc(100% - 100px);
  }
  .table-wrapper {
    float: right;
    width: 330px;
    position: relative;
    height: 100%;
  }
  .svg-container {
    width: 60px;
    height: 100%;
    float: left;
    position: relative;
  }
  .svg-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .college-list {
    width: 240px;
    position: absolute;
    left: 60px;
    bottom: 0;
    padding: 10px;
    list-style: none;
    border: 1px solid rgba(119, 119, 119, .3);
  }
  .college-list-item {
    height: 24px;
    min-height: 24px;
    line-height: 24px;
    color: #999;
    cursor: pointer;
  }
  .college-list-item.is-active {
    color: #555;
  }
  .college-list-item>span {
    display: inline-block;
    vertical-align: top;
  }
  .college-list-item>span:nth-child(1) {
    width: 70%;
    font-size: 12px;
  }
  .college-list-item>span:nth-child(2) {
    width: 24%;
    margin-left: 4%;
    font-size: 12px;
  }
  .list-item-number {
    width: 35px;
    display: inline-block;
    text-align: right;
  }
  .tooltip-box {
    position: absolute;
    left: -181px;
    background-color: #fff;
    padding: 10px 15px;
    color: #7b7b7b;
    z-index: 1050;
    border: 1px solid #c5c5c5;
  }
  .table-container {
    width: 100%;
    color: #787878;
    font-size: 14px;
  }
  .table-header>th {
    font-weight: 400;
    height: 60px;
    position: relative;
    padding-left: 10px;
    border-bottom: 5px solid #eff3f6;
    text-align: left;
  }
  .sort-wrapper {
    position: absolute;
    top: 16px;
    left: 0;
    width: 10px;
    min-height: 24px;
  }
  .sort-icon {
    display: block;
    height: 12px;
    color: #bcbcbc;
    cursor: pointer;
  }
  .fa.active {
    color: #1ebba6;
  }
  .table-body {
    height: 70px;
  }
  .table-body>td {
    border-bottom: 3px solid #eff3f6;
  }
  .table-img-wrapper>img {
    margin: 5px 20px;
    height: 50px;
  }
  .table-name-icon {
    width: 18px;
    height: 18px;
  }
  .table-name {
    width: calc(100% - 30px);
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .icon-dept {
    background: url(../assets/img/icon-dept.png) no-repeat;
  }
  .icon-fac {
    background: url(../assets/img/icon-fac.png) no-repeat;
  }
  .col-common {
    text-align: center;
  }
  .col-weighted {
    font-weight: 600;
  }
  .col-name>div {
    min-width: 250px;
    /* 校正col-common */
    text-align: left;
    height: 20px;
    line-height: 20px;
  }
  .col-name>div>span {
    display: inline-block;
    vertical-align: top;
  }
  .col-rank-label {
    padding-left: 5px;
    min-width: 40px;
  }
  .color-light-grey {
    color: #bcbcbc;
  }
  @media screen and (min-width: 1440px) {
    .table-wrapper {
      width: 420px;
    }
    .college-list {
      width: 300px;
    }

    .college-list-item {
      height: 30px;
      min-height: 30px;
      line-height: 30px;
    }

    .college-list-item>span:nth-child(1) {
      width: 70%;
      font-size: 14px;
    }
    .college-list-item>span:nth-child(2) {
      width: 24%;
      margin-left: 4%;
      font-size: 18px;
    }
  }
</style>
