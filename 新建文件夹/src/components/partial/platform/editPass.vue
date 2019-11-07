<template>
  <div>
    <Dropdown c trigger="click" @command="handleCommand">
      <span class="pwdForm-drop">
<img class="pwdForm-drop-img" src="../../../assets/img/icon_user.svg" alt="">
        {{name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <DropdownMenu slot="dropdown">
        <DropdownItem command="edit">修改密码</DropdownItem>
        <DropdownItem command="quit">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dialog
      title="修改密码"
      :visible.sync="editDialogVisible"
      width="400px">
      <Form :model="pwdForm" status-icon :rules="pwdRules" ref="pwdForm" label-width="100px" class="pwdForm" style="padding-right: 20px;">
        <FormItem label="原密码" prop="oldPass">
          <Input type="password" v-model="pwdForm.oldPass" auto-complete="off"/>
        </FormItem>
        <FormItem label="新密码" prop="newPass">
          <Input type="password" v-model="pwdForm.newPass" auto-complete="off"/>
        </FormItem>
        <FormItem label="确认密码" prop="checkPass">
          <Input type="password" v-model="pwdForm.checkPass" auto-complete="off"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="updatePwdForm" size="small">提交</Button>
        <Button @click="closePwdDialog" size="small">取消</Button>
      </div>
    </Dialog>
  </div>
</template>

<script>
  import { Dropdown, DropdownMenu, DropdownItem, Dialog, Button, Form, FormItem, Input } from 'element-ui'
  import {mapMutations, mapActions} from 'vuex'
  export default {
    name: 'editPass',
    components: {
      Dropdown, DropdownMenu, DropdownItem, Dialog, Button, Form, FormItem, Input
    },
    props: {
      name: {
        require: true
      }
    },
    data () {
      let checkOldPass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入旧密码'))
        }
        callback()
      }
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.pwdForm.checkPass !== '') {
            this.$refs.pwdForm.validateField('checkPass')
          }
          callback()
        }
      }
      let validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.pwdForm.newPass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        editDialogVisible: false,
        pwdForm: {
          userId: '',
          newPass: '',
          checkPass: '',
          oldPass: ''
        },
        pwdRules: {
          oldPass: [
            { validator: checkOldPass, trigger: 'blur' }
          ],
          newPass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      ...mapMutations('login', ['handleQuit']),
      ...mapActions('login', ['updatePwd']),
      showPwdDialog () {
        this.editDialogVisible = true
        setTimeout(() => this.resetPwdForm(), 50)
      },
      closePwdDialog () {
        this.editDialogVisible = false
      },
      handleCommand (command) {
        if (command === 'quit') {
          this.handleQuit(this.$router)
        } else {
          this.showPwdDialog()
        }
      },
      updatePwdForm () {
        this.$refs.pwdForm.validate((valid) => {
          if (valid) {
            this.updatePwd({payload: this.pwdForm, router: this.$router})
          }
          return valid
        })
      },
      resetPwdForm () {
        this.$refs.pwdForm.resetFields()
      }
    }
  }
</script>

<style scoped>
  .pwdForm {
    padding-top: 20px;
    padding-right: 30px;
  }
  .pwdForm-drop {
    cursor: pointer;
    display: flex;
    flex-flow: row;
    align-items: center;
    color: #FFFFFF;
  }
  .pwdForm-drop-img{
    width: 22px;
    height: 22px;
    margin-right: 5px;
  }
</style>
