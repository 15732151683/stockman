/**
 * Created by lonelydawn on 2017-11-20.
 */

import college from './completion/college.json'
import tree from './completion/tree.json'

const flatten = function (array) {
  return array.reduce((sum, value) => {
    return sum.concat(value.children ? flatten(value.children) : value)
  }, [])
}

const clearData = function (tree) {
  for (let level1 of tree) {
    for (let level2 of level1.children) {
      for (let level3 of level2.children) {
        level3.data = 0
        level3.target = 0
      }
    }
  }
}
const setData = function (tree, {id, data, target}) {
  for (let level1 of tree) {
    for (let level2 of level1.children) {
      for (let level3 of level2.children) {
        if (level3.id === id) {
          level3.data = data
          level3.target = target
          return
        }
      }
    }
  }
}

export default {
  // 返回某个学校所有指标
  getCompletionByCollege (cb, row) {
    setTimeout(() => {
      let localTree = window.localStorage.getItem('collegeGoalMap')
      // 读取缓存学校树
      let nowCollege = localTree ? JSON.parse(localTree) : college
      let coll = nowCollege.find(item => item.row === row)
      let researchData = coll.researchData
      let researchTarget = coll.researchTarget
      let target = JSON.parse(JSON.stringify(tree))
      clearData(target)
      researchData.forEach((item, index) => {
        setData(target, {
          id: item.id,
          data: item.value,
          target: researchTarget[index].value
        })
      })
      let sum = 0
      let counter = 0
      target.forEach(level1 => {
        let counter1 = 0
        level1.completion = 0
        level1.noLabel = true
        level1.children.forEach(level2 => {
          let counter2 = 0
          level2.completion = 0
          level2.noLabel = true
          level2.children.forEach(level3 => {
            level3.noLabel = true
            level3.completion = 0
            if ([57, 58, 68, 69, 70, 71, 89, 90].indexOf(level3.id) > -1) {
              let completion = level3.data * 100 / level3.target
              if (!isNaN(completion) && completion !== Infinity) {
                level3.completion = Number((completion).toFixed(0))
                level2.completion += completion
                level1.completion += completion
                sum += completion
                level3.noLabel = false
                level2.noLabel = false
                level1.noLabel = false
                counter1++
                counter2++
                counter++
              }
            }
          })
          level2.completion = Number((counter2 === 0 ? 0 : level2.completion / counter2).toFixed(0))
        })
        level1.completion = Number((counter1 === 0 ? 0 : level1.completion / counter1).toFixed(0))
      })
      let result = {
        name: coll.name,
        type: coll.name.indexOf('Department') > -1 || coll.name.indexOf('Institute') > -1 ? 'dept' : 'fac',
        completion: Number((sum / counter).toFixed(0)),
        target
      }
      cb(result)
    }, 100)
  },
  // 返回所有学校某项指标
  getCompletionByTarget (cb, id) {
    setTimeout(() => {
      let localTree = window.localStorage.getItem('collegeGoalMap')
      let nowCollege = localTree ? JSON.parse(localTree) : college
      let results = nowCollege.map(item => {
        let completion = 0
        let data = item.researchData
        let target = item.researchTarget
        if (id === -1 || id === 3) {
          let sum = 0
          let counter = 0
          data.forEach((term, index) => {
            let cplt = term.value * 100 / target[index].value
            if (!isNaN(cplt) && cplt !== Infinity) {
              sum += cplt
              counter++
            }
          })
          if (counter > 0) {
            completion = Number((sum / counter).toFixed(0))
          }
        } else {
          let theData = data.find(item => item.id === id)
          let theTarget = target.find(item => item.id === id)
          let cplt = theData.value * 100 / theTarget.value
          if (!isNaN(cplt) && cplt !== Infinity) {
            completion = Number((cplt).toFixed(0))
          }
        }
        return {
          type: item.name.indexOf('Department') > -1 || item.name.indexOf('Institute') > -1 ? 'dept' : 'fac',
          name: item.name.replace('Faculty of ', '').replace('Faculty ', '').replace('Department of ', '').replace('Institute of ', ''),
          abridge: item.abridge,
          completion
        }
      })
      cb(results)
    }, 100)
  },
  getTargetTree (cb) {
    setTimeout(() => {
      let result = JSON.parse(JSON.stringify(tree))
      result.forEach(level1 => {
        level1.active = false
        level1.expand = false
        level1.selected = false
        level1.children.forEach(level2 => {
          level2.children.forEach(level3 => {
            level3.active = false
            level3.selected = false
          })
        })
      })
      cb(result)
    }, 100)
  },
  getCollegeTree (cb) {
    setTimeout(() => {
      let result = [{
        active: false,
        expand: false,
        children: college.map(item => {
          item.active = false
          item.selected = false
          return item
        }),
        name: 'Academic unit',
        selected: false
      }]
      cb(result)
    }, 100)
  }
}
