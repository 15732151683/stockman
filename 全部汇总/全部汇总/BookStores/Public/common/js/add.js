 function add(index) {
  $.post('/BookStore/home/cart/addItem', {
    id: index,
    num: 1
  }, function (res) {
    if (!res.succeed) {
      alert(res.message)
    }
  }, 'json')
}