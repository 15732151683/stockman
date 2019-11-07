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
              type="primary"
              icon="el-icon-plus"
              size="mini"
              class="button-add"
              style="float: right; margin-top: 6px;"
              @click="handleAppend(null, {'id': activeIndType})">{{$t('manageTarget.addType')}}</Button>
          </div>
          <div style="margin-top: 10px; overflow: hidden"></div>
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
      <!--修改指标页面-->
      <Dialog
        top="20px"
        :width="dialogWidth"
        :visible.sync="updateVisible"
        :close-on-click-modal="false"
        :title="$t('manageTarget.config')">
        <div class="udss-dialog-banner animations">
          <Form
            :model="dataC"
            :rules="rules"
            ref="updateForm"
            label-width="110px">
            <div class="udss-node-parent">
              <Card>
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
                  <!-- <FormItem label="指标选择" v-show="dataC.ind_type_id === 2">
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
                <FormItem label="指标定义" prop="ind_def">
                  <Input type="textarea" v-model="dataC.ind_def" />
                </FormItem>
                <FormItem label="数据来源" prop="ind_source">
                  <Input type="textarea" v-model="dataC.ind_source" />
                </FormItem>
                <FormItem label="填报说明" prop="remark">
                  <Input v-model="dataC.remark" type="textarea" />
                </FormItem>
              </Card>
              <transition name="dialog-transform2">
                <Card style="margin-top: 10px;" v-if="dataC.is_leaf === true">
                  <template>
                    <FormItem label="填报人员" prop="submit_type_id">
                      <RadioGroup v-model="dataC.submit_type_id">
                        <Radio v-for="obj in objects" :key="obj.id" :label="obj.id">{{obj.name}}</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem :label="$t('manageTarget.indType')" prop="ind_type_id">
                      <RadioGroup v-model="dataC.ind_type_id">
                        <Radio v-if="ind.id !== 0" v-for="ind in indType" :key="ind.id" :label="ind.id">{{ind.name}}</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="逻辑校验" prop="check_rule_id">
                      <Select v-model="dataC.check_rule_id" style="width: 100%;">
                        <Option
                          v-for="type in check_rules"
                          :key="type.id"
                          :label="type.name"
                          :value="type.id"></Option>
                      </Select>
                    </FormItem>
                  </template>
                </Card>
              </transition>
            </div>
            <transition name="dialog-transform">
              <div class="udss-node-child" v-show="dataC.is_leaf === true && dataC.ind_type_id === 2">
                <Card>
                  <div class="udss-complex-title">计算公式设置</div>
                  <FormItem label="指标选择" v-show="dataC.ind_type_id === 2">
                    <Autocomplete
                      clearable
                      class="inline-input"
                      style="width: 100%"
                      v-model="currentInd"
                      :fetch-suggestions="querySearch"
                      placeholder="输入指标关键字"
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
                  <FormItem label="计算公式" prop="formula" v-show="dataC.ind_type_id === 2">
                    <Input @change="checkInput(dataC.formula)" v-model="dataC.formula" type="textarea" id="formula2"/>
                    <div class="error-msg">{{errorMsg}}</div>
                  </FormItem>
                  <FormItem label="指标描述" v-show="dataC.ind_type_id === 2 && formulaDetail">
                    <div class="formula-box" v-show="formulaDetail.length > 0">
                      <div v-for="(text, index) in formulaDetail" :key="index">
                        {{text}}
                      </div>
                    </div>
                  </FormItem>
                </Card>
                <Card style="margin-top: 10px;">
                  <div class="udss-complex-title">评分规则设置</div>
                  <FormItem label="评分规则" prop="score_rule_id">
                    <RadioGroup v-model="dataC.score_rule_id">
                      <Radio v-for="rul in score_rules" :key="rul.id" :label="rul.id">{{rul.name}}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-show="dataC.score_rule_id === 1" label="满分规则" prop="rule_type">
                    <RadioGroup v-model="dataC.fscore_type_id">
                      <Radio v-for="typ in score_rule_types" :key="typ.id" :label="typ.id">{{typ.name}}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-show="dataC.score_rule_id === 1 && dataC.fscore_type_id === 2" label="分值设定">
                    <Button size="mini" @click="handleSetScore(dataC.id)">自定义满分设定</Button>
                  </FormItem>
                  <FormItem label="区间设置" v-show="dataC.score_rule_id === 2">
                    <Button size="mini" @click="handleSetRegion(dataC.id)">自定义区间设定</Button>
                    <!--<OriginComp></OriginComp>-->
                  </FormItem>
                </Card>
                <Card style="margin-top: 10px;">
                  <div class="udss-complex-title">指标去重设置</div>
                  <FormItem label="去重规则" prop="dedupe_rule_id">
                    <Select v-model="dataC.dedupe_rule_id" style="width: 100%;">
                      <Option
                        v-for="type in dedupe_rules"
                        :key="type.id"
                        :label="type.name"
                        :value="type.id"></Option>
                    </Select>
                  </FormItem>
                </Card>
              </div>
            </transition>
          </Form>
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
        :width="dialogWidth"
        :close-on-click-modal="false"
        title="新建">
        <div class="udss-dialog-banner animations">
          <Form
            :model="dataC"
            :rules="rules"
            ref="createForm"
            label-width="100px">
            <div class="udss-node-parent">
              <Card>
                <FormItem :label="$t('manageTarget.last')">
                  {{ parentData.name | supplyName }}
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
                </template>
                <FormItem label="指标定义" prop="ind_def">
                  <Input type="textarea" v-model="dataC.ind_def" />
                </FormItem>
                <FormItem label="数据来源" prop="ind_source">
                  <Input type="textarea" v-model="dataC.ind_source" />
                </FormItem>
                <FormItem label="填报说明" prop="remark">
                  <Input v-model="dataC.remark" type="textarea" />
                </FormItem>
              </Card>
              <transition name="dialog-transform2">
                <Card style="margin-top: 10px;" v-if="dataC.is_leaf === true">
                  <template>
                    <FormItem label="填报人员" prop="submit_type_id">
                      <RadioGroup v-model="dataC.submit_type_id">
                        <Radio v-for="obj in objects" :key="obj.id" :label="obj.id">{{obj.name}}</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem :label="$t('manageTarget.indType')" prop="ind_type_id">
                      <RadioGroup v-model="dataC.ind_type_id">
                        <Radio v-if="ind.id !== 0" v-for="ind in indType" :key="ind.id" :label="ind.id">{{ind.name}}</Radio>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="逻辑校验" prop="check_rule_id">
                      <Select v-model="dataC.check_rule_id" style="width: 100%;">
                        <Option
                          v-for="type in check_rules"
                          :key="type.id"
                          :label="type.name"
                          :value="type.id"></Option>
                      </Select>
                    </FormItem>
                  </template>
                </Card>
              </transition>
            </div>
            <transition name="dialog-transform">
              <div class="udss-node-child" v-show="dataC.is_leaf === true && dataC.ind_type_id === 2">
                <Card>
                  <div class="udss-complex-title">计算公式设置</div>
                  <FormItem label="指标选择" v-show="dataC.ind_type_id === 2">
                    <Autocomplete
                      clearable
                      class="inline-input"
                      style="width: 100%"
                      v-model="currentInd"
                      :fetch-suggestions="querySearch"
                      placeholder="输入指标关键字"
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
                  <FormItem label="计算公式" prop="formula" v-show="dataC.ind_type_id === 2">
                    <Input @change="checkInput(dataC.formula)" id="formula" v-model="dataC.formula" type="textarea" />
                    <div class="error-msg">{{errorMsg}}</div>
                  </FormItem>
                  <FormItem label="指标描述" v-show="dataC.ind_type_id === 2 && formulaDetail">
                    <div class="formula-box" v-show="formulaDetail.length > 0">
                      <div v-for="(text, index) in formulaDetail" :key="index">
                        {{text}}<br/>
                      </div>
                    </div>
                  </FormItem>
                </Card>
                <Card style="margin-top: 10px;">
                  <div class="udss-complex-title">评分规则设置</div>
                  <FormItem label="评分规则" prop="score_rule_id">
                    <RadioGroup v-model="dataC.score_rule_id">
                      <Radio v-for="rul in score_rules" :key="rul.id" :label="rul.id">{{rul.name}}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-show="dataC.score_rule_id === 1" label="满分规则" prop="rule_type">
                    <RadioGroup v-model="dataC.fscore_type_id">
                      <Radio v-for="typ in score_rule_types" :key="typ.id" :label="typ.id">{{typ.name}}</Radio>
                    </RadioGroup>
                  </FormItem>
                  <FormItem v-show="dataC.score_rule_id === 1 && dataC.fscore_type_id === 2" label="分值设定">
                    <Button size="mini" @click="handleSetScore">自定义满分设定</Button>
                  </FormItem>
                  <FormItem label="区间设置" v-show="dataC.score_rule_id === 2">
                    <Button size="mini" @click="handleSetRegion">自定义区间设定</Button>
                    <!--<OriginComp></OriginComp>-->
                  </FormItem>
                </Card>
                <Card style="margin-top: 10px;">
                  <div class="udss-complex-title">指标去重设置</div>
                  <FormItem label="去重规则" prop="dedupe_rule_id">
                    <Select v-model="dataC.dedupe_rule_id" style="width: 100%;">
                      <Option
                        v-for="type in dedupe_rules"
                        :key="type.id"
                        :label="type.name"
                        :value="type.id"></Option>
                    </Select>
                  </FormItem>
                </Card>
              </div>
            </transition>
          </Form>
        </div>
        <div slot="footer">
          <!--<Button
            class="button-confirm"
            type="primary"
            size="small"
            style="float: left; background-color: #ce3232;"
            :loading="addSaveLoading"
            @click="confirmCreate">冻结</Button>-->
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
      <!--自定义满分值-->
      <Dialog
        :visible.sync="scoreVisible"
        :close-on-click-modal="false"
        top="200px"
        width="500px"
        title="满分值设定">
        <div class="udss-dialog-banner">
          <ul class="udss-typeB-list">
            <li v-for="lis in typeB" :key="lis.id">
              <span>{{lis.name}}</span>
              <Input class="udss-typeB-input" v-model="lis.value" size="mini" type="number" />
            </li>
          </ul>
        </div>
        <div slot="footer">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            @click="confirmSetScore">{{$t('element.buttonConfirm')}}</Button>
          <Button
            class="button-close"
            type="primary"
            size="small"
            @click="closeSetScore">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
      <!--自定义区间值-->
      <Dialog
        :visible.sync="regionVisible"
        :close-on-click-modal="false"
        top="200px"
        width="600px"
        title="区间设定">
        <div class="udss-dialog-banner">
          <OriginComp :list.sync="scoreRangeLists"></OriginComp>
        </div>
        <div slot="footer">
          <Button
            class="button-confirm"
            type="primary"
            size="small"
            @click="confirmSetRegion">{{$t('element.buttonConfirm')}}</Button>
          <Button
            class="button-close"
            type="primary"
            size="small"
            @click="closeSetRegion">{{$t('element.buttonClose')}}</Button>
        </div>
      </Dialog>
    </template>
  </Container>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Autocomplete, Card } from 'element-ui'
  import { TogglePage, ObjInstance, StandTree } from '@/mixins'
  import { Container } from './widgets'
  import OriginComp from './partial/manageTarget/OriginComp'
  export default {
    name: 'ManageTarget',
    components: {
      Container, OriginComp, Input, Button, Select, Option, Tree, MessageBox, Message, Dialog, Form, FormItem, RadioGroup, Radio, Autocomplete, Card
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
        // inputIndPid: 0,
        addSaveLoading: false,
        editSaveLoading: false,
        objects: [],
        score_rules: [],
        score_rule_types: [],
        dedupe_rules: [],
        check_rules: [],
        scoreVisible: false,
        regionVisible: false,
        dataType: [],
        indType: [],
        unitType: [],
        scoreTypeBLists: [],
        scoreRangeLists: []
      }
    },
    beforeDestroy () {
      this.updateOrder()
    },
    mounted () {
      this.$nextTick(function () {
        // this.inputIndPid = JSON.parse(window.sessionStorage.getItem('udssInfo')).input_ind_pid
        this.getIndParams()
        this.getTypeB()
        // this.getDataType()
        // this.getIndType()
        this.getIndDetail()
        // this.getUnitType()
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
      ...mapActions('config', ['getIndDetail', 'getTypeB']),
      ...mapMutations('target', ['getTarget', 'setDetailStatus']),
      ...mapActions('target', ['getTargets', 'getIndParams', 'create', 'update', 'delete', 'changeOrder', 'getDetailStatus', 'getScoreRange', 'getScoreTypeB']),
      ...mapMutations('config', ['config', 'exportDataA']),
      downCurrentData () {
        this.exportDataA({'name': this.title, 'url': '/v1/ind/exc'})
      },
      downAllData () {
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
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1)
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
      resetCreate () {
        this.currentInd = ''
        this.errorMsg = ''
        this.$refs.createForm.resetFields()
      },
      resetUpdate () {
        this.dataC = this.clone(this.memory)
        this.currentInd = ''
        this.errorMsg = ''
        this.unitId = this.dataC.unit.id
        this.scoreTypeBLists = this.memory.typeB_data ? this.clone(this.memory.typeB_data) : []
        this.scoreRangeLists = this.memory.ind_range ? this.clone(this.memory.ind_range) : []
        // this.$refs.updateForm.resetFields() // 加resetFields容易出bug，报错无法弹出dialog
      },
      confirmCreate () {
        this.dataC.ind_type_id === 1 ? this.errorMsg = '' : this.checkFormula(this.dataC.formula)
        this.$refs.createForm.validate(valid => {
          if (valid && this.errorMsg === '') {
            let data = this.unitType.find(node => node.id === this.unitId)
            this.unitName = data ? data.name : this.$t('manageTarget.unknown')
            this.dataC.unit = {
              'id': this.unitId,
              'name': this.unitName
            }
            this.dataC.formula_ind = this.formulaId.join(',')
            let parentNode = this.fNodes.find(node => node.id === this.dataC.pid)
            let leng = parentNode.children ? parentNode.children.length + 1 : 1
            this.dataC.order_no = leng
            if (this.dataC.is_leaf && this.dataC.ind_type_id === 2 && this.dataC.score_rule_id === 1 && this.dataC.fscore_type_id === 2 && this.scoreTypeBLists.length < 1) {
              Message({
                message: '未设置满分区间值，不能提交！',
                type: 'warning'
              })
            } else if (this.dataC.is_leaf && this.dataC.ind_type_id === 2 && this.dataC.score_rule_id === 2 && this.scoreRangeLists.length < 1) {
              Message({
                message: '未划分区间，不能提交！',
                type: 'warning'
              })
            } else {
              new Promise((resolve, reject) => {
                this.addSaveLoading = true
                let payload = this.clone(this.dataC)
                payload.typeB_data = JSON.stringify(this.scoreTypeBLists)
                payload.ind_range = JSON.stringify(this.scoreRangeLists)
                this.create({resolve, reject, payload: payload})
              }).then(() => {
                this.addSaveLoading = false
                this.closeCreateDialog()
              }).catch(() => {
                this.addSaveLoading = false
              })
            }
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
            this.dataC.formula_ind = this.formulaId.join(',')
            if (this.dataC.is_leaf && this.dataC.ind_type_id === 2 && this.dataC.score_rule_id === 1 && this.dataC.fscore_type_id === 2 && this.scoreTypeBLists.length < 1) {
              Message({
                message: '未设置满分区间值，不能提交！',
                type: 'warning'
              })
            } else if (this.dataC.is_leaf && this.dataC.ind_type_id === 2 && this.dataC.score_rule_id === 2 && this.scoreRangeLists.length < 1) {
              Message({
                message: '未划分区间，不能提交！',
                type: 'warning'
              })
            } else {
              new Promise((resolve, reject) => {
                this.editSaveLoading = true
                let payload = this.clone(this.dataC)
                payload.typeB_data = JSON.stringify(this.scoreTypeBLists)
                payload.ind_range = JSON.stringify(this.scoreRangeLists)
                this.update({resolve, reject, payload: payload})
              }).then(() => {
                this.editSaveLoading = false
                this.formulaId = []
                this.closeUpdateDialog()
              }).catch(() => {
                this.editSaveLoading = false
              })
            }
          }
          return valid
        })
      },
      handleUpdate (node, data) {
        this.memory = data
        this.dataC = this.clone(data)
        this.unitId = this.dataC.unit.id
        if (data.has_detail) {
          this.getDetailStatus(data.id)
        } else {
          this.setDetailStatus(true)
        }
        // 判断满分值是B类
        if (data.is_leaf && data.ind_type_id === 2 && data.score_rule_id === 1 && data.fscore_type_id === 2) {
          new Promise((resolve, reject) => {
            this.getScoreTypeB({resolve, reject, id: data.id})
          }).then((res) => {
            this.scoreTypeBLists = res.map(type => {
              return {
                typeB_id: type.typeB_id,
                score: type.score
              }
            })
            this.memory.typeB_data = this.clone(this.scoreTypeBLists)
          }).catch(() => {
          })
        } else {
          this.memory.typeB_data = []
          this.scoreTypeBLists = []
        }
        // 判断自定义区间设定
        if (data.is_leaf && data.ind_type_id === 2 && data.score_rule_id === 2) {
          new Promise((resolve, reject) => {
            this.getScoreRange({resolve, reject, id: data.id})
          }).then((res) => {
            this.scoreRangeLists = res.map(node => {
              return {
                ind_val: node.ind_val,
                ind_score: node.ind_score
              }
            })
            this.memory.ind_range = this.clone(this.scoreRangeLists)
          }).catch(() => {})
        } else {
          this.memory.ind_range = []
          this.scoreRangeLists = []
        }
        // 首次打开改变标志量，之后打开重置表单
        this.updateModalExist ? this.resetUpdate() : this.updateModalExist = true
        this.openUpdateDialog()
      },
      handleAppend (node, data) {
        this.dataC = {
          pid: data ? data.id : 0,
          name: '',
          ind_def: '',
          ind_source: '',
          remark: '',
          unit: {},
          ind_type_id: 1,
          formula: '',
          formula_ind: '',
          order_no: '',
          is_leaf: true,
          has_detail: false,
          detail_template_id: 0,
          is_calc: true,
          decimals: '',
          submit_type_id: 1,
          score_rule_id: 1,
          fscore_type_id: 1,
          dedupe_rule_id: 0,
          check_rule_id: 0
        }
        this.createModalExist ? this.resetCreate() : this.createModalExist = true
        this.openCreateDialog()
      },
      handleAppendType () {
        this.dataC = {
          pid: 0,
          name: '',
          remark: '',
          unit: {},
          ind_type_id: 1,
          formula: '',
          order_no: 50,
          is_leaf: false,
          is_sys: false,
          decimals: ''
        }
        // this.createModalExist ? this.resetCreate() : this.createModalExist = true
        this.createTypeVisible = true
      },
      handleDelete (node, data) {
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
      },
      // 设置区间
      handleSetRegion () {
        this.regionVisible = true
      },
      // B类满分值
      handleSetScore () {
        if (this.scoreTypeBLists.length > 0) {
          this.typeB.forEach(type => {
            let obj = this.scoreTypeBLists.find(node => node.typeB_id === type.id)
            this.$set(type, 'value', obj ? obj.score : '')
          })
        } else {
          this.typeB.forEach(type => {
            this.$set(type, 'value', '')
          })
        }
        this.scoreVisible = true
      },
      confirmSetRegion () {
        if (this.scoreRangeLists.length < 1) {
          Message({
            message: '未设置区间值，不能保存！',
            type: 'warning'
          })
        } else {
          this.regionVisible = false
        }
      },
      confirmSetScore () {
        let scores = []
        let status = false
        this.typeB.forEach(type => {
          if (type.value) {
            scores.push({typeB_id: type.id, score: type.value * 1})
          } else {
            status = true
          }
        })
        if (status) {
          Message({
            message: '满分值未设置完整，不能提交！',
            type: 'warning'
          })
        } else {
          this.scoreTypeBLists = scores
          this.scoreVisible = false
        }
      },
      closeSetRegion () {
        this.regionVisible = false
      },
      closeSetScore () {
        this.scoreVisible = false
      }
    },
    computed: {
      ...mapGetters('target', ['targets', 'detailStatus', 'indParams', 'scoreRange', 'scoreTypeB']),
      ...mapGetters('config', ['indDetail', 'typeB']),
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
        return this.flatten(this.targets.filter(node => node.id === this.activeIndType)).filter(node => node.is_leaf === true).map(node => {
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
      },
      dialogWidth () {
        if (this.dataC.ind_type_id === 2 && this.dataC.is_leaf) {
          return '1000px'
        } else {
          return '550px'
        }
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
      },
      indParams () {
        this.dataType = this.indParams.dataTypes
        this.indType = this.indParams.indicatorTypes
        this.unitType = this.indParams.unitTypes
        this.objects = this.indParams.codeSubmitOwners
        this.score_rules = this.indParams.codeScoreRules
        this.score_rule_types = this.indParams.codeFscoreRules
        this.check_rules = this.indParams.codeCheckRules
        this.dedupe_rules = this.indParams.codeDedupeRules
        this.dedupe_rules.unshift({id: 0, name: '无'})
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
    width: 450px;
  }
  .udss-node-child {
    margin-left: 470px;
  }
  .udss-complex {
    font-weight: bold;
  }
  .udss-complex-title {
    text-align: center;
    padding: 5px 0;
    font-weight: bold;
    color: #a59f9f;
    font-size: 15px;
    margin-bottom: 20px;
  }
  .udss-typeB-list {
    list-style: none;
  }
  .udss-typeB-list li {
    overflow: hidden;
    padding: 0 10px;
    margin-top: 5px;
    line-height: 30px;
  }
  .udss-typeB-list li:hover{
    background-color: #f3f3f3;
  }
  .udss-typeB-list span {
    float: left;
  }
  .udss-typeB-input {
    width: 100px;
    float: right;
  }
  .udss-is-current {
    color: #409EFF;
  }
  .udss-limit-length {
    width: calc(100% - 30px);
  }
  .formula-box{
    border-radius: 4px;
    line-height: 20px;
    border: solid 1px #DCDFE6;
    padding: 4px 10px;
    white-space: normal;
    word-break: break-word;
  }
  /*dialog-transform*/
  /* 可以设置不同的进入和离开动画 */
  .dialog-transform-enter-active {
    transition: all 1s ease;
  }
  .dialog-transform-leave-active {
    transition: all 1s ease;
  }
  .dialog-transform-enter, .dialog-transform-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }
  .dialog-transform2-enter-active {
    transition: all 1s ease;
  }
  .dialog-transform2-leave-active {
    transition: all 1s ease;
  }
  .dialog-transform2-enter, .dialog-transform2-leave-to {
    transform: translateY(260px);
    opacity: 0;
  }
</style>
