<template>
  <div class="login">
    <div class="login-header">
      <div class="login-container">
        <div class="login-header-blank"></div>
        <img src="../assets/img/login_logo.png" alt="">
      </div>
    </div>
    <div class="login-center">
      <div class="login-container">
        <div class="login-center-left">
          <div class="login-center-blank"></div>
          <img src="../assets/img/login_pic.png" alt="">
        </div>
        <div class="login-center-right">
          <div class="login-center-right-box">
            <div class="container">
              <div class="UDSSTitle">账号登录</div>
              <div class="UDSSLogin">
                <div class="tabBox" v-show="active === 1">
                  <Form size="mini" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
                    <FormItem label="" prop="name">
                      <input type="text" @keyup.enter="handleSubmit" v-model="ruleForm.name" placeholder="用户名" auto-complete="off" />
                    </FormItem>
                    <FormItem label="" prop="password">
                      <input type="password" @keyup.enter="handleSubmit" v-model="ruleForm.password" placeholder="密码" auto-complete="off" />
                    </FormItem>
                    <FormItem>
                      <div style="float: left;"><Checkbox v-model="checked">记住密码</Checkbox></div>
                      <!--<span style="float: right;color: #808185">找回密码</span>-->
                    </FormItem>
                    <FormItem>
                      <Button
                        size="medium"
                        type="primary"
                        style="background: #00BBA6; border: none; outline: none; font-size: 16px; line-height: 20px;"
                        :loading="loginLoading"
                        @click="submitForm('ruleForm')">
                        登录</Button>
                    </FormItem>
                  </Form>
                </div>
                <div class="tabBox" v-show="active === 2">
                  短信登陆
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="login-footer">
      <div class="login-container" style="position: relative;">
        <div class="login-footer-box">
          <div class="login-footer-nav">
            <a href="">网站首页</a>
            <span>|</span>
            <a href="">软科解读</a>
            <span>|</span>
            <a href="">联系我们</a>
            <span>|</span>
            <a href="">加入软科</a>
          </div>
          <div class="login-footer-copy">
            Copyright &copy; 2015-2017上海软科教育信息咨询有限公司 版权所有 沪公网安备31011202001075号 沪ICP备14047616号-6
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { Form, FormItem, Button, Checkbox } from 'element-ui'
  export default {
    name: 'Login',
    components: {
      Form, FormItem, Button, Checkbox
    },
    data () {
      var checkName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('姓名不能为空'))
        }
        callback()
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        }
        callback()
      }
      return {
        active: 1,
        checked: false,
        ruleForm: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            { validator: checkName, trigger: 'change' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        loginLoading: false
      }
    },
    methods: {
      ...mapActions('login', ['checkLogin', 'getLoginCookie']),
      handleSubmit () {
        this.submitForm('ruleForm')
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let payload = {
              username: this.ruleForm.name,
              password: this.ruleForm.password,
              router: this.$router,
              save: this.checked
            }
            new Promise((resolve, reject) => {
              this.loginLoading = true
              this.checkLogin({resolve, reject, payload})
            }).then(() => {
              let routeList = JSON.parse(window.sessionStorage.getItem('routeList'))
              if (!routeList) {
                routeList = []
              }
              routeList.forEach(node => {
                node.component = (resolve) => require(['@/components/' + node.name], resolve)
              })
              let routes = {
                path: '/platform',
                name: 'Platform',
                component: (resolve) => require(['@/components/Platform'], resolve),
                children: routeList
              }
              if (this.$router.options.routes.length <= 2) {
                this.$router.addRoutes([routes])
                this.$router.options.routes.push(routes)
              }
              this.$router.push(routeList[0].path)
              // this.loginLoading = false
            }).catch(() => {
              this.loginLoading = false
            })
          } else {
            return false
          }
        })
      }
    },
    mounted () {
      this.getLoginCookie()
      if (this.loginInfo.length > 0 && this.loginInfo[0] && this.loginInfo[1]) {
        this.ruleForm.name = this.loginInfo[0]
        this.ruleForm.password = this.loginInfo[1]
        this.checked = true
      }
    },
    computed: {
      ...mapGetters('login', ['msg', 'user_id', 'loginInfo'])
    }
  }
</script>

<style scoped>
  .login{
    width: 100%;
    height: 100%;
  }
  .container {
    position: relative;
    background: #EAF5F3;
    width: 320px;
    height: 300px;
    margin-top: 30px;
    text-align: center;
    padding: 0 50px;
  }
  .UDSSTitle{
    width: 200px;
    height: 50px;
    position: absolute;
    left:50%;
    margin-left: -100px;
    top:-25px;
    background: #00A893;
    line-height: 50px;
    border-radius: 7px;
    color: #5AFAE6;
    font-weight: 900;
  }
  .UDSSLogin {
    padding-top: 50px;
  }
  .demo-ruleForm button {
    width: 100%;
  }
  .demo-ruleForm input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    outline: 0;
    border: none;
    display: block;
    width: 100%;
    background-color: transparent;
    line-height: 36px;
    border-bottom: solid 1px #BBD4D1;
    color: #000000;
    font-size: 16px;
    text-align: center;
  }
  .login-header {
    height: 10%;
    width: 100%;
    overflow: hidden;
  }
  .login-header-blank {
    height: 10%;
    width: 100%;
    overflow: hidden;
  }
  .login-header img {
    height: 80%;
    display: block;
    margin-left: 30px;
  }
  .login-center {
    height: 75%;
    overflow: hidden;
    background-image: url('../assets/img/login_bk.png');
    background-size: cover;
    background-position: center center;
  }
  .login-center-left {
    height: 100%;
    float: left;
  }
  .login-center-blank {
    height: 10%;
    width: 100%;
    overflow: hidden;
  }
  .login-center-left img {
    height: 80%;
    display: block;
  }
  .login-center-right {
    float: right;
    width: 420px;
    height: 100%;
    position: relative;
  }
  .login-center-right-box {
    width: 100%;
    height: 330px;
    position: absolute;
    top: 50%;
    margin-top: -165px;
  }
  .login-footer {
    height: 15%;
    overflow: hidden;
  }
  .login-footer-box {
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .login-footer-nav {
    text-align: center;
  }
  .login-footer-nav a {
    display: inline-block;
    color: #737373;
    font-size: 14px;
    text-decoration: none;
  }
  .login-footer-nav span {
    display: inline-block;
    padding-left: 5px;
    padding-right: 5px;
    color: #737373;
    font-size: 14px;
  }
  .login-footer-copy {
    margin-top: 20px;
    text-align: center;
    color: #A0A4A9;
    font-size: 12px;
  }
  .login-container {
    width: 1200px;
    margin: 0 auto;
    height: 100%;
    overflow: hidden;
  }
</style>
