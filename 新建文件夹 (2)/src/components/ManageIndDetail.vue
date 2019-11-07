<template>
  <Container :title="title">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import { TogglePage } from '@/mixins'
  import Detail from './partial/ManageIndDetail/detail.vue'
  import Add from './partial/ManageIndDetail/add.vue'
  import Edit from './partial/ManageIndDetail/edit.vue'
  import { Container } from './widgets'
  export default {
    name: 'ManageUser',
    mixins: [ TogglePage ],
    components: {
      Detail,
      Add,
      Edit,
      Container
    },
    created () {
      let arr = JSON.parse(window.sessionStorage.getItem('menuList'))
//      this.title = arr
      var zhibiao = {}
      arr.forEach(item => {
        if (item.id === 12) {
          zhibiao = item.children
        }
      })
      zhibiao.forEach(obj => {
        if (obj.id === 17) {
          zhibiao = obj.children
        }
      })
      zhibiao.forEach(x => {
        if (x.id === 51) {
          this.title = x.title
        }
      })
    },
    data () {
      return {
        title: '',
        view: 'detail'
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
</style>
