<template>
  <div class="udss-board-body">
    <div class="scheme-header">
      名称&nbsp;&nbsp;<input style="width: 325px;" class="scheme-input" type="text" placeholder="评价方案名称" v-model="schemeName">
      &nbsp;&nbsp;简称&nbsp;&nbsp;<input :class="['scheme-input', {'err-msg': lenError}]" type="text" placeholder="不超过8字符" v-model="schemeAbbr">
      <Button type="primary" size="small" class="button-confirm" @click="confirmCreate" :loading="saveLoading">保存</Button>
      <Button style="float: right; background-color: #4A90E2;" type="primary" size="small" class="button-close" @click="handleReturn">返回</Button>
    </div>
    <div class="scheme-remark">
      备注&nbsp;&nbsp;
      <Input
        class="scheme-textarea"
        type="textarea"
        :rows="2"
        placeholder="备注信息"
        v-model="remark" />
    </div>
    <div class="scheme-main">
      <div class="scheme-main-top">
        <div class="scheme-main-left">权重</div>
        <div class="scheme-main-right">院系</div>
      </div>
      <ul class="scheme-main-list">
        <li v-for="node in allWeights" :key="node.id">
          <div class="scheme-main-left">
            {{node.weight_name}}
            <Tooltip placement="top" effect="light">
              <div slot="content">
                <table cellspacing="10" cellpadding="0">
                  <tr>
                    <th>指标类别</th>
                    <th>个数</th>
                  </tr>
                  <tr v-for="(ind, indX) in node.ind_types" :key="indX">
                    <td>{{ind.ind_type_name}}</td>
                    <td>{{ind.ind_count}}</td>
                  </tr>
                </table>
              </div>
              <Button class="detail-button" size="mini"><i class="el-icon-question icon-detail"></i></Button>
            </Tooltip>
          </div>
          <div class="scheme-main-right">
            <div v-for="(item, index) in node.orgs" :key="item.id" class="scheme-label scheme-label-card">
              {{item.name}}
              <i class="el-icon-circle-close-outline" @click="deleteCollege(node, item, index)"></i>
            </div>
            <Popover
              placement="right"
              width="160"
              @show="changeCollegeTag(node)"
              trigger="click">
              <Input
                placeholder="院系搜索"
                size="small"
                suffix-icon="el-icon-search"
                v-model="filterCollege" />
              <div class="select-college-list" v-if="nowWeight.is_pct_ind_names">
                <table cellpadding="0" cellspacing="0">
                  <tr v-if="!col.org_ids" v-show="(showCollege && showCollege.length > 0) ? showCollege[index] : true" v-for="(col, index) in newColleges" :key="col.id">
                    <td @click="selectCollege(col)">{{col.name}}</td>
                  </tr>
                </table>
              </div>
              <div class="select-college-list" v-else>
                <table cellpadding="0" cellspacing="0">
                  <tr v-show="(showCollege && showCollege.length > 0) ? showCollege[index] : true" v-for="(col, index) in newColleges" :key="col.id">
                    <td @click="selectCollege(col)">{{col.name}}</td>
                  </tr>
                </table>
              </div>
              <div slot="reference" class="scheme-label scheme-label-add">+ 新增</div>
            </Popover>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { StandTree, TogglePage } from '@/mixins'
  import { Button, Input, Tooltip, Popover } from 'element-ui'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  export default {
    name: 'write',
    mixins: [ StandTree, TogglePage ],
    components: {
      Button, Input, Tooltip, Popover
    },
    data () {
      return {
        schemeName: '',
        schemeAbbr: '',
        lenError: false,
        remark: '',
        filterCollege: '',
        nowWeight: '',
        newColleges: [],
        showCollege: [],
        saveLoading: false
      }
    },
    methods: {
      ...mapActions('evaluation', ['createEvaluation']),
      ...mapMutations('evaluation', ['setEvaluationById']),
      ...mapMutations('config', ['exportDataB']),
      downloadDataA () {
        // console.log('download current data')
      },
      downloadDataB () {
        this.exportDataB({'name': '评价方案', 'url': '/v1/eva/exp'})
      },
      handleReturn () {
        this.togglePage('scheme')
      },
      changeCollegeTag (node) {
        this.nowWeight = node
        this.filterCollege = ''
      },
      deleteCollege (node, col, index) {
        node.orgs.splice(index, 1)
        this.newColleges.push(col)
        this.showCollege = []
      },
      selectCollege (data) {
        let index = this.newColleges.findIndex(node => node.id === data.id)
        this.newColleges.splice(index, 1)
        this.showCollege.splice(index, 1)
        this.nowWeight.orgs.push(data)
      },
      // 验证字符串长度
      lenValid () {
        this.schemeAbbr.length < 9 ? this.lenError = false : this.lenError = true
      },
      confirmCreate () {
        this.lenValid()
        if (!this.lenError) {
          let detail = []
          this.allWeights.forEach(node => {
            node.orgs.forEach(item => {
              detail.push({'org_id': item.id, 'weight_scheme_id': node.weight_id})
            })
          })
          let data = {
            name: this.schemeName,
            short_name: this.schemeAbbr,
            remark: this.remark,
            univ_id: 2,
            detail,
            user_id: 1
          }
          return new Promise((resolve, reject) => {
            this.saveLoading = true
            this.createEvaluation({data, resolve, reject})
          }).then(() => {
            this.saveLoading = false
            this.togglePage('scheme')
          }).catch(() => {
            this.saveLoading = false
          })
        }
      }
    },
    mounted () {
      this.$nextTick(() => {
        let timer = setInterval(() => {
          if (this.colleges && this.colleges.length > 0) {
            this.newColleges = JSON.parse(JSON.stringify(this.colleges))
            clearInterval(timer)
          }
        }, 20)
      })
    },
    computed: {
      ...mapGetters('evaluation', ['colleges', 'detailEvaluation']),
      allWeights () {
        if (this.detailEvaluation && this.detailEvaluation.weight_detail) {
          return this.detailEvaluation.weight_detail
        } else {
          return []
        }
      }
    },
    watch: {
      filterCollege () {
        if (this.filterCollege) {
          this.showCollege = this.newColleges.map(node => {
            return node.name.toLowerCase().indexOf(this.filterCollege.toLowerCase()) !== -1
          })
        } else {
          this.showCollege = this.newColleges.map(node => {
            return true
          })
        }
      }
    }
  }
