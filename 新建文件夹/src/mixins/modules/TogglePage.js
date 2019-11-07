
export default {
  methods: {
    togglePage (view, subTitle) {
      this.$emit('togglePage', {
        view,
        subTitle
      })
    },
    handleTogglePage ({view, subTitle}) {
      this.view = view
      this.subTitle = subTitle
    }
  }
}
