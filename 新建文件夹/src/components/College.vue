<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="downButton">
    <template slot="header"></template>
    <template slot="main">
      <div class="udss-board-body">
        <div class="udss-board-toolbox">
          <input
            class="search-input"
            placeholder="输入校名关键字"
            v-model="filterText" />
          <LabelFilter style="float: left;margin-left: 10px" :show="show" @selected="selectedByTypeB" :title="'学校类型'" :listA="typeB"></LabelFilter>
          <LabelFilter style="float: left;margin-left: 10px" :show="show" @selected="selectedByTypeA" :title="'评价类型'" :listA="typeA"></LabelFilter>
          <LabelManage style="float: right;margin-right: 10px" :title="'学科管理'" :dragStatus="true" :list="typeB" @add="addSubject" @delete="deleteSubject" @edit="editSubject" @change="changeOrder" @close="handleLabelOrder" v-if="!onlyRead">
            <template slot="button">
              <Button
                type="primary"
                size="mini"
                style="float: none; border-radius: 2px;"
                class="button-add college-tag-button"
                v-if="!onlyRead">学校类型管理</Button>
            </template>
          </LabelManage>
          <LabelManage :title="'标签管理'" :list="tags" @add="confirmAddTag" @delete="confirmDeleteTag" @edit="confirmEditTag"  v-if="!onlyRead">
            <template slot="button">
              <!--<Button-->
                <!--type="primary"-->
                <!--size="mini"-->
                <!--style="float: none; border-radius: 2px;"-->
                <!--class="button-add college-tag-button">标签管理</Button>-->
            </template>
          </LabelManage>
          <Button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            style="float: right;margin-right: 10px; border-radius: 2px;"
            class="button-add"
            v-if="!onlyRead"
            @click="handleAppend">新建学校</Button>
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
            <tr class="active-tr" v-for="(item, index) in cloneColleges" :key="index">
              <td width="140" :class="['collegeList' + item.typeA_id]" >
                <i :class="['college-icon-jichu' +  item.typeA_id]"></i>
              </td>
              <td width="150" >{{item.short_name_cn}}</td>
              <td width="250">{{item.name}}</td>
              <td width="150" >{{item.typeB.name}}</td>
              <td width="180">{{item.typeA.name}}</td>
              <td>
                <i class="college-icon-edit" :title="$t('element.edit')" @click.stop="handleUpdate(item)"></i>
              </td>
              <!--<td>-->
                <!--<span-->
                  <!--@click="searchCollegeByTag(tag)"-->
                  <!--v-for="tag in item.tags"-->
                  <!--:key="tag.id"-->
                  <!--:class="['college-tag', {'college-tag-active': item.make_part}]">-->
                    <!--{{tag.name}}-->
                <!--</span>-->
              <!--</td>-->
              <!--<td>-->
                <!--<Popover-->
                  <!--v-if="!onlyRead"-->
                  <!--placement="right"-->
                  <!--width="160"-->
                  <!--@show="changeCollegeTag(item, index)"-->
                  <!--@hide="confirmBindTag"-->
                  <!--trigger="click">-->
                  <!--<Input-->
                    <!--placeholder="标签搜索"-->
                    <!--size="small"-->
                    <!--suffix-icon="el-icon-search"-->
                    <!--v-model="filterTag" />-->
                  <!--<div class="popover-tag-box">-->
                    <!--<ul>-->
                      <!--<li v-show="filterTag.length === 0"><Checkbox :indeterminate="isIndeterminate" v-model="checkAllTag" @change="handleCheckAllTag">全选</Checkbox></li>-->
                      <!--<CheckboxGroup v-model="checkedTags" @change="handleTagChange">-->
                        <!--<li v-show="tagShowStatus.length ===0 ? true : tagShowStatus[idx]" v-for="(tag, idx) in tags" :key="tag.id"><Checkbox :label="tag">{{tag.name}}</Checkbox></li>-->
                      <!--</CheckboxGroup>-->
                    <!--</ul>-->
                  <!--</div>-->
                  <!--<div slot="reference" style="display: inline-block; outline: none;"><i class="college-icon-add"></i></div>-->
                <!--</Popover>-->
              <!--</td>-->
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
        <div class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="updateForm"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem label="学校全称" prop="name">
              <Input clearable v-model="dataC.name" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem label="学校简称" prop="short_name_cn">
              <Input clearable v-model="dataC.short_name_cn" type="text" :disabled="onlyRead"/>
            </FormItem>
            <!--<FormItem label="学校英文全称" prop="name_en">-->
              <!--<Input clearable v-model="dataC.name_en" type="text" :disabled="onlyRead"/>-->
            <!--</FormItem>-->
            <!--<FormItem label="学校英文简称" prop="short_name_en">-->
              <!--<Input clearable v-model="dataC.short_name_en" type="text" :disabled="onlyRead"/>-->
            </FormItem>
            <FormItem label="评价类型" prop="typeA_id">
              <!--<Input v-model="dataC.typeA" type="text" />-->
              <Select v-model="dataC.typeA_id" placeholder="请选择" style="width: 100%">
                <Option
                  v-for="item in typeA"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="学校类型" prop="typeB_id">
              <Select v-model="dataC.typeB_id" placeholder="请选择" style="width: 100%">
                <Option
                  v-for="item in typeB"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('college.website')" prop="website">
              <Input clearable v-model="dataC.website" type="text" :disabled="onlyRead"/>
            </FormItem>
            <FormItem :label="$t('college.remark')" prop="remark">
              <Input clearable v-model="dataC.remark" type="textarea" :disabled="onlyRead"/>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button v-if="!onlyRead"
                  type="primary"
                  size="small"
                  class="button-delete"
                  @click="handleDelete(dataC)">
            {{$t('element.delete')}}
          </Button>
          <Button
            v-if="!onlyRead"
            type="primary"
            size="small"
            class="button-confirm"
            :disabled="!dataC.name"
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
        <div class="udss-dialog-banner">
          <Form
            :model="dataC"
            :rules="rules"
            ref="createForm"
            label-width="110px"
            class="udss-dialog-form">
            <FormItem label="学校全称" prop="name">
              <Input clearable v-model="dataC.name" type="text" />
            </FormItem>
            <FormItem label="学校简称" prop="short_name_cn">
              <Input clearable v-model="dataC.short_name_cn" type="text" />
            </FormItem>
            <!--<FormItem label="学校英文全称" prop="name_en">-->
              <!--<Input clearable v-model="dataC.name_en" type="text" />-->
            <!--</FormItem>-->
            <!--<FormItem label="学校英文简称" prop="short_name_en">-->
              <!--<Input v-model="dataC.short_name_en" type="text" />-->
            <!--</FormItem>-->
            <FormItem label="评价类型" prop="typeA_id">
              <!--<Input v-model="dataC.typeA" type="text" />-->
              <Select v-model="dataC.typeA_id" placeholder="请选择" style="width: 100%">
                <Option
                  v-for="item in typeA"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
            </FormItem>
            <FormItem label="学校类型" prop="typeB_id">
              <Select v-model="dataC.typeB_id" placeholder="请选择" style="width: 100%">
                <Option
                  v-for="item in typeB"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </Option>
              </Select>
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
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, Popover, CheckboxGroup, Checkbox, Tag } from 'element-ui'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import { Container } from './widgets'
  import LabelManage from './partial/college/LabelManage.vue'
  import LabelFilter from './partial/college/LabelFilter.vue'
  import draggable from 'vuedraggable'
  export default {
    name: 'ManageTarget',
    components: {
      Container, Input, Button, Select, Option, Tree, Dialog, Form, FormItem, draggable, Popover, CheckboxGroup, Checkbox, Tag, LabelManage, LabelFilter
    },
    mixins: [ TogglePage, ObjInstance, StandTree ],
    data () {
      return {
        show: false,
        moda: true,
        title: '',
        module: '院系',
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        filterText: '',
        updateVisible: false,     // 优化配置模态框
        createVisible: false,
        createModalExist: false,
        updateModalExist: false,
        dataC: {},
        memory: {},
        rules: {
          name: [
            { required: true, message: this.$t('college.messageA'), trigger: 'change' }
          ],
          short_name_cn: [
            { required: true, message: this.$t('college.messageB'), trigger: 'change' }
          ],
          typeA_id: [
            { required: true, message: '请选择评价', trigger: 'change' }
          ],
          typeB_id: [
            { required: true, message: '请选择主干学科', trigger: 'change' }
          ]
        },
        filterTag: '',
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
        addSaveLoading: false,
        editSaveLoading: false,
        shortName: [],
        onlyRead: false,
        downButton: [],
        newCloneColleges: [],
        conditionB: [],
        conditionA: []
      }
    },
    created () {
      this.onlyRead = !this.$route.meta.permissionList.includes('w')
      this.getCollege()
      this.getTags()
      this.getTypeA()
      this.getTypeB()
    },
    mounted () {
      // Loading.addInterceptors(document.getElementById('loadings'))
      this.$nextTick(function () {
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
      ...mapMutations('college', ['getTarget', 'changeCollegeOrder', 'changeLabelOrder']),
      ...mapActions('college', ['getCollege', 'create', 'delete', 'collegeAddTag', 'collegeSort', 'getTags', 'createTag', 'editTag', 'deleteTag', 'updates', 'getTypeA', 'getTypeB', 'createTypeB', 'editTypeB', 'deleteTypeB', 'changeTypeB']),
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
      // 标签管理
      confirmAddTag (data) {
        this.createTag(data)
      },
      confirmEditTag (data) {
        this.editTag(data)
      },
      confirmDeleteTag (data) {
        this.deleteTag(data)
      },
      // 管理学科标签
      addSubject (data) {
        this.createTypeB(data)
      },
      editSubject (data) {
        this.editTypeB(data)
      },
      deleteSubject (data) {
        this.deleteTypeB(data)
      },
      changeOrder (args) {
        this.changeLabelOrder(args)
      },
      handleLabelOrder () {
        let payload = this.typeB.map(node => {
          return {
            id: node.id,
            order_no: node.orderNo
          }
        })
        this.changeTypeB(JSON.stringify(payload))
      },
      // 拖拽
      onEnd (options) {
        let prev = options.oldIndex
        let next = options.newIndex
        let arg = {prev: prev, next: next}
        this.sortState = true
        this.changeCollegeOrder(arg)
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
      resetCreate () {
        this.$refs.createForm.resetFields()
      },
      resetUpdate () {
        this.dataC = this.clone(this.memory)
        // this.$refs.updateForm.resetFields()
      },
      confirmCreate () {
        this.$refs.createForm.validate(valid => {
          if (valid) {
            new Promise((resolve, reject) => {
              this.addSaveLoading = true
              console.log(this.dataC, 'dataC')
              this.dataC.typeA = this.typeA.find(type => type.id === this.dataC.typeA_id)
              this.dataC.typeB = this.typeB.find(type => type.id === this.dataC.typeB_id)
              this.create({resolve, reject, payload: this.clone(this.dataC)})
            }).then((data) => {
              this.addSaveLoading = false
              this.closeCreateDialog()
            }).catch(() => {
              this.addSaveLoading = false
            })
          }
          return valid
        })
      },
      confirmUpdate () {
        this.$refs.updateForm.validate(valid => {
          if (valid) {
            new Promise((resolve, reject) => {
              this.editSaveLoading = true
              this.dataC.typeA = this.typeA.find(type => type.id === this.dataC.typeA_id)
              this.dataC.typeB = this.typeB.find(type => type.id === this.dataC.typeB_id)
              this.updates({resolve, reject, payload: this.clone(this.dataC)})
            }).then(() => {
              this.editSaveLoading = false
              this.closeUpdateDialog()
            }).catch(() => {
              this.editSaveLoading = false
            })
          }
          return valid
        })
      },
      handleUpdate (data) {
        this.memory = data
        this.dataC = this.clone(data)
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
          order_by: this.colleges.length + 1,
          is_leaf: true,
          typeA: '',
          typeA_id: '',
          typeB: '',
          typeB_id: '',
          tags: []
        }
        this.createModalExist ? this.resetCreate() : this.createModalExist = true
        this.openCreateDialog()
      },
      handleDelete (data) {
        MessageBox.confirm('将删除当前学校所有相关数据，是否确认删除？', this.$t('element.warming'), {
          type: 'warning'
        }).then(() => {
          this.closeUpdateDialog()
          new Promise((resolve, reject) => {
            this.delete({resolve, reject, payload: data})
          }).then(() => {
            this.addSaveLoading = false
            this.closeCreateDialog()
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
      openUpdateDialog () {
        this.updateVisible = true
      },
      closeUpdateDialog () {
        this.updateVisible = false
      },
      handleClose () {
        this.createVisible = false
      },
      // 标签筛选
      seletByTag (val) {
        var filter = this.colleges.filter(node => node.name.toLowerCase().indexOf(this.filterText.toLowerCase()) > -1)
        var h = []
        if (this.conditionA && this.conditionA.length > 0) {
          h = filter.filter(node => this.conditionA.findIndex(child => node.typeA_id === child) > -1)
        } else {
          h = filter
        }
        var x = []
        if (this.conditionB && this.conditionB.length > 0) {
          x = h.filter(node => this.conditionB.findIndex(child => node.typeB_id === child) > -1)
        } else {
          x = h
        }
        if (this.filterText || this.conditionB.length > 0 || this.conditionA.length > 0) {
          this.dragStatus = false
        } else {
          this.dragStatus = true
        }
        this.cloneColleges = x
      },
      selectedByTypeA (val1) {
        this.conditionA = val1
        this.seletByTag()
      },
      selectedByTypeB (val1) {
        this.conditionB = val1
        this.seletByTag()
      }
    },
    computed: {
      ...mapGetters('college', ['colleges', 'tags', 'typeA', 'typeB']),
      listHeight () {
        if (this.searchTags.length === 0) {
          return 'calc(100% - 80px)'
        } else {
          return 'calc(100% - 130px)'
        }
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
      colleges () {
        this.cloneColleges = this.colleges
        this.filterCollegeByTag(this.searchTags)
      },
      filterText () {
        this.seletByTag()
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
  ul{
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
    /*display: flex;*/
    /*flex-flow: row;*/
    /*justify-content: space-around;*/
    /*align-items: center;*/
    overflow: hidden;
  }
  .search-input {
    float: left;
    margin-right: 30px;
    border-radius: 4px;
    width: 270px;
    height: 35px;
    padding: 0 10px;
    border: solid 1px #D7D7D7;
    outline: none;
    line-height: 48px;
    text-indent: 10px;
    background: url('../assets/img/search.png') no-repeat;
    background-position: top 10px right 18px;
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #C0C4CC;
    }
  ::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #C0C4CC;
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
  .college-icon-jichu1,
  .college-icon-jichu2,
  .college-icon-jichu3,
  .college-icon-jichu4{
    display: inline-block;
    width: 20px;
    height: 16px;
    vertical-align: middle;
    /*background: url('../assets/img/jichu02.svg') no-repeat;*/
    background-size: 20px auto;
  }
  .active-tr{
    background: #F2F4F6;
  }
  .active-tr .college-icon-jichu1 {
    background: url('../assets/img/jichu01.svg') no-repeat;
  }
  .active-tr .college-icon-jichu2 {
    background: url('../assets/img/jichu02.svg') no-repeat;
  }
  .active-tr .college-icon-jichu3 {
    background: url('../assets/img/jichu03.svg') no-repeat;
  }
  .active-tr .college-icon-jichu4 {
    background: url('../assets/img/jichu04.svg') no-repeat;
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
    /*border-left: solid 4px #F8E71C;*/
    text-align: center;
    /*width: 80px;*/
  }
  .collegeList1 {
    border-left: solid 4px #1EBBA6;
  }
  .collegeList2 {
    border-left: solid 4px #F39C12;
  }
  .collegeList3 {
    border-left: solid 4px #3090E9;
  }
  .collegeList4 {
    border-left: solid 4px #EC7063;
  }
  .college-list tr td:nth-child(6) {
    border-right: solid 1px #DBDBDB;
    text-align: left;
    /*width: 40px;*/
  }
  .college-list tr td:nth-child(8) {
    border-right: solid 1px #E9E9E9;
    text-align: left;
    width: 40px;
  }
  .active-tr td:nth-child(1) {
    /*border-left: solid 4px #1EBBA6 !important;*/
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
