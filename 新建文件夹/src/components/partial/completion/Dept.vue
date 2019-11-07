<template>
  <div class="list-wrapper">
    <ul class="list">
      <li class="list-item-brand">
        <div class="list-item-progress">
          <completion-progress
            v-if="RouterAlive"
            :percentage="totalCompletion"
            :padding="'8px 3px'"
            :noLabel="1">
          </completion-progress>
        </div>
        <p class="list-item-label" :class="{'color-light-grey': college.noLabel}">
          <span :title="college.name">{{college.name}}&nbsp;</span>
        </p>
      </li>
    </ul>
    <div class="progress-tree">
      <Tree
        :data="nowTarget"
        :expand-on-click-node="true"
        :props="defaultProps"
        node-key="id"
        ref="tree">
        <div class="udss-tree-node" slot-scope="{ node, data }">
          <div class="udss-tree-body">
            <template v-if="data.is_leaf && RouterAlive">
              <completion-progress
                :showItem="true"
                :real="data.data"
                :target="data.target"
                :percentage="data.completion"
                :padding="'8px 3px'"
                :noLabel="data.noLabel">
              </completion-progress>
            </template>
            <template v-else>
              <completion-progress
                v-if="RouterAlive"
                :percentage="data.completion"
                :padding="'8px 3px'"
                :noLabel="data.noLabel">
              </completion-progress>
            </template>
          </div>
          <div @click="changeInd(data)" class="udss-tree-label one-line" :title="data.name">
            {{data.name}}
            <span v-show="data.is_leaf && data.unit.id !== 0">({{data.unit.name}})</span>
            <span v-if="data.count >= 0" style="color: #1EBBA6">({{data.count}})</span>
          </div>
        </div>
      </Tree>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import CompletionProgress from '../../widgets/Progress.vue'
  import { Tree, Tooltip, Popover } from 'element-ui'

  export default {
    name: 'Dept',
    props: {
      methodType: {
        default: 1
      }
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        parentId: [],
        nowTarget: [],
        RouterAlive: true
      }
    },
    components: {
      CompletionProgress, Tree, Tooltip, Popover
    },
    methods: {
      ...mapMutations('completion', ['toggleDeptGlobalExpand']),
      changeInd (data) {
        if (data.is_leaf) {
          this.$emit('childMethod', data, 'target')
        }
      },
      flatten (tree) {
        return tree.reduce((arr, current) => {
          arr.push(current)
          if (current.children && current.children.length) {
            this.flatten(current.children).forEach(node => {
              arr.push(node)
            })
          }
          return arr
        }, [])
      },
      // 获取父级指标
      getParentData (data) {
        return this.fNodes.find(node => node.id === data.pid) || {}
      },
      clone (obj) {
        return JSON.parse(JSON.stringify(obj))
      },
      // 重新渲染
      reload () {
        this.RouterAlive = false
        this.$nextTick(() => (this.RouterAlive = true))
      },
      getParentNode (node) {
        this.parentId = []
        let nodes = this.clone(node)
        nodes.forEach(data => {
          let wrapper = data
          let d = data.data
          let t = data.target
          let counter = 0   // 限制循环层级, 同时也限制了树深
          let arr = []
          while (wrapper.pid > 0 && counter++ < 10) {
            let parent = this.clone(this.getParentData(wrapper))
            if (arr.indexOf(parent.id) < 0) {
              arr.push(parent.id)
            }
            parent.children = [wrapper]
            wrapper = parent
          }
          this.parentId.push(...arr.map(node => {
            return {
              'id': node,
              'data': d,
              'target': t
            }
          }))
        })
      },
      // 合并数组计算
      combineData () {
        let arr = []
        let arrs = []
        if (this.methodType === 1) {
          this.parentId.forEach((node, index) => {
            let completion = Number((node.data * 100 / node.target).toFixed(0))
            if (!isNaN(completion) && completion !== Infinity) {
              let ord = arr.findIndex(item => item.id === node.id)
              if (ord < 0) {
                arr.push({'id': node.id, 'data': [completion]})
              } else {
                arr[ord].data.push(completion)
              }
            }
          })
          arr.forEach(node => {
            let total = 0
            let count = 0
            node.data.forEach(item => {
              total += item
              count++
            })
            arrs.push({'id': node.id, 'completion': Number((total / node.data.length).toFixed(0)), 'count': count})
          })
        }
        this.college.data.forEach((node, index) => {
          let completion = Number((node.val * 100 / this.college.target[index].val).toFixed(0))
          if (!isNaN(completion) && completion !== Infinity) {
            arrs.push({'id': node.indicator_id, 'completion': completion})
          }
        })
        return arrs
      },
      initValue () {
        let data = this.combineData()
        let cloneTree = this.clone(this.checkedInds)
        this.nowTarget = []
        const deepen = function (tree, {id, completion, count}) {
          for (let node of tree) {
            if (node.id === id) {
              node.completion = completion
              node.count = count
              node.noLabel = 1
            }
            if (node.children) {
              deepen(node.children, {id, completion, count})
            }
          }
        }
        data.forEach((item) => {
          deepen(cloneTree, {
            id: item.id,
            completion: item.completion,
            count: item.count
          })
        })
        this.nowTarget = cloneTree
        this.filterData(this.nowTarget)
        this.reload()
      },
      filterData (tree) {
        let index = tree.length
        for (let i = index - 1; i >= 0; i--) {
          if (tree[i].completion === 0 || tree[i].completion) {
            tree[i].children && tree[i].children.length > 0 && this.filterData(tree[i].children)
          } else {
            tree.splice(i, 1)
          }
        }
      }
    },
    computed: {
      ...mapGetters('completion', ['college', 'collegeData', 'targetData']),
      ...mapGetters('target', ['checkedInds']),
      fNodes () {
        return this.flatten(this.checkedInds)
      },
      rootNodes () {
        return this.fNodes.filter(node => {
          return this.college.target.findIndex(item => item.indicator_id === node.id) > -1
        })
      },
      rootNodesVal () {
        return this.rootNodes.map(node => {
          node.data = this.college.data.find(item => item.indicator_id === node.id).val
          node.target = this.college.target.find(item => item.indicator_id === node.id).val
          return node
        })
      },
      totalCompletion () {
        let data = this.college.data
        let target = this.college.target
        if (this.methodType === 1) {
          let sum = 0
          let counter = 0
          data.forEach((term, index) => {
            let cplt = (term.val * 100 / target[index].val)
            if (!isNaN(cplt) && cplt !== Infinity) {
              sum += Number(cplt.toFixed(0))
              counter++
            }
          })
          if (counter > 0) {
            return Number((sum / counter).toFixed(0))
          }
        }
      }
    },
    watch: {
      college () {
        this.getParentNode(this.rootNodesVal)
        this.initValue()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getParentNode(this.rootNodesVal)
        this.initValue()
      })
    }
  }
