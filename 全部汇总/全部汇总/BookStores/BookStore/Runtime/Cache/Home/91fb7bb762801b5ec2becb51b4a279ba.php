<?php if (!defined('THINK_PATH')) exit();?><html lang="zh-CN">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  
  <title>注册</title>

  <link rel="stylesheet" href="/BookStore/Public/common/css/normalize.css">
  
    <link rel="stylesheet" href="/BookStore/Public/common/css/nav.css">
<link rel="stylesheet" href="/BookStore/Public/common/css/footer.css">
  
  
  <link rel="stylesheet" type="text/css" href="/BookStore/Public/css/register.css" />

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
        <li class="active"><a href="index">网站首页</a></li>
        <li><a href="">关于我们</a></li>
        <li><a href="bookList">图书展示</a></li>
        <li><a href="">联系我们</a></li>
        <li><a href="bookCart">购物车</a></li>
        <li><a href="addBook">添加图书</a></li>
      </ul>
    </div>
  </div>
</div>
  

  <!-- 中间内容 -->
  
  <div class="main">
    <h1>注册</h1>
    <input type="text" placeholder="用户名" class="username" />
    <br />
    <input type="password" placeholder="密码" class="password" />
    <br />
    <input type="button" class="btn" value="注册" class="btn" />
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

  <!-- 自写js -->
  
  <script>
    $(function() {

      $('.main input:button').click(function(){
        $.post('/BookStore/home/user/register', {
          'username': $('.main input:text').val(),
          'password': $('.main input:password').val()
        }, function(res){
          if(res.succeed){
            alert('注册成功，赶紧去登录吧！');
            location.href = "/BookStore/home/index/index"
          }else {
            alert(res.message);
          }
        }, 'json')
      })

    })
  </script>

</body>

</html>