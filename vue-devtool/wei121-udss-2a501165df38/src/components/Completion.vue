<template>
  <div class="container">
    <div class="container-right">
      <form class="tree-header" @submit.prevent="highlightNodes">
        <el-input placeholder="Search tree" v-model="search" size="mini">
          <el-button slot="append" icon="el-icon-search" @click="highlightNodes"></el-button>
        </el-input>
      </form>
      <div class="tree-body">
        <ul class="tree-view">
          <li
            v-for="level1 in collegeTree"
            :key="level1.name"
            class="tree-node level1">
            <div class="tree-branch-label"
                 :title="level1.name"
                 :class="{'is-selected': level1.selected, 'is-active': level1.active}">
              <span class="tree-icon branch-icon" :class="level1.icon"></span>&nbsp;
              <span>{{level1.name | upperCase}}</span>&nbsp;
              <span
                class="fa fa-caret-down tree-icon"
                :class="{'icon-rotate': level1.expand}"
                @click.stop="toggleTreeview(level1)"></span>
            </div>
            <transition name="fade">
              <ul class="tree-branch" v-show="level1.expand">
                <li
                  class="tree-node level3"
                  v-for="level2 in level1.children"
                  :title="level2.name"
                  :class="{'is-selected': level2.selected, 'is-active': level2.active}"
                  @click="onNodeSelected('dept', level2)"
                  :key="level2.name">{{level2.name}}</li>
              </ul>
            </transition>
          </li>
          <li
            v-for="level1 in targetTree"
            :key="level1.name"
            class="tree-node level1">
            <div class="tree-branch-label"
                 @click="onNodeSelected('target', level1)"
                 :title="level1.name"
                 :class="{'is-selected': level1.selected, 'is-active': level1.active, 'cursor-forbid': level1.id !== 3}">
              <span class="tree-icon branch-icon" :class="level1.icon"></span>&nbsp;
              <span>{{level1.name | upperCase}}</span>&nbsp;
              <span
                class="fa fa-caret-down tree-icon"
                :class="{'icon-rotate': level1.expand}"
                @click.stop="toggleTreeview(level1)"></span>
            </div>
            <transition name="fade">
              <ul class="tree-branch" v-show="level1.expand">
                <li
                  class="tree-node level2 cursor-forbid"
                  v-for="level2 in level1.children"
                  :title="level2.name"
                  :key="level2.name">
                  <div class="tree-branch-label">
                    <span>{{level2.name}}</span>
                  </div>
                  <ul class="tree-branch">
                    <li
                      class="tree-node level3"
                      :class="{'is-selected': level3.selected,
                       'is-active': level3.active,
                       'cursor-forbid': [57, 58, 68, 69, 70, 71, 89, 90].indexOf(level3.id) === -1}"
                      v-for="level3 in level2.children"
                      :key="level3.name"
                      :title="level3.name"
                      @click="onNodeSelected('target',level3)">
                      {{level3.name}}
                    </li>
                  </ul>
                </li>
              </ul>
            </transition>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-left">
      <div class="content-header">
        <h2>{{title}}</h2>
        <el-button
          plain
          class="btn-return"
          v-show="currentView !== 'home'"
          @click="onNodeSelected('home')" icon="fa fa-home">

        </el-button>
      </div>
      <div class="content-body">
        <div class="sort-wrapper" v-if="currentView !== 'dept'">
          <el-button-group class="sort-group">
            <el-button
              v-for="btn in sorts"
              :key="btn.id"
              class="btn-sort"
              :class="{'is-select': btn.selected}"
              size="small" @click="toggleSort(btn)"
              title="Sort by letter.">
              <span v-if="btn.id === 0">A-Z</span>
              <span v-else class="fa" :class="btn.class"></span>
            </el-button>
          </el-button-group>
        </div>
        <component ref="comp" :is="currentView"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import Dept from './partial/completion/Dept.vue'
  import Home from './partial/completion/Home.vue'
  import Target from './partial/completion/Target.vue'
  import { mapGetters, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'Completion',
    components: {
      Dept,
      Home,
      Target
    },
    data () {
      return {
        title: 'Completion',
        currentView: 'home',
        isHome: true,
        search: '',
        sorts: [
          {
            id: 0,
            name: 'char',
            class: '',
            selected: false,
            title: 'Sort by letter.'
          },
          {
            id: 1,
            name: 'asc',
            class: 'fa-sort-amount-asc icon-rotate',
            selected: false,
            title: 'Sort Ascending.'
          },
          {
            id: 2,
            name: 'desc',
            class: 'fa-sort-amount-asc',
            selected: false,
            title: 'Sort Descending.'
          }
        ],
        ids: [57, 58, 68, 69, 70, 71, 89, 90]
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getTargetTree()
        this.getCollegeTree()
        this.getCompletionByTarget(-1)
        this.$emit('mounted')
      })
    },
    methods: {
      ...mapActions('completion', ['getCollegeTree', 'getTargetTree', 'getCompletionByCollege', 'getCompletionByTarget']),
      ...mapMutations('completion', ['sortTarget', 'setSortMode']),
      toggleTitle (item) {
        this.title = 'Completion' + (item ? ' - ' + item.name : '')
      },
      toggleSelect (item) {
        const unselect = function (tree) {
          tree.forEach(item => {
            item.selected = false
            if (item.children) {
              unselect(item.children)
            }
          })
        }
        unselect(this.collegeTree)
        unselect(this.targetTree)
        item && (item.selected = true)
      },
      togglePage (page, item) {
        if (page === 'home') {
          this.getCompletionByTarget(-1)
        } else if (page === 'dept') {
          this.getCompletionByCollege(item.row)
        } else if (page === 'target') {
          this.getCompletionByTarget(item.id)
        }
        this.currentView = page
      },
      onNodeSelected (page, item) {
        // 标识选中节点
        if (!item || item.id === 3 || item.row || this.ids.indexOf(item.id) > -1) {
          this.toggleTitle(item)
          this.toggleSelect(item)
          this.togglePage(page, item)
        }
      },
      toggleSort ({id}) {
        for (let item of this.sorts) {
          item.selected = item.id === id
        }
        this.setSortMode(id)
        this.sortTarget()
      },
      highlightNodes () {
        let search = this.search
        const clear = function (tree) {
          tree.forEach(item => {
            item.active = false
            if (item.children) {
              clear(item.children)
            }
          })
        }
        const highlight = function (tree) {
          tree.forEach(item => {
            if (item.name.toLowerCase().indexOf(search.toLowerCase()) > -1) {
              item.active = true
            }
            if (item.children) {
              highlight(item.children)
            }
          })
        }
        clear(this.targetTree)
        clear(this.collegeTree)
        if (search !== '') {
          highlight(this.targetTree)
          highlight(this.collegeTree)
        }
      },
      toggleTreeview (item) {
        item.expand = !item.expand
      },
      resize () {}
    },
    computed: {
      ...mapGetters('completion', ['collegeTree', 'targetTree'])
    }
  }
