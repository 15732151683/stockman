<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="[true, false, true]">
    <template slot="header"></template>
    <template slot="main">
      <div class="card-filter">
        筛选条件：
        <div class="card-filter-check">
          <CheckboxGroup v-model="checkOwnerList" @change="handleCheckChange">
            <Checkbox :label="true">自己</Checkbox>
            <Checkbox :label="false">其他人</Checkbox>
          </CheckboxGroup>
        </div>
        <div class="card-filter-check">
          <CheckboxGroup
            v-model="checkPublishList"
            @change="handleCheckChange">
            <Checkbox :label="true">已发布</Checkbox>
            <Checkbox :label="false">未发布</Checkbox>
          </CheckboxGroup>
        </div>
        <button class="card-filter-btn" @click="handleSort">排序</button>
      </div>
      <div class="card-panel">
        <div
          v-show="showStatusList[index]"
          class="card-wrapper"
          :key="item.id"
          v-for="(item, index) in allWeightData">
          <div
            :class="['card-img', {'card-wrapper-default': item.is_published}]"
            @click="toggleEditWeight(item)">
            <div class="card-header">
              <i
                v-show="!item.is_default"
                class="el-icon-circle-close card-header-icon"
                @click.stop="handleDelete(item.id)"
                v-if="$route.meta.permissionList.includes('w') && !item.is_published"></i>
              <span class="card-header-name">{{item.name}}</span>
              <span v-if="item.is_default" class="card-header-default">{{$t('weight.default')}}</span>
            </div>
            <div class="card-img-line">
            </div>
            <div class="card-chart">
              <p class="card-owner"
                 v-if="!item.login_is_created"
                 :title="item.created_user.user_name">
                <img src="../assets/img/ower.png" />
              </p>
              <p class="card-publish">
                <button class="card-publish-btn card-publish-active" v-if="item.is_published">已发布</button>
                <button class="card-publish-btn" v-else>未发布</button>
              </p>
              <div v-show="[67, 76, 77].findIndex(node => node === item.id) < 0" :id="'graph' + item.id"></div>
              <img src="static/img/arwu01.png" alt="" v-if="item.id === 67">
              <img src="static/img/qs01.png" alt="" v-if="item.id === 76">
              <img src="static/img/the01.png" alt="" v-if="item.id === 77">
            </div>
            <div class="card-type">
              <span>{{$t('weight.type')}}</span>
              <div class="card-img-line"></div>
              <div class="card-type-box">
                <template v-if="item.id === 67">
                  <button class="card-type-button" :style="{backgroundColor: ind.color}" :key="ind.id" v-for="ind in exInforms01">{{ind.name}}</button>
                </template>
                <template v-else-if="item.id === 76">
                  <button class="card-type-button" :style="{backgroundColor: ind.color}" :key="ind.id" v-for="ind in exInforms02">{{ind.name}}</button>
                </template>
                <template v-else-if="item.id === 77">
                  <button class="card-type-button" :style="{backgroundColor: ind.color}" :key="ind.id" v-for="ind in exInforms03">{{ind.name}}</button>
                </template>
                <template v-else>
                  <button class="card-type-button" :style="{backgroundColor: color[index]}" :key="ind.id" v-for="(ind, index) in item.infos">{{ind.name}}</button>
                </template>
              </div>
            </div>
            <div class="card-label">
              <span>{{$t('weight.label')}}</span>
              <div class="card-img-line"></div>
              <div class="card-label-box">
                <button class="card-label-button" :key="tag.tagId" v-for="tag in (item.tags && (item.tags.length>5 ? item.tags.splice(5) : item.tags))">{{tag.TagName}}</button>
              </div>
            </div>
          </div>
        </div>
        <div class="card-wrapper" v-if="$route.meta.permissionList.includes('w')">
          <img
            class="card-img"
            src="static/img/weight05.png"
            @click="toggleCreateWeight()">
        </div>
      </div>
      <!--排序用的dialog-->
      <Dialog
        :modal="true"
        top="20px"
        width="250px"
        :visible.sync="Visible"
        :close-on-click-modal="false"
        title="权重排序"
      >
        <div style="overflow: hidden;overflow-y: scroll;height: 400px; padding: 15px 15px 15px 0px">
          <Draggable id="Draggable" class="scheme-table-body"
                     :options="Options"
                     element="table"
                     v-model="newWeight"
                     :move="onMove"
          >
            <div class="data-Sort" :key="idx" v-for="(item, idx) in newWeight">
              <p style="width: 16px;height: 16px"

                 :title="item.created_user.user_name">
                <img style="width: 100%;height: 100%" v-if="!item.login_is_created" src="../assets/img/ower.png" />
              </p>
              <div :class="['data-Sort-name', item.is_published === true ? 'data-Sort-publish' : 'data-Sort-unPublish']">
                {{idx + 1}}
              </div>
              <span style="padding-left: 15px;">{{item.name}}</span>
            </div>
          </Draggable>
        </div>
        <div slot="footer">
          <Button
            type="primary"
            size="small"
            class="button-confirm"
            :loading="editSaveLoading"
            @click="handleConfirm()">
            确定
          </Button>
          <Button
            type="primary"
            size="small"
            class="button-close"
            @click="handleCancel()">
            取消
          </Button>
        </div>
      </Dialog>
      <component :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { TogglePage } from '@/mixins'
  import modal from './partial/weight/Modal.vue'
  import modalEdit from './partial/weight/ModalEdit.vue'
  import { Container } from './widgets'
  import { MessageBox, Message, Checkbox, CheckboxGroup, Dialog, Button } from 'element-ui'
  import echarts from 'echarts'
  import Draggable from 'vuedraggable'
  export default {
    name: 'Weight',
    mixins: [ TogglePage ],
    components: {
      modal, modalEdit, Container, Checkbox, CheckboxGroup, Draggable, Dialog, Button
    },
    data () {
      return {
        editSaveLoading: false,
        newWeight: [],
        allWeightData: [],
        Visible: false,
        title: '',
        modalShow: false,
        modalEdit: false,
        checkOwnerList: [],
        checkPublishList: [],
        view: '',
        cards: [
          {
            id: 0,
            active: true,
            src: 'static/img/weight01.png'
          },
          {
            id: 1,
            active: false,
            src: 'static/img/weight02.png'
          },
          {
            id: 2,
            active: false,
            src: 'static/img/weight03.png'
          },
          {
            id: 3,
            active: false,
            src: 'static/img/weight04.png'
          }
        ],
        exInforms01: [
          {
            color: '#1CBAA5',
            name: '人才培养',
            id: 1
          },
          {
            color: '#F24664',
            name: '其它',
            id: 2
          },
          {
            color: '#A243AA',
            name: '科学研究',
            id: 3
          }
        ],
        exInforms02: [
          {
            color: '#1CBAA5',
            name: '人才培养',
            id: 4
          },
          {
            color: '#F24664',
            name: '其它',
            id: 5
          },
          {
            color: '#A243AA',
            name: '科学研究',
            id: 6
          },
          {
            color: '#ED743E',
            name: '国际化',
            id: 7
          }
        ],
        exInforms03: [
          {
            color: '#1CBAA5',
            name: '人才培养',
            id: 8
          },
          {
            color: '#F24664',
            name: '其它',
            id: 9
          },
          {
            color: '#A243AA',
            name: '科学研究',
            id: 10
          },
          {
            color: '#ED743E',
            name: '国际化',
            id: 11
          }
        ],
        exInforms04: [
          {
            color: '#1CBAA5',
            name: '人才培养',
            id: 15,
            count: '4'
          },
          {
            color: '#F24664',
            name: '其它',
            id: 16,
            count: '10'
          },
          {
            color: '#A243AA',
            name: '科学研究',
            id: 17,
            count: '16'
          },
          {
            color: '#ED743E',
            name: '国际化',
            id: 18,
            count: '1'
          },
          {
            color: '#1F9BBA',
            name: 'Student',
            id: 19,
            count: '6'
          }
        ],
        color: ['#1CBAA5', '#F24664', '#A243AA', '#ED743E', '#1F9BBA', '#DD6D32', '#3A88FD', '#FF7262', '#F1A616', '#989898', '#989898', '#989898'],
        showStatusList: []
      }
    },
    mounted () {
      this.getCheckedInds()
      this.getAllWeight()
    },
    methods: {
      ...mapActions('target', ['getCheckedInds']),
      ...mapActions('weight', ['getAllWeight', 'getNowWeight', 'deletWeight', 'updateOrders']),
      ...mapMutations('config', ['config', 'exportDataB']),
      ...mapMutations('weight', ['getNowWeightInfo']),
      downCurrentData () {
      },
      handleSort () {
        this.Visible = true
      },
      handleConfirm () {
        let data = this.newWeight.map((item, index) => {
          return {id: item.id, sys_order_no: index}
        })
        let da = this.newWeight.map((item, index) => {
          return {id: item.name, sys_order_no: index}
        })
        console.log(da)
        new Promise((resolve, reject) => {
          this.editSaveLoading = true
          this.updateOrders({payload: data, resolve, reject})
        }).then(() => {
          this.allWeightData = this.newWeight
          this.Visible = false
          this.editSaveLoading = false
        }).catch(() => {
          this.editSaveLoading = false
          this.Visible = false
        })
      },
      handleCancel () {
        this.Visible = false
        this.newWeight = this.allWeightData
      },
      onMove ({relatedContext, draggedContext}) {
        console.log(relatedContext, draggedContext)
//        let order = JSON.parse(JSON.stringify(draggedContext.element.sys_order_no))
//        draggedContext.element.sys_order_no = relatedContext.element.sys_order_no
//        relatedContext.element.sys_order_no = order
//        let order =
      },
      downAllData () {
        this.exportDataB({'name': '权重方案', 'url': '/v1/ws/exp'})
      },
      handleCheckChange () {
        this.filterMethod()
      },
      handleResetFilter () {
        this.checkPublishList = []
        this.checkOwnerList = []
        this.filterMethod()
      },
      toggleCreateWeight () {
        this.view = 'modal'
      },
      toggleEditWeight (row) {
        this.getNowWeightInfo(row)
        this.getNowWeight(row.id)
        this.view = 'modalEdit'
      },
      handleDelete (id) {
        MessageBox.confirm('确定删除该权重方案？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.deletWeight({id, resolve, reject})
          }).then(() => {
            Message({
              message: this.$t('element.delSuccess'),
              type: 'success'
            })
            this.getAllWeight()
          }).catch((error) => {
            Message({
              message: this.$t('element.delFailure') + error,
              type: 'error'
            })
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: this.$t('element.cancel')
          })
        })
      },
      create (node) {
        let _self = this
        this.chart = echarts.init(document.querySelector(`#graph${node.id}`))
        this.chart.setOption({
          animation: false,
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/> {b} : {c} ({d}%)' // 提示框浮层内容格式器
          },
          color: _self.color,  // 手动设置每个图例的颜色
          series: [ // 系列列表
            {
              avoidLabelOverlap: false, // 是否启用防止标签重叠策略，默认开启，在标签拥挤重叠的情况下会挪动各个标签的位置，防止标签间的重叠。
              // 如果不需要开启该策略，例如圆环图这个例子中需要强制所有标签放在中心位置，可以将该值设为 false
              hoverAnimation: false, // 控制鼠标经过放大效果
              name: _self.$t('weight.chart'),  // 系列名称
              type: 'pie',   // 类型 pie表示饼图
              center: ['50%', '50%'], // 设置饼的原心坐标 不设置就会默认在中心的位置
              radius: ['65%', '100%'],  // 饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
              itemStyle: {  // 图形样式
                normal: { // normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                  boderWidth: 2,
                  borderColor: '#fff',
                  label: {  // 饼图图形上的文本标签
                    show: false,  // 平常不显示
                    position: 'center',
                    formatter (params) {
                      // console.log(params)
                      // console.log(node.infos, '22222222')
                      let name = params.data.name
                      let index = ['qs', 'c', 'the', 'arwu'].findIndex(node => node === name.toLowerCase())
                      if (index > -1) {
                        return '{' + name.toLowerCase() + '|}'
                      } else {
                        return '{qs|}'
                      }
                    },
                    rich: {
                      qs: {
                        align: 'center',
                        height: 160,
                        width: 160,
                        color: 'red',
                        backgroundColor: {
                          image: 'static/img/qs01.png'
                        }
                      },
                      arwu: {
                        align: 'center',
                        height: 160,
                        width: 160,
                        backgroundColor: {
                          image: 'static/img/arwu01.png'
                        }
                      },
                      c: {
                        align: 'center',
                        height: 160,
                        width: 160,
                        backgroundColor: {
                          image: 'static/img/c.png'
                        }
                      },
                      the: {
                        align: 'center',
                        height: 160,
                        width: 160,
                        backgroundColor: {
                          image: 'static/img/the01.png'
                        }
                      },
                      other: {
                        align: 'center',
                        fontSize: 20,
                        color: 'red'
                      }
                    }
                  },
                  labelLine: {     // 标签的视觉引导线样式
                    show: false  // 平常不显示
                  }
                },
                emphasis: {   // normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                  label: {  // 饼图图形上的文本标签
                    show: true,
                    textStyle: {
                      fontSize: '16',
                      fontWeight: 'bold'
                    },
                    formatter (params) {
                      // console.log(params)
                      // console.log(node.infos, '22222222')
                      let name = params.data.name
                      let index = ['qs', 'c', 'the', 'arwu'].findIndex(node => node === name.toLowerCase())
                      if (index > -1) {
                        return '{' + name.toLowerCase() + '|}'
                      } else {
                        return name
                      }
                    },
                    rich: {
                      qs: {
                        align: 'center',
                        height: 42,
                        width: 45,
                        color: 'red',
                        backgroundColor: {
                          image: 'static/img/qs.png'
                        }
                      },
                      arwu: {
                        align: 'center',
                        height: 56,
                        width: 63,
                        backgroundColor: {
                          image: 'static/img/arwu.png'
                        }
                      },
                      c: {
                        align: 'center',
                        height: 31,
                        width: 48,
                        backgroundColor: {
                          image: 'static/img/c.png'
                        }
                      },
                      the: {
                        align: 'center',
                        height: 51,
                        width: 43,
                        backgroundColor: {
                          image: 'static/img/the.png'
                        }
                      },
                      other: {
                        align: 'center',
                        fontSize: 20,
                        color: 'red'
                      }
                    }
                  }
                }
              },
              data: node.id === 15 ? (_self.exInforms04.map(item => {
                return {
                  'value': item.count,
                  'name': item.name
                }
              })) : (node.infos && node.infos.length > 0 ? node.infos.map(item => {
                return {
                  'value': item.count,
                  'name': item.name
                }
              }) : [])
            }
          ]
        })
      },
      allCreate () {
        this.allWeight.forEach(node => {
          this.create(node)
        })
      },
      resize () {},
      filterMethod () {
        if (this.checkPublishList.length > 0 || this.checkOwnerList.length > 0) {
          this.showStatusList = this.allWeight.map(node => {
            let sta1 = this.checkPublishList.length > 0 ? this.checkPublishList.indexOf(node.is_published) > -1 : true
            let sta2 = this.checkOwnerList.length > 0 ? this.checkOwnerList.indexOf(node.login_is_created) > -1 : true
            console.log(sta1, sta2)
            if (sta1) {
              if (sta2) {
                return true
              } else {
                return false
              }
            } else {
              return false
            }
          })
        } else {
          this.showStatusList = this.allWeight.map(node => true)
        }
      }
    },
    computed: {
      ...mapGetters('weight', ['allWeight', 'nowWeight']),
      Options () {
        return {
          animation: 0,
          group: {
            name: 'description',
            pull: 'clone'
          },
          scroll: true,
          sort: true,
          disabled: false,
          ghostClass: 'ghost'
        }
      }
    },
    watch: {
      allWeight () {
        if (this.allWeight.length > 0) {
          this.allWeightData = this.allWeight
          this.newWeight = this.allWeight
          this.cloneWeight = JSON.parse(JSON.stringify(this.allWeight))
          this.checkPublishList = []
          this.checkOwnerList = []
          this.filterMethod()
          setTimeout(() => {
            this.allCreate()
          }, 10)
        }
      }
    }
  }
