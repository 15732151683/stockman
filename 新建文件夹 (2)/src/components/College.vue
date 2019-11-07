<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-body">
        <div class="udss-board-toolbox">
          <input
            class="search-input"
            :placeholder="$t('element.filterText')"
            v-model="filterText" />
          <Button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: none; border-radius: 2px;"
            class="button-add"
            v-if="!onlyRead"
            @click="handleAppend">{{$t('college.new')}}</Button>
          <Button
            type="primary"
            size="mini"
            style="float: none; border-radius: 2px;"
            class="button-add college-tag-button"
            v-if="!onlyRead"
            @click="handleAddTag">标签管理</Button>
        </div>
        <div class="ind-tag tag-search-box" v-if="searchTags.length !== 0">
          <Tag
            type="info"
            size="small"
            :key="tag.id"
            v-for="(tag, index) in searchTags"
            closable
            :disable-transitions="false"
            @close="handleCloseSearchTags(tag, index)">
            {{tag.name}}
          </Tag>
        </div>
        <div class="college-list-line"></div>
        <div class="college-list-container" :style="{height: listHeight}">
          <draggable
            class="college-list"
            id="loadings"
            element="table"
            v-model="cloneColleges"
            :options="dragOptions"
            :move="onMove"
            @start="isDragging=true"
            @end="onEnd">
            <tr :class="[{'active-tr': item.make_part}]" v-for="(item, index) in cloneColleges" :key="index">
              <td>
                <i v-if="item.org_ids" class="college-icon-zuhe"></i>
                <i v-else class="college-icon-jichu"></i>
              </td>
              <td>{{item.short_name_cn}}</td>
              <td>{{item.name}}</td>
              <td>
                <i class="college-icon-edit" :title="$t('element.edit')" @click.stop="handleUpdate(item)"></i>
              </td>
              <td>
              <span
                @click="searchCollegeByTag(tag)"
                v-for="tag in item.tags"
                :key="tag.id"
                :class="['college-tag', {'college-tag-active': item.make_part}]">
                  {{tag.name}}
                </span>
              </td>
              <td>
                <Popover
                  v-if="!onlyRead"
                  placement="right"
                  width="160"
                  @show="changeCollegeTag(item, index)"
                  @hide="confirmBindTag"
                  trigger="click">
                  <Input
                    placeholder="标签搜索"
                    size="small"
                    suffix-icon="el-icon-search"
                    v-model="filterTag" />
                  <div class="popover-tag-box">
                    <ul>
                      <li v-show="filterTag.length === 0"><Checkbox :indeterminate="isIndeterminate" v-model="checkAllTag" @change="handleCheckAllTag">全选</Checkbox></li>
                      <CheckboxGroup v-model="checkedTags" @change="handleTagChange">
                        <li v-show="tagShowStatus.length ===0 ? true : tagShowStatus[idx]" v-for="(tag, idx) in tags" :key="tag.id"><Checkbox :label="tag">{{tag.name}}</Checkbox></li>
                      </CheckboxGroup>
                    </ul>
                  </div>
                  <div slot="reference" style="display: inline-block; outline: none;"><i class="college-icon-add"></i></div>
                </Popover>
              </td>
            </tr>
          </draggable>
        </div>
      </div>
      <!--修改院系页面-->
      <Dialog
        :modal="moda"
        top="20px"
        width="500px"
        :visible.sync="updateVisible"
        :close-on-click-modal="false"
        :title="$t('college.config')">
        <div class="college-selected" style=" margin-left: 110px;height: 60px;">
          <span style="line-height: 60px">院系类别：{{collegeDiffer === 1 ? (collegeNames ? collegeNames.name : ''): (collegeNames2 ? collegeNames2.name : '')}}</span>
        </div>

        <div v-if="collegeDiffer === 1" class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="updateForm"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem :label="$t('college.name')" prop="name">
              <Input clearable v-model="dataC.name" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.short_name_cn')" prop="short_name_cn">
              <Input clearable v-model="dataC.short_name_cn" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.name_en')" prop="name_en">
              <Input clearable v-model="dataC.name_en" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.short_name_en')" prop="short_name_en">
              <Input clearable v-model="dataC.short_name_en" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.website')" prop="website">
              <Input clearable v-model="dataC.website" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.remark')" prop="remark">
              <Input clearable v-model="dataC.remark" type="textarea" :disabled="onlyRead"/>
            </FormItem>
          </Form>
        </div>
        <div v-if="collegeDiffer === 2" class="udss-dialog-banner">
          <Form
            :model="dataD"
            :rules="rules"
            ref="updateForm2"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem label="院系中文全称" prop="name">
              <Input clearable v-model="dataD.name"  type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem label="院系中文简称" prop="short_name_cn">
              <Input clearable v-model="dataD.short_name_cn" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem label="院系组合选择" prop="org_ids">
              <div style="padding: 5px;border: 1px solid #D5D5D5;border-radius: 5px">
                <Input clearable suffix-icon="el-icon-search" v-model="filterCollege" size="mini"/>
                <div>
                  <CheckboxGroup :disabled="onlyRead" v-model="dataD.org_ids" @change="change"  style="display: flex;flex-flow: column nowrap;align-items: flex-start;height: 250px;overflow-y: scroll">
                    <Checkbox  :key="index" :label="data.id" v-for="(data, index) in collegeGroup">{{data.name}}</Checkbox>
                  </CheckboxGroup>
                </div>
              </div>
            </FormItem>
            <FormItem prop="make_part">
              <Checkbox v-model="dataD.make_part">参与绩效考评</Checkbox>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button v-if="!onlyRead && collegeDiffer === 1"
                  type="primary"
                  size="small"
                  class="button-delete"
                  @click="handleDelete(dataC)">
            {{$t('element.delete')}}
          </Button>
          <Button v-if="!onlyRead && collegeDiffer === 2"
                  type="primary"
                  size="small"
                  class="button-delete"
                  @click="handleDelete(dataD)">
            {{$t('element.delete')}}
          </Button>
          <Button
            v-if="!onlyRead || collegeDiffer === 2"
            type="primary"
            size="small"
            class="button-confirm"
            :disabled="(collegeDiffer === 1 && !dataC.name) || (collegeDiffer === 2 && !dataD.name)"
            :loading="editSaveLoading"
            @click="confirmUpdate">{{$t('element.buttonConfirm')}}</Button>
          <Button
            v-if="!onlyRead"
            type="primary"
            size="small"
            class="button-reset"
            @click="resetUpdate">{{$t('element.buttonReset')}}</Button>
          <Button
            type="primary"
            size="small"
            class="button-close"
            @click="closeUpdateDialog">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>

      <!--新增院系页面-->
      <Dialog
        custom-class="Dialog"
        :before-close="handleClose"
        :visible.sync="createVisible"
        top="44px"
        title="新增"
        width="500px">
        <div class="header">
          <div class="college-selected" style=" display: flex;flex-flow: row;justify-content: center;height: 60px;margin-top: 5px">
            <span style="line-height: 60px">院系类别：</span>
            <div style="display: flex;flex-flow: row;align-items: center;justify-content: space-around;width: 40%">
              <Radio  v-model="radioNum" :label='collegeNames ? collegeNames.id : []'>{{collegeNames ? collegeNames.name : ''}}</Radio>
              <Radio  v-model="radioNum" :label='collegeNames2 ? collegeNames2.id : []'>{{collegeNames2 ? collegeNames2.name : ''}}</Radio>
            </div>
          </div>
        </div>
        <div v-show="radioNum === '1'">
          <div class="udss-dialog-banner">
            <Form
              :model="dataC"
              :rules="rules"
              ref="createForm"
              label-width="110px"
              class="udss-dialog-form">
              <FormItem label="院系中文全称" prop="name">
                <Input clearable v-model="dataC.name" type="text" />
              </FormItem>
              <FormItem label="院系中文简称" prop="short_name_cn">
                <Input clearable v-model="dataC.short_name_cn" type="text" />
              </FormItem>
              <FormItem label="院系英文全称" prop="name_en">
                <Input clearable v-model="dataC.name_en" type="text" />
              </FormItem>
              <FormItem label="院系英文简称" prop="short_name_en">
                <Input v-model="dataC.short_name_en" type="text" />
              </FormItem>
              <FormItem label="网站地址" prop="website">
                <Input v-model="dataC.website" type="text" />
              </FormItem>
              <FormItem label="备注" prop="remark">
                <Input v-model="dataC.remark" type="textarea" />
              </FormItem>
            </Form>
          </div>
          <div style="padding: 10px 20px 20px 20px;display: flex;flex-flow: row;justify-content: flex-end" slot="footer">
            <div>
              <Button
                type="primary"
                size="small"
                class="button-confirm"
                :disabled="!dataC.name"
                :loading="addSaveLoading"
                @click="confirmCreate">{{$t('element.buttonConfirm')}}</Button>
              <Button
                type="primary"
                size="small"
                class="button-reset"
                @click="resetCreate">{{$t('element.buttonReset')}}</Button>
              <Button
                type="primary"
                size="small"
                class="button-close"
                @click="closeCreateDialog">{{$t('element.buttonClose')}}</Button>
            </div>
          </div>
        </div>
        <div v-show="radioNum === '2'">
          <div class="udss-dialog-banner">
            <Form
              :model="dataD"
              :rules="rules"
              ref="createForm2"
              label-width="110px"
              class="udss-dialog-form">
              <FormItem label="院系中文全称" prop="name">
                <Input clearable v-model="dataD.name" type="text" />
              </FormItem>
              <FormItem label="院系中文简称"   prop="short_name_cn">
                <Input clearable v-model="dataD.short_name_cn" type="text" />
              </FormItem>
              <FormItem label="院系组合选择" prop="org_ids">
                <div style="padding: 5px;border: 1px solid #D5D5D5;border-radius: 5px">
                  <Input clearable suffix-icon="el-icon-search" v-model="filterCollege" size="mini"/>
                  <div>
                    <CheckboxGroup @change="change" style="display: flex;flex-flow: column nowrap;align-items: flex-start;height: 250px;overflow-y: scroll" v-model="dataD.org_ids">
                      <Checkbox  :key="index" :label="data.id" v-for="(data, index) in collegeGroup">{{data.name}}</Checkbox>
                    </CheckboxGroup>

                  </div>
                </div>
              </FormItem>
              <FormItem label="" prop="make_part">
                <Checkbox v-model="dataD.make_part">参与绩效考评</Checkbox>
              </FormItem>
            </Form>
          </div>
          <div class="button-footer" slot="footer">
            <div>
              <Button
                type="primary"
                size="small"
                class="button-confirm"
                :disabled="!dataD.name"
                :loading="addSaveLoading2"
                @click="confirmCreate">{{$t('element.buttonConfirm')}}</Button>
              <Button
                type="primary"
                size="small"
                class="button-reset"
                @click="resetCreate2">{{$t('element.buttonReset')}}</Button>
              <Button
                type="primary"
                size="small"
                class="button-close"
                @click="closeCreateDialog2">{{$t('element.buttonClose')}}</Button>
            </div>
          </div>
        </div>
      </Dialog>
      <!--标签新增页面-->
      <Dialog
        :visible.sync="tagVisible"
        width="500px"
        title="标签管理">
        <div style="margin-top: 10px;padding: 0px 20px">
          <button :key="tag.id" class="button-tag" v-for="tag in tags" @click="showEditInput(tag)">
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
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Popover, CheckboxGroup, Checkbox, Tag } from 'element-ui'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import { Container } from './widgets'
  import draggable from 'vuedraggable'
  export default {
    name: 'ManageTarget',
    components: {
      Container, Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, draggable, Popover, CheckboxGroup, Checkbox, Tag
    },
    mixins: [ TogglePage, ObjInstance, StandTree ],
    data () {
      return {
        moda: true,
        collegeDiffer: 0,
        pha: [],
        dataType: '',
        calCollegeGroups: [],
        title: '',
        module: '院系',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        radioNum: '1',
        filterText: '',
        updateVisible: false,     // 优化配置模态框
        profileVisible: false,  // 介绍模态框
        createVisible: false,
        createModalExist: false,
        updateModalExist: false,
        dataC: {},
        dataD: {},
        memory: {},
        rules: {
          name: [
            { required: true, message: this.$t('college.messageA'), trigger: 'change' }
          ],
          short_name_cn: [
            { required: true, message: this.$t('college.messageB'), trigger: 'change' }
          ]
        },
        filterTag: '',
        tagVisible: false,
        tagName: '',
        currentTag: '',
        sortState: false,
        isDragging: false,
        dragStatus: true,
        cloneColleges: [],
        checkAllTag: false,
        checkedTags: [],
        isIndeterminate: true,
        currentCollege: {},
        tagStatus: false,
        tagShowStatus: [],
        searchTags: [],
        inputVisible: false,
        editTagVisible: false,
        addSaveLoading: false,
        addSaveLoading2: false,
        editSaveLoading: false,
        filterCollege: '',
        filterColleges: '',
        collegeGroup: [],
        shortName: [],
        newComplex: [],
        onlyRead: false,
        downButton: []
      }
    },
    mounted () {
      this.onlyRead = !this.$route.meta.permissionList.includes('w')
      this.getCollegeName()
      this.getCollege2()
      // Loading.addInterceptors(document.getElementById('loadings'))
      this.$nextTick(function () {
        this.getCollege()
        this.getTags()
        let timer = setInterval(() => {
          if (this.colleges && this.colleges.length > 0) {
            this.cloneColleges = this.colleges
            clearInterval(timer)
          }
        }, 20)
      })
      this.downButton = [true, false, true]
    },
    methods: {
      // ...mapActions('config', ['getDataType', 'getIndType', 'getUnitType']),
      ...mapMutations('college', ['getTarget', 'changeCollegeOrder']),
      ...mapActions('college', ['getCollege', 'create', 'delete', 'collegeAddTag', 'collegeSort', 'getTags', 'createTag', 'editTag', 'deleteTag', 'getCollegeName', 'getCollege2', 'updates']),
      ...mapMutations('config', ['config', 'exportDataB', 'exportDataA']),
      // 数据下载
      downCurrentData () {
        // console.log('current Data')
      },
      downAllData () {
        this.exportDataB({'name': '院系管理', 'url': '/v1/org/exc'})
      },
      // 标签搜索
      searchCollegeByTag (tag) {
        this.searchTags.findIndex(node => node.id === tag.id) < 0 && this.searchTags.push(tag)
        this.filterCollegeByTag(this.searchTags)
      },
      handleCloseSearchTags (tag, index) {
        this.searchTags.splice(index, 1)
        this.filterCollegeByTag(this.searchTags)
      },
      filterCollegeByTag (tags) {
        if (this.filterText) {
          this.cloneColleges = this.colleges.filter(node => {
            return node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1
          })
          this.dragStatus = false
        } else {
          this.cloneColleges = this.colleges
          this.dragStatus = true
        }
        if (tags.length !== 0) {
          this.dragStatus = false
          this.cloneColleges = this.cloneColleges.filter(node => {
            return node.tags.length !== 0 && node.tags.findIndex(item => tags.findIndex(child => child.id === item.id) > -1) > -1
          })
        }
      },
      // 标签管理逻辑代码
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
      // 拖拽
      onEnd (options) {
        let prev = options.oldIndex
        let next = options.newIndex
        let arg = {prev: prev, next: next}
        this.sortState = true
        this.changeCollegeOrder(arg)
        // this.$emit('dragChange', arg)
        // console.log(arg, '1111111111111')
      },
      onMove ({relatedContext, draggedContext}) {
        return true
      },
      handleCheckAllTag (val) {
        this.tagStatus = true
        this.checkedTags = val ? this.tags : []
        this.isIndeterminate = false
        this.currentCollege.tags = this.checkedTags
      },
      handleTagChange (val) {
        // this.filterTag = ''
        this.tagStatus = true
        let checkedCount = val.length
        this.checkAllTag = checkedCount === this.tags.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.tags.length
        this.currentCollege.tags = val
      },
      changeCollegeTag (item, index) {
        setTimeout(() => {
          this.currentCollege = item
          if (item.tags.length === 0) {
            this.checkedTags = []
            this.isIndeterminate = false
          } else {
            this.checkedTags = this.tags.filter(node => item.tags.findIndex(child => child.id === node.id) > -1)
            this.isIndeterminate = true
          }
        }, 10)
      },
      confirmBindTag () {
        if (this.tagStatus) {
          let data = this.checkedTags.map(node => {
            return {
              org_id: this.currentCollege.id,
              tag_id: node.id
            }
          })
          if (data.length === 0) {
            data = [{'org_id': this.currentCollege.id, 'tag_id': -1}]
          }
          this.tagStatus = false
          this.collegeAddTag({data, node: this.currentCollege, tags: this.checkedTab})
        }
      },
      updateSort () {
        let data = this.colleges.map(node => {
          return {
            id: node.id,
            order_by: node.order_by
          }
        })
        this.collegeSort(data)
        // console.log(data, 'paixu')
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
        while (wrapper.level > 1 && counter++ < 10) {
          let parent = this.clone(this.getParentData(wrapper))
          parent.children = [wrapper]
          wrapper = parent
        }
        return [wrapper]
      },
      resetCreate () {
        this.$refs.createForm.resetFields()
        this.filterCollege = ''
      },
      resetCreate2 () {
        this.$refs.createForm2.resetFields()
        this.filterCollege = ''
      },
      resetUpdate () {
        if (this.dataD.org_ids !== '') {
          this.dataD = this.clone(this.memory)
        } else {
          this.dataC = this.clone(this.memory)
        }
//        this.$refs.updateForm.resetFields()
      },
      confirmCreate () {
        if (this.radioNum === '1') {
          this.$refs.createForm.validate(valid => {
            if (valid) {
              new Promise((resolve, reject) => {
                this.addSaveLoading = true
                this.dataC.org_ids = ''
                this.dataC.org_type_id = this.radioNum * 1
                this.create({resolve, reject, payload: this.clone(this.dataC)})
              }).then((data) => {
                var s = this.cloneColleges.filter(item => {
                  return item.org_ids === ''
                })
                this.collegeGroup = s
                this.addSaveLoading = false
                this.closeCreateDialog()
              }).catch(() => {
                this.addSaveLoading = false
              })
            }
            return valid
          })
        } else if (this.radioNum === '2') {
          this.$refs.createForm2.validate(valid => {
            if (valid) {
              new Promise((resolve, reject) => {
                this.addSaveLoading2 = true
                this.dataD.org_type_id = this.radioNum * 1
                this.create({resolve, reject, payload: this.clone(this.dataD)})
              }).then((data) => {
                var orgs = data.is_count_org.split(',').map(obj => {
                  return obj - 0
                })
                this.colleges.forEach(item => {
                  let index = orgs.indexOf(item.id)
                  if (index > -1) {
                    item.make_part = true
                  } else {
                    item.make_part = false
                  }
                })
                this.addSaveLoading2 = false
                this.closeCreateDialog2()
              }).catch(() => {
                this.addSaveLoading2 = false
              })
            }
            return valid
          })
        }
      },
      confirmUpdate () {
        if (this.collegeDiffer === 1) {
          this.$refs.updateForm.validate(valid => {
            if (valid) {
              new Promise((resolve, reject) => {
                this.editSaveLoading = true
                this.updates({resolve, reject, payload: this.clone(this.dataC)})
              }).then(() => {
                this.collegeGroup = this.cloneColleges.filter(item => {
                  return item.org_ids === ''
                })
                this.editSaveLoading = false
                this.closeUpdateDialog()
              }).catch(() => {
                this.editSaveLoading = false
              })
            }
            return valid
          })
        } else {
          this.$refs.updateForm2.validate(valid => {
            if (valid) {
              new Promise((resolve, reject) => {
                this.editSaveLoading = true
                this.updates({resolve, reject, payload: this.clone(this.dataD)})
              }).then((data) => {
                var org = data.is_count_org.split(',')
                var orgs = org.map(item => {
                  return item - 0
                })
                this.colleges.forEach(item => {
//                 或者if (s > -1)
//                  var s = data.is.findIndex(child => child === item.id)
                  let index = orgs.indexOf(item.id)
                  if (index > -1) {
                    item.make_part = true
                  } else {
                    item.make_part = false
                  }
                })
                this.editSaveLoading = false
                this.closeUpdateDialog()
              }).catch(() => {
                this.editSaveLoading = false
              })
            }
            return valid
          })
        }
      },
      handleUpdate (data) {
        if (data.org_ids === '') {
          this.memory = data
          this.collegeDiffer = 1
          this.dataC = this.clone(data)
        } else {
          this.memory = data
          this.collegeDiffer = 2
          this.dataD = this.clone(data)
        }
        // 首次打开改变标志量，之后打开重置表单
        this.updateModalExist ? this.resetUpdate() : this.updateModalExist = true
        this.openUpdateDialog()
      },
      handleAppend (node, data) {
        this.dataC = {
          // pid: data ? data.id : this.colleges[0].pid,
          pid: -1,
          name: '',
          short_name_cn: '',
          name_en: '',
          make_part: true,
          short_name_en: '',
          website: '',
          remark: '',
          org_ids: '',
          order_by: this.colleges.length + 1,
          is_leaf: true,
          tags: []
        }
        this.dataD = {
          pid: -1,
          name: '',
          short_name_cn: '',
          name_en: '',
          short_name_en: '',
          org_ids: [],
          website: '',
          remark: '',
          make_part: false,
          order_by: this.colleges.length + 1,
          is_leaf: true,
          tags: []
        }
        this.createModalExist ? (this.resetCreate() && this.resetCreate2()) : this.createModalExist = true
        this.openCreateDialog()
      },
      handleDelete (data) {
        MessageBox.confirm(data.org_ids ? '将删除当前院系所有数据，但不影响相关基础院系数据，是否确认删除？' : '将删除当前院系所有相关数据，是否确认删除？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.closeUpdateDialog()
          new Promise((resolve, reject) => {
            this.delete({resolve, reject, payload: data})
          }).then((data) => {
            if (this.collegeDiffer === 1) {
              var id = data.id
              var h = this.colleges.filter(item => {
                return item.id !== id && item.org_ids === ''
              })
              this.collegeGroup = h
            } else {
              var orgs = data.is_count_org.split(',').map(obj => {
                return obj - 0
              })
              this.colleges.forEach(item => {
                let index = orgs.indexOf(item.id)
                if (index > -1) {
                  item.make_part = true
                } else {
                  item.make_part = false
                }
              })
            }
            this.addSaveLoading = false
            this.closeCreateDialog()
            this.closeCreateDialog2()
          }).catch(() => {
            this.addSaveLoading = false
          })
        }).catch(() => {
          Message({
            type: 'info',
            message: this.$t('element.cancel')
          })
        })
      },
      openCreateDialog () {
        this.createVisible = true
      },
      closeCreateDialog () {
        this.createVisible = false
      },
      closeCreateDialog2 () {
        this.$refs.createForm2.resetFields()
        this.createVisible = false
        this.filterCollege = ''
      },
      openUpdateDialog () {
        this.updateVisible = true
      },
      closeUpdateDialog () {
        this.updateVisible = false
        this.filterCollege = ''
      },
      handleClose () {
        this.createVisible = false
        this.$refs.createForm2.resetFields()
        this.filterCollege = ''
      },
      change (val) {
        var name = this.BasicColleges.filter(item => {
          return val.findIndex(child => child === item.id) > -1
        })
        this.dataD.name = name.map(item => {
          return item.short_name_cn
        }).join('+')
        var short = name.map(obj => {
          return obj.short_name_cn[0]
        }).join('')
        this.dataD.short_name_cn = short
      }
    },
    computed: {
      ...mapGetters('college', ['colleges', 'tags', 'collegeName', 'BasicColleges']),
      listHeight () {
        if (this.searchTags.length === 0) {
          return 'calc(100% - 80px)'
        } else {
          return 'calc(100% - 130px)'
        }
      },
      collegeNames () {
        let a = []
        a = this.collegeName.map(item => {
          return {id: item.id + '', name: item.name}
        })[0]
        return a
      },
      collegeNames2 () {
        let a = []
        a = this.collegeName.map(item => {
          return {id: item.id + '', name: item.name}
        })[1]
        return a
      },
      dragOptions () {
        return {
          animation: 0,
          group: {
            name: 'description',
            pull: 'clone'
          },
          sort: true,
          disabled: !this.dragStatus,
          ghostClass: 'ghost'
        }
      },
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
        return this.flatten(this.colleges)
      }
    },
    beforeDestroy () {
      this.sortState && this.updateSort()
    },
    filters: {
      supplyName (value) {
        return value || '无'
      },
      supplyUnit (value) {
        return value ? '(' + value + ')' : value
      }
    },
    watch: {
      filterCollege () {
        this.collegeGroup = this.colleges.filter(node => {
          return node.name.toLowerCase().indexOf(this.filterCollege.toLowerCase()) !== -1
        })
      },
      colleges () {
        this.cloneColleges = this.colleges
        this.filterCollegeByTag(this.searchTags)
      },
      BasicColleges () {
        this.collegeGroup = this.BasicColleges
      },
      filterText () {
        this.filterCollegeByTag(this.searchTags)
      },
      filterTag () {
        if (this.filterTag) {
          this.tagShowStatus = this.tags.map(node => {
            return node.name.toLowerCase().indexOf(this.filterTag.toLowerCase()) !== -1
          })
        } else {
          this.tagShowStatus = this.tags.map(node => {
            return true
          })
        }
      }
    }
  }
