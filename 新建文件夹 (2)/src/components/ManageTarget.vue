<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-body">
        <div class="udss-board-toolbox">
          <div style="overflow: hidden;">
            <button :class="['type-button', {'is-active': activeIndType === node.id}]" :key="node.id" v-for="(node, index) in targets" @click="changeType(node.id, index)">{{node.name}}<i v-show="activeIndType === node.id && node.is_sys === false" class="el-icon-close type-button-delete" @click.stop="handleDeleteType(node)"></i></button>
            <input class="search-input" type="text" v-model="filterText" :placeholder="$t('manageTarget.filterText')">
            <!--<button class="type-button-add" @click="handleAppendType"><i class="el-icon-plus"></i></button>-->
            <Button
              v-hasPermission="'w'"
              class="button-label"
              type="primary"
              icon="el-icon-menu"
              size="mini"
              style="margin-top: 6px;"
              @click="handleTagAdd">{{$t('manageTarget.addTag')}}</Button>
            <Button
              v-hasPermission="'w'"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              class="button-add"
              style="float: right; margin-top: 6px;"
              @click="handleAppend(null, {'id': activeIndType})">{{$t('manageTarget.addType')}}</Button>
          </div>
          <div style="margin-top: 10px; overflow: hidden">
          </div>
        </div>
        <div id="loadings" class="target-tree">
          <div class="tree-header">
            <div class="tree-header-right"><strong>{{$t('manageTarget.operator')}}</strong></div>
            <div class="tree-header-left">
              <span style="vertical-align: middle;"><strong>{{$t('manageTarget.indicator')}}</strong></span>&nbsp;&nbsp;
            </div>
          </div>
          <div class="target-tree-box">
            <Tree
              :draggable = "true"
              @node-drag-end="handleDragEnd"
              :allow-drop="allowDrop"
              :allow-drag="allowDrag"
              :data="targets && targets[activeIndex] && targets[activeIndex].children ? targets[activeIndex].children : []"
              :expand-on-click-node="false"
              :props="defaultProps"
              node-key="id"
              :filter-node-method="filterNode"
              ref="tree">
              <div class="udss-tree-node" slot-scope="{ node, data }">
                <div class="udss-tree-body">
                  <Button
                    v-hasPermission="'w'"
                    class="udss-tree-operate"
                    type="text"
                    size="mini"
                    :title="$t('element.edit')"
                    @click.stop="handleUpdate(node, data)">
                    <i class="el-icon-edit"></i>
                  </Button>
                  <Button
                    v-hasPermission="'w'"
                    v-if="!data.is_leaf"
                    class="udss-tree-operate"
                    type="text"
                    size="mini"
                    :title="$t('element.add')"
                    @click.stop="handleAppend(node, data)">
                    <i class="el-icon-circle-plus-outline"></i>
                  </Button>
                  <Button
                    v-hasPermission="'w'"
                    class="udss-tree-operate"
                    type="text"
                    size="mini"
                    :title="$t('element.delete')"
                    @click.stop="handleDelete(node, data)">
                    <i class="el-icon-delete"></i>
                  </Button>
                </div>
                <div class="udss-tree-label one-line">
                <span
                  class="udss-tree-text"
                  :title="data.remark"
                  @click="handleUpdate(node, data)">
              {{ node.label }}{{ data.unit.name | supplyUnit }}
                </span>
                </div>
              </div>
            </Tree>
          </div>
        </div>
      </div>
      <!--标签管理页面-->
      <Dialog
        :visible.sync="tagVisible"
        width="500px"
        :title="$t('manageTarget.titleC')">
        <div style="margin-top: 10px;padding: 0px 20px">
          <button :key="tag.id" class="button-tag" v-for="tag in tags.tags" @click="showEditInput(tag)">
            <input
              class="input-edit-tag"
              v-model="tagName"
              v-if="editTagVisible && currentTag.id === tag.id"
              type="text"
              ref="editTagInput"
              @keyup.enter.native="confirmEditTag"
              @blur="confirmEditTag" >
            <span v-else>{{tag.name}}</span>
            <i class="el-icon-close button-tag-close"  @click.stop="confirmDeleteTag(tag)"></i>
          </button>
          <Input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="tagName"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="confirmAddTag"
            @blur="confirmAddTag" />
          <Button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</Button>
        </div>
        <div slot="footer">
          <Button
            type="primary"
            size="small"
            class="button-close"
            @click="closeTagDialog">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
      <!--修改指标页面-->
      <Dialog
        top="20px"
        width="780px"
        :visible.sync="updateVisible"
        :close-on-click-modal="false"
        :title="$t('manageTarget.config')">
        <div class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="updateForm"
            label-width="110px"
            class="udss-node-parent">
            <FormItem :label="$t('manageTarget.parent')">
              <strong>{{ parentData.name | supplyName }}</strong>
            </FormItem>
            <FormItem :label="$t('manageTarget.editParent')" prop="pid" v-if="dataC.pid > 0">
              <Select
                style="width: 100%"
                v-model="dataC.pid"
                filterable>
                <Option
                  v-for="node in fNodes"
                  :key="node.id"
                  v-if="node.id !== dataC.id && !node.is_leaf"
                  :label="node.name"
                  :value="node.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('manageTarget.name')" prop="name">
              <Input v-model="dataC.name" />
            </FormItem>
            <FormItem :label="$t('manageTarget.leaf')" prop="is_leaf" v-if="!(dataC.children && dataC.children.length)">
              <RadioGroup v-model="dataC.is_leaf">
                <Radio :label="false">{{$t('element.yes')}}</Radio>
                <Radio :label="true">{{$t('element.no')}}</Radio>
              </RadioGroup>
            </FormItem>
            <template v-if="dataC.is_leaf === true">
              <FormItem :label="$t('manageTarget.unit')" prop="unit">
                <Select v-model="unitId" style="width: 100%">
                  <Option
                    v-for="type in unitType"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id"></Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('manageTarget.decimals')" prop="decimals">
                <Input v-model="dataC.decimals" type="number" />
              </FormItem>
              <!--数据类型-->
              <!--<FormItem :label="$t('manageTarget.dataType')" prop="data_type_id">-->
                <!--<Select v-model="dataC.data_type_id" style="width: 100%">-->
                  <!--<Option-->
                    <!--v-for="type in dataType"-->
                    <!--:key="type.id"-->
                    <!--:label="type.name"-->
                    <!--:value="type.id"></Option>-->
                <!--</Select>-->
              <!--</FormItem>-->
              <!--<FormItem :label="$t('manageTarget.order')" prop="decimals">-->
              <!--<Input v-model="dataC.order_no" type="number" />-->
              <!--</FormItem>-->
              <FormItem :label="$t('manageTarget.appendTag')">
                <Autocomplete
                  style="width: 100%;"
                  v-model="selLabel"
                  :fetch-suggestions="querySearchTag"
                  placeholder="标签名"
                  @select="handleSelectTag">
                  <template slot-scope="{ item }">
                    <div>{{ item.name }}</div>
                    <!--<span class="addr">{{ item.address }}</span>-->
                  </template>
                </Autocomplete>
              </FormItem>
              <FormItem :label="$t('manageTarget.tag')">
                <div style="line-height: 30px;" class="ind-tag">
                  <Tag
                    :key="tag.id"
                    v-for="tag in labelTags"
                    closable
                    :disable-transitions="false"
                    size="small"
                    @close="handleLabelClose(tag)">
                    {{tag.name}}
                  </Tag>
                </div>
              </FormItem>
              <FormItem label="是否录入详情" prop="has_detail">
                <RadioGroup v-model="dataC.has_detail" :disabled="!detailStatus">
                  <Radio :label="true">{{$t('element.yes')}}</Radio>
                  <Radio :label="false">{{$t('element.no')}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="详情类型" prop="detail_template_id" v-show="dataC.has_detail === true">
                <RadioGroup v-model="dataC.detail_template_id" :disabled="!detailStatus">
                  <Radio :label="item.id" v-for="item in indDetail" :key="item.id">{{item.name}}</Radio>
                </RadioGroup>
              </FormItem>
              <!--<FormItem :label="$t('manageTarget.indType')" prop = 'ind_type_id'>
                <RadioGroup v-model="dataC.ind_type_id">
                  <Radio size="mini" v-if="ind.id !== 0" v-for="ind in indType" :key="ind.id" :label="ind.id">{{ind.name}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="指标选择" v-show="dataC.ind_type_id === 2">
                <Autocomplete
                  clearable
                  class="inline-input"
                  style="width: 100%"
                  v-model="currentInd"
                  :fetch-suggestions="querySearch"
                  placeholder="选取指标"
                  :trigger-on-focus="false"
                  @select="handleSelect">
                  <i
                    v-show="currentInd"
                    style="cursor: pointer; color: black;"
                    class="el-icon-circle-close-outline"
                    slot="suffix"
                    @click="handleIconClick">
                  </i>
                  <template slot-scope="{ item }">
                    <span>{{ item.value }}</span>
                  </template>
                </Autocomplete>
              </FormItem>
              <FormItem label="复合公式" prop="formula" v-show="dataC.ind_type_id === 2">
                <Input @change="checkInput(dataC.formula)" v-model="dataC.formula" type="textarea" id="formula2"/>
                <div class="error-msg">{{errorMsg}}</div>
              </FormItem>
              <FormItem label="复合公式描述" v-show="dataC.ind_type_id === 2 && formulaDetail">
                <div class="formula-box" v-show="formulaDetail.length > 0">
                  <div v-for="(text, index) in formulaDetail" :key="index">
                    {{text}}
                  </div>
                </div>
              </FormItem>-->
            </template>
            <template v-if="dataC.pid === inputIndPid">
              <FormItem label="是否参与计算" prop="is_calc">
                <RadioGroup v-model="dataC.is_calc" :disabled="!detailStatus">
                  <Radio :label="true">{{$t('element.yes')}}</Radio>
                  <Radio :label="false">{{$t('element.no')}}</Radio>
                </RadioGroup>
              </FormItem>
            </template>
            <FormItem :label="$t('manageTarget.remark')" prop="remark">
              <Input v-model="dataC.remark" type="textarea" />
            </FormItem>
          </Form>
          <div class="udss-node-child">
            <Tree
              class="udss-preview-tree"
              node-key="id"
              :data="dataPath"
              :props="defaultProps"
              :default-expanded-keys="expandedKeys">
              <div
                class="udss-limit-length one-line"
                slot-scope="{ node, data }"
                :title="data.remark">
              <span :class="{'udss-is-current': data.id === dataC.id}">
                {{ node.label }}{{ data.unit.name | supplyUnit }}
              </span>
              </div>
            </Tree>
          </div>
        </div>
        <div slot="footer">
          <Button
            v-hasPermission="'w'"
            class="button-confirm"
            type="primary"
            size="small"
            :disabled="!dataC.name"
            :loading="editSaveLoading"
            @click="confirmUpdate">{{$t('element.buttonConfirm')}}</Button>
          <Button
            class="button-reset"
            type="primary"
            size="small"
            @click="resetUpdate">{{$t('element.buttonReset')}}</Button>
          <Button
            class="button-close"
            type="primary"
            size="small"
            @click="closeUpdateDialog">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
      <!--新增指标页面-->
      <Dialog
        :visible.sync="createVisible"
        top="44px"
        width="500px"
        :close-on-click-modal="false"
        :title="$t('element.append')">
        <div class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="createForm"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem :label="$t('manageTarget.last')">
              <strong>{{ parentData.name | supplyName }}</strong>
            </FormItem>
            <FormItem :label="$t('manageTarget.name')" prop="name">
              <Input v-model="dataC.name" />
            </FormItem>
            <FormItem :label="$t('manageTarget.leaf')" prop="is_leaf">
              <RadioGroup v-model="dataC.is_leaf">
                <Radio :label="false">{{$t('element.yes')}}</Radio>
                <Radio :label="true">{{$t('element.no')}}</Radio>
              </RadioGroup>
            </FormItem>
            <template v-if="dataC.is_leaf === true">
              <FormItem :label="$t('manageTarget.unit')" prop="unit.id">
                <Select v-model="unitId" style="width: 100%;">
                  <Option
                    v-for="type in unitType"
                    :key="type.id"
                    :label="type.name"
                    :value="type.id"></Option>
                </Select>
              </FormItem>
              <FormItem :label="$t('manageTarget.decimals')" prop="decimals">
                <Input v-model="dataC.decimals" type="number" />
              </FormItem>
              <!--数据类型-->
              <!--<FormItem :label="$t('manageTarget.dataType')" prop="data_type_id">-->
                <!--<Select v-model="dataC.data_type_id" style="width: 100%;">-->
                  <!--<Option-->
                    <!--v-for="type in dataType"-->
                    <!--:key="type.id"-->
                    <!--:label="type.name"-->
                    <!--:value="type.id"></Option>-->
                <!--</Select>-->
              <!--</FormItem>-->
              <FormItem :label="$t('manageTarget.appendTag')">
                <Autocomplete
                  style="width: 100%;"
                  v-model="selLabel"
                  :fetch-suggestions="querySearchTag"
                  placeholder="标签名"
                  @select="handleSelectTag">
                  <template slot-scope="{ item }">
                    <div>{{ item.name }}</div>
                  </template>
                </Autocomplete>
              </FormItem>
              <FormItem :label="$t('manageTarget.tag')">
                <div style="line-height: 30px;" class="ind-tag">
                  <Tag
                    :key="tag.id"
                    v-for="tag in labelTags"
                    closable
                    :disable-transitions="false"
                    size="small"
                    @close="handleLabelClose(tag)">
                    {{tag.name}}
                  </Tag>
                </div>
              </FormItem>
              <FormItem label="是否录入详情" prop="has_detail">
                <RadioGroup v-model="dataC.has_detail">
                  <Radio :label="true">{{$t('element.yes')}}</Radio>
                  <Radio :label="false">{{$t('element.no')}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="详情类型" prop="detail_template_id" v-show="dataC.has_detail === true">
                <RadioGroup v-model="dataC.detail_template_id">
                  <Radio :label="item.id" v-for="item in indDetail" :key="item.id">{{item.name}}</Radio>
                </RadioGroup>
              </FormItem>
              <!--<FormItem :label="$t('manageTarget.indType')" prop = 'ind_type_id'>
                <RadioGroup v-model="dataC.ind_type_id">
                  <Radio v-if="ind.id !== 0" v-for="ind in indType" :key="ind.id" :label="ind.id">{{ind.name}}</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem label="指标选择" v-show="dataC.ind_type_id === 2">
                <Autocomplete
                  clearable
                  class="inline-input"
                  style="width: 100%"
                  v-model="currentInd"
                  :fetch-suggestions="querySearch"
                  placeholder="选取指标"
                  :trigger-on-focus="false"
                  @select="handleSelect">
                  <i
                    v-show="currentInd"
                    style="cursor: pointer; color: black;"
                    class="el-icon-circle-close-outline"
                    slot="suffix"
                    @click="handleIconClick">
                  </i>
                  <template slot-scope="{ item }">
                    <span>{{ item.value }}</span>
                  </template>
                </Autocomplete>
              </FormItem>
              <FormItem label="复合公式" prop="formula" v-show="dataC.ind_type_id === 2">
                <Input @change="checkInput(dataC.formula)" id="formula" v-model="dataC.formula" type="textarea" />
                <div class="error-msg">{{errorMsg}}</div>
              </FormItem>
              <FormItem label="复合公式描述" v-show="dataC.ind_type_id === 2 && formulaDetail">
                <div class="formula-box" v-show="formulaDetail.length > 0">
                  <div v-for="(text, index) in formulaDetail" :key="index">
                    {{text}}<br/>
                  </div>
                </div>
              </FormItem>-->
              <!--<FormItem :label="$t('manageTarget.order')" prop="order_no">-->
              <!--<Input v-model="dataC.order_no" type="number" />-->
              <!--</FormItem>-->
            </template>
            <template v-if="dataC.pid === inputIndPid">
              <FormItem label="是否参与计算" prop="is_calc">
                <RadioGroup v-model="dataC.is_calc">
                  <Radio :label="true">{{$t('element.yes')}}</Radio>
                  <Radio :label="false">{{$t('element.no')}}</Radio>
                </RadioGroup>
              </FormItem>
            </template>
            <FormItem :label="$t('manageTarget.remark')" prop="remark">
              <Input v-model="dataC.remark" type="textarea" />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            :loading="addSaveLoading"
            @click="confirmCreate">{{$t('element.buttonConfirm')}}</Button>
          <Button
            class="button-reset"
            type="primary"
            size="small"
            @click="resetCreate">{{$t('element.buttonReset')}}</Button>
          <Button
            class="button-close"
            type="primary"
            size="small"
            @click="closeCreateDialog">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
      <!--新增指标类别页面-->
      <Dialog
        :visible.sync="createTypeVisible"
        top="200px"
        width="500px"
        :title="$t('manageTarget.titleD')">
        <div class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="createForm"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem :label="module" prop="name">
              <Input v-model="dataC.name" />
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            :disabled="!dataC.name"
            @click="confirmCreateType">{{$t('element.buttonConfirm')}}</Button>
          <Button
            class="button-reset"
            type="primary"
            size="small"
            @click="resetCreate">{{$t('element.buttonReset')}}</Button>
          <Button
            class="button-close"
            type="primary"
            size="small"
            @click="closeCreateTypeDialog">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Tag, Autocomplete } from 'element-ui'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import { Container } from './widgets'
  export default {
    name: 'ManageTarget',
    components: {
      Container, Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Tag, Autocomplete
    },
    mixins: [ TogglePage, ObjInstance, StandTree ],
    data () {
      return {
        downButton: [true, true, false],
        title: '',
        module: this.$t('manageTarget.module'),
        currentInd: '',
        errorMsg: '',
        formulaId: [],
        labelOptions: [],
        selLabel: '',
        labelTags: [],
        unitId: '',
        unitName: '',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        dragId: [],
        filterText: '',
        queryData: [],
        activeIndType: '',
        activeIndex: 0,
        updateVisible: false,     // 优化配置模态框
        createVisible: false,
        createTypeVisible: false,
        tagVisible: false,
        tagName: '',
        tagType: '',
        createModalExist: false,
        updateModalExist: false,
        dataC: {},
        memory: {},
        rules: {
          name: [
            { required: true, message: this.$t('manageTarget.message'), trigger: 'change' }
          ],
          decimals: [
            {
              validator (rule, value, callback) {
                String(value).indexOf('.') > -1
                  ? callback(new Error(this.$t('manageTarget.error')))
                  : callback()
              },
              trigger: 'change'
            }
          ]
        },
        inputIndPid: 0,
        editTagVisible: false,
        currentTag: '',
        inputVisible: false,
        addSaveLoading: false,
        editSaveLoading: false
      }
    },
    beforeDestroy () {
      this.updateOrder()
    },
    mounted () {
      this.$nextTick(function () {
        this.inputIndPid = JSON.parse(window.sessionStorage.getItem('udssInfo')).input_ind_pid
        this.getTags()
        this.getDataType()
        this.getIndType()
        this.getIndDetail()
        this.getUnitType()
        this.getTargets()
        let timer = setInterval(() => {
          if (this.targets && this.targets.length > 0) {
            this.activeIndType = this.targets[0].id
            clearInterval(timer)
          }
        }, 40)
      })
    },
    methods: {
      ...mapActions('config', ['getDataType', 'getIndType', 'getUnitType', 'getIndDetail']),
      ...mapMutations('target', ['getTarget', 'setDetailStatus']),
      ...mapActions('target', ['getTargets', 'create', 'update', 'delete', 'getTagTypes', 'createTag', 'getTags', 'deleteTag', 'editTag', 'changeOrder', 'getDetailStatus']),
      ...mapMutations('config', ['config', 'exportDataA']),
      downCurrentData () {
        this.exportDataA({'name': this.title, 'url': '/v1/ind/exc'})
      },
      downAllData () {
      },
      // 标签管理逻辑代码
      handleTagAdd () {
        this.tagVisible = true
      },
      showInput () {
        this.inputVisible = true
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },
      showEditInput (data) {
        this.editTagVisible = true
        this.currentTag = data
        this.tagName = data.name
        this.$nextTick(() => {
          this.$refs.editTagInput[0].focus()
        })
      },
      handleAddTag () {
        this.tagName = ''
        this.tagVisible = true
      },
      closeTagDialog () {
        this.tagVisible = false
      },
      confirmAddTag () {
        let inputValue = this.tagName
        if (inputValue) {
          this.createTag({'name': this.tagName})
        }
        this.inputVisible = false
        this.tagName = ''
      },
      confirmEditTag () {
        if (this.tagName !== this.currentTag.name) {
          this.editTag({'name': this.tagName, 'id': this.currentTag.id})
        }
        this.currentTag = ''
        this.tagName = ''
        this.editTagVisible = false
      },
      confirmDeleteTag (data) {
        MessageBox.confirm(this.$t('element.confirm'), this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.deleteTag(data)
        }).catch(() => {
        })
      },
      // --------------
      querySearchTag (queryString, cb) {
        var restaurants = this.labelOptions
        var results = queryString ? restaurants.filter(this.createFilterTag(queryString)) : restaurants
        cb(results)
      },
      createFilterTag (queryString) {
        return (restaurant) => {
          return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      handleSelectTag (item) {
        this.addLabel(item)
      },
      // 拖拽效果
      handleDragEnd (draggingNode, dropNode, dropType, ev) {
        let parentNode = this.fNodes.find(node => node.id === draggingNode.data.pid)
        parentNode.children.forEach((node, index) => {
          node.order_no = index + 1
        })
        let params = parentNode.children.map(node => {
          return {
            id: node.id,
            order_no: node.order_no
          }
        })
        this.dragId.push(...params)
        let newArr = []
        this.dragId.forEach((node, index) => {
          let num = this.dragId.findIndex(item => item.id === node.id)
          if (num === index) {
            newArr.push(node)
          } else {
            newArr.find(item => item.id === node.id).order_no = node.order_no
          }
        })
        this.dragId = newArr
      },
      allowDrop (draggingNode, dropNode, type) {
        if (type === 'inner') {
          return false
        } else if (draggingNode.data.pid === dropNode.data.pid) {
          return true
        } else {
          return false
        }
      },
      allowDrag (draggingNode) {
        return true
      },
      // 更新排序
      updateOrder () {
        if (this.dragId.length > 0) {
          this.changeOrder(this.dragId)
        }
      },
      // 复合指标显示逻辑
      querySearch (queryString, cb) {
        var restaurants = this.singleInd
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      // 选择器
      createFilter (queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
        }
      },
      // 获取输入框光标位置
      getInputPosition (id) {
        var $input = document.getElementById(id)
        var cursurPosition = 0
        if ($input.selectionStart) { // 非IE
          cursurPosition = $input.selectionStart
        } else { // IE
          try {
            var range = document.selection.createRange()
            range.moveStart('character', -$input.value.length)
            cursurPosition = range.text.length
          } catch (e) {
            cursurPosition = 0
          }
        }
        return cursurPosition
      },
      // 判断运算符
      isOperator (value) {
        var operatorString = '+-*/()'
        return operatorString.indexOf(value) > -1
      },
      // 展示指标名称
      showFormula (str) {
        let data = str.split('')
        let res = []
        let count = 0
        data.forEach(node => {
          if (this.isOperator(node)) {
            count++
            res[count] = node
            count++
          } else {
            if (node !== ' ') {
              res[count] ? res[count] = res[count] + node : res[count] = node
            }
          }
        })
        let newRes = []
        // 数组去重
        res.forEach((node, index) => {
          if (res.indexOf(node) === index) {
            newRes.push(node)
          }
        })
        let result = []
        this.formulaId = []
        newRes.forEach(node => {
          if (node.indexOf('F') === 0) {
            var index = this.singleInd.find(item => item.id === Number(node.slice(1)))
            if (index) {
              let child = node + ': ' + index.value
              result.push(child)
              this.formulaId.push(index.id)
            }
          }
        })
        return result
      },
      handleSelect (item) {
        let node = 'F' + item.id
        let index = 0
        let pre = ''
        let next = ''
        if (this.dataC.id) {
          index = this.getInputPosition('formula2')
        } else {
          index = this.getInputPosition('formula')
        }
        pre = this.dataC.formula.substring(0, index)
        next = this.dataC.formula.substring(index)
        this.dataC.formula = pre + node + next
      },
      handleIconClick () {
        this.currentInd = ''
      },
      checkInput (text) {
        let check = this.checkText(text)
        if (check === 1) {
          this.errorMsg = ''
        } else {
          this.errorMsg = '输入格式有误'
        }
      },
      checkText (text) {
        // 匹配这些中文标点符号 。 ？ ！ ， 、 ； ： “ ” ‘ ' （ ） 《 》 〈 〉 【 】 『 』 「 」 ﹃ ﹄ 〔 〕 … — ～ ﹏ ￥
        // let reg = /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/
        // var regs = new RegExp('[\\u4E00-\\u9FFF]+', 'g')   // 匹配中文
        // var regss = new RegExp('[a-zA-EG-Z]', 'g')   // 匹配英文
        if (text) {
          let reg1 = /^[0-9F\s+*-/()]+$/
          if (reg1.test(text)) {
            return 1
          } else {
            return 2
          }
        } else {
          return 1
        }
      },
      // 验证输入内容是否合法
      checkFormula (text) {
        let data = text.split('')
        let res = []
        let count = 0
        data.forEach(node => {
          if (this.isOperator(node)) {
            count++
            res[count] = node
            count++
          } else {
            if (node !== ' ') {
              res[count] ? res[count] = res[count] + node : res[count] = node
            }
          }
        })
        res.forEach((node, index) => {
          if (node.indexOf('F') === 0) {
            var cur = this.singleInd.find(item => item.id === Number(node.slice(1)))
            if (cur) {
              res[index] = 10
            }
          }
        })
        let check = this.checkText(text)
        if (check === 1) {
          let status = this.validFormula(res.join(''))
          if (status) {
            this.errorMsg = ''
          } else {
            this.errorMsg = '输入格式有误'
          }
        } else {
          this.errorMsg = '输入格式有误'
        }
      },
      // 验证公式合法性
      validFormula (string) {
        // 剔除空白符
        string = string.replace(/\s/g, '')
        // 错误情况，空字符串
        if (string === '') {
          return false
        }
        // 错误情况，运算符连续
        let reg1 = /[+*-/]{2,}/
        if (reg1.test(string)) {
          // console.log('运算符连续')
          return false
        }
        // 空括号
        if (/\(\)/.test(string)) {
          return false
        }
        // 错误情况，括号不配对
        let stack = []
        for (let i = 0, item; i < string.length; i++) {
          item = string.charAt(i)
          if (item === '(') {
            stack.push('(')
          } else if (item === ')') {
            if (stack.length > 0) {
              stack.pop()
            } else {
              return false
            }
          }
        }
        if (stack.length !== 0) {
          return false
        }
        // 错误情况，以运算符开头
        if (/^[+*-/]/.test(string)) {
          return false
        }
        // 错误情况， 以运算符结尾
        if (/[+*-/]$/.test(string)) {
          return false
        }
        // 错误情况，(后面是运算符
        if (/\([+*-/]/.test(string)) {
          return false
        }
        // 错误情况，)前面是运算符
        if (/[+*-/]\)/.test(string)) {
          return false
        }
        // 错误情况，(前面不是运算符
        if (/[^+*-/]\(/.test(string)) {
          return false
        }
        // 错误情况，)后面不是运算符
        if (/\)[^+*-/]/.test(string)) {
          return false
        }
        return true
      },
      changeType (id, index) {
        this.activeIndType = id
        this.activeIndex = index
        // console.log(id, index)
      },
      // 整个树形结构进行排序
      sortTree (tree) {
        tree.forEach(node => {
          node.children && node.children.length > 1 && this.sortTree(node.children)
        })
        tree.sort((a, b) => {
          return a.id - b.id
        })
      },
      // 对树形结构一部分进行排序
      sortTreeById (tree, pid) {
        if (pid === 0) {
          tree.sort((a, b) => {
            return a.order_no - b.order_no
          })
        } else {
          let fTree = this.flatten(tree)
          let parent = fTree.find(node => node.id === pid)
          parent.children.sort((a, b) => {
            return a.order_no - b.order_no
          })
        }
      },
      // 标签点击×按钮触发事件
      handleLabelClose (tag) {
        this.labelTags.splice(this.labelTags.indexOf(tag), 1)
        this.labelOptions.push(tag)
      },
      // 点击标签选项触发事件
      addLabel (item) {
        this.labelTags.push(this.labelOptions.find(node => { return node.id === item.id }))
        this.labelOptions = this.labelOptions.filter(node => {
          return node.id !== item.id
        })
      },
      filterNode (value, data) {
        if (!value) return true
        return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      },
      getParentData (data) {
        return this.fNodes.find(node => node.id === data.pid) || {}
      },
      getDataPath (data) {
        let wrapper = data
        let counter = 0   // 限制循环层级, 同时也限制了树深
        while (wrapper.pid > 0 && counter++ < 10) {
          let parent = this.clone(this.getParentData(wrapper))
          parent.children = [wrapper]
          wrapper = parent
        }
        return [wrapper]
      },
      resetTag () {
        this.labelOptions = this.tags.tags
        this.labelTags = []
        this.selLabel = ''
        this.unitId = ''
        this.unitName = ''
      },
      resetCreate () {
        this.resetTag()
        this.currentInd = ''
        this.errorMsg = ''
        this.$refs.createForm.resetFields()
      },
      resetUpdate () {
        this.dataC = this.clone(this.memory)
        this.labelTags = this.dataC.tags ? this.dataC.tags : []
        this.selLabel = ''
        if (this.labelTags) {
          this.labelOptions = this.tags.tags.filter(node => {
            return this.labelTags.findIndex(item => item.id === node.id) < 0
          })
        }
        this.currentInd = ''
        this.errorMsg = ''
        this.unitId = this.dataC.unit.id
        // this.$refs.updateForm.resetFields() // 加resetFields容易出bug，报错无法弹出dialog
      },
      confirmCreate () {
        // console.log(this.dataC, '1111111111')
        this.dataC.ind_type_id === 1 ? this.errorMsg = '' : this.checkFormula(this.dataC.formula)
        this.$refs.createForm.validate(valid => {
          if (valid && this.errorMsg === '') {
            let data = this.unitType.find(node => node.id === this.unitId)
            this.unitName = data ? data.name : this.$t('manageTarget.unknown')
            this.dataC.tagIds = this.labelTags.map(node => {
              return {'id': node.id}
            })
            this.dataC.unit = {
              'id': this.unitId,
              'name': this.unitName
            }
            this.dataC.tags = this.labelTags
            this.dataC.formula_ind = this.formulaId.join(',')
            let parentNode = this.fNodes.find(node => node.id === this.dataC.pid)
            let leng = parentNode.children ? parentNode.children.length + 1 : 1
            this.dataC.order_no = leng
            // console.log(this.dataC)
            new Promise((resolve, reject) => {
              this.addSaveLoading = true
              this.create({resolve, reject, payload: this.clone(this.dataC)})
            }).then(() => {
              this.addSaveLoading = false
              this.closeCreateDialog()
            }).catch(() => {
              this.addSaveLoading = false
            })
          }
          return valid
        })
      },
      confirmCreateType () {
        this.$refs.createForm.validate(valid => {
          if (valid) {
            this.create(this.clone(this.dataC))
            this.closeCreateTypeDialog()
          }
          return valid
        })
      },
      confirmUpdate () {
        this.dataC.ind_type_id === 1 ? this.errorMsg = '' : this.checkFormula(this.dataC.formula)
        this.$refs.updateForm.validate(valid => {
          if (valid && this.errorMsg === '') {
            let data = this.unitType.find(node => node.id === this.unitId)
            this.unitName = data ? data.name : this.$t('manageTarget.unknown')
            this.dataC.unit = {
              'id': this.unitId,
              'name': this.unitName
            }
            this.dataC.tagIds = this.labelTags.map(node => {
              return {'id': node.id}
            })
            this.dataC.tags = this.labelTags
            this.dataC.formula_ind = this.formulaId.join(',')
            // console.log(this.dataC, 'dataCCCCC')
            new Promise((resolve, reject) => {
              this.editSaveLoading = true
              this.update({resolve, reject, payload: this.clone(this.dataC)})
            }).then(() => {
              this.editSaveLoading = false
              this.formulaId = []
              this.closeUpdateDialog()
            }).catch(() => {
              this.editSaveLoading = false
            })
          }
          return valid
        })
      },
      handleUpdate (node, data) {
        // console.log(data)
        this.resetTag()
        this.memory = data
        this.dataC = this.clone(data)
        this.labelTags = this.dataC.tags ? this.dataC.tags : []
        if (this.labelTags) {
          this.labelOptions = this.labelOptions.filter(node => {
            return this.labelTags.findIndex(item => item.id === node.id) < 0
          })
        }
        this.unitId = this.dataC.unit.id
        if (data.has_detail) {
          this.getDetailStatus(data.id)
        } else {
          this.setDetailStatus(true)
        }
        // 首次打开改变标志量，之后打开重置表单
        this.updateModalExist ? this.resetUpdate() : this.updateModalExist = true
        this.openUpdateDialog()
      },
      handleAppend (node, data) {
        this.dataC = {
          pid: data ? data.id : 0,
          name: '',
          remark: '',
          unit: {},
          data_type_id: '',
          tagIds: '',
          tags: null,
          ind_type_id: 1,
          formula: '',
          formula_ind: '',
          order_no: '',
          is_leaf: true,
          has_detail: false,
          detail_template_id: 0,
          is_calc: true,
          decimals: ''
        }
        this.resetTag()
        this.createModalExist ? this.resetCreate() : this.createModalExist = true
        this.openCreateDialog()
      },
      handleAppendType () {
        this.dataC = {
          pid: 0,
          name: '',
          remark: '',
          unit: {},
          data_type_id: '',
          tagIds: '',
          tags: null,
          ind_type_id: 1,
          formula: '',
          order_no: 50,
          is_leaf: false,
          is_sys: false,
          decimals: ''
        }
        this.resetTag()
        // this.createModalExist ? this.resetCreate() : this.createModalExist = true
        this.createTypeVisible = true
      },
      handleDelete (node, data) {
        // console.log(data.id)
        MessageBox.confirm(this.$t('element.confirm'), this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.delete({payload: data, resolve, reject})
          }).then(() => {
          })
        }).catch(() => {
        })
      },
      handleDeleteType (data) {
        MessageBox.confirm(this.$t('element.confirm'), this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          new Promise((resolve, reject) => {
            this.delete({payload: data, resolve, reject})
          }).then(() => {
            this.activeIndType = 10
            this.activeIndex = 0
          })
        })
      },
      openCreateDialog () {
        this.createVisible = true
      },
      closeCreateTypeDialog () {
        this.createTypeVisible = false
      },
      closeCreateDialog () {
        this.createVisible = false
      },
      openUpdateDialog () {
        this.updateVisible = true
      },
      closeUpdateDialog () {
        this.updateVisible = false
      }
    },
    computed: {
      ...mapGetters('target', ['targets', 'tagTypes', 'tags', 'detailStatus']),
      ...mapGetters('config', ['dataType', 'indType', 'unitType', 'indDetail']),
      el () {
        return this.$refs.tree
      },
      parentData () {
        return this.getParentData(this.dataC)
      },
      dataPath () {
        return this.getDataPath(this.dataC)
      },
      expandedKeys () {
        let fNodes = this.flatten(this.dataPath)
        return fNodes.length < 24 ? fNodes.map(node => node.id) : []
      },
      fNodes () {
        return this.flatten(this.targets)
      },
      singleInd () {
        return this.fNodes.filter(node => node.is_leaf === true && node.ind_type_id === 1).map(node => {
          return {
            value: node.name,
            id: node.id
          }
        })
      },
      formulaDetail () {
        return this.dataC.formula ? this.showFormula(this.dataC.formula) : []
      },
      cloneData () {
        return this.clone(this.targets)
      }
    },
    filters: {
      supplyName (value) {
        return value || '无'
      },
      supplyUnit (value) {
        return value === '无' || value === '未知' || value === 'None' ? '' : '（' + value + '）'
      }
    },
    watch: {
      filterText (value) {
        this.$refs.tree.filter(value)
      }
    }
  }
