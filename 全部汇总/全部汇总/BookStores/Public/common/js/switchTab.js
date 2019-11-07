$(function(){
  let tab = ['index', 'asdkmlfh', 'bookList', 'jasdhgfksa', 'bookCart', 'addBook']
  let path = location.pathname.split('/');
  let eq = tab.indexOf(path[path.length - 1])
  if(eq != -1){
    $('.nav .header .right li').eq(eq).addClass('active').siblings().removeClass('active')
  }
})