</script>

<style scoped>
  .container {
    height: calc(100% - 30px);
    margin: 15px;
    background-color: #eff3f6;
    user-select: none;
    cursor: default;
    overflow: hidden;
  }
  .container-left {
    padding-right: 12px;
    overflow: hidden;
    height: 100%;
    min-height: 100%;
  }
  .container-right {
    width: 250px;
    float: right;
    height: 100%;
    min-height: 100%;
    overflow: scroll;
    background-color: #fff;
  }
  .content-header,
  .content-body{
    padding: 15px;
    background-color: #fff;
  }
  .content-body {
    overflow: scroll;
    height: calc(100% - 100px);
  }
  .content-header {
    height: 40px;
    line-height: 40px;
  }
  .content-header>h2 {
    color: #32373d;
    width: calc(100% - 80px);
    display: inline-block;
    vertical-align: top;
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .tree-header,
  .tree-body {
    padding: 10px;
  }
  .tree-body {
    border-top: 1px solid #dee3f6;
  }
  .tree-node {
    list-style: none;
    color: #717476;
    cursor: pointer;
  }
  .tree-branch {
    margin-left: 15px;
    width: calc(100% - 15px);
  }
  .level2 .tree-branch {
    margin-top: 0;
  }
  .tree-branch-label {
    height: 30px;
    line-height: 30px;
    font-weight: 600;
    font-size: 13px;
  }
  .tree-branch-label.is-selected {
    background-color: #e0f2f7;
  }
  .tree-branch-label.is-active {
    color: #EF9A9A;
  }
  .tree-branch-label span {
    display: inline-block;
    vertical-align: middle;
  }
  .tree-icon {
    width: 14px;
    height: 14px;
  }
  .branch-icon {
    width: 24px;
    height: 24px;
  }
  .tree-view li:nth-child(1) .branch-icon {
    background: url(../assets/img/icon-academic-lg.png) no-repeat;
  }
  .tree-view li:nth-child(2) .branch-icon {
    background: url(../assets/img/icon-student-lg.png) no-repeat;
  }
  .tree-view li:nth-child(3) .branch-icon {
    background: url(../assets/img/icon-faculty-lg.png) no-repeat;
  }
  .tree-view li:nth-child(4) .branch-icon {
    background: url(../assets/img/icon-teach-lg.png) no-repeat;
  }
  .tree-view li:nth-child(5) .branch-icon {
    background: url(../assets/img/icon-research-lg.png) no-repeat;
  }
  .tree-view li:nth-child(6) .branch-icon {
    background: url(../assets/img/icon-intern-lg.png) no-repeat;
  }
  .tree-view li:nth-child(7) .branch-icon {
    background: url(../assets/img/icon-ranking-lg.png) no-repeat;
  }
  .tree-node.level1 {
    padding: 6px 3px;
  }
  .tree-node.level2 {
    color: #999;
  }
  .tree-node.level3 {
    padding: 5px 3px;
    color: #bbb;
    font-size: 12px;

    word-wrap: break-word;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space:nowrap;
  }
  .tree-node.level3.is-selected {
    background-color: #e0f2f7;
  }
  .tree-node.level3.is-active {
    color: #EF9A9A;
  }
  .tree-node.level3:hover {
    color: #888;
  }
  .tree-node.level2 .tree-branch-label {
    height: 24px;
    line-height: 24px;
    padding: 0;
  }
  .icon-rotate {
    transform: rotateZ(180deg);
  }
  .btn-return {
    width: 60px;
    height: 40px;
    padding: 7px 17px;
    display: inline-block;
    vertical-align: top;
    color: #92cfc0;
    font-size: 24px;
  }
  .sort-wrapper {
    height: 40px;
    line-height: 40px;
  }
  .sort-group {
    float: right;
  }
  .btn-sort.is-active {
    color: #3a8ee6;
  }
  .btn-sort {
    width: 55px;
    height: 30px;
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
  .fade-enter-active {
    transition: all 300ms linear;
  }
  .fade-leave-active {
    transition: all 300ms linear;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
