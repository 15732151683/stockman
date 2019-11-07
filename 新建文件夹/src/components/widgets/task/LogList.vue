<template>
  <div class="log-container">
    <Collapse v-model="activeName">
      <template v-for="(log, index) in newList">
        <CollapseItem :key="index" :name="log.index">
          <div slot="title" class="log-container-title">
            <span>{{log.title}}</span><span>{{log.count}}</span>
          </div>
          <div class="log-container-ul" v-if="log.remarks">
            <ul>
              <li v-for="(remark, idx) in log.remarks" :key="idx">
                <table class="log-table" cellspacing="0" cellpadding="0">
                  <tr><td>序号：<span>{{idx + 1}}</span></td></tr>
                  <tr><td>用户：<span>{{remark.user_name}}</span></td></tr>
                  <tr><td>时间：<span>{{initTime(remark.created_at)}}</span></td></tr>
                  <tr v-if="remark.remark"><td>备注：<span>{{remark.remark}}</span></td></tr>
                </table>
              </li>
            </ul>
          </div>
          <div class="log-container-info" v-else>
            暂无数据
          </div>
        </CollapseItem>
      </template>
    </Collapse>
  </div>
</template>

<script>
  import { Collapse, CollapseItem } from 'element-ui'
  export default {
    name: 'LogList',
    components: {
      Collapse, CollapseItem
    },
    data () {
      return {
        activeName: '1'
      }
    },
    props: {
      logList: {
        default: []
      }
    },
    computed: {
      newList () {
        let list = []
        this.logList.forEach((node, index) => {
          let obj = {}
          obj.index = index + 1 + ''
          obj.title = index + 1 + '. ' + node.nodeRt.node.name + '（' + this.initTime(node.nodeRt.created_at) + '）'
          obj.remarks = node.remarks
          if (obj.remarks) {
            obj.count = obj.remarks.length
          } else {
            obj.count = 0
          }
          list[index] = obj
        })
        return list
      }
    },
    methods: {
      initTime (time) {
        if (time) {
          return time.split('T')[0]
        } else {
          return ''
        }
      }
    }
  }
</script>

<style scoped>
  .log-container {
    margin-top: 5px;
    width: 100%;
    height: calc(100% - 5px);
    overflow: hidden;
    overflow-y: auto;
    font-size: 14px;
  }
  .log-container-title {
    width: 100%;
  }
  .log-container-title span {
    display: inline-block;
  }
  .log-container-title span:nth-child(1) {
    margin-left: 5px;
    float: left;
  }
  .log-container-title span:nth-child(2) {
    padding: 0px 6px;
    border-radius: 1px;
    overflow: hidden;
    line-height: 20px;
    margin-top: 14px;
    background-color: #f3f3f3;
    float: right;
    color: #b5b8bf;
    font-size: 12px;
    margin-right: 10px;
  }
  .log-container-info {
    text-align: center;
    color: #A3A8AA;
  }
  .log-container-ul ul {
    font-size: 12px;
    background-color: #f9f9f9;
  }
  .log-container-ul li {
    padding: 4px 5px;
    color: #A3A8AA;
  }
  .log-table span {
    color: #636363;
  }
  .log-table td {
    padding: 0px 2px;
  }
</style>
