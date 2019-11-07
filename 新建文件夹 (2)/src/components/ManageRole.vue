<template>
  <Container :title="title">
    <template slot="header"></template>
    <template slot="main">
      <component ref="comp" :is="view" @togglePage="handleTogglePage"></component>
    </template>
  </Container>
</template>

<script>
  import { Container } from './widgets'
  import { TogglePage } from '@/mixins'
  import AddRole from './partial/manageRole/AddRole.vue'
  import EditRole from './partial/manageRole/EditRole.vue'
  import RoleList from './partial/manageRole/RoleList.vue'
  import { mapActions } from 'vuex'
  export default {
    name: 'ManageRole',
    mixins: [ TogglePage ],
    components: {
      Container, AddRole, RoleList, EditRole
    },
    data () {
      return {
        title: '',
        view: 'RoleList'
      }
    },
    mounted () {
      this.getRoleTree()
    },
    methods: {
      ...mapActions('role', ['getRoleTree'])
    }
  }
</script>

<style scoped>

</style>
