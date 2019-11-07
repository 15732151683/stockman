<template>
  <div class="side-tree-box">
    <div class="side-tree-input">
      <input
        class="search-input"
        :placeholder="$t('element.filterText')"
        v-model="filterText" />
    </div>
    <div class="side-tree-header"><strong>{{$t('writeInd.indicator')}}</strong></div>
    <div class="side-tree-body target-tree">
      <Tree
        :data="tree"
        :expand-on-click-node="true"
        :default-expanded-keys="expandedArray"
        :props="defaultProps"
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree">
        <div class="side-tree-node" slot-scope="{ node, data }" :title="node.label">
          <div class="side-tree-button" v-show="data.is_leaf">
            <Radio :label="data.id" v-model="radios" @change="showWrite(data)"></Radio>
          </div>
          <div :class="['side-tree-text', 'one-line', {'is-active-line': radios === data.id}, {'is-mark-line' : data.mark}]" :title="node.label" @click="changeRadio(data)">
            {{ node.label }}
          </div>
        </div>
      </Tree>
    </div>
  </div>
</template>

<script>
  import {Tree, Radio} from 'element-ui'
  export default {
    name: 'SideTree',
    components: {
      Tree, Radio
    },
    data () {
      return {
        filterText: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        expandedArray: [],
        radios: 0
      }
    },
    props: {
      tree: {
        default: []
      },
      value: {
        default: 0
      }
    },
    mounted () {
      this.radios = this.value
      this.expandedArray = [this.value]
    },
    methods: {
      // tree过滤
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      // 点击tree文字触发事件
      changeRadio (data) {
        if (data.is_leaf === true) {
          this.radios = data.id
          this.showWrite(data)
        }
      },
      // 点击radio触发事件
      showWrite (data) {
        this.$emit('getIndData', data)
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    }
  }
</script>

<style scoped>
 .side-tree-box {
   width: 100%;
   height: 100%;
   overflow: hidden;
 }
  .side-tree-input {
    overflow: hidden;
  }
 .search-input {
   margin: 5px 0;
   border-radius: 4px;
   width: calc(100% - 2px);
   height: 36px;
   border: solid 1px #D7D7D7;
   outline: none;
   line-height: 36px;
   text-indent: 10px;
   background: url('../../../assets/img/search.png') no-repeat;
   background-position: top 10px right 20px;
 }
 .side-tree-header {
   height: 40px;
   line-height: 40px;
   color: #000000;
   text-indent: 45px;
   background-color: #F2F2F2;
 }
 .side-tree-body {
   height: calc(100% - 100px);
   overflow: hidden;
   overflow-y: auto;
 }
 .side-tree-node {
   flex: 1;
   line-height: 40px;
   display: inline-block;
   padding-right: 2px;
   overflow: hidden;
 }
 .side-tree-button {
   line-height: 40px;
   float: right;
   margin-right: 20px;
   color: red;
   width: 20px;
   overflow: hidden;
 }
 .side-tree-text {
   margin-right: 55px;
   line-height: 40px;
 }
 .is-active-line{
   color: #409EFF;
 }
 .is-mark-line {
   color: #D96A49 !important;
 }
</style>
