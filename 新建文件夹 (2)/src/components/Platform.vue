<template>
  <div id='apps'>
    <div class='app-container'>
      <!-- aside begin -->
      <div class='transition container-aside' :style="{width: asideWidth + 'px'}">
        <div class='aside-header' style="margin-top: 15px; margin-bottom: 15px">
          <div class='logo-bar'>
            <img class="logo-bar-img"  :src="logoUrl"/>
            <span class="logo-college" style="">{{udssInfo.chinese_name}}</span>
          </div>
        </div>
        <!--&lt;!&ndash; -->
        <div class="aside-menu" v-if="menuData.length > 0">
          <Menu
            :default-active="arr"
            class='el-menu-vertical'
            :router='true'>
            <template v-for="route in menuData">
              <template v-if="route.icon === 'icon-home'">
                <MenuItem
                  class="header-title"
                  :index="route.path">
                  <i :class="['icon', route.icon]"></i>&nbsp;
                  <span>{{route.title}}</span>
                </MenuItem>
              </template>
              <template v-else-if="route.icon === 'icon-setting' || route.icon === 'icon-submit'">
                <div class="divide-space"></div>
                <Submenu :index="route.path">
                  <template slot='title'>
                    <i class="icon" :class="route.icon" style="font-size: 1.2em"></i>&nbsp;
                    <span>{{route.title}}</span>
                  </template>
                  <MenuItem
                    v-for='item in route.children'
                    :key='item.path'
                    :index='item.path'>
                    <span class="item-span"></span>{{item.title}}
                  </MenuItem>
                </Submenu>
              </template>
              <template v-else>
                <Submenu :index="route.path">
                  <template slot='title'>
                    <i :class='route.icon' class="icon"></i>&nbsp;
                    <span>{{route.title}}</span>
                  </template>
                  <template v-for="item in route.children">
                    <template v-if="item.children">
                      <Submenu
                        :key="item.path"
                        :index="item.path"
                        class='el-menu-inner'>
                        <template slot='title'>
                          <span><span class="item-span"></span>{{item.title}}</span>
                        </template>
                        <MenuItem
                          v-for='node in item.children'
                          :key='node.path'
                          :index='node.path'>
                          &nbsp;&nbsp;{{node.title}}
                        </MenuItem>
                      </Submenu>
                    </template>
                    <template v-else>
                      <MenuItem :index='item.path' :key="item.path">
                        <span class="item-span"></span>{{item.title}}
                      </MenuItem>
                    </template>
                  </template>
                </Submenu>
              </template>
            </template>
          </Menu>
        </div>
        <div class='aside-header'>
          <img class="aside-logo-img" src="../assets/img/icon_logo.svg" alt="" style="">
        </div>
      </div>

      <!-- inner begin -->
      <div class='transition container-inner'>
        <!-- header begin -->
        <Header class='inner-header' height='80px'>
          <div class='univ-bar'>
            <div class='name-bar'>
              <EditPass style="float: left;margin-left: 15px" :name="user_name "></EditPass>
            </div>
          </div>
          <div class='elastic-bar'>

            <img class="fa" style="" src="../assets/img/fa.svg" @click='toggle' alt="">
          </div>
          <div class='sys-name' v-if="udssInfo.id !== 5">
            高校院系绩效管理系统<br>
            <span>Performance Record and Evaluation System</span>
          </div>
          <div class='sys-name' v-else>
            高校绩效管理系统<br>
            <span>Performance Record and Evaluation System</span>
          </div>
        </Header>
        <!-- main begin -->
        <div class="container-main" id="loading">
          <router-view ref="view" @mounted="syncPath"></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Menu, Submenu, MenuItem, Header, Badge, Select, Option } from 'element-ui'
  import { mapActions } from 'vuex'
  import EditPass from './partial/platform/editPass'
  import loadings from '../components/widgets/loading'
  export default {
    name: 'Platform',
    components: {
      Menu, Submenu, MenuItem, Header, Badge, Select, Option, EditPass
    },
    data () {
      return {
        asideWidth: 220,
        activeNavbar: this.$route.path,
        menuData: [],
        udssInfo: '',
        logoUrl: ''
      }
    },
    computed: {
      arr () {
        return this.$route.path
      },
      user_name () {
        return JSON.parse(window.sessionStorage.getItem('user_name'))
      }
    },
    methods: {
      ...mapActions('task', ['getTaskNode']),
      toggle () {
        this.asideWidth = Math.abs(this.asideWidth - 220)
        this.$refs.view.resize()
      },
      toDashboard () {
        this.$router.push({path: '/dashboard'})
      },
      syncPath () {
        this.activeNavbar = this.$route.path
      }
    },
    created () {
      let arr = JSON.parse(window.sessionStorage.getItem('menuList'))
      this.udssInfo = JSON.parse(window.sessionStorage.getItem('udssInfo'))
      this.logoUrl = '../../static/school/' + this.udssInfo.logo_path
      if (this.udssInfo.has_workflow) {
        this.getTaskNode()
      }
      if (arr) {
        this.menuData = arr
      }
    },
    mounted () {
      this.$nextTick(function () {
        loadings.addInterceptors(document.getElementById('loading'))
      })
    }
  }