</script>

<style scoped >
  button{
    cursor: pointer;
  }
  .Dialog{
    padding:  0 10px;
  }
  .header-line{
    margin-left: 10px;
    width: 5px;
    height:20px;
    background: #1EBBA6;
  }
  .college-tag{
    font-size: 14px;
    display: inline-block;
    vertical-align: middle;
    background-color: #9B9B9B;
    color: #FFFFFF;
    border-radius: 2px;
    padding: 2px 20px;
    margin-right: 20px;
    margin-top: 1px;
  }
  .college-tag-active{
    color: #ffffff;
    background-color: #E4AD59;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B);
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B));
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0);
  }
  .udss-dialog-banner {
    overflow: hidden;
    padding: 30px 40px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }
  /*中间样式*/
  ul,li{
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .udss-board-body {
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-size: 14px;
  }
  .udss-dialog-form {
    width: 360px;
    margin: 0 auto -15px;
  }
  .udss-board-toolbox {
    overflow: hidden;
  }
  .search-input {
    margin-right: 30px;
    border-radius: 4px;
    width: 350px;
    height: 35px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 48px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 10px right 18px;
  }
  .college-list-line {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 100%;
    height: 1px;
    background-color: #EFF3F6;
  }
  .college-list-container {
    /*height: calc(100% - 80px);*/
    overflow: hidden;
    overflow-y: scroll;
  }
  .college-list {
    font-size: 14px;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 10px;
    font-weight: bold;
    color: #4A4A4A;
  }
  .active-tr {
    background-color: #F3F5F7;
  }
  .college-icon-jichu {
    display: inline-block;
    width: 20px;
    height: 16px;
    vertical-align: middle;
    background: url('../assets/img/jichu02.svg') no-repeat;
    background-size: 20px auto;
  }
  .active-tr .college-icon-jichu {
    background: url('../assets/img/jichu01.svg') no-repeat;
  }
  .college-icon-zuhe {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    background: url('../assets/img/zuhe02.svg') no-repeat;
    background-size: 20px auto;
  }
  .active-tr .college-icon-zuhe {
    background: url('../assets/img/zuhe01.svg') no-repeat;
  }
  .college-icon-edit {
    vertical-align: middle;
    display: inline-block;
    width: 20px;
    height: 20px;
    background: url('../assets/img/btn-edit.svg') no-repeat;
    background-size: 20px auto;
    cursor: pointer;
  }
  .college-icon-add {
    vertical-align: middle;
    display: inline-block;
    cursor: pointer;
    width: 20px;
    height: 20px;
    background: url('../assets/img/btn-add.svg') no-repeat;
    background-size: 20px auto;
  }
  .college-list td {
    padding: 7px 10px;
    border-bottom: solid 1px #E9E9E9;
    border-top: solid 1px #E9E9E9;
  }
  .college-list tr td:nth-child(1) {
    border-left: solid 4px #F8E71C;
    text-align: center;
    width: 80px;
  }
  .college-list tr td:nth-child(4) {
    border-right: solid 1px #DBDBDB;
    text-align: left;
    width: 40px;
  }
  .college-list tr td:nth-child(6) {
    border-right: solid 1px #E9E9E9;
    text-align: left;
    width: 40px;
  }
  .active-tr td:nth-child(1) {
    border-left: solid 4px #1EBBA6 !important;
  }
  .college-list>li{
    border: solid 1px #E9E9E9;
    border-left: solid 4px #F8E71C;
    margin-bottom: 10px;
    overflow: hidden;
  }
  .button-delete {
    padding: 10px 20px;
    border: 0px;
    border-radius: 0px;
    background-color: #9C9C9C;
    float: left;
  }
  .button-footer{
    padding: 10px 20px 20px 20px;
    display: flex;
    flex-flow: row;
    justify-content: flex-end
  }
  .popover-tag-box{
    height: 240px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .popover-tag-box ul{
    margin-top: 10px;
  }
  .popover-tag-box li{
    height: 32px;
    line-height: 32px;
  }
  .input-new-tag{
    width: 100px;
  }
  .input-edit-tag{
    width: 80px;
  }
  .button-tag {
    background-color: #4A90E2;
    border: none;
    border-radius: 3px;
    outline: none;
    color: #ffffff;
    font-size: 14px;
    line-height: 26px;
    position: relative;
    margin: 5px 5px;
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
  .tag-search-box{
    margin-top: 10px;
    min-height: 34px;
    border: dashed 1px #D7D7D7;
    border-radius: 5px;
  }
  .college-tag-button {
    padding: 10px 30px;
    color: #ffffff;
    background-color: #E4AD59 !important;
    background-image: -moz-linear-gradient(top, #EBB747, #DDA46B) !important;
    background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, #EBB747), color-stop(1,#DDA46B)) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#EBB747', endColorstr='#DDA46B', GradientType =0) !important;
  }
</style>
