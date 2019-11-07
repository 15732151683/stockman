/**
 * Created by lonelydawn on 2018-05-10.
 */

export default {
  methods: {
    serialize (tree, level, parent) { // 注意，原始数据结构中应该不存在这些字段: counter, level, parent
      tree.forEach(node => {
        Object.assign(node, {
          counter: ++this.counter,
          parent: parent !== undefined ? parent : -1,
          level
        })
        if (node.children && node.children.length) {
          this.serialize(node.children, level + 1, this.counter)
        }
      })
    },
    getLevelRecord (nodes) {
      let levelMap = []
      let levelRecord = []
      nodes.forEach(node => { // 收集所有叶子级别
        levelMap.indexOf(node.level) === -1 && levelMap.push(node.level)
      })
      levelMap.sort((a, b) => a < b) // 从大到小排序
      levelMap.forEach(level => { // 将不同级别的叶子归类
        levelRecord.push({
          level,
          nodes: nodes.filter(node => node.level === level && node.is_leaf)
        })
      })
      return levelRecord
    },
    getTrueTree (tree, leaves) {
      let fNodes = this.flatten(tree)
      let destNodes = fNodes.filter(node => leaves.indexOf(node.id) > -1) // 找到目标节点
      let levelRecord = this.getLevelRecord(destNodes) // 获取节点分类数组
      let level = levelRecord[0] ? levelRecord[0].level : -1 // 初始化层级
      let trueTree = [] // 初始化节点
      while (level > 1) { // level > 1, 未达到根节点, 继续循环
        let outer = []
        trueTree = trueTree.concat((levelRecord.find(record => record.level === level) || {}).nodes || [])
        trueTree.forEach(trueNode => {
          let fNode = fNodes.find(fNode => fNode.id === trueNode.pid)
          let parent = fNode ? this.clone(fNode) : {}
          if (!fNode) {
            return
          }
          let miracle = outer.find(item => item.id === parent.id)
          miracle ? miracle.children.push(trueNode) : (() => {
            parent.children = [trueNode]
            outer.push(parent)
          })()
        })
        trueTree = outer
        level--
      }
      return trueTree
    },
    flatten (tree) {
      return tree.reduce((arr, current) => {
        arr.push(current)
        if (current.children && current.children.length) {
          this.flatten(current.children).forEach(node => {
            arr.push(node)
          })
        }
        return arr
      }, [])
    }
  }
}