</script>

<style scoped>
  #apps {
    height: 100%;
    background-color: #fed;
  }
  .app-container {
    height: 100%;
  }
  .container-aside {
    float: left;
    height: 100%;
    overflow: hidden;
    background-color: #32373d;
  }
  .aside-header {
    margin-top: 20px;
    /*height: 60px;*/
    background-color: #32373d;
    /*text-align: center;*/
  }
  .aside-header .aside-logo-img {
    width: 105px;
    height: 48px;
    margin-left: 20px;
    /*margin-top: 30px;*/
  }
  .aside-menu{
    height: calc(100% - 160px);
    overflow: hidden;
    overflow-y: auto;
  }
  .divide-space {
    height: 30px;
    background-color: #32373d;
  }
  .header-title {
    color: #c5c5c5;
    background-color: #32373d;
    position: relative;
    box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
  }
  .header-title.is-active {
    color: #1ebba6;
    background-color: #272D30;
  }
  .container-inner {
    overflow: hidden;
    height: 100%;
    background-color: #eff3f6;
  }
  .container-main {
    padding: 0;
    height: calc(100% - 80px);
  }
  .inner-header {
    background-color: #1ebba6;
    overflow: hidden;
  }
  .elastic-bar {
    display: inline-block;
    vertical-align: top;
  }
  .sys-name {
    display: inline-block;
    vertical-align: middle;
    line-height: 20px;
    margin-top: 20px;
    color: #FFFFFF;
    font-size: 24px;
    margin-left: 10px;
  }
  .sys-name span {
    font-size: 12px;
  }
  .elastic-bar>i {
    padding: 15px;
    height: 50px;
    line-height: 50px;
    color: #eff3f6;
    font-size: 32px;
    cursor: pointer;
    transition: all 300ms linear;
  }
  .univ-bar {
    /*vertical-align: top;*/
    display: flex;
    flex-flow: column;
    justify-content: center;
    float: right;
    color: #fff;
    height: 80px;
  }
  .univ-bar>div {
    display: table-cell;
    vertical-align: middle;
    /*cursor: pointer;*/
  }
  .logo-bar {
    display: flex;
    flex-flow: row;
    justify-content: flex-start;
    align-items: center;
    /*height: 96px;*/
  }
  /*.logo-bar img {*/
    /*height: 60%;*/
    /*margin-top: 20%;*/
  /*}*/
  .logo-bar .logo-bar-img{
    width: 48px;
    height: 48px
  }
  .logo-college{
    margin-left: 5px;
    font-size:14px;
    color: white
  }
  .name-bar {
    font-size: 14px;
    /*min-width: auto;*/
    padding: 15px;
  }
  .transition {
    transition: all 300ms linear;
  }
  .icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
  .icon-home {
    background: url(../assets/img/udss_03.png) no-repeat;
  }
  .is-active .icon-home {
    background: url(../assets/img/udss_05.png) no-repeat;
  }
  .is-opened .icon-home {
    background: url(../assets/img/udss_05.png) no-repeat;
  }
  .icon-performance {
    background: url(../assets/img/udss_18.png) no-repeat;
  }
  .is-opened .icon-performance {
    background: url(../assets/img/udss_19.png) no-repeat;
  }
  .icon-indicator {
    background: url(../assets/img/udss_26.png) no-repeat;
  }
  .is-opened .icon-indicator {
    background: url(../assets/img/udss_27.png) no-repeat;
  }
  .icon-unit {
    background: url(../assets/img/udss_30.png) no-repeat;
  }
  .is-opened .icon-unit {
    background: url(../assets/img/udss_31.png) no-repeat;
  }
  .icon-custom {
    background: url(../assets/img/udss_43.png) no-repeat;
  }
  .is-opened .icon-custom {
    background: url(../assets/img/udss_44.png) no-repeat;
  }
  .icon-setting {
    background: url(../assets/img/udss_47.png) no-repeat;
  }
  .is-opened .icon-setting {
    background: url(../assets/img/udss_48.png) no-repeat;
  }
  .icon-target {
    background: url(../assets/img/udss_target.png) no-repeat;
  }
  .is-opened .icon-target {
    background: url(../assets/img/udss_target2.png) no-repeat;
  }
  .icon-user {
    background: url(../assets/img/udss_user.png) no-repeat;
  }
  .is-opened .icon-user {
    background: url(../assets/img/udss_user2.png) no-repeat;
  }
  .icon-submit {
    background: url(../assets/img/task.svg) no-repeat;
  }
  .is-opened .icon-submit {
    background: url(../assets/img/task02.svg) no-repeat;
  }
  .fa {
    cursor: pointer;
    margin-top: 25px;
    width: 25px;height: 25px;
    font-size: 16px;
  }
  .item-span {
    display: inline-block;
    width: 14px;
  }
</style>
