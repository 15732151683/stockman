<template>
  <Form
    class="udss-form"
    :model="user"
    :rules="rules"
    ref="userForm"
    status-icon
    label-width="100px">
    <FormItem label="用户名"  prop="username" show-message>
      <Input v-model="user.username" size="medium" placeholder="4-32位数字/字母/下划线" /> <span >{{rules.username.validator}}</span>
    </FormItem>
    <FormItem label="真实姓名"  prop="name">
      <Input v-model="user.name" size="medium" placeholder="请输入真实姓名" />
    </FormItem>
    <FormItem label="密码"  prop="password">
      <Input v-model="user.password" size="medium" placeholder="请输入密码" :disabled="true" />
    </FormItem>
    <FormItem label="角色"  prop="role">
      <Select v-model="user.role" placeholder="请选择用户角色" size="medium" class="role-select" value-key="id" @change="roleChange">
        <Option
          v-for="option in roles"
          :key="option.id"
          :label="option.role_name"
          :value="option"></Option>
      </Select>
    </FormItem>
    <FormItem label="部门" prop="departments" v-if="user.role.type_id === 2 || user.role.type_id === 3">
      <Select v-model="user.departments" placeholder="请选择归属部门（可多选）" size="medium" multiple class="role-select" value-key="id">
        <Option
          v-for="option in selectDept"
          :key="option.id"
          :label="option.name"
          :value="option"></Option>
      </Select>
    </FormItem>
    <FormItem label="院系" prop="org" v-if="user.role.type_id === 4">
      <Select v-model="user.org" placeholder="请选择院系（可多选）" size="medium" multiple class="role-select" value-key="id">
        <Option
          v-for="option in cloneColleges"
          :key="option.id"
          :label="option.name"
          :value="option"></Option>
      </Select>
    </FormItem>
    <FormItem label="电子邮箱" prop="email">
      <Input type="email" v-model="user.email" size="medium" placeholder="请输入电子邮箱" />
    </FormItem>
    <FormItem label="备注" prop="remark">
      <Input type="textarea" v-model="user.remark" size="medium" placeholder="备注信息" />
    </FormItem>
    <FormItem class="el-form-item_button">
      <Button
        type="primary"
        size="small"
        :loading="addSaveLoading"
        @click="submitCreate">创建</Button>
      <Button
        type="info"
        size="small"
        @click="reset">重置</Button>
      <Button
        size="small"
        @click="back">返回</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Button, Input, Form, FormItem, Select, Option, RadioGroup, Radio } from 'element-ui'
  import { TogglePage } from '@/mixins'

  export default {
    name: 'AddUser',
    mixins: [ TogglePage ],
    components: {
      Button, Input, Form, FormItem, Select, Option, RadioGroup, Radio
    },
    data () {
      return {
        user: {
          username: '',
          name: '',
          password: '123456',
          role: '',
          departments: [],
          org: [],
          email: ''
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 4, max: 32, message: '长度在 4 到 32 个字符', trigger: 'blur' },
            {
              validator (rule, value, callback) {
                /^\w+$/.test(value)
                  ? callback()
                  : callback(new Error('请输入数字/字母/下划线'))
              },
              trigger: 'blur'
            }
          ],
          name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          role: [
            { required: true, message: '请选择用户角色', trigger: 'change' }
          ],
          departments: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          org: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          email: [
            { required: true, type: 'email', message: '请输入电子邮箱', trigger: 'blur' }
          ],
          remark: [
            { required: false, message: '请输入备注信息', trigger: 'blur' }
          ]
        },
        addSaveLoading: false,
        selectDept: []
      }
    },
    mounted () {
      if (this.roles && this.roles.length === 1) {
        this.user.role = this.roles[0]
        this.selectDept = this.depts
        if (this.selectDept && this.selectDept.length === 1) {
          this.user.departments = [this.selectDept[0]]
        }
      }
    },
    methods: {
      ...mapActions('user', ['create']),
      roleChange () {
        this.user.departments = []
        if (this.user.role.type_id === 2) {
          this.selectDept = this.realDept
        } else {
          this.selectDept = this.depts
        }
      },
      submitCreate () {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            let payload = this.user
            payload.role_id = this.user.role.id
            if (payload.role.type_id === 4) {
              payload.dept_id = this.user.org.map(node => node.id)
            } else {
              payload.dept_id = this.user.departments.map(node => node.id)
            }
            if (payload.remark === undefined) {
              payload.remark = ''
            }
            new Promise((resolve, reject) => {
              this.addSaveLoading = true
              this.create({
                payload,
                resolve,
                reject
              })
            }).then(() => {
              this.addSaveLoading = false
              this.togglePage('UserList')
            }).catch(() => {
              this.addSaveLoading = false
            })
          }
          return valid
        })
      },
      reset () {
        this.$refs.userForm.resetFields()
      },
      back () {
        this.togglePage('UserList')
      }
    },
    computed: {
      ...mapGetters('config', ['roles']),
      ...mapGetters('dept', ['depts']),
      ...mapGetters('user', ['colleges', 'realDept']),
      cloneColleges () {
        return this.colleges
      }
    }
  }
</script>

<style scoped>
  .udss-form {
    margin-top: 30px;
    width: 460px;
  }
  .role-select {
    width: 100%;
  }
  .el-form-item_button{
    display: flex;
    flex-flow: row;
    justify-content: flex-end;
  }
</style>
