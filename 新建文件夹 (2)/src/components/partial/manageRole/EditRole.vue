<template>
  <div style="overflow: hidden; height: 100%;">
    <div class="role-header">
      名称&nbsp;&nbsp;<input style="width: 300px;" class="role-input" type="text" placeholder="角色名" v-model="roleName">
      <Button type="primary" size="small" class="button-confirm" :loading="editSaveLoading" @click="confirmUpdate">保存</Button>
      <Button style="float: right; background-color: #4A90E2;" type="primary" size="small" class="button-close" @click="handleReturn">返回</Button>
    </div>
    <div class="target-tree role-tree">
      <Tree
        :data="roleTree"
        show-checkbox
        :default-expand-all="false"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps">
      </Tree>
    </div>
  </div>
</template>

<script>
  import { TogglePage } from '@/mixins'
  import { Tree, Button } from 'element-ui'
  import { mapGetters, mapMutations, mapActions } from 'vuex'
  export default {
    name: 'AddRole',
    mixins: [ TogglePage ],
    components: {
      Tree, Button
    },
    data () {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        roleName: '',
        editSaveLoading: false
      }
    },
    mounted () {
    },
    computed: {
      ...mapGetters('role', ['roleTree', 'roleDetail', 'nowRole'])
    },
    methods: {
      ...mapMutations('role', ['setRoleDetail']),
      ...mapActions('role', ['updateRole']),
      confirmUpdate () {
        let checked = this.$refs.tree.getCheckedNodes()
        let halfChecked = this.$refs.tree.getHalfCheckedNodes()
        let arr = checked.concat(...halfChecked)
        arr = arr.map(node => {
          return {
            permission_id: node.id,
            permission_type_id: node.permission_type_id
          }
        })
        let obj = {
          name: this.roleName,
          id: this.nowRole.role_id,
          permission: arr
        }
        new Promise((resolve, reject) => {
          this.editSaveLoading = true
          this.updateRole({resolve, reject, payload: obj})
        }).then(() => {
          this.editSaveLoading = false
        }).catch(() => {
          this.editSaveLoading = false
        })
      },
      handleReturn () {
        this.togglePage('RoleList')
      }
    },
    beforeDestroy () {
      this.setRoleDetail('')
    },
    watch: {
      roleDetail () {
        if (this.roleDetail) {
          let arr = this.roleDetail.filter(node => node.permission_type_id === 2).map(node => node.permission_id)
          this.$refs.tree.setCheckedKeys(arr)
          this.roleName = this.nowRole.role_name
        }
      }
    }
  }
</script>

<style scoped>
  .role-header {
    font-size: 14px;
    color: #4E4E4E;
  }
  .role-input{
    outline: none;
    border: solid 1px #EAEAEA;
    border-radius: 3px;
    line-height: 34px;
    text-indent: 10px;
    margin-right: 50px;
    color: #4E4E4E;
  }
  .role-tree {
    margin-top: 20px;
    height: calc(100% - 80px);
    overflow-y: auto;
  }
</style>
