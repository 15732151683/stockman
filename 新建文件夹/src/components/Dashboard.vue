<template>
  <Container2 :title="title">
    <template slot="header"></template>
    <template slot="main">
      <div  style="height: 100%; overflow: auto; width: 100%;">
        <!--top5-->
        <div style="overflow: hidden;">
          <Row :gutter="14" class="top5-row" >
            <Col style="margin-bottom: 15px"
              :span="12"
              v-for="(node, index) in top5Data"
              :key="index">
            <div :class="['top5-col','top5-col-' + index]" v-if="node">
              <div class="top5-top">
                <div class="top5-top-text">
                  <span>TOP5</span>
                  <h2>{{node.name}}</h2>
                </div>
                <div class="top5-top-direction" @click="redirect(node.viewPath)">
                  <span style="float: left">更多</span>
                  <!--<div class="top5-more" ></div>-->
                  <img class="top5-more" src="../assets/img/gengduo.png" alt="">
                </div>
              </div>
              <div class="top5-footer">
                <div class="top5-list" v-for="(item, idx) in node.details" v-if="node.details" :key="idx">
                    <span class="top5-list-div" :title="item.org_name" v-if="item.abridge">{{item.abridge}}</span>
                    <span class="top5-list-div" :title="item.org_name" v-if="item.short_name">{{item.short_name}}</span>
                    <span class="top5-list-div" :title="item.org_name" v-if="item.org_short_name">{{item.org_short_name}}</span>
                    <div class="top5-list-progress">
                      <div class="top5-list-detail" :style="{width: (item.percent > 1 ? item.percent : 1) + '%',  marginRight:  10 + 'px'}"></div>
                      <div v-if="index === 3" >{{Math.round(item.ratio * 100) + '%'}}</div>
                      <div v-if="index === 2" >{{item.ratio.toLocaleString()}}</div>
                      <div v-if="item.val" >{{item.val.toLocaleString()}}</div>
                      <div v-if="index === 1" >{{item.ratio.toLocaleString()}}</div>
                    </div>
                  </div>
              </div>
            </div>
            </Col>
          </Row>
        </div>
        <!--第四轮-->
        <div style="overflow: hidden;">
          <Row :gutter="14" class="subject-row" >
            <Col
              :span="6"
              v-for="(node, index) in sbjAllData"
              :key="index">
            <div class="subject-col">
              <div class="subject-top">
                <div class="subject-top-change">
                  <Selected3
                    :currentYear="node.present_year"
                    :keys="index"  :allYear="node"
                    @sendYear3="getYear3" >
                  </Selected3>
                  <Button
                    @click="getVal(node, index)"
                    class="changInd">
                    指标切换
                  </Button>
                </div>
                <div class="subject-top-right">
                  <div>
                    <span style="font-size:12px;">{{node.ind_name}}</span>
                  </div>
                  <div class="ranking" v-show="node.currentDate && node.currentDate.ranking_val !== 0">
                    #{{node.currentDate && node.currentDate.ranking_val}}
                    <i :class="['iconfont', 'icon-' + (node.currentDate ? node.currentDate.status : '')]"></i>
                  </div>
                </div>
              </div>
              <!--显示隐藏-->
              <div>
                <div class="top5-top">
                  <div class="top5-top-text">
                    <span>TOP5</span>
                  </div>
                </div>
                <div class="header-top52">
                  <div class="top5-footer">
                    <div class="top5-list"  v-for="(item, idx) in node.org_ind_data" v-if="item" :key="idx">
                      <div class="top5-list-title" style="color: #0067C1">
                        <span :title="item.name" class="top5-list-span">{{item.short_name_cn}}</span>
                        <div  class="top5-list-progress">
                          <div  :style="{width: (item.ration > 1 ? item.ration : 1) + '%', marginRight: item.ration === 0 ? 10 + 'px' : 10 + 'px'}"
                               class="progress-ration"></div>
                          <div class="top5-list-num">{{(item.val).toFixed(node.decimals)}}&nbsp({{item.ration + '%'}})</div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              </div>
            </div>
            </Col>
            <div>
              <Dialog
                :before-close="handleClose"
                title="指标详情"
                :visible.sync="dialogTableVisible"
              >
                <div class="target-tree">
                  <div style="margin-top: 5px;height: 50px">
                    <Input
                      class="search-input"
                      :placeholder="$t('element.filterText')"
                      v-model="filterText">
                    </Input>
                  </div>
                  <Tree  v-if="dialogTableVisible === true"
                         :data="checkedInds"
                         node-key="id"
                         expand-on-click-node
                         :default-expanded-keys="defaultExpanded"
                         :props="defaultProps"
                         :filter-node-method="filterNode"
                         ref="tree">
                    <div class="udss-tree-node" slot-scope="{ node, data }" :title="node.label">
                      <div class="udss-tree-button" v-show="data.is_leaf">
                        <Radio :label="data.id"  v-model="radios" @change="showWrite2(data)"></Radio>
                      </div>
                      <div :class="['udss-tree-text', 'one-line', {'is-active-line': radios === data.id}]" :title="node.label" @click="changeRadio(node,data)">
                        {{ node.label }}
                      </div>
                    </div>
                  </Tree>
                </div>
                <div slot="footer" class="dialog-footer">
                  <Button size="mini" type="text"  @click="cancel()">取消</Button>
                  <Button type="primary" :loading="editSave"  size="mini" @click="confirm()">确定</Button>
                </div>
              </Dialog>
            </div>
            <div>
            </div>
          </Row>
        </div>
      </div>
    </template>
  </Container2>