</script>

<style scoped>
  .list-wrapper {
    min-height: 100%;
  }
  .list {
    list-style: none;
  }
  .list-item-brand {
    height: 36px;
    line-height: 36px;
  }
  .list-item-label {
    color: #555;
    font-size: 12px;
    line-height: 36px;
    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .list-item-brand .list-item-label {
    font-weight: 600;
    font-size: 1em;
  }
  .udss-tree-node {
    display: inline-block;
    line-height: 36px;
    font-size: 14px;
    flex: 1;
    padding-right: 2px;
    overflow: hidden;
  }
  .udss-tree-body {
    float: right;
    width: 700px;
    padding-right: 15px;
    overflow: hidden;
  }
  .list-item-label.color-light-grey {
    color: #ccc;
  }
  .list-item-progress {
    width: 700px;
    float: right;
    padding-right: 17px;
    overflow: hidden;
  }
  .progress-title {
    cursor: pointer;
    line-height: 28px;
    text-align: center;
    background-color: #1EBBA6;
    color: #FFFFFF;
    padding: 0 5px;
  }
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .progress-list {
    margin: 10px 10px 0 10px;
    color: #7b7b7b;
  }
  .progress-list span {
    display: inline-block;
  }
  .progress-list span:nth-child(1) {
    width: 40%;
  }
  .progress-list span:nth-child(2) {
    text-align: right;
    width: 60%;
  }
  @media screen and (max-width: 1700px) {
    .udss-tree-body, .list-item-progress{
      width: 500px;
    }
  }
  @media screen and (max-width: 1400px) {
    .udss-tree-body, .list-item-progress{
      width: 400px;
    }
  }
  @media screen and (max-width: 1300px){
    .udss-tree-body, .list-item-progress{
      width: 300px;
    }
  }
</style>
