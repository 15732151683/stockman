/**
 * Created by lonelydawn on 2018-04-28.
 */

import { mapGetters } from 'vuex'

export default {
  mounted () { // 进入没有权限模块时, 将重定向到有权限的第一个模块
    this.initModule()
  },
  methods: {
    initModule () {
      this.title = this.module.text || ''
      this.icon = this.module.icon || ''
    }
  },
  computed: {
    ...mapGetters('modules', ['modules']),
    module () {
      return this.modules.find(module => module.href === this.$router.currentRoute.path) || {}
    }
  }
}
