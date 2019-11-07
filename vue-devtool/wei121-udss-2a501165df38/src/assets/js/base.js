/**
 * Created by lonelydawn on 2017-11-20.
 */

(function () {
  setTimeout(function () {
    let menuitem = document.getElementsByClassName('el-menu-item')
    let arr = [menuitem[5], menuitem[6], menuitem[7], menuitem[9]]
    arr.forEach(item => {
      item.style.color = '#c5c5c5'
      item.style.cursor = 'not-allowed'
      item.disabled = true
    })
  }, 300)
})()
