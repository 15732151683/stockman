<template>
  <div id='app'>
      <div class='container'>
        <!-- aside begin -->

        <div class='transition container-aside' :style="{width: asideWidth + 'px'}">
          <h1 class='aside-header'>
            <img style="margin-top: 13px;" src="./assets/img/udss.png">
          </h1>

          <!--&lt;!&ndash; -->
          <el-menu
            :default-active="activeNavbar"
            class='el-menu-vertical'
            :router='true'>
            <el-menu-item
              class="header-title"
              index="/dashboard">
              <i class='icon icon-home'></i>&nbsp;
              <span>DASHBOARD</span>
            </el-menu-item>
            <el-submenu
              v-for='navbar in navbars'
              :key='navbar.index'
              :index='navbar.index'>
              <template slot='title'>
                <i :class='navbar.icon' class="icon"></i>&nbsp;
                <span>{{navbar.title}}</span>
              </template>
              <el-menu-item
                v-for='item in navbar.children'
                :key='item.index'
                :index='item.index'>
                {{item.title}}
              </el-menu-item>
            </el-submenu>
            <div class="divide-space">

            </div>
            <el-submenu
              v-for='navbar in config'
              :key='navbar.index'
              :index='navbar.index'>
              <template slot='title'>
                <i class="icon" :class='navbar.icon' style="font-size: 1.2em"></i>&nbsp;
                <span>{{navbar.title}}</span>
              </template>
              <el-menu-item
                v-for='item in navbar.children'
                :key='item.index'
                :index='item.index'>
                {{item.title}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>

        <!-- inner begin -->
        <div class='transition container-inner'>
          <!-- header begin -->
          <el-header class='inner-header' height='80px'>
            <div class='univ-bar'>
              <div class='inform-bar cursor-forbid' title="You got seven unread messages !">
                <el-badge :value='7' class='item'>
                  <i class='fa fa-bell-o'></i>
                </el-badge>
              </div>
              <div class='logo-bar cursor-forbid'>
                <img src='./assets/img/logo.png'>
              </div>
              <div class='name-bar cursor-forbid'>
                KING ABDULAZIZ UNIVERSITY&nbsp;&nbsp;<span class="fa fa-caret-down"></span>
              </div>
            </div>
            <div class='elastic-bar'>
              <i class='fa fa-align-justify' @click='toggle'></i>
            </div>
          </el-header>
          <!-- main begin -->
          <div class="container-main">
            <router-view ref="view" @mounted="syncPath"></router-view>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        asideWidth: 220,
        activeNavbar: this.$route.path,
        navbars: [
          {
            index: '1',
            title: 'PERFORMANCE',
            icon: 'icon-performance',
            children: [
              {
                index: '/output',
                title: 'Output'
              },
              {
                index: '/outIn',
                title: 'Output/Input'
              },
              {
                index: '/perCapita',
                title: 'Per-Capita'
              },
              {
                index: '/completion',
                title: 'Completion'
              },
              {
                index: '/wait?t=1',
                title: 'Increase'
              }
            ]
          },
          {
            index: '2',
            title: 'INDICATOR',
            icon: 'icon-indicator',
            children: [
              {
                index: '/wait?t=2',
                title: 'Indicator'
              }
            ]
          },
          {
            index: '3',
            title: 'ACADEMIC UNIT',
            icon: 'icon-unit',
            children: [
              {
                index: '/wait?t=3',
                title: 'Academic Unit'
              }
            ]
          }
        ],
        config: [
          {
            index: '4',
            title: 'CUSTOMISATION',
            icon: 'icon-custom',
            children: [
              {
                index: '/weight',
                title: 'Indicators & Weights'
              },
              {
                index: '/wait?t=4',
                title: 'Mix'
              }
            ]
          },
          {
            index: '5',
            title: 'GOAL SETTING',
            icon: 'icon-setting',
            children: [
              {
                index: '/setting',
                title: 'Goal Setting'
              }
            ]
          }
        ]
      }
    },
    methods: {
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
    }
  }
</script>

<style scoped>
  #app {
    background-color: #fed;
    font-family: Roboto;
  }
  .container {
    height: 100%;
  }
  .container-aside {
    float: left;
    height: 100%;
    overflow-y: scroll;
    background-color: #32373d;
  }
  .aside-header {
    height: 50px;
    line-height: 50px;
    padding: 15px;
    text-align: center;
    background-color: #29303a;
  }
  .divide-space {
    height: 50px;
    background-color: #32373d;
  }
  .header-title {
    color: #c5c5c5;
    background-color: #32373d;
    height: 80px;
    line-height: 80px;
    padding: 0 20px;
    position: relative;
    -webkit-box-sizing: border-box;
    cursor: pointer;
    white-space: nowrap;
  }
  .header-title.is-active {
    color: #1ebba6;
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
  .elastic-bar>i {
    padding: 15px;
    height: 50px;
    line-height: 50px;
    color: #eff3f6;
    font-size: 32px;
    cursor: pointer;
    transition: all 300ms linear;
  }
  .elastic-bar>i:hover {
    /*transform: rotateZ(180deg);*/
  }
  .univ-bar {
    display: inline-block;
    vertical-align: top;
    float: right;
    color: #fff;
    height: 80px;
  }
  .univ-bar>div {
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }
  .inform-bar {
    padding: 25px;
  }
  .logo-bar {
    height: 80px;
  }
  .name-bar {
    font-size: 12px;
    min-width: 220px;
    padding: 15px;
  }
  .transition {
    transition: all 300ms linear;
  }
  .icon {
    display: inline-block;
    width: 18px;
    height: 18px;
  }
  .icon-home {
    background: url(./assets/img/udss_03.png) no-repeat;
  }
  .is-active .icon-home {
    background: url(./assets/img/udss_05.png);
  }
  .is-opened .icon-home {
    background: url(./assets/img/udss_05.png);
  }
  .icon-performance {
    background: url(./assets/img/udss_18.png) no-repeat;
  }
  .is-opened .icon-performance {
    background: url(./assets/img/udss_19.png);
  }
  .icon-indicator {
    background: url(./assets/img/udss_26.png) no-repeat;
  }
  .is-opened .icon-indicator {
    background: url(./assets/img/udss_27.png);
  }
  .icon-unit {
    background: url(./assets/img/udss_30.png) no-repeat;
  }
  .is-opened .icon-unit {
    background: url(./assets/img/udss_31.png);
  }
  .icon-custom {
    background: url(./assets/img/udss_43.png) no-repeat;
  }
  .is-opened .icon-custom {
    background: url(./assets/img/udss_44.png);
  }
  .icon-setting {
    background: url(./assets/img/udss_47.png) no-repeat;
  }
  .is-opened .icon-setting {
    background: url(./assets/img/udss_48.png);
  }
  .name-bar .fa {
    font-size: 16px;
  }
</style>
