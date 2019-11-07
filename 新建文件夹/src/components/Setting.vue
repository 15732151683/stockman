<template>
  <Container :title="title" @downDataA="downCurrentData" @downDataB="downAllData" :showDownload="buttonShow">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import Scheme from './partial/setting/scheme.vue'
  import Write from './partial/setting/write.vue'
  import { Container } from './widgets'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { StandTree, TogglePage } from '@/mixins'
  export default {
    name: 'Setting',
    mixins: [ StandTree, TogglePage ],
    components: {
      Scheme,
      Write,
      Container
    },
    data () {
      return {
        title: '',
        view: Scheme
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.downStatus([false, true, false])
        this.getCheckedInds()
        this.getOrg()
      })
    },
    computed: {
      ...mapGetters('setting', ['nowSchemeId', 'buttonShow'])
    },
    watch: {
      view () {
        // if (this.view === 'Write') {
        //   if (this.nowSchemeId > 0) {
        //     this.showDownload = [true, true, false]
        //   } else {
        //     this.showDownload = []
        //   }
        // } else {
        //   this.showDownload = [true, false, true]
        // }
      }
    },
    methods: {
      ...mapActions('write', ['getOrg']),
      ...mapActions('target', ['getCheckedInds']),
      ...mapMutations('setting', ['downStatus']),
      downCurrentData () {
        this.$refs.comp.downloadDataA()
      },
      downAllData () {
      }
    }
  }
</script>

<style scoped>

</style>
