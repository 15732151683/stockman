<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>购物车</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/bookCart.css" />

</head>

<body>
  <!-- 顶部导航栏 -->
  
    <div class="nav">
  <div class="header">
    <div class="left">
      <div class="brand">
        书吧
      </div>
    </div>
    <div class="right">
      <ul>
        <li class="active"><a href="/BookStore/home/index/index">网站首页</a></li>
        <li><a href="">关于我们</a></li>
        <li><a href="/BookStore/home/index/bookList">图书展示</a></li>
        <li><a href="">联系我们</a></li>
        <li><a href="/BookStore/home/index/bookCart">购物车</a></li>
        <li><a href="/BookStore/home/index/addBook">添加图书</a></li>
      </ul>
    </div>
  </div>
</div>
  

  <!-- 中间内容 -->
  
  <div class="wrap">
    <h1>购物车</h1>
    <div class="list">
      <table border="1" cellspacing="0" bordercolor="#ccc">
        <tr>
          <th>图书</th>
          <th>书名</th>
          <th>数量</th>
          <th>单价</th>
          <th>结算</th>
          <th>删除</th>
        </tr>
        <?php if(is_array($books)): $i = 0; $__LIST__ = $books;if( count($__LIST__)==0 ) : echo "" ;else: foreach($__LIST__ as $key=>$book): $mod = ($i % 2 );++$i;?><tr>
            <td>
              <img src=<?php echo ($book["b_imgpath"]); ?> />
            </td>
            <td><?php echo ($book["b_name"]); ?></td>
            <td class="num"><?php echo ($book["num"]); ?></td>
            <td class="price"><?php echo ($book["b_price"]); ?></td>
            <td>
              <button class="pay" index=<?php echo ($book["b_id"]); ?>>付款</button>
            </td>
            <td>
              <button class="del" index=<?php echo ($book["b_id"]); ?>>删除</button>
            </td>
          </tr><?php endforeach; endif; else: echo "" ;endif; ?>
      </table>
    </div>
  </div>


  <!-- 底部 -->
  
      <div class="footer">
  <div class="top">
    <ul>
      <li>免费条款</li>
      <li>隐私保护</li>
      <li>资讯热点</li>
      <li>联系我们</li>
      <li>公司简介</li>
      <li>批发方案</li>
      <li>配送方案</li>
    </ul>
  </div>
  <div class="bottom">
    <p>&copy;2016-2999 SSS版权所有，并保留所有权利</p>
  </div>
</div>
  

  <!-- jq引入 -->
  <script type="text/javascript" src="/BookStore/Public/common/js/jquery.min.js"></script>
  <script type="text/javascript" src="/BookStore/Public/common/js/switchTab.js"></script>
  <!-- 自写js -->
  
  <script>
    $('.del').click(function(){
      let that = $(this)
      $.post('/BookStore/home/cart/delItem', {
        id: that.attr('index'),
        num: 1
      }, function(res){
        if(res.num){
          that.parent().siblings('.num').text(res.num)
        }else {
          that.parent().parent().remove();
        }
      }, 'json')
    })

    $('.pay').click(function(){
      let that = $(this)
      $.post('/BookStore/home/cart/pay', {
        id: that.attr('index'),
        num: that.parent().siblings('.num').text(),
        price: that.parent().siblings('.price').text()
      }, function(res){
        if(res.succeed){
          alert(res.message)
          that.parent().parent().remove();
        }else {
          alert(res.message)
        }
      }, 'json')
    })
 </script>

</body>

</html>