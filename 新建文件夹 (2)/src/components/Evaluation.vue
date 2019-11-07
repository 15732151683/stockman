<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="showDownload">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import Scheme from './partial/evaluation/scheme.vue'
  import Write from './partial/evaluation/write.vue'
  import Edit from './partial/evaluation/edit.vue'
  import { Container } from './widgets'
  import { StandTree, TogglePage } from '@/mixins'
  import { mapActions } from 'vuex'
  export default {
    name: 'Evaluation',
    mixins: [ StandTree, TogglePage ],
    components: {
      Scheme,
      Write,
      Edit,
      Container
    },
    data () {
      return {
        title: '',
        view: 'scheme',
        showDownload: [true, false, true]
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.getCollege()
      })
    },
    methods: {
      ...mapActions('evaluation', ['getCollege']),
      resize () {
      },
      downCurrentData () {
        this.$refs.comp.downloadDataA()
      },
      downAllData () {
        this.$refs.comp.downloadDataB()
      }
    },
    watch: {
      view () {
        if (this.view === 'Edit') {
          this.showDownload = [true, true, true]
        } else {
          this.showDownload = [true, false, true]
        }
      }
    }
  }
</script>

<style scoped>

</style>
