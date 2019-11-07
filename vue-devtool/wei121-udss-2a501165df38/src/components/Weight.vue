<template>
  <div class="container">
    <div class="container-header">
      <h2>Indicators & Weights</h2>
    </div>
    <div class="container-body">
      <div class="card-panel">
        <div class="card-wrapper" v-for="card in cards" :key="card.id">
          <img
            class="card-img"
            :class="{'cursor-forbid': !card.active}"
            :src="card.src"
            @click="toggleWeight(card.id)">
        </div>
      </div>
    </div>
    <modal :show.sync="modalShow" :top="20" :width="600" @handClose="modalShow = false">
      <div slot="body" style="text-align: center;">
        <img class="card-opened-img" src="../assets/img/weight_open01.png">
      </div>
    </modal>
  </div>
</template>

<script>
  import modal from './widgets/Modal.vue'
  export default {
    name: 'Weight',
    components: {
      modal
    },
    data () {
      return {
        modalShow: false,
        cards: [
          {
            id: 0,
            active: true,
            src: 'static/img/weight01.png'
          },
          {
            id: 1,
            active: false,
            src: 'static/img/weight02.png'
          },
          {
            id: 2,
            active: false,
            src: 'static/img/weight03.png'
          },
          {
            id: 3,
            active: false,
            src: 'static/img/weight04.png'
          },
          {
            id: 4,
            active: false,
            src: 'static/img/weight05.png'
          }
        ]
      }
    },
    methods: {
      toggleWeight (id) {
        if (id === 0) {
          this.modalShow = true
        }
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
    background-color: #fff;
  }
  .container-header>h2 {
    height: 40px;
    line-height: 40px;
    color: #32373d;
  }
  .container-body {
    height: calc(100% - 100px);
    overflow: hidden;
  }
  .card-panel {
    height: 100%;
    overflow-y: scroll;
  }
  .card-wrapper {
    display: inline-block;
    vertical-align: top;
  }
  .card-img {
    margin: 5px 6px 6px 5px;
    max-width: 200px;
    cursor: pointer;
  }
  .card-opened-img {
    width: 600px;
  }
  .card-img:not(.cursor-forbid):hover {
    /* 6个参数 水平偏移 垂直偏移 模糊距离 尺寸 颜色 内外 */
    margin: 7px 4px 4px 7px;
    box-shadow: 2px 2px 10px 1px #ccc;
  }
</style>