</script>

<style scoped>
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .udss-board-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
    color: #4E4E4E;
  }
  .scheme-header {
    overflow: hidden;
  }
  .scheme-input{
    outline: none;
    border: solid 1px #EAEAEA;
    border-radius: 3px;
    margin-right: 20px;
    line-height: 30px;
    text-indent: 10px;
    color: #4E4E4E;
  }
  .scheme-remark{
    line-height: 50px;
    margin-top: 10px;
  }
  .scheme-textarea{
    width: 560px;
  }
  .scheme-main{
    margin-top: 10px;
    height: calc(100% - 100px);
  }
  .scheme-main-top{
    padding: 0 20px;
    height: 38px;
    line-height: 38px;
    background-color: #1EBBA6;
    color: #ffffff;
  }
  .scheme-main-left{
    float: left;
    line-height: 38px;
    width: 250px;
    overflow: hidden;
  }
  .scheme-main-left i{
    color: #ADADAD;
    margin-left: 5px;
  }
  .scheme-main-right{
    margin-left: 250px;
  }
  .scheme-main-list{
    height: calc(100% - 50px);
    overflow: hidden;
    overflow-y: scroll;
  }
  .scheme-main-list li{
    overflow: hidden;
    margin-top: 10px;
    padding: 0 20px;
    background-color: #F8F8F8;
    border: solid 1px #F0F0F0;
  }
  .scheme-label{
    cursor: pointer;
    float: left;
    margin: 5px 10px;
  }
  .scheme-label-card{
    position: relative;
    padding: 5px 10px;
    color: #ffffff;
    background-color: #1EBBA6;
    border-radius: 4px;
    line-height: 16px;
    font-size: 12px;
  }
  .scheme-label-card i{
    display: none;
    position: absolute;
    right: -12px;
    color: #606266;
    font-size: 14px;
    top: 5px;
  }
  .scheme-label-card:hover i{
    display: block;
  }
  .scheme-label-add{
    border-radius: 4px;
    border:dashed 1px #606266;
    background-color: #fff;
    color: #585255;
    padding: 5px;
    font-size: 12px;
    line-height: 14px;
  }
  .select-college-list{
    height: 240px;
    margin-top: 10px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .select-college-list table{
    width: 100%;
  }
  .select-college-list table td{
    height: 30px;
    font-size: 12px;
    cursor: pointer;
  }
  .select-college-list table td:hover{
    background-color: #EFF3F6;
  }
  .err-msg{
    border-color: red;
  }
  .detail-button{
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    font-size: 14px;
  }
</style>
