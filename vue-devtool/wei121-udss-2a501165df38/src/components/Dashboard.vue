<template>
  <div class="container">
    <div class="container-header">
      <h2>Dashboard</h2>
    </div>
    <div class="container-body">
      <el-row>
        <el-col :span="8" v-for="card in cards" :key="card.id" class="img-col">
          <div class="img-wrapper" @click="redirect(card)" :class="{'img-active': card.active, 'cursor-forbid': !card.active}">
              <img class="image" :src="card.path"/>
            <br/>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Dashboard',
    data () {
      return {
        cards: [
          {
            id: 0,
            hover: false,
            path: 'static/img/dashboard01.png',
            viewPath: '/completion',
            active: true
          },
          {
            id: 1,
            hover: false,
            path: 'static/img/dashboard02.png',
            viewPath: '/output',
            active: true
          },
          {
            id: 2,
            hover: false,
            path: 'static/img/dashboard03.png',
            viewPath: '/outIn',
            active: true
          },
          {
            id: 3,
            hover: false,
            path: 'static/img/dashboard04.png',
            viewPath: '/dashboard',
            active: false
          },
          {
            id: 4,
            hover: false,
            path: 'static/img/dashboard05.png',
            viewPath: '/perCapita',
            active: true
          },
          {
            id: 5,
            hover: false,
            path: 'static/img/dashboard06.png',
            viewPath: '/dashboard',
            active: false
          }
        ]
      }
    },
    methods: {
      redirect (card) {
        this.$router.push({path: card.viewPath})
      },
      toggleOver (card) {
        card.hover = true
      },
      toggleOut (card) {
        card.hover = false
      },
      resize () {}
    }
  }
</script>

<style scoped>
  .container {
    margin: 15px;
    height: calc(100% - 30px);
    cursor: default;
    user-select: none;
  }
  .container-header,
  .container-body{
    padding: 15px;
  }
  .container-header>h2 {
    height: 40px;
    line-height: 40px;
    color: #32373d;
  }
  .container-body {
    height: calc(100% - 100px);
    overflow: scroll;
  }
  .img-col {
    padding: 5px;
  }
  .img-wrapper {
    padding: 6px;
    cursor: pointer;
    border-radius: 5px;
    background-color: #fff;
    border: 1px solid #eee;
  }
  .img-active:hover {
    box-shadow: 0 0 10px 1px #ccc;
    padding: 7px 5px 5px 7px;
  }
  .image {
    width: 100%;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-300px);
  }
</style>
