<template>
  <div id="loadings2">
    <div style="overflow: hidden;">
      <Button
        style="float: right"
        type="info"
        size="small"
        @click="reset">重置密码</Button>
    </div>
    <Form
      class="udss-form"
      :model="user"
      :rules="rules"
      ref="userForm"
      label-width="100px">
      <FormItem label="用户名" prop="username">
        <Input v-model="user.username" size="medium" placeholder="请输入用户名" disabled />
      </FormItem>
      <FormItem label="真实姓名" prop="name">
        <Input v-model="user.name" size="medium" placeholder="请输入真实姓名" />
      </FormItem>
      <FormItem label="密码" prop="password">
        <Input v-model="user.password" size="medium" placeholder="请输入密码" disabled />
      </FormItem>
      <FormItem label="角色" prop="role">
        <Select v-model="user.role" placeholder="请选择用户角色" size="medium" class="role-select" value-key="id" @change="roleChange" disabled>
          <Option
            v-for="option in roles"
            :key="option.id"
            :label="option.role_name"
            :value="option"></Option>
        </Select>
      </FormItem>
      <FormItem label="部门" prop="departments" v-if="user.role.type_id === 2 || user.role.type_id === 3">
        <Select v-model="user.departments" placeholder="请选择归属部门" size="medium" multiple class="role-select" value-key="id" disabled>
          <Option
            v-for="option in depts"
            :key="option.id"
            :label="option.name"
            :value="option"></Option>
        </Select>
      </FormItem>
      <FormItem label="院系" prop="org" v-if="user.role.type_id === 4">
        <Select v-model="user.org" placeholder="请选择院系" size="medium" multiple class="role-select" value-key="id" disabled>
          <Option
            v-for="option in colleges"
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
          :loading="editSaveLoading"
          @click="save">保存</Button>
        <Button
          size="small"
          @click="back">返回</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Button, Input, Form, FormItem, Select, Option, RadioGroup, Radio, MessageBox } from 'element-ui'
  import { TogglePage, ObjInstance } from '@/mixins'
  export default {
    name: 'EditUser',
    mixins: [ TogglePage, ObjInstance ],
    components: {
      Button, Input, Form, FormItem, Select, Option, RadioGroup, Radio, MessageBox
    },
    data () {
      return {
        user: {
          role: {type_id: ''}
        },
        showForm: false,
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
        editSaveLoading: false
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    methods: {
      ...mapActions('user', ['update', 'resetPass']),
      init () {
        this.user = this.clone(this.currentUser)
      },
      roleChange () {
        this.user.departments = []
      },
      save () {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            let payload = this.user
            payload.role_id = this.user.role.id
            if (payload.role.type_id === 4) {
              payload.dept_id = this.user.org.map(node => node.id)
            } else {
              payload.dept_id = this.user.departments.map(node => node.id)
            }
            new Promise((resolve, reject) => {
              this.editSaveLoading = true
              this.update({resolve, reject, payload})
            }).then(() => {
              this.editSaveLoading = false
            }).catch(() => {
              this.editSaveLoading = false
            })
          }
          return valid
        })
      },
      reset () {
        MessageBox.confirm(
          '确认重置密码?',
          '提示',
          {
            type: 'warning'
          }
        ).then(() => {
          this.resetPass(this.currentUser.id)
        }).catch(() => {
        })
      },
      back () {
        this.togglePage('UserList')
      }
    },
    computed: {
      ...mapGetters('user', ['currentUser', 'colleges', 'realDept']),
      ...mapGetters('config', ['roles']),
      ...mapGetters('dept', ['depts'])
    },
    watch: {
      currentUser () {
        this.init()
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
