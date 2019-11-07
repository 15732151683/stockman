/**
 * Created by lonelydawn on 2017-11-20.
 */

import college from './output/college.json'
import target from './output/target.json'
import ratio from './output/ratio.json'
import table from './output/table.json'

export default {
  getTreeScore (cb) {
    setTimeout(() => {
      let treeScore = []
      college.forEach((cItem, cIndex) => {
        let details = []
        target.forEach(tItem => {
          details.push({
            name: tItem.name,
            value: table[cItem.row][tItem.col],
            rank: table[cItem.row][tItem.rankCol]
          })
        })
        treeScore.push({
          name: cItem.name,
          abridge: cItem.abridge,
          type: cItem.type,
          details: details,
          value: [ratio[cIndex].total, (ratio[cIndex].ratio * 100).toFixed(2), cIndex + 1]
        })
      })
      cb(treeScore)
    }, 100)
  }
}