</template>
<script>
  import { Container2, Selected3 } from './widgets'
  import { Row, Col, Progress, Select, Option, Dialog, Input, Tree, Radio, Button, Message } from 'element-ui'
  import { mapActions, mapGetters } from 'vuex'
  export default {
    name: 'Dashboard',
    components: {
      Container2, Row, Col, Progress, Select, Option, Selected3, Input, Dialog, Tree, Radio, Message, Button
    },
    data () {
      return {
        isTr: false,
        dialogTableVisible: false,
        filterText: '',
        editSave: false,
        radios: [],
        createVisible: true,
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        defaultExpanded: [],
        univIndex: 0,
        presentYear: -1,
        evaSchemeId: -1,
        currentYear: 2018,
        title: '',
        cards: [
          {
            id: 0,
            viewPath: '/output',
            name: '综合绩效'
          },
          {
            id: 1,
            viewPath: '/outIn',
            name: '投入产出'
          },
          {
            id: 2,
            viewPath: '/perCapita',
            name: '师均表现'
          },
          {
            id: 3,
            viewPath: '/completion',
            name: '目标达成'
          }
        ],
        inds: '',
        disabledRadios: [921, 922]
      }
    },
    computed: {
      ...mapGetters('dashboard', ['tagId', 'top', 'sbj0', 'sbj', 'sbjAll', 'sbj2', 'sbj3']),
      ...mapGetters('target', ['checkedInds']),
      top5Data () {
        let arr = []
        let keys = ['pro_composites', 'inputout_ratio', 'percapita', 'completions']
        keys.forEach(item => {
          if (this.top[item]) {
            arr.push(this.top[item])
          } else {
            arr.push([])
          }
        })
        if (arr.length > 0 && arr) {
          if (arr[3]) {
            arr[3].forEach(node => { node.ratio = node.ratio_final })
          }
          arr.forEach((node, index) => {
            let total = []
            node[0] ? total = node[0].ratio * [1.3, 1.2, 1.4, 1.1][index] : total = []
            node.forEach(item => {
              if (item) {
                item.total = total
                item.percent = (item.ratio / total * 100).toFixed(2) * 1
              }
            })
          })
          arr = arr.map((node, index) => {
            return {
              name: this.cards[index].name,
              viewPath: this.cards[index].viewPath,
              details: node
            }
          })
        }
        return arr
      },
      sbjAllData () {
        let arr = []
        arr.push(this.sbj0, this.sbj, this.sbj2, this.sbj3)
        arr.forEach((node, index) => {
          this.$set(node, 'dialogTableVisible', false)
          if (node.year_data_list) {
            let date = node.year_data_list.find(item => item.year === node.present_year)
            node.currentDate = []
            node.currentDate = date
          }
          if (node.present_year === -1) {
            node.present_year = ''
          }
        })
        return arr
      }
    },
    methods: {
      ...mapActions('dashboard', ['getTagId', 'getTop', 'getSbj0', 'getSbj1', 'getSbj2', 'getSbj3', 'getSbjAll', 'updates']),
      ...mapActions('target', ['getCheckedInds']),
      getVal (val, index) {
        this.dialogTableVisible = true
        if (this.sbj0.present_ind_id === undefined && this.sbj.present_ind_id === undefined && this.sbj2.present_ind_id === undefined && this.sbj3.present_ind_id === undefined) {
          this.inds = [{id: -1}, {id: -1}, {id: -1}, {id: -1}]
        } else {
          var s = this.sbjAllData
          s.forEach(item => {
            if (item.present_ind_id === undefined) {
              item.present_ind_id = -1
            }
          })
          this.inds = s.map(item => {
            return {id: item.present_ind_id, name: item.ind_name}
          })
          if (this.sbjAllData[index] === -1) {
            this.defaultExpanded = []
            this.radios = ''
          } else {
            this.defaultExpanded = [this.inds[index].id]
            this.radios = this.inds[index].id
          }
        }
        this.inds[index].indx = index + 1
      },
      changeRadio (node, data) {
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite2(data)
        }
      },
      showWrite2 (val) {
        this.inds.forEach(item => {
          if (item.indx !== undefined) {
            item.id = val.id
            item.name = val.name
          }
        })
      },
      confirm (node) {
        var al = false
        var h = this.inds.find(item => {
          return item.indx
        })
        var a = this.inds.filter(item => {
          if (item.indx === undefined) {
            return item
          }
        })
        a.forEach(item => {
          if (item.id === h.id) {
            al = true
          }
        })
        if (al === true) {
          if (h.id === -1) {
            Message({
              type: 'error',
              message: `不能添加空指标!`
            })
          } else {
            Message({
              type: 'error',
              message: `${h.name}已添加!`
            })
          }
        } else {
          new Promise((resolve, reject) => {
            this.editSave = true
            this.updates({payload: this.inds, resolve, reject})
          }).then(() => {
            this.inds = []
            this.dialogTableVisible = false
            this.editSave = false
            if (h.indx - 1 === 0) {
              this.getSbj0({indId: h.id, year: -1})
            }
            if (h.indx - 1 === 1) {
              this.getSbj1({indId: h.id, year: -1})
            }
            if (h.indx - 1 === 2) {
              this.getSbj2({indId: h.id, year: -1})
            }
            if (h.indx - 1 === 3) {
              this.getSbj3({indId: h.id, year: -1})
            }
          }).catch(() => {
            this.editSave = false
          })
        }
      },
      handleClose (val) {
        this.cancel(val)
      },
      cancel (val) {
        this.dialogTableVisible = false
        this.filterText = ''
      },
      redirect (url) {
        this.$router.push({path: url})
      },
      getYear3 (val, index) {
        if (index === 0) {
          this.getSbj0({indId: this.tagId[0].indicator_id, year: val})
        }
        if (index === 1) {
          this.getSbj1({indId: this.tagId[1].indicator_id, year: val})
        }
        if (index === 2) {
          this.getSbj2({indId: this.tagId[2].indicator_id, year: val})
        }
        if (index === 3) {
          this.getSbj3({indId: this.tagId[3].indicator_id, year: val})
        }
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      }
    },
    mounted () {
      new Promise((resolve, reject) => {
        this.getTagId({resolve, reject})
      }).then((data) => {
//        console.log(data.data)
        if (data.data.length > 0) {
          if (data.data[0].indicator_id > -1) {
            this.getSbj0({indId: data.data[0].indicator_id, year: -1})
          }
          if (data.data[1].indicator_id > -1) {
            this.getSbj1({indId: data.data[1].indicator_id, year: -1})
          }
          if (data.data[2].indicator_id > -1) {
            this.getSbj2({indId: data.data[2].indicator_id, year: -1})
          }
          if (data.data[3].indicator_id > -1) {
            this.getSbj3({indId: data.data[3].indicator_id, year: -1})
          }
        }
      }).catch(() => {
      })
      this.getTop()
      this.getCheckedInds()
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    }
  }