</script>

<style scoped >
  .error-msg{
    color: #f56c6c;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    position: absolute;
  }
  .udss-board-body {
    width: 100%;
    height: 100%;
    font-size: 14px;
  }
  .udss-dialog-banner {
    overflow: hidden;
    padding: 30px 40px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }
  .udss-dialog-form {
    width: 420px;
    margin: 0 auto -15px;
  }
  .udss-board-toolbox {
    padding: 0px;
  }
  .search-input {
    border-radius: 4px;
    width: 25%;
    height: 34px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 34px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 7px right 20px;
  }
  .type-button {
    margin: 2px 2px;
    cursor: pointer;
    line-height: 20px;
    font-size: 16px;
    padding: 8px 30px;
    color: #767474;
    outline: none;
    border: none;
    /*background-color: #eee;*/
    text-decoration: none;
    background-image: -moz-linear-gradient(top, #F5F5F5, #D8D8D8);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F5F5F5), color-stop(1,#D8D8D8));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F5F5F5', endColorstr='#D8D8D8', GradientType =0);
  }
  .type-button.is-active {
    color: #ffffff;
    background-image: -moz-linear-gradient(top, #EBB747, #DBA26F);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DBA26F));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DBA26F', GradientType =0);
  }
  .type-button-delete {
    position: relative;
    color: #767474;
    font-size: 14px;
    left: 15px;
    top: 0px;
  }
  .type-button-delete:hover {
   color: #000000;
  }
  .type-button-add {
    cursor: pointer;
    font-size: 16px;
    line-height: 20px;
    padding: 10px 15px;
    color: #767474;
    outline: none;
    border: none;
    background-image: -moz-linear-gradient(top, #F5F5F5, #D8D8D8);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #F5F5F5), color-stop(1,#D8D8D8));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#F5F5F5', endColorstr='#D8D8D8', GradientType =0);
  }
  .target-tree {
    height: calc(100% - 60px);
  }
  .target-tree-box {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
  .tree-header {
    width: 100%;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    color: #000000;
    background: #F2F2F2;
  }
  .tree-header-left {
    width: auto;
    padding-left: 50px;
    padding-right: 220px;
    vertical-align: middle;
  }
  .tree-header-right {
    float: right;
    width: 220px;
    text-align: center;
  }
  .udss-tree-node {
    display: inline-block;
    width: 100%;
  }
  .udss-tree-label {
    vertical-align: middle;
    line-height: 40px;
  }
  .udss-tree-body {
    vertical-align: middle;
    padding-left: 22px;
    float: right;
    width: 220px;
    line-height: 40px;
  }
  .udss-tree-body button {
    margin: 0 20px;
  }
  .udss-tree-body i {
   font-size: 18px;
    color: #4A90E2;
  }
  .udss-tree-text {
    padding: 3px 0;
  }
  .udss-tree-operate {
    padding: 0 5px;
  }
  .udss-node-parent {
    float: left;
    width: 410px;
  }
  .udss-node-child {
    box-sizing: border-box;
    margin-left: 450px;
    min-height: 200px;
    border: solid 1px #F2F2F2;
  }
  .udss-is-current {
    color: #409EFF;
  }
  .udss-limit-length {
    width: calc(100% - 30px);
  }
  .button-tag {
    background-color: #4A90E2;
    border: none;
    border-radius: 5px;
    outline: none;
    color: #ffffff;
    font-size: 14px;
    line-height: 26px;
    position: relative;
    margin: 2px 3px;
    padding: 2px 25px 2px 10px;
  }
  .button-tag i {
    color: #24476F;
  }
  .button-tag-close {
    position: absolute;
    font-size: 14px;
    cursor: pointer;
    right: 5px;
    top: 8px;
  }
  .button-tag-close:hover{
    color: #ffffff;
  }
  .formula-box{
    border-radius: 4px;
    line-height: 20px;
    border: solid 1px #DCDFE6;
    padding: 4px 10px;
    white-space: normal;
    word-break: break-word;
  }
  .input-new-tag{
    width: 100px;
  }
  .input-edit-tag{
    width: 80px;
  }
</style>