</script>

<style scoped>
  .card-panel {
    height: calc(100% - 40px);
    margin-top: 5px;
    overflow-y: scroll;
  }
  .card-filter {
    width: 100%;
    background-color: #FFFFFF;
    border-bottom: solid 1px #F3F3F3;
    line-height: 26px;
    overflow: hidden;
    font-size: 14px;
  }
  .card-filter-check {
    display: inline-block;
    margin-left: 30px;
  }
  .card-filter-btn {
    border: none;
    outline: none;
    cursor: pointer;
    padding: 5px 10px;
    margin-left: 30px;
    color: #606266;
  }
  .card-wrapper {
    display: inline-block;
    vertical-align: top;
    position: relative;
  }
  .card-img {
    font-size: 14px;
    margin: 5px 6px 6px 5px;
    padding: 5px;
    width: 250px;
    cursor: pointer;
    height: 390px;
    border: solid 1px #939393;
    border-radius: 5px;
  }
  .card-wrapper-default {
    /*margin: 2px 2px 2px 2px;*/
    border: solid 1px #1EBBA6;
    /*box-shadow: 2px 2px 2px 1px #ccc;*/
  }
  .card-header {
    height: 35px;
  }
  .card-header-name {
    display: block;
  }
  .card-header-default {
    display: block;
    color: #939393;
    font-size: 12px;
  }
  .card-header-icon {
    float: right;
    position: absolute;
    margin-top: 5px;
    margin-left: 220px;
    font-size: 25px;
    color: #939393;
  }
  .card-chart {
    text-align: center;
    width: 100%;
    height: 160px;
    position: relative;
  }
  .card-chart div{
    width: 100%;
    height: 100%;
  }
  .card-owner {
    position: absolute;
    display: inline-block;
    left: 5px;
    top: 0px;
    cursor: pointer;
    z-index: 99;
  }
  .card-publish {
    display: inline-block;
    position: absolute;
    right: 5px;
    top: 0px;
    z-index: 99;
  }
  .card-type {
    margin-top: 10px;
  }
  .card-type-box {
    height: 40px;
    overflow: hidden;
  }
  .card-type-button {
    border: 0;
    outline: none;
    color: #ffffff;
    font-size: 12px;
    line-height: 20px;
    margin: 0 3px;
    padding: 0 5px;
  }
  .card-label {
    margin-top: 10px;
    width: 100%;
  }
  .card-label-box {
    height: 50px;
    overflow: hidden;
  }
  .card-label-button {
    border: solid 1px #898A8C;
    border-radius: 2px;
    outline: none;
    color: #898A8C;
    font-size: 12px;
    line-height: 20px;
    margin: 2px 3px;
    padding: 0 5px;
    background-color: #fff;
  }
  .card-img-line {
    margin: 5px 0;
    width: 100%;
    height: 1px;
    background-color: #F3F3F3;
  }
  .card-publish-btn {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: #FFFFFF;
    background-color: #939393;
    cursor: pointer;
  }
  .card-publish-active {
    background-color: #1CBAA5;
  }
  .scheme-table-body{
    overflow: hidden;
    overflow-y: scroll;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
  }
  .data-Sort{
    font-size: 16px;
    border-bottom:0.5px solid #EBEEF5;
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: flex-start;
    text-align: center;
    padding: 5px 5px 5px 0;
  }
  .data-Sort-name{
    font-size: 12px;
    border-radius: 3px;
    margin-left: 5px;
    width: 20px;
    height: 20px;
    line-height: 20px;
  }
  .data-Sort-publish{
    background: #1EBBA6;
    color: white;
  }
  .data-Sort-unPublish{
    background: #939393;
    color: white;
  }
</style>