</script>
<style scoped>
  .changInd{
    cursor: pointer;
    outline: none;
    border: none;
    padding: 0;
    font-size:12px;
    color: #898989;
  }
  .target-tree{
    height: 400px;
    /*height: calc(100% - 100px);*/
    font-size:14px;
    overflow: hidden;
    overflow-y: scroll
  }
  .udss-tree-node {
    flex: 1;
    line-height: 40px;
    display: inline-block;
    padding-right: 2px;
    /*text-overflow: ellipsis;*/
    overflow: hidden;
  }
  .udss-tree-button {
    line-height: 40px;
    float: right;
    margin-right: 20px;
    color: red;
    width: 20px;
    overflow: hidden;
  }

  .udss-tree-text {
    margin-right: 55px;
    line-height: 40px;
  }
  .top5-footer{
    display: flex;
    flex-flow: column;
    height: 158px;
    padding-top: 8px;
  }
  .iconfont{
    margin-left: 10px;
    font-size:12px;
  }
  .search-input{
    width: 50%;
    margin-left: 25px;
    outline: none;
    border-radius: 4px;
  }
  .subject-row{
    padding: 2px 5px 2px 5px;
    overflow: hidden;
  }
  .subject-col{
    height: 270px;
    padding: 8px 30px 0px;
    background-color: #FFFFFF;
    -moz-box-shadow:1px 1px 1px 2px #E2E5E7;
    -webkit-box-shadow:1px 1px 1px 2px #E2E5E7;
    box-shadow:1px 1px 1px 2px #E2E5E7;
    overflow: hidden;
  }
  .subject-top {
    overflow: hidden;
    height: 55px;
  }
  .subject-top-change{
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center
  }
  .subject-top-right {
    margin-top: 2px;
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
    color: #9B9B9B;
  }
  .subject-top-right span{
    float: left;
    font-size: 12px;
  }
  .subject-top-right div{
    float: left;
    margin-left: 2px;
  }
  .top5-row {
    padding: 2px 5px 2px 5px;
    overflow: hidden;
  }
  .ranking{
    text-align: right;
    float: right;
    display: flex;
    flex-flow: row;
    color: #515151;
    font-size: 18px;
    justify-content: space-between;
    align-items: center;
  }
  .top5-col{
    height: 210px;
    padding: 5px 30px 0;
    background-color: #FFFFFF;
    -moz-box-shadow:1px 1px 1px 2px #E2E5E7;
    -webkit-box-shadow:1px 1px 1px 2px #E2E5E7;
    box-shadow:1px 1px 1px 2px #E2E5E7;
  }
  .Col{
    margin-top: 20px;
  }
  .header-top52{
    /*margin-top: 5px;*/
    /*border-top: none;*/
    /*!*height: 175px;*!*/
    /*background-color: #FFFFFF;*/
  }
  .top5-top {
    overflow: hidden;
    height: 20px;
    line-height: 20px;
    padding-top: 2px;
    padding-bottom: 5px;
    border-bottom: solid 1px #E2E2E2;
  }
  .top5-top-text {
    float: left;
    display: flex;flex-flow: row;justify-content: space-between;
    align-items: center;
  }
  .top5-top-text h2 {
    display: inline-block;
    font-size: 15px;
    font-weight: 900;
    /*color: #515151;*/
  }
  .icon-1{
    color: #E21943;
  }

  .icon--1{
    color: #1EBBA6;
  }
  .icon-0{
    color: #4A4A4A;
  }
  .top5-top-text span {
    display: inline-block;
    width: 45px;
    margin-right: 5px;
    color: #FFFFFF;
    font-size: 12px;
    text-align: center;
    border-radius: 5px;
    background:-moz-linear-gradient(left,#71E1DC,#2BB3FB); /*Mozilla*/
    background:-o-linear-gradient(left,#71E1DC,#2BB3FB); /*Opera11*/
    background:-webkit-linear-gradient(left,#71E1DC,#2BB3FB); /*new gradient for Webkit*/
    filter: progid:DXImageTransform.Microsoft.gradient(GradientType=1, startColorstr=#71E1DC, endColorstr=#2BB3FB); /*IE<9>*/
    -ms-filter: "progid:DXImageTransform.Microsoft.gradient (GradientType=1, startColorstr=#71E1DC, endColorstr=#2BB3FB)"; /*IE8+*/
  }
  .top5-list-div, .top5-list-span{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 12px;
    text-align: right;
    vertical-align: middle;
    float: left;
    box-sizing: border-box;
  }
  .top5-list-span{
    width: 30px;
    color: #606266;
  }
  .top5-list-div{
    color: #666;
    width: 50px;
    height: 32px;
    line-height: 32px;
    padding: 0 12px 0 0;
  }
  .top-list-name{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 36px;
    margin: 7px 0;
    color: #666;
    font-size: 12px;
  }
  .top5-top-direction {
    display:inline-block;
    vertical-align:middle;
    cursor: pointer;
    /*display: flex;*/
    /*flex-flow: row;*/
    /*justify-content: space-around;*/
    /*align-items: center;*/
    float: right;
    font-size: 13px;
    font-family: roboto;
    color: #3F3F3F;
    font-weight: 900;
  }
  .top5-top-direction i {
    font-size: 26px;
    color: #9B9B9B;
    cursor: pointer;
  }
  .top5-list {
  }
  .top5-more{
    float: left;
    width: 25px;
    height: 18px;
    background: url("../assets/img/gengduo.png") no-repeat;
    background-size: 100% 100%;
    background-position: center center;
  }
  .top5-list-progress{
    line-height: 32px;
    position: relative;
    font-size: 14px;
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
    color: #21AF95;
  }
  .top5-list-title{
    white-space: nowrap;
    /*width: 100%;*/
    font-size: 12px;
    color: #1EBBA6;
    margin:8px 0px;
    overflow: hidden;
  }
  .top5-list-detail{
    height: 5px;
    background: #21af95;
    float: left;
    border-radius: 50px;
  }
  .top-list-title{
    display: flex;flex-flow: column;align-items: flex-end;justify-content: space-around;float: left;text-align: right;margin-right: 10px
  }
  .progress-ration{
    height: 5px;
    background: #0067C1;
    float: left;
    border-radius: 50px;
    line-height:14px;
  }
  .subject-col .top5-top{
    padding-top: 5px;
  }
  .top5-list-title span{
    white-space:nowrap;
    display: block;
    margin-right: 10px;
    float: left;
    color: #666666;
    font-size: 12px;
  }
  .top5-list-num{
    font-size: 12px;
    line-height:14px;
    color: #0067C1;
  }
  .is-active-line{
    color: #409EFF;
  }
  @media screen and (max-width: 1500px) {
    .subject-top-right {
      /*width: 80px;*/
      /*height: 80px;*/
    }
    .subject-top-right span {
    }
  }
</style>
