<template>
    <div class="container">
      <header>
        <div class="container-header">
          <div class="download-button" v-show="showDownload[0]">
            <Button :loading="true" size="small" v-show="loadingStatus" style="width: 100%;" class="button-loading">下载中</Button>
            <div class="download-box" v-show="!loadingStatus">
              <i class="el-icon-download"></i>数据导出
            </div>
            <div class="download-menu" v-show="!loadingStatus" v-if="showDownload[1] || showDownload[2]">
              <div v-show="showDownload[1]" class="download-menu-item" @click="downCurrentData">下载当前页面数据</div>
              <div v-show="showDownload[2]" class="download-menu-item" @click="downAllData">下载模块全部数据</div>
            </div>
          </div>
          <h2>{{ titles }}</h2>
          <slot name="header"></slot>
          <div style="border-bottom: solid 1px #F6F8F9; width: 100%; overflow: hidden; margin-top: 10px;"></div>
        </div>
      </header>
      <main>
        <div class="container-body">
          <slot name="main"></slot>
        </div>
      </main>
    </div>
</template>

<script>
  import { Button } from 'element-ui'
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    name: 'Container',
    data () {
      return {
        titles: ''
      }
    },
    components: {
      Button
    },
    props: {
      title: {
        required: true,
        type: String
      },
      showDownload: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      ...mapGetters('config', ['loadingStatus'])
    },
    methods: {
      ...mapMutations('config', ['setLoading']),
      downCurrentData () {
        this.$emit('downDataA')
        this.setLoading(true)
      },
      downAllData () {
        this.$emit('downDataB')
        this.setLoading(true)
      }
    },
    mounted () {
      this.titles = this.$route.meta.title
    },
    watch: {
      title () {
        if (this.title) {
          this.titles = this.title
        } else {
          this.titles = this.$route.meta.title
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    margin: 15px;
    height: calc(100% - 60px);
    padding: 15px 45px;
    cursor: default;
    /*user-select: none;*/
    background-color: #fff;
    overflow: hidden;
  }
  .container-header{
    padding-bottom: 10px;
  }
  .container-header>h2 {
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #32373d;
    overflow: hidden;
  }
  .download-button{
    text-align: center;
    float: right;
    cursor: pointer;
    position: relative;
    font-size: 14px;
    display: block;
    width: 120px;
    height: 28px;
    line-height: 28px;
    color: #4A4A4A;
  }
  .download-box {
    width: 100%;
    height: 100%;
    border: solid 1px #EAEAEA;
    overflow: hidden;
  }
  .download-button i{
    font-size: 16px;
    font-weight: bolder;
  }
  .download-menu{
    position: absolute;
    width: 100%;
    background-color: #FFFFFF;
    left: 0;
    top: 28px;
    z-index: 500;
    border: solid 1px #F2F2F2;
    padding: 10px 0px;
    display: none;
  }
  .download-box:hover +.download-menu{
    display: block;
  }
  .download-menu:hover{
    display: block;
  }
  .download-menu-item{
    font-size: 12px;
  }
  .download-menu-item:hover{
    background-color: #F8F8F8;
    color: #3090E9;
  }
  .container main {
    height: calc(100% - 60px);
  }
  .container-body{
    padding-bottom: 40px;
  }
  .container-body {
    background-color: #fff;
    height: 100%;
    overflow: hidden;
  }
</style>
