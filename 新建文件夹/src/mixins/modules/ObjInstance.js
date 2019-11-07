
export default {
  methods: {
    clone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    equal (obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    }
  }
}
